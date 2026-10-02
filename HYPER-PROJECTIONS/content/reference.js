/* HYPER-PROJECTIONS · content/reference.js — three reference concepts for the writers of Hyper Projections.
 *
 *   isometric-projection   a drawing-office projection: the matrix, the foreshortening, a hand construction with
 *                          set square and dividers, the four-centre circle, where it is used
 *   mercator-projection    a map projection: the formula, Tissot's indicatrix, the graticule drawn by hand from a
 *                          table, the rhumb line, the navigator's and the web's use of it
 *   horizon-coordinates    a sky page: the observer's coordinates, the transformation to the equatorial ones, the
 *                          dome simulation, the astrolabe plate drawn with compass and straightedge
 * Read HYPER-CORE/AUTHORING.md for the format of a concept and HYPER-PROJECTIONS/AUTHORING.md for this app.
 */
Hyper.add(
{
  id: 'isometric-projection',
  parent: 'axonometric-projections',
  title: 'Isometric projection',
  level: 1,
  short: 'The object turned 45° and tilted 35.26° so that its three axes make equal angles with the picture plane: all three are foreshortened alike, to 0.8165, and the picture shows three faces at once with the vertical still vertical.',
  keywords: ['isometric', 'axonometric', 'foreshortening', '30 degrees', 'three faces', 'Farish', 'engineering drawing', 'pictorial'],
  prereq: ['orthographic-projection', 'axonometric-projection', 'rotation-matrices'],
  related: ['isometric-drawing', 'isometric-circles', 'dimetric-projection', 'isometric-in-games'],
  body: `An orthographic view shows one face true and hides the others. Turn the object so that a corner points at you — turn it **45° about the vertical** and then **tilt it forward until the three edges at that corner make equal angles with the picture plane** — and you see three faces at once, each equally squashed. That is the isometric projection ("equal measure"). The tilt that does it is $\\alpha = \\arctan(1/\\sqrt 2) = 35.26°$: it is the angle whose cosine is $\\sqrt{2/3}$, and the body diagonal of a cube then points straight at the viewer.

### The three axes on paper
The x- and z-axes of the object come out at **30° to the horizontal**, one receding to the right and one to the left, and the y-axis stays **vertical**. Every length measured along an axis is multiplied by the same factor,
$$k = \\sqrt{\\tfrac{2}{3}} = 0.8165,$$
so a 100 mm edge is drawn 81.65 mm long whichever axis it lies on. Because all three scales are equal, the picture can be measured with one scale — that is what makes the isometric the drawing office's favourite pictorial.

### The matrix
The picture is an orthographic projection after two rotations: first $R_y(-45°)$ about the vertical, then $R_x(35.26°)$ about the horizontal,
$$M = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 0 & \\cos\\alpha & -\\sin\\alpha & 0 \\\\ 0 & \\sin\\alpha & \\cos\\alpha & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} \\cos\\beta & 0 & -\\sin\\beta & 0 \\\\ 0 & 1 & 0 & 0 \\\\ \\sin\\beta & 0 & \\cos\\beta & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}, \\qquad \\alpha = 35.26°,\\ \\beta = 45°,$$
and multiplying out, the paper coordinates of a point $(x, y, z)$ are
$$x' = \\tfrac{1}{\\sqrt 2}(x - z), \\qquad y' = \\tfrac{1}{\\sqrt 6}(2y - x - z) \\;\\text{(with the sign of the tilt chosen so that the top face is seen)}.$$
Put $(1, 0, 0)$ in and you get a vector of length $\\sqrt{1/2 + 1/6} = 0.8165$ at $-30°$; put $(0, 1, 0)$ in and you get $(0, 0.8165)$: the numbers above.

### Projection against drawing
Draughtsmen rarely multiply by 0.8165. They draw the axes at 30° and lay off the **true lengths** — an *isometric drawing*, which is the isometric projection enlarged by $1/0.8165 = 1.2247$. The shapes are identical; only the overall size differs. On an isometric drawing a circle of diameter $D$ lying in one of the faces appears as an ellipse with major axis $1.2247\\,D$ and minor axis $0.7071\\,D$; on the true projection the major axis is $D$ itself and the minor $0.577\\,D$. Either way the ellipse is drawn by hand with the [[isometric-circles|four-centre method]] below.

### What it keeps and what it loses
Parallel lines stay parallel, so the picture can be measured along the axes and nothing vanishes in the distance — a far box and a near box of the same size look the same size. That is also the loss: there is no depth cue, and some points coincide (the far bottom corner of a cube hides exactly behind the near top corner). Lines not parallel to an axis (a diagonal, a sloping roof) are *not* at the isometric scale and must be found from their end points.

> [!tip] Any direction at 30° can be drawn with the 30°–60° set square against a T-square, and the equal scale means a single pair of dividers carries every measurement: the isometric is the pictorial you can make at the drawing board in minutes.`,
  ideas: [
    'Turn 45°, tilt 35.26°: the three axes meet the picture plane at equal angles and are foreshortened equally, to 0.8165.',
    'On paper the x- and z-axes lie at 30° to the horizontal and the y-axis is vertical; lengths along them are measured with one scale.',
    'An isometric drawing uses true lengths and is the projection enlarged 1.2247 times; the shapes are the same.',
    'Parallels stay parallel and nothing vanishes: easy to draw and to measure, but with no sense of distance.'
  ],
  pitfalls: [
    'An isometric picture is what a camera sees — No: a camera makes a perspective, with vanishing points. The isometric is a parallel projection; parallel edges stay parallel on paper.',
    'The 30° angle is the tilt of the object — The object is tilted 35.26° forward and turned 45°; 30° is the angle the receding axes make on the paper.',
    'Circles become ovals of any shape — A circle in an isometric face becomes an ellipse whose axes are fixed: the major axis is always along the long diagonal of the isometric square, 1.2247 times the diameter in a drawing.'
  ],
  formulas: [
    {
      name: 'Isometric foreshortening',
      expr: 'p = L*sqrt(2/3)',
      tex: 'p = L\\sqrt{\\tfrac{2}{3}}',
      vars: { p: { name: 'length on the paper (true projection)', q: 'length', unit: 'mm' }, L: { name: 'true length along an axis', q: 'length', unit: 'mm', value: 100 } },
      note: 'Every edge parallel to an axis is shortened by the same factor 0.8165. An isometric drawing skips the factor and is 1.2247 times larger than the projection.'
    },
    {
      name: 'Minor axis of an isometric circle (true projection)',
      expr: 'b = D/sqrt(3)',
      tex: 'b = \\frac{D}{\\sqrt 3}',
      vars: { b: { name: 'minor axis of the ellipse', q: 'length', unit: 'mm' }, D: { name: 'diameter of the circle', q: 'length', unit: 'mm', value: 50 } },
      note: 'A circle in a face inclined at cos⁻¹(1/√3) = 54.7° to the picture plane: the major axis equals D, the minor is D cos 54.7°.'
    },
    {
      name: 'Axes of an isometric circle (isometric drawing)',
      expr: 'a = D*sqrt(3/2)',
      tex: 'a = D\\sqrt{\\tfrac{3}{2}}',
      vars: { a: { name: 'major axis of the ellipse', q: 'length', unit: 'mm' }, D: { name: 'diameter of the circle', q: 'length', unit: 'mm', value: 50 } },
      note: 'In a full-scale isometric drawing the ellipse is 1.2247 D long and 0.7071 D wide; the four-centre construction gives it with a compass.'
    }
  ],
  examples: [
    {
      title: 'A 60 mm cube on paper',
      q: 'A cube of edge 60 mm is drawn in true isometric projection. How long is each edge on the paper, how long is the body diagonal that points at the viewer, and how far apart are the two ends of the diagonal lying in the top face?',
      steps: [
        'Every edge is parallel to an axis, so each is foreshortened by $\\sqrt{2/3}$: $60 \\times 0.8165 = 49.0$ mm.',
        'The diagonal from the near bottom corner to the far top corner points straight at the viewer: its two ends project to the *same point*. Length on paper: 0.',
        { text: 'The diagonal of the top face joins the left and right corners of the rhombus, which lie on a horizontal line. Each half is an edge projected and then resolved horizontally:', tex: '2 \\times 49.0 \\cos 30° = 84.9\\ \\text{mm}' },
        'That is $60\\sqrt 2 = 84.9$ mm: a face diagonal that happens to lie parallel to the picture plane keeps its true length.'
      ],
      a: 'Edges 49.0 mm; the body diagonal towards the viewer collapses to a point; the horizontal face diagonal is 84.9 mm, its true length.'
    },
    {
      title: 'Choosing the drawing size',
      q: 'A part 200 mm wide is to be shown as an isometric drawing (true lengths along the axes) and must fit a 250 mm wide sheet with 20 mm margins. What is the largest drawing scale, and how wide would the same picture be as a true projection?',
      steps: [
        'In an isometric drawing a 200 mm edge is laid off at 200 mm × cos 30° = 173.2 mm horizontally; two edges meet at the near corner, so the overall width is the sum of the two horizontal extents. For a box 200 × 150 (depth) the width is $(200 + 150)\\cos 30° = 303$ mm.',
        'The sheet allows 210 mm, so the scale is $210/303 = 0.69$: draw at 2 : 3 (0.667), width 202 mm.',
        'As a true projection the picture would be $0.8165$ times smaller: $202 \\times 0.8165 = 165$ mm wide at the same scale.'
      ],
      a: 'Scale 2 : 3; the drawing is 202 mm wide, and the true projection of the same object would be 165 mm.'
    }
  ],
  quiz: [
    { q: 'In an isometric projection, what are the angles on the paper between the three projected axes?', choices: ['90°, 45°, 45°', '120°, 120°, 120°', '60°, 60°, 60°', '90°, 135°, 135°'], a: 1, why: 'The three axes are equally inclined to the picture plane, so by symmetry their projections are 120° apart: vertical, 30° right, 30° left.' },
    { q: 'Two cubes of the same size, one near and one far, are drawn in isometric. The far one appears', choices: ['smaller', 'larger', 'the same size', 'rotated'], a: 2, why: 'The projectors are parallel: size does not change with distance. Only perspective shrinks what is far.' },
    { q: 'A circle of diameter 40 mm lies on the top face of a block in a full-scale isometric drawing. Its major axis is about', answer: 49, unit: 'mm', why: '1.2247 × 40 = 49 mm, along the long diagonal of the isometric square; the minor axis is 0.7071 × 40 = 28 mm.' },
    { q: 'The isometric foreshortening factor 0.8165 is the cosine of 35.26°.', a: true, why: 'cos 35.26° = √(2/3) = 0.8165: the axes are tilted 35.26° out of the picture plane, so a unit along one of them projects to cos 35.26°.' },
    { q: 'Which line in an isometric picture can be measured with the isometric scale?', choices: ['Any line', 'Only lines parallel to the three axes', 'Only vertical lines', 'Only lines in the top face'], a: 1, why: 'The equal foreshortening holds along the axes. A line in another direction (a diagonal, a slope) has its own factor; find it from its end points.' }
  ],
  applications: [
    'Assembly and maintenance manuals: an exploded isometric shows every part in place and can be read without training in drawings.',
    'Piping and ductwork: the isometric "spool" drawing shows a run of pipe with its bends and fittings, measurable along the axes.',
    'Games and interfaces: the "isometric" worlds of strategy games are drawn without perspective so that tiles can be repeated; most use the 2:1 dimetric pixel grid, a close cousin.',
    'Patent drawings and quick design sketches, where a measurable three-face picture is wanted in minutes at the board.'
  ],
  history: 'William Farish, a Cambridge professor of natural philosophy, set out the "isometrical perspective" in 1822 to show his lecture models of machinery; the method and the name (from the Greek for *equal measure*) spread through engineering education in the nineteenth century, and the 30°–60° set square has made it the standard pictorial of the drawing office ever since.',
  sources: ['William Farish, *On Isometrical Perspective*, Transactions of the Cambridge Philosophical Society, 1822.', 'ISO 5456-3, Technical drawings — Projection methods — Part 3: Axonometric representations.', 'French, Vierck and Foster, *Engineering Drawing and Graphic Technology*, the chapter on pictorial drawing.'],
  sim: 'ref-isometric',
  construction: ['isometric-cube', 'isometric-circle']
},

{
  id: 'mercator-projection',
  parent: 'cylindrical-family',
  title: 'The Mercator projection',
  level: 2,
  short: 'The cylindrical map on which every line of constant compass bearing is straight: meridians equally spaced and parallels spread apart by the secant of the latitude, so that angles are true everywhere and areas balloon towards the poles.',
  keywords: ['Mercator', 'conformal', 'rhumb line', 'loxodrome', 'navigation chart', 'meridional parts', 'secant', 'Greenland', 'cylindrical'],
  prereq: ['cylindrical-projections', 'conformal-maps', 'great-circles-and-rhumb-lines'],
  related: ['transverse-mercator-and-utm', 'web-mercator', 'tissot-indicatrix', 'equal-area-maps', 'charts-and-navigation'],
  body: `Wrap a cylinder round the globe touching the equator and draw the meridians on it: they come out as equally spaced vertical lines, one degree of longitude the same width everywhere. On the globe a degree of longitude shrinks with latitude, by the factor $\\cos\\varphi$; on the cylinder it does not. So at latitude $\\varphi$ the map has stretched every east–west length by $1/\\cos\\varphi = \\sec\\varphi$. Gerardus Mercator's idea of 1569 was to stretch the **north–south** lengths by exactly the same factor, so that a small square on the globe stays a square on the map. The map is then *conformal*: every angle is true, and a ship's course — a line crossing every meridian at the same angle, the **rhumb line** or loxodrome — is a **straight line**. The navigator lays a ruler from port to port, reads the bearing with a protractor and steers it.

### The formula
Spacing the parallels by the secant means integrating it:
$$x = R\\,(\\lambda - \\lambda_0), \\qquad y = R \\int_0^{\\varphi} \\sec\\varphi'\\, d\\varphi' = R\\,\\ln\\tan\\!\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right).$$
Mercator had no calculus: he spaced the parallels by adding up secants in a table, and Edward Wright published the method and the tables of "meridional parts" in 1599. The pole has $y = \\infty$: it can never be drawn, which is why the map is cut at some latitude (85° on the web).

### What it costs
The scale at latitude $\\varphi$ is $\\sec\\varphi$ in every direction, so areas scale by $\\sec^2\\varphi$: at 60° every length is doubled and every area is four times too big; at 80°, lengths are 5.8 times and areas 33 times. Greenland (2.2 million km²) appears as large as Africa (30 million km²). [[tissot-indicatrix|Tissot's indicatrix]] stays a circle everywhere — the mark of a conformal map — but its radius grows without limit towards the poles.

### Where to use it and where not
For a chart you steer by, there is nothing better: angles true, courses straight, and over a few hundred kilometres the scale nearly constant. For a map that compares countries it is the worst of the common choices. The shortest route between two ports — the [[great-circles-and-rhumb-lines|great circle]] — is a *curve* on Mercator, bowing towards the pole; navigators plot it on a [[gnomonic-projection|gnomonic chart]] where it is straight, then transfer waypoints to the Mercator chart as a chain of rhumb lines.

> [!fact] Turn the cylinder on its side so it touches a meridian and the same mathematics gives the [[transverse-mercator-and-utm|transverse Mercator]], the projection of nearly every national survey grid and of the UTM system.`,
  ideas: [
    'Meridians are equally spaced verticals; the parallels are spread by sec φ so that the north–south stretch matches the east–west one.',
    'Angles are true everywhere (conformal): a rhumb line, a course of constant bearing, is a straight line.',
    'The scale is sec φ and the area scale sec² φ: Greenland looks as large as Africa; the poles are at infinity.',
    'The chart to navigate by since 1569; not a map to compare areas on.'
  ],
  pitfalls: [
    'A straight line on a Mercator chart is the shortest route — It is the rhumb line, the course of constant bearing, which is longer than the great circle except along the equator or a meridian.',
    'Mercator was trying to show the world "as it is" — He designed a chart for sailors; the stretching of the north is the price of straight courses, not an error or a bias.',
    'Mercator is a perspective projection from the centre of the globe — The central cylindrical projection (y = R tan φ) is; Mercator is not a geometric projection at all but the integral of the secant.'
  ],
  formulas: [
    {
      name: 'The Mercator ordinate',
      expr: 'y = R*ln(tan(pi/4 + phi/2))',
      tex: 'y = R \\ln\\tan\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right)',
      vars: { y: { name: 'distance of the parallel from the equator on the map', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: -85, max: 85, signed: true, tex: '\\varphi' } },
      note: 'At 60° the parallel lies 1.317 R from the equator; the pole would be at infinity.'
    },
    {
      name: 'Area exaggeration',
      expr: 'A = 1/cos(phi)^2',
      tex: 'A = \\sec^2\\varphi',
      vars: { A: { name: 'area scale relative to the equator' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'Lengths scale by sec φ in every direction, so areas scale by its square: 4 at 60°, 33 at 80°.'
    },
    {
      name: 'Rhumb-line distance',
      expr: 'd = R*(phi2 - phi1)/cos(theta)',
      tex: 'd = \\frac{R_\\oplus\\,(\\varphi_2 - \\varphi_1)}{\\cos\\theta}',
      vars: { d: { name: 'length of the rhumb line', q: 'length', unit: 'km' }, R: { const: 'Rearth' }, phi1: { name: 'start latitude', q: 'angle', unit: '°', value: 40, signed: true, min: -89, max: 89, tex: '\\varphi_1' }, phi2: { name: 'end latitude', q: 'angle', unit: '°', value: 55, signed: true, min: -89, max: 89, tex: '\\varphi_2' }, theta: { name: 'bearing from north', q: 'angle', unit: '°', value: 45, min: 0, max: 89 } },
      note: 'Along a course of constant bearing θ the latitude changes by d cos θ: the distance follows from the change of latitude alone (no good at a bearing of exactly 90°, where the latitude does not change).'
    }
  ],
  examples: [
    {
      title: 'Spacing the parallels by hand',
      q: 'A Mercator map is drawn with R = 100 mm (so 1° of longitude is 1.745 mm). Where do the parallels of 30°, 60° and 80° go, and how wide is a 1000 km square at 60° on the map?',
      steps: [
        { text: 'Apply y = R ln tan(45° + φ/2):', tex: 'y_{30} = 100\\ln\\tan 60° = 54.9\\ \\text{mm}, \\quad y_{60} = 100\\ln\\tan 75° = 131.7\\ \\text{mm}, \\quad y_{80} = 100\\ln\\tan 85° = 243.6\\ \\text{mm}' },
        'The spacing grows: 30° of latitude takes 54.9 mm near the equator but 76.8 mm between 30° and 60°, and the last 10° to 80° take 112 mm.',
        'At 60° the scale is sec 60° = 2: a 1000 km square (true width 1000/6371 R = 15.7 mm at the equator\'s scale) is drawn 31.4 mm wide and 31.4 mm high — still square, four times the true area.'
      ],
      a: 'Parallels at 54.9, 131.7 and 243.6 mm; the 1000 km square at 60° is 31.4 mm on a side, twice the equatorial size.'
    }
  ],
  quiz: [
    { q: 'Why are the parallels of a Mercator map spread apart towards the poles?', choices: ['To make room for the labels', 'So that the north–south stretch equals the east–west stretch of the cylinder, keeping angles true', 'Because the Earth is flattened at the poles', 'To make the map rectangular'], a: 1, why: 'The cylinder stretches east–west by sec φ; stretching north–south by the same amount makes the map conformal and rhumb lines straight.' },
    { q: 'On a Mercator chart the shortest route from New York to London', choices: ['is the straight line between them', 'curves north of the straight line', 'curves south of the straight line', 'cannot be drawn'], a: 1, why: 'The great circle bows towards the pole; the straight line is the rhumb line, about 3 % longer on this route.' },
    { q: 'By what factor is the area of a country at 70° latitude exaggerated on Mercator?', answer: 8.5, why: 'sec² 70° = 1/cos² 70° = 8.5.' },
    { q: 'Mercator\'s map can show the poles if it is drawn large enough.', a: false, why: 'The pole is at y = R ln tan 90° = ∞. Every Mercator map is cut off at some latitude.' }
  ],
  applications: [
    'Nautical charts: the course between two points is measured once with a protractor and steered with a compass; nearly every sea chart is Mercator.',
    'Web maps: Google, OpenStreetMap and the rest use "Web Mercator", cut at 85.05° so the world is a square that tiles cleanly at every zoom.',
    'Conformal mapping of the ellipsoid in its transverse form: the UTM grid and the national grids of Britain, Germany and many other countries.',
    'Maps of the tropics and of time zones, where the straight meridians and the small distortion near the equator are what matters.'
  ],
  history: 'Gerardus Mercator published his world chart "for the use of navigators" in 1569, spacing the parallels by a method he did not explain; Edward Wright gave the mathematics and the tables in *Certaine Errors in Navigation* (1599), and the closed formula with the logarithm of the tangent was found by Henry Bond around 1645 and proved by James Gregory and Isaac Barrow. The chart ruled navigation for four centuries and, through the web, became the most looked-at map in history.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the Mercator chapter.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Mark Monmonier, *Rhumb Lines and Map Wars: A Social History of the Mercator Projection* (2004).'],
  sim: 'ref-mercator',
  construction: 'mercator-graticule'
},

{
  id: 'horizon-coordinates',
  parent: 'the-celestial-sphere',
  title: 'Horizon coordinates: altitude and azimuth',
  level: 1,
  short: 'The observer\'s own grid on the sky: altitude above the horizon and azimuth round from north. It is what you see and what a camera or a telescope mount points with, and it changes every minute as the Earth turns.',
  keywords: ['altitude', 'azimuth', 'horizon', 'zenith', 'nadir', 'alt-az', 'meridian', 'celestial sphere', 'observer'],
  prereq: ['celestial-sphere'],
  related: ['equatorial-coordinates', 'sidereal-time-and-hour-angle', 'sky-coordinate-transformations', 'looking-at-the-horizon', 'the-all-sky-view'],
  body: `Stand anywhere and the sky is a dome: a half-sphere of directions with you at the centre, cut off by the horizon. Two angles fix any direction on it. The **altitude** $h$ is the angle above the horizon, 0° on the horizon and 90° straight up at the **zenith** (the point below your feet, the **nadir**, is −90°). The **azimuth** $A$ is the compass direction of the point on the horizon directly below the object, measured round from north through east: north 0°, east 90°, south 180°, west 270°. The vertical half-circle from the north point through the zenith to the south point is the **meridian**; every object crosses it (culminates) once a day at its highest.

### Why it is the natural system
Altitude and azimuth are what you measure with a theodolite, what a camera on a tripod points with, what an alt-az telescope mount turns about, and what a sundial, a sun-path diagram and an all-sky camera draw. Refraction (which lifts the horizon about half a degree) and the horizon itself belong to this system. The projections of this branch — the camera's rectilinear view, the fisheye dome, the sun-path chart — are all drawn in horizon coordinates.

### Why it is not enough
The sky turns, so a star's altitude and azimuth change continuously and differ from place to place. To *name* a star's position you need the [[equatorial-coordinates|equatorial system]] fixed to the sky; the two are joined by the observer's latitude $\\varphi$ and the [[sidereal-time-and-hour-angle|sidereal time]] through a rotation. With the hour angle $H = \\text{LST} - \\alpha$ and the declination $\\delta$,
$$\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H, \\qquad \\tan A = \\frac{\\sin H}{\\cos H \\sin\\varphi - \\tan\\delta\\cos\\varphi}\\ (\\text{measured from south; add 180° for the convention from north}).$$
In matrix form the transformation is a rotation of the sky about the east–west axis by $90° - \\varphi$: the celestial pole stands at altitude $\\varphi$ due north (or south), the celestial equator crosses the meridian at altitude $90° - \\varphi$ due south, and a star of declination $\\delta$ culminates at altitude $90° - \\varphi + \\delta$.

### Three consequences
A star never sets if its declination exceeds $90° - \\varphi$ (**circumpolar**); it never rises if $\\delta < -(90° - \\varphi)$. At the equator every star rises and sets vertically; at the pole nothing rises or sets and the altitude of every star is its declination. The Sun's noon altitude is $90° - \\varphi + \\delta_\\odot$, which is why a stick's shadow at noon on the equinox gives the latitude directly — the measurement Eratosthenes made.

> [!tip] The all-sky view in the sky lab is this system drawn as a map: the zenith in the middle, the horizon as the rim, altitude as the distance in. The [[the-astrolabe|astrolabe]] is the same map engraved in brass with the equatorial grid turning over it — the construction below draws its plate.`,
  ideas: [
    'Altitude is the angle above the horizon (zenith 90°); azimuth is the compass direction round from north through east.',
    'It is the observer\'s system: what instruments point with and what the sky projections of the camera, the dome and the sun-path chart are drawn in.',
    'It changes with time and place; the equatorial system is fixed to the sky, and a rotation by 90° − φ about the east–west axis joins the two.',
    'The pole stands at altitude φ; a star culminates at 90° − φ + δ; stars with δ > 90° − φ never set.'
  ],
  pitfalls: [
    'Azimuth is measured from south — Astronomers once did, and some formulas still do; the modern convention, used by navigators, surveyors and every app, is from north through east. Check which your formula assumes.',
    'The zenith is the celestial pole — The zenith is straight up and moves with you; the pole is the fixed point the sky turns about, at altitude equal to your latitude.',
    'A star\'s highest altitude is its declination — It is 90° − φ + δ (measured from the south point; use 90° + φ − δ when it culminates north of the zenith).'
  ],
  formulas: [
    {
      name: 'Altitude from declination and hour angle',
      expr: 'sin(h) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(HA)',
      tex: '\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H',
      vars: { h: { name: 'altitude', q: 'angle', unit: '°', signed: true, min: -90, max: 90 }, phi: { name: 'latitude of the observer', q: 'angle', unit: '°', value: 32, signed: true, min: -90, max: 90, tex: '\\varphi' }, delta: { name: 'declination of the star', q: 'angle', unit: '°', value: 38.8, signed: true, min: -90, max: 90 }, HA: { name: 'hour angle', q: 'angle', unit: '°', value: 30, signed: true, min: -180, max: 180, tex: 'H' } },
      solveFor: 'h',
      note: 'The hour angle is the local sidereal time minus the right ascension: 0 when the star is on the meridian, positive after.'
    },
    {
      name: 'Altitude at culmination',
      expr: 'hmax = pi/2 - phi + delta',
      tex: 'h_{\\max} = 90° - \\varphi + \\delta',
      vars: { hmax: { name: 'altitude on the meridian', q: 'angle', unit: '°', signed: true, tex: 'h_{\\max}' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -90, max: 90, tex: '\\varphi' }, delta: { name: 'declination', q: 'angle', unit: '°', value: 23.4, signed: true, min: -90, max: 90 } },
      note: 'For a star culminating south of the zenith in the northern hemisphere. With δ = the Sun\'s declination this is the noon altitude of the Sun: 61.9° in London at midsummer, 15.1° at midwinter.'
    },
    {
      name: 'Circumpolar limit',
      expr: 'dmin = pi/2 - phi',
      tex: '\\delta_{\\min} = 90° - \\varphi',
      vars: { dmin: { name: 'declination above which a star never sets', q: 'angle', unit: '°', signed: true, tex: '\\delta_{\\min}' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, min: 0, max: 90, tex: '\\varphi' } },
      note: 'In Tel Aviv (32° N) stars north of δ = +58° never set: the Great Bear\'s bowl dips below the horizon, Cassiopeia does not.'
    }
  ],
  examples: [
    {
      title: 'Vega over Tel Aviv',
      q: 'Vega has declination +38.8°. From Tel Aviv (latitude 32.1° N), how high is it when it crosses the meridian, on which side of the zenith, and does it ever set?',
      steps: [
        'Culmination altitude: $90° - 32.1° + 38.8° = 96.7°$ — more than 90°, which means Vega passes *north* of the zenith. Measured from the north point its altitude is $180° - 96.7° = 83.3°$.',
        'Circumpolar limit: $90° - 32.1° = 57.9°$. Vega\'s 38.8° is below it, so Vega does set — but only briefly: its lowest altitude, $\\delta - (90° - \\varphi) = 38.8° - 57.9° = -19.1°$, is reached due north 12 hours after culmination.',
        'With the altitude formula at hour angle 90° (six hours either side): $\\sin h = \\sin 32.1° \\sin 38.8° + 0 = 0.333$, so $h = 19.5°$, in the north-west or north-east.'
      ],
      a: 'Vega culminates at 83.3° altitude just north of the zenith, sinks to −19° due north and sets for a few hours a day; six hours from the meridian it is 19.5° up.'
    }
  ],
  quiz: [
    { q: 'An object at altitude 90° is', choices: ['on the horizon', 'at the celestial pole', 'at the zenith', 'at the nadir'], a: 2, why: 'Altitude is measured up from the horizon; 90° is straight overhead, the zenith.' },
    { q: 'At latitude 40° N, at what altitude does the celestial equator cross the meridian?', answer: 50, unit: '°', why: '90° − φ = 50°, due south. The pole stands at 40° due north; the two are 90° apart along the meridian.' },
    { q: 'At the North Pole, every visible star keeps a constant altitude all night.', a: true, why: 'The sky turns about the zenith, so stars move in circles parallel to the horizon; a star\'s altitude equals its declination.' },
    { q: 'A star of declination −60° seen from latitude 35° N', choices: ['is circumpolar', 'culminates at −5°, so it never rises', 'rises due east', 'passes through the zenith'], a: 1, why: 'Its culmination altitude is 90° − 35° − 60° = −5°: below the horizon even at its highest, so it never rises.' }
  ],
  applications: [
    'Pointing: alt-az telescope mounts, satellite dishes (an elevation and an azimuth), tracking antennas and the two axes of a surveyor\'s theodolite.',
    'Architecture: sun-path diagrams and shading studies are drawn in altitude and azimuth; the Sun\'s azimuth and altitude at each hour decide where the shadow of a building falls.',
    'Photography of the sky: a camera on a tripod is aimed by altitude and azimuth; its picture is the rectilinear projection of this coordinate grid, as the sky lab\'s horizon view shows.',
    'Navigation: a sextant measures the altitude of a star; with the azimuth from a compass and a chronometer the navigator finds the ship\'s position.'
  ],
  history: 'The horizon system is as old as the first observers who noted where the Sun rose; Greek astronomers from Hipparchus on worked mainly in the ecliptic system, and the full trigonometry of converting horizon to equatorial coordinates was set out by the Islamic astronomers of the ninth and tenth centuries, who needed it for the astrolabe and for the direction of Mecca. The modern convention of azimuth from north came from navigation and surveying.',
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13, "Transformation of coordinates".', 'Peter Duffett-Smith and Jonathan Zwart, *Practical Astronomy with your Calculator or Spreadsheet* (4th ed., 2011).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), on the astrolabe and the stereographic projection.'],
  sim: 'ref-sky-dome',
  construction: 'astrolabe-plate'
}
);
