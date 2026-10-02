/* HYPER-PROJECTIONS · content/multi-point-perspective.js — four-, five- and six-point perspective, Barre and Flocon, Escher and the limits of the flat picture.
 * Concepts of the topic `multi-point-perspective`; the simulations are in sims/multi-point-perspective.js and the hand constructions in constructions/multi-point-perspective.js.
 */
Hyper.add(
{
  id: 'curvilinear-perspective',
  parent: 'multi-point-perspective',
  title: 'Curvilinear perspective',
  level: 2,
  short: 'Perspective on a curved picture surface: keep the eye and its rays, but let them end on a cylinder or a sphere that is then unrolled or flattened. The count of vanishing points is the count of axis directions the surface can hold: a plane three at most, a cylinder four, a hemisphere five, a sphere six.',
  keywords: ['curvilinear', 'curved perspective', 'cylinder', 'sphere', 'panorama', 'fisheye', 'vanishing points', 'Barre', 'Flocon', 'wide angle', 'picture surface'],
  prereq: ['central-projection', 'vanishing-points', 'planar-and-curved-pictures'],
  related: ['four-point-perspective', 'five-point-perspective', 'six-point-perspective', 'fisheye-projections', 'wide-angle-and-the-limits-of-the-plane'],
  body: `Ordinary perspective is a projection onto a **plane**: every line from the eye is stopped by one flat sheet, and that is why such a picture can show only part of what the eye takes in. Curvilinear perspective keeps the eye and its rays and changes only the surface that stops them. Put a **cylinder** round the viewer and you have the panorama; put a **sphere** round the viewer and you have a picture that can hold every direction at once. The curved surface is then unrolled or flattened onto the sheet — and the one thing a draughtsman used to the plane takes for granted, that straight lines come out straight, has to go.

### The idea
A direction from the eye is a point of the sphere of directions, given by its angle $\\theta$ from the axis and its azimuth $\\varphi$ round it. A picture is a rule that sends every direction to a point of the paper. The flat picture's rule is $r = f\\tan\\theta$. The cylinder's rule, with the azimuth $\\lambda$ and the altitude $a$ of the direction, is $x = f\\lambda$, $y = f\\tan a$. The hemisphere's (and the fisheye's) rule is $r = f\\theta$. Draughtsmen call the cylinder [[four-point-perspective|four-point]], the hemisphere [[five-point-perspective|five-point]] and the whole sphere [[six-point-perspective|six-point]] perspective.

### Counting vanishing points
A box has three families of parallel edges, and each family points two ways: six axis directions in all. A direction becomes a vanishing point only if it meets the picture surface. A plane faces at most three of them. A cylinder reaches the four horizontal ones; up and down run parallel to its axis and never arrive. A hemisphere holds five — four on its rim and one in the middle — and the whole sphere all six, the sixth being the single point straight behind, which the flattening spreads over the whole rim. The names count exactly these.

### What it keeps and what it loses
Whatever the surface, the picture is a view from one point, so the order of things along each ray and the angles at the eye are respected. What changes is how the surface is flattened. A straight line of the scene is a great circle seen from the eye, and on the paper it becomes a curve: an arc of a circle in the stereographic picture, very nearly one in the equidistant picture. Only a few lines escape — the verticals on a cylinder, the lines through the centre of a sphere. Straightness, parallelism and the shape of a square are lost; the width of view is gained.

### How it is drawn
By hand there are three ways: compute the angle of each point and plot it on polar or cylindrical graph paper ([[fisheye-projections]]); draw each straight line as a circular arc through two rim points and a third ([[barre-flocon-method]]); or let a lens do it. In the simulation the same room is drawn on the four surfaces; the *Curvilinear* tab of the [perspective lab](#/tools/perspective) has more scenes.`,
  ideas: [
    'Curvilinear perspective changes only the picture surface: the eye and the rays stay; the rays end on a cylinder or a sphere instead of a plane.',
    'The surface is then unrolled or flattened, and straight lines of the scene become curves (except a few special ones).',
    'Vanishing points are the axis directions the surface can hold: a plane three, a cylinder four, a hemisphere five, the sphere six.',
    'A plane can never show 180°; a cylinder shows 360° round but not up and down; a sphere shows everything.'
  ],
  pitfalls: [
    'Curved lines in the picture mean the drawing is wrong — Not so: they are what a wide view must look like on a sheet. The same room drawn faithfully on a flat picture would have straight lines and impossibly stretched edges.',
    'Curvilinear perspective has more vanishing points because the room has more directions — The room still has only six axis directions; a bigger surface just lets more of them appear in the picture.',
    'The picture must be viewed from a single place — A curvilinear picture is a mapping of directions, as a map is a mapping of places; it is read by following the curves, and needs no special viewpoint.'
  ],
  formulas: [
    {
      name: 'Field of view of a flat picture',
      expr: 'alpha = 2*atan(w/(2*f))',
      tex: '\\alpha = 2\\arctan\\frac{w}{2f}',
      vars: { alpha: { name: 'field of view across the picture', q: 'angle', unit: '°', min: 1, max: 179, tex: '\\alpha' }, w: { name: 'width of the picture', q: 'length', unit: 'mm', value: 36 }, f: { name: 'distance from the eye to the picture (focal length)', q: 'length', unit: 'mm', value: 24 } },
      note: 'The flat picture needs a width w = 2f·tan(α/2): infinite at 180°, which is why no plane can show half of the sphere of directions.'
    },
    {
      name: 'Width of a cylindrical picture',
      expr: 'W = f*lam',
      tex: 'W = f\\lambda',
      vars: { W: { name: 'width of the unrolled picture', q: 'length', unit: 'mm' }, f: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 50 }, lam: { name: 'angle round the viewer covered by the picture', q: 'angle', unit: '°', value: 360, min: 1, max: 360, tex: '\\lambda' } },
      note: 'On the cylinder horizontal angles are laid off as true arc lengths, so a full 360° panorama is exactly 2πf wide.'
    }
  ],
  examples: [
    {
      title: 'How much a flat picture can hold',
      q: 'A camera has a sensor 36 mm wide. What horizontal field of view does a flat (rectilinear) picture give with lenses of 24 mm and 12 mm, and what focal length would be needed for 170°?',
      steps: [
        { text: 'With $\\alpha = 2\\arctan(w/2f)$:', tex: '24\\ \\text{mm}: 2\\arctan\\frac{36}{48} = 73.7°,\\qquad 12\\ \\text{mm}: 2\\arctan\\frac{36}{24} = 112.6°' },
        'For 170° we need $w/2f = \\tan 85° = 11.43$, so $f = 36/(2 \\times 11.43) = 1.57$ mm.',
        'Halving the focal length from 24 to 12 mm added only 39° to the field of view, and the last degrees would need a lens that is hardly a lens at all.'
      ],
      a: '73.7° and 112.6°; 170° would need f ≈ 1.6 mm — the flat picture runs out long before 180°.'
    },
    {
      title: 'A panorama on paper',
      q: 'A cylindrical panorama of radius f = 50 mm covers the whole circle and ±40° of altitude. How big is the strip when it is unrolled?',
      steps: [
        'Width: $W = f\\lambda = 50 \\times 2\\pi = 314.2$ mm.',
        'Height: $y = f\\tan a$ at $a = \\pm 40°$ gives $2 \\times 50 \\times \\tan 40° = 83.9$ mm.',
        'The strip is 314 × 84 mm, a ratio of about 3.7 : 1 — the long thin shape of every panorama.'
      ],
      a: '314.2 mm wide and 83.9 mm high.'
    }
  ],
  quiz: [
    { q: 'Which picture surface holds exactly four of a box\'s six axis directions as vanishing points?', choices: ['A plane', 'A cylinder', 'A hemisphere', 'A whole sphere'], a: 1, why: 'A cylinder reaches the four horizontal directions; up and down run parallel to its axis and never meet it. A plane holds three at most, a hemisphere five, the sphere six.' },
    { q: 'A flat picture plane can show a field of view of more than 180° if it is only made large enough.', a: false, why: 'The rays at 90° from the axis are parallel to the plane and never meet it, so the field is always less than 180°; at 170° the picture would already need a width of 22.9 f.' },
    { q: 'A 36 mm wide sensor with a 12 mm rectilinear lens: the horizontal field of view in degrees is about', answer: 112.6, unit: '°', why: '2·arctan(36/24) = 112.6°.' },
    { q: 'What becomes of a straight edge of the room on a curvilinear picture?', choices: ['It stays straight', 'It becomes a curve, apart from a few special lines', 'It disappears', 'It becomes a shorter straight edge'], a: 1, why: 'A straight edge is a great circle seen from the eye; flattening a curved surface bends it. Only lines that happen to run through the centre of a sphere, or the verticals on a cylinder, stay straight.' },
    { q: 'How wide is a full-circle cylindrical picture of radius f?', choices: ['πf', '2πf', 'f', '4f'], a: 1, why: 'The width is f times the angle in radians: f·2π.' }
  ],
  applications: [
    'Panoramic photography: a swing-lens or stitched panorama is a cylindrical picture, its horizontals bent into arches, its verticals straight.',
    'Fisheye and 360° cameras: surveillance domes, action cameras and virtual-reality rigs record the whole hemisphere or sphere at once.',
    'Planetariums and full-dome film: the picture is made for a spherical screen and flattened only for storage ([[dome-projection]]).',
    'Architectural interiors in one sheet: a whole room, walls, floor and ceiling together, in a single drawing.',
    'Art: the interiors and mirror-ball pictures of M. C. Escher, and the paintings on spheres of Dick Termes ([[escher-and-curved-space]]).'
  ],
  history: 'Drawing on a curved surface is as old as the painted panorama: Robert Barker patented his cylindrical panorama in Edinburgh in 1787. The mathematics of drawing straight lines as arcs on such a picture was set out by the draughtsmen André Barre and Albert Flocon in *La perspective curviligne* (1968), who also gave the five- and six-point systems their names. From the late 1960s the American artist Dick Termes has painted on spheres and calls his method six-point perspective.',
  sources: ['André Barre and Albert Flocon, *La perspective curviligne* (Flammarion, 1968); English edition *Curvilinear Perspective* (University of California Press, 1987).', 'Stephan Oettermann, *The Panorama: History of a Mass Medium* (Zone Books, 1997).', 'Martin Kemp, *The Science of Art* (Yale University Press, 1990), the chapters on perspective and its limits.'],
  sim: { id: 'mp-room-mappings', params: { map: 'rect' } }
},

{
  id: 'four-point-perspective',
  parent: 'multi-point-perspective',
  title: 'Four-point (cylindrical) perspective',
  level: 2,
  short: 'The picture is drawn on a cylinder round the viewer and then unrolled. Horizontal angles become true lengths, verticals stay straight and vertical, and every other horizontal line of the room bends into an arch; the four horizontal directions of the room are the four vanishing points, 90° apart on the horizon.',
  keywords: ['four-point', 'cylindrical perspective', 'cylinder', 'panorama', 'arch', 'unrolled', 'Barre', 'Flocon', 'horizon', 'vertical lines'],
  prereq: ['curvilinear-perspective', 'two-point-perspective', 'vanishing-points'],
  related: ['cylindrical-panoramas', 'five-point-perspective', 'central-cylindrical-projection', 'equirectangular-projection', 'panoramas-and-360'],
  body: `Stand in the middle of a round room with a white wall and draw on the wall what you see. Every ray from your eye meets the wall at right angles, so no direction ahead is favoured over any other — the whole circle of the horizon is drawn with the same scale. Then cut the wall at one place and unroll it. That is **four-point perspective**: the picture surface is a cylinder, and the four vanishing points are the four horizontal directions of a rectangular room — straight ahead, right, behind and left — lying on the horizon at 90° intervals.

### The rule
Take a point of the room at $(X, Y, Z)$ in a frame with the eye at the origin and $Z$ along the axis. Its azimuth is $\\lambda = \\operatorname{atan2}(X, Z)$ and the horizontal distance to it is $\\sqrt{X^2 + Z^2}$. On a cylinder of radius $f$, unrolled, the point lands at
$$x = f\\,\\lambda, \\qquad y = f\\,\\frac{Y}{\\sqrt{X^2 + Z^2}} = f\\tan a,$$
$a$ being its altitude angle. Horizontal angles become lengths exactly (a degree is always $f\\pi/180$); vertical distances are multiplied by the tangent as in an ordinary picture. Three consequences follow at once.

### Verticals straight, horizontals bent
A vertical line has constant $X, Z$, so $x$ is constant: it is a **straight vertical line** on the unrolled picture, however near or far. The horizon ($Y = 0$) is the line $y = 0$, straight. But a horizontal line at height $h$ along a wall at distance $d$ has $\\sqrt{X^2 + Z^2} = d/\\cos(\\lambda - \\lambda_0)$, $\\lambda_0$ being the direction of the wall's normal, and so
$$y = \\frac{f\\,h}{d}\\cos(\\lambda - \\lambda_0):$$
an **arch**, highest where the wall is nearest and falling towards the corners, where two arches meet in a cusp. A ceiling edge and a floor edge give two arches, one above and one below the horizon, mirror images if the eye is midway.

### What it keeps and loses
It keeps vertical lines vertical (a tall building is a tall rectangle however you turn), keeps the horizon straight, and gives true angles along the horizon. It loses straightness of everything else — and it cannot hold the directions straight up and down, which run parallel to the cylinder's axis; only a band of altitude, say $\\pm 45°$, is shown. The picture is also not an image a camera sees at once, only one a panning camera sweeps out.

### How it is drawn
Draw the horizon, step off azimuths with dividers at equal intervals (equal lengths), erect verticals, then lay off the heights $y = f\\,h\\cos(\\lambda - \\lambda_0)/d$ from a table at each vertical and trace the arches through the points with a French curve. The construction below does this for a square hall and shows the four vanishing points on the horizon.`,
  ideas: [
    'On a cylinder, horizontal angle becomes length exactly: x = f·λ, so a full turn is 2πf wide.',
    'Vertical lines are straight and vertical; the horizon is straight; every other horizontal line is an arch y = (f·h/d)·cos(λ − λ0).',
    'The four horizontal directions of a rectangular room are the four vanishing points, 90° apart on the horizon; up and down are not in the picture.',
    'Corners of the room are cusps where two arches meet, at a vertical line.'
  ],
  pitfalls: [
    'Four-point perspective means a box with four vanishing points — A box always has three axes. The fourth point is the opposite end of one of the horizontal axes: left and right, ahead and behind are all different points on a cylinder.',
    'The arches are a distortion that a good drawing would avoid — They are the correct image of a straight horizontal edge on the cylinder; a straight edge would be wrong.',
    'On a cylinder verticals converge when you look up — They do not: the cylinder has no tilt. Tilting the camera is what makes verticals converge in a flat picture; here the verticals stay parallel and the price is that the zenith is out of reach.'
  ],
  formulas: [
    {
      name: 'Position along the unrolled strip',
      expr: 'x = f*atan2(X, Z)',
      tex: 'x = f\\,\\operatorname{atan2}(X, Z)',
      vars: { x: { name: 'distance along the strip from the centre line', q: 'length', unit: 'mm', signed: true }, f: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 60 }, X: { name: 'sideways distance of the point', q: 'length', unit: 'm', value: 1.5, signed: true }, Z: { name: 'distance ahead', q: 'length', unit: 'm', value: 2 } },
      note: 'atan2(X, Z) is the azimuth in radians; the point lands that many radii of arc from the centre line.'
    },
    {
      name: 'Height on the strip',
      expr: 'y = f*Y/sqrt(X^2 + Z^2)',
      tex: 'y = \\frac{f\\,Y}{\\sqrt{X^2 + Z^2}}',
      vars: { y: { name: 'height on the strip above the horizon', q: 'length', unit: 'mm', signed: true }, f: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 60 }, Y: { name: 'height of the point above eye level', q: 'length', unit: 'm', value: 2.6, signed: true }, X: { name: 'sideways distance', q: 'length', unit: 'm', value: 1.5, signed: true }, Z: { name: 'distance ahead', q: 'length', unit: 'm', value: 2 } },
      note: 'The height is the tangent of the altitude angle times f: the same law as on a flat picture, but with the horizontal distance measured round the axis.'
    },
    {
      name: 'The arch of a horizontal line',
      expr: 'y = f*h*cos(u)/d',
      tex: 'y = \\frac{f\\,h}{d}\\cos u',
      vars: { y: { name: 'height of the arch on the strip', q: 'length', unit: 'mm', signed: true }, f: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 60 }, h: { name: 'height of the line above the eye', q: 'length', unit: 'm', value: 2.6, signed: true }, d: { name: 'distance of the wall from the eye', q: 'length', unit: 'm', value: 2 }, u: { name: 'azimuth measured from the wall\'s normal', q: 'angle', unit: '°', value: 30, signed: true, min: -85, max: 85 } },
      note: 'Valid along one flat wall: 0° is straight at it, ±45° the corner of a square room. The arch is highest at u = 0.'
    }
  ],
  examples: [
    {
      title: 'The ceiling of a square hall',
      q: 'A square hall has walls 2 m from the eye and a ceiling 2.6 m above eye level. On a cylinder of radius f = 60 mm, how high above the horizon is the ceiling edge of the front wall at 0°, 15°, 30° and 45° off the wall\'s normal?',
      steps: [
        { text: 'The ceiling edge is a horizontal line at $h = 2.6$ m on a wall at $d = 2$ m, so $y = 60 \\times 2.6 \\times \\cos u / 2 = 78\\cos u$:', tex: 'y = 78.0,\\ 75.3,\\ 67.5,\\ 55.2\\ \\text{mm}\\quad (u = 0°, 15°, 30°, 45°)' },
        'Along the strip those points are $60 \\times 15° = 15.7$ mm apart. At 45° two arches meet: the corner of the hall, a vertical cusp.',
        'The floor 1.5 m below the eye gives, in the same way, $45\\cos u$: 45.0, 43.5, 39.0, 31.8 mm below the horizon.'
      ],
      a: 'The ceiling arch is 78.0, 75.3, 67.5 and 55.2 mm high; the floor arch 45.0, 43.5, 39.0 and 31.8 mm deep.'
    },
    {
      title: 'Where one point lands',
      q: 'A point on the front wall of that hall is 1.5 m to the right of the axis, at ceiling height (2.6 m). Where is it on the strip (f = 60 mm)?',
      steps: [
        { text: 'Horizontally $x = f\\operatorname{atan2}(1.5, 2) = 60 \\times 0.6435$:', tex: 'x = 38.6\\ \\text{mm to the right of the centre line}' },
        { text: 'Vertically the distance to the point is $\\sqrt{1.5^2 + 2^2} = 2.5$ m:', tex: 'y = 60 \\times 2.6 / 2.5 = 62.4\\ \\text{mm above the horizon}' }
      ],
      a: '38.6 mm to the right and 62.4 mm up.'
    }
  ],
  quiz: [
    { q: 'In four-point perspective, how are the vertical edges of the room drawn?', choices: ['As curves bowing outwards', 'As straight vertical lines', 'As lines converging upwards', 'As arcs of circles'], a: 1, why: 'A vertical edge has constant X and Z, hence constant x on the strip: a straight vertical line.' },
    { q: 'A horizontal edge of the front wall, above eye level, is drawn on the unrolled cylinder as', choices: ['a horizontal straight line', 'an arch, highest opposite the middle of the wall', 'a straight line sloping down to both corners', 'a dip, lowest opposite the middle of the wall'], a: 1, why: 'y = (f·h/d)·cos u: highest at u = 0, where the wall is nearest.' },
    { q: 'On a cylinder of radius 50 mm, a direction 30° off the axis is at what distance from the centre line, in mm?', answer: 26.2, unit: 'mm', why: 'x = f·λ with λ = 30° = 0.5236 rad: 26.2 mm.' },
    { q: 'The eye-level line (the horizon) is a straight line in a cylindrical picture.', a: true, why: 'Points at eye level have Y = 0, so y = 0 whatever the azimuth.' },
    { q: 'Why can a cylindrical picture not show the vanishing points of the vertical directions?', choices: ['The viewer cannot look up', 'Rays straight up or down run parallel to the cylinder\'s axis and never meet it', 'They are at 90°, which cannot be drawn', 'They coincide with the horizon'], a: 1, why: 'The cylinder is only a surface round the axis; the vertical directions are parallel to it, so they have no intersection with it.' }
  ],
  applications: [
    'Panoramic prints and murals of a room or a landscape: the long thin strip of a rotating (swing-lens) camera is a cylindrical picture.',
    'Stitched panoramas in photography: the software first re-projects each frame onto a cylinder, so the verticals stay vertical ([[cylindrical-panoramas]]).',
    'The painted panoramas of the nineteenth century, hung inside a rotunda, were drawn on a cylinder and viewed from its axis.',
    'Architectural elevations of squares and interiors: a courtyard or a street frontage all round in a single continuous sheet.'
  ],
  history: 'The cylinder is the first of the curved picture surfaces to be used: Robert Barker\'s panoramas of 1787 onward were painted on the inside of a rotunda and drawn with a cylindrical perspective that painters worked out empirically. Panoramic cameras that sweep a slit across a rotating film (Martens\'s Megaskop of 1844, the Kodak Cirkut of 1904) made it a photographic geometry. Barre and Flocon gave the systematic construction, with four vanishing points, in *La perspective curviligne* (1968).',
  sources: ['André Barre and Albert Flocon, *Curvilinear Perspective* (University of California Press, 1987), the chapters on cylindrical perspective.', 'Stephan Oettermann, *The Panorama* (Zone Books, 1997).', 'Sidney F. Ray, *Applied Photographic Optics* (3rd ed., 2002), the chapter on panoramic cameras.'],
  sim: { id: 'mp-room-mappings', params: { map: 'cyl' } },
  construction: 'mp-cylindrical-grid'
},

{
  id: 'five-point-perspective',
  parent: 'multi-point-perspective',
  title: 'Five-point (spherical) perspective',
  level: 3,
  short: 'The hemisphere in front of the viewer, flattened into a disc so that the angle from the axis becomes the distance from the centre: r = f·θ. Four vanishing points sit on the rim, one in the middle, and every straight line of the room becomes a curve through two opposite points of the rim.',
  keywords: ['five-point', 'spherical perspective', 'hemisphere', 'fisheye', 'equidistant', 'rim', 'vanishing points', 'Barre', 'Flocon', 'disc'],
  prereq: ['four-point-perspective', 'azimuthal-equidistant-projection', 'vanishing-points'],
  related: ['barre-flocon-method', 'six-point-perspective', 'equidistant-fisheye', 'fisheye-projections', 'the-all-sky-view'],
  body: `A cylinder cannot look up or down. For that the picture surface must be a **sphere**. Put the eye at the centre of a hemisphere that faces forward, draw on its inside what you see, and flatten it into a disc. If the flattening is made so that a point at the angle $\\theta$ from the axis and the azimuth $\\varphi$ goes to the point at distance $r = f\\theta$ from the centre, in the direction $\\varphi$, you have **five-point perspective** — the same mathematics as the azimuthal equidistant map ([[azimuthal-equidistant-projection]]), applied to directions instead of places.

### The frame
The axis is the centre $O$. The rim is $\\theta = 90°$, a circle of radius $R = f\\pi/2$: the directions at right angles to the line of sight. Four of the six axis directions of a room — left, right, up and down — lie exactly on the rim, at the ends of two perpendicular diameters; the fifth, straight ahead, is the centre. The sixth, straight behind, is out of the hemisphere. These are the five points.

### Straight lines become arcs
A line of the room, seen from the eye, is a great circle, and a great circle crosses the rim circle in two opposite points. So **every straight line is a curve through two opposite points of the rim**. The curve is very nearly a circular arc: for lines parallel to the picture plane it passes through $V_L, V_R$ (or $V_U, V_D$) and one other point. The exceptions are lines parallel to the axis, which are **radii**: their plane contains the axis, so their azimuth is constant. The four long edges of a room that you look along are straight radii ending at the centre.

### What it keeps and loses
Distances from the centre are proportional to angles, so a ring is a cone of directions and the angle of any point off the axis can be read with a ruler. The picture is neither conformal nor area-true: along a ring it stretches by $\\theta/\\sin\\theta$ (1.57 at the rim). Parallels are lost, squares are bowed, but a whole hemisphere — 180° — is shown, which no flat picture can do.

### How it is drawn
Compute $\\theta$ and $\\varphi$ of each point from $(X, Y, Z)$: $\\tan\\theta = \\sqrt{X^2 + Y^2}/Z$, $\\tan\\varphi = Y/X$. Plot them on polar paper with rings of equal angle; or use the diagram below: the far wall of a room needs only four arcs, each found with the compass from two rim points and one table value. The [[barre-flocon-method]] gives the rule for any line.`,
  ideas: [
    'The hemisphere is flattened with r = f·θ; the rim is θ = 90°, radius R = f·π/2.',
    'Left, right, up and down vanish exactly on the rim, straight ahead at the centre: five vanishing points.',
    'A straight line of the room is a curve through two opposite points of the rim — very nearly an arc of a circle; a line parallel to the axis is a radius.',
    'The angle of a point from the axis can be read off with a ruler: θ = 90°·r/R.'
  ],
  pitfalls: [
    'The rim is the horizon — The horizon is the diameter through the centre (for a level camera). The rim is the circle of directions at 90° from the axis, the limit of the view.',
    'The fifth vanishing point is a new direction — It is the same direction as the room\'s depth axis; what is new is that its image is inside the picture, because the sphere holds it.',
    'Circles of the picture are circles of the sky — A ring about the centre is a cone about the axis, but a circle elsewhere on the picture is not an exact circle of directions, except in the stereographic picture.'
  ],
  formulas: [
    {
      name: 'Distance from the centre',
      expr: 'r = f*theta',
      tex: 'r = f\\theta',
      vars: { r: { name: 'distance of the point from the centre of the picture', q: 'length', unit: 'mm' }, f: { name: 'scale of the picture (the picture\'s "focal length")', q: 'length', unit: 'mm', value: 63.66 }, theta: { name: 'angle of the direction from the axis', q: 'angle', unit: '°', value: 42, min: 0, max: 180, tex: '\\theta' } },
      note: 'For the hemisphere θ runs from 0 to 90°; with f = 63.66 mm the rim is 100 mm from the centre.'
    },
    {
      name: 'Angle off the axis of a point of the room',
      expr: 'theta = atan(sqrt(X^2 + Y^2)/Z)',
      tex: '\\theta = \\arctan\\frac{\\sqrt{X^2 + Y^2}}{Z}',
      vars: { theta: { name: 'angle from the axis', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' }, X: { name: 'sideways distance', q: 'length', unit: 'm', value: 3, signed: true }, Y: { name: 'height above the eye', q: 'length', unit: 'm', value: 2, signed: true }, Z: { name: 'distance ahead', q: 'length', unit: 'm', value: 4 } },
      note: 'Valid for points in front of the viewer (Z > 0).'
    },
    {
      name: 'Radius of the rim',
      expr: 'R = f*pi/2',
      tex: 'R = \\frac{\\pi f}{2}',
      vars: { R: { name: 'radius of the picture circle (θ = 90°)', q: 'length', unit: 'mm' }, f: { name: 'scale of the picture', q: 'length', unit: 'mm', value: 63.66 } },
      note: 'Fix the size of the sheet first and f follows: f = 2R/π.'
    }
  ],
  examples: [
    {
      title: 'The far wall of a room on a 200 mm disc',
      q: 'The picture circle has radius R = 100 mm (so f = 2R/π = 63.66 mm). A room is 6 m wide and 4 m high, the eye at the middle of the cross-section, and its far wall is 4 m ahead. Where are the corner of the far wall and the middle of its top edge?',
      steps: [
        { text: 'The corner $(3, 2, 4)$: $\\tan\\theta = \\sqrt{3^2 + 2^2}/4 = 0.901$, so $\\theta = 42.0°$, and the azimuth is $\\varphi = \\arctan(2/3) = 33.7°$ above the horizon.', tex: 'r = f\\theta = 63.66 \\times 0.7336 = 46.7\\ \\text{mm}' },
        { text: 'The middle of the top edge $(0, 2, 4)$: $\\theta = \\arctan(2/4) = 26.6°$ straight above the centre:', tex: 'r = 63.66 \\times 0.4636 = 29.5\\ \\text{mm}' },
        'The long edge of the room that ends at that corner is a radius at 33.7°: it runs from the corner 46.7 mm out to the rim at 100 mm, where it passes the plane of the eye.'
      ],
      a: 'The corner is 46.7 mm from the centre at 33.7° above the horizontal; the middle of the top edge is 29.5 mm above the centre.'
    },
    {
      title: 'Reading an angle off the picture',
      q: 'On a five-point picture of radius R = 100 mm a window corner is 62 mm from the centre. How far is it off the axis?',
      steps: [
        'Angles are proportional to distances: $\\theta = 90° \\times r/R$.',
        { text: 'So', tex: '\\theta = 90° \\times 62/100 = 55.8°' }
      ],
      a: '55.8° from the axis.'
    }
  ],
  quiz: [
    { q: 'How many of a room\'s axis directions lie on the rim of a five-point picture?', choices: ['Two', 'Four', 'Five', 'Six'], a: 1, why: 'Left, right, up and down are at 90° from the axis, hence on the rim. The fifth, ahead, is the centre; the sixth, behind, is outside the hemisphere.' },
    { q: 'In a five-point picture a line of the room that runs parallel to the viewing axis is drawn as', choices: ['an arc through the two rim points left and right', 'a straight radius', 'a circle about the centre', 'a vertical line'], a: 1, why: 'The plane through the eye and such a line contains the axis, so the azimuth along the line is constant: a radius.' },
    { q: 'With f = 63.66 mm a direction 30° off the axis is how far from the centre, in mm?', answer: 33.3, unit: 'mm', why: 'r = f·θ = 63.66 × 0.5236 = 33.3 mm.' },
    { q: 'Every straight line of the room is a curve through two opposite points of the rim.', a: true, why: 'A line seen from the eye is a great circle of directions; two great circles meet in opposite points, and the rim is itself the great circle at 90° from the axis.' },
    { q: 'On the picture, a ring of radius R/3 about the centre is the set of directions at what angle from the axis?', choices: ['15°', '30°', '45°', '60°'], a: 1, why: 'θ = 90° × (R/3)/R = 30°.' }
  ],
  applications: [
    'The images of circular fisheye lenses on a camera are, to a good approximation, five-point pictures: the equidistant fisheye maps angle to distance.',
    'All-sky cameras that watch clouds and meteors record the hemisphere above the observatory on one disc ([[the-all-sky-view]]).',
    'Planetarium domes are fed with a disc of exactly this kind, the "dome master" ([[dome-projection]]).',
    'Drawing a room from its centre in one view: an architect\'s or an illustrator\'s way to show floor, ceiling and all four walls on one sheet.'
  ],
  history: 'The five-point system was developed in the years before 1968 by the draughtsmen André Barre and Albert Flocon, who needed a way to draw large interiors and scenes that photography and ordinary perspective could not hold. Their book *La perspective curviligne* (1968) gives the construction with compass and ruler from two rim points and a third point. The mapping itself is older: it is the azimuthal equidistant map of al-Biruni (about 1000) applied to directions, and the photographic fisheye that does it optically goes back to Robert W. Wood (1906) and Robert Hill (1924).',
  sources: ['André Barre and Albert Flocon, *Curvilinear Perspective* (University of California Press, 1987).', 'Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), the azimuthal equidistant chapter.'],
  sim: { id: 'mp-room-mappings', params: { map: 'p5' } },
  construction: 'mp-five-point-frame'
},

{
  id: 'six-point-perspective',
  parent: 'multi-point-perspective',
  title: 'Six-point perspective: the whole sphere',
  level: 3,
  short: 'The whole sphere of directions in one disc: r = f·θ with θ out to 180°. The centre is straight ahead, the half-way circle is the side directions, and the single point straight behind is spread round the whole rim. A point behind has the same azimuth as its twin in front and lies as far from the rim as the twin lies from the centre.',
  keywords: ['six-point', 'whole sphere', 'rim', 'point behind', 'equidistant', 'Termes', 'Barre', 'Flocon', 'oval', 'half-way circle'],
  prereq: ['five-point-perspective', 'azimuthal-equidistant-projection'],
  related: ['equidistant-fisheye', 'little-planet', 'equirectangular-images', 'dome-projection', 'barre-flocon-method'],
  body: `The hemisphere of [[five-point-perspective]] stops at the rim, at 90° from the axis. Carry on: let $\\theta$ run to 180° and the rim circle becomes just a circle inside the picture. The disc now holds **every direction at once**, and since the point straight behind the viewer is one point, it is spread over the whole outer edge. This is **six-point perspective**, the equidistant picture $r = f\\theta$ of the full sphere, with the radius of the rim $R = f\\pi$.

### The frame
- The **centre** is straight ahead (θ = 0).
- The **half-way circle**, radius $R/2$, is θ = 90°: the border between what is in front and what is behind. Left, right, up and down lie on it, at the ends of two perpendicular diameters.
- The **rim** is θ = 180°, the direction straight behind; the sixth vanishing point is the whole outer circle, because the azimuth is undefined there.

### Front and back
A direction $(x, y, z)$ in front of the viewer and its twin $(x, y, -z)$ behind have the same azimuth $\\varphi$, and their angles from the axis add up to 180°. So their distances from the centre add up to the radius of the rim:
$$r' = R - r.$$
A point behind the viewer is found from its twin in front by carrying the distance from the centre to the *rim* along the same radius — with dividers alone, no calculation. A straight line of the room is then a closed oval: its front half inside the half-way circle, the back half (the same line seen behind you) outside it. The four long edges of a room that run along the axis are radii, crossing the half-way circle at the azimuth of their corner.

### What it keeps and loses
It is the only flat picture that shows everything at once. The price is the greatest distortion of the family: the rings stretch by $\\theta/\\sin\\theta$ along their length, which diverges at the rim, so the outer edge is a whole circle of points that are one. The picture is not seen from a viewpoint; it is read as one reads a polar chart.

### How it is drawn
Draw the frame, find the front arcs from rim points and one computed point as in five-point perspective, then use $r' = R - r$ to carry points to the back. The diagram below constructs the front wall, the top edge of the back wall and the four long edges of a room.`,
  ideas: [
    'Six-point perspective is the equidistant picture r = f·θ of the whole sphere: θ runs to 180° and the rim has radius R = f·π.',
    'The centre is straight ahead, the half-way circle (radius R/2) holds left, right, up and down, and the whole rim is the single direction straight behind.',
    'A point behind has the same azimuth as its twin in front and r′ = R − r: found from the front with dividers.',
    'A straight line of the room is a closed oval; the long edges along the axis are radii crossing the half-way circle.'
  ],
  pitfalls: [
    'The six-point picture has six distinct points — Five are points; the sixth, behind the viewer, is the entire rim of the disc. Every point of the rim is the same direction.',
    'The half-way circle is the horizon — The horizon is the diameter through the centre. The half-way circle is the set of directions at 90° from the axis.',
    'The picture can be looked at from one place like a photograph — It is a map of directions. Like any map of a sphere, it is distorted most at the edge, where a circle of the picture is a point of the sky.'
  ],
  formulas: [
    {
      name: 'Radius of the rim',
      expr: 'R = pi*f',
      tex: 'R = \\pi f',
      vars: { R: { name: 'radius of the picture disc', q: 'length', unit: 'mm' }, f: { name: 'scale of the picture', q: 'length', unit: 'mm', value: 50 } },
      note: 'The rim is θ = 180°. Half of it, R/2, is the circle of the side directions.'
    },
    {
      name: 'A point behind from its twin in front',
      expr: 'rb = pi*f - r',
      tex: 'r^{\\prime} = \\pi f - r',
      vars: { rb: { name: 'distance of the back point from the centre', q: 'length', unit: 'mm', tex: 'r^{\\prime}' }, f: { name: 'scale of the picture', q: 'length', unit: 'mm', value: 50 }, r: { name: 'distance of the front twin from the centre', q: 'length', unit: 'mm', value: 36.7 } },
      note: 'Same azimuth, angle 180° − θ. Measured from the rim inwards, the back point is as far in as the front point is out from the centre.'
    },
    {
      name: 'Angle from the axis of a point of the room',
      expr: 'theta = acos(Z/sqrt(X^2 + Y^2 + Z^2))',
      tex: '\\theta = \\arccos\\frac{Z}{\\sqrt{X^2 + Y^2 + Z^2}}',
      vars: { theta: { name: 'angle from the axis (0 to 180°)', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\theta' }, X: { name: 'sideways distance', q: 'length', unit: 'm', value: 3, signed: true }, Y: { name: 'height', q: 'length', unit: 'm', value: 2, signed: true }, Z: { name: 'distance ahead (negative: behind)', q: 'length', unit: 'm', value: -4, signed: true } },
      note: 'With Z negative the angle exceeds 90°: the point is behind the viewer and r = f·θ lands outside the half-way circle.'
    }
  ],
  examples: [
    {
      title: 'Front and back corners',
      q: 'A room 6 m wide and 4 m high has its far wall 4 m ahead and its rear wall 4 m behind the eye. The picture has f = 50 mm. Where are the corner of the front wall and the corresponding corner of the rear wall?',
      steps: [
        { text: 'Front corner $(3, 2, 4)$: $\\theta = \\arctan(\\sqrt{13}/4) = 42.0°$, so', tex: 'r = 50 \\times 0.7336 = 36.7\\ \\text{mm}' },
        { text: 'The rear corner $(3, 2, -4)$ has the same azimuth $33.7°$ and $\\theta\' = 180° - 42.0° = 138.0°$:', tex: 'r\' = 50 \\times 2.4080 = 120.4\\ \\text{mm} = 157.1 - 36.7' },
        'The rim is at $R = \\pi f = 157.1$ mm, so the rear corner is 36.7 mm inside the rim along the same radius. The room\'s corner edge between them is a radius that crosses the half-way circle (78.5 mm) at that azimuth.'
      ],
      a: 'The front corner is 36.7 mm from the centre, the rear corner 120.4 mm, both along the radius at 33.7°.'
    }
  ],
  quiz: [
    { q: 'In a six-point picture with f = 50 mm, the rim has a radius of', choices: ['78.5 mm', '100 mm', '157.1 mm', '314.2 mm'], a: 2, why: 'R = π·f = 157.1 mm; 78.5 mm is the half-way circle.' },
    { q: 'A point lies 30 mm from the centre of a six-point picture of rim radius 157 mm, and its twin behind the viewer has the same azimuth. How far is the twin from the centre, in mm?', answer: 127, unit: 'mm', why: 'r′ = R − r = 157 − 30 = 127 mm.' },
    { q: 'What is the sixth vanishing point, the direction straight behind the viewer, in the six-point picture?', choices: ['The centre of the disc', 'A point on the rim', 'The whole rim circle', 'It does not appear'], a: 2, why: 'At θ = 180° the azimuth is undefined and r = f·π for all azimuths: the entire rim is that single direction.' },
    { q: 'A straight line of the room is drawn in the six-point picture as a closed oval.', a: true, why: 'The line is a great circle of directions; its front half lies inside the half-way circle and its back half outside, and the two meet at the side directions.' },
    { q: 'The half-way circle of the six-point picture is', choices: ['the horizon', 'the set of directions at 90° from the axis', 'the picture of the floor', 'the set of directions behind the viewer'], a: 1, why: 'r = R/2 means θ = 90°: the border between the front and the back hemisphere.' }
  ],
  applications: [
    'Full-sphere cameras and 360° video rigs produce the whole sphere; the equidistant disc is the simplest way to store or draw it.',
    'Mirror-ball photography of lighting: a chrome ball is a six-point picture, centre = the camera, rim = straight behind the ball ([[escher-and-curved-space]]).',
    'Painting on spheres: the "Termespheres" of Dick Termes use six-point perspective so that, from any side, the painting is a correct view.',
    'Planetarium and fulldome artwork: the whole sphere is drawn and cut into the dome\'s hemisphere ([[dome-projection]]).'
  ],
  history: 'Barre and Flocon extended their five-point system to the whole sphere in the same work (*La perspective curviligne*, 1968), noting that the sixth vanishing point is not a point but the whole circumference. The American artist Dick Termes, painting on spheres since the late 1960s, calls his method six-point perspective. The mathematics is that of the azimuthal equidistant map taken all the way to the antipode, where the circle at the edge of the world map is the antipodal point of the map\'s centre ([[azimuthal-equidistant-projection]]).',
  sources: ['André Barre and Albert Flocon, *Curvilinear Perspective* (University of California Press, 1987), the chapter on spherical perspective.', 'Dick Termes, *Termespheres* (Termesphere Gallery, Spearfish, South Dakota).', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), azimuthal equidistant.'],
  sim: { id: 'mp-room-mappings', params: { map: 'p6' } },
  construction: 'mp-six-point-frame'
},

{
  id: 'cylindrical-panoramas',
  parent: 'multi-point-perspective',
  title: 'Cylindrical panoramas',
  level: 2,
  short: 'A panorama is a picture on a cylinder: each flat photograph is first rolled onto the cylinder (azimuth → arc length, height shrunk by cos u), and the strips join into a 360° picture. The same law is what makes a row of ordinary photographs stitch, and what the rotating camera of a swing-lens panorama does optically.',
  keywords: ['panorama', 'stitching', 'cylindrical projection', 'nodal point', 'focal length in pixels', 'swing lens', 'Cirkut', 'QuickTime VR', 'rotunda', 'overlap'],
  prereq: ['four-point-perspective', 'field-of-view-and-focal-length'],
  related: ['panoramas-and-360', 'equirectangular-images', 'central-cylindrical-projection', 'photography-lenses-and-projections', 'wide-angle-and-the-limits-of-the-plane'],
  body: `You cannot photograph a whole circle with one flat picture, but you can with several: turn the camera on the spot, take a row of overlapping frames and join them. The frames are flat — each is an ordinary rectilinear picture — and they will not fit edge to edge: a straight horizon in each would become a broken line, and the stretching at the sides of every frame would show. So each frame is first **re-projected onto a cylinder** centred on the lens, and the cylinder unrolled. The result is the cylindrical panorama: [[four-point-perspective]] made out of photographs.

### From a flat photograph to the cylinder
Let the photograph be at distance $f$ from the lens (in pixels, $f$ is the *focal length in pixels*), and a pixel at $(x', y')$ measured from the principal point. The ray to it makes the azimuth $u = \\arctan(x'/f)$ with the axis. Rolled onto the cylinder of radius $f$, the pixel goes to
$$x = f\\,u = f\\arctan\\frac{x'}{f}, \\qquad y = \\frac{y'\\,f}{\\sqrt{x'^2 + f^2}} = y'\\cos u.$$
The horizontal position becomes the *arc length*, the vertical one is shrunk by $\\cos u$ because the ray is longer by $1/\\cos u$. A horizontal line of the photograph becomes an arch, a vertical one stays vertical. The focal length in pixels is $f_{px} = f_{mm}\\,W_{px}/s$ for a sensor of width $s$ and $W_{px}$ pixels.

### Taking the pictures
Every frame must be taken from the same point: the lens must turn about its **nodal point** (the entrance pupil), not about the camera body, or near and far objects shift against each other from frame to frame (parallax) and the join shows. Frames overlap by 25–40 % so that the software can match them. Each covers $\\alpha = 2\\arctan(s/2f)$, so $n = 2\\pi/[\\alpha(1 - o)]$ frames, $o$ being the overlap, close the circle.

### What the cylinder keeps and loses
The panorama keeps horizontal angles true, keeps verticals vertical and the horizon straight. It loses the ceiling and the floor: the height $y = f\\tan a$ grows without bound as the altitude approaches 90°, so the strip is cut off at some altitude — for a complete view see [[equirectangular-images]]. A full circle of $f_{px} = 4000$ is $2\\pi f_{px} \\approx 25\\,000$ pixels wide.

### How it is drawn
By hand: circle of radius $f$ about the lens, a tangent line for the photograph, rays from the lens through the marks of the line; the arc from the axis to each ray's meeting with the circle is rectified with dividers onto a straight line (that gives $x$), and the heights are shrunk by $\\cos u$. The construction below does this for a straight line of a photograph.`,
  ideas: [
    'A flat frame is rolled onto the cylinder of radius f: x = f·arctan(x′/f), y = y′·cos u.',
    'Horizontal lines of the photograph become arches; verticals stay vertical; the horizon stays straight.',
    'The camera must turn about the nodal point of the lens, or the join shows parallax.',
    'A full 360° strip is 2π·f wide, so its width in pixels is set by the focal length in pixels.'
  ],
  pitfalls: [
    'A panorama is just photographs placed side by side — Side by side they do not join: the straight horizon of each frame becomes a polygon. Each is rolled onto the cylinder first.',
    'The camera can pivot about its body — Parallax between near and far objects makes the join fail. The lens must pivot about its nodal point.',
    'The cylinder holds the whole sky — It cannot, since the vertical directions run parallel to its axis; the strip is cut at some altitude.'
  ],
  formulas: [
    {
      name: 'A pixel on the cylinder',
      expr: 'x = f*atan(xp/f)',
      tex: 'x = f\\arctan\\frac{x^{\\prime}}{f}',
      vars: { x: { name: 'position on the cylindrical panorama', q: 'length', unit: 'mm', signed: true }, f: { name: 'distance from the lens (radius of the cylinder)', q: 'length', unit: 'mm', value: 60 }, xp: { name: 'position on the flat photograph', q: 'length', unit: 'mm', value: 90, signed: true, tex: 'x^{\\prime}' } },
      note: 'The flat position stretches towards the edge; the cylinder lays the azimuth off as true length.'
    },
    {
      name: 'Focal length in pixels',
      expr: 'fpx = f*Wpx/s',
      tex: 'f_{px} = \\frac{f\\,W_{px}}{s}',
      vars: { fpx: { name: 'focal length in pixels', tex: 'f_{px}' }, f: { name: 'focal length (mm)', q: false, unit: 'mm', value: 24 }, Wpx: { name: 'width of the photograph in pixels', tex: 'W_{px}', value: 6000 }, s: { name: 'width of the sensor (mm)', q: false, unit: 'mm', value: 36 } },
      note: 'Its unit is the pixel: the cylinder\'s radius in the units of the photograph.'
    },
    {
      name: 'Frames needed for the full circle',
      expr: 'n = 2*pi/(alpha*(1 - o))',
      tex: 'n = \\frac{2\\pi}{\\alpha\\,(1 - o)}',
      vars: { n: { name: 'number of frames (round up)' }, alpha: { name: 'horizontal field of view of one frame', q: 'angle', unit: '°', value: 73.7, min: 5, max: 170, tex: '\\alpha' }, o: { name: 'overlap between neighbouring frames', q: 'ratio', unit: '%', value: 30, min: 0, max: 80 } },
      note: 'With 30 % overlap each frame adds only 70 % of its width to the strip.'
    }
  ],
  examples: [
    {
      title: 'A full circle with a 24 mm lens',
      q: 'A camera with a sensor 36 mm wide (6000 pixels across) and a 24 mm lens is held horizontally. How many frames, with 30 % overlap, close the circle, and how wide is the panorama in pixels?',
      steps: [
        { text: 'The focal length in pixels is $f_{px} = 24 \\times 6000/36 = 4000$ and one frame covers $\\alpha = 2\\arctan(18/24) = 73.7°$.', tex: 'f_{px} = 4000,\\quad \\alpha = 73.7°' },
        { text: 'Each new frame adds $0.7 \\times 73.7° = 51.6°$, so', tex: 'n = \\frac{360°}{51.6°} = 6.97\\ \\to\\ 7\\ \\text{frames}' },
        { text: 'The full circle is $2\\pi f_{px}$ pixels wide:', tex: '2\\pi \\times 4000 = 25\\,133\\ \\text{px}' }
      ],
      a: 'Seven frames, and a panorama about 25 100 pixels wide.'
    }
  ],
  quiz: [
    { q: 'When a flat photograph is rolled onto a cylinder, how are the heights of points changed?', choices: ['Not at all', 'They are multiplied by cos u, the cosine of the azimuth of the point', 'They are multiplied by 1/cos u', 'They are rounded off'], a: 1, why: 'The ray to a point at azimuth u is longer by 1/cos u than the one to the centre, so the height on the cylinder is y′·cos u.' },
    { q: 'About which point must a camera be turned to take frames for a panorama?', choices: ['The tripod head', 'The nodal point of the lens (the entrance pupil)', 'The sensor', 'The lens hood'], a: 1, why: 'Only a rotation about the nodal point leaves near and far objects in the same relative positions from frame to frame.' },
    { q: 'A flat photograph with f = 60 mm: a point 60 mm to the right of the centre goes to what position on the cylinder, in mm?', answer: 47.1, unit: 'mm', why: 'x = f·arctan(60/60) = 60 × 0.7854 = 47.1 mm.' },
    { q: 'In the cylindrical panorama a horizontal line of the original photograph becomes an arch.', a: true, why: 'Its points are at heights y′·cos u, higher in the middle, lower towards the sides.' },
    { q: 'About how wide in pixels is a full 360° cylindrical panorama made with a focal length of 2000 pixels?', answer: 12566, why: '2π × 2000 = 12 566 pixels.' }
  ],
  applications: [
    'Stitching software for panoramas and photo-spheres: every frame is rolled onto a cylinder (or a sphere) before it is blended.',
    'Swing-lens and rotating-slit cameras: the film lies on a cylinder, so the picture is cylindrical without any computing.',
    'Panoramic views for real estate and tourism: a 360° strip of a room or a street.',
    'Street-view and mapping vehicles: strips are taken by a row of cameras and joined on a cylinder or a sphere.'
  ],
  history: 'Robert Barker\'s Edinburgh patent of 1787 for "La Nature à coup d\'œil" is the first panorama: a cylindrical picture hung inside a round building. Johann Martens built the first swing-lens panoramic camera, the Megaskop, in 1844, and the Cirkut camera (1904) rotated the whole camera with the film. Apple\'s QuickTime VR (1994 – 95) put the cylindrical panorama on every desktop, with the re-projection described here done by the computer.',
  sources: ['Stephan Oettermann, *The Panorama: History of a Mass Medium* (Zone Books, 1997).', 'Richard Szeliski, *Computer Vision: Algorithms and Applications* (Springer, 2nd ed., 2022), the chapter on image stitching.', 'Shenchang Eric Chen, "QuickTime VR — an image-based approach to virtual environment navigation", *SIGGRAPH 1995*.'],
  sim: 'mp-panorama-strip',
  construction: 'mp-cylinder-from-photo'
},

{
  id: 'barre-flocon-method',
  parent: 'multi-point-perspective',
  title: 'Barre and Flocon\'s method',
  level: 3,
  short: 'Draw the picture of a straight line as an arc of a circle through two opposite points of the rim and one more point: the line\'s vanishing point, or any point of it. For the equidistant picture the arc follows the true curve to about 1 – 2 % of the radius; for the stereographic picture it is exact.',
  keywords: ['Barre', 'Flocon', 'curvilinear', 'arc', 'compass', 'rim', 'vanishing point', 'three points', 'circle', 'La perspective curviligne'],
  prereq: ['five-point-perspective', 'circles-in-perspective'],
  related: ['six-point-perspective', 'curvilinear-perspective', 'equidistant-fisheye', 'stereographic-fisheye', 'math:circles'],
  body: `In a flat picture a ruler draws a straight line of the room between its two vanishing points. In the curved pictures there is no ruler for the job — but there is a compass. Barre and Flocon showed that the picture of a straight line is, to a very good approximation, **an arc of a circle**, and that three points settle which one.

### The rule
Let a line of the room be given, and let $Q$ be the point where it crosses the plane through the eye parallel to the picture plane (the plane $z = 0$ of the frame). The direction of $Q$ from the eye is a point $E$ of the rim: the azimuth of $Q$ in the picture plane. The opposite direction is $E'$. Every picture of a line is a curve through $E$ and $E'$, because the great circle of the line's directions meets the rim circle in a pair of opposite points. The curve needs one more point, the best being the line's own **vanishing point** $V$: if the line makes the angle $\\alpha$ with the picture plane, then $V$ lies at the angle $90° - \\alpha$ from the axis, so at the distance $r_V = f(90° - \\alpha)$ from the centre, in the azimuth of the line's direction. The circle through $E$, $V$ and $E'$ is the answer, and the picture of the line is the part from $E$ to $V$.

### How good is the circle?
For the stereographic picture ($r = 2f\\tan\\theta/2$) it is exact, because the picture sends circles of the sphere to circles. For the equidistant picture ($r = f\\theta$) the greatest gap is about 1 % of the radius of the picture for a line parallel to the picture plane, and under 2 % for a line at 30°; using a point of the line near its middle instead of the vanishing point reduces it to about 1 %. On a drawing 20 cm across that is a line's width.

### The cases
- **A line parallel to the picture plane.** $E$ and $E'$ are $V_L$ and $V_R$ (or $V_U$, $V_D$); the third point is the picture of the point of the line nearest the axis. If the line is at height $y_0$ and depth $z_0$ that point is at $r = f\\arctan(y_0/z_0)$ above or below the centre, and the circle has radius
$$\\rho = \\frac{R^2 + s^2}{2s}, \\qquad s = f\\arctan\\frac{y_0}{z_0},$$
$R$ being the radius of the rim.
- **A line parallel to the axis.** It is a radius: its plane contains the axis.
- **Any other line.** $E$ from the point where it passes the plane of the eye, $V$ from its direction, as above.

### How it is drawn
The compass is set by bisecting two chords: the centre of the circle lies on the perpendicular bisector of $EE'$ (which passes through the centre of the picture) and on the perpendicular bisector of $EV$. The construction below draws a floor edge receding at 30°, and compares it with the exact curve, point by point.`,
  ideas: [
    'The picture of a straight line is, nearly, an arc of a circle through two opposite points E and E′ of the rim and the line\'s vanishing point.',
    'E is the direction of the point where the line crosses the plane of the eye; its vanishing point is at r = f·(90° − α) for a line at angle α to the picture plane.',
    'The arc is exact for the stereographic picture and within 1 – 2 % of the radius for the equidistant one.',
    'The centre of the circle is found by two perpendicular bisectors; the compass does the rest.'
  ],
  pitfalls: [
    'The circle through the vanishing points of a line is the picture of the line — It must pass through E and E′ on the rim; for an oblique line the vanishing point is not enough without the rim pair.',
    'Any three points of the line give the same circle — Only for the stereographic picture. In the equidistant picture, different triples give circles that differ by a percent or two.',
    'Lines parallel to the axis are arcs too — They are radii: straight lines. The only straight lines of the curvilinear picture are the lines through the centre.'
  ],
  formulas: [
    {
      name: 'Radius of the arc through two rim points and the middle',
      expr: 'rho = (R^2 + s^2)/(2*s)',
      tex: '\\rho = \\frac{R^2 + s^2}{2s}',
      vars: { rho: { name: 'radius of the circle to be drawn', q: 'length', unit: 'mm', tex: '\\rho' }, R: { name: 'radius of the picture circle (rim)', q: 'length', unit: 'mm', value: 100 }, s: { name: 'height of the arc\'s middle above the chord (distance from the centre)', q: 'length', unit: 'mm', value: 29.5 } },
      note: 'For a line parallel to the picture plane. The circle passes through the ends of the diameter and the point at distance s from the centre on the perpendicular radius; its centre lies on that radius at ρ − s on the far side.'
    },
    {
      name: 'Distance of the vanishing point from the centre',
      expr: 'rV = f*(pi/2 - alpha)',
      tex: 'r_V = f\\left(\\frac{\\pi}{2} - \\alpha\\right)',
      vars: { rV: { name: 'distance of the vanishing point from the centre', q: 'length', unit: 'mm', tex: 'r_V' }, f: { name: 'scale of the picture', q: 'length', unit: 'mm', value: 63.66 }, alpha: { name: 'angle of the line to the picture plane', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\alpha' } },
      note: 'A line parallel to the picture plane (α = 0) vanishes on the rim; a line along the axis (α = 90°) at the centre.'
    },
    {
      name: 'Azimuth of the rim point E of a floor edge',
      expr: 'phi = atan(y0*tan(alpha)/z0)',
      tex: '\\varphi = \\arctan\\frac{y_0\\tan\\alpha}{z_0}',
      vars: { phi: { name: 'angle of E below the horizon', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi' }, y0: { name: 'depth of the edge below the eye', q: 'length', unit: 'm', value: 1.5 }, alpha: { name: 'angle of the edge to the picture plane', q: 'angle', unit: '°', value: 30, min: 1, max: 89, tex: '\\alpha' }, z0: { name: 'depth of a given point of the edge ahead of the eye', q: 'length', unit: 'm', value: 2.5 } },
      note: 'For a horizontal edge through the point (0, −y₀, z₀) at the angle α to the picture plane: it crosses the plane of the eye at x = −z₀·cot α, so E lies at tan φ = y₀ tan α / z₀ below the horizon.'
    }
  ],
  examples: [
    {
      title: 'The top edge of the far wall',
      q: 'The rim of the picture has radius R = 100 mm (so f = 63.66 mm). The top edge of a far wall 4 m ahead, 2 m above the eye, is parallel to the picture plane. Find the circle that draws it.',
      steps: [
        { text: 'The edge\'s nearest point to the axis is straight above the centre at $\\theta = \\arctan(2/4) = 26.57°$, so $s = f\\theta = 63.66 \\times 0.4636 = 29.5$ mm.', tex: 's = 29.5\\ \\text{mm}' },
        { text: 'Then', tex: '\\rho = \\frac{100^2 + 29.5^2}{2 \\times 29.5} = \\frac{10\\,870}{59.0} = 184.2\\ \\text{mm}' },
        'The centre of the circle is below the centre of the picture, at the distance $\\rho - s = 154.7$ mm on the vertical diameter. Draw the arc through $V_L$, the point 29.5 mm above $O$, and $V_R$.'
      ],
      a: 'A circle of radius 184.2 mm with its centre 154.7 mm below the middle of the picture.'
    },
    {
      title: 'A floor edge receding at 30°',
      q: 'A floor edge lies 1.5 m below the eye and passes through the point 2.5 m ahead of the eye; it recedes to the right at 30° to the picture plane. Place E and the vanishing point on a picture with f = 63.66 mm.',
      steps: [
        { text: 'The edge crosses the plane of the eye at $x = -z_0\\cot 30° = -4.33$ m, 1.5 m below eye level:', tex: '\\varphi = \\arctan\\frac{1.5 \\tan 30°}{2.5} = 19.1°\\ \\text{below the horizon, to the left}' },
        { text: 'The vanishing point is at', tex: 'r_V = 63.66 \\times 60° \\text{ in radians} = 63.66 \\times 1.0472 = 66.7\\ \\text{mm to the right on the horizon}' },
        'Draw the arc through E (on the rim, 19.1° below the horizon on the left), V and the opposite point E′ (19.1° above the horizon on the right); the picture of the edge is the part from E to V.'
      ],
      a: 'E at 19.1° below the left horizon on the rim; V at 66.7 mm right of the centre on the horizon.'
    }
  ],
  quiz: [
    { q: 'Through which points does Barre and Flocon\'s circle for a straight line pass?', choices: ['The centre and the rim', 'Two opposite points of the rim and one more point of the line\'s picture', 'The two vanishing points of the room', 'Any three points of the room'], a: 1, why: 'The great circle of the line meets the rim in two opposite points; one further point (the vanishing point or any point of the line) fixes the circle.' },
    { q: 'For which picture is the circle through three points of a line\'s image exact?', choices: ['The equidistant', 'The stereographic', 'The equisolid', 'The orthographic'], a: 1, why: 'The stereographic projection sends circles of the sphere to circles; the other laws bend them a little.' },
    { q: 'A line parallel to the axis of the picture is drawn as', choices: ['an arc through the two side rim points', 'a radius (a straight line through the centre)', 'a circle about the centre', 'a vertical line'], a: 1, why: 'The plane through the eye and the line contains the axis, so the azimuth is constant along the line.' },
    { q: 'In the example above, what radius (in mm) does the arc for the top edge of the far wall have (R = 100 mm, s = 29.5 mm)?', answer: 184.2, unit: 'mm', why: '(100² + 29.5²)/(2 × 29.5) = 184.2 mm.' },
    { q: 'The picture of a line is only a part of the circle Barre and Flocon draw.', a: true, why: 'From E, where the line passes the plane of the eye, to V, where it vanishes; the rest of the circle lies behind the viewer or beyond the line\'s end.' }
  ],
  applications: [
    'Hand drawing of interiors and landscapes on a hemispherical picture: each straight edge is drawn in a single sweep of the compass.',
    'Teaching curvilinear perspective in art and architecture: the compass construction needs no computation beyond a few angles.',
    'Checking a computer-made fisheye picture: the images of straight lines must pass the three-point test.',
    'Fitting a circle to the curved image of a straight line is the first step of fisheye camera calibration from straight-line images.'
  ],
  history: 'André Barre and Albert Flocon published the method in *La perspective curviligne* (Flammarion, 1968; English translation 1987), after years of working it out. They presented curvilinear perspective as the natural description of visual space, of which the flat perspective of the Renaissance is the special case where the picture surface is a plane. Their book gives the compass construction of the curves and the generalisation to the six-point sphere.',
  sources: ['André Barre and Albert Flocon, *La perspective curviligne* (Flammarion, 1968); *Curvilinear Perspective: From Visual Space to the Constructed Image* (University of California Press, 1987).', 'Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).'],
  sim: 'mp-arc-approximation',
  construction: 'mp-curved-edge'
},

{
  id: 'escher-and-curved-space',
  parent: 'multi-point-perspective',
  title: 'Escher and curved pictures',
  level: 3,
  short: 'Three kinds of curved picture in the work of M. C. Escher: the room in a mirror ball (an equisolid-angle picture of the whole sphere, r = a·sin θ′/2), the bulging town of Balcony (a fisheye), and the Print Gallery, whose picture contains itself and is a square lattice wrapped by a complex exponential.',
  keywords: ['Escher', 'Hand with Reflecting Sphere', 'Print Gallery', 'Balcony', 'mirror ball', 'Droste effect', 'conformal', 'logarithmic spiral', 'Lenstra', 'de Smit'],
  prereq: ['five-point-perspective', 'six-point-perspective', 'curvilinear-perspective'],
  related: ['mirror-anamorphosis', 'equisolid-fisheye', 'stereographic-fisheye', 'anamorphosis', 'math:complex-plane'],
  body: `Escher is the draughtsman who made curved space visible, and each of his best-known curved pictures belongs to a different member of this family.

### The mirror ball (*Hand with Reflecting Sphere*, 1935)
A ball of radius $a$ photographed from far away is an orthographic picture of its surface, and each point of the surface shows the room in a certain direction. A ray from the eye reaching the ball at the point whose radius makes the angle $\\beta$ with the line of sight is turned by $2\\beta$. So a point of the room in the direction $\\theta'$ from the line towards the viewer appears at $\\beta = \\theta'/2$, at the distance
$$r = a\\sin\\frac{\\theta'}{2}$$
from the centre of the picture. This is the **equisolid-angle** law with $f = a/2$ ([[equisolid-fisheye]]): equal solid angles of the room are equal areas of the ball. The centre shows the viewer (θ′ = 0), the rim shows the room straight behind the ball (θ′ = 180°), and the half of the room that lies behind the ball, as seen from the viewer, is squeezed into the outer ring between $0.707a$ and $a$. Escher drew his study from a reflecting glass ball held in his hand.

### The bulge (*Balcony*, 1945)
The middle of the lithograph swells like a view through a magnifying fish-eye lens: the houses in the centre are drawn on a bulge and their straight lines curve outwards. It is a curved, fisheye-like picture, drawn by Escher\'s own construction rather than by any of the standard laws.

### The Print Gallery (1956)
A man looks at a print in a gallery, and the print shows the town, and the town contains the gallery with the man in it. Escher built the picture on a bent grid, a square lattice whose cells shrink and turn as they spiral inwards. In the plane of $\\zeta = s + it$ that is a square lattice wrapped by
$$w = \\exp\\big((1 + i\\kappa)\\,\\zeta\\big).$$
The map is **conformal**: every small square stays square (angles are kept), but each ring of cells is smaller than the last by a fixed factor and turned by a fixed angle, so the cells spiral into the middle. One turn about the centre shrinks the picture by $e^{2\\pi\\kappa}$; for $\\kappa = 1/2$ that is $e^\\pi \\approx 23$. Hendrik Lenstra and Bart de Smit worked out the transformation that Escher had drawn by hand; the blank disc at the centre, where Escher put his signature, marks the place where the lattice shrinks without limit, and they filled it in by computation.

### How it is drawn
The mirror ball is drawn by bisecting angles: the bisector of the angle between the line to the eye and the line to a point of the room meets the ball where that point is seen, and the picture is the foot of the perpendicular on the diameter. The construction below does that, and the simulation lets you wrap the lattice.`,
  ideas: [
    'A mirror ball is an equisolid-angle picture of the whole sphere: r = a·sin(θ′/2), θ′ measured from the direction towards the viewer.',
    'The viewer is at the centre of the ball\'s picture and the room straight behind is the rim; the whole back half of the room fills the outer ring.',
    'The Print Gallery is a square lattice wrapped by w = exp((1 + iκ)ζ): conformal, each ring smaller and turned.',
    'One turn about the centre shrinks the lattice by e^(2πκ); for κ = 1/2 that is about 23.'
  ],
  pitfalls: [
    'A mirror ball shows the room as an ordinary camera standing at the ball would — It shows a very wide view centred on the direction back to the viewer: the viewer himself is in the middle and everything straight behind the ball is the rim.',
    'Escher invented a new geometry — He drew with geometry that is standard in conformal mapping; the Print Gallery is a conformal map of a lattice, and its self-reference comes from the logarithmic spiral.',
    'The blank disc in the middle of the Print Gallery is a mistake — It is the place where the lattice shrinks to nothing; Escher filled it with a blank disc carrying his signature.'
  ],
  formulas: [
    {
      name: 'Image radius on a mirror ball',
      expr: 'r = a*sin(theta/2)',
      tex: 'r = a\\sin\\frac{\\theta^{\\prime}}{2}',
      vars: { r: { name: 'distance of the image from the centre of the ball\'s picture', q: 'length', unit: 'mm' }, a: { name: 'radius of the ball', q: 'length', unit: 'mm', value: 50 }, theta: { name: 'direction of the object, measured from the direction towards the viewer', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta^{\\prime}' } },
      note: 'The viewer is at 0 (the centre of the picture); the point straight behind the ball is at 180° (the rim).'
    },
    {
      name: 'Shrinkage of the lattice in one turn',
      expr: 's = exp(2*pi*kappa)',
      tex: 's = e^{2\\pi\\kappa}',
      vars: { s: { name: 'factor by which one turn about the centre scales the picture' }, kappa: { name: 'twist', value: 0.5, min: 0, max: 2, tex: '\\kappa' } },
      note: 'For κ = 1/2, 23.1; for κ = 1/3, 8.1; for κ = 1, 535. The picture\'s ring-to-ring shrinkage is the same for each cell step.'
    }
  ],
  examples: [
    {
      title: 'Where the room appears in a 50 mm ball',
      q: 'A mirror ball of radius a = 50 mm is photographed from far away. How far from the centre of the picture do objects appear that are at 90° and at 135° from the line to the camera, and what fraction of the picture\'s area does the hemisphere behind the ball fill?',
      steps: [
        { text: 'With $r = a\\sin(\\theta\'/2)$:', tex: 'r_{90°} = 50\\sin 45° = 35.4\\ \\text{mm},\\qquad r_{135°} = 50\\sin 67.5° = 46.2\\ \\text{mm}' },
        'The hemisphere behind the ball is θ′ from 90° to 180°: the ring between 35.4 mm and the rim at 50 mm.',
        { text: 'Its area as a fraction of the disc:', tex: '1 - \\left(\\frac{35.4}{50}\\right)^2 = 1 - 0.5 = 0.5' }
      ],
      a: '35.4 mm and 46.2 mm; the back half of the room fills exactly half of the disc (the picture keeps areas).'
    },
    {
      title: 'The shrinking spiral',
      q: 'In the lattice w = exp((1 + iκ)ζ) with κ = 1/2, by what factor does the picture shrink in one full turn about the centre, and how many ring steps make one turn if there are 20 cells round the circle?',
      steps: [
        { text: 'One turn is $\\Delta t = 2\\pi$ along the spiral: the modulus changes by', tex: 'e^{-2\\pi\\kappa} = e^{-\\pi} = 0.043,\\ \\text{i.e. smaller by } e^{\\pi} = 23.1' },
        'A cell step in $s$ of $2\\pi/20 = 0.314$ shrinks by $e^{-0.314} = 0.73$ (each ring is 73 % of the last), so one turn of the spiral passes about ten ring steps: $\\pi/0.314 = 10$.'
      ],
      a: 'The picture shrinks by about 23 in one turn; about ten ring steps make one turn.'
    }
  ],
  quiz: [
    { q: 'In a photograph of a mirror ball taken from far away, the viewer is seen', choices: ['at the rim', 'at the centre', 'half-way out', 'not at all'], a: 1, why: 'θ′ = 0 gives r = a·sin 0 = 0: the line of sight through the ball\'s centre reflects straight back to the viewer.' },
    { q: 'How far from the centre of a ball of radius 100 mm does an object at 90° to the line to the viewer appear, in mm?', answer: 70.7, unit: 'mm', why: 'r = a·sin(45°) = 100 × 0.7071 = 70.7 mm.' },
    { q: 'The back half of the room (the hemisphere straight behind the ball) fills what fraction of the picture of the ball?', choices: ['One quarter', 'One half', 'One tenth', 'Three quarters'], a: 1, why: 'The mapping is equal-area; half of the sphere of directions is half of the disc.' },
    { q: 'The transformation w = exp((1 + iκ)ζ) turns a square lattice into', choices: ['a lattice of rectangles', 'a spiral of squares', 'a set of straight rays', 'a circle'], a: 1, why: 'The exponential is conformal, so it keeps squares square; with κ ≠ 0 the rows and columns become logarithmic spirals.' },
    { q: 'In the Print Gallery lattice with κ = 1/2, how large is the factor of shrinkage per turn?', answer: 23.1, why: 'e^(2π · 1/2) = e^π = 23.1.' }
  ],
  applications: [
    'Photographic light probes: a chrome ball photographed in a scene records the whole lighting environment, which film and game studios use to light computer-generated objects.',
    'Product and film photography reflections: the same law tells where a studio light appears on a spherical or cylindrical object.',
    'Droste-effect graphics and self-similar logos: the spiral lattice is the standard way to make a picture that contains itself.',
    'Teaching conformal maps: the exponential map of a lattice is the simplest picture of how a complex function bends the plane while keeping angles.'
  ],
  history: 'Escher drew his *Hand with Reflecting Sphere* in 1935 from a glass ball held in his hand; *Balcony* followed in 1945 and the *Print Gallery* in 1956. The Print Gallery\'s construction was a puzzle for decades, until the Leiden mathematicians Hendrik Lenstra and Bart de Smit analysed the picture in 2002 – 03, showing that Escher had drawn a conformal image of a lattice and completing the blank centre by computation (*The Mathematical Structure of Escher\'s Print Gallery*, Notices of the AMS, 2003).',
  sources: ['Bruno Ernst, *The Magic Mirror of M. C. Escher* (Taschen, 1976).', 'Bart de Smit and Hendrik W. Lenstra Jr., "The mathematical structure of Escher\'s Print Gallery", *Notices of the American Mathematical Society* 50 (2003).', 'Barre and Flocon, *Curvilinear Perspective* (University of California Press, 1987).'],
  sim: 'mp-escher-grid',
  construction: 'mp-mirror-ball'
},

{
  id: 'wide-angle-and-the-limits-of-the-plane',
  parent: 'multi-point-perspective',
  title: 'Why a flat picture cannot show 180°',
  level: 2,
  short: 'On a flat picture a ray at the angle θ from the axis lands at r = f·tan θ: the spacing of equal angles grows without limit, the ray at 90° never arrives, and near the edge every sphere is stretched along the radius by sec² θ and across it by sec θ. Curved pictures are the cure.',
  keywords: ['wide angle', 'tangent', 'stretching', 'edge distortion', 'sec', 'rectilinear', 'limit', 'Panini', 'perspective distortion', '180 degrees'],
  prereq: ['field-of-view-and-focal-length', 'vanishing-points', 'curvilinear-perspective'],
  related: ['rectilinear-lens', 'cylindrical-panoramas', 'fisheye-projections', 'photography-lenses-and-projections', 'foreshortening'],
  body: `Put the picture plane at distance $f$ from the eye and send a ray at the angle $\\theta$ from the axis. It meets the plane at the distance
$$r = f\\tan\\theta$$
from the foot of the axis. This one equation is the whole story of why a flat picture cannot take in the world.

### Equal angles, unequal lengths
Near the axis $\\tan\\theta \\approx \\theta$ and the picture is as honest as a protractor. But the tangent grows ever faster: steps of $15°$ land $0.27f,\\ 0.31f,\\ 0.42f,\\ 0.73f,\\ 2.0f$ apart as $\\theta$ goes from 0 to 75°. At $\\theta = 90°$ the ray runs parallel to the plane and never meets it. To show a field of view $2\\theta$ the plane must be $2f\\tan\\theta$ wide: $2.4f$ for 100°, $23f$ for 170°, infinite for 180°.

### How things are stretched
A small sphere of directions at the angle $\\theta$ off the axis is drawn as an ellipse. Along the radius the scale is $\\mathrm{d}r/\\mathrm{d}\\theta = f\\sec^2\\theta$; across it it is $r/\\sin\\theta = f\\sec\\theta$; the area scale is the product, $f^2\\sec^3\\theta$. At 42° (the corner of a 24 mm lens on full frame) a ball is stretched 1.8 times along the radius and 1.35 times across, with 2.4 times the area; at 57° (a 14 mm lens) 3.4 and 1.8 times, with 6.2 times the area; at 75° 15 and 3.9 times with 58 times the area. This is the familiar swollen head at the edge of a wide-angle group photograph. The picture is not wrong: it is the correct shadow of the ball on a plane that cuts the ray very obliquely.

### The cures
- A **curved picture surface**: a cylinder or a sphere. The cylinder keeps horizontal angles true (x = fλ) and verticals vertical; the sphere keeps everything but straightness ([[curvilinear-perspective]]).
- A **compromise projection**: the *Panini* projection first rolls the picture onto a cylinder and then projects it on to a flat sheet from a point behind the centre. It keeps verticals vertical and the straight lines through the centre straight, and spares the faces at the sides; it is named after Giovanni Paolo Pannini, whose painted views of vast Roman interiors look this way.
- **Cropping**: a rectilinear picture is acceptable up to some 90° and the photographer stays well below the limit.

### How it is drawn
Mark the eye O, the axis, and a tangent line at distance $f$. Lay off $15°$, $30°$ … from the axis with a protractor, draw the rays to the line, and measure the gaps between marks: they grow. The construction below does it, and draws the circle of radius $f$ round the eye for comparison, on which equal angles are equal arcs.`,
  ideas: [
    'On a flat picture r = f·tan θ: equal angles are spread over longer and longer lengths, and the ray at 90° never meets the plane.',
    'The width of picture needed for a field 2θ is 2f·tan θ: 2.4 f for 100°, 23 f for 170°, infinite for 180°.',
    'Near the edge a ball becomes an ellipse stretched along the radius by sec²θ and across by sec θ; its area grows as sec³θ.',
    'The cures are a curved picture surface, a compromise projection such as the Panini, or staying below about 90°.'
  ],
  pitfalls: [
    'The stretched faces at the edge of a wide-angle photograph show the lens is bad — The geometry of a flat picture does it, in a perfect lens too. A fisheye does not have the effect, but gives up straight lines.',
    'A wider lens has more perspective — Perspective comes only from the position of the eye. A wider lens only shows a larger part of the same view and stretches its edge.',
    'You can fix the stretch by making the picture bigger — A bigger picture shows more of the sky, with an even greater stretch at its edge.'
  ],
  formulas: [
    {
      name: 'Distance of a ray\'s mark from the axis',
      expr: 'r = f*tan(theta)',
      tex: 'r = f\\tan\\theta',
      vars: { r: { name: 'distance from the foot of the axis on the picture plane', q: 'length', unit: 'mm' }, f: { name: 'distance of the picture plane from the eye', q: 'length', unit: 'mm', value: 60 }, theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\theta' } },
      note: 'At 60° the mark is 1.73 f from the axis; at 89° it is 57 f.'
    },
    {
      name: 'Stretch along the radius',
      expr: 'kr = 1/cos(theta)^2',
      tex: 'k_r = \\frac{1}{\\cos^2\\theta}',
      vars: { kr: { name: 'stretch of a small ball along the radius, relative to the centre', tex: 'k_r' }, theta: { name: 'angle off the axis', q: 'angle', unit: '°', value: 57, min: 0, max: 89, tex: '\\theta' } },
      note: 'This is dr/dθ divided by f. At 45° the radial stretch is 2; at 60° it is 4.'
    },
    {
      name: 'Stretch across the radius',
      expr: 'kt = 1/cos(theta)',
      tex: 'k_t = \\frac{1}{\\cos\\theta}',
      vars: { kt: { name: 'stretch of a small ball across the radius, relative to the centre', tex: 'k_t' }, theta: { name: 'angle off the axis', q: 'angle', unit: '°', value: 57, min: 0, max: 89, tex: '\\theta' } },
      note: 'The tangential scale r/sin θ divided by f. The ratio k_r/k_t = sec θ is how elongated a ball is.'
    },
    {
      name: 'Width of picture for a given field of view',
      expr: 'w = 2*f*tan(alpha/2)',
      tex: 'w = 2f\\tan\\frac{\\alpha}{2}',
      vars: { w: { name: 'width of the picture plane needed', q: 'length', unit: 'mm' }, f: { name: 'distance of the picture plane from the eye', q: 'length', unit: 'mm', value: 24 }, alpha: { name: 'field of view', q: 'angle', unit: '°', value: 100, min: 5, max: 178, tex: '\\alpha' } },
      note: 'Fails at 180°: w grows without limit as the field of view approaches it.'
    }
  ],
  examples: [
    {
      title: 'The corner of a wide-angle photograph',
      q: 'A 14 mm rectilinear lens on a full-frame camera (36 × 24 mm). At what angle from the axis is the corner of the picture, and by how much is a ball in the corner stretched along the radius, across it, and in area, compared with one at the centre?',
      steps: [
        { text: 'The half-diagonal of the sensor is $\\sqrt{18^2 + 12^2} = 21.63$ mm, so', tex: '\\tan\\theta = 21.63/14 = 1.545\\ \\Rightarrow\\ \\theta = 57.1°\\ (\\text{diagonal field } 114°)' },
        { text: 'The stretches are', tex: 'k_r = \\sec^2 57.1° = 3.4,\\quad k_t = \\sec 57.1° = 1.84,\\quad k_r k_t = 6.2' },
        'A round head in the corner becomes an ellipse 3.4 : 1.84 = 1.84 times longer along the radius than across it, and has more than six times the area of the same head at the centre.'
      ],
      a: '57.1° from the axis; a ball is stretched 3.4 times along the radius, 1.84 across, 6.2 times in area.'
    },
    {
      title: 'How wide must the plane be?',
      q: 'How wide is the picture plane for a 160° field of view at a distance of 24 mm, and for 100°?',
      steps: [
        { text: 'Use $w = 2f\\tan(\\alpha/2)$:', tex: '160°:\\ 2 \\times 24 \\times \\tan 80° = 272\\ \\text{mm},\\qquad 100°:\\ 2 \\times 24 \\times \\tan 50° = 57.2\\ \\text{mm}' },
        'Taking in 60° more of the world made the picture 4.8 times wider, and it would be twice as wide again at 170°.'
      ],
      a: '272 mm for 160°, 57.2 mm for 100°.'
    }
  ],
  quiz: [
    { q: 'On a flat picture at distance f, a ray 45° off the axis lands at', choices: ['0.5 f', 'f', '1.5 f', '2 f'], a: 1, why: 'r = f·tan 45° = f.' },
    { q: 'How wide must a flat picture be to show 120°, in units of the distance f from the eye?', answer: 3.46, why: 'w = 2f·tan 60° = 3.46 f.' },
    { q: 'Wide-angle lenses make people at the edge of the group look broad because', choices: ['the lens is faulty', 'the flat picture stretches the edge, by sec θ across the radius and sec²θ along it', 'the people are nearer the lens', 'perspective is stronger with a wider lens'], a: 1, why: 'The stretch is a property of a flat picture, not of any particular lens: it follows from r = f·tan θ.' },
    { q: 'A flat picture of a perfectly good lens can show a full 180° field of view if the sensor is large enough.', a: false, why: 'The ray at 90° runs parallel to the sensor and never meets it; the width required becomes infinite.' },
    { q: 'By what factor is a ball stretched along the radius at 60° off the axis?', answer: 4, why: 'sec²60° = 1/cos²60° = 1/0.25 = 4.' }
  ],
  applications: [
    'Choosing a lens: the photographer knows the 24 mm and wider rectilinear lenses stretch their corners, and keeps people away from the edge.',
    'Architectural photography: wide rectilinear lenses with shift keep verticals vertical, at the price of the stretched edges.',
    'Panorama and real-estate software offers cylindrical, Panini and stereographic projections to hide the stretching of wide views.',
    'Virtual-reality headsets render two rectilinear pictures of roughly 100° each and warp them for the lenses of the headset.'
  ],
  history: 'The stretching of wide pictures was noticed as soon as wide-angle lenses were made: the Goerz Hypergon of 1900, designed by Emil von Höegh, covered a field of about 135° on the plate. In painting, Giovanni Paolo Pannini (1691 – 1765) set the way for a compressed wide view in his views of Roman interiors, and the Panini projection of computer graphics, described by Sharpless, Postle and German in 2010, is named after him. The fisheye of Robert W. Wood (1906) and Robert Hill (1924) took the opposite course: accept the curvature of lines and keep the angle.',
  sources: ['Sidney F. Ray, *Applied Photographic Optics* (3rd ed., Focal Press, 2002), the chapters on wide-angle lenses and distortion.', 'Thomas K. Sharpless, Bruno Postle and Daniel M. German, "Pannini: a new projection for rendering wide angle perspective images", *Computational Aesthetics in Graphics, Visualization and Imaging* (2010).', 'Martin Kemp, *The Science of Art* (Yale University Press, 1990), on the angle of vision in perspective.'],
  sim: 'mp-wide-angle-stretch',
  construction: 'mp-tangent-scale'
}
);
