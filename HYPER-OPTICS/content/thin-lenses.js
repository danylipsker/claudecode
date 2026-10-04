/* HYPER-OPTICS · content/thin-lenses.js — the topic "Thin lenses and images" (12 concepts).
 * The world of the lens equation in the "real is positive" convention (1/so + 1/si = 1/f, m = −si/so), stated on each
 * page that uses it; radii and ray-transfer matrices use the Cartesian convention of lens-design software.
 * Simulations: sims/thin-lenses.js (ids tl-…).
 */
Hyper.add(

/* ================================================================ lens shapes and their names */
{
  id: 'lens-shapes-and-names', parent: 'thin-lenses', title: 'Lens shapes and their names', level: 1,
  short: 'A lens is glass with two refracting faces. Thicker in the middle than at the rim, it converges light; thinner in the middle, it diverges it. The six everyday shapes — biconvex, plano-convex, positive meniscus, biconcave, plano-concave, negative meniscus — are named for what the two faces do.',
  keywords: ['biconvex', 'double convex', 'DCX', 'plano-convex', 'PCX', 'meniscus', 'biconcave', 'DCV', 'plano-concave', 'PCV', 'converging lens', 'diverging lens', 'positive lens', 'negative lens', 'lens shape', 'which way round', 'lens orientation', 'radius of curvature', 'sign convention', 'shape factor', 'bending'],
  prereq: ['snells-law', 'refraction-at-a-curved-surface'],
  related: ['focal-length-and-optical-power', 'lensmakers-formula', 'lens-bending', 'catalogue-lens-types', 'spherical-aberration', 'landscape-lens-and-meniscus', 'physics:thin-lenses'],
  body: `
A lens is a piece of glass or plastic bounded by two refracting surfaces. Almost always each surface is part of a **sphere**, or a plane (a sphere of infinite radius), because grinding and polishing produce spheres most easily. How the two faces curve, and how steeply, fixes the focal length, the name of the lens and what it is good for.

### Converging and diverging
For a lens in air there is a rule that needs no calculation: **thicker in the middle than at the rim means converging (a *positive* lens); thinner in the middle means diverging (a *negative* lens).** A converging lens bends rays towards the axis and brings parallel light to a real focus. A diverging lens bends them away, so that parallel light seems to come from a point on the incoming side.

### The six shapes
Light travels from left to right, and radii use the **Cartesian sign convention**: a radius of curvature is positive when its centre of curvature lies to the *right* of the surface.

| Name | Front face, back face | $R_1$, $R_2$ | Action |
|---|---|---|---|
| Biconvex (double convex, DCX) | both bulge outwards | $R_1>0$, $R_2<0$ | converging |
| Plano-convex (PCX) | one flat, one bulging | $R_1>0$, $R_2=\\infty$ (or $R_1=\\infty$, $R_2<0$) | converging |
| Positive meniscus | bulging in front, hollow behind, the bulge steeper | $0<R_1<R_2$ | converging |
| Biconcave (DCV) | both hollow | $R_1<0$, $R_2>0$ | diverging |
| Plano-concave (PCV) | one flat, one hollow | $R_1<0$, $R_2=\\infty$ (or $R_1=\\infty$, $R_2>0$) | diverging |
| Negative meniscus | bulging in front, hollow behind, the hollow steeper | $0<R_2<R_1$ | diverging |

The six are one family. Turn a single dial, the **shape factor** $q=(R_2+R_1)/(R_2-R_1)$, and a biconvex lens ($q=0$) becomes plano-convex ($q=1$, curved side first) and then a meniscus ($q>1$) while the focal length stays the same. [[lens-bending|Bending a lens]] like this is the lens designer's first tool, and the simulation below does it live.

### Which way round?
The focal length does not care which face looks at the light; the image quality does. For a single lens, **the more curved surface faces the longer conjugate** — the side where the light is more nearly parallel. A plano-convex lens focusing a collimated beam, or imaging a distant scene, goes **curved side first**: turned the wrong way round, the same glass has about four times the [[spherical-aberration|spherical aberration]] at f/4. In a 1:1 relay of two plano-convex lenses the curved faces look at each other, towards the parallel light between them. [[catalogue-lens-types|Catalogue lenses]] are chosen on this basis.

### Real numbers
A 25.4 mm (1 inch) plano-convex lens of N-BK7 ($n=1.517$) with $f=50$ mm has a curved face of radius $R=f(n-1)=25.8$ mm and is about 5.3 mm thick at the centre for a 2 mm edge. A biconvex lens of the same focal length needs radii of 51.7 mm. Spectacle lenses are menisci, curved forwards, so that the eye looks through them well in every direction; contact lenses are menisci too.

> [!key] Thicker in the middle: converging; thinner in the middle: diverging (glass in air). Name a lens from its two faces, take $R>0$ when the centre of curvature is on the right, and put the more curved face towards the longer conjugate.
`,
  ideas: [
    'For a lens in air, thicker in the middle than at the rim means converging (positive); thinner in the middle means diverging (negative).',
    'A lens is named from its two faces: biconvex, plano-convex, meniscus, biconcave, plano-concave.',
    'With light travelling left to right, a radius is positive when its centre of curvature is on the right of the surface.',
    'One dial, the shape factor q, bends a biconvex lens into a plano-convex lens and a meniscus without changing the focal length.',
    'A plano-convex lens focusing distant light goes curved side first; flat side first it has roughly four times the spherical aberration.'
  ],
  pitfalls: [
    'A meniscus lens is always diverging — A meniscus can be either. If it is thicker in the middle it is a positive meniscus and converges; spectacles for long sight are positive menisci, spectacles for short sight negative ones.',
    'The flat side of a plano-convex lens is a mere back, so the lens can face either way — The focal length is the same either way, but with the flat side first the light is bent at a single steep surface and the spherical aberration is several times larger.',
    'Two convex faces always make a converging lens — The rule is for glass in air. A biconvex pocket of air in water, or a lens in a liquid denser than the glass, diverges light.',
    'The radius of curvature of a lens surface is about the radius of the lens — It is the radius of the sphere the surface belongs to, usually much larger than the half-diameter: a 25 mm lens of 50 mm focal length has faces of 26 mm radius or more.'
  ],
  terms: [
    { term: 'Converging lens', also: ['positive lens', 'convex lens'], def: 'A lens that bends parallel light towards the axis and brings it to a real focus. In air it is thicker in the middle than at the edge and its focal length is positive.' },
    { term: 'Diverging lens', also: ['negative lens', 'concave lens'], def: 'A lens that spreads parallel light as if it came from a point on the incoming side. In air it is thinner in the middle than at the edge and its focal length is negative.' },
    { term: 'Biconvex lens', also: ['double convex', 'DCX', 'equiconvex'], def: 'A converging lens whose two faces both bulge outwards. When the two radii are equal it is called equiconvex or symmetric.' },
    { term: 'Plano-convex lens', also: ['PCX'], def: 'A converging lens with one flat face and one convex face, the cheapest shape for focusing or collimating light. It is used curved side towards the longer conjugate.' },
    { term: 'Meniscus lens', also: ['positive meniscus', 'negative meniscus'], def: 'A lens with one convex and one concave face, both curving the same way. It is positive (converging) if thicker in the middle and negative if thinner. Spectacle lenses are menisci.' },
    { term: 'Biconcave lens', also: ['double concave', 'DCV'], def: 'A diverging lens whose two faces are both hollow.' },
    { term: 'Plano-concave lens', also: ['PCV'], def: 'A diverging lens with one flat face and one concave face.' }
  ],
  formulas: [
    {
      name: 'Sag of a spherical surface',
      expr: 's = R - sqrt(R^2 - h^2)', tex: 's = R - \\sqrt{R^2 - h^2}',
      vars: {
        s: { name: 'sag: how far the rim lies behind the vertex', q: 'length', unit: 'mm' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 25.84, min: 1, max: 5000 },
        h: { name: 'height from the axis (half the aperture)', q: 'length', unit: 'mm', value: 12.7 }
      },
      note: 'Exact for a sphere; for h much smaller than R it is close to h²/(2R). The edge thickness of a plano-convex lens is the centre thickness minus this sag.',
      stories: { s: 'A lens face of radius {R} is cut to a half-aperture of {h}. How deep is the cap, from the vertex to the rim?' }
    },
    {
      name: 'Radius of a plano-convex lens',
      expr: 'f = R/(n - 1)', tex: 'f = \\frac{R}{n - 1}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        R: { name: 'radius of the curved face', q: 'length', unit: 'mm', value: 25.84 },
        n: { name: 'refractive index of the glass', value: 1.517, min: 1.05, max: 4 }
      },
      note: 'For thin lenses; the flat face contributes nothing, whichever way the lens faces.',
      stories: { R: 'A plano-convex lens of index {n} must have a focal length of {f}. What radius must its curved face be ground to?' }
    }
  ],
  examples: [
    {
      title: 'A catalogue lens, from its numbers',
      q: 'A plano-convex lens of N-BK7 ($n = 1.517$) is 25.4 mm in diameter and has a focal length of 50 mm. What is the radius of its curved face, and how thick must it be at the centre to leave 2 mm of glass at the edge?',
      steps: [
        { text: 'The flat face has no power, so the curved face does it all:', tex: 'R = f\\,(n-1) = 50 \\times 0.517 = 25.8\\ \\mathrm{mm}' },
        { text: 'At the rim, 12.7 mm from the axis, the curved face lies behind its vertex by the sag:', tex: 's = R - \\sqrt{R^2 - h^2} = 25.84 - \\sqrt{25.84^2 - 12.7^2} = 3.34\\ \\mathrm{mm}' },
        'The centre must be 3.34 mm thicker than the edge: $2 + 3.34 \\approx 5.3$ mm.'
      ],
      a: 'R = 25.8 mm; centre thickness about 5.3 mm.'
    },
    {
      title: 'Which way round?',
      q: 'You use a plano-convex lens of f = 100 mm and 25 mm aperture to focus a laser beam from a distant source. Which face should the beam meet first, and what is gained?',
      steps: [
        'The beam is collimated, so the long conjugate is on the incoming side: the **curved** face goes towards the beam.',
        'Traced through real glass (N-BK7, f/4), the marginal rays then cross the axis about 1.8 mm short of the paraxial focus. With the flat face first they cross about 7.1 mm short — four times worse.'
      ],
      a: 'Curved side to the beam; the focal spot is several times smaller than with the lens turned round.'
    }
  ],
  quiz: [
    { q: 'A glass lens in air is thinner in the middle than at its rim. It is…', choices: ['converging (positive)', 'diverging (negative)', 'neither: its power is zero', 'impossible to say without the radii'], a: 1, why: 'Rays are delayed more at the thick part of a lens; a lens thinner in the middle turns the wavefront the other way and spreads the light out. Biconcave, plano-concave and negative menisci are all of this kind.' },
    { q: 'Light travels left to right. A lens has $R_1 = +60$ mm and $R_2 = +150$ mm. What kind of lens is it?', choices: ['biconvex', 'positive meniscus', 'biconcave', 'negative meniscus'], a: 1, why: 'Both centres of curvature are on the right, so both faces curve the same way: a meniscus. The front face is the steeper one ($R_1<R_2$), so the lens is thicker in the middle: positive.' },
    { q: 'A plano-convex lens that focuses a distant object should have its flat face towards the object.', a: false, why: 'The curved face goes towards the long conjugate (here the distant object). Flat side first, the whole refraction happens at one surface with large angles and the spherical aberration is several times worse.' },
    { q: 'A plano-convex lens of index 1.5 is to have a focal length of 200 mm. What radius, in millimetres, must the curved face have?', answer: 100, unit: 'mm', why: '$R = f(n-1) = 200 \\times 0.5 = 100$ mm.' },
    { q: 'A thin biconvex pocket of air is enclosed in a block of water. What does it do to parallel light?', choices: ['converges it, like any biconvex lens', 'diverges it', 'nothing: air and water have no power', 'converges it only at the centre'], a: 1, why: 'What matters is the index of the lens material relative to its surroundings. Air (n = 1) in water (n = 1.33) is the "less dense" medium, so the thick-in-the-middle shape spreads light out.' }
  ],
  applications: [
    'Spectacles and contact lenses: menisci of every power, made to be looked through at many angles.',
    'Laser and instrument optics: plano-convex lenses to focus and collimate, plano-concave lenses in beam expanders and as relay stages.',
    'The magnifying glass, the burning glass and the loupe: a biconvex lens in a frame.',
    'The door viewer (peephole): a strong negative lens in front, a positive one behind, to give a wide field.',
    'Every camera lens is a stack of such pieces: each element in a double Gauss or a zoom is one of these six shapes.'
  ],
  history: 'Convex lenses for reading were in use in northern Italy by the late 1280s; concave lenses for short sight came about two centuries later. In 1804 William Hyde Wollaston patented "periscopic" spectacles with meniscus lenses, the form still used today, because the eye sees more clearly through them when it looks away from the centre.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the thin lens, its shapes and the sign convention.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — lens shapes and the shape factor.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the shape factor and its use in lens design.'
  ],
  sim: 'tl-shapes'
},

/* ================================================================ focal length and optical power */
{
  id: 'focal-length-and-optical-power', parent: 'thin-lenses', title: 'Focal length and optical power', level: 1,
  short: 'The focal length f is where a lens brings parallel light to a focus; the optical power P = 1/f, in dioptres, is the same fact turned upside down. A short focal length is a high power, and the powers of thin lenses in contact simply add.',
  keywords: ['focal length', 'focal point', 'focus', 'optical power', 'dioptre', 'diopter', 'D', 'EFL', 'effective focal length', 'vergence', '1/f', 'strong lens', 'weak lens', 'reading glasses', 'powers add', 'lenses in contact', 'close-up lens'],
  prereq: ['lens-shapes-and-names', 'refraction-at-a-curved-surface'],
  related: ['the-thin-lens-equation', 'combining-thin-lenses', 'lensmakers-formula', 'cardinal-points', 'vertex-distance-and-effective-power', 'reading-a-prescription', 'field-of-view-and-focal-length', 'the-eye-as-a-camera', 'physics:thin-lenses'],
  body: `
Hold a magnifying glass up to a window and move a sheet of paper behind it until a sharp little picture of the view appears. The light from the distant window arrived as parallel rays, and the lens made them meet. The distance from lens to paper is the **focal length** $f$, and the point where they met is the **focal point** F′. For a positive lens $f>0$. For a negative lens $f<0$: the rays leave spread out and appear to come from a point $|f|$ in front of the lens.

> [!warn] Never look at the Sun through a lens, binoculars or a camera without a certified solar filter, and keep sunlit lenses away from paper, skin and sensors: a magnifying glass puts the Sun's heat on a spot about a millimetre across.

### From focal length to power
A lens that bends light more sharply has a shorter focal length. Opticians prefer a quantity that grows with the bending: the **optical power**

$$P=\\frac{1}{f}$$

with $f$ in metres, measured in **dioptres** (D), 1 D = 1 m⁻¹. A +1 D lens focuses at 1 m, +2 D at 0.5 m, +10 D at 100 mm. A −3 D lens, the sort worn for short sight, has its virtual focus 333 mm in front.

| Lens | $f$ | $P$ |
|---|---|---|
| Telescope objective of 1 m focal length | 1 m | +1 D |
| Reading spectacles | 400 mm | +2.5 D |
| Magnifying glass | 100 mm | +10 D |
| Standard camera lens | 50 mm | +20 D |
| The relaxed human eye (cornea about +43 D, lens about +20 D) | 17 mm | about +60 D |
| Smartphone main camera | 4–6 mm | about +170 to +250 D |
| Spectacles for short sight | −333 mm | −3 D |

### Why powers, not focal lengths
Press two thin lenses together and the combination has the power $P=P_1+P_2$: a +4 D and a −1 D lens make +3 D, a focal length of 333 mm. Focal lengths do *not* add. The reason is that each lens adds a fixed amount of *vergence* — the reciprocal of a distance, in dioptres — to the light that passes through it. Light from a point 0.25 m away arrives with vergence −4 D (spreading); a +10 D lens leaves it with +6 D (converging to a point 167 mm away). That arithmetic *is* the [[the-thin-lens-equation|lens equation]]: $1/s_i = P - 1/s_o$.

### Which focal length is meant?
For one thin lens the answer is simple. For a thick lens or a many-element objective the number printed on the barrel is the **effective focal length** (EFL), measured from the rear principal plane, not from the glass; see [[thick-lenses-and-principal-planes]] and [[cardinal-points]]. A "50 mm" lens focuses distant light 50 mm behind its principal plane — usually somewhat nearer than 50 mm from its back surface.

> [!key] $P = 1/f$, with $f$ in metres and $P$ in dioptres. Strong lens, short focal length; thin lenses in contact add their powers, not their focal lengths.
`,
  ideas: [
    'The focal length f is the distance from the lens to where parallel light comes to a focus; it is negative for a diverging lens.',
    'Optical power P = 1/f, with f in metres, is measured in dioptres: +1 D focuses at 1 m, +10 D at 100 mm.',
    'Powers of thin lenses in contact add: P = P₁ + P₂. Focal lengths do not.',
    'The effective focal length (EFL) of a real lens is measured from its principal plane, not from the glass.',
    'Typical powers run from +1 D (a telescope objective) through +60 D (the eye) to +250 D (a phone camera).'
  ],
  pitfalls: [
    'A lens with a longer focal length is stronger — The reverse: power is 1/f. A 100 mm lens (+10 D) is twice as strong as a 200 mm lens (+5 D) and bends light twice as much.',
    'Two lenses of 100 mm focal length in contact make 200 mm — Powers add, so +10 D and +10 D make +20 D: the focal length is 50 mm.',
    'A negative focal length means the lens does not focus light — It means the focus is virtual: the diverging rays appear to come from a point |f| in front of the lens, and a camera or an eye can still form an image from them.',
    'The focal length is the distance from the back of the lens to the focus — That is the *back focal length*. The focal length proper is measured from the principal plane, which can be well inside the glass or, in a telephoto lens, in front of it.'
  ],
  terms: [
    { term: 'Focal length', also: ['f'], def: 'The distance from a (thin) lens to the point where parallel light is brought to a focus. Positive for a converging lens, negative for a diverging one.' },
    { term: 'Focal point', also: ['focus', 'F′', 'F'], def: 'The point where rays that arrived parallel to the axis meet (a converging lens) or appear to start from (a diverging lens). Every lens has one on each side: F in front and F′ behind.' },
    { term: 'Optical power', also: ['power', 'P', 'dioptric power', 'refractive power'], def: 'The reciprocal of the focal length, 1/f, a measure of how strongly a lens bends light. The unit is the dioptre.' },
    { term: 'Dioptre', also: ['diopter', 'D', 'm⁻¹'], def: 'The unit of optical power: one reciprocal metre. A lens of +1 D has a focal length of 1 m; prescriptions are written in steps of 0.25 D.' },
    { term: 'Effective focal length', also: ['EFL', 'equivalent focal length'], def: 'The focal length of a thick lens or lens system: the distance from its rear principal plane to the rear focal point. It is the number that sets magnification, image size and f-number.' },
    { term: 'Vergence', def: 'The reciprocal of the distance from a point of light, in dioptres: negative for light spreading from a point, positive for light converging to one, zero for parallel light. A lens adds its power to the vergence of the light.' }
  ],
  formulas: [
    {
      name: 'Optical power',
      expr: 'P = 1/f', tex: 'P = \\frac{1}{f}',
      vars: {
        P: { name: 'optical power', q: 'optpower', unit: 'D', signed: true },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50, signed: true }
      },
      note: 'f in metres gives P in dioptres. Negative for a diverging lens.',
      stories: { P: 'A camera lens has a focal length of {f}. What is its power?', f: 'A magnifier is marked {P}. What is its focal length?' }
    },
    {
      name: 'Thin lenses in contact',
      expr: 'P = P1 + P2', tex: 'P = P_1 + P_2',
      vars: {
        P: { name: 'power of the pair', q: 'optpower', unit: 'D', signed: true },
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 20, signed: true, tex: 'P_1' },
        P2: { name: 'power of the second lens', q: 'optpower', unit: 'D', value: 2, signed: true, tex: 'P_2' }
      },
      note: 'Exact only for thin lenses touching each other; with a gap the second lens sees different vergence (see lenses in combination).',
      stories: { P: 'A {P1} camera lens carries a {P2} close-up lens. What is the power of the combination?' }
    },
    {
      name: 'Size of the image of a distant object',
      expr: 'h = f*tan(theta)', tex: 'h = f\\,\\tan\\theta',
      vars: {
        h: { name: 'height of the image', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        theta: { name: 'angle the object subtends', q: 'angle', unit: '°', value: 0.53, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For an object at infinity the image lies in the focal plane. The Sun subtends 0.53°.',
      stories: { h: 'A lens of focal length {f} forms an image of an object that subtends {theta}. How tall is the image?' }
    }
  ],
  examples: [
    {
      title: 'A close-up lens on a camera',
      q: 'A camera lens of focal length 50 mm carries a +2 D close-up lens screwed on in front. What is the focal length of the pair, and at what distance is an object in focus when the camera is set to infinity?',
      steps: [
        { text: 'The camera lens has $P_1 = 1/0.050 = +20$ D. In contact the powers add:', tex: 'P = 20 + 2 = 22\\ \\mathrm{D} \\quad\\Rightarrow\\quad f = \\frac{1}{22} = 45.5\\ \\mathrm{mm}' },
        'Set to infinity, the camera expects parallel light. The close-up lens converts light from a point at distance $1/(2\\ \\mathrm{D}) = 0.5$ m into exactly that.'
      ],
      a: 'f = 45.5 mm; focused at infinity, the camera sees sharply an object 0.5 m in front of the close-up lens.'
    },
    {
      title: 'The Sun in a magnifier',
      q: 'A magnifying glass of focal length 100 mm and 50 mm diameter is held in sunlight. How big is the image of the Sun, and by what factor is the sunlight concentrated?',
      steps: [
        { text: 'The Sun subtends 0.53° (9.3 mrad), so in the focal plane', tex: 'h = f\\tan\\theta = 100 \\times 0.0093 = 0.93\\ \\mathrm{mm}' },
        'The lens collects light over a disc of 50 mm and delivers it into a disc of 0.93 mm: an area ratio of $(50/0.93)^2 \\approx 2900$, neglecting losses.'
      ],
      a: 'A disc 0.93 mm across, with the sunlight concentrated nearly three thousand times: enough to scorch paper.'
    }
  ],
  quiz: [
    { q: 'A lens has a power of +8 D. What is its focal length?', choices: ['8 mm', '125 mm', '80 mm', '0.8 m'], a: 1, why: '$f = 1/P = 1/8$ m = 0.125 m = 125 mm. 80 mm would be +12.5 D.' },
    { q: 'Two thin lenses of +3 D and −1 D are pressed together. What is the power of the pair?', choices: ['+4 D', '+3 D', '+2 D', '−2 D'], a: 2, why: 'Powers add in contact: $3 + (-1) = +2$ D, a focal length of 500 mm.' },
    { q: 'The focal lengths of two thin lenses in contact add up to give the focal length of the pair.', a: false, why: 'It is the powers that add. Two lenses of 100 mm in contact give 50 mm, not 200 mm.' },
    { q: 'Which lens bends light the most?', choices: ['+1 D', '+2.5 D', '+5 D', '+20 D'], a: 3, why: 'Power measures bending: +20 D has a focal length of 50 mm, +1 D of a metre.' },
    { q: 'Reading spectacles are marked +2.5 D. What is their focal length in millimetres?', answer: 400, unit: 'mm', why: '$f = 1/2.5\\ \\mathrm{D} = 0.4$ m = 400 mm.' }
  ],
  applications: [
    'Spectacles and contact lenses are specified in dioptres, because the powers of lenses worn together (or a lens plus the eye) simply add.',
    'Cameras: the focal length in mm decides, with the sensor size, how wide the picture is; close-up filters are sold in +1, +2 and +4 D.',
    'Microscopes: with a 200 mm tube lens a 20× objective has a focal length of 10 mm (+100 D).',
    'Telescopes: a long objective of 1 m or more is a weak lens of 1 D or less, which is why it forms a large image of the Moon.',
    'The eye: about 60 D in total, of which the cornea provides nearly three quarters.'
  ],
  history: 'Until the 1870s opticians numbered spectacle lenses by their focal length in inches, which made combining them an exercise in fractions. The French ophthalmologist Ferdinand Monoyer proposed the dioptre in 1872, a unit in which the powers of lenses in contact add.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the focal length and focal points of thin lenses.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the powers of the cornea, the crystalline lens and the whole eye.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the definitions of power and focal length for spectacle lenses.'
  ],
  sim: 'tl-power'
},

/* ================================================================ the thin-lens equation */
{
  id: 'the-thin-lens-equation', parent: 'thin-lenses', title: 'The thin-lens equation', level: 1,
  short: 'For a thin lens of focal length f, an object at distance sₒ makes an image at distance sᵢ given by 1/sₒ + 1/sᵢ = 1/f, magnified by m = −sᵢ/sₒ. One equation tells where the image is, how large it is, and whether it is real or virtual.',
  keywords: ['thin lens equation', 'lens formula', 'Gaussian lens equation', 'object distance', 'image distance', 'so', 'si', 'conjugate', 'conjugate points', '2f', 'imaging condition', 'Bessel method', 'lens law'],
  prereq: ['focal-length-and-optical-power', 'lens-shapes-and-names'],
  related: ['real-and-virtual-images', 'lens-ray-diagrams', 'lateral-and-longitudinal-magnification', 'newtons-lens-equation', 'thick-lenses-and-principal-planes', 'focusing-a-lens', 'measuring-focal-length-and-radius', 'physics:thin-lenses'],
  body: `
Where does a lens put the image? For a thin lens the answer is one short equation. This page, like the next ones, uses the **"real is positive" convention**: the object distance $s_o$ is positive in front of the lens; the image distance $s_i$ is positive *behind* the lens (a real image) and negative in front (a virtual one); $f>0$ for a converging lens.

$$\\frac{1}{s_o}+\\frac{1}{s_i}=\\frac{1}{f}\\qquad m=-\\frac{s_i}{s_o}\\qquad\\Longrightarrow\\qquad s_i=\\frac{s_o f}{s_o-f}$$

The lateral magnification $m$ is the height of the image divided by the height of the object; a negative $m$ means the image is inverted. The equation holds for rays near the axis and a lens whose thickness can be neglected ([[the-paraxial-approximation]]); [[thick-lenses-and-principal-planes|thick lenses]] need the distances measured from the principal planes.

### Walking an object up to a lens
Take $f=100$ mm and move the object closer:

| $s_o$ | $s_i$ | $m$ | The image |
|---|---|---|---|
| ∞ | 100 mm | 0 | a point at F′ |
| 400 mm | 133 mm | −0.33 | real, inverted, reduced |
| 300 mm | 150 mm | −0.50 | real, inverted, reduced |
| 200 mm (2f) | 200 mm | −1.00 | real, inverted, same size |
| 150 mm | 300 mm | −2.00 | real, inverted, magnified |
| 120 mm | 600 mm | −5.00 | real, inverted, magnified |
| 100 mm (f) | ∞ | — | none: the rays leave parallel |
| 50 mm | −100 mm | +2.00 | virtual, upright, magnified |

Three landmarks stand out. At **$s_o=2f$** the image is at $2f$ too, the same size: the object–image distance of $4f$ is the shortest possible for a real image. At **$s_o=f$** the image jumps to infinity (a projector slide a little too close, a collimator). Inside $f$ the image is **virtual**, upright and magnified: the magnifying glass.

### Diverging lenses
For $f<0$ the equation gives a negative $s_i$ for every real object. The image is always virtual, upright, reduced and lies between the lens and its focal point: with $f=-100$ mm and $s_o=300$ mm, $s_i=-75$ mm and $m=+0.25$.

### Other conventions
Many books write $1/s' - 1/s = 1/f$ with distances measured along the light (so $s<0$ for a real object). It is the same physics with different signs; lens-design software and [[ray-transfer-matrices|ABCD matrices]] use it. Check which convention a source uses before mixing formulas.

> [!key] $1/s_o + 1/s_i = 1/f$ and $m = -s_i/s_o$. Beyond 2f the image is smaller, between f and 2f larger, at f at infinity, inside f virtual — and a real image needs at least $4f$ between object and image.
`,
  ideas: [
    'In the "real is positive" convention, 1/sₒ + 1/sᵢ = 1/f and m = −sᵢ/sₒ; a positive sᵢ is a real image behind the lens, a negative one a virtual image in front.',
    'Object at 2f gives an image at 2f, inverted and life size; the object–image distance of 4f is the smallest possible for a real image.',
    'An object at the focal point gives no image: the rays leave parallel (the image is at infinity).',
    'Inside the focal length the image is virtual, upright and magnified; a diverging lens always gives a virtual, upright, reduced image.',
    'The equation is paraxial and for thin lenses; measure from the principal planes for a thick lens.'
  ],
  pitfalls: [
    'The image forms at the focal point — Only when the object is at infinity. For a nearer object the image is farther behind the lens than f; a 50 mm lens focused on a subject 2 m away has its image 51.3 mm behind it.',
    'A negative image distance means there is no image — It means a virtual image on the same side as the object. It exists perfectly well for an eye or a camera, but not on a screen.',
    'You can use the equation with distances measured from the glass of a thick lens — It needs the object and image distances measured from the principal planes. With a thick lens, using the surfaces can be several millimetres out.',
    'Moving the object by 1 mm moves the image by 1 mm — It moves by m² millimetres: far less than 1 mm for a reduced image, far more for a magnified one (see magnification).'
  ],
  terms: [
    { term: 'Object distance', also: ['sₒ', 's', 'u'], def: 'The distance from the lens to the object, positive when the object is in front of the lens (the real-is-positive convention).' },
    { term: 'Image distance', also: ['sᵢ', "s′", 'v'], def: 'The distance from the lens to the image. Positive behind the lens (a real image), negative in front of it (a virtual image).' },
    { term: 'Thin-lens equation', also: ['lens formula', 'Gaussian lens equation', 'lens law'], def: '1/sₒ + 1/sᵢ = 1/f: the relation between object distance, image distance and focal length of a thin lens.' },
    { term: 'Conjugate points', also: ['conjugates', 'conjugate planes'], def: 'An object point and its image point: each is the image of the other, and light from one is brought to the other. The two distances sₒ and sᵢ are the conjugate distances.' },
    { term: 'Thin lens', def: 'A lens whose thickness is small compared with its focal length and the distances involved, so that it can be treated as a single refracting plane.' }
  ],
  derivation: {
    title: 'The lens equation from similar triangles',
    intro: 'Take an object of height $h$ at distance $s_o$ and follow two rays from its tip: the one through the centre of the lens, which is not deviated, and the one parallel to the axis, which leaves through the far focal point. Let the image have height $h\'$ (a positive number, the image being inverted) at distance $s_i$.',
    steps: [
      { text: 'The ray through the centre makes two similar triangles, one on each side of the lens:', tex: '\\frac{h\'}{h} = \\frac{s_i}{s_o}' },
      { text: 'The ray that left parallel to the axis at height $h$ reaches the axis at F′, a distance $f$ behind the lens, and continues to the image tip. Two more similar triangles, on the image side, give', tex: '\\frac{h\'}{h} = \\frac{s_i - f}{f}' },
      { text: 'Equate the two ratios:', tex: '\\frac{s_i}{s_o} = \\frac{s_i - f}{f} \\;\\Rightarrow\\; s_i f = s_o s_i - s_o f' },
      { text: 'Divide through by $s_o s_i f$:', tex: '\\frac{1}{s_o} = \\frac{1}{f} - \\frac{1}{s_i} \\;\\Rightarrow\\; \\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}' }
    ]
  },
  formulas: [
    {
      name: 'The thin-lens equation',
      expr: '1/so + 1/si = 1/f', tex: '\\frac{1}{s_o} + \\frac{1}{s_i} = \\frac{1}{f}',
      vars: {
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 300, signed: true, tex: 's_o' },
        si: { name: 'image distance (negative: virtual)', q: 'length', unit: 'mm', signed: true, tex: 's_i' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100, signed: true }
      },
      solveFor: 'si',
      note: 'Real is positive. A negative result for sᵢ is a virtual image in front of the lens.',
      stories: { si: 'A lens of focal length {f} has an object {so} in front of it. Where is the image?', so: 'A lens of focal length {f} makes an image {si} from itself. How far in front of the lens is the object?', f: 'An object {so} in front of a lens has its image {si} from it. What is the lens\'s focal length?' }
    },
    {
      name: 'Lateral magnification',
      expr: 'm = -si/so', tex: 'm = -\\frac{s_i}{s_o}',
      vars: {
        m: { name: 'magnification (negative: inverted)', signed: true },
        si: { name: 'image distance', q: 'length', unit: 'mm', value: 150, signed: true, tex: 's_i' },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 300, signed: true, tex: 's_o' }
      },
      stories: { m: 'An image forms {si} behind a lens for an object {so} in front. What is the magnification?' }
    },
    {
      name: 'Bessel\'s method: focal length from two lens positions',
      expr: 'f = (L^2 - d^2)/(4*L)', tex: 'f = \\frac{L^2 - d^2}{4L}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm' },
        L: { name: 'distance between object and screen (more than 4f)', q: 'length', unit: 'mm', value: 600, min: 1, max: 100000 },
        d: { name: 'distance between the two lens positions that give a sharp image', q: 'length', unit: 'mm', value: 346.4 }
      },
      note: 'With the object and screen fixed L apart, a lens of focal length f gives a sharp image at two positions when L > 4f. Measure L and d, and f follows without knowing where the lens "is".',
      stories: { f: 'An object and a screen are {L} apart. A lens gives a sharp image in two positions, {d} apart. What is its focal length?' }
    }
  ],
  examples: [
    {
      title: 'Focusing a camera lens',
      q: 'A 50 mm lens is focused on a subject 2 m in front of it. How far is the sensor from the lens, how far has the lens moved from its infinity position, and what is the magnification?',
      steps: [
        { text: 'Solve the equation for the image distance:', tex: 's_i = \\frac{s_o f}{s_o - f} = \\frac{2000 \\times 50}{2000 - 50} = 51.28\\ \\mathrm{mm}' },
        'At infinity the sensor sits 50 mm behind the lens, so the lens has moved out by 1.28 mm.',
        { text: 'The magnification is', tex: 'm = -\\frac{s_i}{s_o} = -\\frac{51.28}{2000} = -0.0256' }
      ],
      a: 's_i = 51.3 mm: the lens moves 1.3 mm forward and the subject is imaged at 1:39, upside down.'
    },
    {
      title: 'A slide projector',
      q: 'A projector lens of focal length 100 mm has the slide 105 mm behind it (between the lens and the lamp). Where is the screen, and how large is the picture of a 36 mm wide slide?',
      steps: [
        { text: 'The slide is the object, so $s_o = 105$ mm and', tex: 's_i = \\frac{105 \\times 100}{105 - 100} = 2100\\ \\mathrm{mm}' },
        { text: 'The magnification is', tex: 'm = -\\frac{2100}{105} = -20' },
        'The picture is $20 \\times 36 = 720$ mm wide, and upside down — which is why slides are loaded inverted.'
      ],
      a: 'The screen is 2.1 m from the lens and the picture 0.72 m wide. Focusing is delicate: a millimetre more or less between slide and lens moves the sharp image by about half a metre.'
    }
  ],
  quiz: [
    { q: 'An object stands 300 mm in front of a thin lens of focal length 100 mm. Where is the image?', choices: ['75 mm behind the lens', '150 mm behind the lens', '150 mm in front of the lens', '300 mm behind the lens'], a: 1, why: '$s_i = s_o f/(s_o - f) = 300 \\times 100/200 = 150$ mm, positive: real, behind the lens, with $m = -0.5$.' },
    { q: 'An object is placed at twice the focal length of a converging lens. The image is…', choices: ['real, inverted, the same size, at 2f', 'real, upright, magnified', 'virtual, upright, the same size', 'at infinity'], a: 0, why: '$s_o = 2f$ gives $s_i = 2f$ and $m = -1$. It is the symmetrical case, and the object–image distance, $4f$, is the least possible for a real image.' },
    { q: 'A diverging lens can form a real image of a real object.', a: false, why: 'With $f<0$ and $s_o>0$, $s_i = s_o f/(s_o - f)$ is always negative: the image is virtual, upright and reduced.' },
    { q: 'A lens of focal length 50 mm images an object that is 150 mm in front of it. How far behind the lens, in millimetres, is the image?', answer: 75, unit: 'mm', why: '$s_i = 150 \\times 50/(150 - 50) = 75$ mm; the magnification is $-0.5$.' },
    { q: 'The object is moved from 3f to 1.5f from a converging lens. The image…', choices: ['gets larger and moves away from the lens', 'gets larger and moves towards the lens', 'gets smaller and moves away', 'stays the same size'], a: 0, why: 'At 3f the image is at 1.5f with $m=-0.5$; at 1.5f it is at 3f with $m=-2$. Bringing the object closer pushes the image farther out and makes it larger.' }
  ],
  applications: [
    'Camera focusing: the lens (or an internal group) moves by the difference between sᵢ and f — about 1.3 mm for a 50 mm lens between infinity and 2 m.',
    'Projectors and enlargers: the small slide or negative sits just outside f; a small movement of the lens moves the sharp image by a metre.',
    'The optical bench: measuring a focal length by imaging an object at several distances, or by Bessel\'s two-position method.',
    'Machine vision: choosing the focal length and the working distance that give a required magnification on a sensor.',
    'Everyday: the lens of the eye changes its power to keep sᵢ equal to the fixed distance to the retina as sₒ changes.'
  ],
  history: 'Johannes Kepler laid the foundations of lens theory in his *Dioptrice* (1611). The compact form with reciprocal distances became standard in the nineteenth century, after Carl Friedrich Gauss\'s *Dioptrische Untersuchungen* (1841) set out the first-order theory of centred lens systems in full.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the thin lens equation and the sign convention.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapters on thin lenses.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — the lens equation and magnification on one page.'
  ],
  sim: { id: 'tl-equation', params: { mode: 'gauss' } }
},

/* ================================================================ real and virtual images */
{
  id: 'real-and-virtual-images', parent: 'thin-lenses', title: 'Real and virtual images', level: 1,
  short: 'A real image is made of light that really converges: a screen placed there shows it. A virtual image is where diverging light only seems to come from: no screen can catch it, but an eye or a camera can see it. The sign of the image distance tells which one a lens has made.',
  keywords: ['real image', 'virtual image', 'virtual object', 'screen', 'image plane', 'aerial image', 'magnifying glass', 'mirror image', 'upright', 'inverted', 'diverging rays', 'can a virtual image be photographed', 'projection'],
  prereq: ['the-thin-lens-equation', 'lens-ray-diagrams'],
  related: ['lateral-and-longitudinal-magnification', 'the-magnifier', 'plane-mirror-images', 'combining-thin-lenses', 'how-a-camera-works', 'the-eye-as-a-camera', 'physics:thin-lenses'],
  body: `
The words *real* and *virtual* describe what the light does, not whether an image "exists". Both kinds are seen every day, and both can be photographed.

### Real images
After a converging lens, the rays from each point of the object come together again at a point. At that point the light is really there: the rays pass through it and carry on. The picture made of all such points is a **real image**. Put a sheet of paper, a sensor or a cinema screen in that plane and the picture appears; the paper scatters the light in every direction, so it can be seen from any side. Take the paper away and the rays continue: an eye farther along the axis, beyond the image, sees it hanging in the air, upside down.

### Virtual images
When the rays leave the lens still *spreading*, they never meet. An eye or a camera receiving them traces each one straight back and finds that they all seem to start from one point behind the lens. The picture made of such points is a **virtual image**. No light goes through it, so a screen placed there stays dark. The image in a plane mirror is virtual; so is the enlarged view through a magnifying glass, and the shrunken view through a negative lens.

### Telling them apart
In the "real is positive" convention the sign of the image distance $s_i$ says it: positive means real, behind the lens; negative means virtual, on the object's side.

| Lens | Object | Image |
|---|---|---|
| converging | farther than $f$ | real, inverted |
| converging | closer than $f$ | virtual, upright, magnified |
| diverging | anywhere | virtual, upright, reduced |

### Can a virtual image be photographed?
Yes. A camera needs no light to pass *through* an image, only light that *diverges as if from* it. The camera's own lens (or the lens of the eye) turns that diverging light into converging light and makes a real image on the sensor or the retina. To photograph your face in a mirror 1.5 m away you focus at 3 m, the distance of the virtual image. A magnifying glass of $f=50$ mm held 41.7 mm from a stamp makes a virtual image 250 mm away, six times larger — and 250 mm is the conventional distance for comfortable viewing.

### Virtual objects
Light that is already converging towards a point can be intercepted by a second lens before it gets there. For that lens the point is a **virtual object**: it is behind the lens, so $s_o<0$, and the lens equation still works. This is how the image of one lens becomes the object of the next ([[combining-thin-lenses]]).

> [!key] A real image is where light really converges: a screen catches it. A virtual image is where light only seems to come from: a screen cannot, but an eye or a camera can. Positive $s_i$ is real, negative is virtual.
`,
  ideas: [
    'In a real image the rays truly meet, and a screen at that plane shows the picture; the screen scatters the light so it can be seen from any side.',
    'In a virtual image the rays only seem to come from a point: no light passes through it and a screen there stays dark.',
    'With the real-is-positive convention, sᵢ > 0 is a real image behind the lens and sᵢ < 0 a virtual image on the object side.',
    'A converging lens gives a real image of an object beyond f and a virtual, upright, magnified one inside f; a diverging lens always gives a virtual one.',
    'A virtual image can be seen and photographed, because the eye or camera lens turns the diverging rays back into a real image.'
  ],
  pitfalls: [
    'A virtual image is not really there, so it cannot be photographed — The rays are there; they only fail to meet. A camera or an eye turns them into a real image on its own sensor. Every selfie in a mirror is a photograph of a virtual image.',
    'A real image can only be seen on a screen — A real image in free air is visible to an eye placed beyond it, where the rays have crossed and spread again. A screen merely scatters the light so that many people can see it.',
    'Virtual images are always bigger than the object — A negative lens and a convex mirror give virtual images that are smaller; a plane mirror gives one of exactly the same size.',
    'Real images are always inverted and virtual images always upright — That holds for a single thin lens, but it is a consequence, not a definition. After two lenses a real image can be upright; what matters is whether the light converges.'
  ],
  terms: [
    { term: 'Real image', def: 'An image formed where the light rays actually converge. It can be caught on a screen or a sensor placed in its plane, and has a positive image distance in the real-is-positive convention.' },
    { term: 'Virtual image', def: 'An image from which diverging rays only appear to come. No light passes through it and no screen can show it, but an eye or camera sees it. It has a negative image distance in the real-is-positive convention.' },
    { term: 'Virtual object', def: 'A point towards which the light is converging when it meets a lens or mirror, but which it never reaches because the surface intervenes. Its object distance is negative.' },
    { term: 'Image plane', also: ['focal plane array', 'sensor plane'], def: 'The plane in which the points of the real image of a flat object lie. A sensor is placed in it, and the plane is where a screen shows the image sharp.' },
    { term: 'Aerial image', def: 'A real image formed in free air with no screen, visible to an eye placed beyond it; the principle of a relay lens or of the "floating image" of two facing concave mirrors.' }
  ],
  formulas: [
    {
      name: 'Object distance that gives a virtual image at a chosen distance',
      expr: 'so = f*d/(f + d)', tex: 's_o = \\frac{f\\,d}{f + d}',
      vars: {
        so: { name: 'object distance (inside the focal length)', q: 'length', unit: 'mm', tex: 's_o' },
        f: { name: 'focal length of the converging lens', q: 'length', unit: 'mm', value: 50 },
        d: { name: 'distance of the virtual image from the lens', q: 'length', unit: 'mm', value: 250 }
      },
      note: 'From the lens equation with sᵢ = −d. The object must lie inside f; the image is upright and larger.',
      stories: { so: 'A magnifier of focal length {f} is used with its virtual image {d} away. How far is the object from the lens?', d: 'A magnifier of focal length {f} is held {so} from an object. How far away does the virtual image appear?' }
    },
    {
      name: 'Magnification when the virtual image is at distance d',
      expr: 'm = 1 + d/f', tex: 'm = 1 + \\frac{d}{f}',
      vars: {
        m: { name: 'magnification (upright)' },
        d: { name: 'distance of the virtual image from the lens', q: 'length', unit: 'mm', value: 250 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      note: 'With the image at the near point (250 mm) a magnifier of focal length f enlarges 1 + 250/f times.',
      stories: { m: 'A {f} magnifier gives a virtual image {d} from the lens. How many times larger is the image than the object?' }
    }
  ],
  examples: [
    {
      title: 'Using a magnifier',
      q: 'A magnifying glass of focal length 50 mm is to show a stamp as a virtual image 250 mm away. How far from the lens must the stamp be, and how large does it appear?',
      steps: [
        { text: 'The virtual image has $s_i = -250$ mm. The lens equation gives the object distance:', tex: '\\frac{1}{s_o} = \\frac{1}{50} + \\frac{1}{250} = \\frac{6}{250} \\;\\Rightarrow\\; s_o = 41.7\\ \\mathrm{mm}' },
        { text: 'The magnification is', tex: 'm = -\\frac{s_i}{s_o} = \\frac{250}{41.7} = +6' }
      ],
      a: 'The stamp is 41.7 mm from the lens, 8.3 mm inside the focal length; the image is upright and six times larger.'
    },
    {
      title: 'Photographing a mirror',
      q: 'You stand 1.5 m in front of a wall mirror and photograph your reflection. To what distance must the camera be focused?',
      steps: [
        'A plane mirror makes a virtual image as far behind the mirror as the object is in front of it: 1.5 m behind the mirror.',
        'The camera is 1.5 m in front of the mirror, so the light reaching it is diverging from a point $1.5 + 1.5 = 3$ m away.'
      ],
      a: '3 m — not the 1.5 m to the glass. Focus on the mirror itself and your reflection is out of focus.'
    }
  ],
  quiz: [
    { q: 'Which kind of image can be shown on a white screen?', choices: ['a real image', 'a virtual image', 'both', 'neither'], a: 0, why: 'A screen scatters light that arrives at it. A real image is where light converges, so the screen shows a picture; at a virtual image there is no light to scatter.' },
    { q: 'A converging lens forms a virtual image when the object is…', choices: ['beyond twice the focal length', 'exactly at the focal length', 'closer to the lens than the focal length', 'infinitely far away'], a: 2, why: 'Inside $f$, $s_i = s_o f/(s_o - f)$ is negative: the rays leave diverging and appear to come from a point behind the object. That is the magnifying glass.' },
    { q: 'A virtual image cannot be photographed.', a: false, why: 'A camera lens converts the diverging rays into a real image on the sensor. Pictures of reflections in mirrors, and of anything seen through a magnifier, are photographs of virtual images.' },
    { q: 'A diverging lens forms…', choices: ['a real, inverted image of a distant object', 'a virtual, upright, reduced image of any real object', 'a virtual, magnified image of near objects only', 'no image at all'], a: 1, why: 'For $f<0$ the image distance is always negative and the magnification, $-s_i/s_o$, always between 0 and 1.' },
    { q: 'A magnifier of focal length 100 mm is held so that the virtual image is 250 mm from the lens. How far, in millimetres, is the object from the lens?', answer: 71.4, unit: 'mm', why: '$s_o = fd/(f+d) = 100 \\times 250/350 = 71.4$ mm, 28.6 mm inside the focal length.' }
  ],
  applications: [
    'Cameras, projectors and the eye all rest on real images: the sensor, the screen and the retina are the places the light converges.',
    'Magnifiers, loupes and microscope eyepieces present a virtual image at a comfortable distance for the eye.',
    'Spectacles for short sight use a negative lens to place a virtual image of the distant world at the eye\'s far point.',
    'Head-up displays and head-mounted displays put a virtual image a metre or more in front of the user, so that the eye can focus on it.',
    'Mirrors in the bathroom, in cars and in telescopes: plane mirrors give virtual images at the same distance behind the glass.'
  ],
  history: 'Johannes Kepler first explained in 1604 that the eye forms an inverted *real* image on the retina, and in his *Dioptrice* (1611) described the telescope made from two convex lenses, whose objective forms a real image that the eyepiece then magnifies as a virtual one.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — real and virtual images, and real and virtual objects.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — images formed by thin lenses.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — object and image types.'
  ],
  sim: { id: 'tl-images', params: { so: 150, f: 80, recv: 'screen', screen: 171 } }
},

/* ================================================================ ray diagrams for lenses */
{
  id: 'lens-ray-diagrams', parent: 'thin-lenses', title: 'Ray diagrams for lenses', level: 1,
  short: 'A ray diagram finds an image with a ruler: from the tip of the object draw the ray parallel to the axis, the ray through the centre and the ray through the focal point. Where they meet, or where their backward extensions meet, is the image of the tip.',
  keywords: ['ray diagram', 'principal rays', 'three rays', 'ray tracing by hand', 'parallel ray', 'central ray', 'focal ray', 'construct an image', 'F and F prime', 'graphical method', 'finding the image'],
  prereq: ['focal-length-and-optical-power', 'the-thin-lens-equation'],
  related: ['real-and-virtual-images', 'lateral-and-longitudinal-magnification', 'chief-and-marginal-rays', 'curved-mirrors', 'mirror-ray-diagrams', 'the-paraxial-approximation', 'physics:thin-lenses'],
  body: `
A ray diagram is a recipe for finding an image with a ruler. Draw a few rays whose paths you can predict, see where they meet, and you know where the image is, how big, and which way up. It needs no arithmetic, and it makes the lens equation visible.

### The lens as a plane
In a thin-lens diagram the lens is a vertical line, with arrowheads at its ends pointing outwards for a converging lens and inwards for a diverging one. All the bending is done at that line. The horizontal line through its centre is the optical axis. The two **focal points** are marked at a distance $f$ on each side of the lens: **F** on the object side and **F′** on the image side of a converging lens (for a diverging lens F′ is on the object side).

### Three rays you can predict
From the tip of the object of a **converging** lens:

1. a ray **parallel to the axis**, which leaves the lens heading for the back focal point F′;
2. a ray **through the centre** of the lens, which goes straight on (the two faces there are parallel, like a thin plate);
3. a ray **through the front focal point F**, which leaves the lens parallel to the axis.

Any two of them locate the image of the tip, where they cross; the third is a check. Drop a perpendicular to the axis and the whole image is drawn.

For a **diverging** lens the rules are the same shape: (1) a ray parallel to the axis leaves as if it came from F′, on the object side; (2) the ray through the centre goes straight; (3) a ray aimed at the far focal point F leaves parallel to the axis. The refracted rays now spread and never cross; their *backward extensions*, drawn dashed, meet at the **virtual image**.

### Reading the diagram
| Object (converging lens) | Image |
|---|---|
| beyond 2F | real, inverted, smaller, between F′ and 2F′ |
| at 2F | real, inverted, the same size, at 2F′ |
| between F and 2F | real, inverted, larger, beyond 2F′ |
| at F | rays leave parallel: image at infinity |
| inside F | virtual, upright, larger, on the object's side |

### Construction rays and real rays
The three rays are *constructions*: they are chosen because their paths are known, not because they carry the light. The ray through F may even miss the real glass, if the lens is small. What makes the method work is that **every** ray from the tip, through any part of the lens, goes to the same image point. That is why covering half the lens does not cut the image in half: the whole picture still forms, only dimmer.

### What a diagram does not show
A thin-lens diagram is paraxial. Its heights are exaggerated so that the angles are visible; real lenses used far from the axis give [[what-aberrations-are|aberrations]] that no ruler construction predicts. Draw the diagram to understand the layout, and check the numbers with the equation.

> [!key] Three rays: parallel then through F′; through the centre; through F then parallel. Where they meet is the image of the tip; if they spread, extend them back with dashes for a virtual image.
`,
  ideas: [
    'The thin lens is drawn as one plane; all the bending happens at it.',
    'Three rays are predictable: parallel to the axis then through F′, through the centre undeviated, and through F then parallel to the axis.',
    'The image of the tip is where two of the rays cross, or where their backward extensions cross if they spread (a virtual image).',
    'The three rays are constructions; every ray from the tip goes to the same image point, so covering part of the lens only dims the image.',
    'A diagram is paraxial and exaggerates heights: use it for the layout, and the equation for the numbers.'
  ],
  pitfalls: [
    'Covering the top half of the lens removes the bottom half of the image — Every point of the object sends light through every part of the lens, so the whole image remains. It gets dimmer (and a little less sharp), not cropped.',
    'Rays bend at the surfaces drawn on the glass — In a thin-lens diagram the bending is drawn at the central plane; the real rays bend at the two curved faces, a millimetre or two apart. The result is the same to first order.',
    'Only three rays go through the lens — A lens passes a whole cone of rays from every point of the object. The three rays are only the ones that are easy to draw.',
    'In a virtual image the refracted rays cross somewhere behind the lens — They spread and never cross. Only their backward extensions, the dashed lines, meet, on the object\'s side of the lens.'
  ],
  terms: [
    { term: 'Principal rays', also: ['three principal rays', 'construction rays'], def: 'The rays whose paths through a thin lens are known without calculation: the ray parallel to the axis (then through F′), the ray through the centre (undeviated) and the ray through F (then parallel to the axis).' },
    { term: 'Optical axis', def: 'The straight line through the centres of curvature of the lens surfaces: the line of symmetry of the system. Distances along it are measured from the lens.' },
    { term: 'Focal plane', def: 'The plane through a focal point perpendicular to the axis. Parallel rays arriving at an angle focus to a point in the back focal plane; every point of the front focal plane sends its light out parallel.' },
    { term: 'Virtual ray', also: ['back-projection', 'dashed ray'], def: 'The backward extension, drawn dashed, of a ray that leaves a lens spreading. Where such extensions meet lies the virtual image; no light travels along them.' }
  ],
  formulas: [
    {
      name: 'Height of the image',
      expr: 'hi = ho*f/(f - so)', tex: 'h_i = h_o\\,\\frac{f}{f - s_o}',
      vars: {
        hi: { name: 'height of the image (negative: inverted)', q: 'length', unit: 'mm', signed: true, tex: 'h_i' },
        ho: { name: 'height of the object', q: 'length', unit: 'mm', value: 30, tex: 'h_o' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100, signed: true },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 150, tex: 's_o' }
      },
      note: 'What the three-ray construction gives, written as a formula. Positive for an upright (virtual) image, negative for an inverted (real) one.',
      stories: { hi: 'A {ho} tall object stands {so} in front of a lens of focal length {f}. How tall, and which way up, is the image?' }
    },
    {
      name: 'Deviation of a ray by a thin lens',
      expr: 'delta = h/f', tex: '\\delta = \\frac{h}{f}',
      vars: {
        delta: { name: 'angle through which the lens turns the ray', q: 'angle', unit: 'mrad', tex: '\\delta' },
        h: { name: 'height at which the ray meets the lens', q: 'length', unit: 'mm', value: 10 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'For small angles. A ray through the centre (h = 0) is not deviated; the deviation grows in proportion to the height, which is why a lens focuses.',
      stories: { delta: 'A ray strikes a lens of focal length {f} at a height of {h} above the axis. By how much does the lens turn it?' }
    }
  ],
  examples: [
    {
      title: 'Drawing the image of an arrow',
      q: 'A 30 mm tall arrow stands 150 mm in front of a converging lens of focal length 100 mm. Find the tip of the image with two rays.',
      steps: [
        'Ray 1: the ray parallel to the axis meets the lens at a height of +30 mm and then heads for F′, 100 mm behind: its slope is $-30/100 = -0.3$.',
        'Ray 2: the ray from the tip through the centre has the slope $-30/150 = -0.2$.',
        { text: 'Follow both rays to $z = 300$ mm: ray 1 is at $30 - 0.3\\times300 = -60$ mm and ray 2 at $-0.2\\times 300 = -60$ mm. They meet there:', tex: '(z,\\,y) = (300\\ \\mathrm{mm},\\ -60\\ \\mathrm{mm})' }
      ],
      a: 'The tip of the image is 300 mm behind the lens and 60 mm below the axis: real, inverted, twice the size ($m=-2$), as the lens equation says.'
    },
    {
      title: 'A diverging lens',
      q: 'The same arrow, 30 mm tall, is 300 mm in front of a diverging lens of focal length −100 mm. Where is the image?',
      steps: [
        'Ray 1 meets the lens at +30 mm and leaves as if from F′, 100 mm *in front* of the lens: slope $+30/100 = +0.3$ (rising). Extended backwards it is dashed.',
        'Ray 2 goes through the centre with slope $-30/300 = -0.1$.',
        'At 75 mm in front of the lens ray 2 is at $+7.5$ mm, and ray 1 extended back from $(0,\\ 30)$ is at $30 - 0.3 \\times 75 = +7.5$ mm: they meet there.'
      ],
      a: 'A virtual, upright image 7.5 mm tall, 75 mm in front of the lens ($s_i = -75$ mm, $m = +0.25$).'
    }
  ],
  quiz: [
    { q: 'Which ray leaves a converging lens parallel to the axis?', choices: ['the ray that arrived through the front focal point', 'the ray that arrived through the centre', 'the ray that arrived parallel to the axis', 'none of the three principal rays'], a: 0, why: 'Ray 3 passes through F before the lens and so leaves parallel (it is ray 1 run backwards). Ray 1 goes through F′ afterwards; ray 2 goes straight on.' },
    { q: 'The upper half of a camera lens is covered by a card. The picture is…', choices: ['missing its lower half', 'missing its upper half', 'complete but dimmer', 'unchanged'], a: 2, why: 'Every point of the scene sends light through the whole lens; the uncovered half still brings it to the right image point. The picture is complete and about half as bright.' },
    { q: 'Two principal rays are enough to find the image of a point.', a: true, why: 'Two rays from the tip meet at its image. A third ray is only a check.' },
    { q: 'An object is inside the focal length of a converging lens. After the lens the three rays…', choices: ['meet at a real image', 'spread; their backward extensions meet at a virtual image', 'are parallel', 'cross at the focal point'], a: 1, why: 'Rays from a point nearer than F leave still diverging. Drawn backwards (dashed) they meet at a virtual, upright, magnified image on the object\'s side.' },
    { q: 'A ray strikes a lens of focal length 200 mm 20 mm above the axis. By how many milliradians does the lens turn it?', answer: 100, why: '$\\delta = h/f = 20/200 = 0.1$ rad = 100 mrad (5.7°). Close to the axis the deflection is proportional to the height.' }
  ],
  applications: [
    'Sketching an optical layout before calculating: where a sensor goes, how far to a screen, what a second lens does.',
    'Checking the output of a calculation or of lens-design software: a ray diagram must agree with the equation.',
    'Teaching and exam questions on cameras, projectors, telescopes, microscopes and spectacles.',
    'Designing a simple projector or enlarger, where the position of the lens fixes the size of the picture.',
    'Understanding why a lens can be cut or masked without removing parts of the image.'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the ray-tracing construction for thin lenses.',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — graphical construction of images.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — ray diagrams for positive and negative lenses.'
  ],
  sim: 'tl-ray-diagram'
},

/* ================================================================ magnification */
{
  id: 'lateral-and-longitudinal-magnification', parent: 'thin-lenses', title: 'Magnification: lateral, longitudinal, angular', level: 2,
  short: 'Lateral magnification m = −sᵢ/sₒ is the image height over the object height. Along the axis the stretch is m²: a solid object is imaged squashed or stretched in depth, never as a scaled copy. Angular magnification, for instruments used with the eye, is a different quantity.',
  keywords: ['magnification', 'lateral magnification', 'transverse magnification', 'longitudinal magnification', 'axial magnification', 'angular magnification', 'm squared', 'reproduction ratio', '1:1', 'life size', 'macro', 'image size', 'scale', 'inverted'],
  prereq: ['the-thin-lens-equation', 'lens-ray-diagrams'],
  related: ['angular-magnification', 'the-optical-invariant', 'the-f-number', 'magnification-and-working-distance', 'depth-of-field', 'depth-of-focus', 'newtons-lens-equation', 'physics:magnification'],
  body: `
"Magnification" names three different things, and confusing them is the commonest mistake in the subject.

### Lateral magnification
The **lateral** (or transverse) magnification is the height of the image divided by the height of the object, measured across the axis:

$$m=\\frac{h_i}{h_o}=-\\frac{s_i}{s_o}=\\frac{f}{f-s_o}$$

The sign carries the orientation: negative means inverted, positive upright. The size is $|m|$: $m=-2$ is an inverted image twice as tall. In photography it is the **reproduction ratio**: 1:1 ("life size", $m=-1$) puts a 24 mm object on 24 mm of sensor. For a subject at distance $D$ from the lens, $m=-f/(D-f)\\approx-f/D$: a 50 mm lens at 2 m gives 1:39.

| $s_o$ for $f=100$ mm | $m$ | $m^2$ |
|---|---|---|
| 400 mm | −0.33 | 0.11 |
| 200 mm (2f) | −1.00 | 1.00 |
| 150 mm | −2.00 | 4.0 |
| 120 mm | −5.00 | 25 |
| 105 mm | −20.0 | 400 |

### Longitudinal magnification: m²
Now move the object a small distance $\\delta s_o$ along the axis. The image moves by

$$\\delta s_i = m^2\\,\\delta s_o,$$

always in the *same direction* as the object. So the depth of a solid object is imaged at the scale $m^2$ while its width is imaged at the scale $m$. At $m=-0.1$ a 10 mm deep object is imaged 0.1 mm deep: the image is flattened. At $m=-5$ a depth of 1 mm becomes 25 mm. **The image of a three-dimensional object is not a scaled copy of it** unless $|m|=1$. The simulation shows three identical arrows at three depths; between two of them the exact stretch is $m_1 m_2$.

This is why [[depth-of-focus|depth of focus]] at the sensor is the depth of field at the subject times $m^2$, and why a microscope's depth of field is so tiny.

### Angular magnification
Instruments used with the eye — a magnifier, a telescope, a microscope — do not make a screen image; they change the *angle* the object subtends at the eye. Their figure of merit is the **angular magnification** $M=\\theta'/\\theta$, the angle of the image divided by the angle of the object seen with the unaided eye. A "10×" magnifier means $M=10$, which for a magnifier of focal length $f$ is about $250\\ \\mathrm{mm}/f$ (so $f = 25$ mm): a quite different thing from the image-to-object ratio $m$. See [[angular-magnification]].

### A conservation law behind it
At conjugate planes the lateral magnification $m$ and the angular magnification of the rays $\\gamma$ obey $m\\gamma=n/n'$: an image twice as large is formed by rays converging at half the angle. This is [[the-optical-invariant]], and it is why a bigger image is dimmer: the light is spread over $m^2$ times the area.

> [!key] $m=-s_i/s_o$ across the axis, $m^2$ along it. Negative is inverted. The "×" on a magnifier or a microscope is an angular magnification, a different quantity.
`,
  ideas: [
    'Lateral magnification m = hᵢ/hₒ = −sᵢ/sₒ = f/(f − sₒ); its sign says upright or inverted, |m| says how large.',
    'Longitudinal (axial) magnification is m²: depth is imaged at the scale m², width at m, so a 3-D object is distorted unless |m| = 1.',
    'In photography the reproduction ratio 1:1 means m = −1, a life-size image.',
    'Angular magnification, the "×" of magnifiers, telescopes and microscopes, is the ratio of the angles subtended at the eye, not an image-to-object ratio.',
    'A larger image is dimmer: the light is spread over m² times the area.'
  ],
  pitfalls: [
    'A magnification of −2 means the image is smaller — The sign says inverted; the size is |m| = 2, twice as large. An image is reduced when |m| < 1.',
    'Magnification depends only on the lens — It depends on the focal length and the object distance together, m = f/(f − sₒ). The same lens gives 1:39 at 2 m and 1:1 at 100 mm.',
    'A cube is imaged as a smaller or larger cube — Width goes as m, depth as m². The image of a cube is a distorted block, flattened when |m| < 1 and elongated when |m| > 1.',
    'The 10× on a microscope objective is the magnification you get on any camera — It is the lateral magnification of the intermediate image at the objective\'s design tube length. A camera adapter with a 0.5× reducing lens halves it, and the display scales the picture again.'
  ],
  terms: [
    { term: 'Lateral magnification', also: ['transverse magnification', 'm', 'linear magnification'], def: 'The height of the image divided by the height of the object, measured across the axis: m = −sᵢ/sₒ. Negative for an inverted image.' },
    { term: 'Longitudinal magnification', also: ['axial magnification', 'depth magnification', 'm²'], def: 'The ratio of a small displacement of the image to the displacement of the object along the axis. For a lens in air it is m², always positive.' },
    { term: 'Angular magnification', also: ['M', 'magnifying power', 'visual magnification'], def: 'For an instrument used with the eye, the angle subtended by the image divided by the angle subtended by the object seen without the instrument. The "×" marked on magnifiers, binoculars and eyepieces.' },
    { term: 'Reproduction ratio', also: ['1:1', 'life size', 'magnification ratio', 'macro ratio'], def: 'The photographic name for |m|: the size of the image on the sensor divided by the size of the object. 1:1 is life size; "macro" lenses reach 1:1 or beyond.' }
  ],
  formulas: [
    {
      name: 'Lateral magnification from the distances',
      expr: 'm = -si/so', tex: 'm = -\\frac{s_i}{s_o}',
      vars: {
        m: { name: 'lateral magnification', signed: true },
        si: { name: 'image distance', q: 'length', unit: 'mm', value: 150, signed: true, tex: 's_i' },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 300, tex: 's_o' }
      },
      stories: { m: 'A lens makes an image {si} behind it of an object {so} in front. What is the magnification?' }
    },
    {
      name: 'Lateral magnification from the focal length',
      expr: 'm = f/(f - so)', tex: 'm = \\frac{f}{f - s_o}',
      vars: {
        m: { name: 'lateral magnification', signed: true },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100, signed: true },
        so: { name: 'object distance', q: 'length', unit: 'mm', value: 150, tex: 's_o' }
      },
      note: 'Negative for a real image (object beyond f), positive for a virtual one.',
      stories: { m: 'An object is {so} from a lens of focal length {f}. What is the magnification?', so: 'A lens of focal length {f} is to give a magnification of {m}. How far from the lens must the object be?' }
    },
    {
      name: 'Longitudinal magnification',
      expr: 'mL = m^2', tex: 'm_L = m^2',
      vars: {
        mL: { name: 'longitudinal magnification', tex: 'm_L' },
        m: { name: 'lateral magnification', value: -2, signed: true }
      },
      note: 'For a lens in air and small depths. The exact stretch between two object planes is the product m₁m₂ of their lateral magnifications.',
      stories: { mL: 'An image is formed with a lateral magnification of {m}. By what factor is depth stretched?' }
    },
    {
      name: 'Magnification of a camera lens for a distant subject',
      expr: 'm = f/(D - f)', tex: '|m| = \\frac{f}{D - f}',
      vars: {
        m: { name: 'magnification (size of image ÷ size of subject)' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        D: { name: 'distance from the subject to the lens', q: 'length', unit: 'mm', value: 2000 }
      },
      note: 'The magnitude of the magnification: the same as m = f/(f − sₒ) with the sign dropped.',
      stories: { m: 'A {f} lens photographs a subject {D} away. What fraction of the subject\'s size is the image?' }
    }
  ],
  examples: [
    {
      title: 'Filling the frame in a product shot',
      q: 'A 100 mm macro lens is to photograph a 40 mm wide object so that it fills the 24 mm height of the sensor. How far from the lens must the object be, and how far is the sensor?',
      steps: [
        { text: 'The magnification is $|m| = 24/40 = 0.6$. With $m = f/(f - s_o)$:', tex: 's_o = f\\left(1 + \\frac{1}{|m|}\\right) = 100\\,(1 + 1.667) = 267\\ \\mathrm{mm}' },
        { text: 'The image distance follows from $|m| = s_i/s_o$:', tex: 's_i = |m|\\,s_o = 0.6 \\times 267 = 160\\ \\mathrm{mm}' }
      ],
      a: 'The object is 267 mm from the lens and the sensor 160 mm behind it: the lens has been extended 60 mm beyond its infinity position.'
    },
    {
      title: 'How deep is the image?',
      q: 'A machine-vision lens images a 10 mm deep part at a magnification of −0.2. How deep is the image, and how deep would it be at −2?',
      steps: [
        { text: 'The longitudinal magnification is $m^2$:', tex: '0.2^2 \\times 10\\ \\mathrm{mm} = 0.4\\ \\mathrm{mm} \\qquad\\text{and}\\qquad (-2)^2 \\times 10\\ \\mathrm{mm} = 40\\ \\mathrm{mm}' },
        'In the first case the whole depth of the part fits into 0.4 mm at the sensor; in the second the image is four times as deep as the object.'
      ],
      a: '0.4 mm at m = −0.2, and 40 mm at m = −2 (an approximation; for a depth this large the exact stretch is m₁m₂).'
    }
  ],
  quiz: [
    { q: 'A lens forms an image with a lateral magnification of −0.25. The image is…', choices: ['inverted and a quarter of the size', 'upright and a quarter of the size', 'inverted and four times larger', 'upright and four times larger'], a: 0, why: 'The sign is negative: inverted. The size is |m| = 0.25.' },
    { q: 'At a lateral magnification of −3, how much is depth stretched in the image?', choices: ['3 times', '6 times', '9 times', 'not at all'], a: 2, why: 'Longitudinal magnification is $m^2 = 9$. Depth is stretched much more than width, so a 3-D object is distorted.' },
    { q: 'A "10×" magnifier produces an image ten times as tall as the object on a screen.', a: false, why: 'The "×" on a magnifier is an angular magnification: the angle the image subtends at the eye compared with the angle of the object at 250 mm. A magnifier forms a virtual image; there is no screen.' },
    { q: 'A 100 mm lens is used to photograph a subject 300 mm away. What is the magnitude of the lateral magnification?', answer: 0.5, why: '$m = f/(s_o - f) = 100/200 = 0.5$: the image on the sensor is half the size of the subject.' },
    { q: 'An object moves 2 mm towards a lens that images it with $m = -4$. The image moves…', choices: ['8 mm in the same direction', '8 mm in the opposite direction', '32 mm in the same direction', '2 mm'], a: 2, why: 'The displacement is $m^2 \\times 2 = 32$ mm, in the same direction as the object (the object moves towards the lens, so the image moves away from it).' }
  ],
  applications: [
    'Macro photography: reproduction ratio 1:1 or 2:1, where the working f-number is also raised by 1 + |m|.',
    'Machine vision: choosing a lens from the sensor size and the field of view means choosing m, then f and the working distance.',
    'Microscopy: the objective\'s marked magnification is its lateral magnification at the intermediate image; its tiny depth of field follows from m².',
    'Inspection of 3-D parts: telecentric lenses keep m the same at every depth, so heights do not distort the measurement.',
    'Telescopes and binoculars: their angular magnification (7×, 10×) is what lets distant details be resolved.'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — transverse and longitudinal magnification.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — lateral, axial and angular magnification.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — the Lagrange invariant and the magnifications.'
  ],
  sim: 'tl-magnification'
},

/* ================================================================ the lensmaker's formula */
{
  id: 'lensmakers-formula', parent: 'thin-lenses', title: 'The lensmaker\'s formula', level: 2,
  short: 'The focal length of a thin lens follows from its glass and its two curves: 1/f = (n − 1)(1/R₁ − 1/R₂). It explains why shape matters, why a lens in water is weak, and how a lens is specified for grinding.',
  keywords: ['lensmaker', "lensmaker's equation", "lensmaker's formula", 'radius of curvature', 'refractive index', 'surface power', 'curvature', 'sign convention', 'Cartesian', 'thin lens', 'thick lens correction', 'lens in water', 'underwater', 'base curve', 'f from radii'],
  prereq: ['lens-shapes-and-names', 'focal-length-and-optical-power', 'refraction-at-a-curved-surface'],
  related: ['thick-lenses-and-principal-planes', 'combining-thin-lenses', 'refractive-index', 'dispersion-and-the-spectrum', 'axial-chromatic-aberration', 'keratometry-and-corneal-topography', 'measuring-focal-length-and-radius', 'physics:lensmakers-equation'],
  body: `
The lensmaker's formula answers the question of a lens grinder: given the glass and the two curves, what focal length will the lens have? Or the other way round: given the focal length wanted and the glass, what must the two radii be?

### The formula
For a thin lens of index $n$ in air, with front radius $R_1$ and back radius $R_2$,

$$\\frac{1}{f}=(n-1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)$$

Radii follow the **Cartesian convention**: light travels left to right, and $R$ is positive when the centre of curvature is on the right of the surface. A flat face has $1/R=0$. A biconvex lens has $R_1>0$ and $R_2<0$, so both terms add and the lens is strongly converging.

Each surface contributes its own power, $(n_2-n_1)/R$: the front face $(n-1)/R_1$, the back face $(1-n)/R_2$. For a thin lens the two powers add, which is the formula above.

### The same glass, different shapes
Take $n=1.5$ and $|R|=100$ mm:

| Lens | $R_1$ | $R_2$ | $f$ |
|---|---|---|---|
| biconvex | +100 | −100 | +100 mm |
| plano-convex | +100 | ∞ | +200 mm |
| plano-convex, turned round | ∞ | −100 | +200 mm |
| positive meniscus | +100 | +200 | +400 mm |
| biconcave | −100 | +100 | −100 mm |
| plano-concave | −100 | ∞ | −200 mm |
| meniscus of equal radii | +100 | +100 | infinite |

Turning a lens round (swapping the faces and the signs) changes nothing: the focal length is the same either way. The last line shows the weakness of the thin-lens formula: a meniscus of constant thickness has no power at all, to this approximation.

### The index and the surroundings
The power is proportional to $n-1$. A lens of acrylic ($n=1.49$) is weaker than the same shape in N-SF11 ($n=1.785$) in the ratio $0.49:0.785$. Put the lens in a medium of index $n_0$ and $n$ is replaced by $n/n_0$: a glass lens ($n=1.517$) of 100 mm focal length in air has $f=375$ mm in water, 3.7 times longer. It is why the eye, whose cornea has $n=1.376$ against the water's 1.333, loses nearly all of its 43 D under water — the front face of the cornea is worth about 48 D in air but only 5.5 D in water — and why a diver's mask, with air in front of the eye, restores it.

### Corrections you will meet
- **Thickness.** For centre thickness $t$ the formula gains a term: $\\frac{1}{f}=(n-1)\\left[\\frac1{R_1}-\\frac1{R_2}+\\frac{(n-1)\\,t}{n R_1 R_2}\\right]$. For $R=\\pm100$ mm, $n=1.5$, $t=10$ mm, $f$ changes from 100 mm to 101.7 mm.
- **Colour.** $n$ depends on the wavelength, so $f$ does too. An equiconvex N-BK7 lens with $R=\\pm100$ mm has $f=95.7$ mm in blue light (486 nm), 96.7 mm in yellow (588 nm) and 97.2 mm in red (656 nm): the focal spread of 1.5 mm is $f/V$, the cause of [[axial-chromatic-aberration|axial colour]].
- **Aberrations.** The formula is first-order; spherical surfaces give [[what-aberrations-are|aberrations]] away from the axis.

> [!key] $1/f=(n-1)(1/R_1-1/R_2)$ with Cartesian radii. Power goes as $n-1$ (as $n/n_0-1$ in a medium); reversing the lens changes nothing; thickness and colour add small corrections.
`,
  ideas: [
    '1/f = (n − 1)(1/R₁ − 1/R₂) for a thin lens in air, with Cartesian radii: positive when the centre of curvature is on the right.',
    'Each surface contributes its own power (n₂ − n₁)/R, and for a thin lens the two powers add.',
    'In a medium of index n₀ replace n by n/n₀: a glass lens in water has about 3.7 times the focal length it has in air.',
    'Turning a lens round, or reversing both radii and their signs, leaves f unchanged.',
    'Thickness, the wavelength-dependence of n and aberrations add corrections to this first-order result.'
  ],
  pitfalls: [
    'The signs of the radii do not matter — They decide everything. A biconvex lens has R₁ positive and R₂ negative, so the two terms add; with both positive (a meniscus) they largely cancel.',
    'A fatter lens is a stronger lens — Thickness hardly enters the formula; power comes from the curvatures and from n − 1. A lens of constant thickness (R₁ = R₂) is nearly powerless however thick it is.',
    'A lens has the same focal length in water as in air — It is about 3.7 times longer for glass, because only the difference in index between lens and surroundings bends the light.',
    'Flipping the lens over changes its focal length — The focal length is unchanged (in the same medium). What changes is the aberration, and the back focal length of a thick lens.'
  ],
  terms: [
    { term: 'Lensmaker\'s formula', also: ["lensmaker's equation", 'thin-lens power formula'], def: 'The relation 1/f = (n − 1)(1/R₁ − 1/R₂) between the focal length of a thin lens in air, its refractive index and the radii of its two surfaces.' },
    { term: 'Radius of curvature', also: ['R', 'surface radius'], def: 'The radius of the sphere a lens surface is part of. In lens prescriptions it carries a sign: positive when the centre of curvature is to the right of the surface.' },
    { term: 'Cartesian sign convention', also: ['Cartesian convention'], def: 'Light travels left to right; distances to the right of a surface are positive, so a radius is positive when its centre of curvature lies on the right. Used by lens-design software and ray-transfer matrices.' },
    { term: 'Surface power', also: ['(n₂ − n₁)/R', 'refracting power of a surface'], def: 'The power of a single refracting surface between media of index n₁ and n₂: (n₂ − n₁)/R, in dioptres if R is in metres.' },
    { term: 'Curvature', also: ['c', '1/R'], def: 'The reciprocal of the radius of curvature, 1/R: zero for a flat face. Surface powers are proportional to curvatures, which is why optical designers work with them.' }
  ],
  formulas: [
    {
      name: 'The lensmaker\'s formula (thin lens in air)',
      expr: '1/f = (n - 1)*(1/R1 - 1/R2)', tex: '\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', signed: true },
        n: { name: 'refractive index of the glass', value: 1.517, min: 1.05, max: 4 },
        R1: { name: 'radius of the front surface', q: 'length', unit: 'mm', value: 100, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the back surface', q: 'length', unit: 'mm', value: -100, signed: true, tex: 'R_2' }
      },
      solveFor: 'f',
      note: 'Cartesian signs: R positive when the centre of curvature is to the right. For a flat face leave out its term (1/R = 0).',
      stories: { f: 'A thin lens of index {n} has faces of radius {R1} (front) and {R2} (back). What is its focal length?', R1: 'A thin lens of index {n} and focal length {f} has a back face of radius {R2}. What must the radius of its front face be?' }
    },
    {
      name: 'A lens in a surrounding medium',
      expr: '1/f = (n/n0 - 1)*(1/R1 - 1/R2)', tex: '\\frac{1}{f} = \\left(\\frac{n}{n_0} - 1\\right)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', signed: true },
        n: { name: 'refractive index of the lens', value: 1.517, min: 1.05, max: 4 },
        n0: { name: 'refractive index of the surroundings', value: 1.333, min: 1, max: 3, tex: 'n_0' },
        R1: { name: 'radius of the front surface', q: 'length', unit: 'mm', value: 100, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the back surface', q: 'length', unit: 'mm', value: -100, signed: true, tex: 'R_2' }
      },
      note: 'Water has n₀ = 1.333; with n₀ greater than n the lens becomes weak or even reverses its action.',
      stories: { f: 'A biconvex lens of index {n} and radii {R1} and {R2} is used under water (index {n0}). What is its focal length?' }
    },
    {
      name: 'Power of one refracting surface',
      expr: 'P = (n2 - n1)/R', tex: 'P = \\frac{n_2 - n_1}{R}',
      vars: {
        P: { name: 'power of the surface', q: 'optpower', unit: 'D', signed: true },
        n1: { name: 'index of the first medium', value: 1, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the second medium', value: 1.376, min: 1, max: 4, tex: 'n_2' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 7.8, signed: true }
      },
      note: 'The front surface of the cornea, in air, has about 48 D; with the back surface the whole cornea is near +43 D.',
      stories: { P: 'A refracting surface of radius {R} separates a medium of index {n1} from one of index {n2}. What is its power?' }
    },
    {
      name: 'Thick-lens power',
      expr: 'P = (n - 1)*(1/R1 - 1/R2 + (n - 1)*t/(n*R1*R2))', tex: 'P = (n - 1)\\left[\\frac{1}{R_1} - \\frac{1}{R_2} + \\frac{(n - 1)\\,t}{n\\,R_1 R_2}\\right]',
      vars: {
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', signed: true },
        n: { name: 'refractive index', value: 1.5, min: 1.05, max: 4 },
        R1: { name: 'radius of the front surface', q: 'length', unit: 'mm', value: 100, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the back surface', q: 'length', unit: 'mm', value: -100, signed: true, tex: 'R_2' },
        t: { name: 'centre thickness', q: 'length', unit: 'mm', value: 10, min: 0, max: 500 }
      },
      note: 'Allows for the spacing of the two surfaces. For t = 0 it is the thin-lens formula.',
      stories: { P: 'A glass lens of index {n}, radii {R1} and {R2} and thickness {t} is used in air. What is its power?' }
    }
  ],
  examples: [
    {
      title: 'Specifying a lens for grinding',
      q: 'A symmetric biconvex lens of N-BK7 ($n = 1.517$) is to have a focal length of 250 mm. What radii must be ground? What would a plano-convex lens of the same focal length need?',
      steps: [
        { text: 'Biconvex, with $R_1 = R$ and $R_2 = -R$, so the two terms are equal:', tex: '\\frac{1}{f} = (n-1)\\,\\frac{2}{R} \\;\\Rightarrow\\; R = 2f(n-1) = 2 \\times 250 \\times 0.517 = 258\\ \\mathrm{mm}' },
        { text: 'Plano-convex has only one curved face, so it must be twice as curved:', tex: 'R = f(n-1) = 129\\ \\mathrm{mm}' }
      ],
      a: 'Biconvex: both radii 258 mm. Plano-convex: one radius of 129 mm and a flat face.'
    },
    {
      title: 'A lens in the swimming pool',
      q: 'A glass lens ($n = 1.517$) has $f = 100$ mm in air. What is its focal length in water ($n_0 = 1.333$)?',
      steps: [
        'The power is proportional to the relative index minus one. In air: $n - 1 = 0.517$. In water: $n/n_0 - 1 = 1.138 - 1 = 0.138$.',
        { text: 'The focal length scales inversely:', tex: 'f_{\\text{water}} = 100 \\times \\frac{0.517}{0.138} = 375\\ \\mathrm{mm}' }
      ],
      a: 'About 375 mm: 3.7 times longer, because the difference in index between glass and water is much smaller than between glass and air.'
    }
  ],
  quiz: [
    { q: 'A thin biconvex lens has $R_1 = +50$ mm, $R_2 = -50$ mm and $n = 1.5$. What is its focal length in millimetres?', answer: 50, unit: 'mm', why: '$1/f = 0.5\\,(1/50 + 1/50) = 0.02$ mm⁻¹, so $f = 50$ mm.' },
    { q: 'A meniscus lens ($n = 1.5$) has $R_1 = +100$ mm and $R_2 = +200$ mm. Its focal length is…', choices: ['+400 mm', '+67 mm', '−400 mm', '+133 mm'], a: 0, why: '$1/f = 0.5\\,(1/100 - 1/200) = 0.0025$ mm⁻¹: $f = +400$ mm. A meniscus is much weaker than a biconvex lens of the same radii.' },
    { q: 'The focal length of a thin lens depends only on its two radii of curvature.', a: false, why: 'It also depends on the index of the glass (through n − 1), and on the surroundings: in a medium the relevant quantity is n/n₀ − 1.' },
    { q: 'A glass lens with $f = 100$ mm in air is used under water. Its focal length is about…', choices: ['25 mm', '100 mm', '375 mm', 'negative'], a: 2, why: 'The effective index is $1.517/1.333 = 1.14$, so $n - 1$ falls from 0.52 to 0.14 and $f$ rises 3.7-fold.' },
    { q: 'A thin lens is turned round so that its back face becomes its front face. In air, the focal length…', choices: ['is unchanged', 'changes sign', 'is halved', 'doubles'], a: 0, why: 'Swapping the faces and the signs of the radii gives $(1/R_1 - 1/R_2)$ again. Only the aberrations (and, for a thick lens, the back focal length) change.' }
  ],
  applications: [
    'Lens specification: a drawing gives n and the two radii (and the thickness); the focal length is checked by this formula and then measured.',
    'Spectacles: the front and back surface powers of a meniscus lens add up to the prescription, which is why base curves are quoted in dioptres.',
    'Underwater optics: dome ports and goggles exist because a lens or a cornea loses most of its power in water.',
    'Liquid and gel lenses and the eye\'s own lens, whose power depends on the index difference to the fluids around it.',
    'Moulded plastic lenses in phones: high-index plastics (n near 1.6–1.7) give the same power with gentler curves, which are easier to mould.'
  ],
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the thin lens and the lensmaker\'s formula.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 (Geometrical Theory of Optical Imaging) — refraction at a spherical surface and the thick lens.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the powers of the corneal surfaces in air and water.'
  ],
  sim: 'tl-lensmaker'
},

/* ================================================================ lenses in combination */
{
  id: 'combining-thin-lenses', parent: 'thin-lenses', title: 'Lenses in combination', level: 2,
  short: 'Two thin lenses a distance d apart act like one lens of power P = P₁ + P₂ − d·P₁P₂. In contact the powers simply add; apart, the pair can be a telephoto lens, a retrofocus wide-angle, or an afocal telescope that has no focal length at all.',
  keywords: ['two lenses', 'lens combination', 'equivalent focal length', 'back focal distance', 'telephoto', 'retrofocus', 'afocal', 'telescope', 'beam expander', 'doublet', 'contact lenses', 'separation', 'close-up lens', 'zoom', 'system of lenses'],
  prereq: ['the-thin-lens-equation', 'focal-length-and-optical-power', 'real-and-virtual-images'],
  related: ['thick-lenses-and-principal-planes', 'cardinal-points', 'refracting-telescopes', 'beam-expanders', 'telephoto-lens', 'retrofocus-wide-angle', 'zoom-lens-principles', 'ray-transfer-matrices', 'physics:thin-lenses'],
  body: `
Almost nothing in optics is a single lens. A camera lens, a telescope, a zoom, a beam expander are two or more lenses working together. The first-order rule is simple: **the image made by one lens is the object of the next**, whether that image is real or virtual and whether it lies before or after the second lens (in which case it is a virtual object, with $s_o<0$).

### Two thin lenses a distance apart
For lenses of focal lengths $f_1$ and $f_2$ separated by $d$, the pair behaves, for light from far away, like one lens of power

$$P=P_1+P_2-d\\,P_1P_2\\qquad\\Longleftrightarrow\\qquad\\frac{1}{f}=\\frac{1}{f_1}+\\frac{1}{f_2}-\\frac{d}{f_1f_2}$$

In contact ($d=0$) the powers simply add. Moving two positive lenses apart *weakens* the pair. The focus lies at the **back focal distance** $\\mathrm{BFD}=f\\,(1-d/f_1)$ behind the second lens; the front focal point lies $\\mathrm{FFD}=f\\,(1-d/f_2)$ in front of the first. The principal planes of the pair are not at the lenses ([[thick-lenses-and-principal-planes]]); the dashed lines in the simulation show where.

### Five pairs worth knowing
| $f_1$ | $f_2$ | $d$ | EFL | BFD | What it is |
|---|---|---|---|---|---|
| +100 | +100 | 0 | 50 mm | 50 mm | two lenses in contact |
| +100 | −50 | 60 | 500 mm | 200 mm | **telephoto**: 500 mm in 260 mm |
| −60 | +40 | 30 | 48 mm | 72 mm | **retrofocus**: BFD larger than EFL |
| +150 | +30 | 180 | ∞ | — | **Keplerian** afocal pair, $M=-5$ |
| +150 | −30 | 120 | ∞ | — | **Galilean** afocal pair, $M=+5$ |

### Telephoto and retrofocus
A positive lens in front starts to converge the beam; a negative lens behind it makes it converge more slowly, so the focus lies only 200 mm behind the rear lens although the equivalent focal length is 500 mm. The principal plane H′ lies 240 mm in front of the first lens; the whole system is 260 mm long, a **telephoto ratio** of 0.52. Reverse the order — negative first — and the focus moves *back*: the BFD (72 mm) is longer than the EFL (48 mm). Wide-angle lenses for reflex cameras are built this way, to leave room for the swinging mirror.

### Afocal pairs
When $d=f_1+f_2$ the power vanishes: parallel light enters, parallel light leaves. The pair has no focal length, but it changes the angle and width of a beam: the **angular magnification** is $M=-f_1/f_2$ and the beam width is multiplied by $|f_2/f_1|$. With two positive lenses (Kepler) the view is inverted; with a negative second lens (Galileo) it is upright. A 4× laser beam expander is a $-25$ mm lens followed, 75 mm later, by a $+100$ mm lens: the beam leaves four times as wide and four times less divergent. See [[refracting-telescopes]] and [[beam-expanders]].

> [!key] Two thin lenses: $P=P_1+P_2-dP_1P_2$. Contact: powers add. Apart: telephoto (positive then negative), retrofocus (negative then positive), afocal when $d=f_1+f_2$.
`,
  ideas: [
    'The image of the first lens is the object of the second, even if it is virtual or lies beyond the second lens (a virtual object).',
    'Two thin lenses d apart have power P = P₁ + P₂ − d·P₁P₂; in contact (d = 0) the powers add.',
    'A positive lens followed by a negative one is a telephoto: the EFL exceeds the length of the system.',
    'A negative lens followed by a positive one is a retrofocus: the back focal distance exceeds the EFL, leaving room for a mirror box.',
    'When d = f₁ + f₂ the pair is afocal: it forms no focus but multiplies angles by −f₁/f₂ and beam widths by |f₂/f₁|.'
  ],
  pitfalls: [
    'The focal lengths of two lenses add up — Powers add, and only when the lenses touch. With a gap the term −dP₁P₂ reduces the power of two positive lenses.',
    'The back focal distance of a combination is its focal length — It is the distance from the *second lens* to the focus. The focal length is measured from the principal plane, which in a telephoto lens lies far in front. Here EFL = 500 mm but BFD = 200 mm.',
    'An afocal system is a broken lens — It is a deliberate one: telescopes, binoculars and beam expanders are afocal pairs. They have no focus because they are meant to deliver parallel light from parallel light.',
    'Moving the lenses apart always lengthens the focal length — For two positive lenses it does. For a positive and a negative lens, separating them makes the pair stronger, and that is how a zoom lens changes its focal length.'
  ],
  terms: [
    { term: 'Afocal system', also: ['afocal pair', 'telescopic system'], def: 'An optical system of zero power: parallel light enters and parallel light leaves. Telescopes, binoculars and beam expanders are afocal; they change the angle and the width of a beam, but do not focus it.' },
    { term: 'Telephoto ratio', def: 'The overall length of a lens, from its front element to the image plane, divided by its effective focal length. A plain lens has a ratio of about 1; a telephoto design brings it below 1.' },
    { term: 'Retrofocus lens', also: ['inverse telephoto', 'reverse telephoto'], def: 'A lens whose rear group is positive and whose front group is negative, so that the back focal distance exceeds the focal length. Used for wide-angle lenses of reflex cameras.' },
    { term: 'Thin lenses in contact', def: 'Two thin lenses touching, or so close that the gap can be ignored. Their powers add: P = P₁ + P₂.' }
  ],
  formulas: [
    {
      name: 'Two thin lenses a distance apart',
      expr: 'P = P1 + P2 - d*P1*P2', tex: 'P = P_1 + P_2 - d\\,P_1P_2',
      vars: {
        P: { name: 'power of the pair', q: 'optpower', unit: 'D', signed: true },
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 10, signed: true, tex: 'P_1' },
        P2: { name: 'power of the second lens', q: 'optpower', unit: 'D', value: -20, signed: true, tex: 'P_2' },
        d: { name: 'distance between the lenses', q: 'length', unit: 'mm', value: 60, min: 0 }
      },
      note: 'The default is the telephoto of the simulation: +100 mm followed by −50 mm, 60 mm apart.',
      stories: { P: 'A {P1} lens is followed, {d} behind it, by a {P2} lens. What is the power of the pair?', d: 'A {P1} lens and a {P2} lens are to make a combination of {P}. How far apart must they be?' }
    },
    {
      name: 'Back focal distance of the pair',
      expr: 'bfd = (1 - d*P1)/P', tex: '\\mathrm{BFD} = \\frac{1 - d\\,P_1}{P}',
      vars: {
        bfd: { name: 'back focal distance (from the second lens)', q: 'length', unit: 'mm', signed: true, tex: '\\mathrm{BFD}' },
        d: { name: 'distance between the lenses', q: 'length', unit: 'mm', value: 60, min: 0 },
        P1: { name: 'power of the first lens', q: 'optpower', unit: 'D', value: 10, signed: true, tex: 'P_1' },
        P: { name: 'power of the pair', q: 'optpower', unit: 'D', value: 2, signed: true }
      },
      note: 'Equivalent to BFD = f(1 − d/f₁). It is measured from the second lens, not from the principal plane.',
      stories: { bfd: 'A pair of thin lenses with a combined power of {P} has a front lens of {P1}, and the lenses are {d} apart. How far behind the second lens is the focus?' }
    },
    {
      name: 'The afocal condition',
      expr: 'd = f1 + f2', tex: 'd = f_1 + f_2',
      vars: {
        d: { name: 'distance between the lenses', q: 'length', unit: 'mm', signed: true },
        f1: { name: 'focal length of the first lens (objective)', q: 'length', unit: 'mm', value: 150, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of the second lens (eyepiece)', q: 'length', unit: 'mm', value: 30, signed: true, tex: 'f_2' }
      },
      note: 'The rear focal point of the first lens coincides with the front focal point of the second.',
      stories: { d: 'A telescope has an objective of {f1} and an eyepiece of {f2}. How far apart must they be for parallel light to leave parallel?' }
    },
    {
      name: 'Angular magnification of an afocal pair',
      expr: 'M = -f1/f2', tex: 'M = -\\frac{f_1}{f_2}',
      vars: {
        M: { name: 'angular magnification (negative: inverted)', signed: true },
        f1: { name: 'focal length of the first lens', q: 'length', unit: 'mm', value: 150, signed: true, tex: 'f_1' },
        f2: { name: 'focal length of the second lens', q: 'length', unit: 'mm', value: 30, signed: true, tex: 'f_2' }
      },
      note: 'The beam width is multiplied by |f₂/f₁| = 1/|M|.',
      stories: { M: 'A telescope with an objective of {f1} and an eyepiece of {f2}: what is its angular magnification?' }
    }
  ],
  examples: [
    {
      title: 'A 500 mm telephoto in 260 mm',
      q: 'A positive lens of $f_1 = +100$ mm is followed 60 mm behind by a negative lens of $f_2 = -50$ mm. Find the focal length of the pair, where the focus lies, and how long it is compared with a plain 500 mm lens.',
      steps: [
        { text: 'The power of the pair is', tex: '\\frac{1}{f} = \\frac{1}{100} - \\frac{1}{50} - \\frac{60}{100\\times(-50)} = 0.010 - 0.020 + 0.012 = 0.002\\ \\mathrm{mm}^{-1}' },
        'So $f = 500$ mm. The back focal distance is $500\\,(1 - 60/100) = 200$ mm.',
        'From the front lens to the focus is $60 + 200 = 260$ mm: a telephoto ratio of $260/500 = 0.52$.'
      ],
      a: 'f = 500 mm, focus 200 mm behind the second lens, 260 mm overall: about half the length of a plain 500 mm lens.'
    },
    {
      title: 'A four-times beam expander',
      q: 'A laser beam 2 mm wide is to be widened to 8 mm. Design an afocal pair of the Galilean kind with a $+100$ mm lens.',
      steps: [
        'The width is multiplied by $|f_2/f_1| = 4$ with $f_2 = +100$ mm, so $|f_1| = 25$ mm; for a Galilean pair the first lens is the negative one: $f_1 = -25$ mm.',
        { text: 'The lenses are placed at the afocal spacing', tex: 'd = f_1 + f_2 = -25 + 100 = 75\\ \\mathrm{mm}' }
      ],
      a: 'A −25 mm lens, then a +100 mm lens 75 mm behind it. The beam leaves 8 mm wide and four times less divergent; the angular magnification is $-f_1/f_2 = +0.25$.'
    }
  ],
  quiz: [
    { q: 'Two thin lenses, each of focal length 100 mm, are pressed together. The focal length of the pair is…', choices: ['200 mm', '100 mm', '50 mm', '25 mm'], a: 2, why: 'Powers add: +10 D + 10 D = +20 D, a focal length of 50 mm.' },
    { q: 'Lenses of +200 mm and +50 mm are placed 250 mm apart. What is this arrangement?', choices: ['a Keplerian telescope (afocal)', 'a telephoto lens', 'a retrofocus lens', 'a single thin lens'], a: 0, why: 'The spacing equals the sum of the focal lengths, so the power is zero: it is afocal. The angular magnification is $-200/50 = -4$.' },
    { q: 'The powers of two thin lenses add whatever the distance between them.', a: false, why: 'Only in contact. At a distance $d$ the combination has $P = P_1 + P_2 - dP_1P_2$.' },
    { q: 'A +100 mm lens is followed 60 mm behind by a −50 mm lens. What is the focal length of the pair, in millimetres?', answer: 500, unit: 'mm', why: '$1/f = 1/100 - 1/50 + 60/(100 \\times 50) = 0.002$ mm⁻¹, so $f = 500$ mm.' },
    { q: 'In a telephoto lens the back focal distance is…', choices: ['shorter than the effective focal length', 'equal to it', 'longer than it', 'always zero'], a: 0, why: 'The negative rear group pulls the focus in: the principal plane H′ lies in front of the lens, so the distance from the last lens to the focus is less than the EFL.' }
  ],
  applications: [
    'Telephoto lenses: a 500 mm lens that is 260 mm long instead of half a metre.',
    'Wide-angle lenses for reflex cameras are retrofocus designs, with room for the mirror between lens and sensor.',
    'Telescopes and binoculars are afocal pairs (a long objective and a short eyepiece) whose angular magnification is $-f_1/f_2$.',
    'Laser beam expanders are Galilean or Keplerian afocal pairs; the beam is widened and its divergence reduced by the same factor.',
    'Zoom lenses move groups of lenses relative to each other to change the combined focal length while holding focus.'
  ],
  history: 'Galileo built his telescope in 1609 with a positive objective and a negative eyepiece; Kepler described the arrangement with two positive lenses in 1611. The telephoto principle — a positive group in front, a negative one behind — was patented in the early 1890s by several inventors, among them Thomas Dallmeyer.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics) — thick lenses and lens systems; combinations of thin lenses.',
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 — two-lens systems, and ch. 6 on telephoto and retrofocus forms.',
    'R. Kingslake, *Lens Design Fundamentals* — the telephoto and inverted telephoto lens.'
  ],
  sim: 'tl-two-lenses'
},

/* ================================================================ thick lenses and principal planes */
{
  id: 'thick-lenses-and-principal-planes', parent: 'thin-lenses', title: 'Thick lenses and principal planes', level: 3,
  short: 'A thick lens, or any lens system, acts like a thin lens whose "lens plane" has been split in two: the principal planes H and H′. The thin-lens equation still works if object distances are measured from H and image distances from H′, with the space between them cut out.',
  keywords: ['thick lens', 'principal planes', 'principal points', 'H and H prime', 'unit planes', 'equivalent thin lens', 'back focal length', 'lens system', 'Gauss', 'ball lens', 'meniscus lens', 'plano-convex orientation', 'reduced thickness'],
  prereq: ['the-thin-lens-equation', 'lensmakers-formula', 'combining-thin-lenses'],
  related: ['cardinal-points', 'newtons-lens-equation', 'ray-transfer-matrices', 'telephoto-lens', 'reading-a-lens-datasheet', 'coupling-light-into-fibre', 'physics:lensmakers-equation'],
  body: `
The thin-lens equation treats a lens as a line. A real lens has thickness; an objective has many elements and is long. The remarkable result of first-order optics, due to Gauss, is that **any** centred system of lenses, however many and however thick, still behaves like one thin lens — provided distances are measured from the right places.

### The principal planes
The **principal planes** H and H′ are two planes perpendicular to the axis. To find H′, send a ray in parallel to the axis: it leaves the system heading for the rear focal point F′. Extend the incoming ray forward and the outgoing ray backward until they meet: the meeting point lies on H′. Do the same with the ray reversed to find H. The two planes are conjugate with magnification +1: a ray that enters at height $h$ on H appears to leave at the same height on H′. The system is equivalent to a thin lens that has been "cut open" and the space between H and H′ removed.

Then the thin-lens equation holds in its usual form, with $s_o$ measured from **H** and $s_i$ from **H′**, and the focal length $f$ (the EFL) is the distance from H′ to F′. The planes may lie inside the glass, outside it, or even cross each other.

### The thick-lens formulas
For a lens of index $n$ and centre thickness $t$ in air, with surface powers $P_1=(n-1)/R_1$ and $P_2=(1-n)/R_2$:

$$P=P_1+P_2-\\frac{t}{n}P_1P_2\\qquad \\mathrm{BFD}=\\frac{1-(t/n)P_1}{P}$$

and the planes lie inside the glass by

$$h_1=\\frac{t}{n}\\,\\frac{P_2}{P}\\ \\text{(H from the first vertex)},\\qquad h_2=\\frac{t}{n}\\,\\frac{P_1}{P}\\ \\text{(H′ from the last vertex)}.$$

The combination $t/n$ is the "reduced thickness": the light crosses the glass as if it were $t/n$ of air. An equiconvex lens with $R=\\pm100$ mm, $n=1.5$, $t=10$ mm has $P_1=P_2=5$ D, so $P=9.83$ D: $f=101.7$ mm, $\\mathrm{BFD}=98.3$ mm, and each plane lies 3.4 mm inside, close to a third of the thickness.

### Shapes and their planes
| Lens (in air) | EFL | back focal length | The planes |
|---|---|---|---|
| equiconvex, $n=1.5$ | $f$ | $f-t/3$ (about) | both inside, close to $t/3$ from each vertex |
| plano-convex, curved side first | $f$ | $f-t/n$ | H on the curved vertex; H′ inside by $t/n$ |
| plano-convex, flat side first | $f$ | $f$ | H inside by $t/n$; H′ on the curved vertex |
| strong positive meniscus | $f$ | may exceed $f$ | outside the glass: in a strong one both lie in front of the lens |
| ball lens of diameter $D$ | $nD/4(n-1)$ | EFL − $D/2$ | both at the centre |

For a 50 mm plano-convex lens of N-BK7, 5.3 mm thick, the back focal length is 46.5 mm with the curved side first and the full 50 mm with the flat side first. A glass ball ($n=1.5$) of diameter 10 mm has EFL 7.5 mm and BFL 2.5 mm; with $n=2$ the EFL falls to $D/2$ and the focus lies exactly on the back surface.

### Why it matters
The number printed on a lens is its EFL, from which image size, field of view and f-number follow. Whether it clears a sensor window or a mirror depends on the BFL, a different number: see [[cardinal-points]] for the vocabulary.

> [!key] A thick lens is a thin lens between two planes H and H′: measure object distances from H, image distances from H′, and the focal length from H′ to F′. Only in a thin lens do the planes coincide with the lens.
`,
  ideas: [
    'Any centred lens system acts to first order like one thin lens between two principal planes H and H′.',
    'Measure the object distance from H, the image distance from H′ and the focal length from H′ to F′; the thin-lens equation then holds.',
    'For a thick lens P = P₁ + P₂ − (t/n)P₁P₂; the principal planes lie t/n·P₂/P and t/n·P₁/P inside the vertices.',
    'The planes of an equiconvex lens are about a third of the thickness inside each vertex; a plano-convex lens has one plane on the curved vertex.',
    'A ball lens has both planes at its centre, an EFL of nD/4(n − 1) and, for n = 2, its focus on the back surface.'
  ],
  pitfalls: [
    'The focal length is measured from the back of the lens — It is measured from the rear principal plane H′, which can be inside the glass (a plain lens) or well in front of it (a telephoto). The distance from the back surface is the back focal length, a different number.',
    'The thin-lens equation fails for thick lenses — It holds exactly to first order if distances are measured from H and H′. Measuring from the glass surfaces is what goes wrong, by millimetres in a thick lens.',
    'The principal planes are physical surfaces inside the lens — They are mathematical planes, the places where the incoming and outgoing rays would meet. They need not lie inside the glass at all, and for a meniscus may both lie in front of the lens.',
    'A plano-convex lens has the same back focal length either way round — The EFL is the same; the back focal length changes by t/n, about 3.5 mm for a 5.3 mm thick lens of N-BK7.'
  ],
  terms: [
    { term: 'Principal planes', also: ['H, H′', 'unit planes'], def: 'The two planes perpendicular to the axis of a lens system, conjugate with magnification +1, from which object and image distances and the focal length are measured. Any system acts like a thin lens between them.' },
    { term: 'Principal points', def: 'The points where the principal planes cross the optical axis.' },
    { term: 'Thick lens', def: 'A lens whose thickness cannot be neglected compared with its focal length, so that its principal planes are separated from each other and from the vertices.' },
    { term: 'Reduced thickness', also: ['t/n'], def: 'The thickness of a piece of glass divided by its refractive index: the thickness of air that delays the light by the same amount. It enters the thick-lens formulas.' },
    { term: 'Ball lens', also: ['sphere lens'], def: 'A lens made from a glass sphere. Its two principal planes meet at the centre, its focal length is nD/4(n − 1) and its back focal length that minus the radius.' }
  ],
  formulas: [
    {
      name: 'Power of a thick lens',
      expr: 'P = P1 + P2 - t*P1*P2/n', tex: 'P = P_1 + P_2 - \\frac{t}{n}\\,P_1P_2',
      vars: {
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', signed: true },
        P1: { name: 'power of the front surface, (n − 1)/R₁', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_1' },
        P2: { name: 'power of the back surface, (1 − n)/R₂', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_2' },
        t: { name: 'centre thickness', q: 'length', unit: 'mm', value: 10, min: 0, max: 1000 },
        n: { name: 'refractive index of the glass', value: 1.5, min: 1.05, max: 4 }
      },
      note: 'The default is the equiconvex lens R = ±100 mm of the text: 9.83 D, f = 101.7 mm.',
      stories: { P: 'A lens of index {n} and thickness {t} has surface powers of {P1} and {P2}. What is the power of the lens?' }
    },
    {
      name: 'Back focal distance of a thick lens',
      expr: 'bfd = (1 - t*P1/n)/P', tex: '\\mathrm{BFD} = \\frac{1 - (t/n)\\,P_1}{P}',
      vars: {
        bfd: { name: 'back focal distance (from the rear vertex)', q: 'length', unit: 'mm', tex: '\\mathrm{BFD}' },
        t: { name: 'centre thickness', q: 'length', unit: 'mm', value: 10, min: 0, max: 1000 },
        n: { name: 'refractive index of the glass', value: 1.5, min: 1.05, max: 4 },
        P1: { name: 'power of the front surface', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_1' },
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', value: 9.8333, signed: true }
      },
      note: 'For P1 = 0 (flat front face) the BFD equals the EFL.',
      stories: { bfd: 'A thick lens of index {n} and thickness {t} has a front surface power of {P1} and a total power of {P}. How far behind its rear vertex is its focus?' }
    },
    {
      name: 'Front principal plane: depth inside the first surface',
      expr: 'h1 = t*P2/(n*P)', tex: 'h_1 = \\frac{t}{n}\\,\\frac{P_2}{P}',
      vars: {
        h1: { name: 'distance of H behind the first vertex', q: 'length', unit: 'mm', signed: true, tex: 'h_1' },
        t: { name: 'centre thickness', q: 'length', unit: 'mm', value: 10, min: 0, max: 1000 },
        n: { name: 'refractive index of the glass', value: 1.5, min: 1.05, max: 4 },
        P2: { name: 'power of the back surface', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_2' },
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', value: 9.8333, signed: true }
      },
      note: 'Positive means inside the glass; negative means in front of the lens.'
    },
    {
      name: 'Rear principal plane: depth inside the last surface',
      expr: 'h2 = t*P1/(n*P)', tex: 'h_2 = \\frac{t}{n}\\,\\frac{P_1}{P}',
      vars: {
        h2: { name: 'distance of H′ in front of the last vertex', q: 'length', unit: 'mm', signed: true, tex: 'h_2' },
        t: { name: 'centre thickness', q: 'length', unit: 'mm', value: 10, min: 0, max: 1000 },
        n: { name: 'refractive index of the glass', value: 1.5, min: 1.05, max: 4 },
        P1: { name: 'power of the front surface', q: 'optpower', unit: 'D', value: 5, signed: true, tex: 'P_1' },
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', value: 9.8333, signed: true }
      },
      note: 'For a plano-convex lens with its curved side first (P₂ = 0) this is t/n.'
    },
    {
      name: 'Focal length of a ball lens',
      expr: 'f = n*D/(4*(n - 1))', tex: 'f = \\frac{n\\,D}{4\\,(n - 1)}',
      vars: {
        f: { name: 'effective focal length, from the centre', q: 'length', unit: 'mm' },
        n: { name: 'refractive index of the ball', value: 1.5, min: 1.05, max: 4 },
        D: { name: 'diameter of the ball', q: 'length', unit: 'mm', value: 10 }
      },
      note: 'The back focal length is f − D/2. For n = 2 it is zero: the focus lies on the surface.',
      stories: { f: 'A glass ball of index {n} and diameter {D} is used as a lens. What is its effective focal length?' }
    }
  ],
  examples: [
    {
      title: 'A thick biconvex lens',
      q: 'A glass lens ($n = 1.5$) has radii $R_1 = +100$ mm and $R_2 = -100$ mm and is 10 mm thick. Find its focal length, its back focal distance and the positions of its principal planes.',
      steps: [
        { text: 'The surface powers are $P_1 = 0.5/0.1 = 5$ D and $P_2 = (1 - 1.5)/(-0.1) = 5$ D. The thickness reduces the total:', tex: 'P = 5 + 5 - \\frac{0.010}{1.5}\\times 5 \\times 5 = 9.83\\ \\mathrm{D} \\quad\\Rightarrow\\quad f = 101.7\\ \\mathrm{mm}' },
        { text: 'The back focal distance:', tex: '\\mathrm{BFD} = \\frac{1 - (0.010/1.5)\\times 5}{9.83} = 98.3\\ \\mathrm{mm}' },
        { text: 'Each principal plane lies inside the glass by', tex: 'h = \\frac{t}{n}\\,\\frac{P_1}{P} = \\frac{10}{1.5} \\times \\frac{5}{9.83} = 3.39\\ \\mathrm{mm}' }
      ],
      a: 'f = 101.7 mm, BFD = 98.3 mm; H is 3.4 mm behind the front vertex and H′ 3.4 mm in front of the rear vertex — each about a third of the way in.'
    },
    {
      title: 'Which way round for the back focal length?',
      q: 'A plano-convex N-BK7 lens ($n = 1.517$) has $f = 50$ mm and a centre thickness of 5.3 mm. What is its back focal length with the curved side towards the light, and with the flat side towards the light?',
      steps: [
        'Curved side first: all the power is on the front surface ($P_2 = 0$), so $h_2 = t/n = 5.3/1.517 = 3.5$ mm, and the focus is $f - h_2$ behind the flat face.',
        'Flat side first: $P_1 = 0$, so $h_2 = 0$: H′ lies on the curved rear vertex and the BFL equals $f$.'
      ],
      a: 'BFL = 46.5 mm curved side first; 50.0 mm flat side first. The EFL is 50 mm both ways.'
    }
  ],
  quiz: [
    { q: 'For a thin lens, the two principal planes…', choices: ['coincide, at the lens', 'are a focal length apart', 'lie at the focal points', 'are infinitely far apart'], a: 0, why: 'A thin lens has no thickness, so H and H′ both lie in the lens. The more thickness there is, the more they separate.' },
    { q: 'An equiconvex glass lens ($n = 1.5$) in air has its principal planes…', choices: ['at its two vertices', 'inside the glass, about a third of the thickness from each vertex', 'at the focal points', 'both at the centre'], a: 1, why: 'For symmetric biconvex glass of index 1.5 each plane lies $t/n \\times 1/2 \\approx t/3$ inside its vertex. (Only a ball lens has both planes at the centre.)' },
    { q: 'A glass ball of index 2 has its focus on its own back surface.', a: true, why: 'The EFL is $nD/4(n-1) = D/2$ from the centre, which is exactly the radius: the back focal length is zero.' },
    { q: 'The thin-lens equation can be used for a thick lens if the distances are measured from its front and rear surfaces.', a: false, why: 'The distances must be measured from the principal planes: the object distance from H, the image distance from H′.' },
    { q: 'A glass ball ($n = 1.5$) of diameter 10 mm is used as a lens. What is its back focal length, in millimetres?', answer: 2.5, unit: 'mm', why: '$f = nD/4(n-1) = 1.5 \\times 10/2 = 7.5$ mm from the centre; the back focal length is $7.5 - 5 = 2.5$ mm.' }
  ],
  applications: [
    'First-order layout of camera and microscope objectives: the whole assembly is replaced by H, H′, F and F′.',
    'Fibre and laser coupling with ball lenses and half-ball lenses, whose short back focal length lets the fibre touch the glass.',
    'Choosing a catalogue lens: the datasheet gives the EFL and the back focal length, from which the sensor position follows.',
    'Lens measuring: a nodal slide or a focimeter measures the back focal length, from which the EFL is deduced.',
    'The eye, treated as a thick lens system with its principal planes about 1.5 mm behind the cornea.'
  ],
  history: 'Carl Friedrich Gauss showed in his *Dioptrische Untersuchungen* (1841) that a centred system of any number of lenses is equivalent, to first order, to a single lens with two principal planes. Benedict Listing added the nodal points in 1845.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics) — thick lenses and lens systems.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 (Geometrical Theory of Optical Imaging) — Gaussian optics and the cardinal points.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — thick lenses and principal planes.'
  ],
  sim: { id: 'tl-thick', params: { mode: 'planes' } }
},

/* ================================================================ cardinal points */
{
  id: 'cardinal-points', parent: 'thin-lenses', title: 'Cardinal points: focal, principal, nodal', level: 3,
  short: 'To first order any lens system is a black box described by six points on its axis: two focal points, two principal points and two nodal points. From them follow the effective, back and front focal lengths — three numbers that are often confused.',
  keywords: ['cardinal points', 'focal points', 'principal points', 'nodal points', 'EFL', 'BFL', 'FFL', 'BFD', 'FFD', 'effective focal length', 'back focal length', 'front focal length', 'nodal slide', 'nodal point', 'entrance pupil', 'no-parallax point', 'panorama', 'Gullstrand', 'schematic eye', 'reduced eye', 'ABCD matrix', 'first-order properties'],
  prereq: ['thick-lenses-and-principal-planes', 'ray-transfer-matrices', 'combining-thin-lenses'],
  related: ['newtons-lens-equation', 'entrance-and-exit-pupils', 'lens-adapters-and-back-focus', 'lens-mounts-and-flange-distance', 'reading-a-lens-datasheet', 'the-eye-as-a-camera', 'measuring-focal-length-and-radius', 'field-of-view-and-focal-length', 'physics:thin-lenses'],
  body: `
Hand a lens designer a camera objective with fourteen elements and ask where it focuses and how large it makes things, and she will not trace fourteen surfaces. She replaces the whole assembly by a black box described by six points on its axis, the **cardinal points**, and for first-order questions nothing else is needed.

### The six points
- **F and F′**, the focal points. F′ is where light that arrived parallel to the axis comes to a focus; F is the point from which light must start to leave the system parallel.
- **H and H′**, the principal points, where the principal planes ([[thick-lenses-and-principal-planes]]) cross the axis.
- **N and N′**, the nodal points: a ray aimed at N leaves the system *from* N′ **parallel to its original direction**. They are conjugate points of angular magnification +1.

With the same medium on both sides, N and N′ coincide with H and H′. When the media differ, the nodal points are displaced towards the denser side by $(n'-n)/P$.

### Three focal lengths, three confusions
| Name | From → to | What it is for |
|---|---|---|
| **EFL**, effective focal length $f$ | H′ → F′ | magnification, image size, field of view, f-number |
| **BFL** or BFD, back focal length | last glass surface → F′ | does a sensor, filter or mirror fit behind the lens? |
| **FFL** or FFD, front focal length | F → first glass surface | where the front focus lies, for illumination and working distance |

For the thick lens of the previous page ($R=\\pm100$ mm, $n=1.5$, $t=10$ mm): EFL 101.7 mm, BFL = FFL = 98.3 mm. A 24 mm retrofocus wide-angle for a reflex camera has a BFL longer than its EFL (around 40 mm in many designs); the BFL of a telephoto is far shorter than its EFL (200 mm against 500 mm in the two-lens model of the previous pages).

Three cautions. Some textbooks use "front focal length" for H → F, which in air is just $f$; datasheets measure from the glass. The **flange focal distance** of a mount (17.526 mm for a C-mount) is neither BFL nor EFL: it runs from the mount's flange to the image plane, and differs from the BFL by how far the rear glass sits inside (or behind) the flange. And camera people say "back focus" for the adjustment that sets that distance.

### From a matrix
If the system matrix from the first vertex to the last is $\\begin{pmatrix}A&B\\\\C&D\\end{pmatrix}$ ([[ray-transfer-matrices]]), then in air $\\mathrm{EFL}=-1/C$, $\\mathrm{BFD}=-A/C$, $\\mathrm{FFD}=-D/C$. For the thick lens above $A=D=0.967$ and $C=-0.00983$ mm⁻¹, which gives 101.7, 98.3 and 98.3 mm.

### Nodal points and the nodal slide
Rotate a lens about its rear nodal point and the image of a distant point does not move. On a **nodal slide** the lens sits on a carriage that can be shifted along the bench relative to a vertical pivot, and the whole carriage is turned about the pivot. When turning leaves the image of a distant source still, the pivot is at the rear nodal point N′, and the distance from the pivot to the image plane is the EFL. For panoramas the point that must stay still to avoid parallax is the **entrance pupil**, not the nodal point, although the latter name is used loosely for it ([[entrance-and-exit-pupils]]).

### The eye
Gullstrand's schematic eye has about 58.6 D with H and H′ 1.3 and 1.6 mm behind the cornea, N and N′ at 7.1 and 7.3 mm, F′ 24.4 mm behind the cornea (the retina) and F 15.7 mm in front. Because the vitreous has $n'=1.336$, N lies $0.336/58.6\\approx5.7$ mm behind H. One degree of visual angle spans $17\\ \\mathrm{mm}\\times\\tan 1^\\circ\\approx0.3$ mm on the retina.

> [!key] Six points describe a lens: F, F′, H, H′, N, N′. EFL is H′→F′ (it sets magnification), BFL is last surface→F′ (it sets clearance), FFL is F→first surface. In air N and N′ coincide with H and H′.
`,
  ideas: [
    'To first order any lens system is described by six cardinal points: F, F′, H, H′, N, N′.',
    'A ray aimed at the front nodal point N leaves the system from N′ parallel to its original direction; in air N, N′ coincide with H, H′.',
    'EFL runs from H′ to F′ and sets magnification and field of view; BFL runs from the last glass surface to F′ and sets clearance; FFL runs from F to the first surface.',
    'From the system matrix, in air: EFL = −1/C, BFD = −A/C, FFD = −D/C.',
    'For a panorama without parallax the camera pivots about the entrance pupil, not the nodal point.'
  ],
  pitfalls: [
    'EFL, BFL and FFL are three names for "the focal length" — They are three different distances. The EFL is from the principal plane, the BFL from the rear glass surface, the FFL from the front one; in a retrofocus or telephoto lens they differ by tens of millimetres.',
    'The back focal length is the flange focal distance — The flange focal distance runs from the mounting flange to the image plane and is fixed by the mount. The BFL is a property of the lens; the two differ by how far the rear element protrudes past the flange.',
    'The nodal point is where to pivot a camera for panoramas — The point that must stay still is the entrance pupil. For many lenses it lies a good way from the nodal point.',
    'Nodal points are strange special points inside the glass — In air they coincide with the principal points. They only separate when the media on the two sides differ, as in the eye.'
  ],
  terms: [
    { term: 'Cardinal points', def: 'The six points on the axis of a lens system — focal points F and F′, principal points H and H′, nodal points N and N′ — which describe its first-order properties.' },
    { term: 'Nodal points', also: ['N and N′'], def: 'Two conjugate axial points of angular magnification +1: a ray directed at the first leaves the system from the second, parallel to its original direction. In air they coincide with the principal points.' },
    { term: 'Back focal length', also: ['BFL', 'BFD', 'back focal distance', 'back focus'], def: 'The distance from the last surface of a lens to its rear focal point F′. It decides whether a sensor, filter or mirror fits between the lens and the image. Not the same as the flange focal distance.' },
    { term: 'Front focal length', also: ['FFL', 'FFD', 'front focal distance'], def: 'The distance from the first surface of a lens to its front focal point F. (Some textbooks use the term for the distance from H to F, which in air equals the effective focal length.)' },
    { term: 'Nodal slide', def: 'A lens-testing bench on which the lens, carried by a slide, is pivoted about a vertical axis. When the image of a distant source stays still as the lens is turned, the pivot is at the rear nodal point, and the distance from it to the image gives the effective focal length.' }
  ],
  formulas: [
    {
      name: 'Effective focal length from the system matrix',
      expr: 'f = -1/C', tex: 'f = -\\frac{1}{C}',
      vars: {
        f: { name: 'effective focal length', q: 'length', unit: 'mm', signed: true },
        C: { name: 'lower-left element of the system matrix', q: 'optpower', unit: 'D', value: -9.833, signed: true }
      },
      note: 'For a system in air. The element C is minus the power, in 1/m.',
      stories: { f: 'The system matrix of a thick lens has C = {C}. What is its effective focal length?' }
    },
    {
      name: 'Back focal distance from the matrix',
      expr: 'bfd = -A/C', tex: '\\mathrm{BFD} = -\\frac{A}{C}',
      vars: {
        bfd: { name: 'back focal distance (from the last vertex)', q: 'length', unit: 'mm', signed: true, tex: '\\mathrm{BFD}' },
        A: { name: 'upper-left element of the system matrix', value: 0.967, signed: true },
        C: { name: 'lower-left element', q: 'optpower', unit: 'D', value: -9.833, signed: true }
      },
      note: 'Measured from the last surface, to the rear focal point.'
    },
    {
      name: 'Front focal distance from the matrix',
      expr: 'ffd = -D/C', tex: '\\mathrm{FFD} = -\\frac{D}{C}',
      vars: {
        ffd: { name: 'front focal distance (from the first vertex)', q: 'length', unit: 'mm', signed: true, tex: '\\mathrm{FFD}' },
        D: { name: 'lower-right element of the system matrix', value: 0.967, signed: true },
        C: { name: 'lower-left element', q: 'optpower', unit: 'D', value: -9.833, signed: true }
      },
      note: 'Measured from the first surface, to the front focal point.'
    },
    {
      name: 'Displacement of the nodal points',
      expr: 'dN = (n2 - n1)/P', tex: 'd_N = \\frac{n_2 - n_1}{P}',
      vars: {
        dN: { name: 'distance from each principal point to its nodal point', q: 'length', unit: 'mm', signed: true, tex: 'd_N' },
        n1: { name: 'index of the medium in front', value: 1, min: 1, max: 4, tex: 'n_1' },
        n2: { name: 'index of the medium behind', value: 1.336, min: 1, max: 4, tex: 'n_2' },
        P: { name: 'power of the system', q: 'optpower', unit: 'D', value: 58.6 }
      },
      note: 'Towards the image side when n₂ > n₁. For the eye it is 5.7 mm.',
      stories: { dN: 'An optical system of {P} has air ahead of it (index {n1}) and a medium of index {n2} behind it. How far are its nodal points from its principal points?' }
    }
  ],
  examples: [
    {
      title: 'Focal lengths from a matrix',
      q: 'The ray-transfer matrix of a thick lens, from its first vertex to its last, is $A = D = 0.9667$, $B = 6.667$ mm, $C = -0.009833$ mm⁻¹. Find the EFL, BFL and FFL.',
      steps: [
        { text: 'In air, $\\mathrm{EFL} = -1/C$:', tex: '\\mathrm{EFL} = \\frac{1}{0.009833} = 101.7\\ \\mathrm{mm}' },
        { text: 'The back and front focal distances:', tex: '\\mathrm{BFD} = -\\frac{A}{C} = 98.3\\ \\mathrm{mm},\\qquad \\mathrm{FFD} = -\\frac{D}{C} = 98.3\\ \\mathrm{mm}' },
        'The lens is symmetric, so $A = D$ and the BFL equals the FFL; both are 3.4 mm shorter than the EFL because each principal plane lies inside the glass.'
      ],
      a: 'EFL 101.7 mm; BFL = FFL = 98.3 mm.'
    },
    {
      title: 'How big is a degree on the retina?',
      q: 'The relaxed eye has a power of 58.6 D and the vitreous has index 1.336. How far apart are the principal and nodal points, and how large on the retina is an object that subtends 1°?',
      steps: [
        { text: 'The nodal points lie behind the principal points by', tex: 'd_N = \\frac{n_2 - n_1}{P} = \\frac{0.336}{58.6} = 5.7\\ \\mathrm{mm}' },
        'The rear nodal point is about 7.3 mm behind the cornea and the retina 24.4 mm, so the retina is 17.1 mm from N′. A ray aimed at N leaves N′ at the same angle, so 1° maps to $17.1\\times\\tan 1^\\circ = 0.30$ mm.'
      ],
      a: 'The nodal points lie 5.7 mm behind the principal points; one degree of visual angle covers about 0.3 mm of retina.'
    }
  ],
  quiz: [
    { q: 'The effective focal length of a lens is measured…', choices: ['from the rear principal plane to the rear focal point', 'from the rear glass surface to the rear focal point', 'from the mounting flange to the sensor', 'from the front surface to the front focal point'], a: 0, why: 'EFL runs H′ → F′. The distance from the rear glass surface is the BFL; the flange focal distance belongs to the mount.' },
    { q: 'A datasheet gives EFL = 24 mm and BFL = 40 mm for a wide-angle lens. This is…', choices: ['impossible: the BFL cannot exceed the EFL', 'normal for a retrofocus design, which leaves room for a camera\'s mirror', 'a printing error', 'only possible for fisheye lenses'], a: 1, why: 'A negative front group pushes the rear principal plane behind the glass: the focus lies farther from the last lens than f. Wide-angle lenses for reflex cameras are built this way.' },
    { q: 'In air, the nodal points of a lens system coincide with its principal points.', a: true, why: 'They separate only when the media on the two sides have different indices; the displacement is $(n_2 - n_1)/P$.' },
    { q: 'To photograph a panorama without parallax, the camera should be rotated about…', choices: ['the sensor', 'the entrance pupil of the lens', 'the rear principal point', 'the focal point'], a: 1, why: 'Parallax vanishes if the centre of perspective, the entrance pupil, does not move. People call it the "nodal point", but it need not coincide with the nodal points.' },
    { q: 'A thin-lens system has the matrix elements $A = 0.9$ and $C = -0.02$ mm⁻¹. What is its back focal distance, in millimetres?', answer: 45, unit: 'mm', why: '$\\mathrm{BFD} = -A/C = 0.9/0.02 = 45$ mm (and the EFL is $1/0.02 = 50$ mm).' }
  ],
  applications: [
    'Reading lens datasheets: EFL for the picture, BFL for the clearance of filters, sensor windows and mirrors.',
    'Choosing a lens for a camera: the BFL must fit, and the EFL together with the sensor size sets the field of view.',
    'Measuring a focal length on a nodal slide, or finding the principal planes with an autocollimator and a focimeter.',
    'Models of the eye: the reduced eye and Gullstrand\'s schematic eyes, from which retinal image sizes are computed.',
    'Lens-design software reports the cardinal points of every prescription as its first-order summary.'
  ],
  history: 'Gauss gave the theory of the principal planes in 1841; Johann Benedict Listing added the nodal points in 1845 in his work on the optics of the eye. The nodal slide, in which a lens is turned about its rear nodal point to find its focal length, became a standard instrument of the optical testing laboratory.',
  sources: [
    'M. Born and E. Wolf, *Principles of Optics*, ch. 4 (Geometrical Theory of Optical Imaging) — the cardinal points of a centred system.',
    'E. Hecht, *Optics*, ch. 6 (More on Geometrical Optics) — thick lenses, principal planes and the matrix method.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — Gullstrand\'s schematic eyes and the cardinal points of the eye.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — cardinal points and focal lengths.'
  ],
  sim: { id: 'tl-thick', params: { mode: 'cardinal', behind: 1.336 } }
},

/* ================================================================ Newton's form of the lens equation */
{
  id: 'newtons-lens-equation', parent: 'thin-lenses', title: 'Newton\'s form of the lens equation', level: 2,
  short: 'Measure the object and the image from the focal points instead of from the lens and the lens equation becomes x·x′ = f². It makes the focusing extension of a camera lens obvious: to reach magnification m the lens moves out by m times f.',
  keywords: ['Newton', 'Newtonian equation', "Newton's lens equation", 'x x prime equals f squared', 'focusing extension', 'extension tube', 'bellows', 'focus travel', 'macro', 'unit focusing', 'focal distances'],
  prereq: ['the-thin-lens-equation', 'lateral-and-longitudinal-magnification'],
  related: ['close-up-and-extension-tubes', 'focusing-a-lens', 'magnification-and-working-distance', 'thick-lenses-and-principal-planes', 'cardinal-points', 'depth-of-focus', 'physics:thin-lenses'],
  body: `
The ordinary lens equation measures distances from the lens. Newton's form measures them from the **focal points**. Let $x$ be the distance of the object beyond the front focal point F and $x'$ the distance of the image beyond the rear focal point F′. Then

$$x\\,x'=f^2\\qquad m=-\\frac{f}{x}=-\\frac{x'}{f}$$

It is the same physics as $1/s_o+1/s_i=1/f$ — put $x=s_o-f$ and $x'=s_i-f$ and one turns into the other — but the form is simpler, and for some questions much quicker. As before, a real object beyond F and a real image beyond F′ have positive $x$ and $x'$.

### What it says
The product of the two distances is fixed. Bring the object nearer to F and the image runs farther from F′: $x'$ goes up as $x$ comes down, and on log–log axes the relation is a straight line of slope −1 (the graph in the simulation). When $x=x'=f$ we have $s_o=s_i=2f$ and $m=-1$. The magnification is simply the ratio of the distances to the foci: $|m|=x'/f=f/x$.

### Focusing extension
A camera lens focused at infinity puts the image at F′, so $x'=0$. To focus on a nearer subject the lens must be moved *away* from the sensor by exactly $x'=f^2/x=|m|f$.

| Subject distance $s_o$ | $x=s_o-f$ | Extension $x'$ | $m$ |
|---|---|---|---|
| 10 m | 9950 mm | 0.25 mm | 1:200 |
| 2 m | 1950 mm | 1.28 mm | 1:39 |
| 1 m | 950 mm | 2.63 mm | 1:19 |
| 0.5 m | 450 mm | 5.6 mm | 1:9 |
| 0.2 m | 150 mm | 16.7 mm | 1:3 |
| 0.1 m | 50 mm | 50 mm | 1:1 |

(for $f=50$ mm). Reaching life size takes one whole focal length of extension, and the subject then stands $2f$ from the lens. This is the arithmetic of **extension tubes** and bellows ([[close-up-and-extension-tubes]]): a 25 mm tube on a 50 mm lens gives $m=0.5$ with the focus ring at infinity. A 1000 mm telescope focuses on a tree 100 m away by moving its sensor $10^6/99\\,000\\approx10$ mm outwards.

### A bonus for thick systems
The thin-lens equation needs the principal planes. Newton's form does not: $x$ is measured from F and $x'$ from F′, two points that are easy to find, and only the EFL $f$ is needed. That is why it is the form of choice in lens testing. And differentiating gives $\\mathrm{d}x'=-(f^2/x^2)\\,\\mathrm{d}x=-m^2\\,\\mathrm{d}x$: the same $m^2$ as in the [[lateral-and-longitudinal-magnification|longitudinal magnification]].

> [!key] $x\\,x'=f^2$, with $x$ from F to the object and $x'$ from F′ to the image; $m=-x'/f$. To focus on a subject at magnification $m$ a lens moves out from its infinity position by $|m|f$.
`,
  ideas: [
    'Newton\'s form measures the object distance x from the front focal point and the image distance x′ from the rear focal point: x·x′ = f².',
    'The magnification is m = −f/x = −x′/f: simply the ratio of the distances to the foci.',
    'To focus a camera lens at magnification m, move it out from its infinity position by |m|·f; life size needs one focal length of extension.',
    'The relation needs only F, F′ and the EFL, so it applies to thick lenses and systems without finding the principal planes.',
    'On log–log axes x′ against x is a straight line of slope −1.'
  ],
  pitfalls: [
    'x and x′ are the object and image distances — They are measured from the focal points. The distances from the lens are sₒ = f + x and sᵢ = f + x′; a 50 mm lens focused on a subject 2 m away has x′ = 1.3 mm but sᵢ = 51.3 mm.',
    'Focusing moves the lens by the whole image distance — It moves only by x′, the amount the image distance exceeds f: 1.3 mm for a 50 mm lens between infinity and 2 m.',
    'Newton\'s form is a different law from the lens equation — It is the same law written with a shifted origin; either can be derived from the other.',
    'It works only for thin lenses — It holds for any centred system when x and x′ are measured from F and F′ and f is the effective focal length.'
  ],
  terms: [
    { term: 'Newton\'s lens equation', also: ['Newtonian form', 'x x′ = f²', 'Newtonian equation'], def: 'The relation x·x′ = f², in which the object distance x is measured from the front focal point and the image distance x′ from the rear focal point.' },
    { term: 'Focusing extension', also: ['extension', 'lens extension'], def: 'The distance a lens must move away from the sensor (from its infinity position) to focus on a nearer subject: x′ = f²/x = |m|f.' },
    { term: 'Unit focusing', also: ['whole-lens focusing'], def: 'Focusing by moving the whole lens as one unit in and out. The extension is then given by Newton\'s equation; internal focusing moves only some of the elements.' }
  ],
  derivation: {
    title: 'Newton\'s form from the Gaussian equation',
    intro: 'Start from $1/s_o + 1/s_i = 1/f$ and substitute the distances measured from the focal points.',
    steps: [
      { text: 'Multiply through by $s_o s_i f$:', tex: 'f\\,s_i + f\\,s_o = s_o s_i' },
      { text: 'Put $s_o = x + f$ and $s_i = x\' + f$ and expand the right-hand side:', tex: 'f\\,(x\' + f) + f\\,(x + f) = (x + f)(x\' + f) = x x\' + f x + f x\' + f^2' },
      { text: 'The terms $f x$ and $f x\'$ cancel on both sides, and $2f^2 - f^2$ remains:', tex: 'f^2 = x\\,x\'' }
    ]
  },
  formulas: [
    {
      name: 'Newton\'s equation',
      expr: 'xo*xi = f^2', tex: 'x_o\\,x_i = f^2',
      vars: {
        xo: { name: 'object distance from the front focal point', q: 'length', unit: 'mm', value: 450, tex: 'x_o' },
        xi: { name: 'image distance from the rear focal point', q: 'length', unit: 'mm', tex: 'x_i' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 }
      },
      solveFor: 'xi',
      note: 'For a real object beyond F and a real image beyond F′. At x = x′ = f the object and the image are both at 2f.',
      stories: { xi: 'A lens of focal length {f} is focused on a subject whose distance from the front focal point is {xo}. How far must the lens be extended beyond its infinity position?', xo: 'A lens of focal length {f} is extended {xi} beyond its infinity position. How far from the front focal point is the subject in focus?' }
    },
    {
      name: 'Magnification in Newton\'s form',
      expr: 'm = f/xo', tex: '|m| = \\frac{f}{x_o}',
      vars: {
        m: { name: 'magnification (magnitude)' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        xo: { name: 'object distance from the front focal point', q: 'length', unit: 'mm', value: 450, tex: 'x_o' }
      },
      stories: { m: 'A lens of focal length {f} is focused on a subject {xo} beyond its front focal point. What is the magnification?' }
    },
    {
      name: 'Extension needed for a magnification',
      expr: 'xi = m*f', tex: 'x_i = |m|\\,f',
      vars: {
        xi: { name: 'extension beyond the infinity position', q: 'length', unit: 'mm', tex: 'x_i' },
        m: { name: 'magnification (magnitude)', value: 0.5 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'The length of extension tube, or the focus travel, needed to reach magnification m with a lens of focal length f.',
      stories: { xi: 'A {f} macro lens is to reach a magnification of {m}. How far must it be extended beyond its infinity position?' }
    }
  ],
  examples: [
    {
      title: 'A macro lens at half life size',
      q: 'A 100 mm macro lens is to photograph at 1:2 ($|m| = 0.5$). How far must it be extended from its infinity position, and how far from the subject is the lens?',
      steps: [
        { text: 'The extension is $x\' = |m|f$:', tex: 'x\' = 0.5 \\times 100 = 50\\ \\mathrm{mm}' },
        { text: 'The subject is at $x = f^2/x\' = f/|m|$ beyond the front focal point, so', tex: 's_o = f + \\frac{f}{|m|} = 100 + 200 = 300\\ \\mathrm{mm}' },
        'The lens-to-sensor distance is $s_i = f + x\' = 150$ mm; as a check $-s_i/s_o = -0.5$.'
      ],
      a: 'Extension 50 mm (internal focus or a tube); subject 300 mm from the lens.'
    },
    {
      title: 'Focusing a telescope on a tree',
      q: 'A telescope of focal length 1000 mm is focused first on a star and then on a tree 100 m away. How far must the focuser move?',
      steps: [
        { text: 'The tree is at $x = 100\\ \\mathrm{m} - 1\\ \\mathrm{m} = 99\\ \\mathrm{m}$ from F:', tex: 'x\' = \\frac{f^2}{x} = \\frac{(1\\ \\mathrm{m})^2}{99\\ \\mathrm{m}} = 10.1\\ \\mathrm{mm}' }
      ],
      a: 'About 10 mm outwards — a long travel for a telescope focuser, and the reason telescopes cannot easily focus on nearby objects.'
    }
  ],
  quiz: [
    { q: 'In Newton\'s form of the lens equation, the object distance $x$ is measured from…', choices: ['the lens', 'the front focal point', 'the rear focal point', 'the principal plane'], a: 1, why: '$x$ runs from F to the object; $x\'$ runs from F′ to the image. Both are measured away from the lens.' },
    { q: 'A lens of focal length 100 mm images an object 400 mm beyond its front focal point. How far beyond the rear focal point is the image, in millimetres?', answer: 25, unit: 'mm', why: '$x\' = f^2/x = 100^2/400 = 25$ mm; the magnification is $-25/100 = -0.25$.' },
    { q: 'To photograph life size with a 50 mm lens, the lens must be moved how far from its infinity position?', choices: ['10 mm', '25 mm', '50 mm', '100 mm'], a: 2, why: '$x\' = |m|f = 1 \\times 50$ mm: one focal length. The lens is then at $s_i = 2f = 100$ mm from the sensor.' },
    { q: 'If the distance of the object from the front focal point doubles, the distance of the image from the rear focal point is halved.', a: true, why: '$x\\,x\' = f^2$ is a constant, so doubling $x$ halves $x\'$.' },
    { q: 'A 100 mm lens is set to magnification 1:2. How far is the sensor from the lens (the image distance), in millimetres?', answer: 150, unit: 'mm', why: '$x\' = |m|f = 50$ mm, so $s_i = f + x\' = 150$ mm.' }
  ],
  applications: [
    'Extension tubes and bellows for macro photography: the tube length divided by the focal length is the magnification gained.',
    'The helicoid of a camera lens or the focuser of a telescope: its travel follows x′ = f²/x.',
    'Focal-length measurement on an optical bench: measure x and x′ for any one setting, and f = √(x·x′).',
    'Machine-vision set-ups, where the working distance and the magnification fix the extension needed from a fixed-focus lens.',
    'Thick lens and lens-system calculations, where the focal points are known but the principal planes are not.'
  ],
  history: 'The relation is named after Isaac Newton, who treated lenses through the distances from their foci. It is exactly equivalent to the form with distances from the lens, but remains the natural one wherever the focal points, not the lens, are the known references: focusing extensions, macro photography and lens testing.',
  sources: [
    'E. Hecht, *Optics*, ch. 5 (Geometrical Optics) — the Newtonian form of the lens equation.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — Newton\'s equations and the focusing extension.',
    'R. Kingslake, *Optics in Photography* — extension and bellows factor in close-up photography.'
  ],
  sim: { id: 'tl-equation', params: { mode: 'newton', sf: 2 } }
},

/* ================================================================ cylindrical and toric lenses */
{
  id: 'cylindrical-and-toric-lenses', parent: 'thin-lenses', title: 'Cylindrical and toric lenses', level: 2,
  short: 'A cylindrical lens has power in one meridian only and focuses a round beam to a line; a toric lens has two different powers at right angles and two line foci. They correct astigmatism, shape laser beams and squeeze cinema pictures.',
  keywords: ['cylindrical lens', 'cylinder lens', 'toric lens', 'spherocylindrical', 'astigmatic lens', 'meridian', 'line focus', 'focal line', 'Sturm', 'interval of Sturm', 'circle of least confusion', 'spherical equivalent', 'cylinder axis', 'astigmatism correction', 'anamorphic', 'sphere cylinder axis'],
  prereq: ['lens-shapes-and-names', 'focal-length-and-optical-power', 'the-thin-lens-equation'],
  related: ['astigmatism-of-the-eye', 'cylinder-axis-and-transposition', 'reading-a-prescription', 'laser-line-generators', 'anamorphic-lenses', 'optical-disc-pickups', 'collimating-a-laser-diode', 'astigmatism-of-lenses', 'physics:vision-correction'],
  body: `
A spherical lens has the same power in every direction. A **cylindrical** lens has power in one direction only, and a **toric** lens has two different powers at right angles. They are the lenses of astigmatic spectacles, laser line generators, anamorphic cinema and disc-player pickups.

### The cylindrical lens
Cut a slice from a glass cylinder: one face flat, the other a half-cylinder. Across the cylinder the surface is curved like a circle of radius $R$, giving a power $(n-1)/R$. Along its axis the surface is straight, and there is no power at all. A round parallel beam is therefore focused in the curved direction only, to a **line focus parallel to the cylinder's axis**. A plano-convex cylinder of N-BK7 with $R=25.8$ mm has $f=50$ mm (+20 D) in one plane and nothing in the other; the line is as long as the beam is wide along the axis.

### Meridians and the sphero-cylinder
A **meridian** is the plane through the optical axis at a given angle. A toric lens has two *principal meridians* at right angles with powers $P_1$ and $P_2$. In between, the power follows

$$P(\\theta)=S+C\\sin^2\\theta$$

where $S$ is the power along the cylinder axis (the **sphere**), $C$ the added **cylinder** power, and $\\theta$ the angle from the axis. This is how prescriptions are written: sphere / cylinder × axis.

### Two line foci
Through a toric lens there is no point focus. The meridian of power $P_1$ focuses at $1/P_1$, the other at $1/P_2$: two **line foci** at right angles, separated by the **interval of Sturm**. Between them a round beam becomes an ellipse. Where the ellipse is a circle, at the dioptric midpoint $2/(P_1+P_2)$, the blur is smallest: the **circle of least confusion**, whose power is the **spherical equivalent** $S+C/2$. For $+4$ D and $+2$ D the line foci are at 250 mm and 500 mm, the circle of least confusion at 333 mm, and its diameter is a third of the beam's.

### Reading a prescription
"$-1.00 / -2.00\\times180$" means $-1.00$ D along the axis (the horizontal, 180°) and $-3.00$ D at 90°; the spherical equivalent is $-2.00$ D. The same lens can be written $-3.00 / +2.00\\times90$ by *transposition* ([[cylinder-axis-and-transposition]]). Cylinders in spectacles run from 0.25 D to several dioptres, in steps of 0.25 D; they correct [[astigmatism-of-the-eye|astigmatism]], where the cornea is steeper in one meridian than the other.

### Beyond spectacles
A laser diode emits a beam that diverges by roughly 30° (full angle) in one direction and 8° in the other, typical figures; a cylindrical lens in front collimates the fast axis alone. A pair of cylinders at right angles can circularize or reshape the beam, and one cylinder makes a line ([[laser-line-generators]]). Anamorphic cinema lenses squeeze the picture 2× horizontally with cylinders ([[anamorphic-lenses]]). A disc-player pickup puts a cylindrical lens in front of a four-quadrant detector, so that the spot turns into an ellipse of one diagonal or the other when the disc is out of focus.

> [!key] A cylindrical lens focuses in one meridian to a line parallel to its axis. A toric lens has two powers, two line foci and a circle of least confusion between them, at the spherical equivalent $S+C/2$.
`,
  ideas: [
    'A cylindrical lens has power only across its axis and focuses a round beam to a line parallel to the axis.',
    'A toric (sphero-cylindrical) lens has two principal meridians at right angles with powers P₁ and P₂, and P(θ) = S + C·sin²θ in between.',
    'Through a toric lens there are two line foci, 1/P₁ and 1/P₂ from the lens; the gap is the interval of Sturm.',
    'The circle of least confusion lies at 2/(P₁ + P₂), and its power is the spherical equivalent S + C/2.',
    'A prescription "sphere / cylinder × axis" gives the power along the axis and the extra power across it.'
  ],
  pitfalls: [
    'The line focus is perpendicular to the cylinder axis — It is parallel to it. A cylinder with a vertical axis focuses light across it, in the horizontal direction, and so makes a vertical line.',
    'The cylinder axis is the direction in which the lens has power — It is the direction in which it has none (the power of the cylinder acts at 90° to the axis).',
    'An astigmatic lens has no focus — It has two, one for each principal meridian, a distance apart; the best compromise, the circle of least confusion, lies halfway in dioptres, not halfway in millimetres.',
    'A cylindrical lens makes the image blurry — It only distorts it in one direction: each meridian is imaged sharply at its own distance, which is why astigmatic vision shows horizontal and vertical lines at different clarity.'
  ],
  terms: [
    { term: 'Cylindrical lens', also: ['cylinder lens'], def: 'A lens with at least one cylindrical surface: power only in the meridian across the cylinder, none along its axis. It focuses a parallel beam to a line parallel to its axis.' },
    { term: 'Toric lens', also: ['spherocylindrical lens', 'sphero-cylinder', 'astigmatic lens'], def: 'A lens whose power differs between two perpendicular principal meridians, as in a spectacle lens for astigmatism. It forms two line foci and no point focus.' },
    { term: 'Cylinder axis', also: ['axis'], def: 'The direction, in degrees (0°–180°), along which a cylinder has no power; its power acts across this direction. In a prescription it follows the cylinder power: −1.00 / −2.00 × 180.' },
    { term: 'Line focus', also: ['focal line', 'astigmatic focus'], def: 'The line, not a point, to which a beam is focused by a cylindrical or toric lens in one of its meridians.' },
    { term: 'Interval of Sturm', also: ['Sturm\'s conoid', 'astigmatic interval'], def: 'The distance between the two line foci of an astigmatic system, inside which a round beam passes through ellipses.' },
    { term: 'Circle of least confusion', also: ['disc of least confusion'], def: 'The smallest round blur of an astigmatic beam, between the two line foci, where the beam is a circle: at the dioptric midpoint of the two focal distances.' },
    { term: 'Spherical equivalent', also: ['SE', 'mean sphere', 'mean power'], def: 'The sphere power that gives the circle of least confusion: the sphere plus half the cylinder, S + C/2.' }
  ],
  formulas: [
    {
      name: 'Power in a meridian',
      expr: 'P = S + C*sin(theta)^2', tex: 'P(\\theta) = S + C\\,\\sin^2\\theta',
      vars: {
        P: { name: 'power in the meridian', q: 'optpower', unit: 'D', signed: true },
        S: { name: 'sphere (power along the cylinder axis)', q: 'optpower', unit: 'D', value: -1, signed: true },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -2, signed: true },
        theta: { name: 'angle of the meridian from the axis', q: 'angle', unit: '°', value: 45, min: 0, max: 90, tex: '\\theta' }
      },
      note: 'At θ = 0 the power is S; at 90° it is S + C.',
      stories: { P: 'A lens is prescribed {S} sphere and {C} cylinder. What power does it have in the meridian {theta} from the axis?' }
    },
    {
      name: 'Spherical equivalent',
      expr: 'SE = S + C/2', tex: '\\mathrm{SE} = S + \\frac{C}{2}',
      vars: {
        SE: { name: 'spherical equivalent', q: 'optpower', unit: 'D', signed: true, tex: '\\mathrm{SE}' },
        S: { name: 'sphere', q: 'optpower', unit: 'D', value: -1, signed: true },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -2, signed: true }
      },
      stories: { SE: 'A spectacle lens has a sphere of {S} and a cylinder of {C}. What is its spherical equivalent?' }
    },
    {
      name: 'Position of the circle of least confusion',
      expr: 'z = 2/(P1 + P2)', tex: 'z = \\frac{2}{P_1 + P_2}',
      vars: {
        z: { name: 'distance from the lens', q: 'length', unit: 'mm' },
        P1: { name: 'power in the first principal meridian', q: 'optpower', unit: 'D', value: 4, tex: 'P_1' },
        P2: { name: 'power in the second principal meridian', q: 'optpower', unit: 'D', value: 2, tex: 'P_2' }
      },
      note: 'Halfway between the two line foci in dioptres, not in millimetres.',
      stories: { z: 'A toric lens has powers of {P1} and {P2} in its principal meridians. Where is the circle of least confusion?' }
    },
    {
      name: 'Diameter of the circle of least confusion',
      expr: 'b = D*(P1 - P2)/(P1 + P2)', tex: 'b = D\\,\\frac{P_1 - P_2}{P_1 + P_2}',
      vars: {
        b: { name: 'diameter of the smallest blur circle', q: 'length', unit: 'mm' },
        D: { name: 'diameter of the (round, parallel) beam', q: 'length', unit: 'mm', value: 20 },
        P1: { name: 'larger power', q: 'optpower', unit: 'D', value: 4, tex: 'P_1' },
        P2: { name: 'smaller power', q: 'optpower', unit: 'D', value: 2, tex: 'P_2' }
      },
      note: 'For P₁ ≥ P₂. The blur is a third of the beam for 4 D and 2 D.'
    },
    {
      name: 'Power of a cylindrical surface',
      expr: 'P = (n - 1)/R', tex: 'P = \\frac{n - 1}{R}',
      vars: {
        P: { name: 'power across the cylinder', q: 'optpower', unit: 'D' },
        n: { name: 'refractive index', value: 1.517, min: 1.05, max: 4 },
        R: { name: 'radius of the cylinder', q: 'length', unit: 'mm', value: 25.84 }
      },
      note: 'For a plano-convex cylindrical lens; the power along the axis is zero.',
      stories: { P: 'A plano-convex cylindrical lens of index {n} has a cylinder of radius {R}. What is its power across the axis?' }
    }
  ],
  examples: [
    {
      title: 'The meridians of a prescription',
      q: 'A spectacle lens is prescribed $-1.00 / -2.00 \\times 180$. What is its power along the horizontal, along the vertical and at 45°, and what is its spherical equivalent?',
      steps: [
        'The axis is 180°, the horizontal. Along the axis the power is the sphere, $-1.00$ D.',
        { text: 'Across it, in the vertical meridian (90° from the axis), the cylinder is added in full: $-1.00 + (-2.00) = -3.00$ D. At 45° from the axis:', tex: 'P = S + C\\sin^2 45^\\circ = -1.00 - 2.00 \\times 0.5 = -2.00\\ \\mathrm{D}' },
        { text: 'The spherical equivalent is', tex: '\\mathrm{SE} = S + \\frac{C}{2} = -1.00 - 1.00 = -2.00\\ \\mathrm{D}' }
      ],
      a: '−1.00 D horizontally, −3.00 D vertically, −2.00 D at 45°; spherical equivalent −2.00 D. (Transposed: −3.00 / +2.00 × 90.)'
    },
    {
      title: 'Two line foci',
      q: 'A toric lens has powers of +4 D (vertical meridian) and +2 D (horizontal) and a 20 mm round beam falls on it. Where are the line foci, where is the circle of least confusion, and what does a screen at 400 mm show?',
      steps: [
        'The vertical meridian focuses at $1/4\\ \\mathrm{D} = 250$ mm (a horizontal line), the horizontal at $1/2\\ \\mathrm{D} = 500$ mm (a vertical line): the interval of Sturm is 250 mm.',
        { text: 'The circle of least confusion lies at', tex: 'z = \\frac{2}{4 + 2}\\ \\mathrm{m} = 333\\ \\mathrm{mm},\\qquad b = 20\\times\\frac{4-2}{4+2} = 6.7\\ \\mathrm{mm}' },
        'At 400 mm the half-width is $10\\,|1 - 0.4\\times 2| = 2$ mm and the half-height $10\\,|1 - 0.4\\times 4| = 6$ mm: an ellipse 4 mm wide and 12 mm tall.'
      ],
      a: 'Line foci at 250 mm and 500 mm; blur circle 6.7 mm across at 333 mm; at 400 mm an ellipse 4 mm × 12 mm.'
    }
  ],
  quiz: [
    { q: 'A cylindrical lens has its axis vertical. A round collimated beam is focused by it to…', choices: ['a point', 'a vertical line', 'a horizontal line', 'a circle'], a: 1, why: 'The lens focuses across its axis, in the horizontal direction, and leaves the vertical direction alone: the beam is squeezed to a thin vertical line, parallel to the axis.' },
    { q: 'A lens is prescribed $+1.00 / +2.00 \\times 90$. What is its power in the horizontal meridian, in dioptres?', answer: 3, why: 'The axis is vertical (90°); the horizontal meridian is 90° from it, so it carries the sphere plus the full cylinder: $+1.00 + 2.00 = +3.00$ D.' },
    { q: 'What is the spherical equivalent, in dioptres, of $-1.00 / -2.00 \\times 180$?', answer: -2, why: '$\\mathrm{SE} = S + C/2 = -1.00 - 1.00 = -2.00$ D.' },
    { q: 'A cylindrical lens has no power along its own axis.', a: true, why: 'Along the axis the surface is a straight line: nothing bends the rays. All the power acts across the axis.' },
    { q: 'A toric lens has powers of +3 D and +5 D. How far from the lens, in millimetres, is the circle of least confusion?', answer: 250, unit: 'mm', why: '$z = 2/(P_1 + P_2) = 2/8\\ \\mathrm{m} = 0.25$ m. It lies at the mean power of 4 D, between the line foci at 333 mm and 200 mm.' }
  ],
  applications: [
    'Spectacles and contact lenses for astigmatism, where the cornea has different curvatures in two meridians.',
    'Laser diodes: a cylindrical fast-axis collimator, and cylindrical pairs to make the elliptical beam round.',
    'Line lasers and light sheets, where a cylinder (or a Powell lens) spreads a beam into a line.',
    'Anamorphic lenses for cinema and projection, which squeeze the picture in one direction with cylinders.',
    'Optical disc pickups: a cylindrical lens makes the focus-error signal by turning a defocused spot into an ellipse.'
  ],
  history: 'Thomas Young recognized astigmatism in his own eye in 1801. In 1825 the astronomer George Biddell Airy had spectacles made with a cylindrical surface to correct his own, the first such correction. The geometry of the two line foci and the cone between them was worked out by Charles Sturm in 1838.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — toric lenses, meridional powers and the spherical equivalent.',
    'E. Hecht, *Optics*, ch. 5 and 6 — cylindrical lenses and astigmatism.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — sphere, cylinder, axis and toric surface.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE) — toric surfaces and astigmatic foci.'
  ],
  sim: 'tl-cylinder'
}

);
