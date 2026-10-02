/* HYPER-PROJECTIONS · content/pseudocylindrical-and-compromise.js
 *
 * The pseudocylindrical maps (straight parallels, curved meridians) and the compromise maps of the atlases: sinusoidal,
 * Mollweide, Goode, Eckert, Robinson, Winkel tripel, Aitoff and Hammer, Van der Grinten, Equal Earth and Natural Earth,
 * Kavrayskiy VII and Wagner VI. Each page gives the formula, what the map keeps, the hand construction
 * (constructions/pseudocylindrical-and-compromise.js) and the lab (sims/pseudocylindrical-and-compromise.js).
 */
Hyper.add(
{
  id: 'pseudocylindrical-projections',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Pseudocylindrical projections',
  level: 1,
  short: 'Maps whose parallels are straight horizontal lines, like a cylindrical map, but whose lengths change with latitude: the poles shrink to points or to short lines, every parallel is divided equally by the meridians, and the meridians become curves. Two columns of numbers, the height and the length of each parallel, define the whole map.',
  keywords: ['pseudocylindrical', 'flat pole', 'pointed pole', 'parallels straight', 'curved meridians', 'equal-area condition', 'central meridian', 'elliptical', 'sinusoidal', 'Mollweide', 'Eckert'],
  prereq: ['cylindrical-projections', 'equal-area-maps', 'compromise-maps'],
  related: ['sinusoidal-projection', 'mollweide-projection', 'eckert-projections', 'robinson-projection', 'equal-earth-and-natural-earth', 'kavrayskiy-and-wagner', 'goode-homolosine'],
  body: `A cylindrical map (see [[cylindrical-projections]]) draws the parallels as parallel straight lines and the meridians as equally spaced verticals; its price is that every parallel, even the one a few degrees from the pole, is as long as the equator. A **pseudocylindrical** map keeps the first half of the idea and drops the second. The parallels stay straight, horizontal and parallel, but the **length of each one depends on its latitude**, so the poles can shrink to points or to short lines, and the meridians, which divide each parallel into equal parts, become curves. Only the central meridian stays straight.

### Two functions define the map
Draw the parallel of latitude $\\varphi$ at the height $y = g(\\varphi)$ and give it the length $2\\pi f(\\varphi)$ for the whole 360° of longitude. A point of longitude $\\lambda$ divides the parallel in the ratio $\\lambda : \\pi$:
$$x = f(\\varphi)\\,\\lambda, \\qquad y = g(\\varphi).$$
Everything else follows. The central meridian is $x = 0$; the meridian of longitude $\\lambda$ is the curve $x = \\lambda f$ drawn against $y = g$, the **same curve** squeezed horizontally in the ratio $\\lambda/\\pi$; the outline is the curve for $\\lambda = \\pm\\pi$. In the sinusoidal map $f = R\\cos\\varphi$ and $g = R\\varphi$; in the Mollweide map both come from an auxiliary angle $\\theta$; in the Robinson map the two columns are simply a table.

### Choosing the functions
Each choice buys a property. Take **areas**: the strip between $\\varphi$ and $\\varphi + d\\varphi$ is $2\\pi R^2\\cos\\varphi\\,d\\varphi$ on the globe and $2\\pi f\\,g'\\,d\\varphi$ on the map, so the map is equal-area exactly when
$$f(\\varphi)\\,g'(\\varphi) = R^2\\cos\\varphi .$$
Choose $f$ and this fixes $g$, or the reverse; the sinusoidal, Mollweide, Eckert IV and VI, Equal Earth and Goode's maps all obey it. For a **compromise** one picks both columns by eye or by minimising a measure of the distortion: Robinson, Kavrayskiy, Wagner. Conformality is out of reach: the scale along a meridian contains the term $f'(\\varphi)\\lambda$, which grows with longitude, while the scale along a parallel does not, so the two can be equal everywhere only if $f' = 0$, which is a cylindrical map.

### What the family keeps and loses
The scale along the central meridian is determined by $g$ and along each parallel by $f$; both can be made right on the equator, but the **shear** between meridian and parallel grows with the distance from the central meridian and with latitude. The compensation is that the continents, packed near a central meridian, are drawn in good shape and the poles are not stretched into lines as long as the equator: a pointed pole (sinusoidal, Mollweide) pinches the shapes near it, a flat one (Eckert, Robinson, Equal Earth) spreads the shear.

### Drawing any of them by hand
Draw the central meridian and the equator; mark the heights $g(\\varphi)$ up and down the meridian; lay off the half-length $f(\\varphi)\\pi$ on each parallel; **divide every parallel into equal parts** for the meridians; join the corresponding points with a French curve. The construction below does it for Kavrayskiy's map with a table.

> [!tip] Every pseudocylindrical map is a table of two columns and the rule "divide each parallel equally". To copy a map from an atlas you only need to measure the parallels.`,
  ideas: [
    'Parallels are straight, horizontal and parallel; each has its own length 2πf(φ) and is divided equally by the meridians.',
    'The map is x = f(φ)λ, y = g(φ): two functions of the latitude define it, and every meridian is the same curve squeezed horizontally.',
    'The map is equal-area exactly when f(φ)g\'(φ) = R² cos φ; no such map can be conformal, because the scale along a meridian depends on the longitude.',
    'A pointed pole (sinusoidal, Mollweide) or a flat pole (Eckert, Robinson, Equal Earth) is a design choice that moves the distortion about.',
    'Drawing one by hand needs a table of two columns, a pair of dividers for the equal division, and a French curve for the meridians.'
  ],
  pitfalls: [
    'The meridians of a pseudocylindrical map are straight — Only the central meridian is. All the others are curves, because every parallel has a different length and each is divided in the same ratio.',
    'A flat pole is a flaw in the map — The pole is a point on the globe, so a map that draws it as a line stretches it, but it is a choice: it reduces the pinching near the pole that a pointed pole imposes.',
    'Pseudocylindrical maps can be made conformal by a good choice of f and g — They cannot: the scale along the meridian depends on the longitude through f\'(φ)λ, the scale along the parallel does not, and no choice makes them equal everywhere.'
  ],
  formulas: [
    {
      name: 'Spacing of the meridians along a parallel',
      expr: 's = L*dlam/(2*pi)',
      tex: 's = \\frac{L\\,\\Delta\\lambda}{2\\pi}',
      vars: { s: { name: 'distance between two neighbouring meridians along the parallel', q: 'length', unit: 'mm' }, L: { name: 'length of the whole parallel (360°) on the map', q: 'length', unit: 'mm', value: 300 }, dlam: { name: 'longitude step', q: 'angle', unit: '°', value: 30, min: 1, max: 180, tex: '\\Delta\\lambda' } },
      note: 'Every parallel is divided in equal parts, so the dividers are set to L/12 for meridians every 30°. A parallel 300 mm long gets a mark every 25 mm.'
    },
    {
      name: 'The equal-area condition',
      expr: 'gp = R^2*cos(phi)/f',
      tex: 'g\'(\\varphi) = \\frac{R^2\\cos\\varphi}{f(\\varphi)}',
      vars: { gp: { name: 'rate at which the parallels rise with latitude, dy/dφ', q: 'length', unit: 'mm', tex: 'g\'' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 89, tex: '\\varphi' }, f: { name: 'length of the parallel per radian of longitude', q: 'length', unit: 'mm', value: 70, tex: 'f' } },
      solveFor: 'gp',
      note: 'If the map is to be equal-area, a parallel drawn longer than the true R cos φ per radian must be spaced more closely: with f = 70 mm at 60° (the true value is 50 mm) the parallels rise only 71 mm per radian of latitude instead of 100. For f = R cos φ the spacing is exactly R and the parallels are at their true distances, as in the sinusoidal map.'
    }
  ],
  examples: [
    {
      title: 'Is this pair equal-area?',
      q: 'A pseudocylindrical map has f(φ) = R cos φ and y = g(φ) = R φ. Is it equal-area? Then a designer wants the parallels at 60° to be 0.7 R long per radian of longitude instead; how much must the parallels be spaced there?',
      steps: [
        { text: 'Here $g\' = R$, so', tex: 'f\\,g\' = R\\cos\\varphi \\cdot R = R^2\\cos\\varphi.' },
        'The condition is satisfied exactly: the map (the sinusoidal) is equal-area.',
        { text: 'With $f = 0.7R$ at 60°, the condition gives', tex: 'g\' = \\frac{R^2\\cos 60°}{0.7R} = 0.714\\,R.' },
        'The parallels there must rise only 0.714 R per radian of latitude instead of R, a squeezing in the ratio 0.714: the longer parallel (0.7 R against the true 0.5 R) is paid for by closer spacing.'
      ],
      a: 'The pair is the sinusoidal map and is equal-area; with f = 0.7 R at 60° the parallels must be spaced g\' = 0.714 R.'
    }
  ],
  quiz: [
    { q: 'What do all pseudocylindrical maps have in common?', choices: ['The meridians are straight', 'The parallels are straight, horizontal and parallel, each divided equally by the meridians', 'They are all equal-area', 'The poles are points'], a: 1, why: 'That is the definition. The meridians are curves except the central one, only some of the maps are equal-area, and the poles can be points or lines.' },
    { q: 'A parallel is 300 mm long on a pseudocylindrical map. How far apart are the meridians of 30° along it, in mm?', answer: 25, unit: 'mm', why: 'The parallel is divided equally: 360°/30° = 12 parts, 300/12 = 25 mm each.' },
    { q: 'A pseudocylindrical map with curved meridians can be conformal.', a: false, why: 'The scale along a meridian includes f\'(φ)λ, which depends on the longitude; the scale along a parallel does not. Conformality needs the two to be equal everywhere, which happens only when f is constant: a cylindrical map.' },
    { q: 'Which of these maps has a pointed pole?', choices: ['Sinusoidal', 'Eckert IV', 'Robinson', 'Equal Earth'], a: 0, why: 'The sinusoidal parallel has the length 2πR cos φ, which is zero at the pole. Eckert IV, Robinson and Equal Earth stop at a pole line of 0.5 to 0.6 of the equator.' },
    { q: 'What is the equal-area condition for x = f(φ)λ, y = g(φ)?', choices: ['f = g', 'f·g\' = R² cos φ', 'f·g = R² sin φ', 'g\' = 1'], a: 1, why: 'The strip between two parallels has the area 2πf g\' dφ on the map and 2πR² cos φ dφ on the globe.' }
  ],
  applications: [
    'World maps in atlases and journals when the whole earth must be shown on one rectangle-like sheet with moderate distortion: the Robinson, Eckert and Equal Earth maps.',
    'Thematic maps of the world (population, climate, forest, income) where equal areas matter: the sinusoidal, Mollweide, Eckert IV and Equal Earth.',
    'Equal-area data grids: the sinusoidal projection is the tile grid of NASA\'s MODIS land products, because equal cells are wanted.',
    'Teaching: a pseudocylindrical map is the quickest world map to draw by hand: a table, dividers and a flexible curve.'
  ],
  history: 'The family begins with the sinusoidal map, used by Jean Cossin in 1570, by Nicolas Sanson from 1650 and by Flamsteed for his star atlas. Karl Mollweide gave the first elliptical equal-area one in 1805, Max Eckert six in 1906, Goode his interrupted one in 1923, Wagner and Kavrayskiy the elliptical compromise maps of the 1930s, Arthur Robinson the table-defined one in 1963 and Šavrič, Patterson and Jenny the polynomial Equal Earth in 2018.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on pseudocylindrical projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson and others, *Elements of Cartography* (6th ed., 1995), on world projections.'],
  sim: ['ps-parallel-lengths', 'ps-map-viewer'],
  construction: 'ps-skeleton'
},

{
  id: 'sinusoidal-projection',
  parent: 'pseudocylindrical-and-compromise',
  title: 'The sinusoidal projection',
  level: 1,
  short: 'The simplest equal-area world map: parallels at their true distance, each drawn at its true length and divided truly, so that the meridians are sine curves. True along the equator, the central meridian and every parallel; strongly sheared near the edges.',
  keywords: ['sinusoidal', 'Sanson–Flamsteed', 'Sanson', 'Flamsteed', 'Cossin', 'equal-area', 'sine curve', 'MODIS grid', 'Africa', 'South America'],
  prereq: ['pseudocylindrical-projections', 'equal-area-maps'],
  related: ['mollweide-projection', 'bonne-projection', 'goode-homolosine', 'kavrayskiy-and-wagner', 'tissot-indicatrix'],
  body: `Divide the globe into the circles of latitude and unroll each one onto a straight line **at its true length**. That is the whole idea of the sinusoidal map. The parallels are put at their true distance apart, $y = R\\varphi$, so the central meridian is a true-scale straight line; the parallel of latitude $\\varphi$ is a horizontal segment of the length it has on the globe, $2\\pi R\\cos\\varphi$, divided into equal parts for equal steps of longitude. The point of longitude $\\lambda$ is therefore at
$$x = R\\,\\lambda\\cos\\varphi,\\qquad y = R\\,\\varphi .$$
Fix the longitude and the meridian is $x = R\\lambda\\cos(y/R)$: a **sine curve**, which gives the map its name. The outline, the meridian of ±180°, is a half-wave of cosine, and the poles are points.

### Why it keeps area
The strip between two nearby parallels has the right height ($R\\,d\\varphi$) and the right length ($2\\pi R\\cos\\varphi$); the map stretches nothing along the parallel and nothing along the central meridian, and is therefore equal-area, as the condition $f\\,g' = R^2\\cos\\varphi$ of [[pseudocylindrical-projections]] confirms. The scale along every parallel is exactly 1, and along the central meridian too. But the meridians slant: a meridian leaves the parallel at the angle $\\beta$ with $\\tan\\beta = 1/(\\lambda\\sin\\varphi)$, so at the equator the angle is 90° and it closes quickly with latitude and longitude. At 90° of longitude and 60° of latitude it is only 36°, the scale along the meridian is $\\sqrt{1 + \\lambda^2\\sin^2\\varphi} = 1.69$, and a small circle has become an ellipse with a 68° maximum error of angle.

### What it is good for
The projection is excellent near the equator and the central meridian, which is why it has been used for **Africa and South America**, both centred on the equator and narrow enough to sit on one meridian. A world map in one piece is poor, because the continents at the edges are sheared and the high latitudes are crushed; the cure is the interruption: cut the map into lobes, each with its own central meridian, and the shear almost disappears ([[goode-homolosine|Goode's map]] and the interrupted sinusoidal).

### Drawing it by hand
No table is needed (see the construction): the parallels go up the central meridian with the dividers, and the lengths $\\pi R\\cos\\varphi$ come from a quarter circle of radius $\\pi R$ with a set square, each point of the circle at the angle $\\varphi$ dropping a vertical to the parallel of the same latitude. Divide each parallel equally and draw the sines through the points. [[bonne-projection|Bonne's map]] with the standard parallel at the equator is the same map.

> [!fact] The sinusoidal map is the limit of the Bonne family when the standard parallel goes to the equator: the cone's apex moves to infinity, the arcs become straight lines, and each is still divided truly.`,
  ideas: [
    'The parallels are at their true distance (y = Rφ) and at their true length (2πR cos φ), divided equally: x = Rλ cos φ.',
    'The meridians are sine curves; the poles are points; the outline is the meridian ±180°.',
    'The map is equal-area; the scale along the central meridian and along every parallel is 1.',
    'The shear grows with longitude and latitude: at 90° and 60° a right angle becomes 36°. The map suits narrow equatorial regions.',
    'Interrupting the map into lobes (Goode, the interrupted sinusoidal) removes most of the shear.'
  ],
  pitfalls: [
    'The meridians of the sinusoidal map are straight — Only the central meridian is. The meridian of longitude λ is the sine curve x = Rλ cos φ.',
    'Equal-area means the shapes are right — The shapes are right only near the equator and the central meridian. At the edges the meridians cross the parallels at small angles and the continents are sheared into slivers.',
    'The map is a projection onto a cylinder, like Mercator — No geometric surface gives it: it is a construction, the parallels unrolled one by one at their true lengths.'
  ],
  formulas: [
    {
      name: 'Position on the sinusoidal map',
      expr: 'x = R*lam*cos(phi)',
      tex: 'x = R\\,\\lambda\\cos\\varphi',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, signed: true, min: -90, max: 90, tex: '\\varphi' } },
      solveFor: 'x',
      note: 'The height is simply y = R φ = 78.5 mm at 45° for R = 100 mm; at 60° of longitude the point is 74.05 mm from the central meridian.'
    },
    {
      name: 'Length of a parallel',
      expr: 'L = 2*pi*R*cos(phi)',
      tex: 'L = 2\\pi R\\cos\\varphi',
      vars: { L: { name: 'length of the whole parallel (360°)', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\varphi' } },
      solveFor: 'L',
      note: 'The length the parallel has on the globe: the equator is 2πR = 628 mm, the 60° parallel half of that, and the pole has none.'
    },
    {
      name: 'Angle between a meridian and a parallel',
      expr: 'beta = atan(1/(lam*sin(phi)))',
      tex: '\\tan\\beta = \\frac{1}{\\lambda\\sin\\varphi}',
      vars: { beta: { name: 'angle between meridian and parallel', q: 'angle', unit: '°', tex: '\\beta' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 90, min: 5, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 5, max: 90, tex: '\\varphi' } },
      solveFor: 'beta',
      note: 'The slope of the sine curve: λ is in radians in the formula. At 90° of longitude and 60° of latitude it gives 36.3°; at 180° and 80°, 10.8°.'
    }
  ],
  examples: [
    {
      title: 'A point and a parallel',
      q: 'On a sinusoidal map with a globe of radius 100 mm, where is the point 60° E, 45° N? How long is the parallel of 60° N, and at what angle does the meridian cross the parallel at 90° E, 60° N?',
      steps: [
        { text: 'The position:', tex: 'x = 100 \\times 1.0472 \\times \\cos 45° = 74.05\\ \\text{mm}, \\qquad y = 100 \\times 0.7854 = 78.54\\ \\text{mm}.' },
        { text: 'The parallel of 60° has the length', tex: 'L = 2\\pi \\times 100 \\times \\cos 60° = 314.2\\ \\text{mm},' },
        'half the equator\'s 628.3 mm, divided into twelve parts of 26.2 mm for the meridians every 30°.',
        { text: 'The angle of the meridian at 90° E, 60° N:', tex: '\\tan\\beta = \\frac{1}{1.5708 \\times \\sin 60°} = 0.735,\\qquad \\beta = 36.3°.' }
      ],
      a: 'The point is at (74.05, 78.54) mm; the 60° parallel is 314.2 mm long; the meridian crosses the parallel at 90° E, 60° N at 36.3°, not 90°.'
    }
  ],
  quiz: [
    { q: 'Why is the sinusoidal map equal-area?', choices: ['Its meridians are sine curves', 'Every strip between two parallels keeps its true height and its true length', 'It is projected onto a cylinder', 'Its poles are points'], a: 1, why: 'The parallels are at their true spacing and each has the length it has on the globe, so each strip has the right area. The sine curves are a consequence, not the cause.' },
    { q: 'How long is the parallel of 60° on a sinusoidal map of a globe with radius 100 mm?', answer: 314.2, unit: 'mm', why: '2πR cos 60° = 628.3 × 0.5 = 314.2 mm: the length it has on the globe.' },
    { q: 'On the sinusoidal map the scale along every parallel is 1.', a: true, why: 'Each parallel is drawn at the length it has on the globe, so the scale along it is exactly 1 (and along the central meridian too). The scale along the other meridians is above 1.' },
    { q: 'Which regions does the sinusoidal projection suit best?', choices: ['The poles', 'Narrow regions along the equator, such as Africa or South America', 'Wide regions in the mid-latitudes', 'The whole world in one piece'], a: 1, why: 'The distortion is small near the equator and the central meridian and grows towards the edges and towards the poles.' },
    { q: 'At what acute angle does a meridian cross the parallel of latitude 45° at 60° of longitude from the central meridian on the sinusoidal map? Give the angle in degrees.', answer: 53.5, unit: '°', why: 'tan β = 1/(λ sin φ) = 1/(1.0472 × 0.7071) = 1.350, so β = 53.5°: a right angle of the globe is drawn as 53.5° (and 126.5° on the other side).' }
  ],
  applications: [
    'Maps of Africa and South America in atlases: both lie across the equator and fit on one meridian, so the shear stays small.',
    'The tile grid of NASA\'s MODIS land products: the sinusoidal projection gives equal-area cells that tile the globe in rows, so every pixel represents the same ground area.',
    'Interrupted world maps (the interrupted sinusoidal, the lower half of Goode\'s map): each lobe is a small sinusoidal map with its own central meridian.',
    'Star maps: Flamsteed used it for his celestial atlas (1729), where the equal spacing of the declination circles and the true length of each circle of right ascension made the plotting simple.'
  ],
  history: 'The map is old, simple and often reinvented. It appears on the world map of Jean Cossin of Dieppe (1570), was used by Nicolas Sanson in his atlases from 1650 and by John Flamsteed in his star atlas (published 1729), and so carries the names of Sanson and Flamsteed.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the sinusoidal projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson and others, *Elements of Cartography* (6th ed., 1995).'],
  sim: [{ id: 'ps-map-viewer', params: { map: 'sinusoidal' } }, { id: 'ps-distortion-map', params: { map: 'sinusoidal', compare: 'mollweide' } }],
  construction: 'ps-sinusoidal'
},

{
  id: 'mollweide-projection',
  parent: 'pseudocylindrical-and-compromise',
  title: 'The Mollweide projection',
  level: 2,
  short: 'The whole world in an ellipse twice as wide as high, with the area of the sphere: the parallels are placed at heights set by an auxiliary angle θ with 2θ + sin 2θ = π sin φ, so that every strip keeps its area, and the meridians are half-ellipses. The classic equal-area map of the world, used for climate, sky surveys and cosmic background maps.',
  keywords: ['Mollweide', 'homalographic', 'Babinet', 'ellipse', 'equal-area', 'auxiliary angle', 'Newton', 'Kepler-like equation', 'sky map', 'CMB'],
  prereq: ['pseudocylindrical-projections', 'equal-area-maps', 'math:ellipse'],
  related: ['sinusoidal-projection', 'goode-homolosine', 'eckert-projections', 'aitoff-and-hammer', 'math:newtons-method'],
  body: `Karl Mollweide asked for an **ellipse**: a map of the whole world, twice as wide as high, whose parallels are straight lines and whose meridians are all ellipses of the same height, and which keeps every area. Fix the ellipse first. An ellipse of area $4\\pi R^2$, the area of the sphere, and of axis ratio 2 : 1 has semi-axes
$$a = 2\\sqrt{2}\\,R, \\qquad b = \\sqrt{2}\\,R .$$
Its outline is the meridian of $\\pm 180°$. The equator is the long axis, the central meridian the short one, and the parallel at the height $y = b\\sin\\theta$ ends on the ellipse at $x = a\\cos\\theta$. The question is which $\\theta$ belongs to which latitude.

### The auxiliary angle
Let the cap of the ellipse north of the parallel have the same area as the cap of the sphere north of the latitude (Archimedes: $2\\pi R^2(1 - \\sin\\varphi)$). The elliptical cap is $ab\\,(\\pi/2 - \\theta - \\sin\\theta\\cos\\theta)$, and equating the two gives (see the derivation)
$$2\\theta + \\sin 2\\theta = \\pi \\sin\\varphi .$$
There is no closed formula for $\\theta$, but Newton's method finds it in three or four steps from the first guess $\\theta = \\varphi$: $\\theta \\leftarrow \\theta - \\dfrac{2\\theta + \\sin 2\\theta - \\pi\\sin\\varphi}{2 + 2\\cos 2\\theta}$. Each parallel is then divided equally, so
$$x = \\frac{2\\sqrt2}{\\pi}\\,R\\,\\lambda\\cos\\theta, \\qquad y = \\sqrt2\\,R\\sin\\theta .$$
A meridian is a half-ellipse with the horizontal semi-axis $(2\\sqrt2/\\pi)R\\lambda$ and the vertical semi-axis $\\sqrt2 R$.

### What it keeps and loses
Area is exact everywhere. The scale along the parallels is 1 on the two parallels of $\\pm 40°44'$, where $\\cos\\varphi = (2\\sqrt2/\\pi)\\cos\\theta$; where those parallels meet the central meridian the scale is 1 in every direction, the only two points of the map without distortion. At the centre, by contrast, the scale is 0.90 along the equator and 1.11 along the meridian, so that a circle there is already an ellipse, with a 12° error of angle. The error of shape stays small along the central meridian and increases towards the corners and the poles (17° at 60° on the central meridian, 69° at 120° E, 60° N). The poles are points where the meridians come together at a sharp angle, which pinches the shapes of the arctic lands. The map looks like a globe flattened, which is why it is popular for world maps of data that are about areas.

### Drawing it by hand
Draw two concentric circles of radius $\\sqrt2 R$ and $2\\sqrt2 R$. For each latitude read $\\theta$ from a table; the ray at that angle cuts the inner circle at the height of the parallel and the outer one at the end of the parallel (the ellipse by the concentric-circle method). Divide each parallel into equal parts and draw the half-ellipses of the meridians.

> [!fact] The auxiliary-angle trick belongs to a family: Eckert IV, Eckert VI and Goode's caps solve similar equations by the same method.`,
  ideas: [
    'The map is an ellipse of semi-axes 2√2 R and √2 R, with the area of the sphere; the poles are points.',
    'The parallel of latitude φ is at the height √2 R sin θ, where 2θ + sin 2θ = π sin φ; Newton\'s method solves it in a few steps.',
    'The meridians are half-ellipses; the parallels are divided equally; x = (2√2/π) R λ cos θ.',
    'The map is equal-area; the scale along the parallels is 1 at ±40°44′ (the join of Goode\'s map).',
    'Pointed poles pinch the shapes of the polar lands; the central part is good.'
  ],
  pitfalls: [
    'The parallels of the Mollweide are placed at the true distances — They bunch towards the poles; the spacing is set by the area requirement through θ, not by the arc of the meridian.',
    'The Mollweide map is undistorted at its centre — The centre is not where the distortion is smallest: there the scale is 0.90 along the equator and 1.11 along the meridian. The two undistorted points are on the central meridian at ±40°44′.',
    'The auxiliary angle θ is the latitude — They are equal at the equator and the pole only; at 50° the latitude is 50° and θ is 40.6°.'
  ],
  derivation: {
    title: 'Where 2θ + sin 2θ = π sin φ comes from',
    intro: 'A map in the shape of an ellipse, 2 : 1, with the area of the sphere, and with the parallels straight lines, is equal-area if every cap above a parallel has the area of the cap of the sphere.',
    steps: [
      { text: 'The area of the ellipse must be that of the sphere, and the axes are in the ratio 2 : 1:', tex: '\\pi a b = 4\\pi R^2,\\quad a = 2b \\;\\Rightarrow\\; b = \\sqrt2 R,\\quad a = 2\\sqrt2 R.' },
      { text: 'Put the parallel at the height $y = b\\sin\\theta$. The part of the ellipse above it is the part of a unit circle above $\\sin\\theta$, stretched by $ab$:', tex: 'A_{\\text{map}} = ab\\left(\\frac{\\pi}{2} - \\theta - \\sin\\theta\\cos\\theta\\right) = 4R^2\\left(\\frac{\\pi}{2} - \\theta - \\frac{\\sin 2\\theta}{2}\\right).' },
      { text: 'The cap of the sphere north of latitude $\\varphi$ has (by Archimedes) the area', tex: 'A_{\\text{sphere}} = 2\\pi R^2(1 - \\sin\\varphi).' },
      { text: 'Equal caps for every latitude:', tex: '4R^2\\left(\\frac{\\pi}{2} - \\theta - \\frac{\\sin 2\\theta}{2}\\right) = 2\\pi R^2(1 - \\sin\\varphi) \\;\\Longrightarrow\\; 2\\theta + \\sin 2\\theta = \\pi\\sin\\varphi.' },
      { text: 'Finally each parallel, of half-length $a\\cos\\theta$, is divided in the ratio $\\lambda : \\pi$:', tex: 'x = \\frac{a\\cos\\theta}{\\pi}\\lambda = \\frac{2\\sqrt2}{\\pi}R\\lambda\\cos\\theta.' }
    ],
    outro: 'Because the caps match for every latitude, the strips match too, and the map is equal-area.'
  },
  formulas: [
    {
      name: 'Mollweide\'s equation for the auxiliary angle',
      expr: '2*theta + sin(2*theta) = pi*sin(phi)',
      tex: '2\\theta + \\sin 2\\theta = \\pi\\sin\\varphi',
      vars: { theta: { name: 'auxiliary angle', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\theta' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, signed: true, min: -90, max: 90, tex: '\\varphi' } },
      solveFor: 'theta',
      note: 'Solved numerically: φ = 50° gives θ = 40.63°; φ = 30°, 23.83°; φ = 60°, 49.68°; φ = 80°, 70.98°.'
    },
    {
      name: 'One Newton step',
      expr: 'th1 = th0 - (2*th0 + sin(2*th0) - pi*sin(phi))/(2 + 2*cos(2*th0))',
      tex: '\\theta_1 = \\theta_0 - \\frac{2\\theta_0 + \\sin 2\\theta_0 - \\pi\\sin\\varphi}{2 + 2\\cos 2\\theta_0}',
      vars: { th1: { name: 'improved angle', q: 'angle', unit: '°', tex: '\\theta_1' }, th0: { name: 'first guess (start with θ = φ)', q: 'angle', unit: '°', value: 50, min: 5, max: 85, tex: '\\theta_0' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, min: 5, max: 85, tex: '\\varphi' } },
      solveFor: 'th1',
      note: 'From θ₀ = 50° the step gives 38.78°, the next 40.58°, then 40.63°: the error falls from 9° to 0.05° to 0.0007° in three steps.'
    },
    {
      name: 'Height of a parallel',
      expr: 'y = sqrt(2)*R*sin(theta)',
      tex: 'y = \\sqrt2\\,R\\sin\\theta',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 40.63, min: 0, max: 90, tex: '\\theta' } },
      solveFor: 'y',
      note: 'The pole is at θ = 90°, √2 R = 141.4 mm for R = 100 mm; the parallel of 50° is at 92.1 mm, not at 50/90 of the way.'
    },
    {
      name: 'Position of a point',
      expr: 'x = 2*sqrt(2)/pi*R*lam*cos(theta)',
      tex: 'x = \\frac{2\\sqrt2}{\\pi}R\\lambda\\cos\\theta',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 40.63, signed: true, min: -90, max: 90, tex: '\\theta' } },
      solveFor: 'x',
      note: 'For 60° E, 50° N (θ = 40.63°) and R = 100 mm: x = 71.55 mm.'
    }
  ],
  examples: [
    {
      title: 'The parallel of 50°',
      q: 'On a Mollweide map with R = 100 mm find the auxiliary angle for 50° N by Newton\'s method, the height of the parallel, its half-length, and the position of 60° E on it.',
      steps: [
        { text: 'The target is $\\pi\\sin 50° = 2.4066$. From $\\theta_0 = 50° = 0.8727$ rad the function is $0.3235$ and its slope $2 + 2\\cos 100° = 1.6527$; the step gives', tex: '\\theta_1 = 0.8727 - 0.1957 = 0.6770\\ \\text{rad} = 38.78°.' },
        { text: 'Again: $f(\\theta_1) = -0.0763$, slope $2.431$, so', tex: '\\theta_2 = 0.6770 + 0.0314 = 0.7084 = 40.58°, \\qquad \\theta_3 = 40.629°.' },
        { text: 'The height and the half-length of the parallel:', tex: 'y = \\sqrt2 \\times 100\\sin 40.63° = 92.1\\ \\text{mm},\\qquad \\frac{L}{2} = 2\\sqrt2 \\times 100\\cos 40.63° = 214.7\\ \\text{mm}.' },
        { text: 'The point 60° E (a third of the half-length):', tex: 'x = \\frac{2\\sqrt2}{\\pi} \\times 100 \\times 1.0472 \\times \\cos 40.63° = 71.55\\ \\text{mm}.' }
      ],
      a: 'θ = 40.63°; the parallel is 92.1 mm above the equator and 214.7 mm either side of the central meridian at its ends; 60° E is at x = 71.55 mm.'
    }
  ],
  quiz: [
    { q: 'What is the vertical semi-axis of the Mollweide ellipse for a globe of radius 100 mm?', answer: 141.4, unit: 'mm', why: 'b = √2 R = 141.4 mm; the horizontal semi-axis is 2√2 R = 282.8 mm, and the ellipse has the area π·282.8·141.4 = 125 664 mm², the sphere\'s 4π·100².' },
    { q: 'The parallel of 50° on the Mollweide map lies', choices: ['at 50/90 of the way from the equator to the pole', 'higher than 50/90 of the way', 'lower than 50/90 of the way', 'at the same height as on the sinusoidal map'], a: 1, why: 'y = √2 R sin 40.63° = 92.1 mm against a pole at 141.4 mm: 65 % of the way, not 56 %. The parallels bunch towards the poles to keep the areas.' },
    { q: 'The Mollweide map is exact for angles at the centre.', a: false, why: 'It is equal-area. At the centre the scale is 0.90 along the equator and 1.11 along the meridian: their product is 1, but a circle is already an ellipse there.' },
    { q: 'Which first guess does Newton\'s method for the auxiliary angle conveniently start from?', choices: ['θ = 0', 'θ = φ', 'θ = 90°', 'θ = φ/2'], a: 1, why: 'θ and φ agree at the equator and the pole and differ by less than 10° between; starting from θ = φ the method converges to 0.001° in three or four steps.' },
    { q: 'On the Mollweide map the scale along the parallels is exactly 1 at the latitude of', choices: ['0°', '30°', '40°44′', '60°'], a: 2, why: 'Where cos φ = (2√2/π) cos θ: the length on the map equals the length on the globe. That is the parallel at which Goode joins the sinusoidal map to the Mollweide.' }
  ],
  applications: [
    'World maps of climate, vegetation, population density and other quantities per unit area, where the equal-area property keeps the colours honest and the oval shape looks like the Earth.',
    'All-sky maps in astronomy: the cosmic microwave background maps of WMAP and Planck, and most HEALPix sky maps, are shown in the Mollweide projection.',
    'Atlases and school books that want an equal-area world map in one piece with moderate distortion at the centre.',
    'Goode\'s homolosine, whose polar caps are the Mollweide map.'
  ],
  history: 'Karl Brandan Mollweide, a mathematician and astronomer at Halle and Leipzig (he is also remembered for a trigonometric formula), published the map in 1805 in a journal edited by Franz Xaver von Zach, calling it the homalographic ("equal-surface") projection. Jacques Babinet rediscovered it in 1857, and it carries his name in some books.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Mollweide projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'K. B. Mollweide, "Beschreibung einer neuen Netzprojektion", *Monatliche Correspondenz* 11 (1805).'],
  sim: ['ps-mollweide-theta', { id: 'ps-map-viewer', params: { map: 'mollweide' } }],
  construction: 'ps-mollweide'
},

{
  id: 'goode-homolosine',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Goode\'s interrupted homolosine',
  level: 2,
  short: 'Two equal-area maps joined at the parallel 40°44′ where they have the same width, the sinusoidal map below and the Mollweide above, and cut into lobes through the oceans so that each continent has a central meridian of its own. Equal-area, with the continents in good shape; the map of land-cover and soil maps.',
  keywords: ['Goode', 'homolosine', 'interrupted', 'lobes', 'equal-area', 'sinusoidal', 'Mollweide', '40°44′', 'oceanic interruption', 'land cover', 'Rand McNally'],
  prereq: ['sinusoidal-projection', 'mollweide-projection', 'equal-area-maps'],
  related: ['pseudocylindrical-projections', 'eckert-projections', 'robinson-projection', 'tissot-indicatrix', 'compromise-maps'],
  body: `John Paul Goode asked how to keep both virtues: the **sinusoidal** map is nearly undistorted near the equator but sheared at high latitudes, the **Mollweide** is better towards the poles but poorer near the equator. His answer was to use each where it is better, joined along the parallel of latitude where the two have the same width, and then to **interrupt** the whole, cutting the map into lobes through the oceans so that each continent stays near the central meridian of its own lobe.

### The join
Both maps are equal-area, and both put a parallel at $x = \\lambda\\cdot(\\text{width})$. The sinusoidal width is $R\\cos\\varphi$ per radian; the Mollweide is $(2\\sqrt2/\\pi)R\\cos\\theta$. They are equal when $\\cos\\varphi = (2\\sqrt2/\\pi)\\cos\\theta$ with $2\\theta + \\sin2\\theta = \\pi\\sin\\varphi$, which happens at
$$\\varphi_J = 40°44'11.8'' = 40.7367°,\\qquad \\theta_J = 32.69°.$$
At that latitude the Mollweide parallel stands at $\\sqrt2\\sin\\theta_J = 0.7638\\,R$ above the equator and the sinusoidal one at $\\varphi_J = 0.7110\\,R$; the Mollweide part is moved down by $0.0528\\,R$ so that the parallels meet, and the lobe edges join without a kink. Below the join the map is the sinusoidal map, $x = c + (L - c)\\cos\\varphi$ for a lobe with central meridian $c$ (all longitudes in radians); above it, the Mollweide map, with the pole at $\\sqrt2 - 0.0528 = 1.3614\\,R$.

### The lobes
The standard version has six lobes. In the north, one with central meridian −100° (the Americas, cut at −180° and −40°) and one with +30° (Europe, Africa and Asia, cut at −40° and 180°); in the south, four with central meridians −160°, −60°, +20° and +140°, cut at −180°, −100°, −20°, 80° and 180°. The cuts run through the Pacific, the Atlantic, the Indian Ocean and the Arctic; inside each lobe the shear is only that of a small sinusoidal map. The whole is **equal-area** because each piece is. It can be cut the other way (an *oceanic interruption*) to keep the oceans whole for maps of currents and winds.

### What it keeps and loses
Areas are exact and the continents are drawn in nearly their true shapes: the mean shape distortion over the land is about half that of the uninterrupted maps. What is lost is the **continuity of the ocean** (distances and routes across a cut cannot be read) and the neighbourhood relations across the cuts. It is a map for statistics and distributions, not for navigation.

### Drawing it by hand
Draw the equator at its true length and mark the six central meridians; erect them to the pole heights; draw the sine-curve edges up to the join and the Mollweide arcs above it; fill each lobe with parallels and meridians, as in the sinusoidal and Mollweide constructions.

> [!note] The name is a blend of *homolographic* (Mollweide's equal-surface projection) and *sinusoidal*: homolo-sine.`,
  ideas: [
    'Goode\'s map is the sinusoidal map below ±40°44′ and the Mollweide map above, shifted by 0.0528 R, joined where the parallels have the same length.',
    'It is cut into lobes through the oceans; each continent lies near the central meridian of its own lobe.',
    'It is equal-area throughout and has about half the mean shape distortion of the uninterrupted maps over the land.',
    'The price is the broken ocean and the missing neighbourhoods across the cuts; it is a map for distributions, not for routes.'
  ],
  pitfalls: [
    'Goode\'s map is a different projection from the sinusoidal and Mollweide — It is built of their pieces, equal-area like both; what is new is the join and the interruption.',
    'The cuts are an error in the data — They are deliberate: the oceans are sacrificed so that the continents can be drawn in good shape.',
    'The join is at the parallel of 40° because it is a round number — It is at 40°44′11.8″ because that is where the sinusoidal and Mollweide parallels have the same length.'
  ],
  formulas: [
    {
      name: 'A point in a lobe, below the join',
      expr: 'x = R*(c + (lam - c)*cos(phi))',
      tex: 'x = R\\left[c + (\\lambda - c)\\cos\\varphi\\right]',
      vars: { x: { name: 'distance from the central meridian of the whole map', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, c: { name: 'central meridian of the lobe', q: 'angle', unit: '°', value: 30, signed: true, min: -180, max: 180 }, lam: { name: 'longitude of the point', q: 'angle', unit: '°', value: 80, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude (below 40°44′)', q: 'angle', unit: '°', value: 30, signed: true, min: -41, max: 41, tex: '\\varphi' } },
      solveFor: 'x',
      note: 'The sinusoidal part: the lobe is a sinusoidal map about its own central meridian c, shifted by R c. For 80° E on the lobe centred 30° E at 30° N, x = 100 × (0.5236 + 0.8727 × 0.866) = 127.9 mm.'
    },
    {
      name: 'A point in a lobe, above the join',
      expr: 'x = R*(c + 2*sqrt(2)/pi*(lam - c)*cos(theta))',
      tex: 'x = R\\left[c + \\frac{2\\sqrt2}{\\pi}(\\lambda - c)\\cos\\theta\\right]',
      vars: { x: { name: 'distance from the central meridian of the whole map', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, c: { name: 'central meridian of the lobe', q: 'angle', unit: '°', value: 30, signed: true, min: -180, max: 180 }, lam: { name: 'longitude of the point', q: 'angle', unit: '°', value: 80, signed: true, min: -180, max: 180, tex: '\\lambda' }, theta: { name: 'auxiliary angle of the latitude', q: 'angle', unit: '°', value: 49.68, signed: true, min: -90, max: 90, tex: '\\theta' } },
      solveFor: 'x',
      note: 'The Mollweide part, with θ from 2θ + sin 2θ = π sin φ (49.68° at 60°). The height is y = ±(√2 R sin θ − 0.0528 R).'
    }
  ],
  examples: [
    {
      title: 'The join',
      q: 'Check that the sinusoidal and Mollweide parallels have the same width at φ = 40.7367°, and find the height of the pole in Goode\'s map for R = 100 mm.',
      steps: [
        { text: 'The auxiliary angle: $\\pi\\sin 40.7367° = 2.0508$, so $\\theta_J = 32.69°$ (both sides of $2\\theta + \\sin2\\theta = \\pi\\sin\\varphi$ come to 2.051).' },
        { text: 'The Mollweide width per radian:', tex: '\\frac{2\\sqrt2}{\\pi}\\cos 32.69° = 0.9003 \\times 0.8419 = 0.7580.' },
        { text: 'The sinusoidal width:', tex: '\\cos 40.7367° = 0.7580.' },
        'They agree. The heights differ: 0.7638 R (Mollweide) against 0.7110 R (sinusoidal), a gap of 0.0528 R, which is why the Mollweide part is moved down.',
        { text: 'The pole is the Mollweide pole lowered by the same amount:', tex: 'y_{\\text{pole}} = (\\sqrt2 - 0.0528) \\times 100 = 136.1\\ \\text{mm}.' }
      ],
      a: 'The widths agree at 0.7580; the Mollweide part is lowered by 0.0528 R; the poles are 136.1 mm above and below the equator for R = 100 mm.'
    }
  ],
  quiz: [
    { q: 'Why does Goode join the sinusoidal and Mollweide maps at 40°44′?', choices: ['It is the latitude of Chicago', 'The two parallels have the same length there', 'The scale is 1 on the central meridian only there', 'The two maps have the same area there'], a: 1, why: 'At that latitude cos φ = (2√2/π) cos θ: the two parallels have the same width, so the lobe edges join without a corner (after shifting the Mollweide part by 0.0528 R).' },
    { q: 'How many lobes has the standard interrupted homolosine?', answer: 6, why: 'Two in the north (cuts at −180°, −40°, 180°) and four in the south (cuts at −180°, −100°, −20°, 80°, 180°).' },
    { q: 'Goode\'s homolosine is equal-area.', a: true, why: 'It is made of pieces of two equal-area maps with the parallels fitted together, so every region keeps its area; the interruptions do not change areas.' },
    { q: 'What is lost by interrupting the map?', choices: ['The equal-area property', 'The unbroken view of the oceans and the neighbourhood across the cuts', 'The straight parallels', 'The pole lines'], a: 1, why: 'The cuts lie in the oceans, so distances and routes across them cannot be read; the areas and shapes of the lands are better.' },
    { q: 'In Goode\'s map the central meridian of the lobe that holds Europe, Africa and Asia is', choices: ['−100°', '0°', '30°', '140°'], a: 2, why: 'The northern lobe from −40° to 180° is centred on 30° E, near the middle of Africa and Eurasia.' }
  ],
  applications: [
    'Global land-cover and vegetation data sets: the 1 km global land-cover data of the USGS were published on the interrupted Goode homolosine grid.',
    'Goode\'s World Atlas (Rand McNally), a standard school and library atlas for generations, whose world maps use this projection.',
    'Soil, geology and crop maps of the world where areas matter and the oceans do not.',
    'Maps of the global distribution of species and diseases, where each continent has to be seen in good shape.'
  ],
  history: 'John Paul Goode of the University of Chicago devised the homolosine in 1923 for his school atlas, and the interrupted form appeared in the 1925 *Goode\'s School Atlas*. His contribution was to join the two equal-area maps at the parallel where their widths agree and to interrupt the whole through the oceans.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Goode homolosine.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'J. Paul Goode, "The Homolosine Projection: A New Device for Portraying the Earth\'s Surface Entire", *Annals of the Association of American Geographers* 15 (1925).'],
  sim: ['ps-goode-lobes'],
  construction: 'ps-goode-lobes'
},

{
  id: 'eckert-projections',
  parent: 'pseudocylindrical-and-compromise',
  title: 'The Eckert projections',
  level: 2,
  short: 'Six world maps of 1906 in three pairs, all with flat poles half as long as the equator and an equator twice the central meridian: straight meridians (I, II), half-ellipses (III, IV) and sinusoids (V, VI). The even ones, Eckert IV and Eckert VI, are equal-area, and IV, with its stadium outline, is the most used.',
  keywords: ['Eckert', 'Eckert IV', 'Eckert VI', 'flat pole', 'elliptical meridians', 'equal-area', 'stadium', 'auxiliary angle', '1906', 'Petermanns'],
  prereq: ['pseudocylindrical-projections', 'mollweide-projection', 'equal-area-maps'],
  related: ['sinusoidal-projection', 'goode-homolosine', 'robinson-projection', 'kavrayskiy-and-wagner', 'equal-earth-and-natural-earth'],
  body: `In 1906 the German geographer Max Eckert published six new world maps, numbered I to VI. All six have **flat poles** exactly half as long as the equator, and an equator twice as long as the central meridian, which is how a stretched globe looks. They come in three pairs by the shape of the meridians: straight lines (I and II), half-ellipses (III and IV), sinusoids (V and VI). In each pair the odd member spaces the parallels equally and the even one keeps **areas**, which is why Eckert IV and Eckert VI are the ones in use.

### Eckert IV
The parallel of latitude $\\varphi$ is a horizontal at the height $y = c_2R\\sin\\theta$, with an auxiliary angle set, as in Mollweide's map, by the area condition:
$\\theta + \\sin\\theta\\cos\\theta + 2\\sin\\theta = \\left(2 + \\frac{\\pi}{2}\\right)\\sin\\varphi, \\qquad x = c_1R\\lambda\\,(1 + \\cos\\theta), \\qquad y = c_2 R\\sin\\theta .$
Here $c_1 = 2/\\sqrt{\\pi(4+\\pi)} = 0.4222$ and $c_2 = 2\\sqrt{\\pi/(4+\\pi)} = 1.3265$, and the coincidence $c_2 = \\pi c_1$ gives the outline its beauty: for $\\lambda = \\pm\\pi$ the equations describe a **semicircle of radius $c_2R$** on each side, joined above and below by straight pole lines of length $2c_2R$, the shape of a running track. The meridian of longitude $\\lambda$ is half an ellipse with its centre on the equator at $c_1R\\lambda$, a horizontal semi-axis $c_1R\\lambda$ and the same vertical semi-axis $c_2R$ as all the others.

### Eckert VI
The same proportions with **sinusoidal** meridians: $\\theta + \\sin\\theta = (1 + \\pi/2)\\sin\\varphi$, $x = R\\lambda(1 + \\cos\\theta)/\\sqrt{2+\\pi}$, $y = 2R\\theta/\\sqrt{2+\\pi}$. The parallels are equally spaced in $\\theta$, and the meridians are cosine curves, so the outline is made of two cosine curves instead of the semicircles of Eckert IV.

### What they keep and lose
Both are equal-area. The flat pole is the difference from [[mollweide-projection|Mollweide's map]]: at the central meridian it stretches the high latitudes east–west (the scale along the parallel of 60° is 1.32 against Mollweide's 1.17, and the error of angle there 31° against 17°), but it spares the outer polar corners the extreme shear: at 120° E, 60° N the angle error is 50° against 69°. The scale along the parallels is true at 40°30′ N and S for Eckert IV. As in every equal-area map the price is shape: the continents lean away from the central meridian.

### Drawing Eckert IV by hand
Draw the central meridian and equator; with centre O and radius $c_2R$ draw a circle whose points at the angle $\\theta$ (from a table: 13.4°, 27.0°, 41.1°, 55.8°, 71.8°, 90° for 15° to 90°) give the heights of the parallels; draw the two semicircles of the outline; rule the parallels to the outline and divide them equally; and draw the meridians as half-ellipses.

> [!tip] Look for the two circles: the one of radius $c_2R$ about the centre gives the heights, and the same radius about the points $(\\pm c_2R, 0)$ gives the outline.`,
  ideas: [
    'Eckert\'s six maps of 1906 have flat poles half the equator and an equator twice the central meridian; I, II have straight meridians, III, IV elliptical, V, VI sinusoidal.',
    'Eckert IV and VI are equal-area; the odd ones have equally spaced parallels.',
    'Eckert IV: x = c₁Rλ(1 + cos θ), y = c₂R sin θ, θ + sin θ cos θ + 2 sin θ = (2 + π/2) sin φ; its outline is two semicircles joined by the pole lines.',
    'Compared with Mollweide, the flat pole stretches the high latitudes east–west but spares the polar corners the extreme shear.'
  ],
  pitfalls: [
    'All six Eckert maps are equal-area — Only the even ones (II, IV, VI) are; the odd ones space the parallels equally.',
    'The meridians of Eckert IV are circular arcs — They are half-ellipses; only the outermost ones, ±180°, are circles (semicircles of radius c₂R).',
    'A flat pole removes the distortion at the pole — It reduces the pinching of shapes near the pole by spreading the pole into a line, but the scale along the parallels is then far too large there (1.32 at 60°).'
  ],
  formulas: [
    {
      name: 'Eckert IV: the auxiliary angle',
      expr: 'theta + sin(theta)*cos(theta) + 2*sin(theta) = (2 + pi/2)*sin(phi)',
      tex: '\\theta + \\sin\\theta\\cos\\theta + 2\\sin\\theta = \\left(2 + \\frac{\\pi}{2}\\right)\\sin\\varphi',
      vars: { theta: { name: 'auxiliary angle', q: 'angle', unit: '°', signed: true, min: -90, max: 90, tex: '\\theta' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, signed: true, min: -90, max: 90, tex: '\\varphi' } },
      solveFor: 'theta',
      note: 'φ = 15° gives θ = 13.42°; 30°, 27.03°; 45°, 41.05°; 60°, 55.78°; 75°, 71.75°.'
    },
    {
      name: 'Eckert IV: height of a parallel',
      expr: 'y = 2*sqrt(pi/(4 + pi))*R*sin(theta)',
      tex: 'y = 2\\sqrt{\\frac{\\pi}{4+\\pi}}\\,R\\sin\\theta',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 41.05, min: 0, max: 90, tex: '\\theta' } },
      solveFor: 'y',
      note: 'The pole is at c₂R = 132.65 mm for R = 100 mm: 0.94 of the Mollweide pole at 141.4 mm. The parallel of 45° is at 87.1 mm.'
    },
    {
      name: 'Eckert IV: position of a point',
      expr: 'x = 2/sqrt(pi*(4 + pi))*R*lam*(1 + cos(theta))',
      tex: 'x = \\frac{2}{\\sqrt{\\pi(4+\\pi)}}\\,R\\lambda\\,(1 + \\cos\\theta)',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 41.05, signed: true, min: -90, max: 90, tex: '\\theta' } },
      solveFor: 'x',
      note: 'For 60° E, 45° N and R = 100 mm: x = 77.56 mm. The full equator is 4c₂R = 530.6 mm long.'
    }
  ],
  examples: [
    {
      title: 'The shape of the track',
      q: 'For Eckert IV with R = 100 mm give the length of the equator, the length of the pole line, the height of the pole, and the position of the point 60° E, 45° N (θ = 41.05°).',
      steps: [
        { text: 'The outline is two semicircles of radius $c_2R = 1.3265 \\times 100 = 132.65$ mm joined by straight lines. The equator runs across both circles:', tex: 'L_{\\text{eq}} = 4c_2R = 530.6\\ \\text{mm}.' },
        { text: 'The pole line joins the tops of the two semicircles:', tex: 'L_{\\text{pole}} = 2c_2R = 265.3\\ \\text{mm} = \\tfrac12 L_{\\text{eq}}, \\qquad y_{\\text{pole}} = 132.65\\ \\text{mm}.' },
        { text: 'The point:', tex: 'x = 0.42224 \\times 100 \\times 1.0472 \\times (1 + \\cos 41.05°) = 77.56\\ \\text{mm},\\quad y = 132.65\\sin 41.05° = 87.11\\ \\text{mm}.' }
      ],
      a: 'Equator 530.6 mm, pole line 265.3 mm, pole at 132.65 mm; the point is at (77.56, 87.11) mm.'
    }
  ],
  quiz: [
    { q: 'How many times longer than the pole line is the equator on Eckert IV?', answer: 2, why: 'The equator is 4c₂R and the pole line 2c₂R: the pole line is exactly half the equator, as on all six of Eckert\'s maps.' },
    { q: 'What is the outline of Eckert IV?', choices: ['an ellipse', 'two semicircles joined by two straight lines', 'a circle', 'a rectangle with rounded corners'], a: 1, why: 'At λ = ±180° the equations give semicircles of radius c₂R; the straight lines are the poles.' },
    { q: 'Eckert V is an equal-area projection.', a: false, why: 'Only the even numbers (II, IV, VI) are equal-area; the odd ones space their parallels equally and so cannot be.' },
    { q: 'How high above the equator is the pole on Eckert IV drawn with R = 100 mm?', answer: 132.65, unit: 'mm', why: 'y = c₂R sin 90° = 1.3265 × 100 = 132.65 mm.' },
    { q: 'Compared with the Mollweide map, Eckert IV', choices: ['has smaller shape distortion everywhere', 'stretches the high latitudes more east–west along the central meridian, but shears the polar corners less', 'is conformal', 'has pointed poles'], a: 1, why: 'The flat pole makes the parallels of 60° long (scale 1.32 against 1.17) but avoids the pinching and extreme shear of the pointed poles.' }
  ],
  applications: [
    'Thematic world maps in atlases and textbooks (climate, vegetation, income, population per square kilometre), where an equal-area oval is wanted and the flat poles look natural.',
    'GIS packages that offer Eckert IV and VI as standard equal-area world projections.',
    'Oceanographic and atmospheric data maps of the whole globe, which often prefer the gentler outline of Eckert VI.',
    'Teaching: Eckert IV shows how the choice of the outline (here a stadium) and the equal-area condition together fix the whole map.'
  ],
  history: 'Max Eckert (later Eckert-Greifendorff), a German geographer who taught at Kiel, Aachen and Berlin, published the six maps in 1906 in *Petermanns Geographische Mitteilungen* under the title "Neue Entwürfe für Weltkarten". He is also the author of *Die Kartenwissenschaft* (1921–25), the first comprehensive German textbook of cartography, and of another equal-area projection of 1935.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on Eckert IV and VI.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Max Eckert, "Neue Entwürfe für Weltkarten", *Petermanns Geographische Mitteilungen* 52 (1906).'],
  sim: [{ id: 'ps-map-viewer', params: { map: 'eckert4' } }, { id: 'ps-parallel-lengths', params: { maps: ['mollweide', 'eckert4', 'sinusoidal', 'equal-earth'], show: 'k' } }],
  construction: 'ps-eckert4'
},

{
  id: 'robinson-projection',
  parent: 'pseudocylindrical-and-compromise',
  title: 'The Robinson projection',
  level: 2,
  short: 'A world map defined by a table instead of a formula: for every 5° of latitude, the length of the parallel and its distance from the equator, chosen by eye so that the map "looks right". Neither equal-area nor conformal, true in scale along 38° N and S; the National Geographic Society\'s world map from 1988 to 1998 and the model for Natural Earth.',
  keywords: ['Robinson', 'orthophanic', 'table', 'compromise', 'Rand McNally', 'National Geographic', '38°', 'Natural Earth', 'interpolation', 'flat pole'],
  prereq: ['pseudocylindrical-projections', 'compromise-maps'],
  related: ['equal-earth-and-natural-earth', 'winkel-tripel', 'eckert-projections', 'kavrayskiy-and-wagner', 'van-der-grinten'],
  body: `In 1961 Rand McNally asked the Wisconsin cartographer **Arthur H. Robinson** for a world map that would look right to the general reader. Robinson did not derive one from a principle. He drew a table: for every 5° of latitude, the **length of the parallel** compared with the equator, $X$, and its **distance from the equator** compared with the distance of the pole, $Y$, chosen and adjusted by eye until the map looked natural: *orthophanic*, "right-appearing". The map is
$x = 0.8487\\,R\\,X(\\varphi)\\,\\lambda, \\qquad y = 1.3523\\,R\\,Y(\\varphi),$
with $X$ and $Y$ taken from the 19 rows of the table (see the construction: 0°: 1.0000, 0.0000; 30°: 0.9600, 0.3720; 60°: 0.7986, 0.7346; 90°: 0.5322, 1.0000) and interpolated between them. The factor 0.8487 makes the scale along the parallels exactly right at 38°; 1.3523 is the matching factor for the heights.

### What the table does
It is a pseudocylindrical map with **flat poles** (the pole line is 0.5322 of the equator), parallels bunched a little more than equally towards the poles (the first 5° rise 0.062 of the pole height, the last 0.024) and parallels shortened smoothly towards the poles, from 1 to 0.53. The outline looks like a rounded barrel. Nothing is exactly kept: the map is neither equal-area nor conformal. The scale along the parallels is exactly true at **38° N and S**; at the equator it is 0.85, at 60° 1.36. The area scale is 0.82 at the centre of the map, 0.97 at 40°, 1.19 at 60° and 1.64 at 75°: the polar lands are 20 to 60 per cent too large, the tropics 18 per cent too small. Shapes are good near the central meridian and sheared at the edges, but, unlike the sinusoidal map, never extremely.

### Why a table?
Robinson's aim was visual, so the curve of the outline and the spacing of the parallels were drawn until they pleased; the values were then read off. Smooth (cubic) interpolation between the rows gives meridians without kinks; linear interpolation is accurate enough for a hand drawing.

### Drawing it by hand
This is the case where the "two columns and equal division" recipe of [[pseudocylindrical-projections]] is literally the whole method: lay off the heights $1.3523RY$ up the central meridian, the half-lengths $0.8487\\pi RX$ along each parallel, divide each parallel equally and join the points with a French curve.

> [!note] Robinson's table gave the map a durable look: Natural Earth (2008) was designed to resemble it with a smooth polynomial, and Equal Earth (2018) keeps its look but adds exact areas.`,
  ideas: [
    'The map is defined by a table of 19 rows: X, the length of the parallel, and Y, its distance from the equator, for every 5° of latitude.',
    'x = 0.8487 R X λ and y = 1.3523 R Y: a pseudocylindrical map with flat poles 0.53 of the equator and a rounded outline.',
    'Nothing is exactly kept: the scale along the parallels is true at 38° N and S; areas are 18 per cent too small at the equator and 19 per cent too large at 60°.',
    'It was chosen by eye to look "right" (orthophanic), not derived from a principle; National Geographic used it from 1988 to 1998.'
  ],
  pitfalls: [
    'The Robinson projection is a compromise computed to minimise the distortion — It was designed by eye to look natural; the minimising came later, when others compared it with computed compromises.',
    'The Robinson map has a formula — It has only a table; the "formulas" in programs are fits to the table or interpolations of it.',
    'It is equal-area because the polar lands look right — It is not: Greenland and Antarctica are 20 to 60 per cent too large, though far less than on Mercator.'
  ],
  formulas: [
    {
      name: 'Robinson: horizontal position',
      expr: 'x = 0.8487*R*Xr*lam',
      tex: 'x = 0.8487\\,R\\,X\\,\\lambda',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, Xr: { name: 'length of the parallel from the table (equator = 1)', value: 0.9216, min: 0.5, max: 1, tex: 'X' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' } },
      solveFor: 'x',
      note: 'At 40° (X = 0.9216) and 60° E with R = 100 mm: x = 81.9 mm.'
    },
    {
      name: 'Robinson: height of a parallel',
      expr: 'y = 1.3523*R*Yr',
      tex: 'y = 1.3523\\,R\\,Y',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, Yr: { name: 'distance from the equator from the table (pole = 1)', value: 0.4958, min: 0, max: 1, tex: 'Y' } },
      solveFor: 'y',
      note: 'At 40° (Y = 0.4958) with R = 100 mm: 67.05 mm; the pole is at 135.2 mm.'
    },
    {
      name: 'Scale along a parallel',
      expr: 'k = 0.8487*Xr/cos(phi)',
      tex: 'k = \\frac{0.8487\\,X}{\\cos\\varphi}',
      vars: { k: { name: 'scale along the parallel' }, Xr: { name: 'length of the parallel from the table (equator = 1)', value: 0.9216, min: 0.5, max: 1, tex: 'X' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 0, max: 89, tex: '\\varphi' } },
      solveFor: 'k',
      note: 'k = 0.849 at the equator, 1.02 at 40° (it is 1 at 38°), 1.36 at 60°.'
    }
  ],
  examples: [
    {
      title: 'The 40° parallel',
      q: 'On a Robinson map with R = 100 mm (X = 0.9216, Y = 0.4958 at 40°), where is the point 60° E, 40° N? How long is that parallel (the whole 360°)? What is the scale along it?',
      steps: [
        { text: 'The position:', tex: 'x = 0.8487 \\times 100 \\times 0.9216 \\times 1.0472 = 81.9\\ \\text{mm},\\qquad y = 1.3523 \\times 100 \\times 0.4958 = 67.05\\ \\text{mm}.' },
        { text: 'The parallel is twice the half-length $0.8487\\pi RX$:', tex: 'L = 2 \\times 0.8487 \\times \\pi \\times 100 \\times 0.9216 = 491.4\\ \\text{mm}.' },
        { text: 'On the globe the same parallel has the length $2\\pi R\\cos 40° = 481.3$ mm. The scale is', tex: 'k = \\frac{491.4}{481.3} = 1.021.' }
      ],
      a: 'The point is at (81.9, 67.05) mm; the parallel is 491.4 mm long and the scale along it 1.02 (it is 1 at 38°).'
    }
  ],
  quiz: [
    { q: 'How is the Robinson projection defined?', choices: ['by a conformal condition', 'by an equal-area condition', 'by a table of numbers chosen by eye', 'by projecting the globe onto a cylinder'], a: 2, why: 'There is no formula: the table of 19 rows (X and Y for every 5° of latitude) is the definition.' },
    { q: 'What is the height of the 60° parallel on a Robinson map with R = 100 mm? (Y = 0.7346)', answer: 99.3, unit: 'mm', why: 'y = 1.3523 × 100 × 0.7346 = 99.3 mm; the pole is at 135.2 mm.' },
    { q: 'The Robinson projection is equal-area.', a: false, why: 'The area scale is 0.82 at the centre and 1.19 at 60°: areas are not kept. The map is a compromise.' },
    { q: 'The scale along the parallels of the Robinson map is exactly 1 at', choices: ['the equator', '38° N and S', '45° N and S', '60° N and S'], a: 1, why: 'The factor 0.8487 and the table together make 0.8487 X / cos φ equal to 1 near 38° (1.002 at 38°, 0.85 at the equator, 1.36 at 60°).' },
    { q: 'How long is the pole line of the Robinson map compared with the equator?', choices: ['0', 'about 0.53', 'exactly 0.5', 'the same'], a: 1, why: 'X at 90° is 0.5322: the pole is a line a little over half the length of the equator.' }
  ],
  applications: [
    'The world map of the National Geographic Society from 1988 to 1998 (replacing Van der Grinten\'s), a standard of school wall maps and atlases of the period.',
    'General-reference world maps in atlases and textbooks, where the look of the world matters more than a measure.',
    'The model for later compromise maps: Natural Earth was fitted to its look, and Equal Earth reproduces it with exact areas.',
    'Teaching: the clearest example of a map defined by a table and of the compromise between area, shape and look.'
  ],
  history: 'Arthur H. Robinson (1915–2004), professor of geography at the University of Wisconsin, designed the projection in 1963 for Rand McNally, which had asked for a world map in 1961; he called it "orthophanic". The National Geographic Society adopted it in 1988 in place of Van der Grinten\'s and replaced it in 1998 with the Winkel tripel. The table was later fitted with smooth formulas by several authors, and Natural Earth is a close relation.',
  sources: ['Arthur H. Robinson, "A New Map Projection: Its Development and Characteristics" in *International Yearbook of Cartography* 14 (1974).', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Robinson projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).'],
  sim: ['ps-robinson-table', { id: 'ps-distortion-map', params: { map: 'robinson', compare: 'equal-earth' } }],
  construction: 'ps-robinson'
},

{
  id: 'winkel-tripel',
  parent: 'pseudocylindrical-and-compromise',
  title: 'The Winkel tripel',
  level: 2,
  short: 'A world map made by averaging two others point by point: the equirectangular map with its standard parallel at arccos(2/π) and the Aitoff map. Neither equal-area nor conformal, it keeps the three kinds of error — area, direction and distance — small together. The National Geographic Society\'s world map since 1998.',
  keywords: ['Winkel tripel', 'Oswald Winkel', 'Aitoff', 'equirectangular', 'average', 'compromise', 'National Geographic', 'arccos 2/π', 'three-fold'],
  prereq: ['aitoff-and-hammer', 'equirectangular-projection', 'compromise-maps'],
  related: ['robinson-projection', 'kavrayskiy-and-wagner', 'van-der-grinten', 'equal-earth-and-natural-earth', 'choosing-a-projection'],
  body: `Oswald Winkel's idea of 1921 was to build a good compromise out of two simple maps by **averaging** them: take each point of the globe to its position on map A and on map B, and put it midway. The two ingredients are chosen for opposite faults. The **equirectangular** map ($x = R\\lambda\\cos\\varphi_1$, $y = R\\varphi$) is a rectangle: it stretches the poles into long lines but keeps the north–south spacing true. The **Aitoff** map (the azimuthal equidistant map of the half-longitudes, widths doubled; see [[aitoff-and-hammer]]) is an ellipse with pointed poles. Averaged, the poles become short lines and the outline an oval with rounded corners.

### The formulas
With the angular distance $\\alpha$ from the centre of the map given by $\\cos\\alpha = \\cos\\varphi\\cos(\\lambda/2)$, and $k = \\alpha/\\sin\\alpha$,
$x = \\frac{R}{2}\\left[\\lambda\\cos\\varphi_1 + 2\\cos\\varphi\\sin\\frac{\\lambda}{2}\\,k\\right], \\qquad y = \\frac{R}{2}\\left[\\varphi + \\sin\\varphi\\,k\\right], \\qquad \\varphi_1 = \\arccos\\frac{2}{\\pi} = 50.46° .$
The standard parallel has a reason: with $\\cos\\varphi_1 = 2/\\pi$ the rectangle of the equirectangular map, $2\\pi R\\cos\\varphi_1 \\cdot \\pi R$, has exactly the area of the sphere, $4\\pi R^2$. The equator has the half-length $\\frac{R}{2}(\\pi\\cos\\varphi_1 + \\pi) = 2.571R$, the pole line the half-length $R$ (0.39 of the equator), and the central meridian is true to scale; the width to height of the whole map is 1.64 : 1.

### What it keeps and loses
Nothing exactly, except the scale along the central meridian. The scale along the equator is 0.82, and the area is 18 per cent too small at the centre and 24 per cent too large at 60° on the central meridian, 91 per cent at 75°. The error of angle on the central meridian is small, 12° at the equator and 2° at 40° (where the scale is nearly true in all directions) rising to 36° at 75°, and at 120° E, 60° N it is 39°, against 69° for the Mollweide. The point of "tripel" ("triple" in German) is the balance of the three: Winkel wanted to minimise at once the errors of area, direction and distance. A statistical comparison of common world maps in 2007 (Goldberg and Gott) rated it among the best of the usual compromises.

### Drawing it by hand
Draw the two parent graticules, each with its own nodes (the equirectangular one is just a grid; the Aitoff graticule is drawn as on its page), join each node to its twin with the straightedge, and **bisect the segment with the dividers**: the midpoints are the nodes of the Winkel map. Then draw the meridians and parallels through them.

> [!tip] The average of two pictures is a picture: you can also average two *photographs* of the world, one on each map, and the result is the Winkel map.`,
  ideas: [
    'Each point of the Winkel map is the midpoint of its images on the equirectangular map (standard parallel arccos 2/π = 50.46°) and on the Aitoff map.',
    'x = (R/2)[λ cos φ₁ + 2 cos φ sin(λ/2) α/sin α], y = (R/2)[φ + sin φ α/sin α], cos α = cos φ cos(λ/2).',
    'The poles are lines 0.39 of the equator; the central meridian is true; the outline is a rounded oval 1.64 : 1.',
    'Neither equal-area nor conformal: the errors of area, angle and distance are all moderate. National Geographic has used it since 1998.'
  ],
  pitfalls: [
    'The Winkel tripel is equal-area, as the National Geographic maps seem to suggest — The area scale is 0.82 at the centre and 1.24 at 60°, and about 1.7 at 70° N: Greenland is drawn some 1.7 times too large.',
    '"Tripel" means three standard parallels — It means "triple": the compromise between three kinds of error, area, direction and distance.',
    'The Winkel tripel is an Aitoff map — It is the average of the Aitoff and the equirectangular maps; the pole is a line, not a point.'
  ],
  formulas: [
    {
      name: 'The standard parallel of the equirectangular part',
      expr: 'phi1 = acos(2/pi)',
      tex: '\\varphi_1 = \\arccos\\frac{2}{\\pi}',
      vars: { phi1: { name: 'standard parallel of the equirectangular map', q: 'angle', unit: '°', tex: '\\varphi_1' } },
      note: '50.4598°: the value for which the equirectangular rectangle has the area of the sphere.'
    },
    {
      name: 'The angular distance from the centre',
      expr: 'cos(al) = cos(phi)*cos(lam/2)',
      tex: '\\cos\\alpha = \\cos\\varphi\\cos\\frac{\\lambda}{2}',
      vars: { al: { name: 'angular distance on the Aitoff hemisphere', q: 'angle', unit: '°', min: 0, max: 180, tex: '\\alpha' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, signed: true, min: -90, max: 90, tex: '\\varphi' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 120, signed: true, min: -180, max: 180, tex: '\\lambda' } },
      solveFor: 'al',
      note: 'For 120° E, 50° N: α = 71.2°. The Aitoff factor is k = α / sin α = 1.31.'
    },
    {
      name: 'Winkel tripel: horizontal position',
      expr: 'x = R*(lam*cos(phi1) + 2*cos(phi)*sin(lam/2)*kk)/2',
      tex: 'x = \\frac{R}{2}\\left[\\lambda\\cos\\varphi_1 + 2\\cos\\varphi\\sin\\frac{\\lambda}{2}\\,k\\right]',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 120, min: 0, max: 179, tex: '\\lambda' }, phi1: { name: 'standard parallel of the equirectangular part', q: 'angle', unit: '°', value: 50.4598, fixed: true, tex: '\\varphi_1' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, min: 0, max: 89, tex: '\\varphi' }, kk: { name: 'Aitoff factor α / sin α', value: 1.313, min: 1, max: 1.58, tex: 'k' } },
      solveFor: 'x',
      note: 'For 120° E, 50° N: the equirectangular image is at x = 133.3 mm, the Aitoff image at 146.2 mm, and the Winkel point at their mean, 139.8 mm (R = 100 mm).'
    },
    {
      name: 'Winkel tripel: height',
      expr: 'y = R*(phi + sin(phi)*kk)/2',
      tex: 'y = \\frac{R}{2}\\left[\\varphi + \\sin\\varphi\\,k\\right]',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, min: 0, max: 89, tex: '\\varphi' }, kk: { name: 'Aitoff factor α / sin α', value: 1.313, min: 1, max: 1.58, tex: 'k' } },
      solveFor: 'y',
      note: 'For 50° N: the equirectangular image is at y = 87.3 mm, the Aitoff image at 100.6 mm, the Winkel point at 93.9 mm.'
    }
  ],
  examples: [
    {
      title: 'The midpoint of two images',
      q: 'Find the Winkel position of the point 120° E, 50° N for R = 100 mm, as the midpoint of its images on the equirectangular map (standard parallel 50.46°) and on the Aitoff map.',
      steps: [
        { text: 'The equirectangular image:', tex: 'x_E = 100 \\times 2.0944 \\times \\cos 50.46° = 133.3,\\qquad y_E = 100 \\times 0.8727 = 87.3.' },
        { text: 'The angular distance: $\\cos\\alpha = \\cos 50° \\cos 60° = 0.3214$, $\\alpha = 71.24° = 1.2433$ rad; $k = \\alpha/\\sin\\alpha = 1.2433/0.9469 = 1.3130$. The Aitoff image (the same formulas with the factor 2 and no $\\varphi_1$):', tex: 'x_A = 2 \\times 100 \\times \\cos 50° \\sin 60° \\times 1.3133 = 146.2,\\qquad y_A = 100 \\sin 50° \\times 1.3133 = 100.6.' },
        { text: 'The average:', tex: 'x_W = \\frac{133.3 + 146.2}{2} = 139.8,\\qquad y_W = \\frac{87.3 + 100.6}{2} = 93.9\\ \\text{mm}.' }
      ],
      a: 'The Winkel tripel puts the point at (139.8, 93.9) mm, midway between (133.3, 87.3) and (146.2, 100.6).'
    }
  ],
  quiz: [
    { q: 'The Winkel tripel is made by', choices: ['projecting the globe onto a cone', 'averaging the equirectangular and the Aitoff maps point by point', 'doubling the widths of the Mollweide map', 'interrupting the Robinson map'], a: 1, why: 'Each point of the Winkel map is the midpoint of its images on the two parent maps.' },
    { q: 'What is the standard parallel of the equirectangular part, in degrees?', answer: 50.46, unit: '°', why: 'φ₁ = arccos(2/π) = 50.46°: the value that gives the rectangle the area of the sphere.' },
    { q: 'The pole on the Winkel tripel is a point.', a: false, why: 'The Aitoff pole is a point but the equirectangular pole is a line of the length of the equator\'s 0.64; the average is a line 0.39 of the equator.' },
    { q: 'Which statement about the scale of the Winkel tripel is right?', choices: ['It is true along the equator', 'It is true along the central meridian', 'It is conformal at the centre', 'It is equal-area'], a: 1, why: 'The central meridian is true to scale (y = Rφ on both parent maps); the equator has the scale 0.82.' },
    { q: 'What does "tripel" refer to?', choices: ['three standard parallels', 'three lobes', 'a compromise between three kinds of error: of area, direction and distance', 'three map sheets'], a: 2, why: 'Winkel meant a triple compromise; "Tripel" is German for "triple".' }
  ],
  applications: [
    'The National Geographic Society\'s standard world map since 1998, in its atlases, wall maps and magazine.',
    'General world maps for textbooks and media, where a balanced look is wanted and no single property is to be kept.',
    'Base maps for global data when neither area nor angle can be given up: a good default when a reader must be able to recognise the continents.',
    'Teaching: the clearest example of a compromise built by averaging, and of a projection checked by flexion and skewness measures.'
  ],
  history: 'Oswald Winkel (1874–1953), a German cartographer, published the map in 1921 as the third of a series of three averaged maps (Winkel I, II and III). It averages the equirectangular projection with the Aitoff projection of 1889. The National Geographic Society adopted it in 1998 in place of the Robinson projection, and a 2007 statistical comparison by Goldberg and Gott rated it among the best of the usual compromise maps.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Winkel tripel.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'David M. Goldberg and J. Richard Gott III, "Flexion and Skewness in Map Projections of the Earth", *Cartographica* 42 (2007).'],
  sim: ['ps-winkel-average'],
  construction: 'ps-winkel-tripel'
},

{
  id: 'aitoff-and-hammer',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Aitoff and Hammer',
  level: 2,
  short: 'Two oval world maps built the same way: draw the hemisphere of the half-longitudes in an azimuthal map, then double every width. With the azimuthal equidistant map the result is Aitoff\'s (1889), with Lambert\'s azimuthal equal-area map it is Hammer\'s (1892), the equal-area ellipse of the astronomer\'s all-sky chart.',
  keywords: ['Aitoff', 'Hammer', 'Hammer–Aitoff', 'azimuthal', 'equal-area', 'ellipse', 'all-sky map', 'half longitudes', 'doubled', 'chord'],
  prereq: ['azimuthal-equidistant-projection', 'lambert-azimuthal-equal-area', 'equal-area-maps'],
  related: ['winkel-tripel', 'mollweide-projection', 'eckert-projections', 'azimuthal-projections', 'the-all-sky-view'],
  body: `Two inventors, three years apart, had the same idea. Take the globe, imagine that every longitude is **half** what it really is, so that the whole world lies within one hemisphere of 180°, and draw that hemisphere in an azimuthal map centred on 0°, 0°. The map is a disc. Then **double every width**, $x \\to 2x$, leaving the heights alone; the disc becomes an ellipse twice as wide as high. Which azimuthal map is used makes the difference:

- the **azimuthal equidistant** map (distance $c$ from the centre drawn as $c$) gives **Aitoff's** map (David Aitoff, 1889);
- **Lambert's azimuthal equal-area** map (distance $c$ drawn as the chord $2R\\sin(c/2)$) gives **Hammer's** map (Ernst Hammer, 1892), which is therefore equal-area: doubling the width of an equal-area map and keeping the height doubles the area scale, and the halving of the longitudes undoes it.

### The formulas
Let $\\alpha$ be the angular distance of the point from the centre of the map, $\\cos\\alpha = \\cos\\varphi\\cos(\\lambda/2)$. Then, for Hammer,
$x = \\frac{2\\sqrt2\\,R\\cos\\varphi\\sin(\\lambda/2)}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}, \\qquad y = \\frac{\\sqrt2\\,R\\sin\\varphi}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}},$
and for Aitoff, with $k = \\alpha/\\sin\\alpha$, $x = 2R\\cos\\varphi\\sin(\\lambda/2)\\,k$, $y = R\\sin\\varphi\\,k$. The outline of Hammer's map is an ellipse with semi-axes $2\\sqrt2R$ and $\\sqrt2R$ (the same as Mollweide's), that of Aitoff's has $\\pi R$ and $\\pi R/2$. The equator and the central meridian are straight lines; the other parallels and meridians are curves; the poles are points. On Hammer's map the marks of the equator are at $4R\\sin(\\lambda/4)$ and those of the central meridian at $2R\\sin(\\varphi/2)$, **chords of circles** that a compass makes at once; on Aitoff's they are at $R\\lambda$ and $R\\varphi$, equally spaced.

### What they keep and lose
Hammer's map is equal-area, with no distortion at the centre, and the shapes are right near the centre and sheared toward the edge (an error of angle of 60° at 90° E, 60° N); Aitoff's has the smaller angular distortion of the two there (53°) but is not equal-area (the area scale is 1.3 at 90° E, 60° N). The poles are pinched into points. Neither is pseudocylindrical, since the parallels curve, but both belong to the same family of "modified azimuthal" world maps, and they are the parents of the [[winkel-tripel|Winkel tripel]], which averages Aitoff's with the equirectangular map.

### Drawing Hammer's map by hand
Draw the ellipse with two concentric circles ($\\sqrt2R$ and $2\\sqrt2R$), mark the equator and the central meridian with the chords of a circle of radius $2R$ (equator) and its halves (meridian), plot a few interior nodes from a table, and trace the curves.

> [!warn] In astronomy the "Hammer–Aitoff projection" (code AIT in the FITS standard) is Hammer's equal-area map, not Aitoff's: the name has outlived the distinction.`,
  ideas: [
    'Halve every longitude, draw the hemisphere in an azimuthal map, double every width: the disc becomes an ellipse 2 : 1.',
    'With the azimuthal equidistant map the result is Aitoff\'s; with Lambert\'s equal-area map it is Hammer\'s, which is equal-area.',
    'Hammer: x = 2√2 R cos φ sin(λ/2)/√(1 + cos φ cos(λ/2)), y = √2 R sin φ/√(…); on the equator x = 4R sin(λ/4), on the central meridian y = 2R sin(φ/2).',
    'The outline of Hammer\'s map is the ellipse 2√2R × √2R; the poles are points and the parallels, except the equator, are curved.'
  ],
  pitfalls: [
    'Hammer–Aitoff is one projection — They are two: Aitoff\'s (equidistant radial law, not equal-area) and Hammer\'s (chord, equal-area); the double name is a historical habit.',
    'Hammer\'s map is a pseudocylindrical map like Mollweide\'s — Mollweide\'s has straight parallels; Hammer\'s parallels, except the equator, are curved, and its meridians are not ellipses.',
    'Doubling the width of an equal-area map keeps it equal-area — On its own it doubles every area; Hammer\'s works because the longitudes were halved first.'
  ],
  formulas: [
    {
      name: 'Hammer: horizontal position',
      expr: 'x = 2*sqrt(2)*R*cos(phi)*sin(lam/2)/sqrt(1 + cos(phi)*cos(lam/2))',
      tex: 'x = \\frac{2\\sqrt2\\,R\\cos\\varphi\\sin(\\lambda/2)}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, signed: true, min: -89, max: 89, tex: '\\varphi' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 90, signed: true, min: -179, max: 179, tex: '\\lambda' } },
      solveFor: 'x',
      note: 'For 90° E, 45° N and R = 100 mm: x = 115.5 mm (and y = 81.65 mm). Aitoff puts the same point at (120.9, 85.5).'
    },
    {
      name: 'Hammer: height',
      expr: 'y = sqrt(2)*R*sin(phi)/sqrt(1 + cos(phi)*cos(lam/2))',
      tex: 'y = \\frac{\\sqrt2\\,R\\sin\\varphi}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, signed: true, min: -89, max: 89, tex: '\\varphi' }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 90, signed: true, min: -179, max: 179, tex: '\\lambda' } },
      solveFor: 'y',
      note: 'On the central meridian, where λ = 0, this reduces to 2R sin(φ/2); at the pole it is √2 R.'
    },
    {
      name: 'Equator marks of Hammer\'s map',
      expr: 'x = 4*R*sin(lam/4)',
      tex: 'x = 4R\\sin\\frac{\\lambda}{4}',
      vars: { x: { name: 'distance along the equator from the centre', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\lambda' } },
      solveFor: 'x',
      note: 'The chord of a circle of radius 2R for the angle λ/2. For R = 100 mm: 52.2, 103.5, 153.1, 200.0, 243.5 and 282.8 mm for the meridians every 30° from 30° to 180°.'
    }
  ],
  examples: [
    {
      title: 'Hammer against Aitoff',
      q: 'Place the point 90° E, 45° N on Hammer\'s and on Aitoff\'s map, R = 100 mm.',
      steps: [
        { text: 'The angular distance from the centre: $\\cos\\alpha = \\cos 45° \\cos 45° = 0.5$, so $\\alpha = 60°$.' },
        { text: 'Hammer, with $d = \\sqrt{1 + 0.5} = 1.2247$:', tex: 'x = \\frac{2\\sqrt2 \\times 100 \\times 0.7071 \\times 0.7071}{1.2247} = 115.5,\\qquad y = \\frac{\\sqrt2 \\times 100 \\times 0.7071}{1.2247} = 81.65\\ \\text{mm}.' },
        { text: 'Aitoff, with $k = \\alpha/\\sin\\alpha = 1.0472/0.8660 = 1.2092$:', tex: 'x = 2 \\times 100 \\times 0.7071 \\times 0.7071 \\times 1.2092 = 120.9,\\qquad y = 100 \\times 0.7071 \\times 1.2092 = 85.5\\ \\text{mm}.' },
        'The Aitoff point lies 5 per cent farther out, because the arc α is longer than the chord 2R sin(α/2).'
      ],
      a: 'Hammer: (115.5, 81.65) mm; Aitoff: (120.9, 85.5) mm.'
    }
  ],
  quiz: [
    { q: 'What is done to the azimuthal hemisphere map to make Hammer\'s world map?', choices: ['It is rotated by 90°', 'Its widths are doubled', 'Its heights are doubled', 'It is projected on a cone'], a: 1, why: 'The longitudes are halved so that the world fits in a hemisphere; the disc is then stretched to twice its width, making an ellipse 2 : 1.' },
    { q: 'How far from the centre along the equator is the meridian of 180° on Hammer\'s map with R = 100 mm?', answer: 282.8, unit: 'mm', why: '4R sin(180°/4) = 400 × 0.7071 = 282.8 mm = 2√2 R, the end of the ellipse\'s long axis.' },
    { q: 'Aitoff\'s map is equal-area.', a: false, why: 'The azimuthal equidistant map is not equal-area, and doubling the width makes no difference to that; Hammer\'s map, built on Lambert\'s equal-area map, is.' },
    { q: 'The "Hammer–Aitoff" projection of the astronomers is', choices: ['Aitoff\'s equidistant map', 'Hammer\'s equal-area map', 'the Mollweide map', 'the Winkel tripel'], a: 1, why: 'The FITS standard\'s AIT code and most sky-mapping software use Hammer\'s equal-area formulas under the double name.' },
    { q: 'On Hammer\'s map the central meridian is marked at heights y = 2R sin(φ/2). How high is the pole for R = 100 mm?', answer: 141.4, unit: 'mm', why: '2R sin 45° = 141.4 mm = √2 R, the semi-minor axis of the ellipse.' }
  ],
  applications: [
    'All-sky maps in astronomy: catalogues of galaxies, gamma-ray and infrared surveys and the maps of the Milky Way are drawn in Hammer\'s equal-area projection so that source densities can be compared by eye.',
    'World maps of the same properties as Mollweide\'s (equal-area, oval) when curved parallels are acceptable and the centre must be free of distortion.',
    'The parent of the Winkel tripel, the world map of the National Geographic Society.',
    'Teaching: how a hemisphere map is turned into a world map, and why the chord (2R sin(c/2)) is the equal-area radial law.'
  ],
  history: 'David A. Aitoff, a Russian cartographer and geographer, published his map in 1889, doubling the widths of the equidistant azimuthal map of the half-longitudes. Ernst Hammer, a German professor of geodesy, published the equal-area modification in 1892, using Lambert\'s azimuthal equal-area map in place of the equidistant one. The two are often fused as the Hammer–Aitoff projection.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on the Aitoff and Hammer projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'M. R. Calabretta and E. W. Greisen, "Representations of celestial coordinates in FITS", *Astronomy & Astrophysics* 395 (2002).'],
  sim: ['ps-aitoff-hammer'],
  construction: 'ps-aitoff-hammer'
},

{
  id: 'van-der-grinten',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Van der Grinten\'s circle',
  level: 2,
  short: 'The whole world in a circle in which the equator and the central meridian are straight and every meridian and parallel is an arc of a circle, so that the entire map can be drawn with compass and straightedge. A compromise (neither conformal nor equal-area) that swells the polar lands; the National Geographic Society\'s world map from 1922 to 1988.',
  keywords: ['Van der Grinten', 'circle', 'compass and straightedge', 'circular arcs', 'compromise', 'National Geographic', 'Greenland', 'Antarctica', 'meridian circle', 'parallel circle'],
  prereq: ['compromise-maps', 'why-the-sphere-cannot-be-flattened', 'math:circles'],
  related: ['robinson-projection', 'winkel-tripel', 'stereographic-projection', 'mercator-projection', 'gnomonic-projection'],
  body: `Alphons van der Grinten wanted the world in a **circle**, drawn with nothing but a compass and a straightedge. He took the outline circle of radius $U$ ($= \\pi R$), its horizontal diameter as the equator and its vertical diameter as the central meridian, and made every other line of the graticule an **arc of a circle**. That is the whole map, and the whole construction.

### The meridians
The equator is divided **equally**: the meridian of longitude $\\lambda$ meets it at $x = U\\lambda/\\pi$. The meridian is the circle through the two poles $N$ and $S$ and that point $E$; its centre is on the equator, extended, where the perpendicular bisector of $NE$ meets it. Its distance from the middle of the map and its radius are
$c = \\frac{U^2 - x^2}{2x}\\ (\\text{on the side away from } E), \\qquad r = \\frac{x^2 + U^2}{2x}.$
For $\\lambda = 90°$, $x = U/2$: $c = 0.75U$ and $r = 1.25U$. The nearer the meridian is to the central one, the farther away its centre: $2.9U$ for 30°.

### The parallels
Put $\\sin\\theta = 2\\varphi/\\pi$. The parallel of latitude $\\varphi$ is the circle through three points of the construction: the point $C$ on the central meridian at the height $U\\tan(\\theta/2)$, and the two points $D$ and $D'$ on the outline at the height
$y_D = U\\,\\frac{\\varphi}{\\pi - \\varphi}.$
To find $C$ by hand: divide the vertical radius into equal parts for equal latitudes (the height $U\\varphi/90°$), draw the horizontal through the division to the outline at $B$, and join the left end $A$ of the equator to $B$; the line cuts the central meridian at $C$. The centre of the parallel's circle is on the central meridian extended, 2.0 U above the equator for 75°, 3.6 U for 60°, 7.1 U for 45°, 17 U for 30°; the nearer to the equator, the nearer the arc to a straight line.

### What it keeps and loses
Nothing exactly: the map is neither conformal nor equal-area. The central meridian and the equator are true in scale only at the centre; the parallels are too long and are spaced too widely towards the poles, so that areas grow quickly: the area scale on the central meridian is 1.45 at 40°, 2.6 at 60° and 6.4 at 75°. Greenland and Antarctica swell; the shapes at middle latitudes are, however, good, with an error of angle of 6° at 60° on the central meridian and 15° at 120° E, 60° N. The pole is a point. The charm of the map is that it looks like a globe, a disc with curved lines, and that it can be drawn on a sheet of paper with a compass and a straightedge — apart from the flattest arcs, whose centres are off the paper and are drawn with a flexible curve through three points.

> [!note] On the equator the longitudes are equally spaced; on the central meridian the latitudes are not. The parallels cross it at the heights $U\\tan(\\theta/2)$, which in units of $U$ are 0.084, 0.172, 0.268, 0.382 and 0.537 for 15° to 75°.`,
  ideas: [
    'The map is a circle of radius U = πR; the equator and the central meridian are straight, every other meridian and parallel is an arc of a circle.',
    'Each meridian is the circle through N, S and the equally spaced equator mark; each parallel is the circle through C (on the central meridian) and the two outline points D, D′.',
    'Neither conformal nor equal-area: the area scale is 2.6 at 60° on the central meridian and 6.4 at 75°. The poles balloon.',
    'The centres of the parallels lie far out on the central meridian extended; the flattest arcs are drawn with a flexible curve.'
  ],
  pitfalls: [
    'The Van der Grinten map is a projection of the sphere onto a plane, like the stereographic map — It is a construction by circles; no geometric projection gives it, and it does not keep angles.',
    'The meridians of the Van der Grinten are straight apart from the central one — They are all circular arcs through the two poles.',
    'The parallels are concentric — Their centres lie at different heights on the central meridian extended, far from the map for the low latitudes.'
  ],
  formulas: [
    {
      name: 'Centre of a meridian circle',
      expr: 'cm = U*(1 - (lam/pi)^2)/(2*(lam/pi))',
      tex: 'c = U\\,\\frac{1 - (\\lambda/\\pi)^2}{2\\lambda/\\pi}',
      vars: { cm: { name: 'distance of the centre from the middle of the map, on the equator extended', q: 'length', unit: 'mm', tex: 'c' }, U: { name: 'radius of the outline circle', q: 'length', unit: 'mm', value: 150 }, lam: { name: 'longitude of the meridian', q: 'angle', unit: '°', value: 60, min: 10, max: 179, tex: '\\lambda' } },
      solveFor: 'cm',
      note: 'For U = 150 mm: the meridian of 90° has its centre 112.5 mm from the middle (0.75 U), that of 60° 200 mm (1.33 U), that of 30° 437.5 mm (2.92 U). The centre lies on the side away from the meridian.'
    },
    {
      name: 'Where a parallel crosses the central meridian',
      expr: 'yc = U*tan(asin(2*phi/pi)/2)',
      tex: 'y_C = U\\tan\\frac{\\theta}{2},\\quad \\sin\\theta = \\frac{2\\varphi}{\\pi}',
      vars: { yc: { name: 'height of the crossing above the equator', q: 'length', unit: 'mm', tex: 'y_C' }, U: { name: 'radius of the outline circle', q: 'length', unit: 'mm', value: 150 }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 60, min: 1, max: 89, tex: '\\varphi' } },
      solveFor: 'yc',
      note: 'For U = 150 mm: 15° at 12.6 mm, 30° at 25.7 mm, 45° at 40.2 mm, 60° at 57.3 mm, 75° at 80.5 mm (the pole at 150 mm).'
    },
    {
      name: 'Where a parallel meets the outline',
      expr: 'yd = U*phi/(pi - phi)',
      tex: 'y_D = U\\,\\frac{\\varphi}{\\pi - \\varphi}',
      vars: { yd: { name: 'height of the point on the outline', q: 'length', unit: 'mm', tex: 'y_D' }, U: { name: 'radius of the outline circle', q: 'length', unit: 'mm', value: 150 }, phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 60, min: 1, max: 89, tex: '\\varphi' } },
      solveFor: 'yd',
      note: 'For U = 150 mm: 13.6, 30.0, 50.0, 75.0 and 107.1 mm for 15°, 30°, 45°, 60° and 75°. The outline point is at x = √(U² − y²).'
    }
  ],
  examples: [
    {
      title: 'The parallel of 60°',
      q: 'On a Van der Grinten map with outline radius U = 150 mm, find the three points that fix the parallel of 60° and the centre and radius of its circle.',
      steps: [
        { text: 'The crossing of the central meridian: $\\sin\\theta = 2\\varphi/\\pi = 2/3$, $\\theta = 41.81°$,', tex: 'y_C = 150\\tan 20.9° = 57.3\\ \\text{mm}.' },
        { text: 'The ends on the outline:', tex: 'y_D = 150 \\times \\frac{\\pi/3}{2\\pi/3} = 75.0\\ \\text{mm},\\qquad x_D = \\sqrt{150^2 - 75^2} = \\pm 129.9\\ \\text{mm}.' },
        { text: 'The circle through $(0, 57.3)$ and $(\\pm 129.9, 75.0)$ has its centre on the central meridian at the height $m$ with $129.9^2 + (75 - m)^2 = (57.3 - m)^2$, i.e.', tex: 'm = \\frac{129.9^2 + 75^2 - 57.3^2}{2(75 - 57.3)} = 542.7\\ \\text{mm},\\qquad r = 542.7 - 57.3 = 485.4\\ \\text{mm}.' },
        'The centre is 3.6 U above the equator and the radius 3.2 U: far off a sheet that is 300 mm across, which is why the arc is drawn with a flexible curve through the three points.'
      ],
      a: 'C = (0, 57.3), D = (±129.9, 75.0); the circle has its centre at 542.7 mm above the equator and the radius 485.4 mm.'
    }
  ],
  quiz: [
    { q: 'How is the equator divided in the Van der Grinten construction?', choices: ['by the sines of the longitudes', 'into equal parts, one for each step of longitude', 'by the tangents of the longitudes', 'it is not divided'], a: 1, why: 'x = Uλ/π: equally. The meridians are then the circles through the poles and the division points.' },
    { q: 'What is the radius, in units of U, of the circle of the meridian of 90°?', answer: 1.25, why: 'x = U/2, so r = (x² + U²)/(2x) = (0.25 + 1)U/1 = 1.25 U, with the centre at 0.75 U from the middle of the map.' },
    { q: 'The Van der Grinten projection is conformal.', a: false, why: 'The circles are chosen for the look and for the ease of drawing, not to keep angles; the area scale grows from 1 at the equator to 2.6 at 60° on the central meridian.' },
    { q: 'Where are the centres of the circles of the parallels?', choices: ['all at the centre of the map', 'on the central meridian extended, higher for the lower latitudes', 'on the equator', 'at the poles'], a: 1, why: 'The centre is on the central meridian extended: 2.0 U above the equator for 75°, 3.6 U for 60°, up to 71 U for 15°.' },
    { q: 'For which period was the Van der Grinten map the National Geographic Society\'s standard world map?', choices: ['1850–1900', '1922–1988', '1988–1998', 'since 1998'], a: 1, why: 'The Society adopted it in 1922, replaced it with the Robinson projection in 1988 (and that with the Winkel tripel in 1998).' }
  ],
  applications: [
    'The National Geographic Society\'s world map from 1922 to 1988: wall maps and atlases which taught a generation what the world looked like.',
    'General-reference world maps where a circular, globe-like outline is wanted, in particular as a frame for the map with the sphere\'s pole at the edge.',
    'Teaching geometry: the only map of the world drawn completely with compass and straightedge, and a nice exercise in circles through three points.',
    'A reminder of what to avoid in thematic mapping: the area scale of 2.6 at 60° makes Greenland, Canada and Russia look too large.'
  ],
  history: 'Alphons J. van der Grinten (1852–1921), a Dutch-born Chicagoan, presented the projection in 1904 and patented it in the United States. The National Geographic Society adopted it in 1922; it served until the Robinson projection replaced it in 1988.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Van der Grinten projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'A. J. van der Grinten, "Darstellung der ganzen Erdoberfläche auf einer kreisförmigen Projektionsebene", *Petermanns Geographische Mitteilungen* 50 (1904).'],
  sim: ['ps-van-der-grinten'],
  construction: 'ps-van-der-grinten'
},

{
  id: 'equal-earth-and-natural-earth',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Equal Earth and Natural Earth',
  level: 2,
  short: 'Two polynomial world maps of the twenty-first century that look like the Robinson map: Natural Earth (2008), a compromise fitted by eye, and Equal Earth (2018), which keeps the same look but also keeps every area exactly. Both are flat-poled, built into the common mapping software, and easy to compute.',
  keywords: ['Equal Earth', 'Natural Earth', 'Šavrič', 'Patterson', 'Jenny', 'polynomial', 'equal-area', 'Robinson', 'Flex Projector', 'PROJ'],
  prereq: ['robinson-projection', 'pseudocylindrical-projections', 'equal-area-maps'],
  related: ['mollweide-projection', 'eckert-projections', 'winkel-tripel', 'kavrayskiy-and-wagner', 'choosing-a-projection'],
  body: `The Robinson map has the look that readers like and no formula. In 2008 the cartographer **Tom Patterson** drew a new compromise in the software *Flex Projector* to the same taste, with a smooth outline and rounded corners, and called it **Natural Earth**; its coefficients were published as a polynomial. Ten years later Bojan Šavrič, Tom Patterson and Bernhard Jenny asked for the same look **with exact areas**, and found it: **Equal Earth** (2018).

### Natural Earth
A pseudocylindrical map, no table needed, only two polynomials in the latitude $\\varphi$ (radians):
$x = R\\lambda\\left(0.8707 - 0.131979\\varphi^2 - 0.013791\\varphi^4 + 0.003971\\varphi^{10} - 0.001529\\varphi^{12}\\right),$
$y = R\\varphi\\left(1.007226 + 0.015085\\varphi^2 - 0.044475\\varphi^6 + 0.028874\\varphi^8 - 0.005916\\varphi^{10}\\right).$
The pole line is 0.55 of the equator; the map is 1.92 times as wide as high. It is not equal-area: the area scale is 0.88 at the centre, 1.05 at 40°, 1.31 at 60° and 1.92 at 75°, close to Robinson's.

### Equal Earth
Here the area condition $f\\,g' = R^2\\cos\\varphi$ of [[pseudocylindrical-projections]] is built in. First an auxiliary angle $\\sin\\theta = (\\sqrt3/2)\\sin\\varphi$ (so the pole has $\\theta = 60°$). Then the height of a parallel is a polynomial in $\\theta$,
$y = R\\theta\\left(A_1 + A_2\\theta^2 + \\theta^6(A_3 + A_4\\theta^2)\\right),$
with $A_1 = 1.340264$, $A_2 = -0.081106$, $A_3 = 0.000893$, $A_4 = 0.003796$, and the length of the parallels follows from equal area (see the derivation):
$x = \\frac{R\\lambda\\cos\\theta}{\\frac{\\sqrt3}{2}\\left(A_1 + 3A_2\\theta^2 + \\theta^6(7A_3 + 9A_4\\theta^2)\\right)} .$
The pole line is 0.59 of the equator and the map 2.05 times as wide as high.

### What they keep and lose
Equal Earth is equal-area everywhere and has no point of true scale in every direction; its angular distortion is a little larger than Natural Earth's in the middle latitudes (29.6° against 25.0° on the central meridian at 60°) because it has to keep the areas. Natural Earth keeps neither, and its polar lands are 30 to 90 per cent too large. Both outlines resemble a flat-sided barrel, and both are drawn by hand in the same way, from a short table of heights and half-lengths.

> [!fact] Both maps are available in PROJ, QGIS, the D3 library and many other tools, which made them easy to adopt: the formulas were published in full with the maps.`,
  ideas: [
    'Natural Earth (Patterson, 2008) is a compromise fitted by eye to the Robinson look, given by two polynomials in φ; it is not equal-area.',
    'Equal Earth (Šavrič, Patterson, Jenny, 2018) is equal-area: sin θ = (√3/2) sin φ, y = Rθ(A₁ + A₂θ² + θ⁶(A₃ + A₄θ²)), x by the area condition.',
    'The area condition leaves the height polynomial free: it controls the look, and the lengths of the parallels follow from it.',
    'Both have flat poles (0.55 and 0.59 of the equator), a rounded outline and a width : height of about 2.'
  ],
  pitfalls: [
    'Equal Earth is Robinson with the area corrected — It is a new map built from the equal-area condition; it looks like Robinson because the height polynomial was chosen to look like it.',
    'An equal-area map must look squashed — Equal Earth shows that, among the equal-area maps, the look can be made as natural as that of a compromise map; what is kept is the area, what is given up is a little shape.',
    'The coefficients are a fitted table — They were chosen to give a good look under the area condition (for Equal Earth) or by eye (for Natural Earth); other choices would give other maps.'
  ],
  derivation: {
    title: 'Why the half-length of the parallel follows from the height',
    intro: 'An equal-area pseudocylindrical map satisfies $f\\,g\' = R^2\\cos\\varphi$, where $x = f(\\varphi)\\lambda$ and $y = g(\\varphi)$. Equal Earth chooses $g$ as a polynomial in an auxiliary angle $\\theta$ and lets the condition give $f$.',
    steps: [
      { text: 'The auxiliary angle: $\\sin\\theta = M\\sin\\varphi$ with $M = \\sqrt3/2$. Differentiating:', tex: '\\cos\\theta\\,d\\theta = M\\cos\\varphi\\,d\\varphi \\;\\Rightarrow\\; \\frac{d\\theta}{d\\varphi} = \\frac{M\\cos\\varphi}{\\cos\\theta}.' },
      { text: 'The height is $y = R\\,P(\\theta)$ with the polynomial $P$, so', tex: 'g\'(\\varphi) = R\\,P\'(\\theta)\\,\\frac{d\\theta}{d\\varphi} = R\\,P\'(\\theta)\\,\\frac{M\\cos\\varphi}{\\cos\\theta}.' },
      { text: 'The area condition $f\\,g\' = R^2\\cos\\varphi$ then fixes the length of the parallels:', tex: 'f = \\frac{R^2\\cos\\varphi}{g\'} = \\frac{R\\cos\\theta}{M\\,P\'(\\theta)}.' },
      { text: 'With $P\'(\\theta) = A_1 + 3A_2\\theta^2 + \\theta^6(7A_3 + 9A_4\\theta^2)$ this is the formula for $x = f\\lambda$.' }
    ],
    outro: 'Any polynomial $P$ would give an equal-area map; the four coefficients were fitted so that the outline and the spacing of the parallels look like Robinson\'s.'
  },
  formulas: [
    {
      name: 'Equal Earth: the auxiliary angle',
      expr: 'theta = asin(sqrt(3)/2*sin(phi))',
      tex: '\\theta = \\arcsin\\left(\\tfrac{\\sqrt3}{2}\\sin\\varphi\\right)',
      vars: { theta: { name: 'auxiliary angle', q: 'angle', unit: '°', tex: '\\theta' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\varphi' } },
      solveFor: 'theta',
      note: 'The pole (φ = 90°) has θ = 60°; 45° gives 37.76°.'
    },
    {
      name: 'Equal Earth: height of a parallel',
      expr: 'y = R*theta*(A1 + A2*theta^2 + theta^6*(A3 + A4*theta^2))',
      tex: 'y = R\\theta\\left(A_1 + A_2\\theta^2 + \\theta^6(A_3 + A_4\\theta^2)\\right)',
      vars: { y: { name: 'height above the equator', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 37.76, min: 0, max: 60, tex: '\\theta' }, A1: { name: 'coefficient', value: 1.340264, fixed: true, tex: 'A_1' }, A2: { name: 'coefficient', value: -0.081106, fixed: true, signed: true, tex: 'A_2' }, A3: { name: 'coefficient', value: 0.000893, fixed: true, tex: 'A_3' }, A4: { name: 'coefficient', value: 0.003796, fixed: true, tex: 'A_4' } },
      solveFor: 'y',
      note: 'For 45° N and R = 100 mm: y = 86.0 mm; the pole is at 131.7 mm.'
    },
    {
      name: 'Equal Earth: position of a point',
      expr: 'x = R*lam*cos(theta)/(M*(A1 + 3*A2*theta^2 + theta^6*(7*A3 + 9*A4*theta^2)))',
      tex: 'x = \\frac{R\\lambda\\cos\\theta}{M\\left(A_1 + 3A_2\\theta^2 + \\theta^6(7A_3 + 9A_4\\theta^2)\\right)}',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 37.76, min: 0, max: 60, tex: '\\theta' }, M: { name: 'constant √3/2', value: 0.8660254, fixed: true }, A1: { name: 'coefficient', value: 1.340264, fixed: true, tex: 'A_1' }, A2: { name: 'coefficient', value: -0.081106, fixed: true, signed: true, tex: 'A_2' }, A3: { name: 'coefficient', value: 0.000893, fixed: true, tex: 'A_3' }, A4: { name: 'coefficient', value: 0.003796, fixed: true, tex: 'A_4' } },
      solveFor: 'x',
      note: 'For 60° E, 40° N (θ = 33.8°) and R = 100 mm: x = 80.0 mm. The equator has the half-length 270.7 mm, the pole line the half-length 160.4 mm.'
    }
  ],
  examples: [
    {
      title: 'One point on three maps',
      q: 'Place the point 60° E, 40° N with R = 100 mm on the Equal Earth, Natural Earth and Robinson maps.',
      steps: [
        { text: 'Equal Earth: $\\sin\\theta = 0.8660 \\times \\sin 40° = 0.5567$, $\\theta = 33.82°$; the polynomial gives', tex: 'y = 77.46\\ \\text{mm},\\qquad x = 79.96\\ \\text{mm}.' },
        { text: 'Natural Earth, with $\\varphi = 0.6981$ rad: the factors are $0.8707 - 0.131979\\varphi^2 - 0.013791\\varphi^4 + \\dots = 0.8031$ and $\\varphi(1.007226 + \\dots) = 0.7057$, so', tex: 'x = 84.1\\ \\text{mm},\\qquad y = 70.6\\ \\text{mm}.' },
        { text: 'Robinson, from the table ($X = 0.9216$, $Y = 0.4958$):', tex: 'x = 81.9\\ \\text{mm},\\qquad y = 67.05\\ \\text{mm}.' },
        'Natural Earth and Robinson are close (within 3 mm); Equal Earth puts the point higher and a little farther in, because its parallels are spaced differently to keep the areas.'
      ],
      a: 'Equal Earth (80.0, 77.5) mm, Natural Earth (84.1, 70.6) mm, Robinson (81.9, 67.1) mm.'
    }
  ],
  quiz: [
    { q: 'Which of the two maps is equal-area?', choices: ['Natural Earth', 'Equal Earth', 'both', 'neither'], a: 1, why: 'Equal Earth is built from the equal-area condition; Natural Earth is a compromise fitted by eye (its area scale is 1.31 at 60°).' },
    { q: 'What is the value of the auxiliary angle θ at the pole of Equal Earth, in degrees?', answer: 60, unit: '°', why: 'sin θ = (√3/2) sin 90° = 0.866, so θ = 60°.' },
    { q: 'The polynomial coefficients of Equal Earth determine only its shape, not whether it is equal-area.', a: true, why: 'Any polynomial for the height gives an equal-area map once the half-length of the parallel is taken from the area condition; the coefficients were fitted for the look.' },
    { q: 'How wide is Equal Earth compared with its height?', choices: ['1 : 1', 'about 2.05 : 1', '3 : 1', 'exactly 2 : 1'], a: 1, why: 'The equator half-length 2.707 R against the half-height 1.317 R gives 2.05 : 1; Natural Earth is 1.92 : 1.' },
    { q: 'What is the pole line of Equal Earth, compared with the equator?', answer: 0.59, why: '1.604 R / 2.707 R = 0.592.' }
  ],
  applications: [
    'Thematic world maps that must be equal-area and still look familiar: Equal Earth is offered in PROJ, QGIS and D3 and is used by many map makers who formerly chose Robinson.',
    'General small-scale base maps, such as the world maps of the Natural Earth data set, designed for pleasing look at small scales.',
    'Interactive web maps of the whole world, where the polynomials are cheap to compute and the outline is easy to clip.',
    'Teaching the freedom of design in an equal-area map: change the height polynomial and the same area condition gives another look.'
  ],
  history: 'Tom Patterson of the US National Park Service designed Natural Earth in 2008 with the Flex Projector software (Bernhard Jenny and Tom Patterson); Šavrič and colleagues published its polynomial form in 2011. Šavrič, Patterson and Jenny devised Equal Earth in 2018 (published in the *International Journal of Geographical Information Science* in 2019) to give an equal-area alternative to the Robinson projection.',
  sources: ['Bojan Šavrič, Tom Patterson and Bernhard Jenny, "The Equal Earth map projection", *International Journal of Geographical Information Science* 33 (2019).', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), for the history of compromise projections.', 'Bernhard Jenny, Tom Patterson and Bojan Šavrič, documentation of Flex Projector and the Natural Earth projection (2008–2011).'],
  sim: [{ id: 'ps-distortion-map', params: { map: 'equal-earth', compare: 'natural-earth' } }, { id: 'ps-parallel-lengths', params: { maps: ['robinson', 'equal-earth', 'natural-earth'], show: 'len' } }],
  construction: 'ps-equal-earth'
},

{
  id: 'kavrayskiy-and-wagner',
  parent: 'pseudocylindrical-and-compromise',
  title: 'Kavrayskiy VII and Wagner VI',
  level: 2,
  short: 'Two compromise world maps from one ellipse: the parallels are equally spaced and the meridians are half-ellipses. Wagner VI has the equator twice the central meridian; Kavrayskiy VII is the same drawing squeezed east–west by √3/2. Simple to compute and to draw, with low overall distortion; Kavrayskiy VII was widely used for world maps in Soviet atlases.',
  keywords: ['Kavrayskiy VII', 'Wagner VI', 'elliptical meridians', 'compromise', 'concentric circles', 'tan 30°', 'Soviet atlas', 'Karlheinz Wagner', 'equally spaced parallels'],
  prereq: ['pseudocylindrical-projections', 'compromise-maps', 'math:ellipse'],
  related: ['robinson-projection', 'eckert-projections', 'winkel-tripel', 'equal-earth-and-natural-earth', 'mollweide-projection'],
  body: `Two compromise maps, from the Soviet geodesist **Vladimir Kavrayskiy** (VII, 1939) and the German geographer **Karlheinz Wagner** (VI, 1932), share one construction, and one can be drawn from the other. In both the parallels are **equally spaced** like those of the sinusoidal map, $y = R\\varphi$, and the half-length of the parallel falls with latitude along an **ellipse**:
$\\text{Wagner VI: }\\ x = R\\lambda\\sqrt{1 - 3\\left(\\frac{\\varphi}{\\pi}\\right)^2}, \\qquad \\text{Kavrayskiy VII: }\\ x = \\frac{3}{2}R\\lambda\\sqrt{\\frac13 - \\left(\\frac{\\varphi}{\\pi}\\right)^2}, \\qquad y = R\\varphi .$
Since $\\tfrac32\\sqrt{1/3} = \\sqrt3/2$, the Kavrayskiy formula is the Wagner one multiplied by $\\sqrt3/2 = 0.866$: **Kavrayskiy VII is Wagner VI squeezed east–west by $\\sqrt3/2$.**

### The ellipse
For Wagner VI the end of the parallel at height $y = R\\varphi$ lies on the ellipse $x^2/a^2 + y^2/b^2 = 1$ with $a = \\pi R$ and $b = \\pi R/\\sqrt3 = 1.81R$, cut off at $y = \\pm\\pi R/2$ by the pole lines. All the meridians are the same ellipse squeezed horizontally in the ratio $\\lambda/\\pi$, half-ellipses with the common vertical semi-axis $b$. The proportions are: Wagner VI, equator 2π R, central meridian π R, ratio 2 : 1, pole line half the equator; Kavrayskiy VII, equator $\\sqrt3\\pi R$ and ratio $\\sqrt3 : 1 = 1.73 : 1$, pole line again half the equator.

### What they keep and lose
Neither is equal-area or conformal. Wagner VI has the correct scale along the equator and the central meridian, and a scale along the parallels that grows quickly (1.20 at 40°, 1.63 at 60°) with an area scale of 1.63 at 60°; Kavrayskiy VII has the equator at 0.87 of its true length, a scale along the parallels of 1.04 at 40°, and its area scale is 0.87 at the equator and 1.41 at 60°, where the angle error is 20° on the central meridian. The distortion of Kavrayskiy VII is lower than that of Wagner VI nearly everywhere (20° against 28° at 60° on the central meridian), which helps to explain why it is the more used.

### Drawing them by hand
The method of two concentric circles: with radius $a = \\pi R$ and the radius $b = a\\tan 30°$ (found with a 30° set square), mark the heights $R\\varphi$ up the central meridian, find each point on the inner circle at that height, extend the ray from the centre to the outer circle and drop the vertical: that is the end of the parallel. Divide each parallel equally and draw the meridians. For Kavrayskiy VII multiply the widths by 0.866.

> [!tip] The two constants a and b = a/√3 are all there is. The ratio 1/√3 is what makes the pole line exactly half the equator for Wagner VI: at φ = 90° the parallel has the half-length a cos θ with sin θ = √3/2, that is a/2.`,
  ideas: [
    'Both maps have equally spaced parallels (y = Rφ), flat poles half the equator, and half-ellipses as meridians.',
    'Wagner VI: x = Rλ√(1 − 3(φ/π)²), equator : central meridian = 2 : 1; Kavrayskiy VII: the same x multiplied by √3/2, ratio √3 : 1.',
    'The parallels\' ends lie on the ellipse of semi-axes πR and πR/√3; the concentric-circle method draws it with compass and a 30° set square.',
    'Neither is equal-area; Kavrayskiy VII has the lower overall distortion and was the standard Soviet world map.'
  ],
  pitfalls: [
    'Kavrayskiy VII and Wagner VI are unrelated maps with similar looks — They are the same drawing: the Kavrayskiy map is the Wagner map squeezed east–west by √3/2.',
    'Their outline is an ellipse — It is a piece of one: the ellipse is cut at y = ±πR/2 by the pole lines, so the pole is a line, not a point.',
    'Equally spaced parallels give true scale along the meridians — They do on the central meridian only; the other meridians are longer because they bend outwards.'
  ],
  formulas: [
    {
      name: 'Wagner VI: horizontal position',
      expr: 'x = R*lam*sqrt(1 - 3*(phi/pi)^2)',
      tex: 'x = R\\lambda\\sqrt{1 - 3\\left(\\frac{\\varphi}{\\pi}\\right)^2}',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\varphi' } },
      solveFor: 'x',
      note: 'For 60° E, 40° N and R = 100 mm: x = 96.65 mm, y = R φ = 69.81 mm.'
    },
    {
      name: 'Kavrayskiy VII: horizontal position',
      expr: 'x = 1.5*R*lam*sqrt(1/3 - (phi/pi)^2)',
      tex: 'x = \\frac32 R\\lambda\\sqrt{\\frac13 - \\left(\\frac{\\varphi}{\\pi}\\right)^2}',
      vars: { x: { name: 'distance from the central meridian', q: 'length', unit: 'mm' }, R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }, lam: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, min: 0, max: 90, tex: '\\varphi' } },
      solveFor: 'x',
      note: 'The same point: x = 83.70 mm, which is 0.866 × 96.65. The equator is 2 × 272 mm long for R = 100 mm.'
    },
    {
      name: 'The vertical semi-axis of the ellipse',
      expr: 'b = a*tan(30*pi/180)',
      tex: 'b = a\\tan 30°',
      vars: { b: { name: 'vertical semi-axis', q: 'length', unit: 'mm' }, a: { name: 'horizontal semi-axis, πR', q: 'length', unit: 'mm', value: 314.16 } },
      solveFor: 'b',
      note: 'With a = πR = 314.16 mm (R = 100 mm): b = 181.4 mm = a/√3, found with a 30° set square against a tangent at the end of the equator.'
    }
  ],
  examples: [
    {
      title: 'The same point on both maps',
      q: 'Place 60° E, 40° N with R = 100 mm on Wagner VI and on Kavrayskiy VII, and find the length of the pole line of each.',
      steps: [
        { text: 'The height is the same on both: $y = R\\varphi = 100 \\times 0.6981 = 69.81$ mm.' },
        { text: 'Wagner VI, with $(40/180)^2 = 0.04938$:', tex: 'x = 100 \\times 1.0472 \\times \\sqrt{1 - 3 \\times 0.04938} = 104.72 \\times 0.9230 = 96.65\\ \\text{mm}.' },
        { text: 'Kavrayskiy VII:', tex: 'x = 0.8660 \\times 96.65 = 83.70\\ \\text{mm}.' },
        { text: 'The pole lines: half the equator in both cases. Wagner: $2 \\times \\pi R/2 = 314.2$ mm; Kavrayskiy: $2 \\times 136.0 = 272.1$ mm.' }
      ],
      a: 'Both at y = 69.81 mm; Wagner VI x = 96.65 mm, Kavrayskiy VII x = 83.70 mm; pole lines 314.2 mm and 272.1 mm.'
    }
  ],
  quiz: [
    { q: 'By what factor must the Wagner VI map be squeezed east–west to give Kavrayskiy VII?', answer: 0.866, why: '√3/2 = 0.866: 1.5·√(1/3) = √3/2 times the Wagner width at every latitude.' },
    { q: 'What is the ratio of equator to central meridian on Wagner VI?', choices: ['1 : 1', '√3 : 1', '2 : 1', '3 : 1'], a: 2, why: 'The equator is 2πR and the central meridian πR. Kavrayskiy VII has √3 : 1.' },
    { q: 'The vertical semi-axis of the ellipse is found with a 30° set square as a·tan 30°.', a: true, why: 'b = a/√3 = a tan 30°: the height at which the 30° line from the centre meets the vertical tangent at the end of the equator.' },
    { q: 'Both maps have', choices: ['pointed poles', 'poles drawn as lines half the equator\'s length', 'straight meridians', 'unequally spaced parallels'], a: 1, why: 'At φ = 90° the width is a/2 (Wagner) or 0.866 a/2 (Kavrayskiy) on each side: half the equator.' },
    { q: 'Which map has the scale along the equator exactly 1?', choices: ['Wagner VI', 'Kavrayskiy VII', 'both', 'neither'], a: 0, why: 'Wagner\'s x = Rλ at φ = 0; Kavrayskiy\'s is 0.866 Rλ.' }
  ],
  applications: [
    'World maps in Soviet and Russian atlases: Kavrayskiy VII was widely used for the world map of atlases and wall maps, and remains a favourite of cartographers who want a simple low-distortion compromise.',
    'GIS packages offer Kavrayskiy VII and Wagner VI as standard world projections for thematic and reference maps.',
    'The easiest compromise maps to draw by hand: a circle, a 30° set square and a table of square roots.',
    'Teaching: the clearest case of two projections that look different but are one drawing differently squeezed.'
  ],
  history: 'Karlheinz Wagner described his series of pseudocylindrical projections, including the sixth, in 1932 (and more fully in his book *Kartographische Netzentwürfe*, 1949). Vladimir V. Kavrayskiy (1884–1954), a Soviet geodesist and cartographer, devised his seven pseudocylindrical projections in the 1930s; the seventh, published in 1939, was widely used for world maps in Soviet atlases.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on the Kavrayskiy VII and Wagner projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Karlheinz Wagner, *Kartographische Netzentwürfe* (1949).'],
  sim: [{ id: 'ps-distortion-map', params: { map: 'kavrayskiy7', compare: 'wagner6' } }, { id: 'ps-map-viewer', params: { map: 'wagner6' } }],
  construction: 'ps-wagner-ellipse'
}
);
