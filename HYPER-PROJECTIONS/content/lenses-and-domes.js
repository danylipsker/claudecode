/* HYPER-PROJECTIONS · content/lenses-and-domes.js — fisheye laws, the rectilinear lens, 360° rectangles, cube maps, domes, mirror anamorphosis and little planets.
 * Concepts of the topic `lenses-and-domes`; the simulations are in sims/lenses-and-domes.js and the hand constructions in constructions/lenses-and-domes.js.
 */
Hyper.add(
{
  id: 'fisheye-projections',
  parent: 'lenses-and-domes',
  title: 'Fisheye lens projections',
  level: 2,
  short: 'A fisheye lens turns the angle θ of a ray from the axis into a distance r from the centre of the picture, by a rule r = f·g(θ). Five rules matter: rectilinear (tan θ), equidistant (θ), equisolid (2 sin θ/2), stereographic (2 tan θ/2) and orthographic (sin θ); they agree near the axis and part company towards the edge.',
  keywords: ['fisheye', 'lens', 'mapping function', 'equidistant', 'equisolid', 'stereographic', 'orthographic', 'rectilinear', 'circular fisheye', 'diagonal fisheye', 'image circle'],
  prereq: ['curvilinear-perspective', 'field-of-view-and-focal-length', 'planar-and-curved-pictures'],
  related: ['equidistant-fisheye', 'equisolid-fisheye', 'stereographic-fisheye', 'rectilinear-lens', 'photography-lenses-and-projections'],
  body: `A fisheye lens does by glass what [[five-point-perspective]] does with a compass: it takes the hemisphere in front of it and presents it on a disc. The lens does not choose a picture surface; it chooses a **mapping function**, a rule that says how far from the centre of the sensor a ray at the angle $\\theta$ from the axis shall land: $r = f\\,g(\\theta)$. The constant $f$ is the focal length, and for small angles every sensible rule gives $g(\\theta) \\approx \\theta$, so the focal length means the same thing in all of them.

### The five rules
| Law | Image radius | What it keeps | Where it is found |
|---|---|---|---|
| Rectilinear | $f\\tan\\theta$ | straight lines | ordinary lenses |
| Equidistant | $f\\theta$ | angles along the radius | scientific all-sky cameras, drawing |
| Equisolid angle | $2f\\sin(\\theta/2)$ | areas | most commercial fisheyes |
| Stereographic | $2f\\tan(\\theta/2)$ | shapes of small things | software, charts, the astrolabe |
| Orthographic | $f\\sin\\theta$ | the outline of a sphere from afar | mirror balls, rarely lenses |

Each can be found on one circle of radius $f$ about the lens: the tangent, the arc, the chord, the line from the opposite pole, the perpendicular — the construction below puts all five on one figure for the same ray.

### Circular and diagonal fisheyes
If the lens is short enough that its image circle (radius $r(90°)$ for a 180° lens) lies inside the sensor, the picture is a circle on a black ground: a **circular fisheye** (8 mm on a full-frame sensor, 4.5 mm on APS-C). If the circle is larger than the sensor, the picture fills the frame and the 180° is reached only along the diagonal: a **diagonal** or full-frame fisheye (about 15 mm on full frame, where the half-diagonal $r_d = 21.63$ mm).

### What to choose
Where the picture will be *measured* — angles of stars, the direction of a meteor — the equidistant law reads off with a ruler. Where it will be *counted* — the fraction of sky covered by cloud or leaves — the equisolid law keeps areas in proportion. Where small shapes must survive the stretching of the edge, the stereographic. Where straight lines matter, the rectilinear, and no 180°.

### What none of them can do
No law keeps both angles and areas; that is Gauss's theorem for maps ([[why-the-sphere-cannot-be-flattened]]) and it applies to the sky as to the Earth.`,
  ideas: [
    'A fisheye lens is defined by its mapping function r = f·g(θ); for small θ they all give r ≈ f·θ.',
    'The five common laws: rectilinear tan θ, equidistant θ, equisolid 2 sin(θ/2), stereographic 2 tan(θ/2), orthographic sin θ.',
    'A circular fisheye puts a disc on the sensor; a diagonal fisheye fills the frame and reaches 180° only across the diagonal.',
    'No law keeps both angles and areas: equidistant reads angles, equisolid keeps areas, stereographic keeps shapes.'
  ],
  pitfalls: [
    'A 180° fisheye has the same focal length as an ordinary lens with the same name — The focal length means f in r = f·g(θ); an 8 mm equidistant lens and an 8 mm rectilinear lens have wildly different fields of view.',
    'A fisheye is a very wide rectilinear lens with the straight lines spoiled — It does not project on a plane at all: the angle is mapped to a distance by a different law, which is why it can see 180° or more.',
    'The fisheye "bends" the world — It does not; every ray is respected. What bends is the picture of a straight line, which on a curved picture surface is a curve.'
  ],
  formulas: [
    {
      name: 'Diagonal field of view of an equidistant fisheye',
      expr: 'D = 2*rd/f',
      tex: 'D = \\frac{2 r_d}{f}',
      vars: { D: { name: 'diagonal field of view', q: 'angle', unit: '°', min: 1, max: 360 }, rd: { name: 'half-diagonal of the sensor', q: 'length', unit: 'mm', value: 21.63, tex: 'r_d' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 } },
      note: 'For the equidistant law the angle off the axis is r/f, so the diagonal field is twice the corner\'s angle. On full frame 15 mm gives 165°; the focal length for exactly 180° is 2·21.63/π = 13.8 mm.'
    },
    {
      name: 'Diameter of the image circle of a 180° equidistant fisheye',
      expr: 'd = pi*f',
      tex: 'd = \\pi f',
      vars: { d: { name: 'diameter of the image circle', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 8 } },
      note: 'The rim is θ = 90° at r = πf/2, so the circle is πf across: 25.1 mm for an 8 mm lens.'
    }
  ],
  examples: [
    {
      title: 'Circular or diagonal?',
      q: 'On a full-frame sensor (36 × 24 mm, half-diagonal 21.63 mm), what is the diagonal field of a 15 mm equidistant fisheye, and is an 8 mm equidistant 180° lens circular or diagonal?',
      steps: [
        { text: 'For the 15 mm lens, with $D = 2r_d/f$:', tex: 'D = \\frac{2 \\times 21.63}{15} = 2.884\\ \\text{rad} = 165.2°' },
        { text: 'The 8 mm lens has an image circle of diameter', tex: '\\pi \\times 8 = 25.1\\ \\text{mm}' },
        'That is larger than the 24 mm height but smaller than the 36 mm width, so the circle is slightly clipped at top and bottom: very nearly a circular fisheye, with the full 180° only in the middle band.'
      ],
      a: '165° for the 15 mm lens; the 8 mm lens gives a 25.1 mm circle, just overfilling the height of the frame.'
    },
    {
      title: 'Where does one ray land?',
      q: 'For f = 10 mm, where does a ray 60° off the axis land under the five laws?',
      steps: [
        { text: 'With $\\theta = 60°$:', tex: 'f\\sin\\theta = 8.66,\\ 2f\\sin\\tfrac{\\theta}{2} = 10.00,\\ f\\theta = 10.47,\\ 2f\\tan\\tfrac{\\theta}{2} = 11.55,\\ f\\tan\\theta = 17.32\\ \\text{mm}' },
        'In order from the centre: orthographic, equisolid, equidistant, stereographic, rectilinear — the order of the construction below.'
      ],
      a: '8.66, 10.00, 10.47, 11.55 and 17.32 mm.'
    }
  ],
  quiz: [
    { q: 'Which law maps the angle θ off the axis to a distance r = f·θ?', choices: ['Rectilinear', 'Equidistant', 'Equisolid', 'Orthographic'], a: 1, why: 'Equidistant: the distance from the centre is proportional to the angle.' },
    { q: 'For f = 10 mm, a ray 60° off the axis lands at what distance under the equisolid law, in mm?', answer: 10, unit: 'mm', why: '2f·sin(30°) = 2 × 10 × 0.5 = 10 mm.' },
    { q: 'All five laws agree for small angles.', a: true, why: 'tan θ, θ, 2 sin(θ/2), 2 tan(θ/2) and sin θ are all ≈ θ for small θ.' },
    { q: 'On a full-frame sensor, a diagonal fisheye covering 180° along the diagonal of an equidistant lens has a focal length of about', choices: ['8 mm', '13.8 mm', '24 mm', '50 mm'], a: 1, why: 'f = 2·r_d/π = 2 × 21.63/π = 13.8 mm.' },
    { q: 'Which fisheye law is the best choice if a program has to count the fraction of the sky covered by cloud?', choices: ['Rectilinear', 'Equisolid angle', 'Stereographic', 'Orthographic'], a: 1, why: 'Equal solid angles are equal areas of the picture, so a fraction of the disc is a fraction of the sky.' }
  ],
  applications: [
    'All-sky cameras on observatories: the whole hemisphere of cloud, aurora and meteors on one frame, with the law chosen to measure angles or count areas.',
    'Hemispherical canopy photography: a fisheye pointed at the zenith gives the fraction of sky open between leaves, for forest ecology and solar studies.',
    'Surveillance and car cameras: a fisheye sees the whole room or the whole surround from one point.',
    'Photography and film: the fisheye\'s curved lines are a look in itself, for skateboarding, architecture and astrophotography of the Milky Way.',
    'Virtual-reality capture: two back-to-back fisheyes of more than 180° make a 360° picture ([[equirectangular-images]]).'
  ],
  history: 'The word "fish-eye" is Robert W. Wood\'s, from a paper of 1906 on how the world looks to a fish looking up from beneath the water, with a simple pinhole camera in a tank. Robert Hill built the first true 180° lens in 1924 for photographing clouds, and Nikon\'s 8 mm f/8 Fisheye-Nikkor of 1962 was the first fisheye lens for the single-lens reflex camera. In 1964 Kenro Miyamoto set out the mathematics of the fisheye projections, including most of the laws in the table above.',
  sources: ['Robert W. Wood, "Fish-eye views, and vision under water", *Philosophical Magazine* 12 (1906).', 'Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).', 'Sidney F. Ray, *Applied Photographic Optics* (3rd ed., Focal Press, 2002), the section on fisheye lenses.', 'Juho Kannala and Sami S. Brandt, "A generic camera model and calibration method for conventional, wide-angle, and fish-eye lenses", *IEEE Transactions on Pattern Analysis and Machine Intelligence* 28 (2006), 1335 – 1340.'],
  sim: 'ld-ring-spacing',
  construction: 'ld-lens-radii'
},

{
  id: 'equidistant-fisheye',
  parent: 'lenses-and-domes',
  title: 'The equidistant fisheye',
  level: 2,
  short: 'The law r = f·θ: the distance from the centre is proportional to the angle from the axis, so rings of equal angle are equally spaced and the angle of any point can be read off with a ruler. It is the picture of five- and six-point perspective, the azimuthal equidistant map of the sky, and the f-θ lens.',
  keywords: ['equidistant', 'f-theta', 'f theta', 'r = f theta', 'angle proportional', 'all-sky camera', 'polar chart', 'azimuthal equidistant', 'ruler', 'rings'],
  prereq: ['fisheye-projections', 'five-point-perspective', 'azimuthal-equidistant-projection'],
  related: ['six-point-perspective', 'dome-projection', 'the-all-sky-view', 'equisolid-fisheye', 'stereographic-fisheye'],
  body: `Among the laws of the fisheye the equidistant is the plainest: a ray at the angle $\\theta$ from the axis lands at
$$r = f\\,\\theta \\qquad (\\theta\\text{ in radians}).$$
Rings of equal angle are equally spaced: 10° steps of the sky are 10 equal steps of the radius. This is the picture drawn by hand in [[five-point-perspective]] and [[six-point-perspective]], and the map of directions that corresponds to the [[azimuthal-equidistant-projection|azimuthal equidistant]] map of the Earth.

### Reading angles with a ruler
If the 180° circle has radius $R$ pixels, a point at distance $r$ from the centre is at $\\theta = 90°\\times r/R$ from the axis, and its azimuth is its direction round the centre. No table, no calculation: a ruler and a protractor give the position of a star, a cloud edge or a meteor to a fraction of a degree. That is why scientific **all-sky cameras** use this law, and why drawings on polar paper with rings every 15° use it too.

### What it costs
Along a ring (round the centre) the picture is stretched by $\\theta/\\sin\\theta$, along the radius not at all: 1.05 at 30°, 1.21 at 60°, 1.57 at 90°. A small circle on the sky near the rim is an ellipse in the picture, wider than tall, and the area scale is the same $\\theta/\\sin\\theta$. The law keeps **no angle and no area** exactly; it is a compromise that is easy to use and gentle in its distortion, roughly midway between the equisolid and the stereographic.

### On a sensor
The diagonal field of view is $D = 2r_d/f$. With 4 µm pixels a lens of $f$ mm gives $f\\pi/180/0.004$ pixels per degree in the middle: 35 for 8 mm, 65 for 15 mm. A 180° circle of 1800 pixels has 10 pixels per degree everywhere along a radius (the law is uniform) but up to 1.57 times as many along a ring at the rim, so the edge of the picture is oversampled in the circumferential direction.

### How it is drawn
Polar paper: circles at equal intervals of $r$, one for each 15°, and radii every 30°. A point of the room is plotted by $r = f\\theta$ and its azimuth; a straight edge is traced through several points or by an arc ([[barre-flocon-method]]). The construction below does it for the far wall of a room.`,
  ideas: [
    'r = f·θ: rings of equal angle are equally spaced, so the angle of any point is 90° × r/R.',
    'The picture is the azimuthal equidistant map of directions — the picture of five- and six-point perspective.',
    'It is neither equal-area nor conformal: along a ring it stretches by θ/sin θ (1.57 at the rim); along the radius not at all.',
    'The diagonal field is D = 2r_d/f; the focal length for 180° across the diagonal of a full-frame sensor is 13.8 mm.'
  ],
  pitfalls: [
    'The equidistant picture keeps distances — It keeps distances from the centre along a radius, as a map centred on a city keeps distances from the city, and nothing else.',
    'Most fisheye lenses are equidistant — Most commercial ones follow the equisolid law or something between that and the equidistant; the true f-θ lenses are made for scanners and for measurement.',
    'Straight lines stay straight through the centre only — They do: lines through the centre are straight, and all others curve. That is what the law does and not an error of the lens.'
  ],
  formulas: [
    {
      name: 'Distance from the centre',
      expr: 'r = f*theta',
      tex: 'r = f\\theta',
      vars: { r: { name: 'distance of the image from the centre', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 8 }, theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' } },
      note: 'With θ in radians (the calculator converts for you): 8 mm × 1.047 = 8.38 mm at 60°.'
    },
    {
      name: 'Pixels per degree at the centre',
      expr: 'ppd = f*pi/180/p',
      tex: '\\mathrm{ppd} = \\frac{f\\pi}{180\\,p}',
      vars: { ppd: { name: 'pixels per degree', tex: '\\mathrm{ppd}' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 8 }, p: { name: 'pixel pitch (side of one pixel)', q: 'length', unit: 'µm', value: 4 } },
      note: 'Valid anywhere along a radius for the equidistant law. A pixel of 4 µm behind an 8 mm lens sees 1/35 of a degree.'
    }
  ],
  examples: [
    {
      title: 'A star on an all-sky picture',
      q: 'An all-sky camera records the horizon-to-horizon sky as a circle 1800 pixels across (equidistant). A star is found 540 pixels from the centre, to the upper left. At what altitude is it, and how far is it from the zenith?',
      steps: [
        'The circle has radius R = 900 pixels for 90°, so one degree is 10 pixels.',
        { text: 'Zenith distance:', tex: '\\theta = 540/10 = 54°,\\qquad \\text{altitude } 90° - 54° = 36°' },
        'Its azimuth is the direction from the centre of the picture, measured from the picture\'s north: no calculation is needed.'
      ],
      a: 'The star is 54° from the zenith, at an altitude of 36°.'
    },
    {
      title: 'The stretch along a ring',
      q: 'By how much is a small circle of the sky stretched along its ring at 45° and at 80° off the axis in the equidistant picture?',
      steps: [
        { text: 'The factor is $\\theta/\\sin\\theta$:', tex: '45°:\\ 0.7854/0.7071 = 1.11,\\qquad 80°:\\ 1.3963/0.9848 = 1.42' },
        'Towards the rim the picture of a round object is an ellipse wider along the ring than along the radius, by up to 1.57.'
      ],
      a: '1.11 at 45° and 1.42 at 80°.'
    }
  ],
  quiz: [
    { q: 'In an equidistant picture whose 180° circle has a radius of 600 pixels, a point at 200 pixels from the centre is at what angle from the axis, in degrees?', answer: 30, unit: '°', why: 'θ = 90° × r/R = 90 × 200/600 = 30°.' },
    { q: 'In the equidistant picture, rings of 15° steps are', choices: ['closer together towards the edge', 'equally spaced', 'further apart towards the edge', 'spaced as the tangent'], a: 1, why: 'r = f·θ: equal steps of θ are equal steps of r.' },
    { q: 'The equidistant law keeps areas true.', a: false, why: 'The area scale is θ/sin θ, which exceeds 1 away from the centre (1.57 at the rim). The law that keeps areas is the equisolid.' },
    { q: 'On full frame (half-diagonal 21.63 mm), an equidistant lens of 20 mm focal length has a diagonal field of view of about', choices: ['62°', '94°', '124°', '180°'], a: 2, why: 'D = 2 r_d/f = 2 × 21.63/20 = 2.163 rad = 123.9°.' },
    { q: 'Along a ring, at the rim of the equidistant picture, the stretch factor is about', answer: 1.57, why: 'θ/sin θ at 90° is (π/2)/1 = 1.57.' }
  ],
  applications: [
    'Scientific all-sky cameras for clouds, aurora and meteors, where the angle of an event is read directly from its distance from the centre.',
    'Drawing curvilinear perspective by hand ([[five-point-perspective]]): polar paper with equally spaced rings.',
    'f-θ scanning lenses in laser printers and engravers, built so that the beam sweeps at a uniform speed across the work.',
    'Planetarium domemaster images ([[dome-projection]]): zenith at the centre, horizon at the rim, altitude proportional to distance.'
  ],
  history: 'The equidistant map is al-Biruni\'s (about 1000) and the polar chart of the sky is as old as navigation by the stars; as a lens law it is among those Miyamoto set out in 1964. The f-θ lens, built so that image position is proportional to angle, became a staple of laser scanning. Barre and Flocon used the law as the picture surface of their curvilinear perspective because it can be laid out with a ruler and a compass.',
  sources: ['Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), azimuthal equidistant.', 'André Barre and Albert Flocon, *Curvilinear Perspective* (University of California Press, 1987).'],
  sim: { id: 'ld-room-lens', params: { model: 'equidistant' } },
  construction: 'ld-fisheye-grid'
},

{
  id: 'equisolid-fisheye',
  parent: 'lenses-and-domes',
  title: 'The equisolid-angle fisheye',
  level: 2,
  short: 'The law r = 2f·sin(θ/2): the length of the chord of the angle θ. Equal solid angles of the sky are equal areas of the picture, so the fraction of the sky covered by cloud or leaves is the fraction of the disc. Most commercial fisheyes follow it; so does a mirror ball photographed from afar.',
  keywords: ['equisolid', 'equal area', 'solid angle', 'chord', 'sin theta over 2', 'Lambert azimuthal', 'canopy photography', 'cloud cover', 'mirror ball', 'fisheye'],
  prereq: ['fisheye-projections', 'lambert-azimuthal-equal-area'],
  related: ['escher-and-curved-space', 'equidistant-fisheye', 'stereographic-fisheye', 'mirror-anamorphosis', 'the-all-sky-view'],
  body: `The equisolid-angle law makes the picture an **equal-area** map of the sphere of directions. A ray at the angle $\\theta$ from the axis lands at
$$r = 2f\\sin\\frac{\\theta}{2}.$$
It is the Lambert azimuthal equal-area projection ([[lambert-azimuthal-equal-area]]) applied to directions. Geometrically $r$ is the length of the chord that the angle $\\theta$ cuts off a circle of radius $f$: with the compass fixed at the point of the circle on the axis and the pencil on the ray, one swing lays $r$ along the picture line.

### Why it keeps areas
A thin ring between $\\theta$ and $\\theta + \\mathrm{d}\\theta$ covers the solid angle $2\\pi\\sin\\theta\\,\\mathrm{d}\\theta$. On the picture it is a ring of radius $2f\\sin(\\theta/2)$ and width $f\\cos(\\theta/2)\\,\\mathrm{d}\\theta$, so its area is $2\\pi\\cdot 2f\\sin(\\theta/2)\\cdot f\\cos(\\theta/2)\\,\\mathrm{d}\\theta = 2\\pi f^2\\sin\\theta\\,\\mathrm{d}\\theta$. Dividing,
$$\\text{area on the picture} = f^2 \\times \\text{solid angle}.$$
Every patch of the sky is drawn with the same area per steradian, wherever it is. A cloud that fills a tenth of the sky fills a tenth of the disc; leaves that cover a third of the sky cover a third of the picture.

### What it costs
Areas are true, so shapes must give: along the radius the scale is $\\cos(\\theta/2)$ and across it $1/\\cos(\\theta/2)$, the product being 1. Near the rim a small circle of the sky becomes an ellipse $\\cos^2(\\theta/2)$ — 0.5 at 90° — as wide again as it is long. The rings crowd towards the edge: for $f = 70$ mm the 180° ring is only 4.8 mm outside the 150° ring, in a picture 140 mm in radius.

### On a sensor
The diagonal field of view is $4\\arcsin(r_d/2f)$. An 8 mm circular fisheye of this law has an image circle of $2\\sqrt 2\\,f = 22.6$ mm, which fits the 24 mm height of a full-frame sensor: a complete, round 180°. A mirror ball photographed from far away is also an equisolid picture ([[escher-and-curved-space]]), with $f$ = half the radius of the ball.

### How it is drawn
Draw the circle of radius $f$, mark the ray at $\\theta$, and swing the compass about the axis point through the ray's point on the circle to meet the picture line: that distance is $r$. The construction below does this for the rings of 30°.`,
  ideas: [
    'r = 2f·sin(θ/2) is the length of the chord of the angle θ in a circle of radius f.',
    'Equal solid angles are equal areas on the picture: area = f² × solid angle.',
    'Shapes pay for it: along the radius the scale is cos(θ/2), across it 1/cos(θ/2); the rings crowd towards the edge.',
    'A mirror ball seen from far away is an equisolid picture, with f = a/2.'
  ],
  pitfalls: [
    'Equal-area means every object is drawn with the right shape — Equal area means equal area per unit of sky; the shape of a small object is squeezed along the radius and stretched across it.',
    'The equisolid fisheye is just the equidistant one with another name — Close for small θ, they differ by 10 % at 90°: the equisolid ring at 90° is 1.414 f, the equidistant 1.571 f.',
    'Equal-area lets you measure angles from the picture — The angle off the axis is θ = 2 arcsin(r/2f), not proportional to r: the rings are not equally spaced.'
  ],
  formulas: [
    {
      name: 'Distance from the centre',
      expr: 'r = 2*f*sin(theta/2)',
      tex: 'r = 2f\\sin\\frac{\\theta}{2}',
      vars: { r: { name: 'distance of the image from the centre', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 8 }, theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' } },
      note: 'At θ = 90° the radius is 2 f sin 45° = 1.414 f: 11.3 mm for an 8 mm lens, an image circle 22.6 mm across.'
    },
    {
      name: 'Area on the picture of a patch of sky',
      expr: 'A = f^2*Omega',
      tex: 'A = f^2\\,\\Omega',
      vars: { A: { name: 'area of the patch on the picture', q: 'area', unit: 'mm²' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 8 }, Omega: { name: 'solid angle of the patch of sky', q: 'solidangle', unit: 'sr', value: 0.5, tex: '\\Omega' } },
      note: 'Valid wherever the patch is: this is what makes the law equal-area. The whole sky of 2π sr fills a disc of area 2π f² (radius 1.414 f).'
    },
    {
      name: 'Diagonal field of view',
      expr: 'D = 4*asin(rd/(2*f))',
      tex: 'D = 4\\arcsin\\frac{r_d}{2f}',
      vars: { D: { name: 'diagonal field of view', q: 'angle', unit: '°', min: 1, max: 360 }, rd: { name: 'half-diagonal of the sensor', q: 'length', unit: 'mm', value: 14.18, tex: 'r_d' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 10.5 } },
      note: 'For an APS-C sensor (23.6 × 15.7 mm) with a 10.5 mm lens the ideal law gives 170°; real diagonal fisheyes of this focal length reach 180° by departing a little from it.'
    }
  ],
  examples: [
    {
      title: 'A circular fisheye of 8 mm',
      q: 'An 8 mm lens follows the equisolid law. How big is its 180° image circle, and how far apart are the 60° and 90° rings?',
      steps: [
        { text: 'At 90°, $r = 2 \\times 8 \\times \\sin 45° = 11.31$ mm: the circle is 22.6 mm across, which fits the 24 mm height of the full-frame sensor.', tex: 'r_{90°} = 11.31\\ \\text{mm}' },
        { text: 'At 60°, $r = 2 \\times 8 \\times \\sin 30° = 8.00$ mm, so the two rings are', tex: '11.31 - 8.00 = 3.31\\ \\text{mm apart}' },
        'In the equidistant law the same rings would be $8\\times 1.047 = 8.38$ and $8 \\times 1.571 = 12.57$ mm: 4.2 mm apart. The equisolid picture is more crowded at the edge.'
      ],
      a: 'The image circle is 22.6 mm across; the 60° and 90° rings are 3.3 mm apart.'
    },
    {
      title: 'Counting cloud',
      q: 'On an equisolid all-sky picture a disc of 1000 pixels in diameter, 380 000 pixels are cloud. What fraction of the sky is covered?',
      steps: [
        { text: 'The disc has $\\pi \\times 500^2 = 785\\,400$ pixels, and area is proportional to solid angle:', tex: '380\\,000/785\\,400 = 0.48' }
      ],
      a: 'About 48 % of the sky (no correction is needed because the picture is equal-area).'
    }
  ],
  quiz: [
    { q: 'Under the equisolid law with f = 10 mm, how far from the centre does a ray 120° off the axis land, in mm?', answer: 17.3, unit: 'mm', why: 'r = 2 f sin 60° = 2 × 10 × 0.866 = 17.3 mm.' },
    { q: 'What does the equisolid law keep?', choices: ['Angles', 'Areas (solid angle ↔ area)', 'Straight lines', 'Distances from the centre'], a: 1, why: 'Equal solid angles are equal areas of the picture.' },
    { q: 'In the equisolid picture the rings of equal angle are', choices: ['equally spaced', 'closer together towards the edge', 'further apart towards the edge', 'concentric squares'], a: 1, why: 'dr/dθ = f cos(θ/2) decreases from f at the centre to 0.707 f at 90°.' },
    { q: 'A mirror ball seen from far away is an equisolid picture of the surroundings.', a: true, why: 'A point of the room at the angle θ′ from the direction towards the viewer appears at a·sin(θ′/2) from the centre: the equisolid law with f = a/2.' },
    { q: 'The whole sky (2π steradians of a hemisphere) fills an equisolid disc of what area, in terms of f²?', choices: ['π f²', '2π f²', '4π f²', '8π f²'], a: 1, why: 'A = f² × Ω = 2π f².' }
  ],
  applications: [
    'Hemispherical canopy photography: the fraction of open sky between leaves is the fraction of open pixels, with no area correction.',
    'Cloud-cover cameras at weather stations and airports.',
    'Most commercial fisheye lenses, which follow this law closely or a law between it and the equidistant.',
    'Photographic light probes: a chrome ball photographed from afar is an equisolid picture of the whole lighting environment ([[escher-and-curved-space]]).'
  ],
  history: 'The projection is Lambert\'s of 1772, who gave it as a map of the hemisphere (and so it appears in the azimuthal family). As a lens law it is among those Miyamoto set out in 1964; most commercial fisheyes from the 1960s onward follow it closely, because it keeps the illumination of the picture almost even and the lens design simple.',
  sources: ['Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), Lambert azimuthal equal-area.', 'Sidney F. Ray, *Applied Photographic Optics* (3rd ed., Focal Press, 2002).'],
  sim: { id: 'ld-coins', params: { model: 'equisolid' } },
  construction: 'ld-equisolid-rings'
},

{
  id: 'stereographic-fisheye',
  parent: 'lenses-and-domes',
  title: 'The stereographic fisheye',
  level: 2,
  short: 'The law r = 2f·tan(θ/2): a ray lands where the line from the opposite pole of the sphere of directions meets the picture plane. Angles are kept, so every circle of the sky is a circle in the picture and small things keep their shape; the price is an edge that is stretched without limit towards 180°.',
  keywords: ['stereographic', 'conformal', 'circles to circles', 'tan theta over 2', 'inversion', 'astrolabe', 'little planet', 'Hipparchus', 'shape preserving', 'fisheye'],
  prereq: ['fisheye-projections', 'stereographic-projection', 'conformal-maps'],
  related: ['little-planet', 'the-astrolabe', 'the-all-sky-view', 'equidistant-fisheye', 'equisolid-fisheye'],
  body: `The stereographic law is the one that keeps **shapes**. A ray at the angle $\\theta$ from the axis lands at
$$r = 2f\\tan\\frac{\\theta}{2}.$$
To find it, take the sphere of directions as a circle of radius $f$ about the lens, put the picture plane tangent to it at the point $A$ where the axis meets it, and join the opposite point $S$ (the antipode of $A$) to the point $P$ of the ray: the line from $S$ through $P$ meets the plane at distance $2f\\tan(\\theta/2)$ from $A$. This is the stereographic projection of [[stereographic-projection|the map-maker]], which Hipparchus used for the sky and which became the astrolabe.

### Why it keeps shapes
Two things follow from the geometry of the projection. First, it is **conformal**: a small figure keeps its shape, because the scale is the same in every direction, equal to $\\sec^2(\\theta/2)$ (the radius and the ring both stretch by it). Second, it sends **circles to circles**: every circle on the sphere of directions — a small circle round the axis, a great circle, a horizon of a tilted camera — is a circle in the picture (a straight line when the circle passes through the pole $S$). This is why straight lines, which are great circles, become exact circular arcs in the picture, and why the compass construction of [[barre-flocon-method]] is exact here.

### What it costs
The scale grows from 1 at the centre to 2 at 90°, 4 at 120°, 15 at 150° and infinity at 180°. A ball at 90° is drawn twice as wide as at the centre, with four times the area. The rings spread out towards the rim (see the construction below), so the picture of the hemisphere is 27 % wider than the equidistant one (radius 2f against 1.57f), and a field beyond 180° cannot be shown within reason. For the same reason a stereographic fisheye lens is hard to make: the edge needs far more resolution than the centre.

### On a sensor and on a screen
The diagonal field is $4\\arctan(r_d/2f)$. In software the stereographic projection is the one of the *little planet* ([[little-planet]]), where a 360° panorama is wrapped round the nadir and the buildings stand on the rim like small towers, and of the *polar charts* of the sky and the astrolabe. A panorama needs no special lens for this: one takes the equirectangular picture and re-projects it.

### How it is drawn
Circle of radius $f$, pole $S$, a ray from $S$ through each point $P$: the intersection with the picture line is the ring radius. The construction below draws the rings of 30° steps.`,
  ideas: [
    'r = 2f·tan(θ/2): the line from the opposite pole of the sphere of directions through the ray\'s point meets the picture plane there.',
    'It is conformal: the scale sec²(θ/2) is the same in all directions, so small shapes are kept (circles stay circles).',
    'Every circle of the sphere is a circle in the picture — straight lines of the room become exact arcs.',
    'The edge is stretched: the scale is 2 at 90°, 4 at 120°, infinite at 180°.'
  ],
  pitfalls: [
    'The stereographic picture is the same as the equidistant one but with a different formula — They differ in what they keep: shapes against distances from the centre. The stereographic rings spread out, the equidistant ones are even.',
    'A conformal picture has no distortion — It has none of shape for small things, but the scale changes from centre to edge: an object at the edge is drawn several times larger than at the centre.',
    'Conformal means the picture is a true-to-scale copy — It means the angles between crossing curves are kept at every point; the scale itself changes from point to point, by sec²(θ/2).'
  ],
  formulas: [
    {
      name: 'Distance from the centre',
      expr: 'r = 2*f*tan(theta/2)',
      tex: 'r = 2f\\tan\\frac{\\theta}{2}',
      vars: { r: { name: 'distance of the image from the centre', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 10 }, theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 90, min: 0, max: 170, tex: '\\theta' } },
      note: 'At θ = 90° the radius is 2f; at 120° 3.46 f; at 150° 7.46 f; at 180° it is infinite.'
    },
    {
      name: 'Scale (the same in every direction)',
      expr: 'm = 1/cos(theta/2)^2',
      tex: 'm = \\frac{1}{\\cos^2(\\theta/2)}',
      vars: { m: { name: 'scale of the picture relative to the centre' }, theta: { name: 'angle off the axis', q: 'angle', unit: '°', value: 90, min: 0, max: 170, tex: '\\theta' } },
      note: 'The area scale is m². At 90° m = 2, the area 4; at 120° m = 4, the area 16.'
    },
    {
      name: 'Diagonal field of view',
      expr: 'D = 4*atan(rd/(2*f))',
      tex: 'D = 4\\arctan\\frac{r_d}{2f}',
      vars: { D: { name: 'diagonal field of view', q: 'angle', unit: '°', min: 1, max: 360 }, rd: { name: 'half-diagonal of the sensor', q: 'length', unit: 'mm', value: 21.63, tex: 'r_d' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 10 } },
      note: 'On full frame a 10 mm stereographic lens covers 189° across the diagonal.'
    }
  ],
  examples: [
    {
      title: 'The rings of 30° steps',
      q: 'With f = 60 mm, where are the rings at 30°, 60°, 90° and 120° in the stereographic picture, and how does their spacing compare with the equidistant?',
      steps: [
        { text: 'With $r = 2f\\tan(\\theta/2) = 120\\tan(\\theta/2)$:', tex: 'r = 32.2,\\ 69.3,\\ 120.0,\\ 207.8\\ \\text{mm}' },
        { text: 'The steps between the rings are', tex: '32.2,\\ 37.1,\\ 50.7,\\ 87.8\\ \\text{mm}' },
        'In the equidistant picture the rings are 62.8 mm apart everywhere (60 mm × 1.047). The stereographic ones are closer than that near the centre (32.2 mm) and wider at the edge (87.8 mm).'
      ],
      a: 'Rings at 32.2, 69.3, 120.0 and 207.8 mm: steps that grow with the angle.'
    },
    {
      title: 'How much bigger is something at the edge?',
      q: 'In a stereographic picture, how many times larger is a small object at 120° off the axis, in length and in area, than the same object at the centre?',
      steps: [
        { text: '$m = 1/\\cos^2(60°)$:', tex: 'm = 1/0.25 = 4\\ \\text{in length},\\qquad m^2 = 16\\ \\text{in area}' }
      ],
      a: '4 times as large in length, 16 times in area.'
    }
  ],
  quiz: [
    { q: 'What is the scale of the stereographic picture at 90° off the axis, relative to the centre?', answer: 2, why: 'm = 1/cos²(45°) = 2.' },
    { q: 'What does the stereographic law keep?', choices: ['Areas', 'The shapes of small things (angles)', 'Distances from the centre', 'All straight lines'], a: 1, why: 'It is conformal: the scale is the same in every direction at a point.' },
    { q: 'With f = 10 mm, a ray 90° off the axis lands at what distance, in mm?', answer: 20, unit: 'mm', why: 'r = 2f·tan 45° = 20 mm.' },
    { q: 'In the stereographic picture every circle of the sphere of directions is a circle (or a straight line).', a: true, why: 'This is the characteristic property of the stereographic projection; it passes through the pole S exactly when the picture is a straight line.' },
    { q: 'Why is a stereographic fisheye lens hard to make?', choices: ['It needs a bigger sensor', 'The edge is stretched without limit and needs far more resolution than the centre', 'It cannot see more than 90°', 'Its image circle has no edge'], a: 1, why: 'The scale grows like sec²(θ/2): at 150° it is 15 times the central one.' }
  ],
  applications: [
    'Little planets: a 360° panorama wrapped round the nadir ([[little-planet]]), the most popular use of the stereographic picture today.',
    'The astrolabe and planisphere: the sky on a plate, with circles of the sky as circles on the brass ([[the-astrolabe]]).',
    'Polar maps and navigation charts: UPS polar charts and aeronautical charts of high latitudes.',
    'Crystallography: the stereographic net for the angles between crystal faces ([[crystallography-stereographic]]).',
    'Some wide-angle lens designs, where the preserved shapes at the edge are wanted more than the economy of the lens.'
  ],
  history: 'The stereographic projection is credited to Hipparchus (about 150 BC); Ptolemy wrote the *Planisphaerium* on it and it is the geometry of the astrolabe. That circles stay circles is already in Ptolemy\'s treatise; the conformal character of the projection was put to use in the map theory of Lambert and Gauss. As a photographic law it is rarer than the equidistant and equisolid, but it is the standard of panorama software and of the "little planet" picture.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), the stereographic chapter.', 'James Evans, *The History and Practice of Ancient Astronomy* (Oxford, 1998), on the astrolabe.', 'Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).'],
  sim: { id: 'ld-coins', params: { model: 'stereographic' } },
  construction: 'ld-stereo-rings'
},

{
  id: 'rectilinear-lens',
  parent: 'lenses-and-domes',
  title: 'The rectilinear lens',
  level: 1,
  short: 'The ordinary lens: a ray at the angle θ from the axis lands at r = f·tan θ on a flat sensor, so straight lines of the scene are straight in the picture. The field of view is 2·arctan(w/2f); beyond about 100° the stretching of the edge makes a rectilinear lens a poor choice and the fisheye takes over.',
  keywords: ['rectilinear', 'gnomonic', 'tan theta', 'ordinary lens', 'field of view', 'focal length', 'crop factor', 'straight lines', 'distortion', 'wide angle', 'Rapid Rectilinear'],
  prereq: ['field-of-view-and-focal-length', 'central-projection'],
  related: ['wide-angle-and-the-limits-of-the-plane', 'fisheye-projections', 'tilt-shift-and-view-cameras', 'photography-lenses-and-projections', 'foreshortening'],
  body: `The camera on the table is the case from which all the others depart. A good ordinary lens is **rectilinear**: it projects the scene centrally onto a flat sensor, so a ray at the angle $\\theta$ from the axis lands at
$$r = f\\tan\\theta,$$
and every straight line of the scene is a straight line on the sensor. That is the picture of linear perspective ([[central-projection]]): the sensor is the picture plane, the node of the lens is the eye, and the focal length $f$ is the distance from one to the other when the lens is focused at infinity.

### Field of view
A sensor of width $w$ sees the horizontal angle
$$\\alpha = 2\\arctan\\frac{w}{2f},$$
and the same formula with the height or the half-diagonal gives the vertical or the diagonal field. On full frame (36 × 24 mm, half-diagonal 21.63 mm) a 50 mm lens gives a diagonal field of $46.8°$, a 35 mm lens $63.4°$, a 24 mm lens $84.1°$, a 14 mm lens $114.2°$. A smaller sensor sees less with the same lens: the "crop factor" $c$ is the ratio of the half-diagonals, and a lens of focal length $f$ on such a sensor gives the field of view of a lens of $c\\,f$ on full frame (so the 35 mm equivalent of a 16 mm lens on APS-C, $c = 1.5$, is 24 mm).

### What it keeps and what it loses
It keeps all straight lines; it keeps the geometry of a pinhole picture (the picture can be viewed from the centre of projection and then looks exactly like the scene). It loses the edge: with $\\tan\\theta$ the stretch along the radius is $\\sec^2\\theta$ and across it $\\sec\\theta$ ([[wide-angle-and-the-limits-of-the-plane]]), the ray at 90° never reaches the sensor, and most designs are limited to about 120° of diagonal field, with heavy vignetting at the corners. A rectilinear lens must be designed so that its aberrations leave the law $r = f\\tan\\theta$ intact — "barrel" and "pincushion" distortion are departures from it, and software corrects them by remapping.

### Moving the picture plane
Shifting the sensor off the axis, as a view camera or a shift lens does, changes the part of the picture that is used without changing the perspective: the verticals of a building stay parallel when the camera is level and the lens is raised. Tilting the plane turns the plane of focus ([[tilt-shift-and-view-cameras]]). The rectilinear law is unchanged: it is all central projection onto a plane.

### How it is drawn
At a drawing board: eye O, the axis, the picture line at distance $f$, rays at 15° steps to it. The marks fall at $f\\tan\\theta$ — equal angles, unequal lengths, as the construction below shows. For a drawing of a room, see [[one-point-perspective]], where this law is the whole story.`,
  ideas: [
    'A rectilinear lens obeys r = f·tan θ: straight lines of the scene are straight in the picture.',
    'The field of view across a sensor of width w is 2·arctan(w/2f); a smaller sensor sees less with the same lens, by the crop factor.',
    'The edge is stretched (sec²θ along the radius, sec θ across); no rectilinear lens can reach 180°.',
    'Shifting the sensor or lens changes the framing, not the perspective: verticals stay parallel.'
  ],
  pitfalls: [
    'A wide-angle lens exaggerates perspective — Perspective depends only on where the eye (the lens) is. A wide lens shows more, and the stretching at its edge is what gives the exaggerated look.',
    'Straight lines stay straight in every lens — Only in the rectilinear one. A fisheye bends them, and a good rectilinear zoom may bend them slightly (distortion), which software corrects.',
    'The focal length alone gives the field of view — It needs the size of the sensor too: 24 mm is wide on full frame (84°) and normal on a small sensor.'
  ],
  formulas: [
    {
      name: 'Field of view of a sensor',
      expr: 'alpha = 2*atan(w/(2*f))',
      tex: '\\alpha = 2\\arctan\\frac{w}{2f}',
      vars: { alpha: { name: 'field of view', q: 'angle', unit: '°', min: 1, max: 179, tex: '\\alpha' }, w: { name: 'width (or height, or diagonal) of the sensor', q: 'length', unit: 'mm', value: 36 }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 } },
      note: 'Use the width for the horizontal, the height for the vertical and the diagonal (43.27 mm on full frame) for the diagonal field. At 24 mm: 73.7°, 53.1°, 84.1°.'
    },
    {
      name: 'Distance from the centre of a ray',
      expr: 'r = f*tan(theta)',
      tex: 'r = f\\tan\\theta',
      vars: { r: { name: 'distance of the image from the centre of the sensor', q: 'length', unit: 'mm' }, f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 }, theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 40, min: 0, max: 89, tex: '\\theta' } },
      note: 'For small angles r ≈ f·θ; at 45° r = f.'
    },
    {
      name: 'Equivalent focal length on full frame',
      expr: 'feq = f*c',
      tex: 'f_{\\mathrm{eq}} = c\\,f',
      vars: { feq: { name: 'equivalent focal length (same field of view on full frame)', q: 'length', unit: 'mm', tex: 'f_{\\mathrm{eq}}' }, f: { name: 'actual focal length', q: 'length', unit: 'mm', value: 16 }, c: { name: 'crop factor: ratio of the sensor diagonals (full frame ÷ this sensor)', value: 1.5 } },
      note: 'Equivalent in field of view only (and in the look of the perspective); the depth of field and the light gathered differ with the size of the sensor.'
    }
  ],
  examples: [
    {
      title: 'The four standard lenses',
      q: 'On a full-frame sensor, 36 × 24 mm with half-diagonal 21.63 mm, what are the horizontal and the diagonal fields of view of a 24 mm lens, and what focal length would give a diagonal field of 100°?',
      steps: [
        { text: 'Horizontal: $2\\arctan(18/24) = 73.7°$. Diagonal:', tex: '2\\arctan\\frac{21.63}{24} = 2 \\times 42.03° = 84.1°' },
        { text: 'For 100° diagonal we need $r_d/f = \\tan 50° = 1.192$:', tex: 'f = 21.63/1.192 = 18.1\\ \\text{mm}' }
      ],
      a: 'Horizontal 73.7°, diagonal 84.1°; an 18 mm lens gives a 100° diagonal field.'
    },
    {
      title: 'The equivalent of a small-sensor lens',
      q: 'A compact camera has a sensor 6.17 × 4.55 mm (half-diagonal 3.83 mm) and a 5 mm lens. What focal length on full frame gives the same diagonal field of view?',
      steps: [
        { text: 'The field is $2\\arctan(3.83/5) = 74.9°$. On full frame the same field needs', tex: 'f_{eq} = 21.63/\\tan(37.45°) = 28.2\\ \\text{mm}' },
        'The crop factor is 21.63/3.83 = 5.65, and 5 × 5.65 = 28.2 mm.'
      ],
      a: 'About 28 mm: a 5 mm lens on that sensor sees what a 28 mm lens sees on full frame.'
    }
  ],
  quiz: [
    { q: 'What is the horizontal field of view of a 50 mm rectilinear lens on a 36 mm wide sensor, in degrees?', answer: 39.6, unit: '°', why: '2·arctan(18/50) = 2 × 19.8° = 39.6°.' },
    { q: 'In the rectilinear picture a ray 45° off the axis lands at what distance from the centre?', choices: ['0.5 f', 'f', '1.5 f', '2 f'], a: 1, why: 'r = f·tan 45° = f.' },
    { q: 'A rectilinear lens can be designed to cover 180°.', a: false, why: 'The ray at 90° is parallel to the sensor and never meets it; the width needed grows without limit.' },
    { q: 'The same 24 mm lens on a smaller sensor gives', choices: ['a wider field of view', 'the same field of view', 'a narrower field of view, as if cropped from the centre', 'a different perspective'], a: 2, why: 'The sensor sees only the central part of the same picture.' },
    { q: 'Do wide-angle lenses change the perspective of a scene?', choices: ['Yes, they exaggerate depth', 'No: perspective depends only on the position of the lens; a wide lens shows more and stretches its edge', 'Yes, they flatten it', 'Only above 100°'], a: 1, why: 'Move the camera and the perspective changes; change only the focal length and you merely crop or widen the same perspective.' }
  ],
  applications: [
    'Architecture and interiors, where straight lines must stay straight: wide rectilinear and shift lenses.',
    'Product and documentary photography, where the picture is a measurable central projection (photogrammetry relies on it).',
    'Cinema and television: nearly all film lenses are rectilinear up to about 100°.',
    'Computer graphics: the standard camera of a game or of a renderer is rectilinear with a chosen field of view ([[3d-graphics-pipeline]]).'
  ],
  history: 'The first photographic lenses distorted straight lines; the Rapid Rectilinear of 1866, designed independently by John Dallmeyer in London and Adolph Steinheil in Munich, was the first to render them straight over a useful field, and gave its name to the class. The Goerz Hypergon (1900) covered a field of about 135° on the plate, the widest of its time; for fields wider than that the fisheyes of Wood (1906) and Hill (1924) took over.',
  sources: ['Sidney F. Ray, *Applied Photographic Optics* (3rd ed., Focal Press, 2002), the chapters on distortion and on wide-angle lenses.', 'Rudolf Kingslake, *A History of the Photographic Lens* (Academic Press, 1989).', 'Richard Hartley and Andrew Zisserman, *Multiple View Geometry in Computer Vision* (Cambridge, 2nd ed., 2004), the pinhole camera.'],
  sim: { id: 'ld-room-lens', params: { model: 'rectilinear' } },
  construction: 'mp-tangent-scale'
},

{
  id: 'equirectangular-images',
  parent: 'lenses-and-domes',
  title: 'Equirectangular images: the 360° photograph',
  level: 2,
  short: 'The format in which a 360° photograph is stored: longitude is the horizontal coordinate and latitude the vertical one, on a rectangle twice as wide as high. Every direction has one pixel, vertical lines of the scene stay vertical, and the zenith and nadir are stretched into whole rows.',
  keywords: ['equirectangular', 'plate carrée', '360° photo', 'panorama', 'longitude', 'latitude', 'photosphere', 'VR', 'spherical image', 'pixel density', 'poles'],
  prereq: ['equirectangular-projection', 'curvilinear-perspective'],
  related: ['cube-maps', 'panoramas-and-360', 'dome-projection', 'little-planet', 'cylindrical-panoramas'],
  body: `A 360° photograph holds every direction from one point, and the simplest way to store it as a rectangle is the one that a geographer uses for a world map: take the longitude $\\lambda$ of the direction as the horizontal coordinate and the latitude $\\varphi$ as the vertical one. The image is **twice as wide as high**, 360° across and 180° from the zenith to the nadir. It is the [[equirectangular-projection|equirectangular projection]] of Marinus of Tyre, here applied to the sphere of directions round a camera instead of the globe.

### The mapping
For a direction $(x, y, z)$ with $z$ ahead and $y$ up,
$$\\lambda = \\operatorname{atan2}(x, z), \\qquad \\varphi = \\arcsin\\frac{y}{\\sqrt{x^2 + y^2 + z^2}},$$
and the pixel is $u = \\frac{\\lambda + \\pi}{2\\pi}W$ across, $v = \\frac{\\pi/2 - \\varphi}{\\pi}H$ down, with $H = W/2$. For an angular resolution $\\delta$ (radians per pixel) at the equator, $W = 2\\pi/\\delta$.

### What it keeps and what it loses
It keeps **vertical lines vertical and straight** — a vertical edge of a building is a vertical line, but it stops short of the poles, since a line at a fixed distance never reaches the zenith — and keeps the horizon straight. Horizontal lines at height $h$ become the arches of [[four-point-perspective]]; the edges running away from the viewer become humps (see the diagram below). It does not keep areas: a row at latitude $\\varphi$ has a circle of circumference $2\\pi\\cos\\varphi$ drawn as a full width, so the picture is stretched sideways by $1/\\cos\\varphi$ (2 at 60°, 5.8 at 80°). The zenith and nadir are not points but whole rows. Overall, about $1 - 2/\\pi = 36\\,\\%$ of the pixels are surplus to the sphere's own share.

### Why it is so common
It is trivial to compute and to display: a viewer turns the sphere by looking up each screen pixel's direction in the image, as the simulation does. One image file, one rectangle, 2 : 1: that is the format of video and photo "spheres", of street-view panoramas and of high-dynamic-range lighting maps. Its defects (waste at the poles, uneven sampling) are accepted for the simplicity. Where they matter, a [[cube-maps|cube map]] or a stereographic re-projection is used instead.

### How it is drawn
On a rectangle 360 × 180 units: meridians every 30° and parallels every 30°, then the room's corners from a table ($\\lambda = \\arctan(x/z)$, $\\varphi = \\arcsin(y/d)$), and curves through computed points. The construction below does this for a room.`,
  ideas: [
    'Longitude across, latitude up: a 2 : 1 rectangle, 360° × 180°, with one pixel per direction.',
    'Vertical lines stay vertical and straight; horizontals become arches; the zenith and the nadir become whole rows.',
    'The picture is stretched sideways by 1/cos φ; about 36 % of the rectangle is surplus to the sphere\'s share.',
    'The width for a resolution δ is W = 2π/δ: 8192 px give 22.8 pixels per degree.'
  ],
  pitfalls: [
    'The 360° picture is a panorama like any other — A cylindrical panorama cannot show up and down. The equirectangular rectangle holds the whole sphere, so it can show the ceiling and the floor, stretched.',
    'Each pixel covers the same piece of sky — Each pixel covers the same angle of longitude and latitude, but a solid angle proportional to cos φ: pixels near the poles are crowded into a tiny patch of sky.',
    'Straight lines of the room stay straight in a 360° picture — Only vertical ones (and only in their middle). Everything else is a curve; the picture must be re-projected to a window before it looks natural.'
  ],
  formulas: [
    {
      name: 'Width of the image for a resolution',
      expr: 'W = 2*pi/delta',
      tex: 'W = \\frac{2\\pi}{\\delta}',
      vars: { W: { name: 'width of the image in pixels' }, delta: { name: 'angle of one pixel at the equator', q: 'angle', unit: '°', value: 0.044, min: 0.001, max: 5, tex: '\\delta' } },
      note: 'The height is half of it. For 0.044° per pixel: 8180 pixels across — the "8K" 360° picture.'
    },
    {
      name: 'Column of a direction',
      expr: 'x = (lam + pi)/(2*pi)*W',
      tex: 'x = \\frac{\\lambda + \\pi}{2\\pi}\\,W',
      vars: { x: { name: 'column of the pixel' }, lam: { name: 'longitude (azimuth from straight ahead)', q: 'angle', unit: '°', value: 60, signed: true, min: -180, max: 180, tex: '\\lambda' }, W: { name: 'width of the image in pixels', value: 8192 } },
      note: 'Straight ahead (λ = 0) is the middle column; ±180° are the edges.'
    },
    {
      name: 'Row of a direction',
      expr: 'y = (pi/2 - phi)/pi*H',
      tex: 'y = \\frac{\\pi/2 - \\varphi}{\\pi}\\,H',
      vars: { y: { name: 'row of the pixel, from the top' }, phi: { name: 'latitude (altitude)', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\varphi' }, H: { name: 'height of the image in pixels', value: 4096 } },
      note: 'The horizon (φ = 0) is the middle row; the zenith is row 0.'
    },
    {
      name: 'Sideways stretch at a latitude',
      expr: 's = 1/cos(phi)',
      tex: 's = \\frac{1}{\\cos\\varphi}',
      vars: { s: { name: 'stretch of the picture along a row, relative to the equator' }, phi: { name: 'latitude', q: 'angle', unit: '°', value: 60, min: 0, max: 85, tex: '\\varphi' } },
      note: 'The solid angle of a pixel is proportional to cos φ: the pole rows hold almost no sky.'
    }
  ],
  examples: [
    {
      title: 'An 8K sphere',
      q: 'A 360° picture is 8192 × 4096 pixels. What is the angle of a pixel at the equator, and how many pixels span one degree at the horizon and at latitude 60°?',
      steps: [
        { text: 'At the equator, $\\delta = 360°/8192 = 0.0439°$ per pixel, so', tex: '8192/360 = 22.8\\ \\text{pixels per degree}' },
        { text: 'At latitude 60° one degree of longitude is $\\cos 60° = 0.5$ of a degree of arc but still $22.8$ pixels wide, so measured along the arc the density is', tex: '22.8/0.5 = 45.5\\ \\text{pixels per degree of arc}' },
        'The picture is therefore sampled twice as densely sideways at 60° as at the horizon; at 80° nearly six times.'
      ],
      a: '22.8 pixels per degree at the horizon, 45.5 along the arc at 60°.'
    },
    {
      title: 'Where is a window corner?',
      q: 'On that 8192 × 4096 picture, in which column and row is the direction at longitude +60° and altitude +30°?',
      steps: [
        { text: 'Column:', tex: 'x = \\frac{60° + 180°}{360°} \\times 8192 = 5461' },
        { text: 'Row:', tex: 'y = \\frac{90° - 30°}{180°} \\times 4096 = 1365' }
      ],
      a: 'Column 5461, row 1365 (counting from the top left).'
    }
  ],
  quiz: [
    { q: 'What is the shape of a full equirectangular picture?', choices: ['Square', 'Twice as wide as high', 'Three times as wide as high', 'A circle'], a: 1, why: '360° of longitude across and 180° of latitude up.' },
    { q: 'In an 8192-pixel-wide equirectangular picture, the direction straight ahead (longitude 0) is in which column?', answer: 4096, why: 'x = (0 + π)/(2π) × 8192 = 4096.' },
    { q: 'A vertical edge of a room is drawn in the equirectangular picture as', choices: ['a straight vertical segment', 'an arch', 'a diagonal line', 'a circle'], a: 0, why: 'It has constant longitude, so constant column; it is straight and vertical — and ends before the poles.' },
    { q: 'How much is the picture stretched sideways at latitude 60°?', answer: 2, why: '1/cos 60° = 2.' },
    { q: 'About what fraction of the pixels of an equirectangular picture are surplus to the sphere\'s own share?', choices: ['4 %', '36 %', '60 %', '90 %'], a: 1, why: 'The rectangle has area 2π² (in square radians) for the sphere\'s 4π: 1 − 2/π = 36 %.' }
  ],
  applications: [
    'Storage format of 360° photographs and videos: one 2 : 1 rectangle for the whole sphere (photo spheres, VR video, street-view panoramas).',
    'High-dynamic-range lighting maps for film and games: an equirectangular image of the sky and surroundings lights a computer-made scene.',
    'Sky surveys and planetarium content, where an all-sky picture is kept as a rectangle ([[dome-projection]]).',
    'The graticule of every world map "in longitude and latitude": GIS, the satellite imagery of the Earth ([[equirectangular-projection]]).'
  ],
  history: 'The projection is as old as geography: Marinus of Tyre (about 100 AD) laid the world out on a rectangle of longitude and latitude, and Ptolemy criticised it. In photography the cylindrical panoramas of the nineteenth century were joined in the 1990s by spherical ones, when stitching software began to store the whole sphere as an equirectangular picture; in the 2010s it became the exchange format of 360° cameras, photo spheres and virtual reality.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), the equirectangular chapter.', 'Richard Szeliski, *Computer Vision: Algorithms and Applications* (Springer, 2nd ed., 2022), the section on spherical panoramas.', 'Ned Greene, "Environment mapping and other applications of world projections", *IEEE Computer Graphics and Applications* 6 (1986), 21 – 29.'],
  sim: 'ld-pano-viewer',
  construction: 'ld-equirect-grid'
},

{
  id: 'cube-maps',
  parent: 'lenses-and-domes',
  title: 'Cube maps',
  level: 2,
  short: 'The sphere of directions on the six faces of a cube, each face an ordinary rectilinear picture of a 90° square cone. Straight lines stay straight inside a face and kink at the seams; a pixel at the corner of a face covers only a fifth of the solid angle of one at its middle, so the corners are oversampled.',
  keywords: ['cube map', 'skybox', 'environment map', 'six faces', 'gnomonic', 'rectilinear', 'seam', 'texel', 'VR', 'game', 'cross layout', 'Greene'],
  prereq: ['one-point-perspective', 'field-of-view-and-focal-length', 'equirectangular-images'],
  related: ['cube-map-of-the-earth', '3d-graphics-pipeline', 'augmented-and-virtual-reality', 'panoramas-and-360', 'rectilinear-lens'],
  body: `Fold a sheet into a cube, put the eye at the centre and draw on each wall what you see through it. The cube has six faces, each seen under a 90° square cone of directions, and each is an ordinary **rectilinear** picture: the picture plane is the face, the vanishing point of the direction it faces is its middle, and the focal length is half the side. Together the six faces hold every direction exactly once. This is the **cube map**, the [[cube-map-of-the-earth|gnomonic cube]] of the cartographers applied to the sphere of directions.

### The faces
For a face with forward direction $F$, rightward direction $R$ and upward direction $U$, a direction $d$ lands at
$$x' = f\\,\\frac{d\\cdot R}{d\\cdot F}, \\qquad y' = f\\,\\frac{d\\cdot U}{d\\cdot F},$$
and belongs to that face when $|d\\cdot R| \\le d\\cdot F$ and $|d\\cdot U| \\le d\\cdot F$. With the side of the face $2f$, the face is the square $|x'|, |y'| \\le f$. The six faces are drawn as a cross: left, front, right and back in a row, the ceiling above the front, the floor below it.

### Lines and seams
A straight line of the room is a straight line in each face it crosses, because each face is a perspective picture. But it changes direction at the seam: the direction a line takes depends on the face's own axes, and two neighbouring faces are tilted 90° to each other. A corner edge of a room that climbs obliquely in the front face runs horizontally across the right face. This broken but never curved look is the signature of a cube map, and why it is so easy to draw (the faces are drawn with a ruler) and to filter.

### The pixels are not equal
A pixel at the centre of a face covers the angle $2/N$ radians ($N$ pixels across the face). At the point $(u, v)$ of the face (in units of $f$) its solid angle is
$$\\omega = \\frac{4}{N^2}\\,(1 + u^2 + v^2)^{-3/2},$$
so in a corner ($u = v = 1$) it is $3^{-3/2} = 0.19$ of the middle one, and the face is sampled five times more densely there than at its middle. Counted against the coarsest pixel, a cube map needs $6N^2 = 24/\\delta^2$ pixels for the resolution $\\delta$, about twice the $12.6/\\delta^2$ that the sphere would need if the pixels were all equal; an equirectangular picture needs $19.7/\\delta^2$. The cube is better than the rectangle at the poles, worse in total.

### How it is drawn
The front face is a one-point perspective with the vanishing point at its middle: the far wall is a rectangle, the long edges run out along radii. The side faces show the same room face-on. The construction below draws all six faces of a room with the set square.`,
  ideas: [
    'A cube map is six rectilinear pictures, each of a 90° square cone; the focal length is half the side of a face.',
    'Straight lines are straight inside a face and kink at the seams between faces.',
    'The solid angle of a pixel falls from 4/N² at the middle of a face to 0.19 of that in the corner: the corners are oversampled.',
    'The cross layout (left, front, right, back, with the ceiling and the floor) is the usual way to store or print the six faces.'
  ],
  pitfalls: [
    'A cube map is a distortion-free picture — Inside a face it is a true perspective picture, but the faces differ in their orientation, and the sampling varies across a face by a factor of five.',
    'The seams are errors — They are where the picture changes from one perspective picture to another; a good cube-map renderer fetches pixels across the seam so that no visible edge appears.',
    'The cube is the only way to cut the sphere into rectilinear faces — Other solids work (the octahedron, the dodecahedron); the cube is chosen because its faces are squares and its geometry is trivial.'
  ],
  formulas: [
    {
      name: 'Face size for an angular resolution at its middle',
      expr: 'N = 2/delta',
      tex: 'N = \\frac{2}{\\delta}',
      vars: { N: { name: 'pixels along one side of a face' }, delta: { name: 'angle of the pixel at the middle of a face', q: 'angle', unit: '°', value: 0.112, min: 0.01, max: 5, tex: '\\delta' } },
      note: 'At the middle of the face a pixel of angle δ needs N = 2/δ (radians): 0.112° gives 1024 pixels.'
    },
    {
      name: 'Solid angle of a pixel at (u, v) of a face',
      expr: 'w = 4/N^2*(1 + u^2 + v^2)^(-1.5)',
      tex: '\\omega = \\frac{4}{N^2}\\left(1 + u^2 + v^2\\right)^{-3/2}',
      vars: { w: { name: 'solid angle of the pixel', q: 'solidangle', unit: 'sr', tex: '\\omega' }, N: { name: 'pixels along one side of a face', value: 1024 }, u: { name: 'horizontal position on the face (middle 0, edge 1)', value: 1, signed: true }, v: { name: 'vertical position on the face (middle 0, edge 1)', value: 1, signed: true } },
      note: 'u and v are measured from the middle of the face, in half-sides. In the corner (1, 1) the factor is 0.19.'
    },
    {
      name: 'Pixels in the six faces',
      expr: 'T = 6*N^2',
      tex: 'T = 6N^2',
      vars: { T: { name: 'number of pixels in the six faces' }, N: { name: 'pixels along one side of a face', value: 1024 } },
      note: 'For N = 1024 that is 6.3 million pixels; the whole sphere is then sampled at 0.112° at the middle of each face.'
    }
  ],
  examples: [
    {
      title: 'A 1024-pixel cube map',
      q: 'Each face of a cube map is 1024 × 1024 pixels. What is the angle of a pixel at the middle of a face, and how big is the solid angle of a corner pixel compared with a middle one?',
      steps: [
        { text: 'At the middle a pixel spans', tex: '2/1024\\ \\text{rad} = 0.00195\\ \\text{rad} = 0.112°' },
        { text: 'In the corner $u = v = 1$, so the solid angle is', tex: '(1 + 1 + 1)^{-3/2} = 0.192\\ \\text{of the middle one}' },
        'Along the diagonal of the corner the linear size is 1/3 of the middle pixel and across it 0.58: the corner pixel is a thin diamond. All 6.3 million pixels hold the whole sphere of 12.57 steradians; their mean solid angle is 2.0 µsr against 3.8 µsr at the middle.'
      ],
      a: '0.112° at the middle; the corner pixel has 0.19 of the middle pixel\'s solid angle.'
    }
  ],
  quiz: [
    { q: 'What is the field of view of each face of a cube map?', choices: ['60°', '90°', '120°', '180°'], a: 1, why: 'Each face is a 90° square cone, so the focal length is half the side.' },
    { q: 'A straight edge of a room crossing the seam between two faces of a cube map', choices: ['is straight and continuous in direction', 'is straight in each face and changes direction at the seam', 'is curved in each face', 'disappears'], a: 1, why: 'Each face is a rectilinear picture, so lines are straight in it; the faces are tilted by 90°, so the direction changes at the seam.' },
    { q: 'What fraction of the solid angle of a middle pixel does a corner pixel of a cube-map face have?', answer: 0.19, why: '3^(−3/2) = 0.192.' },
    { q: 'A cube map with faces of 2048 × 2048 pixels holds how many million pixels in all?', answer: 25.2, why: '6 × 2048² = 25 165 824 pixels = 25.2 million.' },
    { q: 'The cube map stores every direction twice.', a: false, why: 'Each direction belongs to exactly one face (apart from the pixels on the seams): the six cones tile the sphere without overlap.' }
  ],
  applications: [
    'Skyboxes and environment maps in games and animation: the distant scene or the reflections are looked up by direction in one of six faces.',
    'Virtual-reality video and 360° streaming, where the cube is often preferred to the rectangle because the faces compress well and the sampling is more even.',
    'Rendering reflections: a cube map of the surroundings of a shiny object, found by rendering the scene six times from its centre.',
    'Spherical panorama viewers: the viewer cuts the field of view out of six faces rather than one big distorted rectangle.'
  ],
  history: 'Environment mapping by a cube is due to Ned Greene, whose 1986 paper "Environment mapping and other applications of world projections" proposed six rectilinear faces (the "cubic" world projection) as the way to store the surroundings of a point, and compared the cube with the sphere and other world projections. Hardware support for cube maps arrived with the graphics cards at the end of the 1990s, and sky boxes appeared in games at about the same time. The same device applied to the globe is [[cube-map-of-the-earth|the Earth on a cube]].',
  sources: ['Ned Greene, "Environment mapping and other applications of world projections", *IEEE Computer Graphics and Applications* 6 (11), 1986, 21 – 29.', 'Tomas Akenine-Möller, Eric Haines and Naty Hoffman, *Real-Time Rendering* (4th ed., CRC Press, 2018), the chapter on environment mapping.', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), polyhedral projections.'],
  sim: 'ld-cube-faces',
  construction: 'ld-cube-net'
},

{
  id: 'dome-projection',
  parent: 'lenses-and-domes',
  title: 'Dome projection: the planetarium master',
  level: 2,
  short: 'A planetarium dome is fed with a disc, the dome master: zenith at the centre, horizon at the rim, altitude proportional to distance from the centre — the equidistant fisheye picture of the hemisphere. It is exact from the centre of the dome only; from any other seat the sky is shifted, and the best seats are near the middle.',
  keywords: ['dome', 'planetarium', 'domemaster', 'fulldome', 'azimuthal equidistant', 'fisheye', 'zenith', 'horizon', 'seat', 'Zeiss', 'projector'],
  prereq: ['azimuthal-equidistant-projection', 'equidistant-fisheye', 'horizon-coordinates'],
  related: ['planetarium-domes', 'the-all-sky-view', 'equirectangular-images', 'five-point-perspective', 'little-planet'],
  body: `A planetarium dome is a hemisphere on which a sky is painted by light. A spectator sitting at the centre sees each point of the screen in the direction in which it lies, so for that spectator the screen is the sphere of directions itself. The digital planetarium feeds it with a single square image, the **dome master**: a circle in which the zenith is at the centre and the horizon is the rim. A point at altitude $h$ is drawn at the distance
$$r = R\\,\\frac{90° - h}{90°}$$
from the centre, in the direction of its azimuth, $R$ being the radius of the circle. It is the **equidistant fisheye** picture of the hemisphere ([[equidistant-fisheye]]), the same as the azimuthal equidistant map ([[azimuthal-equidistant-projection]]) centred on the zenith. Rings of equal altitude are equally spaced; azimuths are the directions round the centre.

### Why this picture
The master is made to be projected through a fisheye lens, or on several projectors, on to the dome, so it must be the picture such a lens would take: an angle-to-distance mapping that is the same in every direction. The equidistant choice makes the arithmetic trivial (a star at altitude 30° of a 4096-pixel master is 1365 pixels from the centre) and it keeps the pixel density along a radius uniform, about 22.8 pixels per degree for 4096 pixels across. The eye resolves about one minute of arc, which is 60 pixels per degree: a 4K dome is blurred, and the best domes use 8K or 16K masters.

### From other pictures
A 360° equirectangular panorama is turned into a master by finding, for each pixel of the master, its altitude and azimuth and looking them up in the rectangle. A cube map or a rendering in six directions is turned into a master the same way. The reverse, an image for a flat screen, is cut from the master by a rectilinear window.

### What is lost off-centre
The picture is right for the centre only. A seat at the distance $s$ from the centre (in units of the dome's radius) sees each point of the dome in a different direction: the zenith of the dome, for instance, appears at the altitude $\\arctan(1/s)$ above the horizon instead of at 90°, and the part of the dome nearest the seat looks too high, the part across the room too low. The distortion grows with $s$, which is why planetariums tilt their seats and arrange them to look to the centre or to the front, and why good domes are large relative to the seating.

### How it is drawn
Circle of radius $R$; divide a radius into six equal parts for the altitude rings of 15°; draw the azimuth lines with the set square; plot points by altitude and azimuth. The construction below draws the celestial equator for a place at latitude 32° with one arc through three points.`,
  ideas: [
    'The dome master is the equidistant picture of the hemisphere: zenith at the centre, horizon at the rim, r = R·(90° − h)/90°.',
    'Altitude rings are equally spaced; a 4096-pixel master has 22.8 pixels per degree, about a third of what the eye can resolve.',
    'A master is made from a panorama or a cube map by looking up each pixel\'s altitude and azimuth.',
    'It is exact from the centre of the dome only: an off-centre seat sees the dome\'s zenith at the altitude arctan(1/s).'
  ],
  pitfalls: [
    'The sky seen in a planetarium is the same from every seat — Only from the centre. Away from it the directions shift and the projection becomes a distorted view; the dome is a compromise.',
    'The dome master is a stereographic or flat picture — It is the equidistant mapping: the distance from the centre is simply the angle from the zenith.',
    'The rim of the master is the horizon of the real sky — It is the horizon of the dome, which may be tilted from the real horizon; many domes are tilted by 10° to 30° so that the audience can look at the zenith in comfort.'
  ],
  formulas: [
    {
      name: 'Distance from the centre of the master',
      expr: 'r = R*(pi/2 - h)/(pi/2)',
      tex: 'r = R\\,\\frac{\\pi/2 - h}{\\pi/2}',
      vars: { r: { name: 'distance of the point from the zenith in the master', q: 'length', unit: 'mm' }, R: { name: 'radius of the master (the horizon)', q: 'length', unit: 'mm', value: 150 }, h: { name: 'altitude of the point', q: 'angle', unit: '°', value: 32, min: 0, max: 90, tex: 'h' } },
      note: 'At the zenith (h = 90°) r = 0; at the horizon r = R. Polaris at latitude 32° is at altitude 32° due north: r = 0.644 R.'
    },
    {
      name: 'Pixels per degree of a master',
      expr: 'ppd = D/180',
      tex: '\\mathrm{ppd} = \\frac{D}{180}',
      vars: { ppd: { name: 'pixels per degree along a radius', tex: '\\mathrm{ppd}' }, D: { name: 'diameter of the master in pixels', value: 4096 } },
      note: 'The master covers 180° across its diameter. The eye resolves about 60 pixels per degree.'
    },
    {
      name: 'Where an off-centre seat sees the dome\'s zenith',
      expr: 'hz = atan(1/s)',
      tex: 'h_z = \\arctan\\frac{1}{s}',
      vars: { hz: { name: 'apparent altitude of the dome\'s zenith', q: 'angle', unit: '°', min: 0, max: 90, tex: 'h_z' }, s: { name: 'distance of the seat from the centre, in dome radii', value: 0.5, min: 0.01, max: 1 } },
      note: 'For a seat at half the radius the dome\'s zenith is at 63.4° rather than 90°; at the centre (s → 0) it is 90°.'
    }
  ],
  examples: [
    {
      title: 'Placing the pole on a 4096-pixel master',
      q: 'On a dome master 4096 pixels across, where are the north celestial pole and the point of the celestial equator due south, for a place at latitude 32° N?',
      steps: [
        'The radius is $R = 2048$ pixels for 90°, so one degree is 22.76 pixels.',
        { text: 'The pole is at altitude 32° due north:', tex: 'r = 2048 \\times (90 - 32)/90 = 1320\\ \\text{pixels from the centre, towards north}' },
        { text: 'The celestial equator crosses the meridian due south at altitude $90° - 32° = 58°$:', tex: 'r = 2048 \\times 32/90 = 728\\ \\text{pixels from the centre, towards south}' }
      ],
      a: 'The pole is 1320 pixels from the centre towards north; the equator\'s southern point 728 pixels towards south.'
    },
    {
      title: 'A seat off-centre',
      q: 'A dome is 12 m in diameter and a seat is 3 m from the centre. How high does the zenith of the dome appear to a spectator there?',
      steps: [
        { text: 'The dome\'s radius is 6 m, so $s = 3/6 = 0.5$:', tex: 'h_z = \\arctan(1/0.5) = 63.4°' },
        'The top of the dome looks 26.6° lower than straight overhead, and the stars at the zenith of the show appear 26.6° off from where the centre of the dome would see them.'
      ],
      a: 'At 63.4° altitude, 26.6° short of straight overhead.'
    }
  ],
  quiz: [
    { q: 'On a dome master of radius R, a star at altitude 45° lies at what distance from the centre, as a fraction of R?', choices: ['0.25', '0.5', '0.707', '0.75'], a: 1, why: 'r = R·(90° − 45°)/90° = R/2: the altitude rings are equally spaced.' },
    { q: 'A 8192-pixel dome master has how many pixels per degree along a radius?', answer: 45.5, why: '8192/180 = 45.5.' },
    { q: 'A spectator at the very centre of the dome sees each point of the master in the direction it was drawn for.', a: true, why: 'At the centre the screen is the sphere of directions round the eye; the master is the picture of the directions.' },
    { q: 'A seat at 0.25 of the dome\'s radius from the centre sees the dome\'s zenith at what altitude, in degrees?', answer: 76, unit: '°', why: 'arctan(1/0.25) = 76.0°.' },
    { q: 'In a dome master the horizon is', choices: ['the centre', 'the rim', 'the line through the centre', 'a circle half-way to the rim'], a: 1, why: 'Altitude 0 gives r = R; the zenith is the centre.' }
  ],
  applications: [
    'Digital planetariums and full-dome theatres: every frame of a show is a master, rendered or converted from 360° material.',
    'Science visualisation: the whole sky from a position in space, rendered into a master and projected on a dome.',
    'Fulldome film and immersive art: artists draw and paint directly in the master or in an equirectangular picture converted to it.',
    'Flight and driving simulators with spherical screens use the same geometry with the seat at the centre.'
  ],
  history: 'The first modern planetarium projector was designed by Walther Bauersfeld at Zeiss — a prototype in Jena in 1923, then the instrument of the Deutsches Museum in Munich in 1925; it threw the stars through a ball of small lenses, not as a picture. Evans & Sutherland\'s Digistar (1983) was the first planetarium to draw its sky with computer graphics, and "fulldome" video became practical in the 1990s. The master format — a single fisheye disc — was adopted because a single fisheye lens on a projector, or a handful of them, could throw it on the dome.',
  sources: ['Paul Bourke, web notes on fisheye, spherical projections and fulldome (paulbourke.net).', 'John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), azimuthal equidistant.', 'Kenro Miyamoto, "Fish eye lens", *Journal of the Optical Society of America* 54 (1964).'],
  sim: 'ld-dome-seat',
  construction: 'ld-dome-master'
},

{
  id: 'mirror-anamorphosis',
  parent: 'lenses-and-domes',
  title: 'Mirror anamorphosis: cylinder and cone',
  level: 3,
  short: 'A picture drawn on the sheet round a mirror cylinder or cone, so that the mirror shows it undistorted. For the cylinder each column of the picture becomes a ray reflected through 2β and each row a curve round the cylinder; the cone keeps the azimuth and turns the picture inside out in radius: r = kρ − (k − 1)·r_picture.',
  keywords: ['anamorphosis', 'mirror', 'cylinder', 'cone', 'reflection', 'catoptric', 'Niceron', 'Vaulezard', 'distorted picture', 'fan', 'polar grid'],
  prereq: ['anamorphosis', 'central-projection'],
  related: ['street-art-anamorphosis', 'escher-and-curved-space', 'equisolid-fisheye', 'physics:reflection', 'physics:plane-mirrors'],
  body: `Place a polished cylinder on a sheet of paper on which a strange fan-shaped smear has been drawn, and the smear folds up in the mirror into a face, a ship, a building. This is **catoptric anamorphosis**, an old parlour trick that is also an exact application of the law of reflection.

### The cylinder
Seen from far away, along the $+y$ direction, a column of the picture at abscissa $x = \\rho\\sin\\beta$ is reflected at the point $M$ of the cylinder (of radius $\\rho$) where the radius makes the angle $\\beta$ with the line of sight. The ray is turned through $2\\beta$ and leaves $M$ in the direction $(\\sin 2\\beta,\\ -\\cos 2\\beta)$. A point of the picture at depth $y^*$ behind the axis appears on this ray at the distance
$$t = y^* + \\rho\\cos\\beta$$
from $M$ (the mirror shows the sheet at the distance the ray has travelled, as if the sheet continued behind the mirror). So **columns of the picture become rays, rows become curves round the cylinder**, and the picture opens into a fan: the middle column goes straight to the viewer, the side columns turn to the sides and, for $\\beta > 45°$, a little backwards. The deeper the picture is behind the axis, the longer the rays on which it is drawn.

### The cone
Look down from above the apex of a cone of half-angle $\\gamma$. A vertical ray meets the cone side at the radius $r_M$ and is reflected through $2\\gamma$ from the vertical, reaching the sheet at
$$r = r_M + z_M\\tan 2\\gamma, \\qquad z_M = \\frac{\\rho - r_M}{\\tan\\gamma}.$$
With $k = \\tan 2\\gamma/\\tan\\gamma$ this is $r = k\\rho - (k - 1)\\,r_M$: the azimuth is unchanged and the radius is **reversed**. For $\\gamma = 30°$, $k = 3$: the centre of the picture goes to the ring of radius $3\\rho$ and the rim of the cone to $\\rho$. As $\\gamma$ approaches 45° the reflected ray becomes horizontal and the ring runs off to infinity.

### What it needs
The construction is exact for an eye far away on the line of sight (for the cylinder) or on the axis (for the cone); a close eye shears the picture. The mirror must be a true cylinder or cone, polished and standing on the picture. The picture must be drawn by transfer: grid the original, draw the grid on the sheet by the rays above, and carry the details cell by cell.

### How it is drawn
**Cylinder:** divide the diameter into equal parts, drop the lines to the circle, lay off $2\\beta$ at each foot to draw the reflected rays, lay off the distances $t$ along them and join the points of each row. **Cone:** draw the profile, the vertical rays and the reflected ones at $2\\gamma$, read the radii off the base line, and draw the circles in the plan. Both constructions are below; the simulation applies the laws to a picture of your choice.`,
  ideas: [
    'Cylinder: a column at x = ρ sin β is seen at M, where the ray is turned through 2β; a point at depth y* is at t = y* + ρ cos β along that ray.',
    'Columns of the picture become rays, rows become curves: the picture opens into a fan.',
    'Cone: azimuth unchanged, radius reversed: r = kρ − (k − 1)·r_M with k = tan 2γ / tan γ (k = 3 for γ = 30°).',
    'The constructions assume an eye far away on the line of sight (cylinder) or on the axis (cone).'
  ],
  pitfalls: [
    'The fan is a cut-out of the picture stretched flat — It is not a stretch but a reflection map: each point of the picture goes where the mirror\'s normal sends the ray. Distances are neither kept nor uniformly scaled.',
    'A mirror cylinder and a mirror cone give similar anamorphs — They do not: the cylinder turns columns into rays (the picture fans out in one direction), the cone turns the whole picture inside out in radius round the apex.',
    'The eye can be anywhere — The constructions assume a distant eye. For a near eye the rays from the eye to the mirror are not parallel, and the anamorph must be computed point by point for that eye.'
  ],
  formulas: [
    {
      name: 'Where the column x is seen on the cylinder',
      expr: 'beta = asin(x/rho)',
      tex: '\\beta = \\arcsin\\frac{x}{\\rho}',
      vars: { beta: { name: 'angle of the radius at the point of reflection', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\beta' }, x: { name: 'abscissa of the column across the line of sight', q: 'length', unit: 'mm', value: 20, signed: true }, rho: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 40, tex: '\\rho' } },
      note: 'The ray is reflected through 2β. At x = ρ/2 (β = 30°) the ray turns through 60°.'
    },
    {
      name: 'Distance along the reflected ray',
      expr: 't = ys + rho*cos(beta)',
      tex: 't = y^* + \\rho\\cos\\beta',
      vars: { t: { name: 'distance from the point of reflection to the point on the sheet', q: 'length', unit: 'mm' }, ys: { name: 'depth of the picture point behind the axis', q: 'length', unit: 'mm', value: 60, tex: 'y^*' }, rho: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 40, tex: '\\rho' }, beta: { name: 'angle of the radius at the point of reflection', q: 'angle', unit: '°', value: 30, min: 0, max: 85, tex: '\\beta' } },
      note: 'Valid for a distant eye. The point on the sheet is M + t·(sin 2β, −cos 2β).'
    },
    {
      name: 'Where the cone\'s reflected ray reaches the sheet',
      expr: 'rP = rM + (rho - rM)*tan(2*gamma)/tan(gamma)',
      tex: 'r = r_M + (\\rho - r_M)\\,\\frac{\\tan 2\\gamma}{\\tan\\gamma}',
      vars: { rP: { name: 'radius on the sheet', q: 'length', unit: 'mm', tex: 'r' }, rM: { name: 'radius of the picture point, seen from above', q: 'length', unit: 'mm', value: 10, tex: 'r_M' }, rho: { name: 'radius of the base of the cone', q: 'length', unit: 'mm', value: 40, tex: '\\rho' }, gamma: { name: 'half-angle of the cone', q: 'angle', unit: '°', value: 30, min: 5, max: 44, tex: '\\gamma' } },
      note: 'The cone stands with its base on the sheet. With γ = 30° the ratio is 3: the picture\'s centre goes to 3ρ.'
    }
  ],
  examples: [
    {
      title: 'A point for a cylinder of radius 40 mm',
      q: 'A mirror cylinder has radius ρ = 40 mm. Where on the sheet must the point of the picture at x = 20 mm and depth y* = 60 mm be drawn (the cylinder at the origin, the eye far away on the −y side)?',
      steps: [
        { text: '$\\sin\\beta = 20/40$, so $\\beta = 30°$. The point of reflection is $M = (20,\\ -40\\cos 30°) = (20,\\ -34.6)$ and the ray turns through $60°$:', tex: '\\text{direction } (\\sin 60°,\\ -\\cos 60°) = (0.866,\\ -0.5)' },
        { text: 'The distance along the ray is', tex: 't = 60 + 40\\cos 30° = 94.6\\ \\text{mm}' },
        { text: 'So the point on the sheet is', tex: 'P = (20 + 94.6 \\times 0.866,\\ -34.6 - 94.6 \\times 0.5) = (102.0,\\ -82.0)\\ \\text{mm}' }
      ],
      a: 'Draw it at (102.0, −82.0) mm.'
    },
    {
      title: 'A ring for a cone',
      q: 'A mirror cone of base radius ρ = 40 mm and half-angle γ = 30° stands on the sheet. Where on the sheet must the point of the picture at radius 10 mm (seen from above) be drawn, and where the picture\'s centre?',
      steps: [
        { text: 'Here $\\tan 2\\gamma/\\tan\\gamma = 1.732/0.577 = 3$:', tex: 'r = 10 + (40 - 10) \\times 3 = 100\\ \\text{mm}' },
        { text: 'The centre of the picture ($r_M = 0$) goes to', tex: 'r = 0 + 40 \\times 3 = 120\\ \\text{mm}' }
      ],
      a: '100 mm and 120 mm from the axis, in the same direction as the point itself.'
    }
  ],
  quiz: [
    { q: 'A mirror cylinder turns a ray through twice the angle of the radius at the point of reflection.', a: true, why: 'The normal bisects the angle between the incoming and the outgoing ray, so the ray turns through 2β.' },
    { q: 'For a cylinder of radius ρ = 40 mm, a column at x = 20 mm is seen at the point where the radius makes what angle with the line of sight, in degrees?', answer: 30, unit: '°', why: 'sin β = 20/40 → β = 30°.' },
    { q: 'For a cone with γ = 30°, the centre of the picture is drawn on the sheet at what multiple of the base radius?', choices: ['1', '2', '3', '4'], a: 2, why: 'r = kρ with k = tan 60°/tan 30° = 3.' },
    { q: 'What happens to the anamorphic ring as the half-angle of the cone approaches 45°?', choices: ['It shrinks to the base', 'It runs off to infinity', 'It stays the same', 'It reverses direction'], a: 1, why: 'At 2γ = 90° the reflected ray is horizontal and never meets the sheet.' },
    { q: 'For the cylinder, the columns of the picture become', choices: ['concentric circles', 'rays from the points of reflection', 'parallel lines', 'ellipses'], a: 1, why: 'Each column is seen at one point of the cylinder; the reflected ray from that point carries all its points.' }
  ],
  applications: [
    'Parlour amusements and museum shows: a tin cylinder and a smeared print, the picture appears when the mirror is placed.',
    'Puzzle books and museum shops sell anamorphic prints with a mirror cylinder that reveals the picture.',
    'Optical testing: the distortion of a known grid reflected in a curved mirror shows the mirror\'s shape — the same geometry run backwards.',
    'Art: a distorted image is a rigorous test of how well an artist knows perspective.',
    'Teaching the law of reflection: the anamorph is its full geometrical consequence.'
  ],
  history: 'Mirror anamorphosis flowered in the seventeenth century. Jean-Louis Vaulezard published *Perspective cylindrique et conique* in 1630, and the Minim friar Jean-François Niceron gave a fuller treatment, with the constructions, in *La perspective curieuse* (1638). Cylindrical mirrors were common in the parlours of the eighteenth century, in Europe and in China; the geometry is the polar-grid construction used here. The older "slant" anamorphosis, as in Holbein\'s *Ambassadors* (1533), needs no mirror at all.',
  sources: ['Jurgis Baltrušaitis, *Anamorphic Art* (Chadwyck-Healey, 1977); French original *Anamorphoses* (1955).', 'Fred Leeman, *Hidden Images: Games of Perception, Anamorphic Art, Illusion* (Abrams, 1976).', 'Jean-François Niceron, *La perspective curieuse* (Paris, 1638).'],
  sim: 'ld-mirror-anamorph',
  construction: ['ld-cylinder-anamorphosis', 'ld-cone-anamorphosis']
},

{
  id: 'little-planet',
  parent: 'lenses-and-domes',
  title: 'Little planets: the stereographic photograph',
  level: 2,
  short: 'Wrap a 360° panorama round the nadir with the stereographic law r = 2f·tan(θ/2): the ground curls into a small round planet whose rim is the horizon, the buildings stand on it like towers and the sky is stretched across the outside. Circles of constant altitude become concentric circles; the azimuth becomes the angle round the centre.',
  keywords: ['little planet', 'tiny planet', 'stereographic', 'nadir', 'panorama', 'polar coordinates', 'horizon', 'altitude circles', 'wrapped panorama'],
  prereq: ['stereographic-fisheye', 'equirectangular-images', 'stereographic-projection'],
  related: ['panoramas-and-360', 'the-all-sky-view', 'conformal-maps', 'dome-projection', 'six-point-perspective'],
  body: `Take a 360° panorama, point the camera straight down, and map each direction by the stereographic law. The result is a **little planet**: a round world whose ground is a small disc, whose horizon is its rim, and whose sky is stretched over the outside. It looks like a photograph of a tiny globe, though it is only a mapping of directions — the picture of one standing on the ground, looking all round, on a chart.

### The mapping
Let $h$ be the altitude of a direction (0 at the horizon, $-90°$ at the nadir below your feet, $+90°$ at the zenith) and $\\theta = 90° + h$ its angle from the nadir. The stereographic law puts it at
$$r = 2f\\tan\\frac{\\theta}{2} = 2f\\tan\\left(45° + \\frac{h}{2}\\right),$$
at the azimuth of the direction round the centre. Circles of constant altitude are circles about the centre; vertical lines of the scene are radii; the horizon is the circle of radius exactly $2f$. The ground, at altitudes from $-90°$ to $0$, fills the inside, the sky the outside: at $+30°$ the radius is $3.46f$, at $+60°$ it is $7.46f$, and the zenith is at infinity, so the picture has to be cut at some altitude. With the horizon at radius $R_h = 2f$ the sky out to altitude $h$ extends to $R_h\\tan(45° + h/2)$: 2.4 times as far at $45°$, 3.7 times at $60°$.

### Why the buildings stand up
The law is **conformal**: a small square of the scene is a small square on the paper, only larger the further from the centre. A tower of the panorama is a curved rectangle standing on the rim with its top wider than its foot: the scale is $\\sec^2(\\theta/2)$, which is 2 at the horizon and 4 at 30° above it, so the top of a tower 30° tall is drawn twice as wide as its foot. That is the look of the picture: things lean outwards and grow, like small trees on a planet. A different law gives a different planet. The equidistant law ([[equidistant-fisheye]]) makes a flat polar chart in which shapes are not kept; the orthographic law would show a ball with a hidden back.

### Where the horizon goes
Tilt the camera and the planet slides off-centre, the horizon becomes a circle that is not about the centre, and when the camera looks at the horizon the planet turns into a tunnel. The circles of the picture are circles of the sphere of directions, so tilting only shifts them.

### How it is drawn
Compute the radius of the circle of each altitude (a table or the inscribed-angle trick of [[stereographic-fisheye]]), draw the circles with the compass about the nadir and the azimuth lines with a 30° set square, and plot the scene by altitude and azimuth. The construction below draws the circles, a tower and the horizon.`,
  ideas: [
    'A little planet is the stereographic picture r = 2f·tan(θ/2) of a panorama taken from the nadir: θ = 90° + altitude.',
    'Circles of constant altitude are concentric circles; vertical lines are radii; the horizon is the circle of radius 2f.',
    'The picture is conformal: small things keep their shape and grow outwards, so buildings stand on the rim like towers.',
    'The zenith is at infinity, so the sky is cut at some altitude; the sky out to altitude h extends to tan(45° + h/2) times the horizon radius.'
  ],
  pitfalls: [
    'A little planet is a photograph of a small sphere — It is a map of directions: nothing in the scene is spherical. The apparent planet is the effect of the stereographic law, the horizon being a circle.',
    'The sky is as large as the ground — The sky is stretched: in the example of the construction (f = 25) the whole 90° of ground below the horizon fills a disc of radius 50, while the next 30° of sky above the horizon already takes 36.6 units of radius and the 30° after that 100.',
    'Any panorama works equally well — The effect needs the nadir to be a natural point (a lawn, a floor, a deck): a pattern of ground that is the same all round makes a good planet; a view out of a window does not.'
  ],
  formulas: [
    {
      name: 'Radius of an altitude circle',
      expr: 'r = 2*f*tan(pi/4 + alt/2)',
      tex: 'r = 2f\\tan\\left(\\frac{\\pi}{4} + \\frac{h}{2}\\right)',
      vars: { r: { name: 'radius of the circle of altitude h (pixels)', q: false, unit: 'px' }, f: { name: 'scale of the picture (pixels)', q: false, unit: 'px', value: 150 }, alt: { name: 'altitude (negative: below the horizon)', q: 'angle', unit: '°', value: 30, signed: true, min: -85, max: 80, tex: 'h' } },
      note: 'At the horizon (h = 0) r = 2f, the rim of the planet. The nadir (h = −90°) is the centre.'
    },
    {
      name: 'Extent of the sky relative to the horizon circle',
      expr: 'k = tan(pi/4 + alt/2)',
      tex: 'k = \\tan\\left(\\frac{\\pi}{4} + \\frac{h}{2}\\right)',
      vars: { k: { name: 'radius of the circle of altitude h in units of the horizon radius' }, alt: { name: 'altitude above the horizon', q: 'angle', unit: '°', value: 50, min: 0, max: 85, tex: 'h' } },
      note: 'At 45°: 2.41; at 60°: 3.73; at 80°: 11.4. The sky cannot all be shown.'
    }
  ],
  examples: [
    {
      title: 'Planning the picture',
      q: 'You want the horizon circle of the little planet to have a radius of 300 pixels. What f does that need, and how far out does the sky go if you cut it at altitude 50°?',
      steps: [
        { text: 'The horizon is at $r = 2f$, so', tex: 'f = 150\\ \\text{px}' },
        { text: 'At altitude 50°:', tex: 'r = 300 \\times \\tan(45° + 25°) = 300 \\times 2.747 = 824\\ \\text{px}' },
        'The picture must therefore be 1648 pixels across to hold the sky down to 50°, while the planet itself is 600 pixels across.'
      ],
      a: 'f = 150 pixels; the sky to altitude 50° reaches 824 pixels from the centre.'
    },
    {
      title: 'The size of a tower',
      q: 'On a little planet with f = 25 (in the units of the construction), a tower stands at the horizon and is 30° high. How long is it on the picture, and how many times longer than the radius of the planet\'s rim?',
      steps: [
        { text: 'The horizon is at $2f = 50$ and the 30° circle at $2f\\tan 60° = 86.6$:', tex: '86.6 - 50 = 36.6' },
        'Its length is 73 % of the radius of the planet\'s rim: a tower of 30° looks nearly as tall as the planet is wide.'
      ],
      a: '36.6 units, about 0.73 of the rim radius.'
    }
  ],
  quiz: [
    { q: 'At what radius, in units of f, is the horizon in a little planet?', answer: 2, why: 'The horizon is 90° from the nadir: r = 2f·tan 45° = 2f.' },
    { q: 'The zenith of a little planet is', choices: ['at the centre', 'at the rim', 'at infinity', 'at the radius 4f'], a: 2, why: 'The zenith is 180° from the nadir, where tan(θ/2) is infinite.' },
    { q: 'Circles of constant altitude of the panorama become, on a little planet,', choices: ['radii', 'concentric circles about the nadir', 'straight lines', 'spirals'], a: 1, why: 'Constant altitude means constant angle from the nadir, hence constant r.' },
    { q: 'With the horizon at radius 300 pixels, how far from the centre is the circle of altitude 45°, in pixels?', answer: 724, unit: 'px', why: '300 × tan(45° + 22.5°) = 300 × 2.414 = 724.' },
    { q: 'The little-planet picture keeps the shapes of small things.', a: true, why: 'The stereographic law is conformal; only the size of a small thing changes, with distance from the centre.' }
  ],
  applications: [
    'Photography: the "tiny planet" is a staple of panorama photography, made from a 360° picture taken on a lawn, a roof or a street.',
    'Sky and scene presentation: a stereographic all-sky chart shows the whole hemisphere of stars with constellations in their true shapes.',
    'Architecture: a room or a square seen from above as a single diagram of its surrounding walls.',
    'Posters and logos: a round picture of a place from a single viewpoint, easy to print and to frame.'
  ],
  history: 'The stereographic projection is of Hipparchus\'s time (about 150 BC) and the astrolabe is its brass embodiment. The "little planet" is its photographic descendant: after stitching software made 360° panoramas cheap, photographers began, in the 2000s, to re-project them stereographically with the camera pointing at the ground, and found that the result had the charm of a tiny world.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual* (USGS, 1987), the stereographic chapter.', 'James Evans, *The History and Practice of Ancient Astronomy* (Oxford University Press, 1998).', 'Richard Szeliski, *Computer Vision: Algorithms and Applications* (Springer, 2nd ed., 2022), the section on panoramas.'],
  sim: 'ld-little-planet',
  construction: 'ld-planet-circles'
}
);
