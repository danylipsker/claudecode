/* HYPER-MATH · content/linear-algebra.js — matrices: arithmetic, multiplication,
 * determinants, inverses, elimination, transformations, eigenvalues and vector spaces.
 * Simulations in sims/vectors-linalg-complex.js. */
Hyper.add(

{
  id: 'matrices', parent: 'matrices-topic', title: 'Matrices', level: 1,
  short: 'A rectangular table of numbers, added and scaled entry by entry, used to hold systems of equations, transformations and data.',
  keywords: ['matrix', 'matrices', 'entry', 'rows', 'columns', 'dimensions', 'square matrix', 'identity matrix', 'zero matrix', 'transpose', 'symmetric', 'diagonal', 'trace'],
  prereq: ['vectors', 'systems-of-equations'],
  related: ['matrix-multiplication', 'determinants', 'linear-transformations', 'gaussian-elimination', 'vector-spaces'],
  body: `
### A table that does things
A **matrix** is a rectangular array of numbers arranged in rows and columns. A matrix with $m$ rows and $n$ columns is called $m\\times n$ ("$m$ by $n$"), and the entry in row $i$ and column $j$ is written $a_{ij}$:

$$A = \\begin{pmatrix} 2 & 3 & -1 \\\\ 0 & 5 & 4 \\end{pmatrix} \\quad (2\\times 3), \\qquad a_{12} = 3,\\quad a_{23} = 4$$

A matrix with as many rows as columns is **square**. A matrix with a single column is a **column vector**, which is how vectors are usually written in linear algebra.

### Where matrices come from
- **Systems of equations.** The system $2x + 3y = 7$, $x - y = 1$ is completely described by its coefficients and right-hand sides. It becomes the single equation $A\\vec x = \\vec b$ with $A = \\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$, $\\vec x = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$ and $\\vec b = \\begin{pmatrix} 7 \\\\ 1 \\end{pmatrix}$. With the right-hand sides added as a last column it is the **augmented matrix** used in [[gaussian-elimination|elimination]].
- **Transformations.** A $2\\times 2$ matrix describes a rotation, stretch, reflection or shear of the plane ([[linear-transformations]]).
- **Data.** A spreadsheet of measurements, a greyscale photograph (one number per pixel), the marks of 30 students in 5 tests: each is a matrix.
- **Networks.** Put a 1 in row $i$, column $j$ when node $i$ links to node $j$: the adjacency matrix behind web search and the analysis of social and transport networks.

### Arithmetic
Two matrices are **equal** when they have the same size and the same entries. Matrices of the same size are **added** entry by entry, and a matrix is **multiplied by a number** by multiplying every entry:

$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 0 & -1 \\\\ 5 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 8 & 6 \\end{pmatrix}, \\qquad 3\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 3 & 6 \\\\ 9 & 12 \\end{pmatrix}$$

These operations obey the usual rules, $A + B = B + A$, $k(A + B) = kA + kB$ and so on, so the matrices of one size form a [[vector-spaces|vector space]]. Multiplying two matrices together is a different and more interesting operation: see [[matrix-multiplication]].

The **transpose** $A^T$ swaps rows and columns, $(A^T)_{ij} = a_{ji}$. A $2\\times 3$ matrix has a $3\\times 2$ transpose, and a column vector becomes a row.

### Special matrices
| Name | Property | Example |
|---|---|---|
| zero matrix $O$ | every entry is 0 | $\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$ |
| identity $I$ | 1 on the diagonal, 0 elsewhere; $AI = IA = A$ | $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ |
| diagonal | non-zero entries only on the diagonal | $\\begin{pmatrix} 2 & 0 \\\\ 0 & -3 \\end{pmatrix}$ |
| upper triangular | zeros below the diagonal | $\\begin{pmatrix} 1 & 4 \\\\ 0 & 2 \\end{pmatrix}$ |
| symmetric | equal to its transpose, $A^T = A$ | $\\begin{pmatrix} 2 & 7 \\\\ 7 & 5 \\end{pmatrix}$ |

The diagonal of a square matrix runs from top left to bottom right, and the sum of the diagonal entries is the **trace**.

### Why they matter
One matrix equation $A\\vec x = \\vec b$ can stand for a thousand equations in a thousand unknowns, and a computer handles it with the same few algorithms whatever its size. That compactness is why matrices are everywhere: structural analysis, electrical networks, computer graphics, quantum mechanics, statistics and machine learning all run on them.
`,
  ideas: [
    'An m × n matrix has m rows and n columns; aᵢⱼ sits in row i, column j.',
    'Matrices of the same size add entry by entry; a number multiplies every entry.',
    'The transpose swaps rows and columns.',
    'A system of linear equations is one matrix equation Ax = b.',
    'The identity matrix I plays the role of the number 1.'
  ],
  pitfalls: [
    'An m × n matrix has m columns — Rows come first: 2 × 3 means 2 rows and 3 columns.',
    'Any two matrices can be added — Only matrices of exactly the same size.',
    'Matrices multiply entry by entry, like they add — The matrix product is row-times-column; the entry-by-entry product is a different operation, rarely used.'
  ],
  formulas: [
    {
      name: 'Numbers needed for a symmetric n × n matrix',
      expr: 'N = n*(n + 1)/2', tex: 'N = \\frac{n(n + 1)}{2}',
      vars: {
        N: { name: 'independent entries', int: true },
        n: { name: 'size of the matrix (n × n)', value: 4, int: true }
      },
      note: 'The diagonal and everything above it; the entries below are copies. A full n × n matrix needs n² numbers.',
      stories: { N: 'How many numbers must be stored to describe a symmetric {n} × {n} matrix?' }
    }
  ],
  examples: [
    {
      title: 'A system as a matrix equation',
      q: 'Write the system $x + 2y - z = 4$, $3x - y = 2$, $y + 5z = -1$ in the form $A\\vec x = \\vec b$.',
      steps: [
        'Line up the unknowns $x, y, z$ in every equation, writing 0 for a missing one.',
        'Coefficients by rows: $(1, 2, -1)$, $(3, -1, 0)$, $(0, 1, 5)$.',
        { text: 'So', tex: '\\begin{pmatrix} 1 & 2 & -1 \\\\ 3 & -1 & 0 \\\\ 0 & 1 & 5 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 2 \\\\ -1 \\end{pmatrix}' },
        'The augmented matrix adds $\\vec b$ as a fourth column.'
      ],
      a: 'A is the 3 × 3 matrix of coefficients, x = (x, y, z) and b = (4, 2, −1).'
    },
    {
      title: 'Matrix arithmetic',
      q: 'With $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 0 & -1 \\\\ 5 & 2 \\end{pmatrix}$, find $2A - B$ and $A^T$.',
      steps: [
        '$2A = \\begin{pmatrix} 2 & 4 \\\\ 6 & 8 \\end{pmatrix}$.',
        '$2A - B = \\begin{pmatrix} 2 - 0 & 4 - (-1) \\\\ 6 - 5 & 8 - 2 \\end{pmatrix} = \\begin{pmatrix} 2 & 5 \\\\ 1 & 6 \\end{pmatrix}$.',
        'Transpose: the first row becomes the first column, $A^T = \\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$.'
      ],
      a: '2A − B = [[2, 5], [1, 6]] and Aᵀ = [[1, 3], [2, 4]].'
    }
  ],
  quiz: [
    { q: 'A matrix with 3 rows and 5 columns is called…', choices: ['5 × 3', '3 × 5', '15 × 1', 'square'], a: 1,
      why: 'The size is written rows × columns: 3 × 5.' },
    { q: 'Which sum is defined?', choices: ['a 2 × 3 matrix plus a 3 × 2 matrix', 'a 2 × 3 matrix plus a 2 × 3 matrix', 'a 2 × 2 matrix plus a 2 × 1 matrix', 'a 3 × 3 matrix plus a number'], a: 1,
      why: 'Addition works entry by entry, so both matrices need exactly the same shape.' },
    { q: 'The transpose of a 2 × 5 matrix is a 5 × 2 matrix.', a: true,
      why: 'Rows become columns: the 2 rows of length 5 turn into 2 columns of length 5.' },
    { q: 'For $A = \\begin{pmatrix} x & 2x \\\\ x^2 & 1 \\end{pmatrix}$, write the entry in row 1, column 2 of $A^T$.', answer: 'x^2', vars: ['x'],
      why: '$(A^T)_{12} = a_{21}$, the entry in row 2, column 1 of $A$: $x^2$.' },
    { q: 'A square matrix equal to its own transpose is called…', choices: ['diagonal', 'symmetric', 'the identity', 'triangular'], a: 1,
      why: 'Symmetric: it is mirrored across its diagonal, $a_{ij} = a_{ji}$. Diagonal matrices are symmetric too, but not every symmetric matrix is diagonal.' }
  ],
  problems: [
    { q: 'How many independent numbers are needed to describe a symmetric 5 × 5 matrix?', answer: 15, tol: 0.001,
      steps: ['The diagonal has 5 entries and the part above it $4 + 3 + 2 + 1 = 10$.', '$5 + 10 = 15 = \\tfrac{5 \\times 6}{2}$.'] }
  ],
  applications: [
    'Solving systems of equations in engineering and economics.',
    'Storing images, tables of data and networks.',
    'Computer graphics: every movement of an object on screen is a matrix.',
    'Quantum mechanics and statistics, where matrices describe states, operators and correlations.'
  ],
  history: 'Chinese mathematicians arranged the coefficients of simultaneous equations in rectangular arrays of counting rods over two thousand years ago. The word *matrix* was introduced by James Joseph Sylvester in 1850, and Arthur Cayley developed the algebra of matrices in 1858.',
  sim: 'vlc-matrix-transform'
},

{
  id: 'matrix-multiplication', parent: 'matrices-topic', title: 'Matrix multiplication', level: 2,
  short: 'Multiply rows by columns: each entry of AB is the dot product of a row of A with a column of B. The product means "do B, then A".',
  keywords: ['matrix multiplication', 'matrix product', 'row times column', 'dot product', 'composition', 'not commutative', 'identity', 'matrix-vector product', 'powers of a matrix'],
  prereq: ['matrices', 'dot-product'],
  related: ['linear-transformations', 'matrix-inverse', 'composition-of-functions', 'determinants', 'eigenvalues'],
  body: `
### Row times column
To multiply two matrices, take a **row** of the first and a **column** of the second, multiply matching entries and add — a [[dot-product|dot product]]. That number is the entry of the product in that row and that column:

$$(AB)_{ij} = \\sum_k a_{ik}\\,b_{kj} = a_{i1}b_{1j} + a_{i2}b_{2j} + \\dots$$

$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}\\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 1\\cdot 5 + 2\\cdot 7 & 1\\cdot 6 + 2\\cdot 8 \\\\ 3\\cdot 5 + 4\\cdot 7 & 3\\cdot 6 + 4\\cdot 8 \\end{pmatrix} = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$$

For rows and columns to match up, the number of **columns of $A$ must equal the number of rows of $B$**. An $m\\times n$ matrix times an $n\\times p$ matrix gives an $m\\times p$ matrix: the inner sizes must agree, and the outer sizes remain.

### A matrix times a vector
The most common product is a matrix times a column vector. Read by rows, it gives the left-hand sides of a system of equations; read by columns, it is a **combination of the columns**:

$$\\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 2x + 3y \\\\ x - y \\end{pmatrix} = x\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} + y\\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}$$

The second reading is the key to [[linear-transformations|linear transformations]]: the columns are where the basis vectors are sent.

### Why such a strange rule?
Because it makes the product mean **"do one transformation, then another"**. If $B$ sends $\\vec x$ to $B\\vec x$ and $A$ then sends that to $A(B\\vec x)$, the single matrix that does both is $AB$: $(AB)\\vec x = A(B\\vec x)$. Mind the order: $AB$ means *first $B$, then $A$*, just as $f(g(x))$ applies $g$ first ([[composition-of-functions|composition of functions]]).

### The rules — and a missing one
Matrix multiplication is associative, $(AB)C = A(BC)$, and distributive, $A(B + C) = AB + AC$; the identity changes nothing, $AI = IA = A$; and $(AB)^T = B^TA^T$. But it is **not commutative**: usually $AB \\ne BA$. Rotating and then reflecting is not the same as reflecting and then rotating (see the worked example). Even the sizes can differ: for a $2\\times 3$ matrix $A$ and a $3\\times 2$ matrix $B$, $AB$ is $2\\times 2$ while $BA$ is $3\\times 3$.

A second surprise: two non-zero matrices can multiply to zero,

$$\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$$

so you cannot cancel a matrix from both sides of an equation unless it has an [[matrix-inverse|inverse]].

### Powers, and speed
Repeated multiplication gives powers $A^n$, which describe a process applied again and again: a Markov chain moving between states day after day, or a population model year after year. The powers of $\\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$ contain the Fibonacci numbers. Multiplying two $n\\times n$ matrices the direct way takes $n^3$ multiplications — a billion for $n = 1000$ — and graphics cards and machine-learning chips are, above all, very fast matrix multipliers.
`,
  ideas: [
    'Entry (i, j) of AB is row i of A dotted with column j of B.',
    'AB exists only when A has as many columns as B has rows; (m × n)(n × p) = m × p.',
    'Ax is a combination of the columns of A, weighted by the entries of x.',
    'AB means "apply B first, then A".',
    'Matrix multiplication is associative but not commutative.'
  ],
  pitfalls: [
    'AB = BA — Almost never, and the two may not even have the same size. Order matters.',
    'Multiplying entry by entry — The product uses whole rows and columns; entry-by-entry multiplication gives a different matrix.',
    'If AB = O then A = O or B = O — Non-zero matrices can multiply to zero, so cancelling is only allowed with an invertible matrix.'
  ],
  formulas: [
    {
      name: 'Top-left entry of a 2 × 2 product',
      expr: 'c11 = a11*b11 + a12*b21', tex: 'c_{11} = a_{11}b_{11} + a_{12}b_{21}',
      vars: {
        c11: { name: 'entry (1, 1) of AB', tex: 'c_{11}', signed: true },
        a11: { name: 'A, row 1, column 1', tex: 'a_{11}', value: 1, signed: true },
        a12: { name: 'A, row 1, column 2', tex: 'a_{12}', value: 2, signed: true },
        b11: { name: 'B, row 1, column 1', tex: 'b_{11}', value: 5, signed: true },
        b21: { name: 'B, row 2, column 1', tex: 'b_{21}', value: 7, signed: true }
      },
      note: 'Row 1 of A dotted with column 1 of B. Every other entry follows the same pattern.'
    },
    {
      name: 'Multiplications for an (m × n)(n × p) product',
      expr: 'N = m*n*p', tex: 'N = m\\,n\\,p',
      vars: {
        N: { name: 'number of multiplications', int: true },
        m: { name: 'rows of A', value: 2, int: true },
        n: { name: 'columns of A = rows of B', value: 3, int: true },
        p: { name: 'columns of B', value: 4, int: true }
      },
      note: 'Each of the $mp$ entries of the product needs $n$ multiplications.'
    }
  ],
  examples: [
    {
      title: 'Multiplying two matrices',
      q: 'Find $AB$ and $BA$ for $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ -1 & 3 & 2 \\end{pmatrix}$ and $B = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\\\ 4 & -1 \\end{pmatrix}$.',
      steps: [
        '$A$ is $2\\times 3$ and $B$ is $3\\times 2$, so $AB$ is $2\\times 2$.',
        'Row 1 of $A$ with the columns of $B$: $2 + 0 + 0 = 2$ and $4 + 1 + 0 = 5$.',
        'Row 2: $-1 + 0 + 8 = 7$ and $-2 + 3 - 2 = -1$. So $AB = \\begin{pmatrix} 2 & 5 \\\\ 7 & -1 \\end{pmatrix}$.',
        '$BA$ is $3\\times 3$: $\\begin{pmatrix} 0 & 7 & 4 \\\\ -1 & 3 & 2 \\\\ 9 & 1 & -2 \\end{pmatrix}$ — a completely different matrix.'
      ],
      a: 'AB = [[2, 5], [7, −1]]; BA is a different 3 × 3 matrix.'
    },
    {
      title: 'Rotate then reflect, or reflect then rotate?',
      q: 'Let $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ (rotation by 90°) and $F = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ (reflection in the $x$-axis). Compare $FR$ and $RF$.',
      steps: [
        '$FR = \\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$: it sends $(x, y)$ to $(-y, -x)$, a reflection in the line $y = -x$.',
        '$RF = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$: it sends $(x, y)$ to $(y, x)$, a reflection in the line $y = x$.',
        'Check on $(1, 0)$: rotating gives $(0, 1)$, then reflecting gives $(0, -1)$ — that is $FR$. Reflecting first leaves $(1, 0)$, then rotating gives $(0, 1)$ — that is $RF$.'
      ],
      a: 'FR reflects in y = −x, RF reflects in y = x: the order matters.'
    }
  ],
  quiz: [
    { q: '$A$ is $2\\times 3$ and $B$ is $3\\times 4$. The product $AB$ is…', choices: ['3 × 3', '2 × 4', '4 × 2', 'not defined'], a: 1,
      why: 'The inner sizes (3 and 3) match, and the outer sizes give the shape of the product: 2 × 4.' },
    { q: 'For any two square matrices of the same size, $AB = BA$.', a: false,
      why: 'Matrix multiplication is not commutative. A rotation followed by a reflection differs from the reflection followed by the rotation.' },
    { q: 'The product $(AB)\\vec x$ means…', choices: ['apply $A$ first, then $B$', 'apply $B$ first, then $A$', 'apply both at once, in any order', 'add the two transformations'], a: 1,
      why: '$(AB)\\vec x = A(B\\vec x)$: $B$ acts on $\\vec x$ first, then $A$ acts on the result.' },
    { q: 'Write the first entry of $\\begin{pmatrix} x & 1 \\\\ 0 & 2 \\end{pmatrix}\\begin{pmatrix} 3 \\\\ x \\end{pmatrix}$.', answer: '4x', vars: ['x'],
      why: 'Row 1 dotted with the column: $x \\cdot 3 + 1 \\cdot x = 4x$.' },
    { q: 'If $AB = O$ (the zero matrix) and $A \\ne O$, then $B$ must be $O$.', a: false,
      why: '$\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix} = O$ with neither factor zero.' }
  ],
  problems: [
    { q: 'What is the top-left entry of $\\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}^5$?', answer: 8, tol: 0.001,
      hint: 'Multiply step by step, or spot the Fibonacci numbers.',
      steps: ['Successive powers: $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, $\\begin{pmatrix} 3 & 2 \\\\ 2 & 1 \\end{pmatrix}$, $\\begin{pmatrix} 5 & 3 \\\\ 3 & 2 \\end{pmatrix}$, $\\begin{pmatrix} 8 & 5 \\\\ 5 & 3 \\end{pmatrix}$.', 'The fifth power has 8 in the top-left corner, the sixth Fibonacci number.'] }
  ],
  applications: [
    'Composing rotations, scalings and projections in computer graphics and robotics.',
    'Neural networks: each layer multiplies its input vector by a weight matrix.',
    'Markov chains and population models, stepped forward by powers of a matrix.',
    'Solving linear systems, which is organised as products of simpler matrices.'
  ],
  sim: 'vlc-matrix-transform'
},

{
  id: 'determinants', parent: 'matrices-topic', title: 'Determinants', level: 2,
  short: 'A single number from a square matrix: the factor by which it scales areas or volumes, negative when it flips orientation, zero when it collapses space.',
  keywords: ['determinant', 'det', 'area scale factor', 'volume', 'orientation', 'singular', 'cofactor expansion', 'Laplace expansion', 'Cramer\'s rule', 'Jacobian'],
  prereq: ['matrices', 'matrix-multiplication'],
  related: ['matrix-inverse', 'linear-transformations', 'eigenvalues', 'cross-product', 'gaussian-elimination', 'multiple-integrals'],
  body: `
### One number that measures a matrix
A $2\\times 2$ matrix sends the unit square to a parallelogram whose sides are its two columns, $(a, c)$ and $(b, d)$. The **determinant** is the signed area of that parallelogram:

$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$$

Every shape in the plane has its area multiplied by the same factor, $|\\det A|$. The **sign** records orientation: positive if turning from the first column to the second is still anticlockwise, as it is from $\\hat\\imath$ to $\\hat\\jmath$; negative if the transformation flips the plane over like a mirror.

- $\\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ has determinant $6 - 1 = 5$: areas grow fivefold.
- A rotation has determinant $\\cos^2\\theta + \\sin^2\\theta = 1$: areas are unchanged.
- A shear $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$ has determinant 1: the square leans over but keeps its area.
- A reflection $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ has determinant $-1$.
- $\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ has determinant 0: its columns are parallel, and the whole plane is squashed onto a line.

### Zero means collapse
$\\det A = 0$ is the critical case. The transformation flattens space into fewer dimensions, so different points land on the same image and nothing can undo it: the matrix is **singular** and has no [[matrix-inverse|inverse]]. Its columns are linearly dependent, and the system $A\\vec x = \\vec b$ has either no solution or infinitely many. A non-zero determinant guarantees exactly one solution for every $\\vec b$.

### Three by three
For a $3\\times 3$ matrix the determinant is the signed **volume** scale factor. Expand along the first row: each entry times the $2\\times 2$ determinant left when its row and column are struck out, with alternating signs,

$$\\begin{vmatrix} a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\\\ c_1 & c_2 & c_3 \\end{vmatrix} = a_1\\begin{vmatrix} b_2 & b_3 \\\\ c_2 & c_3 \\end{vmatrix} - a_2\\begin{vmatrix} b_1 & b_3 \\\\ c_1 & c_3 \\end{vmatrix} + a_3\\begin{vmatrix} b_1 & b_2 \\\\ c_1 & c_2 \\end{vmatrix}$$

This equals the triple product of the three rows, the volume of the slanted box they span ([[cross-product]]). The same **cofactor expansion** works for any size, but its cost grows like $n!$, so large determinants are computed by elimination instead.

### Rules that make it computable
- $\\det(AB) = \\det A\\,\\det B$: scale factors multiply.
- $\\det(A^T) = \\det A$ and $\\det(A^{-1}) = 1/\\det A$.
- Swapping two rows changes the sign; multiplying a row by $k$ multiplies the determinant by $k$ (so $\\det(kA) = k^n\\det A$ for an $n\\times n$ matrix); adding a multiple of one row to another changes nothing.
- The determinant of a triangular matrix is the product of its diagonal entries.

Together these give the practical method: reduce the matrix to triangular form by [[gaussian-elimination|elimination]] and multiply the pivots, changing the sign once for each row swap.

### Where determinants appear
They decide whether a system has a unique solution; they give **Cramer's rule**, $x = \\det A_x / \\det A$, for small systems; they produce the characteristic equation $\\det(A - \\lambda I) = 0$ that finds [[eigenvalues]]; and, as the **Jacobian**, they convert areas and volumes when coordinates change in a [[multiple-integrals|multiple integral]] — the $r$ in $dA = r\\,dr\\,d\\theta$ is a determinant.
`,
  ideas: [
    'For a 2 × 2 matrix, det = ad − bc: the signed area of the image of the unit square.',
    '|det A| is the factor by which A scales every area (or volume, in 3-D).',
    'A negative determinant means the orientation is flipped.',
    'det A = 0 exactly when A squashes space flat, has dependent columns and no inverse.',
    'det(AB) = det A · det B.'
  ],
  pitfalls: [
    'det(A + B) = det A + det B — False in general; it is products that behave well: det(AB) = det A det B.',
    'det(2A) = 2 det A — For an n × n matrix every one of the n rows is doubled, so det(2A) = 2ⁿ det A.',
    'Forgetting the alternating signs in a cofactor expansion — The middle term of a 3 × 3 expansion along the first row is subtracted.'
  ],
  derivation: {
    title: 'Why ad − bc is the area',
    steps: [
      { text: 'Take positive entries with the column $(a, c)$ below and to the right of $(b, d)$. The parallelogram with corners $0$, $(a, c)$, $(a + b, c + d)$, $(b, d)$ fits inside a rectangle of size $(a + b)\\times(c + d)$.' },
      { text: 'The rectangle minus the parallelogram consists of two triangles of area $\\tfrac12 ac$, two of area $\\tfrac12 bd$, and two small rectangles of area $bc$:', tex: '\\text{area} = (a + b)(c + d) - ac - bd - 2bc' },
      { text: 'Multiply out:', tex: '\\text{area} = ac + ad + bc + bd - ac - bd - 2bc = ad - bc' },
      { text: 'In other arrangements the same algebra gives $ad - bc$ with a sign that records whether the two columns are in anticlockwise or clockwise order.' }
    ]
  },
  formulas: [
    {
      name: 'Determinant of a 2 × 2 matrix',
      expr: 'D = a*d - b*c', tex: 'D = ad - bc',
      vars: {
        D: { name: 'determinant', signed: true },
        a: { name: 'row 1, column 1', value: 3, signed: true },
        b: { name: 'row 1, column 2', value: 1, signed: true },
        c: { name: 'row 2, column 1', value: 1, signed: true },
        d: { name: 'row 2, column 2', value: 2, signed: true }
      },
      note: 'Set $D = 0$ and solve for one entry to find the value that makes the matrix singular.'
    },
    {
      name: 'Determinant of a 3 × 3 matrix',
      expr: 'D = a1*(b2*c3 - b3*c2) - a2*(b1*c3 - b3*c1) + a3*(b1*c2 - b2*c1)',
      tex: 'D = a_1(b_2c_3 - b_3c_2) - a_2(b_1c_3 - b_3c_1) + a_3(b_1c_2 - b_2c_1)',
      vars: {
        D: { name: 'determinant', signed: true },
        a1: { name: 'row 1, column 1', tex: 'a_1', value: 2, signed: true },
        a2: { name: 'row 1, column 2', tex: 'a_2', value: 1, signed: true },
        a3: { name: 'row 1, column 3', tex: 'a_3', value: 3, signed: true },
        b1: { name: 'row 2, column 1', tex: 'b_1', value: 1, signed: true },
        b2: { name: 'row 2, column 2', tex: 'b_2', value: 3, signed: true },
        b3: { name: 'row 2, column 3', tex: 'b_3', value: 1, signed: true },
        c1: { name: 'row 3, column 1', tex: 'c_1', value: 4, signed: true },
        c2: { name: 'row 3, column 2', tex: 'c_2', value: 1, signed: true },
        c3: { name: 'row 3, column 3', tex: 'c_3', value: 2, signed: true }
      },
      note: 'The rows of the matrix are $(a_1, a_2, a_3)$, $(b_1, b_2, b_3)$ and $(c_1, c_2, c_3)$.',
      practice: { unknowns: ['D'] }
    }
  ],
  examples: [
    {
      title: 'The area of a triangle',
      q: 'Find the area of the triangle with corners $(1, 1)$, $(4, 2)$ and $(2, 5)$.',
      steps: [
        'Edge vectors from $(1, 1)$: $(3, 1)$ and $(1, 4)$.',
        'The parallelogram they span has area $\\left|\\det\\begin{pmatrix} 3 & 1 \\\\ 1 & 4 \\end{pmatrix}\\right| = |12 - 1| = 11$.',
        'The triangle is half of it: 5.5.',
        'The determinant is positive, so the corners, taken in the order given, run anticlockwise.'
      ],
      a: '5.5'
    },
    {
      title: 'A 3 × 3 determinant two ways',
      q: 'Find $\\det A$ for $A = \\begin{pmatrix} 2 & 1 & 3 \\\\ 1 & 3 & 1 \\\\ 4 & 1 & 2 \\end{pmatrix}$ by cofactor expansion, then check it by elimination.',
      steps: [
        'Expansion: $2(3\\cdot 2 - 1\\cdot 1) - 1(1\\cdot 2 - 1\\cdot 4) + 3(1\\cdot 1 - 3\\cdot 4) = 10 + 2 - 33 = -21$.',
        'Elimination: $R_2 - \\tfrac12 R_1$ gives $(0, 2.5, -0.5)$ and $R_3 - 2R_1$ gives $(0, -1, -4)$.',
        'Then $R_3 + 0.4R_2$ gives $(0, 0, -4.2)$. No rows were swapped, so $\\det A = 2 \\times 2.5 \\times (-4.2) = -21$.',
        'The matrix scales volumes by 21 and reverses orientation.'
      ],
      a: '−21'
    }
  ],
  quiz: [
    { q: 'A $2\\times 2$ matrix has determinant 0. It…', choices: ['is the identity', 'squashes the plane onto a line (or a point)', 'is a rotation', 'doubles every area'], a: 1,
      why: 'Zero area scale factor: the image of the unit square has no area, so the plane collapses and the matrix has no inverse.' },
    { q: 'A $3\\times 3$ matrix $A$ has $\\det A = 5$. Then $\\det(2A)$ is…', choices: ['10', '40', '25', '30'], a: 1,
      why: 'Each of the three rows is doubled, and each doubling doubles the determinant: $2^3 \\times 5 = 40$. (Volumes scale by $2^3$.)' },
    { q: 'Swapping two rows of a matrix changes the sign of its determinant.', a: true,
      why: 'It reverses the orientation of the rows, which flips the sign and leaves the size unchanged.' },
    { q: 'Write $\\det\\begin{pmatrix} x & 2 \\\\ 3 & x \\end{pmatrix}$.', answer: 'x^2 - 6', vars: ['x'],
      why: '$ad - bc = x \\cdot x - 2 \\cdot 3 = x^2 - 6$. The matrix is singular when $x = \\pm\\sqrt 6$.' },
    { q: 'A reflection of the plane in a line through the origin has determinant…', choices: ['1', '0', '−1', '2'], a: 2,
      why: 'It keeps every area but reverses orientation, like a mirror.' }
  ],
  problems: [
    { q: 'Find the determinant of $\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 6 \\end{pmatrix}$.', answer: 22, tol: 0.001,
      steps: ['Expand along the first row: $1(4\\cdot 6 - 5\\cdot 0) - 2(0\\cdot 6 - 5\\cdot 1) + 3(0\\cdot 0 - 4\\cdot 1)$.', '$= 24 + 10 - 12 = 22$.'] }
  ],
  applications: [
    'Testing whether a system of equations has a unique solution.',
    'Areas and volumes from coordinates, in surveying and computer graphics.',
    'Changing variables in multiple integrals (the Jacobian).',
    'Finding eigenvalues through the characteristic equation.'
  ],
  sim: 'vlc-matrix-transform'
},

{
  id: 'matrix-inverse', parent: 'matrices-topic', title: 'The inverse matrix', level: 2,
  short: 'The matrix that undoes A, with A⁻¹A = I. It exists exactly when det A ≠ 0, and it solves Ax = b as x = A⁻¹b.',
  keywords: ['inverse matrix', 'A inverse', 'invertible', 'singular', 'non-singular', '2×2 inverse', 'Gauss–Jordan', 'adjugate', 'Cramer\'s rule', 'ill-conditioned', 'orthogonal matrix'],
  prereq: ['matrix-multiplication', 'determinants'],
  related: ['gaussian-elimination', 'linear-transformations', 'inverse-functions', 'systems-of-equations'],
  body: `
### Undoing a matrix
Multiplying by 5 is undone by multiplying by $\\tfrac15$. For matrices the role of 1 is played by the identity $I$, and the **inverse** of a square matrix $A$ is the matrix $A^{-1}$ with

$$A^{-1}A = AA^{-1} = I$$

Geometrically, $A^{-1}$ is the transformation that undoes $A$: if $A$ rotates by 30°, $A^{-1}$ rotates back by 30°; if $A$ stretches by 2 along some line, $A^{-1}$ shrinks by 2 along it. A transformation that squashes the plane onto a line cannot be undone — too many points have landed on top of one another. So $A^{-1}$ exists exactly when $\\det A \\ne 0$. Such matrices are **invertible** (or non-singular); the others are **singular**.

### The 2 × 2 formula
Swap the two diagonal entries, change the signs of the other two, and divide by the determinant:

$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

For $A = \\begin{pmatrix} 4 & 7 \\\\ 2 & 6 \\end{pmatrix}$, $\\det A = 24 - 14 = 10$ and $A^{-1} = \\begin{pmatrix} 0.6 & -0.7 \\\\ -0.2 & 0.4 \\end{pmatrix}$; multiplying back gives $I$. The division by $ad - bc$ shows at a glance why a zero determinant is fatal.

### Solving systems
Multiply both sides of $A\\vec x = \\vec b$ on the left by $A^{-1}$: $\\vec x = A^{-1}\\vec b$. For $4x + 7y = 1$ and $2x + 6y = 2$ this gives $x = 0.6 - 1.4 = -0.8$ and $y = -0.2 + 0.8 = 0.6$. Once $A^{-1}$ is known, every new right-hand side costs just one multiplication. (For a single system, though, [[gaussian-elimination|elimination]] is faster and more accurate than forming the inverse, and it is what software does.)

### Larger matrices: Gauss–Jordan
Write $A$ and $I$ side by side, $[A \\mid I]$, and apply row operations until the left half has become $I$. The same operations turn the right half into $A^{-1}$, because together they amount to multiplying by $A^{-1}$. If a row of zeros appears on the left instead, $A$ is singular and has no inverse.

### Rules
- $(AB)^{-1} = B^{-1}A^{-1}$: to undo "socks, then shoes", take off the shoes first.
- $(A^T)^{-1} = (A^{-1})^T$, and $\\det(A^{-1}) = 1/\\det A$.
- For a rotation — or any **orthogonal** matrix, one whose columns are perpendicular unit vectors — the inverse is simply the transpose, $A^{-1} = A^T$. That makes rotations cheap to undo in graphics and robotics.
- A matrix that is *nearly* singular is invertible, but small errors in $\\vec b$ then cause large changes in $\\vec x$. Such systems are called **ill-conditioned**; the condition number of the matrix measures how badly errors are amplified.

> [!tip] In the matrix simulation, pick a preset, note where a test vector lands, then imagine the matrix that sends it back. Try the **Singular** preset: many vectors land on the same point, so no inverse can exist.
`,
  ideas: [
    'A⁻¹ undoes A: A⁻¹A = AA⁻¹ = I.',
    'A square matrix has an inverse exactly when its determinant is not zero.',
    'For 2 × 2: swap a and d, negate b and c, divide by ad − bc.',
    'Ax = b has the unique solution x = A⁻¹b when A is invertible.',
    '(AB)⁻¹ = B⁻¹A⁻¹: undo in the reverse order.'
  ],
  pitfalls: [
    'A⁻¹ is the matrix of reciprocals 1/aᵢⱼ — Not at all; the inverse mixes all the entries, as the 2 × 2 formula shows.',
    '(AB)⁻¹ = A⁻¹B⁻¹ — The order reverses: (AB)⁻¹ = B⁻¹A⁻¹.',
    'Writing x = b/A — There is no matrix division, and A⁻¹ must go on the left: x = A⁻¹b, since AB ≠ BA in general.'
  ],
  formulas: [
    {
      name: 'Solving a 2 × 2 system: x',
      expr: 'x = (p*d - b*q)/(a*d - b*c)', tex: 'x = \\frac{pd - bq}{ad - bc}',
      vars: {
        x: { name: 'first unknown', signed: true },
        a: { name: 'coefficient of x in equation 1', value: 4, signed: true },
        b: { name: 'coefficient of y in equation 1', value: 7, signed: true },
        c: { name: 'coefficient of x in equation 2', value: 2, signed: true },
        d: { name: 'coefficient of y in equation 2', value: 6, signed: true },
        p: { name: 'right-hand side of equation 1', value: 1, signed: true },
        q: { name: 'right-hand side of equation 2', value: 2, signed: true }
      },
      note: 'The system $ax + by = p$, $cx + dy = q$, solved with $\\vec x = A^{-1}\\vec b$ (this is also Cramer\'s rule). No solution formula exists when $ad - bc = 0$.',
      practice: { unknowns: ['x'] }
    },
    {
      name: 'Solving a 2 × 2 system: y',
      expr: 'y = (a*q - p*c)/(a*d - b*c)', tex: 'y = \\frac{aq - pc}{ad - bc}',
      vars: {
        y: { name: 'second unknown', signed: true },
        a: { name: 'coefficient of x in equation 1', value: 4, signed: true },
        b: { name: 'coefficient of y in equation 1', value: 7, signed: true },
        c: { name: 'coefficient of x in equation 2', value: 2, signed: true },
        d: { name: 'coefficient of y in equation 2', value: 6, signed: true },
        p: { name: 'right-hand side of equation 1', value: 1, signed: true },
        q: { name: 'right-hand side of equation 2', value: 2, signed: true }
      },
      practice: { unknowns: ['y'] }
    }
  ],
  examples: [
    {
      title: 'Inverse, then solve',
      q: 'Find the inverse of $A = \\begin{pmatrix} 4 & 7 \\\\ 2 & 6 \\end{pmatrix}$ and use it to solve $4x + 7y = 1$, $2x + 6y = 2$.',
      steps: [
        '$\\det A = 4\\cdot 6 - 7\\cdot 2 = 10$, not zero, so the inverse exists.',
        '$A^{-1} = \\tfrac{1}{10}\\begin{pmatrix} 6 & -7 \\\\ -2 & 4 \\end{pmatrix}$.',
        '$\\vec x = A^{-1}\\vec b = \\tfrac{1}{10}\\begin{pmatrix} 6\\cdot 1 - 7\\cdot 2 \\\\ -2\\cdot 1 + 4\\cdot 2 \\end{pmatrix} = \\tfrac{1}{10}\\begin{pmatrix} -8 \\\\ 6 \\end{pmatrix}$.',
        'So $x = -0.8$ and $y = 0.6$. Check: $4(-0.8) + 7(0.6) = 1$ and $2(-0.8) + 6(0.6) = 2$.'
      ],
      a: 'x = −0.8, y = 0.6'
    },
    {
      title: 'A 3 × 3 inverse by Gauss–Jordan',
      q: 'Invert $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 1 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$.',
      steps: [
        'Start from $[A \\mid I]$ and swap rows 1 and 2, so that the first pivot is 1: rows $(1, 1, 0 \\mid 0, 1, 0)$ and $(2, 1, 0 \\mid 1, 0, 0)$.',
        '$R_2 \\leftarrow R_2 - 2R_1$ gives $(0, -1, 0 \\mid 1, -2, 0)$; then $R_2 \\leftarrow -R_2$ gives $(0, 1, 0 \\mid -1, 2, 0)$.',
        '$R_1 \\leftarrow R_1 - R_2$ gives $(1, 0, 0 \\mid 1, -1, 0)$, and $R_3 \\leftarrow R_3 / 3$ gives $(0, 0, 1 \\mid 0, 0, \\tfrac13)$.',
        { text: 'The left half is now $I$, so', tex: 'A^{-1} = \\begin{pmatrix} 1 & -1 & 0 \\\\ -1 & 2 & 0 \\\\ 0 & 0 & \\tfrac13 \\end{pmatrix}' },
        'Check one entry of $AA^{-1}$: row 1 of $A$ times column 1 of $A^{-1}$ is $2 - 1 + 0 = 1$.'
      ],
      a: 'A⁻¹ = [[1, −1, 0], [−1, 2, 0], [0, 0, 1/3]]'
    }
  ],
  quiz: [
    { q: 'Which matrix has no inverse?', choices: ['$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$', '$\\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$', '$\\begin{pmatrix} 3 & 0 \\\\ 0 & 3 \\end{pmatrix}$'], a: 1,
      why: 'Its determinant is $4 - 4 = 0$: the second column is twice the first. The others have determinants $-2$, $-1$ and $9$.' },
    { q: '$(AB)^{-1}$ equals…', choices: ['$A^{-1}B^{-1}$', '$B^{-1}A^{-1}$', '$AB$', '$(BA)^{-1}$'], a: 1,
      why: '$(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AA^{-1} = I$. The last transformation applied must be the first undone.' },
    { q: 'The inverse of the rotation matrix by $\\theta$ is the rotation by $-\\theta$, which is also its transpose.', a: true,
      why: 'Replacing $\\theta$ by $-\\theta$ flips the signs of the sines, which is exactly the same as swapping the off-diagonal entries.' },
    { q: 'Write the top-left entry of the inverse of $\\begin{pmatrix} x & 1 \\\\ 1 & 1 \\end{pmatrix}$.', answer: '1/(x - 1)', vars: ['x'],
      why: 'The determinant is $x - 1$, and the top-left entry of the inverse is $d/(ad - bc) = 1/(x - 1)$. There is no inverse when $x = 1$.' },
    { q: 'If $\\det A = 4$, then $\\det(A^{-1})$ is…', choices: ['4', '−4', '1/4', '16'], a: 2,
      why: '$\\det(A)\\det(A^{-1}) = \\det I = 1$. If $A$ quadruples areas, its inverse must quarter them.' }
  ],
  problems: [
    { q: 'Solve $3x + 2y = 7$ and $x - y = -1$ with the inverse matrix. What is $y$?', answer: 2, tol: 0.001,
      steps: ['$\\det A = 3(-1) - 2(1) = -5$, so $A^{-1} = -\\tfrac15\\begin{pmatrix} -1 & -2 \\\\ -1 & 3 \\end{pmatrix}$.', '$\\vec x = A^{-1}\\begin{pmatrix} 7 \\\\ -1 \\end{pmatrix} = -\\tfrac15\\begin{pmatrix} -7 + 2 \\\\ -7 - 3 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$.', 'So $x = 1$, $y = 2$.'] }
  ],
  applications: [
    'Undoing camera and object transformations in 3-D graphics.',
    'Solving circuit and structural equations for many different loads at once.',
    'Calibration: converting raw sensor readings back into physical quantities.',
    'The Hill cipher, a classical code that encrypts with a matrix and decrypts with its inverse.'
  ],
  sim: ['vlc-matrix-transform', 'vlc-elimination']
},

{
  id: 'gaussian-elimination', parent: 'matrices-topic', title: 'Gaussian elimination', level: 2,
  short: 'Solve a system of linear equations with row operations that clear the unknowns one column at a time, then substitute back.',
  keywords: ['Gaussian elimination', 'row reduction', 'row operations', 'pivot', 'row echelon form', 'reduced row echelon form', 'back substitution', 'Gauss–Jordan', 'augmented matrix', 'partial pivoting', 'rank', 'free variable'],
  prereq: ['systems-of-equations', 'matrices'],
  related: ['matrix-inverse', 'determinants', 'vector-spaces', 'linear-equations'],
  body: `
### Clearing unknowns systematically
Solving three equations in three unknowns at school means eliminating one unknown at a time. **Gaussian elimination** turns that idea into a routine that works for any number of equations and that a computer can follow. Write the system as an augmented matrix — the coefficients, then the right-hand sides — and use only three **row operations**, none of which changes the solutions:

1. swap two rows;
2. multiply a row by a non-zero number;
3. add a multiple of one row to another.

### Forward elimination
Take $x + 3y + 2z = 13$, $2x + y - z = 1$ and $3x - y + z = 4$:

$$\\begin{pmatrix} 1 & 3 & 2 & 13 \\\\ 2 & 1 & -1 & 1 \\\\ 3 & -1 & 1 & 4 \\end{pmatrix}$$

The first entry of row 1 is the **pivot**. Use it to clear the entries below it, with $R_2 \\leftarrow R_2 - 2R_1$ and $R_3 \\leftarrow R_3 - 3R_1$. The second pivot, $-5$, then clears the entry below it: $R_3 \\leftarrow R_3 - 2R_2$.

$$\\begin{pmatrix} 1 & 3 & 2 & 13 \\\\ 0 & -5 & -5 & -25 \\\\ 0 & -10 & -5 & -35 \\end{pmatrix} \\;\\to\\; \\begin{pmatrix} 1 & 3 & 2 & 13 \\\\ 0 & -5 & -5 & -25 \\\\ 0 & 0 & 5 & 15 \\end{pmatrix}$$

This staircase, with zeros below every pivot, is **row echelon form**.

### Back substitution
Now read the rows from the bottom up. The last says $5z = 15$, so $z = 3$. The middle says $-5y - 5z = -25$, so $y = 2$. The top gives $x = 13 - 3y - 2z = 1$. Check in the original equations: $2 + 2 - 3 = 1$ and $3 - 2 + 3 = 4$.

### Three possible endings
- **A pivot in every column**: exactly one solution. Geometrically, three planes meet at a single point.
- **A row that reads $0 = c$ with $c \\ne 0$**: no solution. The equations contradict each other.
- **Fewer pivots than unknowns and no contradiction**: infinitely many solutions. The unknowns without a pivot are *free* — choose them at will and solve for the rest. The planes share a whole line (or plane).

The number of pivots is the **rank** of the matrix.

### Variations
**Gauss–Jordan** elimination carries on: it scales every pivot to 1 and clears the entries above the pivots as well, reaching the *reduced* row echelon form, from which the solution can be read straight off. Applied to $[A \\mid I]$, it produces the [[matrix-inverse|inverse matrix]]. And the product of the pivots, with a sign change for each row swap, is the [[determinants|determinant]].

Computers use elimination, organised as an "LU decomposition", for almost every linear system; for $n$ equations it takes about $\\tfrac23 n^3$ arithmetic operations. They also use **partial pivoting** — swapping rows so that each pivot is the largest entry available in its column — because dividing by a tiny pivot magnifies rounding errors enormously.
`,
  ideas: [
    'Row operations (swap, scale by a non-zero number, add a multiple of another row) never change the solutions.',
    'Forward elimination makes zeros below each pivot: row echelon form.',
    'Back substitution then solves from the last equation upwards.',
    'A row 0 = c (c ≠ 0) means no solution; a missing pivot without contradiction means infinitely many.',
    'Gauss–Jordan elimination goes on to the reduced form, and computes inverses.'
  ],
  pitfalls: [
    'Multiplying a row by zero — That destroys an equation and can create false solutions; only non-zero multiples are allowed.',
    'Changing only the coefficients — A row operation must be applied to the whole row, right-hand side included.',
    'A row of zeros means no solution — 0 = 0 is harmless; it signals a redundant equation (and, with too few pivots, infinitely many solutions). Only 0 = non-zero is a contradiction.'
  ],
  formulas: [
    {
      name: 'Work to solve n equations by elimination',
      expr: 'N = 2/3*n^3', tex: 'N \\approx \\tfrac23 n^3',
      vars: {
        N: { name: 'arithmetic operations (roughly)' },
        n: { name: 'number of equations and unknowns', value: 100, int: true }
      },
      note: 'Doubling the number of unknowns multiplies the work by eight. A modern computer handles $n = 10\\,000$ in seconds.',
      stories: { N: 'Roughly how many arithmetic operations does elimination need for a system of {n} equations in {n} unknowns?' }
    }
  ],
  examples: [
    {
      title: 'A system with infinitely many solutions',
      q: 'Solve $x + y + z = 3$, $x - y + 2z = 2$, $2x + 3z = 5$.',
      steps: [
        '$R_2 \\leftarrow R_2 - R_1$ gives $(0, -2, 1 \\mid -1)$; $R_3 \\leftarrow R_3 - 2R_1$ gives $(0, -2, 1 \\mid -1)$.',
        '$R_3 \\leftarrow R_3 - R_2$ gives $(0, 0, 0 \\mid 0)$: no contradiction, but only two pivots. $z$ is free; call it $t$.',
        'Row 2: $-2y + t = -1$, so $y = \\tfrac12(1 + t)$. Row 1: $x = 3 - y - z = \\tfrac12(5 - 3t)$.',
        'Every $t$ gives a solution: $t = 1$ gives $(1, 1, 1)$, $t = 3$ gives $(-2, 2, 3)$. The solutions fill a line in space.'
      ],
      a: 'x = (5 − 3t)/2, y = (1 + t)/2, z = t for any t.'
    },
    {
      title: 'Why pivoting matters',
      q: 'Solve $0.0001x + y = 1$, $x + y = 2$ by elimination, rounding every result to 3 significant figures, first without and then with a row swap.',
      steps: [
        'Without swapping, the pivot is 0.0001 and the multiplier is 10 000: $R_2$ becomes $(1 - 10000)y = 2 - 10000$, that is $-9999y = -9998$, which rounds to $-10000y = -10000$, so $y = 1.00$.',
        'Back-substituting: $0.0001x = 1 - 1.00 = 0$, so $x = 0$ — badly wrong.',
        'With the rows swapped, the pivot is 1: $R_2 \\leftarrow R_2 - 0.0001R_1$ gives $y \\approx 1.00$, and then $x = 2 - y = 1.00$.',
        'The true solution is $x = 1.0001$, $y = 0.9999$. The large pivot kept the rounding errors small.'
      ],
      a: 'Without pivoting x = 0 (wrong); with pivoting x = 1.00, y = 1.00 (right).'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT an allowed row operation?', choices: ['swap two rows', 'multiply a row by 5', 'add 3 times one row to another', 'multiply a row by 0'], a: 3,
      why: 'Multiplying by zero wipes out an equation and can change the solution set. The others can all be undone.' },
    { q: 'After elimination, one row of the augmented matrix reads $(0, 0, 0 \\mid 4)$. The system has…', choices: ['a unique solution', 'no solution', 'infinitely many solutions', 'the solution z = 4'], a: 1,
      why: 'That row says $0x + 0y + 0z = 4$, which no values can satisfy.' },
    { q: 'A system of 3 equations in 3 unknowns always has exactly one solution.', a: false,
      why: 'It can have none (the equations contradict each other) or infinitely many (one equation is a combination of the others).' },
    { q: 'Rows $R_1 = (1, 2 \\mid 5)$ and $R_2 = (2, a \\mid 3)$. After $R_2 \\leftarrow R_2 - 2R_1$, write the new coefficient of $y$ in row 2.', answer: 'a - 4', vars: ['a'],
      why: '$a - 2 \\times 2 = a - 4$. If $a = 4$ the second pivot vanishes — and then row 2 reads $0 = -7$: no solution.' },
    { q: 'Why do computer programs swap rows to use the largest available pivot?', choices: ['without it no solution exists', 'dividing by tiny pivots magnifies rounding errors', 'it makes the determinant positive', 'it reduces the number of unknowns'], a: 1,
      why: 'A tiny pivot creates huge multipliers, and the rounding errors they carry swamp the true values. Partial pivoting keeps every multiplier at most 1 in size.' }
  ],
  problems: [
    { q: 'Solve $x + y + z = 6$, $2y + 5z = -4$, $2x + 5y - z = 27$. What is $z$?', answer: -2, tol: 0.001,
      steps: ['$R_3 \\leftarrow R_3 - 2R_1$: $(0, 3, -3 \\mid 15)$.', '$R_3 \\leftarrow R_3 - \\tfrac32 R_2$: $(0, 0, -10.5 \\mid 21)$, so $z = -2$.', 'Back substitution: $2y - 10 = -4$ gives $y = 3$, then $x = 6 - 3 + 2 = 5$.'] }
  ],
  applications: [
    'Every large linear system in engineering: finite-element models of structures, circuit simulation, fluid flow.',
    'Least-squares fitting of data, which leads to a linear system.',
    'Computing inverses, determinants and ranks.',
    'Balancing chemical equations, which are small linear systems.'
  ],
  history: 'The method appears in the Chinese *Nine Chapters on the Mathematical Art*, compiled about two thousand years ago, where systems were solved with counting rods on a board. Gauss used it systematically around 1810 to compute the orbit of the asteroid Pallas by least squares, and his name has stayed with it.',
  sim: 'vlc-elimination'
},

{
  id: 'linear-transformations', parent: 'matrices-topic', title: 'Linear transformations', level: 2,
  short: 'Maps of space that keep straight lines straight, parallel lines parallel and the origin fixed — rotations, reflections, stretches, shears, projections — each given by a matrix.',
  keywords: ['linear transformation', 'linear map', 'matrix of a transformation', 'rotation matrix', 'reflection', 'shear', 'scaling', 'projection', 'composition', 'kernel', 'image', 'basis vectors'],
  prereq: ['matrix-multiplication', 'vector-components'],
  related: ['determinants', 'eigenvalues', 'vector-spaces', 'matrix-inverse', 'sum-and-difference', 'physics:lorentz-transformation'],
  body: `
### Maps that keep the grid regular
A **linear transformation** of the plane moves every point, but in a disciplined way: straight lines stay straight, parallel lines stay parallel and evenly spaced, and the origin stays where it is. In symbols, $T$ respects addition and scaling:

$$T(\\vec u + \\vec v) = T(\\vec u) + T(\\vec v), \\qquad T(k\\vec u) = k\\,T(\\vec u)$$

Rotations about the origin, reflections in lines through it, stretches, shears and projections are all linear. Shifting everything sideways is not — it moves the origin — and neither is anything that bends lines.

### Two arrows say it all
Every vector is a combination $x\\hat\\imath + y\\hat\\jmath$, so linearity gives $T(x, y) = x\\,T(\\hat\\imath) + y\\,T(\\hat\\jmath)$. A linear transformation is therefore completely determined by **where it sends the two basis vectors**, and those two images, written as columns, form its **matrix**: the first column is $T(\\hat\\imath)$, the second $T(\\hat\\jmath)$, and $T(\\vec x) = A\\vec x$.

To find the matrix of a transformation, just ask where $\\hat\\imath$ and $\\hat\\jmath$ go. A rotation by $\\theta$ sends $\\hat\\imath$ to $(\\cos\\theta, \\sin\\theta)$ and $\\hat\\jmath$ to $(-\\sin\\theta, \\cos\\theta)$, which gives the first matrix in the table.

| Transformation | Matrix | Determinant |
|---|---|---|
| rotation by $\\theta$ | $\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$ | 1 |
| stretch by $s_x$ and $s_y$ | $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$ | $s_x s_y$ |
| reflection in the $x$-axis | $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ | −1 |
| shear along $x$ | $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$ | 1 |
| projection onto the $x$-axis | $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ | 0 |

### Combining and undoing
Doing one transformation after another corresponds to [[matrix-multiplication|multiplying their matrices]], in right-to-left order, since $AB\\vec x$ applies $B$ first. Undoing a transformation corresponds to the [[matrix-inverse|inverse matrix]]. Two rotations combine into a rotation by the sum of the angles; multiplying their matrices out is one way to derive the [[sum-and-difference|angle-sum formulas]] of trigonometry.

### What a transformation keeps and what it loses
The [[determinants|determinant]] is the factor by which it scales areas, negative if it flips orientation. A projection flattens the plane onto a line and has determinant 0: a whole line of vectors — its **kernel** — is sent to zero, and the set of all outputs, its **image**, is only a line. The directions that the transformation merely stretches are its eigenvectors ([[eigenvalues]]).

### Beyond pictures
Linearity is not only geometry. Differentiation is linear — the derivative of $f + g$ is $f' + g'$, and of $kf$ is $kf'$ — and so is integration. The [[physics:lorentz-transformation|Lorentz transformation]] of special relativity is a linear map of space-time coordinates, and in quantum mechanics every measurable quantity is a linear operator. Computer graphics moves, turns and projects every object onto the screen with matrices, using one extra coordinate so that shifts can be written as matrix products as well.
`,
  ideas: [
    'A linear transformation keeps lines straight, parallel lines parallel and the origin fixed.',
    'It is fixed by where it sends î and ĵ; those images are the columns of its matrix.',
    'Composing transformations multiplies their matrices; undoing one uses the inverse.',
    'The determinant is the area scale factor of the transformation.',
    'A translation is not linear, because it moves the origin.'
  ],
  pitfalls: [
    'The rows of the matrix are the images of î and ĵ — It is the columns. A row describes where one coordinate of the output comes from.',
    'Every transformation of the plane has a matrix — Only linear ones do; a shift or a bending of lines does not.',
    'Composition order does not matter — AB applies B first; rotating then shearing differs from shearing then rotating.'
  ],
  formulas: [
    {
      name: 'Rotating a point: new x',
      expr: 'X = x*cos(theta) - y*sin(theta)', tex: 'X = x\\cos\\theta - y\\sin\\theta',
      vars: {
        X: { name: 'x-coordinate after the rotation', signed: true },
        x: { name: 'x-coordinate before', value: 3, signed: true },
        y: { name: 'y-coordinate before', value: 1, signed: true },
        theta: { name: 'angle of rotation (anticlockwise)', q: 'angle', unit: '°', value: 30, min: -180, max: 180, signed: true }
      },
      practice: { unknowns: ['X'] }
    },
    {
      name: 'Rotating a point: new y',
      expr: 'Y = x*sin(theta) + y*cos(theta)', tex: 'Y = x\\sin\\theta + y\\cos\\theta',
      vars: {
        Y: { name: 'y-coordinate after the rotation', signed: true },
        x: { name: 'x-coordinate before', value: 3, signed: true },
        y: { name: 'y-coordinate before', value: 1, signed: true },
        theta: { name: 'angle of rotation (anticlockwise)', q: 'angle', unit: '°', value: 30, min: -180, max: 180, signed: true }
      },
      note: 'Together with the formula for X, this is multiplication by the rotation matrix.',
      practice: { unknowns: ['Y'] }
    }
  ],
  examples: [
    {
      title: 'The matrix of a rotation',
      q: 'Write the matrix of the rotation by 30° anticlockwise, and find where it sends the point $(3, 1)$.',
      steps: [
        '$\\hat\\imath \\to (\\cos 30°, \\sin 30°) = (0.866, 0.5)$ and $\\hat\\jmath \\to (-\\sin 30°, \\cos 30°) = (-0.5, 0.866)$.',
        'So $R = \\begin{pmatrix} 0.866 & -0.5 \\\\ 0.5 & 0.866 \\end{pmatrix}$.',
        '$R\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 2.598 - 0.5 \\\\ 1.5 + 0.866 \\end{pmatrix} = \\begin{pmatrix} 2.098 \\\\ 2.366 \\end{pmatrix}$.',
        'Check: the length is still $\\sqrt{10} = 3.16$, as a rotation must preserve it.'
      ],
      a: '(3, 1) moves to (2.098, 2.366).'
    },
    {
      title: 'Shear, then rotate',
      q: 'A shear $S = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ is followed by a rotation by 90°, $R = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$. Find the single matrix, and check it on $(1, 1)$.',
      steps: [
        'Shear first, so the combined matrix is $RS = \\begin{pmatrix} 0 & -1 \\\\ 1 & 1 \\end{pmatrix}$.',
        'Step by step: $S(1, 1) = (2, 1)$, then $R(2, 1) = (-1, 2)$.',
        'In one go: $RS(1, 1) = (0 - 1,\\; 1 + 1) = (-1, 2)$. The same.',
        '$\\det(RS) = 0 + 1 = 1$: both steps preserve area, so their combination does too.'
      ],
      a: 'RS = [[0, −1], [1, 1]]; (1, 1) goes to (−1, 2).'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT a linear transformation of the plane?', choices: ['a rotation about the origin', 'a reflection in the y-axis', 'a shift of 2 units to the right', 'doubling every vector'], a: 2,
      why: 'A shift moves the origin: $T(\\vec 0) \\ne \\vec 0$, which no linear map can do.' },
    { q: 'The columns of the matrix of a linear transformation are…', choices: ['the images of the basis vectors', 'its eigenvalues', 'its rows, transposed', 'the columns of its inverse'], a: 0,
      why: '$A\\hat\\imath$ picks out the first column and $A\\hat\\jmath$ the second.' },
    { q: 'A linear transformation always maps the origin to itself.', a: true,
      why: 'From $T(k\\vec u) = kT(\\vec u)$ with $k = 0$: $T(\\vec 0) = \\vec 0$.' },
    { q: 'A rotation by 90° anticlockwise sends $(x, y)$ to a new point. Write its new $x$-coordinate.', answer: '-y', vars: ['x', 'y'],
      why: 'The rotation matrix is $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$, so $(x, y) \\to (-y, x)$.' },
    { q: 'The matrix $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$…', choices: ['rotates the plane', 'projects it onto the x-axis', 'reflects it in the x-axis', 'shears it'], a: 1,
      why: 'It keeps the $x$-coordinate and sets $y$ to zero: every point drops vertically onto the $x$-axis.' }
  ],
  problems: [
    { q: 'The point $(4, 0)$ is rotated by 60° anticlockwise about the origin. What is its new $y$-coordinate?', answer: 3.464, tol: 0.01,
      steps: ['$Y = x\\sin\\theta + y\\cos\\theta = 4\\sin 60° + 0$.', '$Y = 4 \\times 0.866 = 3.46$.'] }
  ],
  applications: [
    'Computer graphics and games: rotating, scaling and projecting 3-D models.',
    'Robotics: the orientation of each joint is a rotation matrix.',
    'Image processing: resizing, shearing and rotating photographs.',
    'Special relativity: the Lorentz transformation between moving observers.'
  ],
  sim: 'vlc-matrix-transform'
},

{
  id: 'eigenvalues', parent: 'matrices-topic', title: 'Eigenvalues and eigenvectors', level: 3,
  short: 'Special directions that a matrix only stretches, never turns: Av = λv. The stretch factors λ are the eigenvalues.',
  keywords: ['eigenvalue', 'eigenvector', 'characteristic equation', 'characteristic polynomial', 'trace', 'determinant', 'diagonalisation', 'principal axes', 'normal modes', 'stability', 'spectrum'],
  prereq: ['determinants', 'linear-transformations', 'quadratic-equations'],
  related: ['vector-spaces', 'complex-numbers', 'second-order-linear', 'physics:schrodinger-equation', 'physics:moment-of-inertia', 'physics:quantum-numbers'],
  body: `
### Directions that survive
Apply a matrix to every vector of the plane. Most vectors change direction, but a few special directions are only stretched, shrunk or reversed: a vector along one of them comes out as a multiple of itself,

$$A\\vec v = \\lambda\\vec v, \\qquad \\vec v \\ne \\vec 0$$

Such a $\\vec v$ is an **eigenvector** of $A$, and the factor $\\lambda$ is its **eigenvalue** (from the German *eigen*, "own"). For $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ the direction $(1, 1)$ is stretched by 3 and the direction $(1, -1)$ is left unchanged: the eigenvalues are 3 and 1. In the simulation, the eigenvector directions are the dashed lines; drag the test vector onto one of them and $A\\vec v$ lines up with it.

### Finding them
Rewrite $A\\vec v = \\lambda\\vec v$ as $(A - \\lambda I)\\vec v = \\vec 0$. A non-zero solution exists only when $A - \\lambda I$ is singular, that is when

$$\\det(A - \\lambda I) = 0$$

the **characteristic equation**. For a $2\\times 2$ matrix it is a [[quadratic-equations|quadratic]]:

$$\\lambda^2 - (a + d)\\lambda + (ad - bc) = 0, \\quad\\text{that is}\\quad \\lambda^2 - (\\operatorname{tr}A)\\,\\lambda + \\det A = 0$$

so the eigenvalues add up to the trace and multiply to the determinant. For each eigenvalue, solve $(A - \\lambda I)\\vec v = \\vec 0$ by [[gaussian-elimination|elimination]] to find its eigenvectors.

### When there are not enough
- A **rotation** by 90° turns every direction, so it has no real eigenvector. Its characteristic equation, $\\lambda^2 + 1 = 0$, has the roots $\\pm i$: the eigenvalues are [[complex-numbers|complex]], and for a rotation by $\\theta$ they are $e^{\\pm i\\theta}$.
- A **shear** $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ has the eigenvalue 1 twice but only one eigenvector direction, the $x$-axis.
- A **symmetric** matrix is always well behaved: its eigenvalues are real and its eigenvectors mutually perpendicular — the *principal axes*.

### Why they are so useful
If $A$ has a full set of eigenvectors, then in the coordinates they define it acts simply by stretching each axis: $A = PDP^{-1}$, with the eigenvectors in the columns of $P$ and the eigenvalues on the diagonal of $D$. Powers become easy, $A^n = PD^nP^{-1}$, and in the long run the eigenvector with the largest $|\\lambda|$ dominates. That explains the steady state of a Markov chain, the growth rate of a population model, and why the ratio of successive Fibonacci numbers tends to the golden ratio $1.618\\ldots$, the largest eigenvalue of $\\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$. Web search engines first ranked pages by an eigenvector of the matrix of links between them.

### In physics and engineering
- **Vibrations.** Coupled oscillators — atoms in a molecule, the floors of a building — move in *normal modes* whose shapes are eigenvectors and whose frequencies come from eigenvalues. Systems of [[second-order-linear|linear differential equations]] are solved this way.
- **Rotation.** A rigid body spins steadily about its principal axes, the eigenvectors of its inertia matrix ([[physics:moment-of-inertia|moment of inertia]]).
- **Quantum mechanics.** The possible results of a measurement are the eigenvalues of an operator, and the energy levels of an atom are eigenvalues of the [[physics:schrodinger-equation|Schrödinger equation]].
- **Stability.** A control system or an equilibrium is stable when every eigenvalue of its governing matrix leads to decay rather than growth.
`,
  ideas: [
    'An eigenvector keeps its direction under A: Av = λv.',
    'Eigenvalues solve det(A − λI) = 0, the characteristic equation.',
    'For 2 × 2: λ² − (trace)λ + det = 0, so the eigenvalues sum to the trace and multiply to the determinant.',
    'Rotations have complex eigenvalues; symmetric matrices have real ones with perpendicular eigenvectors.',
    'In eigenvector coordinates a matrix just stretches each axis, which makes powers and long-run behaviour easy.'
  ],
  pitfalls: [
    'The zero vector is an eigenvector — It is excluded: A0 = λ0 for every λ, which would say nothing.',
    'An eigenvalue of 0 is not allowed — It is perfectly allowed; it means the matrix is singular and squashes that direction to zero.',
    'Every matrix has real eigenvectors — Rotations have none, and a shear has only one direction.'
  ],
  derivation: {
    title: 'The characteristic equation of a 2 × 2 matrix',
    steps: [
      { text: 'We want $\\vec v \\ne \\vec 0$ with $A\\vec v = \\lambda\\vec v$, that is', tex: '(A - \\lambda I)\\vec v = \\vec 0' },
      { text: 'A matrix sends a non-zero vector to zero only if it is singular, so its determinant must vanish:', tex: '\\det\\begin{pmatrix} a - \\lambda & b \\\\ c & d - \\lambda \\end{pmatrix} = (a - \\lambda)(d - \\lambda) - bc = 0' },
      { text: 'Multiply out:', tex: '\\lambda^2 - (a + d)\\lambda + (ad - bc) = 0' },
      { text: 'By the relations between the roots and coefficients of a quadratic, $\\lambda_1 + \\lambda_2 = a + d$ (the trace) and $\\lambda_1\\lambda_2 = ad - bc$ (the determinant).' }
    ]
  },
  formulas: [
    {
      name: 'Eigenvalues of a 2 × 2 matrix',
      expr: 'lambda^2 - (a + d)*lambda + (a*d - b*c) = 0', tex: '\\lambda^2 - (a + d)\\lambda + (ad - bc) = 0', solveFor: 'lambda',
      vars: {
        lambda: { name: 'eigenvalue', signed: true },
        a: { name: 'row 1, column 1', value: 2, signed: true },
        b: { name: 'row 1, column 2', value: 1, signed: true },
        c: { name: 'row 2, column 1', value: 1, signed: true },
        d: { name: 'row 2, column 2', value: 2, signed: true }
      },
      note: 'Solving for $\\lambda$ gives both eigenvalues. When $(a - d)^2 + 4bc < 0$ there is no real solution: the eigenvalues are complex.',
      practice: { unknowns: ['lambda'] }
    },
    {
      name: 'Eigenvalues from the trace and determinant',
      expr: 'lambda^2 - T*lambda + D = 0', tex: '\\lambda^2 - T\\lambda + D = 0', solveFor: 'lambda',
      vars: {
        lambda: { name: 'eigenvalue', signed: true },
        T: { name: 'trace a + d', value: 7, signed: true },
        D: { name: 'determinant ad − bc', value: 10, signed: true }
      },
      practice: { unknowns: ['lambda'] }
    }
  ],
  examples: [
    {
      title: 'Eigenvalues and eigenvectors',
      q: 'Find the eigenvalues and eigenvectors of $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$.',
      steps: [
        'Trace 7, determinant $12 - 2 = 10$: $\\lambda^2 - 7\\lambda + 10 = 0$, so $\\lambda = 5$ or $\\lambda = 2$.',
        '$\\lambda = 5$: $A - 5I = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}$, so $-v_1 + v_2 = 0$ and $\\vec v = (1, 1)$.',
        '$\\lambda = 2$: $A - 2I = \\begin{pmatrix} 2 & 1 \\\\ 2 & 1 \\end{pmatrix}$, so $2v_1 + v_2 = 0$ and $\\vec v = (1, -2)$.',
        'Check: $A(1, -2) = (4 - 2,\\; 2 - 6) = (2, -4) = 2(1, -2)$.'
      ],
      a: 'λ = 5 with (1, 1); λ = 2 with (1, −2).'
    },
    {
      title: 'Powers the easy way',
      q: 'With the same $A$, find $A^{10}\\vec x$ for $\\vec x = (3, 0)$.',
      steps: [
        'Write $\\vec x$ in eigenvectors: $(3, 0) = 2(1, 1) + 1(1, -2)$.',
        'Each eigenvector is simply multiplied by its eigenvalue each time: $A^{10}\\vec x = 2\\cdot 5^{10}(1, 1) + 2^{10}(1, -2)$.',
        '$5^{10} = 9\\,765\\,625$ and $2^{10} = 1024$, so $A^{10}\\vec x = (19\\,532\\,274,\\; 19\\,529\\,202)$.',
        'The $\\lambda = 5$ direction swamps the other: after many steps every starting vector points almost exactly along $(1, 1)$.'
      ],
      a: 'A¹⁰x = (19 532 274, 19 529 202), almost along (1, 1).'
    }
  ],
  quiz: [
    { q: 'An eigenvector of $A$ is a non-zero vector that $A$…', choices: ['rotates by 90°', 'always sends to zero', 'only stretches, shrinks or reverses', 'leaves exactly unchanged'], a: 2,
      why: '$A\\vec v = \\lambda\\vec v$: the direction is kept (or reversed if $\\lambda < 0$) and the length scaled by $|\\lambda|$. "Unchanged" is the special case $\\lambda = 1$.' },
    { q: 'A $2\\times 2$ matrix has trace 5 and determinant 6. Its eigenvalues are…', choices: ['2 and 3', '1 and 6', '−2 and −3', '5 and 6'], a: 0,
      why: 'They solve $\\lambda^2 - 5\\lambda + 6 = 0$: sum 5, product 6, so 2 and 3.' },
    { q: 'A rotation of the plane by 90° has no real eigenvalues.', a: true,
      why: 'Every non-zero vector is turned, so none keeps its direction. The characteristic equation $\\lambda^2 + 1 = 0$ has only the complex roots $\\pm i$.' },
    { q: 'For $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$, write $\\det(A - tI)$ as a polynomial in $t$.', answer: 't^2 - 6t + 8', vars: ['t'],
      why: '$(3 - t)^2 - 1 = t^2 - 6t + 8 = (t - 2)(t - 4)$: the eigenvalues are 2 and 4.' },
    { q: 'If 0 is an eigenvalue of $A$, then…', choices: ['A is the identity', 'A has no inverse', 'A is symmetric', 'A is a rotation'], a: 1,
      why: 'Some non-zero $\\vec v$ has $A\\vec v = \\vec 0$, so $A$ squashes a direction to nothing and cannot be undone; equivalently $\\det A = 0$.' }
  ],
  problems: [
    { q: 'What is the largest eigenvalue of $\\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$?', answer: 3, tol: 0.001,
      steps: ['Trace 2, determinant $1 - 4 = -3$: $\\lambda^2 - 2\\lambda - 3 = 0$.', '$(\\lambda - 3)(\\lambda + 1) = 0$, so $\\lambda = 3$ or $-1$. The largest is 3, with eigenvector $(1, 1)$.'] }
  ],
  applications: [
    'Vibration analysis of bridges, buildings, engines and molecules (normal modes).',
    'Quantum mechanics: energy levels and measurement outcomes.',
    'Principal component analysis in statistics and machine learning.',
    'Stability of control systems, ecosystems and economic models.',
    'Ranking web pages and other nodes of a network.'
  ],
  sim: 'vlc-matrix-transform'
},

{
  id: 'vector-spaces', parent: 'matrices-topic', title: 'Vector spaces, span and basis', level: 3,
  short: 'The general setting of linear algebra: anything that can be added and scaled — arrows, lists of numbers, polynomials, signals — with the ideas of span, independence, basis and dimension.',
  keywords: ['vector space', 'subspace', 'span', 'linear combination', 'linear independence', 'basis', 'dimension', 'coordinates', 'rank', 'null space', 'column space', 'rank–nullity', 'orthonormal basis'],
  prereq: ['vector-addition', 'linear-transformations', 'gaussian-elimination'],
  related: ['eigenvalues', 'vector-components', 'fourier-series', 'second-order-linear', 'physics:superposition', 'physics:wavefunction'],
  body: `
### What really matters about vectors
Arrows can be added and scaled, and those two operations obey a short list of rules: the order of a sum does not matter, there is a zero vector, every vector has a negative, scaling distributes over sums, and so on. Many other things obey exactly the same rules, and any such collection is called a **vector space**. Whatever is proved from the rules alone then holds for all of them at once.

- $\\mathbb{R}^n$, lists of $n$ numbers — arrows in the plane ($n = 2$) and in space ($n = 3$), but also a list of a thousand measurements.
- Polynomials of degree at most 2, $p(x) = a + bx + cx^2$: two of them add to another, and a multiple of one is another.
- All the solutions of a linear equation such as $y'' + y = 0$: every combination $A\\cos x + B\\sin x$ is again a solution. This is the **superposition principle** of physics ([[physics:superposition|superposition]]).
- Sound signals, images, and the quantum states of a particle ([[physics:wavefunction|wavefunctions]]).

### Span
A **linear combination** of vectors $\\vec v_1, \\dots, \\vec v_k$ is any sum $c_1\\vec v_1 + \\dots + c_k\\vec v_k$, and the set of all of them is their **span**. Two non-parallel arrows in space span a plane through the origin; add a third arrow out of that plane and the three span all of space.

### Independence
The vectors are **linearly independent** if none of them is a combination of the others — equivalently, if $c_1\\vec v_1 + \\dots + c_k\\vec v_k = \\vec 0$ forces every $c_i$ to be 0. Otherwise they are dependent, and at least one of them is redundant. For $n$ vectors in $\\mathbb{R}^n$ there is a quick test: they are independent exactly when the matrix with them as columns has a non-zero [[determinants|determinant]]. In general, [[gaussian-elimination|elimination]] decides.

### Basis and dimension
A **basis** is a set of vectors that is independent *and* spans the whole space. Then every vector can be written in exactly one way as a combination of the basis vectors, and the coefficients are its **coordinates**; the [[vector-components|components]] of an arrow are its coordinates in the basis $\\hat\\imath, \\hat\\jmath, \\hat k$. Every basis of a given space has the same number of vectors, and that number is the space's **dimension**. The plane has dimension 2; polynomials of degree at most 2 have dimension 3 (a basis is $1, x, x^2$); the solutions of $y'' + y = 0$ form a space of dimension 2 (a basis is $\\cos x$, $\\sin x$).

Choosing a good basis is half the art of linear algebra. With perpendicular unit vectors every coordinate is a single [[dot-product|dot product]], which is exactly what a [[fourier-series|Fourier series]] does with sines and cosines; with eigenvectors a matrix becomes diagonal ([[eigenvalues]]).

### Subspaces
A **subspace** is a vector space sitting inside a bigger one, such as a line or a plane through the origin (but not one that misses the origin, since a subspace must contain $\\vec 0$). Every matrix $A$ comes with two: its **column space**, the span of its columns — all the $\\vec b$ for which $A\\vec x = \\vec b$ can be solved — and its **null space**, the set of all solutions of $A\\vec x = \\vec 0$. Their dimensions are tied by the **rank–nullity theorem**: for a matrix with $n$ columns,

$$\\operatorname{rank} A + \\dim(\\text{null space of } A) = n$$

Each pivot found by elimination accounts for one dimension of the column space, and each free unknown for one dimension of the null space.
`,
  ideas: [
    'A vector space is any collection that can be added and scaled by the usual rules.',
    'The span of some vectors is the set of all their linear combinations.',
    'Vectors are independent if none is a combination of the others.',
    'A basis is independent and spanning; its size is the dimension.',
    'Rank + nullity = number of columns.'
  ],
  pitfalls: [
    'A vector space must consist of arrows — Polynomials, functions, signals and matrices form vector spaces too.',
    'Any line is a subspace — Only lines through the origin; a subspace must contain the zero vector.',
    'More vectors always span more — A vector that is a combination of the others adds nothing to the span.'
  ],
  formulas: [
    {
      name: 'Rank–nullity',
      expr: 'k = n - r', tex: 'k = n - r',
      vars: {
        k: { name: 'dimension of the null space (number of free unknowns)', int: true },
        n: { name: 'number of columns (unknowns)', value: 5, int: true },
        r: { name: 'rank (number of pivots)', value: 3, int: true }
      },
      note: 'The solutions of $A\\vec x = \\vec 0$ form a space of dimension $n - r$: one free parameter per unknown without a pivot.'
    }
  ],
  examples: [
    {
      title: 'Independent or not?',
      q: 'Are $(1, 2, 3)$, $(4, 5, 6)$ and $(7, 8, 9)$ linearly independent? What do they span?',
      steps: [
        'Look for a relation: $2(4, 5, 6) - (1, 2, 3) = (7, 8, 9)$.',
        'So the third is a combination of the first two: the three are dependent.',
        'The first two are not parallel, so all three span a plane through the origin, not all of space.',
        'Check: the $3\\times 3$ determinant with these rows is $1(45 - 48) - 2(36 - 42) + 3(32 - 35) = -3 + 12 - 9 = 0$.'
      ],
      a: 'Dependent; they span only a plane.'
    },
    {
      title: 'Coordinates in a new basis',
      q: 'Find the coordinates of $\\vec v = (5, 1)$ in the basis $\\vec b_1 = (1, 1)$, $\\vec b_2 = (1, -1)$.',
      steps: [
        'Solve $c_1(1, 1) + c_2(1, -1) = (5, 1)$: $c_1 + c_2 = 5$ and $c_1 - c_2 = 1$.',
        'So $c_1 = 3$ and $c_2 = 2$: $\\vec v = 3\\vec b_1 + 2\\vec b_2$.',
        'Because $\\vec b_1 \\perp \\vec b_2$, dot products give them directly: $c_1 = \\vec v\\cdot\\vec b_1/|\\vec b_1|^2 = 6/2 = 3$ and $c_2 = 4/2 = 2$.'
      ],
      a: 'Coordinates (3, 2).'
    },
    {
      title: 'Polynomials as vectors',
      q: 'In the basis $1, x, x^2$, write $p(x) = 3 + 2x - x^2$ as a coordinate vector, and show that differentiation acts as a matrix.',
      steps: [
        'Coordinates: $(3, 2, -1)$.',
        { text: 'Differentiation sends $1 \\to 0$, $x \\to 1$, $x^2 \\to 2x$; those images are the columns of', tex: 'D = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{pmatrix}' },
        '$D(3, 2, -1) = (2, -2, 0)$, that is $p\'(x) = 2 - 2x$ — as direct differentiation confirms.'
      ],
      a: 'p = (3, 2, −1); p′ = (2, −2, 0) = 2 − 2x.'
    }
  ],
  quiz: [
    { q: 'Which of these sets is a subspace of the plane?', choices: ['the line y = 2x', 'the line y = 2x + 1', 'the unit circle', 'the first quadrant'], a: 0,
      why: 'Only $y = 2x$ contains the origin and stays closed under adding and scaling. The others fail: for instance, doubling a point of the circle leaves the circle.' },
    { q: 'The polynomials of degree at most 3 form a vector space of dimension…', choices: ['3', '4', '5', 'infinite'], a: 1,
      why: 'A basis is $1, x, x^2, x^3$: four vectors.' },
    { q: 'Any four vectors in three-dimensional space are linearly dependent.', a: true,
      why: 'Space has dimension 3, so an independent set can hold at most 3 vectors.' },
    { q: 'In the basis $(1, 1)$, $(1, -1)$, write the first coordinate $c_1$ of $\\vec v = (x, 2)$.', answer: '(x + 2)/2', vars: ['x'],
      why: 'Solve $c_1 + c_2 = x$ and $c_1 - c_2 = 2$: adding gives $2c_1 = x + 2$.' },
    { q: 'The solutions of $y\'\' + y = 0$ form a vector space of dimension…', choices: ['1', '2', '3', 'infinite'], a: 1,
      why: 'Every solution is $A\\cos x + B\\sin x$: two independent functions form a basis. A second-order linear equation always has a two-dimensional solution space.' }
  ],
  problems: [
    { q: 'A $4\\times 6$ matrix has rank 3. What is the dimension of the solution space of $A\\vec x = \\vec 0$?', answer: 3, tol: 0.001,
      steps: ['Rank–nullity: $\\dim(\\text{null space}) = n - \\text{rank} = 6 - 3$.', 'So the solutions form a three-dimensional space: three free unknowns.'] }
  ],
  applications: [
    'Signal processing and Fourier analysis: signals as vectors in a space of functions.',
    'Quantum mechanics: states are vectors, and superposition is vector addition.',
    'Data compression: keeping only the most important basis directions of images or sounds.',
    'Error-correcting codes, built from subspaces of vectors of bits.'
  ],
  sim: 'vlc-matrix-transform'
}

);
