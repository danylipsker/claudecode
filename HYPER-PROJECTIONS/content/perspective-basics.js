/* HYPER-PROJECTIONS · content/perspective-basics.js — the elements of linear perspective.
 *
 *   central-projection · horizon-and-eye-level · vanishing-points · station-point-and-cone-of-vision ·
 *   the-perspective-matrix · foreshortening · field-of-view-and-focal-length · circles-in-perspective
 * Each page: the idea, the formula or matrix, what is kept and lost, and a ruler-and-compass construction
 * (constructions/perspective-basics.js) and a simulation (sims/perspective-basics.js) to match.
 */
Hyper.add(
{
  id: 'central-projection',
  parent: 'perspective-basics',
  title: 'Central projection: the eye and the window',
  level: 1,
  short: 'A perspective is the cut of the cone of rays from the eye by a plane: put a window between you and the world, trace on it where each ray crosses, and you have the picture. By similar triangles the picture of a length is inversely proportional to its distance.',
  keywords: ['central projection', 'perspective', 'eye', 'picture plane', 'window', 'ray', 'visual pyramid', 'similar triangles', 'Alberti', 'cone of rays'],
  prereq: ['what-is-a-projection', 'projectors-and-picture-plane', 'parallel-vs-central'],
  related: ['horizon-and-eye-level', 'vanishing-points', 'the-perspective-matrix', 'alberti-window', 'durer-devices', 'brunelleschi-experiment', 'camera-obscura'],
  body: `Stand at a window and trace on the glass, with a grease pencil, everything you see through it without moving your head. What you have drawn is a **perspective**. Each point of the scene lies on a straight ray that runs to your eye, and the mark on the glass is where that ray crosses it. The eye is the **centre of projection**, the glass is the **picture plane** (PP), and the drawing is the *cut* of the cone of rays by the plane. This is **central projection**, and the whole of linear perspective is its geometry.

### The similar triangles
Put the eye at the origin, looking along $-z$, with the window at distance $d$ in front of it. A point $(x, y, z)$ with $z < 0$ is at depth $-z$, and the ray to it crosses the window where, by similar triangles,
$$x' = \\frac{d\\,x}{-z}, \\qquad y' = \\frac{d\\,y}{-z}.$$
A post of height $h$ at distance $z$ therefore has a picture $h\\,d/z$ high: **the picture of a length is inversely proportional to its distance**. Twice as far, half as big. The distance $d$ only scales the whole picture, so sliding the glass nearer or farther changes its size but never its shape. As a matrix acting on $(x, y, z, 1)$ the same thing is
$$\\begin{bmatrix} x_h \\\\ y_h \\\\ z_h \\\\ w \\end{bmatrix} = \\begin{bmatrix} d & 0 & 0 & 0 \\\\ 0 & d & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix}, \\qquad (x', y') = \\left(\\frac{x_h}{w}, \\frac{y_h}{w}\\right):$$
the bottom row copies the depth into $w$, and the division by $w$ is what makes far things small ([[the-perspective-matrix]]).

### What it keeps and what it loses
Straight lines stay straight, because the rays through a line fill a plane and a plane meets the window in a line (a line pointing at the eye is seen end-on and shrinks to a point). Incidence is kept — a point on a line stays on the picture of the line — and so is the order of points along it. Lost are lengths, angles and parallelism: equal posts at different distances have unequal pictures, a right angle is rarely drawn as one, and parallel lines that run away from the window meet at a [[vanishing-points|vanishing point]]. Only the planes parallel to the window are copied faithfully: they come out as true shapes, reduced everywhere by $d/z$.

### How it is drawn
Alberti described the window in 1435, and Dürer drew machines that make it: a thread from a fixed eye through a frame to each point of a model ([[alberti-window]], [[durer-devices]]). At the drawing board the window is a line in the side view; the rays are straight lines from the eye to the points of the scene; the picture is read where they cross the line. The construction below does it for a lantern and a post; in the simulation you can drag the eye.

> [!key] A point is drawn as a point, a straight line as a straight line, and a length as a length that shrinks like $1/z$.`,
  ideas: [
    'A perspective is the cut of the cone of rays from the eye by the picture plane: each point is drawn where its ray crosses the window.',
    'By similar triangles x′ = d·x/z and y′ = d·y/z: a picture is inversely proportional to the distance, and the window distance d only scales it.',
    'Straight lines, incidence and the order of points are kept; lengths, angles and parallelism are lost except in planes parallel to the window.',
    'In matrix form the last row copies the depth into w; dividing by w is the whole of perspective.'
  ],
  pitfalls: [
    'Moving the window changes the picture — With the eye fixed, moving the window only enlarges or reduces the picture; its shape is fixed by the eye and the scene. A different shape needs a different eye position.',
    'Parallel lines stay parallel in a picture — Only lines parallel to the picture plane do. Lines that run towards or away from it converge on a vanishing point.',
    'Equal objects have equal pictures — Two equal posts at different distances have pictures in the ratio of the distances. The window records angles at the eye, not sizes.'
  ],
  formulas: [
    {
      name: 'Picture of a height',
      expr: 'hp = d*h/z',
      tex: 'h\' = \\frac{d\\,h}{z}',
      vars: {
        hp: { name: 'height of the picture on the window', q: 'length', unit: 'mm', tex: 'h\'' },
        d: { name: 'distance from the eye to the window', q: 'length', unit: 'mm', value: 600 },
        h: { name: 'height of the object', q: 'length', unit: 'm', value: 1.8 },
        z: { name: 'distance from the eye to the object', q: 'length', unit: 'm', value: 12 }
      },
      note: 'Similar triangles with the apex at the eye. Valid for an object facing the window; the picture is proportional to d and inversely to z.'
    },
    {
      name: 'Angle subtended by a height',
      expr: 'alpha = 2*atan(h/(2*z))',
      tex: '\\alpha = 2\\arctan\\frac{h}{2z}',
      vars: {
        alpha: { name: 'angle at the eye', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\alpha' },
        h: { name: 'height of the object', q: 'length', unit: 'm', value: 30 },
        z: { name: 'distance from the eye (perpendicular to the object)', q: 'length', unit: 'm', value: 60 }
      },
      note: 'The window measures this angle: for small angles it is h/z in radians, which is the 1/z law again.'
    }
  ],
  examples: [
    {
      title: 'Two lamp-posts seen through a window',
      q: 'A window is held 600 mm from the eye. A lamp-post 4.5 m tall stands 18 m away and an identical one 45 m away. How tall are their pictures on the window, and in what ratio?',
      steps: [
        { text: 'The picture of a height is $h\' = d\\,h/z$. For the near post:', tex: 'h\'_1 = \\frac{0.6 \\times 4.5}{18} = 0.15\\ \\text{m} = 150\\ \\text{mm}' },
        { text: 'For the far post:', tex: 'h\'_2 = \\frac{0.6 \\times 4.5}{45} = 0.06\\ \\text{m} = 60\\ \\text{mm}' },
        'The ratio of the pictures is the inverse ratio of the distances: $18 : 45 = 2 : 5$, so the near picture is 2.5 times the far one.'
      ],
      a: '150 mm and 60 mm; the farther post is 2.5 times smaller (45 / 18).'
    },
    {
      title: 'How far is the tower?',
      q: 'On a window 500 mm from the eye, a church tower known to be 36 m tall measures 45 mm. How far away is it?',
      steps: [
        { text: 'Solve $h\' = d\\,h/z$ for the distance:', tex: 'z = \\frac{d\\,h}{h\'} = \\frac{0.5 \\times 36}{0.045} = 400\\ \\text{m}' }
      ],
      a: '400 m. A surveyor\'s stadia and a photographer\'s distance estimate use exactly this relation.'
    }
  ],
  quiz: [
    { q: 'A post at twice the distance has a picture on the window that is', choices: ['half as tall', 'a quarter as tall', 'the same height', 'twice as tall'], a: 0, why: 'h′ = d·h/z: the picture is inversely proportional to the distance. A quarter would be the area, not the height.' },
    { q: 'With the eye and the scene fixed, you move the window closer to the eye. The picture', choices: ['changes its shape', 'keeps its shape and shrinks', 'is unchanged', 'turns upside down'], a: 1, why: 'Every coordinate is multiplied by d, so the picture is scaled, not distorted.' },
    { q: 'The picture of a straight line is always a straight line (or a point).', a: true, why: 'The rays through the line lie in a plane through the eye; the plane meets the window in a line. If the line points at the eye the plane degenerates and the picture is a single point.' },
    { q: 'A door 2 m tall is 8 m from the eye. How tall is its picture on a window 500 mm from the eye?', answer: 125, unit: 'mm', why: 'h′ = d h / z = 0.5 × 2 / 8 = 0.125 m = 125 mm.' },
    { q: 'Which property is NOT preserved by central projection onto a plane?', choices: ['Straightness of lines', 'A point lying on a line', 'Parallelism of lines', 'The order of points along a line'], a: 2, why: 'Parallel lines that are not parallel to the window converge on a vanishing point. The other three survive.' }
  ],
  applications: [
    'Photography and film: a lens makes the cone of rays and the sensor is the window; the whole geometry of a camera is central projection.',
    'Computer graphics: every three-dimensional scene is drawn by a matrix of this kind followed by a division by depth, millions of times per frame.',
    'Drawing from life: a sighting frame, a grid or a perspectograph lets the artist trace the scene on the window instead of estimating it.',
    'Radiography and shadow casting: a point source and a screen make the same cone, and the magnification of the shadow is the ratio of the distances.',
    'Photogrammetry and surveying: measuring from photographs works backwards, from the pictured points to the rays.'
  ],
  history: 'Filippo Brunelleschi made the first painted perspective panels around 1413–1425, using a mirror and a peephole. Leon Battista Alberti wrote in *De pictura* (1435) that a picture is the cut of the "visual pyramid" by a plane, "a window", and gave a construction. Piero della Francesca turned it into a geometric science in *De prospectiva pingendi* (written in the 1470s–80s); Albrecht Dürer\'s *Underweysung der Messung* (1525) shows machines with a thread and a frame. Girard Desargues (1639) and Brook Taylor (*Linear Perspective*, 1715) gave the general theory, and Johann Heinrich Lambert (*Die freye Perspektive*, 1759) its practice.',
  sources: ['Leon Battista Alberti, *De pictura* (1435), book I.', 'Albrecht Dürer, *Underweysung der Messung mit dem Zirckel und Richtscheyt* (1525).', 'Martin Kemp, *The Science of Art* (1990), chapters 1–3.', 'Kirsti Andersen, *The Geometry of an Art: The History of the Mathematical Theory of Perspective from Alberti to Monge* (2007).'],
  sim: 'pb-eye-and-window',
  construction: 'pb-window-picture'
},

{
  id: 'horizon-and-eye-level',
  parent: 'perspective-basics',
  title: 'The horizon and eye level',
  level: 1,
  short: 'The horizon line HL is the picture of every horizontal direction, and it stands at the height of the eye wherever you are: a person as tall as you has the eyes on it, a hill climbs you above it, and a crawling child sees it at the feet of the crowd.',
  keywords: ['horizon', 'horizon line', 'HL', 'eye level', 'ground line', 'worm\'s eye', 'bird\'s eye', 'vanishing line', 'artificial horizon'],
  prereq: ['central-projection', 'projectors-and-picture-plane'],
  related: ['vanishing-points', 'one-point-perspective', 'three-point-perspective', 'perspective-grids', 'foreshortening', 'perspective-history'],
  body: `Hold a ruler flat at the height of your eyes and look along it: the line where it seems to reach the distance is the **horizon line** (HL). In a picture, HL is where the horizontal plane through your eye meets the picture plane. Every horizontal plane — the floor, a table, the sea, a ceiling — meets the window in a line parallel to HL; the farther that plane is from the eye the nearer its picture lies to HL, and at infinity both the floor and the ceiling reach it. **HL stands at the height of the eye.** It is not a thing in the scene: the visible edge of the sea only coincides with it when the sea is flat and your eye is low.

### Why eye level
A horizontal line through the eye is parallel to the ground and meets a vertical window at the height of the eye, at $y' = 0$ for a level camera. A horizontal line at the height $y$ above the ground, at depth $z$, has the picture $y' = d\\,(y - e)/z$ for an eye at height $e$; as $z \\to \\infty$ this tends to $0$, so every horizontal line ends on HL. For a camera tilted down by $\\varphi$ the horizon rises on the picture to $d\\tan\\varphi$ above its centre, and in the matrix it is the line through the [[vanishing-points|vanishing points]] of all horizontal directions.

### The rule of equal people
Put people of height $h$ on level ground and an eye at height $e$. HL cuts each of them at the height of the eye, so the fraction of every figure that lies below it is $e/h$, at any distance. If everyone is as tall as you ($e = h$) all heads are on HL, near or far; if they are half your height the horizon passes the same fraction of every child. The lines through all the heads and through all the feet are two lines that converge at the same vanishing point on HL.

### What eye level says
A low horizon makes the world loom: the viewer is small, the figures tower. A high one puts the viewer above the scene and shows more of the ground, as in a map or a bird's-eye view. The edge of the real sea is slightly below HL — by the *dip of the horizon*, about $1.9'\\sqrt{e/\\mathrm{m}}$ of arc, 2.5′ for a standing person — which no drawing can show.

### How it is drawn
Draw HL first, at the eye height above the ground line, with a T-square. Then everything horizontal runs to a point on it, and figures of your own height reach it. The construction below sets a file of men with their heads on HL; the simulation lets you lower and raise the eye and watch the same crowd change.`,
  ideas: [
    'HL is the picture of the horizontal plane through the eye: it stands at eye level, whatever you look at.',
    'Every horizontal line, whatever its height, ends on HL; planes below the eye rise to it and planes above it sink to it.',
    'Equal people on level ground are cut by HL at the same fraction e/h; if they are as tall as you, all heads are on HL.',
    'Where you put HL decides the viewpoint of the picture: low looks up at things, high looks down.'
  ],
  pitfalls: [
    'HL is the edge where the sea meets the sky — That edge lies a little below HL and exists only at sea; HL is eye level and exists everywhere, even indoors.',
    'HL always goes in the middle of the picture — It is wherever the eye is. A level camera puts it at the centre of the frame only if the frame is centred on the eye; shifting or tilting the camera moves it.',
    'Far-off people taller than you rise higher above HL — A person taller than you has his head above HL by the same fraction 1 − e/h of his height at every distance; the heads lie on a straight line that runs to the vanishing point on HL, getting nearer HL as the figures shrink.'
  ],
  formulas: [
    {
      name: 'Fraction of a figure below the horizon',
      expr: 'f = eh/h',
      tex: 'f = \\frac{e}{h}',
      vars: {
        f: { name: 'fraction of the figure below HL' },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.6, tex: 'e' },
        h: { name: 'height of the figure', q: 'length', unit: 'm', value: 1.8 }
      },
      note: 'For figures standing on the same level ground as the eye. f = 1 means the head is on HL; above 1 the figure hangs below it.'
    },
    {
      name: 'Distance to the sea horizon',
      expr: 's = sqrt(2*R*eh)',
      tex: 's \\approx \\sqrt{2\\,R_\\oplus\\,e}',
      vars: {
        s: { name: 'distance to the visible edge of the sea', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        eh: { name: 'eye height above the sea', q: 'length', unit: 'm', value: 1.7, tex: 'e' }
      },
      note: 'Geometry only: no refraction (the bending of light in the air adds about 7 %). From a deck 12 m up it is 12 km.'
    },
    {
      name: 'Horizon on a tilted picture',
      expr: 'yh = d*tan(phi)',
      tex: 'y_h = d\\tan\\varphi',
      vars: {
        yh: { name: 'horizon above the centre of the picture', q: 'length', unit: 'mm', tex: 'y_h' },
        d: { name: 'distance from the eye to the picture (focal length)', q: 'length', unit: 'mm', value: 50 },
        phi: { name: 'tilt of the camera downwards', q: 'angle', unit: '°', value: 15, min: 0, max: 85, tex: '\\varphi' }
      },
      note: 'Tilt down and the horizon rises in the frame; tilt up and it sinks below the centre.'
    }
  ],
  examples: [
    {
      title: 'Where the horizon cuts a figure',
      q: 'Your eye is 1.5 m above level ground and a person 1.8 m tall stands in the distance. What fraction of him is below HL, and how far above HL is his head? If his picture is 36 mm tall, where does HL cross it?',
      steps: [
        { text: 'The fraction is $e/h$:', tex: 'f = \\frac{1.5}{1.8} = 0.83' },
        'His head is $1.8 - 1.5 = 0.3$ m above HL at his own distance (the same 17 % of his height at any distance).',
        'On a 36 mm picture HL crosses him $0.83 \\times 36 = 30$ mm above his feet, 6 mm below his head.'
      ],
      a: '83 % of him is below HL; his head is 0.3 m (17 %) above it; on the 36 mm picture HL is 30 mm above his feet.'
    },
    {
      title: 'How far is the sea horizon?',
      q: 'How far is the visible edge of a flat sea for a person whose eyes are 1.7 m above the water, and for a ship\'s officer 12 m above it?',
      steps: [
        { text: 'Use $s = \\sqrt{2Re}$ with $R = 6371$ km:', tex: 's_1 = \\sqrt{2 \\times 6371 \\times 0.0017} = 4.65\\ \\text{km}, \\qquad s_2 = \\sqrt{2 \\times 6371 \\times 0.012} = 12.4\\ \\text{km}' },
        'The distance grows only as the square root of the height: seven times higher sees only 2.7 times farther.'
      ],
      a: 'About 4.7 km and 12.4 km (geometric, ignoring refraction).'
    }
  ],
  quiz: [
    { q: 'You look along level ground at a row of people exactly as tall as you. Where are their heads in your picture?', choices: ['all on HL', 'above HL, by more the farther they are', 'below HL, by more the farther they are', 'on HL only for the nearest'], a: 0, why: 'A person of your height has his eyes (and head) at your eye level; all lines to such points are horizontal and end on HL.' },
    { q: 'You climb a ladder and draw the same street again. What happens to HL on the page relative to the ground line?', choices: ['It rises: the ground figures are now lower on it', 'It stays at the same height above GL', 'It sinks', 'It tilts'], a: 0, why: 'HL is at eye level, so it stands e above the ground line. A higher eye means a higher HL, and a larger part e/h of every standing figure lies below it.' },
    { q: 'The horizon line of a drawing is the line where the sea meets the sky.', a: false, why: 'HL is eye level and exists on land and indoors. The edge of the sea is slightly below it, by the dip of the horizon.' },
    { q: 'A person 1.80 m tall is seen by an eye 1.20 m above the ground. What percentage of the person is below HL (nearest per cent)?', answer: 67, why: 'e/h = 1.2 / 1.8 = 0.667, that is 67 %.' },
    { q: 'A camera is tilted down. The horizon in its frame', choices: ['rises above the centre', 'sinks below the centre', 'stays at the centre', 'disappears'], a: 0, why: 'The horizon is at d·tan φ above the centre for a downward tilt of φ.' }
  ],
  applications: [
    'Drawing and painting: placing figures in a street or a crowd — the figures of your own height all have their heads on HL, and the rest follow by proportion.',
    'Photography and film: choosing a low angle (a heroic look) or a high one (an overview) is choosing the height of HL; "keeping the horizon level" is keeping it horizontal.',
    'Architectural rendering: the eye height of the observer (about 1.6 m for a person standing) fixes HL and with it what part of a facade is seen from above or below.',
    'Flight instruments: the artificial horizon in an aeroplane is HL — it shows the angle between the aircraft and the horizontal plane through the eye.',
    'Surveying and navigation: the dip of the sea horizon is subtracted from a sextant altitude, and the distance to the horizon gives the range of a lighthouse.'
  ],
  history: 'Alberti\'s construction of 1435 puts the "centric point" at the height of the painter\'s eye, and Piero della Francesca and Leonardo kept the horizon at eye level in their pictures; the Renaissance masters often chose a low horizon, near the viewer\'s eye as he stood before the altarpiece. The geometric dip of the sea horizon, with its square-root law, was worked out when navigators began to correct sextant altitudes in the seventeenth and eighteenth centuries.',
  sources: ['Leon Battista Alberti, *De pictura* (1435), book I.', 'Piero della Francesca, *De prospectiva pingendi*, book I.', 'Rudolf Arnheim, *Art and Visual Perception* (1954), the chapter on space.'],
  sim: 'pb-equal-people',
  construction: 'pb-horizon-eye-level'
},

{
  id: 'vanishing-points',
  parent: 'perspective-basics',
  title: 'Vanishing points',
  level: 2,
  short: 'Parallel lines that run away from the picture plane meet in the picture at a vanishing point: the picture of their common point at infinity, found by drawing from the eye the parallel to them. For lines at angle θ to the picture plane it is D·cot θ from the centre of vision.',
  keywords: ['vanishing point', 'VP', 'parallel lines', 'point at infinity', 'D cot theta', 'direction', 'vanishing line', 'right angle', 'orthogonal', 'centre of vision'],
  prereq: ['central-projection', 'horizon-and-eye-level', 'points-at-infinity'],
  related: ['one-point-perspective', 'two-point-perspective', 'three-point-perspective', 'measuring-points', 'cross-ratio', 'projective-geometry', 'camera-calibration-and-homography'],
  body: `Look down a straight road, or a railway line: the two edges are parallel, yet the picture shows them leaning together until they meet at a point on the horizon. That point is the **vanishing point** (VP) of their direction. It is not a place in the scene; it is the picture of the *point at infinity* of the direction, the place the lines reach after going on for ever. To find it, draw from the eye the line parallel to them: **where that line crosses the picture plane is the vanishing point of all lines of that direction.** Whatever their position, parallel lines share one vanishing point, and a family of directions has a vanishing point for each.

### The formula
Let the unit direction be $\\mathbf u = (u_x, u_y, u_z)$. A point of the line far away, $\\mathbf p + t\\mathbf u$ with $t \\to \\infty$, is the point $(u_x, u_y, u_z, 0)$ in homogeneous coordinates, and the [[the-perspective-matrix|perspective matrix]] sends it to $(d\\,u_x,\\ d\\,u_y,\\ u_z,\\ -u_z)$. Dividing by $w = -u_z$,
$$V = \\left(\\frac{d\\,u_x}{-u_z},\\ \\frac{d\\,u_y}{-u_z}\\right).$$
For a horizontal direction making the angle $\\theta$ with the picture plane, $\\mathbf u = (\\cos\\theta, 0, -\\sin\\theta)$ and the vanishing point lies on HL at
$$x_v = d\\,\\cot\\theta$$
from the centre of vision CV, with $d$ the distance from the eye to the picture. At $\\theta = 90°$ (lines running straight away) it is at CV; as $\\theta \\to 0$ it runs off to infinity; at $\\theta = 0$ the direction is parallel to the picture plane, there is **no** vanishing point, and the lines stay parallel.

### The right angle at the eye
Two perpendicular horizontal directions, at $\\theta$ and $90° - \\theta$, have vanishing points $d\\cot\\theta$ on one side of CV and $d\\tan\\theta$ on the other. The lines from the eye to them are parallel to the directions, so they are perpendicular: **the eye, folded onto the picture, sees the two vanishing points under a right angle**, and by the right-triangle theorem
$$d^2 = a\\,b,$$
$a$ and $b$ being the distances from CV to the two points. This is the key to finding the viewing distance from a picture, and the reason why the vanishing points of a box cannot be placed anywhere ([[two-point-perspective]]).

### Planes and the vanishing line
All the directions of a plane have their vanishing points on one line, the **vanishing line** of the plane. For horizontal planes it is HL; for a sloping roof it is another line ([[inclined-planes]]).

### How it is drawn
In the plan the parallel from the eye SP is drawn with the set square and dropped to HL; the lines of the scene are then ruled to the point. The construction below does it for two parallel walls; in the simulation you can turn the lines and watch the point slide along HL.`,
  ideas: [
    'The vanishing point of a direction is the picture of its point at infinity: draw from the eye the parallel to the direction and see where it pierces the picture plane.',
    'All parallel lines share one vanishing point; a direction parallel to the picture plane has none.',
    'A horizontal direction at angle θ to the picture plane vanishes at D cot θ from the centre of vision, on the horizon line.',
    'For two perpendicular horizontal directions the eye sees their vanishing points under a right angle, so D² = a·b.'
  ],
  pitfalls: [
    'The vanishing point is a place far away in the scene — It is a point of the picture. Nothing in the scene lies there; it is only where the line is going.',
    'Every line has a vanishing point — A line parallel to the picture plane has none: its picture is parallel to it. Facing a wall squarely, the horizontals of the wall stay horizontal.',
    'The vanishing points of a box can be placed anywhere on HL — For a box with right angles the two points and the viewing distance are tied together: D² = a·b. Pick them carelessly and the box looks skewed.'
  ],
  formulas: [
    {
      name: 'Vanishing point of a horizontal direction',
      expr: 'xv = d/tan(theta)',
      tex: 'x_v = \\frac{d}{\\tan\\theta} = d\\cot\\theta',
      vars: {
        xv: { name: 'distance of the vanishing point from CV, along HL', q: 'length', unit: 'mm', tex: 'x_v' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 140 },
        theta: { name: 'angle between the lines and the picture plane', q: 'angle', unit: '°', value: 35, min: 1, max: 90, tex: '\\theta' }
      },
      note: 'Measured on the side towards which the lines run. At 90° it is zero (the lines go straight away); below about 5° it falls off any sheet.'
    },
    {
      name: 'The vanishing point of the perpendicular direction',
      expr: 'x2 = d*tan(theta)',
      tex: 'x_2 = d\\tan\\theta',
      vars: {
        x2: { name: 'distance of the second vanishing point from CV, on the other side', q: 'length', unit: 'mm', tex: 'x_2' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 140 },
        theta: { name: 'angle of the first direction to the picture plane', q: 'angle', unit: '°', value: 35, min: 1, max: 89, tex: '\\theta' }
      },
      note: 'The second horizontal direction makes 90° − θ with the picture plane, so cot(90° − θ) = tan θ.'
    },
    {
      name: 'Viewing distance from two vanishing points',
      expr: 'd = sqrt(a*b)',
      tex: 'd = \\sqrt{a\\,b}',
      vars: {
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm' },
        a: { name: 'distance from CV to the first vanishing point', q: 'length', unit: 'mm', value: 100 },
        b: { name: 'distance from CV to the second vanishing point', q: 'length', unit: 'mm', value: 324 }
      },
      note: 'Only for two perpendicular horizontal directions, with CV between the points. With a = 100 and b = 324 the eye is 180 mm from the picture.'
    }
  ],
  examples: [
    {
      title: 'A road at 25° to the picture plane',
      q: 'A straight road makes an angle of 25° with the picture plane. The eye is 150 mm from the picture. Where do the road edges vanish, and where does the perpendicular cross-road?',
      steps: [
        { text: 'The road\'s direction:', tex: 'x_v = 150 \\cot 25° = 150 \\times 2.145 = 321.7\\ \\text{mm}' },
        { text: 'The cross-road, at 65° to the picture plane, on the opposite side of CV:', tex: 'x_2 = 150 \\tan 25° = 150 \\times 0.466 = 69.9\\ \\text{mm}' },
        'Check: $321.7 \\times 69.9 = 22\\,486 \\approx 150^2 = 22\\,500$, as $d^2 = ab$ requires.'
      ],
      a: 'The road vanishes 322 mm from CV, the cross-road 70 mm on the other side.'
    },
    {
      title: 'The eye distance of a given picture',
      q: 'In a photograph the horizontal edges of a building vanish at points 60 mm to the left and 540 mm to the right of the centre of vision. How far from the print was the camera\'s eye (the focal length at print scale)?',
      steps: [
        { text: 'Edges at a right angle, so', tex: 'd = \\sqrt{60 \\times 540} = \\sqrt{32\\,400} = 180\\ \\text{mm}' },
        'The building was turned by $\\theta$ with $\\cot\\theta = 540/180 = 3$, that is $\\theta = 18.4°$ to the picture plane.'
      ],
      a: '180 mm. This is how a computer finds the focal length of a camera from three vanishing points of a building.'
    }
  ],
  quiz: [
    { q: 'Which lines have no vanishing point in a perspective picture?', choices: ['lines parallel to the picture plane', 'lines pointing at the eye', 'lines parallel to the ground', 'lines at 45° to the picture plane'], a: 0, why: 'The parallel from the eye to such a line never meets the picture plane. Ground-parallel lines do have a point on HL unless they also happen to be parallel to the plane.' },
    { q: 'The vanishing point of a line depends only on its direction, not on where the line lies.', a: true, why: 'Parallel lines share their point at infinity and therefore their vanishing point; the parallel from the eye is the same for all of them.' },
    { q: 'Lines at 30° to the picture plane, eye 120 mm from the picture. How far from CV do they vanish, in mm (nearest whole number)?', answer: 208, unit: 'mm', why: 'x_v = 120 cot 30° = 120 × 1.732 = 207.8 mm.' },
    { q: 'Two perpendicular horizontal edges vanish 50 mm to the left and 200 mm to the right of CV. The eye is', choices: ['100 mm from the picture', '125 mm from the picture', '150 mm from the picture', '250 mm from the picture'], a: 0, why: 'd = √(50 × 200) = √10 000 = 100 mm.' },
    { q: 'As the angle θ between a set of lines and the picture plane tends to 0, their vanishing point', choices: ['runs away to infinity along HL', 'tends to CV', 'tends to the eye', 'rises above HL'], a: 0, why: 'x_v = d cot θ grows without limit; at θ = 0 the lines are parallel to the plane and have no vanishing point.' }
  ],
  applications: [
    'Perspective drawing: every receding edge of a building, a table or a road is ruled to its vanishing point, which is also the check on the whole drawing.',
    'Architectural and industrial design: the vanishing points of the roof, the floor and the walls fix where an observer stands and how wide a view he gets.',
    'Computer vision: three vanishing points of a building give the focal length, the tilt and the turn of the camera that took the photograph, with no calibration target.',
    'Autonomous driving and road tracking: the vanishing point of the lane markings is the direction of the road in the camera\'s frame.',
    'Photo editing: "perspective correction" moves a picture so that the vertical vanishing point goes to infinity, as a tilt-shift lens does.'
  ],
  history: 'The convergence of parallels is already in Brunelleschi\'s panels and Alberti\'s rules, but the point at infinity was named only later: Girard Desargues (1639) treated parallels as lines through a common point at infinity, and Brook Taylor (*Linear Perspective*, 1715) set out the theory of the vanishing point and the vanishing line, in terms close to ours. Lambert\'s *Die freye Perspektive* (1759) showed how to construct perspective pictures directly from vanishing points, without a ground plan.',
  sources: ['Brook Taylor, *Linear Perspective: or, a New Method of Representing Justly All Manner of Objects as They Appear to the Eye* (1715).', 'Johann Heinrich Lambert, *Die freye Perspektive* (1759).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed. 2003), chapter on vanishing points and the calibration of a camera.'],
  sim: 'pb-vanishing-direction',
  construction: 'pb-vanishing-point'
},

{
  id: 'station-point-and-cone-of-vision',
  parent: 'perspective-basics',
  title: 'The station point and the cone of vision',
  level: 2,
  short: 'The station point SP is where the eye stands in the plan, at distance D from the picture plane. The picture is meant to be seen from there: its width and D fix the angle it fills, which should stay within about 40°, never beyond the 60° cone of vision, or the edges stretch.',
  keywords: ['station point', 'SP', 'cone of vision', 'viewing distance', 'picture width', 'central ray', '60 degrees', 'distortion', 'wide angle'],
  prereq: ['central-projection', 'vanishing-points'],
  related: ['field-of-view-and-focal-length', 'plan-and-elevation-method', 'anamorphosis', 'wide-angle-and-the-limits-of-the-plane', 'rectilinear-lens'],
  body: `A perspective is the picture seen from one particular point. In the plan that point is the **station point** (SP), the place where the draughtsman's eye stands. The perpendicular dropped from it onto the picture plane is the **central visual ray**; where it pierces the picture is the **centre of vision** (CV) and its length is the **viewing distance** $D$. The horizon line passes through CV, and the eye is a distance $D$ in front of it.

### The cone of vision
The eye sees sharply only in a cone of about $60°$; at the corners of a wider picture the rays hit the window very obliquely and the picture becomes stretched. The draughtsman therefore draws the cone from SP with the 30°–60° set square — $30°$ either side of the central ray — and keeps the whole picture inside it, and preferably inside a narrower cone of $40°$. For a picture of width $W$ seen from distance $D$ the angle at the eye is
$$\\omega = 2\\arctan\\frac{W}{2D}, \\qquad D = \\frac{W}{2\\tan(\\omega/2)}.$$
For $\\omega = 40°$ this gives $D = 1.37\\,W$; the usual rule of thumb says $D$ between $1.5$ and $2\\,W$, which corresponds to $37°$ and $28°$.

### What goes wrong at the edge
A sphere is a circle in every picture only on the axis. At the angle $\\alpha$ from the central ray the plane meets its cone of rays obliquely and the picture is an ellipse stretched radially by about
$$\\frac{1}{\\cos\\alpha},$$
15 % at $30°$ (the edge of the cone of vision), 41 % at $45°$, 100 % at $60°$. A wide-angle photograph shows exactly this: faces near the corner are pulled outwards. The stretching is the geometry, not the lens; the picture is correct for an eye at SP and looks wrong from anywhere else.

### Seeing it from the wrong place
Seen from a different point, a perspective does not change, but the cone of rays that reaches the eye no longer matches the scene. Fortunately a flat picture seen at a slant remains acceptable (the viewer compensates, within a limit that grows with a narrower picture); it fails for very wide pictures, for pictures that must be seen from one place, such as ceilings and street paintings, and for [[anamorphosis|anamorphic]] pictures made to be seen from a slant.

### How it is drawn
Fix the picture width, find $D$ by laying off the half-angle of the cone at both ends of the width, check the objects against the cone with the 30°–60° set square. The construction below does exactly that; in the simulation the spheres show how the stretching grows when SP comes closer.`,
  ideas: [
    'SP is the eye\'s position in the plan; its distance D from the picture plane and the picture width W fix the angle the picture fills.',
    'The cone of vision is about 60°, drawn with the 30°–60° set square; the picture itself should keep within about 40° (D ≈ 1.4–2 W).',
    'Off the central ray at angle α a sphere is stretched radially by about 1/cos α: 15 % at 30°, 100 % at 60°.',
    'A perspective is right for an eye at SP; seen from elsewhere it is still a valid picture of a different set of rays.'
  ],
  pitfalls: [
    'The station point can be chosen after the drawing is made — The vanishing points, the horizon and the size of every object depend on SP; changing it means redrawing.',
    'The cone of vision is the picture\'s angle — The 60° cone is the limit of tolerable distortion, not the size of the picture, which should fill about 40°. Beyond 60° the edge is stretched out of recognition.',
    'Distortion at the edge is a fault of the lens — It is a property of the flat window: a perfectly corrected rectilinear lens produces it too. Only a different mapping (cylindrical, spherical) avoids it.'
  ],
  formulas: [
    {
      name: 'Viewing distance from the picture width and the angle',
      expr: 'D = W/(2*tan(omega/2))',
      tex: 'D = \\frac{W}{2\\tan(\\omega/2)}',
      vars: {
        D: { name: 'distance of SP from the picture plane', q: 'length', unit: 'mm' },
        W: { name: 'width of the picture', q: 'length', unit: 'mm', value: 240 },
        omega: { name: 'angle the picture fills at the eye', q: 'angle', unit: '°', value: 40, min: 5, max: 120, tex: '\\omega' }
      },
      note: 'For 40° D = 1.37 W; for 60° only 0.87 W; for 28° D = 2 W.'
    },
    {
      name: 'Where a ray at an angle lands on the picture',
      expr: 'x = D*tan(alpha)',
      tex: 'x = D\\tan\\alpha',
      vars: {
        x: { name: 'distance from CV', q: 'length', unit: 'mm' },
        D: { name: 'viewing distance', q: 'length', unit: 'mm', value: 300 },
        alpha: { name: 'angle from the central ray', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\alpha' }
      },
      note: 'Equal angles at the eye do not give equal lengths on the picture: the picture of equal steps in angle spreads out as 1/cos² α towards the edge.'
    },
    {
      name: 'Stretching of a small sphere at the edge',
      expr: 's = 1/cos(alpha)',
      tex: 's = \\frac{1}{\\cos\\alpha}',
      vars: {
        s: { name: 'ratio of the long axis to the short axis of its picture' },
        alpha: { name: 'angle of the sphere from the central ray', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\alpha' }
      },
      note: 'For a small sphere; the ellipse is stretched along the line to CV. A 24 mm lens on 36 mm film has half-angle 36.9° at the edge of the frame: stretch 1.25.'
    }
  ],
  examples: [
    {
      title: 'The station point for a 300 mm picture',
      q: 'A picture 300 mm wide is to be seen under an angle of 40°. How far from the picture must the station point be, and how does this compare with the rule of thumb?',
      steps: [
        { text: 'Apply $D = W / (2\\tan(\\omega/2))$:', tex: 'D = \\frac{300}{2\\tan 20°} = \\frac{300}{0.728} = 412\\ \\text{mm}' },
        'That is $1.37\\,W$; the rule of thumb of 1.5–2 $W$ would put the eye at 450–600 mm, where the picture fills 37°–28°.',
        'With the 30°–60° set square the 60° cone would reach $412\\tan 30° = 238$ mm either side of CV, much wider than the picture\'s 150 mm.'
      ],
      a: 'D = 412 mm (1.37 W). The picture lies well inside the 60° cone.'
    },
    {
      title: 'The corner of a wide-angle frame',
      q: 'On a full frame (36 × 24 mm) with a 24 mm lens, by how much is a small sphere at the middle of the long edge, and at the corner, stretched?',
      steps: [
        { text: 'Middle of the long edge: $\\alpha = \\arctan(18/24) = 36.9°$, so', tex: 's = \\frac{1}{\\cos 36.9°} = 1.25' },
        { text: 'Corner: half the diagonal is $21.6$ mm, $\\alpha = \\arctan(21.6/24) = 42.0°$:', tex: 's = \\frac{1}{\\cos 42.0°} = 1.35' }
      ],
      a: '25 % at the middle of the edge, 35 % at the corner: why faces at the edge of a 24 mm shot look wide.'
    }
  ],
  quiz: [
    { q: 'What does the 30°–60° set square draw in the plan of a perspective?', choices: ['the 60° cone of vision from SP, 30° either side of the central ray', 'the 60° angle between the two vanishing points', 'the slope of a roof', 'the position of the horizon'], a: 0, why: 'The two lines from SP at 30° to the central ray bound the cone of vision; the picture and the objects should lie inside it.' },
    { q: 'A picture 200 mm wide is to be drawn so that it fills 40° at the eye. SP should be about (mm)', answer: 275, unit: 'mm', why: 'D = W / (2 tan 20°) = 200 / 0.728 = 274.7 mm, that is 1.37 W.' },
    { q: 'Moving the station point closer to the picture plane, the objects at the edge of the picture are', choices: ['stretched more', 'stretched less', 'unchanged', 'turned about the vertical'], a: 0, why: 'The angle α at which the edge is seen grows, and the stretch is 1/cos α.' },
    { q: 'A small sphere 45° from the central ray appears stretched about', choices: ['15 %', '41 %', '100 %', '200 %'], a: 1, why: '1 / cos 45° = 1.414.' },
    { q: 'The stretching of objects at the edge of a very wide rectilinear picture can be removed by using a better lens.', a: false, why: 'It belongs to the geometry of the flat window, not to lens errors. Only another mapping, such as a cylindrical or spherical projection, avoids it.' }
  ],
  applications: [
    'Architectural rendering and drawing: the draughtsman fixes SP and the cone first so that the building fills a natural angle of view and nothing is stretched.',
    'Photography: choosing a 35 mm or 50 mm lens rather than a 24 mm one for portraits keeps faces out of the stretched zone; panoramas use cylindrical stitching to avoid it.',
    'Stage design and trompe-l\'œil painting: a painted ceiling or a forced-perspective set is exact only from one station point, usually marked on the floor.',
    'Street art and anamorphosis: the picture is made for a chosen SP, often at a slant, and looks right only from there.',
    'Cinema: the best seat is the one from which the screen fills about 40°, which fixes the distance to the screen at 1.4 times its width.'
  ],
  history: 'Alberti\'s "visual pyramid" has its apex at the eye, and the distance of that eye from the picture is the painter\'s free choice, which then fixes the whole picture; Jean Pèlerin (1505) and Vignola, with Danti\'s commentary (1583), turned the choice into the distance points of the draughtsman. Whether a picture must be looked at from its station point was reopened by Maurice Pirenne in *Optics, Painting and Photography* (1970) and by Michael Kubovy in *The Psychology of Perspective and Renaissance Art* (1986), who showed how well the eye compensates for oblique viewing of flat pictures.',
  sources: ['Maurice H. Pirenne, *Optics, Painting and Photography* (1970).', 'Michael Kubovy, *The Psychology of Perspective and Renaissance Art* (1986).', 'Giacomo Barozzi da Vignola, *Le due regole della prospettiva pratica* (published 1583, with commentary by Egnazio Danti).'],
  sim: 'pb-cone-of-vision',
  construction: 'pb-cone-of-vision'
}

,
{
  id: 'the-perspective-matrix',
  parent: 'perspective-basics',
  title: 'The perspective matrix',
  level: 3,
  short: 'The window of central projection is one 4 × 4 matrix: its first two rows scale by d, its last row copies the depth into w, and the division by w does the rest. Put in front of the camera\'s own view matrix, it gives every picture point, vanishing point and horizon.',
  keywords: ['perspective matrix', 'projection matrix', 'homogeneous', 'w', 'divide', 'view matrix', 'lookAt', 'camera matrix', 'depth', 'vanishing point'],
  prereq: ['homogeneous-coordinates', 'the-4x4-matrix', 'the-projection-matrix', 'central-projection'],
  related: ['the-camera-model', 'opengl-projection-matrices', 'points-at-infinity', 'camera-calibration-and-homography', '3d-graphics-pipeline', 'depth-buffers-and-clipping'],
  body: `The window of [[central-projection]] is one matrix. Put the eye at the origin looking along $-z$, the picture plane at $z = -d$, and write each point as $(x, y, z, 1)$ ([[homogeneous-coordinates]]). Then
$$P(d) = \\begin{bmatrix} d & 0 & 0 & 0 \\\\ 0 & d & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}, \\qquad P(d)\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} d\\,x \\\\ d\\,y \\\\ z \\\\ -z \\end{bmatrix}.$$

### What each row does
The first two rows multiply $x$ and $y$ by $d$: the window distance is the magnification. The fourth row writes $w = -z$, the depth, and the **homogeneous divide** $(x_h/w,\\ y_h/w) = (d\\,x/(-z),\\ d\\,y/(-z))$ is the whole of perspective; nothing else makes far things small. The third row only carries $z$ along (a real graphics matrix puts there an expression that keeps the order of depth, [[opengl-projection-matrices]]); after the divide it is the constant $-1$, because the picture is flat.

### The camera in front of it
A camera is not at the origin. A **view matrix** $V$ — a rotation followed by a translation, the "look at" of a graphics library — brings the world into the camera's frame, and the picture is made by the product
$$M = P(d)\\,V.$$
Order matters: $V$ acts first. The position and the turn and tilt of the eye live in $V$; the focal length lives in $P$. A direction is a vector with a final $0$: $M(u_x, u_y, u_z, 0)^{T}$ gives its [[vanishing-points|vanishing point]] by one more division, and the line through the vanishing points of all horizontal directions is the horizon.

### What it loses
$P(d)$ has no inverse: its last column is zero, so its determinant is zero. A picture point fixes a ray, not a point of space — the depth is gone. Points with $w < 0$ lie behind the eye and must be dropped before the division, or they come out upside down; points with $w = 0$ lie in the plane through the eye parallel to the picture and have no picture at all. Keep the third row alive and the matrix becomes the 3 × 4 camera matrix of photogrammetry; restrict the scene to a plane and it becomes a $3\\times 3$ homography.

### How it is done by hand
The construction below plots a box from the numbers the matrix gives, with a ruler, joins the corners and extends the edges: the vanishing points that appear are the ones $M$ gives for the directions of the edges. In the simulation you can follow one corner through $V$, $P$ and the division.`,
  ideas: [
    'P(d) scales x and y by d and puts the depth in w; the division by w is perspective.',
    'The picture matrix is M = P(d)·V: V (rotation and translation) is applied first and holds the eye\'s position and direction.',
    'A direction (final coordinate 0) gives its vanishing point by the same matrix and the same division.',
    'The matrix cannot be inverted: it loses the depth. Points with w < 0 are behind the eye; w = 0 means no picture.'
  ],
  pitfalls: [
    'The matrix product can be written in either order — P·V and V·P are different: the view must come first. A matrix applied to a point is read from the right.',
    'The third row is unimportant — Here it is a placeholder, but in a real renderer it keeps a monotone function of depth for hidden-surface removal and clipping. Without it the order of surfaces is lost.',
    'A larger d gives a stronger perspective — d only scales the picture. The strength of the perspective is set by the distance between the eye and the scene, which is in V.'
  ],
  formulas: [
    {
      name: 'Scale of the picture at a depth',
      expr: 'n = z/d',
      tex: 'n = \\frac{z}{d}',
      vars: {
        n: { name: 'scale denominator (picture : object = 1 : n)', tex: 'n' },
        z: { name: 'depth of the object', q: 'length', unit: 'm', value: 8 },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Objects in the plane at depth z are drawn at the scale 1 : z/d. A tower at 400 m seen with d = 50 mm is drawn 1 : 8000.'
    },
    {
      name: 'Picture of a point seen by a turned camera',
      expr: 'xp = d*(x*cos(psi) - z*sin(psi))/(x*sin(psi) + z*cos(psi))',
      tex: 'x\' = d\\,\\frac{x\\cos\\psi - z\\sin\\psi}{x\\sin\\psi + z\\cos\\psi}',
      vars: {
        xp: { name: 'picture abscissa', q: 'length', unit: 'mm', signed: true, tex: 'x\'' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        x: { name: 'sideways position of the point', q: 'length', unit: 'm', value: 2, signed: true },
        z: { name: 'distance ahead (along the original view direction)', q: 'length', unit: 'm', value: 10 },
        psi: { name: 'turn of the camera to the right', q: 'angle', unit: '°', value: 20, min: -80, max: 80, signed: true, tex: '\\psi' }
      },
      note: 'The product P(d)·R_y(ψ) for one point: the rotation gives the camera coordinates, the division by the new depth gives the picture. Turn the camera right and a point straight ahead moves left on the picture.'
    }
  ],
  examples: [
    {
      title: 'One point through the matrix',
      q: 'The eye is at the origin, looking along −z, with the picture plane at d = 50 mm. Find the picture of the point (1.2, 0.5, −8) (metres).',
      steps: [
        { text: 'Multiply by $P(d)$ (the point is $(1.2,\\ 0.5,\\ -8,\\ 1)$):', tex: '\\begin{bmatrix} 50 & 0 & 0 & 0 \\\\ 0 & 50 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}\\begin{bmatrix} 1.2 \\\\ 0.5 \\\\ -8 \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} 60 \\\\ 25 \\\\ -8 \\\\ 8 \\end{bmatrix}' },
        { text: 'Divide by $w = 8$:', tex: '(x\', y\') = \\left(\\frac{60}{8},\\ \\frac{25}{8}\\right) = (7.5,\\ 3.125)\\ \\text{mm}' }
      ],
      a: 'The point is drawn 7.5 mm right of and 3.1 mm above the centre of vision.'
    },
    {
      title: 'A vanishing point from the matrix',
      q: 'Find where the direction u = (0.6, 0, −0.8) vanishes for d = 50 mm, and check against d·cot θ.',
      steps: [
        { text: 'A direction has a final 0:', tex: 'P(d)\\begin{bmatrix} 0.6 \\\\ 0 \\\\ -0.8 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 30 \\\\ 0 \\\\ -0.8 \\\\ 0.8 \\end{bmatrix}, \\quad V = \\left(\\frac{30}{0.8},\\ 0\\right) = (37.5,\\ 0)' },
        'The direction makes $\\theta$ with the picture plane where $\\tan\\theta = 0.8/0.6$, so $\\theta = 53.1°$ and $d\\cot\\theta = 50 \\times 0.75 = 37.5$. They agree.'
      ],
      a: 'V = (37.5, 0) mm: on HL, 37.5 mm to the right of CV.'
    }
  ],
  quiz: [
    { q: 'What does the last row (0, 0, −1, 0) of the perspective matrix do?', choices: ['copies the negated depth into w', 'sets y to zero', 'translates the picture by d', 'rotates the camera'], a: 0, why: 'w = −z is the depth; dividing the other coordinates by it makes far things small.' },
    { q: 'A point in the plane through the eye parallel to the picture plane has z = 0 in the camera frame. Its picture is', choices: ['at infinity (w = 0)', 'at the centre of vision', 'on the horizon line', 'at the eye'], a: 0, why: 'w = −z = 0: the division is by zero, so the point has no finite picture.' },
    { q: 'The perspective matrix can be inverted to recover the 3-D point from its picture.', a: false, why: 'Its determinant is zero. The picture gives the ray through the eye, not the depth along it.' },
    { q: 'A point 2.4 m to the right of the axis and 6 m ahead is drawn with d = 35 mm. How far right of the centre of vision is it, in mm?', answer: 14, unit: 'mm', why: 'x′ = d x / z = 35 × 2.4 / 6 = 14 mm.' },
    { q: 'Doubling d (with the eye and the scene fixed) …', choices: ['doubles every picture coordinate', 'halves them', 'moves the vanishing points only', 'changes nothing'], a: 0, why: 'd multiplies the first two rows; the picture is enlarged without any change in shape.' }
  ],
  applications: [
    'Graphics pipelines: every vertex of every frame is multiplied by M = P·V (with a real third row) and divided by w.',
    'Camera calibration and photogrammetry: the 3 × 4 camera matrix is estimated from images and decomposed into focal length, tilt and position.',
    'Augmented and virtual reality: the head\'s motion updates V every frame; the display\'s field of view fixes P.',
    'CAD and animation: the same matrix gives wireframe and rendered views, and the vanishing points are checked against it.',
    'Computer vision: homographies of planes are the restriction of M to a plane, used to straighten a photograph of a page or a pitch.'
  ],
  history: 'Homogeneous coordinates go back to August Ferdinand Möbius (1827). The first program to draw a hidden-line perspective of a solid with matrices was Lawrence Roberts\'s at MIT (1963, "Machine perception of three-dimensional solids"), which introduced the 4 × 4 form used ever since; Ivan Sutherland\'s Sketchpad (1963) and his head-mounted display (1968) made the camera matrix interactive.',
  sources: ['Lawrence G. Roberts, *Machine Perception of Three-Dimensional Solids*, MIT Lincoln Laboratory Technical Report 315 (1963).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed. 2003), the chapter on the camera model.', 'James D. Foley et al., *Computer Graphics: Principles and Practice* (2nd ed. 1990), the chapter on viewing in 3-D.'],
  sim: 'pb-matrix-pipeline',
  construction: 'pb-matrix-and-hand'
},

{
  id: 'foreshortening',
  parent: 'perspective-basics',
  title: 'Foreshortening',
  level: 2,
  short: 'Things seen obliquely are drawn short. Equal steps along the ground become thinner as e·d / z², a round coin on the floor becomes an ellipse e / z as high as it is wide, and a rod pointing at the eye shrinks to a point.',
  keywords: ['foreshortening', 'scorcio', 'depth', 'ground', 'tile', 'coin', 'ellipse', 'obliquity', 'Mantegna', 'line of sight'],
  prereq: ['central-projection', 'horizon-and-eye-level'],
  related: ['perspective-grids', 'dividing-depth', 'circles-in-perspective', 'true-length-and-true-shape', 'axonometric-scales', 'vanishing-points'],
  body: `**Foreshortening** is the shortening of things seen obliquely. In a perspective two causes act together: the *distance* shrinks everything by $d/z$, and the *obliquity* shrinks the extent along the line of sight more than the extent across it. A rod pointing at the eye shrinks to a point; the same rod across the view keeps nearly all its length.

### The ground
Stand with the eye at height $e$ over level ground and draw on a vertical window at distance $d$. A ground point at distance $z$ is drawn at $y' = -d\\,e/z$, below the horizon: **its height below HL is inversely proportional to its distance**. A strip of ground of depth $\\Delta z$ is therefore
$$\\Delta y' = d\\,e\\left(\\frac{1}{z} - \\frac{1}{z + \\Delta z}\\right) \\approx \\frac{d\\,e\\,\\Delta z}{z^{2}}$$
high, while its width $\\Delta x$ is drawn $d\\,\\Delta x / z$ wide. The depth is thus seen at the fraction $e/z$ of the width: at four times the eye height away, a depth is drawn a quarter of the width of the same length across. Equal tiles shrink as the square of the distance, and the ground meets the horizon only at infinity ([[perspective-grids]]).

### Round things on the ground
A circle of radius $r$ on the ground at distance $z$ becomes an ellipse whose axes stand in the ratio
$$\\frac{b}{a} = \\frac{e}{\\sqrt{z^{2} - r^{2}}} \\approx \\frac{e}{z} = \\tan\\varepsilon$$
($\\varepsilon$ is the angle at which the eye looks down at the centre; the derivation is in [[circles-in-perspective]]). If the picture plane faces the object — a camera aimed at the coin, or the parallel projections of the drawing office — the ratio is $\\sin\\varepsilon$ instead. Either way a low eye flattens the circle to a sliver.

### Along the line of sight
A short rod of length $L$ at distance $z$ whose direction makes the angle $\\beta$ with the line of sight is drawn
$$l' = \\frac{d\\,L\\,\\sin\\beta}{z}.$$
Only the component across the sight line counts: $\\beta = 90°$ gives its full perspective size, $\\beta = 0$ makes it vanish. This is the *scorcio* of Italian painters — Mantegna\'s dead Christ, seen from the feet, is a trunk and two soles.

### How it is drawn
In a side view, equal steps on the ground are joined to the eye; the rays cross the window at heights that bunch up to HL. The construction below is that figure, and the simulation puts a chequered floor and coins under it. Never forget the other half of the rule: the objects *across* the view only shrink by $1/z$, so every foreshortened thing is drawn relative to its unforeshortened width.`,
  ideas: [
    'The height of a ground point below HL is d·e/z: strips of equal depth get thinner as e·d/z², and the ground reaches HL only at infinity.',
    'Depth is drawn at the fraction e/z of an equal width at the same distance; the lower the eye, the stronger the effect.',
    'A circle on the ground becomes an ellipse with axis ratio e/√(z² − r²) ≈ tan ε (sin ε when the picture plane faces the object).',
    'A rod of length L at angle β to the line of sight is drawn d·L·sin β / z: only its cross-wise part counts.'
  ],
  pitfalls: [
    'Foreshortening is a distortion to be corrected — It is the correct appearance of oblique things; the error in drawings is to leave out the shortening and draw an arm or a floor at full length.',
    'The ground is foreshortened by the same factor everywhere — The ratio e/z falls with the distance; near the horizon the ground is foreshortened almost totally.',
    'A coin\'s ellipse has axis ratio sin ε in a perspective — Only for a picture plane facing the coin. On a vertical window the ratio is about tan ε = e/z, and it varies across the picture.'
  ],
  formulas: [
    {
      name: 'Strip of ground on the picture',
      expr: 'dy = d*eh*dz/z^2',
      tex: '\\Delta y\' = \\frac{d\\,e\\,\\Delta z}{z^{2}}',
      vars: {
        dy: { name: 'height of the strip on the picture', q: 'length', unit: 'mm', tex: '\\Delta y\'' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.6, tex: 'e' },
        dz: { name: 'depth of the strip', q: 'length', unit: 'm', value: 1, tex: '\\Delta z' },
        z: { name: 'distance from the eye to the strip', q: 'length', unit: 'm', value: 4 }
      },
      note: 'For a strip small against its distance. Exactly the strip is d·e·(1/z − 1/(z+Δz)): for z = 4 m it is 4.0 mm instead of 5.0.'
    },
    {
      name: 'Axis ratio of a coin on the floor',
      expr: 'q = eh/sqrt(z^2 - r^2)',
      tex: 'q = \\frac{e}{\\sqrt{z^{2} - r^{2}}}',
      vars: {
        q: { name: 'minor ÷ major axis of the ellipse' },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.6, tex: 'e' },
        z: { name: 'horizontal distance of the centre of the circle', q: 'length', unit: 'm', value: 6 },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 0.45 }
      },
      note: 'For a circle on a horizontal plane with its centre straight ahead, on a vertical window. For small r it is e/z.'
    },
    {
      name: 'Picture of a short rod at an angle to the line of sight',
      expr: 'lp = d*L*sin(beta)/z',
      tex: 'l\' = \\frac{d\\,L\\sin\\beta}{z}',
      vars: {
        lp: { name: 'length of the picture', q: 'length', unit: 'mm', tex: 'l\'' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        L: { name: 'length of the rod', q: 'length', unit: 'm', value: 2 },
        beta: { name: 'angle between the rod and the line of sight', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\beta' },
        z: { name: 'distance of the rod', q: 'length', unit: 'm', value: 10 }
      },
      note: 'A rod that is short compared with its distance and near the axis of the picture. At β = 0 the rod points at the eye and its picture is a point.'
    }
  ],
  examples: [
    {
      title: 'Floor tiles at two distances',
      q: 'A floor of one-metre tiles is seen by an eye 1.6 m above it with the picture plane at d = 50 mm. How high on the picture is the row of tiles from z = 4 m to 5 m, and the row from 16 m to 17 m?',
      steps: [
        { text: 'Exactly, $\\Delta y\' = d\\,e\\,(1/z - 1/(z+\\Delta z))$:', tex: '4\\text{–}5\\ \\text{m}:\\ 50 \\times 1.6 \\times \\left(\\tfrac14 - \\tfrac15\\right) = 4.0\\ \\text{mm}' },
        { text: 'And the far row:', tex: '16\\text{–}17\\ \\text{m}:\\ 50 \\times 1.6 \\times \\left(\\tfrac1{16} - \\tfrac1{17}\\right) = 0.294\\ \\text{mm}' },
        'The far row is 14 times thinner, though four times as far away: the strips shrink as $1/z^2$, the width of a tile only as $1/z$.'
      ],
      a: '4.0 mm and 0.29 mm. The far tile is a sliver one fourteenth as high, though only a quarter as wide.'
    },
    {
      title: 'A manhole cover from a window',
      q: 'A manhole cover of radius 0.45 m lies 6 m from the foot of a window whose sill is 1.6 m above the road. What is the axis ratio of its picture on a vertical window?',
      steps: [
        { text: 'Apply $q = e/\\sqrt{z^2 - r^2}$:', tex: 'q = \\frac{1.6}{\\sqrt{36 - 0.2025}} = \\frac{1.6}{5.983} = 0.267' },
        'The ellipse is about 27 % as high as it is wide: a flat oval, not a circle.'
      ],
      a: 'q = 0.267; for small r the shortcut e/z = 0.267 gives the same.'
    }
  ],
  quiz: [
    { q: 'Why do the tiles of a floor look thinner (in depth) the farther away they are?', choices: ['the strip of equal depth is drawn d·e·Δz/z², falling faster than the width', 'the tiles really get smaller', 'the eye is nearer to the near tiles', 'the horizon pushes them together'], a: 0, why: 'A ground point sits d·e/z below HL; equal steps in z give gaps that shrink as 1/z², so rows bunch towards HL.' },
    { q: 'A round table 1.2 m in diameter (r = 0.6 m) is 3 m away from an eye at 1.5 m height. The axis ratio of its picture on a vertical window is about', answer: 0.51, why: 'q = 1.5 / √(9 − 0.36) = 1.5 / 2.94 = 0.51.' },
    { q: 'At a distance of four times the eye height, a depth of one metre on the ground is drawn about as long as how many metres across?', choices: ['0.25', '0.5', '1', '4'], a: 0, why: 'The ratio of depth to width is e/z = 1/4.' },
    { q: 'Which eye height gives stronger foreshortening of the ground at a given distance?', choices: ['a lower one', 'a higher one', 'both the same', 'depends on d'], a: 0, why: 'The depth is drawn at the fraction e/z of the width: smaller e, smaller ratio.' },
    { q: 'A rod pointing straight at your eye is drawn as a point.', a: true, why: 'l′ = d·L·sin β / z with β = 0 gives 0: all its points lie on one ray.' }
  ],
  applications: [
    'Figure drawing and painting: foreshortened arms, legs and torsos (Mantegna, Uccello, Michelangelo) are built from the cross-section ellipses, not the lengths.',
    'Road markings: the letters of SLOW or STOP painted on a road are drawn several times taller than wide so that a driver 40 m away sees them in proportion.',
    'Photography: with a long lens the near and far parts of a scene are compressed; the same rule applies to the foreshortened depth of a field in a stadium.',
    'Sports television: the virtual "first-down" line and the pitch graphics of a broadcast are laid on the ground by the foreshortening of the camera\'s view of it.',
    'Engineering drawing: axonometric scales (the isometric factor 0.8165) are the same idea for a parallel projection — each axis foreshortened by a fixed factor.'
  ],
  history: 'Foreshortening — *scorcio* in Italian, *Verkürzung* in German — was a feat of the fifteenth-century studio: Paolo Uccello\'s broken lances and fallen soldiers, Andrea Mantegna\'s *Lamentation over the Dead Christ* (about 1480), and Piero della Francesca\'s treatise (*De prospectiva pingendi*), which constructs a cube, a head and a ring in foreshortening point by point from plan and elevation.',
  sources: ['Piero della Francesca, *De prospectiva pingendi*, books 2 and 3.', 'Martin Kemp, *The Science of Art* (1990), the chapters on Piero and Uccello.', 'Andrew Loomis, *Figure Drawing for All It\'s Worth* (1943), the chapters on foreshortening.'],
  sim: 'pb-foreshortening',
  construction: 'pb-ground-foreshortening'
},

{
  id: 'field-of-view-and-focal-length',
  parent: 'perspective-basics',
  title: 'Field of view and focal length',
  level: 1,
  short: 'The frame of the picture seen from the eye or lens fills an angle: ω = 2 arctan(w / 2f). A short focal length gives a wide angle, a long one a narrow angle; the perspective itself, the relation between near and far, depends only on where the camera stands.',
  keywords: ['field of view', 'angle of view', 'focal length', 'FOV', 'wide angle', 'telephoto', 'crop factor', 'dolly zoom', 'vertigo effect', '35 mm'],
  prereq: ['central-projection', 'station-point-and-cone-of-vision'],
  related: ['the-perspective-matrix', 'rectilinear-lens', 'fisheye-projections', 'photography-lenses-and-projections', 'tilt-shift-and-view-cameras', 'wide-angle-and-the-limits-of-the-plane'],
  body: `In a camera the picture plane is the sensor, a distance $f$ behind the lens, and $f$ is the **focal length** (for a distant scene). The sensor, of width $w$, is seen from the lens under the angle
$$\\omega = 2\\arctan\\frac{w}{2f},$$
the **angle of view**, and the picture you make with it is the window of [[central-projection]] with $d = f$. On the full 36 mm × 24 mm frame:

| lens | horizontal | vertical | diagonal |
|---|---|---|---|
| 24 mm | 73.7° | 53.1° | 84.1° |
| 35 mm | 54.4° | 37.8° | 63.4° |
| 50 mm | 39.6° | 27.0° | 46.8° |
| 85 mm | 23.9° | 16.1° | 28.5° |
| 200 mm | 10.3° | 6.9° | 12.3° |

Half the angle is the angle at which the frame's edge is seen, and the matrix of [[the-perspective-matrix]] puts it as $\\tan(\\omega/2) = w/2f$.

### Sensor size and "equivalent" lenses
A smaller sensor of width $w$ sees a narrower angle for the same $f$. A lens on a sensor $c$ times smaller than full frame (crop factor $c$) gives the same angle as an $f \\cdot c$ lens on full frame, which is why a 25 mm lens on a small sensor is called a "50 mm equivalent".

### Focal length does not change the perspective
The relations between near and far in a picture depend on the **position of the eye** only. Standing still and changing the lens crops and enlarges the middle of the same picture; stepping back and zooming in to keep the subject the same size changes the picture, because the ratio of the near and far distances, $(z + s)/z$, falls as $z$ grows. This is why portraits are shot with a long lens from afar (the nose is not exaggerated) and wide-angle shots of faces from close up look bulbous. The **dolly zoom** — walking back while zooming in, or the reverse — keeps the subject fixed while the background expands or collapses; to keep the subject's size, the distance must change in proportion to the focal length, $z_2 = z_1 f_2/f_1$.

### How it is drawn
At the drawing board the angle is laid off with the protractor at both ends of the frame, and the lines meet at the lens at the distance $f$ ([[station-point-and-cone-of-vision]]). The construction below finds $f$ for a wanted angle; the simulation changes the lens and moves the camera.`,
  ideas: [
    'The angle of view across a frame of width w at focal length f is 2·arctan(w/2f): short f, wide angle; long f, narrow angle.',
    'On the 36 × 24 mm frame, 24 mm gives 74°, 50 mm 40°, 200 mm 10° across the width.',
    'The perspective depends on where the camera stands, not on the lens: a longer lens only crops the same picture.',
    'To keep a subject the same size while changing the focal length, change the distance in proportion (the dolly zoom); the background then changes.'
  ],
  pitfalls: [
    'Wide-angle lenses distort faces and telephoto lenses flatten them — Both effects come from the distance of the camera. The lens only decides how much of the picture is kept; step back with a wide lens and crop, and the picture is the same as with a long lens.',
    'A "50 mm" lens is the same view on every camera — The angle depends on the sensor width too: 50 mm gives 40° on full frame and about 27° on a camera with a sensor half as wide.',
    'The angle of view is the same across the width and the height — It is not: the diagonal angle is the largest. The numbers quoted for lenses are usually the diagonal ones.'
  ],
  formulas: [
    {
      name: 'Angle of view across a frame',
      expr: 'omega = 2*atan(w/(2*f))',
      tex: '\\omega = 2\\arctan\\frac{w}{2f}',
      vars: {
        omega: { name: 'angle of view', q: 'angle', unit: '°', min: 1, max: 170, tex: '\\omega' },
        w: { name: 'width of the frame (36 mm for the long side of full frame)', q: 'length', unit: 'mm', value: 36 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Use w = 24 mm for the vertical angle and w = 43.3 mm for the diagonal.'
    },
    {
      name: 'Equivalent focal length on another sensor',
      expr: 'fe = f*cf',
      tex: 'f_e = c\\,f',
      vars: {
        fe: { name: 'focal length giving the same view on full frame', q: 'length', unit: 'mm', tex: 'f_e' },
        f: { name: 'actual focal length', q: 'length', unit: 'mm', value: 25 },
        cf: { name: 'crop factor (36 mm ÷ sensor width)', value: 2, tex: 'c' }
      },
      note: 'A sensor 18 mm wide has a crop factor of 2; its 25 mm lens frames like a 50 mm lens on a 36 mm sensor.'
    },
    {
      name: 'Distance that keeps the subject the same size',
      expr: 'z2 = z1*f2/f1',
      tex: 'z_2 = z_1\\,\\frac{f_2}{f_1}',
      vars: {
        z2: { name: 'new distance to the subject', q: 'length', unit: 'm', tex: 'z_2' },
        z1: { name: 'old distance to the subject', q: 'length', unit: 'm', value: 3, tex: 'z_1' },
        f1: { name: 'old focal length', q: 'length', unit: 'mm', value: 35, tex: 'f_1' },
        f2: { name: 'new focal length', q: 'length', unit: 'mm', value: 105, tex: 'f_2' }
      },
      note: 'The subject\'s picture is f·h/z. For a subject in the same size z must scale with f; the background changes because its distance does not scale.'
    }
  ],
  examples: [
    {
      title: 'Three lenses on the same frame',
      q: 'Find the horizontal angle of view of a 24 mm and an 85 mm lens on a 36 mm wide frame, and the focal length that gives exactly 60°.',
      steps: [
        { text: 'Use $\\omega = 2\\arctan(w/2f)$:', tex: '24\\ \\text{mm}:\\ 2\\arctan\\tfrac{18}{24} = 73.7°, \\qquad 85\\ \\text{mm}:\\ 2\\arctan\\tfrac{18}{85} = 23.9°' },
        { text: 'For 60° turn the formula round:', tex: 'f = \\frac{w}{2\\tan(\\omega/2)} = \\frac{36}{2\\tan 30°} = 31.2\\ \\text{mm}' }
      ],
      a: '73.7° and 23.9°; a 31 mm lens gives 60° across the width.'
    },
    {
      title: 'A dolly zoom',
      q: 'A person fills the frame at 3 m with a 35 mm lens. Where must the camera stand to keep the same framing at 105 mm, and what happens to a building 30 m behind the person?',
      steps: [
        { text: 'The subject\'s size is proportional to $f/z$, so', tex: 'z_2 = 3 \\times \\frac{105}{35} = 9\\ \\text{m}' },
        'The building was 33 m from the camera and is now 39 m: its picture (proportional to $f/z$) is $\\dfrac{105/39}{35/33} = 2.54$ times larger. The person stays the same; the building looms up behind.'
      ],
      a: 'The camera backs off to 9 m; the building behind the subject appears about 2.5 times larger.'
    }
  ],
  quiz: [
    { q: 'On a full frame (36 mm wide), which lens gives the widest horizontal angle?', choices: ['24 mm', '50 mm', '85 mm', '200 mm'], a: 0, why: 'ω = 2 arctan(18/f): the shorter f, the wider the angle: 73.7° for 24 mm.' },
    { q: 'You stand still and replace a 50 mm lens with a 100 mm lens. The resulting picture is', choices: ['the middle of the 50 mm picture, enlarged', 'a flattened version of the same view', 'a view from farther away', 'unchanged'], a: 0, why: 'The perspective depends on the position of the eye only; a longer lens crops and magnifies the centre.' },
    { q: 'The horizontal angle of view of a 100 mm lens on a 36 mm wide frame, in degrees (nearest whole)?', answer: 20, unit: '°', why: '2 arctan(18/100) = 20.4°.' },
    { q: 'To keep a subject the same size when you go from 28 mm to 84 mm you must', choices: ['go three times farther away', 'go three times closer', 'stay where you are', 'go one third of the way back'], a: 0, why: 'Subject size ∝ f/z: z must triple with f.' },
    { q: 'Portrait photographers use long lenses mainly because the lens itself flattens faces.', a: false, why: 'They stand farther away. The flattening is the effect of the distance on the ratio of near and far parts of the face; the lens only decides how much of the picture is kept.' }
  ],
  applications: [
    'Photography and cinema: the choice of lens is the choice of how much of the scene to keep; the dolly zoom is the "Vertigo effect".',
    'Game engines and virtual cameras: the field-of-view slider is exactly this angle; players trade a wide view (90–110°) against stretching at the edge.',
    'Augmented and virtual reality: the headset\'s lenses and screens are designed for a field of view of 90–110°, which fixes the matrix P.',
    'Surveillance and drone cameras: lens and sensor are chosen to cover a given angle at a given pixel density per metre.',
    'Telescopes and binoculars: the true field of view is the apparent field divided by the magnification — the same arithmetic.'
  ],
  history: 'The 36 × 24 mm frame comes from 35 mm cinema film, which Oskar Barnack ran horizontally through the first Leica prototype (about 1913–14; sold from 1925), and the "50 mm standard lens" is roughly the diagonal of that frame, 43 mm, rounded up. The dolly zoom was devised by Irmin Roberts for Alfred Hitchcock\'s *Vertigo* (1958) and has been used in countless films since.',
  sources: ['Rudolf Kingslake, *Optics in Photography* (1992).', 'Sidney F. Ray, *Applied Photographic Optics* (3rd ed. 2002), the chapters on the angle of view and perspective.', 'Michael Freeman, *The Photographer\'s Eye* (2007).'],
  sim: 'pb-field-of-view',
  construction: 'pb-field-of-view-angle'
},

{
  id: 'circles-in-perspective',
  parent: 'perspective-basics',
  title: 'Circles in perspective',
  level: 2,
  short: 'A circle in a plane is the base of a cone of rays; the window cuts that cone in a conic, almost always an ellipse. The eight-point method finds it with a square and its diagonals, and shows that the centre of the ellipse is not the picture of the centre of the circle.',
  keywords: ['circle', 'ellipse', 'conic', 'eight-point', 'eight points', 'square', 'wheel', 'perspective of a circle', 'centre', 'tangent'],
  prereq: ['central-projection', 'vanishing-points', 'foreshortening'],
  related: ['perspective-grids', 'isometric-circles', 'oblique-circles', 'two-point-perspective', 'perspective-shadows', 'anamorphosis'],
  body: `A circle is the base of the cone of rays that run from the eye to its points, and the picture plane cuts that cone in a **conic section**. Almost always it is an **ellipse**. It is a parabola only when the plane through the eye parallel to the *picture* plane just touches the circle, and a hyperbola when that plane cuts the circle, that is, when part of the circle is level with or behind the eye (a ring you stand inside, a very large arena). For a circle wholly in front of the eye, such as a coin or a table top, the picture is an ellipse.

### Not a circle, not an egg
A hand-drawn ellipse should be smooth and symmetrical about its two axes, round at both ends and never pointed. For a circle on the ground whose centre is straight ahead at the horizontal distance $z$, eye at height $e$, window at $d$, with the circle of radius $r$, the picture is an ellipse with semi-axes
$$a = \\frac{d\\,r}{\\sqrt{z^{2} - r^{2}}}, \\qquad b = \\frac{d\\,e\\,r}{z^{2} - r^{2}}, \\qquad \\frac{b}{a} = \\frac{e}{\\sqrt{z^{2} - r^{2}}}.$$
Its centre is at the height $d\\,e\\,z/(z^{2} - r^{2})$ below HL, but **the picture of the circle's centre** is at $d\\,e/z$ below HL. The first is lower, nearer the viewer: the near half of the circle is nearer the eye and so looks larger. The offset is
$$s = \\frac{d\\,e\\,r^{2}}{z\\,(z^{2} - r^{2})}.$$
It is small for a small circle and visible for a large one (a table, an arena). The widest part of the ellipse lies below the picture of the centre, not on it.

### The eight-point method
Draw the circle in its square. The circle touches the sides at their middles (four points) and crosses the diagonals at four more. Seen from a side, these four lie at $\\tfrac12(1 - 1/\\sqrt 2) = 0.146$ of the side from the nearest corner, so they divide each side of the square into $0.146 : 0.708 : 0.146$. Put the square in perspective (with the diagonal to the distance point, [[perspective-grids]]), carry the divisions to its front edge, join them to the vanishing point, and the lines cut the diagonals at the four points; draw a smooth ellipse through the eight, touching the square at the four middles. The construction is exact because the diagonals of the picture of a square are the pictures of its diagonals ([[dividing-depth]]).

### Other positions
A vertical circle, such as a wheel in a wall, is drawn the same way in its own plane: its square has horizontal sides that vanish on the horizon line like any other. A turned square gives eight points that move round the same ellipse, which does not change: a circle has no corners.

### How it is drawn
By its square and eight points; for many circles of the same size draw once and slide. The construction below shows the whole method for a circle on the ground, and the simulation turns the square and shows the exact ellipse.`,
  ideas: [
    'The picture of a circle is a conic section: an ellipse for circles that stay on one side of the eye\'s plane parallel to them, otherwise a parabola or hyperbola.',
    'A circle on the ground has semi-axes a = d·r/√(z² − r²) and b = d·e·r/(z² − r²), with axis ratio e/√(z² − r²).',
    'The eight points — four middles of the square\'s sides, four where the diagonals cut the circle — fix the ellipse; the diagonal points are at 0.146 and 0.854 of the side.',
    'The centre of the ellipse lies nearer the viewer than the picture of the circle\'s centre: the near half looks larger.'
  ],
  pitfalls: [
    'The centre of the ellipse is the picture of the circle\'s centre — It is lower (nearer the viewer) by d·e·r²/(z(z² − r²)). For a table top the difference is visible; marking the true centre helps.',
    'A circle in perspective is an egg, pointed at the far end — It is a perfect ellipse. Dürer drew the section of a cone as an egg-shaped curve, and the error has been copied for centuries.',
    'A circle in perspective is always an ellipse — Only when the whole circle is in front of the plane through the eye parallel to the picture. A ring you stand inside, or one reaching past that plane, gives a parabola or a hyperbola with two branches.'
  ],
  formulas: [
    {
      name: 'Axis ratio of a ground circle',
      expr: 'q = eh/sqrt(z^2 - r^2)',
      tex: 'q = \\frac{e}{\\sqrt{z^{2} - r^{2}}}',
      vars: {
        q: { name: 'minor ÷ major axis of the ellipse' },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.5, tex: 'e' },
        z: { name: 'horizontal distance of the centre of the circle', q: 'length', unit: 'm', value: 3 },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 0.6 }
      },
      note: 'Circle on level ground, centre straight ahead, window vertical. Looking straight down (e → ∞) the ratio tends to 1 (an ellipse that is almost a circle).'
    },
    {
      name: 'Long semi-axis of the picture',
      expr: 'a = d*r/sqrt(z^2 - r^2)',
      tex: 'a = \\frac{d\\,r}{\\sqrt{z^{2} - r^{2}}}',
      vars: {
        a: { name: 'half the width of the ellipse', q: 'length', unit: 'mm' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 0.6 },
        z: { name: 'horizontal distance of the centre', q: 'length', unit: 'm', value: 3 }
      },
      note: 'For r ≪ z this is d·r/z, the picture of a length r at the distance z.'
    },
    {
      name: 'Offset of the ellipse centre from the picture of the centre',
      expr: 's = d*eh*r^2/(z*(z^2 - r^2))',
      tex: 's = \\frac{d\\,e\\,r^{2}}{z\\,(z^{2} - r^{2})}',
      vars: {
        s: { name: 'distance between the two centres on the picture', q: 'length', unit: 'mm' },
        d: { name: 'distance from the eye to the picture', q: 'length', unit: 'mm', value: 50 },
        eh: { name: 'eye height', q: 'length', unit: 'm', value: 1.5, tex: 'e' },
        r: { name: 'radius of the circle', q: 'length', unit: 'm', value: 0.6 },
        z: { name: 'horizontal distance of the centre', q: 'length', unit: 'm', value: 3 }
      },
      note: 'The ellipse centre is the lower one. The offset grows as r², so it is negligible for coins and noticeable for a stadium.'
    }
  ],
  examples: [
    {
      title: 'A round table seen from a chair',
      q: 'A round table 1.2 m across stands with its centre 3 m in front of a draughtsman whose eye is 1.5 m above the floor, with the picture plane at d = 50 mm. How wide and how high is the ellipse of its edge, and how far is the ellipse centre from the picture of the table\'s centre?',
      steps: [
        { text: 'Semi-axes, with $r = 0.6$:', tex: 'a = \\frac{50 \\times 0.6}{\\sqrt{9 - 0.36}} = 10.2\\ \\text{mm}, \\qquad b = \\frac{50 \\times 1.5 \\times 0.6}{9 - 0.36} = 5.2\\ \\text{mm}' },
        'The ellipse is $20.4$ mm wide and $10.4$ mm high; the ratio is $b/a = 0.51 = 1.5 / 2.94$.',
        { text: 'The offset of the centres:', tex: 's = \\frac{50 \\times 1.5 \\times 0.36}{3 \\times 8.64} = 1.04\\ \\text{mm}' }
      ],
      a: 'The ellipse is 20.4 mm × 10.4 mm; its centre lies 1.0 mm below the picture of the table\'s centre.'
    },
    {
      title: 'The diagonal points of the circle',
      q: 'A circle is inscribed in a square of side 100 mm drawn in front view. Where does the circle cut the diagonals, measured from the sides?',
      steps: [
        { text: 'The circle has radius 50 mm. On the diagonal, at the distance $r$ from the centre, the point lies at', tex: 'x = 50 - 50\\cos 45° = 14.6\\ \\text{mm}' },
        'from each of the two sides it is nearest to; equivalently it divides a side into $14.6 : 70.7 : 14.6$, or $0.146\\,s$, $0.854\\,s$ from a corner.'
      ],
      a: '14.6 mm from the two nearest sides. These are the divisions of the square\'s side that you carry to the perspective square.'
    }
  ],
  quiz: [
    { q: 'A circle on the ground ahead of you, seen from standing height on a vertical window, is drawn as', choices: ['an ellipse with the major axis horizontal', 'a circle', 'an ellipse with the major axis vertical', 'an egg'], a: 0, why: 'The window is more oblique to the rays across than along the depth; the depth is foreshortened more.' },
    { q: 'The centre of the ellipse that is the picture of a circle on the ground is the picture of the circle\'s centre.', a: false, why: 'It is nearer the viewer (lower on the picture) by s = d·e·r²/(z(z²−r²)): the near half of the circle looks larger.' },
    { q: 'For e = 1.5 m, z = 3 m, r = 0.6 m the axis ratio is', answer: 0.51, why: 'q = 1.5 / √(9 − 0.36) = 0.510.' },
    { q: 'How many points does the usual hand method use to draw the ellipse?', choices: ['8: four middles of the square\'s sides and four diagonal points', '4: only the middles of the sides', '12: one for each hour', '2: the ends of the axes'], a: 0, why: 'Four tangent points and four points on the diagonals fix a smooth ellipse for hand drawing.' },
    { q: 'Looking from higher and higher above a circle on the floor, its picture tends to', choices: ['a circle', 'a line', 'a parabola', 'a point'], a: 0, why: 'e/√(z² − r²) tends to 1 as e grows; seen from straight above it is a true circle.' }
  ],
  applications: [
    'Drawing wheels, plates, tables, arches, towers and domes in any interior or street view; every cylinder is two circles joined.',
    'Industrial and car design sketches: ellipse templates are sold by the viewing angle (15°, 30°, 45° …), whose sine is the axis ratio.',
    'Road and stadium graphics: roundabouts, running tracks and arenas on a map photograph are ellipses; the ratio gives the camera\'s tilt.',
    'Photographs of round things: the axis ratio of an ellipse measures the tilt of a plate, a coin or a crater with respect to the line of sight.',
    'Architecture: the domes and round windows of a perspective are placed by ellipses whose axes are corrected by hand where the circle is large.'
  ],
  history: 'Piero della Francesca (*De prospectiva pingendi*, 1470s–80s) constructs circles and the ring-shaped *mazzocchio* in perspective point by point from squares, and Paolo Uccello drew mazzocchi in the same way. Dürer, in the *Underweysung* (1525), derived the conic section by projection from plan and elevation but drew the ellipse as an egg-shaped curve, wider at one end — a famous slip. That a conic projects to a conic from any viewpoint was a starting point of the projective geometry of Desargues (1639) and Pascal (1640).',
  sources: ['Piero della Francesca, *De prospectiva pingendi*, books 2 and 3.', 'Albrecht Dürer, *Underweysung der Messung* (1525), book 1.', 'H. S. M. Coxeter, *Projective Geometry* (2nd ed. 1987), on conics as sections of cones of rays.'],
  sim: 'pb-circle-turning',
  construction: 'pb-eight-point-circle'
}

/* @@MORE@@ */
);
