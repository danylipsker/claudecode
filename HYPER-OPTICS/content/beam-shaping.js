/* HYPER-OPTICS · content/beam-shaping.js — shaping beams: points, lines, sheets, rings, flat tops, patterns, holograms,
 * concentrators, pinhole filters and flat optics. Simulations are in sims/beam-shaping.js (prefix bs-).
 */
Hyper.add(

/* ================================================================ overview */
{
  id: 'beam-shaping-overview', parent: 'beam-shaping', title: 'Beam shaping: what can be done', level: 1,
  short: 'A laser leaves its housing as a thin round Gaussian spot. Beam shaping turns it into the light a job needs: a point, a line, a sheet, a ring, an evenly lit patch, a grid of dots or any picture. A few families of optics do it, and one rule limits them all: light can be redistributed, never made brighter.',
  keywords: ['beam shaping', 'laser beam shaping', 'top hat', 'flat top', 'laser line', 'light sheet', 'ring beam', 'pattern generator', 'homogenizer', 'DOE', 'SLM', 'beam profile', 'beam parameter product', 'BPP'],
  prereq: ['the-gaussian-beam', 'what-makes-laser-light-special', 'beam-quality-m-squared'],
  related: ['focusing-to-a-point', 'laser-line-generators', 'light-sheets', 'axicons-and-bessel-beams', 'flat-top-beam-shapers', 'diffractive-optical-elements', 'spatial-light-modulators', 'concentrating-light', 'etendue', 'radiance-and-its-conservation'],
  body: `
A laser beam comes out of its housing as a small round spot, brightest at the centre and fading smoothly towards the edge: the [[the-gaussian-beam|Gaussian beam]]. That is seldom the shape a job needs. A levelling tool wants a thin line that stays straight across a room, a flow experiment a flat sheet, a laser welder an evenly lit patch, a depth camera a few thousand dots. **Beam shaping** is everything placed between the laser and the target to turn one into the other.

### What is wanted, and what makes it
| You want | Typical optic | Page |
|---|---|---|
| the smallest spot | focusing lens, asphere, objective | [[focusing-to-a-point]] |
| a line | cylinder, rod or Powell lens | [[laser-line-generators]] |
| a thin sheet | cylinder lenses | [[light-sheets]] |
| a ring, or a long needle of focus | axicon (a cone-shaped lens) | [[axicons-and-bessel-beams]] |
| an even, flat-topped patch | refractive shaper, lenslet array | [[flat-top-beam-shapers]], [[microlens-arrays]] |
| dots, grids, shapes | diffractive element, hologram | [[diffractive-optical-elements]], [[pattern-projectors]] |
| any pattern, changed at will | spatial light modulator | [[spatial-light-modulators]] |
| a clean, smooth beam | pinhole spatial filter | [[cleaning-a-beam-with-a-pinhole]] |
| as much light as possible on a small target | concentrator | [[concentrating-light]] |

### Four ways to bend light
- **Refract.** Lenses and prisms: the oldest tools and the most efficient, 95 % or more of the light with a good coating.
- **Reflect.** Mirrors of every curved shape, which also work at wavelengths where glass does not.
- **Diffract.** A relief or a pattern of fringes less than a micrometre deep steers light by interference: [[diffractive-optical-elements]], [[holographic-optical-elements]], and the programmable kind, [[spatial-light-modulators]].
- **Structure the wavefront.** Fields of sub-wavelength pillars set the phase point by point: [[metalenses-and-flat-optics]].

### The one rule
Optics can move light about, but it cannot squeeze it into a smaller, straighter beam than the laser gave. The size of a beam waist times the half-angle at which it spreads, the **beam parameter product**, is fixed by the source:

$$w_0\\,\\theta = M^2\\,\\frac{\\lambda}{\\pi}$$

For a perfect beam ($M^2 = 1$) at 532 nm that is 0.169 mm·mrad. Squeeze the waist to 10 µm and the beam spreads at 17 mrad, a degree. The same rule, stated for lamps and LEDs, is [[etendue]]; see also [[radiance-and-its-conservation]].

### Shaping costs light — or it should not
The cheapest "shaper" is a hole. A Gaussian beam of radius $w$ through a round aperture of radius $a$ passes the fraction $1 - e^{-2a^2/w^2}$, and the edge of the patch is $e^{-2a^2/w^2}$ as bright as its centre. To get an edge within 10 % of the centre the aperture must be so small that only **10 %** of the light gets through. A designed shaper ([[flat-top-beam-shapers]]) delivers the same flatness with nearly all of it.

> [!key] Beam shaping redistributes light with lenses, mirrors, diffraction and structured surfaces. The beam parameter product $w_0\\theta = M^2\\lambda/\\pi$ cannot be reduced: a tighter waist means a faster spread.
`,
  ideas: [
    'The Gaussian spot of a laser can be turned into a point, line, sheet, ring, flat top, grid of dots or an arbitrary picture.',
    'Four tools do it: refraction (lenses), reflection (mirrors), diffraction (reliefs, holograms, programmable modulators) and sub-wavelength structures.',
    'The beam parameter product w₀θ = M²λ/π cannot be reduced by any passive optic.',
    'A hard aperture is the crudest shaper and throws most of the light away; designed shapers keep nearly all of it.',
    'Every shaped pattern is right at a particular plane; beyond it diffraction changes the shape.'
  ],
  pitfalls: [
    'A beam shaper can make the beam brighter — It cannot. It redistributes power; the beam parameter product (étendue) never falls, so a shaped beam is at best as bright, per unit area and angle, as the laser that fed it.',
    'Clipping a Gaussian beam with an aperture gives a good flat top — The edge stays dim relative to the centre unless the aperture is tiny: for an edge at 90 % of the centre only 10 % of the power passes.',
    'A flat-topped beam stays flat as it travels — Diffraction rounds off the edges and ripples the top within a distance set by the beam size; the profile is flat only at the plane the shaper was designed for.',
    'Any beam can be shaped into any pattern — The beam\'s own quality limits it: a beam with $M^2 = 10$ cannot be focused to a spot smaller than ten times the diffraction-limited one, whatever the optic.'
  ],
  terms: [
    { term: 'Beam shaping', also: ['beam forming'], def: 'Optics that change the intensity distribution of a beam across its section, or turn it into a line, sheet, ring or pattern, while keeping most of the power.' },
    { term: 'Beam profile', also: ['intensity profile', 'beam cross-section'], def: 'How the intensity varies across the section of a beam. A laser usually gives a Gaussian profile; shaping produces others.' },
    { term: 'Top-hat beam', also: ['flat-top beam', 'uniform beam'], def: 'A beam with nearly constant intensity over a patch and little outside it. It is made by a shaper, never by the laser itself.' },
    { term: 'Clipping', also: ['hard aperture', 'truncation'], def: 'Cutting a beam with an aperture to keep its centre. It gives a flatter patch but throws away most of the power: the crudest form of beam shaping.' },
    { term: 'Redistribution', also: ['power mapping'], def: 'Moving the power of a beam to new positions, as a shaper does, without absorbing it. The beam parameter product (étendue) stays the same or grows.' }
  ],
  formulas: [
    {
      name: 'Beam parameter product',
      expr: 'M2 = pi*w0*theta/lambda', tex: 'M^2 = \\frac{\\pi\\,w_0\\,\\theta}{\\lambda}',
      vars: {
        M2: { name: 'beam quality factor', value: 1, min: 1, max: 100, tex: 'M^2' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.5, tex: 'w_0' },
        theta: { name: 'divergence half-angle', q: 'angle', unit: 'mrad', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' }
      },
      solveFor: 'theta',
      note: 'Waist radius and half-angle of the 1/e² beam. M² = 1 is the best a beam can be.',
      stories: { theta: 'A beam of quality M² = {M2} at {lambda} has a waist of radius {w0}. How fast does it spread?', w0: 'A beam of quality M² = {M2} at {lambda} must spread by no more than {theta}. What waist radius does that need at least?' }
    },
    {
      name: 'Power through a round aperture',
      expr: 'P = 1 - exp(-2*a^2/w^2)', tex: 'P = 1 - e^{-2a^2/w^2}',
      vars: {
        P: { name: 'fraction of the power passed', q: 'ratio', unit: '%' },
        a: { name: 'aperture radius', q: 'length', unit: 'mm', value: 2 },
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm', value: 4 }
      },
      note: 'For a Gaussian beam centred on the aperture. The edge of the patch is (1 − P) of the centre intensity.',
      stories: { P: 'A Gaussian beam of radius {w} meets a round hole of radius {a}. What fraction of its power gets through?', a: 'What radius of hole passes {P} of a Gaussian beam of radius {w}?' }
    }
  ],
  examples: [
    {
      title: 'A flat top by clipping',
      q: 'A 532 nm beam has a radius $w = 3$ mm. A round aperture of radius 1.0 mm is placed in it to make a "flat top". How flat is the patch, and how much light is left?',
      steps: [
        { text: 'The edge of the hole is at $a/w = 1/3$ of the beam radius, where the intensity is', tex: 'e^{-2(1/3)^2} = e^{-0.222} = 0.80' },
        { text: 'The power passed is', tex: '1 - 0.80 = 0.20' }
      ],
      a: 'The patch varies by 20 % from centre to edge, and only 20 % of the power gets through: 80 % is thrown away to make a patch that is still not flat.'
    },
    {
      title: 'How hard can a perfect beam be squeezed?',
      q: 'A single-mode 532 nm laser has $M^2 = 1.1$. It is focused to a waist of radius 10 µm. How wide a cone does the beam spread into afterwards?',
      steps: [
        { text: 'The divergence half-angle is', tex: '\\theta = \\frac{M^2\\lambda}{\\pi w_0} = \\frac{1.1 \\times 532\\ \\mathrm{nm}}{\\pi \\times 10\\ \\mu\\mathrm{m}} = 18.6\\ \\mathrm{mrad}' },
        'That is 1.07°, a full cone of 2.1°. At 1 m the beam is about 19 mm in radius.'
      ],
      a: 'Half-angle 18.6 mrad. A micrometre-sharp spot cannot also be a pencil: the two are tied by $w_0\\theta = 0.19$ mm·mrad.'
    }
  ],
  quiz: [
    { q: 'Which of these can a passive beam-shaping optic NOT do?', choices: ['Turn a round spot into a line', 'Make a flat-topped patch from a Gaussian beam', 'Reduce the beam parameter product of a beam', 'Split a beam into a grid of dots'], a: 2, why: 'Lenses, mirrors and diffractive elements redistribute light but cannot lower $w_0\\theta$ (the étendue); that would make the beam brighter than its source.' },
    { q: 'A Gaussian beam of radius 4 mm meets a round hole of radius 2 mm. What percentage of the power passes?', answer: 39.3, unit: '%', why: '$1 - e^{-2a^2/w^2} = 1 - e^{-0.5} = 0.393$.' },
    { q: 'A top-hat profile made by a good shaper stays a top hat at any distance after the shaper.', a: false, why: 'Diffraction rounds the edges and ripples the plateau as the beam travels. The shape is right at the plane the shaper was designed for, and often only there.' },
    { q: 'Which optic gives a ring of light?', choices: ['Cylinder lens', 'Axicon', 'Powell lens', 'Beam expander'], a: 1, why: 'An axicon is a cone-shaped lens: every ring of the beam is bent towards the axis by the same angle.' },
    { q: 'A $M^2 = 1$ beam of 633 nm light has a waist of radius 0.5 mm. What is its divergence half-angle, in mrad?', answer: 0.403, unit: 'mrad', why: '$\\theta = \\lambda/(\\pi w_0) = 633\\ \\mathrm{nm}/(\\pi \\times 0.5\\ \\mathrm{mm}) = 0.403$ mrad.' }
  ],
  applications: [
    'Levelling and alignment tools: line generators turn a pointer-sized beam into a line across a room.',
    'Laser processing: flat-topped spots for even heating in annealing, welding and surface treatment.',
    'Depth cameras and face-recognition modules: a diffractive element copies one beam into thousands of dots.',
    'Light-sheet microscopes: a sheet a few micrometres thick slices through a transparent specimen.',
    'Solar power: mirrors and lenses concentrate sunlight onto a small receiver.'
  ],
  history: 'Beam shaping began with the first lasers of the 1960s, when cylinder lenses and hard apertures were all there was. Dammann gratings in 1971 showed that one diffractive element could make a whole array of equal spots; the Powell lens of the 1980s made a uniform line; computer-designed diffractive elements followed the progress of lithography in the 1990s, and metasurfaces appeared in the 2010s.',
  sources: [
    'F. M. Dickey (ed.), *Laser Beam Shaping: Theory and Techniques* (CRC Press) — the standard reference on refractive, diffractive and homogenizing shapers.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — the Gaussian beam and its propagation.',
    'A. E. Siegman, *Lasers*, the chapters on Gaussian beams and beam quality — the beam parameter product and M².'
  ],
  sim: 'bs-gallery'
},

/* ================================================================ focusing to a point */
{
  id: 'focusing-to-a-point', parent: 'beam-shaping', title: 'Concentrating light to a point', level: 2,
  short: 'A lens turns a laser beam into a small bright spot, but never a point. Three things set its size: diffraction (the beam and lens are finite), the beam\'s own quality M², and the aberrations of the lens. A good lens leaves only the first two, and the smaller the spot, the shorter the distance over which it stays small.',
  keywords: ['focusing', 'focal spot', 'spot size', 'diffraction limited spot', 'Airy disc', 'beam waist', 'depth of focus', 'numerical aperture', 'asphere', 'spherical aberration', 'M squared', 'laser focusing lens', 'best form lens'],
  prereq: ['focusing-a-laser-beam', 'the-airy-disk', 'spherical-aberration'],
  related: ['rayleigh-range', 'beam-quality-m-squared', 'aspheric-surfaces', 'numerical-aperture', 'spot-diagrams-and-ray-fans', 'strehl-ratio-and-diffraction-limited', 'beam-expanders', 'laser-marking-and-cutting-heads'],
  body: `
Focusing is the most common shaping job and the one with the plainest physics: a lens bends a parallel beam towards a point. It never gets there. Three effects set the size of the spot, and each can be the largest in turn.

### The Gaussian limit
A [[the-gaussian-beam|Gaussian beam]] of radius $w$ (to the $1/e^2$ intensity) focused by a lens of focal length $f$ gives a waist of radius

$$w_0 = M^2\\,\\frac{\\lambda f}{\\pi w}$$

with $M^2$ the [[beam-quality-m-squared|beam quality]]. A wide beam gives a small spot; that is why laser beams are expanded before they are focused ([[beam-expanders]]).

| Light | Beam radius | $f$ | $M^2$ | Waist radius | Rayleigh range |
|---|---|---|---|---|---|
| 532 nm | 1 mm | 100 mm | 1 | 16.9 µm | 1.69 mm |
| 532 nm | 2 mm | 100 mm | 1 | 8.5 µm | 0.42 mm |
| 633 nm | 5 mm | 100 mm | 1 | 4.0 µm | 0.08 mm |
| 1064 nm | 2 mm | 100 mm | 1 | 16.9 µm | 0.85 mm |
| 1064 nm | 2 mm | 100 mm | 10 | 169 µm | 8.5 mm |

### The lens aperture and the Airy disc
A lens of diameter $D$ also cuts the beam. A uniformly lit circular lens of f-number $N = f/D$ makes an [[the-airy-disk|Airy disc]] of diameter $2.44\\,\\lambda N$: 5.2 µm at f/4 and 10.4 µm at f/8 in green light. In terms of the [[numerical-aperture|numerical aperture]] the radius is $0.61\\,\\lambda/\\mathrm{NA}$: 1.3 µm for a NA 0.25 objective, 0.36 µm for NA 0.9.

### The beam itself
$M^2$ multiplies the spot. A multimode laser with $M^2 = 10$ focuses to a waist ten times larger than a perfect beam through the same lens (the last row), and no lens can fix it; only a better beam, or a smaller aperture at the cost of power, will.

### The lens
A spherical surface does not focus a wide beam to one point: rays near the edge cross the axis too soon ([[spherical-aberration]]). For a 100 mm N-BK7 plano-convex lens at 633 nm, with its curved side towards the beam, the blur radius found by tracing rays is 3.6 µm at f/10 (inside the 7.7 µm Airy radius: diffraction-limited), **29 µm at f/5** (7.5 times the 3.9 µm Airy radius) and 140 µm at f/2.5. Turned the wrong way the same lens is four times worse at f/5. A lens whose second face is aspheric, with conic constant $k = -n^2$ and the flat face towards the beam, puts every ray of an on-axis beam through one point, leaving only diffraction ([[aspheric-surfaces]]). That is why laser focusing lenses are aspheres, achromats or microscope objectives, and why a simple lens is stopped down.

### Small spot, short depth
The beam stays within a factor $\\sqrt{2}$ of its waist over $\\pm z_R$, where $z_R = \\pi w_0^2/(M^2\\lambda)$ ([[rayleigh-range]]). A 4 µm waist at 633 nm is that tight over only 80 µm either side. A thick, uneven workpiece wants a longer focus and a bigger spot.

> [!key] Spot radius $w_0 = M^2\\lambda f/(\\pi w)$: expand the beam, shorten the focal length, improve $M^2$ or use a shorter wavelength to shrink it, and use an asphere so the lens does not spoil it. The price is a shorter depth of focus.
`,
  ideas: [
    'A lens focuses a Gaussian beam to a waist w₀ = M²λf/(πw): a wider beam or a shorter focal length gives a smaller spot.',
    'The lens aperture limits the spot through the Airy disc, 2.44 λN across for a uniformly lit lens.',
    'M² multiplies the spot: a beam with M² = 10 focuses to a ten times larger waist, whatever the lens.',
    'A spherical lens blurs a fast focus by spherical aberration; an asphere removes it and leaves only diffraction.',
    'A smaller spot has a shorter depth of focus (2z_R grows with the square of the spot size).'
  ],
  pitfalls: [
    'A laser can be focused to a point — Never: diffraction gives a finite spot, at best a few wavelengths across, however good the lens.',
    'A lens of shorter focal length always gives the smaller spot — Only if the beam fills it and the lens is good enough: with a narrow beam the spot is $\\lambda f/\\pi w$ but the aberrations of a fast simple lens soon grow larger than that.',
    'Better optics can focus a poor beam to a small spot — The spot scales with $M^2$; a multimode beam has the same limit through any lens.',
    'The tightest focus is always best — The depth of focus shrinks as the square of the spot: a 5 µm spot is 25 times shallower than a 25 µm one, and tolerates no warp or height error of the work.'
  ],
  terms: [
    { term: 'Best focus', also: ['plane of least confusion'], def: 'The plane of smallest blur of a lens with spherical aberration. It lies in front of the paraxial focus.' },
    { term: 'Beam fill', also: ['filling the lens', 'truncation ratio'], def: 'The ratio of the beam diameter to the clear aperture of the lens. A beam that overfills the lens is clipped and loses power; one that underfills it gives a bigger spot.' },
    { term: 'Focal spot size', also: ['spot diameter'], def: 'The diameter of the illuminated patch at focus, usually 2w₀ (to 1/e²) or the full width at half maximum, which is 1.18 w₀ across.' }
  ],
  formulas: [
    {
      name: 'Focused spot of a Gaussian beam',
      expr: 'w0 = M2*lambda*f/(pi*w)', tex: 'w_0 = \\frac{M^2\\,\\lambda\\,f}{\\pi\\,w}',
      vars: {
        w0: { name: 'waist radius at focus', q: 'length', unit: 'µm', tex: 'w_0' },
        M2: { name: 'beam quality', value: 1, min: 1, max: 100, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        w: { name: 'beam radius at the lens (1/e²)', q: 'length', unit: 'mm', value: 2 }
      },
      solveFor: 'w0',
      note: 'The beam is collimated, centred on the lens and not clipped by it. Spot diameter is twice w₀.',
      stories: { w0: 'A beam of radius {w} and quality M² = {M2}, {lambda}, is focused by a lens of focal length {f}. What is the waist radius?', w: 'To focus a {lambda} beam with M² = {M2} to a waist of {w0} with a lens of focal length {f}, how large must the beam radius be?' }
    },
    {
      name: 'Depth of focus',
      expr: 'zR = pi*w0^2/(M2*lambda)', tex: 'z_R = \\frac{\\pi\\,w_0^2}{M^2\\,\\lambda}',
      vars: {
        zR: { name: 'Rayleigh range', q: 'length', unit: 'mm', tex: 'z_R' },
        w0: { name: 'waist radius', q: 'length', unit: 'µm', value: 10, tex: 'w_0' },
        M2: { name: 'beam quality', value: 1, min: 1, max: 100, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' }
      },
      note: 'The beam radius grows to √2 w₀ at ±z_R; the depth of focus is 2z_R.',
      stories: { zR: 'A {lambda} beam with M² = {M2} is focused to a waist of radius {w0}. What is its Rayleigh range?' }
    },
    {
      name: 'Airy radius from the numerical aperture',
      expr: 'r = 0.61*lambda/NA', tex: 'r = \\frac{0.61\\,\\lambda}{\\mathrm{NA}}',
      vars: {
        r: { name: 'radius of the Airy disc', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 0.25, min: 0.01, max: 1.4, tex: '\\mathrm{NA}' }
      },
      note: 'A uniformly lit lens with no aberrations. The radius is measured to the first dark ring.'
    }
  ],
  examples: [
    {
      title: 'An engraving spot',
      q: 'A fibre laser at 1064 nm ($M^2 = 1.5$) delivers a collimated beam of radius 3 mm to a lens of focal length 160 mm. What are the spot size and the depth of focus?',
      steps: [
        { text: 'The waist radius is', tex: 'w_0 = \\frac{1.5 \\times 1.064\\ \\mu\\mathrm{m} \\times 160\\ \\mathrm{mm}}{\\pi \\times 3\\ \\mathrm{mm}} = 27.1\\ \\mu\\mathrm{m}' },
        { text: 'so the spot is 54 µm across. The Rayleigh range is', tex: 'z_R = \\frac{\\pi\\,w_0^2}{M^2\\lambda} = \\frac{\\pi\\,(27.1\\ \\mu\\mathrm{m})^2}{1.5 \\times 1.064\\ \\mu\\mathrm{m}} = 1.45\\ \\mathrm{mm}' }
      ],
      a: 'A spot 54 µm across that stays within √2 of that over 2.9 mm. A part whose height varies by more than about ±1.4 mm goes out of focus.'
    },
    {
      title: 'How wide must the beam be?',
      q: 'A perfect 532 nm beam is to be focused by a 100 mm lens to a spot 20 µm across (1/e²). What beam radius must reach the lens?',
      steps: [
        { text: 'Solve $w_0 = \\lambda f/(\\pi w)$ for $w$ with $w_0 = 10$ µm:', tex: 'w = \\frac{\\lambda f}{\\pi\\,w_0} = \\frac{0.532\\ \\mu\\mathrm{m} \\times 100\\ \\mathrm{mm}}{\\pi \\times 10\\ \\mu\\mathrm{m}} = 1.69\\ \\mathrm{mm}' }
      ],
      a: 'A beam radius of 1.7 mm (3.4 mm across). A 1 mm beam would give 34 µm; a beam expander of 2× fixes it.'
    }
  ],
  quiz: [
    { q: 'A laser beam is expanded to twice its diameter before a fixed focusing lens. The focal spot becomes…', choices: ['twice as large', 'half as large', 'unchanged', 'a point'], a: 1, why: '$w_0 = M^2\\lambda f/(\\pi w)$: the waist is inversely proportional to the beam radius at the lens, as long as the lens does not clip the beam and is good enough.' },
    { q: 'Two lasers of the same wavelength and beam size are focused with the same lens. One has $M^2 = 1$, the other $M^2 = 4$. How do the spots compare?', choices: ['The second is 4 times larger', 'The second is 2 times larger', 'The second is 16 times larger', 'They are equal'], a: 0, why: 'The waist radius is proportional to $M^2$. Beam quality is the factor no lens can remove.' },
    { q: 'A lens of larger f-number always focuses to a smaller diffraction-limited spot.', a: false, why: 'The Airy disc is $2.44\\lambda N$ across: a larger f-number gives a *larger* spot. Fast (low N) lenses make smaller spots, provided their aberrations are controlled.' },
    { q: 'What is the diameter of the Airy disc, in µm, of a perfect lens at f/8 in 532 nm light?', answer: 10.4, unit: 'µm', why: '$2.44 \\times 0.532\\ \\mu\\mathrm{m} \\times 8 = 10.4$ µm.' },
    { q: 'A plano-convex lens with the curved side towards a collimated beam is stopped down from f/2.5 to f/10. Why does the focal spot get so much smaller even though diffraction gets worse?', choices: ['Spherical aberration, which grows fast with aperture, falls away', 'The lens becomes an asphere', 'The beam quality improves', 'The wavelength shortens'], a: 0, why: 'At f/2.5 the geometric blur is about 140 µm; at f/10 only 3.6 µm, below the 7.7 µm Airy radius. Aberration grows with a high power of the aperture, diffraction only as the f-number.' }
  ],
  applications: [
    'Laser marking, cutting and welding heads, which expand the beam and focus it with one lens or a scanning lens.',
    'Optical data storage: a pickup lens focuses a laser to a spot below a micrometre.',
    'Laser pointers and barcode scanners, which focus to a spot size that matches the finest bar.',
    'Optical tweezers and laser surgery, with microscope objectives of NA 0.9 and more.',
    'Fibre coupling: the spot must match the core mode of the fibre.'
  ],
  history: 'The recipe for focusing a Gaussian beam, a waist that depends inversely on the beam size at the lens, came in the mid-1960s, soon after the first lasers, from Kogelnik and Li and others. It overturned the picture of rays that cross exactly at a focus: the waist and the Rayleigh range appear as soon as the beam is treated as a wave.',
  sources: [
    'A. E. Siegman, *Lasers*, the chapters on Gaussian beams — the focused waist, M² and the Rayleigh range.',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966) — the Gaussian beam and its transformation by lenses.',
    'W. J. Smith, *Modern Optical Engineering*, the chapters on diffraction and on aberrations — the Airy disc and the spherical-aberration blur.'
  ],
  sim: 'bs-focus'
},

/* ================================================================ line generators */
{
  id: 'laser-line-generators', parent: 'beam-shaping', title: 'Making a line: cylinder and Powell lenses', level: 2,
  short: 'A cylinder lens, a rod lens or a Powell lens fans a laser beam out in one direction only, turning a dot into a line. A plain cylinder lens makes a bright centre with faint ends; a Powell lens redistributes the light into a nearly uniform line.',
  keywords: ['laser line', 'line generator', 'cylinder lens', 'rod lens', 'Powell lens', 'fan angle', 'line laser', 'cross-line laser', 'levelling laser', 'uniform line', 'laser stripe', 'structured light line'],
  prereq: ['beam-shaping-overview', 'cylindrical-and-toric-lenses', 'the-gaussian-beam'],
  related: ['light-sheets', 'laser-triangulation', 'flat-top-beam-shapers', 'diffractive-optical-elements', 'barcode-scanners', 'alignment-telescopes-and-lasers', 'laser-safety-classes'],
  body: `
A laser pointer makes a dot. Spread that dot in one direction only and you get a line: the laser stripe of a levelling tool, a 3-D profiler, a cutting guide. All it takes is a lens that has curvature in one direction and none across it.

### How the fan is made
A **cylinder lens** (or a negative one) bends light in one plane only. A glass **rod lens** does the same with a plain rod: a rod of diameter $d$ and index $n$ has a focal length $f = nd/(4(n-1))$, 0.73 mm for a 1 mm rod of N-BK7. The beam is focused to a line and leaves in a fan, half-angle set by the beam width $D$ and the focal length $f$ (see [[cylindrical-and-toric-lenses]]):

$$\\text{fan angle} = 2\\arctan\\frac{D}{2f}$$

A 1 mm beam through a rod lens of focal length $f$ gives:

| $f$ | 5 mm | 2 mm | 1 mm | 0.5 mm | 0.25 mm |
|---|---|---|---|---|---|
| fan angle | 11.4° | 28.1° | 53.1° | 90° | 127° |
| line length at 1 m | 0.2 m | 0.5 m | 1.0 m | 2.0 m | 4.0 m |

The line length at a distance $z$ is $L = 2z\\tan(\\text{fan}/2)$. The other direction is unchanged: the line is as thin as the beam.

### Bright centre, dim ends
A Gaussian beam stays Gaussian in the fan. If the lens is about 1.5 times wider than the beam's $1/e^2$ diameter, the intensity at half of the half-length is 33 % of the centre, and the ends are at 1 %. The usable line is only the middle: the brightness stays within 20 % of the centre over just the central fifth of the length.

### The Powell lens
A **Powell lens** looks like a prism with a rounded roof. The bright centre of the beam falls on the steeply curved ridge and is thrown out widely; the faint wings of the beam meet the gentle shoulders and are bent less, so the light is moved from the centre to the ends. In the model of the simulation the line varies by 15 % over its whole length (85 % at the centre, 100 % at the ends), against a factor of 80 for the cylinder lens. It works for a beam of one size, with one design fan angle and a beam centred on its ridge.

### Thickness and the working range
The thickness of the line is set by the other axis. A line focused to a 1 mm thickness at 532 nm stays within a factor $\\sqrt{2}$ of that over ±1.5 m; a line focused to 50 µm over only ±3.7 mm ([[rayleigh-range]]). For 3-D profiling the line is aligned with a camera at an angle, and its thickness sets the depth resolution ([[laser-triangulation]]).

### Safety
> [!warn] A line laser is still a laser. Its class depends on the total power, not on how far it is spread; spreading helps only far from the lens. Never look into the line or its reflection from a shiny surface; see [[laser-safety-classes]].

> [!key] A rod or cylinder lens fans a beam into a line of angle $2\\arctan(D/2f)$ whose length grows with distance. A Gaussian beam leaves a bright centre; a Powell lens evens the line out.
`,
  ideas: [
    'A lens curved in one direction only fans a laser dot out into a line; the fan angle is 2 arctan(D/2f).',
    'A rod lens of diameter d and index n has focal length nd/(4(n − 1)): about 0.73 d for glass.',
    'The line length at distance z is 2z tan(fan/2); a 90° fan gives a line twice as long as its distance.',
    'A plain cylinder lens keeps a Gaussian profile along the line: bright centre, faint ends.',
    'A Powell lens moves light from the centre to the ends and makes a nearly uniform line, but only for the beam it was designed for.'
  ],
  pitfalls: [
    'The line is as bright as the dot — The power is spread along its length: a 90° line at 1 m is 2 m long, so each millimetre of it gets only a tiny fraction of the power.',
    'A line laser is safe because its beam is spread out — Spreading lowers the irradiance only away from the lens; the total power, and the hazard near the exit and from reflections, remain.',
    'A cylinder lens makes a uniform line — It keeps the Gaussian profile: the ends are at about 1 % of the centre for a lens 1.5 beam diameters wide. Only a Powell lens or a diffractive element makes it uniform.',
    'The line stays equally thin at all distances — Its thickness follows the other axis: a thin line is thin only near its waist and spreads beyond the Rayleigh range.'
  ],
  terms: [
    { term: 'Line generator', also: ['laser line optic', 'line lens'], def: 'An optic that spreads a laser beam into a line: a cylinder lens, a rod lens, a Powell lens or a diffractive element.' },
    { term: 'Rod lens', also: ['cylinder rod'], def: 'A cylinder of glass whose round surface acts as a lens in one plane. Its focal length is nd/(4(n − 1)) for diameter d and index n.' },
    { term: 'Powell lens', def: 'A line-generating lens with a rounded, prism-like profile that redistributes light from the centre of a Gaussian beam to the ends, giving an almost uniform line.' },
    { term: 'Fan angle', also: ['full fan angle', 'line angle'], def: 'The total angle between the two ends of a laser line, seen from the lens: 2 arctan(D/2f) for a beam of width D and a cylinder lens of focal length f.' },
    { term: 'Line uniformity', def: 'How evenly the intensity is spread along the line, stated as the largest difference from the mean over a given part of its length.' }
  ],
  formulas: [
    {
      name: 'Fan angle of a cylinder lens',
      expr: 'phi = 2*atan(D/(2*f))', tex: '\\varphi = 2\\arctan\\frac{D}{2f}',
      vars: {
        phi: { name: 'full fan angle', q: 'angle', unit: '°', tex: '\\varphi' },
        D: { name: 'beam width at the lens', q: 'length', unit: 'mm', value: 1 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 1 }
      },
      solveFor: 'phi',
      note: 'The line is the cone of the focused beam, seen from its focus. A negative lens gives the same angle with a virtual line.',
      stories: { phi: 'A beam {D} wide meets a cylinder lens of focal length {f}. What is the fan angle?', f: 'A beam {D} wide must be fanned to {phi}. What focal length is needed?' }
    },
    {
      name: 'Length of the line',
      expr: 'L = 2*z*tan(phi/2)', tex: 'L = 2z\\tan\\frac{\\varphi}{2}',
      vars: {
        L: { name: 'line length', q: 'length', unit: 'm' },
        z: { name: 'distance from the lens', q: 'length', unit: 'm', value: 1 },
        phi: { name: 'full fan angle', q: 'angle', unit: '°', value: 60, min: 1, max: 170, tex: '\\varphi' }
      },
      note: 'On a flat wall square to the beam. On a tilted surface the line is longer.',
      stories: { L: 'A line laser with a fan angle of {phi} shines on a wall {z} away. How long is the line?', z: 'A line laser with a fan angle of {phi} must draw a line {L} long. How far from the wall must it be?' }
    },
    {
      name: 'Focal length of a rod lens',
      expr: 'f = n*d/(4*(n - 1))', tex: 'f = \\frac{n\\,d}{4(n-1)}',
      vars: {
        f: { name: 'focal length from the axis of the rod', q: 'length', unit: 'mm' },
        n: { name: 'refractive index of the rod', value: 1.517, min: 1.05, max: 4 },
        d: { name: 'diameter of the rod', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Measured from the centre of the rod; for a ball lens the same formula holds in both planes.'
    }
  ],
  examples: [
    {
      title: 'A 2 m line from 1.5 m away',
      q: 'A line laser must draw a line 2 m long on a wall 1.5 m away, from a beam 1.5 mm wide. What fan angle and which cylinder-lens focal length are needed?',
      steps: [
        { text: 'Half the line is 1 m long, seen from 1.5 m:', tex: '\\text{fan} = 2\\arctan\\frac{1}{1.5} = 67.4°' },
        { text: 'Solve the fan formula for $f$:', tex: 'f = \\frac{D}{2\\tan(\\text{fan}/2)} = \\frac{1.5\\ \\mathrm{mm}}{2 \\times 0.667} = 1.125\\ \\mathrm{mm}' }
      ],
      a: 'A fan of 67.4°, from a lens of 1.1 mm focal length: in practice a 1.5 mm glass rod (f = 1.1 mm).'
    },
    {
      title: 'A rod lens for a laser pointer',
      q: 'A 1 mm rod of N-BK7 ($n = 1.517$) is placed in a beam 0.8 mm wide. What is its focal length and the fan angle it gives?',
      steps: [
        { text: 'The rod focal length is', tex: 'f = \\frac{n d}{4(n-1)} = \\frac{1.517 \\times 1\\ \\mathrm{mm}}{4 \\times 0.517} = 0.73\\ \\mathrm{mm}' },
        { text: 'The fan angle is', tex: '2\\arctan\\frac{0.8}{2 \\times 0.73} = 57.2°' }
      ],
      a: 'f = 0.73 mm and a fan of 57°: about a 1.1 m line at a distance of 1 m.'
    }
  ],
  quiz: [
    { q: 'A line laser has a fan angle of 90°. How long is its line on a wall 2 m away?', answer: 4, unit: 'm', why: '$L = 2z\\tan(45°) = 2 \\times 2 \\times 1 = 4$ m. A 90° fan makes a line twice as long as its distance.' },
    { q: 'What does a Powell lens do that a plain cylinder lens does not?', choices: ['Makes the line far thinner', 'Makes the line far more uniform along its length', 'Makes the line invisible', 'Makes the beam brighter'], a: 1, why: 'The Powell lens redistributes the power of the Gaussian profile from the centre to the ends of the fan, so the line is nearly uniform.' },
    { q: 'A laser line is Class 2 and spread over a 90° fan, so it cannot hurt an eye.', a: false, why: 'The class depends on the total power and the hazard at the exit and in reflections. Never look into the line or its reflection; see the laser safety pages.' },
    { q: 'A 2 mm wide beam goes through a cylinder lens of focal length 1 mm. What is the fan angle?', choices: ['53°', '90°', '127°', '28°'], a: 1, why: '$2\\arctan(D/2f) = 2\\arctan(1) = 90°$.' },
    { q: 'A cylinder lens produces a Gaussian line whose ends are 1 % as bright as the centre. What is the intensity half way along the half-length?', choices: ['About 33 % of the centre', 'About 50 %', 'About 75 %', 'About 5 %'], a: 0, why: 'In the model with the lens 1.5 beam diameters wide, intensity is $e^{-4.4u^2}$ with $u$ the fraction of the half-length: 33 % at $u = 0.5$ and 1.2 % at $u = 1$.' }
  ],
  applications: [
    'Self-levelling and cross-line lasers for building work, which draw a horizontal and a vertical line on walls.',
    'Laser triangulation and 3-D profile sensors, where a line is a hundred measurements at once.',
    'Machine vision lighting: a bright thin line to show the profile of a weld seam, a tyre or a cable.',
    'Cutting guides in sawmills and fabric cutting, and alignment of parts on a production line.',
    'Illuminating a thin slice of a smoky flow or a dye for visualization (see the light sheet).'
  ],
  history: 'The Powell lens is named after the optical designer Ian Powell, who described its design in 1987. Before it, an even line was made by scanning a beam to and fro or by clipping a very wide one and throwing most of the light away.',
  sources: [
    'F. M. Dickey (ed.), *Laser Beam Shaping: Theory and Techniques* (CRC Press) — line generators and the redistribution of a Gaussian profile.',
    'E. Hecht, *Optics*, the sections on cylindrical lenses and the thin-lens equation — the fan of a cylinder lens.',
    'I. Powell, "Design of a laser beam line expander", *Applied Optics* 26 (1987) — the original line-expander design.'
  ],
  sim: [{ id: 'bs-cylinder', params: { mode: 'line' } }]
},

/* ================================================================ light sheets */
{
  id: 'light-sheets', parent: 'beam-shaping', title: 'Light sheets', level: 2,
  short: 'A light sheet is a laser focused in one direction only: thin as a hair in one axis, broad as a hand in the other. It lights a single slice of smoke, fluid or a transparent specimen, so that a camera at right angles sees that slice and nothing else.',
  keywords: ['light sheet', 'laser sheet', 'sheet of light', 'light-sheet microscopy', 'SPIM', 'LSFM', 'PIV', 'particle image velocimetry', 'flow visualization', 'sheet thickness', 'cylinder lens', 'confocal parameter'],
  prereq: ['laser-line-generators', 'rayleigh-range', 'focusing-to-a-point'],
  related: ['axicons-and-bessel-beams', 'fluorescence-and-confocal-microscopy', 'beam-expanders', 'gaussian-beams-through-lenses', 'cylindrical-and-toric-lenses', 'laser-scanning-microscopes'],
  body: `
Shine a laser through a fish tank of smoke and you see a beam. Spread the beam into a sheet and you see a *slice*: a plane through the smoke, lit while everything in front and behind stays dark. A camera looking at right angles to the sheet records a section of the flow — or, in a microscope, a section of a living embryo.

### Making a sheet
Take a beam, expand it in one direction only with two cylinder lenses (a telescope) to the height wanted, then focus it in the other direction with a cylinder lens of focal length $f$. The thickness at the waist follows the focusing formula ([[focusing-to-a-point]]) with the beam width $w$ in the focusing axis:

$$t = 2w_0 = \\frac{2M^2\\lambda f}{\\pi w}$$

At 532 nm and $M^2 = 1$:

| Beam radius | $f$ | Thickness $t$ | Stays thin over $2z_R$ |
|---|---|---|---|
| 1 mm | 200 mm | 67.7 µm | 13.5 mm |
| 1 mm | 100 mm | 33.9 µm | 3.4 mm |
| 2 mm | 100 mm | 16.9 µm | 0.85 mm |
| 2 mm | 50 mm | 8.5 µm | 0.21 mm |

### Thin or long: choose one
The sheet is a focused beam, so it obeys the same trade as any focus: it is $\\sqrt{2}$ thicker at a distance $z_R$ from the waist, with $z_R = \\pi w_0^2/(M^2\\lambda)$. Eliminate the waist and the length over which it is thin is

$$2z_R = \\frac{\\pi t^2}{2M^2\\lambda}$$

At 488 nm a sheet 5 µm thick stays thin over 80 µm; 10 µm over 320 µm; 20 µm over 1.3 mm. A millimetre-thick sheet in green light stays thin over three metres. Making the sheet thinner always shortens it by the square. Microscopists get around the limit by sweeping a focused beam up and down instead of spreading it, or with Bessel beams ([[axicons-and-bessel-beams]]).

### In a flow
In particle image velocimetry the fluid is seeded with tiny particles and lit with a sheet about a millimetre thick, pulsed twice. A camera at 90° photographs the particles twice; how far each moved gives the velocity across the plane. The sheet is thick enough to stay within a few per cent of its thickness across the field.

### In a microscope
In **light-sheet fluorescence microscopy** the sheet enters from the side through its own lens, and the detection objective looks along the normal to it. Only the plane in focus is illuminated, so the specimen is not bleached by light from above and below the plane, and a whole plane is recorded at once with a camera. The thickness of the sheet then sets the axial resolution if it is thinner than the depth of field of the detection lens ([[fluorescence-and-confocal-microscopy]]).

### Even lighting across the sheet
The sheet is Gaussian in height too. The picture is made even by expanding the beam and using only its centre, or by a Powell lens ([[laser-line-generators]]).

> [!warn] A laser sheet is a laser beam: its class is set by the total power. Keep it away from eyes and from mirror-like surfaces; wear the eyewear specified for its wavelength ([[laser-eye-hazards-and-eyewear]]).

> [!key] A light sheet is a beam focused in one direction only. Its thickness $t = 2M^2\\lambda f/(\\pi w)$, and it stays thin over $\\pi t^2/(2M^2\\lambda)$: a sheet twice as thin is four times shorter.
`,
  ideas: [
    'A light sheet is a laser expanded in one direction and focused in the other with cylinder lenses.',
    'Its thickness is t = 2M²λf/(πw), the same law as any focused spot.',
    'The length over which the sheet stays thin is πt²/(2M²λ): halving the thickness quarters the length.',
    'A camera at right angles sees only the lit slice: that is the principle of laser flow visualization and of light-sheet microscopy.',
    'The thickness of the sheet sets the axial resolution of a light-sheet microscope.'
  ],
  pitfalls: [
    'A thinner sheet is always better — Thickness and length trade as the square: 5 µm thick stays thin over 80 µm, 20 µm over 1.3 mm. A sheet that is too thin is thin only across a sliver of the field.',
    'The sheet has a constant thickness across its width — It is thinnest at the waist and grows by √2 at ±z_R; across a wide field the ends are thicker.',
    'The sheet lights up the sample uniformly — It is Gaussian across its height too; either the centre is used or a Powell lens is added.',
    'A light sheet is safer than a laser spot — The total power is the same and the sheet is invisible edge-on; the eye hazard of the source remains.'
  ],
  terms: [
    { term: 'Light sheet', also: ['laser sheet', 'sheet of light'], def: 'A beam focused in one direction only, thin in one axis and wide in the other, used to light a single plane of a medium or a specimen.' },
    { term: 'Sheet thickness', def: 'The width of the sheet in the focused direction at its waist, 2w₀ to the 1/e² intensity.' },
    { term: 'Light-sheet fluorescence microscopy', also: ['LSFM', 'SPIM', 'selective-plane illumination microscopy'], def: 'A microscope that lights the specimen with a thin sheet from the side and images it with a lens at right angles, so only the focal plane is illuminated.' },
    { term: 'Particle image velocimetry', also: ['PIV'], def: 'A flow measurement in which seeded particles are lit by a pulsed light sheet and photographed twice; their displacement gives the velocity field in the plane.' },
    { term: 'Sheet length', also: ['thin length', '2z_R'], def: 'The length over which a light sheet stays within a factor of √2 of its minimum thickness: 2π w₀²/(M²λ), or πt²/(2M²λ) for a sheet of thickness t.' }
  ],
  formulas: [
    {
      name: 'Thickness of a light sheet',
      expr: 't = 2*M2*lambda*f/(pi*w)', tex: 't = \\frac{2\\,M^2\\,\\lambda\\,f}{\\pi\\,w}',
      vars: {
        t: { name: 'sheet thickness', q: 'length', unit: 'µm' },
        M2: { name: 'beam quality in the focused direction', value: 1, min: 1, max: 100, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        f: { name: 'focal length of the cylinder lens', q: 'length', unit: 'mm', value: 100 },
        w: { name: 'beam radius at the lens (1/e²)', q: 'length', unit: 'mm', value: 2 }
      },
      solveFor: 't',
      note: 'The thickness is the 1/e² diameter at the waist.',
      stories: { t: 'A {lambda} beam of radius {w} is focused in one direction by a cylinder lens of focal length {f}. How thick is the sheet at its waist?', w: 'A {lambda} sheet must be {t} thick, from a cylinder lens of focal length {f}. What beam radius must fill the lens?' }
    },
    {
      name: 'Length over which the sheet stays thin',
      expr: 'L = pi*t^2/(2*M2*lambda)', tex: 'L = 2z_R = \\frac{\\pi\\,t^2}{2\\,M^2\\,\\lambda}',
      vars: {
        L: { name: 'length with thickness within √2 of the minimum', q: 'length', unit: 'mm' },
        t: { name: 'sheet thickness at the waist', q: 'length', unit: 'µm', value: 10 },
        M2: { name: 'beam quality', value: 1, min: 1, max: 100, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 488, tex: '\\lambda' }
      },
      solveFor: 'L',
      note: 'Quadruples when the sheet is made twice as thick.',
      stories: { L: 'A light sheet {t} thick at {lambda} (M² = {M2}). Over what length does it stay within √2 of that thickness?', t: 'A light sheet at {lambda} (M² = {M2}) must stay thin over {L}. How thick must it be at the waist?' }
    }
  ],
  examples: [
    {
      title: 'A sheet for a 0.5 mm field',
      q: 'A light-sheet microscope images a field 0.5 mm wide with blue light at 488 nm. How thin can the sheet be if its thickness must not exceed $\\sqrt{2}$ times the minimum across the field?',
      steps: [
        { text: 'The field is 0.5 mm $= 2z_R$, so $z_R = 0.25$ mm. The waist radius is', tex: 'w_0 = \\sqrt{\\frac{\\lambda z_R}{\\pi}} = \\sqrt{\\frac{0.488\\ \\mu\\mathrm{m} \\times 250\\ \\mu\\mathrm{m}}{\\pi}} = 6.2\\ \\mu\\mathrm{m}' }
      ],
      a: 'A sheet 12.5 µm thick at the waist, 17.6 µm at the edges of the field. A thinner sheet would flare out before the edge.'
    },
    {
      title: 'A sheet from a cylinder lens',
      q: 'A 532 nm beam of radius 1.5 mm is focused in one direction by a cylinder lens of focal length 80 mm. How thick is the sheet and how long does it stay thin?',
      steps: [
        { text: 'The waist and thickness:', tex: 't = \\frac{2 \\lambda f}{\\pi w} = \\frac{2 \\times 0.532\\ \\mu\\mathrm{m} \\times 80\\ \\mathrm{mm}}{\\pi \\times 1.5\\ \\mathrm{mm}} = 18.1\\ \\mu\\mathrm{m}' },
        'The Rayleigh range is $z_R = \\pi w_0^2/\\lambda = 0.48$ mm, so it stays thin over 0.96 mm.'
      ],
      a: 'A sheet 18 µm thick, within √2 of that over about 1 mm.'
    }
  ],
  quiz: [
    { q: 'A light sheet is made twice as thin by changing the lens. How does the length over which it stays thin change?', choices: ['Four times shorter', 'Two times shorter', 'Unchanged', 'Four times longer'], a: 0, why: 'The length is $\\pi t^2/(2M^2\\lambda)$: it goes as the square of the thickness.' },
    { q: 'A sheet at 488 nm is 10 µm thick at the waist. About how long does it stay within √2 of 10 µm?', answer: 0.322, unit: 'mm', why: '$L = \\pi t^2/(2\\lambda) = \\pi (10\\ \\mu\\mathrm{m})^2/(2 \\times 0.488\\ \\mu\\mathrm{m}) = 322$ µm.' },
    { q: 'In a light-sheet microscope the camera looks along the sheet.', a: false, why: 'The detection objective is at right angles to the sheet, so it sees the lit plane face-on and nothing from the dark planes before or behind it.' },
    { q: 'To make a sheet thinner without making it shorter, one could use…', choices: ['A shorter wavelength only', 'A Bessel beam or a scanned beam instead of a spread-out focus', 'A larger focal length', 'A thicker beam'], a: 1, why: 'A shorter wavelength helps a little, but the square law is fixed for a focus. Bessel beams and scanned beams give a long thin line of light without the Gaussian trade.' },
    { q: 'A laser sheet for flow measurement is about 1 mm thick. Why is it so much thicker than a microscope sheet?', choices: ['The field of view is tens of centimetres, so the sheet has to stay the same thickness over metres', 'Thin sheets are not visible', 'Lasers cannot make thin sheets', 'The fluid blocks thin sheets'], a: 0, why: 'A wide field needs a long confocal parameter; at 532 nm, 1 mm thickness stays constant over about 3 m, 50 µm thickness over only 7 mm.' }
  ],
  applications: [
    'Particle image velocimetry in wind tunnels, engines and pipes.',
    'Light-sheet microscopes imaging developing embryos, cleared organs and whole brains.',
    'Flame and spray diagnostics: planar laser-induced fluorescence images a slice of a flame.',
    'Atmospheric and cloud studies with a sheet of laser light across a smoke or fog volume.',
    'Cutting and alignment guides where a laser plane marks a surface.'
  ],
  history: 'A sheet of light for a microscope was used by Siedentopf and Zsigmondy in the early 1900s in their ultramicroscope, to see gold particles smaller than the wavelength of light. The idea was revived with lasers and cameras around 2004 as selective-plane illumination microscopy, and has since become a standard way to image living embryos.',
  sources: [
    'A. E. Siegman, *Lasers*, the chapters on Gaussian beams — the waist and the confocal parameter used for the sheet.',
    'J. Huisken, J. Swoger, F. Del Bene, J. Wittbrodt and E. H. K. Stelzer, "Optical sectioning deep inside live embryos by selective plane illumination microscopy", *Science* 305 (2004).',
    'M. Raffel et al., *Particle Image Velocimetry: A Practical Guide* (Springer) — the light sheet in flow measurement.'
  ],
  sim: [{ id: 'bs-cylinder', params: { mode: 'sheet' } }]
},

/* ================================================================ axicons */
{
  id: 'axicons-and-bessel-beams', parent: 'beam-shaping', title: 'Axicons, rings and Bessel beams', level: 3,
  short: 'An axicon is a lens shaped like a cone. It sends every part of a beam towards the axis at the same angle, so the focus is not a point but a line: a needle of light that stays a few micrometres wide for centimetres, and, beyond it, a ring that grows with distance.',
  keywords: ['axicon', 'conical lens', 'Bessel beam', 'non-diffracting beam', 'ring beam', 'annular beam', 'long focal line', 'extended depth of focus', 'self-healing', 'Bessel zone', 'cone lens', 'J0'],
  prereq: ['focusing-to-a-point', 'rayleigh-range', 'snells-law'],
  related: ['light-sheets', 'flat-top-beam-shapers', 'higher-order-modes', 'optical-coherence-tomography', 'laser-processing-systems', 'alignment-telescopes-and-lasers', 'fresnel-lenses'],
  body: `
An ordinary lens bends a ray more the farther from the axis it arrives, so that all the rays meet at one point. An **axicon** does the opposite: a cone, with a flat back, bends every ray by the same angle $\\beta$ however far from the axis it is. A ray at radius $r$ crosses the axis at $z = r/\\tan\\beta$. The rays of a thin ring all cross at one distance; the rays of the whole beam cross at all distances from 0 to $w/\\tan\\beta$. The focus is a line along the axis.

### The numbers
For a cone of base angle $\\alpha$ in glass of index $n$ the deflection is $\\beta = \\arcsin(n\\sin\\alpha) - \\alpha \\approx (n-1)\\alpha$. The line focus ends at $z_{\\max} = w/\\tan\\beta$. For a beam of radius 2 mm at 532 nm on N-BK7 ($n = 1.517$):

| Base angle $\\alpha$ | Deflection $\\beta$ | Line focus $z_{\\max}$ | Core radius |
|---|---|---|---|
| 1° | 0.52° | 222 mm | 22.6 µm |
| 2° | 1.03° | 111 mm | 11.3 µm |
| 5° | 2.60° | 44 mm | 4.5 µm |
| 10° | 5.27° | 22 mm | 2.2 µm |

### A needle of interference
Where the rays cross they are plane waves meeting at the angle $\\beta$ to the axis, a cone of them, and they interfere. The intensity near the axis is a **Bessel pattern**, $J_0^2(k\\rho\\sin\\beta)$: a bright core and a series of rings. The core radius, to the first dark ring, is

$$r_0 = \\frac{2.405\\,\\lambda}{2\\pi\\sin\\beta}$$

and it is the same at every distance in the zone. A Gaussian beam as narrow as the 1° core (22.6 µm) would spread within $z_R = 3$ mm; the Bessel core holds out for 222 mm, 74 times longer. That is why it is called **non-diffracting** — a name that overstates it: the beam is a cone of waves, and the long core is borrowed from the rings. With Gaussian illumination the on-axis intensity along the zone rises and falls as $z\\,e^{-2z^2/z_{\\max}^2}$, with its peak at half the length of the zone.

### Beyond the zone: a ring
Past $z_{\\max}$ the rays have crossed and the beam is a ring of radius about $z\\tan\\beta$ and a width like the original beam: 22.7 mm at 0.5 m from a 5° axicon in N-BK7.

### The price: power in the rings
Each ring of a Bessel pattern carries about as much power as the core. A 1° axicon and a 2 mm beam give some 68 rings, so only a percent or two of the light is in the central needle. In return the core **heals**: put a speck of dust in it and the rings, which are still arriving at an angle, refill it a short distance behind.

### Where it is used
Rings are wanted in their own right (drilling round holes by trepanning, annular illumination, trapping particles on a ring) and the needle where a long, thin line of light is wanted at once (a straight alignment reference, deep light-sheet and OCT imaging). An axicon followed by a lens makes a ring at the focal plane of the lens, whose width is the focal spot of the beam and whose radius is $f\\tan\\beta$.

> [!key] An axicon bends all rays by the same angle $\\beta \\approx (n-1)\\alpha$, giving a line focus of length $w/\\tan\\beta$ with a Bessel core of radius $2.405\\lambda/(2\\pi\\sin\\beta)$ and, beyond it, a ring. The long needle costs most of the power, which sits in the rings.
`,
  ideas: [
    'An axicon bends every ray by the same angle β ≈ (n − 1)α, so rays from a ring of the beam cross the axis at the same distance.',
    'The focus is a line of length w/tan β rather than a point.',
    'In the zone the intensity is a Bessel pattern J₀²(kρ sin β): a core of radius 2.405λ/(2π sin β), the same at every distance.',
    'Each ring carries about as much power as the core, so the needle holds only a small part of the light.',
    'Beyond the zone the beam is a ring of radius about z tan β.'
  ],
  pitfalls: [
    'A Bessel beam does not diffract at all — The core does not spread within the zone, but only because the light comes from rings that keep arriving at an angle; it carries infinite power in theory and a finite zone in practice, and the core holds little of the power.',
    'An axicon focuses light like a lens — A lens images a point to a point; an axicon turns a point-like source into a line and a ring. It forms no image of an object.',
    'A longer line focus comes free — The needle is long because the beam is wide or the angle small; a small angle also widens the core. Length and core size trade as $z_{\\max}\\,r_0 \\propto w\\lambda / \\beta^2$.',
    'The core is as bright as a focused Gaussian beam — With tens or hundreds of rings, only a percent or two of the power is in the core.'
  ],
  terms: [
    { term: 'Axicon', also: ['conical lens', 'cone lens'], def: 'A lens with a conical surface that deflects all rays towards the axis by the same angle, forming a line focus along the axis and a ring beyond it.' },
    { term: 'Bessel beam', also: ['non-diffracting beam', 'diffraction-free beam'], def: 'A beam whose cross-section is a Bessel function J₀: a bright core with concentric rings. In a real axicon the pattern holds only over a finite zone.' },
    { term: 'Bessel zone', also: ['line focus', 'axicon depth of field'], def: 'The distance along the axis, w/tan β, over which the beams from the axicon overlap and the Bessel core is formed.' },
    { term: 'Self-healing', def: 'The recovery of a Bessel core behind a small obstacle in it, because the rings, arriving at an angle, refill the shadow a short distance on.' },
    { term: 'Annular beam', also: ['ring beam', 'doughnut-shaped beam'], def: 'A beam whose intensity is concentrated in a ring, with little or none on the axis.' }
  ],
  formulas: [
    {
      name: 'Deflection by a thin axicon',
      expr: 'beta = (n - 1)*alpha', tex: '\\beta \\approx (n-1)\\,\\alpha',
      vars: {
        beta: { name: 'deflection towards the axis', q: 'angle', unit: '°', tex: '\\beta' },
        n: { name: 'refractive index of the glass', value: 1.517, min: 1.05, max: 4 },
        alpha: { name: 'base angle of the cone', q: 'angle', unit: '°', value: 5, min: 0.1, max: 20, tex: '\\alpha' }
      },
      note: 'Small angles, light entering the flat face. For large α use β = arcsin(n sin α) − α.',
      stories: { beta: 'An axicon of base angle {alpha} is made of glass of index {n}. By what angle does it deflect a ray?' }
    },
    {
      name: 'Length of the line focus',
      expr: 'zmax = w/tan(beta)', tex: 'z_{\\max} = \\frac{w}{\\tan\\beta}',
      vars: {
        zmax: { name: 'end of the Bessel zone', q: 'length', unit: 'mm', tex: 'z_{\\max}' },
        w: { name: 'beam radius at the axicon', q: 'length', unit: 'mm', value: 2 },
        beta: { name: 'deflection', q: 'angle', unit: '°', value: 2.6, min: 0.05, max: 40, tex: '\\beta' }
      },
      note: 'The rays at the edge of the beam are the last to cross the axis. A Gaussian beam: use the 1/e² radius.',
      stories: { zmax: 'A beam of radius {w} meets an axicon that deflects it by {beta}. How long is the line focus?' }
    },
    {
      name: 'Radius of the Bessel core',
      expr: 'r0 = 2.405*lambda/(2*pi*sin(beta))', tex: 'r_0 = \\frac{2.405\\,\\lambda}{2\\pi\\,\\sin\\beta}',
      vars: {
        r0: { name: 'radius to the first dark ring', q: 'length', unit: 'µm', tex: 'r_0' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        beta: { name: 'deflection', q: 'angle', unit: '°', value: 2.6, min: 0.05, max: 40, tex: '\\beta' }
      },
      note: 'The first zero of the Bessel function J₀ is 2.405.',
      stories: { r0: 'An axicon deflects {lambda} light by {beta}. How wide is the core of the Bessel beam it makes?' }
    }
  ],
  examples: [
    {
      title: 'A 5° axicon in a HeNe beam',
      q: 'A glass axicon ($n = 1.5$, base angle 5°) is lit by a 633 nm beam of radius 5 mm. Find the deflection, the length of the line focus and the core radius.',
      steps: [
        { text: 'The deflection:', tex: '\\beta = \\arcsin(1.5 \\sin 5°) - 5° = 7.51° - 5° = 2.51°' },
        { text: 'The line focus ends at', tex: 'z_{\\max} = \\frac{5\\ \\mathrm{mm}}{\\tan 2.51°} = 114\\ \\mathrm{mm}' },
        { text: 'The core radius:', tex: 'r_0 = \\frac{2.405 \\times 633\\ \\mathrm{nm}}{2\\pi \\sin 2.51°} = 5.5\\ \\mu\\mathrm{m}' }
      ],
      a: 'β = 2.5°, a line focus 11 cm long and a core 5.5 µm in radius: a needle of light 11 µm across and 11 cm long, as the beam never was before.'
    },
    {
      title: 'Where is the ring?',
      q: 'The same axicon is used with a screen 0.5 m behind it. How large is the ring on the screen?',
      steps: [
        'The screen is beyond the zone ($0.5\\ \\mathrm{m} > 0.114\\ \\mathrm{m}$), so the light has crossed the axis and the beam is a ring.',
        { text: 'The radius of the ring is about', tex: 'z\\tan\\beta = 500\\ \\mathrm{mm} \\times \\tan 2.51° = 21.9\\ \\mathrm{mm}' }
      ],
      a: 'A ring about 22 mm in radius and a few millimetres wide (the width of the original beam).'
    }
  ],
  quiz: [
    { q: 'What is special about the focus of an axicon compared with a lens?', choices: ['It is a line along the axis, not a point', 'It is brighter', 'It is smaller than the Airy disc', 'It is behind the lens only for a real image'], a: 0, why: 'Rays at different radii all bend by the same angle, so they cross the axis at different distances: the focus is spread along the axis.' },
    { q: 'An axicon deflects a beam of radius 3 mm by 1°. How long, in mm, is the zone in which the Bessel core exists?', answer: 172, unit: 'mm', why: '$z_{\\max} = w/\\tan\\beta = 3\\ \\mathrm{mm}/\\tan 1° = 172$ mm.' },
    { q: 'A Bessel beam carries most of its power in its central core.', a: false, why: 'The rings each carry about as much power as the core; with tens or hundreds of rings only a few per cent is in the core.' },
    { q: 'To make the Bessel core narrower, the base angle of the axicon should be…', choices: ['larger', 'smaller', 'the same; only the wavelength matters', 'zero'], a: 0, why: '$r_0 = 2.405\\lambda/(2\\pi\\sin\\beta)$: a larger deflection gives a narrower core and a shorter zone ($w/\\tan\\beta$).' },
    { q: 'A speck of dust blocks the core of a Bessel beam. A little farther along the beam…', choices: ['the core is rebuilt, because the rings fill the shadow', 'the beam stays dark for ever', 'the beam turns into a ring', 'the beam brightens'], a: 0, why: 'The rings are plane waves crossing the axis at an angle β; they are not blocked by a small object on the axis, and they re-form the core a short distance behind it.' }
  ],
  applications: [
    'Laser drilling and trepanning: the ring of an axicon cuts a round hole with its axis free.',
    'Optical trapping and guiding of cells and atoms on a ring or along a needle.',
    'Straight alignment references: a long thin line of light for aligning pipes, shafts and machines.',
    'Light-sheet microscopes with Bessel sheets, which stay thin over a longer field than a Gaussian sheet.',
    'Optical coherence tomography with an extended depth of focus.'
  ],
  history: 'The axicon was named and described by John McLeod in 1954 as an element that makes a line image of a point. In 1987 Durnin, Miceli and Eberly showed that a Bessel beam is an exact solution of the wave equation that does not spread, and the idea of non-diffracting beams followed, with practical Bessel beams made by an axicon or an annular slit in a lens.',
  sources: [
    'J. H. McLeod, "The axicon: a new type of optical element", *Journal of the Optical Society of America* 44 (1954).',
    'J. Durnin, J. J. Miceli and J. H. Eberly, "Diffraction-free beams", *Physical Review Letters* 58 (1987).',
    'F. M. Dickey (ed.), *Laser Beam Shaping: Theory and Techniques* (CRC Press) — axicons and annular beams.'
  ],
  sim: 'bs-axicon'
},

/* ================================================================ flat-top shapers */
{
  id: 'flat-top-beam-shapers', parent: 'beam-shaping', title: 'Flat-top beam shapers', level: 3,
  short: 'A flat-top (top-hat) shaper turns the Gaussian beam of a laser into a patch of nearly uniform intensity with steep edges, using nearly all of the light. It does so for one beam size and one plane, so the beam fed to it and the plane it is used in must be controlled.',
  keywords: ['flat top', 'top hat', 'beam shaper', 'refractive beam shaper', 'field mapper', 'pi shaper', 'super-Gaussian', 'uniform spot', 'laser processing', 'uniformity', 'edge steepness', 'Fresnel number', 'Gaussian to top hat'],
  prereq: ['beam-shaping-overview', 'the-gaussian-beam', 'focusing-to-a-point'],
  related: ['microlens-arrays', 'diffractive-optical-elements', 'light-pipes-and-homogenizers', 'beam-expanders', 'beam-quality-m-squared', 'laser-marking-and-cutting-heads', 'laser-processing-systems'],
  body: `
The bright centre of a Gaussian spot heats a surface faster than its edges, exposes a resist more, bleaches a dye faster. Many jobs want the same dose everywhere inside a patch and none outside it: a **flat top**.

### Ways to make one
| Method | How | Light used | Weak point |
|---|---|---|---|
| Hard aperture | cut the middle out of a wide beam | 10–40 % | wastes the light; edges still dim |
| Refractive shaper | two aspheric elements remap the rays | above 90 % (typical) | needs a precise input beam |
| Diffractive shaper | a phase plate and a lens | 80–95 % (typical) | one wavelength; zero order |
| Lenslet homogenizer | beamlets overlapped ([[microlens-arrays]]) | 80–95 % (typical) | fringes with a coherent beam |
| Light pipe | mixing in a rod ([[light-pipes-and-homogenizers]]) | 80–90 % | rod length; a lamp more than a laser |

### How a refractive shaper works
It is a power-conserving remapping. The fraction of the power inside radius $r$ of the Gaussian input must equal the fraction of the area inside radius $\\rho$ of the flat-topped output, so ray $r$ is sent to

$$\\rho(r) = \\rho_0\\sqrt{\\frac{1 - e^{-2r^2/w_d^2}}{1 - e^{-2R^2/w_d^2}}}$$

where $w_d$ is the design beam radius and $R$ the radius at which the input is cut off. The first element bends the rays to these radii, the second makes them parallel again. The mapping is fixed in glass.

### The catch: size and plane
Feed it a beam of radius $w$ instead of $w_d$ and the output is no longer flat: the edge to centre intensity ratio becomes

$$\\frac{I_{\\text{edge}}}{I_{\\text{centre}}} = \\exp\\!\\left[2R^2\\left(\\frac{1}{w_d^2}-\\frac{1}{w^2}\\right)\\right]$$

For a design that takes in the beam out to its $1/e^2$ radius ($R = w_d$) a beam 5 % too large makes the edge 20 % brighter than the centre; 10 % too large, 41 %. To keep the edge within ±10 % of the centre the beam must be within about ±2.4 % of the design size ($R = w_d$) or ±1 % ($R = 1.5\\,w_d$). So the shaper is used with a beam expander, a stable laser and an input with a good $M^2$; a multimode beam only needs a more modest size tolerance.

The flat top is also right only at one plane. Beyond it diffraction from the sharp edges rounds the shoulders and ripples the plateau. The edges stay sharp while the Fresnel number $a^2/(\\lambda z)$ is large (say 10 or more): for a patch of radius 1 mm at 532 nm that is out to about 19 cm. To get a flat top somewhere else, image the shaper's output with a lens, or add a focusing lens after a DOE shaper, whose flat top is at the focal plane.

### Describing the edge
The ideal shape is a **super-Gaussian**, $I \\propto \\exp[-2(r/w)^p]$: order $p = 2$ is the Gaussian. Rising from 10 % to 90 % takes 0.84 $w$ for $p = 2$, 0.41 $w$ at $p = 6$, 0.27 $w$ at $p = 10$ and 0.14 $w$ at $p = 20$.

> [!key] A refractive shaper remaps a Gaussian into a flat top with nearly no loss, but only for one beam size and one plane: a few per cent of size error ruin the flatness, and diffraction rounds the edges away from the design plane.
`,
  ideas: [
    'A flat-top shaper redistributes the power of a Gaussian beam into a patch of uniform intensity with steep edges and little loss.',
    'A hard aperture is a poor shaper: it wastes most of the light and leaves the edges dim.',
    'A refractive shaper sends the ray at radius r to a radius that conserves power: fraction of power equals fraction of area.',
    'The output is flat only for the design beam size (within a few per cent) and at the design plane.',
    'A super-Gaussian of order p describes the profile: p = 2 is Gaussian, p = 10 or more is a flat top.'
  ],
  pitfalls: [
    'A flat-top shaper works for any laser beam — It is designed for a beam of one size and profile; a few per cent of error in the beam size turns the plateau into a dish or a dome.',
    'The flat top stays flat as it travels — Diffraction from its sharp edges rounds them and ripples the plateau beyond the plane of the design; the useful depth is set by the Fresnel number.',
    'A clipped Gaussian is a flat top — Clipping at the $1/e^2$ radius leaves the edge 13.5 % of the centre intensity and discards 13.5 % of the power; to get an edge at 90 % you must discard 90 %.',
    'Steeper edges are free — A steeper edge (higher order) needs finer structure in the optic and is more sensitive to size error, and its diffraction ripples are stronger.'
  ],
  terms: [
    { term: 'Flat-top beam', also: ['top-hat beam', 'uniform beam'], def: 'A beam with nearly constant intensity across a patch and rapidly falling edges, as opposed to the bell-shaped Gaussian of a laser.' },
    { term: 'Refractive beam shaper', also: ['field mapper', 'π-shaper'], def: 'A pair of aspheric elements that remap the rays of a Gaussian beam so that the output is uniform and collimated again.' },
    { term: 'Super-Gaussian', also: ['super-Gaussian order'], def: 'A profile exp[−2(r/w)^p]. Order 2 is a Gaussian; orders of 10 or more are close to a flat top with steep edges.' },
    { term: 'Uniformity', also: ['flatness of the plateau'], def: 'How much the intensity of a flat top varies over its plateau, quoted as a percentage of the mean (for example ±5 %).' },
    { term: 'Edge steepness', also: ['edge width', '10–90 % width'], def: 'The distance over which the intensity at the edge of a flat top rises from 10 % to 90 % of the plateau.' }
  ],
  formulas: [
    {
      name: 'Edge-to-centre ratio of a mapped flat top',
      expr: 'rho = exp(2*R^2*(1/wd^2 - 1/w^2))', tex: '\\rho = \\exp\\!\\left[2R^2\\left(\\frac{1}{w_d^2}-\\frac{1}{w^2}\\right)\\right]',
      vars: {
        rho: { name: 'edge intensity ÷ centre intensity', tex: '\\rho' },
        R: { name: 'radius at which the design takes in the beam', q: 'length', unit: 'mm', value: 2 },
        wd: { name: 'beam radius the shaper was designed for', q: 'length', unit: 'mm', value: 2, tex: 'w_d' },
        w: { name: 'beam radius actually fed in', q: 'length', unit: 'mm', value: 2.1 }
      },
      solveFor: 'rho',
      note: 'The geometric mapper of the text; diffraction ripples are not included. ρ = 1 means perfectly flat.',
      stories: { rho: 'A shaper designed for a beam of radius {wd} (taking the beam in to {R}) is fed a beam of radius {w}. How bright is the edge of the patch compared with its centre?' }
    },
    {
      name: 'Fresnel number',
      expr: 'NF = a^2/(lambda*z)', tex: 'N_F = \\frac{a^2}{\\lambda\\,z}',
      vars: {
        NF: { name: 'Fresnel number', tex: 'N_F' },
        a: { name: 'radius of the patch', q: 'length', unit: 'mm', value: 1 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        z: { name: 'distance from the design plane', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'A flat top keeps sharp edges while this is 10 or more.',
      stories: { NF: 'A flat top of radius {a} at {lambda} is observed {z} from its design plane. What is the Fresnel number?', z: 'A flat top of radius {a} at {lambda} should keep sharp edges to a Fresnel number of {NF}. How far from the design plane is that?' }
    },
    {
      name: 'Super-Gaussian profile',
      expr: 'I = exp(-2*(r/w)^p)', tex: 'I = \\exp\\!\\left[-2\\left(\\frac{r}{w}\\right)^{p}\\right]',
      vars: {
        I: { name: 'intensity relative to the peak', tex: 'I' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 0.9 },
        w: { name: 'radius of the profile (1/e²)', q: 'length', unit: 'mm', value: 1 },
        p: { name: 'order', value: 10, min: 1, max: 60 }
      },
      solveFor: 'I',
      note: 'p = 2 is the Gaussian. At r = w the intensity is always 1/e² = 13.5 %.',
      stories: { I: 'A super-Gaussian of order {p} and radius {w}: what is its intensity at {r} from the axis?' }
    }
  ],
  examples: [
    {
      title: 'A beam 4 % too wide',
      q: 'A shaper takes in a Gaussian beam out to its $1/e^2$ radius ($R = w_d$). The beam fed to it is 4 % wider than the design. How uneven is the patch?',
      steps: [
        { text: 'With $R = w_d$ and $w = 1.04\\,w_d$:', tex: '\\frac{I_{\\text{edge}}}{I_{\\text{centre}}} = \\exp\\!\\left[2\\left(1 - \\frac{1}{1.04^2}\\right)\\right] = \\exp(0.1509) = 1.163' }
      ],
      a: 'The edge is 16 % brighter than the centre: a dish, from only a 4 % error in the beam size.'
    },
    {
      title: 'How far does the flat top hold?',
      q: 'A patch 1 mm in radius at 532 nm is made by a shaper. At what distance from the design plane does the Fresnel number fall to 10?',
      steps: [
        { text: 'Solve $N_F = a^2/(\\lambda z)$ for $z$:', tex: 'z = \\frac{a^2}{\\lambda N_F} = \\frac{(1\\ \\mathrm{mm})^2}{0.532\\ \\mu\\mathrm{m} \\times 10} = 188\\ \\mathrm{mm}' }
      ],
      a: 'About 19 cm. Beyond that the edges are no longer sharp; a bigger patch (a²) holds longer.'
    }
  ],
  quiz: [
    { q: 'A Gaussian beam is clipped by an aperture at its $1/e^2$ radius. What is the intensity at the edge of the patch compared with the centre?', answer: 13.5, unit: '%', why: 'At $r = w$ the intensity is $e^{-2} = 13.5$ % of the peak. That is the dim edge of a clipped "flat top".' },
    { q: 'A refractive shaper designed for a beam of radius 2.0 mm is fed a beam of radius 2.2 mm. What happens to the patch?', choices: ['The edge becomes brighter than the centre', 'The edge becomes dimmer than the centre', 'Nothing: the patch stays flat', 'The patch becomes a ring'], a: 0, why: 'A larger beam puts more light at large radius than the fixed mapping expects, so the edge is overloaded and the centre starved.' },
    { q: 'A flat-top profile made by a shaper stays flat at any distance from the design plane.', a: false, why: 'Diffraction from the sharp edges rounds the shoulders and ripples the top; the flat region is limited by the Fresnel number.' },
    { q: 'For a super-Gaussian profile, what is the intensity at $r = w$, whatever the order?', choices: ['13.5 % of the peak', '50 %', '86.5 %', '0'], a: 0, why: '$\\exp[-2 \\cdot 1^p] = e^{-2} = 0.135$ for every order $p$. The order changes how fast the edge falls, not where it passes 1/e².' },
    { q: 'Which of these shapers is least sensitive to the beam size and profile at its input?', choices: ['A lenslet homogenizer', 'A refractive field mapper', 'A diffractive shaper made for one beam size', 'A pair of aspheric lenses designed for one beam'], a: 0, why: 'A homogenizer cuts the beam into beamlets and overlaps them: the output depends only on the lenslet geometry, not on the details of the input profile. The price is fringes with a coherent beam.' }
  ],
  applications: [
    'Laser annealing and lift-off, where the dose must be the same across a patch.',
    'Micromachining and drilling with an even spot, so that hole walls are straight.',
    'Illumination for photolithography and for microscopes that need an even field.',
    'Ophthalmic and dermatological lasers with uniform dose over the treated area.',
    'Laser printing and plate exposure with an even line.'
  ],
  history: 'Remapping a Gaussian profile onto a uniform one by conserving power ring by ring was described by Frieden in 1965, soon after the first lasers. Practical refractive shapers followed over the next decades, and diffractive ones after lithography gave access to fine phase relief.',
  sources: [
    'F. M. Dickey (ed.), *Laser Beam Shaping: Theory and Techniques* (CRC Press) — the chapters on refractive and diffractive shapers.',
    'B. R. Frieden, "Lossless conversion of a plane laser wave to a plane wave of uniform irradiance", *Applied Optics* 4 (1965).',
    'A. E. Siegman, *Lasers*, the chapters on Gaussian beams — the near field and the Fresnel number.'
  ],
  sim: 'bs-flattop'
},

/* ================================================================ microlens arrays */
{
  id: 'microlens-arrays', parent: 'beam-shaping', title: 'Microlens arrays and fly\'s-eye homogenizers', level: 2,
  short: 'A microlens array is a sheet carrying hundreds or thousands of tiny lenses side by side. Two of them and a condenser lens make a fly\'s-eye homogenizer, which cuts a beam into pieces and overlaps them to give an even patch; one in front of a camera is a Shack–Hartmann sensor that measures a wavefront; on a printed sheet it is a lenticular lens.',
  keywords: ['microlens array', 'lenslet array', 'fly\'s-eye', 'homogenizer', 'imaging homogenizer', 'condenser', 'Shack-Hartmann', 'lenticular', 'lenslet pitch', 'beam homogenization', 'integrator', 'excimer'],
  prereq: ['flat-top-beam-shapers', 'focal-length-and-optical-power', 'light-pipes-and-homogenizers'],
  related: ['microlenses-bsi-and-stacked-sensors', 'autostereograms-and-lenticular-images', 'autorefractors-and-aberrometers', 'projector-illumination', 'diffusers-and-ground-glass', 'coherence', 'speckle'],
  body: `
A microlens array is an array of tiny lenses, 0.1 to a few millimetres across, moulded or etched on a single plate of glass, fused silica or plastic. One lens does little; the array does three kinds of work.

### The fly's-eye homogenizer
Two arrays, face to face, and a **condenser** (Fourier) lens behind them:

1. The beam falls on the first array and is cut into **beamlets**, one per lenslet.
2. Each lenslet of the first array focuses its beamlet onto the matching lenslet of the second array, a focal length $f_{LA}$ away.
3. The second array and the condenser, of focal length $f_{FL}$, image the aperture of each first-array lenslet onto the same target.

Every beamlet therefore lights the same patch. A lenslet of pitch $p$ gives a patch of size

$$W = \\frac{p\\,f_{FL}}{f_{LA}}$$

and its shape follows the lenslet's aperture: square lenslets, a square patch; long thin ones, a line. A pitch of 1 mm, $f_{LA} = 10$ mm and $f_{FL} = 100$ mm give a 10 mm patch. Whatever the unevenness of the input, each beamlet adds an identical box; the sum is flat, and the more lenslets the beam covers the better the averaging.

| $p$ | $f_{LA}$ | $f_{FL}$ | Patch $W$ | Lenslet NA ($p/2f_{LA}$) |
|---|---|---|---|---|
| 1 mm | 10 mm | 100 mm | 10 mm | 0.05 |
| 0.5 mm | 5 mm | 200 mm | 20 mm | 0.05 |
| 1 mm | 20 mm | 300 mm | 15 mm | 0.025 |
| 0.3 mm | 3 mm | 50 mm | 5 mm | 0.05 |

### The coherence catch
With a lamp, an LED or an excimer laser (low spatial coherence) the beamlets simply add in intensity. With a coherent laser they **interfere**: the beamlets arrive as tilted plane waves, and the patch is covered by fringes of period

$$\\Lambda = \\frac{\\lambda f_{FL}}{p}$$

53 µm at 532 nm for the first row of the table, with a modulation that can reach 100 %. The cures are a source of low coherence, a diffuser, or arrays with random pitch; see [[coherence]] and [[speckle]].

### Wavefront sensors and lenticular sheets
A **Shack–Hartmann** sensor places an array a focal length $f_L$ in front of a camera. A wavefront tilted by a slope $\\theta$ across a lenslet moves its spot by $\\delta = f_L\\theta$; the grid of spot shifts is the map of wavefront slope, from which the wavefront is rebuilt. It is the heart of adaptive optics and of eye aberrometers ([[autorefractors-and-aberrometers]]).

A **lenticular** sheet is an array of cylindrical lenses over a print of interleaved strips: from each angle each lens shows one strip. A 40-lines-per-inch sheet has a pitch of 0.635 mm, a 100-lpi sheet 0.254 mm ([[autostereograms-and-lenticular-images]]). And in front of every pixel of a camera sensor is a microlens that funnels light into the photodiode ([[microlenses-bsi-and-stacked-sensors]]).

> [!key] Two lenslet arrays and a condenser overlap many beamlets into a flat patch of width $W = pf_{FL}/f_{LA}$; with a coherent beam they also make fringes of period $\\lambda f_{FL}/p$. One array in front of a camera measures wavefront slope, $\\delta = f_L\\theta$.
`,
  ideas: [
    'A microlens array is many tiny lenses on one plate, with pitches from 0.1 mm to a few millimetres.',
    'A fly\'s-eye homogenizer cuts a beam into beamlets and overlaps them all on one patch of width W = p f_FL / f_LA.',
    'The unevenness of the input averages out because each beamlet puts the same box on the target.',
    'A coherent laser makes the beamlets interfere in fringes of period λ f_FL / p; low-coherence sources do not.',
    'A Shack–Hartmann sensor reads a wavefront from the shifts δ = f_L θ of the spots behind a lenslet array.'
  ],
  pitfalls: [
    'A homogenizer makes any beam uniform — It makes the beam uniform in intensity only if the light is not coherent; with a laser the beamlets interfere and the patch is striped.',
    'The patch size depends on the beam size — It depends on the lenslet pitch and the two focal lengths, $W = pf_{FL}/f_{LA}$; the beam size only sets how many lenslets are used and so how well it averages.',
    'Smaller lenslets are better — Finer lenslets improve the averaging but diffraction at their edges blurs the patch edge, and fringes of period $\\lambda f_{FL}/p$ get coarser.',
    'A Shack–Hartmann sensor measures the phase directly — It measures slopes; the wavefront is reconstructed from them, and a slope sensor cannot see steps larger than a lenslet.'
  ],
  terms: [
    { term: 'Microlens array', also: ['lenslet array', 'MLA'], def: 'A regular grid of tiny lenses on one substrate. Pitch, focal length and fill factor are its main specifications.' },
    { term: 'Fly\'s-eye homogenizer', also: ['lenslet-array homogenizer', 'imaging homogenizer'], def: 'Two lenslet arrays and a condenser lens that cut a beam into beamlets and overlap them on one target to give an even patch.' },
    { term: 'Lenslet pitch', also: ['pitch'], def: 'The centre-to-centre distance of neighbouring lenslets. The patch size of a homogenizer is proportional to it.' },
    { term: 'Shack–Hartmann sensor', def: 'A microlens array in front of a camera. The displacement of each spot from its reference position measures the local slope of the wavefront.' },
    { term: 'Lenticular lens', also: ['lenticular sheet'], def: 'A sheet of parallel cylindrical lenses, used over interleaved strips of images so that a different image is seen from each direction.' },
    { term: 'Beamlet', def: 'The part of a beam that passes through one lenslet of an array. A homogenizer overlaps many beamlets on one patch.' }
  ],
  formulas: [
    {
      name: 'Patch size of a fly\'s-eye homogenizer',
      expr: 'W = p*fFL/fLA', tex: 'W = \\frac{p\\,f_{FL}}{f_{LA}}',
      vars: {
        W: { name: 'width of the flat patch', q: 'length', unit: 'mm' },
        p: { name: 'lenslet pitch', q: 'length', unit: 'mm', value: 1 },
        fFL: { name: 'focal length of the condenser lens', q: 'length', unit: 'mm', value: 100, tex: 'f_{FL}' },
        fLA: { name: 'focal length of the lenslets', q: 'length', unit: 'mm', value: 10, tex: 'f_{LA}' }
      },
      note: 'For lenslets that image the first array on the target. In the direction of each lenslet axis.',
      stories: { W: 'Lenslets of pitch {p} and focal length {fLA} are used with a condenser of focal length {fFL}. How wide is the flat patch?', fFL: 'A homogenizer with lenslets of pitch {p} and focal length {fLA} must make a patch {W} wide. What condenser focal length is needed?' }
    },
    {
      name: 'Fringe period with a coherent beam',
      expr: 'Lam = lambda*fFL/p', tex: '\\Lambda = \\frac{\\lambda\\,f_{FL}}{p}',
      vars: {
        Lam: { name: 'period of the interference fringes on the target', q: 'length', unit: 'µm', tex: '\\Lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        fFL: { name: 'focal length of the condenser lens', q: 'length', unit: 'mm', value: 100, tex: 'f_{FL}' },
        p: { name: 'lenslet pitch', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Only for light coherent across several lenslets.',
      stories: { Lam: 'A homogenizer with lenslets of pitch {p} and a condenser of focal length {fFL} is lit by {lambda} laser light. What is the period of the fringes?' }
    },
    {
      name: 'Shack–Hartmann spot displacement',
      expr: 'delta = fL*slope', tex: '\\delta = f_L\\,\\theta',
      vars: {
        delta: { name: 'displacement of the spot', q: 'length', unit: 'µm', tex: '\\delta' },
        fL: { name: 'focal length of the lenslets', q: 'length', unit: 'mm', value: 5, tex: 'f_L' },
        slope: { name: 'local slope of the wavefront', q: 'angle', unit: 'mrad', value: 1, tex: '\\theta' }
      },
      note: 'Small angles. The slope is the tilt of the wavefront over one lenslet.',
      stories: { delta: 'A wavefront has a local slope of {slope} over a lenslet of focal length {fL}. How far does its spot move?', slope: 'A lenslet of focal length {fL} shows its spot moved by {delta}. What is the local slope of the wavefront?' }
    }
  ],
  examples: [
    {
      title: 'Sizing a homogenizer',
      q: 'A homogenizer must make a patch 12 mm wide. The arrays have a pitch of 0.5 mm and a focal length of 5 mm. What condenser focal length is needed, and how many lenslets does a 6 mm wide beam cover?',
      steps: [
        { text: 'Solve the patch formula for the condenser:', tex: 'f_{FL} = \\frac{W f_{LA}}{p} = \\frac{12\\ \\mathrm{mm} \\times 5\\ \\mathrm{mm}}{0.5\\ \\mathrm{mm}} = 120\\ \\mathrm{mm}' },
        'The beam covers $6/0.5 = 12$ lenslets across, 144 in a square array.'
      ],
      a: 'A condenser of 120 mm focal length; a 6 mm beam is cut into 12 × 12 beamlets, which averages the beam well.'
    },
    {
      title: 'Fringes on a laser patch',
      q: 'The homogenizer of the previous example is lit by a 532 nm single-mode laser. What is the period of the fringes on the patch, and how many are there across it?',
      steps: [
        { text: 'The fringe period:', tex: '\\Lambda = \\frac{\\lambda f_{FL}}{p} = \\frac{0.532\\ \\mu\\mathrm{m} \\times 120\\ \\mathrm{mm}}{0.5\\ \\mathrm{mm}} = 128\\ \\mu\\mathrm{m}' },
        'Across 12 mm there are $12\\,000/128 \\approx 94$ fringes.'
      ],
      a: 'Fringes 128 µm apart, about 94 across the patch: a coherent laser makes a comb, not a flat top. A partially coherent source or a moving diffuser washes them out.'
    }
  ],
  quiz: [
    { q: 'A homogenizer has lenslets of pitch 1 mm and focal length 10 mm, and a condenser of focal length 200 mm. How wide is the patch, in mm?', answer: 20, unit: 'mm', why: '$W = pf_{FL}/f_{LA} = 1 \\times 200/10 = 20$ mm.' },
    { q: 'What happens to a lenslet homogenizer\'s patch when a single-mode laser is used?', choices: ['It is covered by fringes of period λ f_FL/p', 'It becomes a ring', 'It becomes perfectly uniform', 'It is brighter at the edge'], a: 0, why: 'The beamlets are mutually coherent: they interfere. Using a source of low spatial coherence or breaking the regular pitch removes the stripes.' },
    { q: 'Doubling the beam diameter in front of a fly\'s-eye homogenizer doubles the size of the patch.', a: false, why: 'The patch width $pf_{FL}/f_{LA}$ depends only on the lenslets and the condenser. A wider beam covers more lenslets and averages better, but does not change the patch.' },
    { q: 'In a Shack–Hartmann sensor with lenslets of focal length 5 mm, a spot moves by 5 µm. What is the local wavefront slope, in mrad?', answer: 1, unit: 'mrad', why: '$\\theta = \\delta/f_L = 5\\ \\mu\\mathrm{m}/5\\ \\mathrm{mm} = 1$ mrad.' },
    { q: 'A lenticular print is viewed from different angles and shows different pictures. What does each cylindrical lens do?', choices: ['It sends a different strip of the print to each viewing direction', 'It magnifies the print', 'It polarizes the light', 'It blocks every second strip'], a: 0, why: 'The sheet is a lens array; each lenslet maps each strip of the interleaved print on to one direction in front of it.' }
  ],
  applications: [
    'Excimer-laser annealing and lithography, where homogenizers give an even exposure field.',
    'Projector and LED illumination: lenslet integrators light the imaging panel evenly.',
    'Wavefront sensors for adaptive optics, eye aberrometers and lens testing.',
    'Lenticular prints, postcards and 3-D displays that change with the viewing angle.',
    'Camera and display sensors: a microlens on each pixel raises the light collected.'
  ],
  history: 'The fly\'s-eye lens is named for the compound eye of an insect and was used in the 1960s and 70s to even out the illumination of projectors and photolithography. The Shack–Hartmann sensor grew from the Hartmann test of telescope mirrors, in which a plate with holes replaced the lenslets; Roland Shack and Ben Platt put lenslets in place of the holes around 1971.',
  sources: [
    'F. M. Dickey (ed.), *Laser Beam Shaping: Theory and Techniques* (CRC Press) — the chapters on homogenizers.',
    'R. K. Tyson, *Principles of Adaptive Optics* (CRC Press) — the Shack–Hartmann wavefront sensor.',
    'The *Handbook of Optics*, the chapters on microlenses and on illumination systems.'
  ],
  sim: 'bs-flyseye'
},

/* ================================================================ diffractive optical elements */
{
  id: 'diffractive-optical-elements', parent: 'beam-shaping', title: 'Diffractive optical elements', level: 3,
  short: 'A diffractive optical element (DOE) is a plate etched with steps a fraction of a micrometre to a micrometre deep. They delay the light by a designed pattern of phases, and diffraction does the rest: one beam becomes a grid of beams, a ring, a flat top, a logo — or a lens. It works at its design wavelength and leaks a little into the zero order.',
  keywords: ['diffractive optical element', 'DOE', 'phase plate', 'beam splitter', 'Dammann grating', 'multi-spot', 'pattern generator', 'diffractive lens', 'diffraction efficiency', 'zero order', 'binary optics', 'blazed', 'multilevel', 'phase relief', 'diffuser'],
  prereq: ['the-grating-equation', 'grating-types-and-blaze', 'beam-shaping-overview'],
  related: ['pattern-projectors', 'spatial-light-modulators', 'holographic-optical-elements', 'flat-top-beam-shapers', 'metalenses-and-flat-optics', 'fresnel-diffraction-and-zone-plates', 'fourier-optics'],
  body: `
A piece of glass of thickness $h$ delays light by $(n-1)h$ compared with the same distance in air. Etch the surface so that $h$ varies across it, and the wavefront that leaves carries a pattern of delays: a **phase mask**. Because a wavefront is a recipe for how the light moves on, a designed pattern of delays sends it where you want. That is a **diffractive optical element**.

### Depth: one wavelength of delay
A delay of one whole wavelength, a phase of $2\\pi$, is equivalent to none. The relief is therefore a series of steps within one such cycle, of height $h = \\lambda/(n-1)$: 1.385 µm in fused silica at 633 nm ($n = 1.457$), 1.229 µm in N-BK7. A binary element with two levels, a delay of half a wavelength, needs half of that.

### Angles and features
A periodic pattern of period $d$ sends light to orders at angles $\\sin\\theta_m = m\\lambda/d$ ([[the-grating-equation]]): a 10 µm period at 650 nm gives 3.73°. The finer the pattern, the larger the angle: to spread light over a full angle $\\Theta$ the smallest feature is $\\lambda/(2\\sin(\\Theta/2))$, 0.77 µm for 50° at 650 nm.

### Efficiency and the number of levels
The ideal sawtooth (blaze) would put all the light in one order. A staircase of $L$ levels approximates it with efficiency $\\eta = [\\sin(\\pi/L)/(\\pi/L)]^2$:

| Levels | 2 | 4 | 8 | 16 |
|---|---|---|---|---|
| light in the wanted order | 40.5 % | 81.1 % | 95.0 % | 98.7 % |
| lithography masks | 1 | 2 | 3 | 4 |

(A two-level grating is symmetric: the 40.5 % goes to each of the +1 and −1 orders.) Each mask doubles the number of levels.

### One wavelength only
The relief is exact for one wavelength $\\lambda_0$. At other wavelengths the delay is wrong and light is left in the zero order: a blazed element keeps 96 % of its first order at $0.9\\,\\lambda_0$ and 97 % at $1.1\\,\\lambda_0$, 81 % at 0.8 and 91 % at 1.2. A binary element with a depth error of 5 % leaves 0.6 % of the light in the undeviated **zero order**, a bright dot in the middle of the pattern. For a projector this is the chief problem, and an eye-safety one.

### A lens made of steps
A DOE can be a lens too: concentric zones as in a zone plate ([[fresnel-diffraction-and-zone-plates]]). It differs from a glass lens in its colour: its focal length goes as $1/\\lambda$, a dispersion of $-3.45$ on the Abbe scale, opposite in sign to glass, so a diffractive surface added to a refractive lens can cancel its colour error (a hybrid lens).

### Making them
Fused-silica elements are made by lithography and etching, as in microchips, and moulded copies in plastic by embossing and injection moulding, which is what makes them cheap enough for a phone.

> [!key] A DOE is a relief of depth $\\lambda/(n-1)$ that sends light to orders at $\\sin\\theta = m\\lambda/d$. $L$ levels give an efficiency $[\\sin(\\pi/L)/(\\pi/L)]^2$; away from the design wavelength or depth, light leaks into the zero order.
`,
  ideas: [
    'A DOE is a plate with a surface relief that delays the light by a designed pattern of phases, so diffraction steers it.',
    'A delay of 2π is the same as none, so the relief is one wavelength of delay deep: h = λ/(n − 1).',
    'Periodic patterns send light to orders at sin θ = mλ/d; finer features give larger angles.',
    'A staircase of L levels gives an efficiency [sin(π/L)/(π/L)]²: 40 % for 2, 81 % for 4, 95 % for 8, 99 % for 16.',
    'Depth and wavelength errors send light into the undeviated zero order.'
  ],
  pitfalls: [
    'A DOE works at all wavelengths — The relief is exact for its design wavelength; at others the efficiency falls and the zero order grows. A diffractive lens is also strongly coloured, with a focal length proportional to 1/λ.',
    'A DOE splits a beam into equal parts for free — Each pattern is designed for a wavelength, polarization and beam size, and none is perfectly efficient: a few per cent end up in unwanted orders, and the zero order is the worst.',
    'A binary (two-level) DOE is as good as a multilevel one — A two-level grating has at most 40.5 % in each of its first orders and is symmetric; four levels give 81 % in one order and eight 95 %.',
    'A DOE is the same as a hologram — Both diffract; a DOE is a computed, usually thin surface relief with a design wavelength, a hologram is a recorded interference pattern, often thick (see [[holographic-optical-elements]]).'
  ],
  terms: [
    { term: 'Diffractive optical element', also: ['DOE', 'diffractive element', 'phase plate'], def: 'A plate with a microscopic surface relief that changes the phase of the light passing through it in a designed pattern, so that diffraction forms a desired beam or pattern.' },
    { term: 'Diffraction efficiency', also: ['efficiency'], def: 'The fraction of the incident power that goes into the wanted order or pattern.' },
    { term: 'Zero order', also: ['undiffracted beam', 'zero-order leakage'], def: 'The light that passes straight through the element undeviated, because the relief does not delay it exactly as designed. In a pattern generator it forms an unwanted bright central spot.' },
    { term: 'Multilevel phase element', also: ['binary optics', 'staircase element'], def: 'A DOE whose relief is a staircase of 2, 4, 8 or more levels approximating a smooth blaze; each doubling needs one more lithography mask.' },
    { term: 'Phase mask', also: ['phase pattern'], def: 'The map of the delays given to the light across a DOE or an SLM: a relief depth in a DOE, a pixel value in an SLM.' },
    { term: 'Dammann grating', def: 'A binary phase grating whose transitions are placed so that it divides a beam into many orders of equal intensity.' }
  ],
  formulas: [
    {
      name: 'Angle of a diffraction order',
      expr: 'theta = asin(m*lambda/d)', tex: '\\sin\\theta_m = \\frac{m\\,\\lambda}{d}',
      vars: {
        theta: { name: 'angle of the order', q: 'angle', unit: '°', tex: '\\theta_m' },
        m: { name: 'order', value: 1, min: 1, max: 40, int: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650, tex: '\\lambda' },
        d: { name: 'period of the pattern', q: 'length', unit: 'µm', value: 10 }
      },
      solveFor: 'theta',
      note: 'Light at normal incidence. No solution when mλ/d exceeds 1: that order does not exist.',
      stories: { theta: 'A DOE with a period of {d} is lit by {lambda} light. At what angle does order {m} leave?', d: 'A DOE must send {lambda} light into order {m} at {theta}. What period does it need?' }
    },
    {
      name: 'Depth of the relief',
      expr: 'h = lambda/(n - 1)', tex: 'h = \\frac{\\lambda}{n-1}',
      vars: {
        h: { name: 'relief depth for a delay of one wavelength', q: 'length', unit: 'µm' },
        lambda: { name: 'design wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        n: { name: 'refractive index of the material', value: 1.457, min: 1.05, max: 4 }
      },
      note: 'For a full 2π delay in transmission. A two-level π element needs half of it.',
      stories: { h: 'A DOE for {lambda} is etched into a material of index {n}. How deep is a full-wavelength step?' }
    },
    {
      name: 'Efficiency of a staircase of L levels',
      expr: 'eta = (sin(pi/L)/(pi/L))^2', tex: '\\eta = \\left[\\frac{\\sin(\\pi/L)}{\\pi/L}\\right]^2',
      vars: {
        eta: { name: 'light in the first order', q: 'ratio', unit: '%', tex: '\\eta' },
        L: { name: 'number of phase levels', value: 8, min: 2, max: 256 }
      },
      note: 'At the design wavelength and an exact depth, for a sawtooth period built of L equal steps.',
      stories: { eta: 'A DOE grating is etched with {L} phase levels. What fraction of the light is in its first order?' }
    },
    {
      name: 'Smallest feature for a given spread',
      expr: 'fmin = lambda/(2*sin(Theta/2))', tex: 'f_{\\min} = \\frac{\\lambda}{2\\sin(\\Theta/2)}',
      vars: {
        fmin: { name: 'smallest feature', q: 'length', unit: 'µm', tex: 'f_{\\min}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650, tex: '\\lambda' },
        Theta: { name: 'full spread angle of the pattern', q: 'angle', unit: '°', value: 50, min: 1, max: 170, tex: '\\Theta' }
      },
      note: 'Light needs features this small to be sent that far from the axis.',
      stories: { fmin: 'A DOE must spread {lambda} light over a full angle of {Theta}. How small must its finest feature be?' }
    }
  ],
  examples: [
    {
      title: 'A grating that splits a HeNe beam',
      q: 'A binary phase grating of period 20 µm is lit at normal incidence by 633 nm light. At what angles are the orders, and how deep must the steps be in fused silica ($n = 1.457$) for the zero order to vanish?',
      steps: [
        { text: 'The orders leave at $\\sin\\theta_m = m\\lambda/d$:', tex: '\\theta_1 = \\arcsin\\frac{0.633}{20} = 1.81°,\\quad \\theta_3 = \\arcsin\\frac{3 \\times 0.633}{20} = 5.45°' },
        { text: 'The zero order vanishes for a phase step of $\\pi$, a delay of half a wavelength:', tex: 'h = \\frac{\\lambda}{2(n-1)} = \\frac{0.633\\ \\mu\\mathrm{m}}{2 \\times 0.457} = 0.69\\ \\mu\\mathrm{m}' },
        'A two-level grating has only odd orders, each ±1 order with 40.5 % of the light.'
      ],
      a: 'Orders at ±1.81°, ±5.45°, … (odd only); the steps are 0.69 µm deep; 81 % of the light goes to the two first orders.'
    },
    {
      title: 'How many levels for 95 %?',
      q: 'A diffractive deflector must send at least 95 % of the light into one order. How many levels, and how many lithography masks, does it need?',
      steps: [
        { text: 'The efficiency of $L$ levels is $[\\sin(\\pi/L)/(\\pi/L)]^2$. For $L = 8$:', tex: '\\eta = \\left[\\frac{\\sin(22.5°)}{0.3927}\\right]^2 = 0.9496' },
        'That is 95.0 %: 8 levels, 3 masks (each doubles the levels: 2, 4, 8).'
      ],
      a: '8 levels and 3 masks, giving 95.0 %; 16 levels (4 masks) would give 98.7 %.'
    }
  ],
  quiz: [
    { q: 'A diffractive grating has a period of 10 µm and is lit by 650 nm light at normal incidence. At what angle, in degrees, does the first order leave?', answer: 3.73, unit: '°', why: '$\\sin\\theta = 0.65/10 = 0.065$, so $\\theta = 3.73°$.' },
    { q: 'A DOE is etched with 4 phase levels. What fraction of the light goes into its wanted first order at the design wavelength?', choices: ['40.5 %', '81.1 %', '95.0 %', '100 %'], a: 1, why: '$[\\sin(\\pi/4)/(\\pi/4)]^2 = 0.811$. Two levels give 40.5 %, eight give 95 %.' },
    { q: 'A DOE designed for 650 nm is used with 532 nm light. The efficiency is the same, as the grating equation still holds.', a: false, why: 'The orders move, but the relief depth is now the wrong fraction of a wavelength, and light is left in the zero order and unwanted orders.' },
    { q: 'What is the main nuisance of a DOE pattern projector?', choices: ['The zero order, a bright undeviated spot', 'The pattern is upside down', 'It cannot make dots', 'It needs a lens of focal length zero'], a: 0, why: 'Depth, wavelength and tolerance errors leave a few per cent of the light in the zero order, which comes out as one bright spot in the middle of the pattern.' },
    { q: 'Why is a DOE lens combined with a glass lens in a "hybrid" achromat?', choices: ['Its dispersion has the opposite sign to glass', 'It is cheaper than glass', 'It has no aberrations at all', 'It does not need coating'], a: 0, why: 'The focal length of a diffractive lens grows as 1/λ, so its colour error is opposite to that of a refractive lens; the two can cancel.' }
  ],
  applications: [
    'Depth-sensing and face-recognition modules: one laser beam is copied into thousands of dots.',
    'Laser material processing: beam splitters for parallel drilling, flat-top and ring spots.',
    'Beam samplers and multi-spot generators for optical testing and displays.',
    'Hybrid camera and eyepiece lenses that use a diffractive surface to cancel colour.',
    'Diffusers with designed angular spread for LED and laser illumination.'
  ],
  history: 'Dammann and Görtler showed in 1971 that a binary phase grating can divide a beam into an array of equal spots. The 1980s and 90s brought multi-level binary optics made by chip-making lithography, and the computer design of arbitrary phase patterns by iterative algorithms, notably that of Gerchberg and Saxton.',
  sources: [
    'D. C. O\'Shea, T. J. Suleski, A. D. Kathman and D. W. Prather, *Diffractive Optics: Design, Fabrication and Test* (SPIE) — the standard text.',
    'H. Dammann and K. Görtler, "High-efficiency in-line multiple imaging by means of multiple phase holograms", *Optics Communications* 3 (1971).',
    'R. W. Gerchberg and W. O. Saxton, "A practical algorithm for the determination of phase from image and diffraction plane pictures", *Optik* 35 (1972).'
  ],
  sim: 'bs-doe'
},

/* ================================================================ pattern projectors */
{
  id: 'pattern-projectors', parent: 'beam-shaping', title: 'Projecting dots, grids and shapes', level: 2,
  short: 'A pattern projector is a laser or LED and a diffractive element (or a mask and lens) that throws a known pattern of dots, lines or shapes on a scene. A camera sees how the pattern is bent by the objects in it, and the sideways shift of each dot gives its distance: this is how depth cameras, 3-D scanners and alignment tools work.',
  keywords: ['pattern projector', 'dot projector', 'dot matrix', 'structured light', 'depth camera', 'random dot pattern', 'cross-hair laser', 'DOE projector', 'disparity', 'baseline', 'triangulation', 'infrared projector', '940 nm', 'face recognition'],
  prereq: ['diffractive-optical-elements', 'laser-line-generators', 'beam-shaping-overview'],
  related: ['structured-light-scanning', 'laser-triangulation', 'three-d-machine-vision', 'time-of-flight-cameras', 'vcsels-and-laser-arrays', 'laser-safety-classes', 'interference-filters', 'spatial-light-modulators'],
  body: `
Shine a regular grid of dots on a wall, then put a box in front of it. Seen from a camera that is not at the projector, the dots that fall on the box have moved sideways: the nearer the surface, the larger the shift. Measure the shift of each dot and you have the shape of the scene. A **pattern projector** is the source of those dots, and a diffractive element ([[diffractive-optical-elements]]) is the usual way to make them: a laser beam falls on a DOE that copies it into a grid of beams at fixed angles.

### How far apart are the dots?
For orders of a grating of period $d$ at wavelength $\\lambda$ the angular pitch is $\\Delta\\theta \\approx \\lambda/d$, and at a distance $z$ the dots are $s = z\\tan\\Delta\\theta$ apart. A DOE period of 100 µm at 940 nm gives a pitch of 0.54°, 9.4 mm at 1 m and 28 mm at 3 m. The dots do not grow, since each is the original beam, but they move apart. Dot arrays range from a few dots, for a cross-hair, to tens of thousands in a depth sensor.

### Depth from the shift
Let the camera sit a baseline $b$ from the projector and have a focal length of $f$ pixels. A dot on a surface at distance $z$ appears displaced by the **disparity**

$$d = \\frac{b\\,f}{z}$$

pixels from where it would appear at infinity. For $b = 50$ mm and $f = 800$ pixels:

| Distance $z$ | 0.5 m | 1 m | 2 m | 3 m |
|---|---|---|---|---|
| disparity | 80 px | 40 px | 20 px | 13.3 px |
| depth step for 0.1 px | 0.6 mm | 2.5 mm | 10 mm | 22.5 mm |

The last row follows from $\\Delta z = z^2\\,\\delta/(b f)$: the depth resolution gets worse as the square of the distance, and improves with a longer baseline or a longer focal length. Locating a dot to a tenth of a pixel is routine.

### Which dot is which?
A regular grid is ambiguous: a dot shifted by one grid step looks like its neighbour. Depth cameras therefore use **irregular** patterns: every small patch of dots is unique, so the camera can find the patch in the reference and measure its shift. Other systems code the dots in time or by size, or project stripes and fringes with a programmable modulator ([[structured-light-scanning]]).

### The details that make it work
- **Near infrared.** 850 or 940 nm, so that the pattern is invisible; 940 nm also falls in a dip of the sunlight reaching the ground, which helps outdoors.
- **A narrow filter** in front of the camera, matched to the laser, removes ambient light ([[interference-filters]]).
- **Other shapes.** A DOE can as easily make a cross-hair, a circle, a line grid or an arrow for alignment as an array of dots.

> [!warn] Pattern projectors are lasers, usually invisible ones. Dividing a beam into many does not by itself make it eye-safe: the zero order of an imperfect element carries a concentrated part of the power, and a damaged element can send the whole beam through. Safe products are designed and tested to the laser standard ([[laser-safety-classes]]); never modify or run one without its element.

> [!key] A projector copies a laser into a pattern at known angles ($s = z\\tan\\Delta\\theta$); a camera at a baseline $b$ sees each dot displaced by $d = bf/z$, so depth follows from the shift. Irregular patterns remove the ambiguity of a regular grid.
`,
  ideas: [
    'A DOE copies a laser beam into a grid, ring or any pattern of beams at fixed angles; dot spacing at distance z is z tan Δθ with Δθ ≈ λ/d.',
    'The dots do not grow with distance; their spacing does.',
    'A camera at baseline b sees each dot shifted by d = bf/z pixels: nearer surfaces shift more.',
    'Depth resolution Δz = z²δ/(bf) gets worse with the square of the distance and better with a longer baseline.',
    'Irregular patterns make each patch of dots unique, so the camera can tell which dot is which.'
  ],
  pitfalls: [
    'More dots always means a better depth map — More dots give more samples, but each must still be found and matched to the reference; the depth precision is set by the baseline, focal length and how finely a dot can be located.',
    'A regular grid is the best pattern — Its repetition makes the dot matching ambiguous: a dot moved by one pitch looks like its neighbour. Depth cameras use irregular patterns.',
    'Many weak dots are automatically eye-safe — The total power is unchanged, a zero order can concentrate part of it, and a broken element can pass the whole beam. Safety depends on the design and the standard.',
    'The depth precision is the same at every distance — It falls with the square of the distance: 2.5 mm at 1 m but 22.5 mm at 3 m for the same camera.'
  ],
  terms: [
    { term: 'Pattern projector', also: ['dot projector', 'structured-light projector'], def: 'A source and optic, often a laser and a diffractive element, that projects a known pattern of dots, lines or shapes on a scene.' },
    { term: 'Dot pitch', also: ['angular pitch'], def: 'The angle between neighbouring dots of a projected grid, about λ/d for a grating of period d. The spacing on a target is the distance times the tangent of the pitch.' },
    { term: 'Reference pattern', also: ['reference image'], def: 'The image of the projected pattern on a flat target at a known distance, stored by the system: the shift of each dot from it gives the depth of the surface.' },
    { term: 'Random-dot pattern', also: ['speckle pattern', 'irregular dot pattern'], def: 'An irregular arrangement of dots in which every small patch is unique, so a camera can match patches to a stored reference and find the depth of each.' }
  ],
  formulas: [
    {
      name: 'Dot spacing at a distance',
      expr: 's = z*tan(dtheta)', tex: 's = z\\,\\tan\\Delta\\theta',
      vars: {
        s: { name: 'spacing of the dots on a flat target', q: 'length', unit: 'mm' },
        z: { name: 'distance to the target', q: 'length', unit: 'm', value: 1 },
        dtheta: { name: 'angular pitch between neighbouring dots', q: 'angle', unit: '°', value: 0.54, min: 0.01, max: 30, tex: '\\Delta\\theta' }
      },
      solveFor: 's',
      note: 'A target square to the projector. The angular pitch of a grating is about λ/d.',
      stories: { s: 'A projector has an angular pitch of {dtheta}. How far apart are its dots on a wall {z} away?', dtheta: 'Dots must be {s} apart on a wall {z} away. What angular pitch does the projector need?' }
    },
    {
      name: 'Disparity of a dot',
      expr: 'd = b*f/z', tex: 'd = \\frac{b\\,f}{z}',
      vars: {
        d: { name: 'disparity, in pixels', tex: 'd' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 50 },
        f: { name: 'focal length of the camera, in pixels', value: 800 },
        z: { name: 'distance to the surface', q: 'length', unit: 'm', value: 1 }
      },
      note: 'The focal length is counted in pixels (the focal length in millimetres divided by the pixel pitch), so the disparity comes out in pixels.',
      stories: { d: 'A projector and a camera are {b} apart, with a camera focal length of {f} pixels. What is the disparity of a dot on a surface {z} away?' }
    },
    {
      name: 'Depth resolution',
      expr: 'dz = z^2*delta/(b*f)', tex: '\\Delta z = \\frac{z^2\\,\\delta}{b\\,f}',
      vars: {
        dz: { name: 'depth step for a disparity step δ', q: 'length', unit: 'mm', tex: '\\Delta z' },
        z: { name: 'distance', q: 'length', unit: 'm', value: 1 },
        delta: { name: 'smallest disparity step the camera can measure, in pixels', value: 0.1, tex: '\\delta' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 50 },
        f: { name: 'focal length of the camera, in pixels', value: 800 }
      },
      solveFor: 'dz',
      note: 'Valid while Δz is small compared with z.',
      stories: { dz: 'A depth camera has a {b} baseline and a focal length of {f} pixels, and measures disparity to {delta} pixel. What is its depth step at {z}?' }
    }
  ],
  examples: [
    {
      title: 'A dot grid on a wall',
      q: 'A DOE with a period of 100 µm is lit by a 940 nm laser. What is the angular pitch of the dots, and how far apart are they on a wall 2 m away?',
      steps: [
        { text: 'The first order leaves at', tex: '\\Delta\\theta = \\arcsin\\frac{0.94}{100} = 0.539°' },
        { text: 'and the spacing at 2 m is', tex: 's = 2\\ \\mathrm{m} \\times \\tan 0.539° = 18.8\\ \\mathrm{mm}' }
      ],
      a: 'A pitch of 0.54° and 18.8 mm between dots at 2 m. The dots stay as wide as the beam; only their spacing grows.'
    },
    {
      title: 'The depth step of a camera',
      q: 'A depth camera has a 50 mm baseline and a focal length of 800 pixels, and finds each dot to 0.1 pixel. What depth change does 0.1 pixel stand for at 2 m, and at what distance is it 1 cm?',
      steps: [
        { text: 'At 2 m:', tex: '\\Delta z = \\frac{z^2 \\delta}{b f} = \\frac{(2\\ \\mathrm{m})^2 \\times 0.1}{0.05\\ \\mathrm{m} \\times 800} = 10\\ \\mathrm{mm}' },
        'Since $\\Delta z$ goes as $z^2$, 1 cm is the step at exactly 2 m.'
      ],
      a: '10 mm at 2 m. A step of 2.5 mm at 1 m but 22.5 mm at 3 m: depth precision falls with the square of the distance.'
    }
  ],
  quiz: [
    { q: 'A projector has an angular pitch of 0.54° between dots. How far apart, in mm, are the dots on a wall 3 m away?', answer: 28.3, unit: 'mm', why: '$s = z\\tan\\Delta\\theta = 3000\\ \\mathrm{mm} \\times \\tan 0.54° = 28.3$ mm.' },
    { q: 'As the target moves away from the projector, what happens to the dots?', choices: ['They stay the same size but move apart', 'They grow and stay the same distance apart', 'They shrink', 'They merge into a line'], a: 0, why: 'Each dot is a copy of the original collimated beam; the angle between dots is fixed, so their spacing grows with distance.' },
    { q: 'The disparity of a dot, in a camera next to the projector, is larger for a surface that is farther away.', a: false, why: '$d = bf/z$: the nearer the surface, the larger the shift.' },
    { q: 'A camera has a 60 mm baseline and a focal length of 1000 pixels. What is the disparity, in pixels, at 1.5 m?', answer: 40, unit: 'px', why: '$d = bf/z = 0.06 \\times 1000/1.5 = 40$ pixels.' },
    { q: 'Why do depth cameras use irregular dot patterns?', choices: ['So that each patch of dots is unique and can be matched to the reference', 'To save laser power', 'Because gratings cannot make regular grids', 'To make the dots larger'], a: 0, why: 'A regular grid repeats; a dot shifted by one pitch is indistinguishable from its neighbour. An irregular pattern lets the camera tell which dot is which.' }
  ],
  applications: [
    'Depth cameras for games and robots, and the face-recognition modules of phones.',
    'Structured-light 3-D scanners for reverse engineering and quality control.',
    'Laser levels and alignment tools with cross-hair, line-grid and ring patterns.',
    'Calibration of cameras and projectors with known dot grids.',
    'Stage and display lighting with laser patterns (at powers and distances set by the safety rules).'
  ],
  history: 'Depth from a projected pattern is an old idea, used in 3-D shape measurement since the 1970s with stripes and grids. Dot projectors with a diffractive element and an infrared laser reached consumer products in the early 2010s, in game-console depth cameras, and a few years later in phones.',
  sources: [
    'J. Geng, "Structured-light 3D surface imaging: a tutorial", *Advances in Optics and Photonics* 3 (2011).',
    'D. C. O\'Shea, T. J. Suleski, A. D. Kathman and D. W. Prather, *Diffractive Optics: Design, Fabrication and Test* (SPIE) — multi-spot generators.',
    'IEC 60825-1, *Safety of laser products — Equipment classification and requirements* — the classes and their limits.'
  ],
  sim: 'bs-dots'
},

/* ================================================================ spatial light modulators */
{
  id: 'spatial-light-modulators', parent: 'beam-shaping', title: 'Spatial light modulators', level: 3,
  short: 'A spatial light modulator (SLM) is a screen whose pixels change the phase or the amplitude of light passing through or reflecting from it. Show it the right image and it becomes a lens, a grating, a beam splitter or a hologram of any pattern, changed in milliseconds: a diffractive element you can rewrite.',
  keywords: ['spatial light modulator', 'SLM', 'LCOS', 'liquid crystal on silicon', 'phase modulator', 'micromirror', 'DMD', 'computer-generated hologram', 'Gerchberg-Saxton', 'beam steering', 'optical tweezers', 'wavefront correction', 'holographic display'],
  prereq: ['diffractive-optical-elements', 'liquid-crystals-and-displays', 'fourier-optics'],
  related: ['holographic-optical-elements', 'pattern-projectors', 'higher-order-modes', 'the-data-projector', 'laser-projection-and-displays', 'wave-plates', 'flat-top-beam-shapers'],
  body: `
A [[diffractive-optical-elements|diffractive element]] is made once and does one thing. A **spatial light modulator** is a diffractive element on a chip: a grid of pixels, each of which can be set to delay the light by any amount between zero and a full wave. Display a pattern and the light goes where the pattern sends it; change the pattern and it goes elsewhere.

### What an SLM is made of
- **LCOS phase modulators** (liquid crystal on silicon): a layer of liquid crystal over a reflective chip. A voltage tilts the molecules of each pixel and so changes the index seen by light polarized along them, delaying it by up to $2\\pi$ ([[liquid-crystals-and-displays]]). They need polarized light. Pixel pitches run from about 4 to 20 µm; typical sizes 1920 × 1080; refresh rates tens of Hz to a few hundred; 8-bit (256-level) phase.
- **Micromirror arrays** (DMDs): tiny mirrors that tip by about ±12° between two positions. They switch amplitude, on or off, thousands of times a second, and are the engine of data projectors; with a trick they make phase patterns too.
- **Liquid-crystal panels** used for amplitude, as in a projector panel, and the early SLMs of this kind.

### Steering and levels
Displaying a blazed grating of $N$ pixels per period steers light by $\\sin\\theta = \\lambda/(Np)$. The shortest period the pixels can draw is $N = 2$, so the largest angle is

$$\\sin\\theta_{\\max} = \\frac{\\lambda}{2p}$$

1.9° for 8 µm pixels at 532 nm, 8.2° for 3.74 µm pixels at 1064 nm. Beyond a few degrees the SLM cannot go, which is why SLM beams are expanded with a lens afterwards. With $L$ phase levels the efficiency of such a grating is the same $[\\sin(\\pi/L)/(\\pi/L)]^2$ as for a DOE: 40.5 % for 2 levels, 95 % for 8, 99.99 % for 256 levels.

### Computer-generated holograms
To make an arbitrary pattern, such as six spots, a ring or a letter, the SLM must show the phase mask whose far-field is that pattern. The standard way is the **Gerchberg–Saxton** iteration: start from a random phase; transform to the far field; keep its phase but replace its amplitude by the target; transform back; keep the phase but replace the amplitude by the laser beam's; repeat. A few tens of rounds give a good mask. The simulation below does exactly that, and shows what 2, 4 and 8 phase levels do to the result.

What is left over: noise (speckle) in the pattern, a **zero order** — the undiffracted light from the gaps between pixels, a bright dot in the centre — and a loss when the pixel edges blur the phase ("fringing").

### What it is used for
Optical tweezers that trap an array of particles; parallel laser micromachining with many spots; adaptive optics, where the SLM shows the opposite of the aberration; shaping a beam into a flat top, a Bessel beam or a vortex beam ([[higher-order-modes]]); pulse shaping; holographic displays and AR optics.

> [!key] An SLM is a rewritable diffractive element. Its pixels set the phase; a blazed grating steers by $\\sin\\theta = \\lambda/(Np)$ up to $\\lambda/2p$; Gerchberg–Saxton finds the mask for any pattern, and more phase levels give more of the light in it.
`,
  ideas: [
    'An SLM is a chip of pixels that each set the phase (LCOS) or switch the amplitude (DMD) of light: a diffractive element that can be rewritten.',
    'A blazed grating of N pixels per period steers light by sin θ = λ/(Np); the largest angle is λ/2p, a few degrees.',
    'With L phase levels a grating has efficiency [sin(π/L)/(π/L)]²: 8 levels give 95 %, 256 levels 99.99 %.',
    'The Gerchberg–Saxton algorithm iterates between the SLM plane and the far field to find the phase mask for a given pattern.',
    'Leftovers are speckle noise, a zero order from the pixel gaps and fringing loss at the pixel edges.'
  ],
  pitfalls: [
    'An SLM can steer a beam to any angle — The pixels set the limit: λ/2p, about 1–8° for typical chips. Wide angles need an optical magnifier after the SLM.',
    'An SLM modulates any light — A phase LCOS works on one linear polarization only (the one along the liquid crystal axis). The other polarization passes unmodulated, as zero order.',
    'The pattern is exactly the one you asked for — The algorithm gives a pattern with speckle and noise, a zero order and, with few phase levels, ghost orders. The result is as good as the iterations and levels allow.',
    'A DMD is a phase modulator — It is an amplitude modulator with two states. Phase patterns are made by encoding them in binary patterns (with a loss of light), not directly.'
  ],
  terms: [
    { term: 'Spatial light modulator', also: ['SLM'], def: 'A device whose pixels each change the phase, the amplitude or the polarization of the light that falls on them, under electrical control.' },
    { term: 'LCOS', also: ['liquid crystal on silicon'], def: 'A reflective SLM made of a liquid-crystal layer on a silicon chip whose pixel electrodes set the phase delay of each pixel.' },
    { term: 'DMD', also: ['digital micromirror device', 'micromirror array'], def: 'A chip of microscopic mirrors, each tilting between two positions, which switches amplitude on or off per pixel at kilohertz rates.' },
    { term: 'Computer-generated hologram', also: ['CGH'], def: 'A phase or amplitude pattern calculated, not recorded, so that its far-field diffraction pattern is a chosen image.' },
    { term: 'Gerchberg–Saxton algorithm', also: ['GS algorithm'], def: 'An iterative method that finds a phase mask whose far field matches a target by alternately imposing the known amplitudes on the mask plane and on the far field.' },
    { term: 'Phase levels', def: 'The number of distinct phase delays a pixel can take. 256 levels (8 bits) is typical of LCOS.' }
  ],
  formulas: [
    {
      name: 'Steering angle of a blazed grating on an SLM',
      expr: 'theta = asin(lambda/(N*p))', tex: '\\sin\\theta = \\frac{\\lambda}{N\\,p}',
      vars: {
        theta: { name: 'steering angle', q: 'angle', unit: '°', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        N: { name: 'pixels per grating period', value: 4, min: 2, max: 1000 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 8 }
      },
      solveFor: 'theta',
      note: 'The smallest period is N = 2 pixels, which gives the largest angle λ/2p.',
      stories: { theta: 'A blazed phase grating of {N} pixels per period is shown on an SLM with {p} pixels, in {lambda} light. By what angle does it steer the beam?' }
    },
    {
      name: 'Efficiency of a grating of L levels',
      expr: 'eta = (sin(pi/L)/(pi/L))^2', tex: '\\eta = \\left[\\frac{\\sin(\\pi/L)}{\\pi/L}\\right]^2',
      vars: {
        eta: { name: 'light in the wanted order', q: 'ratio', unit: '%', tex: '\\eta' },
        L: { name: 'number of phase levels', value: 8, min: 2, max: 1024 }
      },
      note: 'A sawtooth built of L equal steps in one period of the grating.',
      stories: { eta: 'An SLM shows a blazed grating with {L} phase levels. What fraction of the light is in the first order?' }
    },
    {
      name: 'Largest radius of a lens shown on an SLM',
      expr: 'rmax = lambda*f/(2*p)', tex: 'r_{\\max} = \\frac{\\lambda\\,f}{2\\,p}',
      vars: {
        rmax: { name: 'largest radius at which the lens phase is sampled', q: 'length', unit: 'mm', tex: 'r_{\\max}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        f: { name: 'focal length of the displayed lens', q: 'length', unit: 'mm', value: 500 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 8 }
      },
      note: 'Beyond this radius the phase of the lens changes by more than π between pixels and the lens is aliased.',
      stories: { rmax: 'A lens of focal length {f} is displayed on an SLM with {p} pixels, for {lambda} light. Out to what radius does it work?' }
    }
  ],
  examples: [
    {
      title: 'How far can this SLM steer?',
      q: 'An LCOS chip has 8 µm pixels. What is the largest angle it can steer 532 nm light by, and the angle for a grating of 8 pixels per period?',
      steps: [
        { text: 'The shortest period is 2 pixels:', tex: '\\theta_{\\max} = \\arcsin\\frac{0.532}{2 \\times 8} = 1.91°' },
        { text: 'With 8 pixels per period:', tex: '\\theta = \\arcsin\\frac{0.532}{8 \\times 8} = 0.48°' }
      ],
      a: '1.9° at most, 0.48° for 8 pixels per period: small angles, hence the lens after the SLM.'
    },
    {
      title: 'Is 8-bit phase enough?',
      q: 'What is the efficiency of a blazed grating with 256 phase levels, and what would 4 levels give?',
      steps: [
        { text: '256 levels:', tex: '\\eta = \\left[\\frac{\\sin(\\pi/256)}{\\pi/256}\\right]^2 = 0.99995' },
        { text: '4 levels:', tex: '\\eta = \\left[\\frac{\\sin(\\pi/4)}{\\pi/4}\\right]^2 = 0.811' }
      ],
      a: '99.995 % with 256 levels and 81 % with 4: the quantization of an 8-bit SLM costs nothing noticeable; the losses come from fringing and the pixel gaps.'
    }
  ],
  quiz: [
    { q: 'An SLM has 12.5 µm pixels and is used with 1064 nm light. What is the largest steering angle, in degrees?', answer: 2.44, unit: '°', why: '$\\theta_{\\max} = \\arcsin(\\lambda/2p) = \\arcsin(1.064/25) = 2.44°$.' },
    { q: 'Which kind of SLM changes the phase of light directly?', choices: ['LCOS', 'DMD', 'a plain mirror', 'a polarizer'], a: 0, why: 'A liquid-crystal layer changes the refractive index seen by the light, and with it the optical path. A DMD only switches amplitude.' },
    { q: 'More Gerchberg–Saxton iterations always remove all the noise from the pattern.', a: false, why: 'The iterations converge and reduce the error, but speckle, the zero order and the loss from phase quantization remain.' },
    { q: 'What is the efficiency of a blazed grating with 8 phase levels, as a percentage?', answer: 95, unit: '%', why: '$[\\sin(\\pi/8)/(\\pi/8)]^2 = 0.9496$.' },
    { q: 'A phase SLM shows a perfect hologram but part of the light goes straight through as a bright central spot. Why?', choices: ['Light of the wrong polarization, and light from the gaps between pixels, is not modulated', 'The SLM is a mirror', 'Light cannot be diffracted', 'The hologram is upside down'], a: 0, why: 'An LCOS modulates one polarization, and the gaps between the pixels do not shape the light: both leave an undiffracted zero order.' }
  ],
  applications: [
    'Optical tweezers that hold and move many particles at once with holographic spots.',
    'Parallel laser processing with tens of spots, and flat-top or ring beams.',
    'Adaptive optics for microscopes and telescopes: the SLM cancels the aberration.',
    'Holographic and augmented-reality displays that make 3-D images from phase patterns.',
    'Pulse shapers for ultrafast lasers and mode converters for beams and fibres.'
  ],
  history: 'The Gerchberg–Saxton algorithm, published in 1972 for electron-microscope images, became the standard way to compute holograms. Liquid-crystal spatial light modulators from the late 1980s, driven by the projector and display industries, made rewritable holograms practical, and LCOS chips with phase-only response became common after about 2000.',
  sources: [
    'R. W. Gerchberg and W. O. Saxton, "A practical algorithm for the determination of phase from image and diffraction plane pictures", *Optik* 35 (1972).',
    'J. W. Goodman, *Introduction to Fourier Optics* — the chapters on holography and on spatial light modulators.',
    'U. Efron (ed.), *Spatial Light Modulator Technology* (Marcel Dekker) — the devices.'
  ],
  sim: 'bs-slm'
},

/* ================================================================ holographic optical elements */
{
  id: 'holographic-optical-elements', parent: 'beam-shaping', title: 'Holographic optical elements', level: 3,
  short: 'A holographic optical element (HOE) is a hologram used as an optic: a lens, a mirror, a filter or a combiner made not by shaping glass but by recording the interference of two beams in a thin layer of light-sensitive material. Thick ones answer to one wavelength and one direction only, which is both their charm and their limit.',
  keywords: ['holographic optical element', 'HOE', 'volume hologram', 'Bragg grating', 'VPH grating', 'head-up display', 'combiner', 'photopolymer', 'dichromated gelatin', 'Bragg condition', 'thick hologram', 'Q parameter', 'notch filter', 'augmented reality'],
  prereq: ['holography', 'diffractive-optical-elements', 'the-grating-equation'],
  related: ['holograms-and-what-they-show', 'virtual-and-augmented-reality-headsets', 'spatial-light-modulators', 'metalenses-and-flat-optics', 'thin-film-interference', 'grating-types-and-blaze'],
  body: `
A hologram records how a wave looks by interfering it with a second wave ([[holography]]). Record the interference of two simple waves, say a plane wave and a spherical one, and what is stored is a lens: lit by the plane wave again, the film bends it into a sphere. Record two plane waves at an angle and you have a grating, a mirror or a filter. A hologram made for this purpose is a **holographic optical element**.

### The fringes
Two plane waves of wavelength $\\lambda$ meeting at an angle $\\theta_r$ make planes of bright and dark fringes of period

$$\\Lambda = \\frac{\\lambda}{2\\sin(\\theta_r/2)}$$

Beams 40° apart in 532 nm light, arriving symmetrically on one face of the film, give $\\Lambda = 0.78$ µm with fringe planes normal to the film. Beams arriving from opposite faces make planes parallel to the film instead, with a period of $\\lambda/2n$ inside it: 0.18 µm for $n = 1.5$. The film records either as a periodic variation of its refractive index of amplitude $\\Delta n$: a **volume phase grating**.

### Thin or thick
The parameter $Q = 2\\pi\\lambda d/(n\\Lambda^2)$ compares the film thickness $d$ with the fringe spacing:

| | $Q < 1$: thin | $Q > 10$: thick (Bragg) |
|---|---|---|
| orders | many | one (plus the zero order) |
| best first-order efficiency | 34 % (sinusoidal phase), 6 % (amplitude) | up to 100 % |
| angle and colour selectivity | broad | narrow |

A film 15 µm thick with 40° beams has $Q = 55$: thick. Light is diffracted efficiently only when it meets the fringes at the **Bragg angle**, $\\sin\\theta_B = \\lambda/2\\Lambda$ for fringes normal to the film: the layers of index variation then reflect their little waves in step. Tilt the beam, or change its colour, and the waves fall out of step and the diffraction fades. For the lossless grating above, with $\\Delta n = 0.02$ the peak efficiency is $\\sin^2[\\pi\\Delta n\\,d/(\\lambda\\cos\\theta)] = 94\\,\\%$, and it is down to half over a total width of about 3.5° of angle or about 90 nm of colour. Selectivity grows with thickness; in a reflection hologram, with 0.18 µm fringes and 15 µm of film, the bandwidth is of the order of $\\Lambda/d \\approx 1$ % of the wavelength, a few nanometres.

### What they are used for
- **Combiners** of head-up displays: a hologram that reflects the narrow green line of the display toward the eye and lets the rest of the scene pass.
- **Volume phase holographic gratings** in spectrographs, which can reach very high efficiency.
- **Notch filters** and laser-protection filters: a reflection hologram removes one narrow line.
- **Waveguide couplers** in augmented-reality glasses ([[virtual-and-augmented-reality-headsets]]).

### Limits
A hologram is a one-wavelength element: it works as a lens only for the colour it was recorded in, changes shape with the shrinkage of the film, and needs a laser, a stable table and a recording material to make. Embossed "rainbow" security holograms are a different thing: surface-relief gratings, not volume ones.

> [!key] A holographic optical element stores the interference of two beams as a grating of fringes of period $\\Lambda = \\lambda/(2\\sin(\\theta_r/2))$. A thick one ($Q > 10$) diffracts at the Bragg angle only, for one wavelength, with up to 100 % efficiency.
`,
  ideas: [
    'Recording two simple waves in a photosensitive layer stores a lens, grating, mirror or combiner: a holographic optical element.',
    'Two beams at an angle θ_r make fringes of period Λ = λ/(2 sin(θ_r/2)).',
    'The thickness parameter Q = 2πλd/(nΛ²) separates thin (Q < 1, many orders) from thick (Q > 10, one Bragg order) holograms.',
    'A thick hologram diffracts efficiently only at the Bragg angle and wavelength, with up to 100 % in one order.',
    'Thick elements are wavelength-selective, which makes them good as colour filters and combiners and poor as lenses for white light.'
  ],
  pitfalls: [
    'A hologram is a picture on film — A holographic optical element is a working optic: its fringes bend light as a grating or lens does, and it has an efficiency, a bandwidth and a field of view like any other.',
    'A holographic optic works in white light — A thick one answers to one wavelength and one angle: a lens hologram recorded in green focuses green light and passes most of the rest.',
    'Any hologram can diffract 100 % of the light — Only a thick, lossless phase hologram at the Bragg condition can; a thin sinusoidal phase grating gives at most 34 % in its first order.',
    'Embossed security holograms are the same thing — They are surface-relief gratings read in reflection with white light; HOEs are volume gratings recorded in a layer, read at one wavelength.'
  ],
  terms: [
    { term: 'Holographic optical element', also: ['HOE'], def: 'An optical element made by recording the interference of two beams in a light-sensitive layer, so that it acts as a lens, grating, mirror, filter or combiner.' },
    { term: 'Volume phase grating', also: ['VPH grating', 'volume hologram'], def: 'A grating made of a periodic variation of refractive index through the thickness of a film, rather than a relief on its surface.' },
    { term: 'Bragg condition', also: ['Bragg angle'], def: 'The angle (for a given wavelength) at which the waves reflected from successive fringe planes add in step, so that a thick grating diffracts efficiently: 2Λ sin θ_B = λ for fringes normal to the surface.' },
    { term: 'Q parameter', also: ['Klein–Cook parameter'], def: 'Q = 2πλd/(nΛ²): a measure of the thickness of a grating against its period. Q > 10 is the thick (Bragg) regime, Q < 1 the thin one.' },
    { term: 'Index modulation', also: ['Δn'], def: 'The amplitude of the periodic variation of refractive index in a volume grating. It sets the strength of the coupling and so the efficiency.' },
    { term: 'Combiner', def: 'A transparent optic in a head-up or augmented-reality display that reflects or redirects the image toward the eye while letting the outside scene through.' }
  ],
  formulas: [
    {
      name: 'Fringe period of two interfering beams',
      expr: 'Lam = lambda/(2*sin(thr/2))', tex: '\\Lambda = \\frac{\\lambda}{2\\sin(\\theta_r/2)}',
      vars: {
        Lam: { name: 'fringe period', q: 'length', unit: 'µm', tex: '\\Lambda' },
        lambda: { name: 'recording wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        thr: { name: 'angle between the two beams in air', q: 'angle', unit: '°', value: 40, min: 1, max: 179, tex: '\\theta_r' }
      },
      solveFor: 'Lam',
      note: 'For fringes normal to the film, with the beams arriving symmetrically.',
      stories: { Lam: 'Two {lambda} beams meet at an angle of {thr} to record a hologram. What is the period of the fringes?' }
    },
    {
      name: 'Bragg angle',
      expr: 'thB = asin(lambda/(2*Lam))', tex: '\\sin\\theta_B = \\frac{\\lambda}{2\\Lambda}',
      vars: {
        thB: { name: 'Bragg angle in air, from the normal to the film', q: 'angle', unit: '°', tex: '\\theta_B' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        Lam: { name: 'fringe period', q: 'length', unit: 'µm', value: 0.778, tex: '\\Lambda' }
      },
      solveFor: 'thB',
      note: 'For fringes normal to the film. Light at this angle is diffracted to the same angle on the other side of the normal.',
      stories: { thB: 'A volume grating has a fringe period of {Lam}. At what angle does {lambda} light meet the Bragg condition?' }
    },
    {
      name: 'The Q parameter',
      expr: 'Q = 2*pi*lambda*d/(n*Lam^2)', tex: 'Q = \\frac{2\\pi\\,\\lambda\\,d}{n\\,\\Lambda^2}',
      vars: {
        Q: { name: 'thickness parameter' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        d: { name: 'thickness of the film', q: 'length', unit: 'µm', value: 15 },
        n: { name: 'refractive index of the film', value: 1.5, min: 1.05, max: 4 },
        Lam: { name: 'fringe period', q: 'length', unit: 'µm', value: 0.778, tex: '\\Lambda' }
      },
      solveFor: 'Q',
      note: 'Q above 10: thick (Bragg) hologram; below 1: thin.',
      stories: { Q: 'A film {d} thick, of index {n}, holds fringes of period {Lam}, read with {lambda} light. What is Q?' }
    },
    {
      name: 'Peak efficiency of a thick transmission grating',
      expr: 'eta = sin(pi*dn*d/(lambda*cos(th)))^2', tex: '\\eta = \\sin^2\\!\\left(\\frac{\\pi\\,\\Delta n\\,d}{\\lambda\\cos\\theta}\\right)',
      vars: {
        eta: { name: 'diffraction efficiency at the Bragg angle', q: 'ratio', unit: '%', tex: '\\eta' },
        dn: { name: 'index modulation', value: 0.02, min: 0.001, max: 0.025, tex: '\\Delta n' },
        d: { name: 'thickness of the film', q: 'length', unit: 'µm', value: 10, min: 1, max: 12 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, min: 420, max: 800, tex: '\\lambda' },
        th: { name: 'angle of the beam inside the film', q: 'angle', unit: '°', value: 13.2, min: 0, max: 40, tex: '\\theta' }
      },
      solveFor: 'eta',
      note: 'Lossless, unslanted grating, on the Bragg condition. The ranges stop at the first maximum, where the argument of the sine is π/2 and the efficiency reaches 100 %; beyond it a thicker film or a stronger modulation over-modulates and the efficiency falls again.',
      stories: { eta: 'A transmission volume grating has Δn = {dn} and a thickness of {d}; the beam inside makes {th} with the normal, wavelength {lambda}. What is its peak efficiency?' }
    }
  ],
  examples: [
    {
      title: 'Recording a grating',
      q: 'A grating is recorded with 532 nm beams meeting at 40° in air, in a film of index 1.5 and thickness 15 µm. Find the fringe period, the Bragg angle and $Q$.',
      steps: [
        { text: 'The fringe period:', tex: '\\Lambda = \\frac{0.532}{2\\sin 20°} = 0.778\\ \\mu\\mathrm{m}' },
        { text: 'Bragg angle: the recording beams themselves, 20° each side of the normal:', tex: '\\sin\\theta_B = \\frac{0.532}{2 \\times 0.778} = 0.342 \\Rightarrow \\theta_B = 20°' },
        { text: 'The thickness parameter:', tex: 'Q = \\frac{2\\pi \\times 0.532 \\times 15}{1.5 \\times 0.778^2} = 55' }
      ],
      a: 'Λ = 0.78 µm, θ_B = 20°, Q = 55: a thick hologram. Read at 20° it diffracts into −20°; read at 24° it hardly diffracts at all.'
    },
    {
      title: 'How efficient?',
      q: 'The grating above has an index modulation of 0.02. What is its peak efficiency?',
      steps: [
        'Inside the film the beam makes $\\theta = \\arcsin(\\sin 20°/1.5) = 13.2°$ with the normal.',
        { text: 'The argument of the sine:', tex: '\\nu = \\frac{\\pi \\times 0.02 \\times 15\\ \\mu\\mathrm{m}}{0.532\\ \\mu\\mathrm{m} \\times \\cos 13.2°} = 1.82\\ \\mathrm{rad}' },
        'The efficiency is $\\sin^2 1.82 = 0.94$.'
      ],
      a: '94 %. A stronger modulation or thicker film would bring $\\nu$ to $\\pi/2 = 1.57$ (100 %) and then past it, over-modulating: the efficiency would fall again.'
    }
  ],
  quiz: [
    { q: 'Two 633 nm beams meet at 90° in air. What is the fringe period, in µm?', answer: 0.447, unit: 'µm', why: '$\\Lambda = \\lambda/(2\\sin 45°) = 0.633/1.414 = 0.447$ µm.' },
    { q: 'What is the thickness parameter Q of a 15 µm film (n = 1.5) holding 0.778 µm fringes, read at 532 nm?', choices: ['About 0.5: a thin hologram', 'About 5', 'About 55: a thick (Bragg) hologram', 'Exactly 1'], a: 2, why: '$Q = 2\\pi\\lambda d/(n\\Lambda^2) = 2\\pi \\times 0.532 \\times 15/(1.5 \\times 0.605) = 55$, far above 10.' },
    { q: 'A thin sinusoidal phase hologram can diffract all of the light into one order.', a: false, why: 'A thin sinusoidal phase grating puts at most about 34 % into its first order; only a thick (Bragg) phase grating can reach 100 %.' },
    { q: 'A thick volume hologram recorded with green light is lit with red light at the same angle. Mostly…', choices: ['the red light passes undiffracted, as the Bragg condition is not met', 'it diffracts better than green', 'it disappears from the film', 'the film changes colour'], a: 0, why: 'The Bragg condition ties the wavelength to the angle. For a thick hologram a change of colour of tens of nanometres takes it out of step and the diffraction collapses.' },
    { q: 'Which of these is a typical use of a thick reflection hologram?', choices: ['A head-up-display combiner that reflects one narrow band', 'A beam splitter for white light', 'A wide-band lens for a camera', 'A diffuser'], a: 0, why: 'A reflection volume hologram reflects a narrow spectral band and passes the rest, which is what a combiner needs.' }
  ],
  applications: [
    'Head-up-display combiners that reflect the display colour and pass the outside scene.',
    'Volume phase holographic gratings in astronomical and laboratory spectrographs.',
    'Notch filters that remove one laser line from a detector or an eye.',
    'Augmented-reality waveguide couplers that move an image into and out of a glass plate.',
    'Beam-steering and light-guiding films for displays.'
  ],
  history: 'Dennis Gabor invented holography in 1947 (Nobel Prize 1971). Emmett Leith and Juris Upatnieks made the off-axis laser hologram in 1962–64, and Yuri Denisyuk made thick reflection holograms viewable in white light in 1962, continuing the colour photography of Gabriel Lippmann (1891, Nobel Prize 1908). Herwig Kogelnik\'s coupled-wave theory of 1969 is still the standard model of thick gratings.',
  sources: [
    'H. Kogelnik, "Coupled wave theory for thick hologram gratings", *Bell System Technical Journal* 48 (1969).',
    'P. Hariharan, *Basics of Holography* (Cambridge University Press).',
    'R. J. Collier, C. B. Burckhardt and L. H. Lin, *Optical Holography* (Academic Press).'
  ],
  sim: 'bs-hoe'
},

/* ================================================================ concentrators */
{
  id: 'concentrating-light', parent: 'beam-shaping', title: 'Concentrators and the limit of concentration', level: 3,
  short: 'A concentrator gathers light over a wide opening onto a small target: a burning glass, a solar dish, a funnel in front of a detector. How much it can concentrate is limited, not by the quality of the optics but by the angles at which the light arrives: for sunlight, about 46 000 times in three dimensions and 215 times in a trough.',
  keywords: ['concentrator', 'concentration ratio', 'compound parabolic concentrator', 'CPC', 'non-imaging optics', 'solar concentrator', 'burning glass', 'solar furnace', 'trough', 'heliostat', 'acceptance angle', 'etendue', 'concentrated photovoltaics', 'Winston cone'],
  prereq: ['etendue', 'parabolic-and-elliptical-mirrors', 'beam-shaping-overview'],
  related: ['the-optical-invariant', 'radiance-and-its-conservation', 'light-pipes-and-homogenizers', 'fresnel-lenses', 'reflectors', 'mirrors-in-daily-life', 'projector-illumination'],
  body: `
A magnifying glass in the sun lights a fire: it takes sunlight from a disc 50 mm across and puts it on a spot a millimetre wide. The **concentration ratio** is $C = A_{\\text{in}}/A_{\\text{out}}$, the area of the opening over the area of the target. How large can it be?

### The limit
The Sun is a disc of half-angle $\\theta = 0.267°$ (an angular diameter of 9.3 mrad). Whatever the optics, light cannot be sent into a smaller area than the angles allow — the conservation of [[etendue]] — and for a lens or mirror that collects over a half-angle $\\theta$ into a medium of index $n$:

$$C_{3D} \\le \\frac{n^2}{\\sin^2\\theta}, \\qquad C_{2D} \\le \\frac{n}{\\sin\\theta}$$

For the Sun in air, 46 000 for a dish or lens (three dimensions) and 215 for a trough (two). Immersing the target in glass of $n = 1.5$ raises them to 104 000 and 322. Real systems must accept more than the Sun's own angle, to allow for tracking errors and imperfect surfaces, so they fall short: troughs typically reach several tens, tower fields several hundred, and dishes a few thousand to some ten thousand.

### The burning glass
A lens of diameter $D$ and focal length $f$ makes a Sun image $f\\Theta$ across ($\\Theta = 9.32$ mrad). A 50 mm lens with $f = 100$ mm gives a spot 0.93 mm across, a concentration of $(50/0.93)^2 \\approx 2900$, and the 2 W it gathers (about 1000 W/m² over 20 cm²) goes onto 0.7 mm²: some 2.6 W/mm² after the glass's losses, enough to scorch paper in seconds.

### Compound parabolic concentrators
A **CPC** is a funnel of two parabolas, built so that every ray inside the acceptance half-angle $\\theta$ reaches the exit and every ray outside is turned back. It does not form an image; it only collects. With exit half-width $a$ the entrance half-width is $a/\\sin\\theta$ and the ideal concentration (two dimensions) is $1/\\sin\\theta$: 2 for $\\theta = 30°$, 5.8 for 10°. It is long, however, $L = a(1+1/\\sin\\theta)/\\tan\\theta$: 38 $a$ for 10°, over three times the width of its opening. Cutting it to 60 % of its length costs only 6 % of the concentration (5.4 against 5.8) and keeps most of the acceptance, which is how real ones are made.

### Other uses
Concentrators also funnel light onto a small detector or fibre, and make LED collimators and lamp reflectors; concentrating photovoltaics use lenses to put sunlight on small, expensive cells at 100 to 1000 suns. A light pipe is a concentrator run backwards: it spreads light in angle ([[light-pipes-and-homogenizers]]).

> [!warn] A lens or mirror in the sun is a fire starter and a way to blind: a concentrated beam can ignite paper, cloth and wood in seconds and burn skin, and a bright focus is dangerous to the eye. Keep burning glasses and concave mirrors covered when not in use, never look at the Sun through or past them, and never leave them unattended in sunlight (water bottles, glass balls and shaving mirrors have started fires).

> [!key] Concentration is bounded by $n^2/\\sin^2\\theta$ (3-D) or $n/\\sin\\theta$ (2-D): 46 000 and 215 for sunlight in air. A CPC reaches the 2-D limit; a lens or dish gets within a factor of a few to ten.
`,
  ideas: [
    'The concentration ratio C = A_in/A_out is limited by the angles at which light arrives: C ≤ n²/sin²θ in 3-D, n/sin θ in 2-D.',
    'For sunlight (half-angle 0.267°) in air the limits are about 46 000 (dish, lens) and 215 (trough).',
    'A burning glass of diameter 50 mm and focal length 100 mm gives a Sun image 0.93 mm across, a concentration of about 2900.',
    'A compound parabolic concentrator accepts every ray within θ and rejects the rest; its concentration is 1/sin θ in 2-D, but it is long.',
    'Real concentrators accept more than the Sun\'s own angle (tracking and surface errors) and so fall short of the limit.'
  ],
  pitfalls: [
    'With good enough optics any concentration is possible — The limit is set by the angular size of the source and conservation of étendue, not by the optics. No passive system can focus sunlight to more than 46 000 times (in air).',
    'A concentrator makes the light brighter than the Sun — The brightness (radiance) cannot rise; the irradiance on the target rises by concentrating light from a larger area, up to the point where the target would see the Sun all around it.',
    'A CPC images the Sun — It forms no image; it only gathers, and rays inside its acceptance angle reach the exit anywhere across it.',
    'A bigger lens always burns better — The irradiance in the Sun image is $E\\cdot(D/f\\Theta)^2$, so what counts is the ratio of diameter to focal length, not the size alone.'
  ],
  terms: [
    { term: 'Concentration ratio', also: ['geometric concentration', 'suns'], def: 'The area of a concentrator\'s entrance aperture divided by the area of its target. Often quoted in "suns" for solar systems.' },
    { term: 'Acceptance angle', also: ['acceptance half-angle'], def: 'The half-angle within which light entering a concentrator reaches its exit; light arriving outside it is rejected.' },
    { term: 'Compound parabolic concentrator', also: ['CPC', 'Winston cone'], def: 'A non-imaging funnel made of two parabolic mirrors that sends all light within its acceptance angle to the exit aperture and none from outside.' },
    { term: 'Non-imaging optics', also: ['nonimaging optics'], def: 'The design of optics that move light from a source to a target without forming an image, as for concentrators and illuminators.' },
  ],
  formulas: [
    {
      name: 'Limit of concentration in three dimensions',
      expr: 'C = (n/sin(theta))^2', tex: 'C_{3D} = \\frac{n^2}{\\sin^2\\theta}',
      vars: {
        C: { name: 'maximum concentration' },
        n: { name: 'refractive index of the medium around the target', value: 1, min: 1, max: 4 },
        theta: { name: 'acceptance half-angle', q: 'angle', unit: '°', value: 0.267, min: 0.01, max: 90, tex: '\\theta' }
      },
      solveFor: 'C',
      note: 'Dish or lens. For the Sun, θ = 0.267° (half the angular diameter, 0.533°).',
      stories: { C: 'A lens or dish gathers light from a source of half-angle {theta} onto a target in a medium of index {n}. What is the greatest concentration possible?', theta: 'A concentrator is to reach C = {C} (target in a medium of index {n}). What acceptance half-angle can it have at most?' }
    },
    {
      name: 'Limit of concentration in two dimensions',
      expr: 'C = n/sin(theta)', tex: 'C_{2D} = \\frac{n}{\\sin\\theta}',
      vars: {
        C: { name: 'maximum concentration' },
        n: { name: 'refractive index of the medium around the target', value: 1, min: 1, max: 4 },
        theta: { name: 'acceptance half-angle', q: 'angle', unit: '°', value: 10, min: 0.01, max: 90, tex: '\\theta' }
      },
      solveFor: 'C',
      note: 'A trough, or a compound parabolic concentrator that is a trough in cross-section; reached by an ideal CPC.',
      stories: { C: 'A trough-shaped concentrator has an acceptance half-angle of {theta}. What is its greatest concentration?' }
    },
    {
      name: 'Image of the Sun',
      expr: 'd = f*Theta', tex: 'd = f\\,\\Theta',
      vars: {
        d: { name: 'diameter of the Sun\'s image', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        Theta: { name: 'angular diameter of the Sun', q: 'angle', unit: 'mrad', value: 9.32, tex: '\\Theta' }
      },
      solveFor: 'd',
      note: 'The angular diameter of the Sun is 0.533°, 9.32 mrad. For the Moon it is nearly the same.',
      stories: { d: 'A lens of focal length {f} focuses the Sun, whose angular diameter is {Theta}. How wide is the image?' }
    },
    {
      name: 'Concentration of a lens or mirror',
      expr: 'C = (D/(f*Theta))^2', tex: 'C = \\left(\\frac{D}{f\\,\\Theta}\\right)^{2}',
      vars: {
        C: { name: 'concentration', tex: 'C' },
        D: { name: 'diameter of the aperture', q: 'length', unit: 'mm', value: 50 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        Theta: { name: 'angular diameter of the source', q: 'angle', unit: 'mrad', value: 9.32, tex: '\\Theta' }
      },
      solveFor: 'C',
      note: 'The ratio of the lens area to the area of the Sun\'s image, ignoring aberrations and losses.',
      stories: { C: 'A lens of diameter {D} and focal length {f} focuses the Sun ({Theta} across). By what factor is the sunlight concentrated?' }
    }
  ],
  examples: [
    {
      title: 'A burning glass',
      q: 'A lens 50 mm across with a focal length of 100 mm focuses the Sun (angular diameter 9.32 mrad). How large is the image, what is the concentration, and what irradiance is reached if 1000 W/m² arrives and the lens passes 90 %?',
      steps: [
        { text: 'The image:', tex: 'd = f\\Theta = 100\\ \\mathrm{mm} \\times 9.32\\ \\mathrm{mrad} = 0.93\\ \\mathrm{mm}' },
        { text: 'The concentration:', tex: 'C = (50/0.93)^2 \\approx 2900' },
        'The lens gathers $1000 \\times \\pi(0.025)^2 \\times 0.9 = 1.77$ W onto $\\pi(0.465\\ \\mathrm{mm})^2 = 0.68$ mm²: 2.6 W/mm².'
      ],
      a: 'A spot 0.93 mm across, a concentration of 2900 and about 2.6 W/mm² (2.6 MW/m²) — enough to char wood. That is why a burning glass must be kept covered.'
    },
    {
      title: 'How far is a trough from the limit?',
      q: 'A parabolic trough concentrates the Sun by a factor of 80 in cross-section. What fraction of the limit is that, in air?',
      steps: [
        { text: 'The two-dimensional limit for the Sun is', tex: 'C_{2D} = \\frac{1}{\\sin 0.267°} = 215' },
        'The fraction is $80/215 = 0.37$.'
      ],
      a: 'About 37 % of the limit: the rest is lost to a wider acceptance angle, which allows for imperfect tracking and mirror shape.'
    }
  ],
  quiz: [
    { q: 'What is the greatest concentration possible for a trough accepting light from a source of half-angle 10°, in air?', answer: 5.76, why: '$C_{2D} = 1/\\sin 10° = 5.76$.' },
    { q: 'Putting the target in glass of index 1.5, the limit of concentration (3-D) rises by a factor of…', choices: ['2.25', '1.5', '1', '3.4'], a: 0, why: '$C_{3D} = n^2/\\sin^2\\theta$ grows as $n^2$: 1.5² = 2.25.' },
    { q: 'A concentrator can make the light on its target brighter (higher radiance) than the Sun.', a: false, why: 'Radiance cannot be increased by passive optics. The irradiance rises because light from a large aperture is gathered onto a small target, up to the limit at which the target sees the Sun in all directions.' },
    { q: 'A lens with a focal length of 200 mm focuses the Sun (9.32 mrad). How large, in mm, is the image?', answer: 1.86, unit: 'mm', why: '$d = f\\Theta = 200 \\times 0.00932 = 1.86$ mm.' },
    { q: 'A compound parabolic concentrator with an acceptance half-angle of 30° has a concentration (two dimensions) of…', choices: ['2', '5.8', '30', '0.5'], a: 0, why: '$1/\\sin 30° = 2$: a wide acceptance angle means a small concentration. For 10° it would be 5.8.' }
  ],
  applications: [
    'Concentrating solar power: troughs, towers with heliostats and dishes heat a fluid to run a turbine.',
    'Concentrator photovoltaics that use lenses to put sunlight on small high-efficiency cells.',
    'Solar furnaces for materials research, reaching temperatures above 3000 °C.',
    'Funnels and CPCs in front of detectors and fibres, and collimators for LEDs.',
    'Daylighting systems that gather sunlight and lead it into buildings.'
  ],
  history: 'Burning mirrors are very old; Archimedes\' mirrors at Syracuse are a legend, but Buffon built a mirror in 1747 that set wood alight at a distance of several tens of metres. The idea of a concentrator reaching the thermodynamic limit came in the 1960s and 70s: Roland Winston and others designed the compound parabolic concentrator, and the field was named non-imaging optics.',
  sources: [
    'R. Winston, J. C. Miñano and P. Benítez, *Nonimaging Optics* (Elsevier) — the compound parabolic concentrator and the limit of concentration.',
    'J. Chaves, *Introduction to Nonimaging Optics* (CRC Press).',
    'W. T. Welford and R. Winston, *High Collection Nonimaging Optics* (Academic Press).'
  ],
  sim: 'bs-concentrator'
},

/* ================================================================ pinhole */
{
  id: 'cleaning-a-beam-with-a-pinhole', parent: 'beam-shaping', title: 'Cleaning a beam with a pinhole', level: 2,
  short: 'Dust, scratches and edges put rings and speckle on a laser beam. A spatial filter cleans it: a lens focuses the beam, a pinhole at the focus lets through only the smooth core, and a second lens makes the beam parallel again. The pinhole has to be the right size and held to a few micrometres.',
  keywords: ['spatial filter', 'pinhole', 'beam cleaning', 'clean beam', 'beam cleanup', 'rings', 'speckle', 'dust', 'microscope objective', 'pinhole diameter', 'Fourier plane', 'alignment', 'mode filter'],
  prereq: ['spatial-filtering', 'focusing-to-a-point', 'apertures-irises-and-pinholes'],
  related: ['fourier-optics', 'beam-expanders', 'gaussian-beams-through-lenses', 'beam-quality-m-squared', 'speckle', 'aligning-an-optical-system', 'laser-damage-and-coating-durability'],
  body: `
A laser beam that has been through a few lenses and mirrors is rarely clean. Dust on a surface draws concentric rings; a scratch draws a line of diffraction; an edge leaves fine ripples. They make a pattern of bright and dark where a smooth bell shape should be, and they ruin a hologram, a fibre coupling or an interferometer. A **spatial filter** removes them, using a fact of [[fourier-optics]]: in the focal plane of a lens, the position measures the *direction* of the light.

### Why a pinhole works
The smooth core of the beam is made of light travelling along the axis. Light diffracted by dust and edges travels at small angles. A lens turns each direction into a position in its focal plane: the clean beam falls in a tiny spot on the axis, the ripples fall to the side at $x = \\lambda f\\nu$ for a ripple of spatial frequency $\\nu$. A pinhole at the focus passes the spot and blocks the rest; a second lens restores a parallel beam, now smooth ([[spatial-filtering]]).

### Choosing the pinhole
The focal spot of a Gaussian beam of radius $w$ has radius $w_0 = \\lambda f/(\\pi w)$ ([[focusing-to-a-point]]). A pinhole with a diameter of three times $w_0$, i.e. 1.5 times the $1/e^2$ spot diameter, lets through 98.9 % of the clean beam:

$$D_p = \\frac{3\\,\\lambda f}{\\pi w}$$

For a 633 nm HeNe beam of radius 0.4 mm, with objectives of focal length $f = 160\\ \\mathrm{mm}/M$:

| Objective | $f$ | Spot radius $w_0$ | Pinhole $D_p$ (commonly sold) |
|---|---|---|---|
| 5× | 32 mm | 16.1 µm | 48 µm (50 µm) |
| 10× | 16 mm | 8.1 µm | 24 µm (25 µm) |
| 20× | 8 mm | 4.0 µm | 12 µm (10 or 15 µm) |
| 40× | 4 mm | 2.0 µm | 6 µm (5 µm) |

A hole smaller than this clips the core: power drops and the pinhole itself makes rings. A larger one lets more of the ripples through. With the 10× objective and a 25 µm hole, ripples with a spatial frequency above about 1.2 cycles per mm are blocked; a ripple of 1 cycle per mm lands at 10 µm, inside the hole, and passes.

### Getting it right
The pinhole must sit at the focus to a few micrometres, so it is held on a three-axis stage in front of the objective. Start with a large hole, find the brightest transmission, then step down. What comes out is a clean beam that diverges from the pinhole: a second lens makes it parallel again. It stays a filter of high spatial frequencies only: slow variations of the beam profile, and pointing jitter, are not removed (and the latter becomes intensity noise through the hole).

> [!warn] The beam is focused to a very small spot at the pinhole, and passes it as a diverging cone: keep eyes away from the beam path after the pinhole too, work at low power while aligning, and note that pulsed or powerful lasers burn the pinhole and ruin it ([[laser-damage-and-coating-durability]]).

> [!key] A pinhole at the focus passes the clean core and blocks the ripples, which land at $x = \\lambda f\\nu$. Choose its diameter as $3\\lambda f/(\\pi w)$, and hold it to a few micrometres: too small and it clips the beam, too large and it lets the ripples pass.
`,
  ideas: [
    'A spatial filter focuses the beam, passes the focal spot through a pinhole and re-collimates it.',
    'In the focal plane a ripple of spatial frequency ν lands at x = λfν, away from the clean spot on the axis.',
    'The pinhole diameter of 3λf/(πw) passes 98.9 % of the clean beam and blocks ripples beyond.',
    'Too small a pinhole clips the beam; too large a pinhole lets the ripples through.',
    'It removes only high spatial frequencies; slow variations and pointing jitter remain.'
  ],
  pitfalls: [
    'A pinhole makes a beam more powerful or more intense — It only removes light: a clean beam is dimmer than the beam that went in, by the fraction blocked.',
    'The smaller the pinhole the cleaner the beam — Below the clean spot size the hole clips the core and itself diffracts, creating rings; 3 times w₀ in diameter is the usual compromise.',
    'The pinhole cleans every kind of defect — It blocks only fine ripples (high spatial frequencies); a slow variation across the beam, or an overall tilt, passes straight through.',
    'The pinhole can be placed anywhere along the beam — It must be at the focus, to a few micrometres along and across the axis, where the clean spot is smallest.'
  ],
  terms: [
    { term: 'Ripple', also: ['diffraction rings', 'beam noise'], def: 'A fine periodic variation of intensity across a beam, made by diffraction at dust, scratches and edges. Its fine scale means a high spatial frequency.' },
    { term: 'Pinhole', def: 'A small round hole in an opaque metal foil, with diameters from a few micrometres upward, used here at the focus of a lens.' },
    { term: 'Beam cleanup', also: ['beam cleaning'], def: 'The removal of unwanted structure from a beam profile, by a spatial filter or a single-mode fibre.' }
  ],
  formulas: [
    {
      name: 'Pinhole diameter for a spatial filter',
      expr: 'Dp = 3*lambda*f/(pi*w)', tex: 'D_p = \\frac{3\\,\\lambda\\,f}{\\pi\\,w}',
      vars: {
        Dp: { name: 'pinhole diameter', q: 'length', unit: 'µm', tex: 'D_p' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'focal length of the first lens', q: 'length', unit: 'mm', value: 16 },
        w: { name: 'beam radius at the lens (1/e²)', q: 'length', unit: 'mm', value: 0.4 }
      },
      solveFor: 'Dp',
      note: 'Three times the focal waist radius: 1.5 times the 1/e² spot diameter. 98.9 % of the clean beam passes.',
      stories: { Dp: 'A {lambda} beam of radius {w} is focused by a lens of focal length {f}. What pinhole diameter should the spatial filter use?', w: 'A spatial filter with a lens of focal length {f} and a {Dp} pinhole is used with {lambda} light. For what beam radius is the pinhole right?' }
    },
    {
      name: 'Where a ripple lands in the focal plane',
      expr: 'x = lambda*f*nu', tex: 'x = \\lambda\\,f\\,\\nu',
      vars: {
        x: { name: 'distance from the axis in the focal plane', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 16 },
        nu: { name: 'spatial frequency of the ripple', q: 'spatialfreq', unit: 'cycles/mm', value: 8, tex: '\\nu' }
      },
      solveFor: 'x',
      note: 'Small angles. A ripple finer than the hole radius divided by λf is blocked.',
      stories: { x: 'A ripple of {nu} on a {lambda} beam is focused by a lens of focal length {f}. How far from the axis does it land?', nu: 'A pinhole of radius {x} sits at the focus of a lens of focal length {f}, in {lambda} light. Above what spatial frequency is a ripple blocked?' }
    },
    {
      name: 'Power through the pinhole',
      expr: 'T = 1 - exp(-2*a^2/w0^2)', tex: 'T = 1 - e^{-2a^2/w_0^2}',
      vars: {
        T: { name: 'fraction of the clean beam passed', q: 'ratio', unit: '%' },
        a: { name: 'radius of the pinhole', q: 'length', unit: 'µm', value: 12 },
        w0: { name: 'radius of the focal spot', q: 'length', unit: 'µm', value: 8, tex: 'w_0' }
      },
      solveFor: 'T',
      note: 'For a Gaussian focal spot centred on a round hole.',
      stories: { T: 'A pinhole of radius {a} sits at a focus whose Gaussian radius is {w0}. What fraction of the clean beam passes?' }
    }
  ],
  examples: [
    {
      title: 'A pinhole for a HeNe laser',
      q: 'A 633 nm HeNe beam of radius 0.4 mm is focused by a 10× microscope objective ($f = 16$ mm). What pinhole should be used, and what fraction of the clean beam passes?',
      steps: [
        { text: 'The focal spot:', tex: 'w_0 = \\frac{0.633\\ \\mu\\mathrm{m} \\times 16\\ \\mathrm{mm}}{\\pi \\times 0.4\\ \\mathrm{mm}} = 8.06\\ \\mu\\mathrm{m}' },
        { text: 'The pinhole diameter, 3 $w_0$:', tex: 'D_p = 24.2\\ \\mu\\mathrm{m}' },
        { text: 'A 25 µm hole (radius 12.5 µm) passes', tex: '1 - e^{-2(12.5)^2/(8.06)^2} = 1 - e^{-4.81} = 0.992' }
      ],
      a: 'A 25 µm pinhole, which passes 99.2 % of the clean beam.'
    },
    {
      title: 'Which ripples get through?',
      q: 'The same filter is set up. A dust ring on the beam makes ripples at 8 cycles/mm and a slow ripple at 1 cycle/mm. Where do they land, and which is blocked by the 25 µm hole?',
      steps: [
        { text: 'The positions:', tex: 'x = \\lambda f\\nu: \\quad 8\\ \\mathrm{mm^{-1}} \\to 81\\ \\mu\\mathrm{m}, \\qquad 1\\ \\mathrm{mm^{-1}} \\to 10\\ \\mu\\mathrm{m}' },
        'The hole has a radius of 12.5 µm. 81 µm is far outside it: blocked. 10 µm is inside: it passes.'
      ],
      a: 'The fine ripple lands at 81 µm and is removed; the slow one at 10 µm goes straight through. Spatial filtering removes only the fine structure.'
    }
  ],
  quiz: [
    { q: 'A 532 nm beam of radius 1 mm is focused by a lens of focal length 20 mm. What is the recommended pinhole diameter, in µm?', answer: 10.2, unit: 'µm', why: '$D_p = 3\\lambda f/(\\pi w) = 3 \\times 0.532 \\times 20/(\\pi \\times 1) = 10.2$ µm.' },
    { q: 'A pinhole is replaced by one half the diameter. What is the most likely result?', choices: ['The core is clipped: less power, and rings from the hole itself', 'A cleaner beam with the same power', 'A brighter beam', 'No change'], a: 0, why: 'A hole smaller than the focal spot blocks part of the clean core and diffracts the rest, which makes rings and loses power.' },
    { q: 'A spatial filter removes a slow intensity variation across the beam as well as fine ripples.', a: false, why: 'Slow variations are low spatial frequencies and land in the focal spot, so they pass through the pinhole with the clean beam.' },
    { q: 'In the focal plane of a lens, a ripple of 5 cycles/mm on a 633 nm beam (f = 16 mm) lands how far from the axis, in µm?', answer: 50.6, unit: 'µm', why: '$x = \\lambda f\\nu = 0.633\\ \\mu\\mathrm{m} \\times 16\\ \\mathrm{mm} \\times 5\\ \\mathrm{mm^{-1}} = 50.6$ µm.' },
    { q: 'Why is the pinhole mounted on a three-axis stage?', choices: ['It must sit at the focus within a few micrometres in all three directions', 'To block stray light', 'To rotate the polarization', 'To change the wavelength'], a: 0, why: 'The clean spot is only a few micrometres across, so the pinhole has to be centred on it and at its waist; the stage moves it in x, y and z.' }
  ],
  applications: [
    'Holography and interferometry, where a smooth wavefront is essential.',
    'Cleaning the beam of a HeNe or diode-pumped laser before an experiment.',
    'Illumination with an even, ring-free beam for microscopy and imaging.',
    'Preparing a clean Gaussian beam for coupling into a fibre.',
    'Optical testing: a pinhole spatial filter makes a point source for a test of a lens or mirror.'
  ],
  history: 'Spatial filtering of a laser beam with a pinhole was developed in the early 1960s, when the first lasers gave beams that were bright but marred by diffraction rings from every speck of dust. It became standard equipment of the holography table, where a spatial filter is still the usual first element after the laser.',
  sources: [
    'E. Hecht, *Optics*, the section on spatial filtering — the pinhole at the focus of a lens.',
    'J. W. Goodman, *Introduction to Fourier Optics*, the chapters on spatial filtering.',
    'W. J. Smith, *Modern Optical Engineering* — the focal spot of a Gaussian beam.'
  ],
  sim: 'bs-pinhole'
},

/* ================================================================ metalenses */
{
  id: 'metalenses-and-flat-optics', parent: 'beam-shaping', title: 'Metalenses and flat optics', level: 3,
  short: 'A metalens is a lens a micrometre thick: a flat plate covered with pillars smaller than the wavelength, each shaped to delay the light by a chosen amount, so that together they bend it like a lens. It can be made like a computer chip. Its problem is colour: its focal length changes with the wavelength about 17 times more than glass.',
  keywords: ['metalens', 'metasurface', 'flat optics', 'meta-optics', 'nanopillar', 'subwavelength', 'phase profile', 'chromatic aberration', 'titanium dioxide', 'planar lens', 'diffractive lens', 'wafer-scale optics'],
  prereq: ['diffractive-optical-elements', 'fresnel-diffraction-and-zone-plates', 'focusing-to-a-point'],
  related: ['holographic-optical-elements', 'spatial-light-modulators', 'fresnel-lenses', 'mobile-phone-lenses', 'dispersion-and-the-spectrum', 'pattern-projectors', 'photolithography'],
  body: `
A glass lens bends light because the glass is thicker in the middle: the light there is delayed more. A **metalens** achieves the same delay without the thickness. It is a flat plate carrying an array of pillars of titanium dioxide, silicon nitride, gallium nitride or silicon, each smaller than the wavelength and 0.3 to 1 µm tall. A pillar delays the light by an amount that depends on its width or its orientation, so the plate can be given any phase pattern from 0 to $2\\pi$. This is a **metasurface**, and with the lens pattern

$$\\varphi(r) = -\\frac{2\\pi}{\\lambda_0}\\left(\\sqrt{r^2+f^2} - f\\right)$$

it focuses light of the design wavelength $\\lambda_0$ at distance $f$. A lens 2 mm across with $f = 10$ mm at 532 nm has 94 zones where the phase wraps through $2\\pi$.

### How it differs from a glass lens
- **Flat, thin and light.** Made by the lithography and etching of a chip factory, in thousands at once, and in principle of any phase pattern (also a grating, a vortex, a beam shaper).
- **Sampling.** The phase is set pillar by pillar. For the lens to be right the phase can change by no more than $\\pi$ from pillar to pillar, so a pitch $p$ limits the numerical aperture to $\\lambda/(2p)$: 0.89 for 300 nm at 532 nm. For a pitch below $\\lambda/2$ there is no limit short of 1.
- **Colour.** The phase pattern is fixed, but the *angle* it bends light to is proportional to the wavelength, as for any diffractive element ([[diffractive-optical-elements]]). The paraxial focal length goes as $f = f_0\\lambda_0/\\lambda$.

| Wavelength | Metalens ($f_0 = 10$ mm at 532 nm) | N-BK7 lens ($f_0 = 10$ mm at 532 nm) |
|---|---|---|
| 450 nm | 11.8 mm (+18 %) | 9.89 mm (−1.1 %) |
| 532 nm | 10.0 mm | 10.0 mm |
| 633 nm | 8.4 mm (−16 %) | 10.1 mm (+0.9 %) |

The metalens moves 34 % between blue and red, the glass lens 2 %: about 17 times more. For this reason metalenses today work best with a single colour (a laser, or a near-infrared LED with a narrow filter), or are paired with refractive lenses, or are designed with pillars that compensate for the colour over a narrow band.

### Efficiency, size and promise
The first visible metalenses of the mid-2010s focused to the diffraction limit, with numerical apertures up to 0.8, at an efficiency of tens of per cent in the best cases; they have grown to centimetres across. Their efficiency, field of view and bandwidth are all narrower than those of a good glass lens, which is why they are found first where light is of one colour and the optics are small: depth-sensing and near-infrared modules, spectrometers, polarization cameras, and as thin correctors added to a refractive lens.

> [!key] A metalens is a flat array of sub-wavelength pillars that sets the phase of a lens, $\\varphi = -(2\\pi/\\lambda_0)(\\sqrt{r^2+f^2}-f)$. It is thin and chip-made, but its focal length goes as $1/\\lambda$, so it is strongly coloured.
`,
  ideas: [
    'A metalens is a flat plate of sub-wavelength pillars, each setting the local phase between 0 and 2π, so the plate acts as a lens.',
    'The lens phase is φ(r) = −(2π/λ₀)(√(r² + f²) − f); the phase wraps in about 94 zones for a 2 mm, f = 10 mm lens at 532 nm.',
    'The pillar pitch p limits the numerical aperture to λ/(2p).',
    'The focal length goes as 1/λ, as for any diffractive lens: some 17 times more colour than a glass lens.',
    'Metalenses are made like chips, and work best with one colour or combined with refractive lenses.'
  ],
  pitfalls: [
    'A metalens replaces any camera lens today — Its focal length varies as 1/λ, so white-light imaging needs correction; today it serves best at one wavelength or as a corrector added to a glass lens.',
    'A flat lens has no aberrations — A flat phase pattern removes spherical aberration at its design wavelength, but off-axis (field) aberrations and the chromatic shift remain, and a single flat lens has a small field of view.',
    'A metalens works by refraction — It works by diffraction: the pillars set the phase and the light is bent by the phase gradient, not by a change of thickness.',
    'The pillars can be as coarse as the light allows — To bend light steeply the phase must change fast, so the pillars must be dense: the pitch must be at most about half the wavelength divided by the numerical aperture.'
  ],
  terms: [
    { term: 'Metalens', also: ['flat lens', 'planar lens'], def: 'A lens made of a metasurface: a flat array of sub-wavelength structures that sets the phase of the transmitted light to the pattern of a lens.' },
    { term: 'Metasurface', also: ['meta-optics', 'flat optics'], def: 'A surface patterned with sub-wavelength structures (pillars, fins, holes) that shape the phase, amplitude or polarization of light point by point.' },
    { term: 'Meta-atom', also: ['nanopillar', 'nanofin'], def: 'One of the sub-wavelength structures of a metasurface. Its dimensions or orientation set the phase delay at its position.' },
    { term: 'Phase profile', def: 'The map of the phase delay across the element. For a lens of focal length f it is φ(r) = −(2π/λ₀)(√(r² + f²) − f), wrapped into 0 to 2π.' },
    { term: 'Chromatic dispersion of a diffractive element', also: ['colour of a diffractive lens'], def: 'The change of a diffractive or meta lens\'s focal length with wavelength, f = f₀λ₀/λ: stronger than any glass.' }
  ],
  formulas: [
    {
      name: 'Focal length of a metalens at another wavelength',
      expr: 'f = f0*lambda0/lambda', tex: 'f = f_0\\,\\frac{\\lambda_0}{\\lambda}',
      vars: {
        f: { name: 'focal length at the new wavelength', q: 'length', unit: 'mm' },
        f0: { name: 'focal length at the design wavelength', q: 'length', unit: 'mm', value: 10, tex: 'f_0' },
        lambda0: { name: 'design wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda_0' },
        lambda: { name: 'wavelength used', q: 'length', unit: 'nm', value: 450, tex: '\\lambda' }
      },
      solveFor: 'f',
      note: 'Paraxial rays. Away from the axis the focus also shows spherical aberration.',
      stories: { f: 'A metalens has a focal length of {f0} at its design wavelength, {lambda0}. What is its focal length for {lambda} light?' }
    },
    {
      name: 'Largest numerical aperture the pillars allow',
      expr: 'NA = lambda/(2*p)', tex: '\\mathrm{NA}_{\\max} = \\frac{\\lambda}{2\\,p}',
      vars: {
        NA: { name: 'largest numerical aperture', tex: '\\mathrm{NA}_{\\max}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        p: { name: 'pitch of the pillars', q: 'length', unit: 'nm', value: 300 }
      },
      solveFor: 'NA',
      note: 'Above 1 the limit does not matter in air. The phase must change by at most π between neighbouring pillars.',
      stories: { NA: 'A metalens for {lambda} light has pillars on a pitch of {p}. What numerical aperture can it reach at most?' }
    },
    {
      name: 'Number of phase zones',
      expr: 'Nz = (sqrt(R^2 + f^2) - f)/lambda', tex: 'N_z = \\frac{\\sqrt{R^2+f^2}-f}{\\lambda}',
      vars: {
        Nz: { name: 'number of 2π zones', tex: 'N_z' },
        R: { name: 'radius of the lens', q: 'length', unit: 'mm', value: 1 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 10 },
        lambda: { name: 'design wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' }
      },
      solveFor: 'Nz',
      note: 'The edge of the lens is that many wavelengths ahead of the axis along the ray to the focus.',
      stories: { Nz: 'A metalens {R} in radius with a focal length of {f} is designed for {lambda}. How many 2π zones does its phase pattern have?' }
    }
  ],
  examples: [
    {
      title: 'Blue light on a green metalens',
      q: 'A metalens with $f_0 = 10$ mm at 532 nm is used with a 450 nm laser. Where is the focus? How does a glass lens (N-BK7) of the same design focal length compare?',
      steps: [
        { text: 'The metalens:', tex: 'f = f_0\\frac{\\lambda_0}{\\lambda} = 10\\ \\mathrm{mm} \\times \\frac{532}{450} = 11.8\\ \\mathrm{mm}' },
        { text: 'The glass lens: $f \\propto 1/(n-1)$ with $n = 1.5253$ at 450 nm and 1.5195 at 532 nm:', tex: 'f = 10 \\times \\frac{0.5195}{0.5253} = 9.89\\ \\mathrm{mm}' }
      ],
      a: 'The metalens focus moves 1.8 mm (18 %) behind its design position; the glass lens focus 0.11 mm (1.1 %) in front.'
    },
    {
      title: 'How dense must the pillars be?',
      q: 'A metalens for 532 nm is to reach a numerical aperture of 0.8. What is the largest pitch of the pillars?',
      steps: [
        { text: 'Solve $\\mathrm{NA} = \\lambda/(2p)$ for the pitch:', tex: 'p = \\frac{\\lambda}{2\\,\\mathrm{NA}} = \\frac{532\\ \\mathrm{nm}}{1.6} = 332\\ \\mathrm{nm}' }
      ],
      a: 'A pitch of 330 nm or less: about 0.6 of a wavelength, so a pillar every 330 nm in both directions across the whole lens.'
    }
  ],
  quiz: [
    { q: 'A metalens designed for 532 nm with a focal length of 20 mm is used with 633 nm light. What is its focal length, in mm?', answer: 16.8, unit: 'mm', why: '$f = f_0\\lambda_0/\\lambda = 20 \\times 532/633 = 16.8$ mm.' },
    { q: 'Why is a metalens more strongly coloured than a glass lens?', choices: ['It bends light by a phase gradient, so its deflection is proportional to the wavelength', 'It is made of titanium', 'It is thinner than the wavelength', 'It has no focal length'], a: 0, why: 'The pillars fix the phase; the angle of the diffracted light is proportional to the wavelength divided by the local period, so the focal length goes as $1/\\lambda$ against a few per cent for the dispersion of glass.' },
    { q: 'A metalens can reach any numerical aperture whatever the pillar spacing.', a: false, why: 'The phase can change by at most π between neighbouring pillars, so $\\mathrm{NA} \\le \\lambda/(2p)$; a coarse pitch limits the aperture.' },
    { q: 'How many 2π zones does a metalens 2 mm in diameter with f = 10 mm have at 532 nm?', answer: 94, why: '$N = (\\sqrt{1^2 + 10^2} - 10)/0.000532 = 0.0499/0.000532 = 93.8$.' },
    { q: 'Where are metalenses used first?', choices: ['Where one colour is used and the optics are small, as in depth-sensing and near-infrared modules', 'In all colour camera lenses', 'In telescopes with 8 m mirrors', 'In spectacle lenses'], a: 0, why: 'Their narrow bandwidth and small field fit single-wavelength uses best; for white light they are combined with refractive lenses.' }
  ],
  applications: [
    'Depth-sensing and near-infrared modules, where one wavelength is used and a flat, mass-produced optic is an advantage.',
    'Compact spectrometers and polarization cameras.',
    'Thin correctors added to a refractive lens to remove an aberration.',
    'Projectors of dots and patterns (metasurface DOEs).',
    'Wafer-level optics for sensors and lasers, made with chip-making tools.'
  ],
  history: 'The idea that a surface of sub-wavelength antennas can bend light by any angle was shown by Yu, Capasso and colleagues in 2011. Visible-light metalenses made of titanium dioxide that focus to the diffraction limit appeared in 2016, from the group of Capasso at Harvard, and the field has grown quickly since, with centimetre-scale lenses and the first commercial metasurface optics.',
  sources: [
    'N. Yu and F. Capasso, "Flat optics with designer metasurfaces", *Nature Materials* 13 (2014).',
    'M. Khorasaninejad, W. T. Chen, R. C. Devlin, J. Oh, A. Y. Zhu and F. Capasso, "Metalenses at visible wavelengths: diffraction-limited focusing and subwavelength resolution imaging", *Science* 352 (2016).',
    'N. Yu et al., "Light propagation with phase discontinuities: generalized laws of reflection and refraction", *Science* 334 (2011).'
  ],
  sim: 'bs-metalens'
}

);
