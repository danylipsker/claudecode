/* HYPER-PROJECTIONS · content/one-two-three-points.js — one, two and three vanishing points, and how a perspective is built.
 *
 *   one-point-perspective · two-point-perspective · three-point-perspective · zero-point-perspective ·
 *   perspective-grids · measuring-points · dividing-depth · inclined-planes
 * Each page: the idea, the numbers, what is kept and lost, and a ruler-and-compass construction
 * (constructions/one-two-three-points.js) and, where the idea moves, a simulation (sims/one-two-three-points.js).
 */
Hyper.add(
{
  id: 'one-point-perspective',
  parent: 'one-two-three-points',
  title: 'One-point perspective',
  level: 1,
  short: 'Face the object squarely: one face is parallel to the picture plane and is drawn true; every line that runs away goes to a single vanishing point, the centre of vision. The distance point on the horizon fixes how deep things are.',
  keywords: ['one-point', 'one point perspective', 'central vanishing point', 'parallel perspective', 'room', 'corridor', 'distance point', 'diagonal', 'frontal'],
  prereq: ['vanishing-points', 'horizon-and-eye-level'],
  related: ['two-point-perspective', 'perspective-grids', 'dividing-depth', 'measuring-points', 'alberti-construction', 'plan-and-elevation-method'],
  body: `When you look squarely at a wall, a corridor or a street, one face of the scene is parallel to the picture plane and the rest runs straight away from you. That is **one-point perspective**, sometimes called parallel perspective. The planes parallel to the window are drawn *true*, only reduced by $d/z$: the front wall of a room is a rectangle of its own shape. The lines that run away from the window are all parallel to the line of sight, so they go to one vanishing point, the **centre of vision** (CV), on the horizon straight in front of the eye.

### The numbers
Put the picture plane at the front of the room, the eye at distance $D$ from it and at height $e$ over the floor. A point on the floor at depth $z$ behind the picture is drawn at the height
$$y = \\frac{e\\,z}{D + z}$$
above the ground line, and everything at depth $z$ is the front face reduced about the vanishing point in the ratio
$$k = \\frac{D}{D + z}.$$
The back wall of a room of depth $L$ is therefore the opening reduced by $D/(D+L)$ about CV, with $D$ at least $1.5$ times the width of the opening, or the room looks like a tunnel. The matrix of [[the-perspective-matrix]] for a camera looking straight along $-z$ has a single finite vanishing point, that of the $z$ direction.

### The distance point
How deep a thing lies is fixed by the **distance point** (DP): the point on the horizon at distance $D$ from the centre of vision. Every line at $45°$ to the picture plane vanishes there. A point at depth $L$ along the side of the room lies on the 45° line that starts $L$ away along the ground line, so one line to DP gives the back corner: no plan, no measurement beyond $L$ and $D$. It also gives squares: the diagonal of a floor tile is a 45° line.

### What it keeps and loses
Parallels across the view stay parallel and horizontal, right angles in the front plane stay right angles, and the front face keeps its proportions. Lost are the depth lengths (they shrink as $D/(D+z)$) and the sense of the third dimension from the side: all faces seen are the front and the floor, ceiling and walls in the foreshortened sense.

### How it is drawn
Draw the opening true size, put CV on the horizon, join the corners to CV, find the back wall with the distance point — the construction below — and rule the details. The simulation lets you drag CV to move the eye about the room.

> [!tip] One-point perspective is the easiest to draw and the most formal to look at: the composition is symmetrical about the line to CV, which is why it has been used for churches, corridors, and portraits that must feel calm.`,
  ideas: [
    'One face is parallel to the picture plane and is drawn true size; all lines that run away go to the single vanishing point, the centre of vision.',
    'A floor point at depth z is drawn y = e·z/(D + z) above the ground line; a plane at depth z is the front face reduced by k = D/(D + z) about CV.',
    'The distance point DP, at distance D from CV on the horizon, takes every 45° line; one line to it gives the depth of the back wall or the tiles.',
    'The viewing distance D should be at least 1.5 times the width of the opening; a smaller D gives a tunnel-like room.'
  ],
  pitfalls: [
    'The back wall is smaller by a fixed amount whatever the viewer does — The reduction D/(D + L) depends on D: step back and the room looks shallower. The distance point must be placed at the real viewing distance.',
    'CV must be in the middle of the picture — It can be anywhere on the horizon; its position is the sideways position of the eye. Off centre, one wall is seen more than the other.',
    'Lines across the view converge too — They do not: lines parallel to the picture plane stay parallel in one-point perspective. If they converge you have drawn a two-point view.'
  ],
  formulas: [
    {
      name: 'Height of a floor point on the picture',
      expr: 'y = eh*z/(D + z)',
      tex: 'y = \\frac{e\\,z}{D + z}',
      vars: {
        y: { name: 'height above the ground line on the picture', q: 'length', unit: 'mm' },
        eh: { name: 'eye height (HL above GL)', q: 'length', unit: 'mm', value: 60, tex: 'e' },
        z: { name: 'depth of the point behind the picture plane', q: 'length', unit: 'mm', value: 140 },
        D: { name: 'distance from the eye to the picture plane', q: 'length', unit: 'mm', value: 200 }
      },
      note: 'The picture plane at the front edge of the floor. As z → ∞ the point tends to HL (y → e); at z = 0 it is on the ground line.'
    },
    {
      name: 'Reduction of a plane at depth z',
      expr: 'k = D/(D + z)',
      tex: 'k = \\frac{D}{D + z}',
      vars: {
        k: { name: 'ratio of the picture to the front face' },
        D: { name: 'distance from the eye to the picture plane', q: 'length', unit: 'mm', value: 200 },
        z: { name: 'depth of the plane behind the picture plane', q: 'length', unit: 'mm', value: 140 }
      },
      note: 'About the centre of vision. For z = D the plane is half-size; for z = 3D, a quarter.'
    }
  ],
  examples: [
    {
      title: 'The back wall of a room',
      q: 'A room is seen through an opening 200 wide and 130 high. The eye is 60 above the floor and 200 from the opening, and the room is 140 deep. Find the size of the back wall and its height above the ground line.',
      steps: [
        { text: 'The reduction:', tex: 'k = \\frac{200}{200 + 140} = 0.588' },
        'Back wall: $200 \\times 0.588 = 117.6$ wide and $130 \\times 0.588 = 76.5$ high.',
        { text: 'Its floor edge (a floor point at depth 140):', tex: 'y = \\frac{60 \\times 140}{340} = 24.7' },
        { text: 'and its top edge, a point at the height 130 above the floor, which is 70 above eye level:', tex: 'y_{top} = 60 + 70 \\times 0.588 = 101.2' }
      ],
      a: 'The back wall is 117.6 × 76.5, standing from 24.7 to 101.2 above the ground line.'
    },
    {
      title: 'How deep is the line on the floor?',
      q: 'On the picture of the same room a line across the floor is drawn 24.7 above the ground line. How far behind the opening is it?',
      steps: [
        { text: 'Solve $y = e\\,z/(D+z)$ for $z$:', tex: 'z = \\frac{D\\,y}{e - y} = \\frac{200 \\times 24.7}{60 - 24.7} = 140' }
      ],
      a: '140 behind the opening, the back wall of the room.'
    }
  ],
  quiz: [
    { q: 'In one-point perspective the lines that run straight away from you', choices: ['all go to the centre of vision', 'are parallel on the picture', 'go to two points on the horizon', 'are horizontal on the picture'], a: 0, why: 'They are parallel to the line of sight, so their vanishing point is where the line of sight meets the picture: CV.' },
    { q: 'What does a line at 45° to the picture plane go to?', choices: ['the distance point', 'the centre of vision', 'the zenith', 'the vanishing point of the verticals'], a: 0, why: 'A 45° line makes the same angle with the picture plane and the line of sight; it vanishes on HL at the distance D from CV.' },
    { q: 'The eye is 240 mm from the picture and a room is 160 mm deep (in the drawing\'s units). By what factor is the back wall smaller than the opening (two decimals)?', answer: 0.6, why: 'k = D / (D + L) = 240 / 400 = 0.60.' },
    { q: 'In one-point perspective, lines across the view (parallel to the picture plane) converge.', a: false, why: 'Lines parallel to the picture plane have no vanishing point and stay parallel. If they converge you are looking at the scene obliquely.' },
    { q: 'Moving the viewer farther back (a larger D) while keeping the room the same makes the back wall', choices: ['closer in size to the opening', 'smaller', 'change in shape', 'turn'], a: 0, why: 'k = D/(D + L) tends to 1 as D grows: in the limit the room is drawn as a box with equal walls (parallel projection).' }
  ],
  applications: [
    'Interiors and corridors: rooms, churches, galleries and station halls are drawn in one-point perspective because it is easy and symmetrical.',
    'Painting and film: Leonardo\'s *Last Supper* and the symmetrical shots of Kubrick are composed around one vanishing point; the eye is led to it.',
    'Road, rail and runway views: the lines that run away are parallel to the sight line, so a straight road ahead is one-point perspective.',
    'Stage sets and shop fronts: a box set with a back wall at a chosen reduction gives the right feel of depth for an audience in one place.',
    'Interface design and games: tunnels, corridors and menus use one-point perspective for fast, simple depth.'
  ],
  history: 'Brunelleschi\'s lost panel of the Florentine Baptistery (about 1415) is usually reconstructed as a one-point construction; Alberti\'s *De pictura* (1435) gives the first written account of the method, in which the "centric point" is the vanishing point of all the orthogonals. Masaccio\'s *Holy Trinity* (about 1427) is the first large surviving painting in it; Leonardo\'s *Last Supper* (1495–98) puts the point behind Christ\'s head. Jean Pèlerin ("Viator") published in 1505 the first printed treatise, in which the distance points are explicit.',
  sources: ['Leon Battista Alberti, *De pictura* (1435), book I.', 'Jean Pèlerin (Viator), *De artificiali perspectiva* (1505).', 'Samuel Y. Edgerton, *The Renaissance Rediscovery of Linear Perspective* (1975).', 'Francis D. K. Ching, *Architectural Graphics* (6th ed. 2015), the chapter on perspective drawing.'],
  sim: 'pt-room-view',
  construction: 'pt-one-point-room'
},

{
  id: 'two-point-perspective',
  parent: 'one-two-three-points',
  title: 'Two-point perspective',
  level: 2,
  short: 'Turn the object so that no face is parallel to the picture plane: its two sets of horizontal edges go to two vanishing points on the horizon, the verticals stay vertical. The eye, folded up onto the sheet, stands on the semicircle with those two points as diameter.',
  keywords: ['two-point', 'angular perspective', 'oblique perspective', 'corner view', 'box', 'vanishing points', 'semicircle', 'Thales', 'right angle', 'edge of a building'],
  prereq: ['one-point-perspective', 'vanishing-points'],
  related: ['three-point-perspective', 'measuring-points', 'perspective-grids', 'plan-and-elevation-method', 'direct-measuring-method', 'inclined-planes'],
  body: `Turn the box so that you see it on a corner and no face is parallel to the picture plane. The edges that ran into the picture now run in *two* horizontal directions, at the angles $\\theta$ and $90° - \\theta$ to the picture plane, and each set has its own vanishing point on the horizon. The vertical edges, still parallel to the window, stay vertical. This is **two-point perspective** (angular or oblique perspective), the usual view of a building or a piece of furniture.

### The two points
With the eye at distance $D$ from the picture plane, the vanishing points are
$$x_1 = D\\cot\\theta \\ \\ \\text{(on one side of CV)}, \\qquad x_2 = D\\tan\\theta \\ \\ \\text{(on the other)},$$
and they are $2D/\\sin 2\\theta$ apart, closest, $2D$, at $\\theta = 45°$. The lines from the eye to the two points are parallel to the two edge directions, so they are perpendicular: **the eye, folded up onto the sheet, sees the two vanishing points under a right angle**, and lies on the semicircle with $V_1V_2$ as diameter, at the height $D = \\sqrt{ab}$ above CV (see [[vanishing-points]]). Any two points of the horizon can be the vanishing points of a rectangular box; the eye is then somewhere on this semicircle, and its position fixes the turn and the viewing distance.

### The trouble with distant points
With $D$ equal to a normal viewing distance the vanishing points of a box turned $30°$ are at $1.73\\,D$ and $0.58\\,D$ from CV: $2.3\\,D$ apart, 1.15 m for $D = 500$ mm. That does not fit a drawing board, and the points often lie off the sheet. Draughtsmen use devices that need no point at all (the plan-and-elevation method, [[plan-and-elevation-method]]), or choose the points closer together — which means a smaller $D$ and a stronger perspective — or measure with a **measuring point** ([[measuring-points]]).

### What it keeps and loses
Verticals stay vertical and parallel; horizontals converge to two points on HL; a right angle at the corner of the box is seen as an angle that depends on where the eye is. Lost are the proportions of every face (each is foreshortened by its own angle), and the equal division of horizontal lengths, which need the diagonals or a measuring point.

### How it is drawn
The box is built from its nearest vertical edge: lines from the ends of that edge to the two points, verticals for the widths, and lines to the opposite point for the back. The construction below also draws the semicircle and finds the eye; the simulation lets you slide the eye along it.`,
  ideas: [
    'No face is parallel to the picture plane: the horizontal edges go to two vanishing points on the horizon, the verticals stay vertical.',
    'Edges at θ and 90° − θ vanish at D cot θ and D tan θ from CV, on opposite sides; they are 2D / sin 2θ apart.',
    'The eye folded onto the sheet sees the two points under a right angle, so it lies on the semicircle on V₁V₂ and D = √(a·b).',
    'The vanishing points are often too far off the sheet; measuring points and the plan-and-elevation method avoid them.'
  ],
  pitfalls: [
    'The two vanishing points can be put anywhere — Their distances from CV are tied to D by D² = a·b. A careless choice (both points near each other and a wide box) gives a box that looks like a squeezed or leaning shape.',
    'Equal angles give equal sides — At 45° the two sides are drawn alike. At 30°/60° the face at 60° to the picture plane is wide and the one at 30° narrow, though both may be equally long.',
    'The vertical edges also converge — Not with a level camera; they converge only when the picture plane is tilted, which gives three-point perspective.'
  ],
  formulas: [
    {
      name: 'The far vanishing point',
      expr: 'x1 = d/tan(theta)',
      tex: 'x_1 = d\\cot\\theta',
      vars: {
        x1: { name: 'distance of V₁ from CV', q: 'length', unit: 'mm', tex: 'x_1' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 150 },
        theta: { name: 'angle of the first set of edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 5, max: 85, tex: '\\theta' }
      },
      note: 'The set of edges that makes the smaller angle with the picture vanishes far away.'
    },
    {
      name: 'The near vanishing point',
      expr: 'x2 = d*tan(theta)',
      tex: 'x_2 = d\\tan\\theta',
      vars: {
        x2: { name: 'distance of V₂ from CV, on the other side', q: 'length', unit: 'mm', tex: 'x_2' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 150 },
        theta: { name: 'angle of the first set of edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 5, max: 85, tex: '\\theta' }
      },
      note: 'The other set makes 90° − θ with the picture plane, and cot(90° − θ) = tan θ.'
    },
    {
      name: 'Distance between the two vanishing points',
      expr: 'S = 2*d/sin(2*theta)',
      tex: 'S = \\frac{2\\,d}{\\sin 2\\theta}',
      vars: {
        S: { name: 'distance between V₁ and V₂', q: 'length', unit: 'mm' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 150 },
        theta: { name: 'angle of one set of edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 5, max: 85, tex: '\\theta' }
      },
      note: 'Smallest at θ = 45°, where S = 2d; at 30° it is 2.31 d.'
    }
  ],
  examples: [
    {
      title: 'A box turned 30°',
      q: 'The eye is 150 mm from the picture and a box is turned so that its edges make 30° and 60° with the picture plane. Where are the vanishing points, how far apart are they, and how high above CV is the eye when folded onto the sheet?',
      steps: [
        { text: 'The two points:', tex: 'x_1 = 150 \\cot 30° = 259.8, \\qquad x_2 = 150 \\tan 30° = 86.6\\ \\text{mm}' },
        { text: 'Their distance apart:', tex: 'S = 259.8 + 86.6 = 346.4 = \\frac{2 \\times 150}{\\sin 60°}' },
        'The eye stands on the semicircle on $V_1V_2$, at the height $D = \\sqrt{259.8 \\times 86.6} = 150$ mm above CV, as it must.'
      ],
      a: 'V₁ at 260 mm and V₂ at 87 mm from CV on opposite sides, 346 mm apart; the folded eye stands 150 mm above CV.'
    },
    {
      title: 'Choosing the points for a board',
      q: 'A drawing board gives room for vanishing points at most 300 mm apart. What is the largest viewing distance for a box turned 45°?',
      steps: [
        { text: 'At 45° the points are $2D$ apart:', tex: 'S = \\frac{2D}{\\sin 90°} = 2D \\le 300 \\Rightarrow D \\le 150\\ \\text{mm}' },
        'A turn of 30° would need $2.31\\,D \\le 300$, that is $D \\le 130$ mm, closer still.'
      ],
      a: 'D ≤ 150 mm at 45° (a 40° picture would be about 110 mm wide). That is why draughtsmen use measuring points or a plan.'
    }
  ],
  quiz: [
    { q: 'Two perpendicular horizontal edges of a box vanish 100 mm to the left and 400 mm to the right of CV. The eye is', choices: ['200 mm from the picture', '250 mm from the picture', '300 mm from the picture', '100 mm from the picture'], a: 0, why: 'd = √(100 × 400) = 200 mm.' },
    { q: 'How far apart are the vanishing points of a box turned 45° if the eye is 120 mm from the picture (mm)?', answer: 240, unit: 'mm', why: 'S = 2D / sin 90° = 2D = 240 mm.' },
    { q: 'In two-point perspective with a level camera the vertical edges', choices: ['stay vertical and parallel', 'converge towards a point above', 'converge towards a point below', 'become horizontal'], a: 0, why: 'The vertical direction is parallel to the picture plane, so it has no vanishing point.' },
    { q: 'The eye folded up onto the picture lies on the semicircle with V₁V₂ as diameter.', a: true, why: 'It sees the two perpendicular directions under a right angle (Thales\' theorem).' },
    { q: 'Edges at 20° and 70° to the picture plane: which vanishing point is farther from CV?', choices: ['the one for the 20° edges', 'the one for the 70° edges', 'both the same', 'neither is on HL'], a: 0, why: 'x = d cot θ is large for small θ.' }
  ],
  applications: [
    'Architecture and interior design: the corner view of a building, a room or a table is the standard client perspective.',
    'Industrial design and product sketching: a shape drawn on a corner shows two faces and the top at once.',
    'Landscape painting and cityscapes: two-point perspective gives the oblique street views of the Dutch and Italian townscape painters.',
    'Technical illustration and comics: buildings with vertical walls are always drawn in two points when the camera is level.',
    'Video games with first-person cameras: with the pitch fixed at zero, the world is in two-point perspective with vertical walls.'
  ],
  history: 'The oblique view was known to the Renaissance painters as an *angular* perspective, and Piero della Francesca constructed obliquely placed squares and solids by plan and elevation in his treatise. The theory of vanishing points on the horizon, with the eye turned down about it into the plane of the picture, was developed by Brook Taylor (1715) and by Johann Heinrich Lambert (*Die freye Perspektive*, 1759). Hans Vredeman de Vries\'s *Perspective* (1604) is the best-known book of pictures in the style.',
  sources: ['Brook Taylor, *Linear Perspective* (1715).', 'Johann Heinrich Lambert, *Die freye Perspektive* (1759).', 'Ernest R. Norling, *Perspective Made Easy* (1939).', 'Francis D. K. Ching, *Architectural Graphics* (6th ed. 2015).'],
  sim: 'pt-two-point-semicircle',
  construction: 'pt-two-point-box'
},

{
  id: 'three-point-perspective',
  parent: 'one-two-three-points',
  title: 'Three-point perspective',
  level: 2,
  short: 'Tilt the picture plane and the vertical edges stop being parallel to it: they converge on a third vanishing point far above or below. The horizon moves off the centre by d·tan φ, the third point sits d·cot φ the other way, and the centre of vision is the orthocentre of the three.',
  keywords: ['three-point', 'tilt', 'looking up', 'looking down', 'bird\'s eye', 'worm\'s eye', 'converging verticals', 'skyscraper', 'third vanishing point', 'orthocentre'],
  prereq: ['two-point-perspective', 'horizon-and-eye-level'],
  related: ['inclined-planes', 'measuring-points', 'tilt-shift-and-view-cameras', 'camera-calibration-and-homography', 'vanishing-points'],
  body: `Look up at a tall building, or down from a tower at the street: the vertical edges lean together. The picture plane, which faces the building squarely in two-point perspective, is now tilted by an angle $\\varphi$, so the vertical direction is no longer parallel to it and has a vanishing point of its own: the **third vanishing point**, V₃. When you look *up* it lies above the picture (a worm's-eye view); when you look *down* it lies below (a bird's-eye view). This is **three-point perspective**.

### Where the points fall
Take a camera looking up by $\\varphi$, with the picture plane at distance $d$ from the eye, perpendicular to the axis. The horizontal ray from the eye meets the plane at the distance $d\\tan\\varphi$ **below** the centre of vision, and the vertical ray meets it at $d\\cot\\varphi$ **above** it:
$$y_{HL} = -d\\tan\\varphi, \\qquad y_3 = +d\\cot\\varphi.$$
So the horizon, which was through the centre, drops by $d\\tan\\varphi$; the third point comes down from infinity, to $d/\\tan\\varphi$ from the centre. For $\\varphi = 0$ it is at infinity (two-point perspective); for $\\varphi = 90°$ it is at the centre and the verticals radiate from it like the spokes of a wheel.

The two horizontal points sit on the horizon, as in the two-point case, but with the folded eye at the slant distance $d/\\cos\\varphi$ from the foot of the principal vertical on HL: a horizontal direction at azimuth $\\alpha$ vanishes at $d\\tan\\alpha/\\cos\\varphi$. The three points form a triangle whose **orthocentre is the centre of vision**: the altitudes of the triangle meet at CV, and that is how a computer finds the focal length and the tilt from a photograph of a building.

### What it keeps and loses
Parallelism of every set of edges survives as convergence to a single point; right angles survive in the sense that the three points always form an acute triangle. What is lost is verticality — the one property two-point perspective kept — and with it the true proportions of tall objects: the top of a tower is far smaller than its base.

### How it is drawn
Find the horizon and the third point from the tilt in a side view, fold the eye about the horizon to get the two horizontal points, and draw all edges to the three points ([[inclined-planes]] shows the same trick for a roof). The construction below does a tower. A camera lens that can *shift* (a rising front) keeps the picture plane vertical and the tower upright, which is the two-point picture with the frame moved up ([[tilt-shift-and-view-cameras]]).`,
  ideas: [
    'Tilting the picture plane by φ makes the vertical direction cross it: the verticals vanish at a third point, above when looking up and below when looking down.',
    'The horizon falls d·tan φ from the centre and the third point lies d·cot φ on the other side; at φ = 0 it is at infinity.',
    'The three points form a triangle whose orthocentre is the centre of vision.',
    'Verticals converge, so heights are strongly foreshortened: tall things look taller from below and the ground from above looks like a map.'
  ],
  pitfalls: [
    'Three-point perspective is a different kind of projection — It is the same central projection; only the picture plane is tilted. Rotating the picture back to vertical (a shift lens or an editing program) turns it into two-point perspective.',
    'The third point is placed anywhere on the vertical through CV — Its distance is tied to the horizon and the eye: y₃ and the horizon offset have a product d². Pick it freely and the tower leans in a way no camera could make.',
    'Looking down lowers the horizon — The horizon rises in the frame: when the camera looks down by φ it stands d·tan φ above the centre and the third point lies d·cot φ below it.'
  ],
  formulas: [
    {
      name: 'The third vanishing point',
      expr: 'y3 = d/tan(phi)',
      tex: 'y_3 = d\\cot\\varphi',
      vars: {
        y3: { name: 'distance of V₃ from the centre of vision', q: 'length', unit: 'mm', tex: 'y_3' },
        d: { name: 'distance from the eye to the picture (focal length)', q: 'length', unit: 'mm', value: 28 },
        phi: { name: 'tilt of the camera', q: 'angle', unit: '°', value: 30, min: 1, max: 90, tex: '\\varphi' }
      },
      note: 'On the principal vertical, above the centre when the camera looks up. Tilt 5° with a 28 mm lens: 320 mm.'
    },
    {
      name: 'The horizon on the tilted picture',
      expr: 'yh = d*tan(phi)',
      tex: 'y_h = d\\tan\\varphi',
      vars: {
        yh: { name: 'distance of HL from the centre of vision', q: 'length', unit: 'mm', tex: 'y_h' },
        d: { name: 'distance from the eye to the picture (focal length)', q: 'length', unit: 'mm', value: 28 },
        phi: { name: 'tilt of the camera', q: 'angle', unit: '°', value: 30, min: 0, max: 85, tex: '\\varphi' }
      },
      note: 'Below the centre when looking up, above it when looking down. HL leaves the frame when d tan φ exceeds half its height.'
    },
    {
      name: 'The tilt needed to see the top of a tower',
      expr: 'phi = atan((Ht - eh)/S)',
      tex: '\\varphi = \\arctan\\frac{H - e}{S}',
      vars: {
        phi: { name: 'tilt of the axis to frame the top', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi' },
        Ht: { name: 'height of the tower', q: 'length', unit: 'm', value: 120, tex: 'H' },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.6, tex: 'e' },
        S: { name: 'horizontal distance to the tower', q: 'length', unit: 'm', value: 150 }
      },
      note: 'To put the top of the tower on the axis; the camera must tilt this much and the verticals will lean accordingly.'
    }
  ],
  examples: [
    {
      title: 'Looking up at a tower',
      q: 'A tower 120 m tall is photographed from 150 m away by a camera 1.6 m above the ground, tilted so that the top of the tower is on the axis, with a 28 mm lens. How far from the centre of the frame are the horizon and the third vanishing point?',
      steps: [
        { text: 'The tilt:', tex: '\\varphi = \\arctan\\frac{120 - 1.6}{150} = \\arctan 0.789 = 38.3°' },
        { text: 'The horizon and the third point:', tex: 'y_h = 28 \\tan 38.3° = 22.1\\ \\text{mm}\\ \\text{below}, \\qquad y_3 = 28\\cot 38.3° = 35.5\\ \\text{mm above the centre}' },
        'A full-frame picture in portrait position has half-height 18 mm, so the horizon is below the frame and V₃ above it: the verticals converge upwards.'
      ],
      a: 'φ = 38.3°; the horizon is 22 mm below the centre (outside the frame), V₃ 35.5 mm above it.'
    },
    {
      title: 'How much does the tower lean?',
      q: 'For the same camera, by how many degrees does a vertical edge lean from the vertical at the top left corner of the frame (12 mm left of the centre line, 18 mm above the centre)?',
      steps: [
        'The edge passes through the corner and the point V₃, 35.5 mm above the centre on the centre line. Its horizontal run is 12 mm over a vertical rise of $35.5 - 18 = 17.5$ mm.',
        { text: 'The lean:', tex: '\\arctan\\frac{12}{17.5} = 34.4°' }
      ],
      a: 'About 34° from the vertical, the exaggerated lean of a wide-angle upward shot.'
    }
  ],
  quiz: [
    { q: 'You tilt a level camera upwards to photograph a tall building. The vertical edges', choices: ['converge towards a point above the picture', 'stay parallel', 'converge towards a point below the picture', 'become horizontal'], a: 0, why: 'The picture plane is tilted, so the vertical direction crosses it: its vanishing point is above.' },
    { q: 'A camera with a 35 mm lens is tilted up 20°. How far below the centre is the horizon on the picture (mm)?', answer: 12.7, unit: 'mm', why: 'y_h = d tan φ = 35 tan 20° = 12.7 mm below the centre.' },
    { q: 'With the tilt at 0° the third vanishing point', choices: ['is at infinity', 'is at the centre', 'is on the horizon', 'is below the picture'], a: 0, why: 'd cot 0 is infinite: the verticals are parallel to the picture plane and stay parallel.' },
    { q: 'The centre of vision is the orthocentre of the triangle of the three vanishing points.', a: true, why: 'The altitude from V₃ is the principal vertical, and the lines from V₁ and V₂ through CV are perpendicular to the opposite sides.' },
    { q: 'A shift lens (rising front) takes a picture of a tower with parallel verticals because', choices: ['the picture plane stays vertical and only the frame is moved up', 'it tilts the picture plane', 'it makes the tower shorter', 'it uses a long focal length'], a: 0, why: 'With the picture plane vertical the verticals have no vanishing point; the frame is just shifted to include the top.' }
  ],
  applications: [
    'Architecture and skyscraper rendering: the dramatic upward view of a tall building is three-point perspective.',
    'Comics, storyboards and illustration: extreme high and low angles make the viewer feel above or below a scene.',
    'Photography: converging verticals are the signature of a tilted camera; view cameras and shift lenses are made to avoid them.',
    'Aerial and drone photography: a camera pointing down gives a bird\'s-eye view with the verticals radiating from the nadir point.',
    'Computer vision: the three vanishing points of a building give the focal length and the orientation of the camera that took its picture.'
  ],
  history: 'Three-point perspective was rare before the camera: Renaissance painters kept the picture plane vertical. It became familiar with the steep photographs of the early twentieth century (Alexander Rodchenko\'s up-and-down views, the American skyscraper pictures of the 1920s) and with comics. Photographers\' view cameras, with a rising front to hold the picture plane vertical, date from the nineteenth century, and the tilt-and-shift lens is their descendant.',
  sources: ['Ernest R. Norling, *Perspective Made Easy* (1939).', 'Jay Doblin, *Perspective: A New System for Designers* (1956).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed. 2003), on calibration from vanishing points.'],
  sim: 'pt-three-point-tilt',
  construction: 'pt-three-point-tower'
},

{
  id: 'zero-point-perspective',
  parent: 'one-two-three-points',
  title: 'Perspective without vanishing points',
  level: 2,
  short: 'A box always has at least one vanishing point — three perpendicular directions cannot all be parallel to a plane. A perspective with none is the limit of a long lens from far away, where the points leave the sheet: the picture becomes a parallel projection.',
  keywords: ['zero-point', 'no vanishing point', 'parallel projection', 'telephoto', 'long lens', 'compression', 'orthographic limit', 'oblique', 'face-on', 'flat'],
  prereq: ['one-point-perspective', 'vanishing-points', 'parallel-vs-central'],
  related: ['oblique-projection', 'cavalier-projection', 'isometric-projection', 'game-cameras', 'photography-lenses-and-projections', 'rectilinear-lens'],
  body: `"Zero-point perspective" is the name artists give to pictures in which no lines seem to converge. It is useful to be exact about when that can happen. A box has three mutually perpendicular directions, and **no plane is parallel to three perpendicular directions**: at least one of them crosses the picture plane and has a finite vanishing point. So a solid object in true central projection always has one, two or three vanishing points. A picture with none arises in three ways.

### 1. A flat subject seen face-on
A poster, a façade seen squarely with the depth ignored, a map: all lines lie in planes parallel to the window, so none vanishes and the picture is a true, reduced copy. There is nothing three-dimensional in it to converge.

### 2. The limit of the long lens
Move the eye back to the distance $L$ and, to keep the object the same size in the frame, lengthen the lens in proportion, $d = s\\,L$. A point at depth $z$ behind the nearest face is drawn with the reduction
$$k = \\frac{L}{L + z} \\to 1 \\quad (L \\to \\infty),$$
and the vanishing point of a direction at the angle $\\theta$, at $d\\cot\\theta = s\\,L\\cot\\theta$ from the centre, leaves the sheet. In the matrix $P(d)\\,T(0,0,-L)$ the fourth row gives $w = L - z \\to L$ and the picture is the *orthographic* projection scaled by $s = d/L$: a parallel projection. Edges that ran away become parallel, and the box looks like an oblique drawing. This is the **telephoto compression**: with a 500 mm lens the vanishing points of a box turned $30°$ lie more than 24 frame-widths from the centre.

### 3. Subjects with no straight lines
Rocks, trees and clouds have no parallel straight edges to converge. The vanishing points are still there for any straight things in the scene (a distant fence), but a landscape without them can be drawn without a perspective construction at all.

### What it keeps and loses
In the limit, parallelism, ratios along a line and the shape of each face are kept — measurable like an axonometric drawing — and all depth cues from convergence are lost. That is why the long-lens picture looks flat and the isometric of the drawing office looks "technical".

### How it is drawn
The nearly parallel lines can be drawn with a set square; their small convergence is the ratio $k$. The construction below shows the same cube with a wide and a long lens, where only the distance point changes. The simulation backs the camera away and lengthens the lens to match.

> [!note] With a fixed lens, moving the camera back also gives smaller pictures with the same perspective. It is the product "go back and zoom in" that flattens the picture.`,
  ideas: [
    'A box cannot have zero vanishing points in true perspective: three perpendicular directions cannot all be parallel to the picture plane.',
    'Moving the eye back and lengthening the lens in proportion sends the vanishing points off the sheet and the reduction D/(D + z) to 1: the picture becomes a parallel projection.',
    'A flat subject face-on, and a subject without straight edges, have no convergence to show.',
    'The long lens keeps proportions and loses depth cues; the compression of the depth is the same effect.'
  ],
  pitfalls: [
    'Telephoto lenses compress distance — The compression is the effect of the long distance from which they are used; the lens only crops. A short lens used from far away and cropped gives the same picture.',
    'Zero-point perspective is a different system with its own rules — It is not a separate projection: it is central projection with the eye far away, or a flat picture. The page-level rules are the ones that gave the vanishing points.',
    'With no vanishing points everything is parallel — Only in the limit. A picture from 40 m with a 500 mm lens still has vanishing points; they are just 24 frame-widths away.'
  ],
  formulas: [
    {
      name: 'Reduction of the back face of a box',
      expr: 'k = L/(L + s)',
      tex: 'k = \\frac{L}{L + s}',
      vars: {
        k: { name: 'ratio of the back face to the front face' },
        L: { name: 'distance from the eye to the front face', q: 'length', unit: 'm', value: 4 },
        s: { name: 'depth of the box', q: 'length', unit: 'm', value: 1 }
      },
      note: 'For a one-point view; the closer k is to 1, the more nearly the picture is a parallel projection.'
    },
    {
      name: 'Where the vanishing point goes with a long lens',
      expr: 'n = f/(w*tan(theta))',
      tex: 'n = \\frac{f}{w\\tan\\theta}',
      vars: {
        n: { name: 'distance of the vanishing point from the centre, in frame widths' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 500 },
        w: { name: 'width of the frame', q: 'length', unit: 'mm', value: 36 },
        theta: { name: 'angle of the edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 2, max: 88, tex: '\\theta' }
      },
      note: 'x_v = f cot θ divided by the frame width. With 500 mm at 30° it is 24 widths away.'
    },
    {
      name: 'The distance for the same framing with a longer lens',
      expr: 'L2 = L1*f2/f1',
      tex: 'L_2 = L_1\\,\\frac{f_2}{f_1}',
      vars: {
        L2: { name: 'new distance to the subject', q: 'length', unit: 'm', tex: 'L_2' },
        L1: { name: 'old distance to the subject', q: 'length', unit: 'm', value: 4, tex: 'L_1' },
        f1: { name: 'old focal length', q: 'length', unit: 'mm', value: 50, tex: 'f_1' },
        f2: { name: 'new focal length', q: 'length', unit: 'mm', value: 500, tex: 'f_2' }
      },
      note: 'The subject has the same size when f/L is the same. The background changes because its distance does not scale.'
    }
  ],
  examples: [
    {
      title: 'A cube at three distances',
      q: 'A cube 1 m deep stands in front of the eye. By what factor is the back face smaller than the front face when the camera is 4 m, 40 m and 400 m away?',
      steps: [
        { text: 'Apply $k = L/(L+s)$:', tex: 'k_4 = \\frac{4}{5} = 0.80, \\qquad k_{40} = \\frac{40}{41} = 0.976, \\qquad k_{400} = \\frac{400}{401} = 0.9975' },
        'At 4 m the back is a fifth smaller; at 40 m only 2.4 %; at 400 m a quarter of a per cent: the picture is a parallel projection to the eye.'
      ],
      a: '0.80, 0.976 and 0.9975.'
    },
    {
      title: 'Where have the vanishing points gone?',
      q: 'A box is photographed with a 500 mm lens, turned so that its edges make 30° and 60° with the picture plane. How far from the centre of the frame (36 mm wide) are the two vanishing points?',
      steps: [
        { text: 'By $x = f\\cot\\theta$:', tex: 'x_1 = 500 \\cot 30° = 866\\ \\text{mm} = 24\\ \\text{frame widths}, \\qquad x_2 = 500 \\tan 30° = 289\\ \\text{mm} = 8\\ \\text{widths}' },
        'Both are far outside the frame: within the picture the edges differ in direction by less than 2°.'
      ],
      a: '24 and 8 frame widths from the centre: invisible in the picture, which looks like an oblique drawing.'
    }
  ],
  quiz: [
    { q: 'Why can a box not have no vanishing points in true perspective?', choices: ['three perpendicular directions cannot all be parallel to the picture plane', 'the eye is always above the box', 'lines are always converging', 'the horizon is always visible'], a: 0, why: 'At most two perpendicular directions lie in a plane parallel to the picture; the third crosses it and vanishes at a finite point.' },
    { q: 'A cube is 2 m deep and 18 m from the eye. By what factor is its back face smaller than its front face (two decimals)?', answer: 0.9, why: 'k = L/(L + s) = 18/20 = 0.90.' },
    { q: 'You step back and use a lens twice as long, so that a person stays the same size. Compared with before, the vanishing points of the buildings behind are', choices: ['farther from the centre', 'closer to the centre', 'unchanged', 'swapped'], a: 0, why: 'x_v = f cot θ grows with the focal length.' },
    { q: 'Telephoto lenses flatten perspective because of their long focal length.', a: false, why: 'The flattening comes from the long distance at which they are used. The lens only crops the picture of the distant view.' },
    { q: 'In the limit of an infinitely distant eye (with a matching lens) the central projection becomes', choices: ['a parallel projection', 'a circle', 'a stereographic projection', 'nothing'], a: 0, why: 'The factor D/(D + z) tends to 1 and the projectors become parallel.' }
  ],
  applications: [
    'Sports and wildlife photography: a long lens from far away packs the players and the crowd into one flat plane.',
    'Architectural photography of façades: a long lens from a distance gives nearly parallel lines and little convergence.',
    'Technical illustration and games: isometric and oblique drawings are the parallel-projection limit used on purpose.',
    'Aerial photography and satellite images: from great height the picture of a city is nearly orthographic and can be used as a map.',
    'East Asian scroll painting: the parallel perspective of Chinese and Japanese handscrolls shows a large scene at a uniform scale.'
  ],
  history: 'The telephoto lens was patented in 1891 by Thomas Dallmeyer (and independently by Adolf Miethe), who saw that a positive and a negative lens together make a long focal length in a short tube. Parallel projection as a drawing method is far older: in East Asian handscrolls and in the military plans and architects\' axonometrics from the sixteenth century on; William Farish named the isometric in 1822.',
  sources: ['Rudolf Kingslake, *A History of the Photographic Lens* (1989), the chapter on the telephoto.', 'Sidney F. Ray, *Applied Photographic Optics* (3rd ed. 2002), the chapter on perspective.', 'Yve-Alain Bois, "Metamorphosis of Axonometry", *Daidalos* 1 (1981), on the parallel systems.'],
  sim: 'pt-long-lens',
  construction: 'pt-long-lens-cube'
}

,
{
  id: 'perspective-grids',
  parent: 'one-two-three-points',
  title: 'Perspective grids',
  level: 2,
  short: 'A perspective grid is the picture of a floor of equal squares. The diagonal of a tile goes to the distance point and fixes the depth of every row; once the grid is drawn it is a ruler for position, size and depth, and a plan on squared paper can be transferred to it square by square.',
  keywords: ['perspective grid', 'tiled floor', 'floor tiles', 'chessboard', 'distance point', 'diagonal', 'squares', 'transfer', 'Alberti', 'veil'],
  prereq: ['one-point-perspective', 'two-point-perspective'],
  related: ['alberti-construction', 'measuring-points', 'dividing-depth', 'foreshortening', 'perspective-shadows', 'plan-and-elevation-method'],
  body: `A **perspective grid** is the picture of a regular grid of squares on the ground (or on a wall): a tiled floor, a chessboard, a paving. It is the draughtsman's ruler for depth. Anything lying on the ground can be placed by counting squares, as a cartographer places a coast on a map; the grid fixes both position and size, because the squares that fill a given width shrink in a known way.

### The one-point grid
Divide the front edge $AB$ (on the ground line, in true length) into tiles of width $t$ and join each division to the vanishing point. The depth of the rows comes from the **diagonal**: the 45° diagonal of a tile goes to the distance point DP, at distance $D$ from VP, so a single line from $A$ to DP crosses the lines to VP at the corners of one diagonal row of tiles. Horizontals through the crossings are the row edges. The edge of the $n$-th row stands at
$$y_n = \\frac{e\\,n\\,t}{D + n\\,t}$$
above the ground line, and the tiles of that row are $w_n = w\\,D/(D + n\\,t)$ wide ($w$ the width of a tile at the front). The rows bunch up towards HL like any equal steps in depth ([[foreshortening]]), and the grid never reaches the horizon.

### The two-point grid
When the grid is turned, its lines go to two points V₁, V₂, and the diagonals of the tiles to a third point on the horizon: the vanishing point of the direction midway between the two. It is found where the bisector of the right angle V₁–SP*–V₂ meets HL. The tiles are then found by the diagonals as in one-point, or each row is measured with a measuring point ([[measuring-points]]).

### Using the grid
Draw the plan of the room on squared paper; draw the perspective grid on the sheet; then transfer the plan **square by square**: a point at (3.5, 2) of the plan goes to the point at the same coordinates in the grid. The footprints of furniture are drawn in the grid, and the heights are taken from verticals at the corners (a vertical of height $h$ at the front edge, true; farther back, reduced in the ratio $D/(D+z)$). Alberti's veil and Dürer's frame use the same square grid on the picture plane itself ([[alberti-construction]]).

### What it keeps and loses
Straight lines and their crossings, and the equal division of lines parallel to the picture plane. Lost are the equal spacing of the rows in depth and any angle other than the one fixed by the diagonal. A new grid is needed whenever the eye moves.

### How it is drawn
The construction below tiles a floor with the distance point: front edge, lines to VP, one diagonal to DP, horizontals through the crossings, and the check that all the other diagonals pass through tile corners and end in DP.`,
  ideas: [
    'A perspective grid is the picture of a floor of squares: lines across the view are horizontal, lines into the view go to VP, and the diagonal of a tile goes to the distance point.',
    'One line from a front corner to DP fixes the depth of every row; horizontals through its crossings with the lines to VP are the row edges.',
    'The row edges stand at y_n = e·n·t/(D + n·t) above the ground line: equal rows bunch up towards HL.',
    'A plan on squared paper is transferred to the grid square by square; heights come from verticals reduced by D/(D + z).'
  ],
  pitfalls: [
    'The rows of the grid are equally spaced on the paper — They shrink with the depth: the n-th row edge stands at e·n·t/(D + n·t), not at n times the first.',
    'Any distance point will do — It must lie at the real distance D from VP, or the tiles come out as rectangles, not squares: the check is that the other diagonals go through tile corners.',
    'The grid fixes heights too — It fixes positions on the ground only. A point above the ground is placed by a vertical from the grid at its footprint.'
  ],
  formulas: [
    {
      name: 'Height of the n-th row edge',
      expr: 'yn = eh*n*t/(D + n*t)',
      tex: 'y_n = \\frac{e\\,n\\,t}{D + n\\,t}',
      vars: {
        yn: { name: 'height of the n-th row edge above the ground line', q: 'length', unit: 'mm', tex: 'y_n' },
        eh: { name: 'height of the horizon above the ground line', q: 'length', unit: 'mm', value: 140, tex: 'e' },
        n: { name: 'number of tiles from the front edge', int: true, value: 5 },
        t: { name: 'depth of a tile on the ground (equal to its width)', q: 'length', unit: 'mm', value: 40 },
        D: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 280 }
      },
      note: 'The picture plane at the front edge. As n grows the edge tends to the horizon height e, but never reaches it.'
    },
    {
      name: 'Width of a tile in the n-th row',
      expr: 'wn = w*D/(D + n*t)',
      tex: 'w_n = \\frac{w\\,D}{D + n\\,t}',
      vars: {
        wn: { name: 'width of a tile on the picture at the n-th row edge', q: 'length', unit: 'mm', tex: 'w_n' },
        w: { name: 'width of a tile at the front edge', q: 'length', unit: 'mm', value: 40 },
        n: { name: 'number of tiles from the front edge', int: true, value: 5 },
        t: { name: 'depth of a tile on the ground', q: 'length', unit: 'mm', value: 40 },
        D: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 280 }
      },
      note: 'The row at depth n·t is the front row reduced about VP by D/(D + n·t). Widths shrink as 1/z, while the depth of a row shrinks as 1/z².'
    }
  ],
  examples: [
    {
      title: 'The rows of a tiled floor',
      q: 'A floor of 40-unit tiles is drawn with the horizon 140 above the ground line and the distance point 280 from the vanishing point. Where do the edges of the first, third and fifth rows stand, and how wide is a tile in the fifth row?',
      steps: [
        { text: 'Apply $y_n = e\\,n\\,t/(D + n t)$:', tex: 'y_1 = \\frac{140 \\times 40}{320} = 17.5, \\quad y_3 = \\frac{140 \\times 120}{400} = 42.0, \\quad y_5 = \\frac{140 \\times 200}{480} = 58.3' },
        { text: 'The tile width at the fifth edge:', tex: 'w_5 = \\frac{40 \\times 280}{480} = 23.3' },
        'The first row is 17.5 deep. The fifth lies between $y_4 = 140 \\times 160 / 440 = 50.9$ and $y_5 = 58.3$: only 7.4 deep. Rows shrink as the square of the distance, tile widths only as the distance.'
      ],
      a: 'Row edges at 17.5, 42.0 and 58.3 above the ground line; a tile at the fifth edge is 23.3 wide, and the fifth row is only 7.4 deep.'
    },
    {
      title: 'Checking the distance point',
      q: 'You have drawn a one-point floor and want to know whether the tiles are really square. How do you test it with one line?',
      steps: [
        'Join two diagonally opposite corners of a tile that is not the one you used to find the rows. If the grid is right the line passes through the corner of every tile along it and ends exactly at DP.',
        'If the line misses the corners, the distance point is at the wrong distance and the tiles are rectangles.'
      ],
      a: 'Any other diagonal must run through tile corners to DP; this is the check that D is right.'
    }
  ],
  quiz: [
    { q: 'In a one-point floor grid, what does the diagonal of a tile go to?', choices: ['the distance point', 'the centre of vision', 'a point on the ground line', 'the nadir'], a: 0, why: 'A 45° line vanishes on HL at distance D from the centre of vision: the distance point.' },
    { q: 'The horizon is 140 above the ground line, D = 280 and tiles are 40 deep. How high above the ground line is the third row edge?', answer: 42, why: 'y₃ = 140 × 120 / (280 + 120) = 42.' },
    { q: 'Equal rows of tiles are drawn on the paper', choices: ['thinner and thinner towards the horizon', 'equally spaced', 'wider and wider', 'in a geometric progression with ratio 1/2'], a: 0, why: 'Depth is foreshortened more and more: the n-th edge at e·n·t/(D + n·t).' },
    { q: 'A point 0.5 m above a tile on the floor is placed with a vertical from the grid; its height is reduced by D/(D + z).', a: true, why: 'Heights at the depth z are those at the picture plane multiplied by the reduction of that plane.' },
    { q: 'Why does a transferred plan have to be redrawn if the viewer moves?', choices: ['The grid depends on the eye\'s position', 'The plan changes', 'The horizon becomes vertical', 'Squares become circles'], a: 0, why: 'D, the vanishing points and the horizon all belong to one eye position; a new eye needs a new grid.' }
  ],
  applications: [
    'Interior design and set design: the furniture is positioned on a floor grid before any object is drawn in perspective.',
    'Architectural visualisation: site plans and floor plans are transferred to a perspective grid to place buildings, trees and cars.',
    'Concept art and comics: backgrounds in one-point perspective use a grid as an underlay, with the vanishing point and the horizon visible.',
    'Games and virtual cameras: tiles in strategy games are projected squares; the shape of a tile tells the camera\'s tilt.',
    'Photography and photogrammetry: a tiled floor is the first thing used to estimate the camera tilt from a picture.'
  ],
  history: 'The gridded floor is the oldest tool of Renaissance perspective: Alberti\'s construction in *De pictura* (1435) is a tiled pavement, and the squares of Piero della Francesca\'s *Flagellation* are the pictorial result. Alberti\'s veil (a net of threads) and Dürer\'s gridded frame (the *Zeichner des liegenden Weibes* of 1525) put a grid of squares on the picture plane itself to transfer a scene. Jean Pèlerin (1505) used the diagonal to the distance point to make the floor without a plan.',
  sources: ['Leon Battista Alberti, *De pictura* (1435), book I.', 'Jean Pèlerin (Viator), *De artificiali perspectiva* (1505).', 'Albrecht Dürer, *Underweysung der Messung* (1525).', 'Rex Vicat Cole, *Perspective for Art Students* (1921).'],
  sim: 'pt-grid-floor',
  construction: 'pt-tiled-floor'
},

{
  id: 'measuring-points',
  parent: 'one-two-three-points',
  title: 'Measuring points and the diagonal',
  level: 3,
  short: 'A measuring point carries true lengths onto a receding line: lay the length along the ground line from the near corner, join its end to the measuring point, and the line cuts the receding edge at exactly that length. Swing the distance from the vanishing point to the folded eye onto the horizon to find it.',
  keywords: ['measuring point', 'MP', 'true length', 'two-point', 'isosceles triangle', 'compass', 'ground line', 'distance point', 'equal divisions'],
  prereq: ['two-point-perspective', 'vanishing-points'],
  related: ['direct-measuring-method', 'perspective-grids', 'dividing-depth', 'plan-and-elevation-method', 'alberti-construction'],
  body: `In two-point perspective the lines to the vanishing points are drawn first. But where on such a line does a *given length* end? A scale on the picture would be wrong, because equal lengths shrink with distance. A **measuring point** (MP) answers it for each set of edges: **lay the true length along the ground line from the near corner, join its end to the measuring point, and the line cuts the receding edge at exactly that length from the corner.**

### Why it works
Let $A$ be the near corner, on the picture plane, and $P$ the point on the receding edge at the true distance $s$ from $A$. Let $Q$ be the point on the picture plane (on the ground line) at the same distance $s$ from $A$. Then $APQ$ is an isosceles triangle with the apex angle $\\theta$ at $A$, the angle of the edge to the picture plane; the direction of $PQ$ depends on $\\theta$ only, not on $s$, so **all such chords $PQ$ are parallel** and have a common vanishing point: the measuring point. Since $Q$ is on the picture plane, the line from $Q$ to MP *is* the picture of $PQ$, and it passes through the picture of $P$.

### Where it is
The triangle formed by the vanishing point $V$, the folded eye $S^*$ and the measuring point $M$ is similar to $APQ$ (its sides are parallel to $AP$, $AQ$, $PQ$), so it is isosceles as well:
$$|V M| = |V S^{*}| = \\frac{D}{\\sin\\theta}.$$
In practice: **swing the distance from the vanishing point to the folded eye about the vanishing point down onto the horizon** with the compass; the arc cuts HL at MP, on the side towards the other vanishing point. As a distance from CV,
$$x_M = D\\tan\\frac{\\theta}{2},$$
on the side opposite to $V$: the measuring point of the right-hand edges is left of CV and vice versa. For lines straight into the picture ($\\theta = 90°$) $x_M = D$: the measuring point of the central lines is the **distance point**. So the one-point floor of [[perspective-grids]] is just the special case.

### What it gives
All true lengths along either set of edges (the width of a window, the spacing of posts, the sides of a box), equal divisions (join equal marks on the ground line to the same MP, [[dividing-depth]]) and boxes of any size with no plan and no distant vanishing points on the sheet. The marks always lie on the ground line, which is true length: that is its great convenience.

### What it keeps and loses
The measuring point keeps true lengths along one chosen set of lines only; lengths on the other set need the other MP. And both need the eye position — its folded image — since MP depends on $D$ and $\\theta$.

### How it is drawn
The construction below finds both measuring points with the compass, measures the two walls of a box and divides one into equal parts; the simulation moves the box and the eye and lets you watch the points slide.`,
  ideas: [
    'A true length laid from the near corner on the ground line and joined to the measuring point cuts the receding edge at exactly that length.',
    'The chords PQ of the isosceles triangles APQ are all parallel, so they share a vanishing point: the measuring point.',
    'MP is found by swinging the distance from V to the folded eye SP* about V onto HL: |VM| = |VS*| = D / sin θ, and x_M = D tan(θ/2) on the other side of CV.',
    'For the central direction (θ = 90°) the measuring point is the distance point.'
  ],
  pitfalls: [
    'One measuring point serves both walls — Each set of edges has its own: the right-hand edges use the point on the left of CV and the left-hand edges the one on the right. Marks for the right wall go to the right of A on the ground line.',
    'The marks are laid along the receding edge — They are laid on the ground line (true length) and carried by the line to MP. Marking on the receding line itself with the dividers gives unequal lengths.',
    'MP is the vanishing point of the edges — It is the vanishing point of the chords PQ, a different set of parallels (the bases of the isosceles triangles).'
  ],
  formulas: [
    {
      name: 'Position of the measuring point',
      expr: 'xm = d*tan(theta/2)',
      tex: 'x_M = d\\tan\\frac{\\theta}{2}',
      vars: {
        xm: { name: 'distance of MP from CV (on the side opposite to V)', q: 'length', unit: 'mm', tex: 'x_M' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 140 },
        theta: { name: 'angle of the edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 1, max: 90, tex: '\\theta' }
      },
      note: 'For θ = 30° it is 0.268 d to the left; at θ = 90° it is d: the distance point.'
    },
    {
      name: 'Distance from the vanishing point to the measuring point',
      expr: 'vm = d/sin(theta)',
      tex: '\\ell_M = \\frac{d}{\\sin\\theta}',
      vars: {
        vm: { name: 'distance from the vanishing point to its measuring point', q: 'length', unit: 'mm', tex: '\\ell_M' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 140 },
        theta: { name: 'angle of the edges to the picture plane', q: 'angle', unit: '°', value: 30, min: 1, max: 90, tex: '\\theta' }
      },
      note: 'This is also the distance from the vanishing point to the folded eye — the radius of the compass arc.'
    }
  ],
  examples: [
    {
      title: 'Both measuring points',
      q: 'The eye is 140 from the picture and the right-hand edges of a box make 30° with the picture plane. Where are the vanishing points and the measuring points, and what is the radius of the arc at V₂?',
      steps: [
        { text: 'Vanishing points (by $d\\cot\\theta$ and $d\\tan\\theta$):', tex: 'V_2 = 140\\cot 30° = 242.5\\ \\text{right}, \\qquad V_1 = 140\\tan 30° = 80.8\\ \\text{left}' },
        { text: 'Measuring points:', tex: 'M_2 = 140 \\tan 15° = 37.5\\ \\text{left}, \\qquad M_1 = 140\\tan 30° = 80.8\\ \\text{right}\\ (\\theta\' = 60°)' },
        { text: 'Radius of the arc about V₂:', tex: '|V_2 M_2| = \\frac{140}{\\sin 30°} = 280 = 242.5 + 37.5' }
      ],
      a: 'MP₂ is 37.5 left of CV, MP₁ 80.8 right of CV; the arc about V₂ has radius 280.'
    },
    {
      title: 'A wall of true length',
      q: 'With the same eye, where does the base of a right-hand wall 140 long end if its near corner is at CV on the ground line, 80 below HL?',
      steps: [
        'Lay 140 along the ground line to the right: $R_2 = (140, 0)$ (CV at the origin). Join it to $M_2 = (-37.5, 80)$.',
        { text: 'A point at the depth $z = 140\\sin 30° = 70$ and lateral $140\\cos 30° = 121.2$ should be at', tex: 'X = \\frac{121.2 \\times 140}{140 + 70} = 80.8, \\qquad Y = \\frac{80 \\times 70}{210} = 26.7' },
        { text: 'The line from $R_2$ to $M_2$ reaches the height 26.7 after the fraction $26.7/80 = 1/3$ of its length:', tex: 'X = 140 - \\tfrac13 (140 + 37.5) = 80.8' }
      ],
      a: 'The wall\'s far corner is at (80.8, 26.7); the construction and the exact projection give the same point.'
    }
  ],
  quiz: [
    { q: 'How do you find the measuring point of a set of edges?', choices: ['Swing the distance from their vanishing point to the folded eye onto HL with the compass', 'Bisect the distance between the two vanishing points', 'Drop a vertical from the centre of vision', 'Draw a line at 45° from the vanishing point'], a: 0, why: '|VM| = |VS*|, so an arc about V through SP* cuts HL at MP.' },
    { q: 'With the eye 200 mm from the picture and edges at 40° to the picture plane, how far from CV is the measuring point (mm)?', answer: 72.8, unit: 'mm', why: 'x_M = d tan(θ/2) = 200 tan 20° = 72.8 mm.' },
    { q: 'For lines running straight into the picture (θ = 90°) the measuring point is', choices: ['the distance point', 'the centre of vision', 'the nadir', 'at infinity'], a: 0, why: 'd tan 45° = d: the point on HL at distance D from CV.' },
    { q: 'The marks for the true lengths are laid on the receding edge with the dividers.', a: false, why: 'They are laid on the ground line, where lengths are true, and carried to the edge by lines to the measuring point.' },
    { q: 'The right-hand edges of a box (to V₂, on the right) use the measuring point', choices: ['on the left of CV', 'on the right of V₂', 'at CV', 'at SP*'], a: 0, why: 'MP lies on the side opposite to V: for V₂ on the right, MP₂ is on the left of CV.' }
  ],
  applications: [
    'Architectural perspective by hand: rooms, façades and furniture of known sizes are drawn with the measuring points from the plan dimensions.',
    'Stage and exhibition design: true sizes of walls and openings are laid out from a plan on the ground line.',
    'Perspective underlays and grids: a row of equal posts, windows or steps on a receding wall is divided with the same point.',
    'Teaching descriptive geometry: the measuring point is the clearest example of a vanishing point of a direction that is not an edge.',
    'Photo-based sizing: if the horizon and two vanishing points of a photograph are known, the same construction recovers true lengths on a wall.'
  ],
  history: 'The measuring point grew out of the distance point, which Jean Pèlerin (Viator) described in 1505 for lines at 45°, and out of the "second rule" of Vignola as edited by Egnazio Danti (1583). The general measuring point for lines at any angle is a regular tool of eighteenth-century and later manuals, from Brook Taylor\'s *Linear Perspective* (1715) onwards. The simple compass construction of the point is the draughtsman\'s version of that theory.',
  sources: ['Brook Taylor, *Linear Perspective* (1715).', 'Giacomo Barozzi da Vignola, *Le due regole della prospettiva pratica*, with Egnazio Danti\'s commentary (1583).', 'Ernest R. Norling, *Perspective Made Easy* (1939).', 'Francis D. K. Ching, *Architectural Graphics* (6th ed. 2015).'],
  sim: 'pt-measuring-points',
  construction: 'pt-measuring-points'
},

{
  id: 'dividing-depth',
  parent: 'one-two-three-points',
  title: 'Dividing depth: equal spaces receding',
  level: 2,
  short: 'Equal spaces that recede — fence posts, columns, windows in a long wall — are drawn closer together as they go, in a harmonic sequence. The diagonals of a rectangle cross at its middle, so halving and continuing need no numbers at all.',
  keywords: ['dividing depth', 'equal spaces', 'fence', 'harmonic sequence', 'diagonals', 'halving', 'columns', 'cross-ratio', 'receding', 'rhythm'],
  prereq: ['one-point-perspective', 'foreshortening'],
  related: ['perspective-grids', 'measuring-points', 'cross-ratio', 'alberti-construction', 'perspective-constructions'],
  body: `Equal spaces that recede — fence posts, columns, railway sleepers, windows in a long wall — are drawn smaller and closer together the farther they are. The spacing follows a rule: if the first post stands at the depth $z_0$ and the posts are $s$ apart, **the picture of the $n$-th post is at the fraction**
$$r_n = \\frac{z_0}{z_0 + n\\,s}$$
**of the first post's distance from the vanishing point**, and its foot is $d\\,e/(z_0 + n s)$ below the horizon. The sequence is *harmonic*: $1,\\ 1/(1+q),\\ 1/(1+2q),\\dots$ with $q = s/z_0$.

### The numbers
For posts 2 m apart, the first 6 m from the eye, the distances from the vanishing point are $1,\\ 0.75,\\ 0.60,\\ 0.50,\\ 0.43,\\ 0.375$ times the first. The gaps are $0.25,\\ 0.15,\\ 0.10,\\ 0.071,\\ 0.054$: the second gap is $0.6$ of the first, the third $0.4$ of it. They are not in a fixed ratio, and the sum of all the gaps is finite — the posts pile up at the vanishing point, never reaching it.

### The rule of the diagonal
No numbers are needed. A perspective keeps straight lines and their crossings, so the crossing of the diagonals of a rectangle is the picture of its centre, however foreshortened it is.
1. **Halving.** Draw the diagonals of the panel between two posts; the vertical through the crossing is the post halfway between them. Repeat for 4, 8, 16 bays.
2. **Continuing.** From the foot of one post draw a line through the *middle* of the next post (the middle is where the middle rail, a line to VP at half height, meets it); it meets the top rail at the top of the post after that.

Both are true in the real fence — the line from $(0,0)$ through $(s, h/2)$ reaches the top at $(2s, h)$ — and the picture keeps lines.

### The cross-ratio behind it
Four points on a line have a **cross-ratio** that no projection changes ([[cross-ratio]]). Three consecutive posts and the vanishing point (the picture of the point at infinity of the line) always have the cross-ratio $2$, whatever the viewpoint. So the vanishing point and any three posts determine all the rest: this is the rule of the diagonal in algebraic form.

### What it keeps and loses
Collinearity and incidence, hence the rules above. Lost is the equal spacing, and any scale along the line, except through the cross-ratio.

### How it is drawn
The construction below halves a fence with its diagonals, repeats for four bays and then extends it by two posts with the middle rail. The simulation lets you drag the far post.`,
  ideas: [
    'Equal spaces along a receding line are drawn at the harmonic distances r_n = z₀/(z₀ + n·s) from the vanishing point: closer and closer, never quite meeting it.',
    'The crossing of the diagonals of a panel is the picture of its centre; the vertical through it halves the bay (the halving rule).',
    'A line from the foot of a post through the middle of the next post meets the top rail at the top of the third (the continuing rule).',
    'Three consecutive posts and the vanishing point have the cross-ratio 2 in every perspective.'
  ],
  pitfalls: [
    'Halving the picture of a bay by eye is accurate enough — The middle of the picture of a bay is not the picture of its middle: the nearer half is bigger. Use the diagonals.',
    'Equal bays on the paper mean equal bays in space — The opposite: if they really are equal on the paper, they are unequal in space, longer towards the vanishing point.',
    'The rule only works for a fence at right angles to the picture — It works for any line of posts at any angle; the vanishing point is then that of the line.'
  ],
  formulas: [
    {
      name: 'Distance of the n-th post from the vanishing point',
      expr: 'r = z0/(z0 + n*s)',
      tex: 'r_n = \\frac{z_0}{z_0 + n\\,s}',
      vars: {
        r: { name: 'distance from VP as a fraction of that of the first post', tex: 'r_n' },
        z0: { name: 'depth of the first post', q: 'length', unit: 'm', value: 6, tex: 'z_0' },
        n: { name: 'number of bays from the first post', int: true, value: 4 },
        s: { name: 'spacing of the posts', q: 'length', unit: 'm', value: 2 }
      },
      note: 'For a line parallel to the sight line; the foot of the post stands at the same fraction of the distance below HL.'
    },
    {
      name: 'Height of the foot of the n-th post below the horizon',
      expr: 'hn = d*eh/(z0 + n*s)',
      tex: 'h_n = \\frac{d\\,e}{z_0 + n\\,s}',
      vars: {
        hn: { name: 'distance of the foot below HL on the picture', q: 'length', unit: 'mm', tex: 'h_n' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.6, tex: 'e' },
        z0: { name: 'depth of the first post', q: 'length', unit: 'm', value: 6, tex: 'z_0' },
        n: { name: 'number of bays from the first post', int: true, value: 4 },
        s: { name: 'spacing of the posts', q: 'length', unit: 'm', value: 2 }
      },
      note: 'Equal spacing in z makes this a harmonic sequence on the picture.'
    }
  ],
  examples: [
    {
      title: 'Where do the posts of a fence stand?',
      q: 'Posts stand 2 m apart along a straight road, the nearest 6 m from the eye. Where does each of the first six stand along the picture of the road, as a fraction of the distance of the first from the vanishing point?',
      steps: [
        { text: 'Apply $r_n = z_0/(z_0 + n s)$ with $z_0 = 6$, $s = 2$:', tex: 'r_0 = 1,\\ r_1 = 0.75,\\ r_2 = 0.6,\\ r_3 = 0.5,\\ r_4 = 0.429,\\ r_5 = 0.375' },
        'The gaps are $0.25,\\ 0.15,\\ 0.10,\\ 0.071,\\ 0.054$, so the second bay is only 60 % of the first on the paper, the third 40 %.',
        'The sixth post (n = 5) has already covered 62 % of the way from the first post to the vanishing point.'
      ],
      a: 'Posts at 1, 0.75, 0.60, 0.50, 0.43, 0.375 of the first distance; the bays shrink to 0.6, 0.4, 0.29, 0.21 of the first.'
    },
    {
      title: 'Continuing a fence by the diagonal',
      q: 'The first two posts of a fence (height h, spacing s) are drawn. Find the third without measuring, using only the middle rail.',
      steps: [
        'Find the middle of the second post: where the middle rail (the line from the middle of the first post to VP) cuts it.',
        'Draw a line from the foot of the first post through that middle and extend it to the top rail; the vertical dropped from where it meets the top rail is the third post.',
        { text: 'Why it works, in space: the line from $(0, 0)$ through $(s, h/2)$ is straight, so it reaches the height $h$ at', tex: '(2s,\\ h)' }
      ],
      a: 'The top of the third post is where the line from the first foot through the second post\'s middle meets the top rail.'
    }
  ],
  quiz: [
    { q: 'Posts 2 m apart start 6 m from the eye. The second bay is drawn what fraction of the first?', answer: 0.6, why: 'Gaps in the picture are r₁ − r₂ over r₀ − r₁: 0.15 / 0.25 = 0.6.' },
    { q: 'The vertical through the crossing of the diagonals of a fence panel gives', choices: ['the post exactly half-way between in space', 'the post half-way on the paper', 'the post at the vanishing point', 'nothing definite'], a: 0, why: 'A perspective keeps straight lines and their crossings; the centre of the real rectangle is drawn at the crossing of its drawn diagonals.' },
    { q: 'Three consecutive equal posts and the vanishing point have a cross-ratio of', choices: ['2', '1', '0.5', 'infinite'], a: 0, why: 'In space the four points are z₀, z₀ + s, z₀ + 2s and infinity: (2s)/(s) = 2, and the cross-ratio is invariant.' },
    { q: 'The sum of the gaps between the pictures of infinitely many equal posts is finite.', a: true, why: 'The posts converge to the vanishing point, so the gaps sum to the distance from the first post to VP.' },
    { q: 'To continue a fence beyond its last post you draw a line from the foot of the last-but-one post through', choices: ['the middle of the last post', 'the top of the last post', 'the vanishing point', 'the centre of vision'], a: 0, why: 'In space that line reaches the top at the next post.' }
  ],
  applications: [
    'Architecture: colonnades, window rows and balusters are placed in perspective with the halving and continuing rules.',
    'Landscape and street drawing: fence posts, lamp posts, trees along a road and railway sleepers all use the same harmonic spacing.',
    'Film and animation: a receding row of poles sets the speed of a tracking shot; animators compute their spacing.',
    'Surveying from photographs: the cross-ratio of three equal marks and the vanishing point gives distances along a road.',
    'Stage design and forced perspective: columns that diminish by design give an illusion of greater depth.'
  ],
  history: 'The division of a receding line into equal parts is already in Alberti\'s construction of the tiled floor (1435), and Piero della Francesca divides lines by diagonals in book II of *De prospectiva pingendi*. The invariant behind it, the cross-ratio of four collinear points, appears in Pappus of Alexandria (about 320 AD), was the key to Desargues\'s projective geometry (1639) and was named *rapport anharmonique* by Michel Chasles (1837).',
  sources: ['Leon Battista Alberti, *De pictura* (1435), book I.', 'Piero della Francesca, *De prospectiva pingendi*, book II.', 'H. S. M. Coxeter, *Projective Geometry* (2nd ed. 1987), on the cross-ratio.', 'Kirsti Andersen, *The Geometry of an Art* (2007).'],
  sim: 'pt-dividing-fence',
  construction: 'pt-dividing-fence'
},

{
  id: 'inclined-planes',
  parent: 'one-two-three-points',
  title: 'Inclined planes, roofs and stairs',
  level: 3,
  short: 'A line that rises along a horizontal direction vanishes on the vertical through that direction\'s vanishing point, at the height |V SP*|·tan α above the horizon (or as far below for a line that falls). With it a roof, a ramp or a staircase is drawn without a plan.',
  keywords: ['inclined plane', 'roof', 'gable', 'stairs', 'pitch', 'slope', 'ramp', 'vanishing line', 'vertical through the vanishing point', 'rise and tread'],
  prereq: ['two-point-perspective', 'vanishing-points', 'measuring-points'],
  related: ['three-point-perspective', 'perspective-shadows', 'plan-and-elevation-method', 'perspective-grids', 'dividing-depth'],
  body: `A roof, a ramp, a flight of stairs, a hillside road: all are inclined planes, and their lines rise or fall. A sloping line has a vanishing point like any other, but **not on the horizon**: it lies above HL for a line that rises away from you and below it for a line that falls.

### Where the vanishing point of a slope is
Take a line that rises at the angle $\\alpha$ along a horizontal direction whose vanishing point is $V$ on HL. Its direction is $(\\cos\\alpha\\,\\mathbf u,\\ \\sin\\alpha)$, with $\\mathbf u$ the horizontal unit vector. Its vanishing point has the **same abscissa as $V$** and lies higher than HL by
$$h_v = \\overline{V S^{*}}\\ \\tan\\alpha = \\frac{d}{\\sin\\theta}\\tan\\alpha,$$
where $S^{*}$ is the eye folded onto the picture and $\\theta$ the angle between the horizontal direction and the picture plane. In words: **the vanishing point of a line of slope $\\alpha$ lies on the vertical through the vanishing point of its horizontal direction, at the height $|VS^{*}|\\tan\\alpha$ above HL** (and the same distance below for a line that falls with the same slope).

By hand: swing $VS^{*}$ about $V$ onto HL, at the point $M$ where it lands lay off $\\alpha$ with the protractor, and the line cuts the vertical through $V$ at the point. (This is the same figure as the measuring point's, with the angle $\\alpha$ added.)

### Planes
All the lines of an inclined plane have their vanishing points on one line, the **vanishing line** of the plane. If the plane is tilted about a horizontal edge with vanishing point $V_e$, its horizontal lines go to $V_e$ and its lines of greatest slope to a point on the vertical through the vanishing point of the perpendicular horizontal direction; the vanishing line is the line through these two. For $\\alpha = 0$ it is HL itself.

### Roofs
For a gable roof the two slopes rise along the same horizontal direction, one up and one down, so they share one vertical through $V$: $V_{up}$ above HL and $V_{dn}$ the same distance below. The two lines from the ends of the eave, one to $V_{up}$ and the other to $V_{dn}$, meet at the peak of the gable — over the middle of the eave. The ridge is parallel to the long wall and goes to *its* vanishing point.

### Stairs
For a flight that runs straight away, the line through the nosings (the pitch line) rises with $\\tan\\alpha = r/t$ (riser over tread) and vanishes straight above the centre of vision at $h_s = D\\,r/t$. The treads along the floor are found with the distance point (as in a tiled floor), the nosings are where the verticals through them meet the pitch line.

### What it keeps and loses
Parallels again converge, and heights above a sloping plane are measured along the vertical through the point. Lost is the simplicity: the vanishing points move off the horizon, and with large pitches or short distances they leave the sheet.

### How it is drawn
Two constructions below: a gable roof, whose slope points are found with the compass and protractor, and a flight of stairs from the pitch line and the distance point. The simulation tilts the roof and moves the points.`,
  ideas: [
    'A line rising at α along a horizontal direction with vanishing point V vanishes on the vertical through V, |V SP*|·tan α above HL; a falling line vanishes as far below.',
    'Swing V–SP* onto HL, lay off α at that point with the protractor, and the line cuts the vertical through V at the point.',
    'The two slopes of a gable roof share the vertical through V: V_up and V_dn; the lines from the eave ends meet at the peak over the middle of the gable.',
    'The pitch line of stairs vanishes straight above the centre of vision at D·r/t; nosings are found with the verticals through the tread marks.'
  ],
  pitfalls: [
    'Sloping lines vanish on the horizon — Only horizontal ones do. A rising line vanishes above HL, a falling one below; the horizon is the vanishing line of horizontal planes only.',
    'The vanishing points of the roof slopes can be placed freely — They lie on the vertical through V at a height tied to the pitch and to D: |V SP*|·tan α. Place them arbitrarily and the roof will not meet at a peak over the middle of the gable.',
    'The pitch is the angle you see — The angle of a roof slope on the picture is not its pitch; it depends on the viewpoint. The pitch is α in space, laid at M with the protractor.'
  ],
  formulas: [
    {
      name: 'Height of the vanishing point of a slope above the horizon',
      expr: 'hv = d*tan(alpha)/sin(theta)',
      tex: 'h_v = \\frac{d\\,\\tan\\alpha}{\\sin\\theta}',
      vars: {
        hv: { name: 'height of the vanishing point above HL', q: 'length', unit: 'mm', tex: 'h_v' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 140 },
        alpha: { name: 'slope of the line', q: 'angle', unit: '°', value: 25, min: 0, max: 80, tex: '\\alpha' },
        theta: { name: 'angle of its horizontal direction to the picture plane', q: 'angle', unit: '°', value: 30, min: 5, max: 90, tex: '\\theta' }
      },
      note: 'd / sin θ is the distance V–SP*. For the gable roof of the construction (θ = 30°, α = 25°) it is 131; for stairs running straight in (θ = 90°) it is d·tan α.'
    },
    {
      name: 'Rise of a gable roof',
      expr: 'rise = (w/2)*tan(alpha)',
      tex: 'H_r = \\frac{w}{2}\\tan\\alpha',
      vars: {
        rise: { name: 'height of the ridge above the eaves', q: 'length', unit: 'm', tex: 'H_r' },
        w: { name: 'width of the building between the eaves', q: 'length', unit: 'm', value: 8 },
        alpha: { name: 'pitch of the roof', q: 'angle', unit: '°', value: 25, min: 0, max: 80, tex: '\\alpha' }
      },
      note: 'In space: the peak stands over the middle of the gable end, so its picture is found over the middle found by the diagonals.'
    },
    {
      name: 'Vanishing point of the pitch line of stairs',
      expr: 'hs = d*r/t',
      tex: 'h_s = \\frac{D\\,r}{t}',
      vars: {
        hs: { name: 'height of the point above the centre of vision', q: 'length', unit: 'mm', tex: 'h_s' },
        d: { name: 'distance from the eye to the picture (D)', q: 'length', unit: 'mm', value: 240, tex: 'D' },
        r: { name: 'riser', q: 'length', unit: 'mm', value: 15 },
        t: { name: 'tread', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'For stairs running straight away (θ = 90°, so |V SP*| = D). Steeper stairs push it higher until it leaves the sheet.'
    }
  ],
  examples: [
    {
      title: 'The vanishing points of a roof',
      q: 'A roof of pitch 25° slopes along edges that make 30° with the picture plane; the eye is 140 from the picture. Where are V_up and V_dn above and below HL?',
      steps: [
        { text: 'The distance from the vanishing point to the folded eye:', tex: '|V S^*| = \\frac{140}{\\sin 30°} = 280' },
        { text: 'Hence', tex: 'h_v = 280 \\tan 25° = 280 \\times 0.4663 = 130.6' },
        'The points $V_{up}$ and $V_{dn}$ stand 130.6 above and below the vanishing point $V$ on the vertical through it (the abscissa $140\\cot 30° = 242.5$).'
      ],
      a: 'V_up at 130.6 above HL and V_dn at 130.6 below, both on the vertical through V (242.5 from CV).'
    },
    {
      title: 'The peak of the roof',
      q: 'The building under that roof is 120 wide at the gable (true length between the eaves). How high above the eaves is the peak in space, and what does the construction guarantee about its picture?',
      steps: [
        { text: 'The rise:', tex: 'H_r = \\frac{120}{2}\\tan 25° = 60 \\times 0.4663 = 28.0' },
        'The picture of the peak is the intersection of the line from one eave end to $V_{up}$ with the line from the other to $V_{dn}$; it lies exactly over the middle of the eave found by the diagonals of the gable end — a check on the whole construction.'
      ],
      a: 'The peak is 28.0 above the eave line in space, and its picture stands on the vertical through the crossing of the diagonals of the gable-end wall.'
    }
  ],
  quiz: [
    { q: 'Where does a line that rises away from you vanish?', choices: ['on the vertical through its horizontal vanishing point, above HL', 'on the horizon', 'at the centre of vision', 'at the nadir'], a: 0, why: 'Its direction has the same horizontal part as a ground line, so the same abscissa, and a vertical part that lifts it above HL by |V SP*|·tan α.' },
    { q: 'The eye is 100 mm from the picture. A flight of stairs with riser 18 and tread 30 runs straight away. How high above the centre of vision is the vanishing point of its pitch line (mm)?', answer: 60, unit: 'mm', why: 'h_s = D·r/t = 100 × 18 / 30 = 60 mm.' },
    { q: 'The two slopes of a gable roof have vanishing points', choices: ['V_up above and V_dn below HL on the same vertical', 'both on the horizon', 'both above HL on different verticals', 'at the centre of vision'], a: 0, why: 'They slope in opposite directions along the same horizontal direction, so one rises and one falls by the same angle.' },
    { q: 'The vanishing line of a horizontal plane is the horizon.', a: true, why: 'A horizontal plane contains all horizontal directions, whose points lie on HL.' },
    { q: 'For a roof pitched at 40° the vanishing point of the slope is farther above HL than for 20°, at the same viewpoint.', a: true, why: 'h_v = |V SP*|·tan α grows with α.' }
  ],
  applications: [
    'Architecture: roofs, dormers, gables, ramps and staircases are drawn in perspective with these points; the peak check catches mistakes.',
    'Civil engineering and landscape design: roads on slopes, embankments, ski runs and ramps are shown with their vanishing line.',
    'Industrial design: sloping panels, hoppers and slide surfaces are all inclined planes whose vanishing line replaces the horizon.',
    'Stage design: a raked stage floor is a plane that rises away from the audience; its vanishing line is above HL.',
    'Computer vision: the vanishing line of a plane gives its tilt relative to the camera, used to rectify photographs of roofs and roads.'
  ],
  history: 'Brook Taylor (*Linear Perspective*, 1715) was the first to treat the vanishing points of inclined lines and the vanishing line of a plane systematically; earlier treatises solved roofs and stairs piece by piece with plans and elevations (Piero della Francesca, Pèlerin, Vignola and Danti). The draughtsman\'s rule that the point lies on the vertical through the point of the horizontal direction is the plain version of his theorem.',
  sources: ['Brook Taylor, *Linear Perspective* (1715).', 'Piero della Francesca, *De prospectiva pingendi*, book II.', 'Ernest R. Norling, *Perspective Made Easy* (1939).', 'Francis D. K. Ching, *Architectural Graphics* (6th ed. 2015).'],
  sim: 'pt-slope-vanishing',
  construction: ['pt-gable-roof', 'pt-stairs']
}

/* @@MORE@@ */
);
