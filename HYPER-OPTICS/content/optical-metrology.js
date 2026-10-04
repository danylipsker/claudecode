/* HYPER-OPTICS · content/optical-metrology.js — the topic "Measuring with light, measuring optics" (ids mt-… for simulations)
 *   measuring-focal-length-and-radius   autocollimation, magnification and displacement methods, the nodal slide, the spherometer
 *   the-autocollimator                  the angle of a returned image: 2·f·θ, arc-second sensitivity, flatness and squareness
 *   testing-surfaces-with-interferometers  Fizeau and Twyman–Green layouts, fringes, phase shifting, PV and RMS
 *   wavefront-sensors                   Shack–Hartmann: spot shift = slope × focal length; curvature and pyramid sensors
 *   spectrophotometers                  transmittance and absorbance against wavelength, single and double beam, bandwidth
 *   refractometers                      the critical-angle (Abbe) refractometer, Brix
 *   ellipsometry                        Ψ and Δ: the change of polarization on reflection gives thickness and index
 *   optical-profilers                   white-light interferometry, confocal and focus-variation sensors against the stylus
 *   distance-and-displacement-sensors   triangulation, chromatic confocal, interferometers counting half-wavelengths, time of flight
 *   alignment-telescopes-and-lasers     lines of sight, cross-line and rotating lasers, autocollimating alignment, laser trackers
 */
Hyper.add(

/* ================================================================ focal length and radius */
{
  id: 'measuring-focal-length-and-radius', parent: 'optical-metrology', title: 'Measuring focal length and radius of curvature', level: 2,
  short: 'Focal length and radius of curvature are the two numbers from which a lens follows, and each can be measured with a bench and a few simple ideas: find where a returned image is sharp (autocollimation), find the two lens positions that focus an image on a fixed screen (Bessel), find the pivot that leaves the image still (the nodal slide), or measure how deep a surface dips between three feet (the spherometer, R = (r² + s²)/2s).',
  keywords: ['measuring focal length', 'focal length measurement', 'autocollimation', 'Bessel method', 'displacement method', 'conjugate method', 'magnification method', 'nodal slide', 'nodal bench', 'spherometer', 'sagitta', 'sag', 'radius of curvature', 'radius measurement', 'EFL', 'effective focal length', 'back focal length', 'BFL', 'optical bench', 'lensmeter'],
  prereq: ['the-thin-lens-equation', 'thick-lenses-and-principal-planes', 'lateral-and-longitudinal-magnification'],
  related: ['cardinal-points', 'the-autocollimator', 'testing-optics-with-fringes', 'newtons-rings-and-wedge-fringes', 'fitting-measurements-and-the-lensmeter', 'making-optics', 'reading-an-optics-catalogue', 'surface-quality-and-flatness'],
  body: `
A catalogue says a lens has a focal length of 100 mm and a front radius of 51.7 mm, and someone has to check. The methods are old and still in daily use, because each reduces the question to something the eye or a dial gauge can settle: *where does it come to a focus?* and *how deep does the surface dip?*

### Focal length
All the methods find the **effective focal length** (EFL), measured from the rear principal plane, not from the glass: the **back focal length** (BFL), from the last surface to the focus, differs from it. A 100 mm biconvex N-BK7 lens, 6 mm thick, has an EFL of 100.0 mm and a BFL of 98.0 mm.

- **Autocollimation.** Put a lit cross-hair in front of the lens and a flat mirror behind it, and move the cross-hair until its returned image is sharp beside it. The light between lens and mirror is then parallel, which happens only with the cross-hair in the front focal plane: the lens-to-cross-hair distance is $f$. The mirror's distance does not matter.
- **Magnification method.** Image a ruled scale and measure the magnification $m$ (image size over object size) and the distance $L$ from object to image. Since $s_o = f(1 + 1/m)$ and $s_i = f(1 + m)$, the focal length is $f = L\\,m/(1+m)^2$. At $m = 1$ this is the familiar "four-f" arrangement, $f = L/4$.
- **Bessel's two-position method.** Fix the object and the screen a distance $L$ apart, with $L > 4f$. Exactly two positions of the lens give a sharp image, one magnified, one reduced, a distance $d$ apart. Then
$$f = \\frac{L^2 - d^2}{4L}$$
Only a *displacement* of the lens is measured, so the position of its principal planes does not matter; they enter only through $L$, as their separation, small against $L$.
- **Nodal slide.** Mount the lens on a carriage that pivots about a vertical axis and sight a distant target through it. When the axis passes through the rear nodal point the image does not move as the lens swings; the distance from the axis to the image plane is the EFL. In air the nodal points coincide with the principal points ([[cardinal-points]]).

### Radius of curvature
The **spherometer** has three feet on a circle of radius $r$ and a probe in the middle that moves along the axis. Zeroed on a flat, it is set on a spherical surface and the probe shows the **sag** $s$: how far the centre lies below (or above) the plane of the feet. Geometry of a chord gives
$$R = \\frac{r^2 + s^2}{2s}$$
With $r = 20$ mm and $s = 0.050$ mm, $R = 4000$ mm. The *relative* error of $R$ equals that of $s$: a dial gauge good to 1 µm on a 50 µm sag is a 2 % error, so spherometers suit short radii and give way to interference on long ones: count the rings of [[newtons-rings-and-wedge-fringes|Newton's rings]] against a test plate, or focus a microscope on the surface and then on its centre of curvature; the travel is $R$.

| Method | You measure | Weak point |
|---|---|---|
| Autocollimation | lens to cross-hair at best focus | judging "sharpest" by eye |
| Bessel | $L$ and the lens shift $d$ | needs $L > 4f$: a long bench |
| Nodal slide | pivot position | a good bearing, a distant target |
| Spherometer | sag $s$ under a known ring | short radii; touches the surface |

> [!tip] Spectacle lenses go on a [[fitting-measurements-and-the-lensmeter|lensmeter]].

> [!key] Every focal-length method finds where something is sharp, and every radius method measures a sag. Use a method whose answer does not depend on the thing you cannot see: the position of the principal planes.
`,
  ideas: [
    'Focal length is measured from the rear principal plane, so a thick lens has a back focal length that differs from its EFL.',
    'Autocollimation: the returned image of a cross-hair is sharp only when the cross-hair is in the focal plane; the mirror distance drops out.',
    'Bessel: with object and screen L apart (L > 4f) two lens positions d apart focus; f = (L² − d²)/4L, no principal-plane position needed.',
    'Nodal slide: the image stays still when the lens pivots about the rear nodal point; the pivot-to-image distance is the EFL.',
    'Spherometer: R = (r² + s²)/2s; the relative error of the radius equals that of the sag.'
  ],
  pitfalls: [
    'The focal length is the distance from the back of the lens to the focus — That is the back focal length. The focal length is measured from the rear principal plane, which can lie inside the glass or even outside it.',
    'One position of the lens gives a sharp image, so Bessel\'s method needs only one — The point is that there are two (one enlarging, one reducing); their separation is the measurement. With L less than 4f there is none.',
    'A spherometer measures the radius of the whole surface — It measures the sag under the ring of its feet and gives the radius of the sphere that fits there; an aspheric or irregular surface gives a different answer on a different ring.',
    'Autocollimation needs the mirror at a particular distance — Any distance works, because the beam between lens and mirror is parallel; the mirror must only be flat and square to the axis.'
  ],
  terms: [
    { term: 'Effective focal length', also: ['EFL', 'f'], def: 'The distance from the rear principal plane of a lens or system to its focus for a distant object. It is the number in the catalogue and in the lens equation.' },
    { term: 'Back focal length', also: ['BFL', 'back focus'], def: 'The distance from the last glass surface to the focus. It differs from the effective focal length by the distance of the rear principal plane from that surface.' },
    { term: 'Autocollimation', def: 'Sending light through a system and back off a flat mirror so that the returned image is compared with its source; the image is sharp and in place only when the source sits in the focal plane (the beam between lens and mirror is parallel).' },
    { term: 'Bessel method', also: ['displacement method', 'two-position method'], def: 'A focal-length measurement with the object and screen a fixed distance L apart: the two lens positions that focus an image are a distance d apart and give f = (L² − d²)/4L.' },
    { term: 'Nodal slide', also: ['nodal bench'], def: 'A lens carriage that pivots about an adjustable vertical axis. The setting at which the image of a distant object does not move as the lens is turned marks the rear nodal point.' },
    { term: 'Sagitta', also: ['sag', 's'], def: 'The height of a circular arc above its chord: the depth by which a spherical surface falls away from the plane of three points on it.' },
    { term: 'Spherometer', def: 'An instrument with three feet on a circle and a movable central probe that measures the sag of a surface and so its radius of curvature.' }
  ],
  formulas: [
    {
      name: 'Focal length from two conjugates',
      expr: 'f = so*si/(so + si)', tex: 'f = \\frac{s_o\\,s_i}{s_o + s_i}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', tex: 'f' },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 150, tex: 's_o' },
        si: { name: 'image distance', q: 'length', unit: 'mm', value: 300, tex: 's_i' }
      },
      note: 'The thin-lens equation solved for f. Both distances are measured from the lens, so the error is the unknown principal-plane separation.',
      stories: { f: 'A thin lens puts a sharp image on a screen {si} behind it when the object is {so} in front. What is its focal length?' }
    },
    {
      name: 'Bessel\'s displacement method',
      expr: 'f = (L^2 - d^2)/(4*L)', tex: 'f = \\frac{L^2 - d^2}{4L}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', tex: 'f' },
        L: { name: 'distance from object to screen', q: 'length', unit: 'mm', value: 500, min: 1, max: 5000, tex: 'L' },
        d: { name: 'shift between the two lens positions', q: 'length', unit: 'mm', value: 223.6, min: 0, max: 5000, tex: 'd' }
      },
      note: 'Valid for L greater than 4f; at L = 4f the two positions merge (d = 0).',
      stories: { f: 'A lens gives a sharp image at two positions {d} apart when the object and screen are {L} apart. What is its focal length?' }
    },
    {
      name: 'Focal length from the magnification',
      expr: 'f = L*m/(1 + m)^2', tex: 'f = \\frac{L\\,m}{(1 + m)^{2}}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', tex: 'f' },
        L: { name: 'distance from object to image', q: 'length', unit: 'mm', value: 450, tex: 'L' },
        m: { name: 'magnification (size of image over size of object)', value: 2, min: 0.05, max: 20, tex: 'm' }
      },
      note: 'For a thin lens. The same f results for m and for 1/m, the two positions of Bessel\'s method.'
    },
    {
      name: 'Radius of curvature from a spherometer',
      expr: 'R = (r^2 + s^2)/(2*s)', tex: 'R = \\frac{r^2 + s^2}{2s}',
      vars: {
        R: { name: 'radius of curvature of the surface', q: 'length', unit: 'mm', tex: 'R' },
        r: { name: 'radius of the ring of feet', q: 'length', unit: 'mm', value: 20, tex: 'r' },
        s: { name: 'sag measured by the central probe', q: 'length', unit: 'mm', value: 0.05, min: 0, max: 20, tex: 's' }
      },
      note: 'Exact for a sphere. The sag is small against the ring radius for most optics, so R is close to r²/2s.',
      stories: { R: 'A spherometer with feet on a circle of radius {r} reads a sag of {s}. What is the radius of the surface?' }
    }
  ],
  examples: [
    {
      title: 'A lens on the Bessel bench',
      q: 'A cross-hair and a screen are fixed 600 mm apart. A lens focuses the cross-hair on the screen at two positions 200 mm apart. What is its focal length, and is the arrangement valid?',
      steps: [
        { text: 'Apply Bessel\'s formula:', tex: 'f = \\frac{L^2 - d^2}{4L} = \\frac{600^2 - 200^2}{4 \\times 600} = \\frac{320\\,000}{2400} = 133.3\\ \\mathrm{mm}' },
        'The condition is $L > 4f$: $4f = 533$ mm and $L = 600$ mm, so the two positions exist, as they must since they were observed.',
        'The two image sizes multiply to one: if one position gives $m = 2.2$ the other gives $1/2.2$.'
      ],
      a: 'f = 133 mm. Only the shift of the lens and the fixed distance were measured, never a distance to the glass.'
    },
    {
      title: 'How good is a spherometer?',
      q: 'A spherometer with its three feet on a circle of radius 20 mm reads a sag of 50 µm, with a gauge that is good to ±1 µm. What radius does it show, and how uncertain is it?',
      steps: [
        { text: 'The radius from the sag:', tex: 'R = \\frac{r^2 + s^2}{2s} = \\frac{400 + 0.0025}{0.100}\\ \\mathrm{mm} \\approx 4000\\ \\mathrm{mm}' },
        'At $s = 0.049$ mm the formula gives 4082 mm and at $s = 0.051$ mm it gives 3922 mm.'
      ],
      a: 'R = 4.00 m, uncertain by about ±2 % (±80 mm): a 1 µm error on a 50 µm sag is 2 %. For a radius of 40 m the same gauge would give a sag of 5 µm and an uncertainty of 20 %, which is why long radii are tested by interference.'
    }
  ],
  quiz: [
    { q: 'In autocollimation the returned image of the cross-hair is sharp and lies on the cross-hair itself. What does that tell you?', choices: ['The cross-hair is in the focal plane, so its distance from the lens is the focal length', 'The mirror is exactly one focal length from the lens', 'The lens has no aberrations', 'The cross-hair is at twice the focal length'], a: 0, why: 'A flat mirror returns light along its own path, so the image coincides with the object only if the beam between lens and mirror is parallel. That needs the cross-hair at the focal plane; the mirror distance is irrelevant.' },
    { q: 'With the object and screen only 3f apart, Bessel\'s method still gives two lens positions that focus the image.', a: false, why: 'The two positions exist only for $L > 4f$. At $L = 4f$ they merge into one (magnification 1) and for smaller $L$ no lens position gives a real image on the screen.' },
    { q: 'Object and screen are 500 mm apart and a lens focuses at two positions 223.6 mm apart. What is its focal length in millimetres?', answer: 100, unit: 'mm', why: '$f = (L^2 - d^2)/4L = (250\\,000 - 50\\,000)/2000 = 100$ mm. Check: $4f = 400 < 500$.' },
    { q: 'A spherometer with feet on a 25 mm radius reads a sag of 0.100 mm. What is the radius of the surface, in millimetres?', answer: 3125, unit: 'mm', why: '$R = (r^2 + s^2)/2s = (625 + 0.01)/0.2 = 3125$ mm.' },
    { q: 'On a nodal slide a lens is turned about a vertical axis while the image of a distant lamp is watched. The image stays put when the axis is…', choices: ['at the rear nodal point', 'at the front focal point', 'at the centre of the lens barrel', 'at the image plane'], a: 0, why: 'A ray leaves a lens as if from the rear nodal point at the angle at which it entered. If the lens turns about that point, the outgoing ray keeps its direction and position, so the image does not shift.' }
  ],
  applications: [
    'Incoming inspection of lenses: a purchased 50 mm lens is checked on a bench before it goes into a camera or a laser system.',
    'Optical workshops: the radius of a polished surface is compared with a master test plate or measured with a spherometer before the lens is finished.',
    'Telescope mirrors: the radius of a concave mirror is found by placing a point source at its centre of curvature and measuring the distance to the mirror.',
    'Teaching laboratories: the Bessel method is a classic student bench exercise because it needs only a ruler.',
    'Spectacle shops: lensmeters measure the focal power of a finished lens through its back surface.'
  ],
  sources: [
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the chapters on testing with fringes and on measuring radii and focal lengths in the optical shop.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the thin-lens equation and the thick-lens cardinal points.',
    'W. J. Smith, *Modern Optical Engineering* — the paraxial relations used in the conjugate and magnification methods.'
  ],
  sim: 'mt-focal-length'
},

/* ================================================================ the autocollimator */
{
  id: 'the-autocollimator', parent: 'optical-metrology', title: 'The autocollimator', level: 2,
  short: 'An autocollimator sends a parallel beam at a flat mirror and looks at what returns. A mirror tilt of θ turns the beam by 2θ and moves the returned image by 2·f·θ in the focal plane of the instrument: with f = 300 mm, one arc-second of tilt is 2.9 µm. It checks flatness, straightness, squareness, wedge and angle standards to fractions of an arc-second.',
  keywords: ['autocollimator', 'autocollimation', 'arc second', 'arcsecond', 'angle measurement', 'reticle', 'cross-hair', 'collimator', 'flatness', 'straightness', 'squareness', 'polygon', 'mirror polygon', 'wedge angle', 'electronic autocollimator', 'tilt measurement', 'surface plate', 'angle standard'],
  prereq: ['plane-mirror-images', 'focal-length-and-optical-power', 'measuring-focal-length-and-radius'],
  related: ['alignment-telescopes-and-lasers', 'prism-types', 'optical-windows', 'testing-optics-with-fringes', 'aligning-an-optical-system', 'interferometers-in-precision-engineering', 'the-airy-disk', 'resolution-limits'],
  body: `
An **autocollimator** measures very small angles. It is a telescope that carries its own light source and a cross-hair (the **reticle**) in the focal plane of its objective, so it sends out a parallel beam, the cross-hair imaged at infinity, and looks back along the same path. Hold a flat mirror square in front of it and the beam returns; the objective brings it to a focus on the reticle plane and the instrument sees the image of its own cross-hair, sitting exactly on the cross-hair. Tilt the mirror and the image slides away.

### Why the reading is 2fθ
Tilting a mirror by $\\theta$ turns the reflected ray by $2\\theta$. A parallel beam arriving at the objective at an angle $\\alpha$ is focused a distance $f\\tan\\alpha \\approx f\\alpha$ from the axis, so the returned image is displaced by
$$\\Delta = 2 f \\theta$$
With $f = 300$ mm, a mirror tilt of one arc-second (4.85 µrad) moves the image by 2.9 µm. Two things follow. The reading depends on tilt only: slide the mirror sideways or along the beam and nothing changes, provided it still catches the beam. And the factor 2 is a free gain: the angle is doubled before the lens does anything.

### What sets the limits
- **Diffraction.** A beam of diameter $D$ cannot show structure finer than about $1.22\\lambda/D$: 2.8″ for $D = 50$ mm at 550 nm. That is the blur; the *centre* of the blur can be found much better.
- **The detector.** On a camera with 5 µm pixels and $f = 300$ mm one pixel is 1.7″ of mirror tilt. Locating the centre of the spot to a hundredth of a pixel gives 0.017″: resolution of fractions of an arc-second needs sub-pixel centroiding, not finer pixels.
- **Range.** The image must stay on the detector. A 6 mm sensor at $f = 300$ mm allows ±3 mm, which is ±5 mrad (±17′) of mirror tilt. A longer focal length gives more micrometres per arc-second and less range.
- **Air.** Over a path of metres, thermal gradients and draughts bend the beam and the image dances; short paths and still air matter more than the electronics.

A visual instrument reads a micrometer-driven reticle to about an arc-second; electronic ones, with a CCD or CMOS sensor, display two axes and resolve a fraction of one.

### What it measures
- **Flatness and straightness.** Slide a mirror on a foot of length $L$ along a surface plate or machine slide in steps of one foot. The change in reading from step to step is the tilt $\\theta_i$, and the height change is $h_i = L\\,\\theta_i$. A 150 mm foot and a 2″ change is 1.45 µm; adding the steps gives the profile.
- **Squareness and right angles**, with a reference square or a pentaprism, which turns a beam through 90° whatever its tilt ([[prism-types]]).
- **Angle standards:** a precision mirror polygon (for instance 12 faces, 30° apart) or an indexing table is read face by face, the autocollimator showing only the small error from the nominal step.
- **Wedge in windows and prisms.** The front and back surfaces of a window give two returned images. A wedge $\\alpha$ in glass of index $n$ separates them by $2n\\alpha$: a 1′ wedge in $n = 1.5$ gives 180″.
- **Centring lenses.** A lens turned on a spindle shows an image from each surface; a surface whose image moves in a circle is off the axis.

> [!key] A mirror tilt θ moves the returned image by 2fθ. The reading depends on tilt only, so an autocollimator turns angles of arc-seconds into micrometres on a detector.
`,
  ideas: [
    'An autocollimator is a collimator and a telescope sharing one objective: the reticle is both the source and the screen.',
    'A mirror tilt θ turns the return beam by 2θ and displaces the image by Δ = 2fθ: 2.9 µm per arc-second at f = 300 mm.',
    'Only tilt counts: moving the mirror sideways or along the beam does not change the reading.',
    'The resolution comes from locating the centre of the spot to a small fraction of a pixel, not from the diffraction blur.',
    'Flatness is a sum: each foot-length step with tilt θ changes the height by L·θ.'
  ],
  pitfalls: [
    'An autocollimator measures distance — It measures angle only. The distance from the mirror does not enter, which is exactly why it is so useful for straightness (the steps are summed from angles).',
    'The image moves by fθ — Because the mirror doubles the angle, the image moves by 2fθ. A scale calibrated in mirror angle already includes the factor 2.',
    'A longer focal length is always better — It gives more micrometres per arc-second but, for a detector of fixed size, a smaller range of angle; and a long instrument is harder to hold steady.',
    'Any mirror will do — A mirror that is not flat adds its own errors, and one smaller than the beam clips it and makes the spot an unpredictable shape.'
  ],
  terms: [
    { term: 'Autocollimator', def: 'An instrument that projects a parallel beam from a reticle and receives its reflection from a mirror in the same objective, so that tilts of the mirror of arc-seconds can be read from the displacement of the returned reticle image.' },
    { term: 'Reticle', also: ['cross-hair', 'graticule'], def: 'A cross, scale or pattern at the focal plane of an instrument, used as the source in an autocollimator and as the reference against which the returned image is read.' },
    { term: 'Collimated beam', def: 'A beam whose rays are parallel (a plane wave): the image of a source at infinity, or of a point in the focal plane of a lens.' },
    { term: 'Arc-second', also: ['arcsecond', '″', 'arcsec'], def: 'One 3600th of a degree: 4.848 microradians, or 1 µm of height over 0.2 m of length.' },
    { term: 'Mirror polygon', def: 'A precision prism with mirror-polished sides at equal angles (12 faces of 30°, for instance) used as an angle standard with an autocollimator.' },
    { term: 'Wedge angle', def: 'The small angle between the two faces of a window, prism or plate that should be parallel; in an autocollimator its two reflections return at an angle of 2nα, with n the refractive index of the glass.' }
  ],
  formulas: [
    {
      name: 'Displacement of the returned image',
      expr: 'dx = 2*f*th', tex: '\\Delta x = 2 f \\theta',
      vars: {
        dx: { name: 'displacement of the image on the detector', q: 'length', unit: 'µm', tex: '\\Delta x' },
        f: { name: 'focal length of the objective', q: 'length', unit: 'mm', value: 300, tex: 'f' },
        th: { name: 'tilt of the mirror', q: 'angle', unit: '″', value: 1, tex: '\\theta' }
      },
      note: 'Small angles. The factor 2 is the doubling of the angle on reflection.',
      stories: { dx: 'A mirror in front of an autocollimator of focal length {f} is tilted by {th}. How far does the image move on the detector?', th: 'An autocollimator of focal length {f} sees the image move by {dx}. By what angle has the mirror tilted?' }
    },
    {
      name: 'Height step of a flatness measurement',
      expr: 'h = L*th', tex: 'h = L\\,\\theta',
      vars: {
        h: { name: 'height difference between the two ends of the foot', q: 'length', unit: 'µm', tex: 'h' },
        L: { name: 'length of the mirror\'s foot', q: 'length', unit: 'mm', value: 150, tex: 'L' },
        th: { name: 'change in tilt between two stations', q: 'angle', unit: '″', value: 2, tex: '\\theta' }
      },
      note: 'Add the steps along the surface to build up the profile.',
      stories: { h: 'A mirror on a {L} foot is moved one step along a slide and the autocollimator reading changes by {th}. By how much does the surface rise or fall over that step?' }
    },
    {
      name: 'Two images from a wedge',
      expr: 'dl = 2*n*a', tex: '\\delta = 2\\,n\\,\\alpha',
      vars: {
        dl: { name: 'angle between the two returned images', q: 'angle', unit: '″', tex: '\\delta' },
        n: { name: 'refractive index of the glass', value: 1.5, min: 1, max: 4, tex: 'n' },
        a: { name: 'wedge angle of the window', q: 'angle', unit: '′', value: 1, tex: '\\alpha' }
      },
      note: 'Small wedge, normal incidence. The ray crosses the window twice, so the glass bends it twice.',
      stories: { dl: 'A window of index {n} has a wedge of {a}. In an autocollimator its two faces give two images. What angle separates them?' }
    },
    {
      name: 'Diffraction limit of the beam',
      expr: 'th = 1.22*lambda/D', tex: '\\theta_{\\min} = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        th: { name: 'smallest angle the beam resolves', q: 'angle', unit: '″', tex: '\\theta_{\\min}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'diameter of the beam', q: 'length', unit: 'mm', value: 50, tex: 'D' }
      },
      note: 'The width of the spot, not the accuracy with which its centre can be found.'
    }
  ],
  examples: [
    {
      title: 'How far does the spot move?',
      q: 'An electronic autocollimator has an objective of focal length 360 mm and a detector with 4.65 µm pixels. A mirror is tilted by 0.2″. How far does the image move, and how many pixels is that?',
      steps: [
        { text: 'Convert the angle: 0.2″ = 0.2 × 4.848 µrad = 0.970 µrad. Then', tex: '\\Delta x = 2 f \\theta = 2 \\times 360\\ \\mathrm{mm} \\times 0.970\\ \\mu\\mathrm{rad} = 0.70\\ \\mu\\mathrm{m}' },
        'In pixels: $0.70 / 4.65 = 0.15$ pixel.'
      ],
      a: '0.70 µm, or 0.15 pixel. Such a shift is invisible to the eye on the screen but is measurable by fitting the centre of the spot, which uses the brightness of dozens of pixels.'
    },
    {
      title: 'A bowed slide',
      q: 'A mirror on a 150 mm foot is stepped along a machine slide, eight steps in all. At each step the autocollimator reading increases by 2.0″ (the same each time). How large is each height step and how much does the slide bow in total?',
      steps: [
        { text: 'Each step changes the height by', tex: 'h = L\\,\\theta = 150\\ \\mathrm{mm} \\times 2.0 \\times 4.848\\ \\mu\\mathrm{rad} = 1.45\\ \\mu\\mathrm{m}' },
        'Eight equal steps in the same sense add up to $8 \\times 1.45 = 11.6$ µm.'
      ],
      a: 'Each step is 1.45 µm; the slide rises 11.6 µm over 1.2 m, a gentle slope or a part of a large bow. A different pattern of readings (rising, then falling) would show a hollow or a crown.'
    }
  ],
  quiz: [
    { q: 'A flat mirror in front of an autocollimator is tilted by 5″. By what angle is the returned beam turned?', choices: ['2.5″', '5″', '10″', '20″'], a: 2, why: 'Tilting a mirror by θ turns the reflected ray by 2θ, so 10″.' },
    { q: 'An autocollimator of focal length 500 mm sees a mirror tilt of 2″. How far does the image move, in micrometres?', answer: 9.7, unit: 'µm', why: '$\\Delta x = 2f\\theta = 2 \\times 500\\ \\mathrm{mm} \\times 2 \\times 4.848\\ \\mu\\mathrm{rad} = 9.7\\ \\mu\\mathrm{m}$.' },
    { q: 'The mirror is moved 20 mm sideways without being tilted. The reading changes.', a: false, why: 'Only the tilt of the mirror enters; a collimated beam returns to the same point on the reticle whichever part of the mirror reflects it, as long as the mirror still catches the beam.' },
    { q: 'A window of index 1.5 has a wedge of 30″. By what angle in arc-seconds do its two faces separate the returned images?', answer: 90, why: '$\\delta = 2n\\alpha = 2 \\times 1.5 \\times 30″ = 90″$.' },
    { q: 'Why does a longer-focus autocollimator give a bigger reading for the same tilt, and what does it cost?', choices: ['Δ = 2fθ grows with f; for a given detector it also shrinks the range of angle', 'It does not: the reading is independent of f', 'It reduces diffraction at no cost', 'It lets the mirror be smaller'], a: 0, why: 'The displacement is proportional to the focal length. The detector has a fixed length, so the largest measurable angle goes as 1/f.' }
  ],
  applications: [
    'Machine-tool building: the straightness and flatness of beds, slides and surface plates are measured with a mirror carried on a foot and read step by step.',
    'Angle calibration: mirror polygons and rotary or indexing tables are checked face by face against their nominal angles.',
    'Optical workshops: the wedge of windows and the angle between prism faces, and the centring of lenses by watching reflections from their surfaces as they turn.',
    'Alignment of long structures and instruments: telescopes, accelerators and laser cavities are brought into line against an autocollimating telescope ([[alignment-telescopes-and-lasers]]).',
    'Calibration of gyroscopes and platforms: the tilt of a mounting surface is monitored while the unit is turned.'
  ],
  sources: [
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the optical workshop uses of collimators and autocollimators, including wedge and angle measurement.',
    'W. J. Smith, *Modern Optical Engineering* — collimators and the testing of optical elements and systems.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the reflection from a plane mirror and the doubling of the angle.'
  ],
  sim: 'mt-autocollimator'
},

/* ================================================================ interferometers */
{
  id: 'testing-surfaces-with-interferometers', parent: 'optical-metrology', title: 'Testing surfaces with interferometers', level: 3,
  short: 'An interferometer compares a surface with a reference by interference: one fringe is λ/2 of surface height, and a camera sees the whole surface at once. The Fizeau layout puts a reference flat in front of the test piece in a collimated laser beam; the Twyman–Green layout is a Michelson for lenses and mirrors. Phase shifting turns the fringes into a height map with nanometre repeatability, quoted as peak-to-valley and RMS.',
  keywords: ['interferometer', 'Fizeau interferometer', 'Twyman–Green interferometer', 'transmission flat', 'transmission sphere', 'reference flat', 'phase-shifting interferometry', 'PSI', 'fringe', 'surface figure', 'peak-to-valley', 'PV', 'RMS', 'surface error', 'test plate', 'optical flat', 'cavity', 'interferogram', 'phase unwrapping', 'lambda/10', 'HeNe laser'],
  prereq: ['michelson-interferometer', 'newtons-rings-and-wedge-fringes', 'coherence'],
  related: ['testing-optics-with-fringes', 'surface-quality-and-flatness', 'wavefront-sensors', 'wavefront-error-and-zernike-polynomials', 'making-optics', 'optical-windows', 'aspheric-surfaces', 'interferometers-in-precision-engineering', 'mirrors-as-components'],
  body: `
How flat is a mirror that has to be flat to a few tens of nanometres across 100 mm? A ruler cannot say, a micrometer cannot say, but light can: its wavelength is the ruler and an interferometer reads it to a thousandth. This page is about the instruments; how to read a fringe pattern by eye is on [[testing-optics-with-fringes]].

### The Fizeau layout
A frequency-stabilized helium–neon laser (632.8 nm, a coherence length of many metres) is expanded and collimated. In front of the test surface stands a **transmission flat**: a very flat window whose last face is the *reference* and reflects about 4 % of the beam. The remaining light goes on, is reflected by the test surface across a gap (the **cavity**) of a few millimetres to a metre, and comes back. The two returned beams meet, and a lens images the test surface on a camera. Both beams travel nearly the same path, so vibration and air currents shake both together, which is why the Fizeau interferometer works on a factory floor. A **transmission sphere** in place of the flat tests spherical surfaces: its last face is a reference sphere, and the test surface sits at its centre of curvature.

### The Twyman–Green layout
A Michelson interferometer fed with a collimated beam. The test piece goes in one arm (a flat mirror, a prism, or a lens followed by a spherical mirror that returns the light along its path) and a reference mirror in the other. Separate arms give freedom to test lenses in transmission and large or odd shapes, at the price of sensitivity to vibration.

### From fringes to a number
Light goes to the surface and back, so a height error $h$ changes the path by $2h$ and the phase by $\\phi = 4\\pi h/\\lambda$. **One fringe is therefore $\\lambda/2$ of surface height**: 316 nm at 632.8 nm. The camera sees bright and dark contour lines; the software wants the phase at every pixel.

**Phase-shifting interferometry** gets it by moving the reference a quarter-wave of phase at a time with a piezo and recording four frames,
$$I_k = A + B\\cos(\\phi + k\\,\\pi/2),\\qquad \\phi = \\operatorname{atan2}(I_4 - I_2,\\; I_1 - I_3)$$
with $k = 1 \\ldots 4$ and the offset $A$ and contrast $B$ both cancelling. The phase is found modulo $2\\pi$, so the height is known modulo $\\lambda/2$ and must be **unwrapped**: a step between neighbouring pixels of more than $\\lambda/4$ is ambiguous. The result is a height map with repeatability of a nanometre or better.

| Surface grade (632.8 nm) | PV surface error | RMS (about PV/5) |
|---|---|---|
| λ/4 | 158 nm | 32 nm |
| λ/10 | 63 nm | 13 nm |
| λ/20 | 32 nm | 6 nm |
| λ/50 | 13 nm | 2.5 nm |

**PV** is the highest minus the lowest point and is decided by a single speck; **RMS** is the root-mean-square deviation and is stable. Software usually removes piston and tilt before it reports either.

### What the number is worth
The interferometer measures the *difference* between test and reference. A λ/20 flat cannot certify a λ/50 surface. The cavity also holds air that shimmers, the mount squeezes the glass, and dust makes ring patterns; averaging many frames, a stiff mount and a still room matter as much as the laser.

> [!key] One fringe is λ/2 of surface height. Four frames shifted by a quarter-wave turn the fringes into a height map; the answer is limited by the reference, the air and the mount, not by the arithmetic.
`,
  ideas: [
    'In reflection, a height error h changes the phase by 4πh/λ: one fringe is λ/2 of surface height (316 nm at 632.8 nm).',
    'Fizeau: reference flat and test surface share almost the whole path, so vibration and air disturb both equally.',
    'Twyman–Green: a Michelson with a collimated beam, flexible for lenses and prisms but sensitive to vibration.',
    'Phase shifting records four frames a quarter-wave of phase apart and finds φ = atan2(I₄ − I₂, I₁ − I₃) at every pixel.',
    'The measured error is the difference from the reference: the reference sets the limit.'
  ],
  pitfalls: [
    'More fringes means a worse surface — Tilt adds straight fringes to any surface. Software subtracts tilt (and piston); only the bending of the fringes measures the form error.',
    'One fringe is a whole wavelength of surface error — In reflection the light goes there and back, so one fringe is half a wavelength of surface height.',
    'The interferometer reads the test surface alone — It reads test minus reference, plus the air in the cavity and any stress from the mount. A λ/20 reference cannot prove a λ/50 surface.',
    'Phase shifting measures any height — The phase is known only modulo 2π: a step between neighbouring pixels above λ/4 is ambiguous. Steep or stepped surfaces need other methods.'
  ],
  terms: [
    { term: 'Fizeau interferometer', def: 'An interferometer in which a reference surface in front of the test surface reflects part of a collimated laser beam; the two reflected beams interfere. The test and reference paths almost coincide, which makes it robust against vibration.' },
    { term: 'Twyman–Green interferometer', def: 'A Michelson interferometer used with a collimated beam to test lenses, prisms and mirrors in transmission or reflection; the test piece sits in one arm.' },
    { term: 'Transmission flat', also: ['reference flat', 'transmission sphere'], def: 'A precisely polished window (or sphere) whose last surface acts as the reference in a Fizeau interferometer; the beam passes through it and a few per cent reflects back from the reference face.' },
    { term: 'Cavity', def: 'The gap between the reference surface and the test surface of a Fizeau interferometer, in which the two beams travel separately.' },
    { term: 'Phase-shifting interferometry', also: ['PSI'], def: 'Recording several interferograms while the reference phase is stepped by a fraction of a wave (typically 90°) and computing the phase at each pixel, which gives a height map to a small fraction of a nanometre in repeatability.' },
    { term: 'Phase unwrapping', def: 'Adding whole multiples of 2π (λ/2 of height) to the measured phase so that neighbouring pixels differ by less than half a fringe, giving a continuous surface.' },
    { term: 'Peak-to-valley and RMS', also: ['PV', 'RMS'], def: 'Two summaries of a surface error: PV is the difference between the highest and lowest points; RMS is the root-mean-square deviation from the mean (or the best-fit plane), usually about one fifth of PV for polished optics.' }
  ],
  formulas: [
    {
      name: 'Surface height from a fringe shift',
      expr: 'h = N*lambda/2', tex: 'h = \\frac{N\\,\\lambda}{2}',
      vars: {
        h: { name: 'surface height error', q: 'length', unit: 'nm', tex: 'h' },
        N: { name: 'fringe shift (a fraction of the fringe spacing)', value: 0.3, min: 0, max: 100, tex: 'N' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'Reflection test at normal incidence: one whole fringe is half a wavelength of surface height.',
      stories: { h: 'A flat shows fringes that bend by {N} of the fringe spacing in light of {lambda}. By how much does the surface depart from flat?' }
    },
    {
      name: 'Height from the phase',
      expr: 'h = lambda*phi/(4*pi)', tex: 'h = \\frac{\\lambda\\,\\phi}{4\\pi}',
      vars: {
        h: { name: 'surface height', q: 'length', unit: 'nm', tex: 'h' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        phi: { name: 'phase of the fringe', q: 'angle', unit: '°', value: 60, min: 0, max: 360, tex: '\\phi' }
      },
      note: 'A phase of 360° (one fringe) is λ/2 of height; the phase is known only modulo 360°.',
      stories: { h: 'A pixel of a phase-shifting interferometer reports a phase of {phi} at {lambda}. How high is the surface there, modulo half a wavelength?' }
    }
  ],
  examples: [
    {
      title: 'How flat is this flat?',
      q: 'A flat tested at 632.8 nm shows fringes that bow by 0.3 of the fringe spacing. What is its peak-to-valley error, and which grade is it?',
      steps: [
        { text: 'One fringe is half a wavelength of height:', tex: 'h = 0.3 \\times \\frac{632.8}{2}\\ \\mathrm{nm} = 95\\ \\mathrm{nm}' },
        'In wavelengths: $632.8 / 95 = 6.7$, so the surface is flat to about $\\lambda/6.7$: better than $\\lambda/4$ (158 nm), not as good as $\\lambda/10$ (63 nm).'
      ],
      a: '95 nm PV, about λ/7: a λ/4 grade surface, one with room to improve.'
    },
    {
      title: 'Four frames, one phase',
      q: 'At one pixel the four frames of a phase-shifting interferometer read 125, 56.7, 75 and 143.3 (arbitrary units). What are the phase and the surface height at 632.8 nm?',
      steps: [
        { text: 'Take the differences, which remove the offset $A$:', tex: 'I_4 - I_2 = 86.6 = 2B\\sin\\phi \\qquad I_1 - I_3 = 50 = 2B\\cos\\phi' },
        'So $\\phi = \\operatorname{atan2}(86.6, 50) = 60°$ and $B = 50$.',
        { text: 'The height:', tex: 'h = \\frac{\\lambda\\phi}{4\\pi} = \\frac{632.8 \\times 60/360}{2}\\ \\mathrm{nm} = 52.7\\ \\mathrm{nm}' }
      ],
      a: 'Phase 60°, height 52.7 nm (modulo 316.4 nm). The offset 100 and the contrast 50 never entered the answer, which is why the method tolerates uneven illumination.'
    }
  ],
  quiz: [
    { q: 'In a Fizeau test of a flat at normal incidence, how much surface height does one fringe represent?', choices: ['λ/4', 'λ/2', 'λ', '2λ'], a: 1, why: 'The light goes to the surface and back, so a height $h$ changes the path by $2h$; one fringe is a path change of one wavelength, hence $h = \\lambda/2$.' },
    { q: 'A Fizeau interferometer is less affected by vibration than a Twyman–Green because the two beams share almost the same path.', a: true, why: 'A vibration or a draught moves reference and test beams together and cancels in the difference. In a Twyman–Green the two arms are separate.' },
    { q: 'A flat shows fringes bowed by a quarter of the fringe spacing at 632.8 nm. What is the surface error in nanometres?', answer: 79, unit: 'nm', why: '$h = 0.25 \\times 632.8/2 = 79$ nm, that is $\\lambda/8$.' },
    { q: 'A test flat is certified λ/50 using a reference flat of grade λ/20. What is wrong?', choices: ['The measurement shows test minus reference, so the reference\'s own error limits what can be claimed', 'Nothing: the reference does not matter', 'The wavelength is wrong', 'λ/20 is better than λ/50'], a: 0, why: 'The instrument sees the difference between the two surfaces. A reference with a 32 nm PV error cannot prove that the test surface has only 13 nm.' },
    { q: 'Why can phase-shifting interferometry not give the height of a 1 µm step between two neighbouring pixels directly?', choices: ['The phase is known only modulo 2π, so heights are ambiguous by λ/2 (316 nm)', 'Four frames are not enough', 'The laser is too coherent', 'Piezos move only 100 nm'], a: 0, why: 'A step of 1 µm is 3.2 fringes; the phase repeats every fringe, so the software cannot tell 1 µm from 0.68 µm without extra information such as a second wavelength.' }
  ],
  applications: [
    'Optical workshops: the last test of flats, mirrors and spheres before coating; results quoted as PV and RMS at 632.8 nm.',
    'Laser mirrors and windows: a few nanometres of surface error keep a laser beam from being distorted.',
    'Semiconductor and disk industries: flatness of wafers, masks and substrates.',
    'Lens assemblies: a Twyman–Green set-up measures the transmitted wavefront of a finished lens or objective.',
    'Aspheric surfaces: a null lens or a computer-generated hologram cancels the expected shape so the remaining fringes show only the error ([[aspheric-surfaces]]).'
  ],
  history: 'Fizeau used interference fringes to compare surfaces in the 1860s. The Twyman–Green layout, a Michelson interferometer for testing lenses and prisms, dates from 1916 (Frank Twyman and Arthur Green). Digital phase-shifting interferometers, which replaced the photographs and the counting of fringes, appeared in the early 1970s at Bell Laboratories.',
  sources: [
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the chapters on Fizeau and Twyman–Green interferometers and on phase-shifting interferometry.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 (Elements of the theory of interference and interferometers).',
    'ISO 14999, *Optics and photonics — Interferometric measurement of optical elements and optical systems* — the practice of measuring form with an interferometer.',
    'ISO 10110-5, *Optical drawings — Surface form tolerances* — how form error in fringes is specified on a drawing.'
  ],
  sim: 'mt-interferometer'
},

/* ================================================================ wavefront sensors */
{
  id: 'wavefront-sensors', parent: 'optical-metrology', title: 'Wavefront sensors', level: 3,
  short: 'A wavefront sensor measures the shape of a light wave directly. In the Shack–Hartmann sensor an array of small lenses focuses a beam into a grid of spots; a spot moves by the local slope of the wavefront times the lenslet focal length, and the map of slopes is integrated into the wavefront. Curvature, pyramid and shearing sensors are other ways to the same map.',
  keywords: ['wavefront sensor', 'Shack–Hartmann', 'Hartmann', 'lenslet array', 'microlens array', 'spot displacement', 'centroid', 'wavefront slope', 'curvature sensor', 'pyramid sensor', 'shearing interferometer', 'Zernike', 'aberrometer', 'adaptive optics', 'wavefront reconstruction', 'dynamic range', 'beam quality'],
  prereq: ['wavefront-error-and-zernike-polynomials', 'rays-and-wavefronts', 'testing-surfaces-with-interferometers'],
  related: ['microlens-arrays', 'autorefractors-and-aberrometers', 'astronomical-observatories-and-adaptive-optics', 'strehl-ratio-and-diffraction-limited', 'testing-optics-with-fringes', 'the-point-spread-function', 'spatial-light-modulators'],
  body: `
Rays are lines that run perpendicular to the wavefront, so if you know the direction of the rays at many points across a beam you know the slope of its wavefront there; add the slopes up and you have its shape. A **wavefront sensor** does exactly that, without the reference beam and the fringes of an interferometer, and so it works on white light, on a beam from a laser, on light from a star or from an eye.

### The Shack–Hartmann sensor
Put a regular array of small lenses (the **lenslet array**) in the beam, and a camera at their common focal plane. Each lenslet makes its own image of the source: a grid of spots. If the wavefront were a perfect plane wave, every spot would sit on the axis of its lenslet. Where the wavefront is tilted locally by a slope $\\alpha = \\partial W/\\partial x$, the lenslet's spot moves sideways by
$$\\Delta x = f_\\ell\\,\\alpha$$
with $f_\\ell$ the focal length of a lenslet. The software finds the centre of each spot (the **centroid**), subtracts its reference position, and obtains a map of slopes in $x$ and $y$. It then reconstructs the wavefront, either by integrating the slopes cell to cell (**zonal**) or by fitting [[wavefront-error-and-zernike-polynomials|Zernike polynomials]] to them (**modal**). Piston, an overall constant, is not measured and does not matter.

### The numbers
A typical lenslet array has a pitch $p = 150$ µm and a focal length of 5 mm; the camera has 5 µm pixels.
- **Sensitivity.** A centroid good to 0.02 pixel is a shift of 0.1 µm, a slope of 20 µrad, which is a change of wavefront of only 3 nm across one lenslet.
- **Dynamic range.** A spot must stay within its own lenslet's square, so the largest slope is $p/2f_\\ell = 15$ mrad: a tilt of 3.6 wavelengths (at 632.8 nm) across one lenslet.
- **The trade-off.** A longer lenslet focal length multiplies the shift, so it improves sensitivity, and cuts the range in proportion. Fewer, larger lenslets give a wider range and coarser sampling of the pupil.

### Other kinds
- **Curvature sensor.** Compare the intensity in two planes, one before and one after the focus: where the wavefront is more convex or concave the light is bunched or spread, and the difference of the two pictures is proportional to the local curvature. Adaptive optics uses it with deformable mirrors that bend by curvature.
- **Pyramid sensor.** A glass pyramid with its tip at the focus splits the beam into four copies of the pupil; the brightness differences between them give the slopes, with a sensitivity that can be tuned.
- **Shearing interferometer.** The wave interferes with a copy of itself shifted sideways; the fringes show the slope. It needs no reference wave.

### Why it matters
The sensor must see the *pupil* of the system under test, relayed onto the lenslets. The Maréchal rule turns a measured RMS wavefront error $\\sigma$ (in waves) into the peak brightness of the image, $S \\approx e^{-(2\\pi\\sigma)^2}$ (the Strehl ratio): $\\sigma = \\lambda/14$ gives 0.82.

> [!key] A lenslet turns the local slope of the wavefront into a spot shift, Δx = f·α. Measure the shifts, integrate, and the wave's shape follows, with sensitivity bought at the price of range.
`,
  ideas: [
    'The slope of a wavefront is the direction of the rays: measure directions at many points and integrate to get the shape.',
    'In a Shack–Hartmann sensor each lenslet focuses its part of the beam to a spot that moves by Δx = f·α, with α the local slope.',
    'The centroid of each spot can be found to a hundredth of a pixel, so slopes of tens of microradians are measurable.',
    'Sensitivity and dynamic range trade against each other through the lenslet focal length.',
    'Curvature and pyramid sensors use intensities instead of spot positions; shearing interferometers use fringes.'
  ],
  pitfalls: [
    'A wavefront sensor measures the phase directly — It measures slopes (or curvature) and the phase is reconstructed by integration; the constant piston is lost and noise in the slopes accumulates in the map.',
    'More lenslets always improve the measurement — Smaller lenslets sample the pupil more finely but give each spot less light and a larger diffraction blur, so the centroid is less accurate; the choice is a compromise.',
    'The sensor can be put anywhere behind the optic — It samples the beam in its own plane. To measure the wavefront in the exit pupil of a lens or eye, that pupil must be imaged onto the lenslet array.',
    'The range is set by the camera — It is set by the lenslet geometry, p/2f; a spot that leaves its lenslet\'s square is confused with its neighbour\'s.'
  ],
  terms: [
    { term: 'Shack–Hartmann sensor', also: ['Hartmann–Shack sensor', 'SHWFS'], def: 'A wavefront sensor made of a lenslet array and a camera at its focal plane; the displacement of each spot from its reference position measures the local slope of the wavefront.' },
    { term: 'Lenslet array', also: ['microlens array'], def: 'A regular grid of small lenses (a pitch of 100 to 500 µm is typical for sensors) all of the same focal length.' },
    { term: 'Centroid', also: ['spot centre'], def: 'The intensity-weighted centre of a spot, found from the brightness of many pixels; it can be located to a small fraction of one pixel.' },
    { term: 'Wavefront reconstruction', also: ['zonal reconstruction', 'modal reconstruction'], def: 'Computing the wavefront from measured slopes, either by integrating them from cell to cell (zonal) or by fitting a set of polynomials such as the Zernike series (modal).' },
    { term: 'Curvature sensor', def: 'A wavefront sensor that compares the intensity in two planes on either side of the focus; the difference is proportional to the local curvature of the wavefront.' },
    { term: 'Pyramid wavefront sensor', def: 'A sensor in which a four-sided glass pyramid at the focus splits the beam into four images of the pupil; the intensity differences give the slopes of the wavefront.' }
  ],
  formulas: [
    {
      name: 'Spot displacement',
      expr: 'dx = fl*al', tex: '\\Delta x = f_\\ell\\,\\alpha',
      vars: {
        dx: { name: 'displacement of the spot', q: 'length', unit: 'µm', tex: '\\Delta x' },
        fl: { name: 'focal length of a lenslet', q: 'length', unit: 'mm', value: 5, tex: 'f_\\ell' },
        al: { name: 'local slope of the wavefront', q: 'angle', unit: 'µrad', value: 20, tex: '\\alpha' }
      },
      note: 'Small slopes. The spot moves in the direction of the slope.',
      stories: { dx: 'Part of a beam has a wavefront slope of {al} over one lenslet of focal length {fl}. How far does its spot move?', al: 'A lenslet of focal length {fl} shows a spot shifted by {dx}. What is the local slope of the wavefront?' }
    },
    {
      name: 'Largest slope a sensor can measure',
      expr: 'am = p/(2*fl)', tex: '\\alpha_{\\max} = \\frac{p}{2 f_\\ell}',
      vars: {
        am: { name: 'largest measurable slope', q: 'angle', unit: 'mrad', tex: '\\alpha_{\\max}' },
        p: { name: 'lenslet pitch', q: 'length', unit: 'µm', value: 150, tex: 'p' },
        fl: { name: 'focal length of a lenslet', q: 'length', unit: 'mm', value: 5, tex: 'f_\\ell' }
      },
      note: 'The spot must stay inside its own lenslet\'s square, a distance p/2 from the axis at most.'
    },
    {
      name: 'Wavefront change across one lenslet',
      expr: 'W = al*p', tex: '\\Delta W = \\alpha\\,p',
      vars: {
        W: { name: 'change of the wavefront across one lenslet', q: 'length', unit: 'nm', tex: '\\Delta W' },
        al: { name: 'slope of the wavefront', q: 'angle', unit: 'µrad', value: 20, tex: '\\alpha' },
        p: { name: 'lenslet pitch', q: 'length', unit: 'µm', value: 150, tex: 'p' }
      },
      note: 'How small a step of the wavefront the sensor can see when the slope is the smallest it can detect.'
    },
    {
      name: 'Strehl ratio from the RMS error (Maréchal)',
      expr: 'S = exp(-(2*pi*sg)^2)', tex: 'S \\approx e^{-(2\\pi\\sigma)^2}',
      vars: {
        S: { name: 'Strehl ratio (peak brightness over the ideal)', tex: 'S' },
        sg: { name: 'RMS wavefront error in waves', value: 0.07, min: 0, max: 0.3, tex: '\\sigma' }
      },
      note: 'Good for small errors (S above about 0.5). σ = 1/14 wave gives 0.82, the traditional "diffraction-limited" criterion.',
      stories: { S: 'An optical system has an RMS wavefront error of {sg} of a wavelength. What is its Strehl ratio?' }
    }
  ],
  examples: [
    {
      title: 'Designing a sensor',
      q: 'A Shack–Hartmann sensor has a lenslet pitch of 150 µm, a lenslet focal length of 5 mm and pixels of 5 µm. Centroids are good to 0.02 pixel. What are its smallest slope, the wavefront step across one lenslet that this corresponds to, and its largest slope?',
      steps: [
        'The smallest spot shift is $0.02 \\times 5\\ \\mu\\mathrm{m} = 0.1\\ \\mu\\mathrm{m}$, a slope $0.1\\ \\mu\\mathrm{m} / 5\\ \\mathrm{mm} = 20\\ \\mu\\mathrm{rad}$.',
        { text: 'Across one pitch that slope is a wavefront change of', tex: '\\Delta W = \\alpha p = 20\\ \\mu\\mathrm{rad} \\times 150\\ \\mu\\mathrm{m} = 3.0\\ \\mathrm{nm}' },
        { text: 'The largest slope keeps the spot inside its square:', tex: '\\alpha_{\\max} = \\frac{p}{2f_\\ell} = \\frac{150\\ \\mu\\mathrm{m}}{10\\ \\mathrm{mm}} = 15\\ \\mathrm{mrad}' }
      ],
      a: '20 µrad (a step of 3 nm, about λ/200), up to 15 mrad: a range of 750 times the smallest slope. Halving the lenslet focal length would double the range and halve the sensitivity.'
    },
    {
      title: 'How bright is the image?',
      q: 'The sensor measures an RMS wavefront error of 0.10 wave. What is the Strehl ratio?',
      steps: [
        { text: 'Maréchal\'s approximation:', tex: 'S \\approx e^{-(2\\pi\\sigma)^2} = e^{-(0.628)^2} = e^{-0.395}' },
        'This is 0.67.'
      ],
      a: 'S ≈ 0.67: the image is a third dimmer at its peak than a perfect one, and the system is not diffraction-limited by the usual criterion (S > 0.8).'
    }
  ],
  quiz: [
    { q: 'In a Shack–Hartmann sensor a spot moves by 10 µm for a lenslet of focal length 5 mm. What is the local wavefront slope?', choices: ['2 mrad', '50 µrad', '0.5 rad', '2 µrad'], a: 0, why: '$\\alpha = \\Delta x / f_\\ell = 10\\ \\mu\\mathrm{m}/5\\ \\mathrm{mm} = 2\\times 10^{-3}$ rad = 2 mrad.' },
    { q: 'Changing to lenslets of twice the focal length (same pitch), the sensor becomes…', choices: ['twice as sensitive and has half the range', 'half as sensitive and has twice the range', 'twice as sensitive and twice the range', 'unchanged'], a: 0, why: 'The spot shift for a given slope doubles, so smaller slopes show up; but the largest slope $p/2f_\\ell$ halves.' },
    { q: 'A Shack–Hartmann sensor measures the absolute position of the wavefront (its piston).', a: false, why: 'It sees only slopes; the average phase of the wave has no effect on the spots and is lost. Piston does not change the image either.' },
    { q: 'What is the Strehl ratio, by Maréchal\'s formula, of a system with an RMS wavefront error of $\\lambda/14$ (σ = 0.0714)?', answer: 0.82, why: '$S = e^{-(2\\pi \\times 0.0714)^2} = e^{-0.2012} = 0.82$.' },
    { q: 'Which statement about a pyramid wavefront sensor is correct?', choices: ['It splits the focused beam into four pupil images whose brightness differences give the slopes', 'It uses a lenslet array and a camera at its focal plane', 'It needs a coherent reference beam', 'It measures piston directly'], a: 0, why: 'The pyramid with its tip at the focus sends light into four directions according to the local slope; no reference wave is needed.' }
  ],
  applications: [
    'Eye examination: aberrometers measure the whole eye\'s wavefront through the pupil and give the Zernike terms ([[autorefractors-and-aberrometers]]).',
    'Adaptive optics: telescopes measure the blur caused by the atmosphere with a wavefront sensor and correct it hundreds of times a second with a deformable mirror ([[astronomical-observatories-and-adaptive-optics]]).',
    'Laser beam diagnostics: the wavefront and beam quality of a laser are checked with a Shack–Hartmann sensor (the subject of ISO 15367).',
    'Testing lenses: a collimated beam through a lens, or the light from a point source, is measured at the exit pupil.',
    'Alignment of large telescopes and of space optics, where interferometers are impractical.'
  ],
  history: 'Johannes Hartmann at Potsdam tested telescope mirrors in 1900 by placing a screen with holes in front of them and photographing where each small pencil of rays crossed a plane. Roland Shack and Ben Platt replaced the screen with an array of lenslets around 1970, which gave a brighter, more efficient sensor and made the wavefront measurable on an electronic camera.',
  sources: [
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the chapter on Hartmann and Shack–Hartmann tests.',
    'ISO 15367 (parts 1 and 2), *Lasers and laser-related equipment — Test methods for determination of the shape of a laser beam wavefront*.',
    'J. Porter et al. (eds), *Adaptive Optics for Vision Science* (Wiley) — wavefront sensing of the eye and the Shack–Hartmann principle.'
  ],
  sim: 'mt-shack-hartmann'
},

/* ================================================================ spectrophotometers */
{
  id: 'spectrophotometers', parent: 'optical-metrology', title: 'Spectrophotometers', level: 2,
  short: 'A spectrophotometer measures how much light a sample transmits or reflects at each wavelength. Transmittance T = I/I₀ is turned into absorbance A = −log₁₀T, which is proportional to concentration and path length. Single- and double-beam designs, the spectral bandwidth of the monochromator and stray light decide how far the numbers can be trusted.',
  keywords: ['spectrophotometer', 'UV-vis', 'UV-visible', 'transmittance', 'absorbance', 'reflectance', 'Beer–Lambert law', 'cuvette', 'monochromator', 'slit', 'spectral bandwidth', 'bandwidth', 'stray light', 'single beam', 'double beam', 'diode array', 'blank', 'reference', 'integrating sphere', 'molar absorptivity', 'baseline'],
  prereq: ['transmission-and-absorption', 'spectrometers-and-monochromators', 'neutral-density-and-optical-density'],
  related: ['chemistry:beer-lambert', 'coloured-glass-filters', 'interference-filters', 'the-integrating-sphere', 'spectroscopy-in-industry', 'optical-sorting-and-colour-measurement', 'grating-spectrometers-and-resolving-power', 'how-a-pixel-detects-light'],
  body: `
Hold a glass of tea against a window and you have made a spectrophotometer of the simplest sort: light goes through a sample and the eye judges how much is left. The instrument does the same with one wavelength at a time and a number at the end. It answers two kinds of question. *How much of this substance is in the solution?* (the answer is a concentration, found from absorption), and *how well does this window, filter or coating pass or reflect light?* (the answer is a curve of transmittance or reflectance against wavelength).

### Transmittance and absorbance
The **transmittance** is the fraction of light that gets through, $T = I/I_0$, where $I_0$ is the light through a **blank** (an empty cuvette, a cuvette of solvent, or open air). The **absorbance** is
$$A = -\\log_{10} T$$
which makes numbers that add: two filters in series have the absorbances added and the transmittances multiplied. In a solution that follows the Beer–Lambert law ([[chemistry:beer-lambert|Beer–Lambert law]]), $A = \\varepsilon\\,c\\,l$: proportional to the molar absorptivity $\\varepsilon$, the concentration $c$ and the path length $l$ (10 mm for a standard cuvette).

| Absorbance | 0 | 0.3 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| Transmittance | 100 % | 50 % | 10 % | 1 % | 0.1 % |

For reflectance, an **integrating sphere** collects the light scattered by the sample and the reading is compared with a white standard ([[the-integrating-sphere]]).

### The instrument
A lamp (deuterium for 190–350 nm, tungsten-halogen from 350 to about 1100 nm) feeds a **monochromator**: an entrance slit, a grating, an exit slit. Rotating the grating sweeps the wavelength. The light crosses the sample and reaches a silicon photodiode (or a photomultiplier tube for weak light). In a **single-beam** instrument the blank and the sample are measured one after the other, so lamp drift between them goes into the answer. A **double-beam** instrument splits the light and alternately sends it through reference and sample, and takes the ratio. A **diode-array** instrument sends white light through the sample first and spreads it on an array, recording the whole spectrum in a second with no moving parts.

### Bandwidth and stray light
The exit slit lets through a band of wavelengths, the **spectral bandwidth**, 0.5 to 2 nm on a routine instrument. A feature narrower than that is smoothed, its peak lowered and widened; a common rule asks for a bandwidth of at most one tenth of the width of the narrowest band to be measured. **Stray light** is light of the wrong wavelength that reaches the detector. If it is 0.05 % of the lamp's output, a sample of true $A = 3$ (0.1 %) reads $A = 2.82$. Readings above $A \\approx 2$ to 3 bend over and cannot be believed.

Cuvettes matter: quartz passes down to about 190 nm; ordinary glass and most plastics absorb below roughly 320–350 nm. Bubbles, turbidity and fluorescence masquerade as absorbance.

> [!key] T is the fraction transmitted, A = −log₁₀T adds up and is proportional to concentration times path. Trust the reading only when the bandwidth is narrow compared with the feature and the stray light is small compared with the transmittance.
`,
  ideas: [
    'Transmittance is I/I₀ against a blank; absorbance is −log₁₀ T and equals ε·c·l for a solution that obeys Beer–Lambert.',
    'Absorbances of filters in series add; transmittances multiply: A = 0.3 passes 50 %, A = 1 passes 10 %, A = 2 passes 1 %.',
    'A double-beam instrument ratios sample against reference at every wavelength and removes lamp drift; a diode array records a whole spectrum at once.',
    'The slit sets the spectral bandwidth: a band narrower than it is lowered and broadened in the record.',
    'Stray light puts a floor under the transmittance and a ceiling on the measurable absorbance.'
  ],
  pitfalls: [
    'Absorbance is the fraction of light absorbed — That would be 1 − T. Absorbance is −log₁₀ T: A = 1 means 90 % absorbed, A = 2 means 99 %.',
    'Whatever does not pass through was absorbed — Scattering (a turbid sample), reflection at the cuvette walls and fluorescence also change the reading. The blank removes only what the blank has.',
    'A narrower slit is always better — It resolves narrow features but passes less light, so the noise rises; a bandwidth a tenth of the narrowest band is enough.',
    'Beer–Lambert holds at any concentration — It fails for strong solutions (molecular interaction, A above 1 to 2) and when stray light flattens the reading.'
  ],
  terms: [
    { term: 'Transmittance', also: ['T'], def: 'The fraction of the incident light that passes through a sample at a given wavelength, measured against a blank.' },
    { term: 'Absorbance', also: ['A', 'optical density', 'OD'], def: 'The common logarithm of the reciprocal of transmittance, A = −log₁₀ T. It is proportional to concentration and to path length for a solution that obeys the Beer–Lambert law.' },
    { term: 'Blank', also: ['reference', 'baseline', 'auto-zero'], def: 'The measurement of everything except the substance of interest (the empty beam, or a cuvette with the solvent), used as 100 % transmittance.' },
    { term: 'Spectral bandwidth', also: ['SBW', 'slit width'], def: 'The range of wavelengths (full width at half maximum) that leaves the monochromator at one setting; set by the slit widths and the dispersion of the grating.' },
    { term: 'Stray light', def: 'Light of wavelengths other than the one selected that reaches the detector; it limits the largest absorbance that can be measured.' },
    { term: 'Double-beam spectrophotometer', def: 'An instrument that sends light alternately (or by a beam splitter) through a reference path and a sample path, and takes the ratio, so that lamp and detector drift cancel.' },
    { term: 'Cuvette', def: 'A small transparent cell, usually with a 10 mm path, that holds a liquid sample in the beam; made of quartz for ultraviolet work, optical glass or plastic for the visible.' }
  ],
  formulas: [
    {
      name: 'Absorbance from transmittance',
      expr: 'A = -log(T)', tex: 'A = -\\log_{10} T',
      vars: {
        A: { name: 'absorbance', tex: 'A' },
        T: { name: 'transmittance', q: 'ratio', unit: '%', value: 10, min: 0.0001, max: 100, tex: 'T' }
      },
      note: 'Base-10 logarithm; T as a fraction (100 % = 1).',
      stories: { A: 'A filter passes {T} of the light at one wavelength. What is its absorbance there?', T: 'A sample has an absorbance of {A}. What fraction of the light does it transmit?' }
    },
    {
      name: 'Beer–Lambert law',
      expr: 'A = eps*c*l', tex: 'A = \\varepsilon\\,c\\,l',
      vars: {
        A: { name: 'absorbance', tex: 'A' },
        eps: { name: 'molar absorptivity', q: 'molarabs', unit: 'L/(mol·cm)', value: 40000, tex: '\\varepsilon' },
        c: { name: 'concentration', q: 'concentration', unit: 'µM', value: 10, tex: 'c' },
        l: { name: 'path length', q: 'length', unit: 'cm', value: 1, tex: 'l' }
      },
      note: 'Dilute solutions, one wavelength, no scattering or fluorescence. ε = 40 000 L/(mol·cm) is typical of a strong organic dye.',
      stories: { A: 'A dye of molar absorptivity {eps} is dissolved at {c} in a cuvette of path {l}. What is the absorbance?', c: 'A cuvette of path {l} holds a dye of molar absorptivity {eps} and reads an absorbance of {A}. What is its concentration?' }
    },
    {
      name: 'Absorbance read with stray light',
      expr: 'Am = -log(T + s)', tex: 'A_{\\mathrm{read}} = -\\log_{10}(T + s)',
      vars: {
        Am: { name: 'absorbance the instrument shows', tex: 'A_{\\mathrm{read}}' },
        T: { name: 'true transmittance of the sample', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 100, tex: 'T' },
        s: { name: 'stray light, as a fraction of the lamp signal', q: 'ratio', unit: '%', value: 0.05, min: 0, max: 5, tex: 's' }
      },
      note: 'Stray light adds a floor s to the signal, so the reading cannot exceed −log₁₀ s.',
      stories: { Am: 'A sample passes {T} of the light, and the instrument has {s} stray light. What absorbance does it show?' }
    }
  ],
  examples: [
    {
      title: 'How much dye?',
      q: 'A dye has a molar absorptivity of 40 000 L/(mol·cm) at 530 nm. In a 1.00 cm cuvette a solution transmits 25 % at 530 nm against a solvent blank. What is its concentration?',
      steps: [
        { text: 'Absorbance:', tex: 'A = -\\log_{10}(0.25) = 0.602' },
        { text: 'Beer–Lambert, solved for the concentration:', tex: 'c = \\frac{A}{\\varepsilon\\,l} = \\frac{0.602}{40\\,000 \\times 1.00}\\ \\mathrm{mol/L} = 1.5 \\times 10^{-5}\\ \\mathrm{mol/L}' }
      ],
      a: '15 µM. The absorbance of 0.60 is in the comfortable range (0.1 to 1.5), where a few per cent of error in $T$ gives a few per cent in $c$.'
    },
    {
      title: 'A very dark filter on a dusty instrument',
      q: 'A filter has a true transmittance of 0.10 % (absorbance 3.00). The instrument has 0.05 % stray light. What absorbance does it read?',
      steps: [
        'The detector sees the transmitted light plus the stray light: $T + s = 0.0010 + 0.0005 = 0.0015$.',
        { text: 'The instrument shows', tex: 'A_{\\mathrm{read}} = -\\log_{10}(0.0015) = 2.82' }
      ],
      a: '2.82 instead of 3.00: the filter looks 50 % more transparent than it is. At 0.01 % stray light the reading would be 2.96, which is why laboratory instruments quote their stray light at a test wavelength.'
    }
  ],
  quiz: [
    { q: 'A sample transmits 10 % of the light. What is its absorbance?', choices: ['0.1', '0.9', '1', '10'], a: 2, why: '$A = -\\log_{10}(0.10) = 1$. The 0.9 would be the fraction absorbed, 1 − T, which is not the quantity called absorbance.' },
    { q: 'Two filters with absorbances 0.3 and 0.7 are stacked. What percentage of the light passes through both?', answer: 10, unit: '%', why: 'Absorbances add: 0.3 + 0.7 = 1.0, so $T = 10^{-1} = 10\\ \\%$. Equivalently 50 % × 20 % = 10 %.' },
    { q: 'A double-beam spectrophotometer is preferred to a single-beam one mainly because…', choices: ['it cancels the drift of the lamp and the detector between reference and sample', 'it has a better grating', 'it measures two samples', 'it needs no blank'], a: 0, why: 'The ratio of sample to reference is taken continuously, so a drift in the lamp output affects both and drops out.' },
    { q: 'A sharp absorption band 3 nm wide is measured with a 20 nm spectral bandwidth. The recorded peak will be as high and as narrow as the true band.', a: false, why: 'A bandwidth much wider than the band smooths it: the recorded peak is lower and broader than the truth. A bandwidth of 0.3 nm or less would be needed.' },
    { q: 'A dye in a 1 cm cuvette reads an absorbance of 0.80 at its peak. The path is changed to 2 cm with the same solution. What absorbance should be read?', answer: 1.6, why: '$A = \\varepsilon c l$ is proportional to path length: doubling $l$ doubles $A$ to 1.60 (T from 16 % to 2.5 %).' }
  ],
  applications: [
    'Chemistry and biology laboratories: concentrations of dyes, proteins and nucleic acids from absorbance at a known wavelength, and the course of a reaction followed over time.',
    'Water testing: nitrate, phosphate and chlorine are turned into coloured compounds and measured by their absorbance.',
    'Glass and coatings: transmittance of windows, filters and anti-reflection coatings against wavelength, and reflectance of mirrors, measured with a reflectance accessory.',
    'Colour measurement: the reflectance spectrum of paint, fabric or plastic is converted to colour coordinates ([[optical-sorting-and-colour-measurement]]).',
    'Pulse oximeters: two wavelengths of red and infrared light through a finger give the proportion of oxygenated haemoglobin by the same law.'
  ],
  history: 'Pierre Bouguer (1729) and Johann Lambert (1760) found how light is weakened by a thickness of absorbing material, and August Beer (1852) added the dependence on concentration. Spectrophotometers were first built with photographic plates and then with photocells; in 1941 Arnold Beckman\'s group introduced a quartz-prism instrument with a photomultiplier that made ultraviolet spectra routine in the chemistry laboratory.',
  sources: [
    'D. A. Skoog, F. J. Holler and S. R. Crouch, *Principles of Instrumental Analysis* (Cengage) — the chapters on absorption spectrometry and its instruments.',
    'ASTM E275, *Standard Practice for Describing and Measuring Performance of Ultraviolet and Visible Spectrophotometers*.',
    'E. Hecht, *Optics*, ch. 3 — the absorption of light in matter.'
  ],
  sim: 'mt-spectrophotometer'
},

/* ================================================================ refractometers */
{
  id: 'refractometers', parent: 'optical-metrology', title: 'Refractometers', level: 2,
  short: 'A refractometer measures the refractive index of a liquid by finding the critical angle at the boundary with a prism of higher index: the border between light and dark moves as the sample\'s index changes, sin θc = nsample/nprism. Index is a fingerprint of composition, so the same instrument reads sugar (°Brix), antifreeze, salt and the purity of oils.',
  keywords: ['refractometer', 'Abbe refractometer', 'critical angle', 'refractive index', 'Brix', 'sugar content', 'handheld refractometer', 'digital refractometer', 'sample prism', 'measuring prism', 'compensator', 'sodium D line', 'nD', 'temperature compensation', 'gem refractometer', 'concentration', 'salinity', 'coolant'],
  prereq: ['critical-angle-and-total-internal-reflection', 'refractive-index', 'snells-law'],
  related: ['dispersion-and-the-spectrum', 'prism-deviation', 'fresnel-reflection', 'optical-glass', 'the-abbe-number-and-glass-map', 'prism-types', 'spectrophotometers', 'transmission-and-absorption'],
  body: `
Dip a spoon in a glass of water and in a glass of syrup: the syrup bends the light more. Refractive index grows with the amount of dissolved sugar, and with almost any change in what a liquid is made of, so measuring the index tells what is in the liquid. A **refractometer** does that, with a drop of sample and a telescope.

### The idea: look for the critical angle
Put a drop of the liquid, index $n_s$, on a prism of glass with a *higher* index $n_p$. Light from inside the liquid arrives at the boundary at every angle up to 90° (grazing). Snell's law says that the refracted angle in the prism is given by $n_s \\sin\\theta_1 = n_p\\sin\\theta_2$, so the largest angle at which light can enter the prism, from grazing incidence, is
$$\\sin\\theta_c = \\frac{n_s}{n_p}$$
Inside the prism there is light at angles below $\\theta_c$ and **darkness** above it. A telescope looking at the prism sees a field half bright, half dark, with a sharp border at $\\theta_c$. The border moves with the sample; the scale reads the index directly.

| Sample ($n_p = 1.784$, N-SF11 at 589.3 nm) | $n_s$ | Border $\\theta_c$ |
|---|---|---|
| Water | 1.333 | 48.3° |
| A liquid of index 1.40 | 1.400 | 51.7° |
| A liquid of index 1.47 | 1.470 | 55.5° |
| A liquid of index 1.70 | 1.700 | 72.3° |

The angle changes by about 0.005° for each 0.0001 of index: to read the fourth decimal, the telescope must read the border to about 17 arc-seconds. Only samples with $n_s < n_p$ can be measured: a dense-flint prism limits an instrument to about 1.30–1.70.

### The Abbe refractometer
Two prisms hinged like a book hold a thin film of liquid between them. The lower, **illuminating prism** has a ground face that scatters light into the film at all angles; the upper, **measuring prism** carries the border to the telescope. White light would colour the border because the prism's index varies with wavelength, so a pair of rotating **compensator prisms** cancels the dispersion and the border is white and sharp: the reading is the index for the sodium D line, $n_D$ (589.3 nm), whatever lamp is used. The prisms are held at 20.0 °C by circulating water, since the index of water falls by about $10^{-4}$ per kelvin.

### Brix
For sugar solutions the index is converted to **degrees Brix**: grams of sucrose per 100 g of solution at 20 °C. The standard table runs from water at 1.3330 (0 °Bx) through about 1.348 (10 °Bx), 1.364 (20), 1.381 (30), 1.400 (40), 1.420 (50) to 1.442 (60 °Bx). One degree Brix is about 0.0014 of index, so a temperature error of 1 K is about 0.07 °Bx.

### Other kinds
Handheld refractometers use a single prism, daylight and a scale in °Bx, specific gravity or salinity. Digital ones use a 589 nm LED, a CCD that finds the border, and a Peltier-controlled prism, and reach the fifth decimal of index. Gem refractometers use a high-index glass and a contact liquid.

> [!key] The border between light and dark inside the prism is at the critical angle, sin θc = n(sample)/n(prism). Calibrate the angle in index, read the index at 589.3 nm and 20 °C, and look up the concentration.
`,
  ideas: [
    'At grazing incidence from the sample into a denser prism, the refracted ray makes the critical angle θc with sin θc = n_sample/n_prism: that is the largest angle inside the prism.',
    'The prism field is bright below θc and dark above it; the border moves with the sample\'s index.',
    'Only samples with an index below the prism\'s can be measured (about 1.30 to 1.70 for dense flint).',
    'Index is reported for the sodium D line at 20 °C; compensator prisms let a white lamp be used, and temperature control matters because n falls about 10⁻⁴ per kelvin.',
    'Degrees Brix are grams of sucrose per 100 g of solution, found from the index with a standard table.'
  ],
  pitfalls: [
    'The refractometer measures sugar — It measures refractive index; the scale in °Bx assumes a sucrose solution. Salt, alcohol or other solutes change the index too and are read as "sugar".',
    'The reading does not depend on temperature — Both the sample\'s index and the prism\'s change with temperature; 1 K is about 10⁻⁴ in index or 0.07 °Bx. Good instruments control or compensate.',
    'A refractometer needs a clear sample — The measurement is made on the surface layer in contact with the prism, so a turbid or coloured sample still gives a border (a blurred one); it is the sample\'s own index, not its transparency, that counts.',
    'Any liquid can be read — The sample\'s index must be lower than the prism\'s. Heavy liquids such as diiodomethane (about 1.74) are at or beyond the limit of an ordinary instrument.'
  ],
  terms: [
    { term: 'Refractometer', def: 'An instrument that measures the refractive index of a liquid or solid, most often from the critical angle at a boundary with a prism of known index.' },
    { term: 'Critical angle', also: ['θc'], def: 'The largest angle of refraction inside a denser medium for light entering it from a rarer one; sin θc = n(rarer)/n(denser).' },
    { term: 'Abbe refractometer', def: 'A benchtop refractometer with a pair of prisms enclosing a thin film of liquid, a telescope that views the light–dark border, and compensator prisms that remove the colour from the border.' },
    { term: 'Index at the sodium D line', also: ['nD', 'n_D'], def: 'The refractive index for the yellow sodium line at 589.3 nm; the standard wavelength at which refractometers report index.' },
    { term: 'Degrees Brix', also: ['°Bx', 'Brix'], def: 'A concentration scale for sugar solutions: one degree Brix is 1 g of sucrose in 100 g of solution, found from the refractive index at 20 °C.' },
    { term: 'Compensator', also: ['Amici prisms', 'dispersion compensator'], def: 'A pair of counter-rotating direct-vision prisms in a refractometer that cancels the dispersion of the sample and prism so that the border looks white and the reading refers to the D line.' }
  ],
  formulas: [
    {
      name: 'Critical-angle refractometer',
      expr: 'ns = np*sin(tc)', tex: 'n_s = n_p\\,\\sin\\theta_c',
      vars: {
        ns: { name: 'refractive index of the sample', tex: 'n_s' },
        np: { name: 'refractive index of the measuring prism', value: 1.7845, min: 1, max: 4, tex: 'n_p' },
        tc: { name: 'angle of the light–dark border inside the prism', q: 'angle', unit: '°', value: 52, min: 0, max: 90, tex: '\\theta_c' }
      },
      note: 'Grazing incidence from the sample into the prism. The sample\'s index must be below the prism\'s.',
      stories: { ns: 'The border in a refractometer with a prism of index {np} is at {tc}. What is the index of the sample?', tc: 'A prism of index {np} is used to measure a sample of index {ns}. At what angle inside the prism is the border?' }
    },
    {
      name: 'Angular resolution needed',
      expr: 'dn = np*cos(tc)*dth', tex: '\\Delta n = n_p \\cos\\theta_c\\,\\Delta\\theta',
      vars: {
        dn: { name: 'smallest change of index to be resolved', tex: '\\Delta n' },
        np: { name: 'refractive index of the measuring prism', value: 1.7845, min: 1, max: 4, tex: 'n_p' },
        tc: { name: 'border angle', q: 'angle', unit: '°', value: 48.3, min: 0, max: 90, tex: '\\theta_c' },
        dth: { name: 'angular accuracy of the border reading', q: 'angle', unit: '″', value: 17, tex: '\\Delta\\theta' }
      },
      note: 'The derivative of the critical-angle relation. About 17″ gives 0.0001 near water.',
      stories: { dn: 'A telescope reads the border to {dth}. Around a border angle of {tc} in a prism of index {np}, what change of index can it resolve?' }
    },
    {
      name: 'Index of a sucrose solution (fit)',
      expr: 'n = 1.3330 + 0.001392*B + 0.00000706*B^2', tex: 'n \\approx 1.3330 + 0.001392\\,B + 7.06\\times 10^{-6}\\,B^2',
      vars: {
        n: { name: 'refractive index at 589.3 nm and 20 °C', tex: 'n' },
        B: { name: 'sugar content in degrees Brix', unit: '°Bx', value: 20, min: 0, max: 80, tex: 'B' }
      },
      note: 'A smooth fit to the standard table of sucrose solutions, good to about ±0.0003 (±0.2 °Bx) from 0 to 60 °Bx. Use the published table for real work.',
      stories: { B: 'A refractometer reads an index of {n} on a sugar solution at 20 °C. How many degrees Brix is it?' }
    }
  ],
  examples: [
    {
      title: 'From border to sugar',
      q: 'The border in an Abbe refractometer (prism index 1.7845) is at 52.0° inside the prism. What is the index of the sample and about how many degrees Brix?',
      steps: [
        { text: 'Apply the critical-angle relation:', tex: 'n_s = n_p \\sin\\theta_c = 1.7845 \\times \\sin 52.0° = 1.7845 \\times 0.7880 = 1.406' },
        'The standard table gives 1.400 at 40 °Bx and 1.420 at 50 °Bx. By interpolation 1.406 is a little over 43 °Bx.'
      ],
      a: 'n = 1.406, about 43 °Bx (a thick syrup or a concentrated juice).'
    },
    {
      title: 'A warm sample',
      q: 'A sugar solution of true content 15 °Bx is read on an uncompensated instrument whose prism is at 25 °C instead of 20 °C. Index falls by about 1×10⁻⁴ per kelvin. By how much is the reading wrong?',
      steps: [
        'Five kelvin lowers the index by $5 \\times 10^{-4}$.',
        'Near 15 °Bx one degree Brix is about 0.0015 of index, so the shift is $5\\times 10^{-4}/0.0015 = 0.3$ °Bx.'
      ],
      a: 'The instrument reads about 0.3 °Bx too low (14.7 instead of 15.0). Automatic temperature compensation applies exactly this correction.'
    }
  ],
  quiz: [
    { q: 'In a critical-angle refractometer the sample is changed from water (n = 1.333) to a liquid of index 1.47. The light–dark border in the prism…', choices: ['moves to a larger angle', 'moves to a smaller angle', 'does not move', 'disappears'], a: 0, why: '$\\sin\\theta_c = n_s/n_p$ grows with $n_s$, so the border moves from 48.3° to 55.5° for this prism.' },
    { q: 'A prism of index 1.75 shows the border at 50° inside the prism. What is the index of the sample (to two decimals)?', answer: 1.34, why: '$n_s = 1.75 \\times \\sin 50° = 1.75 \\times 0.766 = 1.34$.' },
    { q: 'A refractometer with a dense-flint prism of index about 1.78 can measure liquids of index 1.90.', a: false, why: 'The border requires the sample\'s index to be lower than the prism\'s; at $n_s \\ge n_p$ there is no critical angle and the whole field is bright.' },
    { q: 'What is the job of the compensator prisms in an Abbe refractometer?', choices: ['They cancel the dispersion so a white lamp gives a sharp, colourless border that reads n at 589.3 nm', 'They make the sample warmer', 'They focus the light on the sample', 'They magnify the scale'], a: 0, why: 'Without them the border would be a coloured band because the index depends on wavelength. The compensator is turned until the border is white; the setting even gives a measure of the sample\'s dispersion.' },
    { q: 'A grape juice reads 18 °Bx. What does 18 °Bx mean?', choices: ['18 g of sucrose-equivalent per 100 g of juice, at 20 °C', '18 % alcohol', '18 g of sugar per litre', 'An index of 1.18'], a: 0, why: 'Degrees Brix are mass percent of sucrose in the solution; a refractometer cannot tell sucrose from other dissolved substances, so for juice it is the sucrose-equivalent.' }
  ],
  applications: [
    'Food and drink: sugar in fruit juice, jam, syrup, and the must from which wine is made; the water content of honey.',
    'Coolants and fluids: the strength of antifreeze, battery electrolyte and cutting fluids read from index.',
    'Aquaria and veterinary work: the salinity of seawater, and the protein of blood serum or the concentration of urine.',
    'Chemical and oil industry: purity and concentration checks in the laboratory and in pipelines.',
    'Gem testing and glass: gem refractometers identify stones by index; the index of optical glass is measured to the fifth decimal on a V-block instrument.'
  ],
  history: 'Ernst Abbe designed the critical-angle refractometer at Jena in the 1870s, as part of his work on measuring the index and dispersion of the glasses for microscope objectives. The same relation, with a prism and a scale, is in the pocket instrument of every winemaker today.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 — Snell\'s law and total internal reflection, the critical angle.',
    'CRC *Handbook of Chemistry and Physics* — the table of refractive index against concentration for sucrose solutions.',
    'ASTM D1218, *Standard Test Method for Refractive Index and Refractive Dispersion of Hydrocarbon Liquids*.'
  ],
  sim: 'mt-refractometer'
},

/* ================================================================ ellipsometry */
{
  id: 'ellipsometry', parent: 'optical-metrology', title: 'Ellipsometry', level: 3,
  short: 'Ellipsometry measures how a surface changes the polarization of reflected light. Light polarized at 45° returns elliptical; the amplitude ratio tan Ψ and the phase difference Δ of its p and s components depend on the thickness and refractive index of any film on the surface. Fitted to a model, they give film thickness to a small fraction of a nanometre.',
  keywords: ['ellipsometry', 'ellipsometer', 'Psi', 'Delta', 'Ψ', 'Δ', 'thin film thickness', 'film index', 'polarization change on reflection', 'spectroscopic ellipsometry', 'null ellipsometer', 'rotating analyzer', 'compensator', 'Brewster angle', 'pseudo-Brewster', 'oxide on silicon', 'model fit', 'complex reflectance ratio'],
  prereq: ['fresnel-reflection', 'brewster-angle', 'polarization-states', 'thin-film-interference'],
  related: ['multilayer-coatings', 'antireflection-coatings', 'jones-calculus', 'stokes-parameters-and-mueller-matrices', 'polarizers-and-malus-law', 'wave-plates', 'metal-mirror-coatings', 'how-coatings-are-made'],
  body: `
A silicon wafer with a layer of oxide two nanometres thick, about eight atoms, looks the same as one with none. Reflected power hardly changes. What does change, measurably, is the *polarization* of the reflected light, and ellipsometry reads that change.

### What is measured
At a surface the two polarizations reflect differently ([[fresnel-reflection]]): the component in the plane of incidence, **p**, and the one across it, **s**, have different reflection amplitudes $r_p$ and $r_s$ and are delayed by different phases. A film on the surface changes both. Their ratio is a complex number,
$$\\rho = \\frac{r_p}{r_s} = \\tan\\Psi\\;e^{i\\Delta}$$
**Ψ** (0 to 90°) is the angle whose tangent is the ratio of the reflection amplitudes; **Δ** (0 to 360°) is the difference of the phase shifts. Send in light linearly polarized at 45° (equal p and s) and it returns with unequal amplitudes and a phase difference: elliptically polarized, an ellipse whose shape gives Ψ and Δ. The measurement is a ratio and a phase difference of the same beam, so lamp drift and the loss of light cancel out.

### The instrument
A **null ellipsometer** has a polarizer, a quarter-wave plate (the compensator), the sample, an analyzer and a detector; the elements are turned until the detector sees nothing, and their angles give Ψ and Δ. Modern instruments rotate an analyzer or compensator, or use a polarization modulator, and record the signal against that rotation; **spectroscopic** instruments do so at every wavelength from the ultraviolet to the near infrared. The beam meets the sample at 60–75°, near the Brewster angle of the substrate (75.5° for silicon at 633 nm), where $r_p$ is small and so sensitive to the film.

### From Ψ and Δ to a thickness
The instrument does not output a thickness; it outputs Ψ and Δ, and a **model** (substrate, film, indices) predicts them with the thin-film matrix of [[multilayer-coatings]]; a fit adjusts thickness (and, if unknown, index) until the prediction matches. For silicon dioxide ($n = 1.457$) on silicon at 70° and 632.8 nm the calculation gives:

| Oxide thickness | Ψ | Δ |
|---|---|---|
| 0 nm | 10.56° | 179.2° |
| 2 nm | 10.60° | 173.5° |
| 10 nm | 11.47° | 152.0° |
| 50 nm | 22.85° | 95.8° |
| 100 nm | 41.06° | 79.8° |
| 284 nm | 10.56° | 179.6° (a full cycle) |

Near zero thickness Δ falls by about 2.9° for each nanometre while Ψ hardly moves, so a Δ reading good to 0.1° resolves 0.03 nm. The curves repeat every
$$d_{\\text{period}} = \\frac{\\lambda}{2\\sqrt{n^2 - \\sin^2\\theta}}$$
284 nm in this case: one wavelength fixes the thickness only modulo that period. A second wavelength, or a spectrum, removes the ambiguity. Two numbers, Ψ and Δ, can fix two unknowns: for a transparent film of unknown index, both thickness and index.

### Limits
The method needs a smooth, uniform film on a known substrate. Roughness, a film that is not uniform, anisotropy and light that comes back partly depolarized all show up as misfit, and strongly absorbing or many-layer samples need spectra and care in the model. The Brewster angle of a dielectric is $\\tan\\theta_B = n_2/n_1$.

> [!key] Ψ and Δ are the amplitude ratio and the phase difference between p and s on reflection. A film moves them far more than it moves the reflected power; a model fit turns them into thickness and index.
`,
  ideas: [
    'The p and s polarizations reflect with different amplitudes and phases; the ratio r_p/r_s = tan Ψ · e^{iΔ} is what an ellipsometer measures.',
    'Light sent in linearly polarized at 45° comes back elliptical; the ellipse gives Ψ and Δ.',
    'A film of 2 nm on silicon lowers Δ by about 6° at 70° and 633 nm while the reflected power barely changes.',
    'Thickness and index are not read but fitted: a model predicts Ψ and Δ and the fit adjusts the unknowns.',
    'At one wavelength the thickness is ambiguous modulo λ/(2√(n² − sin²θ)); spectra remove the ambiguity.'
  ],
  pitfalls: [
    'An ellipsometer measures the thickness directly — It measures Ψ and Δ. The thickness comes from fitting a model, so the answer is only as good as the assumed indices and layer structure.',
    'It is a reflectance measurement like any other — It measures a ratio and a phase difference, which is why it is sensitive to a film a fraction of a nanometre thick while the reflected power hardly changes.',
    'One measurement gives one thickness — At a single wavelength the same Ψ and Δ recur every λ/(2√(n² − sin²θ)) of thickness (284 nm in the example); a second wavelength or angle is needed to choose.',
    'It works on any surface — A rough, graded or depolarizing surface gives readings that no simple layer model can fit.'
  ],
  terms: [
    { term: 'Ellipsometry', def: 'The measurement of the change of the polarization state of light on reflection from (or transmission through) a sample, used to find the thickness and optical constants of thin films.' },
    { term: 'Ψ and Δ', also: ['Psi and Delta', 'ellipsometric angles'], def: 'The two ellipsometric angles: tan Ψ is the ratio of the p and s reflection amplitudes, and Δ is the difference of their phase shifts; together they are the complex ratio ρ = tan Ψ · e^{iΔ}.' },
    { term: 'Null ellipsometer', def: 'An ellipsometer (polarizer, compensator, sample, analyzer) in which the elements are turned until no light reaches the detector; their angles at the null give Ψ and Δ.' },
    { term: 'Spectroscopic ellipsometry', also: ['SE'], def: 'Ellipsometry done at many wavelengths, usually from the ultraviolet to the near infrared, so that thickness and index can be separated and the dispersion of the film found.' },
    { term: 'Pseudo-Brewster angle', also: ['principal angle'], def: 'For an absorbing substrate, the angle of incidence at which the p reflectance is smallest; the measurement is most sensitive to a film there.' },
    { term: 'Optical model', also: ['layer model'], def: 'The assumed structure of the sample (substrate, layers, thicknesses and indices) used to compute the predicted Ψ and Δ; the fit varies its free parameters.' }
  ],
  formulas: [
    {
      name: 'Thickness period at one wavelength',
      expr: 'dp = lambda/(2*sqrt(n^2 - sin(th)^2))', tex: 'd_{\\text{period}} = \\frac{\\lambda}{2\\sqrt{n^2 - \\sin^2\\theta}}',
      vars: {
        dp: { name: 'thickness after which Ψ and Δ repeat', q: 'length', unit: 'nm', tex: 'd_{\\text{period}}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        n: { name: 'refractive index of the film', value: 1.457, min: 1.01, max: 4, tex: 'n' },
        th: { name: 'angle of incidence', q: 'angle', unit: '°', value: 70, min: 0, max: 85, tex: '\\theta' }
      },
      note: 'The film adds a round-trip phase of 4πd√(n² − sin²θ)/λ; one full cycle of 2π is one period.',
      stories: { dp: 'A film of index {n} is measured at {lambda} and an angle of incidence of {th}. By how much must its thickness increase before Ψ and Δ return to the same values?' }
    },
    {
      name: 'Brewster angle',
      expr: 'tan(thB) = n', tex: '\\tan\\theta_B = n',
      vars: {
        thB: { name: 'Brewster angle', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta_B' },
        n: { name: 'index of the substrate over the index of the medium', value: 1.5168, min: 1, max: 6, tex: 'n' }
      },
      note: 'At the Brewster angle the p reflectance of a transparent surface is zero. For silicon (n ≈ 3.88 at 633 nm) it is 75.5°.',
      stories: { thB: 'Light in air meets a substrate of index {n}. At what angle does the p component reflect nothing?' }
    }
  ],
  examples: [
    {
      title: 'A native oxide on silicon',
      q: 'A silicon wafer is measured at 70° and 632.8 nm. Bare silicon would give Δ = 179.2°; the wafer gives Δ = 173.5° and Ψ = 10.6°. Taking an oxide index of 1.457, how thick is the oxide?',
      steps: [
        'For thin oxide the model gives a change of Δ of about $-2.9°$ per nanometre, and a change of Ψ of only 0.014° per nanometre.',
        { text: 'The shift in Δ is', tex: '179.2° - 173.5° = 5.7°' },
        { text: 'so the thickness is', tex: 'd \\approx \\frac{5.7°}{2.9°/\\mathrm{nm}} \\approx 2.0\\ \\mathrm{nm}' }
      ],
      a: 'About 2 nm of oxide, the thickness of a native layer on a clean wafer. The reflectance would have changed by well under a part in a thousand; Δ changed by 3 %.'
    },
    {
      title: 'Is it 60 nm or 344 nm?',
      q: 'An oxide film of index 1.457 is measured at one wavelength, 632.8 nm, at 70°, and the fit gives 60 nm. What other thicknesses fit the same Ψ and Δ?',
      steps: [
        { text: 'The period of the curves:', tex: 'd_{\\text{period}} = \\frac{632.8}{2\\sqrt{1.457^2 - \\sin^2 70°}} = \\frac{632.8}{2\\times 1.1136} = 284\\ \\mathrm{nm}' },
        'Every thickness $60 + 284\\,k$ nm gives the same Ψ and Δ: 344 nm, 628 nm, …'
      ],
      a: '344 nm, 628 nm and so on. A second wavelength (the periods differ) or a known process history decides which.'
    }
  ],
  quiz: [
    { q: 'What two quantities does an ellipsometer measure?', choices: ['The amplitude ratio and phase difference of p and s on reflection (Ψ and Δ)', 'The reflectance and the transmittance', 'The film thickness and its index', 'The wavelength and the angle'], a: 0, why: 'Ψ and Δ come from the polarization ellipse of the reflected light. Thickness and index are derived from them with a model.' },
    { q: 'Ψ and Δ give the film thickness directly, with no assumptions about the film.', a: false, why: 'The thickness comes from fitting an optical model that assumes the substrate, the number of layers and (for thin films) their indices.' },
    { q: 'What is the Brewster angle of a surface with a relative index of 3.88 (silicon at 633 nm), in degrees?', answer: 75.5, unit: '°', why: '$\\theta_B = \\arctan(3.88) = 75.5°$. Ellipsometers work close to this angle on silicon, typically at 70°.' },
    { q: 'At 632.8 nm and 70° a film of index 1.457 has a thickness period of 284 nm. A fit of a single measurement gives 100 nm. Which other thickness is equally consistent?', choices: ['384 nm', '184 nm', '142 nm', '50 nm'], a: 0, why: 'Ψ and Δ repeat every 284 nm of thickness: 100 + 284 = 384 nm. A measurement at a second wavelength has a different period and picks the right one.' },
    { q: 'Why are ellipsometers set at an angle near the Brewster angle of the substrate?', choices: ['The p reflectance is small there, so a film changes the p–s balance by a large fraction', 'The reflected beam is brightest there', 'The polarization does not change there', 'It is the only angle at which light reflects'], a: 0, why: 'Near the Brewster angle $r_p$ is small and passes through a minimum; a thin film shifts it noticeably, so Ψ and Δ are at their most sensitive.' }
  ],
  applications: [
    'Semiconductor manufacturing: gate oxides a few nanometres thick, nitrides, photoresist and dielectric layers on wafers.',
    'Optical coatings: thickness and index of the layers of antireflection and mirror coatings, checked on witness samples.',
    'Displays and solar cells: transparent conducting films such as indium tin oxide and thin-film absorbers.',
    'Surface science and biosensors: layers of molecules a fraction of a nanometre thick, adsorbing on a surface, followed in real time.',
    'Research on new materials: optical constants as functions of wavelength, from the ultraviolet to the infrared.'
  ],
  history: 'Paul Drude derived the equations for the reflection of polarized light from a surface covered with a film, and measured the elliptical polarization of reflected light, in the late 1880s. The word "ellipsometry" was coined by Alexandre Rothen in 1945. Automated instruments with computers, rotating elements and spectroscopy changed a laboratory technique into a routine fab tool from the 1970s onwards.',
  sources: [
    'R. M. A. Azzam and N. M. Bashara, *Ellipsometry and Polarized Light* (North-Holland) — the standard text on the theory and the instruments.',
    'H. Fujiwara, *Spectroscopic Ellipsometry: Principles and Applications* (Wiley).',
    'H. G. Tompkins and E. A. Irene (eds), *Handbook of Ellipsometry* (William Andrew).',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 (light in stratified media and thin films) and ch. 13 (optics of metals).'
  ],
  sim: 'mt-ellipsometer'
},

/* ================================================================ optical profilers */
{
  id: 'optical-profilers', parent: 'optical-metrology', title: 'Optical profilers', level: 2,
  short: 'A profiler measures the height of a surface point by point. A stylus feels it; optical profilers see it: white-light interferometers find where the fringe contrast peaks, confocal sensors where a pinhole signal peaks, focus-variation microscopes where the image is sharpest. Each reaches nanometre heights, and each fails in its own way on steps, steep flanks and rough or shiny surfaces.',
  keywords: ['optical profiler', 'profilometer', 'white-light interferometry', 'coherence scanning interferometry', 'CSI', 'WLI', 'confocal microscope', 'confocal profilometer', 'chromatic confocal', 'focus variation', 'stylus profiler', 'surface roughness', 'Ra', 'step height', 'correlogram', 'Mirau', 'areal surface texture', 'topography'],
  prereq: ['michelson-interferometer', 'coherence', 'numerical-aperture', 'testing-surfaces-with-interferometers'],
  related: ['distance-and-displacement-sensors', 'fluorescence-and-confocal-microscopy', 'optical-coherence-tomography', 'surface-quality-and-flatness', 'the-airy-disk', 'depth-of-field', 'machine-vision-lighting', 'three-d-machine-vision'],
  body: `
A surface that looks smooth is a landscape at the right scale: machined steel has ridges 0.5 µm high, a MEMS device has steps of 100 nm, a polished mirror ripples by a nanometre. A **profiler** records that landscape: the height $z$ at each point $x$ (a *profile*) or at every point of an area (a *topography*). Two families do it.

### The stylus
A diamond tip, with a radius of about 2 µm on a 60° or 90° cone, is dragged along the surface with a force of between a few micronewtons and a few millinewtons; a transducer records its vertical motion, to about a nanometre over a range of up to a millimetre. It is robust and unambiguous, and slow, but the tip is the trouble: it cannot go into a groove narrower than itself. A 2 µm-radius tip in a 2 µm-wide groove reaches only 0.27 µm of depth, and a soft coating can be scratched.

### Optical profilers
- **White-light (coherence-scanning) interferometry.** The microscope objective is built as an interferometer (Mirau, Michelson or Linnik) and scanned vertically. At each pixel the intensity oscillates as the path difference changes, but only while the path difference is within the coherence length of the source: a wave-packet, the **correlogram**. Its envelope peaks where the surface is exactly in focus on the reference path, and the position of the peak (and of the fringes inside it) is the height. The envelope width is about $0.44\\lambda^2/\\Delta\\lambda$ in path difference: 0.64 µm for white light of 600 nm and a bandwidth of 250 nm. Vertical resolution is nanometres or below and does not depend on the magnification; lateral resolution is the optics' (about $0.61\\lambda/\\mathrm{NA}$: 0.37 µm at NA 0.9 and 550 nm). Weak points: steps (the "batwings" that appear at sharp edges), steep slopes beyond the objective's aperture, thin transparent films.
- **Confocal.** A pinhole in front of the detector passes light only from the focal plane; scanning the focus through the surface, the signal at each point peaks when the surface is in focus. The peak is about $1.4\\lambda/\\mathrm{NA}^2$ wide (0.78 µm at NA 0.95, 500 nm) and is located to a small fraction of that. Steep flanks, rough and dark surfaces, large steps are its strengths.
- **Focus variation.** A microscope with a shallow depth of field is stepped through the height; the sharpest image of each pixel, judged by local contrast, gives its height. It needs texture (a perfectly smooth, plain surface has no contrast) and handles steep, rough surfaces.
- **Chromatic confocal point sensors** use a lens with deliberate axial colour: each wavelength is focused at a different height, a spectrometer finds the colour of the returned light ([[distance-and-displacement-sensors]]).

### Why the instruments disagree
They measure different things. The stylus is limited by the tip, the optical methods by the aperture and the slope: a smooth surface tilted by $\\alpha$ sends the reflected beam off at $2\\alpha$, so it is lost if $2\\alpha$ exceeds $\\arcsin(\\mathrm{NA})$. Thin films and different materials add optical offsets to height. Compare methods on a reference artefact first.

> [!key] A profiler finds, for every point, where something peaks: the contact of a tip, the fringe contrast, the confocal signal or the image contrast. Pick the peak whose failure mode your surface does not trigger.
`,
  ideas: [
    'A stylus measures height by contact; its tip radius limits the narrowest groove it can follow, and a 2 µm tip reaches only 0.27 µm into a 2 µm groove.',
    'White-light interferometry finds where the interference fringes are strongest: the height is the position of the peak of the correlogram, with nanometre resolution independent of magnification.',
    'The correlogram is only as wide as the coherence length: 0.44 λ²/Δλ, 0.64 µm of path for white light.',
    'Confocal and focus-variation sensors find where the signal or the contrast peaks while the focus scans; they cope with steep and rough surfaces.',
    'Every optical method is limited laterally by about 0.61 λ/NA and in slope by the aperture of the objective.'
  ],
  pitfalls: [
    'An optical profiler sees the surface exactly as it is — It sees the optical response: a step can show "batwing" overshoots, steep flanks drop out beyond the aperture, and a thin film on glass reads as a height offset.',
    'Higher magnification gives better height resolution — In interferometry the vertical resolution comes from the fringe phase and does not depend on magnification; the lateral resolution and the field of view do.',
    'The stylus is the "true" reference — The tip rounds sharp valleys and may scratch soft surfaces; for grooves narrower than the tip it reads the tip, not the groove.',
    'A longer coherence length makes a better white-light interferometer — A narrow bandwidth gives a long wave-packet, so the peak is broad and badly located, and rough surfaces cannot be separated from smooth ones; short coherence is what makes the peak sharp.'
  ],
  terms: [
    { term: 'Stylus profiler', also: ['profilometer', 'contact profiler'], def: 'An instrument that drags a fine diamond tip over a surface and records its vertical motion; limited laterally by the tip radius and cone angle.' },
    { term: 'White-light interferometry', also: ['coherence scanning interferometry', 'CSI', 'WLI', 'vertical scanning interferometry'], def: 'Surface profiling in which an interferometric objective is scanned vertically with a broadband source; the height at each pixel is where the fringe envelope peaks.' },
    { term: 'Correlogram', def: 'The signal at one pixel as the path difference is scanned: a few oscillations of fringes under an envelope whose width is the coherence length of the source.' },
    { term: 'Confocal profilometry', def: 'Profiling by scanning the focus through the surface and finding, for each point, the height at which the signal behind a pinhole is largest.' },
    { term: 'Focus variation', def: 'Profiling by recording a stack of images at different focus and taking, for each pixel, the focus position of maximum local contrast.' },
    { term: 'Areal surface texture', def: 'Surface roughness and form described over an area rather than along a line; parameters such as Sa and Sq, the areal versions of Ra and Rq (ISO 25178).' }
  ],
  formulas: [
    {
      name: 'Lateral resolution of an optical profiler',
      expr: 'd = 0.61*lambda/NA', tex: 'd = 0.61\\,\\frac{\\lambda}{\\mathrm{NA}}',
      vars: {
        d: { name: 'smallest lateral detail resolved', q: 'length', unit: 'µm', tex: 'd' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        NA: { name: 'numerical aperture of the objective', value: 0.9, min: 0.05, max: 1.4, tex: '\\mathrm{NA}' }
      },
      note: 'The Rayleigh criterion for the objective. Sampling by the camera pixels can make it coarser.',
      stories: { d: 'An objective of numerical aperture {NA} is used with light of {lambda}. What is the diffraction limit on the lateral resolution?' }
    },
    {
      name: 'Width of the correlogram',
      expr: 'lc = 0.441*lambda^2/dl', tex: 'l_c = 0.441\\,\\frac{\\lambda^2}{\\Delta\\lambda}',
      vars: {
        lc: { name: 'width (FWHM) of the fringe envelope, in path difference', q: 'length', unit: 'µm', tex: 'l_c' },
        lambda: { name: 'mean wavelength of the source', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        dl: { name: 'spectral width of the source (FWHM)', q: 'length', unit: 'nm', value: 250, tex: '\\Delta\\lambda' }
      },
      note: 'For a source with a Gaussian spectrum. A reflection halves it in height: the surface height range of the envelope is l_c/2.',
      stories: { lc: 'A white-light interferometer uses a source centred at {lambda} with a width of {dl}. How wide is the fringe envelope in path difference?' }
    },
    {
      name: 'Axial width of a confocal signal',
      expr: 'dz = 1.4*lambda*n/NA^2', tex: '\\Delta z = \\frac{1.4\\,\\lambda\\,n}{\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'axial width of the confocal signal (FWHM)', q: 'length', unit: 'µm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        n: { name: 'index of the medium in front of the objective', value: 1, min: 1, max: 1.6, tex: 'n' },
        NA: { name: 'numerical aperture', value: 0.95, min: 0.05, max: 1.5, tex: '\\mathrm{NA}' }
      },
      note: 'The peak can be located to a small fraction of this width, so the height resolution is far better than Δz.',
      stories: { dz: 'A confocal sensor with an objective of numerical aperture {NA} uses light of {lambda} in air. How wide is the axial response?' }
    },
    {
      name: 'How deep a stylus tip goes into a groove',
      expr: 's = r - sqrt(r^2 - (w/2)^2)', tex: 's = r - \\sqrt{r^2 - (w/2)^2}',
      vars: {
        s: { name: 'depth the tip reaches', q: 'length', unit: 'µm', tex: 's' },
        r: { name: 'radius of the tip', q: 'length', unit: 'µm', value: 2, min: 0.05, max: 50, tex: 'r' },
        w: { name: 'width of the groove at its top', q: 'length', unit: 'µm', value: 2, min: 0, max: 100, tex: 'w' }
      },
      note: 'A spherical tip resting on the two edges of a groove narrower than the tip (w < 2r); a wider groove lets the tip reach the bottom.',
      stories: { s: 'A stylus tip of radius {r} crosses a groove {w} wide. How far into the groove does it sink?' }
    }
  ],
  examples: [
    {
      title: 'White light against an LED',
      q: 'A scanning interferometer can use white light (600 nm, bandwidth 250 nm) or a red LED (630 nm, bandwidth 30 nm). How wide is the fringe envelope for each?',
      steps: [
        { text: 'White light:', tex: 'l_c = 0.441\\,\\frac{(600\\ \\mathrm{nm})^2}{250\\ \\mathrm{nm}} = 0.64\\ \\mu\\mathrm{m}' },
        { text: 'LED:', tex: 'l_c = 0.441\\,\\frac{(630\\ \\mathrm{nm})^2}{30\\ \\mathrm{nm}} = 5.8\\ \\mu\\mathrm{m}' },
        'In terms of surface height, half of each (the beam goes there and back): 0.32 µm and 2.9 µm.'
      ],
      a: '0.64 µm for white light, 5.8 µm for the LED. The narrow envelope of white light places a rough surface unambiguously; the LED\'s wide envelope is convenient for very smooth surfaces and needs larger scan steps.'
    },
    {
      title: 'A groove the stylus cannot read',
      q: 'A groove is 2 µm wide and 1.5 µm deep. A stylus tip of radius 2 µm crosses it. What depth does the stylus report?',
      steps: [
        { text: 'The tip rests on the two edges:', tex: 's = r - \\sqrt{r^2 - (w/2)^2} = 2 - \\sqrt{4 - 1} = 0.27\\ \\mu\\mathrm{m}' },
        'That is $0.27/1.5 = 18\\ \\%$ of the true depth.'
      ],
      a: '0.27 µm: the stylus reports less than a fifth of the true depth. A confocal profiler with NA 0.9 (0.37 µm resolution) would resolve the groove and read its floor, though near-vertical walls may drop out of the record.'
    }
  ],
  quiz: [
    { q: 'In white-light interferometry the height of a point is found from…', choices: ['the position at which the fringe envelope peaks as the objective is scanned', 'the brightness of the reflected light', 'the angle of the reflected beam', 'the colour of the surface'], a: 0, why: 'Fringes appear only while the two paths are equal to within the coherence length; the envelope peaks at equality, and the scan position there is the height.' },
    { q: 'The vertical resolution of a white-light interferometer improves when a higher-magnification objective is used.', a: false, why: 'The height comes from the fringe phase and envelope, which do not depend on magnification. A higher magnification improves the lateral resolution and reduces the field of view.' },
    { q: 'What is the diffraction limit on lateral resolution, 0.61 λ/NA, for light of 550 nm and an objective of NA 0.9, in micrometres?', answer: 0.37, unit: 'µm', why: '$0.61 \\times 0.55\\ \\mu\\mathrm{m}/0.9 = 0.373\\ \\mu\\mathrm{m}$.' },
    { q: 'A stylus tip with a radius of 5 µm crosses a V-shaped groove with a top width of 3 µm. The recorded groove is…', choices: ['shallower than the real one: the tip rests on the edges', 'exactly as deep as the real one', 'deeper than the real one', 'invisible only if the force is high'], a: 0, why: 'The tip cannot enter a groove narrower than itself. It rests on the two rims and the record shows the shape of the tip, not of the groove.' },
    { q: 'Which source gives the narrower correlogram envelope: white light (Δλ ≈ 250 nm) or an LED (Δλ ≈ 30 nm)?', choices: ['White light', 'The LED', 'They are equal', 'Neither has an envelope'], a: 0, why: 'The envelope width is 0.44λ²/Δλ: the larger the bandwidth, the shorter the wave-packet and the more sharply its peak marks the height.' }
  ],
  applications: [
    'Machined and ground parts: roughness and lay of bearings, seals, cylinder bores and sealing faces, reported as Ra, Sa and other parameters.',
    'MEMS and semiconductors: step heights of a few tens of nanometres, trench depths, wafer bump heights, film thickness steps.',
    'Wear and coatings: depth and volume of a worn track, a scratch or a coating edge.',
    'Additive manufacturing and implants: rough, steep surfaces measured by confocal and focus-variation instruments.',
    'Optics: the roughness of polished surfaces (below a nanometre RMS) measured over small areas by phase-shifting and coherence-scanning microscopes.'
  ],
  history: 'The stylus profilometer goes back to the 1930s (the Abbott–Firestone profilometer of 1933 is the usual starting point). Coherence-scanning interferometry, which locates the peak of the fringe envelope instead of counting fringes, was developed around 1990, and made it possible to measure surfaces with steps and roughness that defeat ordinary phase-shifting interferometers.',
  sources: [
    'R. Leach (ed.), *Optical Measurement of Surface Topography* (Springer) — coherence scanning, confocal and focus-variation instruments.',
    'ISO 25178-6, *Geometrical product specification (GPS) — Surface texture: Areal — Classification of methods for measuring surface texture*.',
    'ISO 3274, *GPS — Surface texture: Profile method — Nominal characteristics of contact (stylus) instruments*.'
  ],
  sim: 'mt-profiler'
},

/* ================================================================ distance and displacement sensors */
{
  id: 'distance-and-displacement-sensors', parent: 'optical-metrology', title: 'Optical distance and displacement sensors', level: 2,
  short: 'Light measures distance in four main ways. Triangulation reads where a spot lands on a detector, chromatic confocal sensors read a colour, laser interferometers count half-wavelengths of motion, and time-of-flight sensors time a pulse or a phase. They span nanometres to kilometres, and each loses precision in a different way.',
  keywords: ['distance sensor', 'displacement sensor', 'laser triangulation sensor', 'chromatic confocal sensor', 'laser interferometer', 'fringe counting', 'time of flight', 'phase-shift rangefinder', 'laser rangefinder', 'resolution', 'range', 'half wavelength', 'refractive index of air', 'Edlén', 'retroreflector', 'laser distance meter', 'non-contact gauge'],
  prereq: ['michelson-interferometer', 'laser-triangulation', 'optical-profilers'],
  related: ['lidar', 'time-of-flight-cameras', 'interferometers-in-precision-engineering', 'the-optical-mouse-and-optical-encoders', 'optical-coherence-tomography', 'retroreflectors', 'three-d-machine-vision', 'coherence'],
  body: `
A gap of 0.2 mm between two machine parts, the thickness of a glass sheet, the position of a wafer stage to a nanometre, the distance to a wall, the distance to a lamp-post a kilometre away: all are "how far?", and light answers each one differently. Four principles cover almost every optical distance sensor.

### Triangulation
A laser spot lies on the target; a lens, a baseline $b$ away from the laser, images it on a position detector (a line sensor or a position-sensitive diode). As the target moves, the spot moves on the detector by
$$\\Delta = \\frac{f\\,b}{z}$$
($f$ is the lens focal length, $z$ the distance). So the detector shift is large for near targets and small for far ones, and a detector that can resolve a displacement $p$ gives a distance resolution
$$\\delta z = \\frac{z^2\\,p}{f\\,b}$$
which grows as the *square* of the range. With $f = 25$ mm, $b = 30$ mm and $p = 0.5$ µm (a sub-pixel centroid), the resolution is 6.7 µm at 100 mm and 170 µm at 500 mm. It needs one side of access, diffuse surfaces and short ranges, millimetres up to about a metre ([[laser-triangulation]]).

### Chromatic confocal
A lens with strong axial colour focuses each wavelength of a white LED at its own height. Light reflected from a surface passes a confocal pinhole only if it is in focus, so only one colour returns, and a spectrometer reads it: the colour *is* the height. There are no moving parts; ranges run from a fraction of a millimetre to some tens, resolution from nanometres to micrometres; it works on glass, mirrors, steep surfaces and transparent layers (two surfaces, two peaks).

### Interferometers
In a Michelson interferometer a mirror on the moving part sends the beam back; the interference at the detector goes through one fringe for each $\\lambda/2$ of motion. A count of $N$ fringes is a displacement of
$$d = N\\,\\frac{\\lambda}{2}$$
At 632.8 nm, 1 mm is 3160 fringes. Electronics interpolate each fringe into 64 or 256 parts, so one count is a few nanometres or about one. The measurement is *relative*: it counts from where it started, and a blocked beam loses the count. And the "ruler" is the wavelength *in air*, which changes with the air's index: $n - 1 \\approx 2.7\\times 10^{-4}$, changing by about 0.9 parts per million per kelvin and 0.27 per hectopascal. Real systems measure temperature, pressure and humidity and correct for them, or work in vacuum.

### Time of flight
A pulse of light goes to the target and back: $d = ct/2$. One nanosecond is 15 cm, so millimetre resolution needs 7 ps timing, and pulsed rangefinders and [[lidar]] work at metres to kilometres. For shorter ranges the light is modulated at a frequency $f_m$ and the *phase* of the return is measured; the phase repeats every $c/2f_m$ (15 m at 10 MHz, 1.5 m at 100 MHz), the ambiguity range.

| Principle | Typical range | Typical resolution | Strength |
|---|---|---|---|
| Triangulation | mm to about 1 m | 0.01–0.1 % of range | cheap, fast, one side |
| Chromatic confocal | 0.3 mm to tens of mm | nanometres to micrometres | glass, shiny, steep |
| Laser interferometer | up to tens of metres | about 1 nm | the best, but relative |
| Time of flight (pulse, phase) | metres to kilometres | millimetres to centimetres | long range |

> [!key] Triangulation reads a position, confocal a colour, an interferometer counts half-wavelengths, time of flight counts nanoseconds. Resolution against range is the first thing to ask of any of them.
`,
  ideas: [
    'Triangulation: the spot moves on the detector by f·b/z, so the distance resolution δz = z²p/(fb) grows as the square of the range.',
    'Chromatic confocal sensors turn height into colour with a lens of deliberate axial chromatic aberration; a spectrometer reads the height.',
    'An interferometer counts fringes, one per half-wavelength of motion; d = N·λ/2 is relative and depends on the wavelength in air.',
    'Time of flight: d = ct/2, 15 cm per nanosecond; a phase measurement of modulated light repeats every c/2f_m.',
    'Every method has a natural range: triangulation to a metre, confocal to tens of millimetres, interferometers to tens of metres, time of flight to kilometres.'
  ],
  pitfalls: [
    'A laser interferometer measures distance — It measures a change of distance from a starting point, by counting fringes. If the beam is blocked the count is lost; absolute distances need another method.',
    'The wavelength is a fixed ruler — It is the wavelength in air: temperature, pressure and humidity change it by parts per million, which is a micrometre per metre. Precision systems correct for the air.',
    'Triangulation is equally accurate at all ranges — The resolution worsens as z²: a sensor good to 7 µm at 100 mm is good to 170 µm at 500 mm.',
    'Time of flight needs only a fast clock — A resolution of 1 mm requires 7 ps timing; short-range sensors measure the phase of modulated light instead of timing pulses.'
  ],
  terms: [
    { term: 'Optical triangulation', def: 'Finding the distance of a target from the position at which its laser spot is imaged on a detector, the laser and the lens being a baseline apart.' },
    { term: 'Chromatic confocal sensor', also: ['confocal chromatic sensor', 'chromatic point sensor'], def: 'A distance sensor whose lens focuses each wavelength at a different height; the colour of the light that returns through a confocal pinhole gives the height of the surface.' },
    { term: 'Fringe counting', def: 'Measuring a displacement by counting the interference fringes that pass a detector as a mirror moves; each fringe is half a wavelength of motion.' },
    { term: 'Time of flight', also: ['ToF', 'TOF'], def: 'Measuring distance from the time light takes to go to a target and back: d = ct/2.' },
    { term: 'Ambiguity range', also: ['unambiguous range'], def: 'The distance c/2f_m after which the phase of a modulated-light rangefinder repeats, so that distances beyond it are read modulo that range.' },
    { term: 'Retroreflector', also: ['corner cube'], def: 'A mirror assembly that returns a beam parallel to itself whatever its tilt; used as the target of interferometers and laser trackers.' }
  ],
  formulas: [
    {
      name: 'Triangulation: resolution against range',
      expr: 'dz = z^2*p/(f*b)', tex: '\\delta z = \\frac{z^2\\,p}{f\\,b}',
      vars: {
        dz: { name: 'distance resolution', q: 'length', unit: 'µm', tex: '\\delta z' },
        z: { name: 'distance to the target', q: 'length', unit: 'mm', value: 100, tex: 'z' },
        p: { name: 'smallest shift the detector can resolve', q: 'length', unit: 'µm', value: 0.5, tex: 'p' },
        f: { name: 'focal length of the receiving lens', q: 'length', unit: 'mm', value: 25, tex: 'f' },
        b: { name: 'baseline between laser and lens', q: 'length', unit: 'mm', value: 30, tex: 'b' }
      },
      note: 'Small changes of z; the spot shift is f·b/z. The resolution worsens with the square of the distance.',
      stories: { dz: 'A triangulation sensor with a {f} lens and a {b} baseline can resolve a shift of {p} on its detector. What is its distance resolution at {z}?' }
    },
    {
      name: 'Displacement from fringe count',
      expr: 'd = N*lambda/2', tex: 'd = N\\,\\frac{\\lambda}{2}',
      vars: {
        d: { name: 'displacement', q: 'length', unit: 'µm', tex: 'd' },
        N: { name: 'number of fringes counted', value: 31.6, min: 0, max: 1e9, tex: 'N' },
        lambda: { name: 'wavelength in the air of the beam', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'Michelson layout with a moving mirror or retroreflector; the beam goes there and back.',
      stories: { d: 'An interferometer using {lambda} counts {N} fringes as a stage moves. How far has it moved?', N: 'A stage moves {d}, measured with light of {lambda}. How many fringes pass the detector?' }
    },
    {
      name: 'Time of flight',
      expr: 'd = c*t/2', tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'distance to the target', q: 'length', unit: 'm', tex: 'd' },
        c: { const: 'c' },
        t: { name: 'round-trip time', q: 'time', unit: 'ns', value: 66.7, tex: 't' }
      },
      note: 'One nanosecond of round trip is 15 cm of distance.',
      stories: { d: 'A pulse returns from a target after {t}. How far away is it?', t: 'How long does a pulse of light take to go to a target {d} away and back?' }
    },
    {
      name: 'Range ambiguity of a phase rangefinder',
      expr: 'R = c/(2*fm)', tex: 'R = \\frac{c}{2 f_m}',
      vars: {
        R: { name: 'unambiguous range', q: 'length', unit: 'm', tex: 'R' },
        c: { const: 'c' },
        fm: { name: 'modulation frequency', q: 'frequency', unit: 'MHz', value: 10, tex: 'f_m' }
      },
      note: 'The phase of the return repeats every R; distances beyond it are measured modulo R unless a second frequency is used.',
      stories: { R: 'A rangefinder modulates its light at {fm}. After what distance does its phase reading repeat?' }
    }
  ],
  examples: [
    {
      title: 'Resolution at two ranges',
      q: 'A triangulation sensor has a 25 mm receiving lens and a 30 mm baseline, and its detector resolves 0.5 µm. What is its distance resolution at 100 mm and at 300 mm?',
      steps: [
        { text: 'At 100 mm:', tex: '\\delta z = \\frac{z^2 p}{f b} = \\frac{(100\\ \\mathrm{mm})^2 \\times 0.5\\ \\mu\\mathrm{m}}{25\\ \\mathrm{mm} \\times 30\\ \\mathrm{mm}} = 6.7\\ \\mu\\mathrm{m}' },
        'At 300 mm the range is three times larger, so the resolution is nine times worse: 60 µm.'
      ],
      a: '6.7 µm at 100 mm (0.007 % of range) and 60 µm at 300 mm (0.02 %).'
    },
    {
      title: 'A rangefinder reads a phase',
      q: 'A phase-shift rangefinder modulates its light at 10 MHz and reads a phase shift of 90° in the return. How far is the target?',
      steps: [
        { text: 'The ambiguity range is', tex: 'R = \\frac{c}{2 f_m} = \\frac{3.00\\times 10^8}{2 \\times 10^7}\\ \\mathrm{m} = 15\\ \\mathrm{m}' },
        'A phase of 90° is a quarter of the cycle: $d = R/4 = 3.75$ m, or 3.75 m plus any whole multiple of 15 m.'
      ],
      a: '3.75 m, 18.75 m, 33.75 m … The instrument cannot tell which; a second modulation frequency or a rough knowledge of the distance removes the ambiguity.'
    }
  ],
  quiz: [
    { q: 'A triangulation sensor resolves 7 µm at 100 mm. About what will it resolve at 200 mm?', choices: ['14 µm', '28 µm', '7 µm', '49 µm'], a: 1, why: 'The resolution varies as the square of the distance: twice the range, four times the resolution figure, 28 µm.' },
    { q: 'A stage moves 10 µm and an interferometer using 632.8 nm light counts the fringes. How many (to one decimal place)?', answer: 31.6, why: '$N = 2d/\\lambda = 2 \\times 10\\ \\mu\\mathrm{m}/0.6328\\ \\mu\\mathrm{m} = 31.6$.' },
    { q: 'A laser interferometer gives the absolute distance from the instrument to the mirror.', a: false, why: 'It counts fringes from the starting position, so it measures displacement only. If the beam is interrupted the count is lost.' },
    { q: 'A phase rangefinder modulates its light at 100 MHz. What is its unambiguous range, in metres?', answer: 1.5, unit: 'm', why: '$R = c/2f_m = 3.0\\times 10^8/(2\\times 10^8) = 1.5$ m.' },
    { q: 'Which sensor would you pick to measure the thickness of a glass sheet from one side, without touching it?', choices: ['A chromatic confocal sensor: two peaks, one from each surface', 'A pulsed time-of-flight rangefinder', 'A triangulation sensor on a diffuse target', 'A fringe-counting interferometer'], a: 0, why: 'Glass reflects from both surfaces; the confocal sensor sees two colour peaks whose separation (corrected by the index) is the thickness. Time of flight cannot resolve 1 mm, and triangulation needs a diffuse spot.' }
  ],
  applications: [
    'Production lines: triangulation heads gauge gaps, heights, thickness and flatness at kilohertz rates ([[laser-triangulation]]).',
    'Glass, lenses and electronics: chromatic confocal sensors measure thickness, lens shape and surface height without contact.',
    'Machine-tool and stage calibration: laser interferometers check the positioning accuracy of machine axes and drive wafer-stage positioning to the nanometre (ISO 230-2).',
    'Construction and surveying: handheld laser distance meters (phase shift) and total stations (pulse and phase), and the lidar of vehicles ([[lidar]]).',
    'Phones and cameras: small time-of-flight sensors measure the distance to a subject for autofocus.'
  ],
  history: 'Albert Michelson built interferometers to measure small lengths in the 1880s and in 1892–93 measured the metre in wavelengths of cadmium light. Since 1983 the metre has been defined as the distance travelled by light in 1/299 792 458 of a second, so every time-of-flight rangefinder realizes the definition; helium–neon lasers, stabilized to a few parts in 10⁸ or better, became the working rulers of the laboratory.',
  sources: [
    'T. Yoshizawa (ed.), *Handbook of Optical Metrology: Principles and Applications* (CRC Press) — triangulation, confocal, interferometric and time-of-flight methods.',
    'K. P. Birch and M. J. Downs, "An updated Edlén equation for the refractive index of air", *Metrologia* 30 (1993) — the correction of wavelength in air.',
    'ISO 230-2, *Test code for machine tools — Determination of accuracy and repeatability of positioning of numerically controlled axes* — laser interferometers in machine calibration.'
  ],
  sim: 'mt-displacement'
},

/* ================================================================ alignment telescopes and lasers */
{
  id: 'alignment-telescopes-and-lasers', parent: 'optical-metrology', title: 'Alignment telescopes and alignment lasers', level: 2,
  short: 'To line things up, give them a straight line to be measured against. An alignment telescope defines a line of sight to its cross-hair and reads offsets of targets from it; an alignment laser makes the line a visible beam read by a quadrant detector; cross-line and rotating lasers make lines and level planes; a laser tracker follows a reflector and gives its position in three dimensions.',
  keywords: ['alignment telescope', 'alignment laser', 'line of sight', 'cross-line laser', 'rotating laser', 'laser level', 'laser tracker', 'spherically mounted retroreflector', 'SMR', 'bore alignment', 'straightness', 'quadrant detector', 'optical micrometer', 'autocollimation', 'self-levelling', 'shaft alignment', 'target'],
  prereq: ['the-autocollimator', 'the-gaussian-beam', 'rayleigh-range'],
  related: ['aligning-an-optical-system', 'tolerancing-and-alignment-budget', 'distance-and-displacement-sensors', 'laser-safety-classes', 'laser-eye-hazards-and-eyewear', 'beam-waist-and-divergence', 'laser-line-generators', 'interferometers-in-precision-engineering'],
  body: `
A ship's propeller shaft is 30 metres long and rides in five bearings that must lie on one straight line to a tenth of a millimetre. A string would sag, a straightedge is too short; light is straight. Every alignment instrument makes a **line of sight** and measures how far things sit from it.

### The alignment telescope
It looks like a surveyor's telescope with a precision cross-hair, and a focusing lens that moves along the axis *without* moving the line of sight (that is the hard part to build). It can focus from a fraction of a metre to infinity. Targets, cross-hairs or concentric rings, are fitted in each bore; the telescope is set on the first and last, and the offset of each target in between is read with an **optical micrometer**, a tilting plate that shifts the image sideways by a measured amount, to about 0.01 mm. With the reticle lit it also acts as an [[the-autocollimator|autocollimator]]: a mirror square to the line returns the cross-hair, so perpendicularity can be checked from the same position.

### The alignment laser
A laser beam is a line of sight you can see. A target with a quadrant photodiode or a position-sensitive detector reads the beam's centre electronically, so any number of targets can be read without a person at the telescope. Two points matter.
- **The beam is not a line.** Its width $w(z)$ grows with distance ([[rayleigh-range]]): a beam of 2 mm radius at 635 nm is 2.8 mm in radius at 20 m. Over a distance $z$ it is narrowest for a waist $w_0 = \\sqrt{\\lambda z/\\pi}$, 2 mm for 20 m. The *centre* can be found to a small fraction of the width, but the beam wanders with the air.
- **Colour.** At equal power a 532 nm beam looks about four times brighter than a 635 nm one, easier to see on a site; the target needs power, not brightness.

> [!warn] Never look into an alignment laser or its reflection: Class 2 and 3R beams can dazzle and injure the eye ([[laser-safety-classes]]). Never point a beam at aircraft, vehicles or people.

### Cross-line and rotating lasers
A **cross-line laser** projects a horizontal and a vertical line from a pendulum that levels itself under gravity within about ±4°; consumer models hold a few tenths of a millimetre per metre (a minute of arc is 0.3 mm/m), professional ones better. A **rotating laser** spins one beam to draw a level *plane* across a site; a good one holds ±1.5 mm at 30 m, which is 10″, and a handheld detector finds the plane at distances of tens or hundreds of metres.

### The laser tracker
A tracker sends a beam to a **spherically mounted retroreflector** held on the part; the reflector sends it straight back, and the tracker steers to follow it. It measures the distance (by an interferometer or an absolute distance meter) and two angles (azimuth and elevation), and so gives the three-dimensional position of the reflector, to tens of micrometres over several metres.

### The air
Over long lines the air bends the beam. A layer of warm air near a surface acts as a mirage; a long path through a hot hall wanders by a millimetre or more. Even in a straight line, the curvature of the Earth makes the level line rise above the ground by $d^2/2R_E$: 0.78 mm at 100 m, 78 mm at 1 km.

> [!key] An alignment instrument is a way to draw a straight line and read offsets from it. The limits are the width of the beam, the wander of the air and the accuracy of the centroid; level lines are limited by gravity's pendulum and by the curvature of the Earth.
`,
  ideas: [
    'A line of sight (a cross-hair and an axis, or a laser beam) is the straightedge; targets read offsets from it.',
    'An alignment telescope reads offsets with an optical micrometer to about 0.01 mm and doubles as an autocollimator for perpendicularity.',
    'A laser line has a width w(z) that grows with distance; the optimum waist for a distance z is √(λz/π).',
    'Cross-line lasers level themselves with a damped pendulum; a rotating laser draws a level plane; a tracker measures the 3-D position of a reflector.',
    'An angular error θ becomes an offset Lθ: 10″ over 30 m is 1.5 mm; the Earth\'s curvature is 0.78 mm over 100 m.'
  ],
  pitfalls: [
    'A laser beam is an exact line — It has a width that grows with distance and it wanders in air; the centroid of the spot is the measurement, and its accuracy is a fraction of the width, not zero.',
    'A narrower beam at the laser is always better — A very small waist spreads fastest. Over a given distance there is an optimum waist, about 2 mm for 20 m; at 0.2 mm the beam is about seven times wider at the far end.',
    'A level laser line is level — It is level to the accuracy of the pendulum or the compensator (a few tenths of a millimetre per metre for cheap units), and over long distances it is also tangent to the Earth, not parallel to the ground.',
    'Green and red lasers of the same class are equally bright — The eye is four times more sensitive at 532 nm than at 635 nm, so a green one looks much brighter; it is not necessarily more powerful.'
  ],
  terms: [
    { term: 'Alignment telescope', def: 'A telescope with a precision cross-hair and a focusing lens that does not shift the line of sight, used to define a straight line and to read the offsets of targets from it; it can also work as an autocollimator.' },
    { term: 'Line of sight', def: 'The straight line, defined by a telescope axis or a laser beam, from which the offsets of targets are measured.' },
    { term: 'Optical micrometer', def: 'A plane-parallel plate in front of a telescope that can be tilted by a measured amount to shift the image sideways, so that the offset of a target from the cross-hair can be read to about 0.01 mm.' },
    { term: 'Cross-line laser', also: ['laser level'], def: 'A self-levelling laser that projects a horizontal and a vertical line, used for levelling and marking in building work.' },
    { term: 'Rotating laser', also: ['rotary laser'], def: 'A laser that spins a beam to sweep a level (or sloped) plane over a site, read by a detector held on a staff.' },
    { term: 'Laser tracker', def: 'An instrument that follows a spherically mounted retroreflector with a laser beam and gives its position from the measured distance and two angles.' }
  ],
  formulas: [
    {
      name: 'Offset from an angular error',
      expr: 'dy = L*th', tex: '\\delta = L\\,\\theta',
      vars: {
        dy: { name: 'offset at the distance L', q: 'length', unit: 'mm', tex: '\\delta' },
        L: { name: 'distance along the line', q: 'length', unit: 'm', value: 30, tex: 'L' },
        th: { name: 'angular error of the line', q: 'angle', unit: '″', value: 10, tex: '\\theta' }
      },
      note: 'Small angles. 1″ is 4.85 µrad: 4.85 µm per metre.',
      stories: { dy: 'A rotating laser plane is tilted by {th}. How far off level is it at a distance of {L}?', th: 'A line is {dy} off at a distance of {L}. By what angle is it in error?' }
    },
    {
      name: 'Best waist for a distance',
      expr: 'w0 = sqrt(lambda*z/pi)', tex: 'w_0 = \\sqrt{\\frac{\\lambda z}{\\pi}}',
      vars: {
        w0: { name: 'beam radius at the laser (waist) that gives the narrowest beam at z', q: 'length', unit: 'mm', tex: 'w_0' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 635, tex: '\\lambda' },
        z: { name: 'distance to the far target', q: 'length', unit: 'm', value: 20, tex: 'z' }
      },
      note: 'This waist puts the target at one Rayleigh range, where the beam radius is √2 times the waist. A smaller or a larger waist gives a wider beam at z. Gaussian beam of ideal quality.',
      stories: { w0: 'An alignment laser of wavelength {lambda} is to make the narrowest possible spot on a target {z} away. What waist radius should the beam have at the laser?' }
    },
    {
      name: 'Drop of the horizon (Earth\'s curvature)',
      expr: 'h = d^2/(2*RE)', tex: 'h = \\frac{d^2}{2 R_E}',
      vars: {
        h: { name: 'height of a level line above the ground', q: 'length', unit: 'mm', tex: 'h' },
        d: { name: 'distance along the line', q: 'length', unit: 'm', value: 100, tex: 'd' },
        RE: { name: 'radius of the Earth', q: 'length', unit: 'km', value: 6371, tex: 'R_E' }
      },
      note: 'Before refraction: the air reduces this drop by about a seventh.',
      stories: { h: 'A perfectly level line of sight is set up. How far above the ground (which follows the Earth\'s curve) is it at {d}?' }
    }
  ],
  examples: [
    {
      title: 'A tilted laser plane',
      q: 'A rotating laser has a level accuracy of 10″. How far from true level is its plane at 30 m, and at 100 m?',
      steps: [
        { text: 'An angle of 10″ is 48.5 µrad. At 30 m:', tex: '\\delta = L\\theta = 30\\ \\mathrm{m} \\times 48.5\\ \\mu\\mathrm{rad} = 1.46\\ \\mathrm{mm}' },
        'At 100 m the offset is 3.3 times larger: 4.8 mm.'
      ],
      a: '1.5 mm at 30 m and 4.8 mm at 100 m: the figure quoted by the maker ("±1.5 mm at 30 m") is 10″, whatever the distance.'
    },
    {
      title: 'How wide is the beam at the far bearing?',
      q: 'A red alignment laser (635 nm) leaves its window with a waist radius of 2 mm. What are its radius and diameter at 20 m?',
      steps: [
        { text: 'The Rayleigh range is', tex: 'z_R = \\frac{\\pi w_0^2}{\\lambda} = \\frac{\\pi (2\\ \\mathrm{mm})^2}{635\\ \\mathrm{nm}} = 19.8\\ \\mathrm{m}' },
        { text: 'At $z = 20$ m, about one Rayleigh range:', tex: 'w = w_0\\sqrt{1 + (z/z_R)^2} = 2\\ \\mathrm{mm} \\times \\sqrt{2.02} = 2.84\\ \\mathrm{mm}' }
      ],
      a: 'Radius 2.84 mm, diameter 5.7 mm. A quadrant detector can place the centre of this spot to a small fraction of its diameter. Starting with a waist of 0.2 mm would give a radius of 20 mm at 20 m, seven times as wide.'
    }
  ],
  quiz: [
    { q: 'A level laser line is tilted by 20″ over a span of 50 m. How far is the line off true level at the far end, in millimetres?', answer: 4.85, unit: 'mm', why: '$\\delta = L\\theta = 50\\ \\mathrm{m} \\times 20 \\times 4.848\\ \\mu\\mathrm{rad} = 4.85\\ \\mathrm{mm}$.' },
    { q: 'By how much does a perfectly level line of sight, 200 m long, rise above a ground that follows the Earth\'s curvature (R = 6371 km)? Answer in millimetres.', answer: 3.1, unit: 'mm', why: '$h = d^2/2R_E = (200\\ \\mathrm{m})^2/(2\\times 6.371\\times 10^6\\ \\mathrm{m}) = 3.14\\ \\mathrm{mm}$ (before the refraction of the air).' },
    { q: 'At equal power, a green laser (532 nm) looks brighter to the eye than a red one (635 nm).', a: true, why: 'The eye is about four times more sensitive at 532 nm than at 635 nm (the luminosity function), so a green beam looks much brighter without being more powerful.' },
    { q: 'Why does an alignment telescope with a lit cross-hair also help to check perpendicularity?', choices: ['It works as an autocollimator: a mirror square to the line returns the cross-hair image onto itself', 'It emits a plane of light', 'Its lens is flat', 'It measures the weight of the target'], a: 0, why: 'With a mirror on the part, the returned image of the cross-hair is centred only if the mirror is square to the line of sight, so a right-angle or tilt shows up directly.' },
    { q: 'A laser tracker gives the 3-D position of a reflector from…', choices: ['one distance (interferometer or absolute distance meter) and two angles', 'three distances measured by triangulation', 'the colour of the returned light', 'the time of one pulse only'], a: 0, why: 'The tracker has a rotating head with two angle encoders (azimuth and elevation) and a distance meter: spherical coordinates, converted to x, y, z.' }
  ],
  applications: [
    'Machine tools, turbines and ships: bores, bearings and shafts brought onto one line with an alignment telescope or laser.',
    'Building sites: cross-line lasers mark ceilings, tiles and partitions; rotating lasers set floor and foundation levels.',
    'Aircraft and spacecraft assembly, antennas and large machines: laser trackers measure jigs, structures and finished parts.',
    'Accelerators and telescopes: magnets and mirrors are aligned to a line and then monitored over the years.',
    'Optical benches: the same idea at small scale, with irises and a laser as the straight line ([[aligning-an-optical-system]]).'
  ],
  sources: [
    'ISO 10360-10, *Geometrical product specifications (GPS) — Acceptance and reverification tests for coordinate measuring systems — Laser trackers*.',
    'J. M. Rüeger, *Electronic Distance Measurement* (Springer) — phase and pulse rangefinders, atmospheric effects, the curvature of the Earth and refraction.',
    'T. Yoshizawa (ed.), *Handbook of Optical Metrology: Principles and Applications* (CRC Press) — alignment and the measurement of straightness.'
  ],
  sim: 'mt-alignment'
}

);
