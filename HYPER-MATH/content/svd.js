/* HYPER-MATH · content/svd.js — the singular value decomposition and what is built on it:
 * orthogonal matrices, the SVD, low-rank approximation, the pseudoinverse and least squares,
 * principal component analysis. Simulations in sims/svd.js; the playground is Tools → SVD lab
 * (#/tools/svdlab). The arithmetic is HYPER-CORE/js/linalg.js (kit.linalg). */
Hyper.add(

{
  id: 'orthogonal-matrices', parent: 'matrices-topic', title: 'Orthogonal matrices: rotations and reflections', level: 2,
  short: 'Matrices whose columns are perpendicular unit vectors. They turn or mirror space without changing any length or angle, and their inverse is simply their transpose.',
  keywords: ['orthogonal matrix', 'orthonormal columns', 'rotation matrix', 'reflection matrix', 'transpose', 'Q transpose Q = I', 'isometry', 'rigid motion', 'Householder', 'Givens rotation', 'orthogonal group'],
  prereq: ['matrix-multiplication', 'dot-product', 'linear-transformations'],
  related: ['matrix-inverse', 'determinants', 'singular-value-decomposition', 'eigenvalues', 'unit-circle', 'physics:moment-of-inertia'],
  body: `
### Transformations that keep every length
Rotate a sheet of paper on the table, or turn it over: every distance between two points on it, and every angle, stays what it was. Such a transformation is called an **isometry**, and when it also keeps the origin fixed it is given by a matrix $Q$ with a very special property:

$$Q^{\\mathsf T} Q = I, \\qquad\\text{that is}\\qquad Q^{-1} = Q^{\\mathsf T}$$

The [[?transpose]] of $Q$ is its inverse. No elimination is needed to undo it — just read the rows as columns. Such a matrix is called **orthogonal** (for a complex matrix the same idea is called *unitary*).

### What the columns look like
Write the columns of $Q$ as $\\vec q_1, \\vec q_2, \\ldots$. The entry $(i, j)$ of $Q^{\\mathsf T}Q$ is the [[dot-product|dot product]] $\\vec q_i \\cdot \\vec q_j$, so $Q^{\\mathsf T}Q = I$ says exactly that

- every column has length 1, $\\vec q_i \\cdot \\vec q_i = 1$, and
- different columns are perpendicular, $\\vec q_i \\cdot \\vec q_j = 0$.

The columns are an **orthonormal** set — a set of perpendicular unit vectors — and since $Q$ sends $\\hat\\imath, \\hat\\jmath, \\ldots$ to its columns ([[linear-transformations|linear transformations]]), it sends the usual axes to another set of perpendicular axes. The same is true of the rows, because $QQ^{\\mathsf T} = I$ as well.

### Why lengths survive
For any vector, $|Q\\vec x|^2 = (Q\\vec x)\\cdot(Q\\vec x) = \\vec x^{\\mathsf T} Q^{\\mathsf T} Q\\,\\vec x = \\vec x\\cdot\\vec x = |\\vec x|^2$. The same calculation with two vectors shows $Q\\vec x \\cdot Q\\vec y = \\vec x \\cdot \\vec y$: dot products, and so angles, are untouched too. An orthogonal matrix is the algebraic form of a rigid motion about the origin.

### Rotations and reflections
In the plane every orthogonal matrix is one of two things:

$$R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix} \\quad\\text{(a rotation by } \\theta\\text{)}, \\qquad F(\\varphi) = \\begin{pmatrix} \\cos 2\\varphi & \\sin 2\\varphi \\\\ \\sin 2\\varphi & -\\cos 2\\varphi \\end{pmatrix} \\quad\\text{(a reflection in the line at angle } \\varphi\\text{)}$$

The [[determinants|determinant]] tells them apart: $\\det R = \\cos^2\\theta + \\sin^2\\theta = +1$ and $\\det F = -1$. In general $\\det Q = \\pm 1$ for every orthogonal matrix (because $\\det(Q^{\\mathsf T}Q) = (\\det Q)^2 = 1$): $+1$ for a proper rotation, $-1$ when a mirror is involved. Two reflections in a row make a rotation, by twice the angle between the mirrors. In three dimensions a rotation has an axis — an [[eigenvalues|eigenvector]] with eigenvalue 1 — and a reflection in a plane has a normal with eigenvalue $-1$.

### Changing to a better set of axes
Suppose you want the coordinates of a vector along a new set of perpendicular axes $\\vec q_1, \\vec q_2, \\ldots$. Each coordinate is a single dot product, $c_i = \\vec q_i \\cdot \\vec x$, and all of them at once are $\\vec c = Q^{\\mathsf T}\\vec x$. That is why orthonormal bases are so convenient ([[vector-spaces]]): no system of equations has to be solved, and lengths computed from the new coordinates come out the same. A symmetric matrix can always be written $S = Q D Q^{\\mathsf T}$ with $D$ diagonal — the **spectral theorem** — which says that it is a pure stretch along some set of perpendicular axes. The [[singular-value-decomposition|singular value decomposition]] extends this to every matrix, with two orthogonal matrices instead of one.

### Numerically perfect
Orthogonal matrices never make rounding errors worse: multiplying by one cannot amplify an error, because it cannot change a length. Numerical algorithms therefore lean on them — Householder reflections and Givens rotations (a rotation in one coordinate plane) are the tools of QR factorisation, of eigenvalue solvers and of the SVD. Try the rotation, reflection and composition presets in the simulation, and watch the lengths in the read-out stay fixed.
`,
  ideas: [
    'Orthogonal means Qᵀ Q = I: the columns are perpendicular unit vectors.',
    'The inverse of an orthogonal matrix is its transpose — nothing to solve.',
    'It keeps every length, angle and dot product: a rotation, a reflection, or a combination.',
    'det Q = +1 for a rotation, −1 when a mirror is involved.',
    'Coordinates in an orthonormal basis are dot products: c = Qᵀ x.'
  ],
  pitfalls: [
    'Orthogonal columns are enough — The columns must also have length 1 (orthonormal); diag(2, 3) has perpendicular columns but is not orthogonal.',
    'An orthogonal matrix is a rotation — Half of them are reflections, with det = −1; a reflection cannot be reached by any rotation.',
    'Qᵀ = Q⁻¹ for any square matrix — Only for orthogonal ones; for a general matrix the inverse needs elimination.'
  ],
  derivation: {
    title: 'Why an orthogonal matrix preserves lengths',
    steps: [
      { text: 'The squared length of a vector is its dot product with itself, written with the transpose:', tex: '|\\vec x|^2 = \\vec x^{\\mathsf T}\\vec x' },
      { text: 'Apply $Q$ and use the rule $(AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}$:', tex: '|Q\\vec x|^2 = (Q\\vec x)^{\\mathsf T}(Q\\vec x) = \\vec x^{\\mathsf T} Q^{\\mathsf T} Q \\vec x' },
      { text: 'Since $Q^{\\mathsf T}Q = I$ the middle disappears:', tex: '|Q\\vec x|^2 = \\vec x^{\\mathsf T}\\vec x = |\\vec x|^2' },
      { text: 'The same steps with $\\vec x$ and $\\vec y$ give $Q\\vec x\\cdot Q\\vec y = \\vec x\\cdot\\vec y$: angles are kept too.' }
    ]
  },
  formulas: [
    {
      name: 'Rotating a vector: the x-component',
      expr: 'xp = x*cos(theta) - y*sin(theta)', tex: "x' = x\\cos\\theta - y\\sin\\theta",
      vars: {
        xp: { name: 'rotated x-component', signed: true, tex: "x'" },
        x: { name: 'x-component', value: 3, signed: true },
        y: { name: 'y-component', value: 1, signed: true },
        theta: { name: 'rotation angle', q: 'angle', unit: '°', value: 30, min: -180, max: 180 }
      },
      note: 'The first row of $R(\\theta)$ acting on $(x, y)$. With $\\theta = 30°$, $(3, 1)$ becomes $(2.10, 2.37)$: the same length $\\sqrt{10}$, turned anticlockwise. At $\\theta = 90°$ it would be $(-1, 3)$.',
      stories: { xp: 'The vector ({x}, {y}) is rotated by {theta} about the origin. What is its new x-component?' },
      practice: { unknowns: ['xp', 'theta'] }
    },
    {
      name: 'Rotating a vector: the y-component',
      expr: 'yp = x*sin(theta) + y*cos(theta)', tex: "y' = x\\sin\\theta + y\\cos\\theta",
      vars: {
        yp: { name: 'rotated y-component', signed: true, tex: "y'" },
        x: { name: 'x-component', value: 3, signed: true },
        y: { name: 'y-component', value: 1, signed: true },
        theta: { name: 'rotation angle', q: 'angle', unit: '°', value: 30, min: -180, max: 180 }
      },
      note: 'The second row of $R(\\theta)$. Check that $x\'^2 + y\'^2 = x^2 + y^2$ whatever the angle: $2.10^2 + 2.37^2 = 10$.',
      practice: { unknowns: ['yp'] }
    },
    {
      name: 'Reflecting a vector in a line through the origin',
      expr: 'xp = x*cos(2*phi) + y*sin(2*phi)', tex: "x' = x\\cos 2\\varphi + y\\sin 2\\varphi",
      vars: {
        xp: { name: 'reflected x-component', signed: true, tex: "x'" },
        x: { name: 'x-component', value: 3, signed: true },
        y: { name: 'y-component', value: 1, signed: true },
        phi: { name: 'angle of the mirror line', q: 'angle', unit: '°', value: 30, min: -90, max: 90, tex: '\\varphi' }
      },
      note: 'The first row of $F(\\varphi)$; the second is $y\' = x\\sin 2\\varphi - y\\cos 2\\varphi$. A mirror at 30° sends $(3, 1)$ to $(2.37, 2.10)$; a mirror at 45° would swap the two components, $(3, 1) \\to (1, 3)$.',
      practice: { unknowns: ['xp'] }
    }
  ],
  examples: [
    {
      title: 'Is it orthogonal?',
      q: 'Decide whether $Q = \\dfrac{1}{5}\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ is orthogonal, and if so whether it is a rotation or a reflection.',
      steps: [
        'Columns: $\\vec q_1 = (3, 4)/5$ and $\\vec q_2 = (-4, 3)/5$. Lengths: $\\sqrt{9 + 16}/5 = 1$ for both.',
        'Dot product: $(3\\cdot(-4) + 4\\cdot 3)/25 = 0$. The columns are orthonormal, so $Q$ is orthogonal.',
        'Determinant: $(3\\cdot 3 - (-4)\\cdot 4)/25 = 25/25 = +1$: a rotation, by the angle with $\\cos\\theta = 3/5$, $\\sin\\theta = 4/5$, that is $\\theta \\approx 53.1°$.',
        'Its inverse is the transpose, $\\frac15\\begin{pmatrix} 3 & 4 \\\\ -4 & 3 \\end{pmatrix}$ — the rotation by $-53.1°$.'
      ],
      a: 'Orthogonal; a rotation by about 53.1°, undone by its transpose.'
    },
    {
      title: 'Two mirrors make a rotation',
      q: 'Reflect in the $x$-axis, then in the line $y = x$. What single transformation is the result?',
      steps: [
        { text: 'The two reflections ($\\varphi = 0$ and $\\varphi = 45°$):', tex: 'F_1 = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}, \\qquad F_2 = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}' },
        { text: 'The second acts after the first, so multiply $F_2 F_1$:', tex: 'F_2 F_1 = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} = R(90°)' },
        'A rotation by 90°, twice the 45° between the mirrors. Its determinant is $(-1)(-1) = +1$, as a product of two reflections must be.'
      ],
      a: 'A rotation by 90° anticlockwise.'
    },
    {
      title: 'Coordinates along new axes',
      q: 'Find the coordinates of $\\vec x = (4, 2)$ along the perpendicular unit vectors $\\vec q_1 = (1, 1)/\\sqrt 2$ and $\\vec q_2 = (-1, 1)/\\sqrt 2$, and check the length.',
      steps: [
        '$c_1 = \\vec q_1\\cdot\\vec x = (4 + 2)/\\sqrt 2 = 3\\sqrt 2$ and $c_2 = \\vec q_2\\cdot\\vec x = (-4 + 2)/\\sqrt 2 = -\\sqrt 2$.',
        'So $\\vec x = 3\\sqrt 2\\,\\vec q_1 - \\sqrt 2\\,\\vec q_2$; no equations had to be solved.',
        'Length from the new coordinates: $\\sqrt{18 + 2} = \\sqrt{20}$, and directly $\\sqrt{16 + 4} = \\sqrt{20}$. Equal, as an orthonormal basis guarantees.'
      ],
      a: 'Coordinates (3√2, −√2); the length √20 is the same in both systems.'
    }
  ],
  quiz: [
    { q: 'A matrix $Q$ satisfies $Q^{\\mathsf T}Q = I$. Which statement is *not* guaranteed?', choices: ['$Q$ preserves all lengths', '$\\det Q = \\pm 1$', '$Q$ is a rotation', '$Q^{-1} = Q^{\\mathsf T}$'], a: 2,
      why: 'Orthogonal matrices include reflections ($\\det = -1$), which no rotation can reproduce. The other three follow directly from $Q^{\\mathsf T}Q = I$.' },
    { q: 'The matrix $\\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$ is orthogonal.', a: false,
      why: 'Its columns are perpendicular but have length 2, not 1; it doubles every length. Divide by 2 and it becomes the identity, which is orthogonal.' },
    { q: 'Write the determinant of the rotation matrix $R(t) = \\begin{pmatrix} \\cos t & -\\sin t \\\\ \\sin t & \\cos t \\end{pmatrix}$ as a function of $t$.', answer: '1', vars: ['t'],
      why: '$\\cos^2 t + \\sin^2 t = 1$ for every angle: a rotation preserves area and orientation.' },
    { q: 'A reflection in a line is applied twice. The result is…', choices: ['a reflection in the perpendicular line', 'the identity', 'a rotation by 180°', 'a rotation by twice the line\'s angle'], a: 1,
      why: 'Mirroring and mirroring back returns every point to where it was: $F^2 = I$. A reflection is its own inverse, as $F^{\\mathsf T} = F$ and $F^{\\mathsf T}F = I$ confirm.' },
    { q: 'Which is the cheapest way to invert a $1000\\times 1000$ orthogonal matrix?', choices: ['Gaussian elimination', 'take the transpose', 'compute the cofactors', 'it cannot be inverted'], a: 1,
      why: '$Q^{-1} = Q^{\\mathsf T}$: swapping rows and columns costs nothing compared with elimination, and introduces no rounding error.' }
  ],
  problems: [
    { q: 'The vector $(5, 0)$ is rotated by 60° about the origin. What is its new $y$-component?', answer: 4.330, tol: 0.01,
      steps: ['$y\' = x\\sin\\theta + y\\cos\\theta = 5\\sin 60° + 0 = 5\\cdot 0.866$.', 'So $y\' \\approx 4.33$; the $x$-component is $5\\cos 60° = 2.5$, and $2.5^2 + 4.33^2 = 25$ as it must.'] }
  ],
  applications: [
    'Computer graphics and robotics: every rigid motion of a model or a robot arm is an orthogonal matrix plus a shift.',
    'Crystallography and molecular physics: the symmetries of a crystal or a molecule form a group of orthogonal matrices.',
    'Numerical linear algebra: QR factorisation, eigenvalue and SVD algorithms are built from reflections and rotations.',
    'Signal processing: the discrete cosine transform behind JPEG and MP3 is an orthogonal change of basis.'
  ],
  history: 'The word "orthogonal" is Greek for right-angled. The study of these matrices as a group — the orthogonal group — grew out of nineteenth-century work on the motions that leave a quadratic form unchanged, by Jacobi, Cayley and later Sophus Lie.',
  sim: ['svd-orthogonal', 'vlc-matrix-transform']
},

{
  id: 'singular-value-decomposition', parent: 'matrices-topic', title: 'The singular value decomposition (SVD)', level: 3,
  short: 'Every matrix, square or not, is a rotation, then a stretch along perpendicular axes, then another rotation: A = U Σ Vᵀ. The stretch factors are the singular values, and they say everything about what the matrix can and cannot do.',
  keywords: ['SVD', 'singular value', 'singular vectors', 'U Sigma V transpose', 'left singular vector', 'right singular vector', 'rank', 'condition number', 'spectral norm', '2-norm', 'Frobenius norm', 'thin SVD', 'economy SVD', 'four fundamental subspaces', 'Jacobi', 'Golub–Kahan', 'polar decomposition'],
  prereq: ['orthogonal-matrices', 'eigenvalues', 'linear-transformations'],
  related: ['low-rank-approximation', 'pseudoinverse', 'principal-component-analysis', 'determinants', 'vector-spaces', 'matrix-inverse', 'physics:moment-of-inertia'],
  body: `
### Any matrix is a rotation, a stretch and a rotation
Take a $2\\times 2$ matrix and apply it to every point of the unit circle. Whatever the matrix — a shear, a projection, something with no symmetry at all — the circle always comes out as an **ellipse** (possibly squashed flat to a line segment). That is the whole idea. An ellipse is described by the directions of its axes and their lengths, and a little thought gives the recipe behind it: there is a pair of perpendicular directions $\\vec v_1, \\vec v_2$ in the input plane that the matrix sends to a pair of perpendicular directions $\\vec u_1, \\vec u_2$ in the output plane, stretched by factors $\\sigma_1 \\ge \\sigma_2 \\ge 0$:

$$A\\vec v_1 = \\sigma_1\\vec u_1, \\qquad A\\vec v_2 = \\sigma_2\\vec u_2$$

So the action of $A$ is: first rotate (turn $\\vec v_1, \\vec v_2$ onto the axes, which is $V^{\\mathsf T}$), then stretch along the axes by $\\sigma_1$ and $\\sigma_2$ (the diagonal matrix $\\Sigma$), then rotate again (turn the axes onto $\\vec u_1, \\vec u_2$, which is $U$). Written as matrices,

$$A = U\\,\\Sigma\\,V^{\\mathsf T}$$

This is the **singular value decomposition**. The numbers $\\sigma_i$ are the [[?singular-value|singular values]] of $A$, the columns of $V$ are its **right singular vectors** (the input directions) and the columns of $U$ are its **left singular vectors** (the output directions). $U$ and $V$ are [[orthogonal-matrices|orthogonal]]. In the simulation, drag the matrix and watch the ellipse; the **Stages** control walks through the three steps one at a time.

### The definition, for any shape
The picture is two-dimensional, but the theorem is not: every real $m\\times n$ matrix can be written $A = U\\Sigma V^{\\mathsf T}$ with $U$ an $m\\times m$ orthogonal matrix, $V$ an $n\\times n$ orthogonal matrix and $\\Sigma$ an $m\\times n$ matrix that is zero except for $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge \\sigma_p \\ge 0$ on its diagonal, $p = \\min(m, n)$. A $5\\times 3$ matrix has three singular values; so does a $3\\times 5$ one. Since only the first $p$ columns of $U$ and $V$ ever meet a non-zero $\\sigma$, the decomposition is often written in its **thin** (economy) form with $U$ of size $m\\times p$ and $\\Sigma$ square — the same product, fewer zeros. The singular values are unique; the vectors are unique up to sign when the singular values are distinct.

### Where the pieces come from
Multiply $A^{\\mathsf T}A$ out using the decomposition: $A^{\\mathsf T}A = V\\Sigma^{\\mathsf T}U^{\\mathsf T}U\\Sigma V^{\\mathsf T} = V(\\Sigma^{\\mathsf T}\\Sigma)V^{\\mathsf T}$. That is a diagonalisation of the symmetric matrix $A^{\\mathsf T}A$ ([[eigenvalues]]): its eigenvectors are the right singular vectors, and its eigenvalues are the squares of the singular values,

$$A^{\\mathsf T}A\\,\\vec v_i = \\sigma_i^2\\,\\vec v_i$$

In the same way $AA^{\\mathsf T}$ has the left singular vectors as eigenvectors, with the same eigenvalues. And $\\vec u_i = A\\vec v_i/\\sigma_i$ connects the two. That is how to compute a small SVD by hand: diagonalise $A^{\\mathsf T}A$ (a $2\\times 2$ symmetric matrix when $A$ has two columns), take square roots, and push the $\\vec v_i$ through $A$. The first worked example does it for $\\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$.

For a symmetric matrix with non-negative eigenvalues the SVD *is* the eigendecomposition, $U = V$. For a symmetric matrix with a negative eigenvalue the singular value is $|\\lambda|$ and the corresponding $\\vec u$ is $-\\vec v$. For a rotation every singular value is 1.

### What the singular values tell you
- **Rank.** The number of non-zero singular values is the [[?rank|rank]] of $A$. A singular value that is tiny but not zero means "nearly rank-deficient", which is the useful, honest version of the question "is this matrix singular?" that [[determinants|determinants]] answer badly for large matrices.
- **Size.** $\\sigma_1$ is the most $A$ can stretch any vector, $|A\\vec x| \\le \\sigma_1|\\vec x|$, the matrix **2-norm** $\\|A\\|_2$. The **Frobenius norm**, the root of the sum of the squares of all the entries, is $\\sqrt{\\sigma_1^2 + \\sigma_2^2 + \\cdots}$. For a square matrix, $|\\det A| = \\sigma_1\\sigma_2\\cdots\\sigma_n$ — the ellipse's area is $\\pi\\sigma_1\\sigma_2$.
- **Condition number.** $\\kappa = \\sigma_1/\\sigma_p$, the ratio of the largest stretch to the smallest. It measures how far from singular the matrix is and, as the [[pseudoinverse|next page]] shows, how much errors are amplified when equations are solved: $\\kappa = 1$ for an orthogonal matrix, $\\kappa = \\infty$ for a singular one, $\\kappa \\approx 1.6\\times 10^4$ already for the innocent-looking $4\\times 4$ Hilbert matrix with entries $1/(i + j - 1)$.
- **The four subspaces.** The left singular vectors with $\\sigma_i > 0$ span the column space of $A$ (everything $A$ can produce); the rest of the columns of $U$ span the left null space. The right singular vectors with $\\sigma_i > 0$ span the row space; the remaining columns of $V$ span the null space — the inputs that $A$ sends to zero ([[vector-spaces|rank–nullity]] in a picture). Every one of these bases is orthonormal, which is more than elimination ever gives.

### SVD and eigendecomposition
| | Eigendecomposition $A = PDP^{-1}$ | SVD $A = U\\Sigma V^{\\mathsf T}$ |
|---|---|---|
| Exists for | square matrices with enough eigenvectors | **every** matrix, any shape |
| Values | may be complex or negative | real and $\\ge 0$ |
| Vectors | one set, generally not perpendicular | two orthonormal sets (input and output) |
| Meaning | directions kept fixed: $A\\vec v = \\lambda\\vec v$ | perpendicular axes mapped to perpendicular axes |
| Use | dynamics, powers $A^n$, stability, modes | geometry, rank, norms, least squares, data |

An eigenvector of a shear or a rotation is a different and more delicate thing than a singular vector; the SVD never fails and never needs complex numbers.

### How computers do it
Forming $A^{\\mathsf T}A$ squares the condition number and loses accuracy, so real software does not do what the hand calculation does. The classical algorithm (Golub and Kahan, 1965) first turns $A$ into a bidiagonal matrix with Householder reflections and then chases the off-diagonal entries away with rotations; the **one-sided Jacobi** method, which this app uses, rotates pairs of columns until all columns are mutually perpendicular — their lengths are then the singular values and the accumulated rotations give $V$. Either way the cost is a few times $mn^2$ operations, and because only orthogonal transformations are applied the result is as accurate as the data allow. The **Algorithm** tab of [the SVD lab](#/tools/svdlab/algorithm) shows the Jacobi rotations one at a time.

> [!tip] Open [the SVD lab](#/tools/svdlab) to type in any matrix up to $8\\times 8$ and read off $U$, $\\Sigma$ and $V^{\\mathsf T}$, the rank, norms, condition number, the four subspaces and the pseudoinverse — then watch the same matrix compress an image, fit data and find principal axes.

### Where it is used
Image and data compression ([[low-rank-approximation]]), solving least-squares and rank-deficient systems ([[pseudoinverse]]), finding the main directions of a data cloud ([[principal-component-analysis]]), the polar decomposition $A = QP$ of a deformation into a rotation and a pure stretch (continuum mechanics), the best rotation aligning two point sets (Kabsch's method for molecules and 3-D scans), quantum entanglement (the Schmidt decomposition is the SVD of the state), recommender systems and the numerical rank of almost everything.
`,
  ideas: [
    'A = U Σ Vᵀ: rotate (Vᵀ), stretch along the axes (Σ), rotate (U). It exists for every matrix.',
    'The singular values σ₁ ≥ σ₂ ≥ … ≥ 0 are the semi-axes of the ellipse the unit circle becomes.',
    'σᵢ² are the eigenvalues of AᵀA; the vᵢ are its eigenvectors; uᵢ = A vᵢ / σᵢ.',
    'Count the non-zero σ for the rank; σ₁ is the 2-norm; σ₁/σₙ is the condition number; |det| = Π σ.',
    'The singular vectors give orthonormal bases of the column space, row space and both null spaces.'
  ],
  pitfalls: [
    'Singular values are eigenvalues — They are the square roots of the eigenvalues of AᵀA. For a symmetric matrix σ = |λ|; for a rotation all σ = 1 while the eigenvalues are complex.',
    'U and V are the same thing — V holds the input directions, U the output directions; they coincide only for symmetric positive matrices.',
    'A non-square matrix has no decomposition — The SVD exists for every shape; that is its main advantage over eigenvalues.',
    'Compute it from AᵀA — Fine by hand for a 2 × 2; in software it squares the condition number and loses half the digits.'
  ],
  derivation: {
    title: 'Why perpendicular inputs go to perpendicular outputs',
    steps: [
      { text: '$A^{\\mathsf T}A$ is symmetric, so by the spectral theorem it has orthonormal eigenvectors $\\vec v_1, \\ldots, \\vec v_n$ with real eigenvalues $\\lambda_i$:', tex: 'A^{\\mathsf T}A\\,\\vec v_i = \\lambda_i\\vec v_i' },
      { text: 'The eigenvalues cannot be negative, because', tex: '\\lambda_i = \\vec v_i^{\\mathsf T}A^{\\mathsf T}A\\vec v_i = |A\\vec v_i|^2 \\ge 0' },
      { text: 'So write $\\lambda_i = \\sigma_i^2$. The images of two different eigenvectors are perpendicular:', tex: '(A\\vec v_i)\\cdot(A\\vec v_j) = \\vec v_i^{\\mathsf T}A^{\\mathsf T}A\\vec v_j = \\sigma_j^2\\,\\vec v_i\\cdot\\vec v_j = 0' },
      { text: 'and $|A\\vec v_i| = \\sigma_i$. Define $\\vec u_i = A\\vec v_i/\\sigma_i$ for $\\sigma_i > 0$ (unit vectors, perpendicular to each other) and complete them to an orthonormal basis.', tex: 'A\\vec v_i = \\sigma_i\\vec u_i \\quad\\Longrightarrow\\quad AV = U\\Sigma \\quad\\Longrightarrow\\quad A = U\\Sigma V^{\\mathsf T}' }
    ]
  },
  formulas: [
    {
      name: 'Singular value from an eigenvalue of AᵀA',
      expr: 'sigma = sqrt(lambda)', tex: '\\sigma = \\sqrt{\\lambda}',
      vars: {
        sigma: { name: 'singular value of A' },
        lambda: { name: 'eigenvalue of AᵀA', value: 45 }
      },
      note: 'The eigenvalues of $A^{\\mathsf T}A$ are never negative. For $A = \\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$ they are 45 and 5, so $\\sigma_1 = 3\\sqrt 5 \\approx 6.71$ and $\\sigma_2 = \\sqrt 5 \\approx 2.24$.',
      practice: { unknowns: ['sigma', 'lambda'] }
    },
    {
      name: 'Largest singular value of a 2 × 2 matrix',
      expr: 'sigma1 = sqrt((S + sqrt(S^2 - 4*D^2))/2)', tex: '\\sigma_1 = \\sqrt{\\frac{S + \\sqrt{S^2 - 4D^2}}{2}}',
      vars: {
        sigma1: { name: 'largest singular value', tex: '\\sigma_1' },
        S: { name: 'sum of the squares of the four entries, a² + b² + c² + d²', value: 50 },
        D: { name: '|ad − bc|, the absolute determinant', value: 15 }
      },
      note: '$\\sigma_1^2$ and $\\sigma_2^2$ are the roots of $\\lambda^2 - S\\lambda + D^2 = 0$, since $\\operatorname{tr}(A^{\\mathsf T}A) = S$ and $\\det(A^{\\mathsf T}A) = D^2$. For $\\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$, $S = 50$ and $D = 15$: $\\sigma_1 = \\sqrt{45}$.',
      practice: { unknowns: ['sigma1'] }
    },
    {
      name: 'Smallest singular value of a 2 × 2 matrix',
      expr: 'sigma2 = sqrt((S - sqrt(S^2 - 4*D^2))/2)', tex: '\\sigma_2 = \\sqrt{\\frac{S - \\sqrt{S^2 - 4D^2}}{2}}',
      vars: {
        sigma2: { name: 'smallest singular value', tex: '\\sigma_2' },
        S: { name: 'sum of the squares of the four entries', value: 50 },
        D: { name: '|ad − bc|', value: 15 }
      },
      note: 'Zero exactly when $D = 0$: a singular matrix flattens the circle to a segment. Also $\\sigma_2 = D/\\sigma_1$.',
      practice: { unknowns: ['sigma2'] }
    },
    {
      name: 'Condition number',
      expr: 'kappa = s1/sn', tex: '\\kappa = \\frac{\\sigma_1}{\\sigma_n}',
      vars: {
        kappa: { name: 'condition number', tex: '\\kappa' },
        s1: { name: 'largest singular value', value: 6.708, tex: '\\sigma_1' },
        sn: { name: 'smallest singular value', value: 2.236, tex: '\\sigma_n' }
      },
      note: '1 for an orthogonal matrix, infinite for a singular one. A rule of thumb: solving $A\\vec x = \\vec b$ loses about $\\log_{10}\\kappa$ significant digits.',
      stories: { kappa: 'A matrix has largest singular value {s1} and smallest {sn}. What is its condition number?' },
      practice: { unknowns: ['kappa', 'sn'] }
    },
    {
      name: 'Determinant and Frobenius norm of a 2 × 2 from its singular values',
      expr: 'F = sqrt(s1^2 + s2^2)', tex: '{\\|A\\|}_F = \\sqrt{\\sigma_1^2 + \\sigma_2^2}',
      vars: {
        F: { name: 'Frobenius norm (root of the sum of the squared entries)', tex: '{\\|A\\|}_F' },
        s1: { name: 'σ₁', value: 6.708, tex: '\\sigma_1' },
        s2: { name: 'σ₂', value: 2.236, tex: '\\sigma_2' }
      },
      note: 'For $\\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$: $\\sqrt{45 + 5} = \\sqrt{50}$, and directly $\\sqrt{9 + 0 + 16 + 25} = \\sqrt{50}$. The absolute determinant is the product, $\\sigma_1\\sigma_2 = 15$.',
      practice: { unknowns: ['F'] }
    }
  ],
  examples: [
    {
      title: 'A 2 × 2 SVD by hand',
      q: 'Find the singular value decomposition of $A = \\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$.',
      steps: [
        { text: 'Form $A^{\\mathsf T}A$:', tex: 'A^{\\mathsf T}A = \\begin{pmatrix} 3 & 4 \\\\ 0 & 5 \\end{pmatrix}\\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix} = \\begin{pmatrix} 25 & 20 \\\\ 20 & 25 \\end{pmatrix}' },
        'Its eigenvalues solve $\\lambda^2 - 50\\lambda + 225 = 0$: $\\lambda = 45$ and $\\lambda = 5$. So $\\sigma_1 = \\sqrt{45} = 3\\sqrt 5$ and $\\sigma_2 = \\sqrt 5$. Check: $\\sigma_1\\sigma_2 = 15 = \\det A$.',
        'Eigenvectors: for $\\lambda = 45$, $(25 - 45)v_1 + 20v_2 = 0$ gives $\\vec v_1 = (1, 1)/\\sqrt 2$; for $\\lambda = 5$, $\\vec v_2 = (1, -1)/\\sqrt 2$. These are the columns of $V$.',
        { text: 'Push them through $A$ and divide by the singular values:', tex: '\\vec u_1 = \\frac{A\\vec v_1}{\\sigma_1} = \\frac{(3, 9)/\\sqrt 2}{3\\sqrt 5} = \\frac{(1, 3)}{\\sqrt{10}}, \\qquad \\vec u_2 = \\frac{A\\vec v_2}{\\sigma_2} = \\frac{(3, -1)/\\sqrt 2}{\\sqrt 5} = \\frac{(3, -1)}{\\sqrt{10}}' },
        { text: 'So', tex: 'A = \\frac{1}{\\sqrt{10}}\\begin{pmatrix} 1 & 3 \\\\ 3 & -1 \\end{pmatrix}\\begin{pmatrix} 3\\sqrt 5 & 0 \\\\ 0 & \\sqrt 5 \\end{pmatrix}\\frac{1}{\\sqrt 2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}' },
        'Geometrically: $A$ turns the direction $(1, 1)$ onto $(1, 3)$ stretched 6.7 times, and the perpendicular direction $(1, -1)$ onto $(3, -1)$ stretched 2.2 times. The unit circle becomes an ellipse with semi-axes 6.7 and 2.2 along $(1, 3)$ and $(3, -1)$.'
      ],
      a: 'σ₁ = 3√5 ≈ 6.71 and σ₂ = √5 ≈ 2.24, with v₁ = (1, 1)/√2 → u₁ = (1, 3)/√10 and v₂ = (1, −1)/√2 → u₂ = (3, −1)/√10.'
    },
    {
      title: 'A rank-one matrix',
      q: 'Find the SVD of $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\\\ 3 & 6 \\end{pmatrix}$ and interpret it.',
      steps: [
        'Every column is a multiple of $(1, 2, 3)$ and every row a multiple of $(1, 2)$: the matrix is $A = (1, 2, 3)^{\\mathsf T}(1, 2)$, an outer product, so its rank is 1 and it has only one non-zero singular value.',
        '$\\vec v_1$ is the row direction normalised, $(1, 2)/\\sqrt 5$; $\\vec u_1$ is the column direction normalised, $(1, 2, 3)/\\sqrt{14}$.',
        '$\\sigma_1 = |A\\vec v_1| = \\sqrt 5\\cdot\\sqrt{14} = \\sqrt{70} \\approx 8.37$ — the product of the two lengths. Check with the Frobenius norm: $\\sqrt{1 + 4 + 4 + 16 + 9 + 36} = \\sqrt{70}$, all of it in $\\sigma_1$ since $\\sigma_2 = 0$.',
        'The null space is spanned by $\\vec v_2 = (2, -1)/\\sqrt 5$ (indeed $A\\vec v_2 = 0$); the column space is the line through $(1, 2, 3)$, and the left null space is the plane perpendicular to it, spanned by the other two columns of the full $U$.'
      ],
      a: 'A = √70 · u₁v₁ᵀ with u₁ = (1, 2, 3)/√14, v₁ = (1, 2)/√5; rank 1, σ₂ = 0, null space along (2, −1).'
    },
    {
      title: 'Reading a decomposition',
      q: 'A $3\\times 3$ matrix has singular values $10$, $1$ and $0.001$. What does that say about it?',
      steps: [
        'All three are non-zero, so the matrix is invertible and has rank 3 — but only just: the third direction is stretched by a thousandth, almost flattened away. In practice it behaves like a rank-2 matrix with a little noise.',
        'The condition number is $\\kappa = 10/0.001 = 10^4$: a 1 % error in the right-hand side of $A\\vec x = \\vec b$ can become a 10 000 % error in $\\vec x$ (in the worst direction).',
        '$|\\det A| = 10\\cdot 1\\cdot 0.001 = 0.01$ — not a small number in itself, which is why the determinant is a poor guide to near-singularity; the singular values tell the story.',
        'The 2-norm is 10, the Frobenius norm $\\sqrt{100 + 1 + 10^{-6}} \\approx 10.05$, and the best rank-2 approximation misses the matrix by only 0.001.'
      ],
      a: 'Invertible but nearly rank 2, κ = 10⁴, |det| = 0.01, ‖A‖₂ = 10.'
    }
  ],
  quiz: [
    { q: 'A $4\\times 6$ matrix has how many singular values?', choices: ['4', '6', '10', '24'], a: 0,
      why: '$p = \\min(m, n) = 4$. Some of them may be zero; the number of non-zero ones is the rank, at most 4.' },
    { q: 'The singular values of $\\begin{pmatrix} a & 0 \\\\ 0 & -b \\end{pmatrix}$ with $a > b > 0$ are…', choices: ['$a$ and $-b$', '$a$ and $b$', '$a^2$ and $b^2$', '$\\sqrt a$ and $\\sqrt b$'], a: 1,
      why: 'Singular values are never negative: they are the absolute values of the eigenvalues of a symmetric matrix. The sign goes into $U$: $\\vec u_2 = -\\vec v_2$.' },
    { q: 'Every $2\\times 2$ matrix sends the unit circle to an ellipse (or a segment).', a: true,
      why: 'That is the geometric content of the SVD: rotate, stretch along two perpendicular axes, rotate. The semi-axes are $\\sigma_1$ and $\\sigma_2$; a segment is the case $\\sigma_2 = 0$.' },
    { q: 'The largest singular value of a rotation matrix $R(t)$ is…', answer: '1', vars: ['t'],
      why: 'A rotation changes no length, so every stretch factor is 1: $\\sigma_1 = \\sigma_2 = 1$ whatever the angle.' },
    { q: 'Which matrix has the largest condition number?', choices: ['a rotation by 45°', 'diag(100, 100)', 'diag(1, 0.01)', 'the identity'], a: 2,
      why: '$\\kappa = \\sigma_1/\\sigma_n$: the rotation and the identity have 1, diag(100, 100) has $100/100 = 1$ too (it is a uniform scaling), and diag(1, 0.01) has 100.' },
    { q: 'For $A = U\\Sigma V^{\\mathsf T}$, the eigenvectors of $AA^{\\mathsf T}$ are…', choices: ['the columns of $V$', 'the columns of $U$', 'the diagonal of $\\Sigma$', 'the rows of $A$'], a: 1,
      why: '$AA^{\\mathsf T} = U\\Sigma\\Sigma^{\\mathsf T}U^{\\mathsf T}$: $U$ diagonalises it, with eigenvalues $\\sigma_i^2$. $V$ does the same for $A^{\\mathsf T}A$.' }
  ],
  problems: [
    { q: 'The entries of a $2\\times 2$ matrix have squares summing to $S = 50$ and its determinant is 15. What is its smallest singular value?', answer: 2.236, tol: 0.01,
      steps: ['$\\sigma^2$ solves $\\lambda^2 - 50\\lambda + 225 = 0$: $\\lambda = 25 \\pm \\sqrt{625 - 225} = 25 \\pm 20$.', 'So $\\sigma_2^2 = 5$ and $\\sigma_2 = \\sqrt 5 \\approx 2.236$ (and $\\sigma_1 = \\sqrt{45}$).'] },
    { q: 'A matrix has singular values 8, 4, 2 and 0.5. What is its condition number?', answer: 16, tol: 0.001,
      steps: ['$\\kappa = \\sigma_1/\\sigma_n = 8/0.5$.', 'So $\\kappa = 16$: errors can grow sixteenfold when the matrix is inverted.'] }
  ],
  applications: [
    'Image, audio and data compression by keeping the largest singular values.',
    'Least-squares fitting, calibration and tomography through the pseudoinverse.',
    'Principal component analysis in statistics, genetics, finance and face recognition.',
    'Continuum mechanics: the polar decomposition of a deformation into rotation and stretch.',
    'Aligning molecules or 3-D scans (Kabsch), control theory (Hankel singular values), quantum entanglement (Schmidt decomposition).'
  ],
  history: 'Eugenio Beltrami (1873) and Camille Jordan (1874) found the decomposition for square matrices independently; James Joseph Sylvester rediscovered it in 1889 and coined "canonical multipliers". Erhard Schmidt (1907) extended it to integral operators, and Carl Eckart and Gale Young (1936) proved the approximation property that makes it indispensable today. Gene Golub and William Kahan (1965) gave the stable algorithm that software still uses.',
  sim: ['svd-geometry']
},

{
  id: 'low-rank-approximation', parent: 'matrices-topic', title: 'Low-rank approximation and compression', level: 3,
  short: 'A matrix is a sum of rank-one layers σᵢ uᵢ vᵢᵀ, from the most important down. Keeping the first k gives the best possible rank-k approximation — the principle behind image compression, noise removal and recommender systems.',
  keywords: ['low-rank approximation', 'truncated SVD', 'Eckart–Young', 'rank-k', 'image compression', 'compression ratio', 'rank-one matrix', 'outer product', 'energy', 'noise reduction', 'latent factors', 'matrix completion', 'spectrum of singular values'],
  prereq: ['singular-value-decomposition', 'vector-spaces'],
  related: ['pseudoinverse', 'principal-component-analysis', 'fourier-series', 'matrix-multiplication', 'physics:superposition'],
  body: `
### A matrix as a sum of layers
Multiply $U\\Sigma V^{\\mathsf T}$ out column by column and the decomposition becomes a sum:

$$A = \\sigma_1\\,\\vec u_1\\vec v_1^{\\mathsf T} + \\sigma_2\\,\\vec u_2\\vec v_2^{\\mathsf T} + \\cdots + \\sigma_r\\,\\vec u_r\\vec v_r^{\\mathsf T}$$

Each term $\\vec u_i\\vec v_i^{\\mathsf T}$ is an **outer product**: an $m\\times n$ matrix of rank one, whose every column is a multiple of $\\vec u_i$ and every row a multiple of $\\vec v_i^{\\mathsf T}$. It is a very simple object — it costs $m + n$ numbers to describe instead of $mn$ — and the singular value in front says how much of $A$ it carries. Because the $\\vec u_i$ are perpendicular to each other and so are the $\\vec v_i$, the layers do not interfere: the squared Frobenius norm of $A$ is simply $\\sigma_1^2 + \\sigma_2^2 + \\cdots$, each layer contributing its own share.

### The best approximation of rank k
Stop the sum after $k$ terms:

$$A_k = \\sum_{i=1}^{k}\\sigma_i\\,\\vec u_i\\vec v_i^{\\mathsf T}$$

This matrix has rank $k$, and the **Eckart–Young theorem** says it is the *closest* rank-$k$ matrix to $A$ there is — no other matrix of rank $k$ comes nearer, whether distance is measured by the 2-norm or the Frobenius norm. The error is known exactly:

$$\\|A - A_k\\|_2 = \\sigma_{k+1}, \\qquad \\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\cdots + \\sigma_r^2}$$

So the list of singular values, read from the top, is a complete account of how well $A$ can be compressed. If it drops fast, a few layers reproduce the matrix almost perfectly; if it is flat, nothing short of the whole thing will do. The fraction $(\\sigma_1^2 + \\cdots + \\sigma_k^2)/(\\sigma_1^2 + \\cdots + \\sigma_r^2)$ is called the **energy** captured by the first $k$ layers.

### Compressing a picture
A grey-scale photograph is a matrix of brightnesses. A $512\\times 512$ image holds $262\\,144$ numbers; its best rank-20 approximation needs only $20\\times(512 + 512 + 1) = 20\\,500$ — less than 8 % — and for most photographs it is already recognisable, with the sharp edges the last to come back. Photographs compress well because neighbouring rows and columns are alike, so a few $\\vec u$ and $\\vec v$ patterns describe them; pure noise, in which nothing is alike, has a flat spectrum and does not compress at all. (JPEG uses a fixed basis — cosines, see [[fourier-series]] — on small blocks instead of a basis tailored to the picture, which is cheaper; the SVD basis is the *optimal* one for a given matrix.) The simulation lets you move $k$ and watch the picture, the error and the storage.

### Separating signal from noise
Add random noise of standard deviation $\\varepsilon$ to every entry of an $n\\times n$ matrix of rank $k$. The noise alone has singular values of order $2\\varepsilon\\sqrt n$, all about the same size, while the signal's $k$ singular values stand above them. Truncating after the gap discards most of the noise and keeps most of the signal: this is the basis of denoising in spectroscopy, of noise-robust fitting ([[pseudoinverse]]) and of the "number of components" decision in [[principal-component-analysis|principal component analysis]]. Picking $k$ from the spectrum — the knee of the plot, or a target energy such as 95 % — is the practical art.

### Latent factors
A table of ratings — people down the rows, films across the columns — is mostly empty and very noisy, yet a rank of ten or twenty describes it well: each person is a short list of tastes, each film a short list of qualities, and a rating is a dot product of the two. The rows of $U\\Sigma$ and $V$ are those lists, found by the matrix itself rather than labelled by anyone. Recommender systems, text analysis (latent semantic indexing), genetics (populations as factors) and the reduction of large simulations all rest on the same idea: the data has far fewer *effective* dimensions than apparent ones, and the SVD finds them.
`,
  ideas: [
    'A = Σ σᵢ uᵢ vᵢᵀ: a sum of rank-one layers, each a pattern in the rows times a pattern in the columns.',
    'A_k, the first k layers, is the closest rank-k matrix to A (Eckart–Young); the error is σ_{k+1}.',
    'Storage drops from mn numbers to k(m + n + 1).',
    'A fast-falling spectrum means compressible; a flat one (noise) does not compress.',
    'Truncating after a gap in the spectrum removes noise and reveals the effective dimension of the data.'
  ],
  pitfalls: [
    'Any k layers will do — Only the first k (largest σ) give the best approximation; dropping σ₁ and keeping the rest is the worst choice.',
    'Compression always wins — A rank-k matrix needs k(m + n + 1) numbers; for k near min(m, n) that is more than mn.',
    'The truncation error is the sum of the dropped singular values — In the 2-norm it is just σ_{k+1}; in the Frobenius norm it is the root of the sum of their squares.'
  ],
  formulas: [
    {
      name: 'Numbers stored by a rank-k approximation',
      expr: 'N = k*(m + n + 1)', tex: 'N = k\\,(m + n + 1)',
      vars: {
        N: { name: 'numbers to store', int: true },
        k: { name: 'rank kept', value: 20, int: true },
        m: { name: 'rows of the matrix', value: 512, int: true },
        n: { name: 'columns of the matrix', value: 512, int: true }
      },
      note: 'Each layer needs a column of $U$ ($m$ numbers), a column of $V$ ($n$ numbers) and its $\\sigma$. The full matrix needs $mn$.',
      stories: { N: 'A {m} × {n} image is kept as its best rank-{k} approximation. How many numbers must be stored?', k: 'A {m} × {n} image may use {N} numbers of storage. How many layers can be kept?' },
      practice: { unknowns: ['N', 'k'] }
    },
    {
      name: 'Compression ratio',
      expr: 'r = m*n/(k*(m + n + 1))', tex: 'r = \\frac{mn}{k\\,(m + n + 1)}',
      vars: {
        r: { name: 'compression ratio (full size ÷ stored size)' },
        k: { name: 'rank kept', value: 20, int: true },
        m: { name: 'rows', value: 512, int: true },
        n: { name: 'columns', value: 512, int: true }
      },
      note: 'Greater than 1 means a saving. For a square $n\\times n$ matrix the saving starts below $k \\approx n/2$.',
      practice: { unknowns: ['r', 'k'] }
    },
    {
      name: 'Energy captured by the first two of three layers',
      expr: 'f = (s1^2 + s2^2)/(s1^2 + s2^2 + s3^2)', tex: 'f = \\frac{\\sigma_1^2 + \\sigma_2^2}{\\sigma_1^2 + \\sigma_2^2 + \\sigma_3^2}',
      vars: {
        f: { name: 'fraction of the squared Frobenius norm kept' },
        s1: { name: 'σ₁', value: 10, tex: '\\sigma_1' },
        s2: { name: 'σ₂', value: 4, tex: '\\sigma_2' },
        s3: { name: 'σ₃ (dropped)', value: 1, tex: '\\sigma_3' }
      },
      note: 'The layers are orthogonal, so squared norms add. With $\\sigma = 10, 4, 1$ the first two layers hold $116/117 = 99.1\\,\\%$ of the energy, and the rank-2 error is $\\sigma_3 = 1$.',
      practice: { unknowns: ['f', 's3'] }
    }
  ],
  examples: [
    {
      title: 'The best rank-one approximation',
      q: 'Find the closest rank-one matrix to $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and the size of the error.',
      steps: [
        '$A$ is symmetric with eigenvalues 3 and 1 and eigenvectors $(1, 1)/\\sqrt 2$ and $(1, -1)/\\sqrt 2$, so $\\sigma_1 = 3$, $\\sigma_2 = 1$ and $\\vec u_i = \\vec v_i$.',
        { text: 'The first layer:', tex: 'A_1 = \\sigma_1\\vec u_1\\vec v_1^{\\mathsf T} = 3\\cdot\\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1.5 & 1.5 \\\\ 1.5 & 1.5 \\end{pmatrix}' },
        { text: 'The remainder is the second layer:', tex: 'A - A_1 = \\begin{pmatrix} 0.5 & -0.5 \\\\ -0.5 & 0.5 \\end{pmatrix} = 1\\cdot\\frac12\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}' },
        'Its 2-norm is $\\sigma_2 = 1$ and its Frobenius norm is $\\sqrt{4\\times 0.25} = 1$ too. Energy kept: $9/(9 + 1) = 90\\,\\%$.'
      ],
      a: 'A₁ = 1.5 · [[1, 1], [1, 1]], error σ₂ = 1, 90 % of the energy.'
    },
    {
      title: 'How much does a photograph shrink?',
      q: 'A $1000\\times 800$ grey image is stored as its rank-50 approximation. Find the storage, the compression ratio, and the rank at which the method stops saving space.',
      steps: [
        'Full: $1000\\times 800 = 800\\,000$ numbers.',
        'Rank 50: $50\\times(1000 + 800 + 1) = 90\\,050$ numbers, a ratio of $800\\,000/90\\,050 \\approx 8.9$.',
        'Break-even: $k(1801) = 800\\,000$ gives $k \\approx 444$. Beyond that the "compressed" form is larger than the picture.',
        'Whether rank 50 *looks* good depends on the spectrum: for a typical photograph $\\sigma_{51}/\\sigma_1$ is a few per cent and the result is close; for a page of fine text it is not.'
      ],
      a: '90 050 numbers, ratio ≈ 8.9; no saving beyond k ≈ 444.'
    },
    {
      title: 'Seeing through noise',
      q: 'A $100\\times 100$ measurement matrix should have rank 2 but every entry carries noise of standard deviation 0.1. Its singular values come out as $31.6$, $12.4$, $2.1$, $2.0$, $1.9$, …. What is going on and what should be kept?',
      steps: [
        'Noise of size $\\varepsilon$ in an $n\\times n$ matrix produces singular values up to about $2\\varepsilon\\sqrt n = 2\\times 0.1\\times 10 = 2$ — exactly the level of the third value onward.',
        'The first two stand far above that floor: they are the signal. The gap between 12.4 and 2.1 is the sign of an effective rank of 2.',
        'Keeping $k = 2$ reproduces the signal while discarding all 98 noise layers. The Frobenius norm of what is dropped, $\\sqrt{2.1^2 + 2.0^2 + \\cdots}$, is about $\\varepsilon\\sqrt{n^2} = 10$, the noise itself.'
      ],
      a: 'Rank 2 plus a noise floor near 2; keep the first two layers.'
    }
  ],
  quiz: [
    { q: 'A matrix has singular values 9, 3, 1. The 2-norm error of its best rank-1 approximation is…', choices: ['9', '3', '4', '$\\sqrt{10}$'], a: 1,
      why: '$\\|A - A_1\\|_2 = \\sigma_2 = 3$. The Frobenius error would be $\\sqrt{9 + 1} = \\sqrt{10}$.' },
    { q: 'Write the number of values stored by a rank-$k$ approximation of a square $n\\times n$ matrix.', answer: 'k*(2n + 1)', vars: ['k', 'n'],
      why: '$k(m + n + 1)$ with $m = n$.' },
    { q: 'An outer product $\\vec u\\vec v^{\\mathsf T}$ of two non-zero vectors always has rank 1.', a: true,
      why: 'Every column is a multiple of $\\vec u$, so the column space is one-dimensional.' },
    { q: 'Which matrix is hardest to compress with a low-rank approximation?', choices: ['a smooth gradient of brightness', 'a photograph of a face', 'a matrix of independent random numbers', 'a checkerboard of two colours'], a: 2,
      why: 'Random entries have a flat spectrum: all singular values are about the same size, so dropping any of them loses as much as keeping them. The checkerboard has rank 1 (or 2); the gradient has rank 2; a face compresses well.' },
    { q: 'If the first three singular values hold 99 % of the energy, then $\\|A - A_3\\|_F$ is…', choices: ['1 % of $\\|A\\|_F$', '10 % of $\\|A\\|_F$', '99 % of $\\|A\\|_F$', '$\\sigma_4$'], a: 1,
      why: 'Energy is squared norm: the dropped part has 1 % of $\\|A\\|_F^2$, so its norm is $\\sqrt{0.01} = 10\\,\\%$ of $\\|A\\|_F$.' }
  ],
  problems: [
    { q: 'A $600\\times 400$ image is stored at rank 30. What is the compression ratio?', answer: 7.99, tol: 0.01,
      steps: ['Stored: $30\\times(600 + 400 + 1) = 30\\,030$.', 'Full: $240\\,000$. Ratio $240\\,000/30\\,030 \\approx 7.99$.'] },
    { q: 'Singular values 12, 6, 3, 1. What fraction of the energy do the first two layers hold (as a percentage)?', answer: 94.7, tol: 0.01,
      steps: ['Squares: 144, 36, 9, 1, total 190.', 'First two: $180/190 = 0.947$, that is 94.7 %.'] }
  ],
  applications: [
    'Image and video compression, and thumbnails that keep the gist of a picture.',
    'Noise removal in spectra, seismic data and medical images.',
    'Recommender systems: tastes and qualities as latent factors.',
    'Reduced-order models of large simulations (proper orthogonal decomposition).',
    'Text search (latent semantic indexing) and population genetics.'
  ],
  history: 'Carl Eckart and Gale Young proved in 1936 that the truncated SVD is the best low-rank approximation in the Frobenius norm; Leon Mirsky showed in 1960 that the same holds for every norm that depends only on the singular values. The idea had been used for integral operators by Erhard Schmidt in 1907, which is why the theorem is sometimes credited to him as well.',
  sim: ['svd-lowrank']
},

{
  id: 'pseudoinverse', parent: 'matrices-topic', title: 'The pseudoinverse, least squares and conditioning', level: 3,
  short: 'When Ax = b has no solution or too many, the SVD gives the best one: A⁺ = V Σ⁺ Uᵀ inverts what can be inverted and ignores the rest. It also shows how errors in b are amplified — by the condition number — and how to tame them.',
  keywords: ['pseudoinverse', 'Moore–Penrose', 'generalised inverse', 'least squares', 'normal equations', 'minimum-norm solution', 'overdetermined', 'underdetermined', 'rank-deficient', 'condition number', 'ill-conditioned', 'truncated SVD', 'Tikhonov regularisation', 'ridge regression', 'residual'],
  prereq: ['singular-value-decomposition', 'matrix-inverse', 'linear-regression'],
  related: ['gaussian-elimination', 'low-rank-approximation', 'vector-projection', 'error-propagation', 'principal-component-analysis'],
  body: `
### When there is no exact answer
Fit a straight line $y = c_0 + c_1 x$ to twenty measured points. That is twenty equations in two unknowns, $A\\vec c = \\vec y$ with a $20\\times 2$ matrix $A$ whose rows are $(1, x_i)$, and because of measurement noise no line passes through all the points: the system is **overdetermined** and has no solution. The [[linear-regression|least-squares]] answer asks instead for the $\\vec c$ that makes the residual $|A\\vec c - \\vec y|$ as small as possible. Geometrically $A\\vec c$ ranges over the column space of $A$ — a plane in twenty-dimensional space — and the best $A\\vec c$ is the [[vector-projection|projection]] of $\\vec y$ onto it, so the residual is perpendicular to every column: $A^{\\mathsf T}(A\\vec c - \\vec y) = 0$. These are the **normal equations**,

$$A^{\\mathsf T}A\\,\\vec c = A^{\\mathsf T}\\vec y$$

a square system that elimination can solve — when $A^{\\mathsf T}A$ is invertible, which needs the columns of $A$ to be independent.

### The pseudoinverse
The SVD solves the same problem without any condition, and more clearly. Write $A = U\\Sigma V^{\\mathsf T}$ and define

$$A^{+} = V\\,\\Sigma^{+}U^{\\mathsf T}, \\qquad \\Sigma^{+} = \\operatorname{diag}\\!\\left(\\tfrac{1}{\\sigma_1}, \\ldots, \\tfrac{1}{\\sigma_r}, 0, \\ldots, 0\\right)^{\\mathsf T}$$

Invert every non-zero singular value, leave the zeros as zeros, and transpose the shape. This $n\\times m$ matrix is the **Moore–Penrose pseudoinverse** ([[?pseudoinverse]]), and $\\vec x = A^{+}\\vec b$ is *the* answer to $A\\vec x = \\vec b$ in every case:

- if $A$ is square and invertible, $A^{+} = A^{-1}$ and $\\vec x$ is the exact solution;
- if the system is overdetermined, $\\vec x$ is the least-squares solution (it agrees with the normal equations);
- if the system is **underdetermined** — more unknowns than independent equations, so infinitely many solutions — $\\vec x$ is the one of smallest length, the **minimum-norm solution**;
- if $A$ is rank-deficient, both at once: the residual is as small as it can be, and among the $\\vec x$ that achieve it the shortest is chosen.

In words: $U^{\\mathsf T}\\vec b$ expresses $\\vec b$ in the output directions, $\\Sigma^{+}$ undoes the stretches that can be undone and drops the components that $A$ could never have produced (the left null space) or that would need to come from the null space (which contributes nothing to $A\\vec x$, so the shortest solution leaves it out), and $V$ turns the result back into input coordinates. The pseudoinverse is characterised by four algebraic conditions — $AA^{+}A = A$, $A^{+}AA^{+} = A^{+}$, and $AA^{+}$ and $A^{+}A$ both symmetric — and $AA^{+}$ is exactly the projection onto the column space.

### How errors are amplified
Perturb the right-hand side a little, $\\vec b \\to \\vec b + \\delta\\vec b$. The solution changes by $A^{+}\\delta\\vec b$, and in the worst direction (along $\\vec u_n$) this is divided by the *smallest* singular value, while $\\vec b$ itself can be as large as $\\sigma_1|\\vec x|$. Combining the two,

$$\\frac{|\\delta\\vec x|}{|\\vec x|} \\le \\kappa\\,\\frac{|\\delta\\vec b|}{|\\vec b|}, \\qquad \\kappa = \\frac{\\sigma_1}{\\sigma_n}$$

The [[?condition-number|condition number]] is the amplification factor for relative errors — the matrix version of [[error-propagation|error propagation]]. With $\\kappa = 10^6$ and data good to six digits, the answer may have none. The example below shows two equations that look harmless, $\\kappa \\approx 4\\times 10^4$, and a solution that swings wildly under a change in the fourth decimal of $\\vec b$. Note what this does to the normal equations: $A^{\\mathsf T}A$ has singular values $\\sigma_i^2$, so its condition number is $\\kappa^2$. A fit with $\\kappa = 10^4$ is fine through the SVD and loses eight digits through the normal equations — which is why serious least-squares software never forms $A^{\\mathsf T}A$.

### Taming an ill-conditioned problem
A tiny singular value means a direction in which the data barely constrain the answer, so any noise there is blown up. Two cures, both read straight off the SVD:

- **Truncation.** Treat singular values below a threshold as zero — use $A^{+}$ with $r$ replaced by a smaller $k$. The solution loses the poorly determined components and keeps the rest.
- **Tikhonov regularisation** (ridge regression). Replace $1/\\sigma_i$ by the *filter factor* $\\sigma_i/(\\sigma_i^2 + \\lambda^2)$: this is $1/\\sigma_i$ for $\\sigma_i \\gg \\lambda$ and fades smoothly to zero for $\\sigma_i \\ll \\lambda$. It is the same as minimising $|A\\vec x - \\vec b|^2 + \\lambda^2|\\vec x|^2$ — a small penalty on the size of $\\vec x$.

Both give up a little bias to remove a lot of variance. In the simulation, make two columns nearly equal, watch the smallest singular value sink and the coefficients explode, then raise the truncation or $\\lambda$.

> [!tip] The **Fit** tab of [the SVD lab](#/tools/svdlab/fit) fits polynomials and other models to points you drag, shows the design matrix's singular values and lets you compare the SVD solution, the normal equations, truncation and Tikhonov side by side. The **Decompose** tab solves $A\\vec x = \\vec b$ with the pseudoinverse for any matrix you type.

### Where it is used
Calibration of instruments (many readings, few parameters); GPS and surveying (positions from more satellites or stations than needed); computed tomography and deconvolution (famously ill-conditioned, always regularised); robot arms with more joints than needed, where the minimum-norm solution gives the smallest joint motion; and every regression in statistics and machine learning, where ridge regression is Tikhonov by another name.
`,
  ideas: [
    'A⁺ = V Σ⁺ Uᵀ: invert the non-zero singular values, leave the zeros alone.',
    'x = A⁺ b is the exact solution, the least-squares solution, or the shortest of many solutions, whichever applies.',
    'A A⁺ projects onto the column space; the residual is perpendicular to the columns (the normal equations).',
    'Relative errors are amplified by at most κ = σ₁/σₙ; the normal equations square it.',
    'Truncating small singular values or Tikhonov filtering trades a little bias for much less noise.'
  ],
  pitfalls: [
    'If Ax = b has no solution the problem is meaningless — The least-squares solution is well defined and is exactly what fitting a model to noisy data asks for.',
    'A⁺ is the inverse of AᵀA times Aᵀ — Only when the columns are independent; in general (AᵀA)⁻¹ does not exist, while A⁺ always does.',
    'A small determinant means ill-conditioned — det(0.01 I) is tiny for a large matrix with κ = 1; conditioning is about the ratio σ₁/σₙ, not the product.'
  ],
  derivation: {
    title: 'Why x = A⁺b minimises the residual',
    steps: [
      { text: 'Rotate the problem into singular coordinates: with $\\vec b\' = U^{\\mathsf T}\\vec b$ and $\\vec x\' = V^{\\mathsf T}\\vec x$ (lengths unchanged),', tex: '|A\\vec x - \\vec b| = |U\\Sigma V^{\\mathsf T}\\vec x - \\vec b| = |\\Sigma\\vec x\' - \\vec b\'|' },
      { text: 'The squared residual splits component by component:', tex: '|\\Sigma\\vec x\' - \\vec b\'|^2 = \\sum_{i \\le r}(\\sigma_i x\'_i - b\'_i)^2 + \\sum_{i > r}(b\'_i)^2' },
      { text: 'The second sum cannot be changed by any $\\vec x$ — it is the part of $\\vec b$ outside the column space. The first is zero when $x\'_i = b\'_i/\\sigma_i$ for $i \\le r$; the components $x\'_i$ with $i > r$ do not enter, and the shortest choice is $x\'_i = 0$.', tex: '\\vec x\' = \\Sigma^{+}\\vec b\' \\quad\\Longrightarrow\\quad \\vec x = V\\Sigma^{+}U^{\\mathsf T}\\vec b = A^{+}\\vec b' }
    ]
  },
  formulas: [
    {
      name: 'Error amplification by the condition number',
      expr: 'ex = kappa*eb', tex: '\\epsilon_x = \\kappa\\,\\epsilon_b',
      vars: {
        ex: { name: 'worst relative error in the solution x', q: 'ratio', unit: '%', tex: '\\epsilon_x' },
        kappa: { name: 'condition number σ₁/σₙ', value: 1000, tex: '\\kappa' },
        eb: { name: 'relative error in the data b', q: 'ratio', unit: '%', value: 0.1, tex: '\\epsilon_b' }
      },
      note: 'An upper bound, reached when the error in $\\vec b$ lies along $\\vec u_n$ and the solution along $\\vec v_1$. $\\log_{10}\\kappa$ is the number of significant digits that can be lost.',
      stories: { ex: 'A system with condition number {kappa} is solved from data known to {eb}. How large can the relative error of the solution be?', kappa: 'Data known to {eb} must give a solution good to {ex}. What is the largest condition number that allows this?' },
      practice: { unknowns: ['ex', 'kappa'] }
    },
    {
      name: 'Condition number of the normal equations',
      expr: 'K = kappa^2', tex: '{\\kappa}_{A^{\\mathsf T}A} = \\kappa^2',
      vars: {
        K: { name: 'condition number of AᵀA', tex: '{\\kappa}_{A^{\\mathsf T}A}' },
        kappa: { name: 'condition number of A', value: 1e4, tex: '\\kappa' }
      },
      note: 'The singular values of $A^{\\mathsf T}A$ are $\\sigma_i^2$. Solving the normal equations for a problem with $\\kappa = 10^4$ behaves like a problem with $\\kappa = 10^8$.',
      practice: { unknowns: ['K'] }
    },
    {
      name: 'Tikhonov filter factor',
      expr: 'f = sigma/(sigma^2 + lambda^2)', tex: 'f = \\frac{\\sigma}{\\sigma^2 + \\lambda^2}',
      vars: {
        f: { name: 'factor replacing 1/σ in the pseudoinverse' },
        sigma: { name: 'singular value', value: 0.01, tex: '\\sigma' },
        lambda: { name: 'regularisation parameter', value: 0.1, tex: '\\lambda' }
      },
      note: 'Equals $1/\\sigma$ for $\\sigma \\gg \\lambda$ and $\\sigma/\\lambda^2 \\to 0$ for $\\sigma \\ll \\lambda$. Its largest possible value is $1/(2\\lambda)$, at $\\sigma = \\lambda$: no component of the data is ever amplified more than that.',
      practice: { unknowns: ['f'] }
    },
    {
      name: 'Least-squares line: the slope from the normal equations',
      expr: 'c1 = (n*Sxy - Sx*Sy)/(n*Sxx - Sx^2)', tex: 'c_1 = \\frac{n\\,S_{xy} - S_x S_y}{n\\,S_{xx} - S_x^2}',
      vars: {
        c1: { name: 'slope of the fitted line', signed: true, tex: 'c_1' },
        n: { name: 'number of points', value: 4, int: true },
        Sxy: { name: 'Σ xᵢyᵢ', value: 16, signed: true, tex: 'S_{xy}' },
        Sx: { name: 'Σ xᵢ', value: 6, signed: true, tex: 'S_x' },
        Sy: { name: 'Σ yᵢ', value: 9, signed: true, tex: 'S_y' },
        Sxx: { name: 'Σ xᵢ²', value: 14, tex: 'S_{xx}' }
      },
      note: 'What $A^{\\mathsf T}A\\,\\vec c = A^{\\mathsf T}\\vec y$ gives for the model $y = c_0 + c_1 x$, with $A^{\\mathsf T}A = \\begin{pmatrix} n & S_x \\\\ S_x & S_{xx} \\end{pmatrix}$. The values are the four points $(0, 1), (1, 2), (2, 2), (3, 4)$ of the example: $c_1 = 0.9$. The pseudoinverse gives the same numbers without ever forming $A^{\\mathsf T}A$.',
      practice: { unknowns: ['c1'] }
    }
  ],
  examples: [
    {
      title: 'The pseudoinverse of a rank-one matrix',
      q: 'Find $A^{+}$ for $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ and solve $A\\vec x = (1, 2)$ and $A\\vec x = (1, 0)$ with it.',
      steps: [
        '$A = \\sigma_1\\vec u_1\\vec v_1^{\\mathsf T}$ with $\\vec u_1 = \\vec v_1 = (1, 2)/\\sqrt 5$ and $\\sigma_1 = 5$ (the Frobenius norm, $\\sqrt{1 + 4 + 4 + 16}$). $\\sigma_2 = 0$: $A$ is singular and has no inverse.',
        { text: 'Invert the one non-zero singular value:', tex: 'A^{+} = \\frac{1}{\\sigma_1}\\vec v_1\\vec u_1^{\\mathsf T} = \\frac{1}{5}\\cdot\\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix} = \\frac{1}{25}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}' },
        '$\\vec b = (1, 2)$ lies in the column space: $A^{+}\\vec b = (5, 10)/25 = (0.2, 0.4)$, and indeed $A(0.2, 0.4) = (1, 2)$. There are infinitely many solutions, $(0.2, 0.4) + t(2, -1)$; this is the shortest.',
        '$\\vec b = (1, 0)$ is not in the column space (no solution): $A^{+}\\vec b = (1, 2)/25 = (0.04, 0.08)$, giving $A\\vec x = (0.2, 0.4)$, the projection of $(1, 0)$ onto the line through $(1, 2)$. The residual $(0.8, -0.4)$ is perpendicular to that line.'
      ],
      a: 'A⁺ = (1/25)[[1, 2], [2, 4]]; x = (0.2, 0.4) (the shortest exact solution) and x = (0.04, 0.08) (the least-squares solution).'
    },
    {
      title: 'A straight line through four points',
      q: 'Fit $y = c_0 + c_1 x$ to $(0, 1), (1, 2), (2, 2), (3, 4)$.',
      steps: [
        { text: 'The system has four equations and two unknowns:', tex: 'A = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix}, \\quad \\vec y = \\begin{pmatrix} 1 \\\\ 2 \\\\ 2 \\\\ 4 \\end{pmatrix}' },
        { text: 'Normal equations:', tex: 'A^{\\mathsf T}A = \\begin{pmatrix} 4 & 6 \\\\ 6 & 14 \\end{pmatrix}, \\quad A^{\\mathsf T}\\vec y = \\begin{pmatrix} 9 \\\\ 16 \\end{pmatrix} \\quad\\Longrightarrow\\quad c_0 = 0.9,\\ c_1 = 0.9' },
        'Through the SVD: the singular values of $A$ are $4.07$ and $1.04$ ($\\kappa \\approx 3.9$, a well-conditioned fit); $A^{+}\\vec y$ gives the same $(0.9, 0.9)$.',
        'Residual: predicted $(0.9, 1.8, 2.7, 3.6)$, misses $(0.1, 0.2, -0.7, 0.4)$, length $0.837$. It is perpendicular to both columns of $A$: $0.1 + 0.2 - 0.7 + 0.4 = 0$ and $0 + 0.2 - 1.4 + 1.2 = 0$.'
      ],
      a: 'y = 0.9 + 0.9x, residual 0.84.'
    },
    {
      title: 'Two harmless-looking equations',
      q: 'Solve $x + y = 2$, $x + 1.0001y = 2.0001$, then again with the second right-hand side changed to $2.0002$. Explain.',
      steps: [
        'First system: $y = 1$, $x = 1$. Second: subtracting the equations gives $0.0001y = 0.0002$, so $y = 2$ and $x = 0$.',
        'A change of one part in twenty thousand in $\\vec b$ has moved the solution by a distance $\\sqrt 2$ — a relative change of about 100 %.',
        'The singular values of $\\begin{pmatrix} 1 & 1 \\\\ 1 & 1.0001 \\end{pmatrix}$ are $\\sigma_1 \\approx 2.00005$ and $\\sigma_2 \\approx 5\\times 10^{-5}$ (their product is the determinant $10^{-4}$): $\\kappa \\approx 4\\times 10^4$.',
        'The bound $\\epsilon_x \\le \\kappa\\,\\epsilon_b = 4\\times 10^4\\times 3.5\\times 10^{-5} \\approx 1.4$ allows exactly the 100 % swing observed. The two lines are nearly parallel; where they cross is barely determined by the data.'
      ],
      a: '(1, 1) becomes (0, 2): κ ≈ 4 × 10⁴ amplifies a 0.0035 % change in b into a 100 % change in x.'
    }
  ],
  quiz: [
    { q: 'For a square invertible matrix, $A^{+}$ equals…', choices: ['$A^{\\mathsf T}$', '$A^{-1}$', '$(A^{\\mathsf T}A)^{-1}$', '$A$'], a: 1,
      why: 'All singular values are non-zero, so inverting them all and reassembling gives $V\\Sigma^{-1}U^{\\mathsf T} = (U\\Sigma V^{\\mathsf T})^{-1}$.' },
    { q: 'A system has more unknowns than equations and infinitely many solutions. $A^{+}\\vec b$ picks…', choices: ['the one with the most zeros', 'the one of smallest length', 'the one with the largest entries', 'one at random'], a: 1,
      why: 'The pseudoinverse leaves the null-space component at zero, which makes the solution as short as possible.' },
    { q: 'Solving the normal equations $A^{\\mathsf T}A\\vec c = A^{\\mathsf T}\\vec y$ is as accurate as using the SVD of $A$.', a: false,
      why: 'Forming $A^{\\mathsf T}A$ squares the condition number: a fit with $\\kappa = 10^4$ becomes a system with $\\kappa = 10^8$ and loses twice as many digits.' },
    { q: 'Write the Tikhonov filter factor for a singular value $s$ with regularisation parameter $\\lambda = 1$.', answer: 's/(s^2 + 1)', vars: ['s'], positive: true,
      why: '$f = \\sigma/(\\sigma^2 + \\lambda^2)$ with $\\lambda = 1$. It behaves like $1/s$ for large $s$ and like $s$ for small $s$.' },
    { q: 'The condition number of a matrix is $10^3$ and the data are known to 0.01 %. The solution is guaranteed good to about…', choices: ['0.01 %', '0.1 %', '10 %', '1000 %'], a: 2,
      why: '$\\epsilon_x \\le \\kappa\\epsilon_b = 10^3\\times 10^{-4} = 0.1 = 10\\,\\%$ in the worst case. Three of the four significant digits can be lost.' }
  ],
  problems: [
    { q: 'A matrix has condition number 250 and the right-hand side is known to 0.2 %. What is the worst-case relative error of the solution, in per cent?', answer: 50, tol: 0.001,
      steps: ['$\\epsilon_x = \\kappa\\,\\epsilon_b = 250\\times 0.002 = 0.5$.', 'That is 50 %: half the answer may be noise.'] },
    { q: 'With $\\lambda = 0.05$, by what factor does Tikhonov regularisation multiply the data component belonging to the singular value $\\sigma = 0.01$ (instead of $1/\\sigma = 100$)?', answer: 3.846, tol: 0.01,
      steps: ['$f = \\sigma/(\\sigma^2 + \\lambda^2) = 0.01/(0.0001 + 0.0025) = 0.01/0.0026$.', 'So $f \\approx 3.85$ instead of 100: that component is damped 26 times.'] }
  ],
  applications: [
    'Fitting models to data in every laboratory, and ridge regression in machine learning.',
    'Instrument calibration, GPS and geodesy, where there are more readings than unknowns.',
    'Computed tomography, deconvolution of blurred images and inverse problems generally.',
    'Robot kinematics: the minimum-norm joint motion for a redundant arm.',
    'Control and signal processing: system identification from noisy measurements.'
  ],
  history: 'E. H. Moore described the generalised inverse in 1920 and Roger Penrose rediscovered it in 1955 with the four conditions that bear both names. Least squares itself goes back to Legendre (1805) and Gauss, who used it to recover the orbit of the asteroid Ceres; the condition number as a measure of sensitivity is due to Alan Turing (1948). Tikhonov published his regularisation in 1963, and Hoerl and Kennard the statisticians\' ridge regression in 1970.',
  sim: ['svd-leastsquares']
},

{
  id: 'principal-component-analysis', parent: 'matrices-topic', title: 'Principal component analysis (PCA)', level: 3,
  short: 'Find the perpendicular directions along which a cloud of data points varies most. They are the singular vectors of the centred data matrix, and the variance along each is σ²/(n − 1): the shape of the cloud, ranked.',
  keywords: ['PCA', 'principal component', 'principal axes', 'covariance matrix', 'explained variance', 'scree plot', 'scores', 'loadings', 'dimensionality reduction', 'standardisation', 'Karhunen–Loève', 'Hotelling', 'eigenfaces'],
  prereq: ['singular-value-decomposition', 'standard-deviation', 'linear-regression'],
  related: ['low-rank-approximation', 'eigenvalues', 'descriptive-statistics', 'pseudoinverse', 'physics:moment-of-inertia'],
  body: `
### The shape of a cloud of points
Measure height and weight for a hundred people and plot them: the points form a tilted, elongated cloud. Neither axis of the plot is the natural one — the cloud is long in the direction "big person" and thin in the perpendicular direction "heavier than their height suggests". **Principal component analysis** finds those directions from the data, orders them by how much the data spread along each, and lets you keep only the ones that matter. With two variables it is a picture; with two hundred (the brightness of every pixel of a face, the expression of every gene, the price of every share) it is the only way to see anything at all.

### From data to a matrix
Put the data in a matrix $X$ with one row per observation and one column per variable, $n\\times p$. Subtract the mean of each column, so that the cloud is centred on the origin — PCA is about *spread*, not position. The [[?correlation|covariance]] between variables $j$ and $k$ is $\\sum_i X_{ij}X_{ik}/(n - 1)$, so all the covariances at once are

$$C = \\frac{X^{\\mathsf T}X}{n - 1}$$

a symmetric $p\\times p$ matrix with the [[standard-deviation|variances]] on its diagonal. The spread of the data along a unit direction $\\vec w$ is the variance of the projections $X\\vec w$, which works out to $\\vec w^{\\mathsf T}C\\vec w$. Maximising this over unit vectors is exactly the problem whose answer is the top [[eigenvalues|eigenvector]] of $C$; the next direction, perpendicular to the first, is the second eigenvector; and so on.

### Why it is the SVD
Take the thin SVD of the centred data, $X = U\\Sigma V^{\\mathsf T}$. Then $C = V\\Sigma^2V^{\\mathsf T}/(n - 1)$, so the eigenvectors of $C$ are the right singular vectors of $X$ and the eigenvalues are

$$\\lambda_i = \\frac{\\sigma_i^2}{n - 1}$$

The columns of $V$ are the **principal axes** (the *loadings*: how much of each original variable goes into each component), the $\\lambda_i$ are the variances along them, and the coordinates of the data along the new axes — the **scores** — are $XV = U\\Sigma$. Computing the SVD of $X$ directly is both faster and more accurate than forming $C$, for the reason given on the [[pseudoinverse|previous page]]. Everything about the cloud is in three objects: directions ($V$), spreads ($\\sigma_i$), and where each point sits ($U\\Sigma$).

### How many components?
The total variance is $\\lambda_1 + \\lambda_2 + \\cdots + \\lambda_p$ (the sum of the variances of the original variables — it does not change under rotation), and the fraction $\\lambda_i/\\sum\\lambda$ is the **explained variance** of component $i$. A plot of the $\\lambda_i$ in order, the **scree plot**, usually falls steeply and then flattens; the flat part is noise and the knee is where to stop. Keeping the first $k$ components is the same as replacing $X$ by its best rank-$k$ approximation ([[low-rank-approximation]]), so the Eckart–Young theorem guarantees that no other $k$-dimensional projection loses less. Two or three components are enough to *draw* the data; ten or twenty may be needed to *use* them.

### Units and standardising
PCA is a geometric method, so it depends on the units of the axes. If one variable is in millimetres and another in metres, the first has a variance a million times larger and will own the first component regardless of what the data say. The usual remedy is to divide each centred column by its standard deviation, so that every variable has variance 1 and $C$ becomes the correlation matrix; then the total variance is $p$ and a component with $\\lambda_i > 1$ carries more than one variable's worth. Standardise when the variables are of different kinds; do not when they are comparable quantities, such as the pixels of an image, where the raw variances carry meaning.

### What PCA is and is not
It finds the perpendicular directions of greatest variance — the axes of the ellipsoid that best describes the cloud. It is not regression (there is no "dependent" variable; it treats all directions alike and minimises the perpendicular distances to the axis, not the vertical ones), and it is blind to anything nonlinear: a cloud bent into a crescent still gets straight axes. Its physics twin is the [[physics:moment-of-inertia|inertia tensor]]: the principal axes of a rigid body are the principal components of the mass distribution, and the same eigenproblem gives both.

> [!tip] The **PCA** tab of [the SVD lab](#/tools/svdlab/pca) runs the analysis on built-in data sets or numbers you paste in, with the scree plot, the scores and the loadings, standardised or not.

### Where it is used
Faces as combinations of a few "eigenfaces"; spectra and chromatograms reduced to a handful of factors; population genetics, where the first two components of thousands of genetic markers reproduce the map of Europe; finance, where the first component of share returns is "the market"; sensor arrays, where the components separate sources; and as the first step before clustering or classification of almost any high-dimensional data.
`,
  ideas: [
    'Centre the data; the covariance matrix is C = XᵀX/(n − 1).',
    'The principal axes are the eigenvectors of C — the right singular vectors V of the centred X.',
    'The variance along component i is σᵢ²/(n − 1); the scores are XV = UΣ.',
    'Explained variance λᵢ/Σλ and the scree plot decide how many components to keep.',
    'Standardise variables of different kinds; the result is the best k-dimensional view of the data.'
  ],
  pitfalls: [
    'PCA is a kind of regression — It has no dependent variable and minimises perpendicular, not vertical, distances; the first axis is not the regression line.',
    'The first component is always the important one — It is the direction of greatest variance, which in mixed units may just be the variable with the biggest numbers; standardise first.',
    'Components with small variance are noise — Sometimes the interesting signal is a small, consistent variation; PCA ranks by spread, not by meaning.'
  ],
  derivation: {
    title: 'The direction of greatest variance is an eigenvector of C',
    steps: [
      { text: 'The projections of the centred data on a unit direction $\\vec w$ are the numbers $X\\vec w$; their variance is', tex: 's^2(\\vec w) = \\frac{|X\\vec w|^2}{n - 1} = \\frac{\\vec w^{\\mathsf T}X^{\\mathsf T}X\\vec w}{n - 1} = \\vec w^{\\mathsf T}C\\vec w' },
      { text: 'Write $\\vec w$ in the orthonormal eigenvectors of $C$, $\\vec w = \\sum c_i\\vec v_i$ with $\\sum c_i^2 = 1$:', tex: '\\vec w^{\\mathsf T}C\\vec w = \\sum_i \\lambda_i c_i^2 \\le \\lambda_1\\sum_i c_i^2 = \\lambda_1' },
      { text: 'with equality when $\\vec w = \\vec v_1$. So the greatest variance is $\\lambda_1$, along the top eigenvector. Among directions perpendicular to $\\vec v_1$ the same argument gives $\\vec v_2$, and so on.' },
      { text: 'Since $C = X^{\\mathsf T}X/(n - 1)$ and $X = U\\Sigma V^{\\mathsf T}$, the eigenvectors are the columns of $V$ and', tex: '\\lambda_i = \\frac{\\sigma_i^2}{n - 1}' }
    ]
  },
  formulas: [
    {
      name: 'Variance along a principal component',
      expr: 'lambda = sigma^2/(n - 1)', tex: '\\lambda = \\frac{\\sigma^2}{n - 1}',
      vars: {
        lambda: { name: 'variance along the component', tex: '\\lambda' },
        sigma: { name: 'singular value of the centred data matrix', value: 20, tex: '\\sigma' },
        n: { name: 'number of observations', value: 101, int: true }
      },
      note: 'For centred data $X^{\\mathsf T}X/(n - 1)$ is the covariance matrix and its eigenvalues are $\\sigma_i^2/(n - 1)$. The standard deviation along the component is $\\sqrt\\lambda$.',
      practice: { unknowns: ['lambda', 'sigma'] }
    },
    {
      name: 'Explained variance of the first of three components',
      expr: 'f = l1/(l1 + l2 + l3)', tex: 'f = \\frac{\\lambda_1}{\\lambda_1 + \\lambda_2 + \\lambda_3}',
      vars: {
        f: { name: 'fraction of the total variance', q: 'ratio', unit: '%' },
        l1: { name: 'λ₁', value: 6, tex: '\\lambda_1' },
        l2: { name: 'λ₂', value: 3, tex: '\\lambda_2' },
        l3: { name: 'λ₃', value: 1, tex: '\\lambda_3' }
      },
      note: 'The total variance is the same whichever perpendicular axes are used, so the fractions add up to 1. With 6, 3, 1 the first two components explain 90 %.',
      practice: { unknowns: ['f', 'l1'] }
    },
    {
      name: 'Covariance of two centred variables',
      expr: 'c = S/(n - 1)', tex: 'c_{jk} = \\frac{S_{jk}}{n - 1}',
      vars: {
        c: { name: 'covariance of variables j and k', signed: true, tex: 'c_{jk}' },
        S: { name: 'Σ xᵢⱼ xᵢₖ over the centred data', value: 250, signed: true, tex: 'S_{jk}' },
        n: { name: 'number of observations', value: 51, int: true }
      },
      note: 'The entries of $C = X^{\\mathsf T}X/(n - 1)$. On the diagonal ($j = k$) this is the variance of a variable.',
      practice: { unknowns: ['c'] }
    }
  ],
  examples: [
    {
      title: 'Four points, by hand',
      q: 'Find the principal components of the points $(2, 0), (0, 1), (-2, 0), (0, -1)$.',
      steps: [
        'The means are $(0, 0)$: the data are already centred. $X$ has these four rows.',
        { text: 'Covariance matrix:', tex: 'C = \\frac{X^{\\mathsf T}X}{3} = \\frac{1}{3}\\begin{pmatrix} 8 & 0 \\\\ 0 & 2 \\end{pmatrix}' },
        'It is already diagonal: the principal axes are the coordinate axes, with variances $\\lambda_1 = 8/3$ along $x$ and $\\lambda_2 = 2/3$ along $y$. Explained variance: $8/10 = 80\\,\\%$ and $20\\,\\%$.',
        'The singular values of $X$ are $\\sigma_1 = \\sqrt 8$ and $\\sigma_2 = \\sqrt 2$, and $\\sigma_i^2/3$ gives the same $\\lambda_i$. The scores are the data themselves, since $V = I$.'
      ],
      a: 'Axes x and y with variances 8/3 and 2/3: the first component explains 80 %.'
    },
    {
      title: 'A tilted cloud',
      q: 'The centred data have covariance matrix $C = \\begin{pmatrix} 5 & 3 \\\\ 3 & 5 \\end{pmatrix}$. Find the principal axes and the explained variances, and the score of the point $(2, 1)$ on the first component.',
      steps: [
        'Eigenvalues of $C$: $\\lambda^2 - 10\\lambda + 16 = 0$, so $\\lambda_1 = 8$ and $\\lambda_2 = 2$. Total $10$ (the two variances $5 + 5$), fractions 80 % and 20 %.',
        'Eigenvectors: $\\vec v_1 = (1, 1)/\\sqrt 2$ (the long diagonal) and $\\vec v_2 = (1, -1)/\\sqrt 2$. The cloud is an ellipse tilted at 45°, with semi-axes in the ratio $\\sqrt 8 : \\sqrt 2 = 2 : 1$.',
        'Score of $(2, 1)$ on component 1: $\\vec v_1\\cdot(2, 1) = 3/\\sqrt 2 \\approx 2.12$; on component 2: $1/\\sqrt 2 \\approx 0.71$.',
        'Keeping only the first component replaces $(2, 1)$ by $2.12\\,\\vec v_1 = (1.5, 1.5)$: a point on the main axis, 0.71 away from the original.'
      ],
      a: 'Axes along (1, 1) and (1, −1), variances 8 and 2 (80 % and 20 %); the score of (2, 1) on PC1 is 2.12.'
    },
    {
      title: 'To standardise or not',
      q: 'Three variables have variances 400 (height in cm), 1 (shoe size) and 0.04 (hand length in m). What does PCA do with and without standardising?',
      steps: [
        'Without: the total variance is 401.04 and almost all of it is the height column. The first component is essentially "height", explaining over 99.7 %, and the other two variables are invisible — not because they are unimportant, but because they were measured in small units.',
        'With: each column is divided by its standard deviation (20, 1, 0.2), every variance becomes 1 and the total is 3. The components now reflect how the variables *co-vary*; if all three grow together, the first component will be their common "size" with $\\lambda_1$ close to 3.',
        'The rule: standardise when the variables are of different kinds or units; keep raw variances when they are the same kind of quantity and their sizes mean something.'
      ],
      a: 'Unstandardised, height dominates by units alone; standardised, the components describe the shared variation.'
    }
  ],
  quiz: [
    { q: 'The principal axes of a data set are…', choices: ['the regression lines of each variable on the others', 'the eigenvectors of the covariance matrix', 'the columns of the data matrix', 'the rows with the largest values'], a: 1,
      why: 'They are the perpendicular directions of greatest variance, which are the eigenvectors of $C = X^{\\mathsf T}X/(n - 1)$ — equivalently the right singular vectors of the centred data.' },
    { q: 'Write the variance along a component whose singular value is $s$, for $n$ observations.', answer: 's^2/(n - 1)', vars: ['s', 'n'],
      why: '$\\lambda = \\sigma^2/(n - 1)$, the eigenvalue of the covariance matrix.' },
    { q: 'Rotating the axes of a data set changes its total variance.', a: false,
      why: 'The total variance is the trace of $C$, which is unchanged by an orthogonal change of basis; PCA only redistributes it among the new axes.' },
    { q: 'Variables measured in very different units should usually be standardised before PCA because…', choices: ['PCA needs values between 0 and 1', 'otherwise the variables with the largest numbers dominate', 'the covariance matrix would not be symmetric', 'the SVD only works on square matrices'], a: 1,
      why: 'PCA ranks directions by variance, and variance scales with the square of the unit. A column in millimetres has a million times the variance of the same column in metres.' },
    { q: 'Covariances $\\lambda_1 = 9$, $\\lambda_2 = 4$, $\\lambda_3 = 2$, $\\lambda_4 = 1$. How many components are needed to explain at least 80 % of the variance?', choices: ['1', '2', '3', '4'], a: 1,
      why: 'Total 16. One component: $9/16 = 56\\,\\%$; two: $13/16 = 81\\,\\%$.' }
  ],
  problems: [
    { q: 'The centred data matrix of 26 observations has singular values 10, 5 and 2.5. What percentage of the variance does the first component explain?', answer: 76.2, tol: 0.01,
      steps: ['Variances $\\sigma_i^2/25$: 4, 1, 0.25, total 5.25.', 'First component: $4/5.25 = 0.762$, that is 76.2 %.'] },
    { q: 'With the same data, what is the standard deviation of the scores along the second component?', answer: 1, tol: 0.001,
      steps: ['$\\lambda_2 = 25/25 = 1$.', 'The standard deviation is $\\sqrt{\\lambda_2} = 1$.'] }
  ],
  applications: [
    'Face recognition (eigenfaces) and image analysis.',
    'Chemometrics: spectra reduced to a few factors; quality control from many sensors.',
    'Population genetics and the analysis of gene-expression data.',
    'Finance: the market and sector factors behind share returns.',
    'Reducing data to two or three dimensions so that it can be drawn, before clustering or classification.'
  ],
  history: 'Karl Pearson introduced the idea in 1901 as the lines and planes of closest fit to a system of points; Harold Hotelling developed it as a statistical method in 1933 and named the components. The equivalent expansion for random functions is the Karhunen–Loève transform of the 1940s, and eigenfaces for face recognition date from 1987 (Sirovich and Kirby) and 1991 (Turk and Pentland).',
  sim: ['svd-pca']
}

);
