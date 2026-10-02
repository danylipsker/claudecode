/* HYPER-PROJECTIONS · content/projection-mathematics.js — the topic "The mathematics" (projection-mathematics).
 *
 * Nine concepts, the mathematical spine of the app: homogeneous coordinates, the 4 × 4 matrix, rotations, composing
 * transformations, the projection matrix, the camera model (model, view, projection, viewport), points at infinity,
 * the cross-ratio and projective geometry. Convention throughout: y up, the viewer looking along −z, points as columns
 * multiplied on the right (the same as kit.proj in HYPER-CORE/js/projection.js).
 * Simulations are in sims/projection-mathematics.js (pm-…), constructions in constructions/projection-mathematics.js.
 */
Hyper.add(

/* ====================================================================== homogeneous coordinates */
{
  id: 'homogeneous-coordinates',
  parent: 'projection-mathematics',
  title: 'Homogeneous coordinates',
  level: 2,
  short: 'One extra coordinate w turns translation and perspective into matrix multiplication: the point (x, y, z) is written (x, y, z, 1), any multiple of the quadruple names the same point, and dividing by the last number brings it back. Where w is zero the point has gone to infinity: it is a direction.',
  keywords: ['homogeneous', 'w coordinate', 'projective coordinates', 'perspective division', 'point at infinity', 'weighted point', 'barycentric', 'four-vector', 'dehomogenise'],
  prereq: ['parallel-vs-central', 'math:vectors', 'math:coordinate-systems-3d'],
  related: ['the-4x4-matrix', 'points-at-infinity', 'the-projection-matrix', 'projective-geometry', 'math:matrices'],
  body: `A translation is not a matrix. Rotations, stretches and shears of a point $(x, y, z)$ are products with a $3 \\times 3$ matrix, and a product with a matrix always sends the origin to the origin; to move the origin you must add something. And the division by distance that makes far things small is not even linear. A drawing office can live with three different kinds of operation; a computer would like one. **Homogeneous coordinates** give it one, by adding a fourth number.

### The rule
Write the point $(x, y, z)$ as the four numbers $(x, y, z, 1)$. Let every non-zero multiple of the quadruple mean the same point, and bring the point back by dividing by the last number:
$$(X, Y, Z, W) \\;\\leftrightarrow\\; \\left(\\frac{X}{W},\\ \\frac{Y}{W},\\ \\frac{Z}{W}\\right).$$
So $(2, 4, 6, 2)$, $(1, 2, 3, 1)$ and $(-3, -6, -9, -3)$ are one and the same point. A point is therefore not one quadruple but a whole **ray through the origin** of four-dimensional space, and the real space is the slice $w = 1$ where each ray is cut once. The simulation shows it for the plane: the point is the place where the ray crosses the line $w = 1$, and sliding along the ray changes the numbers but not the point.

### Why it pays
In the fourth column a translation finds a home:
$$\\begin{bmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} x + t_x \\\\ y + t_y \\\\ z + t_z \\\\ 1 \\end{bmatrix}.$$
Now a rotation, a translation and a stretch are all $4 \\times 4$ matrices, and doing several in turn is multiplying their matrices once ([[composing-transformations]]). The division by $w$ comes **last**, after all the linear work, and that is how the perspective of [[the-projection-matrix]] enters the same machinery.

### w is a weight, and w = 0 is a direction
Read $(x, y, z, w)$ as the point $(x/w, y/w, z/w)$ carrying the **weight** $w$. Adding two quadruples adds the weights and takes the weighted average of the places: $(P, 1) + (Q, 1) = (P + Q, 2)$ is the midpoint. Subtracting gives weight $0$: $(P, 1) - (Q, 1) = (P - Q, 0)$ is the vector from $Q$ to $P$. So $w = 1$ marks a **place** and $w = 0$ a **direction**, and a translation, whose last row is $(0\\ 0\\ 0\\ 1)$, leaves every direction unmoved: moving house does not turn the compass.

Let $w \\to 0$ and the point flies off along the direction $(x, y, z)$. At $w = 0$ it has arrived: the **point at infinity** of [[points-at-infinity]], what parallel lines share and what a vanishing point is the picture of.

### By hand
Dividing by $w$ is a job for a straightedge. Draw the axes $X$ and $W$ and the line $w = 1$, lay the straightedge from the origin through the pair $(X, W)$: where it cuts $w = 1$ is the number $X/W$. Every multiple of the pair lies on the same ray, which is why it is the same number.`,
  ideas: [
    'A point (x, y, z) is written (x, y, z, 1); any non-zero multiple of the quadruple is the same point, and dividing by the last number gives it back.',
    'The extra coordinate makes translation a matrix product, so rotation, stretch, translation and perspective are all 4 × 4 matrices that can be multiplied together once.',
    'w = 1 marks a place and w = 0 a direction; translations leave directions alone.',
    'Geometrically a point is a ray through the origin of four-dimensional space, and the real space is the slice w = 1; the division by w is the cut.'
  ],
  pitfalls: [
    'The fourth coordinate is a fourth dimension of space — No: it is bookkeeping. The points still live in three dimensions; w only says which multiple of the quadruple was written down.',
    'w must always be 1 — Only to read the coordinates straight off. After a perspective matrix w is the distance, and you divide by it to get the point back; forgetting the division gives a picture that does not shrink with distance.',
    'Two points can be added — Their homogeneous sum is a point of weight 2 (the midpoint, scaled), and point minus point is a vector with w = 0. The rule: weights summing to 1 make a place, weights summing to 0 a direction.'
  ],
  formulas: [
    {
      name: 'Dehomogenising a coordinate',
      expr: 'x = X/W',
      tex: 'x = \\frac{X}{W}',
      vars: {
        x: { name: 'coordinate of the point', signed: true },
        X: { name: 'homogeneous coordinate X', signed: true, value: 6 },
        W: { name: 'homogeneous weight W', signed: true, value: 2 }
      },
      stories: { x: 'A point is written in homogeneous coordinates with X = {X} and weight W = {W}. Which ordinary coordinate x does it have?' },
      note: 'Valid for W ≠ 0. As W gets smaller the coordinate grows without limit: at W = 0 there is no coordinate, only a direction.'
    },
    {
      name: 'Weighted combination of two points',
      expr: 'x = (w1*x1 + w2*x2)/(w1 + w2)',
      tex: 'x = \\frac{w_1 x_1 + w_2 x_2}{w_1 + w_2}',
      vars: {
        x: { name: 'position of the combined point', signed: true },
        x1: { name: 'position of the first point', signed: true, value: 2 },
        x2: { name: 'position of the second point', signed: true, value: 8 },
        w1: { name: 'weight of the first point', signed: true, value: 1 },
        w2: { name: 'weight of the second point', signed: true, value: 3 }
      },
      note: 'This is what adding two homogeneous quadruples does. Equal weights give the midpoint; the result lies nearer the heavier point. With w1 + w2 = 0 the sum is a direction, the difference of the two points.'
    }
  ],
  examples: [
    {
      title: 'Reading a quadruple',
      q: 'The quadruple $(6, 9, -3, 3)$ is given. Which point of space is it? Is it the same as $(2, 3, -1, 1)$ and as $(-4, -6, 2, -2)$? What would $(6, 9, -3, 0)$ be?',
      steps: [
        'Divide by the last number: $(6, 9, -3)/3 = (2, 3, -1)$.',
        '$(2, 3, -1, 1)$ is already divided. $(-4, -6, 2, -2)$ divided by $-2$ is $(2, 3, -1)$ again. All three quadruples are the same point.',
        'With $w = 0$ the division is impossible: $(6, 9, -3, 0)$ is not a place but a direction, parallel to $(2, 3, -1)$, the point at infinity of the line through the origin and $(2, 3, -1)$.'
      ],
      a: 'The point (2, 3, −1), the same for all three quadruples; with w = 0 only a direction is left.'
    },
    {
      title: 'A translation as a matrix, and why a direction does not move',
      q: 'Move the point $P = (1, 2, 3)$ by $\\mathbf{t} = (3, -1, 2)$ with a $4 \\times 4$ matrix. Then apply the same matrix to the direction of the $x$ axis, written $(1, 0, 0, 0)$.',
      steps: [
        { text: 'The translation matrix acts on $(1, 2, 3, 1)$:', tex: '\\begin{bmatrix} 1 & 0 & 0 & 3 \\\\ 0 & 1 & 0 & -1 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 4 \\\\ 1 \\\\ 5 \\\\ 1 \\end{bmatrix}' },
        'The last column is multiplied by $w$. For the direction $w = 0$, so nothing is added: $(1, 0, 0, 0)$ comes out as $(1, 0, 0, 0)$.'
      ],
      a: 'P moves to (4, 1, 5); the direction of the x axis is unchanged.'
    }
  ],
  quiz: [
    { q: 'Which of these quadruples is a different point from the other three?', choices: ['$(1, 2, 3, 1)$', '$(2, 4, 6, 2)$', '$(3, 6, 9, 3)$', '$(2, 4, 6, 1)$'], a: 3, why: 'The first three all divide to (1, 2, 3). The last divides by 1 and stays (2, 4, 6).' },
    { q: 'The quadruple $(4, 2, 0, 0)$ is a perfectly ordinary point, at $(4, 2, 0)$.', a: false, why: 'Its w is 0, so it is not a place at all: it is the direction (4, 2, 0), the point at infinity along that line.' },
    { q: 'The homogeneous coordinates $(7.5, -3, 12, 1.5)$ stand for a point whose $z$ coordinate is', answer: 8, why: 'Divide by w: 12 / 1.5 = 8. (The point is (5, −2, 8).)' },
    { q: 'Why can a translation be written as a matrix only after the fourth coordinate has been added?', choices: ['A 3 × 3 matrix always sends the origin to the origin; the extra column of a 4 × 4 matrix multiplies the 1 and adds a constant', 'Translations are not linear in any coordinates', 'Matrices cannot add numbers', 'Because translations change lengths'], a: 0, why: 'A product with a 3 × 3 matrix has no constant term. With the fourth coordinate fixed at 1 the last column supplies it.' },
    { q: 'A point of weight 1 at $x = 2$ and a point of weight 3 at $x = 8$ are added as quadruples. The sum stands for the point $x =$', answer: 6.5, why: '(1·2 + 3·8)/(1 + 3) = 26/4 = 6.5: the weighted average, nearer the heavier point.' }
  ],
  applications: [
    'Every graphics card: vertices travel as four-component vectors, so a whole chain of transformations is one matrix and the perspective division is a fixed step of the hardware.',
    'Computer vision: image points are written (u, v, 1) and a homography is a 3 × 3 matrix acting on them, with no special case for lines that meet at the horizon.',
    'Robotics and CAD: the pose of a tool or a part is a 4 × 4 matrix, and chaining the joints of an arm is multiplying them.',
    'Curve and surface modelling: NURBS and rational Béziers, which draw circles exactly, are ordinary curves in four dimensions divided by w.',
    'Any program that must treat a position and a direction differently: normals and velocities carry w = 0, so a translation does not move them.'
  ],
  history: 'Barycentric coordinates came first: August Ferdinand Möbius, in *Der barycentrische Calcul* (1827), described a point as a weighted combination of fixed points. Feuerbach and Plücker used homogeneous triples for points and lines of the plane around 1830, and the idea behind them, that parallels meet "at infinity", is older still (Desargues, Kepler). Lawrence Roberts brought them into computer graphics in his work on hidden lines at MIT in the early 1960s; his 1965 report sets out the matrices used ever since.',
  sources: [
    'A. F. Möbius, *Der barycentrische Calcul* (1827).',
    'L. G. Roberts, *Homogeneous Matrix Representation and Manipulation of N-Dimensional Constructs*, MIT Lincoln Laboratory, 1965.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (2nd ed., 1990), the chapter on geometrical transformations.',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2.'
  ],
  sim: 'pm-homogeneous-w',
  construction: 'pm-divide-by-w'
},

/* ====================================================================== the 4 × 4 matrix */
{
  id: 'the-4x4-matrix',
  parent: 'projection-mathematics',
  title: 'The 4 × 4 matrix of a transformation',
  level: 2,
  short: 'A 4 × 4 matrix is sixteen numbers with four jobs: the upper left block turns, stretches and shears, the last column moves, the bottom row carries perspective, and the corner is an overall scale. Its columns are the images of the axes and of the origin, which is how to draw it by hand.',
  keywords: ['4x4 matrix', 'transformation matrix', 'affine', 'translation', 'scale', 'shear', 'rigid motion', 'degrees of freedom', 'inverse', 'columns', 'determinant'],
  prereq: ['homogeneous-coordinates', 'math:matrix-multiplication', 'math:linear-transformations'],
  related: ['rotation-matrices', 'composing-transformations', 'the-projection-matrix', 'what-projections-preserve', 'math:determinants', 'math:matrix-inverse'],
  body: `Once points are quadruples, every transformation of space that keeps straight lines straight is a $4 \\times 4$ matrix acting on a column:
$$\\begin{bmatrix} x' \\\\ y' \\\\ z' \\\\ w' \\end{bmatrix} = \\begin{bmatrix} a_{11} & a_{12} & a_{13} & t_x \\\\ a_{21} & a_{22} & a_{23} & t_y \\\\ a_{31} & a_{32} & a_{33} & t_z \\\\ p_x & p_y & p_z & s \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix}.$$
The convention in this whole app: points are columns, the matrix stands on the left, $y$ is up and the viewer looks along $-z$. (Many books and some programming interfaces use rows and put the matrix on the right; their matrices are the transposes of these, and a translation sits in the bottom row.)

### Four blocks, four jobs
- The upper left $3 \\times 3$ block $A$ is the **linear part**: rotation, stretch, reflection, shear, everything that fixes the origin.
- The last column $\\mathbf{t}$ is the **translation**: it is added to the result.
- The bottom row $\\mathbf{p}^T$ is the **perspective row**: it makes $w' = p_x x + p_y y + p_z z + s$ different from 1, and the division by $w'$ that follows is what makes far things small. For every parallel projection it is $(0\\ 0\\ 0\\ 1)$.
- The corner $s$ scales everything by $1/s$, through the same division.

### Read the columns
Feed in the direction $(1, 0, 0, 0)$ and the answer is the first column; feed in the origin $(0, 0, 0, 1)$ and the answer is the last column. **The columns of a matrix are the images of the three axis directions and of the origin.** That is the way to draw a transformation: mark where $O$, $E_1$, $E_2$ (and $E_3$) go, and every other point is reached by stepping off multiples of those images, as the construction below does for the plane. It is also the way to *write* a matrix: find where the unit vectors go and stand them in the columns.

### A ladder of matrices
What a matrix keeps depends on which blocks it uses:

| kind | the matrix | keeps | free numbers |
|---|---|---|---|
| rigid motion | rotation $R$ and translation $\\mathbf{t}$ | lengths, angles | 6 |
| similarity | $sR$ and $\\mathbf{t}$ | angles, ratios of lengths | 7 |
| affine | any $A$ and $\\mathbf{t}$, bottom row $(0\\ 0\\ 0\\ 1)$ | parallelism, ratios along a line | 12 |
| projective | all sixteen, up to a common factor | straight lines, cross-ratios | 15 |

The last row is the subject of this whole app.

### Volume and inverse
$\\det A$ is the factor by which volumes grow (a negative value is a mirror image). The inverse of a rigid motion needs no division: undo the shift after undoing the turn,
$$\\begin{bmatrix} R & \\mathbf{t} \\\\ \\mathbf{0}^T & 1 \\end{bmatrix}^{-1} = \\begin{bmatrix} R^T & -R^T\\mathbf{t} \\\\ \\mathbf{0}^T & 1 \\end{bmatrix}.$$`,
  ideas: [
    'Acting on a column (x, y, z, 1), a 4 × 4 matrix does a linear transformation with its upper left block, a translation with its last column and a perspective division with its bottom row.',
    'The columns are the images of the three axis directions and of the origin: to draw or to write a transformation, find where those four go.',
    'Rigid, similarity, affine and projective matrices form a ladder with 6, 7, 12 and 15 free numbers, each keeping less of the shape.',
    'det A is the volume factor; the inverse of a rigid motion is [Rᵀ | −Rᵀt].'
  ],
  pitfalls: [
    'A matrix and its transpose are the same thing — They are not. This app puts points in columns with the matrix on the left; many books and some APIs store the transpose, and then the translation sits in the bottom row.',
    'The last column holds the image of the x axis — The first column does. The last column is the image of the origin, that is, the translation.',
    'Every 4 × 4 matrix keeps angles — Only rotations and uniform scalings do. A general linear part changes lengths and angles, and an affine matrix keeps only parallelism.'
  ],
  formulas: [
    {
      name: 'Area factor of a 2 × 2 block',
      expr: 'k = a*d - b*c',
      tex: 'k = a\\,d - b\\,c',
      vars: {
        k: { name: 'factor by which areas are multiplied (negative: mirrored)', signed: true },
        a: { name: 'first column, top', signed: true, value: 1.2 },
        b: { name: 'second column, top', signed: true, value: -0.5 },
        c: { name: 'first column, bottom', signed: true, value: 0.4 },
        d: { name: 'second column, bottom', signed: true, value: 1 }
      },
      note: 'The determinant of the block in the construction below: 1.2 × 1.0 − (−0.5) × 0.4 = 1.4. In space the same role is played by the 3 × 3 determinant, the volume factor.'
    },
    {
      name: 'Volume after a stretch',
      expr: 'V2 = sx*sy*sz*V1',
      tex: 'V_2 = s_x s_y s_z V_1',
      vars: {
        V2: { name: 'volume after' },
        V1: { name: 'volume before', value: 10 },
        sx: { name: 'stretch along x', tex: 's_x', value: 2 },
        sy: { name: 'stretch along y', tex: 's_y', value: 3 },
        sz: { name: 'stretch along z', tex: 's_z', value: 0.5 }
      },
      note: 'For a diagonal block the determinant is the product of the three stretches.'
    },
    {
      name: 'The w made by the bottom row',
      expr: 'w = pz*z + s',
      tex: 'w = p_z\\,z + s',
      vars: {
        w: { name: 'homogeneous weight after the matrix', signed: true },
        pz: { name: 'perspective term in the bottom row', tex: 'p_z', signed: true, value: -0.4 },
        z: { name: 'depth of the point', signed: true, value: 0.5 },
        s: { name: 'corner of the matrix', signed: true, value: 1 }
      },
      note: 'With p_z = −0.4 a point at z = 0.5 gets w = 0.8: the final division by w enlarges it by 1/0.8. A point where w reaches 0 has gone to infinity.'
    }
  ],
  examples: [
    {
      title: 'Writing a matrix from the images of the axes',
      q: 'A transformation turns the plane of $x, y$ a quarter turn about $z$ (counter-clockwise) and then moves everything by $(1, 2, 3)$. Write its $4 \\times 4$ matrix, apply it to $(1, 0, 0)$, and write the inverse.',
      steps: [
        'The first column is where the direction $(1, 0, 0)$ goes: $(0, 1, 0)$. The second is where $(0, 1, 0)$ goes: $(-1, 0, 0)$. The third stays $(0, 0, 1)$. The last is the image of the origin, the move $(1, 2, 3)$.',
        { text: 'So', tex: 'M = \\begin{bmatrix} 0 & -1 & 0 & 1 \\\\ 1 & 0 & 0 & 2 \\\\ 0 & 0 & 1 & 3 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}, \\qquad M\\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 3 \\\\ 3 \\\\ 1 \\end{bmatrix}.' },
        { text: 'The inverse of a rigid motion is $[R^T \\mid -R^T\\mathbf{t}]$. Here $R^T$ has rows $(0, 1, 0)$, $(-1, 0, 0)$, $(0, 0, 1)$ and $-R^T\\mathbf{t} = (-2, 1, -3)$:', tex: 'M^{-1} = \\begin{bmatrix} 0 & 1 & 0 & -2 \\\\ -1 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & -3 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}.' },
        'Check: $M^{-1}(1, 3, 3, 1) = (3 - 2,\\ -1 + 1,\\ 3 - 3, 1) = (1, 0, 0, 1)$.'
      ],
      a: 'M as above; (1, 0, 0) goes to (1, 3, 3); M⁻¹ has the transposed block and last column (−2, 1, −3).'
    },
    {
      title: 'The area factor of the construction',
      q: 'The matrix of the construction "A matrix drawn from its columns" has the upper left block $\\begin{bmatrix} 1.2 & -0.5 \\\\ 0.4 & 1.0 \\end{bmatrix}$ and the translation $(1.0, 0.5)$. By what factor does it multiply areas? Is the picture mirrored? Where does the corner $(1, 1)$ of the unit square go?',
      steps: [
        'Determinant: $1.2 \\times 1.0 - (-0.5) \\times 0.4 = 1.2 + 0.2 = 1.4$. Positive, so the picture is not mirrored; areas grow by 1.4.',
        'The corner $(1, 1) = E_1 + E_2$ goes to the translation plus both columns: $(1.0 + 1.2 - 0.5,\\ 0.5 + 0.4 + 1.0) = (1.7, 1.9)$.'
      ],
      a: 'Areas ×1.4, not mirrored; (1, 1) goes to (1.7, 1.9).'
    }
  ],
  quiz: [
    { q: 'With points as columns, where does a $4 \\times 4$ matrix keep the translation?', choices: ['In the last column', 'In the bottom row', 'In the upper left 3 × 3 block', 'On the diagonal'], a: 0, why: 'The last column is multiplied by the 1 of the point and added to the result. (A book using rows and the matrix on the right has the transpose, and the translation is then in the bottom row.)' },
    { q: 'The matrix $\\mathrm{diag}(1, 1, 1, 2)$ acts on the point $(2, 4, 6)$ and the result is divided by $w$. What happens to the point?', choices: ['It is moved by 2', 'It is doubled', 'It is halved', 'It is unchanged'], a: 2, why: '(2, 4, 6, 1) becomes (2, 4, 6, 2), which is the point (1, 2, 3): the corner s scales everything by 1/s.' },
    { q: 'The upper left block of an affine matrix is $\\mathrm{diag}(2, 3, 0.5)$. By what factor does it multiply volumes?', answer: 3, why: 'The determinant of a diagonal matrix is the product of its entries: 2 × 3 × 0.5 = 3.' },
    { q: 'The inverse of the rigid motion $[R \\mid \\mathbf{t}]$ is $[R^T \\mid -\\mathbf{t}]$.', a: false, why: 'The shift must be undone after the turn is undone: the last column of the inverse is −Rᵀt, not −t. Only for R = I do the two agree.' },
    { q: 'Which kind of matrix keeps parallel lines parallel but does not keep angles?', choices: ['Rigid motion', 'Similarity', 'Affine map', 'Projective map'], a: 2, why: 'An affine map (any upper left block, bottom row 0 0 0 1) keeps parallelism and ratios along a line. A projective map gives up parallelism too; rigid motions and similarities keep angles.' }
  ],
  applications: [
    'Scene graphs: a game character\'s hand is placed by multiplying the matrices of body, shoulder, elbow and wrist.',
    'Robot arms and CNC machines: each joint contributes a 4 × 4 matrix and the product gives the position of the tool.',
    'CAD assemblies: a part is placed by one matrix stored with it, so moving a sub-assembly changes one matrix, not thousands of points.',
    'Sprite and tile engines: a shear and a stretch turn a flat tile into the oblique or isometric one.',
    'Texture mapping and image processing: the affine 2 × 3 or 3 × 3 matrix that rotates, scales and slants an image is the plane version of this one.'
  ],
  history: 'Arthur Cayley defined the product of matrices in 1858, and linear changes of coordinates had been written as tables of coefficients long before. The 4 × 4 form with a translation column and a perspective row came into computer graphics in the 1960s with Lawrence Roberts, and it has not changed since: the matrices passed to today\'s graphics interfaces are the same sixteen numbers in the same places.',
  sources: [
    'A. Cayley, "A memoir on the theory of matrices", Philosophical Transactions of the Royal Society, 1858.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (2nd ed., 1990), the chapter on geometrical transformations.',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2, the hierarchy of transformations.'
  ],
  sim: 'pm-matrix-anatomy',
  construction: 'pm-matrix-columns'
},

/* ====================================================================== rotation matrices */
{
  id: 'rotation-matrices',
  parent: 'projection-mathematics',
  title: 'Rotation matrices',
  level: 2,
  short: 'Turning about x, y, z or any axis is a matrix whose columns are the new positions of the axes: cosines and sines in a 2 × 2 corner and a 1 for the axis that stays. Its inverse is its transpose, its determinant is +1, and the axis and the angle can be read back from its entries.',
  keywords: ['rotation matrix', 'rotation about an axis', 'Rodrigues', 'Euler angles', 'gimbal lock', 'orthogonal matrix', 'right-hand rule', 'axis-angle', 'quaternion', 'yaw pitch roll'],
  prereq: ['the-4x4-matrix', 'math:trigonometry', 'math:matrix-multiplication'],
  related: ['composing-transformations', 'isometric-projection', 'axonometric-projection', 'sky-coordinate-transformations', 'math:linear-transformations', 'math:complex-plane'],
  body: `Turn the plane about the origin by $\\theta$, counter-clockwise. The unit vector along $x$ goes to $(\\cos\\theta, \\sin\\theta)$ and the one along $y$ to $(-\\sin\\theta, \\cos\\theta)$. Those two vectors are the **columns**, so
$$R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}, \\qquad \\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = R(\\theta)\\begin{bmatrix} x \\\\ y \\end{bmatrix}.$$
The cosines and sines are lengths you can measure on a unit circle ([[math:trig-functions|trigonometry]]): the construction below reads them off with a set square and then turns a point with a protractor.

### About the three axes
In space a turn has an axis, and the coordinate along the axis is untouched. With the right-hand rule (thumb along the axis, fingers curling the way the positive angle goes), and $c = \\cos\\theta$, $s = \\sin\\theta$:
$$R_x = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & c & -s \\\\ 0 & s & c \\end{bmatrix}, \\quad R_y = \\begin{bmatrix} c & 0 & s \\\\ 0 & 1 & 0 \\\\ -s & 0 & c \\end{bmatrix}, \\quad R_z = \\begin{bmatrix} c & -s & 0 \\\\ s & c & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}.$$
The sine changes sign in $R_y$ because the turn carries $z$ towards $x$, against the cyclic order $x \\to y \\to z \\to x$ that the other two follow. Inside the $4 \\times 4$ matrix of [[the-4x4-matrix]] each sits in the upper left corner.

### What every rotation matrix is
Its columns are unit vectors at right angles to each other, so $R^TR = I$: **the inverse is the transpose**, no division needed. The determinant is $+1$ (a $-1$ would mean a mirror image). The trace is $1 + 2\\cos\\theta$, which is how the angle is read back from any rotation matrix, whatever its axis.

### About any axis (Rodrigues)
For a unit axis $\\mathbf{u}$,
$$R = \\cos\\theta\\, I + (1 - \\cos\\theta)\\,\\mathbf{u}\\mathbf{u}^T + \\sin\\theta\\,[\\mathbf{u}]_\\times, \\qquad [\\mathbf{u}]_\\times = \\begin{bmatrix} 0 & -u_z & u_y \\\\ u_z & 0 & -u_x \\\\ -u_y & u_x & 0 \\end{bmatrix}.$$
A vector splits into a part along the axis, which stays, and a part across it, which is turned in the plane perpendicular to the axis: partly kept ($\\cos\\theta$) and partly swung sideways ($\\sin\\theta$, along $\\mathbf{u} \\times \\mathbf{v}$). The antisymmetric part $R - R^T = 2\\sin\\theta\\,[\\mathbf{u}]_\\times$ gives the axis back.

### Euler angles, and their trouble
Three turns about the axes in turn (yaw, pitch and roll) multiply three such matrices, and the order matters ([[composing-transformations]]). When the middle turn is $90°$ two of the axes line up and a degree of freedom is lost: the **gimbal lock**. Unit quaternions (Hamilton, 1843) describe the same rotation with four numbers, avoid the lock and interpolate smoothly; they are converted to and from the matrix above.`,
  ideas: [
    'The columns of a rotation matrix are the new positions of the axes: (cos θ, sin θ) and (−sin θ, cos θ) in the plane; the axis of the turn has a 1 on the diagonal.',
    'Every rotation matrix has orthonormal columns, so its inverse is its transpose, its determinant is +1 and its trace is 1 + 2 cos θ.',
    'Rodrigues\' formula builds the matrix for any unit axis u; the antisymmetric part of R gives the axis back.',
    'Euler angles multiply three matrices and can lock; quaternions are the four-number alternative.'
  ],
  pitfalls: [
    'A positive angle always turns clockwise — By the right-hand rule a positive angle is counter-clockwise when you look from the tip of the axis back at the origin. Clockwise turns come from a negative angle (or from the transposed matrix).',
    'Rotation matrices commute — Only turns about the same axis do. R_x(30°) R_y(40°) is not R_y(40°) R_x(30°); the order of the factors is the order of the operations, read right to left.',
    'Any matrix with a determinant of 1 is a rotation — Its columns must also be orthonormal. A stretch of 2 along x and 1/2 along y has determinant 1 and is not a rotation.'
  ],
  formulas: [
    {
      name: 'Turning a point in the plane: new x',
      expr: 'xn = x*cos(theta) - y*sin(theta)',
      tex: 'x_{\\mathrm{new}} = x\\cos\\theta - y\\sin\\theta',
      vars: {
        xn: { name: 'new x', tex: 'x_{\\mathrm{new}}', signed: true },
        x: { name: 'old x', signed: true, value: 3 },
        y: { name: 'old y', signed: true, value: 2 },
        theta: { name: 'angle of the turn (counter-clockwise)', q: 'angle', unit: '°', value: 30, min: -360, max: 360, signed: true }
      },
      note: 'First row of R(θ). With (3, 2) turned by 30° the new x is 1.598.'
    },
    {
      name: 'Turning a point in the plane: new y',
      expr: 'yn = x*sin(theta) + y*cos(theta)',
      tex: 'y_{\\mathrm{new}} = x\\sin\\theta + y\\cos\\theta',
      vars: {
        yn: { name: 'new y', tex: 'y_{\\mathrm{new}}', signed: true },
        x: { name: 'old x', signed: true, value: 3 },
        y: { name: 'old y', signed: true, value: 2 },
        theta: { name: 'angle of the turn (counter-clockwise)', q: 'angle', unit: '°', value: 30, min: -360, max: 360, signed: true }
      },
      note: 'Second row of R(θ). With (3, 2) turned by 30° the new y is 3.232; the distance from the origin, 3.606, has not changed.'
    },
    {
      name: 'Trace of a rotation matrix',
      expr: 'tr = 1 + 2*cos(theta)',
      tex: 'T_{R} = 1 + 2\\cos\\theta',
      vars: {
        tr: { name: 'trace of the 3 × 3 rotation matrix (sum of the diagonal)', tex: 'T_{R}', signed: true },
        theta: { name: 'angle of the turn', q: 'angle', unit: '°', value: 60, min: 0, max: 180 }
      },
      note: 'True for a turn about any axis. Solve for θ to find the angle of a given rotation matrix (0° to 180°; the sign comes from the antisymmetric part).'
    },
    {
      name: 'The chord of a turn',
      expr: 'ch = 2*r*sin(theta/2)',
      tex: 'c = 2\\,r\\,\\sin\\frac{\\theta}{2}',
      vars: {
        ch: { name: 'distance the point moves (the chord)', tex: 'c', q: 'length', unit: 'mm' },
        r: { name: 'distance of the point from the centre', q: 'length', unit: 'mm', value: 100 },
        theta: { name: 'angle of the turn', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      note: 'The setting of the dividers that carries a point through the angle θ on a circle of radius r: 51.8 mm for r = 100 mm and θ = 30°.'
    }
  ],
  examples: [
    {
      title: 'Turning a point by 30°',
      q: 'Turn $P = (3, 2)$ counter-clockwise by $30°$ about the origin. Check that it stays at the same distance from the origin.',
      steps: [
        'With $\\cos 30° = 0.8660$ and $\\sin 30° = 0.5$: $x\' = 3 \\times 0.8660 - 2 \\times 0.5 = 2.598 - 1 = 1.598$.',
        '$y\' = 3 \\times 0.5 + 2 \\times 0.8660 = 1.5 + 1.732 = 3.232$.',
        'Distances: $\\sqrt{3^2 + 2^2} = 3.606$ and $\\sqrt{1.598^2 + 3.232^2} = \\sqrt{2.554 + 10.446} = 3.606$.'
      ],
      a: 'P′ = (1.598, 3.232); the distance 3.606 from the origin is unchanged.'
    },
    {
      title: 'Reading a rotation matrix',
      q: 'The matrix $R = \\begin{bmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{bmatrix}$ sends $x \\to y \\to z \\to x$. Find the angle and the axis of the turn.',
      steps: [
        'The trace is $0$, so $1 + 2\\cos\\theta = 0$ and $\\cos\\theta = -\\tfrac{1}{2}$: $\\theta = 120°$.',
        'The axis comes from the antisymmetric part: $(R_{32} - R_{23},\\ R_{13} - R_{31},\\ R_{21} - R_{12}) = (1 - 0,\\ 1 - 0,\\ 1 - 0) = (1, 1, 1)$, divided by $2\\sin 120° = 1.732$.',
        'The axis is $(1, 1, 1)/\\sqrt 3 = (0.577, 0.577, 0.577)$, the body diagonal of the cube: turning the cube by a third of a turn about its diagonal carries each edge into the next.'
      ],
      a: '120° about the axis (1, 1, 1)/√3.'
    }
  ],
  quiz: [
    { q: 'What is the first column of $R_z(\\theta)$?', choices: ['$(\\cos\\theta, \\sin\\theta, 0)$', '$(\\cos\\theta, -\\sin\\theta, 0)$', '$(-\\sin\\theta, \\cos\\theta, 0)$', '$(0, 0, 1)$'], a: 0, why: 'The first column is the image of the unit vector along x: it is turned to (cos θ, sin θ, 0). The second column is the image of y.' },
    { q: 'A rotation matrix has trace 2. By how many degrees does it turn?', answer: 60, unit: '°', why: '1 + 2 cos θ = 2 gives cos θ = 1/2, so θ = 60°.' },
    { q: 'Turning about $x$ by $30°$ and then about $y$ by $40°$ ends in the same orientation as turning about $y$ by $40°$ and then about $x$ by $30°$.', a: false, why: 'Rotations about different axes do not commute. Only turns about the same axis can be swapped.' },
    { q: 'The inverse of a rotation matrix is', choices: ['its transpose', 'its negative', 'the matrix with twice the angle', 'its determinant times itself'], a: 0, why: 'The columns are orthonormal, so RᵀR = I; the inverse is Rᵀ, which is just the turn by −θ about the same axis.' },
    { q: 'A matrix has orthonormal columns and determinant $-1$. Is it a rotation?', a: false, why: 'A determinant of −1 means a mirror image comes with the turn (a reflection or a rotoreflection). A rotation needs determinant +1.' }
  ],
  applications: [
    'Axonometric pictures: the isometric view is a turn of 45° about the vertical followed by a tilt of 35.26° about a horizontal axis.',
    'Astronomy: converting horizon, equatorial and ecliptic coordinates of a star is a turn of the sky about one or two axes.',
    'Aircraft and spacecraft attitude: yaw, pitch and roll, or a quaternion, converted to the matrix that the instruments and the display need.',
    'Robot arms and animated skeletons: every joint contributes a rotation, and the product positions the hand.',
    'Crystallography and chemistry: the rotational symmetries of a crystal or a molecule are rotation matrices.'
  ],
  history: 'Euler showed in 1775 that any displacement of a rigid body with one point fixed is a turn about a single axis. Olinde Rodrigues published the formula for it in 1840, three years before William Rowan Hamilton found the quaternions, and the matrix notation that now carries it came with Cayley\'s calculus of matrices in 1858. Rotation matrices have kept their place because they compose by plain multiplication.',
  sources: [
    'O. Rodrigues, "Des lois géométriques qui régissent les déplacements d\'un système solide dans l\'espace", Journal de mathématiques pures et appliquées, 1840.',
    'L. Euler, "Formulae generales pro translatione quacunque corporum rigidorum", Novi Commentarii Academiae Petropolitanae, 1775.',
    'H. Goldstein, C. Poole and J. Safko, *Classical Mechanics* (3rd ed., 2002), chapter 4.'
  ],
  sim: 'pm-rotation-axis',
  construction: 'pm-rotate-point'
},

/* ====================================================================== composing transformations */
{
  id: 'composing-transformations',
  parent: 'projection-mathematics',
  title: 'Composing transformations',
  level: 2,
  short: 'Doing one transformation after another is multiplying their matrices, and since matrix multiplication is not commutative the order changes the picture: turn then shift is not shift then turn. Acting on columns, the matrix on the right acts first.',
  keywords: ['composition', 'order of transformations', 'matrix product', 'non-commutative', 'pivot', 'rotation about a point', 'local frame', 'scene graph', 'model matrix', 'T R S'],
  prereq: ['the-4x4-matrix', 'rotation-matrices', 'math:matrix-multiplication'],
  related: ['the-camera-model', '3d-graphics-pipeline', 'game-cameras', 'homogeneous-coordinates', 'math:linear-transformations'],
  body: `To place a drawing you often need a turn and a shift and a stretch. Each is a $4 \\times 4$ matrix, and doing them one after the other multiplies the matrices into a single one. The only thing to get right is the order.

### Read right to left
With points as columns, $M = M_3 M_2 M_1$ applied to a point $p$ is $M_3(M_2(M_1 p))$: **the matrix nearest the point acts first.** Take the point $(2, 0)$, a shift $T$ by $(3, 0)$ and a quarter turn $R$ about the origin:
$$R\\,T\\,p:\\ (2, 0) \\to (5, 0) \\to (0, 5), \\qquad T\\,R\\,p:\\ (2, 0) \\to (0, 2) \\to (3, 2).$$
Two answers $4.24$ apart. The matrices do not **commute**: $RT \\neq TR$, and the gap between the results is the vector $(I - R)\\mathbf{t}$, of length $2|\\mathbf{t}|\\sin(\\theta/2)$. The two drawings below carry out both orders on the same triangle with ruler, set square and compass.

### Turning about a point that is not the origin
A rotation matrix turns about the origin. To turn about a pivot $C$, carry $C$ to the origin, turn, carry it back:
$$R_C = T(C)\\,R(\\theta)\\,T(-C).$$
The sandwich reads right to left: take the pivot to the origin, rotate, bring it home. Stretching about a point is the same sandwich with $S$ in the middle, and turning about any line is a sandwich of the same kind.

### Two ways to read one product
Read right to left, every factor works on the **fixed world axes**: first the shift, then the turn about the world origin. Read left to right the same product tells the story the object itself would tell, in its **own moving axes**. $T\\,R\\,S$ is "stretch along the world $x$, turn about the world origin, then place"; read from the left it is "place the object's frame, turn that frame, then stretch along the frame's $x$". The arithmetic is the same and the picture is the same, so use whichever reading makes the problem short. Programs that build a character joint by joint use the second: each joint's matrix is multiplied on the right of its parent's.

### What is worth remembering
Matrix multiplication is **associative**, so a long chain can be multiplied in any grouping: compose it once and apply the single product to a million vertices. The inverse of a product is the product of the inverses in the *reverse* order, $(M_3M_2M_1)^{-1} = M_1^{-1}M_2^{-1}M_3^{-1}$, like taking off shoes and socks. Some pairs do commute: two translations, two rotations about the same axis, a uniform stretch about the origin and a rotation.`,
  ideas: [
    'With points as columns the product M₃M₂M₁ acts with M₁ first: read a product right to left to follow a point.',
    'Matrix multiplication does not commute: turning then shifting is not shifting then turning, and the two ends are 2|t| sin(θ/2) apart.',
    'Turning about a pivot C is T(C) R T(−C): carry the pivot to the origin, turn, carry it back.',
    'Read left to right, the same product is a story in the object\'s own moving axes; both readings give the same picture.',
    'Products are associative (compose a chain once, apply it to every point) and invert in the reverse order.'
  ],
  pitfalls: [
    'The first matrix in the product acts first — With points as columns the rightmost matrix acts first. With row vectors (some books and APIs) the order is reversed, so check which convention the library uses.',
    'Rotating an object about its own centre is the same as rotating about the origin — Only if the object is centred at the origin. Otherwise sandwich the turn between the shift to the origin and the shift back, or the object swings round the origin like a stone on a string.',
    'Scaling after a translation scales the object where it stands — It scales the translation too: S·T moves the object by s·t. To stretch an object where it stands, stretch first and then move (T·S).'
  ],
  formulas: [
    {
      name: 'Turning about a pivot: new x',
      expr: 'xn = cx + (x - cx)*cos(theta) - (y - cy)*sin(theta)',
      tex: 'x_{\\mathrm{new}} = c_x + (x - c_x)\\cos\\theta - (y - c_y)\\sin\\theta',
      vars: {
        xn: { name: 'new x', tex: 'x_{\\mathrm{new}}', signed: true },
        x: { name: 'old x', signed: true, value: 3 },
        y: { name: 'old y', signed: true, value: 1 },
        cx: { name: 'x of the pivot', tex: 'c_x', signed: true, value: 1 },
        cy: { name: 'y of the pivot', tex: 'c_y', signed: true, value: 1 },
        theta: { name: 'angle of the turn (counter-clockwise)', q: 'angle', unit: '°', value: 60, min: -360, max: 360, signed: true }
      },
      note: 'T(C) R T(−C) written out: the vector from the pivot to the point is turned and added to the pivot again. Set the angle to 90° and (3, 1) turned about (1, 1) arrives at x = 1.'
    },
    {
      name: 'Turning about a pivot: new y',
      expr: 'yn = cy + (x - cx)*sin(theta) + (y - cy)*cos(theta)',
      tex: 'y_{\\mathrm{new}} = c_y + (x - c_x)\\sin\\theta + (y - c_y)\\cos\\theta',
      vars: {
        yn: { name: 'new y', tex: 'y_{\\mathrm{new}}', signed: true },
        x: { name: 'old x', signed: true, value: 3 },
        y: { name: 'old y', signed: true, value: 1 },
        cx: { name: 'x of the pivot', tex: 'c_x', signed: true, value: 1 },
        cy: { name: 'y of the pivot', tex: 'c_y', signed: true, value: 1 },
        theta: { name: 'angle of the turn (counter-clockwise)', q: 'angle', unit: '°', value: 60, min: -360, max: 360, signed: true }
      },
      note: 'With the angle set to 90°, the point (3, 1) turned about the pivot (1, 1) arrives at (1, 3).'
    },
    {
      name: 'The gap between the two orders',
      expr: 'gap = 2*t*sin(theta/2)',
      tex: '\\delta = 2\\,t\\,\\sin\\frac{\\theta}{2}',
      vars: {
        gap: { name: 'distance between the two results', tex: '\\delta', q: 'length', unit: 'mm' },
        t: { name: 'length of the shift', q: 'length', unit: 'mm', value: 3 },
        theta: { name: 'angle of the turn', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      note: 'Shift then turn against turn then shift (both about the origin): the end points differ by (I − R)t. For t = 3 and a quarter turn that is 4.24, as in the two drawings.'
    }
  ],
  examples: [
    {
      title: 'Turning about a pivot',
      q: 'Turn the point $(3, 1)$ by $90°$ counter-clockwise about the pivot $(1, 1)$. Write the matrix that does it.',
      steps: [
        'Carry the pivot to the origin: $(3, 1) \\to (2, 0)$.',
        'Turn by $90°$: $(2, 0) \\to (0, 2)$.',
        'Carry the pivot back: $(0, 2) \\to (1, 3)$.',
        { text: 'The product $T(C)\\,R\\,T(-C)$ is one matrix (in homogeneous form for the plane):', tex: '\\begin{bmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{bmatrix}\\begin{bmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}\\begin{bmatrix} 1 & 0 & -1 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 1 \\end{bmatrix} = \\begin{bmatrix} 0 & -1 & 2 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}.' },
        'Applied to $(3, 1, 1)$ it gives $(0 - 1 + 2,\\ 3 + 0 + 0,\\ 1) = (1, 3, 1)$, the same point.'
      ],
      a: '(1, 3); the whole sandwich is the single matrix [[0, −1, 2], [1, 0, 0], [0, 0, 1]].'
    },
    {
      title: 'The two orders on one corner',
      q: 'The corner $A = (1, 0.5)$ of the triangle in the two drawings is turned a quarter turn about $O$ and shifted by $\\mathbf{t} = (3, 0)$, in both orders. Where does it end, and how far apart are the results?',
      steps: [
        'Rotate then translate: $(1, 0.5) \\to (-0.5, 1) \\to (2.5, 1)$.',
        'Translate then rotate: $(1, 0.5) \\to (4, 0.5) \\to (-0.5, 4)$.',
        'The distance between $(2.5, 1)$ and $(-0.5, 4)$ is $\\sqrt{9 + 9} = 4.24$, which is $2 \\times 3 \\times \\sin 45°$.'
      ],
      a: 'A ends at (2.5, 1) in one order and (−0.5, 4) in the other: 4.24 apart, whatever the corner.'
    }
  ],
  quiz: [
    { q: 'With points as columns, $M = T\\,R$. Which operation is done first?', choices: ['The translation', 'The rotation', 'Both at once', 'Neither: the order is arbitrary'], a: 1, why: 'The matrix nearest the point acts first, so R acts on the point and T then moves the result.' },
    { q: 'Turn the point $(3, 1)$ by $90°$ counter-clockwise about the pivot $(1, 1)$. The new $y$ is', answer: 3, why: 'The vector from the pivot is (2, 0); turned by 90° it is (0, 2); adding the pivot gives (1, 3).' },
    { q: 'Two rotations about the same axis commute.', a: true, why: 'Both just add their angles about the axis, and addition does not care about order.' },
    { q: 'Which product stretches an object by 2 about its own centre $C$ (not the origin)?', choices: ['$T(C)\\,S\\,T(-C)$', '$S\\,T(C)$', '$T(-C)\\,S\\,T(C)$', '$S$ alone'], a: 0, why: 'Move C to the origin, stretch, move back. The matrix nearest the point, T(−C), acts first.' },
    { q: 'The inverse of $M = T\\,R\\,S$ is', choices: ['$S^{-1}R^{-1}T^{-1}$', '$T^{-1}R^{-1}S^{-1}$', '$-M$', '$M^T$'], a: 0, why: 'Undo in the reverse order: first the placement T, then the turn R, then the stretch S. The inverse of the product is the product of the inverses in the reverse order.' }
  ],
  applications: [
    'Scene graphs and animation: a character is a tree of matrices and the hand\'s position is the product of the matrices down the arm.',
    'Robot kinematics: the tool position is the product of one matrix per joint, the starting point of every robot control calculation.',
    'Placing models in a 3-D scene: the model matrix is built as T·R·S (stretch, turn, place) before the camera matrices are applied.',
    'Technical drawing and CAD: a pattern rotated about a pivot and repeated is a power of the pivot sandwich.',
    'Astronomy: a chain of rotations takes the sky from one coordinate system to another.'
  ],
  history: 'That the order of turns in space matters was known to Euler; William Rowan Hamilton, who in 1843 invented the quaternions to describe turns, built the failure of commutativity into their multiplication on purpose. Cayley\'s definition of the matrix product in 1858 made the order of a chain of transformations a matter of notation, and the habit of writing an object\'s placement as T·R·S is the convention of today\'s graphics libraries.',
  sources: [
    'A. Cayley, "A memoir on the theory of matrices", Philosophical Transactions of the Royal Society, 1858.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (2nd ed., 1990), the section on composition of transformations.',
    'J. J. Craig, *Introduction to Robotics: Mechanics and Control* (3rd ed., 2005), chapter 2.'
  ],
  sim: 'pm-transform-stack',
  construction: ['pm-compose-rt', 'pm-compose-tr']
},

/* ====================================================================== the projection matrix */
{
  id: 'the-projection-matrix',
  parent: 'projection-mathematics',
  title: 'The projection matrix',
  level: 2,
  short: 'The matrix that puts the world on a picture plane at distance d from the eye: it copies d·x and d·y, puts the depth into w with a minus sign, and the division by w = −z does the rest. Far things shrink because w is the distance.',
  keywords: ['perspective matrix', 'projection matrix', 'clip coordinates', 'perspective division', 'w = −z', 'central projection', 'picture plane', 'eye distance', 'telephoto', 'orthographic limit'],
  prereq: ['homogeneous-coordinates', 'the-4x4-matrix', 'central-projection'],
  related: ['the-perspective-matrix', 'the-camera-model', 'foreshortening', 'opengl-projection-matrices', 'vanishing-points', 'orthographic-projection'],
  body: `Put the eye at the origin, looking along $-z$, with the picture plane at $z = -d$. A point $(x, y, z)$ in front of the eye has $z < 0$ and lies at distance $Z = -z$. The projector through it meets the plane at the point given by similar triangles:
$$x' = \\frac{d\\,x}{-z}, \\qquad y' = \\frac{d\\,y}{-z}.$$
Everything far away is divided by a large number, so it shrinks: that is perspective in one line. The matrix says it in the homogeneous way: copy $d\\,x$ and $d\\,y$, and put the **distance into $w$**:
$$P(d)\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} d & 0 & 0 & 0 \\\\ 0 & d & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} d\\,x \\\\ d\\,y \\\\ z \\\\ -z \\end{bmatrix} \\;\\to\\; \\left(\\frac{d\\,x}{-z},\\ \\frac{d\\,y}{-z},\\ -1\\right).$$
The last step is the **perspective division**: every component divided by $w$. The matrix itself is linear; all the perspective lives in that one division, which is why nothing before it needs to know about it.

### Why w = −z
The bottom row $(0\\ 0\\ {-1}\\ 0)$ copies the depth into $w$. It is $-z$ rather than $z$ only because the viewer looks along $-z$: points in front of the eye have negative $z$, and $w = -z$ is then positive, the true distance. In books where the viewer looks along $+z$ the row is $(0\\ 0\\ 1\\ 0)$. A point *behind* the eye has $w < 0$ and comes out upside down on the plane. Nothing in the matrix refuses it, so a graphics system must **clip** such points away before it divides.

### What the third row throws away
The third component after the division is $z/w = -1$ for every point: the matrix flattens the whole world onto the plane and forgets depth. For a drawing that is exactly right. A renderer that must still decide which surface is in front uses a different third row, one that keeps a function of $z$: the OpenGL matrix of [[the-camera-model]].

### Limits and special cases
Move the eye farther and farther from the object while enlarging $d$ in proportion, so that the picture keeps its size. The depth of the object then matters less and less compared with $Z$, so $w$ is nearly the same for all its points, the division is just one overall constant, and the projectors are nearly parallel. **Orthographic projection is the limit of perspective**, with last row $(0\\ 0\\ 0\\ 1)$ and nothing to divide; the long lens that nearly reaches it is the *telephoto effect*, which compresses depth. At every distance lines stay lines, and parallels that are parallel to the picture plane stay parallel; those that are not meet at a vanishing point ([[points-at-infinity]]).

### By hand
The division is a pair of similar triangles. In plan, join the eye to the point; where the line cuts the picture plane is $x'$, and $x'/d = x/Z$. The construction below does it and then doubles the distance: the image halves.`,
  ideas: [
    'The perspective matrix copies d·x and d·y and puts −z, the distance, into w; the division by w then shrinks everything in proportion to its distance.',
    'The bottom row is (0 0 −1 0) because the viewer looks along −z; behind the eye w is negative, so such points must be clipped before dividing.',
    'With this simplest matrix the depth after division is −1 for every point: depth is thrown away, as a drawing wants. Renderers use a third row that keeps a depth.',
    'Orthographic projection is the limit of perspective for a distant eye: w becomes constant and the projectors parallel.'
  ],
  pitfalls: [
    'The matrix itself makes distant things small — It is linear and only builds the vector (d·x, d·y, z, −z). The shrinking happens in the division by w that comes after.',
    'The picture plane position changes the view — Moving it (changing d) only enlarges or reduces the picture as a whole; the eye position decides what is seen from where.',
    'Parallel lines always converge in perspective — Only those not parallel to the picture plane. Lines parallel to it keep their direction in the picture, and a plane parallel to it is only scaled, by d/Z.'
  ],
  formulas: [
    {
      name: 'Image of a point on the picture plane',
      expr: 'xp = d*x/Z',
      tex: "x' = \\frac{d\\,x}{Z}",
      vars: {
        xp: { name: 'position on the picture', tex: "x'", q: 'length', unit: 'mm' },
        d: { name: 'distance from eye to picture plane (the focal length of a camera)', q: 'length', unit: 'mm', value: 50 },
        x: { name: 'sideways position of the point', q: 'length', unit: 'm', value: 2 },
        Z: { name: 'distance in front of the eye (−z)', q: 'length', unit: 'm', value: 20 }
      },
      stories: { xp: 'A camera with a picture plane {d} behind the pinhole looks at a pole {x} to one side and {Z} away. How far from the centre of the picture is the image of the pole?' },
      note: 'Similar triangles. Double the distance and the image halves; the same formula solves for the distance of an object of known size.'
    },
    {
      name: 'Vanishing point of a horizontal direction',
      expr: 'xv = d/tan(theta)',
      tex: 'x_v = d\\cot\\theta',
      vars: {
        xv: { name: 'distance of the vanishing point from the centre of the picture', tex: 'x_v', q: 'length', unit: 'mm' },
        d: { name: 'distance from eye to picture plane', q: 'length', unit: 'mm', value: 120 },
        theta: { name: 'angle between the lines and the picture plane', q: 'angle', unit: '°', value: 60, min: 1, max: 89 }
      },
      note: 'At 90° the lines run straight at the eye and vanish at the centre; as θ shrinks the vanishing point runs out along the horizon, and at 0° there is none.'
    },
    {
      name: 'Compression of depth by a distant eye',
      expr: 'r = Z1/(Z1 + s)',
      tex: 'r = \\frac{Z_1}{Z_1 + s}',
      vars: {
        r: { name: 'apparent size of the far object relative to the near one' },
        Z1: { name: 'distance to the near object', q: 'length', unit: 'm', value: 10 },
        s: { name: 'extra distance to the far object of the same size', q: 'length', unit: 'm', value: 10 }
      },
      note: 'Two equal objects 10 m apart: from 10 m away the far one looks half as big (r = 0.5); from 100 m it looks 91 % as big. The longer the lens and the farther the viewer, the flatter the picture.'
    }
  ],
  examples: [
    {
      title: 'How big is the pole?',
      q: 'A camera has the picture plane $d = 50$ mm behind the pinhole. A pole of height $h = 6$ m stands $30$ m from it. How tall is its image, and how far away would it be if the image were 5 mm?',
      steps: [
        'By similar triangles $h\' = d\\,h/Z = 50 \\times 6 / 30 = 10$ mm.',
        'Solving for the distance, $Z = d\\,h/h\' = 50 \\times 6 / 5 = 60$ m.'
      ],
      a: 'The image is 10 mm tall; at 5 mm the pole would be 60 m away.'
    },
    {
      title: 'The matrix at work',
      q: 'Project the points $(3, 1.5, -10)$ and $(3, 1.5, -20)$ with $d = 4$. Show the clip vector and the division.',
      steps: [
        { text: 'First point: the matrix gives $(dx, dy, z, -z) = (12, 6, -10, 10)$, and dividing by $w = 10$:', tex: '\\left(\\frac{12}{10},\\ \\frac{6}{10},\\ \\frac{-10}{10}\\right) = (1.2,\\ 0.6,\\ -1).' },
        'Second point: $(12, 6, -20, 20)$ divided by $w = 20$ gives $(0.6, 0.3, -1)$.',
        'The second point is twice as far and its image is half as far from the centre. The third component is $-1$ for both.'
      ],
      a: '(1.2, 0.6) and (0.6, 0.3): twice the distance, half the picture; the depth component is −1 for both.'
    }
  ],
  quiz: [
    { q: 'The point $(2, 1, -8)$ is projected with $d = 4$. Its image $x\'$ is', choices: ['1', '0.5', '4', '16'], a: 0, why: "x' = d·x/(−z) = 4 × 2/8 = 1." },
    { q: 'Why is the bottom row of the perspective matrix $(0\\ 0\\ {-1}\\ 0)$ and not $(0\\ 0\\ 1\\ 0)$?', choices: ['The viewer looks along −z, so the distance in front of the eye is −z and w must come out positive', 'A minus sign makes the picture upright', 'It turns the picture round the vertical axis', 'It is an arbitrary convention with no meaning'], a: 0, why: 'In front of the eye z is negative; copying −z makes w the (positive) distance. For a viewer looking along +z the row would be (0 0 1 0).' },
    { q: 'After the matrix of this page and the division by $w$, the third component is different for points at different depths.', a: false, why: 'It is z/(−z) = −1 for every point: the matrix flattens the world onto the picture plane. Depth buffers use a different third row.' },
    { q: 'An object is moved to twice its distance from the eye. The size of its image is multiplied by', answer: 0.5, why: 'x\' = d·x/Z: doubling Z halves x\'.' },
    { q: 'Which statement about central projection is true?', choices: ['Straight lines stay straight, and parallels not parallel to the picture plane converge', 'Parallel lines always stay parallel', 'Lengths along the line of sight are preserved', 'Circles always stay circles'], a: 0, why: 'Straightness is preserved; parallelism, lengths and the roundness of circles are not (a circle seen obliquely is an ellipse).' }
  ],
  applications: [
    'Every 3-D graphics program: the last step of the geometry pipeline is this division, wired into the hardware.',
    'Photography and the pinhole camera: the sensor sits at distance d behind the pinhole and the image size is d times the object size over its distance.',
    'Estimating distances from a photograph: if the real size of an object is known, its image size gives its distance, Z = d·h/h\'.',
    'Architectural visualisation and driving simulators: the choice of d (the field of view) decides how dramatic the perspective looks.',
    'Projected textures and spotlights: a projector or a light is a camera, and its matrix is the one above.'
  ],
  history: 'Division by distance is the oldest part of linear perspective: Brunelleschi found the rule in Florence early in the fifteenth century, Alberti set it down in *De pictura* (1435) and Dürer drew it with strings. Casting it as a matrix is recent. Lawrence Roberts, in his 1963 MIT thesis on recognising solid objects from pictures, wrote the perspective transformation as a 4 × 4 homogeneous matrix, the form every renderer has used since.',
  sources: [
    'L. B. Alberti, *De pictura* (1435).',
    'L. G. Roberts, *Machine Perception of Three-Dimensional Solids*, Ph.D. thesis, MIT, 1963.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (2nd ed., 1990), the chapter on viewing in three dimensions.'
  ],
  sim: 'pm-perspective-division',
  construction: 'pm-plan-projection'
},

/* ====================================================================== the camera model */
{
  id: 'the-camera-model',
  parent: 'projection-mathematics',
  title: 'The camera: view, projection, viewport',
  level: 3,
  short: 'The camera is a chain of four matrices: the model matrix puts an object in the world, the view matrix moves the world so that the camera sits at the origin looking along −z, the projection matrix squeezes the viewing frustum into a cube, and the viewport matrix stretches the cube onto the screen.',
  keywords: ['view matrix', 'lookAt', 'model view projection', 'MVP', 'frustum', 'clip space', 'NDC', 'viewport', 'field of view', 'near plane', 'far plane', 'OpenGL', 'focal length'],
  prereq: ['the-projection-matrix', 'composing-transformations', 'rotation-matrices'],
  related: ['3d-graphics-pipeline', 'opengl-projection-matrices', 'depth-buffers-and-clipping', 'field-of-view-and-focal-length', 'camera-calibration-and-homography', 'station-point-and-cone-of-vision'],
  body: `A virtual camera is four matrices in a row. Take a point of an object in the object's own coordinates and follow it to a pixel:
$$\\mathbf{p}_{\\text{pixel}} = \\underbrace{V_{\\text{port}}}_{\\text{viewport}}\\ \\underbrace{P}_{\\text{projection}}\\ \\underbrace{V}_{\\text{view}}\\ \\underbrace{M}_{\\text{model}}\\ \\mathbf{p}, \\qquad \\text{then divide by } w.$$
The simulation runs the chain on a small scene and follows one corner through every stage.

### Model and view
The **model matrix** $M$ puts the object in the world: stretch, turn, place ([[composing-transformations]]). The **view matrix** $V$ puts the *world* in the camera's frame; it is the inverse of the matrix that would place the camera, so moving the camera forward is moving the world backward. From the eye position $\\mathbf{e}$, the point looked at and a rough "up", the *lookAt* helper builds the camera's axes: forward $\\mathbf{f}$, right $\\mathbf{s} = \\mathbf{f} \\times \\mathbf{up}$ (normalised) and true up $\\mathbf{u} = \\mathbf{s} \\times \\mathbf{f}$, and
$$V = \\begin{bmatrix} s_x & s_y & s_z & -\\mathbf{s}\\cdot\\mathbf{e} \\\\ u_x & u_y & u_z & -\\mathbf{u}\\cdot\\mathbf{e} \\\\ -f_x & -f_y & -f_z & \\mathbf{f}\\cdot\\mathbf{e} \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}.$$
Its rows are the camera's axes (a rotation: the transpose of the camera's own) and its last column carries the eye to the origin. After $V$ the camera looks along $-z$ with $y$ up, the convention of [[the-projection-matrix]].

### Projection: the frustum becomes a cube
What the camera sees is a **frustum**: a pyramid from the eye, cut off at the near plane $z = -n$ and closed at the far plane $z = -f$. Its vertical opening is the field of view $\\varphi$ and its width is $a$ times its height ($a$ the aspect ratio). The OpenGL matrix
$$P = \\begin{bmatrix} \\dfrac{\\cot(\\varphi/2)}{a} & 0 & 0 & 0 \\\\ 0 & \\cot(\\varphi/2) & 0 & 0 \\\\ 0 & 0 & \\dfrac{f+n}{n-f} & \\dfrac{2fn}{n-f} \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}$$
sends the frustum, after the division by $w = -z$, onto the cube $-1 \\le x, y, z \\le 1$ (*normalised device coordinates*). The near plane goes to $z = -1$, the far plane to $+1$, the sides of the pyramid to the sides of the cube. Every projector through the eye becomes a line parallel to the depth axis, so the central projection has turned into a parallel one: what is left is to drop $z$. The bottom row is the same $-1$ as before; the third row keeps a depth instead of throwing it away.

### The depth is squeezed
With $Z = -z$ the stored depth is $z_{\\text{ndc}} = \\dfrac{f+n}{f-n} - \\dfrac{2fn}{(f-n)\\,Z}$. It is not even: for $n = 0.1$ and $f = 100$, half of the whole range $-1\\ldots 1$ is used up between $Z = 0.1$ and $Z = 0.2$, and everything out to 100 shares the other half. Depth buffers store this number with limited precision, so a near plane set too close wastes it: put $n$ as far out as the scene allows.

### Viewport, and the lens
The last matrix scales $x$ and $y$ from $[-1, 1]$ to a window of $W \\times H$ pixels and flips $y$, since pixel rows count downwards:
$$V_{\\text{port}} = \\begin{bmatrix} W/2 & 0 & 0 & W/2 \\\\ 0 & -H/2 & 0 & H/2 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}.$$
In photographic terms the field of view follows from the focal length $F$ and the sensor height $h$: $\\varphi = 2\\,\\arctan\\left(h/2F\\right)$. A sensor 24 mm high with a 50 mm lens gives $27°$ vertically; with a 24 mm lens, $53°$.`,
  ideas: [
    'The camera is a chain: viewport · projection · view · model, applied to a point and followed by one division by w.',
    'The view matrix is the inverse of the camera\'s placement: rows are the camera\'s axes, the last column carries the eye to the origin.',
    'The projection matrix squeezes the frustum into the cube −1…1; after it, the projectors are parallel and what remains is dropping z.',
    'Depth is stored as a function of 1/Z, so most of the range is used near the near plane: set n as far out as the scene allows.',
    'Field of view and focal length are the same thing: φ = 2 arctan(h / 2F).'
  ],
  pitfalls: [
    'The camera moves through the scene — In the matrices it is the other way round: the camera stays at the origin looking along −z, and the view matrix moves the whole world the opposite way.',
    'A very small near plane costs nothing — It wastes depth precision, because z_ndc depends on 1/Z; objects far away end up sharing a few values and flicker where their surfaces cross.',
    'The picture would look right with any aspect ratio in the matrix — The ratio a must match the window (W/H), or the picture is stretched; it is the viewport matrix that turns the cube into pixels, not the projection that fixes the shape of the window.'
  ],
  formulas: [
    {
      name: 'Field of view from the focal length',
      expr: 'fov = 2*atan(h/(2*F))',
      tex: '\\varphi = 2\\arctan\\frac{h}{2F}',
      vars: {
        fov: { name: 'field of view', tex: '\\varphi', q: 'angle', unit: '°', min: 1, max: 179 },
        h: { name: 'size of the sensor along that direction', q: 'length', unit: 'mm', value: 24 },
        F: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'With the sensor height this is the vertical angle (27° for 24 mm and 50 mm); with its width 36 mm the horizontal one (39.6°); with the diagonal 43.3 mm the diagonal angle (46.8°).'
    },
    {
      name: 'Depth after the projection (normalised device z)',
      expr: 'zn = (f + n)/(f - n) - 2*f*n/((f - n)*Z)',
      tex: 'z_{\\mathrm{ndc}} = \\frac{f + n}{f - n} - \\frac{2fn}{(f - n)\\,Z}',
      vars: {
        zn: { name: 'depth in the cube (−1 near plane, +1 far plane)', tex: 'z_{\\mathrm{ndc}}', signed: true },
        n: { name: 'near plane distance', q: 'length', unit: 'm', value: 2 },
        f: { name: 'far plane distance', q: 'length', unit: 'm', value: 8 },
        Z: { name: 'distance of the point in front of the eye (−z)', q: 'length', unit: 'm', value: 4 }
      },
      note: 'For n = 2 and f = 8 the plane at Z = 3 is already at −0.11, the plane at Z = 4 at 0.33 and the plane at Z = 6 at 0.78: the planes crowd towards the far end of the cube.'
    },
    {
      name: 'Viewport: from the cube to a pixel column',
      expr: 'px = (xn + 1)*W/2',
      tex: 'u = \\frac{(x_{\\mathrm{ndc}} + 1)\\,W}{2}',
      vars: {
        px: { name: 'pixel column (counted from the left edge of the window)', tex: 'u', value: 720 },
        xn: { name: 'normalised device x', tex: 'x_{\\mathrm{ndc}}', signed: true, value: 0.5, min: -1, max: 1 },
        W: { name: 'window width in pixels', value: 960 }
      },
      note: 'x_ndc = −1 is the left edge, 0 the centre, +1 the right edge. For the rows, the sign flips: v = (1 − y_ndc) H / 2.'
    }
  ],
  examples: [
    {
      title: 'Squeezing the depth',
      q: 'A camera has $n = 2$ and $f = 8$. Where, between $-1$ and $+1$, do points at distances $Z = 3, 4$ and $6$ land?',
      steps: [
        'With the formula $z_{\\text{ndc}} = \\dfrac{10}{6} - \\dfrac{32}{6\\,Z} = 1.667 - 5.333/Z$:',
        { text: 'The three planes land at', tex: 'Z = 3:\\ 1.667 - 1.778 = -0.11, \\qquad Z = 4:\\ 1.667 - 1.333 = 0.33, \\qquad Z = 6:\\ 1.667 - 0.889 = 0.78.' },
        'Everything from the near plane to $Z = 3.2$, a fifth of the depth range, already fills the first half of the cube ($z_{\\text{ndc}} = 0$ at $Z = 3.2$): the squeeze favours the near end.'
      ],
      a: '−0.11, 0.33 and 0.78; the nearest fifth of the depth range takes half of the cube.'
    },
    {
      title: 'Field of view of a 35 mm lens',
      q: 'A $36 \\times 24$ mm sensor sits behind a lens of focal length $35$ mm. What are the horizontal, vertical and diagonal angles of view?',
      steps: [
        'Horizontal: $2\\,\\arctan(18/35) = 2 \\times 27.2° = 54.4°$.',
        'Vertical: $2\\,\\arctan(12/35) = 2 \\times 18.9° = 37.8°$.',
        'Diagonal: the diagonal of the sensor is $\\sqrt{36^2 + 24^2} = 43.3$ mm, so $2\\,\\arctan(21.65/35) = 2 \\times 31.7° = 63.4°$.'
      ],
      a: '54.4° across, 37.8° up, 63.4° corner to corner.'
    }
  ],
  quiz: [
    { q: 'Which matrix moves the world so that the camera sits at the origin?', choices: ['The view matrix', 'The model matrix', 'The projection matrix', 'The viewport matrix'], a: 0, why: 'The view matrix is the inverse of the camera\'s placement. The model matrix places objects in the world; the projection squeezes the frustum; the viewport makes pixels.' },
    { q: 'After the projection matrix and the division by $w$, a point is inside the view if', choices: ['all of x, y and z lie between −1 and 1', 'only z lies between 0 and 1', 'w is greater than 1', 'x and y are positive'], a: 0, why: 'The frustum has become the cube −1 ≤ x, y, z ≤ 1; anything outside it is clipped.' },
    { q: 'A camera has $n = 2$ and $f = 8$. At what $z_{\\text{ndc}}$ does a point at distance $Z = 4$ land?', answer: 0.333, why: '(f + n)/(f − n) − 2fn/((f − n)Z) = 10/6 − 32/24 = 1.6667 − 1.3333 = 0.3333.' },
    { q: 'Setting the near plane to a very small number costs nothing, because it only affects what is cut away.', a: false, why: 'z_ndc depends on 1/Z, so a tiny n uses almost all the depth range on the first centimetres and leaves the distant scene with a few values: surfaces flicker where they overlap.' },
    { q: 'The focal length of a lens is doubled on the same sensor. The tangent of the half-angle of view is', choices: ['halved', 'doubled', 'unchanged', 'squared'], a: 0, why: 'tan(φ/2) = h / 2F, so doubling F halves it. For narrow views the angle itself is almost halved.' }
  ],
  applications: [
    'Real-time rendering: games compute the product P·V·M once per object per frame, and the graphics card applies it to every vertex.',
    'Virtual and augmented reality: two eyes mean two view matrices a few centimetres apart, and a projection matrix matched to the lenses of the headset.',
    'Camera calibration and photogrammetry: the intrinsic matrix with the focal length in pixels is the 3 × 3 relative of P and the viewport; the extrinsic matrix is V.',
    'Film previsualisation and virtual production: the director\'s lens and sensor size become the field of view in the engine.',
    'CAD viewers and architectural walkthroughs: orbiting, zooming and changing the lens only change the arguments of lookAt and the field of view.'
  ],
  history: 'The pinhole model of a picture comes from the camera obscura, and its mathematics from the perspective of the fifteenth century. Computer graphics put it into matrix form in the 1960s; the lookAt and perspective calls familiar today come from the libraries of Silicon Graphics (IRIS GL) and its successor OpenGL (1992), whose frustum matrix is the one above.',
  sources: [
    'M. Woo, J. Neider, T. Davis and D. Shreiner, *OpenGL Programming Guide* ("the Red Book"), the chapter on viewing.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (2nd ed., 1990), the chapter on viewing in three dimensions.',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 6, camera models.'
  ],
  sim: 'pm-camera-pipeline',
  construction: 'pm-frustum-to-cube'
},

/* ====================================================================== points at infinity */
{
  id: 'points-at-infinity',
  parent: 'projection-mathematics',
  title: 'Points at infinity',
  level: 2,
  short: 'Parallel lines never meet, yet in a picture they do. Add to the plane one point for every direction — a point at infinity — and call them all the line at infinity: in homogeneous coordinates that is simply w = 0, and a vanishing point is the picture of such a point.',
  keywords: ['point at infinity', 'line at infinity', 'ideal point', 'vanishing point', 'horizon', 'parallel lines', 'projective plane', 'direction', 'w = 0', 'Desargues', 'Kepler'],
  prereq: ['homogeneous-coordinates', 'the-projection-matrix', 'vanishing-points'],
  related: ['projective-geometry', 'cross-ratio', 'horizon-and-eye-level', 'one-point-perspective', 'two-point-perspective', 'three-point-perspective'],
  body: `Stand between two rails and look along them: they run together at a point on the horizon. They are parallel, and parallel lines have no point in common, yet the picture has one. The answer of geometry, due to Kepler and Desargues in the early seventeenth century, is to add to the plane a new point at the end of every direction, **one point at infinity for each family of parallel lines**, so that any two lines at all meet in exactly one point.

### In homogeneous coordinates
The quadruple $(x, y, z, w)$ with $w = 0$ is such a point. It is not a place but the direction $(x, y, z)$: with $w \\to 0$ the point $(x/w, y/w, z/w)$ flies off along that direction. All the points at infinity of a plane make its **line at infinity**, $w = 0$; those of space make the **plane at infinity**. Nothing in the algebra needs a special case. Two lines always have an intersection; parallel ones just meet where $w = 0$.

### The vanishing point is a picture of one
Apply the projection matrix to a direction $(d_x, d_y, d_z)$, written $(d_x, d_y, d_z, 0)$:
$$P(d)\\begin{bmatrix} d_x \\\\ d_y \\\\ d_z \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} d\\,d_x \\\\ d\\,d_y \\\\ d_z \\\\ -d_z \\end{bmatrix} \\;\\to\\; \\left(\\frac{d\\,d_x}{-d_z},\\ \\frac{d\\,d_y}{-d_z}\\right).$$
The point at infinity has become a **finite** point of the picture whenever $d_z \\neq 0$: the **vanishing point** of that direction. For a horizontal direction making the angle $\\theta$ with the picture plane, $x_v = d\\cot\\theta$. At $\\theta = 90°$, rails pointing straight at the eye, it sits at the centre; as $\\theta \\to 0$ it runs off to infinity again, and lines parallel to the picture plane ($d_z = 0$) have no vanishing point at all: their images stay parallel.

### The horizon
Every horizontal direction vanishes on the one line $y' = 0$, at eye level: it is the picture of the line at infinity of the ground. That is why the vanishing points of everything on level ground sit on the horizon, and why you can never walk up to it.

### A line closes up
Let a point run along a line to infinity and go on: in the projective plane it returns from the other side, because each line has *one* point at infinity, not two. In the camera, a point of a rail passes through $w = 0$ at the plane through the eye parallel to the picture, and reappears behind the viewer, upside down. That, not mere distance, is why a camera must **clip** points with $w \\le 0$.

### By hand
The vanishing point of a family of parallels is found in plan: through the station point draw the parallel to the family, and where it meets the picture plane is the vanishing point; a vertical carries it up to the horizon. The construction does this for five rails at $60°$ with $d = 120$, giving $x_v = 69.3$, and then draws them as lines to that one point.`,
  ideas: [
    'Each family of parallel lines has one point at infinity, a direction; all of them together make the line at infinity, w = 0.',
    'Any two lines of the extended plane meet in exactly one point, so incidence needs no exceptions.',
    'The projection matrix turns a direction (d_x, d_y, d_z, 0) into the finite vanishing point (d·d_x / −d_z, d·d_y / −d_z); for a horizontal direction at θ to the picture plane x_v = d cot θ.',
    'The horizon is the picture of the line at infinity of the ground; points with w ≤ 0 lie behind the eye and must be clipped.'
  ],
  pitfalls: [
    'Parallel lines in the picture meet because the ground really curves — They meet because their common point at infinity has a finite image; nothing curves. A plane parallel to the picture shows no convergence at all.',
    'Every set of parallel lines has a vanishing point — Not those parallel to the picture plane: their point at infinity maps to infinity again, so they stay parallel in the picture.',
    'The vanishing point is a point of the scene — It is a point of the picture only. It is the image of a direction, which is why it is the same wherever on the ground the rails start, and why it moves when the picture plane is tilted.'
  ],
  formulas: [
    {
      name: 'Vanishing point of a horizontal direction',
      expr: 'xv = d/tan(theta)',
      tex: 'x_v = d\\cot\\theta',
      vars: {
        xv: { name: 'distance of the vanishing point from the centre of the picture', tex: 'x_v', q: 'length', unit: 'mm' },
        d: { name: 'distance from eye to picture plane', q: 'length', unit: 'mm', value: 120 },
        theta: { name: 'angle between the lines and the picture plane', q: 'angle', unit: '°', value: 60, min: 1, max: 89 }
      },
      note: 'For rails at 60° and d = 120 mm: x_v = 69.3 mm. Solve for θ to find the angle of a wall from its vanishing point.'
    },
    {
      name: 'The two vanishing points of a box',
      expr: 'd^2 = -x1*x2',
      tex: 'd^2 = -x_1\\,x_2',
      solveFor: 'd',
      vars: {
        d: { name: 'distance from the eye to the picture plane', q: 'length', unit: 'mm', value: 69.28 },
        x1: { name: 'first vanishing point (right of the centre)', tex: 'x_1', q: 'length', unit: 'mm', signed: true, value: 120 },
        x2: { name: 'second vanishing point (left of the centre)', tex: 'x_2', q: 'length', unit: 'mm', signed: true, value: -40 }
      },
      note: 'For two horizontal directions at right angles, x₁ = d cot θ and x₂ = −d tan θ, so x₁x₂ = −d². The eye sees the two vanishing points under a right angle: the station point lies on the semicircle over the segment between them.'
    }
  ],
  examples: [
    {
      title: 'Rails at several angles',
      q: 'The picture plane is $d = 5$ cm from the eye. Where do rails vanish if they make $30°$, $45°$ and $60°$ with the picture plane?',
      steps: [
        { text: 'Use $x_v = d\\cot\\theta$:', tex: 'x_v(30°) = 5 \\times 1.732 = 8.66,\\quad x_v(45°) = 5 \\times 1 = 5,\\quad x_v(60°) = 5 \\times 0.577 = 2.89\\ \\text{cm}.' },
        'The shallower the angle to the picture plane, the farther the vanishing point from the centre; at $90°$ it is at the centre.'
      ],
      a: '8.66 cm, 5 cm and 2.89 cm from the centre of the picture.'
    },
    {
      title: 'Finding the viewing distance from two vanishing points',
      q: 'On a photograph of a building with two horizontal sets of edges at right angles, the vanishing points lie $120$ mm to the right and $40$ mm to the left of the principal point. How far is the picture plane from the eye, and what angle does the first wall make with the picture plane?',
      steps: [
        'For perpendicular directions $x_1 x_2 = -d^2$: $d^2 = 120 \\times 40 = 4800$, so $d = 69.3$ mm.',
        'From $x_1 = d\\cot\\theta$: $\\cot\\theta = 120/69.3 = 1.732$, so $\\theta = 30°$. The second wall makes $60°$: check $x_2 = -d\\tan 30° = -40$ mm.'
      ],
      a: 'd = 69.3 mm (the focal length, in the scale of the photograph); the first wall makes 30° with the picture plane.'
    }
  ],
  quiz: [
    { q: 'The point $(3, 2, 0, 0)$ of homogeneous space is', choices: ['a point 3.6 units from the origin', 'the direction (3, 2, 0): a point at infinity', 'the origin', 'an error: it divides by zero'], a: 1, why: 'With w = 0 it is not a place but a direction. Homogeneous coordinates allow it, and it is exactly a point at infinity.' },
    { q: 'Why do the parallel rails in a photograph meet at a point?', choices: ['The ground curves away', 'Their common point at infinity has a finite image, the vanishing point', 'The lens bends straight lines', 'Rails are never exactly parallel'], a: 1, why: 'Parallels share a point at infinity, and a perspective projection maps it to a finite point of the picture.' },
    { q: 'With $d = 100$ mm, rails at $45°$ to the picture plane vanish at $x_v =$', answer: 100, unit: 'mm', why: 'x_v = d cot 45° = 100 × 1 = 100 mm.' },
    { q: 'Lines that are parallel to the picture plane meet at the centre of the picture.', a: false, why: 'They have no vanishing point: their point at infinity is also at infinity in the picture, so they stay parallel there. The centre is where lines perpendicular to the picture plane converge.' },
    { q: 'For two perpendicular horizontal directions the vanishing points are at $x_1 = d\\cot\\theta$ and $x_2 = -d\\tan\\theta$. Their product is', choices: ['$d^2$', '$-d^2$', '$1$', '$-1$'], a: 1, why: 'cot θ · tan θ = 1, so x₁x₂ = −d²: one is on each side of the centre.' }
  ],
  applications: [
    'Perspective drawing: every horizontal edge of a building has one of two vanishing points on the horizon; the artist finds them once and each line follows.',
    'Photo editing and architectural photography: "perspective correction" makes lines that should be parallel meet at the vertical vanishing point and then straightens them.',
    'Computer vision: the vanishing points of a scene give the rotation of the camera and its focal length from a single image.',
    'Driving and flight simulators: the road converges on the horizon exactly as above, and the height of the horizon is the height of the eye.',
    'Map projections: the gnomonic map sends the great circle 90° from its centre to infinity, which is why it can never show a whole hemisphere.'
  ],
  history: 'Kepler, in *Ad Vitellionem paralipomena* (1604), spoke of the parabola meeting its axis "at infinity" and let a line close on itself through a point there. Girard Desargues, an engineer and teacher of perspective in Paris and Lyon, built projective geometry on points at infinity in his *Brouillon project* of 1639, so that a family of parallels and its perspective picture could be treated alike. Jean-Victor Poncelet made the system respectable in 1822.',
  sources: [
    'G. Desargues, *Brouillon project d\'une atteinte aux événements des rencontres du cône avec un plan* (1639).',
    'J.-V. Poncelet, *Traité des propriétés projectives des figures* (1822).',
    'H. S. M. Coxeter, *Projective Geometry* (2nd ed.), chapter 1.',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2 and chapter 8.'
  ],
  sim: 'pm-ideal-points',
  construction: 'pm-parallels-meet'
},

/* ====================================================================== the cross-ratio */
{
  id: 'cross-ratio',
  parent: 'projection-mathematics',
  title: 'The cross-ratio, the invariant of perspective',
  level: 3,
  short: 'Perspective changes lengths and even the ratio of three lengths, but one number survives: the cross-ratio of four points on a line, (AC/BC) ÷ (AD/BD). Carry the points to another line through a centre and it does not change. It is what lets a picture be measured.',
  keywords: ['cross-ratio', 'cross ratio', 'anharmonic ratio', 'invariant', 'harmonic conjugate', 'perspectivity', 'projective invariant', 'collinear points', 'Pappus', 'fence posts'],
  prereq: ['points-at-infinity', 'what-projections-preserve', 'math:similar-triangles'],
  related: ['projective-geometry', 'dividing-depth', 'measuring-points', 'camera-calibration-and-homography', 'vanishing-points'],
  body: `A perspective picture squashes lengths: equal fence posts crowd together on the paper, and the middle of a receding road is not the middle of its picture. The ratio $AB : BC$ of three points on a line is lost as well. Four points keep something:
$$(A, B; C, D) = \\frac{AC / BC}{AD / BD} = \\frac{AC \\cdot BD}{BC \\cdot AD},$$
with the distances taken with sign along the line. This is the **cross-ratio**, and it is the same for four points and for their four images when they are carried onto another line from any centre, or by any projective map at all. It is *the* invariant of perspective.

### Why it cannot change
Let $O$ be the centre and $h$ its distance from the first line. Twice the area of the triangle $OAC$ is $AC \\cdot h = OA \\cdot OC \\,\\sin\\angle AOC$. Put four such expressions into the quotient: $h$ cancels, so do the lengths $OA, OB, OC, OD$, and what is left is
$$(A, B; C, D) = \\frac{\\sin\\angle AOC \\ \\sin\\angle BOD}{\\sin\\angle BOC \\ \\sin\\angle AOD}.$$
Only the angles at $O$ appear. They are the same for every line that cuts the four rays, so the cross-ratio is too. The second line's own lengths give the same angles and the same value.

### What it is good for
**Reading a picture.** Let $D$ be the point at infinity: the cross-ratio becomes the plain ratio $AC/BC$. If $A$, $B$, $C$ are three equally spaced posts and the picture shows their images and the vanishing point $V$ (the image of infinity), then $(A', B'; C', V) = AC/BC$ is known, and every further post can be placed. A road can be divided into equal parts in perspective, and a length measured from a single photograph, with only a ruler (the worked example does it with numbers).

**Harmonic points.** When $(A, B; C, D) = -1$ the points $C$ and $D$ divide $AB$ internally and externally in the same ratio: $D$ is the *harmonic conjugate* of $C$. The value $-1$ survives every projection, so a drawing can carry the harmonic property exactly. In lengths measured from $A$, $AB$ is the harmonic mean of $AC$ and $AD$.

**Freedom.** Three points and a cross-ratio fix the fourth, so a map of one line onto another is fixed by three pairs of points ([[projective-geometry]]).

### By hand
Take four points on a line, join them to a centre, cut the four rays with a second line, measure both sets of distances with scale or dividers and compute both ratios: they agree to the accuracy of the drawing. The construction below does it for $(A, B; C, D) = 6/5$.`,
  ideas: [
    'The cross-ratio (A, B; C, D) = (AC · BD) / (BC · AD), with signed distances, is unchanged when four collinear points are projected from a centre onto another line.',
    'It depends only on the angles at the centre (sin AOC · sin BOD) / (sin BOC · sin AOD), which every cutting line shares.',
    'With D at infinity it becomes AC / BC: from three equally spaced posts and the vanishing point a picture can be divided and measured.',
    'The value −1 marks the harmonic conjugate and survives every projection.'
  ],
  pitfalls: [
    'Perspective keeps the ratio of lengths AB : BC — Not even the middle of a segment survives (the picture of the midpoint of a road is not the midpoint of its picture). Four points are needed for an invariant.',
    'The cross-ratio is a ratio of lengths, so it changes with the scale of the picture — It is a ratio of ratios: scaling the whole picture cancels, and so does moving the centre. Only the order and the sign need care.',
    'Any four points have the same cross-ratio — It is different for every set of four, and the invariance is that a set has the same value when seen from any viewpoint. Permuting the four letters changes the value (six values from one number).'
  ],
  formulas: [
    {
      name: 'Cross-ratio of four points on a line',
      expr: 'cr = ((c - a)*(d - b))/((c - b)*(d - a))',
      tex: '\\mathrm{CR} = \\frac{(c - a)(d - b)}{(c - b)(d - a)}',
      vars: {
        cr: { name: 'cross-ratio (A, B; C, D)', tex: '\\mathrm{CR}', signed: true },
        a: { name: 'position of A along the line', signed: true, value: 0 },
        b: { name: 'position of B', signed: true, value: 2 },
        c: { name: 'position of C', signed: true, value: 3 },
        d: { name: 'position of D', signed: true, value: 6 }
      },
      note: 'Positions are numbers along the line, in any unit and from any origin. The points 0, 2, 3, 6 give 2; their images under a perspective to another line, 0, 1, 1.2, 1.5, give 2 again. Solve for d to place the fourth point when the cross-ratio is known.'
    },
    {
      name: 'Harmonic conjugate: lengths from A',
      expr: 'dAB = 2*dAC*dAD/(dAC + dAD)',
      tex: 'd_{AB} = \\frac{2\\,d_{AC}\\,d_{AD}}{d_{AC} + d_{AD}}',
      vars: {
        dAB: { name: 'distance from A to B', tex: 'd_{AB}', q: 'length', unit: 'cm' },
        dAC: { name: 'distance from A to C', tex: 'd_{AC}', q: 'length', unit: 'cm', value: 3 },
        dAD: { name: 'distance from A to D', tex: 'd_{AD}', q: 'length', unit: 'cm', value: 6 }
      },
      note: 'When (A, B; C, D) = −1, AB is the harmonic mean of AC and AD. With AC = 3 and AD = 6, B lies 4 cm from A.'
    }
  ],
  examples: [
    {
      title: 'Fence posts in a photograph',
      q: 'Fence posts stand at equal spacing, 3 m apart. On a photograph the images of three posts are at $0$, $40$ and $64$ mm along a line, and the vanishing point of the fence is at $160$ mm. Where is the image of the next post?',
      steps: [
        'Let the posts be numbered 0, 1, 2, 3 in space and let $V$ be the image of infinity. Then $(A, B; C, \\infty) = AC/BC = 2/1 = 2$.',
        { text: 'Check the picture: the images give the same number,', tex: '\\frac{(64 - 0)(160 - 40)}{(64 - 40)(160 - 0)} = \\frac{64 \\times 120}{24 \\times 160} = 2.' },
        { text: 'For the fourth post $D\'$ the cross-ratio is $AD/BD = 3/2$, so', tex: '\\frac{D\'\\,(160 - 40)}{(D\' - 40)(160)} = 1.5 \\ \\Rightarrow\\ 120\\,D\' = 240\\,D\' - 9600 \\ \\Rightarrow\\ D\' = 80\\ \\text{mm}.' },
        'The spacings in the picture, 40, 24, 16 mm, shrink towards the vanishing point as they should.'
      ],
      a: '80 mm. The images of posts 0, 1, 2, 3 are at 0, 40, 64, 80 mm.'
    },
    {
      title: 'A harmonic division survives projection',
      q: 'On a line the points $A = 0$, $C = 3$ and $D = 6$ (cm) are given. Find the point $B$ for which $(A, B; C, D) = -1$, and check that the projection $x\' = 2x/(x + 2)$ keeps that value.',
      steps: [
        'The harmonic mean: $AB = 2 \\times 3 \\times 6 / (3 + 6) = 4$ cm, so $B = 4$. Check: $(A, B; C, D) = \\dfrac{(3 - 0)(6 - 4)}{(3 - 4)(6 - 0)} = \\dfrac{6}{-6} = -1$.',
        'Project: $A\' = 0$, $B\' = 8/6 = 1.333$, $C\' = 6/5 = 1.2$, $D\' = 12/8 = 1.5$.',
        'Cross-ratio of the images: $\\dfrac{(1.2 - 0)(1.5 - 1.333)}{(1.2 - 1.333)(1.5 - 0)} = \\dfrac{1.2 \\times 0.1667}{-0.1333 \\times 1.5} = \\dfrac{0.2}{-0.2} = -1$.'
      ],
      a: 'B = 4 cm; after the projection the cross-ratio is still −1.'
    }
  ],
  quiz: [
    { q: 'Which quantity is unchanged when four collinear points are projected from a centre onto another line?', choices: ['The distances between neighbouring points', 'The ratio AB : BC of three points', 'The cross-ratio of the four points', 'The midpoint of AB'], a: 2, why: 'Lengths, ratios of three lengths and midpoints all change under perspective; the cross-ratio of four points does not.' },
    { q: 'Four points lie at $0$, $1$, $3$ and $6$ on a line. Their cross-ratio $(A, B; C, D)$ is', answer: 1.25, why: '(3 − 0)(6 − 1) / ((3 − 1)(6 − 0)) = 15/12 = 1.25.' },
    { q: 'A cross-ratio of $-1$ on a line can be turned into a different value by projecting the line from a centre onto a second line.', a: false, why: 'The cross-ratio is invariant under projection, so harmonic points stay harmonic.' },
    { q: 'Three equally spaced fence posts have images at $0$, $40$ and $64$ mm, and the vanishing point of the fence is at $160$ mm. The image of the fourth post is at', answer: 80, unit: 'mm', why: '(A\', B\'; D\', V) must equal AD/BD = 3/2: 120 D\' / (160 (D\' − 40)) = 1.5 gives D\' = 80 mm.' },
    { q: 'If $D$ is the point at infinity of the line, $(A, B; C, D)$ equals', choices: ['$AC / BC$', '$AB / CD$', '$1$', '$0$'], a: 0, why: 'When D recedes, BD / AD tends to 1, leaving AC / BC.' }
  ],
  applications: [
    'Perspective drawing: dividing a receding length in a given ratio, such as the windows of a façade or the tiles of a floor, rests on the cross-ratio or on its practical forms, the measuring-point and diagonal constructions.',
    'Single-view measurement: heights and distances are recovered from one photograph with the cross-ratio of a known reference, as in architectural and forensic photogrammetry.',
    'Computer vision: the cross-ratio of four collinear points (or five coplanar points) is a signature that does not depend on the viewpoint, used in recognition and in markers.',
    'Surveying and astronomy: the directions of four stars seen from one place give a cross-ratio that can be compared with a chart or a photograph, whatever the projection.',
    'Computer-aided geometric design: the cross-ratio of the control points characterises a rational Bézier arc of a conic independently of its parametrisation.'
  ],
  history: 'Pappus of Alexandria used the invariant in Book VII of his *Collection* (about 340 CE) for the pencil of four lines. It became a foundation of projective geometry with Michel Chasles, who named it the *anharmonic ratio* in his *Traité de géométrie supérieure* (1852), and with Karl von Staudt, who in his *Geometrie der Lage* (1847) showed that projective geometry can be built without measuring any length, using the harmonic construction alone. The English name is cross-ratio.',
  sources: [
    'Pappus of Alexandria, *Collection*, Book VII (about 340 CE).',
    'M. Chasles, *Traité de géométrie supérieure* (1852).',
    'H. S. M. Coxeter, *Projective Geometry* (2nd ed.), chapters 2 and 4.',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2, section on the cross-ratio.'
  ],
  sim: 'pm-cross-ratio',
  construction: 'pm-cross-ratio-construction'
},

/* ====================================================================== projective geometry */
{
  id: 'projective-geometry',
  parent: 'projection-mathematics',
  title: 'Projective geometry in a nutshell',
  level: 3,
  short: 'Projective geometry is the geometry of what a perspective picture preserves: points, lines and which points lie on which lines. Add the line at infinity and every two lines meet, points and lines swap roles in every theorem, and Desargues and Pappus say that triangles and hexagons close up from any point of view.',
  keywords: ['projective geometry', 'projective plane', 'duality', 'Desargues', 'Pappus', 'homography', 'Klein', 'Erlangen programme', 'incidence', 'collineation', 'conic'],
  prereq: ['points-at-infinity', 'cross-ratio', 'homogeneous-coordinates'],
  related: ['camera-calibration-and-homography', 'what-projections-preserve', 'taxonomy-of-projections', 'stereographic-projection', 'shadow-maps-and-projective-textures'],
  body: `Euclid's geometry asks about lengths and angles, and a picture ruins both. Projective geometry asks what a picture keeps: **points, lines, and which points lie on which lines.** A projection of a plane onto a plane (a central projection, or a chain of them) is a *projective map*, and the geometry of whatever every projective map leaves unchanged is projective geometry.

### The projective plane
Add to the plane the line at infinity of [[points-at-infinity]]. Now any two points lie on exactly one line and any two lines meet in exactly one point: the exceptions of Euclid's plane (parallels) are gone. In homogeneous coordinates a point is a triple $(x, y, w)$, a line is a triple $(a, b, c)$ with $ax + by + cw = 0$, and
$$\\text{the line through } P, Q:\\ \\ \\mathbf{l} = \\mathbf{p} \\times \\mathbf{q}, \\qquad \\text{the point on } \\mathbf{l}, \\mathbf{m}:\\ \\ \\mathbf{p} = \\mathbf{l} \\times \\mathbf{m}.$$
The same cross product does both jobs, and for two parallel lines it returns a point with $w = 0$.

### Duality
In the plane "point" and "line" are interchangeable: exchange them (and "lies on" with "passes through") in a true statement and the result is again true. Two points determine a line; dually, two lines determine a point. Every theorem therefore comes with a twin for free.

### Desargues and Pappus
**Desargues (1639).** If two triangles are in perspective from a point (the lines joining corresponding vertices meet in one point), then they are in perspective from a line (the three points where corresponding sides meet lie on one line). Its converse is its dual, so one proof serves both. No length appears. In space it is nearly obvious, since the planes of the two triangles meet in a line, and the plane case is a projection of that picture. The construction and the lab below draw it.

**Pappus (about 340 CE).** Take three points $A, B, C$ on one line and three points $a, b, c$ on another. The three points where $Ab$ meets $aB$, $Ac$ meets $aC$ and $Bc$ meets $bC$ lie on one line. In the axioms of the subject Pappus is exactly what makes multiplication of coordinates commute, and Pascal, at sixteen, stretched the hexagon to any conic.

### Projective maps
A map of the plane that keeps lines as lines is a $3 \\times 3$ matrix acting on $(x, y, w)$, fixed up to a common factor: eight numbers, so **four pairs of corresponding points, no three on a line, determine it.** That is why four marked corners are enough to un-distort the photograph of a door or a page, or to paste a picture onto a quadrilateral. Cross-ratios survive, lengths and angles do not; parallels may meet (the horizon), circles become ellipses, parabolas or hyperbolas, and for this geometry all the conics are one curve.

### Klein's ladder
In 1872 Felix Klein proposed that a geometry is the study of what a group of transformations leaves alone. Congruences, similarities, affine maps and projective maps form a ladder, each rung keeping less than the one below ([[the-4x4-matrix]]). Affine maps are the projective maps that fix the line at infinity; similarities are the affine maps that also fix two special points on it (the circular points).`,
  ideas: [
    'Projective geometry studies what central projection preserves: points, lines and incidence. Lengths, angles and parallelism are not preserved.',
    'With the line at infinity added, any two lines meet in exactly one point; a line is a triple (a, b, c) and the cross product of two lines gives their common point, even for parallels.',
    'Duality: exchange points and lines in a theorem and it stays true. Desargues says triangles in perspective from a point are in perspective from a line, Pappus that a certain hexagon closes.',
    'A projective map of the plane is a 3 × 3 matrix with eight free numbers: four point pairs fix it.'
  ],
  pitfalls: [
    'Projective maps keep parallel lines parallel — They keep lines as lines but parallelism only for the special affine ones. Parallels can meet at the horizon after a projection.',
    'The line at infinity is a place far away that you could reach — It is a way of completing the plane so that incidence has no exceptions. Nothing is at distance infinity; the points of w = 0 are directions.',
    'A projective map preserves ratios of lengths — Neither the ratio of three points nor the midpoint survives. The ratio of ratios, the cross-ratio of four points, does.'
  ],
  formulas: [
    {
      name: 'Meeting point of two lines (x coordinate)',
      expr: 'x = (b1*c2 - b2*c1)/(a1*b2 - a2*b1)',
      tex: 'x = \\frac{b_1 c_2 - b_2 c_1}{a_1 b_2 - a_2 b_1}',
      vars: {
        x: { name: 'x coordinate of the common point', signed: true },
        a1: { name: 'first line: coefficient of x', signed: true, value: 1 },
        b1: { name: 'first line: coefficient of y', signed: true, value: 2 },
        c1: { name: 'first line: constant', signed: true, value: -4 },
        a2: { name: 'second line: coefficient of x', signed: true, value: 3 },
        b2: { name: 'second line: coefficient of y', signed: true, value: -1 },
        c2: { name: 'second line: constant', signed: true, value: -5 }
      },
      note: 'The lines are a·x + b·y + c = 0. This is the cross product of the two lines divided by its last component, w = a₁b₂ − a₂b₁. When that is zero the lines are parallel and the common point is at infinity.'
    },
    {
      name: 'A projective map of a line',
      expr: 'xn = (a*x + b)/(c*x + d)',
      tex: 'x_{\\mathrm{new}} = \\frac{a\\,x + b}{c\\,x + d}',
      vars: {
        xn: { name: 'position after the map', tex: 'x_{\\mathrm{new}}', signed: true },
        x: { name: 'position before', signed: true, value: 3 },
        a: { name: 'coefficient a', signed: true, value: 2 },
        b: { name: 'coefficient b', signed: true, value: 0 },
        c: { name: 'coefficient c', signed: true, value: 1 },
        d: { name: 'coefficient d', signed: true, value: 2 }
      },
      note: 'Every perspective from one line to another has this form. The values shown are the map x → 2x/(x + 2), which sends 0, 2, 3, 6 to 0, 1, 1.2, 1.5, a map of the same kind as the one in the cross-ratio construction. The point x = −d/c goes to infinity: it is the vanishing point of the line.'
    }
  ],
  examples: [
    {
      title: 'The meeting point by cross product',
      q: 'Find the common point of the lines $x + 2y - 4 = 0$ and $3x - y - 5 = 0$, and of the parallel lines $x + 2y - 4 = 0$ and $x + 2y - 10 = 0$.',
      steps: [
        { text: 'The lines as triples are $(1, 2, -4)$ and $(3, -1, -5)$. Their cross product:', tex: '(2\\cdot(-5) - (-4)(-1),\\ \\ (-4)\\cdot 3 - 1\\cdot(-5),\\ \\ 1\\cdot(-1) - 2\\cdot 3) = (-14,\\ -7,\\ -7).' },
        'Dividing by the last component, $w = -7$: the point $(2, 1)$. Check: $2 + 2 - 4 = 0$ and $6 - 1 - 5 = 0$.',
        'The parallel lines $(1, 2, -4)$ and $(1, 2, -10)$ give $(2\\cdot(-10) - (-4)\\cdot 2,\\ (-4)\\cdot 1 - 1\\cdot(-10),\\ 1\\cdot 2 - 2\\cdot 1) = (-12, 6, 0)$. The last component is $0$: the common point is the point at infinity in the direction $(-12, 6) \\propto (-2, 1)$, the direction of the lines.'
      ],
      a: '(2, 1) for the first pair; the point at infinity in the direction of the lines for the parallel pair.'
    },
    {
      title: 'A projective map of a line',
      q: 'The map $x\' = 2x/(x + 2)$ is applied to the points $0, 2, 3, 6$ of a line. Where do they go, where does $-2$ go, and what happens to the cross-ratio?',
      steps: [
        { text: 'Substituting,', tex: '0 \\to 0,\\quad 2 \\to \\frac{4}{4} = 1,\\quad 3 \\to \\frac{6}{5} = 1.2,\\quad 6 \\to \\frac{12}{8} = 1.5.' },
        'The point $x = -2$ makes the denominator zero: it goes to infinity. And $x = \\infty$ goes to $2$: infinity has a finite image, the vanishing point of the line.',
        'Cross-ratios: $(0, 2; 3, 6) = \\dfrac{3 \\cdot 4}{1 \\cdot 6} = 2$ and $(0, 1; 1.2, 1.5) = \\dfrac{1.2 \\times 0.5}{0.2 \\times 1.5} = 2$.'
      ],
      a: 'The points go to 0, 1, 1.2, 1.5; −2 goes to infinity; the cross-ratio, 2, is unchanged.'
    }
  ],
  quiz: [
    { q: 'In the projective plane two different lines meet in', choices: ['exactly one point (possibly at infinity)', 'at most one point', 'two points or none', 'no point if they are parallel'], a: 0, why: 'With the line at infinity every pair of lines has exactly one common point; parallels meet at the point at infinity of their direction.' },
    { q: 'How many pairs of corresponding points (no three on a line) determine a projective map of the plane?', answer: 4, why: 'A 3 × 3 matrix up to a factor has 8 free numbers, and each pair of points gives 2 equations: 4 pairs.' },
    { q: 'A projective map of the plane always keeps parallel lines parallel.', a: false, why: 'Only affine maps do. A general projective map sends two parallels to lines that meet at a finite point (a point of the horizon).' },
    { q: 'Desargues\' theorem: if two triangles are in perspective from a point, they are also in perspective from', choices: ['a line', 'a circle', 'a second point', 'a plane'], a: 0, why: 'The three points where corresponding sides meet lie on one line, the Desargues line.' },
    { q: 'The dual of "three points lie on one line" is', choices: ['three lines pass through one point (are concurrent)', 'three lines are parallel', 'three points are distinct', 'three lines form a triangle'], a: 0, why: 'Exchanging the words point and line, and "lies on" with "passes through", gives concurrency of three lines.' }
  ],
  applications: [
    'Rectifying photographs: four known corners fix the 3 × 3 map that turns a skewed photograph of a page, a façade or a sports pitch into a plan.',
    'Perspective and architecture: every drawing method with vanishing points and a horizon is an instance of sending the line at infinity to a finite line.',
    'Computer vision and robotics: homographies relate two views of a plane; further projective objects (the fundamental matrix) relate two views of anything.',
    'Projectors and keystone correction: a tilted projector throws a trapezium, and the pre-warp is the inverse homography.',
    'Maps: the gnomonic projection is a central projection from the centre of the globe, so every great circle (a plane through the centre) comes out as a straight line.'
  ],
  history: 'Girard Desargues founded the subject in 1639; it was nearly forgotten (Pascal and La Hire were among its few readers) until Jean-Victor Poncelet, an officer taken prisoner at the retreat from Moscow in 1812, rebuilt it from memory in captivity at Saratov and published the *Traité des propriétés projectives des figures* in 1822. Von Staudt removed the last measurement from it in 1847, and Klein\'s Erlangen programme of 1872 set it at the head of the geometries.',
  sources: [
    'H. S. M. Coxeter, *Projective Geometry* (2nd ed.).',
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2.',
    'J.-V. Poncelet, *Traité des propriétés projectives des figures* (1822).',
    'F. Klein, *Vergleichende Betrachtungen über neuere geometrische Forschungen* (the Erlangen programme, 1872).'
  ],
  sim: 'pm-desargues-lab',
  construction: 'pm-desargues'
}

);
