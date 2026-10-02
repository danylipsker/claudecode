/* HYPER-PROJECTIONS · content/what-projection-is.js — the topic "What a projection is":
 * projectors and the picture plane, parallel against central, flat against curved pictures, the family tree,
 * what is preserved, true length and true shape. Constructions in constructions/what-projection-is.js (wp-…),
 * simulations in sims/what-projection-is.js. */
Hyper.add(
{
  id: 'what-is-a-projection',
  parent: 'what-projection-is',
  title: 'What a projection is',
  level: 1,
  short: 'A rule that sends every point of space, along a line, to a point of a picture. A shadow, a photograph, an engineer\'s view, a perspective painting and a map are all projections, and every one of them loses something.',
  keywords: ['projection', 'shadow', 'projector', 'picture plane', 'image', 'depth', 'drawing', 'perspective', 'orthographic', 'map'],
  prereq: ['math:plane-geometry', 'math:similar-triangles', 'math:vectors'],
  related: ['projectors-and-picture-plane', 'parallel-vs-central', 'taxonomy-of-projections', 'what-projections-preserve', 'the-projection-matrix', 'homogeneous-coordinates'],
  body: `Hold a pencil between a lamp and the wall: its shadow is a picture of the pencil. Every point of the pencil has a point of the shadow, found by following a straight ray from the lamp through the point until it meets the wall. That is the whole idea of a **projection**: a rule that sends each point of space, along a line, to a point of a surface, the **picture**. A photograph, an engineer's drawing, a perspective painting, an X-ray, an atlas map and a star chart are all made by rules of this kind. They differ in which lines are used and in what surface receives the picture.

### The three ingredients
- **The thing**: points in three-dimensional space (a house, the Earth, the stars).
- **The picture surface**: usually a plane, the **picture plane**, but it may be a cylinder or a sphere.
- **The projectors**: one straight line through each point of the thing, chosen by a rule. Where a projector meets the picture surface is the **image** of the point.

Two rules cover most of this app. In **central** projection all the projectors pass through one point, the **centre** (the eye, the lamp). In **parallel** projection they are all parallel, as if the centre were infinitely far away, as it nearly is for the sun.

### What it looks like in numbers
Put the picture plane at distance $d$ from the centre. Measure a point by its sideways distance $x$ and its distance $z$ from the centre along the axis. Similar triangles give its image,
$$x' = \\frac{d\\,x}{z}\\quad\\text{(central)},\\qquad x' = x\\quad\\text{(parallel, perpendicular to the plane)}.$$
In the first the image shrinks as the point moves away; in the second it does not. Both are special cases of one $4\\times 4$ matrix acting on $(x, y, z, 1)$; see [[the-projection-matrix]].

### What every projection loses
A projector is a whole line of points that all land on the same spot, so **depth is lost**. From the image alone you cannot say whether a point is near or far, and the rule cannot be run backwards. That is why one orthographic view of a part is never enough, why a painter adds shrinking, overlap and shading to suggest depth, and why the map of a sphere must give up something else (areas, angles or distances). What a given projection keeps in exchange is the subject of [[what-projections-preserve]].

### How it is drawn
You can make a projection with your hands: two pins in a board, one for the point and one for the centre (or a direction), and a stretched thread. The construction below does exactly this, in side view, for a point and a segment, once with parallel projectors and once with projectors through a centre.

> [!tip] A good test of any picture: ask which line carried each point onto the sheet. If you can name the rule, you can often undo some of the damage.`,
  ideas: [
    'A projection sends each point of space along a line (its projector) to a point of a picture surface.',
    'In central projection the projectors meet in one centre; in parallel projection they are all parallel, as if the centre were at infinity.',
    'All the points of one projector have the same image, so depth is lost and the object cannot be recovered from one picture alone.',
    'Shadows, photographs, engineering views, perspective paintings and maps are all projections; they differ in the rule and in the surface.'
  ],
  pitfalls: [
    'A projection is the same as a photograph — A photograph is one kind (central projection onto a plane, through a lens). An engineering view or a map is a projection too, with other rules.',
    'The picture shows what the object is — It shows only what the projectors leave. One image fits infinitely many objects, which is why a single view is ambiguous.',
    'Parallel projection is a different kind of thing from central projection — It is the limit of central projection when the centre goes to infinity (see [[parallel-vs-central]]).'
  ],
  formulas: [
    {
      name: 'Image of a point in central projection',
      expr: 'xp = d*x/z',
      tex: "x' = \\frac{d\\,x}{z}",
      vars: {
        xp: { name: 'position of the image on the picture plane', q: 'length', unit: 'mm', tex: "x'" },
        d: { name: 'distance from the centre to the picture plane', q: 'length', unit: 'mm', value: 50 },
        x: { name: 'sideways distance of the point from the axis', q: 'length', unit: 'm', value: 0.9 },
        z: { name: 'distance of the point from the centre, along the axis', q: 'length', unit: 'm', value: 5 }
      },
      solveFor: 'xp',
      note: 'Similar triangles. Double the distance and the image halves; the picture of a far thing is small. The image is upside down if the plane is behind the centre (a pinhole camera).',
      stories: { xp: 'A point {x} from the axis is {z} from the centre of projection. The picture plane is {d} from the centre. How far from the axis is its image?' }
    },
    {
      name: 'Length of the parallel image of a segment',
      expr: 'p = L*cos(theta)',
      tex: 'p = L\\cos\\theta',
      vars: {
        p: { name: 'length of the image', q: 'length', unit: 'm' },
        L: { name: 'true length of the segment', q: 'length', unit: 'm', value: 2 },
        theta: { name: 'angle between the segment and the picture plane', q: 'angle', unit: '°', value: 60, min: 0, max: 90 }
      },
      note: 'Projectors perpendicular to the plane. A segment parallel to the plane (θ = 0) keeps its length; one along the projectors (θ = 90°) is a point.'
    }
  ],
  examples: [
    {
      title: 'A person in a pinhole camera',
      q: 'A pinhole camera is a box with a small hole in the front and a back wall 50 mm behind the hole. A person 1.8 m tall stands 5 m from the hole, feet on the axis. How tall is the image on the back wall, and which way up?',
      steps: [
        'The hole is the centre, the back wall is the picture plane at $d = 50$ mm. The head is $x = 1.8$ m from the axis at distance $z = 5$ m.',
        { text: 'Similar triangles:', tex: "x' = \\frac{d\\,x}{z} = 50\\ \\text{mm}\\times\\frac{1.8}{5} = 18\\ \\text{mm}" },
        'The plane is behind the centre, so the projector continues through the hole and ends on the other side of the axis: the image is upside down.'
      ],
      a: '18 mm tall, inverted.'
    },
    {
      title: 'The shadow of a tilted rod',
      q: 'A rod 2 m long is held at 60° to a wall and the sun stands in front of the wall so that its rays are perpendicular to it. How long is the shadow on the wall? And if the rod is held parallel to the wall?',
      steps: [
        'The rays are parallel and perpendicular to the plane: an orthographic projection.',
        { text: 'A segment at angle $\\theta$ to the plane is multiplied by $\\cos\\theta$:', tex: 'p = 2\\ \\text{m}\\times\\cos 60° = 1\\ \\text{m}' },
        'Held parallel to the wall, $\\theta = 0$ and $\\cos\\theta = 1$: the shadow is the full 2 m.'
      ],
      a: '1 m at 60°; 2 m when parallel to the wall.'
    }
  ],
  quiz: [
    { q: 'What do all the points of one projector have in common?', choices: ['The same colour', 'The same image point', 'The same distance from the centre', 'Nothing in particular'], a: 1, why: 'The projector is the line that carries a point to the picture; every point on it lands where the line meets the picture surface.' },
    { q: 'A parallel projection is a central projection whose centre is at infinity.', a: true, why: 'Lines from a very distant centre are nearly parallel, and in the limit exactly so. The sun is the everyday example.' },
    { q: 'Central projection onto a plane 40 mm from the centre: how many millimetres tall is the image of a 2 m object 10 m away?', answer: 8, unit: 'mm', why: "$x' = d\\,x/z = 40 \\times 2/10 = 8$ mm." },
    { q: 'Why can a single orthographic view not describe a part completely?', choices: ['Because it is always distorted', 'Because depth is lost: the points of a projector coincide', 'Because it is too small', 'Because parallel lines stay parallel'], a: 1, why: 'Distances along the projectors are not recorded, so one view fits many different parts. Two or three views are needed.' }
  ],
  applications: [
    'Shadows and sundials: the sun is a very distant centre, so the shadow of a pointer on a dial is a parallel projection.',
    'Cameras and the eye: a lens or a pinhole makes a central projection of the scene onto a sensor or a retina.',
    'Engineering drawing: parallel projectors perpendicular to the sheet give the views from which a part is made.',
    'X-rays: a point source, the body as the thing and the film as the picture plane make a central projection of density.',
    'Maps and star charts: the Earth or the sky projected onto a plane, a cylinder or a cone.'
  ],
  history: 'Euclid\'s *Optics* (about 300 BC) already treated sight as straight lines from the eye to the points seen, and Vitruvius distinguished three kinds of drawing of a building: plan, elevation and the perspective "scene". The geometry of projecting one figure onto another became a theory in the 17th century with Desargues and Pascal, and in the 19th with Poncelet (projective geometry), while Monge turned parallel projection onto two planes into descriptive geometry in the 1790s.',
  sources: ['Euclid, *Optics* (about 300 BC): the definitions of the visual rays.', 'Vitruvius, *De architectura*, Book I, chapter 2: the three kinds of drawing.', 'Martin Kemp, *The Science of Art* (1990): the geometry of vision and of picture-making.', 'ISO 5456-1, Technical drawings — Projection methods — Part 1: Synopsis.'],
  sim: 'wp-projection-room',
  construction: 'wp-projectors'
},

{
  id: 'projectors-and-picture-plane',
  parent: 'what-projection-is',
  title: 'Projectors, the picture plane and the centre',
  level: 1,
  short: 'The projectors carry the points to the picture, the picture plane receives them, and in central projection the projectors meet in the centre. Sliding the plane only rescales a central picture and only moves a parallel one; tilting it changes the picture.',
  keywords: ['projector', 'picture plane', 'centre of projection', 'principal axis', 'station point', 'window', 'image', 'focal length', 'pinhole', 'Alberti'],
  prereq: ['what-is-a-projection', 'math:similar-triangles'],
  related: ['parallel-vs-central', 'central-projection', 'the-projection-matrix', 'alberti-window', 'durer-devices', 'the-camera-model'],
  body: `Four words name every projection. The **projector** is the line that carries a point of the object to the picture. The **picture plane** is the surface that receives the picture. In central projection the projectors meet in the **centre of projection** (the eye, the lamp, the optical centre of a lens). The **image** of a point is where its projector meets the picture plane. The perpendicular from the centre to the plane is the **principal axis**; its length is the **distance** $d$ (in a camera, the focal length), and its foot is the **principal point**, the one place where the picture is exactly in front of the centre.

### Where is the plane?
There are three arrangements of centre, plane and object, and they make three different pictures:
- **Plane between the eye and the object** (Alberti's window): the picture is upright and smaller than the object. This is the painter's case.
- **Object between the centre and the plane** (a shadow, a slide projector): the picture is larger.
- **Centre between the object and the plane** (the pinhole camera): the picture is upside down.

Slide the plane parallel to itself and every central picture is **scaled** by the ratio of the distances, nothing else. The shape does not change. That is why a perspective is defined only up to scale, and why a painter may trace on a pane at any distance.

For parallel projectors the same slide only **moves** the picture. But tilting the plane changes the picture: the image on a tilted plane is the first one stretched in one direction (see [[true-length-and-true-shape]]). Oblique projectors displace a point sideways by an amount proportional to its depth behind the plane.

### The matrix
Put the eye at the origin looking along $-z$ and the plane at $z = -d$. A point $(x, y, z)$ goes to
$$\\begin{bmatrix} x' \\\\ y' \\\\ z' \\\\ w' \\end{bmatrix} = \\begin{bmatrix} d & 0 & 0 & 0 \\\\ 0 & d & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & -1 & 0 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix},\\qquad \\left(\\frac{x'}{w'}, \\frac{y'}{w'}\\right) = \\left(\\frac{d\\,x}{-z}, \\frac{d\\,y}{-z}\\right).$$
The first two rows scale by $d$; the last row copies $-z$ into $w'$, and dividing by $w'$ is what makes far things small. A point behind the eye ($z > 0$) would get a negative $w'$ and a nonsense image: only points in front of the centre have pictures.

### How it is drawn
Look at the plane edge-on, from the side: it is a line, and the whole projection is two or three straight lines on the page. The construction does this for a segment, first with parallel projectors, then through a centre.`,
  ideas: [
    'The projector carries a point to the picture; the picture plane receives it; the centre is where central projectors meet; the distance d from centre to plane sets the scale.',
    'Sliding the plane parallel to itself rescales a central picture and merely moves a parallel one; the shape does not change.',
    'With the plane between eye and object the picture is upright and smaller; with the centre between, it is inverted (pinhole).',
    'In the 4 × 4 matrix the last row copies −z into w; the division by w shrinks the far things.'
  ],
  pitfalls: [
    'Moving the picture plane changes the perspective — Only the size changes. A different shape needs a different centre (a different station point).',
    'The image is on the object — The image is on the plane; where the projector meets it. A point and its image are generally far apart.',
    'Points behind the eye also get a picture — Their projectors meet the plane on the wrong side and the arithmetic gives a negative w; cameras and renderers cut them off (see the near plane).'
  ],
  formulas: [
    {
      name: 'Height traced on a window',
      expr: 'hp = H*dw/z',
      tex: 'h_p = \\frac{H\\,d_w}{z}',
      vars: {
        hp: { name: 'height of the tracing on the pane', q: 'length', unit: 'mm', tex: 'h_p' },
        H: { name: 'real height of the object', q: 'length', unit: 'm', value: 12 },
        dw: { name: 'distance from the eye to the pane', q: 'length', unit: 'm', value: 0.6, tex: 'd_w' },
        z: { name: 'distance from the eye to the object', q: 'length', unit: 'm', value: 80 }
      },
      solveFor: 'hp',
      note: 'Alberti\'s window. Half the distance to the pane, half the tracing; twice as far away, half as big.',
      stories: { hp: 'You trace a {H} tall tree that is {z} away on a pane {dw} from your eye. How tall is the tracing?' }
    },
    {
      name: 'Sideways shift under oblique projectors',
      expr: 'sh = zd*tan(psi)',
      tex: 's = z_d\\tan\\psi',
      vars: {
        sh: { name: 'shift of the image from the orthographic image', q: 'length', unit: 'mm', tex: 's' },
        zd: { name: 'depth of the point behind the plane', q: 'length', unit: 'mm', value: 40, tex: 'z_d' },
        psi: { name: 'angle between the projectors and the normal to the plane', q: 'angle', unit: '°', value: 35, min: 0, max: 89, tex: '\\psi' }
      },
      note: 'At ψ = 0 the projectors are perpendicular and there is no shift. At 45° the shift equals the depth: the cavalier projection.'
    }
  ],
  examples: [
    {
      title: 'Tracing a tree on a window',
      q: 'You stand 0.6 m from a window pane and trace a tree 12 m tall that stands 80 m away. How tall is the tracing? What if you step back to 1.2 m from the pane?',
      steps: [
        { text: 'The eye is the centre, the glass the picture plane:', tex: 'h_p = \\frac{H\\,d_w}{z} = \\frac{12 \\times 0.6}{80}\\ \\text{m} = 0.09\\ \\text{m} = 90\\ \\text{mm}' },
        'Standing at 1.2 m doubles $d_w$ and so the tracing: 180 mm. The picture is the same shape, twice as big.'
      ],
      a: '90 mm; 180 mm from twice as far. The shape is unchanged.'
    },
    {
      title: 'A point behind the plane under oblique projectors',
      q: 'A point lies 40 mm behind the picture plane and is projected along lines at 45° to the normal. How far is its image from the image under perpendicular projectors? And at 30°?',
      steps: [
        { text: 'The shift is the depth times the tangent of the angle:', tex: 's = z_d \\tan\\psi' },
        '$40 \\tan 45° = 40$ mm and $40 \\tan 30° = 23.1$ mm.'
      ],
      a: '40 mm at 45°; 23.1 mm at 30°.'
    }
  ],
  quiz: [
    { q: 'In which arrangement is the picture upright and smaller than the object?', choices: ['Object between centre and plane', 'Plane between the eye and the object', 'Centre between object and plane', 'Plane through the object'], a: 1, why: 'With the plane between eye and object (Alberti\'s window) the projectors meet the plane before the object, so the image is nearer and smaller, and not inverted.' },
    { q: 'Sliding the picture plane parallel to itself changes the shape of a central picture.', a: false, why: 'It multiplies every image distance by the same factor (the ratio of the new and old distances d); the shape is unchanged.' },
    { q: 'You trace a 30 m tower 300 m away on a pane 0.5 m from your eye. How many millimetres tall is the tracing?', answer: 50, unit: 'mm', why: 'h = 30 × 0.5 / 300 = 0.05 m = 50 mm.' },
    { q: 'In the matrix of central projection the last row (0 0 −1 0) does what?', choices: ['Moves the picture plane', 'Copies −z into w, so dividing by w shrinks far points', 'Rotates the picture', 'Throws away depth'], a: 1, why: 'The division by w = −z is the whole of perspective: x\' = d·x/(−z).' }
  ],
  applications: [
    'Perspective painting: the artist traces on a pane of glass or on a gridded frame (Alberti, Dürer); the pane is the picture plane.',
    'Photography: the sensor is the picture plane, the optical centre of the lens the centre of projection, and the focal length plays the part of d.',
    'Computer graphics: the near plane of the camera\'s viewing volume is the picture plane; the graphics card divides by w as in the matrix above.',
    'Slide and film projectors: the lamp and lens are the centre, the screen the plane; moving the screen only scales the picture.'
  ],
  history: 'Leon Battista Alberti, in *De pictura* (Latin 1435, Italian 1436), told painters to think of the picture as a window through which the scene is seen. Albrecht Dürer\'s woodcuts of 1525 and 1538 show draughtsmen tracing a lute or a model through a gridded frame or on a glass pane, with an eye-hook that fixes the centre. The separation of centre and plane is the same one used in every camera model since.',
  sources: ['Leon Battista Alberti, *On Painting* (De pictura), Book I.', 'Albrecht Dürer, *Underweysung der Messung* (1525): the woodcuts of drawing devices.', 'Kirsti Andersen, *The Geometry of an Art* (2007).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003): the pinhole camera model.'],
  sim: 'wp-projection-room',
  construction: 'wp-projectors'
},

{
  id: 'parallel-vs-central',
  parent: 'what-projection-is',
  title: 'Parallel and central projection',
  level: 1,
  short: 'Central projection sends every point along a line through one centre: far things shrink and parallels converge. Parallel projection is its limit when the centre goes to infinity: sizes and parallels survive and a picture can be measured.',
  keywords: ['parallel projection', 'central projection', 'perspective', 'vanishing point', 'orthographic', 'oblique', 'infinity', 'affine', 'projective'],
  prereq: ['projectors-and-picture-plane', 'math:vectors'],
  related: ['central-projection', 'vanishing-points', 'orthographic-projection', 'axonometric-projection', 'oblique-projection', 'points-at-infinity', 'the-projection-matrix'],
  body: `**Central projection** (perspective) sends each point along the line through one centre, the eye. It is what a camera and an eye do. Things farther away are drawn smaller, in proportion to their distance. Lines that run away from the picture plane are not parallel on the paper: they meet at a **vanishing point**, the image of the point at infinity of their direction. The picture depends on where the centre is, and only a figure in a plane parallel to the picture keeps its shape (scaled).

**Parallel projection** sends each point along one fixed direction. Parallel lines stay parallel on paper, the ratio of lengths along a line is kept, and two objects of equal size are drawn equal whatever their distance. A picture can therefore be **measured**, which is why the drawing office uses it. It gives no depth cue: nothing grows smaller in the distance. If the projectors are perpendicular to the plane it is **orthographic**; if they slant it is **oblique**.

### One is the limit of the other
Put the centre on the axis at distance $D$ in front of the plane. A point at sideways distance $x$ and distance $z$ in front of the plane (towards the centre) projects to
$$x' = \\frac{x}{1 - z/D}.$$
As $D$ grows the denominator tends to 1 and $x' \\to x$: the central picture becomes the orthographic one. In matrix form the last row is $(0\\ \\ 0\\ \\ {-1/D}\\ \\ 1)$, and as $D \\to \\infty$ it becomes $(0\\ 0\\ 0\\ 1)$, the mark of a parallel projection.

How far is far enough? The projectors to the two ends of an object of size $S$ meet at the angle $2\\arctan\\frac{S}{2D}$. For a 1 m object 100 m away that is 0.57°; for a building 100 m across and the sun, 150 million km away, it is a few billionths of a radian. The sun's rays are parallel for every practical purpose.

### The vanishing point
In plan, let a horizontal direction make the angle $\\theta$ with the picture plane, with the eye at distance $d$ from it. The vanishing point lies at
$$x_v = d\\cot\\theta$$
from the point of the picture directly in front of the eye. At $\\theta = 90°$ it sits at the centre; as $\\theta \\to 0$ it runs off to infinity. A direction parallel to the picture has no vanishing point, which is exactly the parallel-projection behaviour.

### Choosing
Use central projection when the picture must show how a thing **looks**: the architect's view for the client, the photograph. Use parallel projection when the picture must be **measured**: the part drawing, the assembly manual, the game tile.`,
  ideas: [
    'Central projection: far things shrink, parallels converge to vanishing points, the picture depends on the centre.',
    'Parallel projection: parallels stay parallel, ratios along a line are kept, equal sizes stay equal at any distance; it can be measured but gives no sense of depth.',
    'Parallel projection is the limit of central projection as the centre goes to infinity; for the sun, or any distant source, the approximation is excellent.',
    'A direction parallel to the picture plane has no vanishing point; one at angle θ to it vanishes at distance d cot θ from the point in front of the eye.'
  ],
  pitfalls: [
    'Perspective is "more realistic", parallel is "wrong" — Each is exact for its purpose. A parallel view is what you get from a very distant eye; it is the right choice when you want to measure.',
    'Parallel lines in a perspective picture must meet — Only those running away from the picture plane. Lines parallel to the plane (a horizon-parallel row of windows, say) stay parallel on the picture.',
    'In parallel projection nothing can look smaller with distance — Correct for size, but a slanted view (oblique, axonometric) still hides or overlaps parts; there is no shrinking to help the eye.'
  ],
  formulas: [
    {
      name: 'Central projection from a centre at distance D',
      expr: 'xp = x/(1 - z/D)',
      tex: "x' = \\frac{x}{1 - z/D}",
      vars: {
        xp: { name: 'position of the image', q: 'length', unit: 'mm', tex: "x'" },
        x: { name: 'sideways distance of the point', q: 'length', unit: 'mm', value: 500 },
        z: { name: 'distance of the point in front of the picture plane', q: 'length', unit: 'mm', value: 200 },
        D: { name: 'distance of the centre in front of the plane', q: 'length', unit: 'mm', value: 2000 }
      },
      solveFor: 'xp',
      note: 'The plane is the one through the origin and the centre is on the axis, D in front. For D → ∞ the result is x: the parallel (orthographic) image.'
    },
    {
      name: 'Vanishing point of a horizontal direction',
      expr: 'xv = d/tan(theta)',
      tex: 'x_v = \\frac{d}{\\tan\\theta}',
      vars: {
        xv: { name: 'distance of the vanishing point from the central point', q: 'length', unit: 'mm', tex: 'x_v' },
        d: { name: 'distance from the eye to the picture plane', q: 'length', unit: 'mm', value: 50 },
        theta: { name: 'angle between the direction and the picture plane (in plan)', q: 'angle', unit: '°', value: 30, min: 1, max: 90 }
      },
      solveFor: 'xv',
      note: 'The vanishing point is where the line through the eye parallel to the direction meets the plane. At 45° it is as far from the centre as the eye is from the plane.'
    },
    {
      name: 'Angle between the projectors to the ends of an object',
      expr: 'w = 2*atan(S/(2*D))',
      tex: 'w = 2\\arctan\\frac{S}{2D}',
      vars: {
        w: { name: 'angle between the extreme projectors', q: 'angle', unit: '°' },
        S: { name: 'size of the object', q: 'length', unit: 'm', value: 1 },
        D: { name: 'distance of the centre', q: 'length', unit: 'm', value: 100 }
      },
      solveFor: 'w',
      note: 'The smaller this angle, the more nearly parallel the projectors. For the sun and a house it is about 10⁻⁹ radian.'
    }
  ],
  examples: [
    {
      title: 'How parallel is the sun?',
      q: 'A building is 100 m across. The sun is 1.5 × 10¹¹ m away. By what angle do the rays from the sun\'s centre to the two sides of the building differ?',
      steps: [
        { text: 'The angle is $2\\arctan\\dfrac{S}{2D}$ with $S = 100$ m and $D = 1.5\\times 10^{11}$ m. For a very small angle $\\arctan\\epsilon \\approx \\epsilon$, so', tex: 'w \\approx \\frac{S}{D} = \\frac{100}{1.5\\times 10^{11}} = 6.7\\times 10^{-10}\\ \\text{rad}' },
        'That is about $4\\times 10^{-8}$ degrees: far less than anything a drawing can show. (The sun\'s disc is 0.53° across, but that is a different matter: it makes the edges of shadows soft, not their directions different.)'
      ],
      a: 'About 7 × 10⁻¹⁰ radian: the rays are parallel for every purpose of drawing.'
    },
    {
      title: 'A cube seen from a finite eye',
      q: 'A cube of side 1 m has its front face in the picture plane and its back face 1 m behind it. The eye is on the axis, D = 4 m in front of the plane. A point on the front face is 0.5 m from the axis; the point of the back face directly behind it is also 0.5 m from the axis. Where are their images? And with the eye at D = 20 m?',
      steps: [
        { text: 'Front point: $z = 0$, so $x\' = 0.5/(1 - 0) = 0.5$ m. Back point: $z = -1$ m, so', tex: "x' = \\frac{0.5}{1 + 1/4} = 0.4\\ \\text{m}" },
        'The back face is drawn at 80 % of the front face.',
        'With $D = 20$ m: $x\' = 0.5/(1 + 1/20) = 0.476$ m, 95 % of the front face. The farther the eye, the nearer the picture is to a parallel one.'
      ],
      a: '0.5 and 0.4 m for D = 4 m (back at 80 %); 0.5 and 0.476 m for D = 20 m (95 %).'
    }
  ],
  quiz: [
    { q: 'Which description fits parallel projection of a cube but not central projection?', choices: ['The picture is flat', 'Two equal edges at different distances are drawn the same length', 'Straight edges stay straight', 'Some information is lost'], a: 1, why: 'In parallel projection size does not depend on distance. Straight lines stay straight, the picture is flat and depth is lost in both.' },
    { q: 'In parallel projection two objects of the same size at different distances are drawn the same size.', a: true, why: 'There is no division by distance: x\' = x for perpendicular projectors, whatever z is.' },
    { q: 'A horizontal direction makes 45° with the picture plane and the eye is 60 mm from it. How far from the central point is its vanishing point, in mm?', answer: 60, unit: 'mm', why: 'x_v = d cot 45° = d = 60 mm.' },
    { q: 'As the centre of projection moves to infinity, the angle between the projectors to the ends of an object', choices: ['grows without limit', 'tends to 90°', 'tends to zero', 'stays the same'], a: 2, why: 'The angle is 2 arctan(S/2D), which tends to 0 as D grows: the projectors become parallel.' }
  ],
  applications: [
    'Technical drawing uses parallel projection so that dimensions can be scaled off the sheet; architectural presentation uses central projection so that the client sees the building as it will look.',
    'Games: perspective cameras for first-person views, orthographic or isometric cameras for strategy and puzzle games where tiles must stay equal.',
    'Sundials and shadows: the sun\'s rays are parallel in practice, so the shadow of a gnomon is a parallel projection onto the dial.',
    'Aerial mapping: from high altitude with a long lens the photograph is nearly an orthographic view; near the ground it is strongly central and needs correcting.'
  ],
  history: 'Parallel projection was the tool of builders and of the descriptive geometers; Monge\'s lectures of 1795 gave it a theory. Central projection is the painters\' discovery of the early fifteenth century. Girard Desargues (1639) treated parallel lines as meeting at a point at infinity, which made the two projections members of one family, the projective geometry that Poncelet developed in 1822.',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003).', 'Ingrid Carlbom and Joseph Paciorek, Planar geometric projections and viewing transformations, *ACM Computing Surveys* 10 (1978).', 'ISO 5456-1, Technical drawings — Projection methods — Part 1: Synopsis.'],
  sim: 'wp-centre-to-infinity',
  construction: 'wp-centre-recedes'
},

{
  id: 'planar-and-curved-pictures',
  parent: 'what-projection-is',
  title: 'Flat pictures and curved ones',
  level: 2,
  short: 'The picture surface may be a plane, a cylinder or a sphere. A plane keeps straight lines straight but cannot hold the whole field of view; a sphere holds everything, but must be flattened again. A lens maker chooses how a ray at angle θ becomes a radius r.',
  keywords: ['planar', 'curved', 'cylinder', 'sphere', 'fisheye', 'rectilinear', 'stereographic', 'equidistant', 'equisolid', 'orthographic', 'wide angle', 'panorama'],
  prereq: ['parallel-vs-central', 'projectors-and-picture-plane', 'math:right-triangle-trig'],
  related: ['fisheye-projections', 'rectilinear-lens', 'curvilinear-perspective', 'four-point-perspective', 'equirectangular-images', 'azimuthal-projections', 'wide-angle-and-the-limits-of-the-plane'],
  body: `Until now the picture surface was a plane. It is the usual one (a sheet, a sensor, a screen) and it has one great virtue: **straight lines in space stay straight on the picture**. It has one great vice: it cannot hold a wide field of view. A ray at angle $\\theta$ from the axis lands at the radius
$$r = f\\tan\\theta,$$
where $f$ is the distance from the centre to the plane (the focal length). At 45° that is $f$; at 60° it is $1.73 f$; at 80° it is $5.7 f$; at 90° the ray never meets the plane. Towards the edge of a wide flat picture everything is stretched, and a ball at the rim becomes an egg. This is the rectilinear (or gnomonic) picture of a camera lens.

### A curved picture
Let the picture be a **cylinder** about a vertical axis, with the eye on the axis. It can take in the whole horizon, 360°. Vertical lines of the scene stay vertical and straight; horizontal ones curve. A cylinder can be cut open and laid flat **without any stretching**, so this is the panorama: $x = f\\varphi$ along the horizon, $y = f\\tan(\\text{altitude})$ upwards (cylindrical perspective, the four-point perspective of [[four-point-perspective]]). Let the picture be a **sphere** about the eye and it takes in everything, but a sphere cannot be flattened without stretching (see [[why-the-sphere-cannot-be-flattened]]): flattening it again is exactly the problem of the map projections.

### The lens maker's choice
A fisheye lens puts the ray at angle $\\theta$ at radius $r(\\theta)$ on a flat sensor, and the choice of function decides what is kept:

| Name | Radius $r$ | Keeps | $r/f$ at 60° |
|---|---|---|---|
| Rectilinear | $f\\tan\\theta$ | straight lines | 1.73 |
| Stereographic | $2f\\tan(\\theta/2)$ | angles, circles | 1.15 |
| Equidistant | $f\\theta$ | angle from the axis | 1.05 |
| Equisolid angle | $2f\\sin(\\theta/2)$ | areas of sky | 1.00 |
| Orthographic | $f\\sin\\theta$ | (a mirrored ball's view) | 0.87 |

These are exactly the azimuthal map projections ([[azimuthal-projections]]): the sky seen from the eye is the Earth turned inside out.

### How it is drawn
Draw a section through the eye: a circle of radius $f$ for the directions, the picture plane touching it at the top, and a ray at $\\theta$. Each rule above moves the point where the ray meets the circle onto the plane in a different way: along the ray, straight down, by swinging the chord, by rolling out the arc, or from the opposite pole. The construction does all five.`,
  ideas: [
    'A flat picture keeps straight lines straight but stretches towards the edge: r = f tan θ runs off to infinity at 90°.',
    'A cylinder holds the whole horizon and can be unrolled without stretching (the panorama); a sphere holds everything but cannot be flattened without distortion.',
    'A fisheye is a choice of radius r(θ) for a ray at angle θ: equidistant keeps angles from the axis, equisolid keeps areas, stereographic keeps shapes, orthographic crowds the rim.',
    'These five mappings are the azimuthal map projections seen from inside.'
  ],
  pitfalls: [
    'A fisheye picture is a distorted rectilinear one — It is a different, equally exact projection. Its curved lines are the correct image of straight lines in the chosen mapping.',
    'A wide-angle lens can be made rectilinear up to 180° — Never: r = f tan θ is unbounded at 90°. Lenses over about 120° are rectilinear only with severe edge stretching, and beyond 180° the plane cannot hold the picture.',
    'A cylinder is as bad as a sphere for flattening — A cylinder is developable: it opens flat with no stretching. Only the sphere forces the compromise.'
  ],
  formulas: [
    {
      name: 'Rectilinear (flat window)',
      expr: 'r = f*tan(theta)',
      tex: 'r = f\\tan\\theta',
      vars: { r: { name: 'radius in the picture', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 }, theta: { name: 'angle from the axis', q: 'angle', unit: '°', value: 45, min: 0, max: 85 } },
      note: 'Straight lines stay straight. The radius grows without limit as θ approaches 90°.'
    },
    {
      name: 'Equidistant fisheye',
      expr: 'r = f*theta',
      tex: 'r = f\\theta',
      vars: { r: { name: 'radius in the picture', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 }, theta: { name: 'angle from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180 } },
      note: 'The radius is proportional to the angle (in radians): equal steps of angle are equal steps of radius. Used for sky and cloud cameras.'
    },
    {
      name: 'Equisolid-angle fisheye',
      expr: 'r = 2*f*sin(theta/2)',
      tex: 'r = 2f\\sin\\frac{\\theta}{2}',
      vars: { r: { name: 'radius in the picture', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 }, theta: { name: 'angle from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180 } },
      note: 'Equal solid angles of sky get equal areas of picture. The most common design for photographic fisheyes.'
    },
    {
      name: 'Stereographic fisheye',
      expr: 'r = 2*f*tan(theta/2)',
      tex: 'r = 2f\\tan\\frac{\\theta}{2}',
      vars: { r: { name: 'radius in the picture', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 }, theta: { name: 'angle from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 170 } },
      note: 'Angles are kept: small circles of the sky stay circles. The projection of the astrolabe and of the little-planet photograph.'
    }
  ],
  examples: [
    {
      title: 'How wide does a 15 mm lens see?',
      q: 'A full-frame sensor measures 36 × 24 mm, so the farthest corner is 21.6 mm from the centre. A lens of focal length 15 mm is made as a rectilinear lens, an equidistant fisheye, an equisolid fisheye and a stereographic fisheye. At what angle from the axis does each reach the corner, and what diagonal field of view does that give?',
      steps: [
        { text: 'Rectilinear: $\\tan\\theta = 21.6/15 = 1.44$, so', tex: '\\theta = 55.2°,\\quad \\text{FOV} = 110°' },
        { text: 'Equidistant: $\\theta = r/f = 1.44$ rad $= 82.5°$, so', tex: '\\text{FOV} = 165°' },
        { text: 'Equisolid: $\\sin(\\theta/2) = 21.6/30 = 0.72$, $\\theta/2 = 46.0°$, so', tex: '\\text{FOV} = 184°' },
        { text: 'Stereographic: $\\tan(\\theta/2) = 0.72$, $\\theta/2 = 35.8°$, so', tex: '\\text{FOV} = 143°' }
      ],
      a: 'The same 15 mm and the same sensor see 110° (rectilinear), 143° (stereographic), 165° (equidistant) and 184° (equisolid) along the diagonal.'
    },
    {
      title: 'A ball at the edge of a wide picture',
      q: 'In a rectilinear picture a ball is at 45° from the axis. How much is it stretched radially and across (tangentially) compared with a ball at the centre?',
      steps: [
        { text: 'The radial scale is $dr/(f\\,d\\theta) = \\sec^2\\theta$ and the tangential scale is $r/(f\\sin\\theta) = \\sec\\theta$:', tex: '\\sec^2 45° = 2,\\qquad \\sec 45° = 1.41' },
        'The ball becomes an ellipse with axes in the ratio $2 : 1.41 = 1.41$, with the long axis pointing at the centre of the picture.'
      ],
      a: 'Stretched 2 times along the radius and 1.41 times across: an ellipse of axis ratio 1.41.'
    }
  ],
  quiz: [
    { q: 'Which mapping keeps every straight line of space straight in the picture?', choices: ['Equidistant', 'Stereographic', 'Rectilinear', 'Equisolid'], a: 2, why: 'Only the central projection onto a plane, r = f tan θ, maps lines to lines. All the fisheye mappings curve them.' },
    { q: 'Which fisheye mapping keeps angles, so that small circles of the sky stay circles?', choices: ['Orthographic', 'Equisolid', 'Equidistant', 'Stereographic'], a: 3, why: 'The stereographic projection is conformal. It is also the one the astrolabe uses.' },
    { q: 'A rectilinear lens of focal length 24 mm: how many millimetres from the centre does a ray at 45° land?', answer: 24, unit: 'mm', why: 'r = f tan 45° = f = 24 mm.' },
    { q: 'A cylinder can be unrolled flat without stretching; a sphere cannot.', a: true, why: 'The cylinder is a developable surface: it has no curvature along its length. The sphere has curvature in every direction, so any flat picture must stretch or tear it.' },
    { q: 'In the equidistant mapping the ring at 90° from the axis has radius', choices: ['f', 'π f / 2', '2 f', 'it has none'], a: 1, why: 'r = f θ with θ = π/2 gives 1.571 f.' }
  ],
  applications: [
    'Camera lenses: rectilinear wide-angle lenses for architecture (straight verticals); fisheyes for interiors and the sky.',
    'All-sky cameras for meteors, aurora and cloud use equidistant or equisolid fisheyes, so that angles or areas of sky can be read straight off the picture.',
    'Panoramas and virtual reality: cylindrical and equirectangular pictures stitched from many photographs.',
    'Planetaria and domed cinemas show a spherical picture on a dome; the "dome master" for the projector is a fisheye image.'
  ],
  history: 'The stereographic projection was known to Hipparchus and is described by Ptolemy in his *Planisphaerium*. Robert W. Wood described a "fish-eye" view of the sky as a fish sees it (1906), and Robin Hill designed a 180° sky lens for cloud studies in the 1920s. The Fisheye-Nikkor 8 mm of 1962 brought the full-circle fisheye to photographers.',
  sources: ['Rudolf Kingslake, *A History of the Photographic Lens* (1989).', 'Sidney Ray, *Applied Photographic Optics* (3rd ed., 2002): the chapters on wide-angle and fisheye lenses.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993): the azimuthal projections.', 'Ptolemy, *Planisphaerium*.'],
  sim: 'wp-picture-surfaces',
  construction: 'wp-ray-to-picture'
},

{
  id: 'taxonomy-of-projections',
  parent: 'what-projection-is',
  title: 'The family tree of projections',
  level: 1,
  short: 'Three questions sort every projection: do the projectors go through a centre or run parallel, what surface receives the picture, and how is the object turned to it? Orthographic, axonometric, oblique, perspective, curvilinear pictures and maps all fall out.',
  keywords: ['classification', 'family tree', 'taxonomy', 'orthographic', 'axonometric', 'oblique', 'perspective', 'curvilinear', 'map projection', 'ISO 5456'],
  prereq: ['parallel-vs-central', 'planar-and-curved-pictures'],
  related: ['orthographic-projection', 'axonometric-projection', 'oblique-projection', 'central-projection', 'curvilinear-perspective', 'azimuthal-projections', 'why-the-sphere-cannot-be-flattened'],
  body: `The projections of this app look unrelated: an engineer's top view, a chessboard in perspective, a fisheye photograph, the Mercator chart. Three questions put them in order.

1. **Where do the projectors go?** Through one centre (central) or in one direction (parallel).
2. **What receives the picture?** A plane, a cylinder, a cone or a sphere.
3. **How is the object placed to the picture?** Squarely, with its principal faces parallel or perpendicular to the plane, or turned and tilted.

### The tree

| Family | Projectors | Picture | Object | Examples |
|---|---|---|---|---|
| Orthographic (multiview) | parallel, perpendicular | plane | faces parallel to the plane | front, top, side views: [[orthographic-projection]] |
| Axonometric | parallel, perpendicular | plane | turned and tilted | isometric, dimetric, trimetric: [[axonometric-projection]] |
| Oblique | parallel, slanted | plane | one face parallel to the plane | cavalier, cabinet, planometric: [[oblique-projection]] |
| Linear perspective | central | plane | 1, 2 or 3 edge directions meet the plane | one-, two-, three-point: [[central-projection]] |
| Curvilinear | central | cylinder or sphere | any | four-, five-, six-point, fisheye, panorama: [[curvilinear-perspective]] |
| Map projections | central or by formula | plane, cylinder, cone | the globe, in an aspect | gnomonic, Mercator, Lambert: [[azimuthal-projections]] |

The sky projections (the planisphere, the astrolabe) are the last row seen from the inside of the sphere.

### Counting vanishing points
Look at a box. Each of its three edge directions either lies in a plane parallel to the picture, and then has no vanishing point, or it does not, and then has one. So a box has 0 vanishing points in any parallel projection and 1, 2 or 3 in a central one, according to how many of its edge directions cut the picture plane. One-point perspective is a box squarely faced; two-point, a box turned about a vertical; three-point, a box also tilted.

### Affine and projective
In matrices the two main branches are told apart by one row. A **parallel** projection has the bottom row $(0\\ 0\\ 0\\ 1)$ and is an **affine** map: it keeps parallelism and ratios along a line. A **central** projection has a non-zero entry in the bottom row, divides by $w$, and is a **projective** map: it keeps lines and the cross-ratio but not parallelism. See [[what-projections-preserve]].

### Why it matters
The tree tells you what to expect. If you know a picture is axonometric, you know its parallels are parallel and you may measure along the axes; if it is perspective, you may not. If it is a map of the whole Earth you know that something (angles or areas) has been given up, and which one tells you what it is good for.`,
  ideas: [
    'Three questions place a projection: central or parallel projectors; plane, cylinder or sphere as the picture; object squarely placed or turned.',
    'Parallel families: orthographic (perpendicular projectors), axonometric (object turned), oblique (projectors slanted).',
    'Central families: linear perspective with 1, 2 or 3 vanishing points on a plane; curvilinear perspective on a cylinder or sphere.',
    'In matrix terms parallel projections are affine (bottom row 0 0 0 1); central ones are projective.'
  ],
  pitfalls: [
    'Isometric is a kind of perspective — It is a parallel projection of an object turned to a special position; there are no vanishing points.',
    'Oblique and axonometric are the same — Axonometric turns the object and keeps the projectors perpendicular; oblique keeps one face parallel to the picture and slants the projectors.',
    'Maps are a separate subject — A map projection is a projection of the same family: usually central or by a formula, onto a plane, cylinder or cone. The new problem is that the thing is a sphere.'
  ],
  formulas: [],
  examples: [
    {
      title: 'Name the projection',
      q: 'Which family does each picture belong to? (a) A patent drawing of a gear showing three faces, parallel edges drawn parallel, the vertical axis vertical and the other two at 30°, all at one scale. (b) A shop sketch whose front face is true shape with the depth edges drawn at 45° and half length. (c) A chart on which a ship\'s course of constant bearing is a straight line. (d) A photograph through a lens in which straight lines near the rim are bent.',
      steps: [
        '(a) Parallel projectors, object turned so that the three axes are foreshortened equally: **axonometric, isometric**.',
        '(b) Parallel but slanted projectors, one face parallel to the picture: **oblique, cabinet** (depth halved).',
        '(c) A picture of the sphere on a plane with straight constant-bearing lines: a **map projection**, the cylindrical conformal one, **Mercator**.',
        '(d) Central projectors through the lens, but a mapping from angle to radius that is not f tan θ: **curvilinear perspective, a fisheye**.'
      ],
      a: '(a) isometric, (b) cabinet oblique, (c) Mercator map, (d) fisheye (curvilinear perspective).'
    }
  ],
  quiz: [
    { q: 'Which family has parallel but slanted projectors and keeps one face in true shape?', choices: ['Isometric', 'Oblique', 'Two-point perspective', 'Orthographic'], a: 1, why: 'Oblique projections slant the projectors while keeping a face parallel to the picture, so that face is true shape.' },
    { q: 'How many vanishing points does an isometric picture of a box have?', answer: 0, why: 'It is a parallel projection: parallel edges stay parallel on the paper, so no edge direction vanishes.' },
    { q: 'Perspective drawing is a parallel projection.', a: false, why: 'Perspective is central projection: the projectors meet in the eye, and parallel edges not parallel to the picture converge.' },
    { q: 'What distinguishes the matrix of a parallel projection from that of a central one?', choices: ['The first row', 'Its bottom row is (0 0 0 1)', 'It has no zero entries', 'It is symmetric'], a: 1, why: 'A parallel projection is affine, with bottom row (0, 0, 0, 1) so w stays 1 and nothing is divided. A central projection puts something in the bottom row and divides by w.' }
  ],
  applications: [
    'Choosing the right picture for a job: orthographic for manufacture, axonometric for manuals, oblique for quick sketches, perspective for presentation.',
    'Standards: ISO 5456 sets out the projection methods of technical drawings in four parts (synopsis, orthographic, axonometric, central).',
    'Software: a 3-D modeller\'s "camera" switches between orthographic and perspective by changing only that bottom row.',
    'Cartography: sorting map projections by the surface (plane, cylinder, cone) and by what they preserve guides the choice of a map for a purpose.'
  ],
  history: 'The branches were named over four centuries: linear perspective by the Italian painters from about 1420, orthographic projection and "descriptive geometry" by Monge (1795), isometric projection by William Farish (1822), the oblique "military" projections in fortification drawing of the eighteenth and nineteenth centuries. The unifying view is Poncelet\'s projective geometry (1822) and, in computing, the use of homogeneous 4 × 4 matrices (Roberts, 1963).',
  sources: ['ISO 5456-1 to 5456-4, Technical drawings — Projection methods.', 'Ingrid Carlbom and Joseph Paciorek, Planar geometric projections and viewing transformations, *ACM Computing Surveys* 10 (1978).', 'Kirsti Andersen, *The Geometry of an Art* (2007).'],
  sim: 'wp-gallery'
},

{
  id: 'what-projections-preserve',
  parent: 'what-projection-is',
  title: 'What a projection keeps and what it loses',
  level: 2,
  short: 'Straight lines stay straight in all of them; parallelism, ratios along a line, lengths, angles and areas survive only in some. The one thing every projection of a line keeps is the cross-ratio of four points.',
  keywords: ['invariant', 'preserve', 'affine', 'projective', 'parallelism', 'ratio', 'cross-ratio', 'angle', 'area', 'collinearity', 'conformal', 'equal area'],
  prereq: ['parallel-vs-central', 'taxonomy-of-projections'],
  related: ['cross-ratio', 'projective-geometry', 'conformal-maps', 'equal-area-maps', 'tissot-indicatrix', 'true-length-and-true-shape'],
  body: `A projection throws something away; the useful question is **what is left**. Here is the answer for the main families of drawing.

| Property | Orthographic | Axonometric | Oblique | Perspective |
|---|---|---|---|---|
| Straight lines stay straight | yes | yes | yes | yes |
| Parallel lines stay parallel | yes | yes | yes | only those parallel to the picture |
| Ratios along a line (midpoints) | yes | yes | yes | no |
| Lengths | only parallel to the plane | one scale per axis | front face true; depth by a ratio | only parallel to the plane, scaled |
| Angles | only in planes parallel to the picture | no | front face only | only in planes parallel to the picture |
| Areas | times $\\cos\\theta$ for a plane tilted by $\\theta$ | likewise | front face true | scaled, and varying with distance |
| Cross-ratio of four points on a line | yes | yes | yes | yes |

### Affine and projective
Every parallel projection is an **affine** map, $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$. It keeps parallelism and every ratio of lengths along one line, so a midpoint goes to a midpoint. A central projection is a **projective** map. It keeps lines, but parallels meet and midpoints do not go to midpoints: the image of the midpoint of a receding segment is nearer the far end. What survives is a ratio of ratios, the **cross-ratio** of four collinear points $A, B, C, D$,
$$(A, B; C, D) = \\frac{AC\\cdot BD}{BC\\cdot AD},$$
which has the same value on a line and on any projection of that line, parallel or central. With three points and the cross-ratio you can find the fourth: this is how the image of an equal division, or of a midpoint, is found in a perspective.

### Why lengths and angles go
Orthographic projection multiplies a length by $\\cos\\theta$, where $\\theta$ is the angle to the plane, and an area by the same factor; angles between lines change unless the figure lies in a plane parallel to the picture. In perspective a length also changes with distance: two equal parallel edges at depths $z_1$ and $z_2$ in front of the plane, with the eye at distance $D$, are drawn in the ratio $(D - z_2)/(D - z_1)$.

### Maps
For maps the same questions become: is it **conformal** (angles kept, [[conformal-maps]]), **equal-area** ([[equal-area-maps]]) or **equidistant**? No projection of the sphere keeps both angles and areas ([[why-the-sphere-cannot-be-flattened]]).

### How it is drawn
Divide a line into equal parts with the dividers and project it from a lamp and in parallel: the construction shows that the equal parts stay equal in one and not in the other, while the cross-ratio is the same in both.`,
  ideas: [
    'All projections onto a plane keep straight lines straight; parallel projections also keep parallelism and every ratio of lengths along a line (they are affine).',
    'Central projection loses parallelism and midpoints, but keeps the cross-ratio (AC·BD)/(BC·AD) of four points on a line.',
    'Lengths and areas scale with the tilt (cos θ in orthographic projection) and, in perspective, with distance.',
    'Angles are true only in planes parallel to the picture; maps cannot keep both angles and areas.'
  ],
  pitfalls: [
    'Parallel projection keeps lengths — It keeps ratios of lengths along one line and the lengths of lines parallel to the picture. A tilted line is shortened by cos θ.',
    'The image of the midpoint is the midpoint of the image — True in parallel projection, false in perspective: the midpoint of a receding segment is drawn nearer the far end.',
    'Nothing is kept in perspective — Collinearity and the cross-ratio are kept, and so is the shape of any figure parallel to the picture plane.'
  ],
  formulas: [
    {
      name: 'Cross-ratio of four collinear points',
      expr: 'CR = ((c - a)*(d - b))/((c - b)*(d - a))',
      tex: '\\mathrm{CR} = \\frac{(c - a)(d - b)}{(c - b)(d - a)}',
      vars: {
        CR: { name: 'cross-ratio', tex: '\\mathrm{CR}' },
        a: { name: 'position of A along the line', value: 0, signed: true },
        b: { name: 'position of B', value: 1, signed: true },
        c: { name: 'position of C', value: 2, signed: true },
        d: { name: 'position of D', value: 3, signed: true }
      },
      solveFor: 'CR',
      note: 'Positions along the line, in any unit. Equally spaced points 0, 1, 2, 3 give 4/3. The value is the same for the images under any projection of the line.'
    },
    {
      name: 'Area of the orthographic image',
      expr: 'A1 = A*cos(theta)',
      tex: 'A_1 = A\\cos\\theta',
      vars: { A1: { name: 'area of the image', q: 'area', unit: 'm²', tex: 'A_1' }, A: { name: 'true area', q: 'area', unit: 'm²', value: 80 }, theta: { name: 'angle between the plane of the figure and the picture plane', q: 'angle', unit: '°', value: 35, min: 0, max: 90 } },
      note: 'Every length in the plane is shortened by cos θ in the direction of steepest slope and not at all across it, so the area is multiplied by cos θ.'
    },
    {
      name: 'Ratio of two equal parallel edges in perspective',
      expr: 'q = (D - z2)/(D - z1)',
      tex: 'q = \\frac{D - z_2}{D - z_1}',
      vars: {
        q: { name: 'image length of the nearer edge / image length of the farther one' },
        D: { name: 'distance of the eye in front of the picture plane', q: 'length', unit: 'm', value: 5 },
        z1: { name: 'depth of the nearer edge in front of the plane', q: 'length', unit: 'm', value: 1, signed: true, tex: 'z_1' },
        z2: { name: 'depth of the farther edge', q: 'length', unit: 'm', value: -1, signed: true, tex: 'z_2' }
      },
      solveFor: 'q',
      note: 'Equal parallel edges, both parallel to the picture plane. In parallel projection q = 1 always.'
    }
  ],
  examples: [
    {
      title: 'A tilted circle',
      q: 'A circle of diameter 100 mm lies in a plane tilted 60° from the picture plane and is projected perpendicularly. What is the image, and what fraction of the area remains?',
      steps: [
        'Lengths across the tilt (along the lines parallel to the picture plane) are unchanged: one axis stays 100 mm.',
        'Lengths along the line of steepest slope are multiplied by $\\cos 60° = 0.5$: the other axis is 50 mm. The image is an ellipse 100 mm by 50 mm.',
        'The area is multiplied by $\\cos\\theta = 0.5$. Angles are not kept: the circle\'s perpendicular diameters are the ellipse\'s axes, but other perpendicular pairs are not.'
      ],
      a: 'An ellipse with axes 100 and 50 mm, half the area.'
    },
    {
      title: 'Railway sleepers in a photograph',
      q: 'Sleepers lie 1 m apart on a straight track at 4, 5, 6 and 7 m from the camera. On a picture plane 0.1 m in front of an eye 1.6 m above the track, the distance below the horizon of a ground point at distance $z$ is $0.16/z$ m. Find the images of the four sleepers, and check the cross-ratio.',
      steps: [
        'The images are at $0.16/4 = 40.0$, $0.16/5 = 32.0$, $0.16/6 = 26.7$ and $0.16/7 = 22.9$ mm below the horizon: the spacings 8.0, 5.3, 3.8 mm shrink with distance.',
        { text: 'Cross-ratio of the real positions 4, 5, 6, 7:', tex: '\\frac{(6-4)(7-5)}{(6-5)(7-4)} = \\frac{4}{3}' },
        { text: 'Cross-ratio of the images 40, 32, 26.67, 22.86:', tex: '\\frac{(26.67-40)(22.86-32)}{(26.67-32)(22.86-40)} = \\frac{121.9}{91.4} = 1.333' }
      ],
      a: 'Equal spacings become 8.0, 5.3 and 3.8 mm, but the cross-ratio is 4/3 in both.'
    }
  ],
  quiz: [
    { q: 'Which property does parallel projection keep that perspective does not?', choices: ['Straight lines stay straight', 'The ratio of lengths along a line', 'The cross-ratio', 'Depth'], a: 1, why: 'Parallel projection is affine: midpoints go to midpoints. In perspective the midpoint of a receding segment is not the midpoint of its image. Lines and the cross-ratio are kept by both.' },
    { q: 'A square plate is tilted 60° from the picture plane and projected perpendicularly. The area of the image is what fraction of the true area?', answer: 0.5, why: 'The area is multiplied by cos 60° = 0.5.' },
    { q: 'The image of the midpoint of a segment is always the midpoint of the image of the segment.', a: false, why: 'True for parallel projections, false for central ones, where the near half of a receding segment is drawn longer than the far half.' },
    { q: 'What is the cross-ratio (A, B; C, D) of four equally spaced points A, B, C, D?', choices: ['1', '4/3', '2', '3/4'], a: 1, why: 'With positions 0, 1, 2, 3: (2 × 2) / (1 × 3) = 4/3. Any projection of the four points gives the same number.' },
    { q: 'No map of the sphere can keep both angles and areas.', a: true, why: 'A map that keeps angles has the same scale in every direction at a point; to keep areas as well the scale would have to be 1 everywhere, which would make the map an isometry, and Gauss showed that the sphere has none.' }
  ],
  applications: [
    'Measuring from a single photograph: the cross-ratio lets a surveyor or a forensic analyst get distances along a line (a road, a fence) from its perspective image.',
    'Choosing a map: navigators use a conformal chart (angles kept), statisticians an equal-area map (areas kept).',
    'Checking drawings: knowing that a parallel projection must keep midpoints and ratios lets you spot errors in an axonometric sketch.',
    'Rectifying photographs: a homography (a projective map) restores true shape to a facade photographed at an angle.'
  ],
  history: 'Pappus of Alexandria (fourth century) knew the invariance of a ratio of ratios of four collinear points. Desargues and Pascal used projection to prove theorems in the seventeenth century; Michel Chasles (1837) and August Möbius named and used the "anharmonic" or double ratio; Karl von Staudt (1847) built geometry on it without any measurement. The word *affine* goes back to Euler (1748).',
  sources: ['H. S. M. Coxeter, *Projective Geometry* (2nd ed., 1974).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (2nd ed., 2003), chapter 2.', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987): properties of map projections.', 'Kirsti Andersen, *The Geometry of an Art* (2007).'],
  sim: 'wp-keeps-and-loses',
  construction: 'wp-what-is-kept'
},

{
  id: 'true-length-and-true-shape',
  parent: 'what-projection-is',
  title: 'True length and true shape',
  level: 1,
  short: 'A line shows its true length when it is parallel to the picture, a plane figure its true shape when its plane is. Tilted by θ, lengths along the slope and areas are multiplied by cos θ, while the width across the tilt is unchanged.',
  keywords: ['true length', 'true shape', 'foreshortening', 'cos', 'tilt', 'inclination', 'slope', 'rabatment', 'plan', 'right triangle'],
  prereq: ['what-projections-preserve', 'math:right-triangle-trig', 'math:pythagorean-theorem'],
  related: ['monge-method', 'true-length-by-rotation', 'auxiliary-views', 'developments', 'orthographic-projection', 'foreshortening'],
  body: `Everything measured on a drawing is a measurement of an image, and the image is rarely the same size as the thing. Two rules tell how much is lost in an orthographic view.

### Lines
A line segment of length $L$ at angle $\\theta$ to the picture plane has an image of length
$$p = L\\cos\\theta.$$
At $\\theta = 0$ (the line parallel to the picture) the image has the **true length**. As $\\theta$ grows the image shrinks, and at 90° (the line along the projectors) it is a point. The reverse is the everyday problem: given the image $p$ and the difference $h$ of the distances of the two ends from the picture plane, the true length is the hypotenuse of a right triangle,
$$L = \\sqrt{p^2 + h^2},\\qquad \\tan\\theta = \\frac{h}{p}.$$

### Plane figures
Take a plane figure whose plane is tilted by $\\theta$ about a line parallel to the picture. In the direction **along that line** (across the tilt) nothing changes; in the direction of **steepest slope** every length is multiplied by $\\cos\\theta$. So a rectangle $L \\times W$ with the tilt along $L$ becomes $L\\cos\\theta \\times W$, a circle of diameter $D$ becomes an ellipse with axes $D$ and $D\\cos\\theta$, and every area is multiplied by $\\cos\\theta$. In coordinates, tilting about the $x$-axis and projecting along $z$ is
$$\\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} 1 & 0 \\\\ 0 & \\cos\\theta \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\end{bmatrix}.$$
Angles change too, except those between the two special directions. The figure's **true shape** is seen only in the view in which its plane is parallel to the picture. In a view along the plane it is an **edge view**, a line.

### Getting the true quantity
- By a **view** in which the line or plane is parallel to the picture. If none of the given views will do, make a new one ([[auxiliary-views]]).
- By the **right triangle**, from one image and a difference of distances.
- By **rotation**: turn the thing about an axis perpendicular to a picture plane until it is parallel to the other ([[true-length-by-rotation]]), or fold the plane flat about one of its lines (rabatment).

In central projection there is a further loss: only a figure in a plane parallel to the picture plane keeps its shape, scaled by $d/z$; for a tilted figure the foreshortening varies from point to point.

### How it is drawn
The construction takes a tilted plate seen edge-on from the front. Its plan is shortened by $\\cos\\theta$; swinging it down about its lower edge with the compass gives the true length, and the plan is stretched back into the true shape.`,
  ideas: [
    'A line parallel to the picture shows its true length; at angle θ to it, the image is L cos θ; along the projectors it is a point.',
    'A plane figure is stretched by cos θ along the line of steepest slope and not at all across it: areas are multiplied by cos θ and circles become ellipses.',
    'The true length is the hypotenuse of a right triangle whose legs are the image length and the difference of distances from the picture plane.',
    'True shape needs a view in which the plane of the figure is parallel to the picture; the view along the plane is an edge view.'
  ],
  pitfalls: [
    'A shorter-looking line is a shorter line — It may be a long line tilted away from the picture. Always ask the angle to the plane.',
    'The plan area is the area of the surface — Only for a horizontal surface. A roof pitched at 35° has an area of plan area / cos 35°, 22 % more.',
    'A tilted circle becomes a smaller circle — It becomes an ellipse: one diameter keeps its length, the perpendicular one shrinks by cos θ.'
  ],
  formulas: [
    {
      name: 'Image of a tilted line',
      expr: 'p = L*cos(theta)',
      tex: 'p = L\\cos\\theta',
      vars: { p: { name: 'length of the image', q: 'length', unit: 'm' }, L: { name: 'true length', q: 'length', unit: 'm', value: 4.46 }, theta: { name: 'angle between the line and the picture plane', q: 'angle', unit: '°', value: 19.7, min: 0, max: 90 } },
      note: 'Orthographic projection. θ = 0: true length. θ = 90°: a point.'
    },
    {
      name: 'True length by the right triangle',
      expr: 'L = sqrt(p^2 + h^2)',
      tex: 'L = \\sqrt{p^2 + h^2}',
      vars: { L: { name: 'true length', q: 'length', unit: 'm' }, p: { name: 'length of the image', q: 'length', unit: 'm', value: 4.2 }, h: { name: 'difference of the distances of the ends from the picture plane', q: 'length', unit: 'm', value: 1.5 } },
      solveFor: 'L',
      note: 'The two legs are the image length and the depth difference measured in the other view; the hypotenuse is the true length.'
    },
    {
      name: 'Inclination from the image and the difference',
      expr: 'theta = atan(h/p)',
      tex: '\\theta = \\arctan\\frac{h}{p}',
      vars: { theta: { name: 'inclination of the line to the picture plane', q: 'angle', unit: '°' }, h: { name: 'difference of distances from the picture plane', q: 'length', unit: 'm', value: 1.5 }, p: { name: 'length of the image', q: 'length', unit: 'm', value: 4.2 } },
      solveFor: 'theta',
      note: 'The angle at the end in the right triangle of the previous formula.'
    },
    {
      name: 'Area of a tilted figure',
      expr: 'A1 = A*cos(theta)',
      tex: 'A_1 = A\\cos\\theta',
      vars: { A1: { name: 'area of the image', q: 'area', unit: 'm²', tex: 'A_1' }, A: { name: 'true area', q: 'area', unit: 'm²', value: 97.7 }, theta: { name: 'angle between the plane of the figure and the picture plane', q: 'angle', unit: '°', value: 35, min: 0, max: 90 } },
      note: 'For a roof pitched at θ the plan area is the roof area times cos θ.'
    }
  ],
  examples: [
    {
      title: 'A sloping pipe',
      q: 'A straight pipe rises 1.5 m while its plan is 4.2 m long. What is its true length and its inclination to the horizontal?',
      steps: [
        { text: 'The plan is an image of length $p = 4.2$ m and the difference of heights is $h = 1.5$ m:', tex: 'L = \\sqrt{4.2^2 + 1.5^2} = \\sqrt{19.89} = 4.46\\ \\text{m}' },
        { text: 'The inclination to the horizontal plane:', tex: '\\theta = \\arctan\\frac{1.5}{4.2} = 19.7°' }
      ],
      a: '4.46 m at 19.7° to the horizontal.'
    },
    {
      title: 'Roofing a pitched roof',
      q: 'A roof is seen on the plan to cover 80 m² and is pitched at 35°. How much roofing material is needed?',
      steps: [
        'The plan is the orthographic image of the roof on a horizontal plane; the roof is tilted by $\\theta = 35°$ to it.',
        { text: 'The true area is the plan area divided by $\\cos\\theta$:', tex: 'A = \\frac{80}{\\cos 35°} = \\frac{80}{0.819} = 97.7\\ \\text{m}^2' }
      ],
      a: '97.7 m², about 22 % more than the plan area.'
    }
  ],
  quiz: [
    { q: 'A 100 mm rod makes 30° with the picture plane and is projected perpendicularly. How many millimetres long is the image?', answer: 86.6, unit: 'mm', why: 'p = L cos 30° = 100 × 0.866 = 86.6 mm.' },
    { q: 'A square plate tilted 60° from the picture plane is projected perpendicularly. What fraction of its area does the picture show?', answer: 0.5, why: 'A₁ = A cos 60° = 0.5 A.' },
    { q: 'A circle in a tilted plane projects to a smaller circle.', a: false, why: 'It projects to an ellipse: the diameter parallel to the tilt axis keeps its length, the diameter along the slope shrinks by cos θ.' },
    { q: 'The plan of a sloping line is 6 m long and its ends differ in height by 8 m. How many metres long is the line?', answer: 10, unit: 'm', why: 'L = √(6² + 8²) = 10 m: the 3–4–5 triangle doubled.' },
    { q: 'Which method finds a true length without rotating anything?', choices: ['A section', 'The right triangle on the image length and the difference of distances', 'The cross-ratio', 'Hidden-line removal'], a: 1, why: 'The legs are the image length and the depth difference taken from the other view; the hypotenuse is the true length.' }
  ],
  applications: [
    'Roofing and surveying: slope area from plan area, slope distance from horizontal distance; a surveyor reduces a slope distance with the cosine of the angle.',
    'Pipework and sheet metal: the true length of a sloping run, and the true shape of a cut face, are found from two views before cutting.',
    'CAD: the command "look normal to" a face turns the view until the face is parallel to the screen, so its true shape and dimensions show.',
    'Photogrammetry and rectification: a photograph of a facade taken at an angle is stretched back to true shape by a projective map.',
    'Astronomy: the axis ratio of an apparent ellipse gives the tilt of a circular disc, cos i = b/a, which is how the inclination of spiral galaxies is estimated.'
  ],
  history: 'Finding the true length of a line and the true shape of a face was the daily problem of the stonecutters of the Renaissance and baroque (Philibert de l\'Orme, 1567; Frézier\'s treatise on stone cutting, 1737–39), who drew plan and elevation and then swung faces flat. Monge made these operations the first problems of descriptive geometry (1795).',
  sources: ['Gaspard Monge, *Géométrie descriptive* (1799).', 'Amédée-François Frézier, *La théorie et la pratique de la coupe des pierres* (1737–39).', 'Frederick E. Giesecke et al., *Technical Drawing*, the chapters on auxiliary views.', 'Gary R. Bertoline et al., *Technical Graphics Communication*.'],
  sim: 'wp-tilting-plate',
  construction: 'wp-true-length-and-shape'
}
);
