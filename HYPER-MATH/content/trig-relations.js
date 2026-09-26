/* HYPER-MATH · content/trig-relations.js — the identities that rewrite trigonometric
 * expressions, the laws that solve any triangle, and the hyperbolic functions. */
Hyper.add(

{
  id: 'trig-identities', parent: 'trig-relations', title: 'Trigonometric identities', level: 2,
  short: 'Equations such as sin²θ + cos²θ = 1 that hold for every angle. They let you rewrite, simplify, check and integrate trigonometric expressions.',
  keywords: ['identity', 'Pythagorean identity', 'sin^2 + cos^2 = 1', 'reciprocal identities', 'quotient identity', 'secant', 'cosecant', 'cotangent', 'even odd', 'cofunction', 'proving identities', 'simplify'],
  prereq: ['unit-circle', 'right-triangle-trig'],
  related: ['sum-and-difference', 'integration-by-substitution', 'hyperbolic-functions', 'physics:energy-in-shm'],
  body: `
An **identity** is an equation that holds for every value of its variable, not just for some. $x^2 - 1 = (x - 1)(x + 1)$ is an identity; $x^2 = 4$ is an equation to be solved. Trigonometry is full of identities, because all six functions are built from the same two coordinates of a point on the [[unit-circle]]. They are tools: they let you rewrite an expression in a simpler or more useful form, check an answer, or turn an integral you cannot do into one you can.

### The families
**Quotient and reciprocal identities** — really the definitions:

$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\csc\\theta = \\frac{1}{\\sin\\theta}$$

**Pythagorean identities** — the point $(\\cos\\theta, \\sin\\theta)$ lies on the circle $x^2 + y^2 = 1$:

$$\\sin^2\\theta + \\cos^2\\theta = 1$$

Dividing through by $\\cos^2\\theta$, and then by $\\sin^2\\theta$, gives two more:

$$1 + \\tan^2\\theta = \\sec^2\\theta, \\qquad 1 + \\cot^2\\theta = \\csc^2\\theta$$

**Symmetry identities** — reflections of the unit circle:
- in the x-axis: $\\sin(-\\theta) = -\\sin\\theta$, $\\cos(-\\theta) = \\cos\\theta$, $\\tan(-\\theta) = -\\tan\\theta$;
- in the y-axis: $\\sin(\\pi - \\theta) = \\sin\\theta$, $\\cos(\\pi - \\theta) = -\\cos\\theta$;
- in the line $y = x$, the **cofunction** identities: $\\sin(\\tfrac{\\pi}{2} - \\theta) = \\cos\\theta$ and $\\cos(\\tfrac{\\pi}{2} - \\theta) = \\sin\\theta$;
- periodicity: $\\sin(\\theta + 2\\pi) = \\sin\\theta$ and $\\tan(\\theta + \\pi) = \\tan\\theta$.

The formulas for the sine and cosine of a sum, and of a double angle, are identities too — important enough to have their own page, [[sum-and-difference]].

### Proving an identity
To show that two expressions are identical, start from one side, usually the more complicated, and transform it step by step into the other. The useful moves:
- write everything in terms of sine and cosine;
- combine fractions over a common denominator;
- replace $1$ by $\\sin^2\\theta + \\cos^2\\theta$, or $1 - \\cos^2\\theta$ by $\\sin^2\\theta$;
- factorise, including the difference of two squares $1 - \\sin^2\\theta = (1 - \\sin\\theta)(1 + \\sin\\theta)$.

Do not treat the identity as an equation and do the same thing to both sides: that assumes what you are trying to prove. A quick numerical check first is wise — try $\\theta = 30°$ — but agreement at a few angles is evidence, not proof.

### Where identities earn their keep
- **Energy in an oscillator.** A mass on a spring moves as $x = A\\cos\\omega t$ with velocity $-A\\omega\\sin\\omega t$. The spring's energy $\\tfrac12 kA^2\\cos^2\\omega t$ plus the kinetic energy $\\tfrac12 mA^2\\omega^2\\sin^2\\omega t$, with $\\omega^2 = k/m$, is $\\tfrac12 kA^2(\\cos^2\\omega t + \\sin^2\\omega t) = \\tfrac12 kA^2$: constant ([[physics:energy-in-shm|energy in SHM]]).
- **Integration.** The substitution $x = \\sin u$ turns $\\sqrt{1 - x^2}$ into $\\cos u$, which is how calculus finds the area of a circle ([[integration-by-substitution]]).
- **Tidying results** in mechanics, optics and electronics, where the same answer can emerge in several equivalent trigonometric forms.
`,
  ideas: [
    'An identity holds for every angle; an equation holds only for particular ones.',
    'sin²θ + cos²θ = 1, and dividing it gives 1 + tan²θ = sec²θ and 1 + cot²θ = csc²θ.',
    'Symmetries of the unit circle give the even/odd, supplementary and cofunction identities.',
    'Prove an identity by transforming one side into the other, usually via sines and cosines.'
  ],
  pitfalls: [
    'sin²θ means sin(θ²) — It means (sin θ)², the square of the sine. The angle is not squared.',
    'Proving by doing the same to both sides — That starts from the statement to be proved. Work on one side until it becomes the other.',
    'Checking a few angles proves an identity — It can disprove one, but agreement at a few values is not a proof.'
  ],
  formulas: [
    {
      name: 'Cosine from sine (angle between 0° and 90°)',
      expr: 'c = sqrt(1 - s^2)', tex: 'c = \\sqrt{1 - s^2}',
      vars: {
        c: { name: 'cos θ', tex: 'c' },
        s: { name: 'sin θ', tex: 's', value: 0.6, min: 0, max: 1 }
      },
      note: 'From $\\sin^2\\theta + \\cos^2\\theta = 1$, with $s = \\sin\\theta$ and $c = \\cos\\theta$. For an obtuse angle the cosine is the negative root.'
    },
    {
      name: 'Secant from tangent (angle between 0° and 90°)',
      expr: 'S = sqrt(1 + t^2)', tex: 'S = \\sqrt{1 + t^2}',
      vars: {
        S: { name: 'sec θ', tex: 'S' },
        t: { name: 'tan θ', tex: 't', value: 0.75 }
      },
      note: 'From $1 + \\tan^2\\theta = \\sec^2\\theta$, with $t = \\tan\\theta$ and $S = \\sec\\theta = 1/\\cos\\theta$.'
    }
  ],
  examples: [
    {
      title: 'Expanding a square',
      q: 'Simplify $(\\sin\\theta + \\cos\\theta)^2$.',
      steps: [
        'Expand: $\\sin^2\\theta + 2\\sin\\theta\\cos\\theta + \\cos^2\\theta$.',
        'Group the squares: $(\\sin^2\\theta + \\cos^2\\theta) + 2\\sin\\theta\\cos\\theta = 1 + 2\\sin\\theta\\cos\\theta$.',
        'With the double-angle formula this is also $1 + \\sin 2\\theta$.'
      ],
      a: '1 + 2 sin θ cos θ = 1 + sin 2θ'
    },
    {
      title: 'A proof',
      q: 'Prove that $\\tan\\theta + \\cot\\theta = \\sec\\theta\\csc\\theta$.',
      steps: [
        'Left side in sines and cosines: $\\dfrac{\\sin\\theta}{\\cos\\theta} + \\dfrac{\\cos\\theta}{\\sin\\theta}$.',
        'Common denominator: $\\dfrac{\\sin^2\\theta + \\cos^2\\theta}{\\sin\\theta\\cos\\theta} = \\dfrac{1}{\\sin\\theta\\cos\\theta}$.',
        'That is $\\dfrac{1}{\\cos\\theta}\\cdot\\dfrac{1}{\\sin\\theta} = \\sec\\theta\\csc\\theta$, the right side.'
      ],
      a: 'Proved (for angles where both sides are defined).'
    },
    {
      title: 'The other ratios from one',
      q: 'If $\\sin\\theta = 5/13$ and $\\theta$ is obtuse, find $\\cos\\theta$ and $\\tan\\theta$.',
      steps: [
        '$\\cos^2\\theta = 1 - \\tfrac{25}{169} = \\tfrac{144}{169}$, so $\\cos\\theta = \\pm\\tfrac{12}{13}$.',
        'An obtuse angle is in quadrant II, where cosine is negative: $\\cos\\theta = -\\tfrac{12}{13}$.',
        '$\\tan\\theta = \\sin\\theta/\\cos\\theta = -\\tfrac{5}{12}$.'
      ],
      a: 'cos θ = −12/13, tan θ = −5/12'
    }
  ],
  quiz: [
    { q: 'Simplify $\\dfrac{1 - \\cos^2 x}{\\sin x}$.', answer: 'sin(x)', vars: ['x'], why: '$1 - \\cos^2 x = \\sin^2 x$, and $\\sin^2 x/\\sin x = \\sin x$.' },
    { q: 'Simplify $\\sec^2 x - \\tan^2 x$.', answer: '1', vars: ['x'], why: 'From $1 + \\tan^2 x = \\sec^2 x$.' },
    { q: '$\\cos\\theta = 0.6$ and $\\theta$ is in the fourth quadrant. Then $\\sin\\theta$ is…', choices: ['0.8', '−0.8', '0.4', '−0.4'], a: 1,
      why: '$\\sin^2\\theta = 1 - 0.36 = 0.64$, so $\\sin\\theta = \\pm 0.8$; in quadrant IV the sine is negative.' },
    { q: 'If an equation between two trigonometric expressions holds at 30°, 45° and 60°, it is an identity.', a: false,
      why: 'Checks at a few angles can reveal a false identity but cannot prove a true one: $\\sin\\theta = \\tfrac12$ holds at 30° without being an identity.' },
    { q: 'Which of these is **not** an identity?', choices: ['$\\tan^2\\theta + 1 = \\sec^2\\theta$', '$\\sin(-\\theta) = -\\sin\\theta$', '$\\sin 2\\theta = 2\\sin\\theta$', '$\\cos(\\pi - \\theta) = -\\cos\\theta$'], a: 2,
      why: '$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$. At 90°, $\\sin 180° = 0$ but $2\\sin 90° = 2$.' }
  ],
  applications: [
    'Simplifying the results of calculations in mechanics, optics and circuits.',
    'Integration by trigonometric substitution.',
    'Energy conservation in oscillators and waves.'
  ],
  sim: 'gt-unit-circle'
},

{
  id: 'sum-and-difference', parent: 'trig-relations', title: 'Sum, difference and double-angle formulas', level: 2,
  short: 'Formulas for the sine and cosine of a sum of angles, sin(A + B) = sin A cos B + cos A sin B, and the double-angle, power-reduction and product formulas that follow.',
  keywords: ['compound angle', 'addition formula', 'sin(A+B)', 'cos(A+B)', 'tan(A+B)', 'double angle', 'sin 2x', 'cos 2x', 'half angle', 'power reduction', 'sum to product', 'R sin(x + alpha)', 'harmonic addition', 'beats'],
  prereq: ['trig-identities', 'unit-circle'],
  related: ['eulers-formula', 'phasors', 'trig-graphs', 'physics:beats', 'physics:alternating-current', 'physics:projectile-motion'],
  body: `
Is $\\sin(A + B)$ equal to $\\sin A + \\sin B$? Try $A = B = 45°$: the left side is $\\sin 90° = 1$, the right side $0.707 + 0.707 = 1.414$. No. Sines do not add like that — but they do obey an exact rule, one of the most useful in mathematics:

$$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$$

$$\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$$

$$\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A\\tan B}$$

Note the sign flip in the cosine formula. A proof using distances on the unit circle is given below; with complex numbers the first two drop out in one line from $e^{i(A + B)} = e^{iA}e^{iB}$ ([[eulers-formula]]).

With them you can find exact values for angles you do not know from angles you do: $\\sin 75° = \\sin(45° + 30°) = \\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} + \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12 = \\tfrac{\\sqrt6 + \\sqrt2}{4} \\approx 0.966$.

### Double angles
Put $B = A$:

$$\\sin 2A = 2\\sin A\\cos A, \\qquad \\cos 2A = \\cos^2 A - \\sin^2 A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A$$

The first is why the range of a projectile, $R = v_0^2\\sin 2\\theta/g$, is greatest at 45° ([[physics:projectile-motion|projectile motion]]). Rearranging the second gives the **power-reduction** formulas

$$\\cos^2 A = \\tfrac12(1 + \\cos 2A), \\qquad \\sin^2 A = \\tfrac12(1 - \\cos 2A)$$

So the square of a sinusoid averages exactly one half over a cycle. That is why the average power of an alternating current is half its peak power, and why the root-mean-square voltage is the peak divided by $\\sqrt2$: 325 V peak is 230 V rms ([[physics:alternating-current|alternating current]]). Replacing $A$ by $A/2$ gives the half-angle formulas, such as $\\sin^2(A/2) = \\tfrac12(1 - \\cos A)$.

### Sums into products
Adding the formulas for $\\sin(A + B)$ and $\\sin(A - B)$, and renaming the angles, gives

$$\\sin P + \\sin Q = 2\\sin\\frac{P + Q}{2}\\cos\\frac{P - Q}{2}$$

Two tones of nearly equal frequency therefore add up to a tone at their average frequency whose loudness swells and fades at their difference frequency: **beats**, which musicians listen for when tuning ([[physics:beats|beats]]).

### Combining a sine and a cosine
Any combination $a\\sin x + b\\cos x$ is a single sinusoid:

$$a\\sin x + b\\cos x = R\\sin(x + \\alpha), \\qquad R = \\sqrt{a^2 + b^2}, \\quad \\tan\\alpha = \\frac{b}{a}$$

— expand the right side with the sum formula and compare coefficients. So $3\\sin x + 4\\cos x = 5\\sin(x + 53.1°)$, which can never exceed 5. Adding oscillations of the same frequency always gives another of that frequency, with a new amplitude and phase; engineers do the addition graphically with [[phasors]].
`,
  ideas: [
    'sin(A ± B) = sin A cos B ± cos A sin B; cos(A ± B) = cos A cos B ∓ sin A sin B.',
    'Double angles: sin 2A = 2 sin A cos A, cos 2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A.',
    'Power reduction: sin²A = ½(1 − cos 2A), so sin² averages ½ over a cycle.',
    'a sin x + b cos x = R sin(x + α) with R = √(a² + b²): same frequency in, same frequency out.'
  ],
  pitfalls: [
    'sin(A + B) = sin A + sin B — Test A = B = 45°: sin 90° = 1, but sin 45° + sin 45° ≈ 1.41.',
    'The same sign in the cosine formula — cos(A + B) has a minus: cos A cos B − sin A sin B.',
    'sin 2A = 2 sin A — It is 2 sin A cos A, which is never more than 1.'
  ],
  derivation: {
    title: 'Prove the difference formula for cosine',
    steps: [
      { text: 'Put $P = (\\cos A, \\sin A)$ and $Q = (\\cos B, \\sin B)$ on the unit circle. By the distance formula, using $\\cos^2 + \\sin^2 = 1$ twice:', tex: 'PQ^2 = (\\cos A - \\cos B)^2 + (\\sin A - \\sin B)^2 = 2 - 2(\\cos A\\cos B + \\sin A\\sin B)' },
      { text: 'Rotate both points through $-B$. The chord keeps its length, and now joins $(\\cos(A - B), \\sin(A - B))$ to $(1, 0)$:', tex: 'PQ^2 = (\\cos(A - B) - 1)^2 + \\sin^2(A - B) = 2 - 2\\cos(A - B)' },
      { text: 'The two expressions for the same length must agree:', tex: '\\cos(A - B) = \\cos A\\cos B + \\sin A\\sin B' },
      { text: 'Replace $B$ by $-B$ for the sum. For the sine, use $\\sin\\theta = \\cos(\\tfrac{\\pi}{2} - \\theta)$:', tex: '\\sin(A + B) = \\cos\\left(\\left(\\tfrac{\\pi}{2} - A\\right) - B\\right) = \\sin A\\cos B + \\cos A\\sin B' }
    ]
  },
  formulas: [
    {
      name: 'Amplitude of a sin x + b cos x',
      expr: 'R = sqrt(a^2 + b^2)', tex: 'R = \\sqrt{a^2 + b^2}',
      vars: {
        R: { name: 'amplitude of the combined wave' },
        a: { name: 'coefficient of sin x', value: 3, signed: true },
        b: { name: 'coefficient of cos x', value: 4, signed: true }
      },
      practice: { unknowns: ['R'] }
    },
    {
      name: 'Phase of a sin x + b cos x (for a > 0)',
      expr: 'alpha = atan(b/a)', tex: '\\alpha = \\arctan\\frac{b}{a}',
      vars: {
        alpha: { name: 'phase α in R sin(x + α)', q: 'angle', unit: '°', min: -90, max: 90, signed: true },
        b: { name: 'coefficient of cos x', value: 4, signed: true },
        a: { name: 'coefficient of sin x (positive)', value: 3 }
      },
      practice: { unknowns: ['alpha'] }
    }
  ],
  examples: [
    {
      title: 'An exact value',
      q: 'Find $\\cos 15°$ exactly.',
      steps: [
        '$\\cos 15° = \\cos(45° - 30°) = \\cos 45°\\cos 30° + \\sin 45°\\sin 30°$.',
        '$= \\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} + \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12 = \\tfrac{\\sqrt6 + \\sqrt2}{4}$.',
        'Numerically $0.966$ — the same as $\\sin 75°$, as it must be, since $15° + 75° = 90°$.'
      ],
      a: '(√6 + √2)/4 ≈ 0.966'
    },
    {
      title: 'One wave from two',
      q: 'Write $3\\sin x + 4\\cos x$ as a single sine wave. What is its largest value, and where is it first reached for $x > 0$?',
      steps: [
        '$R = \\sqrt{3^2 + 4^2} = 5$ and $\\tan\\alpha = 4/3$, so $\\alpha = 53.13°$.',
        '$3\\sin x + 4\\cos x = 5\\sin(x + 53.13°)$. Check at $x = 0$: $5\\sin 53.13° = 4$. ✓',
        'The maximum 5 occurs when $x + 53.13° = 90°$: $x = 36.87°$.'
      ],
      a: '5 sin(x + 53.13°); maximum 5 at x = 36.87°'
    },
    {
      title: 'Double angles from a triangle',
      q: '$A$ is acute and $\\sin A = 3/5$. Find $\\sin 2A$ and $\\cos 2A$.',
      steps: [
        '$\\cos A = 4/5$ (a 3–4–5 triangle).',
        '$\\sin 2A = 2 \\cdot \\tfrac35 \\cdot \\tfrac45 = \\tfrac{24}{25}$.',
        '$\\cos 2A = 1 - 2\\sin^2 A = 1 - \\tfrac{18}{25} = \\tfrac{7}{25}$. Check: $24^2 + 7^2 = 625 = 25^2$.'
      ],
      a: 'sin 2A = 24/25, cos 2A = 7/25'
    }
  ],
  quiz: [
    { q: 'Expand and simplify $\\sin(x + \\pi/2)$.', answer: 'cos(x)', vars: ['x'], why: '$\\sin x\\cos\\tfrac{\\pi}{2} + \\cos x\\sin\\tfrac{\\pi}{2} = \\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x$.' },
    { q: 'Write $2\\sin x\\cos x$ as a single trigonometric function.', answer: 'sin(2x)', vars: ['x'], why: 'The double-angle formula, read backwards.' },
    { q: 'Which expression equals $\\cos 2x$?', choices: ['$1 - 2\\sin^2 x$', '$2\\cos x - 1$', '$\\cos^2 x + \\sin^2 x$', '$2\\sin x\\cos x$'], a: 0,
      why: '$\\cos 2x = \\cos^2 x - \\sin^2 x = (1 - \\sin^2 x) - \\sin^2 x$. The third choice is 1, the fourth is $\\sin 2x$.' },
    { q: 'The largest value of $\\sin x + \\cos x$ is…', choices: ['1', '$\\sqrt2$', '2', '$1/\\sqrt2$'], a: 1, why: '$\\sin x + \\cos x = \\sqrt2\\sin(x + 45°)$, whose maximum is $\\sqrt2$, reached at $x = 45°$.' },
    { q: '$\\sin(A + B) = \\sin A + \\sin B$ for all angles $A$ and $B$.', a: false, why: 'It fails for $A = B = 45°$ (1 against 1.41). It happens to hold only in special cases, such as $B = 0$.' }
  ],
  applications: [
    'Adding oscillations and alternating currents of the same frequency.',
    'Beats between two nearly equal frequencies, used to tune instruments.',
    'Average power and rms values in AC circuits, via sin² = ½(1 − cos 2x).',
    'Rotation formulas in graphics and robotics.'
  ]
},

{
  id: 'law-of-sines', parent: 'trig-relations', title: 'The law of sines', level: 2,
  short: 'In any triangle, each side divided by the sine of the opposite angle gives the same number — the diameter of the circle through the three corners.',
  keywords: ['law of sines', 'sine rule', 'a/sin A', 'oblique triangle', 'ambiguous case', 'SSA', 'AAS', 'ASA', 'circumcircle', 'triangulation', 'area half ab sin C', 'surveying'],
  prereq: ['right-triangle-trig', 'triangles', 'unit-circle'],
  related: ['law-of-cosines', 'area', 'circles', 'inverse-trig', 'physics:stellar-parallax', 'physics:static-equilibrium'],
  body: `
Right-triangle trigonometry needs a right angle, and most triangles — the one formed by two surveyors and a distant church spire, or by two forces and their resultant — do not have one. Two laws handle every triangle. The first says that each side is proportional to the sine of the angle opposite it:

$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$

where $R$ is the radius of the circle through the three corners, the **circumcircle**.

### Why it is true
Drop the altitude $h$ from $C$ to the line $AB$. It is a side of two right triangles, so $h = b\\sin A$ and also $h = a\\sin B$. Equating them, $a\\sin B = b\\sin A$, which rearranges to $a/\\sin A = b/\\sin B$; another altitude brings in $c$. (If the angle at $A$ is obtuse the altitude falls outside the triangle, but $\\sin(180° - A) = \\sin A$ keeps the argument intact.) The same altitude gives the area:

$$\\text{area} = \\tfrac12 ab\\sin C$$

— half of base times height, with the height worked out from a side and an angle ([[area]]).

### When to use it
The law of sines solves a triangle when you know
- two angles and any side (**AAS** or **ASA**): the third angle is 180° minus the other two, and each missing side is a known side times the ratio of the sines;
- two sides and an angle opposite one of them (**SSA**) — with care.

For two sides and the angle between them, or for three sides, use the [[law-of-cosines|law of cosines]] instead.

### The ambiguous case
Given $a$, $b$ and the angle $A$, the law gives $\\sin B = b\\sin A/a$. But a sine does not pin down its angle: $B$ and $180° - B$ have the same sine ([[inverse-trig]]). Picture side $b$ fixed and side $a$ swinging from $C$ like a pendulum until it meets the base line:
- if $a < b\\sin A$ it cannot reach: **no** triangle;
- if $a = b\\sin A$ it just touches: **one** right triangle;
- if $b\\sin A < a < b$ it meets the line in two places: **two** different triangles;
- if $a \\ge b$ only one meeting point gives a triangle: **one**.

That is why SSA is not a test for congruence ([[similar-triangles]]).

### Triangulation
Measure one baseline carefully and the angles from its two ends to a distant point, and the law of sines gives the point's distance without going there. From the 18th century onwards whole countries were mapped with chains of such triangles; the Great Trigonometrical Survey of India measured the height of Everest from stations more than 100 km away. With the Earth's orbit as the baseline, the same geometry gives the distances of nearby stars ([[physics:stellar-parallax|stellar parallax]]), and three forces in equilibrium, drawn nose to tail, form a triangle that obeys it too ([[physics:static-equilibrium|static equilibrium]]).

> [!tip] In the simulation, label the triangle with the law of sines and switch on the circle. Drag any corner: the three ratios stay equal to each other and to the circle's diameter.
`,
  ideas: [
    'a/sin A = b/sin B = c/sin C = 2R, the diameter of the circumcircle.',
    'Use it for AAS/ASA, and with care for SSA; use the law of cosines for SAS and SSS.',
    'An angle found from its sine has two candidates, B and 180° − B: the ambiguous case.',
    'The area of any triangle is ½ab sin C.'
  ],
  pitfalls: [
    'Forgetting the second angle — arcsin gives only the acute answer. If 180° − B also leaves a positive third angle, there are two triangles.',
    'Pairing a side with the wrong angle — Each side goes with the angle opposite it, not with an angle at one of its ends.',
    'Using it for three sides — With no angle known, every ratio has two unknowns. Start with the law of cosines.'
  ],
  formulas: [
    {
      name: 'The law of sines',
      expr: 'a/sin(A) = b/sin(B)', tex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B}', solveFor: 'b',
      vars: {
        a: { name: 'side a', q: 'length', unit: 'm', value: 10 },
        A: { name: 'angle A, opposite a', q: 'angle', unit: '°', value: 40, min: 0, max: 180 },
        b: { name: 'side b', q: 'length', unit: 'm' },
        B: { name: 'angle B, opposite b', q: 'angle', unit: '°', value: 65, min: 0, max: 180 }
      },
      note: 'Solving for an angle usually gives two answers, $B$ and $180° - B$ — the ambiguous case. Keep those that leave a positive third angle.',
      stories: {
        b: 'In a triangle, side a = {a} is opposite an angle of {A}. How long is the side opposite an angle of {B}?',
        B: 'A triangle has side a = {a} opposite angle A = {A}, and side b = {b}. What can angle B be?'
      }
    },
    {
      name: 'Area from two sides and the angle between them',
      expr: 'S = 0.5*a*b*sin(C)', tex: 'S = \\tfrac12 ab\\sin C',
      vars: {
        S: { name: 'area', q: 'area', unit: 'm²' },
        a: { name: 'side a', q: 'length', unit: 'm', value: 6 },
        b: { name: 'side b', q: 'length', unit: 'm', value: 8 },
        C: { name: 'angle between a and b', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      stories: { S: 'A triangular garden has sides {a} and {b} meeting at {C}. What is its area?' }
    },
    {
      name: 'Radius of the circumcircle',
      expr: 'R = a/(2*sin(A))', tex: 'R = \\frac{a}{2\\sin A}',
      vars: {
        R: { name: 'radius of the circle through the corners', q: 'length', unit: 'm' },
        a: { name: 'any side', q: 'length', unit: 'm', value: 8 },
        A: { name: 'the angle opposite it', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      }
    }
  ],
  examples: [
    {
      title: 'Across the river',
      q: 'Two surveyors stand at $A$ and $B$, 200 m apart on one bank of a river. A tree $C$ on the far bank is seen at 72° from $AB$ at $A$ and at 63° from $BA$ at $B$. How far is the tree from $A$, and how wide is the river?',
      steps: [
        'Angle at the tree: $C = 180° - 72° - 63° = 45°$.',
        'Law of sines: $\\dfrac{AC}{\\sin 63°} = \\dfrac{200}{\\sin 45°}$, so $AC = 200 \\times \\dfrac{0.891}{0.707} = 252.0$ m.',
        'The width is the distance from $C$ perpendicular to the bank: $AC\\sin 72° = 252.0 \\times 0.951 = 239.7$ m.'
      ],
      a: 'The tree is 252 m from A; the river is about 240 m wide.'
    },
    {
      title: 'Two triangles fit',
      q: 'Solve the triangle with $a = 7$, $b = 10$ and $A = 35°$.',
      steps: [
        '$\\sin B = \\dfrac{10\\sin 35°}{7} = 0.819$, so $B = 55.0°$ or $B = 180° - 55.0° = 125.0°$.',
        'Both leave room for $C$: $C = 90.0°$ or $C = 20.0°$.',
        '$c = \\dfrac{7\\sin C}{\\sin 35°}$: $c = 12.2$ in the first triangle, $c = 4.18$ in the second.'
      ],
      a: 'Two triangles: B = 55°, C = 90°, c = 12.2; or B = 125°, C = 20°, c = 4.18'
    },
    {
      title: 'Two angles and a side',
      q: 'A triangle has $A = 50°$, $B = 60°$ and $a = 10$. Find the rest.',
      steps: [
        '$C = 180° - 50° - 60° = 70°$.',
        '$b = 10 \\times \\dfrac{\\sin 60°}{\\sin 50°} = 11.3$ and $c = 10 \\times \\dfrac{\\sin 70°}{\\sin 50°} = 12.3$.',
        'The longest side, $c$, is opposite the largest angle — a quick check.'
      ],
      a: 'C = 70°, b ≈ 11.3, c ≈ 12.3'
    }
  ],
  quiz: [
    { q: 'Why can the law of sines give two different answers for an angle?', choices: ['Because of rounding', 'Because B and 180° − B have the same sine', 'Because the law is only approximate', 'Because the triangle may be right-angled'], a: 1,
      why: 'The sine of an angle and of its supplement are equal, so $\\sin B = 0.8$ fits both 53.1° and 126.9°.' },
    { q: 'In a triangle, $a = 8$ and $A = 30°$. The diameter of its circumcircle is…', choices: ['4', '8', '16', '8√3'], a: 2, why: '$2R = a/\\sin A = 8/0.5 = 16$.' },
    { q: 'A triangle has $A = 50°$, $B = 60°$ and $a = 10$. Side $b$ is about…', choices: ['8.8', '11.3', '12.0', '13.1'], a: 1, why: '$b = 10\\sin 60°/\\sin 50° = 8.66/0.766 = 11.3$.' },
    { q: 'The law of sines alone can solve a triangle given only its three sides.', a: false, why: 'Every ratio $a/\\sin A$ would contain an unknown angle. Use the law of cosines to find one angle first.' },
    { q: 'Two sides of a triangle are 6 m and 8 m, with 30° between them. Its area is…', choices: ['12 m²', '24 m²', '20.8 m²', '48 m²'], a: 0, why: '$\\tfrac12 \\times 6 \\times 8 \\times \\sin 30° = 24 \\times 0.5 = 12$ m².' }
  ],
  applications: [
    'Surveying and mapping by triangulation.',
    'Navigation: fixing a position from bearings to two known landmarks.',
    'Force triangles in statics, and distances to stars by parallax.'
  ],
  history: 'The sine rule for plane triangles was stated in the 13th century by Nasir al-Din al-Tusi, building on earlier work on spherical triangles by Islamic astronomers such as Abu al-Wafa.',
  sim: { id: 'gt-triangle', params: { show: 'sines', circ: true } }
},

{
  id: 'law-of-cosines', parent: 'trig-relations', title: 'The law of cosines', level: 2,
  short: 'c² = a² + b² − 2ab cos C: the Pythagorean theorem corrected for any angle. It gives the third side from two sides and the angle between them, or any angle from three sides.',
  keywords: ['law of cosines', 'cosine rule', 'SAS', 'SSS', 'Pythagoras generalised', 'third side', 'angle from three sides', 'resultant force', 'dot product', 'navigation', 'obtuse test'],
  prereq: ['pythagorean-theorem', 'right-triangle-trig', 'unit-circle'],
  related: ['law-of-sines', 'dot-product', 'vector-addition', 'coordinate-systems-3d', 'physics:relative-velocity', 'physics:force'],
  body: `
The [[pythagorean-theorem|Pythagorean theorem]] gives the third side of a triangle when the angle between the other two is 90°. The **law of cosines** gives it for any angle:

$$c^2 = a^2 + b^2 - 2ab\\cos C$$

where $C$ is the angle between sides $a$ and $b$, opposite side $c$. The last term corrects Pythagoras. At $C = 90°$, $\\cos C = 0$ and it vanishes. For an acute angle $\\cos C > 0$, the correction is subtracted and $c$ comes out shorter than a hypotenuse would; for an obtuse angle it is added and $c$ is longer. At the extremes the triangle flattens into a line: $C = 0°$ gives $c = |a - b|$ and $C = 180°$ gives $c = a + b$.

### Why it is true
Put $C$ at the origin with side $a$ along the x-axis, so that $B = (a, 0)$ and, by the [[unit-circle]] definition, $A = (b\\cos C, b\\sin C)$. The [[coordinate-geometry|distance formula]] gives

$$c^2 = (b\\cos C - a)^2 + (b\\sin C)^2 = b^2(\\cos^2 C + \\sin^2 C) - 2ab\\cos C + a^2$$

and $\\cos^2 C + \\sin^2 C = 1$ finishes the proof — for every angle, obtuse included.

### Two uses
- **SAS — two sides and the angle between them:** the formula gives the third side directly.
- **SSS — three sides:** rearranged, it gives any angle,

$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$$

and the sign of the top tells the type at once: $a^2 + b^2 > c^2$ means $C$ is acute, equality means it is right, and less means obtuse. Unlike the arcsine in the [[law-of-sines|law of sines]], the arccosine is never ambiguous, because every angle between 0° and 180° has its own cosine.

### Vectors and forces
In vector language this is the length of a difference, $|\\vec a - \\vec b|^2 = |\\vec a|^2 + |\\vec b|^2 - 2\\,\\vec a\\cdot\\vec b$, with the [[dot-product|dot product]] $\\vec a\\cdot\\vec b = |\\vec a||\\vec b|\\cos\\theta$. For a sum the sign flips. Two forces $F_1$ and $F_2$ at an angle $\\theta$ to each other have a resultant of size

$$F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\theta}$$

because, drawn nose to tail, they make a triangle whose interior angle is $180° - \\theta$ ([[vector-addition]], [[physics:force|forces]]). Two 5 N forces combine to 8.66 N at 60° apart, but to only 5 N at 120°.

### In navigation
A ship sails 30 km on one course, then turns through 60° and sails 50 km. The two legs meet at an interior angle of 120°, so the ship ends $\\sqrt{30^2 + 50^2 - 2(30)(50)\\cos 120°} = \\sqrt{4900} = 70$ km from port. The same sum combines an aircraft's airspeed with a crosswind ([[physics:relative-velocity|relative velocity]]), and on a sphere a version of the law gives great-circle distances ([[coordinate-systems-3d]]).
`,
  ideas: [
    'c² = a² + b² − 2ab cos C, with C the angle between a and b.',
    'At C = 90° it is Pythagoras; the correction shortens c for acute C and lengthens it for obtuse C.',
    'cos C = (a² + b² − c²)/2ab finds an angle from three sides, with no ambiguity.',
    'For vectors at angle θ, the resultant is √(F₁² + F₂² + 2F₁F₂ cos θ).'
  ],
  pitfalls: [
    'Using any angle for C — C must be the angle between a and b, opposite c.',
    'Dropping the sign of cos C for obtuse angles — cos 120° = −0.5, so −2ab cos C is added: the third side is longer.',
    'The same sign for a resultant force — The triangle of vectors has the supplementary angle, so the resultant formula has +2F₁F₂ cos θ.'
  ],
  formulas: [
    {
      name: 'The law of cosines',
      expr: 'c = sqrt(a^2 + b^2 - 2*a*b*cos(C))', tex: 'c = \\sqrt{a^2 + b^2 - 2ab\\cos C}',
      vars: {
        c: { name: 'side opposite C', q: 'length', unit: 'km' },
        a: { name: 'side a', q: 'length', unit: 'km', value: 30 },
        b: { name: 'side b', q: 'length', unit: 'km', value: 50 },
        C: { name: 'angle between a and b', q: 'angle', unit: '°', value: 120, min: 0, max: 180 }
      },
      note: 'Solving for $C$ gives the angle from three sides. Solving for $a$ or $b$ may give two lengths — another ambiguous case.',
      stories: {
        c: 'A ship sails {a}, turns so that the two legs meet at an interior angle of {C}, and sails {b}. How far is it from its start?',
        C: 'A triangular field has sides {a}, {b} and {c}. What is the angle between the first two sides?'
      }
    },
    {
      name: 'Resultant of two forces at an angle',
      expr: 'F = sqrt(F1^2 + F2^2 + 2*F1*F2*cos(theta))', tex: 'F = \\sqrt{F_1^2 + F_2^2 + 2F_1F_2\\cos\\theta}',
      vars: {
        F: { name: 'size of the resultant', q: 'force', unit: 'N' },
        F1: { name: 'first force', q: 'force', unit: 'N', value: 5 },
        F2: { name: 'second force', q: 'force', unit: 'N', value: 5 },
        theta: { name: 'angle between the forces', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      stories: { F: 'Two ropes pull on a post with {F1} and {F2}, at {theta} to each other. How large is their combined pull?', theta: 'Forces of {F1} and {F2} combine to {F}. What angle is there between them?' }
    }
  ],
  examples: [
    {
      title: 'How far from port?',
      q: 'A ship sails 30 km, then turns through 60° and sails 50 km. How far is it from its starting point?',
      steps: [
        'A turn of 60° leaves an interior angle of $180° - 60° = 120°$ between the legs.',
        '$c^2 = 30^2 + 50^2 - 2(30)(50)\\cos 120° = 900 + 2500 + 1500 = 4900$.',
        '$c = 70$ km.'
      ],
      a: '70 km'
    },
    {
      title: 'Angles from three sides',
      q: 'Find the angles of the triangle with sides 5, 7 and 8.',
      steps: [
        'Largest angle, opposite 8: $\\cos C = \\dfrac{25 + 49 - 64}{2 \\cdot 5 \\cdot 7} = \\dfrac{10}{70}$, so $C = 81.8°$.',
        'Opposite 7: $\\cos B = \\dfrac{25 + 64 - 49}{2 \\cdot 5 \\cdot 8} = \\dfrac{40}{80} = \\tfrac12$, so $B = 60°$ exactly.',
        '$A = 180° - 81.8° - 60° = 38.2°$ (check: $\\cos A = \\tfrac{49 + 64 - 25}{112} = 0.786$ ✓).'
      ],
      a: 'A = 38.2°, B = 60°, C = 81.8°'
    }
  ],
  quiz: [
    { q: 'When $C = 90°$ the law of cosines becomes…', choices: ['the law of sines', 'the Pythagorean theorem', '$c = a + b$', '$c = a - b$'], a: 1, why: '$\\cos 90° = 0$, leaving $c^2 = a^2 + b^2$.' },
    { q: 'In a triangle $a^2 + b^2 < c^2$. The angle $C$ is…', choices: ['acute', 'right', 'obtuse', 'impossible to tell'], a: 2, why: '$\\cos C = (a^2 + b^2 - c^2)/2ab$ is negative, so $C > 90°$.' },
    { q: 'A triangle has sides 3, 5 and 7. Its largest angle is…', choices: ['90°', '105°', '120°', '135°'], a: 2, why: '$\\cos C = (9 + 25 - 49)/30 = -\\tfrac12$, so $C = 120°$.' },
    { q: 'Two forces of 5 N act on a point at 120° to each other. Their resultant is…', choices: ['0 N', '5 N', '8.66 N', '10 N'], a: 1, why: '$\\sqrt{25 + 25 + 50\\cos 120°} = \\sqrt{25} = 5$ N.' },
    { q: 'A triangle has sides $a = x$ and $b = 2$ with 60° between them. Write $c^2$ in terms of $x$.', answer: 'x^2 - 2x + 4', vars: ['x'],
      why: '$c^2 = x^2 + 4 - 2 \\cdot x \\cdot 2 \\cdot \\cos 60° = x^2 + 4 - 2x$.' }
  ],
  applications: [
    'Navigation and surveying: distances from two legs and the angle between them.',
    'Adding forces and velocities that are not at right angles.',
    'Molecular geometry: the distance between atoms from bond lengths and bond angles.'
  ],
  sim: { id: 'gt-triangle', params: { show: 'cosines' } }
},

{
  id: 'hyperbolic-functions', parent: 'trig-relations', title: 'Hyperbolic functions', level: 3,
  short: 'cosh x and sinh x are the even and odd halves of eˣ. They trace the hyperbola x² − y² = 1 the way cos and sin trace the circle, and describe hanging cables, relativity and falling with drag.',
  keywords: ['sinh', 'cosh', 'tanh', 'hyperbolic sine', 'hyperbolic cosine', 'hyperbolic tangent', 'catenary', 'rapidity', 'cosh^2 - sinh^2 = 1', 'Osborn\'s rule', 'arsinh', 'hanging chain'],
  prereq: ['exponential-functions', 'trig-identities', 'hyperbola'],
  related: ['eulers-formula', 'derivatives-of-functions', 'second-order-linear', 'number-e', 'physics:lorentz-transformation', 'physics:velocity-addition', 'physics:drag-force'],
  body: `
Split the exponential function into its even and odd parts:

$$\\cosh x = \\frac{e^x + e^{-x}}{2}, \\qquad \\sinh x = \\frac{e^x - e^{-x}}{2}, \\qquad e^x = \\cosh x + \\sinh x$$

and define $\\tanh x = \\sinh x/\\cosh x$. These are the **hyperbolic cosine, sine and tangent** (usually read "cosh", "shine" and "than"). $\\cosh$ is even with $\\cosh 0 = 1$; $\\sinh$ is odd with $\\sinh 0 = 0$; for large $x$ both are close to $e^x/2$ and grow exponentially. $\\tanh$ rises smoothly from −1 to 1 in an S-shaped curve.

### Why "hyperbolic"?
Square and subtract:

$$\\cosh^2 x - \\sinh^2 x = 1$$

So the point $(\\cosh u, \\sinh u)$ always lies on the [[hyperbola]] $x^2 - y^2 = 1$, just as $(\\cos\\theta, \\sin\\theta)$ lies on the circle $x^2 + y^2 = 1$. The analogy runs deep: $\\theta$ is twice the area of the circular sector swept from the x-axis to the point, and $u$ is twice the area of the matching hyperbolic sector.

### A mirror of trigonometry
Almost every trigonometric identity has a hyperbolic twin, found by **Osborn's rule**: change cos to cosh and sin to sinh, and flip the sign of every term that contains a product of two sines. So $\\cos^2 + \\sin^2 = 1$ becomes $\\cosh^2 - \\sinh^2 = 1$, and

$$\\cosh(a + b) = \\cosh a\\cosh b + \\sinh a\\sinh b, \\qquad \\sinh 2x = 2\\sinh x\\cosh x$$

The reason is that they *are* the circular functions at imaginary angles: $\\cosh x = \\cos(ix)$ and $\\sinh x = -i\\sin(ix)$ ([[eulers-formula]]).

Their derivatives lose the minus sign that trigonometry has:

$$\\frac{d}{dx}\\sinh x = \\cosh x, \\qquad \\frac{d}{dx}\\cosh x = \\sinh x$$

so both solve $y'' = y$, the equation of runaway growth, while sine and cosine solve $y'' = -y$, the equation of oscillation ([[second-order-linear]]). The inverse functions are logarithms in disguise, for example $\\operatorname{arsinh} x = \\ln\\left(x + \\sqrt{x^2 + 1}\\right)$.

### Where they appear
- **Hanging cables.** A chain hanging under its own weight takes the shape of a **catenary**, $y = a\\cosh(x/a)$ — not a parabola, though the two look alike near the bottom. Power lines sag in catenaries, and the Gateway Arch in St Louis is an upside-down (weighted) catenary, the shape in which an arch carries its own weight in pure compression.
- **Special relativity.** Velocities do not simply add, but **rapidities** do. Define $\\phi$ by $v/c = \\tanh\\phi$: combining two velocities adds their rapidities, and the tanh addition formula reproduces Einstein's rule ([[physics:velocity-addition|relativistic velocity addition]]). The Lorentz factor is $\\gamma = \\cosh\\phi$ ([[physics:lorentz-transformation|Lorentz transformation]]).
- **Falling with drag.** Dropped from rest against quadratic air resistance, a body's speed is $v = v_t\\tanh(gt/v_t)$, approaching the terminal speed $v_t$ smoothly ([[physics:drag-force|air resistance]]).
- **Electronics and neural networks**, where tanh is the standard smooth switch between −1 and 1.
`,
  ideas: [
    'cosh x = (eˣ + e⁻ˣ)/2 and sinh x = (eˣ − e⁻ˣ)/2 are the even and odd parts of eˣ.',
    'cosh²x − sinh²x = 1: (cosh u, sinh u) lies on the hyperbola x² − y² = 1.',
    'Hyperbolic identities follow from trigonometric ones by Osborn\'s rule.',
    'd(sinh)/dx = cosh and d(cosh)/dx = sinh, so both solve y″ = y.'
  ],
  pitfalls: [
    'cosh²x + sinh²x = 1 — The hyperbolic identity has a minus sign: cosh²x − sinh²x = 1.',
    'cosh and sinh are periodic like cos and sin — For real x they are not periodic at all: they grow exponentially.',
    'A hanging chain is a parabola — It is a catenary, y = a cosh(x/a). The parabola is the shape of a cable carrying a load spread evenly along the horizontal, like a suspension bridge deck.'
  ],
  formulas: [
    {
      name: 'Sag of a hanging cable (catenary)',
      expr: 's = a*(cosh(L/(2*a)) - 1)', tex: 's = a\\left(\\cosh\\frac{L}{2a} - 1\\right)',
      vars: {
        s: { name: 'sag at the middle', q: 'length', unit: 'm' },
        a: { name: 'catenary parameter (horizontal tension ÷ weight per metre)', q: 'length', unit: 'm', value: 80 },
        L: { name: 'span between the supports', q: 'length', unit: 'm', value: 100 }
      },
      note: 'For a cable hanging between two supports at the same height. The larger the tension, the larger $a$ and the smaller the sag.',
      stories: { s: 'A power line spans {L} between two pylons of equal height, with catenary parameter {a}. How far does it sag in the middle?' }
    },
    {
      name: 'Falling from rest with quadratic drag',
      expr: 'v = vt*tanh(g*t/vt)', tex: 'v = v_t\\tanh\\frac{g t}{v_t}',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'm/s' },
        vt: { name: 'terminal speed', q: 'speed', unit: 'm/s', value: 55 },
        g: { const: 'g' },
        t: { name: 'time since release', q: 'time', unit: 's', value: 5 }
      },
      stories: { v: 'A skydiver with a terminal speed of {vt} jumps from a hovering helicopter. How fast is she falling after {t}?', t: 'How long does a skydiver with terminal speed {vt} take to reach {v}?' }
    },
    {
      name: 'Speed from rapidity',
      expr: 'v = c*tanh(phi)', tex: 'v = c\\tanh\\phi',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'km/s' },
        c: { const: 'c' },
        phi: { name: 'rapidity', value: 0.5, tex: '\\phi' }
      },
      note: 'Rapidities add when velocities are combined in the same direction; speeds do not.'
    }
  ],
  examples: [
    {
      title: 'Checking the identity',
      q: 'Compute $\\cosh 1$ and $\\sinh 1$ and check that $\\cosh^2 1 - \\sinh^2 1 = 1$.',
      steps: [
        '$e = 2.71828$ and $e^{-1} = 0.36788$.',
        '$\\cosh 1 = (2.71828 + 0.36788)/2 = 1.54308$; $\\sinh 1 = (2.71828 - 0.36788)/2 = 1.17520$.',
        '$1.54308^2 - 1.17520^2 = 2.38110 - 1.38110 = 1.00000$.'
      ],
      a: 'cosh 1 ≈ 1.543, sinh 1 ≈ 1.175; the difference of squares is 1.'
    },
    {
      title: 'A sagging power line',
      q: 'A cable spans 100 m between supports at the same height, with catenary parameter $a = 80$ m. How much does it sag?',
      steps: [
        '$s = a\\left(\\cosh\\dfrac{L}{2a} - 1\\right) = 80\\left(\\cosh 0.625 - 1\\right)$.',
        '$\\cosh 0.625 = 1.2018$, so $s = 80 \\times 0.2018 = 16.1$ m.',
        'A parabola through the same lowest point with the same curvature there would give $L^2/(8a) = 15.6$ m — close, but not the same curve.'
      ],
      a: 'About 16.1 m'
    },
    {
      title: 'Adding speeds near light',
      q: 'A spaceship moves at $0.6c$ and fires a probe forward at $0.6c$ relative to itself. How fast is the probe, using rapidities?',
      steps: [
        'Rapidity of $0.6c$: $\\phi = \\operatorname{artanh} 0.6 = \\tfrac12\\ln\\dfrac{1.6}{0.4} = \\ln 2 = 0.693$.',
        'Rapidities add: $0.693 + 0.693 = 1.386$.',
        '$v = c\\tanh 1.386 = 0.882c$ — the same as Einstein\'s formula $\\dfrac{0.6 + 0.6}{1 + 0.36}c$, and less than $c$.'
      ],
      a: '0.882c, not 1.2c'
    }
  ],
  quiz: [
    { q: '$\\cosh 0$ equals…', choices: ['0', '1', '½', 'e'], a: 1, why: '$(e^0 + e^0)/2 = 1$. The point $(\\cosh 0, \\sinh 0) = (1, 0)$ is the vertex of the hyperbola.' },
    { q: 'Simplify $\\cosh x + \\sinh x$.', answer: 'exp(x)', vars: ['x'], why: '$\\tfrac12(e^x + e^{-x}) + \\tfrac12(e^x - e^{-x}) = e^x$. (You can type it as e^x.)' },
    { q: 'Differentiate $\\cosh x$.', answer: 'sinh(x)', vars: ['x'], why: '$\\frac{d}{dx}\\tfrac12(e^x + e^{-x}) = \\tfrac12(e^x - e^{-x}) = \\sinh x$ — no minus sign, unlike $\\frac{d}{dx}\\cos x = -\\sin x$.' },
    { q: 'Which of these functions is odd?', choices: ['cosh x', 'sinh x', 'cosh²x', 'eˣ'], a: 1, why: '$\\sinh(-x) = (e^{-x} - e^{x})/2 = -\\sinh x$.' },
    { q: 'A chain hanging freely between two hooks forms a parabola.', a: false, why: 'It forms a catenary, $y = a\\cosh(x/a)$. Near the bottom it looks like a parabola, but the two curves differ.' }
  ],
  applications: [
    'Cables, chains and arches: the catenary.',
    'Special relativity, where rapidity and cosh φ = γ make velocity addition simple.',
    'Motion with quadratic drag, transmission lines, and heat flow in fins.',
    'Machine learning, where tanh is a common activation function.'
  ]
}

);
