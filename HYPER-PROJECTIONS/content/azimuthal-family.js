/* HYPER-PROJECTIONS · content/azimuthal-family.js — the azimuthal map projections.
 *
 *   azimuthal-projections            the family: bearing true, distance from the centre a function of the angular distance
 *   gnomonic-projection              the light at the centre of the globe: great circles straight
 *   stereographic-projection         the light at the antipode: angles true, circles stay circles
 *   orthographic-map-projection      the light at infinity: the globe as seen from far away
 *   azimuthal-equidistant-projection distances and bearings from the centre true
 *   lambert-azimuthal-equal-area     areas true
 *   vertical-perspective-projection  the view from a satellite
 *   two-point-equidistant-projection true distances from two chosen points
 * Sphere of radius R throughout; c is the angular distance from the centre of the map, θ the bearing from it.
 */
Hyper.add(
{
  id: 'azimuthal-projections',
  parent: 'azimuthal-family',
  title: 'Azimuthal projections',
  level: 1,
  short: 'Maps drawn on a plane that touches the globe at one point: every direction from that point is true, and the distance from it on the map depends only on the angular distance on the globe. Five choices of that dependence give the five classical maps.',
  keywords: ['azimuthal', 'zenithal', 'planar projection', 'tangent plane', 'azimuth', 'bearing', 'angular distance', 'polar aspect', 'oblique aspect', 'centre of the map'],
  prereq: ['why-the-sphere-cannot-be-flattened', 'developable-surfaces', 'aspects-of-a-projection'],
  related: ['gnomonic-projection', 'stereographic-projection', 'orthographic-map-projection', 'azimuthal-equidistant-projection', 'lambert-azimuthal-equal-area', 'tissot-indicatrix', 'great-circles-and-rhumb-lines'],
  body: `Lay a flat sheet against the globe so that it touches at one point, the **centre of the map**. Every other place has two numbers relative to that point: its **bearing** $\\theta$ (the compass direction, clockwise from north, in which you would set out to reach it) and its **angular distance** $c$ (how far away it is, measured as an angle at the centre of the Earth, so that $c = d/R$). An *azimuthal* projection keeps the bearing exactly, and only chooses how the angular distance is turned into a length on the sheet. That is the whole family: a polar plot in which the angle is true and the radius is some function $\\rho = f(c)$.

### The formulas
With the centre at $(\\varphi_0, \\lambda_0)$ and a place at $(\\varphi, \\lambda)$,
$$\\cos c = \\sin\\varphi_0\\sin\\varphi + \\cos\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0), \\qquad \\tan\\theta = \\frac{\\cos\\varphi\\,\\sin(\\lambda-\\lambda_0)}{\\cos\\varphi_0\\sin\\varphi - \\sin\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0)},$$
$$x = \\rho\\sin\\theta, \\qquad y = \\rho\\cos\\theta \\qquad (\\text{north up}).$$
The five classical maps differ only in $\\rho = f(c)$:

| Projection | $\\rho$ | The light | What it keeps |
|---|---|---|---|
| gnomonic | $R\\tan c$ | at the centre of the globe | great circles are straight |
| stereographic | $2R\\tan(c/2)$ | at the antipode | angles (conformal) |
| orthographic | $R\\sin c$ | at infinity | the globe as seen from afar |
| azimuthal equidistant | $R\\,c$ | none: the arc laid straight | distances from the centre |
| Lambert equal-area | $2R\\sin(c/2)$ | none: the chord swung down | areas |

The first three are true perspective projections: a light on the axis through the centre of the map casts the globe's points onto the plane. With the light at a distance $sR$ behind the centre of the globe, $\\rho = R(s+1)\\sin c/(s+\\cos c)$; $s=0$ is the gnomonic map, $s=1$ the stereographic, and $s\\to\\infty$ the orthographic. (The first simulation below slides the light for you.) Put the light in front of the globe instead and you have the view from a satellite, the [[vertical-perspective-projection|vertical perspective]].

### What the family keeps and loses
At the centre the map is perfect. Away from it, two scale factors separate: $h = \\mathrm{d}\\rho/(R\\,\\mathrm{d}c)$ along a radius and $k = \\rho/(R\\sin c)$ across it. The map is conformal if $h=k$ (only the stereographic), equal-area if $hk=1$ (only Lambert's), and true in distance along radii if $h=1$ (the equidistant). Tissot's indicatrix, the image of a small circle of the globe, is a circle at the centre and an ellipse elsewhere, its axes lying along the radius and across it with the lengths $h$ and $k$. No azimuthal map can be two of these at once, and the distortion grows with the distance from the centre. So the centre is chosen where the interest is.

### Aspects
With the centre at a pole (the **polar** aspect) meridians are straight radii and parallels are circles about the centre, whichever projection. With the centre on the equator (**equatorial**) and anywhere else (**oblique**) the graticule is made of curves, though in the gnomonic map the meridians stay straight and in the stereographic map every curve is a circle. All five pages that follow show how each graticule is drawn by hand.

> [!tip] One side view of the globe, cut through the centre of the map and a place, gives the radius for all five projections at once. The construction below draws them together; every later page uses it.`,
  ideas: [
    'Every azimuthal map is a polar plot: the bearing of a place from the centre of the map is true, and its distance from the centre depends only on its angular distance c, as ρ = f(c).',
    'The five classical maps are five choices of f: R tan c (gnomonic), 2R tan(c/2) (stereographic), R sin c (orthographic), R c (equidistant) and 2R sin(c/2) (Lambert).',
    'The first three are shadows of the globe cast by a light at its centre, at its antipode and at infinity; the position of the light is the one parameter that turns each into the next.',
    'At the centre of the map there is no distortion at all; away from it the scale along a radius (h) and across it (k) separate, and each projection decides what to keep.'
  ],
  pitfalls: [
    'An azimuthal map shows all directions truly — Only directions measured from the centre of the map are true. A line joining two other places is not a great circle and its angle with the meridians means nothing on its own.',
    'An azimuthal map is a polar map — The centre can be any point. The polar, equatorial and oblique aspects use the same function ρ = f(c); only the shape of the graticule changes.',
    'Any azimuthal map can show the whole world — Only the equidistant and Lambert maps draw the whole sphere in a finite disc; the stereographic needs an infinite plane for the last point, and the gnomonic and orthographic maps cannot reach beyond a hemisphere.'
  ],
  formulas: [
    {
      name: 'Angular distance between two places',
      expr: 'c = acos(sin(p0)*sin(p1) + cos(p0)*cos(p1)*cos(dl))',
      tex: 'c = \\arccos\\left(\\sin\\varphi_0 \\sin\\varphi_1 + \\cos\\varphi_0 \\cos\\varphi_1 \\cos\\Delta\\lambda\\right)',
      vars: {
        c: { name: 'angular distance', q: 'angle', unit: '°', min: 0, max: 180 },
        p0: { name: 'latitude of the centre', q: 'angle', unit: '°', value: 51.5, signed: true, min: -90, max: 90, tex: '\\varphi_0' },
        p1: { name: 'latitude of the place', q: 'angle', unit: '°', value: 35.7, signed: true, min: -90, max: 90, tex: '\\varphi_1' },
        dl: { name: 'difference of longitude', q: 'angle', unit: '°', value: 139.8, signed: true, min: -180, max: 180, tex: '\\Delta\\lambda' }
      },
      solveFor: 'c',
      note: 'The spherical law of cosines. London (51.5° N) to Tokyo (35.7° N, 139.8° east of London) gives 86.0°, or 9560 km on the ground.'
    },
    {
      name: 'Radius with the light a distance s R behind the centre',
      expr: 'rho = R*(s + 1)*sin(c)/(s + cos(c))',
      tex: '\\rho = R\\,\\frac{(s+1)\\sin c}{s + \\cos c}',
      vars: {
        rho: { name: 'distance from the centre on the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        s: { name: 'light position (0 gnomonic, 1 stereographic, large orthographic)', value: 1, min: 0, max: 200 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 60, min: 1, max: 89 }
      },
      solveFor: 'rho',
      note: 's = 0: ρ = R tan c.  s = 1: ρ = 2R tan(c/2).  s very large: ρ = R sin c. For s < 1 the picture ends before c reaches 90°; keep c below 90° here.'
    },
    {
      name: 'Length on the ground from the angular distance',
      expr: 'd = R*c',
      tex: 'd = R_\\oplus\\,c',
      vars: {
        d: { name: 'distance on the ground', q: 'length', unit: 'km' },
        R: { const: 'Rearth' },
        c: { name: 'angular distance', q: 'angle', unit: '°', value: 30, min: 0, max: 180 }
      },
      note: 'One degree of arc is 111.2 km; the ring of the equidistant map at c is a circle drawn at this distance.'
    }
  ],
  examples: [
    {
      title: 'One place, five maps',
      q: 'A place lies 60° from the centre of the map. With a globe of radius R = 100 mm, how far from the centre is it drawn in each of the five classical projections?',
      steps: [
        { text: 'Gnomonic (light at the centre):', tex: '\\rho = R\\tan 60° = 173.2\\ \\text{mm}' },
        { text: 'Stereographic (light at the antipode):', tex: '\\rho = 2R\\tan 30° = 115.5\\ \\text{mm}' },
        { text: 'Equidistant (the arc laid straight, $c = \\pi/3$):', tex: '\\rho = R\\,c = 104.7\\ \\text{mm}' },
        { text: 'Lambert equal-area (the chord from the centre of the map to the place):', tex: '\\rho = 2R\\sin 30° = 100.0\\ \\text{mm}' },
        { text: 'Orthographic (light at infinity):', tex: '\\rho = R\\sin 60° = 86.6\\ \\text{mm}' }
      ],
      a: '173.2, 115.5, 104.7, 100.0 and 86.6 mm: the same place moves 87 mm outward as the light moves in from infinity to the centre of the globe.'
    },
    {
      title: 'Tokyo on a map centred on London',
      q: 'On an azimuthal equidistant map centred on London (51.5° N, 0.1° W) with R = 50 mm, where is Tokyo (35.7° N, 139.7° E)? Give its distance from the centre, its bearing, and its coordinates on the sheet.',
      steps: [
        'Angular distance by the law of cosines: $\\cos c = \\sin 51.5°\\sin 35.7° + \\cos 51.5°\\cos 35.7°\\cos 139.8° = 0.0710$, so $c = 85.96° = 1.500$ rad (9558 km).',
        'Bearing from London: $\\theta = 31.7°$ east of north (the great circle sets out towards north-east, over Scandinavia and Siberia).',
        { text: 'Equidistant radius, then the coordinates:', tex: '\\rho = Rc = 75.0\\ \\text{mm},\\quad x = \\rho\\sin\\theta = 39.4\\ \\text{mm},\\quad y = \\rho\\cos\\theta = 63.8\\ \\text{mm}' }
      ],
      a: '75.0 mm from London, 39.4 mm to the right and 63.8 mm above it, along a straight line that is also the great circle.'
    }
  ],
  quiz: [
    { q: 'Which of these is the same in every azimuthal projection about a given centre?', choices: ['the radius of a ring of equal distance', 'the bearing of a place from the centre', 'the area of Greenland', 'the length of a degree of longitude'], a: 1, why: 'All azimuthal maps keep the direction from the centre. They differ in ρ = f(c), so radii, areas and lengths all change from one to another.' },
    { q: 'With R = 100 mm, a place 90° from the centre is drawn at what distance from the centre in Lambert’s azimuthal equal-area map?', answer: 141.4, unit: 'mm', why: 'ρ = 2R sin(c/2) = 200 sin 45° = 141.4 mm, the radius of the disc that has the area of a hemisphere, 2πR².' },
    { q: 'The gnomonic projection can draw the whole sphere on a finite sheet.', a: false, why: 'ρ = R tan c grows without limit as c approaches 90°: at 80° it is already 5.7 R. The gnomonic map shows less than a hemisphere.' },
    { q: 'Which of these is not a perspective projection?', choices: ['stereographic', 'gnomonic', 'azimuthal equidistant', 'orthographic'], a: 2, why: 'The equidistant map is built by unrolling the arc, not by projecting along rays from a light. The other three are shadows from the centre, the antipode and infinity.' },
    { q: 'In a certain azimuthal map the scale along every radius is exactly 1 but the scale across a ring grows with the distance from the centre. Which map is it?', choices: ['gnomonic', 'azimuthal equidistant', 'Lambert equal-area', 'orthographic'], a: 1, why: 'ρ = R c has dρ/dc = R (so h = 1) and k = c / sin c, which grows from 1 at the centre to π/2 at 90° and without limit at 180°.' }
  ],
  applications: [
    'Hemisphere and polar atlas maps: the north polar region in the Lambert or stereographic form, a hemisphere in the equatorial form, are the usual atlas maps of the Arctic and Antarctic.',
    'Range-and-bearing maps centred on a place: a radio amateur’s beam map, an airline route map from its hub, the epicentre distance charts of seismology. Distance and direction from the centre are what these readers need.',
    'Star charts and sky domes: the sky seen from the observer’s place is an azimuthal map (stereographic in the astrolabe and planisphere, equidistant in the dome of a planetarium).',
    'Crystallography and structural geology: orientations of crystal faces or rock planes are plotted on stereographic (equal-angle) and Lambert (equal-area) nets, which are azimuthal maps of the sphere of directions.',
    'Cameras and computer graphics: a rectilinear lens records the gnomonic projection of the sphere of directions, and every face of a cube map is a gnomonic map.'
  ],
  history: 'The perspective members of the family are the oldest maps of the sphere. Greek astronomers drew star charts with them: Hipparchus used the stereographic and orthographic forms in the second century BC, the gnomonic form is attributed to Thales, and Ptolemy’s *Planisphaerium* of the second century AD is the earliest surviving account of the stereographic projection. The equidistant polar map appears in the work of al-Biruni around the year 1000, and Guillaume Postel’s polar world map of 1581 brought it to Europe. Johann Heinrich Lambert completed the picture in 1772, when he classified the ways of mapping the sphere by what they keep and gave the azimuthal equal-area projection.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on azimuthal projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'J. H. Lambert, *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772), translated by W. R. Tobler (1972).'],
  sim: ['az-light-position', { id: 'az-map-lab', params: { proj: 'azimuthal-equidistant' } }],
  construction: 'az-azimuthal-radii'
},

{
  id: 'gnomonic-projection',
  parent: 'azimuthal-family',
  title: 'The gnomonic projection',
  level: 2,
  short: 'The globe projected from its own centre onto a tangent plane: every great circle becomes a straight line, so the shortest route between two places is drawn with a ruler. The price is that it cannot reach the horizon and stretches fast away from the centre.',
  keywords: ['gnomonic', 'great circle', 'shortest route', 'tangent plane', 'central projection', 'sundial', 'rectilinear', 'cube map', 'R tan c'],
  prereq: ['azimuthal-projections', 'great-circles-and-rhumb-lines', 'tissot-indicatrix'],
  related: ['stereographic-projection', 'mercator-projection', 'central-cylindrical-projection', 'aviation-and-polar-routes', 'rectilinear-lens', 'sundials-as-projections', 'cube-map-of-the-earth'],
  body: `Put a light at the centre of a glass globe and hold a flat sheet against it at one point. The shadow of every meridian and parallel falls on the sheet: that is the **gnomonic projection**. The name comes from the *gnomon*, the shadow-casting rod of a sundial, because the sundial's plate is exactly this map of the sky.

### The one great property
A great circle is the intersection of the globe with a plane through its centre. The light is at the centre, so the rays through a great circle all lie in that plane, and the plane meets the map sheet in a **straight line**. So every great circle is a straight line, and the shortest route between any two places is the line joining them. No other map has that property for all routes. Rhumb lines, courses of constant bearing, become curves, so a navigator plots the route on a gnomonic chart, reads off its waypoints, and carries them to a [[mercator-projection|Mercator chart]] to steer by.

### The formula
With $c$ the angular distance from the centre of the map and $\\theta$ the bearing,
$$\\rho = R\\tan c, \\qquad x = \\rho\\sin\\theta, \\quad y = \\rho\\cos\\theta.$$
The meridians are straight lines in every aspect. In the polar aspect the parallels are circles of radius $R\\tan(90°-\\varphi)$; in the equatorial aspect the meridians are parallel verticals at $x = R\\tan\\Delta\\lambda$ and the parallels (except the equator) are hyperbolas; in the oblique aspect they are ellipses, parabolas or hyperbolas, since the image of a circle under a central projection is a conic.

### What it loses
The radial scale is $h = \\sec^2 c$ and the sideways scale is $k = \\sec c$, so the area scale is $\\sec^3 c$. At 30° from the centre areas are already 1.5 times too large, at 60° eight times, and at 90° the map is infinite: the horizon is the one circle that never reaches the plane. In practice a gnomonic map shows a cap of 60° to 70° radius. Tissot's indicatrix is an ellipse whose long axis lies along the radius ($h/k = \\sec c$): at 60° from the centre it is twice as long as it is wide. The map keeps no angles and no areas; it exists for its straight lines.

### How it is drawn
Side view of the globe, the tangent plane as a vertical line at the centre point: a ray from the centre through the point at colatitude $c$ meets the plane at the height $R\\tan c$. Carry those heights to the plan as radii and the polar graticule is a set of concentric circles with straight radii; a great circle between two places is a ruler line. The construction does exactly that.

> [!fact] Every flat photograph is a gnomonic map. A camera with an ideal rectilinear lens records the directions in front of it on a flat sensor along straight rays through the lens centre: straight lines stay straight, which is why architecture looks right. The same stretching at the edge is what makes very wide-angle rectilinear pictures look distorted.`,
  ideas: [
    'The light is at the centre of the globe; every great circle lies in a plane through the light, so it falls on the map as a straight line.',
    'ρ = R tan c: the radius grows without limit as c approaches 90°, so the map shows less than a hemisphere (60° to 70° is usual).',
    'Radial scale sec² c and sideways scale sec c: areas grow as sec³ c, eight-fold at 60° from the centre. Angles are not kept.',
    'It is the chart for planning shortest routes: draw the straight line, read the waypoints, and transfer them to a Mercator chart to steer.'
  ],
  pitfalls: [
    'A straight line on a gnomonic map is a course to steer — It is the shortest route, a great circle, whose bearing changes along the way. A constant compass course (a rhumb line) is a curve here.',
    'The gnomonic map can show the whole Earth if it is big enough — No size will do: the horizon circle is at infinite distance. Even 80° from the centre is 5.7 R out.',
    'The gnomonic and the central cylindrical projections are the same idea in different aspects — They share the light at the centre but use different surfaces: a plane touching at a point against a cylinder round the equator. Their distortions differ completely.'
  ],
  formulas: [
    {
      name: 'Radius of a ring on the gnomonic map',
      expr: 'rho = R*tan(c)',
      tex: '\\rho = R\\tan c',
      vars: {
        rho: { name: 'distance from the centre of the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 40, min: 0, max: 89 }
      },
      solveFor: 'rho',
      note: 'For the parallel of latitude φ in the polar aspect, c = 90° − φ: the 80° parallel is at 17.6 mm, the 60° at 57.7 mm, the 40° at 119.2 mm (R = 100).'
    },
    {
      name: 'Area scale of the gnomonic map',
      expr: 'A = 1/cos(c)^3',
      tex: 'A = \\sec^3 c',
      vars: {
        A: { name: 'area scale (map area ÷ true area)' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 60, min: 0, max: 89 }
      },
      note: 'The radial scale is sec² c and the sideways scale sec c; their product is sec³ c. At 60° the area is eight times too large.'
    },
    {
      name: 'Angular distance at which the map reaches a given radius',
      expr: 'c = atan(rho/R)',
      tex: 'c = \\arctan\\frac{\\rho}{R}',
      vars: {
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°' },
        rho: { name: 'radius on the sheet', q: 'length', unit: 'mm', value: 150 },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A sheet whose edge is 150 mm from the centre shows a cap of radius 56° when R = 100 mm.'
    }
  ],
  examples: [
    {
      title: 'The polar gnomonic graticule',
      q: 'A polar gnomonic map of the Arctic has R = 60 mm. Where are the parallels 80°, 70°, 60° and 50° N, and is the 40° parallel on a sheet 200 mm from the pole to the corner?',
      steps: [
        { text: 'Colatitude $c = 90° - \\varphi$ and $\\rho = R\\tan c$:', tex: '\\rho_{80} = 60\\tan 10° = 10.6,\\ \\rho_{70} = 21.8,\\ \\rho_{60} = 34.6,\\ \\rho_{50} = 50.3\\ \\text{mm}' },
        { text: 'The 40° parallel has $c = 50°$:', tex: '\\rho_{40} = 60\\tan 50° = 71.5\\ \\text{mm}' },
        'That is well inside 200 mm; the 30° parallel is at 103.9 mm and the 20° parallel at 164.9 mm, so a 200 mm sheet reaches about 17° N.'
      ],
      a: '10.6, 21.8, 34.6, 50.3 and (for 40° N) 71.5 mm from the pole. The rings spread faster and faster: each 10° of latitude takes more room than the one before.'
    },
    {
      title: 'How far has the map stretched?',
      q: 'A square of 100 km by 100 km lies 60° from the centre of a gnomonic map. How large does it appear, in the radial and sideways directions, and how many times larger is its area?',
      steps: [
        'Radial scale $h = \\sec^2 60° = 4$; sideways scale $k = \\sec 60° = 2$.',
        'The square becomes a rectangle 400 km (radial) by 200 km (sideways), as if measured on a map at the true scale.',
        'Area scale $= hk = 8$.'
      ],
      a: '4 times as long radially, twice as wide, eight times the area: the gnomonic map is a poor place to compare sizes.'
    }
  ],
  quiz: [
    { q: 'Why is a great circle a straight line on the gnomonic map?', choices: ['because the map is conformal', 'because the rays of the projection from the centre all lie in the plane of the great circle, which cuts the map plane in a line', 'because the sheet touches the globe along it', 'because its bearing never changes'], a: 1, why: 'The great circle lies in a plane through the centre of the globe, where the light is. All its projectors lie in that plane, and a plane meets a plane in a line.' },
    { q: 'At 60° from the centre of a gnomonic map the area scale is', answer: 8, why: 'The area scale is sec³ c = 1/cos³ 60° = 8.' },
    { q: 'On a gnomonic chart, a rhumb line (a course of constant bearing) between two distant places is straight.', a: false, why: 'Straight lines are great circles. A constant-bearing course crosses the meridians at a constant angle, which on the gnomonic map is a curve; on Mercator’s chart it is the straight one.' },
    { q: 'The polar gnomonic map has the 60° N parallel at 34.6 mm from the pole for R = 60 mm. Where is the 30° N parallel?', answer: 103.9, unit: 'mm', why: 'c = 60°, ρ = 60 tan 60° = 103.9 mm: the second 30° of latitude takes three times as much room as the first.' },
    { q: 'What is the image of a parallel of latitude on an equatorial gnomonic map?', choices: ['a straight line', 'a circle', 'a hyperbola (the equator excepted)', 'an ellipse'], a: 2, why: 'The parallel is a circle on the globe; a central projection of a circle is a conic. The cone from the centre through a parallel crosses the horizon plane parallel to the map, so the image is a hyperbola. The equator is a great circle and so a line.' }
  ],
  applications: [
    'Great-circle route planning: ocean and polar navigators and flight planners draw the shortest route as a straight line on a gnomonic chart and transfer waypoints to a Mercator or Lambert chart.',
    'Seismology and radio: the path of a wave through a spherical Earth, or of a radio signal along the ground, is a great circle, a straight line on the gnomonic map.',
    'Sundials: the dial plate of a sundial is a gnomonic map of the sky, the hour lines being straight because they are great circles through the celestial pole.',
    'Photography and graphics: the picture made by a rectilinear lens is a gnomonic map of directions, and the six faces of a cube map are six gnomonic maps of 90° each.',
    'Polyhedral maps of the Earth: projecting the globe from its centre onto the faces of a cube, an octahedron or an icosahedron gives maps whose pieces have straight lines for great circles.'
  ],
  history: 'The gnomonic projection is attributed to Thales of Miletus in the sixth century BC, who is said to have charted the stars with it, and its name recalls the gnomon of the Greek sundial. As a navigator’s chart it is much younger: charts for great-circle sailing, drawn gnomonically, came into use in the nineteenth century, when steamships could hold a straight course and the saving on an ocean crossing was worth the trouble of the transfer to Mercator’s chart.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the gnomonic projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Bowditch, *The American Practical Navigator*, the chapter on chart projections (gnomonic charts and great-circle sailing).'],
  sim: { id: 'az-light-position', params: { t: 0 } },
  construction: 'az-gnomonic-graticule'
},

{
  id: 'stereographic-projection',
  parent: 'azimuthal-family',
  title: 'The stereographic projection',
  level: 2,
  short: 'The globe projected from the point opposite the centre of the map: angles are true everywhere, and every circle of the sphere stays a circle on the map. The map of the astrolabe, of the polar regions, and of crystallographers.',
  keywords: ['stereographic', 'conformal', 'circles to circles', 'astrolabe', 'planisphere', 'UPS', 'Wulff net', 'Riemann sphere', 'antipode', 'little planet'],
  prereq: ['azimuthal-projections', 'conformal-maps', 'tissot-indicatrix'],
  related: ['orthographic-map-projection', 'gnomonic-projection', 'mercator-projection', 'the-astrolabe', 'the-planisphere', 'stereographic-fisheye', 'little-planet', 'crystallography-stereographic'],
  body: `Put the light on the globe itself, at the point **opposite** the centre of the map, and let the sheet touch the globe at the centre. Each point of the globe casts its shadow along the line from the light to the sheet. This is the **stereographic projection**, and it has two properties that nothing else in the family has:

- it is **conformal**: a small shape keeps its form, every angle between lines is true;
- every **circle** on the sphere, large or small, comes out as a circle on the map (a straight line, if the circle passes through the light).

### The formula
With $c$ the angular distance from the centre of the map,
$$\\rho = 2R\\tan\\frac{c}{2}, \\qquad h = k = \\sec^2\\frac{c}{2}.$$
The scale is the same in all directions, so Tissot's indicatrix is a circle everywhere, and it grows: 1.33 at 60° from the centre, 2 at 90°, without limit towards the antipode, which is the light itself. A hemisphere fits in the disc of radius $2R$; the other hemisphere spreads over the rest of an infinite plane. (If the plane is moved to cut through the centre of the globe, as on an astrolabe, the map is half the size and the equator is the circle of radius $R$.) Areas grow as $\\sec^4(c/2)$: four times too large at 90°.

### Why circles stay circles
The cone of rays from the light through a circle of the sphere is an oblique circular cone, and the map plane is parallel to the tangent plane at the light: that makes it a *subcontrary section* of the cone, which Apollonius proved to be a circle too. (The inscribed-angle theorem enters later, in the hand construction of the radii.) That property decides how the graticule is drawn: in the **polar** aspect the parallels are concentric circles of radius $2R\\tan(45°-\\varphi/2)$ and the meridians are radii; in the **equatorial** aspect the meridians are circles through both poles, the parallels circles that cross them at right angles, and only the central meridian and the equator are straight; the **oblique** aspect has circles only. All of them are drawn with the compass, and the construction shows both.

### Conformality at work
Because angles are true, a conformal map is the right choice wherever direction matters locally: navigators' charts of the polar regions, the maps of the Dutch national grid and the Universal Polar Stereographic grid, and the star plates of the astrolabe all use it. The Universal Polar Stereographic system multiplies the scale by 0.994, so that the true scale falls on the circle of 81.1° latitude rather than at the pole, and spreads the error better.

> [!fact] Take the plane through the equator and the pole becomes the origin of the complex plane: $z = \\cot(\\varphi/2)\\,e^{i\\lambda}$ maps the sphere onto the plane, and the great circles through the pole become the straight lines through the origin. That is the Riemann sphere, the picture on which the whole of complex analysis can be seen.`,
  ideas: [
    'The light sits at the antipode of the centre of the map: ρ = 2R tan(c/2), and the scale is the same in all directions, sec²(c/2).',
    'Angles are true everywhere (conformal) and every circle on the sphere is a circle on the map: the graticule of any aspect is drawn with the compass alone.',
    'A hemisphere fills the disc of radius 2R; the antipode is at infinity, so the whole sphere never fits on a finite sheet.',
    'The stereographic map is used wherever local shape and direction matter: polar charts, the astrolabe and planisphere, the Dutch grid, crystal and rock-orientation nets.'
  ],
  pitfalls: [
    'Conformal means areas are kept — It means angles and small shapes are kept. Areas grow as sec⁴(c/2): at 90° from the centre they are four times too large, and the whole map is only correct in shape.',
    'Circles on the sphere become circles on the map, so a circle’s centre goes to the centre of its image — The centre of the image circle is not the image of the centre. A circle round a place near the edge appears off-centre inside its own outline.',
    'The stereographic and orthographic maps are two views of one globe from different places — They look alike near the centre, but the light is at the antipode against at infinity, and they differ greatly near the horizon: stereographic stretches the rim, orthographic squeezes it.'
  ],
  formulas: [
    {
      name: 'Radius of a ring on the stereographic map',
      expr: 'rho = 2*R*tan(c/2)',
      tex: '\\rho = 2R\\tan\\frac{c}{2}',
      vars: {
        rho: { name: 'distance from the centre of the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 60, min: 0, max: 175 }
      },
      solveFor: 'rho',
      note: 'For the parallel φ in the polar aspect c = 90° − φ. The equator is at 2R, the 60° parallel at 53.6 mm, the 80° parallel at 17.5 mm (R = 100).'
    },
    {
      name: 'Scale factor of the stereographic map',
      expr: 'k = 1/cos(c/2)^2',
      tex: 'k = \\sec^2\\frac{c}{2}',
      vars: {
        k: { name: 'scale factor (the same in every direction)' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 0, max: 170 }
      },
      note: 'At 90° the scale is 2 and areas are 4 times too large. The UPS multiplies this by 0.994.'
    },
    {
      name: 'Polar radius of a parallel of latitude',
      expr: 'rho = 2*R*tan(pi/4 - phi/2)',
      tex: '\\rho = 2R\\tan\\left(\\frac{\\pi}{4} - \\frac{\\varphi}{2}\\right)',
      vars: {
        rho: { name: 'radius of the parallel on a polar map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 45, min: -80, max: 90, tex: '\\varphi' }
      },
      solveFor: 'rho',
      note: 'The same as 2R tan(c/2) with c = 90° − φ. For φ = −80° the radius is 11.4 R: the opposite pole is at infinity.'
    }
  ],
  examples: [
    {
      title: 'Drawing the polar stereographic map',
      q: 'A polar stereographic map of the northern hemisphere is to be drawn on the plane of the equator (so the equator is the circle of radius R = 100 mm). Where are the parallels 75°, 60°, 45° and 30° N?',
      steps: [
        { text: 'With the plane through the centre, $\\rho = R\\tan(c/2)$ with $c = 90° - \\varphi$:', tex: '\\rho_{75} = 100\\tan 7.5° = 13.2,\\ \\rho_{60} = 26.8,\\ \\rho_{45} = 41.4,\\ \\rho_{30} = 57.7\\ \\text{mm}' },
        'The equator itself is at 100 mm, so each parallel of 15° takes more room than the one before: 13.2, 13.6, 14.6, 16.3, 18.2 and finally 42.3 mm for the next 15° south.',
        'Each of these is the cut on the diameter made by the line from the south point of the rim to the mark at colatitude $c$ on the rim: the construction draws it without a table.'
      ],
      a: '13.2, 26.8, 41.4 and 57.7 mm from the pole, with the equator at 100 mm.'
    },
    {
      title: 'Where is the scale true on the UPS?',
      q: 'The Universal Polar Stereographic grid uses a scale factor 0.994 at the pole. At what latitude is the scale exactly 1?',
      steps: [
        'The scale at angular distance $c$ from the pole is $0.994\\sec^2(c/2)$. Set it to 1: $\\cos^2(c/2) = 0.994$.',
        { text: 'Then $c/2 = \\arccos\\sqrt{0.994} = 4.44°$, so', tex: 'c = 8.88°,\\qquad \\varphi = 90° - 8.88° = 81.12°.' }
      ],
      a: 'On the circle of latitude 81.1° (81°06′52″, in the manual). Inside it the scale is below 1, outside it above, never worse than 0.1 % in the region the grid covers.'
    }
  ],
  quiz: [
    { q: 'What is the image of a circle on the sphere, in the stereographic projection?', choices: ['an ellipse', 'a circle (or a straight line if it passes through the light)', 'a parabola', 'a circle only if it is centred on the centre of the map'], a: 1, why: 'The cone of rays from the light through a circle is a circular cone, and the plane is a subcontrary section of it: its section is a circle, or a line when the circle contains the light.' },
    { q: 'How many times is the area of a country 90° from the centre of the map magnified?', answer: 4, why: 'The scale is sec²(c/2) = 2 in both directions at c = 90°, so area is multiplied by 4.' },
    { q: 'A stereographic map can be drawn conformal and equal-area at once.', a: false, why: 'No map can be both except for the sphere itself: the scale would have to be 1 in all directions. The stereographic keeps angles and pays in area.' },
    { q: 'On a polar stereographic map with the plane through the equator (R = 100 mm), where is the 45° N parallel?', answer: 41.4, unit: 'mm', why: 'c = 45°, ρ = R tan(c/2) = 100 tan 22.5° = 41.4 mm.' },
    { q: 'Why is the stereographic projection the one used for the astrolabe?', choices: ['it keeps the stars in their true brightness', 'circles of the celestial sphere (horizon, almucantars, tropics) become circles that a compass can draw on a brass plate', 'it is the only projection whose scale is constant', 'it shows the whole sky as a finite disc'], a: 1, why: 'The horizon, the circles of equal altitude and the tropics are all circles of the sky, and stay circles. The whole plate could be made with a compass, and angles on it are true.' }
  ],
  applications: [
    'Polar charts and the UPS grid: above 84° N and below 80° S the military and civil grids switch from UTM to the polar stereographic.',
    'National grids: the Netherlands uses an oblique stereographic projection about Amersfoort (scale factor 0.9999079) for its Rijksdriehoek coordinates.',
    'Astrolabes and planispheres: the sky seen from the pole of the heavens, stereographically, is the rete and the plate of an astrolabe; angles between stars and circles on the sky are true.',
    'Crystallography and geology: the Wulff net is a stereographic projection of the sphere; the orientation of crystal faces or of a rock plane is plotted on it with true angles.',
    'Photography and graphics: the stereographic fisheye and the “little planet” picture are stereographic maps of the sphere of directions.'
  ],
  history: 'Hipparchus used the stereographic projection in the second century BC, and Ptolemy’s *Planisphaerium* is the earliest surviving text about it: the star plate of the astrolabe, in use for sixteen centuries, depends on it. The name comes from François d’Aguilon, who called it “stereographic” in his *Opticorum libri sex* of 1613, a book illustrated by Rubens. From the sixteenth to the eighteenth century the equatorial form made the standard double-hemisphere world maps of the atlases; Lambert in 1772 placed it, with Mercator’s map, among the conformal projections, and the polar form became the chart of the poles.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the stereographic projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Ptolemy, *Planisphaerium* (second century AD); James Evans, *The History and Practice of Ancient Astronomy* (1998), on the astrolabe and the stereographic projection.'],
  sim: { id: 'az-light-position', params: { t: 0.5 } },
  construction: ['az-stereographic-polar', 'az-stereographic-equatorial']
},

{
  id: 'orthographic-map-projection',
  parent: 'azimuthal-family',
  title: 'The orthographic projection',
  level: 2,
  short: 'The globe as the eye sees it from very far away: the rays are parallel and perpendicular to the sheet. One hemisphere is shown, true in the middle and squeezed to nothing at the rim; nothing is exactly kept, but the picture looks like the planet.',
  keywords: ['orthographic', 'globe view', 'parallel projection', 'hemisphere', 'limb', 'analemma', 'Vitruvius', 'planet disc', 'R sin c'],
  prereq: ['azimuthal-projections', 'orthographic-projection', 'aspects-of-a-projection'],
  related: ['stereographic-projection', 'vertical-perspective-projection', 'planetarium-domes', 'astronomy-and-planetary-maps', 'monge-method'],
  body: `Look at a globe from across a large room, or at the Moon through a telescope. The rays that reach your eye are almost parallel, and what you see is the globe projected perpendicularly onto a plane facing you. That is the **orthographic projection** of the sphere. It is exactly the front view of the drawing office, the same “orthographic projection” you will meet on the page about [[orthographic-projection|multiview drawing]], applied to a sphere: parallel projectors perpendicular to the picture plane.

### The formula
For a centre at $(\\varphi_0, \\lambda_0)$ and a place at $(\\varphi, \\lambda)$,
$$x = R\\cos\\varphi\\,\\sin(\\lambda-\\lambda_0), \\qquad y = R\\left[\\cos\\varphi_0\\sin\\varphi - \\sin\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0)\\right],$$
and the place is on the visible side only when $\\cos c = \\sin\\varphi_0\\sin\\varphi + \\cos\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0) \\ge 0$. In the azimuthal form, $\\rho = R\\sin c$, which reaches its maximum $R$ at $c = 90°$: the visible hemisphere fills a disc of radius $R$, whose edge is the **limb**. Points beyond the horizon would fall on top of the visible ones, so they are not drawn.

### The graticule in the three aspects
Polar aspect (centre at the pole): the parallels are circles of radius $R\\cos\\varphi$ and the meridians radii. Equatorial aspect: the parallels are *straight* horizontal lines at the height $R\\sin\\varphi$, and the meridians are ellipses with semi-axes $R\\sin\\Delta\\lambda$ and $R$. Oblique aspect: both are ellipses. A parallel of latitude $\\varphi$ is an ellipse with semi-axes $R\\cos\\varphi$ and $R\\cos\\varphi\\sin\\varphi_0$, its centre on the polar axis at the height $R\\sin\\varphi\\cos\\varphi_0$. Seen whole or in part, they are all halves of ellipses on the near side.

### What it keeps and loses
The radial scale is $h = \\cos c$ and the sideways scale is $k = 1$. At the centre the map is true; at 60° from it a distance along a radius is halved, at 80° it is 0.17 of the truth, and at the limb it vanishes: the countries along the rim are seen edge-on. Angles are not true, and areas shrink as $\\cos c$: Tissot's indicatrix is a circle at the centre and an ellipse elsewhere, of full width across the radius but only $\\cos c$ along it, a thin sliver near the rim. What the map does keep is the *look*: it shows the globe as a camera at a great distance would, so shapes near the rim look right to the eye, flattened in the way a real sphere is.

### How it is drawn
Monge's method: the globe in two views. With the axis vertical, the *side view* gives the heights of the parallels, $R\\sin\\varphi$, and the *plan* (the globe seen from the pole) gives the distance of each meridian from the central meridian, $R\\cos\\varphi\\sin\\lambda$, which is dropped down onto the side view. For the tilted globe, the parallels' ellipses are drawn by the auxiliary-circle method. Both constructions are on this page.

> [!history] Vitruvius, who wrote on architecture in the first century BC, describes the *analemma*, an orthographic diagram of the sky from which sundials were laid out. The name “orthographic” was proposed for it much later, in 1613.`,
  ideas: [
    'The rays are parallel and perpendicular to the sheet: the picture is what an eye infinitely far away would see, the front view of the globe.',
    'ρ = R sin c, so one hemisphere fills a disc of radius R; the limb (c = 90°) is the edge of the visible globe, beyond which nothing can be drawn.',
    'The radial scale is cos c and the sideways scale is 1: the map is true at the centre and squeezed to nothing at the rim, which is how a real globe looks.',
    'The equatorial aspect has straight parallels and elliptical meridians, the oblique aspect ellipses for both; each is drawn from the globe’s side view and plan.'
  ],
  pitfalls: [
    'The orthographic map is the view of the Earth from space — Almost: a real satellite is at a finite distance, and sees less than a hemisphere with the rim foreshortened differently. The orthographic is the limit of the vertical perspective as the viewpoint goes to infinity.',
    'It shows true distances at the centre, so it is a good map for measuring — Only at the centre: at 60° out, a degree along a radius is half as long, and the map has no scale at the rim.',
    'The orthographic map of the Earth and the orthographic view of an engineering drawing are unrelated — They are the same projection. The front view of a sphere in an engineering drawing is exactly this map.'
  ],
  formulas: [
    {
      name: 'Radius of a ring on the orthographic map',
      expr: 'rho = R*sin(c)',
      tex: '\\rho = R\\sin c',
      vars: {
        rho: { name: 'distance from the centre of the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 60, min: 0, max: 90 }
      },
      solveFor: 'rho',
      note: 'The limb is at ρ = R. For the parallel φ in the polar aspect, c = 90° − φ: the radius of the parallel on the map is R cos φ.'
    },
    {
      name: 'Radial scale',
      expr: 'h = cos(c)',
      tex: 'h = \\cos c',
      vars: {
        h: { name: 'scale along a radius (map length ÷ true length)' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 60, min: 0, max: 90 }
      },
      note: 'The sideways scale is exactly 1. At 80° from the centre a degree along a radius is only 0.17 of its length at the centre.'
    },
    {
      name: 'Minor axis of a parallel’s ellipse (oblique aspect)',
      expr: 'b = R*cos(phi)*sin(phi0)',
      tex: 'b = R\\cos\\varphi\\,\\sin\\varphi_0',
      vars: {
        b: { name: 'semi-minor axis of the ellipse of the parallel', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 90 },
        phi: { name: 'latitude of the parallel', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\varphi' },
        phi0: { name: 'latitude of the centre of the map', q: 'angle', unit: '°', value: 30, min: 0, max: 90, tex: '\\varphi_0' }
      },
      solveFor: 'b',
      note: 'The semi-major axis is R cos φ. When φ₀ = 0 (equatorial aspect) b = 0 and the parallel is a straight line; when φ₀ = 90° (polar aspect) b = a and it is a circle.'
    }
  ],
  examples: [
    {
      title: 'A place on a tilted globe',
      q: 'A globe of radius R = 100 mm is turned to centre on 30° N, 0° E. Where does the point 45° N, 60° E appear, and is it in view?',
      steps: [
        { text: 'Apply the formulas with $\\varphi_0 = 30°$, $\\varphi = 45°$, $\\Delta\\lambda = 60°$:', tex: 'x = 100\\cos 45°\\sin 60° = 61.2\\ \\text{mm}' },
        { text: 'The vertical position:', tex: 'y = 100\\left[\\cos 30°\\sin 45° - \\sin 30°\\cos 45°\\cos 60°\\right] = 100\\,(0.6124 - 0.1768) = 43.6\\ \\text{mm}' },
        'Visibility: $\\cos c = \\sin 30°\\sin 45° + \\cos 30°\\cos 45°\\cos 60° = 0.660 > 0$, so $c = 48.8°$: the place is well inside the limb.'
      ],
      a: '61.2 mm right of the centre and 43.6 mm above it, 48.8° from the centre of the map, in view.'
    },
    {
      title: 'How squeezed is the rim?',
      q: 'On an orthographic globe a degree of latitude along a meridian at the centre is 1.745 mm wide (R = 100 mm). How wide is a degree along a radius at 80° from the centre?',
      steps: [
        'The radial scale is $h = \\cos c = \\cos 80° = 0.174$.',
        { text: 'The width is the central width times $h$:', tex: '1.745 \\times 0.174 = 0.30\\ \\text{mm}' }
      ],
      a: '0.30 mm: less than one fifth of the width at the centre. The last 10° before the limb take only 1.5 % of the disc’s radius.'
    }
  ],
  quiz: [
    { q: 'Where is the light in the orthographic projection?', choices: ['at the centre of the globe', 'at the antipode of the centre of the map', 'infinitely far away, on the axis through the centre of the map', 'at the centre of the map'], a: 2, why: 'The rays are parallel and perpendicular to the sheet: the light has been moved to infinity.' },
    { q: 'On the equatorial orthographic map the parallels are', choices: ['circles', 'ellipses', 'straight horizontal lines', 'parabolas'], a: 2, why: 'The parallels are circles perpendicular to the axis, and seen edge-on (the axis lies in the picture plane) a circle projects to a line, at the height R sin φ.' },
    { q: 'What fraction of the way from the centre to the limb (on the sheet) is a place 60° from the centre of the map?', answer: 0.866, why: 'ρ/R = sin 60° = 0.866: the outer 30° of arc are squeezed into the last 13 % of the radius.' },
    { q: 'The orthographic map can be drawn for the whole globe on one disc.', a: false, why: 'ρ = R sin c is the same for c and 180° − c, so the far side would fall on top of the near side. Only one hemisphere is shown.' },
    { q: 'What does the limb of the orthographic map correspond to on the globe?', choices: ['the equator', 'the great circle 90° from the centre of the map', 'the central meridian', 'the Tropic of Cancer'], a: 1, why: 'The limb is where the rays graze the sphere: the points at c = 90°.' }
  ],
  applications: [
    'Pictures of the Earth, the Moon and the planets: the discs of astronomical images, and the globe views of encyclopaedias and atlases, are drawn orthographically, since a distant observer sees an orthographic picture.',
    'Rotatable globe widgets on web pages and in software: the orthographic view is cheap to compute, and the rim squeeze looks natural.',
    'Sundial layout: the ancient *analemma* is an orthographic diagram of the celestial sphere, from which the height and azimuth of the Sun for any hour and season are read.',
    'Engineering and architecture: the front view of any sphere or dome in a drawing is this map; a hemispherical vault in plan and elevation is drawn by the same construction.'
  ],
  history: 'The orthographic projection has been used since antiquity. Hipparchus employed it in the second century BC to find where the stars rise and set, and Vitruvius, around 14 BC, used it for his *analemma* to lay out sundials; Ptolemy wrote a treatise on the same diagram. The word “orthographic” (from the Greek for “straight drawing”) was brought to the sphere by François d’Aguilon in 1613, who preferred it to the older “analemma”. The later vertical perspective generalised it to a viewpoint at a finite distance.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the orthographic projection.', 'Vitruvius, *De architectura*, book IX, on the analemma.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).'],
  sim: { id: 'az-light-position', params: { t: 1 } },
  construction: ['az-orthographic-equatorial', 'az-orthographic-oblique']
},

{
  id: 'azimuthal-equidistant-projection',
  parent: 'azimuthal-family',
  title: 'The azimuthal equidistant projection',
  level: 2,
  short: 'Every place is drawn at its true distance and true bearing from the centre of the map. The whole Earth fits in a disc, with the antipode stretched into the rim; the map of the United Nations emblem and of every “how far from here?” chart.',
  keywords: ['azimuthal equidistant', 'equidistant', 'polar map', 'UN emblem', 'range and bearing', 'distance from centre', 'antipode', 'Postel', 'al-Biruni'],
  prereq: ['azimuthal-projections', 'equidistant-maps', 'great-circles-and-rhumb-lines'],
  related: ['lambert-azimuthal-equal-area', 'two-point-equidistant-projection', 'planetarium-domes', 'aviation-and-polar-routes', 'equidistant-fisheye'],
  body: `Stand at the centre of the map and unroll every great circle that leaves it, like a tape measure: that is the **azimuthal equidistant projection**. A place at angular distance $c$ in the direction $\\theta$ is drawn at the distance $\\rho = R\\,c$ along the same direction. Distances measured along any straight line from the centre are true, and so are all directions from the centre. No other map gives both at once: from a chosen city, it answers the question “how far, and which way?” with a ruler and a protractor.

### The formulas
$$\\rho = R\\,c, \\qquad x = \\rho\\sin\\theta, \\qquad y = \\rho\\cos\\theta,$$
or, written out with $k' = c/\\sin c$ (and $k'=1$ at the centre),
$$x = R k'\\cos\\varphi\\,\\sin(\\lambda-\\lambda_0), \\qquad y = R k'\\left[\\cos\\varphi_0\\sin\\varphi - \\sin\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0)\\right].$$
The whole sphere fits in a disc of radius $\\pi R$; the antipode of the centre, a single point, is stretched into the whole rim.

### What it keeps and loses
Along a radius the scale is exactly $h = 1$. Across it, $k = c/\\sin c$: 1.21 at 60° from the centre, $\\pi/2 = 1.57$ at 90°, 2.42 at 120°, and without limit at the rim. So areas grow as $c/\\sin c$, and shapes shear: the maximum angular error is 26° at 90° from the centre and grows beyond. In the polar aspect the parallels are equally spaced circles ($\\rho = R(90° - \\varphi)$ in radians), the meridians straight radii at their true angles: the south polar region, far from the centre, is spread into a wide ring, so the poles' opposite hemisphere is badly stretched. Tissot's indicatrix is a circle at the centre and an ellipse beyond it, true along the radius and stretched across it (1.57 : 1 at 90° from the centre). The map is neither conformal nor equal-area, and straight lines that miss the centre are not great circles.

### Drawing it by hand
Polar aspect: the dividers carry the length of 15° of arc, $R\\pi/12$, outward along a ray, twelve times, and each mark gives a circle about the pole; the protractor draws the meridians. For an oblique aspect there is no graticule to be drawn first. Take each place's bearing and distance from the centre (a table, a globe or the spherical triangle), lay off the bearing with the protractor and the distance with the scale: the map is a polar plot. Both constructions are given.

> [!note] The antipode is a circle. A traveller who goes straight for 20 015 km, half the circumference of the Earth, arrives at the same point whichever direction she takes: the map shows it as the whole rim. That is why the map looks so odd in the far hemisphere, and why flat-earth enthusiasts, who are fond of this map, misread it: its rim is not an edge, it is one point.`,
  ideas: [
    'ρ = R c: the arc length from the centre is laid out straight along the radius, so distances and bearings from the centre of the map are true.',
    'The whole sphere fits in a disc of radius πR; the single antipode of the centre is stretched into the whole rim.',
    'Along a radius the scale is exactly 1; across it the scale is c / sin c, 1.57 at 90° and unbounded at the rim.',
    'The map is a polar plot of bearing and distance, so an oblique map can be made from a table of bearings and distances with a protractor and a scale.'
  ],
  pitfalls: [
    'Distances are true everywhere on the map — Only distances from the centre. The distance between two other places measured on the sheet is wrong, and increasingly so near the rim.',
    'The azimuthal equidistant map is the map of a flat disc-shaped Earth with an edge — The disc is a representation of the sphere: the rim is the single point opposite the centre. The picture is a projection of the globe, not a proof that the Earth has an edge.',
    'A straight line anywhere on the map is a shortest route — Only straight lines through the centre are great circles. A line between two other places is a curve on the globe, and the shortest route between them is drawn as a curve here.'
  ],
  formulas: [
    {
      name: 'Radius of a ring',
      expr: 'rho = R*c',
      tex: '\\rho = R\\,c',
      vars: {
        rho: { name: 'distance from the centre on the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 50 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 86, min: 0, max: 180 }
      },
      solveFor: 'rho',
      note: 'London to Tokyo, 86.0° (9558 km), with R = 50 mm: 75.0 mm. The rim of the map is at 157.1 mm (180°).'
    },
    {
      name: 'Sideways scale',
      expr: 'k = c/sin(c)',
      tex: 'k = \\frac{c}{\\sin c}',
      vars: {
        k: { name: 'scale across a ring (the radial scale is 1)' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 1, max: 170 }
      },
      note: 'At 90° k = π/2; the area scale is the same number, since the radial scale is 1. The antipode (180°) is stretched without limit.'
    },
    {
      name: 'Position on the sheet',
      expr: 'x = rho*sin(theta)',
      tex: 'x = \\rho\\sin\\theta',
      vars: {
        x: { name: 'horizontal position, east of the centre', q: 'length', unit: 'mm', signed: true },
        rho: { name: 'distance from the centre', q: 'length', unit: 'mm', value: 75 },
        theta: { name: 'bearing, clockwise from north', q: 'angle', unit: '°', value: 31.7, min: 0, max: 360 }
      },
      solveFor: 'x',
      note: 'y = ρ cos θ is the position north of the centre. Tokyo from London, bearing 31.7°, ρ = 75.0 mm: x = 39.4 mm, y = 63.8 mm.'
    }
  ],
  examples: [
    {
      title: 'Reading a distance and a bearing',
      q: 'On a map centred on London, the point for Cairo is at ρ = 27.6 mm from the centre along the bearing 121° with R = 50 mm. What is the real distance and in which direction should a pilot head?',
      steps: [
        { text: 'The angle is the radius over $R$, in radians:', tex: 'c = \\rho/R = 27.6/50 = 0.552\\ \\text{rad} = 31.6°' },
        { text: 'The ground distance is $R_\\oplus c$:', tex: 'd = 6371\\times 0.552 = 3517\\ \\text{km}' },
        'The initial bearing is read with the protractor from the north line: about 121° (south-east).'
      ],
      a: 'About 3500 km on an initial bearing of 121°; both read straight off the map.'
    },
    {
      title: 'The stretching of the south',
      q: 'On a polar azimuthal equidistant map of the northern pole, by what factor is the circumference of the 45° S parallel drawn too long?',
      steps: [
        'Colatitude of 45° S is $c = 135° = 3\\pi/4$ rad, so $\\rho = R\\cdot 3\\pi/4 = 2.356\\,R$ and the circumference drawn is $2\\pi\\rho = 14.8\\,R$.',
        { text: 'On the globe the circumference is', tex: '2\\pi R\\cos 45° = 4.44\\,R.' },
        'Ratio $= 14.8/4.44 = 3.33$, which is $c/\\sin c$ at 135°.'
      ],
      a: '3.3 times too long: the sideways scale there is c / sin c = 3.33.'
    }
  ],
  quiz: [
    { q: 'What is true about every straight line through the centre of an azimuthal equidistant map?', choices: ['it is a rhumb line', 'it is a great circle drawn at its true length', 'it is a parallel', 'it keeps its area'], a: 1, why: 'A line through the centre is the image of a great circle through the centre point, and distances along it are true by construction (ρ = R c).' },
    { q: 'On a polar equidistant map with R = 50 mm, how far from the pole is the equator?', answer: 78.5, unit: 'mm', why: 'c = 90° = π/2, so ρ = R c = 50 × 1.5708 = 78.5 mm.' },
    { q: 'The distance between New York and Tokyo can be measured directly on an azimuthal equidistant map centred on London.', a: false, why: 'Only distances measured from the centre are true. The line between two other places is not a great circle, and its length on the map is not their ground distance.' },
    { q: 'What happens to the point opposite the centre of the map?', choices: ['it is drawn at infinity', 'it is a point at the rim', 'it is stretched into the whole rim circle', 'it is not drawn'], a: 2, why: 'Every great circle from the centre arrives at the antipode after the same length πR, so all of them end on the circle of radius πR.' },
    { q: 'At what distance from the centre of the map (in degrees) is the sideways scale equal to π/2?', answer: 90, unit: '°', why: 'k = c / sin c; at c = 90° this is (π/2)/1.' }
  ],
  applications: [
    'The emblem of the United Nations: a polar azimuthal equidistant map of the world, centred on the North Pole and reaching to about 60° S, in olive branches.',
    'Range-and-bearing maps from a place: radio and antenna beam maps, airline route charts from a hub, a disaster-response chart of the distance from an epicentre or a site.',
    'Seismology: the epicentral distance of an earthquake is an arc, and the stations at equal arc distance lie on a circle round the epicentre.',
    'Polar atlases and geographical teaching, where the poles are the interest and the distance from them is true.',
    'The dome of a planetarium and the fisheye “equidistant” lens, whose images are azimuthal equidistant maps of the sky.'
  ],
  history: 'The polar form was in use in antiquity for star charts, and al-Biruni drew a hemisphere in this projection around the year 1000. In Europe, Guillaume Postel published a polar world map in 1581, and the oblique form was adopted for many nineteenth-century atlases. In the twentieth century it became familiar as the map of the United Nations emblem (the design of 1945–46), and as the map of choice for radio amateurs, who draw it centred on their own aerial.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the azimuthal equidistant projection.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'Arthur H. Robinson et al., *Elements of Cartography* (6th ed., 1995).'],
  sim: { id: 'az-map-lab', params: { proj: 'azimuthal-equidistant', centre: 'London', target: 'Tokyo' } },
  construction: ['az-equidistant-polar', 'az-equidistant-oblique']
},

{
  id: 'lambert-azimuthal-equal-area',
  parent: 'azimuthal-family',
  title: 'Lambert’s azimuthal equal-area projection',
  level: 2,
  short: 'The chord from the centre of the map to a place, swung down onto the sheet, gives its distance from the centre. Every area is true; the whole Earth fits in a disc of radius 2R, with the shapes sheared towards the rim. The map of European statistics and of the geologist’s net.',
  keywords: ['Lambert azimuthal equal-area', 'equal-area', 'LAEA', 'ETRS89', 'Schmidt net', 'chord', 'INSPIRE', 'polar equal-area', '2R sin(c/2)'],
  prereq: ['azimuthal-projections', 'equal-area-maps', 'tissot-indicatrix'],
  related: ['azimuthal-equidistant-projection', 'stereographic-projection', 'lambert-cylindrical-equal-area', 'aitoff-and-hammer', 'albers-equal-area-conic', 'crystallography-stereographic'],
  body: `Take the chord from the centre of the map to a place on the globe, and swing it down onto the sheet like a gate on a hinge, so that its end lies in the plane. The length of the chord is the place's distance from the centre. That is **Lambert's azimuthal equal-area projection**, and the chord of a sphere is $2R\\sin(c/2)$, so
$$\\rho = 2R\\sin\\frac{c}{2}, \\qquad x = \\rho\\sin\\theta, \\quad y = \\rho\\cos\\theta.$$
In terms of latitude and longitude, with $k' = \\sqrt{2/(1+\\cos c)}$,
$$x = R k'\\cos\\varphi\\,\\sin(\\lambda-\\lambda_0), \\qquad y = R k'\\left[\\cos\\varphi_0\\sin\\varphi - \\sin\\varphi_0\\cos\\varphi\\cos(\\lambda-\\lambda_0)\\right].$$

### Why the areas are true
The radial scale is $h = \\cos(c/2)$ and the sideways scale is $k = 1/\\cos(c/2)$, so $hk = 1$ at every point: a small patch is squeezed one way exactly as much as it is stretched the other. Archimedes' result for the sphere makes the same point globally. The cap of angular radius $c$ has area $2\\pi R^2(1-\\cos c) = 4\\pi R^2\\sin^2(c/2)$, and the disc of radius $\\rho = 2R\\sin(c/2)$ has area $\\pi\\rho^2 = 4\\pi R^2\\sin^2(c/2)$: the same. A hemisphere fills a disc of radius $\\sqrt 2 R$, and the whole sphere the disc of radius $2R$, the diameter of the globe; the antipode, a single point, is the whole rim.

### What it loses
Angles are not true, and shapes shear as they move out: Tissot's indicatrix is an ellipse of unchanged area, long across the radius ($k = 1/\\cos(c/2)$) and short along it ($h = \\cos(c/2)$), 2 : 0.5 at 120° from the centre. The maximum angular error is 39° at 90° from the centre, 90° nowhere short of the rim. In the polar aspect the parallels are circles at $\\rho = 2R\\sin(45° - \\varphi/2)$ (the equator at $\\sqrt 2 R$) and the meridians are radii; in the equatorial and oblique aspects the graticule is a set of curves, symmetrical about the central meridian and the equator, with the rim as a circle.

### Drawing it by hand
The compass does it: draw the globe's side view, join the pole to the point at colatitude $c$ (the chord), and with the pole as centre swing the chord down to the sheet. The cuts are the radii of the rings, carried by the dividers to the plan. The construction on this page makes the polar graticule that way.

> [!fact] The Hammer projection is Lambert's azimuthal map of half the longitudes, doubled in width: it keeps areas too, and gives an ellipse for the whole world. Take the Lambert map centred on the equator, but with only the meridians $\\pm 90°$ drawn, and stretch it to twice the width.`,
  ideas: [
    'The distance from the centre is the chord of the globe, ρ = 2R sin(c/2): the chord swung down to the sheet.',
    'The radial scale cos(c/2) and the sideways scale 1/cos(c/2) multiply to 1: every area is true.',
    'The whole Earth fits in a disc of radius 2R, a hemisphere in a disc of radius √2 R; the antipode is the rim.',
    'Shapes shear towards the rim (39° at 90° from the centre) and angles are lost; the map is for comparing areas, not for steering.'
  ],
  pitfalls: [
    'Equal-area means the shapes are right — Equal-area means areas are kept. To do that the map must shear the shapes: the Lambert map is exactly right only at the centre.',
    'The Lambert equal-area and azimuthal equidistant maps look alike, so they are the same — They share the polar-plot form but have different rings: in the equidistant map the rings are equally spaced, in Lambert’s they crowd towards the rim to keep the areas of the annuli right.',
    'The rim of the map is the edge of the Earth — The rim is a single point (the antipode of the centre), stretched into a circle, as in the equidistant map.'
  ],
  formulas: [
    {
      name: 'Radius of a ring',
      expr: 'rho = 2*R*sin(c/2)',
      tex: '\\rho = 2R\\sin\\frac{c}{2}',
      vars: {
        rho: { name: 'distance from the centre of the map', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      solveFor: 'rho',
      note: 'At c = 60° the radius is exactly R; at 90°, √2 R; at 180°, 2R. The rim is the diameter of the globe.'
    },
    {
      name: 'Area of a cap equals the area of its disc',
      expr: 'A = 2*pi*R^2*(1 - cos(c))',
      tex: 'A = 2\\pi R^2(1 - \\cos c)',
      vars: {
        A: { name: 'area of the cap, and of its disc on the map', q: 'area', unit: 'cm²' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'cm', value: 10 },
        c: { name: 'angular radius of the cap', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      solveFor: 'A',
      note: 'A hemisphere has area 2πR². The disc of radius ρ = 2R sin(c/2) has area π ρ² = 4πR² sin²(c/2), which is the same number.'
    },
    {
      name: 'Largest angular error',
      expr: 'w = 2*asin(sin(c/2)^2/(1 + cos(c/2)^2))',
      tex: '\\omega = 2\\arcsin\\frac{\\sin^2(c/2)}{1 + \\cos^2(c/2)}',
      vars: {
        w: { name: 'largest angle error', q: 'angle', unit: '°', tex: '\\omega' },
        c: { name: 'angular distance from the centre', q: 'angle', unit: '°', value: 90, min: 0, max: 180 }
      },
      note: 'From ω = 2 arcsin((k − h)/(k + h)) with h = cos(c/2) and k = 1/cos(c/2). 38.9° at 90°, 70.5° at 135°.'
    }
  ],
  examples: [
    {
      title: 'The polar equal-area map',
      q: 'A polar Lambert map of the northern hemisphere has R = 100 mm. Where are the parallels 60° N, 30° N and the equator?',
      steps: [
        { text: 'Colatitude $c = 90° - \\varphi$, then $\\rho = 2R\\sin(c/2)$:', tex: '\\rho_{60} = 200\\sin 15° = 51.8,\\quad \\rho_{30} = 200\\sin 30° = 100.0,\\quad \\rho_{0} = 200\\sin 45° = 141.4\\ \\text{mm}' },
        'The ring of 30° N is exactly R from the pole — the chord of a 60° arc is a radius of the circle.',
        'Check the area between 30° N and the equator: $\\pi(141.4^2 - 100^2) = \\pi\\cdot 10000 = 31\\,416\\ \\text{mm}^2$, and the sphere’s zone is $2\\pi R^2 (\\sin 30° - 0) = \\pi R^2 = 31\\,416\\ \\text{mm}^2$.'
      ],
      a: '51.8, 100.0 and 141.4 mm. The annulus between 30° N and the equator has the area of the corresponding zone of the sphere, as it must.'
    },
    {
      title: 'How sheared is the rim?',
      q: 'At 120° from the centre of a Lambert map, what are the two scales and the largest angular error?',
      steps: [
        { text: 'With $c/2 = 60°$:', tex: 'h = \\cos 60° = 0.5,\\qquad k = 1/\\cos 60° = 2' },
        { text: 'The angular error:', tex: '\\omega = 2\\arcsin\\frac{2 - 0.5}{2 + 0.5} = 2\\arcsin 0.6 = 73.7°' }
      ],
      a: 'A circle becomes an ellipse twice as wide as it is long (2 : 0.5 = 4 : 1), with a maximum angular error of 74°; yet its area is right.'
    }
  ],
  quiz: [
    { q: 'What is the distance from the centre of a Lambert azimuthal map to the place at c = 60°, in units of R?', answer: 1, why: 'ρ = 2R sin 30° = R: the chord of a 60° arc equals the radius.' },
    { q: 'In Lambert’s map the whole sphere fits in a disc of radius', choices: ['R', 'R√2', '2R', 'πR'], a: 2, why: 'At c = 180° the chord is the diameter, 2R. The hemisphere fills √2 R. (πR is the equidistant map.)' },
    { q: 'The product of the radial and the sideways scale at every point of a Lambert map is', answer: 1, why: 'cos(c/2) × 1/cos(c/2) = 1: the map is equal-area.' },
    { q: 'A map can be both equal-area and conformal.', a: false, why: 'Conformal needs the same scale in all directions at every point, equal-area needs the product of the scales to be 1: both would require scale 1 everywhere, which is impossible for a sphere.' },
    { q: 'Which of these maps is the Lambert azimuthal equal-area used for?', choices: ['steering a ship on a constant bearing', 'statistical maps of Europe and of the polar regions where the area of regions has to be compared', 'plotting the shortest air route as a straight line', 'the satellite view of the Earth'], a: 1, why: 'Its strength is that areas are right; in the European grid ETRS89-LAEA (centred on 52° N, 10° E) the area of any region can be read from the map.' }
  ],
  applications: [
    'The European standard grid ETRS89-LAEA, an equal-area map centred on 52° N, 10° E, is the map of the European Union’s INSPIRE statistics, the same projection that Eurostat uses to compare regions’ areas.',
    'The US National Atlas Equal Area (centred on 45° N, 100° W) and equal-area maps of polar regions and continents, especially Antarctica and the Arctic.',
    'Structural geology and crystallography: the Schmidt net is a Lambert azimuthal map of the sphere of directions, and pole figures of textures are plotted on it so that the density of orientations is not distorted.',
    'World maps of areal quantities — land cover, species ranges, forest loss — in the oblique form or in the half-sphere form of the Hammer map.',
    'Weather and ocean observations in polar regions, where grid cells of equal area keep averages unbiased.'
  ],
  history: 'Johann Heinrich Lambert published the azimuthal equal-area projection in 1772, in the same treatise that gave the conformal conic, the transverse Mercator and the cylindrical equal-area map: it classified the ways of mapping the sphere by what they keep. The map was little used outside atlases until the twentieth century, when its equal-area property made it the natural choice for statistics, for the geologist’s net (devised by Walter Schmidt in the 1920s) and for the European grid.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on Lambert’s azimuthal equal-area projection.', 'J. H. Lambert, *Anmerkungen und Zusätze zur Entwerfung der Land- und Himmelscharten* (1772), translated by W. R. Tobler (1972).', 'EU INSPIRE, *Specification on Coordinate Reference Systems* (ETRS89-LAEA, EPSG:3035).'],
  sim: { id: 'az-map-lab', params: { proj: 'lambert-azimuthal', centre: 'Tel Aviv', target: 'Sydney' } },
  construction: 'az-lambert-polar'
},

{
  id: 'vertical-perspective-projection',
  parent: 'azimuthal-family',
  title: 'The vertical perspective: the view from space',
  level: 2,
  short: 'What a camera records looking straight down from a height of P Earth radii above the centre: a cap of the globe bounded by the horizon, squeezed towards the rim. Move the viewpoint to infinity and it is the orthographic map; bring it to the centre and it is the gnomonic one.',
  keywords: ['vertical perspective', 'general perspective', 'satellite view', 'horizon', 'geostationary', 'full disk', 'near-sided perspective', 'La Hire', 'viewpoint height'],
  prereq: ['azimuthal-projections', 'orthographic-map-projection', 'central-projection'],
  related: ['gnomonic-projection', 'stereographic-projection', 'the-camera-model', 'gps-and-web-maps', 'astronomy-and-planetary-maps', 'weather-maps'],
  body: `A satellite hangs at a height $H$ above the Earth and points a camera straight down. What it records is the globe projected from the camera's position onto a plane perpendicular to the line of sight: the **vertical perspective** projection (also the near-sided perspective, or the general perspective with the view straight down). Put $P = 1 + H/R$ for the distance of the eye from the centre of the globe, in Earth radii; then the eye sees only the cap whose edge, the **horizon**, is where its sight lines graze the globe.

### The formulas
With $c$ the angular distance from the sub-satellite point (the centre of the map) and the picture plane tangent to the globe there,
$$\\rho = R\\,\\frac{(P-1)\\sin c}{P - \\cos c}, \\qquad x = \\rho\\sin\\theta,\\quad y = \\rho\\cos\\theta,$$
valid for $\\cos c \\ge 1/P$. The horizon lies at $c_h = \\arccos(1/P)$, at the radius $\\rho_h = R\\sqrt{(P-1)/(P+1)}$, and the fraction of the Earth's surface in view is $(1 - 1/P)/2$. The eye sees a disc of angular width $2\\arcsin(1/P)$.

| Viewpoint | Height | $P$ | Horizon $c_h$ | Fraction in view | Disc seen across |
|---|---|---|---|---|---|
| space station | 420 km | 1.066 | 20.3° (2250 km) | 3.1 % | 139° |
| navigation satellite | 20 200 km | 4.17 | 76.1° | 38.0 % | 27.8° |
| geostationary | 35 786 km | 6.62 | 81.3° | 42.4 % | 17.4° |
| the Moon | 384 400 km | 61.3 | 89.1° | 49.2 % | 1.9° |

### The family it belongs to
The same formula with the light behind the centre of the globe, $P<0$, gives the other perspective azimuthals: $P=0$ is the [[gnomonic-projection|gnomonic]] map and $P=-1$ the [[stereographic-projection|stereographic]]. For $P\\to\\infty$ the viewpoint is at infinity and the projection becomes the [[orthographic-map-projection|orthographic]]. A real satellite is at a finite distance, so every picture it takes is slightly less foreshortened at the rim than the orthographic map and shows a smaller cap.

### What it keeps and loses
Nothing exactly, except the look: it is what a camera sees. Tissot's indicatrix is a circle at the centre and, further out, an ellipse flattened along the radius, its short axis shrinking to nothing at the horizon. The sideways scale $k = (P-1)/(P-\\cos c)$ falls from 1 at the centre to $P/(P+1)$ at the horizon, but the radial scale $h = (P-1)(P\\cos c - 1)/(P-\\cos c)^2$ falls to **zero** there: the land at the horizon is seen edge-on, as in the orthographic map. A camera that does not point straight down (an *oblique* or *tilted* view, as in a flight simulator or an Earth-viewing program) uses the same formula after a rotation of the globe and a shift of the plane.

### How it is drawn
The side view with the eye above the sphere: draw a ray from the eye through the point of the globe at angular distance $c$ and read where it meets the picture plane; carry the distances to the plan. The horizon is found with Thales' circle on the line from the eye to the centre. The construction draws the whole graticule.

> [!fact] A geostationary satellite sees the Earth only out to 81.3° from the equator point below it: beyond ±81.3° of latitude (north or south) it is below the horizon. That is why polar-orbiting satellites, not geostationary ones, are used for the Arctic and Antarctic.`,
  ideas: [
    'The eye is at distance P R from the centre (P = 1 + H/R) looking straight down; ρ = R (P − 1) sin c / (P − cos c), for cos c ≥ 1/P.',
    'The horizon is at cos c_h = 1/P; the fraction of the Earth in view is (1 − 1/P)/2, 42 % from a geostationary orbit and 3 % from the space station.',
    'P → ∞ is the orthographic map, P = 0 the gnomonic, P = −1 the stereographic: one formula, one parameter.',
    'At the horizon the radial scale falls to zero (the land is seen edge-on) while the sideways scale is P / (P + 1).'
  ],
  pitfalls: [
    'A satellite sees half the Earth — Never quite: the cap is (1 − 1/P)/2 of the surface, less than a half. Even the Moon sees 49 %, a geostationary satellite 42 % and the space station 3 %.',
    'The picture from space is an orthographic map — It approaches one for great distances (P of 60 or more), but from low orbits the rim shows much less than a hemisphere, and the foreshortening is different.',
    'The scale is nearly constant in a satellite picture — It is not: the radial scale falls to zero at the horizon, and the sideways one to P/(P+1). A pixel at the edge of a weather-satellite image covers far more ground than one at the centre.'
  ],
  formulas: [
    {
      name: 'Radius of a ring on the vertical perspective',
      expr: 'rho = R*(P - 1)*sin(c)/(P - cos(c))',
      tex: '\\rho = R\\,\\frac{(P-1)\\sin c}{P - \\cos c}',
      vars: {
        rho: { name: 'distance from the sub-satellite point on the picture', q: 'length', unit: 'mm' },
        R: { name: 'radius of the globe drawn', q: 'length', unit: 'mm', value: 100 },
        P: { name: 'distance of the eye from the centre, in Earth radii', value: 6.62, min: 1.01, max: 100 },
        c: { name: 'angular distance from the sub-satellite point', q: 'angle', unit: '°', value: 60, min: 0, max: 80 }
      },
      solveFor: 'rho',
      note: 'Geostationary (P = 6.62), a place 60° from the point below: 79.5 mm on a picture of R = 100 mm; the horizon is at 85.9 mm. The place must be in view: cos c ≥ 1/P.'
    },
    {
      name: 'Distance to the horizon from the point below',
      expr: 'ch = acos(1/P)',
      tex: 'c_h = \\arccos\\frac{1}{P}',
      vars: {
        ch: { name: 'angular distance of the horizon', q: 'angle', unit: '°', tex: 'c_h' },
        P: { name: 'distance of the eye from the centre, in Earth radii', value: 6.62, min: 1.001, max: 1000 }
      },
      solveFor: 'ch',
      note: 'The space station (P = 1.066) sees 20.3°, or 2250 km of ground; a geostationary satellite (6.62) 81.3°.'
    },
    {
      name: 'Fraction of the surface in view',
      expr: 'f = (1 - 1/P)/2',
      tex: 'f = \\frac{1}{2}\\left(1 - \\frac{1}{P}\\right)',
      vars: {
        f: { name: 'fraction of the Earth’s surface seen' },
        P: { name: 'distance of the eye from the centre, in Earth radii', value: 6.62, min: 1.001, max: 1000 }
      },
      solveFor: 'f',
      note: 'The cap of angular radius c_h has area 2πR²(1 − cos c_h); divided by 4πR², with cos c_h = 1/P, this is (1 − 1/P)/2.'
    },
    {
      name: 'P from the height above the ground',
      expr: 'P = 1 + H/R',
      tex: 'P = 1 + \\frac{H}{R_\\oplus}',
      vars: {
        P: { name: 'distance of the eye from the centre, in Earth radii' },
        H: { name: 'height above the surface', q: 'length', unit: 'km', value: 35786 },
        R: { const: 'Rearth' }
      },
      note: 'For a geostationary orbit, H = 35 786 km gives P = 6.62; for the space station 420 km gives 1.066.'
    }
  ],
  examples: [
    {
      title: 'What does the space station see?',
      q: 'The International Space Station orbits at about 420 km. How far is its horizon from the point directly below, along the ground, and what fraction of the Earth is in view?',
      steps: [
        { text: 'The eye is at $P = 1 + 420/6371 = 1.066$ radii from the centre.', tex: 'c_h = \\arccos\\frac{1}{1.066} = 20.3°' },
        { text: 'Ground distance and area:', tex: 's = R_\\oplus c_h = 6371\\times 0.354 = 2250\\ \\text{km},\\qquad f = \\tfrac12\\left(1 - \\tfrac{1}{1.066}\\right) = 3.1\\ \\%' },
        'The sight line to the horizon is $R_\\oplus\\sqrt{P^2-1} = 2350$ km long.'
      ],
      a: 'The horizon is 20.3° (2250 km of ground) away, and 3.1 % of the Earth’s surface is in view.'
    },
    {
      title: 'A place near the edge of a weather-satellite picture',
      q: 'A geostationary satellite looks straight down; the picture is drawn at R = 100 mm. Where is a place 60° from the sub-satellite point, and how near is that to the edge of the disc?',
      steps: [
        { text: 'With $P = 6.62$:', tex: '\\rho = 100\\cdot\\frac{5.62\\sin 60°}{6.62 - \\cos 60°} = 79.5\\ \\text{mm}' },
        { text: 'The horizon (the edge of the picture):', tex: '\\rho_h = 100\\sqrt{\\frac{5.62}{7.62}} = 85.9\\ \\text{mm}' },
        'So the place is 74 % of the way from the sub-satellite point to the horizon in angle ($60°/81.3°$) but 93 % of the way across the picture.'
      ],
      a: '79.5 mm from the centre, only 6.4 mm inside the edge: the outer third of the Earth’s radius is squeezed into the outer 7 % of the picture.'
    }
  ],
  quiz: [
    { q: 'What happens to the vertical perspective as the viewpoint goes to infinity?', choices: ['it becomes the gnomonic map', 'it becomes the stereographic map', 'it becomes the orthographic map', 'it becomes the azimuthal equidistant map'], a: 2, why: 'The sight lines become parallel and perpendicular to the picture plane: that is the orthographic projection.' },
    { q: 'At what angular distance from the point below is the horizon for a satellite whose distance from the Earth’s centre is 2 Earth radii?', answer: 60, unit: '°', why: 'cos c_h = 1/P = 1/2, so c_h = 60°.' },
    { q: 'A geostationary satellite can see the North Pole.', a: false, why: 'Its horizon is at 81.3° from the equator point below it, so latitudes above 81.3° are hidden.' },
    { q: 'What fraction of the Earth’s surface can be seen from a viewpoint 2 radii from the centre (one radius above the ground)?', answer: 0.25, why: '(1 − 1/P)/2 = (1 − 1/2)/2 = 0.25.' },
    { q: 'What is the radial scale at the horizon of the vertical perspective?', choices: ['1', 'P / (P + 1)', 'zero', 'infinite'], a: 2, why: 'h = (P − 1)(P cos c − 1)/(P − cos c)² vanishes when cos c = 1/P: the land at the horizon is seen edge-on, so a given distance on the ground has no length in the picture.' }
  ],
  applications: [
    'Weather satellite pictures: the full-disk images from the geostationary spacecraft that watch the Americas, Europe and Africa, and the Pacific are vertical perspective pictures; software re-projects them to Mercator or equirectangular maps for forecasters.',
    'Astronaut photographs and the pictures of the whole Earth from deep space: the “Blue Marble” views are vertical-perspective, and from the Sun–Earth point 1.5 million km out (P = 236) they are all but orthographic.',
    'Earth-viewing programs and globe widgets: the picture of the globe in a viewer is a perspective view with a viewpoint that can be moved and tilted.',
    'Visibility computations: whether a place is in sight of a given satellite or mountain-top, and at what angle: the horizon formula c_h = arccos(1/P) decides it.',
    'Cartographic illustrations of a region as seen from above, in atlases and news graphics, as a more natural alternative to a flat map.'
  ],
  history: 'The idea of drawing a globe as seen from a finite height was formalised in 1701 by Philippe de La Hire, who proposed a viewpoint at a fixed multiple of the radius to make the picture look natural. The British geodesist Alexander Ross Clarke examined in 1862 which viewpoint distances spread the distortion best. The projection became a daily sight in 1966, when the first geostationary spacecraft, ATS-1, sent back full pictures of the Earth’s disc, followed by the series of weather satellites whose images are the best-known vertical perspectives.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the general vertical perspective.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'CGMS, *LRIT/HRIT Global Specification* (CGMS 03), for the geometry of the geostationary projection used by the weather satellites.'],
  sim: 'az-satellite',
  construction: 'az-vertical-perspective'
},

{
  id: 'two-point-equidistant-projection',
  parent: 'azimuthal-family',
  title: 'The two-point equidistant projection',
  level: 3,
  short: 'Two chosen points A and B are put on the sheet at their true distance apart, and every other place is drawn where the circle about A at its true distance from A meets the circle about B at its true distance from B. Distances from both points are true everywhere; the map suits a region stretched between two centres.',
  keywords: ['two-point equidistant', 'doubly equidistant', 'Maurer', 'Close', 'trimetric', 'triangulation', 'Asia', 'two centres', 'compromise map'],
  prereq: ['azimuthal-equidistant-projection', 'equidistant-maps', 'compromise-maps'],
  related: ['azimuthal-projections', 'winkel-tripel', 'choosing-a-projection', 'charts-and-navigation', 'surveying-and-site-plans'],
  body: `The azimuthal equidistant map gives true distance from **one** chosen point. The **two-point equidistant projection** gives it from **two**. Choose places $A$ and $B$ and put them on the sheet at their true distance apart. Any other place $P$ has a distance $d_A$ from $A$ and a distance $d_B$ from $B$, both measured on the globe as angles; draw the circle of radius $d_A$ about $A$ and the circle of radius $d_B$ about $B$, and $P$ is where they cross. A compass is all it takes, like the surveyor's old method of fixing a point by its distances from two known ones.

### The formulas
Take $A$ at $(-d_{AB}/2,\\,0)$ and $B$ at $(d_{AB}/2,\\,0)$, with $d_{AB}$ the angular distance between them and all lengths in units of $R$. Then
$$x = \\frac{d_A^2 - d_B^2}{2\\,d_{AB}}, \\qquad y = \\pm\\sqrt{d_A^2 - \\left(x + \\tfrac{d_{AB}}{2}\\right)^2}.$$
The two circles cross at two points, mirror images in the line $AB$. The sign is chosen by the side of the great circle through $A$ and $B$ on which the place actually lies. That settles the position of every point of the globe.

### What it keeps and loses
Every distance measured from $A$ and every distance measured from $B$ is true. The great circle through $A$ and $B$ is the straight line $AB$ (and its continuation), at its true length. Nothing else is true: not angles, not areas, not distances between other places. Tissot's indicatrix is a circle at $A$ and at $B$, almost round between them, and stretches into an ellipse far from both (axes 2.3 and 0.97 at Sydney, on the London–Tokyo map). The distortion is small near the line $AB$ and in the strip between the two points, and grows with the distance from that strip. For Delhi on a map based on London and Tokyo the position is exact in distance from both; the distance between Delhi and Sydney, which has no relation to either base, is 9 % too long.

### Choosing the points
The map is good for a region that lies between two centres of interest: Asia is the textbook case, with one point in the west (near Istanbul or Cairo) and one in the east (near Tokyo or Beijing), and a route between two hubs. As the two points come closer, the map approaches the azimuthal equidistant map about their midpoint; as they move to opposite sides of the world it fills out to a disc.

### Drawing it by hand
Fix $A$ and $B$ on the sheet at the distance $d_{AB}$; for each place take the two distances from a table or a globe and draw the two arcs with the compass. The construction plots six places that way and checks the position against the formula.

> [!note] The idea extends to three points, and the Chamberlin trimetric projection of 1947, which the National Geographic Society adopted for maps of the continents, keeps the three distances nearly right on average: the best compromise of three fixed distances that can be drawn on a plane.`,
  ideas: [
    'A and B are set at their true distance apart, and every other place is the intersection of the circle about A at its true distance and the circle about B at its true distance.',
    'x = (d_A² − d_B²) / (2 d_AB) and y = ± √(d_A² − (x + d_AB/2)²): the sign says on which side of the great circle AB the place lies.',
    'Distances from A and from B are true everywhere, and the great circle AB is a straight line; nothing else is kept.',
    'The map suits a region stretched between two centres (Asia, a pair of hubs); as A and B come together it becomes the azimuthal equidistant map of their midpoint.'
  ],
  pitfalls: [
    'All distances on the map are true — Only distances measured from A or from B. The distance between any other two places is in error, up to 10 % and more far from the line AB.',
    'The two-point map is just two azimuthal equidistant maps stuck together — It is a single continuous map, with a different shape from either. The scale along the line AB is true, but across it the scale varies with the position on the line.',
    'The two circles always meet at one point — They meet at two, mirror images in the line AB. Which one is right depends on the side of the great circle AB on which the place lies, as the globe shows.'
  ],
  formulas: [
    {
      name: 'Abscissa along the line AB',
      expr: 'x = (dA^2 - dB^2)/(2*dAB)',
      tex: 'x = \\frac{d_A^2 - d_B^2}{2\\,d_{AB}}',
      vars: {
        x: { name: 'position along AB from the midpoint, in the direction A → B', q: 'length', unit: 'km', signed: true },
        dA: { name: 'distance from A', q: 'length', unit: 'km', value: 6712, tex: 'd_A' },
        dB: { name: 'distance from B', q: 'length', unit: 'km', value: 5837, tex: 'd_B' },
        dAB: { name: 'distance from A to B', q: 'length', unit: 'km', value: 9558, tex: 'd_{AB}' }
      },
      solveFor: 'x',
      note: 'Delhi from London (A) and Tokyo (B): x = 574 km east of the midpoint (0.090 R). The signs and units are the same for any scale.'
    },
    {
      name: 'Ordinate across the line AB',
      expr: 'y = sqrt(dA^2 - (x + dAB/2)^2)',
      tex: 'y = \\sqrt{d_A^2 - \\left(x + \\tfrac{d_{AB}}{2}\\right)^2}',
      vars: {
        y: { name: 'distance from the line AB (the sign: the side on which the place lies)', q: 'length', unit: 'km' },
        dA: { name: 'distance from A', q: 'length', unit: 'km', value: 6712, tex: 'd_A' },
        x: { name: 'position along AB from the midpoint', q: 'length', unit: 'km', value: 574, signed: true },
        dAB: { name: 'distance from A to B', q: 'length', unit: 'km', value: 9558, tex: 'd_{AB}' }
      },
      solveFor: 'y',
      note: 'Delhi: y = 4049 km, on the south side of the London–Tokyo great circle (negative on the map). Check: A is at −4779 km on the line, so the point is √((574 + 4779)² + 4049²) = 6712 km from A.'
    }
  ],
  examples: [
    {
      title: 'Placing Delhi',
      q: 'London (A) and Tokyo (B) are 9558 km apart (1.5003 radians). Delhi is 6712 km from London and 5837 km from Tokyo. Where is Delhi on the two-point map, in units of R?',
      steps: [
        'In radians: $d_A = 1.0535$, $d_B = 0.9162$, $d_{AB} = 1.5003$.',
        { text: 'Along the line:', tex: 'x = \\frac{1.0535^2 - 0.9162^2}{2\\times 1.5003} = \\frac{1.1099 - 0.8394}{3.0006} = 0.0901' },
        { text: 'Across it:', tex: 'y = \\sqrt{1.0535^2 - (0.0901 + 0.7502)^2} = \\sqrt{1.1099 - 0.7062} = 0.635' },
        'Delhi lies to the south of the great circle London–Tokyo (which passes over Siberia), so $y = -0.635$.'
      ],
      a: '(0.090, −0.635) in units of R: 9.0 mm east of the midpoint and 63.5 mm south of the line AB at a scale of 100 mm per radian.'
    },
    {
      title: 'How wrong is a distance between two other places?',
      q: 'On the same map Delhi is at (0.090, −0.635) R and Sydney at (1.868, −0.509) R. What distance does the map give between them, and what is the true one (10 428 km)?',
      steps: [
        { text: 'Distance on the sheet:', tex: '\\sqrt{(1.868 - 0.090)^2 + (-0.509 + 0.635)^2} = 1.783\\ R' },
        { text: 'Converted to kilometres:', tex: '1.783\\times 6371 = 11\\,357\\ \\text{km}' },
        'Relative error: $(11\\,357 - 10\\,428)/10\\,428 = +8.9\\ \\%$.'
      ],
      a: '11 357 km against 10 428 km true, 9 % too long: only distances from London and from Tokyo are true.'
    }
  ],
  quiz: [
    { q: 'On a two-point equidistant map, a distance is certainly true if it is measured', choices: ['between any two places', 'from A or from B to any place', 'along any straight line', 'along a parallel'], a: 1, why: 'The map is built so that the distances to the two base points are right; nothing else is promised.' },
    { q: 'Given d_A = 6000 km, d_B = 6000 km and d_AB = 8000 km, how far from the midpoint of AB along the line AB is the place?', answer: 0, unit: 'km', why: 'x = (d_A² − d_B²)/(2 d_AB) = 0: a place equally far from both lies on the perpendicular bisector.' },
    { q: 'The map has two possible positions for each place; the sign of y is chosen by the side of the great circle AB on which the place lies.', a: true, why: 'The circles about A and B cross twice, symmetrically about AB. The side of the great circle on the globe says which crossing is meant.' },
    { q: 'What happens to the two-point equidistant map as A and B approach each other?', choices: ['it becomes the Mercator map', 'it becomes the azimuthal equidistant map about their midpoint', 'it becomes the stereographic map', 'it fails'], a: 1, why: 'With A and B together, the two circles are concentric: every place is at a distance d_A = d_B from both, and the map is the single-centre equidistant map.' },
    { q: 'For which region is the two-point equidistant projection a natural choice?', choices: ['a small town', 'Asia, stretched between a western and an eastern centre', 'the North Pole', 'the whole world in an oval'], a: 1, why: 'Its distortions are smallest near the line between the two base points and in the strip around it, which suits an elongated region.' }
  ],
  applications: [
    'Maps of Asia and other elongated regions: Close’s map of Asia is the classical example, drawn with one point in the west and one in the east.',
    'The Chamberlin trimetric, a three-point relative adopted for the continents by the National Geographic Society in 1947, descends from the same idea.',
    'Maps for two-hub airlines, or for pairs of cities (a twinning, an itinerary), where the distance to either hub matters.',
    'Navigation and surveying: fixing a position by its distances from two known points is exactly the construction of this map, and the same arithmetic applies to radio ranging systems.',
    'Teaching: it shows how a map can be built from distance relations alone, without any projection surface.'
  ],
  history: 'The two-point equidistant projection was first described by the German geodesist Hans Maurer in 1919, and independently by Charles F. Close of the British Ordnance Survey in the early 1920s. Close used it for a map of Asia. In the 1940s Wellman Chamberlin of the National Geographic Society extended the idea to three points for the continents’ maps, the trimetric projection of 1947.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the section on two-point equidistant projections.', 'John P. Snyder, *Flattening the Earth: Two Thousand Years of Map Projections* (1993).', 'The original papers of Hans Maurer (1919) and Charles F. Close (1922), as summarised in Snyder (1987).'],
  sim: 'az-two-point',
  construction: 'az-two-point-equidistant'
}
);
