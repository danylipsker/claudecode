/* HYPER-MATH · content/complex.js — complex numbers: arithmetic, the complex plane,
 * polar form, Euler's formula, De Moivre's theorem and roots, phasors.
 * Simulations in sims/vectors-linalg-complex.js. */
Hyper.add(

{
  id: 'complex-numbers', parent: 'complex-topic', title: 'Complex numbers', level: 2,
  short: 'Numbers of the form a + bi, where i² = −1. They make every polynomial equation solvable and turn out to describe rotations and waves.',
  keywords: ['complex number', 'imaginary unit', 'i', 'j', 'imaginary number', 'real part', 'imaginary part', 'conjugate', 'modulus', 'square root of minus one', 'fundamental theorem of algebra'],
  prereq: ['number-systems', 'quadratic-equations'],
  related: ['complex-plane', 'polar-form', 'eulers-formula', 'eigenvalues', 'polynomials', 'physics:wavefunction'],
  body: `
### A number whose square is −1
The equation $x^2 = -1$ has no solution among the real numbers: a square is never negative. So invent one. Let $i$ be a new number with

$$i^2 = -1$$

and let it combine with ordinary numbers by the usual rules of algebra. The result is the **complex numbers**, each of the form

$$z = a + bi, \\qquad a, b \\text{ real}$$

$a$ is the **real part**, $\\operatorname{Re} z$, and $b$ the **imaginary part**, $\\operatorname{Im} z$. The real numbers are the complex numbers with $b = 0$; numbers such as $3i$, with $a = 0$, are called imaginary. Engineers write $j$ instead of $i$, because $i$ already stands for electric current.

### Arithmetic
Add and subtract part by part: $(2 + 3i) + (1 - 4i) = 3 - i$. To multiply, expand the brackets as usual and replace $i^2$ by $-1$:

$$(2 + 3i)(1 - 4i) = 2 - 8i + 3i - 12i^2 = 14 - 5i$$

In general $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$. The powers of $i$ repeat every four steps: $i, -1, -i, 1, i, \\dots$

### The conjugate, and division
The **conjugate** of $z = a + bi$ is $\\bar z = a - bi$. A number times its conjugate is real and never negative:

$$z\\bar z = (a + bi)(a - bi) = a^2 + b^2 = |z|^2$$

where $|z| = \\sqrt{a^2 + b^2}$ is the **modulus**, the size of $z$. That makes division possible: multiply the top and the bottom by the conjugate of the bottom,

$$\\frac{3 + 4i}{1 - 2i} = \\frac{(3 + 4i)(1 + 2i)}{(1 - 2i)(1 + 2i)} = \\frac{-5 + 10i}{5} = -1 + 2i$$

### Every equation has its roots
With complex numbers every [[quadratic-equations|quadratic]] can be solved — a negative discriminant simply has an imaginary square root. For $x^2 - 4x + 13 = 0$,

$$x = \\frac{4 \\pm \\sqrt{16 - 52}}{2} = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i$$

For polynomials with real coefficients, non-real roots always come in conjugate pairs like this. Much more is true: the **fundamental theorem of algebra** says that every polynomial of degree $n$ has exactly $n$ complex roots, counted with multiplicity. No further kinds of number are ever needed to solve polynomial equations.

One thing is lost: complex numbers cannot be put in order. "$i > 0$" and "$2 + i < 3$" have no sensible meaning.

### Why they matter
What began as a trick turned out to describe the world. Multiplying by a complex number rotates and scales the [[complex-plane|complex plane]], and [[eulers-formula|Euler's formula]] links complex exponentials to sines and cosines, so every oscillation, wave and alternating current is handled most easily with complex numbers ([[phasors]]). In quantum mechanics they are not even optional: the [[physics:wavefunction|wavefunction]] is complex at its core. The [[eigenvalues]] of a rotation are complex, and the Fourier analysis behind audio compression, image processing and MRI scanners is done in complex arithmetic.
`,
  ideas: [
    'i is defined by i² = −1; complex numbers are a + bi with a and b real.',
    'Add part by part; multiply out and replace i² by −1.',
    'The conjugate of a + bi is a − bi, and z times its conjugate is a² + b², a real number.',
    'Divide by multiplying the top and bottom by the conjugate of the bottom.',
    'Every polynomial of degree n has n complex roots.'
  ],
  pitfalls: [
    '√(−4) · √(−9) = √36 = 6 — The rule √a · √b = √(ab) fails for negative numbers: the left side is 2i · 3i = −6.',
    'Imaginary numbers do not really exist — They are as well defined as negative numbers or fractions, and far more useful than their name suggests.',
    'Complex numbers can be compared like real ones — There is no ordering: "3i > 2" is meaningless. Only moduli, which are real, can be compared.'
  ],
  formulas: [
    {
      name: 'Real part of a product',
      expr: 'p = a*c - b*d', tex: 'p = ac - bd',
      vars: {
        p: { name: 'real part of (a + bi)(c + di)', signed: true },
        a: { name: 'real part of z', value: 2, signed: true },
        b: { name: 'imaginary part of z', value: 3, signed: true },
        c: { name: 'real part of w', value: 1, signed: true },
        d: { name: 'imaginary part of w', value: -4, signed: true }
      },
      note: 'The $-bd$ comes from $bi \\cdot di = bd\\,i^2 = -bd$.'
    },
    {
      name: 'Imaginary part of a product',
      expr: 'q = a*d + b*c', tex: 'q = ad + bc',
      vars: {
        q: { name: 'imaginary part of (a + bi)(c + di)', signed: true },
        a: { name: 'real part of z', value: 2, signed: true },
        b: { name: 'imaginary part of z', value: 3, signed: true },
        c: { name: 'real part of w', value: 1, signed: true },
        d: { name: 'imaginary part of w', value: -4, signed: true }
      }
    },
    {
      name: 'Imaginary part of the roots of x² + bx + c = 0',
      expr: 'v = sqrt(4*c - b^2)/2', tex: 'v = \\frac{\\sqrt{4c - b^2}}{2}',
      vars: {
        v: { name: 'imaginary part of the roots (±)' },
        b: { name: 'coefficient of x', value: -4, signed: true },
        c: { name: 'constant term', value: 13, signed: true }
      },
      note: 'When $b^2 < 4c$ the roots are $-b/2 \\pm vi$, a conjugate pair. For $b^2 > 4c$ there is no imaginary part: the roots are real.'
    }
  ],
  examples: [
    {
      title: 'Multiplying and dividing',
      q: 'For $z = 2 + 3i$ and $w = 1 - 4i$, find $zw$ and $z/w$.',
      steps: [
        '$zw = 2 - 8i + 3i - 12i^2 = 2 - 5i + 12 = 14 - 5i$.',
        'For the quotient, multiply top and bottom by $\\bar w = 1 + 4i$: the bottom becomes $1^2 + 4^2 = 17$.',
        'The top: $(2 + 3i)(1 + 4i) = 2 + 8i + 3i + 12i^2 = -10 + 11i$.',
        'So $z/w = (-10 + 11i)/17 = -0.588 + 0.647i$. Check: $w \\cdot (z/w)$ should give back $z$.'
      ],
      a: 'zw = 14 − 5i; z/w = (−10 + 11i)/17.'
    },
    {
      title: 'A quadratic with no real roots',
      q: 'Solve $x^2 - 4x + 13 = 0$ and check one root.',
      steps: [
        'Discriminant: $16 - 52 = -36$, and $\\sqrt{-36} = 6i$.',
        '$x = (4 \\pm 6i)/2 = 2 \\pm 3i$: a conjugate pair.',
        'Check $x = 2 + 3i$: $x^2 = 4 + 12i - 9 = -5 + 12i$, and $-4x = -8 - 12i$.',
        'Sum: $-5 + 12i - 8 - 12i + 13 = 0$.'
      ],
      a: 'x = 2 + 3i and x = 2 − 3i'
    }
  ],
  quiz: [
    { q: '$i^{45}$ equals…', choices: ['1', '$i$', '−1', '$-i$'], a: 1,
      why: 'The powers of $i$ repeat every 4. $45 = 4 \\times 11 + 1$, so $i^{45} = i^1 = i$.' },
    { q: '$(3 + 2i)(3 - 2i)$ equals…', choices: ['5', '13', '$9 + 4i$', '$5 - 12i$'], a: 1,
      why: 'A number times its conjugate: $3^2 + 2^2 = 13$. The imaginary terms cancel.' },
    { q: 'A quadratic with real coefficients can have one real root and one non-real root.', a: false,
      why: 'Non-real roots of a real polynomial come in conjugate pairs, so a quadratic has either two real roots or two non-real ones.' },
    { q: 'Write the real part of $(x + i)^2$, for real $x$.', answer: 'x^2 - 1', vars: ['x'],
      why: '$(x + i)^2 = x^2 + 2xi + i^2 = (x^2 - 1) + 2x\\,i$.' },
    { q: '$\\sqrt{-9}\\cdot\\sqrt{-4}$ equals…', choices: ['6', '−6', '$6i$', '$-6i$'], a: 1,
      why: '$\\sqrt{-9} = 3i$ and $\\sqrt{-4} = 2i$, so the product is $6i^2 = -6$. Combining them first as $\\sqrt{36}$ gives the wrong sign.' }
  ],
  problems: [
    { q: 'Find the imaginary part of $\\dfrac{1 + 2i}{3 - i}$.', answer: 0.7, tol: 0.01,
      steps: ['Multiply top and bottom by $3 + i$: the bottom is $9 + 1 = 10$.', 'Top: $(1 + 2i)(3 + i) = 3 + i + 6i + 2i^2 = 1 + 7i$.', 'So the quotient is $0.1 + 0.7i$: imaginary part 0.7.'] }
  ],
  applications: [
    'Electrical engineering: impedance and AC circuit analysis.',
    'Quantum mechanics, whose wavefunctions are complex.',
    'Signal processing: Fourier transforms of audio, images and radio signals.',
    'Control engineering: the stability of a system is read from complex roots.'
  ],
  history: 'Complex numbers forced their way in through the cubic equation. Gerolamo Cardano\'s formula of 1545 sometimes needs square roots of negative numbers even when the answer is real, and Rafael Bombelli showed in 1572 how to calculate with them. Euler introduced the symbol $i$ in 1777, and Gauss, who proved the fundamental theorem of algebra, gave them the name "complex".',
  sim: { id: 'vlc-complex-plane', params: { mode: 'conj' } }
},

{
  id: 'complex-plane', parent: 'complex-topic', title: 'The complex plane', level: 2,
  short: 'Draw a + bi as the point (a, b): real numbers along one axis, imaginary along the other. Addition becomes vector addition, the modulus becomes distance, and multiplying by i turns the plane a quarter turn.',
  keywords: ['complex plane', 'Argand diagram', 'real axis', 'imaginary axis', 'modulus', 'absolute value', 'distance', 'conjugate', 'reflection', 'rotation by i', 'unit circle'],
  prereq: ['complex-numbers', 'coordinate-geometry', 'vector-addition'],
  related: ['polar-form', 'eulers-formula', 'de-moivre', 'vectors', 'linear-transformations'],
  body: `
### Numbers as points
A complex number $a + bi$ carries two real numbers, so it can be drawn as the point $(a, b)$, or as the arrow from the origin to that point. Real numbers lie along the horizontal **real axis**, imaginary numbers along the vertical **imaginary axis**, and $i$ sits one unit above 0. This picture is the **complex plane**, or Argand diagram.

### Adding is vector addition
Complex numbers add part by part, exactly like the [[vector-addition|vectors]] $(a, b)$: the sum $z + w$ is the fourth corner of the parallelogram on $z$ and $w$. The difference $z - w$ is the arrow from $w$ to $z$, so $|z - w|$ is the **distance** between the two points.

### Size and mirror image
The **modulus** $|z| = \\sqrt{a^2 + b^2}$ is the distance from 0 — the absolute value of the real numbers, extended to the plane. $|3 + 4i| = 5$, and the numbers with $|z| = 1$ form the **unit circle**. Distances obey the triangle inequality, $|z + w| \\le |z| + |w|$.

The **conjugate** $\\bar z = a - bi$ is the mirror image of $z$ in the real axis, and $z\\bar z = |z|^2$.

Equations become shapes:

- $|z - 2i| = 1$ is the circle of radius 1 centred at $2i$;
- $|z - 1| = |z + 1|$ says $z$ is equally far from 1 and from $-1$: it is the imaginary axis;
- $\\operatorname{Re} z > 0$ is the right half of the plane.

### Multiplying by i is a quarter turn
Here the plane shows something vectors on their own do not. Multiply $z = a + bi$ by $i$:

$$i(a + bi) = -b + ai$$

The point $(a, b)$ moves to $(-b, a)$: a **rotation by 90°** anticlockwise about the origin. Multiplying by $i$ twice turns by 180°, which sends every $z$ to $-z$ — and that is exactly why $i^2 = -1$. The mysterious square root of $-1$ is simply a quarter turn.

Multiplying by a real number $k > 0$ scales the plane by $k$; multiplying by a general complex number does both at once, rotating by its angle and scaling by its modulus. That makes the [[polar-form|polar form]] — length and angle — the natural description for multiplication, while the rectangular form $a + bi$ suits addition.

> [!tip] In the simulation choose **Product**, place $w$ exactly at $i$ (one unit straight up), and drag $z$ around: $zw$ always sits a quarter turn ahead of $z$, at the same distance from 0.

### What the plane adds to vectors
The complex plane is the ordinary plane with one extra operation: a multiplication in which lengths multiply and angles add. That single fact turns rotations into arithmetic. It is why complex numbers are the natural language for anything that rotates or oscillates in two dimensions — and why a rotation of the plane, which has no real [[eigenvalues|eigenvalues]], has complex ones.
`,
  ideas: [
    'a + bi is drawn as the point (a, b): real axis across, imaginary axis up.',
    'Complex addition is vector addition, the parallelogram rule.',
    '|z| is the distance from 0, and |z − w| the distance between z and w.',
    'The conjugate is the reflection in the real axis.',
    'Multiplying by i rotates the plane by 90° — which is why i² = −1.'
  ],
  pitfalls: [
    'The imaginary axis holds imaginary points that are somehow unreal — Every point of the plane is a perfectly good complex number; b is an ordinary real number giving its height.',
    'The conjugate reflects in the imaginary axis — It reflects in the real axis: a + bi ↦ a − bi keeps the real part.',
    '|a + bi| = a + b — The modulus is √(a² + b²), a distance by Pythagoras.'
  ],
  formulas: [
    {
      name: 'Modulus (distance from 0)',
      expr: 'r = sqrt(a^2 + b^2)', tex: 'r = |z| = \\sqrt{a^2 + b^2}',
      vars: {
        r: { name: 'modulus |z|' },
        a: { name: 'real part', value: 3, signed: true },
        b: { name: 'imaginary part', value: 4, signed: true }
      }
    },
    {
      name: 'Distance between two complex numbers',
      expr: 'd = sqrt((a1 - a2)^2 + (b1 - b2)^2)', tex: 'd = |z_1 - z_2| = \\sqrt{(a_1 - a_2)^2 + (b_1 - b_2)^2}',
      vars: {
        d: { name: 'distance |z₁ − z₂|' },
        a1: { name: 'real part of z₁', tex: 'a_1', value: 3, signed: true },
        b1: { name: 'imaginary part of z₁', tex: 'b_1', value: 4, signed: true },
        a2: { name: 'real part of z₂', tex: 'a_2', value: -1, signed: true },
        b2: { name: 'imaginary part of z₂', tex: 'b_2', value: 1, signed: true }
      },
      practice: { unknowns: ['d'] }
    }
  ],
  examples: [
    {
      title: 'Plotting and measuring',
      q: 'For $z = 3 + 4i$ and $w = -1 + i$, find $z + w$, $z - w$, the distance between $z$ and $w$, and $\\bar z$.',
      steps: [
        '$z + w = 2 + 5i$: the far corner of the parallelogram on $z$ and $w$.',
        '$z - w = 4 + 3i$: the arrow from $w$ to $z$.',
        'Distance: $|z - w| = \\sqrt{16 + 9} = 5$.',
        '$\\bar z = 3 - 4i$, the reflection of $z$ in the real axis; $|z| = |\\bar z| = 5$.'
      ],
      a: 'z + w = 2 + 5i, z − w = 4 + 3i, distance 5, z̄ = 3 − 4i.'
    },
    {
      title: 'Four quarter turns',
      q: 'Start with $z = 3 + i$ and multiply by $i$ four times. What shape do the points make?',
      steps: [
        '$iz = 3i + i^2 = -1 + 3i$.',
        '$i^2 z = i(-1 + 3i) = -3 - i$, and $i^3 z = i(-3 - i) = 1 - 3i$.',
        '$i^4 z = i(1 - 3i) = 3 + i$: back where we started, since $i^4 = 1$.',
        'All four points are at distance $\\sqrt{10}$ from 0 and a quarter turn apart: the corners of a square centred at the origin.'
      ],
      a: 'The corners of a square: 3 + i, −1 + 3i, −3 − i, 1 − 3i.'
    }
  ],
  quiz: [
    { q: 'In the complex plane, multiplying by $i$…', choices: ['reflects in the real axis', 'rotates by 90° anticlockwise about 0', 'doubles the distance from 0', 'moves every point one unit up'], a: 1,
      why: '$i(a + bi) = -b + ai$: the point $(a, b)$ goes to $(-b, a)$, a quarter turn. Moving one unit up would be adding $i$.' },
    { q: 'The numbers $z$ with $|z - 2| = 3$ form…', choices: ['a line', 'the circle with centre 2 and radius 3', 'the circle with centre −2 and radius 3', 'a filled disc'], a: 1,
      why: '$|z - 2|$ is the distance from $z$ to the point 2; fixing it at 3 gives a circle round 2.' },
    { q: 'The conjugate $\\bar z$ is the reflection of $z$ in the imaginary axis.', a: false,
      why: 'Changing $a + bi$ to $a - bi$ flips the sign of the height: that is a reflection in the real (horizontal) axis.' },
    { q: 'Write $|x + 2i|^2$ for real $x$.', answer: 'x^2 + 4', vars: ['x'],
      why: 'The squared modulus is the real part squared plus the imaginary part squared: $x^2 + 2^2$.' },
    { q: 'Which of these complex numbers is closest to 0?', choices: ['$3 - 4i$', '$-4 + 2i$', '$1 + 4i$', '$-2 - 3i$'], a: 3,
      why: 'Compare the squared moduli: 25, 20, 17 and 13. The smallest is $|-2 - 3i|^2 = 13$.' }
  ],
  problems: [
    { q: 'How far apart are $1 + i$ and $4 - 3i$ in the complex plane?', answer: 5, tol: 0.001,
      steps: ['$(1 + i) - (4 - 3i) = -3 + 4i$.', '$|-3 + 4i| = \\sqrt{9 + 16} = 5$.'] }
  ],
  applications: [
    'Visualising AC voltages and currents as arrows (phasors).',
    'Two-dimensional geometry and graphics: rotations and similarity transformations as complex multiplication.',
    'Fluid flow and electrostatics in the plane, solved with functions of a complex variable.',
    'Fractals such as the Mandelbrot set, drawn point by point in the complex plane.'
  ],
  history: 'The idea of drawing complex numbers as points occurred to the Norwegian-Danish surveyor Caspar Wessel (1799), to the Swiss bookkeeper Jean-Robert Argand (1806) and to Gauss, and it did much to make complex numbers respectable.',
  sim: { id: 'vlc-complex-plane', params: { mode: 'add' } }
},

{
  id: 'polar-form', parent: 'complex-topic', title: 'Polar form: modulus and argument', level: 2,
  short: 'Write a complex number by its distance r from 0 and its angle θ: z = r(cos θ + i sin θ). Then multiplying means multiplying the lengths and adding the angles.',
  keywords: ['polar form', 'modulus', 'argument', 'arg', 'principal argument', 'cis', 'modulus-argument form', 'angle', 'multiplication rotates', 'atan2', 'r∠θ'],
  prereq: ['complex-plane', 'unit-circle', 'polar-coordinates'],
  related: ['eulers-formula', 'de-moivre', 'phasors', 'sum-and-difference', 'vector-components'],
  body: `
### Distance and direction
Any point of the plane can be located by how far it is from the origin and in which direction. For a complex number $z = a + bi$ these are its **modulus** $r = |z|$ and its **argument** $\\theta = \\arg z$, the angle measured from the positive real axis. From the right triangle,

$$a = r\\cos\\theta, \\qquad b = r\\sin\\theta, \\qquad z = r(\\cos\\theta + i\\sin\\theta)$$

This is the **polar form** (or modulus–argument form), written $r\\angle\\theta$ by engineers and sometimes $r\\operatorname{cis}\\theta$; with [[eulers-formula|Euler's formula]] it becomes $re^{i\\theta}$. It is the same idea as [[polar-coordinates|polar coordinates]].

### Finding the argument
$r = \\sqrt{a^2 + b^2}$ is straightforward; the angle needs care. $\\tan\\theta = b/a$ cannot tell opposite quadrants apart, so look at the signs of $a$ and $b$, or use $\\operatorname{atan2}(b, a)$. The argument is also only defined up to whole turns — $\\theta$, $\\theta + 360°$ and $\\theta - 360°$ are the same direction — so a **principal value** between $-180°$ and $180°$ is usually chosen. For $z = -1 - i$, $r = \\sqrt 2$, and although $\\arctan 1 = 45°$ the point lies in the third quadrant, so $\\arg z = -135°$. The number 0 has no argument at all.

### Multiplying: lengths multiply, angles add
Multiply two numbers in polar form and use the angle-sum formulas of [[sum-and-difference|trigonometry]]:

$$r_1(\\cos\\theta_1 + i\\sin\\theta_1)\\cdot r_2(\\cos\\theta_2 + i\\sin\\theta_2) = r_1r_2\\big(\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\big)$$

**Lengths multiply and angles add.** Division divides the lengths and subtracts the angles, and the reciprocal $1/z$ has length $1/r$ and angle $-\\theta$. So multiplying by a complex number *is* a rotation combined with a scaling: by $i = 1\\angle 90°$, a quarter turn; by $2\\angle 30°$, a turn of 30° and a doubling.

Example: $(1 + i)(\\sqrt 3 + i)$. In polar form this is $\\sqrt 2\\angle 45° \\times 2\\angle 30° = 2\\sqrt 2\\angle 75°$. Multiplying out instead gives $(\\sqrt 3 - 1) + (\\sqrt 3 + 1)i = 0.732 + 2.732i$, and indeed $2\\sqrt 2\\cos 75° = 0.732$ and $2\\sqrt 2\\sin 75° = 2.732$.

### Which form when?
Addition and subtraction are easiest in the rectangular form $a + bi$; multiplication, division, powers and roots are easiest in polar form ([[de-moivre|De Moivre's theorem]]). Converting between the two is routine, and practitioners switch freely. Electrical engineers describe a voltage by its size and phase, such as $230\\angle{-30°}$ volts ([[phasors]]).

> [!tip] In the simulation's **Product** mode, the arcs show the arguments of $z$ and $w$ and the angle of $zw$. Drag either point and watch the angles add while the lengths multiply.
`,
  ideas: [
    'r = |z| is the distance from 0; θ = arg z is the angle from the positive real axis.',
    'a = r cos θ, b = r sin θ, so z = r(cos θ + i sin θ).',
    'Choose the quadrant of θ from the signs of a and b; the principal value lies in (−180°, 180°].',
    'Multiplying multiplies moduli and adds arguments; dividing divides and subtracts.',
    'Rectangular form suits addition; polar form suits multiplication, powers and roots.'
  ],
  pitfalls: [
    'arg z = arctan(b/a) always — Only when a > 0. For −1 − i the arctangent gives 45°, but the argument is −135°.',
    'The argument is unique — Angles differing by whole turns describe the same number; only the principal value is unique.',
    'Moduli add when numbers multiply — Moduli multiply: |zw| = |z||w|. It is the arguments that add.'
  ],
  derivation: {
    title: 'Why the angles add',
    steps: [
      { text: 'Multiply out the product of two unit-length numbers:', tex: '(\\cos\\alpha + i\\sin\\alpha)(\\cos\\beta + i\\sin\\beta) = (\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta) + i(\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta)' },
      { text: 'Recognise the angle-sum formulas in both brackets:', tex: '= \\cos(\\alpha + \\beta) + i\\sin(\\alpha + \\beta)' },
      { text: 'The moduli are just numbers that multiply alongside, so', tex: 'r_1\\angle\\alpha \\cdot r_2\\angle\\beta = r_1r_2\\angle(\\alpha + \\beta)' },
      { text: 'Read backwards, this is a proof of the angle-sum formulas themselves, once one knows that multiplying by a unit complex number is a rotation.' }
    ]
  },
  formulas: [
    {
      name: 'Real part from modulus and argument',
      expr: 'a = r*cos(theta)', tex: 'a = r\\cos\\theta',
      vars: {
        a: { name: 'real part', signed: true },
        r: { name: 'modulus', value: 4 },
        theta: { name: 'argument', q: 'angle', unit: '°', value: 150, min: -180, max: 180, signed: true }
      }
    },
    {
      name: 'Imaginary part from modulus and argument',
      expr: 'b = r*sin(theta)', tex: 'b = r\\sin\\theta',
      vars: {
        b: { name: 'imaginary part', signed: true },
        r: { name: 'modulus', value: 4 },
        theta: { name: 'argument', q: 'angle', unit: '°', value: 150, min: -180, max: 180, signed: true }
      }
    },
    {
      name: 'Argument from the two parts',
      expr: 'theta = atan2(b, a)', tex: '\\theta = \\operatorname{atan2}(b, a)',
      vars: {
        theta: { name: 'principal argument', q: 'angle', unit: '°', min: -180, max: 180, signed: true },
        a: { name: 'real part', value: -1, signed: true },
        b: { name: 'imaginary part', value: -1, signed: true }
      },
      note: 'atan2 looks at the signs of both parts and returns the angle in the correct quadrant, between −180° and 180°.',
      practice: { unknowns: ['theta'] }
    }
  ],
  examples: [
    {
      title: 'Converting both ways',
      q: 'Write $-1 - i$ in polar form, and $4\\angle 150°$ in the form $a + bi$.',
      steps: [
        '$|-1 - i| = \\sqrt 2$. Both parts are negative, so the angle is in the third quadrant: $\\arg = -135°$ (or 225°). So $-1 - i = \\sqrt 2\\angle{-135°}$.',
        '$4\\angle 150°$: $a = 4\\cos 150° = -3.464$ and $b = 4\\sin 150° = 2$.',
        'So $4\\angle 150° = -2\\sqrt 3 + 2i \\approx -3.464 + 2i$.'
      ],
      a: '−1 − i = √2∠−135°; 4∠150° = −3.464 + 2i.'
    },
    {
      title: 'Dividing in polar form',
      q: 'Compute $\\dfrac{6\\angle 100°}{2\\angle 40°}$ and write the answer in rectangular form.',
      steps: [
        'Divide the moduli: $6 / 2 = 3$. Subtract the arguments: $100° - 40° = 60°$.',
        'So the quotient is $3\\angle 60°$.',
        'Rectangular form: $3\\cos 60° + 3i\\sin 60° = 1.5 + 2.598i$.'
      ],
      a: '3∠60° = 1.5 + 2.598i'
    }
  ],
  quiz: [
    { q: 'The principal argument of the real number $-2$ is…', choices: ['0°', '90°', '180°', '−90°'], a: 2,
      why: 'It lies on the negative real axis, half a turn from the positive real axis.' },
    { q: 'If $z = 2\\angle 40°$ and $w = 3\\angle 20°$, then $zw$ is…', choices: ['$5\\angle 60°$', '$6\\angle 60°$', '$6\\angle 800°$', '$6\\angle 20°$'], a: 1,
      why: 'Moduli multiply ($2 \\times 3 = 6$) and arguments add ($40° + 20° = 60°$).' },
    { q: 'The argument of a non-zero complex number is unique.', a: false,
      why: 'Adding any whole number of turns (360°) gives the same direction, so there are infinitely many arguments; only the principal one is unique.' },
    { q: 'For $z = x + i$ with real $x$, write $|z^2|$.', answer: 'x^2 + 1', vars: ['x'],
      why: 'Moduli multiply, so $|z^2| = |z|^2 = x^2 + 1$.' },
    { q: 'Dividing by a complex number of modulus 1 and argument $\\alpha$…', choices: ['rotates the plane clockwise by α', 'rotates it anticlockwise by α', 'reflects it', 'shrinks it'], a: 0,
      why: 'Division subtracts the argument, so every point turns back by $\\alpha$; the modulus 1 leaves lengths unchanged.' }
  ],
  problems: [
    { q: 'Find the principal argument of $-3 + 3\\sqrt 3\\,i$, in degrees.', answer: 120, unit: '°', tol: 0.01,
      steps: ['$r = \\sqrt{9 + 27} = 6$.', 'The real part is negative and the imaginary part positive: second quadrant. $\\arctan(3\\sqrt 3/3) = \\arctan\\sqrt 3 = 60°$ from the negative real axis.', 'So $\\arg = 180° - 60° = 120°$.'] }
  ],
  applications: [
    'AC circuit calculations, where voltages and impedances are given by magnitude and phase angle.',
    'Rotating and scaling images and shapes with a single complex multiplication.',
    'Powers and roots of complex numbers (De Moivre\'s theorem).',
    'Radar and communications, where signals are described by amplitude and phase.'
  ],
  sim: { id: 'vlc-complex-plane', params: { mode: 'mul' } }
},

{
  id: 'eulers-formula', parent: 'complex-topic', title: 'Euler\'s formula', level: 3,
  short: 'e^{iθ} = cos θ + i sin θ: the exponential of an imaginary number is a point on the unit circle, which ties exponentials to rotations and waves.',
  keywords: ['Euler\'s formula', 'Euler\'s identity', 'complex exponential', 'e to the i pi', 'exponential form', 'unit circle', 'rotation', 'cis', 'Taylor series', 'damped oscillation'],
  prereq: ['polar-form', 'number-e', 'taylor-series'],
  related: ['de-moivre', 'phasors', 'hyperbolic-functions', 'fourier-series', 'second-order-linear', 'physics:simple-harmonic-motion', 'physics:wavefunction'],
  body: `
### A remarkable formula
For every real angle $\\theta$, measured in radians,

$$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$$

The exponential of an imaginary number is a point on the **unit circle**, at angle $\\theta$. With $\\theta = \\pi$ it gives Euler's identity, $e^{i\\pi} + 1 = 0$, which links five fundamental constants in one line. And every complex number can be written in **exponential form**, $z = re^{i\\theta}$ — the [[polar-form|polar form]] at its most compact.

### Why it is true: the series
The [[taylor-series|Taylor series]] of the exponential is $e^x = 1 + x + x^2/2! + x^3/3! + \\dots$. Put $x = i\\theta$ and use $i^2 = -1$, $i^3 = -i$, $i^4 = 1$: the even powers come out real and the odd powers imaginary,

$$e^{i\\theta} = \\left(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\dots\\right) + i\\left(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\dots\\right)$$

and the two brackets are exactly the Taylor series of $\\cos\\theta$ and $\\sin\\theta$.

### Why it is true: the motion
Think of $z(t) = e^{it}$ as a moving point. Its velocity is $z'(t) = ie^{it} = iz$: the position turned through 90°. A velocity always at right angles to the position, and of the same size, means motion round a circle of radius 1 at unit speed. Starting from $z(0) = 1$, after a time $t$ the point has travelled an arc of length $t$, so it sits at angle $t$: $e^{it} = \\cos t + i\\sin t$. The simulation shows this arrow turning while its shadows trace a cosine and a sine.

### What follows
- **Rotation is multiplication.** $e^{i\\alpha}e^{i\\beta} = e^{i(\\alpha + \\beta)}$: angles add, so multiplying by $e^{i\\theta}$ rotates the plane by $\\theta$. Expanding both sides gives the angle-sum formulas of trigonometry for free (see the worked example).
- **Sine and cosine as exponentials.** Adding and subtracting $e^{i\\theta}$ and $e^{-i\\theta}$ gives $\\cos\\theta = \\tfrac12(e^{i\\theta} + e^{-i\\theta})$ and $\\sin\\theta = \\tfrac{1}{2i}(e^{i\\theta} - e^{-i\\theta})$, close cousins of the [[hyperbolic-functions|hyperbolic functions]] $\\cosh x$ and $\\sinh x$.
- **Growth and turning together.** For $z = x + iy$, $e^z = e^x(\\cos y + i\\sin y)$: the real part stretches and the imaginary part turns. So $e^{(-\\gamma + i\\omega)t}$ spirals inwards as it rotates, and its real part is a damped oscillation.
- **Surprises.** $e^{2\\pi i} = 1$ and $e^{i\\pi/2} = i$; even $i^i = e^{i\\cdot i\\pi/2} = e^{-\\pi/2} \\approx 0.208$ is a real number.

### In science and engineering
Oscillations and waves are written as complex exponentials, $Ae^{i(kx - \\omega t)}$, on the understanding that the physical quantity is the real part. Differentiating an exponential just multiplies it by a constant, which turns differential equations into algebra ([[second-order-linear|linear differential equations]], [[phasors]]); the [[physics:simple-harmonic-motion|harmonic oscillator]], AC circuits and optics are all handled this way. In quantum mechanics the complex exponential is not a convenience but the real thing: a free particle's [[physics:wavefunction|wavefunction]] is $e^{i(px - Et)/\\hbar}$. And [[fourier-series|Fourier series]] build any periodic signal from rotating arrows $e^{in\\omega t}$.
`,
  ideas: [
    'e^{iθ} = cos θ + i sin θ is the point at angle θ on the unit circle.',
    'Every complex number can be written r e^{iθ}.',
    'Multiplying exponentials adds angles, so e^{iθ} is a rotation by θ.',
    'cos θ and sin θ are combinations of e^{iθ} and e^{−iθ}.',
    'e^{(−γ + iω)t} describes a damped oscillation: decay times rotation.'
  ],
  pitfalls: [
    'The angle in e^{iθ} is in degrees — The formula needs radians: e^{iπ} = −1, not e^{i180}.',
    'e^{iθ} grows like an ordinary exponential — For real θ its modulus is always exactly 1; only a real part in the exponent changes the size.',
    'Euler\'s formula is only a notation — It is a theorem, provable from the Taylor series or from the differential equation z′ = iz.'
  ],
  derivation: {
    title: 'Euler\'s formula from the Taylor series',
    steps: [
      { text: 'Start from the series of the exponential, valid for all numbers, real or complex:', tex: 'e^{x} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\frac{x^5}{5!} + \\dots' },
      { text: 'Substitute $x = i\\theta$. The powers of $i$ cycle through $i, -1, -i, 1$:', tex: 'e^{i\\theta} = 1 + i\\theta - \\frac{\\theta^2}{2!} - i\\frac{\\theta^3}{3!} + \\frac{\\theta^4}{4!} + i\\frac{\\theta^5}{5!} - \\dots' },
      { text: 'Collect the real and imaginary terms:', tex: 'e^{i\\theta} = \\left(1 - \\frac{\\theta^2}{2!} + \\frac{\\theta^4}{4!} - \\dots\\right) + i\\left(\\theta - \\frac{\\theta^3}{3!} + \\frac{\\theta^5}{5!} - \\dots\\right)' },
      { text: 'These are the Taylor series of cosine and sine:', tex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta' }
    ]
  },
  formulas: [
    {
      name: 'Real part of eᶻ, z = x + iy',
      expr: 'u = exp(x)*cos(y)', tex: 'u = e^{x}\\cos y',
      vars: {
        u: { name: 'real part of e^z', signed: true },
        x: { name: 'real part of z', value: 0.5, signed: true },
        y: { name: 'imaginary part of z (an angle)', q: 'angle', unit: 'rad', value: 1.2, min: -3.14159, max: 3.14159, signed: true }
      },
      note: 'With $x = 0$ this is $\\cos y$, the real part of $e^{iy}$.'
    },
    {
      name: 'Imaginary part of eᶻ, z = x + iy',
      expr: 'v = exp(x)*sin(y)', tex: 'v = e^{x}\\sin y',
      vars: {
        v: { name: 'imaginary part of e^z', signed: true },
        x: { name: 'real part of z', value: 0.5, signed: true },
        y: { name: 'imaginary part of z (an angle)', q: 'angle', unit: 'rad', value: 1.2, min: -3.14159, max: 3.14159, signed: true }
      }
    }
  ],
  examples: [
    {
      title: 'Trigonometry for free',
      q: 'Use Euler\'s formula to derive the formulas for $\\cos(\\alpha + \\beta)$ and $\\sin(\\alpha + \\beta)$.',
      steps: [
        'Exponents add: $e^{i(\\alpha + \\beta)} = e^{i\\alpha}e^{i\\beta}$.',
        'Left side: $\\cos(\\alpha + \\beta) + i\\sin(\\alpha + \\beta)$.',
        'Right side: $(\\cos\\alpha + i\\sin\\alpha)(\\cos\\beta + i\\sin\\beta) = (\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta) + i(\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta)$.',
        'Equate real parts and imaginary parts: $\\cos(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta$ and $\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta$.'
      ],
      a: 'Both angle-sum formulas drop out of one multiplication.'
    },
    {
      title: 'Evaluating complex exponentials',
      q: 'Write $e^{i\\pi/3}$ and $e^{2 + i\\pi/2}$ in the form $a + bi$.',
      steps: [
        '$e^{i\\pi/3} = \\cos 60° + i\\sin 60° = 0.5 + 0.866i$.',
        '$e^{2 + i\\pi/2} = e^2 \\cdot e^{i\\pi/2} = e^2(\\cos 90° + i\\sin 90°) = e^2\\,i$.',
        'So $e^{2 + i\\pi/2} = 7.389i$: length $e^2$, pointing straight up.'
      ],
      a: 'e^{iπ/3} = 0.5 + 0.866i; e^{2 + iπ/2} = 7.389i.'
    }
  ],
  quiz: [
    { q: '$e^{i\\pi}$ equals…', choices: ['1', '−1', '$i$', '0'], a: 1,
      why: 'Half a turn round the unit circle from 1: $\\cos\\pi + i\\sin\\pi = -1$.' },
    { q: 'For real $\\theta$, $|e^{i\\theta}|$ equals…', choices: ['$\\theta$', '1', '$e$', 'it depends on θ'], a: 1,
      why: '$\\cos^2\\theta + \\sin^2\\theta = 1$: the point always lies on the unit circle.' },
    { q: '$\\cos\\theta = \\dfrac{e^{i\\theta} + e^{-i\\theta}}{2}$.', a: true,
      why: 'Adding $\\cos\\theta + i\\sin\\theta$ and $\\cos\\theta - i\\sin\\theta$ cancels the sines and leaves $2\\cos\\theta$.' },
    { q: 'Write the real part of $\\left(e^{it}\\right)^2$ as a function of $t$.', answer: 'cos(2t)', vars: ['t'],
      why: '$(e^{it})^2 = e^{2it} = \\cos 2t + i\\sin 2t$. (Expanding $(\\cos t + i\\sin t)^2$ instead gives $\\cos^2 t - \\sin^2 t$, the same thing.)' },
    { q: 'For any whole number $k$, $e^{2\\pi i k}$ equals…', choices: ['0', '1', '$k$', '$i^k$'], a: 1,
      why: '$2\\pi k$ radians is $k$ whole turns, which lands back on 1.' }
  ],
  problems: [
    { q: 'Find the real part of $e^{1 + i\\pi/3}$.', answer: 1.359, tol: 0.01,
      steps: ['$e^{1 + i\\pi/3} = e \\cdot e^{i\\pi/3} = e(\\cos 60° + i\\sin 60°)$.', 'Real part: $e \\times 0.5 = 1.359$.'] }
  ],
  applications: [
    'Solving linear differential equations for oscillations and waves.',
    'AC circuit analysis and signal processing.',
    'Quantum mechanics, where plane waves are complex exponentials.',
    'Fourier analysis in audio, imaging and telecommunications.'
  ],
  history: 'Leonhard Euler published the formula in 1748 in his *Introductio in analysin infinitorum*; Roger Cotes had found an equivalent logarithmic form around 1714. The identity $e^{i\\pi} + 1 = 0$ is regularly voted the most beautiful equation in mathematics.',
  sim: 'vlc-euler-phasor'
},

{
  id: 'de-moivre', parent: 'complex-topic', title: 'De Moivre\'s theorem and roots of unity', level: 3,
  short: '(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ: powers multiply the angle. It gives multiple-angle formulas and the n equally spaced n-th roots of any complex number.',
  keywords: ['De Moivre\'s theorem', 'roots of unity', 'n-th roots', 'complex roots', 'regular polygon', 'multiple-angle formulas', 'powers of complex numbers', 'cube roots of one', 'three-phase power', 'FFT'],
  prereq: ['polar-form', 'eulers-formula'],
  related: ['complex-plane', 'binomial-theorem', 'trig-identities', 'polynomials', 'fourier-series', 'phasors'],
  body: `
### Powers multiply the angle
Multiplying complex numbers multiplies their lengths and adds their angles, so raising one to the $n$-th power multiplies its length by itself $n$ times and adds its angle $n$ times:

$$\\big[r(\\cos\\theta + i\\sin\\theta)\\big]^n = r^n(\\cos n\\theta + i\\sin n\\theta)$$

This is **De Moivre's theorem**. With [[eulers-formula|Euler's formula]] it is simply $(re^{i\\theta})^n = r^ne^{in\\theta}$, and it holds for negative whole numbers $n$ too.

Example: $(1 + i)^8$. Multiplying out eight brackets is tedious, but $1 + i = \\sqrt 2\\angle 45°$, so $(1 + i)^8 = (\\sqrt 2)^8\\angle 360° = 16$. In the simulation's **Powers** mode, the points $z, z^2, z^3, \\dots$ spiral outwards when $|z| > 1$, inwards when $|z| < 1$, and step round the unit circle when $|z| = 1$.

### Multiple-angle formulas
Expand the left side with the [[binomial-theorem|binomial theorem]] and compare real and imaginary parts. For $n = 2$, $(\\cos\\theta + i\\sin\\theta)^2 = \\cos^2\\theta - \\sin^2\\theta + 2i\\sin\\theta\\cos\\theta$, which delivers both double-angle formulas at once. For $n = 3$ the real part gives

$$\\cos 3\\theta = \\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta = 4\\cos^3\\theta - 3\\cos\\theta$$

### Roots: n answers on a circle
Now run the theorem backwards to solve $u^n = w$. If $w = R\\angle\\varphi$, then $u = \\rho\\angle\\alpha$ works when $\\rho^n = R$ and $n\\alpha = \\varphi$ — but also when $n\\alpha = \\varphi + 360°k$ for any whole number $k$, because angles that differ by whole turns point the same way. That gives exactly $n$ different roots,

$$u_k = R^{1/n}\\,\\angle\\,\\frac{\\varphi + 360°k}{n}, \\qquad k = 0, 1, \\dots, n - 1$$

all at the same distance $R^{1/n}$ from 0 and spaced $360°/n$ apart: the corners of a **regular $n$-gon**. Every non-zero complex number has two square roots, three cube roots, and so on.

For example, the cube roots of $8i = 8\\angle 90°$ have length 2 and angles 30°, 150° and 270°: they are $\\sqrt 3 + i$, $-\\sqrt 3 + i$ and $-2i$.

### Roots of unity
The solutions of $u^n = 1$ are the **$n$-th roots of unity**, $e^{2\\pi ik/n}$, evenly spaced round the unit circle starting from 1. The cube roots of 1 are $1$ and $-\\tfrac12 \\pm \\tfrac{\\sqrt 3}{2}i$. For $n \\ge 2$ the roots of unity add up to zero: they balance, like equal weights at the corners of a regular polygon.

Three-phase electric power uses exactly this. Its three voltages have equal size and are 120° apart, so their [[phasors]] are the cube roots of unity times the amplitude; in a balanced system the three currents add to zero and the return (neutral) wire carries no current. Roots of unity are also the heart of the **fast Fourier transform**, the algorithm behind digital audio, image compression and much of signal processing ([[fourier-series|Fourier series]]).
`,
  ideas: [
    '(r∠θ)ⁿ = rⁿ∠nθ: lengths are raised to the power n, angles multiplied by n.',
    'Comparing real and imaginary parts gives formulas for cos nθ and sin nθ.',
    'uⁿ = w has exactly n solutions for w ≠ 0, spaced 360°/n apart on a circle of radius |w|^{1/n}.',
    'The n-th roots of unity are e^{2πik/n}; for n ≥ 2 they sum to zero.',
    'The roots form a regular n-gon centred on the origin.'
  ],
  pitfalls: [
    'A cube root has one value — Every non-zero complex number has three cube roots; the real cube root of 8 is only one of them.',
    'Dividing the angle by n gives all the roots — It gives one; the others come from adding 360°k before dividing.',
    'De Moivre works with degrees and radians mixed — Use one unit throughout; in the exponential form e^{inθ}, θ must be in radians.'
  ],
  derivation: {
    title: 'De Moivre\'s theorem by induction',
    steps: [
      { text: 'For $n = 1$ there is nothing to prove. Suppose it holds for some $n$:', tex: '(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta' },
      { text: 'Multiply both sides by $\\cos\\theta + i\\sin\\theta$ and use the rule that angles add under multiplication:', tex: '(\\cos\\theta + i\\sin\\theta)^{n+1} = (\\cos n\\theta + i\\sin n\\theta)(\\cos\\theta + i\\sin\\theta) = \\cos(n + 1)\\theta + i\\sin(n + 1)\\theta' },
      { text: 'So it holds for $n + 1$, and therefore for every positive whole number. For negative powers, $(\\cos\\theta + i\\sin\\theta)^{-1} = \\cos(-\\theta) + i\\sin(-\\theta)$ extends it.' },
      { text: 'With the modulus included, $r$ is simply multiplied $n$ times: $[r(\\cos\\theta + i\\sin\\theta)]^n = r^n(\\cos n\\theta + i\\sin n\\theta)$.' }
    ]
  },
  formulas: [
    {
      name: 'Modulus of the n-th roots',
      expr: 'rho = R^(1/n)', tex: '\\rho = R^{1/n}',
      vars: {
        rho: { name: 'modulus of every n-th root', tex: '\\rho' },
        R: { name: 'modulus of the number w', value: 8 },
        n: { name: 'which root (n)', value: 3, int: true }
      }
    },
    {
      name: 'Argument of the k-th root',
      expr: 'phik = (phi + 2*pi*k)/n', tex: '\\varphi_k = \\frac{\\varphi + 2\\pi k}{n}',
      vars: {
        phik: { name: 'argument of root number k', tex: '\\varphi_k', q: 'angle', unit: '°', signed: true },
        phi: { name: 'argument of w', tex: '\\varphi', q: 'angle', unit: '°', value: 90, signed: true },
        k: { name: 'root number k = 0, 1, …, n − 1', value: 1, int: true },
        n: { name: 'which root (n)', value: 3, int: true }
      },
      note: 'In degrees, $2\\pi k$ radians is $360°k$. The roots with $k = 0, 1, \\dots, n - 1$ are all different; $k = n$ repeats $k = 0$.'
    }
  ],
  examples: [
    {
      title: 'A high power',
      q: 'Evaluate $(1 + i)^8$ and $(1 + i)^{-2}$.',
      steps: [
        '$1 + i = \\sqrt 2\\angle 45°$.',
        '$(1 + i)^8 = (\\sqrt 2)^8\\angle(8 \\times 45°) = 16\\angle 360° = 16$.',
        '$(1 + i)^{-2} = (\\sqrt 2)^{-2}\\angle(-90°) = \\tfrac12\\angle{-90°} = -\\tfrac12 i$.',
        'Check the second: $(1 + i)^2 = 2i$, and $1/(2i) = -i/2$.'
      ],
      a: '(1 + i)⁸ = 16; (1 + i)⁻² = −i/2.'
    },
    {
      title: 'The cube roots of 8i',
      q: 'Find all $u$ with $u^3 = 8i$.',
      steps: [
        '$8i = 8\\angle 90°$, so every root has modulus $8^{1/3} = 2$.',
        'Arguments: $(90° + 360°k)/3 = 30°, 150°, 270°$ for $k = 0, 1, 2$.',
        '$2\\angle 30° = \\sqrt 3 + i$, $2\\angle 150° = -\\sqrt 3 + i$, $2\\angle 270° = -2i$.',
        'Check one: $(-2i)^3 = -8i^3 = 8i$. The three roots form an equilateral triangle.'
      ],
      a: '√3 + i, −√3 + i and −2i.'
    }
  ],
  quiz: [
    { q: 'How many different complex solutions does $z^6 = 1$ have?', choices: ['1', '2', '6', 'infinitely many'], a: 2,
      why: 'Six sixth roots of unity, at 0°, 60°, 120°, 180°, 240° and 300°: the corners of a regular hexagon. Only two of them (±1) are real.' },
    { q: '$(\\cos 20° + i\\sin 20°)^9$ equals…', choices: ['1', '−1', '$i$', '9'], a: 1,
      why: 'By De Moivre it is $\\cos 180° + i\\sin 180° = -1$.' },
    { q: 'For $n \\ge 2$, the $n$-th roots of unity add up to zero.', a: true,
      why: 'Their sum is unchanged when every root is multiplied by $e^{2\\pi i/n}$ (that just permutes them), and the only number unchanged by that rotation is 0.' },
    { q: 'Using De Moivre with $n = 3$, write $\\cos 3\\theta$ as a polynomial in $c = \\cos\\theta$.', answer: '4c^3 - 3c', vars: ['c'],
      why: 'The real part of $(c + is)^3$ is $c^3 - 3cs^2$, and $s^2 = 1 - c^2$ turns it into $4c^3 - 3c$.' },
    { q: 'The three cube roots of 27 form…', choices: ['three points on a line', 'an equilateral triangle on a circle of radius 3', 'a square', 'a single point, 3'], a: 1,
      why: 'All have modulus 3 and they are 120° apart: $3$, $3\\angle 120°$ and $3\\angle 240°$.' }
  ],
  problems: [
    { q: 'Evaluate $(1 + \\sqrt 3\\,i)^6$.', answer: 64, tol: 0.001,
      steps: ['$1 + \\sqrt 3\\,i = 2\\angle 60°$.', '$(2\\angle 60°)^6 = 64\\angle 360° = 64$.'] }
  ],
  applications: [
    'Three-phase electric power: three voltages 120° apart that sum to zero.',
    'The fast Fourier transform, built on the roots of unity.',
    'Deriving multiple-angle identities in trigonometry.',
    'Solving equations such as zⁿ = c, and constructing regular polygons.'
  ],
  history: 'Abraham de Moivre, a French Huguenot mathematician who lived in London, used the result in the early 18th century; Euler later stated it in its modern form. De Moivre is also remembered for early work on the normal distribution.',
  sim: { id: 'vlc-complex-plane', params: { mode: 'root', n: 6 } }
},

{
  id: 'phasors', parent: 'complex-topic', title: 'Phasors', level: 3,
  short: 'Represent a sinusoid A cos(ωt + φ) by the complex number A e^{iφ}: adding waves becomes adding arrows, and differentiating becomes multiplying by iω.',
  keywords: ['phasor', 'sinusoid', 'amplitude', 'phase', 'complex amplitude', 'AC circuits', 'impedance', 'reactance', 'phase difference', 'adding sinusoids', 'j'],
  prereq: ['eulers-formula', 'polar-form', 'trig-graphs'],
  related: ['vector-addition', 'forced-oscillator-ode', 'second-order-linear', 'physics:alternating-current', 'physics:rlc-impedance', 'physics:reactance', 'physics:superposition'],
  body: `
### Freezing a rotating arrow
A sinusoid $A\\cos(\\omega t + \\varphi)$ is the real part of the rotating arrow $Ae^{i(\\omega t + \\varphi)}$ ([[eulers-formula|Euler's formula]]). In a circuit or a wave problem where everything oscillates at one frequency $\\omega$, all the arrows turn together, like the spokes of one wheel. Their *relative* positions never change, so the turning can be left out: each sinusoid is represented by its arrow at $t = 0$,

$$A\\cos(\\omega t + \\varphi) \\;\\longleftrightarrow\\; \\tilde A = Ae^{i\\varphi} = A\\angle\\varphi$$

This complex number, holding the amplitude and the phase together, is the **phasor**. To get the signal back, multiply by $e^{i\\omega t}$ and take the real part.

### Adding sinusoids
Two sinusoids of the same frequency always add up to a single sinusoid of that frequency. The fact is awkward to prove with trigonometric identities and obvious with phasors: add the arrows tip to tail, and the sum turns along with them.

Example: $3\\cos\\omega t + 4\\sin\\omega t$. Since $\\sin\\omega t = \\cos(\\omega t - 90°)$, the phasors are $3$ and $-4i$. Their sum is $3 - 4i = 5\\angle{-53.1°}$, so

$$3\\cos\\omega t + 4\\sin\\omega t = 5\\cos(\\omega t - 53.1°)$$

The amplitudes do not simply add: two waves of amplitude 1 give anything from 0 (in antiphase) to 2 (in phase), and $\\sqrt 2$ when they are 90° apart — exactly like [[vector-addition|adding vectors]], which is what it is. This is the arithmetic of [[physics:superposition|interference]].

### Calculus becomes algebra
Differentiating $\\operatorname{Re}(\\tilde A e^{i\\omega t})$ gives $\\operatorname{Re}(i\\omega\\tilde A e^{i\\omega t})$. In phasor language, **differentiation is multiplication by $i\\omega$** — a 90° turn forward and a stretch by $\\omega$ — and integration is division by $i\\omega$. A linear differential equation for a steady oscillation becomes a single complex equation; this is how the steady state of a [[forced-oscillator-ode|forced oscillator]] is found in a few lines.

### AC circuits
Electrical engineering runs on phasors, written with $j$ because $i$ means current. For a resistor, an inductor and a capacitor, the voltage and current phasors are related by an **impedance**, $\\tilde V = Z\\tilde I$, with

$$Z_R = R, \\qquad Z_L = j\\omega L, \\qquad Z_C = \\frac{1}{j\\omega C}$$

The $j$ says that an inductor's voltage leads its current by 90° and a capacitor's lags by 90° ([[physics:reactance|reactance]]). Impedances in series simply add, like resistances: a series RLC circuit has $Z = R + j(\\omega L - 1/\\omega C)$, whose modulus sets the size of the current and whose argument sets the phase shift ([[physics:rlc-impedance|RLC impedance]], [[physics:alternating-current|alternating current]]). With $R = 30\\ \\Omega$ and reactances of $70\\ \\Omega$ and $30\\ \\Omega$, $Z = 30 + 40j = 50\\angle 53.1°\\ \\Omega$, so a 230 V supply drives a current of 4.6 A that lags the voltage by 53.1°.

> [!warn] Phasors work only for signals of one and the same frequency. Arrows turning at different rates do not keep their relative positions: their sum swells and fades, which is how beats arise.
`,
  ideas: [
    'A phasor A∠φ = A e^{iφ} represents the sinusoid A cos(ωt + φ).',
    'Same-frequency sinusoids add by adding their phasors, like vectors.',
    'Differentiation multiplies a phasor by iω; integration divides by iω.',
    'In AC circuits, V = ZI with Z_R = R, Z_L = jωL, Z_C = 1/(jωC).',
    'Phasors apply only when every signal has the same frequency.'
  ],
  pitfalls: [
    'Amplitudes of sinusoids add — Only if they are in phase; in general the phasors add as vectors and the result depends on the phase difference.',
    'Phasors can combine different frequencies — Each frequency needs its own phasor calculation; sum the resulting signals in time.',
    'The phasor is the signal — It is a complex bookkeeping device; the physical signal is the real part of the phasor times e^{iωt}.'
  ],
  derivation: {
    title: 'Why phasors add',
    steps: [
      { text: 'Write each sinusoid as a real part:', tex: 'A_1\\cos(\\omega t + \\varphi_1) + A_2\\cos(\\omega t + \\varphi_2) = \\operatorname{Re}\\big(A_1e^{i\\varphi_1}e^{i\\omega t}\\big) + \\operatorname{Re}\\big(A_2e^{i\\varphi_2}e^{i\\omega t}\\big)' },
      { text: 'Real parts add, and the common factor $e^{i\\omega t}$ comes out:', tex: '= \\operatorname{Re}\\big[(A_1e^{i\\varphi_1} + A_2e^{i\\varphi_2})\\,e^{i\\omega t}\\big]' },
      { text: 'The bracket is one complex number, $Ae^{i\\varphi}$, so the sum is a single sinusoid:', tex: '= A\\cos(\\omega t + \\varphi), \\qquad Ae^{i\\varphi} = A_1e^{i\\varphi_1} + A_2e^{i\\varphi_2}' },
      { text: 'Its amplitude follows from the law of cosines: $A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos(\\varphi_2 - \\varphi_1)$.' }
    ]
  },
  formulas: [
    {
      name: 'Amplitude of the sum of two sinusoids',
      expr: 'A = sqrt(A1^2 + A2^2 + 2*A1*A2*cos(dphi))', tex: 'A = \\sqrt{A_1^2 + A_2^2 + 2A_1A_2\\cos\\Delta\\varphi}',
      vars: {
        A: { name: 'amplitude of the sum' },
        A1: { name: 'first amplitude', tex: 'A_1', value: 5 },
        A2: { name: 'second amplitude', tex: 'A_2', value: 5 },
        dphi: { name: 'phase difference', tex: '\\Delta\\varphi', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      note: 'In phase ($0°$) the amplitudes add; in antiphase ($180°$) they subtract.',
      stories: { A: 'Two waves of the same frequency with amplitudes {A1} and {A2} meet with a phase difference of {dphi}. What is the amplitude of the combined wave?' }
    },
    {
      name: 'Impedance of a series RLC circuit',
      expr: 'Z = sqrt(R^2 + (2*pi*f*L - 1/(2*pi*f*C))^2)', tex: 'Z = \\sqrt{R^2 + \\left(2\\pi f L - \\frac{1}{2\\pi f C}\\right)^2}',
      vars: {
        Z: { name: 'impedance |Z|', q: 'resistance', unit: 'Ω' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 30 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 222.8 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 106.1 }
      },
      note: 'The modulus of $Z = R + j(\\omega L - 1/\\omega C)$ with $\\omega = 2\\pi f$. At resonance the two reactances cancel and $Z = R$.',
      practice: { unknowns: ['Z', 'R'] }
    },
    {
      name: 'Phase angle of a series RLC circuit',
      expr: 'phi = atan((2*pi*f*L - 1/(2*pi*f*C))/R)', tex: '\\varphi = \\arctan\\frac{2\\pi f L - 1/(2\\pi f C)}{R}',
      vars: {
        phi: { name: 'phase of the voltage ahead of the current', tex: '\\varphi', q: 'angle', unit: '°', min: -90, max: 90, signed: true },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 30 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 50 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 222.8 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 106.1 }
      },
      note: 'Positive when the circuit is inductive (the current lags), negative when it is capacitive (the current leads).',
      practice: { unknowns: ['phi'] }
    }
  ],
  examples: [
    {
      title: 'Adding a cosine and a sine',
      q: 'Write $3\\cos\\omega t + 4\\sin\\omega t$ as a single cosine.',
      steps: [
        'Phasors: $3\\cos\\omega t \\to 3$; $4\\sin\\omega t = 4\\cos(\\omega t - 90°) \\to 4\\angle{-90°} = -4i$.',
        'Sum: $3 - 4i$, with modulus 5 and argument $-\\arctan(4/3) = -53.1°$.',
        'So the sum is $5\\cos(\\omega t - 53.1°)$.',
        'Check at $t = 0$: $5\\cos(-53.1°) = 3$, the value of the original.'
      ],
      a: '5 cos(ωt − 53.1°)'
    },
    {
      title: 'Current in an RLC circuit',
      q: 'A 230 V, 50 Hz supply drives a series circuit with $R = 30\\ \\Omega$, an inductive reactance of $70\\ \\Omega$ and a capacitive reactance of $30\\ \\Omega$. Find the current and its phase.',
      steps: [
        '$Z = 30 + j(70 - 30) = 30 + 40j\\ \\Omega$.',
        '$|Z| = \\sqrt{30^2 + 40^2} = 50\\ \\Omega$ and $\\arg Z = \\arctan(40/30) = 53.1°$.',
        '$\\tilde I = \\tilde V / Z = 230\\angle 0° / 50\\angle 53.1° = 4.6\\angle{-53.1°}$ A.',
        'The current is 4.6 A (rms) and lags the voltage by 53.1°: the circuit is inductive.'
      ],
      a: '4.6 A, lagging by 53.1°.'
    }
  ],
  quiz: [
    { q: 'Two sinusoids of the same frequency, each of amplitude 1 and 90° apart in phase, add to a sinusoid of amplitude…', choices: ['0', '1', '$\\sqrt 2$', '2'], a: 2,
      why: 'Perpendicular phasors of length 1 add to an arrow of length $\\sqrt{1^2 + 1^2} = \\sqrt 2$.' },
    { q: 'In phasor terms, differentiating $A\\cos(\\omega t + \\varphi)$ with respect to time multiplies the phasor by…', choices: ['$\\omega$', '$i\\omega$', '$-\\omega$', '$1/(i\\omega)$'], a: 1,
      why: '$\\frac{d}{dt}e^{i\\omega t} = i\\omega e^{i\\omega t}$: the amplitude grows by $\\omega$ and the phase advances by 90°.' },
    { q: 'Phasors can be used to add sinusoids of different frequencies.', a: false,
      why: 'Phasors of different frequencies rotate at different rates, so no single frozen arrow represents their sum; the result is not even a sinusoid.' },
    { q: 'The phasor of $A\\cos\\omega t + B\\sin\\omega t$ is $A - Bi$. Write the square of the amplitude of this sinusoid in terms of $A$ and $B$.', answer: 'A^2 + B^2', vars: ['A', 'B'],
      why: 'The amplitude is the modulus of the phasor: $|A - Bi|^2 = A^2 + B^2$.' },
    { q: 'In a pure inductor, the current lags the voltage by…', choices: ['0°', '90°', '180°', '45°'], a: 1,
      why: '$\\tilde V = j\\omega L\\,\\tilde I$: multiplying by $j$ turns the phasor 90° forward, so the voltage leads and the current lags by 90°.' }
  ],
  problems: [
    { q: 'Find the amplitude of $5\\cos\\omega t + 5\\cos(\\omega t + 60°)$.', answer: 8.66, tol: 0.01,
      steps: ['Phasors: $5$ and $5\\angle 60° = 2.5 + 4.33i$.', 'Sum: $7.5 + 4.33i$, of modulus $\\sqrt{56.25 + 18.75} = \\sqrt{75} = 8.66$.', 'So the sum is $8.66\\cos(\\omega t + 30°)$.'] }
  ],
  applications: [
    'Analysing AC power networks and electronic filters.',
    'Interference of light, sound and radio waves.',
    'Steady-state vibration of machines and structures under periodic forcing.',
    'Radio and communications, where signals are handled as complex amplitudes.'
  ],
  history: 'Charles Proteus Steinmetz, an engineer at General Electric, introduced complex-number methods for alternating currents in the 1890s, turning AC circuit design from calculus into algebra.',
  sim: { id: 'vlc-euler-phasor', params: { two: true } }
}

);
