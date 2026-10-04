/* HYPER-OPTICS · content/everyday-optical-systems.js — the topic "Everyday systems" (simulations: sims/everyday-optical-systems.js, ids es-…)
 * Optics you own or pass every day, read from the source to the detector with the five questions of how-to-read-an-optical-system:
 * the phone camera, the interchangeable-lens camera, the data projector, flat-panel displays, VR and AR headsets, the optical mouse and
 * encoders, remote controls and light barriers, the fibre internet link, car headlamps and driver cameras, the lighthouse lens,
 * night-vision and thermal cameras. Each page names every part in the order the light meets it and links the page that teaches it.
 */

/* ================================================================ the phone camera, the interchangeable-lens camera, the data projector */
Hyper.add(
{
  id: 'the-phone-camera', parent: 'everyday-optical-systems', title: 'The phone camera', level: 1,
  short: 'A phone camera is a lens of five to eight moulded plastic elements, a fixed hole near f/1.8, an infrared filter and a sensor a few millimetres across whose pixels are about a micrometre wide. Its lenses are tiny, so diffraction and photon noise set the limit, and software does much of the rest.',
  keywords: ['phone camera', 'smartphone camera', 'mobile camera', 'camera module', 'periscope', 'telephoto', 'ultra-wide', 'main camera', 'binning', 'computational photography', 'pixel size', 'OIS', 'equivalent focal length', 'night mode'],
  prereq: ['how-to-read-an-optical-system', 'how-a-camera-works', 'sensor-formats-and-pixel-size'],
  related: ['mobile-phone-lenses', 'aspheric-surfaces', 'binning-roi-and-area-of-interest', 'microlenses-bsi-and-stacked-sensors', 'image-stabilization', 'optical-zoom', 'digital-zoom', 'colour-filter-arrays-and-demosaicing', 'autofocus-methods', 'the-interchangeable-lens-camera', 'the-airy-disk'],
  body: `
The camera you carry is the most numerous optical system on Earth, and the smallest serious one. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** daylight, or the phone's own LED. **Object and field:** anything from a few centimetres to infinity; about 70° across for the main camera, 100° or more for the ultra-wide. **What limits the cone:** a fixed round hole about 2–4 mm across, near f/1.8. **Where it ends up:** on a sensor 5–12 mm across, sampled by pixels near 1 µm. **What is worst:** diffraction and photon noise, because everything is so small.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Cover glass | a hard window; a smear on it scatters light | [[ghosts-flare-and-stray-light]] |
| Lens stack | five to eight moulded plastic elements, nearly all [[aspheric-surfaces|aspheres]], bend the light to a point | [[mobile-phone-lenses]] |
| Aperture | a fixed hole sets the cone; the [[the-f-number|f-number]] follows | [[aperture-stop]] |
| Motors | a voice-coil moves the stack to focus; others shift lens or sensor against shake | [[autofocus-methods]], [[image-stabilization]] |
| Infrared-cut filter | silicon sees to 1100 nm; the filter removes what the eye does not see | [[quantum-efficiency-and-spectral-response]] |
| Microlens and colour filter | one tiny lens and one red, green or blue filter over each pixel | [[colour-filter-arrays-and-demosaicing]] |
| Pixel | a photodiode turns photons into charge | [[how-a-pixel-detects-light]], [[cmos-sensors]] |
| Processor | demosaics, merges frames, cleans noise | [[sensor-noise]] |

### The numbers
| Camera | Equivalent focal length | Real focal length | Field (diagonal) |
|---|---|---|---|
| Ultra-wide | 13 mm | 3.7 mm | 118° |
| Main | 24 mm | 6.8 mm | 84° |
| Telephoto | 70 mm | 19.9 mm | 34° |
| Periscope | 120 mm | 14–20 mm on a small sensor | 20° |

The real focal lengths are for a sensor 12.3 mm across (the 1/1.3-inch class); smaller sensors need shorter lenses for the same view. A 50-megapixel sensor of that size has pixels of 1.2 µm. At f/1.8 the Airy disc of green light is 2.4 µm across ([[the-airy-disk]]): two pixels. Pixels of 0.6 µm cannot show detail the lens never made, which is why they are **binned** in groups of four, nine or sixteen to act as one larger pixel in the dark.

### Why the periscope
A 120 mm view on a small sensor needs a focal length of 14–20 mm, and a straight lens that long cannot lie inside a phone 8 mm thick. A prism or mirror turns the light through 90° so the lens lies flat along the body.

### Reading the sheet
"1/1.3-inch, 50 MP, f/1.8, 24 mm, OIS, PDAF" says: sensor class, pixel count, aperture, equivalent view, optical stabilization and phase-detection autofocus. Compare sensors by their area and pixel size, not by megapixels.

> [!key] A phone camera is a tiny lens, a fixed hole and a sensor whose pixels are smaller than the Airy disc of the lens. Optics sets what can be seen; binning and software trade pixels for light.
`,
  ideas: [
    'Five to eight moulded plastic aspheres in a module a few millimetres tall form the image; the aperture is fixed near f/1.8.',
    'The "equivalent" focal length states the view in full-frame terms; the real focal length is shorter by the crop factor, about 3.5 to 6 for the usual phone sensors.',
    'Pixels near 1 µm are smaller than the Airy disc of an f/1.8 lens (2.4 µm), so more megapixels give less and less real detail.',
    'Binning groups four, nine or sixteen pixels into one: fewer pixels, more light each.',
    'A periscope folds the light so that a long focal length fits a thin body; software adds merging, denoising and hybrid zoom.'
  ],
  pitfalls: [
    'More megapixels always means a sharper picture — Past about 1 µm the lens diffraction limits the detail, and smaller pixels collect less light each. Sensor size and lens quality matter more.',
    'The f-number of a phone is as good as that of a big camera — The ratio is the same, but the hole is only 2–4 mm across, so the cone has the same angle but the sensor and the light collected are far smaller.',
    'Digital zoom and "optical zoom" are the same thing — A telephoto camera makes a bigger image on the sensor; digital zoom only crops and enlarges (see [[digital-zoom]]).',
    'Software makes up for any lens — Software merges frames and removes noise but cannot recover detail the optics never resolved.'
  ],
  terms: [
    { term: 'Camera module', also: ['camera unit', 'lens module'], def: 'The lens stack, its focusing and stabilizing motors, the filter and the sensor, built as one sealed unit a few millimetres tall.' },
    { term: 'Multi-camera phone', also: ['ultra-wide, main and telephoto cameras'], def: 'A phone with several fixed cameras of different focal lengths, typically an ultra-wide, a main and a telephoto, which it switches between instead of zooming one lens.' },
    { term: 'Periscope lens', also: ['folded telephoto'], def: 'A telephoto lens whose light is turned through 90° by a prism or mirror so that its length lies along the body of the phone instead of through its thickness.' },
    { term: 'Voice-coil motor', also: ['VCM', 'autofocus actuator'], def: 'A coil and magnet that move the lens stack a fraction of a millimetre to focus; a similar pair of actuators can shift the lens or the sensor against shake.' },
    { term: 'Computational photography', also: ['multi-frame merging', 'night mode'], def: 'Taking several frames and merging, aligning and denoising them in software, so that a small sensor yields a picture that a single exposure could not.' },
    { term: 'Cover glass', also: ['camera window'], def: 'The hard flat window in front of the lens. A smear or scratch on it scatters light and shows as haze and flare.' }
  ],
  formulas: [
    {
      name: 'Airy disc against the pixel',
      expr: 'd = 2.44*lam*N', tex: 'd = 2.44\\,\\lambda\\,N',
      vars: {
        d: { name: 'Airy disc diameter', q: 'length', unit: 'µm', tex: 'd' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, min: 380, max: 780, tex: '\\lambda' },
        N: { name: 'f-number', value: 1.8, min: 1, max: 32, tex: 'N' }
      },
      solveFor: 'd',
      note: 'The diameter of the first dark ring of a perfect lens. Pixels much smaller than this oversample the image.',
      stories: { d: 'A phone lens works at f/{N} in light of {lam}. How wide is the Airy disc?', N: 'The Airy disc of a lens in {lam} light is {d} across. What is the f-number?' }
    },
    {
      name: 'Equivalent focal length',
      expr: 'feq = f*43.27/diag', tex: 'f_{\\mathrm{eq}} = f \\cdot \\frac{43.27\\ \\mathrm{mm}}{\\mathrm{diag}}',
      vars: {
        feq: { name: 'equivalent focal length', q: 'length', unit: 'mm', tex: 'f_{\\mathrm{eq}}' },
        f: { name: 'real focal length', q: 'length', unit: 'mm', value: 6.8, tex: 'f' },
        diag: { name: 'sensor diagonal', q: 'length', unit: 'mm', value: 12.3, tex: '\\mathrm{diag}' }
      },
      solveFor: 'feq',
      note: '43.27 mm is the diagonal of a 36 × 24 mm frame. The view matches that of a full-frame lens of focal length feq.',
      stories: { feq: 'A phone main camera has a real focal length of {f} on a sensor with a {diag} diagonal. What is its equivalent focal length?', f: 'A camera on a sensor with a {diag} diagonal gives the view of a {feq} full-frame lens. What is its real focal length?' }
    },
    {
      name: 'Pixels on the sensor',
      expr: 'n = w*h/p^2', tex: 'n = \\frac{w\\,h}{p^2}',
      vars: {
        n: { name: 'number of pixels', tex: 'n' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 9.84, tex: 'w' },
        h: { name: 'sensor height', q: 'length', unit: 'mm', value: 7.38, tex: 'h' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 1.2, tex: 'p' }
      },
      solveFor: 'n',
      note: 'The sensor area divided by the area of one pixel. With binning, each group counts as one larger pixel.',
      stories: { n: 'A sensor {w} by {h} has pixels {p} apart. How many pixels does it have?', p: 'A sensor {w} by {h} carries {n} pixels. What is the pixel pitch?' }
    }
  ],
  examples: [
    {
      title: 'Is the pixel smaller than the blur?',
      q: 'A phone main camera works at f/1.8 in green light (550 nm) and has pixels of 1.2 µm. How does the Airy disc compare with the pixel?',
      steps: [
        { text: 'The diameter of the Airy disc:', tex: 'd = 2.44 \\times 0.55\\ \\mu\\mathrm{m} \\times 1.8 = 2.42\\ \\mu\\mathrm{m}' },
        'That is twice the pixel pitch. The lens cannot concentrate a point into one pixel, however well made; the pixel count is above what the optics resolve, and the extra pixels are useful mostly for binning.'
      ],
      a: '2.4 µm: two pixels wide.'
    },
    {
      title: 'The real focal length of a main camera',
      q: 'A phone gives the view of a 24 mm lens on a full-frame camera. Its sensor measures 9.84 × 7.38 mm. What is the focal length of the lens?',
      steps: [
        'The sensor diagonal is $\\sqrt{9.84^2 + 7.38^2} = 12.3$ mm, so the crop factor is $43.27/12.3 = 3.52$.',
        { text: 'The real focal length is the equivalent one divided by the crop factor:', tex: 'f = \\frac{24\\ \\mathrm{mm}}{3.52} = 6.8\\ \\mathrm{mm}' }
      ],
      a: '6.8 mm (the field is then 84° across the diagonal).'
    }
  ],
  quiz: [
    { q: 'A sensor has pixels of 0.6 µm behind an f/1.8 lens working in green light. Which statement is right?', choices: ['The Airy disc covers about four pixels across, so the pixels oversample the image', 'Each pixel resolves a separate point of the scene', 'The lens is the weak point only at f/8', 'Smaller pixels always collect more light'], a: 0, why: 'The Airy disc is 2.4 µm, four pixels of 0.6 µm. Detail finer than the disc is not delivered by the lens, and a small pixel collects less light, which is why such sensors bin their pixels.' },
    { q: 'A periscope telephoto exists because a long focal length cannot fit through the thickness of a phone.', a: true, why: 'A lens for a 120 mm equivalent view on a small sensor has a focal length of 14–20 mm, longer than the body is thick. A prism or mirror turns the light so that the lens lies along the body.' },
    { q: 'A sensor with a 7.0 mm diagonal sits behind a 4.4 mm lens. What is the equivalent focal length, in mm?', answer: 27.2, unit: 'mm', why: 'The crop factor is 43.27/7.0 = 6.18, so the equivalent is 4.4 × 6.18 = 27.2 mm.' },
    { q: 'Binning four pixels into one does what to the light collected by the combined pixel?', choices: ['It roughly quadruples it', 'It halves it', 'It leaves it unchanged', 'It removes the colour filter'], a: 0, why: 'Four pixels of the same colour collect four times the light; the picture then has a quarter of the pixels. That trade pays in dim light.' },
    { q: 'What does the infrared-cut filter in front of a phone sensor do?', choices: ['It removes near-infrared light that silicon sees but the eye does not', 'It makes the phone sensitive to heat', 'It sets the f-number', 'It stabilizes the image'], a: 0, why: 'Silicon responds up to about 1100 nm. Without the filter the colours would be wrong, with grass and fabrics looking pale.' }
  ],
  applications: [
    'Everyday photography and video, where computational merging of several frames turns a tiny sensor into pleasing pictures in dim light.',
    'Document scanning, bar-code and QR reading and face unlocking, which use the same module with special software.',
    'Augmented-reality apps that need an accurate field of view and distortion, taken from the lens calibration.',
    'Inspection and field science: phones with macro or microscope clip-ons and thermal-camera add-ons.'
  ],
  history: 'The first camera phones appeared around the year 2000 with a fraction of a megapixel. Moulded plastic aspheric lenses, backside-illuminated sensors (from about 2009) and multi-frame merging made small modules competitive; ultra-wide, telephoto and periscope cameras followed as the housings stayed thin.',
  sources: [
    'M. Kriss (ed.), *Handbook of Digital Imaging* (Wiley, 2015) — sensors, lenses and image processing of compact cameras.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — aspheric and compact lens forms.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems*, 2nd ed. (SPIE, 2011) — pixel size, diffraction and sampling.'
  ],
  sim: 'es-phone'
},

{
  id: 'the-interchangeable-lens-camera', parent: 'everyday-optical-systems', title: 'The interchangeable-lens camera', level: 1,
  short: 'A camera with a mount takes a lens that can be changed. A mirror and pentaprism let an SLR show the picture optically; a mirrorless camera shows the sensor on a small screen. The mount fixes the flange distance, which is why mirrorless bodies are short and SLR bodies deep.',
  keywords: ['interchangeable lens', 'DSLR', 'SLR', 'mirrorless', 'reflex mirror', 'pentaprism', 'electronic viewfinder', 'EVF', 'mount', 'flange distance', 'phase detection', 'IBIS', 'full frame', 'APS-C', 'focal-plane shutter'],
  prereq: ['how-to-read-an-optical-system', 'how-a-camera-works', 'lens-mounts-and-flange-distance'],
  related: ['the-phone-camera', 'camera-families', 'viewfinders-and-focusing-screens', 'photographic-lens-mounts', 'f-mount', 'shutter-types', 'autofocus-methods', 'image-stabilization', 'prism-types', 'lens-adapters-and-back-focus', 'crop-factor-and-equivalent-focal-length'],
  body: `
An interchangeable-lens camera separates the part that holds the sensor from the part that forms the image. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** the scene. **Object and field:** set by the lens and sensor together. **What limits the cone:** the iris inside the lens. **Where it ends up:** a sensor from 13 to 44 mm wide. **What is worst:** usually the lens, then focus accuracy, then shake.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Mount | locks the lens and fixes how far it sits from the sensor | [[lens-mounts-and-flange-distance]] |
| Lens and iris | the lens forms the image; the iris sets the cone and the light | [[the-f-number]], [[aperture-and-f-stops]] |
| Mirror (SLR only) | tilts 45° and sends the image up; flips away to expose | [[viewfinders-and-focusing-screens]] |
| Focusing screen and pentaprism | a ground surface shows the image; the prism turns it upright and the right way round | [[prism-types]] |
| Shutter | two curtains that open and close in front of the sensor | [[shutter-types]] |
| Sensor | turns the image into numbers; may also shift to cancel shake | [[image-stabilization]], [[image-sensors]] |
| Electronic viewfinder (mirrorless) | a small display behind a magnifier shows the sensor's picture | [[the-magnifier]] |

### Mirror or no mirror
An SLR holds a mirror between lens and sensor, so its mount must sit about 44 mm from the sensor (the EF mount: 44.0 mm). A mirrorless camera has no mirror to clear: its mounts sit 16–20 mm from the sensor (Z: 16.0, E: 18.0, RF: 20.0 mm). The short distance lets lenses sit close to the sensor, allows a wider throat and a bigger rear element, and lets adapters make up the difference for older lenses ([[lens-adapters-and-back-focus]]). The price is that the sensor is always on, and an electronic view must be made from it.

### Autofocus
In an SLR a small sensor below the mirror looks at the image through two half-apertures: the two images shift apart by an amount that tells how far and which way to turn the focus. A mirrorless camera does the same with special pixels on the main sensor, plus contrast detection ([[autofocus-methods]]).

### Reading the sheet
"Full frame, 24 MP, 5-axis stabilization, 3.69 M-dot viewfinder, 1/8000 s, flash sync 1/250 s" gives: a 36 × 24 mm sensor; 6 µm pixels; a sensor that shifts and tilts; a viewfinder display of 3.69 million dots; the shortest shutter time; and the fastest time at which both curtains are fully open. APS-C is 23.6 × 15.7 mm (crop factor 1.53).

> [!key] A mount joins lens and body; its flange distance decides how deep the body is. A mirror gives an optical view and needs room; a mirrorless camera makes the view from the sensor, and the body can be shallow.
`,
  ideas: [
    'The mount fixes the flange distance, the gap between the lens flange and the sensor, which every lens made for that mount assumes.',
    'An SLR needs about 44 mm of room for its mirror; mirrorless mounts are 16 to 20 mm.',
    'The pentaprism turns the upside-down image of the focusing screen upright and the right way round.',
    'Phase-detection autofocus compares the images from two halves of the aperture; it tells the direction and the distance of the error.',
    'Stabilization either moves lens elements or shifts the sensor, so it can serve every lens on the body.'
  ],
  pitfalls: [
    'A bigger camera always has a bigger sensor — A mirrorless full-frame body can be smaller than an SLR with a smaller sensor; the mount and the mirror set the depth, not the sensor.',
    'Any lens can be adapted to any body — A lens fits a body only if its flange distance is longer than the body\'s, so that an adapter can make up the difference (see [[lens-adapters-and-back-focus]]). The reverse needs extra glass.',
    'An optical viewfinder shows what the sensor will record — It shows what the lens sees at full aperture. The depth of field, exposure and white balance seen by the sensor are shown only in an electronic viewfinder.',
    'The mechanical shutter always freezes motion — It does not: at short times the slit between the curtains scans the sensor, so a fast-moving subject is skewed (see [[rolling-and-global-shutter]]).'
  ],
  terms: [
    { term: 'Interchangeable-lens camera', also: ['ILC', 'system camera'], def: 'A camera whose lens can be removed and replaced by another of the same mount, so that one body serves wide-angle, telephoto and macro work.' },
    { term: 'Single-lens reflex', also: ['SLR', 'DSLR'], def: 'A camera with a mirror that sends the light of the taking lens up to a focusing screen and a prism for viewing, and flips away for the exposure.' },
    { term: 'Mirrorless camera', also: ['MILC', 'compact system camera'], def: 'An interchangeable-lens camera with no reflex mirror: the sensor is always exposed and the view is an electronic one made from it.' },
    { term: 'Mirror box', also: ['reflex chamber'], def: 'The space between the lens mount and the sensor of an SLR in which the mirror swings; it fixes the long flange distance of SLR mounts.' },
    { term: 'Body-lens system', also: ['lens system', 'camera system'], def: 'A mount together with the lenses, flashes and accessories made for it. A system is chosen as much for its lenses as for its body.' }
  ],
  formulas: [
    {
      name: 'Crop factor',
      expr: 'cf = 43.27/diag', tex: '\\mathrm{cf} = \\frac{43.27\\ \\mathrm{mm}}{\\mathrm{diag}}',
      vars: {
        cf: { name: 'crop factor', tex: '\\mathrm{cf}' },
        diag: { name: 'sensor diagonal', q: 'length', unit: 'mm', value: 28.3, tex: '\\mathrm{diag}' }
      },
      solveFor: 'cf',
      note: 'A lens gives on this sensor the view of a lens cf times longer on a full-frame sensor.',
      stories: { cf: 'An APS-C sensor has a diagonal of {diag}. What is its crop factor?' }
    },
    {
      name: 'Diagonal field of view',
      expr: 'fov = 2*atan(diag/(2*f))', tex: '\\theta = 2\\arctan\\frac{\\mathrm{diag}}{2f}',
      vars: {
        fov: { name: 'diagonal angle of view', q: 'angle', unit: '°', tex: '\\theta' },
        diag: { name: 'sensor diagonal', q: 'length', unit: 'mm', value: 43.27, tex: '\\mathrm{diag}' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50, tex: 'f' }
      },
      solveFor: 'fov',
      note: 'For a lens focused at infinity.',
      stories: { fov: 'A full-frame camera (diagonal {diag}) wears a {f} lens. What is the diagonal angle of view?', f: 'A lens on a sensor of diagonal {diag} gives a diagonal view of {fov}. What is the focal length?' }
    },
    {
      name: 'Lens past the flange',
      expr: 'z = bfd - ffd', tex: 'z = \\mathrm{bfd} - \\mathrm{ffd}',
      vars: {
        z: { name: 'rear vertex behind the flange', q: 'length', unit: 'mm', signed: true, tex: 'z' },
        bfd: { name: 'back focal distance of the lens', q: 'length', unit: 'mm', value: 49, tex: '\\mathrm{bfd}' },
        ffd: { name: 'flange focal distance of the mount', q: 'length', unit: 'mm', value: 44, tex: '\\mathrm{ffd}' }
      },
      solveFor: 'z',
      note: 'Positive: the lens reaches into the body by that amount. Negative: the lens ends in front of the flange.',
      stories: { z: 'A lens has a back focal distance of {bfd} and is made for a mount with a flange distance of {ffd}. How far does its rear vertex lie in front of (negative) or behind the flange?' }
    }
  ],
  examples: [
    {
      title: 'A 50 mm lens on two sensors',
      q: 'What is the diagonal angle of view of a 50 mm lens on a full-frame sensor (diagonal 43.27 mm) and on an APS-C sensor (diagonal 28.3 mm)?',
      steps: [
        { text: 'Full frame:', tex: '\\theta = 2\\arctan\\frac{43.27}{2 \\times 50} = 2\\arctan 0.4327 = 46.8°' },
        { text: 'APS-C:', tex: '\\theta = 2\\arctan\\frac{28.3}{100} = 2\\arctan 0.283 = 31.6°' },
        'The smaller sensor crops the same image circle; its crop factor is $43.27/28.3 = 1.53$, so the 50 mm lens gives the view of a 76 mm lens on full frame.'
      ],
      a: '46.8° on full frame and 31.6° on APS-C.'
    }
  ],
  quiz: [
    { q: 'Why can a mirrorless mount sit 16–20 mm from the sensor while an SLR mount sits about 44 mm?', choices: ['There is no mirror to swing between lens and sensor', 'The sensors are smaller', 'Mirrorless lenses are all wide-angle', 'The shutter is electronic'], a: 0, why: 'The SLR needs room for the mirror to tilt and flip. Without it the lens can come close to the sensor. Sensor size is the same in both.' },
    { q: 'A lens made for a 44 mm flange distance can be fitted to a body with an 18 mm flange distance by a 26 mm adapter with no glass in it.', a: true, why: 'The adapter makes up the difference, so that the lens sits where it expects to be. The opposite direction (a mirrorless lens on an SLR) would put the lens too close for infinity focus.' },
    { q: 'What is the crop factor of a sensor with a diagonal of 21.6 mm (a Four Thirds format is nearly this size)?', answer: 2.0, why: 'The crop factor is 43.27/21.6 = 2.0.' },
    { q: 'In an optical viewfinder the pentaprism does what?', choices: ['Turns the upside-down image upright and the right way round', 'Adds magnification', 'Splits light to the sensor', 'Measures the exposure'], a: 0, why: 'The lens image is inverted and reversed; the prism\'s reflections correct both so that the eye sees the scene as it is.' },
    { q: 'Why does the flash sync speed exist at all?', choices: ['The two shutter curtains are fully open together only up to a certain shortest time', 'Flash is slower than the shutter', 'The sensor cannot take more than one exposure a second', 'The mirror blocks the flash'], a: 0, why: 'At shorter times the second curtain begins to close before the first has finished opening: a slit crosses the frame. A flash then lights only a stripe.' }
  ],
  applications: [
    'Portrait, sport and wildlife work, where telephoto lenses and fast autofocus matter.',
    'Video and cinema, where lenses are swapped and an adapter can fit lenses of any maker.',
    'Astrophotography and microscopy, where the body is fitted to a telescope or a microscope instead of a lens.',
    'Archive and product photography, where tilt-shift and macro lenses are chosen for the job.'
  ],
  history: 'The reflex camera gave a direct view through the taking lens in plate cameras of the 19th century and in 35 mm form from 1936; the pentaprism made the view upright and correct from 1949. Bayonet mounts became the norm in the 1950s and 1960s. The first mass-market mirrorless interchangeable-lens cameras of 2008 brought short flange distances back, and by the early 2020s most new systems were mirrorless.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics*, 3rd ed. (Focal Press, 2002) — cameras, viewfinders, mounts and shutters.',
    'R. Jacobson, S. Ray, G. G. Attridge and N. Axford, *The Manual of Photography*, 9th ed. (Focal Press, 2000) — the reflex camera and its prism.',
    'A. Adams, *The Camera* (Little, Brown) — the working camera, in the classic account.'
  ],
  sim: 'es-camera'
},

{
  id: 'the-data-projector', parent: 'everyday-optical-systems', title: 'The data projector', level: 2,
  short: 'A projector makes a very bright small picture on a panel and throws it through a lens onto a screen. A lamp, LED or laser-phosphor source feeds an integrator that makes the light even, a micromirror, LCD or LCoS panel makes the picture, and the lens sets how big it is at a given distance.',
  keywords: ['projector', 'data projector', 'micromirror projector', 'micromirror', 'DMD', 'LCD projector', 'LCoS', 'lumens', 'ANSI lumens', 'throw ratio', 'contrast ratio', 'integrator', 'lens shift', 'laser phosphor', 'screen gain'],
  prereq: ['how-to-read-an-optical-system', 'projector-illumination', 'lumens-candelas-lux-and-nits'],
  related: ['projectors', 'etendue', 'light-pipes-and-homogenizers', 'microlens-arrays', 'dichroic-filters-and-mirrors', 'white-leds', 'spatial-light-modulators', 'liquid-crystals-and-displays', 'laser-projection-and-displays', 'lambertian-surfaces', 'zoom-lens-principles'],
  body: `
A projector is a slide projector made electronic: a bright source, a panel that forms the picture, a lens that throws it. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** a lamp, LED or blue laser on a phosphor. **Object and field:** a panel about 10–17 mm wide, with 1080 or 2160 rows. **What limits the cone:** the aperture of the projection lens, about f/1.8–f/2.6. **Where it ends up:** a screen, seen by eyes. **What is worst:** light (the picture is dim in a lit room), then contrast.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Source | lamp, LED or laser-phosphor; tiny and very bright | [[xenon-arc-and-flash-lamps]], [[white-leds]] |
| Collector and integrator | gathers the light and turns it into an even rectangle the shape of the panel | [[light-pipes-and-homogenizers]], [[microlens-arrays]] |
| Colour | a spinning colour wheel, or dichroic mirrors that split red, green and blue | [[dichroic-filters-and-mirrors]] |
| Panel | micromirrors tilt to send light to the lens or to a dump; LCD and LCoS panels turn polarization | [[spatial-light-modulators]], [[liquid-crystals-and-displays]] |
| Projection lens | throws the panel onto the screen; zoom and focus set the size and sharpness | [[zoom-lens-principles]], [[retrofocus-wide-angle]] |
| Screen | a diffuse surface that sends part of the light to the audience | [[lambertian-surfaces]] |

### The numbers
The picture is a fixed number of lumens spread over its area. A projector of 3000 lumens makes a 100-inch 16:9 image (2.21 × 1.25 m, 2.76 m²) lit with 1088 lux, and a matt white screen then has a luminance near 346 cd/m², about a phone screen. The throw ratio is the distance divided by the picture width: at ratio 1.5 and 3 m, the picture is 2.0 m wide. For a panel 10.4 mm wide the lens focal length is about 15.6 mm.

### Contrast and room light
A projector's own blacks are never quite black: a native contrast of 1000:1 means the dark is a thousandth of the white. Room light falls on the screen too and adds to both: with 100 lux in the room the 1000:1 picture falls to about 12:1. Dim the room, not the lamp.

### Reading the sheet
"3000 ANSI lm, 1920 × 1080, throw ratio 1.3–1.6, contrast 1000:1" gives the light of a standard measurement, the pixel grid, the range of the zoom lens (the picture is 1.2 times wider at the long end) and the native contrast.

> [!key] A projector spreads a fixed amount of light over the picture. Distance and throw ratio set the size, lumens set the brightness, and room light sets the contrast. The source, integrator and lens must all accept the same étendue.
`,
  ideas: [
    'The projector throws a very bright small panel through a lens; the throw ratio is distance divided by picture width.',
    'The integrator makes the light even and rectangular, the shape of the panel, so that the picture has no hot spot.',
    'A micromirror chip tilts mirrors on and off; an LCD or LCoS panel turns polarization, with polarizers around it.',
    'Illuminance on the screen is lumens over area; doubling the width needs four times the lumens for the same brightness.',
    'Room light adds to the black as well as the white, so contrast falls fast with ambient light.'
  ],
  pitfalls: [
    'Lumens alone tell how good a projector is — Lumens set the brightness of a picture of a given size; contrast, colour balance and the room matter as much. Colour brightness can be well below white brightness.',
    'Zooming the lens makes the picture brighter at a fixed distance — Zooming only changes the size; the same light is spread over a larger or smaller area, so a smaller picture is brighter.',
    'A longer throw needs a stronger lamp — The picture size grows with the distance, and the light per unit area falls with the area. At a fixed picture size the throw distance does not change the brightness.',
    'Native contrast and "dynamic contrast" are the same figure — The native one is measured on the panel and lens; dynamic contrast uses an iris or lamp dimming between scenes and is far larger.'
  ],
  terms: [
    { term: 'Throw ratio', also: ['TR'], def: 'The projection distance divided by the width of the picture. A ratio of 1.5 gives a picture 2 m wide at 3 m.' },
    { term: 'ANSI lumens', also: ['lumens', 'white brightness'], def: 'A standard measure of the light output of a projector: the average illuminance over nine points of a white picture, times the picture area.' },
    { term: 'Micromirror chip', also: ['DMD', 'digital micromirror device'], def: 'A chip of microscopic mirrors, one per pixel, each of which tilts about 12° one way or the other to send light to the lens or to a dump.' },
    { term: 'Colour wheel', also: ['spoke light'], def: 'A spinning disc of red, green and blue segments in the beam of a single-chip projector; the chip shows the colour pictures in turn, too fast to see.' },
    { term: 'Lens shift', also: ['vertical shift', 'offset projection'], def: 'A sideways or vertical movement of the projection lens relative to the panel, which moves the picture on the screen without tilting it.' },
    { term: 'Native contrast', also: ['contrast ratio'], def: 'The ratio of the luminance of a full white picture to a full black one, with no iris or dimming and no room light.' }
  ],
  formulas: [
    {
      name: 'Throw ratio and picture width',
      expr: 'tr = d/W', tex: '\\mathrm{TR} = \\frac{d}{W}',
      vars: {
        tr: { name: 'throw ratio', value: 1.5, min: 0.2, max: 5, tex: '\\mathrm{TR}' },
        d: { name: 'projection distance', q: 'length', unit: 'm', value: 3, tex: 'd' },
        W: { name: 'picture width', q: 'length', unit: 'm', value: 2, tex: 'W' }
      },
      solveFor: 'W',
      note: 'Distance from the lens to the screen over the width of the picture.',
      stories: { W: 'A projector with a throw ratio of {tr} stands {d} from the screen. How wide is the picture?', d: 'A projector with a throw ratio of {tr} must make a picture {W} wide. How far from the screen does it stand?' }
    },
    {
      name: 'Illuminance on the screen',
      expr: 'E = F/(W*H)', tex: 'E = \\frac{\\Phi}{W\\,H}',
      vars: {
        E: { name: 'illuminance on the screen', q: 'illuminance', unit: 'lx', tex: 'E' },
        F: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', value: 3000, tex: '\\Phi' },
        W: { name: 'picture width', q: 'length', unit: 'm', value: 2.21, tex: 'W' },
        H: { name: 'picture height', q: 'length', unit: 'm', value: 1.25, tex: 'H' }
      },
      solveFor: 'E',
      note: 'The flux is spread over the whole picture. A matt screen of reflectance rho then has a luminance of E rho / pi.',
      stories: { E: 'A projector with {F} fills a picture {W} wide and {H} high. What is the illuminance on the screen?', F: 'A picture {W} by {H} must be lit with {E}. How many lumens does the projector need?' }
    },
    {
      name: 'Contrast with room light',
      expr: 'C = (E + Ea)/(E/C0 + Ea)', tex: 'C = \\frac{E + E_{\\mathrm{a}}}{E/C_0 + E_{\\mathrm{a}}}',
      vars: {
        C: { name: 'contrast with room light', tex: 'C' },
        E: { name: 'illuminance of the white picture', q: 'illuminance', unit: 'lx', value: 1088, tex: 'E' },
        Ea: { name: 'room light on the screen', q: 'illuminance', unit: 'lx', value: 100, tex: 'E_{\\mathrm{a}}' },
        C0: { name: 'native contrast', value: 1000, min: 1, tex: 'C_0' }
      },
      solveFor: 'C',
      note: 'Room light adds the same luminance to white and black alike, so it destroys contrast mostly through the black.',
      stories: { C: 'A projector makes {E} on a white picture with a native contrast of {C0}. The room adds {Ea} on the screen. What contrast does the audience see?' }
    }
  ],
  examples: [
    {
      title: 'How bright is a 100-inch picture?',
      q: 'A projector of 3000 lumens makes a 16:9 picture of 100 inches (2.21 m wide, 1.25 m high). How many lux fall on the screen, and what is the luminance of a matt white screen that reflects all of it?',
      steps: [
        'The area is $2.21 \\times 1.25 = 2.76\\ \\mathrm{m^2}$.',
        { text: 'The illuminance:', tex: 'E = \\frac{3000\\ \\mathrm{lm}}{2.76\\ \\mathrm{m^2}} = 1088\\ \\mathrm{lx}' },
        { text: 'A perfectly diffuse white screen has a luminance of E over pi:', tex: 'L = \\frac{1088}{\\pi} = 346\\ \\mathrm{cd/m^2}' }
      ],
      a: '1088 lx, and about 346 cd/m² — close to the brightness of a phone or monitor in a lit room.'
    },
    {
      title: 'The dim room',
      q: 'The picture above has a native contrast of 1000:1. What contrast does the audience see with 10 lux of room light on the screen, and with 100 lux?',
      steps: [
        { text: 'With the formula $C = (E + E_a)/(E/C_0 + E_a)$ and $E = 1088$ lx:', tex: 'C(10) = \\frac{1098}{1.09 + 10} = 99 \\qquad C(100) = \\frac{1188}{1.09 + 100} = 11.8' }
      ],
      a: 'About 99:1 with 10 lux and 12:1 with 100 lux: a small amount of room light removes most of the contrast.'
    }
  ],
  quiz: [
    { q: 'A projector is moved back until the picture is twice as wide. What happens to the illuminance on the screen?', choices: ['It falls to a quarter', 'It halves', 'It doubles', 'It stays the same'], a: 0, why: 'The same lumens now cover four times the area. That is why a big picture needs many lumens.' },
    { q: 'A projector has a throw ratio of 1.2. How wide is the picture at a distance of 3.6 m, in metres?', answer: 3, unit: 'm', why: 'The width is the distance divided by the throw ratio: 3.6/1.2 = 3.0 m.' },
    { q: 'A micromirror projector tilts each of its mirrors about 12° to turn a pixel on or off.', a: true, why: 'In the on state a mirror sends light into the lens, in the off state to a dump; shades of grey are made by switching many times per frame.' },
    { q: 'Why does a projector use an integrator rod or lens arrays?', choices: ['To make the light even and shaped like the panel', 'To cool the lamp', 'To focus the picture', 'To increase the contrast'], a: 0, why: 'A lamp\'s output is brightest at the centre; the integrator mixes it so that every point of the panel gets the same light.' },
    { q: 'A picture of 2.76 m² is lit by a projector that gives 5000 lm. What is the illuminance on the screen, in lux?', answer: 1812, unit: 'lx', why: 'E = 5000 lm / 2.76 m² = 1812 lx.' }
  ],
  applications: [
    'Meeting rooms and classrooms, where throw ratio and lumens are chosen for the room and its lighting.',
    'Cinemas, where large screens need thousands of lumens from xenon or laser sources and special screens.',
    'Home cinema, where black level and contrast in a dark room matter more than lumens.',
    'Simulators, planetaria and projection mapping onto buildings, where several projectors are blended.'
  ],
  history: 'Magic lanterns threw slides with a candle or limelight from the 17th century. Data projectors appeared in the late 1980s with transmissive LCD panels on overhead projectors; the micromirror chip, invented in the 1980s and made commercial in the 1990s, followed, and LED and laser sources took over from lamps in the 2010s.',
  sources: [
    'E. H. Stupp and M. S. Brennesholtz, *Projection Displays* (Wiley, 1999) — illumination, panels and lenses.',
    'W. J. Smith, *Modern Optical Engineering*, 4th ed. (McGraw-Hill, 2008) — projection systems and étendue.'
  ],
  sim: 'es-projector'
}
);

/* ================================================================ flat-panel displays, VR and AR headsets, the optical mouse and encoders, remote controls and light barriers */
Hyper.add(
{
  id: 'flat-panel-displays', parent: 'everyday-optical-systems', title: 'Flat-panel displays: LCD, OLED, microLED', level: 2,
  short: 'A liquid-crystal display is a backlight, two crossed polarizers, a layer of twisting crystal and a mosaic of red, green and blue filters; only 5–10 % of the backlight leaves. OLED and microLED panels make the light in each pixel instead. The pixel pitch, against the eye\'s one arcminute, decides how sharp the screen looks.',
  keywords: ['LCD', 'OLED', 'microLED', 'mini-LED', 'backlight', 'polarizer', 'liquid crystal', 'TN', 'IPS', 'VA', 'colour filter', 'quantum dot', 'pixel density', 'PPI', 'nits', 'gamut', 'DCI-P3', 'sRGB', 'contrast', 'subpixel'],
  prereq: ['how-to-read-an-optical-system', 'liquid-crystals-and-displays', 'polarizers-and-malus-law'],
  related: ['colour-spaces-and-gamuts', 'additive-and-subtractive-mixing', 'white-leds', 'light-emitting-diodes', 'the-fovea-and-visual-acuity', 'drivers-dimming-and-flicker', 'lumens-candelas-lux-and-nits', 'the-data-projector', 'virtual-and-augmented-reality-headsets', 'the-chromaticity-diagram'],
  body: `
A screen is an optical system with the eye as its detector. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** an LED backlight (LCD) or the pixels themselves (OLED, microLED). **Object and field:** the picture, a mosaic of pixels. **What limits the cone:** how widely each pixel spreads its light: the viewing angle. **Where it ends up:** the eye, which resolves about one arcminute. **What is worst:** for an LCD, how little light gets through and how dark the black is; for an OLED, reflected room light.

### Following the light through an LCD
| Part | What it does in plain words | Learn more |
|---|---|---|
| LED backlight | blue LEDs under a yellow phosphor, or blue plus quantum dots | [[white-leds]] |
| Light guide and sheets | spread the light evenly and aim it at the viewer | [[light-pipes-and-homogenizers]] |
| Rear polarizer | passes one plane of vibration; half the light is gone | [[polarizers-and-malus-law]] |
| Liquid crystal | a voltage twists or untwists the molecules and so turns the plane | [[liquid-crystals-and-displays]] |
| Colour filters | each pixel is three subpixels, red, green and blue, each passing about a third | [[additive-and-subtractive-mixing]] |
| Front polarizer | crossed with the first, it turns "the plane was turned" into "bright" | [[polarization-states]] |

An OLED has none of this: organic layers glow where a current flows, and a circular polarizer stops the panel from reflecting the room like a mirror, at the price of half its light. A microLED panel puts a microscopic inorganic LED in each subpixel: very bright, but costly to make.

### The numbers
| Screen | Pixels per inch | Pixel pitch | One arcminute at |
|---|---|---|---|
| Phone, 6.1 in, 2532 × 1170 | 457 | 56 µm | 0.19 m |
| Monitor, 27 in, 3840 × 2160 | 163 | 156 µm | 0.54 m |
| Television, 65 in, 3840 × 2160 | 68 | 375 µm | 1.29 m |

An LCD passes only 5–10 % of its backlight: roughly 0.45 (polarizer) × 0.6 (the wiring takes the rest of the pixel) × 0.28 (the colour filter) × 0.9 (second polarizer) = 7 %. Wider gamuts need purer primaries: in the xy diagram the P3 triangle is 1.36 times, and the BT.2020 triangle 1.89 times, the area of sRGB.

### Black and viewing angle
Crossed polarizers leak slightly: an IPS panel reaches about 1000:1, a vertically aligned (VA) one a few thousand to one, and "mini-LED" backlights dim zones to do better. A pixel that is off in an OLED emits nothing, but room light still reflects. Looking from the side, a TN panel loses contrast quickly, IPS and OLED much less.

### Reading the sheet
"27-inch, 4K, IPS, 400 nits, 99 % sRGB, 95 % P3, 144 Hz" gives size, pixel grid, crystal arrangement, white luminance, how much of each gamut is covered, and refresh rate.

> [!key] An LCD is a light valve between two crossed polarizers, lit from behind, and wastes about nine tenths of the light; an OLED or microLED makes light only where it is needed. Sharpness is pixel pitch against the eye's one arcminute.
`,
  ideas: [
    'An LCD controls light by turning its plane of polarization between two crossed polarizers; it makes none of its own.',
    'Each pixel is three coloured subpixels; the eye mixes them, as long as the screen is far enough away.',
    'Only 5–10 % of an LCD backlight leaves the panel; OLED and microLED avoid that loss but have limits of their own.',
    'A screen looks sharp when one pixel subtends less than about one arcminute: the viewing distance is pitch divided by tan(1′).',
    'Gamut is set by the purity of the red, green and blue primaries, for which quantum dots and OLED emitters help.'
  ],
  pitfalls: [
    'An LCD makes the colours with its liquid crystal — The crystal only turns the plane of polarization and so sets the brightness of each subpixel. The colours come from the filters over it.',
    'OLED screens are always better than LCDs — OLED has perfect black and a wide view but is limited in brightness and can show a mirror-like glare in daylight; a good LCD with local dimming beats it in a bright room.',
    'More pixels per inch always looks sharper — Beyond about 60 pixels per degree the eye cannot tell: at 30 cm that is about 290 pixels per inch, and a phone held there gains little from more.',
    'The "nits" of a screen are the same as its lumens — Nits are cd/m², the luminance (how bright the surface looks); lumens are the total light flux and describe a lamp or a projector.'
  ],
  terms: [
    { term: 'Backlight', also: ['edge-lit', 'direct-lit', 'local dimming'], def: 'The sheet of white or blue LEDs and light guide behind an LCD. Local dimming switches zones of it off behind dark parts of the picture.' },
    { term: 'Subpixel', also: ['RGB stripe'], def: 'One of the three coloured parts, red, green and blue, of a pixel. The eye blends them into one colour at normal viewing distance.' },
    { term: 'Pixel density', also: ['PPI', 'pixels per inch'], def: 'The number of pixels along one inch of the screen, the diagonal pixel count divided by the diagonal in inches.' },
    { term: 'OLED', also: ['organic light-emitting diode'], def: 'A display in which thin organic layers glow where a current flows, so that each subpixel makes its own light and a pixel that is off is black.' },
    { term: 'microLED', also: ['micro-LED'], def: 'A display in which each subpixel is a microscopic inorganic LED chip: very bright and long-lived, but costly to make and place in millions.' },
    { term: 'Circular polarizer', also: ['anti-reflection polarizer'], def: 'A polarizer and a quarter-wave plate in front of an emissive screen that absorb room light reflected by the panel, at the price of half of the emitted light.' }
  ],
  formulas: [
    {
      name: 'Pixel density',
      expr: 'ppi = hypot(wp, hp)/diag', tex: '\\mathrm{ppi} = \\frac{\\sqrt{w_{\\mathrm{p}}^2 + h_{\\mathrm{p}}^2}}{\\mathrm{diag}}',
      vars: {
        ppi: { name: 'pixels per inch', tex: '\\mathrm{ppi}' },
        wp: { name: 'pixels across', value: 3840, min: 1, int: true, tex: 'w_{\\mathrm{p}}' },
        hp: { name: 'pixels down', value: 2160, min: 1, int: true, tex: 'h_{\\mathrm{p}}' },
        diag: { name: 'diagonal of the screen', q: 'length', unit: 'in', value: 27, tex: '\\mathrm{diag}' }
      },
      solveFor: 'ppi',
      note: 'The diagonal pixel count over the diagonal in inches; square pixels assumed.',
      stories: { ppi: 'A monitor with {wp} by {hp} pixels has a diagonal of {diag}. How many pixels per inch?', diag: 'A screen of {wp} by {hp} pixels has {ppi} pixels per inch. What is its diagonal?' }
    },
    {
      name: 'Distance at which a pixel subtends an angle',
      expr: 'd = p/tan(a)', tex: 'd = \\frac{p}{\\tan a}',
      vars: {
        d: { name: 'viewing distance', q: 'length', unit: 'm', tex: 'd' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 156, tex: 'p' },
        a: { name: 'angle subtended by one pixel', q: 'angle', unit: '′', value: 1, min: 0.01, max: 60, tex: 'a' }
      },
      solveFor: 'd',
      note: 'With one arcminute, the usual acuity limit, this is the distance beyond which a pixel cannot be seen as a separate square.',
      stories: { d: 'Pixels {p} apart are to subtend {a}. How far away must the viewer be?', p: 'From {d} the pixels of a screen subtend {a}. What is the pitch?' }
    },
    {
      name: 'Transmission of an ideal twisted cell',
      expr: 'T = sin(th)^2', tex: 'T = \\sin^2\\theta',
      vars: {
        T: { name: 'transmission between crossed polarizers', q: 'ratio', unit: '', tex: 'T' },
        th: { name: 'angle by which the cell turns the plane', q: 'angle', unit: '°', value: 90, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'T',
      note: 'Crossed polarizers, light polarized along the first axis. A turn of 90° passes it all (a bright pixel); a voltage that removes the twist turns it by 0° and the pixel is dark.',
      stories: { T: 'A liquid-crystal cell between crossed polarizers turns the plane of polarization by {th}. What fraction of the light passes?' }
    }
  ],
  examples: [
    {
      title: 'When do the pixels disappear?',
      q: 'A 27-inch monitor has 3840 × 2160 pixels. From what distance does one pixel subtend one arcminute?',
      steps: [
        { text: 'The pixel density is', tex: '\\mathrm{ppi} = \\frac{\\sqrt{3840^2 + 2160^2}}{27} = \\frac{4406}{27} = 163' },
        'The pitch is $25.4\\ \\mathrm{mm}/163 = 0.156$ mm.',
        { text: 'One arcminute is 0.000291 rad, so', tex: 'd = \\frac{0.156\\ \\mathrm{mm}}{0.000291} = 535\\ \\mathrm{mm}' }
      ],
      a: '163 pixels per inch; from about 0.54 m the pixels merge. Closer than that, a sharp eye can see them.'
    },
    {
      title: 'The light that gets out',
      q: 'The polarizer, wiring, colour filter and second polarizer of an LCD pass about 0.45, 0.6, 0.28 and 0.9 of the light that reaches them. How much of the backlight leaves the panel?',
      steps: [
        { text: 'Multiply the fractions:', tex: '0.45 \\times 0.6 \\times 0.28 \\times 0.9 = 0.068' }
      ],
      a: 'About 7 %. The round values are typical and differ from panel to panel; the point is that the backlight must be roughly fifteen times brighter than the picture.'
    }
  ],
  quiz: [
    { q: 'In a liquid-crystal display the colours of the picture come from…', choices: ['the colour filters over the subpixels', 'the liquid crystal itself', 'the rear polarizer', 'the light guide'], a: 0, why: 'The crystal controls only how much light each subpixel passes; red, green and blue filters then colour it.' },
    { q: 'An OLED pixel that is switched off emits no light, so its black is limited only by the room light it reflects.', a: true, why: 'There is no backlight to leak through. The circular polarizer and the room light set the practical black level.' },
    { q: 'A 6.1-inch phone has 2532 × 1170 pixels. How many pixels per inch, to the nearest ten?', answer: 460, why: 'The diagonal is √(2532² + 1170²) = 2789 pixels; divided by 6.1 inches that is 457 per inch.' },
    { q: 'An ideal twisted cell between crossed polarizers turns the plane of polarization by 45°. What fraction of the light passes?', choices: ['one half', 'all of it', 'a quarter', 'none'], a: 0, why: 'The transmission is sin²θ = sin² 45° = 0.5.' },
    { q: 'Why does an LCD need a backlight about fifteen times brighter than the picture?', choices: ['Polarizers, wiring and colour filters absorb nine tenths of the light', 'The liquid crystal emits light', 'The eye is insensitive to blue', 'The screen reflects the light back'], a: 0, why: 'About half goes at the first polarizer and most of the rest at the filters and the wiring; 5–10 % leaves.' }
  ],
  applications: [
    'Phones, tablets and watches, where pixel density and OLED black matter.',
    'Televisions, where local dimming and peak nits make the high-dynamic-range picture.',
    'Monitors for design and grading, where gamut coverage and uniformity are measured.',
    'Aircraft and car displays, readable in sunlight and from the side, which use brighter backlights and special coatings.'
  ],
  history: 'Liquid crystals were found in 1888 by Friedrich Reinitzer and the twisted-nematic cell was announced in 1971; the first watch and calculator displays followed in the 1970s. Colour LCDs with transistors behind each pixel reached laptops in the 1990s and televisions in the 2000s. OLED phone panels became common in the 2010s, and microLED displays remain mostly in large and specialist screens.',
  sources: [
    'P. Yeh and C. Gu, *Optics of Liquid Crystal Displays*, 2nd ed. (Wiley, 2010) — the cell between polarizers.',
    'E. Lueder, *Liquid Crystal Displays: Addressing Schemes and Electro-Optical Effects*, 2nd ed. (Wiley, 2010) — drive schemes and the cell.',
    'E. Hecht, *Optics*, 5th ed. (Pearson, 2017), ch. 8 — polarizers and Malus\'s law.'
  ],
  sim: 'es-display'
},

{
  id: 'virtual-and-augmented-reality-headsets', parent: 'everyday-optical-systems', title: 'Virtual- and augmented-reality headsets', level: 3,
  short: 'A virtual-reality headset is a magnifier in front of each eye that makes a small display look like a large, distant picture. Folded "pancake" lenses use polarization to make it thin; see-through AR glasses carry the picture in a glass plate with gratings. All of them fix the focus distance of the picture, which conflicts with where the eyes converge.',
  keywords: ['VR', 'AR', 'headset', 'virtual reality', 'augmented reality', 'pancake lens', 'Fresnel lens', 'waveguide', 'eye box', 'eye relief', 'field of view', 'vergence-accommodation conflict', 'pixels per degree', 'screen-door effect', 'birdbath', 'passthrough'],
  prereq: ['how-to-read-an-optical-system', 'the-magnifier', 'exit-pupil-and-eye-relief', 'binocular-vision-and-stereopsis'],
  related: ['accommodation', 'eyepieces', 'wave-plates', 'critical-angle-and-total-internal-reflection', 'diffractive-optical-elements', 'holographic-optical-elements', 'flat-panel-displays', 'stereoscopic-3d-displays', 'spatial-light-modulators', 'projections:augmented-and-virtual-reality', 'lateral-chromatic-aberration'],
  body: `
A headset puts a screen an inch from each eye and uses a lens to make it look far away. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** a display, from an LCD or OLED panel to a microdisplay. **Object and field:** the display, 20–60 mm across per eye, filling 90–110° of view. **What limits the cone:** the eye's own pupil, which may be anywhere inside the **eye box**, the region where the picture can be seen. **Where it ends up:** the retina, sampled at 15–25 pixels per degree, against 60 for a sharp eye. **What is worst:** pixel density, weight and the focus conflict.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Display | a small panel of 2000 or more pixels across | [[flat-panel-displays]] |
| Lens | acts as a magnifier: the display sits just inside its focal length | [[the-magnifier]], [[eyepieces]] |
| Folded optics (pancake) | a half mirror, a quarter-wave plate and a reflective polarizer send the light across the gap three times | [[wave-plates]] |
| Eye box | the exit pupil: where the eye must be to see the whole picture | [[exit-pupil-and-eye-relief]] |
| Eye | focuses on the virtual picture at 1–2 m | [[accommodation]] |
| Waveguide (AR) | a glass plate traps the light by total reflection between two gratings | [[critical-angle-and-total-internal-reflection]], [[diffractive-optical-elements]] |

### The numbers
A display 60 mm wide placed 39 mm from a lens of 40 mm focal length is magnified 40 times and appears 1.56 m away, filling 75° of the view ($2\\arctan(w/2d)$). If 2000 pixels cover that, there are 27 pixels per degree, two to three arcminutes per pixel: the screen-door look. Moving the eye farther from the lens (a longer eye relief) shrinks the field slightly.

### The focus conflict
The picture is at a fixed distance, say 1.3 m (0.77 D). A virtual object drawn 0.5 m away makes the eyes converge for 2 D but they must still focus at 0.77 D: a mismatch of 1.23 D. This vergence-accommodation conflict tires many people and is why close work in a headset is uncomfortable; varifocal and light-field designs are attempts to solve it.

### Pancake and waveguide
In a pancake the light is polarized, turned circular by a quarter-wave plate, partly reflected, turned linear in the other plane, and so trapped between two surfaces until it can leave: the module is about a third as thick as a single lens, but at best a quarter of the light arrives. A waveguide must keep rays between the critical angle (41.8° for n = 1.5, 30° for n = 2) and grazing, so a higher index carries a wider field; only a few per cent of the display's light reaches the eye.

> [!key] A headset is a magnifier per eye with a fixed focus. Folded polarization optics make it thin but lose three quarters of the light; waveguides make it see-through but lose most of it. The eyes converge on virtual objects but focus on the screen's distance.
`,
  ideas: [
    'A lens just inside its focal length turns a small display into a large virtual image far away; the image distance is f d / (f − d).',
    'The field of view is set by the display width and its distance from the lens; the eye box and eye relief set where it can be seen.',
    'Pixels per degree, not pixel count, decide the sharpness: 20 or so, against 60 for a sharp eye.',
    'Pancake optics fold the light with a half mirror, a quarter-wave plate and a reflective polarizer, and cost at least three quarters of it.',
    'The focus distance is fixed, but the eyes converge on virtual objects at any distance: the vergence-accommodation conflict.'
  ],
  pitfalls: [
    'The screen of a headset is as near to the eye as it looks — The display is a few centimetres from the lens, but the lens makes a virtual image 1–2 m away so that the eye can relax.',
    'A wider field of view needs a bigger display only — It needs a larger lens, or the eye closer to it, and then the edges of the lens add distortion and colour fringes that software must correct.',
    'Stereo makes the headset a 3-D display like a hologram — The two eyes see two flat images; the focus distance never changes, so the cue of focus is missing and the conflict follows.',
    'AR glasses show the picture by a screen in the lens — A waveguide carries the picture inside the glass by total reflection and gratings turn it out to the eye; no screen is in front of the eye.'
  ],
  terms: [
    { term: 'Eye box', also: ['eyebox', 'motion box'], def: 'The region in front of the optics in which the eye can sit and still see the whole picture. A larger box tolerates different faces and slippage.' },
    { term: 'Pancake lens', also: ['folded optics'], def: 'A thin lens module in which polarization makes the light pass three times through the same gap between a half mirror and a reflective polarizer.' },
    { term: 'Waveguide', also: ['combiner', 'exit-pupil expander'], def: 'A glass plate that carries the picture by total internal reflection from an input grating to an output grating, which expands the eye box and sends the light to the eye.' },
    { term: 'Vergence-accommodation conflict', also: ['VAC'], def: 'The mismatch between the distance at which the eyes converge on a virtual object and the fixed distance at which they must focus on the display.' },
    { term: 'Pixels per degree', also: ['PPD', 'angular resolution'], def: 'The number of display pixels in one degree of the field of view; about 60 matches the acuity of the eye at the centre.' },
    { term: 'Screen-door effect', also: ['visible pixel grid'], def: 'The dark grid between pixels that shows when each pixel covers several arcminutes of the field, as in a headset magnifier.' }
  ],
  formulas: [
    {
      name: 'Distance of the virtual picture',
      expr: 'si = f*d/(f - d)', tex: 's_{\\mathrm{i}} = \\frac{f\\,d}{f - d}',
      vars: {
        si: { name: 'distance of the virtual picture from the lens', q: 'length', unit: 'm', tex: 's_{\\mathrm{i}}' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 40, tex: 'f' },
        d: { name: 'distance of the display from the lens', q: 'length', unit: 'mm', value: 39, tex: 'd' }
      },
      solveFor: 'si',
      note: 'The display must be inside the focal length (d < f). The picture appears on the display\'s side of the lens, at this distance.',
      stories: { si: 'A display lies {d} from a magnifier lens of focal length {f}. How far away does the picture appear?', d: 'A lens of focal length {f} must show a picture at {si}. How far from the lens is the display?' }
    },
    {
      name: 'Field of view of the display',
      expr: 'fov = 2*atan(w/(2*d))', tex: '\\mathrm{FOV} = 2\\arctan\\frac{w}{2d}',
      vars: {
        fov: { name: 'field of view', q: 'angle', unit: '°', tex: '\\mathrm{FOV}' },
        w: { name: 'width of the display', q: 'length', unit: 'mm', value: 60, tex: 'w' },
        d: { name: 'distance of the display from the lens', q: 'length', unit: 'mm', value: 39, tex: 'd' }
      },
      solveFor: 'fov',
      note: 'For the eye at the lens; with an eye relief the field is a little smaller. The lens must also be wide enough.',
      stories: { fov: 'A display {w} wide sits {d} from the lens. What field of view does the eye see, with the eye at the lens?' }
    },
    {
      name: 'Vergence-accommodation mismatch',
      expr: 'dD = 1/sf - 1/sv', tex: '\\Delta = \\frac{1}{s_{\\mathrm{f}}} - \\frac{1}{s_{\\mathrm{v}}}',
      vars: {
        dD: { name: 'mismatch', q: 'optpower', unit: 'D', signed: true, tex: '\\Delta' },
        sf: { name: 'distance of the focal plane', q: 'length', unit: 'm', value: 1.3, tex: 's_{\\mathrm{f}}' },
        sv: { name: 'distance the eyes converge on', q: 'length', unit: 'm', value: 0.5, tex: 's_{\\mathrm{v}}' }
      },
      solveFor: 'dD',
      note: 'Dioptres are reciprocal metres. A negative value means the object is nearer than the focal plane.',
      stories: { dD: 'A headset shows its picture at {sf}. A virtual object is drawn {sv} away. What is the mismatch in dioptres?' }
    }
  ],
  examples: [
    {
      title: 'Where does the screen seem to be?',
      q: 'A lens of focal length 40 mm has the display 39 mm behind it. Where does the picture appear, and how large is it relative to the display?',
      steps: [
        { text: 'From $1/s_o + 1/s_i = 1/f$ with the image on the same side as the object:', tex: 's_{\\mathrm{i}} = \\frac{f\\,d}{f - d} = \\frac{40 \\times 39}{1} = 1560\\ \\mathrm{mm}' },
        'The magnification is $f/(f - d) = 40$.'
      ],
      a: '1.56 m away and 40 times larger: a display 60 mm across looks 2.4 m across.'
    },
    {
      title: 'The conflict in dioptres',
      q: 'A headset focuses at 1.3 m. A virtual object is drawn at 0.5 m. By how many dioptres do the eyes\' convergence and focus disagree?',
      steps: [
        { text: 'Convergence demands $1/0.5 = 2.00$ D; the focus is at $1/1.3 = 0.77$ D.', tex: '\\Delta = 2.00 - 0.77 = 1.23\\ \\mathrm{D}' }
      ],
      a: '1.23 D, an amount that tires many people if sustained.'
    }
  ],
  quiz: [
    { q: 'In a simple VR lens the display is placed…', choices: ['just inside the focal length, so that the picture appears far away', 'at twice the focal length', 'exactly at the eye', 'behind the lens at infinity'], a: 0, why: 'A display inside the focal length gives a magnified virtual image; the nearer d is to f, the farther away the picture appears.' },
    { q: 'A pancake lens can pass at most about a quarter of the light of the display.', a: true, why: 'The half mirror transmits half on the first pass and reflects half on the second: 0.5 × 0.5 = 0.25 at best.' },
    { q: 'A display 50 mm wide sits 40 mm from a lens. What is the field of view (eye at the lens), in degrees?', answer: 64, unit: '°', why: 'FOV = 2 arctan(50/80) = 2 × 32.0° = 64.0°.' },
    { q: 'A headset shows its picture at 2 m (0.5 D). A virtual object is at 0.4 m (2.5 D). What is the size of the mismatch, in dioptres?', answer: 2, unit: 'D', why: 'The eyes converge for 2.5 D but must focus for 0.5 D: a mismatch of 2.0 D.' },
    { q: 'Why does a waveguide with a higher refractive index carry a wider field of view?', choices: ['The critical angle is smaller, so more ray angles are trapped', 'It absorbs less light', 'It is thicker', 'It has more gratings'], a: 0, why: 'Rays must travel steeper than the critical angle to be trapped. At n = 2 that is 30°, at n = 1.5 it is 41.8°: a wider range of angles, hence of field directions, fits.' }
  ],
  applications: [
    'Games, simulators and training, where the head tracks and the view is rendered for each eye.',
    'Design review and architecture, where a model can be walked around at full size.',
    'Head-up and head-worn displays in aircraft and industry, which use waveguides or beam splitters to overlay data on the real view.',
    'Vision research and rehabilitation, where the stimulus to each eye is controlled.'
  ],
  history: 'Charles Wheatstone built a stereoscope in 1838 to show each eye its own drawing. Head-mounted displays were demonstrated by Ivan Sutherland in the late 1960s. Consumer headsets with Fresnel-lens magnifiers arrived in the 2010s; folded pancake optics, from the 2020s, made them slimmer.',
  sources: [
    'J. P. Rolland and H. Hua, "Head-mounted display systems", in *Encyclopedia of Optical Engineering* (Dekker, 2005) — optics of head-mounted displays.',
    'B. C. Kress, *Optical Architectures for Augmented-, Virtual-, and Mixed-Reality Headsets* (SPIE Press, 2020) — waveguides, pancake optics and eye boxes.',
    'D. M. Hoffman, A. R. Girshick, K. Akeley and M. S. Banks, "Vergence-accommodation conflicts hinder visual performance and cause visual fatigue", *Journal of Vision* 8(3), 33 (2008).'
  ],
  sim: 'es-headset'
},

{
  id: 'the-optical-mouse-and-optical-encoders', parent: 'everyday-optical-systems', title: 'The optical mouse and optical encoders', level: 2,
  short: 'An optical mouse photographs the desk thousands of times a second and finds how far the picture moved between frames. An optical encoder counts the lines of a striped disc as they pass a light, and the lag between two detectors tells the direction. Both turn motion into counts.',
  keywords: ['optical mouse', 'laser mouse', 'CPI', 'DPI', 'correlation', 'speckle', 'encoder', 'incremental encoder', 'quadrature', 'PPR', 'index pulse', 'code disc', 'absolute encoder', 'linear scale', 'photodiode', 'tracking'],
  prereq: ['how-to-read-an-optical-system', 'cmos-sensors', 'nyquist-sampling-and-aliasing'],
  related: ['light-emitting-diodes', 'vcsels-and-laser-arrays', 'speckle', 'how-a-pixel-detects-light', 'the-grating-equation', 'moire-patterns', 'interferometers-in-precision-engineering', 'motors:incremental-encoders', 'motors:absolute-encoders', 'electronics:photodiodes'],
  body: `
Two systems turn motion into counts by looking at it. Read them with the five questions of [[how-to-read-an-optical-system]]. **Light:** an LED or a small infrared laser (a VCSEL). **Object and field:** a patch of desk 1–2 mm across, or a ring of lines on a disc. **What limits the cone:** a tiny lens and window. **Where it ends up:** a small array of 18 × 18 to 30 × 30 pixels, or two photodiodes. **What is worst:** a surface with no texture to follow.

### The mouse, in the order of the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| LED or VCSEL | lights the desk from a low angle, so that every grain casts a shadow | [[light-emitting-diodes]], [[vcsels-and-laser-arrays]] |
| Surface | the paper, wood or plastic whose roughness is the pattern | [[specular-and-diffuse-reflection]] |
| Lens | images a patch of surface 1:1 on the sensor | [[the-thin-lens-equation]] |
| Sensor | a small array of pixels takes 1000–10 000 pictures a second | [[cmos-sensors]] |
| Correlator | slides one picture over the next to find the shift that matches best | [[nyquist-sampling-and-aliasing]] |

The shift in pixels, converted by the lens magnification, is the move of the mouse. The resolution is quoted in counts per inch: 1600 counts per inch is 15.9 µm per count. A grazing LED shows grain on paper and wood, while a laser shows speckle ([[speckle]]), which also works on some glossy surfaces. On clear glass or a mirror there is no texture to follow and the pointer stalls.

### The encoder, in the order of the light
| Part | What it does | Learn more |
|---|---|---|
| LED and lens | a steady, collimated light | [[light-emitting-diodes]] |
| Code disc | a ring of radial lines, opaque and clear in turn | [[moire-patterns]] |
| Mask (reticle) | a fixed window with the same pitch, in two parts a quarter of a period apart | [[the-grating-equation]] |
| Photodiodes | A and B turn bright and dark with the passing lines | [[electronics:photodiodes]] |

Each line gives one cycle of A. B is a quarter of a cycle later when the disc turns one way and earlier when it turns the other: the order of the edges tells the direction. Counting all four edges per line gives 4 counts per line: a disc of 1000 lines gives 4000 counts per turn, 0.09° each, and at 3000 rpm the A signal is 50 kHz. A third signal, the index, marks one position per turn. Absolute encoders use several tracks so that every position has its own code ([[motors:absolute-encoders]]); the finest linear scales use lines 8–20 µm apart and interpolate the signals.

> [!key] A mouse finds how far the picture of the desk has shifted; an encoder counts lines and uses the phase of two detectors to tell direction. Both resolve a fraction of the feature size, and both fail when the pattern is missing or too fine for the detector.
`,
  ideas: [
    'A mouse sensor compares successive pictures of the desk; the shift that best matches them is the movement.',
    'The light strikes the surface at a low angle so that the roughness casts shadows and gives contrast.',
    'Counts per inch is the move per count: 1600 counts per inch is about 16 µm.',
    'An encoder\'s A and B signals are a quarter of a period apart, so the order of the edges gives the direction.',
    'Counting all four edges multiplies the resolution by four: lines per turn times four is counts per turn.'
  ],
  pitfalls: [
    'A mouse measures speed — It measures displacement between pictures; the speed follows from the rate of the pictures, and at a speed above one pixel-shift limit per frame it loses track.',
    'A higher CPI means a more accurate mouse — It means a smaller move per count and more counts for the same movement. The accuracy is set by the sensor and the surface, not by the number alone.',
    'An encoder with 1000 lines gives 1000 positions per turn — Counting both edges of both channels (quadrature, ×4) gives 4000; some systems further interpolate the signals.',
    'Absolute and incremental encoders differ only in price — An incremental one counts from where it was switched on and needs a reference; an absolute one reports the position at once, even after a power loss.'
  ],
  terms: [
    { term: 'Counts per inch', also: ['CPI', 'DPI (mouse)', 'resolution'], def: 'The number of counts a mouse reports for one inch of movement. 1600 CPI is 15.9 µm per count.' },
    { term: 'Image correlation', also: ['optical flow (mouse)', 'frame matching'], def: 'Comparing two pictures at several shifts and picking the shift at which they agree best; the mouse sensor does this thousands of times a second.' },
    { term: 'Quadrature', also: ['A/B signals', '×4 decoding'], def: 'Two square waves a quarter of a period apart. Which one leads gives the direction, and counting all four edges gives four counts per line.' },
    { term: 'Pulses per revolution', also: ['PPR', 'lines per revolution'], def: 'The number of cycles of the A channel for one turn of an incremental encoder, equal to the number of lines on its disc.' },
    { term: 'Index pulse', also: ['Z pulse', 'reference mark'], def: 'A signal that occurs once per turn (or at one position on a scale) and gives a fixed reference for counting.' },
    { term: 'Absolute encoder', also: ['multi-turn encoder'], def: 'An encoder whose disc carries a different code at every position, so that it reports the angle at once, even after a power loss.' }
  ],
  formulas: [
    {
      name: 'Move per count of a mouse',
      expr: 'c = 0.0254/cpi', tex: 'c = \\frac{1\\ \\mathrm{inch}}{\\mathrm{cpi}}',
      vars: {
        c: { name: 'distance per count', q: 'length', unit: 'µm', tex: 'c' },
        cpi: { name: 'counts per inch', value: 1600, min: 100, tex: '\\mathrm{cpi}' }
      },
      solveFor: 'c',
      note: 'One inch is 25 400 µm. Sensors often interpolate between pixels, so a count can be smaller than a pixel.',
      stories: { c: 'A mouse is set to {cpi} counts per inch. How far must it move for one count?' }
    },
    {
      name: 'Resolution of a quadrature encoder',
      expr: 'res = 360/(4*ppr)', tex: '\\mathrm{res} = \\frac{360°}{4\\,\\mathrm{PPR}}',
      vars: {
        res: { name: 'angle per count', q: 'angle', unit: '°', tex: '\\mathrm{res}' },
        ppr: { name: 'lines (pulses) per revolution', value: 1000, min: 1, int: true, tex: '\\mathrm{PPR}' }
      },
      solveFor: 'res',
      note: 'Counting every edge of both channels gives four counts per line.',
      stories: { res: 'An incremental encoder has {ppr} lines per turn and is decoded in quadrature. What is the angle of one count?' }
    },
    {
      name: 'Frequency of the A signal',
      expr: 'f = ppr*n', tex: 'f = \\mathrm{PPR}\\cdot n',
      vars: {
        f: { name: 'frequency of channel A', q: 'frequency', unit: 'kHz', tex: 'f' },
        ppr: { name: 'lines per revolution', value: 1000, min: 1, int: true, tex: '\\mathrm{PPR}' },
        n: { name: 'rotation speed', q: 'frequency', unit: 'rpm', value: 3000, tex: 'n' }
      },
      solveFor: 'f',
      note: 'The rotation speed in turns per second times the lines per turn. The counting electronics must keep up with four times this edge rate.',
      stories: { f: 'An encoder with {ppr} lines per turn rotates at {n}. What is the frequency of channel A?', n: 'An encoder with {ppr} lines per turn gives channel A at {f}. At what speed does it turn?' }
    }
  ],
  examples: [
    {
      title: 'How small is a count?',
      q: 'A mouse works at 1600 counts per inch. How far must it move for one count, and how many counts does a 10 cm sweep give?',
      steps: [
        { text: 'One inch is 25.4 mm:', tex: 'c = \\frac{25.4\\ \\mathrm{mm}}{1600} = 15.9\\ \\mu\\mathrm{m}' },
        'A sweep of 10 cm is $100/25.4 = 3.94$ inches, which gives $3.94 \\times 1600 = 6300$ counts.'
      ],
      a: '15.9 µm per count, and about 6300 counts for 10 cm.'
    },
    {
      title: 'How fast must the electronics count?',
      q: 'An encoder of 1000 lines per turn spins at 3000 rpm. What are the frequency of channel A, the count rate in quadrature, and the angle of one count?',
      steps: [
        'The speed is $3000/60 = 50$ turns per second, so the A channel runs at 50 000 cycles per second.',
        'Four counts per cycle give 200 000 counts per second.',
        { text: 'One count is', tex: '\\frac{360°}{4 \\times 1000} = 0.09°' }
      ],
      a: '50 kHz on channel A, 200 000 counts per second, 0.09° per count.'
    }
  ],
  quiz: [
    { q: 'An encoder has channels A and B a quarter of a period apart. What does the order of their edges tell?', choices: ['The direction of rotation', 'The speed', 'The absolute angle', 'The supply voltage'], a: 0, why: 'When A rises before B the disc turns one way, when B rises first the other way. The speed comes from the rate of the edges.' },
    { q: 'An optical mouse tracks well on a sheet of clear glass.', a: false, why: 'Clear glass has no texture for the sensor to follow; a mouse needs a surface with fine detail, or speckle from a laser, to find the shift between pictures.' },
    { q: 'An incremental encoder has 2500 lines per turn and is read in quadrature. How many counts per revolution?', answer: 10000, why: 'Four edges per line: 4 × 2500 = 10 000.' },
    { q: 'A mouse is set to 800 counts per inch. How many micrometres per count, to the nearest micrometre?', answer: 32, unit: 'µm', why: '25 400 µm / 800 = 31.75 µm.' },
    { q: 'Why is the light in a mouse sent at a low angle to the desk?', choices: ['Grain and fibres cast shadows, giving the sensor contrast to follow', 'To keep the light out of the user\'s eyes', 'To make the sensor cooler', 'To measure the height of the mouse'], a: 0, why: 'Light from the side makes shadows of every bump; light from straight above would give a flat picture.' }
  ],
  applications: [
    'Computer mice, trackballs and touch-free pointers, which follow the surface or a ball.',
    'Motor shafts of printers, robots and machine tools, where an encoder gives position and speed to the controller.',
    'Linear scales on machine tools and measuring machines, where a graduated glass scale is read to micrometres or less.',
    'Manual controls such as knobs and wheels that count detents with the same A/B signals.'
  ],
  history: 'Mechanical-ball mice were followed in the late 1990s by optical ones that took pictures of the desk; laser mice and sensors with arrays of 30 × 30 pixels or more followed. Optical shaft encoders developed alongside numerically controlled machine tools in the 1950s and 1960s.',
  sources: [
    'J. Webster (ed.), *The Measurement, Instrumentation and Sensors Handbook* (CRC Press, 1999) — optical encoders.',
    'J. W. Goodman, *Speckle Phenomena in Optics* (Roberts, 2007) — why a rough surface looks grainy in laser light.'
  ],
  sim: 'es-mouse'
},

{
  id: 'remote-controls-and-light-barriers', parent: 'everyday-optical-systems', title: 'Remote controls and light barriers', level: 1,
  short: 'A remote control sends a code as bursts of invisible 940 nm light chopped at about 38 kHz, so that its receiver can ignore daylight and lamps. Photoelectric sensors and safety light curtains use the same trick, with the beam going straight across, back from a reflector, or off the object itself.',
  keywords: ['remote control', 'infrared', '940 nm', '38 kHz', 'IR receiver', 'carrier', 'photoelectric sensor', 'through-beam', 'retro-reflective', 'diffuse', 'light barrier', 'light curtain', 'proximity sensor', 'polarizer', 'ambient light'],
  prereq: ['how-to-read-an-optical-system', 'uv-and-infrared-sources', 'quantum-efficiency-and-spectral-response'],
  related: ['light-emitting-diodes', 'retroreflectors', 'polarizers-and-malus-law', 'inverse-square-and-cosine-laws', 'interference-filters', 'electronics:leds', 'electronics:photodiodes', 'electronics:optocouplers', 'specular-and-diffuse-reflection', 'the-optical-mouse-and-optical-encoders'],
  body: `
A remote control talks with light you cannot see, in a room full of light you can. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** an infrared LED, near 940 nm. **Object and field:** none; a code, sent into a cone of ±15–30°. **What limits the cone:** the LED's small window, and the receiver's. **Where it ends up:** a photodiode that tells 38 kHz from everything else. **What is worst:** sunlight and lamps, which are far stronger, hence the carrier.

### The remote, in the order of the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Infrared LED | makes 940 nm, which the eye does not see but silicon does | [[uv-and-infrared-sources]], [[light-emitting-diodes]] |
| Code | bursts of about 21 cycles, spaced short or long to make 0 and 1 | [[electronics:leds]] |
| Window | dark plastic that passes the infrared and blocks visible light | [[coloured-glass-filters]] |
| Photodiode | turns the light into a small current | [[electronics:photodiodes]] |
| Band-pass and demodulator | accepts only 38 kHz, and reports "burst" or "no burst" | [[electronics:noise-snr]] |

At 38 kHz a cycle lasts 26 µs; a burst of 562 µs is 21 cycles. The code may use short and long gaps to make 0 and 1. Daylight and ordinary lamps are steady or flicker at 100–120 Hz, a few hundred times slower, so a filter that passes only 38 kHz rejects them. Some LED drivers and electronic ballasts flicker at tens of kilohertz and can disturb a receiver. A phone camera, whose infrared filter is not perfect, often shows the LED as a white-violet flash.

### Photoelectric sensors
| Type | The light goes… | Typical range |
|---|---|---|
| Through-beam | from the emitter straight to a separate receiver | tens of metres |
| Retro-reflective | to a corner-cube reflector and back; polarizers reject shiny objects | up to about ten metres |
| Diffuse (proximity) | off the object itself | millimetres to a metre or two |

A retro-reflector turns the polarization of the light it returns; the sensor's two polarizers are crossed, so light that reflects from a shiny box keeps its polarization and is blocked, while light from the reflector passes ([[polarizers-and-malus-law]]). A diffuse sensor sees only what the object returns, in proportion to its reflectance over the square of its distance: black (6 %) is sensed at about a quarter of the distance of white (90 %). A safety light curtain is a row of through-beams whose spacing sets the smallest object it must catch.

> [!warn] A safety light curtain is a certified safety component. Never bridge, bypass or move it to make a machine run, and have changes made only by competent persons.

> [!key] Chopping the light at 38 kHz lets a remote or a sensor ignore the room. A through-beam crosses the gap, a retro-reflective one returns from a reflector with polarizers, and a diffuse one relies on the object; the range of the last falls with the square root of reflectance.
`,
  ideas: [
    'A remote sends its code as bursts of about 38 kHz light so that the receiver can ignore steady and slowly flickering light.',
    'The LED is near 940 nm: invisible to the eye, but within the range of silicon detectors.',
    'Through-beam sensors go farthest, retro-reflective ones need one reflector, diffuse ones need no reflector but depend on the target.',
    'Polarizers in a retro-reflective sensor stop a shiny object from reflecting the beam back as if it were the reflector.',
    'A diffuse sensor\'s range scales as the square root of the target\'s reflectance.'
  ],
  pitfalls: [
    'A remote works because the light is bright — It works because it is coded: a 38 kHz carrier that the receiver tunes to. Sunlight is far brighter but is steady and does not match.',
    'The infrared from a remote is always harmless and unseen — At the power of a remote it is safe, but infrared illuminators of much higher power exist, and the eye gives no warning because it cannot see the light.',
    'A diffuse sensor senses any object equally at the same distance — The signal depends on the reflectance of the target; a black object is sensed at about a quarter of the range of a white one.',
    'A retro-reflective sensor always sees a mirror — A mirror keeps the polarization, so the crossed analyser blocks it; that is why the sensor carries polarizers.'
  ],
  terms: [
    { term: 'Carrier frequency', also: ['38 kHz', 'modulation'], def: 'The frequency, near 38 kHz in many remotes, at which the infrared LED is switched during a burst so that the receiver can tell it from ambient light.' },
    { term: 'Through-beam sensor', also: ['opposed mode', 'thru-beam'], def: 'A photoelectric sensor whose emitter and receiver face each other across the gap; the object is detected when it breaks the beam.' },
    { term: 'Retro-reflective sensor', also: ['reflex sensor'], def: 'A sensor with emitter and receiver in one housing and a separate reflector on the far side; an object is detected when it breaks the path to the reflector and back.' },
    { term: 'Diffuse sensor', also: ['proximity sensor', 'diffuse-reflective sensor'], def: 'A sensor with emitter and receiver in one housing that detects light returned by the object itself.' },
    { term: 'Light curtain', also: ['safety light curtain', 'protective optoelectronic device'], def: 'A row of through-beams that guards an opening and stops a machine when any beam is broken; its resolution is the smallest object it must detect.' },
    { term: 'Light-on / dark-on', def: 'The output mode of a photoelectric sensor: switched when light is received (light-on) or when the beam is interrupted (dark-on).' }
  ],
  formulas: [
    {
      name: 'Cycles in a burst',
      expr: 'n = tb*fc', tex: 'n = t_{\\mathrm{b}}\\,f_{\\mathrm{c}}',
      vars: {
        n: { name: 'cycles in the burst', tex: 'n' },
        tb: { name: 'duration of the burst', q: 'time', unit: 'µs', value: 562.5, tex: 't_{\\mathrm{b}}' },
        fc: { name: 'carrier frequency', q: 'frequency', unit: 'kHz', value: 38, tex: 'f_{\\mathrm{c}}' }
      },
      solveFor: 'n',
      note: 'A receiver needs several cycles of the carrier before its band-pass filter and demodulator respond.',
      stories: { n: 'A burst lasts {tb} on a carrier of {fc}. How many cycles does it hold?' }
    },
    {
      name: 'Range of a diffuse sensor against reflectance',
      expr: 'dr = d0*sqrt(rho/rho0)', tex: 'd = d_0\\sqrt{\\frac{\\rho}{\\rho_0}}',
      vars: {
        dr: { name: 'sensing range for the target', q: 'length', unit: 'm', tex: 'd' },
        d0: { name: 'range for the reference target', q: 'length', unit: 'm', value: 1, tex: 'd_0' },
        rho: { name: 'reflectance of the target', value: 0.06, min: 0.001, max: 1, tex: '\\rho' },
        rho0: { name: 'reflectance of the reference target', value: 0.9, min: 0.001, max: 1, tex: '\\rho_0' }
      },
      solveFor: 'dr',
      note: 'The returned signal goes as reflectance over distance squared; at the threshold the distance scales as the square root of the reflectance.',
      stories: { dr: 'A diffuse sensor reaches {d0} on a white card ({rho0} reflectance). How far does it reach on a target of reflectance {rho}?' }
    },
    {
      name: 'Period of the carrier',
      expr: 'T = 1/fc', tex: 'T = \\frac{1}{f_{\\mathrm{c}}}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'µs', tex: 'T' },
        fc: { name: 'carrier frequency', q: 'frequency', unit: 'kHz', value: 38, tex: 'f_{\\mathrm{c}}' }
      },
      solveFor: 'T',
      note: 'The time of one cycle of the carrier.',
      stories: { T: 'A remote uses a carrier of {fc}. How long does one cycle last?' }
    }
  ],
  examples: [
    {
      title: 'How long is a burst?',
      q: 'A remote uses a 38 kHz carrier and sends bursts of 562.5 µs. How long is one cycle and how many cycles are in a burst?',
      steps: [
        { text: 'One cycle:', tex: 'T = \\frac{1}{38\\ \\mathrm{kHz}} = 26.3\\ \\mu\\mathrm{s}' },
        { text: 'The cycles in a burst:', tex: 'n = \\frac{562.5}{26.3} = 21.4' }
      ],
      a: '26.3 µs per cycle and 21 cycles in a burst.'
    },
    {
      title: 'Black against white',
      q: 'A diffuse sensor reaches 1.0 m on a white card (90 % reflectance). How far does it reach on a black target (6 %)?',
      steps: [
        { text: 'The range scales with the square root of the reflectance:', tex: 'd = 1.0\\ \\mathrm{m} \\times \\sqrt{\\frac{0.06}{0.90}} = 0.26\\ \\mathrm{m}' }
      ],
      a: 'About 0.26 m, roughly a quarter. This is why a sensor is set up with the darkest target in mind.'
    }
  ],
  quiz: [
    { q: 'Why does a remote chop its light at 38 kHz?', choices: ['So that the receiver can ignore sunlight and lamps', 'To make the LED last longer', 'To make the light visible', 'To reach farther'], a: 0, why: 'The receiver passes only the carrier frequency; steady light and light that flickers at 100–120 Hz fall outside its filter.' },
    { q: 'A retro-reflective sensor with polarizers does not react to a shiny metal box in the beam path.', a: true, why: 'The box reflects the light with its polarization unchanged and the receiver\'s analyser is crossed with the emitter\'s; only the reflector, which turns the polarization, passes the light.' },
    { q: 'A diffuse sensor reaches 0.8 m on white (90 %). How far on a grey target of 22.5 % reflectance, in metres?', answer: 0.4, unit: 'm', why: '0.8 × √(0.225/0.9) = 0.8 × 0.5 = 0.4 m.' },
    { q: 'Which sensor type reaches farthest?', choices: ['Through-beam', 'Diffuse', 'Retro-reflective, with a shiny object', 'They are all equal'], a: 0, why: 'In a through-beam the light travels the gap once and arrives whole; the others lose light on a return path or at the object.' },
    { q: 'The carrier of a remote has a period of 26.3 µs. What is its frequency, in kilohertz?', answer: 38, unit: 'kHz', why: 'f = 1/T = 1/26.3 µs = 38 kHz.' }
  ],
  applications: [
    'Television, set-top box and air-conditioner remotes, and the receivers in the equipment they control.',
    'Conveyors and packaging lines, where through-beams count items and diffuse sensors check presence.',
    'Doors and lifts, where a beam across the opening stops the door when it is broken.',
    'Machine guarding, where safety light curtains stop a press or a robot when a hand reaches in.'
  ],
  history: 'Wireless remote controls began with ultrasonic units in the 1950s; infrared remotes with coded bursts took over in the 1980s. Photoelectric sensors for industrial use appeared in the 1950s, and certified safety light curtains developed from them to guard presses in the following decades.',
  sources: [
    'P. Horowitz and W. Hill, *The Art of Electronics*, 3rd ed. (Cambridge, 2015) — photodiodes, LEDs and opto-isolators.',
    'W. Boyes (ed.), *Instrumentation Reference Book*, 4th ed. (Butterworth-Heinemann, 2010) — photoelectric sensors.',
    'IEC 61496-1 and -2 — safety of machinery: electro-sensitive protective equipment and active opto-electronic protective devices.'
  ],
  sim: 'es-photoeye'
}
);

/* ================================================================ the fibre internet link, car headlamps, the lighthouse lens, night vision and thermal cameras */
Hyper.add(
{
  id: 'the-fibre-internet-link', parent: 'everyday-optical-systems', title: 'The fibre internet link', level: 2,
  short: 'A fibre-to-the-home link is a laser, a single-mode glass fibre and a photodiode. One fibre from the exchange is shared by up to 32 or 64 homes through a passive splitter, each home using its own time slot and a different wavelength for each direction. What decides whether it works is the decibel budget.',
  keywords: ['fibre internet', 'FTTH', 'PON', 'GPON', 'passive optical network', 'splitter', 'ONT', 'OLT', 'wavelength', '1310 nm', '1490 nm', '1550 nm', 'loss budget', 'dB', 'dBm', 'single-mode fibre', 'WDM', 'APC connector'],
  prereq: ['how-to-read-an-optical-system', 'fibre-optic-links', 'fibre-attenuation-and-windows'],
  related: ['single-mode-and-multimode-fibre', 'fibre-connectors-and-ferrules', 'diode-lasers', 'dichroic-filters-and-mirrors', 'infrared-and-thermal-sensors', 'fibre-dispersion-and-bandwidth', 'laser-eye-hazards-and-eyewear', 'electronics:photodiodes', 'electronics:transimpedance', 'math:logarithmic-scales'],
  body: `
The cable that brings the internet into a home may carry no electricity at all: one strand of glass the width of a hair. Read the link with the five questions of [[how-to-read-an-optical-system]]. **Light:** a laser diode in the infrared, 1310, 1490 or 1550 nm. **Object and field:** none; the "picture" is a stream of 1.25–10 billion bits a second. **What limits the cone:** the core of a single-mode fibre, 8–9 µm across, which accepts a cone of only about 7°. **Where it ends up:** an InGaAs photodiode. **What is worst:** loss, and above all the splitter.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Laser at the exchange | a diode laser, 1490 nm downstream, switched on and off at gigabits per second | [[diode-lasers]] |
| Wavelength filter | a coating that sends 1310, 1490 and 1550 nm to different places | [[dichroic-filters-and-mirrors]] |
| Single-mode fibre | the light is guided in a core 8–9 µm across; 0.2–0.35 dB of loss per kilometre | [[single-mode-and-multimode-fibre]], [[fibre-attenuation-and-windows]] |
| Connectors and splices | glass-to-glass joints, 0.1–0.5 dB each; the green angled-polish plug keeps reflections out | [[fibre-connectors-and-ferrules]] |
| Passive splitter | divides the power equally among 32 or 64 fibres, with no electronics | [[fibre-optic-links]] |
| Home unit laser | sends 1310 nm back, in bursts, each home in its own time slot | [[diode-lasers]] |
| Photodiode | an InGaAs diode turns the light into current | [[infrared-and-thermal-sensors]], [[electronics:photodiodes]] |

### The decibel budget
Each loss is stated in decibels, which add. A splitter that divides the light among $n$ fibres loses at least $10\\log_{10} n$ decibels: 3.0 dB for two, 15.05 dB for 32, 18.06 dB for 64. A typical path of 20 km, a 1:32 splitter with 1.5 dB of excess loss, four connectors and six splices costs 7.0 + 16.6 + 1.2 + 0.6 = 25.4 dB. A common class of gigabit passive network allows 28 dB between laser and receiver (ITU-T G.984.2, class B+), leaving 2.6 dB of margin for ageing and repairs.

### Few photons per bit
A receiver at −28 dBm receives 1.6 µW. At 1490 nm a photon carries 1.33 × 10⁻¹⁹ J, so that is 1.2 × 10¹³ photons a second; at 2.488 Gbit/s that is about 4800 photons for each bit.

### Reading the sheet
"GPON, class B+, 1:32, 20 km, 1490/1310" means: a gigabit passive network, 28 dB of budget, a 1:32 split, a reach of 20 km, and the wavelengths down and up. Faster versions use 1577 and 1270 nm.

> [!warn] Never look into the end of a fibre or into a connector. The light is usually invisible infrared, and the eye gives no warning. Do not use a magnifier on a fibre end unless you know it is dark.

> [!key] A fibre link is a laser, a fibre and a photodiode, and the design is a sum of decibels. The splitter costs the most; the fibre itself costs little. The receiver needs only a few thousand photons for each bit.
`,
  ideas: [
    'One fibre from the exchange serves 32 or 64 homes through a passive splitter; each direction has its own wavelength and each home its own time slot.',
    'Losses in decibels add: a 1:n splitter costs at least 10 log₁₀ n decibels.',
    'The fibre costs only 0.2–0.35 dB per kilometre, so the splitter, connectors and splices matter more than the distance.',
    'The power budget runs from the laser output to the receiver sensitivity; the margin covers ageing and repairs.',
    'At the sensitivity limit a receiver counts a few thousand photons for each bit.'
  ],
  pitfalls: [
    'A splitter splits the wavelengths between homes — It divides the power: every home gets all the wavelengths and a fraction of the light (1/32 for a 1:32 splitter).',
    'Fibre loss grows fast with distance — Over the 20 km of an access network the fibre costs 4–7 dB, less than the splitter; it is the long submarine and trunk links that count in tens of decibels.',
    'Light on a dB scale adds like power — Decibels are ratios on a logarithmic scale: add losses in dB, but multiply the power ratios; −3 dB is half the power.',
    'A dirty connector is harmless if the light is infrared — Dust on the end of a fibre scatters and absorbs light, and a bright connector end can burn dust into the glass; connectors are inspected and cleaned.'
  ],
  terms: [
    { term: 'Passive optical network', also: ['PON', 'GPON', 'XGS-PON'], def: 'A fibre network with no powered equipment between the exchange and the home: a passive splitter shares one fibre among many homes.' },
    { term: 'OLT', also: ['optical line terminal'], def: 'The equipment at the exchange that sends the downstream light into the fibre and receives the upstream bursts of all homes.' },
    { term: 'ONT', also: ['optical network terminal', 'ONU'], def: 'The unit in the home that receives the downstream light and sends the upstream burst in its own time slot.' },
    { term: 'Optical loss budget', also: ['link budget', 'power budget'], def: 'The difference, in decibels, between the power the laser launches and the least power the receiver needs, to be shared by fibre, splitter, connectors, splices and margin.' },
    { term: 'dBm', also: ['decibel-milliwatt'], def: 'Power on a logarithmic scale relative to 1 mW: 0 dBm is 1 mW, −3 dBm is 0.5 mW and −30 dBm is 1 µW.' },
    { term: 'Splitter', also: ['optical splitter', 'coupler', '1:32'], def: 'A passive component that divides the light of one fibre among n fibres; the ideal loss is 10 log₁₀ n decibels, with a little more in practice.' }
  ],
  formulas: [
    {
      name: 'Loss of an ideal splitter',
      expr: 'Ls = 10*log(n)', tex: 'L_{\\mathrm{s}} = 10\\log_{10} n',
      vars: {
        Ls: { name: 'splitter loss', q: 'gain', unit: 'dB', tex: 'L_{\\mathrm{s}}' },
        n: { name: 'number of output fibres', value: 32, min: 2, int: true, tex: 'n' }
      },
      solveFor: 'Ls',
      note: 'Equal division of the power; a real splitter adds 0.5 to 2 dB of excess loss.',
      stories: { Ls: 'A passive splitter divides the light among {n} fibres. What is its ideal loss?', n: 'A splitter has an ideal loss of {Ls}. Among how many fibres does it divide the light?' }
    },
    {
      name: 'Total loss of the path',
      expr: 'Lt = a*z + Ls + Lc', tex: 'L_{\\mathrm{t}} = a z + L_{\\mathrm{s}} + L_{\\mathrm{c}}',
      vars: {
        Lt: { name: 'total loss', q: 'gain', unit: 'dB', tex: 'L_{\\mathrm{t}}' },
        a: { name: 'fibre attenuation', q: 'attenuation', unit: 'dB/km', value: 0.35, tex: 'a' },
        z: { name: 'fibre length', q: 'length', unit: 'km', value: 20, tex: 'z' },
        Ls: { name: 'splitter loss, with excess', q: 'gain', unit: 'dB', value: 16.55, tex: 'L_{\\mathrm{s}}' },
        Lc: { name: 'connectors and splices together', q: 'gain', unit: 'dB', value: 1.8, tex: 'L_{\\mathrm{c}}' }
      },
      solveFor: 'Lt',
      note: 'All losses in decibels simply add. Compare the result with the budget of the equipment, for instance 28 dB.',
      stories: { Lt: 'A link has {z} of fibre at {a}, a splitter of {Ls} and {Lc} of connectors and splices. What is the total loss?' }
    },
    {
      name: 'Power at the receiver',
      expr: 'Pr = Pt - Lt', tex: 'P_{\\mathrm{r}} = P_{\\mathrm{t}} - L_{\\mathrm{t}}',
      vars: {
        Pr: { name: 'power at the receiver', q: false, unit: 'dBm', signed: true, tex: 'P_{\\mathrm{r}}' },
        Pt: { name: 'power launched by the laser', q: false, unit: 'dBm', signed: true, value: 1, tex: 'P_{\\mathrm{t}}' },
        Lt: { name: 'total loss', q: 'gain', unit: 'dB', value: 25.4, tex: 'L_{\\mathrm{t}}' }
      },
      solveFor: 'Pr',
      note: 'The result must exceed the receiver sensitivity, for example −27 dBm, with some margin.',
      stories: { Pr: 'A laser launches {Pt} into a path with {Lt} of loss. What power reaches the receiver?' }
    }
  ],
  examples: [
    {
      title: 'The splitter',
      q: 'A passive splitter shares one fibre among 32 homes. What is its ideal loss in decibels, and what fraction of the power does each home receive?',
      steps: [
        { text: 'Each fibre gets 1/32 of the light:', tex: 'L_{\\mathrm{s}} = 10\\log_{10} 32 = 15.05\\ \\mathrm{dB}' },
        'In power terms each home receives 1/32 = 3.1 % of the light.'
      ],
      a: '15.05 dB, a thirty-second of the power per home; a real splitter adds a dB or two.'
    },
    {
      title: 'Does it work?',
      q: 'A link has 20 km of fibre at 0.35 dB/km, a 1:32 splitter with 1.5 dB of excess loss, four connectors at 0.3 dB and six splices at 0.1 dB. The laser launches +1 dBm and the receiver needs −27 dBm. What is the margin?',
      steps: [
        'Fibre: 20 × 0.35 = 7.0 dB. Splitter: 15.05 + 1.5 = 16.55 dB. Connectors: 1.2 dB. Splices: 0.6 dB.',
        'The total is 25.35 dB, so the receiver gets $+1 - 25.35 = -24.35$ dBm.',
        'The sensitivity is −27 dBm: margin = $-24.35 - (-27) = 2.65$ dB.'
      ],
      a: 'A loss of 25.4 dB and a margin of 2.65 dB: the 28 dB budget of the equipment less the 25.35 dB of the path.'
    }
  ],
  quiz: [
    { q: 'A link has a loss of 21 dB. What fraction of the launched power reaches the receiver?', choices: ['About 0.8 %', 'About 8 %', 'About 21 %', 'About 0.08 %'], a: 0, why: 'Loss in dB = −10 log₁₀(P out / P in), so the ratio is 10^(−2.1) = 0.0079: 0.8 %.' },
    { q: 'Doubling the number of homes on a splitter (from 32 to 64) adds about 3 dB of loss.', a: true, why: 'Each doubling of the split halves each home\'s power: 10 log₁₀ 2 = 3.01 dB (15.05 dB for 32, 18.06 dB for 64).' },
    { q: 'A laser launches 2 dBm into a path with a total loss of 24 dB. What power reaches the receiver, in dBm?', answer: -22, unit: 'dBm', why: 'Subtract the loss: 2 − 24 = −22 dBm (6 µW).' },
    { q: 'Which is the largest single loss on a typical 20 km 1:32 access path?', choices: ['The splitter', 'The fibre', 'One connector', 'The photodiode'], a: 0, why: 'The splitter costs about 16.6 dB; the fibre about 7 dB over 20 km; a connector about 0.3 dB.' },
    { q: 'What does 0 dBm mean?', choices: ['A power of 1 mW', 'No power at all', 'A power of 1 W', 'A loss of 0 dB'], a: 0, why: 'dBm is power relative to 1 mW: 0 dBm = 1 mW, +10 dBm = 10 mW, −10 dBm = 0.1 mW.' }
  ],
  applications: [
    'Fibre to the home, where a passive network shares one feeder fibre among tens of homes.',
    'Mobile base stations, linked to the network by fibre over many kilometres.',
    'Business and data-centre links, using point-to-point single-mode fibre.',
    'Cable television, where a 1550 nm channel carries video along with the data.'
  ],
  history: 'Charles Kao and George Hockham proposed in 1966 that glass fibre could carry light over long distances if its loss were cut to about 20 dB/km, and in 1970 fibre of that quality was made. Fibre to the home with passive splitters was standardized in the early 2000s; the gigabit version appeared in 2003.',
  sources: [
    'G. P. Agrawal, *Fiber-Optic Communication Systems*, 4th ed. (Wiley, 2010) — losses, receivers and power budgets.',
    'ITU-T Recommendation G.984 series — gigabit-capable passive optical networks, including the optical path budget classes.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, 2nd ed. (Wiley, 2007) — optical fibres and communication links.'
  ],
  sim: 'es-fibre'
},

{
  id: 'car-headlamps-and-driver-cameras', parent: 'everyday-optical-systems', title: 'Car headlamps and driver-assistance cameras', level: 2,
  short: 'A dipped-beam headlamp puts a lot of light on the road and almost none above a sharp cut-off line, so that oncoming drivers are not dazzled. A reflector or a projector lens shapes the beam; a forward camera behind the windscreen watches the road with a very wide dynamic range.',
  keywords: ['headlamp', 'headlight', 'dipped beam', 'low beam', 'high beam', 'cut-off', 'reflector', 'projector', 'matrix LED', 'adaptive driving beam', 'xenon', 'HID', 'LED', 'laser headlamp', 'beam levelling', 'glare', 'HDR camera', 'lidar', 'driver assistance'],
  prereq: ['how-to-read-an-optical-system', 'flashlights-and-headlamps', 'parabolic-and-elliptical-mirrors'],
  related: ['reflectors', 'halogen-lamps', 'high-intensity-discharge-lamps', 'white-leds', 'spatial-light-modulators', 'glare-and-uniformity', 'ergonomics:glare-colour', 'lidar', 'dynamic-range-and-full-well', 'drivers-dimming-and-flicker', 'retroreflectors', 'light-and-dark-adaptation'],
  body: `
A headlamp has the opposite job of a torch: it must light the road far ahead and hardly light the eyes of the driver coming the other way. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** a halogen capsule (1000–1500 lm), a 35 W discharge burner (about 3000 lm), LED modules or a laser-pumped phosphor. **Object and field:** none; the road is the screen, and the beam is a pattern with a sharp edge. **What limits the cone:** the reflector or lens, 50–80 mm across, and a shield. **Where it ends up:** the road and, unfortunately, other eyes. **What is worst:** glare for others, and the range lost by aiming low.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Source | a small, hot or bright body, near a focus | [[halogen-lamps]], [[white-leds]] |
| Reflector | a parabolic or free-form mirror turns the light into a beam | [[parabolic-and-elliptical-mirrors]], [[reflectors]] |
| Shield (cap) | blocks the light that would go above the cut-off | [[aperture-stop]] |
| Projector lens | in a projector headlamp, an ellipsoidal reflector focuses the light on the shield edge and a lens images that edge onto the road | [[the-data-projector]] |
| Cover | a clear polycarbonate lens with a hard coat, or a fluted glass | [[ghosts-flare-and-stray-light]] |
| LED matrix (adaptive beams) | tens or thousands of light cells, switched off one by one around other vehicles | [[spatial-light-modulators]] |

### The cut-off
A reflector shapes the beam with the whole mirror and has a soft edge, because the source is not a point. A projector headlamp images the shield edge: a sharp line. The dipped beam is aimed so that its cut-off falls 1 % below the horizontal, 0.57°. A lamp 0.7 m high then lights the road out to $0.7/0.01 = 70$ m, and the cut-off is 0.45 m above the road at 25 m. With 1.5 % it is 47 m. A boot full of luggage that drops the rear axle by 50 mm on a 2.7 m wheelbase raises the beam by 1.85 %: the 1 % downward aim becomes 0.85 % upward, and the cut-off, 0.45 m high at 25 m, is 1.05 m high at 41 m, nearly at the eyes of an oncoming driver. That is why many lamps level themselves.

### The cameras
A forward camera behind the windscreen looks for lane lines, signs, other lamps and pedestrians. Its scene runs from a dark road to a low sun or a tunnel exit; sensors that combine several exposures reach more than 120 dB (a million to one). The camera also switches high beams and drives matrix lamps. Lidar adds distances by timing a pulse.

> [!warn] Laser headlamps contain blue laser diodes that shine on a phosphor, so that the light leaving the lamp is a diffuse white. The lamp as sold is safe; never open or modify one.

> [!key] A dipped beam is a shaped pattern with a sharp cut-off aimed about 1 % below the horizon: the range is height divided by slope. A projector makes the edge sharp; levelling and matrix switching keep it from dazzling others, and a forward camera supplies the decisions.
`,
  ideas: [
    'A dipped beam has a cut-off line: bright below it, dark above, so that other drivers\' eyes are spared.',
    'A reflector shapes the beam with the mirror and has a soft edge; a projector images a shield edge and has a sharp one.',
    'The lamp\'s range along the road is its height divided by the downward slope of the cut-off.',
    'Loading the car tilts the beam: a drop of the rear axle raises the cut-off by the same slope.',
    'A forward camera needs more than a million-to-one dynamic range, and drives auto high beam and matrix lighting.'
  ],
  pitfalls: [
    'More lumens always means better lighting — The pattern matters more: the same lumens can light the road or dazzle other drivers. The cut-off and the aim decide where they go.',
    'A whiter or bluer lamp lights the road farther — The colour temperature changes how the light looks. The lumens and the beam pattern decide how far the road is lit and how much glare others suffer.',
    'High beam is only a brighter low beam — It is a different pattern with no cut-off, extending far up the road and to the sides; matrix lamps imitate it by switching off cells around other road users.',
    'A camera sees as well as the eye at night — A camera has a fixed exposure at a time and a wide-range sensor combines several; neither adapts like the eye\'s pupil and retina over minutes.'
  ],
  terms: [
    { term: 'Dipped beam', also: ['low beam', 'passing beam'], def: 'The headlamp beam for meeting traffic: bright below a sharp cut-off line and dark above it, so that other drivers are not dazzled.' },
    { term: 'Main beam', also: ['high beam', 'driving beam'], def: 'The headlamp beam for empty roads: no cut-off, reaching far up the road and above the horizon.' },
    { term: 'Cut-off', also: ['cut-off line', 'dipped-beam cut-off'], def: 'The sharp upper edge of a dipped beam, aimed slightly below the horizon, above which almost no light is sent.' },
    { term: 'Projector headlamp', also: ['ellipsoidal headlamp', 'projector module'], def: 'A headlamp in which an ellipsoidal mirror focuses the light on a shield edge and a lens projects that edge onto the road.' },
    { term: 'Matrix lamp', also: ['adaptive driving beam', 'ADB', 'pixel light'], def: 'A headlamp made of many separately controlled light cells that are switched off in the directions of other vehicles to give a glare-free high beam.' },
    { term: 'Beam levelling', also: ['headlamp levelling', 'auto-levelling'], def: 'Adjusting the aim of the lamps to the pitch of the car, by hand or by motors with sensors, so that the cut-off stays where it should.' }
  ],
  formulas: [
    {
      name: 'How far the dipped beam reaches',
      expr: 'd = h/s', tex: 'd = \\frac{h}{s}',
      vars: {
        d: { name: 'reach along the road', q: 'length', unit: 'm', tex: 'd' },
        h: { name: 'mounting height of the lamp', q: 'length', unit: 'm', value: 0.7, tex: 'h' },
        s: { name: 'downward slope of the cut-off', q: 'ratio', unit: '%', value: 1, min: 0.01, tex: 's' }
      },
      solveFor: 'd',
      note: 'The cut-off ray falls by s metres per metre of road, so it reaches the ground at h/s. Small slopes: slope is nearly the angle in radians.',
      stories: { d: 'A lamp {h} above the road has its cut-off aimed {s} downward. How far down the road does the dipped beam reach?', s: 'A lamp {h} above the road must light the road to {d}. What downward slope must the cut-off have?' }
    },
    {
      name: 'Tilt of the car from a load',
      expr: 'sr = dz/wb', tex: 's_{\\mathrm{r}} = \\frac{\\Delta z}{\\mathrm{WB}}',
      vars: {
        sr: { name: 'upward tilt of the beam', q: 'ratio', unit: '%', tex: 's_{\\mathrm{r}}' },
        dz: { name: 'drop of the rear axle', q: 'length', unit: 'mm', value: 50, tex: '\\Delta z' },
        wb: { name: 'wheelbase', q: 'length', unit: 'm', value: 2.7, tex: '\\mathrm{WB}' }
      },
      solveFor: 'sr',
      note: 'A drop of the rear raises the beam by this slope; subtract it from the 1 % downward aim to see where the cut-off points.',
      stories: { sr: 'Luggage presses the rear axle down {dz} on a car with a wheelbase of {wb}. By what slope does the beam rise?' }
    },
    {
      name: 'Illuminance from a lamp of given intensity',
      expr: 'E = I/d^2', tex: 'E = \\frac{I}{d^2}',
      vars: {
        E: { name: 'illuminance on a surface facing the lamp', q: 'illuminance', unit: 'lx', tex: 'E' },
        I: { name: 'luminous intensity', q: 'luminousint', unit: 'cd', value: 100000, tex: 'I' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 100, tex: 'd' }
      },
      solveFor: 'E',
      note: 'The inverse-square law for a surface facing the lamp. Roads are lit at a grazing angle, so the light on the road is far less than this.',
      stories: { E: 'A lamp gives {I} in the direction of a sign {d} away. What illuminance falls on the sign?' }
    }
  ],
  examples: [
    {
      title: 'How far does it see?',
      q: 'Headlamps 0.7 m above the road are aimed with the cut-off 1 % below the horizontal. How far does the dipped beam reach, and how far if the car is loaded so that the beam rises by 1.85 %?',
      steps: [
        { text: 'The cut-off ray reaches the road at', tex: 'd = \\frac{0.7\\ \\mathrm{m}}{0.01} = 70\\ \\mathrm{m}' },
        'With the rise the slope becomes $1 - 1.85 = -0.85$ %: the cut-off now points 0.85 % above the horizon and never meets the road. At 41 m it is $0.7 + 0.0085 \\times 41 = 1.05$ m high, close to the 1.1 m of the eyes of an oncoming driver.'
      ],
      a: '70 m when aimed correctly; with the heavy load the cut-off rises towards the eyes of oncoming drivers.'
    }
  ],
  quiz: [
    { q: 'A headlamp 0.8 m above the road has its cut-off aimed 1.6 % down. How far does the dipped beam reach, in metres?', answer: 50, unit: 'm', why: '0.8 m / 0.016 = 50 m.' },
    { q: 'A projector headlamp has a sharper cut-off than a reflector headlamp of the same size.', a: true, why: 'It images the edge of a shield with a lens; a reflector shapes the beam with the mirror and the finite size of the source blurs the edge.' },
    { q: 'Luggage drops a car\'s rear axle by 54 mm on a 2.7 m wheelbase. By what slope, in per cent, does the beam rise?', answer: 2, unit: '%', why: '54 mm / 2700 mm = 0.02 = 2 %, twice the usual downward aim.' },
    { q: 'Why is the dipped beam of a car aimed slightly down and not at the horizon?', choices: ['So that the cut-off keeps light out of the eyes of oncoming drivers', 'To light the sky', 'To save energy', 'To make the lamp last longer'], a: 0, why: 'The light must stay below eye height of oncoming drivers; aiming the cut-off below the horizon gives a margin that covers bumps and the tilt of the car.' },
    { q: 'What does an HDR camera sensor do for a driver-assistance system?', choices: ['It records bright lamps and dark road in one picture by combining exposures', 'It makes the light from the lamp stronger', 'It measures distance by timing pulses', 'It removes the cut-off'], a: 0, why: 'The scene spans a million to one or more; combining short and long exposures, or compressing bright pixels, keeps both ends in the picture.' }
  ],
  applications: [
    'Passenger cars, trucks and motorcycles, whose dipped and main beams are specified by international regulations.',
    'Automatic high-beam control, which switches between patterns when the camera sees other lamps.',
    'Adaptive matrix beams, which carve dark gaps out of the high beam around other vehicles.',
    'Lane-keeping and sign-reading systems, which use the same forward camera.'
  ],
  history: 'Acetylene and then electric headlamps replaced oil lamps in the first decades of the 20th century. The sealed beam arrived in the 1930s, the halogen lamp in the 1960s, the discharge lamp in the 1990s and the LED in the 2000s; matrix and pixel lamps of the 2010s steer light around other vehicles.',
  sources: [
    'UNECE Regulations 112 and 123 — motor-vehicle headlamps emitting an asymmetrical passing beam and adaptive front-lighting systems.',
    'B. Wördenweber, J. Wallaschek, P. Boyce and D. D. Hoffman (eds), *Automotive Lighting and Human Vision* (Springer, 2007) — headlamps, glare and visibility.',
    'W. J. Smith, *Modern Optical Engineering*, 4th ed. (McGraw-Hill, 2008) — reflector and projector systems.'
  ],
  sim: 'es-headlamp'
},

{
  id: 'the-lighthouse-lens', parent: 'everyday-optical-systems', title: 'The lighthouse lens', level: 2,
  short: 'A lighthouse lens is a large lens cut into concentric steps, so that it is thin and light, with rings of prisms above and below that bend the light by total reflection. A small bright lamp at its focus becomes a beam of a few degrees, and a rotating set of lens panels sweeps it round as a flash.',
  keywords: ['lighthouse', 'Fresnel lens', 'beacon', 'catadioptric', 'prism', 'order of lens', 'flash', 'characteristic', 'luminous range', 'geographic range', 'focal distance', 'rotating lens', 'lantern', 'total internal reflection', 'beam divergence'],
  prereq: ['how-to-read-an-optical-system', 'fresnel-lenses', 'critical-angle-and-total-internal-reflection'],
  related: ['refraction-at-a-flat-surface', 'prism-deviation', 'radiance-and-its-conservation', 'etendue', 'atmospheric-refraction', 'incandescent-lamps', 'light-emitting-diodes', 'lens-shapes-and-names', 'focal-length-and-optical-power', 'retroreflectors'],
  body: `
A lighthouse is an optical system turned to a single task: sending as much of a small lamp's light as possible into a thin sheet of light level with the horizon. Read it with the five questions of [[how-to-read-an-optical-system]]. **Light:** a small bright lamp at the focus, once oil, now often an LED or a halogen or discharge lamp. **Object and field:** none; the "field" is the horizon, all the way round. **What limits the cone:** the panel height and the size of the lamp. **Where it ends up:** a ship's lookout 20 miles away. **What is worst:** the lamp's size, because it sets the beam spread.

### Following the light
| Part | What it does in plain words | Learn more |
|---|---|---|
| Lamp | a small source at the focus | [[incandescent-lamps]], [[light-emitting-diodes]] |
| Central refracting zone | rings of small prisms collimate the light that falls within about 30° of the axis | [[fresnel-lenses]], [[refraction-at-a-flat-surface]] |
| Catadioptric prisms | above and below: light refracts in, reflects by total reflection and goes out parallel | [[critical-angle-and-total-internal-reflection]], [[prism-deviation]] |
| Rotating carriage | carries 2 to 8 panels; each sweep of the beam over you is a flash | [[lens-shapes-and-names]] |
| Lantern glazing | clear panes of glass around it, kept clean | [[ghosts-flare-and-stray-light]] |

### Why steps, and why prisms
A lens 2 m high and a solid piece of glass would weigh tons and absorb much of the light. Cut into steps, each facet keeping the slope it would have had, the lens is a few centimetres thick. A refracting facet must slope ever more steeply as the ray angle grows: for crown glass (index 1.525), 35° at 20° off axis, 49° at 30° and 67° at 50°, which wastes light. Beyond about 30–40°, a prism that turns the light by two refractions and one total reflection (the ray strikes its back face beyond the critical angle, 41.0°) does the job better. Together they gather light over a wide angle.

### The numbers
A source of width $s$ at distance $f$ makes a beam $s/f$ wide, so a bigger lens (a longer focal distance) gives a narrower beam. For a lamp 25 mm across, the first order (focal distance 920 mm) gives 1.6°, the third (500 mm) 2.9° and the sixth (150 mm) 9.5°. The brightness of the lens as seen from far away equals that of the lamp, so the intensity is the luminance times the area: a filament of 10⁷ cd/m² behind a lens panel of 1.5 m² and 80 % transmission gives 12 million candela, 6000 times the lamp alone (2000 cd for a filament 2 cm²). The geographic range of a light 50 m above the sea, seen by an eye 5 m high, is 27.3 + 8.6 = 35.9 km, 19.4 nautical miles, with ordinary refraction.

### Reading the sheet
"Fl(2) W 10 s 45 m 18 M": flashing in groups of two, white, repeating every ten seconds, the light 45 m above the sea, visible to 18 nautical miles in clear weather.

> [!key] A lighthouse lens collects light from a small lamp over a wide angle with refracting rings and total-reflection prisms, and sends it as a beam a few degrees wide. The lens appears as bright as the lamp but as big as the panel.
`,
  ideas: [
    'A lens cut into concentric steps keeps the slope of its surface but loses the thickness: thin, light, and made in panels.',
    'Light at large angles from the axis is turned by prisms using total internal reflection, because a refracting facet would be too steep.',
    'The beam width is about the source width divided by the focal distance.',
    'The apparent luminance of the lens equals that of the source, so the intensity is source luminance times lens area.',
    'The beam sweeps round on a rotating carriage; the number of panels and the speed set the flash period.'
  ],
  pitfalls: [
    'A bigger lamp makes a lighthouse brighter — A bigger source widens the beam instead. The beam intensity comes from the lens area times the source luminance; the lens concentrates the light, it cannot make the source brighter.',
    'A Fresnel lens is a special kind of magnifier — It is any lens whose curved surface is collapsed into steps; the focusing power is the same as that of the thick lens it replaces, but the steps scatter some light.',
    'The light is visible as far as the horizon is — The range is set by the curvature of the Earth for the heights of light and eye, and by the haze for the brightness; the shorter of the two applies.',
    'The prisms above and below only reflect — They refract on entry, reflect by total internal reflection on their back face, and refract again on leaving; none of the reflection is by silvering.'
  ],
  terms: [
    { term: 'Lens panel', also: ['bull\'s-eye', 'lens drum'], def: 'One of the stepped lenses, with its prisms above and below, mounted round a lamp on a rotating carriage; each panel sends out one beam.' },
    { term: 'Catadioptric prism', also: ['dioptric and catoptric prism'], def: 'A ring prism that bends light by refraction on entry, total internal reflection on its back face and refraction on leaving.' },
    { term: 'Order of a lens', also: ['first-order lens', 'third-order lens'], def: 'The standard size classes of lighthouse lenses, from the first order (focal distance 920 mm) to the sixth (150 mm).' },
    { term: 'Characteristic', also: ['light characteristic', 'Fl', 'Oc'], def: 'The pattern of flashes and colour by which a light is identified, for instance Fl(2) W 10 s: a group of two white flashes every ten seconds.' },
    { term: 'Geographic range', also: ['geographical range'], def: 'The distance at which the horizon hides a light for given heights of light and eye. The luminous range (the nominal range in clear weather) is where the light is too faint to see in the haze; the shorter of the two applies.' },
    { term: 'Flash period', also: ['rotation period'], def: 'The time between one flash and the next: the rotation period divided by the number of lens panels.' }
  ],
  formulas: [
    {
      name: 'Beam width from the source size',
      expr: 'th = s/f', tex: '\\theta = \\frac{s}{f}',
      vars: {
        th: { name: 'width of the beam', q: 'angle', unit: '°', tex: '\\theta' },
        s: { name: 'size of the source', q: 'length', unit: 'mm', value: 25, tex: 's' },
        f: { name: 'focal distance', q: 'length', unit: 'mm', value: 920, tex: 'f' }
      },
      solveFor: 'th',
      note: 'A point at the focus makes a parallel beam; a source of width s makes a beam of full width s/f in radians.',
      stories: { th: 'A lamp {s} across stands at the focus of a lens of focal distance {f}. How wide is the beam?', f: 'A lamp {s} across must make a beam {th} wide. What focal distance does the lens need?' }
    },
    {
      name: 'Intensity of the beam',
      expr: 'I = L*A*tau', tex: 'I = L\\,A\\,\\tau',
      vars: {
        I: { name: 'luminous intensity of the beam', q: 'luminousint', unit: 'cd', tex: 'I' },
        L: { name: 'luminance of the lamp', q: 'luminance', unit: 'cd/m²', value: 1e7, tex: 'L' },
        A: { name: 'area of the lens seen from the beam direction', q: 'area', unit: 'm²', value: 1.5, tex: 'A' },
        tau: { name: 'transmission of the lens', value: 0.8, min: 0, max: 1, tex: '\\tau' }
      },
      solveFor: 'I',
      note: 'Seen along the beam the whole lens glows with the lamp\'s luminance (reduced by the transmission); intensity is luminance times apparent area.',
      stories: { I: 'A lamp of luminance {L} fills a lens panel of area {A} with a transmission of {tau}. What is the intensity of the beam?' }
    },
    {
      name: 'Duration of a flash',
      expr: 'tf = w*Tr/(2*pi)', tex: 't_{\\mathrm{f}} = \\frac{w\\,T_{\\mathrm{r}}}{2\\pi}',
      vars: {
        tf: { name: 'duration of the flash', q: 'time', unit: 's', tex: 't_{\\mathrm{f}}' },
        w: { name: 'angular width of the beam', q: 'angle', unit: '°', value: 2, min: 0.01, max: 90, tex: 'w' },
        Tr: { name: 'time of one revolution', q: 'time', unit: 's', value: 20, tex: 'T_{\\mathrm{r}}' }
      },
      solveFor: 'tf',
      note: 'The beam passes the observer at an angle rate of one revolution per Tr. The beam\'s brightness peaks in the middle, so the flash looks shorter than this.',
      stories: { tf: 'A beam {w} wide sweeps round once every {Tr}. How long does a flash last for an observer?' }
    }
  ],
  examples: [
    {
      title: 'How wide is the beam?',
      q: 'A lamp 25 mm across stands at the focus of a first-order lens (focal distance 920 mm). How wide is the beam, and how wide if the lens is of the sixth order (150 mm)?',
      steps: [
        { text: 'First order:', tex: '\\theta = \\frac{25}{920} = 0.0272\\ \\mathrm{rad} = 1.56°' },
        { text: 'Sixth order:', tex: '\\theta = \\frac{25}{150} = 0.167\\ \\mathrm{rad} = 9.5°' }
      ],
      a: '1.6° and 9.5°: a smaller lens (shorter focal distance) spreads the light more, which is useful for a short-range light.'
    },
    {
      title: 'How far can it be seen?',
      q: 'A light is 50 m above the sea. A lookout on a ship\'s bridge has the eye 5 m above the water. At what distance does the horizon hide the light (take ordinary refraction, $3.857\\sqrt{h}$ km with $h$ in metres)?',
      steps: [
        'The light\'s own horizon is $3.857\\sqrt{50} = 27.3$ km away and the lookout\'s is $3.857\\sqrt{5} = 8.6$ km.',
        'The light is visible while the two horizons overlap: $27.3 + 8.6 = 35.9$ km, or $35.9/1.852 = 19.4$ nautical miles.'
      ],
      a: 'About 36 km (19 nautical miles), if the haze allows it.'
    }
  ],
  quiz: [
    { q: 'Why does a lighthouse lens have prisms above and below its central lens?', choices: ['To catch the light at large angles and bend it by total internal reflection', 'To colour the light', 'To reduce the weight', 'To make the beam wider'], a: 0, why: 'A refracting facet for light far from the axis would be steep and wasteful. A prism that refracts, reflects totally and refracts again handles it well.' },
    { q: 'The apparent luminance of the lens, seen along the beam, equals that of the lamp (apart from losses).', a: true, why: 'Optics cannot raise the luminance (radiance) of a source. It makes the whole lens glow with it, so the intensity is source luminance × lens area.' },
    { q: 'A lamp 20 mm across stands at the focus of a lens with a focal distance of 500 mm. How wide is the beam, in degrees?', answer: 2.29, unit: '°', why: 'θ = 20/500 = 0.04 rad = 2.29°.' },
    { q: 'A light 20 m high is seen by an eye 4 m high. What is the geographic range, in kilometres (3.857 √h)?', answer: 25, unit: 'km', why: '3.857 (√20 + √4) = 3.857 × (4.47 + 2) = 25.0 km.' },
    { q: 'A carriage with four lens panels turns once in 40 s. How often does an observer see a flash, in seconds?', answer: 10, unit: 's', why: 'Each panel passes every 40 s / 4 = 10 s.' }
  ],
  applications: [
    'Coastal and harbour lights, with lenses of the first to sixth orders, now often replaced by small LED lanterns.',
    'Ship, aircraft and navigation beacons, which use the same Fresnel lens as a compact lantern.',
    'Overhead projectors and traffic signals, where a Fresnel lens collects the lamp\'s light.',
    'Solar collectors and magnifying sheets, which use stepped lenses for the same reason: low weight and low cost.'
  ],
  history: 'Buffon proposed a lens ground in steps in 1748. Augustin Fresnel designed the complete system, with its central lens and catadioptric prisms, in 1822, and the first one was installed at the Cordouan lighthouse in France in 1823. Orders of lens were standardized in the 19th century. Fresnel lenses are still used in lighthouses in many countries.',
  sources: [
    'E. Hecht, *Optics*, 5th ed. (Pearson, 2017) — refraction, prisms and total internal reflection.',
    'W. J. Smith, *Modern Optical Engineering*, 4th ed. (McGraw-Hill, 2008) — Fresnel lenses and collimators.',
    'IALA Recommendation E-200 — marine signal lights: colours, luminous range and notation.'
  ],
  sim: 'es-lighthouse'
},

{
  id: 'night-vision-and-thermal-cameras', parent: 'everyday-optical-systems', title: 'Night-vision and thermal cameras', level: 2,
  short: 'An image intensifier turns scarce visible and near-infrared photons into electrons, multiplies them in a glass plate and turns them back into a green picture. A thermal camera needs no light at all: it images the heat that every object radiates, at 8–14 µm, with a germanium lens and a grid of tiny thermometers.',
  keywords: ['night vision', 'image intensifier', 'photocathode', 'microchannel plate', 'phosphor', 'thermal camera', 'infrared camera', 'microbolometer', 'germanium', 'long-wave infrared', 'NETD', 'emissivity', 'palette', 'IFOV', 'Gen 3'],
  prereq: ['how-to-read-an-optical-system', 'infrared-and-thermal-sensors', 'quantum-efficiency-and-spectral-response'],
  related: ['uv-and-infrared-materials', 'uv-and-infrared-sources', 'sensor-noise', 'how-a-pixel-detects-light', 'light-and-dark-adaptation', 'illuminance-levels-in-practice', 'photon-energy', 'the-optical-spectrum', 'antireflection-coatings', 'camera-families', 'physics:blackbody-radiation'],
  body: `
Two cameras make darkness visible in two different ways. Read them with the five questions of [[how-to-read-an-optical-system]]. **Light:** for the intensifier, starlight and the glow of the night sky, rich in near infrared; for the thermal camera, the heat radiated by the scene itself. **Object and field:** a scene of 10–40° across. **What limits the cone:** a fast objective, f/1.0–f/1.6. **Where it ends up:** a green screen seen through an eyepiece, or an array of microscopic thermometers. **What is worst:** too few photons in the first, tiny temperature differences in the second.

### Following the light: the intensifier
| Part | What it does in plain words | Learn more |
|---|---|---|
| Objective | a fast lens collects as much light as possible | [[the-f-number]] |
| Photocathode | a coating that releases about one electron for every three to five photons, out to 900 nm | [[how-a-pixel-detects-light]], [[photon-energy]] |
| Microchannel plate | a glass disc of millions of tiny channels; each electron hitting a wall frees more, gain 10³–10⁴ | [[sensor-noise]] |
| Phosphor screen | electrons strike it and make a green picture | [[the-luminosity-function]] |
| Eyepiece | a magnifier to look at the screen | [[the-magnifier]] |

### Following the light: the thermal camera
| Part | What it does in plain words | Learn more |
|---|---|---|
| Germanium lens | glass does not pass 8–14 µm; germanium does, with index 4.0 | [[uv-and-infrared-materials]] |
| Coating | germanium reflects 36 % at each uncoated surface | [[antireflection-coatings]] |
| Microbolometer array | each pixel is a tiny thermometer whose resistance changes as it warms | [[infrared-and-thermal-sensors]] |
| Processing | corrects each pixel and maps temperatures to grey or colour | [[camera-families]] |

### Numbers
At starlight (1 mlx on a scene of 20 % reflectance, f/1.4) a 10 µm element of the cathode receives 0.8 photons in 0.1 s; in full moon (0.25 lx), 209. So the starlight picture is a sparse shower of single flashes, and moonlight is clean. A thermal camera sees at 300 K a spectrum that peaks at 9.7 µm (Wien), and in the 8–14 µm band the radiance rises 1.6 % for each kelvin: a person at 33 °C is 22 % brighter than a wall at 20 °C. A pixel of 12 µm behind a 25 mm lens looks at 0.48 mrad: 4.8 cm at 100 m.

### Reading the sheet
"Gen 3, 64 lp/mm, figure of merit 1800" gives the generation of the cathode, the resolution of the tube and its resolution times signal-to-noise. "640 × 480, 12 µm, NETD < 40 mK, 25 mm f/1.0" gives the array, the pixel size, the smallest temperature step it can resolve and the lens.

> [!warn] Image intensifier tubes can be damaged by bright light, and an infrared illuminator strong enough to light a scene can be hazardous to the eye at close range: the eye does not blink at light it cannot see. Follow the maker's rules.

> [!key] An intensifier amplifies scarce photons electronically and shows them in green; a thermal camera images the 8–14 µm heat each object gives off through germanium. An intensifier sees through glass as the eye does; a thermal camera does not.
`,
  ideas: [
    'An intensifier turns photons into electrons, multiplies them in a microchannel plate and turns them back into light on a phosphor.',
    'At starlight a tiny element receives less than one photon in the eye\'s integration time, so the picture is noisy.',
    'Thermal cameras look at 8–14 µm, where objects near 300 K glow most (peak 9.7 µm); they need no illumination.',
    'Germanium passes the long-wave infrared and has index 4.0, so uncoated surfaces reflect 36 % each and a coating is essential.',
    'The signal of a thermal pixel is a tiny temperature change, 1.6 % of the band radiance per kelvin, and noise sets the NETD.'
  ],
  pitfalls: [
    'Night-vision goggles show a picture by heat — A classical intensifier amplifies light (visible and near infrared); only a thermal camera shows heat. The two work on different wavelengths and are sometimes combined.',
    'Thermal cameras see through walls and glass — Glass and walls are opaque at 8–14 µm; the camera shows the surface it faces, including a reflection of heat from smooth surfaces.',
    'A thermal camera measures temperature directly — It measures radiance; the temperature follows only if the emissivity of the surface is known, and shiny metal radiates little.',
    'More gain in the tube makes a cleaner picture — The picture is limited by the photons arriving; gain makes the few of them visible but also amplifies their random arrival.'
  ],
  terms: [
    { term: 'Image intensifier', also: ['image-intensifier tube', 'Gen 2', 'Gen 3'], def: 'A vacuum tube with a photocathode, a microchannel plate and a phosphor screen that turns a very faint image into a visible one; generations differ in the cathode material and coatings.' },
    { term: 'Photocathode', also: ['photoemissive layer'], def: 'A coating that releases an electron when a photon strikes it. Only a fraction of the photons, 25 % or so at best, free an electron.' },
    { term: 'Microchannel plate', also: ['MCP'], def: 'A glass disc pierced by millions of channels 6–12 µm across; an electron entering a channel strikes the wall and releases more, giving a gain of thousands.' },
    { term: 'Phosphor screen', also: ['P43', 'green phosphor'], def: 'The layer at the end of an intensifier that glows where electrons strike it, usually green, the colour where the eye is most sensitive.' },
    { term: 'IFOV', also: ['instantaneous field of view'], def: 'The angle seen by one pixel, the pixel pitch divided by the focal length: 0.48 mrad for 12 µm behind 25 mm.' },
    { term: 'Emissivity', also: ['thermal emissivity'], def: 'The fraction of the radiation of a perfect black body that a surface actually emits at a given temperature; skin and paint are near 0.95, polished metal below 0.1.' }
  ],
  formulas: [
    {
      name: 'Wavelength of peak emission',
      expr: 'lm = bW/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lm: { name: 'wavelength of the peak', q: 'length', unit: 'µm', tex: '\\lambda_{\\max}' },
        bW: { const: 'bW' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 306, min: 1, tex: 'T' }
      },
      solveFor: 'lm',
      note: 'Wien\'s displacement law. Skin at 33 °C peaks near 9.5 µm, in the long-wave band that thermal cameras use.',
      stories: { lm: 'A surface is at {T}. At what wavelength does its radiation peak?', T: 'A surface radiates most strongly at {lm}. What is its temperature?' }
    },
    {
      name: 'Angle seen by one pixel',
      expr: 'ifov = p/f', tex: '\\mathrm{IFOV} = \\frac{p}{f}',
      vars: {
        ifov: { name: 'instantaneous field of view', q: 'angle', unit: 'mrad', tex: '\\mathrm{IFOV}' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 12, tex: 'p' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 25, tex: 'f' }
      },
      solveFor: 'ifov',
      note: 'The size on the scene is the IFOV times the distance: 0.48 mrad is 4.8 cm at 100 m.',
      stories: { ifov: 'A thermal camera has pixels {p} apart behind a lens of focal length {f}. What does one pixel see?', f: 'A pixel of {p} must see {ifov}. What focal length is needed?' }
    },
    {
      name: 'Reflection at an uncoated surface',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n-1}{n+1}\\right)^2',
      vars: {
        R: { name: 'reflectance at normal incidence', q: 'ratio', unit: '%', tex: 'R' },
        n: { name: 'refractive index', value: 4.0, min: 1, max: 5, tex: 'n' }
      },
      solveFor: 'R',
      note: 'For a surface in air at normal incidence. Germanium (n = 4.0) reflects 36 %; two surfaces pass only 41 %.',
      stories: { R: 'A lens material has refractive index {n}. What fraction of the light does an uncoated surface reflect?' }
    }
  ],
  examples: [
    {
      title: 'What does one pixel see?',
      q: 'A thermal camera has 12 µm pixels and a lens of 25 mm focal length. What is the field of view of one pixel, and what size is it at 100 m? What is the horizontal field of a 640-pixel array?',
      steps: [
        { text: 'The IFOV:', tex: '\\mathrm{IFOV} = \\frac{12\\ \\mu\\mathrm{m}}{25\\ \\mathrm{mm}} = 0.48\\ \\mathrm{mrad}' },
        'At 100 m a pixel covers $0.48 \\times 10^{-3} \\times 100\\ \\mathrm{m} = 4.8$ cm.',
        { text: 'The array is 640 × 12 µm = 7.68 mm wide:', tex: '\\mathrm{FOV} = 2\\arctan\\frac{7.68}{2 \\times 25} = 17.5°' }
      ],
      a: '0.48 mrad (4.8 cm at 100 m) and a horizontal field of 17.5°.'
    }
  ],
  quiz: [
    { q: 'Why is a germanium lens uncoated a poor choice for a thermal camera?', choices: ['Each surface reflects 36 % of the light', 'Germanium absorbs all infrared', 'Germanium is transparent only to visible light', 'It has no focusing power'], a: 0, why: 'With n = 4.0 the reflectance is ((4 − 1)/(4 + 1))² = 36 % per surface; two surfaces pass 41 %. Coatings bring the loss down to a few per cent.' },
    { q: 'A thermal camera can see an object behind a window of ordinary glass.', a: false, why: 'Ordinary glass is opaque at 8–14 µm; the camera sees the glass surface itself, and the reflection of heat from the room.' },
    { q: 'At what wavelength, in micrometres, does a surface at 290 K radiate most? (Take b = 2898 µm·K.)', answer: 10, unit: 'µm', why: 'λ = 2898/290 = 9.99 µm.' },
    { q: 'A thermal pixel of 17 µm behind a 9 mm lens has an IFOV of about…', choices: ['1.9 mrad', '0.19 mrad', '19 mrad', '0.019 mrad'], a: 0, why: '17 µm/9 mm = 1.89 × 10⁻³ rad, so 1.9 mrad: 19 cm per pixel at 100 m.' },
    { q: 'At starlight the picture of an image intensifier looks grainy because…', choices: ['Each element receives less than one photon per integration time', 'The phosphor is poor', 'The lens is too slow', 'The tube has no gain'], a: 0, why: 'The photons arrive at random, so with fewer than one per element most elements get none; the counts fluctuate widely (shot noise).' }
  ],
  applications: [
    'Night-time observation, driving aids and wildlife study with intensifier goggles and scopes.',
    'Building inspection, electrical maintenance and firefighting with thermal cameras.',
    'Security and search work, where a thermal camera finds a person by body heat.',
    'Process control, where thermal cameras watch the temperature of furnaces, motors and welds.'
  ],
  history: 'Infrared image converters were developed in the Second World War; the first generations of intensifier tubes followed in the 1960s and the microchannel plate in the 1970s. Uncooled microbolometer cameras became practical in the 1990s and cheap enough for building inspection and phones in the 2010s.',
  sources: [
    'G. C. Holst, *Electro-Optical Imaging System Performance*, 6th ed. (SPIE Press, 2017) — intensifiers, thermal imagers and their noise.',
    'A. Rogalski, *Infrared and Terahertz Detectors*, 3rd ed. (CRC Press, 2019) — microbolometers and other thermal detectors.',
    'M. Vollmer and K.-P. Möllmann, *Infrared Thermal Imaging*, 2nd ed. (Wiley-VCH, 2018) — emissivity, optics and what a thermal camera shows.'
  ],
  sim: 'es-night'
}
);
