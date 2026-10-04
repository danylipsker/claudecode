/* HYPER-OPTICS · content/understanding-optical-systems.js — the topic "How to read an optical system"
 * The capstone of the app: the method that turns any optical system into a chain of familiar links, and the two budgets.
 *   how-to-read-an-optical-system   the five questions, applied to one small camera from end to end
 *   following-the-light             source to detector; field planes and pupil planes interleaved; the field lens
 *   specifying-an-optical-system    the requirements table; depth, resolution and light squeeze the f-number into a window
 *   first-order-layout              thin lenses, track, magnification, aperture; the two sharp positions
 *   the-resolution-budget           diffraction, lens, pixels, focus, motion, vibration added in quadrature
 *   the-light-budget                scene to sensor in factors and stops; photons, electrons, signal-to-noise
 *   choosing-catalogue-components   singlet, achromat, triplet, camera lens: the traced blur of each
 *   tolerancing-and-alignment-budget focus, tilt, working distance, decentre; compensators; the order of alignment
 *   stray-light-and-baffling        ghosts, scatter, vanes and blackening
 *   testing-and-commissioning       bar target, distortion grid, flat field, focus over temperature
 *   optical-abbreviations           ninety-odd abbreviations in six families, each with the page that explains it
 * Numbers come from the optics engine (ray traces, MTF, photometry, camera formulas) and from calculations checked in node.
 */
Hyper.add(

/* ================================================================ the five questions */
{
  id: 'how-to-read-an-optical-system', parent: 'understanding-optical-systems', title: 'How to read an optical system', level: 1,
  short: 'Every optical system, from a phone camera to a chip-printing machine, can be read by asking the same five questions in the same order: where the light comes from, what is seen and how big, what limits the cone of rays, where the light ends up and how finely, and which blur or loss is worst. Ask them in turn and an intimidating instrument becomes a chain of familiar links.',
  keywords: ['optical system', 'how to read', 'five questions', 'block diagram', 'source detector', 'field', 'stop', 'budget', 'weakest link', 'understand optics', 'system view', 'AOI'],
  prereq: ['entrance-and-exit-pupils', 'field-of-view-and-focal-length', 'how-a-pixel-detects-light'],
  related: ['following-the-light', 'the-resolution-budget', 'the-light-budget', 'specifying-an-optical-system', 'the-phone-camera', 'the-vision-inspection-cell', 'physics:optical-instruments'],
  body: `
A lens catalogue lists focal lengths, f-numbers and coatings; a camera data sheet adds sensor formats, pixel sizes and mounts; a microscope turret carries numbers such as 40×/0.65. Each term is simple, but together they look like a wall. The way through is to stop reading the list and **follow the light**. Every optical system can be read by asking the same five questions, in the same order.

### The five questions

| | Ask | You are looking for | Pages |
|---|---|---|---|
| 1 | Where does the light come from? | the source, its spectrum, its power | [[light-sources-and-beams]], [[the-optical-spectrum]] |
| 2 | What is seen, and how big is the field? | the object, the field of view, the magnification | [[field-of-view-and-focal-length]], [[field-stop-and-field-of-view]] |
| 3 | What limits the cone of rays? | the aperture stop, the pupils, the f-number | [[aperture-stop]], [[the-f-number]] |
| 4 | Where does the light end up, and how finely is it sampled? | the detector or the eye, its pixels | [[sensor-formats-and-pixel-size]], [[how-a-pixel-detects-light]] |
| 5 | Of everything that blurs or dims the result, which is worst? | the largest blur, the largest loss | [[the-resolution-budget]], [[the-light-budget]] |

The first four *describe*: they turn the system into numbers. The fifth *judges*: it uses the numbers to find the weak link, the only place where effort pays.

### One example, end to end
A small camera inspects a part on a bench: a 1/1.8″ sensor (7.18 × 5.32 mm, pixels of 3.45 µm), a 25 mm lens at f/4, white LEDs, and 150 mm from lens to part.

1. **Light.** A white LED is a blue chip under a phosphor: a spectrum from about 430 to 700 nm, centred near 550 nm.
2. **Field.** The [[magnification-and-working-distance|magnification]] is $m = f/(s - f) = 25/125 = 0.2$: the sensor sees 35.9 × 26.6 mm of the part, and each pixel covers 17 µm of it.
3. **Stop.** The [[entrance-and-exit-pupils|entrance pupil]] is $D = f/N = 6.25$ mm; from the part it fills a cone of half-angle 1.2°. Close up the lens works at f/4.8, not f/4 (the [[the-f-number|working f-number]]).
4. **Detector.** 2081 × 1542 pixels, which record at most 145 lp/mm (the [[nyquist-sampling-and-aliasing|Nyquist limit]]), or 29 lp/mm on the part.
5. **Worst blur.** A perfect lens at f/4.8 spreads a point into an [[the-airy-disk|Airy disc]] 6.4 µm wide; two pixels are 6.9 µm; a good multi-element lens adds about 2.4 µm. In quadrature ([[the-resolution-budget]]) that is 9.7 µm. Diffraction and pixel size are nearly equal, so neither smaller pixels alone nor a better lens alone would help much.

And the light: at 100 cd/m² the sensor receives 3.1 lux, some 750 photons fall on a pixel in 5 ms, about 450 become electrons, and [[sensor-noise|shot noise]] alone limits the signal-to-noise ratio to about 21.

### Why this order, and other systems
Light comes first because nothing works without it and its spectrum fixes the wavelength in every later number. The field and the stop are geometry; the detector fixes the sampling; only then can the weakest link be named. A projector, a headset or a lighthouse is read the same way: the source may be a lamp and the detector an eye, but the questions do not change. [[following-the-light]] shows how the pieces connect.

> [!key] Five questions: the light, the field, the stop, the detector, the worst blur or loss. The first four turn a system into numbers; the fifth uses them to find the one place where an improvement is worth paying for.
`,
  ideas: [
    'Read a system by following the light: source, field, stop, detector, then the weakest link.',
    'The first four questions describe the system with numbers; the fifth uses them to find what limits it.',
    'A lens is one link of five: a perfect lens on coarse pixels, or with too little light, still fails.',
    'Diffraction, pixel size, lens aberrations, focus, motion and vibration are all blurs in micrometres that can be compared.',
    'The same five questions read a phone camera, a projector, a headset, an inspection cell or a telescope.'
  ],
  pitfalls: [
    'A system is described by its lens — The lens is one of five links. The light, the field, the stop and the detector matter as much, and the worst link is often not the lens at all.',
    'More pixels always mean a sharper picture — Pixels help only while they are smaller than the blur of the optics. Beyond that the detail is already lost, and more pixels add only noise and data.',
    'Fix the biggest blur with the best lens — The cheapest remedy is often elsewhere: a shorter exposure against motion, a lower f-number against diffraction, a firmer mount against vibration.'
  ],
  terms: [
    { term: 'Optical system', def: 'Any arrangement of a light source, optical parts and a detector (a camera, a microscope, a projector, a fibre link). It is read as a chain: source, illumination optics, object, imaging optics, detector.' },
    { term: 'The five questions', def: 'The reading method of this topic: where the light comes from; what is seen and how big; what limits the cone of rays; where the light ends up and how finely; which blur or loss is worst.' },
    { term: 'Error budget', also: ['budget', 'blur budget'], def: 'A list of every contribution to an error (blur, light lost, tilt) in common units, so that they can be compared, added and attacked in order of size.' },
    { term: 'Weakest link', also: ['limiting factor', 'dominant blur'], def: 'The single largest contribution to a combined error. Improving it helps most; improving the others, once it dominates, hardly shows.' }
  ],
  formulas: [
    {
      name: 'Focal length for a field of view',
      expr: 'f = s*ws/(ws + Wf)', tex: 'f = \\frac{s\\,w_{\\mathrm{s}}}{w_{\\mathrm{s}} + W}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        s: { name: 'distance from lens to part', q: 'length', unit: 'mm', value: 150 },
        ws: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 7.18, tex: 'w_{\\mathrm{s}}' },
        Wf: { name: 'width of the field on the part', q: 'length', unit: 'mm', value: 35.9, tex: 'W' }
      },
      note: 'A thin lens, focused on the part: the magnification is m = w_s / W and f = s · m / (1 + m).',
      stories: { f: 'A sensor {ws} wide must see a field {Wf} wide from a distance of {s}. What focal length does the lens need?', Wf: 'A {f} lens is {s} from the part and the sensor is {ws} wide. How wide is the field?' }
    },
    {
      name: 'Pixel footprint on the part',
      expr: 'g = p/m', tex: 'g = \\frac{p}{m}',
      vars: {
        g: { name: 'size of one pixel on the part', q: 'length', unit: 'µm' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 },
        m: { name: 'magnification (image size ÷ object size)', value: 0.2, min: 0.001, max: 100 }
      },
      note: 'Half this number is the smallest detail the pixels could ever show; real systems need two to four pixels across a feature.',
      stories: { g: 'A camera with {p} pixels images a part at a magnification of {m}. How much of the part does one pixel cover?' }
    }
  ],
  examples: [
    {
      title: 'Which lens for a 60 mm field?',
      q: 'The same 7.18 mm wide sensor must see a 60 mm wide part from 200 mm. A catalogue offers 16, 25 and 35 mm lenses. Which will do, and how fine is the sampling on the part?',
      steps: [
        { text: 'The focal length that gives exactly 60 mm:', tex: 'f = \\frac{s\\,w_{\\mathrm{s}}}{w_{\\mathrm{s}} + W} = \\frac{200 \\times 7.18}{7.18 + 60} = 21.4\\ \\mathrm{mm}' },
        'A 25 mm lens is too long: its magnification is 25/175 = 0.143 and its field only 7.18/0.143 = 50 mm.',
        'A 16 mm lens gives $m = 16/184 = 0.087$ and a field of 82.6 mm, enough with margin.',
        'Each pixel then covers $3.45/0.087 = 40$ µm of the part, so a defect needs to be at least about 120 µm across to span three pixels.'
      ],
      a: 'The 16 mm lens (21.4 mm is not offered, 25 mm is too narrow). The price of the margin is 40 µm per pixel.'
    },
    {
      title: 'Pixel or diffraction?',
      q: 'A camera with 2.4 µm pixels looks at a part at a magnification of 0.1, in green light (550 nm). Which is larger, the Airy disc or two pixels, at f/8 and at f/4?',
      steps: [
        'Two pixels are 4.8 µm.',
        'At f/8 the working f-number is $8 \\times 1.1 = 8.8$, and the Airy disc is $2.44 \\times 0.55 \\times 8.8 = 11.8$ µm: diffraction is 2.5 times larger.',
        'At f/4 the working f-number is 4.4 and the disc is 5.9 µm, close to the 4.8 µm of the pixels.'
      ],
      a: 'At f/8 diffraction dominates; at f/4 the two are about equal. Smaller pixels would be wasted at f/8.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT one of the five questions?', choices: ['What does the system cost?', 'Where does the light come from?', 'What limits the cone of rays?', 'Which blur or loss is worst?'], a: 0, why: 'Cost matters, but it is a requirement, not a step in reading how the light is handled. The five questions follow the light: source, field, stop, detector, weakest link.' },
    { q: 'A perfect lens still gives a soft picture if the pixels are larger than the detail to be seen.', a: true, why: 'The sampling by the pixels is one of the blurs. It is the weakest link here, and nothing done to the lens will improve it.' },
    { q: 'A 25 mm lens is 150 mm from a part. What is the magnification (taken as positive)?', answer: 0.2, why: '$m = f/(s - f) = 25/(150 - 25) = 0.2$.' },
    { q: 'In an example the Airy disc is 6.4 µm, two pixels are 6.9 µm and the lens adds 2.4 µm. What is the sensible conclusion?', choices: ['The lens is the weak link and must be replaced', 'Diffraction and pixel size are about equal, so both must shrink for a real gain', 'Nothing can be improved', 'Only the pixels matter, because they are largest'], a: 1, why: 'Added in quadrature the three give 9.7 µm. Halving only the pixels gives 7.7 µm, halving only diffraction 8.0 µm; shrinking both gives about 5.3 µm. The lens is a minor contribution.' },
    { q: 'Why does the reading method start with the light?', choices: ['Because lamps are the most expensive part', 'Because every later number, from diffraction to sensitivity, depends on the wavelengths and the power available', 'Because the sensor is chosen last', 'It does not matter in which order the questions are asked'], a: 1, why: 'The spectrum fixes the wavelength used for diffraction, glass, coatings and detector response, and the power fixes the signal. The order is chosen so that each answer feeds the next.' }
  ],
  applications: [
    'Setting up a machine-vision cell: field, working distance, f-number, pixel size and light are read off in the order of the five questions before a lens is ordered.',
    'Reading a camera or lens data sheet: each line belongs to one of the five questions, and the missing ones show what the sheet leaves out.',
    'Finding out why a picture is soft: the budget says whether to look at the lens, the focus, the exposure or the pixels.',
    'Understanding a new instrument in a course or a workshop: a projector, a spectrometer or a headset is learned faster as source, field, stop, detector.',
    'Writing a purchase or design specification, where each requirement is attached to the link it constrains (see [[specifying-an-optical-system]]).'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the sections on first-order optics, stops and pupils, and image evaluation.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — one-page definitions of stops, pupils, conjugates and the paraxial ray trace.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — the system view of imaging, with the contributions to blur and noise.'
  ],
  sim: 'us-five-questions'
},

/* ================================================================ source to detector, field planes and pupil planes */
{
  id: 'following-the-light', parent: 'understanding-optical-systems', title: 'Following the light: source to detector', level: 1,
  short: 'The block diagram of any optical system is source, illumination optics, object, imaging optics, detector. Inside it two families of planes alternate: field planes, which are images of the object, and pupil planes, which are images of the stop. Knowing which is which tells you where a stop, a lens, a filter or a speck of dust belongs, and what it will do.',
  keywords: ['conjugate planes', 'field plane', 'pupil plane', 'field lens', 'relay', 'block diagram', 'chief ray', 'marginal ray', 'Kohler', 'interleaved', 'image planes', 'stop images'],
  prereq: ['how-to-read-an-optical-system', 'aperture-stop', 'chief-and-marginal-rays', 'the-thin-lens-equation'],
  related: ['field-stop-and-field-of-view', 'condensers-and-kohler-illumination', 'microscope-illumination-and-contrast', 'the-optical-invariant', 'telecentricity', 'entrance-and-exit-pupils'],
  body: `
Take any optical system and draw it as a chain: **source → illumination optics → object → imaging optics → detector**. A microscope has all five links; a camera has only the last three, because the Sun or a flash does the first two; a laser scanner has the first two and no imaging at all. Inside the imaging half, every lens does two jobs at once.

### Two families of planes
A lens forms an image of whatever stands in front of it ([[the-thin-lens-equation]]). The object and its image lie in **conjugate planes**, and so do that image and its image in the next lens, all down the chain. These are the **field planes**: each is a picture of the scene, in which the scene is sharp.

The lenses also image the **aperture stop**, the opening that limits the cone of light ([[aperture-stop]]). Its images before and after it are the pupils ([[entrance-and-exit-pupils]]), and the planes where they lie are the **pupil planes**. Along a chain the two families interleave: field, pupil, field, pupil, field.

On a ray diagram ([[chief-and-marginal-rays]]):
- a **marginal ray**, from the axis point of the object to the edge of the stop, crosses the axis at every *field* plane;
- the **chief ray**, from the edge of the field through the centre of the stop, crosses it at every *pupil* plane.

The simulation below draws both through a two-lens relay and marks the planes F and P.

### Why the difference matters

| In the plane there is | At a field plane | At a pupil plane |
|---|---|---|
| a stop | a **field stop**: the sharp edge of the picture ([[field-stop-and-field-of-view]]) | the **aperture stop**: sets the cone, so brightness and blur, evenly over the field |
| dust or a scratch | seen as sharp spots (dust on the sensor cover glass, at small apertures) | smeared: the picture is just a little dimmer |
| a lens | a **field lens**: bends the beam, cannot change the picture | changes the focus and size of the picture, not where the chief rays go |

### The field lens
A relay of two 50 mm lenses carries an object of half-height 10 mm to an image twice its size. The chief ray from the edge of the object reaches the second lens 33 mm from the axis, so that lens needs a clear radius of 33 mm, or the edge of the picture is lost. Put one more lens at the intermediate image, a field plane. It cannot change the image, which is already formed there, but it bends the chief ray towards the axis. Choose its focal length to image the stop onto the second lens: with the stop 150 mm in front and the lens 100 mm behind, $1/f = 1/150 + 1/100$, so f = 60 mm. The chief ray now crosses lens 2 at its centre, and a much smaller lens will do.

### Köhler illumination
A microscope has the lamp filament in a pupil plane and the field diaphragm in a field plane ([[condensers-and-kohler-illumination|Köhler illumination]]). The field planes are the field diaphragm, the specimen, the intermediate image and the retina; the pupil planes are the filament, the condenser diaphragm, the back focal plane of the objective and the pupil of the eye. Closing the field diaphragm crops the picture; closing the condenser diaphragm changes contrast and resolution, not the cropping.

> [!key] A system is a chain, and in it two families of planes alternate: field planes (images of the object, where the marginal ray meets the axis) and pupil planes (images of the stop, where the chief ray meets it). Put a stop, a lens or a filter in the plane that matches its job.
`,
  ideas: [
    'Source, illumination optics, object, imaging optics, detector: the block diagram of every system.',
    'Field planes are images of the object; pupil planes are images of the stop. They alternate along the chain.',
    'The marginal ray meets the axis at field planes; the chief ray meets it at pupil planes.',
    'A field lens sits at a field plane: it steers the beam without changing the picture.',
    'In Köhler illumination the filament and condenser diaphragm are in pupil planes, the field diaphragm and specimen in field planes.'
  ],
  pitfalls: [
    'The aperture stop is always at a lens — It can be anywhere along the chain. What it always has is images: the pupils, which are real planes of the system whether or not any hardware sits there.',
    'Dust on the front lens makes dark spots in the picture — The front glass is far from a field plane, so dust on it is out of focus and only dims the picture slightly. Dust on a sensor cover glass, near a field plane, shows as dark spots, sharpest at small apertures.',
    'Field planes and pupil planes are two names for the same thing — They are different conjugate families. A lens at a field plane changes where the beam goes but not the picture; a lens at a pupil plane changes the picture but not where the chief rays go.'
  ],
  terms: [
    { term: 'Conjugate planes', also: ['object and image planes', 'conjugates'], def: 'A pair of planes of which one is the image of the other in an optical system. Every point in one is sharply imaged to a point in the other.' },
    { term: 'Field plane', also: ['image plane', 'intermediate image'], def: 'A plane in which the object, or an image of it, lies. The scene is sharp there; a field stop or a reticle placed in it shows sharply in the picture.' },
    { term: 'Pupil plane', also: ['pupil', 'stop image'], def: 'A plane in which the aperture stop, or an image of it, lies. The cone of light is limited there; a mask placed in it shapes the beam, not the picture.' },
    { term: 'Field lens', def: 'A lens placed at (or near) a field plane. It leaves the picture unchanged but bends the beam so that the pupil is imaged where the next lens needs it.' },
    { term: 'Relay', also: ['relay lens'], def: 'A lens or group that carries an image from one field plane to the next, as in a periscope, an endoscope or a microscope tube.' }
  ],
  formulas: [
    {
      name: 'Field lens that images the pupil onto the next lens',
      expr: 'f = a*b/(a + b)', tex: 'f = \\frac{a\\,b}{a + b}',
      vars: {
        f: { name: 'focal length of the field lens', q: 'length', unit: 'mm' },
        a: { name: 'distance from the stop (or pupil) to the field lens', q: 'length', unit: 'mm', value: 150 },
        b: { name: 'distance from the field lens to the next lens', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The thin-lens equation 1/f = 1/a + 1/b, where the stop is the object and the next lens is where its image must land.',
      stories: { f: 'The stop of a relay is {a} in front of the field lens, and the second lens is {b} behind it. What focal length puts the image of the stop on the second lens?' }
    }
  ],
  examples: [
    {
      title: 'A field lens for the relay',
      q: 'In the relay of the text (two 50 mm lenses, object 75 mm before the first, the intermediate image 225 mm from the object plane, the second lens 325 mm), which focal length must the field lens at the intermediate image have, and where does the image of the stop fall without it?',
      steps: [
        'The stop is at lens 1, 75 mm from the object plane; the field lens is at 225 mm: a = 150 mm. Lens 2 is at 325 mm: b = 100 mm.',
        { text: 'Field lens:', tex: 'f = \\frac{150 \\times 100}{150 + 100} = 60\\ \\mathrm{mm}' },
        'Without it, the stop is 250 mm in front of lens 2, whose image lies at $1/s_i = 1/50 - 1/250$, so $s_i = 62.5$ mm behind lens 2, at 387.5 mm.'
      ],
      a: 'f = 60 mm. Without it the exit pupil lies 62.5 mm behind the second lens; with it, on the second lens itself.'
    }
  ],
  quiz: [
    { q: 'The marginal ray from the axis point of an object crosses the optical axis. Where?', choices: ['At the field planes: the object and its images', 'At the pupil planes', 'Only at the lenses', 'Nowhere: it is parallel to the axis'], a: 0, why: 'A ray from the axis point must meet the axis again where that point is imaged, and the images of the object are the field planes.' },
    { q: 'The chief ray goes from the edge of the object through the centre of the stop. It crosses the axis at a pupil plane.', a: true, why: 'The centre of the stop is on the axis, and so is its image in every other plane that images the stop: the pupil planes.' },
    { q: 'A field lens is placed in the plane of an intermediate image. What does it do to the size and position of the images?', choices: ['Nothing: it only redirects the beam', 'It doubles the magnification', 'It moves the image', 'It removes the pupil'], a: 0, why: 'At a field plane the marginal ray from the axis point has zero height, so a lens there does not bend it; the images stay put. It does bend the chief ray, which is what it is for.' },
    { q: 'A stop 150 mm before a field lens must be imaged 100 mm behind it. What focal length (mm) does the field lens need?', answer: 60, why: '$1/f = 1/150 + 1/100 = 1/60$.' },
    { q: 'Which closes the picture like a window with sharp edges, a field diaphragm or a condenser diaphragm in a microscope?', choices: ['The field diaphragm (a field plane)', 'The condenser diaphragm (a pupil plane)', 'Both equally', 'Neither'], a: 0, why: 'The field diaphragm is imaged on the specimen, so its edge appears sharp in the picture. The condenser diaphragm sets the cone, and so the contrast and the resolution, not the cropping.' }
  ],
  applications: [
    'Microscopes: Köhler illumination sets the field diaphragm and the condenser diaphragm in their two families of planes (see [[microscope-illumination-and-contrast]]).',
    'Telescopes, binoculars and periscopes: a field lens or a relay carries the image along the tube while keeping the beam on the lenses; the exit pupil is the plane where the eye goes.',
    'Projectors: a field lens next to the picture panel images the pupil of the illumination into the projection lens, so that the whole picture is lit evenly.',
    'Machine-vision lenses: a stop placed at a focal plane makes the pupil infinitely far away, which is what [[telecentricity]] means.',
    'Cleaning and inspection: dust on a plane that is conjugate to the detector shows as spots; on other planes it only dims.'
  ],
  history: 'The idea of imaging the lamp into the condenser, rather than onto the specimen, was published in 1893 by August Köhler at Zeiss for photomicrography.',
  sources: [
    'E. Hecht, *Optics* — the sections on stops, pupils and the field stop in the chapter on geometrical optics.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — marginal and chief rays, stops and pupils, relays and field lenses.',
    'W. J. Smith, *Modern Optical Engineering* — the treatment of stops, pupils and the paraxial ray trace.'
  ],
  sim: 'us-conjugates'
},

/* ================================================================ specifying */
{
  id: 'specifying-an-optical-system', parent: 'understanding-optical-systems', title: 'Specifying an optical system', level: 2,
  short: 'A specification is a list of requirements: field, working distance, resolution, wavelength, light level, speed, environment, size, cost. Each line forbids some designs. Depth of field, resolution and light all act on the f-number and pull in different directions, so together they leave a window of possible f-numbers, which is sometimes empty.',
  keywords: ['specification', 'requirements', 'f-number window', 'depth of field', 'resolution', 'light level', 'constraint', 'trade-off', 'working distance', 'field', 'design brief', 'AOI'],
  prereq: ['how-to-read-an-optical-system', 'the-f-number', 'depth-of-field'],
  related: ['first-order-layout', 'the-resolution-budget', 'the-light-budget', 'choosing-a-machine-vision-lens', 'reading-a-lens-datasheet', 'testing-and-commissioning', 'pixels-per-feature'],
  body: `
A specification states what the system must do. Writing one is the first act of optical design, and its discipline is to put every requirement as a number that a test can check.

| Requirement | Example | What it fixes |
|---|---|---|
| Field | 40 mm wide | magnification and focal length, with the sensor ([[field-of-view-and-focal-length]]) |
| Working distance | 200 mm | the focal length again; room for lights |
| Resolution | detail of 0.1 mm | pixel size, lens [[the-modulation-transfer-function|MTF]], largest f-number ([[the-resolution-budget]]) |
| Depth of field | 2 mm in all | smallest f-number ([[depth-of-field]]) |
| Wavelength | 450–650 nm | glasses, coatings, detector |
| Light | part at 1000 cd/m² | largest f-number and the exposure ([[the-light-budget]]) |
| Speed | 5 ms, 30 frames/s | exposure, light, data rate |
| Environment | 0–50 °C, vibration | athermalization, mounts ([[thermal-effects-in-optics]]) |
| Size, cost | 100 mm; catalogue parts | the track, the f-number; stock or custom |

### The window
Three lines act on the f-number N and pull in opposite directions:
- **Depth of field** wants a slim cone, so a large N: $N \\ge Z\\,m^2 / (2c(1+m))$ for a total depth Z, magnification m and tolerated blur c.
- **Resolution** wants diffraction ([[the-airy-disk|the Airy disc]]) not to wipe out the finest detail. At $\\nu = 1/(2dm)$ on the sensor it must keep 20 % contrast, which needs $N_w \\le 0.687/(\\lambda\\nu)$, with $N_w = N(1+m)$ the [[the-f-number|working f-number]].
- **Light** wants a bright image, so a small N: at the shot-noise limit the [[sensor-noise|signal-to-noise ratio]] falls as 1/N.

The design exists only where the three allowed ranges overlap; the simulation draws them as bars and their intersection.

### A worked case
A 40 mm field on a 2/3″ sensor (8.8 mm wide, 3.45 µm pixels) from 200 mm: $m = 0.22$ and $f = 36$ mm. The finest line is 100 µm wide, the part must stay sharp over 2 mm, it is lit to 1000 cd/m², and the exposure is 5 ms.
- Depth of field requires $N \\ge 5.7$.
- Diffraction allows N up to 45.
- The light (signal-to-noise ratio 30, shot noise only) allows N up to 8.8.

The window is f/5.7 to f/8.8, and f/8 fits. Now ask for 6 mm of depth: it needs N ≥ 17, but the light allows 8.8. The specification contradicts itself, and no lens can satisfy it.

### When the window is empty
There are four ways out, of unequal cost: **more light** (here 3.9 times, because the allowed N goes as the root of light × exposure: a stronger LED, a strobe, a longer exposure if nothing moves); **less depth** (a fixture that holds the part to 2 mm); a **different magnification** (more cameras); or a **different technique** (focus stacking, a [[telecentric-imaging|telecentric lens]], a height sensor).

### Writing a line well
A good line has a number, a unit, a tolerance and a test. "Sharp" is a wish; "MTF of at least 0.3 at 30 lp/mm over the whole field, by the slanted-edge method" is a requirement ([[testing-and-commissioning]]).

> [!key] Each line of a specification forbids some designs, and the f-number is where depth, resolution and light collide. Find the window before choosing parts; when it is empty, change the cheapest line.
`,
  ideas: [
    'A requirement is a number, a unit, a tolerance and a test; "sharp" and "bright" are wishes.',
    'Field and working distance fix the focal length; resolution and the pixels fix what the lens must resolve.',
    'Depth of field gives a smallest f-number; resolution and light each give a largest one.',
    'The allowed f-numbers are the overlap of three ranges; if the overlap is empty the specification is contradictory.',
    'The cheapest way out is usually more light or less depth, not a better lens.'
  ],
  pitfalls: [
    'A better lens can always satisfy a demanding specification — A lens cannot beat diffraction or the photon count. If depth of field and light need incompatible f-numbers, only a change of requirement helps.',
    'Resolution is a property of the lens — It is the result of the lens, the pixels, the focus, the light and the motion together. A specification must name the whole system.',
    'Specify the maximum everything — Each demand costs something somewhere else: more depth costs light, more resolution costs depth, more field costs pixels per detail. A good specification states what matters most.'
  ],
  terms: [
    { term: 'Specification', also: ['requirements', 'spec'], def: 'A list of what a system must do, each line given as a measurable number with a tolerance and a test.' },
    { term: 'Working distance', also: ['WD'], def: 'The distance from the front of the lens to the object. It fixes how much room there is for lights, fixtures and the part itself.' },
    { term: 'Allowed window', also: ['design window'], def: 'The range of a design variable (here the f-number) that satisfies every requirement at once. It can be wide, narrow or empty.' },
    { term: 'Trade-off', def: 'A pair of requirements that pull a design variable in opposite directions, so that gaining on one loses on the other.' }
  ],
  formulas: [
    {
      name: 'Total depth of field at close range',
      expr: 'Z = 2*N*c*(m + 1)/m^2', tex: 'Z = \\frac{2\\,N\\,c\\,(m + 1)}{m^2}',
      vars: {
        Z: { name: 'total depth of field', q: 'length', unit: 'mm' },
        N: { name: 'f-number (engraved)', value: 5.7, min: 0.5, max: 64 },
        c: { name: 'blur accepted (circle of confusion)', q: 'length', unit: 'µm', value: 6.9 },
        m: { name: 'magnification', value: 0.22, min: 0.001, max: 100 }
      },
      note: 'Valid when the magnification is not tiny; solve for N to find the smallest f-number that gives a wanted depth.',
      stories: { Z: 'A lens at f/{N} has a magnification of {m} and tolerates a blur of {c}. How deep is the zone of sharp focus?', N: 'A depth of {Z} is wanted at a magnification of {m}, with a blur of {c} accepted. What f-number is the least that gives it?' }
    },
    {
      name: 'Frequency of the finest detail on the sensor',
      expr: 'nu = 1/(2*d*m)', tex: '\\nu = \\frac{1}{2\\,d\\,m}',
      vars: {
        nu: { name: 'spatial frequency on the sensor', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu' },
        d: { name: 'width of the smallest line to resolve (on the part)', q: 'length', unit: 'µm', value: 100 },
        m: { name: 'magnification', value: 0.22, min: 0.001, max: 100 }
      },
      note: 'A line pair is a bright and a dark line, so its period is 2d on the part and 2dm on the sensor.',
      stories: { nu: 'The smallest line to be resolved is {d} wide and the magnification is {m}. What spatial frequency does that put on the sensor?' }
    },
    {
      name: 'Largest working f-number that keeps 20 % contrast',
      expr: 'Nw = 0.687/(lambda*nu)', tex: 'N_w = \\frac{0.687}{\\lambda\\,\\nu}',
      vars: {
        Nw: { name: 'working f-number', tex: 'N_w' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        nu: { name: 'spatial frequency of the detail', q: 'spatialfreq', unit: 'lp/mm', value: 22.7, tex: '\\nu' }
      },
      note: 'The diffraction MTF of a perfect lens falls to 0.2 at 0.687 of its cut-off 1/(λ N_w). Divide by (1 + m) for the engraved f-number.',
      stories: { Nw: 'A pattern of {nu} must keep 20 % contrast through a perfect lens in {lambda} light. What is the largest working f-number?' }
    }
  ],
  examples: [
    {
      title: 'The window of the worked case',
      q: 'For the case of the text (m = 0.22, 3.45 µm pixels, a blur of two pixels accepted, depth 2 mm, a line 100 µm wide), find the smallest f-number that gives the depth and the largest that keeps the line resolved.',
      steps: [
        { text: 'Depth of field, solved for N, with c = 6.9 µm:', tex: 'N \\ge \\frac{Z\\,m^2}{2c(1+m)} = \\frac{2 \\times 0.0484}{2 \\times 0.0069 \\times 1.22} = 5.7' },
        { text: 'The line has the frequency', tex: '\\nu = \\frac{1}{2 \\times 0.1\\ \\mathrm{mm} \\times 0.22} = 22.7\\ \\mathrm{lp/mm}' },
        { text: 'and so the largest working f-number is', tex: 'N_w \\le \\frac{0.687}{0.00055\\ \\mathrm{mm} \\times 22.7\\ \\mathrm{mm^{-1}}} = 55, \\quad N = \\frac{55}{1.22} = 45' }
      ],
      a: 'From f/5.7 up to f/45 on grounds of depth and resolution; the light then trims the top to f/8.8.'
    },
    {
      title: 'How much more light does 6 mm of depth need?',
      q: 'The case needs N ≥ 17.25 for 6 mm of depth but the light allows only N = 8.78. By what factor must light × exposure rise to allow f/17.25?',
      steps: [
        'For shot noise the allowed N goes as the square root of (light × exposure).',
        { text: 'The factor is', tex: '\\left(\\frac{17.25}{8.78}\\right)^2 = 3.9' }
      ],
      a: 'About 3.9 times more light or exposure (nearly two stops): a stronger LED, a strobe, or a slower shutter if nothing moves.'
    }
  ],
  quiz: [
    { q: 'Which requirement pushes the f-number UP (towards a slimmer cone)?', choices: ['Depth of field', 'Resolution', 'Light level', 'Exposure time'], a: 0, why: 'The zone of sharp focus grows in proportion to N. Resolution (diffraction) and light both push N down.' },
    { q: 'If the allowed ranges for depth, resolution and light do not overlap, a better lens will fix the problem.', a: false, why: 'A lens cannot beat diffraction or the number of photons. The specification must change: more light, less depth, a different magnification or a different technique.' },
    { q: 'A line 50 µm wide is imaged at m = 0.1. What spatial frequency (lp/mm) does it have on the sensor?', answer: 100, why: '$\\nu = 1/(2dm) = 1/(2 \\times 0.05\\ \\mathrm{mm} \\times 0.1) = 100$ lp/mm.' },
    { q: 'A system needs N ≥ 12 for depth and the light allows N ≤ 6. To allow f/12, light × exposure must rise by', choices: ['a factor 2', 'a factor 4', 'a factor 8', 'a factor 12'], a: 1, why: 'The allowed N goes as the square root of light × exposure, so doubling N needs four times as much.' },
    { q: 'Why is "the picture must be sharp" a poor line in a specification?', choices: ['Because sharpness cannot be measured at all', 'It has no number, unit, tolerance or test, so two people can disagree about whether it is met', 'Because lenses are never sharp', 'Because it is too easy to meet'], a: 1, why: 'A requirement must be checkable: for example an MTF value at a stated frequency over a stated part of the field, measured by a stated method.' }
  ],
  applications: [
    'Writing the request for a machine-vision system, so that an integrator can bid against numbers rather than adjectives.',
    'Ordering a custom lens: the optical drawing and the specification sheet fix the design the manufacturer may use (see [[optical-drawings-and-iso-10110]]).',
    'Choosing a camera and lens for a photography job, where depth, shutter speed and light compete in the exposure triangle.',
    'Settling an argument between production (more depth, a fast line) and quality (more resolution) by showing that the window is empty.',
    'Teaching: the window picture shows why an optical system is a compromise, not a search for the best of everything.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the discussion of system requirements and first-order layout.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — the numbers a camera specification should state.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — how a custom part is specified.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — the interplay of optics, pixels and noise in a system specification.'
  ],
  sim: 'us-spec-window'
},

/* ================================================================ first-order layout */
{
  id: 'first-order-layout', parent: 'understanding-optical-systems', title: 'The first-order layout', level: 2,
  short: 'Before any glass is chosen, an optical system is a handful of ideal thin lenses: focal lengths, spacings, openings and one magnification that must satisfy the field, the track and the aperture. The thin-lens equation and ray-transfer matrices settle this on paper; a real design then has only to realise it.',
  keywords: ['first-order layout', 'paraxial layout', 'thin lens', 'total track', 'magnification', 'two sharp positions', 'Bessel', 'telephoto', 'back focal distance', 'lens diameter', 'ray transfer matrix', 'BFL', 'EFL'],
  prereq: ['the-thin-lens-equation', 'combining-thin-lenses', 'ray-transfer-matrices', 'specifying-an-optical-system'],
  related: ['thick-lenses-and-principal-planes', 'choosing-catalogue-components', 'telephoto-lens', 'zoom-lens-principles', 'following-the-light', 'cardinal-points'],
  body: `
Before any glass is chosen, an optical system is a handful of ideal thin lenses: focal lengths, spacings, openings and one magnification that must satisfy the field, the track and the aperture. This is the **first-order layout**. It can be settled with a pencil, the thin-lens equation and, for several lenses, ray-transfer matrices. A real design then has to realise it.

### One lens: the track
With the "real is positive" convention, an object a distance $s_o$ in front of a thin lens of focal length f forms an image a distance $s_i$ behind it, $1/s_o + 1/s_i = 1/f$, with [[lateral-and-longitudinal-magnification|magnification]] $m = -s_i/s_o$ ([[the-thin-lens-equation]]). The distance from object to image is the **track**, $TT = s_o + s_i$. Given the track and the size ratio $|m|$ everything follows:

$$s_o = \\frac{TT}{1+|m|}, \\qquad s_i = |m|\\,s_o, \\qquad f = \\frac{|m|\\,TT}{(1+|m|)^2}$$

A copier that must reduce by one half on a 500 mm track needs $f = 111$ mm, with the object 333 mm and the image 167 mm from the lens. The shortest track that gives a real image is $TT = 4f$, at $|m| = 1$.

### Two places for the lens
Fix the object, the sensor and f, and slide the lens. The picture is sharp only where the image lands on the sensor, and when $TT > 4f$ this happens at **two** positions, $s_o = \\tfrac12\\left(TT \\pm \\sqrt{TT^2 - 4\\,TT\\,f}\\right)$. With TT = 300 mm and f = 50 mm they are 63.4 mm and 236.6 mm from the object; the magnifications are −3.73 and −0.268, reciprocals of each other. For $TT < 4f$ there is no sharp position at all.

### Several lenses
Two thin lenses a distance d apart behave as one lens with

$$\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2}$$

and a [[cardinal-points|back focal distance]] $f_2(f_1 - d)/(f_1 + f_2 - d)$. A +100 mm lens followed 60 mm behind by a −50 mm lens has $f = 500$ mm and a back focal distance of 200 mm: a 500 mm lens in a package 260 mm long. That is the **telephoto** principle ([[telephoto-lens]]). For three or more lenses write each as a ray-transfer matrix, multiply them in order, and read f and the principal planes from the product ([[ray-transfer-matrices]], [[combining-thin-lenses]]).

### Apertures
The f-number gives each lens its size: the entrance pupil has $D = f/N$. But every lens must also pass the beam from the whole field. The radius needed at a lens is about the height of the [[chief-and-marginal-rays|marginal ray plus that of the chief ray]] there; [[following-the-light]] shows the field lens that keeps it small.

### The order of work
1. The field and the distance (or the track) fix the magnification and f.
2. The light and the depth fix N, so the opening.
3. The mechanical length fixes the spacings.
4. Trace the marginal and chief rays through every lens to find each diameter.
5. Only then pick real lenses ([[choosing-catalogue-components]]) and check what first order cannot see: the [[what-aberrations-are|aberrations]].

First order is honest about distances and sizes and silent about image quality. A layout that closes perfectly on paper may be unbuildable at f/0.8, or with a 60° field. Treat it as the shopping list, not the verdict.

> [!key] On a given track a magnification fixes f: $f = |m|\\,TT/(1+|m|)^2$, and at least $TT = 4f$ is needed. Several lenses combine as $1/f = 1/f_1 + 1/f_2 - d/(f_1 f_2)$. Settle distances and sizes first; the aberrations come afterwards.
`,
  ideas: [
    'A first-order layout is a set of thin lenses with focal lengths, spacings and diameters, settled before any real lens is chosen.',
    'On a track TT with magnification m the single lens has f = |m| TT/(1 + |m|)², and a real image needs TT ≥ 4f.',
    'When TT > 4f the lens has two sharp positions, with reciprocal magnifications; when TT < 4f it has none.',
    'Two lenses combine as 1/f = 1/f₁ + 1/f₂ − d/(f₁f₂); a positive lens followed by a negative one makes a short telephoto.',
    'Each lens must be large enough for the marginal ray plus the chief ray at that lens.'
  ],
  pitfalls: [
    'The lens sits one focal length from the sensor — Only when the object is at infinity. For a nearer object the image distance is f(1 + m), always longer than f.',
    'Powers and focal lengths of two lenses simply add — Powers (1/f) add, and only for lenses in contact; at a spacing d there is the extra term −d/(f₁f₂), which is the whole point of a telephoto.',
    'A layout that closes on paper can be built — First order ignores aberrations, glass thickness and mounting. A fast aperture, a wide field or a very short track may have no real lens design at all.'
  ],
  terms: [
    { term: 'First-order layout', also: ['paraxial layout', 'first-order design'], def: 'The arrangement of ideal thin lenses (focal lengths, spacings, diameters, magnification) that meets the field, track and aperture, before aberrations or real glass are considered.' },
    { term: 'Total track', also: ['TT', 'track length', 'conjugate distance'], def: 'The distance from the object to its image, or from the first surface of a lens system to the sensor. For one thin lens, so + si.' },
    { term: 'Thin lens', def: 'An idealised lens of zero thickness described by its focal length alone. It is the sketching tool of first-order layout.' },
    { term: 'Back focal distance', also: ['BFL', 'back focal length'], def: 'The distance from the last surface of a lens system to its rear focal point. For two thin lenses, f₂(f₁ − d)/(f₁ + f₂ − d).' }
  ],
  formulas: [
    {
      name: 'Focal length from the track and the magnification',
      expr: 'f = m*TT/(1 + m)^2', tex: 'f = \\frac{m\\,\\mathrm{TT}}{(1 + m)^2}',
      vars: {
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm' },
        m: { name: 'magnification (taken positive)', value: 0.5, min: 0.01, max: 100 },
        TT: { name: 'total track, object to image', q: 'length', unit: 'mm', value: 500 }
      },
      note: 'Solving for m gives two answers, m and 1/m: the two sharp positions of the lens. No answer exists when TT < 4f.',
      stories: { f: 'A lens must image an object at {m} of its size on a track of {TT}. What focal length does it need?', m: 'A lens of {f} must form a sharp image on a track of {TT}. At what magnification can it do so?' }
    },
    {
      name: 'Two thin lenses',
      expr: 'f = f1*f2/(f1 + f2 - d)', tex: 'f = \\frac{f_1\\,f_2}{f_1 + f_2 - d}',
      vars: {
        f: { name: 'focal length of the pair', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of lens 1', q: 'length', unit: 'mm', value: 100, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of lens 2', q: 'length', unit: 'mm', value: -50, signed: true, tex: 'f_2' },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'A negative result is a diverging pair. When the denominator is zero the pair is afocal, as in a telescope.',
      stories: { f: 'A lens of {f1} is followed {d} behind by a lens of {f2}. What is the focal length of the pair?' }
    },
    {
      name: 'Back focal distance of two thin lenses',
      expr: 'b = f2*(f1 - d)/(f1 + f2 - d)', tex: 'b = \\frac{f_2\\,(f_1 - d)}{f_1 + f_2 - d}',
      vars: {
        b: { name: 'back focal distance', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of lens 1', q: 'length', unit: 'mm', value: 100, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of lens 2', q: 'length', unit: 'mm', value: -50, signed: true, tex: 'f_2' },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 60 }
      },
      note: 'Distance from the second lens to the focus of the pair. The package length of a telephoto is d + b.',
      stories: { b: 'A {f1} lens and a {f2} lens are {d} apart. How far behind the second lens is the focus?' }
    }
  ],
  examples: [
    {
      title: 'A half-size copier',
      q: 'A copier lens must reduce a page to half its size on a track of 500 mm (object to image). Find its focal length and where it sits.',
      steps: [
        { text: 'With |m| = 0.5 and TT = 500 mm:', tex: 'f = \\frac{0.5 \\times 500}{1.5^2} = 111\\ \\mathrm{mm}' },
        { text: 'The object distance and image distance are', tex: 's_o = \\frac{500}{1.5} = 333\\ \\mathrm{mm}, \\qquad s_i = 0.5 \\times 333 = 167\\ \\mathrm{mm}' },
        'Check: $1/333 + 1/167 = 0.0090 = 1/111$.'
      ],
      a: 'f = 111 mm, with the lens 333 mm from the page and 167 mm from the sensor. The mirror-image position (167 mm from the page) would give a magnification of 2 instead.'
    },
    {
      title: 'A 500 mm lens in a 260 mm package',
      q: 'A +100 mm lens is followed, 60 mm behind it, by a −50 mm lens. Find the focal length of the pair, the back focal distance and the length of the package.',
      steps: [
        { text: 'The focal length:', tex: '\\frac{1}{f} = \\frac{1}{100} - \\frac{1}{50} + \\frac{60}{100 \\times 50} = 0.002 \\ \\Rightarrow\\ f = 500\\ \\mathrm{mm}' },
        { text: 'The back focal distance:', tex: 'b = \\frac{-50\\,(100 - 60)}{100 - 50 - 60} = 200\\ \\mathrm{mm}' },
        'The package runs from the front lens to the focus: $60 + 200 = 260$ mm, just over half the focal length.'
      ],
      a: 'f = 500 mm, back focal distance 200 mm, length 260 mm: the telephoto ratio is 0.52.'
    }
  ],
  quiz: [
    { q: 'An object and a sensor are 300 mm apart and a 50 mm thin lens is slid between them. How many positions give a sharp image?', choices: ['0', '1', '2', 'Infinitely many'], a: 2, why: '$TT = 300$ mm is greater than $4f = 200$ mm, so there are two positions, with reciprocal magnifications. At TT = 4f there is one; below it, none.' },
    { q: 'A real image of an object can be formed 150 mm away by a 50 mm thin lens.', a: false, why: 'A real image needs a track of at least $4f = 200$ mm. At 150 mm no position of the lens gives a sharp image.' },
    { q: 'What focal length (mm) puts a life-size image (m = 1) on a track of 400 mm?', answer: 100, why: '$f = m\\,TT/(1+m)^2 = 400/4 = 100$ mm, with the lens halfway at 200 mm from each end.' },
    { q: 'Two 100 mm thin lenses are placed in contact (d = 0). What is the focal length of the pair in mm?', answer: 50, why: 'Powers add for lenses in contact: $1/f = 1/100 + 1/100 = 1/50$.' },
    { q: 'A +100 mm lens is followed 60 mm behind by a −50 mm lens, giving a focal length of 500 mm. How long, in mm, is the package from the front lens to the focus?', answer: 260, why: 'The back focal distance is $f_2(f_1 - d)/(f_1 + f_2 - d) = -50 \\times 40/(-10) = 200$ mm; add the 60 mm spacing: 260 mm, about half the focal length. That is the telephoto principle.' }
  ],
  applications: [
    'Copiers, scanners and enlargers: the track and magnification are given and the lens follows from $f = |m|\\,TT/(1+|m|)^2$.',
    'Choosing a machine-vision lens: the field and the working distance fix the magnification and so the focal length (see [[choosing-a-machine-vision-lens]]).',
    'Relays in endoscopes and periscopes: a chain of equal lenses, each at 1:1 on a track of 4f, hands the image on.',
    'Telephoto and zoom lenses: two groups at a changing spacing give a changing focal length ([[zoom-lens-principles]]).',
    'Projectors: the throw distance and the screen width fix the magnification and so the focal length of the projection lens.'
  ],
  history: 'The displacement method of finding a focal length, in which a lens is moved between a fixed object and a fixed screen until two sharp positions are found, is named after the astronomer Friedrich Wilhelm Bessel (1784–1846). It remains a standard student experiment.',
  sources: [
    'E. Hecht, *Optics* — the chapters on thin lenses and on the matrix methods for paraxial systems.',
    'W. J. Smith, *Modern Optical Engineering* — first-order optics and the layout of simple systems.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — thin lenses, systems of lenses and the paraxial ray trace.'
  ],
  sim: 'us-layout'
},

/* ================================================================ the resolution budget */
{
  id: 'the-resolution-budget', parent: 'understanding-optical-systems', title: 'The resolution budget', level: 2,
  short: 'A perfect point of light is imaged as a spot, and several things each enlarge it: diffraction, the lens aberrations, the pixels, focus error, motion and vibration. Written as sizes in micrometres they combine roughly as the root of the sum of the squares, so the largest dominates. The budget shows which to attack, and when to stop.',
  keywords: ['resolution budget', 'blur budget', 'quadrature', 'root sum of squares', 'diffraction', 'pixel', 'defocus', 'motion blur', 'vibration', 'weakest link', 'Airy disc', 'matched f-number', 'PSF', 'RMS'],
  prereq: ['the-airy-disk', 'the-point-spread-function', 'pixels-per-feature', 'specifying-an-optical-system'],
  related: ['system-mtf', 'shutter-speed-and-motion', 'nyquist-sampling-and-aliasing', 'the-light-budget', 'spot-diagrams-and-ray-fans', 'diffraction-limited-mtf'],
  body: `
When a perfect point of light is imaged, it does not come out as a point. It comes out as a small spot, and several different things each make the spot larger. Written as sizes in micrometres on the sensor they can be compared, added, and attacked in order of size. That list, and the way it is added, is the **resolution budget**.

### The contributions

| Source | Size on the sensor | Example: 25 mm lens at f/5.6 |
|---|---|---|
| Diffraction | the [[the-airy-disk|Airy disc]], $2.44\\,\\lambda N_w$ | 7.5 µm |
| Lens aberrations | twice the RMS radius of the [[spot-diagrams-and-ray-fans|traced spot]] | 1.0 µm (catalogue achromat), 11.8 µm (cheap singlet) |
| Pixels | two pixel pitches: what [[nyquist-sampling-and-aliasing|sampling]] can resolve | 6.9 µm for 3.45 µm pixels |
| Focus error | a defocus disc ([[depth-of-focus]]), $\\Delta z / N_w$ | 3.6 µm for 20 µm of error |
| Motion | [[shutter-speed-and-motion|speed × exposure]] × magnification | 6 µm |
| Vibration | peak-to-peak movement at the sensor | 0 to 20 µm |

### Adding them
Independent random blurs add by their squares, like standard deviations: $b = \\sqrt{b_1^2 + b_2^2 + \\dots}$. The numbers above (achromat) give 7.5, 1.0, 6.9, 3.6 and 6.0 µm, and 12.4 µm in all. Two things follow:

- **The largest dominates.** Diffraction is 37 % of the total variance here, the pixels 31 %, the motion 23 %.
- **A small blur vanishes next to a large one.** Without the focus error the total is 11.9 µm; without the lens aberrations, 12.4 µm. Neither is worth working on.

Halve the largest, diffraction, by opening the lens, and the total falls to 10.6 µm, 15 % better. Then the pixels are the largest. So the budget is a loop: attack the largest, recompute, and stop when the next step costs more than it gives.

### A rule of thumb, with limits
Quadrature is a quick guide for where to spend, not an exact law. The exact method multiplies the MTF of each stage ([[system-mtf]]). The Airy disc has rings and a defocus disc has sharp edges, so neither is a Gaussian. The budget ranks the blurs correctly; the MTF then gives the contrast at each frequency.

### Matching pixels and optics
Pixels much smaller than the blur of the optics waste light and data; pixels much larger waste the lens. A natural match is an Airy disc about two pixels wide: $2.44\\lambda N_w = 2p$, so $N_w = p/(1.22\\lambda)$. In green light that is 5.1 for 3.45 µm pixels, 3.6 for 2.4 µm pixels and 1.6 for 1.1 µm phone pixels. Stop a lens down beyond that and diffraction, not the pixels, sets the resolution.

### The cures

| If this dominates | Cure | What it costs |
|---|---|---|
| Diffraction | open the aperture | less depth of field, more aberration |
| The lens | a better design, or stop down | money, or light |
| The pixels | smaller pixels, or more magnification | less light per pixel, and better optics are needed |
| Focus | mechanical focus, autofocus, a flatter part | cost |
| Motion | a shorter exposure or a strobe | more light |
| Vibration | isolation, a stiffer mount | space and money |

> [!key] Express every blur as a size in micrometres on the sensor and add them as the root of the sum of squares. The largest dominates; attack it, recompute, and stop when the next gain is not worth its price. For a final answer multiply the MTFs ([[system-mtf]]).
`,
  ideas: [
    'Diffraction, lens aberrations, two pixels, focus error, motion and vibration are blurs that can be written in micrometres.',
    'Independent blurs add in quadrature: the total is the root of the sum of squares.',
    'The largest blur dominates and a small one vanishes next to it, so effort goes to the largest.',
    'Matching Airy disc to two pixels gives N_w = p/(1.22 λ); beyond it diffraction limits the picture.',
    'Quadrature ranks the blurs; for the final contrast, multiply their MTFs.'
  ],
  pitfalls: [
    'Smaller pixels always give a sharper picture — Once the pixels are smaller than the Airy disc, the picture is no sharper; it has only more pixels, less light each and more noise.',
    'Blurs add up like lengths — Independent blurs add as squares. Two blurs of 6 µm give 8.5 µm, not 12 µm, and a 1 µm blur next to a 6 µm one adds only 0.08 µm.',
    'The better the lens the better the picture — If diffraction, the pixels or the motion dominate, a better lens changes almost nothing. The budget says whether the lens is worth improving.'
  ],
  terms: [
    { term: 'Blur budget', also: ['resolution budget', 'spot budget'], def: 'The list of all contributions to the size of the image of a point, in common units, added in quadrature so that the largest can be found and reduced.' },
    { term: 'Quadrature', also: ['root sum of squares', 'RSS'], def: 'Adding independent errors by squaring each, summing, and taking the root. It is how random errors, and approximately blurs, combine.' },
    { term: 'Matched f-number', def: 'The working f-number at which the Airy disc is two pixels wide: N_w = p/(1.22 λ). Stopping down beyond it makes diffraction the limit.' },
    { term: 'Defocus blur', also: ['blur disc'], def: 'The disc into which a point spreads when the sensor is a distance Δz from the image: of diameter Δz/N_w, since the cone of light has an f-number N_w.' }
  ],
  formulas: [
    {
      name: 'Blurs added in quadrature',
      expr: 'b = sqrt(b1^2 + b2^2 + b3^2)', tex: 'b = \\sqrt{b_1^2 + b_2^2 + b_3^2}',
      vars: {
        b: { name: 'total blur', q: 'length', unit: 'µm' },
        b1: { name: 'first blur (diffraction)', q: 'length', unit: 'µm', value: 7.5, tex: 'b_1' },
        b2: { name: 'second blur (two pixels)', q: 'length', unit: 'µm', value: 6.9, tex: 'b_2' },
        b3: { name: 'third blur (motion)', q: 'length', unit: 'µm', value: 6, tex: 'b_3' }
      },
      note: 'Extend with more terms for each further blur. Valid for independent, roughly bell-shaped blurs; it is a guide, not an exact law.',
      stories: { b: 'A system has a diffraction blur of {b1}, a pixel blur of {b2} and a motion blur of {b3}. What is the total?' }
    },
    {
      name: 'F-number at which diffraction matches two pixels',
      expr: 'Nw = p/(1.22*lambda)', tex: 'N_w = \\frac{p}{1.22\\,\\lambda}',
      vars: {
        Nw: { name: 'working f-number', tex: 'N_w' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'From 2.44 λ N_w = 2p. For an engraved f-number divide by (1 + m).',
      stories: { Nw: 'A sensor has {p} pixels. At what working f-number is the Airy disc of {lambda} light two pixels wide?' }
    },
    {
      name: 'Motion blur on the sensor',
      expr: 'b = v*t*m', tex: 'b = v\\,t\\,m',
      vars: {
        b: { name: 'blur on the sensor', q: 'length', unit: 'µm' },
        v: { name: 'speed of the part', q: 'speed', unit: 'm/s', value: 0.2 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 0.1 },
        m: { name: 'magnification', value: 0.2, min: 0.001, max: 100 }
      },
      note: 'The part moves v·t during the exposure; the sensor sees m times that. Halving the exposure halves the blur.',
      stories: { b: 'A part moves at {v} and the exposure lasts {t}, at a magnification of {m}. How far does its image smear on the sensor?', t: 'A part moves at {v}; the magnification is {m}. What exposure keeps the smear to {b}?' }
    }
  ],
  examples: [
    {
      title: 'The whole budget',
      q: 'A 25 mm achromat at f/5.6 images a part onto 3.45 µm pixels. The sensor is 20 µm out of focus and the part smears by 6 µm during the exposure. Find the total blur, the largest contribution, and the effect of opening the aperture to f/4.',
      steps: [
        'Diffraction: $2.44 \\times 0.55 \\times 5.6 = 7.5$ µm. Lens: 1.0 µm (traced). Pixels: 6.9 µm. Focus: $20/5.6 = 3.6$ µm. Motion: 6 µm.',
        { text: 'Total:', tex: 'b = \\sqrt{7.5^2 + 1.0^2 + 6.9^2 + 3.6^2 + 6.0^2} = 12.4\\ \\mathrm{\\mu m}' },
        'Shares of the variance: diffraction 37 %, pixels 31 %, motion 23 %, focus 8 %, lens 1 %.',
        'Opening to f/4 cuts diffraction to 5.4 µm, but the focus blur grows to 5 µm and the lens to 1.2 µm; the total becomes 11.8 µm, only 5 % better, because the pixels and the motion remain.'
      ],
      a: '12.4 µm, led by diffraction. Opening up helps little: shorten the exposure and halve the motion blur first.'
    },
    {
      title: 'Matching a phone sensor',
      q: 'A phone sensor has 1.1 µm pixels. At what f-number does diffraction (550 nm) match two pixels, and does a typical f/1.8 lens exceed it?',
      steps: [
        { text: 'The matched f-number:', tex: 'N_w = \\frac{1.1}{1.22 \\times 0.55} = 1.6' },
        'A phone lens focuses on distant things, so $N_w \\approx N$: at f/1.8 the Airy disc is $2.44 \\times 0.55 \\times 1.8 = 2.4$ µm, a little over two pixels (2.2 µm).'
      ],
      a: 'The match is f/1.6. An f/1.8 lens is just past it: diffraction already limits the resolution of such a sensor, which is why phone makers use binning and software rather than ever smaller pixels.'
    }
  ],
  quiz: [
    { q: 'Two independent blurs of 6 µm each are combined. The total blur is about', choices: ['12 µm', '8.5 µm', '6 µm', '36 µm'], a: 1, why: 'In quadrature: $\\sqrt{6^2 + 6^2} = 8.5$ µm. Independent blurs add as squares, not as lengths.' },
    { q: 'A system has blurs of 8 µm (diffraction) and 1 µm (the lens). Removing the lens blur completely lowers the total to', choices: ['7 µm', 'about 8 µm', '4 µm', '0 µm'], a: 1, why: '$\\sqrt{8^2 + 1^2} = 8.06$ µm against 8.00 µm: a small blur vanishes next to a large one.' },
    { q: 'At what working f-number is the Airy disc (550 nm) two pixels wide for 2.4 µm pixels?', answer: 3.6, why: '$N_w = p/(1.22\\lambda) = 2.4/(1.22 \\times 0.55) = 3.6$.' },
    { q: 'The pixels are 1 µm and the Airy disc is 8 µm across. Halving the pixel size again will make the picture noticeably sharper.', a: false, why: 'Diffraction dominates. The pixels already vanish in the sum (2 µm against 8 µm); smaller ones only add data and noise.' },
    { q: 'A part moves at 0.2 m/s and the exposure is 0.5 ms, at a magnification of 0.2. How many micrometres does the image smear?', choices: ['4 µm', '20 µm', '100 µm', '0.4 µm'], a: 1, why: 'The part moves $0.2 \\times 0.0005 = 0.1$ mm = 100 µm; the sensor sees 0.2 times that: 20 µm.' }
  ],
  applications: [
    'Choosing the f-number of a machine-vision lens so that diffraction does not undo the sensor (see [[choosing-a-machine-vision-lens]]).',
    'Deciding whether a better lens, a shorter exposure or a firmer mount will improve an unsharp picture.',
    'Setting a tolerance on focus and on vibration in a camera module or an inspection head.',
    'Judging claims of ever more megapixels in phones and cameras against the diffraction limit of their lenses.',
    'Choosing the pixel size of a sensor for a given lens, or the lens for a given sensor.'
  ],
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — the system view of resolution, with the contributions of optics, detector and motion.',
    'W. J. Smith, *Modern Optical Engineering* — image evaluation, the Airy disc and spot sizes.',
    'ISO 12233, *Photography — Electronic still picture imaging — Resolution and spatial frequency responses* — the standard method for measuring the result.'
  ],
  sim: 'us-resolution-budget'
},

/* ================================================================ the light budget */
{
  id: 'the-light-budget', parent: 'understanding-optical-systems', title: 'The light budget', level: 2,
  short: 'Light is spent at every step from the scene to the signal. The lens passes only π/(4N²) of the scene luminance as sensor illuminance, close-up costs (1 + m)², each glass surface loses a few per cent, and the exposure turns what is left into photons, electrons and finally a signal-to-noise ratio. Counted in factors and in stops, the budget shows where the light goes.',
  keywords: ['light budget', 'stops', 'photons per pixel', 'signal to noise', 'shot noise', 'illuminance on the sensor', 'transmission', 'exposure', 'quantum efficiency', 'etendue', 'luminance', 'SNR', 'QE'],
  prereq: ['the-f-number', 'photometric-quantities', 'how-a-pixel-detects-light', 'sensor-noise'],
  related: ['etendue', 'lambertian-surfaces', 'antireflection-coatings', 'exposure-and-the-exposure-triangle', 'radiance-and-its-conservation', 'the-resolution-budget'],
  body: `
Light is spent at every step on its way from the scene to the signal. The **light budget** counts that spending in two ways at once: as factors (the lens passes 5 % of this), and as **[[aperture-and-f-stops|stops]]**, where one stop is a factor 2 and the losses simply add.

### From the scene to the sensor
A matt surface of luminance L (in cd/m²) seen through a lens of f-number N makes on the sensor the illuminance

$$E = \\frac{\\pi\\,L\\,T}{4\\,N^2\\,(1+m)^2}$$

with T the transmittance of the lens and m the magnification ([[photometric-quantities]], [[the-f-number]]). Three losses stand in the formula. The aperture factor $\\pi/4N^2$ is only 0.79 even at f/1. The close-up factor $1/(1+m)^2$ is the [[the-f-number|working f-number]] again. And the glass: each surface loses its reflectance R, so $T = (1-R)^n$. Uncoated glass loses 4.2 % per surface, a single layer of MgF₂ about 1.4 %, a good multilayer about 0.1 % averaged over the visible ([[antireflection-coatings]]).

Where does L come from? A matt part of reflectance ρ lit to an illuminance $E_s$ has $L = \\rho E_s/\\pi$: 500 lux on a 50 % grey card gives 80 cd/m² ([[lambertian-surfaces]]).

### In factors and in stops
Example: the 80 cd/m² part at f/4, m = 0.2, through ten uncoated surfaces.

| Step | Factor | Stops lost |
|---|---|---|
| aperture, π/4N² at f/4 | 0.049 | 4.35 |
| close-up, 1/(1 + m)² | 0.694 | 0.53 |
| glass, ten surfaces at 4.2 % | 0.648 | 0.62 |
| all together | 0.0221 | 5.50 |

So E = 0.0221 × 79.6 = 1.76 lux on the sensor.

### From light to signal
For green light a lux is 1/683 W/m². A pixel of pitch p exposed for a time t collects $N_{ph} = E\\,p^2\\,t/(683\\,h\\nu)$ photons: for 1.76 lux on a 3.45 µm pixel in 5 ms, 428 photons. A silicon pixel with a [[quantum-efficiency-and-spectral-response|quantum efficiency]] of 60 % turns them into 257 electrons. These carry **[[sensor-noise|shot noise]]**, $\\sqrt{n} = 16$ electrons, plus the read noise of the electronics, say 3 electrons, so the signal-to-noise ratio is $257/\\sqrt{257 + 9} = 15.8$, or 24 dB. Coat the surfaces with a good multilayer and T rises from 0.65 to 0.99: 392 electrons and a ratio of 19.6.

### Buying light back

| Change | Gain | Price |
|---|---|---|
| double the exposure | 1 stop; SNR × 1.41 | twice the motion blur |
| open the aperture by one stop | 1 stop | half the depth of field; more aberration |
| double the pixel pitch | 2 stops (4 × the area) | the resolution |
| coat the surfaces | 0.6 stop here | cost |

At the shot-noise limit the signal-to-noise ratio goes as the *square root* of the light. To reach a ratio of 50 the example needs about 2500 electrons, ten times more: 3.3 stops, an exposure of 49 ms at the same aperture.

### The source side: étendue
Upstream of the scene the lamp's light must be collected and delivered. No passive optics can make the image brighter, per unit area and solid angle, than the source ([[radiance-and-its-conservation]]), and the product of area and solid angle that a system can accept, its [[etendue]], caps what it can take from a large lamp: a small bright LED can fill a small system, a large lamp wastes most of its light on it.

> [!key] Counted in stops the losses add: aperture, close-up, glass. The exposure then turns the illuminance into photons, and shot noise makes the signal-to-noise ratio go as the square root of the light, so a factor 4 in light buys only a factor 2 in quality.
`,
  ideas: [
    'The sensor illuminance is E = πLT/(4N²(1+m)²): aperture, close-up and glass each take their share.',
    'A stop is a factor 2 in light; losses in stops simply add.',
    'Each glass surface loses its reflectance R, so n surfaces pass (1 − R)ⁿ: coatings matter in a many-element lens.',
    'Photons per pixel = E p² t /(683 hν) for green light; quantum efficiency turns photons into electrons.',
    'Shot noise makes SNR go as the square root of the light: four times the light, twice the quality.'
  ],
  pitfalls: [
    'The f-number alone gives the image brightness — It gives the geometric part. Transmission (T-stops), the close-up factor and the glass losses all come on top, and a 10-surface lens loses a third of the light uncoated.',
    'Twice the light gives twice the signal-to-noise ratio — At the shot-noise limit SNR goes as the square root of the light: twice the light gives 1.41 times the SNR. Four times the light gives twice.',
    'More pixels cost nothing in light — For a given sensor size and exposure, smaller pixels catch fewer photons each, so each pixel is noisier. Halving the pitch costs two stops per pixel.'
  ],
  terms: [
    { term: 'Light budget', def: 'A step-by-step account of how much light is passed or lost between the source and the signal, in factors or in stops.' },
    { term: 'Stop', also: ['stops', 'EV step'], def: 'A factor of 2 in the amount of light. Losses and gains in stops add, which makes long chains of factors easy to total.' },
    { term: 'Shot noise', also: ['photon noise'], def: 'The unavoidable random variation of the photon count. For n electrons it is √n, so SNR = √n at best and grows only as the root of the light.' },
    { term: 'Transmittance', also: ['T'], def: 'The share of the light a lens or filter passes. For a lens of n surfaces each losing R it is (1 − R)ⁿ, apart from absorption in the glass.' }
  ],
  formulas: [
    {
      name: 'Illuminance on the sensor',
      expr: 'E = pi*L*T/(4*N^2*(1 + m)^2)', tex: 'E = \\frac{\\pi\\,L\\,T}{4\\,N^2\\,(1 + m)^2}',
      vars: {
        E: { name: 'illuminance on the sensor', q: 'illuminance', unit: 'lx' },
        L: { name: 'luminance of the part', q: 'luminance', unit: 'cd/m²', value: 80 },
        T: { name: 'transmittance of the lens', value: 0.65, min: 0.001, max: 1 },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        m: { name: 'magnification', value: 0.2, min: 0, max: 100 }
      },
      note: 'For a matt (Lambertian) part on the axis; off axis multiply by cos⁴ of the field angle.',
      stories: { E: 'A part of {L} is imaged at f/{N} and magnification {m} through a lens of transmittance {T}. What illuminance reaches the sensor?' }
    },
    {
      name: 'Transmittance of n glass surfaces',
      expr: 'T = (1 - R)^n', tex: 'T = (1 - R)^n',
      vars: {
        T: { name: 'transmittance', min: 0, max: 1 },
        R: { name: 'light lost at each surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 50 },
        n: { name: 'number of glass surfaces', value: 10, int: true, min: 1, max: 60 }
      },
      note: 'Reflection losses only; absorption in the glass comes on top. Ten uncoated surfaces keep 65 %; ten with a 0.1 % coating keep 99 %.',
      stories: { T: 'A lens has {n} surfaces, each losing {R} of the light. What share does it pass?' }
    },
    {
      name: 'Shot-noise limit of the signal-to-noise ratio',
      expr: 'snr = sqrt(eta*P)', tex: '\\mathrm{SNR} = \\sqrt{\\eta\\,P}',
      vars: {
        snr: { name: 'signal-to-noise ratio', tex: '\\mathrm{SNR}' },
        eta: { name: 'quantum efficiency', q: 'ratio', unit: '%', value: 60, min: 1, max: 100, tex: '\\eta' },
        P: { name: 'photons on the pixel', value: 428, int: true, min: 1, max: 1e9 }
      },
      note: 'Read noise and dark current are neglected; they make the real figure lower, most of all in dim light.',
      stories: { snr: 'A pixel with a quantum efficiency of {eta} receives {P} photons. What signal-to-noise ratio can shot noise alone allow?' }
    },
    {
      name: 'Stops between two light levels',
      expr: 'k = log2(r)', tex: 'k = \\log_2 r',
      vars: {
        k: { name: 'difference in stops' },
        r: { name: 'ratio of the larger to the smaller amount of light', value: 45, min: 1, max: 1e9 }
      },
      note: 'One stop is a factor 2, three stops a factor 8, ten stops about 1000.',
      stories: { k: 'A lens passes one part in {r} of the light of a scene. How many stops is that?' }
    }
  ],
  examples: [
    {
      title: 'From a grey card to a signal',
      q: 'A 50 % grey part is lit to 500 lux. A lens with ten uncoated surfaces (4.2 % lost each) at f/4 images it at m = 0.2 onto 3.45 µm pixels for 5 ms. The sensor has a quantum efficiency of 60 % and a read noise of 3 electrons. Find the sensor illuminance, the electrons and the signal-to-noise ratio.',
      steps: [
        { text: 'The luminance of the part:', tex: 'L = \\frac{\\rho E_s}{\\pi} = \\frac{0.5 \\times 500}{\\pi} = 79.6\\ \\mathrm{cd/m^2}' },
        { text: 'The glass passes $T = 0.958^{10} = 0.648$, so', tex: 'E = \\frac{\\pi \\times 79.6 \\times 0.648}{4 \\times 16 \\times 1.44} = 1.76\\ \\mathrm{lx}' },
        'Photons: $1.76/683 = 2.58 \\times 10^{-3}$ W/m² times the pixel area $1.19 \\times 10^{-11}$ m² times 5 ms is $1.53 \\times 10^{-16}$ J, and a 555 nm photon carries $3.58 \\times 10^{-19}$ J: 428 photons.',
        'Electrons: $0.6 \\times 428 = 257$. Noise: $\\sqrt{257 + 9} = 16.3$. Ratio: $257/16.3 = 15.8$.'
      ],
      a: '1.76 lux, 257 electrons, a signal-to-noise ratio of 15.8 (24 dB). With a good multilayer coating it would be 19.6.'
    },
    {
      title: 'How long for a signal-to-noise ratio of 50?',
      q: 'In the example above, how much longer must the exposure be to reach a signal-to-noise ratio of 50, and how many stops is that?',
      steps: [
        { text: 'Solving $e/\\sqrt{e + 9} = 50$ for the electrons e:', tex: 'e = \\frac{S^2 + \\sqrt{S^4 + 4 S^2 r^2}}{2} = \\frac{2500 + \\sqrt{2500^2 + 4 \\times 2500 \\times 9}}{2} = 2509' },
        'The ratio to the 257 electrons now collected is 9.8; the exposure becomes $5 \\times 9.8 = 49$ ms, and $\\log_2 9.8 = 3.3$ stops.'
      ],
      a: '49 ms: 3.3 stops more light. A stop of aperture, a stronger lamp or a coated lens recovers part of it without slowing the exposure.'
    }
  ],
  quiz: [
    { q: 'A lens is stopped down from f/4 to f/8. How many stops of light are lost?', choices: ['1', '2', '4', '8'], a: 1, why: 'Light goes as $1/N^2$: $(4/8)^2 = 1/4$, which is two stops (f/5.6 is one).' },
    { q: 'Light is quadrupled and everything else is unchanged. At the shot-noise limit the signal-to-noise ratio', choices: ['rises by a factor 4', 'rises by a factor 2', 'rises by a factor 1.41', 'does not change'], a: 1, why: 'SNR is the square root of the number of electrons, so four times the light gives twice the ratio.' },
    { q: 'A lens has 12 uncoated surfaces, each losing 4 %. How much light does it pass (as a share)?', choices: ['about 96 %', 'about 61 %', 'about 52 %', 'about 4 %'], a: 1, why: '$0.96^{12} = 0.613$: about 61 %, 0.7 stops lost.' },
    { q: 'A scene of 100 cd/m² is imaged at f/2, m = 0, T = 1. What illuminance (lux) falls on the sensor?', answer: 19.6, why: '$E = \\pi L/(4N^2) = \\pi \\times 100/16 = 19.6$ lx.' },
    { q: 'Doubling the pixel pitch of a sensor, with the lens, the scene and the exposure unchanged, makes each pixel collect', choices: ['twice the photons', 'four times the photons', 'the same photons', 'half the photons'], a: 1, why: 'A pixel twice as wide has four times the area and collects four times the light: two stops. The price is that the picture has a quarter of the pixels.' }
  ],
  applications: [
    'Setting the exposure and the lamp for a machine-vision line so that the signal-to-noise ratio stays above the value the software needs.',
    'Choosing between a bright small-pixel sensor and a large-pixel one for dim scenes, as in astronomy, microscopy and security cameras.',
    'Deciding how many surfaces a lens may have, and what coating, so that a many-element zoom or a phone lens is not dim.',
    'Estimating whether a lamp, an LED or a laser is bright enough before building a system (see [[illuminance-levels-in-practice]]).',
    'Comparing lenses in a catalogue by T-stop rather than f-number when the light matters.'
  ],
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — signal and noise from the scene to the detector.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — photons, quantum efficiency and noise as the standard states them.',
    'W. J. Smith, *Modern Optical Engineering* — the illuminance in the image plane and the losses of a lens system.'
  ],
  sim: 'us-light-budget'
},

/* ================================================================ choosing catalogue components */
{
  id: 'choosing-catalogue-components', parent: 'understanding-optical-systems', title: 'Building from catalogue components', level: 2,
  short: 'Most systems are built from catalogue parts. A singlet is enough to focus a slow laser beam or collimate a lamp; an achromat serves one colour band on the axis; a camera or machine-vision lens is needed when the field is wide, the f-number small or the light white. The choice rests on one comparison: the lens blur against the blur you can accept.',
  keywords: ['catalogue lens', 'singlet', 'achromat', 'plano-convex', 'best form', 'triplet', 'double Gauss', 'camera lens', 'machine-vision lens', 'choosing a lens', 'spot size', 'lens selection', 'stock optics'],
  prereq: ['lens-shapes-and-names', 'spherical-aberration', 'first-order-layout'],
  related: ['catalogue-lens-types', 'reading-an-optics-catalogue', 'achromatic-doublet', 'lens-bending', 'cooke-triplet', 'aspheric-surfaces', 'optomechanics-and-mounts'],
  body: `
Most optical systems are built from catalogue parts. The question is seldom "which lens is best?" but "what is the simplest lens whose blur is smaller than the blur I can accept?". That can be computed, and the simulation below traces seven lenses to answer it.

### Start from the blur you can accept
The target comes from the resolution budget ([[the-resolution-budget]]): a pixel or two on the sensor, or the spot a laser process needs. A lens much better than the target wastes money; one worse is the weak link.

### The ladder
Traced for f = 50 mm at f/4 (a 12.5 mm opening) in one colour (588 nm); the [[the-airy-disk|Airy disc]] is 5.7 µm.

| Lens | On the axis | 4° off the axis |
|---|---|---|
| Biconvex singlet | 66 µm | 111 µm |
| Plano-convex, curved side to the far object | 45 µm | 75 µm |
| Plano-convex the wrong way round | 182 µm | 245 µm |
| Best-form singlet | 42 µm | 73 µm |
| Cemented achromat | 2.5 µm | 65 µm |
| Triplet (three elements) | 10 µm | 13 µm |
| Double Gauss (six elements) | 4.8 µm | 4.4 µm |

These are RMS spot diameters at best focus; the library designs are scaled to 50 mm and set to f/4. In white light the singlets grow by 40 to 80 % (the biconvex to 91 µm) and the achromat doubles to 5.0 µm.

- **A singlet is poor at f/4**: seven times the Airy disc or more. But its [[spherical-aberration|spherical aberration]] falls as the *cube* of the f-number: at f/8 the biconvex gives 8.0 µm, and at f/10 with f = 100 mm, 8.1 µm against an Airy disc of 14 µm. Singlets are for slow beams: collimated lasers, long focal lengths, condensers.
- **Orientation matters.** A plano-convex lens with its curved face to the collimated side shares the bending between its two surfaces; flipped, one steep surface does it all and the blur is four times larger ([[lens-shapes-and-names]]).
- **The achromat is superb on the axis and weak off it**: two glasses cancel spherical aberration and colour, not [[coma]] and astigmatism ([[achromatic-doublet]]).
- **Field and speed need a camera lens**: the triplet and double Gauss hold the blur across the field, at more elements and cost ([[cooke-triplet]]).

### Three things that change the choice
1. **The f-number.** A singlet's blur goes as $f/N^3$: halve the opening and it falls eightfold.
2. **The field.** On the axis an achromat wins; at 4° only field-corrected designs keep up.
3. **The colour.** A singlet's focus moves with wavelength: for N-BK7 (Abbe number 64, [[the-abbe-number-and-glass-map]]) the blue and red foci are $f/V$ apart, 0.78 mm for 50 mm. One-colour light hides it; white light shows it.

### Beyond the lens
A lens needs a barrel, a mount and often a stop and a filter ([[optomechanics-and-mounts]]); a catalogue line is decoded in [[reading-an-optics-catalogue]].

| Job | Usual choice |
|---|---|
| collimate a laser diode | aspheric collimator ([[aspheric-surfaces]]) |
| focus a beam at f/10 or slower | plano-convex singlet |
| focus a beam at about f/3 | achromat or asphere |
| relay 1:1 | two matched achromats |
| image a wide field | camera or machine-vision lens |
| condense an LED or lamp | aspheric condenser |

> [!key] Choose the simplest lens whose traced blur, on the axis and at the edge of the field and in the light you use, is smaller than the blur you can accept. Singlets for slow, narrow, one-colour beams; achromats for the axis; multi-element lenses for field and speed.
`,
  ideas: [
    'Compare each lens blur with the blur you can accept and the Airy disc; buy the simplest that is smaller.',
    'A singlet blurs as f/N³, so it is fine for slow beams and bad for fast ones.',
    'A plano-convex lens must have its curved face towards the far or collimated side; flipped it is four times worse.',
    'An achromat corrects colour and spherical aberration on the axis but not the field; camera lenses correct the field.',
    'White light needs colour correction: a singlet focuses red and blue f/V apart.'
  ],
  pitfalls: [
    'A more expensive lens is always the better choice — A lens beyond the target blur gains nothing; it adds mass and cost. A singlet is the right lens for a slow collimated beam.',
    'An achromat is good everywhere — It is corrected on the axis. Off the axis its coma and astigmatism are no better than a singlet at the same aperture, so it is a poor camera lens.',
    'Lens orientation does not matter — The same plano-convex lens gives 45 µm one way round and 182 µm the other at f/4. The curved face goes towards the beam that is more nearly parallel.'
  ],
  terms: [
    { term: 'Singlet', also: ['single lens', 'simple lens'], def: 'A lens of one piece of glass, with two surfaces. Cheap and light, but with uncorrected spherical aberration, colour and field errors.' },
    { term: 'Achromat', also: ['achromatic doublet', 'achromatic lens'], def: 'A doublet of a crown and a flint glass, usually cemented, that brings two wavelengths to one focus and reduces spherical aberration.' },
    { term: 'Best-form lens', also: ['best-form singlet'], def: 'A singlet with the surface curvatures that give the least spherical aberration for a distant object, a little more curved on the front than a biconvex lens.' },
    { term: 'Catalogue lens', also: ['stock lens', 'off-the-shelf lens'], def: 'A lens sold from a standard range of focal lengths and diameters, as opposed to one designed for a single customer.' }
  ],
  formulas: [
    {
      name: 'Colour focal shift of a singlet',
      expr: 'df = f/V', tex: '\\Delta f = \\frac{f}{V}',
      vars: {
        df: { name: 'distance between the focus for blue and red light', q: 'length', unit: 'mm', tex: '\\Delta f' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        V: { name: 'Abbe number of the glass', value: 64.2, min: 10, max: 120 }
      },
      note: 'Between the F (486 nm) and C (656 nm) lines. A crown glass with V = 64 shifts by about 1.6 % of f.',
      stories: { df: 'A singlet of N-BK7 (V = {V}) has a focal length of {f}. How far apart are the blue and red foci?' }
    },
    {
      name: 'Blur of a singlet against f-number and focal length',
      expr: 'b2 = b1*(f2/f1)*(N1/N2)^3', tex: 'b_2 = b_1\\,\\frac{f_2}{f_1}\\left(\\frac{N_1}{N_2}\\right)^{3}',
      vars: {
        b2: { name: 'blur of the new lens', q: 'length', unit: 'µm', tex: 'b_2' },
        b1: { name: 'blur of the known lens (same shape)', q: 'length', unit: 'µm', value: 66, tex: 'b_1' },
        f1: { name: 'focal length of the known lens', q: 'length', unit: 'mm', value: 50, tex: 'f_1' },
        N1: { name: 'f-number of the known lens', value: 4, min: 0.5, max: 64, tex: 'N_1' },
        f2: { name: 'focal length of the new lens', q: 'length', unit: 'mm', value: 100, tex: 'f_2' },
        N2: { name: 'f-number of the new lens', value: 10, min: 0.5, max: 64, tex: 'N_2' }
      },
      note: 'Third-order spherical aberration of a singlet on the axis; accurate to a few per cent from f/3 to f/20.',
      stories: { b2: 'A singlet gives a blur of {b1} at f/{N1} with a focal length of {f1}. What blur does the same shape give at {f2} and f/{N2}?' }
    },
    {
      name: 'Diameter of the Airy disc, for comparison',
      expr: 'a = 2.44*lambda*N', tex: 'a = 2.44\\,\\lambda\\,N',
      vars: {
        a: { name: 'diameter to the first dark ring', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 588, tex: '\\lambda' },
        N: { name: 'f-number', value: 10, min: 0.5, max: 64 }
      },
      note: 'The smallest spot a perfect lens can make. A lens whose traced blur is smaller than this is diffraction-limited.',
      stories: { a: 'How wide is the diffraction-limited spot of a lens at f/{N} in light of {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Focusing a slow laser beam',
      q: 'A collimated beam 10 mm wide is to be focused by a singlet of f = 100 mm (so f/10) at 588 nm. Will a biconvex singlet do?',
      steps: [
        { text: 'Scale the traced blur of the biconvex lens (66 µm at f = 50 mm, f/4):', tex: 'b_2 = 66 \\times \\frac{100}{50} \\times \\left(\\frac{4}{10}\\right)^3 = 8.4\\ \\mathrm{\\mu m}' },
        { text: 'The Airy disc at f/10:', tex: 'a = 2.44 \\times 0.588 \\times 10 = 14.3\\ \\mathrm{\\mu m}' },
        'A direct trace gives 8.1 µm. The lens blur is smaller than the diffraction disc, so the spot is limited by diffraction.'
      ],
      a: 'Yes: at f/10 the singlet is diffraction-limited (8 µm against 14 µm). A plano-convex lens, with 5.6 µm, is even better. An achromat would add cost and nothing else.'
    },
    {
      title: 'Colour of a singlet',
      q: 'A biconvex N-BK7 singlet of 100 mm focal length is used in white light. How far apart are its blue and red foci?',
      steps: [
        { text: 'With the Abbe number 64.2:', tex: '\\Delta f = \\frac{f}{V} = \\frac{100}{64.2} = 1.56\\ \\mathrm{mm}' },
        'At f/4 the light cone is 1 : 8 across, so a sensor midway between the foci sees a colour fringe about $1.56/(2 \\times 4)$ = 0.2 mm wide.'
      ],
      a: '1.56 mm. In white light the fringe is far larger than any pixel: use an achromat, or one colour.'
    }
  ],
  quiz: [
    { q: 'A singlet gives a blur of 40 µm at f/4. At f/8, with the same focal length, its blur is about', choices: ['20 µm', '10 µm', '5 µm', '80 µm'], a: 2, why: 'Spherical aberration blur goes as $1/N^3$, so doubling N divides it by 8: 5 µm.' },
    { q: 'A plano-convex lens focuses a collimated beam. Which orientation gives the smaller spot?', choices: ['The curved face towards the incoming beam', 'The flat face towards the incoming beam', 'It makes no difference', 'Both are equally good only for white light'], a: 0, why: 'With the curved face first the bending is shared between the two surfaces; with the flat face first all of it happens at the second, steep, surface, and spherical aberration is about four times larger.' },
    { q: 'An achromat is well suited to a wide-angle camera because it has no colour error.', a: false, why: 'It corrects colour and spherical aberration on the axis, but off the axis its coma and astigmatism are as large as a singlet of the same aperture. Wide fields need a triplet or better.' },
    { q: 'The blue and red foci of an N-BK7 singlet (V = 64) of 200 mm focal length are how far apart, in mm?', answer: 3.1, why: '$\\Delta f = f/V = 200/64.2 = 3.1$ mm.' },
    { q: 'A catalogue achromat shows a traced blur of 2 µm on the axis and 60 µm at 4°. Pixels are 3 µm and the field angle is 4°. What is the sensible reading?', choices: ['It is excellent everywhere', 'It is fine in the centre only; use it for a narrow field or choose a camera lens', 'It is useless at all angles', 'The blur at 4° does not matter'], a: 1, why: 'The edge blur of 60 µm is twenty pixels. The lens suits an on-axis task, such as a laser or a detector near the axis, not a 4° field.' }
  ],
  applications: [
    'Focusing a laser beam on a target, a fibre or a sample: slow beams suit singlets and achromats (see [[focusing-a-laser-beam]]).',
    'Collimating an LED, a lamp or a laser diode: aspheric or best-form lenses for speed.',
    'Building a relay or a beam expander on an optical bench from matched achromats.',
    'Choosing a lens for a machine-vision camera: a catalogue multi-element lens for field and speed (see [[choosing-a-machine-vision-lens]]).',
    'Reading a catalogue: knowing which line (shape, glass, coating, surface quality) matters for the job at hand.'
  ],
  sources: [
    'R. Kingslake, *Lens Design Fundamentals* — the singlet, the doublet, the triplet and the double Gauss, and what each corrects.',
    'W. J. Smith, *Modern Optical Engineering* — the aberrations of simple lenses and the standard lens forms.',
    'E. Hecht, *Optics* — the sections on lens aberrations and on aspherical and achromatic lenses.'
  ],
  sim: 'us-choose'
},

/* ================================================================ tolerances and alignment */
{
  id: 'tolerancing-and-alignment-budget', parent: 'understanding-optical-systems', title: 'Tolerances and the alignment plan', level: 2,
  short: 'Every real system departs from its design: lenses sit off centre and tilted, spacings are off, focus drifts, the part is not where it should be. A tolerance budget turns each error into blur or shift, adds them and sets limits; an alignment plan decides which error each adjustment removes and in what order.',
  keywords: ['tolerance', 'alignment', 'depth of focus', 'sensor tilt', 'decentre', 'working distance error', 'compensator', 'focus adjustment', 'error budget', 'sensitivity', 'quadrature', 'Monte Carlo'],
  prereq: ['depth-of-focus', 'lens-tolerances-and-centration', 'the-resolution-budget'],
  related: ['aligning-an-optical-system', 'optomechanics-and-mounts', 'testing-and-commissioning', 'telecentric-imaging', 'specifying-an-optical-system'],
  body: `
A design on paper is perfect. The system that is built is not: lenses sit a few tens of micrometres off centre and a fraction of a degree off square, spacings are slightly wrong, focus drifts with temperature, and the part is not exactly where it should be. A **tolerance budget** decides how much of each error the system can take; an **alignment plan** decides which adjustment removes which error, and in what order.

### What each error does

| Error | Effect | First-order size |
|---|---|---|
| Focus error Δz (sensor, or lens spacing) | defocus blur | $\\Delta z / N_w$ |
| Sensor tilt θ | focus error across the field | $(w/2)\\tan\\theta$ at the edge |
| Working-distance error Δs | focus error at the sensor | $m^2\\,\\Delta s$ |
| Lens decentre δ | the whole image shifts | $(1 + m)\\,\\delta$ |
| Lens tilt | a shift, plus [[coma]] and astigmatism | second order |

A decentre does not blur an ideal lens; it moves the picture. What a decentred real lens adds (coma) is a second effect, taken from a design program ([[lens-tolerances-and-centration]]).

### The depth of focus as the unit
The tolerance on focus is the **depth of focus**: the error that adds one tolerated blur disc c, which is $\\pm N_w c$ either side of the image ([[depth-of-focus]]). For a 3.45 µm pixel as c, f/4 and m = 0.2 ($N_w = 4.8$):
- the depth of focus is ±16.6 µm;
- the sensor tilt alone may reach $\\tan\\theta = 16.6\\ \\mathrm{\\mu m}/3.59\\ \\mathrm{mm}$ on a 7.18 mm sensor: ±0.27°;
- the working distance alone: $m^2 \\Delta s \\le 16.6$ µm, so $\\Delta s \\le 0.41$ mm, 25 times the sensor-side tolerance;
- a decentre of 100 µm moves the picture by 120 µm, 35 pixels: harmless for focus, important for registration.

The factor $m^2$ is general: an axial tolerance on the object side is $1/m^2$ times looser than at the sensor. At 1:1 they are equal; at 0.2 the part may be 25 times sloppier.

### Adding the errors
Independent errors add in quadrature, as blurs do ([[the-resolution-budget]]). Adding every worst case is safe and expensive; a Monte Carlo run in design software, with thousands of random builds, reports the share of systems that meet the specification.

### Compensators
A **compensator** is an adjustment that removes an error after assembly, most often *focus*: a threaded mount, a shim, a spacer ground to measure. It removes only the error it moves along. Refocusing removes the sensor's focus error, the working-distance error and the mean of a tilt, but not the tilt; centring screws move the lens, not the sensor. A specification should name the compensators and the tolerances that remain.

### The order of alignment
1. Fix the datum, the mechanical axis the parts refer to, and seat the sensor on it.
2. Centre the lenses to the datum and set their tilts.
3. Set the spacings (shims, spacers).
4. Focus last: it moves with everything before it and is the cheapest adjustment.
5. Check the whole field and the temperature extremes.

Bench optics follow the same order ([[aligning-an-optical-system]]).

> [!key] Convert every error to blur or shift with its first-order formula, compare it with the depth of focus, add in quadrature, and name the compensator for each. A distance error on the object side is $1/m^2$ times more forgiving than one at the sensor.
`,
  ideas: [
    'Each error becomes a blur or a shift with a first-order formula: Δz/N_w, (w/2) tan θ, m²Δs, (1 + m)δ.',
    'The depth of focus ±N_w c is the unit in which focus-like errors are measured.',
    'An axial tolerance on the object side is 1/m² times looser than at the sensor.',
    'A decentre moves the picture rather than blurring it; tilt and decentre of real lenses add coma.',
    'A compensator (usually focus) removes only the error it moves along; alignment goes datum, centring, spacing, focus last.'
  ],
  pitfalls: [
    'Refocusing fixes everything that looks soft — Focus removes a uniform defocus. A tilted sensor or a tilted part is soft on one side and sharp on the other, and no focus setting cures it.',
    'Tolerances on the part side and the sensor side are the same — They differ by m². At a magnification of 0.2 the part may move 25 times more than the sensor; at 1:1, equally.',
    'Add the errors to be safe — Simple addition of independent errors is very pessimistic and makes parts expensive. Quadrature, or a Monte Carlo build, reflects how random errors combine.'
  ],
  terms: [
    { term: 'Tolerance', def: 'The permitted deviation of a dimension, spacing, angle or position from its design value, set so that the system still meets its specification.' },
    { term: 'Compensator', def: 'An adjustment (focus, a shim, a tilt screw) that removes an error after assembly. It removes only the error along which it moves.' },
    { term: 'Decentre', also: ['decenter', 'lens decentration'], def: 'A sideways offset of a lens from the optical axis. To first order it shifts the image by (1 + m) times the offset without blurring it.' },
    { term: 'Sensitivity', def: 'The change in image quality or position per unit change of a parameter, such as the blur per micrometre of focus error.' },
    { term: 'Datum', also: ['mechanical axis', 'reference axis'], def: 'The mechanical reference (an axis, a face) to which all parts are located; alignment starts from it.' }
  ],
  formulas: [
    {
      name: 'Depth of focus, each side of the image',
      expr: 'df = Nw*c', tex: '\\delta z = N_w\\,c',
      vars: {
        df: { name: 'focus error that adds one tolerated blur', q: 'length', unit: 'µm', tex: '\\delta z' },
        Nw: { name: 'working f-number', value: 4.8, min: 0.5, max: 64, tex: 'N_w' },
        c: { name: 'tolerated blur disc (one pixel)', q: 'length', unit: 'µm', value: 3.45 }
      },
      note: 'The total depth of focus is twice this, 2 N_w c.',
      stories: { df: 'A lens works at f/{Nw} and a blur of {c} is tolerated. How far may the sensor be out of focus, each way?' }
    },
    {
      name: 'Focus error at the edge of a tilted sensor',
      expr: 'ee = w*tan(theta)/2', tex: '\\varepsilon = \\frac{w\\,\\tan\\theta}{2}',
      vars: {
        ee: { name: 'focus error at the edge', q: 'length', unit: 'µm', tex: '\\varepsilon' },
        w: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 7.18 },
        theta: { name: 'tilt of the sensor', q: 'angle', unit: '°', value: 0.2, min: 0, max: 10, tex: '\\theta' }
      },
      note: 'A tilt about the centre. Set e equal to the depth of focus to find the tilt tolerance.',
      stories: { ee: 'A sensor {w} wide is tilted by {theta}. How far out of focus is its edge?', theta: 'A sensor {w} wide may be out of focus by {ee} at its edge. How large a tilt is allowed?' }
    },
    {
      name: 'Working-distance error seen at the sensor',
      expr: 'dz = m^2*ds', tex: '\\Delta z = m^2\\,\\Delta s',
      vars: {
        dz: { name: 'focus error at the sensor', q: 'length', unit: 'µm', tex: '\\Delta z' },
        m: { name: 'magnification', value: 0.2, min: 0.001, max: 100 },
        ds: { name: 'error of the working distance (object side)', q: 'length', unit: 'mm', value: 0.4, tex: '\\Delta s' }
      },
      note: 'The longitudinal magnification is m². An error of the part along the axis is shrunk by m² at the sensor.',
      stories: { dz: 'A part is {ds} too far from a lens working at a magnification of {m}. How far is the image from the sensor?', ds: 'The sensor may be {dz} out of focus; the magnification is {m}. How far may the part move along the axis?' }
    },
    {
      name: 'Image shift from a decentred lens',
      expr: 'sh = d*(1 + m)', tex: 'h = \\delta\\,(1 + m)',
      vars: {
        sh: { name: 'shift of the image', q: 'length', unit: 'µm', tex: 'h' },
        d: { name: 'decentre of the lens', q: 'length', unit: 'µm', value: 100, tex: '\\delta' },
        m: { name: 'magnification', value: 0.2, min: 0, max: 100 }
      },
      note: 'In the direction of the decentre. For a distant object (m = 0) the image moves by exactly the decentre.',
      stories: { sh: 'A lens is decentred by {d} at a magnification of {m}. How far does the image move on the sensor?' }
    }
  ],
  examples: [
    {
      title: 'The tolerances of the camera',
      q: 'A camera has a 7.18 mm wide sensor with 3.45 µm pixels, a lens at f/4 and a magnification of 0.2. A blur of one pixel is tolerated. Find the depth of focus and the allowed sensor tilt and working-distance error.',
      steps: [
        { text: 'The working f-number is 4 × 1.2 = 4.8, so', tex: '\\delta z = N_w\\,c = 4.8 \\times 3.45 = 16.6\\ \\mathrm{\\mu m}' },
        { text: 'Tilt, with the edge 3.59 mm from the axis:', tex: '\\tan\\theta = \\frac{16.6 \\times 10^{-3}}{3.59} = 0.0046 \\ \\Rightarrow\\ \\theta = 0.27°' },
        { text: 'Working distance:', tex: '\\Delta s = \\frac{\\delta z}{m^2} = \\frac{16.6\\ \\mathrm{\\mu m}}{0.04} = 0.41\\ \\mathrm{mm}' }
      ],
      a: '±16.6 µm of focus, ±0.27° of sensor tilt, ±0.41 mm of working distance. The part is the most forgiving of the three.'
    },
    {
      title: 'The same camera at 1:1',
      q: 'Repeat the working-distance tolerance for the same camera at a magnification of 1, where the working f-number is 8 at f/4. What has changed?',
      steps: [
        { text: 'The depth of focus is now', tex: '\\delta z = 8 \\times 3.45 = 27.6\\ \\mathrm{\\mu m}' },
        { text: 'and with m = 1 the object-side tolerance equals the sensor-side one:', tex: '\\Delta s = \\frac{27.6}{1^2} = 27.6\\ \\mathrm{\\mu m}' }
      ],
      a: 'The part may now move only 28 µm instead of 410 µm: the m² leverage is gone. This is why close-up and microscope work needs stiff mounts, and why a telecentric or low-magnification setup is easier.'
    }
  ],
  quiz: [
    { q: 'A system working at a magnification of 0.1 tolerates 20 µm of focus error at the sensor. How far may the part move along the axis, in mm?', answer: 2, why: '$\\Delta s = \\Delta z/m^2 = 20\\ \\mathrm{\\mu m}/0.01 = 2000\\ \\mathrm{\\mu m} = 2$ mm.' },
    { q: 'Refocusing the lens removes the blur of a tilted sensor.', a: false, why: 'A tilt puts different parts of the sensor at different distances from the image. A focus adjustment moves all of them together, so at best it halves the worst error.' },
    { q: 'A lens is decentred by 50 µm at a magnification of 0.5. How far does the image shift on the sensor, in µm?', answer: 75, why: '$h = \\delta(1 + m) = 50 \\times 1.5 = 75$ µm.' },
    { q: 'Which step is done last when aligning a camera lens module?', choices: ['Setting the tilt of the sensor', 'Centring the lenses', 'Focusing', 'Seating the sensor on the datum'], a: 2, why: 'Focus moves with every earlier adjustment and is cheap to change, so it is set last, after the datum, centring and spacings.' },
    { q: 'Three independent focus-type errors each use up a blur of one half of the budget. Their combined blur, in quadrature, is', choices: ['1.5 of the budget', 'about 0.87 of the budget', '0.5 of the budget', 'exactly the budget'], a: 1, why: '$\\sqrt{3 \\times 0.5^2} = 0.87$: inside the budget, whereas simple addition would give 1.5 and wrongly reject the design.' }
  ],
  applications: [
    'Active alignment of phone-camera modules, where the lens is moved, tilted and focused while watching the picture, before the glue sets.',
    'Setting up a machine-vision camera and its fixture: how far the part may move and how flat the mount must be.',
    'Specifying the cell and the mount of a laser focusing head, where centring and focus tolerances are micrometres.',
    'Collimating a telescope, where the tilt of the secondary and the focus of the eyepiece are the compensators.',
    'Writing tolerances on the drawing of a lens barrel so that the stacked lenses meet their centring specification.'
  ],
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — tolerancing of lens systems and the sensitivity of the image to errors.',
    'R. Kingslake, *Lens Design Fundamentals* — the effects of decentring, tilt and spacing errors on a lens.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — how centring and surface tolerances are stated on a drawing.'
  ],
  sim: 'us-tolerances'
},

/* ================================================================ stray light */
{
  id: 'stray-light-and-baffling', parent: 'understanding-optical-systems', title: 'Stray light and baffles', level: 2,
  short: 'Stray light is light that reaches the detector by a path the design did not intend: ghost images from surface reflections, scatter from edges, walls and dust, and sources outside the field. It lowers contrast and fogs the shadows. The cures are coatings, blackened and baffled mounts, field and Lyot stops, hoods and clean glass.',
  keywords: ['stray light', 'baffle', 'vane', 'ghost', 'flare', 'veiling glare', 'scatter', 'blackening', 'lens hood', 'field stop', 'Lyot stop', 'contrast', 'light trap', 'anodised'],
  prereq: ['fresnel-reflection', 'antireflection-coatings', 'aperture-stop'],
  related: ['ghosts-flare-and-stray-light', 'field-stop-and-field-of-view', 'vignetting', 'specular-and-diffuse-reflection', 'following-the-light'],
  body: `
Stray light is any light that reaches the detector by a path the design did not intend. It does not form the picture; it fogs it: lower contrast, a lifted black level, ghosts of bright lamps, and in a measuring instrument a weak signal drowned beside a strong one.

### The kinds

| Kind | Path | Looks like | Cure |
|---|---|---|---|
| Ghost | two reflections between lens surfaces | a faint copy, spot or ring | coatings; shapes that defocus it |
| Scatter | dust, scratches, bubbles, rough edges | a veil, haloes round bright objects | clean, polish, blacken edges |
| Wall reflection | light striking tube or mount | a haze, a bright band | baffles, black coating, grooves |
| Source outside the field | the Sun, a lamp just beyond the field | glare across the picture | hood, field stop, Lyot stop |
| Self-emission (infrared) | warm parts | a floor under the signal | cooling, cold stops |

### Ghosts: the arithmetic
An uncoated crown-glass surface reflects 4.2 % ([[fresnel-reflection]]). A ghost needs two reflections, so its strength is $R_1 R_2 = 0.042^2 = 0.18\\ \\%$: tiny against an ordinary scene, but a lamp 10 000 times brighter than the scene makes a ghost 18 times brighter than the scene. A lens of n surfaces has $n(n-1)/2$ pairs, 45 for ten surfaces, though not every pair puts a ghost on the sensor. With single-layer coatings (1.4 %) each ghost is 0.02 %, with a good multilayer (0.1 %) one millionth ([[antireflection-coatings]], [[ghosts-flare-and-stray-light]]).

### Baffles and blackening
The simulation traces a bright source off the axis into a tube. With bare machined metal (a bounce keeps about 55 % of the light, scattered [[specular-and-diffuse-reflection|diffusely]]) and no baffles, 1.9 % of the entering light reaches the sensor. Three **vanes**, thin plates that just clear the picture-forming beam, cut that to 0.19 %: most of the lit wall can no longer see the sensor. Matt black paint (about 5 % per bounce) alone brings it to 0.07 %, and paint and vanes together to 0.0004 %: a factor of thousands, because every bounce multiplies the loss. The model is flat and diffuse; real surfaces reflect more at grazing angles, so vanes are made sharp-edged and set at an angle, even cut as sawteeth or grooves.

### Field stop and Lyot stop
An aperture at an intermediate image (a field plane) cuts off light from outside the field before it scatters on down the instrument: a **field stop**. A **Lyot stop** is a mask in a pupil plane, slightly smaller than the image of the aperture, that catches light diffracted from the aperture's edge; it is how coronagraphs see a faint planet beside a star ([[following-the-light]]).

### Hoods and tests
A lens hood is a baffle at the front, and clean glass is a design tool. The test is a bright source just outside the field and a dark target, or a light trap, inside it: the veiling glare is the fraction of the bright level that shows in the dark.

> [!warn] Never test a lens for glare with the Sun: it focuses the Sun onto the sensor, and onto the retina of anyone looking through it. Use a lamp.

> [!key] Stray light comes by ghosts (two reflections), scatter and walls. Coat the glass against ghosts; blacken and baffle the mount against wall reflections: every bounce multiplies the loss, so paint and vanes together are worth thousands.
`,
  ideas: [
    'Stray light reaches the detector by unintended paths: ghosts, scatter, wall reflections, sources outside the field.',
    'A ghost needs two reflections, so its strength is R₁R₂: 0.18 % for two uncoated glass surfaces.',
    'Vanes that just clear the beam hide the lit wall from the sensor; black paint reduces what remains.',
    'Each bounce multiplies the loss, so blackening and baffles together give factors of thousands.',
    'Field stops (at field planes) and Lyot stops (at pupil planes) remove light by where it is in the system.'
  ],
  pitfalls: [
    'Painting the tube black cures stray light — It helps by the reflectance per bounce, but light at grazing angles still reflects strongly. Baffles that block the path matter as much as the paint.',
    'A ghost is always faint, so it can be ignored — A ghost is 0.18 % of its source, and a bright lamp or sun in a dark scene can be 10 000 times brighter than the scene. Ghosts are visible exactly where contrast is wanted.',
    'Stray light is the same as flare from the lens glass only — It also comes from the mount, the tube, the sensor cover glass and the walls of the instrument. A good lens in a shiny tube still fogs the picture.'
  ],
  terms: [
    { term: 'Stray light', also: ['unwanted light', 'veiling glare'], def: 'Light that reaches the detector by a path the design did not intend. It lowers contrast and lifts the black level.' },
    { term: 'Ghost', also: ['ghost image'], def: 'A faint image or spot formed by light reflected twice between lens surfaces, often a defocused copy or a ring round a bright object.' },
    { term: 'Baffle', also: ['vane', 'baffle vane'], def: 'A plate or ring inside a tube with an opening just large enough to pass the picture-forming beam, which blocks the wall from the sensor.' },
    { term: 'Lyot stop', def: 'A mask at a pupil plane, a little smaller than the image of the aperture, that blocks light diffracted from the aperture edge.' },
    { term: 'Veiling glare', also: ['flare'], def: 'A haze of scattered light spread over the image, which lifts the darkest parts and lowers contrast.' }
  ],
  formulas: [
    {
      name: 'Strength of a ghost from two reflections',
      expr: 'g = R1*R2', tex: 'g = R_1\\,R_2',
      vars: {
        g: { name: 'ghost strength (share of the light)', q: 'ratio', unit: '%' },
        R1: { name: 'reflectance of the first surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 100, tex: 'R_1' },
        R2: { name: 'reflectance of the second surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 100, tex: 'R_2' }
      },
      note: 'An in-focus ghost; a defocused one is spread over a larger area and is fainter per pixel.',
      stories: { g: 'Two surfaces reflect {R1} and {R2}. What share of the light forms a ghost by reflecting off both?' }
    },
    {
      name: 'Number of surface pairs that can make ghosts',
      expr: 'Np = n*(n - 1)/2', tex: 'N_p = \\frac{n\\,(n - 1)}{2}',
      vars: {
        Np: { name: 'number of surface pairs', int: true, tex: 'N_p' },
        n: { name: 'number of glass surfaces', value: 10, int: true, min: 2, max: 60 }
      },
      note: 'Every pair can bounce light between its surfaces, though not every pair puts a ghost on the sensor.',
      stories: { Np: 'A lens has {n} glass surfaces. How many pairs of surfaces could make a ghost?' }
    },
    {
      name: 'Light kept after k diffuse bounces',
      expr: 'f = rho^k', tex: 'f = \\rho^{k}',
      vars: {
        f: { name: 'share of the light that survives', q: 'ratio', unit: '%' },
        rho: { name: 'share kept at each bounce', q: 'ratio', unit: '%', value: 55, min: 0, max: 100, tex: '\\rho' },
        k: { name: 'number of bounces', value: 3, int: true, min: 0, max: 20 }
      },
      note: 'Very black surfaces turn each bounce into a large loss: with ρ = 5 % three bounces keep 0.0125 %.',
      stories: { f: 'A surface keeps {rho} of the light at each bounce. How much survives {k} bounces?' }
    }
  ],
  examples: [
    {
      title: 'A lamp and its ghost',
      q: 'A lamp 10 000 times brighter than the wall behind it is in the field of a lens with two surfaces that bounce a ghost between them. How bright is the ghost, relative to the wall, with uncoated glass (4.2 %), a single MgF₂ layer (1.4 %) and a good multilayer (0.1 %)?',
      steps: [
        { text: 'Ghost strength is $R^2$ of the lamp. Uncoated:', tex: '0.042^2 \\times 10^4 = 18' },
        { text: 'Single layer:', tex: '0.014^2 \\times 10^4 = 1.96' },
        { text: 'Multilayer:', tex: '0.001^2 \\times 10^4 = 0.01' }
      ],
      a: 'The ghost is 18 times brighter than the wall uncoated, about twice as bright with MgF₂, and 1 % of the wall with a multilayer, which is below notice.'
    },
    {
      title: 'Paint against bare metal',
      q: 'Light bounces three times inside a tube before it could reach the sensor. How much survives if the tube is bare metal (55 % kept per bounce) and if it is matt black (5 %)?',
      steps: [
        { text: 'Bare metal:', tex: '0.55^3 = 0.166' },
        { text: 'Matt black:', tex: '0.05^3 = 1.25 \\times 10^{-4}' },
        { text: 'The ratio is', tex: '\\frac{0.166}{1.25 \\times 10^{-4}} = 1330' }
      ],
      a: 'About 1300 times less light after three bounces. Grazing reflections are stronger in practice, which is why the vanes are still needed.'
    }
  ],
  quiz: [
    { q: 'Two uncoated glass surfaces (4.2 % each) make a ghost. How strong is it, as a share of the light?', choices: ['0.18 %', '4.2 %', '8.4 %', '0.0018 %'], a: 0, why: 'A ghost needs two reflections: $0.042 \\times 0.042 = 0.0018$, or 0.18 %.' },
    { q: 'A lens has 8 glass surfaces. How many pairs of surfaces can make a ghost?', answer: 28, why: '$n(n-1)/2 = 8 \\times 7/2 = 28$.' },
    { q: 'Adding vanes to a tube always reduces stray light, however many.', a: false, why: 'Vanes block most paths, but they are surfaces themselves, with edges that scatter, and each must clear the picture-forming beam. Beyond a few the gain levels off, and a poorly made vane can add scatter.' },
    { q: 'A surface keeps 10 % of the light at each diffuse bounce. After three bounces, what percentage of the light survives?', answer: 0.1, why: '$0.10^3 = 0.001$, which is 0.1 %.' },
    { q: 'Where is a Lyot stop placed?', choices: ['At a pupil plane, slightly smaller than the image of the aperture', 'At a field plane, to cut the edge of the picture', 'At the sensor', 'On the front glass'], a: 0, why: 'It is a mask in a pupil plane; it blocks the light diffracted from the edge of the first aperture. A field stop, in contrast, sits at a field plane.' }
  ],
  applications: [
    'Lens hoods on cameras and telescopes, and the black ribbed interior of lens barrels and telescope tubes.',
    'Spectrometers and monochromators, whose stray-light rating (the signal at a wavelength where there should be none) decides how dark a sample they can measure.',
    'Coronagraphs on telescopes, where a Lyot stop and an occulting disc let a faint planet or the solar corona be seen beside a bright star or the Sun.',
    'Projectors, headlamps and illuminators, whose internal baffles and matt interiors keep light from escaping where it is not wanted.',
    'Laser enclosures, beam dumps and light traps, where blackening and baffles absorb what scatters (see [[laser-eye-hazards-and-eyewear]]).'
  ],
  history: 'Bernard Lyot built the first coronagraph at the Pic du Midi observatory in 1930, to see the corona of the Sun without waiting for an eclipse. The mask that now bears his name, in a pupil plane, stops the light the occulting disc diffracts.',
  sources: [
    'E. C. Fest, *Stray Light Analysis and Control* (SPIE Press) — sources of stray light, baffles, blackening and analysis.',
    'W. J. Smith, *Modern Optical Engineering* — stops, baffles and vignetting in lens systems.'
  ],
  sim: 'us-stray'
},

/* ================================================================ testing and commissioning */
{
  id: 'testing-and-commissioning', parent: 'understanding-optical-systems', title: 'Testing a finished system', level: 2,
  short: 'A finished system is accepted by measurement, not by looking at one picture: a bar target gives the resolution, a slanted edge the MTF, a grid the distortion, a flat card the uniformity, and a hot-and-cold run the focus drift. Each test checks one line of the specification, on the real system, in the conditions it will work in.',
  keywords: ['testing', 'commissioning', 'acceptance test', 'USAF 1951', 'bar target', 'distortion grid', 'flat field', 'uniformity', 'focus drift', 'temperature', 'MTF50', 'slanted edge', 'factory test', 'ISO 12233'],
  prereq: ['the-modulation-transfer-function', 'lens-distortion-and-calibration', 'relative-illumination-and-shading'],
  related: ['measuring-mtf', 'sensor-noise', 'thermal-effects-in-optics', 'the-autocollimator', 'specifying-an-optical-system', 'tolerancing-and-alignment-budget'],
  body: `
A finished system is accepted by measurement, not by one picture. Every line of the specification ([[specifying-an-optical-system]]) gets a test, a method and a number, done on the real system in the conditions it will work in: **commissioning**.

### One test for each line

| Specification line | Test | What is measured |
|---|---|---|
| Resolution | bar target (USAF 1951), Siemens star, slanted edge | last element read; MTF at set frequencies, or MTF50 ([[measuring-mtf]]) |
| Distortion | a grid or checkerboard | displacement of the grid points; the coefficient k ([[lens-distortion-and-calibration]]) |
| Uniformity | a flat white card | brightest against darkest; corner against centre ([[relative-illumination-and-shading]]) |
| Noise | flat fields at several exposures | signal-to-noise ratio, dark and fixed-pattern noise ([[sensor-noise]]) |
| Alignment | an autocollimator | tilt and decentre ([[the-autocollimator]]) |
| Focus over temperature | a climate chamber, three or more temperatures | best-focus position against temperature |

### The bar target
The USAF 1951 chart is numbered in groups and elements. Element e of group g has the frequency $\\nu = 2^{\\,g + (e-1)/6}$ lp/mm: each element is 12 % finer than the last, each group twice as fine. Group 2 element 3 is 5.04 lp/mm; group 6 element 5 is 101.6. The reading is the last element in which the three bars can still be told apart. In the simulation, a chart at 1:1 through f/5.6 on 3.45 µm pixels reads to group 6 element 5 at 20 % contrast; at f/16 only to group 5 element 2 (35.9 lp/mm). A bar target gives one number per place in the field; a slanted edge gives the whole MTF curve from one picture.

### Distortion and flatness
A grid shows distortion at once. The usual model is $r' = r(1 + k\\,r^2)$, with r from the centre and the corner at 1: a k of −0.08 is barrel distortion of 8 % at the corner. A fit to the grid gives k, and software removes it. A flat white card shows the fall-off of light: at a half-angle of 28° the cos⁴ law alone leaves 61 % of the centre's light in the corner, at 35° only 45 %. A flat-field correction divides the picture by the card, which flattens it but multiplies the corner noise by the same factor, 1/0.61 = 1.6.

### Focus over temperature
Glass and metal expand, the refractive index changes with temperature, and a barrel that grows moves the sensor ([[thermal-effects-in-optics]]). For a thin 25 mm lens warmed by 40 K the first-order drift (positive when the image falls behind the sensor) is:

| Lens and barrel | Drift at +40 K |
|---|---|
| glass, aluminium | −19 µm |
| glass, steel | −8 µm |
| acrylic, aluminium | +260 µm |
| acrylic, glass-filled plastic | +243 µm |

The depth of focus at f/4 on 3.45 µm pixels is only ±13.8 µm. Acrylic's index falls by about 105 parts per million per kelvin, which lengthens its focal length faster than any barrel can follow. Real plastic lens modules cancel most of this with several elements; the test shows whether they do.

### Pass, fail and records
Set the pass threshold from the specification *before* testing; test at the extremes (centre and corner, cold and hot); measure several units for the spread; keep records by serial number.

> [!key] Every line of the specification gets a test with a number: bar target or slanted edge for resolution, grid for distortion, flat card for uniformity, a hot-and-cold run for focus. Set the threshold first, test at the extremes, and keep the records.
`,
  ideas: [
    'Each specification line gets its own test, method and threshold; acceptance is by measurement.',
    'In the USAF 1951 chart the frequency is 2 to the power g + (e − 1)/6 lp/mm: each element 12 % finer, each group twice as fine.',
    'A grid measures distortion k; a flat card measures the cos⁴, vignetting and lamp fall-off, and its correction raises the corner noise.',
    'Focus drifts with temperature through expansion, dn/dT and the barrel; acrylic in a plastic barrel can drift ten times the depth of focus.',
    'Set thresholds first, test at the extremes of field and temperature, and keep the records by serial number.'
  ],
  pitfalls: [
    'A test at room temperature is enough — Focus, and sometimes alignment, move with temperature. A camera used outdoors, in a car or beside an oven must be tested cold and hot.',
    'A flat-field correction removes corner darkening for free — It divides the picture by the card, so the noise in the corners is multiplied by the same factor: a dark corner stays a noisy one.',
    'The last bar group you can read is the MTF — It is one number at one place. The MTF is a curve over all frequencies; a target reading at 20 % contrast is a handy summary, not the whole.'
  ],
  terms: [
    { term: 'Commissioning', also: ['acceptance test', 'site acceptance'], def: 'Testing a finished system, in place and in its working conditions, against every line of the specification before it is accepted.' },
    { term: 'USAF 1951 target', also: ['USAF chart', 'bar target', 'resolution target'], def: 'A chart of groups of three-bar patterns whose frequency rises by 12 % from element to element: 2^(g + (e − 1)/6) lp/mm for group g, element e.' },
    { term: 'Flat-field correction', also: ['shading correction'], def: 'Dividing a picture by the picture of a uniform card, to remove fall-off of light and pixel gain differences. It multiplies the noise where the card was dark.' },
    { term: 'Distortion coefficient', also: ['k1', 'radial distortion'], def: 'The coefficient k of r′ = r(1 + k r²): negative for barrel distortion, positive for pincushion. It is found by fitting a grid and used to remove the distortion.' }
  ],
  formulas: [
    {
      name: 'Frequency of a USAF 1951 element',
      expr: 'nu = 2^(g + (el - 1)/6)', tex: '\\nu = 2^{\\,g + (e - 1)/6}',
      vars: {
        nu: { name: 'spatial frequency on the chart', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu' },
        g: { name: 'group number', value: 6, int: true, signed: true, min: -2, max: 10 },
        el: { name: 'element number', value: 5, int: true, min: 1, max: 6, tex: 'e' }
      },
      note: 'Each bar of the element is 1/(2ν) wide. The frequency on the sensor is this times the magnification.',
      stories: { nu: 'A bar target is read down to group {g}, element {el}. What spatial frequency is that on the chart?' }
    },
    {
      name: 'Distortion at a given radius',
      expr: 'D = k*r^2', tex: 'D = k\\,r^2',
      vars: {
        D: { name: 'distortion at that radius', q: 'ratio', unit: '%', signed: true },
        k: { name: 'distortion coefficient (edge of the field)', value: -0.08, signed: true },
        r: { name: 'radius, as a share of the corner distance', value: 1, min: 0, max: 1.5 }
      },
      note: 'Negative: barrel (points pulled towards the centre). Positive: pincushion. At the corner (r = 1) it is just k.',
      stories: { D: 'A lens has a distortion coefficient of {k}. What is the distortion at {r} of the distance to the corner?' }
    },
    {
      name: 'Light fall-off at the edge of the field (cos⁴)',
      expr: 'rel = cos(theta)^4', tex: 'R_{\\theta} = \\cos^4\\theta',
      vars: {
        rel: { name: 'light at the edge relative to the centre', q: 'ratio', unit: '%', tex: 'R_{\\theta}' },
        theta: { name: 'angle of the field point', q: 'angle', unit: '°', value: 28, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For a lens without vignetting and a flat sensor. Vignetting and the chief ray angle in the lens can make it worse, or, with a good design, a little better.',
      stories: { rel: 'A point {theta} off the axis is imaged by a lens with no vignetting. How much of the light of the centre does it receive?' }
    },
    {
      name: 'Focus drift of a thin lens with temperature',
      expr: 'df = f*(al - dn/(n - 1) - ab)*dT*1e-3', tex: '\\delta = f\\left(\\alpha_{\\mathrm{L}} - \\frac{\\beta}{n - 1} - \\alpha_{\\mathrm{B}}\\right)\\Delta T',
      vars: {
        df: { name: 'where the image falls relative to the sensor (+ behind it)', q: false, unit: 'µm', signed: true, tex: '\\delta' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 25 },
        al: { name: 'expansion of the lens glass (ppm/K)', q: false, unit: 'ppm/K', value: 7.1, tex: '\\alpha_{\\mathrm{L}}' },
        dn: { name: 'change of index with temperature, dn/dT (ppm/K)', q: false, unit: 'ppm/K', value: 1.6, signed: true, tex: '\\beta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.1, max: 4 },
        ab: { name: 'expansion of the barrel (ppm/K)', q: false, unit: 'ppm/K', value: 23, tex: '\\alpha_{\\mathrm{B}}' },
        dT: { name: 'temperature change (K)', q: false, unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      note: 'A thin single lens focused at infinity, the sensor carried by a barrel of the length f. Values for N-BK7 in aluminium: −19 µm at +40 K. For acrylic use 68, −105 and n = 1.49.',
      stories: { df: 'A {f} lens of glass (expansion {al}, dn/dT {dn}, index {n}) sits in a barrel expanding at {ab}. It is warmed by {dT}. Where does the image fall relative to the sensor?' }
    }
  ],
  examples: [
    {
      title: 'Reading a bar target',
      q: 'A camera reads a USAF 1951 chart, imaged at 1:1, down to group 5, element 4. What are the resolution in lp/mm and the width of one bar on the chart?',
      steps: [
        { text: 'The frequency:', tex: '\\nu = 2^{\\,5 + 3/6} = 2^{5.5} = 45.3\\ \\mathrm{lp/mm}' },
        { text: 'A line pair is 1/45.3 mm = 22 µm, so one bar is', tex: '\\frac{1}{2\\nu} = 11\\ \\mathrm{\\mu m}' }
      ],
      a: '45 lp/mm; bars 11 µm wide. At 1:1 this is also the resolution on the sensor; at another magnification divide by m to find the sensor-side value.'
    },
    {
      title: 'Does the focus survive a hot day?',
      q: 'A 25 mm glass lens in an aluminium barrel and the same lens in a steel barrel are warmed by 40 K. The depth of focus is ±13.8 µm. Which one stays in focus?',
      steps: [
        { text: 'Aluminium barrel (23 ppm/K):', tex: '\\delta = 25 \\times (7.1 - 3.1 - 23) \\times 40 \\times 10^{-3} = -19\\ \\mathrm{\\mu m}' },
        { text: 'Steel barrel (12 ppm/K):', tex: '\\delta = 25 \\times (7.1 - 3.1 - 12) \\times 40 \\times 10^{-3} = -8\\ \\mathrm{\\mu m}' }
      ],
      a: 'The steel barrel (−8 µm, inside ±13.8). The aluminium barrel grows faster than the lens focus and pulls the sensor 19 µm too far back, out of focus.'
    }
  ],
  quiz: [
    { q: 'What is the frequency, in lp/mm, of group 4, element 1 of a USAF 1951 chart?', answer: 16, why: '$\\nu = 2^{4 + 0/6} = 16$ lp/mm. Group 5 element 1 is 32, group 6 element 1 is 64.' },
    { q: 'A flat white card shows the corner at 45 % of the centre. A flat-field correction multiplies the noise in the corner by about', answer: 2.2, why: 'The correction divides by 0.45, so it multiplies both signal and noise by $1/0.45 = 2.2$: the corner becomes as bright as the centre but 2.2 times noisier relative to what a bright pixel would have.' },
    { q: 'A camera that passes its focus test at 20 °C is certain to be in focus at 60 °C.', a: false, why: 'Focus drifts with temperature through the expansion of the lens and barrel and the change of the refractive index. A lens of plastic can drift by many times the depth of focus; the test must be repeated hot and cold.' },
    { q: 'A grid imaged by a lens has its outer lines bowed outwards in the middle, like the sides of a barrel. The distortion coefficient k is', choices: ['negative', 'positive', 'zero', 'infinite'], a: 0, why: 'Barrel distortion pulls the points towards the centre, so the distorted radius is smaller than the true one: $1 + kr^2 < 1$, so k is negative.' },
    { q: 'Which test gives the whole MTF curve from a single picture?', choices: ['A slanted edge', 'A USAF bar target', 'A flat white card', 'A checkerboard grid'], a: 0, why: 'The slanted-edge method of ISO 12233 turns the edge profile into the edge spread function, then the line spread function, then the MTF at all frequencies. A bar target gives one contrast per element.' }
  ],
  applications: [
    'End-of-line testing of camera modules, where each unit is shot against a chart for resolution, shading, colour and focus before it is shipped.',
    'Site acceptance of a machine-vision cell: a target at the working distance, a grid for calibration, and a repeatability test at several temperatures.',
    'Quality testing of lenses by their makers, on MTF benches that measure the curve at several field positions.',
    'Commissioning telescopes and endoscopes, where a star test, a resolution chart and a stray-light test check the instrument.',
    'Field checks of a surveillance or automotive camera for focus drift between summer and winter.'
  ],
  history: 'The three-bar resolution target takes its name from the US Air Force, which specified it in 1951 to test aerial reconnaissance lenses and film; the military standard MIL-STD-150A defines it. It is still found on optical benches seventy years on.',
  sources: [
    'ISO 12233, *Photography — Electronic still picture imaging — Resolution and spatial frequency responses* — slanted-edge MTF and the other methods of measuring resolution.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — how to measure and state sensitivity, noise and dynamic range.',
    'D. Malacara (ed.), *Optical Shop Testing* — testing of lenses and surfaces: interferometry, star tests, resolution charts and distortion.',
    'MIL-STD-150A, *Photographic Lenses* — the military standard that defines the 1951 USAF resolving-power target.'
  ],
  sim: 'us-commissioning'
},

/* ================================================================ the abbreviations of optics */
{
  id: 'optical-abbreviations', parent: 'understanding-optical-systems', title: 'The abbreviations of optics', level: 1,
  short: 'Optics is full of abbreviations, and many mean different things in different trades: AOI is an angle, an area and an inspection; OD is a density, a diameter and an eye. This page decodes ninety-odd of them in six families, each with a link to the page that explains it.',
  keywords: ['abbreviations', 'acronyms', 'glossary', 'AOI', 'OD', 'CA', 'EFL', 'BFL', 'FFD', 'NA', 'MTF', 'PSF', 'FOV', 'QE', 'SNR', 'ROI', 'CCD', 'CMOS', 'AR', 'ND', 'PBS', 'TIR', 'decoder', 'datasheet'],
  prereq: ['how-to-read-an-optical-system', 'reading-an-optics-catalogue'],
  related: ['reading-a-lens-datasheet', 'reading-a-prescription', 'angle-of-incidence-and-coatings', 'binning-roi-and-area-of-interest', 'automated-optical-inspection', 'neutral-density-and-optical-density'],
  body: `
Optics is full of abbreviations, and a datasheet can read like a code: *PCX, EFL 100, N-BK7, BBAR 400–700, 60-40, λ/10*. The short forms are useful. The trouble is that they come from many trades (lens making, photography, sensors, lasers, optometry, standards) and the same letters can mean different things in each. This page decodes about ninety of them in six families, and every row says where to read more.

### Three rules for reading them
1. **Read the context first.** The same letters change meaning with the page: on a coating datasheet AOI is an angle, on a camera datasheet an area, on a factory floor a machine that inspects boards.
2. **Check the definition, not the letters.** NA, f/# and N all describe the cone of light, but NA is $n \\sin\\theta$ and f/# is f over D; EFL and BFL are both focal distances, but from different places.
3. **Look for the standard.** Many abbreviations are fixed by a standard (EMVA 1288, ISO 10110, IEC 60825-1), which says exactly what is measured and how.

### Three that mean three things
- **AOI** is the *angle of incidence* of a ray on a surface, measured from the normal ([[angle-of-incidence-and-coatings]]); the *area of interest* of a sensor, the window that is read out ([[binning-roi-and-area-of-interest]]); or *automated optical inspection* in a factory ([[automated-optical-inspection]]).
- **OD** is *optical density*, −log₁₀ of the transmittance (OD 3 passes 0.1 %) ([[neutral-density-and-optical-density]]); the *outer diameter* of a part in a catalogue ([[reading-an-optics-catalogue]]); or the *right eye*, from the Latin *oculus dexter*, on a prescription ([[reading-a-prescription]]).
- **CA** is the *clear aperture*, the usable diameter of a part, or *chromatic aberration*, the colour error of a lens ([[axial-chromatic-aberration]]).

### Reading a catalogue line
A line such as *PCX, Ø25.4 mm, EFL 100 mm, N-BK7, BBAR 400–700 nm, 60-40* is a plano-convex lens (PCX), 25.4 mm (one inch) across, with an effective focal length of 100 mm, made of N-BK7 glass, with a broadband antireflection coating for 400 to 700 nm and a scratch-dig grade of 60-40. The examples below decode this and a machine-vision lens line.

### The tables
Each row gives the abbreviation, what it stands for in a few words, and the page that explains it.

### Lenses, stops and systems

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **AOI** | angle of incidence (coatings and filters), area of interest (sensors) or automated optical inspection (manufacturing): three unrelated meanings | [[angle-of-incidence-and-coatings|angle of incidence]], [[binning-roi-and-area-of-interest|area of interest]], [[automated-optical-inspection|optical inspection]] |
| **BFL** | back focal length: from the last lens surface to the focal point | [[cardinal-points|cardinal points]] |
| **BS** | beam splitter | [[beam-splitters|beam splitters]] |
| **CA** | clear aperture (the usable diameter of a part) or chromatic aberration (colour-dependent focus) | [[reading-an-optics-catalogue|clear aperture]], [[axial-chromatic-aberration|chromatic aberration]] |
| **DCX, DCV** | double-convex and double-concave lens | [[catalogue-lens-types|catalogue lens types]] |
| **PCX, PCV** | plano-convex and plano-concave lens | [[catalogue-lens-types|catalogue lens types]] |
| **EFL** | effective focal length: the focal length of the lens as a whole | [[focal-length-and-optical-power|focal length]] |
| **ED** | extra-low dispersion glass, used against colour fringes | [[apochromats-and-ed-glass|ED glass]] |
| **EPD** | entrance pupil diameter: the opening as seen from the front | [[entrance-and-exit-pupils|pupils]] |
| **FOV** | field of view, also HFOV, VFOV, DFOV (horizontal, vertical, diagonal) | [[field-of-view-and-focal-length|field of view]] |
| **f/#** | f-number: focal length divided by entrance-pupil diameter | [[the-f-number|the f-number]] |
| **GRIN** | gradient index: a refractive index that changes inside the material | [[gradient-index-optics|gradient-index optics]] |
| **lp/mm** | line pairs per millimetre: one dark and one bright line is one pair | [[spatial-frequency-and-line-pairs|line pairs]] |
| **MTF** | modulation transfer function: how much contrast survives at each fineness of detail | [[the-modulation-transfer-function|MTF]] |
| **NA** | numerical aperture: n sin θ of the half-angle of the light cone | [[numerical-aperture|numerical aperture]] |
| **OPD** | optical path difference between a real wavefront and an ideal one | [[wavefront-error-and-zernike-polynomials|wavefront error]] |
| **OPL** | optical path length: index times geometric distance, summed along a ray | [[optical-path-length|optical path length]] |
| **PSF** | point spread function: the image of a single point of light | [[the-point-spread-function|point spread function]] |
| **RMS** | root mean square, as in RMS spot radius or RMS wavefront error | [[spot-diagrams-and-ray-fans|spot diagrams]] |
| **ROC** | radius of curvature of a surface | [[lens-shapes-and-names|lens shapes]] |
| **T-stop** | f-number corrected for the light the glass absorbs, used on cine lenses | [[the-f-number|T-stops]] |
| **TIR** | total internal reflection: all the light stays inside the dense medium | [[critical-angle-and-total-internal-reflection|total internal reflection]] |
| **WD** | working distance: from the front of the lens to the object | [[magnification-and-working-distance|working distance]] |
| **WFE** | wavefront error | [[wavefront-error-and-zernike-polynomials|wavefront error]] |

### Cameras, sensors and imaging

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **AF, PDAF** | autofocus, and phase-detection autofocus | [[autofocus-methods|autofocus]] |
| **BSI** | back-side illumination: light enters from the side without the wiring | [[microlenses-bsi-and-stacked-sensors|back-side illumination]] |
| **CCD** | charge-coupled device: a sensor that moves charge from pixel to pixel to one amplifier | [[ccd-sensors|CCD sensors]] |
| **CMOS** | complementary metal-oxide semiconductor: a sensor with an amplifier in every pixel | [[cmos-sensors|CMOS sensors]] |
| **COC** | circle of confusion: the largest blur that still counts as sharp | [[circle-of-confusion|circle of confusion]] |
| **CRA** | chief ray angle: the angle at which the central ray of a bundle meets the sensor | [[microlenses-bsi-and-stacked-sensors|microlenses]] |
| **DOF** | depth of field: the range of distances that looks sharp | [[depth-of-field|depth of field]] |
| **DR** | dynamic range: brightest over darkest level a sensor can record | [[dynamic-range-and-full-well|dynamic range]] |
| **EMCCD, TDI** | electron-multiplying CCD, and time-delay integration for moving scenes | [[ccd-architectures|CCD architectures]] |
| **EV** | exposure value: one number for aperture and shutter time together | [[metering-and-exposure-value|exposure value]] |
| **FF** | fill factor: the share of a pixel that collects light | [[microlenses-bsi-and-stacked-sensors|fill factor]] |
| **FFD** | flange focal distance: from the mount face to the sensor | [[lens-mounts-and-flange-distance|flange distance]] |
| **FPN** | fixed-pattern noise: the same pixel-to-pixel offsets in every frame | [[sensor-noise|sensor noise]] |
| **fps** | frames per second | [[area-scan-and-line-scan-cameras|area-scan cameras]] |
| **HDR** | high dynamic range: capturing more levels than one exposure holds | [[dynamic-range-and-full-well|dynamic range]] |
| **IR-cut** | a filter in front of a silicon sensor that blocks the near infrared | [[quantum-efficiency-and-spectral-response|spectral response]] |
| **ISO** | film speed or its sensor equivalent: the gain applied to the signal | [[iso-and-gain|ISO and gain]] |
| **MOD** | minimum object distance: the closest a lens can focus | [[focusing-a-lens|focusing]] |
| **NETD** | noise-equivalent temperature difference: the smallest temperature step a thermal camera sees | [[infrared-and-thermal-sensors|thermal sensors]] |
| **OIS** | optical image stabilization | [[image-stabilization|image stabilization]] |
| **OLPF** | optical low-pass filter: blurs detail finer than the pixels to prevent aliasing | [[nyquist-sampling-and-aliasing|aliasing]] |
| **QE** | quantum efficiency: the share of photons that become electrons | [[quantum-efficiency-and-spectral-response|quantum efficiency]] |
| **ROI** | region of interest: the window of the sensor that is read out | [[binning-roi-and-area-of-interest|region of interest]] |
| **SNR** | signal-to-noise ratio | [[sensor-noise|sensor noise]] |

### Coatings, materials and surfaces

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **AR** | antireflection coating | [[antireflection-coatings|antireflection coatings]] |
| **BBAR** | broadband antireflection coating, working over a wide range of wavelengths | [[antireflection-coatings|antireflection coatings]] |
| **HR** | high reflector: a mirror coating for one wavelength or band | [[dielectric-mirrors|dielectric mirrors]] |
| **LIDT** | laser-induced damage threshold: the fluence or power density a coating survives | [[laser-damage-and-coating-durability|laser damage]] |
| **ND** | neutral density: a filter that dims every colour equally | [[neutral-density-and-optical-density|neutral density]] |
| **OD** | optical density (−log₁₀ of the transmittance), the outer diameter of a part in a catalogue, or the right eye on a prescription (oculus dexter) | [[neutral-density-and-optical-density|optical density]], [[reading-an-optics-catalogue|outer diameter]], [[reading-a-prescription|right eye]] |
| **CTE** | coefficient of thermal expansion | [[thermal-effects-in-optics|thermal effects]] |
| **V_d, ν_d** | the Abbe number: how little a glass disperses colours | [[the-abbe-number-and-glass-map|Abbe number]] |
| **n_d** | refractive index at the helium d line, 587.6 nm | [[optical-glass|optical glass]] |
| **N-BK7** | a borosilicate crown glass, the everyday optical glass | [[optical-glass|optical glass]] |
| **PMMA, COP** | acrylic, and cyclo-olefin polymer: moulded optical plastics | [[optical-plastics|optical plastics]] |
| **scratch-dig** | two numbers for surface cosmetics, such as 60-40 | [[surface-quality-and-flatness|surface quality]] |
| **λ/4, λ/10** | flatness in fractions of a wavelength, or the retardance of a wave plate | [[surface-quality-and-flatness|flatness]], [[wave-plates|wave plates]] |
| **QWP, HWP** | quarter-wave and half-wave plate | [[wave-plates|wave plates]] |
| **PBS** | polarizing beam splitter: transmits one polarization, reflects the other | [[polarizing-beam-splitters|polarizing beam splitters]] |
| **DOE** | diffractive optical element: a surface relief that steers light by diffraction | [[diffractive-optical-elements|diffractive elements]] |
| **CWL, FWHM** | centre wavelength and full width at half maximum of a filter band | [[interference-filters|interference filters]] |

### Light, lasers and fibre

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **CCT** | correlated colour temperature: how warm or cool a white light looks | [[colour-temperature-and-colour-rendering|colour temperature]] |
| **CRI** | colour rendering index: how faithfully a lamp shows colours | [[colour-temperature-and-colour-rendering|colour rendering]] |
| **CW** | continuous wave: a laser that is always on | [[continuous-and-pulsed-lasers|continuous and pulsed lasers]] |
| **LED** | light-emitting diode | [[light-emitting-diodes|LEDs]] |
| **lm, lx, cd, nit** | lumen, lux, candela and cd/m²: the photometric units | [[lumens-candelas-lux-and-nits|photometric units]] |
| **UV, VIS, IR** | ultraviolet, visible and infrared light | [[the-optical-spectrum|the optical spectrum]] |
| **NIR, SWIR, LWIR** | near, short-wave and long-wave infrared bands | [[infrared-and-thermal-sensors|infrared sensors]] |
| **M²** | beam quality factor: how many times a real beam diverges more than an ideal Gaussian | [[beam-quality-m-squared|beam quality]] |
| **MFD** | mode field diameter: the width of the light in a single-mode fibre | [[single-mode-and-multimode-fibre|single-mode fibre]] |
| **MPE** | maximum permissible exposure: the safety limit of laser light at the eye or skin | [[laser-safety-classes|laser safety]] |
| **PC, UPC, APC** | physical-contact, ultra-physical-contact and angled polish of a fibre end | [[fibre-connectors-and-ferrules|fibre connectors]] |
| **SLM** | spatial light modulator: a pixel array that shapes the phase or amplitude of light | [[spatial-light-modulators|spatial light modulators]] |
| **TEM₀₀** | the lowest transverse mode of a laser: a clean Gaussian spot | [[laser-modes|laser modes]] |
| **VCSEL** | vertical-cavity surface-emitting laser | [[vcsels-and-laser-arrays|VCSELs]] |

### The eye, spectacles and optometry

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **D** | dioptre: optical power, 1 over the focal length in metres | [[focal-length-and-optical-power|optical power]] |
| **OS, OU** | on a prescription: left eye and both eyes (Latin oculus sinister, oculus uterque); the right eye is OD | [[reading-a-prescription|reading a prescription]] |
| **SPH, CYL, ADD** | sphere, cylinder and reading addition of a prescription | [[reading-a-prescription|reading a prescription]] |
| **PD** | pupillary distance between the centres of the pupils | [[fitting-measurements-and-the-lensmeter|fitting measurements]] |
| **PAL** | progressive addition lens: a spectacle lens whose power changes smoothly | [[progressive-lenses|progressive lenses]] |
| **IOL** | intraocular lens, implanted in the eye | [[intraocular-lenses-and-refractive-surgery|intraocular lenses]] |
| **VA, logMAR** | visual acuity, and its logarithmic scale | [[visual-acuity-charts|acuity charts]], [[the-fovea-and-visual-acuity|visual acuity]] |
| **CSF** | contrast sensitivity function: how faint a pattern the eye sees at each fineness | [[contrast-sensitivity|contrast sensitivity]] |
| **CVD** | colour-vision deficiency | [[colour-vision-deficiency|colour-vision deficiency]] |

### Testing, standards and measurement

| Abbreviation | What it stands for | Read more |
|---|---|---|
| **EMVA 1288** | the European standard for measuring and stating camera and sensor performance | [[sensor-noise|sensor noise]] |
| **USAF 1951** | a bar-target pattern with numbered groups and elements for resolution tests | [[measuring-mtf|measuring MTF]] |
| **ISO 12233** | the standard for measuring resolution of cameras by the slanted edge | [[measuring-mtf|measuring MTF]] |
| **MTF50** | the spatial frequency at which MTF has fallen to 50 % | [[measuring-mtf|measuring MTF]] |
| **IEC 60825-1** | the international standard for laser product safety | [[laser-safety-classes|laser safety classes]] |
| **ISO 10110** | the standard for drawings of optical parts | [[optical-drawings-and-iso-10110|optical drawings]] |
| **MIL-PRF-13830B** | the US military specification behind scratch-dig numbers | [[surface-quality-and-flatness|surface quality]] |
| **ΔE** | colour difference in CIELAB units | [[colour-difference-and-tolerance|colour difference]] |
| **GigE, CXP** | GigE Vision and CoaXPress: camera interfaces for machine vision | [[camera-interfaces|camera interfaces]] |
| **MV** | machine vision: cameras that inspect and measure automatically | [[the-machine-vision-system|machine vision]] |
> [!key] An abbreviation means something only in its context: AOI, OD and CA each have three meanings. Read the page it comes from, check the definition and units, and use the tables to find the page that explains it.
`,
  ideas: [
    'Many abbreviations have several meanings; read the context before the letters.',
    'AOI is an angle of incidence, an area of interest or automated optical inspection; OD an optical density, an outer diameter or the right eye.',
    'EFL, BFL and FFD are all focal distances, but measured from different places: the principal plane, the last glass, the mount flange.',
    'NA, f/# and N describe the same cone of light in different ways: n sin θ, f/D, and the f-number.',
    'Standards fix the exact meaning of many abbreviations (EMVA 1288, ISO 10110, IEC 60825-1).'
  ],
  pitfalls: [
    'An abbreviation has one meaning — AOI, OD and CA each have three, and many others (ROI, DR, ISO) are used in several trades. Check which page or datasheet you are on.',
    'EFL, BFL and FFD are the same distance — EFL is the focal length of the lens (from its principal plane), BFL is measured from the last glass, FFD from the mounting flange. A lens can have a long EFL and a short BFL.',
    'NA and f-number are alternative names for the same thing everywhere — They describe the same cone, but NA = n sin θ uses the index of the medium, and the f-number is defined by focal length and pupil diameter; for a lens focused at infinity in air NA = 1/(2N).'
  ],
  terms: [
    { term: 'AOI', also: ['angle of incidence', 'area of interest', 'automated optical inspection'], def: 'Three unrelated meanings. Angle of incidence: the angle between a ray and the normal to a surface, central to coatings and filters. Area of interest (also ROI): the window of a sensor that is read out. Automated optical inspection: cameras that check boards and parts in manufacturing.' },
    { term: 'OD', also: ['optical density', 'outer diameter', 'oculus dexter'], def: 'Optical density, −log₁₀ of the transmittance (OD 3 passes 0.1 %); in a catalogue the outer diameter of a part; on a prescription the right eye (Latin oculus dexter).' },
    { term: 'CA', also: ['clear aperture', 'chromatic aberration'], def: 'The clear aperture is the usable diameter of a part, set by its edge and mount; chromatic aberration is the colour-dependent focus of a lens. Context tells them apart.' },
    { term: 'FOV', also: ['field of view', 'HFOV', 'VFOV', 'DFOV'], def: 'The angle (or the width on the object) seen by the system; HFOV, VFOV and DFOV are its horizontal, vertical and diagonal values.' },
    { term: 'EFL', also: ['effective focal length', 'focal length', 'f'], def: 'The focal length of a lens as a whole, measured from its rear principal plane to the focus. The number engraved on the barrel.' },
    { term: 'BFL', also: ['back focal length', 'back focus'], def: 'The distance from the last surface of a lens to its focus. Not the same as the flange focal distance, which starts at the mount.' },
    { term: 'FFD', also: ['flange focal distance', 'flange back', 'register'], def: 'The distance from the mounting flange of a lens or camera to the image plane. Lens and camera must be built to the same value.' },
    { term: 'NA', also: ['numerical aperture'], def: 'n sin θ, where θ is the half-angle of the cone of light and n the refractive index of the medium. For a lens in air focused at infinity, NA = 1/(2N).' },
    { term: 'f/#', also: ['f-number', 'N', 'F/#', 'relative aperture'], def: 'The focal length divided by the entrance-pupil diameter, written f/2.8. One stop (a factor 2 in light) is a factor √2 in f/#.' },
    { term: 'MTF', also: ['modulation transfer function'], def: 'The share of the contrast of a pattern that survives imaging, as a function of its fineness in lp/mm. 1 means perfect, 0 means gone.' },
    { term: 'PSF', also: ['point spread function'], def: 'The image of a single point of light: a spot whose shape and size show the blur of the system. Its Fourier transform is the optical transfer function.' },
    { term: 'DOF', also: ['depth of field'], def: 'The range of object distances that appear acceptably sharp. It grows with the f-number and shrinks as the magnification rises.' },
    { term: 'WD', also: ['working distance'], def: 'The distance from the front of the lens to the object. It fixes the room for lights and fixtures.' },
    { term: 'QE', also: ['quantum efficiency'], def: 'The share of the photons falling on a pixel that produce an electron: about 60–90 % for silicon at its best wavelengths.' },
    { term: 'SNR', also: ['signal-to-noise ratio', 'S/N'], def: 'The signal divided by its noise. For shot noise alone it is the square root of the number of electrons, so it grows only as the root of the light.' },
    { term: 'ROI', also: ['region of interest'], def: 'The window of a sensor that is read out, to raise the frame rate or cut the data. Also called AOI (area of interest).' },
    { term: 'CCD', also: ['charge-coupled device'], def: 'A sensor that shifts the charge of each pixel along the array to one output amplifier. Known for low noise and uniformity.' },
    { term: 'CMOS', also: ['CMOS sensor', 'active-pixel sensor'], def: 'A sensor with an amplifier in every pixel and a converter per column. It is fast, cheap and low in power, and has largely replaced the CCD.' },
    { term: 'AR', also: ['antireflection', 'AR coating', 'BBAR', 'broadband AR'], def: 'A thin-film coating that cuts the reflection of a surface from about 4 % to below 1 %, for one wavelength (V-coat) or a band (BBAR).' },
    { term: 'ND', also: ['neutral density', 'ND filter'], def: 'A filter that dims all colours equally. Its strength is given as optical density (ND 0.3 halves the light) or as a stop number.' },
    { term: 'LIDT', also: ['laser-induced damage threshold'], def: 'The energy per area (J/cm²) or power per area (W/cm²) that a coating or surface survives, stated for a wavelength and a pulse length.' },
    { term: 'PBS', also: ['polarizing beam splitter'], def: 'A cube or plate that transmits one polarization (p) and reflects the other (s), used to split, combine and isolate beams.' },
    { term: 'TIR', also: ['total internal reflection'], def: 'The complete reflection of light at the boundary of a denser medium when it arrives beyond the critical angle. It works in prisms and optical fibres.' },
    { term: 'RMS', also: ['root mean square'], def: 'The square root of the mean of the squares: the usual measure of a spot radius or a wavefront error (RMS spot radius, RMS wavefront error).' },
    { term: 'PV', also: ['peak to valley', 'P-V'], def: 'The difference between the highest and lowest point of a surface or wavefront, for example a flatness of λ/10 PV.' },
    { term: 'CCT', also: ['correlated colour temperature'], def: 'The temperature of the black body whose colour is closest to that of a lamp; low values look warm, high values cool.' },
    { term: 'CRI', also: ['colour rendering index', 'Ra'], def: 'A number from 0 to 100 stating how faithfully a lamp shows the colours of objects compared with a reference light of the same CCT.' },
    { term: 'MFD', also: ['mode field diameter'], def: 'The width of the light distribution in a single-mode fibre, about 10 µm at 1550 nm for standard fibre; it sets coupling losses.' },
    { term: 'M²', also: ['M squared', 'beam quality factor'], def: 'How many times a real laser beam diverges more than an ideal Gaussian of the same waist: 1 is perfect, larger is worse.' },
    { term: 'MPE', also: ['maximum permissible exposure'], def: 'The level of laser radiation to which a person may be exposed without harm, set by wavelength and exposure time in the safety standard.' }
  ],
  formulas: [],
  examples: [
    {
      title: 'Decoding a lens listing',
      q: 'A catalogue lists: PCX, Ø25.4 mm, EFL 100 mm, N-BK7, BBAR 400–700 nm, 60-40, CA > 90 %. What is being sold?',
      steps: [
        'PCX: a plano-convex lens, flat on one side. Ø25.4 mm: its diameter, one inch.',
        'EFL 100 mm: the effective focal length, 100 mm. N-BK7: the glass, an everyday borosilicate crown.',
        'BBAR 400–700 nm: a broadband antireflection coating for the visible. 60-40: the scratch-dig grade, a general-purpose cosmetic standard.',
        'CA > 90 %: the clear aperture is more than 90 % of the diameter, so over 22.9 mm of the lens meets the specification.'
      ],
      a: 'A one-inch plano-convex lens of 100 mm focal length in N-BK7, coated for the visible, with a standard surface finish and a clear aperture of at least 22.9 mm.'
    },
    {
      title: 'Decoding a machine-vision lens line',
      q: 'A datasheet says: f = 16 mm, F1.4–F16, 2/3″, C-mount, MOD 0.1 m, distortion < 0.1 %. Read it.',
      steps: [
        'f = 16 mm: the focal length (EFL). F1.4–F16: the f-number runs from f/1.4 wide open to f/16.',
        '2/3″: the largest sensor format the image circle covers, an 11 mm diagonal. C-mount: a thread with a flange focal distance of 17.526 mm.',
        'MOD 0.1 m: the minimum object distance, the closest it can focus. Distortion < 0.1 %: straight lines stay straight to a tenth of a per cent.'
      ],
      a: 'A 16 mm lens for sensors up to 2/3″, f/1.4 to f/16, that fits C-mount cameras, focuses down to 0.1 m and has almost no distortion.'
    }
  ],
  quiz: [
    { q: 'A filter is marked OD 3. What share of the light does it transmit?', choices: ['10 %', '1 %', '0.1 %', '0.01 %'], a: 2, why: 'Optical density is −log₁₀ of the transmittance: OD 3 means a transmittance of 10⁻³, or 0.1 %.' },
    { q: 'In the specification of a camera, "AOI" is most likely', choices: ['an angle of incidence', 'an area of interest, a window of the sensor', 'an alternating optical interface', 'the angle of illumination'], a: 1, why: 'On a camera or sensor datasheet AOI is the area of interest: the part of the sensor that is read out. On a coating datasheet it would be the angle of incidence.' },
    { q: 'Which of EFL, BFL and FFD is measured from the mounting flange of the lens?', choices: ['EFL', 'BFL', 'FFD', 'All three'], a: 2, why: 'The flange focal distance runs from the mounting flange to the image plane. BFL starts at the last glass surface and EFL at the principal plane.' },
    { q: 'A lens focused at infinity in air has an f-number of 2. Its NA is', answer: 0.25, why: '$\\mathrm{NA} = 1/(2N) = 1/4 = 0.25$.' },
    { q: 'A quantum efficiency of 60 % means that', choices: ['60 % of the photons falling on a pixel become electrons', 'the sensor is 60 % uniform', 'the lens passes 60 % of the light', 'the noise is 60 % of the signal'], a: 0, why: 'QE is the share of the incident photons that release an electron in the pixel.' }
  ],
  applications: [
    'Reading a lens or camera datasheet, where every line is an abbreviation that belongs to one of the five questions.',
    'Ordering optics from a catalogue: the line carries shape, size, focal length, glass, coating, surface grade and clear aperture.',
    'Understanding an eyeglass prescription (OD, OS, SPH, CYL, ADD, PD) and the lens parameters behind it.',
    'Understanding a laser safety label and a laser datasheet (CW, M², MPE, LIDT).',
    'Searching: each abbreviation here is a search term, and the table says which page of the app explains it.'
  ],
  sources: [
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — the notation used for optical parts.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — the definitions of quantum efficiency, noise and dynamic range.',
    'IEC 60825-1, *Safety of laser products — Equipment classification and requirements* — the definitions of MPE, classes and related terms.'
  ],
  sim: 'us-abbreviations'
}

);
