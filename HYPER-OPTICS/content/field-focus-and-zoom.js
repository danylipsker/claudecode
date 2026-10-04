/* HYPER-OPTICS · content/field-focus-and-zoom.js — the topic "Field of view, focus and zoom".
 * What a camera lens sees, how sharp it is at different distances, and how its view is changed:
 *   field-of-view-and-focal-length, crop-factor-and-equivalent-focal-length, magnification-and-working-distance,
 *   depth-of-field, hyperfocal-distance, circle-of-confusion, focusing-a-lens, autofocus-methods, optical-zoom,
 *   digital-zoom, varifocal-and-parfocal-lenses, close-up-and-extension-tubes, perspective-and-focal-length.
 * Simulations are in sims/field-focus-and-zoom.js (prefix fz-).
 */
Hyper.add(

/* ================================================================ field of view */
{
  id: 'field-of-view-and-focal-length', parent: 'field-focus-and-zoom', title: 'Field of view and focal length', level: 1,
  short: 'The angle of view of a camera is set by two things only: the focal length of the lens and the size of the sensor. A short focal length sees a wide wedge of the world, a long one a narrow slice: 2·atan(w / 2f), about 40° across for a 50 mm lens on a 36 mm wide sensor.',
  keywords: ['field of view', 'FOV', 'angle of view', 'AOV', 'wide angle', 'normal lens', 'standard lens', 'telephoto', 'focal length', 'scene width', 'IFOV', 'horizontal vertical diagonal', 'coverage', 'choosing a lens'],
  prereq: ['focal-length-and-optical-power', 'field-stop-and-field-of-view', 'sensor-formats-and-pixel-size'],
  related: ['crop-factor-and-equivalent-focal-length', 'magnification-and-working-distance', 'perspective-and-focal-length', 'optical-zoom', 'choosing-a-machine-vision-lens', 'fisheye-lenses', 'telephoto-lens', 'retrofocus-wide-angle', 'image-circle-and-sensor-coverage', 'projections:field-of-view-and-focal-length'],
  body: `
Hold a camera still and the picture contains a fixed slice of the world: a wedge of directions, wide for a wide-angle lens, narrow for a telephoto. The width of that wedge is the **angle of view**, or **field of view** (FOV). It depends on two things only — the **focal length** of the lens and the **size of the sensor** behind it.

### The geometry
A ray through the centre of the lens goes straight on. A sensor of width $w$ sits one focal length $f$ behind the lens (for a lens focused at infinity), so the half-angle of the wedge is the angle whose tangent is $(w/2)/f$:

$$\\text{AOV} = 2\\arctan\\frac{w}{2f}$$

Put the sensor's width in for the horizontal angle, its height for the vertical angle, its diagonal for the diagonal angle — the one printed on most lens boxes. The sensor is the [[field-stop-and-field-of-view|field stop]] of the camera: its edges set the edges of the picture.

| Focal length | Full frame, horizontal | Full frame, diagonal | APS-C, diagonal |
|---|---|---|---|
| 14 mm | 104° | 114° | 91° |
| 24 mm | 74° | 84° | 61° |
| 35 mm | 54° | 63° | 44° |
| 50 mm | 40° | 47° | 32° |
| 85 mm | 24° | 29° | 19° |
| 200 mm | 10.3° | 12.3° | 8.1° |
| 400 mm | 5.2° | 6.2° | 4.1° |

(Full frame is 36 × 24 mm; APS-C here 23.6 × 15.7 mm.) Notice that doubling $f$ halves the *width of the scene*, but the angle only roughly halves, and only when it is small: 24 → 48 mm takes 73.7° to 41.1°, while 200 → 400 mm takes 10.3° to 5.2°.

### Wide, normal, telephoto
The names are relative to the sensor. A **normal** lens has a focal length about equal to the sensor's diagonal — 43 mm, rounded to 50 mm, on full frame — and gives a diagonal angle near 47°. **Wide-angle** lenses are shorter (below about 35 mm; under 20 mm is *ultra-wide*); **telephoto** lenses are longer (above about 85 mm; over 300 mm is *super-telephoto*). The same 50 mm lens is normal on full frame but strongly telephoto on a small sensor: the 4.3 mm lens of a phone with a 6.17 mm wide sensor has a horizontal angle of 71°, a wide view.

### How much scene fits
At object distance $s$ the scene is $W = w\\,(s-f)/f \\approx w\\,s/f$ wide. A 50 mm lens on full frame at 10 m takes in 7.2 m by 4.8 m. Turned round, this is how a lens is chosen: to cover a width $W$ from a distance $s$ you need $f = s\\,w/(W+w)$.

### Per pixel
Dividing the sensor's angle among its pixels gives the **instantaneous field of view**, $\\text{IFOV} = p/f$ for a pixel pitch $p$: 3.45 µm pixels behind a 50 mm lens each see 0.069 mrad, 7 mm across at 100 m.

### Limits of the formula
- Focused close, the angle changes (**focus breathing**). In a lens that simply extends, the image lies farther behind the lens and the angle narrows: a 50 mm lens focused 0.39 m from its centre drops from 39.6° to 34.9°. Lenses with internal focusing change by more, usually the other way. See [[focusing-a-lens]].
- The formula is for a **rectilinear** lens, where straight lines stay straight. [[fisheye-lenses|Fisheye lenses]] map angle to image height differently and see 180° with a few millimetres of focal length.
- The lens must light the whole sensor; if its image circle is smaller than the sensor, the corners go dark ([[image-circle-and-sensor-coverage]]).

> [!key] The angle of view is $2\\arctan(w/2f)$: a bigger sensor or a shorter focal length gives a wider view. "Wide", "normal" and "telephoto" are relative to the sensor, and "normal" means a focal length near its diagonal.
`,
  ideas: [
    'The angle of view is 2·atan(w / 2f): only the sensor size and the focal length enter.',
    'There are three angles for one picture: horizontal, vertical and diagonal. Catalogues usually quote the diagonal.',
    'Wide, normal and telephoto are relative to the sensor: normal means a focal length near the sensor diagonal.',
    'The scene width at distance s is about w·s/f; a lens for a given scene has f = s·w/(W + w).',
    'Focusing close changes the field a little (focus breathing: it narrows in a simple extending lens); fisheye lenses follow a different law.'
  ],
  pitfalls: [
    'A long lens brings the subject closer — It only selects a narrower slice of the same view and enlarges it in the picture. Where objects stand relative to each other is set by where the camera stands, not by the lens ([[perspective-and-focal-length]]).',
    'The focal length alone tells how wide the picture is — Only together with the sensor: 50 mm is a 40° lens on full frame and a 14.6° one on a 1" sensor.',
    'Doubling the focal length halves the angle — It halves the width of the scene at a given distance, which goes as $\\tan(A/2)$; the angle itself halves only when it is small.',
    'The field of view is a single number — A 3:2 sensor has a wider horizontal than vertical angle (40° by 27° at 50 mm); the figure on the box is the diagonal.'
  ],
  terms: [
    { term: 'Angle of view', also: ['AOV', 'field of view', 'FOV', 'viewing angle'], def: 'The angle between the two edges of the scene a camera records, measured at the lens: 2·atan(w/2f) for a sensor dimension w and a focal length f.' },
    { term: 'Scene width', also: ['field width', 'object field', 'FOV width'], def: 'The width of the part of the scene that fills the sensor, measured at the object: about sensor width × object distance ÷ focal length.' },
    { term: 'Normal lens', also: ['standard lens'], def: 'A lens whose focal length is about equal to the diagonal of the sensor (50 mm on full frame). Its picture looks natural to most viewers.' },
    { term: 'Wide-angle lens', also: ['ultra-wide'], def: 'A lens of focal length clearly shorter than the sensor diagonal, giving a wide angle of view.' },
    { term: 'Telephoto lens', also: ['long lens', 'tele'], def: 'In everyday use, a lens of long focal length and so a narrow angle of view. Strictly, a design that is shorter than its focal length ([[telephoto-lens]]).' },
    { term: 'Instantaneous field of view', also: ['IFOV'], def: 'The angle covered by one pixel: pixel pitch divided by focal length, in milliradians. It sets the smallest detail the camera can separate at a distance.' },
    { term: 'Focus breathing', def: 'The change in angle of view as a lens is focused from far to near. A lens that simply extends narrows its view; an internal-focusing lens, whose focal length changes, usually widens it.' }
  ],
  formulas: [
    {
      name: 'Angle of view',
      expr: 'A = 2*atan(w/(2*f))', tex: 'A = 2\\arctan\\frac{w}{2f}',
      vars: {
        A: { name: 'angle of view', q: 'angle', unit: '°', min: 0.1, max: 175 },
        w: { name: 'sensor dimension (width, height or diagonal)', q: 'length', unit: 'mm', value: 36 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Lens focused at infinity, rectilinear. Use the width for the horizontal angle, the diagonal for the diagonal angle.',
      stories: { A: 'A sensor {w} wide sits behind a lens of focal length {f}. What is the angle of view across that width?', f: 'What focal length gives a sensor {w} wide an angle of view of {A}?' }
    },
    {
      name: 'Width of the scene',
      expr: 'W = w*(s - f)/f', tex: 'W = \\frac{w\\,(s - f)}{f}',
      vars: {
        W: { name: 'width of the scene at the object', q: 'length', unit: 'm' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 36 },
        s: { name: 'object distance (from the lens)', q: 'length', unit: 'm', value: 10, min: 0.06, max: 1000 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      solveFor: 'W',
      note: 'Thin-lens form, exact for a lens focused on the object. Solve it for f to choose a lens for a given scene.',
      stories: { W: 'A camera with a {w} wide sensor and a {f} lens looks at a scene {s} away. How wide is the strip it records?', f: 'A scene {W} wide is to fill a sensor {w} wide from {s}. What focal length is needed?' }
    },
    {
      name: 'Angle covered by one pixel',
      expr: 'ifov = p/f', tex: '\\text{IFOV} = \\frac{p}{f}',
      vars: {
        ifov: { name: 'instantaneous field of view', q: 'angle', unit: 'mrad', tex: '\\text{IFOV}' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Small-angle form. Multiply by the distance to get the size of a pixel on the object.',
      stories: { ifov: 'A camera with {p} pixels has a {f} lens. What angle does one pixel cover?' }
    }
  ],
  examples: [
    {
      title: 'Framing a group',
      q: 'A photographer on a full-frame camera (36 mm wide sensor) stands 6 m from a row of people 4 m wide. Which focal length just fits them across the frame?',
      steps: [
        { text: 'Solve the scene-width relation for the focal length:', tex: 'f = \\frac{s\\,w}{W + w} = \\frac{6000\\times 36}{4000 + 36} = 53.5\\ \\mathrm{mm}' },
        'A 50 mm lens would give a scene $W = 36\\,(6000-50)/50 = 4.28$ m wide — a little looser than needed, which leaves room at the edges.'
      ],
      a: 'About 54 mm: a normal lens, as expected for a group seen from a few metres.'
    },
    {
      title: 'A phone and its "equivalent"',
      q: 'The main camera of a phone has a 1/2.3" sensor (6.17 mm wide) and a 4.3 mm lens. What is its horizontal angle of view, and which full-frame focal length (36 mm wide) gives the same angle?',
      steps: [
        { text: 'The phone:', tex: 'A = 2\\arctan\\frac{6.17}{2\\times 4.3} = 2\\arctan 0.717 = 71.3°' },
        { text: 'The full-frame lens with the same half-angle (35.7°):', tex: 'f = \\frac{36}{2\\tan 35.7°} = 25\\ \\mathrm{mm}' }
      ],
      a: '71.3°, the same view as a 25 mm lens on full frame — which is how phone makers quote "24 mm equivalent" ([[crop-factor-and-equivalent-focal-length]]).'
    }
  ],
  quiz: [
    { q: 'A lens made for a full-frame camera is moved to a camera with a smaller (APS-C) sensor. The field of view becomes…', choices: ['narrower: the smaller sensor catches only the middle of the image', 'wider, because the sensor is closer to the lens', 'unchanged, since the focal length is the same', 'impossible to say without the f-number'], a: 0, why: 'The angle is $2\\arctan(w/2f)$ and $w$ has fallen while $f$ has not. The lens does not change; the sensor simply records less of its picture.' },
    { q: 'With the same lens at the same distance, a sensor twice as wide records a scene twice as wide.', a: true, why: 'The scene width is $W = w(s-f)/f$, proportional to the sensor width $w$.' },
    { q: 'What is the horizontal angle of view, in degrees, of a 100 mm lens on a sensor 36 mm wide?', answer: 20.4, unit: '°', why: '$2\\arctan(36/200) = 2\\arctan 0.18 = 20.4°$. A full-frame 100 mm is a moderate telephoto.' },
    { q: 'Which lens is "normal" for a 1" sensor, whose diagonal is 16 mm?', choices: ['About 16 mm', 'About 50 mm', 'About 8 mm', 'About 100 mm'], a: 0, why: 'A normal lens has a focal length near the sensor diagonal. A 50 mm lens on a 1" sensor is a telephoto (diagonal angle 18°).' },
    { q: 'A simple 50 mm lens that is focused by moving it away from the sensor is focused from infinity to a subject only 0.4 m away. What happens to its angle of view?', choices: ['It narrows slightly (focus breathing)', 'It widens', 'It does not change at all', 'It doubles'], a: 0, why: 'Focusing close moves the lens away from the sensor. The image is formed farther behind the lens than $f$, and the same sensor catches a narrower angle.' }
  ],
  applications: [
    'Security and traffic cameras: the lens is chosen so that the width covered at the distance of interest (a doorway, a lane) fills the sensor.',
    'Phones with three or four rear cameras: ultra-wide, wide and telephoto modules are different focal lengths on different sensors, labelled by their angle or their equivalent focal length.',
    'Astrophotography: a 1000 mm telescope with an APS-C sensor frames 1.35° by 0.90°, enough for the 0.5° Moon with room to spare.',
    'Machine vision: the field width and the working distance fix the focal length of the lens, the first step in [[choosing-a-machine-vision-lens]].',
    'Film and television: directors choose lenses by their angle, and a set of primes is often 18, 25, 35, 50, 75 and 100 mm.'
  ],
  history: 'The 24 × 36 mm still-picture format was made by Oskar Barnack at Leitz, who around 1913–14 ran two cine frames (18 × 24 mm) side by side. The Leica I of 1925 carried a 50 mm f/3.5 lens, and 50 mm has been the "normal" lens of the format ever since, although the diagonal is 43 mm.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — angle of view, covering power and the choice of focal length.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — field angle, image scale and the practical tables of coverage.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE Press, 2004) — stops, pupils and the field of view on one page each.',
    'E. Hecht, *Optics* — the chapter on geometrical optics: stops and the field of view.'
  ],
  sim: 'fz-fov'
},

/* ================================================================ crop factor */
{
  id: 'crop-factor-and-equivalent-focal-length', parent: 'field-focus-and-zoom', title: 'Crop factor and equivalent focal length', level: 2,
  short: 'The crop factor of a sensor is the full-frame diagonal (43.27 mm) divided by its own. Multiply the focal length by it to find the full-frame lens with the same field of view; multiply the f-number by it too and you have the lens that also gives the same depth of field and the same total light.',
  keywords: ['crop factor', 'equivalent focal length', '35 mm equivalent', 'full frame', 'APS-C', 'Four Thirds', 'sensor size', 'equivalent aperture', 'focal length multiplier', 'FOV equivalent', 'equivalence', 'ISO equivalent'],
  prereq: ['field-of-view-and-focal-length', 'sensor-formats-and-pixel-size', 'the-f-number'],
  related: ['depth-of-field', 'circle-of-confusion', 'image-circle-and-sensor-coverage', 'sensor-noise', 'iso-and-gain', 'exposure-and-the-exposure-triangle', 'the-phone-camera', 'photographic-lens-mounts', 'projections:field-of-view-and-focal-length'],
  body: `
Put a 50 mm lens on a full-frame camera and on a camera with a smaller sensor. The lens is the same: its focal length is 50 mm in both. What differs is how much of the lens's picture the sensor catches. The smaller one records only the middle, so the scene looks magnified. That is the **crop**, and the number that states it is the **crop factor**.

### The crop factor
The reference is the 36 × 24 mm film frame, called **full frame**; its diagonal is 43.27 mm. For any sensor,

$$C = \\frac{43.27\\ \\text{mm}}{\\text{diagonal}}$$

| Sensor | Size (mm) | Diagonal (mm) | Crop factor |
|---|---|---|---|
| Medium format 44 × 33 | 43.8 × 32.9 | 54.8 | 0.79 |
| Full frame | 36 × 24 | 43.3 | 1.00 |
| Super 35 (cine) | 24.9 × 18.7 | 31.1 | 1.39 |
| APS-C | 23.6 × 15.7 | 28.4 | 1.53 |
| Four Thirds | 17.3 × 13.0 | 21.6 | 2.00 |
| 1" type | 12.8 × 9.6 | 16.0 | 2.70 |
| 1/2.3" type | 6.17 × 4.55 | 7.67 | 5.64 |

(Other makers' APS-C sensors are a little smaller, for example 22.3 × 14.9 mm, crop 1.6.) The diagonal is used because it is the one number that makes sense when the aspect ratios differ, 3:2 against 4:3.

### Equivalent focal length
$$f_{\\text{eq}} = C\\,f$$

is the full-frame focal length with the same angle of view. A 35 mm lens on APS-C gives the view of a 54 mm lens; a 25 mm lens on Four Thirds, of a 50 mm lens; the 4.3 mm lens of a phone, of one of 24 mm. Nothing has happened to the lens itself: its perspective, its image of a distant object (which depends on $f$ alone) and its f-number are unchanged. The "equivalent" is only a statement about how the picture is framed — which is why it is not a "multiplier" of the lens.

### Equivalent aperture: depth of field and noise
Two pictures of the same scene from the same place with the same angle of view look alike in depth of field when the lenses have the same **entrance pupil diameter** $D = f/N$, because the sensor with the smaller diagonal also has the smaller [[circle-of-confusion]]. So multiply the f-number as well:

$$N_{\\text{eq}} = C\\,N \\qquad \\text{ISO}_{\\text{eq}} = C^2\\,\\text{ISO}$$

A 25 mm f/1.8 lens on Four Thirds ($C = 2$) matches a 50 mm f/3.6 lens on full frame: both have a 13.9 mm pupil. The traced depth of field at 3 m agrees: 0.84 m against 0.83 m. The ISO rule comes from the area: at one f-number the illuminance on the sensor is the same, but a sensor with $C^2$ times the area gathers $C^2$ times as many photons, and photon noise falls as the square root. ISO 400 on Four Thirds is as noisy as ISO 1600 on full frame.

### What equivalence does not say
- The **exposure** (brightness) follows the real f-number: f/1.8 needs the same shutter time on both formats at the same ISO.
- It compares *physics*, not cameras: pixel size, read noise and quantum efficiency differ from sensor to sensor.
- Diffraction follows the real f-number too, and its blur is larger relative to a small sensor: f/8 on a 1" sensor blurs about as much, relative to the frame, as f/22 on full frame.
- A lens built for a small sensor may not cover a larger one ([[image-circle-and-sensor-coverage]]).

> [!key] $C$ = 43.27 mm ÷ diagonal. Multiply the focal length by $C$ for the same field of view; multiply the f-number by $C$ as well for the same depth of field, and the ISO by $C^2$ for the same noise.
`,
  ideas: [
    'The crop factor is 43.27 mm divided by the sensor diagonal: 1.53 for APS-C, 2.0 for Four Thirds, 5.6 for a phone sensor.',
    'The equivalent focal length is C·f: the full-frame lens with the same angle of view. The lens itself does not change.',
    'For the same depth of field multiply the f-number by C too: equal entrance pupils give equal pictures.',
    'The same illuminance falls on every sensor at one f-number, but a larger sensor collects more photons in all, so it is less noisy.',
    'Exposure and diffraction follow the real f-number; equivalence does not compare the quality of the sensors.'
  ],
  pitfalls: [
    'A crop sensor multiplies the focal length of the lens — The focal length is a property of the lens and stays 50 mm. The smaller sensor merely records the central part of the picture, with the same perspective.',
    'f/2 is f/2 on every camera, so the pictures match — The brightness matches, but a full-frame lens of the same field and the same depth of field would be f/4 against Four Thirds f/2; the smaller sensor gives deeper focus.',
    'A crop-sensor lens works equally well on a full-frame body — Its image circle may cover only the smaller sensor; on a larger one the corners are dark or cut off.',
    'The crop factor is the ratio of the widths — It is the ratio of the diagonals, so it holds for sensors of different shape only approximately for the horizontal and vertical angles.'
  ],
  terms: [
    { term: 'Crop factor', also: ['focal length multiplier', 'format factor', 'sensor factor'], def: 'The ratio of the diagonal of the 36 × 24 mm full-frame sensor (43.27 mm) to the diagonal of the sensor in question.' },
    { term: 'Equivalent focal length', also: ['35 mm equivalent', '35 mm-equivalent focal length', 'FOV equivalent'], def: 'The focal length that a full-frame camera would need for the same angle of view: the true focal length times the crop factor.' },
    { term: 'Full frame', also: ['35 mm format', '24 × 36'], def: 'A sensor of 36 × 24 mm, the size of the frame of 35 mm still film. The reference format for crop factors.' },
    { term: 'APS-C', def: 'A family of sensors about 23.6 × 15.7 mm (crop factor about 1.5) or 22.3 × 14.9 mm (about 1.6), named after a film format of the 1990s.' },
    { term: 'Equivalent aperture', also: ['equivalent f-number'], def: 'The f-number multiplied by the crop factor: the full-frame f-number that gives the same depth of field and total light for the same field of view.' }
  ],
  formulas: [
    {
      name: 'Crop factor from the sensor size',
      expr: 'cf = 43.27/sqrt(w^2 + h^2)', tex: 'C = \\frac{43.27\\ \\mathrm{mm}}{\\sqrt{w^2 + h^2}}',
      vars: {
        cf: { name: 'crop factor', tex: 'C' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 23.6 },
        h: { name: 'sensor height', q: 'length', unit: 'mm', value: 15.7 }
      },
      stories: { cf: 'A sensor measures {w} by {h}. What is its crop factor?' }
    },
    {
      name: 'Equivalent focal length',
      expr: 'fe = cf*f', tex: 'f_{\\text{eq}} = C\\,f',
      vars: {
        fe: { name: 'equivalent focal length', q: 'length', unit: 'mm', tex: 'f_{\\text{eq}}' },
        cf: { name: 'crop factor', value: 1.53, min: 0.5, max: 10, tex: 'C' },
        f: { name: 'real focal length', q: 'length', unit: 'mm', value: 35 }
      },
      stories: { fe: 'A {f} lens is used on a camera with a crop factor of {cf}. What full-frame focal length gives the same view?', f: 'A phone quotes a {fe} equivalent lens on a sensor with a crop factor of {cf}. What is the real focal length?' }
    },
    {
      name: 'Equivalent f-number and ISO',
      expr: 'Ne = cf*N', tex: 'N_{\\text{eq}} = C\\,N',
      vars: {
        Ne: { name: 'equivalent f-number', tex: 'N_{\\text{eq}}' },
        cf: { name: 'crop factor', value: 2, min: 0.5, max: 10, tex: 'C' },
        N: { name: 'real f-number', value: 1.8, min: 0.5, max: 64 }
      },
      note: 'Same field of view, same depth of field, same total light. The real exposure still uses N.',
      stories: { Ne: 'A lens on a camera with a crop factor of {cf} is set to f/{N}. At what f-number would a full-frame lens give the same depth of field?' }
    },
    {
      name: 'Equivalent ISO for the same noise',
      expr: 'ISOe = cf^2*ISO', tex: '\\text{ISO}_{\\text{eq}} = C^2\\,\\text{ISO}',
      vars: {
        ISOe: { name: 'full-frame ISO with the same noise', tex: '\\text{ISO}_{\\text{eq}}' },
        cf: { name: 'crop factor', value: 2, min: 0.5, max: 10, tex: 'C' },
        ISO: { name: 'real ISO setting', value: 400, min: 25, max: 204800, tex: '\\text{ISO}' }
      },
      note: 'A rule of thumb for equal exposure time and equal efficiency of the sensors.'
    }
  ],
  examples: [
    {
      title: 'Matching a standard zoom',
      q: 'A full-frame photographer uses a 24–70 mm f/2.8 zoom. What lens on a Four Thirds camera ($C = 2.00$) gives the same field of view *and* the same depth of field?',
      steps: [
        { text: 'Halve the focal lengths and the f-number:', tex: 'f = \\frac{24\\text{–}70}{2} = 12\\text{–}35\\ \\mathrm{mm} \\qquad N = \\frac{2.8}{2} = 1.4' },
        'The entrance pupil at 35 mm is $35/1.4 = 25$ mm, the same as $70/2.8$ on full frame.'
      ],
      a: 'A 12–35 mm f/1.4. The usual f/2.8 zooms for that format are equivalent to a full-frame f/5.6 in depth of field, and give less shallow focus.'
    },
    {
      title: 'Why phone pictures are sharp from near to far',
      q: 'A phone camera has a 4.3 mm f/1.8 lens on a 1/2.3" sensor. What full-frame lens does it match, and what ISO does a setting of ISO 100 correspond to in noise?',
      steps: [
        { text: 'With $C = 5.64$:', tex: 'f_{\\text{eq}} = 5.64\\times 4.3 = 24\\ \\mathrm{mm}, \\qquad N_{\\text{eq}} = 5.64\\times 1.8 = 10.2' },
        { text: 'and for the noise:', tex: '\\text{ISO}_{\\text{eq}} = 5.64^2\\times 100 \\approx 3200' }
      ],
      a: 'A 24 mm f/10 lens at ISO 3200: deep focus and, without computational help, noise to match. Phones add multi-frame processing to make up the difference.'
    }
  ],
  quiz: [
    { q: 'A 35 mm lens is used on a camera whose crop factor is 1.53. Which full-frame focal length (mm) gives the same field of view?', answer: 53.55, unit: 'mm', why: '$f_{\\text{eq}} = C f = 1.53\\times 35 = 53.6$ mm. The lens is still a 35 mm lens.' },
    { q: 'Putting a full-frame lens on an APS-C camera changes the focal length of the lens to about 1.5 times.', a: false, why: 'The focal length belongs to the lens. Only the angle of view changes, because the sensor is smaller; the perspective and the image of a distant object are the same.' },
    { q: 'A lens at f/2 on a Four Thirds camera ($C = 2$) gives the depth of field of which full-frame f-number?', choices: ['f/4', 'f/1', 'f/2', 'f/2.8'], a: 0, why: 'Multiply the f-number by the crop factor: $2\\times 2 = 4$. Both lenses, framed alike, have the same entrance pupil.' },
    { q: 'Two cameras are both set to f/2, ISO 200 and 1/100 s and point at the same wall. Their pictures have…', choices: ['the same brightness', 'a brighter picture from the larger sensor', 'a brighter picture from the smaller sensor', 'different brightness depending on the crop factor'], a: 0, why: 'The illuminance on the sensor depends on the f-number alone, so the exposure is the same. The larger sensor gathers more light in total and is less noisy, but it is not brighter.' },
    { q: 'A camera with a crop factor of 2 is used at ISO 400. A full-frame camera of equal efficiency would show similar noise at what ISO?', answer: 1600, why: '$C^2\\times 400 = 4\\times 400 = 1600$: the full-frame sensor has four times the area and so collects four times the light.' }
  ],
  applications: [
    'Reading phone specifications: "24 mm equivalent" says which field of view the lens gives without needing the sensor size.',
    'Choosing lenses for a second camera system so that the set of fields of view matches the first.',
    'Cinema: Super 35 lenses are described by the full-frame focal length that would frame the same shot.',
    'Understanding why small-sensor cameras find it hard to blur a background — and why they are small and light.',
    'Astronomy: the field of a telescope on different cameras is compared by crop factor.'
  ],
  history: 'The term appeared in the late 1990s, when the first professional digital SLRs (the Nikon D1 of 1999 among them) put sensors of about 23.7 × 15.6 mm behind lenses made for 35 mm film, and photographers needed a way to say what their old lenses now did. "Equivalence" in the stricter sense of depth of field and noise was worked out by photographers and lens designers in the following years.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — angle of view and covering power for different formats.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the relation between format, focal length and depth of field.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — sensor size, photons collected and noise.',
    'W. J. Smith, *Modern Optical Engineering* — the chapters on stops and pupils for the entrance pupil as the common measure.'
  ],
  sim: 'fz-crop'
},

/* ================================================================ magnification and working distance */
{
  id: 'magnification-and-working-distance', parent: 'field-focus-and-zoom', title: 'Magnification and working distance', level: 2,
  short: 'Magnification m is the size of the image divided by the size of the object. Machine-vision lenses are chosen by it: m = sensor width ÷ field width, and with the focal length it fixes the working distance, f(1 + 1/m). At 1:1 the object and the sensor are 4f apart.',
  keywords: ['magnification', 'working distance', 'WD', 'object distance', 'reproduction ratio', 'm', '0.2x', '1:5', 'field width', 'machine vision lens', 'track length', 'pixel size on object', 'minimum object distance'],
  prereq: ['lateral-and-longitudinal-magnification', 'the-thin-lens-equation', 'field-of-view-and-focal-length'],
  related: ['choosing-a-machine-vision-lens', 'telecentric-imaging', 'telecentric-lenses', 'macro-lenses', 'close-up-and-extension-tubes', 'pixels-per-feature', 'sensor-formats-and-pixel-size', 'reading-a-lens-datasheet', 'focusing-a-lens'],
  body: `
A photographer talks about angles — "what does this lens see?". An engineer who must inspect a 44 mm wide part on a conveyor talks about **magnification**: how large the part's image must be on the sensor. The two are the same facts from different ends.

### Magnification
The lateral magnification is $m = \\text{image size}/\\text{object size}$, written 0.2× or 1:5 (the "reproduction ratio"). The sensor of width $w$ must cover a field of width $W$, so

$$m = \\frac{w}{W}$$

and a lens of focal length $f$ focused on an object at distance $s$ gives, from the lens equation,

$$m = \\frac{f}{s - f}$$

For a 25 mm lens: at $s = 1$ m, $m = 0.0256$ (1:39); at 0.5 m, 0.053; at 0.3 m, 0.091; at 0.15 m, 0.200.

| Object distance $s$ | $m$ | Field width on an 8.8 mm sensor | One 3.45 µm pixel covers |
|---|---|---|---|
| 1000 mm | 0.0256 | 343 mm | 135 µm |
| 500 mm | 0.0526 | 167 mm | 66 µm |
| 300 mm | 0.0909 | 97 mm | 38 µm |
| 150 mm | 0.2000 | 44 mm | 17 µm |

### Object distance and working distance
The $s$ of the lens equation is measured from the lens — strictly from its front principal plane, which in a thick lens may lie inside the barrel. The **working distance** (WD) of a catalogue is a *mechanical* distance, from the front of the lens housing to the object. They can differ by tens of millimetres, and the difference matters when a light or a mirror must fit in the gap. Photographers' **minimum object distance** (MOD) is yet another convention, measured from the sensor.

### Choosing a lens: the recipe
1. **Magnification.** Divide the sensor width by the field width: 8.8 mm ÷ 44 mm gives $m = 0.2$.
2. **Focal length.** For a working distance $s$, take $f = s\\,m/(1+m)$. With 300 mm to spare, $f = 50$ mm; with 150 mm, $f = 25$ mm.
3. **Extension.** The lens sits a distance $v = f(1+m)$ from the sensor: 60 mm for the 50 mm lens, more than its focal length. Fixed lenses build that in; at higher $m$ a spacer is added ([[close-up-and-extension-tubes]]).
4. **Track.** Object to sensor is $f\\,(2 + m + 1/m)$, never less than $4f$, and equal to it at 1:1.

### What the pixel sees
One pixel of pitch $p$ covers $p/m$ on the object: 17 µm for 3.45 µm pixels at 0.2×. That is the measuring ruler of the system, and a defect must span several of them ([[pixels-per-feature]]).

### Two kinds of lens
An ordinary lens trades distance for magnification: move the object and $m$ changes, the field width with it. A **telecentric** lens has $m$ fixed by design (0.1×, 0.25×, 0.5× …) and a fixed working distance, so a part measured at slightly the wrong height still measures the same ([[telecentric-imaging]]).

> [!tip] On a lens datasheet "magnification" or "WD" ranges give the settings the focus ring covers; check that the working distance is measured from the front of the housing and that the sensor in the table is the one you will use.

> [!key] $m = w/W = f/(s-f)$. For a wanted $m$ and distance, $f = s\\,m/(1+m)$; the lens sits at $f(1+m)$ from the sensor, and a 1:1 set-up needs $4f$ from object to sensor.
`,
  ideas: [
    'Magnification m = image size ÷ object size = sensor width ÷ field width = f/(s − f).',
    'For a wanted magnification and distance: f = s·m/(1 + m), and the lens sits at f(1 + m) from the sensor.',
    'Object to sensor is f(2 + m + 1/m), a minimum of 4f at 1:1.',
    'The working distance of a catalogue is measured from the front of the lens housing, not from the principal plane.',
    'One pixel covers p/m on the object. A telecentric lens fixes m and the working distance by design.'
  ],
  pitfalls: [
    'A 0.5× lens makes the object half its size on the sensor… always — The marked value holds at one working distance (or for a telecentric lens). An ordinary lens gives other values at other distances.',
    'Working distance and object distance are the same — The working distance is mechanical, from the front of the housing; the object distance in the lens equation is from the principal plane.',
    'Magnification is the same as zoom — Zoom changes the focal length; magnification is image size over object size and changes with distance as well.',
    'A bigger sensor needs a bigger magnification to see the same field — The opposite: for the same field, $m = w/W$ grows with the sensor width.'
  ],
  terms: [
    { term: 'Magnification', also: ['lateral magnification', 'm', 'reproduction ratio', 'image scale'], def: 'The size of the image divided by the size of the object, written 0.2× or 1:5. For a camera it is sensor width ÷ field width.' },
    { term: 'Working distance', also: ['WD', 'object distance (mechanical)'], def: 'The distance from the front of the lens housing to the object when it is in focus. It is what you measure with a ruler, not the s of the lens equation.' },
    { term: 'Field width', also: ['field of view (machine vision)', 'FOV width', 'object field'], def: 'The width of the part of the object that fills the sensor. Machine-vision specifications give it in millimetres.' },
    { term: 'Minimum object distance', also: ['MOD', 'closest focusing distance'], def: 'The closest distance at which a lens can focus, usually measured from the sensor plane. It fixes the largest magnification.' },
    { term: 'Track length', also: ['object-to-image distance', 'conjugate distance'], def: 'The distance from object to image, f(2 + m + 1/m) for a thin lens; at least 4f.' },
    { term: 'Pixel footprint', also: ['object-space pixel size', 'resolution (machine vision)'], def: 'The size on the object that one sensor pixel covers: the pixel pitch divided by the magnification.' }
  ],
  formulas: [
    {
      name: 'Magnification from the sensor and the field',
      expr: 'm = w/W', tex: 'm = \\frac{w}{W}',
      vars: {
        m: { name: 'magnification' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 8.8 },
        W: { name: 'field width on the object', q: 'length', unit: 'mm', value: 44 }
      },
      stories: { m: 'A sensor {w} wide must cover a field {W} wide. What magnification is needed?', W: 'A lens gives a magnification of {m} on a sensor {w} wide. How wide is the field?' }
    },
    {
      name: 'Magnification from focal length and distance',
      expr: 'm = f/(s - f)', tex: 'm = \\frac{f}{s - f}',
      vars: {
        m: { name: 'magnification' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 25 },
        s: { name: 'object distance (from the lens)', q: 'length', unit: 'mm', value: 150, min: 1, max: 100000 }
      },
      note: 'Thin lens focused on the object. Solve for s to get the distance for a wanted magnification.',
      stories: { m: 'A {f} lens is focused on an object {s} from it. What is the magnification?', s: 'A {f} lens must give a magnification of {m}. How far from the lens must the object be?', f: 'At {s} a lens gives a magnification of {m}. What is its focal length?' }
    },
    {
      name: 'Distance from object to sensor',
      expr: 'T = f*(2 + m + 1/m)', tex: 'T = f\\left(2 + m + \\frac{1}{m}\\right)',
      vars: {
        T: { name: 'object-to-sensor distance', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        m: { name: 'magnification', value: 0.2, min: 0.001, max: 20 }
      },
      note: 'Thin lens. The least value, 4f, is at m = 1.',
      stories: { T: 'A {f} lens works at a magnification of {m}. How far apart are the object and the sensor?' }
    },
    {
      name: 'Pixel footprint on the object',
      expr: 'q = p/m', tex: 'q = \\frac{p}{m}',
      vars: {
        q: { name: 'size on the object covered by one pixel', q: 'length', unit: 'µm' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 },
        m: { name: 'magnification', value: 0.2, min: 0.001, max: 20 }
      },
      stories: { q: 'Pixels {p} wide look through a lens of magnification {m}. How much of the object does one pixel cover?' }
    }
  ],
  examples: [
    {
      title: 'A lens for a 44 mm field',
      q: 'A camera has a 2/3" sensor, 8.8 mm wide. It must see a 44 mm wide part from a distance of 300 mm (taken from the lens). Which focal length, and how far behind the lens must the sensor be?',
      steps: [
        'The magnification is $m = 8.8/44 = 0.2$.',
        { text: 'The focal length for a working distance of 300 mm:', tex: 'f = \\frac{s\\,m}{1+m} = \\frac{300\\times 0.2}{1.2} = 50\\ \\mathrm{mm}' },
        { text: 'The lens-to-sensor distance:', tex: 'v = f\\,(1+m) = 50\\times 1.2 = 60\\ \\mathrm{mm}' },
        'Check: object to sensor is $300 + 60 = 360$ mm $= 50\\,(2 + 0.2 + 5)$.'
      ],
      a: 'A 50 mm lens, with the sensor 60 mm behind it. The extra 10 mm beyond $f$ is the focusing travel the lens must provide.'
    },
    {
      title: 'How small a pixel footprint?',
      q: 'The camera of the first example has 3.45 µm pixels. What does one pixel cover on the part, and how many pixels span a 0.1 mm scratch?',
      steps: [
        { text: 'The footprint:', tex: 'q = \\frac{p}{m} = \\frac{3.45\\ \\mu\\mathrm{m}}{0.2} = 17.25\\ \\mu\\mathrm{m}' },
        'A 100 µm scratch spans $100/17.25 = 5.8$ pixels.'
      ],
      a: '17 µm per pixel; the scratch spans nearly six pixels, comfortably more than the three or four usually wanted for reliable detection.'
    }
  ],
  quiz: [
    { q: 'A sensor 7.18 mm wide must cover a field 71.8 mm wide. What magnification is needed?', answer: 0.1, why: '$m = w/W = 7.18/71.8 = 0.1$, a 0.1× lens or 1:10.' },
    { q: 'A 50 mm lens is used at 1:1. How far apart are the object and the sensor?', choices: ['200 mm', '100 mm', '50 mm', '150 mm'], a: 0, why: 'At $m = 1$ the track is $f(2 + 1 + 1) = 4f = 200$ mm: the object at $2f$ in front of the lens and the sensor at $2f$ behind.' },
    { q: 'The working distance printed on a lens datasheet is measured from the principal plane of the lens.', a: false, why: 'It is a mechanical distance, from the front of the housing to the object. The principal plane may lie well inside the lens.' },
    { q: 'Pixels of 5 µm are used at a magnification of 0.25. What size on the object does one pixel cover, in µm?', answer: 20, unit: 'µm', why: '$q = p/m = 5/0.25 = 20$ µm.' },
    { q: 'You keep the same lens and move the object closer to it, refocusing. What happens to the field width?', choices: ['It gets narrower: the magnification rises', 'It gets wider', 'It stays the same', 'It depends only on the sensor'], a: 0, why: '$m = f/(s-f)$ rises as $s$ falls, and the field width is $w/m$.' }
  ],
  applications: [
    'Machine vision: the first two steps of choosing a lens are the magnification and the working distance, then the focal length that satisfies both.',
    'Printed-circuit-board and electronics inspection, where a lens must work 100–300 mm from the board to clear tall components.',
    'Microscope cameras: a C-mount adapter with a 0.5× reduction lens sets the magnification of the camera port.',
    'Copy stands and document scanners, which work at a fixed small $m$ over a fixed distance.',
    'Macro photography, where the reproduction ratio (1:2, 1:1) is the headline specification of the lens.'
  ],
  history: 'The relation between object and image distances was worked out in the 17th century; Newton\'s form, $x\\,x\' = f^2$, measures both distances from the focal points. The habit of specifying lenses by magnification and working distance comes from microscopes and enlargers, and was taken up by the machine-vision industry as it grew in the 1980s and 1990s, when engineers needed to relate a known sensor to a known field.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the conjugate equations, magnification and the total track.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE Press, 2004) — magnification and conjugates.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — image scale, extension and working distance.'
  ],
  sim: 'fz-magnification'
},

/* ================================================================ depth of field */
{
  id: 'depth-of-field', parent: 'field-focus-and-zoom', title: 'Depth of field', level: 2,
  short: 'Only one plane is in exact focus; everything nearer or farther is blurred in proportion to its distance from that plane. The depth of field is the range of distances over which the blur stays below the limit you will accept. It grows with the f-number and the distance and shrinks with the focal length and the size of the sensor.',
  keywords: ['depth of field', 'DoF', 'near limit', 'far limit', 'acceptable sharpness', 'shallow focus', 'deep focus', 'aperture', 'background blur', 'focus plane', 'macro depth of field', 'focus stacking', 'depth of field scale'],
  prereq: ['the-f-number', 'magnification-and-working-distance', 'depth-of-focus'],
  related: ['hyperfocal-distance', 'circle-of-confusion', 'bokeh-and-out-of-focus-blur', 'aperture-and-f-stops', 'crop-factor-and-equivalent-focal-length', 'macro-lenses', 'close-up-and-extension-tubes', 'the-airy-disk', 'telecentric-imaging'],
  body: `
Point a camera at a person two metres away and focus on their eyes. The ears, a little behind, are a touch soft; the wall far behind is a wash. Only **one** plane is in exact focus. Other distances are blurred a little in proportion to how far they lie from it, until the blur gets large enough to notice. The span of distances in which it stays small enough is the **depth of field** (DoF).

### Blur grows with distance from the focus plane
With the lens focused at a distance $s$, a point at distance $d$ is imaged as a disc of diameter

$$b = \\frac{f^2\\,|s - d|}{N\\,d\\,(s - f)}$$

For a distant background ($d \\to \\infty$) this becomes $b = f^2/\\big(N(s-f)\\big)$: a 50 mm lens at f/2 focused at 3 m smears a mountain into a disc 0.42 mm across, fifteen times the usual limit. The limit is the **[[circle-of-confusion|circle of confusion]]** $c$, the largest disc that still passes for a point. Where $b$ falls below $c$ the picture is "acceptably sharp".

### The two limits
With the [[hyperfocal-distance|hyperfocal distance]] $H = f^2/(Nc) + f$, the nearest and farthest sharp distances are

$$d_{\\text{near}} = \\frac{s\\,(H-f)}{H+s-2f} \\qquad d_{\\text{far}} = \\frac{s\\,(H-f)}{H-s}$$

and the far limit is infinity once $s \\ge H$.

| Lens on full frame ($c = 0.029$ mm) | Focused at | Sharp from | to | Depth |
|---|---|---|---|---|
| 50 mm f/2 | 3 m | 2.81 m | 3.22 m | 0.41 m |
| 50 mm f/8 | 3 m | 2.36 m | 4.12 m | 1.77 m |
| 85 mm f/1.8 | 2 m | 1.97 m | 2.03 m | 5.5 cm |
| 200 mm f/2.8 | 10 m | 9.81 m | 10.20 m | 0.40 m |
| 24 mm f/8 | 3 m | 1.37 m | infinity | — |

### What controls it
- **Aperture.** The depth is proportional to the f-number: f/8 gives four times the depth of f/2.
- **Distance.** Well short of $H$, the total depth is about $2Ncs^2/f^2$: it grows with the *square* of the focus distance.
- **Focal length.** At the same distance, doubling $f$ divides the depth by four. But if you step back to keep the subject the same size, the depth hardly changes: it depends on the magnification, not on $f$ separately. Close up, $\\text{DoF} \\approx 2Nc(m+1)/m^2$: 0.9 mm at 1:1 and f/8 on full frame, 14 mm at 1:5.
- **Sensor size.** With the same framing and f-number a smaller sensor has more depth, in proportion to its [[crop-factor-and-equivalent-focal-length|crop factor]]: this is why phones keep everything sharp.
- **Where it lies.** Not symmetrically: more lies behind the focus plane than in front. The front-to-rear ratio is $(H-s)/(H+s)$: nearly even at close range, one third to two thirds when the focus is at half the hyperfocal distance (0.64 m in front and 1.12 m behind for the 50 mm f/8 at 3 m, a ratio of 0.57), and falling to zero as the focus approaches $H$, where the rear depth becomes infinite.

### It has no edge
Depth of field is a convention, not a boundary. The blur grows smoothly through $c$, and $c$ depends on how large and how closely the picture is looked at. Stopping down to deepen the field also enlarges the diffraction disc, $2.44\\lambda N$, so there is a best aperture where the two blurs balance. How the blur *looks* in the soft regions is the subject of [[bokeh-and-out-of-focus-blur]].

> [!key] One plane is sharp; blur grows with distance from it. The field of depth between the limits where the blur reaches $c$ grows with the f-number and the distance and shrinks with focal length and sensor size — at fixed framing it depends only on $N$, $c$ and the magnification.
`,
  ideas: [
    'Only one plane is exactly in focus; blur grows with distance from it, and the depth of field is where the blur is below the circle of confusion.',
    'Depth grows in proportion to the f-number and, at ordinary distances, with the square of the focus distance.',
    'For the same framing the depth depends on f-number, circle of confusion and magnification, not on the focal length separately.',
    'Close up, DoF ≈ 2Nc(m + 1)/m²: under a millimetre at 1:1 on full frame at f/8.',
    'The field has soft edges, and more of it lies behind the focus plane than in front: the ratio is (H − s)/(H + s).'
  ],
  pitfalls: [
    'Everything inside the depth of field is perfectly sharp — Only the focus plane is. The limits are where the blur reaches the accepted value, and it grows gradually.',
    'Depth of field is a property of the lens — It depends on the aperture, the distance, the focal length, the sensor size and how the picture is viewed (through the circle of confusion).',
    'Telephoto lenses have shallower depth of field in themselves — At the same *framing* they do not: moving back to compensate cancels the effect. At the same distance they do, because the subject is magnified.',
    'Stopping down always gives more sharpness — It gives more depth, but past some f-number diffraction blurs the whole picture.'
  ],
  terms: [
    { term: 'Depth of field', also: ['DoF', 'zone of acceptable sharpness'], def: 'The range of object distances over which the image is acceptably sharp: the blur disc stays smaller than the circle of confusion.' },
    { term: 'Near limit', also: ['near point of focus', 'front depth of field'], def: 'The closest distance that is still acceptably sharp when the lens is focused at a given distance.' },
    { term: 'Far limit', also: ['far point of focus', 'rear depth of field'], def: 'The farthest acceptably sharp distance. When it is infinity the lens is focused at or beyond the hyperfocal distance.' },
    { term: 'Focus plane', also: ['plane of focus', 'subject plane'], def: 'The plane at the focus distance whose points are imaged exactly on the sensor.' },
    { term: 'Shallow depth of field', also: ['shallow focus'], def: 'A small depth of field: only a thin slab of the scene is sharp. Wanted for portraits, a problem in macro work.' },
    { term: 'Focus stacking', also: ['focal bracketing'], def: 'Combining several pictures focused at different distances so that every part of the subject is sharp: the usual remedy for the tiny depth of macro photography.' }
  ],
  formulas: [
    {
      name: 'Blur of a distant background',
      expr: 'bg = f^2/(N*(s - f))', tex: 'b_\\infty = \\frac{f^2}{N\\,(s - f)}',
      vars: {
        bg: { name: 'diameter of the blur disc of a point at infinity', q: 'length', unit: 'µm', tex: 'b_\\infty' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 },
        s: { name: 'focus distance', q: 'length', unit: 'm', value: 3, min: 0.06, max: 1000 }
      },
      note: 'When this is below the circle of confusion the background is acceptably sharp.',
      stories: { bg: 'A {f} lens at f/{N} is focused at {s}. How large is the blur disc of a very distant point?' }
    },
    {
      name: 'Near limit',
      expr: 'dn = s*(H - f)/(H + s - 2*f)', tex: 'd_{\\text{near}} = \\frac{s\\,(H-f)}{H+s-2f}',
      vars: {
        dn: { name: 'nearest sharp distance', q: 'length', unit: 'm', tex: 'd_{\\text{near}}' },
        s: { name: 'focus distance', q: 'length', unit: 'm', value: 3, min: 0.06, max: 1000 },
        H: { name: 'hyperfocal distance', q: 'length', unit: 'm', value: 10.88, min: 0.1, max: 5000 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'H = f²/(Nc) + f; see the hyperfocal distance.',
      practice: { unknowns: ['dn'] }
    },
    {
      name: 'Far limit',
      expr: 'df = s*(H - f)/(H - s)', tex: 'd_{\\text{far}} = \\frac{s\\,(H-f)}{H-s}',
      vars: {
        df: { name: 'farthest sharp distance', q: 'length', unit: 'm', tex: 'd_{\\text{far}}' },
        s: { name: 'focus distance', q: 'length', unit: 'm', value: 3, min: 0.06, max: 1000 },
        H: { name: 'hyperfocal distance', q: 'length', unit: 'm', value: 10.88, min: 0.1, max: 5000 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Valid for a focus distance less than H; beyond it the far limit is infinity.',
      practice: { unknowns: ['df'] }
    },
    {
      name: 'Total depth at moderate distances',
      expr: 'D = 2*N*c*s^2/f^2', tex: 'D \\approx \\frac{2\\,N\\,c\\,s^2}{f^2}',
      vars: {
        D: { name: 'total depth of field', q: 'length', unit: 'm' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        c: { name: 'circle of confusion', q: 'length', unit: 'µm', value: 28.8 },
        s: { name: 'focus distance', q: 'length', unit: 'm', value: 3, min: 0.06, max: 1000 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Good when the focus distance is well below the hyperfocal distance.',
      stories: { D: 'A {f} lens at f/{N}, with a circle of confusion of {c}, is focused at {s}. About how deep is the field?' }
    },
    {
      name: 'Close-up depth of field',
      expr: 'D = 2*N*c*(m + 1)/m^2', tex: 'D \\approx \\frac{2\\,N\\,c\\,(m+1)}{m^2}',
      vars: {
        D: { name: 'total depth of field', q: 'length', unit: 'mm' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 },
        c: { name: 'circle of confusion', q: 'length', unit: 'µm', value: 28.8 },
        m: { name: 'magnification', value: 1, min: 0.02, max: 20 }
      },
      note: 'Depends on the magnification, not on the focal length. Use N as marked: this form already includes the extension.',
      stories: { D: 'At a magnification of {m} and f/{N}, with a circle of confusion of {c}, how deep is the field?' }
    }
  ],
  examples: [
    {
      title: 'The portrait',
      q: 'A portrait is taken on full frame with an 85 mm lens at f/1.8, focused on the eyes 2 m away ($c = 0.029$ mm). How deep is the sharp zone?',
      steps: [
        { text: 'The hyperfocal distance:', tex: 'H = \\frac{85^2}{1.8\\times 0.0288} + 85 = 139\\ \\mathrm{m}' },
        { text: 'The limits:', tex: 'd_{\\text{near}} = \\frac{2000\\,(139\\,200-85)}{139\\,200+2000-170} = 1.973\\ \\mathrm{m}, \\qquad d_{\\text{far}} = \\frac{2000\\,(139\\,200-85)}{139\\,200-2000} = 2.028\\ \\mathrm{m}' }
      ],
      a: 'From 1.973 to 2.028 m: 5.5 cm in all. The eyes are sharp; the tip of the nose and the ears are already past the limit. At f/5.6 the depth would be three times larger.'
    },
    {
      title: 'The landscape',
      q: 'On full frame a 24 mm lens at f/8 is focused on a rock 3 m away. How much of the scene is sharp?',
      steps: [
        { text: 'The hyperfocal distance:', tex: 'H = \\frac{24^2}{8\\times 0.0288} + 24 = 2.52\\ \\mathrm{m}' },
        '3 m is beyond $H$, so the far limit is infinity. The near limit is $3000\\,(2520-24)/(2520+3000-48) = 1.37$ m.'
      ],
      a: 'Everything from 1.37 m to infinity. Focusing at 2.5 m instead would bring the near limit to 1.26 m.'
    }
  ],
  quiz: [
    { q: 'Which change makes the depth of field **smaller**?', choices: ['Opening the aperture from f/8 to f/2.8', 'Stepping back and zooming to keep the subject the same size', 'Focusing farther away', 'Using a smaller sensor'], a: 0, why: 'Depth is proportional to the f-number: f/2.8 gives about a third of the depth of f/8. Stepping back and zooming leaves it about the same; focusing farther and a smaller sensor both make it larger.' },
    { q: 'At the same distance and f-number a 200 mm lens has less depth of field than a 50 mm lens.', a: true, why: 'The depth goes as $1/f^2$ at a fixed distance: four times less depth for four times the focal length is sixteen times less. The subject is also magnified far more.' },
    { q: 'What is the depth of field, in mm, at 1:1 magnification and f/8 on full frame ($c = 0.0288$ mm)?', answer: 0.92, unit: 'mm', why: '$D = 2Nc(m+1)/m^2 = 2\\times 8\\times 0.0288\\times 2 = 0.92$ mm.' },
    { q: 'A photographer photographs a face from 1 m with a 50 mm lens, then from 2 m with a 100 mm lens, both at f/4. The depths of field are…', choices: ['almost equal', 'four times larger for the 100 mm', 'four times smaller for the 100 mm', 'unrelated'], a: 0, why: 'The subject is the same size in both pictures, so the magnification is the same, and at equal $N$ and $c$ the depth depends on the magnification only.' },
    { q: 'Two cameras frame a scene identically at f/4, one with full frame and one with a Four Thirds sensor. Which has more depth of field?', choices: ['Four Thirds, about twice as much', 'Full frame, about twice as much', 'Equal', 'Four Thirds, four times as much'], a: 0, why: 'The smaller sensor needs a lens of half the focal length for the same framing and has half the circle of confusion; the depth grows by the crop factor, about 2.' }
  ],
  applications: [
    'Portraits and film close-ups use wide apertures and long lenses for a thin sharp zone that separates the subject from the background.',
    'Landscapes are shot at f/8–f/16 with the focus set near the hyperfocal distance to carry the sharpness from the foreground to the horizon.',
    'Macro photography and microscopy fight a depth of fractions of a millimetre, and answer it with focus stacking or smaller apertures.',
    'Film crews use charts or calculators of the depth of field, per lens and per format, and a focus puller works within it.',
    'Machine vision: parts at slightly different heights set the f-number, balanced against the light and the diffraction blur.'
  ],
  history: 'Depth-of-field scales — pairs of marks beside the focus index that show the near and far limits for each f-number — were engraved on camera lenses from the early twentieth century. They disappeared from most autofocus lenses once the focus ring stopped being a long mechanical travel, and returned in the form of calculators and the depth-of-field preview on the camera.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — depth of field, the hyperfocal distance and the circle of confusion.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the derivation of the near and far limits and the close-up form.',
    'W. J. Smith, *Modern Optical Engineering* — blur circles and depth of focus.'
  ],
  sim: 'fz-dof'
},

/* ================================================================ hyperfocal distance */
{
  id: 'hyperfocal-distance', parent: 'field-focus-and-zoom', title: 'The hyperfocal distance', level: 2,
  short: 'The hyperfocal distance H is the focus distance at which the far limit of the depth of field just reaches infinity. Focus there and everything from H/2 to infinity is acceptably sharp. H = f²/(Nc) + f: 2.5 m for a 24 mm lens at f/8 on full frame.',
  keywords: ['hyperfocal distance', 'hyperfocal focusing', 'zone focusing', 'fixed focus', 'infinity focus', 'landscape', 'street photography', 'depth of field scale', 'focus at infinity', 'H', 'near limit H/2'],
  prereq: ['depth-of-field', 'circle-of-confusion', 'the-f-number'],
  related: ['focusing-a-lens', 'the-phone-camera', 'crop-factor-and-equivalent-focal-length', 'aperture-and-f-stops', 'depth-of-focus', 'the-airy-disk', 'reading-a-lens-datasheet'],
  body: `
Focus a lens on infinity and the distant mountains are as sharp as the lens can make them, but the nearest sharp point is a long way away. Focus a little nearer and the mountains soften, yet the field of sharpness reaches closer to you. Somewhere between is the focus setting that holds the mountains *just* acceptably sharp while bringing the near limit as close as possible. That distance is the **hyperfocal distance**.

### Definition
For a lens of focal length $f$, f-number $N$ and circle of confusion $c$, the blur of an object at infinity when the lens is focused at $s$ is $b = f^2/(N(s-f))$. Setting it equal to $c$ and solving for $s$ gives

$$H = \\frac{f^2}{N\\,c} + f \\approx \\frac{f^2}{N\\,c}$$

Focused at $H$, the far limit is infinity and the near limit, from the depth-of-field formula, is exactly $H/2$. Focused at infinity the nearest sharp distance is $H$ — half the depth is wasted.

| Full frame, f/8 | $H$ | Everything from |
|---|---|---|
| 24 mm | 2.5 m | 1.3 m |
| 35 mm | 5.3 m | 2.7 m |
| 50 mm | 10.9 m | 5.4 m |
| 85 mm | 31 m | 16 m |
| 200 mm | 174 m | 87 m |

And for a 50 mm lens on full frame, $H$ is 43 m at f/2, 11 m at f/8 and 5.5 m at f/16: every doubling of the f-number halves $H$.

### A phone
A phone camera with a 4.3 mm f/1.8 lens on a 1/2.3" sensor has $c = 5.1$ µm and $H = 2.0$ m. Focused at 2 m, everything from 1 m to infinity is acceptably sharp, so the earliest phones, and webcams and many surveillance cameras, never needed to focus at all: that is **fixed focus**.

### Using it
- **Landscape.** Set the f-number, read $H$ from a table or an app, focus at that distance, and foreground and horizon fall inside the sharp zone. Focusing at infinity "to be safe" costs the foreground.
- **Zone focusing and scales.** A lens with a depth-of-field scale is set to hyperfocal by turning the infinity mark opposite the mark of the chosen f-number. Street photographers set a zone of, say, 2 to 5 m in advance and shoot without refocusing.
- **Fixed-focus cameras.** A short lens and a small aperture put $H$ close to the camera, as in simple cameras and many industrial sensors.

### Caveats
- $H$ is as strict as $c$. For larger prints, or for viewing at 100 % on a screen, take a smaller $c$: with $c = 0.015$ mm the 24 mm f/8 lens has $H = 4.8$ m, almost twice the value above.
- "Acceptably sharp at infinity" is not as sharp as the focus plane. If the horizon matters, focus a little beyond $H$ and accept a softer foreground, or focus-stack.
- Stopping down to shorten $H$ costs diffraction ($2.44\\lambda N$, 10.7 µm at f/8, 21.5 µm at f/16). There is no free lunch.

> [!key] $H = f^2/(Nc) + f$. Focused at $H$, the sharp zone runs from $H/2$ to infinity. Halve $c$ and $H$ doubles; double $f$ and it quadruples; double the f-number and it halves.
`,
  ideas: [
    'H = f²/(Nc) + f: the focus distance at which the blur of infinity just equals the circle of confusion.',
    'Focused at H, the sharp zone runs from exactly H/2 to infinity; focused at infinity it starts at H.',
    'H is proportional to f² and inversely proportional to N: a long lens or a wide aperture pushes it far away.',
    'Small sensors and short lenses have a hyperfocal distance of about a metre or two, which is why fixed focus works in phones.',
    'H depends on the criterion c: stricter viewing (larger prints, 100 % on screen) needs a larger H.'
  ],
  pitfalls: [
    'Focusing at infinity always gives the sharpest landscape — It leaves half the depth of field beyond infinity. Focusing at the hyperfocal distance brings the near limit from H to H/2.',
    'The hyperfocal distance is a property of the lens — It depends on the focal length, the f-number and the circle of confusion, and so on the sensor and the viewing conditions.',
    'At the hyperfocal distance, everything is perfectly sharp — Infinity and the near limit are only at the accepted blur, and the focus plane alone is exact.',
    'Stopping down further always helps — Diffraction grows with the f-number: on a small sensor it exceeds the circle of confusion by f/4 to f/8, on full frame not until about f/16 to f/22.'
  ],
  terms: [
    { term: 'Hyperfocal distance', also: ['H', 'hyperfocal focus'], def: 'The focus distance at which the depth of field extends to infinity: f²/(Nc) + f. The sharp zone then begins at half of it.' },
    { term: 'Fixed focus', also: ['focus-free', 'universal focus'], def: 'A lens that cannot be focused, set permanently near its hyperfocal distance so that everything beyond a short distance is acceptably sharp.' },
    { term: 'Zone focusing', also: ['pre-focusing'], def: 'Setting the focus beforehand so that a chosen range of distances falls inside the depth of field, using the depth-of-field scale on the lens.' },
    { term: 'Depth-of-field scale', also: ['DoF scale'], def: 'Marks beside the distance scale of a lens that show the near and far limits for each f-number at the distance set.' }
  ],
  formulas: [
    {
      name: 'Hyperfocal distance',
      expr: 'H = f^2/(N*c) + f', tex: 'H = \\frac{f^2}{N\\,c} + f',
      vars: {
        H: { name: 'hyperfocal distance', q: 'length', unit: 'm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 },
        c: { name: 'circle of confusion', q: 'length', unit: 'µm', value: 28.8 }
      },
      note: 'Focus at H and the sharp zone runs from H/2 to infinity. Solve for N to find the aperture that puts H at a chosen distance.',
      stories: { H: 'A {f} lens at f/{N} on a sensor with a circle of confusion of {c}. What is its hyperfocal distance?', N: 'A {f} lens is to have a hyperfocal distance of {H}, with a circle of confusion of {c}. What f-number is needed?' }
    },
    {
      name: 'Nearest sharp distance at hyperfocal focus',
      expr: 'dn = H/2', tex: 'd_{\\text{near}} = \\frac{H}{2}',
      vars: {
        dn: { name: 'nearest sharp distance', q: 'length', unit: 'm', tex: 'd_{\\text{near}}' },
        H: { name: 'hyperfocal distance', q: 'length', unit: 'm', value: 2.52, min: 0.1, max: 5000 }
      },
      note: 'Exact: put s = H in the near-limit formula of the depth of field.'
    }
  ],
  examples: [
    {
      title: 'A wide-angle landscape',
      q: 'On a full-frame camera a 24 mm lens is set to f/8 ($c = 28.8$ µm). Where should it be focused, and what range is then sharp?',
      steps: [
        { text: 'The hyperfocal distance:', tex: 'H = \\frac{24^2}{8\\times 0.0288} + 24 = 2524\\ \\mathrm{mm}' },
        'Focus at 2.5 m. The near limit is $H/2 = 1.26$ m; the far limit is infinity.'
      ],
      a: 'Focus about 2.5 m away; the zone from 1.3 m to infinity is acceptably sharp. Focusing on infinity would start the sharp zone at 2.5 m.'
    },
    {
      title: 'Which aperture for 3 m?',
      q: 'A 35 mm lens on full frame is to have its hyperfocal distance at 3 m. What f-number does this need?',
      steps: [
        { text: 'Solve the hyperfocal formula for $N$:', tex: 'N = \\frac{f^2}{c\\,(H - f)} = \\frac{35^2}{0.0288\\times (3000-35)} = 14.3' }
      ],
      a: 'About f/14, between the standard f/11 and f/16. Diffraction there (about 19 µm) is beginning to rival the circle of confusion itself.'
    }
  ],
  quiz: [
    { q: 'A lens is focused at its hyperfocal distance $H$. The nearest acceptably sharp distance is…', choices: ['$H/2$', '$H$', '$H/4$', 'the focal length'], a: 0, why: 'Putting $s = H$ into the near-limit formula gives exactly $H/2$, and the far limit is infinity.' },
    { q: 'What is the hyperfocal distance, in metres, of a 50 mm lens at f/8 on full frame ($c = 0.0288$ mm)?', answer: 10.88, unit: 'm', why: '$H = 50^2/(8\\times 0.0288) + 50 = 10\\,880$ mm.' },
    { q: 'Stopping down from f/8 to f/16 roughly halves the hyperfocal distance.', a: true, why: '$H$ is inversely proportional to $N$: 10.9 m at f/8 becomes 5.5 m at f/16.' },
    { q: 'A phone lens has $f = 4.3$ mm, f/1.8 and $c = 5.1$ µm. Its hyperfocal distance is about…', choices: ['2 m', '20 m', '0.2 m', '200 m'], a: 0, why: '$f^2/(Nc) = 18.5/(1.8\\times 0.0051) = 2.0$ m. The small focal length wins over the small circle of confusion because $f$ is squared.' },
    { q: 'A photographer decides that a print is to be viewed at a size that halves the permissible circle of confusion. The hyperfocal distance of a given lens and aperture…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 0, why: '$H$ is inversely proportional to $c$: a stricter criterion pushes the hyperfocal distance out.' }
  ],
  applications: [
    'Landscape photography: focus at the hyperfocal distance of the chosen aperture to carry sharpness from the foreground to the horizon.',
    'Street and documentary photography: zone focusing with a depth-of-field scale, so that no time is lost on focusing.',
    'Fixed-focus cameras: simple film cameras, webcams, door and security cameras, and the cheapest phone modules.',
    'Aerial and survey cameras, whose lenses are set once to infinity or just inside the hyperfocal distance.'
  ],
  history: 'The box cameras of the late nineteenth century, the first Kodak of 1888 among them, had no focusing at all: a short lens, a small aperture and a fixed setting near the hyperfocal distance made everything beyond a couple of metres acceptably sharp. Distance scales with depth-of-field marks gave the same trick to the serious photographer.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — hyperfocal distance and the depth-of-field formulas.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — the derivation of the hyperfocal setting.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE Press, 2004) — depth of field and the hyperfocal distance.'
  ],
  sim: { id: 'fz-dof', params: { mode: 'hyper', f: 24, N: 8 } }
},

/* ================================================================ circle of confusion */
{
  id: 'circle-of-confusion', parent: 'field-focus-and-zoom', title: 'The circle of confusion', level: 2,
  short: 'The circle of confusion is the largest blur disc that still passes for a point. It is the yardstick of depth of field: usually the sensor diagonal ÷ 1500 (0.029 mm for full frame), which comes from the acuity of the eye at a print seen from its own diagonal. Criteria based on the pixels are far stricter.',
  keywords: ['circle of confusion', 'CoC', 'blur circle', 'permissible blur', 'acceptable sharpness', 'd/1500', 'Zeiss formula', 'enlargement', 'viewing distance', 'acuity', 'pixel criterion', 'disc of confusion', 'diffraction limit'],
  prereq: ['depth-of-field', 'the-fovea-and-visual-acuity', 'sensor-formats-and-pixel-size'],
  related: ['hyperfocal-distance', 'depth-of-focus', 'the-airy-disk', 'crop-factor-and-equivalent-focal-length', 'pixels-per-feature', 'resolution-limits', 'bokeh-and-out-of-focus-blur'],
  body: `
A lens cannot image a point as a point except at one distance. Everywhere else a point is a small disc, the footprint of the cone of light on the sensor, and the disc is round because the aperture is. Whether the disc is noticed depends on who looks and how. The **circle of confusion** is the criterion: the largest disc that still looks like a point. Depth-of-field tables, hyperfocal distances and lens scales are all built on a chosen value of it, written $c$.

### Where d/1500 comes from
Take a print and look at it from a distance about equal to its own diagonal $L$, a natural way to view a picture. The eye separates two lines about 1 arc-minute apart at best, 1/3438 of the distance. The accepted blur is about twice that: 1/1500 of the distance, 2.3 arc-minutes, generous enough to allow for imperfect eyes and viewing. On the print the disc may then be $L/1500$ across. The sensor image was enlarged by $M = L/d$ for a sensor diagonal $d$, so on the sensor

$$c = \\frac{L}{1500\\,M} = \\frac{d}{1500}$$

Full frame ($d = 43.27$ mm) gives 0.0288 mm, the "0.03 mm" of the old tables. Because $c$ scales with the sensor, the same print and viewing conditions fix a smaller $c$ for a smaller sensor.

| Sensor | Diagonal | $c = d/1500$ |
|---|---|---|
| 1/2.3" | 7.67 mm | 5.1 µm |
| 1" | 16.0 mm | 10.7 µm |
| Four Thirds | 21.6 mm | 14.4 µm |
| APS-C | 28.4 mm | 18.9 µm |
| Full frame | 43.3 mm | 28.8 µm |
| Medium format 44 × 33 | 54.8 mm | 36.5 µm |

Other conventions exist: $d/1000$ for casual use, $d/1730$ (the figure of 0.025 mm for full frame often attributed to Zeiss), and $d/3000$ for critical work. A depth-of-field table is only meaningful together with the $c$ it assumes.

### The pixel criterion
The eye is not the only judge. At 100 % on a screen every pixel can be seen, and a 24-megapixel full-frame sensor with 6 µm pixels would call for $c \\approx 1$–2 pixels, 6–12 µm: two and a half to five times stricter than 28.8 µm, and the depth of field shrinks in proportion. In machine vision $c$ is simply the number of pixels the software can tolerate, one or two.

### The floor: diffraction
In perfect focus a point is already an Airy disc of diameter $2.44\\lambda N$. If that exceeds $c$ the sharp zone never meets the criterion, however carefully the lens is focused. The largest f-number whose Airy disc fits $c$ is $N = c/(2.44\\lambda)$: 21 at 550 nm on full frame, but only 8 on a 1" sensor, 3.8 on a phone sensor. More exactly the blurs add roughly in quadrature, so the depth-of-field formulas are optimistic near that limit.

### The image-side twin
The circle of confusion on the sensor corresponds to a tolerance on the sensor's position of $\\pm Nc$, the [[depth-of-focus]].

> [!key] $c$ is the blur disc that still looks like a point: $d/1500$ for the print-and-eye convention, one or two pixels for the screen-and-pixel one. Depth of field is a statement about a picture *as viewed*, so it changes with $c$.
`,
  ideas: [
    'The circle of confusion c is the largest blur disc that still passes for a point; it sets every depth-of-field number.',
    'The usual value is the sensor diagonal ÷ 1500: 28.8 µm on full frame, 5.1 µm on a 1/2.3" sensor.',
    'It follows from the eye\'s acuity (about 1 arc-minute) with a factor of two to spare, for a print seen from its own diagonal.',
    'A pixel-based criterion (1–2 pixels) is two to five times stricter on modern sensors.',
    'If the Airy disc exceeds c, no setting of the lens reaches the criterion: diffraction sets a floor.'
  ],
  pitfalls: [
    'The circle of confusion is a property of the lens — It is a property of the picture and how it is viewed: sensor size, enlargement, viewing distance and the viewer\'s eyes.',
    'The value 0.03 mm is a law of nature — It is a convention for a full-frame picture on a print of ordinary size. On a screen at 100 % it is too generous by a factor of two to five.',
    'A smaller circle of confusion means a sharper lens — It means a stricter requirement, and so a shallower depth of field. The lens itself is not changed.',
    'Any aperture can reach the criterion if focused carefully — Not if the Airy disc is already larger than $c$.'
  ],
  terms: [
    { term: 'Circle of confusion', also: ['CoC', 'blur circle', 'disc of confusion', 'permissible blur'], def: 'The largest blur disc on the sensor that still looks like a point. It defines acceptable sharpness and so the depth of field.' },
    { term: 'Enlargement factor', also: ['magnification of the print', 'M'], def: 'The ratio of the size of the viewed picture to the size of the sensor. A 300 mm print from a 43 mm diagonal sensor is enlarged 7 times.' },
    { term: 'Visual acuity', also: ['resolving power of the eye'], def: 'The smallest detail the eye can separate: about 1 arc-minute for normal vision under good conditions.' },
    { term: 'Zeiss formula', also: ['d/1730'], def: 'A convention taking the circle of confusion as the sensor diagonal divided by 1730, giving 0.025 mm for full frame.' },
    { term: 'Pixel criterion', def: 'Taking the circle of confusion as one or two pixels, appropriate when the picture is examined at 100 % or when a program must find edges.' }
  ],
  formulas: [
    {
      name: 'Circle of confusion from the sensor diagonal',
      expr: 'c = d/k', tex: 'c = \\frac{d}{k}',
      vars: {
        c: { name: 'circle of confusion', q: 'length', unit: 'µm' },
        d: { name: 'sensor diagonal', q: 'length', unit: 'mm', value: 43.27 },
        k: { name: 'divisor of the convention (1500 is common)', value: 1500, min: 500, max: 5000, tex: 'k' }
      },
      stories: { c: 'A sensor has a diagonal of {d}. What circle of confusion does the convention d/{k} give?' }
    },
    {
      name: 'From the viewing conditions',
      expr: 'c = D*tan(a)/M', tex: 'c = \\frac{D\\,\\tan a}{M}',
      vars: {
        c: { name: 'circle of confusion on the sensor', q: 'length', unit: 'µm' },
        D: { name: 'viewing distance', q: 'length', unit: 'mm', value: 300 },
        a: { name: 'blur accepted, as an angle at the eye', q: 'angle', unit: '′', value: 2.3, min: 0.2, max: 20 },
        M: { name: 'enlargement from sensor to print', value: 6.93, min: 0.5, max: 200 }
      },
      note: 'The disc on the print is D·tan a; dividing by the enlargement brings it back to the sensor.',
      stories: { c: 'A print is viewed from {D}, a blur of {a} is accepted, and the print is {M} times larger than the sensor image. What circle of confusion does that give on the sensor?' }
    },
    {
      name: 'A pixel-based criterion',
      expr: 'c = n*p', tex: 'c = n\\,p',
      vars: {
        c: { name: 'circle of confusion', q: 'length', unit: 'µm' },
        n: { name: 'pixels the blur may cover', value: 2, min: 0.5, max: 10 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 6 }
      },
      stories: { c: 'A blur of {n} pixels of {p} is accepted. What is the circle of confusion?' }
    },
    {
      name: 'Largest f-number before diffraction exceeds c',
      expr: 'Nm = c/(2.44*lambda)', tex: 'N_{\\max} = \\frac{c}{2.44\\,\\lambda}',
      vars: {
        Nm: { name: 'largest useful f-number', tex: 'N_{\\max}' },
        c: { name: 'circle of confusion', q: 'length', unit: 'µm', value: 28.8 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Where the Airy disc, 2.44 λ N, equals c.',
      stories: { Nm: 'With a circle of confusion of {c} in light of {lambda}, at what f-number is the Airy disc as large as c?' }
    }
  ],
  examples: [
    {
      title: 'A small sensor, a strict pixel',
      q: 'A 1" sensor (diagonal 16.0 mm) has 3.45 µm pixels. Compare the circle of confusion from the d/1500 convention with a criterion of two pixels.',
      steps: [
        { text: 'The convention:', tex: 'c = \\frac{16.0\\ \\mathrm{mm}}{1500} = 10.7\\ \\mu\\mathrm{m}' },
        { text: 'The pixel criterion:', tex: 'c = 2\\times 3.45\\ \\mu\\mathrm{m} = 6.9\\ \\mu\\mathrm{m}' }
      ],
      a: '10.7 µm against 6.9 µm: the pixel criterion is 1.5 times stricter, so the depth of field it implies is 35 % shallower. And since the Airy disc at f/8 is 10.7 µm, no aperture beyond about f/5 meets 6.9 µm in focus.'
    },
    {
      title: 'Why the value is 29 µm',
      q: 'A 300 mm print of the full 36 × 24 mm frame is viewed from 300 mm. What circle of confusion on the sensor corresponds to 2.3 arc-minutes at the eye?',
      steps: [
        { text: 'The blur on the print:', tex: 'D\\tan a = 300\\ \\mathrm{mm}\\times \\tan 2.3\' = 0.201\\ \\mathrm{mm}' },
        { text: 'The enlargement is $300/43.27 = 6.93$, so on the sensor:', tex: 'c = \\frac{0.201\\ \\mathrm{mm}}{6.93} = 0.029\\ \\mathrm{mm}' }
      ],
      a: '29 µm: the standard value for full frame, from nothing more than the acuity of the eye and the size of a print.'
    }
  ],
  quiz: [
    { q: 'What circle of confusion, in µm, does the convention $d/1500$ give for a full-frame sensor (diagonal 43.27 mm)?', answer: 28.8, unit: 'µm', why: '$43.27/1500 = 0.0288$ mm.' },
    { q: 'The same picture, viewed at a larger size or from closer, calls for a smaller circle of confusion and so gives less depth of field.', a: true, why: 'Depth of field belongs to the picture as it is looked at. A bigger enlargement reveals smaller blur, so the acceptable disc on the sensor shrinks.' },
    { q: 'A pixel criterion of 2 pixels is used with 6 µm pixels on a full-frame sensor. Compared with $d/1500$, the depth of field is…', choices: ['about 2.4 times shallower', 'about 2.4 times deeper', 'the same', 'zero'], a: 0, why: 'The criterion is 12 µm instead of 28.8 µm, a factor of 2.4 smaller, and the depth of field is proportional to $c$.' },
    { q: 'At what f-number is the Airy disc (550 nm) as large as a circle of confusion of 10.7 µm, as for a 1" sensor?', answer: 8, why: '$N = c/(2.44\\lambda) = 10.7/(2.44\\times 0.55) = 7.97$. Beyond about f/8 diffraction alone exceeds $c$.' },
    { q: 'Why is the circle of confusion of a phone sensor so much smaller than that of a full-frame sensor?', choices: ['Its diagonal is 5.6 times smaller and the same print needs the same enlargement of the whole picture', 'Phone lenses are sharper', 'Phone pictures are viewed more closely', 'Pixels are smaller'], a: 0, why: 'For the same print and viewing conditions the enlargement is 5.6 times greater, so the blur allowed on the sensor is 5.6 times smaller: $d/1500$.' }
  ],
  applications: [
    'Depth-of-field calculators, apps and engraved scales all state or assume a circle of confusion; changing it changes their answers.',
    'Cinema depth-of-field charts list their circle of confusion for each format.',
    'Machine vision sets $c$ to one or two pixels because the software needs edges, not prints.',
    'Choosing the best aperture of a high-resolution camera: the diffraction floor against the circle of confusion.',
    'Photographic enlargers and printers, which are tested against the same acuity of the eye.'
  ],
  history: 'The 0.03 mm long used for 35 mm film comes from asking for a blur of no more than about a quarter of a millimetre on an 8 × 10 inch print enlarged about eight times from the negative. The phrase "circle of confusion" itself, for the disc that stands in for a point, is older than photography\'s depth-of-field tables and comes from the language of geometrical optics.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the circle of confusion, permissible blur and acuity.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — choice of the circle of confusion for a given use.',
    'M. Born and E. Wolf, *Principles of Optics* — the Airy pattern, for the diffraction floor.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE Press, 2004) — blur and depth of focus.'
  ],
  sim: 'fz-coc'
},

/* ================================================================ focusing a lens */
{
  id: 'focusing-a-lens', parent: 'field-focus-and-zoom', title: 'Focusing a lens', level: 2,
  short: 'To focus on something nearer than infinity the lens must be moved away from the sensor by the extension f²/(s − f) = f·m: under 1 mm for a 50 mm lens at 3 m, 10 mm at 0.3 m. Lenses do it by moving the whole lens, a front group or an inner group, and what they move decides how much the field of view changes (focus breathing).',
  keywords: ['focusing', 'focus', 'helicoid', 'unit focusing', 'internal focusing', 'rear focusing', 'front-element focusing', 'floating elements', 'focus breathing', 'minimum object distance', 'MOD', 'close focus', 'focus scale', 'extension', 'focus shift'],
  prereq: ['the-thin-lens-equation', 'magnification-and-working-distance', 'depth-of-field'],
  related: ['autofocus-methods', 'close-up-and-extension-tubes', 'field-of-view-and-focal-length', 'macro-lenses', 'zoom-lens-principles', 'lens-adapters-and-back-focus', 'viewfinders-and-focusing-screens', 'telephoto-lens', 'spherical-aberration'],
  body: `
A lens forms a sharp image of an object at distance $s$ at a distance $v$ behind it, where $1/s + 1/v = 1/f$. For a distant object $v = f$. For anything nearer, $v$ is larger. The sensor sits at a fixed place in the camera, so to **focus** on something nearer the lens has to be moved *away* from the sensor, by the **extension**

$$e = v - f = \\frac{f^2}{s - f} = f\\,m$$

where $m$ is the magnification. The figures for a 50 mm lens ($s$ measured from the lens):

| Object distance $s$ | Extension $e$ | Magnification $m$ |
|---|---|---|
| infinity | 0 | 0 |
| 3 m | 0.85 mm | 0.017 |
| 1 m | 2.63 mm | 0.053 |
| 0.5 m | 5.6 mm | 0.111 |
| 0.3 m | 10.0 mm | 0.200 |

The lens barely moves between infinity and 3 m; most of the travel is for the last metre, which is why the distance marks on a focus ring crowd towards infinity.

### Ways to move the glass
- **Unit focusing.** The whole lens moves forward in a **helicoid**, a barrel with a fine helical thread that turns rotation into straight movement. Simple and rugged, but the barrel changes length and the front often rotates, turning filters.
- **Front-element focusing.** Only the front group moves: cheap, and the front still turns.
- **Internal (inner) focusing.** A light group inside moves and the barrel keeps its length. It suits a fast autofocus motor — but the focal length of the whole lens changes as the group moves.
- **Rear focusing.** A group near the back moves. Common in wide-angle and compact telephoto designs, light and fast.
- **Floating elements.** Two groups move by different amounts, keeping aberrations low from infinity to the close limit, as in a macro lens.

### Focus breathing
Focusing changes the field of view, and the direction of the change depends on what moves. In a **unit-focusing** lens the focal length stays the same and the lens simply stands farther from the sensor, so the field **narrows**: the 50 mm lens of the table, focused so that the subject is 0.39 m from the lens (0.45 m from the sensor), has $v = 57.3$ mm and its horizontal angle falls from 39.6° to 34.9°, 12 % narrower. When an inner or rear group moves, the **effective focal length itself changes** with the group's position, and it usually gets *shorter* at close range, which widens the view and can outweigh the first effect: in some telephoto zooms the effective focal length falls to roughly two thirds of its marked value at the closest distance, and the simulation below shows an extreme case. In video, where focus is pulled during a shot, the framing shifts as the subject goes in and out of focus, so cinema lenses are designed to keep breathing small.

### The close limit
The **minimum object distance** (MOD) is usually measured from the sensor plane, which has a mark on the camera body. Because object-to-sensor is $f(2 + m + 1/m)$, a MOD gives the greatest magnification: a 50 mm lens that focuses to 0.45 m from the sensor has $m_{\\max} = 0.146$ (about 1:7), a lens extension of 7.3 mm, and the object 0.39 m from the lens.

**Focus shift.** Spherical aberration in fast lenses puts best focus in a slightly different place at each aperture, so stopping down from f/1.4 can shift it. And a lens only focuses where its mount puts the sensor ([[lens-adapters-and-back-focus]]).

> [!key] Focusing moves the lens away from the sensor by $e = f^2/(s-f) = fm$. How the lens does it — the whole lens, or a group inside — decides its size, its speed and how much its field of view changes with distance.
`,
  ideas: [
    'Focusing on a near object means moving the lens away from the sensor by e = f²/(s − f) = f·m.',
    'The travel is tiny at large distances (0.85 mm from infinity to 3 m for a 50 mm lens) and large close up (10 mm at 0.3 m).',
    'Unit, front-group, internal and rear focusing differ in size, weight, speed and whether the barrel moves.',
    'Focus breathing: the field of view changes with the focus distance: it narrows in a lens that simply extends; with internal focusing the focal length itself changes, usually shortening and widening the view.',
    'The minimum object distance, measured from the sensor, fixes the maximum magnification: f(2 + m + 1/m) = MOD.'
  ],
  pitfalls: [
    'Focusing moves the image to the sensor — The image formed by the lens moves with the object distance; the lens is shifted so that it lands on the sensor, which does not move.',
    'The minimum focusing distance is measured from the front of the lens — Usually from the sensor plane, so the gap between lens and subject is smaller, by the lens length and the extension.',
    'A lens that focuses closer always magnifies more — Magnification at the close limit depends on the focal length too: a 100 mm lens needs twice the extension of a 50 mm lens for the same $m$.',
    'Internal focusing does not change the lens — It keeps the barrel length constant, but the effective focal length changes with the focus distance.'
  ],
  terms: [
    { term: 'Helicoid', also: ['focusing helical', 'focus thread'], def: 'A barrel with a coarse helical thread that turns a rotation of the focus ring into a straight movement of the lens along the axis.' },
    { term: 'Unit focusing', def: 'Focusing by moving the whole lens as one unit away from the sensor.' },
    { term: 'Internal focusing', also: ['IF', 'inner focusing', 'rear focusing'], def: 'Focusing by moving a light group of elements inside the lens, so that the barrel does not change length. Rear focusing moves a group near the back.' },
    { term: 'Floating element', also: ['close-range correction'], def: 'A group that moves by a different amount from the rest during focusing, keeping aberrations low from infinity to the close limit.' },
    { term: 'Extension', also: ['lens extension', 'focus travel'], def: 'The distance the lens must move away from its infinity position to focus on an object: f²/(s − f) = f·m.' },
    { term: 'Focus breathing', also: ['focus-induced field change'], def: 'The change in angle of view as the focus distance changes, strongest in close focusing.' },
    { term: 'Minimum object distance', also: ['MOD', 'closest focus distance', 'minimum focus distance'], def: 'The closest distance on which a lens can focus, usually measured from the sensor plane.' }
  ],
  formulas: [
    {
      name: 'Extension needed to focus',
      expr: 'ext = f^2/(s - f)', tex: 'x_{\\mathrm{ext}} = \\frac{f^2}{s - f}',
      vars: {
        ext: { name: 'extension: how far the lens moves from its infinity position', q: 'length', unit: 'mm', tex: 'x_{\\mathrm{ext}}' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        s: { name: 'object distance (from the lens)', q: 'length', unit: 'm', value: 1, min: 0.06, max: 1000 }
      },
      note: 'Thin lens; the extension equals f times the magnification.',
      stories: { ext: 'A {f} lens is focused from infinity on an object {s} away. How far does it move?', s: 'A {f} lens has moved {ext} out from its infinity position. How far away is the object it is focused on?' }
    },
    {
      name: 'Greatest magnification from the minimum object distance',
      expr: 'T = f*(2 + m + 1/m)', tex: 'T = f\\left(2 + m + \\frac{1}{m}\\right)',
      vars: {
        T: { name: 'minimum object distance, measured from the sensor to the subject', q: 'length', unit: 'mm', value: 450 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        m: { name: 'greatest magnification', min: 0.001, max: 1 }
      },
      solveFor: 'm',
      note: 'Thin lens. Of the two solutions, m and 1/m, the first (below 1) is the lens\'s magnification.',
      stories: { m: 'A {f} lens focuses no closer than {T} from the sensor to the subject. What is its greatest magnification?' }
    },
    {
      name: 'Angle of view when focused at a distance',
      expr: 'A = 2*atan(w*(s - f)/(2*f*s))', tex: 'A = 2\\arctan\\frac{w\\,(s - f)}{2fs}',
      vars: {
        A: { name: 'angle of view', q: 'angle', unit: '°', min: 0.1, max: 175 },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 36 },
        s: { name: 'object distance (from the lens)', q: 'length', unit: 'mm', value: 393, min: 52, max: 100000 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'Unit-focusing lens, in which the focal length does not change. Internal focusing lowers f as well.',
      stories: { A: 'A {f} lens on a sensor {w} wide is focused on an object {s} away. What is the angle of view across the width?' }
    }
  ],
  examples: [
    {
      title: 'A 50 mm lens that focuses to 0.45 m',
      q: 'The datasheet of a 50 mm lens says "closest focus 0.45 m", measured from the sensor. What magnification does it reach, how far does the lens extend, and how far is the subject from the lens?',
      steps: [
        { text: 'Object to sensor: $T = f(2 + m + 1/m) = 450$ mm, so $m + 1/m = 7$ and', tex: 'm = \\frac{7 - \\sqrt{45}}{2} = 0.146' },
        { text: 'Extension and object distance:', tex: 'e = f\\,m = 7.3\\ \\mathrm{mm}, \\qquad s = f\\left(1 + \\frac{1}{m}\\right) = 393\\ \\mathrm{mm}' }
      ],
      a: '$m_{\\max} = 0.146$ (about 1:7); the lens moves out 7.3 mm, and the subject is 393 mm from it — 57 mm closer than the datasheet figure.'
    },
    {
      title: 'How far does it move?',
      q: 'How far must a 50 mm lens move from its infinity setting to focus on a subject 2 m away, and on one 1 m away?',
      steps: [
        { text: 'With $e = f^2/(s - f)$:', tex: 'e_{2\\,\\mathrm{m}} = \\frac{2500}{1950} = 1.28\\ \\mathrm{mm}, \\qquad e_{1\\,\\mathrm{m}} = \\frac{2500}{950} = 2.63\\ \\mathrm{mm}' }
      ],
      a: '1.28 mm and 2.63 mm. The whole range from 2 m to 1 m takes a movement of 1.35 mm, so a focusing mechanism must position the lens to a few micrometres.'
    }
  ],
  quiz: [
    { q: 'By how much, in mm, must a 50 mm lens move out from its infinity position to focus on an object 1 m from the lens?', answer: 2.63, unit: 'mm', why: '$e = f^2/(s-f) = 2500/950 = 2.63$ mm, which is also $f\\,m$ with $m = 0.0526$.' },
    { q: 'Which kind of focusing keeps the length of the barrel constant?', choices: ['Internal focusing', 'Unit focusing', 'Front-element focusing', 'Helicoid focusing of the whole lens'], a: 0, why: 'In internal focusing a group inside the lens moves, so the barrel does not extend. Unit and front-element focusing move the outside of the lens.' },
    { q: 'Focus breathing is the change in angle of view as the focus distance changes.', a: true, why: 'In a lens that simply extends, the angle narrows because the image lies farther behind the lens. In internal-focusing lenses the effective focal length changes too, usually shortening, which widens the view.' },
    { q: 'Why are the distance marks of a focus ring crowded towards infinity?', choices: ['The lens moves very little between infinity and a few metres, and most of the travel is for close distances', 'Infinity is a special setting', 'The ring is cut that way for cheapness', 'Because lenses are sharper there'], a: 0, why: 'The extension is $f^2/(s-f)$, which falls quickly as $s$ grows: from infinity to 3 m the 50 mm lens moves 0.85 mm, and from 1 m to 0.3 m it moves 7 mm.' },
    { q: 'A 100 mm lens is to give a magnification of 1:2. How far, in mm, must it move out from its infinity position?', answer: 50, unit: 'mm', why: '$e = f\\,m = 100\\times 0.5 = 50$ mm: a lens that reaches 1:2 by extension alone needs a tube or a helicoid of that length.' }
  ],
  applications: [
    'Photography and cinema: the focus ring, the focus puller and the engraved distance scales are all this relation between distance and extension.',
    'Autofocus design: the motor must position a small group to a few micrometres and quickly ([[autofocus-methods]]).',
    'Machine vision: lenses are focused once and locked, and a focus ring or a liquid lens may re-set the working distance.',
    'Telescopes and binoculars, where the eyepiece is moved by a rack or a helical focuser.',
    'Macro and copy work, where bellows or extension tubes add the large extension that a helicoid cannot supply.'
  ],
  history: 'Early plate cameras were focused by sliding the lens on a bellows or a box while the photographer looked at a ground glass. The helicoid — a threaded barrel that turns rotation into fine axial movement — became the usual means on small cameras in the 1920s and 1930s, and with it the engraved distance scale and, later, the depth-of-field marks.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — focusing, extension and the design of lenses for close work.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — conjugate distances, extension and the effective aperture at close range.',
    'W. J. Smith, *Modern Optical Engineering* — the conjugate equations used for the extension.'
  ],
  sim: 'fz-focusing'
},

/* ================================================================ autofocus */
{
  id: 'autofocus-methods', parent: 'field-focus-and-zoom', title: 'Autofocus', level: 2,
  short: 'An autofocus system has to find out how far the lens is from focus and in which direction. Contrast detection climbs the sharpness of the image, overshooting and returning; phase detection compares two views through opposite halves of the lens pupil and knows both at once; active systems measure the distance with light.',
  keywords: ['autofocus', 'AF', 'contrast detection', 'phase detection', 'PDAF', 'dual pixel', 'hunting', 'focus peaking', 'time of flight', 'laser autofocus', 'cross-type', 'AF point', 'focus assist', 'front focus', 'back focus', 'rangefinder'],
  prereq: ['focusing-a-lens', 'depth-of-focus', 'the-f-number'],
  related: ['viewfinders-and-focusing-screens', 'time-of-flight-cameras', 'microlenses-bsi-and-stacked-sensors', 'the-phone-camera', 'depth-of-field', 'laser-triangulation', 'the-modulation-transfer-function', 'image-stabilization'],
  body: `
To focus a lens the camera has to know two things: **how far** the image is from the sensor and **which way** the lens must move. Autofocus (AF) systems differ in how they find out.

### Contrast detection
When an image is in focus, edges are sharpest and the **contrast** $C = (I_{\\max} - I_{\\min})/(I_{\\max}+I_{\\min})$ across them is greatest. The camera reads a region of the sensor, moves the lens a step, reads again, and compares. A single reading says nothing about direction; the system must move, see whether the contrast rose or fell, and keep going until it falls again, then **return** to the peak. That overshoot is the "hunting" a slow camera shows. It is accurate, because it uses the picture the sensor itself records, but it takes many frames: twenty positions at 60 frames a second is a third of a second.

### Phase detection
Let light from a point pass through two opposite halves of the lens pupil and form two small images. In focus they coincide. Out of focus they fall apart: the sign of the separation says which way, and its size says how far. One measurement is enough to drive the lens to the answer. The separation on the sensor is

$$\\Delta = \\frac{\\delta\\,B}{v}$$

with $\\delta$ the focus error, $v$ the image distance (about $f$) and $B$ the **baseline**, the distance between the centres of the two half-pupils, about $0.42D = 0.42f/N$. For a 50 mm lens at f/2.8, $B = 7.5$ mm and a focus error of 0.1 mm moves the two images 15 µm apart. Stopped to f/5.6 the baseline and the shift halve: phase detection works best with a fast lens.

Three ways to build it:
- **A separate AF module** (reflex cameras): a secondary mirror sends light to strips of sensor behind small lenses that split the pupil. Fast, but it measures a different path from the imaging sensor, so lens and body may need *micro-adjustment* for front or back focus.
- **Phase-detection pixels** on the imaging sensor: some pixels are half-covered and see only the left or right half of the pupil.
- **Dual-pixel sensors**: every pixel has two photodiodes under one microlens, one for each half of the pupil.

A strip sees detail across its baseline, so **cross-type** points use two strips at right angles.

### Hybrid and active methods
Mirrorless cameras use phase pixels to get near focus quickly and contrast to refine it. **Active** systems measure the distance with light or sound and need no contrast in the scene: infrared triangulation in older compacts, an ultrasonic ranger in an instant camera of 1978, and today a time-of-flight or laser sensor in phones, good to a few metres.

| Method | Measures | Speed | Needs | Typical use |
|---|---|---|---|---|
| Contrast | sharpness over steps | slow, hunts | contrast and light | compacts, video |
| Phase detection | gap of two pupil images | fast, one step | contrast, a fast enough lens | reflex and mirrorless |
| Time of flight, laser | distance, directly | fast | a surface within range | phones, dim light |

### Help for the eye
Manual focus is aided by **focus peaking** (edges of high local contrast are highlighted), magnified live view and, on optical finders, split-image and microprism screens ([[viewfinders-and-focusing-screens]]).

> [!key] Contrast AF climbs a hill and has to overshoot to find the top; phase AF looks through two halves of the pupil and gets direction and distance in one measurement, with a baseline of about $0.42f/N$; active methods measure the distance with light and do not need contrast.
`,
  ideas: [
    'Autofocus must find the direction and the amount of the focus error; the methods differ in how.',
    'Contrast detection maximizes image sharpness: it must overshoot and return, so it is accurate but slower.',
    'Phase detection compares the images from two halves of the pupil: their separation gives both the direction and the size of the error.',
    'The separation is δ·B/v with a baseline B ≈ 0.42 f/N, which is why fast lenses focus more accurately.',
    'Active methods (time of flight, laser) measure distance with light and work in the dark and on blank surfaces, within a limited range.'
  ],
  pitfalls: [
    'Autofocus makes the picture sharp — It places the focus plane where its detector says; the subject, the depth of field and the lens calibration decide what looks sharp.',
    'Phase detection is always better than contrast detection — It is faster and gives direction, but it measures through a separate path or half-masked pixels and can be off; contrast detection measures the real image.',
    'More focus points means better focus — The number of points tells where the camera can look, not how well it measures; the baseline and the lens aperture limit the accuracy.',
    'Focus peaking shows what is in focus — It shows where the image has high local contrast; noise, edges and detail can fool it, and it says nothing about the depth of field.'
  ],
  terms: [
    { term: 'Contrast-detection autofocus', also: ['CDAF', 'contrast AF'], def: 'Autofocus that moves the lens until the contrast of a region of the image is greatest. It needs several readings and some overshoot.' },
    { term: 'Phase-detection autofocus', also: ['PDAF', 'phase AF', 'phase detect'], def: 'Autofocus that compares the images made through two halves of the lens pupil. Their separation tells in which direction and by how much the focus is wrong.' },
    { term: 'Baseline', also: ['pupil separation'], def: 'The distance between the centres of the two parts of the pupil used by phase detection: about 0.42 of the pupil diameter for two halves.' },
    { term: 'Dual-pixel autofocus', also: ['split-pixel AF'], def: 'Phase detection in which every pixel of the sensor has two photodiodes seeing the two halves of the pupil.' },
    { term: 'Hunting', def: 'The back-and-forth movement of a focus mechanism that cannot tell the direction of the error in a single reading.' },
    { term: 'Focus peaking', also: ['peaking'], def: 'A display aid that colours the edges of the picture where the local contrast is high, showing roughly what is in focus.' },
    { term: 'Time-of-flight autofocus', also: ['laser autofocus', 'ToF AF'], def: 'Autofocus using a small sensor that times a pulse of infrared light to the subject and back, to measure its distance directly.' }
  ],
  formulas: [
    {
      name: 'Contrast of an edge',
      expr: 'C = (Imax - Imin)/(Imax + Imin)', tex: 'C = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}}',
      vars: {
        C: { name: 'contrast (modulation)', min: 0, max: 1 },
        Imax: { name: 'brightest value', value: 200, min: 1, max: 100000, tex: 'I_{\\max}' },
        Imin: { name: 'darkest value', value: 50, min: 0, max: 100000, tex: 'I_{\\min}' }
      },
      note: 'The quantity a contrast-detection system tries to maximize.',
      stories: { C: 'An edge has a brightest value of {Imax} and a darkest of {Imin}. What is its contrast?' }
    },
    {
      name: 'Baseline of the two half-pupils',
      expr: 'B = 0.42*f/N', tex: 'B \\approx \\frac{0.42\\,f}{N}',
      vars: {
        B: { name: 'baseline', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'For a circular pupil split into two halves, the centres of the halves are 0.42 D apart.',
      stories: { B: 'A {f} lens is set to f/{N}. How far apart are the centres of the two halves of its pupil?' }
    },
    {
      name: 'Separation of the two images',
      expr: 'sh = dz*B/v', tex: '\\Delta = \\frac{\\delta\\,B}{v}',
      vars: {
        sh: { name: 'separation of the two images on the sensor', q: 'length', unit: 'µm', tex: '\\Delta' },
        dz: { name: 'focus error (distance of the sensor from the focus)', q: 'length', unit: 'µm', value: 100, tex: '\\delta' },
        B: { name: 'baseline', q: 'length', unit: 'mm', value: 7.5 },
        v: { name: 'image distance (about the focal length)', q: 'length', unit: 'mm', value: 50 }
      },
      stories: { sh: 'A lens with a baseline of {B} and an image distance of {v} is out of focus by {dz}. How far apart do the two half-pupil images fall?', dz: 'The two images are seen {sh} apart; the baseline is {B} and the image distance {v}. By how much is the focus wrong?' }
    }
  ],
  examples: [
    {
      title: 'How big is the signal?',
      q: 'A 50 mm lens at f/2.8 is out of focus by 0.1 mm at the sensor. How far apart do the two half-pupil images lie, and how many 4 µm pixels is that? What happens at f/5.6?',
      steps: [
        { text: 'The baseline:', tex: 'B = \\frac{0.42\\times 50}{2.8} = 7.5\\ \\mathrm{mm}' },
        { text: 'The separation:', tex: '\\Delta = \\frac{0.1\\ \\mathrm{mm}\\times 7.5\\ \\mathrm{mm}}{50\\ \\mathrm{mm}} = 15\\ \\mu\\mathrm{m} \\approx 3.75\\ \\text{pixels}' },
        'At f/5.6 the baseline is 3.75 mm and the shift 7.5 µm, about 2 pixels.'
      ],
      a: '15 µm, about four pixels, at f/2.8; half as much at f/5.6. A fraction of a pixel can be measured, so small errors still show, but the signal per unit of focus error is halved.'
    },
    {
      title: 'Hunting against one step',
      q: 'A camera reads 60 frames a second. A contrast system needs 20 lens positions to find and settle on the peak; a phase system needs one reading and then one move taking about 0.1 s. Compare the times.',
      steps: [
        'Contrast: $20/60 = 0.33$ s, plus the overshoot and return.',
        'Phase: one frame, 0.017 s, plus the 0.1 s move: about 0.12 s.'
      ],
      a: 'Roughly 0.35 s against 0.12 s. The phase system also knows the direction from the start, so it never moves the wrong way — which matters when a subject is moving.'
    }
  ],
  quiz: [
    { q: 'Which method can tell, from a single measurement, both the direction and the amount of the focus error?', choices: ['Phase detection', 'Contrast detection', 'Focus peaking', 'Manual focusing'], a: 0, why: 'The two half-pupil images are displaced by an amount proportional to the error, and the sign of the displacement gives the direction. A single contrast reading gives neither.' },
    { q: 'Contrast-detection autofocus has to move past the best focus to find it.', a: true, why: 'One reading cannot say whether the contrast is at its peak. The system sees the contrast fall after the peak and then returns.' },
    { q: 'Why is phase-detection AF less sensitive with an f/5.6 lens than with an f/2.8 lens?', choices: ['The baseline between the two half-pupils halves, so the same focus error gives half the image separation', 'The sensor is smaller', 'There is less light', 'The two images overlap'], a: 0, why: 'The baseline is about $0.42f/N$ and the separation is $\\delta B/v$: doubling $N$ halves the signal.' },
    { q: 'What is the baseline, in mm, for a 100 mm lens at f/2 (about $0.42f/N$)?', answer: 21, unit: 'mm', why: '$B = 0.42\\times 100/2 = 21$ mm.' },
    { q: 'Why does a phone use a time-of-flight sensor to help focus in dim light on a blank wall?', choices: ['It measures the distance with its own light and needs no contrast or scene light', 'It is more precise than phase detection at any distance', 'The wall reflects too little light for the camera', 'It removes the need for a lens'], a: 0, why: 'Contrast and phase methods need detail and light in the scene. An active sensor sends its own pulse, so it works on a plain surface within its range of a few metres.' }
  ],
  applications: [
    'Reflex and mirrorless cameras: phase detection for fast tracking of moving subjects, with contrast to refine.',
    'Phones: dual-pixel phase detection, helped by a time-of-flight sensor for close range and low light.',
    'Video: smooth, predictable focus transitions need the direction information that phase detection provides.',
    'Microscopes and inspection systems: contrast autofocus over a stack, or a reflected laser spot that measures the distance of the surface.',
    'Cinema: radar or laser rangefinders on the matte box give a focus puller the distance to a subject.'
  ],
  history: 'The first mass-market autofocus camera was a compact of 1977 that used a module from Honeywell; in 1978 Polaroid put an ultrasonic range finder in an instant camera. The first reflex camera with autofocus built into the body and the lens system was the Minolta Maxxum (Alpha) 7000 of 1985; phase detection on the imaging sensor itself came with the early 2010s.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — rangefinder and focusing principles.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — autofocus systems and the baseline.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — focal-plane phase detection and sampling.'
  ],
  sim: 'fz-autofocus'
},

/* ================================================================ optical zoom */
{
  id: 'optical-zoom', parent: 'field-focus-and-zoom', title: 'Optical zoom', level: 1,
  short: 'An optical zoom lens changes its real focal length by moving groups of lenses, so the picture is framed narrower or wider while the image stays sharp. The zoom ratio, 3×, 10×, 20×, is the longest focal length over the shortest. Unlike digital zoom, it really adds detail. How it is built is in the principles of the zoom lens.',
  keywords: ['optical zoom', 'zoom lens', 'zoom ratio', '3x', '10x', 'variable focal length', 'constant aperture', 'variable aperture', 'superzoom', 'bridge camera', 'zoom ring', 'parfocal', 'framing', 'telephoto end', 'wide end'],
  prereq: ['field-of-view-and-focal-length', 'the-f-number'],
  related: ['zoom-lens-principles', 'digital-zoom', 'varifocal-and-parfocal-lenses', 'perspective-and-focal-length', 'aperture-and-f-stops', 'telephoto-lens', 'the-phone-camera', 'the-interchangeable-lens-camera', 'projectors'],
  body: `
A zoom lens lets you change the focal length smoothly, by turning a ring or pressing a button, over a range such as 24–70 mm. As the groups of glass inside slide, the field of view narrows or widens and the picture is reframed, without anyone moving. The lens's design is in [[zoom-lens-principles]]; this page is about what the user sees and what to read on the barrel.

### The zoom ratio
The **zoom ratio** is $Z = f_{\\max}/f_{\\min}$. The range is written 24–70 mm, the ratio 2.9×. The width of the scene at a given distance goes down by the same factor.

| Lens (full frame) | Ratio | Angle, horizontal | Scene width at 10 m |
|---|---|---|---|
| 24–70 mm | 2.9× | 73.7° → 28.8° | 15.0 m → 5.1 m |
| 70–200 mm | 2.9× | 28.8° → 10.3° | 5.1 m → 1.8 m |
| 24–240 mm | 10× | 73.7° → 8.6° | 15.0 m → 1.5 m |

Compact and bridge cameras with small sensors reach 20×, 50× and more than 100×, since a long focal length on a tiny sensor is only a few centimetres of glass. For the best image quality a ratio of about 3× is the norm, and each extra factor costs in size, weight and sharpness.

### Constant and variable aperture
The entrance pupil is $D = f/N$. A **constant-aperture** zoom holds the same f-number everywhere in its range, so its pupil must grow in proportion to $f$. A 70–200 mm f/2.8 has a pupil of 25 mm at the short end and 71 mm at the long end: a big front element, a big, heavy lens, and a picture whose brightness does not change as one zooms, which video work needs. A **variable-aperture** zoom lets the pupil grow more slowly. An 18–55 mm f/3.5–5.6 has a pupil of 5.1 mm at 18 mm and 9.8 mm at 55 mm; its maximum f-number rises as it is zoomed, and at 55 mm it passes $(5.6/3.5)^2 = 2.6$ times less light than f/3.5 would — about one and a third stops.

### What zooming does not change
- **Perspective.** The relative sizes of near and far things depend on where the camera stands, not on its focal length. Zooming reframes; to change the perspective one must move ([[perspective-and-focal-length]]).
- **The origin of detail.** Zooming optically narrows the angle so that the sensor's pixels cover less scene: twice the focal length gives twice the linear detail. That is the difference from [[digital-zoom]], which only enlarges.

### What it costs
A zoom is a compromise: lenses of more groups, more glass, a shorter maximum aperture (or more weight), distortion that changes through the range (barrel at the wide end, pincushion at the long end), and sharpness that a prime lens of the same price usually beats. In return one lens does the work of several. Whether the focus stays put during zooming is the subject of [[varifocal-and-parfocal-lenses]].

> [!tip] Read "24–70 mm f/2.8" as: focal length from 24 to 70 mm (ratio 2.9×) and a maximum aperture of f/2.8 at every focal length. "18–55 mm f/3.5–5.6" is f/3.5 at 18 mm falling to f/5.6 at 55 mm.

> [!key] $Z = f_{\\max}/f_{\\min}$. Zooming changes the real focal length, so it reframes the scene and truly adds detail, but it does not change perspective. A constant-aperture zoom needs a pupil that grows in step with $f$ — hence its size.
`,
  ideas: [
    'An optical zoom lens changes its real focal length by moving lens groups; the field of view and the framing follow.',
    'The zoom ratio is the longest focal length over the shortest; the scene width at a given distance falls by that factor.',
    'A constant-aperture zoom needs an entrance pupil that grows in proportion to f, which makes it big; a variable-aperture zoom is smaller but slower at the long end.',
    'Zooming reframes the picture but does not change perspective: only moving the camera does.',
    'Optical zoom gains real detail; it is paid for in size, weight, maximum aperture and aberrations.'
  ],
  pitfalls: [
    'Zooming in is the same as stepping closer — The framing is the same but not the perspective: the relative sizes of near and far objects are fixed by where the camera stands.',
    'A 10× zoom is ten times better than a 3× zoom — It reaches farther, but the long ratio is paid for with a smaller maximum aperture, more distortion and less sharpness.',
    'A zoom lens is f/2.8 at every setting — Only a constant-aperture lens is. A variable-aperture zoom marked f/3.5–5.6 loses light as it is zoomed.',
    'The zoom ratio tells the field of view — It tells the ratio of focal lengths; the field depends on the focal lengths and the sensor.'
  ],
  terms: [
    { term: 'Optical zoom', def: 'A real change of focal length by moving groups of lenses, so that the same sensor records a narrower or wider part of the scene with real detail.' },
    { term: 'Zoom ratio', also: ['zoom range', '3×', '10×'], def: 'The longest focal length of a zoom lens divided by the shortest.' },
    { term: 'Constant-aperture zoom', also: ['fixed-aperture zoom', 'constant maximum aperture'], def: 'A zoom lens whose maximum aperture, as an f-number, does not change with the focal length. It needs a pupil that grows with the focal length.' },
    { term: 'Variable-aperture zoom', also: ['variable maximum aperture'], def: 'A zoom lens whose maximum f-number rises as the focal length is lengthened, as in f/3.5–5.6.' },
    { term: 'Wide end', also: ['short end'], def: 'The shortest focal length of a zoom, giving the widest field of view.' },
    { term: 'Telephoto end', also: ['long end', 'tele end'], def: 'The longest focal length of a zoom, giving the narrowest field of view.' }
  ],
  formulas: [
    {
      name: 'Zoom ratio',
      expr: 'Z = fmax/fmin', tex: 'Z = \\frac{f_{\\max}}{f_{\\min}}',
      vars: {
        Z: { name: 'zoom ratio' },
        fmax: { name: 'longest focal length', q: 'length', unit: 'mm', value: 70, tex: 'f_{\\max}' },
        fmin: { name: 'shortest focal length', q: 'length', unit: 'mm', value: 24, tex: 'f_{\\min}' }
      },
      stories: { Z: 'A zoom lens runs from {fmin} to {fmax}. What is its zoom ratio?', fmax: 'A zoom starts at {fmin} and has a ratio of {Z}. What is its longest focal length?' }
    },
    {
      name: 'Entrance pupil of a zoom',
      expr: 'D = f/N', tex: 'D = \\frac{f}{N}',
      vars: {
        D: { name: 'entrance pupil diameter', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 200 },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'For a constant-aperture zoom this grows in proportion to the focal length.',
      stories: { D: 'A zoom set to {f} is at f/{N}. How wide is its entrance pupil?' }
    },
    {
      name: 'The middle of the range',
      expr: 'fm = sqrt(fmin*fmax)', tex: 'f_{\\text{mid}} = \\sqrt{f_{\\min}\\,f_{\\max}}',
      vars: {
        fm: { name: 'focal length half way in framing steps', q: 'length', unit: 'mm', tex: 'f_{\\text{mid}}' },
        fmin: { name: 'shortest focal length', q: 'length', unit: 'mm', value: 24, tex: 'f_{\\min}' },
        fmax: { name: 'longest focal length', q: 'length', unit: 'mm', value: 240, tex: 'f_{\\max}' }
      },
      note: 'The setting at which the scene width is the geometric mean of its extremes: 76 mm for 24–240 mm, not 132 mm.',
      stories: { fm: 'A zoom runs from {fmin} to {fmax}. At what focal length is the framing half way between the two ends, in steps of equal ratio?' }
    }
  ],
  examples: [
    {
      title: 'The size of the front element',
      q: 'A 70–200 mm f/2.8 zoom is to be built for full frame. What is the diameter of the entrance pupil at each end, and how does that compare with an 18–55 mm f/3.5–5.6 lens at 55 mm?',
      steps: [
        { text: 'Constant aperture:', tex: 'D_{70} = \\frac{70}{2.8} = 25\\ \\mathrm{mm}, \\qquad D_{200} = \\frac{200}{2.8} = 71.4\\ \\mathrm{mm}' },
        { text: 'The variable-aperture lens at its long end:', tex: 'D_{55} = \\frac{55}{5.6} = 9.8\\ \\mathrm{mm}' }
      ],
      a: 'The constant-aperture lens needs a pupil of 71 mm at 200 mm; the small zoom has a 10 mm pupil at 55 mm, seven times less across and about fifty times less in area.'
    },
    {
      title: 'The reach of a 10× zoom',
      q: 'A full-frame 24–240 mm zoom is used from 10 m. How wide is the scene at each end?',
      steps: [
        { text: 'With $W = w(s-f)/f$ and $w = 36$ mm:', tex: 'W_{24} = 36\\times\\frac{9976}{24} = 14.96\\ \\mathrm{m}, \\qquad W_{240} = 36\\times\\frac{9760}{240} = 1.46\\ \\mathrm{m}' }
      ],
      a: '15.0 m at the wide end and 1.5 m at the long end: ten times narrower, as the ratio says.'
    }
  ],
  quiz: [
    { q: 'What is the zoom ratio of a 24–240 mm lens?', answer: 10, why: '$240/24 = 10$: the scene it covers is ten times narrower at the long end.' },
    { q: 'Zooming from 24 mm to 70 mm without moving changes the perspective of the picture.', a: false, why: 'Perspective depends only on the position of the camera. Zooming changes how much of the scene is framed; the relative sizes of near and far things stay the same.' },
    { q: 'A zoom lens is marked 18–55 mm f/3.5–5.6. At 55 mm, compared with f/3.5, it passes about…', choices: ['1⅓ stops less light', 'half as much light', 'the same light', 'four times less light'], a: 0, why: '$(5.6/3.5)^2 = 2.56$, or $\\log_2 2.56 = 1.36$ stops.' },
    { q: 'Why is a 70–200 mm f/2.8 lens so large and heavy?', choices: ['It must keep a 71 mm entrance pupil at 200 mm', 'It contains more glass for decoration', 'Because the focal length is long, whatever the aperture', 'Because it is a prime in disguise'], a: 0, why: 'A constant f/2.8 at every focal length needs $D = f/2.8$, so the pupil grows to 71 mm at 200 mm. A slower lens of the same range would be far smaller.' },
    { q: 'What advantage has an optical zoom over a digital one?', choices: ['It records real extra detail by covering a narrower scene with the same pixels', 'It is cheaper', 'It has no effect on perspective, and digital zoom does', 'It needs no lens'], a: 0, why: 'Twice the focal length puts twice as many pixels across each detail of the scene. Digital zoom crops and enlarges the pixels already recorded.' }
  ],
  applications: [
    'Photography and video: one zoom lens replaces a bag of primes for events, travel and documentary work.',
    'Compact, bridge and phone cameras, whose "optical zoom" reaches 3×–10× or much more with periscope designs.',
    'Surveillance and pan-tilt-zoom cameras that frame a doorway or a whole street on command.',
    'Projectors: the zoom of the projection lens sets the size of the picture from a fixed distance.',
    'Machine vision: motorized zoom lenses that change the field of view of an inspection station without moving the camera.'
  ],
  history: 'The first zoom lens in wide use was the Zoomar of Frank Back, shown in 1946–47 and used on television cameras to follow sports without cutting between lenses. Zoom lenses for 35 mm still cameras appeared around 1959, and became the usual lens on consumer cameras from the 1980s as designs improved with computers.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — zoom lenses from the photographer\'s side.',
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the origins and development of the zoom lens.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the optics of zoom lenses and the variable aperture.'
  ],
  sim: { id: 'fz-zoom', params: { mode: 'zoom' } }
},

/* ================================================================ digital zoom */
{
  id: 'digital-zoom', parent: 'field-focus-and-zoom', title: 'Digital zoom', level: 1,
  short: 'Digital zoom crops the middle of the picture and enlarges it to full size: no optics change, the pixels do. A 2× digital zoom keeps a quarter of the pixels, and interpolation — nearest-neighbour, bilinear, bicubic — only fills in the gaps smoothly. It changes the framing but adds no real detail.',
  keywords: ['digital zoom', 'crop', 'interpolation', 'nearest neighbour', 'bilinear', 'bicubic', 'upscaling', 'resampling', 'hybrid zoom', 'sensor crop', 'super resolution', 'lossless zoom', 'pixels', 'enlarge'],
  prereq: ['optical-zoom', 'sensor-formats-and-pixel-size'],
  related: ['nyquist-sampling-and-aliasing', 'sensor-noise', 'the-phone-camera', 'varifocal-and-parfocal-lenses', 'binning-roi-and-area-of-interest', 'resolution-and-contrast', 'colour-filter-arrays-and-demosaicing', 'field-of-view-and-focal-length'],
  body: `
An optical zoom changes the lens. A **digital zoom** changes nothing in the optics at all: the camera takes the central part of the picture and enlarges it to fill the frame. It is the same as cropping on a computer, done inside the camera.

### What happens to the pixels
For a zoom factor $z$ the camera keeps the central $1/z$ of the width and of the height, and so $1/z^2$ of the pixels, then resamples them to the full size.

| Zoom | Pixels kept, from a 6000 × 4000 (24 MP) sensor | Megapixels | Equivalent of a 50 mm lens |
|---|---|---|---|
| 1× | 6000 × 4000 | 24 | 50 mm |
| 2× | 3000 × 2000 | 6 | 100 mm |
| 4× | 1500 × 1000 | 1.5 | 200 mm |
| 10× | 600 × 400 | 0.24 | 500 mm |

The field of view is that of a lens $z$ times longer, but the picture is made of $z^2$ times fewer real pixels.

### Filling the gaps: interpolation
To enlarge, the program must invent a value for every new pixel from the old ones around it.
- **Nearest neighbour** copies the closest pixel. Edges stay hard but become blocks of $z \\times z$ pixels: the staircase look.
- **Bilinear** averages the four surrounding pixels. It is smooth, and soft: edges blur over a pixel or two.
- **Bicubic** weights sixteen neighbours with a cubic curve (the Catmull–Rom form is common). Edges are crisper, at the price of a slight overshoot, a light halo on each side of a sharp edge.
- **Lanczos** and other windowed kernels trade the halo against sharpness again.

All of these are **averages of what is already there**. A bar pattern whose bars were too fine to be recorded cannot be recovered by any of them.

### What is gained and what is not
- *Gained:* the framing, a picture that fills the screen, and a look smoother than blocks.
- *Not gained:* detail. The finest detail is set by the lens and by the pixels actually used; optical zoom puts $z$ times more pixels across each detail of the scene, digital zoom puts the same pixels over a larger area. Noise and lens flaws are enlarged with the picture.
- *Machine learning* can add plausible texture and sharp edges. It is guessing: for a face or a license plate it may invent what was never recorded, and it must never be used where the picture is a measurement.

### Free zoom and hybrid zoom
A cropped picture needs no enlarging if it already has as many pixels as the output. A 24 MP sensor (6000 pixels across) feeding a 4K video frame (3840 across) can be cropped $6000/3840 = 1.56$ times with no interpolation at all: the "free" zoom factor is $z_{\\text{free}} = W_{\\text{sensor}}/W_{\\text{output}}$. Phone sensors of 50 to 200 megapixels use this to give a 2× or 3× view with real pixels. **Hybrid zoom** combines several fixed lenses (wide, tele) with such crops and with merging of a burst of frames, so that between the optical steps the picture is partly real, partly computed.

> [!key] Digital zoom is crop and enlarge: $1/z^2$ of the pixels, interpolated up. It reframes but adds no true detail; optical zoom does. Zoom is free only until the pixels left equal the pixels needed.
`,
  ideas: [
    'Digital zoom crops the centre of the frame and enlarges it: a factor z keeps 1/z² of the pixels.',
    'Nearest-neighbour copies pixels (blocky), bilinear averages four (soft), bicubic uses sixteen (crisper, with slight halos).',
    'Interpolation can fill the gaps smoothly but cannot recover detail that was never recorded.',
    'Optical zoom puts more pixels on each detail of the scene; digital zoom only spreads the same pixels over more area.',
    'A crop is free of enlargement while the pixels left still cover the output: z_free = sensor width ÷ output width.'
  ],
  pitfalls: [
    'A 10× digital zoom is as good as a 10× optical zoom — The field of view matches, but the picture holds a hundredth of the pixels, and its finest detail is no finer.',
    'Interpolation recovers lost detail — It averages neighbours. Smooth is not the same as sharp, and invented texture is not information.',
    'Digital zoom damages the picture in the camera — It is the same as cropping later; doing it in the camera merely throws the other pixels away, which later cropping would have kept.',
    'More megapixels make digital zoom as good as optical — They make a larger crop free of enlargement, but never more detailed than the lens can resolve.'
  ],
  terms: [
    { term: 'Digital zoom', def: 'Cropping the middle of the picture and enlarging it to full size by interpolation. It changes the framing but not the optical detail.' },
    { term: 'Interpolation', also: ['resampling', 'upscaling', 'upsampling'], def: 'Computing the values of new pixels from the old ones around them when a picture is enlarged.' },
    { term: 'Nearest-neighbour interpolation', also: ['pixel replication'], def: 'Each new pixel takes the value of the nearest old one; the picture becomes blocks.' },
    { term: 'Bilinear interpolation', def: 'Each new pixel is a weighted average of the four old pixels around it: smooth but soft.' },
    { term: 'Bicubic interpolation', also: ['Catmull–Rom', 'cubic convolution'], def: 'Each new pixel is a cubic-weighted combination of the sixteen old pixels around it: sharper edges, with a little overshoot.' },
    { term: 'Hybrid zoom', also: ['sensor-crop zoom', 'lossless zoom'], def: 'In phones, the use of several fixed lenses with cropping of a high-resolution sensor and merging of frames to give intermediate zoom factors.' }
  ],
  formulas: [
    {
      name: 'Pixels across after the crop',
      expr: 'w2 = w/z', tex: 'w_2 = \\frac{w}{z}',
      vars: {
        w2: { name: 'pixels across the cropped picture', tex: 'w_2' },
        w: { name: 'pixels across the sensor', value: 6000, min: 1, max: 100000 },
        z: { name: 'digital zoom factor', value: 2, min: 1, max: 100 }
      },
      stories: { w2: 'A sensor is {w} pixels wide and a digital zoom of {z} is used. How many pixels wide is the part that is kept?' }
    },
    {
      name: 'Megapixels after the crop',
      expr: 'M2 = M/z^2', tex: 'M_2 = \\frac{M}{z^2}',
      vars: {
        M2: { name: 'megapixels kept', tex: 'M_2' },
        M: { name: 'megapixels of the sensor', value: 24, min: 0.1, max: 1000 },
        z: { name: 'digital zoom factor', value: 2, min: 1, max: 100 }
      },
      stories: { M2: 'A {M}-megapixel sensor is used with a digital zoom of {z}. How many megapixels of real data remain?' }
    },
    {
      name: 'Equivalent focal length',
      expr: 'fe = f*z', tex: 'f_{\\text{eq}} = f\\,z',
      vars: {
        fe: { name: 'equivalent focal length', q: 'length', unit: 'mm', tex: 'f_{\\text{eq}}' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 50 },
        z: { name: 'digital zoom factor', value: 2, min: 1, max: 100 }
      },
      stories: { fe: 'A {f} lens is used with a {z} digital zoom. Which focal length gives the same field of view?' }
    },
    {
      name: 'Zoom that needs no enlarging',
      expr: 'zf = Ws/Wo', tex: 'z_{\\text{free}} = \\frac{W_{\\text{sensor}}}{W_{\\text{output}}}',
      vars: {
        zf: { name: 'largest crop factor without interpolation', tex: 'z_{\\text{free}}' },
        Ws: { name: 'pixels across the sensor', value: 6000, min: 1, max: 100000, tex: 'W_{\\text{sensor}}' },
        Wo: { name: 'pixels across the output', value: 3840, min: 1, max: 100000, tex: 'W_{\\text{output}}' }
      },
      stories: { zf: 'A sensor is {Ws} pixels wide and the output is {Wo} pixels wide. By what factor can the picture be cropped before it has to be enlarged?' }
    }
  ],
  examples: [
    {
      title: 'A 3× digital zoom on 24 megapixels',
      q: 'A 24 MP camera (6000 × 4000) with a 50 mm lens is used at 3× digital zoom. What is kept, and what is the picture worth?',
      steps: [
        { text: 'The pixels kept:', tex: '\\frac{6000}{3}\\times\\frac{4000}{3} = 2000\\times 1333 = 2.7\\ \\mathrm{MP}' },
        'The field of view is that of a 150 mm lens. To fill a 3840-pixel-wide 4K frame the picture must be enlarged by $3840/2000 = 1.92$.'
      ],
      a: 'Under 3 million real pixels, of the field of a 150 mm lens, enlarged almost twice. A real 150 mm lens would have supplied all 24 megapixels of detail.'
    },
    {
      title: 'A phone with a 108 MP sensor',
      q: 'A phone sensor is 12 000 × 9000 pixels (108 MP) and the picture saved is 4000 × 3000 (12 MP). What is the largest crop that is free of interpolation?',
      steps: [
        { text: 'Compare the widths:', tex: 'z_{\\text{free}} = \\frac{12\\,000}{4000} = 3' }
      ],
      a: '3×. The central 4000 × 3000 pixels already make a 12 MP picture. Beyond 3× the phone has to enlarge, or switch to a real tele lens.'
    }
  ],
  quiz: [
    { q: 'A 6000-pixel-wide sensor is used with 4× digital zoom. How many pixels wide is the cropped picture?', answer: 1500, why: '$6000/4 = 1500$, and the height shrinks the same way: a sixteenth of the pixels.' },
    { q: 'Bicubic interpolation can restore bars that were too fine for the sensor to record.', a: false, why: 'Interpolation only combines the pixels already recorded. Detail finer than the pixels was lost when the picture was sampled; no averaging can bring it back.' },
    { q: 'Which interpolation gives blocky pictures with hard edges?', choices: ['Nearest neighbour', 'Bilinear', 'Bicubic', 'They all do'], a: 0, why: 'Nearest-neighbour copies each pixel into a block. Bilinear averages (soft), bicubic uses a cubic weighting (sharper, slightly haloed).' },
    { q: 'What is the main difference between 2× optical and 2× digital zoom?', choices: ['Optical puts twice as many pixels across each detail; digital spreads the same pixels over more area', 'Digital zoom changes the perspective', 'Optical zoom needs more light', 'There is none: both show the same field'], a: 0, why: 'The fields of view agree, but the optical zoom resolves details twice as fine in the scene because it magnifies before the sensor samples.' },
    { q: 'A 48 MP camera (8000 pixels across) saves 12 MP pictures (4000 across). What crop factor is free of interpolation?', answer: 2, why: '$8000/4000 = 2$: the central quarter of the sensor already makes a 12 MP picture.' }
  ],
  applications: [
    'Phones: the zoom between the optical steps of the wide and tele cameras is a crop of one of them, with merging of several frames.',
    'Video: cropping a 4K or 8K frame to an HD output gives a smooth digital zoom, "free" until the pixels run out.',
    'Security cameras and video calls, where a region of a wide view is magnified electronically (electronic pan, tilt and zoom).',
    'Scientific cameras, where a region of interest is read out at full resolution to raise the frame rate, equivalent to a crop.',
    'Image editing: any enlargement of a picture uses the interpolation methods of this page.'
  ],
  history: 'Camcorders and compact cameras of the 1990s advertised digital zooms of 100× and more beside their optical zooms of 10× to 20×, and a general scepticism followed: the numbers meant the pictures turned into blocks. Today\'s sensors have so many pixels that moderate digital crops are real, and the trade-off has moved from the sensor to the processing.',
  sources: [
    'R. G. Keys, "Cubic convolution interpolation for digital image processing", *IEEE Transactions on Acoustics, Speech, and Signal Processing* 29 (1981) — the cubic kernel behind bicubic resampling.',
    'R. C. Gonzalez and R. E. Woods, *Digital Image Processing* — image interpolation: nearest-neighbour, bilinear and bicubic.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — sampling and the resolution of a recorded picture.'
  ],
  sim: 'fz-digital'
},

/* ================================================================ varifocal and parfocal */
{
  id: 'varifocal-and-parfocal-lenses', parent: 'field-focus-and-zoom', title: 'Varifocal and parfocal lenses', level: 3,
  short: 'When a zoom changes its focal length, where does the image go? In a parfocal lens it stays on the sensor: focus once and zoom freely. In a varifocal lens it moves, and the lens must be refocused after each change. Cine and broadcast zooms are parfocal; most still-camera zooms and security-camera lenses are varifocal.',
  keywords: ['varifocal', 'parfocal', 'refocus after zooming', 'focus drift', 'zoom tracking', 'back focus', 'compensator', 'CCTV lens', 'cine zoom', 'microscope objectives', 'parfocal distance', 'focus holds'],
  prereq: ['optical-zoom', 'zoom-lens-principles', 'depth-of-focus'],
  related: ['lens-adapters-and-back-focus', 'autofocus-methods', 'focusing-a-lens', 'microscope-objectives', 'the-compound-microscope', 'progressive-lenses', 'eyepieces', 'depth-of-field'],
  body: `
Change the focal length of a lens and its image of a given object moves. A zoom can be designed so that it does *not* move on the sensor, or it can be allowed to, and the difference is the subject of this page.

- A **parfocal** lens keeps the focus while the focal length changes. Focus on a distant subject at the long end, zoom out, and the subject stays sharp.
- A **varifocal** lens does not. After every change of focal length the picture has to be refocused, by hand or by the autofocus.

### Why the image moves
Take a thin two-group zoom of a positive front group, $f_1 = 80$ mm, and a negative rear group, $f_2 = -40$ mm. The groups' spacing $d$ sets the focal length, $F = f_1f_2/(f_1+f_2-d)$, and the image falls a distance $F(1-d/f_1)$ behind the rear group. For the focal lengths of a 2.4× telephoto zoom:

| $F$ | Spacing $d$ | Image behind the rear group | Image behind the front group |
|---|---|---|---|
| 100 mm | 72.0 mm | 10 mm | 82 mm |
| 150 mm | 61.3 mm | 35 mm | 96 mm |
| 200 mm | 56.0 mm | 60 mm | 116 mm |
| 240 mm | 53.3 mm | 80 mm | 133 mm |

If the sensor is fixed behind the front group, the image moves 51 mm across the zoom range. At f/2.8 the sensor may be out by only $\\pm Nc = \\pm 0.08$ mm (with $c = 0.029$ mm), so this is a catastrophe. A **varifocal** design lives with it and refocuses. A **parfocal** design adds a second motion — a compensator group, or the whole group assembly, driven by a cam — that pulls the image back onto the sensor at every focal length. Real lenses keep the error to a few tens of micrometres, and that is why cinema and broadcast zooms are precise, heavy and expensive.

### Where each is found
| | Typical examples |
|---|---|
| Parfocal | Cine and broadcast zooms (the focus puller cannot refocus during a shot); motorized zoom lenses for inspection; microscope objectives on a nosepiece; eyepieces fitted with parfocalising rings |
| Varifocal | Most still-camera zooms, where autofocus refocuses (or the photographer focuses at the long end and then zooms); manual security-camera lenses with a zoom ring *and* a focus ring |

Microscope **objectives** are made parfocal in another sense: each has the same distance from its shoulder to the specimen (the parfocal distance: 45 mm in the traditional standard, 60 mm in another), so that turning the nosepiece to a stronger objective leaves the specimen nearly in focus.

### Setting and testing
- **Test.** Focus on a distant target at the *longest* focal length, where the depth of field is shallowest and the focus most accurate, then zoom out. A parfocal lens stays sharp.
- **Back focus.** A cine zoom that is sharp at the long end but soft at the wide end after this test has its **back focus** out of adjustment, the flange-to-sensor distance. It is set by trial until both ends agree ([[lens-adapters-and-back-focus]]).
- **Zoom tracking.** Some cameras store a table of the focus position against the focal length for each distance and follow it as the lens zooms.

> [!warn] A word with two meanings. In British English a **varifocal** is a progressive spectacle lens, with a power that changes smoothly from top to bottom ([[progressive-lenses]]). Here it means a camera lens that must be refocused after zooming.

> [!key] A parfocal zoom holds the image on the sensor as it zooms, by an extra compensating motion; a varifocal zoom does not and must be refocused. The tolerance is the depth of focus, $\\pm Nc$ — a few hundredths of a millimetre.
`,
  ideas: [
    'In a parfocal lens the image stays on the sensor while the focal length changes; in a varifocal lens it moves and the lens must be refocused.',
    'With two moving groups the image plane moves with the focal length (51 mm in the example): a third motion is needed to hold it.',
    'The tolerance is the depth of focus ±Nc, about ±0.08 mm at f/2.8 on full frame.',
    'Cine, broadcast and microscope optics are parfocal; most still-camera zooms and manual CCTV lenses are varifocal.',
    'Test parfocality by focusing at the long end and zooming out; back focus is adjusted until both ends agree.'
  ],
  pitfalls: [
    'Every zoom lens is parfocal — Many are not: the image moves as the focal length changes and the autofocus or the user must correct it. Only lenses built with a compensating motion keep the focus.',
    'Varifocal means the same as zoom — A varifocal lens is a zoom whose focus drifts. In spectacles the word means something else again: a progressive lens.',
    'If the zoom is soft at one end the lens is faulty — Often the back focus is out; a parfocal lens focused at the long end and soft at the wide end needs its flange distance reset.',
    'A parfocal lens needs no focusing — It keeps its focus as the focal length changes. It still has to be focused once on the subject distance.'
  ],
  terms: [
    { term: 'Parfocal', also: ['parfocal lens', 'holds focus'], def: 'Staying in focus when the focal length changes: the image remains on the sensor through the zoom range.' },
    { term: 'Varifocal', also: ['varifocal lens'], def: 'A lens whose focal length can be changed but whose focus shifts as it does, so it has to be refocused. In British spectacle usage, a progressive lens.' },
    { term: 'Compensator', also: ['focus compensator'], def: 'A lens group, moved on a cam path, whose motion cancels the shift of the image caused by the changing focal length.' },
    { term: 'Back focus', also: ['back-focus adjustment', 'flange back adjustment'], def: 'The distance from the lens mount to the sensor, adjusted so that a zoom stays in focus at both ends of its range.' },
    { term: 'Parfocal distance', also: ['parfocal length'], def: 'In a microscope, the distance from the shoulder of an objective to the specimen plane, made equal for all objectives of a set.' },
    { term: 'Zoom tracking', def: 'Following a stored curve of focus position against focal length as a camera zooms, to keep the subject in focus.' }
  ],
  formulas: [
    {
      name: 'Spacing of a two-group zoom',
      expr: 'd = f1 + f2 - f1*f2/F', tex: 'd = f_1 + f_2 - \\frac{f_1 f_2}{F}',
      vars: {
        d: { name: 'spacing of the groups', q: 'length', unit: 'mm' },
        f1: { name: 'focal length of the front group', q: 'length', unit: 'mm', value: 80, tex: 'f_1' },
        f2: { name: 'focal length of the rear group (negative)', q: 'length', unit: 'mm', value: -40, signed: true, tex: 'f_2' },
        F: { name: 'focal length of the combination', q: 'length', unit: 'mm', value: 150, min: 10, max: 5000 }
      },
      note: 'Thin groups. The same relation as for two lenses a distance d apart.',
      stories: { d: 'A zoom has groups of {f1} and {f2}. How far apart must they be for a focal length of {F}?' }
    },
    {
      name: 'Image position behind the rear group',
      expr: 'b = F*(1 - d/f1)', tex: 'b = F\\left(1 - \\frac{d}{f_1}\\right)',
      vars: {
        b: { name: 'distance from the rear group to the image', q: 'length', unit: 'mm', signed: true },
        F: { name: 'focal length of the combination', q: 'length', unit: 'mm', value: 150, min: 10, max: 5000 },
        d: { name: 'spacing of the groups', q: 'length', unit: 'mm', value: 61.3, min: 0, max: 1000 },
        f1: { name: 'focal length of the front group', q: 'length', unit: 'mm', value: 80, tex: 'f_1' }
      },
      note: 'Back focal distance of the two-group zoom: where the sensor must sit if the rear group alone moves.'
    },
    {
      name: 'Blur from focus drift',
      expr: 'bl = dz/N', tex: 'b = \\frac{\\Delta z}{N}',
      vars: {
        bl: { name: 'diameter of the blur disc', q: 'length', unit: 'µm', tex: 'b' },
        dz: { name: 'how far the image misses the sensor', q: 'length', unit: 'µm', value: 100, tex: '\\Delta z' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      stories: { bl: 'After zooming the image falls {dz} in front of the sensor, at f/{N}. How large is the blur of a point?' }
    },
    {
      name: 'Shift the focus may drift without a visible loss',
      expr: 'dm = N*c', tex: '\\Delta z_{\\max} = N\\,c',
      vars: {
        dm: { name: 'tolerated shift (one side)', q: 'length', unit: 'µm', tex: '\\Delta z_{\\max}' },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 },
        c: { name: 'circle of confusion', q: 'length', unit: 'µm', value: 28.8 }
      },
      note: 'The depth of focus on either side of the sensor.',
      stories: { dm: 'At f/{N} with a circle of confusion of {c}, how far may the image miss the sensor before the blur exceeds the criterion?' }
    }
  ],
  examples: [
    {
      title: 'The two-group zoom',
      q: 'A zoom has groups of +80 mm and −40 mm. Find the spacing and the image position (behind the front group) at F = 100 mm and at F = 240 mm, and the shift of the image.',
      steps: [
        { text: 'At $F = 100$ mm:', tex: 'd = 80 - 40 - \\frac{80\\times(-40)}{100} = 72\\ \\mathrm{mm}, \\quad b = 100\\left(1 - \\frac{72}{80}\\right) = 10\\ \\mathrm{mm}' },
        { text: 'At $F = 240$ mm:', tex: 'd = 40 + \\frac{3200}{240} = 53.3\\ \\mathrm{mm}, \\quad b = 240\\left(1 - \\frac{53.3}{80}\\right) = 80\\ \\mathrm{mm}' },
        'The image sits $72 + 10 = 82$ mm behind the front group at one end and $53.3 + 80 = 133.3$ mm at the other.'
      ],
      a: 'The image moves 51 mm over the zoom range. With only the groups\' spacing changing, the lens is varifocal; a parfocal design must also move the groups bodily by this amount.'
    },
    {
      title: 'How far may the focus drift?',
      q: 'A full-frame cine zoom at f/2.8 uses a circle of confusion of 0.029 mm. How far may its image plane wander over the zoom range, and what blur results at 0.5 mm?',
      steps: [
        { text: 'The tolerance:', tex: '\\Delta z_{\\max} = N\\,c = 2.8\\times 0.029 = 0.081\\ \\mathrm{mm}' },
        { text: 'A drift of 0.5 mm gives a blur disc of', tex: 'b = \\frac{0.5}{2.8} = 0.18\\ \\mathrm{mm}' }
      ],
      a: '±0.08 mm. A drift of 0.5 mm makes a blur disc 0.18 mm across, six times the criterion: obviously out of focus.'
    }
  ],
  quiz: [
    { q: 'You focus a zoom lens on a distant target at its longest focal length and zoom out. The target stays sharp. The lens is…', choices: ['parfocal', 'varifocal', 'afocal', 'telecentric'], a: 0, why: 'A parfocal lens holds the image on the sensor through the zoom range. A varifocal lens would need refocusing.' },
    { q: 'Why is it best to set the focus at the long end of the zoom range when testing parfocality?', choices: ['The depth of field is shallowest there, so the focus is most accurate', 'The lens is brighter there', 'The picture is larger at the wide end', 'The back focus cannot be seen at the wide end'], a: 0, why: 'At the long end the magnification is highest and the depth of field smallest, so a focus error shows most and the setting is most precise.' },
    { q: 'In British spectacle usage, a "varifocal" lens is a zoom lens for cameras.', a: false, why: 'A varifocal in spectacles is a progressive lens, whose power changes smoothly from the top to the bottom of the lens.' },
    { q: 'At f/4 with a circle of confusion of 0.03 mm, how far, in mm, may the image plane drift to one side before the blur is visible ($\\Delta z = Nc$)?', answer: 0.12, unit: 'mm', why: '$\\Delta z_{\\max} = N\\,c = 4\\times 0.03 = 0.12$ mm.' },
    { q: 'A cine zoom is sharp at the long end but soft at the wide end after focusing at the long end. What should be adjusted?', choices: ['The back focus (flange distance)', 'The aperture', 'The zoom ratio', 'The shutter angle'], a: 0, why: 'A lens that is parfocal in design but misses focus at one end has its flange-to-sensor distance wrong; it is trimmed until both ends agree.' }
  ],
  applications: [
    'Cine and broadcast zooms, which must hold focus during a zoom while the focus puller is busy with the subject.',
    'Security cameras with manual varifocal lenses: set the zoom ring for the field wanted, then the focus ring for the distance.',
    'Microscopes, whose parfocal objectives keep the specimen in focus when the nosepiece is turned.',
    'Still-camera zooms that rely on autofocus to refocus after every change of focal length.',
    'Motorized inspection zooms with a stored table of focus against zoom ("zoom tracking") that is calibrated at the factory.'
  ],
  history: 'The first zoom lenses for film and television had to be parfocal, because a camera operator cannot refocus during a shot. Still-camera zooms, where the photographer refocuses after zooming and later the autofocus did it, could be simpler, lighter and cheaper, and most are varifocal in design.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — zoom lenses and how they hold the image in place.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — zoom lenses and the movement of the image plane.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — zoom lens types, parfocal operation and back focus.'
  ],
  sim: { id: 'fz-zoom', params: { mode: 'focus' } }
},

/* ================================================================ close-up and extension tubes */
{
  id: 'close-up-and-extension-tubes', parent: 'field-focus-and-zoom', title: 'Close-up: extension tubes and bellows', level: 2,
  short: 'A lens made for subjects at metres can work at centimetres if it is moved farther from the sensor than its focus ring allows. An extension of x gives a magnification x/f; tubes, bellows, screw-on close-up lenses and reversed lenses are four ways to do it, and every one costs light: the working f-number is N(1 + m).',
  keywords: ['extension tube', 'bellows', 'close-up lens', 'diopter', 'reversing ring', 'macro', 'magnification', 'working f-number', 'light loss', 'extension', 'reproduction ratio', 'close focus', 'C-mount extension ring', 'spacer'],
  prereq: ['focusing-a-lens', 'magnification-and-working-distance', 'the-f-number'],
  related: ['macro-lenses', 'depth-of-field', 'lens-adapters-and-back-focus', 'c-mount', 'cs-mount', 'reading-a-lens-datasheet', 'lateral-and-longitudinal-magnification', 'the-airy-disk'],
  body: `
A lens built to focus from infinity to, say, half a metre cannot photograph a coin at life size: its focus ring runs out of travel long before. The remedy is to move the lens farther from the sensor still, or to shorten its focus by adding power in front. There are four ways.

### Extension
Focusing a lens on an object at magnification $m$ needs it to stand an **extension** $x = f\\,m$ beyond its infinity position. Turned round: a lens set to infinity with a tube or bellows of length $x$ behind it works at $m = x/f$, with the object at $s = f(1 + 1/m)$ from it. For a 50 mm lens:

| Magnification | Extension $x$ | Object distance from the lens | Object to sensor |
|---|---|---|---|
| 0.1 (1:10) | 5 mm | 550 mm | 605 mm |
| 0.25 (1:4) | 12.5 mm | 250 mm | 313 mm |
| 0.5 (1:2) | 25 mm | 150 mm | 225 mm |
| 1 (1:1) | 50 mm | 100 mm | 200 mm |

A 36 mm tube on a 100 mm lens set to infinity gives $m = 0.36$ with the subject 378 mm away. With a tube the lens can no longer reach infinity: its focus range shrinks to a narrow band of close distances.

### Four ways
- **Extension tubes** are hollow rings with the lens mount at both ends and no glass: nothing is added to the image quality, only length. They come in sets (for photographic mounts of 12, 20, 36 mm and the like; for C-mount, rings of 0.5 to 40 mm). Cheap ones lack the electrical contacts for autofocus and aperture.
- **Bellows** give the same continuously, and much more of it: magnifications of 1 and more, focused by moving the lens or the camera along a rail.
- **Close-up lenses** screw into the filter thread like a filter. A lens of power $D$ in front of a lens set to infinity brings the subject into focus at $1/D$: a +2 D close-up lens at 0.5 m, +4 D at 0.25 m, +10 D at 0.1 m. The magnification is $m = f\\,D$ ($f$ in metres): 0.2 for a 100 mm lens with +2 D. No light is lost and no extension is needed, but a single glass lens adds aberrations; two-element achromatic close-up lenses are far better.
- **Reversing** the lens. A lens is designed with the long conjugate on its front and the short one on its rear. At magnifications above about 1, the roles swap, so the lens is mounted backwards on a reversing ring, with its front towards the sensor.

### Light and sharpness
Moving the lens out makes the cone of light narrower on the sensor side. The **working f-number** is $N_w = N(1 + m)$ ([[the-f-number]]): at 1:1 an f/4 lens acts as f/8, and the exposure needs $(1+m)^2 = 4$ times more light, **two stops**. A through-the-lens meter allows for it; a hand-held meter or a manual flash does not. Diffraction follows $N_w$ too: at 1:1 and f/8 the Airy disc is that of f/16, 21 µm across. The depth of field, $2Nc(m+1)/m^2$, is already tiny: 0.9 mm at 1:1 (see [[depth-of-field]]).

| | Loses light | Image quality | Keeps infinity |
|---|---|---|---|
| Extension tubes, bellows | yes, $(1+m)^2$ | unchanged | no |
| Close-up lenses | no | worse if a single element | yes (the lens is unchanged) |
| Reversed lens | yes | good at high $m$ | no |
| Macro lens | yes (the same) | designed for it | yes |

> [!tip] A dedicated [[macro-lenses|macro lens]] is corrected for the close range and has the extra travel built in. The methods above do the same job with ordinary lenses, and in machine vision with fixed lenses and C-mount rings.

> [!key] Extension $x$ gives magnification $m = x/f$; a close-up lens of power $D$ gives $m = fD$. The cost is light: the working f-number is $N(1+m)$, two stops at 1:1.
`,
  ideas: [
    'A lens set to infinity with an extension x behind it works at magnification m = x/f; the lens can no longer reach infinity.',
    'Tubes and bellows add no glass; close-up lenses add power instead (m = f·D) and lose no light.',
    'A reversed lens suits magnifications above about 1, where the object and image conjugates trade places.',
    'The working f-number is N(1 + m): at 1:1 the exposure rises fourfold, two stops, and diffraction is that of the working f-number.',
    'Close up the depth of field is 2Nc(m + 1)/m²: under a millimetre at 1:1.'
  ],
  pitfalls: [
    'An extension tube magnifies the image like a teleconverter — It adds no glass and no power. It moves the lens away from the sensor, which raises the magnification at a *shorter* working distance.',
    'The f-number on the lens stays correct with a tube — It gives the wrong exposure: the light on the sensor goes as $1/N_w^2 = 1/(N(1+m))^2$. At 1:1 it is a quarter.',
    'A close-up lens loses light like a tube — It changes no distance behind the lens, so the f-number and exposure are unchanged.',
    'Closing the aperture always improves close-ups — The depth of field grows, but the working f-number makes diffraction visible earlier: at 1:1, f/8 already behaves as f/16.'
  ],
  terms: [
    { term: 'Extension tube', also: ['spacer', 'extension ring', 'macro tube'], def: 'A hollow ring placed between the lens and the camera to move the lens farther from the sensor and so increase the magnification. It contains no glass.' },
    { term: 'Bellows', also: ['macro bellows'], def: 'A lightproof folding sleeve that gives a continuously adjustable extension, usually on a rail.' },
    { term: 'Close-up lens', also: ['diopter', 'dioptre lens', 'macro filter', 'supplementary lens'], def: 'A positive lens that screws into the filter thread of a lens, shortening its focus to 1/D metres for a power of D dioptres.' },
    { term: 'Reversing ring', also: ['reverse adapter'], def: 'An adapter that mounts a lens backwards, with its front towards the sensor, for magnifications above about 1.' },
    { term: 'Working f-number', also: ['effective f-number', 'effective aperture'], def: 'The f-number that applies at magnification m: N(1 + m). It governs exposure and diffraction in close-up work.' },
    { term: 'Reproduction ratio', also: ['1:1', 'life size'], def: 'Magnification written as a ratio: 1:2 means the image is half the size of the object.' }
  ],
  formulas: [
    {
      name: 'Magnification from an extension',
      expr: 'm = x/f', tex: 'm = \\frac{x}{f}',
      vars: {
        m: { name: 'magnification' },
        x: { name: 'extension beyond the infinity position', q: 'length', unit: 'mm', value: 36 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A lens set to infinity with a tube or bellows of this length behind it.',
      stories: { m: 'A {x} tube is put behind a {f} lens set to infinity. What magnification does it give?', x: 'What extension gives a {f} lens a magnification of {m}?' }
    },
    {
      name: 'Magnification with a close-up lens',
      expr: 'm = f*D', tex: 'm = f\\,D',
      vars: {
        m: { name: 'magnification' },
        f: { name: 'focal length of the camera lens (set to infinity)', q: 'length', unit: 'mm', value: 135 },
        D: { name: 'power of the close-up lens', q: 'optpower', unit: 'D', value: 2 }
      },
      note: 'Thin lenses in contact. The subject is at 1/D from the close-up lens.',
      stories: { m: 'A {D} close-up lens is screwed on a {f} lens set to infinity. What magnification results?' }
    },
    {
      name: 'Light lost, in stops',
      expr: 'L = 2*log2(1 + m)', tex: 'L = 2\\log_2(1 + m)',
      vars: {
        L: { name: 'exposure increase needed, in stops' },
        m: { name: 'magnification', value: 1, min: 0, max: 20 }
      },
      note: 'Follows from the working f-number N(1 + m).',
      stories: { L: 'A lens is used at a magnification of {m} with an extension. By how many stops must the exposure be increased?' }
    },
    {
      name: 'Object distance at a given magnification',
      expr: 's = f*(1 + 1/m)', tex: 's = f\\left(1 + \\frac{1}{m}\\right)',
      vars: {
        s: { name: 'object distance from the lens', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'magnification', value: 0.36, min: 0.01, max: 20 }
      },
      stories: { s: 'A {f} lens works at a magnification of {m}. How far from the lens is the subject?' }
    }
  ],
  examples: [
    {
      title: 'A tube on a portrait lens',
      q: 'A 36 mm tube is fitted to a 100 mm lens set to infinity and used at f/8 on full frame. Find the magnification, the working distance from the lens, the working f-number, the exposure change and the depth of field ($c = 0.0288$ mm).',
      steps: [
        { text: 'Magnification and distance:', tex: 'm = \\frac{36}{100} = 0.36, \\qquad s = 100\\left(1 + \\frac{1}{0.36}\\right) = 378\\ \\mathrm{mm}' },
        { text: 'Light:', tex: 'N_w = 8\\times 1.36 = 10.9, \\qquad L = 2\\log_2 1.36 = 0.88\\ \\text{stops}' },
        { text: 'Depth of field:', tex: 'D = \\frac{2\\times 8\\times 0.0288\\times 1.36}{0.36^2} = 4.8\\ \\mathrm{mm}' }
      ],
      a: 'm = 0.36 with the subject 378 mm from the lens, about 0.9 stop more exposure, and a sharp zone under 5 mm deep.'
    },
    {
      title: 'A close-up lens on a telephoto',
      q: 'A +2 D close-up lens is screwed on a 135 mm lens set to infinity. What magnification, and at what distance from the close-up lens is the subject?',
      steps: [
        { text: 'Magnification:', tex: 'm = f\\,D = 0.135\\ \\mathrm{m}\\times 2\\ \\mathrm{D} = 0.27' },
        'The subject lies at $1/D = 0.5$ m from the close-up lens.'
      ],
      a: 'm = 0.27 (about 1:3.7) at 0.5 m, with no change of f-number and no loss of light. The longer the camera lens, the more magnification a given close-up lens gives.'
    }
  ],
  quiz: [
    { q: 'What extension, in mm, gives a 50 mm lens a magnification of 1:2?', answer: 25, unit: 'mm', why: '$x = f\\,m = 50\\times 0.5 = 25$ mm.' },
    { q: 'Which of these methods of close focusing does **not** need extra exposure?', choices: ['A screw-on close-up lens', 'An extension tube', 'A bellows', 'A reversed lens at 1:1'], a: 0, why: 'A close-up lens adds power in front and changes no distance behind the lens, so the f-number and the exposure stay the same. Tubes, bellows and reversal all lengthen the path to the sensor.' },
    { q: 'A 50 mm tube added to a 50 mm lens still lets it focus to infinity.', a: false, why: 'The tube holds the lens 50 mm farther from the sensor than its infinity position: it can now only focus on close subjects, from 1:1 (at 100 mm from the lens) and nearer.' },
    { q: 'By how many stops must the exposure be increased at a magnification of 1 (1:1) with an extension?', answer: 2, why: '$N_w = N(1+1) = 2N$, and light falls as $1/N_w^2$: a factor of four, two stops.' },
    { q: 'Why is a lens sometimes mounted backwards for magnifications above 1?', choices: ['The object and image conjugates trade places, and the lens is designed for a long object side and a short image side', 'The glass becomes thinner', 'It reduces the light loss', 'It increases the depth of field'], a: 0, why: 'A normal lens is corrected for an object far away and an image near; at $m > 1$ the object is the near one, so reversing the lens restores the conjugates it was designed for.' }
  ],
  applications: [
    'Macro photography with ordinary lenses: tubes for flowers and insects, bellows for coins and stamps, reversed lenses for the highest magnifications.',
    'Machine vision: 0.5 to 40 mm C-mount rings change the working distance and the magnification of a fixed lens, at the price of the infinity focus.',
    'Copy and document work, where a lens set to a fixed small magnification is held on a stand.',
    'Telescope cameras: extension tubes and adapters put the sensor at the right place behind the eyepiece or the focuser.',
    'Stage and studio work, where a +1 or +2 D close-up lens lets a zoom focus on a hand-held object.'
  ],
  history: 'Bellows and extension are as old as the view camera: a long bellows was the way to photograph small objects large in the nineteenth century. The macro lens, corrected for the close range and carrying its own long helicoid, became common on 35 mm cameras only after the middle of the twentieth century.',
  sources: [
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — close-up photography, extension and the effective aperture.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — close-up methods: tubes, bellows, supplementary lenses and reversal.',
    'W. J. Smith, *Modern Optical Engineering* — the conjugate equations and the working f-number.'
  ],
  sim: 'fz-closeup'
},

/* ================================================================ perspective */
{
  id: 'perspective-and-focal-length', parent: 'field-focus-and-zoom', title: 'Perspective and focal length', level: 2,
  short: 'Perspective — how large near things look next to far ones — depends on where the camera stands, not on the lens. A wide-angle and a telephoto lens used from the same spot give the same perspective; one just shows a larger part of it. The dolly zoom, in which the camera moves while the lens zooms, proves it.',
  keywords: ['perspective', 'perspective distortion', 'wide-angle exaggerates', 'telephoto compresses', 'dolly zoom', 'vertigo effect', 'camera position', 'viewpoint', 'centre of perspective', 'portrait distance', 'selfie distortion', 'compression', 'viewing distance'],
  prereq: ['field-of-view-and-focal-length', 'magnification-and-working-distance', 'entrance-and-exit-pupils'],
  related: ['optical-zoom', 'fisheye-lenses', 'telephoto-lens', 'retrofocus-wide-angle', 'depth-and-perspective-illusions', 'lens-distortion-and-calibration', 'the-moon-illusion-and-size-constancy', 'projections:field-of-view-and-focal-length', 'projections:photography-lenses-and-projections', 'projections:cinema-and-anamorphic-lenses'],
  body: `
Photographers say that wide-angle lenses "exaggerate depth" and telephoto lenses "compress" it. The words describe pictures people see. The cause they name is wrong: **perspective does not depend on the focal length at all.**

### A picture is a view from one point
A camera records what one point sees — the centre of perspective, at the entrance pupil of the lens ([[entrance-and-exit-pupils]]). An object of height $H$ at distance $Z$ appears $h = fH/Z$ tall. The focal length $f$ multiplies every size in the picture by the same factor, so the *ratios* of sizes — how large a near thing is against a far one, which objects overlap, how fast parallel lines converge — depend only on the distances $Z$. Two equal trees at 10 m and 20 m always appear 2:1; two at 100 m and 110 m appear 1.1:1, a squeezed look that comes from standing far away.

You can prove it. From one spot take a picture with a 24 mm lens, and another with a 70 mm lens. Enlarge the middle of the first to the size of the second: they match, apart from resolution. A telephoto shows less of the same perspective, magnified.

### Why it seems to be the lens
To fill the frame with one subject, a wide lens must be used close and a telephoto lens far. The lens and the distance go together, and it is the distance that matters.

| Distance to the face | Nose against ear (0.1 m behind) | Looks like |
|---|---|---|
| 0.4 m (a selfie) | 1.25 | a big nose |
| 1.5 m | 1.07 | natural |
| 3 m | 1.03 | flat |

Portraits are shot at 2 m or more with an 85–135 mm lens for that reason.

### The dolly zoom
Move the camera towards the subject while zooming out, so that the subject keeps the same size in the frame: since $h = fH/Z$, that needs $f \\propto Z$. The subject stays put; the background, at $Z + L$, has size $\\propto f/(Z+L) = Z/(Z+L)$ and changes. A person 1.7 m tall kept 12 mm tall on the sensor needs $f = 21$ mm at 3 m and 71 mm at 10 m; a building 20 m wide, 20 m behind, grows from 18.4 mm to 47.1 mm across the sensor as the camera backs off. The effect, an unreal stretching of the space behind the subject, was developed for Hitchcock's *Vertigo* (1958) and used in *Jaws* (1975).

### What does depend on the lens
- **Distortion.** Barrel and pincushion, and the mapping of a fisheye ([[fisheye-lenses]]), are properties of the lens.
- **Stretching in the corners.** In a very wide rectilinear picture a ball near the edge becomes an ellipse. That too is correct perspective — seen from the wrong place. A picture is "right" when viewed from the distance at which it spans the angle it was taken with: $V = f\\,M$ for an enlargement $M$. A 20 × 30 cm print from a full-frame 24 mm lens ($M = 8.3$) wants a viewing distance of 0.2 m, and one from a 200 mm lens 1.7 m. We view prints from 0.4–0.5 m, so wide pictures look exaggerated and long ones flat, partly for that reason.
- **Depth of field** and the look of the blur ([[depth-of-field]]).

> [!key] Perspective is fixed by the camera position: $h = fH/Z$ scales all sizes alike. Changing the focal length from one spot only crops; to change perspective, move. The dolly zoom keeps the subject while the background changes, proving it.
`,
  ideas: [
    'Perspective depends on the position of the camera (the centre of perspective), not on the focal length.',
    'The size of an object in the picture is f·H/Z; the focal length scales all sizes alike, so the ratios depend on the distances only.',
    'Wide-angle and telephoto looks come from standing near and far to fill the frame with the same subject.',
    'The dolly zoom keeps the subject the same size while the background grows or shrinks: f ∝ Z.',
    'The corners of a wide picture look stretched when viewed from farther than f·M; distortion is the part that really belongs to the lens.'
  ],
  pitfalls: [
    'Telephoto lenses compress distance — They show a small part of the picture. Distant things look compressed because you are far from them; step back with a wide lens and crop, and the same compression appears.',
    'Wide-angle lenses distort faces — At arm\'s length the nose is a quarter closer than the ears, whatever the lens; the closeness does it, and the wide lens is only what lets you frame a face from there.',
    'Zooming in is the same as stepping forward — Zooming reframes; the relative sizes of near and far things stay the same. Only moving changes them.',
    'A fisheye image shows the perspective of the lens — A fisheye also has a mapping that bends lines; that is distortion, which does belong to the lens.'
  ],
  terms: [
    { term: 'Perspective', also: ['linear perspective', 'viewpoint'], def: 'The way a picture shows the relative sizes and overlaps of near and far things, fixed by the position of the camera.' },
    { term: 'Centre of perspective', also: ['viewpoint', 'entrance pupil (as a viewpoint)'], def: 'The point from which the picture is projected: the centre of the entrance pupil of the lens.' },
    { term: 'Dolly zoom', also: ['Vertigo effect', 'contra-zoom', 'zolly'], def: 'A shot in which the camera moves towards or away from a subject while the lens zooms the other way, keeping the subject the same size while the background changes.' },
    { term: 'Perspective distortion', def: 'The exaggerated look of near objects against far ones when the camera is close; it comes from the closeness, not from the lens.' },
    { term: 'Correct viewing distance', also: ['proper viewing distance'], def: 'The distance from which a picture spans the same angle as the scene did at the camera: the focal length times the enlargement.' }
  ],
  formulas: [
    {
      name: 'Size of an object in the picture',
      expr: 'hi = f*H/Z', tex: 'h = \\frac{f\\,H}{Z}',
      vars: {
        hi: { name: 'height of the image on the sensor', q: 'length', unit: 'mm', tex: 'h' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 21.2 },
        H: { name: 'height of the object', q: 'length', unit: 'm', value: 1.7 },
        Z: { name: 'distance from the camera', q: 'length', unit: 'm', value: 3, min: 0.1, max: 10000 }
      },
      note: 'Distant object, thin lens. Solve for f to keep a subject the same size at a new distance: the dolly zoom.',
      stories: { hi: 'A {H} tall person stands {Z} from a camera with a {f} lens. How tall is the image on the sensor?', f: 'A {H} tall person, {Z} away, is to be {hi} tall on the sensor. What focal length is needed?' }
    },
    {
      name: 'Relative size of near and far',
      expr: 'r = (Z + dz)/Z', tex: 'r = \\frac{Z + \\Delta Z}{Z}',
      vars: {
        r: { name: 'how much larger the nearer of two equal objects appears' },
        Z: { name: 'distance to the nearer object', q: 'length', unit: 'm', value: 0.4, min: 0.05, max: 10000 },
        dz: { name: 'extra distance to the farther object', q: 'length', unit: 'm', value: 0.1, min: 0, max: 10000, tex: '\\Delta Z' }
      },
      note: 'Only the distances enter, not the lens.',
      stories: { r: 'Two equal objects are {Z} and {dz} farther away from a camera. How much larger does the nearer one appear?', Z: 'A face has a nose {dz} in front of the ears. At what distance does the nose look {r} times larger than the ears?' }
    },
    {
      name: 'Correct viewing distance',
      expr: 'V = f*M', tex: 'V = f\\,M',
      vars: {
        V: { name: 'viewing distance for correct perspective', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 },
        M: { name: 'enlargement from sensor to print or screen', value: 8.3, min: 0.5, max: 500 }
      },
      stories: { V: 'A print is {M} times the size of the sensor, taken with a {f} lens. From what distance does it have the correct perspective?' }
    }
  ],
  examples: [
    {
      title: 'Keeping a person the same size',
      q: 'A 1.7 m tall person is to fill 12 mm of the height of a full-frame sensor at 3 m and again at 10 m. Which focal lengths, and how does a 20 m wide building 20 m behind the person change?',
      steps: [
        { text: 'From $h = fH/Z$:', tex: 'f = \\frac{h\\,Z}{H} = \\frac{12\\times 3}{1.7} = 21.2\\ \\mathrm{mm} \\quad\\text{and}\\quad \\frac{12\\times 10}{1.7} = 70.6\\ \\mathrm{mm}' },
        { text: 'The building:', tex: 'h_b = \\frac{f\\times 20}{Z + 20} = \\frac{21.2\\times 20}{23} = 18.4\\ \\mathrm{mm} \\quad\\text{and}\\quad \\frac{70.6\\times 20}{30} = 47.1\\ \\mathrm{mm}' }
      ],
      a: '21 mm at 3 m and 71 mm at 10 m. The person is the same size, the building grows 2.6 times: the dolly zoom, made by moving the camera and changing nothing but the lens.'
    },
    {
      title: 'How far for a flattering portrait?',
      q: 'The nose is 0.1 m in front of the ears. At what distance does it look no more than 5 % larger?',
      steps: [
        { text: 'Solve $(Z + 0.1)/Z = 1.05$:', tex: 'Z = \\frac{0.1}{0.05} = 2\\ \\mathrm{m}' }
      ],
      a: '2 m. With a full-frame camera that calls for about an 85–135 mm lens to fill the frame with a head, which is why they are called portrait lenses.'
    }
  ],
  quiz: [
    { q: 'You photograph a street from one spot with a 24 mm lens and with a 70 mm lens. If you crop the 24 mm picture to the field of the 70 mm one, the perspective is…', choices: ['the same, with fewer pixels', 'wider', 'compressed more', 'impossible to compare'], a: 0, why: 'Both pictures are views from the same point. The focal length only scales them; cropping one to the field of the other gives the same picture.' },
    { q: 'Telephoto lenses compress perspective in themselves, whatever the distance of the camera.', a: false, why: 'The compression comes from standing far away. The same camera position with a wide lens, cropped, gives the same relative sizes.' },
    { q: 'Two identical trees stand 100 m and 110 m from the camera. How many times larger does the nearer one appear?', answer: 1.1, why: '$h \\propto 1/Z$, so the ratio is $110/100 = 1.1$, whatever the lens.' },
    { q: 'In a dolly zoom the camera moves towards the subject while the lens zooms out to keep the subject the same size. What happens to the background?', choices: ['It shrinks relative to the subject', 'It grows relative to the subject', 'It stays the same', 'It goes out of focus'], a: 0, why: 'The background size goes as $f/(Z+L)$ with $f \\propto Z$, so $Z/(Z+L)$, which falls as $Z$ falls: the space behind the subject seems to stretch away.' },
    { q: 'Which of these genuinely belongs to the lens rather than to the camera position?', choices: ['Barrel distortion', 'The relative size of a near and a far tree', 'The overlap of a post and a building', 'The convergence of parallel lines'], a: 0, why: 'Distortion is a property of the lens. The sizes, overlaps and convergence are all set by where the camera stands.' }
  ],
  applications: [
    'Portraiture: the camera is placed 2 m or more from the face, and the focal length chosen to frame it from there.',
    'Architecture and real estate: wide lenses used from the right place, with the shift or stitching used to control the converging verticals.',
    'Cinema: the dolly zoom, and the choice of lens by the "feel" of the space, which is really a choice of distance.',
    'Photogrammetry and camera calibration, which need the centre of perspective ([[projections:camera-calibration-and-homography|camera calibration]]).',
    'Forensic and survey work, where measuring from a picture needs the position of the camera.'
  ],
  history: 'The rules of linear perspective were set down in the fifteenth century by Brunelleschi and Alberti: a picture is what one sees through a window from a single position of the eye. The dolly zoom, which makes the point with a moving lens, was developed for Hitchcock\'s *Vertigo* (1958) by the camera operator Irmin Roberts, and is also called the Vertigo effect.',
  sources: [
    'L. B. Alberti, *On Painting* (*De pictura*, 1435) — the first written account of linear perspective.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — perspective, the centre of projection and the viewing distance.',
    'R. Kingslake, *Optics in Photography* (SPIE Press, 1992) — perspective and the choice of the lens.'
  ],
  sim: 'fz-perspective'
}

);
