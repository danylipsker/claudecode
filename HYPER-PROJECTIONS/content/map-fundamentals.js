/* HYPER-PROJECTIONS · content/map-fundamentals.js — "What a map can keep": the theory every map page rests on.
 *
 *   why-the-sphere-cannot-be-flattened   Gauss, curvature, the orange peel
 *   tissot-indicatrix                    the ellipse that a small circle becomes: a, b, h, k, ω
 *   conformal-maps                       true angles
 *   equal-area-maps                      true areas
 *   equidistant-maps                     true distances from a point or along lines
 *   compromise-maps                      spreading the damage
 *   developable-surfaces                 plane, cylinder and cone
 *   aspects-of-a-projection              normal, transverse and oblique
 *   scale-factor-and-standard-parallels  where the map is true
 *   great-circles-and-rhumb-lines        the two kinds of straight line on a sphere
 *   choosing-a-projection                purpose first, then region
 * Simulations are in sims/map-fundamentals.js, constructions in constructions/map-fundamentals.js (ids mf-…).
 */
Hyper.add(
{
  id: 'why-the-sphere-cannot-be-flattened',
  parent: 'map-fundamentals',
  title: 'Why the sphere cannot be flattened',
  level: 1,
  short: 'A sphere has curvature and a plane has none, and curvature cannot be changed without stretching: so every flat map of any part of the Earth distorts lengths, angles or areas, and the only choice is which, and where.',
  keywords: ['Gauss', 'theorema egregium', 'curvature', 'orange peel', 'gores', 'spherical excess', 'distortion', 'flattening', 'map projection', 'impossible'],
  prereq: ['what-projections-preserve', 'math:triangles', 'math:solid-geometry'],
  related: ['tissot-indicatrix', 'developable-surfaces', 'conformal-maps', 'equal-area-maps', 'compromise-maps', 'polyhedral-maps'],
  body: `Take an orange, cut a hole in the peel and press the peel flat on the table. It splits, or it crumples, or it stretches until it tears. The label of a tin can lies flat without a murmur, and so does a paper cone. The difference is not "roundness" in general; it is one particular kind of roundness that the sphere has and the can does not, and it is the reason why every map of the Earth is a compromise.

### What Gauss proved
In 1827 Carl Friedrich Gauss showed that the way a surface curves can be measured **without leaving the surface**, with a tape and a protractor drawn on it. At every point there is a number $K$, the *Gaussian curvature*: the product of the largest and the smallest curvature of the surface there. For a sphere of radius $R$ it is $K = 1/R^2$ everywhere. For a plane it is $0$. For a cylinder or a cone it is also $0$, because one of the two curvatures is zero (a can curves round but not along). His *theorema egregium*, the "remarkable theorem", says that bending a surface without stretching it, which keeps every length and angle drawn on it, cannot change $K$. A flat copy of any piece of a sphere that kept all lengths would need $K = 0$ and $K = 1/R^2$ at once. It cannot exist, however small the piece.

### Three ways to see it
- **Triangles.** On a plane the angles of a triangle add up to 180°. On a sphere they add up to more, and the *excess* is the area measured in units of $R^2$: $E = A/R^2$. Take the North Pole and two points on the equator a quarter of the way round from each other: three right angles, a sum of 270°, and one eighth of the globe.
- **Circles.** A circle of radius $d$ on the plane has circumference $2\\pi d$. A circle of radius $d$ drawn on the sphere (measured along the surface) has only $2\\pi R \\sin(d/R)$. The circle 10 008 km from the North Pole is the equator: 40 030 km round, not 62 880 km.
- **Distances.** The pole and three points on the equator 120° apart are each 10 008 km from the pole and 13 343 km from one another. On a flat sheet three points that are 10 008 km from a centre and 120° apart are 17 334 km from one another, 30 % too far. No flat sheet can carry all six distances of these four points.

### So a map must choose
Because lengths cannot all survive, a map gives up something. It can keep **angles** exactly (a [[conformal-maps|conformal]] map), or **areas** exactly (an [[equal-area-maps|equal-area]] map), or **distances** along chosen lines ([[equidistant-maps|equidistant]]), or spread the damage evenly ([[compromise-maps|compromise]]). It can never keep angles and areas together, since that would keep every length. The damage at a point is measured by [[tissot-indicatrix|Tissot's indicatrix]].

### Small is almost flat
The excess $E = A/R^2$ shrinks with the area. A triangle 10 km on a side has an excess of a few thousandths of an arcsecond; one 1000 km on a side has about 0.6°; a triangle spanning a continent, tens of degrees. That is why a town plan can be drawn on a flat sheet with no trace of distortion and a world map cannot. It is also why the same sheet can be bent into a *cylinder* or a *cone* and unrolled without stretching: these [[developable-surfaces]] have $K = 0$, and a map projection first carries the sphere onto one of them.

> [!key] An orange peel is a good map-maker's tool: cut it into narrow strips from pole to pole (gores) and each strip flattens with only a little stretching. The construction below draws one gore point by point; two gores laid side by side touch only at the equator.`,
  ideas: [
    'A sphere has constant positive curvature 1/R², a plane has zero; curvature cannot change without stretching (Gauss), so no flat map can keep all lengths.',
    'The angles of a spherical triangle add up to more than 180°; the excess is the area divided by R². A circle on a sphere is shorter than its flat twin.',
    'A map keeps angles (conformal), areas (equal-area), distances along chosen lines, or spreads the damage; it cannot keep angles and areas together.',
    'Distortion grows with the size of the region: a town is flat, a continent is not.'
  ],
  pitfalls: [
    'The Earth is not a perfect sphere, which is why it cannot be flattened — The Earth\'s flattening is a third of a per cent; a perfect sphere cannot be flattened either, and neither can the ellipsoid. The obstacle is curvature, not the shape\'s imperfections.',
    'A better projection would fix it — No projection can remove the distortion; a projection only decides where it goes and what form it takes.',
    'Cutting the sphere solves the problem — Cutting (gores, interrupted maps) removes the stretching by tearing, but tears are themselves a distortion: neighbouring places end up far apart on the sheet.'
  ],
  formulas: [
    {
      name: 'Spherical excess',
      expr: 'E = A/R^2',
      tex: 'E = \\frac{A}{R^2}',
      vars: { E: { name: 'angle sum minus 180°', q: 'angle', unit: '°' }, A: { name: 'area of the triangle', q: 'area', unit: 'km²', value: 500000 }, R: { const: 'Rearth', tex: 'R' } },
      note: 'The sum of the angles of a spherical triangle is 180° plus the area divided by R², in radians. A triangle of 500 000 km² (roughly Spain) has an excess of 0.7°. The octant, one eighth of the globe (63.8 million km²), has 90°.'
    },
    {
      name: 'Circumference of a circle on the sphere',
      expr: 'C = 2*pi*R*sin(d/R)',
      tex: 'C = 2\\pi R\\,\\sin\\frac{d}{R}',
      vars: { C: { name: 'circumference', q: 'length', unit: 'km' }, d: { name: 'radius, measured along the surface', q: 'length', unit: 'km', value: 1000, min: 1, max: 10000 }, R: { const: 'Rearth', tex: 'R' } },
      note: 'The flat circle of the same radius would be 2πd. At d = 1000 km the sphere\'s circle is 0.4 % shorter; at a quarter of the way round (10 008 km) it is 36 % shorter.'
    }
  ],
  examples: [
    {
      title: 'The octant: three right angles',
      q: 'Take the North Pole N and two points A and B on the equator 90° of longitude apart. What are the angles and sides of the spherical triangle NAB, what fraction of the globe does it cover, and what flat triangle has the same three sides?',
      steps: [
        'Each side is a quarter of a great circle: $\\tfrac{\\pi}{2} R = 10\\,008$ km. At each corner the meridians meet the equator at right angles, and at the pole the two meridians are 90° apart: three angles of 90°.',
        { text: 'The angle sum is 270°, an excess of 90° = $\\pi/2$ radians, so the area is', tex: 'A = E R^2 = \\tfrac{\\pi}{2}(6371)^2 = 63.8\\ \\text{million km}^2' },
        'The globe has $4\\pi R^2 = 510$ million km², so the triangle is exactly one eighth of it.',
        'A flat triangle with three sides of 10 008 km is equilateral, with three angles of 60°: each corner is 30° off, and the area $\\tfrac{\\sqrt3}{4}\\,(10\\,008)^2 = 43.4$ million km² is 32 % too small.'
      ],
      a: 'Three angles of 90°, area 63.8 million km² (one eighth of the globe); the flat triangle with the same sides has angles of 60° and a third too little area.'
    },
    {
      title: 'How small is small enough?',
      q: 'A town plan covers 10 km × 10 km, a national map 1000 km × 1000 km. By how much does a circle of that radius on the ground differ in length from its flat twin?',
      steps: [
        { text: 'The circle on the sphere has $C = 2\\pi R\\sin(d/R)$; the flat one $2\\pi d$. The ratio expands as', tex: '\\frac{C}{2\\pi d} = \\frac{\\sin(d/R)}{d/R} \\approx 1 - \\frac{d^2}{6R^2}' },
        'For $d = 10$ km: $d^2/(6R^2) = 100/(6 \\times 40.59 \\times 10^6) = 4 \\times 10^{-7}$, or four parts in ten million: 0.00004 %. Far below the thickness of a pencil line.',
        'For $d = 1000$ km: $10^6/(2.44 \\times 10^8) = 0.0041$: the circle is 0.4 % short, 25.8 km out of 6283.',
        'The error grows with the square of the size: ten times the distance, a hundred times the error.'
      ],
      a: 'A 10 km plan is out by 4 parts in 10 million (invisible); a 1000 km region by 0.4 %. Doubling the size quadruples the error.'
    }
  ],
  quiz: [
    { q: 'Why can a cylinder be unrolled flat but a sphere cannot?', choices: ['A cylinder is smaller', 'A cylinder has zero Gaussian curvature, the sphere has 1/R², and curvature cannot change without stretching', 'The sphere has no edges to cut along', 'A cylinder is made of a different material'], a: 1, why: 'Gauss\'s theorem: bending without stretching leaves the curvature unchanged. The cylinder\'s curvature is 0, the same as the plane\'s, so it unrolls; the sphere\'s is 1/R², so it does not.' },
    { q: 'The angles of a spherical triangle add up to', choices: ['exactly 180°', 'less than 180°', 'more than 180°', 'exactly 360°'], a: 2, why: 'On a sphere the angle sum is 180° plus the area divided by R² (in radians): always more than 180°.' },
    { q: 'A spherical triangle on the Earth has angles of 80°, 70° and 60°. What is its area, in millions of square kilometres (R = 6371 km)?', answer: 21.2, why: 'The excess is 210° − 180° = 30° = 0.5236 rad, and A = E R² = 0.5236 × 40.59 million km² = 21.2 million km².' },
    { q: 'Which pair of properties can a single map keep everywhere at once?', choices: ['angles and areas', 'angles and all distances', 'areas and all distances', 'none of these pairs'], a: 3, why: 'Keeping angles and areas would make every scale 1 and keep all lengths, which curvature forbids. Each projection keeps at most one of these exactly (or none, in a compromise).' },
    { q: 'On a small enough region the sphere can be mapped with negligible distortion.', a: true, why: 'The distortion grows with the square of the size; a town of 10 km across is flat to four parts in ten million.' }
  ],
  applications: [
    'Paper globes and balloon maps are pasted up from printed gores, narrow leaf-shaped strips, because a strip flattens with little stretching where a whole hemisphere would not.',
    'Cartography and GIS: every spatial dataset needs a projection, and the choice is a choice of which distortion to accept.',
    'Tailoring and sailmaking: a flat piece of cloth must be cut into darts and curved panels to fit a body or a sail, for the same reason that gores are curved.',
    'Pressing sheet metal into domes and tank ends, and laying composite or plywood skins over curved hulls: the flat sheet has to shear and stretch, and the designer works out where.',
    'Wide-angle photography: a flat sensor cannot show a hemisphere without stretching the edges, which is why fisheye pictures bend straight lines.'
  ],
  history: 'The problem is as old as maps of the world. Printed gores for paper globes appear in 1507, when Martin Waldseemüller published a set of twelve for a globe of the known world. Leonhard Euler proved in the 1770s that no piece of a sphere can be mapped to the plane preserving all distances; Gauss, in his *Disquisitiones generales circa superficies curvas* of 1827, found the reason in general: curvature is intrinsic to a surface. Johann Heinrich Lambert\'s 1772 treatise on map projection and Gauss\'s 1822 prize essay on conformal mapping had by then turned the problem from a complaint into mathematics.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the introduction.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Carl Friedrich Gauss, *Disquisitiones generales circa superficies curvas* (1827).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995), the chapter on map projections.'],
  sim: 'mf-sphere-triangle',
  construction: 'mf-orange-peel'
},

{
  id: 'tissot-indicatrix',
  parent: 'map-fundamentals',
  title: 'Tissot\'s indicatrix',
  level: 2,
  short: 'The ellipse that a tiny circle of the globe becomes on the map. Its semi-axes a and b are the largest and smallest scales at that point; a = b means true angles, ab = 1 means true areas, and ω = 2 arcsin((a − b)/(a + b)) is the worst angular error.',
  keywords: ['Tissot', 'indicatrix', 'distortion ellipse', 'semi-axes', 'angular distortion', 'omega', 'scale factor', 'h', 'k', 'principal directions', 'circles'],
  prereq: ['why-the-sphere-cannot-be-flattened', 'math:ellipse', 'math:trigonometry'],
  related: ['conformal-maps', 'equal-area-maps', 'scale-factor-and-standard-parallels', 'compromise-maps', 'mercator-projection'],
  body: `Draw a tiny circle on the globe and see what a map makes of it. On a perfect map it would come out as a circle of the right size; on a real map it comes out as an **ellipse**, a circle stretched in one direction and squeezed in another. **Tissot's indicatrix** is that ellipse. Draw it at one point and you have every fact about the distortion there; draw it at a grid of points and you can see the whole map's character at a glance.

### What the ellipse says
Call its semi-axes $a$ (long) and $b$ (short), in units where a ground circle of radius 1 is drawn with radius 1. They are the **extreme scales** at the point: along the long axis the map stretches lengths by $a$, along the perpendicular short axis by $b$, and by something in between in every other direction. In general the axes do not lie along the meridian and the parallel. If we call $h$ the scale along the meridian, $k$ the scale along the parallel and $\\theta'$ the angle at which their images cross, then
$$a^2 + b^2 = h^2 + k^2, \\qquad ab = hk\\sin\\theta'.$$
Where the grid is orthogonal on the map ($\\theta' = 90°$), the axes of the ellipse *are* the meridian and parallel directions and $\\{a, b\\} = \\{h, k\\}$.

### Reading the shape
- **$a = b$**: the ellipse is a circle. Every direction is stretched alike, so every angle is true: the map is [[conformal-maps|conformal]]. (The circle may still be bigger or smaller than the original.)
- **$ab = 1$**: the ellipse has the area of the ground circle: the map is [[equal-area-maps|equal-area]]. (The shape may be anything.)
- **$a = b = 1$**: a perfect copy; impossible on a sphere.
- **Neither**: angles and areas both change, as in the compromise maps.

The **area scale** is $s = ab$. The largest change in any angle on the map is
$$\\omega = 2\\arcsin\\frac{a - b}{a + b}.$$
For a circle ($a = b$) $\\omega = 0$. For $a = 2$, $b = 1$ it is 38.9°. It reaches 90° only when $b \\to 0$, a map that has crushed one direction to nothing.

### One ellipse is not enough
Tissot's idea is to draw the ellipses everywhere: a field of identical ground circles, say every 30° of latitude and longitude. A conformal map shows a field of circles of varying size; an equal-area map shows ellipses of one area and many shapes; a compromise map shows a mixed field, with the smallest ellipses and the smallest eccentricities that the map-maker could arrange. The simulation on this page draws them for forty projections.

### Drawing one by hand
Given $h$ and $k$ at a point where the grid is orthogonal, take the radius $r$ of the ground circle, lay off $a = k r$ along the parallel and $b = h r$ along the meridian, and draw the ellipse by the two-circle method with a compass: this is the construction below.`,
  ideas: [
    'A small circle on the globe becomes an ellipse on the map; its semi-axes a ≥ b are the largest and smallest scales at that point.',
    'a = b: conformal (true angles). ab = 1: equal-area. Both at once only if a = b = 1, which is impossible on a sphere.',
    'a² + b² = h² + k² and ab = hk sin θ′, where h and k are the scales along meridian and parallel and θ′ the angle between their images.',
    'The largest angular error is ω = 2 arcsin((a − b)/(a + b)); the area scale is ab.'
  ],
  pitfalls: [
    'A circle in the indicatrix means the map is accurate there — It means the angles are true (conformal), but the circle can be any size: on Mercator at 60° the circle is twice as large as it should be, and four times the area.',
    'An equal-area map has no shape distortion — Equal area says nothing about shape: the Lambert cylindrical map at 60° squashes every shape to a quarter of its height (a : b = 4 : 1).',
    'The axes of the ellipse are the meridian and the parallel — Only where they cross at right angles. On the sinusoidal map at 45° N, 90° E the meridian and parallel cross at 42°, and the ellipse is tilted.'
  ],
  formulas: [
    {
      name: 'Largest angular distortion',
      expr: 'omega = 2*asin((a - b)/(a + b))',
      tex: '\\omega = 2\\arcsin\\frac{a - b}{a + b}',
      vars: { omega: { name: 'largest angle change', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\omega' }, a: { name: 'major semi-axis', value: 2, min: 0.001, max: 100 }, b: { name: 'minor semi-axis', value: 1, min: 0.001, max: 100 } },
      note: 'a and b are the largest and smallest scales at the point (a ≥ b). Enter ω and one axis to find the other: ω = 60° needs a = 3b; ω = 10° needs a = 1.19 b.'
    },
    {
      name: 'Area scale from the grid scales',
      expr: 's = h*k*sin(theta)',
      tex: 's = ab = h\\,k\\,\\sin\\theta\'',
      vars: { s: { name: 'area scale' }, h: { name: 'scale along the meridian', value: 1.495, min: 0.01, max: 50 }, k: { name: 'scale along the parallel', value: 1, min: 0.01, max: 50 }, theta: { name: 'angle between the images of meridian and parallel', q: 'angle', unit: '°', value: 42, min: 1, max: 179, tex: '\\theta\'' } },
      note: 'On the sinusoidal map at 45° N, 90° E: h = 1.495, k = 1, θ′ = 42° and the area scale is 1.00 — equal-area, though the grid is far from orthogonal.'
    },
    {
      name: 'The indicatrix of a conformal map',
      expr: 'a = 1/cos(phi)',
      tex: 'a = b = \\sec\\varphi',
      vars: { a: { name: 'both semi-axes (Mercator)' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'On Mercator the indicatrix is a circle of radius sec φ times that on the equator: twice as big at 60°, 5.8 times at 80°.'
    }
  ],
  examples: [
    {
      title: 'The plate carrée at 60° N',
      q: 'On the equirectangular map (x = λ, y = φ) the meridian scale is h = 1 and the parallel scale is k = sec φ. Find a, b, the area scale and ω at 60° N, and say what a ground circle of radius 500 km becomes.',
      steps: [
        'At 60° N, $k = 1/\\cos 60° = 2$ and $h = 1$. The grid is orthogonal (meridians vertical, parallels horizontal), so $a = 2$ (along the parallel) and $b = 1$ (along the meridian).',
        'Area scale: $ab = 2$. The map draws everything at 60° N twice as large as it is.',
        { text: 'Largest angular error:', tex: '\\omega = 2\\arcsin\\frac{2 - 1}{2 + 1} = 2\\arcsin\\tfrac13 = 38.9°' },
        'The ground circle of radius 500 km becomes an ellipse 1000 km wide (east–west) and 500 km high, in ground-scale units.'
      ],
      a: 'a = 2, b = 1, area scale 2, ω = 38.9°; the 500 km circle becomes an ellipse 1000 × 500 km, with twice the area.'
    },
    {
      title: 'A skewed grid: the sinusoidal map',
      q: 'On the sinusoidal map at 45° N, 90° E the engine reports h = 1.495 and k = 1.000, and the images of meridian and parallel cross at an angle θ′. Equal area says ab = 1. Find θ′, then a and b.',
      steps: [
        { text: 'From $ab = hk\\sin\\theta\'$ with $ab = 1$:', tex: '\\sin\\theta\' = \\frac{1}{1.495 \\times 1} = 0.669 \\;\\Rightarrow\\; \\theta\' = 42.0°' },
        { text: 'Add the two relations: $(a + b)^2 = h^2 + k^2 + 2ab = 2.235 + 1 + 2 = 5.235$, and $(a - b)^2 = 3.235 - 2 = 1.235$. So', tex: 'a + b = 2.288, \\quad a - b = 1.111 \\;\\Rightarrow\\; a = 1.70,\\ b = 0.59' },
        { text: 'Then', tex: '\\omega = 2\\arcsin\\frac{1.111}{2.288} = 58.1°' }
      ],
      a: 'The meridian and the parallel meet at 42° instead of 90°; a = 1.70, b = 0.59, ω = 58°. The map is equal-area but heavily sheared there.'
    }
  ],
  quiz: [
    { q: 'On a map, the indicatrix at every point is a circle (of varying size). The map is', choices: ['equal-area', 'conformal', 'equidistant', 'a perfect copy of the globe'], a: 1, why: 'Circles mean a = b: all directions are stretched alike, so angles are true. The varying size shows the scale changes from point to point.' },
    { q: 'At a point a = 3 and b = 1. What is the largest angular distortion ω, in degrees?', answer: 60, unit: '°', why: 'ω = 2 arcsin((3 − 1)/(3 + 1)) = 2 arcsin(0.5) = 60°.' },
    { q: 'On an equal-area map every indicatrix is a circle.', a: false, why: 'Equal area means ab = 1, not a = b. The two coincide only where a = b = 1, which a map can have at a point or along a line but never everywhere.' },
    { q: 'What is the area scale of the Mercator map at latitude 75°?', answer: 14.9, why: 'The indicatrix is a circle of radius sec 75°, so the area scale is sec² 75° = 1/cos² 75° = 14.9.' },
    { q: 'Could a map have a = b and ab = 1 at every point?', choices: ['Yes, the Mercator map', 'Yes, the Lambert map', 'No: it would have a = b = 1 everywhere and keep every length, which a sphere does not allow', 'Only on the equator'], a: 2, why: 'a = b and ab = 1 give a = b = 1: every distance preserved, an isometry. Gauss\'s theorem forbids it.' }
  ],
  applications: [
    'Choosing a projection: software draws Tissot circles over a candidate map so the user can see where the distortion falls before committing.',
    'Teaching and communication: a world map with Tissot circles shows, without a formula, why Greenland looks too big on Mercator and why Africa looks stretched on Gall–Peters.',
    'Designing projections: the compromise maps (Robinson, Winkel tripel, Natural Earth) are tuned until the field of indicatrices looks as mild as possible everywhere.',
    'Quality checking of geographic data: a georeferenced scan whose control circles come out as ellipses has been put in the wrong projection.'
  ],
  history: 'Nicolas Auguste Tissot, a French cartographer, introduced the indicatrix in a series of papers from 1859 and gave the full theory in his *Mémoire sur la représentation des surfaces et les projections des cartes géographiques* (1881). The mathematics, the infinitesimal scale at a point and the extreme scales along perpendicular directions, goes back to Lagrange and Gauss; Tissot\'s gift was the picture, which twentieth-century cartographers made the standard way to show distortion.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the section on distortion and Tissot\'s indicatrix.', 'N. A. Tissot, *Mémoire sur la représentation des surfaces et les projections des cartes géographiques* (1881).', 'Bugayevskiy and Snyder, *Map Projections: A Reference Manual* (1995).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: 'mf-tissot-explorer',
  construction: 'mf-tissot-ellipse'
},

{
  id: 'conformal-maps',
  parent: 'map-fundamentals',
  title: 'Conformal maps: true angles',
  level: 2,
  short: 'Maps that keep every angle, so small shapes keep their shape and a course of constant compass bearing is a straight line; the price is that the scale changes from place to place and large regions swell. Mercator, stereographic, Lambert\'s conic and the transverse Mercator are the family.',
  keywords: ['conformal', 'angle-preserving', 'orthomorphic', 'Mercator', 'stereographic', 'Lambert conformal conic', 'complex analytic', 'rhumb line', 'scale', 'shape'],
  prereq: ['tissot-indicatrix', 'why-the-sphere-cannot-be-flattened', 'math:trigonometry'],
  related: ['equal-area-maps', 'mercator-projection', 'stereographic-projection', 'lambert-conformal-conic', 'transverse-mercator-and-utm', 'great-circles-and-rhumb-lines', 'charts-and-navigation'],
  body: `A map is **conformal** (the older word is *orthomorphic*, "right-shaped") when it keeps every angle: wherever two lines cross on the globe they cross at the same angle on the map. Everything small keeps its shape: a street corner, the bend of a river, the outline of a harbour. That is why surveyors and navigators prize it. In [[tissot-indicatrix|Tissot's language]] the indicatrix is a circle at every point, $a = b$, and $\\omega = 0$.

### The price
Stretching all directions equally is still stretching, and the amount must change from place to place: if it were the same everywhere the map would be a copy of the globe. At each point the scale is some $k$, the same in every direction; the area scale is $k^2$. A small object is drawn in its true shape but at the local size; a large one is bent, because $k$ is different at its two ends. On Mercator $k = \\sec\\varphi$: 2 at 60°, 2.9 at 70°, so an island at 72° N is drawn with $\\sec^2 72° = 10.5$ times its true area. Greenland (2.2 million km²) is drawn as 22 million km², three quarters of Africa's 30 million. Nothing is wrong with the angles; it is the sizes that mislead.

### Where conformal maps come from
Conformal maps of the plane are exactly the **analytic functions** of a complex variable: $w = f(z)$ with $f'(z) \\ne 0$ near $z$ is a rotation by $\\arg f'$ and a stretching by $|f'|$, the same in every direction. That gives a recipe. Take the polar stereographic projection of the sphere, which is conformal and sends the point at latitude $\\varphi$, longitude $\\lambda$ to $z = \\tan(\\tfrac{\\pi}{4} - \\tfrac{\\varphi}{2})\\,e^{i\\lambda}$ (up to a constant). Then:
- its **logarithm**, $\\ln z = -\\ln\\tan(\\tfrac{\\pi}{4} + \\tfrac{\\varphi}{2}) + i\\lambda$, is the [[mercator-projection|Mercator]] map: $x = \\lambda$, $y = \\ln\\tan(\\tfrac\\pi4 + \\tfrac\\varphi2)$, the cylinder;
- its **power** $z^n$ is Lambert's [[lambert-conformal-conic|conformal conic]] with cone constant $n$;
- $z$ itself is the [[stereographic-projection|stereographic]], in which every circle on the sphere is a circle on the map.

### Straight lines of constant bearing
Because angles are kept, a line that crosses every meridian at the same angle on the globe (a **rhumb line**) crosses the straight, parallel meridians of Mercator at the same angle: it is a straight line. A navigator measures the bearing on the chart and steers it. On the cone of Lambert the meridians converge, so a straight line is *nearly* a rhumb line only over a limited span; but it is very nearly a great circle, which is why aeronautical charts use it.

### Which conformal map
Mercator for the tropics and for sea charts; the **transverse Mercator** (the cylinder turned on its side) for narrow north–south strips such as the UTM grid zones; Lambert's conic for mid-latitude east–west regions; the stereographic for the polar caps and for circular regions. In each the scale error is least along the line of contact, one or two standard lines.`,
  ideas: [
    'Conformal means true angles: the indicatrix is a circle everywhere (a = b, ω = 0). Small shapes are kept, large ones are not.',
    'The scale is the same in all directions at a point but changes from point to point; the area scale is k², so area is not kept (Mercator: sec² φ).',
    'Conformal maps of the sphere are analytic functions of the stereographic image: the logarithm gives Mercator, a power gives the Lambert conic.',
    'A conformal map can never also be equal-area: that would force a = b = 1 and keep every length.'
  ],
  pitfalls: [
    'Conformal means the map shows the world "as it is" — It keeps angles and local shapes, not sizes. Mercator is conformal and shows Greenland ten times too large in area.',
    'Conformal and equal-area are two ways of being nearly right — They are mutually exclusive: both at once would mean an exact scale-1 copy, which Gauss forbids.',
    'Any straight line on a conformal map is a rhumb line — Only where the meridians are parallel straight lines, as on Mercator. On a conic the meridians converge and a straight line crosses them at changing angles.'
  ],
  formulas: [
    {
      name: 'Mercator scale',
      expr: 'k = 1/cos(phi)',
      tex: 'k = \\sec\\varphi',
      vars: { k: { name: 'scale, the same in every direction' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'The scale relative to the equator: 1.15 at 30°, 2 at 60°, 5.76 at 80°. The cylinder has stretched every parallel by sec φ and Mercator stretches the meridians by the same factor.'
    },
    {
      name: 'Stereographic scale',
      expr: 'k = 2*k0/(1 + cos(c))',
      tex: 'k = \\frac{2k_0}{1 + \\cos c}',
      vars: { k: { name: 'scale in every direction' }, k0: { name: 'scale at the centre', value: 1, min: 0.5, max: 1.5, tex: 'k_0' }, c: { name: 'angular distance from the centre of the map', q: 'angle', unit: '°', value: 60, min: 0, max: 150 } },
      note: 'With k₀ = 1 the scale is 1.07 at 30° from the centre, 1.33 at 60°, 2 at 90°: a hemisphere fits in a disc of radius 2R, with the rim twice too large.'
    },
    {
      name: 'Area scale of a conformal map',
      expr: 's = k^2',
      tex: 's = k^2',
      vars: { s: { name: 'area scale' }, k: { name: 'linear scale', value: 2, min: 0.1, max: 20 } },
      note: 'Equal stretching in two perpendicular directions: the area changes by the square. Greenland at 72° on Mercator: k = 3.24, s = 10.5.'
    }
  ],
  examples: [
    {
      title: 'A compass course across the Indian Ocean',
      q: 'On a Mercator chart a ship sails from Cape Town (33.93° S, 18.42° E) to Perth (31.95° S, 115.86° E) holding one compass bearing. What is it, and how long is the route, compared with the great circle (8697 km)?',
      steps: [
        { text: 'Mercator ordinates: $\\psi = \\ln\\tan(45° + \\varphi/2)$ gives $\\psi_1 = -0.6302$ and $\\psi_2 = -0.5890$, so $\\Delta\\psi = 0.0412$. The longitude difference is $\\Delta\\lambda = 97.44° = 1.7006$ rad.', tex: '\\theta = \\arctan\\frac{\\Delta\\lambda}{\\Delta\\psi} = \\arctan\\frac{1.7006}{0.0412} = 88.6°' },
        'The line on the chart is nearly horizontal and rises a little to the right: a bearing of 088.6°, almost due east.',
        { text: 'Along a rhumb line the latitude changes by $d\\cos\\theta$ per unit distance, so', tex: 'd = \\frac{R\\,\\Delta\\varphi}{\\cos\\theta} = \\frac{6371 \\times 0.03456}{\\cos 88.6°} = 9095\\ \\text{km}' },
        'The great circle would start on 120.7° and dip down to 44° S, but it is only 8697 km: the rhumb line is 4.6 % longer.'
      ],
      a: 'Steer 088.6° throughout; the route is 9095 km, 400 km more than the great circle.'
    },
    {
      title: 'How big does Greenland look?',
      q: 'Greenland (2.17 million km², centred at about 72° N) and Africa (30.4 million km², centred near the equator) are drawn on a Mercator map. By what factor is Greenland\'s area exaggerated, and how big does it look compared with Africa?',
      steps: [
        { text: 'The area scale at 72° N is the square of the linear scale:', tex: 's = \\sec^2 72° = \\frac{1}{0.309^2} = 10.5' },
        'Greenland is drawn with the area of $2.17 \\times 10.5 = 22.8$ million km² (it extends nearly to 83° N, so the real figure on the map is a little larger).',
        'Africa lies between 35° N and 35° S; most of it is within a factor 1.5 of the equatorial scale, so say 33 million.',
        'On the map Greenland looks about 70 % of the size of Africa; in truth it is 7 %.'
      ],
      a: 'Exaggerated about 10.5 times: it appears about three quarters the size of Africa, though it is about a fourteenth.'
    }
  ],
  quiz: [
    { q: 'What does a conformal map preserve?', choices: ['areas', 'angles', 'distances from the centre', 'straight great circles'], a: 1, why: 'Conformal (angle-preserving): lines cross at the same angle on the map as on the globe. Local shapes follow.' },
    { q: 'On a Mercator map, how many times larger is a length at latitude 60° than the same length on the equator?', answer: 2, why: 'k = sec 60° = 2, in every direction.' },
    { q: 'A map can be both conformal and equal-area.', a: false, why: 'Conformal requires a = b; equal-area requires ab = 1. Both together give a = b = 1, an exact copy of the sphere, which Gauss showed impossible.' },
    { q: 'Which of these is not conformal?', choices: ['Mercator', 'stereographic', 'Lambert conformal conic', 'Mollweide'], a: 3, why: 'Mollweide is equal-area. The other three keep every angle.' },
    { q: 'Why are straight lines on a Mercator chart useful to a sailor?', choices: ['They are the shortest routes', 'They are lines of constant bearing, which can be measured with a protractor and steered with a compass', 'They show distances correctly', 'They avoid the poles'], a: 1, why: 'Mercator is conformal and its meridians are parallel straight lines, so a line crossing them at a fixed angle is a straight line: a rhumb line.' }
  ],
  applications: [
    'Sea and air charts: Mercator for the sea, Lambert conformal conic for aeronautical charts, so a bearing can be taken with a protractor.',
    'National survey grids: the transverse Mercator (UTM and many national grids) and the Lambert conic keep local angles so that surveying measurements transfer to the map with only a small scale correction.',
    'Web maps: Web Mercator keeps street corners square at every zoom, which is why tiles look right at any scale.',
    'Polar charts: the polar stereographic is conformal and circles stay circles, the standard for Arctic and Antarctic navigation and ice mapping.',
    'Engineering and physics: conformal mappings of the plane solve potential-flow and electrostatic problems.'
  ],
  history: 'The stereographic projection is credited to Hipparchus, about 150 BC; Gerardus Mercator\'s chart of 1569 made the idea practical for navigation. Johann Heinrich Lambert put conformal mapping on a mathematical footing in 1772, introducing the conformal conic and the transverse Mercator, and Joseph-Louis Lagrange in 1779 found all the conformal maps of the sphere in which meridians and parallels are circles. Gauss\'s prize essay of 1822 solved the general problem of mapping one surface conformally onto another, and made the connection with analytic functions that is the modern way to see it.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on conformal projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Bugayevskiy and Snyder, *Map Projections: A Reference Manual* (1995), the chapter on conformal mapping.', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: { id: 'mf-tissot-explorer', params: { proj: 'mercator' } },
  construction: 'mf-conformal-vs-equal-area'
},

{
  id: 'equal-area-maps',
  parent: 'map-fundamentals',
  title: 'Equal-area maps',
  level: 2,
  short: 'Maps on which every region has the right share of the sheet: areas can be compared, densities and totals are honest, and the price is shape, which is sheared or squashed more the further from the centre or from the standard lines.',
  keywords: ['equal-area', 'equivalent', 'authalic', 'Lambert', 'Albers', 'Mollweide', 'Gall-Peters', 'Archimedes', 'hat-box theorem', 'area scale', 'sinusoidal', 'Equal Earth'],
  prereq: ['tissot-indicatrix', 'why-the-sphere-cannot-be-flattened', 'math:surface-area'],
  related: ['conformal-maps', 'lambert-cylindrical-equal-area', 'lambert-azimuthal-equal-area', 'albers-equal-area-conic', 'mollweide-projection', 'equal-earth-and-natural-earth', 'compromise-maps'],
  body: `A map is **equal-area** (or *equivalent*, or *authalic*) when every region occupies on the sheet the same fraction of its area as every other: a square centimetre of map stands for the same number of square kilometres everywhere. In Tissot's terms the area scale is constant, $ab = 1$ in units where the globe is drawn at scale 1. If a region of the map is a tenth of the sheet, it is a tenth of the world.

### Why you want it
Whenever a number per unit area is shown (population density, rainfall, forest cover, the spread of a species), the eye adds up area. A map that inflates the north and shrinks the tropics tells a story the data do not. Equal-area maps make comparisons of extent honest: Greenland is a fourteenth of Africa, India a third of Russia.

### Archimedes' hat-box
Archimedes proved that the area of a zone of a sphere between two parallel planes is $2\\pi R h$, where $h$ is the distance between the planes. The cylinder wrapped round the sphere has the same area for the same height. So project each point **horizontally outward from the axis** onto the cylinder: a point at latitude $\\varphi$ goes to height $y = R\\sin\\varphi$, and zones keep their area. Unrolled, this is **Lambert's cylindrical equal-area** map of 1772: $x = R\\lambda$, $y = R\\sin\\varphi$. The parallel of 30° N, at half the height, cuts the northern hemisphere into two zones of equal area. The same idea projected from the centre of a disc gives Lambert's azimuthal equal-area map, $\\rho = 2R\\sin(c/2)$; other forms give Albers' conic, Mollweide, the sinusoidal map, Eckert IV and VI and Equal Earth.

### What it costs
Since the product of the two scales is 1, if one is stretched the other must be squeezed, and the angles change. In the Lambert cylindrical map the meridian scale is $\\cos\\varphi$ and the parallel scale $\\sec\\varphi$: the shape of anything is stretched east–west by $\\sec^2\\varphi$ relative to north–south, 2 at 45°, 4 at 60° and 33 at 80°. Compromises exist: choose standard parallels at 45° (Gall–Peters) and the squashing is balanced between the tropics and high latitudes; use curved meridians (Mollweide, Eckert IV, Equal Earth) and the poles stop being stretched lines. But no equal-area map is also [[conformal-maps|conformal]].

> [!tip] An equal-area map is easy to test: lay a coin on the globe at different places and draw round it; the coin\'s outline on the map must always enclose the same area, even if its shape has changed. [[tissot-indicatrix|Tissot\'s ellipses]] on an equal-area map all have the same area.`,
  ideas: [
    'Equal-area (equivalent): the area scale ab is the same everywhere, so regions can be compared by area on the sheet.',
    'Archimedes\' hat-box theorem: projecting horizontally from the axis onto the cylinder keeps zone areas; y = R sin φ is Lambert\'s cylindrical equal-area map.',
    'If one scale is stretched the other is squeezed (h·k = 1 on an orthogonal grid); angles and shapes are distorted, most near the edges of the map.',
    'Use for any density, distribution or total; never also conformal.'
  ],
  pitfalls: [
    'Equal-area maps show shapes correctly — They show areas correctly; shapes are sheared or squashed. In Lambert\'s cylindrical map at 60° every shape is squashed 4 : 1.',
    'All equal-area maps look alike — They differ widely: the sinusoidal map is a leaf, Mollweide an ellipse, Lambert\'s azimuthal a disc, Albers a fan. Only the area scale is common.',
    'Gall–Peters is the only fair map — It is one equal-area map among dozens, and its tropical stretching is heavy. Equal Earth, Mollweide or Eckert IV are equally fair and look more familiar.'
  ],
  formulas: [
    {
      name: 'Lambert cylindrical equal-area ordinate',
      expr: 'y = R*sin(phi)',
      tex: 'y = R\\sin\\varphi',
      vars: { y: { name: 'distance of the parallel from the equator on the map', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, min: -90, max: 90, signed: true, tex: '\\varphi' } },
      note: 'The parallel of 30° is at half the height of the pole: y = R/2. The map is a rectangle 2πR wide and 2R high.'
    },
    {
      name: 'Area of a zone of the sphere',
      expr: 'A = 2*pi*R^2*(sin(phi2) - sin(phi1))',
      tex: 'A = 2\\pi R^2\\,(\\sin\\varphi_2 - \\sin\\varphi_1)',
      vars: { A: { name: 'area of the zone', q: 'area', unit: 'km²' }, R: { const: 'Rearth', tex: 'R' }, phi1: { name: 'southern parallel', q: 'angle', unit: '°', value: 35, min: -90, max: 90, signed: true, tex: '\\varphi_1' }, phi2: { name: 'northern parallel', q: 'angle', unit: '°', value: 70, min: -90, max: 90, signed: true, tex: '\\varphi_2' } },
      note: 'Archimedes\' theorem: 2πR times the height R(sin φ₂ − sin φ₁). The zone from 35° to 70° N, which holds Europe and most of North America, is 18 % of the globe.'
    },
    {
      name: 'Lambert azimuthal equal-area radius',
      expr: 'rho = 2*R*sin(c/2)',
      tex: '\\rho = 2R\\sin\\frac{c}{2}',
      vars: { rho: { name: 'distance from the centre on the map', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 0, max: 180 } },
      note: 'The whole globe fits in a disc of radius 2R. Radial scale cos(c/2), scale across the radius sec(c/2): their product is 1.'
    },
    {
      name: 'Shape distortion of Lambert\'s cylinder',
      expr: 'r = 1/cos(phi)^2',
      tex: 'r = \\frac{a}{b} = \\sec^2\\varphi',
      vars: { r: { name: 'ratio of the semi-axes a : b' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'Every circle becomes an ellipse stretched east–west: 2 : 1 at 45°, 4 : 1 at 60°, 8.5 : 1 at 70°.'
    }
  ],
  examples: [
    {
      title: 'How much of the world lies between 35° and 70° N?',
      q: 'Use Archimedes\' formula to find the area of the zone between 35° N and 70° N, and the fraction of the globe it holds. How high is it on a Lambert cylindrical equal-area map with R = 100 mm?',
      steps: [
        { text: 'The area is', tex: 'A = 2\\pi R^2(\\sin 70° - \\sin 35°) = 2\\pi (6371)^2 (0.9397 - 0.5736) = 93.4 \\times 10^6\\ \\text{km}^2' },
        'The globe has $4\\pi R^2 = 510$ million km², so the zone holds $93.4/510 = 18.3\\ \\%$ of it.',
        'On the map the two parallels are at $y = 100\\sin 70° = 94.0$ mm and $100\\sin 35° = 57.4$ mm: the band is 36.6 mm high, and it is the full 628 mm wide (2πR).',
        'Check: the band has area $628 \\times 36.6 = 22\\,990$ mm², and the whole map $628 \\times 200 = 125\\,664$ mm²: again 18.3 %.'
      ],
      a: '93.4 million km², 18.3 % of the globe; on the map it is a band 36.6 mm high, whose area is the same 18.3 % of the sheet.'
    },
    {
      title: 'Shape distortion of the Lambert cylinder',
      q: 'On a Lambert cylindrical equal-area map, a circular lake at 70° N is drawn. How far from a circle is its outline, and what are its scales?',
      steps: [
        'Along the meridian the scale is $\\cos 70° = 0.342$; along the parallel $\\sec 70° = 2.924$.',
        { text: 'The lake is drawn as an ellipse with axes in the ratio', tex: 'a : b = \\frac{2.924}{0.342} = \\sec^2 70° = 8.5' },
        'Its area is $ab = 2.924 \\times 0.342 = 1.00$ times a circle\'s: correct. Its shape is a flat ellipse, nearly nine times wider than high.',
        { text: 'The largest change of angle is', tex: '\\omega = 2\\arcsin\\frac{8.5 - 1}{8.5 + 1} = 2\\arcsin 0.789 = 104°' }
      ],
      a: 'Area exactly right, shape squashed 8.5 : 1 east–west; angles at the lake are changed by up to 104°.'
    }
  ],
  quiz: [
    { q: 'On a Lambert cylindrical equal-area map, the parallel of 30° N is how far up from the equator to the pole?', choices: ['one third of the way', 'one half of the way', 'two thirds of the way', 'one sixth of the way'], a: 1, why: 'y = R sin 30° = R/2, half the height R of the pole. The zones 0–30° and 30–90° have equal areas.' },
    { q: 'What percentage of the globe lies between the equator and 30° N?', answer: 25, why: 'The zone area is 2πR² sin 30° = πR², which is a quarter of 4πR².' },
    { q: 'An equal-area map keeps shapes true.', a: false, why: 'It keeps areas. Because the two scales multiply to 1, one stretches while the other squeezes and shapes are sheared.' },
    { q: 'Which of these maps is equal-area?', choices: ['Mercator', 'Stereographic', 'Mollweide', 'Robinson'], a: 2, why: 'Mollweide spaces its parallels so that every zone keeps its area. Mercator and stereographic are conformal; Robinson is a compromise with no exact property.' },
    { q: 'On an equal-area map, a circle of 500 km radius on the globe is drawn as an ellipse. What do you know about its area?', choices: ['It is larger than the circle\'s area near the poles', 'It equals the area of the circle drawn at the map\'s scale', 'It depends on the longitude', 'It is smaller than the circle\'s area at the edge'], a: 1, why: 'Equal area means ab = 1 everywhere: the ellipse has the same area as the circle would, however its shape changed.' }
  ],
  applications: [
    'Thematic and statistical atlases: population density, land use, climate zones and species ranges are normally drawn on an equal-area projection.',
    'Remote sensing and ecology: counting pixels to measure forest loss, ice extent or crop area needs an equal-area grid (Lambert azimuthal, Albers, or the cylindrical forms).',
    'National and continental maps: the United States and Europe use Albers or Lambert azimuthal equal-area maps for official statistics.',
    'World maps for reference: Equal Earth, Mollweide and Eckert IV give a recognisable world with true areas.',
    'Astronomy: all-sky catalogues are plotted in the Hammer and Mollweide equal-area ovals so that star counts per area compare directly.'
  ],
  history: 'Archimedes proved the hat-box theorem in *On the Sphere and Cylinder* (about 225 BC) but it was not used for a map for two thousand years. Johann Heinrich Lambert described the cylindrical and azimuthal equal-area projections in 1772; Heinrich Christian Albers published the conic in 1805, the year of Karl Mollweide\'s ellipse. James Gall presented his orthographic cylindrical in 1855; Arno Peters promoted the same map as new in 1973, which started a long argument; and Šavrič, Patterson and Jenny designed Equal Earth in 2018 to keep true areas with the look of Robinson.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on cylindrical, azimuthal and conic equal-area projections.', 'Archimedes, *On the Sphere and Cylinder* (about 225 BC).', 'Bernhard Šavrič, Tom Patterson and Bernhard Jenny, "The Equal Earth map projection", *International Journal of Geographical Information Science* 33 (2019).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: { id: 'mf-tissot-explorer', params: { proj: 'mollweide' } },
  construction: 'mf-archimedes-cylinder'
},

{
  id: 'equidistant-maps',
  parent: 'map-fundamentals',
  title: 'Equidistant maps',
  level: 2,
  short: 'Maps on which distances are true along chosen lines: from one centre (azimuthal equidistant) or along every meridian (plate carrée, equidistant conic). Never all distances; but from the centre, bearing and distance can be read straight off the map.',
  keywords: ['equidistant', 'azimuthal equidistant', 'plate carrée', 'equidistant conic', 'two-point equidistant', 'distance from a point', 'bearing', 'radius', 'UN emblem', 'Postel'],
  prereq: ['tissot-indicatrix', 'why-the-sphere-cannot-be-flattened', 'math:polar-coordinates'],
  related: ['azimuthal-equidistant-projection', 'two-point-equidistant-projection', 'equirectangular-projection', 'equidistant-conic-projection', 'conformal-maps', 'equal-area-maps', 'great-circles-and-rhumb-lines'],
  body: `No flat map keeps all distances; "equidistant" therefore always means *true along certain lines*, never everywhere. Three kinds are in use.

- **From a point.** On the **azimuthal equidistant** map every place is plotted at its true great-circle distance and true bearing from the centre: the distance $d$ on the globe becomes the radius $\\rho = R\\,c$ with $c = d/R$, at the bearing from the centre. Draw circles about the centre every 2000 km and straight lines at every bearing and you can read off both quantities for the centre at a glance.
- **Along the meridians.** The **plate carrée** ($x = \\lambda$, $y = \\varphi$), the **equidistant conic** and the sinusoidal projection's meridians keep the length of every meridian, so north–south distances are true everywhere. The plate carrée also keeps the equator, or, with a standard parallel $\\varphi_1$, that parallel.
- **From two points.** Maurer\'s **two-point equidistant** map (1919) keeps the distances from two chosen points, such as two cities: every other place is placed by its two true distances.

### What goes wrong
All other distances are wrong. On the azimuthal map centred on Tel Aviv the distance from London to Tokyo, measured on the map, is 10 090 km; the true figure is 9558 km, 5.5 % less. The reason is the stretching across the radius: a circle of radius $c$ about the centre has circumference $2\\pi R\\sin c$ on the globe but $2\\pi R c$ on the map, so the scale across the radius is
$$k = \\frac{c}{\\sin c}.$$
It is 1 at the centre, 1.21 at 60°, 1.57 at 90° (a quarter of the way round) and grows without limit as $c \\to 180°$: the whole rim of the map is a single point, the antipode. The map is neither conformal nor equal-area; its area scale is the same $c/\\sin c$.

### Drawing one by hand
The construction below plots ten cities from Tel Aviv with a protractor (the bearing) and a scale (the distance), exactly as the engine does. That is how a polar azimuthal equidistant map can be made by a hand with nothing but a compass, a protractor and a table of distances.

> [!fact] The emblem of the United Nations is a polar azimuthal equidistant map: the North Pole at the centre, the world out to about 60° S, circled by olive branches. Seismologists use the same geometry when they draw circles of epicentral distance round each recording station.`,
  ideas: [
    'Equidistant means distances are true along chosen lines, never everywhere: from one point (azimuthal), along the meridians (plate carrée, equidistant conic), or from two points.',
    'On the azimuthal equidistant map the radius is the true distance, ρ = R c, and the bearing is true; the scale across the radius is c/sin c.',
    'Distances between other places are wrong, increasingly so far from the centre; the rim of a world map is one point, the antipode.',
    'It is easy to make by hand: rings by compass, rays by protractor.'
  ],
  pitfalls: [
    'An equidistant map shows all distances correctly — Only those from the centre (or along the meridians). Between two other points the error can be large: 5.5 % for London–Tokyo on the Tel Aviv map.',
    'The plate carrée is distortion-free because it is a plain grid — It keeps meridian lengths and angles at the equator only; elsewhere east–west lengths are stretched by sec φ, so an area at 60° is drawn twice as large.',
    'Straight lines are great circles on any equidistant map — Only the straight lines through the centre of an azimuthal map. Elsewhere on it, and everywhere on the plate carrée, they are not.'
  ],
  formulas: [
    {
      name: 'Scale across the radius (azimuthal equidistant)',
      expr: 'k = c/sin(c)',
      tex: 'k = \\frac{c}{\\sin c}',
      vars: { k: { name: 'scale across the radius' }, c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 1, max: 179 } },
      note: 'k = 1 at the centre and on every ray (the radial scale is exactly 1): 1.21 at 60°, 1.57 at 90°, 2.09 at 120°, 5.2 at 150°.'
    },
    {
      name: 'Radius on the map',
      expr: 'rho = d/N',
      tex: '\\rho = \\frac{d}{N}',
      vars: { rho: { name: 'distance from the centre on the map', q: 'length', unit: 'cm' }, d: { name: 'true distance on the ground', q: 'length', unit: 'km', value: 7536 }, N: { name: 'scale denominator (1 : N)', value: 100000000, min: 1000, max: 1e10, fixed: true } },
      note: 'At 1 : 100 million, 1 cm stands for 1000 km, and Cape Town (7536 km from Tel Aviv) is plotted 7.54 cm from the centre, on the bearing 195°.'
    },
    {
      name: 'Great-circle distance from the angle at the centre',
      expr: 'd = R*c',
      tex: 'd = R\\,c',
      vars: { d: { name: 'distance along the surface', q: 'length', unit: 'km' }, R: { const: 'Rearth', tex: 'R' }, c: { name: 'angular distance', q: 'angle', unit: '°', value: 90, min: 0, max: 180 } },
      note: 'One degree of arc is 111.2 km; a quarter of the way round, 10 008 km. This is the number laid off with the compass in the construction.'
    }
  ],
  examples: [
    {
      title: 'Plotting a city from Tel Aviv',
      q: 'On an azimuthal equidistant map centred on Tel Aviv at the scale 1 : 100 million, where is Cape Town, which is 7536 km away on the bearing 195° (measured clockwise from north)?',
      steps: [
        'Distance on the map: $7536\\ \\text{km} / 10^8 = 7.536\\ \\text{cm}$ (1 cm stands for 1000 km).',
        'Draw a ray from the centre at 195° clockwise from the vertical north line: that is 15° beyond south, towards the west.',
        { text: 'Lay off 7.54 cm along it. In coordinates (x east, y north) the point is', tex: '(x, y) = 7.54\\,(\\sin 195°, \\cos 195°) = (-1.95, -7.28)\\ \\text{cm}' },
        'The scale across the radius there is $c/\\sin c$ with $c = 7536/6371 = 1.183$ rad: $1.183/0.9266 = 1.28$, so the African coast near Cape Town is stretched sideways by 28 %.'
      ],
      a: '7.54 cm from the centre on the bearing 195°, at (−1.95, −7.28) cm; shapes there are stretched across the radius by 28 %.'
    },
    {
      title: 'Measuring London to Tokyo on the Tel Aviv map',
      q: 'The map centred on Tel Aviv puts London and Tokyo at their true distances from the centre (3560 km on 318°, 9160 km on 52°). What distance do you measure on the map between London and Tokyo?',
      steps: [
        'The angle at the centre between the two rays is $52° - (318° - 360°) = 94°$.',
        { text: 'By the law of cosines on the flat map:', tex: 'd^2 = 3560^2 + 9160^2 - 2(3560)(9160)\\cos 94° = 12.67\\times10^6 + 83.9\\times10^6 + 4.55\\times10^6' },
        'so $d = \\sqrt{101.1\\times10^6} = 10\\,055$ km, close to the 10 090 km of the full computation.',
        'The true distance is 9558 km: the map reads about 5 % long, because the great-circle triangle London–Tel Aviv–Tokyo has an angle sum above 180°, and a flat triangle with the same two sides and angle has a different third side.'
      ],
      a: 'About 10 050 to 10 090 km on the map, 5 % more than the true 9558 km: the two cities are not on a ray from the centre.'
    }
  ],
  quiz: [
    { q: 'On an azimuthal equidistant map centred on Paris, what is true?', choices: ['all distances', 'distances and bearings from Paris', 'all angles', 'all areas'], a: 1, why: 'Only the distance and the bearing from the centre. Distances between other places are distorted.' },
    { q: 'What is the scale across the radius of an azimuthal equidistant map at 60° from the centre? (c/sin c)', answer: 1.21, why: 'c = 60° = 1.0472 rad, sin 60° = 0.8660, so k = 1.0472/0.8660 = 1.209.' },
    { q: 'A map can be equidistant from every point at once.', a: false, why: 'That would keep every distance and make the map an exact copy. At most it can be exact from one or two points, or along a family of lines such as the meridians.' },
    { q: 'What does the rim of a whole-world azimuthal equidistant map stand for?', choices: ['the equator', 'the date line', 'a single point, the antipode of the centre', 'the horizon'], a: 2, why: 'Every direction at 180° from the centre arrives at the same point; on the map that single point is spread over the entire rim, stretched infinitely.' },
    { q: 'The plate carrée (x = λ, y = φ) is equidistant along', choices: ['the meridians', 'every parallel', 'every great circle', 'rhumb lines'], a: 0, why: 'x = λ, y = φ gives the meridian scale 1 everywhere; the parallel scale is sec φ and only the equator is true.' }
  ],
  applications: [
    'Air and radio: range rings round an airport, a transmitter or a rescue base show true distance in every direction.',
    'The United Nations emblem and many airline route maps are polar or city-centred azimuthal equidistant maps.',
    'Seismology and geophysics: epicentre location from three or more stations uses circles of true epicentral distance.',
    'Amateur radio and satellite dishes: a beam-heading map centred on the station gives bearing and distance in one picture.',
    'Spreadsheets and data tools: the plate carrée is the "no projection" of a latitude-longitude grid, the map of a 360° photograph and of most raw geographic data.'
  ],
  history: 'The azimuthal equidistant projection is very old: the Persian scholar al-Biruni used it around the year 1000 to show a hemisphere, and Guillaume Postel\'s world map of 1581 made the polar form famous in Europe. Marinus of Tyre\'s plain grid, about AD 100, is the plate carrée. Hans Maurer devised the two-point equidistant map in 1919. The emblem of the United Nations, designed in 1945 and adopted in 1947, is a polar azimuthal equidistant map.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on the azimuthal equidistant and equidistant conic projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: 'mf-from-a-city',
  construction: 'mf-equidistant-from-a-city'
},

{
  id: 'compromise-maps',
  parent: 'map-fundamentals',
  title: 'Compromise maps',
  level: 2,
  short: 'World maps that keep no property exactly but keep every kind of distortion small: the Robinson, Winkel tripel, Natural Earth, Kavrayskiy VII and Miller maps, made by averaging, squeezing, tabulating or fitting, and judged by their average distortion over the globe.',
  keywords: ['compromise', 'Robinson', 'Winkel tripel', 'Natural Earth', 'Kavrayskiy VII', 'Miller', 'Van der Grinten', 'average distortion', 'Goldberg Gott', 'pleasing', 'world map'],
  prereq: ['conformal-maps', 'equal-area-maps', 'equidistant-maps'],
  related: ['robinson-projection', 'winkel-tripel', 'equal-earth-and-natural-earth', 'kavrayskiy-and-wagner', 'van-der-grinten', 'miller-and-gall-stereographic', 'choosing-a-projection'],
  body: `Since no map can be both [[conformal-maps|conformal]] and [[equal-area-maps|equal-area]], and none can keep all distances, a map-maker who wants a picture of the whole world that simply *looks right* may choose to keep nothing exactly and instead make every kind of distortion small. These are the **compromise maps**: Robinson, Winkel tripel, Natural Earth, Kavrayskiy VII, Van der Grinten, Miller and their relatives. They are the maps of wall charts, school atlases and magazines.

### How they are made
There is no single recipe, but four are common.
- **Average two maps.** Oswald Winkel\'s *tripel* (German for "triple", for the three kinds of distortion balanced) takes the mean of the plate carrée and Aitoff\'s map. Each is exact along some lines and wrong elsewhere in a different way; averaged, the errors tend to cancel.
- **Squeeze a classic.** Osborn Miller (1942) shrinks the latitudes by 0.8, applies Mercator\'s formula and stretches the result by 1.25: $y = 1.25\\,R\\ln\\tan(45° + 0.4\\varphi)$. It keeps the look of Mercator but puts the poles a finite distance away.
- **Design by eye and tabulate.** Arthur Robinson (1963) decided, for every 5° of latitude, how long the parallel should be and how far from the equator, until the map looked right, and published a table; the computer interpolates it. There is no formula.
- **Fit a formula.** Kavrayskiy VII, $x = \\tfrac32\\lambda\\sqrt{\\tfrac13 - (\\varphi/\\pi)^2}$, $y = \\varphi$, and Wagner VI are simple closed forms; Natural Earth (2008) is a polynomial fitted to a pleasing outline.

### Judging them
Compare them by the average distortion over the globe, weighted by area. Averaging over a 10° grid, the **typical angular distortion** ω and the **typical area error** come out, for example, as 21° and 16 % for Robinson, 23° and 15 % for Winkel tripel, 20° and 17 % for Natural Earth, against 0° and 76 % for the conformal Mercator and 32° and 0 % for the equal-area Mollweide. A compromise map has far less area error than a conformal map and less angular distortion than an equal-area one, at the price of both being non-zero. Goldberg and Gott (2007) tested the common world maps on distortion measures of this kind and found the Winkel tripel among the best. The simulation below plots all of them.

### What they give up
Nothing can be measured with them: neither angles, nor areas, nor distances. Poles are lines, high latitudes are stretched and the shapes near the edges are skewed. They are for *looking at*: a reference or wall map of the world. Use a [[conformal-maps|conformal]] map for navigation and survey, an [[equal-area-maps|equal-area]] one for any density or total, an [[equidistant-maps|equidistant]] one for distances from a chosen place.

> [!fact] The Winkel tripel has been the National Geographic Society\'s world map since 1998; before that it used the Robinson (1988–1998) and, from 1922 to 1988, Van der Grinten\'s map, which swells the polar regions to fit the world into a circle.`,
  ideas: [
    'A compromise map keeps no property exactly; it makes angle, area and distance errors all small and balanced over the globe.',
    'They are made by averaging two maps (Winkel tripel), squeezing a classic (Miller), tabulating a design by eye (Robinson) or fitting a formula (Kavrayskiy VII, Natural Earth).',
    'The quality is the average distortion over the globe: typically 15–25° of angle and 15–25 % of area error, against 0 and 76 % for Mercator.',
    'Good for looking at the world, wrong for measuring anything.'
  ],
  pitfalls: [
    'A compromise map is the most accurate world map — It is the least bad all round. For any one purpose (angles, areas, distance from a point) a specialised map is better.',
    'Winkel tripel and Robinson are almost equal-area — Their area errors are 15 % and 16 % on average, and much larger towards the poles; they are not for density maps.',
    'Compromise means halfway between conformal and equal-area — It means averaging errors, which may land near either property or neither. Miller, for example, is close to Mercator in angle, far from it in size.'
  ],
  formulas: [
    {
      name: 'Miller\'s ordinate',
      expr: 'y = 1.25*R*ln(tan(pi/4 + 0.4*phi))',
      tex: 'y = 1.25\\,R\\ln\\tan\\left(\\frac{\\pi}{4} + 0.4\\varphi\\right)',
      vars: { y: { name: 'distance of the parallel from the equator on the map', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: -90, max: 90, signed: true, tex: '\\varphi' } },
      note: 'At 60° the parallel lies at 119.7 (R = 100), between the plate carrée (104.7) and Mercator (131.7). At the pole y = 2.30 R.'
    },
    {
      name: 'Kavrayskiy VII abscissa',
      expr: 'x = 1.5*lam*sqrt(1/3 - (phi/pi)^2)',
      tex: 'x = \\tfrac32\\,\\lambda\\sqrt{\\tfrac13 - \\left(\\frac{\\varphi}{\\pi}\\right)^2}',
      vars: { x: { name: 'horizontal position, in units of R' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 90, min: -180, max: 180, signed: true, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: -90, max: 90, signed: true, tex: '\\varphi' } },
      note: 'The ordinate is simply y = φ (in radians). At (90° E, 60° N): x = 1.111, y = 1.047 — between the sinusoidal (0.785) and the plate carrée (1.571).'
    },
    {
      name: 'A compromise by averaging two maps',
      expr: 'x = (1 - w)*x1 + w*x2',
      tex: 'x = (1 - w)\\,x_1 + w\\,x_2',
      vars: { x: { name: 'abscissa on the compromise map' }, x1: { name: 'abscissa on the first map', value: 1.571, tex: 'x_1' }, x2: { name: 'abscissa on the second map', value: 0.785, tex: 'x_2' }, w: { name: 'weight of the second map', value: 0.5, min: 0, max: 1 } },
      note: 'The Winkel tripel uses w = 1/2 for both coordinates, with the plate carrée (standard parallel 50.46°) and Aitoff as the two maps. Any weight from 0 to 1 gives a family.'
    }
  ],
  examples: [
    {
      title: 'Where Miller puts the 60th parallel',
      q: 'With R = 100 mm, find the distance from the equator of the parallel of 60° on the plate carrée, on Mercator and on Miller\'s map.',
      steps: [
        'Plate carrée: $y = R\\varphi = 100 \\times 1.0472 = 104.7$ mm.',
        'Mercator: $y = R\\ln\\tan(45° + 30°) = 100 \\times 1.3170 = 131.7$ mm.',
        { text: 'Miller: squeeze 60° to $0.8\\times 60° = 48°$, apply Mercator\'s formula and stretch by 1.25:', tex: 'y = 1.25 \\times 100 \\times \\ln\\tan(45° + 24°) = 1.25 \\times 100 \\times 0.9575 = 119.7\\ \\text{mm}' },
        'Miller sits between the two, about half-way. At the pole Miller reaches $1.25\\times100\\times\\ln\\tan 81° = 230$ mm: finite, where Mercator\'s is infinite.'
      ],
      a: '104.7 mm, 131.7 mm and 119.7 mm: Miller is in between.'
    },
    {
      title: 'Reading the distortion budget',
      q: 'From the numbers in the text, compare Winkel tripel (ω 23°, area error 15 %) and Mollweide (ω 32°, area error 0) for a map that shows the density of population. Which would you choose, and why?',
      steps: [
        'A density map divides a count by the area it is drawn over. If the map\'s areas are wrong, a dense region drawn too large looks sparse and a sparse one drawn too small looks dense.',
        'The Winkel tripel is wrong in area by 15 % on average, and much more near the poles; that biases the density the eye reads.',
        'The Mollweide has no area error at all. Its angular distortion is larger (32° against 23°), so shapes are more sheared, but a density map is read by area, not by shape.',
        'Choose the Mollweide, or better still an equal-area map with gentler shearing such as Equal Earth.'
      ],
      a: 'The Mollweide (or Equal Earth): zero area error matters more than a few degrees of shape for a density map.'
    }
  ],
  quiz: [
    { q: 'Miller\'s map is made from Mercator\'s by', choices: ['averaging it with the plate carrée', 'squeezing the latitudes by 0.8 and stretching the result by 1.25', 'tabulating by eye', 'turning the cylinder through 90°'], a: 1, why: 'y = 1.25 R ln tan(45° + 0.4φ): the latitude is multiplied by 0.8 before Mercator\'s formula, and the answer by 1.25 afterwards.' },
    { q: 'Miller\'s ordinate for latitude 45° with R = 100 (to one decimal place) is', answer: 84.3, why: 'y = 1.25 × 100 × ln tan(45° + 18°) = 125 × ln 1.9626 = 125 × 0.6743 = 84.3.' },
    { q: 'The Winkel tripel is the average of which two maps?', choices: ['Mercator and Mollweide', 'the plate carrée and Aitoff\'s map', 'Robinson and Natural Earth', 'Lambert and Albers'], a: 1, why: 'Winkel\'s tripel (1921) averages the equirectangular map (standard parallel arccos(2/π) = 50.46°) and Aitoff\'s modified azimuthal map.' },
    { q: 'A compromise map preserves no property exactly.', a: true, why: 'That is the definition: neither angles nor areas nor distances are exactly right anywhere except along special lines; the aim is only to keep every error small.' },
    { q: 'Compared with the equal-area Mollweide map, the Robinson map has', choices: ['less angular distortion but some area error', 'more angular distortion and some area error', 'no angular distortion', 'the same distortion'], a: 0, why: 'On average Robinson shows about 21° of angular distortion against 32° for Mollweide, but pays about 16 % of area error where Mollweide has none.' }
  ],
  applications: [
    'Wall maps, school atlases and magazines: the Winkel tripel and the Robinson are the standard faces of the world.',
    'Web and presentation graphics when the point is to look at the world, with no measurement planned: the Natural Earth projection is built into many mapping tools for this.',
    'Posters of global data where the exact area of each country is not the point: a compromise is less jarring than Mercator or a sheared equal-area map.',
    'Comparative studies of projections use the same average-distortion measures to rank them.'
  ],
  history: 'The Dutch-born Alphons van der Grinten published his circular map in 1904, and Oswald Winkel\'s tripel dates from 1921. Osborn Miller of the American Geographical Society devised the squeezed Mercator in 1942; Kavrayskiy proposed his formula in 1939. Arthur Robinson designed his by eye for Rand McNally in 1963, and the National Geographic Society adopted it in 1988 and replaced it with the Winkel tripel in 1998. Tom Patterson\'s Natural Earth appeared in 2008, and Goldberg and Gott ranked projections by their measures of distortion in 2007.',
  sources: ['John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), the chapters on the twentieth century.', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995), on the Robinson projection.', 'David M. Goldberg and J. Richard Gott III, "Flexion and skewness in map projections of the Earth", *Cartographica* 42 (2007).', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987).'],
  sim: 'mf-distortion-budget',
  construction: 'mf-miller-compromise'
},

{
  id: 'developable-surfaces',
  parent: 'map-fundamentals',
  title: 'Cylinder, cone and plane: the developable surfaces',
  level: 1,
  short: 'The three surfaces onto which the sphere is first projected, because a sheet of paper can be bent into them and unrolled again without stretching: the plane, the cylinder and the cone, each tangent (touching along one line) or secant (cutting along two).',
  keywords: ['developable', 'cylinder', 'cone', 'plane', 'tangent', 'secant', 'apex', 'sector', 'cone constant', 'unrolling', 'standard parallel'],
  prereq: ['why-the-sphere-cannot-be-flattened', 'math:solid-geometry', 'math:angle-measure'],
  related: ['aspects-of-a-projection', 'scale-factor-and-standard-parallels', 'conic-projections', 'cylindrical-projections', 'azimuthal-projections', 'developments'],
  body: `Of all the shapes into which a sheet of paper can be bent without stretching or tearing, three matter for maps: the **plane**, the **cylinder** and the **cone**. They are the *developable surfaces*, those with zero [[why-the-sphere-cannot-be-flattened|Gaussian curvature]]: they can be unrolled flat again with no distortion at all. The sphere cannot be flattened, but it can be *projected* onto one of these three surfaces, and the surface unrolled. The projection carries all the distortion; the unrolling carries none.

### The three surfaces
- **The plane** touches the globe at a point (tangent) or cuts it along a circle (secant). The result is an *azimuthal* map: parallels become concentric circles, meridians straight rays.
- **The cylinder**, with its axis along the polar axis, touches along the equator or cuts along two parallels. Unrolled, meridians are parallel straight lines and parallels are straight lines at right angles to them: a *cylindrical* map.
- **The cone**, also with its axis along the polar axis, touches along a parallel $\\varphi_1$ or cuts along two. Unrolled, it is a sector: meridians are straight lines meeting at the apex and parallels are concentric arcs: a *conic* map.

Seen from the side, the sphere is a circle, and each surface is one or two straight lines: the plane a horizontal at the pole, the cylinder two verticals at the equator, the cone two tangents to the circle at the ends of a parallel. The three are one family: tilt the tangent of a cone from nearly vertical (a cylinder, apex at infinity) to nearly horizontal (a plane, apex at the pole).

### The cone in numbers
A cone tangent along the parallel $\\varphi_1$ has its apex on the axis at height $R/\\sin\\varphi_1$ above the centre; the straight distance from the apex to the parallel (the tangent length) is $R\\cot\\varphi_1$. Cut along a meridian and unrolled, it is a sector of that radius whose arc is the whole length of the parallel, $2\\pi R\\cos\\varphi_1$, so its angle is
$$\\theta = \\frac{2\\pi R\\cos\\varphi_1}{R\\cot\\varphi_1} = 2\\pi\\sin\\varphi_1.$$
The factor $n = \\sin\\varphi_1$ is the **cone constant**: the fraction of a full turn the sector spans. At $\\varphi_1 = 30°$ the sector is a half-disc; at 45° it is 255°; as $\\varphi_1 \\to 90°$ it becomes the full circle of the plane, and as $\\varphi_1 \\to 0°$ it shrinks to a sliver that is the cylinder. A longitude difference $\\Delta\\lambda$ becomes an angle $n\\Delta\\lambda$ at the apex.

### Tangent or secant
A tangent surface touches along one *standard line* where the map is exactly to scale. A secant surface cuts the sphere along two, and the scale is true on both, a little small between them and a little large outside; spread like this the error stays smaller over a wide belt. See [[scale-factor-and-standard-parallels]].

### Geometry or formula
How the parallels are spaced on the developed surface is a separate choice. Project from the centre, from the axis, from a pole, or by a formula (equal-area, conformal, equidistant): each gives another conic map on the same cone. The surface decides the *shape of the graticule*; the formula decides the spacing.`,
  ideas: [
    'Plane, cylinder and cone are developable (zero curvature): they unroll without stretching. The sphere is projected onto one of them, then it is unrolled.',
    'Each can be tangent (true scale along one line) or secant (true along two).',
    'A cone tangent at φ₁ has apex height R/sin φ₁, slant R cot φ₁, and unrolls to a sector of angle 2π sin φ₁; n = sin φ₁ is the cone constant.',
    'The cylinder (φ₁ → 0) and the plane (φ₁ → 90°) are the limits of the cone.'
  ],
  pitfalls: [
    'A map projection is a physical wrapping of paper round the globe — Only a few are literally geometric (the central cylindrical, the gnomonic). Most, including Mercator, are mathematical, and the surface only supplies the shape of the graticule.',
    'The cone is a different idea from the cylinder — It is the same one: a cylinder is a cone with its apex at infinity, a plane a cone opened to 180°.',
    'The sector of an unrolled cone is a full 360° — It is only 2π sin φ₁ wide (231° for 40°). The whole 360° of longitude is squeezed into it, so meridians are drawn closer together, in angle, than on the globe; only the plane (φ₁ = 90°) has the full turn.'
  ],
  formulas: [
    {
      name: 'Cone constant',
      expr: 'n = sin(phi1)',
      tex: 'n = \\sin\\varphi_1',
      vars: { n: { name: 'cone constant (fraction of a full turn)' }, phi1: { name: 'tangent parallel', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: 'A tangent cone at 30° has n = 0.5; at 40° n = 0.643; as φ₁ → 90° n → 1 (the plane).'
    },
    {
      name: 'Angle of the unrolled sector',
      expr: 'theta = 2*pi*sin(phi1)',
      tex: '\\theta = 2\\pi\\sin\\varphi_1',
      vars: { theta: { name: 'angle of the sector at the apex', q: 'angle', unit: '°', tex: '\\theta' }, phi1: { name: 'tangent parallel', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: '231.4° for φ₁ = 40°; exactly 180° (a half-disc) for 30°; 360° only in the limit of the plane.'
    },
    {
      name: 'Slant length of the tangent cone',
      expr: 'rho = R/tan(phi1)',
      tex: '\\rho_1 = R\\cot\\varphi_1',
      vars: { rho: { name: 'radius of the unrolled standard parallel', q: 'length', unit: 'mm', tex: '\\rho_1' }, R: { name: 'radius of the globe', q: 'length', unit: 'mm', value: 100 }, phi1: { name: 'tangent parallel', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: 'The length of the tangent from the apex to the circle: 119.2 mm for R = 100 mm and 40°. The arc of that radius and angle θ is 2πR cos φ₁.'
    },
    {
      name: 'Height of the apex above the centre',
      expr: 'h = R/sin(phi1)',
      tex: 'h = \\frac{R}{\\sin\\varphi_1}',
      vars: { h: { name: 'apex height above the centre of the globe', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe', q: 'length', unit: 'mm', value: 100 }, phi1: { name: 'tangent parallel', q: 'angle', unit: '°', value: 40, min: 1, max: 89, tex: '\\varphi_1' } },
      note: 'It runs off to infinity as φ₁ → 0: the cone has become the cylinder.'
    }
  ],
  examples: [
    {
      title: 'A paper hat for a globe',
      q: 'To make a paper cone that touches a globe of radius 100 mm along the parallel of 30° N, what shape of paper do you cut, and how high is the apex?',
      steps: [
        { text: 'The slant from the apex to the circle of contact is', tex: '\\rho_1 = R\\cot 30° = 100 \\times 1.732 = 173.2\\ \\text{mm}' },
        { text: 'The sector angle is', tex: '\\theta = 2\\pi\\sin 30° = \\pi, \\quad\\text{that is } 180°' },
        'So the paper is a half-disc of radius 173.2 mm (a circle of diameter 346 mm cut in half). Check: the arc is $\\pi \\times 173.2 = 544$ mm, and the parallel of 30° has circumference $2\\pi \\times 100 \\cos 30° = 544$ mm.',
        'The apex is at height $R/\\sin 30° = 200$ mm above the centre, i.e. 100 mm above the north pole.'
      ],
      a: 'A half-disc of radius 173.2 mm; the apex stands 200 mm above the centre of the globe, 100 mm above the pole.'
    },
    {
      title: 'A cone for a mid-latitude country',
      q: 'For a country centred on 32° N, find the cone constant, sector angle and apex height for a tangent cone and a globe of radius 100 mm. How many degrees of longitude are 10° of the globe on the unrolled map?',
      steps: [
        'Cone constant $n = \\sin 32° = 0.530$.',
        'Sector: $\\theta = 360° \\times 0.530 = 190.8°$; slant $100\\cot 32° = 160.0$ mm; apex height $100/\\sin 32° = 188.7$ mm.',
        '10° of longitude becomes $10° \\times 0.530 = 5.3°$ at the apex. The meridians are drawn about half as far apart (in angle) as they are on the globe; the parallels are arcs of radius 160 mm at the standard parallel, so the length of 10° of longitude there is $160 \\times 0.0925 = 14.8$ mm, which equals $100\\cos 32° \\times 0.1745 = 14.8$ mm: true scale.'
      ],
      a: 'n = 0.530, sector 190.8°, apex 188.7 mm up; 10° of longitude is 5.3° at the apex and true length along the standard parallel.'
    }
  ],
  quiz: [
    { q: 'Which of these can be unrolled flat without stretching?', choices: ['a sphere', 'a cone', 'a saddle-shaped surface', 'an egg'], a: 1, why: 'The cone has zero Gaussian curvature. The sphere (positive), the saddle (negative) and the egg cannot be flattened without stretching.' },
    { q: 'A cone tangent to the globe along the parallel of 45° unrolls into a sector of what angle, in degrees?', answer: 254.6, why: 'θ = 360° × sin 45° = 254.6°.' },
    { q: 'A cylinder can be considered a limiting case of a cone as the tangent parallel moves to the equator.', a: true, why: 'As φ₁ → 0 the apex height R/sin φ₁ → ∞ and the cone becomes a cylinder; the sector angle 2π sin φ₁ → 0.' },
    { q: 'For a globe of radius 100 mm, how high above the centre is the apex of the cone tangent along 30° N?', choices: ['100 mm', '150 mm', '173 mm', '200 mm'], a: 3, why: 'h = R/sin 30° = 100/0.5 = 200 mm. (173 mm is the slant length R cot 30°.)' },
    { q: 'On a secant cone, where is the map exactly to scale?', choices: ['at the apex', 'along both standard parallels', 'along the central meridian only', 'nowhere'], a: 1, why: 'Where the cone cuts the sphere the two surfaces coincide, so lengths along those circles are not changed.' }
  ],
  applications: [
    'Conic maps of mid-latitude countries and aeronautical charts (Lambert\'s conic, Albers\' conic) are the cone unrolled.',
    'Cylindrical maps (Mercator, plate carrée, Lambert cylindrical) and the UTM are cylinders, unrolled to a rectangle.',
    'Azimuthal maps (polar stereographic, Lambert azimuthal) are the plane; the same idea gives star charts and the astrolabe.',
    'Sheet-metal and paper work: funnels, lampshades, hoppers and duct transitions are cut as developments of cones and cylinders.',
    'Teaching: a paper cone laid on a globe shows at once why a map of a belt of latitude is a fan.'
  ],
  history: 'Ptolemy used a conic map for the known world about AD 150, true along the parallel of Rhodes (36° N). Joseph-Nicolas Delisle introduced the cone with two standard parallels in 1745, Lambert gave the conformal cone in 1772 and Heinrich Albers the equal-area cone in 1805. Leonhard Euler studied developable surfaces generally in 1772, showing that they are the cylinders, cones and the surfaces generated by the tangents of a curve; Gauss\'s curvature explained why those and no others unroll.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the introduction and the chapters on conic and cylindrical projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995), the chapter on projections.'],
  sim: 'mf-cone-roll',
  construction: ['mf-three-surfaces', 'mf-cone-unroll']
},

{
  id: 'aspects-of-a-projection',
  parent: 'map-fundamentals',
  title: 'Normal, transverse and oblique aspects',
  level: 2,
  short: 'A projection is defined for one position of the sphere; turn the sphere before projecting and the same formulas give a new map. The normal aspect has the surface\'s axis along the polar axis, the transverse across it, the oblique anywhere between.',
  keywords: ['aspect', 'normal', 'transverse', 'oblique', 'polar', 'equatorial', 'rotation', 'transverse Mercator', 'UTM', 'Cassini', 'oblique Mercator'],
  prereq: ['developable-surfaces', 'math:matrices', 'math:coordinate-systems-3d'],
  related: ['scale-factor-and-standard-parallels', 'transverse-mercator-and-utm', 'cassini-projection', 'mercator-projection', 'azimuthal-projections', 'rotation-matrices'],
  body: `Every projection is first described in its **normal aspect**: the cylinder round the equator, the cone with its axis along the polar axis, the plane touching at the pole. But nothing about the mathematics cares which great circle you call the equator. **Turn the sphere** first, so that the line or point where the surface touches moves to another place, and project the turned sphere by the same formulas: that is a new map of the same kind in another **aspect**.

### The three aspects
- **Normal**: the axis of the surface lies along the Earth\'s polar axis. For a cylinder, it touches the equator; for a cone, a parallel; for a plane, the pole (the *polar* aspect).
- **Transverse**: the axis lies in the equatorial plane, 90° from the polar axis. The cylinder touches a meridian (and the opposite one); the plane touches the equator (the *equatorial* aspect).
- **Oblique**: anywhere between. The cylinder touches a tilted great circle, the plane a point such as London or Beijing.

### Turning the sphere
Write the point on the unit sphere as a column of coordinates and tilt it by $\\tau$ about the axis through the centre of the map:
$$\\begin{bmatrix} x' \\\\ y' \\\\ z' \\end{bmatrix} = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\tau & -\\sin\\tau \\\\ 0 & \\sin\\tau & \\cos\\tau \\end{bmatrix} \\begin{bmatrix} \\cos\\varphi\\cos\\lambda \\\\ \\cos\\varphi\\sin\\lambda \\\\ \\sin\\varphi \\end{bmatrix}.$$
The new latitude and longitude follow, $\\sin\\varphi\' = z\'$ and $\\tan\\lambda\' = y\'/x\'$, and the normal formulas are applied to $(\\lambda\', \\varphi\')$. So $\\sin\\varphi\' = \\sin\\varphi\\cos\\tau + \\cos\\varphi\\sin\\lambda\\sin\\tau$. With $\\tau = 0$ nothing changes; with $\\tau = 90°$, $\\sin\\varphi\' = \\cos\\varphi\\sin\\lambda$: the old pole becomes a point on the new equator.

### Why change the aspect
The line of true scale lies where the surface touches. Put it down the long axis of the country. A tall narrow country, like Chile or Israel, wants a **transverse** cylinder: the **transverse Mercator** is the base of the UTM system and of most national grids (Great Britain, Germany, Israel), true along a central meridian. A country lying diagonally, like Alaska\'s panhandle or Malaysia, wants an **oblique** cylinder. A compact country wants a plane touching at its centre: the Netherlands uses an oblique stereographic map; the European Union\'s official equal-area grid is a Lambert azimuthal map centred on 52° N, 10° E. The polar stereographic serves the Arctic and Antarctic.

### The cost: nothing in kind
The distortion pattern is the same; it is only carried round the globe. Mercator, for example, has scale $\\sec\\varphi'$ measured from the *new* equator, so the transverse form is accurate in a narrow band either side of its central meridian. The pole, which Mercator cannot show, is on the map in the transverse form; what disappears is the point 90° round from the central meridian, now at infinity.

> [!tip] The construction below draws the same cylinder in side view at three tilts. The simulation turns the sphere for six different projections and shows the globe beside the map.`,
  ideas: [
    'The aspect is the position of the surface relative to the Earth: normal (axis polar), transverse (axis equatorial) or oblique, obtained by turning the sphere before projecting.',
    'Turning is a rotation of the unit sphere: sin φ′ = sin φ cos τ + cos φ sin λ sin τ for a tilt τ about the east–west axis through the centre.',
    'Pick the aspect that puts the line or point of true scale where the region lies: transverse for a north–south strip, oblique for a diagonal one, polar or oblique plane for a round one.',
    'The distortion pattern is unchanged; only its position moves.'
  ],
  pitfalls: [
    'The transverse Mercator is a different projection from Mercator — It is the same formula applied to the turned sphere. The properties (conformal) are the same, only the line of true scale has moved from the equator to a meridian.',
    'Normal always means the equatorial aspect — Normal means the surface\'s axis lies along the polar axis; for a plane that is the polar aspect, for a cylinder or cone it is the usual map.',
    'An oblique aspect needs new formulas — The same formulas, applied to coordinates rotated by a matrix; a few extra lines in a computer program, or a rotated graticule drawn by hand.'
  ],
  formulas: [
    {
      name: 'Latitude after tilting the sphere',
      expr: 'sin(phip) = sin(phi)*cos(tau) + cos(phi)*sin(dlam)*sin(tau)',
      tex: '\\sin\\varphi\' = \\sin\\varphi\\cos\\tau + \\cos\\varphi\\sin\\Delta\\lambda\\sin\\tau',
      vars: { phip: { name: 'latitude in the turned system', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\varphi\'' }, phi: { name: 'latitude of the point', q: 'angle', unit: '°', value: 45, signed: true, min: -90, max: 90, tex: '\\varphi' }, tau: { name: 'tilt of the axis', q: 'angle', unit: '°', value: 90, min: 0, max: 90, tex: '\\tau' }, dlam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 30, signed: true, min: -180, max: 180, tex: '\\Delta\\lambda' } },
      solveFor: 'phip',
      note: 'For the transverse aspect (τ = 90°) this is sin φ′ = cos φ sin Δλ; a point at 45° N, 30° E of the central meridian lies 20.7° north of the new equator.'
    },
    {
      name: 'Scale of the transverse cylinder',
      expr: 'k = k0*cosh(x/R)',
      tex: 'k = k_0\\cosh\\frac{x}{R}',
      vars: { k: { name: 'scale in every direction (transverse Mercator)' }, k0: { name: 'scale on the central meridian', value: 0.9996, min: 0.9, max: 1.1, tex: 'k_0' }, x: { name: 'distance east or west of the central meridian', q: 'length', unit: 'km', value: 167.7, signed: true }, R: { const: 'Rearth', tex: 'R' } },
      note: 'With k₀ = 0.9996 (UTM) the scale is 1 at x = ±180 km and reaches 1.0010 at the edge of the zone at the equator (334 km).'
    },
    {
      name: 'Angular distance from the centre of an oblique map',
      expr: 'cos(c) = sin(phi0)*sin(phi) + cos(phi0)*cos(phi)*cos(dlam)',
      tex: '\\cos c = \\sin\\varphi_0\\sin\\varphi + \\cos\\varphi_0\\cos\\varphi\\cos\\Delta\\lambda',
      vars: { c: { name: 'angular distance from the centre', q: 'angle', unit: '°', min: 0, max: 180 }, phi0: { name: 'latitude of the centre', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi_0' }, phi: { name: 'latitude of the point', q: 'angle', unit: '°', value: 51.51, signed: true, min: -90, max: 90, tex: '\\varphi' }, dlam: { name: 'difference of longitude', q: 'angle', unit: '°', value: -34.91, signed: true, min: -180, max: 180, tex: '\\Delta\\lambda' } },
      solveFor: 'c',
      note: 'The quantity at the heart of every oblique azimuthal map: how far, in degrees of arc, a point is from the centre. London from Tel Aviv: 32.0° (3560 km).'
    }
  ],
  examples: [
    {
      title: 'Tel Aviv on the UTM grid',
      q: 'Zone 36 of the UTM grid has its central meridian at 33° E, k₀ = 0.9996. On a spherical earth, how far east of the central meridian and how far north of the equator is Tel Aviv (32.07° N, 34.78° E) on the transverse Mercator map, and what is the scale there?',
      steps: [
        { text: 'The longitude from the central meridian is $\\Delta\\lambda = 1.78°$. The transverse Mercator abscissa (in units of R) is $x = \\text{artanh}(B)$ with $B = \\cos\\varphi\\sin\\Delta\\lambda$:', tex: 'B = 0.8468 \\times 0.03106 = 0.02632, \\quad x = 0.02632 \\;\\Rightarrow\\; 0.02632 \\times 6371 = 167.7\\ \\text{km}' },
        { text: 'The ordinate is', tex: 'y = R\\arctan\\frac{\\tan\\varphi}{\\cos\\Delta\\lambda} = 6371 \\times 0.5600 = 3567\\ \\text{km}' },
        { text: 'The scale is', tex: 'k = k_0\\cosh\\frac{x}{R} = 0.9996\\times1.000346 = 0.99995' },
        'So the city is 168 km east of the central meridian and the map is true to 1 part in 20 000 there: close to one of the two lines where the UTM scale is exactly 1 (at ±180 km).'
      ],
      a: '167.7 km east and 3567 km north, with scale 0.99995: almost exactly true.'
    },
    {
      title: 'Where the pole goes',
      q: 'Where do the North Pole and the point (0° N, 90° E of the central meridian) fall when the sphere is tilted by τ = 90° before projection?',
      steps: [
        { text: 'The pole has $\\varphi = 90°$: $\\sin\\varphi\' = \\sin 90°\\cos 90° + \\cos 90°(\\cdots) = 0$. It falls on the new equator: on the transverse map it sits on the central meridian, 90° of arc from the point where that meridian crosses the old equator.', tex: '\\varphi\' = 0°' },
        { text: 'The equatorial point at $\\Delta\\lambda = 90°$ has $\\sin\\varphi\' = \\cos 0°\\sin 90°\\sin 90° = 1$, so $\\varphi\' = 90°$: it falls on the new pole.', tex: '\\varphi\' = 90°' },
        'The two exchange their parts: the geographic pole becomes a point of the new equator, and a point of the geographic equator becomes the new pole. In the transverse Mercator that new pole is the one place the map cannot show.'
      ],
      a: 'The North Pole falls on the new equator (φ′ = 0°); the equatorial point 90° east of the central meridian becomes the new pole (φ′ = 90°), at infinity on the transverse Mercator map.'
    }
  ],
  quiz: [
    { q: 'In the transverse aspect of the cylinder, the cylinder touches the globe along', choices: ['the equator', 'a parallel of latitude', 'a meridian and its opposite', 'a single point'], a: 2, why: 'The axis lies in the equatorial plane, so the great circle of contact is a meridian circle through the poles.' },
    { q: 'Tilt the sphere by 90° about the east–west axis. What latitude, in degrees, in the new system does the point of the old equator 90° east of the central meridian have?', answer: 90, why: 'sin φ′ = cos 0° sin 90° sin 90° = 1, so φ′ = 90°: that point becomes the new pole (while the old pole falls on the new equator).' },
    { q: 'The polar aspect of an azimuthal projection is its normal aspect.', a: true, why: 'The plane touches at the pole, the surface\'s axis along the polar axis: the normal position of the plane.' },
    { q: 'A country that is long and narrow and runs north–south is best served by', choices: ['a normal cylinder', 'a transverse cylinder', 'a polar plane', 'a normal cone'], a: 1, why: 'The transverse cylinder touches (or cuts) along a meridian, so its line of true scale runs the length of the country.' },
    { q: 'What happens to the distortion pattern of a projection when its aspect changes?', choices: ['it is eliminated', 'it keeps the same form but moves to the new line or point of contact', 'it becomes conformal', 'it doubles'], a: 1, why: 'The distortion depends only on the distance from the line or point of true scale, measured in the turned system.' }
  ],
  applications: [
    'The UTM system and most national survey grids (Great Britain, Germany, Israel, Switzerland among them) are transverse Mercator maps, each zone with its own central meridian.',
    'The official equal-area grid of Europe is a Lambert azimuthal map in oblique aspect centred on 52° N, 10° E.',
    'The Netherlands\' national grid uses an oblique stereographic map centred on the town of Amersfoort.',
    'Polar charts and ice mapping: polar stereographic maps in the polar aspect.',
    'Panoramas and 360° images: the equirectangular map in a rotated aspect is how a photograph taken with a tilted camera is re-oriented.'
  ],
  history: 'Johann Heinrich Lambert described the transverse Mercator for the sphere in 1772; Gauss developed it for the ellipsoid around 1822 and Louis Krüger gave practical series in 1912, which is why it is called the Gauss–Krüger projection in much of Europe. The oblique cylinder was applied by Rosenmund to the Swiss survey in 1903 and by Martin Hotine to British colonial surveys in the 1940s. The Universal Transverse Mercator grid was adopted by NATO and the US military after the Second World War.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), on the transverse and oblique Mercator and on the oblique forms of azimuthal projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Bugayevskiy and Snyder, *Map Projections: A Reference Manual* (1995), the section on rotations of the sphere.'],
  sim: 'mf-aspects',
  construction: 'mf-aspects-cylinder'
},

{
  id: 'scale-factor-and-standard-parallels',
  parent: 'map-fundamentals',
  title: 'Scale factor and standard parallels',
  level: 2,
  short: 'The stated scale of a map is true only along its standard lines, where the projection surface touches or cuts the globe; elsewhere the scale factor differs from 1, and placing two standard lines rather than one spreads the error over a wider belt.',
  keywords: ['scale factor', 'standard parallel', 'standard line', 'secant', 'tangent', 'principal scale', 'UTM', 'k0', 'one-sixth rule', 'scale error', 'point scale'],
  prereq: ['developable-surfaces', 'tissot-indicatrix', 'math:similar-triangles'],
  related: ['aspects-of-a-projection', 'transverse-mercator-and-utm', 'lambert-conformal-conic', 'albers-equal-area-conic', 'mercator-projection', 'choosing-a-projection'],
  body: `Every map carries a scale, "1 : 50 000 000", and on a map of a large area it is true only along certain lines. Elsewhere the map is larger or smaller than that. The number by which the local scale differs from the stated one is the **scale factor** $k$: $k = 1$ where the map is true, $k = 2$ where it draws everything twice too large.

### Principal scale and point scale
Imagine shrinking the Earth to a globe of the stated size, 1 : 50 000 000. That is the *principal scale*. The projection then carries that globe onto the map, and the **point scale** at a place is the ratio of a tiny length on the map to the same length on the globe. At a point there are two numbers, $h$ along the meridian and $k$ along the parallel (the extremes are the semi-axes $a, b$ of [[tissot-indicatrix|Tissot\'s ellipse]]); on a conformal map they are equal. On Mercator $k = \\sec\\varphi$; on Lambert\'s cylindrical map $k = \\sec\\varphi$ and $h = \\cos\\varphi$.

### Standard lines
Where the projection surface touches the globe, nothing is stretched, so $k = 1$: a **standard line** (a standard parallel or a standard meridian), or a standard point for a plane. Away from it the scale error grows roughly as the square of the distance. A cylinder *secant* at $\\pm\\varphi_1$ has
$$k = \\frac{\\cos\\varphi_1}{\\cos\\varphi}$$
along the parallels: 1 at $\\pm\\varphi_1$, smaller between them (0.866 at the equator for $\\varphi_1 = 30°$), larger outside (1.73 at 60°). The **drawing below** reads this ratio off a side view with a fourth proportional.

### Why cut rather than touch
A tangent surface is wrong on both sides of one line; a secant surface is wrong by a *smaller* amount on both sides of two. Compare a belt about 20° wide on a cone: with one standard parallel (40°) in the middle the scale is 1.5 % too large at both edges (30° and 50°); with two, a sixth of the way in from each edge (33.3° and 46.7°), it is between 0.7 % too small in the middle and 0.9 % too large at the edges. An old rule of thumb (it goes back at least to Deetz and Adams in the 1920s) puts the two standard parallels **one sixth of the range in from the edges**: for the 48 contiguous states, 25° to 49°, that gives 29° and 45°, and the official Albers map uses 29.5° and 45.5°.

### The UTM trick
The transverse Mercator is true along its central meridian and swells away from it as $k_0\\cosh(x/R)$. The UTM grid multiplies everything by $k_0 = 0.9996$ so the central meridian is 0.04 % too small, and the scale is exactly 1 on two lines about 180 km either side. In a zone 6° wide the edge of the map at the equator (334 km out) is 1.00097: the error is held within about $\\pm 0.1\\ \\%$ instead of rising to 0.14 % on one side.

### What the scale bar means
A bar drawn on a world map is true for the equator, or for a stated parallel; measure with it elsewhere and you are wrong by the scale factor. Honest world maps give a bar for several latitudes. A conic or UTM map, whose scale is close to 1 over a belt, can use a single bar there.`,
  ideas: [
    'The scale factor k is the local scale divided by the principal scale; it is 1 only along the standard lines where the surface touches or cuts the globe.',
    'The error grows roughly as the square of the distance from the standard line: 1 % at 8° from the equator on Mercator, 5 % at 18°.',
    'A secant surface (two standard lines) halves the error or better compared with a tangent one; put the standard parallels about one sixth of the range in from the edges.',
    'UTM multiplies the transverse Mercator by 0.9996 so that two standard lines lie about 180 km either side of the central meridian.'
  ],
  pitfalls: [
    'The scale on the map is the scale printed under it — It is true only along the standard lines. On a world map it is usually the equator\'s; at 60° N every length is twice as long on Mercator.',
    'Secant means more accurate everywhere — It means smaller error at the edges and a small error (the wrong way round) in the middle. The best scale over a belt is the one that spreads the error evenly.',
    'The scale factor is a property of the projection only — It also depends on where you choose the standard lines and how large the principal scale is; the same projection with different standard lines has a different k at every point.'
  ],
  formulas: [
    {
      name: 'Scale along a parallel (secant cylinder)',
      expr: 'k = cos(phi1)/cos(phi)',
      tex: 'k = \\frac{\\cos\\varphi_1}{\\cos\\varphi}',
      vars: { k: { name: 'scale factor along the parallel' }, phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 30, min: 0, max: 89, tex: '\\varphi_1' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\varphi' } },
      note: 'With φ₁ = 0 this is Mercator\'s sec φ. With φ₁ = 30°: 0.866 on the equator, 1 at 30°, 1.225 at 45°, 1.73 at 60°.'
    },
    {
      name: 'Latitude where the scale error reaches e',
      expr: 'cos(phi) = cos(phi1)/(1 + err)',
      tex: '\\cos\\varphi = \\frac{\\cos\\varphi_1}{1 + \\varepsilon}',
      vars: { phi: { name: 'latitude where the scale is too large by the error', q: 'angle', unit: '°', min: 0, max: 89, tex: '\\varphi' }, phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 10, min: 0, max: 89, tex: '\\varphi_1' }, err: { name: 'allowed scale error', q: 'ratio', unit: '%', value: 1, min: 0.01, max: 50, tex: '\\varepsilon' } },
      note: 'On a tangent cylinder (φ₁ = 0) the scale is 1 % too large at 8.1° and 5 % at 17.8°: Mercator is a map of the tropics. With φ₁ = 30° the 1 % band is only 29.0°–31.0° — the scale changes ever faster the nearer the pole.'
    },
    {
      name: 'Standard lines of the UTM',
      expr: 'x = R*sqrt(2*(1/k0 - 1))',
      tex: 'x \\approx R\\sqrt{2\\left(\\frac{1}{k_0} - 1\\right)}',
      vars: { x: { name: 'distance of the standard lines from the central meridian', q: 'length', unit: 'km' }, R: { const: 'Rearth', tex: 'R' }, k0: { name: 'scale on the central meridian', value: 0.9996, min: 0.99, max: 0.99999, tex: 'k_0' } },
      note: 'From k₀ cosh(x/R) = 1: for k₀ = 0.9996, x = 180 km. The edge of a 6° zone at the equator is 334 km out, where the scale is 1.00097.'
    },
    {
      name: 'Map length from ground length',
      expr: 'L = d*k/N',
      tex: 'L = \\frac{k\\,d}{N}',
      vars: { L: { name: 'length on the map', q: 'length', unit: 'mm' }, d: { name: 'length on the ground', q: 'length', unit: 'km', value: 500 }, k: { name: 'scale factor at the place', value: 1.73, min: 0.1, max: 20 }, N: { name: 'scale denominator (1 : N)', value: 50000000, min: 1000, max: 1e10, fixed: true } },
      note: '500 km at 1 : 50 million is 10 mm where the scale factor is 1; at 60° N on a Mercator map with the standard parallels at 30° (k = 1.73) it is drawn 17.3 mm.'
    }
  ],
  examples: [
    {
      title: 'The UTM central meridian',
      q: 'The UTM central meridian has scale factor 0.9996. Where is the scale exactly 1, and what is it at the edge of the zone at the equator, 3° (334 km) from the central meridian? What would it be without the reduction?',
      steps: [
        { text: 'The transverse Mercator scale at distance $x$ from the central meridian is $k = k_0\\cosh(x/R)$. Setting it to 1:', tex: '\\cosh\\frac{x}{R} = \\frac{1}{0.9996} \\;\\Rightarrow\\; \\frac{x}{R} \\approx \\sqrt{2 \\times 0.0004} = 0.0283 \\;\\Rightarrow\\; x = 180\\ \\text{km}' },
        { text: 'At the zone edge, $x = 334$ km, $x/R = 0.0524$:', tex: 'k = 0.9996 \\times \\cosh 0.0524 = 0.9996 \\times 1.00137 = 1.00097' },
        'Without the reduction the scale would run from 1 on the central meridian to 1.00137 at the edge: a one-sided error of 1.4 parts in a thousand. With it the scale runs from 0.9996 to 1.00097: the error is within ±0.1 % across the whole zone.',
        'The cost is that the central meridian itself is 0.04 % small (4 cm in 100 m): in exchange for a smaller worst error.'
      ],
      a: 'Scale 1 at ±180 km from the central meridian; 1.00097 at the zone edge (1.00137 without the 0.9996 factor).'
    },
    {
      title: 'A secant cylinder at 30°',
      q: 'A world map is drawn on a cylinder secant at ±30°. What is the scale along the parallels at the equator, at 45° and at 60°, and how far apart do 1000 km on the ground fall at 60° N, if the principal scale is 1 : 50 million?',
      steps: [
        { text: 'The scale factors are', tex: 'k(0°) = \\frac{\\cos 30°}{1} = 0.866, \\quad k(45°) = \\frac{0.866}{0.7071} = 1.225, \\quad k(60°) = \\frac{0.866}{0.5} = 1.732' },
        'So the equator is drawn 13 % too small, and the parallel of 60° is 73 % too long.',
        { text: '1000 km east–west at 60° N, at the principal scale, would be 20 mm; the map draws it', tex: '20 \\times 1.732 = 34.6\\ \\text{mm}' },
        'Compared with a tangent cylinder (Mercator), where the same length is drawn $20 \\times 2 = 40$ mm, the secant cylinder is better everywhere above 30° and worse on the equator.'
      ],
      a: 'k = 0.866 at the equator, 1.225 at 45°, 1.732 at 60°; 1000 km at 60° N is 34.6 mm wide.'
    }
  ],
  quiz: [
    { q: 'A cylinder cuts the sphere along ±30°. What is the scale factor along the equator?', answer: 0.866, why: 'k = cos 30°/cos 0° = 0.866: the equator is drawn 13 % too small.' },
    { q: 'On a secant cone, where is the map exactly to scale?', choices: ['at the apex', 'along both standard parallels', 'along the central meridian only', 'nowhere'], a: 1, why: 'Where the cone cuts the sphere the two surfaces coincide, so lengths along those circles are unaltered.' },
    { q: 'The scale bar of a world map is valid everywhere on it.', a: false, why: 'It is true only along the standard lines (usually the equator): at 60° N a Mercator bar understates real lengths by a factor of 2.' },
    { q: 'By the one-sixth rule, where would you put the standard parallels for a mid-latitude country running from 30° N to 50° N?', choices: ['30° and 50°', '33.3° and 46.7°', '35° and 45°', '40° only'], a: 1, why: 'The range is 20°; a sixth of it, 3.3°, in from each edge gives 33.3° and 46.7°.' },
    { q: 'How far from the central meridian, in km, are the two lines of exact scale in the UTM? (k₀ = 0.9996)', answer: 180, why: 'R·√(2(1/k₀ − 1)) = 6371 × √(0.0008) = 6371 × 0.02829 = 180 km.' }
  ],
  applications: [
    'Survey and engineering maps: the UTM and national grids are designed so that the scale factor stays within a few parts in ten thousand across a zone, so that grid distances can be used as ground distances.',
    'Atlases: a bar scale is given for the latitudes at which it is true; thematic maps of countries use conics with standard parallels chosen by the one-sixth rule.',
    'Aviation: the Lambert conformal conic of aeronautical charts is secant at two parallels, so that the chart scale is within 1 % across the chart.',
    'GIS: the "scale factor" and "standard parallels" are parameters of every projection you set up; setting them wrong shifts where the map is true.',
    'Web maps: the zoom level fixes the scale only at the equator; a ruler on the screen at 60° N reads half the true distance.'
  ],
  history: 'Ptolemy\'s first projection was true along the parallel of Rhodes, 36° N; Delisle introduced the cone secant along two parallels in 1745. The idea of shrinking the central meridian of the transverse Mercator to spread the error, the 0.9996 of the UTM, dates from the American and British military mapping of the 1940s; the one-sixth rule for conics was popularised in the 1920s by Deetz and Adams in *Elements of Map Projection*, a handbook of the US Coast and Geodetic Survey.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the introduction on scale factor and the chapters on the Mercator, transverse Mercator and conic projections.', 'Charles H. Deetz and Oscar S. Adams, *Elements of Map Projection* (US Coast and Geodetic Survey, 1921).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: 'mf-scale-profile',
  construction: ['mf-secant-cone', 'mf-scale-factor']
},

{
  id: 'great-circles-and-rhumb-lines',
  parent: 'map-fundamentals',
  title: 'Great circles and rhumb lines',
  level: 2,
  short: 'The two kinds of straight line on a sphere: the great circle, the shortest route, which is straight on a gnomonic map and curved on Mercator, and the rhumb line, the course of constant bearing, straight on Mercator and a spiral to the pole on the globe.',
  keywords: ['great circle', 'rhumb line', 'loxodrome', 'geodesic', 'bearing', 'haversine', 'Clairaut', 'vertex', 'orthodrome', 'composite sailing', 'shortest route'],
  prereq: ['conformal-maps', 'math:law-of-cosines', 'math:trigonometry'],
  related: ['mercator-projection', 'gnomonic-projection', 'charts-and-navigation', 'aviation-and-polar-routes', 'azimuthal-equidistant-projection', 'choosing-a-projection'],
  body: `On a flat sheet there is one kind of straight line. On a sphere there are two, and a navigator needs both. The **great circle** is the shortest route; the **rhumb line** is the route that holds one compass bearing. They agree only along the equator and the meridians, and the difference between them grows with latitude and with how far east or west the journey goes.

### The great circle
Cut the globe with a plane through its centre: the cut is a great circle (the equator, every meridian, the route of the shortest flight). It is the geodesic of the sphere, the path a taut string takes. Its length between two points follows from the **haversine formula**
$$d = 2R\\arcsin\\sqrt{\\sin^2\\tfrac{\\Delta\\varphi}{2} + \\cos\\varphi_1\\cos\\varphi_2\\sin^2\\tfrac{\\Delta\\lambda}{2}}.$$
The bearing keeps changing along it (except on the equator and meridians). Clairaut\'s relation says that $\\cos\\varphi\\,\\sin\\alpha$ is constant along a great circle, with $\\alpha$ the angle to the meridian, so the highest latitude, the **vertex**, satisfies $\\cos\\varphi_v = \\cos\\varphi\\sin\\alpha$. On [[mercator-projection|Mercator]] it is a curve bowing towards the pole; on the [[gnomonic-projection|gnomonic]] map it is a straight line; and on any azimuthal map centred on a point of the route it is a straight line through the centre.

### The rhumb line
A line that crosses every meridian at the same angle $\\theta$ is a **rhumb line** (or *loxodrome*, Greek for "slanting course"). On the globe it spirals towards the pole without ever reaching it, though its length is finite: from latitude $\\varphi_1$ to the pole it is $R(\\pi/2 - \\varphi_1)/\\cos\\theta$. On Mercator, whose meridians are parallel and whose angles are true, it is a **straight line**. With $\\Delta\\psi$ the difference of Mercator ordinates $\\ln\\tan(\\pi/4 + \\varphi/2)$ between the two ends,
$$\\tan\\theta = \\frac{\\Delta\\lambda}{\\Delta\\psi}, \\qquad d = \\frac{R\\,\\Delta\\varphi}{\\cos\\theta}.$$
Along a rhumb line the latitude changes at a fixed rate with distance, which is what makes the second formula so simple.

### How much longer is the rhumb line?
Tel Aviv to New York: great circle 9117 km, rhumb line 9766 km, 7 % more. London to Tokyo: 9558 km against 11 295 km, 18 % more. Quito to Singapore, near the equator: nearly the same. Rule of thumb: the larger the latitude and the longer the east–west run, the greater the saving of the great circle, which is why flights from Europe to Asia pass over the Arctic.

### What navigators do
A ship steering one bearing follows a rhumb line. For a long passage it follows a **composite course**: the great circle is plotted on a gnomonic chart, where it is straight, a few waypoints are read off and transferred to the Mercator chart, and the ship steers rhumb lines between them. Aircraft fly the great circle with a computer to turn the bearing as they go. The drawing below does both for one pair of cities.`,
  ideas: [
    'A great circle (plane through the centre) is the shortest route; its bearing changes along the way, and it is straight on a gnomonic map and curved on Mercator.',
    'A rhumb line crosses all meridians at one angle; it is straight on Mercator and a finite-length spiral to the pole on the globe.',
    'The great circle is never longer and usually shorter; the saving grows with latitude and with the east–west extent: 7 % for Tel Aviv–New York, 18 % for London–Tokyo.',
    'Haversine, tan θ = Δλ/Δψ and Clairaut\'s cos φ sin α = const are the three formulas that do the work.'
  ],
  pitfalls: [
    'The straight line on a Mercator chart is the shortest route — It is the rhumb line, the course of constant bearing; the shortest route is the curve bowing towards the pole (except along the equator or a meridian).',
    'A great circle has a constant bearing — Only the equator and the meridians do. Elsewhere the bearing turns steadily; London to New York leaves on 288° and arrives on about 231°.',
    'A parallel of latitude is a shortest route because it is "straight across" — It is a rhumb line (bearing 90°) but not a great circle, except the equator. Two cities at 50° N are closer by the great circle, which arches north of the parallel.'
  ],
  formulas: [
    {
      name: 'Great-circle distance (haversine)',
      expr: 'd = 2*R*asin(sqrt(sin((phi2 - phi1)/2)^2 + cos(phi1)*cos(phi2)*sin(dlam/2)^2))',
      tex: 'd = 2R\\arcsin\\sqrt{\\sin^2\\tfrac{\\varphi_2 - \\varphi_1}{2} + \\cos\\varphi_1\\cos\\varphi_2\\sin^2\\tfrac{\\Delta\\lambda}{2}}',
      vars: { d: { name: 'great-circle distance', q: 'length', unit: 'km' }, R: { const: 'Rearth', tex: 'R' }, phi1: { name: 'latitude of the start', q: 'angle', unit: '°', value: 32.07, signed: true, min: -90, max: 90, tex: '\\varphi_1' }, phi2: { name: 'latitude of the end', q: 'angle', unit: '°', value: 40.71, signed: true, min: -90, max: 90, tex: '\\varphi_2' }, dlam: { name: 'difference of longitude', q: 'angle', unit: '°', value: 108.79, min: 0, max: 180, tex: '\\Delta\\lambda' } },
      solveFor: 'd',
      note: 'Tel Aviv (32.07° N) to New York (40.71° N), 108.79° of longitude apart: 9117 km. The haversine form is well-conditioned for short distances, where cosines of tiny angles lose digits.'
    },
    {
      name: 'Rhumb-line distance',
      expr: 'd = R*dphi/cos(theta)',
      tex: 'd = \\frac{R\\,\\Delta\\varphi}{\\cos\\theta}',
      vars: { d: { name: 'length of the rhumb line', q: 'length', unit: 'km' }, R: { const: 'Rearth', tex: 'R' }, dphi: { name: 'change of latitude', q: 'angle', unit: '°', value: 8.64, min: 0, max: 90, tex: '\\Delta\\varphi' }, theta: { name: 'angle between the course and the meridian', q: 'angle', unit: '°', value: 84.35, min: 0, max: 89.9, tex: '\\theta' } },
      note: 'Along a rhumb line each unit of distance changes the latitude by cos θ. Fails at θ = 90° (an east–west parallel), where the distance is Δλ R cos φ instead.'
    },
    {
      name: 'Rhumb-line bearing',
      expr: 'tan(theta) = dlam/dpsi',
      tex: '\\tan\\theta = \\frac{\\Delta\\lambda}{\\Delta\\psi}',
      vars: { theta: { name: 'angle between the course and the meridian', q: 'angle', unit: '°', min: 0, max: 89.9, tex: '\\theta' }, dlam: { name: 'difference of longitude', q: 'angle', unit: '°', value: 108.79, min: 0, max: 179, tex: '\\Delta\\lambda' }, dpsi: { name: 'difference of Mercator ordinates ln tan(45° + φ/2)', value: 0.1877, min: 0.0001, max: 5, tex: '\\Delta\\psi' } },
      note: 'Δψ = ψ(φ₂) − ψ(φ₁) = 0.7792 − 0.5915 for Tel Aviv–New York. θ = 84.35° from the meridian, a bearing of 275.6° since the course runs west.'
    },
    {
      name: 'Vertex of a great circle (Clairaut)',
      expr: 'cos(phiv) = cos(phi)*sin(alpha)',
      tex: '\\cos\\varphi_v = \\cos\\varphi\\,\\sin\\alpha',
      vars: { phiv: { name: 'highest latitude reached', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\varphi_v' }, phi: { name: 'latitude where the angle is measured', q: 'angle', unit: '°', value: 32.07, min: 0, max: 90, tex: '\\varphi' }, alpha: { name: 'angle between the route and the meridian there', q: 'angle', unit: '°', value: 46.44, min: 1, max: 90, tex: '\\alpha' } },
      solveFor: 'phiv',
      note: 'Leaving Tel Aviv on 313.6° (46.4° west of north), the route climbs to 52.1° N. At the vertex the route runs due east–west.'
    }
  ],
  examples: [
    {
      title: 'Tel Aviv to New York',
      q: 'Find the great-circle distance and the rhumb-line distance and bearing from Tel Aviv (32.07° N, 34.78° E) to New York (40.71° N, 74.01° W), and the highest latitude of the great circle.',
      steps: [
        { text: 'Haversine: $\\Delta\\varphi = 8.64°$, $\\Delta\\lambda = 108.79°$,', tex: 'a = \\sin^2 4.32° + \\cos 32.07°\\cos 40.71°\\sin^2 54.39° = 0.0057 + 0.8469 \\times 0.7580 \\times 0.6610 = 0.4300' },
        { text: 'so', tex: 'd = 2 \\times 6371 \\times \\arcsin\\sqrt{0.4300} = 2 \\times 6371 \\times 0.7156 = 9117\\ \\text{km}' },
        { text: 'Rhumb line: $\\psi(32.07°) = 0.5915$, $\\psi(40.71°) = 0.7792$, $\\Delta\\psi = 0.1877$, and $\\Delta\\lambda = 1.8987$ rad westward:', tex: '\\theta = \\arctan\\frac{1.8987}{0.1877} = 84.35°\\ \\text{west of north: bearing } 275.6°' },
        { text: 'Its length:', tex: 'd = \\frac{6371 \\times 0.1508}{\\cos 84.35°} = 9766\\ \\text{km}' },
        'The great circle leaves on 313.6°, so $\\sin\\alpha = \\sin 46.44° = 0.7248$ and the vertex is at $\\cos\\varphi_v = 0.8469 \\times 0.7248 = 0.6138$, $\\varphi_v = 52.1°$ N: well north of either city, and the rhumb line is 7 % longer.'
      ],
      a: 'Great circle 9117 km, leaving on 313.6° and reaching 52.1° N; rhumb line 9766 km on a constant 275.6°.'
    },
    {
      title: 'London to Tokyo',
      q: 'The great circle from London to Tokyo is 9558 km and the rhumb line 11 295 km. How much does flying the great circle save, and how far north does it go?',
      steps: [
        'Saving: $11\\,295 - 9558 = 1737$ km, or $1737/11\\,295 = 15\\ \\%$ of the rhumb line (the rhumb line is 18 % longer than the great circle).',
        'The great circle leaves London on 31.7°, north-east. $\\cos\\varphi_v = \\cos 51.5°\\sin 31.7° = 0.6225 \\times 0.5255 = 0.3271$, so $\\varphi_v = 70.9°$ N: it crosses northern Russia at the latitude of the Arctic coast.',
        'The rhumb line holds 99.0° (a little south of east) and stays between 51.5° and 35.7° N all the way. On a Mercator chart it is the straight line; the great circle is the sharp arch over the top.'
      ],
      a: 'The great circle saves 1737 km (15 % of the rhumb line) and rises to 70.9° N.'
    }
  ],
  quiz: [
    { q: 'On a Mercator chart a great circle between New York and London appears as', choices: ['a straight line', 'a curve bowing towards the pole', 'a curve bowing towards the equator', 'a circle'], a: 1, why: 'Mercator stretches the high latitudes; the shortest route goes poleward of the straight line.' },
    { q: 'A rhumb line is', choices: ['the shortest path between two points', 'a line of constant bearing', 'a line of constant latitude only', 'a great circle through the poles'], a: 1, why: 'Rhumb: crossing every meridian at the same angle. It is straight on Mercator.' },
    { q: 'The equator is both a great circle and a rhumb line.', a: true, why: 'It is a plane section through the centre, and it crosses every meridian at 90°. So are the meridians themselves (bearing 0° or 180°).' },
    { q: 'A great circle leaves a point at latitude 40° making an angle of 45° with the meridian. What is the highest latitude it reaches, to the nearest degree? (cos φᵥ = cos φ sin α)', answer: 57, why: 'cos φᵥ = cos 40° sin 45° = 0.7660 × 0.7071 = 0.5417, so φᵥ = 57.2°.' },
    { q: 'Two cities on the same parallel 60° N, far apart in longitude: is the parallel the shortest route between them?', choices: ['Yes, it is straight on Mercator', 'No, the great circle arches poleward of it and is shorter', 'Yes, it is a circle', 'It depends on the longitude'], a: 1, why: 'A parallel (except the equator) is a small circle and a rhumb line, not a great circle; the great circle between two points on it bulges toward the pole and is shorter.' }
  ],
  applications: [
    'Shipping: ocean passages are planned as chains of rhumb lines along the great circle (composite sailing), with the great circle drawn on a gnomonic chart and its waypoints copied to the Mercator chart.',
    'Aviation: long-haul airline routes follow the great circle, which is why transatlantic and trans-Pacific flights curve toward the Arctic.',
    'Radio and satellite links: antenna bearings and path lengths are great-circle quantities.',
    'Geocaching, hiking and drone programming: the bearing and distance between two coordinates is the great circle, usually computed by the haversine.',
    'Mapping software: lines drawn between cities on a web map are either "geodesic" (great circle, curved on Web Mercator) or "rhumb" (straight), and the choice is a switch in the code.'
  ],
  history: 'Pedro Nunes explained in 1537 that a ship holding a constant compass course follows neither a great circle nor a straight line of the plane charts but a spiral approaching the pole; Willebrord Snellius named it the loxodrome in 1624. Mercator\'s chart of 1569 made it straight, and Edward Wright\'s tables of 1599 made that practical. Alexis Clairaut published his relation for geodesics in 1733. The haversine, which spares navigators the loss of precision in the cosine formula for short distances, was tabulated by James Inman in his navigation textbook of 1835.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the sections on rhumb lines, great circles and the Mercator and gnomonic projections.', 'Mark Monmonier, *Rhumb Lines and Map Wars: A Social History of the Mercator Projection* (2004).', 'Charles H. Deetz and Oscar S. Adams, *Elements of Map Projection* (1921).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: 'mf-routes',
  construction: 'mf-gc-rhumb'
},

{
  id: 'choosing-a-projection',
  parent: 'map-fundamentals',
  title: 'Choosing a projection',
  level: 2,
  short: 'There is no best projection, only the best one for a purpose and a region: first decide what the map must keep, then match the surface (cylinder, cone, plane) and its aspect to the shape and place of the region.',
  keywords: ['choosing', 'selection', 'decision', 'purpose', 'region', 'conformal', 'equal-area', 'equidistant', 'compromise', 'aspect', 'Web Mercator', 'national grid'],
  prereq: ['conformal-maps', 'equal-area-maps', 'equidistant-maps', 'compromise-maps'],
  related: ['scale-factor-and-standard-parallels', 'great-circles-and-rhumb-lines', 'developable-surfaces', 'charts-and-navigation', 'gps-and-web-maps', 'surveys-and-national-grids'],
  body: `There is no best map projection, only a best one for *this purpose* and *this region*. The choice is two questions, asked in order: **what must the map keep?** and **how large and where is the region?** The first picks the property, the second the surface and its aspect.

### First: the purpose
- **Bearings, shapes, local detail, measuring angles** (navigation, survey, large-scale topographic maps): a [[conformal-maps|conformal]] map.
- **Areas, densities, totals, distributions**: an [[equal-area-maps|equal-area]] map.
- **Distance from one place** (range rings, a hub-and-spoke network): an [[equidistant-maps|azimuthal equidistant]] map centred on it.
- **Shortest routes**: the gnomonic map, on which every great circle is straight, to plan; a conformal one to steer.
- **A world to look at**: a [[compromise-maps|compromise]] map.
Only one purpose can be served exactly. If two matter, a conformal map with a note of its area exaggeration, or an equal-area map with a note of its shear, is better than a compromise that serves neither.

### Second: the region
The size of the region sets how much choice matters: below about 500 km almost any projection will do; at 2000 km the error of a poor choice is several per cent; for a continent or the world it dominates. The *shape* of the region picks the surface (see [[developable-surfaces]]):

| Region | Surface | Why |
|---|---|---|
| Tropics, an east–west belt on the equator | cylinder (normal) | the standard line is the equator |
| Mid-latitudes, east–west | cone, two standard parallels | the standard lines follow the parallels |
| A narrow north–south strip | transverse cylinder (UTM, national grids) | the standard line is a meridian |
| A region lying diagonally | oblique cylinder or cone | the line of contact follows the region |
| A pole, or a round region | plane (polar or oblique azimuthal) | the standard point is the centre |
| The whole world | pseudocylindrical or compromise | one smooth outline |

So a sea chart of the Mediterranean is conformal and cylindrical (Mercator); a population-density map of Europe is equal-area and conic or azimuthal (Albers, or Lambert azimuthal as used for the EU\'s statistical grid); a map for steering an aircraft over the Atlantic is the Lambert conformal conic.

### Third: check the distortion
Draw [[tissot-indicatrix|Tissot\'s ellipses]] over your region in the candidate projection. If the largest angle change $\\omega$ and the area scale are within what you need, stop. For example, the Lambert azimuthal map centred on Europe at 52° N, 10° E, 2500 km from the centre, has scales 0.98 and 1.02 and $\\omega = 2.1°$: excellent.

### Practical points
- **Use the projection your data came in**; reproject once, at the end, and never overlay layers in different projections without transforming.
- **Do not measure areas or distances on Web Mercator.** It was chosen for tiling, not measuring.
- Use an equal-area projection to compute areas, and *geodesic* (great-circle or ellipsoidal) formulas for distances, whatever the map shows.
- A national grid exists to be used: its scale factor is within a few parts in ten thousand over the country.

> [!key] Purpose picks the property; the region picks the surface. The drawing below is the decision as a chart; the simulation is a game in which you identify a mystery map.`,
  ideas: [
    'Choose in two steps: what the map must keep (angles, areas, distances from a point, great circles, or a pleasing world) and what shape and place the region has.',
    'Only one exact property at a time; if two matter, say which one is kept and note the other\'s distortion.',
    'The region\'s shape picks the surface and aspect: cylinder for the tropics, cone for mid-latitudes, transverse cylinder for a north–south strip, plane for the poles and round regions.',
    'Check the choice by drawing Tissot\'s ellipses over the region, and do not measure on a map made for something else.'
  ],
  pitfalls: [
    'Web Mercator is fine for any task because everyone uses it — It is right for display and tiling; areas and distances computed in it are wrong by the square and the first power of sec φ.',
    'The most accurate projection is a compromise one — A compromise map is never the most accurate for one purpose; the exact map for that purpose is.',
    'For a small region the projection does not matter — It hardly matters below a few hundred kilometres; at a few thousand it decides the error. And mixing two layers drawn in different projections matters even for a small area.'
  ],
  formulas: [
    {
      name: 'Map length from ground length',
      expr: 'L = d/N',
      tex: 'L = \\frac{d}{N}',
      vars: { L: { name: 'length on the map', q: 'length', unit: 'mm' }, d: { name: 'length on the ground', q: 'length', unit: 'km', value: 250 }, N: { name: 'scale denominator (1 : N)', value: 5000000, min: 1000, max: 1e10, fixed: true } },
      note: 'At 1 : 5 million, 250 km is 50 mm. Multiply by the local scale factor k if the place is away from the standard lines.'
    },
    {
      name: 'Radius a tangent conformal plane can cover',
      expr: 'cos(c) = 2/(1 + err) - 1',
      tex: '\\cos c = \\frac{2}{1 + \\varepsilon} - 1',
      vars: { c: { name: 'largest angular distance from the centre', q: 'angle', unit: '°', min: 0, max: 150, tex: 'c' }, err: { name: 'allowed scale error', q: 'ratio', unit: '%', value: 1, min: 0.01, max: 100, tex: '\\varepsilon' } },
      note: 'From the stereographic scale 2/(1 + cos c) = 1 + e. A 1 % error limits a tangent map to c = 11.4° (1270 km radius); 5 % to 25.2° (2800 km); 10 % to 35.1° (3900 km). Splitting the error with a secant plane roughly doubles those radii.'
    }
  ],
  examples: [
    {
      title: 'A density map of Europe',
      q: 'You are to draw a map of population density across Europe (about 35° N to 70° N, 10° W to 40° E). Which property, which surface, which projection, and what check?',
      steps: [
        'Density is a count divided by an area, and the eye reads area: the map must be **equal-area**.',
        'Europe is about 4000 km across and of roughly equal height: a compact, mid-latitude region, best fitted by a **plane** touching near its centre (or a cone with standard parallels at 41° and 64° by the one-sixth rule).',
        'Choose the Lambert azimuthal equal-area map centred on 52° N, 10° E (the EU statistical grid) or Albers\' conic. Both are standards.',
        { text: 'Check: at 2500 km (c = 22.5°) from the centre the Lambert azimuthal scales are $\\cos(c/2) = 0.981$ and $\\sec(c/2) = 1.019$, so', tex: '\\omega = 2\\arcsin\\frac{1.019 - 0.981}{1.019 + 0.981} = 2.2°' },
        'An error of 2° of angle, with exact areas, over the whole continent. A Mercator map of the same region would draw Scandinavia 4.5 times too large in area (sec² 62°) and make the density in the north look less than a quarter of its true value.'
      ],
      a: 'Equal-area, plane or cone: Lambert azimuthal equal-area centred on 52° N, 10° E; worst angular error about 2°, areas exact.'
    },
    {
      title: 'A chart for the Mediterranean',
      q: 'You are to draw a chart for a yacht in the Mediterranean (30° N to 46° N). Which projection, and how large is the scale error across the sea?',
      steps: [
        'A navigator measures bearings and plots courses: the chart must be **conformal**, with straight lines for rhumb lines: **Mercator**.',
        { text: 'Mercator\'s scale error is the largest at the north edge. Taking the standard parallel at the middle, 38° N, the scale factor relative to it is', tex: 'k(46°)/k(38°) = \\frac{\\cos 38°}{\\cos 46°} = \\frac{0.788}{0.695} = 1.13' },
        'So a distance read at the north of the chart is 13 % bigger than the same distance read at the south relative to the 38° N bar; sailors measure distance on the latitude scale at the side of the chart (1 minute of latitude = 1 nautical mile) beside the place of measurement.',
        'The chart is therefore a combination: Mercator for the course (angles true), and the nearby latitude scale for the distance.'
      ],
      a: 'Mercator, because it is conformal and straight for rhumb lines; the scale varies by about 13 % from south to north, so distances are read off the latitude scale beside the point of interest.'
    }
  ],
  quiz: [
    { q: 'You need to count the area of forest lost in each country over ten years. Which property is the essential one?', choices: ['conformal', 'equal-area', 'equidistant', 'gnomonic'], a: 1, why: 'Counting area needs an equal-area map; a map that is wrong in area biases every total.' },
    { q: 'An airline wants a map of the distance to every city from its hub. Best choice?', choices: ['Mercator', 'Mollweide', 'azimuthal equidistant centred on the hub', 'sinusoidal'], a: 2, why: 'Only the azimuthal equidistant map draws distance and bearing from its centre true.' },
    { q: 'For a long narrow country running north–south, the surface that follows its shape is the', choices: ['normal cylinder', 'normal cone', 'transverse cylinder', 'polar plane'], a: 2, why: 'The transverse cylinder\'s standard line is a meridian, along the length of the country (the UTM and the national grids of Britain, Israel and Germany).' },
    { q: 'Is it sensible to measure the area of a country in Web Mercator coordinates?', choices: ['Yes, it is a standard format', 'No: the area scale is sec² φ, wrong by a factor 2 even at 45° N', 'Yes, if the country is small', 'Only in the southern hemisphere'], a: 1, why: 'Web Mercator is conformal, not equal-area; the area is inflated by sec² φ (2.0 at 45°, 4.0 at 60°). Reproject to an equal-area projection first.' },
    { q: 'Which statement is true?', choices: ['A compromise map is the best choice for every purpose', 'Only one exact property can be kept; choose by the purpose', 'The projection never matters', 'Equal-area maps keep shapes'], a: 1, why: 'Conformal, equal-area and equidistant maps are exclusive options; the region then picks the surface and aspect.' }
  ],
  applications: [
    'Atlases and textbooks choose a projection per page: conformal for geology and topography, equal-area for thematic and world maps.',
    'National mapping agencies each choose one grid for the country, usually a transverse Mercator or a Lambert conic, for its minimal scale error over the land.',
    'Web mapping chooses Web Mercator for tiling and zoom, and expects heavy analysis to reproject to a local or equal-area system.',
    'Aviation uses Lambert conformal conic charts for en-route navigation and gnomonic or great-circle displays for route planning.',
    'Climate and ecology research standardises on an equal-area grid for global statistics.'
  ],
  history: 'Rules for choosing a projection were first written down in the nineteenth century as projections multiplied, and became standard teaching in the twentieth: Deetz and Adams\'s handbook of 1921 compared the main projections by distortion for map-makers of the US Coast and Geodetic Survey, and Snyder\'s *Working Manual* of 1987 gave the criteria most used today. The International Cartographic Association\'s commission on map projections and the book *Choosing a Map Projection* (Lapaine and Usery, 2017) are the modern references.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the sections on the choice of a projection.', 'Miljenko Lapaine and E. Lynn Usery (eds.), *Choosing a Map Projection* (Springer, 2017).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).', 'Charles H. Deetz and Oscar S. Adams, *Elements of Map Projection* (1921).'],
  sim: 'mf-which-map',
  construction: 'mf-decision-table'
},

// @@NEXT@@
);
