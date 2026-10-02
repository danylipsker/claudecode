/* HYPER-PROJECTIONS · content/sky-maps-and-instruments.js — the projections that chart the sky as seen from the Earth, and the
 * instruments built on them: the camera's view of the horizon, the all-sky view, the planisphere, the astrolabe, polar and
 * all-sky charts, sun-path diagrams, the analemma, sundials, the armillary sphere and the celestial globe, planetarium domes.
 *
 * Each page names the projection it is, gives the formula, says what it keeps, shows how to draw it by hand (the
 * constructions of constructions/sky-maps-and-instruments.js) and watch it work (sims/sky-maps-and-instruments.js).
 * Conventions: altitude and azimuth in degrees, azimuth from north through east; right ascension in hours or degrees;
 * charts of the sky as seen looking up (north up, east on the left) unless a page says otherwise.
 */
Hyper.add(
{
  id: 'looking-at-the-horizon',
  parent: 'sky-maps-and-instruments',
  title: 'Looking at the horizon: the camera\'s sky',
  level: 1,
  short: 'A camera on a tripod draws the sky by central projection onto a flat sensor: a direction at angle ψ from the axis lands at f tan ψ, every straight line of the sky stays straight, and the picture stretches towards the edge as the field widens.',
  keywords: ['rectilinear', 'gnomonic', 'field of view', 'focal length', 'wide angle', 'astrophotography', 'horizon', 'zenith vanishing point', 'altitude azimuth grid', 'tangent plane'],
  prereq: ['horizon-coordinates', 'central-projection', 'rectilinear-lens'],
  related: ['the-all-sky-view', 'gnomonic-projection', 'field-of-view-and-focal-length', 'photography-lenses-and-projections', 'sun-path-diagrams'],
  body: `### The sky seen through a window
Point a camera at the sky and its lens does what any pinhole does: every direction from the eye is carried along a straight line to a flat sheet, the sensor, a distance $f$ behind the lens. That is [[central-projection|central projection]] onto a plane, and when the plane touches the sphere of directions at the point you aim at, it is the **gnomonic projection** of the sky ([[gnomonic-projection]]). A direction that makes an angle $\\psi$ with the optical axis lands at the distance
$$r = f\\tan\\psi$$
from the centre of the picture, in the direction of its own bearing round the axis. With a 24 mm lens a star 20° off axis lands 8.7 mm from the centre; the same star on a 50 mm lens lands 18.2 mm out. The focal length is the scale of the drawing.

### What stays straight
The great circles of the sky project to straight lines (the plane through the eye and the circle cuts the sensor in a line). That includes the **horizon**, a great circle: in a rectilinear picture it is a straight line however the camera is tilted. The **azimuth lines**, vertical great circles through the zenith, are straight too: parallel verticals when the camera is level, leaning together towards the zenith, the third vanishing point, when it is tilted up. The circles of constant altitude are small circles and come out as conics; for a level camera aimed along azimuth $A_0$ with $a = A - A_0$,
$$x = f\\tan a, \\qquad y = f\\,\\frac{\\tan h}{\\cos a},$$
and each altitude line is a hyperbola $y^2 - x^2\\tan^2 h = f^2\\tan^2 h$, flat in the middle and rising to either side. The ruler-and-table construction below draws exactly this grid.

### The price at the edge
Differentiate $r = f\\tan\\psi$: a step $d\\psi$ along the radius becomes $f\\sec^2\\psi\\,d\\psi$, while a step round the axis becomes $f\\sec\\psi$ per radian. So a small circle of sky at angle $\\psi$ from the axis is drawn as an ellipse stretched $\\sec^2\\psi$ along the radius and $\\sec\\psi$ across it. At $\\psi = 23°$ (the corner of a 50 mm lens on a full-frame sensor) that is 1.19 and 1.09, hardly visible; at 42° (the corner of a 24 mm) 1.81 and 1.35; at 57° (a 14 mm) 3.4 and 1.8, and a star becomes a streak. At $\\psi\\to 90°$ the scale becomes infinite: **no flat rectilinear picture can show a full 180°**, which is why the wide sky is drawn on the [[the-all-sky-view|all-sky view]] or stitched from several frames.

### Field of view
A sensor of width $w$ behind a lens of focal length $f$ sees $2\\arctan\\frac{w}{2f}$. On a full frame (36 mm wide): 14 mm gives 104°, 24 mm 74°, 35 mm 54°, 50 mm 40°, 100 mm 20°, 200 mm 10°. Earth's rotation moves the stars 15° an hour, so at 200 mm a star crosses the whole frame in 40 minutes, and exposures of tens of seconds already smear it.

### Drawing it by hand
Take $f$ as a length on the paper, make a table of $\\tan a$ for the azimuth lines and of $f\\tan h/\\cos a$ for the altitude lines, and draw the horizontal horizon, the verticals and the curves point by point. The [[gnomonic-projection|map version]] of the same drawing is the chart of the navigator and the meteor observer, on which every great circle is straight.

> [!tip] [The sky lab](#/tools/skylab) opens on exactly this picture: choose a direction and a field of view, and watch the stars at the edge of a 120° frame spread out radially. The sun-path overlay that photographers use is the same projection of the same grid (see [the sun-path diagram](#/tools/skylab/sunpath)).`,
  ideas: [
    'A camera is a central projection of the sky onto a flat plane: a direction at angle ψ from the axis lands at r = f tan ψ (the gnomonic projection).',
    'Great circles stay straight: the horizon is a straight line at any tilt, the azimuth lines are straight and, for a level camera, vertical; the altitude lines are hyperbolas.',
    'Tilt the camera upwards and the vertical lines converge on the zenith, the third vanishing point of the picture.',
    'The picture is stretched by sec² ψ along the radius and sec ψ across it, so a wide lens smears the stars at its edges; 180° is out of reach of any rectilinear picture.'
  ],
  pitfalls: [
    'A wider lens just shows more of the same picture — It shows a different drawing: the scale grows as 1/cos² ψ towards the edge, so a 14 mm picture is not a 50 mm picture with more around it, and shapes at its edge are stretched.',
    'The horizon is curved when the camera is tilted — The horizon is a great circle and every great circle is a straight line in a rectilinear picture. A curved horizon means a fisheye lens, a cylindrical panorama, or a lens with barrel distortion.',
    'Buildings lean because of the lens — They lean because the camera is tilted. A level camera keeps verticals parallel whatever the focal length; the tilted one lets them converge, the third vanishing point.'
  ],
  formulas: [
    {
      name: 'Field of view of a lens',
      expr: 'theta = 2*atan(w/(2*f))',
      tex: '\\theta = 2\\arctan\\frac{w}{2f}',
      vars: {
        theta: { name: 'field of view across the sensor', q: 'angle', unit: '°', min: 0, max: 180 },
        w: { name: 'sensor width (or height, or diagonal)', q: 'length', unit: 'mm', value: 36 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'Use the width for the horizontal field, the height for the vertical and the diagonal (43.3 mm on a full frame) for the corner to corner field.',
      stories: { theta: 'A full-frame sensor is {w} wide and the lens has a focal length of {f}. What is the horizontal field of view?' }
    },
    {
      name: 'Where a direction lands on the sensor',
      expr: 'r = f*tan(psi)',
      tex: 'r = f\\tan\\psi',
      vars: {
        r: { name: 'distance from the centre of the picture', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 },
        psi: { name: 'angle from the optical axis', q: 'angle', unit: '°', value: 20, min: 0, max: 89, tex: '\\psi' }
      },
      note: 'The rectilinear (gnomonic) mapping. It grows without limit as the angle approaches 90°.'
    },
    {
      name: 'Stretching along the radius',
      expr: 'm = 1/cos(psi)^2',
      tex: 'm = \\sec^2\\psi',
      vars: {
        m: { name: 'scale along the radius relative to the centre' },
        psi: { name: 'angle from the optical axis', q: 'angle', unit: '°', value: 42, min: 0, max: 89, tex: '\\psi' }
      },
      note: 'Across the radius the stretch is sec ψ. At 42° (the corner of a 24 mm lens) it is 1.81 along and 1.35 across.'
    },
    {
      name: 'Height of an altitude line for a level camera',
      expr: 'y = f*tan(h)/cos(a)',
      tex: 'y = \\frac{f\\tan h}{\\cos a}',
      vars: {
        y: { name: 'height above the horizon line', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 },
        h: { name: 'altitude', q: 'angle', unit: '°', value: 20, min: 0, max: 89 },
        a: { name: 'azimuth measured from the direction the camera looks', q: 'angle', unit: '°', value: 10, min: 0, max: 89 }
      },
      note: 'The camera is level and the horizon runs through the centre of the picture. The altitude line is a hyperbola: the height grows by 1/cos a away from the centre.'
    }
  ],
  examples: [
    {
      title: 'A 24 mm lens on a full-frame sensor',
      q: 'A full-frame camera (36 × 24 mm) carries a 24 mm lens. Find the horizontal, vertical and corner to corner fields of view, and how much a small circle of sky is stretched at a corner.',
      steps: [
        { text: 'Horizontal field, using half the width 18 mm:', tex: '2\\arctan\\frac{18}{24} = 73.7°' },
        { text: 'Vertical field, half the height 12 mm:', tex: '2\\arctan\\frac{12}{24} = 53.1°' },
        { text: 'The half-diagonal is $\\sqrt{18^2 + 12^2} = 21.63$ mm, so the corner is at', tex: '\\psi = \\arctan\\frac{21.63}{24} = 42.0°, \\qquad \\text{field} = 84.0°' },
        { text: 'At the corner the radial stretch and the stretch across are', tex: '\\sec^2 42° = 1.81, \\qquad \\sec 42° = 1.35' }
      ],
      a: 'The field is 73.7° × 53.1° (84.0° corner to corner); at a corner a circle of sky becomes an ellipse stretched 1.81 along the radius and 1.35 across, so about 1.35 times longer than wide.'
    },
    {
      title: 'Is the star in the frame?',
      q: 'A level 24 mm lens looks due south from Tel Aviv. A star stands at altitude 20° and azimuth 190° (10° west of south). Where does it land on the sensor, and does it fit in the 36 × 24 mm frame? What about a star at altitude 30°, same azimuth?',
      steps: [
        { text: 'Across: the star is 10° to the right of the axis, so', tex: 'x = 24\\tan 10° = 4.2\\ \\text{mm}' },
        { text: 'Up, for altitude 20°:', tex: 'y = \\frac{24\\tan 20°}{\\cos 10°} = 8.9\\ \\text{mm}' },
        'The sensor reaches 18 mm sideways and 12 mm upwards from the centre, so the first star is inside.',
        { text: 'For altitude 30° the height is', tex: 'y = \\frac{24\\tan 30°}{\\cos 10°} = 14.1\\ \\text{mm} > 12\\ \\text{mm}' }
      ],
      a: 'The 20° star lands 4.2 mm right and 8.9 mm up, inside the frame; the 30° star would be 14.1 mm up, above the edge of the frame (the frame ends at an altitude of about 26° in that direction).'
    }
  ],
  quiz: [
    { q: 'A level camera with a rectilinear lens records the horizon as', choices: ['a curve bowed upwards', 'a straight horizontal line', 'a circle round the picture', 'a straight line only if the lens is longer than 50 mm'], a: 1, why: 'The horizon is a great circle, and every great circle is a straight line in a central projection onto a plane; level, it is the horizontal through the centre. Curved horizons come from fisheyes and panoramas.' },
    { q: 'What is the horizontal field of view of a 50 mm lens on a sensor 36 mm wide?', answer: 39.6, unit: '°', why: '2 arctan(18/50) = 2 × 19.8° = 39.6°.' },
    { q: 'Tilting a camera up towards the sky makes the vertical lines of the scene converge towards the zenith.', a: true, why: 'The vertical lines are great circles through the zenith; a central projection sends them to lines that meet at the image of the zenith, the third vanishing point.' },
    { q: 'At the corner of a wide-angle picture a round star is drawn as an ellipse. Its long axis points', choices: ['along the radius, away from the centre', 'across the radius, round the centre', 'vertically in every part of the frame', 'towards the nearest corner of the sensor and nowhere else'], a: 0, why: 'The stretch is sec² ψ along the radius and only sec ψ across it, so the long axis is radial.' },
    { q: 'By what factor is a small circle of sky stretched along the radius at 60° from the optical axis?', answer: 4, why: 'sec² 60° = 1/cos² 60° = 1/0.25 = 4.' }
  ],
  applications: [
    'Astrophotography: wide-field sky pictures, Milky Way arches and star trails are rectilinear pictures; planning apps overlay the altitude–azimuth grid, the Milky Way and the Sun\'s path on the camera view with exactly r = f tan ψ.',
    'Astronomical imaging and plate solving: sky survey images and the "TAN" projection of the standard coordinate system for astronomical images are the gnomonic projection, a tangent plane at the centre of each field.',
    'Meteor plotting: a meteor\'s track is a great-circle arc, so observers mark it on a gnomonic star chart, where it is a straight line that can be ruled in and extended back to its radiant.',
    'Architecture and solar design: sun-position overlays on a site photograph, and shading studies of the view from a window, are rectilinear pictures of the altitude–azimuth grid.',
    'Camera calibration and photogrammetry: the first step in treating a photograph as a measurement is to know how far a lens departs from r = f tan ψ.'
  ],
  history: 'The straight-line picture is as old as perspective: Alberti\'s window (1435) and Dürer\'s devices both intercept the visual rays on a flat plane. The mapping of the sphere that corresponds to it, the gnomonic projection, is named after the gnomon of the sundial and tradition attributes it to Thales; its use for sky charts and for great-circle courses is old. Photographic lenses learned to deliver it over wide angles slowly: the Rapid Rectilinear and the aplanat of 1866 were corrected for distortion over some 50°, the Goerz Hypergon of about 1900 covered more than 130°, and the symmetrical wide-angle designs of the 1930s (the Zeiss Topogon for aerial survey) made the wide rectilinear picture a precision instrument.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the gnomonic projection.', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13, on transformation of coordinates.', 'Mark R. Calabretta and Eric W. Greisen, "Representations of celestial coordinates in FITS", *Astronomy & Astrophysics* 395 (2002), on the tangent-plane (TAN) projection.', 'Sidney F. Ray, *Applied Photographic Optics*, the chapters on angle of view and perspective.'],
  sim: 'sm-camera-fov',
  construction: 'sm-horizon-view-grid'
},

{
  id: 'the-all-sky-view',
  parent: 'sky-maps-and-instruments',
  title: 'The all-sky view',
  level: 1,
  short: 'A fisheye camera pointed at the zenith draws the whole sky in a disc: the zenith at the centre, the horizon on the rim and the distance from the centre proportional to the angle from the zenith, r = fθ. It is the azimuthal equidistant projection of the sky, with north at the top and east on the left.',
  keywords: ['all-sky', 'fisheye', 'equidistant', 'azimuthal equidistant', 'zenith', 'aurora camera', 'hemispherical photography', 'sky camera', 'cloud cover', 'r = f theta'],
  prereq: ['horizon-coordinates', 'azimuthal-equidistant-projection', 'fisheye-projections'],
  related: ['equidistant-fisheye', 'stereographic-fisheye', 'looking-at-the-horizon', 'planetarium-domes', 'sun-path-diagrams', 'little-planet'],
  body: `### The sky in a disc
Look up from a field and the sky is half a sphere of directions. A camera with a fisheye lens, aimed at the zenith, draws all of it in a circle: the zenith in the centre, the horizon on the rim, each compass direction at its own angle round the centre. The lens obeys one rule, **the radius is proportional to the angle from the zenith**,
$$r = f\\,\\theta, \\qquad \\theta = 90° - h,$$
with $\\theta$ in radians. This is the [[azimuthal-equidistant-projection]] of the hemisphere, centred on the zenith: distance along every line through the centre is true, so the rings of altitude are circles spaced evenly, a star at altitude 60° is a third of the way from the centre to the rim, and one at 30° two thirds of the way. A lens that gives an image circle 8 mm across for the full 180° has $f = 4/(\\pi/2) = 2.55$ mm and 44 µm per degree: a pixel 3.75 µm wide then covers 0.084°.

### Orientation: the mirror of a plan
Held over your head, the picture is the sky as you see it, with north at the top and **east on the left**: the reverse of a map or a [[sun-path-diagrams|sun-path plan]], where east is on the right. The azimuth of a star is the angle round the centre, measured from the top through the left (north, east, south, west run anticlockwise).

### What it keeps and what it loses
Along a radius the scale is the same everywhere. Across it, it grows: a ring at zenith distance $\\theta$ has circumference $2\\pi f\\theta$ on the picture against $2\\pi\\sin\\theta$ on the sphere, so shapes are stretched across the radius by $\\theta/\\sin\\theta$, nothing at the zenith and 1.57 at the horizon. The projection keeps neither areas nor angles (the [[stereographic-fisheye|stereographic fisheye]] keeps angles, the [[equisolid-fisheye|equisolid]] keeps areas), but it is the most natural for measuring: one pixel is the same angle at every radius. Where a halfway star lies depends on the lens: at 45° from the zenith it sits at 0.50 of the rim for the equidistant lens, 0.54 for the equisolid, 0.41 for the stereographic and 0.71 for the orthographic.

### Drawing it by hand
Draw the horizon circle, divide its radius into nine equal parts with the dividers for the rings of altitude every 10°, divide the angles every 30° with the protractor for the azimuths, and plot each star at (azimuth, radius $= R\\,(90° - h)/90°$). The construction below does it for Orion and the Plough, using the altitudes and azimuths the engine computes from right ascension and declination.

> [!note] [The sky lab](#/tools/skylab) has this view ("the whole sky overhead") beside the stereographic and the rectilinear ones. A camera never records the whole 180° honestly: lenses are made to cover 180° or 220° across the diagonal, and the sky camera of an observatory is a 180° lens sealed in a dome with a heater against dew.`,
  ideas: [
    'An all-sky camera pointed at the zenith maps a direction at zenith distance θ to the radius r = fθ: zenith in the centre, horizon on the rim.',
    'It is the azimuthal equidistant projection of the sky, with north at the top and east on the LEFT, the mirror image of a plan.',
    'Along a radius the scale is constant (one pixel, one angle); across it, shapes are stretched by θ/sin θ, up to 1.57 at the horizon.',
    'Other fisheye lenses map the same angle to a different radius: equisolid 2f sin(θ/2), stereographic 2f tan(θ/2), orthographic f sin θ.'
  ],
  pitfalls: [
    'The all-sky picture is a map of the sky seen from above — It is seen from below. Put it on the table north up and east is on the left; a plan view has east on the right.',
    'Equal areas of the picture are equal areas of sky — Not for the equidistant lens: a degree of azimuth is long at the rim and short near the centre. The equisolid lens is the one that keeps areas.',
    'The sky near the horizon is as large on the picture as it looks — The picture exaggerates the rim: a ring of altitude 10° has 1.57 times the circumference per degree that the sky itself has there.'
  ],
  formulas: [
    {
      name: 'Image radius of a fisheye (equidistant)',
      expr: 'r = f*theta',
      tex: 'r = f\\theta',
      vars: {
        r: { name: 'distance from the centre of the image', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 2.55 },
        theta: { name: 'angle from the zenith (zenith distance)', q: 'angle', unit: '°', value: 60, min: 0, max: 100, tex: '\\theta' }
      },
      note: 'The angle is taken in radians inside the formula, so f times 1.5708 gives the radius of the horizon circle (about 4 mm for f = 2.55 mm).'
    },
    {
      name: 'Altitude from the radius in a 180° image',
      expr: 'h = (pi/2)*(1 - r/Rim)',
      tex: 'h = \\frac{\\pi}{2}\\left(1 - \\frac{r}{R_{\\mathrm{im}}}\\right)',
      vars: {
        h: { name: 'altitude of the star', q: 'angle', unit: '°', min: 0, max: 90 },
        r: { name: 'its distance from the centre of the picture', q: 'length', unit: 'mm', value: 2.6 },
        Rim: { name: 'radius of the horizon circle in the picture', q: 'length', unit: 'mm', value: 4, tex: 'R_{\\mathrm{im}}' }
      },
      note: 'Valid for a 180° equidistant image whose horizon lies on the edge of the circle; r = 0 is the zenith, r = Rim the horizon.'
    },
    {
      name: 'Stretching across the radius',
      expr: 'k = theta/sin(theta)',
      tex: 'k = \\frac{\\theta}{\\sin\\theta}',
      vars: {
        k: { name: 'stretch of shapes across the radius' },
        theta: { name: 'angle from the zenith', q: 'angle', unit: '°', value: 70, min: 1, max: 100, tex: '\\theta' }
      },
      note: 'The circumference of a ring grows as θ while the circle on the sphere grows as sin θ. At θ = 90° the factor is π/2 = 1.571.'
    }
  ],
  examples: [
    {
      title: 'A star in a sky-camera image',
      q: 'An all-sky camera records the 180° field in a circle of radius 1000 pixels (equidistant lens). A star appears 650 pixels from the centre, to the upper left. What is its altitude, how many pixels make one degree, and in which direction is it?',
      steps: [
        { text: 'The radius is proportional to the zenith distance:', tex: '\\theta = 90° \\times \\frac{650}{1000} = 58.5°' },
        { text: 'The altitude is the complement:', tex: 'h = 90° - 58.5° = 31.5°' },
        { text: 'The scale is the same at every radius:', tex: '\\frac{1000}{90°} = 11.1\\ \\text{px per degree}' },
        'To the upper left means between north (up) and east (left): a north-easterly azimuth, between 0° and 90°.'
      ],
      a: 'Altitude 31.5° (zenith distance 58.5°), 11.1 pixels per degree, in the north-east quarter of the sky.'
    },
    {
      title: 'The lens of an all-sky camera',
      q: 'An equidistant 180° fisheye forms an image circle 8.0 mm across. Find the focal length and the angle one 3.75 µm pixel covers.',
      steps: [
        { text: 'The horizon, θ = 90° = π/2 rad, lies at r = 4.0 mm:', tex: 'f = \\frac{r}{\\theta} = \\frac{4.0}{1.5708} = 2.55\\ \\text{mm}' },
        { text: 'One degree is 0.01745 rad, so on the sensor', tex: 'f \\times 0.01745 = 44.4\\ \\mu\\text{m per degree}' },
        { text: 'A pixel therefore covers', tex: '\\frac{3.75}{44.4} = 0.084° = 5.1\'' }
      ],
      a: 'f = 2.55 mm; 44 µm to the degree; a 3.75 µm pixel covers 0.084°, about 5 arcminutes, the same everywhere in the picture.'
    }
  ],
  quiz: [
    { q: 'In an equidistant all-sky image, a star at altitude 45° lies', choices: ['at 0.50 of the way from the centre to the rim', 'at 0.41 of the way', 'at 0.71 of the way', 'at 0.25 of the way'], a: 0, why: 'The radius is proportional to the zenith distance, which is 45° of 90°: exactly halfway. (0.41 is the stereographic lens, 0.71 the orthographic.)' },
    { q: 'You hold the all-sky picture over your head with north at the top. East is on the right.', a: false, why: 'It is the sky as seen from below, looking up: east is on the left. On a map or a plan view, east is on the right.' },
    { q: 'The horizon circle in a 180° equidistant image has a radius of 900 pixels. At what radius, in pixels, is a star at altitude 20°?', answer: 700, why: 'Zenith distance 70° of 90°: 900 × 70/90 = 700 pixels.' },
    { q: 'What does the equidistant fisheye keep true?', choices: ['angles between lines on the sphere', 'areas', 'the angle from the centre along any line through it (distance from the centre)', 'straight lines'], a: 2, why: 'r = fθ keeps the angular distance from the centre: the scale along every radius is f. Angles in general are kept only by the stereographic projection, areas by the equisolid one, straight lines by the rectilinear lens.' },
    { q: 'By what factor are shapes stretched across the radius at the horizon of an equidistant image?', answer: 1.57, why: 'θ/sin θ with θ = 90° = π/2 rad is π/2 = 1.571.' }
  ],
  applications: [
    'Aurora, meteor and cloud monitoring: observatories run fixed all-sky cameras whose images give every azimuth and altitude in one frame, with the same angular scale everywhere.',
    'Hemispherical photography in forest ecology and building design: a fisheye photograph taken upwards gives the fraction of open sky in rings of zenith distance (canopy gaps, sky view factor, access to sunlight), and the sun\'s path can be drawn on it.',
    'Solar energy forecasting: sky imagers estimate cloud cover and the Sun\'s obstruction minutes ahead.',
    'Light-pollution and sky-quality surveys, and the sky-watching cameras of amateur networks.',
    'Planetarium content: the all-sky disc is, with a square frame and unused corners, the dome master of the [[planetarium-domes|planetarium]].'
  ],
  history: 'The fisheye took its name from R. W. Wood, who in 1906 described how the world looks to a fish under still water, a hemisphere squeezed through a window, and built a water-filled camera to photograph it. Lenses that covered the whole sky followed: W. N. Bond\'s hemispherical design of 1922 and the Hill sky lens of 1924, made for the cloud photographs of the British Meteorological Office. The aurora all-sky camera, a convex mirror photographed from above, was the instrument of the International Geophysical Year of 1957–58. The equidistant mapping itself, the azimuthal equidistant projection, was in use for maps centred on a city long before: it is credited to the Arab scholar al-Biruni about the year 1000.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapter on the azimuthal equidistant projection.', 'Sidney F. Ray, *Applied Photographic Optics*, the chapter on fisheye and wide-angle lenses.', 'Juho Kannala and Sami Brandt, "A generic camera model and calibration method for conventional, wide-angle and fish-eye lenses", *IEEE Transactions on Pattern Analysis and Machine Intelligence* 28 (2006).'],
  sim: 'sm-dome-mapping',
  construction: 'sm-all-sky-grid'
},

{
  id: 'the-planisphere',
  parent: 'sky-maps-and-instruments',
  title: 'The planisphere',
  level: 2,
  short: 'A star wheel turning behind a card with an oval window: the northern sky drawn in the polar stereographic projection, the window cut along the horizon of one latitude. Set the date against the time and the window shows the sky overhead — the whole sky as a computer made of two circles and a pin.',
  keywords: ['planisphere', 'star wheel', 'star finder', 'polar stereographic', 'horizon mask', 'sidereal time', 'date scale', 'Planisphaerium', 'ecliptic circle'],
  prereq: ['stereographic-projection', 'horizon-coordinates', 'equatorial-coordinates', 'sidereal-time-and-hour-angle'],
  related: ['the-astrolabe', 'polar-star-charts', 'all-sky-charts', 'islamic-astrolabe-makers', 'durer-star-maps-1515'],
  body: `### Two circles and a pin
A planisphere is a star chart that turns. The **wheel** carries the sky as a polar chart; the **mask** is a card with an oval window cut along the horizon of one latitude. The wheel is the [[stereographic-projection|stereographic projection]] of the celestial sphere from the south celestial pole onto the plane of the equator: a point at declination $\\delta$, polar distance $p = 90° - \\delta$ from the north pole, lies at
$$r = R\\tan\\frac{p}{2} = R\\tan\\Bigl(45° - \\frac{\\delta}{2}\\Bigr),$$
where $R$ is the radius of the celestial equator. The equator is the circle $r = R$, the tropic of Capricorn $1.52R$, declination −40° the circle $2.14R$, and Polaris sits almost on the centre. Right ascension is the angle at the pole, 15° to the hour, clockwise as the sky is seen looking up (north up, east on the left).

### What the projection gives
Circles stay circles and angles stay true. Every declination circle is centred on the pole, and so is no other circle of the sky: the ecliptic, tilted 23.44° to the equator, is a circle off-centre of radius $R/\\cos\\varepsilon = 1.09R$ whose centre lies $R\\tan\\varepsilon = 0.43R$ from the pole towards 18 h (find both from the two tropic circles; the construction does). The scale grows outwards, as $\\sec^2(p/2)$: the southern stars are drawn four times larger than those near the pole at declination −30°, and the wheel must stop somewhere, at about −40° to −50°, which is why a planisphere shows only the part of the southern sky that rises at the latitude it is made for.

### The mask: the horizon on the same chart
The horizon is also a circle of the sphere, so on the chart it is a circle. It passes through the north point (polar distance $\\varphi$), the south point ($180° - \\varphi$) and the east and west points on the equator circle at right angles to the meridian, which gives, on the meridian line,
$$\\text{radius } \\frac{R}{\\sin\\varphi}, \\qquad \\text{centre } R\\cot\\varphi \\text{ from the pole towards the zenith.}$$
For $\\varphi = 51.5°$ that is $1.28R$ and $0.80R$. Circles of equal altitude are drawn the same way inside it, round the zenith, which lies at declination $\\varphi$ on the meridian. Outside the oval the card hides the stars below the horizon.

### Setting it
The date scale on the rim of the wheel is the Sun's right ascension on each day; the mask's rim is graduated in hours with noon at the south end of the meridian. Turn the wheel until the date mark meets the hour: the wheel then stands at the sidereal time $\\theta = \\alpha_\\odot + 15°\\,(t - 12\\,\\mathrm{h})$ and the oval shows the sky overhead. Accuracy is of the order of 10 minutes of time. A mask works for a band of latitudes about 5° either side; from Tel Aviv the horizon reaches declination −58° and needs a different card, and a wheel that goes out to −55°.

### Drawing it by hand
The two constructions below make the whole thing: the wheel (declination circles by the inscribed-angle method with no table of tangents, hour spokes with the protractor, the ecliptic from the tropics, the date ring from the Sun's right ascension, stars from a table of polar distances) and the mask (the horizon through E, W and the north point).

> [!tip] [The sky lab](#/tools/skylab) has a planisphere view of the same chart; the simulation below lets you set the date, the hour and the latitude of the mask, and run the night.`,
  ideas: [
    'The star wheel is the polar stereographic projection of the sky: a star at polar distance p lies at R tan(p/2) from the pole, at the angle of its right ascension.',
    'Circles stay circles: the declination circles are concentric, the ecliptic is a circle off-centre (radius R/cos ε, centre R tan ε from the pole), and the horizon of latitude φ is a circle of radius R/sin φ centred R cot φ from the pole.',
    'The mask carries the horizon of one latitude; the wheel is the same for every latitude, so a planisphere is good for a band of about ±5°.',
    'Setting it is solving θ = α☉ + 15°(t − 12 h): the date on the rim against the time on the mask.'
  ],
  pitfalls: [
    'The wheel and the mask are two views of the same sky — The wheel is fixed to the stars and turns once a day; the mask is fixed to the horizon of one place. Stars move through the window, the window never moves over the stars.',
    'A planisphere works anywhere — The mask is cut for a latitude. Used far from it the horizon is wrong, and so is the list of stars that never set or never rise.',
    'The Sun is a point on the wheel like a star — The Sun moves along the ecliptic, about 1° a day, so the date scale is where the Sun is on that date. Planets are not on the wheel at all: their places change from year to year.'
  ],
  formulas: [
    {
      name: 'Radius of a declination circle on the wheel',
      expr: 'r = R*tan(pi/4 - delta/2)',
      tex: 'r = R\\tan\\Bigl(45° - \\frac{\\delta}{2}\\Bigr)',
      vars: {
        r: { name: 'distance from the pole on the wheel', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 60 },
        delta: { name: 'declination', q: 'angle', unit: '°', value: -30, signed: true, min: -85, max: 89 }
      },
      note: 'The inscribed-angle construction produces this radius without a table: the line from the opposite end of the diameter to the point at polar distance p cuts the diameter at R tan(p/2).'
    },
    {
      name: 'Horizon circle on the chart: radius',
      expr: 'rho = R/sin(phi)',
      tex: '\\rho = \\frac{R}{\\sin\\varphi}',
      vars: {
        rho: { name: 'radius of the horizon circle', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 60 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, min: 5, max: 89, tex: '\\varphi' }
      },
      note: 'The centre of the horizon circle lies R cot φ from the pole, on the side of the zenith.'
    },
    {
      name: 'Where the centre of the horizon circle lies',
      expr: 'd = R/tan(phi)',
      tex: 'd = R\\cot\\varphi',
      vars: {
        d: { name: 'distance of the centre from the pole', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 60 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, min: 5, max: 89, tex: '\\varphi' }
      },
      note: 'At the pole (φ = 90°) the horizon is the equator circle itself, centred on the pole; towards the equator the centre runs off to infinity and the horizon becomes a straight line.'
    },
    {
      name: 'Setting the planisphere: sidereal time from date and clock',
      expr: 'theta = alpha + 15*(t - 12)*pi/180',
      tex: '\\theta = \\alpha_{\\odot} + 15°\\,(t - 12\\,\\mathrm{h})',
      vars: {
        theta: { name: 'sidereal time (angle of the wheel)', q: 'angle', unit: '°', min: -360, max: 720, signed: true, tex: '\\theta' },
        alpha: { name: 'right ascension of the Sun on that date', q: 'angle', unit: '°', value: 297, min: 0, max: 360, tex: '\\alpha_{\\odot}' },
        t: { name: 'local mean time (hours, from midnight)', q: false, unit: 'h', value: 22 }
      },
      note: 'Right ascension in degrees (15° to the hour); the Sun\'s is about 281° on 1 January, 0° on 21 March, 90° on 21 June, 180° on 23 September. Add or subtract 360° to bring the result into 0°–360°. The planisphere ignores the equation of time (up to 16 minutes).'
    }
  ],
  examples: [
    {
      title: 'Marking out a wheel',
      q: 'A star wheel has an equator circle of radius 60 mm and stops at declination −40°. Find the radii of the declination circles +60°, −30° and −40°, the radius of the ecliptic and the distance of its centre from the pole.',
      steps: [
        { text: 'Use $r = R\\tan(45° - \\delta/2)$:', tex: 'r_{+60} = 60\\tan 15° = 16.1\\ \\text{mm}, \\quad r_{-30} = 60\\tan 60° = 103.9\\ \\text{mm}, \\quad r_{-40} = 60\\tan 65° = 128.7\\ \\text{mm}' },
        { text: 'The ecliptic circle:', tex: 'R/\\cos 23.44° = 65.4\\ \\text{mm}, \\qquad R\\tan 23.44° = 26.0\\ \\text{mm from the pole towards 18 h}' },
        'Check with the two tropics: Cancer at 60 tan 33.28° = 39.4 and Capricorn at 60 tan 56.72° = 91.4, on the 6 h–18 h line, are the two ends of the ecliptic\'s diameter. Their sum, 130.8, is twice 65.4, and their difference over two, 26.0, is the distance of the centre.'
      ],
      a: 'Radii 16.1, 103.9 and 128.7 mm; the ecliptic has radius 65.4 mm and centre 26.0 mm from the pole towards 18 h.'
    },
    {
      title: 'Is Orion up?',
      q: 'On 15 January at 22:00 local mean time the Sun\'s right ascension is about 19.8 h. To what sidereal time is the planisphere set, and is Orion (right ascension 5.6 h, declination about 0°) up for an observer at latitude 51.5° N?',
      steps: [
        { text: 'The wheel angle, at 15° (one hour of right ascension) to each clock hour:', tex: '\\theta = 19.8\\ \\text{h} + (22 - 12)\\ \\text{h} = 29.8\\ \\text{h} \\equiv 5.8\\ \\text{h}' },
        'The hour angle of Orion is θ − α = 5.8 − 5.6 = +0.2 h: it crossed the meridian twelve minutes ago.',
        { text: 'Its altitude on the meridian:', tex: 'h = 90° - 51.5° + 0° = 38.5°' }
      ],
      a: 'Set to 5.8 h of sidereal time; Orion has just passed the meridian, 38.5° high in the south, in the middle of the window.'
    }
  ],
  quiz: [
    { q: 'On the star wheel the equator is the circle of radius R. The tropic of Capricorn (declination −23.4°) is a circle of radius about', choices: ['0.66 R', '1.52 R', '1.39 R', '2.0 R'], a: 1, why: 'R tan((90° + 23.44°)/2) = R tan 56.72° = 1.52 R. (0.66 R is the tropic of Cancer, on the other side of the equator circle.)' },
    { q: 'A planisphere made for latitude 52° N works just as well in Tel Aviv (32° N) if you only change the date.', a: false, why: 'The mask is cut along the horizon of 52° N, a different circle from the horizon of 32° N. Stars far south of the mask\'s south edge would be shown as hidden when they rise, and the circumpolar stars would be wrong.' },
    { q: 'In units of the radius of the equator circle, how big is the horizon circle of a planisphere for latitude 30°?', answer: 2, why: 'R / sin φ = R / sin 30° = 2 R.' },
    { q: 'Which circle of the sky is NOT centred on the pole of the wheel?', choices: ['the celestial equator', 'the tropic of Cancer', 'the circle of declination +60°', 'the ecliptic'], a: 3, why: 'The circles of declination are all centred on the pole. The ecliptic is tilted 23.44° to the equator, so its image is a circle of radius R/cos ε whose centre is off the pole.' },
    { q: 'The stars appear to turn round the pole once a sidereal day because', choices: ['the planisphere\'s wheel is driven by the date', 'the Earth turns once in 23 h 56 min', 'the stars circle the Earth', 'the ecliptic is tilted'], a: 1, why: 'The Earth\'s rotation carries the horizon past the sky; the wheel is turned by hand to imitate it. It is an anticlockwise turn for an observer looking up at the northern sky.' }
  ],
  applications: [
    'Amateur astronomy: finding what is up on a given night, when a constellation rises, which stars are circumpolar — read in red light, with no battery.',
    'Teaching the celestial sphere: right ascension, declination, the ecliptic, the changing sky through the year and the effect of latitude are all visible by turning a card.',
    'Navigation and survival: identifying stars and the pole, and reading the time at night from the position of the Plough and of Cassiopeia.',
    'The planetarium and observatory handout: the planisphere is the cheapest projection instrument there is, and the model of every digital "what is up tonight" app.',
    'Historical instruments: the star wheel inside the astrolabe and the anaphoric clock of the ancients is the same wheel with a brass horizon in place of a card.'
  ],
  history: 'The projection behind the wheel is traditionally credited to Hipparchus, in the second century BC; Ptolemy set out its mathematics in his *Planisphaerium*, which survived in Arabic and reached Latin Europe in 1143 in Hermann of Carinthia\'s translation. Vitruvius describes in the first century BC an "anaphoric" clock in which a star disc turned behind a wire net of horizon and hour lines, and the astrolabe, in late antiquity and above all in the Islamic world, put the same wheel in the hand. The planisphere as a paper star-finder, a printed wheel in a mask, belongs to the age of printed star charts: star-finders of this kind are found from the early modern period on, and became the standard teaching instrument of astronomy clubs and schools in the nineteenth and twentieth centuries.',
  sources: ['Ptolemy, *Planisphaerium*, in the Latin translation of Hermann of Carinthia (1143); see the commentary in Sidoli and Berggren, "The Arabic version of Ptolemy\'s Planisphere", *SCIAMVS* 8 (2007).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), the chapters on the celestial sphere and the stereographic projection.', 'Michael Hoskin (ed.), *The Cambridge Concise History of Astronomy* (1999).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 12 and 13, on sidereal time and coordinates.'],
  sim: 'sm-planisphere-wheel',
  construction: ['sm-planisphere-wheel', 'sm-planisphere-mask']
},

{
  id: 'the-astrolabe',
  parent: 'sky-maps-and-instruments',
  title: 'The astrolabe',
  level: 3,
  short: 'The planisphere in brass, with the horizon engraved: a plate cut for one latitude carrying the horizon, the circles of equal altitude and the meridian, and over it the rete, an open-work star map with the ecliptic ring and the star pointers. The same stereographic projection, now used to tell the time from the height of the Sun, to find rising and setting, and to survey.',
  keywords: ['astrolabe', 'rete', 'plate', 'tympan', 'mater', 'alidade', 'almucantar', 'stereographic', 'ecliptic ring', 'star pointer', 'time from altitude'],
  prereq: ['stereographic-projection', 'the-planisphere', 'horizon-coordinates', 'equatorial-coordinates'],
  related: ['islamic-astrolabe-makers', 'sundials-as-projections', 'armillary-sphere-and-celestial-globe', 'hipparchus-and-ptolemy-sky', 'crystallography-stereographic'],
  body: `### The sky as a brass disc
An astrolabe is made of a few circular parts. The **mater** is the hollow body with a graduated rim; in it lie one or more **plates** (tympans), each engraved for one latitude; over the plates turns the **rete**, a cut-away disc carrying the ecliptic and the pointers of the brightest stars; on the back are the sights (the **alidade**) with which the Sun or a star is measured. Plate and rete are the same stereographic projection of the celestial sphere from the south celestial pole onto the plane of the equator that the [[the-planisphere|planisphere]] uses, but seen from outside the sphere, with the zenith at the top: a point at declination $\\delta$ and hour angle $H$ is at distance $r = R\\tan\\frac{90° - \\delta}{2}$ from the pole, $H$ degrees clockwise from the vertical. The plate stops at the tropic of Capricorn, radius $1.52R$.

### What is engraved on the plate
Because the stereographic projection sends every circle of the sphere to a circle, the plate is a set of circles and straight lines. The **horizon** is the circle through the east and west points of the equator circle and the north point of the horizon, $R\\tan(\\varphi/2)$ below the pole; its radius is $R/\\sin\\varphi$ and its centre $R\\cot\\varphi$ above the pole, so the south of it runs off the plate. The **almucantars**, the circles of equal altitude $a$, are circles of radius and centre
$$\\rho = \\frac{R\\cos a}{\\sin\\varphi + \\sin a}, \\qquad c = \\frac{R\\cos\\varphi}{\\sin\\varphi + \\sin a},$$
shrinking round the zenith, which is $R\\tan(45° - \\varphi/2)$ above the pole. The vertical line is the meridian; lines of azimuth are circles through the zenith and the point diametrically opposite it.

### The rete
The ecliptic ring is a circle off-centre: radius $R/\\cos\\varepsilon$, centre $R\\tan\\varepsilon$ from the pole. Hand-drawn, it is found from the two ends of its diameter on the meridian, the points where it meets the tropics (the ring's top lies on the circle of Cancer and its bottom on the circle of Capricorn). Equal arcs of ecliptic longitude are not equal on the ring, so the zodiac signs are set off from the right ascension and declination of each division. The star pointers are set out from tables of right ascension and declination. Turn the rete over the plate and the sky turns past the horizon: clockwise, stars rising on the left (east) of the horizon, crossing the meridian at the top, setting on the right.

### What it computes
Measure the altitude of the Sun with the alidade. Mark the Sun's place on the ecliptic for the date; turn the rete until that place lies on the almucantar of the measured altitude; the position of the rete against the rim tells the hour. Behind it is the spherical triangle $\\cos H = \\dfrac{\\sin h - \\sin\\varphi\\sin\\delta}{\\cos\\varphi\\cos\\delta}$, solved by turning a disc. Set the Sun on the horizon and the same instrument gives the time and azimuth of sunrise and sunset, the length of the day, the ascendant (the point of the ecliptic on the horizon), the time of any star's rising, and, from the shadow square on the back, the height of a tower.

### Drawing it by hand
The construction below makes the plate for Tel Aviv and sets the rete at sidereal time 6 h with the whole compass-and-straightedge repertoire: the tropics and horizon by the inscribed-angle trick, the centre of the horizon circle from the perpendicular bisector, the ecliptic ring from the tropics.`,
  ideas: [
    'The astrolabe is a stereographic star map in brass: the plate (fixed, cut for one latitude) carries the horizon, the altitude circles and the meridian; the rete (turning) carries the ecliptic ring and the star pointers.',
    'Everything is a circle or a line, so it is drawn with compass and straightedge: the horizon has radius R/sin φ, the almucantar of altitude a has radius R cos a/(sin φ + sin a), the ecliptic ring has radius R/cos ε.',
    'The instrument solves the spherical triangle cos H = (sin h − sin φ sin δ)/(cos φ cos δ) by turning a disc: set the Sun\'s place on the almucantar of its measured altitude and read the hour.',
    'A plate serves one latitude; a mater holds several plates, and the universal astrolabe (the saphaea) dispenses with the plate by using a different projection.'
  ],
  pitfalls: [
    'The astrolabe is a sea-going instrument — The mariner\'s astrolabe, a plain graduated ring, only measured the altitude of the Sun or a star. The planispheric astrolabe of this page is a computer, too delicate for a deck.',
    'The astrolabe shows the sky as you see it — It shows it from outside the sphere (the view on a globe), with the zenith at the top and east on the left, so stars turn clockwise; the ground view of a planisphere has the zenith at the bottom.',
    'The zodiac divisions are equally spaced round the ecliptic ring — They are equal in longitude, not in angle on the ring: the projection from the south celestial pole crowds the signs of the southern half of the ring.'
  ],
  formulas: [
    {
      name: 'Radius of an altitude circle on the plate',
      expr: 'rho = R*cos(a)/(sin(phi) + sin(a))',
      tex: '\\rho = \\frac{R\\cos a}{\\sin\\varphi + \\sin a}',
      vars: {
        rho: { name: 'radius of the circle of altitude a', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 60 },
        a: { name: 'altitude', q: 'angle', unit: '°', value: 30, min: 0, max: 89 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, min: 5, max: 89, tex: '\\varphi' }
      },
      note: 'At a = 0° this is the horizon, R/sin φ. The centre of the circle lies R cos φ / (sin φ + sin a) from the pole, on the zenith side.'
    },
    {
      name: 'Radius of the ecliptic ring',
      expr: 'Re = R/cos(eps)',
      tex: 'R_{\\mathrm{e}} = \\frac{R}{\\cos\\varepsilon}',
      vars: {
        Re: { name: 'radius of the ecliptic ring', q: 'length', unit: 'mm', tex: 'R_{\\mathrm{e}}' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 60 },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 60, tex: '\\varepsilon' }
      },
      note: 'Its centre is R tan ε from the pole, towards the point of right ascension 18 h, and its diameter runs from the tropic of Cancer circle to the tropic of Capricorn circle along the 6 h–18 h line.'
    },
    {
      name: 'Hour angle from the altitude of the Sun',
      expr: 'cos(H) = (sin(h) - sin(phi)*sin(delta))/(cos(phi)*cos(delta))',
      tex: '\\cos H = \\frac{\\sin h - \\sin\\varphi\\sin\\delta}{\\cos\\varphi\\cos\\delta}',
      vars: {
        H: { name: 'hour angle (angle of the Sun from the meridian)', q: 'angle', unit: '°', min: 0, max: 180 },
        h: { name: 'measured altitude of the Sun', q: 'angle', unit: '°', value: 30, signed: true, min: -10, max: 89 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, min: 0, max: 80, tex: '\\varphi' },
        delta: { name: 'declination of the Sun on the date', q: 'angle', unit: '°', value: 0, signed: true, min: -23.5, max: 23.5 }
      },
      solveFor: 'H',
      note: 'The hour angle is 15° to the hour: H = 53.9° is 3.59 h, so an altitude of 30° at the equinox in Tel Aviv means about 08:25 solar time in the morning or 15:35 in the afternoon (the astrolabe cannot tell which; the rete\'s side can).'
    }
  ],
  examples: [
    {
      title: 'Reading the time',
      q: 'At Tel Aviv (32° N) on 21 March, when the Sun\'s declination is 0°, you measure the Sun\'s altitude as 30° in the morning. What is the apparent solar time?',
      steps: [
        { text: 'Hour angle from the altitude:', tex: '\\cos H = \\frac{\\sin 30° - 0}{\\cos 32°\\cos 0°} = \\frac{0.5}{0.848} = 0.590, \\qquad H = 53.9°' },
        'Fifteen degrees to the hour: 53.9° / 15 = 3.59 h, which is 3 h 35 min before noon.',
        'Morning, so the time is 12:00 − 3 h 35 min = 08:25 apparent solar time.'
      ],
      a: 'About 08:25 apparent solar time. On the astrolabe: turn the rete until the Sun\'s place on the ecliptic (the equinox point, on the equator circle) sits on the almucantar of 30° east of the meridian.'
    },
    {
      title: 'An altitude circle on the plate',
      q: 'Find the radius and the centre of the horizon circle and of the 30° almucantar on the plate for Tel Aviv (φ = 32°) with an equator circle of radius R = 60 mm.',
      steps: [
        { text: 'Horizon (a = 0):', tex: '\\rho = \\frac{60}{\\sin 32°} = 113.2\\ \\text{mm}, \\qquad c = 60\\cot 32° = 96.0\\ \\text{mm}' },
        { text: 'The almucantar of 30°:', tex: '\\rho = \\frac{60\\cos 30°}{\\sin 32° + \\sin 30°} = \\frac{51.96}{1.030} = 50.5\\ \\text{mm}, \\qquad c = \\frac{60\\cos 32°}{1.030} = 49.4\\ \\text{mm}' },
        'Both centres lie on the meridian above the pole, towards the zenith; the horizon circle is so large that most of it is off the plate.'
      ],
      a: 'Horizon: radius 113.2, centre 96.0 above the pole. 30° almucantar: radius 50.5, centre 49.4 above the pole (all in mm).'
    }
  ],
  quiz: [
    { q: 'What does the rete of an astrolabe carry?', choices: ['the horizon and the altitude circles', 'the ecliptic ring and the pointers of the bright stars', 'the sights for measuring altitude', 'the hour scale of the rim'], a: 1, why: 'The rete is the open-work part that turns over the plate: it carries the ecliptic ring (with the zodiac) and the star pointers. The horizon and altitude circles are engraved on the fixed plate.' },
    { q: 'One plate of an astrolabe is good for every latitude.', a: false, why: 'The horizon and the almucantars depend on the latitude (the horizon circle has radius R/sin φ), so each plate is engraved for one; a mater holds several, and the universal astrolabe uses another projection.' },
    { q: 'An astrolabe plate has an equator circle of radius 100 mm. The ecliptic ring on its rete has radius', answer: 109, unit: 'mm', why: 'R/cos 23.44° = 100/0.9175 = 109.0 mm, centred 43.4 mm from the pole.' },
    { q: 'As time passes the rete of a northern astrolabe turns', choices: ['clockwise, stars rising on the left', 'anticlockwise, stars rising on the left', 'clockwise, stars rising on the right', 'it does not turn; the plate does'], a: 0, why: 'The astrolabe is the view from outside the sphere with the zenith at the top, east on the left; the sky turns clockwise about the pole, so stars come up on the left, cross the meridian at the top and set on the right.' },
    { q: 'Why can the astrolabe be made with a compass and a straightedge only?', choices: ['because it is a small instrument', 'because the stereographic projection sends every circle of the sphere to a circle (or a line)', 'because the stars are close together', 'because the ancients had no tables'], a: 1, why: 'The horizon, the altitude circles, the tropics and the ecliptic are all circles on the sphere, and the stereographic projection maps circles to circles; the radii come from the inscribed-angle construction without any table.' }
  ],
  applications: [
    'Timekeeping and prayer times: the time by day from the Sun\'s altitude and by night from a star; the hours of prayer and the direction of Mecca were worked on astrolabes in medieval Islamic cities.',
    'Rising and setting, the length of the day and the ascendant (the point of the ecliptic on the horizon) for astrology and for the calendar.',
    'Surveying: the shadow square and the alidade on the back give heights and distances by similar triangles.',
    'Teaching spherical astronomy: the astrolabe shows the celestial sphere, the ecliptic and the horizon moving past one another, and solves the astronomical triangle without trigonometry.',
    'The same projection survives in crystallography: the stereographic net (Wulff net) used to plot the directions of crystal faces is the astrolabe\'s plate with the angles drawn on it ([[crystallography-stereographic]]).'
  ],
  history: 'The mathematics is Greek: Hipparchus is credited with the stereographic projection and Ptolemy wrote it up in his Planisphaerium; the instrument is described by Theon of Alexandria in the fourth century and by John Philoponus in the sixth. It reached its full form in the Islamic world: Muhammad al-Fazari is named as the first maker in the eighth century, the oldest surviving dated astrolabe was made in 927–8, and the treatises of al-Sufi in the tenth century and of al-Biruni in the eleventh set out its uses at great length. In Toledo al-Zarqali devised the universal plate in the eleventh century. The astrolabe reached Latin Europe through Spain; Chaucer wrote the first English treatise on it, for his ten-year-old son, in about 1391. It gave way to the telescope-based instruments of the seventeenth century, but the planisphere and the stereographic net are its descendants.',
  sources: ['James E. Morrison, *The Astrolabe* (Janus, 2007).', 'Robert T. Gunther, *The Astrolabes of the World* (Oxford, 1932).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998), chapter on the stereographic projection and the astrolabe.', 'Geoffrey Chaucer, *A Treatise on the Astrolabe* (c. 1391).'],
  sim: 'sm-astrolabe-rete',
  construction: 'sm-astrolabe-rete'
},

{
  id: 'polar-star-charts',
  parent: 'sky-maps-and-instruments',
  title: 'Polar star charts',
  level: 2,
  short: 'A polar chart centres the sky on the celestial pole: declination circles become concentric circles and right ascension becomes the angle at the centre. Only the rule for the radius is a choice: equally spaced (equidistant), stereographic or equal-area. Polaris sits in the middle and the circumpolar stars circle it.',
  keywords: ['polar chart', 'circumpolar', 'Polaris', 'north polar chart', 'azimuthal equidistant', 'Lambert azimuthal', 'star atlas', 'declination circles', 'polar distance'],
  prereq: ['equatorial-coordinates', 'azimuthal-projections', 'celestial-sphere'],
  related: ['the-planisphere', 'all-sky-charts', 'stereographic-projection', 'azimuthal-equidistant-projection', 'lambert-azimuthal-equal-area', 'rising-setting-and-circumpolar', 'modern-star-atlases'],
  body: `### Centre the sky on the pole
The celestial pole is the one point of the sky that stays put: the stars circle it once a day. A chart centred on it has the simplest geometry of any map of the sphere. The circles of declination are concentric circles, the lines of right ascension are straight spokes, and the angle between two spokes is the difference in right ascension, **15° to the hour**. The only decision is how the radius $r$ grows with the polar distance $p = 90° - \\delta$:
- **equidistant**, $r = k\\,p$: equal steps of declination are equal steps on the chart;
- **stereographic**, $r = R\\tan\\frac{p}{2}$: angles true, circles stay circles, as on the [[the-planisphere|planisphere]];
- **equal-area** (Lambert), $r = 2R\\sin\\frac{p}{2}$: equal patches of sky have equal areas on the chart;
- **gnomonic**, $r = R\\tan p$: great circles are straight, but only out to about 60° from the pole.
At polar distances 30°, 60°, 90° and 120°, measured against the radius at 90° (the equator), the first three give 0.33, 0.67, 1, 1.33 (equidistant); 0.27, 0.58, 1, 1.73 (stereographic); 0.37, 0.71, 1, 1.22 (equal-area). The stereographic chart spreads the outer zones, the equal-area one packs them, and the equidistant lies between.

### Circumpolar stars
A star never sets if its polar distance is less than the latitude, $p < \\varphi$, or $\\delta > 90° - \\varphi$; its lowest altitude is $\\delta + \\varphi - 90°$. In Tel Aviv (32° N) the circle of declination +58° marks the limit: the Plough\'s Dubhe (+61.7°) grazes the northern horizon 4° up at its lowest, and most of Cassiopeia, Cepheus and Ursa Minor never set. Polaris, 0.7° from the pole, stands at an altitude that is the latitude to within a degree. The two stars at the end of the Plough\'s bowl, Merak and Dubhe, point to it: continue the line from Merak through Dubhe five times the gap between them.

### Reading it
A chart is a view of the sky from inside the sphere, so seen looking up at the northern pole the stars go anticlockwise, and right ascension runs **clockwise** (as on the planisphere): the chart is the northern sky seen with north at the top. The constellation lines are parts of circles round the pole as the night passes, so exposing a camera for hours gives star trails that are the concentric circles of this chart. A southern chart is the same with the south pole in the middle.

### Drawing it by hand
With a scale of 1.5 units to the degree the chart out to −30° has radius 180. Step the dividers, set to 22.5 (15° of declination), eight times up a vertical line to get the radii, draw the circles with the compass, draw the spokes every 30° with the protractor, and plot the stars from a table of $(\\alpha, \\delta)$ as $(r = 1.5\\,p,\\ \\text{angle} = 15°\\alpha)$ in hours. The construction does this for the Plough, Cassiopeia and the brightest stars, and the table in its note is what you need.

> [!note] Scale the three charts to agree at the pole, $r\\approx K p$: within 20° of the pole they differ by about 1 %, and the choice hardly matters. At the equator (polar distance 90°) the stereographic radius is 27 % larger than the equidistant one and the equal-area radius 10 % smaller; at 120° the stereographic is 1.65 times the equidistant and the equal-area 0.83.`,
  ideas: [
    'On a polar chart the declination circles are concentric and right ascension is the angle at the centre, 15° to the hour; the only choice is the rule r(p) of the radius against polar distance.',
    'Equidistant: r = kp, equal steps. Stereographic: r = R tan(p/2), angles true. Lambert equal-area: r = 2R sin(p/2), areas true. Gnomonic: r = R tan p, only to about 60°.',
    'A star is circumpolar if its polar distance is less than the latitude: δ > 90° − φ; its lowest altitude is δ + φ − 90°.',
    'Polaris is about 0.7° from the pole, so its altitude gives the latitude to within a degree; the two pointers of the Plough lead to it.'
  ],
  pitfalls: [
    'All polar charts have equally spaced declination circles — Only the equidistant one does. On a stereographic chart the circles get farther apart towards the edge; on an equal-area chart closer.',
    'Polaris is at the pole — It is 0.7° away and circles it daily in a circle of about 1.4° across. The actual pole is empty.',
    'The stars circle the pole clockwise — Seen from below, with north at the top, they go anticlockwise, and right ascension increases clockwise; seen from outside the sphere (a globe or an astrolabe) it is the other way round.'
  ],
  formulas: [
    {
      name: 'Radius on the equidistant polar chart',
      expr: 'r = R0*(1 - 2*delta/pi)',
      tex: 'r = R_0\\,\\frac{90° - \\delta}{90°}',
      vars: {
        r: { name: 'distance from the pole', q: 'length', unit: 'mm' },
        R0: { name: 'radius of the equator circle (polar distance 90°)', q: 'length', unit: 'mm', value: 90, tex: 'R_0' },
        delta: { name: 'declination', q: 'angle', unit: '°', value: -30, signed: true, min: -89, max: 89 }
      },
      note: 'Equal steps of declination are equal steps of radius: with R0 = 90 mm each degree is 1 mm.'
    },
    {
      name: 'Radius on the equal-area polar chart',
      expr: 'r = 2*R*sin(pi/4 - delta/2)',
      tex: 'r = 2R\\sin\\Bigl(45° - \\frac{\\delta}{2}\\Bigr)',
      vars: {
        r: { name: 'distance from the pole', q: 'length', unit: 'mm' },
        R: { name: 'radius of the sphere on the chart', q: 'length', unit: 'mm', value: 50 },
        delta: { name: 'declination', q: 'angle', unit: '°', value: -30, signed: true, min: -89, max: 89 }
      },
      note: 'Lambert\'s azimuthal equal-area projection: the equator is at 1.414 R, and the whole sky out to the south pole fits in a circle of radius 2 R.'
    },
    {
      name: 'Radius on the stereographic polar chart',
      expr: 'r = R*tan(pi/4 - delta/2)',
      tex: 'r = R\\tan\\Bigl(45° - \\frac{\\delta}{2}\\Bigr)',
      vars: {
        r: { name: 'distance from the pole', q: 'length', unit: 'mm' },
        R: { name: 'radius of the equator circle', q: 'length', unit: 'mm', value: 50 },
        delta: { name: 'declination', q: 'angle', unit: '°', value: -30, signed: true, min: -85, max: 89 }
      },
      note: 'The chart of the planisphere. The south pole is at infinity.'
    },
    {
      name: 'Lowest altitude of a star',
      expr: 'hlow = delta + phi - pi/2',
      tex: 'h_{\\mathrm{low}} = \\delta + \\varphi - 90°',
      vars: {
        hlow: { name: 'altitude at lower culmination', q: 'angle', unit: '°', signed: true, tex: 'h_{\\mathrm{low}}' },
        delta: { name: 'declination of the star', q: 'angle', unit: '°', value: 61.75, signed: true, min: -90, max: 90 },
        phi: { name: 'latitude of the observer', q: 'angle', unit: '°', value: 32.1, min: 0, max: 90, tex: '\\varphi' }
      },
      note: 'Positive means the star never sets (circumpolar); negative, it dips below the horizon. 61.75° is Dubhe; the result for Tel Aviv, +3.9°, is just above the horizon.'
    }
  ],
  examples: [
    {
      title: 'Plotting Dubhe',
      q: 'Dubhe has right ascension 11.06 h and declination +61.75°. On an equidistant polar chart with 2 mm to the degree, where is it? Is it circumpolar in Tel Aviv (32.1° N)?',
      steps: [
        { text: 'Polar distance and radius:', tex: 'p = 90° - 61.75° = 28.25°, \\qquad r = 2 \\times 28.25 = 56.5\\ \\text{mm}' },
        { text: 'Direction: 15° to the hour, clockwise from the 0 h line:', tex: '11.06 \\times 15° = 165.9°' },
        { text: 'Circumpolar if $p < \\varphi$:', tex: '28.25° < 32.1°\\ \\text{(yes)}, \\qquad h_{\\mathrm{low}} = 61.75° + 32.1° - 90° = +3.9°' }
      ],
      a: 'Dubhe lies 56.5 mm from the pole at 166° clockwise from the 0 h line, just below the 12 h line. It never sets in Tel Aviv, but at lower culmination it clears the northern horizon by only 3.9°.'
    },
    {
      title: 'Three charts compared',
      q: 'Three polar charts are made with the equator at 50 mm from the pole: equidistant, stereographic and equal-area. How far from the pole is the circle of declination −30° on each?',
      steps: [
        { text: 'Equidistant, $r = R_0\\,p/90°$ with $p = 120°$:', tex: '50 \\times \\frac{120}{90} = 66.7\\ \\text{mm}' },
        { text: 'Stereographic, $r = R\\tan 60°$ with $R = 50$:', tex: '50 \\times 1.732 = 86.6\\ \\text{mm}' },
        { text: 'Equal-area: the equator is at $2R\\sin 45°$, so $R = 35.36$, and', tex: 'r = 2 \\times 35.36 \\times \\sin 60° = 61.2\\ \\text{mm}' }
      ],
      a: 'Equidistant 66.7 mm, stereographic 86.6 mm, equal-area 61.2 mm: the same circle at three distances from the pole.'
    }
  ],
  quiz: [
    { q: 'On every polar star chart, the lines of right ascension are', choices: ['straight spokes from the pole, 15° apart for each hour', 'circles round the pole', 'curves bowed away from the pole', 'parallel lines'], a: 0, why: 'The pole is the centre of the chart and right ascension is the angle round it: straight radii, one hour of right ascension for each 15°.' },
    { q: 'On an equidistant polar chart the equator circle has radius 90 mm. The declination circle −30° has radius, in millimetres,', answer: 120, why: 'r = 90 × (90° + 30°)/90° = 120 mm.' },
    { q: 'On every polar chart the circles of declination are equally spaced.', a: false, why: 'Only the equidistant chart has equal steps. The stereographic chart spreads the outer circles, the equal-area chart packs them.' },
    { q: 'Which polar projection gives equal areas to equal patches of sky?', choices: ['equidistant', 'stereographic', 'Lambert azimuthal equal-area', 'gnomonic'], a: 2, why: 'Lambert\'s azimuthal equal-area projection, r = 2R sin(p/2), keeps areas; the stereographic keeps angles; the gnomonic keeps great circles straight.' },
    { q: 'At latitude 45° N a star of declination +50° is circumpolar.', a: true, why: 'It is circumpolar if δ > 90° − φ = 45°. Its lowest altitude is 50° + 45° − 90° = 5° above the horizon.' }
  ],
  applications: [
    'Star atlases: the northern and southern cap charts, often equal-area or equidistant, show the circumpolar stars without the distortion a flat rectangular chart gives near the pole.',
    'Polar alignment of telescope mounts: the finder reticle shows Polaris\'s small circle round the true pole so that the axis can be set on it.',
    'Star-trail photography: a long exposure aimed at the pole writes the concentric circles of this chart on the sensor.',
    'Navigation and survival: Polaris gives the north direction and, by its altitude, the latitude; the pointer line finds it.',
    'The same projections, applied to the Earth, are the polar maps of the Arctic and the Antarctic, the sea-ice and weather charts ([[weather-maps]]).'
  ],
  history: 'Johannes Bayer\'s *Uranometria* of 1603 closed its constellation charts with two polar planispheres, and the atlases of Hevelius (1690) and Flamsteed (1729) had planispheres of the two hemispheres. Albrecht Dürer\'s printed charts of 1515, the first printed star charts of both hemispheres, were each centred on a pole of the ecliptic. The three polar projections are older than the atlases: the stereographic is credited to Hipparchus, the equidistant to al-Biruni about the year 1000 (it served for centuries for maps centred on one city), and the equal-area version is Lambert\'s, of 1772.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the azimuthal projections.', 'Wil Tirion and Roger W. Sinnott, *Sky Atlas 2000.0*, and Ian Ridpath (ed.), *Norton\'s Star Atlas*, for the polar charts of printed atlases.', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 12 and 13.', 'Johannes Bayer, *Uranometria* (Augsburg, 1603).'],
  construction: 'sm-polar-star-chart'
},

{
  id: 'all-sky-charts',
  parent: 'sky-maps-and-instruments',
  title: 'All-sky charts of the whole sphere',
  level: 3,
  short: 'To put the whole celestial sphere on one sheet astronomers use an equal-area oval map — Hammer\'s ellipse or Mollweide\'s — in equatorial or galactic coordinates: the Milky Way runs along the middle, and a count of stars or galaxies per square centimetre of the map is a count per square degree of the sky.',
  keywords: ['Hammer', 'Aitoff', 'Mollweide', 'equal-area', 'all-sky map', 'galactic coordinates', 'cosmic microwave background', 'Milky Way', 'sky survey', 'HEALPix'],
  prereq: ['aitoff-and-hammer', 'mollweide-projection', 'ecliptic-and-galactic-coordinates', 'equatorial-coordinates'],
  related: ['polar-star-charts', 'the-all-sky-view', 'goode-homolosine', 'lambert-azimuthal-equal-area', 'astronomy-and-planetary-maps', 'modern-star-atlases'],
  body: `### The whole sphere at once
A rectangular map with right ascension across and declination up draws the pole as a line the full width of the sheet and stretches everything near it. A sky survey wants more than looks: it wants to compare the number of galaxies per square degree in one region with another, or the temperature of the microwave background across the sky. That calls for an **equal-area** map, and the oval maps of the [[aitoff-and-hammer|Hammer]] and [[mollweide-projection|Mollweide]] are what the astronomers chose. With longitude $\\lambda$ and latitude $\\varphi$ on a sphere of radius $R$, Hammer\'s map is
$$x = \\frac{2\\sqrt2\\,R\\cos\\varphi\\,\\sin(\\lambda/2)}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}, \\qquad y = \\frac{\\sqrt2\\,R\\sin\\varphi}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}},$$
which is Lambert\'s [[lambert-azimuthal-equal-area|azimuthal equal-area]] map of one hemisphere with the longitudes doubled and the width stretched to match: the boundary is an ellipse twice as wide as it is high, the equator and the central meridian are straight and every other meridian and parallel is curved. Mollweide\'s map keeps the parallels straight, $x = \\frac{2\\sqrt2}{\\pi}R\\lambda\\cos\\theta$, $y = \\sqrt2\\,R\\sin\\theta$, with an auxiliary angle $\\theta$ solving $2\\theta + \\sin 2\\theta = \\pi\\sin\\varphi$ (by iteration, or from a table).

### What they keep and what they lose
Areas are kept exactly: the fraction of the whole sky between two declinations is $(\\sin\\delta_2 - \\sin\\delta_1)/2$ and the same fraction of the area of the oval. Shapes are good in the middle and ruined at the rim. At the centre a circle of sky is a circle; on the equator 120° from the centre it is already an ellipse whose directions are turned by 16°, and near the rim at 60° latitude by 86°. Hammer\'s oval spreads the distortion over the map more evenly than Mollweide\'s, which squeezes the outer parts into thin slivers, and Aitoff\'s older oval, a stretched azimuthal equidistant, is not equal-area.

### Which coordinates, which centre
The grid is the one the data lives in. Maps of the Milky Way are drawn in **galactic coordinates**, $l$ along the equator and $b$ up, centred on the Galactic centre ($l = 0$) with longitude increasing to the **left**, as on the sky itself seen from inside; the Milky Way\'s plane is the middle line. Maps of the stars as seen from the Earth use **right ascension**, centred on 12 h (0 h and 24 h at the edges), also increasing to the left; maps of the solar system use ecliptic coordinates, in which the planets lie along the middle.

### Drawing it by hand
The edge is an ellipse, drawn by the **auxiliary-circle method** (two circles of radii $2\\sqrt2 u$ and $\\sqrt2 u$; the point is where the vertical from the large circle meets the horizontal from the small one). The graticule is drawn from the table of the formula above, point by point: the equator and the central meridian are graduated, and the curved parallels and meridians pass through computed points. The construction does it in galactic coordinates and plots nine landmarks.

> [!tip] Equal-area can be checked with a ruler and a pencil: cut the oval along any two parallels and weigh the paper. The fraction of the weight is the fraction of the sky, $(\\sin\\delta_2 - \\sin\\delta_1)/2$ (this is how you would test that a printed map really is equal-area).`,
  ideas: [
    'Equal-area oval maps put the whole sphere on one sheet without exaggerating any region: the area of a patch of the map is proportional to the solid angle of the sky.',
    'Hammer: Lambert\'s azimuthal equal-area map of a hemisphere with the longitudes doubled; the boundary is a 2:1 ellipse, the equator and central meridian are straight, all other lines curve.',
    'Mollweide: straight parallels, x = (2√2/π) R λ cos θ, y = √2 R sin θ, with 2θ + sin 2θ = π sin φ.',
    'Maps of the Milky Way are drawn in galactic coordinates centred on the Galactic centre, longitude increasing to the left; the plane of the Galaxy is the horizontal middle line.'
  ],
  pitfalls: [
    'Equal-area means shapes are right — Only areas are. Away from the centre every circle of the sky becomes an ellipse, and at the rim of a Hammer or Mollweide map the shapes are heavily sheared.',
    'The map is a picture of the sphere seen from outside — Sky maps are the inside view: right ascension and galactic longitude run to the LEFT, as on the sky. A map of the Earth in the same projection would have longitude to the right.',
    'Hammer and Aitoff are the same — Aitoff stretches the azimuthal equidistant map, Hammer the equal-area one. They look alike, but Aitoff\'s areas are off by up to 57 % and Hammer\'s are exact.'
  ],
  formulas: [
    {
      name: 'Hammer projection: x',
      expr: 'x = 2*sqrt(2)*R*cos(phi)*sin(lam/2)/sqrt(1 + cos(phi)*cos(lam/2))',
      tex: 'x = \\frac{2\\sqrt2\\,R\\cos\\varphi\\,\\sin(\\lambda/2)}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}',
      vars: {
        x: { name: 'distance from the central meridian', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the sphere on the sheet', q: 'length', unit: 'mm', value: 50 },
        phi: { name: 'latitude (galactic b, or declination)', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\varphi' },
        lam: { name: 'longitude from the centre', q: 'angle', unit: '°', value: 60, signed: true, min: -179, max: 179, tex: '\\lambda' }
      },
      note: 'At λ = ±180°, the edge of the map, the formulas give x = ±2√2 R cos φ and y = √2 R sin φ: an ellipse with semi-axes 2√2 R and √2 R. For the sky, draw longitude increasing to the left.'
    },
    {
      name: 'Hammer projection: y',
      expr: 'y = sqrt(2)*R*sin(phi)/sqrt(1 + cos(phi)*cos(lam/2))',
      tex: 'y = \\frac{\\sqrt2\\,R\\sin\\varphi}{\\sqrt{1 + \\cos\\varphi\\cos(\\lambda/2)}}',
      vars: {
        y: { name: 'distance from the equator', q: 'length', unit: 'mm', signed: true },
        R: { name: 'radius of the sphere on the sheet', q: 'length', unit: 'mm', value: 50 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\varphi' },
        lam: { name: 'longitude from the centre', q: 'angle', unit: '°', value: 60, signed: true, min: -179, max: 179, tex: '\\lambda' }
      },
      note: 'On the central meridian (λ = 0) this is y = √2 R sin φ / √(1 + cos φ), so the pole is at √2 R: half the height of the ellipse.'
    },
    {
      name: 'Mollweide\'s auxiliary angle',
      expr: '2*theta + sin(2*theta) = pi*sin(phi)',
      tex: '2\\theta + \\sin 2\\theta = \\pi\\sin\\varphi',
      vars: {
        theta: { name: 'auxiliary angle', q: 'angle', unit: '°', value: 30, signed: true, min: -90, max: 90, tex: '\\theta' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 41.8, signed: true, min: -90, max: 90, tex: '\\varphi' }
      },
      solveFor: 'theta',
      note: 'Solve for θ given φ (Newton\'s method on a computer, a table by hand); then x = (2√2/π) R λ cos θ and y = √2 R sin θ. θ = 30° belongs to φ = 41.8°; θ = 90° to φ = 90°.'
    },
    {
      name: 'Fraction of the sky between two declinations',
      expr: 'f = (sin(d2) - sin(d1))/2',
      tex: 'f = \\frac{\\sin\\delta_2 - \\sin\\delta_1}{2}',
      vars: {
        f: { name: 'fraction of the whole sky' },
        d1: { name: 'lower declination', q: 'angle', unit: '°', value: -40, signed: true, min: -90, max: 90, tex: '\\delta_1' },
        d2: { name: 'upper declination', q: 'angle', unit: '°', value: 90, signed: true, min: -90, max: 90, tex: '\\delta_2' }
      },
      note: 'Archimedes\'s rule: area of a zone of a sphere is proportional to the height it covers, 2πR (sin δ₂ − sin δ₁). On an equal-area map the same fraction of the oval lies between the two parallels.'
    }
  ],
  examples: [
    {
      title: 'A point on the Hammer map',
      q: 'On a Hammer map with R = 50 mm, galactic longitude increasing to the left, where is the point l = 60°, b = +30°?',
      steps: [
        { text: 'Put λ = 60° (so λ/2 = 30°) and φ = 30°. The denominator is', tex: '\\sqrt{1 + \\cos 30°\\cos 30°} = \\sqrt{1.75} = 1.3229' },
        { text: 'Across:', tex: 'x = \\frac{2\\sqrt2 \\times 50 \\times 0.8660 \\times 0.5}{1.3229} = 46.3\\ \\text{mm}' },
        { text: 'Up:', tex: 'y = \\frac{\\sqrt2 \\times 50 \\times 0.5}{1.3229} = 26.7\\ \\text{mm}' }
      ],
      a: '46.3 mm to the left of the centre (longitude increases to the left) and 26.7 mm above the equator.'
    },
    {
      title: 'How much of the sky does a planisphere wheel chart?',
      q: 'The star wheel of the planisphere reaches declination −40°. What fraction of the whole sky does it cover?',
      steps: [
        { text: 'The zone from −40° to the north pole:', tex: 'f = \\frac{\\sin 90° - \\sin(-40°)}{2} = \\frac{1 + 0.643}{2} = 0.821' },
        'That is 82 % of the sphere, or 33 900 of its 41 253 square degrees; the rest, the zone south of −40°, never rises at 51.5° N.'
      ],
      a: 'About 82 % of the sky: on an equal-area chart the wheel would fill 82 % of the oval.'
    }
  ],
  quiz: [
    { q: 'Why do sky surveys plot their results on an equal-area map?', choices: ['so that straight lines are great circles', 'so that counts per square degree can be compared by eye', 'because the map has no distortion at all', 'because it has the smallest rim'], a: 1, why: 'On an equal-area map the area of a patch is proportional to its solid angle, so a density of stars or galaxies, or a mean temperature, can be compared across the map without a correction for the stretching.' },
    { q: 'On a Hammer map, the parallels of latitude are straight lines.', a: false, why: 'They are straight on the Mollweide map, not on Hammer\'s; on Hammer\'s only the equator is straight, and the other parallels curve.' },
    { q: 'The boundary of a Hammer map is an ellipse. The ratio of its width to its height is', answer: 2, why: 'The semi-axes are 2√2 R and √2 R: a 2:1 ellipse.' },
    { q: 'In a galactic all-sky map centred on the Galactic centre, the plane of the Milky Way follows', choices: ['the central meridian', 'the horizontal middle line (b = 0)', 'the rim of the ellipse', 'a diagonal across the map'], a: 1, why: 'Galactic latitude b is measured from the plane of the Galaxy, so b = 0 is the equator of the map, the straight horizontal middle line.' },
    { q: 'What fraction of the sphere lies between declinations −30° and +30°?', answer: 0.5, why: '(sin 30° − sin(−30°))/2 = (0.5 + 0.5)/2 = 0.5: half the sky lies within 30° of the equator.' }
  ],
  applications: [
    'Cosmic microwave background maps from the space missions are displayed in Mollweide\'s projection in galactic coordinates, with the plane of the Milky Way across the middle.',
    'Sky surveys and catalogues: the star-density maps of Gaia and the number counts of galaxies in the large surveys are drawn on equal-area ovals so the density can be read directly.',
    'HEALPix, the standard pixelisation of the sphere into equal-area cells, is displayed in the Mollweide projection.',
    'High-energy astronomy: gamma-ray burst, cosmic-ray and neutrino arrival directions are plotted on Hammer or Aitoff maps in galactic or equatorial coordinates.',
    'Planetary science: global maps of other worlds, and the spread of the stars seen by a spacecraft, in the same equal-area ovals.'
  ],
  history: 'David Aitoff published his oval in 1889, the stretched azimuthal equidistant projection, and Ernst Hammer in 1892 made the same trick with Lambert\'s equal-area map of 1772, giving the projection that bears his name; Karl Mollweide\'s equal-area ellipse is older, of 1805. The astronomers took them over when photographic sky surveys needed a whole-sky map: the Aitoff and Hammer ovals became the maps of the Milky Way, and the galactic coordinates they are drawn in were fixed by the International Astronomical Union in 1958. Today the pictures of the microwave background and of the Gaia stars are made in the same ovals.',
  sources: ['John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the chapters on Hammer, Aitoff and Mollweide.', 'A. Blaauw et al., "The new I.A.U. system of galactic coordinates (1958 revision)", *Monthly Notices of the Royal Astronomical Society* 121 (1960).', 'Krzysztof M. Górski et al., "HEALPix: a framework for high-resolution discretization and fast analysis of data distributed on the sphere", *The Astrophysical Journal* 622 (2005).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 13 on the transformation of coordinates.'],
  construction: 'sm-hammer-grid'
},

{
  id: 'sun-path-diagrams',
  parent: 'sky-maps-and-instruments',
  title: 'Sun-path diagrams',
  level: 2,
  short: 'The Sun\'s daily road drawn on a map of the sky: altitude and azimuth at every hour for the solstices, the equinoxes and each month, with the zenith at the centre and the horizon as the rim. On the stereographic diagram every road is a circular arc, which the architect reads to see when the Sun reaches a window and what will shade it.',
  keywords: ['sun path', 'sun chart', 'stereographic', 'solstice', 'solar access', 'shading', 'altitude azimuth', 'passive solar', 'hour lines', 'day length'],
  prereq: ['the-suns-path', 'horizon-coordinates', 'stereographic-projection'],
  related: ['the-analemma', 'sundials-as-projections', 'the-all-sky-view', 'looking-at-the-horizon', 'architectural-drawings'],
  body: `### The Sun on a map of the sky
The Sun\'s position at any moment follows from three numbers, the latitude $\\varphi$, its declination $\\delta$ on that date and the hour angle $H$ (15° to the hour from solar noon):
$$\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H.$$
Over one day $\\delta$ changes by less than half a degree, so the Sun runs round a **parallel of declination**: a small circle of the sky, at 15° an hour. Plot that circle on a map of the sky, with the zenith at the centre and the horizon as the rim, and you have the Sun\'s road for the day. Do it for the two solstices and the equinoxes and the roads of every other day lie between the two extreme ones; the hours are curves that cross the roads.

### Why the stereographic plan
In the **stereographic** diagram, radius $r = R\\tan\\frac{90° - h}{2}$ from the zenith, a small circle of the sphere is an exact circle on the sheet, so every road is a circular arc that a compass draws, and altitude circles are circles too; angles are true. For a Sun of declination $\\delta$ at latitude $\\varphi$ the arc has radius and centre (on the meridian, towards the north)
$$\\rho = \\frac{R\\cos\\delta}{\\sin\\varphi + \\sin\\delta}, \\qquad c = \\frac{R\\cos\\varphi}{\\sin\\varphi + \\sin\\delta}.$$
At 51.5° N these are 117, 192 and 358 for $R = 150$ on 21 June, at the equinoxes and on 21 December: the winter arc is nearly flat. In the **equidistant** diagram, altitude is proportional to the radius and the roads are not circles; in the **cylindrical** diagram azimuth runs across and altitude up, which is the chart of a skyline of buildings and trees. All three are drawn in [the sun-path diagram](#/tools/skylab/sunpath) of the sky lab.

### Reading the diagram
It is a plan, seen from above, so north is at the top and **east on the right**; the all-sky camera\'s picture, seen from below, has east on the left. The Sun rises where its road meets the rim: due east at the equinox, at azimuth $A$ with $\\cos A = \\sin\\delta/\\cos\\varphi$ otherwise. Noon is on the meridian, at altitude $90° - \\varphi + \\delta$. The length of the day follows from the same triangle: $\\cos H_0 = -\\tan\\varphi\\tan\\delta$, with the day $2H_0/15°$ hours. The dashed **hour lines** join the same solar hour through the year. With clock hours instead of solar hours they become the figure of eight of the [[the-analemma|analemma]].

### What the architect does with it
Plot the skyline, the trees and the overhang as a profile on the same diagram: any part of a road that falls behind the profile is in shade. A window with an overhang that cuts the sky above altitude 60° in the south lets the winter Sun in and keeps the summer Sun out, and the diagram shows by how many weeks. The **hemispherical photograph** of the [[the-all-sky-view|all-sky view]] with the roads laid over it does the same for a real site.

### Drawing it by hand
The construction draws the diagram for 51.5° N: the altitude rings from a tangent table, the azimuth lines with the protractor, the Sun\'s altitude and azimuth at five hours of each of three days from a table, the equinox arc from three points with the compass (the centre is found on the meridian with the perpendicular bisector) and the other two arcs from their computed centres; the 357-unit winter radius is beyond a compass, so that arc is drawn through its points.`,
  ideas: [
    'The Sun\'s day is a parallel of declination: a small circle of the sky, run at 15° an hour; the sun-path diagram draws that circle for the solstices, the equinoxes and the months.',
    'On the stereographic diagram, r = R tan((90° − h)/2), every road is an exact circular arc of radius R cos δ/(sin φ + sin δ), centred on the meridian.',
    'Sunrise is at azimuth A with cos A = sin δ/cos φ; noon altitude is 90° − φ + δ; the day lasts 2H₀/15 hours with cos H₀ = −tan φ tan δ.',
    'It is a plan, with east on the right; plot the skyline on it and the shaded parts of each road show when a site is in shade.'
  ],
  pitfalls: [
    'The Sun rises in the east and sets in the west every day — Only at the equinoxes. In summer at 51.5° N it rises north of east (50°) and sets north of west; in winter, south of both, at 130°.',
    'The hour curves on the diagram are the same as the clock hours — They are solar hours. A clock hour differs by the equation of time and, when summer time is in force, by an hour; the clock-hour curves are the analemma-shaped figures.',
    'The roads of the diagram are straight in a rectangular plot of altitude against azimuth — In the cylindrical diagram they are sine-like curves; in the stereographic plan, circles; they are never straight lines except at the equator.'
  ],
  formulas: [
    {
      name: 'Altitude of the Sun',
      expr: 'sin(h) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(H)',
      tex: '\\sin h = \\sin\\varphi\\sin\\delta + \\cos\\varphi\\cos\\delta\\cos H',
      vars: {
        h: { name: 'altitude of the Sun', q: 'angle', unit: '°', signed: true, min: -90, max: 90 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, signed: true, min: -90, max: 90, tex: '\\varphi' },
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5 },
        H: { name: 'hour angle (15° per hour from solar noon)', q: 'angle', unit: '°', value: 45, signed: true, min: -180, max: 180 }
      },
      solveFor: 'h',
      note: 'At 51.5° N on 21 June at 9:00 solar time (H = −45°) the Sun stands at 45.6°; at noon it is 61.9°.'
    },
    {
      name: 'Azimuth of sunrise',
      expr: 'cos(A) = sin(delta)/cos(phi)',
      tex: '\\cos A = \\frac{\\sin\\delta}{\\cos\\varphi}',
      vars: {
        A: { name: 'azimuth of sunrise, from north through east', q: 'angle', unit: '°', min: 0, max: 180 },
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, min: 0, max: 66, tex: '\\varphi' }
      },
      solveFor: 'A',
      note: 'For the geometric horizon, without refraction. Sunset is at 360° − A. At the equinox sin δ = 0 and A = 90°.'
    },
    {
      name: 'Length of the day',
      expr: 'D = (24/pi)*acos(-tan(phi)*tan(delta))',
      tex: 'D = \\frac{24}{\\pi}\\arccos\\left(-\\tan\\varphi\\tan\\delta\\right)',
      vars: {
        D: { name: 'time from sunrise to sunset', q: false, unit: 'h' },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, signed: true, min: -66, max: 66, tex: '\\varphi' },
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5 }
      },
      solveFor: 'D',
      note: 'The Sun\'s centre on a flat geometric horizon. Refraction and the Sun\'s radius add 6–10 minutes at mid latitudes. Beyond 66.6° the arccosine has no value: the Sun does not set (summer) or rise (winter).'
    },
    {
      name: 'Radius of the Sun\'s road on the stereographic diagram',
      expr: 'rho = R*cos(delta)/(sin(phi) + sin(delta))',
      tex: '\\rho = \\frac{R\\cos\\delta}{\\sin\\varphi + \\sin\\delta}',
      vars: {
        rho: { name: 'radius of the road', q: 'length', unit: 'mm' },
        R: { name: 'radius of the horizon circle', q: 'length', unit: 'mm', value: 150 },
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 0, signed: true, min: -23.5, max: 23.5 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 51.5, min: 25, max: 89, tex: '\\varphi' }
      },
      note: 'The centre of the arc is R cos φ / (sin φ + sin δ) from the zenith, towards the north. For the equinox at 51.5° N: radius 1.28 R, centre 0.80 R.'
    }
  ],
  examples: [
    {
      title: 'Midsummer at 51.5° N',
      q: 'For London (51.5° N) on 21 June (declination +23.44°) find the noon altitude, the azimuth of sunrise and the length of the day.',
      steps: [
        { text: 'Noon altitude:', tex: 'h = 90° - 51.5° + 23.44° = 61.9°' },
        { text: 'Sunrise azimuth:', tex: '\\cos A = \\frac{\\sin 23.44°}{\\cos 51.5°} = \\frac{0.3978}{0.6225} = 0.639, \\qquad A = 50.3°' },
        { text: 'Day length:', tex: 'D = \\frac{24}{\\pi}\\arccos(-\\tan 51.5°\\tan 23.44°) = \\frac{24}{\\pi}\\arccos(-0.545) = 16.4\\ \\text{h}' }
      ],
      a: 'Noon altitude 61.9°, sunrise 50° east of north (and sunset 50° west of north), 16.4 hours of daylight on the geometric horizon (about 16.6 h with refraction).'
    },
    {
      title: 'The three arcs for a drawing',
      q: 'For a sun-path diagram of 51.5° N with a horizon circle of radius 150, find the radius and the centre of the roads for 21 June, the equinox and 21 December.',
      steps: [
        { text: 'Use $\\rho = \\frac{R\\cos\\delta}{\\sin\\varphi + \\sin\\delta}$ and $c = \\frac{R\\cos\\varphi}{\\sin\\varphi + \\sin\\delta}$ with $\\sin 51.5° = 0.7826$:', tex: '\\text{June: } \\rho = \\frac{150 \\times 0.9175}{0.7826 + 0.3978} = 116.6, \\ c = \\frac{150 \\times 0.6225}{1.1804} = 79.1' },
        { text: '', tex: '\\text{equinox: } \\rho = \\frac{150}{0.7826} = 191.7, \\ c = 119.3; \\qquad \\text{December: } \\rho = \\frac{150 \\times 0.9175}{0.7826 - 0.3978} = 357.6, \\ c = 242.7' }
      ],
      a: 'June: radius 117, centre 79 north of the zenith. Equinox: 192 and 119. December: 358 and 243: so large that the arc is drawn through its points rather than with a compass.'
    }
  ],
  quiz: [
    { q: 'On the stereographic sun-path diagram, the Sun\'s road on any one day is', choices: ['a straight line', 'a circular arc', 'a parabola', 'an ellipse, never a circle'], a: 1, why: 'The Sun runs round a small circle of the sky (a parallel of declination) and the stereographic projection sends every circle of the sphere to a circle.' },
    { q: 'At the equinoxes the Sun rises due east at every latitude (except at the poles).', a: true, why: 'cos A = sin δ / cos φ and δ = 0 give cos A = 0, A = 90°.' },
    { q: 'The length of the day at latitude 60° N on 21 June, from cos H₀ = −tan φ tan δ, is, in hours (to the nearest half hour),', answer: 18.5, why: 'cos H₀ = −tan 60° tan 23.44° = −0.751, H₀ = 138.7°, D = 2 × 138.7°/15° = 18.5 h.' },
    { q: 'In a plan-view sun-path diagram, with north at the top, east is on', choices: ['the left, as in an all-sky photograph', 'the right, as on a map', 'either, depending on the season', 'neither: azimuth is not shown'], a: 1, why: 'A plan is seen from above, as a map is: east on the right. A photograph taken looking up has east on the left.' },
    { q: 'What is the Sun\'s noon altitude in Tel Aviv (32° N) on 21 December?', answer: 34.6, unit: '°', why: '90° − 32° − 23.44° = 34.56°.' }
  ],
  applications: [
    'Building design: shading devices, overhangs and the size of south windows are tested against the roads of the winter and summer Sun; the same diagram with the skyline profile gives the hours of direct sunlight on a facade.',
    'Photovoltaic siting: the shade of a chimney or a tree on a panel is read as the part of the roads behind its profile, and the lost energy is counted hour by hour.',
    'Urban planning and the right to light: the Sun\'s access to a courtyard or a garden at the solstices is the check of many building codes.',
    'Agriculture and greenhouses: row orientation and the spacing of glasshouses follow from the Sun\'s altitude at noon through the year.',
    'Photography and film: the planning of golden hour, of the direction of light on a location and of the time a street is in shade.'
  ],
  history: 'The idea of drawing the Sun\'s path on a chart of the sky goes with the sundial and the astrolabe; the modern architect\'s sun chart took shape in the twentieth century with the movement for daylighting and passive solar design. The heliodon, a model-table with a lamp that imitates the Sun\'s road, and the sun-angle calculator of the 1950s made it a routine tool; Victor and Aladar Olgyay\'s *Solar Control and Shading Devices* (1957) set out the projection systems and the shading charts, and since then computers have drawn the diagram from the sun position algorithms of Meeus and others, and laid it on photographs.',
  sources: ['Victor Olgyay and Aladar Olgyay, *Solar Control and Shading Devices* (Princeton, 1957).', 'John A. Duffie and William A. Beckman, *Solar Engineering of Thermal Processes* (4th ed., 2013), the chapter on solar radiation geometry.', 'Steven V. Szokolay, *Introduction to Architectural Science: The Basis of Sustainable Design* (3rd ed., 2014).', 'Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapters 25 and 13.'],
  sim: 'sm-sun-path-lab',
  construction: 'sm-sun-path-diagram'
},

{
  id: 'the-analemma',
  parent: 'sky-maps-and-instruments',
  title: 'The analemma',
  level: 2,
  short: 'Photograph the Sun at the same clock time every few days for a year and it traces a figure of eight, tall and thin: the declination sets its height, the equation of time its width. The analemma is a plot of the Sun\'s declination against the equation of time, and it is why a sundial and a clock agree only four days a year.',
  keywords: ['analemma', 'equation of time', 'declination', 'figure of eight', 'solar noon', 'mean sun', 'heliochronometer', 'obliquity', 'eccentricity', 'sundial correction'],
  prereq: ['the-suns-path', 'equatorial-coordinates', 'sidereal-time-and-hour-angle'],
  related: ['sundials-as-projections', 'sun-path-diagrams', 'armillary-sphere-and-celestial-globe', 'precession-and-the-moving-pole', 'looking-at-the-horizon'],
  body: `### One clock hour, a whole year of Sun
If the Sun were a clock, it would be at the same place in the sky at the same time every day. It is not: at 12:00 mean time it is higher in June than in December (the **declination** has changed by 47°), and it is some minutes to the east or west of south (the **equation of time**, the difference between sundial and clock time, which is as large as 16 minutes). Mark its place at the same clock time every few days through a year and the marks lie on a **figure of eight**, the analemma. It stands upright at noon, 47° tall and 7.6° wide, leans to one side in the morning and to the other in the afternoon, and is tilted and mirrored in the southern hemisphere.

### The two causes
The mean Sun, which the clocks keep, runs along the celestial equator at an even $15°$ an hour. The true Sun does not, for two reasons. The Earth\'s orbit is an ellipse (eccentricity 0.0167), so the Sun moves faster along the ecliptic in January than in July: this alone makes a wave of one cycle a year and amplitude 7.7 minutes. And the ecliptic is tilted at $\\varepsilon = 23.44°$ to the equator: even a Sun moving evenly along the ecliptic has an east–west motion, projected on the equator, that is slow at the solstices and fast at the equinoxes: a wave of two cycles a year and amplitude 9.9 minutes. Their sum is the equation of time. A good approximation (to half a minute), for the day of the year $N$, is
$$E \\approx 9.87\\sin 2B - 7.53\\cos B - 1.5\\sin B \\ \\text{minutes}, \\qquad B = \\frac{360°\\,(N - 81)}{365},$$
and the declination is close to $\\delta \\approx \\arcsin\\bigl(\\sin\\varepsilon\\,\\sin B\\bigr)$. The four extremes are $-14.2$ min about 11 February, $+3.6$ about 14 May, $-6.5$ about 26 July and $+16.4$ about 3 November; the sundial and the clock agree on about 15 April, 13 June, 1 September and 25 December.

### Reading the figure
Plot $\\delta$ up and $E$ across, with the sundial ahead of the clock (positive $E$) on the right when you face south, since the Sun has already passed the meridian: the curve is the figure of eight of the construction below. Its upper loop (summer, May to August) is small, because the two waves nearly cancel; its lower loop (autumn and winter) is large, because they add. A horizontal minute is a quarter of a degree of the Sun\'s motion, times $\\cos\\delta$ on the sky: 30.6 minutes between the extremes is $7.65°\\cos\\delta$, against the height of $2\\varepsilon = 46.9°$. For a given place and hour the figure is just the curve of $(\\mathrm{az}, \\mathrm{alt})$ in the sky; the noon altitude at latitude $\\varphi$ is $90° - \\varphi + \\delta$.

### Where it is used
Every solar calculation that uses clock time takes the equation of time: **solar noon** falls anywhere from about 11:44 to 12:14 mean time at a place on its time zone\'s meridian. A sundial is corrected by a table or by a curve drawn on it (the heliochronometer, with a cam, gave clock time directly). The analemma is drawn on terrestrial globes in the Pacific as the table of the Sun\'s declination and the equation of time for each date.

### Drawing it by hand
Plot 24 points, the Sun at 12:00 mean time on the 1st and 15th of each month, from the table in the construction\'s note: across by 4 units to the minute, up by 5 units to the degree, and join them with one smooth curve. The horizontal scale is exaggerated 3.2 times, so the eight is plump instead of the thin line it would be at true scale.`,
  ideas: [
    'The analemma is the Sun\'s declination plotted against the equation of time: the Sun at the same clock time through the year draws a figure of eight.',
    'The equation of time is the sum of two waves: the eccentricity of the orbit (once a year, amplitude 7.7 min) and the tilt of the ecliptic (twice a year, 9.9 min); E ≈ 9.87 sin 2B − 7.53 cos B − 1.5 sin B minutes.',
    'The extremes are −14.2 min (11 Feb), +3.6 (14 May), −6.5 (26 Jul), +16.4 (3 Nov); sundial and clock agree on about 15 April, 13 June, 1 September and 25 December.',
    'The figure is 47° tall (2ε) and 7.6° wide at true scale; the lower loop is larger because the two waves add in winter and nearly cancel in summer.'
  ],
  pitfalls: [
    'The Sun is on the meridian at 12:00 every day — Only on the four days the equation of time is zero. At 12:00 mean time it is up to 16 minutes (4°) to the east or west of south, and the sundial\'s noon is when it crosses.',
    'The earliest sunrise is on the solstice — The extremes of sunrise and sunset do not coincide with the solstice because the equation of time changes: at 51.5° N the earliest sunrise comes about a week before 21 June and the latest sunset about a week after, and the earliest sunset about 12 December, long before the shortest day.',
    'The figure is the same for everyone — Its height is always 47°, but its altitude depends on latitude, its tilt on the hour, and in the southern hemisphere it is mirror-reversed; at the equator the Sun passes near the zenith twice a year.'
  ],
  formulas: [
    {
      name: 'The equation of time (two-wave approximation)',
      expr: 'E = 9.87*sin(4*pi*(N - 81)/365) - 7.53*cos(2*pi*(N - 81)/365) - 1.5*sin(2*pi*(N - 81)/365)',
      tex: 'E = 9.87\\sin 2B - 7.53\\cos B - 1.5\\sin B, \\quad B = \\frac{360°\\,(N - 81)}{365}',
      vars: {
        E: { name: 'equation of time: sundial minus clock', q: false, unit: 'min', signed: true },
        N: { name: 'day of the year (1 January = 1)', value: 307, min: 1, max: 366 }
      },
      solveFor: 'E',
      note: 'Good to about half a minute. A positive value means the sundial is ahead of the clock: on day 307 (3 November) it is 16.4 minutes ahead.'
    },
    {
      name: 'The Sun\'s declination on a day of the year',
      expr: 'delta = asin(sin(eps)*sin(2*pi*(N - 81)/365))',
      tex: '\\delta = \\arcsin\\Bigl(\\sin\\varepsilon\\,\\sin\\frac{360°\\,(N - 81)}{365}\\Bigr)',
      vars: {
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', signed: true },
        eps: { name: 'obliquity of the ecliptic', q: 'angle', unit: '°', value: 23.44, min: 20, max: 26, tex: '\\varepsilon' },
        N: { name: 'day of the year', value: 172, min: 1, max: 366 }
      },
      solveFor: 'delta',
      note: 'A circular-orbit approximation, good to about half a degree: day 81 is the equinox (21 March) and day 172 the June solstice.'
    },
    {
      name: 'Angular width of the analemma',
      expr: 'w = (Emax - Emin)*cos(delta)*pi/720',
      tex: 'w = \\frac{E_{\\max} - E_{\\min}}{4}\\cos\\delta',
      vars: {
        w: { name: 'width of the figure on the sky', q: 'angle', unit: '°' },
        Emax: { name: 'largest equation of time', q: false, unit: 'min', value: 16.4, signed: true, tex: 'E_{\\max}' },
        Emin: { name: 'smallest equation of time', q: false, unit: 'min', value: -14.2, signed: true, tex: 'E_{\\min}' },
        delta: { name: 'declination at which the width is taken', q: 'angle', unit: '°', value: 0, signed: true, min: -23.5, max: 23.5 }
      },
      solveFor: 'w',
      note: 'One minute of time is a quarter of a degree of the Sun\'s east–west motion on the equator, and cos δ of it at declination δ.'
    },
    {
      name: 'Noon altitude of the Sun',
      expr: 'h = pi/2 - phi + delta',
      tex: 'h = 90° - \\varphi + \\delta',
      vars: {
        h: { name: 'altitude at solar noon (south of the zenith)', q: 'angle', unit: '°', signed: true },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32, signed: true, min: -90, max: 90, tex: '\\varphi' },
        delta: { name: 'declination of the Sun', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.5, max: 23.5 }
      },
      note: 'For the Sun south of the zenith in the northern hemisphere. Over the year the Sun at noon moves through 2ε = 46.9°: from 34.6° to 81.4° in Tel Aviv.'
    }
  ],
  examples: [
    {
      title: 'The equation of time on 3 November',
      q: 'Use the two-wave formula for 3 November (day 307). By how much is a sundial ahead of or behind the clock, and where is the Sun at 12:00 mean time?',
      steps: [
        { text: 'The angle:', tex: 'B = \\frac{360°\\,(307 - 81)}{365} = 222.9°, \\qquad 2B = 445.8° \\equiv 85.8°' },
        { text: 'The three terms:', tex: '9.87\\sin 85.8° = 9.84, \\quad -7.53\\cos 222.9° = +5.53, \\quad -1.5\\sin 222.9° = +1.02' },
        { text: 'Sum:', tex: 'E = 9.84 + 5.53 + 1.02 = 16.4\\ \\text{minutes}' },
        'A positive E means that the sundial is ahead: the Sun crossed the meridian 16.4 minutes before the clock said noon.'
      ],
      a: 'The sundial is 16.4 minutes ahead of the clock; at 12:00 mean time the Sun is already 4.1° (16.4 / 4) west of south, on the right as you face south.'
    },
    {
      title: 'The figure over Tel Aviv',
      q: 'At 12:00 local mean time at 32° N, over a year: between what altitudes does the Sun move, and how wide, in degrees, is the figure at the equinox?',
      steps: [
        { text: 'Noon altitudes at the extreme declinations:', tex: 'h_{\\max} = 90° - 32° + 23.44° = 81.4°, \\qquad h_{\\min} = 90° - 32° - 23.44° = 34.6°' },
        'The figure is 46.9° tall, twice the obliquity.',
        { text: 'The extremes of the equation of time, $+16.4$ and $-14.2$ minutes, are 30.6 minutes apart; at $\\delta \\approx 0$:', tex: 'w = \\frac{30.6}{4}\\cos 0° = 7.65°' }
      ],
      a: 'The Sun moves between 34.6° and 81.4° altitude, and the figure is 7.65° wide near the equinox (a little less near the solstices): a thin figure, six times as tall as wide.'
    }
  ],
  quiz: [
    { q: 'The height of the analemma (from highest to lowest) is set by', choices: ['the eccentricity of the Earth\'s orbit', 'twice the obliquity of the ecliptic, 46.9°', 'the latitude of the observer', 'the equation of time'], a: 1, why: 'The vertical coordinate is the declination, which runs from −ε to +ε; the width is set by the equation of time.' },
    { q: 'The analemma has the same shape and position for every place on the Earth.', a: false, why: 'The figure is the same in declination and equation of time, but its altitude depends on the latitude, its tilt on the hour of the day, and in the southern hemisphere it appears mirror-reversed.' },
    { q: 'The equation of time ranges from −14.2 to +16.4 minutes. The total range, in minutes, is', answer: 30.6, why: '16.4 + 14.2 = 30.6 minutes, or 7.65° of the Sun\'s motion.' },
    { q: 'Why is the lower loop of the figure larger than the upper one?', choices: ['the Sun is nearer in winter', 'the eccentricity wave and the obliquity wave add in autumn and winter and nearly cancel in summer', 'the Earth is tilted more in winter', 'because we look at the Sun from the north'], a: 1, why: 'The equation of time has an annual wave (eccentricity) and a half-yearly one (obliquity). In autumn and winter they reinforce, giving the extremes −14.2 and +16.4; in summer they nearly cancel, leaving −6.5 and +3.6.' },
    { q: 'On which of these dates do a sundial and a clock agree?', choices: ['3 November', '11 February', '15 April', '21 June'], a: 2, why: 'The equation of time is zero on about 15 April, 13 June, 1 September and 25 December.' }
  ],
  applications: [
    'Solar energy and building design: the time of solar noon, the symmetry of a day\'s irradiance and the timing of sunrise and sunset all need the equation of time to turn clock time into solar time.',
    'Sundials: tables, correction curves on the dial, and the heliochronometer, whose cam turns solar time into mean time; the long meridian lines laid in church floors, such as that of San Petronio in Bologna, serve as giant sundials that read the date as well as the noon.',
    'Navigation: the almanac tabulates the equation of time so that a noon sight of the Sun gives the longitude from the time it crosses the meridian.',
    'Astrophotography: the figure of eight over a year, from a fixed camera, is one of the classic composite pictures, made from 40 or so exposures.',
    'Globes and teaching: the analemma printed on terrestrial globes gives the declination and the equation of time for each date; other planets have their own, such as the teardrop of Mars.'
  ],
  history: 'The word is Greek and older than the figure. Ptolemy wrote an *Analemma* in the second century on projecting the celestial sphere orthographically on the plane of the meridian to solve the problems of sundials, and Vitruvius used it for the same construction. The irregularity of the Sun was no secret: Ptolemy knew both causes of the equation of time and gave a table for it in the *Almagest*, and Kepler\'s elliptical orbit gave it its modern form. It became a practical matter when pendulum clocks gave a steady time against which the sundial could be compared: in the 1670s Flamsteed set out and tabulated the equation of time, and from then on the almanacs carried it. The figure of eight is found on terrestrial globes as the table of the Sun\'s declination and the equation of time; the first photograph of the Sun\'s analemma over a year, by Dennis di Cicco in 1978–79, took about forty exposures.',
  sources: ['Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), chapter 28, on the equation of time.', 'R. Newton Mayall and Margaret W. Mayall, *Sundials: How to Know, Use and Make Them* (1938).', 'Albert E. Waugh, *Sundials: Their Theory and Construction* (Dover, 1973).', 'James Evans, *The History and Practice of Ancient Astronomy* (1998).'],
  sim: 'sm-analemma-days',
  construction: 'sm-analemma'
},

{
  id: 'sundials-as-projections',
  parent: 'sky-maps-and-instruments',
  title: 'Sundials as projections',
  level: 2,
  short: 'A sundial is a gnomonic projection made by light: the hour circles of the celestial sphere, which all meet at the pole, are carried through the dial\'s centre onto a plane as straight lines. On a horizontal dial their angle from the noon line is given by tan θ = sin φ tan(15° × hours from noon); on an equatorial dial they are 15° apart; on a vertical south dial tan θ = cos φ tan(15° × hours).',
  keywords: ['sundial', 'gnomon', 'gnomonic', 'style', 'hour line', 'horizontal dial', 'equatorial dial', 'vertical dial', 'nodus', 'declination lines', 'noon line'],
  prereq: ['gnomonic-projection', 'horizon-coordinates', 'the-suns-path'],
  related: ['the-analemma', 'sun-path-diagrams', 'the-astrolabe', 'shadows-by-projection', 'armillary-sphere-and-celestial-globe'],
  body: `### Light as the projector
The Sun\'s rays are parallel and the edge of the gnomon, the **style**, is parallel to the Earth\'s axis: it points at the celestial pole. At the hour angle $H$ the Sun lies on the hour circle of the sky through the pole and itself, so the style and the ray together span the plane of that circle, and the shadow of the style is the line where that plane meets the dial plate. All the planes pass through the dial\'s centre, the foot of the style, which stands for the centre of the celestial sphere (the Earth is a point beside the Sun). So the plate is the picture plane of a **central projection from the centre of the sphere**, the **gnomonic projection**, named after the gnomon ([[gnomonic-projection]]): the hour circles are great circles, and each becomes a straight line through the foot of the style.

### The equatorial and the horizontal dial
Put the plate perpendicular to the axis (the **equatorial dial**) and the hour circles meet it 15° apart: the hour lines are equally spaced and the plate is the gnomonic map of the sky round the pole. Tilt the plate to the horizontal and the picture is that same bundle of planes cut by a different plane: the hour line for $H = 15°t$ meets the line through the point $M$ on the noon line at $OM\\,\\sin\\varphi\\,\\tan H$ from the noon line, and
$$\\tan\\theta = \\sin\\varphi\\,\\tan(15°\\,t), \\qquad\\text{style height above the plate: } \\varphi .$$
The 6 o\'clock line is the east–west line, the 12 o\'clock line the noon line; at the pole the hour lines are 15° apart (a dial at the pole is equatorial) and on the equator they all fall on the noon line, so a horizontal dial is useless there. On a **vertical** wall facing south the style is $90° - \\varphi$ from the wall and $\\tan\\theta = \\cos\\varphi\\,\\tan(15°t)$: the roles of the sine and cosine swap.

### The date as well as the hour
The tip of the style (the nodus) throws a shadow whose path through the day depends on the Sun\'s declination. The rays through the nodus on one day form a cone of half-angle $90° - \\delta$ about the axis, and the plate cuts it in a conic: on a horizontal dial a hyperbola, bending one way in the half of the year when the Sun is north of the equator and the other way when it is south, and exactly the straight east–west line at the equinoxes, when the cone has flattened into a plane. Lines for the solstices and equinoxes, drawn on the dial, turn the nodus shadow into a calendar and a clock at once.

### Solar time, clock time
A dial reads **apparent solar time**. To compare it with the clock you add the equation of time (up to $\\pm 16$ minutes, [[the-analemma]]), 4 minutes for each degree of longitude between the dial and the meridian of its time zone, and an hour for summer time.

### Drawing it by hand
The classical construction takes the equatorial dial as the starting point: on the noon line mark $M$, draw the east–west line through it, fold the equatorial dial\'s centre down onto the noon line at $C''$ at distance $OM\\sin\\varphi$ from $M$ and lay off the angles 15°, 30°, … from $C''$. The cuts on the east–west line give the hour lines when joined to $O$. The two constructions below do the horizontal dial for 32° N and the equatorial dial and its elevation.

> [!tip] The sundial simulation draws the shadow of the gnomon on the plate through the day and the year, and compares the measured angle of the shadow with the formula.`,
  ideas: [
    'A sundial is a gnomonic projection made by light: the planes through the style are the hour circles, and the plate meets them in the hour lines.',
    'Equatorial dial: hour lines 15° apart. Horizontal dial: tan θ = sin φ tan(15°t). Vertical south dial: tan θ = cos φ tan(15°t). The style is parallel to the Earth\'s axis, at φ above the plate for the horizontal dial.',
    'The nodus\'s shadow traces a conic whose shape depends on the declination: the date lines of the dial; the equinox line is straight.',
    'The dial reads apparent solar time: add the equation of time, four minutes for each degree of longitude from the zone meridian, and summer time to compare it with the clock.'
  ],
  pitfalls: [
    'Any dial can be set up anywhere by tilting its style to the latitude — The style angle is only half of it. The hour lines of a horizontal dial depend on the latitude through sin φ, so a plate engraved for 52° N is wrong at 32° N even with its style tilted correctly.',
    'The gnomon\'s shadow moves 15° an hour — Only on the equatorial dial. On a horizontal dial the angle of the shadow changes slower than 15° an hour near noon, by the factor sin φ (about 8° in the first hour in Tel Aviv), and faster than 15° an hour towards 6 o\'clock.',
    'A sundial that reads noon at 12:00 is accurate — It is right on four days of the year at most; the equation of time moves it by up to 16 minutes, and the longitude and summer time by more.'
  ],
  formulas: [
    {
      name: 'Hour line of a horizontal dial',
      expr: 'tan(theta) = sin(phi)*tan(H)',
      tex: '\\tan\\theta = \\sin\\varphi\\,\\tan H',
      vars: {
        theta: { name: 'angle of the hour line from the noon line', q: 'angle', unit: '°', min: 0, max: 89.9 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.1, min: 1, max: 89, tex: '\\varphi' },
        H: { name: 'hour angle: 15° times the hours from noon', q: 'angle', unit: '°', value: 45, min: 0, max: 89 }
      },
      solveFor: 'theta',
      note: 'H = 15° is one hour from noon, 30° two hours. At 32.1° N: 8.1°, 17.1°, 28.0°, 42.6°, 63.2° for one to five hours; 90° (the east–west line) at six.'
    },
    {
      name: 'Hour line of a vertical south-facing dial',
      expr: 'tan(theta) = cos(phi)*tan(H)',
      tex: '\\tan\\theta = \\cos\\varphi\\,\\tan H',
      vars: {
        theta: { name: 'angle of the hour line from the vertical noon line', q: 'angle', unit: '°', min: 0, max: 89.9 },
        phi: { name: 'latitude', q: 'angle', unit: '°', value: 32.1, min: 1, max: 89, tex: '\\varphi' },
        H: { name: 'hour angle: 15° times the hours from noon', q: 'angle', unit: '°', value: 45, min: 0, max: 89 }
      },
      solveFor: 'theta',
      note: 'The style makes an angle 90° − φ with the wall. The dial shows the hours from 6 to 18 only when the Sun is south of the east–west line (autumn to spring in the north).'
    },
    {
      name: 'Height of the style\'s tip above the plate',
      expr: 'ht = g*tan(phi)',
      tex: 'h_{\\mathrm{t}} = g\\tan\\varphi',
      vars: {
        ht: { name: 'height of the tip of the style', q: 'length', unit: 'cm', tex: 'h_{\\mathrm{t}}' },
        g: { name: 'length of the gnomon\'s base along the noon line', q: 'length', unit: 'cm', value: 30 },
        phi: { name: 'latitude (angle of the style)', q: 'angle', unit: '°', value: 32.1, min: 1, max: 89, tex: '\\varphi' }
      },
      note: 'The gnomon is a right triangle on the noon line: base g, height g tan φ, hypotenuse the style at φ to the plate.'
    },
    {
      name: 'Length of a shadow',
      expr: 'L = ht/tan(a)',
      tex: 'L = \\frac{h_{\\mathrm{t}}}{\\tan a}',
      vars: {
        L: { name: 'length of the shadow on the ground', q: 'length', unit: 'cm' },
        ht: { name: 'height of the tip above the plate', q: 'length', unit: 'cm', value: 18.8, tex: 'h_{\\mathrm{t}}' },
        a: { name: 'altitude of the Sun', q: 'angle', unit: '°', value: 47.2, min: 1, max: 89 }
      },
      note: 'The shadow of a vertical height on a horizontal plane; the tip of the style makes its shadow this far from the point below it, along the direction away from the Sun.'
    }
  ],
  examples: [
    {
      title: 'A garden dial for Tel Aviv',
      q: 'A horizontal sundial is to be made for latitude 32.1° N. At what angles from the noon line are the hour lines for 11 and 1, 10 and 2, 9 and 3, 8 and 4, 7 and 5 o\'clock?',
      steps: [
        { text: 'With $\\sin 32.1° = 0.5314$:', tex: '\\tan\\theta_1 = 0.5314\\tan 15° = 0.1424 \\Rightarrow \\theta_1 = 8.1°' },
        { text: 'The other hours:', tex: '\\theta_2 = \\arctan(0.5314 \\tan 30°) = 17.1°, \\quad \\theta_3 = \\arctan(0.5314) = 28.0°, \\quad \\theta_4 = 42.6°, \\quad \\theta_5 = 63.2°' },
        'The 6 o\'clock line is the east–west line, at 90°. The morning lines lie on the west side of the noon line, the afternoon lines on the east.'
      ],
      a: 'From the noon line: 8.1°, 17.1°, 28.0°, 42.6° and 63.2° for one to five hours, then 90°. The lines are crowded near noon and spread towards six.'
    },
    {
      title: 'A south wall',
      q: 'Find the angles from the vertical of the hour lines at 1, 2 and 3 in the afternoon on a vertical south-facing dial at 32.1° N, and the height of the tip of a style of base 30 cm on a horizontal dial at the same latitude.',
      steps: [
        { text: 'With $\\cos 32.1° = 0.8465$:', tex: '\\theta_1 = \\arctan(0.8465 \\tan 15°) = 12.8°, \\quad \\theta_2 = 26.1°, \\quad \\theta_3 = \\arctan(0.8465) = 40.3°' },
        { text: 'The horizontal dial\'s gnomon has height', tex: 'h_{\\mathrm t} = 30 \\tan 32.1° = 18.8\\ \\text{cm}' }
      ],
      a: 'The wall dial\'s lines are 12.8°, 26.1° and 40.3° from the vertical (more spread out near noon than the horizontal dial\'s 8.1°, 17.1° and 28.0°); the horizontal dial\'s style tip is 18.8 cm above the plate.'
    }
  ],
  quiz: [
    { q: 'On an equatorial sundial the hour lines are', choices: ['equally spaced, 15° apart', 'crowded near noon', 'crowded near six o\'clock', 'parallel'], a: 0, why: 'The plate is perpendicular to the style, so the Sun moves round it at 15° an hour: the hour lines are 15° apart whatever the latitude.' },
    { q: 'On a horizontal dial at latitude 30° N, the 3 o\'clock hour line makes what angle with the noon line, in degrees?', answer: 26.6, why: 'tan θ = sin 30° tan 45° = 0.5, θ = 26.57°.' },
    { q: 'A horizontal dial made for London works in Tel Aviv if only the style is tilted to the new latitude.', a: false, why: 'The hour lines themselves depend on the latitude: tan θ = sin φ tan(15°t). The plate must be engraved for the latitude as well as the style tilted to it.' },
    { q: 'The style of a sundial points', choices: ['at the Sun at noon', 'at the celestial pole', 'at the zenith', 'at the north point of the horizon'], a: 1, why: 'The style is parallel to the Earth\'s axis; at latitude φ it rises φ above the horizon towards the pole.' },
    { q: 'On a horizontal dial the 6 o\'clock line is the east–west line.', a: true, why: 'At H = 90°, tan H is infinite and the hour line is perpendicular to the noon line.' }
  ],
  applications: [
    'Garden, school and public dials: the horizontal dial and the vertical wall dial are the common types, designed for the latitude and for the direction of the wall.',
    'Meridian lines and heliometers: a long noon line inlaid in a church floor, with a pinhole in the roof, turns a building into a gnomon that measures the Sun\'s declination and the length of the year.',
    'Solar noon and orientation: a gnomon\'s shortest shadow gives true north-south, and the length of its noon shadow through the year gives the latitude and the date.',
    'Heritage and architecture: the dials on old walls are read and restored by the formulas on this page, with the declination of the wall added.',
    'Teaching: the sundial shows, in the shadow on a plate, the daily rotation of the sky and the projection of the sphere onto a plane.'
  ],
  history: 'The shadow clock is Egyptian; the Greeks carved hemispherical dials (the hemicyclium credited to Berossus) and Vitruvius lists a dozen kinds. They were designed by a construction called the analemma, which projects the celestial sphere on the plane of the meridian, as in Ptolemy\'s treatise of that name. The tilted style parallel to the Earth\'s axis, which makes the hours equal on any plane, came with the astronomers of medieval Islam; Ibn al-Shatir made one for the Umayyad Mosque in Damascus in about 1371. In Europe the polar style spread in the fourteenth to sixteenth centuries with the equal hours of clocks. Pilkington and Gibbs\'s heliochronometer of 1906, with a cam for the equation of time, was the last great development before the wristwatch.',
  sources: ['Albert E. Waugh, *Sundials: Their Theory and Construction* (Dover, 1973).', 'R. Newton Mayall and Margaret W. Mayall, *Sundials: How to Know, Use and Make Them* (1938).', 'Denis Savoie, *Sundials: Design, Construction, and Use* (Springer, 2009).', 'Vitruvius, *On Architecture*, Book IX.', 'James Evans, *The History and Practice of Ancient Astronomy* (1998).'],
  sim: 'sm-sundial-shadow',
  construction: ['sm-horizontal-sundial', 'sm-equatorial-dial']
},

{
  id: 'armillary-sphere-and-celestial-globe',
  parent: 'sky-maps-and-instruments',
  title: 'The armillary sphere and the celestial globe',
  level: 2,
  short: 'The sky as the sphere it is, built or painted: rings for the horizon, meridian, equator and ecliptic (the armillary sphere), or the stars on a ball (the celestial globe). Drawn in parallel projection every ring is an ellipse with semi-major axis a and semi-minor axis b = a|cos γ|; seen from outside, every constellation is the mirror image of the one in the sky.',
  keywords: ['armillary sphere', 'celestial globe', 'ellipse', 'great circle', 'ecliptic ring', 'mirror image', 'meridian ring', 'horizon ring', 'tropics', 'Zhang Heng', 'Mercator globe', 'orthographic'],
  prereq: ['celestial-sphere', 'orthographic-projection', 'ecliptic-and-galactic-coordinates', 'equatorial-coordinates'],
  related: ['the-astrolabe', 'the-analemma', 'sundials-as-projections', 'orthographic-map-projection', 'isometric-circles', 'hipparchus-and-ptolemy-sky', 'durer-star-maps-1515'],
  body: `### The sphere made of rings
An **armillary sphere** (from the Latin *armilla*, a bracelet) is the celestial sphere as a skeleton: a few metal rings set in the planes that matter. The horizon and the meridian ring are fixed to the stand; the celestial equator and the ecliptic, tilted 23.44° to each other, turn about the polar axis, which passes through the centre and rises from the horizon at the latitude $\\varphi$; two narrower rings mark the tropics, small circles parallel to the equator at $\\pm\\varepsilon$ with radius $R\\cos\\varepsilon$ and a distance $R\\sin\\varepsilon$ from the centre along the axis. The Earth or the Sun sits at the centre. It is a solid model, not a projection, but to draw it on paper is a parallel (orthographic) projection of circles.

### One rule for every ring
A circle of radius $a$ lying in a plane with unit normal $\\hat n$, seen along the direction $\\hat v$, is drawn as an **ellipse** whose semi-major axis is $a$ (perpendicular to the projection of $\\hat n$) and whose semi-minor axis, along the projection of $\\hat n$, is
$$b = a\\,|\\hat n\\cdot\\hat v| = a\\cos\\gamma ,$$
$\\gamma$ the angle between the normal and the line of sight: the circle is tilted by $\\gamma$ out of the picture plane and one diameter shortens by $\\cos\\gamma$. Edge-on ($\\gamma = 90°$) it is a line, face-on a circle. The polar axis itself is drawn $\\sin\\gamma$ long. For the drawing in the construction (seen from the south-east, 18° above the horizon, at 32° N) the ratios $b/a$ are 0.50 for the equator, 0.31 for the horizon (it is $\\sin 18°$: the normal is vertical), 0.55 for the meridian and 0.67 for the ecliptic; the tropics have the same ratio as the equator. The same rule is behind the [[isometric-circles|isometric ellipse]], where $\\cos\\gamma = 1/\\sqrt3$.

### The globe: the sky seen from outside
A **celestial globe** paints the stars on the outside of a sphere. The figures are therefore those of the sky **mirror-reversed**: looking at the sphere from outside with north up, east is on the right; looking up at the sky it is on the left. Orion with Betelgeuse to the left of Rigel on a star chart has Betelgeuse to its right on a globe. The tradition is old: the tenth-century *Book of the Fixed Stars* of al-Sufi draws each constellation twice, once as seen in the sky and once as seen on a globe. A globe is mounted in a meridian ring and a horizon ring; turned about its axis it reproduces the daily turning of the sky, and set to the latitude it answers questions of rising, setting and twilight directly.

### Drawing it by hand
The construction draws the equator ring by the **auxiliary-circle method** (two circles of radii $a$ and $b$, rays from the centre, the point of the ellipse where the line from the large circle meets the line from the small one) and then the other rings with their own $b$. A globe itself is made from printed gores, narrow pole-to-pole strips cut from a map and glued on a ball: the problem of flattening a sphere run in reverse.

> [!fact] A garden **armillary sundial** is an equatorial dial: the equator ring, graduated in hours, is the plate, and the polar axis the style.`,
  ideas: [
    'An armillary sphere is the celestial sphere as rings: horizon, meridian, equator, ecliptic, the tropics, all about the polar axis, which rises at the latitude.',
    'In parallel projection a circle is an ellipse with semi-major axis a and semi-minor axis b = a|n·v| = a cos γ; the minor axis lies along the projection of the circle\'s normal.',
    'The tropics are circles of radius R cos ε, at a distance R sin ε either side of the centre along the axis.',
    'A globe shows the sky from outside, so every figure on it is the mirror image of the same figure in the sky; east is to the right on the globe, to the left in the sky.'
  ],
  pitfalls: [
    'A globe or an armillary sphere is a map of the sky — It is a model of the sphere, not a map; a map (a projection onto a plane) is what you get when you draw it, and it shows only one view at a time.',
    'Every ring of the armillary sphere appears with the same ellipse in a picture — Each ring has its own b, from its own normal; only parallel planes (equator and tropics) share the ratio.',
    'The constellations on a globe are as you see them in the sky — They are mirrored. Orion is the same shape, but with left and right exchanged.'
  ],
  formulas: [
    {
      name: 'Semi-minor axis of a ring in parallel projection',
      expr: 'b = a*cos(gamma)',
      tex: 'b = a\\cos\\gamma',
      vars: {
        b: { name: 'semi-minor axis of the ellipse', q: 'length', unit: 'mm' },
        a: { name: 'radius of the ring (semi-major axis)', q: 'length', unit: 'mm', value: 100 },
        gamma: { name: 'angle between the ring\'s normal and the line of sight', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\gamma' }
      },
      note: 'At γ = 0 the ring is face-on (a circle); at γ = 90° it is edge-on (a line). The isometric projection has cos γ = 1/√3 = 0.577 for every face.'
    },
    {
      name: 'Foreshortened polar axis',
      expr: 'p = R*sin(gamma)',
      tex: 'p = R\\sin\\gamma',
      vars: {
        p: { name: 'length of the polar axis (half) on the paper', q: 'length', unit: 'mm' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 100 },
        gamma: { name: 'angle between the axis and the line of sight', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\gamma' }
      },
      note: 'The ring perpendicular to the axis has b = R cos γ: the pole stands out of the ellipse exactly as far as the ellipse is flattened.'
    },
    {
      name: 'Radius of a tropic ring',
      expr: 'rt = R*cos(eps)',
      tex: 'r_{\\mathrm{t}} = R\\cos\\varepsilon',
      vars: {
        rt: { name: 'radius of the tropic ring', q: 'length', unit: 'mm', tex: 'r_{\\mathrm{t}}' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 100 },
        eps: { name: 'obliquity of the ecliptic (declination of the tropic)', q: 'angle', unit: '°', value: 23.44, min: 0, max: 60, tex: '\\varepsilon' }
      },
      note: 'The ring lies in a plane R sin ε from the centre along the axis, so on the sphere it is a circle of latitude.'
    },
    {
      name: 'Distance of a tropic ring from the centre',
      expr: 'zt = R*sin(eps)',
      tex: 'z_{\\mathrm{t}} = R\\sin\\varepsilon',
      vars: {
        zt: { name: 'distance of the tropic ring\'s plane from the equator', q: 'length', unit: 'mm', tex: 'z_{\\mathrm{t}}' },
        R: { name: 'radius of the sphere', q: 'length', unit: 'mm', value: 100 },
        eps: { name: 'declination of the tropic', q: 'angle', unit: '°', value: 23.44, min: 0, max: 60, tex: '\\varepsilon' }
      },
      note: 'For R = 100 the tropics are at 39.8 either side of the equator, along the polar axis.'
    }
  ],
  examples: [
    {
      title: 'The equator ring in a drawing',
      q: 'A model of an armillary sphere, radius 100 mm, is viewed so that the polar axis makes 60.2° with the line of sight. Find the semi-axes of the equator ring and of the tropics\' rings, and the length of the half polar axis on the paper.',
      steps: [
        'The equator ring\'s normal is the polar axis, so γ = 60.2°.',
        { text: 'Equator ring:', tex: 'a = 100\\ \\text{mm}, \\quad b = 100\\cos 60.2° = 49.7\\ \\text{mm}' },
        { text: 'Tropics: radius $R\\cos 23.44° = 91.7$ mm, same ratio:', tex: 'a = 91.7\\ \\text{mm}, \\quad b = 91.7 \\times 0.497 = 45.6\\ \\text{mm}' },
        { text: 'The half axis:', tex: 'p = 100\\sin 60.2° = 86.7\\ \\text{mm}' }
      ],
      a: 'Equator ring 100 × 49.7 mm; tropics 91.7 × 45.6 mm, centred 39.8 mm along the axis (34.5 mm on the paper) either side of the centre; the half polar axis is drawn 86.7 mm.'
    },
    {
      title: 'Seen from outside',
      q: 'On a star chart, held up to the sky, Betelgeuse (RA 5.9 h) is east of Rigel (RA 5.2 h). On which side of Rigel does it lie on a celestial globe, with north up and looking at the globe from outside?',
      steps: [
        'East is the direction of increasing right ascension. On the sky, looking at the southern horizon, east is on the left of the observer\'s view.',
        'On a globe seen from outside with north up, the direction of increasing right ascension is to the right: the globe is the mirror image of the sky.'
      ],
      a: 'On the globe Betelgeuse lies to the right of Rigel; in the sky, to the left. A globe held up to the sky is back to front.'
    }
  ],
  quiz: [
    { q: 'A circle of radius 100 whose plane makes 60° with the picture plane (its normal makes 60° with the line of sight) is drawn as an ellipse with semi-axes 100 and', answer: 50, why: 'b = a cos γ = 100 × cos 60° = 50. (The plane makes 60° with the picture plane, which is also the angle between the normals.)' },
    { q: 'On a celestial globe, seen from outside with north up, east is on', choices: ['the left, as in the sky', 'the right: the globe is the mirror image of the sky', 'either, depending on the hemisphere', 'neither: a globe has no east'], a: 1, why: 'A globe shows the sky as seen from outside the sphere, the mirror image of the view from inside.' },
    { q: 'All the rings of an armillary sphere appear as ellipses of the same ratio b/a in a picture.', a: false, why: 'The ratio is |n·v| for each ring\'s own normal. Rings in parallel planes (the equator and the two tropics) share it; the horizon, the meridian and the ecliptic have different ones.' },
    { q: 'The tropic of Cancer ring has radius 91.7 for a sphere of radius 100. What is the radius of the tropic of Capricorn ring?', answer: 91.7, why: 'Both are circles of declination ±23.44° and have the same radius R cos ε, on either side of the equator.' },
    { q: 'The edge-on view of the equator ring (the line of sight in the plane of the equator) shows it as', choices: ['a circle', 'a straight line', 'an ellipse of ratio 0.5', 'a parabola'], a: 1, why: 'The normal (the polar axis) is perpendicular to the line of sight: γ = 90°, b = a cos 90° = 0, the ellipse collapses to a segment.' }
  ],
  applications: [
    'Teaching and display: the armillary sphere and the celestial globe show the horizon, the ecliptic and the diurnal motion as solids; they are the model for every planetarium.',
    'Technical illustration: the ellipse rule is the same for every circle drawn in parallel projection, so the armillary drawing is a worked example for any axonometric picture of a round part ([[isometric-circles]]).',
    'Garden armillary sundials: the equator ring graduated in hours is the plate of an equatorial dial and the polar axis its style.',
    'Navigation: celestial globes were once the mariner\'s instrument for finding the rising and setting of the Sun and stars and the length of twilight, by setting the pole to the latitude and turning the globe.',
    'Emblems: the armillary sphere is on the coat of arms of Portugal, and a celestial globe in the middle of the flag of Brazil.'
  ],
  history: 'The sphere of rings goes back to Greek astronomy: Eratosthenes is said to have built one in the third century BC, and Ptolemy\'s *Almagest* describes how to make an armillary for observing. In China, Zhang Heng made a water-driven armillary sphere in 117 AD, and Su Song\'s clock tower of 1088 carried a huge one. The celestial globe is as old: the marble Farnese Atlas of the second century AD shows Atlas carrying the sphere with its Greek constellations, the oldest picture of them. In the Islamic world the globes and the double drawing of al-Sufi (964) set out both views, and in Europe Gerardus Mercator\'s celestial globe of 1551 matched his terrestrial one of 1541. Tycho Brahe measured the places of the stars with great armillary spheres in the sixteenth century, and Coronelli\'s globes of 1683, four metres across, were the largest ever made.',
  sources: ['James Evans, *The History and Practice of Ancient Astronomy* (1998), the chapters on the instruments.', 'Elly Dekker, *Globes at Greenwich* (Oxford, 1999), and her *Illustrating the Phaenomena: Celestial Cartography in Antiquity and the Middle Ages* (2013).', 'Joseph Needham, *Science and Civilisation in China*, vol. 3 (1959), on the armillary sphere.', 'Peter van der Krogt, *Globi Neerlandici: The Production of Globes in the Low Countries* (1993).'],
  sim: 'sm-celestial-globe',
  construction: 'sm-armillary-rings'
},

{
  id: 'planetarium-domes',
  parent: 'sky-maps-and-instruments',
  title: 'Planetarium domes',
  level: 2,
  short: 'A planetarium dome makes the sky a hemisphere you sit under. The picture it carries is the azimuthal equidistant "dome master": a square image whose inscribed circle is the dome\'s horizon, the zenith at the centre, and the radius proportional to the angle from the zenith — exactly what a fisheye projector at the centre of the dome, with r = fθ, throws.',
  keywords: ['planetarium', 'dome', 'dome master', 'fulldome', 'fisheye projector', 'azimuthal equidistant', 'IMAX dome', 'Zeiss projector', 'Bauersfeld', 'pixels per degree', 'tilted dome'],
  prereq: ['dome-projection', 'the-all-sky-view', 'equidistant-fisheye', 'azimuthal-equidistant-projection'],
  related: ['equirectangular-images', 'cube-maps', 'little-planet', 'stereographic-fisheye', 'astronomy-and-planetary-maps', 'armillary-sphere-and-celestial-globe'],
  body: `### The sky as a hemisphere
Two machines fill a dome. The **optical** star projector, a cluster of lenses each throwing a patch of the sky from a perforated plate, puts every star in its true direction with a hole of the right size; the **digital** projector, a video projector with a fisheye lens at the centre of the dome (or several, blended at their edges), throws any picture. Either way the dome holds the *directions* of the sky as seen from the centre, so the audience in the seats sees the sky from the ground: east on the left when they look up, north at the front.

### The dome master
Digital content for a dome is a square image, the **dome master**. The inscribed circle is the dome from the zenith (the centre) to the horizon (the circle), and the radius is proportional to the angle $\\theta$ from the zenith:
$$r = \\frac{N}{2}\\cdot\\frac{\\theta}{90°} = \\frac{N\\theta}{\\pi},$$
with $N$ the number of pixels across: the **azimuthal equidistant** projection of the sky, the same as the [[the-all-sky-view|all-sky view]]. A degree is $N/180$ pixels wide everywhere, 22.8 px at 4K ($N = 4096$) and 45.5 at 8K; a pixel covers $180°\\times 60/N$ arcminutes, 2.6′ and 1.3′, and on a dome of diameter $D$ it measures $\\pi D/(2N)$: 7.7 mm for a 20 m dome at 4K. The eye resolves about 1′, so a master that matches it needs 10 800 pixels across. The four corners lie outside the circle: $1 - \\pi/4 = 21\\%$ of the pixels are never lit.

### Why equidistant, and what goes wrong
A fisheye projector with $r = f\\theta$ throws the image plane onto the dome linearly in angle: the rays are 15° apart in the section if the master\'s rings are 1/6 of the radius apart. That is why the master is equidistant. A lens with another law (equisolid $2f\\sin\\frac\\theta2$, stereographic $2f\\tan\\frac\\theta2$, orthographic $f\\sin\\theta$) given the same image puts the rings in the wrong places: with an equisolid lens a ring meant for altitude 45° lands at 48.6°, and the picture is pulled towards the zenith. Real domes use **warp meshes**: the master is resampled for each projector, correcting the lens, the off-axis position of the projector and the shape of the dome, and blending the overlaps. For a **tilted** dome (the front low, the spring line tipped by 10–30° so that the audience faces the horizon), the content is rendered in the dome\'s own coordinates and the horizon is not at the edge of the image.

### What the projection does to shapes
Along a radius the scale is constant; across it, it grows as $\\theta/\\sin\\theta$ (1.57 at the horizon), so figures near the edge of the dome master look stretched across and an Orion drawn on the master is a little fat at the horizon; on the dome, seen from the centre, it is correct. A planetarium show is produced by rendering a 3D scene into the cube faces or directly into a fisheye image, so every movie is rendered in this projection.

### Drawing it by hand
The construction draws the section of the dome with the projector at the centre and rays every 15°, carries the arc of one 15° step to the radius of the master with the dividers (the dome of radius 70 and the master of radius 110 are in the ratio $\\pi/2$, so the arc and the step are equal), draws the rings and azimuth lines of the master, and plots a point on both.`,
  ideas: [
    'The dome master is a square image whose inscribed circle is the dome: zenith at the centre, horizon on the circle, radius proportional to the angle from the zenith, r = Nθ/π.',
    'This is the azimuthal equidistant mapping, and it is what a fisheye projector with r = fθ at the dome\'s centre expects: equal angles on the dome, equal steps on the image.',
    'A degree is N/180 pixels everywhere: 22.8 px at 4K, 45.5 px at 8K; a pixel is 10 800/N arcminutes and πD/(2N) on a dome of diameter D; 21 % of the square is unused.',
    'A mismatch of lens and master pulls the picture out of place (an equisolid lens puts the 45° ring at 48.6°); real domes correct with warp meshes, and tilted domes render in the dome\'s own coordinates.'
  ],
  pitfalls: [
    'The dome master is a picture of the dome seen from outside — It is the dome\'s sky as seen from the centre, looking up: the audience\'s view, with east on the left, not a map seen from above.',
    'The more pixels the better, without limit — The eye resolves about 1′, so 10 800 pixels across match it at the edge; beyond that nothing is gained, and well before it the projector, the dome\'s surface and the contrast limit what you see.',
    'Any fisheye projector can show any dome master — The lens law must match: with a stereographic or equisolid lens the content has to be re-mapped, or the sky is out of place by degrees.'
  ],
  formulas: [
    {
      name: 'Radius on the dome master',
      expr: 'r = N*theta/pi',
      tex: 'r = \\frac{N\\theta}{\\pi}',
      vars: {
        r: { name: 'distance from the centre of the master', q: false, unit: 'px' },
        N: { name: 'pixels across the master', q: false, unit: 'px', value: 4096 },
        theta: { name: 'angle from the zenith', q: 'angle', unit: '°', value: 60, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'The horizon (θ = 90°) is at r = N/2, the edge of the inscribed circle.'
    },
    {
      name: 'Pixels per degree on the master',
      expr: 'p = N/180',
      tex: 'p = \\frac{N}{180}',
      vars: {
        p: { name: 'pixels per degree of sky', q: false, unit: 'px/°' },
        N: { name: 'pixels across the master', q: false, unit: 'px', value: 4096 }
      },
      note: 'Constant along any radius and the same at every point of the picture. The angle one pixel covers is its inverse: 60/p arcminutes.'
    },
    {
      name: 'Angle covered by one pixel',
      expr: 'a = 10800/N',
      tex: 'a = \\frac{10\\,800}{N}\\ \\text{arcminutes}',
      vars: {
        a: { name: 'angular size of a pixel', q: false, unit: 'arcmin' },
        N: { name: 'pixels across the master', q: false, unit: 'px', value: 4096 }
      },
      note: 'A pixel of 1 arcminute, the limit of the eye, needs N = 10 800. 4K gives 2.6′, 8K gives 1.3′.'
    },
    {
      name: 'Pixel pitch on the dome',
      expr: 's = pi*D/(2*N)',
      tex: 's = \\frac{\\pi D}{2N}',
      vars: {
        s: { name: 'width of a pixel on the dome surface', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the dome', q: 'length', unit: 'm', value: 20 },
        N: { name: 'pixels across the master', q: 'count', value: 4096, int: true }
      },
      note: 'The arc of the dome from horizon to horizon is πD/2 long, and it is shared among N pixels.'
    }
  ],
  examples: [
    {
      title: 'How sharp is a 4K dome?',
      q: 'A planetarium has a dome 20 m in diameter and shows a 4096 × 4096 dome master. How many pixels make a degree, what angle does a pixel cover, how wide is it on the dome, and how many pixels across would match the eye\'s 1 arcminute?',
      steps: [
        { text: 'Per degree:', tex: '\\frac{4096}{180} = 22.8\\ \\text{px}' },
        { text: 'One pixel:', tex: '\\frac{10\\,800}{4096} = 2.64\' \\;(0.044°)' },
        { text: 'On the dome, whose horizon-to-horizon arc is $\\pi D/2 = 31.4$ m:', tex: '\\frac{31\\,416\\ \\text{mm}}{4096} = 7.7\\ \\text{mm}' },
        { text: 'Matching 1′ needs', tex: 'N = 180 \\times 60 / 1 = 10\\,800\\ \\text{px across}' }
      ],
      a: '22.8 pixels per degree; each pixel covers 2.6 arcminutes, which is 7.7 mm on the dome; 10 800 pixels across would be needed to match the eye.'
    },
    {
      title: 'Where a star lands on the master',
      q: 'On a 4096-pixel dome master with north up, a star has altitude 30° and azimuth 60° (east of north). Where is it, measured from the top left corner, with x to the right and y down?',
      steps: [
        { text: 'The zenith distance is 60°:', tex: 'r = \\frac{4096 \\times 60°}{180°} = 1365\\ \\text{px from the centre}' },
        { text: 'Azimuth is measured from the top of the image, through the LEFT (the dome seen from the seats):', tex: 'x = 2048 - 1365\\sin 60° = 866, \\qquad y = 2048 - 1365\\cos 60° = 1365' }
      ],
      a: 'At (866, 1365): up and to the left of the centre, a third of the way from the centre to the left edge.'
    }
  ],
  quiz: [
    { q: 'In a dome master the zenith is', choices: ['at the top edge of the image', 'at the centre of the image', 'at the bottom of the image', 'at a corner'], a: 1, why: 'The inscribed circle is the dome, with the zenith at its centre and the horizon on the circle.' },
    { q: 'How many pixels make one degree on an 8192-pixel dome master?', answer: 45.5, why: '8192 / 180 = 45.5 pixels per degree, the same at every point of the picture.' },
    { q: 'The four corners of a square dome master are lit by the projector.', a: false, why: 'The corners lie outside the inscribed circle, which is the dome; no ray of the projector reaches them. About 21 % of the pixels are not used.' },
    { q: 'A projector with an equisolid-angle lens is fed an equidistant dome master. A ring meant to be at altitude 45° appears', choices: ['at about 48.6°, pulled towards the zenith', 'at about 37°, pushed towards the horizon', 'at 45°, unchanged', 'on the horizon'], a: 0, why: 'The equisolid law puts the image radius r = ρ at θ = 2 arcsin(ρ sin 45°): for ρ = 1/2 that is 41.4° from the zenith, i.e. altitude 48.6°.' },
    { q: 'A dome 10 m across is fed a 2048-pixel master. How wide is one pixel on the dome, in millimetres?', answer: 7.7, why: 'πD/(2N) = π × 10 000 mm / 4096 = 7.67 mm.' }
  ],
  applications: [
    'Planetariums and fulldome theatres: the sky, the solar system and the universe projected on a hemisphere, with a master that every projector in the dome divides into its own part.',
    'Flight and vehicle simulators: a dome with a fisheye or multi-projector image lets a pilot or driver see the horizon all round.',
    'Large-format film: the dome cinema (the IMAX Dome, originally Omnimax) shot and projected with a 180° fisheye lens onto a tilted dome.',
    'Immersive education and art: museum domes, VR domes and portable inflatable domes use the same dome master as the planetarium.',
    'Astronomical visualisation: the sky as rendered by planetarium software for a dome is the all-sky equidistant picture of this page.'
  ],
  history: 'The first star projector for a dome was built by Walther Bauersfeld at the Zeiss works in Jena in 1923, after the idea of Oskar von Miller for the Deutsches Museum in Munich, where the first public shows were given in 1925; the Adler Planetarium in Chicago (1930) was the first in the Americas. Smaller projectors, such as the Spitz of the 1950s, brought the planetarium to schools. The dome was also a place for film: the IMAX Dome (as Omnimax) first opened in San Diego in 1973. The all-digital planetarium dates from the Evans & Sutherland Digistar of 1983 and, from the 1990s, from video projectors with fisheye lenses fed by the dome master. The idea of being inside the celestial sphere is much older still: the Gottorf Globe of 1664, a hollow sphere three metres across with the stars painted inside, seated visitors in it.',
  sources: ['Paul Bourke, "Dome projection and fisheye formats" (paulbourke.net), on the dome master and the fisheye mappings.', 'Sidney F. Ray, *Applied Photographic Optics*, the chapter on fisheye lenses.', 'John P. Snyder, *Map Projections — A Working Manual*, USGS Professional Paper 1395 (1987), the azimuthal equidistant projection.', 'The history of the Zeiss planetarium, in Walther Bauersfeld\'s own accounts of 1923–25 and in the Deutsches Museum\'s publications.'],
  sim: 'sm-dome-mapping',
  construction: 'sm-dome-master'
},

);
