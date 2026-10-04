/* HYPER-OPTICS · content/gaussian-beams.js — the topic "Gaussian beams" (ids from outline.js).
 * Numbers come from kit.optics (O.beam.*) and were checked in node; simulations are in sims/gaussian-beams.js (prefix gb-).
 */
Hyper.add(

/* ================================================================ the Gaussian beam */
{
  id: 'the-gaussian-beam', parent: 'gaussian-beams', title: 'The Gaussian beam', level: 2,
  short: 'A laser beam is not a thin line. Its irradiance is a smooth bell curve, I = I₀ exp(−2r²/w²), brightest on the axis and fading without an edge; w, the 1/e² radius, is the number every datasheet and every formula in this topic is built on.',
  keywords: ['Gaussian beam', 'beam profile', 'beam radius', '1/e2', '1/e squared', 'TEM00', 'fundamental mode', 'bell curve', 'irradiance', 'peak irradiance', 'beam diameter', 'FWHM', 'laser spot', 'w'],
  prereq: ['light-sources-and-beams', 'what-diffraction-is', 'rays-and-wavefronts'],
  related: ['beam-waist-and-divergence', 'rayleigh-range', 'laser-modes', 'higher-order-modes', 'measuring-a-beam', 'what-makes-laser-light-special', 'physics:lasers', 'math:normal-distribution'],
  body: `
Shine a laser pointer on a wall and look at the spot: a bright centre that fades smoothly into darkness, with no edge you could point to. That is not a quirk of the pointer. It is the shape of the **Gaussian beam**, the lowest-order mode of most lasers and the model behind almost everything in this topic.

### The profile
Along any line through the centre, the irradiance (power per unit area) is

$$I(r) = I_0\\,e^{-2r^2/w^2}$$

where $r$ is the distance from the axis, $I_0$ the irradiance on the axis and $w$ the **beam radius**. It is defined as the distance at which the irradiance has fallen to $1/e^2 = 13.5\\,\\%$ of the peak. (The electric field, whose square is the irradiance, has then fallen to $1/e = 37\\,\\%$.)

| radius | irradiance, share of peak | power inside the circle |
|---|---|---|
| $0.5\\,w$ | 60.7 % | 39.3 % |
| $0.589\\,w$ | 50 % | 50 % |
| $w$ | 13.5 % | 86.5 % |
| $1.5\\,w$ | 1.1 % | 98.9 % |
| $2\\,w$ | 0.03 % | 99.97 % |

Two numbers to remember: **86.5 %** of the power lies inside the circle of radius $w$, and the on-axis irradiance is twice the total power divided by the area of that circle, $I_0 = 2P/(\\pi w^2)$. A 5 mW beam of radius 0.4 mm therefore peaks at 2.0 W/cm². The half-intensity points lie at $\\pm 0.589\\,w$, so the full width at half maximum is $1.177\\,w$.

### Why a beam is not a ray
A ray is a line with no width. A beam has width, and any wave confined to a finite width must spread by [[what-diffraction-is|diffraction]]. The Gaussian is the profile that spreads while staying Gaussian, so it keeps its form from the laser to the far field; a laser running in its fundamental mode ([[laser-modes]]) produces very nearly this shape. The radius is smallest at one place, the **waist**, and grows on both sides: see [[beam-waist-and-divergence]] and [[rayleigh-range]].

### Reading "beam diameter"
Unless a datasheet says otherwise, the *beam diameter* of a laser is the 1/e² diameter $2w$: a helium–neon tube listed as "0.5 mm" has $w \\approx 0.25$ mm. Because there is no edge, apertures must be generous. A round hole of radius $1.5\\,w$ passes 98.9 % of the power and one of radius $w$ cuts off 13.5 %, which is why optics for a beam are chosen two or three times wider than $w$.

> [!tip] FWHM, 1/e, 1/e², "86 % diameter" and the second-moment diameter are all in use. For a true Gaussian they convert by fixed factors ([[measuring-a-beam]]); for any other beam they disagree, so always ask which one a number is.

> [!key] The irradiance of a Gaussian beam falls as $e^{-2r^2/w^2}$; $w$ is the radius where it reaches 13.5 % of the peak, and 86.5 % of the power lies inside it. A beam has no edge and cannot be a ray.
`,
  ideas: [
    'The irradiance across a Gaussian beam is I₀·exp(−2r²/w²): brightest on the axis, fading smoothly with no edge.',
    'w is the 1/e² radius: 13.5 % of the peak irradiance there, with 86.5 % of the power inside it.',
    'The peak irradiance is I₀ = 2P/(πw²): twice the total power divided by the area of the circle of radius w.',
    'The FWHM of the profile is 1.177 w; the half-intensity radius 0.589 w encloses half the power.',
    'A beam of finite width must spread by diffraction, so a laser beam is never a ray.'
  ],
  pitfalls: [
    'The beam ends at its radius w — There is no edge. At r = w the irradiance is still 13.5 % of the peak and 13.5 % of the power lies outside; the wings are measurable out to two or three w.',
    'The beam diameter on a datasheet is where the light stops — It is the 1/e² diameter 2w unless the sheet says otherwise. Quoted as FWHM, the same beam would be 1.177 w wide, 41 % smaller than its 1/e² diameter.',
    'A thin laser beam travels as a straight line of constant width — Its width changes along the path: smallest at the waist, growing in both directions because of diffraction. Only over distances short compared with the Rayleigh range does it look like a ray.',
    'The circle of radius w holds 63 % of the power — That is the share inside the radius where the intensity has fallen to 1/e, r = w/√2. Inside r = w, where it has fallen to 1/e², lies 1 − e⁻² = 86.5 %.'
  ],
  terms: [
    { term: 'Gaussian beam', also: ['TEM00 beam', 'fundamental mode beam'], def: 'A beam whose irradiance across the axis follows a bell curve, I = I₀ exp(−2r²/w²). It is the beam of the lowest-order transverse mode of most lasers and keeps its Gaussian form as it propagates.' },
    { term: 'Beam radius', also: ['1/e² radius', 'w', 'spot size'], def: 'The distance from the axis at which the irradiance has fallen to 1/e² (13.5 %) of its peak. Inside it lies 86.5 % of the power.' },
    { term: 'Irradiance', also: ['power density', 'intensity (of a beam)'], def: 'The optical power crossing unit area, in W/m² or W/cm². The peak irradiance of a Gaussian beam of power P is 2P/(πw²).' },
    { term: 'Full width at half maximum', also: ['FWHM'], def: 'The width of a profile between the points where it has fallen to half its peak. For a Gaussian beam it is 1.177 w.' },
    { term: 'Fundamental transverse mode', also: ['TEM₀₀', 'TEM00'], def: 'The lowest-order transverse pattern of a laser resonator, with a single bright centre and no nodal lines. Its profile is the Gaussian.' }
  ],
  formulas: [
    {
      name: 'Irradiance across a Gaussian beam',
      expr: 'I = I0*exp(-2*r^2/w^2)', tex: 'I = I_0\\,e^{-2r^2/w^2}',
      vars: {
        I: { name: 'irradiance at radius r', q: 'intensity', unit: 'W/cm²', tex: 'I' },
        I0: { name: 'irradiance on the axis', q: 'intensity', unit: 'W/cm²', value: 2, tex: 'I_0' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 0.4, min: 0, tex: 'r' },
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm', value: 0.4, tex: 'w' }
      },
      solveFor: 'I',
      note: 'Valid for the fundamental Gaussian beam at any one plane along its path.'
    },
    {
      name: 'Peak irradiance',
      expr: 'I0 = 2*P/(pi*w^2)', tex: 'I_0 = \\frac{2P}{\\pi w^2}',
      vars: {
        I0: { name: 'peak irradiance', q: 'intensity', unit: 'W/cm²', tex: 'I_0' },
        P: { name: 'beam power', q: 'power', unit: 'mW', value: 5, tex: 'P' },
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm', value: 0.4, tex: 'w' }
      },
      solveFor: 'I0',
      note: 'Twice the total power divided by the area πw² of the 1/e² circle.',
      stories: { I0: 'A beam of {P} has a 1/e² radius of {w}. What is its peak irradiance?', w: 'A beam of {P} must reach {I0} on its axis. What 1/e² radius does that need?' }
    },
    {
      name: 'Power inside a circle',
      expr: 'Pa = P*(1 - exp(-2*a^2/w^2))', tex: 'P_a = P\\left(1 - e^{-2a^2/w^2}\\right)',
      vars: {
        Pa: { name: 'power passing the circle', q: 'power', unit: 'mW', tex: 'P_a' },
        P: { name: 'total beam power', q: 'power', unit: 'mW', value: 5, tex: 'P' },
        a: { name: 'radius of the circular aperture', q: 'length', unit: 'mm', value: 0.5, min: 0, tex: 'a' },
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm', value: 0.4, tex: 'w' }
      },
      solveFor: 'Pa',
      note: 'A centred circular aperture; a = w passes 86.5 %, a = 1.5 w passes 98.9 %.'
    }
  ],
  examples: [
    {
      title: 'A pinhole in the beam',
      q: 'A 5 mW beam has a 1/e² radius of 0.4 mm. How much power passes a centred pinhole of radius 0.5 mm, and what is the peak irradiance of the beam?',
      steps: [
        { text: 'The share of power inside radius $a$ is $1 - e^{-2a^2/w^2}$. Here $2a^2/w^2 = 2(0.5/0.4)^2 = 3.125$:', tex: '1 - e^{-3.125} = 1 - 0.0439 = 0.956' },
        'The pinhole passes $0.956 \\times 5\\ \\mathrm{mW} = 4.78\\ \\mathrm{mW}$.',
        { text: 'The peak irradiance is twice the power divided by the area of the 1/e² circle:', tex: 'I_0 = \\frac{2P}{\\pi w^2} = \\frac{2 \\times 5\\times10^{-3}}{\\pi\\,(0.4\\times10^{-3})^2} = 1.99\\times10^{4}\\ \\mathrm{W/m^2}' }
      ],
      a: '4.78 mW passes (95.6 %); the peak irradiance is 2.0 W/cm².'
    },
    {
      title: 'How wide must an aperture be?',
      q: 'A beam of 1/e² radius $w = 2$ mm must be passed with at most 1 % loss. What diameter must the clear aperture have?',
      steps: [
        { text: 'Set the share outside the circle to 1 %:', tex: 'e^{-2a^2/w^2} = 0.01 \\quad\\Rightarrow\\quad \\frac{2a^2}{w^2} = \\ln 100 = 4.605' },
        { text: 'Solve for the radius:', tex: 'a = w\\sqrt{2.303} = 1.517\\,w = 3.03\\ \\mathrm{mm}' }
      ],
      a: 'A clear aperture about 6.1 mm across, that is 1.52 w in radius: roughly three times the beam radius in diameter.'
    }
  ],
  quiz: [
    { q: 'A Gaussian beam has a 1/e² radius of 1 mm. At a radius of 1 mm, what fraction of the peak irradiance is left?', choices: ['50 %', '36.8 %', '13.5 %', '1.1 %'], a: 2, why: 'At $r = w$ the irradiance is $e^{-2} = 0.135$ of the peak. The 36.8 % figure is $1/e$, which is the *field* amplitude at that radius, not the irradiance.' },
    { q: 'What share of the power of a Gaussian beam lies inside the circle of radius $w$?', choices: ['50 %', '63 %', '86.5 %', '99 %'], a: 2, why: 'The power inside radius $r$ is $1 - e^{-2r^2/w^2}$, which is $1 - e^{-2} = 0.865$ at $r = w$.' },
    { q: 'The full width at half maximum of a Gaussian beam is larger than its 1/e² diameter.', a: false, why: 'The half-intensity points are at $0.589\\,w$, so FWHM $= 1.177\\,w$, while the 1/e² diameter is $2w$. The 1/e² width is the wider of the two.' },
    { q: 'What is the peak irradiance of a 10 mW beam with a 1/e² radius of 0.5 mm, in W/m²?', answer: 25465, unit: 'W/m²', why: '$I_0 = 2P/(\\pi w^2) = 2 \\times 0.01/(\\pi \\times 0.25\\times10^{-6}) = 2.55\\times10^{4}$ W/m², that is 2.55 W/cm².' },
    { q: 'Why can a laser beam not be treated as a single ray?', choices: ['Lasers emit many rays at once', 'A beam of finite width must spread by diffraction and its width changes along the path', 'Laser light cannot be refracted', 'Its colour changes along the path'], a: 1, why: 'Diffraction makes any beam of finite width diverge; its radius is smallest at the waist and grows on either side. A ray has no width and never spreads.' }
  ],
  applications: [
    'Laser pointers, alignment lasers and levels: the spot a person sees is the Gaussian profile, and its 1/e² size is what the maker specifies.',
    'Laser material processing: the peak irradiance 2P/(πw²) decides whether a surface is heated, marked or cut.',
    'Single-mode optical fibre: the light leaving the end of the fibre is very nearly Gaussian, which is why fibre couplers are designed with these formulas ([[coupling-light-into-fibre]]).',
    'Laser safety calculations: the irradiance at the eye is found from the beam power and radius ([[laser-safety-classes]]).'
  ],
  history: 'The name comes from the bell curve of Carl Friedrich Gauss, who used it for the errors of measurement in the early 1800s. Gaussian beams entered optics in the early 1960s, when Fox and Li, and Boyd and Gordon, worked out the modes of the mirror resonators of the first lasers. The 1966 review by Kogelnik and Li gave the rules for lenses and resonators in the form still used.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — the Gaussian beam and its parameters.',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966) — the classic review.',
    'A. E. Siegman, *Lasers* — the chapters on Gaussian beams and on beam propagation.'
  ],
  sim: 'gb-profile'
},

/* ================================================================ beam waist and divergence */
{
  id: 'beam-waist-and-divergence', parent: 'gaussian-beams', title: 'Beam waist and divergence', level: 2,
  short: 'A Gaussian beam is narrowest at its waist, of radius w₀, and from there spreads into a cone of half-angle θ = λ/(πw₀). A small waist spreads fast and a large one slowly; the product w₀θ = λ/π is fixed by the wavelength.',
  keywords: ['beam waist', 'divergence', 'beam divergence', 'half-angle', 'full angle', 'far field', 'w0', 'lambda over pi w0', 'mrad', 'spreading', 'diffraction limited beam', 'beam parameter product'],
  prereq: ['the-gaussian-beam', 'what-diffraction-is', 'wavelength-frequency-and-colour'],
  related: ['rayleigh-range', 'beam-quality-m-squared', 'the-airy-disk', 'beam-expanders', 'focusing-a-laser-beam', 'single-mode-and-multimode-fibre', 'the-optical-invariant'],
  body: `
A laser beam leaving a mirror is not parallel, however it looks across the room. Its radius is smallest at one place, the **waist**, where the wavefronts are flat and the radius is $w_0$. From there the beam spreads on both sides, and far away the edge of the beam follows a straight cone whose **half-angle divergence** is

$$\\theta = \\frac{\\lambda}{\\pi w_0}$$

in radians, measured at the 1/e² radius. Nothing but the wavelength and the size of the waist appears: the spreading is the diffraction of a beam of that width.

### The trade
Multiply the two sides: $w_0\\,\\theta = \\lambda/\\pi$. For a given wavelength the product of waist radius and divergence cannot change. Make the waist ten times smaller and the beam spreads ten times faster. At 632.8 nm ($w_0\\theta = 0.2014$ mm·mrad):

| waist radius $w_0$ | half-angle $\\theta$ | full angle $2\\theta$ | radius 100 m away |
|---|---|---|---|
| 0.1 mm | 2.01 mrad | 4.03 mrad | 201 mm |
| 0.24 mm | 0.839 mrad | 1.68 mrad | 83.9 mm |
| 0.5 mm | 0.403 mrad | 0.806 mrad | 40.3 mm |
| 1 mm | 0.201 mrad | 0.403 mrad | 20.2 mm |
| 5 mm | 0.0403 mrad | 0.0806 mrad | 6.4 mm |

The last column is not simply $\\theta \\times 100$ m: for the 5 mm waist the beam is still close to its waist after 100 m, and the radius is $w_0\\sqrt{1 + (z/z_R)^2}$ ([[rayleigh-range]]).

### Which angle?
Datasheets usually give the **full angle** $2\\theta$ — the 0.24 mm waist of a small helium–neon tube is listed as "1.7 mrad" — and some give the full angle at half maximum rather than at 1/e². The formula above is the half-angle at 1/e²; to convert from the FWHM full angle divide by 1.177. Ask which one before using a number.

### Wavelength and size
The same waist spreads more for longer wavelengths: at $w_0 = 1$ mm the half-angle is 0.129 mrad at 405 nm, 0.201 mrad at 632.8 nm, 0.339 mrad at 1064 nm and 3.37 mrad for a CO₂ laser at 10.6 µm. A single-mode fibre at 1550 nm has a mode radius near 5.2 µm, so its light leaves in a cone of half-angle 95 mrad (5.4°).

### Compared with a hole
A uniform circular beam of diameter $D$ spreads to the first dark ring of the [[the-airy-disk|Airy pattern]] at $1.22\\,\\lambda/D$ and has rings. A Gaussian beam of 1/e² diameter $D$ has $\\theta = 0.64\\,\\lambda/D$ and no rings at all: the smooth edge costs nothing in spreading.

### Limits
The formula assumes small angles. It is good to about 0.3 rad (17°); beyond that, as for the fast axis of a laser diode ([[collimating-a-laser-diode]]), it is an estimate.

> [!key] $\\theta = \\lambda/(\\pi w_0)$: waist and divergence trade against each other, and their product $\\lambda/\\pi$ is fixed. A tighter waist means a faster-spreading beam; only a larger waist keeps a beam narrow over a long path.
`,
  ideas: [
    'The waist is the narrowest point of the beam; the divergence half-angle there is θ = λ/(πw₀).',
    'The product w₀θ = λ/π cannot be reduced: halving the waist doubles the spread.',
    'Datasheets mostly quote the full angle, 2θ, sometimes at half maximum instead of 1/e².',
    'The best waist for reaching a distance z is w₀ = √(λz/π), where the beam at z is √2 w₀ wide.',
    'A Gaussian beam of 1/e² diameter D spreads by about 0.64 λ/D with no side rings.'
  ],
  pitfalls: [
    'A laser beam is parallel — Even a perfect beam diverges: θ = λ/(πw₀) never reaches zero. A 1 mm waist at 632.8 nm still gives a 20 cm radius after a kilometre.',
    'A small waist gives a small spot everywhere — A small waist is small only near the waist. Far away it is the beam with the larger waist that is narrower: the divergence grows as the waist shrinks.',
    'The quoted divergence is the half-angle in the formula — Most datasheets give the full angle, twice the θ of the formula. Some give the full angle at half maximum, which is only 1.177 θ, 41 % less than the 1/e² full angle 2θ. Check which one the sheet states.',
    'Divergence is a fault of cheap lasers — It is a law of waves. Better optics cannot remove it; they can only trade it for beam size ([[beam-expanders]]).'
  ],
  terms: [
    { term: 'Beam waist', also: ['waist', 'w₀', 'beam neck'], def: 'The place along a beam where its radius is smallest and the wavefronts are flat. Its radius is called w₀.' },
    { term: 'Divergence', also: ['beam divergence', 'half-angle divergence', 'θ'], def: 'The angle at which a beam spreads in the far field. For a Gaussian beam the half-angle, measured at the 1/e² radius, is λ/(πw₀).' },
    { term: 'Full divergence angle', also: ['full angle', '2θ'], def: 'Twice the half-angle: the cone from one edge of the beam to the opposite one. This is the number most datasheets quote.' },
    { term: 'Far field', also: ['Fraunhofer region'], def: 'The region far beyond the Rayleigh range where the beam radius grows in direct proportion to distance, w ≈ θz.' },
    { term: 'Milliradian', also: ['mrad'], def: 'A thousandth of a radian: a beam of 1 mrad divergence grows by 1 mm for every metre of travel.' }
  ],
  formulas: [
    {
      name: 'Divergence half-angle',
      expr: 'th = lam/(pi*w0)', tex: '\\theta = \\frac{\\lambda}{\\pi w_0}',
      vars: {
        th: { name: 'divergence half-angle', q: 'angle', unit: 'mrad', tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.5, tex: 'w_0' }
      },
      solveFor: 'th',
      note: 'The 1/e² half-angle of an ideal Gaussian beam, small angles. The full angle is twice this.',
      stories: { th: 'A beam of {lam} light has a waist radius of {w0}. What is its half-angle divergence?', w0: 'A beam of {lam} light spreads with a half-angle of {th}. What is its waist radius?' }
    },
    {
      name: 'Beam radius at a distance',
      expr: 'w = w0*sqrt(1 + (z*lam/(pi*w0^2))^2)', tex: 'w = w_0\\sqrt{1 + \\left(\\frac{\\lambda z}{\\pi w_0^2}\\right)^2}',
      vars: {
        w: { name: 'beam radius at distance z', q: 'length', unit: 'mm', tex: 'w' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.5, min: 0.001, max: 50, tex: 'w_0' },
        z: { name: 'distance from the waist', q: 'length', unit: 'm', value: 100, tex: 'z' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'w',
      note: 'Waist at z = 0. For a distance beyond a few Rayleigh ranges this is simply w = θz.'
    },
    {
      name: 'Best waist for a given distance',
      expr: 'w0 = sqrt(lam*z/pi)', tex: 'w_0 = \\sqrt{\\frac{\\lambda z}{\\pi}}',
      vars: {
        w0: { name: 'waist radius that gives the smallest beam at z', q: 'length', unit: 'mm', tex: 'w_0' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        z: { name: 'distance to the target', q: 'length', unit: 'm', value: 1000, tex: 'z' }
      },
      solveFor: 'w0',
      note: 'Then z equals the Rayleigh range and the beam radius at the target is √2 · w₀.'
    }
  ],
  examples: [
    {
      title: 'Waist from a datasheet',
      q: 'A red laser module (635 nm) is listed with a full divergence angle of 3 mrad. What is the waist radius of its beam, taking the angle at 1/e²?',
      steps: [
        'The half-angle is $\\theta = 1.5$ mrad.',
        { text: 'Solve $\\theta = \\lambda/(\\pi w_0)$ for the waist:', tex: 'w_0 = \\frac{\\lambda}{\\pi\\theta} = \\frac{635\\times10^{-9}}{\\pi \\times 1.5\\times10^{-3}} = 1.35\\times10^{-4}\\ \\mathrm{m}' }
      ],
      a: 'A waist radius of 0.135 mm, a 1/e² diameter of 0.27 mm at the module.'
    },
    {
      title: 'The smallest spot at a kilometre',
      q: 'A 632.8 nm beam must be as narrow as possible 1 km away. Which waist radius should it be launched with, and how wide is it there?',
      steps: [
        { text: 'The radius at distance $z$ is smallest when $z$ equals the Rayleigh range, $z = \\pi w_0^2/\\lambda$:', tex: 'w_0 = \\sqrt{\\frac{\\lambda z}{\\pi}} = \\sqrt{\\frac{632.8\\times10^{-9}\\times1000}{\\pi}} = 14.2\\ \\mathrm{mm}' },
        'At that distance the radius is $\\sqrt2\\,w_0 = 20.1$ mm.'
      ],
      a: 'Launch with a waist of radius 14.2 mm (a 28 mm beam); it is 20.1 mm in radius at 1 km. A narrower launch beam spreads faster, a wider one starts wider: 20 mm is the best any 632.8 nm beam can do.'
    }
  ],
  quiz: [
    { q: 'You focus a beam to half its waist radius. Its far-field divergence becomes…', choices: ['half as large', 'unchanged', 'twice as large', 'four times as large'], a: 2, why: '$\\theta = \\lambda/(\\pi w_0)$ is inversely proportional to the waist. Halve $w_0$ and the angle doubles: the product $w_0\\theta$ is fixed.' },
    { q: 'A datasheet gives a beam divergence of 2 mrad (full angle). What is the radius growth per metre of travel in the far field?', choices: ['2 mm per metre', '1 mm per metre', '0.5 mm per metre', '4 mm per metre'], a: 1, why: 'The radius grows by the half-angle: $\\theta = 1$ mrad, so 1 mm for every metre. The diameter grows by 2 mm per metre.' },
    { q: 'At the same waist radius, a CO₂ laser (10.6 µm) diverges less than a helium–neon laser (632.8 nm).', a: false, why: '$\\theta \\propto \\lambda$: the longer wavelength spreads about 17 times faster at the same waist.' },
    { q: 'What is the half-angle divergence of a 1064 nm beam with a 1 mm waist radius, in mrad?', answer: 0.3387, unit: 'mrad', why: '$\\theta = \\lambda/(\\pi w_0) = 1.064\\times10^{-6}/(\\pi\\times10^{-3}) = 3.39\\times10^{-4}$ rad $= 0.339$ mrad.' },
    { q: 'To keep a beam as narrow as possible at a distant target, the waist radius should be…', choices: ['as large as the optics allow', 'as small as possible', '$\\sqrt{\\lambda z/\\pi}$, which makes the target distance equal the Rayleigh range', 'half the wavelength'], a: 2, why: 'A large waist starts wide; a small one spreads fast. The radius at $z$ is smallest for $w_0 = \\sqrt{\\lambda z/\\pi}$, where it equals $\\sqrt2\\,w_0$.' }
  ],
  applications: [
    'Choosing the launch beam of a free-space optical link, a range finder or a laser level for the distance it must serve.',
    'Reading a laser datasheet: waist, divergence and wavelength are three numbers of which only two are independent.',
    'Fibre optics: the cone leaving a single-mode fibre follows from its mode radius and wavelength.',
    'Laser safety: the divergence sets how fast the irradiance, and with it the hazard distance, falls with range.'
  ],
  history: 'The relation w₀θ = λ/π is the optical twin of the uncertainty relation between the width of a wave packet and the spread of its wavenumbers, and the Gaussian is the minimum-uncertainty case. The word "waist" comes from the hourglass shape of the beam as drawn in the resonator theory of the early 1960s.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — waist, divergence and the Rayleigh range.',
    'A. E. Siegman, *Lasers* — the chapters on Gaussian beam propagation.',
    'E. Hecht, *Optics* — the treatment of laser beams under diffraction.'
  ],
  sim: { id: 'gb-caustic', params: { view: 'divergence' } }
},

/* ================================================================ Rayleigh range */
{
  id: 'rayleigh-range', parent: 'gaussian-beams', title: 'The Rayleigh range', level: 2,
  short: 'The Rayleigh range z_R = πw₀²/λ is the distance from the waist at which a Gaussian beam has spread to √2 times its waist radius and its on-axis irradiance has halved. Twice that is the beam\'s depth of focus; it grows as the square of the waist.',
  keywords: ['Rayleigh range', 'Rayleigh length', 'confocal parameter', 'depth of focus', 'near field', 'far field', 'z_R', 'w(z)', 'radius of curvature', 'Gouy phase', 'caustic', 'beam propagation'],
  prereq: ['beam-waist-and-divergence', 'the-gaussian-beam', 'rays-and-wavefronts'],
  related: ['beam-quality-m-squared', 'focusing-a-laser-beam', 'depth-of-focus', 'gaussian-beams-through-lenses', 'cavity-stability', 'optical-path-length'],
  body: `
How long does a laser beam stay narrow? Near its waist it hardly grows; far away it grows in proportion to distance. The boundary between the two is the **Rayleigh range**:

$$z_R = \\frac{\\pi w_0^2}{\\lambda}$$

It is the distance from the waist at which the beam radius has become $\\sqrt2\\,w_0$, so that the cross-section has doubled in area and the irradiance on the axis has halved. In general, at distance $z$ from the waist,

$$w(z) = w_0\\sqrt{1 + \\left(\\frac{z}{z_R}\\right)^2}$$

This curve is a hyperbola. Within $\\pm z_R$ of the waist is the **near field**, where the beam is nearly a cylinder; beyond a few $z_R$ is the **far field**, where $w \\approx \\theta z$ with $\\theta = w_0/z_R = \\lambda/(\\pi w_0)$.

### The numbers
$z_R$ grows with the *square* of the waist and shrinks with the wavelength:

| waist radius | wavelength | $z_R$ |
|---|---|---|
| 10 µm | 632.8 nm | 0.50 mm |
| 0.1 mm | 632.8 nm | 49.6 mm |
| 1 mm | 632.8 nm | 4.96 m |
| 5 mm | 632.8 nm | 124 m |
| 5 µm | 1064 nm | 74 µm |
| 25 µm | 1064 nm | 1.85 mm |
| 50 µm | 1064 nm | 7.38 mm |

The width at multiples of $z_R$ is $w_0$ times 1.00 at the waist, 1.12 at $0.5\\,z_R$, 1.41 at $z_R$, 2.24 at $2z_R$ and 3.16 at $3z_R$. For a tolerance of 5 % in the beam radius the beam may be used over only $\\pm 0.32\\,z_R$.

### Depth of focus
The length $b = 2z_R$ is the **confocal parameter**, the beam's depth of focus: the stretch over which a focused beam has no more than twice its minimum cross-section. Squeeze a spot to half its radius and the usable depth falls to a quarter. This is the central trade of focusing ([[focusing-a-laser-beam]]).

### The wavefront
At the waist the wavefronts are flat. Moving away they curve, with radius of curvature
$R(z) = z\\,(1 + z_R^2/z^2)$: infinite at the waist, a minimum of $2z_R$ at $z = z_R$, then approaching $R = z$ — the wavefront of a spherical wave centred on the waist. A phase shift of $\\pi$ in all, the **Gouy phase** $\\arctan(z/z_R)$, accumulates as the beam passes through its waist; it is why a focused beam is not a simple fan of rays.

### With a real beam
A real laser beam spreads $M^2$ times faster than the ideal one, which shortens the range to $z_R = \\pi w_0^2/(M^2\\lambda)$ ([[beam-quality-m-squared]]).

> [!key] $z_R = \\pi w_0^2/\\lambda$ is the distance over which the beam stays nearly as narrow as at its waist; at $\\pm z_R$ the radius is $\\sqrt2\\,w_0$ and the axial irradiance is halved. The depth of focus $2z_R$ varies as $w_0^2$.
`,
  ideas: [
    'z_R = πw₀²/λ: the distance from the waist where the radius reaches √2 w₀ and the axial irradiance has halved.',
    'The beam radius follows w(z) = w₀√(1 + (z/z_R)²), a hyperbola; far from the waist w ≈ θz.',
    'The depth of focus 2z_R grows as the square of the waist: halve the spot and the depth falls to a quarter.',
    'The wavefront is flat at the waist and has its tightest curvature, R = 2z_R, at z = z_R.',
    'Passing through the waist a beam gains a Gouy phase shift of π in all.'
  ],
  pitfalls: [
    'Beyond the Rayleigh range the beam is no good — It keeps travelling; z_R only marks where the beam leaves the near field. At 10 z_R the radius is about ten times w₀, and it is still a perfectly good Gaussian beam.',
    'A beam is parallel inside its Rayleigh range — It still spreads slowly: at z_R the radius is 41 % larger than at the waist. "Parallel" holds only to a tolerance you choose, such as 5 % in radius over ±0.32 z_R.',
    'The Rayleigh range is the same as depth of field in photography — It is the matching idea for a laser beam, but it is defined by a doubling of the beam\'s area, not by a blur criterion. What carries over is the scaling: the depth grows as the square of the spot.',
    'A longer wavelength gives a longer Rayleigh range — For the same waist it is shorter: z_R ∝ 1/λ. Long wavelengths need bigger waists to stay collimated.'
  ],
  terms: [
    { term: 'Rayleigh range', also: ['Rayleigh length', 'z_R', 'z_0'], def: 'The distance from the waist at which a Gaussian beam\'s radius has grown to √2 times the waist radius: z_R = πw₀²/λ. The on-axis irradiance has dropped to half there.' },
    { term: 'Confocal parameter', also: ['depth of focus (of a beam)', 'b', '2z_R'], def: 'Twice the Rayleigh range: the length over which a focused beam stays within √2 of its minimum radius.' },
    { term: 'Near field', also: ['Rayleigh region'], def: 'The region within about one Rayleigh range of the waist, where the beam is nearly a cylinder with almost flat wavefronts.' },
    { term: 'Radius of curvature of the wavefront', also: ['R(z)'], def: 'The curvature of the beam\'s phase front at distance z from the waist: R = z(1 + z_R²/z²). Flat at the waist and minimal, 2z_R, at z = z_R.' },
    { term: 'Gouy phase', def: 'The extra phase shift, arctan(z/z_R), that a focused beam acquires relative to a plane wave; π in all from far before to far after the waist.' }
  ],
  formulas: [
    {
      name: 'Rayleigh range',
      expr: 'zR = pi*w0^2/lam', tex: 'z_R = \\frac{\\pi w_0^2}{\\lambda}',
      vars: {
        zR: { name: 'Rayleigh range', q: 'length', unit: 'm', tex: 'z_R' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 1, tex: 'w_0' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'zR',
      note: 'For an ideal (M² = 1) Gaussian beam.',
      stories: { zR: 'A beam of {lam} light has a waist radius of {w0}. What is its Rayleigh range?', w0: 'A {lam} beam needs a Rayleigh range of {zR}. What waist radius gives that?' }
    },
    {
      name: 'Beam radius along the axis',
      expr: 'w = w0*sqrt(1 + (z/zR)^2)', tex: 'w = w_0\\sqrt{1 + \\left(\\frac{z}{z_R}\\right)^2}',
      vars: {
        w: { name: 'beam radius at z', q: 'length', unit: 'mm', tex: 'w' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 1, min: 0.0001, max: 100, tex: 'w_0' },
        z: { name: 'distance from the waist', q: 'length', unit: 'm', value: 5, tex: 'z' },
        zR: { name: 'Rayleigh range', q: 'length', unit: 'm', value: 4.9646, tex: 'z_R' }
      },
      solveFor: 'w',
      note: 'z may be on either side of the waist; the radius depends on |z|.'
    },
    {
      name: 'Wavefront radius of curvature',
      expr: 'R = z*(1 + (zR/z)^2)', tex: 'R = z\\left(1 + \\frac{z_R^2}{z^2}\\right)',
      vars: {
        R: { name: 'radius of curvature of the wavefront', q: 'length', unit: 'm', tex: 'R' },
        z: { name: 'distance from the waist', q: 'length', unit: 'm', value: 10, min: 0.001, tex: 'z' },
        zR: { name: 'Rayleigh range', q: 'length', unit: 'm', value: 4.965, tex: 'z_R' }
      },
      solveFor: 'R',
      note: 'Past the waist (z > 0); the minimum, 2z_R, occurs at z = z_R.'
    }
  ],
  examples: [
    {
      title: 'How far does a pointer beam stay tight?',
      q: 'A helium–neon beam (632.8 nm) leaves its tube with a waist radius of 0.24 mm. What is the Rayleigh range, and how wide is the beam there?',
      steps: [
        { text: 'The Rayleigh range:', tex: 'z_R = \\frac{\\pi w_0^2}{\\lambda} = \\frac{\\pi\\,(0.24\\times10^{-3})^2}{632.8\\times10^{-9}} = 0.286\\ \\mathrm{m}' },
        'At that distance the radius is $\\sqrt2 \\times 0.24 = 0.34$ mm.'
      ],
      a: '$z_R = 0.29$ m. A beam that leaves the tube 0.48 mm across is already 0.68 mm across 29 cm away.'
    },
    {
      title: 'A waist for a given depth',
      q: 'A 1064 nm laser must keep its spot within a factor of √2 over 20 mm (a depth of focus of 20 mm). What waist radius is needed?',
      steps: [
        'A depth of 20 mm is $2z_R$, so $z_R = 10$ mm.',
        { text: 'Solve $z_R = \\pi w_0^2/\\lambda$ for $w_0$:', tex: 'w_0 = \\sqrt{\\frac{\\lambda z_R}{\\pi}} = \\sqrt{\\frac{1.064\\times10^{-6} \\times 0.01}{\\pi}} = 58\\ \\mathrm{\\mu m}' }
      ],
      a: 'A waist radius of 58 µm (a spot 116 µm across); a tighter spot will not stay in focus that long.'
    }
  ],
  quiz: [
    { q: 'How does the Rayleigh range change if the waist radius is halved (same wavelength)?', choices: ['It halves', 'It falls to a quarter', 'It doubles', 'It is unchanged'], a: 1, why: '$z_R = \\pi w_0^2/\\lambda$ goes as the square of the waist radius, so half the waist gives a quarter of the range.' },
    { q: 'By what factor has the beam radius grown at one Rayleigh range from the waist?', choices: ['1.00', '1.41', '2.00', '4.00'], a: 1, why: '$w(z_R) = w_0\\sqrt{1 + 1} = \\sqrt2\\,w_0$: the area doubles and the axial irradiance halves.' },
    { q: 'At the waist of a Gaussian beam, the wavefronts are plane.', a: true, why: 'The radius of curvature $R = z(1 + z_R^2/z^2)$ becomes infinite as $z \\to 0$: the wavefront is flat at the waist and curves on both sides.' },
    { q: 'What is the Rayleigh range of a beam of radius 5 µm at its waist, wavelength 1064 nm, in µm?', answer: 73.8, unit: 'µm', why: '$z_R = \\pi w_0^2/\\lambda = \\pi\\,(5\\times10^{-6})^2/(1.064\\times10^{-6}) = 7.38\\times10^{-5}$ m $= 73.8$ µm.' },
    { q: 'At what distance from the waist is the wavefront most strongly curved (smallest radius of curvature)?', choices: ['at the waist', 'at one Rayleigh range', 'at the far field, ten Rayleigh ranges away', 'at the same place for every beam, 1 m'], a: 1, why: '$R(z) = z(1 + z_R^2/z^2)$ has its minimum, $2z_R$, at $z = z_R$. At the waist the front is flat and far away it approaches a sphere of radius $z$.' }
  ],
  applications: [
    'Laser cutting, marking and welding: the depth of focus of the spot decides how much the work distance may vary.',
    'Fibre coupling and confocal microscopy: the focus must overlap a small mode over a length 2z_R.',
    'Laser resonators: the waist inside the cavity and its Rayleigh range set the mode ([[cavity-stability]]).',
    'Free-space optical links: the launch beam is chosen so that the Rayleigh range is of the order of the link distance.'
  ],
  history: 'The name honours Lord Rayleigh, whose work on diffraction and focusing set the standard measures of when a focus is good enough; the length itself, defined by a doubling of the beam\'s area, belongs to the Gaussian-beam theory of the 1960s. The Gouy phase is older: Louis Georges Gouy reported in 1890 that a wave passing through a focus gains a phase shift of π.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — beam width, curvature and Gouy phase.',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966).',
    'A. E. Siegman, *Lasers* — the chapters on Gaussian beams.'
  ],
  sim: { id: 'gb-caustic', params: { view: 'rayleigh' } }
},

/* ================================================================ beam quality M² */
{
  id: 'beam-quality-m-squared', parent: 'gaussian-beams', title: 'Beam quality: M²', level: 2,
  short: 'No laser beam spreads less than a perfect Gaussian of the same waist; real beams spread M² times faster. M² ≥ 1 is the "times-diffraction-limit" factor, and the beam parameter product w₀θ = M²λ/π is the quantity that lenses cannot improve.',
  keywords: ['M squared', 'M2', 'beam quality', 'beam quality factor', 'beam parameter product', 'BPP', 'times diffraction limit', 'beam propagation ratio', 'K factor', 'diffraction-limited', 'mm mrad', 'embedded Gaussian'],
  prereq: ['beam-waist-and-divergence', 'rayleigh-range', 'the-gaussian-beam'],
  related: ['focusing-a-laser-beam', 'measuring-a-beam', 'higher-order-modes', 'beam-expanders', 'the-optical-invariant', 'etendue', 'single-mode-and-multimode-fibre'],
  body: `
A perfect Gaussian beam is the best a laser can do: no beam with a given waist spreads less. Real lasers fall short, and the **beam quality factor** $M^2$ ("M squared") says by how much.

### Definition
For a real beam with waist radius $w_0$ and far-field half-angle $\\theta$ (both taken from second moments, see [[measuring-a-beam]]),

$$M^2 = \\frac{\\pi\\,w_0\\,\\theta}{\\lambda}$$

An ideal Gaussian beam has $w_0\\theta = \\lambda/\\pi$, so $M^2 = 1$; every other beam has $M^2 > 1$. Equivalently, the real beam spreads $M^2$ times faster than an ideal one of the same waist, and the formulas of [[beam-waist-and-divergence]] and [[rayleigh-range]] hold with $\\lambda$ replaced by $M^2\\lambda$:

$$\\theta = \\frac{M^2\\lambda}{\\pi w_0}, \\qquad z_R = \\frac{\\pi w_0^2}{M^2\\lambda}$$

### The beam parameter product
The product $w_0\\theta = M^2\\lambda/\\pi$ is the **beam parameter product** (BPP), quoted in mm·mrad. Lenses, telescopes and expanders trade beam size for angle but leave it unchanged (it is the beam's version of the [[the-optical-invariant|optical invariant]]), so BPP and $M^2$ describe the laser, not the optical set-up.

| beam | typical $M^2$ | BPP (mm·mrad) |
|---|---|---|
| helium–neon, 632.8 nm | 1.0–1.1 | 0.20–0.22 |
| single-mode laser diode (each axis), 650 nm | 1.1–1.3 | 0.23–0.27 |
| single-mode fibre laser, 1070 nm | below 1.1 | about 0.34–0.37 |
| multimode fibre laser, 1070 nm | 5–20 | 1.7–6.8 |
| 100 µm, NA 0.22 delivery fibre, full | up to about 32 | up to 11 |
| diode bar, slow axis | hundreds to over 1000 | order of 100–500 |

### What it costs
Focus the same beam through the same lens ([[focusing-a-laser-beam]]) and the spot is $M^2$ times larger. With a 4 mm beam at 1070 nm and a 100 mm lens, $M^2 = 1$ gives a waist radius of 8.5 µm and $M^2 = 10$ gives 85 µm: a hundred times less irradiance for the same power. The depth of focus grows by the same factor $M^2$, so a worse beam focuses to a larger spot that lasts longer.

### Why it exceeds one
Most often the beam is a mixture of transverse modes ([[higher-order-modes]]: a mode of order $m$ has $M^2 = 2m+1$) or has been distorted by aberrations or thermal lensing in the gain medium. Lossless, aberration-free optics cannot lower $M^2$; only throwing light away can, with an aperture or a pinhole.

### Two axes
A beam may differ in its two directions. $M^2_x$ and $M^2_y$ are then quoted separately: a diode has $M^2$ near 1 in its fast axis and often more in the slow one, a bar far more in the slow one.

> [!key] $M^2 = \\pi w_0\\theta/\\lambda \\ge 1$: how many times faster than an ideal Gaussian the beam spreads. It is a property of the laser and survives every lens; a larger $M^2$ means a larger focal spot and less irradiance.
`,
  ideas: [
    'M² = πw₀θ/λ compares a real beam with the ideal Gaussian of the same waist; M² = 1 is the best possible and M² cannot be below 1.',
    'A beam with M² spreads M² times faster, and its Rayleigh range is M² times shorter, than an ideal beam of the same waist.',
    'The beam parameter product w₀θ = M²λ/π is unchanged by lenses and beam expanders.',
    'Through the same lens a beam of larger M² focuses to a spot M² times larger.',
    'M² can be improved only by discarding power: an aperture, a pinhole or a mode filter.'
  ],
  pitfalls: [
    'M² = 1.3 means the beam has 30 % less power — M² is purely geometric and says nothing about power. It says that the beam spreads 1.3 times faster than a perfect Gaussian with the same waist.',
    'A better lens will lower M² — M² is conserved through lossless, aberration-free optics, and a poor lens only raises it. Lenses trade waist against divergence; they cannot reduce the product.',
    'M² is the number of modes in the beam — It is an intensity-weighted measure of mode content: M² = 5 does not mean five modes. Mode order m alone gives M² = 2m + 1.',
    'A laser has one fixed M² — It is quoted at rated power and for each axis; thermal lensing in solid-state lasers and the heating of fibre amplifiers can raise it as the power is increased.'
  ],
  terms: [
    { term: 'M² factor', also: ['beam quality factor', 'times-diffraction-limit factor', 'beam propagation ratio'], def: 'The product of waist radius and far-field half-angle of a beam divided by λ/π, the same product for an ideal Gaussian beam. M² ≥ 1, with 1 the ideal. ISO 11146 also uses K = 1/M² (the beam propagation factor).' },
    { term: 'Beam parameter product', also: ['BPP'], def: 'The product w₀θ of waist radius and far-field half-angle, in mm·mrad. For a beam of quality M² it is M²λ/π, and lenses do not change it.' },
    { term: 'Diffraction-limited beam', def: 'A beam of M² = 1, whose spreading is set by diffraction alone: the ideal Gaussian beam. In practice a beam with M² below about 1.1–1.3 is called near-diffraction-limited.' },
    { term: 'Embedded Gaussian', also: ['embedded beam'], def: 'The ideal Gaussian beam of the same waist, with the real beam described as that beam at a wavelength M² times longer.' },
    { term: 'Thermal lensing', def: 'The focusing, and distortion, of a beam inside a laser medium that is heated unevenly by the pump light. It degrades M² as the power is raised.' }
  ],
  formulas: [
    {
      name: 'Beam quality factor',
      expr: 'M2 = pi*w0*th/lam', tex: 'M^2 = \\frac{\\pi w_0 \\theta}{\\lambda}',
      vars: {
        M2: { name: 'beam quality factor', tex: 'M^2', min: 1 },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 2, tex: 'w_0' },
        th: { name: 'far-field half-angle divergence', q: 'angle', unit: 'mrad', value: 1.6, tex: '\\theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1070, tex: '\\lambda' }
      },
      solveFor: 'M2',
      note: 'Second-moment radius and half-angle of a real beam; M² is at least 1.',
      stories: { M2: 'A beam of wavelength {lam} has a waist radius of {w0} and a far-field half-angle of {th}. What is its M²?', th: 'A {lam} beam of M² = {M2} has a waist radius of {w0}. What is its half-angle divergence?' }
    },
    {
      name: 'Rayleigh range of a real beam',
      expr: 'zR = pi*w0^2/(M2*lam)', tex: 'z_R = \\frac{\\pi w_0^2}{M^2 \\lambda}',
      vars: {
        zR: { name: 'Rayleigh range', q: 'length', unit: 'mm', tex: 'z_R' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.1, tex: 'w_0' },
        M2: { name: 'beam quality factor', value: 10, min: 1, tex: 'M^2' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1070, tex: '\\lambda' }
      },
      solveFor: 'zR',
      note: 'At the same waist radius the range is M² times shorter than for an ideal beam.'
    },
    {
      name: 'Beam parameter product',
      expr: 'bpp = M2*lam/(1000*pi)', tex: '\\mathrm{BPP} = \\frac{M^2 \\lambda}{\\pi}',
      vars: {
        bpp: { name: 'beam parameter product', q: false, unit: 'mm·mrad', tex: '\\mathrm{BPP}' },
        M2: { name: 'beam quality factor', value: 1.1, min: 1, tex: 'M^2' },
        lam: { name: 'wavelength in nanometres', q: false, unit: 'nm', value: 1070, tex: '\\lambda' }
      },
      solveFor: 'bpp',
      note: 'With λ in nm the result is in mm·mrad. A beam with a given BPP has half-angle BPP / w₀ at any waist radius w₀.'
    }
  ],
  examples: [
    {
      title: 'M² from a measurement',
      q: 'A fibre laser at 1070 nm has a measured waist radius of 2.0 mm and a far-field full divergence angle of 3.2 mrad. What are its M² and BPP?',
      steps: [
        'The half-angle is $\\theta = 1.6$ mrad.',
        { text: 'The beam quality factor:', tex: 'M^2 = \\frac{\\pi w_0\\theta}{\\lambda} = \\frac{\\pi \\times 2.0\\times10^{-3}\\times 1.6\\times10^{-3}}{1.07\\times10^{-6}} = 9.4' },
        'The product $w_0\\theta = 2.0\\ \\mathrm{mm} \\times 1.6\\ \\mathrm{mrad} = 3.2$ mm·mrad.'
      ],
      a: '$M^2 = 9.4$, BPP = 3.2 mm·mrad: a multimode beam, about nine times worse than a perfect Gaussian.'
    },
    {
      title: 'What the same BPP gives at another size',
      q: 'A laser has BPP = 4 mm·mrad at 1070 nm. What is its M², and what is its half-angle if the beam is expanded to a waist radius of 5 mm?',
      steps: [
        { text: 'For 1070 nm, $\\lambda/\\pi = 0.3406$ mm·mrad, so', tex: 'M^2 = \\frac{4}{0.3406} = 11.7' },
        { text: 'The product is conserved, so at $w_0 = 5$ mm:', tex: '\\theta = \\frac{\\mathrm{BPP}}{w_0} = \\frac{4\\ \\mathrm{mm\\cdot mrad}}{5\\ \\mathrm{mm}} = 0.8\\ \\mathrm{mrad}' }
      ],
      a: '$M^2 = 11.7$. At a 5 mm waist radius the half-angle is 0.8 mrad, where a perfect beam of that size would have 0.068 mrad.'
    }
  ],
  quiz: [
    { q: 'A measurement reports $M^2 = 0.8$. What does that tell you?', choices: ['The beam is better than diffraction-limited', 'The measurement or the analysis contains an error', 'The beam is multimode', 'The laser is below threshold'], a: 1, why: 'The ideal Gaussian beam has $M^2 = 1$ and no beam can do better, so a value below 1 means the measurement (usually the choice of width, noise in the wings, or the position scale) is wrong.' },
    { q: 'A beam with $M^2 = 4$ has the same waist radius as an ideal beam of the same wavelength. Its far-field divergence is…', choices: ['the same', '2 times larger', '4 times larger', '16 times larger'], a: 2, why: '$\\theta = M^2\\lambda/(\\pi w_0)$: the divergence is $M^2$ times that of the ideal beam with the same waist.' },
    { q: 'A beam expander lowers the M² of a laser beam.', a: false, why: 'An expander makes the beam wider and the divergence smaller by the same factor, leaving $w_0\\theta$ and hence $M^2$ unchanged.' },
    { q: 'What is the BPP of a perfect Gaussian beam at 1064 nm, in mm·mrad? (Use $\\lambda/\\pi$.)', answer: 0.3387, why: 'For $M^2 = 1$ the product is $\\lambda/\\pi = 1.064\\times10^{-6}/\\pi = 3.387\\times10^{-7}$ m·rad $= 0.339$ mm·mrad.' },
    { q: 'The same lens focuses a beam of $M^2 = 10$ and one of $M^2 = 1$, both of the same size at the lens. The first beam\'s spot compared with the second\'s has…', choices: ['the same radius', 'a radius 10 times larger and 100 times less peak irradiance at equal power', 'a radius 10 times smaller', 'a radius 100 times larger'], a: 1, why: '$w_0 = M^2\\lambda f/(\\pi w)$: ten times the radius. The peak irradiance $2P/(\\pi w_0^2)$ falls as the area, a factor 100.' }
  ],
  applications: [
    'Choosing a laser for cutting or marking: a lower M² gives a smaller, brighter spot and a longer depth of focus from the same lens.',
    'Specifying fibre lasers: M² or BPP is the number that tells how fine a spot and how long a working distance the beam allows.',
    'Fibre coupling: a beam with BPP larger than that of the fibre (core radius × NA) cannot be coupled in without loss.',
    'Reading a datasheet for a diode laser, where M² is quoted separately for the fast and slow axes.'
  ],
  history: 'The idea of comparing a real beam with an ideal Gaussian of the same waist grew in the 1980s, as lasers with imperfect beams entered industry and a single number was needed to describe them. Anthony Siegman did much to give it a firm theoretical footing; ISO 11146 later fixed how it is measured.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on Gaussian beams and on propagation of real, multimode beams.',
    'ISO 11146 (parts 1–3), *Lasers and laser-related equipment — Test methods for laser beam widths, divergence angles and beam propagation ratios*.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics).'
  ],
  sim: 'gb-quality'
},

/* ================================================================ focusing a laser beam */
{
  id: 'focusing-a-laser-beam', parent: 'gaussian-beams', title: 'Focusing a laser beam', level: 2,
  short: 'A lens of focal length f turns a collimated beam of radius w into a waist of radius w₀ = M²λf/(πw) with a depth of focus 2z_R. The smaller the spot, the shorter it lasts: the depth falls as the square of the spot size.',
  keywords: ['focusing a laser', 'focal spot', 'spot size', 'depth of focus', 'lens fill', 'truncation', 'focus a beam', 'w0 = lambda f / pi w', 'laser focusing lens', 'focal waist', 'f-number', 'diffraction-limited spot'],
  prereq: ['rayleigh-range', 'beam-quality-m-squared', 'focal-length-and-optical-power'],
  related: ['the-f-number', 'the-airy-disk', 'gaussian-beams-through-lenses', 'beam-expanders', 'focusing-to-a-point', 'laser-processing-systems', 'coupling-light-into-fibre', 'depth-of-focus'],
  body: `
A lens can concentrate a laser beam into a tiny, intense spot. How small the spot gets, and how long it stays small, follow from the Gaussian formulas.

### The spot
A collimated beam of radius $w$ at a lens of focal length $f$ comes to a waist in the focal plane of radius

$$w_0 = \\frac{M^2\\,\\lambda\\,f}{\\pi\\,w}$$

A long focal length, a small beam, a long wavelength or a poor beam quality all enlarge the spot. Only the ratio $f/w$ matters: with $N = f/(2w)$, the focal ratio of the cone as seen by the beam, the $1/e^2$ spot diameter is $2w_0 = (4/\\pi)\\,M^2\\lambda N = 1.27\\,M^2\\lambda N$.

### The depth of focus
Behind the waist the beam follows [[rayleigh-range|the usual rules]]: its depth of focus is $2z_R = 2\\pi w_0^2/(M^2\\lambda)$, or $(8/\\pi)M^2\\lambda N^2$. At 1064 nm, with $M^2 = 1$:

| focal length | beam radius $w$ | $N$ | waist radius $w_0$ | depth of focus $2z_R$ |
|---|---|---|---|---|
| 100 mm | 2 mm | 25 | 16.9 µm | 1.69 mm |
| 100 mm | 4 mm | 12.5 | 8.47 µm | 0.42 mm |
| 50 mm | 2 mm | 12.5 | 8.47 µm | 0.42 mm |
| 200 mm | 2 mm | 50 | 33.9 µm | 6.77 mm |
| 100 mm, $M^2 = 5$ | 2 mm | 25 | 84.7 µm | 8.47 mm |

Rows 2 and 3 are the same, because $f/w$ is the same. Halving the spot (rows 1 and 2) divides the depth by four. A better beam gives a smaller spot, but at the same lens a worse beam gives a *longer* focus (last row).

### The lens must be wide enough
The formula assumes the whole beam passes. A clear aperture of radius $a$ passes $1 - e^{-2a^2/w^2}$ of the power ([[the-gaussian-beam]]): 86.5 % at $a = w$ and 98.9 % at $a = 1.5\\,w$. Beyond that, a lens much wider than the beam adds nothing: to make a smaller spot, widen the beam first with a [[beam-expanders|beam expander]] rather than buying a bigger lens.

### Not the Airy disc
A uniform beam filling a lens gives the [[the-airy-disk|Airy pattern]], diameter $2.44\\,\\lambda N$ to the first dark ring, with rings. A Gaussian beam filling the lens at its 1/e² diameter gives a 1/e² diameter of $1.27\\,\\lambda N$ and no rings; as the lens is stopped down to clip the beam, the spot slowly approaches the Airy form. Real lenses add aberrations ([[focusing-to-a-point]]).

> [!warn] A focused laser beam is far more dangerous than the beam before the lens: 1 W focused to $w_0 = 17\\ \\mu m$ reaches a peak irradiance of 2.2 × 10⁵ W/cm², enough to burn skin and paper, and the beam diverges again beyond the focus. Never look along a beam or at its reflections, and see [[laser-safety-classes]]; work with Class 3B and 4 lasers belongs to trained people under a laser safety officer.

> [!key] $w_0 = M^2\\lambda f/(\\pi w)$ and $2z_R \\propto w_0^2$. A smaller spot needs a short lens, a wide beam and a good beam, and it lasts a shorter distance.
`,
  ideas: [
    'A collimated beam of radius w focused by f has a waist w₀ = M²λf/(πw) in the focal plane.',
    'Only the ratio f/w counts: the 1/e² spot diameter is 1.27 M²λN, with N = f/(2w).',
    'The depth of focus 2z_R varies as the square of the spot: halve the spot, quarter the depth.',
    'A worse beam (larger M²) gives a larger spot and, from the same lens, a longer depth of focus.',
    'To shrink the spot, expand the beam; a lens that is wider than the beam adds nothing.'
  ],
  pitfalls: [
    'A bigger lens always gives a smaller spot — The spot is set by f/w. A lens wider than 1.5 to 2 times the beam radius adds nothing; widening the beam, not the lens, makes the spot smaller.',
    'The beam is focused to a point — The beam never reaches a point. It has a waist of radius w₀ and a finite depth of focus 2z_R; the spot only gets small, never zero.',
    'The Airy disc 2.44 λN is the spot size of every focused laser — That is the spot of a uniformly filled lens, with rings. A Gaussian beam focuses to 1.27 M²λN across at 1/e², with no rings.',
    'A tighter focus is always better — Depth falls as the square of the spot, so the focus becomes harder to hold, the irradiance rises as 1/w₀², and a small change of lens or beam position moves the spot out of focus.'
  ],
  terms: [
    { term: 'Focal spot', also: ['focused spot', 'spot size', 'w₀'], def: 'The smallest cross-section of a focused beam: the waist formed in the focal plane of the lens, with 1/e² radius w₀ = M²λf/(πw).' },
    { term: 'Depth of focus', also: ['confocal parameter', '2z_R'], def: 'The length along the axis over which the focused beam stays within √2 of its minimum radius: 2πw₀²/(M²λ).' },
    { term: 'Lens fill', also: ['truncation ratio', 'fill factor'], def: 'The ratio of the beam radius to the clear radius of the lens. A beam of radius w in a lens of radius a loses 1 − (1 − e^(−2a²/w²)) of its power by clipping.' },
    { term: 'Focal ratio of the beam', also: ['N = f/(2w)'], def: 'The f-number of the converging cone as it appears to a Gaussian beam of 1/e² diameter 2w: the spot is 1.27 M²λN across.' },
    { term: 'Diffraction-limited spot', def: 'The smallest spot a lens and wavelength allow. For a Gaussian beam with M² = 1 filling the lens it has 1/e² diameter 1.27 λN; for a uniform beam it is the Airy disc, 2.44 λN to the first dark ring.' }
  ],
  formulas: [
    {
      name: 'Focused waist radius',
      expr: 'w0 = M2*lam*f/(pi*w)', tex: 'w_0 = \\frac{M^2 \\lambda f}{\\pi w}',
      vars: {
        w0: { name: 'waist radius at the focus', q: 'length', unit: 'µm', tex: 'w_0' },
        M2: { name: 'beam quality factor', value: 1, min: 1, tex: 'M^2' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 100, tex: 'f' },
        w: { name: 'beam radius at the lens', q: 'length', unit: 'mm', value: 2, tex: 'w' }
      },
      solveFor: 'w0',
      note: 'Collimated input, lens wider than about 1.5 w.',
      stories: { w0: 'A {lam} beam of M² = {M2} and radius {w} is focused by a lens of focal length {f}. What is the waist radius at the focus?', f: 'A {lam} beam of radius {w} must be focused to a waist radius of {w0} (M² = {M2}). What focal length is needed?' }
    },
    {
      name: 'Depth of focus',
      expr: 'dof = 2*pi*w0^2/(M2*lam)', tex: 'b = 2z_R = \\frac{2\\pi w_0^2}{M^2 \\lambda}',
      vars: {
        dof: { name: 'depth of focus', q: 'length', unit: 'mm', tex: 'b' },
        w0: { name: 'waist radius', q: 'length', unit: 'µm', value: 16.9, tex: 'w_0' },
        M2: { name: 'beam quality factor', value: 1, min: 1, tex: 'M^2' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' }
      },
      solveFor: 'dof',
      note: 'Between the points where the beam radius is √2 times w₀.'
    },
    {
      name: 'Spot diameter from the focal ratio',
      expr: 'd = 4*M2*lam*N/pi', tex: 'd = 2 w_0 = \\frac{4 M^2 \\lambda N}{\\pi}',
      vars: {
        d: { name: '1/e² spot diameter', q: 'length', unit: 'µm', tex: 'd' },
        M2: { name: 'beam quality factor', value: 1, min: 1, tex: 'M^2' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' },
        N: { name: 'focal ratio f/(2w)', value: 10, tex: 'N' }
      },
      solveFor: 'd',
      note: 'N = f/(2w), with w the 1/e² radius of the beam at the lens.'
    }
  ],
  examples: [
    {
      title: 'A green beam to a small spot',
      q: 'A 532 nm beam of M² = 1 and radius 5 mm is focused by a lens of f = 50 mm. What are the waist radius and the depth of focus?',
      steps: [
        { text: 'The waist:', tex: 'w_0 = \\frac{\\lambda f}{\\pi w} = \\frac{532\\times10^{-9}\\times 0.050}{\\pi \\times 5\\times10^{-3}} = 1.69\\ \\mathrm{\\mu m}' },
        { text: 'The depth of focus is twice the Rayleigh range:', tex: '2z_R = \\frac{2\\pi w_0^2}{\\lambda} = \\frac{2\\pi\\,(1.69\\times10^{-6})^2}{532\\times10^{-9}} = 33.9\\ \\mathrm{\\mu m}' }
      ],
      a: 'A spot 3.4 µm across at 1/e², staying within √2 of that over only 34 µm: the work surface must be positioned to a few tens of micrometres.'
    },
    {
      title: 'The lens for a 50 µm spot',
      q: 'A 1070 nm fibre laser has M² = 1.1 and delivers a collimated beam of radius 4 mm. Which focal length gives a 50 µm spot diameter (1/e²), and what is the depth of focus?',
      steps: [
        { text: 'A 50 µm diameter means $w_0 = 25$ µm. Solve for $f$:', tex: 'f = \\frac{\\pi w\\,w_0}{M^2\\lambda} = \\frac{\\pi \\times 4\\times10^{-3}\\times 25\\times10^{-6}}{1.1 \\times 1.07\\times10^{-6}} = 0.267\\ \\mathrm{m}' },
        { text: 'Then the depth of focus:', tex: '2z_R = \\frac{2\\pi w_0^2}{M^2\\lambda} = \\frac{2\\pi\\,(25\\times10^{-6})^2}{1.1\\times 1.07\\times10^{-6}} = 3.3\\ \\mathrm{mm}' }
      ],
      a: 'A lens of about 267 mm focal length, with a depth of focus of 3.3 mm.'
    }
  ],
  quiz: [
    { q: 'A collimated beam is focused by a lens. If the beam radius at the lens is doubled (same lens, same wavelength), the focused spot radius…', choices: ['doubles', 'is unchanged', 'halves', 'quarters'], a: 2, why: '$w_0 \\propto f/w$: a wider beam fills more of the lens, which makes the cone steeper and the waist smaller, in proportion.' },
    { q: 'The spot of a beam of $M^2 = 1$ is made half as large by a shorter lens. The depth of focus then becomes…', choices: ['half', 'a quarter', 'the same', 'twice as long'], a: 1, why: '$2z_R = 2\\pi w_0^2/\\lambda$ goes as the square of the spot radius.' },
    { q: 'A lens much wider than the beam gives a smaller focused spot than one just slightly wider than the beam.', a: false, why: 'The spot depends on the beam radius at the lens and the focal length, not on the width of the glass, once the aperture passes about 98–99 % of the beam (about 1.5 times the beam radius).' },
    { q: 'A 1064 nm beam of radius 2 mm ($M^2 = 1$) is focused by a lens of f = 100 mm. What is the waist radius in µm?', answer: 16.93, unit: 'µm', why: '$w_0 = \\lambda f/(\\pi w) = 1.064\\times10^{-6}\\times 0.1/(\\pi \\times 2\\times10^{-3}) = 1.693\\times10^{-5}$ m.' },
    { q: 'Compared with the Airy disc of a uniformly filled lens, the 1/e² diameter of a Gaussian beam that fills the lens at its 1/e² diameter is…', choices: ['the same, 2.44 λN', 'smaller, 1.27 λN, with no rings', 'larger, with strong rings', 'zero'], a: 1, why: 'The Gaussian spot has $2w_0 = 1.27\\,\\lambda N$ at 1/e² and no side rings; the Airy diameter 2.44 λN is measured to the first dark ring of a different pattern.' }
  ],
  applications: [
    'Laser cutting, welding and marking: the focal spot sets the kerf and the irradiance, and its depth of focus the tolerance on work height.',
    'Confocal and multiphoton microscopes, where a laser is focused to a diffraction-limited spot inside a specimen.',
    'Coupling a laser into a single-mode fibre, which needs a spot matched to the fibre\'s mode.',
    'Optical tweezers and laser trapping, where an objective lens focuses a laser to a spot of about a micrometre.'
  ],
  history: 'The rules for how a lens transforms a Gaussian beam belong to the beam theory of the 1960s (Kogelnik and Li, 1966); S. A. Self\'s 1983 paper "Focusing of spherical Gaussian beams" gave the practical formulas still quoted. Laser machining then made the shrinking depth of focus an everyday limit on how fine a cut can be and how flat the work must lie.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — transmission of Gaussian beams through a thin lens.',
    'S. A. Self, "Focusing of spherical Gaussian beams", *Applied Optics* 22 (1983).',
    'A. E. Siegman, *Lasers* — the chapters on Gaussian beam propagation through lenses and on truncated beams.'
  ],
  sim: 'gb-focus'
},

/* ================================================================ collimating a laser diode */
{
  id: 'collimating-a-laser-diode', parent: 'gaussian-beams', title: 'Collimating a laser diode', level: 2,
  short: 'A laser diode emits from a stripe a micrometre or two across, so its beam leaves in a wide, elliptical, astigmatic cone: fast in one axis, slow in the other. An aspheric lens one focal length away makes it nearly parallel, and prisms or cylinder lenses can make it round.',
  keywords: ['collimate', 'collimating lens', 'laser diode', 'fast axis', 'slow axis', 'elliptical beam', 'anamorphic prism pair', 'circularize', 'aspheric collimator', 'astigmatism of a diode', 'residual divergence', 'diode beam'],
  prereq: ['beam-waist-and-divergence', 'focusing-a-laser-beam', 'diode-lasers'],
  related: ['gaussian-beams-through-lenses', 'beam-expanders', 'beam-quality-m-squared', 'prism-types', 'laser-safety-classes', 'vcsels-and-laser-arrays', 'electronics:optoelectronics'],
  body: `
The light of a laser diode comes from the end face of a stripe in the semiconductor, so small that diffraction opens it into a large cone. Because the stripe is not square, the cone is not round. The direction perpendicular to the junction is the **fast axis**: the emitting layer is about a micrometre thick and the light spreads over 20–40° (full angle at half maximum). Parallel to the junction is the **slow axis**: the stripe is a few micrometres wide for a single-mode diode, and the angle is 5–12°. The beam is an ellipse about three to four times taller than wide, and the two axes can appear to come from slightly different points (astigmatism).

### From datasheet to Gaussian
Datasheets give the FWHM full angle; the Gaussian formulas need the 1/e² half-angle, which is the FWHM divided by 1.177. A 650 nm diode of $30°\\times 8°$ has half-angles of 25.5° and 6.8°, so emitter waist radii of $w_0 = \\lambda/(\\pi\\theta)$ = 0.47 µm and 1.75 µm. The Rayleigh range in the fast axis is only about 1 µm: the emitter is as near a point source as light allows.

### The collimating lens
A lens one focal length from the emitter turns the cone into a nearly parallel beam of radius about $f\\,\\theta$ in each axis ([[gaussian-beams-through-lenses]]):

| collimator | fast-axis radius | slow-axis radius | residual full divergence, fast / slow |
|---|---|---|---|
| $f = 4.5$ mm | 2.0 mm | 0.53 mm | 0.21 / 0.78 mrad |
| $f = 8$ mm | 3.6 mm | 0.95 mm | 0.12 / 0.44 mrad |

The beam is still an ellipse, 3.75 to 1 here. A longer focal length makes a larger, better-collimated beam. The **residual divergence** is the emitter radius over the focal length, $\\theta_{res} = w_0/f$: it can never be zero. For wide fast-axis angles the exact beam radius depends on the lens design, by up to 10 % at 25°.

### Making it round
Expand the slow axis by the ratio, with an **anamorphic prism pair** or a cylinder-lens telescope. A prism turned so that the beam meets it at angle $\\theta_i$ and leaves normally expands the beam by $\\cos\\theta_t/\\cos\\theta_i$; at Brewster's angle this is $n$, so a pair gives $n^2 = 2.29$ in N-BK7 at 650 nm. A ratio of 3.75 needs each prism at 65.6°, where the p-polarized reflection per entry face is 1.5 %. The fast axis can instead be compressed.

### Focus to the micrometre
Because the fast-axis Rayleigh range is 1 µm, the lens position is critical. For $f = 4.5$ mm, moving the lens 2 µm away from its best position makes the fast axis converge to a waist 8 m behind it; a 10 µm shift puts the waist 2 m away, so that 10 m from the lens the beam is 16 mm across instead of 4.5 mm. Modules are focused while the beam is watched far away, and then locked.

> [!warn] A collimated beam puts all its power into the pupil of an eye, so it is far more hazardous than the diverging beam from the bare diode. Many diodes are infrared (808, 940 nm) and invisible. Never look along a diode beam or at its reflections; collimating diodes above Class 2 is work for trained people under a laser safety officer ([[laser-safety-classes]]).

> [!key] A diode's emitter is micrometres across: its beam is wide, elliptical and astigmatic. A collimator of focal length $f$ makes radii of about $f\\theta$ in each axis, with residual divergence $w_0/f$; prisms or cylinder lenses round it off.
`,
  ideas: [
    'A laser diode beam has a fast axis (25–40° FWHM, thin emitter) and a slow axis (5–12°), so the beam is an ellipse.',
    'Datasheet angles are FWHM full angles; divide by 1.177 to get the 1/e² half-angle that the Gaussian formulas use.',
    'A collimator of focal length f makes beam radii of about f·θ in each axis, with residual divergence w₀/f.',
    'An anamorphic prism pair (each Brewster prism magnifies by n) or a cylinder-lens telescope circularizes the beam.',
    'The fast-axis Rayleigh range is about 1 µm, so the collimating lens must be placed within micrometres of its focus.'
  ],
  pitfalls: [
    'The 30° on the datasheet is the Gaussian half-angle — It is the full angle at half the peak intensity, so the 1/e² half-angle is 30°/1.177 = 25.5°. Using 30° as θ overstates the emitter size and the beam radius.',
    'One spherical lens collimates both axes perfectly — The two axes differ in angle and, in many diodes, in apparent source position (astigmatism). A single lens collimates one axis best and the other roughly; correction needs a cylinder lens or a collimator chosen for the diode.',
    'Collimated means parallel — The beam still diverges by the emitter radius over the focal length, 0.1–0.8 mrad here, and a few micrometres of defocus add far more than that.',
    'A diode beam can be made round with any circular aperture — An aperture only throws away the long axis of the ellipse. Circularizing without losing power takes prisms or cylinder lenses.'
  ],
  terms: [
    { term: 'Fast axis', def: 'The direction perpendicular to the junction of a laser diode. The emitting layer is thin, about a micrometre, so the light diverges quickly there: 20–40° FWHM.' },
    { term: 'Slow axis', def: 'The direction parallel to the junction. The emitting stripe is wider, so the beam diverges less, typically 5–12° FWHM for a single-mode diode.' },
    { term: 'Collimator', also: ['collimating lens', 'aspheric collimator'], def: 'A lens placed one focal length from a source so that its light leaves nearly parallel. For diodes it is usually a small aspheric lens of 2–12 mm focal length.' },
    { term: 'Anamorphic prism pair', also: ['beam circularizer'], def: 'Two prisms that magnify a beam in one direction only, used to turn the elliptical beam of a diode into a round one.' },
    { term: 'Residual divergence', def: 'The divergence left after collimation, equal to the emitter radius divided by the focal length of the collimator.' },
    { term: 'Astigmatism of a laser diode', def: 'The difference between the apparent positions of the two emitting points, one for each axis, of a diode; a few micrometres in index-guided diodes, more in gain-guided ones.' }
  ],
  formulas: [
    {
      name: 'FWHM angle to 1/e² half-angle',
      expr: 'th = fwhm/sqrt(2*ln(2))', tex: '\\theta = \\frac{\\theta_{\\mathrm{FWHM}}}{\\sqrt{2\\ln 2}}',
      vars: {
        th: { name: '1/e² half-angle', q: 'angle', unit: '°', tex: '\\theta' },
        fwhm: { name: 'datasheet FWHM full angle', q: 'angle', unit: '°', value: 30, tex: '\\theta_{\\mathrm{FWHM}}' }
      },
      solveFor: 'th',
      note: 'For a Gaussian far field; the divisor is 1.177.'
    },
    {
      name: 'Collimated beam radius',
      expr: 'w = f*th', tex: 'w \\approx f\\,\\theta',
      vars: {
        w: { name: 'collimated beam radius', q: 'length', unit: 'mm', tex: 'w' },
        f: { name: 'collimator focal length', q: 'length', unit: 'mm', value: 4.5, tex: 'f' },
        th: { name: '1/e² half-angle of the diode', q: 'angle', unit: '°', value: 25.5, min: 0, max: 60, tex: '\\theta' }
      },
      solveFor: 'w',
      note: 'Small-angle estimate; for a wide fast axis the exact value depends on the lens design (±10 % at 25°).'
    },
    {
      name: 'Residual divergence',
      expr: 'thr = we/f', tex: '\\theta_{res} = \\frac{w_e}{f}',
      vars: {
        thr: { name: 'residual half-angle divergence', q: 'angle', unit: 'mrad', tex: '\\theta_{res}' },
        we: { name: 'emitter waist radius', q: 'length', unit: 'µm', value: 1.75, tex: 'w_e' },
        f: { name: 'collimator focal length', q: 'length', unit: 'mm', value: 4.5, tex: 'f' }
      },
      solveFor: 'thr',
      note: 'The emitter waist radius is λ/(πθ) of the axis in question.'
    },
    {
      name: 'Magnification of one prism',
      expr: 'M = cos(asin(sin(ti)/n))/cos(ti)', tex: 'M = \\frac{\\cos\\theta_t}{\\cos\\theta_i} = \\frac{\\cos\\left(\\arcsin\\frac{\\sin\\theta_i}{n}\\right)}{\\cos\\theta_i}',
      vars: {
        M: { name: 'beam magnification in the plane of incidence', min: 1, tex: 'M' },
        ti: { name: 'angle of incidence on the prism', q: 'angle', unit: '°', value: 56.6, min: 0, max: 85, tex: '\\theta_i' },
        n: { name: 'refractive index of the prism', value: 1.5145, min: 1.2, max: 4, tex: 'n' }
      },
      solveFor: 'M',
      note: 'The beam leaves the prism at normal incidence. A pair of identical prisms gives M².'
    }
  ],
  examples: [
    {
      title: 'The beam behind a 4.5 mm collimator',
      q: 'A 650 nm diode has $30° \\times 8°$ (FWHM full angles). Its beam is collimated by an aspheric lens of $f = 4.5$ mm. What is the beam size, and how much must the slow axis be expanded to make it round?',
      steps: [
        { text: 'The 1/e² half-angles are the FWHM divided by 1.177:', tex: '\\theta_f = 25.5° = 0.445\\ \\mathrm{rad}, \\qquad \\theta_s = 6.8° = 0.119\\ \\mathrm{rad}' },
        { text: 'The beam radii after the lens are about $f\\theta$:', tex: 'w_f = 4.5 \\times 0.445 = 2.0\\ \\mathrm{mm}, \\qquad w_s = 4.5\\times 0.119 = 0.53\\ \\mathrm{mm}' },
        'The ratio is $2.0/0.53 = 3.75$.'
      ],
      a: 'An elliptical beam 4.0 mm by 1.07 mm (1/e² diameters); the slow axis needs expanding 3.75 times to make it round.'
    },
    {
      title: 'The prism angle for a 3.75 : 1 circularizer',
      q: 'A pair of identical N-BK7 prisms ($n = 1.5145$ at 650 nm), each used with the beam leaving normally, must expand one axis 3.75 times. At what angle of incidence must each prism be used, and what is lost to reflection?',
      steps: [
        { text: 'Each prism supplies $\\sqrt{3.75} = 1.94$. Solve $\\cos\\theta_t/\\cos\\theta_i = 1.94$ with $\\sin\\theta_t = \\sin\\theta_i/n$:', tex: '\\theta_i \\approx 65.6°' },
        'At 56.6° (Brewster) each prism would give only $n = 1.51$, a pair 2.29, so a steeper angle is needed.',
        'At 65.6° the reflectance for p-polarized light at the entry face is 1.5 %, so each prism passes 98.5 % there (the exit face meets the beam normally and is best antireflection coated).'
      ],
      a: 'About 65.6° per prism, losing about 1.5 % at each entry face for the p polarization that diodes usually emit.'
    }
  ],
  quiz: [
    { q: 'A diode datasheet gives a fast-axis divergence of 30° FWHM (full angle). What is the 1/e² half-angle for use in Gaussian formulas?', choices: ['15°', '25.5°', '30°', '35.3°'], a: 1, why: 'The FWHM full angle is 1.177 times the 1/e² half-angle, so the half-angle is $30°/1.177 = 25.5°$.' },
    { q: 'Which axis of a laser diode diverges faster, and why?', choices: ['The slow axis, because its emitter is wider', 'The fast axis, because its emitter is thinner', 'Both equally', 'It depends on the lens'], a: 1, why: 'Diffraction spreads light more the smaller the aperture: the thin direction of the stripe (about 1 µm) gives the large angle.' },
    { q: 'A collimator of longer focal length gives a larger beam with a smaller residual divergence.', a: true, why: 'The beam radius is about $f\\theta$ (grows with $f$) and the residual divergence $w_0/f$ falls as $f$ grows.' },
    { q: 'A diode with a 1/e² half-angle of 0.30 rad is collimated with an f = 8 mm lens. What is the beam radius in mm (small-angle estimate)?', answer: 2.4, unit: 'mm', why: '$w \\approx f\\theta = 8 \\times 0.30 = 2.4$ mm.' },
    { q: 'The collimating lens of a diode module is 10 µm away from its best position. What happens?', choices: ['Nothing noticeable: 10 µm is tiny', 'The beam is no longer collimated: it converges to a waist a few metres away and spreads', 'The beam becomes round', 'The wavelength shifts'], a: 1, why: 'The fast-axis Rayleigh range is about 1 µm, so a 10 µm shift moves the waist from infinity to about 2 m for a 4.5 mm lens.' }
  ],
  applications: [
    'Laser pointers, barcode scanners and levels, where a diode and a small aspheric collimator make the beam.',
    'Pumping solid-state lasers: the diode light is shaped and focused into the crystal.',
    'Lidar and range finders, which need a round, well-collimated beam from a pulsed diode.',
    'Optical disc pickups and printers, where the beam is collimated, circularized and refocused ([[optical-disc-pickups]], [[laser-printers]]).'
  ],
  history: 'The edge-emitting diode laser was demonstrated in 1962 and made to run continuously at room temperature in 1970. Its elliptical beam was a nuisance from the start: it led to the small moulded aspheric lenses, first developed for compact-disc players in the early 1980s, that still collimate most diodes.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) and the chapter on semiconductor photon sources.',
    'A. E. Siegman, *Lasers* — Gaussian beams through lenses, and the beams of diode lasers.',
    'E. Hecht, *Optics* — refraction at a plane surface and the magnification of a beam by a prism.'
  ],
  sim: 'gb-diode'
},

/* ================================================================ beam expanders */
{
  id: 'beam-expanders', parent: 'gaussian-beams', title: 'Beam expanders', level: 2,
  short: 'A beam expander is a telescope used backwards: two lenses with a common focus that make a laser beam M = f₂/f₁ times wider and, because the product of size and divergence is fixed, M times less divergent. That is why a beam is expanded before it travels far or is focused hard.',
  keywords: ['beam expander', 'Galilean', 'Keplerian', 'beam reducer', 'telescope', 'expansion ratio', 'collimation', 'zoom expander', 'reverse telescope', 'expand a laser beam', 'divergence reduction', 'long throw'],
  prereq: ['beam-quality-m-squared', 'beam-waist-and-divergence', 'combining-thin-lenses'],
  related: ['focusing-a-laser-beam', 'collimating-a-laser-diode', 'gaussian-beams-through-lenses', 'refracting-telescopes', 'cleaning-a-beam-with-a-pinhole', 'the-optical-invariant', 'scan-lenses-and-f-theta'],
  body: `
Many jobs need a beam wider than the laser makes it. A **beam expander** is a telescope used the wrong way round: light enters the small end and leaves the big end as a wider beam.

### Two lenses, one focus
Lens 1 of focal length $f_1$ and lens 2 of focal length $f_2$ are separated so that their focal points coincide. The beam radius changes by the **expansion ratio**

$$M = \\frac{f_2}{f_1}$$

and, since the product of waist radius and divergence cannot change ([[beam-quality-m-squared]]), the divergence falls by the same factor: $\\theta' = \\theta/M$. The Rayleigh range, $\\pi w_0^2/\\lambda$, grows by $M^2$.

### Two designs
| | Keplerian | Galilean |
|---|---|---|
| lens 1 | positive, $f_1 > 0$ | negative, $f_1 < 0$ |
| separation | $f_1 + f_2$ | $f_2 - \\lvert f_1\\rvert$ |
| internal focus | yes, a real one | none |
| for ×4 with $f_2 = 100$ mm | $f_1 = 25$ mm: 125 mm long | $f_1 = -25$ mm: 75 mm long |
| good for | spatial filtering with a pinhole at the focus | high power: no focus in the air to ionize it; shorter |

### Why expand
**To reach far.** A helium–neon beam with a 0.24 mm waist radius is 84 mm in radius after 100 m and 839 mm after a kilometre. Through a ×10 expander the same beam leaves 2.4 mm in radius and is only 8.5 mm after 100 m and 84 mm after 1 km; the Rayleigh range goes from 0.29 m to 29 m. The expanded beam is wider at first and narrower beyond a few metres.

**To focus small.** The focused spot is $w_0 \\propto 1/w$ ([[focusing-a-laser-beam]]): a ×5 expander in front of the lens makes the spot 5 times smaller.

**To spare the optics.** The irradiance on the optics falls as $M^2$, so mirrors and windows survive more power.

### Setting it up
A laser's waist is not exactly at the focus of lens 1, so the output is slightly convergent or divergent. A few tenths of a millimetre of change in the spacing, with the beam watched far away, collimates it; many expanders are focusable, and zoom expanders vary $M$ continuously (typically 2–8×). The clear aperture of the output lens must be at least three times the output beam radius to pass 98.9 % of the power; the glass must be good (a wavefront error of $\\lambda/10$ or better) because the whole beam is now larger.

### In reverse
With $M < 1$ the same device is a **beam reducer**, used to fit a beam into the small aperture of a modulator or a scanning mirror.

> [!key] An expander of ratio $M = f_2/f_1$ makes the beam $M$ times wider and $M$ times less divergent, and leaves $M^2$ and the beam parameter product unchanged. Expand before the beam must travel far or be focused tightly.
`,
  ideas: [
    'An expander is two lenses with a common focus; the beam radius grows by M = f₂/f₁.',
    'Divergence falls by M and the Rayleigh range grows by M², but M² and the beam parameter product are unchanged.',
    'A Keplerian expander has an internal focus (room for a pinhole), a Galilean one has none and is shorter.',
    'Expanding makes the beam wider at first and narrower beyond a crossover distance of a few metres for a small laser.',
    'A small change in the lens spacing collimates the output; zoom expanders vary M.'
  ],
  pitfalls: [
    'An expander improves the beam quality — It improves nothing but size and divergence: the product w₀θ, and with it M², is unchanged. Only a pinhole (and the loss of power) can improve the beam quality.',
    'A bigger expansion always gives a narrower beam at the target — Only beyond the crossover distance. Close in, the expanded beam is M times wider than the original; the expansion pays off over a distance of the order of the new Rayleigh range.',
    'The spacing is fixed by f₁ + f₂ — That sets the nominal value. The input beam is not a point source at the front focus, so the best spacing for a collimated output differs by a fraction of a millimetre and must be set while watching the far-field beam.',
    'The beam expander enlarges the light source — It only changes the size and angle of the beam. The étendue (area times solid angle) of the beam is unchanged by lossless optics.'
  ],
  terms: [
    { term: 'Beam expander', also: ['expander', 'laser beam expander'], def: 'A two-lens afocal telescope that increases the diameter of a collimated laser beam by a factor M and reduces its divergence by the same factor.' },
    { term: 'Expansion ratio', also: ['expander magnification', 'M', '×'], def: 'The ratio of output to input beam diameter, f₂/f₁ for the two lenses; written 5× or ×5.' },
    { term: 'Keplerian expander', def: 'A beam expander of two positive lenses with a real focus between them; its length is f₁ + f₂.' },
    { term: 'Galilean expander', def: 'A beam expander with a negative first lens and a positive second lens and no internal focus; its length is f₂ − |f₁|.' },
    { term: 'Beam reducer', def: 'A beam expander used in the opposite sense, to shrink a beam to fit a small aperture.' }
  ],
  formulas: [
    {
      name: 'Expansion ratio',
      expr: 'M = f2/f1', tex: 'M = \\frac{f_2}{f_1}',
      vars: {
        M: { name: 'expansion ratio', tex: 'M' },
        f1: { name: 'focal length of the input lens (magnitude)', q: 'length', unit: 'mm', value: 25, tex: 'f_1' },
        f2: { name: 'focal length of the output lens', q: 'length', unit: 'mm', value: 100, tex: 'f_2' }
      },
      solveFor: 'M',
      note: 'For both kinds of expander; for a Galilean one take the magnitude of f₁.',
      stories: { M: 'A beam expander has lenses of {f1} and {f2}. By what factor does it enlarge the beam?', f2: 'An expander with a {f1} input lens must enlarge the beam {M} times. What focal length does the output lens need?' }
    },
    {
      name: 'Divergence after the expander',
      expr: 'tho = thi/M', tex: '\\theta_{out} = \\frac{\\theta_{in}}{M}',
      vars: {
        tho: { name: 'output half-angle divergence', q: 'angle', unit: 'mrad', tex: '\\theta_{out}' },
        thi: { name: 'input half-angle divergence', q: 'angle', unit: 'mrad', value: 0.84, tex: '\\theta_{in}' },
        M: { name: 'expansion ratio', value: 10, min: 0.1, tex: 'M' }
      },
      solveFor: 'tho',
      note: 'The product of waist radius and divergence is conserved.'
    },
    {
      name: 'Length of a Keplerian expander',
      expr: 'L = f1 + f2', tex: 'L = f_1 + f_2',
      vars: {
        L: { name: 'distance between the lenses', q: 'length', unit: 'mm', tex: 'L' },
        f1: { name: 'focal length of lens 1', q: 'length', unit: 'mm', value: 25, tex: 'f_1' },
        f2: { name: 'focal length of lens 2', q: 'length', unit: 'mm', value: 100, tex: 'f_2' }
      },
      solveFor: 'L',
      note: 'Both lenses positive; the internal focus lies between them.'
    },
    {
      name: 'Length of a Galilean expander',
      expr: 'L = f2 - f1', tex: 'L = f_2 - \\lvert f_1\\rvert',
      vars: {
        L: { name: 'distance between the lenses', q: 'length', unit: 'mm', tex: 'L' },
        f1: { name: 'focal length of the negative lens (magnitude)', q: 'length', unit: 'mm', value: 25, tex: 'f_1' },
        f2: { name: 'focal length of the positive lens', q: 'length', unit: 'mm', value: 100, tex: 'f_2' }
      },
      solveFor: 'L',
      note: 'The negative lens comes first; there is no real focus inside.'
    }
  ],
  examples: [
    {
      title: 'A ×10 expander for a long throw',
      q: 'A helium–neon beam (632.8 nm, waist radius 0.24 mm, ideal) is sent through a ×10 expander. Compare its radius 1 km away with and without the expander.',
      steps: [
        { text: 'Without the expander the divergence is $\\theta = \\lambda/(\\pi w_0) = 0.84$ mrad, so far away:', tex: 'w(1\\ \\mathrm{km}) \\approx \\theta z = 0.84\\times10^{-3} \\times 1000 = 0.84\\ \\mathrm{m}' },
        { text: 'With the expander the waist radius is 2.4 mm and the divergence 0.084 mrad:', tex: 'w(1\\ \\mathrm{km}) \\approx 0.084\\times10^{-3} \\times 1000 = 84\\ \\mathrm{mm}' }
      ],
      a: 'The beam is 839 mm in radius without the expander and 84 mm with it: ten times narrower. (The ×10 beam is wider only within the first few metres.)'
    },
    {
      title: 'Choosing a Galilean expander',
      q: 'An 8× Galilean expander is built with a negative lens of $f_1 = -25$ mm. What focal length must the second lens have, how long is the expander, and how large must the second lens be for an input beam of radius 0.5 mm?',
      steps: [
        { text: 'The ratio gives the second focal length:', tex: 'f_2 = M\\,\\lvert f_1\\rvert = 8 \\times 25\\ \\mathrm{mm} = 200\\ \\mathrm{mm}' },
        { text: 'The lenses are separated by', tex: 'L = f_2 - \\lvert f_1\\rvert = 175\\ \\mathrm{mm}' },
        'The output radius is $8 \\times 0.5 = 4$ mm. To pass 98.9 % the aperture radius must be $1.5 \\times 4 = 6$ mm, so a 25 mm diameter lens is ample.'
      ],
      a: '$f_2 = 200$ mm, 175 mm between the lenses, and any lens of 12 mm clear diameter or more will do.'
    }
  ],
  quiz: [
    { q: 'A ×5 beam expander is placed in a laser beam. The divergence of the beam leaving it is…', choices: ['5 times larger', 'unchanged', '5 times smaller', '25 times smaller'], a: 2, why: 'The product of beam radius and divergence is conserved: if the radius grows 5 times, the divergence falls 5 times.' },
    { q: 'Which kind of beam expander has no internal focus?', choices: ['Keplerian', 'Galilean', 'Both have one', 'Neither: all expanders have a focus'], a: 1, why: 'A Galilean expander uses a negative first lens, so the light never comes to a real focus between the lenses.' },
    { q: 'A beam expander improves the beam quality factor $M^2$ of a laser.', a: false, why: 'It changes size and divergence by reciprocal factors and leaves $w_0\\theta$ and hence $M^2$ unchanged.' },
    { q: 'An expander has lenses of $f_1 = 30$ mm and $f_2 = 180$ mm. What is the expansion ratio?', answer: 6, why: '$M = f_2/f_1 = 180/30 = 6$.' },
    { q: 'A beam passes through a ×4 expander. Compared with the original beam, the Rayleigh range of the output is…', choices: ['4 times longer', '16 times longer', 'the same', '4 times shorter'], a: 1, why: '$z_R \\propto w_0^2$ for the same wavelength and $M^2$, and the waist radius has grown 4 times.' }
  ],
  applications: [
    'Long-range laser links, range finders and laser levels, where a small launch beam is expanded so that it stays narrow over the distance.',
    'Laser materials processing: an expander in front of a scanner or focusing lens sets the focused spot size.',
    'Laser scanners and galvanometer mirrors, where a beam reducer fits the beam to the mirror aperture ([[galvanometer-scanners]]).',
    'Spatial filters and laser microscopes, which expand the beam to fill the back aperture of an objective.'
  ],
  history: 'The Galilean form is the older: it is the arrangement of the telescope Galileo built in 1609, a positive objective with a negative eyepiece. The Keplerian form, with two positive lenses, was described by Johannes Kepler in 1611. Laser beam expanders are these two telescopes turned round, an idea that dates from the first lasers, whose narrow beams needed widening.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — transmission of Gaussian beams through optical components.',
    'A. E. Siegman, *Lasers* — beam expanders and the transformation of Gaussian beams by telescopes.',
    'W. J. Smith, *Modern Optical Engineering* — afocal systems and telescopes.'
  ],
  sim: 'gb-expander'
},

/* ================================================================ Gaussian beams through lenses */
{
  id: 'gaussian-beams-through-lenses', parent: 'gaussian-beams', title: 'Gaussian beams through lenses', level: 3,
  short: 'A lens does not image the waist of a laser beam to the place the lens equation gives. The new waist is found from Self\'s formulas: it lies nearer the lens, it is smaller or larger by a different factor, and it never lies farther than f + f²/(2z_R) behind it.',
  keywords: ['Gaussian beam through a lens', 'Self formula', 'waist transformation', 'complex beam parameter', 'q parameter', 'ABCD law', 'beam train', 'waist imaging', 'relay', 'Gaussian optics', 'thin lens', 'waist position'],
  prereq: ['rayleigh-range', 'the-thin-lens-equation', 'ray-transfer-matrices', 'focusing-a-laser-beam'],
  related: ['beam-expanders', 'collimating-a-laser-diode', 'beam-quality-m-squared', 'coupling-light-into-fibre', 'the-laser-cavity', 'cavity-stability', 'combining-thin-lenses'],
  body: `
An object far in front of a lens forms its image where the lens equation $1/s + 1/s' = 1/f$ says, and a ray diagram is enough. A laser beam does not obey it. A beam has a waist, not a point, and the waist is not imaged like an object.

### Self's formulas
Put the waist of a beam, of radius $w_0$ and Rayleigh range $z_R = \\pi w_0^2/\\lambda$, a distance $s$ in front of a thin lens of focal length $f$. Behind the lens there is a new waist of radius $w_0'$ at a distance $s'$:

$$w_0' = \\frac{w_0}{\\sqrt{(1 - s/f)^2 + (z_R/f)^2}}, \\qquad s' = f + \\frac{s - f}{(1 - s/f)^2 + (z_R/f)^2}$$

The new Rayleigh range is $m^2 z_R$ with $m = w_0'/w_0$. When $z_R$ is small beside $\\lvert s - f\\rvert$ the formulas shrink to the lens equation and the waist behaves like an object point. Otherwise they differ. For a waist of 0.1 mm at 632.8 nm ($z_R = 49.6$ mm) and a lens of $f = 100$ mm:

| waist to lens $s$ | geometric image $s'$ | Gaussian waist $s'$ | new waist radius $w_0'$ |
|---|---|---|---|
| 100 mm | at infinity | 100 mm | 201 µm |
| 150 mm | 300 mm | 200.7 mm | 142 µm |
| 200 mm | 200 mm | 180.2 mm | 89.6 µm |
| 300 mm | 150 mm | 147.1 mm | 48.5 µm |
| 500 mm | 125 mm | 124.6 mm | 24.8 µm |
| 1000 mm | 111 mm | 111 mm | 11.1 µm |

### Three consequences
1. **A waist at the front focal plane goes to the back focal plane** ($s = f$ gives $s' = f$), with radius $w_0' = \\lambda f/(\\pi w_0)$: the lens turns a small waist into a large collimated beam, and a big one into a tight one.
2. **The waist cannot be thrown far.** However you place the lens, $s' \\le f + f^2/(2z_R)$, reached at $s = f + z_R$. A lens in a beam never makes an image at infinity; at best it makes a long waist, which is what a collimated beam is.
3. **A collimated beam focuses in the focal plane**, $z_R \\gg f$, whatever $s$ is ([[focusing-a-laser-beam]]).

### Beam trains
The cleanest way to follow a beam through several lenses uses the complex beam parameter $q = z + i z_R$ (and $1/q = 1/R - i\\lambda/(\\pi w^2)$). Free space and lenses act on $q$ with the same ABCD matrices as on rays ([[ray-transfer-matrices]]): $q' = (Aq + B)/(Cq + D)$. A thin lens gives $1/q' = 1/q - 1/f$. The simulation below applies this lens by lens.

> [!key] A lens moves and rescales a beam waist by Self's formulas, not by the lens equation: the waist is nearer the lens than the geometric image and never farther than $f + f^2/(2z_R)$. The two agree only when the Rayleigh range is small.
`,
  ideas: [
    'The waist of a Gaussian beam is not imaged by the lens equation; Self\'s formulas give the new waist radius and position.',
    'A waist in the front focal plane goes to the back focal plane with radius λf/(πw₀).',
    'The new waist is never farther behind the lens than f + f²/(2z_R).',
    'The lens equation is the limit of Self\'s formulas when the Rayleigh range is small beside |s − f|.',
    'The complex beam parameter q = z + iz_R turns lenses and free space into ABCD matrices again.'
  ],
  pitfalls: [
    'The beam waist is imaged where a ray trace puts the image — Only when the Rayleigh range is small compared with |s − f|. Near the focus the geometric image runs off to infinity while the Gaussian waist stays within f + f²/(2z_R).',
    'Magnification is s′/s — For a beam the factor is w₀′/w₀ = 1/√((1 − s/f)² + (z_R/f)²), and it is never larger than f/z_R.',
    'A lens can bring a beam to a point — Its smallest radius is w₀′ and it never reaches zero; the Rayleigh range of the new waist is m²z_R.',
    'Moving the lens only moves the focus — It also changes the size of the waist: the position of the lens along the beam is a control of both the spot and its location.'
  ],
  terms: [
    { term: 'Self\'s formulas', also: ['Gaussian lens formulas', 'waist transformation'], def: 'The relations giving the radius and position of the waist of a Gaussian beam after a thin lens, in terms of the input waist, its distance from the lens and the focal length.' },
    { term: 'Complex beam parameter', also: ['q parameter', 'q'], def: 'The complex number q = z + iz_R, or 1/q = 1/R − iλ/(πw²), that describes a Gaussian beam at one plane. Lenses and free space transform it with the ABCD law.' },
    { term: 'ABCD law', def: 'The rule q′ = (Aq + B)/(Cq + D) by which a ray-transfer matrix changes the complex beam parameter of a Gaussian beam.' },
    { term: 'Beam train', def: 'A sequence of lenses and mirrors along which the radius and curvature of a Gaussian beam are followed one element at a time.' },
    { term: 'Waist relay', def: 'A pair of lenses that images one waist onto another of chosen size and place, as used to deliver a laser to a distant instrument.' }
  ],
  formulas: [
    {
      name: 'New waist radius behind a thin lens',
      expr: 'w0p = w0/sqrt((1 - s/f)^2 + (pi*w0^2/(lam*f))^2)', tex: 'w_0\' = \\frac{w_0}{\\sqrt{(1 - s/f)^2 + (\\pi w_0^2/(\\lambda f))^2}}',
      vars: {
        w0p: { name: 'radius of the new waist', q: 'length', unit: 'µm', tex: 'w_0\'' },
        w0: { name: 'radius of the input waist', q: 'length', unit: 'mm', value: 0.1, min: 0.001, max: 20, tex: 'w_0' },
        s: { name: 'distance from the waist to the lens', q: 'length', unit: 'mm', value: 150, min: 100, max: 5000, tex: 's' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 100, tex: 'f' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'w0p',
      note: 'Thin lens, real waist in front of it. The sliders start at s = 100 mm so that s is at least the focal length used here.'
    },
    {
      name: 'Position of the new waist',
      expr: 'sp = f + (s - f)/((1 - s/f)^2 + (pi*w0^2/(lam*f))^2)', tex: 's\' = f + \\frac{s - f}{(1 - s/f)^2 + (\\pi w_0^2/(\\lambda f))^2}',
      vars: {
        sp: { name: 'distance from the lens to the new waist', q: 'length', unit: 'mm', signed: true, tex: 's\'' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 100, tex: 'f' },
        s: { name: 'distance from the input waist to the lens', q: 'length', unit: 'mm', value: 150, min: 0, tex: 's' },
        w0: { name: 'radius of the input waist', q: 'length', unit: 'mm', value: 0.1, min: 0.001, max: 20, tex: 'w_0' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'sp',
      note: 'Positive s′ lies behind the lens; a negative value is a virtual waist in front of it.'
    },
    {
      name: 'Waist at the focal plane',
      expr: 'w0p = lam*f/(pi*w0)', tex: 'w_0\' = \\frac{\\lambda f}{\\pi w_0}',
      vars: {
        w0p: { name: 'radius of the new waist', q: 'length', unit: 'µm', tex: 'w_0\'' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 100, tex: 'f' },
        w0: { name: 'radius of the waist in the front focal plane', q: 'length', unit: 'mm', value: 1, tex: 'w_0' }
      },
      solveFor: 'w0p',
      note: 'The special case s = f: the new waist lies in the back focal plane.'
    }
  ],
  examples: [
    {
      title: 'A waist near the focus',
      q: 'A beam of 632.8 nm light has a waist of radius 0.1 mm. A lens of $f = 100$ mm is 150 mm from the waist. Where is the new waist, and how large? Compare with the lens equation.',
      steps: [
        { text: 'The Rayleigh range is $z_R = \\pi w_0^2/\\lambda = 49.6$ mm. The denominator of Self\'s formulas:', tex: '(1 - s/f)^2 + (z_R/f)^2 = 0.25 + 0.246 = 0.4965' },
        { text: 'The waist is magnified by $m = 1/\\sqrt{0.4965} = 1.419$, and sits at', tex: 's\' = f + (s - f)\\,m^2 = 100 + 50 \\times 2.014 = 200.7\\ \\mathrm{mm}' },
        'The lens equation would put an image at 300 mm with magnification 2.'
      ],
      a: 'A new waist of radius 142 µm at 200.7 mm behind the lens, 100 mm nearer than the ray-optics image and magnified 1.42 times instead of 2.'
    },
    {
      title: 'A waist at the focal plane',
      q: 'A helium–neon beam has a waist of radius 1 mm at the front focal plane of a lens of $f = 100$ mm. What is the beam after the lens?',
      steps: [
        { text: 'With $s = f$ the new waist is at the back focal plane, with radius', tex: 'w_0\' = \\frac{\\lambda f}{\\pi w_0} = \\frac{632.8\\times10^{-9}\\times0.1}{\\pi \\times 10^{-3}} = 20.1\\ \\mathrm{\\mu m}' },
        'It is a hundred times smaller than the input waist, and its Rayleigh range is only 2 mm.'
      ],
      a: 'A waist of radius 20 µm in the back focal plane: the lens has transformed a 1 mm beam into a tight focus and, used backwards, a 20 µm waist into a collimated 1 mm beam.'
    }
  ],
  quiz: [
    { q: 'A beam waist is placed in the front focal plane of a lens. Where is the new waist?', choices: ['At infinity', 'In the back focal plane', 'At twice the focal length', 'At the lens'], a: 1, why: 'For $s = f$, Self\'s formula gives $s\' = f$: the new waist lies in the back focal plane, with radius $\\lambda f/(\\pi w_0)$.' },
    { q: 'The waist of a Gaussian beam is always imaged at the distance given by the lens equation.', a: false, why: 'The two agree only when the Rayleigh range is small compared with $\\lvert s - f\\rvert$. Near the focus the geometric image goes to infinity, but the new waist never lies farther than $f + f^2/(2z_R)$.' },
    { q: 'What is the largest distance behind the lens at which a new waist can form, for $z_R = 49.6$ mm and $f = 100$ mm (in mm)?', answer: 200.7, unit: 'mm', why: '$s\'_{max} = f + f^2/(2z_R) = 100 + 10^4/(2\\times49.65) = 200.7$ mm, reached for $s = f + z_R$.' },
    { q: 'A waist of radius 1 mm sits in the front focal plane of a 100 mm lens (632.8 nm). The new waist radius is, in µm:', answer: 20.14, unit: 'µm', why: '$w_0\' = \\lambda f/(\\pi w_0) = 632.8\\times10^{-9}\\times0.1/(\\pi\\times10^{-3}) = 2.01\\times10^{-5}$ m.' },
    { q: 'Which quantity is unchanged by a lossless thin lens acting on a Gaussian beam?', choices: ['The waist radius', 'The waist position', 'The product of waist radius and divergence', 'The Rayleigh range'], a: 2, why: 'The new waist radius and its divergence change in opposite ways, and $w_0\\theta = M^2\\lambda/\\pi$ stays the same.' }
  ],
  applications: [
    'Designing the lenses that couple a laser into a fibre, where the waist must be matched in size and position ([[coupling-light-into-fibre]]).',
    'Relaying a laser beam through an instrument so that the beam waist falls on a scanning mirror or an objective\'s back aperture.',
    'Laser resonator design, where the mirrors and an intracavity lens set the waist and the mode ([[the-laser-cavity]]).',
    'Collimating and focusing light from small sources (LEDs, fibres, diodes), which behave like very small waists.'
  ],
  history: 'The complex beam parameter and its ABCD law came from Herwig Kogelnik in 1965, who showed that a Gaussian beam passes through lenses with the same matrices as a ray. The explicit formulas for the new waist behind a lens were set out by S. A. Self in 1983 in a paper that is still the usual reference.',
  sources: [
    'S. A. Self, "Focusing of spherical Gaussian beams", *Applied Optics* 22 (1983).',
    'H. Kogelnik and T. Li, "Laser beams and resonators", *Applied Optics* 5 (1966).',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics).'
  ],
  sim: 'gb-lens'
},

/* ================================================================ higher-order modes */
{
  id: 'higher-order-modes', parent: 'gaussian-beams', title: 'Higher-order modes', level: 3,
  short: 'The Gaussian beam is the lowest of a family of transverse patterns. Hermite–Gaussian modes have rectangular lobes, Laguerre–Gaussian modes are rings and doughnuts; they share the same spreading law but are wider by √(2m+1), so a beam made of them has M² above 1.',
  keywords: ['higher-order modes', 'TEM01', 'TEM10', 'TEM11', 'Hermite-Gaussian', 'Laguerre-Gaussian', 'doughnut beam', 'donut mode', 'vortex beam', 'orbital angular momentum', 'multimode beam', 'transverse modes', 'flat-top'],
  prereq: ['the-gaussian-beam', 'beam-quality-m-squared', 'laser-modes'],
  related: ['rayleigh-range', 'axicons-and-bessel-beams', 'flat-top-beam-shapers', 'single-mode-and-multimode-fibre', 'the-laser-cavity', 'spatial-light-modulators', 'cleaning-a-beam-with-a-pinhole'],
  body: `
The Gaussian beam is the lowest member of a family. A laser resonator, and a lens-like medium such as an optical fibre, supports a whole set of transverse patterns, each keeping its shape as it travels and differing in the number of dark lines or rings.

### Hermite–Gaussian modes
Where the geometry is rectangular the modes are the **Hermite–Gaussian** $\\mathrm{TEM}_{mn}$: $m$ dark lines cross the beam in $x$ and $n$ in $y$, with irradiance

$$I_{mn}(x,y) \\propto \\left[H_m\\!\\left(\\tfrac{\\sqrt2\\,x}{w}\\right) e^{-x^2/w^2}\\right]^2\\left[H_n\\!\\left(\\tfrac{\\sqrt2\\,y}{w}\\right) e^{-y^2/w^2}\\right]^2$$

with $H_m$ the Hermite polynomials. TEM₀₀ is the Gaussian; TEM₁₀ is two lobes, the peaks lying at $\\pm 0.71\\,w$ with a dark line between; TEM₁₁ is four lobes in a square; TEM₂₀ is three lobes in a row.

### Laguerre–Gaussian modes
Where the geometry is round the modes are the **Laguerre–Gaussian** $\\mathrm{LG}_{pl}$: $p$ dark rings and an azimuthal index $l$ that makes the phase wind through $2\\pi l$ around the axis. $\\mathrm{LG}_{01}$ is the **doughnut** (TEM₀₁*): zero on the axis, a bright ring of radius $w/\\sqrt2 = 0.71\\,w$. Its phase is a spiral; a beam with $l \\neq 0$ carries orbital angular momentum $l\\hbar$ per photon, which is used to turn microscopic particles in optical tweezers and, as the depletion beam, to sharpen the images of STED microscopy.

### Size and quality
A higher-order mode is wider and spreads faster, both by the same factor, so that the mode keeps its form while its beam quality worsens:

| mode | pattern | $M^2$ |
|---|---|---|
| TEM₀₀ | one spot | 1 |
| TEM₁₀ | two lobes | 3 × 1 |
| TEM₁₁ | four lobes | 3 × 3 |
| TEM₂₀ | three lobes | 5 × 1 |
| LG₀₁ | doughnut | 2 |
| LG₁₁ | a spot inside a ring | 4 |

In general $M^2 = 2m+1$ per axis for Hermite–Gaussian modes and $2p + \\lvert l\\rvert + 1$ for Laguerre–Gaussian ones. The second-moment radius of $\\mathrm{TEM}_{m0}$ is $w\\sqrt{2m+1}$.

### Same beam, different phase
Every mode has the same radius $w(z)$ and curvature as the Gaussian of the same waist, so its pattern simply scales as the beam spreads. They differ in Gouy phase, $(m+n+1)\\arctan(z/z_R)$: that is why in a laser cavity different modes resonate at slightly different frequencies ([[laser-modes]]).

### Multimode beams
A real beam is often a sum of many modes. Added without a fixed phase relation, their irradiances build a broad, flatter-topped, often speckled profile, with $M^2$ of 5 to 50 or more: the beam of a high-power laser or of a multimode fibre. For a true flat-top, see [[flat-top-beam-shapers]].

> [!key] A beam of any shape is a sum of modes of one family that all spread alike. Mode order raises the width and divergence by $\\sqrt{2m+1}$, so $M^2 = 2m+1$ (Hermite–Gaussian) or $2p+\\lvert l\\rvert+1$ (Laguerre–Gaussian).
`,
  ideas: [
    'Hermite–Gaussian modes TEMₘₙ have m and n dark lines; Laguerre–Gaussian modes LGₚₗ have p dark rings and a phase that winds l times around the axis.',
    'The doughnut LG₀₁ has zero irradiance on the axis and its bright ring at 0.71 w.',
    'A mode of order m has M² = 2m + 1 per axis; an LG mode has M² = 2p + |l| + 1.',
    'All the modes share the radius and wavefront curvature of the Gaussian, and differ in Gouy phase, (m + n + 1) arctan(z/z_R).',
    'A multimode beam is a sum of modes; its M² is above 1 and its profile is broad and often speckled.'
  ],
  pitfalls: [
    'A doughnut beam has a hole where there is no light, so it is safer — It has the same total power in a ring, still concentrated: the peak irradiance can be as high as in a Gaussian beam of the same power. Treat it as a beam of its full power.',
    'Higher-order modes are a different kind of beam — They obey the same law of spreading and the same ABCD matrices as the Gaussian; they are just wider by √(2m+1) at every plane and diverge faster by the same factor.',
    'TEM₀₁ and the doughnut are the same pattern — A single TEM₀₁ is two lobes. The doughnut TEM₀₁* is a sum of TEM₀₁ and TEM₁₀ a quarter-wave out of phase, or one LG₀₁ mode.',
    'M² = 3 means the beam contains exactly three modes — M² is a weighted average width. A single TEM₁₀ mode already has M² = 3 in one axis, while a mixture of many modes of different orders can have the same M².'
  ],
  terms: [
    { term: 'Transverse mode', also: ['TEMₘₙ', 'spatial mode'], def: 'A pattern of irradiance across a beam that keeps its shape as it propagates. The first two indices, m and n, count dark lines across the beam.' },
    { term: 'Hermite–Gaussian mode', also: ['HG mode', 'rectangular mode'], def: 'A transverse mode with a Hermite polynomial times a Gaussian in each direction, with m and n dark lines. TEM₀₀ is the Gaussian.' },
    { term: 'Laguerre–Gaussian mode', also: ['LG mode', 'LGₚₗ'], def: 'A transverse mode with circular symmetry: p dark rings and a phase winding l times around the axis.' },
    { term: 'Doughnut mode', also: ['donut mode', 'TEM₀₁*', 'LG₀₁'], def: 'A beam with a ring of light and a dark centre, equal to the Laguerre–Gaussian mode LG₀₁ (or two Hermite–Gaussian modes in quadrature).' },
    { term: 'Optical vortex', also: ['vortex beam'], def: 'A beam whose phase winds through 2π·l around a dark line on the axis. It carries orbital angular momentum lħ per photon.' },
    { term: 'Multimode beam', def: 'A beam that is a sum of several transverse modes, with a broad and often speckled profile and M² above 1.' }
  ],
  formulas: [
    {
      name: 'M² of a Laguerre–Gaussian mode',
      expr: 'Msq = 2*p + l + 1', tex: 'M^2 = 2p + \\lvert l\\rvert + 1',
      vars: {
        Msq: { name: 'beam quality factor', int: true, tex: 'M^2' },
        p: { name: 'number of dark rings', int: true, value: 0, min: 0, max: 20, tex: 'p' },
        l: { name: 'azimuthal index |l|', int: true, value: 1, min: 0, max: 20, tex: 'l' }
      },
      solveFor: 'Msq',
      note: 'For a Hermite–Gaussian mode the factors are 2m + 1 and 2n + 1 for the two axes.'
    },
    {
      name: 'Second-moment radius of a TEMₘ₀ mode',
      expr: 'W = w*sqrt(2*m + 1)', tex: 'W = w\\sqrt{2m + 1}',
      vars: {
        W: { name: 'second-moment radius in the x direction', q: 'length', unit: 'mm', tex: 'W' },
        w: { name: '1/e² radius of the Gaussian of the same waist', q: 'length', unit: 'mm', value: 0.5, tex: 'w' },
        m: { name: 'mode order in x', int: true, value: 1, min: 0, max: 30, tex: 'm' }
      },
      solveFor: 'W',
      note: 'The far-field divergence in x is larger by the same factor.'
    },
    {
      name: 'Ring radius of a doughnut-type mode',
      expr: 'rp = w*sqrt(l/2)', tex: 'r_{peak} = w\\sqrt{\\frac{l}{2}}',
      vars: {
        rp: { name: 'radius of the bright ring of LG₀ₗ', q: 'length', unit: 'mm', tex: 'r_{peak}' },
        w: { name: 'Gaussian beam radius of the mode', q: 'length', unit: 'mm', value: 1, tex: 'w' },
        l: { name: 'azimuthal index l (at least 1)', int: true, value: 1, min: 1, max: 30, tex: 'l' }
      },
      solveFor: 'rp',
      note: 'For p = 0 the irradiance peaks on a ring: l = 1 gives 0.71 w, l = 2 gives w.'
    }
  ],
  examples: [
    {
      title: 'A doughnut from a 1 mm beam',
      q: 'A doughnut beam (LG₀₁) is made from a Gaussian beam of $w = 1$ mm. Where is the ring, and what are its $M^2$ and second-moment radius?',
      steps: [
        { text: 'The ring of LG₀₁ peaks at', tex: 'r_{peak} = w\\sqrt{l/2} = 1\\ \\mathrm{mm}\\times\\sqrt{1/2} = 0.71\\ \\mathrm{mm}' },
        'The beam quality factor is $M^2 = 2p + l + 1 = 0 + 1 + 1 = 2$.',
        { text: 'The second-moment radius is larger by $\\sqrt{M^2}$:', tex: 'W = w\\sqrt{2} = 1.41\\ \\mathrm{mm}' }
      ],
      a: 'The ring peaks at 0.71 mm, $M^2 = 2$, and the second-moment radius is 1.41 mm; the doughnut diverges $\\sqrt2$ times as fast as the Gaussian of the same $w$.'
    },
    {
      title: 'A TEM₁₀ beam',
      q: 'A laser runs in TEM₁₀ with $w = 0.5$ mm. How far apart are its two lobes\' peaks, and what are its $M^2$ values and its divergence relative to a TEM₀₀ beam of the same waist?',
      steps: [
        'The lobes peak at $\\pm 0.71\\,w = \\pm 0.35$ mm, so they lie 0.71 mm apart.',
        'In $x$, $M^2_x = 2\\times1+1 = 3$; in $y$, $M^2_y = 1$.',
        { text: 'The second-moment radius in $x$ is', tex: 'W_x = w\\sqrt{3} = 0.87\\ \\mathrm{mm}' }
      ],
      a: 'Peaks 0.71 mm apart; $M^2 = 3 \\times 1$; the beam is $\\sqrt3$ wider and diverges 1.73 times faster in the $x$ direction than a TEM₀₀ beam with the same $w$.'
    }
  ],
  quiz: [
    { q: 'How many dark lines cross a TEM₂₁ beam in total (two directions)?', choices: ['1', '2', '3', '4'], a: 2, why: 'TEM$_{mn}$ has $m$ dark lines in one direction and $n$ in the other: $2 + 1 = 3$.' },
    { q: 'What is the $M^2$ of the doughnut mode LG₀₁?', choices: ['1', '2', '3', '4'], a: 1, why: '$M^2 = 2p + \\lvert l\\rvert + 1 = 0 + 1 + 1 = 2$.' },
    { q: 'A doughnut beam with a dark centre is eye-safe because the centre has no light.', a: false, why: 'The power is the same, concentrated in a ring whose peak irradiance can match a Gaussian beam of that power. Laser classes depend on the power.' },
    { q: 'What is the $M^2$ in the $x$ direction of a TEM₃₀ beam?', answer: 7, why: '$M^2_x = 2m + 1 = 2\\times3 + 1 = 7$.' },
    { q: 'All the modes of a family spread with the same law as the fundamental Gaussian beam of the same waist. What differs between them?', choices: ['Their wavelength', 'Their profile and Gouy phase, and so their width and divergence by √(2m+1)', 'Their Rayleigh range only', 'Nothing: the profile is the same'], a: 1, why: 'The width, curvature and divergence scale as $\\sqrt{2m+1}$ times the Gaussian, while the Gouy phase grows as $(m+n+1)\\arctan(z/z_R)$.' }
  ],
  applications: [
    'STED microscopy, where a doughnut-shaped beam switches off fluorescence around a central spot to sharpen the image.',
    'Optical tweezers, which use Gaussian and doughnut beams to trap or rotate microscopic particles.',
    'Fibre and laser design: telling whether a laser runs in TEM₀₀ and how many modes a multimode beam carries ([[single-mode-and-multimode-fibre]]).',
    'Laser cavity alignment, where a TEM₁₀ or TEM₀₁ pattern on the output shows a misaligned mirror.'
  ],
  history: 'The Hermite–Gaussian and Laguerre–Gaussian families were worked out for laser resonators in the early 1960s (Boyd and Gordon; Boyd and Kogelnik). Interest in the Laguerre–Gaussian beams with spiral phase returned in 1992, when Les Allen and colleagues showed that they carry orbital angular momentum.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on Hermite–Gaussian and Laguerre–Gaussian modes.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 3 (Beam Optics) — Hermite–Gaussian and Laguerre–Gaussian beams.',
    'L. Allen, M. W. Beijersbergen, R. J. C. Spreeuw and J. P. Woerdman, "Orbital angular momentum of light and the transformation of Laguerre–Gaussian laser modes", *Physical Review A* 45 (1992).'
  ],
  sim: 'gb-modes'
},

/* ================================================================ measuring a beam */
{
  id: 'measuring-a-beam', parent: 'gaussian-beams', title: 'Measuring a beam', level: 2,
  short: 'A beam\'s size has no single definition: knife-edge, slit and camera methods report different widths for anything but a Gaussian. The standard second-moment diameter (ISO 11146) and a caustic of at least ten planes give the waist, divergence and M².',
  keywords: ['beam profiler', 'knife edge', 'knife-edge measurement', 'beam width', 'D4 sigma', 'second moment', 'ISO 11146', 'measuring M squared', 'caustic', 'clip level', 'camera profiler', 'scanning slit', '10-90'],
  prereq: ['the-gaussian-beam', 'beam-quality-m-squared', 'rayleigh-range'],
  related: ['focusing-a-laser-beam', 'higher-order-modes', 'laser-power-and-energy-measures', 'the-point-spread-function', 'measuring-light', 'testing-surfaces-with-interferometers'],
  body: `
Every formula in this topic needs a beam size, a divergence or an $M^2$, and each of them has to be measured. The first thing to settle is what is being measured.

### The width is a choice
For a Gaussian beam of 1/e² radius $w$ every definition can be converted into another:

| definition | for a Gaussian beam |
|---|---|
| 1/e² diameter | $2w$ |
| 1/e diameter | $1.41\\,w$ |
| full width at half maximum | $1.18\\,w$ |
| diameter holding 86.5 % of the power | $2w$ |
| second-moment diameter $D4\\sigma$ | $2w$ |
| knife-edge distance, 10 % to 90 % | $1.28\\,w$ |
| knife-edge distance, 16 % to 84 % | $1.00\\,w$ |
| knife-edge distance, 5 % to 95 % | $1.64\\,w$ |

For any other beam they disagree, which is why a width must always come with its definition.

### Knife edge
Slide a sharp blade across the beam on a translation stage while a power meter records what passes. The record is an error-function curve, $P(x) = \\tfrac12[1 - \\mathrm{erf}(\\sqrt2\\,(x - x_0)/w)]$. Read off the positions where 10 % and 90 % pass: their distance is $1.28\\,w$, so $w = (x_{10} - x_{90})/1.28$. It needs only a blade and a meter, and gives one axis at a time.

### Slits and pinholes
A slit much narrower than the beam scans across it and records the profile itself (a pinhole gives the profile along one line). Commercial scanning-slit profilers spin a drum with slits to scan two axes, typically tens of times a second. The resolution is the slit width.

### Cameras
A bare camera sensor shows the whole profile at once. The beam must cover at least 10 to 20 pixels, usually after attenuation by neutral-density filters or reflection from wedges (direct beams saturate and can damage sensors); the cover glass is removed or tilted because it makes fringes. Background must be subtracted: the wings of a profile carry much weight in a second-moment calculation, and noise there inflates the width.

### Second moments and M²
The ISO 11146 standard defines the width through the intensity-weighted variance $\\sigma^2$ of the profile, $D4\\sigma = 4\\sigma$, which is $2w$ for a Gaussian. It is the one width whose square grows exactly as $D^2(z) = D_0^2 + \\Theta^2(z - z_0)^2$ along *any* beam. So measure the width in at least **ten planes**, about half within one Rayleigh range of the waist and half beyond two, and fit that parabola. A beam too wide to find its waist is first focused by a lens whose aberrations are small. Then

$$M^2 = \\frac{\\pi\\,D_0\\,\\Theta}{4\\lambda}$$

with $D_0$ the waist diameter and $\\Theta$ the full far-field angle.

> [!warn] Measuring a beam means putting a detector in it. Attenuate before a camera or a meter sees a strong beam, align at low power, and never look into the beam or at a reflection from the blade or the glass; see [[laser-safety-classes]].

> [!key] Quote a beam width with its definition: for a Gaussian, 10–90 % knife-edge distance $= 1.28\\,w$ and $D4\\sigma = 2w$. $M^2$ comes from a fit of the second-moment width over at least ten planes, near the waist and far beyond it.
`,
  ideas: [
    'For a Gaussian beam every width definition converts by a fixed factor; for any other beam they disagree.',
    'A knife-edge scan gives an error-function curve; the 10–90 % distance is 1.28 w and the 16–84 % distance is exactly w.',
    'Camera profilers need ten or more pixels across the beam, attenuation and background subtraction.',
    'The second-moment width D4σ is the one width whose square varies as a parabola along any beam.',
    'M² = πD₀Θ/(4λ) is found from a fit to at least ten planes, half near the waist and half beyond two Rayleigh ranges.'
  ],
  pitfalls: [
    'Beam diameter is a single number — It depends on the definition: for the same Gaussian beam the FWHM is 1.18 w, the 1/e² diameter 2w and the 10–90 % knife-edge distance 1.28 w. A number without its definition cannot be compared.',
    'The distance between the 10 % and 90 % knife-edge points is the beam diameter — It is 1.28 w, only 64 % of the 1/e² diameter 2w.',
    'M² needs only measurements near the waist — Close to the waist the width hardly changes, so the divergence is poorly known; measurements beyond two Rayleigh ranges fix it. Using all points on one side of the waist leaves the waist position poorly known.',
    'A camera can look straight into the beam — It saturates, and a strong beam can damage the sensor; the beam is attenuated first, and the background subtracted, because the wings of the profile weigh heavily in a second-moment width.'
  ],
  terms: [
    { term: 'Knife-edge method', also: ['knife-edge scan'], def: 'Measuring beam width by moving a sharp edge across the beam and recording the power that passes. For a Gaussian beam the record is an error-function curve.' },
    { term: 'Second-moment width', also: ['D4σ', 'four-sigma diameter'], def: 'The beam diameter defined as four times the standard deviation of the irradiance profile (ISO 11146). For a Gaussian beam it is the 1/e² diameter.' },
    { term: 'Clip level', def: 'The fraction of the power at which a knife-edge reading is taken, such as 10 % and 90 %. The conversion to beam radius depends on the levels chosen.' },
    { term: 'Beam profiler', also: ['beam profiling camera'], def: 'An instrument that records the irradiance across a beam, with a camera, a scanning slit or a pinhole, and computes widths, centroid and M².' },
    { term: 'Caustic', def: 'The set of beam widths along the axis; its hyperbolic shape gives the waist, the divergence and M².' }
  ],
  formulas: [
    {
      name: 'Beam radius from a knife-edge scan',
      expr: 'w = d/1.2816', tex: 'w = \\frac{d}{1.28}',
      vars: {
        w: { name: '1/e² radius of a Gaussian beam', q: 'length', unit: 'mm', tex: 'w' },
        d: { name: 'distance between the 10 % and 90 % points, x₁₀ − x₉₀', q: 'length', unit: 'mm', value: 1.28, tex: 'd' }
      },
      solveFor: 'w',
      note: 'For a Gaussian beam; for the 16 % and 84 % points the distance equals w.'
    },
    {
      name: 'Power passing a knife edge',
      expr: 'T = 0.5*(1 - erf(sqrt(2)*x/w))', tex: 'T = \\tfrac12\\left[1 - \\mathrm{erf}\\!\\left(\\frac{\\sqrt{2}\\,x}{w}\\right)\\right]',
      vars: {
        T: { name: 'fraction of the power that passes', q: 'ratio', tex: 'T' },
        x: { name: 'edge position measured from the beam centre', q: 'length', unit: 'mm', signed: true, value: 0.5, min: -5, max: 5, tex: 'x' },
        w: { name: '1/e² radius of the beam', q: 'length', unit: 'mm', value: 1, tex: 'w' }
      },
      solveFor: 'T',
      note: 'The blade starts clear of the beam and moves in, covering one side of it; x is its position from the beam centre, positive once it has passed the centre.'
    },
    {
      name: 'M² from the fitted caustic',
      expr: 'M2 = pi*D0*Th/(4*lam)', tex: 'M^2 = \\frac{\\pi D_0 \\Theta}{4\\lambda}',
      vars: {
        M2: { name: 'beam quality factor', tex: 'M^2', min: 1 },
        D0: { name: 'second-moment waist diameter', q: 'length', unit: 'mm', value: 0.4, tex: 'D_0' },
        Th: { name: 'full far-field divergence angle', q: 'angle', unit: 'mrad', value: 4.2, tex: '\\Theta' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' }
      },
      solveFor: 'M2',
      note: 'ISO 11146 form, using the second-moment waist diameter and the full angle.'
    }
  ],
  examples: [
    {
      title: 'A knife-edge scan',
      q: 'A razor blade moved across a beam passes 90 % of the power at $x = 2.31$ mm and 10 % at $x = 3.59$ mm. What are the 1/e² radius and diameter of the (Gaussian) beam?',
      steps: [
        'The distance between the points is $3.59 - 2.31 = 1.28$ mm.',
        { text: 'For a Gaussian beam this distance is $1.28\\,w$:', tex: 'w = \\frac{1.28\\ \\mathrm{mm}}{1.2816} = 0.999\\ \\mathrm{mm}' }
      ],
      a: 'A 1/e² radius of 1.0 mm and a 1/e² diameter of 2.0 mm (the FWHM would be 1.18 mm).'
    },
    {
      title: 'M² from a caustic',
      q: 'A caustic of a 1064 nm beam, fitted over ten planes, gives a second-moment waist diameter $D_0 = 0.40$ mm and a full far-field angle $\\Theta = 4.2$ mrad. What is $M^2$?',
      steps: [
        { text: 'Apply the ISO relation:', tex: 'M^2 = \\frac{\\pi D_0 \\Theta}{4\\lambda} = \\frac{\\pi\\times0.40\\times10^{-3}\\times 4.2\\times10^{-3}}{4\\times1.064\\times10^{-6}} = 1.24' }
      ],
      a: '$M^2 = 1.24$: a nearly diffraction-limited beam, which spreads 24 % faster than a perfect Gaussian of the same waist.'
    }
  ],
  quiz: [
    { q: 'A knife-edge scan of a Gaussian beam shows the 10 % and 90 % points 2.56 mm apart. What is the 1/e² radius?', choices: ['1.0 mm', '2.0 mm', '2.56 mm', '3.28 mm'], a: 1, why: '$w = 2.56/1.2816 = 2.0$ mm. The 10–90 % distance is $1.28\\,w$, not the diameter.' },
    { q: 'For a Gaussian beam the FWHM equals the 1/e² diameter.', a: false, why: 'The FWHM is $1.18\\,w$ and the 1/e² diameter is $2w$: the FWHM is 41 % smaller.' },
    { q: 'What is the second-moment diameter $D4\\sigma$, in mm, of a Gaussian beam with a 1/e² radius of 0.75 mm?', answer: 1.5, unit: 'mm', why: 'For a Gaussian beam $D4\\sigma = 2w = 1.5$ mm.' },
    { q: 'Which placement of measurement planes is best for fitting a caustic?', choices: ['All at the waist', 'All far beyond the waist on one side', 'About half within one Rayleigh range of the waist and half beyond two', 'Two planes, one on each side'], a: 2, why: 'Planes near the waist fix its size and place; planes beyond two Rayleigh ranges fix the divergence. ISO 11146 asks for at least ten planes spread in this way.' },
    { q: 'Why is the background subtracted before computing a second-moment width from a camera image?', choices: ['The wings of the profile weigh heavily, so noise there inflates the width', 'Cameras cannot measure the centre', 'To change the wavelength', 'To make the beam rounder'], a: 0, why: 'The second moment weights each pixel by its squared distance from the centre, so a faint background spread over the whole sensor adds a large false contribution.' }
  ],
  applications: [
    'Specifying and checking lasers: a datasheet beam diameter, divergence and M² all come from measurements made this way.',
    'Aligning and diagnosing a laser system: a camera profiler shows pointing drift, astigmatism and hot spots.',
    'Quality control of laser sources and focusing heads in materials processing, where the spot size must be known.',
    'Focusing lenses and fibre couplers, which are tested by measuring the caustic they produce.'
  ],
  history: 'The knife-edge scan, a razor blade and a power meter, has been in use since the first lasers. Siegman, Sasnett and Johnston showed in 1991 how the clip levels should be chosen. The second-moment definition and the ten-plane procedure were standardized in ISO 11146, first published in 1999.',
  sources: [
    'ISO 11146 (parts 1–3), *Lasers and laser-related equipment — Test methods for laser beam widths, divergence angles and beam propagation ratios*.',
    'A. E. Siegman, M. W. Sasnett and T. F. Johnston, "Choice of clip levels for beam width measurements using knife-edge techniques", *IEEE Journal of Quantum Electronics* 27 (1991).',
    'A. E. Siegman, "How to (maybe) measure laser beam quality", OSA Trends in Optics and Photonics (1998).'
  ],
  sim: 'gb-measure'
},

);
