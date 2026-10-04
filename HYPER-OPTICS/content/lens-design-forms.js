/* HYPER-OPTICS · content/lens-design-forms.js — Lens families.
 * The classic forms and what each was invented to solve: the landscape meniscus, Petzval, Tessar, double Gauss,
 * telephoto, retrofocus, fisheye, zoom, macro, telecentric, catadioptric, anamorphic and the moulded lenses of phones.
 * Real numbers come from the ray bench of the simulations (lf-landscape, lf-petzval, lf-classics, lf-twogroup,
 * lf-fisheye, lf-zoom, lf-macro, lf-telecentric, lf-mirror, lf-anamorphic, lf-phone).
 */
Hyper.add(

/* ================================================================ the landscape lens */
{
  id: 'landscape-lens-and-meniscus', parent: 'lens-design-forms', title: 'The landscape lens', level: 2,
  short: 'The oldest corrected photographic lens: a single meniscus with a stop standing in front of it. The distance of the stop, not the glass, flattens the field and removes coma; the form lives on in box cameras and toy cameras.',
  keywords: ['landscape lens', 'meniscus lens', 'Wollaston', 'single-element lens', 'front stop', 'box camera', 'stop position', 'Chevalier', 'achromatic landscape lens', 'simple lens', 'periscopic', 'concave to the scene'],
  prereq: ['lens-bending', 'symmetry-and-the-stop', 'field-curvature'],
  related: ['coma', 'astigmatism-of-lenses', 'achromatic-doublet', 'petzval-lens', 'lens-shapes-and-names', 'the-f-number', 'optical-plastics', 'spherical-aberration', 'distortion', 'physics:thin-lenses'],
  body: `
A single lens in front of a flat sensor leaves its designer only two things to choose: the **bend** of the lens (how strongly each surface curves) and the place of the **stop**. In 1812 William Hyde Wollaston chose a **meniscus** — a lens with one convex and one concave face, like a watch glass — turned its concave side towards the scene, and put the aperture stop *in front of it*. That arrangement, the **landscape lens**, was for decades the best a lens maker could offer, and a descendant of it is still in the box camera.

### Why a stop in front helps
With the stop against the lens, the oblique beams from the edge of a scene cross the lens off its centre and at a steep angle, and both [[coma]] and [[astigmatism-of-lenses|astigmatism]] are large. Move the stop forward and each oblique beam now crosses the lens at a different place, where the surfaces bend it differently: the sign of the coma changes, and the two astigmatic focal surfaces move together. For a given bend there is one stop distance at which the coma vanishes and the tangential and sagittal focal surfaces lie on either side of a surface that is almost flat. The stop is a design variable as powerful as the glass — the idea of [[symmetry-and-the-stop]].

### The numbers
The table is a traced meniscus of N-BK7, focal length 100 mm, f/11, bent to $q = -2.2$ (both radii negative: concave towards the scene). Blurs are RMS diameters at the best focus of each field angle; the last column is where the tangential (T) and sagittal (S) rays focus, measured from the on-axis image (negative: towards the lens).

| Stop in front of the lens | Coma sum $S_2$ (×10⁻³) | Blur at 0° | Blur at 10° | Blur at 20° | T / S focus at 20° |
|---|---|---|---|---|---|
| 3 mm (against the lens) | −12.6 | 41 µm | 155 µm | 369 µm | −12.4 / −6.8 mm |
| 10 mm | −7.7 | 41 µm | 93 µm | 168 µm | −5.2 / −4.3 mm |
| **21.5 mm (0.22 f)** | **≈ 0** | 41 µm | 44 µm | 79 µm | −1.2 / −3.0 mm |
| 30 mm | +6.4 | 41 µm | 79 µm | 139 µm | −4.5 / −4.1 mm |

The right position cuts the blur at 20° from 369 µm to 79 µm without touching the glass, while the blur on the axis never moves: for a thin lens the stop does not change spherical aberration.

### What it costs
- **Spherical aberration stays.** The 41 µm axial blur at f/11 is why the lens is slow: f/11 to f/16 is typical, and speed is bought only by stopping down.
- **Colour.** A single N-BK7 lens shifts its focus by about $f/V = 100/64 \\approx 1.6$ mm between blue and red light. In the 1820s Chevalier cemented a flint meniscus to the crown to make the lens [[achromatic-doublet|achromatic]].
- **Barrel distortion.** A positive lens with the stop in front draws the edge of the picture inwards: −2.2 % at 20° and −3.5 % at 25° for the stop position above. See [[distortion]].
- **Size.** The glass must be wider than the stop by the stop distance times $\\tan\\theta$ to pass the oblique beams; beyond about 25° [[vignetting]] sets in.

### Where it lives
A small aperture hides what remains: at f/11 the [[depth-of-focus|depth of focus]] is about ±0.5 mm on 6 × 9 cm film, so a moulded plastic meniscus with a front stop gives a usable picture in box, disposable and toy cameras that never need focusing.

> [!key] A meniscus bent towards the stop, with the stop about a fifth of a focal length in front of it, is almost free of coma and has a nearly flat field. It stays slow, because the stop cannot cure spherical aberration.
`,
  ideas: [
    'A single lens has two design freedoms: its bend and the position of its stop.',
    'Moving the stop changes which part of the lens each oblique beam uses, and so changes coma and astigmatism.',
    'A meniscus concave to the scene with the stop about 0.2 f in front is nearly free of coma, with a nearly flat field.',
    'The stop does not alter the on-axis spherical aberration of a thin lens: the lens stays slow, f/11 or smaller.',
    'A positive lens with its stop in front shows barrel distortion.'
  ],
  pitfalls: [
    'A single lens can be given a flat field by moving the stop — Its Petzval surface, of radius $n f$, cannot be changed by the stop. What the stop does is arrange the two astigmatic surfaces so that the compromise between them lies near the sensor.',
    'The stop belongs at the lens, as an iris does — In a landscape lens it stands well in front, about a fifth of the focal length away. With the stop against the glass the edge of the picture is hopeless.',
    'Coma is a fault of the glass — It depends on where each oblique beam crosses the lens, so the stop distance can remove it with the same glass.',
    'A cheap plastic meniscus must be soft everywhere — At f/11 the depth of focus is so large that its curved field and its blur stay inside what film and eye accept.'
  ],
  terms: [
    { term: 'Meniscus lens', also: ['positive meniscus', 'concavo-convex lens'], def: 'A lens with one convex and one concave surface. A positive meniscus is thicker at the centre and its convex surface is the more strongly curved.' },
    { term: 'Landscape lens', also: ['Wollaston lens', 'simple landscape lens'], def: 'A single meniscus lens with its concave side towards the scene and the aperture stop in front of it. The stop position is chosen to balance coma and astigmatism.' },
    { term: 'Front stop', also: ['stop in front', 'stop distance'], def: 'An aperture stop placed ahead of the first lens element. Its distance changes the part of the lens each oblique beam uses, and so the off-axis aberrations.' },
    { term: 'Fixed-focus camera', also: ['box camera', 'focus-free camera'], def: 'A camera with no focusing movement, whose small aperture gives enough depth of focus for everything beyond about one or two metres.' }
  ],
  formulas: [
    {
      name: 'Petzval radius of a thin lens',
      expr: 'Rp = n*f', tex: 'R_P = n\\,f',
      vars: {
        Rp: { name: 'radius of the Petzval surface', q: 'length', unit: 'mm', tex: 'R_P' },
        n: { name: 'refractive index of the glass', value: 1.517, min: 1, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Whatever the bend and the stop: the best flat-field compromise lies between the two astigmatic surfaces, not on this one.',
      stories: { Rp: 'A single lens of focal length {f} is made of glass of index {n}. How strongly does its Petzval surface curve (what is its radius)?' }
    },
    {
      name: 'Sag of the curved focal surface',
      expr: 'dz = y^2/(2*Rp)', tex: '\\Delta z = \\frac{y^2}{2 R_P}',
      vars: {
        dz: { name: 'how far the surface lies in front of a flat sensor', q: 'length', unit: 'mm', tex: '\\Delta z' },
        y: { name: 'image height', q: 'length', unit: 'mm', value: 36 },
        Rp: { name: 'radius of the Petzval surface', q: 'length', unit: 'mm', value: 152, tex: 'R_P' }
      },
      note: 'A parabola approximation of the sphere, good while $y$ is well below $R_P$.',
      stories: { dz: 'A focal surface of radius {Rp} meets a flat sensor on the axis. By how much does it depart from the sensor at an image height of {y}?' }
    },
    {
      name: 'Shape factor (bend) of a lens',
      expr: 'q = (R2 + R1)/(R2 - R1)', tex: 'q = \\frac{R_2 + R_1}{R_2 - R_1}',
      vars: {
        q: { name: 'shape factor (0 equiconvex, ±1 plano-convex, beyond ±1 a meniscus)', signed: true, tex: 'q' },
        R1: { name: 'radius of the front surface', q: 'length', unit: 'mm', value: -88, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the rear surface', q: 'length', unit: 'mm', value: -33, signed: true, tex: 'R_2' }
      },
      note: 'Radii are signed: positive when the centre of curvature lies to the right, towards the sensor.',
      stories: { q: 'A lens has a front radius of {R1} and a rear radius of {R2} (signs as in a lens prescription). What is its shape factor?' }
    }
  ],
  examples: [
    {
      title: 'Reading the bend',
      q: 'The landscape meniscus in the table has a front radius of −87.7 mm and a rear radius of −32.9 mm. Find its shape factor and say what it means.',
      steps: [
        { text: 'Both radii are negative: both centres of curvature lie to the left, on the side of the scene. Then', tex: 'q = \\frac{R_2 + R_1}{R_2 - R_1} = \\frac{-32.9 - 87.7}{-32.9 + 87.7} = \\frac{-120.6}{54.8} = -2.2' },
        'A shape factor below −1 means a meniscus; the minus sign says that the concave surface is the front one, facing the scene. The mirror-image lens, convex to the scene, would have $q = +2.2$.'
      ],
      a: '$q = -2.2$: a positive meniscus concave towards the scene, as Wollaston had it.'
    },
    {
      title: 'How much the field curves',
      q: 'The same lens ($n = 1.517$, $f = 100$ mm) covers ±20°. How far would its Petzval surface depart from a flat sensor at the edge, and how does that compare with the depth of focus at f/11 for a blur of 0.05 mm?',
      steps: [
        { text: 'The Petzval radius is', tex: 'R_P = n f = 1.517 \\times 100\\ \\mathrm{mm} = 152\\ \\mathrm{mm}' },
        { text: 'The image height at 20° is $y = f\\tan 20° = 36.4$ mm, so', tex: '\\Delta z = \\frac{y^2}{2 R_P} = \\frac{36.4^2}{2 \\times 152} = 4.4\\ \\mathrm{mm}' },
        'The depth of focus is about $\\pm N c = \\pm 11 \\times 0.05 = \\pm 0.55$ mm: the bare Petzval surface would be eight times too deep. The traced lens, with the stop in the right place, has its T and S foci at −1.2 and −3.0 mm — better, but still beyond the depth of focus, which is why the edge blur is 79 µm.'
      ],
      a: 'The sag is 4.4 mm against a tolerance of ±0.55 mm: the stop brings the field into the neighbourhood of the film, but not onto it.'
    }
  ],
  quiz: [
    { q: 'Why is the stop of a landscape lens placed in front of the meniscus rather than against it?', choices: ['It changes which part of the lens an oblique beam crosses, so coma and astigmatism can be balanced', 'It removes the spherical aberration on the axis', 'It makes the glass cheaper', 'It increases the focal length'], a: 0, why: 'The stop position decides where each oblique beam meets the lens surfaces, and the off-axis aberrations depend on that. On-axis aberrations do not: the on-axis beam fills the lens whatever the stop distance.' },
    { q: 'Moving the stop of a thin lens forward changes its spherical aberration on the axis.', a: false, why: 'The axial beam is limited by the stop and crosses the lens symmetrically wherever the stop is. In the simulation the on-axis blur stays at 41 µm for every stop distance.' },
    { q: 'A positive lens has its stop in front. Straight lines at the edge of the picture are drawn…', choices: ['bowed outwards: barrel distortion', 'bowed inwards: pincushion distortion', 'perfectly straight', 'in different colours only'], a: 0, why: 'A positive lens with the stop in front gives barrel distortion; with the stop behind it, pincushion. The traced landscape lens loses 2.2 % of its image height at 20°.' },
    { q: 'What is the Petzval radius, in millimetres, of a single lens of index 1.52 and focal length 50 mm?', answer: 76, unit: 'mm', why: '$R_P = n f = 1.52 \\times 50 = 76$ mm. The sign is such that the surface curves towards the lens.' },
    { q: 'A plastic box-camera lens with a front stop and a curved field still gives a usable picture mainly because…', choices: ['its small aperture gives a large depth of focus', 'its field is perfectly flat', 'plastic has no dispersion', 'the film is curved to match'], a: 0, why: 'At f/11 or smaller the cone of light is so narrow that a focus error of half a millimetre blurs a point by only about 0.05 mm: the curvature fits inside the depth of focus.' }
  ],
  applications: [
    'Box cameras, disposable cameras and toy cameras: one moulded meniscus with a stop in front, f/11 or smaller, never focused.',
    'The first daguerreotype cameras of 1839, whose lens was an achromatic landscape lens of about f/14.',
    'Simple fixed-focus cameras in cheap devices, where cost and size outweigh sharpness at the corners.',
    'Teaching: the clearest demonstration of what the position of the stop does to coma and astigmatism.'
  ],
  history: 'William Hyde Wollaston described the meniscus with a front stop in 1812, for the camera obscura used by draughtsmen. Within about two decades the Parisian optician Charles Chevalier had cemented a flint to the crown to make an achromatic meniscus; this achromatic landscape lens, working at about f/14 to f/16, served the earliest daguerreotype cameras. In the 1860s two such menisci, set back to back around a central stop, became the periscopic and rapid rectilinear lenses.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the early meniscus and landscape lenses.',
    'E. Hecht, *Optics*, ch. 6 (section on aberrations) — coma, astigmatism and the effect of the stop.',
    'W. J. Smith, *Modern Optical Engineering* — stop shift and the aberrations of a thin lens.'
  ],
  sim: 'lf-landscape'
},

/* ================================================================ the Petzval lens */
{
  id: 'petzval-lens', parent: 'lens-design-forms', title: 'The Petzval lens', level: 2,
  short: 'One of the first lenses designed by calculation (Joseph Petzval, 1840): two achromatic doublets with the stop between them. At f/3.6 it was some fifteen times faster than the landscape lens. It is sharp on the axis and falls off quickly, because its field is strongly curved.',
  keywords: ['Petzval', 'portrait lens', 'Petzval objective', 'swirly bokeh', 'field curvature', 'projection lens', '1840', 'Voigtländer', 'fast lens', 'Petzval sum', 'cat\'s eye', 'astrograph'],
  prereq: ['achromatic-doublet', 'field-curvature', 'cemented-and-air-spaced-doublets'],
  related: ['landscape-lens-and-meniscus', 'field-flatteners-and-petzval-sum', 'vignetting', 'bokeh-and-out-of-focus-blur', 'double-gauss', 'tessar', 'coma', 'astigmatism-of-lenses', 'the-f-number'],
  body: `
In 1839 a daguerreotype portrait needed minutes of motionless posing, because the landscape lens of the day worked at about f/14. The Viennese mathematician Joseph Petzval set out to design a much faster lens, and in 1840 he found it by calculation: **two achromatic doublets**, spaced well apart, with the stop between them. The aperture ratio of f/3.6 gave roughly fifteen times the light, $(14/3.6)^2 \\approx 15$, and shortened exposures from minutes to seconds.

### How it is built
The front group is a cemented crown–flint doublet of positive power; the stop stands in the gap; the rear group is another positive doublet — in the original with its two glasses air-spaced to help the coma. Each group has a focal length of about 1.5 times the total. The simulation uses two catalogue-style doublets of 150 mm focal length spaced 75 mm apart: the pair has $f = 105$ mm, a back focal distance of 36 mm, and works at f/3.6. (They are generic doublets, not Petzval's prescription, but they show the character of the design.)

### Sharp in the middle, soft outside
Two good achromats correct the axial beam almost perfectly: the traced RMS blur on the axis at f/3.6 is 4.5 µm, about the size of the Airy disc (4.8 µm): essentially diffraction-limited there. Nothing, however, keeps the field flat. The [[field-flatteners-and-petzval-sum|Petzval sum]] of a system is the sum of the powers divided by their indices, and here every group is positive and nothing cancels it: the Petzval surface has a radius of about −1.0 f, against −2.6 f for a Cooke triplet and −6 f for a double Gauss.

| Field angle | Image height | Focus (T / S) from the axial image | Blur on the axial focal plane | Light at the edge |
|---|---|---|---|---|
| 0° | 0 | 0 | 4.5 µm | 100 % |
| 6° | 11.1 mm | −1.0 / −0.7 mm | 170 µm | 100 % |
| 12° | 22.5 mm | −3.5 / −2.9 mm | 576 µm | 92 % |
| 18° | 34.4 mm | −1.5 / −5.8 mm | 1040 µm | 64 % |

The depth of focus at f/3.6 is only about $2Nc = 0.22$ mm (with a blur limit $c$ of 0.03 mm), so the edge is far outside it. Focus on the edge instead and the centre blurs: a flat sensor can touch the curved focal surface at one height only.

### Swirl and cat's eyes
The long tube between the doublets cuts off oblique beams: at 18° only 64 % of the light passes. Out-of-focus highlights near the edge are clipped into lemon shapes (**cat's eyes**), and with astigmatism stretching them tangentially they seem to rotate about the centre — the **swirly bokeh** that makes the Petzval a favourite for portraits.

### The cure and the survivors
A negative lens placed close to the image plane (a field flattener) cancels the Petzval sum with little effect on the rest, and modern Petzval astrographs use one. Without it the form survives as a **portrait** lens, as the objective of cine projectors, and in revivals for its look.

> [!key] Two positive achromatic groups with the stop between them make a fast lens that is excellent on the axis. Nothing reduces the Petzval sum, so the field is strongly curved and the picture softens quickly away from the centre.
`,
  ideas: [
    'Two achromatic doublets with the stop between them give a fast lens, f/3.6 in 1840, that is excellent on the axis.',
    'Nothing in the layout reduces the Petzval sum, so the focal surface curves with a radius of about one focal length.',
    'A flat sensor sees a sharp centre and a soft, curved periphery: one can focus on the axis or on the edge, not on both.',
    'The long tube vignettes oblique beams, shaping out-of-focus highlights into cat\'s eyes and swirls.',
    'A negative field flattener near the image plane cures the curvature, as in modern Petzval astrographs.'
  ],
  pitfalls: [
    'A Petzval lens is simply a soft lens — On the axis it is almost diffraction-limited at f/3.6. The softness is off axis, caused by field curvature, which refocusing can shift but not remove.',
    'Stopping down flattens the field — The curvature of the focal surface does not change; the blur circles shrink because the depth of focus grows in proportion to the f-number.',
    'The swirl is a defect of the coating or of the glass — It is the sum of astigmatism, coma and mechanical vignetting inside a long tube, all of them geometry.',
    'The Petzval lens corrects the Petzval curvature — It is the reverse: the "Petzval sum" is the theorem that explains why the lens cannot, and it is named for the same man.'
  ],
  terms: [
    { term: 'Petzval lens', also: ['Petzval objective', 'Petzval portrait lens', 'Petzval type'], def: 'A fast lens of two separated positive achromatic groups with the stop between them. It is sharp on the axis and has a strongly curved field.' },
    { term: 'Swirly bokeh', also: ['swirl', 'twisted bokeh'], def: 'Out-of-focus background that appears to turn about the centre of the picture, because oblique blur discs are stretched tangentially by astigmatism and clipped by vignetting.' },
    { term: 'Cat\'s-eye vignetting', also: ['cat\'s-eye bokeh', 'mechanical vignetting'], def: 'Lemon-shaped highlights towards the corners of a picture: the beam from an off-axis point is cut by the edges of the lens tube, so its blur disc is no longer round.' }
  ],
  formulas: [
    {
      name: 'Petzval radius of two thin lenses',
      expr: 'Rp = 1/(1/(n1*f1) + 1/(n2*f2))', tex: 'R_P = \\frac{1}{\\dfrac{1}{n_1 f_1} + \\dfrac{1}{n_2 f_2}}',
      vars: {
        Rp: { name: 'radius of the Petzval surface (its size; it curves towards the lens)', q: 'length', unit: 'mm', tex: 'R_P' },
        n1: { name: 'index of the first lens', value: 1.52, min: 1, max: 4, tex: 'n_1' },
        f1: { name: 'focal length of the first lens', q: 'length', unit: 'mm', value: 150, signed: true, tex: 'f_1' },
        n2: { name: 'index of the second lens', value: 1.52, min: 1, max: 4, tex: 'n_2' },
        f2: { name: 'focal length of the second lens', q: 'length', unit: 'mm', value: 150, signed: true, tex: 'f_2' }
      },
      note: 'Positive lenses add to the sum, negative ones subtract: a negative element is how the Petzval sum is cancelled.',
      stories: { Rp: 'Two thin lenses of focal lengths {f1} and {f2} and indices {n1} and {n2} are used in one system. How large is the radius of the Petzval surface?' }
    },
    {
      name: 'How much faster is one lens than another',
      expr: 'S = (N2/N1)^2', tex: 'S = \\left(\\frac{N_2}{N_1}\\right)^2',
      vars: {
        S: { name: 'ratio of the light gathered (speed ratio)' },
        N1: { name: 'f-number of the faster lens', value: 3.6, min: 0.5, max: 64, tex: 'N_1' },
        N2: { name: 'f-number of the slower lens', value: 14, min: 0.5, max: 64, tex: 'N_2' }
      },
      note: 'Light on the image goes as $1/N^2$; each full stop is a factor of 2.',
      stories: { S: 'A portrait lens works at f/{N1} and a landscape lens at f/{N2}. How many times more light does the first put on the plate?' }
    }
  ],
  examples: [
    {
      title: 'Exposure in the studio',
      q: 'A daguerreotype portrait needed 60 seconds with a landscape lens at f/14. How long with a Petzval lens at f/3.6?',
      steps: [
        { text: 'The speed ratio is', tex: 'S = \\left(\\frac{14}{3.6}\\right)^2 = 15.1' },
        'The exposure time falls by the same factor: $60 / 15.1 = 4.0$ s.'
      ],
      a: 'About 4 seconds: a sitter could now hold still for the whole exposure.'
    },
    {
      title: 'Where the edge focuses',
      q: 'The two-doublet model has $f = 105.7$ mm and a Petzval radius of 102 mm. Estimate the focus shift at 12° and compare it with the traced values and with the depth of focus at f/3.6.',
      steps: [
        { text: 'The image height at 12° is $y = f\\tan 12° = 22.5$ mm, and the sag of the Petzval surface is', tex: '\\Delta z = \\frac{y^2}{2 R_P} = \\frac{22.5^2}{2 \\times 102} = 2.5\\ \\mathrm{mm}' },
        'The traced tangential and sagittal foci are at −3.5 and −2.9 mm: the quick estimate gets the size right, and astigmatism adds the difference.',
        'The depth of focus is about $2Nc = 2 \\times 3.6 \\times 0.03 = 0.22$ mm, so the field point is more than ten depths of focus away from a plane that focuses the axis.'
      ],
      a: 'About 2.5 mm by the estimate (traced: 2.9 to 3.5 mm), against a tolerance of 0.22 mm: the 12° blur is about 580 µm unless the sensor is moved.'
    }
  ],
  quiz: [
    { q: 'What gives the Petzval lens its strongly curved field?', choices: ['Both groups are positive, so nothing cancels the Petzval sum', 'Its f-number is too small', 'The doublets are cemented', 'Its stop is between the groups, which curves the sensor'], a: 0, why: 'The Petzval sum is $\\sum 1/(n_i f_i)$. With only positive groups every term adds, and the radius of the Petzval surface is of the order of one focal length. The cemented doublets and the stop position are not the cause.' },
    { q: 'Stopping a Petzval lens down from f/3.6 to f/8 makes its focal surface flatter.', a: false, why: 'The curvature is a property of the glass and spacing. Stopping down narrows the cone of light, so the same focus error blurs less (the traced edge blur at 12° falls from 580 to 315 µm), but the surface stays curved.' },
    { q: 'Two thin lenses of index 1.5 and focal length 150 mm each are used together. What is the radius of their Petzval surface, in millimetres?', answer: 112.5, unit: 'mm', why: '$R_P = 1/(1/225 + 1/225) = 112.5$ mm.' },
    { q: 'You focus a Petzval portrait lens on the eyes at the centre of the picture. Compared with a flat-field lens, the corners will be…', choices: ['much softer, because the focal surface leaves the flat sensor', 'sharper, because of the swirl', 'identical', 'brighter'], a: 0, why: 'The focal surface curves towards the lens; a flat sensor focused for the axis is behind it at the edge. Light also falls at the edge through vignetting.' },
    { q: 'Out-of-focus highlights near the corner of a Petzval picture look like lemons. The cause is…', choices: ['the oblique beam being cut by the barrel (mechanical vignetting)', 'chromatic aberration', 'diffraction at the stop', 'a damaged coating'], a: 0, why: 'The front and rear rims clip the oblique beam asymmetrically, so its blur disc is lens-shaped (a "cat\'s eye"). Astigmatism then stretches it tangentially, giving the swirl.' }
  ],
  applications: [
    'Portrait lenses with a characteristic swirl, revived by boutique makers for their rendering.',
    'Cine projector objectives, where the Petzval form served for decades.',
    'Wide-field astrographs, with a field flattener near the focal plane.',
    'The portrait studio of the 1840s to 1860s, which depended on its speed.'
  ],
  history: 'Joseph Petzval (1807–1891), professor of mathematics at Vienna, designed the lens in 1840; Voigtländer in Vienna built it from 1841. Petzval had not patented it and fell out with the firm over the rights. The field-curvature theorem that bears his name came out of the same work on the theory of lenses.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the Petzval portrait lens and its descendants.',
    'E. Hecht, *Optics*, ch. 6 (section on aberrations) — curvature of field and the Petzval surface.',
    'W. J. Smith, *Modern Optical Engineering* — the Petzval sum and field flatteners.'
  ],
  sim: 'lf-petzval'
},

/* ================================================================ the Tessar */
{
  id: 'tessar', parent: 'lens-design-forms', title: 'The Tessar', level: 2,
  short: 'Paul Rudolph\'s four-element lens of 1902: a Cooke triplet whose rear element is replaced by a cemented pair. Three groups and only six air–glass surfaces give a sharp, flat field of 50° to 60° and low flare — the compact-camera lens of the twentieth century.',
  keywords: ['Tessar', 'Rudolph', 'Zeiss', 'Cooke triplet derivative', 'cemented rear doublet', 'four-element lens', 'anastigmat', 'compact camera lens', 'enlarging lens', 'three groups', 'triplet'],
  prereq: ['cooke-triplet', 'cemented-and-air-spaced-doublets', 'astigmatism-of-lenses'],
  related: ['double-gauss', 'petzval-lens', 'landscape-lens-and-meniscus', 'ghosts-flare-and-stray-light', 'how-lens-design-works', 'camera-families', 'antireflection-coatings'],
  body: `
Take the [[cooke-triplet|Cooke triplet]] — a positive lens, a negative lens, the stop, and a positive lens — and replace the last element by a **cemented pair** of a negative and a positive element. That is the **Tessar**, patented in 1902 by Paul Rudolph at Zeiss. The name is generally taken from the Greek for "four", for its four elements. It has three groups, and its sharp field and simplicity made it the lens of folding cameras, rangefinders, compacts and enlargers for most of a century.

### The layout
Front: a positive crown element. Next: a negative flint element, then the stop. Behind it: a negative flint cemented to a positive crown. The cemented surface is the new freedom. It adds a radius and a choice of glass pair for the designer to play with, which corrects the higher-order spherical aberration and the oblique aberrations that limited the triplet, and it costs *no* extra air–glass surface. As better glasses arrived the maximum aperture moved from f/6.3 to f/4.5, f/3.5 and f/2.8.

| Lens | Elements | Groups | Air–glass surfaces | Cemented surfaces | Petzval radius (traced) |
|---|---|---|---|---|---|
| Cooke triplet | 3 | 3 | 6 | 0 | −2.6 f (traced, f/5) |
| Tessar | 4 | 3 | 6 | 1 | not traced here |
| Double Gauss | 6 | 4 | 8 | 2 | −6.4 f (traced, f/3) |

### What the surfaces buy
Every uncoated air–glass surface reflects about 4 % of the light, and part of that comes back as a ghost or as a veil of flare ([[ghosts-flare-and-stray-light]]). Six surfaces pass $0.96^6 = 78$ % of the light; the eight of a double Gauss pass only 72 %. In the decades before [[antireflection-coatings|anti-reflection coatings]] that difference decided which lens was used, and the Tessar's contrast was its reputation.

### Strengths and limits
- **Field:** a flat, sharp field of about 55°, enough for a 40 mm lens on a 24 × 36 mm frame ($2\\arctan(21.6/40) = 57°$).
- **Speed:** limited to about f/2.8. Beyond that three groups cannot hold the higher-order spherical aberration and the oblique spherical aberration of the wide-open aperture, and the corners soften.
- **Size and cost:** short and light, with few parts — a thin "pancake" shape is natural.

### The family
The Tessar sits between the triplet and the double Gauss: more freedom than the first, fewer surfaces than the second. In the simulation the triplet is traced exactly (RMS blur 9 µm on the axis, 33 µm at 20°, at f/5); the Tessar form is drawn beside it as a schematic, since it needs a prescription of its own.

> [!key] The Tessar is a triplet whose rear element has become a cemented pair. The cemented surface gives the designer an extra degree of freedom without adding an air–glass surface, so the lens is a stop faster than a triplet, with the low flare of six surfaces.
`,
  ideas: [
    'The Tessar is a Cooke triplet whose rear element is replaced by a cemented pair: four elements in three groups.',
    'The cemented surface gives the designer an extra radius and glass pair at no cost in air–glass surfaces.',
    'Six air–glass surfaces transmit 78 % of the light uncoated, against 72 % for the eight of a double Gauss, and give less flare.',
    'It covers a flat, sharp field of about 55° and is practical to about f/2.8.',
    'Short, light and inexpensive, it served most folding, rangefinder and compact cameras and many enlargers.'
  ],
  pitfalls: [
    'A Tessar is just a triplet — It has one more element and a cemented surface, which lets it run a stop or two faster with a better corrected field. The two are related, not equal.',
    'More elements always make a better lens — The four-element Tessar matches many five- and six-element designs of its aperture, and every extra air–glass surface costs light and adds ghosts.',
    'Cementing is done only to save space — It also removes an air–glass interface from the light path and fixes the relative position of the two elements, which helps tolerances.',
    'The name means "made by Zeiss" — It is generally taken from the Greek *tessares*, four, for the four elements.'
  ],
  terms: [
    { term: 'Tessar', also: ['Tessar type', 'four-element three-group lens'], def: 'A lens of four elements in three groups: a positive crown, a negative flint, the stop, and a negative flint cemented to a positive crown. It is derived from the Cooke triplet.' },
    { term: 'Anastigmat', also: ['anastigmatic lens'], def: 'A lens corrected for astigmatism and field curvature, as well as for spherical aberration and coma, so that the image is sharp over a flat field. The word dates from the 1890s.' },
    { term: 'Element and group', also: ['lens element', 'lens group'], def: 'An element is a single piece of glass. A group is one or more elements, cemented or close together, that the designer treats as a unit: the Tessar has four elements in three groups.' }
  ],
  formulas: [
    {
      name: 'Light passed by uncoated surfaces',
      expr: 'T = (1 - R)^k', tex: 'T = (1 - R)^k',
      vars: {
        T: { name: 'transmittance through the surfaces', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%', value: 4, min: 0, max: 50 },
        k: { name: 'number of air–glass surfaces', value: 6, int: true, min: 1, max: 40 }
      },
      note: 'About 4 % per uncoated glass surface; a single quarter-wave coating brings it to about 1.3 %. Absorption in the glass comes on top.',
      stories: { T: 'A lens has {k} air–glass surfaces, each reflecting {R} of the light. What fraction of the light gets through?' }
    },
    {
      name: 'Diagonal field of view',
      expr: 'FOV = 2*atan(d/(2*f))', tex: '\\mathrm{FOV} = 2\\arctan\\frac{d}{2 f}',
      vars: {
        FOV: { name: 'angle of view across the diagonal', q: 'angle', unit: '°', tex: '\\mathrm{FOV}' },
        d: { name: 'diagonal of the image', q: 'length', unit: 'mm', value: 43.27 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 40 }
      },
      note: 'For a lens that draws straight lines straight (rectilinear). 43.27 mm is the diagonal of a 24 × 36 mm frame.',
      stories: { FOV: 'A lens of focal length {f} covers an image of diagonal {d}. What is its angle of view?' }
    }
  ],
  examples: [
    {
      title: 'The price of surfaces before coatings',
      q: 'Compare the light passed by an uncoated Tessar (six air–glass surfaces) and an uncoated double Gauss (eight), each surface reflecting 4 %. Repeat with a single-layer coating that brings each surface to 1.3 %.',
      steps: [
        { text: 'Uncoated:', tex: 'T_{\\mathrm{Tessar}} = 0.96^6 = 0.78 \\qquad T_{\\mathrm{Gauss}} = 0.96^8 = 0.72' },
        { text: 'Coated:', tex: 'T_{\\mathrm{Tessar}} = 0.987^6 = 0.92 \\qquad T_{\\mathrm{Gauss}} = 0.987^8 = 0.90' },
        'The six per cent gap shrinks to two, and the flare falls even more, because each ghost involves two reflections and goes as $R^2$.'
      ],
      a: 'Uncoated: 78 % against 72 %. With a simple coating: 92 % against 90 %, which is why double Gauss lenses took over fast normal lenses once coatings were standard.'
    },
    {
      title: 'What a 40 mm lens covers',
      q: 'How wide is the diagonal angle of view of a 40 mm rectilinear lens on a 24 × 36 mm frame?',
      steps: [
        { text: 'The half-diagonal is 21.6 mm, so', tex: '\\mathrm{FOV} = 2\\arctan\\frac{21.6}{40} = 2 \\times 28.4° = 56.8°' },
        'That is within the 55° to 60° that a Tessar covers well.'
      ],
      a: 'About 57°, comfortably inside the sharp field of a Tessar.'
    }
  ],
  quiz: [
    { q: 'Which element of the Cooke triplet is replaced by a cemented pair in the Tessar?', choices: ['The rear positive element, behind the stop', 'The front positive element', 'The negative middle element', 'The stop'], a: 0, why: 'The Tessar keeps the front crown and the negative flint ahead of the stop and puts a negative–positive cemented pair behind it.' },
    { q: 'Six uncoated air–glass surfaces each reflect 4 % of the light. What percentage of the light is transmitted (ignoring absorption)?', answer: 78.3, unit: '%', why: '$0.96^6 = 0.783$.' },
    { q: 'The cemented surface of a Tessar counts as one more air–glass surface for flare and ghosts.', a: false, why: 'It is glass against glass, with a small index step. The Tessar has six air–glass surfaces, the same as a triplet.' },
    { q: 'Why did the double Gauss overtake the Tessar for fast normal lenses only once anti-reflection coatings were common?', choices: ['Its eight air–glass surfaces cost too much light and contrast uncoated', 'Coatings changed its focal length', 'Coatings removed its field curvature', 'It was not invented earlier'], a: 0, why: 'Uncoated, the double Gauss passes 72 % of the light and produces many ghosts. A coating cuts each surface\'s loss to about a quarter, which removes the Tessar\'s advantage.' },
    { q: 'What mainly limits the aperture of a Tessar to about f/2.8?', choices: ['Higher-order spherical aberration and oblique aberrations that three groups cannot correct', 'The Petzval sum', 'Diffraction', 'Its cemented surface'], a: 0, why: 'The surfaces of a four-element design have too few degrees of freedom to hold the higher-order aberrations of a wide aperture, so the corners soften when it is opened further.' }
  ],
  applications: [
    'Folding, rangefinder and compact cameras, film and digital, for most of the twentieth century.',
    'Enlarging lenses, where four elements at f/4 to f/5.6 give a flat sharp field.',
    'Twin-lens reflex cameras and cine and slide-projector lenses.',
    'A teaching model of how one cemented surface adds freedom without adding flare.'
  ],
  history: 'Paul Rudolph (1858–1935) at Carl Zeiss in Jena had already designed the Protar (1890) and the Planar (1896) when he patented the Tessar in 1902. It grew out of the triplet that H. Dennis Taylor had designed at Cooke in 1893. The first Tessars were f/6.3; later versions reached f/4.5, f/3.5 and f/2.8 as new glasses became available.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the triplet, the Tessar and their relatives.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — the triplet and its derivatives.',
    'W. J. Smith, *Modern Lens Design* (McGraw-Hill) — classical lens forms.'
  ],
  sim: { id: 'lf-classics', params: { lens: 'tessar' } }
},

/* ================================================================ the double Gauss */
{
  id: 'double-gauss', parent: 'lens-design-forms', title: 'The double Gauss', level: 2,
  short: 'The nearly symmetrical six-element lens of the fast "standard" 50 mm: two cemented meniscus pairs curved round the stop. Symmetry cancels coma, distortion and lateral colour, strongly curved surfaces flatten the field, and its weak points are high-order aberrations at full aperture and eight air–glass surfaces.',
  keywords: ['double Gauss', 'Gauss lens', 'Planar', 'Biotar', 'normal lens', 'standard lens', '50 mm lens', 'symmetrical lens', 'fast lens', 'Clark', 'Rudolph', 'six-element lens', 'f/1.4'],
  prereq: ['symmetry-and-the-stop', 'cemented-and-air-spaced-doublets', 'astigmatism-of-lenses'],
  related: ['tessar', 'cooke-triplet', 'petzval-lens', 'the-f-number', 'ghosts-flare-and-stray-light', 'vignetting', 'relative-illumination-and-shading', 'bokeh-and-out-of-focus-blur', 'retrofocus-wide-angle', 'field-of-view-and-focal-length', 'the-interchangeable-lens-camera'],
  body: `
Fifty-millimetre "standard" lenses of f/1.4 and f/1.8, most fast cine lenses and a long list of other fast primes share one layout: the **double Gauss**. Its ancestor is the telescope objective that Carl Friedrich Gauss described in 1817, a thin positive meniscus followed by a thin negative one. Set two such objectives back to back around a central stop and the result is a lens almost symmetrical about the stop — the principle of [[symmetry-and-the-stop]].

### The layout
There are four groups and six elements: a positive meniscus facing the scene; a cemented pair that is as a whole a thick negative meniscus curved *round the stop*; the stop; the mirror-image cemented pair; and one positive element behind. The traced prescription in the simulation (focal length 100 mm, f/3) has eight air–glass surfaces and two cemented ones; it is 76 mm long, with a back focal distance of 57.5 mm.

### Why it works
Two ideas work at once.
1. **Symmetry about the stop** cancels the odd aberrations — [[coma]], [[distortion]] and [[lateral-chromatic-aberration|lateral colour]] — to a large extent. Exact cancellation needs a magnification of −1; for distant objects the designer breaks the symmetry a little on purpose.
2. **Strongly curved surfaces facing the stop**, with high-index barium crowns for the positive elements and lower-index flints for the negative ones, keep the Petzval sum small. The traced Petzval radius is −6.4 f, against −2.6 f for the triplet and −1.0 f for the Petzval lens: a nearly flat field.

### The numbers
The traced lens, with a field of ±14°, at the best focus of each field (RMS blur diameters):

| f-number | Axial blur | Blur at 14° | Airy disc |
|---|---|---|---|
| f/3 | 15.2 µm | 19.4 µm | 4.0 µm |
| f/4 | 9.5 µm | 6.1 µm | 5.4 µm |
| f/5.6 | 4.1 µm | 3.6 µm | 7.5 µm |
| f/8 | 1.5 µm | 2.2 µm | 10.7 µm |

The blur falls steeply with the aperture — by a factor of nearly four from f/3 to f/5.6 — and from about f/5.6 the lens is limited by diffraction (the Airy disc exceeds the geometric blur). At f/3 the edge of the field is the weakest part. The tangential and sagittal foci at 14° differ by only 0.03 mm.

### Weak points
- **High-order aberrations at full aperture.** The surfaces are so strongly curved that the third-order balance holds only to a point; wide open, the edge of the field shows the glow of oblique spherical aberration. Faster versions (f/1.2) add elements, ED glass and aspheric surfaces.
- **Vignetting.** A fast Gauss is a deep barrel with large glass at each end, and wide open its oblique beams are clipped by the rims; the corners darken and highlights there turn into cat's eyes. The generous f/3 textbook design traced here escapes it; a real f/1.4 lens does not, and stopping down two stops cures it.
- **Eight air–glass surfaces.** Uncoated they pass $0.96^8 = 72$ % and make many ghosts: the form became practical for fast normal lenses with [[antireflection-coatings|coatings]].
- **Back focal distance.** At 0.58 f it is too short for the mirror box of a reflex camera, which needs about 38 mm behind a 50 mm lens (0.76 f): SLR versions are stretched.

> [!key] Two cemented meniscus pairs curved round the stop cancel the odd aberrations by symmetry and flatten the field by their strong curvature. The price is high-order aberrations and vignetting at full aperture, and eight air–glass surfaces that need coatings.
`,
  ideas: [
    'The double Gauss is two Gauss telescope objectives set back to back around a stop: six elements in four groups.',
    'Symmetry about the stop cancels coma, distortion and lateral colour to a large extent.',
    'Strongly curved surfaces facing the stop, with high-index crowns, give a Petzval radius of about −6 f: a nearly flat field.',
    'Wide open, high-order aberrations and vignetting limit it; stopping down to about f/5.6 brings it to the diffraction limit.',
    'Eight air–glass surfaces make coatings essential, and the short back focus must be stretched for SLR cameras.'
  ],
  pitfalls: [
    'The double Gauss has a flat field because it is symmetrical — Symmetry cancels only the odd aberrations (coma, distortion, lateral colour). The flat field comes from the strong curvature of the inner surfaces and the choice of glasses.',
    'A symmetrical lens is perfectly corrected — The symmetry is exact only when the object is at magnification −1. For distant objects it is approximate, and the designer re-balances the rest.',
    'A fast 50 mm lens is sharpest wide open — The traced lens halves its blur with each stop or two of closing, and the diffraction limit is reached near f/5.6; the sharpest aperture is usually two or three stops below the maximum.',
    'All six elements are cemented together — The two cemented pairs are doublets; the front and rear elements stand free, and the stop sits in an air gap between the pairs.'
  ],
  terms: [
    { term: 'Double Gauss', also: ['Gauss-type lens', 'Planar type', 'Biotar type'], def: 'A nearly symmetrical lens of about six elements in four groups, with two thick negative menisci curved round the central stop. The classic fast normal lens.' },
    { term: 'Normal lens', also: ['standard lens', 'fifty'], def: 'A lens whose focal length is about the diagonal of the image: 43 mm for a 24 × 36 mm frame, in practice 50 mm. It covers about 47° across the diagonal.' },
    { term: 'Air–glass surface', also: ['air-to-glass surface', 'glass–air surface'], def: 'A surface where light passes between air and glass. Each one reflects about 4 % uncoated, so the count sets the light lost and the number of ghosts.' }
  ],
  formulas: [
    {
      name: 'Natural light fall-off towards the corners',
      expr: 'E = cos(theta)^4', tex: 'E = \\cos^4\\theta',
      vars: {
        E: { name: 'illuminance relative to the centre', q: 'ratio', unit: '%' },
        theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 23.4, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'For a lens that draws straight lines straight, before any mechanical vignetting. 23.4° is the corner of a 24 × 36 mm frame behind a 50 mm lens.',
      stories: { E: 'What fraction of the central illuminance reaches a point {theta} from the axis?' }
    },
    {
      name: 'Diameter of the entrance pupil',
      expr: 'D = f/N', tex: 'D = \\frac{f}{N}',
      vars: {
        D: { name: 'entrance-pupil diameter', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        N: { name: 'f-number', value: 1.4, min: 0.5, max: 64 }
      },
      stories: { D: 'A {f} lens is set to f/{N}. How wide is its entrance pupil?' }
    }
  ],
  examples: [
    {
      title: 'The corner of a normal lens',
      q: 'A 50 mm lens covers a 24 × 36 mm frame. How much darker is the corner than the centre from the cos⁴ law alone?',
      steps: [
        { text: 'The half-diagonal is 21.6 mm, so the corner is at', tex: '\\theta = \\arctan\\frac{21.6}{50} = 23.4°' },
        { text: 'and', tex: 'E = \\cos^4 23.4° = 0.918^4 = 0.71' },
        'That is a loss of 0.5 stop, and the double Gauss adds its own mechanical vignetting on top at full aperture.'
      ],
      a: '71 % of the centre, half a stop darker, before mechanical vignetting.'
    },
    {
      title: 'How big is the front of a fast 50?',
      q: 'What is the entrance-pupil diameter of a 50 mm lens at f/1.4, and how does it compare with f/2.8?',
      steps: [
        { text: 'At f/1.4:', tex: 'D = \\frac{50}{1.4} = 35.7\\ \\mathrm{mm}' },
        'At f/2.8 it is 17.9 mm: half the diameter, a quarter of the area, so two stops of light.'
      ],
      a: '35.7 mm at f/1.4: four times the area, and four times the light, of the pupil at f/2.8.'
    }
  ],
  quiz: [
    { q: 'Which aberrations does the symmetry of a double Gauss about its stop mainly cancel?', choices: ['Coma, distortion and lateral colour', 'Spherical aberration and field curvature', 'Axial colour and astigmatism', 'Only vignetting'], a: 0, why: 'Symmetry cancels the aberrations that are odd in the field and the pupil — coma, distortion and lateral colour. The even ones need to be corrected by the shapes of the surfaces and the glass.' },
    { q: 'A double Gauss has a flatter field than a Cooke triplet mainly because of its symmetry.', a: false, why: 'The flat field comes from its strongly curved inner surfaces and its high-index crowns, which keep the Petzval sum small. The traced Petzval radius is −6.4 f against −2.6 f for the triplet.' },
    { q: 'By the cos⁴ law, what percentage of the central illuminance reaches a point 23.4° from the axis?', answer: 71, unit: '%', why: '$\\cos^4 23.4° = 0.710$. The double Gauss at full aperture loses more, through mechanical vignetting.' },
    { q: 'Eight uncoated air–glass surfaces, each reflecting 4 %, transmit about…', choices: ['72 % of the light', '92 % of the light', '50 % of the light', '96 % of the light'], a: 0, why: '$0.96^8 = 0.72$. Single-layer coatings bring it to about 90 %, modern multilayer coatings to 98 % and more.' },
    { q: 'In the traced double Gauss, stopping down from f/3 to f/5.6 mostly…', choices: ['shrinks the geometric blur (15 µm to 4 µm on the axis) by nearly four times', 'flattens the Petzval surface', 'removes the central stop', 'changes the focal length'], a: 0, why: 'High-order aberrations fall steeply with the aperture. The Petzval radius, set by the glass and the curvatures, does not change.' }
  ],
  applications: [
    'Fast standard lenses of 50 mm, f/1.4 to f/1.8, on SLR, rangefinder and mirrorless cameras.',
    'Fast cine and video primes, where aperture and a flat field matter more than size.',
    'Macro and copy lenses of moderate magnification, which reuse the flat field.',
    'Projection and enlarging lenses of f/2 to f/2.8, in a Gauss form.'
  ],
  history: 'Gauss\'s achromatic objective dates from 1817. Alvan Clark in the United States patented a lens made of two of them back to back in 1888, but it could not be corrected well with the glasses then available. Paul Rudolph\'s Planar of 1896 at Zeiss used cemented pairs and new barium crown glasses, and Willy Merté\'s Biotar of 1927 reached f/1.4 for cine cameras. Anti-reflection coatings from the late 1930s made eight air–glass surfaces acceptable, and after the Second World War the form became the standard fast lens.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — from Gauss\'s objective to the Planar and the fast Gauss lenses.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — symmetry, the Gauss form and its aberrations.',
    'W. J. Smith, *Modern Optical Engineering* — symmetrical systems and the stop.'
  ],
  sim: { id: 'lf-classics', params: { lens: 'double-gauss' } }
},

/* ================================================================ the telephoto lens */
{
  id: 'telephoto-lens', parent: 'lens-design-forms', title: 'The telephoto lens', level: 2,
  short: 'A positive front group followed by a negative rear group gives a focal length longer than the lens is long: the telephoto ratio L/F is less than 1. Dallmeyer and Miethe patented it in 1891, and every long camera lens since is built this way.',
  keywords: ['telephoto', 'telephoto ratio', 'teleconverter', 'Barlow lens', 'long lens', 'Dallmeyer', 'Miethe', 'negative rear group', 'compact telephoto', 'extender', 'principal plane', 'long focal length'],
  prereq: ['combining-thin-lenses', 'thick-lenses-and-principal-planes', 'field-of-view-and-focal-length'],
  related: ['retrofocus-wide-angle', 'zoom-lens-principles', 'perspective-and-focal-length', 'catadioptric-lenses', 'apochromats-and-ed-glass', 'the-f-number', 'reflecting-telescopes', 'optical-zoom', 'physics:thin-lenses'],
  body: `
To see a distant subject large you need a long focal length, and a simple lens of 400 mm focal length stands 400 mm in front of the sensor. The **telephoto lens** cheats. A positive objective is followed, some distance behind, by a **negative group**. The negative group spreads the converging beam a little, so that the cone of rays reaches the image plane as if it came from a much longer lens: the whole behaves as a lens of focal length $F$ whose rear principal plane lies *in front of* the glass, while the glass itself is only $L < F$ long.

### The two-group model
Two thin lenses of focal lengths $f_1 > 0$ and $f_2 < 0$, a distance $d$ apart, have

$$F = \\frac{f_1 f_2}{f_1 + f_2 - d} \\qquad b = F\\left(1 - \\frac{d}{f_1}\\right) \\qquad L = d + b$$

where $b$ is the back focal distance. With $f_1 = 120$ mm, $f_2 = -100$ mm and $d = 80$ mm: $F = 200$ mm and $b = 66.7$ mm, so the front group stands only 146.7 mm from the sensor. The **telephoto ratio** $L/F$ is 0.73: the lens is 27 % shorter than a simple lens of the same focal length, and its rear principal plane lies 53 mm *ahead* of the front group.

| $f_1$ | $f_2$ | $d$ | $F$ | $b$ | $L$ | $L/F$ |
|---|---|---|---|---|---|---|
| 120 mm | −100 mm | 80 mm | 200 mm | 66.7 mm | 146.7 mm | 0.73 |
| 150 mm | −120 mm | 100 mm | 257 mm | 85.7 mm | 185.7 mm | 0.72 |
| 100 mm | −80 mm | 50 mm | 267 mm | 133 mm | 183 mm | 0.69 |
| 100 mm | −60 mm | 60 mm | 300 mm | 120 mm | 180 mm | 0.60 |

A stronger negative group or closer groups lengthen $F$ and shorten $L$ until the back focus disappears. Real lenses stop at ratios of about 0.6 to 0.8.

### What a real telephoto has to do
- **The front group carries the aperture.** A 400 mm f/2.8 has an entrance pupil 143 mm across, and the front group must be achromatic to a high standard, because colour error grows with focal length. That is the job of low-dispersion glass: see [[apochromats-and-ed-glass]].
- **The rear group is small and light**, which suits it for focusing: moving one small group inside the lens focuses without changing its length.
- **The price** is a short back focal distance, sensitivity to decentring of the strong negative group, and a slight pincushion distortion.

### The teleconverter and the mirror
A negative group added behind *any* lens is a **teleconverter**: it multiplies the focal length by $m$ and the f-number by $m$, so a 1.4× converter costs one stop and a 2× converter two. The same idea, with a convex secondary mirror as the negative group, makes the Cassegrain telescope and the mirror lens ([[catadioptric-lenses]]).

> [!key] A negative group behind a positive one pushes the rear principal plane in front of the lens, so the focal length exceeds the length. The telephoto ratio of 0.6 to 0.8 buys a shorter lens at the cost of a short back focus and a harder colour correction.
`,
  ideas: [
    'A telephoto lens has a positive front group and a negative rear group; its rear principal plane lies in front of the lens.',
    'Its length is less than its focal length: the telephoto ratio L/F is below 1, typically 0.6 to 0.8.',
    'A stronger negative group or a smaller spacing lengthens F and shortens L until the back focal distance vanishes.',
    'The front group carries the aperture and the colour correction; low-dispersion glass is needed because colour error grows with focal length.',
    'A teleconverter is a negative group added behind any lens: focal length and f-number are both multiplied by m.'
  ],
  pitfalls: [
    'A telephoto lens is long because its focal length is long — The point of the layout is that it is *shorter* than its focal length, which a simple lens of the same F could not be.',
    'Telephoto lenses compress perspective — Perspective depends only on where you stand. A long lens lets you stand far back for the same framing, and it is the distance that compresses the scene.',
    'Any long lens is a telephoto — Optically "telephoto" means the construction (L/F below 1). In everyday speech it names any focal length above about 85 mm, even for a simple lens.',
    'A 2× teleconverter doubles the picture size for free — It also doubles the f-number (two stops lost) and magnifies the aberrations of the lens it is fitted behind.'
  ],
  terms: [
    { term: 'Telephoto lens', also: ['tele lens', 'long lens'], def: 'A lens whose focal length is greater than its physical length from the front element to the image plane, thanks to a positive front group and a negative rear group.' },
    { term: 'Telephoto ratio', also: ['telephoto effect', 'L/F'], def: 'The length of the lens from the front element to the image plane divided by its focal length. A telephoto design has a ratio below 1, typically 0.6 to 0.8.' },
    { term: 'Teleconverter', also: ['extender', 'tele-extender', 'Barlow lens'], def: 'A negative lens group placed behind a lens, or in a telescope\'s focusing tube, that multiplies the focal length by a factor m and the f-number by the same factor.' }
  ],
  formulas: [
    {
      name: 'Focal length of two thin lenses',
      expr: 'F = f1*f2/(f1 + f2 - d)', tex: 'F = \\frac{f_1 f_2}{f_1 + f_2 - d}',
      vars: {
        F: { name: 'focal length of the pair', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of the front lens (positive in a telephoto)', q: 'length', unit: 'mm', value: 120, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of the rear lens (negative in a telephoto)', q: 'length', unit: 'mm', value: -100, signed: true, tex: 'f_2' },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 80 }
      },
      note: 'Thin lenses in air; $d$ is measured from the front lens to the rear one.',
      stories: { F: 'A {f1} lens is followed {d} behind by a {f2} lens. What is the focal length of the pair?' }
    },
    {
      name: 'Back focal distance',
      expr: 'b = F*(1 - d/f1)', tex: 'b = F\\left(1 - \\frac{d}{f_1}\\right)',
      vars: {
        b: { name: 'distance from the rear lens to the image', q: 'length', unit: 'mm', signed: true },
        F: { name: 'focal length of the pair', q: 'length', unit: 'mm', value: 200 },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 80 },
        f1: { name: 'focal length of the front lens', q: 'length', unit: 'mm', value: 120, signed: true, tex: 'f_1' }
      },
      stories: { b: 'A two-lens system of focal length {F} has a front lens of {f1}, the second lens being {d} behind it. How far behind the second lens does the image form?' }
    },
    {
      name: 'Telephoto ratio',
      expr: 'TR = (d + b)/F', tex: '\\mathrm{TR} = \\frac{d + b}{F}',
      vars: {
        TR: { name: 'telephoto ratio, length over focal length', tex: '\\mathrm{TR}' },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 80 },
        b: { name: 'back focal distance', q: 'length', unit: 'mm', value: 66.7 },
        F: { name: 'focal length', q: 'length', unit: 'mm', value: 200 }
      },
      note: 'Below 1 the lens is shorter than its focal length.',
      stories: { TR: 'The groups of a lens are {d} apart and the image forms {b} behind the rear group; the focal length is {F}. What is the telephoto ratio?' }
    }
  ],
  examples: [
    {
      title: 'A 200 mm lens 147 mm long',
      q: 'A telephoto has a +120 mm front group and a −100 mm rear group 80 mm behind it. Find its focal length, back focal distance and telephoto ratio.',
      steps: [
        { text: 'Focal length:', tex: 'F = \\frac{120 \\times (-100)}{120 - 100 - 80} = \\frac{-12000}{-60} = 200\\ \\mathrm{mm}' },
        { text: 'Back focal distance:', tex: 'b = 200\\left(1 - \\frac{80}{120}\\right) = 66.7\\ \\mathrm{mm}' },
        'The length is $80 + 66.7 = 146.7$ mm, and $\\mathrm{TR} = 146.7/200 = 0.73$.'
      ],
      a: '$F = 200$ mm, $b = 66.7$ mm, $L = 146.7$ mm, ratio 0.73: the lens is a quarter shorter than its focal length.'
    },
    {
      title: 'A teleconverter on a long lens',
      q: 'A 300 mm f/4 lens is fitted with a 2× teleconverter. What are the new focal length and f-number, and how wide is the entrance pupil before and after?',
      steps: [
        'The focal length becomes 600 mm and the f-number $2 \\times 4 = 8$.',
        { text: 'The pupil is unchanged:', tex: 'D = \\frac{300}{4} = 75\\ \\mathrm{mm} = \\frac{600}{8}' },
        'The same light now spreads over an image of four times the area: two stops lost.'
      ],
      a: '600 mm at f/8, with the same 75 mm pupil.'
    }
  ],
  quiz: [
    { q: 'A lens has a focal length of 400 mm and is 280 mm long from its front element to the image plane. What is its telephoto ratio?', answer: 0.7, why: '$L/F = 280/400 = 0.70$.' },
    { q: 'In a telephoto layout the front group is…', choices: ['positive and the rear group negative', 'negative and the rear group positive', 'both positive', 'both negative'], a: 0, why: 'A positive objective makes the beam converge; a negative group behind it spreads it, which moves the rear principal plane forward. The reverse order is the retrofocus layout.' },
    { q: 'The rear principal plane of a telephoto lens lies ahead of its front element.', a: true, why: 'For $f_1 = 120$, $f_2 = -100$, $d = 80$ mm the focal length is 200 mm but the image is only 146.7 mm behind the front group, so the rear principal plane lies 53 mm in front of it.' },
    { q: 'A 1.4× teleconverter is fitted behind a 200 mm f/2.8 lens. What is the f-number?', answer: 3.92, why: 'Both the focal length (to 280 mm) and the f-number are multiplied by 1.4: $2.8 \\times 1.4 = 3.92$, one stop slower.' },
    { q: 'Why do long telephoto lenses use low-dispersion (ED or fluorite) glass in the front group?', choices: ['Colour error grows with focal length, and the front group carries the aperture', 'To make the rear group smaller', 'To lower the f-number', 'To remove distortion'], a: 0, why: 'The longitudinal colour of a lens grows in proportion to its focal length, so a 400 mm lens needs a much better achromatic correction than a 50 mm one.' }
  ],
  applications: [
    'Sports, wildlife and aviation photography with lenses of 135 to 800 mm, kept short enough to carry.',
    'Cine and broadcast long lenses and the long end of zoom lenses.',
    'Teleconverters and the Barlow lenses of amateur telescopes.',
    'Long-range surveillance and inspection cameras, where length matters.'
  ],
  history: 'Peter Barlow used a negative achromat to lengthen the focal length of a telescope as early as 1834. For photography, Thomas R. Dallmeyer in England and Adolf Miethe in Germany patented the telephoto lens independently in 1891; the name "telephoto" comes from Dallmeyer\'s lens. Cassegrain\'s telescope of 1672 already used the same two-element idea with mirrors.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the telephoto lens.',
    'E. Hecht, *Optics*, ch. 6 (section on thick lenses and lens combinations) — two lenses and the principal planes.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — telephoto and retrofocus constructions.'
  ],
  sim: { id: 'lf-twogroup', params: { mode: 'tele' } }
},

/* ================================================================ the retrofocus wide-angle */
{
  id: 'retrofocus-wide-angle', parent: 'lens-design-forms', title: 'The retrofocus wide-angle', level: 2,
  short: 'A wide-angle lens whose back focal distance is longer than its focal length: a negative front group spreads the beam and a positive rear group gathers it. Angénieux named it in 1950, to clear the mirror of a reflex camera; mirrorless cameras relaxed the need, but the layout remains.',
  keywords: ['retrofocus', 'inverted telephoto', 'reverse telephoto', 'wide-angle', 'back focal distance', 'SLR mirror', 'Angénieux', 'negative front group', 'distortion', 'wide-angle lens', 'flange distance', 'exit pupil'],
  prereq: ['telephoto-lens', 'lens-mounts-and-flange-distance', 'combining-thin-lenses'],
  related: ['f-mount', 'photographic-lens-mounts', 'distortion', 'relative-illumination-and-shading', 'vignetting', 'fisheye-lenses', 'field-of-view-and-focal-length', 'double-gauss', 'the-interchangeable-lens-camera', 'lens-adapters-and-back-focus'],
  body: `
A wide-angle lens needs a short focal length: the 24 mm lens that covers 84° on a full frame has, as a simple design, its rear element about 24 mm from the sensor. In a single-lens reflex camera a hinged mirror swings up between lens and sensor, and it needs about 40 mm of clear space. The mount of an F-mount camera fixes the flange 46.5 mm from the sensor ([[f-mount]]); a symmetrical wide-angle lens would have to poke its rear element into the mirror's path. The answer is to turn the telephoto round: a **negative** group in front, a **positive** group behind. The **retrofocus lens** (also "inverted" or "reverse telephoto") has a back focal distance longer than its focal length.

### The two-group model
With $f_1 = -50$ mm, $f_2 = +40$ mm and $d = 60$ mm the thin-lens formulas of the [[telephoto-lens|telephoto page]] give

$$F = \\frac{f_1 f_2}{f_1 + f_2 - d} = 28.6\\ \\mathrm{mm} \\qquad b = F\\left(1 - \\frac{d}{f_1}\\right) = 62.9\\ \\mathrm{mm}$$

a back focal distance of 2.2 times the focal length, comfortably more than the 40 mm the mirror needs. The negative group in front makes the rays diverge, the positive group brings them together again, and the rear principal plane has moved *behind* the lens. The ratio of back focus to focal length that a reflex camera demands grows as the lens gets wider:

| Focal length | Angle of view (24 × 36 mm) | Back focus needed (40 mm) | Ratio $b/F$ |
|---|---|---|---|
| 50 mm | 46.8° | 40 mm | 0.8 |
| 35 mm | 63.4° | 40 mm | 1.1 |
| 24 mm | 84.1° | 40 mm | 1.7 |
| 20 mm | 94.5° | 40 mm | 2.0 |
| 14 mm | 114.2° | 40 mm | 2.9 |

### What it costs
- **No symmetry.** A retrofocus lens is far from symmetrical about its stop, so [[distortion]] (usually barrel), coma and lateral colour are not cancelled and have to be corrected with many elements: seven to fifteen, with aspheric surfaces and floating groups.
- **A large front.** The negative meniscus in front is wide and bulging to admit the oblique beams, and the whole lens is big and heavy.
- **Light.** Natural fall-off ($\\cos^4\\theta$) and vignetting are strong at 90° or more: see [[relative-illumination-and-shading]].
- **A benefit for digital sensors.** The long back focus puts the exit pupil far from the sensor, so chief rays strike the corners more nearly square on. A symmetrical wide-angle lens with its rear element close to the sensor sends oblique rays, to which microlenses and colour filters respond badly.

### Today
Mirrorless cameras have flange distances of 16 to 20 mm ([[lens-mounts-and-flange-distance]]), so the mirror no longer forces the layout. Many wide lenses remain retrofocus all the same, for the exit-pupil benefit and because the negative front group helps to correct the field. Cine cameras with spinning mirror shutters and PL-mount flange distances of 52 mm have always needed it.

> [!key] A negative group in front of a positive one puts the rear principal plane behind the lens: the back focal distance exceeds the focal length. That is what an SLR mirror needs, and it also gives digital sensors an exit pupil far from the image.
`,
  ideas: [
    'A retrofocus lens has a negative front group and a positive rear group: the telephoto layout turned round.',
    'Its back focal distance is longer than its focal length, which clears the swinging mirror of a reflex camera.',
    'The wider the lens, the larger the ratio of back focus to focal length that a reflex camera demands: 1.7 at 24 mm, 2.9 at 14 mm.',
    'The asymmetry costs distortion and lateral colour, so the lens needs many elements, aspheres and floating groups.',
    'A far exit pupil is a bonus for digital sensors, which prefer chief rays nearly parallel to the axis.'
  ],
  pitfalls: [
    'A retrofocus lens is a kind of telephoto — It is the opposite arrangement: negative group first, positive group second, back focus longer than the focal length instead of length shorter.',
    'Mirrorless cameras made retrofocus designs obsolete — They relaxed the back-focus requirement, but the layout still helps the exit pupil and the field correction, and many wide lenses keep it.',
    'The back focal distance is the flange distance — The flange distance is measured from the flange of the mount to the sensor, the back focal distance from the last glass surface; they differ by how far the rear element protrudes into the camera.',
    'Barrel distortion of a wide lens means it is badly made — It is the usual residue of the asymmetric layout, and software or the designer corrects it; see [[lens-distortion-and-calibration]].'
  ],
  terms: [
    { term: 'Retrofocus lens', also: ['inverted telephoto', 'reverse telephoto'], def: 'A wide-angle lens with a negative front group and a positive rear group, so that its back focal distance exceeds its focal length. The name comes from the French Retrofocus, coined in 1950.' },
    { term: 'Reflex mirror', also: ['SLR mirror', 'mirror box'], def: 'The hinged mirror of a single-lens reflex camera that sends the image up to the viewfinder and swings out of the way for the exposure. It needs about 40 mm of free space between the lens and the sensor.' },
    { term: 'Wide-angle lens', also: ['wide lens'], def: 'A lens whose focal length is shorter than the diagonal of the image, so that it sees a wider field than the eye\'s comfortable 40° to 50°; for a full frame, shorter than about 35 mm.' }
  ],
  formulas: [
    {
      name: 'Back focal distance of two thin lenses',
      expr: 'b = F*(1 - d/f1)', tex: 'b = F\\left(1 - \\frac{d}{f_1}\\right)',
      vars: {
        b: { name: 'back focal distance', q: 'length', unit: 'mm', signed: true },
        F: { name: 'focal length of the pair', q: 'length', unit: 'mm', value: 28.6 },
        d: { name: 'spacing between the lenses', q: 'length', unit: 'mm', value: 60 },
        f1: { name: 'focal length of the front lens (negative in a retrofocus)', q: 'length', unit: 'mm', value: -50, signed: true, tex: 'f_1' }
      },
      note: 'With $f_1 < 0$ the bracket exceeds 1: the back focus is longer than $F$.',
      stories: { b: 'A lens of focal length {F} has a front group of {f1}, the second group {d} behind it. How far is the image behind the rear group?' }
    },
    {
      name: 'Back focus compared with focal length',
      expr: 'R = b/F', tex: 'R = \\frac{b}{F}',
      vars: {
        R: { name: 'back-focus ratio' },
        b: { name: 'back focal distance', q: 'length', unit: 'mm', value: 40 },
        F: { name: 'focal length', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'A reflex camera needs about 40 mm of back focus; a ratio above 1 means a retrofocus design.',
      stories: { R: 'A {F} lens must leave {b} behind its last element. What ratio of back focus to focal length is that?' }
    }
  ],
  examples: [
    {
      title: 'Clearing the mirror at 24 mm',
      q: 'A 24 mm retrofocus lens is modelled as a −60 mm group in front of a +36 mm group, 66 mm behind it. Check its focal length and say whether it clears a 40 mm mirror space.',
      steps: [
        { text: 'The focal length is', tex: 'F = \\frac{-60 \\times 36}{-60 + 36 - 66} = \\frac{-2160}{-90} = 24.0\\ \\mathrm{mm}' },
        { text: 'and the back focal distance', tex: 'b = 24\\left(1 + \\frac{66}{60}\\right) = 50.4\\ \\mathrm{mm}' },
        'That is more than 40 mm and equal to 2.1 times the focal length.'
      ],
      a: '$F = 24$ mm, $b = 50.4$ mm: it clears the mirror with 10 mm to spare. A simple 24 mm lens would have $b \\approx 24$ mm.'
    },
    {
      title: 'How wide can a simple lens be on a reflex camera?',
      q: 'A reflex camera needs 40 mm of back focus. For a simple (non-retrofocus) lens, whose back focus is about equal to its focal length, what is the widest angle of view on a 24 × 36 mm frame?',
      steps: [
        'A simple lens needs $F \\ge 40$ mm to leave 40 mm behind it.',
        { text: 'A 40 mm lens covers', tex: '2\\arctan\\frac{21.6}{40} = 56.8°' }
      ],
      a: 'About 57° across the diagonal. Anything wider on a reflex camera must be retrofocus.'
    }
  ],
  quiz: [
    { q: 'In a retrofocus layout the front group is…', choices: ['negative, the rear group positive', 'positive, the rear group negative', 'both positive', 'absent'], a: 0, why: 'The negative group spreads the beam, the positive group gathers it, and the focus lands farther behind the lens than the focal length.' },
    { q: 'A retrofocus lens has a back focal distance shorter than its focal length.', a: false, why: 'Longer: that is the point of the design. A telephoto is the layout whose overall length is shorter than its focal length.' },
    { q: 'A reflex camera needs 40 mm of back focus. What ratio of back focus to focal length must a 20 mm lens have?', answer: 2, why: '$40/20 = 2$.' },
    { q: 'Why do digital cameras like the long back focus of a retrofocus wide-angle lens?', choices: ['It puts the exit pupil far from the sensor, so corner rays arrive nearly square on', 'It removes the colour filter array', 'It makes the lens symmetrical', 'It lowers the f-number'], a: 0, why: 'The microlenses and filters of a pixel respond best to rays near the normal. A distant exit pupil keeps the chief ray angle at the corner small.' },
    { q: 'Which flange distance is most associated with a need for retrofocus lenses?', choices: ['The 46.5 mm of an SLR mount', 'The 16 mm of a mirrorless mount', 'The 17.526 mm of a C-mount', 'None; flange distance is irrelevant'], a: 0, why: 'A long flange distance leaves the room for the swinging mirror, and so forces wide lenses to put their glass far from the sensor. The short flanges of mirrorless cameras remove that constraint.' }
  ],
  applications: [
    'Wide-angle lenses of 14 to 35 mm for SLR cameras, of which almost every one is retrofocus.',
    'Cine lenses for cameras with spinning mirror shutters and long flange distances.',
    'Wide lenses for digital sensors, chosen for their far exit pupil and small corner ray angles.',
    'Machine-vision wide lenses that must leave room for a filter or a beam splitter behind the glass.'
  ],
  history: 'Pierre Angénieux of Saint-Héand in France designed the first retrofocus lens, a 35 mm f/2.5, in 1950, for the reflex cameras of the day, and gave the layout its name. Other makers followed within a few years with their own wide-angle designs of the same kind.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — wide-angle lenses and the retrofocus form.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — retrofocus and reverse-telephoto lenses.',
    'W. J. Smith, *Modern Optical Engineering* — two-lens systems and wide-angle objectives.'
  ],
  sim: { id: 'lf-twogroup', params: { mode: 'retro' } }
},

/* ================================================================ fisheye lenses */
{
  id: 'fisheye-lenses', parent: 'lens-design-forms', title: 'Fisheye lenses', level: 2,
  short: 'A lens that maps angle to image height by r = fθ, or a similar law, instead of r = f tan θ, so that a whole hemisphere — 180° or more — fits in the picture. The price is curved straight lines, a huge front element, and an image scale that changes from the centre to the edge.',
  keywords: ['fisheye', 'equidistant', 'equisolid', 'stereographic', 'orthographic', 'circular fisheye', 'diagonal fisheye', 'full-frame fisheye', '180°', 'mapping function', 'f-theta', 'hemisphere', 'Wood', 'all-sky camera', 'barrel distortion'],
  prereq: ['distortion', 'retrofocus-wide-angle', 'field-of-view-and-focal-length'],
  related: ['projections:fisheye-projections', 'projections:rectilinear-lens', 'projections:the-camera-model', 'lens-distortion-and-calibration', 'relative-illumination-and-shading', 'vignetting', 'perspective-and-focal-length', 'scan-lenses-and-f-theta'],
  body: `
A normal lens, of the kind called **rectilinear**, maps an angle $\\theta$ from the axis to an image height $r = f\\tan\\theta$. That keeps straight lines straight, but as $\\theta$ approaches 90° the height grows without limit: no rectilinear lens can reach 180°, and even at 60° its image is stretched four times in the radial direction. A **fisheye** gives up the straight lines. Its mapping function, such as $r = f\\theta$, stays finite at 90°, so that a whole hemisphere fits into the picture.

### The mapping functions
| Mapping | Law | Local scale at 60° (centre = 1) | Image circle for 180° |
|---|---|---|---|
| Rectilinear | $r = f\\tan\\theta$ | 4.00 | none: $r \\to \\infty$ |
| Stereographic | $r = 2f\\tan(\\theta/2)$ | 1.33 | $4f$ |
| Equidistant | $r = f\\theta$ | 1.00 | $\\pi f = 3.14 f$ |
| Equisolid angle | $r = 2f\\sin(\\theta/2)$ | 0.87 | $2\\sqrt{2} f = 2.83 f$ |
| Orthographic | $r = f\\sin\\theta$ | 0.50 | $2f$ |

The **equidistant** law spaces angles evenly, and scientific all-sky cameras use it. The **equisolid-angle** law keeps equal solid angles at equal areas on the sensor and is the usual photographic fisheye. The **stereographic** law preserves the shapes of small objects. The orthographic law crowds the rim and is rare.

### Two kinds of picture
- A **circular fisheye** puts the whole 180° circle inside the frame. An equisolid 8 mm lens on a 24 × 36 mm sensor draws a circle $2 \\times 2 \\times 8\\sin 45° = 22.6$ mm across, just fitting inside the 24 mm height.
- A **full-frame** (**diagonal**) fisheye fills the frame, with 180° along the diagonal. An equisolid lens of $f = 21.6/(2\\sin 45°) = 15.3$ mm gives 144° across the width, 92° over the height and 180° over the diagonal.

### How it is built
A fisheye is an extreme retrofocus lens ([[retrofocus-wide-angle]]): a huge negative meniscus at the front bends rays arriving at 90° towards the axis, followed by positive groups that form the image. The bulging front element, which gives the lens its look, cannot take a filter or an ordinary hood, and the entrance pupil seen at 90° is a thin sliver. The cos⁴ law of a rectilinear lens does not apply: the image of a wide field is *compressed* rather than stretched, so the light falls off far less towards the rim.

### Straightening it out
Software can remap a fisheye picture to a rectilinear view (see [[lens-distortion-and-calibration]]) but only within a field of well under 180°, and with the stretching of $f\\tan\\theta$ at the edges. Fisheye cameras for vehicles and robots are calibrated rather than corrected: they use the equidistant or a fitted polynomial model directly. The same $r = f\\theta$ law is the **f-theta** condition of scanning lenses ([[scan-lenses-and-f-theta]]).

> [!key] A fisheye maps angle to radius with a law that stays finite at 90° — $r = f\\theta$ for the equidistant, $r = 2f\\sin(\\theta/2)$ for the equisolid-angle lens. The curved lines are not a fault: they are the design.
`,
  ideas: [
    'A rectilinear lens maps r = f tan θ and cannot reach 180°; a fisheye uses a law that stays finite at 90°.',
    'The common laws are equidistant (r = fθ), equisolid angle (r = 2f sin θ/2), stereographic and orthographic.',
    'A circular fisheye fits the whole 180° circle in the frame; a diagonal fisheye fills the frame, with 180° on the diagonal.',
    'Optically it is an extreme retrofocus lens with a huge negative meniscus in front.',
    'The curved lines are the design, not a defect; calibration, rather than correction, is how cameras use it.'
  ],
  pitfalls: [
    'A fisheye lens is a normal wide-angle lens with a lot of distortion — The mapping is chosen, not accidental: a different law of angle against radius, designed in, with a hemisphere on the sensor.',
    'Every fisheye gives a circle — A circular fisheye does. A full-frame (diagonal) fisheye is longer in focal length and fills the whole frame.',
    'Defishing recovers a rectilinear 180° picture — A rectilinear picture cannot exceed 180° and stretches the edges without bound; a fisheye picture "defished" shows at most about 120° usefully, at the cost of the edges.',
    'All fisheyes use the same law — Equidistant, equisolid, stereographic and orthographic lenses differ visibly in how the edge is crowded or stretched; the law matters for measurement and calibration.'
  ],
  terms: [
    { term: 'Fisheye lens', also: ['fish-eye lens', 'hemispherical lens'], def: 'An ultra-wide lens, covering 180° or more, whose mapping function is not r = f tan θ, so that straight lines away from the centre are drawn as curves.' },
    { term: 'Mapping function', also: ['projection function', 'r(θ)'], def: 'The law that gives the distance r from the centre of the picture as a function of the angle θ of the ray from the axis, for a lens of focal length f.' },
    { term: 'Equidistant projection', also: ['f-theta mapping', 'equiangular'], def: 'The mapping r = f θ: equal angles are drawn at equal distances. Used by scientific all-sky cameras and scanning lenses.' },
    { term: 'Equisolid-angle projection', also: ['equal-area projection'], def: 'The mapping r = 2f sin(θ/2): equal solid angles fill equal areas of the sensor. The commonest photographic fisheye law.' },
    { term: 'Circular and diagonal fisheye', also: ['circular fisheye', 'full-frame fisheye'], def: 'A circular fisheye draws the whole field as a circle inside the frame; a diagonal (full-frame) fisheye is of longer focal length and fills the frame, reaching 180° along the diagonal.' }
  ],
  formulas: [
    {
      name: 'Equidistant mapping',
      expr: 'r = f*theta', tex: 'r = f\\,\\theta',
      vars: {
        r: { name: 'image height', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 10 },
        theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'The angle enters in radians. Equal angles give equal distances.',
      stories: { r: 'An equidistant fisheye of focal length {f} images a point {theta} from the axis. How far from the centre?', f: 'On an equidistant fisheye a point {theta} off the axis is imaged {r} from the centre. What is the focal length?' }
    },
    {
      name: 'Equisolid-angle mapping',
      expr: 'r = 2*f*sin(theta/2)', tex: 'r = 2 f \\sin\\frac{\\theta}{2}',
      vars: {
        r: { name: 'image height', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 15.3 },
        theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'At 90° the height is $\\sqrt{2} f$; at 180° it reaches $2 f$.',
      stories: { r: 'An equisolid fisheye of focal length {f} images a point {theta} from the axis. How far from the centre?', f: 'An equisolid fisheye images a point {theta} off the axis {r} from the centre of the picture. What is its focal length?' }
    },
    {
      name: 'Rectilinear mapping',
      expr: 'r = f*tan(theta)', tex: 'r = f\\tan\\theta',
      vars: {
        r: { name: 'image height', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 15 },
        theta: { name: 'angle of the ray from the axis', q: 'angle', unit: '°', value: 55, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'Straight lines stay straight, but $r \\to \\infty$ as $\\theta \\to 90°$.',
      stories: { r: 'A rectilinear lens of focal length {f} images a point {theta} off the axis. How far from the centre?' }
    }
  ],
  examples: [
    {
      title: 'A circular fisheye on full frame',
      q: 'What focal length gives an equisolid fisheye a 180° circle that just fits the 24 mm height of a full-frame sensor? And an equidistant one?',
      steps: [
        { text: 'The circle has radius 12 mm at $\\theta = 90°$. Equisolid:', tex: '12 = 2 f \\sin 45° \\ \\Rightarrow\\ f = \\frac{12}{1.414} = 8.5\\ \\mathrm{mm}' },
        { text: 'Equidistant:', tex: '12 = f\\,\\frac{\\pi}{2} \\ \\Rightarrow\\ f = 7.6\\ \\mathrm{mm}' }
      ],
      a: 'About 8.5 mm (equisolid) and 7.6 mm (equidistant): the familiar 8 mm circular fisheye.'
    },
    {
      title: 'A diagonal fisheye',
      q: 'An equisolid lens must reach 180° along the diagonal of a 24 × 36 mm frame. What is its focal length, and how wide is its horizontal field?',
      steps: [
        { text: 'The half-diagonal is 21.63 mm at 90°:', tex: 'f = \\frac{21.63}{2\\sin 45°} = 15.3\\ \\mathrm{mm}' },
        { text: 'The half-width of 18 mm corresponds to', tex: '\\theta = 2\\arcsin\\frac{18}{2 \\times 15.3} = 2 \\times 36.0° = 72.1°' },
        'so the field across the width is 144°, and across the height ($r = 12$ mm) 92°.'
      ],
      a: '$f \\approx 15.3$ mm, with 144° across the width, 92° over the height and 180° over the diagonal.'
    }
  ],
  quiz: [
    { q: 'Which mapping draws equal angles at equal distances from the centre?', choices: ['Equidistant, r = fθ', 'Rectilinear, r = f tan θ', 'Orthographic, r = f sin θ', 'Equisolid angle, r = 2f sin(θ/2)'], a: 0, why: 'In $r = f\\theta$ the image height is proportional to the angle. The others compress or stretch the edge relative to the centre.' },
    { q: 'A rectilinear lens can be made to cover a full 180° field.', a: false, why: '$r = f\\tan\\theta$ grows without limit as $\\theta$ approaches 90°: the image of the horizon would be infinitely far from the centre.' },
    { q: 'An equidistant fisheye of focal length 10 mm images a point 60° from the axis. How far from the centre of the picture is it, in millimetres?', answer: 10.47, unit: 'mm', why: '$r = f\\theta = 10 \\times \\pi/3 = 10.47$ mm (the angle in radians).' },
    { q: 'The straight edges of a doorway look curved in a fisheye picture. This is…', choices: ['a consequence of the mapping law, not a manufacturing fault', 'a sign of a decentred element', 'caused by the sensor', 'chromatic aberration'], a: 0, why: 'Any lens whose mapping is not $r = f\\tan\\theta$ draws straight lines away from the centre as curves. The designer chose the law to fit a whole hemisphere on the sensor.' },
    { q: 'Compared with a rectilinear wide-angle lens of the same field, light fall-off at the edge of a fisheye picture is…', choices: ['much gentler, because the wide field is compressed rather than stretched', 'much stronger', 'the same, cos⁴θ', 'zero in every case'], a: 0, why: 'The cos⁴θ law belongs to the stretched rectilinear image. The fisheye mapping compresses the periphery, and the pupil aberrations of the lens add light at oblique angles.' }
  ],
  applications: [
    'All-sky and meteor cameras, which use equidistant lenses so that an angle can be read directly off the image.',
    'Planetarium projection, and the capture of 360° panoramas and virtual-reality video from two lenses of 190° or more.',
    'Vehicle surround-view and parking cameras, robots and drones, calibrated for their fisheye model.',
    'Architectural interiors, skate and action photography, where the curved look is wanted.',
    'Door viewers and security cameras that must see a whole room from one spot.'
  ],
  history: 'The word comes from Robert W. Wood, who in 1906 described how the world looks to a fish under water, with all of the sky squeezed into a cone of 97°, and built a pinhole camera filled with water to photograph it. Robin Hill\'s "Sky Lens" of 1924 was the first real fisheye lens, made for cloud studies. Fisheye lenses reached 35 mm reflex cameras in the 1960s.',
  sources: [
    'R. W. Wood, "Fish-eye views, and vision under water", *Philosophical Magazine* 12 (1906).',
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the Hill sky lens and the fisheye.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — the mapping laws of wide-angle and fisheye lenses.'
  ],
  sim: 'lf-fisheye'
},

/* ================================================================ how a zoom lens works */
{
  id: 'zoom-lens-principles', parent: 'lens-design-forms', title: 'How a zoom lens works', level: 3,
  short: 'A zoom changes its focal length by moving lens groups while the image stays on the sensor. Two groups moving on curved paths are the minimum; the classic zoom has a fixed front group, a variator that sets the magnification, a compensator that keeps the focus, and a fixed rear lens. A cam or a motor links the motions.',
  keywords: ['zoom lens', 'variator', 'compensator', 'parfocal', 'varifocal', 'mechanical compensation', 'optical compensation', 'zoom ratio', 'cam', 'focal length range', 'two-group zoom', 'afocal zoom', 'master lens', 'variable aperture'],
  prereq: ['optical-zoom', 'varifocal-and-parfocal-lenses', 'combining-thin-lenses'],
  related: ['telephoto-lens', 'retrofocus-wide-angle', 'the-f-number', 'focusing-a-lens', 'digital-zoom', 'field-of-view-and-focal-length', 'autofocus-methods', 'the-phone-camera', 'image-stabilization', 'physics:optical-instruments'],
  body: `
A zoom lens changes its focal length continuously while the image stays on the sensor. Those are two demands — set $F$ and keep the focus — so at least two lens groups must move, and move independently. The pages on [[optical-zoom]] and [[varifocal-and-parfocal-lenses]] say what a zoom does for the photographer; this page shows how it is built.

### The minimum: two groups
Take a negative group of $f_1 = -50$ mm in front of a positive group of $f_2 = 40$ mm. For a focal length $F$ the spacing must be $d = f_1 + f_2 - f_1 f_2/F = -10 + 2000/F$, and the image then lies $b = F(1 - d/f_1)$ behind the rear group. Both numbers change with $F$:

| $F$ | Spacing $d$ | Rear group to image $b$ | Front group to image |
|---|---|---|---|
| 25 mm | 70 mm | 60 mm | 130 mm |
| 35 mm | 47 mm | 68 mm | 115 mm |
| 50 mm | 30 mm | 80 mm | 110 mm |
| 70 mm | 19 mm | 96 mm | 115 mm |
| 100 mm | 10 mm | 120 mm | 130 mm |

A 4× zoom needs *both* groups to travel, and the front group makes a U-turn. That is **mechanical compensation**: a cam barrel with two slots moves each group along its own path so the image never leaves the sensor — the lens is **parfocal**. If the rear group is fixed and only the front one moves, the focal length still changes but the image drifts: a **varifocal** lens, which must be refocused after zooming. In the simulation the drift is tens of millimetres, because a two-lens model has none of a real design's compromises.

### Variator and compensator
The classic zoom of cine and television has four groups:
1. a **fixed front group**, positive, which also focuses;
2. a **variator**, negative, which slides between the front group and its focal point and sets the magnification;
3. a **compensator**, positive, which moves on a different, curved path so that the beam leaving the zoom section stays parallel;
4. a **fixed rear (master) lens**, which forms the image.

In the traced model ($f = 100$, $-20$, $+40$ and $12$ mm) the variator moves by only 10 mm while the focal length goes from 43 to 150 mm — 3.5× — and the compensator moves along an unrelated curve:

| $F$ | Variator from front group | Compensator from front group |
|---|---|---|
| 43 mm | 94 mm | 143 mm |
| 80 mm | 87.5 mm | 161 mm |
| 150 mm | 84 mm | 204 mm |

Older, cheaper zooms use **optical compensation**: two groups are tied rigidly together and move linearly, and the focus is exact at a few focal lengths only (typically three).

### The aperture problem
For a constant f-number the entrance pupil must grow in proportion to $F$: at f/4 it is 11 mm wide at 43 mm and 38 mm wide at 150 mm. Many zooms avoid that cost by letting the f-number grow instead, as in an 18–55 mm f/3.5–5.6, whose pupil grows from 5.1 to 9.8 mm while $F$ grows threefold.

### Real zoom lenses
A modern zoom has 10 to 20 elements in three to five moving groups, with aspheric surfaces, and ratios from 2.9× (24–70 mm) to 17× (18–300 mm) for photography, and 100× and more for television. A separate small group focuses, and another may shift sideways for image stabilization ([[image-stabilization]]).

> [!key] A zoom needs two groups moving on paths that a cam or a computer links, so that the focal length changes while the image stays on the sensor. In the classic layout the variator sets the magnification and the compensator restores the focus.
`,
  ideas: [
    'A zoom must change the focal length and keep the image on the sensor: at least two groups must move independently.',
    'In a two-group zoom both groups travel on curved paths and the front group makes a U-turn; a cam or a motor links them.',
    'If only one group moves, the image drifts and the lens is varifocal: refocus is needed after zooming.',
    'In the classic zoom the variator slides and sets the magnification; the compensator restores the focus on a different path.',
    'For a constant f-number the entrance pupil must grow in proportion to the focal length; many zooms let the f-number grow instead.'
  ],
  pitfalls: [
    'Zooming is just moving one lens — One group alone changes the focal length but shifts the image; a second group must move to put it back, and its path is not a straight line.',
    'A parfocal lens and a varifocal lens differ only in price — Parfocal lenses keep the image on the sensor throughout the range; varifocal ones need refocusing and are common in cheap security cameras.',
    'A bigger zoom ratio only needs a longer barrel — The pupil, the number of groups and the aberration correction all grow with the ratio, which is why travel zooms have a slow, variable aperture.',
    'Optical zoom and digital zoom are two settings of the same thing — Optical zoom changes the focal length of the lens; digital zoom crops the picture and keeps fewer pixels (see [[digital-zoom]]).'
  ],
  terms: [
    { term: 'Zoom lens', also: ['variable focal length lens'], def: 'A lens whose focal length can be changed continuously over a range by moving lens groups, while the image stays focused on the sensor.' },
    { term: 'Variator', also: ['zoom group', 'magnifier group'], def: 'The moving group of a zoom lens that changes the magnification, and with it the focal length. It is usually a negative group between the front group and its focus.' },
    { term: 'Compensator', def: 'The moving group of a zoom lens that moves, usually on a curved path, to keep the image in focus while the variator moves.' },
    { term: 'Zoom ratio', also: ['zoom range', 'Z'], def: 'The longest focal length of a zoom lens divided by its shortest: 2.9× for a 24–70 mm lens.' },
    { term: 'Mechanical compensation', also: ['cam-driven zoom', 'zoom cam'], def: 'Keeping the image in focus through a zoom by moving the groups along paths cut in a cam barrel or driven by motors; the opposite of optical compensation, which is exact at only a few focal lengths.' },
    { term: 'Optical compensation', def: 'A zoom in which the moving groups are tied together and slide linearly; the image stays in focus exactly at a few focal lengths (typically three) and drifts slightly between them.' }
  ],
  formulas: [
    {
      name: 'Spacing of two thin groups for a given focal length',
      expr: 'd = f1 + f2 - f1*f2/F', tex: 'd = f_1 + f_2 - \\frac{f_1 f_2}{F}',
      vars: {
        d: { name: 'spacing between the groups', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of the front group', q: 'length', unit: 'mm', value: -50, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of the rear group', q: 'length', unit: 'mm', value: 40, signed: true, tex: 'f_2' },
        F: { name: 'focal length wanted', q: 'length', unit: 'mm', value: 50, min: 5, max: 1000 }
      },
      note: 'The inverse of the two-lens focal-length formula; a negative result means the groups would have to overlap.',
      stories: { d: 'A {f1} group in front of a {f2} group is to give a focal length of {F}. How far apart must they be?' }
    },
    {
      name: 'Zoom ratio',
      expr: 'Z = Ft/Fw', tex: 'Z = \\frac{F_t}{F_w}',
      vars: {
        Z: { name: 'zoom ratio' },
        Ft: { name: 'longest focal length', q: 'length', unit: 'mm', value: 70, tex: 'F_t' },
        Fw: { name: 'shortest focal length', q: 'length', unit: 'mm', value: 24, tex: 'F_w' }
      },
      stories: { Z: 'A zoom runs from {Fw} to {Ft}. What is its zoom ratio?' }
    },
    {
      name: 'f-number at the long end if the pupil stays the same',
      expr: 'Nt = Nw*Ft/Fw', tex: 'N_t = N_w\\,\\frac{F_t}{F_w}',
      vars: {
        Nt: { name: 'f-number at the long end', tex: 'N_t' },
        Nw: { name: 'f-number at the short end', value: 2.8, min: 0.5, max: 64, tex: 'N_w' },
        Ft: { name: 'longest focal length', q: 'length', unit: 'mm', value: 200, tex: 'F_t' },
        Fw: { name: 'shortest focal length', q: 'length', unit: 'mm', value: 70, tex: 'F_w' }
      },
      note: 'With a fixed entrance pupil $D = F/N$, a longer focal length means a larger f-number. A constant-aperture zoom must enlarge its pupil in proportion to $F$.',
      stories: { Nt: 'A zoom of {Fw} to {Ft} has f/{Nw} at its short end and an entrance pupil that does not grow. What f-number does it reach at the long end?' }
    }
  ],
  examples: [
    {
      title: 'Where the groups go for 50 mm',
      q: 'A two-group zoom has $f_1 = -50$ mm and $f_2 = +40$ mm. How far apart are the groups at $F = 50$ mm, and how far is the image behind the rear group?',
      steps: [
        { text: 'The spacing is', tex: 'd = -50 + 40 - \\frac{(-50)(40)}{50} = -10 + 40 = 30\\ \\mathrm{mm}' },
        { text: 'and the back focal distance', tex: 'b = 50\\left(1 - \\frac{30}{-50}\\right) = 50 \\times 1.6 = 80\\ \\mathrm{mm}' },
        'The front group is therefore 110 mm from the sensor — the nearest it ever gets, as the table shows.'
      ],
      a: '$d = 30$ mm and $b = 80$ mm; the front group is 110 mm from the sensor.'
    },
    {
      title: 'An 18–55 mm f/3.5–5.6 zoom',
      q: 'How wide is the entrance pupil of an 18–55 mm f/3.5–5.6 lens at each end, and what f-number would it have at 55 mm if the pupil stayed as wide as at 18 mm?',
      steps: [
        { text: 'At the wide end $D = 18/3.5 = 5.1$ mm; at the tele end', tex: 'D = \\frac{55}{5.6} = 9.8\\ \\mathrm{mm}' },
        { text: 'A pupil of 5.1 mm at 55 mm would be', tex: 'N = \\frac{55}{5.14} = 10.7' }
      ],
      a: '5.1 mm and 9.8 mm. A fixed pupil would give f/10.7 at 55 mm: the lens lets its pupil grow, but only 1.9× while the focal length grows 3.1×.'
    }
  ],
  quiz: [
    { q: 'What is the least number of independently moving groups needed to change the focal length of a lens and keep the image on the sensor?', answer: 2, why: 'One group fixes the focal length; the second restores the image position. A single moving group changes F but moves the image.' },
    { q: 'In a classic zoom lens the variator…', choices: ['sets the magnification, and so the focal length', 'keeps the image in focus', 'is the fixed rear lens', 'sets the aperture'], a: 0, why: 'The variator is the moving group that changes the magnification. The compensator is the group that restores the focus.' },
    { q: 'A varifocal lens stays in focus all through its zoom range.', a: false, why: 'A varifocal lens changes its focal length but the image shifts, so it must be refocused. A parfocal lens stays in focus.' },
    { q: 'What is the zoom ratio of a 70–200 mm lens?', answer: 2.86, why: '$200/70 = 2.86$.' },
    { q: 'Why does the compensator of a zoom follow a curved path rather than a straight line?', choices: ['The position that restores the focus is a non-linear function of the variator position', 'To keep the aperture constant', 'To balance the weight of the lens', 'Because the barrel is round'], a: 0, why: 'Setting the compensator from the variator involves a quadratic or a thin-lens equation, so its position is a curved function of the variator\'s. A cam cut with that curve keeps the focus at every focal length.' }
  ],
  applications: [
    'Photographic zooms of 2.9× to 17×, with a cam or a motor linking the groups.',
    'Cine and television lenses, with variator–compensator designs and ratios of 20× to over 100×.',
    'Zoom stereo microscopes, binoculars and zoom eyepieces, which use the same variator idea.',
    'Surveillance and machine-vision lenses, motorised and often varifocal.',
    'Projectors, whose zoom lens changes the size of the picture on the screen without moving the projector.'
  ],
  history: 'Designs for lenses of variable focal length were patented around 1900, but they could not be corrected well. Frank Back\'s Zoomar of 1946 to 1947 made the first practical zoom for television, and cine zooms followed in the 1950s. Zoom lenses for still cameras became common in the 1970s, once computers could design the many moving groups and multilayer coatings could tame the reflections of so many surfaces.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the development of zoom lenses.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — zoom lens fundamentals.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — zoom and varifocal lenses.'
  ],
  sim: 'lf-zoom'
},

/* ================================================================ macro lenses */
{
  id: 'macro-lenses', parent: 'lens-design-forms', title: 'Macro lenses', level: 2,
  short: 'Lenses corrected for close focusing, usually to a reproduction ratio of 1:2 or 1:1: an extension of f·m behind the infinity position, a working f-number of N(1+m), floating elements to keep the aberrations low at close range, and a flat field for copy work.',
  keywords: ['macro', 'macro lens', 'reproduction ratio', 'life size', '1:1', 'floating elements', 'close-range correction', 'internal focusing', 'working distance', 'flat field', 'extension', 'true macro', 'working f-number', 'close-up'],
  prereq: ['magnification-and-working-distance', 'close-up-and-extension-tubes', 'the-f-number'],
  related: ['depth-of-field', 'double-gauss', 'focusing-a-lens', 'the-airy-disk', 'diffraction-limited-mtf', 'telecentric-lenses', 'lateral-and-longitudinal-magnification', 'perspective-and-focal-length'],
  body: `
A **macro lens** is built to give a sharp picture when focused close, to a **reproduction ratio** $m$ of 1:2 (0.5) or 1:1 (life size on the sensor), where $m$ is the size of the image divided by the size of the object. There is no magic in the geometry — it is the thin-lens equation — but there is a great deal in how the lens is designed and used.

### The geometry
For a thin lens of focal length $f$ at ratio $m$ the object is at $s_o = f(1 + 1/m)$ and the image at $s_i = f(1 + m)$. The lens has to move out by $f\\,m$ beyond its infinity position. At 1:1 a 100 mm lens has the object 200 mm in front of it and the sensor 200 mm behind it, having moved out 100 mm.

| Ratio $m$ | Object distance | Extension | $N_w$ for f/2.8 | Depth of field at f/8 ($c = 0.03$ mm) |
|---|---|---|---|---|
| 1:10 | 1100 mm | 10 mm | f/3.1 | 53 mm |
| 1:2 | 300 mm | 50 mm | f/4.2 | 2.9 mm |
| 1:1 | 200 mm | 100 mm | f/5.6 | 0.96 mm |
| 2:1 | 150 mm | 200 mm | f/8.4 | 0.36 mm |

(100 mm lens; $N_w = N(1 + m)$ is the working f-number; the depth of field is $2Nc(m+1)/m^2$.) At 1:1 the light has dropped by $2\\log_2 2 = 2$ stops and the depth of field is a third of a millimetre at f/2.8 — a few millimetres at most with any aperture.

### What makes a macro lens special
- **Floating elements.** A lens is corrected for one object distance; its spherical aberration and field curvature worsen when the conjugates change. A macro lens has groups that move at different rates as it focuses (**close-range correction**), so the correction holds from infinity to 1:1.
- **A flat field.** Copy work and flat subjects need a flat image; macro lenses are often of the Gauss type ([[double-gauss]]) and at exactly 1:1 — magnification −1 — its symmetry cancels coma, distortion and lateral colour completely.
- **Internal focusing.** Modern lenses focus by moving inner groups, so the barrel does not grow. The effective focal length then shortens at close range ("focus breathing"), so the engraved focal length applies at infinity only.
- **Working distance.** At a given ratio the distance is $f(1 + 1/m)$: a 60 mm lens at 1:1 has 120 mm, a 180 mm lens 360 mm, which keeps insects and hot objects at a safe distance.

### Diffraction decides
At 1:1 an f/16 setting is really f/32, and the Airy disc is $2.44 \\times 0.55 \\times 32 = 43$ µm — ten pixels of a 4.3 µm sensor. The sharpest aperture is therefore much wider than for landscape work: about f/4 to f/8 on the barrel. Where the depth of field then falls short, photographers combine several pictures by focus stacking.

### What "macro" does not mean
Marketing uses "macro" for 1:4 zooms; strictly it means a reproduction ratio of at least 1:1. Extension tubes and close-up filters ([[close-up-and-extension-tubes]]) reach high ratios from ordinary lenses, without the correction.

> [!key] A macro lens must be extended by $f\\,m$; its working f-number is $N(1+m)$, its depth of field a fraction of a millimetre. Floating elements and a flat field keep it sharp from infinity to 1:1, and diffraction, not aberrations, sets the sharpest aperture.
`,
  ideas: [
    'The reproduction ratio is image size divided by object size; 1:1 is life size on the sensor.',
    'To reach ratio m the lens extends by f·m beyond its infinity position, and the object sits at f(1 + 1/m).',
    'The working f-number is N(1 + m): f/2.8 becomes f/5.6 at 1:1, two stops dimmer and with a doubled diffraction blur.',
    'Depth of field at 1:1 is a fraction of a millimetre: 2Nc(m + 1)/m².',
    'Floating elements, a flat field and internal focusing keep the lens sharp from infinity to 1:1.'
  ],
  pitfalls: [
    'A macro lens is simply a lens that focuses close — Strictly, "macro" means a reproduction ratio of at least 1:1. A lens marked macro often reaches only 1:4 or 1:2.',
    'The f-number engraved on the barrel applies at any distance — It is defined for an object at infinity; at ratio m the lens works at N(1 + m).',
    'Stopping down always sharpens a macro picture — Past about f/8 on the barrel diffraction at the working f-number outweighs the gain in depth of field.',
    'A 100 mm macro has a 100 mm focal length at 1:1 — With internal focusing the effective focal length can be much shorter at close range, and the working distance with it.'
  ],
  terms: [
    { term: 'Macro lens', also: ['macro objective', 'micro lens'], def: 'A lens designed to give a sharp, flat image at close range, strictly down to a reproduction ratio of 1:1 or more.' },
    { term: 'Reproduction ratio', also: ['magnification ratio', '1:1', 'life size'], def: 'The size of the image on the sensor divided by the size of the object. A ratio of 1:2 is half life size; 1:1 is life size; 2:1 is twice life size.' },
    { term: 'Floating element', also: ['close-range correction', 'CRC'], def: 'A lens group that moves relative to the others during focusing, so that the aberration correction stays good at close range.' },
    { term: 'Internal focusing', also: ['IF'], def: 'Focusing by moving groups inside the lens instead of moving the whole optical unit, so the barrel does not change length. The effective focal length changes with the focus distance.' },
    { term: 'Flat field', also: ['field flatness'], def: 'A property of a lens whose focal surface is flat, so that a flat subject (a document, a coin, a circuit board) is sharp at the edge as well as at the centre.' }
  ],
  formulas: [
    {
      name: 'Object distance',
      expr: 'so = f*(1 + 1/m)', tex: 's_o = f\\left(1 + \\frac{1}{m}\\right)',
      vars: {
        so: { name: 'distance from the object to the lens', q: 'length', unit: 'mm', tex: 's_o' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'reproduction ratio (image size ÷ object size)', value: 1, min: 0.01, max: 20 }
      },
      note: 'A thin lens; for a thick lens the distance is measured from the front principal plane.',
      stories: { so: 'A {f} lens is focused to a reproduction ratio of {m}. How far is the object from the lens?' }
    },
    {
      name: 'Extension beyond infinity focus',
      expr: 'x = f*m', tex: 'x = f\\,m',
      vars: {
        x: { name: 'how far the lens moves out from the sensor', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        m: { name: 'reproduction ratio', value: 1, min: 0.01, max: 20 }
      },
      stories: { x: 'A {f} lens is to reach a reproduction ratio of {m}. By how much must it be moved away from the sensor?' }
    },
    {
      name: 'Depth of field in close-up work',
      expr: 'DOF = 2*N*c*(m + 1)/m^2', tex: '\\mathrm{DOF} = \\frac{2 N c\\,(m + 1)}{m^2}',
      vars: {
        DOF: { name: 'total depth of field', q: 'length', unit: 'mm', tex: '\\mathrm{DOF}' },
        N: { name: 'f-number on the lens', value: 8, min: 0.5, max: 64 },
        c: { name: 'circle of confusion', q: 'length', unit: 'mm', value: 0.03 },
        m: { name: 'reproduction ratio', value: 1, min: 0.01, max: 20 }
      },
      note: 'Valid for $m$ not too small; at 1:1 it reduces to $4Nc$.',
      stories: { DOF: 'A lens at f/{N} is used at a reproduction ratio of {m} with a circle of confusion of {c}. How deep is the zone of sharpness?' }
    },
    {
      name: 'Airy disc at the working f-number',
      expr: 'dA = 2.44*lambda*N*(1 + m)', tex: 'd_A = 2.44\\,\\lambda\\,N\\,(1 + m)',
      vars: {
        dA: { name: 'diameter of the Airy disc on the sensor', q: 'length', unit: 'µm', tex: 'd_A' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number on the lens', value: 16, min: 0.5, max: 64 },
        m: { name: 'reproduction ratio', value: 1, min: 0, max: 20 }
      },
      note: 'For a lens whose entrance and exit pupils are equal in size.',
      stories: { dA: 'A lens at f/{N} is used at a reproduction ratio of {m} in light of {lambda}. How wide is the Airy disc on the sensor?' }
    }
  ],
  examples: [
    {
      title: 'A 100 mm macro at 1:1',
      q: 'A 100 mm f/2.8 macro lens photographs a coin life size ($m = 1$). Find the object distance, the extension, the working f-number and the depth of field at f/2.8 and f/16 ($c = 0.03$ mm).',
      steps: [
        'Object distance $s_o = 100 \\times 2 = 200$ mm; extension $x = 100 \\times 1 = 100$ mm.',
        'Working f-number $N_w = 2.8 \\times 2 = 5.6$: two stops lost.',
        { text: 'Depth of field', tex: '\\mathrm{DOF} = 2 \\times 2.8 \\times 0.03 \\times \\frac{2}{1} = 0.34\\ \\mathrm{mm} \\qquad (16:\\ 1.92\\ \\mathrm{mm})' }
      ],
      a: '200 mm, 100 mm, f/5.6; 0.34 mm of depth at f/2.8 and 1.9 mm at f/16.'
    },
    {
      title: 'Diffraction against the pixels',
      q: 'At 1:1 with a 4.3 µm pixel, which aperture on the barrel puts an Airy disc of two pixels on the sensor (550 nm)?',
      steps: [
        { text: 'Two pixels are 8.6 µm. Set $2.44\\lambda N_w = 8.6$ µm:', tex: 'N_w = \\frac{8.6}{2.44 \\times 0.55} = 6.4' },
        'At 1:1, $N_w = 2N$, so the barrel setting is $N = 3.2$.'
      ],
      a: 'About f/3.2 on the barrel. Stopped down further, diffraction blurs more than the sensor can resolve, and at f/16 the Airy disc covers ten pixels.'
    }
  ],
  quiz: [
    { q: 'A lens set to f/4 is focused at life size (1:1). What is its working f-number?', answer: 8, why: '$N_w = N(1 + m) = 4 \\times 2 = 8$.' },
    { q: 'How far must a 60 mm lens move away from the sensor, from its infinity position, to reach 1:1? (millimetres)', answer: 60, unit: 'mm', why: '$x = f\\,m = 60 \\times 1 = 60$ mm.' },
    { q: 'At the same reproduction ratio, depth of field is greater at f/16 than at f/2.8.', a: true, why: 'Depth of field grows in proportion to the f-number. The price is diffraction, which at 1:1 and f/16 (working f/32) blurs the picture to 43 µm.' },
    { q: 'By how many stops does the light fall when a lens goes from infinity to 1:1 focus?', answer: 2, why: '$N_w = N(1+m) = 2N$, a factor 2 in f-number, which is two stops.' },
    { q: 'What do the floating elements of a macro lens do?', choices: ['Move at different rates during focusing, to keep the aberration correction at close range', 'Change the aperture', 'Change the sensor size', 'Replace the iris'], a: 0, why: 'A lens corrected for infinity degrades at 1:1 because the conjugates change. Moving groups relative to each other restores the correction over the whole range.' }
  ],
  applications: [
    'Photography of insects, flowers, coins and jewellery at ratios of 1:2 to 1:1.',
    'Copy work, document scanning and film digitising, which need the flat field.',
    'Inspection of electronics and printed-circuit boards, at modest ratios and fixed working distance.',
    'Product photography and forensic work, where a ruler in the picture fixes the scale.'
  ],
  history: 'Close-up photography began with bellows cameras and microscope objectives in the nineteenth century. Purpose-built macro lenses with a helical focus travel long enough to reach 1:2 or 1:1 became common for 35 mm cameras from the 1950s; floating elements and internal focusing, which keep the correction and a constant barrel length, came with computer-aided design in the 1980s and later.',
  sources: [
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — close-up optics, extension and the effective f-number.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — close-focusing lenses and floating elements.',
    'W. J. Smith, *Modern Optical Engineering* — finite conjugates and the working f-number.'
  ],
  sim: 'lf-macro'
},

/* ================================================================ telecentric lenses */
{
  id: 'telecentric-lenses', parent: 'lens-design-forms', title: 'Telecentric lenses', level: 3,
  short: 'A lens with its stop at the focal point of the front group, so that the chief rays run parallel to the axis: the image size does not change when the object moves, and perspective vanishes. The front element must be larger than the object. Used for measurement.',
  keywords: ['telecentric lens', 'object-space telecentric', 'bi-telecentric', 'image-space telecentric', 'telecentric stop', 'entocentric', 'perspective error', 'measurement lens', 'machine vision', 'telecentric range', 'telecentricity error', 'parallel chief rays', 'profile projector'],
  prereq: ['telecentricity', 'aperture-stop', 'chief-and-marginal-rays'],
  related: ['telecentric-imaging', 'choosing-a-machine-vision-lens', 'depth-of-field', 'entrance-and-exit-pupils', 'machine-vision-lighting', 'microlenses-bsi-and-stacked-sensors', 'distortion', 'mobile-phone-lenses'],
  body: `
In an ordinary camera lens an object that moves closer looks larger: perspective. The chief ray from the edge of the object, the ray through the middle of the stop, makes an angle with the axis, and the farther the object is, the smaller that angle and the smaller the image. For a measuring system that is a defect. A **telecentric lens** is designed so that, in object space, the chief rays are parallel to the axis: the entrance pupil is at infinity, and the size of the image no longer depends on the distance of the object.

### How it is built
Put the stop at the **rear focal point** of the front group. A ray that passes the centre of the stop and then the group must, by the rules of a thin lens, have arrived parallel to the axis — that is the chief ray. This is **object-space telecentricity**. Place the stop at the *front* focal point of a rear group and the chief rays also leave parallel to the axis: **image-space telecentricity**, which makes the image insensitive to a focusing error of the sensor, and which suits sensor microlenses. With both, the lens is **bi-telecentric**: two groups that share a focal point, the stop there, and a fixed magnification $m = f_2/f_1$.

### The numbers
The simulation uses $f = 100$ mm, a 40 mm object imaged at $m = 0.5$ onto a fixed sensor, and the object moved 20 mm towards the lens:

| Lens | Image height at the right distance | After moving 20 mm closer | Change |
|---|---|---|---|
| Ordinary (stop at the lens) | 10.00 mm | 10.71 mm | +7.1 % |
| Telecentric (stop at the rear focal point) | 10.00 mm | 10.00 mm | 0 % |

Both images are blurred by the shift (about 0.4 mm), but the telecentric blur is centred on the same height, so an edge measurement does not move.

### What it gives, and what it costs
- **No perspective.** The sides of a bore or of a step are not seen: a hole looks like a clean circle, and two parts at different heights keep their relative sizes.
- **Very low distortion**, often below 0.1 %, and uniform brightness over the field.
- **A front element larger than the object.** The chief rays from the edge of the object run parallel to the axis, so the front lens must cover the object *plus* the beam: 58 mm for the 40 mm object in the simulation. Telecentric lenses for 100 mm fields are large, heavy and expensive.
- **A fixed magnification** and a limited depth of field, set by the numerical aperture.
- **Matching illumination.** A telecentric lens accepts only light travelling parallel to the axis in object space, so for backlighting it is paired with a collimated, telecentric illuminator ([[machine-vision-lighting]]).

### Telecentricity error
No real lens is perfect. The residual tilt $\\delta$ of the chief ray (typically 0.1° to 0.3°) moves the apparent edge of an object by $\\Delta y = \\Delta z\\tan\\delta$ for a displacement $\\Delta z$ along the axis. See [[telecentricity]] for the principle and [[telecentric-imaging]] for its use in measurement.

> [!key] The stop at the rear focal point of the front group makes the chief rays parallel to the axis in object space, so the image size is independent of object distance. The front element must be larger than the object, and the magnification is fixed.
`,
  ideas: [
    'In a telecentric lens the stop sits at the focal point of the front group, so the chief rays are parallel to the axis in object space.',
    'The image size does not change with object distance, and perspective vanishes: bores and steps lose their walls.',
    'The front element must cover the whole object plus the beam, so telecentric lenses are large and heavy.',
    'Bi-telecentric lenses have parallel chief rays on both sides, and a fixed magnification m = f₂/f₁.',
    'The residual chief-ray tilt (the telecentricity error, 0.1° to 0.3°) gives a size error of Δz tan δ.'
  ],
  pitfalls: [
    'A telecentric lens has no depth-of-field limit — The size of the image does not change, but the image still goes out of focus: the blur grows as the object moves, symmetrically about the same centre.',
    'A telecentric lens works with any lighting — It sees only light travelling parallel to the axis, so backlighting needs a telecentric illuminator, and diffuse light is largely lost.',
    'Telecentric means a long lens — It describes where the stop is, not the focal length. A telecentric lens can be short, but its front element is always larger than the object.',
    'A telecentric lens can zoom — Its magnification is fixed by the focal lengths of its groups; "telecentric zoom" lenses exist but are far more complex.'
  ],
  terms: [
    { term: 'Telecentric lens', also: ['telecentric objective', 'object-space telecentric lens'], def: 'A lens whose entrance pupil is at infinity, so that the chief rays are parallel to the axis in object space and the image size is independent of object distance.' },
    { term: 'Entocentric lens', also: ['ordinary lens', 'perspective lens'], def: 'A lens with a finite entrance pupil, for which the chief rays converge on the pupil. Nearer objects look larger, as in the eye and in every ordinary camera lens.' },
    { term: 'Bi-telecentric lens', also: ['double-telecentric lens', 'bilateral telecentric lens'], def: 'A lens that is telecentric in both object and image space: two groups that share a focal point, the stop at that point, and a fixed magnification f₂/f₁.' },
    { term: 'Telecentricity error', also: ['telecentric angle', 'chief-ray tilt'], def: 'The angle by which the chief ray departs from being parallel to the axis, typically 0.1° to 0.3° in a good measuring lens. It causes a size error Δz tan δ for a displacement Δz.' }
  ],
  formulas: [
    {
      name: 'Size error from chief-ray tilt',
      expr: 'dy = dz*tan(delta)', tex: '\\Delta y = \\Delta z\\,\\tan\\delta',
      vars: {
        dy: { name: 'shift of the apparent edge of the object', q: 'length', unit: 'µm', tex: '\\Delta y' },
        dz: { name: 'displacement of the object along the axis', q: 'length', unit: 'mm', value: 5, tex: '\\Delta z' },
        delta: { name: 'tilt of the chief ray from the axis', q: 'angle', unit: '°', value: 0.1, min: 0, max: 45, tex: '\\delta' }
      },
      note: 'In an ordinary lens $\\delta$ is the angle of the chief ray to the edge of the object, several degrees; in a telecentric lens it is the residual.',
      stories: { dy: 'The chief ray at the edge of an object is tilted {delta} from the axis, and the object may be {dz} out of its nominal position. How far does the edge appear to move?' }
    },
    {
      name: 'Magnification of a bi-telecentric lens',
      expr: 'm = f2/f1', tex: 'm = \\frac{f_2}{f_1}',
      vars: {
        m: { name: 'magnification (image size ÷ object size)' },
        f2: { name: 'focal length of the rear group', q: 'length', unit: 'mm', value: 50, tex: 'f_2' },
        f1: { name: 'focal length of the front group', q: 'length', unit: 'mm', value: 100, tex: 'f_1' }
      },
      note: 'The two groups share a focal point, with the stop there; the image is inverted.',
      stories: { m: 'A bi-telecentric lens has a front group of {f1} and a rear group of {f2}. What is its magnification?' }
    },
    {
      name: 'Front-lens diameter',
      expr: 'Df = H + Dp', tex: 'D_f \\approx H + D_p',
      vars: {
        Df: { name: 'diameter of the front lens needed', q: 'length', unit: 'mm', tex: 'D_f' },
        H: { name: 'size of the object field', q: 'length', unit: 'mm', value: 40 },
        Dp: { name: 'width of the beam at the front lens', q: 'length', unit: 'mm', value: 12, tex: 'D_p' }
      },
      note: 'The chief rays from the edge of the field are parallel to the axis, so the lens must be as wide as the field plus the width of the beam.',
      stories: { Df: 'A telecentric lens views a field {H} wide with a beam {Dp} across at the front lens. How wide must the front lens be?' }
    }
  ],
  examples: [
    {
      title: 'A 5 mm depth with a 0.1° lens',
      q: 'A part may sit anywhere within 5 mm of the nominal distance. How large can the size error be with a telecentric lens of 0.1° error, and with an ordinary lens whose chief ray to the edge of the field makes 3.8°?',
      steps: [
        { text: 'Telecentric:', tex: '\\Delta y = 5\\ \\mathrm{mm} \\times \\tan 0.1° = 8.7\\ \\mu\\mathrm{m}' },
        { text: 'Ordinary:', tex: '\\Delta y = 5\\ \\mathrm{mm} \\times \\tan 3.8° = 0.33\\ \\mathrm{mm}' }
      ],
      a: '8.7 µm against 330 µm: the telecentric lens is about 38 times less sensitive to the position of the part.'
    },
    {
      title: 'The magnification of a bi-telecentric lens',
      q: 'A bi-telecentric lens has a 100 mm front group and a 50 mm rear group. What size of field does it image onto a 12 mm sensor?',
      steps: [
        { text: 'The magnification is', tex: 'm = \\frac{f_2}{f_1} = \\frac{50}{100} = 0.5' },
        'A 12 mm sensor therefore covers $12/0.5 = 24$ mm of the object, at any distance within the range.'
      ],
      a: 'A 24 mm field at $m = 0.5$ (the image is inverted).'
    }
  ],
  quiz: [
    { q: 'Where is the stop of an object-space telecentric lens?', choices: ['At the rear focal point of the front group', 'At the front lens', 'At the sensor', 'At infinity in front of the lens'], a: 0, why: 'A ray through the centre of a stop at the focal point leaves the group parallel to the axis; in the forward direction that means the chief ray is parallel to the axis in object space.' },
    { q: 'A telecentric lens must have a front element larger than the object it views.', a: true, why: 'The chief rays from the edge of the object are parallel to the axis, so they strike the lens at the same distance from the axis as the object edge; the lens must cover the object plus the beam.' },
    { q: 'A chief-ray tilt of 0.2° and an object displacement of 3 mm give a size error of how many micrometres?', answer: 10.5, unit: 'µm', why: '$3\\ \\mathrm{mm} \\times \\tan 0.2° = 0.0105$ mm = 10.5 µm.' },
    { q: 'A deep bore is viewed along its axis through a telecentric lens. What is seen?', choices: ['A clean circle with no visible walls', 'A tunnel with converging walls', 'Nothing, the bore is too deep', 'An elliptical shape'], a: 0, why: 'The chief rays are parallel to the axis, so the wall, parallel to the axis, is seen edge-on and has no width. An ordinary lens looks into the bore and sees the converging walls.' },
    { q: 'Why is a telecentric backlight used with a telecentric lens?', choices: ['The lens accepts only light that travels parallel to the axis in object space', 'It reduces distortion', 'It changes the magnification', 'It makes the lens zoom'], a: 0, why: 'Light from a diffuse backlight leaves at all angles and most of it does not enter the narrow telecentric acceptance; a collimated illuminator matches the lens.' }
  ],
  applications: [
    'Machine-vision measurement of shafts, pins, threads and stamped parts, whatever their height.',
    'Profile projectors and optical comparators in metrology.',
    'Inspection of bores, holes and electronic components in assembly lines.',
    'Image-space telecentric lenses for sensors whose microlenses accept only rays near the normal.'
  ],
  history: 'A stop at the focus has long been used in measuring microscopes and projectors, because it makes the readings independent of focusing error. The word telecentric comes from the Greek for "far" and "centre", the centre of the pupil being at infinity. Telecentric lenses became standard for machine-vision measurement with the spread of digital cameras in industry.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — telecentric stops and pupils.',
    'E. Hecht, *Optics*, ch. 5–6 (stops and pupils) — the entrance pupil and the chief ray.',
    'A. Hornberg (ed.), *Handbook of Machine and Computer Vision*, Wiley-VCH — telecentric lenses in vision.'
  ],
  sim: 'lf-telecentric'
},

/* ================================================================ catadioptric lenses */
{
  id: 'catadioptric-lenses', parent: 'lens-design-forms', title: 'Mirror (catadioptric) lenses', level: 2,
  short: 'Lenses that fold the light path with mirrors and correct it with a glass plate or a meniscus: a compact, colour-free long lens, as in the Cassegrain, Schmidt–Cassegrain and Maksutov designs. The central obstruction costs contrast and turns out-of-focus highlights into rings.',
  keywords: ['catadioptric', 'mirror lens', 'reflex lens', 'Cassegrain', 'Schmidt', 'Maksutov', 'Schmidt–Cassegrain', 'central obstruction', 'doughnut bokeh', 'ring bokeh', 'corrector plate', '500 mm f/8', 'folded optics', 'secondary mirror', 'obstruction ratio'],
  prereq: ['reflecting-telescopes', 'parabolic-and-elliptical-mirrors', 'telephoto-lens'],
  related: ['spherical-mirror-aberration', 'curved-mirrors', 'bokeh-and-out-of-focus-blur', 'diffraction-limited-mtf', 'the-airy-disk', 'mirrors-as-components', 'refracting-telescopes', 'metal-mirror-coatings'],
  body: `
"Catadioptric" joins *catoptric* (by mirrors) and *dioptric* (by refraction): a lens that uses both. A mirror has no chromatic aberration, weighs little for its aperture and can fold the light path, so a catadioptric gives a long focal length in a short, light tube. A 500 mm f/8 mirror lens is about 9 cm long; a refracting 500 mm lens of the same aperture is a third of a metre or more.

### The Cassegrain layout
The simulation traces a Cassegrain mirror lens of 500 mm focal length and 62.5 mm aperture (f/8). A paraboloid **primary** of 125 mm focal length collects the light; a convex hyperboloid **secondary**, 94 mm in front of it, magnifies four times and sends the beam back through a hole in the primary to a focus 30 mm behind it. The telephoto idea — a negative element lengthening the focal length — is [[telephoto-lens|the same]], done with a mirror: the distance from the secondary to the image is 124 mm, a telephoto ratio of 0.25.

### The correctors
A paraboloid and a hyperboloid give a perfect point on the axis but have coma off axis, so a pure Cassegrain covers only a small field. Photographic mirror lenses and compact telescopes put a transparent **corrector** in front:
- the **Schmidt** plate (Bernhard Schmidt, 1930): a thin aspheric plate that cancels the spherical aberration of a spherical primary — in the Schmidt–Cassegrain the secondary hangs on the plate;
- the **Maksutov** meniscus (Dmitri Maksutov, 1941, found independently by Albert Bouwers): a thick, all-spherical meniscus, easier to make; the secondary is often just a silvered spot on its back surface. Most 500 mm photographic mirror lenses are of this kind.

### The central obstruction
The secondary mirror stands in the beam. With a diameter 0.42 times the aperture it blocks $0.42^2 = 18$ % of the area, a loss of 0.28 stop; with 90 % reflective mirrors the lens is about T9.8 instead of f/8. The more important effect is on contrast. Light diverted into the rings of the diffraction pattern lowers the MTF at coarse and middle spatial frequencies — at a quarter of the cut-off it falls from 0.69 to 0.47 — while the finest detail is unchanged. Pictures look lower in contrast and hazy.

### The doughnut
A point of light out of focus is the shape of the aperture: with the middle missing, a ring. For a defocus of 1 mm at f/8 the ring is $1/8 = 0.125$ mm across, with a hole 0.05 mm wide. Highlights in the background of a mirror-lens picture are doughnuts, which is its signature. Off axis the ring is cut into a cat's eye by the secondary and baffle.

### Other traits
- **A fixed aperture**: the obstruction occupies the centre, so exposure is set with the shutter and neutral-density filters.
- **No chromatic aberration**, and a small size and weight.
- **Closest focus** is typically 1.5 m or more, by moving the primary mirror.

> [!key] A mirror lens folds a long focal length into a short tube without colour error. The price is the central obstruction: a loss of contrast at coarse detail, a fixed aperture and ring-shaped out-of-focus highlights.
`,
  ideas: [
    'A catadioptric uses mirrors to fold the light path and a glass corrector to cancel their aberrations.',
    'The Cassegrain layout is a telephoto with a convex secondary mirror: a 500 mm f/8 lens in about 9 cm.',
    'Schmidt plates and Maksutov menisci widen the field; the secondary is often a silvered spot on the corrector.',
    'The central obstruction takes ε² of the area (ε = 0.42: 18 %), and lowers the MTF at coarse and middle frequencies.',
    'Out-of-focus highlights become rings, and the aperture is fixed.'
  ],
  pitfalls: [
    'A mirror lens loses a large part of the light to the central hole — With an obstruction of 0.42 the area loss is 18 %, only 0.28 stop; the mirrors\' reflectivity costs about as much.',
    'The central obstruction lowers resolution — It lowers the contrast at coarse and middle detail; the cut-off frequency, and so the finest resolvable detail, is the same as for a clear aperture of that diameter.',
    'The doughnut is a defect of the lens — It is the shape of the aperture seen out of focus; a sharp, in-focus picture has no ring.',
    'Mirror lenses are free of all aberrations — They have no chromatic aberration, but spherical aberration, coma and field curvature remain and need the corrector.'
  ],
  terms: [
    { term: 'Catadioptric lens', also: ['mirror lens', 'reflex lens', 'catadioptric system'], def: 'A lens that combines mirrors (which do most of the focusing) with refracting elements (which correct the aberrations).' },
    { term: 'Central obstruction', also: ['obstruction ratio', 'central obscuration', 'ε'], def: 'The secondary mirror and its mount, which block the middle of the beam. Its size is quoted as the ratio ε of its diameter to that of the aperture; it blocks ε² of the area.' },
    { term: 'Corrector', also: ['corrector plate', 'Schmidt plate', 'Maksutov meniscus'], def: 'A transparent element at the front of a catadioptric system that cancels the aberrations of its mirrors: a thin aspheric plate (Schmidt) or a thick spherical meniscus (Maksutov).' },
    { term: 'Doughnut bokeh', also: ['ring bokeh', 'donut bokeh'], def: 'The ring shape taken by out-of-focus points of light in a mirror lens, because the central obstruction removes the middle of the aperture.' }
  ],
  formulas: [
    {
      name: 'Focal length of a Cassegrain',
      expr: 'F = m*f1', tex: 'F = m\\,f_1',
      vars: {
        F: { name: 'focal length of the system', q: 'length', unit: 'mm' },
        m: { name: 'magnification of the secondary mirror', value: 4, min: 1, max: 20 },
        f1: { name: 'focal length of the primary mirror', q: 'length', unit: 'mm', value: 125, tex: 'f_1' }
      },
      stories: { F: 'A primary mirror of focal length {f1} is combined with a secondary that magnifies {m} times. What is the focal length of the system?' }
    },
    {
      name: 'Area blocked by the obstruction',
      expr: 'L = eps^2', tex: 'L = \\varepsilon^2',
      vars: {
        L: { name: 'fraction of the aperture area blocked', q: 'ratio', unit: '%' },
        eps: { name: 'obstruction ratio (diameter of the secondary ÷ aperture)', value: 0.42, min: 0, max: 0.9, tex: '\\varepsilon' }
      },
      stories: { L: 'The secondary mirror of a telescope has {eps} of the diameter of the aperture. What fraction of the area does it block?' }
    },
    {
      name: 'Throughput of a mirror lens',
      expr: 'T = (1 - eps^2)*R1*R2', tex: 'T = (1 - \\varepsilon^2)\\,R_1 R_2',
      vars: {
        T: { name: 'fraction of the light that reaches the image', q: 'ratio', unit: '%' },
        eps: { name: 'obstruction ratio', value: 0.42, min: 0, max: 0.9, tex: '\\varepsilon' },
        R1: { name: 'reflectance of the primary', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'R_1' },
        R2: { name: 'reflectance of the secondary', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: 'R_2' }
      },
      note: 'Corrector losses are not included. The T-stop is the f-number divided by $\\sqrt{T}$.',
      stories: { T: 'A mirror lens has an obstruction ratio of {eps} and two mirrors of {R1} and {R2} reflectance. What fraction of the light gets through?' }
    }
  ],
  examples: [
    {
      title: 'A 500 mm f/8 mirror lens',
      q: 'A Cassegrain has a primary of $f_1 = 125$ mm and a secondary of magnification 4. What are its focal length and aperture at f/8, and what is its T-stop with an obstruction of 0.42 and 90 % mirrors?',
      steps: [
        'The focal length is $F = 4 \\times 125 = 500$ mm and the aperture $D = 500/8 = 62.5$ mm.',
        { text: 'The throughput is', tex: 'T = (1 - 0.42^2) \\times 0.9 \\times 0.9 = 0.824 \\times 0.81 = 0.667' },
        { text: 'and the T-stop', tex: '\\frac{8}{\\sqrt{0.667}} = 9.8' }
      ],
      a: '500 mm, 62.5 mm, T9.8: it passes two thirds of the light, about 1.2 stops less than the f/8 marking promises.'
    },
    {
      title: 'The size of a doughnut',
      q: 'A mirror lens at f/8 is defocused by 1 mm at the sensor. What are the outer and inner diameters of the ring a point of light makes, for an obstruction of 0.42?',
      steps: [
        { text: 'The cone has a diameter of 1 mm divided by the f-number at the plane of the sensor:', tex: 'd_{\\mathrm{out}} = \\frac{1\\ \\mathrm{mm}}{8} = 0.125\\ \\mathrm{mm}' },
        { text: 'The hole is the same fraction of it as the obstruction:', tex: 'd_{\\mathrm{in}} = 0.42 \\times 0.125 = 0.052\\ \\mathrm{mm}' }
      ],
      a: 'A ring 0.125 mm across outside and 0.052 mm across inside: about 29 and 12 pixels of a 4.3 µm sensor.'
    }
  ],
  quiz: [
    { q: 'A central obstruction of 0.5 of the aperture diameter blocks what percentage of the area?', answer: 25, unit: '%', why: '$0.5^2 = 0.25$.' },
    { q: 'What shape does an out-of-focus point of light take in a mirror lens?', choices: ['A ring, because the middle of the aperture is blocked', 'A star', 'A square', 'A solid disc'], a: 0, why: 'Out of focus, a point is the shape of the aperture seen from the image. A mirror lens has a central obstruction, so it is a ring.' },
    { q: 'A mirror lens has no chromatic aberration at all in its mirrors, so it needs no corrector.', a: false, why: 'Mirrors do have no chromatic aberration, but a spherical or a paraboloid-hyperboloid pair still has spherical aberration, coma and field curvature at a useful field, which the corrector plate or meniscus cancels.' },
    { q: 'What does the central obstruction mainly lower?', choices: ['The contrast at coarse and middle spatial frequencies', 'The cut-off frequency of the lens', 'The focal length', 'The field of view'], a: 0, why: 'Light is moved from the central diffraction peak into the rings, so the MTF falls at low and middle frequencies. The cut-off is set by the outer diameter alone.' },
    { q: 'A mirror lens of 500 mm focal length and 62.5 mm aperture has an f-number of…', choices: ['8', '4', '16', '2.8'], a: 0, why: '$500/62.5 = 8$.' }
  ],
  applications: [
    'Compact long photographic lenses of 250 to 1000 mm, at a fixed f/6 to f/11.',
    'Amateur and professional telescopes of the Schmidt–Cassegrain and Maksutov–Cassegrain types.',
    'Surveillance, satellite and airborne cameras, where a long focal length must fit a small volume.',
    'Infrared and ultraviolet imaging, where the lack of chromatic aberration helps.'
  ],
  history: 'Laurent Cassegrain\'s telescope with a convex secondary appeared in 1672. Bernhard Schmidt built his corrector-plate camera in 1930 at the Hamburg observatory in Bergedorf, and Dmitri Maksutov, in Russia, and Albert Bouwers, in the Netherlands, described meniscus-corrected systems independently in 1941. Compact mirror lenses for cameras date from the 1940s and were widely sold from the 1960s.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — mirror and catadioptric lenses.',
    'W. J. Smith, *Modern Optical Engineering* — Cassegrain, Schmidt and Maksutov systems.',
    'E. Hecht, *Optics*, ch. 5–6 — spherical mirrors and the Cassegrain.'
  ],
  sim: 'lf-mirror'
},

/* ================================================================ anamorphic lenses */
{
  id: 'anamorphic-lenses', parent: 'lens-design-forms', title: 'Anamorphic lenses', level: 2,
  short: 'Lenses that squeeze the picture by a different amount horizontally and vertically, with cylindrical elements: a 2× anamorphic puts a 2.4 : 1 picture on a nearly square frame. They leave their mark as oval out-of-focus highlights and horizontal flares.',
  keywords: ['anamorphic', 'squeeze factor', 'desqueeze', 'CinemaScope', 'Hypergonar', 'cylindrical lens', 'oval bokeh', '2x anamorphic', '1.33x', 'front anamorphic', 'widescreen', 'scope', 'anamorphic adapter', 'horizontal flare', 'afocal cylinder'],
  prereq: ['cylindrical-and-toric-lenses', 'combining-thin-lenses', 'field-of-view-and-focal-length'],
  related: ['projections:cinema-and-anamorphic-lenses', 'projections:anamorphosis', 'bokeh-and-out-of-focus-blur', 'entrance-and-exit-pupils', 'beam-expanders', 'laser-line-generators', 'projectors', 'sensor-formats-and-pixel-size', 'depth-of-field'],
  body: `
A cinema screen is about 2.4 times as wide as it is tall, but the frame of 35 mm film is almost square. To use the whole frame, an **anamorphic lens** squeezes the scene horizontally by a factor $S$ when it is recorded, and a matching lens on the projector (or software) stretches it back: the **desqueeze**. The name, from the Greek for "formed again", describes just that: the picture is formed with one shape and re-formed with another.

### How the squeeze is made
A cylindrical lens is curved in one direction only, so it bends light in one plane and leaves the other alone ([[cylindrical-and-toric-lenses]]). A **front anamorphic** attachment is a pair of cylinders — a negative one followed by a positive one, their axes vertical — placed in front of an ordinary spherical lens. The pair is *afocal*: parallel light goes in parallel and comes out parallel, like a one-dimensional beam expander ([[beam-expanders]]). In the horizontal plane it compresses angles by $S$ and widens the beam by $S$; in the vertical plane it does nothing. A pair of $-40$ mm and $+80$ mm cylinders spaced 40 mm apart squeezes by $S = 2$.

The spherical lens behind it is unchanged vertically, but horizontally the whole system acts like a lens of focal length $f/S$:

$$\\tan\\frac{\\theta_h}{2} = \\frac{S\\,w}{2 f} \\qquad \\tan\\frac{\\theta_v}{2} = \\frac{h}{2 f}$$

For a 50 mm lens and a 21.3 × 18.2 mm film frame, a 2× squeeze widens the horizontal field from 24° to 46° at an unchanged vertical field of 21°.

### The picture it makes
| Squeeze | Frame | Delivered picture |
|---|---|---|
| 2× | 35 mm film, anamorphic frame 21.3 × 18.2 mm (1.17 : 1) | 2.34 : 1 |
| 2× | 4 : 3 sensor (1.33 : 1) | 2.67 : 1 |
| 1.8× | 4 : 3 sensor | 2.40 : 1 |
| 1.5× | 3 : 2 full frame (1.5 : 1) | 2.25 : 1 |
| 1.33× | 16 : 9 sensor (1.78 : 1) | 2.37 : 1 |

The delivered aspect ratio is $S\\,w/h$. The 1.33× lens lets a 16 : 9 sensor make the wide picture with the least waste.

### Oval highlights
The cylinders narrow the entrance pupil by $S$ in the horizontal plane only: for a 16 mm beam it becomes 8 mm wide and 16 mm tall. An out-of-focus point of light is the shape of the pupil, so in the finished picture it is an oval **$S$ times taller than wide** — the signature of anamorphic bokeh. A 2× lens gives 2 : 1 ovals, a 1.33× lens 1.33 : 1. On the squeezed frame, before desqueezing, they are narrower still.

### Other signatures
- **Horizontal flares.** A bright light reflecting inside the cylindrical elements is spread into a horizontal streak.
- **Distortion and focus.** The two meridians must focus at the same distance, so close-focusing front anamorphics have a movable cylinder or a diopter, and many show barrel distortion of the vertical lines.
- **Size.** The attachment is large and heavy, because it widens the beam by $S$ in front of the lens.

> [!key] A pair of cylinders ahead of a spherical lens squeezes the picture by $S$ in one direction only, so a 2.4 : 1 picture fits a nearly square frame. The same cylinders narrow the pupil horizontally, which is why out-of-focus highlights become ovals $S$ times taller than wide.
`,
  ideas: [
    'An anamorphic lens squeezes the picture by a factor S in one direction only, and the desqueeze stretches it back.',
    'A front anamorphic is an afocal pair of cylinders ahead of an ordinary lens; they act in the horizontal plane only.',
    'Horizontally the system behaves like a lens of focal length f/S, so the horizontal field is S times wider in tangent.',
    'The delivered aspect ratio is S times the aspect ratio of the sensor: 1.17 × 2 = 2.34, 1.78 × 1.33 = 2.37.',
    'The pupil is narrower by S horizontally, so out-of-focus highlights are ovals S times taller than wide.'
  ],
  pitfalls: [
    'An anamorphic lens simply crops the picture to a widescreen shape — Cropping throws away pixels; an anamorphic lens uses the whole frame and spreads the extra horizontal field over it.',
    'The squeeze factor is the aspect ratio — It is the factor by which the width is compressed; the delivered aspect ratio is the sensor\'s aspect ratio times the squeeze.',
    'The oval bokeh comes from stretching the picture afterwards — The ovals are made by the lens itself, because the pupil is narrower in one direction, and desqueezing leaves them S times taller than wide.',
    'Anamorphic means widescreen — A lens can be anamorphic with any ratio, including 1.33×, and widescreen pictures can be made with spherical lenses and a crop.'
  ],
  terms: [
    { term: 'Anamorphic lens', also: ['anamorphic adapter', 'scope lens', 'front anamorphic'], def: 'A lens or attachment that magnifies differently in the horizontal and the vertical direction, using cylindrical elements, so as to squeeze a wide picture onto a narrower frame.' },
    { term: 'Squeeze factor', also: ['anamorphic ratio', 'squeeze ratio', '2×', '1.33×'], def: 'The factor S by which an anamorphic lens compresses the picture horizontally: 2 for a 2× lens, 1.33 for a 1.33× lens.' },
    { term: 'Desqueeze', also: ['unsqueeze', 'anamorphic stretch'], def: 'Stretching a squeezed picture horizontally by the squeeze factor, in a projector or in software, to restore the correct proportions.' },
    { term: 'Oval bokeh', also: ['elliptical highlights'], def: 'Out-of-focus highlights that are ovals, taller than wide by the squeeze factor, because the entrance pupil of an anamorphic lens is narrower in the horizontal plane.' }
  ],
  formulas: [
    {
      name: 'Aspect ratio of the delivered picture',
      expr: 'AR = S*w/h', tex: '\\mathrm{AR} = \\frac{S\\,w}{h}',
      vars: {
        AR: { name: 'width ÷ height of the desqueezed picture', tex: '\\mathrm{AR}' },
        S: { name: 'squeeze factor', value: 2, min: 1, max: 4 },
        w: { name: 'width of the frame', q: 'length', unit: 'mm', value: 21.3 },
        h: { name: 'height of the frame', q: 'length', unit: 'mm', value: 18.2 }
      },
      stories: { AR: 'A frame of {w} by {h} is shot with a lens that squeezes {S} times. What is the aspect ratio of the desqueezed picture?' }
    },
    {
      name: 'Horizontal angle of view',
      expr: 'FOV = 2*atan(S*w/(2*f))', tex: '\\theta_h = 2\\arctan\\frac{S\\,w}{2 f}',
      vars: {
        FOV: { name: 'horizontal field of view', q: 'angle', unit: '°', tex: '\\theta_h' },
        S: { name: 'squeeze factor', value: 1.33, min: 1, max: 4 },
        w: { name: 'width of the frame', q: 'length', unit: 'mm', value: 24 },
        f: { name: 'focal length of the spherical lens', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'The vertical field is unchanged: $2\\arctan(h/2f)$.',
      stories: { FOV: 'A {f} lens with an anamorphic attachment of squeeze {S} is used on a frame {w} wide. How wide is the horizontal field of view?' }
    },
    {
      name: 'Horizontal focal length',
      expr: 'fh = f/S', tex: 'f_h = \\frac{f}{S}',
      vars: {
        fh: { name: 'focal length in the horizontal plane', q: 'length', unit: 'mm', tex: 'f_h' },
        f: { name: 'focal length of the spherical lens', q: 'length', unit: 'mm', value: 50 },
        S: { name: 'squeeze factor', value: 2, min: 1, max: 4 }
      },
      note: 'In the vertical plane the focal length stays $f$.',
      stories: { fh: 'A {f} lens carries an anamorphic attachment of squeeze {S}. What is its focal length in the horizontal plane?' }
    }
  ],
  examples: [
    {
      title: 'The shape of CinemaScope',
      q: 'The frame of an anamorphic 35 mm print is 21.3 × 18.2 mm. What is the aspect ratio of the picture with a 2× lens?',
      steps: [
        { text: 'The frame is 1.17 : 1, and', tex: '\\mathrm{AR} = \\frac{2 \\times 21.3}{18.2} = 2.34' }
      ],
      a: '2.34 : 1: nearly the 2.35 : 1 of the original CinemaScope.'
    },
    {
      title: 'A 1.33× adapter on a 16 : 9 sensor',
      q: 'A 1.33× attachment is fitted to a 50 mm lens on a sensor 24 × 13.5 mm. What are the horizontal field of view with and without it, and the aspect ratio?',
      steps: [
        { text: 'Without the attachment:', tex: '2\\arctan\\frac{24}{100} = 27.0°' },
        { text: 'With it:', tex: '2\\arctan\\frac{1.33 \\times 24}{100} = 2\\arctan 0.319 = 35.4°' },
        { text: 'The picture is', tex: '\\frac{1.33 \\times 24}{13.5} = 2.36 : 1' }
      ],
      a: '35.4° instead of 27.0° horizontally, at the same vertical field, and a 2.36 : 1 picture.'
    }
  ],
  quiz: [
    { q: 'A 2× anamorphic lens is used on a sensor with a 4 : 3 aspect ratio. What is the aspect ratio of the desqueezed picture?', answer: 2.67, why: '$2 \\times 4/3 = 2.67$ : 1.' },
    { q: 'On which plane do the cylinders of a front anamorphic lens act?', choices: ['The horizontal plane only', 'The vertical plane only', 'Both planes equally', 'Neither: they only block light'], a: 0, why: 'Their axes are vertical, so they have power in the horizontal plane. The vertical plane sees plain plates of glass.' },
    { q: 'An out-of-focus highlight in a picture shot with a 2× anamorphic lens is an oval taller than wide.', a: true, why: 'The entrance pupil is half as wide as it is tall, and an out-of-focus point is the shape of the pupil. The finished, desqueezed picture shows 2 : 1 ovals.' },
    { q: 'A 50 mm spherical lens carries a 2× anamorphic attachment. In the horizontal plane it behaves like a lens of…', choices: ['25 mm', '100 mm', '50 mm', '75 mm'], a: 0, why: '$f_h = f/S = 25$ mm: the horizontal field is the one a 25 mm lens would see, while vertically the lens stays at 50 mm.' },
    { q: 'What squeeze factor on a 4 : 3 sensor gives the 2.4 : 1 picture of a modern wide screen?', answer: 1.8, why: '$2.4 / (4/3) = 1.8$.' }
  ],
  applications: [
    'Cinema photography and projection: most "scope" films are shot through 2× lenses.',
    'Digital cinema and filmmakers who attach 1.33× adapters to 16 : 9 sensors for the wide look.',
    'Projectors with an anamorphic lens to fill a 2.4 : 1 screen from a 16 : 9 image.',
    'Cylindrical telescopes and prism pairs that make the elliptical beam of a diode laser round.'
  ],
  history: 'The French astronomer and optician Henri Chrétien patented his Hypergonar, a 2× anamorphic lens, in the 1920s, and it was used in films around 1927 to 1930. Twentieth Century Fox bought the rights in 1952 and launched CinemaScope with *The Robe* in 1953; Panavision lenses followed from the late 1950s. The picture proportions settled at 2.39 : 1 in the 1970s.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — anamorphic lenses and CinemaScope.',
    'S. F. Ray, *Applied Photographic Optics* (Focal Press) — anamorphic attachments and cylindrical optics.',
    'E. Hecht, *Optics*, ch. 5 (section on cylindrical lenses) — lenses that act in one plane.'
  ],
  sim: 'lf-anamorphic'
},

/* ================================================================ the lens of a phone camera */
{
  id: 'mobile-phone-lenses', parent: 'lens-design-forms', title: 'The lens of a phone camera', level: 2,
  short: 'Five to eight moulded plastic aspheres in a few millimetres: f/1.5 to f/2.4, a chief ray angle matched to the sensor, a telephoto layout for the long cameras and, for the longest, a prism that folds the light through 90°.',
  keywords: ['phone camera lens', 'smartphone lens', 'moulded plastic', 'aspheric', 'total track length', 'TTL', 'chief ray angle', 'CRA', 'periscope', 'folded optics', 'prism', '7P', 'telephoto phone', 'ultra-wide', 'injection moulding', 'lens module', 'voice coil'],
  prereq: ['aspheric-surfaces', 'optical-plastics', 'sensor-formats-and-pixel-size'],
  related: ['the-phone-camera', 'microlenses-bsi-and-stacked-sensors', 'image-stabilization', 'telephoto-lens', 'telecentric-lenses', 'digital-zoom', 'the-airy-disk', 'crop-factor-and-equivalent-focal-length', 'binning-roi-and-area-of-interest'],
  body: `
A phone is less than 9 mm thick, and its camera has to fit in the back plate. Yet the lens must cover a sensor 6 to 12 mm across at f/1.5 to f/2.4, for pixels about a micrometre wide. The answer is a stack of five to eight lens elements, each a few tenths of a millimetre thick, in a barrel the size of a pencil eraser.

### Plastic and aspheric
The elements are **injection-moulded plastic**: cyclo-olefin polymer (index 1.53, Abbe number 56), polycarbonate (1.59, 30) and polystyrene (1.59, 31). Plastic costs almost nothing in millions, weighs little, and can be moulded into **aspheres** that glass could not economically take, including the "gull wing" curve that changes sign of curvature across the surface ([[aspheric-surfaces]]). The low-dispersion plastic serves for the positive elements and the high-dispersion one for the negative ones, as crown and flint do in a doublet. The price: the index of plastic changes by about $-10^{-4}$ per kelvin, sixty times as much as crown glass, so the focus drifts with temperature unless the design compensates.

### The four cameras
Typical, rounded values:

| Camera | Sensor diagonal | Focal length | f-number · pupil | On 24 × 36 mm | Diagonal field | Track length |
|---|---|---|---|---|---|---|
| Main | 12.3 mm | 6.5 mm | f/1.8 · 3.6 mm | 23 mm | 87° | 7.5 mm |
| Ultra-wide | 6.4 mm | 2.0 mm | f/2.2 · 0.9 mm | 14 mm | 116° | 4.4 mm |
| Telephoto 3× | 6.4 mm | 10.4 mm | f/2.4 · 4.3 mm | 70 mm | 34° | 9.0 mm |
| Periscope 5× | 6.4 mm | 17.7 mm | f/3.2 · 5.5 mm | 120 mm | 20° | 17 mm (folded) |

The **total track length** (TTL), from the first surface to the sensor, is about 0.6 to 0.7 of the sensor diagonal for the wide cameras. The telephoto cameras use the telephoto principle ([[telephoto-lens]]): a positive front group and a negative rear group give a track of 0.9 of the focal length.

### The chief ray angle
Because the lens is so short, its exit pupil is close to the sensor, and the chief ray reaches the corner at 25° to 35°. A telecentric lens would send it in at 0° ([[telecentric-lenses]]) but would be far too long. Instead the **microlenses** and colour filters of the sensor are shifted towards the centre to match the lens's chief ray angle ([[microlenses-bsi-and-stacked-sensors]]): lens and sensor are designed as a pair. With $y$ the image height at the corner and $L$ the exit-pupil distance, $\\mathrm{CRA} = \\arctan(y/L)$: for $y = 6.15$ mm and $L = 10.5$ mm it is 30°.

### Diffraction and pixels
The Airy disc at f/1.8 is $2.44 \\times 0.55 \\times 1.8 = 2.4$ µm across, 2.4 pixels of a 1 µm sensor: the lens, not the sensor, limits the detail. Phone sensors therefore **bin** 2 × 2 or 4 × 4 pixels into one.

### Folding the path
A 5× telephoto camera has a focal length of about 18 mm — longer than the phone is thick. A **periscope** layout turns the light through 90° with a prism or a mirror behind a small window in the back, and lays the lens along the length of the body. The prism, which can also tilt to stabilize the picture, must be as high as the beam is wide, 5.5 mm: nearly the thickness of the phone. A voice-coil motor moves the barrel by a few tenths of a millimetre to focus.

> [!key] A phone lens is five to eight moulded plastic aspheres with a track shorter than the sensor's diagonal. It is designed together with the sensor's microlenses, which absorb a chief ray angle of about 30°, and the longest telephoto folds its light with a prism.
`,
  ideas: [
    'A phone lens is five to eight injection-moulded plastic elements, with aspheric surfaces on both sides, in a few millimetres.',
    'Low- and high-dispersion plastics, such as COP and polycarbonate, play the roles of crown and flint in colour correction.',
    'The track length is 0.6 to 0.7 of the sensor diagonal for wide cameras, and the telephoto layout keeps the tele cameras shorter than their focal length.',
    'The chief ray angle at the corner is 25° to 35°, and the sensor\'s microlenses are shifted to match: lens and sensor are designed together.',
    'A periscope telephoto folds the light with a prism so that a lens longer than the phone is thick fits along its body.'
  ],
  pitfalls: [
    'Plastic lenses are inferior to glass ones — For this size and volume they are better: aspheric shapes, low weight and cost. Their limits are the index drift with temperature and birefringence.',
    'More megapixels always means more detail — At 1 µm pixels the Airy disc of an f/1.8 lens is 2.4 pixels wide: the lens limits the detail, and the sensor bins pixels to make up the difference.',
    'The telephoto camera of a phone is a short lens because the sensor is small — Its focal length is long (10 to 18 mm); it fits only through the telephoto layout or a folded path.',
    'A phone zooms optically through its whole range — Most phones carry separate fixed cameras and switch between them; in between, they crop and combine pictures (digital zoom).'
  ],
  terms: [
    { term: 'Total track length', also: ['TTL', 'track length'], def: 'The distance from the first surface of a lens to its image plane. For a phone camera it is a few millimetres; the ratio TTL ÷ sensor diagonal measures how compact the design is.' },
    { term: 'Chief ray angle', also: ['CRA'], def: 'The angle from the normal at which the chief ray reaches the sensor, largest at the corners. A phone lens has 25° to 35° at the corner; the sensor\'s microlenses are shifted to match. (On a sensor page, CRA is the same angle seen from the pixel.)' },
    { term: 'Moulded plastic asphere', also: ['injection-moulded aspheric lens', '7P'], def: 'A lens element of optical plastic, made by injection moulding, with one or two aspheric surfaces. A "7P" lens has seven such elements.' },
    { term: 'Periscope lens', also: ['folded telephoto', 'folded optics'], def: 'A telephoto camera in which a prism or mirror turns the light through 90°, so that the long lens lies along the length of the phone and not through its thickness.' },
    { term: 'Voice-coil motor', also: ['VCM'], def: 'The small electromagnetic actuator that moves the lens barrel of a phone camera along its axis for focusing, and sideways, in some designs, for image stabilization.' }
  ],
  formulas: [
    {
      name: 'Equivalent focal length on a 24 × 36 mm frame',
      expr: 'feq = f*43.27/d', tex: 'f_{\\mathrm{eq}} = f\\,\\frac{43.27\\ \\mathrm{mm}}{d}',
      vars: {
        feq: { name: 'equivalent focal length', q: 'length', unit: 'mm', tex: 'f_{\\mathrm{eq}}' },
        f: { name: 'focal length of the phone lens', q: 'length', unit: 'mm', value: 6.5 },
        d: { name: 'diagonal of the sensor', q: 'length', unit: 'mm', value: 12.3 }
      },
      note: '43.27 mm is the diagonal of a 24 × 36 mm frame; the ratio is the crop factor.',
      stories: { feq: 'A phone lens of focal length {f} covers a sensor of diagonal {d}. What focal length on a 24 × 36 mm camera frames the same picture?' }
    },
    {
      name: 'Airy disc in pixels',
      expr: 'k = 2.44*lambda*N/p', tex: 'k = \\frac{2.44\\,\\lambda\\,N}{p}',
      vars: {
        k: { name: 'diameter of the Airy disc in pixels' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 1.8, min: 0.5, max: 64 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'Above about 2 the lens, not the sensor, limits the detail.',
      stories: { k: 'A lens at f/{N} images light of {lambda} onto pixels {p} wide. How many pixels wide is the Airy disc?' }
    },
    {
      name: 'Chief ray angle at the corner',
      expr: 'CRA = atan(y/L)', tex: '\\mathrm{CRA} = \\arctan\\frac{y}{L}',
      vars: {
        CRA: { name: 'chief ray angle at the corner', q: 'angle', unit: '°', tex: '\\mathrm{CRA}' },
        y: { name: 'image height at the corner (half the diagonal)', q: 'length', unit: 'mm', value: 6.15 },
        L: { name: 'distance from the exit pupil to the sensor', q: 'length', unit: 'mm', value: 10.5 }
      },
      note: 'For a small, near exit pupil the angle is large; a telecentric lens ($L \\to \\infty$) has none.',
      stories: { CRA: 'The corner of a sensor is {y} from the axis and the exit pupil of the lens is {L} from the sensor. At what angle does the chief ray arrive?' }
    }
  ],
  examples: [
    {
      title: 'The main camera as a 23 mm lens',
      q: 'A phone has a 6.5 mm lens on a sensor with a diagonal of 12.3 mm. What is its equivalent focal length on a 24 × 36 mm frame, and its diagonal field of view?',
      steps: [
        { text: 'The crop factor is $43.27/12.3 = 3.52$, so', tex: 'f_{\\mathrm{eq}} = 6.5 \\times 3.52 = 22.9\\ \\mathrm{mm}' },
        { text: 'The field is', tex: '2\\arctan\\frac{6.15}{6.5} = 2 \\times 43.4° = 86.9°' }
      ],
      a: 'A 23 mm equivalent lens with an 87° diagonal field.'
    },
    {
      title: 'Is the lens or the sensor the limit?',
      q: 'The main camera works at f/1.8 with 1.0 µm pixels. What is the Airy disc in pixels, and after 2 × 2 binning (2.0 µm pixels)?',
      steps: [
        { text: 'The Airy disc is $2.44 \\times 0.55 \\times 1.8 = 2.4$ µm, so', tex: 'k = \\frac{2.4}{1.0} = 2.4 \\qquad \\frac{2.4}{2.0} = 1.2' }
      ],
      a: '2.4 pixels, or 1.2 after binning: at 1 µm the lens limits the detail, at 2 µm the sensor and lens are about matched.'
    }
  ],
  quiz: [
    { q: 'The corner of a sensor lies 6.15 mm from the axis and the exit pupil of its lens is 10.5 mm from the sensor. What is the chief ray angle at the corner, in degrees?', answer: 30.4, unit: '°', why: '$\\arctan(6.15/10.5) = 30.4°$.' },
    { q: 'Why are phone lens elements made of moulded plastic rather than ground glass?', choices: ['Plastic can be moulded into aspheres cheaply, in millions, and is light', 'Plastic has a higher refractive index than glass', 'Plastic is more transparent', 'Glass cannot be made small'], a: 0, why: 'Aspheric shapes, low weight and low cost in volume decide it. Plastic has a lower index than most glasses, and its drift with temperature is the price.' },
    { q: 'A 5× periscope camera folds its light path because its focal length is longer than the phone is thick.', a: true, why: 'A focal length of about 18 mm does not fit through a phone 8 mm thick; the prism turns the light so that the lens lies along the body.' },
    { q: 'A phone lens has a focal length of 6.5 mm on a sensor of diagonal 12.3 mm. What is its equivalent focal length on a 24 × 36 mm frame, in millimetres?', answer: 22.9, unit: 'mm', why: '$6.5 \\times 43.27/12.3 = 22.9$ mm.' },
    { q: 'The index of plastic changes by about $-10^{-4}$ per kelvin. For a phone lens this means…', choices: ['the focus drifts with temperature unless the design compensates', 'the colour changes', 'the lens becomes sharper when warm', 'nothing, the effect is negligible'], a: 0, why: 'This is sixty times the drift of crown glass; a change of 20 K moves the focus of a short lens by an amount comparable with its depth of focus, so designs mix plastics to cancel it or the autofocus corrects it.' }
  ],
  applications: [
    'The main, ultra-wide and telephoto cameras of every smartphone.',
    'Tablet, laptop and car cameras, and drones, which use the same moulded-plastic technology.',
    'Endoscopes and other miniature cameras, with lenses of a few millimetres.',
    'Embedded vision modules for robots, door bells and sensors, where size and cost decide.'
  ],
  history: 'The first camera phones, around 2000, carried a single moulded lens or two. Designs of four or five plastic elements were common by the early 2010s, and seven or eight by the 2020s, as moulding precision and computer design improved. Periscope telephoto cameras, with a prism folding the light, reached phones around 2019.',
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* (SPIE Press) — sensors, pixel size and matching of lenses to sensors.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. (Academic Press, 2010) — aspheric surfaces and compact lens forms.',
    'W. J. Smith, *Modern Lens Design* (McGraw-Hill) — aspherics and plastics in lens design.'
  ],
  sim: 'lf-phone'
}

/* ==== END ==== */
);
