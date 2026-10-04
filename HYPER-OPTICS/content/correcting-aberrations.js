/* HYPER-OPTICS · content/correcting-aberrations.js — the designer's toolbox.
 * Bending a lens, the achromatic doublet, cemented and air-spaced pairs, apochromats and ED glass, symmetry and the
 * stop, aspheres, the Cooke triplet, field flatteners, tolerances, ghosts and flare, and how a lens is designed.
 * Numbers in the pages come from the ray tracer behind the simulations (sims/correcting-aberrations.js).
 */
Hyper.add(

/* ================================================================ bending a lens */
{
  id: 'lens-bending', parent: 'correcting-aberrations', title: 'Bending a lens: the shape factor', level: 2,
  short: 'A thin lens of one focal length can take many shapes, from plano-convex through equiconvex to meniscus. The shape factor q says which. The focal length does not care; spherical aberration and coma do, and one shape — the best form — is several times better than the worst.',
  keywords: ['bending', 'shape factor', 'Coddington', 'best form', 'plano-convex', 'meniscus', 'equiconvex', 'curved side towards', 'lens orientation', 'minimum spherical aberration', 'q', 'which way round', 'singlet'],
  prereq: ['lensmakers-formula', 'spherical-aberration', 'lens-shapes-and-names'],
  related: ['coma', 'refraction-at-a-curved-surface', 'catalogue-lens-types', 'landscape-lens-and-meniscus', 'achromatic-doublet', 'aspheric-surfaces', 'the-seidel-sums', 'spot-diagrams-and-ray-fans'],
  body: `
Take a thin lens of focal length 100 mm. The [[lensmakers-formula|lensmaker's equation]] says that its focal length depends only on the *difference* of the two curvatures, $1/R_1 - 1/R_2$. So you may add the same curvature to both faces — **bend** the lens — and the focal length does not change. A biconvex lens, a plano-convex lens and a meniscus can all be the same lens as far as first-order optics goes. For real rays they are very different lenses, and choosing the shape is the cheapest correction a designer has.

### The shape factor
The amount of bending is measured by the **shape factor** (Coddington's $q$):

$$q = \\frac{R_2 + R_1}{R_2 - R_1}$$

with radii in the lens-design convention: light travels left to right and a radius is positive when its centre of curvature lies to the right. Then $q = 0$ is an equiconvex lens, $q = +1$ is plano-convex with the curved face towards the light, $q = -1$ is the same lens turned round, and $q > 1$ is a meniscus bulging towards the light. For a given $f$ and index $n$ the radii follow from $q$: $R_1 = 2f(n-1)/(q+1)$ and $R_2 = 2f(n-1)/(q-1)$.

### What the shape does to the rays
Every ray is bent twice, and a [[spherical-aberration|spherical]] surface bends steeply inclined rays too much. The error is smallest when the two surfaces share the bending of each ray fairly. The table is a traced N-BK7 singlet, $f = 100$ mm at f/5, for a distant object (light of 587.6 nm):

| Shape | $q$ | Edge ray misses the focus by | RMS blur at best focus | [[coma|Coma]] at 5° |
|---|---|---|---|---|
| plano-convex, flat face to the beam | −1 | 4.4 mm | 91 µm | −21 waves |
| equiconvex | 0 | 1.6 mm | 33 µm | −9.5 waves |
| **best form** | **0.74** | **1.0 mm** | **21 µm** | **−0.9 waves** |
| plano-convex, curved face to the beam | +1 | 1.1 mm | 23 µm | +2.1 waves |
| meniscus | 2.2 | 3.2 mm | 67 µm | +16 waves |

The Airy disc at f/5 has a radius of 3.4 µm, so even the best singlet is far from diffraction-limited at this aperture: bending only chooses the least bad. It becomes diffraction-limited on axis (in one colour) only when stopped down beyond about f/7, because spherical aberration falls as the fourth power of the aperture.

### The best form
For a distant object the third-order spherical aberration of a thin lens is smallest at

$$q_{\\text{best}} = \\frac{2\\,(n^2 - 1)}{n + 2}$$

which is 0.71 for $n = 1.5$, 0.74 for N-BK7 and 1.16 for N-SF11. A high-index lens wants to be more of a meniscus. Coma crosses zero close to the same shape, so the best-form singlet is nearly coma-free as well. Since $q \\approx 0.7$ is almost plano-convex, the practical rule for catalogue lenses is: **put the curved face towards the parallel beam** (a collimated laser, a distant scene). Turned round, the same lens has about four times the blur.

### Other conjugates
The best shape depends on where the object is. For a lens working at 1 : 1 the best shape is equiconvex by symmetry ($q = 0$): each face then does half the work for an object at $2f$ and an image at $2f$. In general the more strongly curved face looks towards the longer conjugate distance. Try it in the simulation by switching the object to 2*f*.

> [!key] Bending changes the shape of a lens but not its focal length, yet it changes its aberrations a great deal. For a distant object the best singlet has $q = 2(n^2-1)/(n+2) \\approx 0.7$: almost plano-convex, curved face towards the light.
`,
  ideas: [
    'Bending adds the same curvature to both faces: the focal length is unchanged, the aberrations are not.',
    'The shape factor q = (R₂ + R₁)/(R₂ − R₁): 0 equiconvex, +1 plano-convex curved side first, −1 the same lens turned round.',
    'For a distant object the least spherical aberration is at q = 2(n² − 1)/(n + 2): 0.74 for N-BK7, 1.16 for N-SF11.',
    'The rule: the curved face of a plano-convex lens goes towards the parallel beam, or towards the longer conjugate.',
    'At 1 : 1 imaging the equiconvex lens is the best shape, by symmetry.'
  ],
  pitfalls: [
    'A plano-convex lens works equally well either way round — At f/5 the blur of an N-BK7 lens turned flat side first is 91 µm against 23 µm the right way round. The curved face takes the big bend; it must face the collimated beam.',
    'The best shape is always the symmetric biconvex lens — That is true only for 1 : 1 imaging. For a distant object the best form is near q = 0.7, and it depends on the glass.',
    'Bending a lens changes its focal length — For a thin lens it does not; only the sum $1/R_1 - 1/R_2$ matters. (A thick lens changes slightly, which is why the radii of a designed lens are corrected for its thickness.)',
    'The best form is the same for every glass — It rises with the index: 0.65 for fused silica, 0.74 for N-BK7, 1.16 for N-SF11.'
  ],
  terms: [
    { term: 'Bending', also: ['lens bending'], def: 'Changing the shape of a lens by adding the same curvature to both faces, so that the focal length stays the same and the aberrations change.' },
    { term: 'Shape factor', also: ['Coddington shape factor', 'q', 'bending factor'], def: 'q = (R₂ + R₁)/(R₂ − R₁), a number that says how a thin lens is bent: 0 for equiconvex, +1 for plano-convex with the curved face first, −1 for the same lens reversed.' },
    { term: 'Best-form lens', also: ['minimum-aberration lens', 'best form'], def: 'The shape of a single lens that has the least third-order spherical aberration for a distant object: q = 2(n² − 1)/(n + 2).' },
    { term: 'Conjugates', also: ['conjugate distances', 'conjugate ratio'], def: 'A pair of object and image positions. A lens working at "infinite conjugate" images a distant object; at "1 : 1" the object and image are each two focal lengths away.' }
  ],
  formulas: [
    {
      name: 'Shape factor', expr: 'q = (R2 + R1)/(R2 - R1)', tex: 'q = \\frac{R_2 + R_1}{R_2 - R_1}',
      vars: {
        q: { name: 'shape factor', signed: true },
        R1: { name: 'radius of the first surface', q: 'length', unit: 'mm', value: 60, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the second surface', q: 'length', unit: 'mm', value: -360, signed: true, tex: 'R_2' }
      },
      solveFor: 'q', note: 'Radii in the lens-design convention: positive when the centre of curvature is to the right. A flat face has an infinite radius, which gives q = ±1.',
      stories: { q: 'A thin lens has a front radius of {R1} and a rear radius of {R2}. What is its shape factor?' }
    },
    {
      name: 'First radius from focal length and shape', expr: 'R1 = 2*f*(n - 1)/(q + 1)', tex: 'R_1 = \\frac{2f\\,(n-1)}{q + 1}',
      vars: {
        R1: { name: 'radius of the first surface', q: 'length', unit: 'mm', signed: true, tex: 'R_1' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        n: { name: 'refractive index', value: 1.5168, min: 1.2, max: 2.5 },
        q: { name: 'shape factor', value: 0.74, min: -3, max: 4, signed: true }
      },
      note: 'The second radius is R₂ = 2f(n − 1)/(q − 1). For a thin lens.',
      stories: { R1: 'What front radius gives a thin lens of glass index {n} and focal length {f} the shape factor {q}?' }
    },
    {
      name: 'Second radius from focal length and shape', expr: 'R2 = 2*f*(n - 1)/(q - 1)', tex: 'R_2 = \\frac{2f\\,(n-1)}{q - 1}',
      vars: {
        R2: { name: 'radius of the second surface', q: 'length', unit: 'mm', signed: true, tex: 'R_2' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        n: { name: 'refractive index', value: 1.5168, min: 1.2, max: 2.5 },
        q: { name: 'shape factor', value: 0.74, min: -3, max: 4, signed: true }
      },
      note: 'A flat second face (R₂ infinite) is q = +1.'
    },
    {
      name: 'Best-form shape for a distant object', expr: 'qb = 2*(n^2 - 1)/(n + 2)', tex: 'q_{\\text{best}} = \\frac{2\\,(n^2 - 1)}{n + 2}',
      vars: {
        qb: { name: 'best-form shape factor', tex: 'q_{\\text{best}}' },
        n: { name: 'refractive index', value: 1.5168, min: 1.2, max: 3 }
      },
      note: 'Least third-order spherical aberration, thin lens, object at infinity.',
      stories: { qb: 'Which shape factor gives the least spherical aberration for a thin lens of index {n} imaging a distant object?', n: 'A lens of best form has shape factor {qb}. What is its refractive index?' }
    }
  ],
  examples: [
    {
      title: 'Which way round?',
      q: 'A plano-convex N-BK7 lens is to focus a collimated beam with a focal length of 100 mm. What is the radius of its curved face, and which way should it face?',
      steps: [
        { text: 'A plano-convex lens has one flat face, so $q = +1$ with the curved face first or $-1$ with it last. The focal length is set by the curved face alone:', tex: 'f = \\frac{R}{n - 1} \\quad\\Rightarrow\\quad R = (n-1)\\,f = 0.5168 \\times 100\\ \\mathrm{mm} = 51.7\\ \\mathrm{mm}' },
        'The ray-traced blur at f/5 is 23 µm with the curved face towards the beam ($q = +1$) and 91 µm the other way round ($q = -1$).'
      ],
      a: 'R = 51.7 mm, with the curved face towards the collimated beam: four times less blur than the reversed lens.'
    },
    {
      title: 'The radii of a best-form lens',
      q: 'Find the radii of a thin best-form N-BK7 lens of $f = 100$ mm and check them.',
      steps: [
        { text: 'The best shape is', tex: 'q = \\frac{2(1.5168^2 - 1)}{1.5168 + 2} = 0.74' },
        { text: 'Then', tex: 'R_1 = \\frac{2 \\times 100 \\times 0.5168}{1.74} = 59.4\\ \\mathrm{mm}, \\qquad R_2 = \\frac{2 \\times 100 \\times 0.5168}{-0.26} = -397.5\\ \\mathrm{mm}' },
        { text: 'Check with the lensmaker\'s equation:', tex: '\\frac{1}{f} = 0.5168\\left(\\frac{1}{59.4} + \\frac{1}{397.5}\\right) = 0.0100\\ \\mathrm{mm^{-1}}' }
      ],
      a: 'R₁ = +59.4 mm and R₂ = −397.5 mm: a weak meniscus, almost plano-convex.'
    }
  ],
  quiz: [
    { q: 'A plano-convex lens is used to focus a collimated laser beam to a small spot. Which way round should it face?', choices: ['Curved face towards the laser', 'Flat face towards the laser', 'It makes no difference at any f-number', 'Whichever face is cleaner'], a: 0, why: 'The curved face must take the big bend. With the flat face first the first refraction is a gentle one and the second face takes all the bending at a steep angle: about four times the spherical aberration blur.' },
    { q: 'Bending a thin lens (changing $q$ at fixed $n$ and $f$) leaves its focal length unchanged.', a: true, why: 'The focal length depends on $1/R_1 - 1/R_2$. Bending adds the same curvature to both, so the difference is unchanged; only $1/R_1 + 1/R_2$ changes.' },
    { q: 'A thin lens has $R_1 = +60$ mm and $R_2 = -360$ mm. What is its shape factor?', answer: 0.714, why: '$q = (R_2 + R_1)/(R_2 - R_1) = (-360 + 60)/(-360 - 60) = 0.714$: close to the best form for glass of index 1.5.' },
    { q: 'Going from N-BK7 ($n = 1.52$) to N-SF11 ($n = 1.78$), the best-form shape of a singlet for a distant object…', choices: ['becomes more of a meniscus ($q$ larger)', 'becomes more biconvex ($q$ smaller)', 'stays exactly the same', 'moves to $q = 0$'], a: 0, why: '$q = 2(n^2-1)/(n+2)$ rises with the index: 0.74 for N-BK7 and 1.16 for N-SF11.' },
    { q: 'A singlet images an object at 1 : 1 (object and image each $2f$ away). Which shape has the least spherical aberration?', choices: ['Equiconvex', 'Plano-convex, curved face first', 'Plano-convex, flat face first', 'A meniscus with $q = 2$'], a: 0, why: 'By symmetry the equiconvex lens shares the bending equally between its two faces at equal conjugates: $q = 0$.' }
  ],
  applications: [
    'Catalogue plano-convex lenses: the advice "curved side towards the source" is the best-form rule, and it is why plano-convex lenses are the cheap, good choice for focusing and collimating.',
    'Spectacle lenses are menisci with the convex side outwards, so that the eye, looking through the edge of the lens, sees fewer aberrations.',
    'The landscape lens of early photography was one meniscus with the stop in front; the shapes of the elements of every camera lens are bent for the same reason.',
    'Laser line optics: a best-form singlet reaches the diffraction limit on axis at slow f-numbers, at a fraction of the cost of a doublet.',
    'Relay and 1 : 1 imaging systems use symmetric (equiconvex or mirror-image) lenses for exactly this reason.'
  ],
  history: 'The shape factor is named after Henry Coddington, whose treatise on the reflection and refraction of light (1829) worked out how the aberrations of a single lens depend on its shape and on the distance of the object. The meniscus form for spectacle lenses was patented by William Hyde Wollaston in 1804.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the thin-lens aberrations as functions of the shape factor, and the best-form lens.',
    'W. J. Smith, *Modern Optical Engineering* — the singlet lens: the dependence of its aberrations on shape and conjugates.',
    'E. Hecht, *Optics* — the section on aberrations in the chapter "More on Geometrical Optics".'
  ],
  sim: 'ca-lens-bending'
},

/* ================================================================ the achromatic doublet */
{
  id: 'achromatic-doublet', parent: 'correcting-aberrations', title: 'The achromatic doublet', level: 2,
  short: 'A positive crown lens cemented to a weaker negative flint lens: the flint cancels the crown\'s colour error but only part of its power, so the pair still focuses. Two wavelengths come to one focus, and with a good choice of shape the spherical aberration is nearly gone too.',
  keywords: ['achromat', 'achromatic doublet', 'crown', 'flint', 'chromatic correction', 'Abbe number', 'cemented doublet', 'secondary spectrum', 'Dollond', 'two colours', 'F and C', 'achromatic condition'],
  prereq: ['axial-chromatic-aberration', 'the-abbe-number-and-glass-map', 'combining-thin-lenses'],
  related: ['dispersion-and-the-spectrum', 'optical-glass', 'apochromats-and-ed-glass', 'cemented-and-air-spaced-doublets', 'lens-bending', 'catalogue-lens-types', 'refracting-telescopes'],
  body: `
A single lens bends blue light more than red, so it has a different focal length for each colour. The spread is predictable: the focus for blue (the F line, 486 nm) and for red (the C line, 656 nm) are separated by

$$\\Delta z = \\frac{f}{V}$$

where $V$ is the [[the-abbe-number-and-glass-map|Abbe number]] of the glass. For N-BK7 ($V = 64.2$) and $f = 100$ mm that is 1.56 mm; the focus for 436 nm lies 1.9 mm from the one for 588 nm. At f/5 the quarter-wave depth of focus is only ±0.03 mm, so a singlet is hopelessly out of focus in at least one colour. Nothing in the shape of a single lens can cure this; it takes two glasses.

### The idea
Put a positive **crown** lens (low dispersion, high $V$) against a negative **flint** lens (high dispersion, low $V$). The flint's dispersion is larger *per dioptre*, so a weak negative flint can cancel the colour spread of a strong positive crown, and the pair keeps some positive power. For total power $\\varphi$ the powers must be

$$\\varphi_1 = \\varphi\\,\\frac{V_1}{V_1 - V_2}, \\qquad \\varphi_2 = -\\varphi\\,\\frac{V_2}{V_1 - V_2}$$

so that $\\varphi_1/V_1 + \\varphi_2/V_2 = 0$ and the colour errors of the two lenses cancel while $\\varphi_1 + \\varphi_2 = \\varphi$.

| Pair (total 10 D, $f = 100$ mm) | $V_1$ · $V_2$ | Crown power | Flint power |
|---|---|---|---|
| N-BK7 + F2 | 64.2 · 36.4 | +23.1 D | −13.1 D |
| N-BK7 + N-SF5 | 64.2 · 32.3 | +20.1 D | −10.1 D |
| N-BK7 + N-SF11 | 64.2 · 25.7 | +16.7 D | −6.7 D |

The further apart the Abbe numbers, the gentler the two lenses. A pair of glasses with nearly equal $V$ needs enormous, nearly cancelling powers, which is why catalogues pair a crown with a dense flint.

### What is left
The focus for F and C now coincides: in the simulation the 486 nm and 656 nm foci of the N-BK7 + N-SF5 doublet are the same. But the other colours are not at that focus. The focus shift against wavelength is a shallow parabola: for $f = 100$ mm it is 0.25 mm at 436 nm, 0.05 mm at 486 and 656 nm, and −0.01 mm at 546 nm, against 1.9 mm for the singlet at 436 nm. That leftover is the **secondary spectrum**, and it exists because the two glasses disperse the blue and red ends of the spectrum in slightly different proportions (see [[apochromats-and-ed-glass]]). For a visual instrument it is small — the eye is least sensitive at the ends — but it shows as a violet fringe on bright edges.

### A bonus: spherical aberration
The doublet has three surfaces and so a free shape: its **bend** can be chosen so that the third-order [[spherical-aberration|spherical aberration]] is also zero, or nearly. A catalogue doublet of $f = 100$ mm and 25 mm diameter (f/4), with N-BK7 and N-SF5 elements, has radii of about +62.8, −45.7 and −128.2 mm, and an RMS blur on axis of 2.4 µm, smaller than the 2.8 µm radius of the Airy disc, where a best-form singlet of the same aperture has 44 µm. That is why almost every lens that has to work well is made from doublets, and why even the cheapest [[cooke-triplet|triplet]] hides one inside.

> [!key] An achromat pairs a strong positive crown with a weaker negative flint so that $\\varphi_1/V_1 + \\varphi_2/V_2 = 0$: two colours share one focus. What remains is a shallow secondary spectrum, and the extra surface can also remove spherical aberration.
`,
  ideas: [
    'A singlet\'s focus shifts between blue (F) and red (C) light by f/V: 1.56 mm for N-BK7 at f = 100 mm.',
    'An achromat balances a positive crown against a negative flint so that φ₁/V₁ + φ₂/V₂ = 0; φ₁ = φ·V₁/(V₁ − V₂) and φ₂ = −φ·V₂/(V₁ − V₂).',
    'The glasses must differ in Abbe number: the greater the difference, the weaker the two lenses and the easier the design.',
    'Two colours come to one focus; the others do not. The residual curve of focus against wavelength is the secondary spectrum.',
    'The cemented doublet\'s shape (bend) can also zero the spherical aberration, which is why doublets are everywhere.'
  ],
  pitfalls: [
    'An achromat has no chromatic aberration — Two wavelengths agree; the rest are within a shallow parabola of focus shift, the secondary spectrum. At f = 100 mm a N-BK7 + N-SF5 doublet still has 0.25 mm of focus shift at 436 nm.',
    'The flint lens is just there to add negative power — Its job is to supply dispersion: a weak flint carries as much colour spread as the strong crown. The pair keeps net positive power because the crown is stronger.',
    'Any two glasses will do — They must differ in Abbe number, and by enough. Glasses with similar $V$ need huge opposing powers, which destroy the other aberrations.',
    'An achromat is corrected for white light — It is corrected at two chosen wavelengths (usually F and C, for the eye). A camera or a violet-sensitive system needs a different pair of wavelengths, or an apochromat.'
  ],
  terms: [
    { term: 'Achromatic doublet', also: ['achromat', 'achromatic lens'], def: 'A lens made of two elements of different glass, usually a positive crown and a negative flint, designed so that two wavelengths come to the same focus.' },
    { term: 'Achromatic condition', def: 'φ₁/V₁ + φ₂/V₂ = 0 for two thin lenses in contact: the colour spreads of the two elements cancel.' },
    { term: 'Secondary spectrum', def: 'The chromatic focus error that remains in an achromat at wavelengths other than the two it was corrected for, because glasses do not disperse in exactly the same proportions. It is roughly f/2000 between the F/C focus and the d focus.' },
    { term: 'Spherochromatism', def: 'The change of spherical aberration with wavelength. It limits fast achromats, which are corrected for spherical aberration at one wavelength only.' }
  ],
  formulas: [
    {
      name: 'Colour spread of a singlet', expr: 'dz = f/V', tex: '\\Delta z = \\frac{f}{V}',
      vars: {
        dz: { name: 'distance between the F and C foci', q: 'length', unit: 'mm', tex: '\\Delta z' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        V: { name: 'Abbe number', value: 64.2, min: 15, max: 100 }
      },
      note: 'Thin lens, light of 486 nm (F) and 656 nm (C).',
      stories: { dz: 'A {f} singlet is made of glass with an Abbe number of {V}. How far apart do the blue and red foci lie?' }
    },
    {
      name: 'Power of the crown lens', expr: 'P1 = P*V1/(V1 - V2)', tex: '\\varphi_1 = \\varphi\\,\\frac{V_1}{V_1 - V_2}',
      vars: {
        P1: { name: 'power of the crown lens', q: 'optpower', unit: 'D', signed: true, tex: '\\varphi_1' },
        P: { name: 'power of the doublet', q: 'optpower', unit: 'D', value: 10, tex: '\\varphi' },
        V1: { name: 'Abbe number of the crown', value: 64.2, min: 15, max: 100 },
        V2: { name: 'Abbe number of the flint', value: 32.3, min: 15, max: 100 }
      },
      note: 'Thin lenses in contact. Powers in dioptres: a focal length of 100 mm is 10 D.',
      stories: { P1: 'A doublet of {P} total power is made from a crown of Abbe number {V1} and a flint of {V2}. What power does the crown carry?' }
    },
    {
      name: 'Power of the flint lens', expr: 'P2 = -P*V2/(V1 - V2)', tex: '\\varphi_2 = -\\varphi\\,\\frac{V_2}{V_1 - V_2}',
      vars: {
        P2: { name: 'power of the flint lens', q: 'optpower', unit: 'D', signed: true, tex: '\\varphi_2' },
        P: { name: 'power of the doublet', q: 'optpower', unit: 'D', value: 10, tex: '\\varphi' },
        V1: { name: 'Abbe number of the crown', value: 64.2, min: 15, max: 100 },
        V2: { name: 'Abbe number of the flint', value: 32.3, min: 15, max: 100 }
      },
      note: 'Negative: the flint is a diverging lens.'
    },
    {
      name: 'The achromatic condition', expr: 'P1/V1 + P2/V2 = 0', tex: '\\frac{\\varphi_1}{V_1} + \\frac{\\varphi_2}{V_2} = 0',
      vars: {
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 20.1, signed: true, tex: '\\varphi_1' },
        P2: { name: 'power of the second lens', q: 'optpower', unit: 'D', signed: true, tex: '\\varphi_2' },
        V1: { name: 'Abbe number of the first glass', value: 64.2, min: 15, max: 100 },
        V2: { name: 'Abbe number of the second glass', value: 32.3, min: 15, max: 100 }
      },
      solveFor: 'P2', note: 'The colour spread of each lens is proportional to its power divided by its Abbe number; the two must cancel.'
    }
  ],
  examples: [
    {
      title: 'A 200 mm doublet',
      q: 'Design the powers of a thin achromatic doublet of focal length 200 mm from N-BK7 ($V_1 = 64.2$) and F2 ($V_2 = 36.4$).',
      steps: [
        'The total power is $\\varphi = 1/0.2\\ \\mathrm{m} = 5$ D, and $V_1 - V_2 = 27.8$.',
        { text: 'The crown and flint powers:', tex: '\\varphi_1 = 5 \\times \\frac{64.2}{27.8} = +11.5\\ \\mathrm{D}, \\qquad \\varphi_2 = -5 \\times \\frac{36.4}{27.8} = -6.5\\ \\mathrm{D}' },
        'In focal lengths: the crown is +86.7 mm and the flint −152.9 mm. Check: $11.5 - 6.5 = 5$ D, and $11.5/64.2 - 6.5/36.4 = 0$.'
      ],
      a: 'A +11.5 D crown with a −6.5 D flint. Each lens is much stronger than the doublet — the price of cancelling the colour.'
    },
    {
      title: 'Is the singlet good enough?',
      q: 'An f = 100 mm N-BK7 singlet is used at f/5 in light of 486 to 656 nm. Compare its colour spread with the depth of focus.',
      steps: [
        { text: 'The colour spread is', tex: '\\Delta z = f/V = 100/64.2 = 1.56\\ \\mathrm{mm}' },
        { text: 'The quarter-wave depth of focus at 550 nm and f/5 is', tex: '\\pm 2\\lambda N^2 = \\pm 2 \\times 0.00055 \\times 25 = \\pm 0.0275\\ \\mathrm{mm}' },
        'The spread is 28 times the whole depth of focus (0.055 mm): at least one colour is badly out of focus. The doublet of the simulation brings F and C together, and its largest remaining shift in the visible is about 0.25 mm at 436 nm — still much more than 0.055 mm in the violet, but the eye hardly notices it.'
      ],
      a: 'Far outside: a singlet cannot be sharp in two colours at once, and an achromat is the first lens that can.'
    }
  ],
  quiz: [
    { q: 'In an achromatic doublet of a crown and a flint, which lens is the stronger, and what are the signs?', choices: ['The crown is stronger and positive; the flint weaker and negative', 'The flint is stronger and positive; the crown weaker and negative', 'They have equal and opposite powers', 'Both are positive'], a: 0, why: '$\\varphi_1 = \\varphi V_1/(V_1 - V_2)$ and $\\varphi_2 = -\\varphi V_2/(V_1-V_2)$: the crown has the larger $V$, so the larger positive power.' },
    { q: 'A thin achromat of total power 10 D is made from glasses with $V_1 = 64$ and $V_2 = 32$. What power does the crown lens carry, in dioptres?', answer: 20, why: '$\\varphi_1 = 10 \\times 64/(64 - 32) = 20$ D and $\\varphi_2 = -10$ D. They sum to 10 D and $20/64 - 10/32 = 0$.' },
    { q: 'How far apart are the F and C foci of a singlet of focal length 200 mm made of glass with $V = 60$, in millimetres?', answer: 3.33, why: '$\\Delta z = f/V = 200/60 = 3.33$ mm.' },
    { q: 'Why does an achromatic doublet still show a violet fringe on a high-contrast edge?', choices: ['The two glasses disperse the spectrum in slightly different proportions, so the focus for wavelengths other than the two chosen ones is still off (the secondary spectrum)', 'The flint lens absorbs red light', 'Spherical aberration is larger in the doublet', 'The cement scatters blue light'], a: 0, why: 'Only two wavelengths are brought together. The focus shift against wavelength is a parabola, which leaves the violet end about 0.25 mm away from the others for an f = 100 mm doublet.' },
    { q: 'Two glasses with almost equal Abbe numbers make a good achromat, because their dispersions then cancel exactly.', a: false, why: 'The opposite: with $V_1 \\approx V_2$ the formulas ask for enormous opposing powers. The glasses must differ widely in $V$ for the lenses to be of reasonable strength.' }
  ],
  applications: [
    'Catalogue achromats, the workhorse of laboratory optics: focusing, collimating, relaying, and imaging in several colours.',
    'The objective of a refracting telescope or a binocular: a large crown-flint pair that gives sharp images across the visible.',
    'Camera lenses, which are built from several doublets, or from elements doing the same job.',
    'Eyepieces and microscope objectives of moderate quality ("achromats", as opposed to apochromats).',
    'Laser systems using two or three wavelengths, where a singlet\'s focus would move with colour.'
  ],
  history: 'Newton concluded from his prism experiments of the 1660s that refraction without colour was impossible, and built a reflecting telescope instead. Chester Moor Hall made achromatic lenses in the 1730s, apparently without publishing; John Dollond rediscovered the combination of crown and flint glass and patented it in 1758. The achromatic refractor then replaced the long, thin "aerial" telescopes of the seventeenth century.',
  sources: [
    'E. Hecht, *Optics* — chromatic aberration and the achromatic doublet, in the chapter "More on Geometrical Optics".',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the thin-lens achromat and the choice of glasses.',
    'W. J. Smith, *Modern Optical Engineering* — chromatic correction and secondary spectrum.',
    'Schott Technical Information TIE-29, *Refractive Index and Dispersion* — the Abbe number and partial dispersion.'
  ],
  sim: 'ca-achromat'
},

/* ================================================================ cemented and air-spaced doublets */
{
  id: 'cemented-and-air-spaced-doublets', parent: 'correcting-aberrations', title: 'Cemented and air-spaced doublets', level: 2,
  short: 'The same crown and flint can be glued together or held a small distance apart. Cementing is compact, robust and loses no light at the joint, but it fixes the shapes of the two faces to one another. An air gap frees one more surface, so spherical aberration and coma can both be corrected, and it suits large and high-power lenses.',
  keywords: ['cemented doublet', 'air-spaced doublet', 'cement', 'optical cement', 'Fraunhofer', 'Steinheil', 'Gauss doublet', 'air gap', 'contact', 'laser doublet', 'degrees of freedom', 'crown first', 'flint first'],
  prereq: ['achromatic-doublet', 'spherical-aberration', 'coma'],
  related: ['lens-bending', 'cooke-triplet', 'double-gauss', 'fresnel-reflection', 'ghosts-flare-and-stray-light', 'thermal-effects-in-optics', 'antireflection-coatings', 'refracting-telescopes'],
  body: `
An [[achromatic-doublet|achromat]] needs two glasses, but not necessarily a joint between them. A **cemented** doublet has the two lenses ground to the same radius on their contact faces and glued with a thin layer of optical cement (a few micrometres, index near 1.5). An **air-spaced** doublet keeps them apart by a gap of a fraction of a millimetre to a few millimetres, and the two faces of the gap may have different radii.

### What cementing gives
- **No extra reflections.** A glass-to-air face reflects 4.2 % of the light for N-BK7 and 6.3 % for N-SF5. A cemented interface between glass of index 1.517 and cement of 1.55 reflects $((1.55 - 1.517)/(1.55 + 1.517))^2 \\approx 0.01\\ \\%$; against dense flint (1.673) about 0.15 %. Losses and [[ghosts-flare-and-stray-light|ghosts]] are much less than with an air gap.
- **A single assembly.** The two lenses cannot tilt or decentre against each other, which removes an alignment step, and the unit is easy to mount.
- **Fewer surfaces to coat.** Only the two outer faces need an [[antireflection-coatings|anti-reflection coating]].

### What it costs
There are only three radii, and the middle one is shared. The designer's single free number is the bend of the doublet, which can set one aberration to zero. In the ray-traced N-BK7 + F2 doublet of the simulation ($f = 100$ mm, f/5) either bend that removes the spherical aberration leaves about 4 waves of coma at 3° and a blur of 20 to 28 µm there. (A well-chosen pair of glasses can do better: with N-BK7 + N-SF5 one bend brings both close to zero, so the choice of glass is a free number too.) Cement also limits size and power. Crown and flint expand differently on heating (N-BK7 7.1, F2 8.2, N-SF5 7.9; but N-FK51A 12.7 and calcium fluoride 18.9, in $10^{-6}$ per kelvin), so a large cemented pair, or one with a very different pairing, is stressed by a temperature change and can separate. Cement also absorbs ultraviolet, and can burn in a high-power laser beam. Cemented doublets are common up to a few tens of millimetres across; larger ones are usually air-spaced.

### What an air gap gives
Now there are four radii and a gap: the two faces of the gap can differ, which adds a second free number. In the simulation, with a 1 mm gap, one setting of the bend and of the gap-face mismatch makes the third-order spherical aberration *and* coma vanish together: the blur falls to 3 µm on axis and 15 µm at 3° off axis, against 5–10 µm and 20–28 µm for the cemented lens. The price is two more reflecting surfaces, tight alignment of the gap and its centring, and more mounting.

### Forms with names
In the **Fraunhofer** form the crown is in front; in the **Steinheil** form the flint is in front and the crown behind. Both occur in telescope objectives, and they correct the same colour error with different balances of the other aberrations. The **Gauss** doublet is an air-spaced pair of menisci that bend towards each other: the form is also the half of the [[double-gauss|double Gauss]] camera lens.

> [!key] Cementing is compact, robust and loses almost no light at the joint, but it ties the two faces to the same radius. An air gap frees one more surface, so spherical aberration and coma can both be corrected, and it suits big or powerful lenses.
`,
  ideas: [
    'A cemented doublet has one interface with matched radii and a layer of cement: no air-glass reflections there, and no relative tilt or decentre.',
    'An air-spaced doublet adds a second free surface: spherical aberration and coma can both be corrected.',
    'Cement limits the size (thermal expansion mismatch) and the optical power handled (absorption, ultraviolet).',
    'The Fraunhofer form has the crown first; the Steinheil form has the flint first.',
    'A cemented interface reflects about 0.01–0.15 %, against 4–6 % for glass to air: fewer ghosts.'
  ],
  pitfalls: [
    'Cemented doublets are always better because they are cleaner — They are simpler, but the shared radius takes away a free surface. The air-spaced doublet in the simulation has less blur at 3° (15 µm against 20–28 µm) at the price of a bigger assembly effort.',
    'An air gap adds no new aberration correction — It adds a degree of freedom: the gap faces may differ, which lets both spherical aberration and coma be set to zero.',
    'The cement layer bends the rays — It is a few micrometres thick and its index is close to that of the glasses; its job is bonding, with a negligible optical effect.',
    'Any size of doublet can be cemented — Differential thermal expansion strains a large cemented pair, particularly with fluorite or ED glass (12–19 × 10⁻⁶ /K against 7–8 for ordinary crown and flint).'
  ],
  terms: [
    { term: 'Cemented doublet', also: ['cemented achromat', 'bonded doublet'], def: 'Two lenses with matched radii on their contact faces, joined by a thin layer of optical cement so that they act as one element.' },
    { term: 'Air-spaced doublet', also: ['air-gapped doublet', 'separated doublet'], def: 'Two lenses mounted with a small air gap between them, whose two facing surfaces may have different radii.' },
    { term: 'Optical cement', also: ['optical adhesive', 'balsam'], def: 'A transparent adhesive, today usually an ultraviolet-curing resin of index about 1.5, which bonds two glass surfaces in a layer a few micrometres thick.' },
    { term: 'Fraunhofer doublet', def: 'The form of achromatic doublet with the crown lens in front (towards the light) and the flint behind it.' },
    { term: 'Steinheil doublet', def: 'The form of achromatic doublet with the flint lens in front and the crown behind it.' },
  ],
  formulas: [
    {
      name: 'Two separated thin lenses', expr: 'P = P1 + P2 - d*P1*P2', tex: '\\varphi = \\varphi_1 + \\varphi_2 - d\\,\\varphi_1\\varphi_2',
      vars: {
        P: { name: 'power of the pair', q: 'optpower', unit: 'D', signed: true, tex: '\\varphi' },
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 16.667, signed: true, tex: '\\varphi_1' },
        P2: { name: 'power of the second lens', q: 'optpower', unit: 'D', value: -6.667, signed: true, tex: '\\varphi_2' },
        d: { name: 'gap between the lenses', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'For d = 0 (contact) the powers simply add. A gap raises the power of a positive–negative pair.',
      stories: { P: 'A +60 mm lens ({P1}) and a −150 mm lens ({P2}) are mounted {d} apart. What power has the pair?' }
    },
    {
      name: 'Reflectance of a joint', expr: 'R = ((n1 - n2)/(n1 + n2))^2', tex: 'R = \\left(\\frac{n_1 - n_2}{n_1 + n_2}\\right)^2',
      vars: {
        R: { name: 'reflectance at normal incidence', q: 'ratio', unit: '%' },
        n1: { name: 'index of the glass', value: 1.6727, min: 1, max: 3 },
        n2: { name: 'index of the cement', value: 1.55, min: 1, max: 3 }
      },
      note: 'With n₂ = 1 (air) the same formula gives 4.2 % for N-BK7 and 6.3 % for N-SF5.',
      stories: { R: 'Light passes from glass of index {n1} into cement of index {n2}. What fraction is reflected at normal incidence?' }
    }
  ],
  examples: [
    {
      title: 'How much light does the joint reflect?',
      q: 'Compare the reflectance at the joint of a cemented N-BK7 + N-SF5 doublet (cement of index 1.55) with the same two lenses separated by air.',
      steps: [
        { text: 'N-BK7 (1.517) to cement:', tex: 'R = \\left(\\frac{1.517 - 1.55}{1.517 + 1.55}\\right)^2 = 1.2 \\times 10^{-4}' },
        { text: 'Cement to N-SF5 (1.673):', tex: 'R = \\left(\\frac{1.673 - 1.55}{1.673 + 1.55}\\right)^2 = 1.5 \\times 10^{-3}' },
        'With an air gap the two faces reflect 4.2 % (BK7 to air) and 6.3 % (air to SF5): about 10 % of the light in all, and two more surfaces to coat.'
      ],
      a: 'About 0.16 % lost at the cemented joint, against about 10 % without coating at an air gap.'
    },
    {
      title: 'A separated pair',
      q: 'A +60 mm lens and a −150 mm lens are held 5 mm apart. What are the focal length and the back focal distance of the pair?',
      steps: [
        { text: 'In dioptres $\\varphi_1 = 16.667$ D and $\\varphi_2 = -6.667$ D, so', tex: '\\varphi = 16.667 - 6.667 - 0.005 \\times 16.667 \\times (-6.667) = 10.556\\ \\mathrm{D}' },
        'The focal length is $f = 1/\\varphi = 94.7$ mm. In contact the pair would have $f = 100$ mm: the gap shortens it by 5 mm.',
        { text: 'The back focal distance is', tex: 'f\\left(1 - \\frac{d}{f_1}\\right) = 94.7\\left(1 - \\frac{5}{60}\\right) = 86.8\\ \\mathrm{mm}' }
      ],
      a: 'f = 94.7 mm and a back focal distance of 86.8 mm. Spacing is itself a variable the designer uses.'
    }
  ],
  quiz: [
    { q: 'Why does a cemented interface produce much weaker ghosts than an air gap?', choices: ['The index step is small (cement against glass), so the reflectance is about 0.01–0.15 % rather than 4–6 %', 'The cement absorbs the reflected light', 'The cemented surfaces are polished better', 'Ghosts only come from the outer surfaces'], a: 0, why: 'The reflectance at an interface is $((n_1 - n_2)/(n_1 + n_2))^2$, which is tiny when the two indices are close.' },
    { q: 'An air gap makes a doublet bigger and harder to align, but it adds a degree of freedom for the designer.', a: true, why: 'The two faces of the gap need not match, which gives a second free number: spherical aberration and coma can then both be set to zero.' },
    { q: 'Large doublets made with fluorite or ED glass are usually air-spaced rather than cemented. What is the main reason?', choices: ['Their thermal expansion differs a lot from that of the flint, which strains the cement', 'Fluorite does not accept cement at all', 'Air spaces are needed to correct colour', 'Cement is opaque in the near infrared'], a: 0, why: 'N-FK51A expands at 12.7 and fluorite at 18.9, against 7–8 (in $10^{-6}$ per kelvin) for ordinary crown and flint. Over a large diameter a temperature change strains or splits the bond.' },
    { q: 'In a Steinheil doublet, which lens is nearer the incoming light?', choices: ['The flint', 'The crown', 'Neither: they are side by side', 'It depends on the f-number'], a: 0, why: 'Fraunhofer: crown first. Steinheil: flint first.' },
    { q: 'A +60 mm lens and a −150 mm lens are 5 mm apart. What power does the pair have, in dioptres?', answer: 10.56, why: '$\\varphi = \\varphi_1 + \\varphi_2 - d\\varphi_1\\varphi_2 = 16.667 - 6.667 + 0.5556 = 10.56$ D, so $f = 94.7$ mm.' }
  ],
  applications: [
    'Catalogue achromats up to a few tens of millimetres in diameter are cemented; they are the standard focusing and collimating lens of the laboratory.',
    'High-power laser doublets are air-spaced, so that no cement sits in the beam.',
    'Telescope objectives of large size are air-spaced in two or three elements with a gap held by spacers.',
    'The camera lens: the doublets inside a double Gauss are cemented, with a stop between air-spaced groups.',
    'Machine-vision lenses use cemented doublets in nearly every group.'
  ],
  history: 'Joseph von Fraunhofer built the great achromatic refractors of the 1820s with the crown in front; his 24 cm lens for the Dorpat observatory (1824) had a focal length of 4.3 m. The name of Carl August von Steinheil is attached to the form with the flint in front. Cement was Canada balsam, a tree resin, until synthetic resins replaced it in the twentieth century.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — cemented and air-spaced achromats and their degrees of freedom.',
    'W. J. Smith, *Modern Optical Engineering* — the achromatic doublet and the telescope objective forms.',
    'R. Kingslake, *A History of the Photographic Lens* — the doublet forms in early camera lenses.'
  ],
  sim: 'ca-doublet-forms'
},

/* ================================================================ apochromats and ED glass */
{
  id: 'apochromats-and-ed-glass', parent: 'correcting-aberrations', title: 'Apochromats and low-dispersion glass', level: 3,
  short: 'An apochromat brings three wavelengths to one focus instead of two. What it needs is glass with an unusual dispersion — fluorite and the ED (extra-low dispersion) glasses — because the secondary spectrum of an achromat depends on how the partial dispersions of its two glasses line up.',
  keywords: ['apochromat', 'APO', 'ED glass', 'extra-low dispersion', 'fluorite', 'calcium fluoride', 'partial dispersion', 'anomalous dispersion', 'secondary spectrum', 'normal line', 'three colours', 'N-FK51A', 'fluor crown', 'semi-apochromat', 'P g,F'],
  prereq: ['achromatic-doublet', 'the-abbe-number-and-glass-map', 'dispersion-and-the-spectrum'],
  related: ['optical-glass', 'optical-crystals', 'refracting-telescopes', 'microscope-objectives', 'telephoto-lens', 'axial-chromatic-aberration', 'lateral-chromatic-aberration', 'thermal-effects-in-optics', 'dispersion-formulas'],
  body: `
An [[achromatic-doublet|achromat]] puts two wavelengths at one focus. An **apochromat** does it for three — say 486, 546 and 656 nm — and the colour error that remains is a small fraction of the depth of focus. What this takes is not cleverer shapes but a better choice of glass.

### Why the achromat leaves a secondary spectrum
Besides the Abbe number, a glass has a **relative partial dispersion**, which says how its blue-to-red spread is shared between the violet and the red ends:

$$P_{g,F} = \\frac{n_g - n_F}{n_F - n_C}$$

($g$ is the violet line at 435.8 nm.) For two glasses $a$ and $b$ in an achromat the focus shift that remains at the violet end is

$$\\Delta z = f\\,\\frac{P_a - P_b}{V_a - V_b}$$

— $f$ times the *slope* of the line joining the two glasses on a plot of $P_{g,F}$ against $V$. Nearly all ordinary glasses lie close to one line, the **normal line**, $P_{g,F} \\approx 0.6438 - 0.001682\\,V$. Any ordinary crown and flint give nearly the same slope: for N-BK7 with F2 the focus spread is 0.0017 of the focal length, so a 500 mm doublet has 0.86 mm of secondary spectrum.

### Glasses off the line
Two kinds of glass stand away from the normal line, and they are the heart of every apochromat:

| Glass | $n_d$ | $V$ | $P_{g,F}$ | above the normal line by |
|---|---|---|---|---|
| N-BK7 | 1.5168 | 64.2 | 0.535 | −0.001 |
| N-FK51A (fluor crown) | 1.4866 | 84.5 | 0.536 | +0.034 |
| calcium fluoride (fluorite) | 1.4338 | 95.0 | 0.539 | +0.055 |
| F2 | 1.6200 | 36.4 | 0.583 | 0.000 |
| N-SF11 | 1.7847 | 25.7 | 0.616 | +0.015 |

(From the dispersion formulae.) Fluorite and the **ED** glasses combine a very high $V$ with a partial dispersion that is *not* low, so a line from one of them to an ordinary glass is much flatter.

### What it buys
In the simulation, with $f = 100$ mm at f/5, the focus spread between 436 and 656 nm is 0.22 mm for N-BK7 + F2 and 0.12 mm for N-FK51A + F2; with N-FK51A and a lanthanum crown (N-LAK9) it falls to 0.037 mm, and with fluorite and N-LAK9 to 0.016 mm. The quarter-wave depth of focus at f/5 is ±0.0275 mm, a total of 0.055 mm, so the last two doublets have all their colours inside it: that is what "apochromatic" means in practice. Such doublets are *semi-apochromats*; a full apochromat uses three glasses with powers chosen so that $\\sum\\varphi_i = \\varphi$, $\\sum\\varphi_i/V_i = 0$ and $\\sum\\varphi_i P_i/V_i = 0$ together.

### The price
- **Strong surfaces.** The apochromatic doublets above have surfaces of 17 to 28 mm radius on a 20 mm lens and leave 15 µm or more of blur at f/5, against 3 µm for N-BK7 + F2. Real apochromats add elements to take care of that.
- **Fluorite** is a soft crystal that expands at 18.9 ppm per kelvin, nearly three times N-BK7, and its index *falls* as it warms (about −11 ppm per kelvin): the focus drifts with temperature. It and the ED glasses are expensive.

### Where it matters
The secondary spectrum grows with the focal length, so **long refractors and telephoto lenses** need ED glass first. **Microscope objectives** of high numerical aperture have a tiny depth of focus, so apochromat objectives are corrected in three or four colours.

> [!key] The secondary spectrum of a two-glass achromat is $f\\,\\Delta P/\\Delta V$, the slope of the line joining the glasses on a partial-dispersion plot. Ordinary glasses lie on one line; fluorite and ED glasses lie off it, which is how apochromats bring three colours to a focus.
`,
  ideas: [
    'An apochromat has three wavelengths in focus together; the residual error lies inside the depth of focus.',
    'The relative partial dispersion P(g,F) = (n_g − n_F)/(n_F − n_C) says how the colour spread is shared between violet and red.',
    'The secondary spectrum of a doublet is f·ΔP/ΔV: the slope of the line joining the two glasses on a plot of P against V.',
    'Ordinary glasses lie near one normal line, P = 0.6438 − 0.001682·V; fluorite and ED glasses lie well above it.',
    'ED glasses cost more, call for stronger surfaces and, for fluorite, a temperature-dependent focus.'
  ],
  pitfalls: [
    'ED glass is just glass with a high Abbe number — A high $V$ alone helps only the primary colour. What makes ED and fluorite special is that their partial dispersion is *not* low: they sit above the normal line.',
    'An apochromat is perfectly colour-free — It brings three wavelengths together; between and beyond them there is still a small residue. And the residue is only small compared with the depth of focus.',
    'An apochromat needs three lenses of three glasses — Two lenses of fluorite or ED glass and a suitable partner already cut the secondary spectrum to a small part (semi-apochromats). The full three-glass solution goes further.',
    'Only the glass matters — The focal length matters as much: the focus spread is $f\\,\\Delta P/\\Delta V$, so a 1000 mm refractor suffers ten times what a 100 mm lens of the same glasses does.'
  ],
  terms: [
    { term: 'Apochromat', also: ['apochromatic lens', 'APO'], def: 'A lens corrected for chromatic aberration at three wavelengths, so that the colour error between them is small compared with the depth of focus.' },
    { term: 'Relative partial dispersion', also: ['partial dispersion', 'P(g,F)', 'P g,F'], def: 'The ratio (n_g − n_F)/(n_F − n_C): how much of the blue-to-red spread of refractive index lies at the violet end.' },
    { term: 'Normal line', also: ['normal glass line'], def: 'The straight line P(g,F) ≈ 0.6438 − 0.001682·V near which almost all ordinary optical glasses lie on a plot of partial dispersion against Abbe number.' },
    { term: 'Anomalous partial dispersion', also: ['anomalous dispersion glass'], def: 'A partial dispersion that lies well off the normal line: the property of fluorite and ED glasses that lets them reduce the secondary spectrum.' },
    { term: 'ED glass', also: ['extra-low dispersion glass', 'fluor crown', 'fluorophosphate glass'], def: 'A glass of very high Abbe number (above about 80) and anomalous partial dispersion, used in apochromats. N-FK51A is a fluor crown.' },
  ],
  formulas: [
    {
      name: 'Secondary spectrum of a doublet', expr: 'dz = f*(Pa - Pb)/(Va - Vb)', tex: '\\Delta z = f\\,\\frac{P_a - P_b}{V_a - V_b}',
      vars: {
        dz: { name: 'focus shift at the violet end', q: 'length', unit: 'mm', signed: true, tex: '\\Delta z' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 500 },
        Pa: { name: 'partial dispersion of the crown', value: 0.535, min: 0.4, max: 0.7, tex: 'P_a' },
        Pb: { name: 'partial dispersion of the flint', value: 0.583, min: 0.4, max: 0.7, tex: 'P_b' },
        Va: { name: 'Abbe number of the crown', value: 64.2, min: 15, max: 100, tex: 'V_a' },
        Vb: { name: 'Abbe number of the flint', value: 36.4, min: 15, max: 100, tex: 'V_b' }
      },
      note: 'Thin doublet, partial dispersion P(g,F). The sign says on which side of the d focus the violet comes to a focus.',
      stories: { dz: 'A doublet of focal length {f} is made of a crown with P = {Pa}, V = {Va} and a flint with P = {Pb}, V = {Vb}. How far is the violet focus from the main focus?' }
    },
    {
      name: 'Distance of a glass above the normal line', expr: 'dP = P - (0.6438 - 0.001682*V)', tex: '\\Delta P = P - (0.6438 - 0.001682\\,V)',
      vars: {
        dP: { name: 'partial dispersion above the normal line', signed: true, tex: '\\Delta P' },
        P: { name: 'partial dispersion P(g,F)', value: 0.539, min: 0.4, max: 0.7 },
        V: { name: 'Abbe number', value: 95, min: 15, max: 100 }
      },
      note: 'Large positive values (above about +0.02) mark the glasses used to reduce secondary spectrum.',
      stories: { dP: 'A glass has P(g,F) = {P} and an Abbe number of {V}. How far above the normal line does it lie?' }
    },
    {
      name: 'Quarter-wave depth of focus', expr: 'dz = 2*lambda*N^2', tex: '\\Delta z = 2\\,\\lambda\\,N^2',
      vars: {
        dz: { name: 'depth of focus on each side', q: 'length', unit: 'mm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 5, min: 0.7, max: 64 }
      },
      note: 'A focus error of this size produces a quarter wave of aberration: the usual limit for a "diffraction-limited" image.',
      stories: { dz: 'How far may the focus move, in light of {lambda}, at f/{N} before a quarter wave of defocus appears?' }
    }
  ],
  examples: [
    {
      title: 'A 500 mm refractor',
      q: 'A refractor of focal length 500 mm and f/10 has a doublet of N-BK7 and F2. How large is its secondary spectrum, and how does it compare with the depth of focus?',
      steps: [
        { text: 'With $P = 0.535$, 0.583 and $V = 64.2$, 36.4:', tex: '\\Delta z = 500\\ \\mathrm{mm} \\times \\frac{0.535 - 0.583}{64.2 - 36.4} = -0.86\\ \\mathrm{mm}' },
        { text: 'The depth of focus at 550 nm and f/10 is', tex: '\\pm 2\\lambda N^2 = \\pm 2 \\times 0.00055 \\times 100 = \\pm 0.11\\ \\mathrm{mm}' },
        'The total focus spread, 0.86 mm, is four times the whole depth of focus (0.22 mm): the violet is far out of focus, and a bright star has a violet halo. With N-FK51A and N-LAK9 the traced spread is 0.037 mm per 100 mm of focal length, 0.19 mm at 500 mm: inside the 0.22 mm band.'
      ],
      a: '0.86 mm: four times the depth of focus. An ED doublet gets the whole spectrum within it.'
    },
    {
      title: 'How anomalous is fluorite?',
      q: 'Fluorite has $V = 95.0$ and $P_{g,F} = 0.539$. How far above the normal line does it lie?',
      steps: [
        { text: 'The normal line at that Abbe number gives', tex: '0.6438 - 0.001682 \\times 95.0 = 0.484' },
        'So $\\Delta P = 0.539 - 0.484 = +0.055$: the largest anomaly of any common optical material.'
      ],
      a: '+0.055, far above the +0.034 of N-FK51A and the near-zero values of ordinary glass.'
    }
  ],
  quiz: [
    { q: 'What does an apochromat do that an ordinary achromat does not?', choices: ['Brings three wavelengths to the same focus', 'Removes all spherical aberration', 'Works at any f-number', 'Removes all lateral colour'], a: 0, why: 'An achromat unites two wavelengths. An apochromat unites three, which leaves a residue that is small against the depth of focus.' },
    { q: 'The secondary spectrum of a two-glass doublet is proportional to the slope of the line joining the two glasses on a plot of partial dispersion against Abbe number.', a: true, why: '$\\Delta z = f\\,\\Delta P/\\Delta V$ is $f$ times that slope. A flat line (two glasses with similar $P$ and very different $V$) gives a small secondary spectrum.' },
    { q: 'A doublet of focal length 300 mm uses glasses with $\\Delta P = 0.030$ and $\\Delta V = 30$. What is its secondary spectrum, in millimetres?', answer: 0.3, why: '$\\Delta z = f\\,\\Delta P/\\Delta V = 300 \\times 0.030/30 = 0.30$ mm.' },
    { q: 'Why are fluorite and ED glasses useful in apochromats?', choices: ['They combine very high Abbe number with a partial dispersion that lies well above the normal line', 'They have a very high refractive index', 'They absorb violet light', 'They are cheaper than ordinary crowns'], a: 0, why: 'A line from them to an ordinary glass is flatter than the normal-line slope, so the secondary spectrum $f\\,\\Delta P/\\Delta V$ is small.' },
    { q: 'Why does a telephoto lens need ED glass more than a wide-angle lens does?', choices: ['The focus spread grows with the focal length', 'ED glass is lighter', 'Wide-angle lenses have no colour error', 'Telephoto lenses use only red light'], a: 0, why: '$\\Delta z$ is proportional to $f$, while the depth of focus at a given f-number does not grow: a long lens exceeds it first.' }
  ],
  applications: [
    'Refracting telescopes for astronomy, where bright stars show any violet halo, use ED or fluorite doublets and triplets.',
    'Long telephoto lenses for sport and wildlife photography contain ED or fluorite elements in the front groups, where the beam is widest.',
    'Apochromat microscope objectives: corrected in three or four colours, for fluorescence work at several wavelengths and for colour photography of the specimen.',
    'High-resolution machine-vision and surveying lenses, where colour fringes of one pixel (3 µm) matter.',
    'Laser systems with several wavelengths on one axis, which need all of them to focus together.'
  ],
  history: 'The apochromatic objective was introduced in 1886 by Ernst Abbe, working with the glass-maker Otto Schott in Jena. It used calcium fluoride and new glasses, and Abbe called such objectives apochromatic. The achromat\'s secondary spectrum had been the limit of microscope resolution for a century.',
  sources: [
    'Schott Technical Information TIE-29, *Refractive Index and Dispersion* — relative partial dispersion and the normal line.',
    'W. J. Smith, *Modern Optical Engineering* — secondary spectrum and the choice of glasses for an apochromat.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the three-glass solution of the thin apochromat.'
  ],
  sim: { id: 'ca-achromat', params: { view: 'map', crown: 'N-FK51A', flint: 'N-LAK9' } }
},

/* ================================================================ symmetry and the stop */
{
  id: 'symmetry-and-the-stop', parent: 'correcting-aberrations', title: 'Symmetry and the position of the stop', level: 3,
  short: 'Moving the aperture stop along the axis changes coma and astigmatism but not spherical aberration or field curvature. A lens built as a mirror image about its stop goes further: coma, distortion and lateral colour cancel by themselves, exactly at 1 : 1 and to a good approximation far from it.',
  keywords: ['stop shift', 'stop position', 'symmetrical lens', 'symmetry', 'coma', 'distortion', 'lateral colour', 'chief ray', 'rapid rectilinear', 'double Gauss', 'aplanat', 'stop-shift equations', 'odd aberrations'],
  prereq: ['aperture-stop', 'coma', 'astigmatism-of-lenses'],
  related: ['double-gauss', 'chief-and-marginal-rays', 'entrance-and-exit-pupils', 'landscape-lens-and-meniscus', 'distortion', 'lateral-chromatic-aberration', 'the-seidel-sums', 'tessar', 'vignetting'],
  body: `
The [[aperture-stop|aperture stop]] decides which rays get through, and so where each bundle falls on every lens. On the axis the bundle is centred on every lens. Off axis, the **chief ray** — the one through the middle of the stop — crosses each lens away from its centre, and how far depends on where the stop is. Slide the stop and the off-axis bundle walks across the surfaces, meeting different parts of each, so some aberrations change.

### What moves and what does not
Spherical aberration and the Petzval field curvature depend on the axial (marginal) ray and on the powers, not on the chief ray: moving the stop leaves them alone. Coma, astigmatism and distortion do change. For a thin lens, with $E$ the **stop-shift parameter** (how far the chief-ray height at the lens moves, relative to the marginal-ray height), the third-order sums change as

$$S_2' = S_2 + E\\,S_1, \\qquad S_3' = S_3 + 2E\\,S_2 + E^2 S_1$$

with $S_1$ spherical aberration, $S_2$ coma and $S_3$ astigmatism. Two consequences. Coma changes in proportion to the spherical aberration: a lens with no spherical aberration has the same coma wherever the stop is. And a suitable $E$ can cancel coma or astigmatism: the stop position is a free design variable. In the simulation, a plano-convex lens ($f = 100$ mm, f/5, flat face first) has 32 waves of coma and 14 of astigmatism at 8° with the stop at the lens, but with the stop 30 mm in front of it these fall to 1.5 and 0.03 waves.

### Symmetry
Now build a lens in two halves, the rear a mirror image of the front, with the stop between them, and use it at magnification −1. A ray bundle crosses the front half just as the reversed bundle crosses the rear half. The aberrations that change sign when the chief ray direction reverses — the "odd" ones, **coma, distortion and lateral colour** — are equal and opposite in the two halves and cancel exactly. The "even" ones — spherical aberration, astigmatism, field curvature, axial colour — are the same in both halves and add.

The simulation uses two N-BK7 menisci ($R = 40$ and 90 mm) around a central stop at magnification −1. The coma of the front half is −0.34 waves and of the rear half +0.34; traced, the coma at 6 mm image height is −0.2 µm, the distortion 0.000 % and the lateral colour 0.01 µm. Scale the rear half by 1.3 and the coma is 8.5 µm; turn it to face the same way and it is 48 µm, with 3 µm of lateral colour. The spherical aberration, 0.57 waves per half, adds in every case.

### Not only at 1 : 1
The cancellation is exact only at magnification −1, but it is a forgiving approximation: the same lens at magnification −0.3 or −3 has a coma of about 1 µm or less. A camera lens works with a distant object, far from 1 : 1, yet nearly symmetric forms — the Rapid Rectilinear, the [[double-gauss|double Gauss]] and the symmetric wide-angle lenses — are the standard. The designer gets three of the aberrations nearly for free, and spends the freedom of the glasses and curvatures on the four that symmetry does not touch.

> [!key] Moving the stop changes coma and astigmatism (coma only through the spherical aberration), not the spherical aberration or the field curvature. A lens symmetric about its stop cancels coma, distortion and lateral colour exactly at 1 : 1 and nearly everywhere else.
`,
  ideas: [
    'The stop decides where off-axis bundles cross the lenses, so moving it changes coma, astigmatism and distortion.',
    'Spherical aberration and Petzval curvature do not change with the stop position.',
    'Stop-shift equations: S₂′ = S₂ + E·S₁ and S₃′ = S₃ + 2E·S₂ + E²·S₁ (thin lens, third order).',
    'A lens that is a mirror image about its stop cancels coma, distortion and lateral colour exactly at 1 : 1.',
    'The cancellation survives far from 1 : 1, which is why symmetric forms are used for camera lenses.'
  ],
  pitfalls: [
    'Moving the stop shifts the focus or the spherical aberration — On the axis nothing changes. The stop changes how off-axis bundles cross the lenses: coma, astigmatism and distortion, not the position of focus or the spherical aberration.',
    'A symmetric lens has no aberrations — Only the odd ones cancel. Spherical aberration, astigmatism, Petzval curvature and axial colour of the two halves add, and they are the designer\'s job.',
    'Symmetry works only if the lens is used at 1 : 1 — It is exact there, but a good symmetric lens stays within about a micrometre of coma between magnifications −0.3 and −3.',
    'Any stop position can be chosen without cost — The stop sets vignetting and the size of the front lens, and the lens elements must be big enough to pass the off-axis bundles.'
  ],
  terms: [
    { term: 'Stop shift', also: ['stop displacement', 'stop position'], def: 'Moving the aperture stop along the axis. It changes which part of each lens the off-axis bundles use, and so the coma, astigmatism and distortion, but not the spherical aberration.' },
    { term: 'Symmetrical lens', also: ['symmetric system', 'symmetrical principle'], def: 'A lens whose rear half is a mirror image of its front half about the stop. At magnification −1 it cancels coma, distortion and lateral colour exactly.' },
    { term: 'Odd aberrations', def: 'Coma, distortion and lateral colour: the aberrations that reverse sign when a lens is reversed, and so cancel between the halves of a symmetric lens.' },
    { term: 'Aplanatic', also: ['aplanat'], def: 'Free of both spherical aberration and coma. The name was given to the first symmetric doublet lenses of the 1860s.' }
  ],
  formulas: [
    {
      name: 'Coma after a stop shift', expr: 'C1 = C0 + E*S', tex: 'C_1 = C_0 + E\\,S',
      vars: {
        C1: { name: 'coma after the shift', signed: true, tex: 'C_1' },
        C0: { name: 'coma before the shift', value: 0.5, signed: true, tex: 'C_0' },
        E: { name: 'stop-shift parameter', value: -0.5, signed: true },
        S: { name: 'spherical aberration', value: 1, signed: true }
      },
      note: 'Third-order sums in the same units. Coma changes only through the spherical aberration: with S = 0 a stop shift leaves it unchanged.',
      stories: { E: 'A lens has coma {C0} and spherical aberration {S} (third-order sums). Which stop shift makes its coma {C1}?' }
    },
    {
      name: 'Astigmatism after a stop shift', expr: 'A1 = A0 + 2*E*C0 + E^2*S', tex: 'A_1 = A_0 + 2E\\,C_0 + E^2 S',
      vars: {
        A1: { name: 'astigmatism after the shift', signed: true, tex: 'A_1' },
        A0: { name: 'astigmatism before the shift', value: 0.2, signed: true, tex: 'A_0' },
        C0: { name: 'coma before the shift', value: 0.5, signed: true, tex: 'C_0' },
        E: { name: 'stop-shift parameter', value: -0.5, signed: true },
        S: { name: 'spherical aberration', value: 1, signed: true }
      },
      note: 'With S = 0 the astigmatism changes linearly with E; otherwise it is a parabola in E with a minimum.'
    }
  ],
  examples: [
    {
      title: 'Cancelling coma with the stop',
      q: 'A thin lens has third-order sums $S_1 = 1.0$, $S_2 = 0.5$ and $S_3 = 0.2$ (arbitrary units) with its stop at the lens. Which stop shift cancels its coma, and what is the astigmatism then?',
      steps: [
        { text: 'Set $S_2' + "'" + ' = 0$:', tex: 'S_2 + E\\,S_1 = 0 \\quad\\Rightarrow\\quad E = -\\frac{0.5}{1.0} = -0.5' },
        { text: 'The astigmatism becomes', tex: 'S_3\' = 0.2 + 2(-0.5)(0.5) + (-0.5)^2(1.0) = 0.2 - 0.5 + 0.25 = -0.05' },
        'Coma is gone and the astigmatism has fallen from 0.2 to −0.05: the stop alone has done most of the work.'
      ],
      a: 'E = −0.5 gives zero coma and almost no astigmatism. Real lenses do not always cooperate so well, which is why the lens shape is a second variable.'
    },
    {
      title: 'Why the symmetric pair works',
      q: 'In the simulation, the front half of a symmetric pair has coma −0.34 waves and the rear half +0.34 waves at 1 : 1. What is the total, and what happens if the rear half is a copy facing the same way?',
      steps: [
        'For the mirror image the two contributions are equal and opposite: $-0.34 + 0.34 = 0$. The traced coma of the whole lens is −0.2 µm, a higher-order remainder.',
        'A copy facing the same way does not reverse the chief ray: its coma is −0.45 waves, the same sign as the front half, and the sum is −0.8 waves: the traced coma is 48 µm.'
      ],
      a: 'Mirror image: the coma cancels. Same way round: it adds.'
    }
  ],
  quiz: [
    { q: 'Which aberrations does a lens symmetric about its stop cancel exactly at magnification −1?', choices: ['Coma, distortion and lateral colour', 'Spherical aberration and axial colour', 'Astigmatism and field curvature', 'All the aberrations'], a: 0, why: 'The odd aberrations change sign when the lens is reversed, so the two halves cancel. The even ones add.' },
    { q: 'Moving the aperture stop along the axis changes the spherical aberration of a lens.', a: false, why: 'Spherical aberration depends on the axial rays, which do not care where the stop is. Coma, astigmatism and distortion change.' },
    { q: 'If a lens has zero spherical aberration, moving its stop changes its coma.', a: false, why: '$S_2\' = S_2 + E S_1$: with $S_1 = 0$, nothing changes. (Astigmatism still does.)' },
    { q: 'A lens has $S_1 = 1.0$ and $S_2 = 0.5$. What is the coma after a stop shift with $E = -0.5$?', answer: 0, why: '$S_2\' = 0.5 + (-0.5)(1.0) = 0$.' },
    { q: 'A symmetric pair is used with its rear half turned to face the same way as the front. What happens to the coma?', choices: ['It no longer cancels: the two halves add', 'It still cancels', 'It becomes spherical aberration', 'It becomes distortion'], a: 0, why: 'The rear half sees the chief ray from the opposite side only when it is a mirror image. A copy facing the same way contributes coma of the same sign.' }
  ],
  applications: [
    'The double Gauss and the Planar: near-symmetric camera lenses with the stop in the middle, the basis of fast standard lenses.',
    'The Rapid Rectilinear (1866), the first successful symmetric doublet lens, used in portrait and landscape photography.',
    'Unit-magnification relays: photocopiers, mask aligners and some microscope relay systems.',
    'Simple landscape lenses, where the stop is placed in front of a meniscus to cancel coma and astigmatism.',
    'Wide-angle lenses of the symmetric type used in large-format cameras.'
  ],
  history: 'The first symmetric doublet lenses appeared in 1866: the Rapid Rectilinear of John Dallmeyer and, independently, the Aplanat of Adolph Steinheil. In 1888 Alvan Clark patented the double Gauss, and in 1896 Paul Rudolph\'s Planar followed; both are nearly symmetric about the stop.',
  sources: [
    'W. T. Welford, *Aberrations of Optical Systems* — the stop-shift equations and the symmetrical principle.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — stop position and symmetrical systems.',
    'R. Kingslake, *A History of the Photographic Lens* — the rapid rectilinear, the aplanat and the double Gauss.'
  ],
  sim: [{ id: 'ca-stop', params: { mode: 'shift' } }, { id: 'ca-stop', params: { mode: 'sym' } }]
},

/* ================================================================ aspheric surfaces */
{
  id: 'aspheric-surfaces', parent: 'correcting-aberrations', title: 'Aspheric surfaces', level: 2,
  short: 'A sphere is the easiest surface to make but not the shape rays want. A surface that departs from a sphere by a controlled amount — described by a conic constant k and a polynomial — can remove the spherical aberration of a whole lens, and one aspheric element can do the work of two or three spherical ones.',
  keywords: ['asphere', 'aspheric lens', 'conic constant', 'paraboloid', 'hyperboloid', 'ellipsoid', 'even asphere', 'sag', 'moulded lens', 'plastic lens', 'aspheric condenser', 'k', 'A4', 'Descartes', 'precision glass moulding'],
  prereq: ['spherical-aberration', 'lens-bending', 'parabolic-and-elliptical-mirrors'],
  related: ['mobile-phone-lenses', 'optical-plastics', 'catalogue-lens-types', 'making-optics', 'condensers-and-kohler-illumination', 'collimating-a-laser-diode', 'optical-drawings-and-iso-10110', 'catadioptric-lenses', 'the-seidel-sums'],
  body: `
A spherical surface has one great virtue: grinding and polishing two surfaces against each other makes them spheres, so spheres are cheap, accurate and everywhere. What rays want is something else. An **aspheric** surface departs from a sphere by a controlled amount, and each extra number in its description is one more aberration the designer can remove with a single element.

### The sag equation
An aspheric surface is described by its **sag** $z$, the height of the surface above the vertex plane at a distance $r$ from the axis:

$$z = \\frac{c\\,r^2}{1 + \\sqrt{1 - (1 + k)\\,c^2 r^2}} + A_4 r^4 + A_6 r^6 + \\dots$$

where $c = 1/R$ is the vertex curvature. The first term is a **conic section** with **conic constant** $k$; the series is the "even asphere" terms.

| $k$ | surface of revolution |
|---|---|
| 0 | sphere |
| between −1 and 0 | prolate ellipsoid |
| −1 | paraboloid |
| below −1 | hyperboloid |
| above 0 | oblate ellipsoid |

A paraboloid focuses a distant on-axis point perfectly, which is why telescope mirrors are paraboloids ($z = r^2/4f$). A lens needs a different conic: for a lens of index $n$ the perfect surface is a hyperboloid with $k = -n^2$.

### A lens perfect on axis
Descartes showed in 1637 that a plano-hyperbolic lens focuses parallel light to a point. In the simulation: a plano-convex N-BK7 lens, $f = 100$ mm and 25 mm across (f/4), with the **flat face towards the beam** and a hyperboloid ($k = -2.30$) on the curved rear face. Every ray, at every height in the aperture, crosses the axis at the same point: the geometrical blur is zero, against 183 µm for the same lens with a spherical surface. The aspheric surface differs from the sphere by only 50 µm at the edge. With the *curved face towards the beam* the best conic is $k = -0.59$ and brings the blur from 45 µm down to 0.3 µm, less than the 2.9 µm Airy radius; the surface then departs from a sphere by only 14 µm.

### What one asphere cannot do
The perfect lens is perfect only on axis, and only for its conjugate. Off axis the other aberrations remain: the hyperbolic lens has a blur of 32 µm at 1° and 65 µm at 2°. It does nothing about chromatic aberration, which belongs to the glass. Aspheres relieve the *compromise*: a camera lens can reach a wider aperture with fewer elements, or a given quality with less glass, because spherical aberration is no longer the term that all the other surfaces must balance.

### Making them
Aspheres were once ground and polished one at a time. Today lenses are **moulded**: precision glass moulding presses hot glass between aspheric moulds, and plastic lenses are injection-moulded by the million, which is why a phone camera can use five to seven aspheric elements. Larger glass aspheres are shaped by computer-controlled polishing and tested with interferometers, often with a null lens or a hologram that turns the aspheric wavefront into a flat one.

> [!key] An aspheric surface is a sphere plus a conic constant $k$ and polynomial terms. A hyperboloid with $k = -n^2$ focuses a distant on-axis point perfectly; the other aberrations remain, but one aspheric element can do the work of several spherical ones.
`,
  ideas: [
    'The sag is a conic term (curvature c and conic constant k) plus even powers r⁴, r⁶, … with coefficients A₄, A₆.',
    'k = 0 is a sphere, −1 a paraboloid, below −1 a hyperboloid, between −1 and 0 a prolate ellipsoid, above 0 an oblate ellipsoid.',
    'A plano-convex lens with its flat face first and a hyperbolic curved face of k = −n² is perfect on axis for a distant object.',
    'Aspheres remove spherical aberration (and help coma and distortion), not chromatic aberration.',
    'Moulding in glass or plastic makes aspheres cheap enough for phones and condensers.'
  ],
  pitfalls: [
    'An aspheric lens is perfect — The hyperbolic lens focuses its on-axis point perfectly. A point 1° off axis is already blurred over 32 µm: one surface cannot fix every aberration.',
    'An aspheric surface looks obviously non-spherical — The departure is small: 50 µm at the edge of a 25 mm lens. It is measured in interferometer fringes, not seen.',
    'Aspheres cure colour errors — Chromatic aberration comes from the dispersion of the glass, and needs two glasses, not a shape.',
    'The best conic constant is the same for any lens — It depends on the index and on which face is aspheric: $k = -n^2$ (−2.30 for N-BK7) for a hyperbolic face behind a flat one, −0.59 for the curved face first.'
  ],
  terms: [
    { term: 'Aspheric surface', also: ['asphere', 'aspherical lens'], def: 'A lens or mirror surface that is not part of a sphere, described by a conic constant and polynomial terms.' },
    { term: 'Conic constant', also: ['k', 'asphericity'], def: 'The number k that sets the shape of a conic section of revolution: 0 for a sphere, −1 for a paraboloid, below −1 for a hyperboloid.' },
    { term: 'Sag', also: ['surface sag', 'z'], def: 'The height of a surface above the plane through its vertex at a given distance from the axis.' },
    { term: 'Even asphere', def: 'An aspheric surface whose departure from the conic is a polynomial in even powers of the radius: A₄r⁴ + A₆r⁶ + …' },
    { term: 'Precision glass moulding', also: ['moulded glass lens'], def: 'Pressing heated glass between aspheric moulds so that the finished lens needs no polishing; used for small, high-volume aspheres.' }
  ],
  formulas: [
    {
      name: 'Sag of a conic surface', expr: 'z = r^2/(R*(1 + sqrt(1 - (1 + k)*r^2/R^2)))', tex: 'z = \\frac{r^2}{R\\left(1 + \\sqrt{1 - (1 + k)\\,r^2/R^2}\\right)}',
      vars: {
        z: { name: 'sag', q: 'length', unit: 'mm' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 12.5 },
        R: { name: 'vertex radius of curvature', q: 'length', unit: 'mm', value: 51.68 },
        k: { name: 'conic constant', value: -2.3, min: -6, max: 2, signed: true }
      },
      note: 'The same as c r²/(1 + √(1 − (1 + k)c²r²)) with c = 1/R. For k = 0 it is the sag of a sphere.',
      stories: { z: 'A surface of vertex radius {R} has conic constant {k}. What is its sag at {r} from the axis?' }
    },
    {
      name: 'Conic constant for a perfect lens surface', expr: 'k = -n^2', tex: 'k = -n^2',
      vars: {
        k: { name: 'conic constant', signed: true },
        n: { name: 'refractive index of the lens', value: 1.5168, min: 1, max: 4 }
      },
      note: 'For the curved face of a plano-convex lens with its flat face towards a distant object: a hyperboloid that focuses the on-axis point perfectly.',
      stories: { k: 'A plano-convex lens of index {n} has its flat face towards the light. What conic constant must its curved face have to focus a distant on-axis point perfectly?' }
    },
    {
      name: 'Sag of a paraboloid', expr: 'z = r^2/(4*f)', tex: 'z = \\frac{r^2}{4f}',
      vars: {
        z: { name: 'depth of the paraboloid at radius r', q: 'length', unit: 'mm' },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 100 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 1000 }
      },
      note: 'A parabolic mirror of focal length f.'
    }
  ],
  examples: [
    {
      title: 'How far does the asphere depart from the sphere?',
      q: 'The curved face of the f = 100 mm N-BK7 lens has $R = 51.68$ mm. Find the sag at the edge of the 25 mm lens ($r = 12.5$ mm) for a sphere and for the hyperboloid $k = -2.30$.',
      steps: [
        { text: 'With $c = 1/R = 0.01935\\ \\mathrm{mm^{-1}}$: $c\\,r^2 = 3.023$ and $c^2 r^2 = 0.0585$. For the sphere ($k = 0$):', tex: 'z = \\frac{3.023}{1 + \\sqrt{1 - 0.0585}} = \\frac{3.023}{1.970} = 1.534\\ \\mathrm{mm}' },
        { text: 'For the hyperboloid:', tex: 'z = \\frac{3.023}{1 + \\sqrt{1 + 1.30 \\times 0.0585}} = \\frac{3.023}{2.037} = 1.484\\ \\mathrm{mm}' }
      ],
      a: 'The surfaces differ by 0.050 mm = 50 µm at the edge: about 90 wavelengths of green light.'
    },
    {
      title: 'The depth of a telescope mirror',
      q: 'A paraboloidal mirror has $f = 1000$ mm and $D = 200$ mm. How deep is the dish?',
      steps: [
        { text: 'At the edge $r = 100$ mm:', tex: 'z = \\frac{r^2}{4f} = \\frac{100^2}{4 \\times 1000} = 2.5\\ \\mathrm{mm}' },
        'A sphere of the same vertex radius ($R = 2f = 2000$ mm) would be 2.502 mm deep: the paraboloid differs from it by 2 µm, a few wavelengths — which is the whole difference between a perfect telescope mirror and a blurred one.'
      ],
      a: '2.5 mm deep. The correction of spherical aberration is only a few micrometres of glass.'
    }
  ],
  quiz: [
    { q: 'What is the conic constant of a paraboloid?', answer: -1, why: 'k = 0 is a sphere, k = −1 a paraboloid, k < −1 a hyperboloid.' },
    { q: 'A hyperbolic plano-convex lens (flat face first, $k = -n^2$) focuses a distant on-axis point perfectly. It also focuses a point 3° off axis perfectly.', a: false, why: 'The correction is for the on-axis point only. Off axis, coma and astigmatism remain; the traced blur is 32 µm at 1° in the simulation.' },
    { q: 'For glass of refractive index 1.5, what conic constant gives the perfect plano-convex lens (flat face towards the object)?', answer: -2.25, why: '$k = -n^2 = -2.25$.' },
    { q: 'Why can a phone camera afford several aspheric lenses?', choices: ['Plastic lenses are injection-moulded in aspheric moulds, in huge numbers', 'Aspheric lenses are always ground by hand and are cheap', 'Phone lenses are made of glass spheres', 'Aspheres do not need coatings'], a: 0, why: 'The mould makes the asphere: once it is cut, each lens costs about the same as a spherical one.' },
    { q: 'Which aberration can an aspheric surface not remove?', choices: ['Axial chromatic aberration', 'Spherical aberration', 'Distortion', 'Coma'], a: 0, why: 'Chromatic aberration arises from the dispersion of the glass, not from the shape of a surface. A second glass is needed.' }
  ],
  applications: [
    'Phone and compact camera lenses, with several moulded plastic aspheric elements.',
    'Aspheric condenser lenses in projectors and microscopes, which collect a wide cone of light from a lamp or LED.',
    'Collimators for laser diodes: moulded glass aspheres with numerical apertures of 0.5 or more.',
    'Telescope mirrors: paraboloids, hyperboloids and ellipsoids, and the aspheric corrector plate of a Schmidt telescope.',
    'Spectacle lenses with aspheric fronts, which are flatter and thinner than spherical ones of the same power.'
  ],
  history: 'Descartes derived in *La Dioptrique* (1637) the surfaces that focus light perfectly, and proposed grinding hyperbolic lenses; the machines to do so did not exist. Bernhard Schmidt\'s aspheric corrector plate of 1930 made wide-field reflecting telescopes possible. Moulded glass aspheres and mass-produced plastic ones arrived in the late twentieth century.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — aspheric surfaces in lens design.',
    'W. J. Smith, *Modern Optical Engineering* — conic sections and aspheric lenses.',
    'ISO 10110 (Part 12, aspheric surfaces) — how an aspheric surface is specified on a drawing.'
  ],
  sim: 'ca-asphere'
},

/* ================================================================ the Cooke triplet */
{
  id: 'cooke-triplet', parent: 'correcting-aberrations', title: 'The Cooke triplet', level: 3,
  short: 'Three separated lenses — positive, negative, positive — are the fewest that have enough freedom to correct all seven primary aberrations at once. Designed by H. Dennis Taylor in 1893, the triplet is the ancestor of the Tessar and of a large part of the lenses sold since.',
  keywords: ['Cooke triplet', 'triplet', 'Taylor', 'three lenses', 'positive negative positive', 'degrees of freedom', 'Seidel', 'Tessar', 'Petzval sum', 'air spaces', 'enlarger lens', 'seven aberrations'],
  prereq: ['achromatic-doublet', 'field-curvature', 'the-seidel-sums'],
  related: ['tessar', 'double-gauss', 'petzval-lens', 'how-lens-design-works', 'field-flatteners-and-petzval-sum', 'cemented-and-air-spaced-doublets', 'lens-tolerances-and-centration', 'combining-thin-lenses'],
  body: `
Three lenses in a row: a positive, a negative, a positive, with an air space between each pair and the [[aperture-stop|stop]] near the middle. The **Cooke triplet** is the simplest lens with enough freedom to correct every primary aberration of a camera lens, and it is the starting point of the Tessar, the Heliar and many descendants.

### Counting freedoms
There are seven primary aberrations: five monochromatic (spherical aberration, coma, astigmatism, field curvature, distortion — see [[the-seidel-sums]]) and two chromatic (axial and lateral colour). The designer also needs the focal length to be right. That makes **eight conditions**. A triplet of three thick lenses has six surface curvatures and two air spaces: **eight variables** (the glasses and the stop position are further choices). Eight equations, eight unknowns: just enough. A doublet has too few, and extra elements give more than are needed. H. Dennis Taylor saw this in 1893.

### Why positive, negative, positive
The hard aberration is [[field-curvature|field curvature]]. The Petzval sum $\\sum\\varphi_i/n_i$ counts every lens by its power alone, wherever the rays are, while the focal length of the whole counts each lens by its power times the height of the marginal ray at it. So put the two strong positive lenses where the rays are high, at the front and at the back, and the weak negative lens in the middle where the beam is narrow: it subtracts as much from the Petzval sum as a positive lens adds, but it subtracts much less from the total power. The system stays positive while its field curvature nearly disappears. The simulation's f = 50 mm, f/5 triplet has a Petzval radius of −128 mm (−2.6 *f*), against about −1.4 to −1.5 *f* for a singlet or a doublet of the same focal length.

### Cancellation, surface by surface
The library triplet of the simulation: radii 22.01, −435.8, −22.21, 20.29, 79.68 and −18.40 mm; N-SK16 crown for the outer lenses and F2 flint for the middle one; thicknesses 3.3, 1.0 and 3.0 mm; air spaces 6.0 and 4.75 mm. The Seidel bars show what each of the six surfaces contributes at 14°: single surfaces add more than seven times as much spherical aberration as the whole lens ends with. The total is small only because the terms cancel, and that makes the triplet **sensitive**: change the second air space by 1.5 mm and the focal length shifts by 2.5 mm (5 %) and the blur at 14° more than doubles, from 17 µm to 37–43 µm.

### What it delivers
At f/5 and f = 50 mm the traced triplet has an RMS blur of 4.2 µm on axis, 17 µm at 14° and 16 µm at 20° (one colour, best focus at each angle; the Airy radius is 3.4 µm). A doublet of the same focal length has 1 µm on axis but 110 µm at 14°; a singlet, 114 µm. The triplet is a good lens over a wide field, not a perfect one, and it is most at home between f/3.5 and f/6.3 in cameras, enlargers and projectors.

### Descendants
Paul Rudolph's Tessar (1902) replaced the rear lens by a cemented doublet, adding freedom to correct more at larger apertures; see [[tessar]]. The triplet's idea — separated positive and negative elements that balance one another — runs through most later designs.

> [!key] A triplet has six curvatures and two air spaces for seven aberrations plus the focal length: exactly enough. Its negative middle lens flattens the field by cancelling the Petzval sum, and every large error of one surface is balanced by another.
`,
  ideas: [
    'There are eight conditions (focal length plus seven primary aberrations) and a triplet has eight variables (six curvatures, two air spaces).',
    'The Petzval sum counts lenses by power; the focal length counts them by power times ray height. A weak negative lens in the middle flattens the field at little cost in power.',
    'Each surface of a triplet adds large errors; only the total is small, because they cancel.',
    'The triplet is sensitive to its air spaces and to centring, for the same reason.',
    'The Tessar and many later lenses are triplets with an added element for extra freedom.'
  ],
  pitfalls: [
    'Each lens of a triplet corrects one aberration — All eight variables act on all the aberrations at once. The design is a balance found by solving the equations together.',
    'The negative lens is there to cancel the colour of the others — Colour correction is part of it, but the negative lens\'s main job is to flatten the field.',
    'A triplet is a poor man\'s double Gauss — It is a different, simpler solution for lower apertures and fields. Fast lenses (f/2 and below) need more elements.',
    'A triplet is insensitive to errors because it has so few elements — The opposite: its surface contributions are large and cancel, so small errors in spacing or radius upset the balance.'
  ],
  terms: [
    { term: 'Cooke triplet', also: ['triplet', 'Taylor triplet'], def: 'A lens of three separated elements, positive–negative–positive, with the stop near the middle. Designed by H. Dennis Taylor in 1893.' },
    { term: 'Primary aberrations', also: ['third-order aberrations', 'Seidel aberrations'], def: 'The five monochromatic aberrations of third order (spherical aberration, coma, astigmatism, field curvature and distortion), plus the two chromatic ones in a design count.' },
    { term: 'Air space', also: ['air gap', 'spacing'], def: 'The distance along the axis between two lens elements. In a design it is a variable that is adjusted to balance aberrations.' }
  ],
  formulas: [
    {
      name: 'Two separated lenses: focal length', expr: 'f = f1*f2/(f1 + f2 - d)', tex: 'f = \\frac{f_1 f_2}{f_1 + f_2 - d}',
      vars: {
        f: { name: 'focal length of the pair', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of the first lens', q: 'length', unit: 'mm', value: 40, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of the second lens', q: 'length', unit: 'mm', value: -60, signed: true, tex: 'f_2' },
        d: { name: 'air space', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Two thin lenses in air. A positive lens followed, at some distance, by a negative one can still give a positive pair.',
      stories: { f: 'A {f1} lens and a {f2} lens are {d} apart. What is the focal length of the pair?' }
    },
    {
      name: 'Two separated lenses: back focal distance', expr: 'bfd = f*(1 - d/f1)', tex: '\\mathrm{bfd} = f\\left(1 - \\frac{d}{f_1}\\right)',
      vars: {
        bfd: { name: 'back focal distance', q: 'length', unit: 'mm', signed: true },
        f: { name: 'focal length of the pair', q: 'length', unit: 'mm', value: 60, signed: true },
        d: { name: 'air space', q: 'length', unit: 'mm', value: 20 },
        f1: { name: 'focal length of the first lens', q: 'length', unit: 'mm', value: 40, signed: true, tex: 'f_1' }
      },
      note: 'Measured from the second lens to the focus.'
    }
  ],
  examples: [
    {
      title: 'A positive and a negative lens make a positive pair',
      q: 'A +40 mm lens is followed, 20 mm behind it, by a −60 mm lens. What are the focal length and back focal distance of the pair?',
      steps: [
        { text: 'The focal length:', tex: 'f = \\frac{f_1 f_2}{f_1 + f_2 - d} = \\frac{40 \\times (-60)}{40 - 60 - 20} = \\frac{-2400}{-40} = +60\\ \\mathrm{mm}' },
        { text: 'The back focal distance:', tex: '\\mathrm{bfd} = f\\left(1 - \\frac{d}{f_1}\\right) = 60 \\times \\left(1 - \\frac{20}{40}\\right) = 30\\ \\mathrm{mm}' },
        'The negative lens sits where the beam from the first lens has already converged to half its width, so it takes only half as much power away as it would at the first lens: the pair stays positive.'
      ],
      a: 'f = +60 mm and a back focal distance of 30 mm. This is the principle of the triplet: the negative lens is weakened by the height at which it works, but flattens the field in full.'
    },
    {
      title: 'What the air spaces do',
      q: 'In the simulation the first and second air spaces of the f = 50 mm triplet are each changed by 1.5 mm. How does the lens respond?',
      steps: [
        'Changing the first space by +1.5 mm gives f = 49.8 mm and blurs of 9.3 µm on axis and 15 µm at 14°; by −1.5 mm, f = 50.3 mm and 0.7 µm and 22 µm.',
        'Changing the second space by +1.5 mm gives f = 47.8 mm and 13 µm and 43 µm; by −1.5 mm, f = 52.5 mm and 4.4 µm and 37 µm.',
        'The first gap trades on-axis against off-axis quality (spherical aberration against coma and astigmatism); the second changes the focal length by ±5 % and spoils the off-axis blur.'
      ],
      a: 'The air spaces are variables that balance one aberration against another, and the nominal design is a compromise tuned to the whole field.'
    }
  ],
  quiz: [
    { q: 'What is the order of the lenses of a Cooke triplet?', choices: ['Positive, negative, positive', 'Negative, positive, negative', 'Positive, positive, negative', 'All positive'], a: 0, why: 'The weak negative lens in the middle flattens the field; the strong positive lenses at front and back provide the power.' },
    { q: 'Why is a triplet the smallest lens that can correct all the primary aberrations?', choices: ['It has eight variables (six curvatures, two spaces) for the eight conditions (focal length and seven aberrations)', 'It has three lenses and there are three colours', 'Two lenses cannot be made of glass', 'Each lens corrects one aberration and there are three types'], a: 0, why: 'Counting variables against conditions: a doublet has too few, a triplet has just enough.' },
    { q: 'Each lens of a triplet is responsible for correcting one aberration.', a: false, why: 'All eight variables influence all the aberrations at once; the design is found by solving the equations together, with large terms balancing one another.' },
    { q: 'A +40 mm lens and a −60 mm lens are 20 mm apart. What is the focal length of the pair, in millimetres?', answer: 60, why: '$f = f_1 f_2/(f_1 + f_2 - d) = (40)(-60)/(40 - 60 - 20) = +60$ mm.' },
    { q: 'Why does the negative middle lens flatten the field with little loss of power?', choices: ['The Petzval sum ignores where the rays are, but the power counts the ray height — the narrow beam at the middle makes it count less', 'Negative lenses have no Petzval sum', 'It cancels the astigmatism of the front lens only', 'It makes the rays parallel'], a: 0, why: 'The Petzval contribution of a lens is $\\varphi/n$; its contribution to the power is $\\varphi$ times the marginal-ray height there, which is small in the narrow middle of the beam.' }
  ],
  applications: [
    'Low-cost cameras and compact film cameras, in which three elements keep price and weight down.',
    'Enlarger lenses, which work at modest apertures over a flat field.',
    'Projector and slide-projector lenses, and many machine-vision lenses of f/4 to f/6.',
    'Infrared triplets of germanium and zinc selenide for thermal cameras.',
    'The starting point for designers of larger lenses: the Tessar and the Heliar began as triplets.'
  ],
  history: 'H. Dennis Taylor, who worked for the York firm of T. Cooke & Sons, patented the triplet in 1893. It was one of the first lenses designed from a deliberate count of the aberrations to be corrected, rather than by trial and error, and it made it possible to cover a wide field at a useful aperture with only three elements. Paul Rudolph\'s Tessar followed in 1902.',
  sources: [
    'R. Kingslake, *A History of the Photographic Lens* — the triplet and the Tessar.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the thin-lens triplet and its degrees of freedom.',
    'W. J. Smith, *Modern Optical Engineering* — the triplet as a lens-design example.'
  ],
  sim: 'ca-triplet'
},

/* ================================================================ field flatteners and the Petzval sum */
{
  id: 'field-flatteners-and-petzval-sum', parent: 'correcting-aberrations', title: 'Flattening the field', level: 3,
  short: 'A lens focuses a flat scene onto a curved surface whose radius is fixed by the powers and indices of the lenses alone: the Petzval sum. One lens gives R = −nf. Separated positive and negative lenses, or a weak negative field-flattener lens near the image, bring the surface nearly flat.',
  keywords: ['Petzval', 'Petzval sum', 'Petzval surface', 'field flattener', 'field curvature', 'flat field', 'plan objective', 'curved sensor', 'field lens', 'Piazzi Smyth', 'tangential focus', 'sagittal focus'],
  prereq: ['field-curvature', 'the-seidel-sums', 'astigmatism-of-lenses'],
  related: ['cooke-triplet', 'petzval-lens', 'symmetry-and-the-stop', 'microscope-objectives', 'sensor-formats-and-pixel-size', 'depth-of-focus', 'combining-thin-lenses', 'mobile-phone-lenses'],
  body: `
A lens does not focus a flat scene onto a flat plane. Even a lens with no astigmatism at all images a flat object onto a curved surface, the **Petzval surface**, which bends towards the lens. A flat sensor then has the middle in focus and the corners not. The curvature of that surface is fixed by something remarkably simple.

### The Petzval sum
For thin lenses in air the radius of the Petzval surface is

$$R_P = -\\frac{1}{\\sum_i \\varphi_i / n_i}$$

where $\\varphi_i$ is the power and $n_i$ the refractive index of each lens. It depends only on the powers and indices: not on the shapes of the lenses, not on their spacing, and not on the stop. For a single thin lens $R_P = -nf$: the Petzval surface has a radius of about one and a half focal lengths. For $f = 50$ mm and $n = 1.52$ that is −76 mm; at 21.6 mm from the axis, the corner of a 36 × 24 mm frame, the surface lies 3.1 mm from the plane of the centre, over 300 times the depth of focus at f/2.8 (±0.009 mm).

The surfaces on which real images are sharp are the Petzval surface plus [[astigmatism-of-lenses|astigmatism]]: at third order the **tangential** and **sagittal** focal surfaces lie three times and once the astigmatic distance away from it, on one side. The simulation traces thin pencils of rays to find both, and the ratio comes out at 3.0.

### Two ways to flatten it
Both aim to make the sum $\\sum\\varphi_i/n_i$ small.

- **Separated positive and negative lenses.** A negative lens contributes $-\\varphi/n$ to the sum as a positive one contributes $+\\varphi/n$. If the negative lens sits where the beam is narrow it hardly lowers the total power but removes as much from the sum: this is the idea of the [[cooke-triplet|Cooke triplet]] (Petzval radius −2.6 *f* in the simulation) and of the thick meniscus lenses of "Plan" microscope objectives.
- **A field flattener**, a weak negative lens close to the image. There the marginal rays are almost on the axis, so the flattener changes the focal length very little, but its Petzval contribution counts in full.

In the simulation a flat-faced N-BK7 singlet of $f = 100$ mm has its stop 30 mm in front of it, which removes the astigmatism, and its Petzval radius is −151 mm. A plano-concave flattener 2 mm thick, 4 mm in front of the sensor, with a radius of 59 mm takes it to −1250 mm; it is flat at a radius of 51.7 mm — exactly the radius of the lens's own curved face, $R = (n-1)f$ — and a stronger one over-corrects, bending the surface the other way. The focal length rises from 100 to about 104 mm.

### What it costs
The flattener also changes the astigmatism, because the chief ray is high at the image, so the designer re-balances. It sits where the image is nearly in focus, so dust and scratches on it show; in many cameras the last element is such a lens, with strongly aspheric surfaces, which also controls the angle at which rays reach the sensor. The alternative is to curve the sensor itself: film plates were bent in Schmidt cameras, the eye's retina is curved, and curved image sensors exist in research and a few products.

> [!key] The Petzval radius is $-1/\\sum(\\varphi_i/n_i)$, independent of shapes and spacings: $-nf$ for one lens. Positive and negative power separated, or a negative flattener lens at the image, make the sum small and the field flat.
`,
  ideas: [
    'The Petzval surface is where a lens without astigmatism would focus a flat object. Its radius is −1/Σ(φ/n).',
    'It depends on the powers and indices only: not on lens shape, spacing or stop. For one lens it is −nf.',
    'Tangential and sagittal focal surfaces lie 3 and 1 times the astigmatism away from it.',
    'Negative lenses subtract from the Petzval sum; placed where the beam is narrow, or at the image, they barely change the power.',
    'A field flattener works because the marginal ray is nearly on the axis at the image; it also changes astigmatism, so the design must be re-balanced.'
  ],
  pitfalls: [
    'Field curvature can be cured by bending the lenses — It cannot. The Petzval sum ignores shapes and spacings. Only power, index and sign help; bending and the stop change the astigmatism, which moves the tangential and sagittal surfaces about the Petzval surface.',
    'A flattener must be as strong as the main lens to flatten the field — Of the same glass, it needs a power of −1/f; but at the image it barely changes the focal length (100 to 104 mm in the simulation).',
    'A flat Petzval surface means a flat field — The tangential and sagittal surfaces still depart from it by the astigmatism. All three must be controlled for a sharp image on a flat sensor.',
    'Moving the stop cures field curvature — It changes astigmatism, not the Petzval sum. With zero astigmatism the three surfaces coincide with the Petzval surface, which is still curved.'
  ],
  terms: [
    { term: 'Petzval sum', also: ['Petzval curvature', 'Σφ/n'], def: 'The sum of power divided by index over all the lenses (surfaces) of a system, which fixes the curvature of the Petzval surface: R = −1/Σ(φ/n) in air.' },
    { term: 'Petzval surface', also: ['Petzval field', 'Petzval curvature'], def: 'The curved surface on which a lens free of astigmatism would form sharp images of a flat object. It bends towards the lens for positive systems.' },
    { term: 'Field flattener', also: ['field-flattener lens', 'Smyth lens'], def: 'A weak negative lens placed close to the image plane that reduces the Petzval sum so that a flat sensor sees a sharp image over the whole field.' },
    { term: 'Plan objective', also: ['flat-field objective'], def: 'A microscope objective, "plan achromat" or "plan apochromat", whose field curvature is corrected so that the whole field is in focus together.' }
  ],
  formulas: [
    {
      name: 'Petzval sum of three thin lenses', expr: 'Pz = P1/n1 + P2/n2 + P3/n3', tex: 'P_z = \\frac{\\varphi_1}{n_1} + \\frac{\\varphi_2}{n_2} + \\frac{\\varphi_3}{n_3}',
      vars: {
        Pz: { name: 'Petzval sum', q: 'optpower', unit: 'D', signed: true, tex: 'P_z' },
        P1: { name: 'power of lens 1', q: 'optpower', unit: 'D', value: 29.5, signed: true, tex: '\\varphi_1' },
        P2: { name: 'power of lens 2', q: 'optpower', unit: 'D', value: -59, signed: true, tex: '\\varphi_2' },
        P3: { name: 'power of lens 3', q: 'optpower', unit: 'D', value: 41, signed: true, tex: '\\varphi_3' },
        n1: { name: 'index of lens 1', value: 1.62, min: 1.3, max: 2.5 },
        n2: { name: 'index of lens 2', value: 1.62, min: 1.3, max: 2.5 },
        n3: { name: 'index of lens 3', value: 1.62, min: 1.3, max: 2.5 }
      },
      note: 'The defaults are the three elements of the f = 50 mm triplet: +33.9, −16.9 and +24.4 mm. Set the sum to zero for a flat Petzval surface.',
      stories: { Pz: 'Three thin lenses of powers {P1}, {P2} and {P3} have indices {n1}, {n2} and {n3}. What is their Petzval sum?' }
    },
    {
      name: 'Radius of the Petzval surface', expr: 'Rp = -1/Pz', tex: 'R_P = -\\frac{1}{P_z}',
      vars: {
        Rp: { name: 'radius of the Petzval surface', q: 'length', unit: 'mm', signed: true, tex: 'R_P' },
        Pz: { name: 'Petzval sum', q: 'optpower', unit: 'D', value: 7.1, signed: true, tex: 'P_z' }
      },
      note: 'Negative: the surface curves towards the lens. A zero sum gives an infinite radius: a flat field.',
      stories: { Rp: 'A lens has a Petzval sum of {Pz}. What is the radius of its Petzval surface?' }
    },
    {
      name: 'Petzval radius of a single thin lens', expr: 'Rp = -n*f', tex: 'R_P = -n\\,f',
      vars: {
        Rp: { name: 'radius of the Petzval surface', q: 'length', unit: 'mm', signed: true, tex: 'R_P' },
        n: { name: 'refractive index', value: 1.5168, min: 1.2, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'The special case of one lens: the sum is φ/n = 1/(nf).'
    },
    {
      name: 'Sag of the Petzval surface', expr: 'z = y^2/(2*Rp)', tex: 'z = \\frac{y^2}{2R_P}',
      vars: {
        z: { name: 'distance of the surface from the flat sensor plane', q: 'length', unit: 'mm', signed: true },
        y: { name: 'image height', q: 'length', unit: 'mm', value: 21.6 },
        Rp: { name: 'radius of the Petzval surface', q: 'length', unit: 'mm', value: -75.8, signed: true, tex: 'R_P' }
      },
      note: 'Paraxial sag. Compare with the depth of focus 2λN², about 0.009 mm at f/2.8.',
      stories: { z: 'How far from the flat plane does a Petzval surface of radius {Rp} lie at an image height of {y}?' }
    }
  ],
  examples: [
    {
      title: 'The corner of a full-frame image',
      q: 'A 50 mm lens made of a single element of N-BK7 images at f/2.8. How far from the centre plane is the Petzval surface at the corner of a 36 × 24 mm frame, and how does it compare with the depth of focus?',
      steps: [
        { text: 'The Petzval radius is $R_P = -n f = -1.5168 \\times 50 = -75.8$ mm. The corner is at $y = 21.6$ mm, so', tex: 'z = \\frac{y^2}{2 R_P} = \\frac{21.6^2}{2 \\times (-75.8)} = -3.1\\ \\mathrm{mm}' },
        { text: 'The depth of focus at f/2.8 and 550 nm is', tex: '\\pm 2\\lambda N^2 = \\pm 2 \\times 0.00055 \\times 7.84 = \\pm 0.0086\\ \\mathrm{mm}' }
      ],
      a: '3.1 mm away, 360 times the depth of focus. A single lens at this speed is hopeless for a flat 36 mm frame; real lenses have positive and negative elements that cut the sum.'
    },
    {
      title: 'The flattener of a singlet',
      q: 'What power must a plano-concave flattener of the same glass have to flatten the Petzval surface of an N-BK7 singlet of $f = 100$ mm, and what radius does that give?',
      steps: [
        { text: 'The singlet has $P_z = \\varphi/n = 1/(1.5168 \\times 0.1\\ \\mathrm{m}) = 6.59$ D. A flattener of the same glass must contribute $\\varphi_{ff}/n = -6.59$ D:', tex: '\\varphi_{ff} = -n\\,P_z = -\\frac{1}{f} = -10\\ \\mathrm{D}' },
        { text: 'Its plano-concave radius is', tex: 'R = \\frac{n-1}{|\\varphi_{ff}|} = \\frac{0.5168}{10\\ \\mathrm{m^{-1}}} = 51.7\\ \\mathrm{mm}' }
      ],
      a: '−10 D (f = −100 mm), R = 51.7 mm: equal and opposite to the lens\'s own power. It works only because it sits where the marginal rays are almost on the axis; the traced optimum is 51.7 mm.'
    }
  ],
  quiz: [
    { q: 'What is the radius of the Petzval surface of a single thin lens of focal length 100 mm and index 1.5, in millimetres?', answer: -150, why: '$R_P = -nf = -1.5 \\times 100 = -150$ mm: it curves towards the lens.' },
    { q: 'Changing the spacing between the lenses of a system changes its Petzval sum.', a: false, why: 'The Petzval sum is $\\sum\\varphi_i/n_i$: only the powers and indices enter. Spacing changes the focal length and the astigmatism, not the Petzval sum.' },
    { q: 'Why can a negative field-flattener lens near the image flatten the field without much changing the focal length?', choices: ['The marginal rays are nearly on the axis there, so it adds little power, while its Petzval contribution counts in full', 'Negative lenses have no power', 'It is made of a different glass', 'It cancels the spherical aberration'], a: 0, why: 'A lens\'s Petzval contribution is $\\varphi/n$ wherever it is; its contribution to the focal length is weighted by the marginal-ray height, which is small at the image.' },
    { q: 'A lens has zero astigmatism. Where do its tangential and sagittal focal surfaces lie?', choices: ['Both on the Petzval surface', 'On a flat plane through the focus', 'Both on the sphere centred on the lens', 'Three times as far as the Petzval surface'], a: 0, why: 'The tangential and sagittal surfaces are 3 and 1 times the astigmatic distance from the Petzval surface; with zero astigmatism they sit on it, still curved.' },
    { q: 'A positive lens of power 20 D and index 1.5 is followed by a negative lens with power −10 D and the same index. What is the Petzval sum, in dioptres?', answer: 6.67, why: '$P_z = 20/1.5 - 10/1.5 = 6.67$ D, half the value of the positive lens alone (13.3 D).' }
  ],
  applications: [
    'Plan microscope objectives, whose thick meniscus lenses flatten the field so that the whole image is sharp at once.',
    'Astronomical survey cameras, in which a field-flattener lens sits just in front of the detector.',
    'Camera lenses: the triplet, Tessar and double Gauss all have separated positive and negative lenses for this reason.',
    'The last, strongly aspheric element of a phone camera lens, which flattens the field and sets the ray angles at the sensor.',
    'Curved image surfaces: the film of a Schmidt camera, the retina, and curved sensors in research cameras.'
  ],
  history: 'Joseph Petzval, professor in Vienna, designed the portrait lens of 1840 and found the condition that bears his name: the curvature of the image depends on the sum of power over index. The use of a weak negative lens close to the focus to flatten the field is usually credited to Charles Piazzi Smyth, in the 1870s.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the Petzval sum and the field flattener.',
    'W. J. Smith, *Modern Optical Engineering* — field curvature and the Petzval condition.',
    'M. Born and E. Wolf, *Principles of Optics* — the chapter on the geometrical theory of aberrations (Seidel theory and the Petzval surface).'
  ],
  sim: 'ca-petzval'
},

/* ================================================================ tolerances and centration */
{
  id: 'lens-tolerances-and-centration', parent: 'correcting-aberrations', title: 'Tolerances and centration', level: 3,
  short: 'A lens design is a list of exact numbers; a lens is built with errors in every one: radius, thickness, spacing, index, and the angles by which surfaces are tilted or decentred. Tolerancing finds which errors the image can stand, and tighter tolerances cost more.',
  keywords: ['tolerance', 'tolerancing', 'centration', 'decentre', 'tilt', 'wedge', 'centring', 'edge thickness difference', 'ETD', 'radius tolerance', 'fringes', 'sensitivity', 'yield', 'Monte Carlo', 'compensator', 'active alignment', 'ISO 10110'],
  prereq: ['cooke-triplet', 'spot-diagrams-and-ray-fans', 'surface-quality-and-flatness'],
  related: ['tolerancing-and-alignment-budget', 'aligning-an-optical-system', 'optomechanics-and-mounts', 'making-optics', 'optical-drawings-and-iso-10110', 'glass-quality-and-defects', 'strehl-ratio-and-diffraction-limited', 'how-lens-design-works'],
  body: `
A lens design is a list of exact numbers. A lens is something made, and made with errors in every one of them. The gap between the two is **tolerance**: how far each radius, thickness, spacing, index and angle may stray from the drawing before the image becomes unacceptable. Tolerances are the price list of an optical design: tighter ones cost more, and a design that needs very tight ones is a fragile design.

### What can be wrong
| Error | Commercial | Precision | What it does |
|---|---|---|---|
| radius of a surface | ±0.5 to 1 % | ±0.1 % or better | changes power and spherical aberration |
| centre thickness | ±0.1 to 0.2 mm | ±0.01 to 0.05 mm | shifts focus and aberrations |
| air space | ±0.05 to 0.1 mm | ±0.01 mm | changes focal length, coma, astigmatism |
| refractive index | ±0.001 | ±0.0005 or better | shifts focus, spherical aberration |
| centring (wedge) | a few arcminutes | 1 arcminute or less | decentre and tilt: coma, astigmatism |
| surface form | λ/2 to λ/4 | λ/10 or better | wavefront error directly |

(Order-of-magnitude figures; every maker and every grade of glass has its own. ISO 10110, the standard for optical drawings, defines how each is specified.)

### Sensitivity: which errors matter
Not all errors are equal. The simulation takes a fast photographic lens, a double Gauss of $f = 100$ mm and f/3 with 11 surfaces, whose nominal RMS blur is 7.9 µm, and moves each parameter in turn by ±0.5 % of radius, ±0.05 mm of thickness or ±0.001 of index. The radii of the strongly curved inner surfaces dominate, each adding 2–3 µm of blur; every thickness, air space and index adds less than 1 µm. Then it builds 40 whole lenses with *all* the errors at random: the median blur is 8.7 µm, the 90th percentile 12.8 µm, and 65 % of the builds stay under 10 µm. With radii at ±2 %, the median is 20 µm and only 1 build in 40 meets 10 µm. The result is statistical: **yield** is the fraction of the lenses that meet the specification.

### Decentre and tilt
The ray tracing above is rotationally symmetric, so it cannot show the errors that break that symmetry, which in practice often cost more. A surface **decentred** by a distance $d$ has its axis tilted, relative to the lens axis, by about $d/R$; a steeply curved surface is therefore very sensitive. If the two faces of a lens are decentred against each other the lens is a **wedge**: it deviates the beam by $(n-1)\\,w$ and one edge is thicker than the other by $\\mathrm{ETD} = w\\,D$. For a wedge of 3 arcminutes on a 25 mm lens that is 22 µm of edge-thickness difference. Decentre and tilt add coma and astigmatism that are not rotationally symmetric.

### Compensators
Some errors can be undone at assembly. Refocusing absorbs most of the focal-length error from radius and thickness errors. Moving one lens or group along or across the axis, an **active alignment** in which the lens is adjusted while the image is measured, takes out more. Every compensator loosens the tolerance of the errors it cancels.

> [!key] Tolerancing finds which errors a design can bear: radii of strong surfaces and centring matter most; most thicknesses and indices matter less. Tighter tolerances raise yield and cost together, and compensators such as refocusing loosen them.
`,
  ideas: [
    'Each radius, thickness, spacing, index, tilt and decentre has a tolerance; the image sets how large it may be.',
    'Sensitivities differ widely: in the double Gauss, the radii of the steep inner surfaces add 2–3 µm per ±0.5 %; thicknesses and indices under 1 µm.',
    'Random builds give a distribution; yield is the fraction of lenses meeting the specification.',
    'A surface decentred by d is tilted by d/R; a lens with wedge w deviates a beam by (n − 1)w and has an edge-thickness difference wD.',
    'Compensators (refocusing, adjusting a spacing or a lens while measuring the image) loosen tolerances.'
  ],
  pitfalls: [
    'A better design is always more tolerant — Designs that cancel large terms (the triplet, the double Gauss) are sensitive. Tolerance sensitivity has to be a design goal, not an afterthought.',
    'Only radius and thickness errors matter — Decentre and tilt are often the worst; they are not rotationally symmetric and need to be toleranced separately.',
    'Halving every tolerance halves the blur — The blur is a statistical sum of many terms; the most sensitive few decide the yield, and tightening the others buys little and costs a lot.',
    'The index of a glass is exactly its catalogue value — A melt varies by ±0.001 (standard grade) or less; designs must allow for it, or a manufacturer measures the melt and adjusts the radii.'
  ],
  terms: [
    { term: 'Tolerance', also: ['tolerancing'], def: 'The permitted deviation of a design parameter from its nominal value; also the process of finding how large each deviation may be.' },
    { term: 'Centration', also: ['centring', 'centering'], def: 'How well the optical axis of a lens coincides with its mechanical axis (its edge). Centring error is specified as an angle in arcminutes.' },
    { term: 'Decentre', also: ['decenter', 'lateral displacement'], def: 'A sideways displacement of a surface or a lens from the axis of the system.' },
    { term: 'Wedge', also: ['edge thickness difference', 'ETD'], def: 'A lens or plate whose faces are not parallel to their design position; the difference in edge thickness across the diameter is the ETD.' },
    { term: 'Yield', def: 'The fraction of a batch of manufactured lenses that meet the specification.' },
    { term: 'Compensator', also: ['compensation'], def: 'An adjustment made at assembly, such as refocusing or moving a lens, that cancels the effect of manufacturing errors.' }
  ],
  formulas: [
    {
      name: 'Beam deviation by a thin wedge', expr: 'dev = (n - 1)*w', tex: '\\delta = (n - 1)\\,w',
      vars: {
        dev: { name: 'deviation of the beam', q: 'angle', unit: '′', tex: '\\delta' },
        n: { name: 'refractive index', value: 1.5168, min: 1, max: 4 },
        w: { name: 'wedge angle', q: 'angle', unit: '′', value: 3, min: 0, max: 600 }
      },
      note: 'Thin wedge, small angles.',
      stories: { dev: 'A lens of index {n} has a wedge of {w}. By how much does it deviate a beam?' }
    },
    {
      name: 'Edge thickness difference', expr: 'etd = D*w', tex: '\\mathrm{ETD} = D\\,w',
      vars: {
        etd: { name: 'edge thickness difference', q: 'length', unit: 'µm', tex: '\\mathrm{ETD}' },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 25 },
        w: { name: 'wedge angle', q: 'angle', unit: '′', value: 3, min: 0, max: 600 }
      },
      note: 'Small angles: the difference between the thickest and the thinnest edge.',
      stories: { etd: 'A {D} lens has a wedge of {w}. What is the difference in thickness between its edges?' }
    },
    {
      name: 'Tilt from a decentre', expr: 'eps = d/R', tex: '\\varepsilon = \\frac{d}{R}',
      vars: {
        eps: { name: 'tilt of the surface axis', q: 'angle', unit: '′', tex: '\\varepsilon' },
        d: { name: 'decentre of the surface', q: 'length', unit: 'µm', value: 20 },
        R: { name: 'radius of the surface', q: 'length', unit: 'mm', value: 25 }
      },
      note: 'A surface whose centre of curvature is displaced by d is equivalent to a tilt of d/R.',
      stories: { eps: 'A surface of radius {R} is decentred by {d}. By what angle is its axis tilted?' }
    },
    {
      name: 'Focal-length change from a radius error', expr: 'df = f*dR/R', tex: '\\Delta f = f\\,\\frac{\\Delta R}{R}',
      vars: {
        df: { name: 'change of focal length', q: 'length', unit: 'mm', signed: true, tex: '\\Delta f' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        dR: { name: 'radius error', q: 'length', unit: 'mm', value: 0.26, signed: true, tex: '\\Delta R' },
        R: { name: 'radius of the curved face', q: 'length', unit: 'mm', value: 51.68 }
      },
      note: 'A thin plano-convex lens, f = R/(n − 1): the focal length changes in the same proportion as the radius.'
    }
  ],
  examples: [
    {
      title: 'A wedge of three arcminutes',
      q: 'A 25 mm N-BK7 lens has a centring error (wedge) of 3′. What are the deviation of the beam and the edge-thickness difference?',
      steps: [
        { text: 'The deviation is', tex: '\\delta = (n-1)\\,w = 0.5168 \\times 3\' = 1.55\'' },
        { text: 'The edge-thickness difference, with $w = 3\' = 8.7 \\times 10^{-4}$ rad:', tex: '\\mathrm{ETD} = D\\,w = 25\\ \\mathrm{mm} \\times 8.7 \\times 10^{-4} = 22\\ \\mu\\mathrm{m}' }
      ],
      a: 'The beam is turned by 1.55′ (0.45 mrad) and one edge is 22 µm thicker than the opposite one. A lens maker measures this by spinning the lens and watching a reflected beam.'
    },
    {
      title: 'A radius error and the depth of focus',
      q: 'A plano-convex N-BK7 lens has $f = 100$ mm ($R = 51.68$ mm) and is used at f/4. The radius turns out to be 0.5 % too large. By how much does the focus move, and is that within the depth of focus?',
      steps: [
        { text: 'A radius 0.5 % too large is $\\Delta R = 0.26$ mm, so', tex: '\\Delta f = f\\,\\frac{\\Delta R}{R} = 100 \\times 0.005 = 0.5\\ \\mathrm{mm}' },
        { text: 'The quarter-wave depth of focus at f/4 and 550 nm is', tex: '\\pm 2\\lambda N^2 = \\pm 2 \\times 0.00055 \\times 16 = \\pm 0.018\\ \\mathrm{mm}' },
        'The focus has moved by 28 times the depth of focus: the error is harmless only because the lens is *refocused* when it is assembled.'
      ],
      a: '0.5 mm, far outside the depth of focus: refocusing is the most common compensator.'
    }
  ],
  quiz: [
    { q: 'A routine ray trace of a rotationally symmetric lens can show the effect of which error?', choices: ['A radius error', 'A decentre of one lens', 'A tilt of one surface', 'A wedge in one lens'], a: 0, why: 'Radius, thickness, spacing and index errors keep the rotational symmetry. Decentre, tilt and wedge break it and need a model that is not symmetric.' },
    { q: 'What is the edge-thickness difference of a 25 mm lens with a wedge of 3 arcminutes, in micrometres?', answer: 21.8, why: '$w = 3\' = 8.73 \\times 10^{-4}$ rad, so $\\mathrm{ETD} = 25\\ \\mathrm{mm} \\times 8.73 \\times 10^{-4} = 21.8$ µm.' },
    { q: 'In the double Gauss example, which errors were the most damaging, in the amount of blur they added?', choices: ['The radii of the strongly curved inner surfaces', 'The indices of the glasses', 'The thickness of the front lens', 'All the same'], a: 0, why: 'A steeply curved surface turns the rays through large angles, so a small percentage error in its radius upsets the balance of aberrations most.' },
    { q: 'Tightening every tolerance of a lens by a factor of two is the most efficient way to raise its yield.', a: false, why: 'A few sensitive parameters dominate the spread. Tightening those, or adding a compensator for them, buys most of the gain; tightening the rest costs a lot and gains little.' },
    { q: 'Why does refocusing at assembly loosen the tolerance on radii and thicknesses?', choices: ['Much of their effect is a shift of the focus, which the adjustment removes', 'It makes the glass more uniform', 'It centres the lens', 'It removes the spherical aberration'], a: 0, why: 'A radius or thickness error mostly changes the focal length or the back focal distance; moving the sensor or the lens removes that part, leaving only the (smaller) change of the aberrations.' }
  ],
  applications: [
    'Photographic and cine lenses: every copy differs a little; high-end lenses are adjusted at assembly, measuring the image of a test chart.',
    'Phone camera modules: each lens stack is aligned to its sensor by active alignment, with the sensor read out while the lens is moved.',
    'Photolithography lenses, built with surface and spacing tolerances of nanometres and adjusted with piezo actuators.',
    'Laser optics: a wedge of a few arcminutes turns a collimated beam through a measurable angle, which is why windows are specified by parallelism.',
    'Catalogue lenses are sold with a stated centring, focal-length tolerance (often ±1 to ±2 %) and surface quality.'
  ],
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — tolerancing a lens design.',
    'R. E. Fischer, B. Tadic-Galeb and P. R. Yoder, *Optical System Design* — tolerancing, centring and sensitivity analysis.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — the indication of tolerances (Part 6 gives centring).'
  ],
  sim: 'ca-tolerances'
},

/* ================================================================ ghosts, flare and stray light */
{
  id: 'ghosts-flare-and-stray-light', parent: 'correcting-aberrations', title: 'Ghosts, flare and stray light', level: 2,
  short: 'Every glass surface that transmits also reflects a few per cent. Light that bounces twice inside a lens forms faint extra images of bright sources (ghosts); light scattered off edges and mounts veils the whole picture (flare). Coatings, lens design, baffles and blackened edges keep them down.',
  keywords: ['ghost', 'ghost image', 'flare', 'lens flare', 'veiling glare', 'stray light', 'internal reflection', 'double reflection', 'coating', 'baffle', 'lens hood', 'narcissus', 'blackened edges', 'sun in frame'],
  prereq: ['fresnel-reflection', 'antireflection-coatings', 'aperture-stop'],
  related: ['stray-light-and-baffling', 'why-surfaces-are-coated', 'multilayer-coatings', 'camera-artefacts-as-illusions', 'cemented-and-air-spaced-doublets', 'apertures-irises-and-pinholes', 'the-light-budget', 'angle-of-incidence-and-coatings'],
  body: `
Light that does not follow the designer's path is **stray light**. In a lens it comes in three kinds — ghosts, flare and veiling glare — and all begin with the same fact: a surface that is meant to transmit also reflects.

### Where the light goes
At normal incidence an uncoated glass surface in air reflects $((n-1)/(n+1))^2$: 4.2 % for N-BK7, 6.3 % for N-SF5, 7.9 % for N-SF11. A lens with ten uncoated surfaces passes only $(1 - 0.042)^{10} = 65\\ \\%$ of the light straight through. The remainder reflects back towards the source, or on to other paths inside the lens.

### Ghosts
A **ghost** is an extra, usually out-of-focus image of a bright source, made by light that reflects *twice* — first off one surface, then off an earlier one — before reaching the sensor. A lens of $k$ reflecting surfaces has $k(k-1)/2$ pairs, so 45 ghost paths for 10 surfaces, and each carries the product of two reflectances: $0.042 \\times 0.042 = 0.18\\ \\%$ of the light for bare N-BK7. That is small, but a lamp or the Sun in the field may be $10^{5}$ to $10^{8}$ times brighter than the scene around it.

In the simulation the double Gauss has 40 ghost paths that reach the sensor, together 4.4 % of the light when uncoated. The worst pair, surfaces 2 and 10, carries 0.31 % of the beam and spreads it over a patch of 3.5 mm rms radius, while the real image has an rms radius of 7.6 µm. The ghost's peak brightness is therefore only about $9\\times10^{-9}$ of the image's. With a source $10^{6}$ times brighter than the scene it comes to 0.9 % of the scene brightness, on the edge of being seen. In a photograph ghosts show as coloured polygons, the shape of the iris, strung along a line through the centre of the picture. The most dangerous are made by nearly concentric surfaces: they focus almost on the sensor and make a small, bright patch.

### Flare and veiling glare
Light from sources *outside* the field, or scattered by dust, fingerprints, the edges of lenses, iris blades and the barrel, finds its way to the sensor and lowers contrast over the whole image: **veiling glare**. **Flare** is the general word for both effects.

### What can be done
- **Coatings.** Ghost brightness goes as $R_1 R_2$, so it falls as the square of the surface reflectance. In the simulation, a single layer of MgF₂ (about 1 % per surface) reduces the total ghost light of the double Gauss from 4.4 % to 0.065 %, and a broadband multilayer (0.1–0.5 %) to 0.042 %. This is the main reason lenses are coated: see [[antireflection-coatings]].
- **Cemented surfaces.** A glass-to-glass joint reflects 0.01–0.15 % instead of 4–6 %.
- **Design.** Choose curvatures so that the strongest ghosts are spread out rather than focused near the sensor, and avoid surfaces concentric with the image.
- **Baffles, hoods and blackened edges.** Hoods and field stops keep out light from outside the field; ground and blackened lens edges, matt black barrels and sharp-edged baffles keep scattered light from reaching the sensor: see [[stray-light-and-baffling]].
- **Tilted or wedged windows** in laser systems send reflections away from the axis.
- In thermal cameras the strong **narcissus** ghost is the detector seeing its own cold reflection in the lens surfaces.

> [!key] Each surface reflects a few per cent, and two reflections make a ghost carrying $R_1 R_2$ of the light. A lens of $k$ surfaces has $k(k-1)/2$ ghost paths; coatings, design and baffles keep them below what a bright source can make visible.
`,
  ideas: [
    'An uncoated glass surface reflects 4 to 8 %; a ten-surface lens transmits only about 65 % straight through.',
    'A ghost is made by two reflections; it carries R₁R₂ of the light, and a lens of k surfaces has k(k − 1)/2 possible ghosts.',
    'Ghosts are faint extra images of bright sources, usually out of focus; veiling glare is a haze that lowers contrast everywhere.',
    'Coatings cut ghosts as the square of the reflectance: reflectances ten times smaller make ghosts a hundred times fainter.',
    'Baffles, hoods and blackened edges handle scattered light and light from outside the field.'
  ],
  pitfalls: [
    'Ghosts come only from the outer surfaces — Any pair of surfaces inside the lens can make one. The double Gauss has 40 paths in the simulation.',
    'Coating a lens removes ghosts — It makes them fainter by a factor of about a hundred; with a bright enough source they are still visible.',
    'A lens hood is a cure for ghosts — A hood keeps out light from outside the field, which makes flare. A ghost of a source *inside* the picture is made inside the lens and a hood cannot reach it.',
    'Ghosts and flare are the same thing — Ghosts are images, with a shape, made by two reflections; flare is a haze from scattering and from light outside the field.'
  ],
  terms: [
    { term: 'Ghost image', also: ['ghost', 'internal-reflection ghost'], def: 'A faint, usually out-of-focus extra image of a bright source, formed by light that has reflected twice inside a lens before reaching the sensor.' },
    { term: 'Flare', also: ['lens flare'], def: 'Unwanted light in an image from reflections and scattering inside a lens, including ghosts and veiling glare.' },
    { term: 'Veiling glare', also: ['veiling flare', 'haze'], def: 'A uniform haze that lowers the contrast of the whole image, caused by scattered light from sources inside and outside the field.' },
    { term: 'Lens hood', also: ['lens shade'], def: 'A tube or petal-shaped shield on the front of a lens that stops light from outside the field of view from entering.' },
    { term: 'Narcissus', def: 'In an infrared imaging system, the image of the cold detector itself reflected by the lens surfaces back onto the detector.' }
  ],
  formulas: [
    {
      name: 'Direct transmission of m uncoated surfaces', expr: 'T = (1 - R)^m', tex: 'T = (1 - R)^{m}',
      vars: {
        T: { name: 'transmission straight through', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of each surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 50 },
        m: { name: 'number of surfaces', value: 10, int: true, min: 1, max: 60 }
      },
      note: 'Ignores absorption in the glass and multiple reflections, which return a little of the lost light.',
      stories: { T: 'A lens has {m} glass surfaces, each reflecting {R}. How much light passes straight through?' }
    },
    {
      name: 'Brightness of a ghost path', expr: 'Rg = R1*R2', tex: 'R_g = R_1\\,R_2',
      vars: {
        Rg: { name: 'fraction of the light in the ghost', q: 'ratio', unit: '%', tex: 'R_g' },
        R1: { name: 'reflectance of the first reflecting surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 50, tex: 'R_1' },
        R2: { name: 'reflectance of the second reflecting surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 50, tex: 'R_2' }
      },
      note: 'Light passing a ghost path is the product of the two reflectances (the two transmissions are close to 1).'
    },
    {
      name: 'Number of ghost paths', expr: 'Ng = k*(k - 1)/2', tex: 'N_g = \\frac{k(k-1)}{2}',
      vars: {
        Ng: { name: 'number of ghost paths', int: true, tex: 'N_g' },
        k: { name: 'number of reflecting surfaces', value: 10, int: true, min: 2, max: 60 }
      },
      note: 'Every pair of surfaces gives one double-reflection path. Cemented surfaces reflect so little that they hardly count.'
    },
    {
      name: 'Ghost brightness against the image peak', expr: 'Erel = Rg*(ri/rg)^2', tex: 'E_{\\text{rel}} = R_g\\left(\\frac{r_i}{r_g}\\right)^2',
      vars: {
        Erel: { name: 'ghost irradiance ÷ image irradiance', tex: 'E_{\\text{rel}}' },
        Rg: { name: 'fraction of the light in the ghost', q: 'ratio', unit: '%', value: 0.18, min: 0, max: 100, tex: 'R_g' },
        ri: { name: 'radius of the real image', q: 'length', unit: 'µm', value: 7.6, tex: 'r_i' },
        rg: { name: 'radius of the ghost patch', q: 'length', unit: 'mm', value: 3.5, tex: 'r_g' }
      },
      note: 'Both spots are treated as uniform discs: the ghost has fewer photons per unit area because it is spread over a bigger area.',
      stories: { Erel: 'A ghost carries {Rg} of the light and covers a patch of radius {rg}; the real image has a radius of {ri}. How bright is the ghost against the image?' }
    }
  ],
  examples: [
    {
      title: 'What a coating does for the whole lens',
      q: 'A lens has ten glass-to-air surfaces. How much light passes straight through if the surfaces are uncoated (4.2 % each) and if they have a coating of 0.5 % each? How many ghost paths are there?',
      steps: [
        { text: 'Uncoated:', tex: 'T = (1 - 0.042)^{10} = 0.65' },
        { text: 'Coated:', tex: 'T = (1 - 0.005)^{10} = 0.95' },
        { text: 'The number of pairs of surfaces:', tex: 'N_g = \\frac{10 \\times 9}{2} = 45' },
        'The ghosts carry $0.042^2 = 0.18$ % each uncoated and $0.005^2 = 0.0025$ % each coated: 70 times fainter.'
      ],
      a: '65 % against 95 % of the light; 45 ghost paths, each 70 times fainter once the lens is coated.'
    },
    {
      title: 'Will the ghost be seen?',
      q: 'A ghost carries 0.18 % of the light and spreads over a patch 3.5 mm in radius; the real image is 7.6 µm in radius. A lamp in the scene is $10^6$ times brighter than its surroundings. Is the ghost visible?',
      steps: [
        { text: 'The ghost against the image peak:', tex: 'E_{\\text{rel}} = 0.0018 \\times \\left(\\frac{7.6\\times10^{-3}}{3.5}\\right)^2 = 8.5 \\times 10^{-9}' },
        { text: 'Against the surroundings, which are $10^6$ times fainter than the lamp\'s image:', tex: '8.5\\times10^{-9} \\times 10^{6} = 0.85\\ \\%' }
      ],
      a: 'About 0.85 % of the scene brightness: just under the roughly 1 % at which a ghost starts to be seen. A 10 times brighter lamp would show it, and a coating would hide it.'
    }
  ],
  quiz: [
    { q: 'A lens has 12 reflecting surfaces. How many double-reflection ghost paths are there?', answer: 66, why: '$N_g = k(k-1)/2 = 12 \\times 11/2 = 66$.' },
    { q: 'If the reflectance of every surface falls from 4 % to 0.4 %, how do the ghosts change?', choices: ['They become 100 times fainter', 'They become 10 times fainter', 'They become 4 times fainter', 'They do not change'], a: 0, why: 'A ghost carries $R_1 R_2$, the square of the reflectance: $(0.1)^2 = 0.01$.' },
    { q: 'A lens hood cuts the ghosts formed inside the lens by a bright lamp that is in the picture.', a: false, why: 'The ghost is made by reflections between the lens surfaces; the hood only stops light from outside the field. It reduces flare, not those ghosts.' },
    { q: 'Why do cemented doublets help against ghosts?', choices: ['The joint reflects about 0.01–0.15 % instead of 4–6 %, so pairs including it carry very little light', 'Cement absorbs ghosts', 'Cemented lenses are smaller', 'The cement scatters ghosts widely'], a: 0, why: 'The reflectance at a joint is set by the small index difference between glass and cement.' },
    { q: 'In a photograph, ghosts of the Sun often have the shape of the iris. Why?', choices: ['The ghost is an out-of-focus image of the light source as limited by the aperture stop', 'The iris reflects the light', 'The sensor pixels are polygons', 'Light diffracts around the blades'], a: 0, why: 'A defocused ghost is a blurred image of the source, and the blur has the shape of the aperture that bounds the beam: the iris.' }
  ],
  applications: [
    'Photography into the Sun or at night with street lamps in the frame: coatings, hoods and careful design keep ghosts and veiling glare down.',
    'Astronomy: a bright star may have ghosts in the field, which have to be distinguished from real objects.',
    'High-power lasers: a ghost beam can focus inside a lens or on a mount and damage it, so windows are wedged and lenses are tilted.',
    'Thermal cameras and infrared sensors, in which narcissus is designed out with curved surfaces and coatings.',
    'Machine vision with ring lights, where reflections from the glass over a part form bright patches.'
  ],
  history: 'In 1904 H. Dennis Taylor noticed that tarnished camera lenses transmitted more light than clean new ones: the tarnish, a thin surface layer, reduced the reflection. Alexander Smakula made the first deliberate anti-reflection coatings by vacuum evaporation in 1935, and coated lenses became general during and after the Second World War.',
  sources: [
    'R. E. Fischer, B. Tadic-Galeb and P. R. Yoder, *Optical System Design* — stray light, ghost analysis and baffles.',
    'H. A. Macleod, *Thin-Film Optical Filters* — anti-reflection coatings and their reflectance.',
    'R. Kingslake, *A History of the Photographic Lens* — flare and the introduction of coated lenses.'
  ],
  sim: 'ca-ghosts'
},

/* ================================================================ how lens design works */
{
  id: 'how-lens-design-works', parent: 'correcting-aberrations', title: 'How a lens is designed', level: 3,
  short: 'Lens design is a search. A lens has dozens of numbers, an image-quality score depends on all of them, and the designer\'s task is to find values that score well, can be made and cost little. The program improves a starting form step by step with damped least squares, and it can get stuck.',
  keywords: ['lens design', 'optimization', 'merit function', 'damped least squares', 'local minimum', 'starting form', 'variables', 'constraints', 'global search', 'ray tracing', 'Levenberg', 'Maréchal', 'Strehl', 'degrees of freedom'],
  prereq: ['cooke-triplet', 'strehl-ratio-and-diffraction-limited', 'wavefront-error-and-zernike-polynomials'],
  related: ['specifying-an-optical-system', 'first-order-layout', 'lens-tolerances-and-centration', 'achromatic-doublet', 'aspheric-surfaces', 'the-seidel-sums', 'spot-diagrams-and-ray-fans', 'testing-and-commissioning'],
  body: `
A lens has dozens of numbers: radii, thicknesses, spacings, glasses. How well it images is a single score that depends on all of them together. Lens design is the search for numbers that make that score good enough, that can be manufactured, and that cost little.

### The steps
1. **Requirements.** Focal length, f-number, field, wavelengths, resolution across the field, distortion, size and cost ([[specifying-an-optical-system]]).
2. **A starting form.** A known design that is close (a doublet, a triplet, a double Gauss), a patent, or a thin-lens layout ([[first-order-layout]]). The form matters more than anything the program does later.
3. **Variables.** Radii, spacings, thicknesses, glasses from a catalogue, aspheric terms.
4. **A merit function.** One number, small when the lens is good: usually the RMS spot or wavefront error over several field points and wavelengths, with weights, plus penalties on constraints such as focal length, total length and edge thickness.
5. **Optimization**, then **judgement**: the designer reads the result, changes constraints, form or glass, and goes round again.
6. **Tolerancing** ([[lens-tolerances-and-centration]]) and drawings.

### The merit function
A common goal is that the RMS wavefront error be below $\\lambda/14$, the Maréchal criterion. For small errors the Strehl ratio is $S \\approx \\exp[-(2\\pi\\sigma)^2]$ with $\\sigma$ the RMS wavefront error in waves, so $\\sigma = 1/14$ gives $S = 0.82$: a "diffraction-limited" lens. See [[strehl-ratio-and-diffraction-limited]].

### Damped least squares
Let $r$ be the vector of ray errors (how far each traced ray lands from where it should) and $x$ the variables. Near the present point $r(x + \\Delta x) \\approx r + J\\,\\Delta x$, where the matrix $J$ records how each ray error changes when each variable is nudged. Minimizing $|r + J\\Delta x|^2$ gives the step $J^{T}J\\,\\Delta x = -J^{T}r$. This is exact only for small steps, so the program **damps** it:

$$\\left(J^{T}J + \\lambda D\\right)\\Delta x = -J^{T}r$$

with $D$ the diagonal of $J^{T}J$. A large damping $\\lambda$ makes small cautious steps straight downhill; a small one makes a bold Newton step. The program tries a step; if the merit function falls it keeps it and lowers $\\lambda$, otherwise it raises $\\lambda$ and tries again.

### An optimizer in action
The simulation has the eight variables of a triplet (six curvatures and two air spaces) and a merit function made from rays at three field angles. From a triplet with random errors the merit falls from 50–120 µm to about 15 µm in about ten steps, and to 13 µm after forty. Started from three equal biconvex lenses it settles at 440 µm, from nearly flat lenses at 330 µm, and from a positive middle lens at 195 µm, the last two with the wrong focal length: each is a **local minimum**, a valley from which every small step is uphill. The program cannot tell which valley is deepest: the designer chooses the starting form, and global search (random restarts, simulated annealing) helps.

### Degrees of freedom
A lens of $N_e$ separated thick elements has $2N_e$ curvatures and $N_e - 1$ air spaces: $3N_e - 1$ variables. A triplet has 8, just what the focal length and seven aberrations ask for; a wide field, a zoom or many wavelengths need more elements, aspheres or special glasses.

> [!key] A lens is designed by choosing a starting form, a set of variables and a merit function, and letting damped least squares improve it. The optimizer goes only downhill, so the starting form decides which minimum it finds.
`,
  ideas: [
    'Design = requirements, starting form, variables, merit function, optimization, tolerancing.',
    'The merit function is one number, usually the RMS spot or wavefront error over fields and wavelengths, plus penalties for constraints.',
    'Damped least squares solves (JᵀJ + λD)Δx = −Jᵀr; the damping λ trades boldness for safety.',
    'An optimizer only goes downhill: the starting form decides which local minimum is found.',
    'A lens of Nₑ separated elements has 3Nₑ − 1 variables; a triplet has the 8 it needs for the focal length and seven aberrations.'
  ],
  pitfalls: [
    'The software finds the best lens — It finds the nearest minimum. A poor starting form gives a poor result, however long the program runs (the simulation settles at 440 µm from equal biconvex lenses).',
    'A low merit function means a good lens — Only for the merit function you wrote. A lens can score well and be hopeless to make, or fail at a wavelength or field point you left out.',
    'More variables always give a better lens — They give more freedom but a bigger search with more minima, and a more sensitive and costly lens.',
    'Design ends when the merit function is small — Tolerancing, the choice of glass, manufacturing and testing are as much a part of it.'
  ],
  terms: [
    { term: 'Merit function', also: ['error function', 'figure of merit'], def: 'A single number, built from ray or wavefront errors and constraints, that the optimizer minimizes. Small means a good lens.' },
    { term: 'Damped least squares', also: ['DLS', 'Levenberg–Marquardt method'], def: 'The standard optimization step in lens design: it solves (JᵀJ + λD)Δx = −Jᵀr, where λ damps the step so that the linear model may be trusted.' },
    { term: 'Local minimum', also: ['local optimum'], def: 'A set of variables from which every small change makes the merit function worse, though a better solution exists elsewhere.' },
    { term: 'Starting form', also: ['starting point', 'lens form'], def: 'The design a search begins from, such as a triplet or a double Gauss; it determines which minimum the optimizer finds.' },
    { term: 'Variable', also: ['design variable', 'degree of freedom'], def: 'A number the optimizer may change: a radius, a spacing, a thickness, a glass or an aspheric coefficient.' }
  ],
  formulas: [
    {
      name: 'Strehl ratio from the RMS wavefront error', expr: 'S = exp(-(2*pi*sig)^2)', tex: 'S = e^{-(2\\pi\\sigma)^2}',
      vars: {
        S: { name: 'Strehl ratio', min: 0, max: 1 },
        sig: { name: 'RMS wavefront error, in waves', value: 0.0714, min: 0, max: 0.5, tex: '\\sigma' }
      },
      note: 'Marechal\'s approximation, good for Strehl ratios above about 0.5. σ = 1/14 gives S = 0.82.',
      stories: { S: 'A lens has an RMS wavefront error of {sig} waves. What is its Strehl ratio?', sig: 'What RMS wavefront error, in waves, gives a Strehl ratio of {S}?' }
    },
    {
      name: 'A damped step in one variable', expr: 'dx = -g/(h*(1 + lam))', tex: '\\Delta x = -\\frac{g}{h\\,(1 + \\lambda)}',
      vars: {
        dx: { name: 'step in the variable', signed: true, tex: '\\Delta x' },
        g: { name: 'gradient of the merit function', value: 2, signed: true },
        h: { name: 'curvature of the merit function', value: 4, min: 0.001, max: 1000 },
        lam: { name: 'damping', value: 0.1, min: 0, max: 1000, tex: '\\lambda' }
      },
      note: 'The one-variable form of (JᵀJ + λD)Δx = −Jᵀr. λ = 0 is a full Newton step; large λ gives a small step downhill.',
      stories: { dx: 'A merit function has gradient {g} and curvature {h} in one variable. What step does damped least squares take with damping {lam}?' }
    },
    {
      name: 'Number of variables of a lens', expr: 'Nv = 3*Ne - 1', tex: 'N_v = 3N_e - 1',
      vars: {
        Nv: { name: 'number of surface and spacing variables', int: true, tex: 'N_v' },
        Ne: { name: 'number of separated elements', value: 3, int: true, min: 1, max: 20, tex: 'N_e' }
      },
      note: 'Two surface curvatures per element and an air space between each pair; glasses, thicknesses and the stop position are further variables.'
    }
  ],
  examples: [
    {
      title: 'How good is λ/14?',
      q: 'What is the Strehl ratio of a lens with an RMS wavefront error of $\\lambda/14$, and what error gives a Strehl of exactly 0.8?',
      steps: [
        { text: 'For $\\sigma = 1/14 = 0.0714$:', tex: 'S = \\exp\\left[-(2\\pi \\times 0.0714)^2\\right] = \\exp(-0.2013) = 0.82' },
        { text: 'For $S = 0.8$:', tex: '\\sigma = \\frac{\\sqrt{-\\ln 0.8}}{2\\pi} = \\frac{0.4724}{6.283} = 0.0752 = \\lambda/13.3' }
      ],
      a: 'λ/14 gives S = 0.82; S = 0.8 is λ/13.3. The Maréchal criterion is that the peak brightness of the image falls by no more than a fifth.'
    },
    {
      title: 'Counting the freedom',
      q: 'How many surface and spacing variables does an air-spaced doublet (two separated elements) have, and a Cooke triplet? Compare the triplet\'s with the aberrations to be corrected.',
      steps: [
        { text: 'An air-spaced doublet:', tex: 'N_v = 3 \\times 2 - 1 = 5 \\quad(\\text{four radii and one gap})' },
        { text: 'A triplet:', tex: 'N_v = 3 \\times 3 - 1 = 8 \\quad(\\text{six radii and two air spaces})' },
        'The triplet must meet the focal length and seven primary aberrations: eight conditions. The doublet has only five variables for the same eight: it can fix some aberrations only at the expense of others.'
      ],
      a: '5 and 8: the triplet is the smallest lens with as many variables as conditions.'
    }
  ],
  quiz: [
    { q: 'What does a damping λ that is made larger do to a damped-least-squares step?', choices: ['It makes the step smaller and more cautious', 'It makes the step larger', 'It changes the sign of the step', 'It has no effect'], a: 0, why: 'In $(J^TJ + \\lambda D)\\Delta x = -J^T r$ a larger $\\lambda$ shrinks $\\Delta x$: the step is shorter and nearly the steepest downhill direction.' },
    { q: 'An optimizer that starts from a poor form always finds the global best lens in the end.', a: false, why: 'It only goes downhill and stops at the nearest minimum. In the simulation, three equal biconvex lenses settle at 440 µm, thirty times worse than a triplet found from a good start.' },
    { q: 'What is the Strehl ratio of a lens whose RMS wavefront error is $\\lambda/14$?', answer: 0.82, why: '$S = \\exp[-(2\\pi/14)^2] = \\exp(-0.2013) = 0.82$.' },
    { q: 'Which is the best way to escape a poor local minimum?', choices: ['Change the starting form or restart from several different points', 'Run the same optimizer for longer', 'Lower the damping to zero', 'Add more constraints'], a: 0, why: 'The optimizer cannot climb out of a valley. A different starting form, or global search from many starts, can find a different one.' },
    { q: 'How many variables (curvatures and air spaces) do three separated thick elements have?', answer: 8, why: '$3N_e - 1 = 8$: six curvatures and two spaces.' }
  ],
  applications: [
    'Every lens made today: camera lenses, phone modules, microscope objectives and the projection lenses of chip-making machines are designed by optimization.',
    'Starting-form libraries and patents: a designer begins from a known lens that is close to the requirement.',
    'Tolerance analysis, which reuses the same ray-tracing engine to build thousands of imperfect lenses.',
    'Telescope and spectrograph design, with aspheres and special glasses as variables.',
    'Illumination design, where the merit function is the uniformity or the flux on a target rather than image quality.'
  ],
  history: 'Before computers a designer traced a few dozen rays through a lens by hand with tables of logarithms, helped by Seidel\'s formulas for third-order aberrations (1856); one trial of a design could take days, and a lens was a labour of months. Electronic computers began to trace rays in the 1950s, and automatic correction by damped least squares followed in the late 1950s and 1960s, so that thousands of trial lenses could be tried in an afternoon.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (2nd ed.) — the design process, merit functions and optimization.',
    'W. J. Smith, *Modern Lens Design* — damped least squares, constraints and global search in lens design.',
    'D. Malacara and Z. Malacara, *Handbook of Optical Design* — starting forms, variables and the design process.'
  ],
  sim: 'ca-optimizer'
}

);
