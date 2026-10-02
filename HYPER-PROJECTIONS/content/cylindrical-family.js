/* HYPER-PROJECTIONS · content/cylindrical-family.js — the cylindrical map projections.
 *
 *   cylindrical-projections           the family: equally spaced meridians, parallels placed by a rule y = R f(φ)
 *   equirectangular-projection        y = R φ: the plate carrée, the grid of latitude and longitude
 *   transverse-mercator-and-utm       the cylinder turned to touch a meridian: the survey grids
 *   web-mercator                      the Mercator square of the web's tiles
 *   lambert-cylindrical-equal-area    y = R sin φ, and its standard-parallel relatives from Behrmann to Gall–Peters
 *   miller-and-gall-stereographic     two compromise cylinders that bring the poles onto the sheet
 *   cassini-projection                the equirectangular turned on its side
 *   central-cylindrical-projection    the light at the centre of the globe, y = R tan φ
 * (mercator-projection is in content/reference.js.) Sphere of radius R; φ latitude, λ longitude, φ₁ a standard parallel.
 */
Hyper.add(
{
  id: 'cylindrical-projections',
  parent: 'cylindrical-family',
  title: 'Cylindrical projections',
  level: 1,
  short: 'A cylinder round the globe, cut and rolled flat: the meridians come out as equally spaced vertical lines, the parallels as horizontals, and the whole art is in how far apart the parallels are placed. That one rule decides whether the map keeps angles, areas, distances or nothing.',
  keywords: ['cylindrical', 'cylinder', 'standard parallel', 'secant cylinder', 'normal aspect', 'transverse', 'oblique', 'meridians equally spaced', 'plate carrée', 'Mercator', 'Lambert'],
  prereq: ['why-the-sphere-cannot-be-flattened', 'developable-surfaces', 'scale-factor-and-standard-parallels'],
  related: ['equirectangular-projection', 'mercator-projection', 'lambert-cylindrical-equal-area', 'miller-and-gall-stereographic', 'central-cylindrical-projection', 'transverse-mercator-and-utm', 'aspects-of-a-projection', 'tissot-indicatrix'],
  body: `Wrap a sheet of paper round the globe in a cylinder touching it along the equator, transfer the globe to the paper in some way, then unroll the cylinder. The result is a **cylindrical map**. The cylinder can be cut open along any meridian, and flattened without tearing, which is why it is one of the *developable* surfaces. Whatever the way of transferring the globe, three things are the same on all of these maps.

- The meridians are **equally spaced vertical straight lines**: a degree of longitude has the same width everywhere, $R\\,\\mathrm{d}\\lambda$.
- The parallels are **horizontal straight lines**, as long as the equator: the pole, a point on the globe, is a line on the map (or at infinity).
- Therefore the scale along a parallel is always $k = \\sec\\varphi$ for a cylinder that touches the equator: a parallel of the globe has the length $2\\pi R\\cos\\varphi$, and on the map $2\\pi R$.

### The rule that makes the map
The only freedom is the **height** $y = R\\,f(\\varphi)$ at which each parallel is drawn. The map is then
$$x = R\\,(\\lambda - \\lambda_0)\\cos\\varphi_1, \\qquad y = R\\,f(\\varphi)\\;(\\,/\\cos\\varphi_1\\text{ for the equal-area family}),$$
with $\\varphi_1 = 0$ for a cylinder that touches at the equator and $\\varphi_1 > 0$ for one that *cuts* the globe along the two **standard parallels** $\\pm\\varphi_1$, where the scale along the parallels is true: $k = \\cos\\varphi_1/\\cos\\varphi$. The scale along a meridian is $h = \\mathrm{d}y/(R\\,\\mathrm{d}\\varphi)$. Everything follows from $h$ and $k$:

| Rule $f(\\varphi)$ | Map | Keeps |
|---|---|---|
| $\\tan\\varphi$ | central cylindrical | a pure perspective; nothing else |
| $\\varphi$ | equirectangular | distances along meridians ($h=1$) |
| $\\ln\\tan(\\tfrac\\pi4+\\tfrac\\varphi2)$ | Mercator | angles ($h=k$) |
| $\\sin\\varphi$ | Lambert and Gall–Peters | areas ($hk=1$) |
| $1.25\\ln\\tan(\\tfrac\\pi4+0.4\\varphi)$, $(1+\\tfrac{\\sqrt2}{2})\\tan\\tfrac\\varphi2$ | Miller, Gall stereographic | compromises |

Conformality needs $h = k$, i.e. $f' = \\sec\\varphi$ (Mercator); equal area needs $hk = 1$, i.e. $f' = \\cos\\varphi$ (Lambert). **Tissot's indicatrix** on every one of these maps is an ellipse with its axes along the meridian and the parallel, not tilted; it is a circle only on the Mercator map and on the others at the standard parallels.

### Aspects
Turn the cylinder so that it touches a meridian instead of the equator and you have the *transverse* aspect: the [[transverse-mercator-and-utm|transverse Mercator]] and the [[cassini-projection|Cassini]] map. In an *oblique* aspect it touches along a tilted great circle. The formulas are the same with the graticule rotated first.

### Drawing it
The side view of the globe, with the cylinder as a vertical line touching the circle, gives the height of any parallel by a ray, a horizontal or a table. The construction shows four of the rules on one latitude.`,
  ideas: [
    'The meridians are equally spaced vertical lines and the parallels horizontal lines: only the heights y = R f(φ) at which the parallels are drawn differ from one cylindrical map to another.',
    'The scale along a parallel is sec φ (for a cylinder touching the equator), or cos φ₁ / cos φ for one cutting at ±φ₁, whichever rule is used; the scale along a meridian is h = f′(φ).',
    'Conformal needs f′ = sec φ (Mercator), equal-area needs f′ = cos φ (Lambert); an equal spacing f′ = 1 gives the equirectangular map.',
    'The same cylinder, turned to touch a meridian, gives the transverse aspects: transverse Mercator and Cassini.'
  ],
  pitfalls: [
    'A cylindrical map is a projection onto a cylinder along rays — Only two of them are: the central (light at the centre) and Gall’s stereographic (light on the equator). The Mercator map has no rays; Lambert’s uses parallel rays; the equirectangular map merely unrolls the arc.',
    'All the cylindrical maps stretch the poles equally — The east–west stretch is the same (sec φ for a tangent cylinder); the north–south stretch differs wildly, from 1 on the equirectangular to infinity on the central cylinder.',
    'A cylindrical map can be made true everywhere along every parallel — Only along the equator, or along the standard parallels ±φ₁ of a secant cylinder. A parallel at 60° is half as long on the globe as the equator, yet it is drawn as long as the equator on a tangent cylinder.'
  ],
  formulas: [
    {
      name: 'Scale along the parallels',
      expr: 'k = cos(phi1)/cos(phi)',
      tex: 'k = \\frac{\\cos\\varphi_1}{\\cos\\varphi}',
      vars: {
        k: { name: 'scale along the parallel of latitude φ' },
        phi1: { name: 'standard parallel (0 for a cylinder touching at the equator)', q: 'angle', unit: '°', value: 0, min: 0, max: 80, tex: '\\varphi_1' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'k',
      note: 'For φ₁ = 0 this is sec φ: 2 at 60°, 5.76 at 80°. With a standard parallel of 30° the scale at 60° is 1.73, and the scale is exactly 1 at 30°.'
    },
    {
      name: 'Height of a parallel: the central cylinder',
      expr: 'y = R*tan(phi)',
      tex: 'y = R\\tan\\varphi',
      vars: {
        y: { name: 'height of the parallel above the equator', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'The ray from the centre of the globe through the point of latitude φ meets the cylinder at the height R tan φ: 119.2 mm at 50° (R = 100).'
    },
    {
      name: 'Height of a parallel: Archimedes’ rule',
      expr: 'y = R*sin(phi)',
      tex: 'y = R\\sin\\varphi',
      vars: {
        y: { name: 'height of the parallel above the equator', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 50, min: 0, max: 90, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'The horizontal ray from the point of latitude φ meets the cylinder at the height R sin φ: 76.6 mm at 50° (R = 100). The poles are at ±R.'
    }
  ],
  examples: [
    {
      title: 'One latitude, four heights',
      q: 'On a cylindrical map with a globe of radius R = 100 mm, how high above the equator is the parallel of 50° in the central, Mercator, equirectangular and Lambert maps?',
      steps: [
        { text: 'Central (light at the centre):', tex: 'y = R\\tan 50° = 119.2\\ \\text{mm}' },
        { text: 'Mercator (conformal):', tex: 'y = R\\ln\\tan(45° + 25°) = 101.1\\ \\text{mm}' },
        { text: 'Equirectangular (the arc laid out):', tex: 'y = R\\varphi = 100\\times 0.8727 = 87.3\\ \\text{mm}' },
        { text: 'Lambert (horizontal rays):', tex: 'y = R\\sin 50° = 76.6\\ \\text{mm}' }
      ],
      a: '119.2, 101.1, 87.3 and 76.6 mm. In all four the meridians are the same, but the north–south stretch differs from 0.77 (Lambert) to 1.19 (central) of the arc.'
    },
    {
      title: 'A secant cylinder',
      q: 'A cylinder cuts the globe along the standard parallels ±30°. What is the scale along the parallels of 30°, 60° and the equator, and how long is the map’s equator compared with the globe’s?',
      steps: [
        { text: 'With $k = \\cos 30°/\\cos\\varphi$:', tex: 'k_{30} = 1,\\quad k_{60} = 1.732,\\quad k_0 = 0.866.' },
        'The map’s equator is drawn at $\\cos 30° = 0.866$ of the globe’s length: the cylinder has a radius of $R\\cos 30°$.',
        'The scale is 1 on the standard parallels, below 1 between them, above 1 beyond; the error is shared.'
      ],
      a: 'k = 1 at ±30°, 0.866 on the equator, 1.732 at 60°.'
    }
  ],
  quiz: [
    { q: 'What do all cylindrical maps with the cylinder touching the equator have in common?', choices: ['the same height for the parallel of 60°', 'meridians equally spaced and parallels straight and horizontal', 'every angle true', 'the same area for every country'], a: 1, why: 'The meridians are the elements of the cylinder, so they are equally spaced; the parallels are its circles, so horizontal. The height of each parallel is the free choice.' },
    { q: 'On a cylinder touching the equator, the scale along the parallel of 60° is', answer: 2, why: 'sec 60° = 2: the parallel is half as long on the globe as the equator, and drawn as long.' },
    { q: 'Mercator’s map is a projection from the centre of the globe onto a cylinder.', a: false, why: 'The central cylindrical projection is. Mercator’s map spaces the parallels by the integral of sec φ, chosen to make angles true; it has no geometric construction.' },
    { q: 'To make a cylindrical map equal-area, the height y of the parallel of latitude φ must satisfy dy/dφ proportional to', choices: ['sec φ', 'cos φ', '1', 'sec² φ'], a: 1, why: 'The scale along the parallels is sec φ, so the meridian scale must be cos φ for the product to be 1. Integrating gives y = R sin φ, Lambert’s map.' },
    { q: 'A secant cylinder that cuts the globe at ±45° has scale 1 along', choices: ['the equator', 'the parallels of 45°', 'the meridians', 'every parallel'], a: 1, why: 'On the standard parallels the cylinder’s circle has the length of the globe’s parallel, so there k = 1.' }
  ],
  applications: [
    'Wall maps and school atlases: a rectangle with the north up and the meridians vertical is easy to print, to read coordinates on and to use as a grid.',
    'GIS and data: gridded global data (climate models, satellite products, population grids) are stored in latitude and longitude and drawn as an equirectangular sheet; equal-area cylindrical grids are used to bin global quantities fairly.',
    'Marine charts and the web: Mercator’s cylinder is the chart of navigation and, as Web Mercator, of every map on a phone.',
    'Survey grids: the transverse Mercator, the same cylinder turned on its side, is the basis of the UTM and national grids.',
    'Panoramas and sky charts: the 360° photograph and the chart of the whole sky on a rectangle are cylindrical maps of the sphere of directions.'
  ],
  history: 'The oldest cylindrical map is the one that Marinus of Tyre drew about AD 100, with the parallels and meridians as straight lines at right angles, and that Ptolemy criticised for the stretching of the east–west distances at high latitudes. Mercator turned the cylinder to navigators’ use in 1569; Lambert in 1772 classified the cylindrical maps by what they keep, and gave the equal-area one and the transverse Mercator. James Gall (1855) introduced the stereographic and the equal-area cylinder with standard parallels at 45°, Walter Behrmann the 30° one (1910), Osborn Miller the compromise (1942), and Arno Peters made the 45° version a public controversy in the 1970s.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on cylindrical projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'J. H. Lambert, *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772), translated by W. R. Tobler (1972).'],
  sim: 'cy-cylinder-lab',
  construction: 'cy-cylinder-side-view'
},

{
  id: 'equirectangular-projection',
  parent: 'cylindrical-family',
  title: 'The equirectangular (plate carrée) projection',
  level: 1,
  short: 'Longitude as x and latitude as y, to the same scale: a rectangle twice as wide as it is high, with the degrees of arc laid out at equal intervals. The simplest map there is, the grid of every spreadsheet of coordinates and of every 360° photograph, and a poor map for shapes and areas.',
  keywords: ['equirectangular', 'plate carrée', 'equidistant cylindrical', 'geographic projection', 'EPSG:4326', 'Marinus of Tyre', '360 degree photo', 'lat-long grid', 'standard parallel'],
  prereq: ['cylindrical-projections', 'equidistant-maps', 'scale-factor-and-standard-parallels'],
  related: ['mercator-projection', 'cassini-projection', 'equirectangular-images', 'lambert-cylindrical-equal-area', 'panoramas-and-360', 'gps-and-web-maps'],
  body: `Use the longitude and the latitude of a place as its horizontal and vertical position on the sheet, with the same scale for both. That is the **equirectangular projection** (*equi*, equal; *rectangular*, laid out on a rectangle), the French *plate carrée*, the “flat square”. It needs no calculation at all:
$$x = R\\,(\\lambda - \\lambda_0)\\cos\\varphi_1, \\qquad y = R\\,\\varphi,$$
with $\\varphi_1 = 0$ for the plate carrée proper. The whole world, 360° by 180°, is a rectangle $2\\pi R$ wide and $\\pi R$ high, exactly 2 : 1.

### What it keeps and loses
The map is **equidistant along the meridians**: the scale in the north–south direction is $h = 1$ everywhere, so latitude differences are true distances (111 km a degree). The scale along a parallel is $k = \\cos\\varphi_1/\\cos\\varphi$, which for the plate carrée is $\\sec\\varphi$: 2 at 60°, 5.8 at 80°. The map is neither conformal nor equal-area: areas are stretched by $\\cos\\varphi_1/\\cos\\varphi$, so Greenland is stretched to several times its true area, and the poles, single points, are two long lines. Tissot's indicatrices are ellipses with the same height everywhere and a width growing as $\\sec\\varphi$: they are circles only on the standard parallels. At the standard parallel $\\varphi_1$ the shapes are right.

### The standard parallel
With $\\varphi_1 > 0$ the cylinder cuts the globe and the meridians are drawn closer by $\\cos\\varphi_1$, so that at $\\pm\\varphi_1$ the east–west scale is true. **Marinus of Tyre** used $\\varphi_1 = 36°$, the latitude of Rhodes, the middle of the Greek world, so that the map was right in the Mediterranean. The sheet is then $2\\pi R\\cos\\varphi_1$ wide, and the map is not square: at $36°$ the world is 1.62 : 1.

### A map and a coordinate system
Because $x$ and $y$ are the angles themselves, the equirectangular grid *is* the coordinate system of latitude and longitude: geographic data in the common WGS 84 system (EPSG:4326) are drawn on it when no projection is specified. Climate models run on a regular latitude–longitude grid, satellite products come as arrays with one row per latitude, and a 360° photograph is stored as an equirectangular image whose pixel columns are azimuth and rows elevation.

### Drawing it
Set the dividers to the arc of 30° on a globe of radius $R$ and step it off along a horizontal line, then up and down a vertical: with the T-square and set square the whole graticule is two sets of parallel lines. The construction does it and also shows the effect of a standard parallel.

> [!tip] Two arcs are equal on the map when they are equal in angle: a degree of latitude is a square of side $R\\pi/180$, and so is a degree of longitude at the equator. The grid is a sheet of graph paper laid on the Earth.`,
  ideas: [
    'x = R λ and y = R φ: longitude and latitude used directly as coordinates, to the same scale; the world is a rectangle 2 : 1.',
    'The scale along the meridians is exactly 1 (equidistant), along a parallel it is sec φ (cos φ₁ / cos φ with a standard parallel): areas and shapes are stretched towards the poles.',
    'A standard parallel φ₁ pulls the meridians together by cos φ₁ and makes the shape right at ±φ₁; Marinus of Tyre used 36°.',
    'The grid is the coordinate system of latitude and longitude, so it is the natural sheet for global data, climate models and 360° pictures.'
  ],
  pitfalls: [
    'The equirectangular map is equal-area because every degree is a square — A degree square is a square only at the equator. At 60° a degree of longitude is half as wide on the globe as at the equator and drawn the same width, so areas are doubled.',
    'The map shows distances correctly — Only along meridians (and along the standard parallels). A degree of longitude at 60° is drawn twice too long.',
    'It is the same as the Mercator map — Both have straight meridians and parallels, but Mercator spaces the parallels farther apart as they go up to keep angles right; the equirectangular spaces them equally and does not.'
  ],
  formulas: [
    {
      name: 'Abscissa on the sheet',
      expr: 'x = R*dl*cos(phi1)',
      tex: 'x = R\\,\\Delta\\lambda\\,\\cos\\varphi_1',
      vars: {
        x: { name: 'horizontal position from the central meridian', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 60 },
        dl: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 35.2, signed: true, min: -180, max: 180, tex: '\\Delta\\lambda' },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 0, min: 0, max: 80, tex: '\\varphi_1' }
      },
      solveFor: 'x',
      note: 'The plate carrée has φ₁ = 0: Jerusalem (35.2° E) is 36.9 mm east of the central meridian when R = 60 mm. With φ₁ = 36° it is 29.8 mm.'
    },
    {
      name: 'Ordinate on the sheet',
      expr: 'y = R*phi',
      tex: 'y = R\\,\\varphi',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 60 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 31.8, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'One degree of latitude is R π/180 = 1.047 mm for R = 60 mm, whatever the latitude and the standard parallel.'
    },
    {
      name: 'Area scale',
      expr: 'A = cos(phi1)/cos(phi)',
      tex: 'A = \\frac{\\cos\\varphi_1}{\\cos\\varphi}',
      vars: {
        A: { name: 'area scale (map area ÷ true area)' },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 0, min: 0, max: 80, tex: '\\varphi_1' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'A',
      note: 'The meridian scale is 1, so the area scale equals the parallel scale: 2 at 60° for the plate carrée, 1.62 with a standard parallel of 36°.'
    }
  ],
  examples: [
    {
      title: 'Plotting Jerusalem',
      q: 'Jerusalem is at 31.8° N, 35.2° E. On an equirectangular map with a globe of radius R = 60 mm, where is it, relative to the equator and the Greenwich meridian, for the plate carrée and for Marinus’ standard parallel of 36°?',
      steps: [
        { text: 'Plate carrée: the angles in radians times $R$:', tex: 'x = 60\\times 0.6144 = 36.9\\ \\text{mm},\\qquad y = 60\\times 0.5550 = 33.3\\ \\text{mm}' },
        { text: 'With $\\varphi_1 = 36°$ the meridians are drawn closer by $\\cos 36° = 0.809$:', tex: 'x = 36.9\\times 0.809 = 29.8\\ \\text{mm},\\qquad y = 33.3\\ \\text{mm}' }
      ],
      a: 'Plate carrée: (36.9, 33.3) mm. Marinus’ map: (29.8, 33.3) mm: only the horizontal changes.'
    },
    {
      title: 'How large is Greenland on this map?',
      q: 'On a plate carrée map, by what factor are areas multiplied at 70° N, and at what latitude is the area twice the true one?',
      steps: [
        { text: 'The area scale is $\\sec\\varphi$:', tex: 'A(70°) = 1/\\cos 70° = 2.92.' },
        { text: 'Twice the true area when $\\sec\\varphi = 2$:', tex: '\\cos\\varphi = 0.5,\\quad \\varphi = 60°.' }
      ],
      a: '2.9 at 70° N (most of Greenland), and 2 at 60° N.'
    }
  ],
  quiz: [
    { q: 'On the plate carrée map the scale along the meridians is', choices: ['sec φ', 'cos φ', '1', 'sec² φ'], a: 2, why: 'y = R φ, so dy = R dφ: a degree of latitude is the same length everywhere.' },
    { q: 'The world on the plate carrée (360° by 180°, same scale) has the shape', choices: ['a square', 'a rectangle 2 : 1', 'a rectangle π : 1', 'an ellipse'], a: 1, why: 'The width is 2πR for 360°, the height πR for 180°.' },
    { q: 'Marinus of Tyre’s standard parallel was 36°. What fraction of the plate carrée’s width is his sheet?', answer: 0.809, why: 'The meridians are drawn closer by cos 36° = 0.809.' },
    { q: 'The equirectangular map keeps angles true.', a: false, why: 'It keeps neither angles nor areas: at 60° a degree of longitude is drawn twice as wide as it should be, but a degree of latitude is right, so shapes are stretched east–west.' },
    { q: 'Why does an equirectangular 360° photograph look so stretched near its top and bottom edges?', choices: ['because the camera is poor there', 'because the top row of pixels is the whole circle of directions straight up, and the sheet shows it as long as the equator', 'because it is a conformal map', 'because the poles are at infinity'], a: 1, why: 'The top edge of the picture is a single direction, the zenith, stretched into a line as long as the horizon.' }
  ],
  applications: [
    'Global gridded data: climate and weather models, ocean temperature, elevation grids and satellite products are arrays with one row per latitude and one column per longitude — drawn as they are, they make an equirectangular map.',
    '360° photographs and video: the standard file of a spherical panorama is an equirectangular image, in which a pixel column is an azimuth and a row an elevation; viewers turn it into the view you see.',
    'Texture maps in 3-D graphics: the picture wrapped on a globe or planet in a game or planetarium program is usually an equirectangular image.',
    'Plotting positions in data analysis: a quick scatter of longitude against latitude is the plate carrée, and gives a recognisable map at low and middle latitudes.',
    'Sky charts: right ascension and declination plotted as x and y make the same sheet for the heavens.'
  ],
  history: 'The equirectangular map is the oldest map projection known by name: Marinus of Tyre, about AD 100, drew the known world on a rectangle with a standard parallel of 36° for the width of a degree of longitude, and Ptolemy, who criticised his map for the distortion of the north, reformed it. The plate carrée, with equal degrees, was used by sailors and in simple atlases through the Middle Ages and the Renaissance for its simplicity, and today it is the default picture of the lat–long coordinate system.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the equirectangular projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993), on Marinus and Ptolemy.', 'Ptolemy, *Geography*, book I, on Marinus of Tyre’s map.'],
  sim: { id: 'cy-compare', params: { proj: 'equirectangular' } },
  construction: 'cy-equirectangular-grid'
},

{
  id: 'transverse-mercator-and-utm',
  parent: 'cylindrical-family',
  title: 'Transverse Mercator and UTM',
  level: 3,
  short: 'Mercator’s cylinder turned on its side to touch a meridian: the map is conformal, true along the central meridian and good for a strip some degrees wide. Sixty such strips, the UTM zones, make the survey grid of the world; national grids use the same projection.',
  keywords: ['transverse Mercator', 'UTM', 'Gauss–Krüger', 'grid convergence', 'scale factor 0.9996', 'central meridian', 'zone', 'easting', 'northing', 'conformal', 'national grid'],
  prereq: ['mercator-projection', 'aspects-of-a-projection', 'scale-factor-and-standard-parallels'],
  related: ['cassini-projection', 'web-mercator', 'surveys-and-national-grids', 'conformal-maps', 'lambert-conformal-conic', 'stereographic-projection'],
  body: `Mercator's map is conformal and accurate along the equator, the line where its cylinder touches the globe. Turn the cylinder a quarter turn so that it touches along a **meridian**, the central meridian, and apply the same recipe, and you have the **transverse Mercator** projection. It keeps the conformal property, and is accurate along the central meridian instead of the equator: a north–south strip of country, which is what most countries are, is mapped with almost no distortion.

### The formula
On a sphere of radius $R$, with $\\Delta\\lambda = \\lambda - \\lambda_0$ the longitude from the central meridian and $B = \\cos\\varphi\\sin\\Delta\\lambda$,
$$x = R\\,\\mathrm{artanh}\\,B = \\frac{R}{2}\\ln\\frac{1+B}{1-B}, \\qquad y = R\\,\\mathrm{atan2}\\!\\left(\\tan\\varphi,\\ \\cos\\Delta\\lambda\\right).$$
The central meridian is a straight line of true scale ($x=0$, $y = R\\varphi$); the other meridians curve towards it as they go north and all meet at the pole at $y = \\pi R/2$; the parallels are curves bowed towards the nearest pole. The scale is the same in all directions,
$$k = \\frac{1}{\\sqrt{1 - B^2}} \\approx 1 + \\frac{x^2}{2R^2},$$
growing with the distance from the central meridian ($k=2$ at $\\Delta\\lambda=60°$ on the equator). Tissot's indicatrix is therefore a circle everywhere, $k$ times the true size: within a UTM zone it never differs from the true circle by more than 0.1 %. On the ellipsoid there is no closed form, and the Gauss–Krüger series give coordinates to a millimetre over a wide strip.

### The UTM grid
The Universal Transverse Mercator splits the world between 80° S and 84° N into **60 zones, each 6° wide**, numbered eastward from 180°; zone $n$ has its central meridian at $6n - 183°$. To share out the error, the scale on the central meridian is reduced to $k_0 = 0.9996$: the scale is then exactly 1 on two lines about 180 km each side of the central meridian, and reaches 1.0010 at the zone edge on the equator, so it never differs from the truth by more than 1 part in 1000. The **easting** counts metres from a line 500 km west of the central meridian (so it is never negative), the **northing** metres from the equator (10 000 km added in the south). **Bands** of 8° lettered C to X (the last, X, is 12° high) complete the address: Jerusalem is in 36R. The poles are mapped by the Universal Polar Stereographic.

### Grid convergence
The meridians of a zone lean towards the central one as they go away from the equator, so the grid lines (east–west and north–south on the map) do not match true north and true east. The angle between true north and grid north is the **convergence** $\\gamma = \\arctan(\\tan\\Delta\\lambda\\,\\sin\\varphi)$, 1.7° at 2° from the central meridian and 60° N. Maps and compasses show it in the margin.

### Drawing it
By hand the map is made from a table: for a set of meridians and parallels compute $x$ and $y$, plot the points with the scale and join them with a French curve. The other picture is the layout of the zones and bands, which are a simple grid of 6° by 8° on a flat sheet. Both constructions are given.

> [!fact] The transverse Mercator is the projection of most national survey grids: the British National Grid (central meridian 2° W, $k_0 = 0.9996012717$), the Israeli ITM (central meridian 35.2045° E, $k_0 = 1.0000067$), the German Gauss–Krüger zones of 3°, and the state plane systems of the tall US states.`,
  ideas: [
    'Turn the Mercator cylinder to touch a meridian: the map is conformal, true along the central meridian, and increasingly stretched (k ≈ 1 + x²/2R²) towards the sides.',
    'UTM: 60 zones of 6° (central meridian 6n − 183°), scale 0.9996 on the central meridian, 1.0000 about 180 km out, 1.0010 at the zone edge on the equator; letters C–X mark 8° bands.',
    'The meridians lean towards the central meridian by the convergence γ = arctan(tan Δλ sin φ), the angle between true north and grid north.',
    'The same map, with its own central meridian and scale factor, is the national grid of Britain, Israel, Germany and many other countries.'
  ],
  pitfalls: [
    'UTM zones are the same as time zones — Time zones are about 15° wide; UTM zones 6°. They share only the habit of numbering eastward from 180°.',
    'Grid north is true north — They agree only on the central meridian. Away from it, grid north is off by the convergence, 1.7° at 2° from the central meridian at 60° N.',
    'The scale factor 0.9996 means the map shrinks everything by 0.04 % — It does so only on the central meridian: at about 180 km each side the scale is exactly 1, and beyond that it exceeds 1. The reduction merely spreads the error.'
  ],
  formulas: [
    {
      name: 'Point scale factor on the sphere',
      expr: 'k = k0/sqrt(1 - (cos(phi)*sin(dl))^2)',
      tex: 'k = \\frac{k_0}{\\sqrt{1 - \\cos^2\\varphi\\,\\sin^2\\Delta\\lambda}}',
      vars: {
        k: { name: 'scale factor' },
        k0: { name: 'scale on the central meridian (0.9996 for UTM)', value: 0.9996, min: 0.99, max: 1.01, tex: 'k_0' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, signed: true, min: -85, max: 85, tex: '\\varphi' },
        dl: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 1.8, signed: true, min: -10, max: 10, tex: '\\Delta\\lambda' }
      },
      solveFor: 'k',
      note: 'Conformal: the same in every direction. At the zone edge (3°) on the equator k = 1.00097; on the central meridian k = k₀.'
    },
    {
      name: 'Grid convergence',
      expr: 'g = atan(tan(dl)*sin(phi))',
      tex: '\\gamma = \\arctan\\left(\\tan\\Delta\\lambda\\,\\sin\\varphi\\right)',
      vars: {
        g: { name: 'angle between true north and grid north', q: 'angle', unit: '°', signed: true, tex: '\\gamma' },
        dl: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 2, signed: true, min: -10, max: 10, tex: '\\Delta\\lambda' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -85, max: 85, tex: '\\varphi' }
      },
      solveFor: 'g',
      note: 'Positive east of the central meridian in the northern hemisphere, where grid north lies east of true north by γ (the meridian leans towards the central meridian as it rises). Zero on the equator and on the central meridian.'
    },
    {
      name: 'Central meridian of a UTM zone',
      expr: 'cm = 6*n - 183',
      tex: '\\lambda_0 = 6n - 183',
      vars: {
        cm: { name: 'central meridian (east positive)', q: 'angle', unit: '°', signed: true, tex: '\\lambda_0' },
        n: { name: 'zone number', value: 36, int: true, min: 1, max: 60 }
      },
      solveFor: 'cm',
      note: 'Zone 1 has its central meridian at −177°; zone 36, which holds Jerusalem and Tel Aviv, at 33° E. The zone number of a longitude λ is the integer part of (λ + 180°)/6° plus 1.'
    }
  ],
  examples: [
    {
      title: 'Tel Aviv in the UTM grid',
      q: 'Tel Aviv lies at 32.07° N, 34.78° E. In which UTM zone and band is it, how far from the central meridian, and what are the scale factor and the grid convergence there?',
      steps: [
        'Zone: $(34.78 + 180)/6 = 35.8$, so zone 36, with central meridian $6\\times 36 - 183 = 33°$ E. Band: 32.07° is above 32°, so band S (36S; Jerusalem, at 31.8°, is 36R).',
        { text: 'The offset is $\\Delta\\lambda = 1.78°$, $B = \\cos 32.07°\\sin 1.78° = 0.0263$, and the distance from the central meridian is', tex: 'x = R\\,\\mathrm{artanh}\\,B = 167.7\\ \\text{km}' },
        { text: 'Scale and convergence:', tex: 'k = \\frac{0.9996}{\\sqrt{1 - 0.0263^2}} = 0.99995,\\qquad \\gamma = \\arctan(\\tan 1.78°\\sin 32.07°) = 0.945°' }
      ],
      a: 'Zone 36S, 168 km east of the central meridian (33° E): k = 0.99995 (almost exactly 1, since this is near the 180 km line), grid north 0.95° away from true north.'
    },
    {
      title: 'Where is the scale exactly 1?',
      q: 'With $k_0 = 0.9996$, at what distance from the central meridian, on the equator, is the scale 1? And what is the scale at the zone edge (3° out)?',
      steps: [
        { text: 'Near the central meridian $k \\approx k_0(1 + x^2/2R^2)$. Set it to 1:', tex: 'x = R\\sqrt{2\\,(1/k_0 - 1)} = 6371\\sqrt{2\\times 0.0004} = 180.2\\ \\text{km}' },
        { text: 'At $\\Delta\\lambda = 3°$ on the equator:', tex: 'k = 0.9996/\\cos 3° = 1.00097' }
      ],
      a: 'Exactly 1 at 180 km each side; 1.00097 at the zone edge, 333.7 km out. The scale never differs from 1 by more than 0.04 % below, or 0.1 % above, inside the zone.'
    }
  ],
  quiz: [
    { q: 'In a UTM zone the scale factor on the central meridian is', choices: ['1', '0.9996', '1.0004', '0.999'], a: 1, why: 'It is reduced to 0.9996 so that the scale is exactly 1 at about 180 km each side and the greatest error is shared between the middle and the edges.' },
    { q: 'What is the central meridian of UTM zone 36, in degrees east?', answer: 33, why: '6 × 36 − 183 = 33.' },
    { q: 'The transverse Mercator projection is conformal.', a: true, why: 'It is Mercator’s projection applied to a sphere turned through 90°, and the Mercator recipe is what keeps angles; the scale is the same in every direction at a point.' },
    { q: 'How wide is a UTM zone, in degrees of longitude?', answer: 6, why: 'Sixty zones of 6° make 360°.' },
    { q: 'Why is a narrow strip, not a wide one, the natural domain of the transverse Mercator?', choices: ['the formulas fail outside it', 'because the scale grows as 1 + x²/2R² with the distance x from the central meridian', 'because the earth is not round', 'because the poles are in the way'], a: 1, why: 'The distortion is of second order in the distance from the central meridian: a strip of 6° has scale error at most 1 part in 1000, while the error at 60° is 100 %.' }
  ],
  applications: [
    'The UTM and MGRS grids used by surveyors, the military, search and rescue and every GPS receiver that shows coordinates as zone, easting and northing.',
    'National grids: the British National Grid, the Israeli Transverse Mercator, the German, Chinese and Russian Gauss–Krüger systems, and many more, each with its own central meridian and scale factor.',
    'Topographic and cadastral maps at large scale: the conformal property means that surveyed angles and small shapes are kept, and distance corrections are tiny (parts per million to parts per thousand).',
    'US state plane coordinates use the transverse Mercator for states that are taller than they are wide and the Lambert conformal conic for the wide ones.',
    'Geodesy and engineering: construction sites, pipelines and roads laid out in grid coordinates, with a convergence and scale factor correction applied to long lines.'
  ],
  history: 'Johann Heinrich Lambert described the transverse Mercator projection of the sphere in 1772. Carl Friedrich Gauss worked out the conformal mapping of the ellipsoid in the 1820s for the survey of Hanover, and Louis Krüger published the series that are still used in 1912, hence “Gauss–Krüger”. The Universal Transverse Mercator was defined by the US Army in the 1940s and adopted by NATO in the 1950s with its 60 zones and the factor 0.9996. In 2011 Charles Karney published formulas accurate to nanometres at any distance from the central meridian.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the transverse Mercator projection.', 'Defense Mapping Agency, *The Universal Grids: Universal Transverse Mercator (UTM) and Universal Polar Stereographic (UPS)*, TM 8358.2 (1989).', 'L. Krüger, *Konforme Abbildung des Erdellipsoids in der Ebene* (1912); C. F. F. Karney, “Transverse Mercator with an accuracy of a few nanometers”, *Journal of Geodesy* 85 (2011).'],
  sim: ['cy-utm-zone-explorer', { id: 'cy-compare', params: { proj: 'transverse-mercator' } }],
  construction: ['cy-tm-grid', 'cy-utm-zone-layout']
},

{
  id: 'web-mercator',
  parent: 'cylindrical-family',
  title: 'Web Mercator',
  level: 2,
  short: 'Mercator’s map cut at ±85.05° so that the world is a square, and divided into tiles that double in number at every zoom level. The map of Google, OpenStreetMap and every phone: conformal and square so that a street map zooms without rotating or reshaping, at the price of the usual Mercator inflation of the north.',
  keywords: ['Web Mercator', 'EPSG:3857', 'pseudo-Mercator', 'tiles', 'zoom level', 'slippy map', 'ground resolution', '85.05', 'XYZ tiles', 'Google Maps'],
  prereq: ['mercator-projection', 'cylindrical-projections', 'transverse-mercator-and-utm'],
  related: ['gps-and-web-maps', 'equirectangular-projection', 'equirectangular-images', 'conformal-maps', 'choosing-a-projection'],
  body: `Almost every map you see on a screen is a **Web Mercator** map: the ordinary Mercator projection, with two decisions made for the sake of computers. First, it is cut off at ±85.0511° latitude, so that the map is a **square**. Second, the square is divided into tiles by repeated halving, so that a viewer can fetch only the pieces it needs at the zoom it needs.

### The formula
For a sphere of radius $R = 6\\,378\\,137$ m (the equatorial radius of the WGS 84 ellipsoid),
$$x = R\\,\\lambda, \\qquad y = R\\ln\\tan\\left(\\frac{\\pi}{4} + \\frac{\\varphi}{2}\\right),$$
and the map is cut at $y = \\pm\\pi R$, which is $\\varphi_{\\max} = \\arctan(\\sinh\\pi) = 85.0511°$. The whole sheet is $2\\pi R = 40\\,075\\,017$ m on a side. On the screen a point is given in **pixels** at zoom level $z$, with the world $256\\times 2^z$ pixels across:
$$X = 256\\cdot 2^z\\,\\frac{\\lambda + \\pi}{2\\pi}, \\qquad Y = 256\\cdot 2^z\\,\\frac{1 - \\ln\\tan(\\tfrac{\\pi}{4}+\\tfrac{\\varphi}{2})/\\pi}{2},$$
and the tile that contains it is the integer part of $X/256$ columns from the left and the integer part of $Y/256$ rows from the top. Zoom 0 is one tile for the world; zoom 1, four; zoom $z$ has $4^z$ tiles. A tile is named $z/x/y$.

### Scale and the price of Mercator
Mercator's scale is $\\sec\\varphi$, so a pixel covers less and less ground as the latitude rises: the **ground resolution** is
$$\\text{res} = \\frac{2\\pi R\\cos\\varphi}{256\\cdot 2^z} = 156\\,543\\ \\text{m}\\ \\times \\frac{\\cos\\varphi}{2^z},$$
that is 156 543 m a pixel at the equator at zoom 0, 0.30 m at zoom 19. The shapes of small objects are right everywhere (the map is conformal: Tissot's indicatrix is a circle at every point, $\\sec\\varphi$ times the true size, so a circle of 100 km radius at 60° N is drawn with a radius of 200 km), which is the reason for the choice: buildings, streets and coastlines look right at every zoom, and north is always up. The areas are not: Greenland looks as large as Africa, and a distance measured with a ruler on the screen must be corrected by $\\cos\\varphi$.

### The “pseudo” in pseudo-Mercator
The Earth is an ellipsoid, but the web formulas treat the **geodetic** latitudes of GPS as if they were latitudes on a sphere of radius $R$. The result is not exactly conformal, and positions differ from true Mercator on the ellipsoid by as much as 40 km north–south at high latitudes. For a picture that is of no consequence; for measuring or surveying it is: use the proper coordinates of the data, and a projection chosen for the job.

### Drawing it
The square needs only a T-square: ±180 units on the equator, then the top and bottom edges at the same height. The parallels come from the Mercator table, the tiles from repeated halving with the dividers. The construction draws the square and its tiles.`,
  ideas: [
    'Web Mercator is Mercator’s map on a sphere of radius 6 378 137 m, cut at ±85.0511° so the world is a square, 2πR = 40 075 017 m on a side.',
    'The square is halved into 2^z × 2^z tiles of 256 pixels at zoom z, named z/x/y; the pixel coordinates follow from λ and ln tan(π/4 + φ/2).',
    'Ground resolution is 156 543 m × cos φ / 2^z per pixel: halved by each zoom level, and reduced by cos φ at latitude φ.',
    'Conformality keeps the shapes of streets right at every zoom and north up; the areas and distances are those of Mercator, and the ellipsoid is handled approximately.'
  ],
  pitfalls: [
    'A scale bar on a web map is true everywhere on it — It is true only at one latitude: the same bar on a map of Iceland covers half the ground of one on a map of Kenya. A measuring tool must correct for it.',
    'Web Mercator is just Mercator — Same formula, but applied to the ellipsoidal latitudes as if they were spherical, so it is not exactly conformal, and it is cut at 85.05° to make a square.',
    'GPS coordinates can be used as Web Mercator coordinates — GPS gives latitude and longitude in degrees; Web Mercator’s x and y are metres from a formula. Mixing them (for instance by treating degrees as metres) is a common error.'
  ],
  formulas: [
    {
      name: 'Ground resolution',
      expr: 'res = 2*pi*R*cos(phi)/(256*2^z)',
      tex: '\\mathrm{res} = \\frac{2\\pi R\\cos\\varphi}{256\\cdot 2^{z}}',
      vars: {
        res: { name: 'metres of ground per pixel', q: 'length', unit: 'm' },
        R: { name: 'radius used by Web Mercator', q: 'length', unit: 'm', value: 6378137, fixed: true },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, min: 0, max: 85.05, tex: '\\varphi' },
        z: { name: 'zoom level', value: 10, int: true, min: 0, max: 22 }
      },
      solveFor: 'res',
      note: '156 543 m at zoom 0 on the equator; 152.9 m at zoom 10; at the latitude of Tel Aviv (32°) and zoom 10: 129.6 m.'
    },
    {
      name: 'Tile column',
      expr: 'tx = 2^z*(lon + pi)/(2*pi)',
      tex: 't_x = 2^{z}\\,\\frac{\\lambda + \\pi}{2\\pi}',
      vars: {
        tx: { name: 'tile column (take the integer part), counting from 0 at 180° W' },
        lon: { name: 'longitude', q: 'angle', unit: '°', value: 34.8, signed: true, min: -180, max: 180, tex: '\\lambda' },
        z: { name: 'zoom level', value: 10, int: true, min: 0, max: 22 }
      },
      solveFor: 'tx',
      note: 'The tile number is the integer part: for 34.8° E at zoom 10, 610.5, so column 610.'
    },
    {
      name: 'Tile row',
      expr: 'ty = 2^z*(1 - ln(tan(pi/4 + phi/2))/pi)/2',
      tex: 't_y = 2^{z}\\,\\frac{1 - \\ln\\tan(\\frac{\\pi}{4}+\\frac{\\varphi}{2})/\\pi}{2}',
      vars: {
        ty: { name: 'tile row (take the integer part), counting from 0 at 85.05° N' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, signed: true, min: -85, max: 85, tex: '\\varphi' },
        z: { name: 'zoom level', value: 10, int: true, min: 0, max: 22 }
      },
      solveFor: 'ty',
      note: 'For 32.07° N at zoom 10: 415.3, row 415. The rows count downwards from the north edge.'
    }
  ],
  examples: [
    {
      title: 'Which tile is Tel Aviv in?',
      q: 'Find the tile (zoom 10) that contains Tel Aviv, 32.07° N, 34.78° E, and the ground covered by one pixel there.',
      steps: [
        { text: 'The column from the longitude ($\\lambda = 0.6070$ rad):', tex: 't_x = 1024\\cdot\\frac{0.6070 + 3.1416}{6.2832} = 610.9 \\Rightarrow 610' },
        { text: 'The row from the latitude, with $\\ln\\tan(45° + 16.04°) = 0.5908$:', tex: 't_y = 1024\\cdot\\frac{1 - 0.5908/\\pi}{2} = 415.7 \\Rightarrow 415' },
        { text: 'The ground per pixel at zoom 10:', tex: '156\\,543\\cdot\\cos 32.07°/1024 = 129.6\\ \\text{m}' }
      ],
      a: 'Tile 10/610/415; one pixel covers 130 m of ground, though the same pixel at the equator covers 153 m.'
    },
    {
      title: 'How far in must I zoom?',
      q: 'To see detail of 1 metre per pixel at 45° N, what zoom level is needed?',
      steps: [
        { text: 'The ground resolution is $156\\,543\\cos 45°/2^z$. Set it to 1:', tex: '2^z = 156\\,543\\times 0.7071 = 110\\,690 \\Rightarrow z = \\log_2 110\\,690 = 16.8' },
        'The zoom must be a whole number: $z=17$ gives 0.84 m a pixel, while $z=16$ gives 1.69 m.'
      ],
      a: 'Zoom 17 (0.84 m per pixel); at 60° N, where cos φ is 0.5, one more level would be needed for the same resolution.'
    }
  ],
  quiz: [
    { q: 'Why is Web Mercator cut at about 85.05° of latitude?', choices: ['because the poles are not interesting', 'because there y = πR, so the map is a square and tiles halve neatly', 'because the satellites cannot see further', 'because the ellipsoid ends there'], a: 1, why: 'The Mercator ordinate reaches the value πR, half the width of the world, at φ = arctan(sinh π) = 85.0511°. The sheet is then square, which is what a quadtree of tiles needs.' },
    { q: 'How many tiles make up the world at zoom level 5?', answer: 1024, why: '2^5 × 2^5 = 32 × 32 = 1024 tiles, each 256 pixels square.' },
    { q: 'At the same zoom level, a pixel on a web map of Iceland (64° N) covers the same ground as one at the equator.', a: false, why: 'The scale is sec φ, so a pixel covers cos φ times the equatorial ground: 0.44 of it at 64° N.' },
    { q: 'The ground resolution at the equator at zoom 0 is about', choices: ['1 m', '156 543 m', '40 075 m', '256 m'], a: 1, why: 'The equator is 40 075 017 m long and the world is 256 pixels across at zoom 0.' },
    { q: 'Web Mercator treats the latitudes of GPS (on the ellipsoid) as latitudes on a sphere. What is the consequence?', choices: ['nothing, the two are identical', 'the map is not exactly conformal and positions differ from true Mercator by tens of kilometres at high latitudes', 'the map becomes equal-area', 'the poles appear'], a: 1, why: 'The ellipsoidal and the spherical Mercator ordinates differ by up to about 40 km at 85° latitude (30 km at 45°), and angles are not exactly right.' }
  ],
  applications: [
    'Online maps: Google, OpenStreetMap, Bing, Mapbox and the apps built on them use Web Mercator tiles (EPSG:3857) at zoom levels 0 to about 19–22.',
    'Satellite and aerial imagery services serve their pictures as Web Mercator tile pyramids, so one set of tiles can be shown under a street map.',
    'Navigation on phones: the compass-up “follow me” mode and the turn-by-turn views keep shapes and angles right because the map is conformal.',
    'Spatial databases and GIS: layers published for the web are often stored in Web Mercator, with a note that their area and length measurements must be made in another coordinate system.',
    'Education and public debate: because everyone sees the same map, the Mercator inflation of Greenland and Africa became a topic of its own.'
  ],
  history: 'Google introduced the map in 2005 with Google Maps, taking the spherical Mercator formulas and the idea of tiles from earlier imagery work; the other web map services copied it, and the choice of the sphere with the ellipsoidal latitudes became a de facto standard. Before the European Petroleum Survey Group gave it a code in 2008 (EPSG:3857), the community used an unofficial code, 900913, whose digits spell “GOOGLE” in the numeral spelling of internet slang.',
  sources: ['IOGP, *Coordinate Conversions and Transformations including Formulas*, Guidance Note 7-2, the “Popular Visualisation Pseudo-Mercator” method (EPSG:1024).', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Mercator projection.', 'OpenStreetMap wiki, *Slippy map tilenames*.'],
  sim: 'cy-web-tiles',
  construction: 'cy-web-mercator-square'
},

{
  id: 'lambert-cylindrical-equal-area',
  parent: 'cylindrical-family',
  title: 'Lambert’s cylindrical equal-area and Gall–Peters',
  level: 2,
  short: 'Project the globe onto the cylinder along horizontal rays: the parallels sit at y = R sin φ, and by Archimedes’ theorem every area is kept. Cut the cylinder at ±45° and it is the Gall–Peters map; at 30°, Behrmann’s. One family, one choice: where the shapes are right.',
  keywords: ['Lambert cylindrical', 'equal-area', 'Gall–Peters', 'Peters projection', 'Behrmann', 'Archimedes', 'hat-box theorem', 'standard parallel', 'EASE-Grid', 'Balthasart'],
  prereq: ['cylindrical-projections', 'equal-area-maps', 'scale-factor-and-standard-parallels'],
  related: ['mercator-projection', 'lambert-azimuthal-equal-area', 'albers-equal-area-conic', 'miller-and-gall-stereographic', 'tissot-indicatrix', 'choosing-a-projection'],
  body: `Archimedes found that if a sphere is enclosed in a cylinder that touches it along the equator, then the surface of the sphere between two parallels has exactly the same area as the surface of the cylinder between the same two horizontal planes: $2\\pi R$ times the height. So project every point of the sphere **horizontally**, along rays perpendicular to the axis, onto the cylinder, and areas are kept. Unrolled, the cylinder is **Lambert's cylindrical equal-area map**:
$$x = R\\,(\\lambda - \\lambda_0), \\qquad y = R\\sin\\varphi.$$
The sheet is $2\\pi R$ wide and $2R$ high: a flat strip, $\\pi : 1$, with the poles as lines at $y = \\pm R$.

### Secant cylinders: the standard parallel
Let the cylinder cut the globe along the parallels $\\pm\\varphi_1$ instead of touching it at the equator. Its radius is $R\\cos\\varphi_1$; project horizontally onto it, and then stretch the heights by $1/\\cos\\varphi_1$ to repair the area:
$$x = R\\,(\\lambda - \\lambda_0)\\cos\\varphi_1, \\qquad y = \\frac{R\\sin\\varphi}{\\cos\\varphi_1}.$$
The scales are $k = \\cos\\varphi_1/\\cos\\varphi$ along the parallels and $h = \\cos\\varphi/\\cos\\varphi_1$ along the meridians; $hk = 1$ everywhere, but at $\\varphi = \\pm\\varphi_1$ both are 1, so the **shape is true on the standard parallels**, and nowhere else. Tissot's indicatrix is an ellipse of unchanged area, tall in the tropics (where $h>1>k$) and wide towards the poles. The sheet's proportions are $\\pi\\cos^2\\varphi_1 : 1$.

| $\\varphi_1$ | Name | Sheet ($w:h$) |
|---|---|---|
| 0° | Lambert (1772) | 3.14 : 1 |
| 30° | Behrmann (1910) | 2.36 : 1 |
| 37°24′ | Trystan Edwards (1953) | 1.98 : 1 |
| 45° | Gall (1855), Peters (1973) | 1.57 : 1 |
| 50° | Balthasart (1935) | 1.30 : 1 |

### The argument about Peters
In 1973 Arno Peters presented his world map as the “fair” alternative to Mercator, since it gives Africa its due, 14 times Greenland, which Mercator shows as the same size. The map is exactly Gall's orthographic projection of 1855, the case $\\varphi_1 = 45°$. Cartographers pointed out that it was not new and that its shapes are badly stretched, and in 1989 several North American geographical societies resolved against rectangular world maps altogether. Both sides had a point: no one map can be fair to area and shape together, and the only honest question is which to keep, as [[choosing-a-projection|choosing a projection]] argues.

### Drawing it
Archimedes' own construction is the hand method: a side view of the sphere, horizontal lines carried with the T-square from points of equal latitude on the circle across to the unrolled cylinder, and the meridians stepped off with the dividers. The Gall–Peters sheet is the same drawing on a circle of radius $\\sqrt2 R$ with the meridians half as far apart horizontally.

> [!fact] Archimedes reportedly asked for a sphere in a cylinder to be carved on his tomb, so proud was he of this result: a sphere has two thirds the volume and two thirds the surface of its circumscribed cylinder.`,
  ideas: [
    'Project horizontally onto the cylinder: y = R sin φ. By Archimedes’ theorem the area between two parallels equals the cylinder’s, 2πR times the height, so the map is equal-area.',
    'A secant cylinder at ±φ₁ has x = R λ cos φ₁ and y = R sin φ / cos φ₁; the scales are k = cos φ₁/cos φ and h = cos φ/cos φ₁, with hk = 1.',
    'The standard parallel is where the shape is true: Lambert 0°, Behrmann 30°, Edwards 37.4°, Gall–Peters 45°, Balthasart 50°. Larger φ₁ rounds the sheet and moves the stretch from the poles to the tropics.',
    'Peters’ map is Gall’s of 1855 and is equal-area like all of the family; the argument is about shapes and rhetoric, not about area.'
  ],
  pitfalls: [
    'The Gall–Peters map shows the world as it is — It shows areas as they are, at the price of strongly stretched shapes (Africa is tall, Scandinavia wide). No map shows the world as it is.',
    'Equal-area maps are fairer than Mercator in every sense — They are fairer in area; Mercator is fairer in shape and direction. “Fair” depends on what is being compared.',
    'The Gall–Peters map was Peters’s invention — James Gall described the same projection in 1855 (and it is the case φ₁ = 45° of Lambert’s 1772 family). Peters’s contribution was to promote it.'
  ],
  formulas: [
    {
      name: 'Height of a parallel',
      expr: 'y = R*sin(phi)/cos(phi1)',
      tex: 'y = \\frac{R\\sin\\varphi}{\\cos\\varphi_1}',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -90, max: 90, tex: '\\varphi' },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 45, min: 0, max: 70, tex: '\\varphi_1' }
      },
      solveFor: 'y',
      note: 'Gall–Peters (φ₁ = 45°, R = 100 mm): 70.7 at 30°, 122.5 at 60°, 141.4 at the pole. For Lambert (φ₁ = 0) the pole is at R.'
    },
    {
      name: 'Shape of the sheet',
      expr: 'r = pi*cos(phi1)^2',
      tex: 'r = \\pi\\cos^2\\varphi_1',
      vars: {
        r: { name: 'width ÷ height of the world map' },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 45, min: 0, max: 70, tex: '\\varphi_1' }
      },
      solveFor: 'r',
      note: 'The width is 2πR cos φ₁ and the height 2R/cos φ₁. 3.14 for Lambert, 2.36 Behrmann, 1.57 Gall–Peters, 1.30 Balthasart.'
    },
    {
      name: 'Scale along the parallel',
      expr: 'k = cos(phi1)/cos(phi)',
      tex: 'k = \\frac{\\cos\\varphi_1}{\\cos\\varphi}',
      vars: {
        k: { name: 'scale along the parallel (the meridian scale is 1/k)' },
        phi1: { name: 'standard parallel', q: 'angle', unit: '°', value: 45, min: 0, max: 70, tex: '\\varphi_1' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'k',
      note: 'At 60° on a Gall–Peters map k = 1.414 and h = 0.707: a circle becomes an ellipse twice as wide as it is high. At the equator k = 0.707, h = 1.414.'
    }
  ],
  examples: [
    {
      title: 'Drawing the Gall–Peters map',
      q: 'A Gall–Peters map is to be drawn for a globe of R = 100 mm. How wide and high is the sheet, and where are the parallels 30°, 60° and the poles?',
      steps: [
        { text: 'Width $2\\pi R\\cos 45°$ and height $2R/\\cos 45°$:', tex: 'w = 2\\pi\\cdot 100\\cdot 0.7071 = 444.3\\ \\text{mm},\\qquad h = 2\\cdot 100/0.7071 = 282.8\\ \\text{mm}' },
        { text: 'Heights with $y = R\\sin\\varphi/\\cos 45°$:', tex: 'y_{30} = 70.7,\\quad y_{60} = 122.5,\\quad y_{90} = 141.4\\ \\text{mm}' },
        'The ratio is $444.3/282.8 = 1.571 = \\pi/2$, as $\\pi\\cos^2 45°$ requires.'
      ],
      a: 'The sheet is 444 × 283 mm; the parallels are at 70.7, 122.5 and (the poles) 141.4 mm above and below the equator.'
    },
    {
      title: 'A circle becomes an ellipse',
      q: 'A circle of radius 100 km is centred at 60° N on a Gall–Peters map. What are the axes of its image (as ground distances at map scale), and is its area changed?',
      steps: [
        'Along the parallel $k = \\cos 45°/\\cos 60° = 1.414$; along the meridian $h = \\cos 60°/\\cos 45° = 0.707$.',
        { text: 'The ellipse has semi-axes', tex: '100\\times 1.414 = 141\\ \\text{km (east–west)},\\qquad 100\\times 0.707 = 71\\ \\text{km (north–south)}' },
        'Area scale $hk = 1$: $\\pi\\cdot 141\\cdot 71 = \\pi\\cdot 100^2$.'
      ],
      a: 'An ellipse 141 km by 71 km, with the same area as the circle: the shape is the casualty.'
    }
  ],
  quiz: [
    { q: 'What is the key to the equal-area property of Lambert’s cylindrical map?', choices: ['conformality', 'Archimedes’ theorem: the zone between two parallels has the area of the cylinder between the same planes', 'the meridians are equally spaced', 'the cylinder touches at the poles'], a: 1, why: 'The area of the zone of the sphere between two parallels is 2πR times the distance between their planes; the same as for the cylinder.' },
    { q: 'On a Gall–Peters map the width of the sheet divided by its height is', answer: 1.571, why: 'π cos² 45° = π/2 = 1.571.' },
    { q: 'The Gall–Peters map preserves shape at the equator.', a: false, why: 'The shape is true only on the standard parallels, ±45°. At the equator the scales are k = 0.707 and h = 1.414: a circle is a tall ellipse.' },
    { q: 'Which standard parallel gives Behrmann’s map?', answer: 30, unit: '°', why: 'Behrmann (1910) used the parallels ±30°.' },
    { q: 'How many times is Africa (30.4 million km²) larger than Greenland (2.17 million km²) on an equal-area map?', answer: 14, why: '30.4 / 2.17 = 14. On a Mercator map the two look about equal in size.' }
  ],
  applications: [
    'Thematic world maps in which an area-based quantity is shown, such as land cover, forest loss, crop areas or the extent of ice: the visual weight of each region is proportional to its true area.',
    'Earth-observation grids: the EASE-Grid 2.0 of the US National Snow and Ice Data Center is a Lambert cylindrical equal-area grid with its standard parallel at 30°, used for global snow, ice and soil-moisture products so that every grid cell has the same area.',
    'GIS area statistics: calculating global or continental areas in a projected coordinate system requires an equal-area projection; the cylindrical one is the simplest.',
    'Education and development work: the Peters map was adopted by aid organisations and schools to give the south its due size, and is the usual starting point for a discussion of what a map says.',
    'Printed world maps where the poles must be shown and the sheet must be nearly as high as it is wide: the Gall–Peters and Balthasart sheets are rectangles 1.6 : 1 or 1.3 : 1.'
  ],
  history: 'Archimedes proved the theorem around 225 BC; Johann Heinrich Lambert used it for the cylindrical equal-area map in 1772. The Scottish clergyman James Gall devised the version with standard parallels at 45° in 1855, Walter Behrmann the 30° one in 1910, Balthasart the 50° one in 1935 and Trystan Edwards the 37°24′ one in 1953. In 1973 Arno Peters presented the 45° map as a new invention and as a correction of Mercator’s; Arthur Robinson’s 1985 review of his claims and the 1989 resolution of the North American geographical societies against rectangular world maps closed the formal debate, but the map remains in use.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the cylindrical equal-area projection.', 'Arthur H. Robinson, “Arno Peters and his new cartography”, *The American Cartographer* 12 (1985).', 'Mark Monmonier, *Rhumb Lines and Map Wars: A Social History of the Mercator Projection* (2004).'],
  sim: { id: 'cy-standard-parallel', params: { phi1: 45 } },
  construction: ['cy-archimedes-cylinder', 'cy-gall-peters-sheet']
},

{
  id: 'miller-and-gall-stereographic',
  parent: 'cylindrical-family',
  title: 'Miller and Gall stereographic',
  level: 2,
  short: 'Two cylindrical compromises that bring the poles onto the sheet: Miller squeezes Mercator’s latitudes by 0.8 and stretches the result back, Gall places the light on the equator and cuts the globe at ±45°. Neither is conformal or equal-area; both look like a good wall map.',
  keywords: ['Miller cylindrical', 'Gall stereographic', 'compromise', 'wall map', 'secant cylinder', 'perspective cylindrical', 'poles on the sheet', 'Osborn Maitland Miller', 'James Gall'],
  prereq: ['cylindrical-projections', 'mercator-projection', 'compromise-maps'],
  related: ['lambert-cylindrical-equal-area', 'central-cylindrical-projection', 'equirectangular-projection', 'robinson-projection', 'choosing-a-projection'],
  body: `Mercator's map is excellent for steering and unusable for the world: the poles are at infinity and Greenland covers the top of the sheet. Two cylindrical maps from the nineteenth and twentieth centuries keep the look of a Mercator-like rectangle but bring the poles onto the page.

### Miller's cylindrical (1942)
Osborn Miller of the American Geographical Society took Mercator's rule and applied it to **four fifths of the latitude**, then stretched the result by one and a quarter to restore the scale at the equator:
$$x = R\\,\\lambda, \\qquad y = 1.25\\,R\\,\\ln\\tan\\left(\\frac{\\pi}{4} + 0.4\\,\\varphi\\right).$$
The meridian scale is $h = \\sec(0.8\\varphi)$ and the parallel scale is $k = \\sec\\varphi$, so the map is neither conformal nor equal-area, but $h$ is much closer to $k$ than on the equirectangular map. The pole, which Mercator puts at infinity, is at $y = 2.303\\,R$: the sheet is $2\\pi R$ wide and $4.607\\,R$ high, about 1.36 : 1. The cost: at 60° the area is exaggerated 3.0 times (Mercator 4), at 80° 13 times, and at the pole infinitely; the map looks natural and mid-latitude shapes are good.

### Gall's stereographic cylindrical (1855)
Here the projection is a true perspective: put the light on the **equator**, at the point opposite the central meridian, and let the cylinder **cut** the globe at 45° N and S, so that its radius is $R/\\sqrt2$. A ray from the light through the point of latitude $\\varphi$ meets the cylinder at the height
$$y = R\\left(1 + \\frac{\\sqrt2}{2}\\right)\\tan\\frac{\\varphi}{2}, \\qquad x = \\frac{R\\,\\lambda}{\\sqrt2},$$
so the poles are at $\\pm 1.707\\,R$ and the sheet is $2\\pi R/\\sqrt2 = 4.443\\,R$ by $3.414\\,R$, close to 1.3 : 1. The scales are $k = \\sec\\varphi/\\sqrt2$ along the parallels and $h = 0.854\\sec^2(\\varphi/2)$ along the meridians. Both are exactly 1 at $\\pm 45°$, so shapes are true there; at the equator $k=0.707$ and $h=0.854$, so everything is squeezed; at 60° the area scale is 1.6. Tissot's indicatrix on Gall's map is a circle at ±45°, a tall ellipse nearer the equator and a wide one beyond ±45°; on Miller's map it is a wide ellipse at every latitude ($k>h$), 2 : 1.5 at 60°.

### Choosing between them
Gall's map is the more moderate (areas 1.6 at 60° against Miller's 3.0), gives a shorter, rounder sheet and a better sense of the polar regions; Miller's looks more like Mercator's familiar map at low latitudes. Both are used for wall maps and as the background of statistical displays, where a rectangle is required and no property has to be exact.

### Drawing them by hand
Miller's map from a table of heights (the Mercator table for $0.8\\varphi$, multiplied by 1.25), Gall's by a real perspective construction: in the side view, a line from the light through each point of the circle meets the vertical cylinder at the height that belongs to that parallel. Both constructions are given.

> [!note] Gall's **orthographic** (equal-area, 45°) and **isographic** maps are cylindrical too; the “stereographic” one here owes its name to the light being on the surface of the globe, as in the azimuthal stereographic projection.`,
  ideas: [
    'Miller: y = 1.25 R ln tan(π/4 + 0.4 φ) — Mercator with the latitude shrunk to 0.8 and the result scaled by 1.25; the pole is at 2.303 R and the sheet about 1.36 : 1.',
    'Gall stereographic: a perspective from the equator point opposite the central meridian onto a cylinder cutting the globe at ±45°; y = R (1 + √2/2) tan(φ/2), x = R λ/√2; sheet about 1.3 : 1, poles at ±1.707 R.',
    'Neither keeps angles or areas; Gall’s has true scale on ±45° and moderate area exaggeration (1.6 at 60°), Miller’s keeps Mercator’s look at low latitudes (area 3.0 at 60°).',
    'They are the maps of wall posters and dashboards: a rectangle with the poles on the page and no property exact.'
  ],
  pitfalls: [
    'Miller’s map is Mercator with the poles cut off — The poles are on the sheet, at the finite height 2.303 R; the sheet is full-height, but the poles are still lines and the area near them still inflated.',
    'Gall’s stereographic map is the azimuthal stereographic projection — It is a perspective onto a cylinder, with the light on the equator. The azimuthal one projects onto a plane touching at the centre of the map. They share only the idea of putting the light on the globe.',
    'These maps preserve nothing, so they are no use — They are tuned for looks: they keep the meridians vertical, the poles on the page and the area distortion moderate. Their use is display, not measurement.'
  ],
  formulas: [
    {
      name: 'Height of a parallel in Miller’s map',
      expr: 'y = 1.25*R*ln(tan(pi/4 + 0.4*phi))',
      tex: 'y = 1.25\\,R\\ln\\tan\\left(\\frac{\\pi}{4} + 0.4\\varphi\\right)',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'R = 100 mm: 54.0 at 30°, 119.7 at 60° (Mercator: 131.7), 230.3 at the pole.'
    },
    {
      name: 'Height of a parallel in Gall’s stereographic map',
      expr: 'y = R*(1 + sqrt(2)/2)*tan(phi/2)',
      tex: 'y = R\\left(1 + \\frac{\\sqrt2}{2}\\right)\\tan\\frac{\\varphi}{2}',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'R = 100 mm: 45.7 at 30°, 98.6 at 60°, 170.7 at the pole. The poles are finite.'
    },
    {
      name: 'Scale along a parallel in Gall’s map',
      expr: 'k = 1/(sqrt(2)*cos(phi))',
      tex: 'k = \\frac{1}{\\sqrt2\\,\\cos\\varphi}',
      vars: {
        k: { name: 'scale along the parallel' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'k',
      note: 'The cylinder has radius R/√2, so the parallel scale is sec φ/√2: 0.707 at the equator, exactly 1 at 45°, 1.41 at 60°.'
    }
  ],
  examples: [
    {
      title: 'Where is 60° on each map?',
      q: 'For a globe of R = 100 mm, compare the height of the 60° parallel on the Mercator, Miller and Gall stereographic maps, and the area scale at 60° for each.',
      steps: [
        { text: 'Mercator: $y = R\\ln\\tan 75°$; area scale $\\sec^2 60°$:', tex: '131.7\\ \\text{mm};\\quad 4.0' },
        { text: 'Miller: $y = 125\\ln\\tan 69°$; $h = \\sec 48° = 1.494$, $k = 2$:', tex: '119.7\\ \\text{mm};\\quad hk = 2.99' },
        { text: 'Gall: $y = 170.7\\tan 30°$; $k = 1/(\\sqrt2\\cos 60°) = 1.414$, $h = 0.854\\sec^2 30° = 1.138$:', tex: '98.6\\ \\text{mm};\\quad hk = 1.61' }
      ],
      a: 'Mercator 131.7 mm and area 4.0; Miller 119.7 mm and 3.0; Gall 98.6 mm and 1.6: the poles come in, and the northern stretch goes down.'
    },
    {
      title: 'How big is Gall’s sheet?',
      q: 'For R = 100 mm, what are the width and the height of the whole Gall stereographic world map and its shape?',
      steps: [
        { text: 'Width $2\\pi R/\\sqrt2$, height from the poles at $\\pm R(1+\\sqrt2/2)$:', tex: 'w = 444.3\\ \\text{mm},\\qquad h = 2\\times 170.7 = 341.4\\ \\text{mm}' },
        'Ratio $w/h = 1.30$.'
      ],
      a: '444 mm by 341 mm, a ratio of 1.30 : 1 — close to the paper formats of a poster.'
    }
  ],
  quiz: [
    { q: 'In Miller’s cylindrical map the pole is at the height (in units of R)', answer: 2.303, why: '1.25 ln tan(45° + 0.4 × 90°) = 1.25 ln tan 81° = 1.25 × 1.843 = 2.303.' },
    { q: 'Where does Gall’s stereographic map have true scale along the parallels?', choices: ['at the equator', 'at ±45°', 'at the poles', 'nowhere'], a: 1, why: 'The cylinder cuts the globe at ±45°; there its circle has the length of the parallel, and also h = 1.' },
    { q: 'Where is the light in Gall’s stereographic projection?', choices: ['at the centre of the globe', 'at the pole', 'on the equator, at the point opposite the central meridian', 'at infinity'], a: 2, why: 'The light stands on the surface of the globe, on the equator, opposite the point of the central meridian: that is the stereographic idea applied to a cylinder.' },
    { q: 'Miller’s map is conformal.', a: false, why: 'The meridian scale sec 0.8φ is smaller than the parallel scale sec φ except on the equator, so angles are not preserved; the map is a compromise.' },
    { q: 'Which map has the smaller area exaggeration at 60° latitude: Mercator, Miller or Gall stereographic?', choices: ['Mercator (4.0)', 'Miller (3.0)', 'Gall stereographic (1.6)', 'all the same'], a: 2, why: 'Computed from the scale factors: Mercator 4.0, Miller 2.99, Gall 1.61.' }
  ],
  applications: [
    'Wall maps and school posters, where a rectangle with straight meridians, the poles visible and moderate distortion is wanted.',
    'Background maps of statistical dashboards and news graphics: Miller’s in particular is the projection in which several charting libraries ship their world maps.',
    'Atlas maps of the world on a single page, where Gall’s stereographic gives a better impression of the polar regions than Mercator’s.',
    'Teaching map projections: Miller’s recipe (Mercator’s rule with a rescaling) is a clean example of how a projection is tuned by a formula rather than a construction.'
  ],
  history: 'James Gall, a Scottish clergyman and amateur astronomer, proposed the stereographic cylindrical projection in 1855, together with the equal-area and isographic cylinders that bear his name. Osborn Maitland Miller of the American Geographical Society, published his modification of Mercator’s projection in 1942, in a note on cylindrical world map projections.',
  sources: ['Osborn M. Miller, “Notes on cylindrical world map projections”, *Geographical Review* 32 (1942).', 'James Gall, “Use of cylindrical projections for geographical, astronomical, and scientific purposes”, *Scottish Geographical Magazine* 1 (1885).', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987).'],
  sim: [{ id: 'cy-cylinder-lab', params: { proj: 'gall-stereographic' } }, { id: 'cy-compare', params: { proj: 'miller' } }],
  construction: ['cy-miller-table', 'cy-gall-stereographic']
},

{
  id: 'cassini-projection',
  parent: 'cylindrical-family',
  title: 'The Cassini projection',
  level: 3,
  short: 'The plate carrée turned on its side: a place is placed by its distance from a central meridian, measured along the great circle perpendicular to it, and by the distance along that meridian to the foot of the perpendicular. Both are true lengths. The map of France’s great survey and of many old grids.',
  keywords: ['Cassini', 'Cassini–Soldner', 'transverse equirectangular', 'perpendicular distance', 'Napier', 'spherical right triangle', 'Palestine grid', 'survey of France', 'central meridian'],
  prereq: ['equirectangular-projection', 'aspects-of-a-projection', 'cylindrical-projections'],
  related: ['transverse-mercator-and-utm', 'surveys-and-national-grids', 'equidistant-maps', 'mercator-projection'],
  body: `Take the equirectangular map and turn it a quarter turn about a point on the equator, so that the cylinder touches a **meridian** and the central meridian takes the place of the equator. The result is the **Cassini projection**, and it is as simple on a sphere as the plate carrée is on the sphere's own axis. Choose a central meridian. A place is then given by two distances:

- $x$, the distance of the place from the central meridian, measured along the **great circle through the place perpendicular to that meridian**;
- $y$, the distance along the central meridian from the equator to the **foot** of that perpendicular.

These are the legs of a spherical right triangle (the right angle is at the foot of the perpendicular), whose other parts are tied to the place's latitude and longitude. Napier's rules for such triangles give
$$\\sin(x/R) = \\cos\\varphi\\,\\sin\\Delta\\lambda, \\qquad \\tan(y/R) = \\frac{\\tan\\varphi}{\\cos\\Delta\\lambda},$$
where $\\Delta\\lambda$ is the longitude from the central meridian. That is $x = R\\arcsin(\\cos\\varphi\\sin\\Delta\\lambda)$, $y = R\\,\\mathrm{atan2}(\\tan\\varphi,\\cos\\Delta\\lambda)$. The inverse is as short: $\\sin\\varphi = \\sin(y/R)\\cos(x/R)$ and $\\tan\\Delta\\lambda = \\tan(x/R)/\\cos(y/R)$.

### What it keeps and loses
Both coordinates are true lengths, so the map is **equidistant along the central meridian and along every line perpendicular to it**. The scale along the perpendicular lines is 1. The scale in the other direction, parallel to the central meridian, is
$$k = \\frac{1}{\\cos(x/R)} \\approx 1 + \\frac{x^2}{2R^2},$$
so it grows with the distance from the central meridian, and so does the area scale $\\sec(x/R)$. At 500 km from the central meridian the area is 0.3 % too large, at 1000 km 1.2 %. Angles are not true (Tissot's indicatrix is an ellipse, with its long axis parallel to the central meridian), and shapes are a little squashed: the map is neither conformal nor equal-area. It is the *simplest* transverse map, but within a narrow strip it is as good as the transverse Mercator and needs no logarithms.

### The graticule
The central meridian is a straight line; the other meridians and the parallels are curves symmetrical about it and about the equator. A hemisphere centred on the central meridian is a square of side $\\pi R$, and the parallels end on its top and bottom edges. The hand method is the table: for each meridian and parallel, work out $x$ and $y$ (or measure them with a protractor on a globe), plot the points, join them with a French curve.

> [!note] Cassini–Soldner is the version for the ellipsoid, worked out by Johann von Soldner in 1810 for the Bavarian cadastral survey. It is still the projection of the grids of old cadastral systems, among them the Palestine Grid of 1923, the origin of the old Israeli grid, and the state grids of peninsular Malaysia.`,
  ideas: [
    'Cassini’s map is the equirectangular turned on its side: x is the perpendicular distance from the central meridian, y the distance along it to the foot of the perpendicular; both are true.',
    'sin(x/R) = cos φ sin Δλ and tan(y/R) = tan φ / cos Δλ: the legs of a spherical right triangle (Napier’s rules).',
    'It is equidistant along the central meridian and along every perpendicular; the other scale is sec(x/R) ≈ 1 + x²/2R², so shape and area degrade slowly with the distance from the central meridian.',
    'Used for the Cassini map of France and later for cadastral grids (Soldner coordinates, the Palestine Grid) in narrow strips, where its simple formulas are enough.'
  ],
  pitfalls: [
    'Cassini’s projection is the transverse Mercator — Both are transverse cylinders, but Mercator’s is conformal and stretches x like the artanh of cos φ sin Δλ, while Cassini’s keeps x as true distance and loses conformality. They agree to second order near the central meridian.',
    'The Cassini map keeps the shapes of a narrow strip exactly — The scale along the strip is sec(x/R), so shapes are slightly sheared: one part in a thousand at 280 km from the central meridian. For surveys that is too much, and why the conformal map replaced it.',
    'The central line of a Cassini map must be a meridian — Any great circle can serve (the oblique Cassini). A meridian is chosen in the standard map because national surveys were built on one.'
  ],
  formulas: [
    {
      name: 'Distance from the central meridian',
      expr: 'x = R*asin(cos(phi)*sin(dl))',
      tex: 'x = R_\\oplus\\arcsin\\left(\\cos\\varphi\\,\\sin\\Delta\\lambda\\right)',
      vars: {
        x: { name: 'distance of the place from the central meridian', q: 'length', unit: 'km', signed: true },
        R: { const: 'Rearth' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, signed: true, min: -89, max: 89, tex: '\\varphi' },
        dl: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 5, signed: true, min: -85, max: 85, tex: '\\Delta\\lambda' }
      },
      solveFor: 'x',
      note: 'At 40° N and 5° east of the central meridian: 425.7 km. At the equator x = R Δλ, as on the plate carrée.'
    },
    {
      name: 'Distance along the central meridian',
      expr: 'y = R*atan(tan(phi)/cos(dl))',
      tex: 'y = R_\\oplus\\arctan\\frac{\\tan\\varphi}{\\cos\\Delta\\lambda}',
      vars: {
        y: { name: 'distance along the central meridian to the foot of the perpendicular', q: 'length', unit: 'km', signed: true },
        R: { const: 'Rearth' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 40, signed: true, min: -89, max: 89, tex: '\\varphi' },
        dl: { name: 'longitude from the central meridian', q: 'angle', unit: '°', value: 5, signed: true, min: -85, max: 85, tex: '\\Delta\\lambda' }
      },
      solveFor: 'y',
      note: 'The foot lies further from the equator than the latitude itself: 4459.8 km against 4448.0 km for the arc to 40° N. Valid for |Δλ| < 90°.'
    },
    {
      name: 'Area scale',
      expr: 's = 1/cos(x/R)',
      tex: 's = \\sec\\frac{x}{R_\\oplus}',
      vars: {
        s: { name: 'area scale (map area ÷ true area), equal to the scale along the central direction' },
        x: { name: 'distance from the central meridian', q: 'length', unit: 'km', value: 500, min: 0, max: 5000 },
        R: { const: 'Rearth' }
      },
      solveFor: 's',
      note: '1.0031 at 500 km, 1.0124 at 1000 km. For a country 1000 km wide centred on the central meridian the largest error is 0.3 %.'
    }
  ],
  examples: [
    {
      title: 'Plotting a place',
      q: 'A place lies at 40° N and 5° east of the central meridian. Where is it in Cassini coordinates, and what is the area scale there?',
      steps: [
        { text: 'The perpendicular distance:', tex: 'x = R\\arcsin(\\cos 40°\\sin 5°) = 6371\\times\\arcsin(0.06677) = 425.7\\ \\text{km}' },
        { text: 'The distance along the central meridian to the foot:', tex: 'y = R\\arctan\\frac{\\tan 40°}{\\cos 5°} = 6371\\times 0.7000 = 4459.8\\ \\text{km}' },
        { text: 'The area scale:', tex: 's = 1/\\cos(425.7/6371) = 1.0022' }
      ],
      a: 'x = 425.7 km east of the central meridian, y = 4459.8 km north of the equator (the arc to 40° N would be 4448 km); area 0.2 % too large.'
    },
    {
      title: 'How wide a strip?',
      q: 'The area error of a Cassini map must stay below 0.1 %. How far from the central meridian may the map extend?',
      steps: [
        { text: 'Set $\\sec(x/R) = 1.001$:', tex: 'x/R = \\arccos(1/1.001) = 0.0447\\ \\text{rad}' },
        { text: 'So', tex: 'x = 6371\\times 0.0447 = 285\\ \\text{km}.' }
      ],
      a: '285 km each side, a strip 570 km wide: a country such as the Netherlands, or England south of the Humber, fits.'
    }
  ],
  quiz: [
    { q: 'Cassini’s projection is equidistant along', choices: ['every parallel', 'the central meridian and every great circle perpendicular to it', 'every meridian', 'the equator only'], a: 1, why: 'Both coordinates are true lengths: x along the perpendicular great circle, y along the central meridian.' },
    { q: 'At the equator, how does x depend on the longitude from the central meridian?', choices: ['x = R Δλ (true)', 'x = R sin Δλ', 'x = R tan Δλ', 'x = R ln tan(45° + Δλ/2)'], a: 0, why: 'On the equator cos φ = 1 and sin(x/R) = sin Δλ, so x = R Δλ.' },
    { q: 'At 500 km from the central meridian the area scale of Cassini’s map is about', answer: 1.003, why: 'sec(500/6371) = 1.0031.' },
    { q: 'Cassini’s projection preserves angles.', a: false, why: 'The scale perpendicular to the central meridian is 1 and parallel to it sec(x/R); the two differ away from the central meridian, so the map is not conformal.' },
    { q: 'A hemisphere centred on the central meridian becomes', choices: ['a circle', 'a square of side πR', 'a strip of infinite height', 'a rectangle 2 : 1'], a: 1, why: 'x ranges over ±πR/2 and y over ±πR/2: a square of side πR, whose top and bottom edges are the images of the points 90° from the central meridian.' }
  ],
  applications: [
    'The great survey of France: the “Carte de Cassini” (about 1750–1790), at 1 : 86 400 in 182 sheets, built on the Paris meridian and the perpendicular distances from it, and the model of national topographical surveys.',
    'Cadastral grids of narrow countries or states: the Cassini–Soldner grids of Bavaria and other German states, of peninsular Malaysia’s states, and of Palestine (the Palestine Grid, 1923) — used for property surveys for decades.',
    'Maps of long narrow strips, along a central line: railways, rivers, coastlines, pipelines, where the great circle perpendicular to the track is the natural coordinate.',
    'Teaching: a map whose two coordinates are simply two distances measured on the globe, and so one that can be drawn from a globe and a string.'
  ],
  history: 'César-François Cassini de Thury introduced the projection in 1745 for the topographic survey of France that he directed; the 182 sheets of the *carte de Cassini* were finished in 1789 under his son. Johann Georg von Soldner gave the formulas for the ellipsoid in 1810, for the Bavarian survey, so the projection for the ellipsoid is called Cassini–Soldner. It was superseded for most mapping by the transverse Mercator in the twentieth century, because that map is conformal, but it remains the projection of many old cadastral grids.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the Cassini projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Survey of Israel, documentation of the Old Israeli Grid (the Palestine Grid of 1923, a Cassini–Soldner projection).'],
  sim: { id: 'cy-compare', params: { proj: 'cassini' } },
  construction: 'cy-cassini-grid'
},

{
  id: 'central-cylindrical-projection',
  parent: 'cylindrical-family',
  title: 'The central cylindrical projection',
  level: 2,
  short: 'The light at the centre of the globe, the cylinder round the equator: y = R tan φ. The pure perspective cylinder, which Mercator’s map is often mistaken for. It stretches the north-south scale as sec² φ, puts the poles at infinity, and is the geometry of the rotating panoramic camera.',
  keywords: ['central cylindrical', 'perspective cylindrical', 'cylindrical panorama', 'R tan φ', 'Mercator mistaken', 'panoramic camera', 'sec squared', 'gnomonic cylinder', 'four-point perspective'],
  prereq: ['cylindrical-projections', 'central-projection', 'gnomonic-projection'],
  related: ['mercator-projection', 'miller-and-gall-stereographic', 'lambert-cylindrical-equal-area', 'cylindrical-panoramas', 'four-point-perspective', 'panoramas-and-360'],
  body: `Imagine a light at the very centre of the globe and, round the equator, a cylinder of paper. The shadow of every point of the globe falls on the cylinder along the ray from the centre. Cut the cylinder open along a meridian and flatten it: that is the **central cylindrical projection**, the *obvious* cylindrical map, the one that anyone would draw first. The ray from the centre through the point of latitude $\\varphi$ meets the cylinder at the height $R\\tan\\varphi$ above the equator, and the meridians are, as on every cylinder, equally spaced:
$$x = R\\,(\\lambda - \\lambda_0), \\qquad y = R\\tan\\varphi.$$

### How it stretches
The scale along a parallel is $k = \\sec\\varphi$, as on every tangent cylinder. The scale along a meridian is $h = \\mathrm{d}y/(R\\,\\mathrm{d}\\varphi) = \\sec^2\\varphi$, which is $k^2$. So at 60° the parallels are doubled and the meridians quadrupled in length; the area scale is $hk = \\sec^3\\varphi$, 8 at 60°, 25 at 70°. Tissot's indicatrix is an ellipse with its long axis along the meridian, tall and thin, whereas on Mercator's map it is a circle. The poles are at infinity ($\\tan 90° = \\infty$), so the map must be cut: a latitude of 70° is already at $y = 2.75R$, and 80° at 5.7$R$. The map is neither conformal nor equal-area, and has no use for measurement.

### Why it is not Mercator
Mercator's map is often described as “a cylinder with a light at the centre”. It is not: the central cylinder grows as $\\sec^2$, Mercator's as $\\sec$ (the logarithm of the tangent of the half-colatitude). The two agree only to the second order near the equator: the heights at 50° are 119.2 for the central cylinder and 101.1 for Mercator, and by 70° they are $2.75R$ against $1.74R$. Mercator's map has no projective construction at all; its parallels are placed by a calculation that makes the east–west and north–south stretches equal.

### The geometry of the panorama
A camera that turns on a vertical axis while a vertical slit of film moves behind it records exactly this map of the surroundings: every vertical line of the scene stays vertical and straight, equal horizontal angles are equal widths, and the height of a point seen at elevation $\\varphi$ above the horizon is $f\\tan\\varphi$, with $f$ the distance from the lens to the film cylinder. A *cylindrical panorama* from stitched photographs is the same picture, which is why horizons on such panoramas bow and the tall buildings at the edges lean outward at the top and bottom: that is the sec² stretch. In the app's language, it is the four-point perspective of curved pictures.

### Drawing it
Side view: a ray from the centre through each point of the circle meets the vertical line of the cylinder at its height. The T-square carries the heights over the unrolled sheet; the dividers set off the meridians. The construction cuts the map at 70° and compares with Mercator.

> [!tip] The gnomonic projection is the same light at the centre, with a plane in place of the cylinder. A plane and a cylinder touching the globe along the same line agree along that line, and part company sideways: the plane keeps straight lines, the cylinder keeps equal angles of longitude.`,
  ideas: [
    'The light is at the centre of the globe and the cylinder touches the equator: y = R tan φ, x = R λ.',
    'The scale is sec φ along the parallels and sec² φ along the meridians, so areas grow as sec³ φ (8 at 60°, 25 at 70°) and the poles are at infinity.',
    'It is a true perspective, but nothing else; it is not Mercator, whose heights are R ln tan(45° + φ/2) and grow only as sec φ.',
    'It is the geometry of a rotating panoramic camera and of the cylindrical panorama: vertical lines stay vertical, and the height of a point is f tan φ.'
  ],
  pitfalls: [
    'Mercator’s map is a projection from the centre of the globe onto a cylinder — That is the central cylindrical map. Mercator’s ordinate is the integral of sec φ, and has no light and no ray.',
    'The central cylindrical map is a good map because it is a real projection — A perspective projection says nothing about how well it keeps shapes or areas. This one is among the worst-behaved cylindrical maps, with sec³ φ for the area.',
    'The map can be drawn up to the poles if the sheet is large — The ordinate R tan φ tends to infinity at 90°: no sheet will do. The map is always cut, here at 70°.'
  ],
  formulas: [
    {
      name: 'Height of a parallel',
      expr: 'y = R*tan(phi)',
      tex: 'y = R\\tan\\varphi',
      vars: {
        y: { name: 'height above the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, signed: true, min: -85, max: 85, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'R = 100 mm: 57.7 at 30°, 173.2 at 60°, 274.7 at 70°, 567 at 80°. Mercator’s corresponding heights are 54.9, 131.7, 173.5 and 243.6.'
    },
    {
      name: 'Area scale',
      expr: 'A = 1/cos(phi)^3',
      tex: 'A = \\sec^3\\varphi',
      vars: {
        A: { name: 'area scale (map area ÷ true area)' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' }
      },
      solveFor: 'A',
      note: 'The scale along the parallels is sec φ and along the meridians sec² φ; the product is sec³ φ: 1.5 at 30°, 8 at 60°, 25 at 70°.'
    },
    {
      name: 'Height in a cylindrical panorama',
      expr: 'y = f*tan(phi)',
      tex: 'y = f\\tan\\varphi',
      vars: {
        y: { name: 'height of the image of a point above the horizon line', q: 'length', unit: 'mm', signed: true },
        f: { name: 'distance from the lens to the cylinder of film (the focal length)', q: 'length', unit: 'mm', value: 35 },
        phi: { name: 'elevation above the horizon', q: 'angle', unit: '°', value: 20, signed: true, min: -80, max: 80, tex: '\\varphi' }
      },
      solveFor: 'y',
      note: 'With f = 35 mm a point 20° above the horizon is 12.7 mm above the horizon line. Horizontally, a 30° turn of the camera moves the image by f × 0.5236 = 18.3 mm along the cylinder.'
    }
  ],
  examples: [
    {
      title: 'Central cylinder against Mercator',
      q: 'For a globe of radius R = 100 mm, how far from the equator are the parallels 60° and 70° on the central cylindrical map, and how much more than on Mercator’s map?',
      steps: [
        { text: 'Central: $y = R\\tan\\varphi$.', tex: 'y_{60} = 173.2\\ \\text{mm},\\quad y_{70} = 274.7\\ \\text{mm}' },
        { text: 'Mercator: $y = R\\ln\\tan(45° + \\varphi/2)$.', tex: 'y_{60} = 131.7\\ \\text{mm},\\quad y_{70} = 173.5\\ \\text{mm}' },
        'The ratio is 1.32 at 60° and 1.58 at 70°, and grows without limit towards the pole.'
      ],
      a: '173.2 and 274.7 mm against 131.7 and 173.5 mm: the central cylinder is already 58 % taller than Mercator’s at 70°.'
    },
    {
      title: 'The shape of a circle',
      q: 'On a central cylindrical map, what is the image of a small circle of radius 100 km at 60° N?',
      steps: [
        'East–west scale $k = \\sec 60° = 2$; north–south scale $h = \\sec^2 60° = 4$.',
        { text: 'An ellipse with semi-axes', tex: '200\\ \\text{km (east–west)}\\ \\text{and}\\ 400\\ \\text{km (north–south)}.' },
        'Area scale $hk = 8$.'
      ],
      a: 'A tall ellipse, 200 km wide and 400 km high, eight times the area of the circle.'
    }
  ],
  quiz: [
    { q: 'The scale along the meridians of the central cylindrical map at latitude φ is', choices: ['sec φ', 'sec² φ', 'cos φ', '1'], a: 1, why: 'y = R tan φ, so dy/dφ = R sec² φ.' },
    { q: 'At 60° latitude the area scale of the central cylindrical map is', answer: 8, why: 'sec³ 60° = 8.' },
    { q: 'Mercator’s map is the projection obtained by putting a light at the centre of the globe.', a: false, why: 'That is the central cylindrical projection. Mercator’s ordinate is the integral of sec φ.' },
    { q: 'Where is the pole on the central cylindrical map?', choices: ['at y = R', 'at y = πR/2', 'at infinity', 'at the equator'], a: 2, why: 'tan 90° is infinite: no finite sheet can show the pole.' },
    { q: 'In a cylindrical panorama (the central cylindrical projection of the scene), which lines of the world stay straight?', choices: ['all straight lines', 'vertical lines', 'horizontal lines', 'none'], a: 1, why: 'A vertical line lies in a plane through the axis of the cylinder, and that plane cuts the cylinder in a vertical line. Horizontal lines other than the horizon curve, and so do all slanting ones.' }
  ],
  applications: [
    'Panoramic photography: rotating-slit and swing-lens cameras of the early twentieth century, and the “cylindrical” mode of panorama stitching software, produce exactly this projection.',
    'Spherical imaging pipelines, where a cylindrical strip is a stage between the camera images and the final equirectangular picture.',
    'Teaching perspective: it makes the point that the surface on which a picture is formed (plane, cylinder, sphere) decides which lines stay straight: here verticals do, horizontals curve.',
    'Cartography as a warning: the central cylinder is the first map that anybody draws, and showing why it is a poor one explains what Mercator and Lambert actually did.'
  ],
  history: 'No inventor of the central cylindrical map is recorded; it follows directly from the idea of projecting from the centre onto any developable surface, and the gnomonic plane projection is much older. Its practical use began with the cameras that record a panorama on a cylinder: from the nineteenth century onward, rotating panoramic cameras (the Cirkut camera of 1904 is the best known) recorded the horizon on a long strip of film as the instrument turned, and made it a picture format of its own. As a map it was used mostly in textbooks, to warn against mistaking it for Mercator’s.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the section on the central cylindrical projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Rudolf Kingslake, *A History of the Photographic Lens* (1989), on panoramic cameras.'],
  sim: { id: 'cy-cylinder-lab', params: { proj: 'central-cylindrical' } },
  construction: 'cy-central-cylinder'
}
);
