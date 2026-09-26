/* HYPER-MATH · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the branch files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 */
Hyper.add(
  {
    id: 'math', kind: 'root', title: 'Hyper Math',
    short: 'The mathematics of science and engineering as a map of connected ideas: every concept explained, every formula a calculator, every idea something to play with and practise.',
    body: ''
  },

  /* ================================================================ ALGEBRA */
  {
    id: 'algebra', kind: 'branch', parent: 'math', title: 'Algebra', icon: 'x²', hue: 212,
    short: 'Numbers, equations, functions, exponents and logarithms — the language the rest is written in.',
    body: 'Algebra is arithmetic with the numbers left open. Letters stand for quantities you do not know yet, or for any value at all, and a few rules for manipulating them let you solve equations, describe relationships as functions and see at a glance how one quantity depends on another.'
  },
  { id: 'numbers', kind: 'topic', parent: 'algebra', title: 'Numbers and powers', short: 'The kinds of numbers, fractions and ratios, powers, roots and scientific notation.',
    plan: [['number-systems', 'Number systems'], ['fractions-ratios', 'Fractions, ratios and proportion'], ['exponents', 'Exponents and roots'], ['scientific-notation', 'Scientific notation and significant figures'], ['percentages', 'Percentages']] },
  { id: 'equations-inequalities', kind: 'topic', parent: 'algebra', title: 'Equations and inequalities', short: 'Finding the unknown: linear, quadratic and simultaneous equations, and inequalities.',
    plan: [['linear-equations', 'Linear equations'], ['quadratic-equations', 'Quadratic equations'], ['systems-of-equations', 'Systems of equations'], ['inequalities', 'Inequalities'], ['absolute-value', 'Absolute value']] },
  { id: 'polynomials-topic', kind: 'topic', parent: 'algebra', title: 'Polynomials', short: 'Sums of powers: their roots, factors, division, and ratios of them.',
    plan: [['polynomials', 'Polynomials'], ['factoring', 'Factoring'], ['polynomial-division', 'Polynomial division and the factor theorem'], ['rational-functions', 'Rational functions'], ['binomial-theorem', 'The binomial theorem']] },
  { id: 'functions-topic', kind: 'topic', parent: 'algebra', title: 'Functions', short: 'Rules that turn one number into another: graphs, slopes, shifts, inverses and compositions.',
    plan: [['functions', 'Functions'], ['linear-functions', 'Linear functions and slope'], ['power-functions', 'Power functions and proportionality'], ['function-transformations', 'Transforming graphs'],
           ['composition-of-functions', 'Composition of functions'], ['inverse-functions', 'Inverse functions']] },
  { id: 'exp-log', kind: 'topic', parent: 'algebra', title: 'Exponentials and logarithms', short: 'Growth by a constant factor, the number e, and the logarithm that undoes it.',
    plan: [['exponential-functions', 'Exponential functions'], ['number-e', 'The number e'], ['logarithms', 'Logarithms'], ['exponential-growth-decay', 'Exponential growth and decay'], ['logarithmic-scales', 'Logarithmic scales']] },

  /* ================================================================ GEOMETRY */
  {
    id: 'geometry', kind: 'branch', parent: 'math', title: 'Geometry', icon: '△', hue: 150,
    short: 'Shapes and space: angles, triangles, circles, areas and volumes, and geometry done with coordinates.',
    body: 'Geometry began as land measurement and grew into the study of shape itself. Its results — the Pythagorean theorem, the angle sum of a triangle, the area of a circle — are used every day in physics and engineering, and coordinate geometry turns them into algebra so a computer can work with them.'
  },
  { id: 'plane-geometry', kind: 'topic', parent: 'geometry', title: 'Plane geometry', short: 'Angles, triangles, circles and polygons, and how to measure them.',
    plan: [['angles', 'Angles'], ['triangles', 'Triangles'], ['pythagorean-theorem', 'The Pythagorean theorem'], ['similar-triangles', 'Similar and congruent triangles'], ['circles', 'Circles'], ['polygons', 'Polygons'], ['area', 'Area']] },
  { id: 'solid-geometry', kind: 'topic', parent: 'geometry', title: 'Solid geometry', short: 'Three-dimensional shapes: volumes and surface areas.',
    plan: [['volume', 'Volume'], ['surface-area', 'Surface area'], ['scaling-laws', 'Scaling: area and volume with size']] },
  { id: 'analytic-geometry', kind: 'topic', parent: 'geometry', title: 'Coordinate geometry', short: 'Geometry with coordinates: lines, circles, conics, polar and 3-D coordinates, parametric curves.',
    plan: [['coordinate-geometry', 'Coordinates, distance and midpoint'], ['equation-of-a-line', 'The equation of a line'], ['conic-sections', 'Conic sections'], ['ellipse', 'The ellipse'], ['parabola', 'The parabola'],
           ['hyperbola', 'The hyperbola'], ['polar-coordinates', 'Polar coordinates'], ['coordinate-systems-3d', 'Cylindrical and spherical coordinates'], ['parametric-curves', 'Parametric curves']] },

  /* ================================================================ TRIGONOMETRY */
  {
    id: 'trigonometry', kind: 'branch', parent: 'math', title: 'Trigonometry', icon: 'θ', hue: 35,
    short: 'Angles and the functions of angles: sine, cosine and tangent, the unit circle, identities and waves.',
    body: 'Trigonometry started with triangles — find a height from an angle and a distance — and became the mathematics of everything that turns or repeats. Sine and cosine describe circular motion, waves, alternating current and sound; their identities are the tools that simplify them.'
  },
  { id: 'trig-functions', kind: 'topic', parent: 'trigonometry', title: 'Trigonometric functions', short: 'Radians, right triangles, the unit circle, graphs and inverses.',
    plan: [['angle-measure', 'Degrees and radians'], ['right-triangle-trig', 'Right-triangle trigonometry'], ['unit-circle', 'The unit circle'], ['trig-graphs', 'Graphs of sine and cosine'], ['inverse-trig', 'Inverse trigonometric functions']] },
  { id: 'trig-relations', kind: 'topic', parent: 'trigonometry', title: 'Identities and triangles', short: 'Identities that simplify trigonometric expressions, and the laws that solve any triangle.',
    plan: [['trig-identities', 'Trigonometric identities'], ['sum-and-difference', 'Sum, difference and double-angle formulas'], ['law-of-sines', 'The law of sines'], ['law-of-cosines', 'The law of cosines'], ['hyperbolic-functions', 'Hyperbolic functions']] },

  /* ================================================================ VECTORS */
  {
    id: 'vectors-branch', kind: 'branch', parent: 'math', title: 'Vectors', icon: '↗', hue: 0,
    short: 'Quantities with direction: components, adding and multiplying vectors, and the calculus of vector fields.',
    body: 'Forces, velocities and fields have a size and a direction. Vectors capture both, and a small set of operations — adding, scaling, the dot and cross products — expresses most of physics compactly. Vector calculus then describes how fields change in space: gradient, divergence and curl.'
  },
  { id: 'vector-algebra', kind: 'topic', parent: 'vectors-branch', title: 'Vector algebra', short: 'Components, addition, the dot and cross products, projections.',
    plan: [['vectors', 'Vectors'], ['vector-components', 'Components and unit vectors'], ['vector-addition', 'Adding and scaling vectors'], ['dot-product', 'The dot product'], ['cross-product', 'The cross product'], ['vector-projection', 'Projection of one vector on another']] },
  { id: 'vector-calculus', kind: 'topic', parent: 'vectors-branch', title: 'Vector calculus', short: 'Fields and how they change: gradient, divergence, curl and the integral theorems.',
    plan: [['scalar-vector-fields', 'Scalar and vector fields'], ['gradient', 'Gradient'], ['divergence', 'Divergence'], ['curl', 'Curl'], ['line-integrals', 'Line integrals'], ['flux-integrals', 'Surface and flux integrals'],
           ['divergence-theorem', 'The divergence theorem'], ['stokes-theorem', 'Stokes\' theorem']] },

  /* ================================================================ CALCULUS */
  {
    id: 'calculus', kind: 'branch', parent: 'math', title: 'Calculus', icon: '∫', hue: 268,
    short: 'The mathematics of change: limits, derivatives and integrals, and what they are good for.',
    body: 'Calculus has two halves that turn out to be inverses of each other. **Differentiation** finds how fast something changes — the slope of a curve, a velocity from a position. **Integration** adds up infinitely many small pieces — an area, a distance from a velocity. The fundamental theorem links them, and together they are the working language of physics.'
  },
  { id: 'limits-continuity', kind: 'topic', parent: 'calculus', title: 'Limits and continuity', short: 'What a function approaches, and when it has no jumps.',
    plan: [['limits', 'Limits'], ['continuity', 'Continuity'], ['limits-at-infinity', 'Limits at infinity and asymptotes']] },
  { id: 'differentiation', kind: 'topic', parent: 'calculus', title: 'Derivatives', short: 'The slope of a curve at a point, and the rules for finding it.',
    plan: [['derivative', 'The derivative'], ['differentiation-rules', 'Rules of differentiation'], ['chain-rule', 'The chain rule'], ['derivatives-of-functions', 'Derivatives of the standard functions'],
           ['implicit-differentiation', 'Implicit differentiation'], ['higher-derivatives', 'Higher derivatives']] },
  { id: 'derivative-applications', kind: 'topic', parent: 'calculus', title: 'Using derivatives', short: 'Rates, maxima and minima, approximations and root finding.',
    plan: [['related-rates', 'Related rates'], ['extrema', 'Maxima and minima'], ['optimization', 'Optimization'], ['curve-sketching', 'Curve sketching'], ['linear-approximation', 'Linear approximation and differentials'],
           ['newtons-method', 'Newton\'s method'], ['lhopitals-rule', 'L\'Hôpital\'s rule']] },
  { id: 'integration', kind: 'topic', parent: 'calculus', title: 'Integrals', short: 'Adding up small pieces: antiderivatives, areas and the techniques for finding them.',
    plan: [['antiderivatives', 'Antiderivatives'], ['riemann-sums', 'Riemann sums'], ['definite-integral', 'The definite integral'], ['fundamental-theorem', 'The fundamental theorem of calculus'],
           ['integration-by-substitution', 'Integration by substitution'], ['integration-by-parts', 'Integration by parts'], ['partial-fractions', 'Partial fractions'], ['numerical-integration', 'Numerical integration'], ['improper-integrals', 'Improper integrals']] },
  { id: 'integral-applications', kind: 'topic', parent: 'calculus', title: 'Using integrals', short: 'Areas, volumes, lengths and averages.',
    plan: [['area-between-curves', 'Area between curves'], ['volumes-of-revolution', 'Volumes of revolution'], ['arc-length', 'Arc length'], ['average-value', 'Average value of a function']] },
  { id: 'multivariable', kind: 'topic', parent: 'calculus', title: 'Several variables', short: 'Functions of more than one variable: partial derivatives and multiple integrals.',
    plan: [['partial-derivatives', 'Partial derivatives'], ['multiple-integrals', 'Double and triple integrals'], ['lagrange-multipliers', 'Constrained optimization (Lagrange multipliers)']] },

  /* ================================================================ SERIES */
  {
    id: 'series', kind: 'branch', parent: 'math', title: 'Sequences & Series', icon: 'Σ', hue: 318,
    short: 'Lists of numbers and their sums: when an infinite sum has a value, and functions written as series.',
    body: 'An infinite sum can have a finite value — ½ + ¼ + ⅛ + … is exactly 1. Knowing when this happens, and writing functions as sums of simple pieces (powers in a Taylor series, sines and cosines in a Fourier series), is how calculators compute, how physicists approximate, and how signals are analysed.'
  },
  { id: 'sequences-series', kind: 'topic', parent: 'series', title: 'Sequences and series', short: 'Arithmetic and geometric progressions, convergence, power, Taylor and Fourier series.',
    plan: [['sequences', 'Sequences'], ['arithmetic-series', 'Arithmetic sequences and series'], ['geometric-series', 'Geometric sequences and series'], ['convergence-tests', 'Convergence of series'],
           ['power-series', 'Power series'], ['taylor-series', 'Taylor series'], ['fourier-series', 'Fourier series']] },

  /* ================================================================ DIFFERENTIAL EQUATIONS */
  {
    id: 'differential-equations', kind: 'branch', parent: 'math', title: 'Differential Equations', icon: 'y′', hue: 95,
    short: 'Equations for how things change: growth and decay, oscillators, waves and heat flow.',
    body: 'Physics usually tells you how something changes, not what it is: the rate of decay is proportional to the amount left, the acceleration is proportional to the displacement. Those are differential equations, and solving them — exactly, graphically or step by step on a computer — turns local rules into whole histories.'
  },
  { id: 'first-order-odes', kind: 'topic', parent: 'differential-equations', title: 'First-order equations', short: 'Slope fields, separable and linear equations, growth models and Euler\'s method.',
    plan: [['differential-equations-intro', 'What is a differential equation?'], ['slope-fields', 'Slope fields'], ['separable-equations', 'Separable equations'], ['first-order-linear', 'First-order linear equations'],
           ['exponential-models', 'Exponential models'], ['logistic-equation', 'The logistic equation'], ['euler-method', 'Euler\'s method']] },
  { id: 'second-order-odes', kind: 'topic', parent: 'differential-equations', title: 'Second-order equations', short: 'Linear equations with constant coefficients: the oscillators of physics.',
    plan: [['second-order-linear', 'Second-order linear equations'], ['harmonic-oscillator-ode', 'The harmonic oscillator equation'], ['damped-oscillator-ode', 'The damped oscillator'], ['forced-oscillator-ode', 'Forced oscillations and resonance'], ['laplace-transform', 'The Laplace transform']] },
  { id: 'pdes', kind: 'topic', parent: 'differential-equations', title: 'Partial differential equations', short: 'Equations in space and time: waves, diffusion and potentials.',
    plan: [['wave-equation', 'The wave equation'], ['heat-equation', 'The heat (diffusion) equation'], ['laplace-equation', 'Laplace\'s equation']] },

  /* ================================================================ COMPLEX NUMBERS */
  {
    id: 'complex', kind: 'branch', parent: 'math', title: 'Complex Numbers', icon: 'i', hue: 185,
    short: 'Numbers with a square root of −1: the complex plane, Euler\'s formula, roots of unity and phasors.',
    body: 'Inventing a number $i$ with $i^2 = -1$ looks like a trick, but it makes every polynomial solvable and turns rotations into multiplication. Euler\'s formula $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$ ties the exponential to the trigonometric functions, and engineers use it daily to handle waves and alternating currents.'
  },
  { id: 'complex-topic', kind: 'topic', parent: 'complex', title: 'Complex numbers', short: 'Arithmetic, geometry and exponentials of complex numbers.',
    plan: [['complex-numbers', 'Complex numbers'], ['complex-plane', 'The complex plane'], ['polar-form', 'Polar form: modulus and argument'], ['eulers-formula', 'Euler\'s formula'], ['de-moivre', 'De Moivre\'s theorem and roots of unity'], ['phasors', 'Phasors']] },

  /* ================================================================ LINEAR ALGEBRA */
  {
    id: 'linear-algebra', kind: 'branch', parent: 'math', title: 'Linear Algebra', icon: '[ ]', hue: 240,
    short: 'Matrices and what they do: systems of equations, transformations, determinants and eigenvalues.',
    body: 'A matrix is a table of numbers that acts on vectors: it rotates, stretches, shears and projects them. Linear algebra studies those actions, and with them solves many equations at once, finds the directions a transformation leaves unchanged (eigenvectors), and underlies computer graphics, quantum mechanics and data science.'
  },
  { id: 'matrices-topic', kind: 'topic', parent: 'linear-algebra', title: 'Matrices', short: 'Matrix arithmetic, determinants, inverses, elimination, transformations and eigenvalues.',
    plan: [['matrices', 'Matrices'], ['matrix-multiplication', 'Matrix multiplication'], ['determinants', 'Determinants'], ['matrix-inverse', 'The inverse matrix'], ['gaussian-elimination', 'Gaussian elimination'],
           ['linear-transformations', 'Linear transformations'], ['eigenvalues', 'Eigenvalues and eigenvectors'], ['vector-spaces', 'Vector spaces, span and basis']] },

  /* ================================================================ PROBABILITY AND STATISTICS */
  {
    id: 'probability-statistics', kind: 'branch', parent: 'math', title: 'Probability & Statistics', icon: 'σ', hue: 55,
    short: 'Chance and data: counting, probability, distributions, averages and spreads, fitting and errors.',
    body: 'Probability reasons forward from a model to what the data should look like; statistics reasons back from the data to the model. Together they tell you how sure you can be — of a measurement, a trend, a diagnosis — and they underpin everything from quantum physics to quality control.'
  },
  { id: 'probability', kind: 'topic', parent: 'probability-statistics', title: 'Probability', short: 'Counting, probability rules, conditional probability, Bayes and expected values.',
    plan: [['probability-basics', 'Probability'], ['combinatorics', 'Permutations and combinations'], ['conditional-probability', 'Conditional probability and independence'], ['bayes-theorem', 'Bayes\' theorem'],
           ['random-variables', 'Random variables'], ['expected-value', 'Expected value and variance']] },
  { id: 'distributions', kind: 'topic', parent: 'probability-statistics', title: 'Distributions', short: 'The shapes chance takes: binomial, Poisson, normal, and why averages end up normal.',
    plan: [['binomial-distribution', 'The binomial distribution'], ['poisson-distribution', 'The Poisson distribution'], ['normal-distribution', 'The normal distribution'], ['exponential-distribution', 'The exponential distribution'], ['central-limit-theorem', 'The central limit theorem']] },
  { id: 'statistics', kind: 'topic', parent: 'probability-statistics', title: 'Statistics', short: 'Describing data, fitting lines, measurement errors and testing ideas.',
    plan: [['descriptive-statistics', 'Mean, median and mode'], ['standard-deviation', 'Spread and standard deviation'], ['linear-regression', 'Correlation and least-squares fitting'], ['error-propagation', 'Measurement uncertainty and error propagation'], ['hypothesis-testing', 'Hypothesis testing']] }
);
