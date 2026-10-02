/* HYPER-PROJECTIONS · content/perspective-constructions.js — the drawing-board methods of linear perspective and its effects.
 *
 *   plan-and-elevation-method   the visual-ray method: a plan, a station point, true heights carried to the vanishing points
 *   alberti-construction        the costruzione legittima: braccia, orthogonals, the side view, the diagonal check
 *   direct-measuring-method     measuring points on the horizon, swung with the compass
 *   perspective-shadows         light vanishing points for sun and lamp
 *   perspective-reflections     still water and vertical mirrors
 *   anamorphosis                the stretched picture, seen from one place
 *   forced-perspective          size against distance: the Ames room, stage sets, trick photographs
 *   reverse-perspective         the Byzantine reversal: parallels that diverge
 *   atmospheric-perspective     haze as a tone scale
 * Constructions are in constructions/perspective-constructions.js, simulations in sims/perspective-constructions.js.
 */
Hyper.add(
{
  id: 'plan-and-elevation-method',
  parent: 'perspective-constructions',
  title: 'The plan-and-elevation (visual ray) method',
  level: 2,
  short: 'Perspective drawn from the plan: a ray from the station point to each corner of the plan crosses the picture plane where that corner is seen, and true heights carried along lines to the vanishing points say how high.',
  keywords: ['visual ray', 'plan and elevation', 'station point', 'picture plane', 'office method', 'ground line', 'horizon', 'vanishing points', 'true height', 'architectural perspective', 'Vignola'],
  prereq: ['vanishing-points', 'station-point-and-cone-of-vision', 'orthographic-projection'],
  related: ['direct-measuring-method', 'measuring-points', 'two-point-perspective', 'alberti-construction', 'inclined-planes', 'monge-method'],
  body: `A perspective can be calculated, but it can also be **drawn from a plan**, and that is how architects drew it for centuries. The idea is the oldest in perspective: a point is seen where the line from the eye to it crosses the picture plane. If you have the plan of a building and the position of the eye on that plan, one sheet of paper, a straightedge and a set square will find where every corner is seen.

### The set-up
Draw the plan with the picture plane $PP$ across it as a straight line (it is seen edge-on from above) and mark the **station point** $SP$, the eye seen from above, at the distance $D$ in front of $PP$. Below the plan draw the picture itself: the **ground line** $GL$, where the ground meets the picture plane, and parallel to it the **horizon** $HL$ at the eye height $e$ above it. Plan and picture share their horizontal positions, so a vertical line carries a position from one to the other. [The lab](#/tools/perspective/construction) draws exactly this, step by step, for a box.

### The steps
1. From $SP$ draw the **visual rays** to the corners of the plan. Where a ray crosses $PP$ the corner is seen sideways at that place.
2. Through $SP$ draw lines parallel to the sides of the building. They meet $PP$ at points that, dropped vertically onto the horizon, are the **vanishing points** (a direction vanishes where the line through the eye in that direction meets the picture plane).
3. Drop the crossings vertically into the picture: every vertical edge of the building stands on one of these lines.
4. Heights come from the one edge that touches the picture plane, drawn **full size**. Lines from its ends to the vanishing points carry the height back along each wall, and where they cut the other verticals the other edges are found.

### Why it works
The ray from $SP = (x_s, -D)$ to the point $(x, z)$ of the plan, $z$ behind $PP$, crosses $PP$ at
$$x_p = x_s + (x - x_s)\\,\\frac{D}{z + D},$$
and a point at height $h$ is drawn $(h - e)\\,D/(z + D)$ above the horizon. The factor $D/(z+D)$ is the **scale at depth $z$**: it is 1 on the picture plane and shrinks towards 0 far away. A wall that makes the angle $\\theta$ with $PP$ vanishes at $x_s + D\\cot\\theta$.

### What it is good for, and what it costs
The method is exact and works for any plan, curved walls included: find the crossing of each point you need. It costs paper (the plan needs room) and, with a wide angle, vanishing points that fall off the sheet; then [[measuring-points]] or a [[perspective-grids|grid]] take over. Put $SP$ so that the object is seen in a cone of about 30°–40° ([[station-point-and-cone-of-vision]]); a distance of two or three times the width of the object gives a natural picture.

> [!tip] Roofs and gables need nothing new: the ridge is just another edge, parallel to a wall and so vanishing at the same point, and its height is carried along that line from the true height at the picture plane.`,
  ideas: [
    'A point is drawn where the ray from the station point to it crosses the picture plane: the plan gives the sideways position, true heights give the rest.',
    'The vanishing point of a direction is where the line through the station point in that direction meets the picture plane, dropped onto the horizon.',
    'Only an edge lying in the picture plane is drawn full size; all other heights are carried along lines to the vanishing points.',
    'The scale at depth z behind the picture plane is D / (z + D): one on the plane, smaller with distance.'
  ],
  pitfalls: [
    'The station point is just a mark on the plan — It is the eye of the person who will look at the picture, and the picture is right only from there; moving it changes the vanishing points and the whole drawing.',
    'The horizon is drawn through the middle of the object — The horizon is at the eye height, wherever that falls: low for a worm\'s-eye view, above the roof for a bird\'s-eye view.',
    'A vanishing point may be placed anywhere that looks good — Its place is fixed by the direction of the wall and the distance D; choose the angle and D, then find the points.'
  ],
  formulas: [
    {
      name: 'Where a visual ray crosses the picture plane',
      expr: 'xp = xs + (x - xs)*D/(z + D)',
      tex: 'x_p = x_s + (x - x_s)\\,\\frac{D}{z + D}',
      vars: {
        xp: { name: 'position in the picture', q: 'length', unit: 'mm', signed: true, tex: 'x_p' },
        xs: { name: 'position of the station point', q: 'length', unit: 'mm', value: 20, signed: true, tex: 'x_s' },
        x: { name: 'sideways position of the point in the plan', q: 'length', unit: 'mm', value: 60, signed: true },
        z: { name: 'depth of the point behind the picture plane', q: 'length', unit: 'mm', value: 80, tex: 'z' },
        D: { name: 'distance of the station point from the picture plane', q: 'length', unit: 'mm', value: 140 }
      },
      note: 'The scale D/(z + D) is also the factor by which a vertical edge at depth z is shortened. For z = 0 the formula gives $x_p$ = x.'
    },
    {
      name: 'The vanishing point of a wall',
      expr: 'xv = xs + D/tan(theta)',
      tex: 'x_v = x_s + \\frac{D}{\\tan\\theta}',
      vars: {
        xv: { name: 'position of the vanishing point', q: 'length', unit: 'mm', signed: true, tex: 'x_v' },
        xs: { name: 'position of the station point', q: 'length', unit: 'mm', value: 20, signed: true, tex: 'x_s' },
        D: { name: 'distance of the station point from the picture plane', q: 'length', unit: 'mm', value: 140 },
        theta: { name: 'angle between the wall and the picture plane', q: 'angle', unit: '°', value: 35, min: 5, max: 85, tex: '\\theta' }
      },
      note: 'A wall turned 35° to the picture plane vanishes 200 mm from the station point when D is 140 mm; the perpendicular wall (55°) vanishes at $x_s$ − D tan 35°, on the other side.'
    }
  ],
  examples: [
    {
      title: 'One corner of a house',
      q: 'The station point is 140 mm in front of the picture plane and exactly opposite the origin of the plan. A corner of the house is 60 mm to the right of the eye line and 80 mm behind the picture plane. Where is it drawn, and what happens to a 30 mm vertical edge there?',
      steps: [
        { text: 'The ray crosses the picture plane at', tex: '$x_p$ = 0 + 60 \\cdot \\frac{140}{80 + 140} = 38.2\\ \\text{mm}' },
        'The scale at depth 80 mm is $140/220 = 0.636$.',
        'A vertical edge of 30 mm at that depth is drawn $30 \\times 0.636 = 19.1$ mm long, and the same factor shortens its distance from the horizon.'
      ],
      a: 'The corner is seen 38.2 mm to the right of the centre; vertical edges there are drawn at 0.636 of their true length.'
    },
    {
      title: 'Vanishing points of a house turned 35°',
      q: 'The long wall of a house makes 35° with the picture plane. The station point is 140 mm from the plane and 20 mm to the right of the origin of the plan. Where do the two walls vanish?',
      steps: [
        { text: 'The long wall:', tex: '$x_v$ = 20 + \\frac{140}{\\tan 35°} = 20 + 199.9 \\approx 220\\ \\text{mm}' },
        { text: 'The short wall is perpendicular, so it makes 55° with the plane and vanishes on the other side, at', tex: '$x_v$ = 20 - 140 \\tan 35° = 20 - 98.0 = -78\\ \\text{mm}' },
        'Both points lie on the horizon, so the picture spans nearly 300 mm although the house itself is drawn about 100 mm wide. This is the usual price of the method.'
      ],
      a: 'VP₁ at 220 mm to the right and VP₂ at 78 mm to the left of the origin, both on the horizon.'
    }
  ],
  quiz: [
    { q: 'Where is a corner of the building drawn in the picture?', choices: ['Where the plan of the corner lies on the picture plane', 'Where the line from the station point to the corner crosses the picture plane', 'Where the horizon cuts the vertical through the corner', 'At the vanishing point of the wall it belongs to'], a: 1, why: 'The visual ray from the eye to the corner crosses the picture plane at the point where the corner is seen; that is the whole of perspective.' },
    { q: 'The vanishing point of a wall is found by drawing, in the plan, a line through the station point parallel to the wall until it meets the picture plane.', a: true, why: 'A direction vanishes where the line through the eye in that direction meets the picture plane; dropped vertically onto the horizon it is the vanishing point.' },
    { q: 'The station point is 135 mm from the picture plane. By what factor is a vertical edge shortened at a depth of 90 mm behind the plane?', answer: 0.6, why: 'The scale is D/(z + D) = 135/225 = 0.6.' },
    { q: 'Which edge of a building can be drawn at its true size without any construction?', choices: ['The nearest edge, whatever its position', 'The tallest edge', 'An edge lying in the picture plane', 'The edge on the horizon'], a: 2, why: 'On the picture plane the scale is exactly 1. The method therefore places one edge (here the corner A) on the plane and takes every height from it.' },
    { q: 'With the same plan and angle, the station point is moved twice as far from the picture plane. What happens to the vanishing points?', choices: ['They move twice as far from the centre of the picture', 'They come twice as close', 'They stay where they were', 'They swap sides'], a: 0, why: '$x_v$ − $x_s$ = D cot θ is proportional to D: a longer distance spreads the vanishing points apart and gives a flatter, more telephoto picture.' }
  ],
  applications: [
    'Architectural presentation drawings: office perspectives of a building from its plan, for a client who has to see how it will stand in the street.',
    'Stage and film design: a set drawn from the ground plan gives the camera position and what it will show before anything is built.',
    'Teaching and checking: the method shows every step of perspective in terms the draughtsman can verify; computer renderers do the same ray-crossing for millions of points.',
    'Forensic and survey reconstruction, where a photograph is interpreted by finding the plan that would produce it.'
  ],
  history: 'Piero della Francesca set out the plan-and-elevation construction in his *De prospectiva pingendi* (c. 1474), applying it to polygons, columns, a capital and a human head, point by point. Jacopo Barozzi da Vignola wrote down "the two rules of practical perspective" (the plan method and the distance-point method) in the sixteenth century; Egnazio Danti published them with his commentary in 1583, ten years after Vignola\'s death, and the book was the standard text of the Italian workshop. Gaspard Monge\'s descriptive geometry (1795) generalised the use of plan and elevation to all drawing.',
  sources: [
    'Piero della Francesca, *De prospectiva pingendi* (c. 1474), Book II.',
    'Jacopo Barozzi da Vignola and Egnazio Danti, *Le due regole della prospettiva pratica* (Rome, 1583).',
    'Francis D. K. Ching, *Architectural Graphics*, the chapters on perspective drawing.',
    'Martin Kemp, *The Science of Art* (1990), chapter 2.'
  ],
  construction: 'pc-plan-elevation-house'
},

{
  id: 'alberti-construction',
  parent: 'perspective-constructions',
  title: 'Alberti\'s construction of the tiled floor',
  level: 2,
  short: 'The costruzione legittima: divide the base of the picture into equal braccia, join the divisions to the centric point, and find the spacing of the transversals from a side view of the eye, or from a diagonal to the distance point.',
  keywords: ['Alberti', 'costruzione legittima', 'tiled floor', 'pavement', 'braccia', 'centric point', 'orthogonals', 'transversals', 'distance point', 'diagonal', 'checkerboard'],
  prereq: ['one-point-perspective', 'horizon-and-eye-level', 'vanishing-points'],
  related: ['perspective-grids', 'dividing-depth', 'measuring-points', 'alberti-window', 'direct-measuring-method', 'perspective-in-painting'],
  body: `The recipe for a floor of square tiles in *De pictura* (1435) is the first complete construction of linear perspective that we have in writing. Everything else can then be placed on that floor, because every tile is a unit of ground measure: a figure stands on one tile, a column on a corner, a table covers four.

### The recipe
1. Draw the **base** of the picture and divide it into equal parts. Alberti's unit is the *braccio*, about a third of a man's height.
2. Mark the **centric point** $C$, at the height of the viewer's eye, and join every division to it. These **orthogonals** are the images of the parallel lines of the floor that run away from you; they meet at $C$ because parallel lines meet at one point on the horizon.
3. The **transversals**, the lines of equal depth, need the viewing distance. Draw beside the picture a small side view: a vertical line for the picture plane, the eye at the true height and the true distance, and ground marks one braccio, two, three … behind the picture plane. The rays from the eye to the marks cross the picture-plane line at heights; carry them across to the picture with a T-square.

### Why it works
In the side view, similar triangles give the height at which the ground point at depth $z$ is drawn above the base line:
$$y = h\\,\\frac{z}{z + d},$$
with $h$ the eye height and $d$ the distance of the eye from the picture. Equal steps in $z$ give shrinking steps in $y$ (with $d = 5b$ the first row is $13.3$ high, the sixth only $43.6$, and the spacing between neighbours falls from $13.3$ to $3.6$). The width of a tile at depth $z$ is $b\\,d/(z + d)$.

### The diagonal check
A diagonal of a floor square is at 45° to the orthogonals, and every 45° line vanishes at the **distance point** $D$, on the horizon at the distance $d$ from $C$. So a line from a base corner to $D$ must pass through the corners of all tiles on that diagonal. If it bends, a transversal is wrong. And if you know $d$ you can skip the side view altogether: the diagonal from the first division to $D$ cuts the orthogonals exactly at the transversals.

> [!note] The viewing distance is a decision, not a measurement. About one and a half to two times the width of the picture gives a natural effect; a smaller $d$ makes the tiles on the sides look stretched.`,
  ideas: [
    'Divide the base into equal parts and join them to the centric point: these orthogonals are the receding parallels of the floor.',
    'The spacing of the transversals comes from the side view of the eye: y = h z / (z + d).',
    'A diagonal from a base corner to the distance point passes through the corners of the tiles: the built-in check, and a shortcut that replaces the side view.',
    'Equal ground steps shrink on the picture, and the shrinkage is the measure of how close the eye is.'
  ],
  pitfalls: [
    'The transversals are equally spaced in the picture — They are equally spaced on the ground and get closer together towards the horizon; equal spacing in the picture would make a floor tipped up like a wall.',
    'The distance point is the vanishing point of the floor lines — It is the vanishing point of the 45° diagonals only; the orthogonals vanish at the centric point C.',
    'Any distance d will do — Any d gives a correct picture, but only for an eye at that distance; the wrong one makes the picture look distorted.'
  ],
  formulas: [
    {
      name: 'Height of a transversal above the base',
      expr: 'y = h*z/(z + d)',
      tex: 'y = h\\,\\frac{z}{z + d}',
      vars: {
        y: { name: 'height of the transversal above the base line', q: 'length', unit: 'mm' },
        h: { name: 'eye height (height of the horizon above the base)', q: 'length', unit: 'mm', value: 80 },
        z: { name: 'depth of the ground line behind the picture plane', q: 'length', unit: 'mm', value: 90 },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 150 }
      },
      note: 'At z = 0 the transversal is the base; as z grows y approaches h, the horizon, and never reaches it.'
    },
    {
      name: 'Apparent width of a tile',
      expr: 'w = b*d/(z + d)',
      tex: 'w = b\\,\\frac{d}{z + d}',
      vars: {
        w: { name: 'width of the tile in the picture at that depth', q: 'length', unit: 'mm' },
        b: { name: 'width of a tile on the base line (the braccio)', q: 'length', unit: 'mm', value: 30 },
        z: { name: 'depth of the near edge of the tile', q: 'length', unit: 'mm', value: 120 },
        d: { name: 'viewing distance', q: 'length', unit: 'mm', value: 150 }
      },
      note: 'The same factor d/(z + d) shrinks every length parallel to the picture plane at depth z.'
    }
  ],
  examples: [
    {
      title: 'The fourth transversal and a tile there',
      q: 'A floor six braccia wide is drawn with the braccio b = 30, the eye height h = 80 and the viewing distance d = 150 (all in mm). Where is the fourth transversal, and how wide is a tile that touches it?',
      steps: [
        { text: 'The fourth transversal is at depth $z = 4b = 120$:', tex: 'y = 80 \\cdot \\frac{120}{120 + 150} = 35.6\\ \\text{mm}' },
        { text: 'A tile whose near edge lies on it is only', tex: 'w = 30 \\cdot \\frac{150}{270} = 16.7\\ \\text{mm}' },
        'wide, a little more than half the 30 mm of the first row. Its depth is the gap to the next transversal: $y_5 - y_4 = 40.0 - 35.6 = 4.4$ mm, a third of the first tile\'s.'
      ],
      a: 'The fourth transversal is 35.6 mm above the base and a tile on it is 16.7 mm wide and 4.4 mm deep.'
    },
    {
      title: 'The diagonal gives the same row',
      q: 'With the same numbers, draw the diagonal from the left base corner (−90, 0) to the distance point (150, 80). Where does it cross the central orthogonal (the vertical through C at x = 0)? Compare with the third transversal.',
      steps: [
        'Along the diagonal $y = 80\\,(x + 90)/240$, since it climbs 80 over a horizontal run of $90 + 150 = 240$.',
        { text: 'At $x = 0$:', tex: 'y = 80 \\cdot \\frac{90}{240} = 30\\ \\text{mm}' },
        { text: 'The third transversal from the formula, $z = 90$:', tex: 'y = 80 \\cdot \\frac{90}{90 + 150} = 30\\ \\text{mm}' }
      ],
      a: 'Both give 30 mm: the diagonal to the distance point finds the transversals without a side view.'
    }
  ],
  quiz: [
    { q: 'Which lines of the finished floor meet at the centric point?', choices: ['The transversals', 'The orthogonals', 'The diagonals', 'The tile edges and the horizon'], a: 1, why: 'The orthogonals are images of lines running straight away from the picture plane; parallel lines meet at one point of the horizon, the centric point.' },
    { q: 'Equal steps along the ground are drawn as equal steps in the picture.', a: false, why: 'They shrink: y = h z/(z + d) gives smaller and smaller intervals towards the horizon.' },
    { q: 'h = 80, d = 150, braccio 30 (mm). How high above the base is the fifth transversal (z = 150)?', answer: 40, unit: 'mm', why: 'y = 80 · 150/(150 + 150) = 40 mm.' },
    { q: 'The viewer moves farther from the picture (larger d). The transversals', choices: ['move up, spreading apart', 'move down, crowding towards the base', 'stay where they are', 'curve'], a: 1, why: 'y = h z/(z + d) decreases as d grows: the floor is flatter and the rows crowd together, the compression of depth that a long lens gives.' },
    { q: 'A line from a base corner to the distance point must pass through the far corners of the tiles on that diagonal.', a: true, why: 'Diagonals of floor squares are at 45° to the orthogonals and vanish at the distance point; a line to that point that misses a corner shows a wrong transversal.' }
  ],
  applications: [
    'Floors, tiled courtyards and chessboards in paintings, from Donatello\'s reliefs to the interiors of the Dutch painters, all start from this grid.',
    'Stage and set design: a grid on the stage floor marks where every flat and actor stands, and gives the scale at each depth.',
    'Perspective grids in architecture and concept art: a quick floor grid to which furniture and figures are fitted.',
    'Camera calibration in vision: a checkerboard on a floor shows the same shrinking tiles from which the camera\'s distance and tilt are computed.'
  ],
  history: 'Leon Battista Alberti (1404–1472) wrote *De pictura* in Latin in 1435 and in Italian (*Della pittura*) in 1436, dedicating the Italian text to Brunelleschi. He gave the recipe without a diagram, speaking of the "centric point" and of a second small figure at the side. The name *costruzione legittima* ("legitimate construction") is later; it distinguished the construction from the simpler distance-point shortcuts. The tiled floor appears in Donatello\'s relief of the Feast of Herod (about 1427) and in Masaccio\'s Trinity (about 1427), and is the setting of nearly every Italian Renaissance interior.',
  sources: [
    'Leon Battista Alberti, *De pictura* (1435), Book I, and *On Painting*, translated by Cecil Grayson (Penguin, 1991).',
    'Martin Kemp, *The Science of Art* (1990), chapter 2.',
    'Samuel Y. Edgerton, *The Renaissance Rediscovery of Linear Perspective* (1975).',
    'Rex Vicat Cole, *Perspective for Art Students* (1921).'
  ],
  construction: 'pc-alberti-floor'
},

{
  id: 'direct-measuring-method',
  parent: 'perspective-constructions',
  title: 'The direct measuring method',
  level: 2,
  short: 'Measuring points on the horizon turn the vanishing points into rulers: swing the distance from each vanishing point to the station point onto the horizon, and true lengths laid on the ground line are carried to the receding edges.',
  keywords: ['measuring point', 'direct measuring', 'swing', 'compass', 'true length', 'ground line', 'isosceles triangle', 'two-point perspective', 'M1', 'M2'],
  prereq: ['vanishing-points', 'two-point-perspective', 'plan-and-elevation-method'],
  related: ['measuring-points', 'dividing-depth', 'perspective-grids', 'alberti-construction', 'foreshortening'],
  body: `The [[plan-and-elevation-method|plan method]] finds each point with its own ray. When you only want to put lengths you know on a receding edge, there is a shortcut that needs no plan of the object: the **measuring point**.

### The problem
A receding edge is drawn along a line to its vanishing point, but you cannot measure along it: lengths shrink with depth. What you can measure is the **ground line** $GL$, where nothing shrinks. The measuring point is a way of carrying true lengths from $GL$ to the receding edge.

### The construction
1. From $SP$ in the plan strip draw the two lines parallel to the walls; they meet $PP$ at $v_1$, $v_2$, and dropped onto the horizon they are $VP_1$, $VP_2$.
2. **Swing.** With centre $v_1$ and radius $v_1SP$ draw an arc from $SP$ onto $PP$, to $m_1$ on the side of $v_1$ towards the centre. Do the same about $v_2$ to $m_2$. Dropped onto the horizon, $m_1$ and $m_2$ are the **measuring points** $M_1$, $M_2$.
3. From the corner $A$ (on the ground line) lay off the true length $t$ along $GL$ towards the side of the vanishing point. Join the mark to the measuring point of that edge. Where the line cuts the edge $A\\,VP$ is the end of the length.

### Why it works
The triangle $SP\\,v_1\\,m_1$ is isosceles, so the line from $SP$ to $m_1$ makes the same angle with the picture plane as the edge does, on the other side. In the plan, a line parallel to $SP\\,m_1$ through a point of the edge cuts $PP$ at distance $t$ from $A$, exactly as the true length. In the picture all lines parallel to $SP\\,m_1$ vanish at $M_1$, which is why lines from $M_1$ to marks on $GL$ carry true lengths. Algebraically, the point at distance $t$ along an edge that makes the angle $\\theta$ with the picture plane sits the fraction
$$f = \\frac{t\\sin\\theta}{t\\sin\\theta + D}$$
of the way from $A$ to the vanishing point.

### Practical points
The measuring point of an edge lies at $D\\tan(\\theta/2)$ from the centre of vision, on the side away from the edge\'s vanishing point; the two are not symmetric unless the walls are at 45°. If a measuring point falls off the sheet, use the point **halfway** between it and its vanishing point and lay off **half** the lengths: the intersections are the same, because the fraction above equals $t/(t + r)$ with $r = D/\\sin\\theta$ the distance from the vanishing point to its measuring point, and it depends only on the ratio $t/r$. Depths of a box, of a row of windows, of a staircase are all measured like this, each on its own ground line.`,
  ideas: [
    'A measuring point swings the station point round a vanishing point onto the horizon; lines from it to marks on the ground line carry true lengths to a receding edge.',
    'No plan of the object is needed, only the station point and the angle of the walls.',
    'For an edge at angle θ to the picture plane, the picture of a length t lies at the fraction t sinθ / (t sinθ + D) of the way from the corner to the vanishing point.',
    'If the measuring point is off the sheet, use the point halfway to the vanishing point and half the lengths: the fraction depends only on the ratio of the two.'
  ],
  pitfalls: [
    'Lengths are laid off on the receding edge itself — They are laid on the ground line, where scale is 1; the measuring point carries them to the edge.',
    'M₁ belongs to VP₂ — Each edge uses the measuring point swung about its own vanishing point (M₁ with the edge to VP₁), and the length is laid on the ground line towards the side of that vanishing point.',
    'Measuring points can only be found with a plan — They need only the distance D and the angle of the walls: M = D tan(θ/2) from the centre of vision.'
  ],
  formulas: [
    {
      name: 'Position of a measuring point',
      expr: 'xm = D*tan(theta/2)',
      tex: 'x_m = D\\tan\\frac{\\theta}{2}',
      vars: {
        xm: { name: 'distance of the measuring point from the centre of vision', q: 'length', unit: 'mm', tex: 'x_m' },
        D: { name: 'distance of the station point from the picture plane', q: 'length', unit: 'mm', value: 110 },
        theta: { name: 'angle between the edge and the picture plane', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\theta' }
      },
      note: 'For the edge at θ the measuring point is this far from the centre of vision, on the side away from the edge\'s own vanishing point. For θ = 45° the two measuring points are D tan 22.5° = 0.414 D from the centre.'
    },
    {
      name: 'Where a length falls on a receding edge',
      expr: 'f = t*sin(theta)/(t*sin(theta) + D)',
      tex: 'f = \\frac{t\\sin\\theta}{t\\sin\\theta + D}',
      vars: {
        f: { name: 'fraction of the way from the corner to the vanishing point' },
        t: { name: 'true length laid off along the edge', q: 'length', unit: 'mm', value: 130 },
        theta: { name: 'angle between the edge and the picture plane', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\theta' },
        D: { name: 'distance of the station point from the picture plane', q: 'length', unit: 'mm', value: 110 }
      },
      note: 'The depth reached is t sinθ, so f is the scale-down D/(z + D) turned into a fraction of the whole run to infinity.'
    }
  ],
  examples: [
    {
      title: 'Measuring points for a box turned 40°',
      q: 'The station point is 110 mm from the picture plane and the walls of a box make 40° and 50° with it. Where are the measuring points, and how far along the base edge to VP₁ is the end of a width of 130 mm?',
      steps: [
        { text: 'The edge at 40° vanishes to the right; its measuring point is', tex: 'x_{M_1} = -110\\tan 20° = -40.0\\ \\text{mm}' },
        { text: 'The edge at 50° vanishes to the left; its measuring point is', tex: 'x_{M_2} = +110\\tan 25° = +51.3\\ \\text{mm}' },
        { text: 'The width 130 mm along the 40° edge:', tex: 'f = \\frac{130 \\sin 40°}{130 \\sin 40° + 110} = \\frac{83.6}{193.6} = 0.432' },
        'So the far end of the width is 43 % of the way from the corner A to VP₁.'
      ],
      a: 'M₁ is 40 mm left of the centre of vision, M₂ 51 mm right of it; the width ends 43 % of the way from A to VP₁.'
    },
    {
      title: 'Half measures',
      q: 'M₁ for an edge falls 300 mm beyond the edge of the sheet. How do you work without it?',
      steps: [
        'Take the point halfway between M₁ and VP₁, which is on the sheet.',
        'Lay off half the true length on the ground line.',
        'The line from the halfway point to the half length cuts the receding edge at the same place as the line from M₁ to the whole length, because the fraction $f = t/(t + r)$ of the way to the vanishing point depends only on the ratio of the length $t$ to the distance $r$ from M₁ to VP₁, and both have been halved.'
      ],
      a: 'Use the midpoint of M₁ and VP₁ with half-lengths; the result is the same point.'
    }
  ],
  quiz: [
    { q: 'What is swung about the vanishing point to find a measuring point?', choices: ['The horizon', 'The distance from the vanishing point to the station point', 'The ground line', 'The vertical through the corner'], a: 1, why: 'The radius is v₁SP (the distance from the vanishing point to the station point), swung onto the line through the vanishing point; the isosceles triangle makes the lines from the measuring point carry true lengths.' },
    { q: 'True lengths for an edge are laid off on the receding edge itself.', a: false, why: 'They are laid on the ground line, where the scale is 1, and carried to the edge by lines from the measuring point.' },
    { q: 'D = 100 mm, an edge at 30° to the picture plane. How far from the centre of vision is its measuring point?', answer: 26.8, unit: 'mm', why: 'D tan(θ/2) = 100 tan 15° = 26.8 mm.' },
    { q: 'For a corner view with both walls at 45°, the two measuring points are', choices: ['at the vanishing points', 'at the centre of vision', 'symmetric, D tan 22.5° from the centre', 'on the ground line'], a: 2, why: 'Both measuring points are at D tan 22.5° = 0.414 D from the centre, one on each side.' },
    { q: 'A measuring point falls off the sheet. Using the point halfway to its vanishing point, the true lengths must be', choices: ['doubled', 'kept the same', 'halved', 'multiplied by 0.414'], a: 2, why: 'The fraction of the way to the vanishing point is t/(t + r), with r the distance from the measuring point to the vanishing point. Taking the halfway point halves r, so t must be halved too.' }
  ],
  applications: [
    'Architectural drawing: placing windows, columns and steps at their true spacing along a receding wall without drawing a plan of each.',
    'Interior perspectives and furniture layouts, where a room is measured in feet and inches along its floor.',
    'Illustration and concept art: setting a row of equal buildings, posts or lamps in two-point perspective.',
    'The foundation of the [[measuring-points|measuring-point]] grids and of the dividing-depth tricks used by painters.'
  ],
  history: 'The method belongs to the sixteenth-century "distance point" tradition and was refined in the architects\' manuals of the seventeenth and eighteenth centuries. It became standard in English-language teaching with the drawing books of the nineteenth century; Brook Taylor\'s *Linear Perspective* (1715) gave the mathematical principle (the vanishing point of any line, and its use as a scale) from which it follows directly.',
  sources: [
    'Brook Taylor, *Linear Perspective* (London, 1715).',
    'Rex Vicat Cole, *Perspective for Art Students* (1921), the chapters on measuring points.',
    'Ernest R. Norling, *Perspective Made Easy* (1939).',
    'Francis D. K. Ching, *Architectural Graphics*.'
  ],
  construction: 'pc-direct-measuring'
},

{
  id: 'perspective-shadows',
  parent: 'perspective-constructions',
  title: 'Shadows in perspective',
  level: 2,
  short: 'Parallel sunlight has a vanishing point of its own: below the horizon when the sun is behind you, above it when the sun is in front. Shadows on level ground vanish at its foot on the horizon. A lamp, being near, needs no vanishing point: the shadows radiate from its foot.',
  keywords: ['shadow', 'cast shadow', 'light vanishing point', 'shadow vanishing point', 'sun', 'anti-solar point', 'lamp', 'contre-jour', 'point source', 'perspective'],
  prereq: ['vanishing-points', 'horizon-and-eye-level', 'one-point-perspective'],
  related: ['shadows-by-projection', 'perspective-reflections', 'plan-and-elevation-method', 'foreshortening'],
  body: `A shadow is a projection like any other: the light is the centre, the surface that catches the shadow is the picture plane, and the object is what is projected. Sunlight is for practical purposes **parallel** (the sun is 150 million kilometres away), and parallel lines, as always in perspective, have a **vanishing point**. That is the whole secret of shadows in a picture.

### The sun behind you
The rays travel away from you and down, so they converge on a point $L$ **below the horizon**. Straight above it, on the horizon, lies $V_s$, the **shadow vanishing point**: the shadow of a vertical line lies in a vertical plane that contains a ray, and that plane cuts the ground in a line running to $V_s$. To find the shadow of a post: draw from its foot to $V_s$ (the shadow lies somewhere on this line), then from its top to $L$ (the ray that grazes the top); they cross at the end of the shadow. The lower $L$ lies, the higher the sun and the shorter the shadow.

### The sun in front
Now the sun itself is the vanishing point of its rays: it is in the picture, above the horizon, and $V_s$ is the point of the horizon straight below it. The shadows run towards you: extend the line $V_s$–foot beyond the foot and the line sun–top beyond the top, and they meet in the end of the shadow. At sunset the sun is on the horizon, $L = V_s$, and the shadows are infinitely long.

### A lamp
A lamp is near, so its rays are not parallel and vanish nowhere: draw them as ordinary lines. The shadow of a vertical post lies on the line from the **foot $F$ of the lamp** (the point on the ground directly below it) through the post's foot, because lamp, post and $F$ lie in one vertical plane. The end of the shadow is where the line from the lamp through the post's top meets it. Lamp shadows **fan out** from $F$; sun shadows are parallel in space and converge in the picture.

### The numbers
Let the light travel at the elevation $\\alpha$ below the horizontal and at the azimuth $\\varphi$ from the direction of view, with the picture at the distance $D$ from the eye. Then $V_s$ is at $D\\tan\\varphi$ sideways of the centre, and $L$ lies $D\\tan\\alpha/\\cos\\varphi$ below the horizon (above it, for a sun in front). The shadow of a vertical post of height $h$ on level ground is $h/\\tan\\alpha$ long, and a lamp at height $H$ over a point at distance $a$ from the post casts the shadow of a post of height $h$ beyond its foot the length $a h/(H - h)$.

> [!tip] A shadow that meets a wall climbs it: carry the shadow line on the ground to the foot of the wall, then up the wall in the direction in which the same ray would climb it. On a wall parallel to the picture, vertical edges cast vertical shadows.`,
  ideas: [
    'Sunlight is parallel, so its rays have a vanishing point L; shadows on level ground vanish at the point $V_s$ of the horizon straight above or below it.',
    'Sun behind you: L is below the horizon. Sun in front: L is the sun, above the horizon, and the shadows come towards you.',
    'The end of a shadow is where the line from the foot to $V_s$ meets the line from the top to L.',
    'A lamp has no vanishing point: shadows radiate from its foot F on the ground and end where the ray from the lamp past the top meets them.'
  ],
  pitfalls: [
    'Shadows of parallel posts are parallel in the picture — They are parallel in space and so converge on $V_s$ in the picture, except when the light is exactly parallel to the picture plane.',
    'The light vanishing point of a sun in front of you is below the horizon — The rays come towards you; the vanishing point you can see is the sun itself, above the horizon. L lies below the horizon only for a sun behind you.',
    'A lamp and the sun can be treated alike — The sun\'s rays are parallel (one vanishing point, parallel shadows in space); a lamp\'s are not, and its shadows diverge from the lamp\'s foot.'
  ],
  formulas: [
    {
      name: 'Length of a shadow on level ground (sun)',
      expr: 's = h/tan(alpha)',
      tex: 's = \\frac{h}{\\tan\\alpha}',
      vars: {
        s: { name: 'length of the shadow', q: 'length', unit: 'm' },
        h: { name: 'height of the post', q: 'length', unit: 'm', value: 3 },
        alpha: { name: 'elevation of the sun', q: 'angle', unit: '°', value: 30, min: 1, max: 89, tex: '\\alpha' }
      },
      note: 'At 45° the shadow is as long as the post; at 10° it is 5.7 times as long.'
    },
    {
      name: 'Depression of the light vanishing point below the horizon',
      expr: 'yL = D*tan(alpha)/cos(phi)',
      tex: 'y_L = \\frac{D\\tan\\alpha}{\\cos\\varphi}',
      vars: {
        yL: { name: 'distance of L below the horizon in the picture', q: 'length', unit: 'mm', tex: 'y_L' },
        D: { name: 'distance of the eye from the picture plane', q: 'length', unit: 'mm', value: 100 },
        alpha: { name: 'elevation of the sun', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\alpha' },
        phi: { name: 'azimuth of the light from the direction of view', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\varphi' }
      },
      note: 'The shadow vanishing point is on the horizon at D tan φ to the side of the centre. With φ = 0 (sun directly behind you) $V_s$ is the centre of vision.'
    },
    {
      name: 'Length of the shadow of a post from a lamp',
      expr: 's = a*h/(H - h)',
      tex: 's = \\frac{a\\,h}{H - h}',
      vars: {
        s: { name: 'length of the shadow beyond the post', q: 'length', unit: 'm' },
        a: { name: 'distance from the foot of the lamp to the post', q: 'length', unit: 'm', value: 4 },
        h: { name: 'height of the post', q: 'length', unit: 'm', value: 1.8 },
        H: { name: 'height of the lamp', q: 'length', unit: 'm', value: 3 }
      },
      note: 'By similar triangles: the shadow is the post\'s foot-to-lamp distance scaled by h/(H − h). The lower the lamp, the longer the shadow.'
    }
  ],
  examples: [
    {
      title: 'Two shadows on a summer afternoon',
      q: 'The sun is 35° above the horizon. How long is the shadow of a 2 m post on level ground? A lamp 3 m high stands 4 m from a 1.8 m post; how far beyond the post does its shadow end?',
      steps: [
        { text: 'The sun:', tex: 's = \\frac{2}{\\tan 35°} = 2.86\\ \\text{m}' },
        { text: 'The lamp, by similar triangles (post and lamp in the same vertical plane through F):', tex: 's = \\frac{4 \\times 1.8}{3 - 1.8} = 6.0\\ \\text{m}' },
        'The lamp shadow is more than twice as long as the sun shadow of a higher post: a low light source is a strong stretcher of shadows.'
      ],
      a: '2.86 m for the sun; 6.0 m beyond the post for the lamp.'
    },
    {
      title: 'Where do the vanishing points of the light go?',
      q: 'The picture plane is 100 mm from the eye. The sun is behind you, 40° above the horizon, and its light travels 30° to the right of your direction of view. Where are $V_s$ and L in the picture?',
      steps: [
        { text: '$V_s$ on the horizon, sideways:', tex: 'x = D\\tan\\varphi = 100\\tan 30° = 57.7\\ \\text{mm to the right}' },
        { text: '$L$ below it:', tex: 'y_L = \\frac{100\\tan 40°}{\\cos 30°} = \\frac{83.9}{0.866} = 96.9\\ \\text{mm}' }
      ],
      a: '$V_s$ lies 57.7 mm right of the centre of vision on the horizon; L is 96.9 mm below it.'
    }
  ],
  quiz: [
    { q: 'The sun is behind you. Where is the light vanishing point?', choices: ['Above the horizon', 'Below the horizon', 'At the centre of vision', 'On the horizon'], a: 1, why: 'The rays travel away from you and downwards, so the point they converge on is below the horizon. $V_s$ is on the horizon straight above it.' },
    { q: 'The shadows of a row of equal fence posts, in sunlight, are parallel in space. In a perspective picture they converge on a point of the horizon.', a: true, why: 'Parallel lines have a vanishing point; for shadows on level ground it is $V_s$, the point of the horizon straight above or below the light vanishing point.' },
    { q: 'How long is the shadow of a 3 m post when the sun is 30° above the horizon?', answer: 5.2, unit: 'm', why: 's = h/tan α = 3/tan 30° = 5.20 m.' },
    { q: 'A lamp 4 m high stands 3 m from a 1.5 m post (foot to foot). How far beyond the post does the shadow end?', answer: 1.8, unit: 'm', why: 's = a h/(H − h) = 3 × 1.5/2.5 = 1.8 m.' },
    { q: 'Shadows of the same posts from a lamp, compared with sunlight, are', choices: ['parallel in space', 'radiating from the foot of the lamp', 'converging on the horizon', 'always shorter'], a: 1, why: 'A lamp is a point at a finite distance. The shadow of a vertical edge lies on the line from the lamp\'s foot through the edge\'s foot, so the shadows fan out from that foot.' }
  ],
  applications: [
    'Architectural rendering and sun studies: the shadows of a building on its site, at a chosen date and hour, drawn from a plan and an elevation.',
    'Illustration, comics and film storyboards: one consistent light direction fixes all shadows with a single pair of points.',
    'Forensic and photographic analysis: inconsistent shadow directions betray a composite photograph, since all shadows of one sun converge on one point.',
    'Computer graphics: shadow volumes and shadow maps are the same construction done by projection from the light.'
  ],
  history: 'Leonardo da Vinci wrote at length on shadows (primary, derived, cast) in his notebooks around 1500, but the geometry of cast shadows in a picture entered the perspective manuals only later, in the 17th and 18th centuries. It rests on Brook Taylor\'s principle (*Linear Perspective*, 1715) that any set of parallel lines, a beam of sunlight included, has its own vanishing point.',
  sources: [
    'Rex Vicat Cole, *Perspective for Art Students* (1921), the chapter on shadows.',
    'Robert W. Gill, *Creative Perspective* (1975).',
    'Brook Taylor, *Linear Perspective* (1715).',
    'Francis D. K. Ching, *Architectural Graphics*, the chapter on shade and shadow.'
  ],
  construction: ['pc-shadow-sun-behind', 'pc-shadow-sun-front', 'pc-shadow-lamp'],
  sim: 'pc-shadow-lab'
},

{
  id: 'perspective-reflections',
  parent: 'perspective-constructions',
  title: 'Reflections in perspective',
  level: 2,
  short: 'A horizontal mirror such as still water puts each point as far below the surface as it is above, on the same vertical; a vertical mirror puts it as far behind. Verticals stay vertical, vanishing points do not change, and only the depth has to be measured.',
  keywords: ['reflection', 'still water', 'mirror', 'virtual image', 'horizontal mirror', 'vertical mirror', 'perspective', 'water line', 'same vanishing points'],
  prereq: ['vanishing-points', 'horizon-and-eye-level', 'two-point-perspective'],
  related: ['perspective-shadows', 'alberti-construction', 'forced-perspective', 'physics:plane-mirrors', 'physics:reflection'],
  body: `A mirror does not change geometry; it adds an **image** of the object, which the eye sees as if it were behind the mirror at the same distance. In a perspective drawing the image is constructed first as a real object, mirrored in space, and then drawn like any other object.

### Still water: a horizontal mirror
The image of a point is the same distance **below** the surface as the point is above it, on the same vertical line. In the picture this gives three rules:
1. **Verticals stay vertical.** The reflection of a vertical edge is a continuation of the edge below the water.
2. **Equal lengths.** A vertical edge standing on the water and its reflection are equal in the picture, so one edge is reflected with the dividers and the rest follows.
3. **Same vanishing points.** A horizontal mirror turns up into down and nothing else, so every horizontal direction keeps its vanishing point on the horizon. Join the reflected tops with lines to the same vanishing points as the real ones.

If the object stands back from the water, measure from the **water level under its base**, not from its base: a house on a bank 2 m above the water has its reflection start 2 m below its foot and be 2 m longer than the house itself. Clouds and far mountains are reflected at the same angle below the horizon as they stand above it, so a reflected sky repeats the sky upside down.

### What the reflection shows
It is seen from below. The top of a block, which you see from above, is hidden in the water, and the reflected walls show from underneath, as the surfaces you would see if you stood at the eye\'s own reflection under the water. Ripples smear the reflection along the vertical. At a grazing angle the water reflects most of the light ([[physics:reflection]]), and from straight above it hardly any, so a pond may look like a mirror near the far bank and glass at your feet.

### A vertical mirror
The image lies as far **behind** the mirror as the object is in front of it, on the perpendicular. For a mirror on a side wall in one-point perspective the perpendicular is a line parallel to the picture plane, horizontal in the picture: measure the distance to the wall along that horizontal and set it off again beyond the wall. For a mirror on the end wall facing you, the perpendicular runs to the centric point, and the equal depth is found by the diagonal trick of the [[alberti-construction|tiled floor]]. The reflection is visible only through the frame of the mirror: draw the line from the eye to the image and see that it passes through the glass.

The eye sees the image at the distance $d_1 + d_2$ (eye to mirror plus mirror to object), which is why a mirror makes a room look twice as deep.`,
  ideas: [
    'The image of a point in a horizontal mirror is the same distance below the surface, on the same vertical.',
    'A horizontal mirror turns up into down only: every horizontal direction keeps its vanishing point, so the reflected edges run to the same points as the real ones.',
    'Measure heights from the water level below the object, not from the object\'s base, if it stands back from the water.',
    'In a vertical mirror the image is as far behind it as the object is in front, and the eye sees it at the distance eye–mirror + mirror–object.'
  ],
  pitfalls: [
    'A reflection is a copy of the object turned upside down — It is a mirror image of the object seen from below: the top of a block is hidden and its walls are seen from underneath, so the reflected shape is not the object upside down.',
    'The reflection of a tall building is shorter because it is farther off — It is exactly as tall as the building in the picture; it only looks different because its top is cut off by the water line of the far bank.',
    'The reflection starts at the foot of the object — It starts at the water level directly below the foot; for an object on a bank this is below the foot, and the reflection is longer.'
  ],
  formulas: [
    {
      name: 'Picture length of a post and its reflection',
      expr: 'L = 2*h*D/(z + D)',
      tex: 'L = \\frac{2\\,h\\,D}{z + D}',
      vars: {
        L: { name: 'length in the picture from the top of the post to the bottom of its reflection', q: 'length', unit: 'm' },
        h: { name: 'height of the post above the water', q: 'length', unit: 'm', value: 3 },
        D: { name: 'distance of the eye from the picture plane', q: 'length', unit: 'm', value: 20 },
        z: { name: 'depth of the post behind the picture plane', q: 'length', unit: 'm', value: 30 }
      },
      note: 'The post and its reflection together are twice as long as the post in the picture, which is h D/(z + D). All lengths are measured in the picture plane at the scale of the picture.'
    },
    {
      name: 'Distance to the image in a flat mirror',
      expr: 'dv = d1 + d2',
      tex: 'd_v = d_1 + d_2',
      vars: {
        dv: { name: 'distance from the eye to the image', q: 'length', unit: 'm', tex: 'd_v' },
        d1: { name: 'distance from the eye to the mirror', q: 'length', unit: 'm', value: 1.5, tex: 'd_1' },
        d2: { name: 'distance from the mirror to the object', q: 'length', unit: 'm', value: 2.5, tex: 'd_2' }
      },
      note: 'Used when the mirror is perpendicular to the line of sight; for an oblique mirror, mirror the object first and measure to the image.'
    }
  ],
  examples: [
    {
      title: 'A post and its reflection',
      q: 'A mooring post stands 3 m above the water. The eye is 1.5 m above the water, 20 m from the picture plane, and the post is 30 m behind the picture plane. How long are the post and its reflection in the picture?',
      steps: [
        'The scale at the post is $D/(z + D) = 20/50 = 0.4$.',
        'Measured from the horizon: the top is at $(3 - 1.5) \\times 0.4 = +0.6$ m, the foot at $(0 - 1.5) \\times 0.4 = -0.6$ m, the reflected top at $(-3 - 1.5) \\times 0.4 = -1.8$ m.',
        'The post is $1.2$ m long in the picture; the reflection runs from $-0.6$ to $-1.8$ m, also $1.2$ m; together $2.4$ m $= 2 \\times 3 \\times 0.4$.'
      ],
      a: 'The post is 1.2 m long in the picture, its reflection 1.2 m, together 2.4 m, hanging from the same vertical.'
    },
    {
      title: 'How far away is the image?',
      q: 'You stand 1.5 m from a wall mirror. A lamp stands 2.5 m in front of the mirror, beside you. How far does the lamp\'s image seem to be?',
      steps: [
        'The image is 2.5 m behind the mirror.',
        { text: 'The eye sees it at', tex: '$d_v$ = 1.5 + 2.5 = 4.0\\ \\text{m}' }
      ],
      a: 'The image appears 4.0 m from your eye.'
    }
  ],
  quiz: [
    { q: 'A pole stands in a lake. In the picture its reflection is', choices: ['shorter, because it is farther', 'longer, because it is below the horizon', 'the same length as the pole', 'a different width'], a: 2, why: 'The image is as far below the water as the pole is above it and at the same depth, so in the picture the reflected vertical is exactly as long as the pole.' },
    { q: 'The horizontal edges of a reflected block in still water run to the same vanishing points as the block itself.', a: true, why: 'A horizontal mirror only turns up into down; all horizontal directions keep their directions and so their vanishing points on the horizon.' },
    { q: 'A wall mirror is 2 m from you; an object stands 3 m in front of the mirror. How far from the eye is the image?', answer: 5, unit: 'm', why: '$d_v$ = d₁ + d₂ = 2 + 3 = 5 m.' },
    { q: 'A house stands 2 m above a pond on a bank. Its reflection', choices: ['starts at the house\'s foot', 'starts 2 m below the foot, at the water level, and is 2 m longer', 'is the same as for a house at the water\'s edge', 'is hidden'], a: 1, why: 'Measure from the water surface: the reflection of the roof is as far below the water as the roof is above it, which is the house\'s height plus the 2 m of bank.' },
    { q: 'The mirror is on the end wall of a room and faces you. The image of a chair on the floor lies', choices: ['on the horizontal through the chair', 'on the line from the chair to the centric point, farther away', 'on the vertical through the chair', 'on the wall itself'], a: 1, why: 'The perpendicular to the mirror is the direction of view, which vanishes at the centric point; the image is on that line, as far behind the mirror as the chair is in front of it.' }
  ],
  applications: [
    'Landscape painting and architectural rendering: waterfronts, canals, polished floors and glass façades all need the water-line rule.',
    'Interior design and stage sets: mirror walls that double a room, and their reflections of lights and furniture.',
    'Photography: the reflected image of a lake is the mirror photograph of the shore, seen from below; polarising filters change its brightness.',
    'Optical instruments: periscopes and mirror telescopes are chains of virtual images, each found as here.'
  ],
  history: 'Reflections were painted by observation long before they were constructed. The law of reflection, the equality of the angles of incidence and reflection, is in the *Catoptrica* attributed to Euclid (3rd century BC) and in Hero of Alexandria\'s work on mirrors. The rules for reflections in water and mirrors appear in the perspective manuals of the 17th and 18th centuries and follow directly from Brook Taylor\'s treatment of vanishing points in *Linear Perspective* (1715).',
  sources: [
    'Rex Vicat Cole, *Perspective for Art Students* (1921), the chapter on reflections.',
    'Robert W. Gill, *Creative Perspective* (1975).',
    'Francis D. K. Ching, *Architectural Graphics*.',
    'The *Catoptrica* attributed to Euclid; Hero of Alexandria on mirrors.'
  ],
  construction: ['pc-reflection-water', 'pc-reflection-mirror']
},

{
  id: 'anamorphosis',
  parent: 'perspective-constructions',
  title: 'Anamorphosis: the stretched picture',
  level: 3,
  short: 'A picture projected from an eye onto an oblique surface: stretched beyond recognition from anywhere else, but exact from the one viewpoint. Holbein\'s skull, Pozzo\'s ceilings and the pavement art of today are the same construction.',
  keywords: ['anamorphosis', 'anamorphic', 'oblique viewpoint', 'Holbein', 'Ambassadors', 'skull', 'Niceron', 'pavement art', 'projective map', 'homography', 'trompe-l\'oeil'],
  prereq: ['central-projection', 'plan-and-elevation-method', 'foreshortening'],
  related: ['mirror-anamorphosis', 'street-art-anamorphosis', 'stage-sets-and-trompe-loeil', 'projective-geometry', 'forced-perspective'],
  body: `An **anamorphosis** (Greek: *forming again*) is a picture deliberately stretched so that it looks right only from one chosen point of view, and nearly unrecognisable from anywhere else. A skull smeared across the foreground of a Holbein painting, a pavement that seems to open into a pit, a ceiling that seems to have columns: all are the same construction, and it is one you already know.

### The idea in a sentence
Start with an ordinary picture on an imaginary window, like Alberti\'s. **Project every point of it from the eye onto the real surface**, wall, floor or ceiling, and paint the picture where the rays land. The eye then receives from the surface exactly the same rays as it would from the window, so it sees the original picture; any other eye receives different rays and sees a smear.

### Plan and elevation
Take the ground and an eye at height $h$ looking down at the angle $\\alpha$ at the middle of the picture, with the image plane perpendicular to the line of sight. In the elevation, rays from the eye through equally spaced marks of the image plane land on the ground at unequal distances: the **rows** of the grid, lines of constant distance. In the plan, rays from the eye through the sideways marks give the **columns**, which are straight lines through one point $V$ behind you (the construction below finds it). The map from the picture to the ground is a [[projective-geometry|projective map]]: straight lines stay straight, squares become quadrilaterals, parallels may meet.

### The numbers
A point seen at the angle $\\beta$ below the horizontal lies at $z = h/\\tan\\beta$. At the middle of the picture a cell is stretched, compared with its width, by the factor
$$k = \\frac{1}{\\sin\\alpha},$$
2 for an eye at 30°, 3.4 at 17°, 5.8 at 10°; and further rows are stretched much more. That is why anamorphoses are viewed from low: a flat angle needs a long picture. The nearer the eye is to the ground, the more the far end of the picture stretches, and at $\\alpha\\to 0$ no finite picture will do.

### Making one, and seeing one
Draw the picture on a square grid, build the stretched grid as in the construction, and copy square by square. A modern artist uses a projector or a computer to do the same. The eye must be **one** eye: with two, the flatness of the surface is revealed by binocular vision from a metre or two away, which is why photographs flatter the illusion. Walk away from the viewpoint, or sideways, and the picture slides back into a smear (try it in the simulation).

> [!note] The mirror versions, where a cylinder or cone unscrambles the picture, are the subject of [[mirror-anamorphosis]]; the modern pavement artist\'s craft is taken up in [[street-art-anamorphosis]].`,
  ideas: [
    'An anamorphosis is the projection of an ordinary picture from one eye onto an oblique surface; from that eye it looks exactly like the picture.',
    'In the elevation, equal marks on the image plane land at growing distances on the ground; in the plan, the columns are lines through a point behind the viewer.',
    'At the middle of the picture a cell is stretched in depth by 1/sin α compared with its width, and the further rows by more.',
    'Move the eye away from the viewpoint and the picture shears and stretches again: the illusion exists only at one point.'
  ],
  pitfalls: [
    'An anamorphosis is a random distortion — It is exactly computed: every point of the ground lies on the ray from the eye through the point of the picture it stands for.',
    'It works from anywhere along the line of sight — Along the line of sight the size changes, but so does the amount of perspective: nearer, the near part looks too wide, and farther, the far part does. A modest error of distance is tolerated; an error of direction is not. The viewpoint is a point.',
    'The distortion is greatest in the lateral direction — The depth direction is stretched most (by 1/sin α at the centre and far more at the far end); the sideways stretch is only the scale of the rays.'
  ],
  formulas: [
    {
      name: 'Stretch of a cell in depth, relative to its width',
      expr: 'k = 1/sin(alpha)',
      tex: 'k = \\frac{1}{\\sin\\alpha}',
      vars: {
        k: { name: 'depth stretch of the cell at the middle of the picture' },
        alpha: { name: 'angle of the line of sight below the horizontal', q: 'angle', unit: '°', value: 20, min: 1, max: 90, tex: '\\alpha' }
      },
      note: 'Exact at the middle of the picture; the stretch grows towards the far edge.'
    },
    {
      name: 'Where the eye\'s gaze meets the ground',
      expr: 'z = h/tan(beta)',
      tex: 'z = \\frac{h}{\\tan\\beta}',
      vars: {
        z: { name: 'horizontal distance from the eye\'s foot to the point on the ground', q: 'length', unit: 'm' },
        h: { name: 'height of the eye above the ground', q: 'length', unit: 'm', value: 1.6 },
        beta: { name: 'angle of the line of sight below the horizontal', q: 'angle', unit: '°', value: 15, min: 1, max: 89, tex: '\\beta' }
      },
      note: 'At 15° the ground point is 6.0 m away for an eye at 1.6 m, at 10° 9.1 m, at 5° 18.3 m: ten degrees of gaze, from 15° to 5°, cover twelve metres of floor.'
    }
  ],
  examples: [
    {
      title: 'How long must the picture be?',
      q: 'A floor picture is to look square to an eye 1.2 m above the floor and 3 m (horizontally) from the middle of the picture. A cell at the middle of the picture is 1 m wide. How long must that cell be, along the line of sight?',
      steps: [
        { text: 'The line of sight goes down at', tex: '\\alpha = \\arctan\\frac{1.2}{3} = 21.8°' },
        { text: 'A cell is stretched in depth by', tex: 'k = \\frac{1}{\\sin 21.8°} = 2.69' },
        'A cell that is 1 m wide at the middle of the picture must therefore be about $2.7$ m long there. Cells nearer the eye are shorter and cells farther away are longer, so the whole picture is longer still.'
      ],
      a: 'About 2.7 m long, for a cell 1 m wide at the middle of the picture.'
    },
    {
      title: 'Five degrees of gaze',
      q: 'Eye height 1.6 m. How much floor lies between the points seen at 15° and at 10° below the horizontal?',
      steps: [
        { text: 'At 15°: $z = 1.6/\\tan 15° = 5.97$ m. At 10°:', tex: 'z = \\frac{1.6}{\\tan 10°} = 9.07\\ \\text{m}' },
        'The strip between them is $9.07 - 5.97 = 3.1$ m deep, although the eye sees it as a band only 5° high.'
      ],
      a: '3.1 m of floor: low angles pack a great deal of floor into a few degrees, and that is why the far end of an anamorphosis is so stretched.'
    }
  ],
  quiz: [
    { q: 'Where must the eye be to see an anamorphosis correctly?', choices: ['Anywhere in front of the picture', 'At the point from which the picture was projected onto the surface', 'Directly above it', 'Any distance along the floor, at the right height'], a: 1, why: 'The picture was made by projecting from that point; only an eye there receives the rays of the original picture.' },
    { q: 'If the eye moves along its line of sight towards the picture, the anamorphosis merely grows, keeping its proportions.', a: false, why: 'Only the rays from the projection point reproduce the original picture. From a nearer eye the perspective is stronger, so the near part looks too wide compared with the far part; the shape is no longer exact (though it stays recognisable for a small change).' },
    { q: 'By what factor is the depth of a cell at the middle of the picture stretched for an eye looking down at 20°?', answer: 2.92, why: 'k = 1/sin 20° = 2.92.' },
    { q: 'Why is a pavement anamorphosis viewed from a low angle so very long?', choices: ['The artist wants it to be large', 'Rays at a flat angle meet the ground at great distances: z = h/tan β grows quickly as β falls', 'The pavement is uneven', 'The columns of the grid are parallel'], a: 1, why: 'The same few degrees of gaze cover more floor as the angle falls: at 10° one degree is 1.6 m of floor for an eye at 1.6 m, and at 3° it is 10 m.' },
    { q: 'In the plan of the construction, the columns of the stretched grid are', choices: ['parallel lines', 'straight lines through one point behind the viewer', 'circles about the eye', 'parabolas'], a: 1, why: 'The map from the picture to the ground is projective; parallel lines of the picture that point along the picture (the columns) map to lines meeting at the point where the line through the eye parallel to them meets the ground, behind the viewer.' }
  ],
  applications: [
    'Painting: Holbein\'s skull in *The Ambassadors* (1533) and the anamorphic portraits and sacred images of the 16th and 17th centuries.',
    'Architecture and church ceilings: Andrea Pozzo\'s painted dome and architecture in Sant\'Ignazio in Rome are correct from a marked disc in the floor of the nave.',
    'Street and pavement art, advertising and road markings: the "SLOW" painted on a road is a stretched lettering seen correctly by an approaching driver.',
    'Film and television: graphics projected on a studio floor, or on the pitch for a broadcast, for one camera position.'
  ],
  history: 'Leonardo da Vinci drew an eye and a head in anamorphic projection in the Codex Atlanticus (about 1485), the earliest anamorphoses that survive. Hans Holbein the Younger placed the famous anamorphic skull in *The Ambassadors* (1533): from the right of the picture, at a shallow angle, it resolves. The theory was systematised by Jean-François Niceron in *La perspective curieuse* (1638) and by Emmanuel Maignan; Andrea Pozzo\'s *Perspectiva pictorum et architectorum* (1693–1700) taught the method to ceiling painters. Kurt Wenner brought it to the pavement in the 1980s.',
  sources: [
    'Jurgis Baltrušaitis, *Anamorphic Art* (1976; original French edition 1955).',
    'Fred Leeman, *Hidden Images: Games of Perception, Anamorphic Art, Illusion* (1976).',
    'Jean-François Niceron, *La perspective curieuse* (Paris, 1638).',
    'Martin Kemp, *The Science of Art* (1990).'
  ],
  construction: 'pc-anamorphosis-grid',
  sim: 'pc-anamorphosis'
},

{
  id: 'forced-perspective',
  parent: 'perspective-constructions',
  title: 'Forced perspective',
  level: 2,
  short: 'Size is read from the angle an object subtends, so an object put at the wrong distance with the right scale is read at the wrong size: the hand that holds up the Leaning Tower, the stage set that is twice as deep as the stage, the Ames room.',
  keywords: ['forced perspective', 'Ames room', 'scale', 'illusion', 'Palazzo Spada', 'Teatro Olimpico', 'Disney', 'trick photography', 'angular size', 'collineation'],
  prereq: ['central-projection', 'foreshortening', 'vanishing-points'],
  related: ['anamorphosis', 'stage-sets-and-trompe-loeil', 'reverse-perspective', 'cinema-and-anamorphic-lenses', 'physics:the-eye'],
  body: `An eye does not measure size, it measures the **angle** an object subtends, $h/d$ for a height $h$ at a distance $d$. The brain turns the angle into a size by guessing the distance. Forced perspective feeds it a false distance: it puts things where they will be wrongly judged, at the wrong scale, and lets the brain do the rest.

### The principle
Two objects subtend the same angle if $h_2/d_2 = h_1/d_1$, that is
$$h_2 = h_1\\,\\frac{d_2}{d_1}.$$
A 10 cm model held half a metre from a lens fills as much of the picture as an object 8 m tall 40 m away: that is the tourist photograph in which a hand holds up the Leaning Tower. For a convincing result the camera must be fixed (one viewpoint), the two objects must not touch in the picture in a way that reveals their depths, and nothing in view may give the distance away.

### Architecture and stage
The oldest large-scale uses are architectural. The colonnade that Borromini built in the Palazzo Spada in Rome (1652–53) is about 9 m long but looks four times that, because the columns shrink, the floor rises and the vault lowers towards the far end. The Teatro Olimpico in Vicenza (finished 1585) has streets behind the stage openings that dwindle in height and width. Theme-park streets are built on the same plan, with upper storeys at a fraction (such as five eighths, then a half) of the scale of the lower ones, and films place actors at different distances from the camera.

### The Ames room
In the 1930s and 40s the American ophthalmologist Adelbert Ames Jr. built a room in which two people of the same size appear to be of very different heights. The room *looks* rectangular from a peephole but is not: the back wall slants away to the left. Every corner is moved along its sight line from the peephole, which does not change what the eye sees. If the points of the apparent room are $X$, those of the real one are $X/(1 + n\\cdot X)$ (a central map about the peephole that sends planes to planes), and a point at relative sideways position $u$ (from −1 on the left wall to +1 on the right) is moved by the factor
$$k = \\frac{1}{1 + t\\,u},$$
with the slant $t$ (see the construction). With $t = 1/3$ the left back corner is $1.5$ times as far as it looks and the right $0.75$, so a person in the left corner subtends half the angle of an equal person in the right. Floor and ceiling are tilted planes; the tiles of the floor are drawn to match.

### Why the eye is fooled, and what undoes it
The brain prefers to believe in a rectangular room with people of different sizes to a trapezoidal room with people of equal size. Two eyes, moving your head, or a person walking from one corner to the other all undo the illusion, since they give depth by disparity and motion parallax. A camera has one eye and does not move, which is why it is the instrument of forced perspective.`,
  ideas: [
    'The eye measures the angle h/d; the brain guesses the distance to get a size. Give a false distance and the size is misjudged.',
    'Two objects subtend the same angle if h₂ = h₁ d₂ / d₁: a small near thing can stand in for a big far one.',
    'The Ames room is a real trapezoidal room whose corners lie on the sight lines to the peephole: it looks like an ordinary rectangular room, and equal people look unequal.',
    'The illusion needs one eye and one viewpoint: binocular vision and motion break it.'
  ],
  pitfalls: [
    'Forced perspective makes things look smaller by shrinking them — It changes only the distance at which they are placed (or the scale they are built at); the picture is exactly what ordinary perspective would give of the arranged scene.',
    'In the Ames room the people really are different sizes — They are the same size; the left one is 1.5 times and the right 0.75 times as far from the peephole as the corners of the room they seem to stand in.',
    'The effect works from any seat in the audience — A forced-perspective stage set is a single-viewpoint picture: from the sides the streets look squashed, which is why the Teatro Olimpico\'s best seat is in the middle.'
  ],
  formulas: [
    {
      name: 'Equal apparent size',
      expr: 'h2 = h1*d2/d1',
      tex: 'h_2 = h_1\\,\\frac{d_2}{d_1}',
      vars: {
        h2: { name: 'height of the far object', q: 'length', unit: 'm', tex: 'h_2' },
        h1: { name: 'height of the near object', q: 'length', unit: 'm', value: 0.1, tex: 'h_1' },
        d2: { name: 'distance of the far object', q: 'length', unit: 'm', value: 40, tex: 'd_2' },
        d1: { name: 'distance of the near object', q: 'length', unit: 'm', value: 0.5, tex: 'd_1' }
      },
      note: 'A 10 cm model 0.5 m from the camera equals an 8 m object at 40 m.'
    },
    {
      name: 'How far a corner is moved in an Ames room',
      expr: 'k = 1/(1 + t*u)',
      tex: 'k = \\frac{1}{1 + t\\,u}',
      vars: {
        k: { name: 'ratio of the real distance of the corner to the apparent' },
        t: { name: 'slant of the room', value: 0.33, min: 0, max: 0.9 },
        u: { name: 'sideways position of the corner: −1 on the left wall, +1 on the right', value: -1, signed: true, min: -1, max: 1 }
      },
      note: 'With t = 1/3: k = 1.5 on the left and 0.75 on the right. With t = 0 the room is an ordinary one.'
    }
  ],
  examples: [
    {
      title: 'Holding up a tower',
      q: 'A 5 cm model is held 0.4 m from the lens. What is the height of a real object 20 m away that fills the same part of the picture?',
      steps: [
        { text: 'The two objects subtend the same angle:', tex: 'h_2 = 0.05 \\times \\frac{20}{0.4} = 2.5\\ \\text{m}' },
        'A 5 cm toy therefore stands in for a doorway. For the real Leaning Tower (about 56 m) the model has to be held proportionally close: 56 m at 100 m is the angle 0.56, and a hand\'s width of 0.1 m is reached at 0.18 m.'
      ],
      a: '2.5 m, the height of a person with arms up, or a doorway.'
    },
    {
      title: 'Two people in an Ames room',
      q: 'In a room with the slant t = 1/3 the apparent back wall is 4.2 m from the peephole. Two people of height 1.7 m stand in the left and right back corners. What are their real distances from the peephole, and how do their angular heights compare?',
      steps: [
        { text: 'Left corner: $u = -1$, so', tex: 'k_L = \\frac{1}{1 - 1/3} = 1.5,\\quad d_L = 1.5 \\times 4.2 = 6.3\\ \\text{m}' },
        { text: 'Right corner: $u = +1$, so', tex: 'k_R = \\frac{1}{1 + 1/3} = 0.75,\\quad d_R = 0.75 \\times 4.2 = 3.15\\ \\text{m}' },
        { text: 'The angular heights (small-angle approximation):', tex: '\\frac{1.7}{6.3} = 0.27\\ \\text{rad}\\quad\\text{and}\\quad\\frac{1.7}{3.15} = 0.54\\ \\text{rad}' }
      ],
      a: 'The left person is 6.3 m away and looks 0.27 rad tall, the right one 3.15 m away and looks 0.54 rad tall: half and double, though both are 1.7 m.'
    }
  ],
  quiz: [
    { q: 'What does the eye measure when it judges the size of an object?', choices: ['Its height', 'Its distance', 'The angle it subtends, h/d', 'Its brightness'], a: 2, why: 'The retinal image has a size set by the angle; the brain estimates the distance to recover the size. If the distance is wrong the size is wrong.' },
    { q: 'A 5 cm toy 0.4 m from the camera matches an object 20 m away of height', answer: 2.5, unit: 'm', why: 'h₂ = h₁ d₂/d₁ = 0.05 × 20/0.4 = 2.5 m.' },
    { q: 'In the Ames room the person in the far-left corner looks smaller because', choices: ['they are really smaller', 'they are farther away along the same sight line', 'the floor is tilted', 'the light is dimmer'], a: 1, why: 'Their real distance is 1.5 times that of the apparent corner, so they subtend a smaller angle; the brain, believing the room is rectangular, reads the smaller angle as a smaller person.' },
    { q: 'Forced perspective works equally well for a viewer with two eyes who walks about.', a: false, why: 'Binocular disparity and motion parallax give the true depths at close range. The illusion is a single-viewpoint, single-eye picture, which a camera supplies.' },
    { q: 'Ames room, t = 0.25. The factor k for the right-hand corner (u = +1) is', answer: 0.8, why: 'k = 1/(1 + 0.25) = 0.8: the right corner is nearer than it looks by that factor.' }
  ],
  applications: [
    'Cinema: actors at different distances from the camera play characters of different sizes, as in the *Lord of the Rings* films (2001–03), together with scaled sets and digital doubles.',
    'Theme parks and streets: facades whose upper floors shrink make a building look taller and a street longer.',
    'Architecture and stage design: Borromini\'s colonnade in the Palazzo Spada and the streets of the Teatro Olimpico in Vicenza.',
    'Perception research and museums: the Ames room demonstrates how the brain infers size from assumed shape.'
  ],
  history: 'Vitruvius describes the scene painting (*skenographia*) of the Greek theatre, and Renaissance theatres made it three-dimensional: Palladio began and Vincenzo Scamozzi completed the Teatro Olimpico in Vicenza (opened 1585), whose seven streets were built in forced perspective. Francesco Borromini designed the Palazzo Spada gallery (1652–53) for Cardinal Bernardino Spada, with the help of the mathematician Giovanni Maria da Bitonto. Adelbert Ames Jr. devised the room that bears his name in the 1930s, and the full-size version of 1946 became a standard demonstration of perception. Disney\'s Main Street, U.S.A. (1955) applied the architect\'s scaling to a street.',
  sources: [
    'W. H. Ittelson, *The Ames Demonstrations in Perception* (1952).',
    'Richard L. Gregory, *Eye and Brain* (5th ed., 1997), the chapter on illusions.',
    'Martin Kemp, *The Science of Art* (1990), on theatre perspective.'
  ],
  construction: 'pc-ames-room',
  sim: 'pc-ames-room'
},

{
  id: 'reverse-perspective',
  parent: 'perspective-constructions',
  title: 'Reverse (Byzantine) perspective',
  level: 1,
  short: 'A way of drawing in which parallel lines diverge as they go back and distant things are larger, as in Byzantine and Russian icons. It is a deliberate choice, not a failure: it puts the vanishing point in front of the picture, at the viewer.',
  keywords: ['reverse perspective', 'inverted perspective', 'Byzantine', 'icon', 'Russian icon', 'Florensky', 'Wulff', 'diverging', 'reverspective', 'Hughes'],
  prereq: ['central-projection', 'vanishing-points', 'one-point-perspective'],
  related: ['parallel-perspective-in-art', 'oblique-projection', 'perspective-in-painting', 'forced-perspective'],
  body: `In an ordinary picture the sides of a table converge as they recede and the far edge is shorter than the near one. In a **reverse-perspective** picture the sides *diverge*, the far edge is the longer, and far people and objects may be drawn larger than near ones. The effect is common in Byzantine mosaics and in Russian, Greek and Balkan icons, and in much medieval painting.

### A mistake, or a choice?
For a long time it was read as ignorance. The art historian Oskar Wulff coined the name in 1907, and in 1919–22 the Russian theologian and mathematician Pavel Florensky argued that it is a method with its own logic, not a failure of the Renaissance rule. Painters who could draw convergent lines (and some did, in the same picture) used the opposite for sacred scenes. Several explanations are offered and none settles it: the picture is meant to be seen **from the front of the world, not into it**, with the viewer at the vanishing point; the objects are shown from several sides at once so as to show what they *are* and not how they look from a single place; and the sacred figure is turned towards the viewer. Whatever the reason, it is a design, and a consistent one.

### The geometry
Take the usual central-projection picture of a table and reflect the vanishing point to the other side: the lines now meet at a point **R in front of the picture** (here, below it), where the viewer stands. If the near edge has width $w_1$ and R is the distance $r$ below it, the edge at height $y$ above it has the width
$$w = w_1\\,\\frac{r + y}{r}.$$
Compare an ordinary picture with the vanishing point $V$ at the distance $V$ above the near edge: $w = w_1(1 - y/V)$. The first grows, the second shrinks, and for small $y/r$ the two are almost mirror images of each other. Vertical lines stay vertical. The far legs of the table are longer than the near ones, and the far edge of a floor is wider.

### How to draw it
Choose R below the sheet on the centre line. Draw from R through the end points of the near edge and on past them. Cut them with the far edge, drawn horizontal. Then do the same for the legs: the ends of the far legs lie on the lines from R through the ends of the near legs, and the legs themselves stay vertical. The construction below does exactly this and puts the ordinary perspective beside it for comparison.

> [!fact] **Reverspective**, the three-dimensional pictures of the British artist Patrick Hughes (since the 1960s), are reliefs in which the *nearest* parts are painted the smallest and are in fact the farthest from you. As you walk past, the scene seems to move with you, because the geometry is a real reverse perspective.`,
  ideas: [
    'In reverse perspective parallel lines diverge as they go back, so far things are drawn larger than near ones.',
    'Geometrically it is a central projection with the vanishing point in front of the picture, at the viewer: the width grows as w = w₁ (r + y)/r.',
    'It is a deliberate convention of icons and medieval art, not a failure to master convergence.',
    'Vertical lines stay vertical and the far legs of a table are longer than the near ones.'
  ],
  pitfalls: [
    'Reverse perspective is an error of drawing — It is a systematic convention, and painters often used both reverse and convergent perspective in one picture for different things.',
    'It means "perspective drawn backwards" in the sense of upside-down — Nothing is inverted: parallels diverge instead of converging, but up is still up.',
    'Chinese and Japanese pictures are in reverse perspective — They mostly use parallel (oblique) projection, in which parallels stay parallel: neither converging nor diverging.'
  ],
  formulas: [
    {
      name: 'Width of an edge in reverse perspective',
      expr: 'w = w1*(r + y)/r',
      tex: 'w = w_1\\,\\frac{r + y}{r}',
      vars: {
        w: { name: 'width of the edge at height y', q: 'length', unit: 'mm' },
        w1: { name: 'width of the near edge', q: 'length', unit: 'mm', value: 90, tex: 'w_1' },
        y: { name: 'height of the edge above the near edge', q: 'length', unit: 'mm', value: 85 },
        r: { name: 'distance of the reverse vanishing point R below the near edge', q: 'length', unit: 'mm', value: 170 }
      },
      note: 'The reverse of an ordinary perspective, where w = w₁ (1 − y/V). With the same numbers the ordinary table would narrow to 45 mm.'
    },
    {
      name: 'Width of an edge in ordinary perspective (for comparison)',
      expr: 'w = w1*(1 - y/V)',
      tex: 'w = w_1\\left(1 - \\frac{y}{V}\\right)',
      vars: {
        w: { name: 'width of the edge at height y', q: 'length', unit: 'mm' },
        w1: { name: 'width of the near edge', q: 'length', unit: 'mm', value: 90, tex: 'w_1' },
        y: { name: 'height of the edge above the near edge', q: 'length', unit: 'mm', value: 85 },
        V: { name: 'height of the vanishing point above the near edge', q: 'length', unit: 'mm', value: 170 }
      },
      note: 'Valid for y < V; at y = V the width is zero, the vanishing point.'
    }
  ],
  examples: [
    {
      title: 'A table in both perspectives',
      q: 'The near edge of a table is 90 mm wide. The vanishing point is 170 mm away from it (below the picture for the reverse, above for the ordinary). How wide is the far edge, 85 mm further up?',
      steps: [
        { text: 'Reverse:', tex: 'w = 90\\cdot\\frac{170 + 85}{170} = 135\\ \\text{mm}' },
        { text: 'Ordinary:', tex: 'w = 90\\left(1 - \\frac{85}{170}\\right) = 45\\ \\text{mm}' }
      ],
      a: 'The reverse table widens to 135 mm, the ordinary one narrows to 45 mm; the far edge is three times as wide in one as in the other.'
    }
  ],
  quiz: [
    { q: 'In reverse perspective, the side edges of a table', choices: ['converge to a point behind the picture', 'stay parallel', 'diverge, as if meeting at a point in front of the picture', 'curve'], a: 2, why: 'They spread as they go back, as if they came from a point at the viewer\'s side of the picture.' },
    { q: 'Reverse perspective shows that Byzantine painters could not draw convergent lines.', a: false, why: 'They often drew convergent lines for architecture in the same picture; reverse perspective was used on purpose, as Florensky argued.' },
    { q: 'A table has a near edge 60 mm wide, and R is 100 mm below it. How wide is the edge 50 mm higher?', answer: 90, unit: 'mm', why: 'w = 60 (100 + 50)/100 = 90 mm.' },
    { q: 'Which pictures use parallel projection instead of converging or diverging lines?', choices: ['Byzantine icons', 'Chinese and Japanese scroll paintings', 'Renaissance altarpieces', 'Hughes\'s reliefs'], a: 1, why: 'The East Asian tradition mostly uses an oblique parallel projection in which parallels stay parallel.' }
  ],
  applications: [
    'Icon painting and the study and restoration of Byzantine and Russian pictures, where the geometry decides how a table, a throne or a building is to be completed.',
    'Medieval illumination and mosaic: buildings shown with the roof and both side walls at once.',
    'Modern art: Cubism\'s multiple viewpoints and Cézanne\'s tilted tables are related decisions to show what an object is, not just how one eye sees it.',
    'Patrick Hughes\'s "reverspective" relief pictures, and optical-illusion art that uses a reverse perspective to make a scene move as you walk past.'
  ],
  history: 'The term *umgekehrte Perspektive* was coined by Oskar Wulff in 1907. Pavel Florensky lectured on "Reverse Perspective" in 1919–20 and wrote it up in 1920–22 (published in Russian in the 1960s and in English in 2002), and Boris Uspensky developed the idea in his study of the Russian icon (1970s). The icons of Andrei Rublev (about 1400–1430) are among the best-known examples. Patrick Hughes made the first reverspective pictures in the 1960s and has developed them since.',
  sources: [
    'Pavel Florensky, *Reverse Perspective*, in *Beyond Vision: Essays on the Perception of Art* (ed. N. Misler, 2002).',
    'Boris Uspensky, *The Semiotics of the Russian Icon* (1976).',
    'Erwin Panofsky, *Perspective as Symbolic Form* (1927; English translation 1991).',
    'Rudolf Arnheim, *Art and Visual Perception* (1954), on the representation of space.'
  ],
  construction: 'pc-reverse-perspective'
},

{
  id: 'atmospheric-perspective',
  parent: 'perspective-constructions',
  title: 'Atmospheric perspective',
  level: 1,
  short: 'Distant things look paler, bluer and less contrasty because the air between you and them scatters light. The contrast falls as e^(−σd); painters have used it for centuries as a depth cue, drawn as a scale of tones.',
  keywords: ['atmospheric perspective', 'aerial perspective', 'haze', 'contrast', 'Koschmieder', 'Rayleigh scattering', 'visual range', 'Leonardo', 'tone', 'hatching'],
  prereq: ['central-projection', 'horizon-and-eye-level'],
  related: ['foreshortening', 'perspective-in-painting', 'weather-maps', 'perspective-shadows'],
  body: `Geometry says how big a distant thing is; **atmosphere** says how it *looks*. Air is not perfectly clear: it scatters some of the light going from an object to the eye and adds some of its own (sunlit air in front of the object). The farther the object, the more of its own light is lost and the more of the haze is added, so a distant mountain is **lighter, bluer, and less contrasty**, and its edges are soft. That is atmospheric (or aerial) perspective.

### The law
For a horizontal sight line in uniform air, Koschmieder\'s law (1924) says the contrast between an object and its background falls with the distance $d$ as
$$C = C_0\\,e^{-\\sigma d},$$
where $\\sigma$ is the **extinction coefficient** of the air, in 1/km. The distance at which the contrast falls to the 2 % that the eye can just distinguish is the **visual range** $V = 3.912/\\sigma$: about 20 km for a clear day with $\\sigma = 0.2$ /km, and under 1 km in fog ($\\sigma > 4$ /km). The tone of a dark object tends towards the tone of the haze, here the horizon sky:
$$t(d) = t_{\\text{sky}} + (t_0 - t_{\\text{sky}})\\,e^{-\\sigma d}.$$

### The colour
Small air molecules scatter short wavelengths far more than long ones, in proportion to $\\lambda^{-4}$ (Rayleigh scattering), so blue light is scattered five or six times more than red. That is why the sky is blue, and why the air in front of distant dark hills glows blue: the far ridges are blue-grey while the near ones are green or brown. Smoke, dust and pollen change the hue, but not the rule: far things move towards the colour of the horizon sky.

### How to draw it
Atmospheric perspective is a **tone scale** more than a geometric construction. Choose the darkest tone of the nearest object and the tone of the haze at the horizon, then give each plane of the landscape a tone between them according to its distance. In pencil, tone is **hatching density**: close, dark lines for the nearest ridge, a wider gap and thinner lines for each ridge behind it, nearly plain for the farthest. Draw from the farthest to the nearest, so that each ridge covers the lines of those behind it, and soften the far outlines. In painting the same rule is expressed as warm, saturated, sharp in front, and cool, grey, soft behind.

> [!note] Atmospheric perspective gives *order* in depth, not distance. It fails in a fog bank or under a clear mountain sky, where distant peaks look unnaturally near (the air is too clear for the cue), and it is no use at close range. It works together with the geometry of [[vanishing-points]] and [[foreshortening]], never instead of it.`,
  ideas: [
    'Distant objects lose contrast and move towards the tone and colour of the haze: C = C₀ e^(−σd).',
    'The visual range, where the contrast falls to 2 %, is V = 3.9/σ; it is tens of kilometres in clear air and under one kilometre in fog.',
    'Rayleigh scattering, proportional to λ⁻⁴, makes distant dark things bluer.',
    'In drawing, tone is hatching density: dense and dark in front, wide and light behind, drawn from back to front.'
  ],
  pitfalls: [
    'Atmospheric perspective is a rule of colour only — It is first a loss of contrast; the colour shift is a consequence of the wavelength dependence of scattering.',
    'Far mountains are blue because they are painted with distant blue paint — They are blue because the air in front of them scatters blue light towards the eye; the mountain itself may be dark green or brown.',
    'Distance can be read from the tone alone — A clear mountain atmosphere makes distant peaks look near (high contrast) and fog makes near objects look far; the cue is relative.'
  ],
  formulas: [
    {
      name: 'Contrast through the haze (Koschmieder)',
      expr: 'C = C0*exp(-sigma*d)',
      tex: 'C = C_0\\,e^{-\\sigma d}',
      vars: {
        C: { name: 'contrast at the eye' },
        C0: { name: 'contrast at the object', value: 1, tex: 'C_0' },
        sigma: { name: 'extinction coefficient of the air (per km)', value: 0.25, tex: '\\sigma' },
        d: { name: 'distance (km)', value: 8 }
      },
      note: 'With σ = 0.25 per km and d = 8 km the contrast is 13.5 % of its value at the object.'
    },
    {
      name: 'Visual range',
      expr: 'V = 3.912/sigma',
      tex: 'V = \\frac{3.912}{\\sigma}',
      vars: {
        V: { name: 'visual range (km)' },
        sigma: { name: 'extinction coefficient (per km)', value: 0.25, tex: '\\sigma' }
      },
      note: 'The distance where the contrast falls to 2 %: ln 50 = 3.912.'
    },
    {
      name: 'Tone of a distant dark object',
      expr: 't = ts + (t0 - ts)*exp(-sigma*d)',
      tex: 't = t_s + (t_0 - t_s)\\,e^{-\\sigma d}',
      vars: {
        t: { name: 'tone at the eye (per cent grey)' },
        ts: { name: 'tone of the haze at the horizon (per cent)', value: 12, tex: 't_s' },
        t0: { name: 'tone of the object close by (per cent)', value: 90, tex: 't_0' },
        sigma: { name: 'extinction coefficient (per km)', value: 0.25, tex: '\\sigma' },
        d: { name: 'distance (km)', value: 3 }
      },
      note: 'Used to set the hatching of each ridge in the construction: tone 49 % at 3 km, 23 % at 8 km.'
    }
  ],
  examples: [
    {
      title: 'How much contrast is left?',
      q: 'The air has σ = 0.25 per km. What fraction of its contrast does a ridge keep at 4 km and at 8 km, and what is the visual range?',
      steps: [
        { text: 'At 4 km:', tex: 'e^{-0.25\\times 4} = e^{-1} = 0.368' },
        { text: 'At 8 km:', tex: 'e^{-2} = 0.135' },
        { text: 'The visual range:', tex: 'V = \\frac{3.912}{0.25} = 15.6\\ \\text{km}' }
      ],
      a: '37 % at 4 km, 13.5 % at 8 km; the visual range is 15.6 km.'
    },
    {
      title: 'Tones for five ridges',
      q: 'The haze at the horizon is 12 % grey, the darkest near tone 90 %, σ = 0.25 per km. Give the tone of ridges at 0.5, 1.5, 3, 5 and 8 km.',
      steps: [
        { text: 'The tone is $t = 12 + 78\\,e^{-0.25 d}$:', tex: '81,\\ 66,\\ 49,\\ 34,\\ 23\\ \\%' },
        'The hatching gap is inversely proportional to the tone: the nearest ridge needs lines about 3.5 times as close as the farthest.'
      ],
      a: 'Tones 81, 66, 49, 34 and 23 %, the hatching going from close and dark to wide and light.'
    }
  ],
  quiz: [
    { q: 'What happens to the contrast of a dark mountain as it gets farther away?', choices: ['It stays the same', 'It increases', 'It falls exponentially with distance', 'It falls linearly to zero at the horizon'], a: 2, why: 'Koschmieder: C = C₀ e^(−σd), the exponential law of absorption and scattering along the path.' },
    { q: 'Distant mountains look blue because air scatters short wavelengths more than long ones.', a: true, why: 'Rayleigh scattering goes as λ⁻⁴, so blue is scattered several times more than red; the air in front of dark hills adds blue light.' },
    { q: 'σ = 0.25 per km. What fraction of the contrast is left at 4 km?', answer: 0.368, why: 'e^(−0.25 × 4) = e^(−1) = 0.368.' },
    { q: 'In a pencil drawing of a landscape, the farthest ridge is hatched', choices: ['densest and darkest', 'with the widest gaps and the lightest lines', 'in the same way as the nearest', 'not at all but heavily outlined'], a: 1, why: 'Tone is hatching density: the haze lightens distant things, so the farthest ridge gets the widest gaps and the thinnest lines, the nearest the closest.' },
    { q: 'Clear mountain air has a visual range of about 100 km (σ ≈ 0.04 per km). Compared with lowland haze, distant peaks will look', choices: ['farther than they are', 'nearer than they are', 'the same', 'bluer'], a: 1, why: 'The contrast cue says "far" when the contrast has fallen; in very clear air it falls little, so distant peaks look closer than they are.' }
  ],
  applications: [
    'Landscape painting and illustration, from Leonardo\'s *prospettiva aerea* to Turner and the Chinese landscape painters\' mist between "distances".',
    'Cartography: relief shading and tinting of distant ridges on pictorial and panoramic maps.',
    'Photography and film: haze as a depth cue; lens filters; the dehazing algorithms of image processing that invert the formula above.',
    'Computer graphics and games: fog and "depth cueing" are the same exponential, applied to the colour of every pixel.',
    'Aviation and meteorology: the visual range V = 3.9/σ underlies the reporting of visibility.'
  ],
  history: 'Leonardo da Vinci named and described *prospettiva aerea* in his notebooks around 1500 (collected in the *Trattato della pittura*, published 1651): distant mountains are bluer and paler, their outlines blurred. The Chinese painter and theorist Guo Xi wrote in the 11th century of the "three distances" and the mist that lies between them. Lord Rayleigh explained the blue of the sky by the scattering of light from molecules (1871 and 1899); Harald Koschmieder gave the law of contrast through the atmosphere in 1924.',
  sources: [
    'Leonardo da Vinci, *Treatise on Painting* (*Trattato della pittura*), the sections on aerial perspective.',
    'M. Minnaert, *Light and Colour in the Open Air* (1940).',
    'H. Koschmieder, "Theorie der horizontalen Sichtweite", *Beiträge zur Physik der freien Atmosphäre* 12 (1924).',
    'Rex Vicat Cole, *Perspective for Art Students* (1921), on aerial perspective.'
  ],
  construction: 'pc-atmospheric-tones',
  sim: 'pc-atmospheric-haze'
}
);
