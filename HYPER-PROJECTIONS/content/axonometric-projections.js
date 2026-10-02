/* HYPER-PROJECTIONS · content/axonometric-projections.js
 * The axonometric family (the isometric projection itself is the reference page in reference.js):
 *   axonometric-projection, isometric-drawing, isometric-circles, dimetric-projection, trimetric-projection,
 *   axonometric-scales (with Pohlke's theorem), exploded-and-cutaway.
 */
Hyper.add(
{
  id: 'axonometric-projection',
  parent: 'axonometric-projections',
  title: 'Axonometric projection',
  level: 1,
  short: 'Turn the object so that none of its three principal axes is square to the picture plane, project it with perpendicular projectors, and three faces show at once. Each axis is shortened by its own scale; how the three scales compare gives the isometric, the dimetric and the trimetric picture.',
  keywords: ['axonometric', 'isometric', 'dimetric', 'trimetric', 'foreshortening', 'scale', 'pictorial', 'trace triangle', 'parallel projection', 'axes'],
  prereq: ['orthographic-projection', 'rotation-matrices', 'parallel-vs-central'],
  related: ['isometric-projection', 'dimetric-projection', 'trimetric-projection', 'axonometric-scales', 'oblique-projection', 'the-projection-matrix'],
  body: `An orthographic view looks straight at one face and sees the others edge-on. Turn the object so that **none** of its three principal axes is square to the picture plane, keep the projectors perpendicular to the plane, and three faces appear together. That is an *axonometric* projection (Greek *axon*, axis, and *metron*, measure: "measured along the axes"). It is still a **parallel** projection: parallels stay parallel and a length along one direction is multiplied by one fixed factor — but now each of the three axes has **its own** factor, its scale.

### The matrix
Turn the object by $\\beta$ about the vertical axis, tilt it by $\\alpha$ about the horizontal one, and let the depth drop out:
$$M = \\begin{bmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&0\\\\0&0&0&1\\end{bmatrix}\\begin{bmatrix}1&0&0&0\\\\0&\\cos\\alpha&-\\sin\\alpha&0\\\\0&\\sin\\alpha&\\cos\\alpha&0\\\\0&0&0&1\\end{bmatrix}\\begin{bmatrix}\\cos\\beta&0&-\\sin\\beta&0\\\\0&1&0&0\\\\ \\sin\\beta&0&\\cos\\beta&0\\\\0&0&0&1\\end{bmatrix}.$$
Multiplied out, the first two rows give the paper coordinates and the third row (kept only to decide what hides what) the depth:
$$\\begin{bmatrix}x'\\\\y'\\end{bmatrix} = \\begin{bmatrix}\\cos\\beta & 0 & -\\sin\\beta\\\\ -\\sin\\alpha\\sin\\beta & \\cos\\alpha & -\\sin\\alpha\\cos\\beta\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\z\\end{bmatrix}.$$
Each **column** is the picture of one axis: its length is that axis's scale, its direction the angle it makes on the paper,
$$s_x^2 = \\cos^2\\beta + \\sin^2\\alpha\\sin^2\\beta,\\qquad s_y = \\cos\\alpha,\\qquad s_z^2 = \\sin^2\\beta + \\sin^2\\alpha\\cos^2\\beta .$$
Two laws follow. The first two rows of a rotation matrix are unit vectors, so $s_x^2 + s_y^2 + s_z^2 = 2$ for **every** axonometric picture. And the two receding axes, at angles $\\theta_x$ and $\\theta_z$ to the horizontal, obey $\\tan\\theta_x\\tan\\theta_z = \\sin^2\\alpha$.

### Three kinds
If the three scales are equal the picture is **isometric** ($\\alpha = 35.26°$, $\\beta = 45°$, all scales $0.8165$). If two are equal it is **dimetric**: the common drawing-office one has scales $0.943 : 0.943 : 0.471$, that is $1 : 1 : \\tfrac12$. If all three differ it is **trimetric**, the general case: for axes at 15° and 45° the scales are $0.919$, $0.856$ and $0.650$. See [[isometric-projection]], [[dimetric-projection]] and [[trimetric-projection]].

### Where the axes come from
Slice the corner off the cube with the picture plane: the cut is a triangle $ABC$, and looking straight at it you see it in true shape with the corner $O'$ at its orthocentre, because each edge of the cube is perpendicular to the opposite side of the cut. So **the three axes of the picture are the altitudes of an acute triangle**, and the triangle's shape fixes the kind: equilateral gives the isometric, isosceles the dimetric, scalene the trimetric. The construction below draws it, and [[axonometric-scales]] reads the scales off the same triangle.

### What it keeps and what it loses
Lengths along an axis can be measured with that axis's scale. Angles are not kept (a cube's right angle shows as 120° in the isometric) and **circles become ellipses**: the circle in the face perpendicular to the axis of scale $s$ has its minor axis along the picture of that axis and a minor-to-major ratio $\\sqrt{1 - s^2}$. Nothing shrinks with distance: a far box and a near one look equally large.

> [!tip] At the board the draughtsman skips the multiplication: he lays off true lengths and accepts a picture larger by the same factor on all axes — a *drawing* rather than a *projection*. The shape is identical.`,
  ideas: [
    'Turn the object so no axis is square to the picture plane and project perpendicularly: three faces show, each axis shortened by its own scale.',
    'The matrix is two rotations (α about the horizontal, β about the vertical) and a drop of the depth; the columns of its 2 × 3 part are the three axes on paper.',
    'For every axonometric picture the squares of the three scales add up to 2, and tan θx · tan θz = sin² α.',
    'All three equal is isometric, two equal is dimetric, all different is trimetric; the three axes are the altitudes of an equilateral, isosceles or scalene triangle.',
    'Circles become ellipses with minor/major √(1 − s²), s being the scale of the axis perpendicular to the circle\'s plane.'
  ],
  pitfalls: [
    'Axonometric means isometric — Isometric is the one case with three equal scales. Dimetric and trimetric pictures are just as axonometric, and for many objects they look better.',
    'The major axis of an ellipse lies along the receding axis — It is the minor axis that lies along the picture of the axis perpendicular to the face; the major axis is perpendicular to that.',
    'Angles of the object keep their size — Only the faces parallel to the picture plane would; in an axonometric picture a right angle shows as 120° and 60° (isometric) or as some other pair.'
  ],
  formulas: [
    {
      name: 'Foreshortening of the x axis',
      expr: 'sx = sqrt(cos(beta)^2 + sin(alpha)^2*sin(beta)^2)',
      tex: 's_x = \\sqrt{\\cos^2\\beta + \\sin^2\\alpha\\,\\sin^2\\beta}',
      vars: {
        sx: { name: 'scale of the x axis', tex: 's_x' },
        alpha: { name: 'tilt about the horizontal', q: 'angle', unit: '°', value: 35.264, min: 0, max: 90 },
        beta: { name: 'turn about the vertical', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'sx',
      note: 'The vertical axis has the scale cos α and the third axis follows from the sum rule. For α = 35.26°, β = 45° all three come out 0.8165.'
    },
    {
      name: 'The two receding axes and the tilt',
      expr: 'tan(thx)*tan(thz) = sin(alpha)^2',
      tex: '\\tan\\theta_x\\,\\tan\\theta_z = \\sin^2\\alpha',
      vars: {
        thx: { name: 'angle of the right axis to the horizontal', q: 'angle', unit: '°', value: 15, min: 0.5, max: 89, tex: '\\theta_x' },
        thz: { name: 'angle of the left axis to the horizontal', q: 'angle', unit: '°', value: 45, min: 0.5, max: 89, tex: '\\theta_z' },
        alpha: { name: 'tilt', q: 'angle', unit: '°', min: 0, max: 90 }
      },
      solveFor: 'alpha',
      note: 'Choose the two axis angles you like and the tilt follows (the product of the tangents must be below 1). 15° and 45° give α = 31.17°; 30° and 30° give the isometric α = 35.26°.'
    },
    {
      name: 'The third scale from the other two',
      expr: 'sz = sqrt(2 - sx^2 - sy^2)',
      tex: 's_z = \\sqrt{2 - s_x^2 - s_y^2}',
      vars: {
        sz: { name: 'scale of the third axis', tex: 's_z' },
        sx: { name: 'scale of the first axis', value: 0.9428, min: 0, max: 1, tex: 's_x' },
        sy: { name: 'scale of the second axis', value: 0.9428, min: 0, max: 1, tex: 's_y' }
      },
      solveFor: 'sz',
      note: 'Valid for any orthographic axonometric picture: the sum of the squares of the three scales is 2. Two scales of 0.943 force the third to be 0.471.'
    },
    {
      name: 'Ellipse of a circle in a face',
      expr: 'rho = sqrt(1 - s^2)',
      tex: '\\rho = \\sqrt{1 - s^2}',
      vars: {
        rho: { name: 'minor axis / major axis of the ellipse', tex: '\\rho' },
        s: { name: 'scale of the axis perpendicular to the face', value: 0.8165, min: 0, max: 1, tex: 's' }
      },
      solveFor: 'rho',
      note: 'Isometric: 0.577 on all three faces. Dimetric 1 : 1 : ½: 0.333 on the two faces whose normal has scale 0.943 and 0.882 on the face whose normal has scale 0.471. The major axis always equals the true diameter of the circle.'
    }
  ],
  examples: [
    {
      title: 'The scales of the isometric picture from the matrix',
      q: 'Show that α = 35.264°, β = 45° give three equal scales, and that they obey the sum rule.',
      steps: [
        { text: 'Use the formulas with $\\sin^2\\alpha = \\tfrac13$ (since $\\alpha = \\arctan(1/\\sqrt 2)$) and $\\sin^2\\beta = \\cos^2\\beta = \\tfrac12$:', tex: 's_x^2 = \\tfrac12 + \\tfrac13\\cdot\\tfrac12 = \\tfrac23,\\qquad s_z^2 = \\tfrac12 + \\tfrac13\\cdot\\tfrac12 = \\tfrac23 .' },
        { text: 'The vertical axis: $\\cos^2\\alpha = 1 - \\tfrac13 = \\tfrac23$.', tex: 's_y^2 = \\tfrac23 .' },
        'So all three are $\\sqrt{2/3} = 0.8165$, and $s_x^2 + s_y^2 + s_z^2 = 3 \\times \\tfrac23 = 2$ as the sum rule requires. The receding axes: $\\tan\\theta_x \\tan\\theta_z = \\sin^2\\alpha = \\tfrac13$, and with equal angles $\\tan\\theta = 1/\\sqrt3$, $\\theta = 30°$.'
      ],
      a: 'Scales 0.8165 on all three axes, sum of squares 2, receding axes at 30°.'
    },
    {
      title: 'Reading a dimetric picture',
      q: 'A drawing has its receding axes at 7.18° and 41.41° to the horizontal and a vertical third axis. Find the tilt α, the turn β and the three scales.',
      steps: [
        { text: 'The tilt from the product of the tangents:', tex: '\\sin^2\\alpha = \\tan 7.18°\\,\\tan 41.41° = 0.1260 \\times 0.8819 = 0.1111 \\;\\Rightarrow\\; \\sin\\alpha = \\tfrac13,\\ \\alpha = 19.47° .' },
        { text: 'The turn from $\\tan\\theta_x = \\sin\\alpha\\tan\\beta$:', tex: '\\tan\\beta = 0.1260 \\times 3 = 0.378 \\;\\Rightarrow\\; \\beta = 20.70° .' },
        'The scales: $s_y = \\cos 19.47° = 0.943$; $s_x^2 = \\cos^2\\beta + \\sin^2\\alpha\\sin^2\\beta = 0.875 + 0.111 \\times 0.125 = 0.889$, so $s_x = 0.943$; and $s_z = \\sqrt{2 - 0.889 - 0.889} = 0.471$.'
      ],
      a: 'α = 19.47°, β = 20.70°, scales 0.943 : 0.943 : 0.471 = 1 : 1 : ½ — the standard dimetric.'
    }
  ],
  quiz: [
    { q: 'Which statement holds for **every** orthographic axonometric picture?', choices: ['The three axes are foreshortened by the same factor', 'The squares of the three scales add up to 2', 'A circle in any face stays a circle', 'The three axes are 120° apart on the paper'], a: 1, why: 'The first two rows of the rotation matrix are unit vectors, so the six entries have squares summing to 2 — whatever α and β are. Equal scales and 120° belong to the isometric only, and circles become ellipses in every case.' },
    { q: 'Two axes of an axonometric picture have scales 0.90 and 0.80. What is the scale of the third?', answer: 0.742, why: '$s_z = \\sqrt{2 - 0.81 - 0.64} = \\sqrt{0.55} = 0.742$.' },
    { q: 'A circle drawn in a face of the object always appears as a circle in an axonometric picture.', a: false, why: 'It is a circle only if the face is parallel to the picture plane, and in an axonometric picture no face is. The image is an ellipse with minor/major $= \\sqrt{1 - s^2}$.' },
    { q: 'The three axes of an isometric picture are the altitudes of a triangle. That triangle is', choices: ['right-angled', 'equilateral', 'isosceles with a 90° apex', 'any acute triangle'], a: 1, why: 'Equal scales mean equal intercepts of the picture plane on the three axes, so the cut is equilateral and its altitudes are 120° apart.' },
    { q: 'In a dimetric picture one scale is 0.943. How flat is the ellipse of a circle in the face perpendicular to that axis (minor/major)?', answer: 0.333, why: '$\\sqrt{1 - 0.943^2} = \\sqrt{1 - 0.889} = 0.333$: a very flat ellipse, three times as long as it is wide.' }
  ],
  applications: [
    'Exploded views and parts catalogues: three faces of every part in one picture, with the shapes of the parts still measurable along the axes.',
    'Patent drawings and assembly instructions, where one picture must show how a thing is built without a trained reader.',
    'The default "3-D view" of CAD programs and the pictorial views of games and maps, which are axonometric because parallel lines must stay parallel.',
    'Architectural studies since the nineteenth century: Choisy drew whole buildings in axonometric from below, and the de Stijl architects used it to show space as an assembly of planes.'
  ],
  history: 'William Farish of Cambridge published the isometric picture in 1822 as a way of drawing machines. The general theory belongs to German geometry: Julius Weisbach of the Freiberg mining academy described the "monodimetric" and "anisometric" (dimetric and trimetric) pictures in 1844, Karl Pohlke stated his fundamental theorem in the 1850s and published it in 1860, and Hermann Amandus Schwarz proved it in 1864. Auguste Choisy used axonometric drawings in his *Histoire de l\'architecture* (1899) to show buildings as a builder sees them.',
  sources: ['ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.', 'William Farish, On Isometrical Perspective, Transactions of the Cambridge Philosophical Society, 1822.', 'Julius Weisbach, Die monodimetrische und anisometrische Projections-Methode (Freiberg, 1844).', 'Karl Pohlke, Darstellende Geometrie (Berlin, 1860).'],
  sim: 'ax-lab',
  construction: 'ax-trace-triangle'
},

{
  id: 'isometric-drawing',
  parent: 'axonometric-projections',
  title: 'Isometric drawing (full scale)',
  level: 1,
  short: 'The draughtsman\'s isometric: the axes at 30°, every length along them laid off at its true value. It is the isometric projection enlarged by 1.2247 — the same shape, but you measure with an ordinary scale.',
  keywords: ['isometric drawing', 'isometric scale', 'boxing in', 'offset method', 'non-isometric lines', '30 degree set square', 'full scale', 'pictorial'],
  prereq: ['isometric-projection', 'axonometric-projection', 'line-conventions'],
  related: ['isometric-circles', 'exploded-and-cutaway', 'dimetric-projection', 'technical-illustration', 'oblique-projection'],
  body: `In the true isometric projection every length is shortened to 0.8165, which means a 100 mm edge would have to be drawn 81.65 mm long. No-one wants to multiply every dimension, so the drawing office makes an **isometric drawing**: the axes are drawn exactly as in the projection — the vertical, and two lines at 30° to the horizontal — but lengths along them are laid off **true**. The picture is the projection enlarged by $1/0.8165 = 1.2247$; the shape is the same, and a straightforward scale and a pair of dividers do all the measuring.

### Isometric lines and the rest
A line parallel to one of the three axes is an *isometric line*: it is drawn at its true length from the true length. A line in any other direction (a diagonal, a slope, a chamfer) is **not** — it has a different foreshortening and its angle on the paper is not the angle in space. A 45° chamfer is therefore never drawn with a 45° set square: its two **ends** are located by measuring along the axes, and the line is joined last. The same goes for circles, which become ellipses ([[isometric-circles]]).

### Boxing in
Almost every isometric drawing starts from the **enclosing box**. Draw the three axes from the lowest corner, lay off the overall length, width and height with the dividers, and complete the box with parallels. Then cut things away: mark the position of a slot or a step by measuring along the box edges, draw parallels through the marks, and line in only what remains. For an inclined face, box in the whole piece, then find the corners of the sloping edge by their coordinates along the axes ($x$, $y$, $z$ from the box corner). For an irregular outline, the **offset method**: a grid of lines parallel to the axes, and the offsets measured from them.

### Sheet planning
The overall size of an isometric drawing of a box $L \\times W \\times H$ is
$$\\text{width} = (L + W)\\cos 30° = 0.866\\,(L + W),\\qquad \\text{height} = \\tfrac12 (L + W) + H,$$
since each of the two base edges climbs $\\sin 30° = \\tfrac12$ of its length. A point at distances $x$ and $z$ from the near corner of the top face lies $(x - z)\\cos 30°$ to the right and $\\tfrac12 (x + z)$ above it — which is how the centre of a hole is placed.

### Conventions
Hidden lines are normally left out of a pictorial (the drawing is for reading, not for making). Centre lines are dash-dot, drawn parallel to the axes. Dimension lines are drawn parallel to the isometric axis they measure, with the extension lines in an isometric direction too. For a section, the cut faces are hatched at an angle chosen so that the hatching is clearly not parallel to the outlines.

> [!tip] Isometric grid paper has all three directions printed: lay a sheet of tracing paper over it and an isometric drawing needs no set square at all. At a drawing board, the 30°–60° set square on the T-square gives both receding axes and the vertical.`,
  ideas: [
    'An isometric drawing lays off true lengths on axes at 30°; it is the isometric projection enlarged 1.2247 times, with the same shape.',
    'Only lines parallel to an axis are isometric lines; anything else — a diagonal, a chamfer — is found from the coordinates of its ends.',
    'Start with the enclosing box, then cut away: mark slots and holes by measuring along the box edges.',
    'The drawing of an L × W × H box is 0.866 (L + W) wide and (L + W)/2 + H high.',
    'Hidden lines are left out of a pictorial; centre lines and dimension lines run parallel to the axes.'
  ],
  pitfalls: [
    'A 45° bevel is drawn at 45° — Angles are not true in an isometric drawing. Locate both ends of the bevel by measuring along the axes, then join them.',
    'The diagonal of the top face is as long as it is in space — A square of side 100 has a true diagonal of 141 mm, but on an isometric drawing the diagonal from the near corner to the far one is vertical and 100 mm long (and the other diagonal 173 mm).',
    'The isometric drawing and the isometric projection are different shapes — They are the same shape. The drawing is simply 22 % larger, which is why it can be measured with an ordinary scale.'
  ],
  formulas: [
    {
      name: 'Width of an isometric drawing of a box',
      expr: 'Wd = sqrt(3)/2*(L + Wb)',
      tex: 'W_d = \\frac{\\sqrt3}{2}\\,(L + W_b)',
      vars: {
        Wd: { name: 'width of the drawing', q: 'length', unit: 'mm', tex: 'W_d' },
        L: { name: 'length of the box (right axis)', q: 'length', unit: 'mm', value: 120 },
        Wb: { name: 'width of the box (left axis)', q: 'length', unit: 'mm', value: 70, tex: 'W_b' }
      },
      solveFor: 'Wd',
      note: 'Both base edges climb at 30°, so each contributes its length times cos 30°.'
    },
    {
      name: 'Height of an isometric drawing of a box',
      expr: 'Hd = (L + Wb)/2 + Hb',
      tex: 'H_d = \\frac{L + W_b}{2} + H_b',
      vars: {
        Hd: { name: 'height of the drawing', q: 'length', unit: 'mm', tex: 'H_d' },
        L: { name: 'length of the box', q: 'length', unit: 'mm', value: 120 },
        Wb: { name: 'width of the box', q: 'length', unit: 'mm', value: 70, tex: 'W_b' },
        Hb: { name: 'height of the box', q: 'length', unit: 'mm', value: 24, tex: 'H_b' }
      },
      solveFor: 'Hd',
      note: 'The two base edges rise by half their length each (sin 30° = ½), and the vertical edge is laid off true.'
    },
    {
      name: 'Where a point of the top face falls on the paper',
      expr: 'dx = (x - z)*sqrt(3)/2',
      tex: '\\Delta x = (x - z)\\,\\frac{\\sqrt3}{2}',
      vars: {
        dx: { name: 'distance to the right of the near corner of the face', q: 'length', unit: 'mm', signed: true, tex: '\\Delta x' },
        x: { name: 'distance along the right axis', q: 'length', unit: 'mm', value: 38 },
        z: { name: 'distance along the left axis', q: 'length', unit: 'mm', value: 35 }
      },
      solveFor: 'dx',
      note: 'The vertical offset is (x + z)/2. A point with x = z lies straight above the corner: the vertical diagonal.'
    }
  ],
  examples: [
    {
      title: 'A plate on a sheet',
      q: 'A plate 120 × 70 × 24 mm is drawn as an isometric drawing at full scale. What area of paper does it need?',
      steps: [
        { text: 'The width of the drawing:', tex: 'W_d = 0.866 \\times (120 + 70) = 164.5\\ \\text{mm}.' },
        { text: 'The height of the drawing:', tex: 'H_d = \\tfrac12(120 + 70) + 24 = 95 + 24 = 119\\ \\text{mm}.' },
        'So the picture fits a rectangle 165 × 119 mm — comfortably on an A5 sheet, or at 1 : 1 on A4 with room for the dimensions. As a true projection the same plate would be $0.8165$ times these sizes: 134 × 97 mm.'
      ],
      a: '164.5 mm wide and 119 mm high.'
    },
    {
      title: 'Placing the centre of a hole',
      q: 'The hole in the plate has its centre 38 mm from the left face and 35 mm from the front face, measured on the top surface. Where is it on the paper relative to the near corner of the top face?',
      steps: [
        { text: 'The horizontal offset:', tex: '\\Delta x = (38 - 35)\\cos 30° = 3 \\times 0.866 = 2.6\\ \\text{mm to the right}.' },
        { text: 'The vertical offset:', tex: '\\Delta y = \\tfrac12 (38 + 35) = 36.5\\ \\text{mm above}.' },
        'Draw it with the dividers: mark 38 along the right edge and 35 along the left, then draw the centre lines parallel to the axes through the marks; they meet at the same point.'
      ],
      a: '2.6 mm to the right and 36.5 mm above the near corner of the top face.'
    }
  ],
  quiz: [
    { q: 'A line parallel to the right-hand isometric axis is 80 mm long in space. In a full-scale isometric drawing it is drawn', choices: ['65.3 mm', '80 mm', '98 mm', '69.3 mm'], a: 1, why: 'An isometric drawing lays off true lengths along the axes. (65.3 mm would be the true projection.)' },
    { q: 'The diagonal of a 100 mm square top face, from the near corner to the far corner, is drawn how long in an isometric drawing (mm)?', answer: 100, why: 'The far corner is at $x = z = 100$: it lies $\\tfrac12(100 + 100) = 100$ mm straight above the near corner. The true diagonal is 141 mm — diagonals are not isometric lines.' },
    { q: 'Angles are drawn true in an isometric drawing.', a: false, why: 'A right angle of a face is drawn as 120° or 60°. That is why a chamfer is found from the coordinates of its ends, never with a protractor.' },
    { q: 'How much larger is an isometric drawing than the isometric projection of the same object?', choices: ['The same size', 'About 22 % larger', 'About 41 % larger', 'About 8 % larger'], a: 1, why: 'The factor is $1/0.8165 = 1.2247$, so 22 % in every direction.' },
    { q: 'What do you do first when drawing an object with a slot and a hole in isometric?', choices: ['Draw the ellipse of the hole', 'Draw the enclosing box with the overall dimensions', 'Draw the slot', 'Draw the hidden lines'], a: 1, why: 'Boxing in gives the three axes and the overall size; every feature is then located by measuring along the box edges.' }
  ],
  applications: [
    'Piping and ductwork drawings: a run of pipe with bends and fittings is shown with all three directions measurable.',
    'Assembly and maintenance manuals, where an isometric of the whole part is dimensioned along its axes.',
    'Furniture, joinery and packaging sketches made in minutes at the board or on isometric grid paper.',
    'Technical textbooks, where the same drawing shows a solid and its sections together.'
  ],
  history: 'Farish\'s method, simplified to laying off true lengths, was taught in engineering schools through the nineteenth century, and the 30°-60° set square made it the quick pictorial of the drawing office. Isometric grid paper and later the first CAD packages carried the habit on; the "isometric" view of today\'s CAD systems still has its axes at 30°.',
  sources: ['William Farish, On Isometrical Perspective, Transactions of the Cambridge Philosophical Society, 1822.', 'ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on pictorial drawing.'],
  sim: { id: 'ax-lab', params: { preset: 'iso' } },
  construction: ['ax-iso-block', 'ax-iso-scale']
},

{
  id: 'isometric-circles',
  parent: 'axonometric-projections',
  title: 'Circles in isometric: the four-centre ellipse',
  level: 2,
  short: 'A circle in an isometric face becomes an ellipse. With four arcs of a compass, centred on the corners and on the long diagonal of the isometric square, it is drawn in minutes and touches the square exactly where the true ellipse does.',
  keywords: ['four-centre ellipse', 'isometric circle', 'isometric ellipse', 'ellipse template', '35 degree ellipse', 'hole', 'cylinder', 'compass'],
  prereq: ['isometric-drawing', 'isometric-projection', 'math:ellipse'],
  related: ['axonometric-projection', 'oblique-circles', 'exploded-and-cutaway', 'circles-in-perspective'],
  body: `A circle of diameter $D$ lies in a face of a cube; the cube's face becomes an isometric square (a rhombus with 60° and 120° corners) and the circle becomes an **ellipse** inscribed in it, touching its four sides at their midpoints. In the true projection the major axis equals $D$ and the minor axis is $D/\\sqrt3 = 0.577\\,D$; in the full-scale drawing, which is $1.2247$ times larger, the axes are $1.2247\\,D$ and $0.7071\\,D$. The minor axis always lies along the picture of the axis perpendicular to the face.

### The four-centre construction
No-one draws an ellipse point by point if a compass will do. Take the isometric square of side $D$ round the circle and halve its sides. From each **obtuse corner** (120°) draw lines to the midpoints of the two far sides: these are perpendicular to the sides they meet. The obtuse corners are two of the four centres; the other two are where the lines cross each other, on the long diagonal. The two large arcs, centred on the obtuse corners, and the two small ones, centred on the crossings, meet at the midpoints with the right tangents — the curve is smooth. Measured from the exact geometry:
$$R = \\frac{\\sqrt3}{2}\\,D = 0.866\\,D,\\qquad r = \\frac{R}{3} = \\frac{\\sqrt3}{6}\\,D = 0.289\\,D,$$
and the small centres lie $0.289\\,D$ from the middle of the square on the long diagonal.

### How good is it?
It is an approximation. The four-centre curve is $\\tfrac{2}{\\sqrt3}D = 1.155\\,D$ long and $(\\sqrt3 - 1)D = 0.732\\,D$ high, against the true $1.225\\,D$ and $0.707\\,D$: about 6 % short in length and 3 % tall in height, and never more than about 3 % of $D$ from the true curve. It is smooth, it touches the square at the right four points, and in a drawing at the scale of a sheet of paper the difference is a hair. For better work use an **ellipse template**: the isometric one is the 35° ellipse (strictly 35°16′, because the ratio $0.577$ is the sine of that angle), or draw eight or twelve points with the offset method.

### Cylinders and holes
A circle in each of the three faces needs the square turned to match, but the arcs and radii are the same. A **cylinder** is two ellipses one height apart, joined by the two lines that touch both: move the four centres down by the height and draw the lower arcs with the same radii, but only the front half, because the rest is hidden. A **hole** shows its upper rim as a full ellipse and the lower rim only where it falls inside the upper one — a crescent for a thin plate, nothing for a deep hole.

> [!warn] The ellipses of the three faces are the same ellipse turned: top face, major axis horizontal; the two vertical faces, major axes at 60° and 120°, always perpendicular to the isometric axis normal to the face. Draw a vertical-face circle with the square turned, not with the horizontal one.`,
  ideas: [
    'A circle in an isometric face is an ellipse inscribed in the isometric square: minor/major 0.577, major axis 1.2247 D in the drawing.',
    'The four-centre curve uses two large arcs (R = 0.866 D) about the obtuse corners and two small ones (r = R/3) about the crossings on the long diagonal.',
    'It is smooth and touches the square at the true points, but it is about 6 % too short on the major axis; an ellipse template does better.',
    'A cylinder is the ellipse carried down by the height with only the front half visible, plus two tangent lines.',
    'The minor axis of every isometric ellipse lies along the isometric axis perpendicular to its face.'
  ],
  pitfalls: [
    'The ellipse is the circle squashed vertically — Only on the top face. The ellipses of the two vertical faces are tilted: their major axes are perpendicular to the isometric axis normal to the face, at 60° and 120° to the horizontal.',
    'Use the horizontal rhombus for every face — Each face has its own isometric square, turned to its two axes; the construction is identical but the rhombus is not.',
    'The four-centre ellipse is the true ellipse — It is a smooth approximation, 6 % short on the major axis; for exact work use a template or point-by-point construction.'
  ],
  formulas: [
    {
      name: 'Large radius of the four-centre ellipse',
      expr: 'R = D*sqrt(3)/2',
      tex: 'R = \\frac{\\sqrt3}{2}\\,D',
      vars: {
        R: { name: 'radius of the two large arcs', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the circle', q: 'length', unit: 'mm', value: 60 }
      },
      solveFor: 'R',
      note: 'The distance from an obtuse corner of the isometric square to the midpoint of a far side. For D = 60 mm: 52.0 mm.'
    },
    {
      name: 'Small radius of the four-centre ellipse',
      expr: 'r = D*sqrt(3)/6',
      tex: 'r = \\frac{\\sqrt3}{6}\\,D',
      vars: {
        r: { name: 'radius of the two small arcs', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the circle', q: 'length', unit: 'mm', value: 60 }
      },
      solveFor: 'r',
      note: 'Exactly one third of the large radius: R = 3r. For D = 60 mm: 17.3 mm.'
    },
    {
      name: 'Length of the four-centre ellipse',
      expr: 'w = 2*D/sqrt(3)',
      tex: 'w = \\frac{2D}{\\sqrt3}',
      vars: {
        w: { name: 'length of the curve along the long diagonal', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the circle', q: 'length', unit: 'mm', value: 60 }
      },
      solveFor: 'w',
      note: '1.155 D, against the true 1.2247 D (drawing). The height of the curve is (√3 − 1) D = 0.732 D, against the true 0.7071 D.'
    },
    {
      name: 'Ellipse ratio from the scale of the face normal',
      expr: 'rho = sqrt(1 - s^2)',
      tex: '\\rho = \\sqrt{1 - s^2}',
      vars: {
        rho: { name: 'minor axis / major axis', tex: '\\rho' },
        s: { name: 'scale of the axis perpendicular to the face', value: 0.8165, min: 0, max: 1 }
      },
      solveFor: 'rho',
      note: 'The same formula serves every axonometric picture: 0.577 for isometric, 0.333 and 0.882 for the 1 : 1 : ½ dimetric.'
    }
  ],
  examples: [
    {
      title: 'A hole of diameter 60',
      q: 'Draw a hole of diameter 60 mm in the top face of a plate in an isometric drawing. What are the radii of the four arcs and how large is the curve? Compare with the true ellipse.',
      steps: [
        { text: 'The radii:', tex: 'R = 0.866 \\times 60 = 52.0\\ \\text{mm},\\qquad r = R/3 = 17.3\\ \\text{mm}.' },
        { text: 'The extent of the four-centre curve:', tex: 'w = 1.155 \\times 60 = 69.3\\ \\text{mm},\\quad h = 0.732 \\times 60 = 43.9\\ \\text{mm}.' },
        'The true ellipse of the drawing would be $1.2247 \\times 60 = 73.5$ mm by $0.7071 \\times 60 = 42.4$ mm: the compass curve is 4 mm short and 1.5 mm tall — for a hole of this size that is within the width of a pencil line.'
      ],
      a: 'Arcs of 52.0 mm and 17.3 mm; the curve is 69.3 × 43.9 mm (true ellipse 73.5 × 42.4).'
    },
    {
      title: 'A cylinder of diameter 40 and height 70',
      q: 'A vertical cylinder, diameter 40 mm and height 70 mm, stands on a plate in isometric. How tall is the drawing of the cylinder, from the top of its upper ellipse to the bottom of the lower one?',
      steps: [
        'The ellipse is $0.732 \\times 40 = 29.3$ mm high, and the lower ellipse is the upper one carried straight down by the height 70 mm.',
        'The total height from top to bottom is therefore the height 70 plus one ellipse height: $70 + 29.3 = 99.3$ mm. The sides are two verticals 70 mm long through the extreme points of the ellipses, 46.2 mm apart ($1.155 \\times 40$).'
      ],
      a: 'About 99 mm high and 46 mm wide.'
    }
  ],
  quiz: [
    { q: 'In the four-centre construction the large radius is how many times the small one?', answer: 3, why: '$R = \\sqrt3 D/2$ and $r = \\sqrt3 D/6$: exactly three times.' },
    { q: 'The ellipse of a circle in the top face of an isometric drawing has its major axis', choices: ['horizontal', 'vertical', 'along the right-hand axis', 'at 60° to the horizontal'], a: 0, why: 'The minor axis lies along the picture of the axis perpendicular to the face — the vertical — so the major axis is horizontal.' },
    { q: 'A circle in the vertical face that contains the vertical axis and the left-hand (30°) axis has its major axis', choices: ['horizontal', 'vertical', 'perpendicular to the right-hand axis (at 120°)', 'parallel to the left-hand axis'], a: 2, why: 'The axis perpendicular to that face is the right-hand axis. The minor axis lies along its picture, so the major axis is perpendicular to it.' },
    { q: 'The four-centre ellipse is exactly the true ellipse of the projected circle.', a: false, why: 'It is a smooth approximation: 1.155 D by 0.732 D instead of 1.225 D by 0.707 D. It touches the isometric square at the correct four points.' },
    { q: 'Why is only the front half of the lower rim of a cylinder drawn?', choices: ['The rear half is the same as the front', 'The rear half is hidden by the cylinder itself', 'The rear half is not an ellipse', 'It is a convention of ISO 128'], a: 1, why: 'Seen from above, the near half of the base is visible below the body and the far half is behind it.' }
  ],
  applications: [
    'Every isometric drawing with a hole, a pipe or a pulley: the four-centre ellipse is the standard hand method.',
    'Technical illustration of bolts, shafts and bearings, where a cylinder is two ellipses and two tangents.',
    'Isometric templates: the 35° ellipse of every set of drawing templates is the isometric circle at a standard set of sizes.',
    'Exploded views, where each round part is a stack of such ellipses on one axis ([[exploded-and-cutaway]]).'
  ],
  history: 'Replacing an ellipse by arcs of a few circles is an old compass method of mason and joiner (the basket-handle arch is drawn so). The isometric version came with the isometric drawing in the nineteenth century, and the 35° ellipse template with the plastic drawing stencil of the twentieth.',
  sources: ['French, Vierck and Foster, Engineering Drawing and Graphic Technology, the section on isometric circles.', 'Thomas E. French and Charles J. Vierck, A Manual of Engineering Drawing for Students and Draftsmen (1911 and later editions).'],
  sim: { id: 'ax-lab', params: { preset: 'iso' } },
  construction: ['isometric-circle', 'ax-iso-cylinder']
},

{
  id: 'dimetric-projection',
  parent: 'axonometric-projections',
  title: 'Dimetric projection',
  level: 2,
  short: 'Two of the three axes are foreshortened alike, the third differently. The drawing-office dimetric has scales 1 : 1 : ½ with the receding axes at 7° and 41°; it shows one face nearly square on, so a front with round features is easy to draw.',
  keywords: ['dimetric', '1:1:1/2', '7 degrees', '41 degrees', 'two scales', 'axonometric', 'half scale', 'set square', 'Weisbach'],
  prereq: ['axonometric-projection', 'isometric-projection', 'isometric-drawing'],
  related: ['trimetric-projection', 'axonometric-scales', 'isometric-in-games', 'oblique-projection'],
  body: `If two of the three scales are equal and the third is different, the projection is **dimetric** ("two measures"). Any choice of α and β with that property will do; the one used in the drawing office has the scales $1 : 1 : \\tfrac12$ — the two axes at 7° (to the right) and 41° (to the left) of the horizontal. Its virtue is that it turns one face nearly full on: the front face, between the right-hand and the vertical axes, is only slightly sheared (its two axes are 83° apart rather than 90°), so circles in it are almost round; the other two faces are flat and the top is foreshortened.

### The family
Let the two equal scales be 1 and the odd one $q$ (in the drawing, 1 : 1 : $q$). From $s_x = s_y$ and the sum rule $s_x^2 + s_y^2 + s_z^2 = 2$ one finds $s_z = \\sqrt2\\sin\\alpha$ and hence
$$\\tan\\alpha = \\frac{q}{\\sqrt2},\\qquad \\sin\\beta = \\frac{q}{\\sqrt2},\\qquad \\tan\\theta_x = \\frac{q^2}{\\sqrt{4 - q^4}},\\qquad \\tan\\theta_z = \\sqrt{\\frac{2 - q^2}{2 + q^2}} .$$
For $q = 1$ everything collapses to the isometric ($\\alpha = 35.26°$, $\\theta = 30°$ both); for $q = \\tfrac12$:
$$\\alpha = \\arcsin\\tfrac13 = 19.47°,\\qquad \\beta = \\arcsin\\tfrac{1}{2\\sqrt2} = 20.70°,\\qquad \\theta_x = 7.18°\\ (7°10′),\\qquad \\theta_z = 41.41°\\ (41°25′),$$
with true scales $0.943 : 0.943 : 0.471$, i.e. the drawing is the projection enlarged by $1.061$. The matrix is the general axonometric matrix with these two angles.

### Setting it out at the board
The tangent of $7.18°$ is $0.126$, very nearly $\\tfrac18$, and that of $41.41°$ is $0.882$, very nearly $\\tfrac78$. So the axes can be laid out with the T-square and a scale alone: from the corner go **8 units across and 1 up** for the right axis, **8 across and 7 up** for the left one. The errors are $0.06°$ and $0.22°$ — invisible. Then lay off the dimensions: full length on the right axis and the vertical, **half length** on the left axis. Forgetting the halving makes everything on the left axis look twice as deep as it is.

### The ellipses
Using $\\sqrt{1 - s^2}$: the circle in the front face (its normal is the half-scale axis) has minor/major $0.882$, nearly round; the circles in the other two faces (normals of scale $0.943$) have $0.333$, three times as long as wide. Hence the choice of view: put the face with the most circles — the one a draughtsman wants least distorted — at the front. The two-to-one **pixel** projection of computer games is also a dimetric one, but with the two *ground* axes equal ($0.791$) and the vertical axis different ($0.866$): see [[isometric-in-games]].

> [!note] A mirror image is the same projection: turning the object the other way ($\\beta$ negative) puts the 7° axis on the left. It is a matter of which side you want to see.`,
  ideas: [
    'Dimetric: two scales equal, one different; the drawing-office version has scales 1 : 1 : ½, with axes at 7°10′ and 41°25′.',
    'For scales 1 : 1 : q the tilt and turn follow from tan α = q/√2 and sin β = q/√2; q = 1 is the isometric.',
    'The axes can be set out without a protractor from the slopes 1 : 8 and 7 : 8; the left axis is drawn at half length.',
    'The face between the right-hand and vertical axes is almost undistorted (circles about 0.88), the other faces are flat (0.33).',
    'The 2 : 1 pixel projection of games is also dimetric, but with the two ground axes equal and the vertical one different.'
  ],
  pitfalls: [
    'Dimetric means the two lower axes are equal — Which two scales are equal is a matter of choice: the drafting version has the vertical and one receding axis equal, the pixel-art version the two ground axes.',
    'Draw all three axes at full length — The left (steep) axis is drawn at half length in the 1 : 1 : ½ dimetric. At full length the depth looks double.',
    'The 7° axis is almost horizontal, so the front face is a true front view — It is sheared by 7°: the angle between the right-hand and vertical axes is 83°, not 90°. Circles in it are ellipses, though nearly round (0.88).'
  ],
  formulas: [
    {
      name: 'Tilt for scales 1 : 1 : q',
      expr: 'alpha = atan(q/sqrt(2))',
      tex: '\\alpha = \\arctan\\frac{q}{\\sqrt2}',
      vars: {
        alpha: { name: 'tilt', q: 'angle', unit: '°' },
        q: { name: 'scale of the odd axis relative to the two equal ones', value: 0.5, min: 0.05, max: 1.4 }
      },
      solveFor: 'alpha',
      note: 'q = ½: α = 19.47°. q = 1: α = 35.26°, the isometric.'
    },
    {
      name: 'Turn for scales 1 : 1 : q',
      expr: 'beta = asin(q/sqrt(2))',
      tex: '\\beta = \\arcsin\\frac{q}{\\sqrt2}',
      vars: {
        beta: { name: 'turn', q: 'angle', unit: '°' },
        q: { name: 'scale of the odd axis relative to the two equal ones', value: 0.5, min: 0.05, max: 1.4 }
      },
      solveFor: 'beta',
      note: 'q = ½: β = 20.70°. q = 1: β = 45°.'
    },
    {
      name: 'Angle of the shallow axis',
      expr: 'thx = atan(q^2/sqrt(4 - q^4))',
      tex: '\\theta_x = \\arctan\\frac{q^2}{\\sqrt{4 - q^4}}',
      vars: {
        thx: { name: 'angle of the shallow axis to the horizontal', q: 'angle', unit: '°', tex: '\\theta_x' },
        q: { name: 'scale of the odd axis relative to the two equal ones', value: 0.5, min: 0.05, max: 1.4 }
      },
      solveFor: 'thx',
      note: 'q = ½: 7.18°, nearly the slope 1 : 8.'
    },
    {
      name: 'Angle of the steep axis',
      expr: 'thz = atan(sqrt((2 - q^2)/(2 + q^2)))',
      tex: '\\theta_z = \\arctan\\sqrt{\\frac{2 - q^2}{2 + q^2}}',
      vars: {
        thz: { name: 'angle of the steep axis to the horizontal', q: 'angle', unit: '°', tex: '\\theta_z' },
        q: { name: 'scale of the odd axis relative to the two equal ones', value: 0.5, min: 0.05, max: 1.4 }
      },
      solveFor: 'thz',
      note: 'q = ½: 41.41°, nearly the slope 7 : 8.'
    }
  ],
  examples: [
    {
      title: 'Checking the 1 : 8 and 7 : 8 layout',
      q: 'How far do the simple slopes 1 : 8 and 7 : 8 differ from the true dimetric axes, and how big is the error at the end of a 200 mm axis?',
      steps: [
        { text: 'The slopes as angles:', tex: '\\arctan\\tfrac18 = 7.125°,\\qquad \\arctan\\tfrac78 = 41.186° .' },
        { text: 'The true axes are at 7.181° and 41.410°, so the differences are', tex: '0.056°\\quad\\text{and}\\quad 0.224° .' },
        'At the end of a 200 mm line an angle of $0.224°$ moves the point sideways by $200 \\times \\tan 0.224° = 0.8$ mm; for the shallow axis $0.2$ mm. Both are below the thickness of a pencil line.'
      ],
      a: 'Errors 0.06° and 0.22°; at the end of a 200 mm axis 0.2 mm and 0.8 mm.'
    },
    {
      title: 'The size of a dimetric drawing',
      q: 'A box 100 wide (right axis), 60 high and 80 deep (left axis) is drawn as a 1 : 1 : ½ dimetric drawing. How large is the drawing, and how many times larger than the true projection?',
      steps: [
        'Laid off: 100 on the right axis (at 7.18°), 60 vertically, and $80/2 = 40$ on the left axis (at 41.41°).',
        { text: 'Width and height:', tex: '100\\cos 7.18° + 40\\cos 41.41° = 99.2 + 30.0 = 129.2\\ \\text{mm},\\qquad 60 + 100\\sin 7.18° + 40\\sin 41.41° = 60 + 12.5 + 26.5 = 99.0\\ \\text{mm}.' },
        'The true projection is smaller by $0.9428$: the drawing is $1/0.9428 = 1.0607$ times larger.'
      ],
      a: 'About 129 × 99 mm, and 6 % larger than the projection.'
    }
  ],
  quiz: [
    { q: 'In the drawing-office dimetric 1 : 1 : ½, which axis is drawn at half length?', choices: ['The vertical axis', 'The shallow (7°) axis', 'The steep (41°) axis', 'None; the scales are all one'], a: 2, why: 'The steep receding axis, at 41°25′, is the one with scale 0.471; the shallow axis and the vertical one have 0.943.' },
    { q: 'For scales 1 : 1 : q, what is α in degrees when q = ½?', answer: 19.47, why: '$\\tan\\alpha = q/\\sqrt2 = 0.3536$, so $\\alpha = 19.47°$ ($\\sin\\alpha = 1/3$).' },
    { q: 'Which slopes lay out the dimetric axes at the board without a protractor?', choices: ['1 : 4 and 1 : 2', '1 : 8 and 7 : 8', '1 : 6 and 1 : 1', '1 : 3 and 3 : 4'], a: 1, why: '$\\tan 7.18° \\approx \\tfrac18$ and $\\tan 41.41° \\approx \\tfrac78$.' },
    { q: 'In the 1 : 1 : ½ dimetric the circle in the front face (normal of scale 0.471) is drawn as an ellipse with minor/major about', choices: ['0.33', '0.58', '0.88', '1'], a: 2, why: '$\\sqrt{1 - 0.471^2} = 0.882$ — almost round.' },
    { q: 'The 2 : 1 pixel projection of games has the same scales as the drawing-office dimetric.', a: false, why: 'Its scales are 0.791 : 0.866 : 0.791 (ground axes equal, vertical different); the drafting dimetric has 0.943 : 0.943 : 0.471 with the odd one a receding axis.' }
  ],
  applications: [
    'Machine drawings with round holes and bosses in the front face, where the nearly true front keeps the circles round.',
    'Installation and assembly instructions that show one face of a product clearly and the depth as a hint.',
    'Pictorial views in older CAD programs, where the dimetric view was offered beside the isometric.',
    'Games: the 2 : 1 "isometric" tile is a dimetric projection chosen for clean pixel lines ([[isometric-in-games]]).'
  ],
  history: 'Julius Weisbach, professor at the mining academy of Freiberg, published the "monodimetric" and "anisometric" methods in 1844, meant for the drawing of machine parts and buildings; the dimetric picture descends from his. Drafting textbooks of the twentieth century settled on the 1 : 1 : ½ version with axes at 7° and 41° as the second standard pictorial beside Farish\'s isometric.',
  sources: ['Julius Weisbach, Die monodimetrische und anisometrische Projections-Methode (Freiberg, 1844).', 'ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on axonometric projection.'],
  sim: { id: 'ax-lab', params: { preset: 'dim' } },
  construction: 'ax-dimetric-axes'
},

{
  id: 'trimetric-projection',
  parent: 'axonometric-projections',
  title: 'Trimetric projection',
  level: 2,
  short: 'All three scales different: the general axonometric picture. Chosen well, it gives the most natural view of a solid, with no two faces alike; at the board it costs three scales and two unusual angles.',
  keywords: ['trimetric', 'anisometric', 'three scales', 'general axonometric', 'axes angles 15 45', 'viewpoint', 'protractor', 'CAD'],
  prereq: ['axonometric-projection', 'dimetric-projection', 'math:matrices'],
  related: ['axonometric-scales', 'isometric-projection', 'the-projection-matrix', 'game-cameras'],
  body: `When no two scales are equal the projection is **trimetric** ("three measures"; Weisbach called it *anisometric*), and it is the general case of which the isometric and the dimetric are special ones. In an isometric or dimetric picture symmetry creates coincidences: the near corner of an isometric cube hides its far corner exactly, and two faces are mirror images. A trimetric view has none of that. The three faces differ, the eye reads the solid as seen from a particular direction rather than as a diagram, and for many shapes it is the picture an illustrator would choose.

### From the angles to the matrix
At the board one chooses the two angles that the receding axes make with the horizontal, say $\\theta_x$ and $\\theta_z$. They fix the tilt and the turn:
$$\\sin^2\\alpha = \\tan\\theta_x\\tan\\theta_z,\\qquad \\tan\\beta = \\frac{\\tan\\theta_x}{\\sin\\alpha},$$
and the three scales follow from the general formulas. For the common choice $\\theta_x = 15°$, $\\theta_z = 45°$:
$$\\alpha = 31.17°,\\quad \\beta = 27.37°,\\quad s_x = 0.919,\\quad s_y = 0.856,\\quad s_z = 0.650 ;$$
check: $0.845 + 0.732 + 0.423 = 2.000$. To get the matrix to a program or to a hand calculation, use the rows $(\\cos\\beta, 0, -\\sin\\beta)$ and $(-\\sin\\alpha\\sin\\beta, \\cos\\alpha, -\\sin\\alpha\\cos\\beta)$ with these angles.

### Drawing it
The 15° line is made with the 30°–60° and 45° set squares together (45° − 30°), or a protractor; the 45° one with the 45° set square. Every true length is **multiplied by the scale of its axis** before it is laid off: a block 100 long, 60 high and 80 deep becomes $91.9$, $51.3$ and $52.0$ — or, in a *drawing*, divide all three scales by the largest and lay off $1.00,\\ 0.93,\\ 0.71$ of each length, which enlarges the picture by $1.088$. Because the three scales are different, **every face has its own ellipse** and no template or four-centre construction fits more than one of them: the ratios are $\\sqrt{1 - s^2}$, here $0.39$, $0.52$ and $0.76$. This is why the trimetric is rare on paper and common in computers: a matrix does not care that the three numbers differ.

### Choosing a view
Moving a trimetric view away from the isometric (and from the dimetric) is a way of picking the face that deserves the largest picture. A steep left axis (45°) and a shallow right one (15°) turn the object so that the right-hand face is seen almost squarely and the left-hand one is narrow, and the top is foreshortened by the tilt $\\alpha$. Asymmetric views like this are also the ones that avoid optical accidents: no edge ever lines up exactly with another edge behind it.

> [!tip] The trace-triangle picture ([[axonometric-projection]]) explains the choice: a scalene triangle gives a trimetric view, and the more unequal its sides the more unequal the scales. The axes are its altitudes, and the next-but-one page finds the scales from it ([[axonometric-scales]]).`,
  ideas: [
    'Trimetric: all three scales different; the general axonometric picture, of which isometric and dimetric are special cases.',
    'Choose the angles of the two receding axes; then sin² α = tan θx tan θz and tan β = tan θx / sin α give the tilt and the turn.',
    'For axes at 15° and 45° the scales are 0.919, 0.856 and 0.650; every length is multiplied by the scale of its own axis.',
    'No two faces are alike, so each needs its own ellipse (ratios √(1 − s²)); templates and the four-centre method fit only the isometric case.',
    'A trimetric view avoids the coincidences of the isometric and is easy for a program but slow for a hand.'
  ],
  pitfalls: [
    'Three different scales means three arbitrary numbers — The three scales are tied together: their squares add to 2, and two angles fix all of them.',
    'Any two angles will do — They must satisfy tan θx tan θz < 1 (a tilt α of less than 90°) and the angles between the three axes must all exceed 90°, otherwise no perpendicular projection has them.',
    'The 35° ellipse template fits the trimetric faces — That template is for the isometric (ratio 0.577). Each trimetric face needs an ellipse of its own ratio.'
  ],
  formulas: [
    {
      name: 'Tilt from the two axis angles',
      expr: 'alpha = asin(sqrt(tan(thx)*tan(thz)))',
      tex: '\\alpha = \\arcsin\\sqrt{\\tan\\theta_x\\tan\\theta_z}',
      vars: {
        alpha: { name: 'tilt', q: 'angle', unit: '°' },
        thx: { name: 'angle of the right axis to the horizontal', q: 'angle', unit: '°', value: 15, min: 0.5, max: 89, tex: '\\theta_x' },
        thz: { name: 'angle of the left axis to the horizontal', q: 'angle', unit: '°', value: 45, min: 0.5, max: 89, tex: '\\theta_z' }
      },
      solveFor: 'alpha',
      note: '15° and 45° give 31.17°.'
    },
    {
      name: 'Turn from the two axis angles',
      expr: 'beta = atan(tan(thx)/sqrt(tan(thx)*tan(thz)))',
      tex: '\\beta = \\arctan\\frac{\\tan\\theta_x}{\\sqrt{\\tan\\theta_x\\tan\\theta_z}} = \\arctan\\sqrt{\\frac{\\tan\\theta_x}{\\tan\\theta_z}}',
      vars: {
        beta: { name: 'turn', q: 'angle', unit: '°' },
        thx: { name: 'angle of the right axis to the horizontal', q: 'angle', unit: '°', value: 15, min: 0.5, max: 89, tex: '\\theta_x' },
        thz: { name: 'angle of the left axis to the horizontal', q: 'angle', unit: '°', value: 45, min: 0.5, max: 89, tex: '\\theta_z' }
      },
      solveFor: 'beta',
      note: '15° and 45° give 27.37°. (Equal axis angles give 45°, whatever the tilt.)'
    },
    {
      name: 'Scale of the left axis',
      expr: 'sz = sqrt(sin(beta)^2 + sin(alpha)^2*cos(beta)^2)',
      tex: 's_z = \\sqrt{\\sin^2\\beta + \\sin^2\\alpha\\,\\cos^2\\beta}',
      vars: {
        sz: { name: 'scale of the left axis', tex: 's_z' },
        alpha: { name: 'tilt', q: 'angle', unit: '°', value: 31.174, min: 0, max: 90 },
        beta: { name: 'turn', q: 'angle', unit: '°', value: 27.368, min: 0, max: 90 }
      },
      solveFor: 'sz',
      note: 'The scale of the right axis is √(cos²β + sin²α sin²β), that of the vertical axis cos α. For the 15°/45° view: 0.650, 0.919, 0.856.'
    }
  ],
  examples: [
    {
      title: 'The 15° / 45° trimetric from scratch',
      q: 'Find the tilt, the turn and the three scales for a picture whose receding axes make 15° and 45° with the horizontal, and the drawn lengths for a block 100 × 60 × 80.',
      steps: [
        { text: 'The tilt:', tex: '\\sin^2\\alpha = \\tan 15°\\tan 45° = 0.2679 \\;\\Rightarrow\\; \\alpha = \\arcsin 0.5176 = 31.17° .' },
        { text: 'The turn:', tex: '\\tan\\beta = \\frac{\\tan 15°}{\\sin\\alpha} = \\frac{0.2679}{0.5176} = 0.5176 \\;\\Rightarrow\\; \\beta = 27.37° .' },
        { text: 'The scales:', tex: 's_x = 0.919,\\quad s_y = \\cos 31.17° = 0.856,\\quad s_z = 0.650 .' },
        'The block: $100 \\times 0.919 = 91.9$ mm on the 15° axis, $60 \\times 0.856 = 51.3$ mm vertically, $80 \\times 0.650 = 52.0$ mm on the 45° axis.'
      ],
      a: 'α = 31.17°, β = 27.37°, scales 0.919 / 0.856 / 0.650; the block is drawn 91.9 × 51.3 × 52.0 mm.'
    },
    {
      title: 'How many ellipses?',
      q: 'For the 15° / 45° trimetric, find the minor-to-major ratios of the circles in the three faces.',
      steps: [
        { text: 'Use $\\rho = \\sqrt{1 - s^2}$ for the scale of the axis perpendicular to each face:', tex: '\\rho_x = \\sqrt{1 - 0.919^2} = 0.394,\\quad \\rho_y = \\sqrt{1 - 0.856^2} = 0.517,\\quad \\rho_z = \\sqrt{1 - 0.650^2} = 0.760 .' },
        'The three faces need three different ellipses — the ratios are 0.39 (face perpendicular to the 15° axis), 0.52 (top face) and 0.76 (face perpendicular to the 45° axis).'
      ],
      a: '0.39, 0.52 and 0.76.'
    }
  ],
  quiz: [
    { q: 'In a trimetric picture the receding axes make 10° and 30° with the horizontal. The tilt α is', choices: ['18.6°', '30°', '45°', '9.7°'], a: 0, why: '$\\sin^2\\alpha = \\tan 10°\\tan 30° = 0.1018$, $\\sin\\alpha = 0.319$, $\\alpha = 18.6°$.' },
    { q: 'Why is a template for isometric ellipses no help in a trimetric drawing?', choices: ['Trimetric pictures contain no ellipses', 'Each face has an ellipse of a different ratio', 'The template is too small', 'The ellipses are all circles'], a: 1, why: 'The ratio is $\\sqrt{1 - s^2}$ for the face normal; three different scales give three different ratios.' },
    { q: 'The scales 0.9, 0.9 and 0.9 could be those of an orthographic axonometric picture.', a: false, why: 'The squares must add up to 2: $3 \\times 0.81 = 2.43$. Equal scales are possible only at $0.8165$.' },
    { q: 'For the 15° / 45° view, what is the scale of the vertical axis?', answer: 0.856, why: '$s_y = \\cos\\alpha = \\cos 31.17° = 0.856$.' },
    { q: 'What do you gain by choosing a trimetric rather than an isometric view?', choices: ['Simpler hand construction', 'A natural-looking view without coincident edges, and the freedom to favour one face', 'True lengths on all three axes', 'No ellipses'], a: 1, why: 'Trimetric is harder to draw by hand — the gain is in the appearance.' }
  ],
  applications: [
    'Product renderings and technical illustrations made in CAD, where any view direction is as easy as any other.',
    'Architectural studies, where a trimetric view avoids the dead symmetry of the isometric.',
    'Games with a free camera or with rotating isometric maps, whose orthographic view is trimetric as the camera moves.',
    'Mapping and 3-D visualisation of terrain models seen from a chosen azimuth and elevation.'
  ],
  history: 'Weisbach\'s 1844 book introduced the unequal-scale method for the drawings of machines and buildings, calling it anisometric; the name trimetric arrived with the English translations of German descriptive geometry in the later nineteenth century. For a century it remained a theoretical class beside the two simpler ones, until computer graphics made every view direction free.',
  sources: ['Julius Weisbach, Die monodimetrische und anisometrische Projections-Methode (Freiberg, 1844).', 'ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.'],
  sim: { id: 'ax-lab', params: { preset: 'tri' } },
  construction: 'ax-trimetric'
},

{
  id: 'axonometric-scales',
  parent: 'axonometric-projections',
  title: 'Axonometric scales and Pohlke\'s theorem',
  level: 3,
  short: 'The scales of an axonometric picture follow from the three axes on the paper — by a formula in the angles or by a construction on the trace triangle. Pohlke\'s theorem goes further: any three segments from a point are the picture of three equal perpendicular edges of a cube.',
  keywords: ['Pohlke', 'Gauss', 'scales', 'trace triangle', 'rabatment', 'fundamental theorem of axonometry', 'obliquity', 'orthographic', 'cube'],
  prereq: ['axonometric-projection', 'trimetric-projection', 'math:linear-transformations'],
  related: ['oblique-projection', 'cabinet-projection', 'cavalier-projection', 'true-length-by-rotation', 'math:eigenvalues'],
  body: `A draughtsman who knows only the three axes on his paper — say, because someone has drawn them — can still find the **scales**, and learns something deeper on the way: that almost any three axes are the picture of a cube. There are two routes, one by formula and one by compass.

### From the angles
Call $A$, $B$, $C$ the angles on the paper between the axes $y,z$, between $z,x$ and between $x,y$ (they add up to 360° and, for a perpendicular projection, each exceeds 90°). Then the squares of the scales are proportional to $|\\sin 2A|$, $|\\sin 2B|$, $|\\sin 2C|$, and since they add to 2:
$$s_x^2 = \\frac{2\\,|\\sin 2A|}{|\\sin 2A| + |\\sin 2B| + |\\sin 2C|},$$
and cyclically for $s_y$ and $s_z$. The isometric ($120°$ three times) gives $\\tfrac23$ each; the $15°/45°$ trimetric ($A = 135°$, $B = 120°$, $C = 105°$) gives $0.845, 0.732, 0.423$, so scales $0.919, 0.856, 0.650$.

### From the trace triangle
Construct the triangle $ABC$ whose sides are perpendicular to the three axes (the axes are its altitudes). Triangle $OAB$ has a right angle at the true corner $O$, so $O$ lies on the circle with diameter $AB$ — and, since the projectors are perpendicular to the picture plane, on the perpendicular from $O'$ to $AB$. Turning the plane $OAB$ flat about $AB$ (**rabatment**) therefore puts $O$ at the crossing of that semicircle and that perpendicular. The lengths $AO$ and $BO$ so found are the true lengths of the cube edges seen from $A$ and $B$, and the scale of the $x$ axis is $O'A/OA$; likewise for the others. The reduction itself is an orthogonal affinity about $AB$, drawn by dropping perpendiculars to $AB$ (see the construction below).

### The theorem
**Gauss** (the perpendicular case): three segments $O'A', O'B', O'C'$ with paper coordinates $(x_k, y_k)$ are the images of equal perpendicular edges under perpendicular projection if and only if
$$\\sum_k (x_k + i\\,y_k)^2 = 0 .$$
Written as a matrix equation this says that the two rows of $P = \\begin{bmatrix}x_1&x_2&x_3\\\\y_1&y_2&y_3\\end{bmatrix}$ are orthogonal and of equal length — exactly what the first two rows of a rotation matrix are. Given the three directions this fixes the three lengths (the formula above), which is why only the directions are free.

**Pohlke** (the general parallel case): *any* three segments from a point, non-collinear, are the picture of three equal perpendicular edges under *some* parallel projection. Proof by the matrix: let $G = PP^{\\mathsf T}$. A cube of edge $d$ projected along a direction inclined at $\\psi$ to the normal of the picture plane gives $G = d^2(I + uu^{\\mathsf T})$ with $|u| = \\tan\\psi$, so
$$d^2 = \\lambda_{\\min}(G),\\qquad \\tan\\psi = \\sqrt{\\frac{\\lambda_{\\max}}{\\lambda_{\\min}} - 1}.$$
Every $G$ has eigenvalues $\\lambda_{\\max}\\ge\\lambda_{\\min} > 0$ when the segments are not collinear, so the theorem always holds. The image of a sphere of radius $d$ about $O'$ is the ellipse with these semi-axes; if it is a circle the projection is perpendicular (Gauss), otherwise oblique. A cavalier drawing is the case $\\psi = 45°$, a cabinet drawing $\\psi = 26.6°$: [[cavalier-projection]] and [[cabinet-projection]] are Pohlke pictures with the front face parallel to the paper.

### What it means
Any parallelepiped drawn on three segments can be read as a cube — a picture alone never fixes the proportions of a solid; only the viewer's assumption does. Every axonometric or oblique picture of a cube is some $P$; the rest is how oblique the projectors are.`,
  ideas: [
    'The squares of the three scales are in proportion to |sin 2A|, |sin 2B|, |sin 2C|, A, B, C being the paper angles opposite the axes; they add up to 2.',
    'On the trace triangle the true corner lies on the semicircle over a side; rabatting that plane about the side gives the true edge length and the affinity that shortens it.',
    'Gauss: three segments are a perpendicular picture of equal perpendicular edges iff Σ(x + iy)² = 0; only the directions are free.',
    'Pohlke: any three non-collinear segments from a point are the picture of a cube under some parallel projection; G = PPᵀ gives the edge d² = λmin and the obliquity tan ψ = √(λmax/λmin − 1).',
    'Cavalier (ψ = 45°) and cabinet (ψ = 26.6°) pictures are the oblique cases of Pohlke\'s theorem.'
  ],
  pitfalls: [
    'Any three axes with any lengths come from a perpendicular projection — Only the directions are free for a perpendicular projection; the lengths follow. With other lengths the projection is oblique.',
    'Pohlke says the picture of a cube is unique — It says the opposite: every parallelepiped can be read as a cube, so a picture does not fix the shape of the solid.',
    'The scales can be read off the paper angles for any triple — The angles between the axes must all exceed 90°; if one is smaller there is no perpendicular projection with those axes.'
  ],
  formulas: [
    {
      name: 'Scale from the angles between the axes',
      expr: 'sx = sqrt(2*abs(sin(2*A))/(abs(sin(2*A)) + abs(sin(2*B)) + abs(sin(2*(2*pi - A - B)))))',
      tex: 's_x = \\sqrt{\\frac{2\\,|\\sin 2A|}{|\\sin 2A| + |\\sin 2B| + |\\sin 2C|}}',
      vars: {
        sx: { name: 'scale of the x axis', tex: 's_x' },
        A: { name: 'angle on the paper between the y and z axes (opposite x)', q: 'angle', unit: '°', value: 135, min: 90, max: 180 },
        B: { name: 'angle on the paper between the z and x axes (opposite y)', q: 'angle', unit: '°', value: 120, min: 90, max: 180 }
      },
      solveFor: 'sx',
      note: 'C = 360° − A − B is the angle between x and y. 135°, 120°, 105° give s_x = 0.919; 120° three times gives 0.8165.'
    },
    {
      name: 'Obliquity from the outline of the sphere',
      expr: 'psi = atan(sqrt(a^2/b^2 - 1))',
      tex: '\\tan\\psi = \\sqrt{\\frac{a^2}{b^2} - 1}',
      vars: {
        psi: { name: 'angle between the projectors and the normal of the picture plane', q: 'angle', unit: '°' },
        a: { name: 'long semi-axis of the sphere\'s outline', q: 'length', unit: 'mm', value: 141.4 },
        b: { name: 'short semi-axis (= the true edge d)', q: 'length', unit: 'mm', value: 100 }
      },
      solveFor: 'psi',
      note: 'a = b: perpendicular projection. A cavalier cube (d = 100) has a = √2 · 100 and ψ = 45°; a cabinet cube has a = 111.8 and ψ = 26.57°.'
    },
    {
      name: 'The third scale from the other two',
      expr: 'sz = sqrt(2 - sx^2 - sy^2)',
      tex: 's_z = \\sqrt{2 - s_x^2 - s_y^2}',
      vars: {
        sz: { name: 'scale of the third axis', tex: 's_z' },
        sx: { name: 'scale of the first axis', value: 0.919, min: 0, max: 1, tex: 's_x' },
        sy: { name: 'scale of the second axis', value: 0.856, min: 0, max: 1, tex: 's_y' }
      },
      solveFor: 'sz',
      note: 'The sum rule — the cheapest check of a construction.'
    }
  ],
  examples: [
    {
      title: 'The scales of the 15° / 45° view from its angles',
      q: 'The axes of a picture make angles of 105°, 135° and 120° with each other. Find the three scales.',
      steps: [
        { text: 'Opposite to $x$ is the angle between $y$ and $z$, $A = 135°$; opposite to $y$ is $B = 120°$; opposite to $z$ is $C = 105°$. The sines of the doubled angles:', tex: '|\\sin 270°| = 1,\\quad |\\sin 240°| = 0.866,\\quad |\\sin 210°| = 0.5 \\quad(\\text{sum } 2.366).' },
        { text: 'Then', tex: 's_x^2 = \\tfrac{2 \\times 1}{2.366} = 0.845,\\quad s_y^2 = \\tfrac{2 \\times 0.866}{2.366} = 0.732,\\quad s_z^2 = \\tfrac{2 \\times 0.5}{2.366} = 0.423 .' },
        'The scales are $0.919$, $0.856$ and $0.650$, the numbers of the matrix for $\\theta_x = 15°$, $\\theta_z = 45°$ ([[trimetric-projection]]).'
      ],
      a: 'Scales 0.919 : 0.856 : 0.650 — the construction on the trace triangle gives the same numbers.'
    },
    {
      title: 'A cabinet cube as a Pohlke picture',
      q: 'A cabinet drawing of a cube has edges $x = (100, 0)$, $y = (0, 100)$ and, receding at 45° at half length, $z = (35.4, 35.4)$ (in mm on the paper). Find the true edge, the obliquity and the angle of the projectors.',
      steps: [
        { text: 'Form $G = PP^{\\mathsf T}$ from the columns:', tex: 'G = \\begin{bmatrix}100^2 + 35.4^2 & 35.4^2\\\\ 35.4^2 & 100^2 + 35.4^2\\end{bmatrix} = \\begin{bmatrix}11250 & 1250\\\\ 1250 & 11250\\end{bmatrix}.' },
        { text: 'Its eigenvalues are the sum and the difference of the entries:', tex: '\\lambda_{\\max} = 12500,\\qquad \\lambda_{\\min} = 10000 .' },
        { text: 'So the true edge is $d = \\sqrt{10000} = 100$ mm (as drawn on the front face) and', tex: '\\tan\\psi = \\sqrt{12500/10000 - 1} = \\tfrac12,\\quad \\psi = 26.57° .' },
        'The projectors make $90° - 26.57° = 63.43°$ with the picture plane: the cabinet angle $\\arctan 2$.'
      ],
      a: 'd = 100 mm, tan ψ = ½, projectors at 63.4° to the picture plane.'
    }
  ],
  quiz: [
    { q: 'The three axes of a picture are exactly 120° apart. The squares of the scales are in the proportion', choices: ['1 : 1 : 1', '1 : 2 : 3', '1 : 1 : 2', '3 : 2 : 1'], a: 0, why: 'All three angles are 120°, so |sin 240°| is the same for each: the scales are equal, 0.8165 — the isometric picture.' },
    { q: 'The three scales of an orthographic axonometric picture are 0.919, 0.856 and ... what? (the sum of the squares is 2)', answer: 0.65, why: '$\\sqrt{2 - 0.845 - 0.732} = \\sqrt{0.423} = 0.650$.' },
    { q: 'Pohlke\'s theorem says that any three segments from a point are the picture of equal perpendicular edges under', choices: ['a perpendicular projection', 'some parallel projection, in general oblique', 'a central projection', 'an isometric projection'], a: 1, why: 'Only the directions are free for a perpendicular projection; with arbitrary lengths the projectors are inclined, by ψ = arctan √(λmax/λmin − 1).' },
    { q: 'If two of the angles between the axes on the paper are 80° and 140°, there is a perpendicular projection with those axes.', a: false, why: 'The angles must all exceed 90° (the trace triangle must be acute). An angle of 80° means no perpendicular projection has these directions — though an oblique one does.' },
    { q: 'The outline of the sphere in a Pohlke picture is a circle. The projection is', choices: ['oblique at 45°', 'perpendicular to the picture plane', 'cabinet', 'impossible'], a: 1, why: '$\\lambda_{\\max} = \\lambda_{\\min}$ means $\\tan\\psi = 0$: the projectors are normal to the picture plane (Gauss\'s condition).' }
  ],
  applications: [
    'Checking that a hand-drawn axonometric is consistent: the three scales must satisfy the sum rule, and a picture whose axes violate the angle condition cannot be perpendicular.',
    'Photogrammetry and vision: recovering the shape of a block from its parallel (affine) picture is the Pohlke / Gauss problem in modern dress.',
    'Choosing the angles of an axonometric view before drawing it: the formula gives the scales without computing α and β.',
    'Understanding cavalier and cabinet drawings as ordinary pictures of a cube, which explains why they look natural.'
  ],
  history: 'Karl Pohlke, a Berlin teacher of descriptive geometry, found his fundamental theorem about 1853 and published it in his textbook of 1860; Hermann Amandus Schwarz gave the first elementary proof in 1864. The perpendicular case with the complex-number condition is usually credited to Gauss, who stated it in a letter. It became the foundation of axonometry in the German-speaking countries and, through the theory of affine images, of much of the mathematics of computer vision.',
  sources: ['Karl Pohlke, Darstellende Geometrie (Berlin, 1860).', 'H. A. Schwarz, Elementarer Beweis des Pohlke\'schen Fundamentalsatzes der Axonometrie, Crelles Journal 63 (1864).', 'Hellmuth Stachel, Descriptive Geometry, the chapter on axonometry (Vienna University of Technology, lecture notes).'],
  sim: 'ax-pohlke-lab',
  construction: 'ax-pohlke'
},

{
  id: 'exploded-and-cutaway',
  parent: 'axonometric-projections',
  title: 'Exploded and cutaway views',
  level: 2,
  short: 'Pull the parts of an assembly apart along their assembly lines, or cut a quarter out of the whole: either way an axonometric picture shows what an ordinary view hides — how the parts fit and what lies inside.',
  keywords: ['exploded view', 'cutaway', 'section', 'assembly line', 'centre line', 'technical illustration', 'parts catalogue', 'quarter section', 'Leonardo'],
  prereq: ['isometric-drawing', 'isometric-circles', 'section-views'],
  related: ['technical-illustration', 'patent-and-assembly-drawings', 'axonometric-projection', 'dimensioning-basics'],
  body: `An assembled machine shows its outside. To show **how it goes together** you pull the parts apart; to show **what is inside** you cut a piece away. Both are drawn most easily in an axonometric projection, because there the parts keep their shapes and sizes along three axes and a stack of parts on one axis is a stack of ellipses on one vertical.

### The exploded view
Each part is moved from its assembled position along the line on which it will be fitted, in the order of assembly, and the **assembly line** (a thin dash-dot line) is drawn through all of them to show the movement. For parts that go together on a vertical axis the explosion is straight up. Small parts — screws, pins, washers — are moved along their own axes, and the line is drawn from the part to the hole it enters. Each part is drawn as it is, with its own hidden detail left out, in the same projection as the others. The *gaps* are chosen so that the outlines do not run into each other: for two coaxial discs of radii $r_1$ and $r_2$, drawn as ellipses in the isometric, the gap between their face centres must exceed
$$g_{\\min} = \\frac{r_1 + r_2}{\\sqrt2},$$
because each rim ellipse reaches $r/\\sqrt2$ above and below its centre. Beyond that, the gaps should look even and follow the order of assembly. The total height of an exploded stack of $n$ parts is $\\sum h_i + (n-1)\\,g$.

### The cutaway
In a cutaway a piece of the assembly is removed, usually a quarter or a half, so that the inside is seen: the bore of the bush, the pin sitting in it, the fit between the two. The cut faces are *sections*: they are hatched, or drawn in a flat colour, and the hatching runs at an angle that is clearly not parallel to any outline. A cutaway on the round parts is easy because the cut is on a plane through the axis, a plane of symmetry: its picture is a parallelogram whose sides are two of the axes. For assemblies of boxes the cut is parallel to a face. The cut must not remove the interesting thing: the pin, the bolt and the shaft, which are solid and run through the axis, are **not** cut in a section drawing (by convention), though a cutaway illustration can show them either way.

### Drawing it
Draw the part nearest the viewer first, or the farthest first and let the nearer ones hide it: a pen-and-ink illustrator works from the front, a hidden-line program from the back. The parts lower on the vertical axis are further from the viewer in an isometric from above, so an upper part hides what is behind it — which is why the gaps matter. Once drawn, number the parts and add a list: the picture is a map, the list says what each thing is. Leonardo\'s drawings of machine elements in the Madrid Codices are early exploded views, and Ramelli\'s book of machines (1588) shows cutaways of pumps and mills.

> [!tip] Make the explosion in the *same* direction for every part; a part that moves sideways is easily taken for a separate machine. The assembly line should enter and leave each part where the part's hole is.`,
  ideas: [
    'An exploded view moves each part along its assembly line, in the order of assembly, and draws the line dash-dot through the parts.',
    'In the isometric the gap between two coaxial discs must exceed (r₁ + r₂)/√2 for their outlines not to overlap on the paper.',
    'A cutaway removes a quarter or half of the object so that the inside is seen; the cut faces are hatched at an angle clearly different from the outlines.',
    'Parts nearer the viewer hide those behind them; the order of drawing, or a hidden-line routine, takes care of that.',
    'Both are easiest in an axonometric view, where parts keep their shapes and a stack of parts is a stack of ellipses on one line.'
  ],
  pitfalls: [
    'The explosion can go in any direction that looks good — Each part must move along the line on which it assembles; otherwise the picture lies about the assembly.',
    'The cut face is just an outline — A section must be marked: hatched, or tinted, so that the reader sees that the surface is cut material and not an outer surface.',
    'Shafts and pins are hatched like the rest — By convention solid parts that lie on the cutting plane (shafts, bolts, pins, keys) are not sectioned; they are drawn whole, though an illustration may break the rule.'
  ],
  formulas: [
    {
      name: 'Least gap between two coaxial discs in the isometric',
      expr: 'gmin = (r1 + r2)/sqrt(2)',
      tex: 'g_{\\min} = \\frac{r_1 + r_2}{\\sqrt2}',
      vars: {
        gmin: { name: 'least distance between the face centres', q: 'length', unit: 'mm', tex: 'g_{\\min}' },
        r1: { name: 'radius of the lower disc', q: 'length', unit: 'mm', value: 28 },
        r2: { name: 'radius of the upper disc', q: 'length', unit: 'mm', value: 13 }
      },
      solveFor: 'gmin',
      note: 'The rim ellipse of a disc of radius r reaches r/√2 above and below its face centre in the isometric drawing. For the 28 and 13 radius discs of the example: 29 mm.'
    },
    {
      name: 'Height of an exploded stack',
      expr: 'Hs = h1 + h2 + h3 + 2*g',
      tex: 'H_s = h_1 + h_2 + h_3 + 2g',
      vars: {
        Hs: { name: 'height of the exploded stack of three parts', q: 'length', unit: 'mm', tex: 'H_s' },
        h1: { name: 'height of the lowest part', q: 'length', unit: 'mm', value: 14 },
        h2: { name: 'height of the middle part', q: 'length', unit: 'mm', value: 26 },
        h3: { name: 'height of the top part', q: 'length', unit: 'mm', value: 70 },
        g: { name: 'gap between the parts', q: 'length', unit: 'mm', value: 50 }
      },
      solveFor: 'Hs',
      note: 'The vertical dimension is drawn true in the isometric drawing, so this is also the height on the paper (add the ellipse of the top part).'
    }
  ],
  examples: [
    {
      title: 'Spacing three parts',
      q: 'A plate 90 × 90 × 14, a bush of radius 28 and height 26, and a pin of radius 13 and length 70 are to be shown exploded on one vertical in an isometric drawing. Choose the gaps and find the height of the finished picture.',
      steps: [
        'The plate\'s top face is a rhombus reaching 45 above and below its centre; the bush rim ellipse reaches $28/\\sqrt2 = 19.8$ below the bush\'s underside. So the gap between the plate\'s top and the bush\'s underside must exceed about $45 + 19.8 = 65$; take 75.',
        { text: 'Bush to pin: ', tex: 'g_{\\min} = \\frac{28 + 13}{\\sqrt2} = 29\\ \\text{mm};\\ \\text{take } 39 .' },
        'Total from the plate\'s top face to the pin\'s top face: $75 + 26 + 39 + 70 = 210$, and the drawing adds the ellipse of the pin (9.2 mm) above and the plate\'s thickness 14 and its front corner (45) below: about 280 mm.'
      ],
      a: 'Gaps of 75 and 39 mm; the drawing is about 280 mm high.'
    },
    {
      title: 'Where is the cut?',
      q: 'A quarter is cut from the bush, the flange and the pin of an assembly drawn in the isometric from the front-right. Which quarter should be removed, and is the pin hatched?',
      steps: [
        'Remove the quarter nearest the viewer — in the isometric picture that is the quadrant between the right-hand and the left-hand axes facing the viewer — so that the two cut faces (each a plane through the axis) are both visible.',
        'The bush and the flange are cut and hatched; the pin is a solid shaft lying on the cutting plane and by convention is not sectioned: it is drawn whole, which shows it sitting in the bore.'
      ],
      a: 'The quadrant towards the viewer; bush and flange hatched, the pin left whole.'
    }
  ],
  quiz: [
    { q: 'What is the dash-dot line drawn through the parts of an exploded view?', choices: ['A hidden edge', 'The assembly line (axis) along which the parts fit', 'A section plane', 'A dimension line'], a: 1, why: 'It shows the path each part follows to its place and keeps the parts visibly aligned.' },
    { q: 'Two coaxial discs of radii 30 and 20 mm are exploded in the isometric drawing. What is the least gap between their face centres (mm) so that their outlines do not touch?', answer: 35.4, why: '$(30 + 20)/\\sqrt2 = 35.4$ mm.' },
    { q: 'In a cutaway of an assembly, a solid shaft lying on the cutting plane is normally', choices: ['hatched like the other parts', 'left whole, not sectioned', 'omitted from the picture', 'drawn dashed'], a: 1, why: 'The convention is that solid parts like shafts, pins and bolts are not sectioned when the cut passes along their axes.' },
    { q: 'Parts can be pulled apart in any direction without changing what the picture says.', a: false, why: 'Each part must move along its assembly line, in the order of assembly; otherwise the picture misrepresents how the thing goes together.' },
    { q: 'Why do exploded and cutaway views suit an axonometric projection better than a perspective?', choices: ['They do not; perspective is better', 'Parallel lines and sizes are preserved, so a stack of parts keeps its proportions along the axis', 'Axonometric drawings need no hidden lines', 'Perspective cannot show a bore'], a: 1, why: 'In perspective the parts of a stack shrink and converge; in the axonometric they keep their relative sizes and a vertical stack stays a vertical stack of equal ellipses.' }
  ],
  applications: [
    'Parts catalogues and service manuals, where each exploded picture carries numbered parts and a list.',
    'Assembly instructions for furniture and kits, which are drawn as exploded isometrics with the assembly lines shown.',
    'Technical illustration for textbooks and magazines: cutaway engines, aircraft and ships.',
    'Patent drawings, where an exploded view shows each part of a claimed assembly separately, with a numbering that the claims can cite.'
  ],
  history: 'Exploded drawings of machine parts appear in the notebooks of Leonardo da Vinci (the Madrid Codices, about 1490–1500), and printed books of machines from the sixteenth century on — Ramelli\'s *Le diverse et artificiose machine* (1588) — use cutaways to show mechanisms inside their housings. The modern exploded isometric grew with the parts catalogue in the nineteenth century and with the mass-produced kit in the twentieth.',
  sources: ['Agostino Ramelli, Le diverse et artificiose machine (Paris, 1588).', 'ISO 128 (technical drawings — general principles of presentation) and ISO 5456-3 for the pictorial projections.', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapters on pictorial drawing and sections.'],
  sim: 'ax-explode',
  construction: 'ax-exploded'
}
);
