/* HYPER-OPTICS · content/camera-basics.js — the topic "The camera" (twelve concepts).
 * The pinhole camera, the parts of a camera, the families of camera, exposure and its triangle, aperture and f-stops,
 * shutters, shutter speed and motion, ISO and gain, metering and exposure value, flash, image stabilization,
 * viewfinders and focusing screens. The numbers come from the engine (exposure values, depth of field, sensor and mount
 * tables); the definition of the f-number lives in content/reference.js (the-f-number).
 */
Hyper.add(

/* ================================================================ the pinhole camera */
{
  id: 'the-pinhole-camera', parent: 'camera-basics', title: 'The pinhole camera', level: 1,
  short: 'A light-tight box with a tiny hole in one wall and film on the opposite wall makes a picture with no lens at all: each point of the scene sends one thin pencil of light through the hole to one spot on the back. The picture is inverted, equally sharp at every distance, and never very sharp: a bigger hole blurs it geometrically, a smaller one by diffraction.',
  keywords: ['pinhole', 'pinhole camera', 'camera obscura', 'lensless camera', 'optimum pinhole diameter', 'diffraction blur', 'geometric blur', 'f/273', 'inverted image', 'Rayleigh', 'eclipse projection', 'zone plate'],
  prereq: ['rays-and-wavefronts', 'shadows-and-the-pinhole', 'the-airy-disk'],
  related: ['how-a-camera-works', 'the-f-number', 'depth-of-field', 'exposure-and-the-exposure-triangle', 'projections:camera-obscura', 'single-slit-diffraction', 'aperture-and-f-stops'],
  body: `
Take a shoe box, paint it black inside, make a hole the size of a needle's eye in one end and tape a sheet of photographic paper to the inside of the other end. Open the hole in sunlight for a few seconds and you have a camera. It has no lens, no focus control and no iris, and it still makes a picture.

### How the picture forms
Every point of a lit scene sends light in all directions. The wall with the hole lets through only a thin pencil from each point, and that pencil lands on one spot of the back wall. A high point lands low and a left point lands right, so the picture is turned through 180°. Similar triangles fix the scale:

$$h' = h\\,\\frac{f}{s}$$

where $h$ is the height of the subject, $s$ its distance from the hole and $f$ the distance from the hole to the back wall. A 1.8 m person 3 m away, photographed with a box 100 mm deep, is 60 mm tall on the paper.

### Two blurs that pull in opposite directions
The hole is not a point, so each scene point lands as a small disc.
- **Geometric blur.** Light from a distant point passes through the whole hole, so the spot is as wide as the hole: $b_g \\approx d$. A smaller hole gives a sharper picture.
- **Diffraction blur.** A hole is also a circular aperture, so the spot cannot be smaller than the [[the-airy-disk|Airy disc]] of diameter $b_d = 2.44\\,\\lambda f/d$ (to the first dark ring). A smaller hole spreads the light *more*.

The two are equal, and their sum is smallest, when $d^2 = 2.44\\,\\lambda f$:

$$d_{\\text{best}} = \\sqrt{2.44\\,\\lambda f}$$

Other criteria move the coefficient between about 1.4 and 2, so take the formula as "about right, within a quarter".

| Hole to film $f$ | Best hole $d$ | f-number $f/d$ | Blur of one point |
|---|---|---|---|
| 25 mm | 0.18 mm | f/136 | 0.26 mm |
| 50 mm | 0.26 mm | f/193 | 0.37 mm |
| 100 mm | 0.37 mm | f/273 | 0.52 mm |
| 200 mm | 0.52 mm | f/386 | 0.73 mm |

(550 nm light; the blur is the two contributions added in quadrature.) At 100 mm the smallest detail it can show is about 5 mm per metre of subject distance. A pinhole picture is always soft; a good lens beats it easily.

### What a pinhole camera does that a lens cannot
- **Everything is equally sharp.** There is nothing to focus: subjects at 30 cm and at 30 m land with the same blur (for close subjects the geometric blur grows slightly, by the factor $1 + f/s$). The price is that nothing is *very* sharp.
- **An enormous field.** A flat back wall can be wide, so angles of view past 120° are easy. Light arriving at the angle $\\theta$ meets a hole that looks narrower by $\\cos\\theta$ and has farther to go, so the edges are dim, falling as $\\cos^4\\theta$.
- **Slow.** At f/273 the hole passes about 1/290 of the light of f/16. Where a lens camera uses 1/125 s in bright sun, the pinhole needs about 2 s on ISO 100 film, and a minute or more on photographic paper rated near ISO 6, plus the extra time film needs at long exposures ([[exposure-and-the-exposure-triangle|reciprocity]]).

> [!warn] Watching an eclipse, project the Sun's image through a pinhole onto a card with your back to the Sun. Never look at the Sun through the hole, and never through a camera, binoculars or telescope without a certified solar filter.

> [!key] A pinhole makes a lensless, inverted, focus-free picture. Its hole must be about $\\sqrt{2.44\\,\\lambda f}$: smaller blurs by diffraction, larger by geometry. That makes it f/150 to f/400, soft and slow.
`,
  ideas: [
    'A small hole lets one thin pencil of rays through from each scene point, so a picture forms with no lens; it is inverted: h′ = h f/s.',
    'A bigger hole blurs the picture by its own width (geometric blur ≈ d).',
    'A smaller hole blurs it by diffraction: the Airy disc is 2.44 λ f/d wide.',
    'The two blurs are equal at d ≈ √(2.44 λ f), which is a hole of 0.2 to 0.5 mm in a box 25 to 200 mm deep: f/130 to f/390.',
    'Depth of field is unlimited and the exposure is long: the price of an f-number in the hundreds.'
  ],
  pitfalls: [
    'A smaller pinhole always gives a sharper picture — Only until diffraction takes over. Below the best diameter the Airy disc grows faster than the hole shrinks, and the picture gets softer again.',
    'A pinhole camera needs a very dark box and a perfectly round hole of exactly the right size — The size is forgiving: the blur changes slowly near the optimum, and a hole 30 % off is hardly noticeable. What matters is a thin edge (foil, not a drilled thick wall) and a light-tight box.',
    'The picture is a mirror image — It is rotated by 180°: upside down and left-right reversed together. A mirror would reverse only one of them.',
    'Pinhole pictures have no distortion and no aberrations, so they are as good as optics gets — Straight lines stay straight, but the resolution is poor and the light is feeble; "no aberrations" is not "sharp".'
  ],
  terms: [
    { term: 'Pinhole camera', also: ['lensless camera', 'camera obscura (with a hole)'], def: 'A camera whose only optical element is a small hole in the front wall. Each scene point sends one thin pencil of light through it, forming an inverted image on the back wall.' },
    { term: 'Camera obscura', also: ['dark chamber'], def: 'A darkened room or box in which a hole (later a lens) throws an inverted image of the outside scene on a wall or screen. The ancestor of the photographic camera.' },
    { term: 'Geometric blur', def: 'The blur of a point caused by the size of the hole: about equal to the hole diameter for a distant subject. It falls as the hole shrinks.' },
    { term: 'Diffraction blur', def: 'The blur caused by the wave nature of light: a hole of diameter d spreads light into an Airy disc 2.44 λ f/d across at distance f. It grows as the hole shrinks.' },
    { term: 'Optimum pinhole diameter', also: ['best pinhole size'], def: 'The hole size at which geometric and diffraction blur are equal, about √(2.44 λ f). Smaller or larger holes give a softer picture.' },
    { term: 'Pinhole f-number', def: 'The distance from hole to film divided by the hole diameter, f/d. Typically between f/130 and f/400, which is why pinhole exposures are long.' }
  ],
  formulas: [
    {
      name: 'Best pinhole diameter',
      expr: 'd = sqrt(2.44*lambda*f)', tex: 'd = \\sqrt{2.44\\,\\lambda\\,f}',
      vars: {
        d: { name: 'diameter of the hole', q: 'length', unit: 'mm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        f: { name: 'distance from hole to film', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Where geometric and diffraction blur are equal, for a distant subject. Other criteria change the coefficient by up to 25 %.',
      stories: { d: 'A pinhole camera is {f} deep and works with light of {lambda}. What hole diameter gives the sharpest picture?', f: 'A pinhole of {d} is used with light of {lambda}. How deep should the box be for the hole to be the best size?' }
    },
    {
      name: 'Diffraction blur of the hole',
      expr: 'b = 2.44*lambda*f/d', tex: 'b_d = \\frac{2.44\\,\\lambda\\,f}{d}',
      vars: {
        b: { name: 'diameter of the Airy disc', q: 'length', unit: 'mm', tex: 'b_d' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        f: { name: 'distance from hole to film', q: 'length', unit: 'mm', value: 100 },
        d: { name: 'diameter of the hole', q: 'length', unit: 'mm', value: 0.2 }
      },
      note: 'To the first dark ring. Compare it with the hole itself, which is the geometric blur.',
      practice: { unknowns: ['b'] }
    },
    {
      name: 'Size of the image',
      expr: 'hi = h*f/s', tex: 'h\' = h\\,\\frac{f}{s}',
      vars: {
        hi: { name: 'height of the image', q: 'length', unit: 'mm', tex: 'h\'' },
        h: { name: 'height of the subject', q: 'length', unit: 'm', value: 1.8 },
        f: { name: 'distance from hole to film', q: 'length', unit: 'mm', value: 100 },
        s: { name: 'distance to the subject', q: 'length', unit: 'm', value: 3 }
      },
      note: 'Similar triangles; the image is inverted. Valid for s much larger than f.',
      stories: { hi: 'A pinhole camera {f} deep photographs a person {h} tall standing {s} away. How tall is the image on the film?' }
    },
    {
      name: 'Pinhole f-number',
      expr: 'N = f/d', tex: 'N = \\frac{f}{d}',
      vars: {
        N: { name: 'f-number of the pinhole' },
        f: { name: 'distance from hole to film', q: 'length', unit: 'mm', value: 100 },
        d: { name: 'diameter of the hole', q: 'length', unit: 'mm', value: 0.37 }
      },
      note: 'The same ratio as for a lens (focal length over aperture); exposure tables written for lenses apply.'
    }
  ],
  examples: [
    {
      title: 'A shoe-box camera',
      q: 'A shoe box is 120 mm deep. What hole diameter is best for green light (550 nm), what is the pinhole f-number, and what is the angular blur?',
      steps: [
        { text: 'The best diameter:', tex: 'd = \\sqrt{2.44 \\times 550\\times10^{-6}\\ \\mathrm{mm} \\times 120\\ \\mathrm{mm}} = \\sqrt{0.161\\ \\mathrm{mm^2}} = 0.40\\ \\mathrm{mm}' },
        { text: 'The f-number:', tex: 'N = \\frac{120}{0.40} = 300' },
        { text: 'Geometric and diffraction blur are each 0.40 mm; added in quadrature they give 0.57 mm. As an angle that is 0.57/120 = 4.7 mrad, about 0.27°.' }
      ],
      a: 'A hole of 0.40 mm, f/300, blur about 0.57 mm on the paper (0.27° of the scene).'
    },
    {
      title: 'How long to expose?',
      q: 'In bright sun a lens camera on ISO 100 film uses f/16 at 1/125 s. How long does a pinhole camera at f/273 need on the same film, ignoring reciprocity failure?',
      steps: [
        'Exposure time goes as the square of the f-number at a given scene brightness: the ratio is $(273/16)^2 = 291$.',
        { text: 'So', tex: 't = \\frac{1}{125}\\ \\mathrm{s} \\times 291 = 2.3\\ \\mathrm{s}' },
        'That is 8.2 stops more than f/16. Film loses sensitivity at exposures of a second or more, so a real exposure is perhaps twice as long, and on photographic paper (ISO near 6) about sixteen times longer again.'
      ],
      a: 'About 2.3 s on ISO 100 film; many seconds to a minute on paper.'
    }
  ],
  quiz: [
    { q: 'You make the hole of a pinhole camera much smaller than the best size. The picture becomes…', choices: ['sharper, because the hole is smaller', 'softer, because diffraction now dominates', 'unchanged', 'brighter'], a: 1, why: 'The geometric blur falls with the hole, but the Airy disc $2.44\\lambda f/d$ grows as $d$ shrinks. Below the best diameter diffraction is the larger of the two. The picture is also dimmer.' },
    { q: 'A pinhole camera forms an image of a distant tree. The tree is in the picture…', choices: ['upright and reversed left to right', 'inverted top to bottom only', 'rotated by 180°: upside down and reversed', 'upright and exact'], a: 2, why: 'The ray through the hole goes straight on, so up goes to down and left to right at once: a rotation by 180°.' },
    { q: 'A pinhole camera keeps near and far objects equally in focus because it has no lens to focus.', a: true, why: 'Nothing depends on the object distance except the small factor $1+f/s$ in the geometric blur. The cost is that nothing is very sharp.' },
    { q: 'What is the best hole diameter, in millimetres, for a pinhole camera 200 mm deep with 550 nm light?', answer: 0.518, unit: 'mm', why: '$d = \\sqrt{2.44 \\times 550\\times10^{-6} \\times 200} = 0.52$ mm, which makes the camera f/386.' },
    { q: 'Why is a pinhole exposure so long?', choices: ['The hole is round, not square', 'The f-number is in the hundreds, so the light on the film is a few thousandths of that at f/2', 'Pinhole pictures need more light to become sharp', 'The image is inverted'], a: 1, why: 'Light on the film goes as $1/N^2$. At f/273 it is about 1/290 of f/16, so the exposure is about 290 times longer than a lens camera needs at f/16.' }
  ],
  applications: [
    'Pinhole photography as an art and a school experiment: a box and photographic paper give soft, wide-angle, endlessly deep pictures with exposures of seconds to minutes.',
    'Eclipse viewing: the gaps between leaves are natural pinholes, and on the ground under a tree they project hundreds of crescent Suns during a partial eclipse.',
    'Imaging with X-rays and gamma rays in plasma physics and nuclear medicine, where no lens works and a small hole or a coded mask in a heavy metal plate forms the image.',
    'The pinhole eye of the nautilus, which has no lens at all: a hole in an eyeball filled with sea water.',
    'Teaching the camera: the geometry of every camera starts from the straight lines through one point that the pinhole makes visible.'
  ],
  history: 'The inverted image of a lit scene seen through a small hole is recorded in Chinese writings attributed to Mozi (about the fifth century BCE) and was analysed by Ibn al-Haytham in Cairo in his Book of Optics, around 1020. Gemma Frisius published a picture of one used to watch the solar eclipse of 1544. Lord Rayleigh worked out the best hole size in 1891, in a paper on pinhole photography.',
  sources: [
    'E. Hecht, *Optics*, ch. 10 (Diffraction) — the Airy pattern of a circular aperture, which sets the diffraction half of the trade-off.',
    'Lord Rayleigh (J. W. Strutt), "On pin-hole photography", *Philosophical Magazine* (1891) — the best size of the hole.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the pinhole as the limiting case of the camera.'
  ],
  sim: 'cb-pinhole'
},

/* ================================================================ how a camera works */
{
  id: 'how-a-camera-works', parent: 'camera-basics', title: 'How a camera works', level: 1,
  short: 'Every camera is the same chain: a lens that forms an image, an iris that sets how much light gets in, a shutter that sets for how long, a sensor (or film) that records it, and a body that holds them at exactly the right distances and carries the electronics, the screen and the battery.',
  keywords: ['camera', 'how a camera works', 'lens', 'aperture', 'diaphragm', 'shutter', 'sensor', 'body', 'flange distance', 'cut-away', 'focus', 'infrared cut filter', 'low-pass filter', 'image processor', 'exposure'],
  prereq: ['the-pinhole-camera', 'focal-length-and-optical-power', 'the-thin-lens-equation'],
  related: ['camera-families', 'exposure-and-the-exposure-triangle', 'aperture-and-f-stops', 'shutter-types', 'lens-mounts-and-flange-distance', 'viewfinders-and-focusing-screens', 'the-interchangeable-lens-camera', 'how-a-pixel-detects-light'],
  body: `
A pinhole camera is slow and soft because the hole is tiny. Replace the hole with a lens and the box collects thousands of times more light and forms a sharp image. Everything else in a camera exists to control that image.

### The chain
| Part | What it does | What it sets | Typical values |
|---|---|---|---|
| **Lens** | gathers light and forms the image | field of view, focus, sharpness | 24 to 600 mm, f/1.2 to f/5.6 |
| **Iris diaphragm** | a ring of blades that opens and closes | the f-number: light, depth of field | f/1.4 to f/22 in whole stops |
| **Shutter** | a gate that opens for a set time | exposure time, motion blur | 30 s to 1/8000 s |
| **Filter stack** | infrared-cut glass and an optical low-pass filter | which wavelengths and detail reach the pixels | 1 to 3 mm of glass |
| **Sensor** | converts the light into charge, then numbers | resolution, noise, dynamic range | 36 × 24 mm, 24 to 60 million pixels, 4 to 6 µm |
| **Processor and memory** | turns raw numbers into a picture and stores it | colour, noise reduction, file | 12 to 16 bits per pixel |
| **Body** | holds the parts, mounts the lens, carries the finder, screen, battery | the flange distance | 18 mm (E) to 46.5 mm (F) |

### From scene to picture
Light from the scene enters the front of the lens; the **iris** (in the middle of the lens, or just behind it) trims the beam to the opening $D$ so that the f-number is $N = f/D$ ([[the-f-number]]); the lens forms an inverted image at the focal plane; the **shutter** lets that image fall on the sensor for the exposure time $t$; the sensor records it. The light that arrives on the sensor, per unit area, is about

$$E = \\frac{\\pi\\,L\\,T}{4N^2}$$

where $L$ is the luminance of the scene and $T$ the transmittance of the lens (0.8 to 0.95). The exposure is $H = E\\,t$.

### Focus
A lens set for infinity puts its image exactly one focal length behind it. For nearer subjects the lens must move away from the sensor, by $x = f^2/(s - f)$: a 50 mm lens focused from infinity to 1 m moves 2.6 mm. Inside a modern lens a small group of elements moves instead, driven by a motor, and the lens barrel keeps its length.

### Distances that must be exact
The lens mount fixes the **flange focal distance**, from the mounting flange to the sensor: 44 mm for the EF bayonet, 46.5 mm for the F, 20 mm for the RF and 18 mm for the E ([[lens-mounts-and-flange-distance]]). A mirrorless body can be thin because it has no mirror box. The sensor sits behind the shutter, a filter stack and its own cover glass, all counted into that distance. A sensor 50 µm out of place makes an f/1.8 lens unable to reach infinity focus.

### What the body adds
A **viewfinder** or screen to find the picture ([[viewfinders-and-focusing-screens]]); a **focus system** that measures distance (phase detection or contrast, see [[autofocus-methods]]); a **battery**, a **card slot**, **connectors** and the buttons that drive the three exposure controls ([[exposure-and-the-exposure-triangle]]).

> [!key] A camera is a lens (image), an iris (how much light), a shutter (how long), a sensor (what is recorded) and a body that holds them at exact distances. The light on the sensor per unit area is $\\pi L T/4N^2$, times the exposure time.
`,
  ideas: [
    'The chain is lens, iris, shutter, sensor: image, amount, time, record.',
    'The iris sets the f-number N = f/D; the light on the sensor goes as 1/N².',
    'Focusing moves the lens away from the sensor by f²/(s − f) for a subject at distance s.',
    'The mount fixes the flange focal distance, and the sensor sits at exactly that distance behind the flange.',
    'The body carries the finder, the focus system, the processor, the battery and the controls.'
  ],
  pitfalls: [
    'The shutter and the aperture do the same job — They both control exposure but with different side effects: the aperture changes depth of field, the shutter changes motion blur. Two stops from either give the same brightness.',
    'The sensor sits right behind the lens — It sits a fixed flange distance behind the mount (18 to 46.5 mm for common mounts), behind a shutter and several millimetres of filter glass, and the lens is built for that exact gap.',
    'Mirrorless cameras have no shutter — Most have a mechanical focal-plane shutter and an electronic one. Dropping the mirror removed the mirror box, not the shutter.',
    'A bigger sensor needs a bigger lens aperture for the same exposure — Exposure depends on the f-number, not on the size of the sensor. A bigger sensor collects more light in total, but the light per square millimetre is the same.'
  ],
  terms: [
    { term: 'Aperture', also: ['iris diaphragm', 'diaphragm', 'aperture stop'], def: 'The adjustable opening, made by a ring of overlapping blades, that sets the diameter of the beam through the lens and so the f-number.' },
    { term: 'Shutter', def: 'The mechanism (or electronic scheme) that determines how long light is allowed to fall on the sensor. Its time is the exposure time.' },
    { term: 'Image sensor', also: ['imager', 'sensor', 'CCD or CMOS chip'], def: 'The array of light-sensitive pixels that turns the image into electrical signals, and so into a digital picture. In a film camera, the film does this job.' },
    { term: 'Flange focal distance', also: ['FFD', 'flange back', 'register'], def: 'The distance from the mounting flange of a lens mount to the image plane. The lens and the body must both be built to the same value.' },
    { term: 'Focal plane', def: 'The plane in which a lens focused at infinity forms its image. The sensor or film lies in it, and so does the focal-plane shutter.' },
    { term: 'Filter stack', also: ['IR-cut filter', 'optical low-pass filter', 'OLPF'], def: 'The glass plates in front of the sensor: one blocks infrared light that silicon would otherwise record; another slightly blurs the image to prevent aliasing against the pixel grid.' }
  ],
  formulas: [
    {
      name: 'Illuminance on the sensor',
      expr: 'E = pi*L*T/(4*N^2)', tex: 'E = \\frac{\\pi\\,L\\,T}{4N^2}',
      vars: {
        E: { name: 'illuminance on the sensor', q: 'illuminance', unit: 'lx' },
        L: { name: 'luminance of the scene', q: 'luminance', unit: 'cd/m²', value: 4096 },
        T: { name: 'transmittance of the lens', q: 'ratio', unit: '%', value: 90, min: 1, max: 100 },
        N: { name: 'f-number', value: 16, min: 0.5, max: 64 }
      },
      note: 'Distant scene on the axis. 4096 cd/m² is a mid-grey subject in full sun.',
      stories: { E: 'A scene of luminance {L} is photographed through a lens of f/{N} that transmits {T}. What illuminance reaches the sensor?' }
    },
    {
      name: 'How far the lens moves to focus',
      expr: 'x = f^2/(s - f)', tex: 'x = \\frac{f^2}{s - f}',
      vars: {
        x: { name: 'lens travel from the infinity position', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        s: { name: 'distance to the subject', q: 'length', unit: 'm', value: 1, min: 0.01, max: 1000 }
      },
      note: 'Thin lens, whole lens moved. Many lenses move an inner group instead; the focusing result is the same.',
      stories: { x: 'A {f} lens is focused from infinity to a subject {s} away. How far does it move?' }
    },
    {
      name: 'Exposure',
      expr: 'H = E*t', tex: 'H = E\\,t',
      vars: {
        H: { name: 'exposure (light per unit area)', q: 'lumexposure', unit: 'lx·s' },
        E: { name: 'illuminance on the sensor', q: 'illuminance', unit: 'lx', value: 11.3 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 7.8 }
      },
      note: 'About 0.09 lx·s makes a mid-grey patch at ISO 100.',
      practice: { unknowns: ['H'] }
    }
  ],
  examples: [
    {
      title: 'Light on the sensor in full sun',
      q: 'A mid-grey subject in full sun has a luminance of 4096 cd/m². The lens is set to f/16 and transmits 90 %. What illuminance falls on the sensor, and what exposure does 1/128 s give?',
      steps: [
        { text: 'The illuminance:', tex: 'E = \\frac{\\pi \\times 4096 \\times 0.90}{4 \\times 16^2} = 11.3\\ \\mathrm{lx}' },
        { text: 'The exposure for 1/128 s:', tex: 'H = 11.3 \\times \\frac{1}{128} = 0.088\\ \\mathrm{lx\\,s}' },
        'That is the exposure for which a camera set to ISO 100 renders mid-grey: the "sunny 16" rule.'
      ],
      a: '11.3 lx on the sensor; 0.088 lx·s with 1/128 s.'
    },
    {
      title: 'Focusing a portrait lens',
      q: 'An 85 mm lens is focused on a face 1.5 m away. How far has the lens moved from its infinity position?',
      steps: [
        { text: 'Apply the focus-travel formula:', tex: 'x = \\frac{85^2}{1500 - 85} = \\frac{7225}{1415} = 5.1\\ \\mathrm{mm}' }
      ],
      a: '5.1 mm (a whole-lens focuser; an internal-focus lens moves a smaller group by a different amount).'
    }
  ],
  quiz: [
    { q: 'Which part of a camera sets the f-number?', choices: ['The shutter', 'The iris diaphragm', 'The sensor', 'The flange'], a: 1, why: 'The iris sets the diameter of the beam, $D$, and so the f-number $N = f/D$. The shutter sets time.' },
    { q: 'Opening the iris by two stops (say from f/8 to f/4) multiplies the light on the sensor by…', choices: ['2', '4', '8', '16'], a: 1, why: 'Each stop is a factor of 2 in light; two stops are 4. In terms of the f-number, $(8/4)^2 = 4$.' },
    { q: 'A 50 mm lens is focused from infinity to 1 m. How far does the lens move away from the sensor, in mm?', answer: 2.63, unit: 'mm', why: '$x = f^2/(s-f) = 2500/950 = 2.63$ mm.' },
    { q: 'A camera body with a 17.7 mm flange focal distance can use a lens designed for a 46.5 mm flange distance with a plain spacer.', a: true, why: 'The adapter makes up the 28.8 mm difference. The reverse is impossible: a lens built for a short flange distance would have to sit inside the body.' },
    { q: 'Two cameras with sensors of different sizes are both set to f/4 and photograph the same scene. The light per square millimetre on their sensors is…', choices: ['greater on the larger sensor', 'greater on the smaller sensor', 'the same', 'zero on the smaller sensor'], a: 2, why: 'Illuminance on the sensor depends on the f-number and the scene, not the sensor size. The larger sensor collects more light in total.' }
  ],
  applications: [
    'Reading a camera: knowing which part controls which side effect (depth of field, motion blur, noise) is the basis of every exposure decision.',
    'Camera design: the flange distance, the filter stack and the shutter all sit in a few tens of millimetres between the lens mount and the sensor.',
    'Machine vision and microscopy: the same chain with the viewfinder and the screen removed and a trigger input added.',
    'Repair and modification: knowing that a sensor must sit within tens of micrometres of the flange distance explains why back-focus adjustment and sensor-shift mechanisms exist.',
    'Smartphones put every part of the chain, including the iris (fixed in most) and a rolling electronic shutter, in a few millimetres.'
  ],
  history: 'The camera obscura with a lens was in use for drawing by the sixteenth century. The first permanent photographs, by Nicéphore Niépce in the 1820s, needed hours of exposure; Daguerre\'s process of 1839 cut that to minutes. Rolled film (Eastman, 1888) made the camera a consumer object. The first digital camera, built at Kodak in 1975, used a CCD of 100 × 100 pixels and took 23 seconds to record a picture.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the camera as an optical instrument.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the camera, shutters, finders and the geometry of exposure.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 (Stops, Apertures, Pupils and Diffraction) — the illuminance on the image plane.'
  ],
  sim: 'cb-cutaway'
},

/* ================================================================ camera families */
{
  id: 'camera-families', parent: 'camera-basics', title: 'Camera families', level: 1,
  short: 'Cameras differ in how you find the picture, how big the sensor or film is, how the lens attaches and what the camera is for. View cameras, rangefinders, twin- and single-lens reflexes, mirrorless, compact, phone, action, cine, instant, industrial, scientific and thermal cameras are answers to those four questions.',
  keywords: ['camera types', 'view camera', 'rangefinder', 'twin-lens reflex', 'TLR', 'SLR', 'DSLR', 'mirrorless', 'compact camera', 'phone camera', 'action camera', 'cine camera', 'instant camera', 'industrial camera', 'scientific camera', 'thermal camera', 'sensor size'],
  prereq: ['how-a-camera-works'],
  related: ['viewfinders-and-focusing-screens', 'sensor-formats-and-pixel-size', 'photographic-lens-mounts', 'the-machine-vision-system', 'infrared-and-thermal-sensors', 'the-phone-camera', 'the-interchangeable-lens-camera', 'projections:tilt-shift-and-view-cameras'],
  body: `
All cameras do the same thing, so what separates them are four choices: **how you see the picture** (viewfinding), **how large the sensor or film is**, **whether and how the lens comes off**, and **what the camera is for**.

| Family | Finding the picture | Sensor or film | Lens | Typical use |
|---|---|---|---|---|
| View camera | ground glass at the film plane, image upside down | sheet film 4 × 5 in (102 × 127 mm) and up | on a board, in its own leaf shutter, on bellows | architecture, studio, landscape |
| Rangefinder | separate window with a focusing patch | 35 mm film or full frame | short bayonet (M, 27.8 mm flange) | street, reportage |
| Twin-lens reflex | ground glass seen from above through a second lens | 6 × 6 cm on 120 film | a matched pair, fixed | portraits, travel (film era) |
| Single-lens reflex | through the taking lens, by mirror and prism | 35 mm film, APS-C, full frame | bayonet (F 46.5 mm, EF 44 mm) | all-round, sport, wildlife |
| Mirrorless | electronic finder or rear screen | 4/3", APS-C, full frame, medium format | short wide bayonet (E 18, Z 16, RF 20 mm) | all-round, video |
| Compact | rear screen, sometimes a finder | 1/2.3" to 1" | fixed zoom or prime | snapshots, travel |
| Phone | the screen | 1/2.55" to about 1/1.3" | several fixed lenses, plastic aspheres | everyday, video |
| Action | screen or none | 1/2.3" typical | fixed, wide, fixed focus, waterproof | sport, helmet and drone |
| Cine | monitor, or reflex finder | Super 35 (24.9 × 18.7 mm) and larger | PL mount (52 mm) | film and television |
| Instant | simple window | integral film, picture about 46 × 62 mm (mini) to 79 × 79 mm | fixed | parties, art |
| Industrial and scientific | none: the image goes to a computer | 1/3" to 1.1", line-scan, cooled sensors | C-mount (17.526 mm), microscope or telescope port | inspection, microscopy, astronomy |
| Thermal | screen | microbolometer, 640 × 480 at 12 µm | germanium lens, about f/1 | buildings, firefighting, night |

### Reading the table
**Viewfinding.** A *reflex* shows the picture through the taking lens by bouncing it off a mirror; a *rangefinder* and a simple window look through a separate hole and so see a slightly different picture (parallax); an *electronic finder* shows the sensor's own image; a *view camera* shows it upside down on the film plane itself. See [[viewfinders-and-focusing-screens]].

**Sensor size** drives almost everything else. A 1/2.3" sensor has 28 mm² and a full-frame sensor 864 mm²: thirty times the area, so thirty times the light collected at the same f-number, and a lens that must be larger for the same field of view. See [[sensor-formats-and-pixel-size]].

**Mount.** A mirror needs room, so SLR flange distances are 44 to 46.5 mm; without one it falls to 16 to 20 mm and the throat can be wider. Industrial cameras use C-mount, whose 17.526 mm distance is as old as 16 mm film ([[c-mount]]).

**Purpose.** Cine cameras shoot continuously with a rotary shutter or a global electronic one; industrial cameras take pictures when a trigger arrives; thermal cameras use a 12 µm pixel because the wavelength is 10 µm, not 0.5.

> [!key] Cameras are distinguished by how the picture is found, how big the sensor is, how the lens attaches and what the camera is for. The sensor is the most telling number: thirty times more area collects thirty times more light at the same f-number.
`,
  ideas: [
    'A camera family is defined by viewfinding, sensor size, lens mount and purpose.',
    'Reflex cameras look through the taking lens; rangefinders and window finders see parallax; electronic finders show the sensor.',
    'Sensor area runs from about 25 mm² (small phone and action sensors) to about 1400 mm² (medium format), a factor of 50.',
    'Mirror boxes make SLR flange distances long (44 to 46.5 mm); mirrorless mounts are short (16 to 20 mm).',
    'Machine-vision, scientific and thermal cameras have no finder: the picture is for a computer.'
  ],
  pitfalls: [
    'More megapixels means a better camera — Pixel count says how finely the image is sampled, not how much light each pixel gets. A full-frame sensor with 24 million pixels collects far more light per pixel than a phone sensor with 50 million.',
    'A mirrorless camera is a small SLR — Without the mirror box, the lens mount can sit 16 to 20 mm from the sensor, which lets lens designers use shorter, wider designs; and adapters let SLR lenses fit with a spacer.',
    'A rangefinder looks through the lens — It looks through a separate window, which is why you see slightly more than the picture will contain and cannot judge depth of field or filters.',
    'A thermal camera is a night-vision camera with a different name — A thermal camera records the heat emitted by surfaces in the 8 to 14 µm band and needs no light at all; image-intensifier night vision amplifies the faint visible and near-infrared light that exists.'
  ],
  terms: [
    { term: 'Single-lens reflex', also: ['SLR', 'DSLR'], def: 'A camera in which a mirror reflects the light from the taking lens up to a focusing screen and a prism, so the photographer sees the picture through the lens. The mirror flips out of the way for the exposure.' },
    { term: 'Mirrorless camera', also: ['compact system camera'], def: 'An interchangeable-lens camera with no reflex mirror; the picture is found on an electronic viewfinder or the rear screen, and the short flange distance allows compact lenses.' },
    { term: 'Rangefinder', def: 'A camera with a separate optical finder whose second image, from a window a few centimetres away, is made to coincide with the first by the focusing ring; the displacement measures distance by triangulation.' },
    { term: 'View camera', also: ['large-format camera'], def: 'A camera with the lens on a front standard and the film on a rear standard joined by bellows; both can tilt and shift, to control perspective and the plane of focus.' },
    { term: 'Sensor format', also: ['sensor size'], def: 'The width and height of the light-sensitive area: for example full frame 36 × 24 mm, APS-C about 23.6 × 15.7 mm, "1 inch" 12.8 × 9.6 mm.' },
    { term: 'Parallax', def: 'The difference between what a separate viewfinder sees and what the taking lens sees, caused by their different positions. It is largest for near subjects.' }
  ],
  formulas: [
    {
      name: 'Area of a sensor',
      expr: 'A = w*h', tex: 'A = w\\,h',
      vars: {
        A: { name: 'sensor area', q: 'area', unit: 'mm²' },
        w: { name: 'width', q: 'length', unit: 'mm', value: 36 },
        h: { name: 'height', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'Full frame is 864 mm²; APS-C 371 mm²; a "1 inch" sensor 123 mm²; a 1/2.3" sensor 28 mm².',
      practice: { unknowns: ['A'] }
    },
    {
      name: 'Light collected relative to a reference sensor',
      expr: 'k = A/A0', tex: 'k = \\frac{A}{A_0}',
      vars: {
        k: { name: 'light gathered, relative to the reference (same f-number, same exposure)' },
        A: { name: 'area of the sensor', q: 'area', unit: 'mm²', value: 864 },
        A0: { name: 'area of the reference sensor', q: 'area', unit: 'mm²', value: 28 }
      },
      note: 'At the same f-number and exposure time, the total light is proportional to the sensor area.',
      stories: { k: 'A sensor of {A} is compared with one of {A0}, both at the same f-number and exposure. How many times more light does the larger one collect in total?' }
    }
  ],
  examples: [
    {
      title: 'Phone against full frame',
      q: 'A phone sensor is 1/1.8" type (7.18 × 5.32 mm); a camera has a full-frame sensor (36 × 24 mm). Both take a picture at f/2.8 with the same exposure time. By how many stops does the full-frame sensor collect more light in total?',
      steps: [
        'Areas: $7.18 \\times 5.32 = 38.2$ mm² and $36 \\times 24 = 864$ mm².',
        { text: 'The ratio is 22.6 times, in stops:', tex: '\\log_2 22.6 = 4.5\\ \\text{stops}' },
        'Per square millimetre the light is identical, so what is gained is total light (less noise), not brightness.'
      ],
      a: '22.6 times, or 4.5 stops more light in total.'
    },
    {
      title: 'Which finder?',
      q: 'A photographer wants to see exactly the depth of field a lens will give, at the taking aperture. Which families can show it, and which cannot?',
      steps: [
        'A reflex finder shows the picture at full aperture and stops down only on a preview button; an electronic finder can show the image at the taking aperture, because it displays what the sensor sees.',
        'A rangefinder, a window finder and a twin-lens reflex see through a different lens from the one that takes the picture: they cannot show depth of field at all.'
      ],
      a: 'Mirrorless (electronic) cameras and view cameras on stopped-down ground glass can; rangefinders and twin-lens reflexes cannot.'
    }
  ],
  quiz: [
    { q: 'Which camera family shows the picture through the taking lens by means of a mirror?', choices: ['Rangefinder', 'Twin-lens reflex', 'Single-lens reflex', 'Compact'], a: 2, why: 'In a single-lens reflex one lens does both jobs: the mirror sends its image to the finder, then flips up for the exposure. A twin-lens reflex uses a second lens for the finder.' },
    { q: 'Why do mirrorless cameras have shorter flange focal distances than SLRs?', choices: ['They have smaller sensors', 'There is no mirror box to make room for', 'They use film', 'Their lenses are longer'], a: 1, why: 'An SLR needs 44 to 46.5 mm for the mirror to swing; without it a mount can sit 16 to 20 mm from the sensor.' },
    { q: 'A full-frame sensor has about thirty times the area of a typical 1/2.3" sensor, so at the same f-number it collects about thirty times more light in total.', a: true, why: 'The light per square millimetre depends only on the f-number; the total light is that times the area.' },
    { q: 'A "1 inch" sensor is 12.8 × 9.6 mm. What is its area, in mm²?', answer: 122.88, unit: 'mm²', why: '$12.8 \\times 9.6 = 122.9$ mm², about one seventh of full frame.' },
    { q: 'A thermal camera has 12 µm pixels because…', choices: ['it needs large pixels to be cheap', 'the light it records has a wavelength near 10 µm, so smaller pixels would add nothing', 'the pixels must hold more electrons', 'it is cooled'], a: 1, why: 'At 8 to 14 µm the wavelength and the Airy disc are 20 times bigger than at 0.55 µm, so a pixel much smaller than 12 µm would only oversample the blur.' }
  ],
  applications: [
    'Choosing a camera: the family decides the finder, the handling, the lens range and the cost long before the specifications do.',
    'Architecture and product photography with view cameras, whose swings and tilts straighten verticals and move the plane of focus ([[projections:tilt-shift-and-view-cameras|tilt and shift]]).',
    'Film and television, where cine cameras take 24 or more frames a second with a mount (PL) that fits a large family of lenses.',
    'Industrial inspection, where C-mount cameras with no finder are triggered by a sensor and read by software ([[the-machine-vision-system]]).',
    'Building thermography and firefighting with microbolometer cameras that need no illumination.'
  ],
  history: 'The single-lens reflex was practical as a hand camera from the 1900s and became the dominant professional camera after the Asahiflex (1952) and the Nikon F (1959) put the pentaprism and an instant-return mirror in a small body. The 35 mm Leica of 1925 came first, with a coupled rangefinder from 1932; the compact digital camera (1990s), the camera phone (about 2000) and the mirrorless interchangeable-lens camera (the first, in 2008) followed.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the lineage of cameras and lenses.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the camera types and their viewfinders.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* — sensor formats and camera classes.'
  ],
  sim: 'cb-families'
},

/* ================================================================ exposure and its triangle */
{
  id: 'exposure-and-the-exposure-triangle', parent: 'camera-basics', title: 'Exposure and the exposure triangle', level: 1,
  short: 'Exposure is the light that reaches each part of the sensor: the illuminance set by the aperture, times the time set by the shutter, then amplified by the sensitivity (ISO). The three settings trade against one another in stops, factors of two, so one correct exposure can be made in many ways, each with its own side effect.',
  keywords: ['exposure', 'exposure triangle', 'stop', 'stops', 'EV', 'exposure value', 'reciprocity', 'reciprocity failure', 'Schwarzschild', 'equivalent exposure', 'overexposure', 'underexposure', 'aperture', 'shutter speed', 'ISO', 'lux seconds'],
  prereq: ['how-a-camera-works', 'the-f-number'],
  related: ['aperture-and-f-stops', 'shutter-speed-and-motion', 'iso-and-gain', 'metering-and-exposure-value', 'shutter-types', 'sensor-noise', 'depth-of-field', 'dynamic-range-and-full-well'],
  body: `
A picture is made by the amount of light that falls on each part of the sensor while the shutter is open. That quantity is the **exposure**, and it is the product of two things:

$$H = E\\,t$$

where $E$ is the illuminance on the sensor, set by the scene and the aperture ($E \\propto 1/N^2$, see [[the-f-number]]) and $t$ is the exposure time. It is measured in lux-seconds. A third control, the **sensitivity** or ISO, does not change the light; it decides how bright the picture looks for a given exposure ([[iso-and-gain]]).

### Stops
Every control is set in **stops**, steps of a factor two in light: one stop longer time, or one stop wider aperture (f-number divided by $\\sqrt2$), or one stop higher ISO. The **exposure value** collects the first two into a single number, with the f-number $N$ and the time $t$ in seconds:

$$\\mathrm{EV} = \\log_2\\frac{N^2}{t}$$

Settings with the same EV give the same exposure. At EV 15, a sunny day, ISO 100:

| Aperture | f/2 | f/2.8 | f/4 | f/5.6 | f/8 | f/11 | f/16 | f/22 |
|---|---|---|---|---|---|---|---|---|
| Time | 1/8000 | 1/4000 | 1/2000 | 1/1000 | 1/500 | 1/250 | 1/125 | 1/60 |

Each step to the right is a stop less aperture and a stop more time. A step in ISO is the third way of buying a stop: ISO 200 lets you use 1/1000 at f/8 under the same sun.

### The triangle
Each corner buys light and costs something.

| Control | Gives light by | Costs |
|---|---|---|
| Aperture | a smaller f-number | depth of field, and sharpness at the edges ([[aperture-and-f-stops]]) |
| Time | a slower shutter | motion blur from the subject and the camera ([[shutter-speed-and-motion]]) |
| ISO | amplifying a dim exposure | noise: fewer photons per pixel ([[sensor-noise]]) |

Choosing a picture is choosing which cost to pay. A landscape pays in time (a tripod and f/11); a sports picture pays in noise (ISO 3200 to hold 1/2000 s at f/4).

### Reciprocity
That time and illuminance trade freely, only the product $H = Et$ counting, is the **reciprocity law** (Bunsen and Roscoe, 1862). A digital sensor obeys it almost exactly. Film does not at the extremes: at long exposures it loses speed (**reciprocity failure**, Schwarzschild's law: the effective exposure goes as $E\\,t^{p}$ with $p$ below 1, typically 0.8 to 0.95), so a 10-second reading may need 15 or 30 seconds, and colour film shifts hue.

### Right and wrong
Too little exposure leaves the shadows in the noise; too much runs the highlights into the sensor's ceiling (**clipping**), where detail is gone for good. There is a range of "correct" exposures about three stops wide for a raw file. How to decide what is right is the subject of [[metering-and-exposure-value]].

> [!key] Exposure $H = Et$ is aperture (through $E$) times time; ISO sets how it is rendered. Everything is counted in stops. $\\mathrm{EV} = \\log_2(N^2/t)$ names the combinations that give the same exposure.
`,
  ideas: [
    'Exposure is illuminance on the sensor times exposure time, H = E t; the aperture sets E (∝ 1/N²) and the shutter sets t.',
    'A stop is a factor 2 in light, whether made with aperture, time or ISO.',
    'EV = log₂(N²/t) names all aperture–time pairs that give the same exposure.',
    'Each corner of the triangle has a price: depth of field, motion blur or noise.',
    'Reciprocity holds for sensors; film fails it at long and very short times.'
  ],
  pitfalls: [
    'ISO is the third way to let in light — ISO lets in nothing. It amplifies what arrived. Only the aperture and the time change the photons collected.',
    'f/8 and 1/500 is a correct exposure — It is correct only for a scene of a certain brightness (at ISO 100, EV 15, sun). For a dim room it is two to eight stops under.',
    'Stops are steps of the f-number — A stop is a factor 2 in light. In f-numbers it is a factor √2: 2, 2.8, 4, 5.6, 8, 11, 16. A step in time is a factor 2 itself.',
    'Long exposures can be calculated by simple scaling for film — Film loses sensitivity at long times, so a calculated 30 seconds may need a minute or more; the table for each film gives the correction.'
  ],
  terms: [
    { term: 'Exposure', also: ['H', 'exposure (lux seconds)'], def: 'The light received per unit area of the sensor: illuminance times exposure time, in lux seconds. It is what the aperture and shutter control together.' },
    { term: 'Stop', also: ['f-stop', 'EV step'], def: 'A factor of two in light. One stop is a doubling of the time, a doubling of ISO or a change of f-number by √2.' },
    { term: 'Exposure value', also: ['EV'], def: 'The number log₂(N²/t), which is the same for every aperture and time that give the same exposure at a given ISO. By convention quoted for ISO 100.' },
    { term: 'Exposure triangle', def: 'The three controls — aperture, time and sensitivity — that together set how bright the picture is, each with its own side effect.' },
    { term: 'Reciprocity law', also: ['Bunsen–Roscoe law'], def: 'The statement that only the product of illuminance and time matters: halving the light and doubling the time leave the exposure unchanged.' },
    { term: 'Reciprocity failure', also: ['Schwarzschild effect'], def: 'The loss of film sensitivity at very long (and very short) exposures, so that the simple product no longer gives the same density.' }
  ],
  formulas: [
    {
      name: 'Exposure value',
      expr: 'EV = log2(N^2/t)', tex: '\\mathrm{EV} = \\log_2\\frac{N^2}{t}',
      vars: {
        EV: { name: 'exposure value (ISO 100)', tex: '\\mathrm{EV}', signed: true },
        N: { name: 'f-number', value: 16, min: 0.5, max: 64 },
        t: { name: 'exposure time', q: 'time', unit: 's', value: 0.008 }
      },
      note: 'Sunny 16 (f/16 at 1/100 s) is EV 14.6. Each unit is one stop.',
      stories: { EV: 'A camera is set to f/{N} and {t}. What is the exposure value?', t: 'What time gives EV {EV} at f/{N}?' }
    },
    {
      name: 'Equivalent aperture for a new time',
      expr: 'N2 = N1*sqrt(t2/t1)', tex: 'N_2 = N_1\\sqrt{\\frac{t_2}{t_1}}',
      vars: {
        N2: { name: 'new f-number', tex: 'N_2' },
        N1: { name: 'first f-number', value: 8, min: 0.5, max: 64, tex: 'N_1' },
        t1: { name: 'first time', q: 'time', unit: 's', value: 0.002, tex: 't_1' },
        t2: { name: 'new time', q: 'time', unit: 's', value: 0.008, tex: 't_2' }
      },
      note: 'Keeps the exposure unchanged: N²/t is constant.',
      stories: { N2: 'A correct exposure is f/{N1} at {t1}. What f-number keeps the exposure the same at {t2}?' }
    },
    {
      name: 'Stops between two exposures',
      expr: 'S = log2(H2/H1)', tex: 'S = \\log_2\\frac{H_2}{H_1}',
      vars: {
        S: { name: 'difference in stops', signed: true },
        H2: { name: 'second exposure', value: 0.35, tex: 'H_2' },
        H1: { name: 'first exposure', value: 0.088, tex: 'H_1' }
      },
      note: 'Positive: the second exposure is brighter by S stops. Exposures in any common unit.',
      practice: { unknowns: ['S'] }
    }
  ],
  examples: [
    {
      title: 'Sunny 16',
      q: 'A photographer on a sunny day uses ISO 200 and f/16. By the sunny-16 rule the time is $1/\\mathrm{ISO}$. What time is that, and what time would give the same exposure at f/5.6?',
      steps: [
        'At f/16 and ISO 200 the rule gives 1/200 s (in practice 1/250).',
        { text: 'Moving from f/16 to f/5.6 is three stops, so the time must be 8 times shorter (checked with the formula):', tex: 't_2 = t_1\\left(\\frac{N_2}{N_1}\\right)^2 = \\frac{1}{200}\\left(\\frac{5.6}{16}\\right)^2 = \\frac{1}{1633}' },
        'The nearest standard time is 1/1600 s.'
      ],
      a: '1/200 s at f/16; 1/1600 s at f/5.6.'
    },
    {
      title: 'Buying a stop with ISO',
      q: 'A scene at EV 12 is photographed at f/4 on ISO 100. The time for a correct exposure is 1/250 s. The photographer wants 1/1000 s to freeze a moving subject, keeping f/4. What ISO is needed?',
      steps: [
        'From 1/250 to 1/1000 is two stops less time.',
        'The two stops of light must come from amplification: ISO 100 × 4 = 400.'
      ],
      a: 'ISO 400, at the price of more noise.'
    }
  ],
  quiz: [
    { q: 'A correct exposure is f/8 at 1/125 s. Which setting gives the same exposure?', choices: ['f/5.6 at 1/250 s', 'f/11 at 1/250 s', 'f/5.6 at 1/60 s', 'f/16 at 1/250 s'], a: 0, why: 'f/5.6 lets in twice the light of f/8; half the time, 1/250 s, restores it. f/11 at 1/250 loses two stops; f/16 at 1/250 loses three.' },
    { q: 'You change from ISO 100 to ISO 400 and keep f/8 and 1/500 s. The picture becomes…', choices: ['two stops brighter', 'two stops darker', 'unchanged', 'sharper'], a: 0, why: 'Each doubling of ISO is a stop of amplification; 400 is two stops above 100. The photons collected are the same; the picture is rendered brighter.' },
    { q: 'EV 15 is the same exposure at f/16 and 1/125 s as at f/8 and 1/500 s.', a: true, why: 'f/16 to f/8 is two stops more light; 1/125 to 1/500 is two stops less time. N²/t is 32 000 in both.' },
    { q: 'What is the exposure value of f/11 at 1/125 s (ISO 100)? Give EV to one decimal.', answer: 13.9, why: '$\\log_2(121 \\times 125) = \\log_2(15\\,125) = 13.9$.' },
    { q: 'A film needs a metered 8 seconds. The film suffers reciprocity failure. The right exposure is…', choices: ['8 s', 'more than 8 s', 'less than 8 s', 'it cannot be exposed'], a: 1, why: 'The film becomes less sensitive at long times, so the product Et underestimates the effective exposure. The manufacturer\'s correction table gives the longer time.' }
  ],
  applications: [
    'Setting a camera: aperture priority, shutter priority and manual mode are three ways of working the same triangle.',
    'Flash photography, where the flash fixes the exposure of the subject through aperture and power and the shutter sets the exposure of the background.',
    'Astro- and night photography, which live at the extreme of the triangle: wide aperture, long time and high ISO all at once.',
    'Cinema, where the shutter is fixed by the frame rate and the exposure is tuned with aperture and neutral-density filters.',
    'Machine vision, where the exposure is set by the strobe or the exposure time, the aperture by depth of field and diffraction, and gain by what is left.'
  ],
  history: 'The reciprocity law was stated for photochemical action by Bunsen and Roscoe in 1862; Karl Schwarzschild, better known as an astronomer, measured its failure on photographic plates in 1900. The exposure value was developed by the shutter maker Friedrich Deckel in the 1950s, so that one number would set aperture and time together.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — exposure, the exposure value and reciprocity.',
    'ISO 2720:1974, *General purpose photographic exposure meters (photoelectric type) — Guide to product specification* — the exposure value and meter constants.',
    'L. Stroebel, J. Compton, I. Current and R. Zakia, *Basic Photographic Materials and Processes* (Focal Press) — reciprocity failure.'
  ],
  sim: 'cb-triangle'
},

/* ================================================================ aperture and f-stops */
{
  id: 'aperture-and-f-stops', parent: 'camera-basics', title: 'Aperture and f-stops', level: 1,
  short: 'The aperture is the adjustable iris of a lens. Opening it up gives more light, a shorter exposure and a more blurred background; closing it down gives deeper focus, until diffraction and the lens itself take over. This is the photographer\'s view of the f-number; its definition and derivations are in the f-number page.',
  keywords: ['aperture', 'f-stop', 'f-stops', 'iris', 'diaphragm', 'blades', 'wide open', 'stopping down', 'fast lens', 'maximum aperture', 'depth of field', 'bokeh', 'sunstar', 'aperture priority', 'sweet spot'],
  prereq: ['the-f-number', 'exposure-and-the-exposure-triangle'],
  related: ['depth-of-field', 'bokeh-and-out-of-focus-blur', 'diffraction-limited-mtf', 'the-airy-disk', 'aperture-stop', 'vignetting', 'how-a-camera-works'],
  body: `
The **aperture** is the hole in the middle of a lens that the iris makes by sliding a ring of five to eleven thin metal blades. Its size is quoted as the f-number $N = f/D$ (see [[the-f-number]] for the definition, the light ($\\propto 1/N^2$) and the diffraction limit). This page is about what the photographer sees when the ring is turned.

### The stops
The full stops are 1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32: each is $\\sqrt2$ times the one before and passes half the light. Cameras click in thirds of a stop: 1, 1.1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8 … The number on the lens name is the *largest* opening: a "50 mm f/1.8" can open to f/1.8 and close to about f/22. A lens that opens to f/2.8 or wider is "fast"; f/1.2 to f/1.4 lenses cost much more because the glass grows rapidly with the diameter.

### What a wider aperture does
- **More light**, so a shorter time or a lower ISO: f/2 to f/8 is four stops, a factor 16.
- **Shallower depth of field.** On full frame, a 50 mm lens focused at 3 m, with a circle of confusion of 0.03 mm:

| Aperture | Sharp from | to | Depth |
|---|---|---|---|
| f/1.8 | 2.82 m | 3.20 m | 0.38 m |
| f/2.8 | 2.73 m | 3.33 m | 0.60 m |
| f/5.6 | 2.50 m | 3.74 m | 1.24 m |
| f/8 | 2.34 m | 4.19 m | 1.85 m |
| f/16 | 1.92 m | 6.92 m | 5.0 m |
| f/22 | 1.69 m | 13.6 m | 11.9 m |

Depth of field roughly doubles for two stops of aperture ([[depth-of-field]]).
- **A softer background.** Out-of-focus points become discs; a point 10 m behind a face focused at 2 m, with an 85 mm lens, is a disc 1.7 mm across at f/1.8 and 0.38 mm at f/8. The *shape* of those discs is the shape of the opening: a polygon with as many sides as blades, or a circle if the blades are rounded ([[bokeh-and-out-of-focus-blur]]).

### What a narrower aperture does
It cuts the light, deepens the focus and hides the lens's flaws: spherical aberration, coma and vignetting at the corners all shrink with the aperture. Most lenses are sharpest two or three stops below the maximum (f/4 to f/8 for a lens that opens to f/1.8). Beyond that **diffraction** grows: the Airy disc is 2.44 λN, 7.5 µm at f/5.6 and 21.5 µm at f/16 in green light, so on a sensor with 4 µm pixels, f/11 is where the picture starts to soften.

### Starbursts
A bright point light through a small, polygonal opening diffracts into spikes at right angles to each blade edge: a lens with an even number of blades makes as many spikes as blades; an odd number makes twice as many.

### Aperture priority
In **aperture-priority** mode you set the f-number and the camera picks the time. It is the mode for controlling depth of field.

> [!key] Wide aperture: light, shallow depth, soft background, flawed corners. Narrow aperture: deep focus, sharp corners, long exposures, and past f/11 diffraction. Most lenses are sharpest two or three stops down.
`,
  ideas: [
    'The full stops (1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22) halve the light each; cameras click in thirds.',
    'A wide aperture gives light and a shallow depth; a narrow one gives depth and long exposures.',
    'Depth of field roughly doubles for two stops of aperture at the same focus distance.',
    'The best sharpness is usually two or three stops below the maximum aperture; beyond about f/11 diffraction softens the picture.',
    'The opening\'s shape appears in out-of-focus highlights and in starbursts.'
  ],
  pitfalls: [
    'A wide aperture always gives a sharper picture because it lets in more light — Light does not sharpen. Wide open, aberrations are at their worst and the depth of field is at its thinnest; the sharpest setting is usually two stops down.',
    'f/22 is the best setting for landscape sharpness — It gives the most depth but also strong diffraction: on a modern sensor f/8 to f/11 is often the better balance. Focus stacking beats a tiny aperture.',
    'The lens\'s name f/1.8 means it always works at f/1.8 — It is the maximum aperture. Most of the time it is stopped down.',
    'Bigger f-numbers are bigger openings — The opposite: the f-number is the focal length divided by the opening, so f/22 is the smallest of the stops here.'
  ],
  terms: [
    { term: 'Aperture', also: ['iris', 'diaphragm', 'lens opening'], def: 'The adjustable opening of a lens, formed by a ring of blades. Its size is specified by the f-number.' },
    { term: 'Maximum aperture', also: ['widest aperture', 'lens speed'], def: 'The smallest f-number a lens can be set to, usually part of its name (f/1.8, f/2.8). A lens with a small maximum f-number is called fast.' },
    { term: 'Stopping down', def: 'Closing the iris to a larger f-number: less light, more depth of field, sharper corners, more diffraction.' },
    { term: 'Aperture priority', also: ['Av', 'A mode'], def: 'An exposure mode in which the photographer sets the f-number and the camera chooses the exposure time to give the right exposure.' },
    { term: 'Sweet spot', def: 'The aperture at which a lens is sharpest: typically two or three stops below its maximum, where aberrations have shrunk but diffraction is still small.' },
    { term: 'Aperture blades', also: ['iris blades'], def: 'The thin overlapping plates that form the opening. Their number and the roundness of their edges set the shape of out-of-focus highlights and of starbursts.' }
  ],
  formulas: [
    {
      name: 'Stops between two apertures',
      expr: 'S = 2*log2(N2/N1)', tex: 'S = 2\\log_2\\frac{N_2}{N_1}',
      vars: {
        S: { name: 'stops of light lost going from the first to the second', signed: true },
        N1: { name: 'first f-number', value: 2, min: 0.5, max: 64, tex: 'N_1' },
        N2: { name: 'second f-number', value: 8, min: 0.5, max: 64, tex: 'N_2' }
      },
      note: 'Positive when the second aperture is smaller (less light).',
      stories: { S: 'A lens is closed from f/{N1} to f/{N2}. By how many stops does the light fall?' }
    },
    {
      name: 'Time that keeps the exposure',
      expr: 't2 = t1*(N2/N1)^2', tex: 't_2 = t_1\\left(\\frac{N_2}{N_1}\\right)^2',
      vars: {
        t2: { name: 'new time', q: 'time', unit: 's', tex: 't_2' },
        t1: { name: 'first time', q: 'time', unit: 's', value: 0.004, tex: 't_1' },
        N1: { name: 'first f-number', value: 4, min: 0.5, max: 64, tex: 'N_1' },
        N2: { name: 'new f-number', value: 11, min: 0.5, max: 64, tex: 'N_2' }
      },
      note: 'The time must grow as N² to keep the same exposure.'
    },
    {
      name: 'Blur disc of a distant point',
      expr: 'b = f^2*(s - sf)/(N*(sf - f)*s)', tex: 'b = \\frac{f^2\\,(s - s_f)}{N\\,(s_f - f)\\,s}',
      vars: {
        b: { name: 'diameter of the blur disc on the sensor', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 85 },
        s: { name: 'distance of the point (beyond the focus)', q: 'length', unit: 'm', value: 10 },
        sf: { name: 'distance focused on', q: 'length', unit: 'm', value: 2, tex: 's_f' },
        N: { name: 'f-number', value: 1.8, min: 0.5, max: 64 }
      },
      note: 'Thin lens, point beyond the focused distance. The disc has the shape of the aperture.',
      stories: { b: 'An {f} lens at f/{N} is focused on a face {sf} away. How wide is the blur disc of a lamp {s} away, on the sensor?' }
    }
  ],
  examples: [
    {
      title: 'Portrait against a distant background',
      q: 'An 85 mm lens is focused on a face 2 m away. How large is the blur disc on the sensor of a street lamp 10 m away at f/1.8, and at f/8? Compare it with the 36 mm width of a full-frame sensor.',
      steps: [
        { text: 'At f/1.8:', tex: 'b = \\frac{85^2 \\times (10\\,000 - 2000)}{1.8 \\times (2000 - 85) \\times 10\\,000} = 1.68\\ \\mathrm{mm}' },
        { text: 'The blur scales as $1/N$, so at f/8 it is smaller by $1.8/8$:', tex: 'b = 1.68 \\times \\frac{1.8}{8} = 0.38\\ \\mathrm{mm}' },
        'As a fraction of the 36 mm width: 4.7 % and 1.0 %.'
      ],
      a: '1.7 mm (about 1/21 of the frame width) at f/1.8; 0.38 mm at f/8.'
    },
    {
      title: 'Keeping the exposure',
      q: 'A scene is correctly exposed at f/2.8 and 1/500 s. For more depth of field you close to f/11. What time keeps the exposure?',
      steps: [
        'From f/2.8 to f/11 is four stops: the time must grow by $2^4 = 16$.',
        { text: 'Check with the formula (N = 11 and 2.8 are rounded values of 11.3 and 2.83):', tex: 't_2 = \\frac{1}{500}\\left(\\frac{11}{2.8}\\right)^2 = \\frac{1}{32}\\ \\mathrm{s}' }
      ],
      a: '1/32 s (in practice 1/30). Handheld, that may now need stabilization or a higher ISO.'
    }
  ],
  quiz: [
    { q: 'Which of these is the largest opening?', choices: ['f/16', 'f/8', 'f/2.8', 'f/22'], a: 2, why: 'The f-number is focal length divided by diameter: the smaller the number, the larger the opening.' },
    { q: 'A photographer closes the aperture from f/4 to f/8. By how many stops does the light fall?', choices: ['one', 'two', 'three', 'four'], a: 1, why: 'f/4 → f/5.6 → f/8: two full stops, a factor 4 in light.' },
    { q: 'On a camera that stops down to f/32, the sharpest results for most lenses are found at that setting.', a: false, why: 'At f/32 diffraction (an Airy disc of 43 µm in green light) blurs the picture far more than the pixels. Most lenses are sharpest at f/4 to f/8.' },
    { q: 'A lens of 100 mm focal length is set to f/4. What is its opening in mm?', answer: 25, unit: 'mm', why: '$D = f/N = 100/4 = 25$ mm.' },
    { q: 'A lens with seven straight blades is stopped down and used on a bright street lamp at night. The out-of-focus lamps appear as…', choices: ['circles', 'seven-sided polygons', 'diamonds', 'stars with 14 spikes'], a: 1, why: 'A blur disc is an image of the opening, so its shape is a heptagon. The sharp lamps would show spikes (14 for an odd blade count), not the blurred ones.' }
  ],
  applications: [
    'Portraits and wildlife, where a wide aperture isolates the subject against a smooth background.',
    'Landscape and architecture, where f/8 to f/11 gives depth with little diffraction.',
    'Low-light work, where a lens that opens to f/1.4 gives four stops over one at f/5.6.',
    'Video, where the aperture is the main control of depth of field because the shutter time is fixed by the frame rate.',
    'Lens choice: the maximum aperture is the headline of the specification and the biggest factor in price and size.'
  ],
  history: 'Early lenses were fitted with Waterhouse stops, thin brass plates with round holes slotted in front of the lens (1858). The iris diaphragm of overlapping blades followed in the 1860s. The f/ numbering was proposed in 1867 by Thomas Sutton and George Dawson, and the full-stop series of the powers of √2 became general practice by about 1900.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — aperture, the stop series, depth of field and diffraction in photography.',
    'R. Kingslake, *Lens Design Fundamentals* (Academic Press) — the stop, vignetting and the effect of aperture on aberrations.',
    'ISO 517:2008, *Photography — Apertures and related properties pertaining to photographic lenses* — the standard series and its marking.'
  ],
  sim: 'cb-aperture'
},

/* ================================================================ shutters */
{
  id: 'shutter-types', parent: 'camera-basics', title: 'Shutters: leaf, focal-plane, electronic', level: 2,
  short: 'A shutter decides how long light falls on the sensor. Leaf shutters sit in the lens and flash at any speed; focal-plane shutters are two curtains just in front of the sensor, which at short times make a travelling slit; cine cameras use a rotating disc; electronic shutters have no moving parts; liquid-crystal and Pockels-cell shutters reach microseconds and nanoseconds.',
  keywords: ['shutter', 'leaf shutter', 'focal-plane shutter', 'curtain', 'flash sync', 'X-sync', 'rotary shutter', 'shutter angle', '180 degree rule', 'electronic shutter', 'global shutter', 'rolling shutter', 'Pockels cell', 'liquid crystal shutter', 'curtain travel time', 'slit'],
  prereq: ['how-a-camera-works', 'exposure-and-the-exposure-triangle'],
  related: ['shutter-speed-and-motion', 'flash-and-strobe', 'rolling-and-global-shutter', 'cmos-sensors', 'camera-artefacts-as-illusions', 'triggering-and-strobing', 'optical-isolators-and-modulators'],
  body: `
A **shutter** is a gate: it is closed until the exposure begins, open for a time $t$ and closed again. Cameras use five kinds, and the differences matter most in two situations: flash, and fast-moving subjects.

| Type | Where | Fastest time | Flash | Typical use |
|---|---|---|---|---|
| Leaf | in the lens, at the iris | 1/500 to 1/1000 s | at every speed | view and medium-format lenses, compacts |
| Focal-plane (mechanical) | just in front of the sensor | 1/4000 to 1/8000 s | up to 1/125 to 1/250 s | SLR and mirrorless cameras |
| Rotary disc | in front of the film gate | set by angle and frame rate | n/a | film cine cameras |
| Electronic | the sensor itself | 1/32 000 s and shorter | limited (rolling) or any (global) | silent modes, phones, video |
| Liquid crystal, Pockels cell | a polarizing cell | microseconds to nanoseconds | any | instruments, gated imaging |

### Leaf shutters
Several thin blades open from the centre, stay open and close again, like a second iris. The whole frame is exposed at once and for the same time, so a flash can fire at any time while it is fully open. Each blade has to move quickly, which limits the speed (about 1/500 s), and every lens needs its own.

### Focal-plane shutters
Two curtains of metal blades or fabric travel across the frame, usually from top to bottom: the first uncovers the sensor and, after the delay $t$, the second covers it. If $t$ is longer than the **curtain travel time** $T_c$ (about 3 to 4 ms), the whole frame is uncovered for an instant. If it is shorter, the second curtain starts before the first has finished: a **slit** of width

$$w = H\\,\\frac{t}{T_c}$$

sweeps across the frame, where $H$ is the frame height (24 mm). At 1/8000 s with $T_c = 3$ ms, $w$ is 1 mm. Each row is still exposed for exactly $t$, but the rows are exposed *at different moments*. Two consequences: a fast subject is skewed (a car at 30 m/s moves $v\\,T_c = 90$ mm between the top and bottom rows), and flash must fire when the whole frame is open, which limits the **flash-sync speed** to about $1/T_c$: 1/125 to 1/250 s on most cameras ([[flash-and-strobe]]).

### Rotary disc shutters
A cine camera spins a disc with a sector cut out, once per frame. The exposure time is $t = \\theta/(360°\\,r)$, with $\\theta$ the opening angle and $r$ the frame rate. A **180° shutter** at 24 frames/s is 1/48 s, the classic film look ([[shutter-speed-and-motion]]); the film must be pulled down to the next frame while the disc is closed, so film cameras cannot go much above 200°.

### Electronic shutters
The sensor starts and stops its own exposure. A **rolling** shutter does it row by row (cheap, silent, but skews moving subjects and bands under flickering light); a **global** shutter does all pixels at once (no skew, flash at any time, but more complex pixels). See [[rolling-and-global-shutter]].

### Liquid crystal and Pockels cells
A cell between polarizers rotates the plane of polarization when a voltage is applied. A liquid-crystal cell does it in tens of microseconds to milliseconds; a Pockels cell in nanoseconds. No moving parts, but half the light is lost to the polarizer.

> [!key] Leaf shutters expose the whole frame at once; focal-plane shutters make a slit that sweeps at short times, limiting flash sync to about $1/T_c$; disc shutters give $t = \\theta/(360°\\,r)$; electronic shutters are rolling or global.
`,
  ideas: [
    'Leaf shutters sit in the lens, expose the whole frame at once and sync flash at every speed, but top out near 1/500 s.',
    'A focal-plane shutter is two curtains; at times shorter than the curtain travel time a slit of width H t/T_c sweeps across the frame.',
    'The travelling slit skews fast subjects and limits flash sync to about 1/T_c (1/125 to 1/250 s).',
    'A rotary disc shutter gives t = θ/(360° × frame rate): 1/48 s for a 180° shutter at 24 fps.',
    'Electronic shutters are silent and can be very fast; a rolling one skews, a global one does not.'
  ],
  pitfalls: [
    'At 1/8000 s the sensor is exposed for 1/8000 s all at once — Each row is exposed for 1/8000 s, but through a slit that crosses the frame in several milliseconds. The rows are exposed at different times, which is why fast subjects are skewed.',
    'A leaf shutter is better because it syncs flash at every speed — It does, but it is slower (about 1/500 s) and must be built into each lens, which makes lenses heavier and dearer.',
    'A 180° shutter means the shutter is open for half a second — It means the disc is open for half of each frame period: at 24 fps, half of 1/24 s, which is 1/48 s.',
    'An electronic shutter has no drawbacks — A rolling electronic shutter skews moving subjects and bands under flickering LED or fluorescent light; it also cannot use most flashes.'
  ],
  terms: [
    { term: 'Leaf shutter', also: ['between-the-lens shutter'], def: 'A shutter made of thin overlapping blades inside the lens, opening from the centre. The whole frame is exposed at once, so flash can sync at any speed.' },
    { term: 'Focal-plane shutter', also: ['curtain shutter'], def: 'A shutter of two curtains just in front of the sensor. The first uncovers it and the second covers it again after the exposure time; at short times they form a travelling slit.' },
    { term: 'Flash-sync speed', also: ['X-sync', 'synchronization speed'], def: 'The fastest shutter time at which the whole frame is uncovered at the moment the flash fires: about the reciprocal of the curtain travel time, typically 1/125 to 1/250 s.' },
    { term: 'Shutter angle', also: ['opening angle'], def: 'The angle of the open sector of a rotary shutter. The exposure time is the angle over 360° divided by the frame rate.' },
    { term: 'Rolling shutter', def: 'An electronic scheme in which rows of the sensor are exposed one after another, so moving subjects are skewed.' },
    { term: 'Global shutter', def: 'An electronic scheme in which every pixel starts and stops exposure at the same moment, so there is no skew.' }
  ],
  formulas: [
    {
      name: 'Width of the slit',
      expr: 'w = H*t/Tc', tex: 'w = H\\,\\frac{t}{T_c}',
      vars: {
        w: { name: 'slit width', q: 'length', unit: 'mm' },
        H: { name: 'frame height', q: 'length', unit: 'mm', value: 24 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 0.125 },
        Tc: { name: 'curtain travel time', q: 'time', unit: 'ms', value: 3, tex: 'T_c' }
      },
      note: 'For t shorter than the curtain travel time. For longer times the whole frame is open at once.',
      stories: { w: 'A focal-plane shutter with a curtain travel time of {Tc} crosses a {H} frame. At an exposure time of {t}, how wide is the slit?' }
    },
    {
      name: 'Shutter angle and exposure time',
      expr: 't = a/(2*pi*r)', tex: 't = \\frac{\\theta}{2\\pi\\,r}',
      vars: {
        t: { name: 'exposure time', q: 'time', unit: 's' },
        a: { name: 'opening angle of the disc', q: 'angle', unit: '°', value: 180, min: 1, max: 360, tex: '\\theta' },
        r: { name: 'frame rate', q: 'frequency', unit: 'Hz', value: 24 }
      },
      note: '180° at 24 frames per second gives 1/48 s.',
      stories: { t: 'A cine camera runs at {r} with a disc opening of {a}. What is the exposure time?' }
    },
    {
      name: 'Skew of a fast subject',
      expr: 'x = v*Tc', tex: 'x = v\\,T_c',
      vars: {
        x: { name: 'displacement between the first and the last row', q: 'length', unit: 'mm' },
        v: { name: 'speed of the subject across the frame', q: 'speed', unit: 'm/s', value: 30 },
        Tc: { name: 'curtain travel time', q: 'time', unit: 'ms', value: 3, tex: 'T_c' }
      },
      note: 'In the scene, not on the sensor; multiply by the magnification for the picture.',
      practice: { unknowns: ['x'] }
    }
  ],
  examples: [
    {
      title: 'A slit of one millimetre',
      q: 'A camera has a focal-plane shutter with curtain travel time 3 ms and a 24 mm frame height. What is the slit width at 1/4000 s and at 1/8000 s, and what is the fastest time at which the whole frame is open?',
      steps: [
        { text: 'At 1/4000 s = 0.25 ms:', tex: 'w = 24 \\times \\frac{0.25}{3} = 2.0\\ \\mathrm{mm}' },
        { text: 'At 1/8000 s = 0.125 ms:', tex: 'w = 24 \\times \\frac{0.125}{3} = 1.0\\ \\mathrm{mm}' },
        'The whole frame is open when $t \\ge T_c = 3$ ms, so at 1/300 s or slower; the nearest standard flash-sync speed is 1/250 s.'
      ],
      a: '2 mm at 1/4000 s; 1 mm at 1/8000 s; flash sync at 1/250 s or slower.'
    },
    {
      title: 'A cine exposure',
      q: 'A film camera running at 24 frames/s has a 172.8° shutter. What is the exposure time, and how many stops less light does it pass than a 360° shutter?',
      steps: [
        { text: 'The time:', tex: 't = \\frac{172.8}{360 \\times 24} = \\frac{1}{50}\\ \\mathrm{s}' },
        'The fraction of the period that the disc is open is $172.8/360 = 0.48$, which is $\\log_2 (1/0.48) = 1.06$ stops down on 360°.'
      ],
      a: '1/50 s, one stop less than 360°. The 172.8° setting is chosen because 1/50 s is a whole number of periods of 50 Hz mains lighting, which keeps flicker out of the picture.'
    }
  ],
  quiz: [
    { q: 'Why can a leaf shutter synchronize with flash at every speed?', choices: ['It is faster than any flash', 'The whole frame is exposed at once, whatever the time', 'It makes the flash longer', 'It has no blades'], a: 1, why: 'The blades open fully, uncovering the entire frame at once; a flash fired while they are open lights it all. A focal-plane shutter at short times is a slit.' },
    { q: 'A focal-plane shutter with a curtain travel time of 4 ms has a flash-sync speed of about…', choices: ['1/60 s', '1/250 s', '1/1000 s', '1/8000 s'], a: 1, why: '$1/T_c = 250$ per second; at that time or slower the frame is uncovered at once.' },
    { q: 'At 1/8000 s with a focal-plane shutter, each row of the sensor is exposed for 1/8000 s, but rows at the top and bottom are exposed several milliseconds apart.', a: true, why: 'The slit sweeps across the frame at the curtain speed, taking $T_c$ to go from the first row to the last.' },
    { q: 'A cine camera at 24 frames per second has a 90° shutter. What is the exposure time, as a fraction 1/x? Give x.', answer: 96, why: '$t = 90/(360 \\times 24) = 1/96$ s.' },
    { q: 'A rolling electronic shutter photographs a propeller. The blades appear…', choices: ['frozen and straight', 'bent or skewed', 'invisible', 'doubled'], a: 1, why: 'Rows are exposed one after another, so a moving blade is in a different place for each row; the result is bent or skewed.' }
  ],
  applications: [
    'Studio and fill flash with leaf shutters, which synchronize at 1/500 s and so allow flash to balance bright sun.',
    'Sports photography with focal-plane shutters at 1/4000 to 1/8000 s, accepting a skew that is small compared with the picture.',
    'Cinema: the shutter angle sets the look of motion, from the smooth 180° blur to the staccato of 45° battle scenes.',
    'Silent shooting at concerts and in nature, with an electronic shutter.',
    'Gated imaging and ultrafast photography with Pockels cells and image-intensifier gating, with exposures of nanoseconds.'
  ],
  history: 'The first photographs needed minutes, and the lens cap was the shutter. The focal-plane shutters of Ottomar Anschütz in the 1880s reached 1/1000 s; leaf shutters followed in the 1890s, and the Compur (Deckel, 1912) set the standard series of speeds. Mechanical focal-plane shutters of 35 mm cameras reached 1/2000 s in the 1970s and 1/8000 s by the late 1980s.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — shutter types, efficiency and flash synchronization.',
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press) — leaf and focal-plane shutters.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* — rolling and global electronic shutters.'
  ],
  sim: ['cb-focalplane', 'cb-disc']
},

/* ================================================================ shutter speed and motion */
{
  id: 'shutter-speed-and-motion', parent: 'camera-basics', title: 'Shutter speed and motion', level: 1,
  short: 'The exposure time decides how motion is recorded. A subject that moves a distance v·t during the exposure is smeared by v·t·m on the sensor; a shake of the camera smears everything by f·ω·t. Short times freeze, long times blur, and panning keeps the subject sharp while the world streaks.',
  keywords: ['shutter speed', 'motion blur', 'freezing motion', 'camera shake', '1/focal length rule', 'panning', 'long exposure', 'star trails', '500 rule', 'blur in pixels', 'handheld', 'exposure time', 'slow shutter'],
  prereq: ['exposure-and-the-exposure-triangle', 'shutter-types'],
  related: ['image-stabilization', 'triggering-and-strobing', 'flash-and-strobe', 'magnification-and-working-distance', 'pixels-per-feature', 'neutral-density-and-optical-density'],
  body: `
Whatever moves during the exposure is recorded as a streak. The streak has two possible causes: the subject moves, or the camera does.

### A moving subject
A subject moving at speed $v$ travels $v\\,t$ during the exposure $t$. The lens reduces that by the magnification $m$, so the streak on the sensor is

$$b = v\\,t\\,m$$

Whether that matters depends on the pixels it crosses. With a 100 mm lens focused at 20 m the magnification is 0.005; on 4 µm pixels:

| Subject | Speed | 1/125 s | 1/500 s | 1/2000 s |
|---|---|---|---|---|
| Walking | 1.4 m/s | 14 px | 3.5 px | 0.9 px |
| Running | 4 m/s | 40 px | 10 px | 2.5 px |
| Car at 50 km/h | 13.9 m/s | 140 px | 35 px | 8.7 px |
| Ball in flight | 30 m/s | 300 px | 75 px | 19 px |

(Subject crossing the frame at right angles.) "Frozen" means a blur of one or two pixels, which on a high-resolution sensor takes more than the old rules suggest. A subject coming straight at the camera or moving along the line of sight barely changes size during the exposure, so it freezes much more easily than one crossing the frame.

### A moving camera
A camera held in the hand turns slightly, at an angular velocity $\\omega$. Everything in the picture smears by

$$b = f\\,\\omega\\,t$$

which grows with the focal length. The old **rule of thumb**: do not use a time longer than $1/f_{eq}$ seconds, with $f_{eq}$ the focal length in millimetres on the 35 mm scale (50 mm: 1/50 s; 200 mm: 1/200 s). It corresponds to assuming that the camera turns at about 0.8° per second, which blurs a point by about 14 µm on full frame, half the usual 0.03 mm criterion; it is only a guide, and the 40-megapixel sensors of today want half that time ([[image-stabilization]]).

### Panning
To photograph a moving subject sharply against a blurred background, **pan**: turn the camera to follow the subject through the exposure. The subject is then stationary relative to the sensor and sharp; the background moves across the frame at the full angular speed of the subject and is smeared into streaks. Speed and sharpness are traded: 1/30 to 1/125 s gives clear streaks.

### Blur on purpose
- **Water and clouds**: 1/4 s to some seconds, on a tripod; a neutral-density filter ([[neutral-density-and-optical-density]]) lets you reach it in daylight.
- **Light trails**: seconds to minutes, as cars pass.
- **Star trails**: the sky turns by 15° per hour; stars stay points only if $t \\lesssim 500/f_{eq}$ seconds (the "500 rule": 20 s at 24 mm), a rule that is optimistic for modern pixels.

### Moving lights
A flash is brief (about 1/1000 s down to 1/30 000 s), so it can freeze a subject that the shutter would blur; the picture then has the sharp flash image on top of a blurred ambient streak (**ghosting**, [[flash-and-strobe]]).

> [!key] Subject blur is $b = v\\,t\\,m$ and shake blur is $b = f\\,\\omega\\,t$. Freeze with a time shorter than the blur you can accept divided by $vm$; hold the camera at about $1/f_{eq}$ s or faster; pan to keep the subject sharp.
`,
  ideas: [
    'A subject at speed v is smeared by v t during the exposure and by v t m on the sensor.',
    'Freezing is relative to the pixels: a blur of one or two pixels counts as frozen.',
    'Camera shake smears by f ω t, so longer lenses need shorter times: the 1/focal-length rule.',
    'Panning follows the subject, so the subject is sharp and the background streaks.',
    'Long times are used on purpose for water, light trails and stars.'
  ],
  pitfalls: [
    '1/1000 s freezes anything — It depends on the speed, the distance and the pixels: a car at 50 km/h filling a 100 mm frame at 20 m still smears 35 pixels at 1/500 s.',
    'The 1/focal-length rule works for every camera — It is for the 35 mm scale (a 50 mm lens on APS-C is 75 mm equivalent) and for a certain sensor resolution; dense sensors and shaky hands need a time two to four times shorter.',
    'A faster shutter always means a sharper picture — A faster shutter reduces motion blur only; the picture can be soft from focus errors, aberrations, diffraction or the subject itself.',
    'A subject at 90° blurs the same as one coming towards the camera — A subject crossing the frame blurs at its full speed; one moving along the line of sight barely changes the image during the exposure.'
  ],
  terms: [
    { term: 'Motion blur', def: 'The smearing of an image caused by the subject (or camera) moving during the exposure. Its length on the sensor is the movement of the image in that time.' },
    { term: '1/focal-length rule', also: ['reciprocal rule'], def: 'A rule of thumb for handheld shooting: use an exposure time no longer than one over the 35 mm-equivalent focal length in seconds.' },
    { term: 'Panning', def: 'Turning the camera to follow a moving subject through the exposure, so that the subject is sharp and the background is streaked.' },
    { term: 'Freezing motion', def: 'Using an exposure so short (or a flash so brief) that the movement during it is below the blur one accepts.' },
    { term: 'Long exposure', def: 'An exposure of a fraction of a second to minutes, on a tripod, so that moving things blur on purpose.' },
    { term: 'Ghosting', def: 'A picture in which a sharp flash image sits on top of a blurred streak from the ambient light during a long shutter time.' }
  ],
  formulas: [
    {
      name: 'Blur of a moving subject on the sensor',
      expr: 'b = v*t*m', tex: 'b = v\\,t\\,m',
      vars: {
        b: { name: 'length of the streak on the sensor', q: 'length', unit: 'µm' },
        v: { name: 'speed of the subject across the field', q: 'speed', unit: 'm/s', value: 13.9 },
        t: { name: 'exposure time', q: 'time', unit: 's', value: 0.002 },
        m: { name: 'magnification (image size over object size)', value: 0.005, min: 0.00001, max: 2 }
      },
      note: 'Across the field of view. Divide by the pixel pitch for the blur in pixels.',
      stories: { b: 'A car at {v} is photographed at magnification {m} with an exposure of {t}. How long is the streak on the sensor?', t: 'A subject moving at {v} is photographed at magnification {m}. What exposure time keeps the streak down to {b}?' }
    },
    {
      name: 'Blur from camera shake',
      expr: 'b = f*w*t', tex: 'b = f\\,\\omega\\,t',
      vars: {
        b: { name: 'blur on the sensor', q: 'length', unit: 'µm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        w: { name: 'angular speed of the camera', q: 'angvel', unit: '°/s', value: 0.8, tex: '\\omega' },
        t: { name: 'exposure time', q: 'time', unit: 's', value: 0.01 }
      },
      note: 'Small angles, one axis. 0.8°/s is a typical figure behind the 1/focal-length rule.',
      stories: { b: 'A {f} lens is held so that the camera turns at {w}. At {t}, how large is the blur on the sensor?' }
    },
    {
      name: 'The 1/focal-length rule',
      expr: 'tmax = 1/fe', tex: 't_{\\max} = \\frac{1}{f_{e}}',
      vars: {
        tmax: { name: 'longest handheld time', q: 'time', unit: 's', tex: 't_{\\max}' },
        fe: { name: 'focal length on the 35 mm scale, in millimetres', q: false, unit: 'mm', value: 100, tex: 'f_{e}' }
      },
      note: 'A rule of thumb, not a law: halve the time for dense sensors, add stops for stabilization.',
      practice: { unknowns: ['tmax'] }
    }
  ],
  examples: [
    {
      title: 'Freezing a cyclist',
      q: 'A cyclist rides at 10 m/s across the frame, 15 m away. A 200 mm lens and a sensor with 4 µm pixels are used. What exposure time keeps the blur under 2 pixels?',
      steps: [
        { text: 'The magnification:', tex: 'm = \\frac{f}{s - f} = \\frac{200}{15000 - 200} = 0.0135' },
        { text: 'A blur of 2 pixels is 8 µm, so', tex: 't = \\frac{b}{v\\,m} = \\frac{8\\times10^{-6}\\ \\mathrm{m}}{10 \\times 0.0135\\ \\mathrm{m/s}} = 5.9\\times10^{-5}\\ \\mathrm{s} \\approx \\frac{1}{17\\,000}\\ \\mathrm{s}' },
        'Faster than any shutter: a larger blur must be accepted (about 1/2000 s gives 17 pixels), or a flash or a lower resolution used.'
      ],
      a: 'About 1/17 000 s. In practice 1/2000 to 1/4000 s, with the blur of tens of pixels invisible at normal viewing sizes.'
    },
    {
      title: 'Handheld at 300 mm',
      q: 'A photographer uses a 300 mm lens on an APS-C camera (crop factor 1.5). By the rule of thumb, what time is safe handheld, and what does one extra stop of ISO buy?',
      steps: [
        { text: 'The equivalent focal length is $300 \\times 1.5 = 450$ mm, so', tex: 't_{\\max} = \\frac{1}{450}\\ \\mathrm{s}' },
        'In practice 1/500 s. Each stop of ISO allows a time twice as short as before, so ISO 200 instead of 100 allows 1/1000 s.'
      ],
      a: '1/450 s, in practice 1/500 s.'
    }
  ],
  quiz: [
    { q: 'You double the focal length of the lens, keeping the subject distance fixed, at a given shutter speed. The blur of a moving subject on the sensor…', choices: ['stays the same', 'doubles (roughly)', 'halves', 'quadruples'], a: 1, why: 'The magnification $m \\approx f/s$ doubles, so $b = v\\,t\\,m$ doubles. The subject also fills twice the width of the frame.' },
    { q: 'A subject moves directly towards the camera. Compared with one crossing the frame at the same speed, the blur is…', choices: ['much less', 'the same', 'twice as large', 'infinite'], a: 0, why: 'The image of a subject moving along the line of sight changes size slowly during the exposure; only the sideways movement smears the picture.' },
    { q: 'Panning makes the background streaky because the camera follows the subject while the background stays still.', a: true, why: 'The camera turns, so the background sweeps across the sensor at the angular speed of the pan, while the subject is held on the same pixels.' },
    { q: 'What is the longest handheld time, as a fraction 1/x, for a lens of 200 mm focal length on full frame by the 1/f rule? Give x.', answer: 200, why: '$t_{\\max} = 1/f_{e} = 1/200$ s.' },
    { q: 'A camera turns at 1°/s while the shutter is open for 1/50 s with a 50 mm lens. How big is the blur on the sensor, in micrometres?', answer: 17.5, unit: 'µm', why: '$b = f\\,\\omega\\,t = 50\\ \\mathrm{mm} \\times 0.01745\\ \\mathrm{rad/s} \\times 0.02\\ \\mathrm{s} = 0.0175$ mm, which is 17.5 µm.' }
  ],
  applications: [
    'Sports and wildlife photography, where the time is chosen for the speed of the subject and the focal length of the lens.',
    'Panning shots of racing cars and cyclists, at 1/30 to 1/125 s.',
    'Landscape photography with silky water, using a tripod and a neutral-density filter.',
    'Machine vision, where an exposure is chosen so that a part on a conveyor moves less than a pixel ([[triggering-and-strobing]]).',
    'Astrophotography, where the time is set by the rotation of the sky and then extended with a tracking mount.'
  ],
  history: 'Eadweard Muybridge used shutter times of about 1/1000 s in the 1870s to settle whether a galloping horse has all four hooves off the ground (it does). The 1/focal-length rule is folklore of the 35 mm era and has no single author.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — image motion, exposure time and image blur.',
    'G. C. Holst, *CCD Arrays, Cameras and Displays* — motion blur as a modulation transfer function.',
    'CIPA DC-X011, *Measurement and description method for image stabilization performance of digital cameras (optical system)* — the test condition behind the claimed stops of stabilization.'
  ],
  sim: [{ id: 'cb-motion' }, { id: 'cb-shake', params: { stops: 0 } }]
},

/* ================================================================ ISO and gain */
{
  id: 'iso-and-gain', parent: 'camera-basics', title: 'ISO and gain', level: 2,
  short: 'ISO is a number that says how bright a picture comes out for a given exposure. In a digital camera it is gain: the signal is amplified before it is converted to numbers. It does not add light, so a high-ISO picture is noisy because the scene gave few photons, and shot noise follows the square root of the light, not the knob.',
  keywords: ['ISO', 'film speed', 'ISO speed', 'gain', 'sensitivity', 'noise', 'shot noise', 'photon noise', 'base ISO', 'ISO invariance', 'dual conversion gain', 'DIN', 'ASA', 'grain', 'auto ISO', 'ISO 12232'],
  prereq: ['exposure-and-the-exposure-triangle', 'how-a-pixel-detects-light'],
  related: ['sensor-noise', 'dynamic-range-and-full-well', 'metering-and-exposure-value', 'quantum-efficiency-and-spectral-response', 'electronics:noise-snr', 'binning-roi-and-area-of-interest'],
  body: `
The ISO number began on film, where it measured how little light a film needed: ISO 100 film needs four times the exposure of ISO 400. A digital sensor has no film speed; it has one fixed sensitivity, and the ISO setting is a promise about *rendering*: "for this exposure, the output will have this brightness". The camera keeps the promise by **gain**.

### The scale
ISO numbers double for each stop: 100, 200, 400, 800, 1600, 3200, 6400 … The older logarithmic scale (DIN) adds 3° per stop: ISO 100/21°, 400/27°, 1600/33°, written $S° = 10\\log_{10}S + 1$. Digital ISO is defined in ISO 12232 in several ways; the simplest, the saturation-based speed, is $S = 78/H_{sat}$, where $H_{sat}$ is the exposure (in lx·s) at which the sensor saturates. Mid-grey then sits about three stops below saturation, at about $10/S$ lx·s.

### Gain, not light
Raising ISO from 100 to 800 means: amplify the pixel signal eight times before it is digitized (analogue gain), or multiply the numbers afterwards (digital gain). Both make the *same photons* look brighter. What changes with ISO is the exposure the camera needs: a stop less per doubling.

### Where the noise comes from
Light arrives as photons, and their count fluctuates: $N$ photons have a noise of $\\sqrt{N}$ (**shot noise**), so the signal-to-noise ratio is $\\sqrt{N}$ at best. One pixel of 5.9 µm exposed to render mid-grey on a sunny day (EV 15) collects about 12 600 photons, 7 500 electrons at a quantum efficiency of 0.6, and 2.5 electrons of read noise hardly matter:

| ISO | Photons per pixel (mid-grey) | Electrons | SNR | SNR in dB |
|---|---|---|---|---|
| 100 | 12 600 | 7 500 | 87 | 38.8 |
| 400 | 3 100 | 1 900 | 43 | 32.7 |
| 1600 | 790 | 470 | 22 | 26.7 |
| 6400 | 200 | 120 | 11 | 20.5 |
| 25 600 | 49 | 29 | 4.9 | 13.9 |

Each doubling of ISO, at the same scene and aperture, means half the exposure, half the photons and a noise $\\sqrt2$ times bigger in proportion. The noise belongs to the *light collected*: a dim scene photographed at ISO 6400 is noisy because the scene gave few photons, and no ISO setting would have collected more.

### Practical consequences
- **Use the base ISO** (often 100 or 200) when the light allows: the most photons, the most headroom before saturation, the widest dynamic range.
- **Raise ISO only when the aperture and the time are used up**: to hold a short time or a small aperture.
- **ISO invariance.** On many sensors the read noise is small enough that a dark picture lifted in software has about the noise of one made at a high ISO. Some have a step in the middle of the range where a second, more sensitive readout takes over (**dual conversion gain**).
- **Film** has grain instead: the silver crystals of fast film are larger, and each is a photon counter that needs fewer photons.
- **Auto ISO** lets the camera raise ISO until a chosen shutter time can be kept.

> [!key] ISO is gain: it amplifies, and adds no light. Noise is set by the photons collected, with $\\mathrm{SNR} = \\sqrt{N}$ at best; one stop of ISO means half the light and a noise $\\sqrt2$ larger in proportion. Use the lowest ISO the light allows.
`,
  ideas: [
    'ISO says how bright the picture comes out for a given exposure; each doubling is one stop.',
    'In a digital camera, ISO is gain applied to the signal before or after digitizing; it adds no light.',
    'Photon shot noise gives SNR = √N for N photons collected.',
    'The noise of a high-ISO picture is the noise of the few photons the exposure collected.',
    'The base ISO gives the most photons, headroom and dynamic range; use the lowest ISO that the light allows.'
  ],
  pitfalls: [
    'A higher ISO makes the sensor more sensitive — The sensor is no more sensitive; only the amplification changes. The same number of photons is collected, shown brighter.',
    'High ISO creates noise — The noise is mostly already in the dim exposure. A higher ISO makes the existing noise visible and, with fixed exposure, lets you take a picture with fewer photons.',
    'Underexposing and lifting in software is always worse than raising ISO — On many modern sensors the two give similar noise; the difference is only in the read noise, which is small at moderate ISO.',
    'ISO 100 on one camera equals ISO 100 on another — Manufacturers have latitude in ISO 12232, so the same number can give pictures a third of a stop apart in brightness.'
  ],
  terms: [
    { term: 'ISO speed', also: ['ISO', 'film speed', 'ASA'], def: 'A number saying how bright a picture is for a given exposure. Doubling the ISO halves the exposure needed. 100, 200, 400 … are one stop apart.' },
    { term: 'Gain', also: ['analogue gain', 'amplification'], def: 'The factor by which the pixel signal is multiplied before or after conversion to numbers. Raising ISO raises the gain.' },
    { term: 'Shot noise', also: ['photon noise', 'Poisson noise'], def: 'The fluctuation in the number of photons collected, equal to the square root of the average number. It is the ultimate limit of picture quality.' },
    { term: 'Read noise', def: 'The electrical noise added when a pixel is read out, expressed in electrons rms. Typical values are 1 to 5 electrons in modern CMOS sensors.' },
    { term: 'Base ISO', also: ['native ISO'], def: 'The lowest ISO at which the sensor works without extra gain or tricks: the setting with the most headroom and dynamic range.' },
    { term: 'Dual conversion gain', also: ['DCG'], def: 'A pixel design with two read-out sensitivities; above a certain ISO the camera switches to the more sensitive one and read noise falls suddenly.' }
  ],
  formulas: [
    {
      name: 'DIN degrees from ISO',
      expr: 'Sd = 10*log10(S) + 1', tex: 'S^{\\circ} = 10\\log_{10}S + 1',
      vars: {
        Sd: { name: 'logarithmic speed (DIN degrees)', q: false, unit: '°', tex: 'S^{\\circ}' },
        S: { name: 'ISO number (arithmetic)', value: 400, min: 1, max: 1000000 }
      },
      note: 'ISO 100/21°, 400/27°, 1600/33°: three degrees per stop.',
      practice: { unknowns: ['Sd'] }
    },
    {
      name: 'Stops between two ISO values',
      expr: 'n = log2(S2/S1)', tex: 'n = \\log_2\\frac{S_2}{S_1}',
      vars: {
        n: { name: 'stops', signed: true },
        S2: { name: 'second ISO', value: 3200, min: 1, max: 1000000, tex: 'S_2' },
        S1: { name: 'first ISO', value: 100, min: 1, max: 1000000, tex: 'S_1' }
      },
      note: 'Positive when the second ISO is higher: that many stops less light are needed.',
      stories: { n: 'A photographer goes from ISO {S1} to ISO {S2}. By how many stops is the exposure reduced?' }
    },
    {
      name: 'Shot-noise limited SNR',
      expr: 'snr = sqrt(Ne)', tex: '\\mathrm{SNR} = \\sqrt{N_e}',
      vars: {
        snr: { name: 'signal-to-noise ratio', tex: '\\mathrm{SNR}' },
        Ne: { name: 'number of electrons collected', value: 7500, min: 1, max: 100000000, tex: 'N_e' }
      },
      note: 'Ignoring read noise and dark current; the ultimate limit.',
      stories: { snr: 'A pixel collects {Ne} electrons. What is its best possible signal-to-noise ratio?' }
    },
    {
      name: 'Saturation-based speed',
      expr: 'S = 78/Hs', tex: 'S = \\frac{78}{H_{sat}}',
      vars: {
        S: { name: 'ISO speed' },
        Hs: { name: 'exposure at saturation', q: 'lumexposure', unit: 'lx·s', value: 0.78, tex: 'H_{sat}' }
      },
      note: 'The ISO 12232 saturation-based speed: the sensor saturates at 0.78 lx·s for ISO 100.',
      practice: { unknowns: ['S'] }
    }
  ],
  examples: [
    {
      title: 'Two ways to a dim room',
      q: 'A dim room gives a pixel 800 electrons at f/2, 1/60 s and ISO 1600, which renders the picture correctly. A tripod allows the same picture at ISO 100 and the same f/2. What time is needed, and how do the shot-noise limited signal-to-noise ratios compare?',
      steps: [
        { text: 'ISO 1600 to ISO 100 is four stops, so the exposure must be 16 times larger: the time becomes $16/60 \\approx 1/4$ s.', tex: 't = \\frac{16}{60}\\ \\mathrm{s} \\approx 0.27\\ \\mathrm{s}' },
        { text: 'The pixel now collects 16 times more electrons:', tex: 'N_e = 16 \\times 800 = 12\\,800' },
        { text: 'The two signal-to-noise ratios:', tex: '\\sqrt{800} = 28 \\quad\\text{against}\\quad \\sqrt{12\\,800} = 113' }
      ],
      a: 'About 1/4 s at ISO 100. The SNR rises from 28 to 113: four times better, because 16 times more light was collected.'
    },
    {
      title: 'DIN and ISO',
      q: 'A film is marked ISO 200/24°. Check the second number, and give the DIN speed of ISO 800 film.',
      steps: [
        { text: 'For ISO 200:', tex: 'S^{\\circ} = 10\\log_{10} 200 + 1 = 24.0' },
        { text: 'For ISO 800:', tex: 'S^{\\circ} = 10\\log_{10} 800 + 1 = 30.0' }
      ],
      a: '24° checks; ISO 800 is 30° (two stops above ISO 200, 6° more).'
    }
  ],
  quiz: [
    { q: 'You raise ISO from 400 to 1600 and keep the aperture and the time. The picture becomes…', choices: ['two stops brighter', 'two stops darker', 'sharper', 'unchanged in brightness'], a: 0, why: 'Two stops of gain, 400 to 1600, make the same photons look four times brighter.' },
    { q: 'A pixel collects 10 000 photons and all of them make electrons. What is its best signal-to-noise ratio?', choices: ['10', '100', '1 000', '10 000'], a: 1, why: 'Shot noise is $\\sqrt{10\\,000} = 100$ electrons, so SNR = 100.' },
    { q: 'Doubling the ISO to keep a short shutter time adds no noise at all, because it is only gain.', a: false, why: 'The doubled ISO is used with half the exposure: the pixel collected half the photons and its relative noise is $\\sqrt2$ larger.' },
    { q: 'What is the DIN speed in degrees of ISO 100? Give the number.', answer: 21, why: '$10\\log_{10}100 + 1 = 21$.' },
    { q: 'Which strategy gives the cleanest picture of a still subject in low light?', choices: ['The highest ISO and a fast shutter', 'A tripod, base ISO and a long exposure', 'A wide aperture and a short time at ISO 6400', 'Underexposing and brightening'], a: 1, why: 'A long exposure at low ISO collects the most photons; noise follows the light collected.' }
  ],
  applications: [
    'Choosing settings in low light: aperture and time first, ISO last.',
    'Raw development, where lifting shadows is an ISO-like gain and shows the same noise.',
    'Sensor design: dual conversion gain and low read noise are what make modern high-ISO pictures usable.',
    'Machine vision, where the "gain" setting of the camera trades noise for a short exposure to freeze a moving part.',
    'Film choice: slow film for fine grain and detail, fast film for dim light, at a price in grain.'
  ],
  history: 'The film speed numbers go back to the Scheiner scale (1894), the DIN scale (1934, German) and the ASA scale (1943, American). In 1974 the arithmetic ASA and logarithmic DIN numbers were merged into ISO 6; ISO 12232 first defined the speed of digital cameras in 1998.',
  sources: [
    'ISO 12232, *Photography — Digital still cameras — Determination of exposure index, ISO speed ratings, standard output sensitivity, and recommended exposure index* — the digital definitions.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* — photon transfer, shot noise and read noise.',
    'EMVA Standard 1288, *Standard for characterization of image sensors and cameras* — the way noise and gain are measured in technical cameras.'
  ],
  sim: 'cb-iso'
},

/* ================================================================ metering and exposure value */
{
  id: 'metering-and-exposure-value', parent: 'camera-basics', title: 'Metering and exposure value', level: 2,
  short: 'A meter turns the brightness of a scene into an exposure value (EV), a single number from which aperture and time follow. A reflected meter reads the subject and assumes it is mid-grey, so snow comes out grey and a black cat comes out grey too; an incident meter reads the light itself. The histogram shows what the exposure did.',
  keywords: ['metering', 'exposure meter', 'light meter', 'incident meter', 'reflected meter', 'spot meter', 'average metering', 'centre-weighted', 'evaluative', 'matrix metering', '18 % grey', 'grey card', 'sunny 16', 'exposure compensation', 'histogram', 'EV', 'exposure value', 'clipping', 'expose to the right'],
  prereq: ['exposure-and-the-exposure-triangle', 'inverse-square-and-cosine-laws'],
  related: ['iso-and-gain', 'measuring-light', 'illuminance-levels-in-practice', 'lumens-candelas-lux-and-nits', 'dynamic-range-and-full-well', 'white-balance-and-chromatic-adaptation'],
  body: `
The brightness of what we photograph covers a range of about a million to one, from a moonlit field to snow in the sun. A camera has to boil it down to one number: the **exposure value** (see [[exposure-and-the-exposure-triangle]] for $\\mathrm{EV} = \\log_2(N^2/t)$). A **meter** finds the EV the scene needs.

### Typical values (ISO 100)
| EV | Scene |
|---|---|
| 16 | bright sun on snow or sand |
| 15 | bright sun, distinct shadows ("sunny 16") |
| 14 | hazy sun, soft shadows |
| 13 | bright cloud, no shadows |
| 12 | heavy overcast, open shade |
| 5 to 7 | bright room lit by lamps |
| 1 to 3 | candlelit scene |
| −3 | landscape in full moonlight |

**Sunny 16** needs no meter: in bright sun use f/16 and a time of $1/\\mathrm{ISO}$ seconds. One stop per step down: f/11 hazy, f/8 slightly overcast, f/5.6 overcast, f/4 heavy overcast.

### Reflected and incident light
A **reflected** meter, the kind in every camera, measures the *luminance* $L$ of the scene (cd/m²) and says
$$\\mathrm{EV} = \\log_2\\frac{L\\,S}{K}$$
with $S$ the ISO and $K \\approx 12.5$ a calibration constant. It is built so that a scene averaging about **18 % grey** is rendered as a middle tone. An **incident** meter held at the subject, pointed at the camera, measures the *illuminance* $E$ falling on it:
$$\\mathrm{EV} = \\log_2\\frac{E\\,S}{C}$$
with $C \\approx 250$ for a flat receptor (about 330 for a dome). It knows nothing about the subject.

### Why it matters: snow and the black cat
In full sun ($E \\approx 100\\,000$ lx), an incident meter gives EV 15.3. A reflected meter pointed at *snow* (90 % reflectance) reads $L = 28\\,600$ cd/m², EV 17.8, 2.5 stops brighter, and sets an exposure that renders the snow as mid-grey: too dark by that amount. Pointed at a *black cat* (4 %) it reads EV 13.3 and the cat comes out too light by two stops. The cure is **exposure compensation**, $\\Delta\\mathrm{EV} = \\log_2(R/0.18)$: +2 for snow, −2 for the cat. Or meter a grey card in the same light.

### Metering patterns
**Average** reads the whole frame; **centre-weighted** counts the middle more; **spot** reads 1 to 5 % of the frame; **evaluative** (matrix) splits the frame into zones and compares them with a library of scenes. The pattern decides what the camera takes for the subject.

### The histogram
A graph of how many pixels have each brightness, from black on the left to white on the right. A spike at the right edge is **clipping**: highlights lost for good. A pile at the left is crushed shadow. Raw files tolerate "exposing to the right", as bright as possible without clipping, because most of the sensor's levels are in the highlights and the photons there carry the least noise.

> [!key] EV names the exposure a scene needs. Reflected meters assume a mid-grey average, so snow needs about +2 EV and a black cat −2 EV; incident meters read the light and ignore the subject. Use the histogram to check for clipping.
`,
  ideas: [
    'The exposure value condenses aperture and time into one number; scenes range from EV −3 (moonlight) to EV 16 (snow in sun).',
    'Sunny 16: in bright sun use f/16 and a time of 1/ISO.',
    'A reflected meter assumes a mid-grey average; an incident meter measures the light on the subject.',
    'Light subjects (snow) need positive compensation, dark ones (a black cat) negative: about log₂(R/0.18) stops.',
    'The histogram shows clipping at either end and guides an exposure that uses the whole range.'
  ],
  pitfalls: [
    'The meter knows the correct exposure — The meter measures brightness and assumes the scene averages mid-grey. Snow, sand, a night street and a black cat all fool it.',
    '18 % grey means the grey card is 18 % of white on screen — It means a surface that reflects 18 % of the light, a mid-tone in lightness terms (L* near 50); on a gamma-encoded image it falls near the middle of the histogram.',
    'A histogram touching the right edge is always bad — It is bad only if it means clipped detail you wanted; a specular highlight or the Sun can clip harmlessly.',
    'EV is the brightness of the scene — EV depends on the ISO chosen as well; the tables quote it at ISO 100. At ISO 400 the same scene has EV two higher.'
  ],
  terms: [
    { term: 'Exposure value', also: ['EV', 'EV100'], def: 'A number log₂(N²/t) naming an aperture–time combination; a scene "has" the EV that gives a correct exposure at ISO 100.' },
    { term: 'Reflected-light meter', also: ['spot meter', 'TTL meter'], def: 'A meter measuring the luminance of what it points at, calibrated to render the average as mid-grey. All in-camera meters are of this kind.' },
    { term: 'Incident-light meter', def: 'A meter with a white dome or flat diffuser, held at the subject facing the camera, measuring the illuminance. It ignores the reflectance of the subject.' },
    { term: '18 % grey', also: ['grey card', 'middle grey'], def: 'A neutral surface reflecting 18 % of the light that falls on it, the traditional reference for exposure metering.' },
    { term: 'Exposure compensation', also: ['EV compensation'], def: 'A deliberate offset, in stops, from the meter\'s exposure: positive for light-toned scenes, negative for dark ones.' },
    { term: 'Histogram', def: 'A graph of the number of pixels at each brightness level, dark at the left and bright at the right, used to judge exposure.' }
  ],
  formulas: [
    {
      name: 'EV from the luminance of a scene (reflected)',
      expr: 'EV = log2(L*S/K)', tex: '\\mathrm{EV} = \\log_2\\frac{L\\,S}{K}',
      vars: {
        EV: { name: 'exposure value at the ISO S', tex: '\\mathrm{EV}', signed: true },
        L: { name: 'luminance of the scene', q: 'luminance', unit: 'cd/m²', value: 4096 },
        S: { name: 'ISO', value: 100, min: 1, max: 1000000 },
        K: { name: 'meter calibration constant', value: 12.5, fixed: true }
      },
      note: 'K is typically 12.5 (ISO 2720 allows 10.6 to 13.4). At ISO 100, 4096 cd/m² gives EV 15.',
      stories: { EV: 'A reflected-light meter at ISO {S} reads a scene of luminance {L}. What exposure value does it give?' }
    },
    {
      name: 'EV from the illuminance (incident)',
      expr: 'EV = log2(E*S/C)', tex: '\\mathrm{EV} = \\log_2\\frac{E\\,S}{C}',
      vars: {
        EV: { name: 'exposure value at the ISO S', tex: '\\mathrm{EV}', signed: true },
        E: { name: 'illuminance on the subject', q: 'illuminance', unit: 'lx', value: 100000 },
        S: { name: 'ISO', value: 100, min: 1, max: 1000000 },
        C: { name: 'meter constant (flat receptor)', value: 250, fixed: true }
      },
      note: 'C is about 250 for a flat receptor, 330 to 340 for a dome. Full sun is 100 000 lx: EV 15.3.',
      stories: { EV: 'An incident meter at ISO {S} reads {E}. What is the exposure value?' }
    },
    {
      name: 'Exposure compensation for a subject',
      expr: 'dEV = log2(R/Rg)', tex: '\\Delta\\mathrm{EV} = \\log_2\\frac{R}{R_g}',
      vars: {
        dEV: { name: 'compensation to dial in', tex: '\\Delta\\mathrm{EV}', signed: true },
        R: { name: 'reflectance of the subject', q: 'ratio', unit: '%', value: 90, min: 1, max: 100 },
        Rg: { name: 'reflectance the meter assumes', q: 'ratio', unit: '%', value: 18, min: 1, max: 100, tex: 'R_g' }
      },
      note: 'When the meter is pointed at (or dominated by) a subject of reflectance R: positive means more exposure.',
      stories: { dEV: 'A reflected meter reads a subject of reflectance {R} and assumes {Rg}. How many stops of compensation are needed?' }
    }
  ],
  examples: [
    {
      title: 'A snow scene',
      q: 'A skier in full sun is metered by pointing the camera at the snow (reflectance 90 %), ISO 100, aperture f/8. What time does the meter choose, what compensation is needed, and what time results?',
      steps: [
        'The meter reads EV 17.8 (a luminance of 28 600 cd/m²) and chooses $t = 8^2/2^{17.8} = 1/3600$ s, in practice 1/4000 s.',
        { text: 'The compensation for snow:', tex: '\\Delta\\mathrm{EV} = \\log_2\\frac{0.90}{0.18} = +2.3' },
        'Dialling in +2.3 EV lowers the target to EV 15.5, close to the sunny-16 value of 15, and the time becomes $8^2/2^{15.5} = 1/720$ s: about 1/750 s.'
      ],
      a: 'The meter picks 1/4000 s; with +2.3 EV the right time is about 1/750 s at f/8.'
    },
    {
      title: 'Sunny 16 without a meter',
      q: 'On a hazy day (soft shadows) a photographer uses ISO 400. Use the sunny-16 rule to find an aperture and a time.',
      steps: [
        'Bright sun is f/16 at 1/ISO; hazy sun is one stop less light: f/11.',
        'At ISO 400 the time is 1/400 s (in practice 1/500).'
      ],
      a: 'f/11 at 1/500 s, ISO 400.'
    }
  ],
  quiz: [
    { q: 'A reflected-light meter is pointed at a field of fresh snow. If you follow it blindly, the snow appears…', choices: ['too light', 'too dark: mid-grey', 'correct', 'blue'], a: 1, why: 'The meter assumes the average scene reflects 18 %. Snow reflects about 90 %, so the meter calls for less exposure and renders the snow as mid-grey.' },
    { q: 'An incident meter gives the same reading for a black cat and for a white cat in the same light.', a: true, why: 'It measures the light falling on the subject, not what comes back: the cats are rendered black and white as they should be.' },
    { q: 'By sunny 16, which setting is right in bright sun at ISO 200?', choices: ['f/16 at 1/200 s', 'f/16 at 1/1000 s', 'f/8 at 1/200 s', 'f/5.6 at 1/50 s'], a: 0, why: 'Bright sun: f/16 and a time of 1/ISO seconds: 1/200 s (1/250 in practice).' },
    { q: 'A subject of 36 % reflectance is metered as if it were 18 %. How many stops of compensation (give a number)?', answer: 1, why: '$\\log_2(36/18) = 1$: dial in +1 EV.' },
    { q: 'A histogram has a tall spike pressed against the right-hand edge. This usually means…', choices: ['the picture is correctly exposed', 'highlights are clipped and detail is lost', 'the picture is too dark', 'the white balance is wrong'], a: 1, why: 'The right edge is the brightest level; a spike there is a lot of pixels saturated, with no detail left in them.' }
  ],
  applications: [
    'Every automatic exposure mode in every camera.',
    'Film and studio work with incident meters and grey cards, which give the same exposure whatever the subject.',
    'Landscape photography with graduated filters and bracketed exposures, where the meter readings of sky and ground differ by several stops.',
    'Video, where zebra stripes and waveform monitors play the part of the histogram.',
    'Machine vision, where a grey reference is placed in the field of view to set exposure and gain automatically.'
  ],
  history: 'Early photographers used tables and the sunny-16 sort of rule. The first photoelectric meters (selenium cells) came in the 1930s and the meter inside the camera, reading through the lens, in the 1960s. Ansel Adams\'s Zone System (1940s) turned the meter reading into a method for placing any tone of the scene anywhere on the print.',
  sources: [
    'ISO 2720:1974, *General purpose photographic exposure meters (photoelectric type) — Guide to product specification* — the constants K and C.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — exposure measurement, luminance and illuminance meters.',
    'A. Adams, *The Negative* (Little, Brown) — the Zone System and the reflected-light reading.'
  ],
  sim: 'cb-metering'
},

/* ================================================================ flash and strobe */
{
  id: 'flash-and-strobe', parent: 'camera-basics', title: 'Flash and strobe', level: 2,
  short: 'A flash is a brief, bright, daylight-coloured burst of light. Its reach is given by the guide number, GN = distance × f-number, and falls off with the inverse square of distance, two stops for each doubling. Its duration, 1/1000 s down to microseconds, freezes motion; its synchronization with the shutter decides which part of the frame it lights.',
  keywords: ['flash', 'strobe', 'speedlight', 'guide number', 'GN', 'flash duration', 'flash sync', 'X-sync', 'high-speed sync', 'rear-curtain sync', 'inverse square', 'xenon flash', 'fill flash', 'bounce flash', 'red-eye', 'Edgerton', 'overdriven LED strobe'],
  prereq: ['exposure-and-the-exposure-triangle', 'shutter-types', 'inverse-square-and-cosine-laws'],
  related: ['xenon-arc-and-flash-lamps', 'triggering-and-strobing', 'shutter-speed-and-motion', 'stroboscopic-effects', 'machine-vision-lighting', 'metering-and-exposure-value'],
  body: `
A **flash** discharges a capacitor through a xenon tube. The result is a pulse of white light, close to daylight in colour (5500 to 6000 K), lasting from about 1/1000 s at full power to a few microseconds in the fastest units.

### The guide number
A flash is rated by its **guide number**, $\\mathrm{GN} = N \\times d$, measured at ISO 100, the distance $d$ in metres and the f-number $N$ for a correct exposure. At GN 36, a subject 6 m away needs f/6 (use f/5.6); one at 3 m needs f/12. A built-in flash has GN 10 to 12, a hot-shoe flash 30 to 60, a studio head far more. The number counts feet instead of metres in American catalogues and depends on the zoom setting of the head, so compare like with like.

The guide number is scaled by a square root: for another ISO $S$ and a fraction $p$ of full power,

$$\\mathrm{GN}_e = \\mathrm{GN}\\sqrt{\\frac{S}{100}\\,p}$$

so ISO 400 doubles the reach, and 1/4 power halves it (GN 36 becomes 18).

### The inverse square
The light of a small source on a surface at distance $d$ falls as $1/d^2$: doubling the distance costs two stops. So a flash exposure is right at one distance only. A person at 2 m and a wall at 4 m behind them get one quarter of the light, which is why flash portraits have black backgrounds. **Bounce** flash, off a ceiling, makes the source larger and farther: softer, and about two stops weaker.

### Duration
The flash lasts $t_{0.5}$ (time above half peak): a speedlight at full power about 1/1000 s, falling with power to 1/20 000 s or shorter at 1/128. A subject at 30 m/s moves only 1.5 mm during 1/20 000 s; freezing a bullet at 300 m/s takes a tube of a few microseconds. Harold Edgerton at MIT built the first such flashes in the 1930s.

### Synchronization
- **First-curtain sync**: the flash fires when the shutter has just opened. With a focal-plane shutter, only at times at or above the sync speed $\\approx 1/T_c$ (1/125 to 1/250 s); at shorter times a black band appears ([[shutter-types]]).
- **Rear-curtain sync**: fires at the end of the exposure; the ambient light's streak trails behind the subject, not in front of it.
- **High-speed sync**: the flash pulses at tens of kilohertz while the slit crosses, so every row gets light; the output per pulse is a fraction of the full power, so reach drops by one to three stops.
- A **leaf shutter** syncs at every speed.

### Flash and ambient light
Once the time is above the sync speed, the **flash exposure** depends on the aperture, the power, the ISO and the distance, but not on the shutter time (the pulse is shorter), while the **ambient exposure** depends on aperture, ISO and shutter time. So the aperture and flash power set the subject, and the shutter time the background. "Dragging the shutter" lets a dim background show.

> [!warn] A flash unit holds a capacitor charged to 300 V or more (studio units, much more). Never open one, even with the batteries removed. Do not fire a flash at close range into anyone's eyes, in particular a baby's, and remember that rapid flashing can provoke seizures in people with photosensitive epilepsy.

> [!key] $\\mathrm{GN} = N\\,d$ at ISO 100; reach goes as $\\sqrt{S\\,p}$ and exposure falls as $1/d^2$. A flash is short enough to freeze motion; at shutter times shorter than the sync speed a focal-plane shutter lights only a band.
`,
  ideas: [
    'Guide number is the f-number times the distance in metres, at ISO 100, for a correct exposure.',
    'Reach scales with the square root of ISO and of the power fraction.',
    'Flash light falls as 1/d²: two stops per doubling of distance.',
    'A flash lasts 1/1000 s to a few microseconds, so it freezes motion that the shutter would blur.',
    'Flash sync is limited by the shutter: focal-plane shutters sync at 1/125 to 1/250 s, leaf shutters at any speed.'
  ],
  pitfalls: [
    'The flash exposure depends on the shutter speed — Above the sync speed it does not: the flash is much shorter than the exposure. The shutter time controls only how much ambient light the picture records.',
    'A more powerful flash lights everything better — The inverse-square law makes near subjects bright and far ones dark whatever the power. Doubling the power buys only 41 % more reach (a factor √2).',
    'A guide number of 60 means the flash reaches 60 m — It means distance × f-number = 60 at ISO 100, so f/8 at 7.5 m, or f/4 at 15 m.',
    'High-speed sync is a free way to use flash at 1/8000 s — It chops the output into pulses, wasting one to three stops of power and shortening the reach.'
  ],
  terms: [
    { term: 'Guide number', also: ['GN'], def: 'The product of the distance (in metres, or feet) and the f-number that give a correct flash exposure at ISO 100. A bigger guide number means more reach.' },
    { term: 'Flash duration', also: ['t0.5', 'flash time'], def: 'The time for which a flash is above half its peak intensity: about 1/1000 s at full power, down to a few microseconds for some studio tubes or low-power settings.' },
    { term: 'Flash-sync speed', also: ['X-sync'], def: 'The fastest shutter time at which the whole frame is uncovered when the flash fires; about 1/125 to 1/250 s for a focal-plane shutter.' },
    { term: 'High-speed sync', also: ['HSS', 'FP flash'], def: 'A mode in which the flash fires a train of pulses while the shutter slit crosses the frame, so that shutter times shorter than the sync speed can be used, at lower power.' },
    { term: 'Rear-curtain sync', also: ['second-curtain sync'], def: 'Firing the flash at the end of the exposure so that the light trail of a moving subject ends in its sharp image.' },
    { term: 'Strobe', also: ['stroboscope', 'strobe light'], def: 'A light that flashes repeatedly or once, briefly enough to freeze motion. In machine vision the term covers LED flashes with currents above their continuous rating.' }
  ],
  formulas: [
    {
      name: 'Guide number',
      expr: 'GN = N*d', tex: '\\mathrm{GN} = N\\,d',
      vars: {
        GN: { name: 'guide number (at ISO 100)', q: 'length', unit: 'm', tex: '\\mathrm{GN}' },
        N: { name: 'f-number for a correct exposure', value: 6, min: 0.5, max: 64 },
        d: { name: 'distance to the subject', q: 'length', unit: 'm', value: 6 }
      },
      note: 'At ISO 100 and full power with the head at the zoom setting the number is quoted for.',
      stories: { GN: 'A flash is used with f/{N} to expose correctly a subject {d} away at ISO 100. What is its guide number?', N: 'A flash of guide number {GN} lights a subject {d} away at ISO 100. What f-number gives a correct exposure?', d: 'A flash of guide number {GN} is used at f/{N} and ISO 100. How far away is the subject that is correctly exposed?' }
    },
    {
      name: 'Guide number at another ISO and power',
      expr: 'GNe = GN*sqrt(S/100*p)', tex: '\\mathrm{GN}_e = \\mathrm{GN}\\sqrt{\\frac{S}{100}\\,p}',
      vars: {
        GNe: { name: 'effective guide number', q: 'length', unit: 'm', tex: '\\mathrm{GN}_e' },
        GN: { name: 'guide number (ISO 100, full power)', q: 'length', unit: 'm', value: 36, tex: '\\mathrm{GN}' },
        S: { name: 'ISO', value: 400, min: 1, max: 1000000 },
        p: { name: 'fraction of full power', value: 0.25, min: 0.001, max: 1 }
      },
      note: 'The light output goes as p and as S; the reach as their square root.'
    },
    {
      name: 'Blur of a subject during the flash',
      expr: 'b = v*tf', tex: 'b = v\\,t_f',
      vars: {
        b: { name: 'distance moved during the flash', q: 'length', unit: 'mm' },
        v: { name: 'speed of the subject', q: 'speed', unit: 'm/s', value: 30 },
        tf: { name: 'flash duration', q: 'time', unit: 'µs', value: 50, tex: 't_f' }
      },
      note: 'In the scene; multiply by the magnification for the sensor.',
      stories: { b: 'A ball moving at {v} is lit by a flash of {tf}. How far does it move during the flash?' }
    },
    {
      name: 'Energy stored in the flash capacitor',
      expr: 'E = C*V^2/2', tex: 'E = \\tfrac{1}{2}\\,C\\,V^2',
      vars: {
        E: { name: 'stored energy', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1000 },
        V: { name: 'charging voltage', q: 'voltage', unit: 'V', value: 330 }
      },
      note: 'A hot-shoe flash capacitor of 1000 µF at 330 V holds 54 J, of which only a modest fraction becomes visible light.',
      practice: { unknowns: ['E'] }
    }
  ],
  examples: [
    {
      title: 'The reach of a flash',
      q: 'A hot-shoe flash has GN 36 (metres, ISO 100). A photographer uses f/4 at ISO 400. How far does it reach, and what aperture is right for a subject 5 m away at ISO 100?',
      steps: [
        { text: 'At ISO 400 the effective guide number doubles: $\\mathrm{GN}_e = 36 \\times \\sqrt{4} = 72$. At f/4:', tex: 'd = \\frac{\\mathrm{GN}_e}{N} = \\frac{72}{4} = 18\\ \\mathrm{m}' },
        { text: 'At 5 m and ISO 100:', tex: 'N = \\frac{36}{5} = 7.2 \\approx \\text{f/}8' }
      ],
      a: '18 m at f/4 and ISO 400; f/7 to f/8 at 5 m and ISO 100.'
    },
    {
      title: 'Freezing a ball',
      q: 'A tennis ball moves at 50 m/s. How far does it move during a flash of 1/20 000 s, and during a shutter time of 1/500 s?',
      steps: [
        { text: 'During the flash (50 µs):', tex: 'b = 50 \\times 50\\times10^{-6} = 2.5\\ \\mathrm{mm}' },
        { text: 'During the shutter (2 ms):', tex: 'b = 50 \\times 0.002 = 100\\ \\mathrm{mm}' }
      ],
      a: '2.5 mm during the flash, 100 mm during the exposure: in a dark room the flash alone freezes the ball.'
    }
  ],
  quiz: [
    { q: 'A subject is moved from 2 m to 4 m from a flash and nothing else is changed. The flash exposure on it falls by…', choices: ['one stop', 'two stops', 'three stops', 'it is unchanged'], a: 1, why: 'The light goes as $1/d^2$; doubling the distance gives one quarter, two stops.' },
    { q: 'A flash of GN 28 (m, ISO 100) is used at ISO 100. At f/4, how far away is the correctly exposed subject, in metres?', answer: 7, unit: 'm', why: '$d = \\mathrm{GN}/N = 28/4 = 7$ m.' },
    { q: 'Above the sync speed, changing the shutter time from 1/125 s to 1/60 s changes the exposure of a subject lit only by the flash.', a: false, why: 'The flash is much shorter than either time, so the subject is lit by the same amount. Only ambient light (the background) gets brighter.' },
    { q: 'Raising the ISO from 100 to 400 changes the guide number to…', choices: ['0.5 times', '1 times', '2 times', '4 times'], a: 2, why: 'GN scales as $\\sqrt{S}$: $\\sqrt{4} = 2$.' },
    { q: 'A speedlight is set to 1/16 power. Its reach relative to full power is…', choices: ['1/16', '1/8', '1/4', '1/2'], a: 2, why: 'The reach scales as $\\sqrt{p} = \\sqrt{1/16} = 1/4$.' }
  ],
  applications: [
    'Fill flash outdoors, to lift the shadows on a face against a bright sky.',
    'Studio photography, where flash gives a controllable, daylight-coloured light and, with short durations, frozen motion.',
    'High-speed photography of drops, bullets and balloons, with microsecond tubes.',
    'Machine vision strobes, which freeze a part on a fast conveyor ([[triggering-and-strobing]]), usually with LEDs pulsed above their rated current.',
    'Stroboscopic study of rotating machinery, where a flash at the right rate makes a spinning part look still.'
  ],
  history: 'Magnesium flash powder lit photographs from the 1860s, with its smoke and risk. Harold Edgerton developed the electronic flash and stroboscope at MIT in the 1930s, and his microsecond pictures of bullets and milk drops became icons of the century. The hot-shoe electronic flash became common in the 1960s, and automatic exposure by measuring the flash light through the lens from the 1970s.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — flash light sources, guide numbers and synchronization.',
    'H. E. Edgerton, *Electronic Flash, Strobe* (MIT Press) — the stroboscopic flash tube and its circuits.'
  ],
  sim: 'cb-flash'
},

/* ================================================================ image stabilization */
{
  id: 'image-stabilization', parent: 'camera-basics', title: 'Image stabilization', level: 2,
  short: 'Stabilization moves a lens group, the sensor or the cropping window in the opposite direction to the shake that gyroscopes measure, so that the image stays still on the pixels. It lets you hold the camera at a time 2^k longer, with k stops of benefit; it does not help a moving subject.',
  keywords: ['image stabilization', 'optical stabilization', 'OIS', 'IBIS', 'in-body stabilization', 'sensor shift', 'lens shift', 'electronic stabilization', 'EIS', 'vibration reduction', 'stops of stabilization', 'gyroscope', 'camera shake', 'CIPA', 'gimbal'],
  prereq: ['shutter-speed-and-motion'],
  related: ['exposure-and-the-exposure-triangle', 'the-interchangeable-lens-camera', 'the-phone-camera', 'binoculars', 'galvanometer-scanners', 'iso-and-gain'],
  body: `
Hand-held, a camera turns by a fraction of a degree during the exposure. That smears every point of the picture by $b = f\\,\\omega\\,t$ (see [[shutter-speed-and-motion]]); the longer the lens and the exposure, the worse. **Stabilization** cancels the motion rather than waiting for it to end.

### How it works
1. **Gyroscopes** (tiny vibrating-structure MEMS devices) measure the angular velocity of the camera about two axes, pitch and yaw, and sometimes roll, at about 1 kHz or more.
2. The processor integrates it to an angle $\\theta$ and works out the displacement that would cancel it: $d = f\\tan\\theta$. A 100 mm lens turned by 0.2° moves the image by 0.35 mm.
3. A **voice-coil** actuator moves a correcting element by that amount, in the opposite direction, many times a second.

### Three ways to do it
| Method | What moves | Strength | Weakness |
|---|---|---|---|
| **Lens-shift** (optical, OIS, VR, IS) | a lens group, perpendicular to the axis | tuned to each lens: works at long focal lengths, steadies the viewfinder | in every lens, adding cost and weight |
| **Sensor-shift** (IBIS) | the sensor, on magnets, in five axes (two shifts, two angles, roll) | works with any lens; corrects roll | limited range at long focal lengths |
| **Electronic** (EIS) | a cropping window on video frames | no moving parts, cheap; corrects roll | costs 5 to 10 % of the field, and sometimes sharpness |

Best results come from lens and body working together, with the body correcting roll and the lens the long-lens pitch and yaw.

### Stops of benefit
If the correction cancels the shake down to a fraction $2^{-k}$, the time can be $2^k$ times longer for the same blur:

$$t_{\\max} = \\frac{2^{k}}{f_{e}}$$

where $k$ stops are the benefit, and $f_e$ the 35 mm-equivalent focal length in millimetres ([[shutter-speed-and-motion]] for the 1/f rule). Manufacturers quote 3 to 5 stops for lenses and up to about 8 for the best coordinated systems, measured to the CIPA standard under defined test conditions. A 200 mm lens with 4 stops can be used at 1/13 s, 16 times longer than 1/200 s; the figure is a median over many hands, not a promise, and falls at the longest focal lengths and for close-up work.

### What it does not do
- **Moving subjects.** A running child blurs just as much: the subject moves relative to the scene, not the camera. Only a short time freezes it.
- **Large movements.** The correcting element can only move a few millimetres; a big sway saturates it.
- **Panning.** Deliberate turns are not shake; modern systems detect a steady pan and correct only the other axis.
- **Vibration from the shutter or mirror**, which comes after the gyroscope has had its say, and at the frequency of some tripods.

### Elsewhere
Binoculars, telescopes and rifle scopes use prisms or lenses on gimbals; drone and film cameras mount whole cameras on motorized **gimbals**; scanners and printers use the same position loops ([[galvanometer-scanners]]).

> [!key] Gyroscopes measure the shake, a voice coil moves a lens group, the sensor or the crop window to cancel it. With $k$ stops of benefit the time can be $2^k$ longer, $t_{\\max} = 2^k/f_e$. It stabilizes the camera, not the subject.
`,
  ideas: [
    'Gyroscopes measure the shake, and an actuator moves a lens group or the sensor to cancel it.',
    'The needed shift is d = f tan θ; a few millimetres of travel suffice.',
    'k stops of benefit let the time be 2^k longer for the same blur.',
    'Lens-shift, sensor-shift and electronic methods differ in what they move and what they cost.',
    'Stabilization does nothing for a moving subject.'
  ],
  pitfalls: [
    'Stabilization lets you freeze fast action — It only cancels camera movement. A moving subject needs a short time.',
    'Four stops of stabilization means the picture is 16 times sharper — It means that the time may be 16 times longer for the same blur, in the hands of a typical person under test conditions; the effect is less at long focal lengths.',
    'Stabilization should always be on — It is useful handheld; on a tripod some older systems "hunt" and blur the image, and shake from the shutter itself is not removed. Follow the maker\'s advice.',
    'Electronic stabilization is as good as optical — It crops the frame and works from motion data; it costs resolution, and for stills it cannot change the blur within one exposure.'
  ],
  terms: [
    { term: 'Optical image stabilization', also: ['OIS', 'VR', 'IS', 'lens-shift stabilization'], def: 'Stabilization by moving a lens group in the lens perpendicular to the axis, in response to gyroscope signals.' },
    { term: 'In-body image stabilization', also: ['IBIS', 'sensor-shift'], def: 'Stabilization by moving the sensor, on a magnetic suspension, in the camera body. It works with any lens.' },
    { term: 'Electronic image stabilization', also: ['EIS', 'digital stabilization'], def: 'Stabilization of video by cropping each frame and moving the cropping window against the motion measured by gyroscopes or the images.' },
    { term: 'Stops of stabilization', also: ['stops of benefit', 'CIPA stops'], def: 'The factor, in stops, by which the safe handheld exposure time is lengthened. Defined by the CIPA test procedure.' },
    { term: 'Gyroscope', also: ['gyro sensor', 'MEMS gyro'], def: 'A sensor of angular velocity. In cameras a micromachined vibrating structure, read at a kilohertz or more.' },
    { term: 'Gimbal', def: 'A motorized mount that holds a camera steady against the movement of its carrier, in two or three axes.' }
  ],
  formulas: [
    {
      name: 'Image shift to cancel a rotation',
      expr: 'd = f*tan(th)', tex: 'd = f\\tan\\theta',
      vars: {
        d: { name: 'displacement of the image', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        th: { name: 'angle through which the camera turned', q: 'angle', unit: '°', value: 0.2, min: 0, max: 20, tex: '\\theta' }
      },
      note: 'The sensor or correcting group must move by this amount, in the opposite direction.',
      stories: { d: 'A camera with a {f} lens turns by {th} during an exposure. How far must the sensor move to cancel it?' }
    },
    {
      name: 'Longest handheld time with stabilization',
      expr: 'tmax = 2^k/fe', tex: 't_{\\max} = \\frac{2^{k}}{f_{e}}',
      vars: {
        tmax: { name: 'longest handheld time', q: 'time', unit: 's', tex: 't_{\\max}' },
        k: { name: 'stops of stabilization', value: 4, min: 0, max: 10 },
        fe: { name: 'focal length on the 35 mm scale, in millimetres', q: false, unit: 'mm', value: 200, tex: 'f_{e}' }
      },
      note: 'The 1/f rule multiplied by 2^k. A guide, for steady hands.',
      stories: { tmax: 'A lens of {fe} equivalent focal length has {k} stops of stabilization. What is the longest safe handheld time?' }
    },
    {
      name: 'Residual blur after stabilization',
      expr: 'br = b/2^k', tex: 'b_r = \\frac{b}{2^{k}}',
      vars: {
        br: { name: 'blur with stabilization', q: 'length', unit: 'µm', tex: 'b_r' },
        b: { name: 'blur without it', q: 'length', unit: 'µm', value: 64 },
        k: { name: 'stops of stabilization', value: 4, min: 0, max: 10 }
      },
      note: 'Each stop halves the blur.',
      practice: { unknowns: ['br'] }
    }
  ],
  examples: [
    {
      title: 'A telephoto at dusk',
      q: 'A photographer uses a 400 mm lens on a full-frame camera. By the 1/f rule the longest time is 1/400 s. The lens has 4 stops of stabilization. What is the longest time, and what change of ISO does that save against 1/400 s?',
      steps: [
        { text: 'With four stops:', tex: 't_{\\max} = \\frac{2^4}{400} = \\frac{16}{400} = \\frac{1}{25}\\ \\mathrm{s}' },
        'From 1/400 s to 1/25 s is four stops of light. At ISO 6400 for 1/400 s the same exposure is reached at ISO 400 and 1/25 s.'
      ],
      a: '1/25 s, which saves four stops of ISO (6400 → 400) for a still subject.'
    },
    {
      title: 'How far does the sensor move?',
      q: 'A camera with a 50 mm lens turns by 0.1° in a shake. How far must an in-body stabilizer move the sensor, and how large an angle can it correct if its travel is ±2 mm?',
      steps: [
        { text: 'The shift:', tex: 'd = 50\\tan 0.1° = 0.087\\ \\mathrm{mm}' },
        { text: 'The largest angle:', tex: '\\theta_{\\max} = \\arctan\\frac{2}{50} = 2.3°' }
      ],
      a: '0.087 mm for 0.1°; ±2.3° at the limit. With a 400 mm lens the same travel only covers ±0.29°.'
    }
  ],
  quiz: [
    { q: 'A lens with 3 stops of stabilization is used where the 1/f rule says 1/100 s. What time is the guide for handheld use?', choices: ['1/800 s', '1/33 s', '1/13 s', '1/300 s'], a: 2, why: '$2^3 = 8$, so $8/100 = 1/12.5$ s, about 1/13 s.' },
    { q: 'Image stabilization reduces the blur of a ball thrown across the frame.', a: false, why: 'It cancels camera movement only. A subject that moves relative to the scene needs a short exposure.' },
    { q: 'For a given angular shake, the shift needed to cancel it is larger for…', choices: ['a short focal length', 'a long focal length', 'a large aperture', 'a fast shutter'], a: 1, why: '$d = f\\tan\\theta$ grows with $f$. That is why the range of a stabilizer is used up sooner at long focal lengths.' },
    { q: 'A sensor-shift stabilizer works with any lens, because it moves the sensor.', a: true, why: 'It needs only the focal length (from the lens or the user) to compute the shift $d = f\\tan\\theta$.' },
    { q: 'A 100 mm lens on a camera turned by 0.2°: how far (mm) must the sensor move?', answer: 0.349, unit: 'mm', why: '$d = 100\\tan 0.2° = 0.349$ mm.' }
  ],
  applications: [
    'Handheld telephoto and low-light photography, with gains of three to six stops.',
    'Smartphone cameras, where small gimbal-like actuators move the lens or sensor and the processor combines frames.',
    'Handheld video, with electronic or hybrid stabilization and the mechanical steadying of gimbals.',
    'Image-stabilized binoculars (prism or lens-shift) and surveillance cameras on shaking masts.',
    'Industrial and aerial imaging, where stabilized mounts hold sensors steady on vehicles.'
  ],
  history: 'Canon introduced the first stabilized lens for still cameras in 1995, a 75–300 mm zoom; Nikon followed in 2000 with vibration reduction. Konica Minolta put the sensor-shift system into a body in 2003. The CIPA test for the stops of benefit was published in 2012.',
  sources: [
    'CIPA DC-X011-2012, *Measurement and description method for image stabilization performance of digital cameras (optical system)* — the test behind the claimed stops.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — image motion and its correction.',
    'W. J. Smith, *Modern Optical Engineering* — decentring a lens element displaces the image; the principle of the moving group.'
  ],
  sim: [{ id: 'cb-shake', params: { stops: 4 } }]
},

/* ================================================================ viewfinders */
{
  id: 'viewfinders-and-focusing-screens', parent: 'camera-basics', title: 'Viewfinders', level: 2,
  short: 'A viewfinder shows what the camera will record. Optical finders look through a separate window; a reflex finder looks through the lens by a 45° mirror, a focusing screen and a pentaprism; an electronic finder shows the sensor image on a small display. Split-image and microprism aids make focus visible.',
  keywords: ['viewfinder', 'optical viewfinder', 'reflex', 'mirror', 'pentaprism', 'pentamirror', 'focusing screen', 'ground glass', 'split-image', 'microprism', 'electronic viewfinder', 'EVF', 'rangefinder', 'parallax', 'eye relief', 'finder magnification', 'mirror lock-up', 'dioptre adjustment'],
  prereq: ['camera-families', 'prism-types'],
  related: ['autofocus-methods', 'the-interchangeable-lens-camera', 'depth-of-field', 'the-eye-as-a-camera', 'the-magnifier', 'eyepieces', 'exit-pupil-and-eye-relief'],
  body: `
A **viewfinder** answers the question: what will the picture contain, and is it in focus? There are four ways to do it.

| Finder | How it works | Strength | Weakness |
|---|---|---|---|
| Optical window | a small reversed telescope or a clear frame, beside the lens | bright, simple, no delay | parallax; no focus or depth information |
| Rangefinder | window plus a second window whose image is made to coincide | precise focus by triangulation | limited to lenses of about 135 mm and shorter |
| Reflex | the taking lens's image, via a mirror, onto a focusing screen | what the lens sees, including focus | the mirror box; the picture goes dark in the exposure |
| Electronic (EVF) | the sensor's image on a small OLED or LCD | shows exposure, depth of field, histogram; works in the dark | lag, battery drain, a display's gamut |

### The reflex path
The lens forms its image on the sensor; before the shot a mirror at 45° sends the light up instead, to a **focusing screen** exactly as far from the mirror as the sensor is, so that the screen and the sensor are conjugate: what is sharp on the screen is sharp on the sensor. The image on the screen is the right way up but reversed left to right; the **pentaprism** (with a roof edge) folds the beam through two reflections and turns the image the right way round, then the eyepiece magnifies it. At the exposure the mirror flips up (the finder goes dark), the shutter opens and the sensor records; then the mirror drops again. A **pentamirror** does the same with three flat mirrors, lighter and cheaper but dimmer and smaller.

The finder shows the image at the lens's *widest* aperture, so that it is bright; a **depth-of-field preview** button stops the lens down.

### Focusing screens and aids
- **Ground glass**: a matte surface on which the image forms; blurred when out of focus, and the depth of field of the screen is much greater than the lens's, so it is a poor judge of fine focus with slow lenses.
- **Fresnel condenser** under it, to make the brightness even.
- **Split-image**: two thin prisms in the centre displace the halves of an out-of-focus image sideways in opposite directions; they align at focus.
- **Microprism collar**: a ring of tiny pyramids that makes an out-of-focus image shimmer and clears when sharp.

Both aids black out with lenses slower than about f/5.6, because the prisms reject rays at larger angles.

### Numbers on the box
**Magnification** is quoted for a 50 mm lens at infinity: $M = f/f_e$ with $f_e$ the focal length of the finder's eyepiece system, typically 0.7 to 0.8× for full frame and 0.5 to 0.7× for smaller formats. **Coverage** is the fraction of the picture the finder shows (95 to 100 %). **Eye relief** is the distance at which you can see the whole field: 18 to 22 mm, so that spectacle wearers can use it. **Dioptre adjustment** (about −3 to +1 D) focuses the eyepiece to your eye. An EVF is rated in dots, three per pixel: 2.36 million for 1024 × 768 pixels, 5.76 million for 1600 × 1200.

### Rangefinders
A rangefinder triangulates over a base length $b$ of about 50 to 60 mm (the window spacing times the finder magnification). An eye that can judge an angle $\\Delta\\theta$ resolves $\\Delta z = z^2\\Delta\\theta/b$: 23 mm at 2 m for one arc-minute and a 50 mm base, but 0.6 m at 10 m.

> [!key] A reflex finder shows what the lens sees through a 45° mirror, a focusing screen conjugate to the sensor and a pentaprism; an EVF shows what the sensor sees. Split-image and microprism aids turn focus error into something you can see.
`,
  ideas: [
    'A reflex finder looks through the taking lens: mirror, focusing screen, pentaprism, eyepiece.',
    'The focusing screen is the same optical distance from the mirror as the sensor, so sharp on one is sharp on the other.',
    'The pentaprism makes the image the right way round; the mirror alone gives a left-right reversal.',
    'Split-image and microprism aids make focus error visible; they black out with slow lenses.',
    'An electronic finder shows the sensor image, with exposure and depth of field, and works in the dark.'
  ],
  pitfalls: [
    'A reflex finder shows the depth of field of the picture — It shows the image at full aperture, with the shallowest depth; stop down with the preview button, or use an electronic finder.',
    'A rangefinder sees through the lens — It uses windows beside the lens, so it shows a slightly different view (parallax), and does not show the effect of filters or depth of field.',
    'A bigger finder magnification is always better — A magnification near 0.7 to 0.8× shows the whole picture at a glance; much higher makes you move your eye to see the corners, with a small eye relief.',
    'The mirror box makes SLRs optically better than mirrorless cameras — The finder is a different design, not a sharper one; mirrorless lenses can be as good or better because the short flange distance allows more symmetrical designs.'
  ],
  terms: [
    { term: 'Pentaprism', def: 'A five-sided prism with a roof edge that turns the beam in a reflex finder through two reflections, so that the image appears upright and the right way round.' },
    { term: 'Focusing screen', also: ['ground glass', 'matte screen'], def: 'The translucent plate in a reflex camera on which the lens\'s image forms for viewing; it lies at the same optical distance from the mirror as the sensor.' },
    { term: 'Split-image focusing', also: ['split-image rangefinder', 'Fresnel wedge'], def: 'A focusing aid in which two small prisms displace the halves of the image sideways when the lens is out of focus; they line up when it is sharp.' },
    { term: 'Electronic viewfinder', also: ['EVF'], def: 'A small display with an eyepiece that shows the image from the sensor, with data overlaid. Rated in dots (three per pixel).' },
    { term: 'Parallax', def: 'The difference between the view of a finder that is separate from the taking lens and the picture the lens takes; largest for near subjects.' },
    { term: 'Eye relief', def: 'The distance from the last surface of the eyepiece at which the eye sees the whole field. About 20 mm in a camera viewfinder.' },
    { term: 'Finder magnification', def: 'The size of the image in the finder relative to the scene seen with the naked eye, for a 50 mm lens at infinity. Typical values 0.7 to 0.8×.' }
  ],
  formulas: [
    {
      name: 'Finder magnification',
      expr: 'M = f/fe', tex: 'M = \\frac{f}{f_e}',
      vars: {
        M: { name: 'magnification of the finder' },
        f: { name: 'focal length of the taking lens', q: 'length', unit: 'mm', value: 50 },
        fe: { name: 'focal length of the finder\'s eyepiece system', q: 'length', unit: 'mm', value: 66.7, tex: 'f_e' }
      },
      note: 'Quoted for a 50 mm lens at infinity. A finder with fe = 66.7 mm shows 0.75×.',
      stories: { M: 'A {f} lens is used with a finder whose eyepiece has a focal length of {fe}. What is the magnification?' }
    },
    {
      name: 'Rangefinder depth resolution',
      expr: 'dz = z^2*dth/b', tex: '\\Delta z = \\frac{z^2\\,\\Delta\\theta}{b}',
      vars: {
        dz: { name: 'smallest distinguishable change in distance', q: 'length', unit: 'mm', tex: '\\Delta z' },
        z: { name: 'distance to the subject', q: 'length', unit: 'm', value: 2 },
        dth: { name: 'angular resolution of the eye', q: 'angle', unit: '′', value: 1, tex: '\\Delta\\theta' },
        b: { name: 'effective base length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Triangulation: the accuracy falls as the square of the distance and rises with the base.',
      stories: { dz: 'A rangefinder with an effective base of {b} is used at {z}, with an eye that can judge {dth}. What change in distance can it resolve?' }
    },
    {
      name: 'Dots in an electronic viewfinder',
      expr: 'D = 3*nx*ny', tex: 'D = 3\\,n_x\\,n_y',
      vars: {
        D: { name: 'dot count', int: true },
        nx: { name: 'pixels across', value: 1280, min: 1, max: 10000, int: true, tex: 'n_x' },
        ny: { name: 'pixels down', value: 960, min: 1, max: 10000, int: true, tex: 'n_y' }
      },
      note: 'Each pixel counts as three dots (red, green and blue). 1280 × 960 is the "3.69-million-dot" finder.',
      practice: { unknowns: ['D'] }
    }
  ],
  examples: [
    {
      title: 'A rangefinder at the limit',
      q: 'A rangefinder camera has a window spacing of 69 mm and a finder magnification of 0.72. What is its effective base length, and how closely can it judge a distance of 3 m, assuming the eye resolves one arc-minute (2.9 × 10⁻⁴ rad)?',
      steps: [
        { text: 'The effective base:', tex: 'b = 69 \\times 0.72 = 49.7\\ \\mathrm{mm}' },
        { text: 'The depth resolution:', tex: '\\Delta z = \\frac{z^2\\,\\Delta\\theta}{b} = \\frac{3^2 \\times 2.9\\times10^{-4}}{0.0497} = 0.052\\ \\mathrm{m}' }
      ],
      a: 'An effective base of about 50 mm and a resolution of about 5 cm at 3 m (well within the 1.8 m depth of field of a 50 mm lens at f/8 focused at 3 m).'
    },
    {
      title: 'What does 0.75× mean?',
      q: 'A full-frame SLR with a 50 mm lens at infinity has a finder magnification of 0.75. What is the focal length of the finder\'s eyepiece system, and how big does a lens of 100 mm appear?',
      steps: [
        { text: 'The eyepiece:', tex: 'f_e = \\frac{f}{M} = \\frac{50}{0.75} = 66.7\\ \\mathrm{mm}' },
        { text: 'With a 100 mm lens:', tex: 'M = \\frac{100}{66.7} = 1.5' }
      ],
      a: '66.7 mm; the view through a 100 mm lens is 1.5 times life size (angular size of the scene seen by eye).'
    }
  ],
  quiz: [
    { q: 'In a reflex camera the focusing screen is placed at the same optical distance from the mirror as the sensor. Why?', choices: ['to keep the camera small', 'so that what is sharp on the screen is sharp on the sensor', 'to make the image brighter', 'to reverse the image'], a: 1, why: 'The screen and the sensor are then conjugate planes: both are at the lens\'s image distance. That equality is what lets you focus by eye.' },
    { q: 'What does the pentaprism do?', choices: ['magnifies the image', 'turns the image the right way round and upright', 'makes the finder brighter', 'focuses the lens'], a: 1, why: 'The two reflections inside the prism (with its roof edge) reverse the left-right flip the mirror caused; the eyepiece does the magnifying.' },
    { q: 'A split-image focusing aid works well with an f/8 lens.', a: false, why: 'The wedges accept only rays from a wide aperture; with lenses slower than about f/5.6 half the circle goes dark.' },
    { q: 'An EVF has 1600 × 1200 pixels. How many "dots" is that, in millions? Give the number.', answer: 5.76, why: '$3 \\times 1600 \\times 1200 = 5.76 \\times 10^6$.' },
    { q: 'A rangefinder with an effective base of 50 mm is used at 10 m instead of 2 m. Its depth resolution is…', choices: ['5 times better', 'the same', '5 times worse', '25 times worse'], a: 3, why: '$\\Delta z \\propto z^2$: $(10/2)^2 = 25$.' }
  ],
  applications: [
    'SLRs and mirrorless cameras: choosing a reflex finder for lag-free viewing or an EVF for exposure preview and dim light.',
    'Rangefinder cameras for street photography with wide and normal lenses, where their quiet and small size matter.',
    'Medium-format and view cameras with ground glass, magnified with a loupe to check focus.',
    'Cine cameras with a reflex shutter finder that shows the picture through the lens even while the film runs.',
    'Surveying and gun sights, where the same optical principles give an erect, magnified view.'
  ],
  history: 'The reflex mirror was in plate cameras by the 1860s. The pentaprism 35 mm camera came with the Contax S (1949); the instant-return mirror with the Asahi Pentax of 1957, and the Nikon F (1959) made the system camera. Electronic finders appeared in video cameras in the 1980s and in still cameras in the early 2000s, and replaced optical ones in many models with the mirrorless cameras after 2008.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — reflex finders, focusing screens and viewfinder magnification.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the pentaprism and the viewfinder as an optical system.',
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the section on prisms, including the reflecting and roof prisms.'
  ],
  sim: 'cb-viewfinder'
}

);
