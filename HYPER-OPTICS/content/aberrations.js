/* HYPER-OPTICS · content/aberrations.js — the topic "Aberrations" (lenses-and-imaging).
 * Twelve concepts: what aberrations are; the five monochromatic ones of third order (spherical aberration, coma,
 * astigmatism, field curvature, distortion); the two chromatic ones; the Seidel sums; wavefront error and Zernike
 * polynomials; spot diagrams and ray fans; the Strehl ratio and what "diffraction-limited" means.
 * Simulations are in sims/aberrations.js (ids ab-…). Numbers quoted for the f = 100 mm singlets come from the ray
 * bench: an N-BK7 lens, 25 mm clear aperture, light of 587.6 nm unless a wavelength is named.
 */
Hyper.add(

/* ================================================================ what aberrations are */
{
  id: 'what-aberrations-are', parent: 'aberrations', title: 'What aberrations are', level: 1,
  short: 'The lens equation puts every point of the object at one point of the image — for rays near the axis. Real rays miss by small amounts, and the point becomes a patch. Those misses are the aberrations: seven of them at third order, five for a single colour and two for colour.',
  keywords: ['aberration', 'aberrations', 'image defects', 'lens errors', 'paraxial image', 'Gaussian image', 'ray aberration', 'wave aberration', 'third-order', 'Seidel', 'monochromatic', 'blur', 'why lenses are not perfect', 'transverse aberration', 'longitudinal aberration'],
  prereq: ['the-paraxial-approximation', 'refraction-at-a-curved-surface', 'the-thin-lens-equation'],
  related: ['spherical-aberration', 'coma', 'astigmatism-of-lenses', 'field-curvature', 'distortion', 'axial-chromatic-aberration', 'lateral-chromatic-aberration', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'the-airy-disk', 'how-lens-design-works', 'physics:thin-lenses'],
  body: `
The thin-lens equation promises that every ray leaving one point of an object meets again at one point of the image. It keeps the promise only for rays close to the axis, crossing each surface at a small angle — the [[the-paraxial-approximation|paraxial]] world, where $\\sin\\theta$ may be replaced by $\\theta$. Real rays arrive a little early or late, a little to one side, and the point becomes a patch. The gap between where a ray really lands and where the paraxial theory says it should is an **aberration**.

### Two ways to measure the same thing
- **Ray aberration.** Note where each ray lands in the image plane. The sideways miss is the **transverse aberration** $\\varepsilon$ (in µm); the miss along the axis is the **longitudinal aberration** $\\Delta z$. A [[spot-diagrams-and-ray-fans|spot diagram]] plots the landing points of many rays.
- **Wave aberration.** A perfect lens turns the light into a wavefront that is a sphere centred on the ideal image point; a real lens makes a slightly different surface. The gap, as an optical path difference counted in wavelengths, is the **wavefront error** $W$ ([[wavefront-error-and-zernike-polynomials]]).

Rays run perpendicular to the wavefront, so the sideways miss of a ray is the *slope* of the wavefront error:

$$\\varepsilon = 2N\\lambda\\,\\frac{\\mathrm{d}W}{\\mathrm{d}\\rho}$$

where $N$ is the [[the-f-number|f-number]], $\\lambda$ the wavelength, $W$ is in waves and $\\rho$ runs across the pupil from 0 at the centre to 1 at the edge.

### The seven, in one table
Expanding $\\sin\\theta = \\theta - \\theta^3/6 + \\dots$ and keeping the first correction gives five **third-order** aberrations, named after Seidel ([[the-seidel-sums]]). Adding the way the index of glass depends on colour ([[dispersion-and-the-spectrum]]) gives two more.

| Aberration | What the image shows | Transverse size grows as |
|---|---|---|
| [[spherical-aberration|Spherical]] | a sharp core in a soft halo, everywhere | aperture³ |
| [[coma]] | comet-shaped flares pointing away from the centre | aperture² × field |
| [[astigmatism-of-lenses|Astigmatism]] | points smeared into short lines, one way or the other depending on focus | aperture × field² |
| [[field-curvature|Field curvature]] | centre sharp where the edges are soft, and the reverse after refocusing | aperture × field² |
| [[distortion]] | straight lines bent; no blur at all | field³ |
| [[axial-chromatic-aberration|Axial colour]] | a coloured halo that changes colour through focus | aperture |
| [[lateral-chromatic-aberration|Lateral colour]] | coloured fringes on edges, stronger towards the corners | field |

"Aperture" is the pupil diameter, "field" the angle off the axis: open the aperture twofold and spherical aberration grows eightfold; go twice as far off axis and astigmatism grows fourfold.

### Against the diffraction limit
Even a perfect lens makes a point into the [[the-airy-disk|Airy disc]], of radius $1.22\\,\\lambda N$: 2.7 µm at f/4 in green light. A 100 mm biconvex singlet at f/4 has a blur radius of about 320 µm on its axis — 120 times larger; stopped down to f/16 it is 5 µm, below the Airy radius of 10.7 µm. That is why lenses are sharper a few stops from full aperture, and why "aberration-limited" and "diffraction-limited" are the two regimes of a lens ([[strehl-ratio-and-diffraction-limited]]).

### What is done about them
The designer's levers are the shape of each element ([[lens-bending]]), pairs of glasses ([[achromatic-doublet]]), the position of the stop ([[symmetry-and-the-stop]]), non-spherical surfaces ([[aspheric-surfaces]]) and extra elements that cancel one another's errors ([[cooke-triplet]], [[how-lens-design-works]]). Each trades one aberration against another.

> [!key] An aberration is the difference between the real image and the paraxial one, seen as a ray missing its mark or a wavefront departing from a sphere. Each of the seven grows with a different power of aperture and field, which is how you tell them apart.
`,
  ideas: [
    'The thin-lens equation is a first-order theory; real rays miss the paraxial image point by amounts called aberrations.',
    'The same error can be read as a ray miss (transverse ε, longitudinal Δz) or as a wavefront departing from a sphere (W, in waves); ε = 2Nλ dW/dρ links them.',
    'Third order gives five monochromatic aberrations — spherical, coma, astigmatism, field curvature, distortion — and two chromatic ones.',
    'They scale differently: spherical with aperture³, coma with aperture² × field, astigmatism and field curvature with aperture × field², distortion with field³.',
    'A lens is aberration-limited when the blur exceeds the Airy disc and diffraction-limited when it does not; stopping down moves it from the first to the second.'
  ],
  pitfalls: [
    'A perfect lens would make a perfect point — Even with no aberration, diffraction turns a point into an Airy disc whose radius is 1.22 λN. Perfection means diffraction-limited, not point-like.',
    'Aberrations are manufacturing defects — They are present in a flawlessly made spherical lens, because the sine is not equal to the angle. Manufacturing errors add to them but are a different thing.',
    'Aberrations are all the same: a general blur — Each has its own look and its own dependence on aperture and field, and each is cured by a different move. Telling them apart is the first step to fixing them.',
    'Distortion makes the picture blurry — Distortion moves points to the wrong place without spreading them; a distorted image can be perfectly sharp.'
  ],
  terms: [
    { term: 'Aberration', also: ['image defect', 'lens error'], def: 'Any departure of the real image from the ideal point-for-point image of the paraxial theory, whether described as a ray missing its mark or a wavefront departing from a sphere.' },
    { term: 'Paraxial image', also: ['Gaussian image', 'first-order image'], def: 'The image given by the thin-lens and ray-transfer-matrix formulas, valid for rays close to the axis. Aberrations are measured from it.' },
    { term: 'Transverse ray aberration', also: ['ray miss', 'lateral aberration', 'ε'], def: 'The sideways distance, in the image plane, between where a ray lands and where the paraxial or chief-ray image point is.' },
    { term: 'Longitudinal aberration', also: ['axial aberration', 'Δz'], def: 'The miss measured along the axis: where a ray crosses the axis, less the paraxial focus.' },
    { term: 'Wave aberration', also: ['wavefront error', 'OPD', 'W'], def: 'The optical path difference between the real wavefront and a reference sphere through the exit pupil, in waves. Zero for a perfect lens.' },
    { term: 'Third-order aberrations', also: ['Seidel aberrations', 'primary aberrations'], def: 'The five monochromatic aberrations that arise from the first correction to the paraxial approximation, $\\sin\\theta \\approx \\theta - \\theta^3/6$: spherical, coma, astigmatism, field curvature and distortion.' },
    { term: 'Monochromatic aberration', def: 'An aberration present in light of a single wavelength, as opposed to the chromatic aberrations that come from the dependence of the refractive index on wavelength.' }
  ],
  formulas: [
    {
      name: 'Radius of the Airy disc (the diffraction floor)',
      expr: 'r = 1.22*lambda*N', tex: 'r = 1.22\\,\\lambda\\,N',
      vars: {
        r: { name: 'radius to the first dark ring', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 }
      },
      note: 'A lens whose aberration blur is smaller than this is limited by diffraction, not by its glass.',
      stories: { r: 'How large is the Airy disc of a perfect lens at f/{N} in light of {lambda}?', N: 'At what f-number does a perfect lens have an Airy radius of {r} in light of {lambda}?' }
    },
    {
      name: 'Ray miss from the slope of the wavefront error',
      expr: 'eps = 2*N*lambda*s', tex: '\\varepsilon = 2\\,N\\,\\lambda\\,s',
      vars: {
        eps: { name: 'transverse ray aberration', q: 'length', unit: 'µm', signed: true, tex: '\\varepsilon' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 587.6, tex: '\\lambda' },
        s: { name: 'slope of the wavefront error, in waves per unit of pupil radius', value: 65, signed: true }
      },
      note: 'The slope s = dW/dρ is taken where the ray crosses the pupil. The default is the edge of the f/4 singlet of the example.',
      stories: { eps: 'The wavefront error of an f/{N} lens in light of {lambda} changes by {s} waves between the centre and the edge of the pupil. How far does the marginal ray miss?' }
    },
    {
      name: 'Blur circle from a focus error',
      expr: 'b = dz/N', tex: 'b = \\frac{\\Delta z}{N}',
      vars: {
        b: { name: 'diameter of the blur circle', q: 'length', unit: 'µm' },
        dz: { name: 'distance of the sensor from the focus', q: 'length', unit: 'mm', value: 0.5, tex: '\\Delta z' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 }
      },
      note: 'The cone of light has a width of one f-number per unit of length: the same relation that governs depth of focus.'
    }
  ],
  examples: [
    {
      title: 'When does the singlet stop being the problem?',
      q: 'A 100 mm biconvex singlet has a geometric spot radius of 322 µm at f/4, caused by spherical aberration alone. The blur falls as $N^{-3}$. At what f-number does it fall to the Airy radius $1.22\\,\\lambda N$ in light of 550 nm?',
      steps: [
        { text: 'The blur radius at f/N is $322\\,(4/N)^3$ µm. Set it equal to the Airy radius, with $\\lambda = 0.55$ µm:', tex: '322\\left(\\frac{4}{N}\\right)^3 = 1.22 \\times 0.55\\,N' },
        { text: 'Collect the powers of N:', tex: 'N^4 = \\frac{322 \\times 64}{0.671} = 3.07\\times 10^4' },
        'The fourth root is $N = 13.2$. At f/11 the blur (15 µm) is still twice the Airy radius (7.4 µm); at f/16 it is 4.8 µm, smaller than the 10.7 µm of the Airy disc.'
      ],
      a: 'About f/13: stopped down beyond that, diffraction rather than the lens\'s aberration sets the size of the image of a point.'
    },
    {
      title: 'From the wavefront to the ray',
      q: 'The wavefront error of an f/4 lens is $W = 16\\rho^4$ waves of light of 587.6 nm (pure third-order spherical aberration). How far does the marginal ray miss?',
      steps: [
        { text: 'Differentiate: $\\mathrm{d}W/\\mathrm{d}\\rho = 64\\rho^3$, which is 64 waves at the edge, $\\rho = 1$.' },
        { text: 'Then', tex: '\\varepsilon = 2N\\lambda\\,\\frac{\\mathrm{d}W}{\\mathrm{d}\\rho} = 2 \\times 4 \\times 0.5876\\ \\mu\\mathrm{m} \\times 64 = 301\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 0.3 mm, as tracing the rays through the singlet confirms (0.31 to 0.32 mm).'
    }
  ],
  quiz: [
    { q: 'What do the aberrations of a lens measure?', choices: ['How far the real image departs from the paraxial image', 'How much light the lens absorbs', 'How badly the glass is made', 'How far the lens is from the object'], a: 0, why: 'Aberrations are the departures of real rays (or the real wavefront) from the ideal point-for-point image of the first-order theory. Absorption and manufacturing errors are different matters.' },
    { q: 'A lens is stopped down from f/4 to f/8. Its transverse spherical aberration changes by a factor of…', choices: ['1/2', '1/4', '1/8', '1/16'], a: 2, why: 'Transverse spherical aberration goes as aperture cubed. Halving the diameter (f/4 to f/8) leaves one eighth.' },
    { q: 'Distortion blurs the image, like the other aberrations.', a: false, why: 'Distortion changes only where points land, depending on their distance from the axis. Every point is still imaged as a point, so a purely distorted image is sharp but its straight lines are curved.' },
    { q: 'Which pair of aberrations grows as the square of the field angle?', choices: ['Astigmatism and field curvature', 'Spherical aberration and coma', 'Distortion and lateral colour', 'Axial colour and coma'], a: 0, why: 'Astigmatism and field curvature go as aperture × field²; spherical aberration does not depend on field, coma goes as field, distortion as field³ and lateral colour as field.' },
    { q: 'A perfect f/8 lens is used with green light of 550 nm. What is the radius of the image of a point, in micrometres?', answer: 5.37, unit: 'µm', why: '$r = 1.22\\,\\lambda N = 1.22 \\times 0.55 \\times 8 = 5.4$ µm. That is the diffraction floor: no lens of that aperture does better.' }
  ],
  applications: [
    'Lens design: every merit function of a design program is a weighted sum of ray errors or wavefront errors, which is to say of aberrations.',
    'Choosing a lens: "sharp wide open at the corners" is a statement that all seven are small at the largest aperture and field, and costs elements.',
    'Telescopes and microscopes: the observer sees aberrations as star images that are not points and fringes that are not white.',
    'Machine vision: an inspection lens is specified by its distortion, its resolution at the corner and its colour correction, which are the aberrations in the vocabulary of a datasheet.',
    'The eye: its own aberrations, mostly defocus and astigmatism, are corrected by spectacles; the rest are the subject of [[aberrations-of-the-eye]].'
  ],
  history: 'Kepler and Descartes already knew that a spherical surface does not focus a parallel beam to a point. The first quantitative theory of the five monochromatic aberrations was published in 1856 by Philipp Ludwig von Seidel, a Munich mathematician and astronomer; designers still speak of the Seidel coefficients. Higher orders were worked out in the twentieth century, and today every design is traced exactly by computer rather than by series.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics), section on aberrations — the five monochromatic aberrations and chromatic aberration.',
    'W. T. Welford, *Aberrations of Optical Systems* (Adam Hilger, 1986) — the standard treatment of third-order and higher-order aberrations.',
    'J. Sasian, *Introduction to Aberrations in Optical Imaging Systems* (Cambridge University Press, 2013) — wave and ray aberrations and their scaling with aperture and field.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 5 (Geometrical theory of aberrations).'
  ],
  sim: 'ab-overview'
},

/* ================================================================ spherical aberration */
{
  id: 'spherical-aberration', parent: 'aberrations', title: 'Spherical aberration', level: 1,
  short: 'A spherical surface bends rays that strike near its edge more than it should: they cross the axis nearer the lens than the rays near the middle. The image of a point is a sharp core inside a soft halo, over the whole field, and it falls steeply as the aperture is closed.',
  keywords: ['spherical aberration', 'SA', 'LSA', 'TSA', 'longitudinal spherical aberration', 'marginal ray', 'paraxial focus', 'best focus', 'circle of least confusion', 'caustic', 'zones', 'soft focus', 'overcorrected', 'undercorrected', 'W040', 'Hubble mirror'],
  prereq: ['what-aberrations-are', 'refraction-at-a-curved-surface', 'lens-shapes-and-names'],
  related: ['lens-bending', 'aspheric-surfaces', 'achromatic-doublet', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'the-f-number', 'depth-of-focus', 'spherical-mirror-aberration', 'parabolic-and-elliptical-mirrors', 'bokeh-and-out-of-focus-blur'],
  body: `
Hold a magnifying glass up to the Sun and the bright spot is never quite a point; it has a hot centre and a fainter glow around it. A lens with spherical surfaces cannot focus a parallel beam to a point, because rays that strike the lens far from its axis are bent by more than the paraxial formula allows. The result is **spherical aberration**, and it is the one aberration every lens has on its axis, at every point of the field.

### Where the rays go
Trace rays through a lens, each one at its own height $h$ from the axis. The ray close to the axis (the *paraxial* ray) crosses the axis at the paraxial focus. The rays farther out cross it nearer the lens, and the **marginal ray**, through the edge of the pupil, crosses it nearest. The gap between the marginal crossing and the paraxial focus is the **longitudinal spherical aberration**, LSA. Because the marginal focus is on the lens side it is called *undercorrected* — the usual state of a positive singlet.

The spread of the rays across the paraxial focal plane is the **transverse spherical aberration** TSA: a bright core made by the inner rays and a wide skirt made by the outer ones. The tightest the patch can be made is somewhere in between, at the **best focus**, a little in front of the paraxial focus, where the patch is the **circle of least confusion**: for third-order spherical aberration it is about a quarter the diameter of the paraxial spot.

### How big, and how it scales
For a 100 mm N-BK7 biconvex lens, traced ray by ray (the Airy radius is for 550 nm):

| f-number | LSA of the marginal ray | Blur radius at paraxial focus | Airy radius |
|---|---|---|---|
| f/2.8 | −5.3 mm | 987 µm | 1.9 µm |
| f/4 | −2.5 mm | 322 µm | 2.7 µm |
| f/8 | −0.62 mm | 39 µm | 5.4 µm |
| f/16 | −0.15 mm | 4.8 µm | 10.7 µm |

Longitudinal aberration goes as the square of the aperture diameter, the transverse blur as the cube, and the wavefront error as the fourth power. Doubling the f-number divides the blur by 8 — the reason a stopped-down lens is so much sharper.

### Depends on the shape, not on the field
The effect is not the same for every lens of the same focal length. A plano-convex lens with its curved face toward a distant object has a marginal LSA of −1.8 mm at f/4; turned round it is −7.1 mm, four times worse, because the rays now strike the first, flat surface and the curved one at steep angles together. A **best-form** lens, with radii in the ratio 1 : −6.7 for glass of $n = 1.52$, has the least spherical aberration a single lens can have, −1.7 mm. See [[lens-bending]].

### Why it cannot be left alone
Spherical aberration is independent of the field angle, so it sits in every part of the picture, and because it adds a soft halo of rays around the sharp core, it lowers contrast at fine detail across the frame. It can be reduced by stopping down, by bending the lens, by splitting the power over two lenses, by combining a positive and a negative lens ([[achromatic-doublet]]) or by making one surface an [[aspheric-surfaces|asphere]]: a paraboloid mirror has none at all for a distant object.

> [!key] Rays farther from the axis focus nearer the lens. Longitudinal error goes as aperture², transverse blur as aperture³: halving the aperture divides the blur by eight. The shape of the lens, not its field, decides how bad it is.
`,
  ideas: [
    'Rays through the edge of a spherical lens focus nearer the lens than rays near the axis; the gap is the longitudinal spherical aberration.',
    'A sharp core inside a soft halo is the signature: the image looks "dreamy" and loses contrast, equally over the whole field.',
    'Longitudinal error ∝ D², transverse blur ∝ D³, wavefront error ∝ D⁴; stopping down is very effective.',
    'The best focus lies between the marginal and paraxial foci, where the circle of least confusion is smallest.',
    'It depends on the lens shape: a best-form singlet has the least, a plano-convex lens turned the wrong way has about four times as much.'
  ],
  pitfalls: [
    'The sharpest focus is at the paraxial focus — The paraxial focus is where only the thinnest central rays meet. The smallest overall blur is at the best focus, in front of it, which is where an aberrated lens should be focused.',
    'Spherical aberration is worst at the edge of the picture — It is independent of the field angle: the on-axis point has exactly as much as a point at the corner. Coma and astigmatism are the ones that grow outwards.',
    'It can be removed by a more careful grinding of spherical surfaces — It belongs to the sphere itself. Only a different shape, a different arrangement of surfaces, or a smaller aperture reduces it.',
    'A paraboloid mirror has no aberrations — It has no spherical aberration for an object at infinity on the axis; off axis it has coma and astigmatism.'
  ],
  terms: [
    { term: 'Spherical aberration', also: ['SA', 'W040', 'S_I'], def: 'The failure of a spherical surface or lens to bring all the rays of a parallel beam to one focus: the farther from the axis a ray enters, the more it is bent. Present on axis and equally over the whole field.' },
    { term: 'Longitudinal spherical aberration', also: ['LSA', 'LA'], def: 'The distance along the axis between where a ray at pupil height h crosses the axis and the paraxial focus. For a positive singlet it is negative: the marginal rays focus nearer the lens.' },
    { term: 'Transverse spherical aberration', also: ['TSA', 'TA'], def: 'The radius, in the paraxial focal plane, of the patch the marginal rays make: roughly the LSA divided by twice the f-number.' },
    { term: 'Marginal ray', def: 'The ray through the edge of the aperture stop. Here: the ray that shows the largest spherical aberration.' },
    { term: 'Circle of least confusion', also: ['best focus', 'disc of least confusion'], def: 'The smallest cross-section of the bundle of rays of an aberrated lens. For spherical aberration it lies in front of the paraxial focus; the plane of "best focus" is chosen there.' },
    { term: 'Undercorrected / overcorrected', def: 'Spherical aberration is undercorrected when the marginal rays focus nearer the lens than the paraxial ones (a positive singlet) and overcorrected when they focus farther away (a negative lens).' }
  ],
  formulas: [
    {
      name: 'Wavefront error from the longitudinal aberration',
      expr: 'W = L/(16*N^2*lambda)', tex: 'W_{040} = \\frac{L}{16\\,N^2\\,\\lambda}',
      vars: {
        W: { name: 'spherical aberration at the pupil edge, in waves', tex: 'W_{040}' },
        L: { name: 'longitudinal aberration of the marginal ray', q: 'length', unit: 'mm', value: 2.5, tex: 'L' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 587.6, tex: '\\lambda' }
      },
      note: 'Third order. A shift of focus by L changes the path across the pupil by L/(8N²); spherical aberration needs only half as much, averaged over the rays.',
      stories: { W: 'A lens at f/{N} has a marginal longitudinal aberration of {L} in light of {lambda}. How many waves of spherical aberration is that?' }
    },
    {
      name: 'Transverse aberration from the wavefront coefficient',
      expr: 'eps = 8*N*lambda*W', tex: '\\varepsilon = 8\\,N\\,\\lambda\\,W_{040}',
      vars: {
        eps: { name: 'transverse spherical aberration (marginal ray, paraxial focus)', q: 'length', unit: 'µm', tex: '\\varepsilon' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 587.6, tex: '\\lambda' },
        W: { name: 'spherical aberration, in waves', value: 16.4, tex: 'W_{040}' }
      },
      note: 'The slope of $W_{040}\\rho^4$ at the edge is $4W_{040}$ waves, and $\\varepsilon = 2N\\lambda\\,\\mathrm{d}W/\\mathrm{d}\\rho$.'
    },
    {
      name: 'Scaling with the aperture',
      expr: 'b2 = b1*(N1/N2)^3', tex: 'b_2 = b_1\\left(\\frac{N_1}{N_2}\\right)^{3}',
      vars: {
        b2: { name: 'blur radius at the second f-number', q: 'length', unit: 'µm' },
        b1: { name: 'blur radius at the first f-number', q: 'length', unit: 'µm', value: 322 },
        N1: { name: 'first f-number', value: 4, min: 0.5, max: 64 },
        N2: { name: 'second f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'Third-order transverse spherical aberration, same lens, same focal length.',
      stories: { b2: 'A singlet blurs a point to a radius of {b1} at f/{N1}. What is the radius at f/{N2}?' }
    }
  ],
  examples: [
    {
      title: 'How many waves is the singlet out?',
      q: 'A 100 mm biconvex lens at f/4 has a marginal longitudinal aberration of −2.5 mm. In green light of 550 nm, how many waves of spherical aberration is that, and what would the transverse blur radius be?',
      steps: [
        { text: 'Wavefront coefficient:', tex: 'W_{040} = \\frac{L}{16N^2\\lambda} = \\frac{2.5\\ \\mathrm{mm}}{16 \\times 16 \\times 550\\times10^{-6}\\ \\mathrm{mm}} = 17.8' },
        { text: 'Transverse aberration at the paraxial focus:', tex: '\\varepsilon = 8N\\lambda W_{040} = 8 \\times 4 \\times 0.55\\ \\mu\\mathrm{m} \\times 17.8 = 313\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 18 waves of spherical aberration, a blur radius of 0.31 mm — against a diffraction limit of one-tenth of a wave. The singlet is far from perfect at f/4.'
    },
    {
      title: 'Stopping down to hide it',
      q: 'The singlet blurs a point to 322 µm radius at f/4. To what f-number must it be stopped for the blur to fall to 20 µm?',
      steps: [
        { text: 'The blur goes as $N^{-3}$:', tex: '20 = 322\\left(\\frac{4}{N}\\right)^3 \\;\\Rightarrow\\; N = 4\\left(\\frac{322}{20}\\right)^{1/3}' },
        'The cube root of 16.1 is 2.52, so $N = 10.1$.'
      ],
      a: 'About f/10. Stopped down this far the singlet is limited by diffraction (Airy radius 6.7 µm) as much as by spherical aberration.'
    }
  ],
  quiz: [
    { q: 'Rays through the edge of a positive singlet focus…', choices: ['nearer the lens than the paraxial focus', 'farther from the lens than the paraxial focus', 'at exactly the paraxial focus', 'on the other side of the lens'], a: 0, why: 'The surfaces bend the outer rays too strongly, so they cross the axis early. The marginal LSA of a positive singlet is negative — "undercorrected".' },
    { q: 'A lens is stopped down from f/2.8 to f/5.6, two stops. By what factor does its transverse spherical aberration fall?', answer: 8, why: 'The f-number doubles and the transverse aberration goes as $D^3 \\propto N^{-3}$: a factor 8. (The longitudinal aberration falls by 4.)' },
    { q: 'Spherical aberration is worse at the corner of the picture than at the centre.', a: false, why: 'It is independent of the field angle at third order. A point on the axis has exactly as much as one at the corner; coma and astigmatism are the ones that grow outwards.' },
    { q: 'Which single lens has the least spherical aberration for a distant object?', choices: ['A best-form lens, with the more strongly curved face toward the object', 'A symmetrical biconvex lens', 'A plano-convex lens with the flat face toward the object', 'A thick lens of the same focal length'], a: 0, why: 'The lens is bent so that the rays strike the two surfaces at similar, modest angles; for $n \\approx 1.5$ the radii are in the ratio 1 : −6.7. The flat face toward the object is the worst of the three shapes.' },
    { q: 'Where is the plane of smallest blur for a lens with spherical aberration?', choices: ['At the marginal focus', 'At the paraxial focus', 'Between the two, at the circle of least confusion', 'Behind the paraxial focus'], a: 2, why: 'The paraxial rays focus there, but the outer rays have already crossed and spread. The smallest overall patch lies between marginal and paraxial foci, about three-quarters of the way towards the marginal focus.' }
  ],
  applications: [
    'Photographic prime lenses: "soft glow" wide open — spherical aberration left uncorrected on purpose in some portrait lenses, with a control that varies it.',
    'Telescope mirrors: a paraboloid removes it for stars on the axis; the Hubble Space Telescope\'s primary was ground to the wrong conic and had spherical aberration until corrective optics were installed in 1993.',
    'Laser focusing: a collimating or focusing singlet is chosen in best form, or an asphere, so that the spot is limited by the beam, not by the lens.',
    'Microscope objectives: the cover glass adds spherical aberration, so high-NA objectives carry a correction collar for its thickness.',
    'Strong magnifiers and condenser lenses are made with an aspheric surface to bring the edge rays to the same focus as the central ones.'
  ],
  history: 'Ibn al-Haytham (Alhazen), in the eleventh century, studied how a spherical mirror fails to focus a parallel beam to a point. Descartes, in 1637, showed which surfaces do focus it — hyperbolas and ellipses for a distant object, ovals in general — but they were hard to make, and easily ground spheres won. The Hubble Space Telescope showed in 1990 that the problem is still real: its primary mirror was too flat by about 2.2 µm at the edge and put a halo round every star until corrective optics were installed on the servicing mission of December 1993.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — spherical aberration, the marginal and paraxial foci and the circle of least confusion.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. — spherical aberration of a thin lens, the effect of bending and of the stop.',
    'W. J. Smith, *Modern Optical Engineering* — third-order spherical aberration, its dependence on aperture and shape.'
  ],
  sim: 'ab-spherical'
},

/* ================================================================ coma */
{
  id: 'coma', parent: 'aberrations', title: 'Coma', level: 2,
  short: 'Off the axis, rays from the two sides of a lens meet the image plane at different distances from the axis, and a point becomes a comet: a sharp head pointing at the centre of the field with a fan-shaped tail pointing away. It grows with the square of the aperture and in proportion to the angle off axis.',
  keywords: ['coma', 'comatic', 'comatic flare', 'comet', 'tangential coma', 'sagittal coma', 'off-axis blur', 'W131', 'sine condition', 'aplanatic', 'coma corrector', 'Paracorr', 'Newtonian', 'paraboloid mirror', 'wide open corners'],
  prereq: ['what-aberrations-are', 'spherical-aberration', 'chief-and-marginal-rays'],
  related: ['astigmatism-of-lenses', 'symmetry-and-the-stop', 'parabolic-and-elliptical-mirrors', 'reflecting-telescopes', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'wavefront-error-and-zernike-polynomials', 'bokeh-and-out-of-focus-blur'],
  body: `
Photograph a field of stars with a fast lens used wide open and the stars at the centre are points while those at the corners are little comets, all pointing along lines that run towards the middle of the picture. That is **coma**, from the Greek for a comet's hair.

### What it is
Take a point off the axis. The **chief ray** goes through the centre of the aperture and marks where the image should be. A ring of rays from the same point, passing through a circle of the lens at pupil radius $\\rho$, does not meet in a point but traces a small circle in the image plane. Rays through the edge of the lens ($\\rho = 1$) make a larger circle than rays through the middle, and the circles are displaced from one another along the line to the axis. A series of circles, tangent to two lines that diverge from the chief ray point at 60°, builds a comet: a bright head at the chief ray and a fan-shaped tail.

Equivalently: the lens behaves as if its magnification were different for different zones, so that the outer and inner zones form images of different size. A lens free of coma is one in which all zones agree, which is the Abbe **sine condition**; with spherical aberration also gone it is called *aplanatic*.

### Size and scaling
The length of the tail along the radial line, the **tangential coma**, is three times the **sagittal coma**, which is the radius of the largest circle. Coma goes as

$$\\text{coma} \\propto \\text{aperture}^2 \\times \\text{field angle}$$

— the square of the aperture because the rim of the lens is what makes the tail, and linear in the field because there is none on the axis. For a paraboloid mirror, which has no spherical aberration, the tail is

$$c_T = \\frac{3\\,f\\,\\theta}{16\\,N^2}$$

for focal length $f$, off-axis angle $\\theta$ and f-number $N$. At f/5 and $f = 1000$ mm a star 0.5° off axis is spread over 65 µm by the formula (73 µm in the ray trace, the difference being the higher orders); at f/10, 16 µm by the formula (20 µm traced). Closing the aperture by two stops divides the coma by four.

| Mirror f = 1000 mm, f/5 | θ = 0.1° | 0.25° | 0.5° |
|---|---|---|---|
| Tangential coma (traced) | 13 µm | 35 µm | 73 µm |

### How it looks in a ray fan
In the ray-fan plot the tangential fan is a **parabola** — its two halves bend the same way, because the rays from both sides of the lens miss on the same side — and the sagittal fan is nearly flat. A spot diagram is a comet, bright where the chief ray lands and fainter towards the tail, which is why every ring of the pupil is marked in the simulation.

### Reducing it
Coma depends on where the stop sits. A symmetrical arrangement of elements about the stop cancels it, and that is why double Gauss and symmetric lenses are good wide open ([[symmetry-and-the-stop]]); a single lens in best form has little coma when the stop is at the lens. A telescope mirror has its stop at the mirror and cannot use that trick: a Newtonian with a paraboloid at f/4 is sharp only within a few tenths of a millimetre of the axis, and a **coma corrector** — a lens group before the focus — widens the field.

> [!key] Coma is a comet-shaped flare that points along the line to the axis of the picture. It grows as aperture² × field and is cancelled by symmetry about the stop.
`,
  ideas: [
    'An off-axis point is imaged as a comet: a sharp head at the chief ray and a tail fanning outwards along the radial line.',
    'Each ring of the pupil makes its own circle; larger rings make larger circles, displaced outwards, which build the tail.',
    'The tangential coma (the tail) is three times the sagittal coma (the half-width of the comet).',
    'It grows as aperture² × field: absent on the axis, quartered by a two-stop reduction of the aperture.',
    'A lens free of coma and spherical aberration obeys the sine condition and is aplanatic; symmetry about the stop cancels coma.'
  ],
  pitfalls: [
    'Coma and spherical aberration are the same thing — Spherical aberration is present on the axis and does not depend on field. Coma vanishes on the axis and grows linearly with field.',
    'A comet-shaped blur must be the fault of the sensor or a tilt — It is the aberration of the lens, and its orientation (the tail always along the line to the centre of the picture) distinguishes it from a tilted sensor or a decentred lens.',
    'Stopping down removes coma — It only reduces it, as the square of the aperture: two stops make it a quarter. That is enough when the error was small, but the comet shape is still there, shrunken.',
    'A paraboloid mirror is "perfect" — Perfect on the axis. Off axis it has pure coma, 3θ/(16N²), and so a Newtonian telescope has a small coma-free field that shrinks as the f-number falls.'
  ],
  terms: [
    { term: 'Coma', also: ['comatic aberration', 'W131', 'S_II'], def: 'The off-axis aberration in which rays from different zones of the lens form circles of different sizes and positions in the image plane, giving a comet-shaped image of a point. Absent on the axis; proportional to the field angle.' },
    { term: 'Tangential coma', also: ['TCO', 'comatic length'], def: 'The length of the comet along the radial line, from the chief ray point to the tip of the tail. Three times the sagittal coma.' },
    { term: 'Sagittal coma', also: ['CMA', 'comatic flare'], def: 'The radius of the largest circle of the comet, measured across the radial direction; one third of the tangential coma.' },
    { term: 'Sine condition', also: ['Abbe sine condition'], def: 'The requirement that the ratio sin u / sin u′ of the angles of a ray at the object and the image be the same for all the rays from an axial point. A system that satisfies it and has no spherical aberration is free of coma: aplanatic.' },
    { term: 'Aplanatic', def: 'Free of both spherical aberration and coma, at least for the axial point and its neighbourhood.' },
    { term: 'Coma corrector', def: 'A lens group placed in front of the focus of a fast paraboloid telescope that cancels coma over a wider field.' }
  ],
  formulas: [
    {
      name: 'Tangential coma of a paraboloid mirror',
      expr: 'c = 3*f*theta/(16*N^2)', tex: 'c_T = \\frac{3\\,f\\,\\theta}{16\\,N^2}',
      vars: {
        c: { name: 'tangential coma (length of the comet)', q: 'length', unit: 'µm', tex: 'c_T' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 },
        theta: { name: 'angle off axis', q: 'angle', unit: '°', value: 0.5, min: 0, max: 5, tex: '\\theta' },
        N: { name: 'f-number', value: 5, min: 1, max: 64 }
      },
      note: 'Third order, a mirror with its stop at the mirror. Sagittal coma is one third of this.',
      stories: { c: 'A Newtonian telescope of focal length {f} works at f/{N}. How long is the coma of a star {theta} from the centre of the field?', theta: 'A paraboloid of focal length {f} at f/{N} may show a coma tail of {c}. How far off axis is that?' }
    },
    {
      name: 'Scaling of coma with aperture and field',
      expr: 'c2 = c1*(N1/N2)^2*(t2/t1)', tex: 'c_2 = c_1\\left(\\frac{N_1}{N_2}\\right)^{2}\\frac{\\theta_2}{\\theta_1}',
      vars: {
        c2: { name: 'coma in the second condition', q: 'length', unit: 'µm' },
        c1: { name: 'coma in the first condition', q: 'length', unit: 'µm', value: 73 },
        N1: { name: 'first f-number', value: 5, min: 1, max: 64 },
        N2: { name: 'second f-number', value: 10, min: 1, max: 64 },
        t1: { name: 'first field angle', q: 'angle', unit: '°', value: 0.5, min: 0.01, max: 20, tex: '\\theta_1' },
        t2: { name: 'second field angle', q: 'angle', unit: '°', value: 0.5, min: 0.01, max: 20, tex: '\\theta_2' }
      },
      note: 'Coma goes as the square of the aperture diameter, which is as N⁻², times the field angle.'
    }
  ],
  examples: [
    {
      title: 'How far is the coma-free field?',
      q: 'A paraboloid of focal length 1000 mm at f/5 is used with a sensor of 5 µm pixels. At what angle off axis does the tangential coma reach one pixel?',
      steps: [
        { text: 'Solve $c_T = 3f\\theta/(16N^2)$ for the angle:', tex: '\\theta = \\frac{16 N^2 c_T}{3 f} = \\frac{16 \\times 25 \\times 0.005\\ \\mathrm{mm}}{3 \\times 1000\\ \\mathrm{mm}} = 6.7\\times10^{-4}\\ \\mathrm{rad}' },
        'That is 0.038°, or 2.3 arcminutes: about 0.67 mm from the centre of the sensor.'
      ],
      a: 'Only 2.3 arcminutes off axis. Beyond that radius every star is a comet, which is why fast Newtonians use a coma corrector; at f/10 the coma-free radius is four times larger.'
    },
    {
      title: 'Stopping down by two stops',
      q: 'A lens shows 40 µm of coma at a field angle of 10° wide open at f/2. How much at f/4 for the same point? And how far off axis can you go at f/4 for the same coma?',
      steps: [
        'Two stops multiply the f-number by 2: coma goes as $N^{-2}$, so it falls by 4 to 10 µm.',
        'For 40 µm at f/4 the field must be four times larger, since coma is proportional to the angle: 40°, far beyond the lens\'s coverage.'
      ],
      a: '10 µm at the same point; the 40 µm level is reached four times farther out. Stopping down is the quickest way to reduce coma, and the reason a lens that is good wide open needs so much more design effort.'
    }
  ],
  quiz: [
    { q: 'In an image of stars with coma, the tails of the comets point…', choices: ['along lines through the centre of the picture', 'all in the same direction, whatever the star', 'in circles around the centre', 'randomly'], a: 0, why: 'The tail lies in the meridional plane, the plane containing the axis and the chief ray. So the tails fan along radial lines — which is how coma is told from a tilted sensor or from motion blur.' },
    { q: 'A lens at f/2 shows coma of 30 µm. Stopped to f/4, the coma at the same point falls to…', choices: ['15 µm', '7.5 µm', '3.75 µm', '30 µm — it does not change'], a: 1, why: 'Coma goes as aperture², which is $N^{-2}$. Two stops (a factor 2 in $N$) divide it by 4.' },
    { q: 'Coma is present at the centre of the field.', a: false, why: 'Coma is zero on the axis and grows in proportion to the angle off axis. On the axis the aberration is spherical, the same for all field positions.' },
    { q: 'The tangential coma of a mirror is 60 µm. What is its sagittal coma, in micrometres?', answer: 20, unit: 'µm', why: 'Tangential coma is three times the sagittal coma, so 60/3 = 20 µm.' },
    { q: 'What do the circles of coma correspond to in the pupil?', choices: ['Rings: each ring of the pupil makes one circle in the image', 'Pupil points on a diameter', 'Lens zones, one per colour', 'Nothing in particular'], a: 0, why: 'A ring of rays of pupil radius ρ goes to a circle of radius proportional to ρ², displaced by twice as much — hence the tail. Colouring the rings in the simulation shows this.' }
  ],
  applications: [
    'Astrophotography: a Newtonian with a fast primary is fitted with a coma corrector to keep the stars at the edge round.',
    'Camera lenses: "good in the corners wide open" means coma is cancelled by symmetry or by aspheres; the old fast lenses show comet-shaped highlights in the corners at full aperture.',
    'Microscope objectives and scanning lenses are designed to satisfy the sine condition, so that off-axis points of an extended object are sharp.',
    'Laser scanning and beam-delivery optics: a focusing lens that is tilted develops coma, which is used as a diagnostic when aligning one.',
    'Wavefront sensing: coma is Zernike term Z7/Z8 and the first sign of misalignment in a telescope.'
  ],
  history: 'The name comes from the tail of a comet. Ernst Abbe\'s sine condition of 1873, which tells when a lens forms a sharp image of a small area around the axis, is the condition for freedom from coma. In 1905 Karl Schwarzschild published a two-mirror telescope with two aspheric surfaces that is free of both spherical aberration and coma.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — coma, the comatic circles and the comet-shaped image.',
    'W. J. Smith, *Modern Optical Engineering* — coma, the sine condition and the aplanatic points.',
    'D. Schroeder, *Astronomical Optics* — coma of paraboloid and Cassegrain telescopes and their correctors.'
  ],
  sim: 'ab-coma'
},

/* ================================================================ astigmatism of lenses */
{
  id: 'astigmatism-of-lenses', parent: 'aberrations', title: 'Astigmatism', level: 2,
  short: 'Off the axis a lens seems foreshortened to the beam, and rays in the radial plane focus at a different distance from rays in the plane across it. A point becomes a short line on one side of the focus and a line at right angles on the other, with a circle between. It grows with aperture and the square of the field angle.',
  keywords: ['astigmatism', 'astigmatism of a lens', 'oblique astigmatism', 'tangential focus', 'sagittal focus', 'meridional', 'sagittal', 'astigmatic difference', 'circle of least confusion', 'Sturm conoid', 'focal lines', 'W222', 'anastigmat', 'seagull stars', 'MTF sagittal tangential'],
  prereq: ['what-aberrations-are', 'coma', 'chief-and-marginal-rays'],
  related: ['field-curvature', 'astigmatism-of-the-eye', 'cylindrical-and-toric-lenses', 'symmetry-and-the-stop', 'field-flatteners-and-petzval-sum', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'reading-mtf-charts', 'optical-disc-pickups', 'tessar'],
  body: `
Look at a lens from the side, as light from an off-axis point sees it. The round aperture is foreshortened into an ellipse, and the surfaces curve differently along the line to the axis than across it. A lens that treated both directions the same on axis therefore treats them differently off axis, and the image of a point is no longer one point. This is **astigmatism**, from the Greek for "without a point".

### The two planes and their foci
Take an object point off the axis. The **tangential plane** (also called meridional) contains that point, the chief ray and the axis. The **sagittal plane** contains the chief ray and is perpendicular to the tangential one. Rays in each plane focus at their own distance along the chief ray:

- the **tangential focus**, where the fan of rays in the radial plane comes together — there the image of the point is a short line running *around* the axis, perpendicular to the radius;
- the **sagittal focus**, a little farther along, where the fan across the radial plane comes together — a short line pointing *along* the radius, towards the centre of the picture;
- midway, the **circle of least confusion**: a round blur, the best compromise.

The pattern the rays make between the two foci is the Sturm conoid: line, ellipse, circle, ellipse, line — the line turns through a right angle as the focus passes from one position to the other.

### Size and scaling
For a thin lens with the stop at the lens, the distance between the two foci is, to third order,

$$z_S - z_T \\approx f\\,\\theta^2$$

with $\\theta$ the field angle in radians. It does not depend on the aperture or on the shape of the lens, only on the focal length and the *square* of the angle. Tracing a 100 mm singlet at 5°, 10°, 15° and 20° gives separations of 0.73, 2.8, 6.1 and 10 mm; the formula gives 0.76, 3.0, 6.9 and 12 mm. The width of the blur, however, does depend on the aperture: at the circle of least confusion it is about $\\Delta/(2N)$ wide, so it goes as aperture × field².

### Reading it
In a **spot diagram** the pattern turns from a line along one direction through a circle to a line along the other as the focus moves. In a **ray fan** the tangential and sagittal fans are two straight lines through the origin with different slopes; at the circle of least confusion the slopes are equal and opposite. On an **MTF chart**, the sagittal and tangential curves split apart towards the edge of the field: astigmatism is what the split means.

### Not the astigmatism of the eye
The two share a name but not a cause. The eye's astigmatism comes from a cornea or lens that is steeper in one meridian than another, so even a point on the axis focuses as two lines; a cylindrical spectacle lens corrects it ([[astigmatism-of-the-eye]]). Astigmatism of a lens is an *off-axis* error of a perfectly round, symmetric lens, zero on the axis. (A tilted or decentred lens does produce it on axis, which is why it shows up in misaligned systems.)

### Reducing it
Astigmatism and field curvature are linked at third order — the tangential surface lies three times as far from the Petzval surface as the sagittal one — so removing one without the other needs several elements ([[field-flatteners-and-petzval-sum]]). The position of the stop shifts the astigmatism, which is why simple lenses are designed with the stop away from the lens ([[symmetry-and-the-stop]]).

> [!key] Off axis, rays in the radial and the cross planes focus at different distances, giving two focal lines at right angles. The gap is about f θ² and grows as the square of the field angle; the blur grows with aperture × field².
`,
  ideas: [
    'Off axis the lens looks foreshortened, so rays in the radial (tangential) plane and in the cross (sagittal) plane focus at different distances.',
    'The image of a point is a line at the tangential focus, a perpendicular line at the sagittal focus and a circle (the circle of least confusion) between them.',
    'For a thin lens with the stop at the lens the gap between the foci is about f θ², independent of aperture and shape.',
    'The blur grows as aperture × field²: absent on axis, quadrupled by doubling the angle.',
    'It is not the astigmatism of the eye: that one is present on axis and comes from a cornea or lens of unequal curvature.'
  ],
  pitfalls: [
    'A lens with astigmatism has a cylindrical element — Astigmatism of a lens arises in perfectly round, rotationally symmetric optics, from oblique rays; no element is cylindrical.',
    'Astigmatism of a camera lens and of the eye are the same fault — The names agree, the causes do not. A camera lens has none on its axis; the eye\'s astigmatism is present at the centre of vision and is corrected by a cylindrical lens.',
    'Stopping down removes astigmatism — It reduces the blur, which is proportional to aperture, but the focal lines stay a distance fθ² apart: objects still appear sharper in one direction at one focus and in the other direction at another.',
    'Sagittal and tangential mean the same direction — They are at right angles. At a given focus a radial line may be sharp and a circumferential line blurred, or the reverse, and a good MTF chart shows both.'
  ],
  terms: [
    { term: 'Astigmatism (of a lens)', also: ['oblique astigmatism', 'W222', 'S_III'], def: 'An off-axis aberration in which rays in the tangential and sagittal planes focus at different distances along the chief ray, so a point is imaged as two perpendicular focal lines.' },
    { term: 'Tangential plane', also: ['meridional plane'], def: 'The plane that contains the off-axis object point, the chief ray and the optical axis. Rays in it form the tangential (or meridional) fan.' },
    { term: 'Sagittal plane', def: 'The plane that contains the chief ray and is perpendicular to the tangential plane. Rays in it form the sagittal fan.' },
    { term: 'Tangential focus', also: ['meridional focus', 'T focus'], def: 'Where the tangential rays come together. The image of a point there is a short line perpendicular to the radius of the picture.' },
    { term: 'Sagittal focus', also: ['S focus'], def: 'Where the sagittal rays come together. The image there is a short line along the radius of the picture.' },
    { term: 'Astigmatic difference', also: ['astigmatic focal difference', 'z_T − z_S'], def: 'The distance along the chief ray between the sagittal and tangential foci. About f θ² for a thin lens with its stop at the lens.' },
    { term: 'Circle of least confusion', also: ['medial focus'], def: 'For astigmatism: the round cross-section of the bundle midway between the two focal lines, about Δ/(2N) in diameter, where the blur is smallest in all directions.' }
  ],
  formulas: [
    {
      name: 'Astigmatic focal difference of a thin lens',
      expr: 'd = f*theta^2', tex: '\\Delta = f\\,\\theta^2',
      vars: {
        d: { name: 'distance between the tangential and sagittal foci', q: 'length', unit: 'mm', tex: '\\Delta' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 10, min: 0, max: 20, tex: '\\theta' }
      },
      note: 'Third order, a thin lens in air with the stop at the lens; good to about 20 % up to 15°.',
      stories: { d: 'A thin lens of focal length {f} images a point {theta} off axis. How far apart are its two astigmatic focal lines?', theta: 'The two focal lines of a {f} lens are {d} apart. At what field angle?' }
    },
    {
      name: 'Blur at the circle of least confusion',
      expr: 'b = d/(2*N)', tex: 'b = \\frac{\\Delta}{2N}',
      vars: {
        b: { name: 'diameter of the circle of least confusion', q: 'length', unit: 'µm' },
        d: { name: 'astigmatic difference', q: 'length', unit: 'mm', value: 3, tex: '\\Delta' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'Midway between the two focal lines each fan has spread to half its full width.',
      stories: { b: 'The two focal lines of an f/{N} lens are {d} apart. How wide is the smallest round blur?' }
    }
  ],
  examples: [
    {
      title: 'How far can a 50 mm singlet be used?',
      q: 'A thin 50 mm singlet with its stop at the lens works at f/4. What field angle gives a circle of least confusion of 20 µm, taking astigmatism alone?',
      steps: [
        { text: 'Combine the two formulas, $b = f\\theta^2/(2N)$, and solve for the angle:', tex: '\\theta = \\sqrt{\\frac{2Nb}{f}} = \\sqrt{\\frac{2 \\times 4 \\times 0.020\\ \\mathrm{mm}}{50\\ \\mathrm{mm}}} = 0.0566\\ \\mathrm{rad}' },
        'That is 3.2°, an image about 2.8 mm from the centre.'
      ],
      a: 'About ±3.2° — a field only 5.6 mm across. A photographic lens covers ±20° or more because several elements and the stop position cancel the astigmatism.'
    },
    {
      title: 'How far apart are the focal lines?',
      q: 'A 100 mm singlet images a star 10° off axis. How far apart are the two focal lines, and how wide is the smallest round blur at f/8?',
      steps: [
        { text: 'With $\\theta = 10° = 0.1745$ rad:', tex: '\\Delta = f\\,\\theta^2 = 100\\ \\mathrm{mm} \\times 0.03046 = 3.0\\ \\mathrm{mm}' },
        { text: 'The round blur midway:', tex: 'b = \\frac{\\Delta}{2N} = \\frac{3.0\\ \\mathrm{mm}}{16} = 0.19\\ \\mathrm{mm}' }
      ],
      a: 'About 3 mm (tracing gives 2.8 mm) and 190 µm — fifty pixels of 4 µm. A single lens cannot cover a field of 20° unless it is stopped far down.'
    }
  ],
  quiz: [
    { q: 'At the tangential focus of a lens, the image of an off-axis point is…', choices: ['a short line perpendicular to the radius of the picture', 'a short line along the radius of the picture', 'a round disc', 'a sharp point'], a: 0, why: 'The tangential rays (in the radial plane) are focused there; the sagittal rays are not yet focused, so the point is spread across the radius into a line running around the axis. At the sagittal focus the line points along the radius.' },
    { q: 'A point at 5° has an astigmatic difference of 1 mm. At 10°, the difference is about…', choices: ['2 mm', '4 mm', '8 mm', '1 mm'], a: 1, why: 'The difference goes as the square of the field angle, so doubling the angle quadruples it.' },
    { q: 'The astigmatism of a camera lens is corrected with a cylindrical lens, as in spectacles.', a: false, why: 'The two are different things. Lens astigmatism comes from oblique rays through round optics and is cancelled by the design of the lens; the eye\'s astigmatism comes from unequal curvature of the eye and is cancelled by a cylindrical spectacle lens.' },
    { q: 'A thin lens of 200 mm focal length images a point 5° off axis. What is the astigmatic difference, in millimetres?', answer: 1.52, unit: 'mm', why: '$\\Delta = f\\theta^2 = 200 \\times (0.08727)^2 = 1.52$ mm.' },
    { q: 'Between the tangential and the sagittal focus the image of a point is…', choices: ['a round blur, smallest at the midpoint', 'a single point', 'a ring', 'two points'], a: 0, why: 'The bundle changes from a line in one direction to a line at right angles, passing through a circle halfway — the circle of least confusion.' }
  ],
  applications: [
    'MTF charts of photographic lenses: the sagittal and tangential curves split towards the corners because of astigmatism; the gap is a measure of how astigmatic the lens is ([[reading-mtf-charts]]).',
    'Astrophotography: stars at the edge of the field become "seagulls" or short bars pointing at the centre of the picture, or arcs around it, depending on focus.',
    'Spectrometers: a spherical mirror used off axis in a Czerny–Turner monochromator makes the point image of the slit a line, lengthening the spot on the detector.',
    'Optical-disc pickups: a cylindrical lens in the return path turns defocus into a pair of focal lines, and the way the line turns tells the servo which way to move ([[optical-disc-pickups]]).',
    'Tilted plates in converging light: a window or a plate beam splitter at an angle in a focusing beam introduces astigmatism (and coma), which some systems cancel on purpose with a second plate tilted the other way.'
  ],
  history: 'The two focal lines of an oblique pencil were described by Henry Coddington in 1829, whose equations for the tangential and sagittal foci of a thin lens are still the starting point. Charles Sturm had studied the conoid of rays between the two lines in 1838. The aim of the "anastigmat" lenses of the 1890s — Zeiss\'s Protar among them — was to remove the astigmatism of the earlier landscape and rectilinear lenses at a wide aperture.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — astigmatism, tangential and sagittal foci and the circle of least confusion.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — astigmatism, the Sturm interval and the field curves, each on a page.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. — the sagittal and tangential focal surfaces of a thin lens and the effect of the stop.'
  ],
  sim: { id: 'ab-astig-field', params: { view: 'astig' } }
},

/* ================================================================ field curvature */
{
  id: 'field-curvature', parent: 'aberrations', title: 'Field curvature and the Petzval surface', level: 2,
  short: 'A lens focuses a flat object not onto a plane but onto a curved surface. A flat sensor can sit on it at the centre or at the edge, not both: sharp in the middle means soft corners, and refocusing swaps them. For a thin lens the surface has a radius of −n f, whatever the shape.',
  keywords: ['field curvature', 'curvature of field', 'Petzval', 'Petzval surface', 'Petzval sum', 'Petzval radius', 'flat field', 'focal surface', 'plan objective', 'field flattener', 'curved sensor', 'W220', 'S_IV', 'soft corners'],
  prereq: ['astigmatism-of-lenses', 'focal-length-and-optical-power', 'combining-thin-lenses'],
  related: ['field-flatteners-and-petzval-sum', 'petzval-lens', 'cooke-triplet', 'symmetry-and-the-stop', 'the-seidel-sums', 'depth-of-focus', 'microlenses-bsi-and-stacked-sensors', 'microscope-objectives', 'the-retina-rods-and-cones'],
  body: `
Photograph a flat wall, square on, with a simple lens. Focus on the middle and the corners are soft; refocus on the corners and the middle goes soft. The lens is not at fault in any simple sense: it forms its sharpest image not on a plane but on a curved surface, and the sensor is flat. This is **field curvature**.

### The Petzval surface
Joseph Petzval showed that, to third order, the images of the points of a flat object lie on a surface whose curvature is fixed by the *powers and indices of the lenses alone*. For $k$ thin lenses of focal length $f_i$ and index $n_i$ the **Petzval sum** is

$$P = \\sum_i \\frac{1}{n_i f_i}\\qquad\\text{and the radius is}\\qquad R_P = -\\frac{1}{P}$$

For a single thin lens, $R_P = -n\\,f$: for glass of $n = 1.52$ the surface curves back towards the lens with a radius of 1.5 focal lengths. Neither the shape of the lens nor the position of the stop changes this. At an image height $h$ the surface lies a distance

$$s = \\frac{h^2}{2\\,n\\,f}$$

in front of the plane through the paraxial focus. For $f = 100$ mm that is 1.0 mm at 10° (h = 17.6 mm) and 4.4 mm at 20°.

### Three surfaces, not one
Astigmatism splits the focus into a tangential and a sagittal surface, tied to the Petzval surface by $z_T - z_P = 3\\,(z_S - z_P)$. Where astigmatism is zero, the two coincide with the Petzval surface; where it is not, the designer chooses a *compromise*: T and S surfaces that are each curved but stay close to a common plane, giving an acceptably flat field although the Petzval surface is strongly curved. The triplet works this way: its Petzval radius is only $-2.6\\,f$, yet traced, its T and S foci stay within about half a millimetre of the paraxial plane out to 20°, for $f = 50$ mm.

| System (f = 100 mm scale) | Petzval radius | Sag at h = 20 mm |
|---|---|---|
| Single N-BK7 lens | −152 mm (−1.5 f) | 1.3 mm |
| Cemented achromat | −139 mm | 1.4 mm |
| Cooke triplet | −256 mm (−2.6 f) | 0.8 mm |
| Double Gauss | −625 mm (−6.3 f) | 0.32 mm |

### What the flat sensor needs
The sensor must lie within the depth of focus, ±2λN², of the focal surface: ±8.6 µm at f/2.8 in green light, ±34 µm at f/5.6. A sag of 1 mm at f/2.8 gives a blur of 0.36 mm — almost eighty pixels of 4.5 µm.

### Flattening the field
A positive lens has a positive Petzval sum; a negative lens a negative one, and the sum is independent of spacing. A flat field therefore needs positive *and* negative elements (a triplet, a Gauss) — or a strong negative lens close to the image, the **field flattener** (see [[field-flatteners-and-petzval-sum]]). A curved sensor does the same job, and so does the retina: the eye is a camera whose "film" is curved to suit its lens.

> [!key] A lens images a flat object onto a curved surface; for one thin lens the radius is −n f, independent of its shape. Flattening it takes positive and negative elements, a field flattener, or a curved sensor.
`,
  ideas: [
    'A lens forms its sharpest image on a curved surface, so a flat sensor cannot be in focus everywhere: edge and centre need different focus settings.',
    'To third order the Petzval surface depends only on powers and indices: R = −n f for one thin lens, whatever its shape or stop.',
    'The tangential and sagittal surfaces lie on the same side, three and one times as far from the Petzval surface; astigmatism and field curvature are two views of one effect.',
    'A flat field needs positive and negative elements, a field flattener or a curved sensor.',
    'The sensor has to lie within the depth of focus, ±2λN², so a fast lens needs a very flat field.'
  ],
  pitfalls: [
    'Field curvature is a blur, like spherical aberration — At each point the image is sharp, but on a curved surface. The blur appears only because the sensor is flat; a curved sensor would see none.',
    'Bending the lens or moving the stop flattens the field — Neither changes the Petzval sum. The shape and the stop change the astigmatism, so the tangential and sagittal surfaces move relative to the Petzval surface.',
    'A flat field means a flat Petzval surface — Not necessarily: a lens with a curved Petzval surface and the right amount of astigmatism has T and S surfaces that stay close to one plane, which is how triplets work.',
    'Field curvature gets worse when you stop down — The blur shrinks as N rises, but the focal surface does not move. Stopping down is the usual way to hide it, until diffraction takes over.'
  ],
  terms: [
    { term: 'Field curvature', also: ['curvature of field', 'W220', 'S_IV'], def: 'The aberration in which a flat object is imaged on a curved surface instead of a plane, so that a flat sensor cannot be in focus at the centre and at the edge together.' },
    { term: 'Petzval surface', also: ['Petzval field'], def: 'The curved surface, with radius R_P, on which the third-order image of a flat object lies when astigmatism is zero. It depends only on the powers and indices of the lenses.' },
    { term: 'Petzval sum', also: ['Petzval curvature', 'P'], def: 'P = Σ 1/(nᵢ fᵢ) over the thin lenses of a system: the curvature of the Petzval surface is −P. Positive lenses add to it and negative lenses subtract.' },
    { term: 'Petzval radius', also: ['R_P'], def: 'The radius of curvature of the Petzval surface, −1/P. For one thin lens in air it is −n f.' },
    { term: 'Field flattener', def: 'A negative lens placed close to the image plane that cancels the Petzval sum of the lens in front of it with little effect on the rest.' },
    { term: 'Flat-field lens', also: ['plan objective', 'planar lens'], def: 'A lens corrected so that its focal surface is flat over the field. Microscope objectives marked "Plan" are flat-field.' }
  ],
  formulas: [
    {
      name: 'Petzval radius of a thin lens',
      expr: 'R = n*f', tex: '|R_P| = n\\,f',
      vars: {
        R: { name: 'radius of the Petzval surface (magnitude; it curves towards the lens)', q: 'length', unit: 'mm', tex: 'R_P' },
        n: { name: 'refractive index of the lens', value: 1.52, min: 1, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A thin lens in air, positive. The sign of $R_P$ is negative: the centre of curvature is on the object side.',
      stories: { R: 'A thin lens of focal length {f} is made of glass of index {n}. What is the radius of its Petzval surface?' }
    },
    {
      name: 'Sag of the Petzval surface',
      expr: 's = h^2/(2*n*f)', tex: 's = \\frac{h^2}{2\\,n\\,f}',
      vars: {
        s: { name: 'distance of the surface in front of the paraxial image plane', q: 'length', unit: 'mm' },
        h: { name: 'image height', q: 'length', unit: 'mm', value: 17.6 },
        n: { name: 'refractive index of the lens', value: 1.52, min: 1, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Third order; h is the distance from the axis in the image plane.',
      stories: { s: 'A thin lens of focal length {f} and index {n} forms an image {h} from the axis. How far in front of the flat image plane does its Petzval surface lie?', h: 'The Petzval surface of a {f} lens of index {n} lies {s} in front of the plane at some point of the image. How far off axis?' }
    },
    {
      name: 'Blur at the edge of a flat sensor',
      expr: 'b = s/N', tex: 'b = \\frac{s}{N}',
      vars: {
        b: { name: 'diameter of the blur circle at the edge', q: 'length', unit: 'µm' },
        s: { name: 'distance of the focal surface from the sensor', q: 'length', unit: 'mm', value: 0.5 },
        N: { name: 'f-number', value: 2.8, min: 0.5, max: 64 }
      },
      note: 'With the centre of the picture in focus. The same relation as for any focus error.'
    },
    {
      name: 'Petzval sum of two thin lenses',
      expr: 'P = 1/(n1*f1) + 1/(n2*f2)', tex: 'P = \\frac{1}{n_1 f_1} + \\frac{1}{n_2 f_2}',
      vars: {
        P: { name: 'Petzval sum', q: 'optpower', unit: 'D', signed: true },
        n1: { name: 'index of lens 1', value: 1.62, min: 1, max: 4 },
        f1: { name: 'focal length of lens 1', q: 'length', unit: 'mm', value: 60, signed: true },
        n2: { name: 'index of lens 2', value: 1.52, min: 1, max: 4 },
        f2: { name: 'focal length of lens 2', q: 'length', unit: 'mm', value: -100, signed: true }
      },
      note: 'Independent of the spacing and of the stop. P = 0 means a flat Petzval field: n₁f₁ = −n₂f₂.',
      stories: { P: 'A positive lens of f = {f1} and index {n1} and a negative lens of f = {f2} and index {n2} are combined. What is the Petzval sum? The radius of the surface is −1/P.' }
    }
  ],
  examples: [
    {
      title: 'The corner of a full-frame sensor',
      q: 'A thin 50 mm lens of index 1.52 images a flat wall onto a full-frame sensor, whose half-diagonal is 21.6 mm. The centre is in focus. How far is the Petzval surface from the sensor at the corner, and how big is the blur at f/4?',
      steps: [
        { text: 'The sag:', tex: 's = \\frac{h^2}{2nf} = \\frac{(21.6)^2}{2 \\times 1.52 \\times 50} = 3.07\\ \\mathrm{mm}' },
        { text: 'The blur circle at the corner:', tex: 'b = \\frac{s}{N} = \\frac{3.07\\ \\mathrm{mm}}{4} = 0.77\\ \\mathrm{mm}' }
      ],
      a: '3.1 mm and 0.77 mm — 170 pixels of 4.5 µm. A single lens cannot cover a full-frame sensor; it takes at least three elements, with positive and negative power, to bring the Petzval sum and the astigmatism down together.'
    },
    {
      title: 'A flat Petzval sum from two lenses',
      q: 'A positive lens of focal length 60 mm and index 1.62 is combined with a negative lens of index 1.52. What focal length must the negative lens have for the Petzval sum to vanish?',
      steps: [
        { text: 'Set $P = 0$:', tex: '\\frac{1}{n_1 f_1} + \\frac{1}{n_2 f_2} = 0 \\;\\Rightarrow\\; f_2 = -\\frac{n_1 f_1}{n_2} = -\\frac{1.62 \\times 60}{1.52}' },
        'That is $f_2 = -63.9$ mm.'
      ],
      a: '−64 mm. The two powers nearly cancel, so the pair would have almost no net power unless the lenses are separated — the reason a flat-field lens such as a triplet needs air gaps.'
    }
  ],
  quiz: [
    { q: 'Which of these changes the Petzval sum of a thin lens?', choices: ['Its refractive index', 'Its shape (bending)', 'The position of the stop', 'The aperture'], a: 0, why: 'The Petzval sum of a thin lens is $1/(nf)$: it depends on the index and the focal length. Bending the lens or moving the stop changes the astigmatism but not the Petzval surface.' },
    { q: 'For a thin lens of focal length 100 mm and index 1.5, what is the radius of the Petzval surface, in millimetres?', answer: 150, unit: 'mm', why: '$|R_P| = nf = 1.5 \\times 100 = 150$ mm, curving towards the lens.' },
    { q: 'A lens with field curvature gives a sharp image at the centre and soft corners. Focusing on the corners makes the centre soft.', a: true, why: 'The sharp image lies on a curved surface; a flat sensor touches it at one zone and misses it elsewhere. Moving the sensor moves the zone of best focus.' },
    { q: 'What will flatten the field of a positive lens?', choices: ['A negative lens near the image', 'A smaller aperture only', 'Bending the lens to a meniscus without any extra element', 'A longer exposure'], a: 0, why: 'A negative lens near the image contributes a negative Petzval sum with little effect on other aberrations. Stopping down hides the blur but does not flatten the surface; bending the lens does not change the Petzval sum.' },
    { q: 'Why can a triplet be flat-field although its Petzval surface is curved?', choices: ['Its tangential and sagittal surfaces, which differ from the Petzval surface, stay close to one plane', 'The triplet has no Petzval sum', 'The stop removes the curvature', 'Its glasses have the same index'], a: 0, why: 'The designer adjusts the astigmatism so that the T and S foci lie near a common plane; the image is then acceptably sharp on a flat sensor even though the Petzval surface curves. The price is residual astigmatism.' }
  ],
  applications: [
    'Photographic lenses: "flat-field" lenses for copying, scanning and repro work; modern wide-aperture designs keep the T and S curves within the depth of focus.',
    'Microscope objectives: the "Plan" in Plan-Apochromat and Plan-Fluor means that the field is flattened by extra meniscus lenses, so that a whole camera frame is sharp.',
    'Astrographs: wide-field telescopes carry a field flattener ahead of a flat sensor to keep the stars at the corners round.',
    'Phones and sensors: a curved focal surface is one of the reasons for many-element moulded lenses; curved sensors are being developed to simplify them.',
    'The eye: the retina is curved, which makes the human eye\'s focal surface fit, with no flattening elements at all.'
  ],
  history: 'Joseph Petzval, a Hungarian mathematician in Vienna, designed the first portrait lens in 1840, with an aperture of about f/3.6 that cut exposure from minutes to seconds. He also found that the field curvature of a combination of thin lenses depends only on the powers and indices — the Petzval theorem. His lens had a sharp centre and a strongly curved field, which the portraitists, who photographed faces on the axis, did not mind.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the Petzval sum and the field curves of thin lenses.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. — Petzval curvature and the three focal surfaces.',
    'E. Hecht, *Optics*, ch. 6 — curvature of field.'
  ],
  sim: { id: 'ab-astig-field', params: { view: 'field' } }
},

/* ================================================================ distortion */
{
  id: 'distortion', parent: 'aberrations', title: 'Distortion: barrel and pincushion', level: 1,
  short: 'A lens may place every point sharply — but not at the right distance from the centre. If the magnification falls with distance from the axis, straight lines bow outwards like a barrel; if it rises, they bow inwards like a pincushion. Distortion does not blur, and it is the one aberration that software can remove.',
  keywords: ['distortion', 'barrel distortion', 'pincushion distortion', 'moustache distortion', 'wavy distortion', 'rectilinear', 'TV distortion', 'radial distortion', 'W311', 'S_V', 'lens correction', 'fisheye', 'straight lines bend', 'architecture'],
  prereq: ['what-aberrations-are', 'field-of-view-and-focal-length', 'chief-and-marginal-rays'],
  related: ['lens-distortion-and-calibration', 'symmetry-and-the-stop', 'fisheye-lenses', 'projections:rectilinear-lens', 'the-seidel-sums', 'telecentric-lenses', 'projections:camera-calibration-and-homography', 'virtual-and-augmented-reality-headsets', 'projections:fisheye-projections'],
  body: `
Photograph a building with a wide-angle zoom and the verticals near the edges lean and bow; photograph a graph paper with a long telephoto lens and the lines may curve the other way. Nothing is out of focus — a pin-sharp image can have both defects. This is **distortion**: points are imaged where they ought not to be, in proportion to their distance from the centre.

### What it is
An ideal (*rectilinear*) lens maps a direction $\\theta$ off the axis to an image height $y = f\\tan\\theta$. A real lens maps it to $y'$. The distortion is the relative difference,

$$D = \\frac{y' - f\\tan\\theta}{f\\tan\\theta}\\times 100\\ \\%$$

- **Barrel** ($D < 0$): the magnification falls with distance from the centre, so the corners are pulled in and straight lines bow outwards like the staves of a barrel.
- **Pincushion** ($D > 0$): the magnification rises, the corners are pushed out, and lines bow towards the centre.
- **Moustache** (wavy): a mixture, barrel near the centre turning to pincushion at the edge, produced by the higher-order terms.

Third-order distortion goes as the *cube* of the field: the percentage as the square. A lens with 1 % at 10° has about 4 % at 20°.

### Where it comes from
It comes from how the chief ray crosses the lens. A lens bends a ray more the farther from its centre the ray strikes (spherical aberration, the same effect), and the chief ray, passing through the stop, strikes the lens farther from its centre the farther the stop is away. So **the stop position decides**. For a 100 mm singlet:

| Field angle | stop 30 mm in front | stop at the lens | stop 15 mm behind |
|---|---|---|---|
| 5° | −0.32 % | −0.03 % | +0.35 % |
| 10° | −1.3 % | −0.12 % | +1.5 % |
| 15° | −3.0 % | −0.28 % | +3.6 % |
| 20° | −5.6 % | −0.52 % | +7.4 % |

A stop in front of a positive lens gives barrel, a stop behind it pincushion. Put the stop in the middle of a symmetrical lens and the two halves cancel: a double Gauss traced to 14° has −0.9 %, a Cooke triplet has less than 0.1 % at 20°. In a zoom lens the stop moves relative to the groups as it zooms, so the distortion changes sign: barrel at the wide end and a little pincushion at the long end are typical, of the order of a few per cent before correction.

### It does not blur
Every point is imaged sharply, so a distorted image can be restored by moving the pixels back: a radial remap. Cameras do it with a stored profile of the lens, and calibration finds the profile of an unknown one ([[lens-distortion-and-calibration]]). For a measuring camera, the same fact matters in numbers: 1 % distortion at an image height of 10 mm is a 100 µm displacement, 20 pixels of 5 µm.

### Deliberate distortion
A fisheye lens drops the rectilinear rule on purpose. An equidistant fisheye maps $y = f\\theta$, which differs from $f\\tan\\theta$ by $\\theta/\\tan\\theta - 1$: −9 % at 30°, −39 % at 60° — and it can show 180° or more, which a rectilinear lens cannot ([[fisheye-lenses]]).

> [!key] Distortion is a change of magnification with field: barrel if it falls, pincushion if it rises. It moves points without blurring them, depends on the stop position, grows as field³ — and can be corrected by software.
`,
  ideas: [
    'Distortion D = (y′ − f tan θ)/(f tan θ): the error in the image height, as a percentage of the ideal one.',
    'Negative is barrel (magnification falls outwards), positive pincushion; complex lenses may show a mixture, the moustache.',
    'The image stays sharp: distortion moves points, it does not spread them, and so it can be remapped in software.',
    'At third order the image-height error goes as θ³, the percentage as θ².',
    'It depends on the stop position: in front of a positive lens barrel, behind it pincushion, in the middle of a symmetric lens almost none.'
  ],
  pitfalls: [
    'Distortion is a kind of blur or softness — The image is sharp. Each point is a point; it is only in the wrong place, so straight lines bend.',
    'A wide-angle lens is always barrel and a telephoto always pincushion — Wide-angle zooms often are, but the sign depends on the design and the stop, and primes with symmetric forms may have almost none.',
    'Software correction makes the lens perfect — It restores the geometry at the cost of stretching pixels (and cropping) at the corners, and cannot restore the sharpness lost to other aberrations.',
    'Distortion is the same as perspective — Perspective follows from where you stand and is the same for any lens that is rectilinear. Distortion is a property of the lens that bends the lines.'
  ],
  terms: [
    { term: 'Distortion', also: ['W311', 'S_V', 'radial distortion'], def: 'The aberration in which the image height y′ differs from the ideal f tan θ by an amount that depends on the field. Points are sharp but misplaced, so straight lines bend.' },
    { term: 'Barrel distortion', def: 'Negative distortion: magnification falls with distance from the axis, so the image of a square bulges outwards like a barrel.' },
    { term: 'Pincushion distortion', def: 'Positive distortion: magnification rises with distance from the axis, so the sides of a square bow inwards towards the centre.' },
    { term: 'Moustache distortion', also: ['wavy distortion', 'complex distortion'], def: 'A mixture of barrel near the centre and pincushion towards the edge (or the reverse), caused by higher orders of distortion.' },
    { term: 'Rectilinear lens', def: 'A lens free of distortion, which images straight lines as straight lines: y = f tan θ.' },
    { term: 'TV distortion', def: 'A figure that measures the bowing of a straight line at the edge of the picture as a percentage of the picture height. It is not the same number as the distortion at the corner, so check which one a datasheet quotes.' }
  ],
  formulas: [
    {
      name: 'Distortion',
      expr: 'D = (yp - f*tan(theta))/(f*tan(theta))', tex: 'D = \\frac{y\' - f\\tan\\theta}{f\\tan\\theta}',
      vars: {
        D: { name: 'distortion (negative: barrel)', q: 'ratio', unit: '%', signed: true },
        yp: { name: 'real image height', q: 'length', unit: 'mm', value: 17.2, tex: 'y\'' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 10, min: 1, max: 60, tex: '\\theta' }
      },
      note: 'Compare the real image height with the rectilinear one, f tan θ = 17.63 mm for the defaults.',
      stories: { D: 'A {f} lens images a point {theta} off axis at a height of {yp} from the axis. What is the distortion?' }
    },
    {
      name: 'Equidistant fisheye against a rectilinear lens',
      expr: 'D = theta/tan(theta) - 1', tex: 'D = \\frac{\\theta}{\\tan\\theta} - 1',
      vars: {
        D: { name: 'distortion relative to a rectilinear lens', q: 'ratio', unit: '%', signed: true },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 60, min: 1, max: 85, tex: '\\theta' }
      },
      note: 'For y = fθ against y = f tan θ. It is not a fault: it is the price of a hemispherical field.',
      stories: { D: 'An equidistant fisheye maps y = fθ. How far does it depart from a rectilinear lens {theta} off axis?' }
    },
    {
      name: 'Distortion of the second angle from the first (third order)',
      expr: 'D2 = D1*(t2/t1)^2', tex: 'D_2 = D_1\\left(\\frac{\\theta_2}{\\theta_1}\\right)^{2}',
      vars: {
        D2: { name: 'distortion at the second angle', q: 'ratio', unit: '%', signed: true },
        D1: { name: 'distortion at the first angle', q: 'ratio', unit: '%', value: -1, signed: true },
        t1: { name: 'first field angle', q: 'angle', unit: '°', value: 10, min: 0.5, max: 40, tex: '\\theta_1' },
        t2: { name: 'second field angle', q: 'angle', unit: '°', value: 20, min: 0.5, max: 40, tex: '\\theta_2' }
      },
      note: 'Valid while the third-order term dominates (below about 20°).'
    },
    {
      name: 'Displacement in pixels',
      expr: 'px = D*y/p', tex: 'n_{\\mathrm{px}} = \\frac{D\\,y}{p}',
      vars: {
        px: { name: 'displacement of the image point, in pixels', signed: true, tex: 'n_{\\mathrm{px}}' },
        D: { name: 'distortion', q: 'ratio', unit: '%', value: -1, signed: true },
        y: { name: 'distance from the centre, on the sensor', q: 'length', unit: 'mm', value: 10 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5 }
      },
      note: 'How far a point is moved towards (−) or away from (+) the centre.',
      stories: { px: 'A lens has {D} distortion. A point lands {y} from the centre of a sensor of {p} pixels. How many pixels is it displaced?' }
    }
  ],
  examples: [
    {
      title: 'A singlet with its stop in front',
      q: 'A 100 mm singlet has its stop 30 mm in front of it. A point 20° off axis lands at $y\' = 34.4$ mm, whereas $f\\tan 20° = 36.4$ mm. What is the distortion, and what kind?',
      steps: [
        { text: 'Apply the definition:', tex: 'D = \\frac{34.4 - 36.4}{36.4} = -5.5\\,\\%' },
        'Negative: the image is closer to the axis than the rectilinear position — barrel distortion.'
      ],
      a: 'About −5.5 % (the full ray trace gives −5.6 %): barrel distortion, as expected of a stop in front of a positive lens. Moving the stop to the lens reduces it to −0.5 %.'
    },
    {
      title: 'How far does a fisheye depart?',
      q: 'An equidistant fisheye lens ($y = f\\theta$) images a point 45° off axis. By what percentage is its image height smaller than a rectilinear lens of the same focal length would give?',
      steps: [
        { text: 'The ratio of the two heights:', tex: '\\frac{f\\theta}{f\\tan\\theta} = \\frac{0.7854}{1.0000} = 0.785' },
        'So the distortion is 0.785 − 1 = −21.5 %.'
      ],
      a: '−21.5 %. At 60° it is −39 %, and at 90° a rectilinear lens would need an infinite image: hence a fisheye can cover 180°.'
    }
  ],
  quiz: [
    { q: 'A square grid is imaged with its sides bulging outwards. This is…', choices: ['barrel distortion', 'pincushion distortion', 'coma', 'field curvature'], a: 0, why: 'Bulging outwards like the staves of a barrel means that the corners are pulled in relative to the middle: the magnification falls with distance from the axis. That is negative distortion.' },
    { q: 'Distortion is 2 % at a field angle of 10°. Third-order theory suggests that at 20° it will be about…', choices: ['4 %', '8 %', '16 %', '2 %'], a: 1, why: 'The percentage goes as the square of the field angle (the displacement as the cube). Doubling the angle quadruples it: 8 %.' },
    { q: 'A purely distorted image is sharp everywhere.', a: true, why: 'Distortion changes the position of each point, not its size. Points are imaged as points, which is why a radial remap can correct it.' },
    { q: 'An equidistant fisheye lens images a point 30° off axis. How far does it depart from a rectilinear lens, in percent?', answer: -9.3, unit: '%', why: '$\\theta/\\tan\\theta - 1 = 0.5236/0.5774 - 1 = -0.093$, that is −9.3 %.' },
    { q: 'A positive singlet is used with its stop in front of it. The distortion is…', choices: ['barrel', 'pincushion', 'zero', 'moustache'], a: 0, why: 'The chief ray strikes the lens off centre, below the paraxial rays\' bending, so the magnification falls towards the edge. Putting the stop behind the lens gives pincushion; at the lens, almost none.' }
  ],
  applications: [
    'Architectural and product photography: shift lenses and rectilinear designs with less than 1 % distortion keep verticals straight.',
    'Machine-vision measurement: distortion shifts a measured edge by a position-dependent amount, so a lens is chosen for low distortion (telecentric lenses are offered with 0.1 % or less) or the camera is calibrated.',
    'Smartphone and action cameras: a wide field from a short lens is distorted on purpose and corrected in software, which is why the edges of the picture are slightly stretched.',
    'Virtual-reality headsets: the eyepiece lenses make a pincushion distortion, so the display is drawn with the opposite barrel distortion to cancel it ([[virtual-and-augmented-reality-headsets]]).',
    'Surveying and photogrammetry: metric cameras are calibrated to a few micrometres across the image so that distances measured from pictures are trustworthy.'
  ],
  history: 'The first photographic lenses showed marked barrel or pincushion distortion, and Dallmeyer\'s Rapid Rectilinear and Steinheil\'s Aplanat of 1866 were named for curing it by making the lens two matched, symmetrical halves about the stop. A symmetric lens used at unit magnification has no distortion at all, and the double Gauss and its descendants are built on the same principle.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — distortion, pincushion and barrel.',
    'W. J. Smith, *Modern Optical Engineering* — distortion and the effect of the stop position.',
    'ISO 9039, *Optics and photonics — Quality evaluation of optical systems — Determination of distortion* — how distortion is defined and measured.'
  ],
  sim: 'ab-distortion'
},

/* ================================================================ axial chromatic aberration */
{
  id: 'axial-chromatic-aberration', parent: 'aberrations', title: 'Axial chromatic aberration', level: 1,
  short: 'Glass bends blue light more than red, so a simple lens has a different focal length for every colour: blue focuses nearest the lens, red farthest. A point of white light becomes a series of coloured foci along the axis and a coloured halo at any plane. The shift is f/V — about 1.6 % of the focal length for ordinary crown glass.',
  keywords: ['axial chromatic aberration', 'longitudinal chromatic aberration', 'LCA', 'axial colour', 'chromatic aberration', 'colour fringing', 'purple fringing', 'secondary spectrum', 'focal shift', 'Abbe number', 'f/V', 'achromat', 'apochromat', 'C1'],
  prereq: ['what-aberrations-are', 'dispersion-and-the-spectrum', 'the-abbe-number-and-glass-map'],
  related: ['lateral-chromatic-aberration', 'achromatic-doublet', 'apochromats-and-ed-glass', 'optical-glass', 'the-seidel-sums', 'refracting-telescopes', 'colour-and-multispectral-imaging', 'spherical-aberration'],
  body: `
Newton's prism spread white light into a spectrum because glass bends each colour by a different amount: blue more than red. A lens is two prisms' worth of refraction at every surface, so a single lens of glass has a **focal length that depends on the colour** of the light. Blue light is focused closest to the lens, red farthest, with green and yellow between. That spread of foci along the axis is **axial** (or longitudinal) **chromatic aberration**, the failure of a lens to bring all the colours to one focus.

### What the eye or sensor sees
Focus a singlet on green and the blue and red are both out of focus: the image of a bright point is a sharp green core inside a purple (blue plus red) halo. Move the sensor towards the lens, in front of all the foci, and the rim of the blur turns red (the red focus is farthest away and its cone widest); move it behind them and the rim turns blue. The result is soft edges, a milky loss of contrast, and the colour fringes on high-contrast edges often called **purple fringing**. The colour of the fringe swaps on the two sides of the focus, which tells it apart from lateral colour.

### How large: f/V
For a thin lens of focal length $f$ made of glass of Abbe number $V$ (see [[the-abbe-number-and-glass-map]]), the distance between the foci of the blue F line (486 nm) and the red C line (656 nm) is

$$\\Delta f = \\frac{f}{V}$$

| Glass | Abbe number V | F–C shift, f = 100 mm |
|---|---|---|
| Calcium fluoride | 95 | 1.05 mm |
| Low-dispersion crown N-FK51A | 84.5 | 1.18 mm |
| Fused silica | 67.8 | 1.47 mm |
| Borosilicate crown N-BK7 | 64.2 | 1.56 mm |
| Acrylic (PMMA) | 57.4 | 1.74 mm |
| Polycarbonate | 29.9 | 3.3 mm |
| Dense flint N-SF11 | 25.7 | 3.9 mm |

A lens is *worse* with a high-index flint than a crown, and plastics are worse than glass. Ray tracing agrees to within about 2 %. The shift is independent of the shape of the lens, and — unlike spherical aberration — does not depend on the field.

### The blur it makes
Between the blue and red foci, at the plane midway, the cone of rays has a diameter

$$b \\approx \\frac{D}{2V}$$

for an aperture of diameter $D$. It depends on the *aperture*, not on the focal length: a 25 mm aperture of N-BK7 gives 0.19 mm, whatever its focal length. The colour blur is proportional to $D$, so halving the aperture halves it — far less effective than for spherical aberration.

### Secondary spectrum
A pair of glasses can bring two colours to the same focus ([[achromatic-doublet]]), but the others do not follow. A BK7–SF5 doublet of $f = 100$ mm has the same focus for F and C, yet the yellow d-line focus lies 0.05 mm away and the 400 nm focus about 0.6 mm. This residual, the **secondary spectrum**, is of the order of $f/2000$ for ordinary glass pairs and can be cut only with special glasses ([[apochromats-and-ed-glass]]). A mirror has none: reflection does not depend on wavelength.

> [!key] A simple lens focuses blue nearer than red, by f/V — 1.6 % of the focal length for crown glass. The colour blur is D/(2V), independent of the field. A doublet cancels it for two colours; the residual is the secondary spectrum.
`,
  ideas: [
    'The index of glass falls with wavelength, so blue focuses nearer a positive lens than red: the focal length is different for each colour.',
    'The F–C focal shift of a thin lens is f/V, independent of its shape; V is 64 for N-BK7 and 26 for dense flint.',
    'The colour blur is about D/(2V): proportional to the aperture, independent of the focal length and of the field.',
    'Two glasses cancel it for two colours; the residual that remains, the secondary spectrum, is about f/2000.',
    'Mirrors have no chromatic aberration; that is one reason large telescopes are reflectors.'
  ],
  pitfalls: [
    'Chromatic aberration is a defect of cheap glass — Every lens of one glass has it, in proportion to the dispersion of that glass. Only combining glasses (or using mirrors) removes it.',
    'Stopping down cures colour fringing as it cures spherical aberration — The colour blur goes only as the aperture: closing from f/4 to f/8 halves it, where spherical aberration would fall to an eighth.',
    'Axial and lateral chromatic aberration are the same effect — Axial colour is a difference of focus, present on axis and blurring; lateral colour is a difference of magnification, growing with field and shifting the colours sideways.',
    'Monochrome sensors do not see it — A monochrome camera in broadband light records the sum of all the colours, each in or out of focus, and the image is soft. Narrow-band light removes it.'
  ],
  terms: [
    { term: 'Axial chromatic aberration', also: ['longitudinal chromatic aberration', 'LCA', 'axial colour', 'C1', 'primary axial colour'], def: 'The variation of focal length (and image position along the axis) with wavelength, caused by the dispersion of the glass. A simple positive lens focuses blue nearer than red.' },
    { term: 'Chromatic aberration', also: ['CA', 'colour error'], def: 'Any aberration caused by the dependence of the refractive index on wavelength: axial colour (a difference of focus) and lateral colour (a difference of magnification).' },
    { term: 'Abbe number', also: ['V', 'ν_d', 'V-number', 'constringence'], def: 'V = (n_d − 1)/(n_F − n_C): a measure of how little a glass disperses. Crown glasses have V of 55–85, flints 20–40. The F–C shift of a thin lens is f/V.' },
    { term: 'Secondary spectrum', also: ['residual colour', 'secondary colour'], def: 'The chromatic aberration left in an achromatic doublet, in which two colours share a focus but the intermediate and extreme ones do not. About f/2000 for ordinary glass pairs.' },
    { term: 'Purple fringing', also: ['colour fringing'], def: 'The purple or green halo along high-contrast edges caused by axial colour: the in-focus colour is sharp while blue and red are blurred. Also used loosely for lateral colour and sensor effects.' }
  ],
  formulas: [
    {
      name: 'Axial colour of a thin lens',
      expr: 'df = f/V', tex: '\\Delta f = \\frac{f}{V}',
      vars: {
        df: { name: 'distance between the F and C foci', q: 'length', unit: 'mm', tex: '\\Delta f' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        V: { name: 'Abbe number of the glass', value: 64.2, min: 10, max: 120 }
      },
      note: 'Thin lens in air. The blue focus is the nearer one.',
      stories: { df: 'A thin lens of focal length {f} is made of glass of Abbe number {V}. How far apart are its F and C foci?', V: 'A {f} thin lens has an F–C focal shift of {df}. What Abbe number does its glass have?' }
    },
    {
      name: 'Colour blur midway between the foci',
      expr: 'b = D/(2*V)', tex: 'b = \\frac{D}{2\\,V}',
      vars: {
        b: { name: 'diameter of the colour blur, midway between the F and C foci', q: 'length', unit: 'µm' },
        D: { name: 'aperture diameter', q: 'length', unit: 'mm', value: 25 },
        V: { name: 'Abbe number of the glass', value: 64.2, min: 10, max: 120 }
      },
      note: 'The cone has a diameter of 1/N of its distance from the focus: (f/V)/2 ÷ N = D/(2V).'
    },
    {
      name: 'Two thin lenses in contact',
      expr: 'dz = (P1/V1 + P2/V2)/(P1 + P2)^2', tex: '\\Delta z = \\frac{P_1/V_1 + P_2/V_2}{(P_1 + P_2)^2}',
      vars: {
        dz: { name: 'F–C focal shift of the pair', q: 'length', unit: 'mm', signed: true, tex: '\\Delta z' },
        P1: { name: 'power of lens 1', q: 'optpower', unit: 'D', value: 20, signed: true, tex: 'P_1' },
        V1: { name: 'Abbe number of lens 1', value: 64.2, min: 10, max: 120 },
        P2: { name: 'power of lens 2', q: 'optpower', unit: 'D', value: -10, signed: true, tex: 'P_2' },
        V2: { name: 'Abbe number of lens 2', value: 32.25, min: 10, max: 120 }
      },
      note: 'Zero when P₁/V₁ + P₂/V₂ = 0: the condition for an achromat, the subject of the next topic. The defaults are close to a BK7–SF5 doublet of f = 100 mm.',
      stories: { dz: 'A crown lens of {P1} and V = {V1} is cemented to a flint lens of {P2} and V = {V2}. How far apart are the F and C foci of the pair?' }
    }
  ],
  examples: [
    {
      title: 'A telescope objective of one glass',
      q: 'A simple refractor has a single N-BK7 objective of 100 mm aperture and 1000 mm focal length (f/10). How far apart are the foci of blue (F) and red (C) light, and how wide is the colour blur midway?',
      steps: [
        { text: 'The shift:', tex: '\\Delta f = \\frac{f}{V} = \\frac{1000\\ \\mathrm{mm}}{64.2} = 15.6\\ \\mathrm{mm}' },
        { text: 'The blur midway:', tex: 'b = \\frac{D}{2V} = \\frac{100\\ \\mathrm{mm}}{2 \\times 64.2} = 0.78\\ \\mathrm{mm}' }
      ],
      a: '15.6 mm between the foci and a 0.78 mm blur — a violet halo round every bright star, which is why the long refractors of the seventeenth century were built at f/50 and longer, where D/(2V) shrinks.'
    },
    {
      title: 'Changing the glass',
      q: 'A 100 mm lens of aperture 25 mm is made first of N-BK7, then of calcium fluoride (V = 95). By what factor does the colour blur change?',
      steps: [
        { text: 'The blur is $D/(2V)$ for both:', tex: 'b_{\\mathrm{BK7}} = \\frac{25}{2 \\times 64.2} = 0.195\\ \\mathrm{mm}\\qquad b_{\\mathrm{CaF_2}} = \\frac{25}{2 \\times 95} = 0.132\\ \\mathrm{mm}' },
        'The ratio is 64.2/95 = 0.68.'
      ],
      a: 'It falls by about a third. A better single glass helps, but only a pair of glasses makes the large improvement an achromat gives.'
    }
  ],
  quiz: [
    { q: 'A positive singlet of N-BK7 focuses…', choices: ['blue nearer the lens than red', 'red nearer the lens than blue', 'all colours at the same point', 'only green'], a: 0, why: 'The index is higher for blue, so each surface bends it more and it is focused closer to the lens. Red has the longest focal length.' },
    { q: 'A thin lens of f = 250 mm is made of glass with V = 50. How far apart are the F and C foci, in millimetres?', answer: 5, unit: 'mm', why: '$\\Delta f = f/V = 250/50 = 5$ mm.' },
    { q: 'Axial chromatic aberration grows towards the edge of the field.', a: false, why: 'It is the same at every point of the field: a difference of focus. The aberration that grows with field is lateral colour, a difference of magnification.' },
    { q: 'Changing from N-BK7 (V = 64) to dense flint (V = 26) at the same focal length makes the axial colour…', choices: ['about 2.5 times larger', 'about 2.5 times smaller', 'unchanged', 'zero'], a: 0, why: '$\\Delta f = f/V$: 64/26 = 2.5. Flint glasses disperse strongly, so a flint singlet has far more axial colour than a crown one.' },
    { q: 'Why does a mirror telescope have no chromatic aberration?', choices: ['Reflection does not depend on the wavelength', 'Mirrors are made of metal', 'The mirror is parabolic', 'The light does not pass through glass'], a: 0, why: 'The law of reflection has no index in it, so every colour is reflected through the same angle. The curve of a paraboloid removes spherical aberration, not colour. (A glass-backed mirror reflects at its front or silvered face, and the glass plays no optical part.)' }
  ],
  applications: [
    'Refracting telescopes and binoculars: an achromatic or apochromatic objective, with ED or fluorite glass, keeps stars free of coloured haloes.',
    'Machine vision: a lens focused with visible light is out of focus in near-infrared — colour is a difference of focus, so IR-corrected lenses or a focus shift are needed.',
    'Chromatic confocal sensors measure distance by exploiting axial colour on purpose: each wavelength is focused at its own height and the spectrum of the returned light reads the surface position.',
    'Laser systems: with a single wavelength, axial colour does not matter, but a laser and its tracking diode at different wavelengths focus at different places, and tunable or ultrafast sources need achromatic focusing.',
    'Photography: the green and magenta fringes behind and in front of the plane of focus in a wide-aperture portrait lens are axial colour ("bokeh fringing").'
  ],
  history: 'Newton, testing prisms in 1666, concluded that colour was inseparable from refraction, mistakenly judged achromatic lenses impossible and built a reflecting telescope in 1668. Chester Moor Hall made an achromatic doublet of crown and flint around 1733 but did not publish. John Dollond rediscovered it, and patented it in 1758. Before then telescope makers used enormous focal lengths: Hevelius\'s aerial telescopes at Gdańsk were up to 45 m long.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — the section on chromatic aberration.',
    'W. J. Smith, *Modern Optical Engineering* — axial colour, the Abbe number and the secondary spectrum.',
    'R. Kingslake, *Lens Design Fundamentals* — chromatic aberration of a thin lens and of a doublet.',
    'R. Kingslake, *A History of the Photographic Lens* (Academic Press, 1989) — the story of the achromatic lens.'
  ],
  sim: 'ab-axial-colour'
},

/* ================================================================ lateral chromatic aberration */
{
  id: 'lateral-chromatic-aberration', parent: 'aberrations', title: 'Lateral chromatic aberration', level: 2,
  short: 'Off the axis, the colours of a point land at different heights: the image is a little larger in red than in blue. The fringes are zero at the centre, grow in proportion to the distance from it and point along the radius. The size does not depend on the aperture, and because it is a radial rescaling of the colour channels, software can undo most of it.',
  keywords: ['lateral chromatic aberration', 'transverse chromatic aberration', 'TCA', 'lateral colour', 'chromatic difference of magnification', 'colour fringing', 'red and cyan fringes', 'corner fringing', 'C2', 'raw converter', 'defringe', 'stop position', 'chief ray', 'spectacle lens colour fringes'],
  prereq: ['axial-chromatic-aberration', 'distortion', 'chief-and-marginal-rays'],
  related: ['achromatic-doublet', 'apochromats-and-ed-glass', 'symmetry-and-the-stop', 'the-seidel-sums', 'spectacle-lens-materials', 'colour-filter-arrays-and-demosaicing', 'lens-distortion-and-calibration', 'reading-mtf-charts'],
  body: `
Open a photograph at full size and look at a high-contrast edge — a window frame against the sky — near the corner. One side of the edge has a red or magenta fringe, the other a green or cyan one, the pair always lined up along the radius from the centre of the picture. At the centre of the same picture the edges are clean. This is **lateral** (or transverse) **chromatic aberration**, "lateral colour" or **TCA**: the lens has a slightly different magnification for each colour.

### Where it comes from
Light that crosses a lens off centre meets glass whose two surfaces are not parallel, like a weak prism, and a prism bends each colour by a different amount. The off-axis point is seen through such a prism, so its red and blue images are displaced along the radius. A thin lens with the **stop at the lens** has none: the chief ray goes through the middle of the lens, where it acts like a flat plate. Move the stop away and the chief ray crosses the lens at a height $\\bar y = d\\tan\\theta$, and the F–C separation in the image is

$$\\text{TCA} \\approx \\frac{d\\,\\tan\\theta}{V}$$

for a stop at distance $d$ in front of the lens (a negative $d$ for a stop behind, where the colours reverse) and a glass of Abbe number $V$. It is proportional to the field and — unlike axial colour — **independent of the aperture**.

### How big
For a 100 mm N-BK7 singlet, traced; the separation of the red (650 nm) and blue (450 nm) images, a span 1.3 times the F–C one:

| Field angle | stop 30 mm in front | stop at the lens | stop 15 mm behind |
|---|---|---|---|
| 5° | 59 µm | 5 µm | −37 µm |
| 10° | 121 µm | 10 µm | −80 µm |
| 15° | 190 µm | 15 µm | −142 µm |
| 20° | 269 µm | 21 µm | −249 µm |

With the stop in front the red image is farther out; with the stop behind, nearer in. Well-corrected lenses do better by orders of magnitude: a cemented doublet gives 1.4 µm at 5° and 2.7 µm at 10°, a Cooke triplet 0.3 µm at 5° and −1.7 µm at 20°, and a double Gauss −8 to −13 µm at 5–14° — two pixels of 5 µm at the edge of the field.

### Axial against lateral
| | Axial colour | Lateral colour |
|---|---|---|
| Difference of | focus | magnification |
| On the axis | present | zero |
| Grows with | aperture | field angle |
| Fringes | halo around everything; colour swaps through focus | one side red, other side blue, along the radius |
| Stopping down | helps a little | does nothing |

### Correcting it
Symmetry about the stop cancels it: the two halves of a double Gauss make opposite contributions. Each element can be achromatized, and glasses matched. And because the error is a pure **radial rescaling** of each colour channel — the red image is $1 + \\epsilon$ times the green one at every radius — software can rescale red and blue to match green. Raw converters and cameras do this with a stored profile of the lens, which is why lateral colour is nearly invisible in modern pictures, while axial colour, which blurs each channel differently, cannot be undone.

### In spectacles
The eye looks through a lens at a distance from it, so the chief ray crosses the lens off centre when the eye turns. A strong spectacle lens of low Abbe number — polycarbonate 30, high-index 1.67 about 32, against 58 for CR-39 — shows coloured fringes at the edge: the lateral colour in prism dioptres is the prism power divided by $V$ ([[spectacle-lens-materials]]).

> [!key] Lateral colour is a difference of magnification between colours: zero on axis, growing with field, independent of aperture. It comes from the chief ray crossing the lens off centre; symmetry cancels it, and software can rescale the channels to remove the rest.
`,
  ideas: [
    'Lateral colour is a colour-dependent magnification: the red image is a slightly different size from the blue one.',
    'It is zero on the axis and grows in proportion to the field angle; fringes lie along the radius.',
    'It depends on where the chief ray crosses the lens: for a thin lens TCA ≈ d tan θ / V, zero with the stop at the lens.',
    'It does not depend on the aperture, so stopping down does nothing for it.',
    'Being a radial rescaling of the channels, it is the one chromatic aberration that software can correct well.'
  ],
  pitfalls: [
    'Colour fringes at the corners are the same as axial colour — Axial colour blurs each colour differently, is the same all over the picture and changes with focus. Lateral colour shifts the colours along the radius and grows with the distance from the centre.',
    'Stopping down removes colour fringing at the edges — Lateral colour is independent of the aperture. Stopping down reduces the blur of axial colour, but not the shift of lateral colour.',
    'An achromatic doublet has no lateral colour — A doublet is achromatic for axial colour; its lateral colour with the stop at the lens is small, but moving the stop reintroduces it, as for any lens.',
    'Fringes seen on a sensor must be the lens — Sensor effects (colour filter array, microlenses, purple fringing from blooming) produce similar fringes; lateral colour is the one that is always along the radius and grows linearly with distance from the centre.'
  ],
  terms: [
    { term: 'Lateral chromatic aberration', also: ['transverse chromatic aberration', 'TCA', 'lateral colour', 'chromatic difference of magnification', 'C2'], def: 'The variation of image height with wavelength: the red, green and blue images of an off-axis point lie at different distances from the axis. Zero on the axis, proportional to the field.' },
    { term: 'Chromatic difference of magnification', def: 'The lens designer\'s name for lateral colour: the magnification of the lens is different at different wavelengths.' },
    { term: 'Chief ray', also: ['principal ray'], def: 'The ray from an object point through the centre of the aperture stop. Where it crosses the lens decides how much lateral colour and distortion there is.' },
    { term: 'Chromatic correction in software', also: ['CA correction', 'defringe'], def: 'The radial rescaling of the red and blue channels of an image to match the green, based on a profile of the lens. It removes lateral colour but not axial colour.' }
  ],
  formulas: [
    {
      name: 'Lateral colour of a thin lens with the stop away from it',
      expr: 'tca = d*tan(theta)/V', tex: '\\mathrm{TCA} = \\frac{d\\,\\tan\\theta}{V}',
      vars: {
        tca: { name: 'separation of the F and C images', q: 'length', unit: 'µm', signed: true, tex: '\\mathrm{TCA}' },
        d: { name: 'distance from the stop to the lens (negative: stop behind)', q: 'length', unit: 'mm', value: 30, signed: true },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 10, min: 0, max: 30, tex: '\\theta' },
        V: { name: 'Abbe number of the lens glass', value: 64.2, min: 10, max: 120 }
      },
      note: 'Thin lens in air. Good to about 10 % up to 10°; at larger angles the real figure is higher.',
      stories: { tca: 'A thin lens of Abbe number {V} has its stop {d} in front of it. How far apart are the blue and red images of a point {theta} off axis?' }
    },
    {
      name: 'Fringe width in pixels',
      expr: 'n = tca/p', tex: 'n = \\frac{\\mathrm{TCA}}{p}',
      vars: {
        n: { name: 'width of the colour fringe in pixels' },
        tca: { name: 'separation of the colours', q: 'length', unit: 'µm', value: 10, tex: '\\mathrm{TCA}' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5 }
      },
      note: 'A fringe wider than a pixel or two is visible at full size; one under half a pixel is not.',
      stories: { n: 'A lens has a lateral colour of {tca} at the corner. How many pixels of {p} wide is the fringe?' }
    }
  ],
  examples: [
    {
      title: 'A singlet with a distant stop',
      q: 'A 100 mm N-BK7 singlet ($V = 64.2$) has its stop 30 mm in front of it. How far apart are the F and C images of a point 10° off axis, and how many 5 µm pixels is that?',
      steps: [
        { text: 'Apply the thin-lens formula:', tex: '\\mathrm{TCA} = \\frac{d\\tan\\theta}{V} = \\frac{30\\ \\mathrm{mm} \\times 0.1763}{64.2} = 82\\ \\mu\\mathrm{m}' },
        { text: 'In pixels:', tex: 'n = \\frac{82}{5} = 16' }
      ],
      a: 'About 82 µm (tracing gives 90 µm), 16 pixels. For the wider 450–650 nm span it is 121 µm. A stop that far from a singlet gives obvious fringes.'
    },
    {
      title: 'Where is the stop best put?',
      q: 'For the same singlet, at what distance in front of the lens would the lateral colour at 15° vanish?',
      steps: [
        { text: 'The formula gives zero only when $d = 0$:', tex: '\\mathrm{TCA} = \\frac{d\\tan\\theta}{V} = 0 \\;\\Rightarrow\\; d = 0' },
        'With the stop at the lens the chief ray goes through the centre and the thin-lens lateral colour vanishes; the 15 µm at 15° in the table is left by the thickness of the real lens.'
      ],
      a: 'At the lens, $d = 0$. That is the best place for lateral colour, though the stop position also moves coma, astigmatism and distortion, so the choice is a compromise.'
    }
  ],
  quiz: [
    { q: 'Lateral colour is zero…', choices: ['on the optical axis', 'at the corners of the picture', 'only for a monochrome sensor', 'when the lens is stopped down'], a: 0, why: 'It is a difference of magnification, so it grows from zero on the axis in proportion to the distance from it.' },
    { q: 'A lens is stopped down from f/2 to f/8. Its lateral colour at a given point changes by a factor of…', choices: ['1 — it does not change', '1/4', '1/16', '4'], a: 0, why: 'Lateral colour is independent of the aperture: it depends on where the chief ray, the ray through the centre of the stop, crosses the lens.' },
    { q: 'Software can correct lateral colour well because it is a radial scaling of each colour channel.', a: true, why: 'The red image is a slightly bigger copy of the green one, so rescaling the red and blue channels about the centre brings them into register. Axial colour cannot be undone this way, since it blurs the channels differently.' },
    { q: 'A thin lens of N-BK7 (V = 64) has its stop 25 mm in front of it. How far apart, in micrometres, are the F and C images of a point 8° off axis?', answer: 55, unit: 'µm', why: '$\\mathrm{TCA} = d\\tan\\theta/V = 25 \\times 0.1405/64.2 = 0.0547$ mm = 55 µm.' },
    { q: 'Which change in the position of the stop reverses the sign of a singlet\'s lateral colour?', choices: ['Moving it from in front of the lens to behind it', 'Moving it closer to the lens from the front', 'Making it larger', 'Making it smaller'], a: 0, why: 'In the formula the stop distance d changes sign when the stop is behind the lens, so the red image moves from outside the blue one to inside it.' }
  ],
  applications: [
    'Photography: profiles built into raw converters and cameras remove the red-cyan fringes at the corners of wide-angle zooms.',
    'Telescopes and microscopes: eyepieces and objectives are designed (and in older microscopes, compensated against one another) for lateral colour, so that the field edge is colourless.',
    'Machine vision: in colour inspection a lateral colour of two pixels moves edges differently in each channel and spoils sub-pixel measurement; the telecentric designs used in measurement are corrected for it.',
    'Spectacles: high-index lenses of low Abbe number show fringes at the edge of the lens and in strong prisms, the reason for the Abbe number appearing in the lens specification.',
    'Display optics: virtual-reality headsets pre-shift the colour channels of the image to cancel the lateral colour of the eyepieces.'
  ],
  history: 'Lateral colour was recognised in the early achromatic telescopes and microscopes: an objective could be achromatic for the axial point yet show coloured edges across its field. Ernst Abbe\'s compensating eyepieces of the 1880s, which carry a deliberate opposite lateral colour to cancel that of the apochromatic objectives of the Zeiss works, were a result. In digital photography the cure moved to software in the 2000s, when the profiles of lenses began to be stored in cameras.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — chromatic aberration.',
    'W. J. Smith, *Modern Optical Engineering* — lateral colour, its dependence on the position of the stop, and the Seidel chromatic sums.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. — the chromatic aberrations of a thin lens.'
  ],
  sim: 'ab-lateral-colour'
},

/* ================================================================ the Seidel sums */
{
  id: 'the-seidel-sums', parent: 'aberrations', title: 'The Seidel sums', level: 3,
  short: 'Two paraxial rays — one through the edge of the pupil, one through its centre — are enough to compute the five third-order aberrations and the two chromatic ones of a whole lens, surface by surface. Each is a sum of contributions that cancel one another in a good design: a balance sheet of the lens.',
  keywords: ['Seidel sums', 'Seidel coefficients', 'Seidel aberrations', 'S_I', 'S_II', 'S_III', 'S_IV', 'S_V', 'C_I', 'C_II', 'surface contributions', 'third-order aberrations', 'Lagrange invariant', 'marginal ray', 'chief ray', 'primary aberrations', 'aberration coefficients', 'W040'],
  prereq: ['what-aberrations-are', 'chief-and-marginal-rays', 'the-optical-invariant'],
  related: ['wavefront-error-and-zernike-polynomials', 'field-flatteners-and-petzval-sum', 'how-lens-design-works', 'lens-bending', 'symmetry-and-the-stop', 'cooke-triplet', 'spherical-aberration', 'coma', 'astigmatism-of-lenses', 'field-curvature', 'distortion'],
  body: `
A lens designer in 1900, with logarithm tables and no computer, could not trace thousands of rays. Seidel's discovery of 1856 made it unnecessary: trace just two **paraxial** rays through the lens — the **marginal ray**, which leaves the axial object point and goes through the edge of the pupil, and the **chief ray**, from the edge of the field through the centre of the stop — and from the heights and slopes at each surface compute, by simple sums, the third-order aberration of the whole system. The result is the **Seidel sums**.

### The five and the two
Each sum is a length, and each corresponds to one of the aberrations:

| Sum | Aberration | Wavefront term | Transverse error ∝ |
|---|---|---|---|
| $S_I$ | spherical aberration | $\\tfrac18 S_I\\,\\rho^4$ | aperture³ |
| $S_{II}$ | coma | $\\tfrac12 S_{II}\\,h\\,\\rho^3\\cos\\phi$ | aperture² × field |
| $S_{III}$ | astigmatism | $\\tfrac12 S_{III}\\,h^2\\rho^2\\cos^2\\phi$ | aperture × field² |
| $S_{IV}$ | Petzval field curvature | $\\tfrac14 (S_{III}{+}S_{IV})\\,h^2\\rho^2$ | aperture × field² |
| $S_V$ | distortion | $\\tfrac12 S_V\\,h^3\\rho\\cos\\phi$ | field³ |
| $C_I$ | axial colour | — | aperture |
| $C_{II}$ | lateral colour | — | field |

Here $\\rho$ is the position across the pupil (0 to 1), $h$ the field (0 to 1) and $\\phi$ the angle round the pupil. Dividing a sum by the wavelength gives waves: $W_{040} = S_I/(8\\lambda)$, $W_{131} = S_{II}/(2\\lambda)$, $W_{222} = S_{III}/(2\\lambda)$.

### Surface by surface
At each surface of radius $R$ the sums receive a contribution computed from the two rays: with $A = n(yc + u)$, the **refraction invariant** of the marginal ray ($c = 1/R$, $y$ its height, $u$ its slope) and $\\bar A$ the same for the chief ray,

$$S_I = -\\sum A^2\\,y\\,\\Delta\\!\\left(\\frac{u}{n}\\right),\\qquad S_{II} = -\\sum A\\bar A\\,y\\,\\Delta\\!\\left(\\frac{u}{n}\\right),\\qquad S_{III} = -\\sum \\bar A^2\\,y\\,\\Delta\\!\\left(\\frac{u}{n}\\right)$$

and the Petzval sum $S_{IV} = -H^2\\sum c\\,\\Delta(1/n)$, with $H$ the Lagrange invariant. $S_V$ follows from the others. The **Lagrange invariant** for a distant object is $H = y\\tan\\theta$: edge of the pupil times the field.

### A balance sheet
For a single lens the sums are all large, and sign-definite: a positive singlet has $S_I$ of 82 µm, $S_{III}$ of 46 µm and $S_{IV}$ of 33 µm at 10° (for $f = 100$ mm, f/4). For a thin lens with the stop at the lens $S_{III} = H^2/f$ and $S_{IV} = H^2/(nf)$. A good lens is one where the surface contributions cancel. In the Cooke triplet of 50 mm, the six surfaces contribute to $S_I$ (µm)

| surface | 1 | 2 | 3 | 4 | 5 | 6 | total |
|---|---|---|---|---|---|---|---|
| $S_I$ | +13.8 | +11.1 | −51.6 | −23.8 | +4.0 | +53.7 | **+7.1** |

— six large numbers adding to a small one, and the same cancellation is carried out for every sum with six degrees of freedom: curvatures, spacings and glasses.

### What the sums are good for, and not
They are exact for the *third-order* theory: small aperture and field. Past it, the **higher-order** aberrations (fifth and beyond) enter, and the traced spot differs from the third-order prediction — a fast or wide-angle lens needs exact ray tracing, and a design is often *balanced*, with third and fifth orders of opposite sign. But the sums give a physical map that a ray trace does not: which surface is to blame, which glass change helps, and why the Petzval sum depends only on powers and indices.

> [!key] Two paraxial rays give five Seidel sums for the monochromatic aberrations and two for colour, each a sum over the surfaces. Designers read them as a balance sheet, seeking cancellation; they are exact at third order only.
`,
  ideas: [
    'Two paraxial rays — marginal and chief — give all five third-order aberrations of a system as sums over its surfaces.',
    'S_I spherical, S_II coma, S_III astigmatism, S_IV Petzval field curvature, S_V distortion; C_I and C_II are the two colour sums.',
    'Each sum is a length; dividing by the wavelength gives the wavefront coefficient in waves (W040 = S_I/8λ, W131 = S_II/2λ, W222 = S_III/2λ).',
    'A good design is a cancellation: large positive and negative surface contributions adding to a small total.',
    'The sums describe the third order only; fast or wide-angle systems need an exact ray trace and the higher orders.'
  ],
  pitfalls: [
    'The Seidel sums are the aberrations of the lens — They are the third-order part only. A fast lens has fifth-order terms as large as the third, and the traced spot is the truth.',
    'A zero Seidel sum means a perfect lens — It means that the third-order term is zero. Higher orders and the other sums still contribute, and a design is often balanced so that some sums are not zero.',
    'S_IV is astigmatism — S_III is astigmatism; S_IV is the Petzval field curvature. The tangential and sagittal field curves are built from both, $S_{III}+S_{IV}$ and $3S_{III}+S_{IV}$.',
    'The sums need a trace of many rays — Just two rays and the lens prescription; that is their point.'
  ],
  terms: [
    { term: 'Seidel sums', also: ['Seidel coefficients', 'S_I … S_V', 'third-order aberration coefficients'], def: 'The five sums S_I to S_V, computed from a marginal ray and a chief ray traced through the system paraxially, that give the third-order spherical aberration, coma, astigmatism, Petzval curvature and distortion.' },
    { term: 'Surface contribution', def: 'The part of a Seidel sum that comes from one refracting or reflecting surface. A design is understood by looking for the surfaces that contribute most and those that cancel them.' },
    { term: 'Lagrange invariant', also: ['optical invariant', 'H'], def: 'The quantity n(ū y − u ȳ) formed from the marginal and chief rays, unchanged by every surface. For a distant object it is the edge of the pupil times the field angle.' },
    { term: 'Refraction invariant', also: ['A = n i'], def: 'For a ray at a surface: A = n(yc + u), the index times the angle of incidence. The Seidel contributions are built from it.' },
    { term: 'Primary chromatic aberrations', also: ['C_I', 'C_II'], def: 'The two colour sums: C_I for axial colour, C_II for lateral colour, computed from the same two paraxial rays and the dispersion of the glass at each surface.' },
    { term: 'Higher-order aberrations', def: 'The terms of fifth order and above that the third-order Seidel theory leaves out; they matter in fast and wide-angle lenses.' }
  ],
  formulas: [
    {
      name: 'Wavefront coefficient from S_I',
      expr: 'W = S1/(8*lambda)', tex: 'W_{040} = \\frac{S_I}{8\\,\\lambda}',
      vars: {
        W: { name: 'third-order spherical aberration at the edge of the pupil, in waves', tex: 'W_{040}' },
        S1: { name: 'Seidel sum S_I', q: 'length', unit: 'µm', value: 82.1, tex: 'S_I' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 587.6, tex: '\\lambda' }
      },
      note: 'The default is the 100 mm biconvex singlet of 25.4 mm aperture: S_I = 82 µm, 17.5 waves.',
      stories: { W: 'A lens has a Seidel sum S_I of {S1}. How many waves of spherical aberration at {lambda}?' }
    },
    {
      name: 'Lagrange invariant for a distant object',
      expr: 'H = D*tan(theta)/2', tex: 'H = \\frac{D}{2}\\tan\\theta',
      vars: {
        H: { name: 'Lagrange invariant', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the pupil', q: 'length', unit: 'mm', value: 25.4 },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 10, min: 0, max: 45, tex: '\\theta' }
      },
      note: 'H sets the scale of every field-dependent sum: S_II ∝ H, S_III and S_IV ∝ H², S_V ∝ H³.'
    },
    {
      name: 'Astigmatism sum of a thin lens at the stop',
      expr: 'S3 = H^2/f', tex: 'S_{III} = \\frac{H^2}{f}',
      vars: {
        S3: { name: 'Seidel sum S_III', q: 'length', unit: 'µm', tex: 'S_{III}' },
        H: { name: 'Lagrange invariant', q: 'length', unit: 'mm', value: 2.24 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Independent of the shape and the glass. The traced value for the biconvex lens at 10° is 46 µm.',
      stories: { S3: 'A thin lens of focal length {f} with the stop at the lens has a Lagrange invariant of {H}. What is its astigmatism sum?' }
    },
    {
      name: 'Petzval sum of a thin lens',
      expr: 'S4 = H^2/(n*f)', tex: 'S_{IV} = \\frac{H^2}{n\\,f}',
      vars: {
        S4: { name: 'Seidel sum S_IV', q: 'length', unit: 'µm', tex: 'S_{IV}' },
        H: { name: 'Lagrange invariant', q: 'length', unit: 'mm', value: 2.24 },
        n: { name: 'refractive index', value: 1.5168, min: 1, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The Petzval radius is −H²/S_IV = −n f.'
    }
  ],
  examples: [
    {
      title: 'From the sums to the waves',
      q: 'The biconvex lens of 100 mm focal length and 25.4 mm aperture (N-BK7) is used 10° off axis. Its Lagrange invariant is $H = 2.24$ mm; its traced astigmatism sum is $S_{III} = 45.8$ µm. Estimate $S_{III}$ and $S_{IV}$ for a thin lens, then the wavefront astigmatism at 587.6 nm.',
      steps: [
        { text: 'Thin-lens estimates:', tex: 'S_{III} = \\frac{H^2}{f} = \\frac{5.02}{100} = 50\\ \\mu\\mathrm{m}\\qquad S_{IV} = \\frac{H^2}{nf} = \\frac{5.02}{151.7} = 33\\ \\mu\\mathrm{m}' },
        { text: 'The wavefront coefficient from the traced sum:', tex: 'W_{222} = \\frac{S_{III}}{2\\lambda} = \\frac{45.8\\ \\mu\\mathrm{m}}{2 \\times 0.5876\\ \\mu\\mathrm{m}} = 39\\ \\text{waves}' }
      ],
      a: 'The thin-lens estimates (50 and 33 µm) are within 10 % of the traced sums (46 and 33 µm), and the wavefront has 39 waves of astigmatism — hopelessly beyond the quarter-wave tolerance at f/4. At f/10 the same sum gives 6 waves.'
    },
    {
      title: 'The Petzval radius from S_IV',
      q: 'Using $R_P = -H^2/S_{IV}$ with the numbers above, what is the Petzval radius of the lens?',
      steps: [
        { text: 'Substitute:', tex: 'R_P = -\\frac{H^2}{S_{IV}} = -\\frac{5.02\\ \\mathrm{mm}^2}{0.0333\\ \\mathrm{mm}} = -151\\ \\mathrm{mm}' }
      ],
      a: '−151 mm, which is $-nf$ for $n = 1.52$ and $f = 100$ mm, as the Petzval theorem requires.'
    }
  ],
  quiz: [
    { q: 'Which Seidel sum does not depend on the field angle?', choices: ['S_I, spherical aberration', 'S_II, coma', 'S_III, astigmatism', 'S_V, distortion'], a: 0, why: 'S_I is built from the marginal ray alone. Coma needs one power of the chief ray, astigmatism and field curvature two, and distortion three.' },
    { q: 'Seidel sums are computed from…', choices: ['two paraxial rays: marginal and chief', 'a large number of exact rays', 'the wavefront map', 'a single ray'], a: 0, why: 'The marginal and chief rays are traced paraxially, which needs only heights and slopes at each surface.' },
    { q: 'A lens has S_I = 40 µm at 550 nm. How many waves of spherical aberration is that?', answer: 9.09, why: '$W_{040} = S_I/(8\\lambda) = 40/(8 \\times 0.55) = 9.09$ waves.' },
    { q: 'A design with all five third-order sums equal to zero is therefore perfect.', a: false, why: 'Third-order theory is the first term of a series. The fifth-order terms remain, and they are significant in fast and wide-angle lenses; real designs balance orders against each other and are checked with exact rays.' },
    { q: 'What do the surface contributions of S_I in a triplet look like?', choices: ['Large positive and negative values that add to a small total', 'All small and positive', 'All zero except the first', 'Equal for every surface'], a: 0, why: 'Cancelling large contributions is how the aberration is removed: the positive and negative elements and the distances between them are chosen so that they add up to nearly nothing.' }
  ],
  applications: [
    'Lens-design programs print a Seidel table for every system — a first diagnostic that says which surface or element dominates each aberration.',
    'Telescope design: the Ritchey–Chrétien and the Schwarzschild mirror pairs were found by setting S_I and S_II to zero and solving for the conic constants of the two mirrors.',
    'Thin-lens design by hand: the formulas for a single lens or a pair (the achromat, the Cooke triplet\'s first guess) are Seidel sums for thin elements.',
    'Tolerancing: sensitivity of the sums to a change of radius, index or spacing says which parts of a lens must be made most accurately.',
    'Teaching: the Seidel sums show, in one table, why the Petzval sum depends only on powers and glasses, and why the stop moves coma and astigmatism.'
  ],
  history: 'Ludwig von Seidel, a Munich astronomer and mathematician, published the five formulas in 1856 in the Astronomische Nachrichten, building on Gauss and on Petzval\'s work on field curvature. Karl Schwarzschild put them into their modern form in 1905. They were the designer\'s only systematic tool until electronic computers made exact ray tracing cheap in the 1950s and 1960s; the sums, and Seidel\'s names for the aberrations, are still the language of the trade.',
  sources: [
    'W. T. Welford, *Aberrations of Optical Systems* (Adam Hilger, 1986) — the third-order sums and their surface-by-surface form.',
    'W. J. Smith, *Modern Optical Engineering* — the Seidel aberrations of a surface and of a system.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 5 — the geometrical theory of aberrations and the Seidel formulae.',
    'J. Sasian, *Introduction to Aberrations in Optical Imaging Systems* (Cambridge University Press, 2013).'
  ],
  sim: 'ab-seidel'
},

/* ================================================================ wavefront error and Zernike polynomials */
{
  id: 'wavefront-error-and-zernike-polynomials', parent: 'aberrations', title: 'Wavefront error and Zernike polynomials', level: 3,
  short: 'A lens turns a plane wave into a nearly spherical one. The gap between the real wavefront and the perfect sphere, in wavelengths, is the wavefront error: a map across the pupil, summarized by its peak-to-valley and its RMS. Zernike polynomials split the map into named, independent shapes: tilt, defocus, astigmatism, coma, spherical aberration.',
  keywords: ['wavefront error', 'wave aberration', 'OPD', 'optical path difference', 'peak to valley', 'PV', 'RMS wavefront error', 'Zernike polynomials', 'Zernike coefficients', 'Noll', 'piston', 'tilt', 'defocus', 'trefoil', 'orthogonal', 'wavefront map', 'Shack–Hartmann', 'interferogram'],
  prereq: ['what-aberrations-are', 'the-seidel-sums', 'optical-path-length', 'rays-and-wavefronts'],
  related: ['strehl-ratio-and-diffraction-limited', 'testing-optics-with-fringes', 'wavefront-sensors', 'aberrations-of-the-eye', 'autorefractors-and-aberrometers', 'spot-diagrams-and-ray-fans', 'the-point-spread-function', 'astronomical-observatories-and-adaptive-optics', 'math:fourier-series'],
  body: `
Rays are a convenient picture, but light is a wave, and what a lens does to a plane wave arriving from a distant point is to bend its flat front into a sphere centred on the image point. A perfect lens makes a perfect sphere. A real one makes something slightly different, and the difference — measured as an **optical path difference** and counted in wavelengths — is the **wavefront error** $W(x, y)$, a function of position across the exit pupil. It is zero for a perfect lens; one wave means that part of the wavefront is a whole wavelength ahead of or behind the reference sphere.

### Two numbers for the whole map
- **Peak-to-valley (PV):** the highest point of the map minus the lowest. Easy to read, but a single hot pixel or a dust speck decides it.
- **RMS:** the root of the mean squared deviation over the pupil (after removing the average, which does nothing to the image). Statistical, stable, and directly tied to the peak brightness of the image through the Strehl ratio ([[strehl-ratio-and-diffraction-limited]]). The ratio PV/RMS is 3.5 to 6 for the common shapes, so "λ/4 PV" is not "λ/4 RMS".

A mirror doubles a surface error (the light travels the error twice) and a lens surface of index $n$ multiplies it by $n-1$: a mirror with a surface error of λ/10 PV gives a wavefront error of λ/5 PV.

### Zernike polynomials
A map can be anything, but the common errors are smooth shapes with names, and the Zernike polynomials are the natural alphabet of them: a set of functions that are **orthogonal on the unit circle**. Each term, normalised to unit RMS, represents one independent shape, so if the coefficients $c_j$ are in waves RMS the RMS of the total is

$$\\sigma = \\sqrt{c_2^2 + c_3^2 + c_4^2 + \\dots}$$

(the piston $c_1$ does nothing). Here are the first terms in Noll's numbering, with $\\rho$ the radius over the pupil radius and $\\theta$ the angle:

| j | Name | Polynomial | PV for σ = 1 wave |
|---|---|---|---|
| 1 | piston | 1 | 0 |
| 2, 3 | tilt | $2\\rho\\cos\\theta,\\ 2\\rho\\sin\\theta$ | 4.0 |
| 4 | defocus | $\\sqrt3\\,(2\\rho^2-1)$ | 3.46 |
| 5, 6 | astigmatism | $\\sqrt6\\,\\rho^2\\sin2\\theta,\\ \\sqrt6\\,\\rho^2\\cos2\\theta$ | 4.9 |
| 7, 8 | coma | $\\sqrt8\\,(3\\rho^3-2\\rho)\\sin\\theta,\\ \\cos\\theta$ | 5.6 |
| 9, 10 | trefoil | $\\sqrt8\\,\\rho^3\\sin3\\theta,\\ \\cos3\\theta$ | 5.6 |
| 11 | spherical aberration | $\\sqrt5\\,(6\\rho^4-6\\rho^2+1)$ | 3.35 |

The numbering differs between schemes: the same spherical aberration is $Z_{11}$ in Noll's, $Z_{12}$ in the OSA/ANSI single index used for the eye, and $Z_9$ in the Fringe (Arizona) set used by some optical-design programs. Always check which one a report uses.

### The link with the Seidel aberrations
The Seidel terms are plain powers; the Zernike ones are those powers *balanced* — with tilt and defocus mixed in so as to have the least RMS. For example $W_{040}\\rho^4$ contains $W_{040}/(6\\sqrt5)$ of $Z_{11}$, $W_{040}/(2\\sqrt3)$ of $Z_4$ (refocusing removes that part). Hence: the RMS error of third-order spherical aberration is $0.298\\,W_{040}$ at the paraxial focus and $0.075\\,W_{040}$ at best focus; of coma, $0.118\\,W_{131}$ after tilt is removed; of astigmatism, $0.204\\,W_{222}$ after refocusing.

### How the map is measured
An interferometer shows the map as fringes: each fringe is one wave of OPD ([[testing-optics-with-fringes]]). A Shack–Hartmann sensor measures the slope at each lenslet and integrates it ([[wavefront-sensors]]). The eye's map comes from the aberrometer ([[aberrations-of-the-eye]]); adaptive optics in telescopes fits Zernike modes to the turbulence and cancels them ([[astronomical-observatories-and-adaptive-optics]]).

> [!key] Wavefront error is the gap between the real wavefront and a perfect sphere, in waves; RMS is the number that predicts the image. Zernike polynomials split it into independent named shapes whose RMS values add in quadrature.
`,
  ideas: [
    'Wavefront error W(x, y) is the optical path difference, in waves, between the real wavefront and a perfect reference sphere across the exit pupil.',
    'PV is the highest minus the lowest and is easily spoiled by a speck; RMS is the stable measure that predicts the peak brightness of the image.',
    'Zernike polynomials are orthogonal on the circle, so unit-RMS terms are independent shapes and the total RMS is the root sum of squares of the coefficients.',
    'The Seidel aberrations are plain powers; the Zernike terms are their balanced forms with tilt and defocus mixed in.',
    'A mirror surface error counts double in the wavefront; a lens surface counts (n − 1).'
  ],
  pitfalls: [
    'λ/4 PV is a quarter-wave RMS — PV is 3.5 to 6 times the RMS, depending on the shape. A quarter-wave PV of defocus is λ/14 RMS, the Maréchal limit; of coma it is only λ/23 RMS.',
    'Tilt and defocus are aberrations like the rest — Tilt only moves the image, and defocus is removed by refocusing. They are usually subtracted before reporting an RMS, but not from a lens whose focus is fixed.',
    'Zernike coefficients mean the same in every report — The numbering and the normalisation differ (Noll, OSA/ANSI, Fringe; RMS-normalised or not). A coefficient is meaningless without its convention.',
    'Zernike polynomials describe every error — They are a smooth basis on a circular pupil. Fine ripples from polishing, edge effects and obstructed (annular) pupils need other descriptions.'
  ],
  terms: [
    { term: 'Wavefront error', also: ['wave aberration', 'W', 'OPD map'], def: 'The optical path difference, in waves, between the real wavefront at the exit pupil and the reference sphere centred on the image point. Zero for a perfect lens.' },
    { term: 'Peak-to-valley', also: ['PV', 'P–V'], def: 'The difference between the highest and lowest values of the wavefront error across the pupil. Depends on single extreme points.' },
    { term: 'RMS wavefront error', also: ['RMS', 'σ'], def: 'The root-mean-square deviation of the wavefront error across the pupil, with the mean removed. The standard measure of image quality: Strehl ≈ exp(−(2πσ)²).' },
    { term: 'Zernike polynomials', also: ['Zernike modes', 'Zernike terms'], def: 'A set of polynomials in ρ and θ that are orthogonal on the unit circle, used to describe wavefront error as a sum of independent, named shapes: tilt, defocus, astigmatism, coma, spherical aberration and so on.' },
    { term: 'Piston', also: ['Z1'], def: 'A constant offset of the whole wavefront. It has no effect on the image and is dropped from the RMS.' },
    { term: 'Defocus', also: ['Z4', 'W020'], def: 'The spherical term √3(2ρ² − 1): the wavefront error of a focus shift. PV = 2√3 times the RMS.' },
    { term: 'Trefoil', also: ['Z9', 'Z10', 'triangular astigmatism'], def: 'A three-lobed error ρ³ cos 3θ: the image of a point has three arms. Seen with tilted or stressed optics, in mirror mounts and in the eye.' }
  ],
  formulas: [
    {
      name: 'RMS of three Zernike terms',
      expr: 'sigma = sqrt(c1^2 + c2^2 + c3^2)', tex: '\\sigma = \\sqrt{c_1^2 + c_2^2 + c_3^2}',
      vars: {
        sigma: { name: 'RMS wavefront error, in waves', tex: '\\sigma' },
        c1: { name: 'first Zernike coefficient (RMS, in waves)', value: 0.05, signed: true, tex: 'c_1' },
        c2: { name: 'second Zernike coefficient', value: 0.04, signed: true, tex: 'c_2' },
        c3: { name: 'third Zernike coefficient', value: 0.03, signed: true, tex: 'c_3' }
      },
      note: 'Orthonormal terms add in quadrature; the coefficients are RMS waves.'
    },
    {
      name: 'Defocus: peak-to-valley and RMS',
      expr: 'sigma = pv/(2*sqrt(3))', tex: '\\sigma = \\frac{\\mathrm{PV}}{2\\sqrt{3}}',
      vars: {
        sigma: { name: 'RMS wavefront error of pure defocus, in waves', tex: '\\sigma' },
        pv: { name: 'peak-to-valley wavefront error, in waves', value: 0.25, tex: '\\mathrm{PV}' }
      },
      note: 'For a quarter wave PV the RMS is 0.072, which is λ/13.9: the Rayleigh and Maréchal criteria agree for defocus.'
    },
    {
      name: 'Waves of defocus from a focus error',
      expr: 'W = dz/(8*N^2*lambda)', tex: 'W_{020} = \\frac{\\Delta z}{8\\,N^2\\,\\lambda}',
      vars: {
        W: { name: 'peak-to-valley defocus wavefront error, in waves', tex: 'W_{020}' },
        dz: { name: 'distance of the sensor from the focus', q: 'length', unit: 'µm', value: 17.6, tex: '\\Delta z' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'With W = 1/4 this gives Δz = 2λN²: the quarter-wave depth of focus. The default is that case.',
      stories: { W: 'A sensor sits {dz} from the focus of an f/{N} lens in light of {lambda}. How many waves of defocus?', dz: 'How far may the sensor be from the focus of an f/{N} lens, in light of {lambda}, before the defocus reaches {W} waves peak to valley?' }
    }
  ],
  examples: [
    {
      title: 'Adding up three errors',
      q: 'A lens has 0.05 waves RMS of defocus ($Z_4$), 0.04 of coma ($Z_8$) and 0.03 of spherical aberration ($Z_{11}$). What is the RMS wavefront error, and is it within the Maréchal limit of λ/14?',
      steps: [
        { text: 'Add in quadrature:', tex: '\\sigma = \\sqrt{0.05^2 + 0.04^2 + 0.03^2} = \\sqrt{0.0050} = 0.0707' },
        'The Maréchal limit is $1/14 = 0.0714$.'
      ],
      a: '0.0707 waves RMS, about λ/14.1: just inside the limit, with a Strehl ratio of about 0.82. The defocus could be removed by refocusing, which would give 0.05 waves.'
    },
    {
      title: 'The quarter-wave focus tolerance',
      q: 'How far may the sensor be from the focus of an f/4 lens, in green light (550 nm), before the defocus reaches a quarter wave PV?',
      steps: [
        { text: 'Solve $W_{020} = \\Delta z/(8N^2\\lambda) = 1/4$ for the distance:', tex: '\\Delta z = 2\\lambda N^2 = 2 \\times 0.55\\ \\mu\\mathrm{m} \\times 16 = 17.6\\ \\mu\\mathrm{m}' }
      ],
      a: '±17.6 µm. That is the Rayleigh depth of focus; the same sum at f/8 gives ±70 µm.'
    }
  ],
  quiz: [
    { q: 'Which is the better predictor of the peak brightness of a point image?', choices: ['The RMS wavefront error', 'The peak-to-valley wavefront error', 'The largest slope of the wavefront', 'The focal length'], a: 0, why: 'The RMS averages the whole pupil. A single dust speck or an edge effect can make the PV large without making the image noticeably worse.' },
    { q: 'A mirror has a surface error of λ/20 RMS. The wavefront error it adds at normal incidence is…', choices: ['λ/10 RMS', 'λ/20 RMS', 'λ/40 RMS', 'zero'], a: 0, why: 'The light travels to the surface and back, so the path error is twice the surface error.' },
    { q: 'Zernike terms normalised to unit RMS are independent, so their RMS values add in quadrature.', a: true, why: 'Orthogonality means there are no cross terms in the mean square: $\\sigma^2 = \\sum c_j^2$ (over the terms other than piston).' },
    { q: 'The RMS wavefront error of two terms, 0.06 waves of astigmatism and 0.08 waves of coma, is? (in waves)', answer: 0.1, why: '$\\sqrt{0.06^2 + 0.08^2} = \\sqrt{0.0100} = 0.10$ waves RMS.' },
    { q: 'Spherical aberration is called $Z_{11}$, $Z_{12}$ or $Z_9$. Why?', choices: ['Different numbering schemes (Noll, OSA/ANSI, Fringe) number the same polynomial differently', 'These are three different aberrations', 'The numbers are the f-number', 'Each is for a different wavelength'], a: 0, why: 'Zernike polynomials are numbered by several conventions, so a coefficient is meaningful only together with its scheme.' }
  ],
  applications: [
    'Optical shops: mirrors and lenses are tested in an interferometer and reported as PV and RMS wavefront error, with Zernike fits for their astigmatism, coma and spherical terms.',
    'Ophthalmology: an aberrometer reports the eye\'s wavefront as Zernike coefficients, with defocus and astigmatism corrected by spectacles and the "higher-order" terms (coma, trefoil, spherical) as the residue.',
    'Adaptive optics: a Shack–Hartmann sensor measures the wavefront of a star, and a deformable mirror cancels its lowest Zernike modes thousands of times a second.',
    'Lithography and space optics: specifications of the form "wavefront error below 10 nm RMS" are statements about the sum of all the Zernike terms.',
    'Alignment: coma and astigmatism terms in a telescope\'s wavefront tell the observer which mirror is tilted and which is pinched.'
  ],
  history: 'Frits Zernike introduced the circle polynomials in 1934, in his work on testing mirrors and on the diffraction theory of the knife-edge test; he won the Nobel Prize for the phase-contrast microscope in 1953. Bernard Nijboer, his student, used them in the early 1940s to compute the images of aberrated systems, the Nijboer–Zernike theory. Robert Noll\'s paper of 1976 on atmospheric turbulence fixed the numbering and normalisation that most optical software still follows.',
  sources: [
    'R. J. Noll, "Zernike polynomials and atmospheric turbulence", *Journal of the Optical Society of America* 66 (1976) 207–211 — the numbering and normalisation used here.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 9 — wave aberrations, Zernike polynomials, the Strehl ratio and the Nijboer–Zernike theory.',
    'V. N. Mahajan, *Optical Imaging and Aberrations*, Part II: Wave Diffraction Optics (SPIE Press) — Zernike circle polynomials, aberration balancing and tolerances.',
    'L. N. Thibos, R. A. Applegate, J. T. Schwiegerling, R. Webb, "Standards for reporting the optical aberrations of eyes", *Journal of Refractive Surgery* 18 (2002) S652–S660 — the OSA/ANSI numbering.'
  ],
  sim: 'ab-zernike'
},

/* ================================================================ spot diagrams and ray fans */
{
  id: 'spot-diagrams-and-ray-fans', parent: 'aberrations', title: 'Spot diagrams and ray fans', level: 2,
  short: 'Two pictures that a lens designer reads at a glance. A spot diagram marks where a grid of rays from one object point lands in the image plane; a ray fan plots how far each ray misses against where it crossed the pupil. The shape of each tells which aberration is present, and its size against the Airy disc tells whether it matters.',
  keywords: ['spot diagram', 'ray fan', 'ray aberration plot', 'transverse ray aberration', 'RMS spot size', 'geometric spot', 'encircled energy', 'tangential fan', 'sagittal fan', 'through focus', 'Airy disc', 'lens design software', 'image quality', 'spot radius'],
  prereq: ['what-aberrations-are', 'spherical-aberration', 'coma', 'astigmatism-of-lenses'],
  related: ['wavefront-error-and-zernike-polynomials', 'strehl-ratio-and-diffraction-limited', 'the-airy-disk', 'the-point-spread-function', 'the-modulation-transfer-function', 'axial-chromatic-aberration', 'lateral-chromatic-aberration', 'reading-mtf-charts', 'how-lens-design-works'],
  body: `
A lens-design program offers dozens of plots, and two of them are used more than the rest because they can be read without calculation. Both come from the same experiment: take one point of the object, send a grid of rays through the pupil, and see where they land.

### The spot diagram
Mark each landing point in the image plane and the dots form the **spot diagram**. It is the image of a point as geometrical optics sees it: every dot is a ray, evenly spread over the pupil. It is drawn in micrometres, with a scale bar, and with the **Airy disc** (the diffraction limit, radius $1.22\\lambda N$) as a circle, and sometimes the pixel as a square.

Three numbers describe it: the **geometric radius** (the farthest dot from the centre), the **RMS radius** (the root mean square of the distances, the fairer measure), and the **encircled energy** (the fraction of the dots inside a given circle). Spots are made at the centre, at an intermediate field and at the edge, and at several wavelengths, in colour.

Shapes are diagnostic. A **round blob** with a dense core and a skirt is spherical aberration; a **comet** is coma; an **ellipse or line** is astigmatism, turning between its two focal lines as the focus moves; a **disc** of uniform density is plain defocus; **red, green and blue clouds** displaced from one another are colour.

### The ray fan
In a **ray-fan plot** the horizontal axis is where a ray crossed the pupil, from −1 to +1, and the vertical axis its miss in the image plane, in µm. Two curves are drawn: the tangential fan (rays in the radial plane; the vertical miss) and the sagittal fan (rays in the cross plane; the sideways miss). A perfect lens gives a horizontal line along zero. The slope of the curve at any point is the slope of the wavefront error there ($\\varepsilon = 2N\\lambda\\,\\mathrm{d}W/\\mathrm{d}\\rho$, from [[what-aberrations-are]]).

| Shape of the fan | Aberration |
|---|---|
| a straight line through the origin, sloped | defocus (the slope gives the focus error) |
| a cubic, S-shaped, odd about the origin | spherical aberration |
| a parabola, even about the origin | coma (tangential fan) |
| two straight lines of different slope for the two fans | astigmatism |
| the whole curve shifted up or down | distortion, or lateral colour if it differs between colours |
| curves for different colours at different slopes | axial colour |

A straight fan of edge value $\\varepsilon$ means the sensor is off the focus by $\\Delta z = 2N\\varepsilon$; refocus to flatten it. A cubic with a flat middle is spherical aberration seen at the paraxial focus.

### Through focus
Adding a focus control to either picture is the quickest way to tell aberrations apart. A spot diagram of spherical aberration stays round as the focus moves, becoming a ring; of astigmatism, it turns to lines at right angles. In a ray fan, moving the focus adds a straight tilt to the pattern: it turns the flat middle of the cubic into an S that crosses zero three times, which is the best focus, the smallest overall miss.

### What they do not show
Both are geometrical: they know nothing of diffraction. When the spot is smaller than the Airy disc the diagram says only that the lens is diffraction-limited, not how good the image is — the right tools then are the wavefront map and the Strehl ratio. And a spot diagram's dots are equal weights from a uniform pupil; a real image has the intensity profile of the point-spread function.

> [!key] A spot diagram shows where the rays land; a ray fan shows how far each misses against where it crossed the pupil. Read the shape for the aberration and the size against the Airy disc for the consequence.
`,
  ideas: [
    'A spot diagram is where a grid of rays from one object point lands in the image plane; compare its size with the Airy disc.',
    'A ray fan plots the ray miss against the pupil position: its shape names the aberration and its slope is the local slope of the wavefront error.',
    'Cubic = spherical, parabola = coma, two different straight lines = astigmatism, a tilted straight line = defocus, a shift = distortion or lateral colour.',
    'Moving the focus changes the shapes in a characteristic way, which is the best way to tell them apart.',
    'Both are geometrical, so once the spot is inside the Airy disc they tell you no more; wavefront RMS and the Strehl ratio take over.'
  ],
  pitfalls: [
    'A small spot diagram means a sharp lens — Only if the spot is also large compared with the Airy disc. A spot far smaller than the diffraction disc is as good as a lens can be, and what matters then is the wavefront.',
    'The ray-fan curve is the shape of the wavefront — It is its slope. The wavefront itself is the integral of the fan, and a flat part of the fan is a wavefront with constant slope, not a flat wavefront.',
    'The RMS and the geometric radius are the same — The RMS averages every ray; the geometric radius is set by the one farthest dot. A spot with a sparse halo has a large geometric radius and a small RMS.',
    'The spot at the paraxial focus is the best the lens can do — The paraxial focus is only one plane. Best focus, through the Strehl ratio or the smallest RMS, is usually in front of it.'
  ],
  terms: [
    { term: 'Spot diagram', also: ['spot plot', 'point diagram'], def: 'A plot of where a regular grid of rays from one object point lands in the image plane, drawn to scale with the Airy disc for comparison.' },
    { term: 'RMS spot radius', also: ['RMS spot size'], def: 'The root mean square of the distances of the ray landing points from their centroid (or from the chief ray). A fair, single-number measure of the size of the geometrical blur.' },
    { term: 'Geometric spot radius', also: ['GEO radius'], def: 'The largest distance of any ray landing point from the centroid or chief ray point. Dominated by the outermost rays.' },
    { term: 'Encircled energy', also: ['EE', 'enclosed energy'], def: 'The fraction of the light (the rays, in geometrical optics) that falls within a circle of given radius round the image point.' },
    { term: 'Ray fan', also: ['ray aberration plot', 'transverse ray aberration plot'], def: 'A plot of the transverse miss of rays in the image plane against their position in the pupil, for rays in a single plane through the axis (tangential fan) or across it (sagittal fan).' },
    { term: 'Tangential and sagittal fans', also: ['Y fan', 'X fan'], def: 'The two ray fans: the tangential one in the plane containing the object point and the axis; the sagittal one in the plane across it.' }
  ],
  formulas: [
    {
      name: 'Focus error read from a straight ray fan',
      expr: 'dz = 2*N*eps', tex: '\\Delta z = 2\\,N\\,\\varepsilon',
      vars: {
        dz: { name: 'distance of the sensor from the focus', q: 'length', unit: 'µm', tex: '\\Delta z' },
        N: { name: 'f-number', value: 5, min: 0.5, max: 64 },
        eps: { name: 'ray miss at the edge of the pupil', q: 'length', unit: 'µm', value: 20, tex: '\\varepsilon' }
      },
      note: 'A defocused cone has a half-width of Δz/(2N) at the sensor.',
      stories: { dz: 'The ray fan of an f/{N} lens is a straight line reaching {eps} at the edge of the pupil. How far is the sensor from the focus?' }
    },
    {
      name: 'RMS spot size relative to the Airy disc',
      expr: 'k = r/(1.22*lambda*N)', tex: 'k = \\frac{r}{1.22\\,\\lambda N}',
      vars: {
        k: { name: 'RMS spot radius as a multiple of the Airy radius' },
        r: { name: 'RMS spot radius', q: 'length', unit: 'µm', value: 8 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'A ratio well below 1 means diffraction, not the glass, limits the image. Above about 2 the lens is aberration-limited.'
    }
  ],
  examples: [
    {
      title: 'Reading a straight fan',
      q: 'A lens at f/5 shows a ray fan that is a straight sloped line reaching +20 µm at the top of the pupil and −20 µm at the bottom. How far is the sensor from the focus, and which way would you move it?',
      steps: [
        { text: 'Defocus:', tex: '\\Delta z = 2N\\varepsilon = 2 \\times 5 \\times 20\\ \\mu\\mathrm{m} = 200\\ \\mu\\mathrm{m}' },
        'The rays from the top of the pupil land high: they have not yet crossed the axis, so the sensor is in front of the focus and must be moved away from the lens.'
      ],
      a: 'The sensor is 0.2 mm in front of the focus (move it 0.2 mm away from the lens). A straight fan can always be cancelled by refocusing; a cubic or parabolic one cannot.'
    },
    {
      title: 'Is the lens diffraction-limited?',
      q: 'At f/8 in green light an RMS spot radius of 3 µm is found. The Airy radius is $1.22 \\times 0.55 \\times 8 = 5.4$ µm. What do you conclude?',
      steps: [
        { text: 'The ratio:', tex: '\\frac{r_{\\mathrm{rms}}}{r_{\\mathrm{Airy}}} = \\frac{3}{5.4} = 0.56' }
      ],
      a: 'The geometric blur is about half the Airy radius, so the lens is diffraction-limited at this aperture and field point. Stopping down further only enlarges the diffraction disc; opening up lets the aberrations grow.'
    }
  ],
  quiz: [
    { q: 'A tangential ray fan is a parabola, symmetric about the vertical axis. Which aberration does this suggest?', choices: ['Coma', 'Spherical aberration', 'Defocus', 'Distortion'], a: 0, why: 'A parabolic (even) fan means rays from opposite edges of the pupil miss on the same side: the tail of a comet. Spherical aberration gives an odd cubic, defocus a straight line.' },
    { q: 'A ray fan is a straight sloped line through the origin. What is wrong?', choices: ['The image plane is out of focus', 'The lens has spherical aberration', 'The lens has coma', 'The lens is perfect'], a: 0, why: 'A linear miss proportional to pupil position is defocus. Refocusing removes it.' },
    { q: 'A spot diagram much smaller than the Airy disc tells you the lens has a great image.', a: false, why: 'Geometrical optics ignores diffraction. If the spot is well inside the Airy disc the lens is diffraction-limited, and the image is as good as the aperture allows — but no better; the geometrical spot says nothing more.' },
    { q: 'An f/10 lens shows a straight ray fan reaching 15 µm at the pupil edge. How far is the sensor from the focus, in micrometres?', answer: 300, unit: 'µm', why: '$\\Delta z = 2N\\varepsilon = 2 \\times 10 \\times 15 = 300$ µm.' },
    { q: 'Which pair of curves in the ray fans marks astigmatism?', choices: ['Straight lines of different slope in the tangential and the sagittal fan', 'A cubic in both fans', 'The same parabola in both', 'Both fans flat'], a: 0, why: 'Astigmatism is a difference of focus between the two planes, and a focus error is a straight line in the fan: two different focus errors, two different slopes.' }
  ],
  applications: [
    'Lens design: every design review shows spots and fans at several field points, wavelengths and focus positions, to see at once which aberration is left.',
    'Lens evaluation: the spot of a catalogue lens at the edge of the field against the pixel tells whether it will resolve a sensor.',
    'Optical alignment: a coma-shaped spot in a laser focus or a telescope image is the sign of a tilted or decentred element.',
    'Tolerancing: spot sizes with a changed radius, thickness or tilt show how sensitive the design is.',
    'Teaching: because both pictures are geometrical, a student can follow every point of them back to a ray.'
  ],
  history: 'Spot diagrams became routine with computer ray tracing, which could follow hundreds of rays in the time that tracing a handful by hand had taken a designer. The ray-fan plot is older: lens designers had plotted the miss of a ray against its height in the aperture, by hand, since the nineteenth century, and called it the aberration curve.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — image evaluation: spot diagrams, ray-intercept curves and encircled energy.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals*, 2nd ed. — ray-intercept plots and how to read them.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — spot diagrams, ray fans and the wavefront.'
  ],
  sim: 'ab-spot-fan'
},

/* ================================================================ Strehl ratio and diffraction-limited */
{
  id: 'strehl-ratio-and-diffraction-limited', parent: 'aberrations', title: 'The Strehl ratio and "diffraction-limited"', level: 3,
  short: 'The Strehl ratio is the peak brightness of the real image of a point as a fraction of the perfect one. For a wavefront error of σ waves RMS it is about exp(−(2πσ)²): above 0.8, which is σ below λ/14, the Maréchal criterion, a lens is called diffraction-limited.',
  keywords: ['Strehl ratio', 'Strehl', 'Maréchal criterion', 'Marechal', 'diffraction-limited', 'diffraction limited', 'Rayleigh quarter-wave rule', 'λ/14', 'RMS wavefront error', 'peak intensity', 'image quality metric', 'optical quality', 'quarter wave', 'tolerance'],
  prereq: ['wavefront-error-and-zernike-polynomials', 'the-airy-disk', 'spot-diagrams-and-ray-fans'],
  related: ['diffraction-limited-mtf', 'resolution-limits', 'the-point-spread-function', 'depth-of-focus', 'testing-optics-with-fringes', 'lens-tolerances-and-centration', 'the-f-number', 'the-modulation-transfer-function', 'what-aberrations-are'],
  body: `
A telescope maker and a lens-catalogue copywriter both say a lens is "diffraction-limited", and the phrase has an exact meaning. A perfect lens does not make a point of a point: it makes an Airy disc, because the light is a wave and the aperture is finite ([[the-airy-disk]]). The best any lens of that aperture can do is that disc, and a **diffraction-limited** lens is one that comes close enough to it that nobody could tell the difference.

### The Strehl ratio
Karl Strehl proposed in 1895 to measure the closeness by the brightness of the centre of the pattern. The **Strehl ratio** $S$ is the peak intensity of the real image of a point, divided by the peak intensity of the diffraction-limited image of the same aperture and wavelength. It is 1 for a perfect lens; aberrations take light out of the core and into the surroundings, and $S$ falls.

For small errors it depends only on the RMS wavefront error $\\sigma$ (in waves), not on what the errors are:

$$S \\approx e^{-(2\\pi\\sigma)^2} \\approx 1 - (2\\pi\\sigma)^2$$

| RMS error σ | λ/28 | λ/20 | **λ/14** | λ/10 | λ/7 |
|---|---|---|---|---|---|
| in nm at 550 nm | 20 | 28 | **39** | 55 | 79 |
| Strehl ratio | 0.95 | 0.91 | **0.82** | 0.67 | 0.45 |

### The two criteria
- **Maréchal:** a system is diffraction-limited when $S \\ge 0.8$, which is $\\sigma \\le \\lambda/14 = 0.071\\,\\lambda$ (André Maréchal, 1947).
- **Rayleigh:** a wavefront whose peak-to-valley error is under $\\lambda/4$ is practically perfect. For defocus and for balanced spherical aberration they are the same criterion: $\\lambda/4$ PV is $\\lambda/13.9$ RMS and $S = 0.80$. For the other shapes (coma, astigmatism, trefoil) a quarter-wave PV is a smaller RMS error, so the Rayleigh rule is the more demanding of the two.

For $S = 0.8$ the tolerances on the third-order terms, each balanced as the Zernike terms are, are:

| Aberration | Tolerance (waves) | Corresponding RMS |
|---|---|---|
| Defocus $W_{020}$ | 0.25 | 0.071 |
| Spherical $W_{040}$ (refocused) | 0.96 | 0.071 |
| Coma $W_{131}$ (tilt removed) | 0.61 | 0.071 |
| Astigmatism $W_{222}$ (refocused) | 0.35 | 0.071 |

Defocus of a quarter wave is a focus error of $\\pm 2\\lambda N^2$ — the depth of focus: ±17.6 µm at f/4 in green light.

### Diffraction-limited at what?
The claim is always *at a wavelength, an aperture and a field point*. At fixed glass, the error in nanometres is fixed, so in waves it grows as the wavelength falls: a system of 45 nm RMS is $\\lambda/14$ at 633 nm but 0.11 $\\lambda$ at 400 nm, with $S = 0.6$. Stopping down shrinks the aberrations faster than it grows the Airy disc: the 100 mm biconvex singlet has $W_{040}$ of 16 waves at f/4 and 1.0 wave at f/8 at the paraxial focus; refocused, 0.076 λ RMS and $S \\approx 0.8$. On axis it is diffraction-limited from about f/8 — though off axis the coma and astigmatism still decide.

### What the number hides
$S$ says how bright the peak is, not where the lost light goes. A lens with $S = 0.8$ has an MTF only a little below the perfect one ([[diffraction-limited-mtf]]); with $S < 0.5$ the approximation fails, and the shape of the error matters. A flat statement of "Strehl 0.9" is meaningless without the wavelength and field.

> [!key] Strehl ratio is the peak brightness of the real point image over the ideal one; for small errors it is exp(−(2πσ)²). Above 0.8, σ below λ/14 (the Maréchal criterion), the lens is diffraction-limited — at a stated wavelength, aperture and field.
`,
  ideas: [
    'The Strehl ratio is the peak intensity of the real point image divided by that of a perfect lens of the same aperture and wavelength.',
    'For small errors S ≈ exp(−(2πσ)²), a function of the RMS wavefront error σ alone.',
    'Maréchal: S ≥ 0.8 ⇔ σ ≤ λ/14; Rayleigh: PV ≤ λ/4 — the two agree for defocus and balanced spherical aberration.',
    '"Diffraction-limited" must carry a wavelength, an aperture and a field point; it is easier to reach at longer wavelengths and smaller apertures.',
    'Strehl says nothing about where the light goes: below about 0.5 the formula fails and the MTF or the point-spread function must be looked at.'
  ],
  pitfalls: [
    'A diffraction-limited lens is a perfect lens — It has up to λ/14 RMS of error, a Strehl ratio of 0.8: a fifth of the peak is lost, and no human eye or sensor would notice.',
    'A lens that is diffraction-limited at one wavelength is so at all — The error in nanometres is fixed, so in waves it is larger at shorter wavelengths. A lens λ/14 at 633 nm is not diffraction-limited in the blue.',
    'A λ/4 PV surface gives a λ/4 wavefront — For a mirror the wavefront error is twice the surface error, and a PV figure may be much worse than the RMS of the same surface.',
    'Strehl 0.8 and a sharp image are one and the same — Strehl is the peak only. Two lenses with the same Strehl ratio can differ in contrast at mid frequencies, depending on the shape of the error.'
  ],
  terms: [
    { term: 'Strehl ratio', also: ['Strehl', 'S', 'Strehl number'], def: 'The peak intensity of the real image of a point source, as a fraction of the peak of the diffraction-limited image of the same aperture and wavelength. 1 for a perfect system.' },
    { term: 'Diffraction-limited', also: ['diffraction limited'], def: 'Of an optical system: so well corrected that its image is limited by diffraction at the aperture. By convention a Strehl ratio of at least 0.8, at a stated wavelength, aperture and field point.' },
    { term: 'Maréchal criterion', also: ['Marechal criterion', 'λ/14 rule'], def: 'A system is diffraction-limited when its RMS wavefront error is at most λ/14 (0.071 λ), which gives a Strehl ratio of about 0.8.' },
    { term: 'Rayleigh quarter-wave rule', also: ['Rayleigh criterion for aberrations', 'quarter-wave criterion'], def: 'A wavefront error of no more than a quarter wavelength peak to valley has practically no effect on the image. For defocus it coincides with the Maréchal criterion.' },
    { term: 'Strehl (RMS) approximation', also: ['Maréchal approximation'], def: 'S ≈ exp(−(2πσ)²) for σ the RMS wavefront error in waves; valid for S above about 0.5.' }
  ],
  formulas: [
    {
      name: 'Strehl ratio from the RMS wavefront error',
      expr: 'S = exp(-(2*pi*sigma/lambda)^2)', tex: 'S = \\exp\\!\\left[-\\left(\\frac{2\\pi\\sigma}{\\lambda}\\right)^{2}\\right]',
      vars: {
        S: { name: 'Strehl ratio' },
        sigma: { name: 'RMS wavefront error', q: 'length', unit: 'nm', value: 39, tex: '\\sigma' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Small errors only: S above about 0.5. The default is the Maréchal limit.',
      stories: { S: 'A lens has an RMS wavefront error of {sigma}. What is its Strehl ratio at {lambda}?', sigma: 'What RMS wavefront error gives a Strehl ratio of {S} at {lambda}?' }
    },
    {
      name: 'Strehl ratio of several independent errors',
      expr: 'S = S1*S2*S3', tex: 'S = S_1\\,S_2\\,S_3',
      vars: {
        S: { name: 'total Strehl ratio' },
        S1: { name: 'Strehl ratio of the lens design', value: 0.95, min: 0, max: 1, tex: 'S_1' },
        S2: { name: 'Strehl ratio of the manufacturing errors', value: 0.92, min: 0, max: 1, tex: 'S_2' },
        S3: { name: 'Strehl ratio of the alignment and focus', value: 0.95, min: 0, max: 1, tex: 'S_3' }
      },
      note: 'Because the Strehl is an exponential of the squared RMS, and independent RMS errors add in quadrature, the Strehl ratios multiply.'
    },
    {
      name: 'Quarter-wave focus tolerance',
      expr: 'dz = 2*lambda*N^2', tex: '\\Delta z = 2\\,\\lambda\\,N^2',
      vars: {
        dz: { name: 'allowed focus error (either side)', q: 'length', unit: 'µm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64 }
      },
      note: 'The Rayleigh depth of focus: a quarter wave of defocus, Strehl 0.8.',
      stories: { dz: 'How far may a sensor be from the focus of an f/{N} lens in light of {lambda} before the Strehl ratio falls to 0.8?' }
    }
  ],
  examples: [
    {
      title: 'Diffraction-limited at the wrong colour',
      q: 'A lens has an RMS wavefront error of 45 nm. What are its Strehl ratios at 633 nm (red) and at 400 nm (violet)?',
      steps: [
        { text: 'At 633 nm, $\\sigma/\\lambda = 0.0711$:', tex: 'S = e^{-(2\\pi \\times 0.0711)^2} = e^{-0.1996} = 0.82' },
        { text: 'At 400 nm, $\\sigma/\\lambda = 0.1125$:', tex: 'S = e^{-(2\\pi \\times 0.1125)^2} = e^{-0.4996} = 0.61' }
      ],
      a: '0.82 in the red, diffraction-limited; 0.61 in the violet, not. The same lens, the same glass, and the verdict changes with the wavelength.'
    },
    {
      title: 'How good must each part be?',
      q: 'A system is to reach a Strehl ratio of 0.8 overall. The lens design uses up 0.95, and manufacturing is expected to give 0.90. What Strehl ratio is left for the alignment?',
      steps: [
        { text: 'The Strehl ratios multiply:', tex: 'S = S_1 S_2 S_3 \\;\\Rightarrow\\; S_3 = \\frac{0.8}{0.95 \\times 0.90} = 0.936' },
        { text: 'As an RMS error at 550 nm:', tex: '\\sigma = \\frac{\\lambda}{2\\pi}\\sqrt{-\\ln 0.936} = 0.041\\,\\lambda = 22.5\\ \\mathrm{nm}' }
      ],
      a: 'The alignment must give a Strehl ratio of 0.94, or 22.5 nm RMS of wavefront error — about λ/24. An error budget like this is how a diffraction-limited system is specified in practice.'
    }
  ],
  quiz: [
    { q: 'The Maréchal criterion says that a system is diffraction-limited when the RMS wavefront error is at most…', choices: ['λ/14', 'λ/4', 'λ/100', 'λ'], a: 0, why: '$\\sigma \\le \\lambda/14 = 0.071\\lambda$ gives $S = e^{-(2\\pi \\times 0.071)^2} = 0.8$. λ/4 is the Rayleigh limit on the peak-to-valley error.' },
    { q: 'A wavefront has an RMS error of λ/10. What is the Strehl ratio, to two decimal places?', answer: 0.67, why: '$S = e^{-(2\\pi/10)^2} = e^{-0.3948} = 0.674$.' },
    { q: 'A lens that is diffraction-limited at 633 nm is therefore diffraction-limited at 400 nm.', a: false, why: 'The wavefront error in nanometres stays the same, so in waves it is 633/400 = 1.6 times larger at 400 nm, and the Strehl ratio falls: a lens of λ/14 at 633 nm has λ/8.8 at 400 nm, S = 0.6.' },
    { q: 'Which statement about the Strehl ratio is correct?', choices: ['It is the peak intensity of the real image divided by that of the ideal one', 'It is the width of the Airy disc', 'It is the f-number divided by the wavelength', 'It is the number of waves of defocus'], a: 0, why: 'That is its definition. It depends on the RMS wavefront error, approximately as exp(−(2πσ)²).' },
    { q: 'Three independent errors have Strehl ratios of 0.95, 0.9 and 0.9. What is the combined Strehl ratio?', choices: ['About 0.77', 'About 0.92', 'About 0.95', 'About 2.75'], a: 0, why: 'Strehl ratios of independent errors multiply: 0.95 × 0.9 × 0.9 = 0.77. That is below the 0.8 limit even though each part looks good.' }
  ],
  applications: [
    'Telescopes and microscope objectives are often sold as diffraction-limited, meaning a Strehl ratio above 0.8 on axis at the stated wavelength.',
    'Photolithography and space optics ask for far better than 0.8: λ/28 RMS (Strehl 0.95) is common, and projection lenses for lithography reach a few nanometres RMS, below λ/50, at 193 nm.',
    'Laser focusing and beam delivery: a diffraction-limited focusing lens puts as much power as the beam allows into the smallest spot, and the spot size grows as the Strehl falls.',
    'Camera lenses are seldom diffraction-limited at full aperture; a good lens becomes so, in the centre, at two or three stops down, at about f/5.6 to f/8.',
    'Adaptive optics: the figure of merit of a corrected telescope is the Strehl ratio it reaches (0.3 to 0.9, depending on wavelength and conditions).'
  ],
  history: 'Karl Strehl, a German physicist, introduced in 1895 the "Definitionshelligkeit" — definition brightness — as the peak intensity of an imperfect telescope image relative to the perfect one. Lord Rayleigh had shown earlier that a quarter-wave wavefront error does little damage. André Maréchal, in a paper of 1947, derived the relation between the Strehl ratio and the RMS wavefront error and the λ/14 limit, which became the working definition of "diffraction-limited".',
  sources: [
    'M. Born and E. Wolf, *Principles of Optics*, ch. 9 — the Rayleigh and Maréchal criteria and the Strehl ratio for small aberrations.',
    'V. N. Mahajan, *Optical Imaging and Aberrations*, Part II: Wave Diffraction Optics (SPIE Press) — the Strehl ratio, aberration tolerances and balancing.',
    'W. J. Smith, *Modern Optical Engineering* — the Rayleigh quarter-wave rule, the Strehl ratio and the Maréchal approximation.'
  ],
  sim: 'ab-strehl'
}

);
