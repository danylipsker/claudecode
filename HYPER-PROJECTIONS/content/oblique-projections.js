/* HYPER-PROJECTIONS · content/oblique-projections.js
 * The oblique family: oblique-projection, cavalier-projection, cabinet-projection, planometric-projection,
 * oblique-circles, parallel-perspective-in-art, isometric-in-games.
 */
Hyper.add(
{
  id: 'oblique-projection',
  parent: 'oblique-projections',
  title: 'Oblique projection',
  level: 1,
  short: 'Keep the object square to the picture plane and tilt the projectors instead: the front face is drawn true, and the depth runs off at an angle you choose, at a fraction of its length you choose. Two numbers — the angle and the ratio — make every oblique drawing.',
  keywords: ['oblique', 'cavalier', 'cabinet', 'receding axis', 'front face true', 'parallel projection', 'projector', 'shear', 'ratio'],
  prereq: ['parallel-vs-central', 'orthographic-projection', 'true-length-and-true-shape'],
  related: ['cavalier-projection', 'cabinet-projection', 'planometric-projection', 'oblique-circles', 'axonometric-scales', 'axonometric-projection'],
  body: `In an orthographic view the projectors are perpendicular to the picture plane, which is why a box seen square-on shows one face and hides the depth. The axonometric pictures turn the *object* to show three faces. The **oblique** projection does the opposite: the object stays square to the plane, with its front face parallel to it, and the **projectors are tilted**. Every face parallel to the plane is drawn in its true shape and size; the depth edges, which in the orthographic view are mere points, become lines running off at a fixed angle.

### The matrix
Take the picture plane as $z = 0$, the viewer on the $+z$ side, and let the depth axis, pointing away from the viewer, be drawn at the angle $a$ to the horizontal with the fraction $r$ of its length. Then
$$\\begin{bmatrix}x'\\\\y'\\end{bmatrix} = \\begin{bmatrix}1 & 0 & -r\\cos a\\\\ 0 & 1 & -r\\sin a\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\z\\end{bmatrix}.$$
The first two columns are the identity: $x$ and $y$ keep their true lengths. The third column is where the depth axis goes — length $r$, direction $a$ for a step *away* from the viewer. This is a **shear** of space along the depth axis, followed by the front view. Geometrically the projector through a point makes an angle $\\theta$ with the picture plane where $\\cot\\theta = r$, and its shadow on the plane points in the direction $a$. With $r = 0$ ($\\theta = 90°$) you have the plain front view. Cavalier is $r = 1$, cabinet $r = \\tfrac12$; any angle $a$ and any ratio $r$ are allowed, and they are independent.

### What is true and what is not
Anything parallel to the picture plane is true: lengths, angles, circles. All the receding lines are drawn at the same angle and the same ratio, so a depth measured on one line can be carried to any other by the dividers. A line in any other direction is found from its end points. The angle between a depth edge and a front edge is **not** true: a cube's right angle is drawn as $a$ or $180° - a$. And areas change: a face containing the depth axis is drawn $r\\sin a$ (top) or $r\\cos a$ (side) times as large.

### Why it can look wrong
No eye sees an oblique picture: it corresponds to a viewer whose sight lines are all parallel yet slanted against the plane in a way that no single viewpoint produces. For a modest $r$ the mind accepts it; at $r = 1$ a cube looks too deep, and the reason for halving the depth in the cabinet drawing is exactly that ([[cabinet-projection]]). Seen as a Pohlke picture ([[axonometric-scales]]) an oblique drawing is a cube seen by projectors inclined $\\arctan r$ from the normal.

### How it is drawn
Draw the front view exactly as for a working drawing, circles and all. Choose $a$ (30°, 45° or 60° are the set-square angles) and $r$. From each corner that shows, draw a receding line at $a$ and lay off the depth times $r$ with the dividers on all of them; join the ends with lines parallel to the front edges. The oblique is quick because **no ellipse is needed for a face parallel to the plane**: a round part is best drawn with its circular face to the front.

> [!tip] Orient the object so that the face with the most detail — curves, holes, a profile — is the front face. The oblique picture draws it for free.`,
  ideas: [
    'Oblique: the object stays square to the picture plane and the projectors are inclined; every face parallel to the plane is true, the depth runs off at an angle a at the ratio r.',
    'The matrix is the identity in x and y with the third column (−r cos a, −r sin a); the projectors make an angle θ with the plane where cot θ = r.',
    'a and r are independent: cavalier is r = 1, cabinet r = ½, the front view r = 0.',
    'Circles in the front face stay circles; in faces containing the depth they become ellipses, and areas of such faces are scaled by r sin a or r cos a.',
    'An oblique picture is a Pohlke picture of a cube under projectors inclined by arctan r to the normal.'
  ],
  pitfalls: [
    'The oblique angle is the angle of the viewing direction — It is the angle at which the receding axis is drawn on the paper. The projectors make a different angle, θ = arccot r, with the picture plane.',
    'Right angles are drawn as right angles — Only those in faces parallel to the plane. A right angle between a front edge and a depth edge is drawn as a or 180° − a.',
    'The ratio must be 1 or ½ — Those are the named conventions. Any ratio works; ⅔ and ¾ are used for a picture that looks better than the cavalier without shrinking the depth as far as the cabinet.'
  ],
  formulas: [
    {
      name: 'Angle of the projectors with the picture plane',
      expr: 'theta = atan(1/r)',
      tex: '\\theta = \\arctan\\frac{1}{r}\\qquad(\\cot\\theta = r)',
      vars: {
        theta: { name: 'angle between the projectors and the picture plane', q: 'angle', unit: '°', tex: '\\theta' },
        r: { name: 'ratio of the drawn depth to the true depth', value: 0.5, min: 0.05, max: 3 }
      },
      solveFor: 'theta',
      note: 'r = 1 gives 45° (cavalier), r = ½ gives 63.43° (cabinet), r → 0 gives 90°: the orthographic front view.'
    },
    {
      name: 'Width of the oblique drawing of a box',
      expr: 'Wd = w + r*d*cos(a)',
      tex: 'W_d = w + r\\,d\\cos a',
      vars: {
        Wd: { name: 'width of the drawing', q: 'length', unit: 'mm', tex: 'W_d' },
        w: { name: 'width of the front face', q: 'length', unit: 'mm', value: 100 },
        r: { name: 'ratio', value: 0.6, min: 0, max: 1.5 },
        d: { name: 'true depth', q: 'length', unit: 'mm', value: 80 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90 }
      },
      solveFor: 'Wd',
      note: 'The front face keeps its width; the receding edges add r d cos a.'
    },
    {
      name: 'Height of the oblique drawing of a box',
      expr: 'Hd = h + r*d*sin(a)',
      tex: 'H_d = h + r\\,d\\sin a',
      vars: {
        Hd: { name: 'height of the drawing', q: 'length', unit: 'mm', tex: 'H_d' },
        h: { name: 'height of the front face', q: 'length', unit: 'mm', value: 60 },
        r: { name: 'ratio', value: 0.6, min: 0, max: 1.5 },
        d: { name: 'true depth', q: 'length', unit: 'mm', value: 80 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 30, min: 0, max: 90 }
      },
      solveFor: 'Hd',
      note: 'Together with the width: the sheet needed for the drawing.'
    },
    {
      name: 'Area of the top face as drawn',
      expr: 'k = r*sin(a)',
      tex: 'k = r\\,\\sin a',
      vars: {
        k: { name: 'drawn area / true area of a face parallel to the base and the depth axis' },
        r: { name: 'ratio', value: 0.5, min: 0, max: 1.5 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'k',
      note: 'The parallelogram has base w and slant height r d sin a. Cavalier 45°: 0.707; cabinet 45°: 0.354. Side faces: r cos a.'
    }
  ],
  examples: [
    {
      title: 'A block in a general oblique',
      q: 'A block 100 wide, 60 high and 80 deep is drawn in oblique projection with the receding lines at 30° and the ratio 0.6. How much paper does the drawing need, and at what angle do the projectors meet the picture plane?',
      steps: [
        { text: 'The depth is drawn $0.6 \\times 80 = 48$ mm long, so the receding vector is', tex: '(48\\cos 30°,\\ 48\\sin 30°) = (41.6,\\ 24.0)\\ \\text{mm}.' },
        { text: 'The drawing is therefore', tex: '100 + 41.6 = 141.6\\ \\text{mm wide and}\\ 60 + 24 = 84\\ \\text{mm high}.' },
        { text: 'The projector angle:', tex: '\\theta = \\arctan(1/0.6) = 59.0° .' },
        'The top face is drawn $0.6\\sin 30° = 0.30$ times its true area, the right-hand face $0.6\\cos 30° = 0.52$ times.'
      ],
      a: '141.6 × 84 mm; projectors at 59.0° to the picture plane.'
    },
    {
      title: 'Choosing r for a given projector',
      q: 'The projectors of an oblique drawing are to make 60° with the picture plane. What ratio is needed, and how long is a true depth of 80 mm drawn?',
      steps: [
        { text: 'Since $\\cot\\theta = r$:', tex: 'r = \\cot 60° = 0.577 .' },
        'The drawn depth is $0.577 \\times 80 = 46.2$ mm — between the cabinet (40 mm, 63.4°) and the cavalier (80 mm, 45°).'
      ],
      a: 'r = 0.577; a depth of 80 mm is drawn 46.2 mm long.'
    }
  ],
  quiz: [
    { q: 'In an oblique drawing the faces that are drawn in true shape are those', choices: ['parallel to the picture plane', 'perpendicular to the picture plane', 'facing the viewer at 45°', 'parallel to the receding axis'], a: 0, why: 'The projectors are tilted but the front face stays parallel to the plane, so it is drawn exactly as in the front view.' },
    { q: 'What is the angle between the projectors and the picture plane when the ratio is 0.5 (cabinet)?', answer: 63.43, why: '$\\theta = \\arctan(1/r) = \\arctan 2 = 63.43°$.' },
    { q: 'A circle in the front face of an oblique drawing is drawn as an ellipse.', a: false, why: 'A face parallel to the picture plane is drawn true, so the circle is a circle, drawn with the compass.' },
    { q: 'The top face of a cube is drawn as a parallelogram. At a = 30° and r = 0.6 its area is what fraction of the true square?', choices: ['0.30', '0.52', '0.60', '1.00'], a: 0, why: 'The factor is $r\\sin a = 0.6 \\times 0.5 = 0.30$ (and the right-hand face $r\\cos a = 0.52$).' },
    { q: 'Which statement is true of every receding edge of an oblique drawing?', choices: ['They converge at a vanishing point', 'They are drawn at the same angle and the same ratio', 'They are drawn true length', 'They are perpendicular to the front edges'], a: 1, why: 'Parallel lines of the object stay parallel, and all depth edges share one angle a and one ratio r — that is what makes it a parallel projection.' }
  ],
  applications: [
    'Furniture, joinery and cabinet drawings, where the front elevation is the main thing and the depth is a hint.',
    'The three-dimensional axes of every mathematics textbook: x to the right, y up and z receding, are an oblique drawing.',
    'Round parts and profiles, which are drawn true on the front face with a compass: bearings, flanges, gears seen along the axis.',
    'Quick sketches and instruction diagrams, where the draughtsman needs only a T-square and one angle.',
    'The three-quarter view of old computer games: fronts true, ground seen from above.'
  ],
  history: 'Oblique views are far older than the theory. East Asian painters drew buildings and courtyards in a parallel oblique view for more than a thousand years ([[parallel-perspective-in-art]]), medieval European illuminators often showed buildings in a similar oblique view, and military engineers of the seventeenth century drew fortifications in "cavalier perspective" and "military perspective". The method entered the engineering schools as one of the parallel projections in the nineteenth century, next to the isometric.',
  sources: ['Francis D. K. Ching, Architectural Graphics (Wiley; the section on paraline drawings: plan obliques and elevation obliques).', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on oblique drawing.', 'ISO 5456, Technical drawings — Projection methods.'],
  sim: 'ob-lab',
  construction: 'ob-arch-block'
},

{
  id: 'cavalier-projection',
  parent: 'oblique-projections',
  title: 'Cavalier projection',
  level: 1,
  short: 'The oblique projection with the depth drawn at its full length (ratio 1), usually at 45°: every dimension of a box can be laid off true along all three axes, which makes it the simplest picture to draw and the most distorted to look at.',
  keywords: ['cavalier', 'oblique', 'ratio 1', 'full depth', '45 degrees', 'perspective cavalière', 'military perspective', 'cartesian axes'],
  prereq: ['oblique-projection', 'orthographic-projection', 'true-length-and-true-shape'],
  related: ['cabinet-projection', 'oblique-circles', 'planometric-projection', 'axonometric-scales'],
  body: `**Cavalier projection** is the oblique projection with ratio $r = 1$: the receding edges are drawn at the same length as the front ones. The projectors make $45°$ with the picture plane ($\\cot\\theta = 1$), so an object one unit deep shifts one unit sideways in the picture. The receding axis is usually drawn at $45°$, or at $30°$ or $60°$ with the set squares. The matrix is the oblique matrix with $r = 1$:
$$M = \\begin{bmatrix}1 & 0 & -\\cos a & 0\\\\ 0 & 1 & -\\sin a & 0\\\\ 0 & 0 & 1 & 0\\\\ 0 & 0 & 0 & 1\\end{bmatrix},$$
and a point one unit behind the front face lands one unit away from the point in front of it, in the direction $a$.

### Why it is easy
All three axes carry the same scale: the one scale on the drawing board measures the width, the height **and** the depth. The dividers carry any dimension to any axis. Round things on the front face are drawn with the compass, and a cylinder along the depth axis is two equal circles joined by two tangents (see the construction below). No ellipse is needed unless a circle lies in the top or a side face; then it is an ellipse with minor/major $\\sqrt{(1-|\\cos a|)/(1+|\\cos a|)}$: 0.41 at 45°, 0.27 at 30°.

### Why it looks wrong
The depth is too long. In any real view the depth edges of a cube are foreshortened, never as long as the front edges. In a cavalier drawing at $45°$ a cube of edge $a$ fills a bounding square of $a(1 + \\cos 45°) = 1.71\\,a$ and looks like a long box, not like a cube: the eye, expecting foreshortening along the depth, reads it as something stretched. The top face is drawn $\\sin a = 0.71$ times its true area, the side face $\\cos a = 0.71$ times: the faces containing the depth are lighter weights than the front, but they are drawn as long. This is the distortion that the [[cabinet-projection|cabinet projection]] cures by halving the depth.

### Names
In English *cavalier* means ratio 1. The word comes from the French *perspective cavalière*, "the view from a cavalier" — a raised work in a fortress from which defenders looked down — and the name is attached to the drawings of fortresses made by military engineers. In French schools *perspective cavalière* is the general oblique drawing of solid geometry, with the front face true, the receding lines at an angle and a *reduction coefficient* — which is often ½. So the same word means different ratios in the two languages; check which one a text uses.

> [!note] The x, y, z axes of a mathematics textbook, with x to the right, y up and z coming "out of the page" along a diagonal, are almost always a cavalier (or cabinet) drawing — and the axis along z is usually drawn shorter, a hint of the cabinet.`,
  ideas: [
    'Cavalier: oblique with ratio 1; the projectors make 45° with the plane; the depth is drawn at its true length, usually along a 45° (or 30°, 60°) line.',
    'All three axes share one scale, so dimensions are laid off with one ruler and the dividers carry any length to any axis.',
    'A circle in the front face is a true circle; a cylinder along the depth is two equal circles and two tangents; a circle in the top or a side face is an ellipse.',
    'The depth looks too long: a cube is drawn 1.71 a across; this is why the cabinet projection halves the depth.',
    'The French perspective cavalière is a general oblique with a reduction coefficient, often ½ — not the English cavalier.'
  ],
  pitfalls: [
    'Cavalier is the most realistic oblique — It is the least realistic: the full-length depth stretches the picture. It is the easiest to draw, not the best to look at.',
    'The 45° is the angle of the viewing direction — It is the angle of the receding axis on the paper. The projectors make 45° with the picture plane because r = 1, which is a different 45°.',
    'Circles in the top face are drawn with the ellipse template of the isometric — They are much flatter (0.41 at 45°) and tilted, with the major axis at 22.5° above the horizontal.'
  ],
  formulas: [
    {
      name: 'Bounding width of a cavalier drawing',
      expr: 'Wd = w + d*cos(a)',
      tex: 'W_d = w + d\\cos a',
      vars: {
        Wd: { name: 'width of the drawing', q: 'length', unit: 'mm', tex: 'W_d' },
        w: { name: 'width of the front face', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'depth of the object', q: 'length', unit: 'mm', value: 50 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'Wd',
      note: 'The height is h + d sin a. A cube of edge 50 at 45° needs 85.4 × 85.4.'
    },
    {
      name: 'Long semi-axis of the ellipse of a circle in the top face',
      expr: 'A = R*sqrt(1 + abs(cos(a)))',
      tex: 'A = R\\sqrt{1 + |\\cos a|}',
      vars: {
        A: { name: 'long semi-axis of the ellipse', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 25 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'A',
      note: 'For r = 1 the general formula simplifies. 45°: 1.307 R. 30°: 1.366 R. The major axis lies at a/2 above the horizontal.'
    },
    {
      name: 'Short semi-axis of the ellipse of a circle in the top face',
      expr: 'B = R*sqrt(1 - abs(cos(a)))',
      tex: 'B = R\\sqrt{1 - |\\cos a|}',
      vars: {
        B: { name: 'short semi-axis of the ellipse', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 25 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'B',
      note: '45°: 0.541 R. 30°: 0.366 R. The product A B = R² sin a is the area scale of the top face.'
    }
  ],
  examples: [
    {
      title: 'A cube and a circle on top',
      q: 'A cube of edge 50 mm is drawn in cavalier projection at 45°, and a circle of diameter 50 mm is drawn in its top face. What are the sizes of the drawing and of the ellipse?',
      steps: [
        { text: 'The drawing: ', tex: '50 + 50\\cos 45° = 85.4\\ \\text{mm in both directions}.' },
        { text: 'The ellipse, with $R = 25$:', tex: 'A = 25\\sqrt{1.707} = 32.7,\\qquad B = 25\\sqrt{0.293} = 13.5\\ \\text{mm}.' },
        'So the axes are 65.3 and 27.1 mm, the minor/major ratio is 0.41, and the major axis lies at $22.5°$ above the horizontal. Its area is $\\pi \\times 32.7 \\times 13.5$, i.e. $0.707$ of the circle\'s.'
      ],
      a: 'The drawing is 85.4 × 85.4 mm; the ellipse has axes 65.3 × 27.1 mm at 22.5°.'
    },
    {
      title: 'Cavalier at 30°',
      q: 'The same circle (R = 25 mm) in the top face of a cavalier drawing with the receding axis at 30°. How much flatter is the ellipse?',
      steps: [
        { text: 'With $\\cos 30° = 0.866$:', tex: 'A = 25\\sqrt{1.866} = 34.1,\\qquad B = 25\\sqrt{0.134} = 9.2\\ \\text{mm}.' },
        'The ratio $B/A = 0.27$ against 0.41 at 45°, and the major axis lies at 15°: the shallower the receding axis, the flatter the top.'
      ],
      a: 'Axes 68.3 × 18.3 mm, ratio 0.27, major axis at 15°.'
    }
  ],
  quiz: [
    { q: 'In a cavalier drawing a depth of 60 mm is drawn how long (mm)?', answer: 60, why: 'The ratio is 1: the depth is laid off at its true length along the receding line.' },
    { q: 'The projectors of a cavalier drawing make what angle with the picture plane?', choices: ['30°', '45°', '63.4°', '90°'], a: 1, why: '$\\cot\\theta = r = 1$, so $\\theta = 45°$.' },
    { q: 'Why does a cube drawn in cavalier projection look too deep?', choices: ['The front face is distorted', 'The depth is drawn at its full length although a real view would foreshorten it', 'The receding lines converge', 'The top face is drawn too large'], a: 1, why: 'A real eye sees depth foreshortened; the cavalier lays it off true, so the box looks stretched.' },
    { q: 'The semi-axes of the ellipse of a circle of radius R in the top face of a cavalier drawing at 45° are about', choices: ['R and R', '1.31 R and 0.54 R', '1.0 R and 0.5 R', '2 R and 1 R'], a: 1, why: '$A = R\\sqrt{1 + \\cos 45°} = 1.31R$, $B = R\\sqrt{1 - \\cos 45°} = 0.54R$.' },
    { q: 'The French "perspective cavalière" always means a ratio of 1.', a: false, why: 'In French school geometry it is the general oblique drawing with a reduction coefficient, often ½.' }
  ],
  applications: [
    'Quick sketches of boxes and machines for assembly and for explaining a job in the workshop: one scale, one angle.',
    'Mathematics and physics diagrams of vectors, coordinate axes and solids.',
    'Parts with a round profile on the front face: pulleys, flanges, bearings, tubes along the depth axis.',
    'Early computer graphics and pen plotters, where the oblique matrix was the cheapest way to show three dimensions.'
  ],
  history: 'The name is usually traced to the French military engineers\' *perspective cavalière* of the seventeenth century, the view of a fortress as seen from a *cavalier*, a raised platform. English drafting books took the term for the ratio-1 oblique and set it beside the cabinet projection; the textbook habit of drawing coordinate axes this way is older than any standard.',
  sources: ['French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on oblique drawing.', 'Francis D. K. Ching, Architectural Graphics (the section on paraline drawings).', 'ISO 5456, Technical drawings — Projection methods.'],
  sim: { id: 'ob-lab', params: { preset: 'cavalier' } },
  construction: 'ob-cavalier-box'
},

{
  id: 'cabinet-projection',
  parent: 'oblique-projections',
  title: 'Cabinet projection',
  level: 1,
  short: 'The oblique projection with the depth halved (ratio ½, projectors at 63.4°): the front face is true, the depth is a hint, and a cube looks like a cube. It is the picture furniture makers draw and the one most 3-D charts and old game maps use.',
  keywords: ['cabinet', 'oblique', 'ratio 1/2', 'half depth', 'furniture', 'projector 63.4', 'three-quarter view', 'ellipse'],
  prereq: ['oblique-projection', 'cavalier-projection', 'true-length-and-true-shape'],
  related: ['oblique-circles', 'planometric-projection', 'axonometric-scales', 'game-cameras'],
  body: `**Cabinet projection** is the oblique projection with the ratio $r = \\tfrac12$: the receding edges are drawn at half their true length, normally along a $45°$ line (sometimes 30° or 60°). The projectors make $\\theta = \\arctan 2 = 63.43°$ with the picture plane. Its advantage over the cavalier is simply how it looks: halving the depth takes out most of the stretched appearance, and a cube is recognisably a cube. The matrix is the oblique one with $r = \\tfrac12$:
$$M = \\begin{bmatrix}1 & 0 & -\\tfrac12\\cos a & 0\\\\ 0 & 1 & -\\tfrac12\\sin a & 0\\\\ 0 & 0 & 1 & 0\\\\ 0 & 0 & 0 & 1\\end{bmatrix}.$$
There is no deep reason for $\\tfrac12$: it is a ratio at which most people stop noticing the distortion, and it is easy to draw — halve the depth with the dividers or by bisecting. Some drawings use $\\tfrac23$ or $\\tfrac34$ when more depth is wanted.

### What changes against the cavalier
The front face and everything in it are exactly as before. The drawing is smaller: a cube of edge $a$ at 45° needs $a(1 + \\tfrac12\\cos 45°) = 1.35\\,a$ across instead of $1.71\\,a$. The top face is drawn $\\tfrac12\\sin 45° = 0.35$ times its true area and the right face the same; they are much lighter than the front, which is what the eye expects of a shallow view. A circle in the top face becomes a *flatter* ellipse than in the cavalier: with $a = 45°$ its semi-axes are $1.068\\,R$ and $0.331\\,R$ (ratio $0.31$) and the major axis is only $7.0°$ above the horizontal — almost horizontal, since the depth axis contributes little.

### Drawing it
Draw the front view; from the three corners that show, run 45° lines, mark half of the depth on each, and complete with parallels. A circle in the front face is a compass circle. For a circle in the top face use the eight-point method from the front circle (see the construction below): the vertical lines through its eight points mark the abscissas on the top edge; the same distances **halved** go on the receding edge; the grid through them gives the eight points of the ellipse. Or choose an ellipse template of the nearest ratio — templates are marked with the angle whose sine is the ratio, and 0.31 lies between the 15° and 20° ones — and set its major axis at about 7°.

### Where it belongs
Cabinet drawings suit anything with a "front": a cupboard with its doors and drawers, a stage set, a building elevation with a hint of depth, a bar chart with 3-D bars. They fail where depth is the subject — a drawing of a long shaft along the depth axis loses half its length.

> [!tip] Choose the receding angle so that the side you want to see best is the visible one: a line rising to the right shows the right-hand side and the top; rising to the left, the left side. And keep the angle the same on every receding line in the drawing.`,
  ideas: [
    'Cabinet: oblique with ratio ½, usually along 45°; the projectors make 63.4° (arctan 2) with the plane.',
    'Halving the depth removes most of the stretched look of the cavalier; the bounding box of a cube at 45° is 1.35 a instead of 1.71 a.',
    'The top and side faces are drawn 0.35 times their true area at 45° — much lighter than the front.',
    'A circle in the top face is a flat ellipse with semi-axes 1.068 R and 0.331 R and the major axis only 7° above the horizontal.',
    'Best for objects with a rich front (cabinets, elevations, bar charts); poor where the depth is the subject.'
  ],
  pitfalls: [
    'The cabinet halves every dimension — Only the lengths along the depth axis; the width and height stay at their true values.',
    'The ellipse in the top face is the same as in the cavalier — It is much flatter (minor/major 0.31 against 0.41) and nearly horizontal, since the half depth tilts it less.',
    'The cabinet projection is a perspective — It is a parallel projection: the receding lines are parallel and do not converge; the halving only imitates foreshortening.'
  ],
  formulas: [
    {
      name: 'Width of a cabinet drawing',
      expr: 'Wd = w + d*cos(a)/2',
      tex: 'W_d = w + \\tfrac12\\,d\\cos a',
      vars: {
        Wd: { name: 'width of the drawing', q: 'length', unit: 'mm', tex: 'W_d' },
        w: { name: 'width of the front face', q: 'length', unit: 'mm', value: 80 },
        d: { name: 'depth of the object', q: 'length', unit: 'mm', value: 80 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'Wd',
      note: 'The height is h + ½ d sin a. A cube of edge 80 at 45° needs 108.3 × 108.3.'
    },
    {
      name: 'Projector angle of the cabinet',
      expr: 'theta = atan(2)',
      tex: '\\theta = \\arctan 2',
      vars: {
        theta: { name: 'angle between the projectors and the picture plane', q: 'angle', unit: '°', tex: '\\theta' }
      },
      solveFor: 'theta',
      note: '63.43°. For any ratio r: θ = arctan(1/r).'
    },
    {
      name: 'Long semi-axis of the ellipse in the top face (r = ½)',
      expr: 'A = R*sqrt(((1 + 0.25) + sqrt((1 + 0.25)^2 - sin(a)^2))/2)',
      tex: 'A = R\\sqrt{\\frac{\\tfrac54 + \\sqrt{\\tfrac{25}{16} - \\sin^2 a}}{2}}',
      vars: {
        A: { name: 'long semi-axis of the ellipse', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 40 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'A',
      note: 'The general formula with r = ½ (the product of the two semi-axes is R² · ½ sin a). 45°: 1.068 R; 30°: 1.094 R.'
    },
    {
      name: 'Short semi-axis of the ellipse in the top face (r = ½)',
      expr: 'B = R*sqrt(((1 + 0.25) - sqrt((1 + 0.25)^2 - sin(a)^2))/2)',
      tex: 'B = R\\sqrt{\\frac{\\tfrac54 - \\sqrt{\\tfrac{25}{16} - \\sin^2 a}}{2}}',
      vars: {
        B: { name: 'short semi-axis of the ellipse', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 40 },
        a: { name: 'angle of the receding axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'B',
      note: '45°: 0.331 R; 30°: 0.228 R.'
    }
  ],
  examples: [
    {
      title: 'A wardrobe at 1 : 20',
      q: 'A wardrobe 1200 wide, 2000 high and 600 deep is shown in cabinet projection at 45°, scale 1 : 20. What sheet size is the drawing, and how far is the back edge offset?',
      steps: [
        'Scale 1 : 20: the front face is $60 \\times 100$ mm; the depth is $600/20 = 30$ mm, drawn at half: 15 mm.',
        { text: 'The offset of the back along the 45° line:', tex: '15\\cos 45° = 10.6\\ \\text{mm to the right and 10.6 mm up}.' },
        'The drawing is $60 + 10.6 = 70.6$ mm wide and $100 + 10.6 = 110.6$ mm high.'
      ],
      a: '70.6 × 110.6 mm, the back offset 10.6 mm right and up.'
    },
    {
      title: 'The circle on the lid',
      q: 'A circular lid of radius 40 mm lies on the top face of a cabinet-projection cube. Give the size and tilt of its ellipse.',
      steps: [
        { text: 'From the formulas with $r = \\tfrac12$ and $a = 45°$:', tex: 'A = 40 \\times 1.068 = 42.7,\\qquad B = 40 \\times 0.331 = 13.2\\ \\text{mm}.' },
        'The ellipse is $85.4 \\times 26.5$ mm, minor/major $0.31$, with its major axis $7.0°$ above the horizontal. In the cavalier version it would be $104.6 \\times 43.3$ mm at $22.5°$ — noticeably rounder and more tilted.'
      ],
      a: 'An ellipse 85.4 × 26.5 mm with its major axis at 7° above the horizontal.'
    }
  ],
  quiz: [
    { q: 'In a cabinet drawing a depth of 60 mm is drawn how long (mm)?', answer: 30, why: 'The cabinet ratio is ½: 30 mm.' },
    { q: 'The projectors of the cabinet projection make what angle with the picture plane?', choices: ['45°', '30°', '63.4°', '26.6°'], a: 2, why: '$\\cot\\theta = \\tfrac12$, $\\theta = \\arctan 2 = 63.4°$ ($26.6°$ is the angle from the normal).' },
    { q: 'Compared with the cavalier drawing of the same cube at 45°, the cabinet drawing', choices: ['has a larger front face', 'has the same front face and a shallower depth', 'has a distorted front face', 'has converging edges'], a: 1, why: 'The front face is untouched; only the depth is halved.' },
    { q: 'The ellipse of a circle in the top face of a cabinet drawing at 45° has a major axis at about', choices: ['0°', '7°', '22.5°', '45°'], a: 1, why: 'For r = ½ the tilt is $\\tfrac12\\arctan\\!\\big(r^2\\sin 2a/(1 + r^2\\cos 2a)\\big) = 7.0°$.' },
    { q: 'A cabinet drawing is a kind of perspective.', a: false, why: 'It is a parallel projection: the receding lines are parallel. Halving the depth only imitates the foreshortening of a perspective.' }
  ],
  applications: [
    'Furniture and joinery: the front with its doors and drawers drawn true, the depth indicated.',
    'Interior and stage-set sketches in which the front elevation matters most.',
    'Three-dimensional bar charts and diagrams in presentations and spreadsheets.',
    'The three-quarter view of 8- and 16-bit adventure games: fronts true, ground seen from above.'
  ],
  history: 'The name comes from the cabinet-makers, for whom the front elevation of a piece of furniture is its picture and the depth a note. The ratio ½ settled in the drafting textbooks, beside the cavalier, as the oblique that "looks right"; nothing in geometry fixes it, and an eye accustomed to photographs prefers something close to it.',
  sources: ['French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on oblique drawing.', 'Francis D. K. Ching, Architectural Graphics (elevation obliques).', 'ISO 5456, Technical drawings — Projection methods.'],
  sim: { id: 'ob-lab', params: { preset: 'cabinet' } },
  construction: 'ob-cabinet-box'
},

{
  id: 'planometric-projection',
  parent: 'oblique-projections',
  title: 'Planometric (military) projection',
  level: 2,
  short: 'An oblique projection onto the horizontal: the floor plan is drawn true to shape, simply turned (usually 45°, or 30°/60°), and the heights are raised vertically. It shows rooms, walls and layouts in one picture and can be made from the plan you already have.',
  keywords: ['planometric', 'military projection', 'plan oblique', 'horizontal oblique', 'floor plan', 'bird\'s-eye', 'architecture', 'axonometric', 'vertical scale'],
  prereq: ['oblique-projection', 'cavalier-projection', 'true-length-and-true-shape'],
  related: ['axonometric-projection', 'isometric-drawing', 'architectural-drawings', 'game-cameras'],
  body: `In an ordinary oblique drawing the **front elevation** is the face drawn true. In the **planometric projection** (also *plan oblique*, *horizontal oblique*, and, in older books, *military projection*) the face drawn true is the **plan**: the picture plane is horizontal, the plan keeps its shape, every right angle in it stays a right angle, and the heights go straight up the paper at true scale. It is exactly the oblique matrix with the roles of the axes changed. With the plan turned counter-clockwise by $a$ and the height scaled by $q$ (1 for a true-scale planometric),
$$\\begin{bmatrix}x'\\\\y'\\end{bmatrix} = \\begin{bmatrix}\\cos a & 0 & \\sin a\\\\ \\sin a & q & -\\cos a\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\z\\end{bmatrix},$$
where the $x$ and $z$ columns are the plan turned through $a$ and the middle column is the vertical. The projectors make $\\theta = \\arctan(1/q)$ with the ground: $45°$ for $q = 1$.

### How it is made
Start from the floor plan, which an architect has anyway. Turn it through $45°$ (or put the long wall at $30°$ and the short one at $60°$) — with the 45° set square on the T-square the plan is redrawn at once, since every plan line is simply drawn along the 45° or 135° line at its true length. At each corner of the walls raise a vertical of the wall height with the dividers, join the tops, and line in what is visible. A ground floor drawn this way with a **roof removed** shows the rooms; with the roof on, the building appears as a block. Heights are true, so a door that is 2.1 m high is drawn 2.1 m high at the plan scale.

### Against the isometric
The isometric turns the plan into a distorted rhombus (a 90° corner becomes 120° or 60°), and the planometric does not; a square room stays a square and a circle on the floor stays a circle. The price is a more severe look: walls are seen at 45° above, their heights are in full proportion with the plan, and a tall building seems to lean over the street. For a view from below ("worm's-eye") the same matrix is used with the height pointing downward.

### Size on the sheet
A plan $L \\times D$ turned through $a$ with a building height $H$ needs
$$W_d = L\\cos a + D\\sin a,\\qquad H_d = L\\sin a + D\\cos a + qH.$$
At $45°$ both ground dimensions become $(L + D)/\\sqrt2$.

> [!tip] The planometric is the quickest way to turn a floor plan into a picture of the rooms: trace the plan on tracing paper at 45°, then draw the verticals. Trees, furniture and figures can be added from their own plans in the same way.`,
  ideas: [
    'Planometric (plan oblique, military projection): the picture plane is horizontal, the plan is drawn true turned through an angle (45° or 30°/60°), the heights are raised vertically.',
    'The matrix has the plan rotated in its x, z columns and the vertical y column (0, q): the projectors make arctan(1/q) with the ground, 45° for q = 1.',
    'Against the isometric: right angles of the plan stay right angles, circles on the floor stay circles; the price is a steeper, more severe view.',
    'The drawing of a plan L × D with height H is L cos a + D sin a wide and L sin a + D cos a + qH high.',
    'It is the architect\'s way to turn the plan he has into a picture of the rooms, with the roof taken off.'
  ],
  pitfalls: [
    'The planometric is just an isometric at 45° — The isometric tilts the object and distorts every face; the planometric keeps the plan exactly true and is an oblique, not an orthographic, projection.',
    'Heights must be shortened — They are laid off at true scale in the planometric; reducing them (q < 1) is a choice that makes the picture look flatter, not a rule.',
    'Rotate the whole drawing, not the plan — The plan is drawn already turned; do not draw it flat and then rotate the sheet, or the T-square and set squares stop working for you.'
  ],
  formulas: [
    {
      name: 'Width of the planometric drawing',
      expr: 'Wd = L*cos(a) + D*sin(a)',
      tex: 'W_d = L\\cos a + D\\sin a',
      vars: {
        Wd: { name: 'width of the drawing', q: 'length', unit: 'm', tex: 'W_d' },
        L: { name: 'length of the plan', q: 'length', unit: 'm', value: 12 },
        D: { name: 'depth of the plan', q: 'length', unit: 'm', value: 8 },
        a: { name: 'angle by which the plan is turned', q: 'angle', unit: '°', value: 45, min: 0, max: 90 }
      },
      solveFor: 'Wd',
      note: 'The plan is a rectangle turned through a; this is the width of its bounding box. At 45°: (L + D)/√2.'
    },
    {
      name: 'Height of the planometric drawing',
      expr: 'Hd = L*sin(a) + D*cos(a) + q*Hb',
      tex: 'H_d = L\\sin a + D\\cos a + q\\,H_b',
      vars: {
        Hd: { name: 'height of the drawing', q: 'length', unit: 'm', tex: 'H_d' },
        L: { name: 'length of the plan', q: 'length', unit: 'm', value: 12 },
        D: { name: 'depth of the plan', q: 'length', unit: 'm', value: 8 },
        a: { name: 'angle by which the plan is turned', q: 'angle', unit: '°', value: 45, min: 0, max: 90 },
        q: { name: 'vertical scale', value: 1, min: 0, max: 1.5 },
        Hb: { name: 'height of the building', q: 'length', unit: 'm', value: 6, tex: 'H_b' }
      },
      solveFor: 'Hd',
      note: 'The height of the bounding box of the turned plan plus the raised walls.'
    },
    {
      name: 'Angle of the projectors with the ground',
      expr: 'theta = atan(1/q)',
      tex: '\\theta = \\arctan\\frac1q',
      vars: {
        theta: { name: 'angle between the projectors and the ground plane', q: 'angle', unit: '°', tex: '\\theta' },
        q: { name: 'vertical scale', value: 1, min: 0.05, max: 3 }
      },
      solveFor: 'theta',
      note: 'q = 1: 45°; q = ½: 63.4°. A reduced vertical scale is a steeper view from above.'
    }
  ],
  examples: [
    {
      title: 'A small house on the sheet',
      q: 'A house 12 m × 8 m and 6 m high is drawn as a planometric at 45° and the scale 1 : 100. What sheet does it need?',
      steps: [
        { text: 'Turned through 45° the plan has the bounding box', tex: '\\frac{12 + 8}{\\sqrt2} = 14.1\\ \\text{m wide and 14.1 m deep on the ground}.' },
        { text: 'The raised walls add the true height:', tex: 'H_d = 14.1 + 6 = 20.1\\ \\text{m}.' },
        'At 1 : 100 that is $141 \\times 201$ mm.'
      ],
      a: '141 mm wide and 201 mm high.'
    },
    {
      title: 'The 30° / 60° version',
      q: 'The same house with the long wall drawn at 30° to the horizontal: how large is the drawing at 1 : 100?',
      steps: [
        { text: 'With $a = 30°$:', tex: 'W_d = 12\\cos 30° + 8\\sin 30° = 10.4 + 4.0 = 14.4\\ \\text{m},\\quad H_d = 12\\sin 30° + 8\\cos 30° + 6 = 6.0 + 6.9 + 6 = 18.9\\ \\text{m}.' },
        'At 1 : 100: $144 \\times 189$ mm. The long wall is shallower, so more of its outer face is seen.'
      ],
      a: '144 × 189 mm.'
    }
  ],
  quiz: [
    { q: 'In a planometric projection the face that is drawn in true shape is', choices: ['the front elevation', 'the plan', 'the side elevation', 'none; all faces are distorted'], a: 1, why: 'The picture plane is horizontal, so every horizontal section of the object, and the plan, keeps its shape.' },
    { q: 'A square room is drawn in a planometric at 45°. In the picture it is', choices: ['a square turned through 45°', 'a rhombus with 60° and 120° corners', 'a parallelogram with 45° corners', 'a rectangle with the ratio √2'], a: 0, why: 'The plan is true: right angles stay right angles. (The isometric would make it a rhombus.)' },
    { q: 'The plan 10 m × 6 m is drawn at 45° with a wall height of 3 m (q = 1). How high is the drawing (m)?', answer: 14.3, why: '$H_d = (10 + 6)/\\sqrt2 + 3 = 11.3 + 3 = 14.3$ m.' },
    { q: 'The heights in a planometric are normally laid off at true scale.', a: true, why: 'The vertical column of the matrix is (0, q) with q = 1: heights are true, so a wall of 3 m is drawn 3 m high at the plan\'s scale.' },
    { q: 'Why is a planometric called a "military" projection?', choices: ['It was invented by an army general', 'It was used by military engineers to draw fortifications from their plans', 'It uses military ranks for axes', 'It shows only walls'], a: 1, why: 'Fortification plans were turned and raised in this way by military engineers from the seventeenth century.' }
  ],
  applications: [
    'Architectural plans turned into pictures: the rooms of a floor shown with their walls, furniture and fittings.',
    'Urban design and massing studies drawn from the site plan.',
    'Board-game and strategy-game maps, which want a true plan with some height.',
    'Interior layout drawings and kitchens, where the plan dimensions must be readable.'
  ],
  history: 'Military engineers of the seventeenth and eighteenth centuries drew fortresses by turning the plan and raising the works vertically, a method they called military perspective. It spread into architectural drawing in the nineteenth century as the plan-based axonometric, and the modernists took it up in the twentieth: the axonometric drawings of the De Stijl architects van Doesburg and van Eesteren (1923), and later the worm\'s-eye axonometrics of James Stirling, are built on the same idea.',
  sources: ['Francis D. K. Ching, Architectural Graphics (plan obliques).', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology, the chapter on oblique drawing.', 'Yve-Alain Bois, Metamorphosis of Axonometry, Daidalos 1 (1981).'],
  sim: { id: 'ob-lab', params: { preset: 'plan' } },
  construction: 'ob-planometric'
},

{
  id: 'oblique-circles',
  parent: 'oblique-projections',
  title: 'Circles in oblique views',
  level: 2,
  short: 'A circle in a face parallel to the picture plane is a true circle; in any face that contains the depth axis it is an ellipse inscribed in the parallelogram of its square. The half-sides are conjugate diameters, the axes are found by Rytz\'s construction, and a handful of points carried with dividers draw the curve.',
  keywords: ['ellipse', 'oblique circle', 'conjugate diameters', 'Rytz', 'parallelogram method', 'eight points', 'ellipse template', 'semi-axes'],
  prereq: ['oblique-projection', 'cabinet-projection', 'math:ellipse'],
  related: ['isometric-circles', 'cavalier-projection', 'axonometric-scales', 'circles-in-perspective'],
  body: `In an oblique drawing the **front face is true**, so a circle in it is drawn with the compass. In the faces that contain the depth axis — the top and the sides — the square around the circle becomes a **parallelogram** and the circle becomes the ellipse inscribed in it. The circle touches the square at the midpoints of its sides, and so the ellipse touches the parallelogram at the midpoints of *its* sides. The two lines joining opposite midpoints — the half-base $\\mathbf e_1 = (R, 0)$ and the half-depth $\\mathbf e_2 = R\\,r\\,(\\cos a, \\sin a)$ — are **conjugate semi-diameters**: any point of the ellipse is $\\mathbf c + \\mathbf e_1\\cos t + \\mathbf e_2\\sin t$.

### The axes
They are not along the sides. Put $G = \\mathbf e_1\\mathbf e_1^{\\mathsf T} + \\mathbf e_2\\mathbf e_2^{\\mathsf T}$; its eigenvalues are the squares of the semi-axes, and with $T = 1 + r^2$:
$$A,\\ B = R\\sqrt{\\frac{T \\pm \\sqrt{T^2 - 4r^2\\sin^2 a}}{2}},\\qquad \\tan 2\\psi = \\frac{r^2\\sin 2a}{1 + r^2\\cos 2a},$$
$\\psi$ being the angle of the major axis to the base. Check the product: $AB = R^2\\,r\\sin a$, the area scale of the face. Cavalier 45°: $A = 1.307R$, $B = 0.541R$, $\\psi = 22.5°$. Cabinet 45°: $1.068R$, $0.331R$, $7.0°$. Cavalier 30°: $1.366R$, $0.366R$, $15°$. The nearer the receding side stands to the vertical ($a$ towards 90°), the rounder the ellipse; at $a = 0$ it collapses to a line.

### Rytz's construction
The classical way to find the axes from conjugate semi-diameters $CA$ and $CB$ with ruler and compass: rotate $CA$ through $90°$ about $C$ to $CA'$; join $A'$ to $B$ and find its midpoint $M$; draw the circle about $M$ through $C$; it cuts the line $A'B$ at $P$ and $Q$. The lines $CP$ and $CQ$ are the directions of the axes (perpendicular, because $PQ$ is a diameter of the circle through $C$), and the semi-axes are the distances $BP$ and $BQ$, the longer one measured along $CQ$. With the axes and their lengths the ellipse can be drawn with a trammel, a template or a string.

### Drawing it without the axes
Usually you don't need them. The **parallelogram method** carries points of the true circle to the drawing: take the abscissas and ordinates of twelve (or eight) points of the circle in its square, lay the abscissas along the base of the parallelogram and the ordinates along the receding side — multiplied by $r$ — and draw the parallels. They cross in the points of the ellipse; a French curve then finishes it. With $R = 40$ the twelve points of the circle give the marks $\\pm40,\\ \\pm34.6,\\ \\pm20,\\ 0$. For rough work an ellipse template of the nearest ratio will do: templates are labelled by the angle whose sine is the minor/major ratio (0.31 lies between the 15° and 20° templates, 0.41 is close to the 25° one), and the major axis is set at $\\psi$.

> [!warn] Do not use the four-centre method of the isometric: it works only when the conjugate diameters make a particular angle. For an oblique face use the parallelogram method or the axes.`,
  ideas: [
    'A circle parallel to the picture plane is a true circle; in a face that contains the depth axis it becomes the ellipse inscribed in the parallelogram of its square.',
    'The half-base and the half-depth are conjugate semi-diameters: the ellipse is c + e₁ cos t + e₂ sin t.',
    'The semi-axes are R √((T ± √(T² − 4r² sin² a))/2) with T = 1 + r²; the product is R² r sin a, the area scale.',
    'Rytz\'s construction finds the axes from the conjugate diameters with set square, dividers and compass.',
    'The parallelogram method carries twelve or eight points of the circle to the drawing and needs neither the axes nor the formula.'
  ],
  pitfalls: [
    'The axes of the ellipse run along the sides of the parallelogram — They do not; the sides are conjugate diameters. The axes are rotated against them, and only for a = 90° do they coincide.',
    'The ellipse touches the parallelogram at the ends of its axes — It touches at the midpoints of the sides, which are the ends of the conjugate diameters.',
    'The isometric four-centre method fits every oblique ellipse — It does not; it needs the special geometry of the isometric square. Use the parallelogram points or the axes.'
  ],
  formulas: [
    {
      name: 'Long semi-axis of the ellipse',
      expr: 'A = R*sqrt(((1 + r^2) + sqrt((1 + r^2)^2 - 4*r^2*sin(a)^2))/2)',
      tex: 'A = R\\sqrt{\\frac{(1 + r^2) + \\sqrt{(1 + r^2)^2 - 4r^2\\sin^2 a}}{2}}',
      vars: {
        A: { name: 'long semi-axis', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 40 },
        r: { name: 'ratio of the receding side', value: 0.5, min: 0.05, max: 1.5 },
        a: { name: 'angle of the receding side', q: 'angle', unit: '°', value: 45, min: 0.1, max: 90 }
      },
      solveFor: 'A',
      note: 'Cavalier 45°: 1.307 R. Cabinet 45°: 1.068 R. The axes of the ellipse are the eigenvalues of G = e₁e₁ᵀ + e₂e₂ᵀ.'
    },
    {
      name: 'Short semi-axis of the ellipse',
      expr: 'B = R*sqrt(((1 + r^2) - sqrt((1 + r^2)^2 - 4*r^2*sin(a)^2))/2)',
      tex: 'B = R\\sqrt{\\frac{(1 + r^2) - \\sqrt{(1 + r^2)^2 - 4r^2\\sin^2 a}}{2}}',
      vars: {
        B: { name: 'short semi-axis', q: 'length', unit: 'mm' },
        R: { name: 'radius of the circle', q: 'length', unit: 'mm', value: 40 },
        r: { name: 'ratio of the receding side', value: 0.5, min: 0.05, max: 1.5 },
        a: { name: 'angle of the receding side', q: 'angle', unit: '°', value: 45, min: 0.1, max: 90 }
      },
      solveFor: 'B',
      note: 'Cavalier 45°: 0.541 R. Cabinet 45°: 0.331 R. A·B = R² r sin a.'
    },
    {
      name: 'Angle of the major axis',
      expr: 'psi = atan2(r^2*sin(2*a), 1 + r^2*cos(2*a))/2',
      tex: '\\psi = \\tfrac12\\operatorname{atan2}\\!\\left(r^2\\sin 2a,\\ 1 + r^2\\cos 2a\\right)',
      vars: {
        psi: { name: 'angle of the major axis to the base', q: 'angle', unit: '°', tex: '\\psi' },
        r: { name: 'ratio of the receding side', value: 0.5, min: 0.05, max: 1.5 },
        a: { name: 'angle of the receding side', q: 'angle', unit: '°', value: 45, min: 0.1, max: 89 }
      },
      solveFor: 'psi',
      note: 'Cavalier 45°: 22.5° (r = 1 gives ψ = a/2). Cabinet 45°: 7.0°.'
    }
  ],
  examples: [
    {
      title: 'The circle on the lid of a cabinet cube, by formula and by Rytz',
      q: 'A circle of radius R = 40 mm in the top face of a cabinet cube (r = ½, a = 45°). Find the axes by the formula, and check them with Rytz\'s construction.',
      steps: [
        { text: 'By formula, $T = 1.25$ and $T^2 - 4r^2\\sin^2 a = 1.5625 - 0.5 = 1.0625$:', tex: 'A = 40\\sqrt{\\tfrac{1.25 + 1.0308}{2}} = 42.7,\\qquad B = 40\\sqrt{\\tfrac{1.25 - 1.0308}{2}} = 13.2\\ \\text{mm}.' },
        'By Rytz: the semi-diameters are $\\mathbf e_1 = (40, 0)$ and $\\mathbf e_2 = (14.1, 14.1)$. Rotating $\\mathbf e_1$ gives $A\' = (0, 40)$; the midpoint of $A\'B$ is $M = (7.1, 27.1)$ with radius $|MC| = 28.0$; the circle cuts $A\'B$ at points whose distances from $B$ are $13.2$ and $42.7$ mm — the semi-axes.',
        'The major axis lies along $CQ$, at $\\psi = 7.0°$ to the base. Both routes agree.'
      ],
      a: 'Semi-axes 42.7 and 13.2 mm, major axis 7.0° above the base.'
    },
    {
      title: 'Which template?',
      q: 'You draw a circle in the top face of a cavalier cube at 45°. Which ellipse template do you take, and how do you set it?',
      steps: [
        'The ratio is $B/A = 0.541/1.307 = 0.414$.',
        { text: 'Templates are labelled by the angle whose sine is the ratio:', tex: '\\arcsin 0.414 = 24.5° .' },
        'Take the 25° template and set its major axis at $22.5°$ above the horizontal.'
      ],
      a: 'The 25° template (nearest to 24.5°), major axis at 22.5° above the horizontal.'
    }
  ],
  quiz: [
    { q: 'A circle of radius 50 lies in the top face of a cavalier drawing at 45°. What is the length of the major axis (mm)?', answer: 130.7, why: '$2A = 2 \\times 50\\sqrt{1 + \\cos 45°} = 2 \\times 65.3 = 130.7$ mm.' },
    { q: 'The two half-sides of the parallelogram, from the centre of the face, are', choices: ['the axes of the ellipse', 'conjugate semi-diameters of the ellipse', 'its foci', 'the tangents'], a: 1, why: 'They join the midpoints of opposite sides, where the ellipse touches the parallelogram; they are conjugate diameters, but in general not the axes.' },
    { q: 'In Rytz\'s construction the line A′B is joined, and a circle is drawn about its midpoint through C. It cuts A′B at P and Q; the directions of the axes are', choices: ['CA and CB', 'CP and CQ', 'A′P and A′Q', 'the diagonals of the parallelogram'], a: 1, why: 'CP and CQ are perpendicular (angle in a semicircle) and are the axes; BP and BQ are the semi-axes.' },
    { q: 'The four-centre isometric method draws the ellipse in any oblique face.', a: false, why: 'It depends on the geometry of the isometric square. For an oblique face use the parallelogram points or the axes.' },
    { q: 'A face is drawn with the receding side at 90°. The ellipse of its inscribed circle is', choices: ['a line', 'a circle (r = 1) or an ellipse with axes along the base and the vertical', 'tilted at 45°', 'the same as for 45°'], a: 1, why: 'With a = 90° the sides are at right angles, hence conjugate diameters coincide with axes: semi-axes R and r R.' }
  ],
  applications: [
    'Every oblique drawing of a bored or round-topped part: holes in the top, a drum, a table with a round top.',
    'Furniture drawings: round stools, tables and lids seen from above in cabinet projection.',
    'Illustrations of tanks, cylinders, pots and pipes drawn in oblique with their axes along the depth.',
    'The same ellipse geometry runs behind every ellipse template, trammel and CAD ellipse command.'
  ],
  history: 'Rytz\'s construction is named after the Swiss teacher David Rytz (1801–1868); the older "paper-strip" method with a trammel and the points-by-ordinates method come from classical geometry. The labelling of ellipse templates by the sine of the viewing angle grew in the drawing offices of the twentieth century with the plastic template.',
  sources: ['French, Vierck and Foster, Engineering Drawing and Graphic Technology, the sections on oblique circles.', 'Hellmuth Stachel, Descriptive Geometry, the sections on conjugate diameters and affinity.'],
  sim: 'ob-circle-lab',
  construction: 'ob-oblique-circle'
},

{
  id: 'parallel-perspective-in-art',
  parent: 'oblique-projections',
  title: 'Parallel perspective in Chinese and Japanese art',
  level: 2,
  short: 'For a thousand years East Asian painters drew courtyards, streets and palaces from above with the receding lines parallel, not converging, and a far house as large as a near one: an oblique projection chosen on purpose, which suits a scroll that is read section by section.',
  keywords: ['parallel perspective', 'handscroll', 'Chinese painting', 'Japanese emaki', 'blown-off roof', 'jiehua', 'oblique', 'bird\'s-eye', 'three distances', 'no vanishing point'],
  prereq: ['oblique-projection', 'cavalier-projection', 'vanishing-points'],
  related: ['cabinet-projection', 'planometric-projection', 'isometric-in-games', 'alberti-window'],
  body: `Linear perspective, with its vanishing points and its single station point, is a European discovery of the early fifteenth century. In China and Japan, over a thousand years, painters of buildings and cities worked with another system: the receding lines run **parallel** up the picture, a house at the back of the courtyard is drawn as large as one at the front, and the viewer looks down on everything as from a hill. Geometrically it is an oblique projection, usually with the front faces true and the depth shown by lines at about 30°–60°; the optical effect is that of an eye at infinity.

### What it looks like
Take the Song-dynasty handscrolls. Courtyards, gateways and halls are drawn from a raised viewpoint, the walls of the courtyard are parallel diagonals, the roofs are seen from above, and the nearest wall is often cut low, or the roof removed, to show the rooms: the Japanese picture scrolls of the Heian period call this *fukinuki yatai*, "blown-off roof". Architecture was drawn with a ruler in the genre called *jiehua* ("boundary painting"), which is where the parallel lines come from: the ruler runs the same way for a near line and a far one. Nothing converges, nothing shrinks, and every part of the scroll is independent of the others.

### Why it suited the scroll
A handscroll is unrolled a hand-span at a time and read from right to left. There is no single place from which the whole of it is seen, so there is no single station point to which a perspective could refer; each section is its own picture, with its own raised eye, and the painter can add a courtyard or a street without recomputing the rest. The viewer, who moves with the scroll, takes in each part from straight above — the *moving focus* of Chinese theory. Guo Xi in the eleventh century wrote of three "distances" for a mountain scene, the high, the deep and the level, each a different point of view in one picture. The picture shows what a place *is* — which room leads to which — rather than how it would look to a camera.

### The geometry
For a viewer at distance $D$ from the near edge, a thing at depth $d$ behind it is drawn in linear perspective at the scale
$$s = \\frac{D}{D + d}.$$
For a courtyard 60 m deep seen from 300 m the back wall is drawn at 83 %; from 40 m, at 40 %. As $D \\to \\infty$ the scale tends to 1: **parallel perspective is perspective with the eye at infinity**, which is also what the oblique projection is. The painter does not draw a worse perspective; he draws a better-suited picture.

### Meeting the West
Western linear perspective reached Asia in the 1600s and 1700s: in Japan through Dutch prints, in the form of the *uki-e* ("floating pictures") of the 1740s, and in China at the Qing court through the Italian Jesuit Giuseppe Castiglione (Lang Shining), who arrived in 1715, and the treatise *Shixue* ("the study of vision", 1729) of Nian Xiyao, which taught it. For a time both systems were used, side by side or even in one picture.

> [!note] The parallel view is not a failure to discover perspective: it is the right projection for a map-like picture that is viewed in parts. The same reasoning put the isometric view in strategy games ([[isometric-in-games]]).`,
  ideas: [
    'East Asian painters drew buildings and courtyards in an oblique parallel view, with parallel receding lines and no shrinking with distance.',
    'The nearest wall or roof is cut away ("blown-off roof", fukinuki yatai) so that the rooms can be seen from the raised viewpoint.',
    'Architecture was drawn with a ruler (jiehua, "boundary painting"), which keeps the receding lines parallel.',
    'A handscroll is seen a section at a time, so there is no single station point; each section has its own viewpoint.',
    'Perspective with the eye at infinity: the scale D/(D + d) tends to 1; the parallel view is the limit of linear perspective.'
  ],
  pitfalls: [
    'Asian painters did not know how to draw perspective — They knew a different system, chosen for a different kind of picture, and used it with great precision; when European perspective arrived some of them used it too.',
    'The lines in a scroll are slightly out of true — In ruled-line painting they are parallel by construction; the effect of distance is not forgotten but left out on purpose.',
    'It is an isometric projection — It is an oblique one: the fronts are true, the depth lines are at an arbitrary angle, and the viewpoint is raised rather than at 35° to the horizon.'
  ],
  formulas: [
    {
      name: 'Perspective shrinking at depth d',
      expr: 's = D/(D + d)',
      tex: 's = \\frac{D}{D + d}',
      vars: {
        s: { name: 'scale of the far edge relative to the near edge' },
        D: { name: 'distance from the eye to the near edge', q: 'length', unit: 'm', value: 300 },
        d: { name: 'depth of the courtyard', q: 'length', unit: 'm', value: 60 }
      },
      solveFor: 's',
      note: 'The scale tends to 1 as D grows: a parallel perspective is a perspective with the eye at infinity. Solve for D to find the distance that keeps the far wall within a chosen fraction.'
    }
  ],
  examples: [
    {
      title: 'How far must the eye be?',
      q: 'A courtyard is 60 m deep. How far must the viewer be from its near wall for the far wall to be drawn at 95 % of the near one, and what is the shrinking from 40 m?',
      steps: [
        { text: 'Solve $s = D/(D + d)$ for $D$:', tex: 'D = \\frac{d\\,s}{1 - s} = \\frac{60 \\times 0.95}{0.05} = 1140\\ \\text{m}.' },
        { text: 'From 40 m:', tex: 's = \\frac{40}{40 + 60} = 0.40 .' },
        'So a perspective that looks parallel needs a viewing distance of about a kilometre. Seen from near the wall, the picture is strongly converging — which is why a painter who wants a place seen as a map must abandon the single eye.'
      ],
      a: 'About 1140 m for 95 %; from 40 m the far wall is drawn at 40 %.'
    }
  ],
  quiz: [
    { q: 'A courtyard is 60 m deep and seen from 300 m. In linear perspective the back wall is drawn at what fraction of the front one?', answer: 0.833, why: '$s = 300/(300 + 60) = 0.833$.' },
    { q: 'In the parallel view of a scroll, a house at the back of a courtyard is drawn', choices: ['smaller than the one in front', 'the same size as the one in front', 'larger than the one in front', 'with a vanishing point'], a: 1, why: 'There is no foreshortening with distance: the projection is parallel (the eye is, in effect, at infinity).' },
    { q: 'The Japanese term "fukinuki yatai" (blown-off roof) means', choices: ['a roof damaged by a storm', 'a view in which the roof is left out so that the rooms can be seen from above', 'a roof shown from below', 'a roof drawn with a vanishing point'], a: 1, why: 'The scrolls of the Heian period show rooms by omitting the roof and the near wall.' },
    { q: 'East Asian painters used the parallel view because they could not draw perspective.', a: false, why: 'It was a deliberate choice for pictures seen in sections and meant to explain a place; some painters used both systems when European perspective arrived.' },
    { q: 'Which projection is a parallel perspective geometrically?', choices: ['Central projection onto a plane', 'An oblique projection', 'Fisheye projection', 'Stereographic projection'], a: 1, why: 'The receding lines are parallel, the front faces are true: that is the oblique projection.' }
  ],
  applications: [
    'Chinese and Japanese handscrolls and screens: palaces, streets and gardens drawn so that every room and path can be read.',
    'Jiehua (ruled-line) architectural painting, in which the ruler guarantees parallel lines.',
    'Maps of towns and buildings, where parallel perspective keeps the scale constant across the picture.',
    'Modern equivalents: floor-plan-based building illustrations, tourist maps and the oblique city views of strategy games.'
  ],
  history: 'Parallel oblique views of architecture occur in Chinese art from the Han tomb reliefs onwards and flourish in the Song handscrolls, such as the twelfth-century "Along the River During the Qingming Festival" attributed to Zhang Zeduan; the Heian emaki, such as the Tale of Genji scroll of the twelfth century, show the blown-off roof. Guo Xi wrote of the three distances about 1080. Western perspective arrived with the Jesuits and with Dutch prints in the 1600s and 1700s: Castiglione at the Qing court from 1715, Nian Xiyao\'s Shixue in 1729, Okumura Masanobu\'s uki-e in Japan about 1740.',
  sources: ['Guo Xi, Linquan gaozhi (The Lofty Message of Forests and Streams, c. 1080).', 'Nian Xiyao, Shixue (The Study of Vision, 1729).', 'Michael Sullivan, The Birth of Landscape Painting in China (1962).', 'Michael Sullivan, The Meeting of Eastern and Western Art (1973), on the Jesuits and linear perspective in China.'],
  sim: 'ob-scroll-lab',
  construction: 'ob-handscroll'
},

{
  id: 'isometric-in-games',
  parent: 'oblique-projections',
  title: 'Isometric worlds in games and pixel art',
  level: 2,
  short: 'Most "isometric" games are not isometric: their tiles are twice as wide as high, a dimetric view whose edges climb exactly one pixel for two, which pixels can draw cleanly. The tile maps, depth sorting and mouse picking of such worlds are a few lines of the projection mathematics.',
  keywords: ['isometric games', 'pixel art', '2:1', 'dimetric', 'tile map', 'depth sorting', 'picking', 'sprites', 'game camera', '2.5D'],
  prereq: ['dimetric-projection', 'isometric-drawing', 'game-cameras'],
  related: ['isometric-projection', 'axonometric-projection', 'cabinet-projection', 'planometric-projection'],
  body: `A game wants a world seen from above at an angle, with no perspective, so that tiles repeat and sprites keep their size wherever they stand. That is a parallel projection, and the favourite is the "isometric": the world is a grid of square tiles turned through 45° and seen from an elevation $\\alpha$ above the horizon. Seen that way a square tile of side $s$ becomes a diamond $W = \\sqrt2\\,s$ wide and $H = W\\sin\\alpha$ high. In **true isometric** $\\alpha = 35.26°$ and the diamond is $0.577$ as high as wide, its edges at $30°$. But a computer screen is made of pixels, and a line of slope $0.577$ falls irregularly on the pixel grid (steps of 2, 2, 2, 1, 2 …). Choose $\\alpha = 30°$ instead and $\\sin\\alpha = \\tfrac12$: the tile is exactly **2 : 1**, its edges rise one pixel for two across ($26.57°$), and every line is a regular staircase. That is the "isometric" of nearly every pixel-art game — strictly a dimetric projection, with scales $0.791$ along the two ground axes and $0.866$ along the vertical ([[dimetric-projection]]).

### The tile map
Let the tile $(i, j)$ have its top corner at screen position
$$s_x = (i - j)\\,\\frac W2,\\qquad s_y = (i + j)\\,\\frac H2 \\;-\\; z\\cdot h_c,$$
with $W = 64$, $H = 32$ for the 2 : 1 tile and $z$ the number of block layers of height $h_c$. A true cube of side $s$ has the vertical edge $W\\cos\\alpha/\\sqrt2$, i.e. $0.612\\,W$ at $30°$ (39 pixels for $W = 64$) — artists often pick $W/2$ or a rounded value, and the slight mismatch is why a game "isometric" cube is a little off. To pick the tile under the mouse invert the map:
$$i = \\tfrac12\\Big(\\frac{2 s_x}{W} + \\frac{2 s_y}{H}\\Big),\\qquad j = \\tfrac12\\Big(\\frac{2 s_y}{H} - \\frac{2 s_x}{W}\\Big),$$
rounding down, and then correct for the heights of the blocks (test the highest block first).

### Drawing order
Because the world has no depth buffer in a sprite engine, near things must be drawn after far ones: the **painter\'s algorithm**. For tiles of equal size, draw in the order of increasing $i + j$ (and, within a diagonal, left to right). Tall or wide sprites break this (a long wall overlaps tiles that are "nearer" in index), and engines either split the sprites along the grid or sort the objects topologically by which is in front of which.

### Why not true isometric?
In true isometric a $30°$ line is irregular on the pixel grid, tiles are not whole-number heights, and artists find clean 2 : 1 lines easier to anti-alias and to dither. In a modern engine with an orthographic camera there is no such reason, and the camera can be set to the true isometric 35.264° — or, as a common default, to a camera pitched down 30° and turned 45°, which gives exactly the 2 : 1 tile. Games that want impossible architecture exploit the other property of the true isometric: the picture is ambiguous, and a path can join two points at different depths.

> [!tip] To make an isometric icon or logo that looks right: use the 2 : 1 grid and the 26.57° lines for pixel work, but true 30° lines for vector work. The two are only 3.4° apart, and the eye cannot tell, but the pixels can.`,
  ideas: [
    'A tile seen at elevation α is W wide and W sin α high; true isometric has 0.577, the 2 : 1 game tile has sin α = ½ (α = 30°, edges at 26.57°).',
    'Pixel art uses 2 : 1 because a slope of ½ is a perfectly regular staircase; the true 30° line is irregular on the pixel grid.',
    'The 2 : 1 "isometric" is a dimetric projection with scales 0.79 : 0.87 : 0.79 (ground, vertical, ground).',
    'Screen = ((i − j) W/2, (i + j) H/2 − z h); the inverse gives the tile under the mouse; draw in order of increasing i + j.',
    'In a 3-D engine the same view is an orthographic camera at 30° pitch and 45° yaw (2 : 1) or at 35.26° (true isometric).'
  ],
  pitfalls: [
    'A 2 : 1 pixel tile is isometric — It is dimetric. The true isometric tile is 0.577 as high as wide, not 0.5, and its edges are at 30°, not 26.57°.',
    'The cube height equals the tile height — A true cube is W cos α / √2 = 0.612 W tall at 30° (W = 64: 39 px); the common choice of 32 makes a flattened cube.',
    'Sorting by tile index always works — It works for equal tiles; large or tall sprites need splitting or a topological sort.'
  ],
  formulas: [
    {
      name: 'Tile height from the camera elevation',
      expr: 'H = W*sin(al)',
      tex: 'H = W\\sin\\alpha',
      vars: {
        H: { name: 'height of the diamond tile', q: false, unit: 'px' },
        W: { name: 'width of the diamond tile', q: false, unit: 'px', value: 64 },
        al: { name: 'camera elevation above the horizon', q: 'angle', unit: '°', value: 30, min: 5, max: 90, tex: '\\alpha' }
      },
      solveFor: 'H',
      note: 'α = 30° gives H = W/2 (the 2 : 1 tile); α = 35.26° gives 0.577 W.'
    },
    {
      name: 'Angle of the tile edge',
      expr: 'th = atan(sin(al))',
      tex: '\\theta = \\arctan(\\sin\\alpha)',
      vars: {
        th: { name: 'angle of the tile edge to the horizontal', q: 'angle', unit: '°', tex: '\\theta' },
        al: { name: 'camera elevation above the horizon', q: 'angle', unit: '°', value: 30, min: 5, max: 90, tex: '\\alpha' }
      },
      solveFor: 'th',
      note: 'α = 30°: 26.57° (a slope of ½). α = 35.264°: 30°, the true isometric.'
    },
    {
      name: 'Height of a true cube on the screen',
      expr: 'hc = W*cos(al)/sqrt(2)',
      tex: 'h_c = \\frac{W\\cos\\alpha}{\\sqrt2}',
      vars: {
        hc: { name: 'drawn height of a cube whose base is the tile', q: false, unit: 'px', tex: 'h_c' },
        W: { name: 'width of the diamond tile', q: false, unit: 'px', value: 64 },
        al: { name: 'camera elevation above the horizon', q: 'angle', unit: '°', value: 30, min: 5, max: 90, tex: '\\alpha' }
      },
      solveFor: 'hc',
      note: 'The side of the cube is W/√2 and the vertical scale is cos α. For W = 64, α = 30°: 39.2 px. (True isometric: 0.577 W.)'
    }
  ],
  examples: [
    {
      title: 'A 10 × 10 map',
      q: 'A map of 10 × 10 tiles of 64 × 32 pixels is drawn flat (no blocks). How big is the picture, and where is the tile (7, 2) with the origin at the top corner of tile (0, 0)?',
      steps: [
        { text: 'The diamond of tiles has width and height', tex: '10 \\times 64 = 640\\ \\text{px wide},\\qquad 10 \\times 32 = 320\\ \\text{px high}.' },
        { text: 'The tile (7, 2) has its top corner at', tex: 's_x = (7 - 2)\\times 32 = 160\\ \\text{px},\\qquad s_y = (7 + 2)\\times 16 = 144\\ \\text{px}.' },
        'So it is 160 px to the right of and 144 px below the top corner of the map.'
      ],
      a: '640 × 320 px; the tile (7, 2) at (160, 144).'
    },
    {
      title: 'Picking the tile under the mouse',
      q: 'The mouse is at 96 px to the right of and 80 px below the top corner of the map (64 × 32 tiles). Which tile is it on?',
      steps: [
        { text: 'With $W/2 = 32$ and $H/2 = 16$:', tex: 'i = \\tfrac12\\Big(\\frac{96}{32} + \\frac{80}{16}\\Big) = \\tfrac12(3 + 5) = 4,\\qquad j = \\tfrac12(5 - 3) = 1 .' },
        'The point is on the tile (4, 1) (rounding down the fractional values, which are exact here).'
      ],
      a: 'The tile (4, 1).'
    }
  ],
  quiz: [
    { q: 'A 2 : 1 pixel tile is 64 pixels wide. How high is it?', answer: 32, why: 'The tile is W sin α high with sin α = ½: 32 pixels, and its edges climb 1 pixel for every 2 across.' },
    { q: 'The camera elevation of a 2 : 1 tile is', choices: ['26.57°', '30°', '35.26°', '45°'], a: 1, why: '$\\sin\\alpha = H/W = \\tfrac12$, so $\\alpha = 30°$. (26.57° is the angle of the tile edge on the screen.)' },
    { q: 'The "isometric" of most pixel-art games is strictly a dimetric projection.', a: true, why: 'Its scales are 0.791 along the two ground axes and 0.866 along the vertical: two equal, one different.' },
    { q: 'Tiles are drawn in the order of', choices: ['decreasing i + j (near first)', 'increasing i + j (far first)', 'any order', 'increasing height'], a: 1, why: 'The painter\'s algorithm draws far objects first so that near ones cover them; the screen y of a tile grows with i + j.' },
    { q: 'What is the drawn height of a true cube standing on a 64-pixel tile at α = 30° (pixels)?', answer: 39.2, why: '$h_c = 64\\cos 30°/\\sqrt2 = 39.2$ px.' }
  ],
  applications: [
    'City builders, strategy and role-playing games, where tiles must repeat and sprites keep their size wherever they stand.',
    'Level editors and tile-map formats, which carry an isometric orientation with a W : H ratio for the tile.',
    'Icon sets and infographics in the "isometric style", drawn on a 2 : 1 or a 30° grid.',
    'Board-game maps and diagrams of rooms, which want a picture of a space that can be read from any direction.'
  ],
  history: 'The first video games drawn in a parallel view from above at an angle date from 1982: Sega\'s Zaxxon is usually named as the first in isometric projection, and Q*bert, in the same year, built its pyramid of cubes the same way. The Filmation engine of Ultimate Play the Game gave Knight Lore (1984) its isometric rooms. The 2 : 1 pixel tile became the standard with the strategy and role-playing games of the 1990s, among them SimCity 2000, Diablo and Age of Empires; modern engines make an orthographic camera at 30° pitch and 45° yaw the usual starting point.',
  sources: ['Game development references on tile maps: any book on 2-D tile engines and the documentation of the Tiled map editor (isometric orientation).', 'French, Vierck and Foster, Engineering Drawing and Graphic Technology (for the dimetric projection).'],
  sim: 'ob-pixel-lab',
  construction: 'ob-pixel-grid'
}
);
