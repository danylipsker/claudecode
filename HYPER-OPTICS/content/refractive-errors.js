/* HYPER-OPTICS · content/refractive-errors.js — the topic "Visual deficiencies" (refractive-errors)
 * The first four pages are the optics of focusing — the normal eye, short sight, long sight, astigmatism — then presbyopia,
 * colour-vision deficiency, and the conditions that are not errors of focus: amblyopia and strabismus, cataract, glaucoma, disease of
 * the macula and retina, keratoconus, and low vision with the magnification that helps it. These pages explain how the eye
 * works, what is measured and what the numbers mean; they never diagnose or advise treatment.
 */
Hyper.add(

/* ================================================================ the normal eye and its errors */
{
  id: 'emmetropia-and-refractive-error', parent: 'refractive-errors', title: 'The normal eye and refractive error', level: 1,
  short: 'An eye sees a distant object sharply when its optics bring the light to a focus exactly on the retina. When the power and the length of the eye do not match, the focus falls in front of the retina or behind it: a refractive error, measured in dioptres.',
  keywords: ['emmetropia', 'ametropia', 'refractive error', 'dioptre', 'diopter', 'far point', 'sphere', 'axial length', 'myopia', 'hyperopia', 'blur', 'defocus', 'visual deficiency'],
  prereq: ['the-eye-as-a-camera', 'accommodation', 'focal-length-and-optical-power'],
  related: ['myopia', 'hyperopia', 'astigmatism-of-the-eye', 'presbyopia', 'reading-a-prescription', 'how-spectacle-lenses-correct-vision', 'the-eye-examination', 'aberrations-of-the-eye', 'physics:the-eye', 'physics:vision-correction'],
  body: `
The eye is a camera with a fixed back wall. Its optics, the cornea and the lens, have a certain power; its length from the cornea to the retina is whatever it is. For a sharp picture the two must match: light from a distant object has to come to a focus **on the retina**, not in front of it and not behind it. An eye in which they match, with its lens relaxed, is **emmetropic**. An eye in which they do not is **ametropic**: it has a **refractive error**.

> [!note] This page explains how the eye focuses and how errors of focus are described. It cannot say what is true of any one person's eyes; only an eye examination can.

### The numbers of a typical eye
| Part | Typical value |
|---|---|
| Whole eye | about 60 D (focal length about 17 mm) |
| Cornea, mostly its front surface | about 43 D |
| Crystalline lens, relaxed | about 19 D |
| Length, front of the cornea to the retina | about 24 mm |
The powers do not simply add: the lens sits some 5 mm behind the cornea, which costs about 3 D, so 43 + 19 comes to a little under 60. Of the focusing power, two thirds are the cornea's.

### A millimetre is nearly three dioptres
With a focal length of only 17 mm the eye is very sensitive to its own length. In the model traced in the simulation below, an eye longer by 0.38 mm has an error of −1 D, one longer by 1.17 mm has −3 D, and one shorter by 0.72 mm has +2 D: about **2.7 D per millimetre** for small errors, falling to 2.4 D/mm at −8 D. A refractive error is therefore a matter of fractions of a millimetre. If the length is at fault the error is **axial**; if the curvature or the lens is at fault it is **refractive** in the narrow sense.

### The kinds of error
- **Myopia** (short sight): the focus is in front of the retina. See [[myopia]].
- **Hyperopia** (long sight): the focus is behind the retina. See [[hyperopia]].
- **Astigmatism**: the power differs from one meridian to another. See [[astigmatism-of-the-eye]].
- **Presbyopia** is not a fixed error but the loss of focusing power with age. See [[presbyopia]].

The first two are **spherical** errors, the same in every direction. The error is stated as the power of the lens that would put the focus on the retina of a relaxed eye: negative for myopia, positive for hyperopia. With the cylinder and its axis this is the prescription ([[reading-a-prescription]]). The **far point** is the farthest distance a relaxed eye sees sharply: infinity for an emmetropic eye, $1/|K|$ metres for an error of $K$ dioptres.

### How much blur an error makes
A point out of focus by $K$ dioptres through a pupil of $p$ millimetres becomes a disc $K\\,p$ milliradians across. With a 4 mm pupil, 1 D is 4 mrad, about 14 arc-minutes, fourteen times the one arc-minute of fine detail in 20/20 vision. Typical daylight acuity with 0.5 D of uncorrected defocus is about 20/45; with 1 D, about 20/80; with 2 D, 20/180; with 3 D, 20/320. A smaller pupil blurs less, which is why squinting helps a little.

> [!key] Sharp sight needs the focus on the retina. The eye's length and power must agree to a fraction of a millimetre, and the error is the power of the lens that would restore the agreement.
`,
  ideas: [
    'An emmetropic eye with its lens relaxed focuses a distant object exactly on the retina; any other state is a refractive error.',
    'The eye is so short that 1 mm of length is worth about 2.7 D: errors are fractions of a millimetre.',
    'Myopia and hyperopia are spherical errors; astigmatism differs by meridian; presbyopia is a loss of focusing with age.',
    'The blur disc of a defocus of K dioptres through a p mm pupil is K·p milliradians across.',
    'The far point is the distance seen sharply with no focusing effort: infinity if emmetropic, 1/|K| metres if myopic.'
  ],
  pitfalls: [
    'Good distance vision means there is no refractive error — A young long-sighted eye can pull its focus forward by accommodating and see the distance clearly while carrying an error that tires it. Sharp sight does not prove emmetropia.',
    'Short sight means the eye is too strong, and long sight too weak, so the lens is at fault — Often the length is at fault: the eye is a little too long or too short for its power. Both explanations occur, and the optics alone cannot tell which.',
    'A refractive error is an eye disease — It is a mismatch between two normal properties, and an optical correction fixes the focus. Some conditions with the same blurred look, such as cataract, are different things.',
    'Squinting sharpens the picture by changing the focus — It narrows the pupil, which reduces the blur disc; the focus itself does not move.'
  ],
  terms: [
    { term: 'Emmetropia', def: 'The state of an eye in which, with the lens relaxed, parallel light from a distant object comes to a focus on the retina.' },
    { term: 'Ametropia', also: ['refractive error'], def: 'Any state in which the focus of the relaxed eye does not fall on the retina: myopia, hyperopia or astigmatism.' },
    { term: 'Dioptre', also: ['D', 'diopter'], def: 'The unit of optical power: the reciprocal of a focal length in metres. A 1 D lens focuses at 1 m; the eye as a whole is about 60 D.' },
    { term: 'Far point', also: ['punctum remotum'], def: 'The farthest distance at which an eye sees sharply with its lens relaxed. It is infinity for an emmetropic eye and 1/|K| metres for a myopic eye of K dioptres.' },
    { term: 'Axial ametropia', def: 'A refractive error caused by an eye that is too long or too short for its power, as opposed to one caused by the curvature or the index of its parts.' },
    { term: 'Spherical error', also: ['sphere'], def: 'A refractive error that is the same in every meridian of the eye; the part of a prescription that is not the cylinder.' }
  ],
  formulas: [
    {
      name: 'Change of refraction with length of the eye',
      expr: 'Kerr = ratio*dL', tex: 'K = \\rho\\,\\Delta L',
      vars: {
        Kerr: { name: 'change in refractive state (negative: more myopic)', q: false, unit: 'D', signed: true, tex: 'K' },
        ratio: { name: 'dioptres per millimetre of length', q: false, unit: 'D/mm', value: -2.7, signed: true, min: -3.2, max: -2.2, tex: '\\rho' },
        dL: { name: 'change in length of the eye', q: false, unit: 'mm', value: 1, signed: true, tex: '\\Delta L' }
      },
      solveFor: 'Kerr',
      note: 'A rule of thumb for small errors, from a schematic eye: a longer eye is more myopic, so the factor is negative.',
      stories: { Kerr: 'An eye is {dL} longer than the length that matches its power. By how much does its refractive state change?' }
    },
    {
      name: 'Diameter of the blur disc',
      expr: 'beta = K*p', tex: '\\beta = K\\,p',
      vars: {
        beta: { name: 'blur disc, as an angle', q: false, unit: 'mrad', tex: '\\beta' },
        K: { name: 'defocus', q: false, unit: 'D', value: 1, min: 0, max: 10, tex: 'K' },
        p: { name: 'pupil diameter', q: false, unit: 'mm', value: 4, min: 1, max: 8, tex: 'p' }
      },
      solveFor: 'beta',
      note: 'A geometrical estimate: dioptres times millimetres gives milliradians. Diffraction adds a little at very small pupils.',
      stories: { beta: 'An eye is out of focus by {K} and its pupil is {p} across. How wide is the blur disc of a point?' }
    },
    {
      name: 'Far point of a myopic eye',
      expr: 'dfar = 1/Kmyo', tex: 'd_{\\mathrm{far}} = \\frac{1}{K_{\\mathrm{myo}}}',
      vars: {
        dfar: { name: 'far point, from the eye', q: 'length', unit: 'cm', tex: 'd_{\\mathrm{far}}' },
        Kmyo: { name: 'size of the myopic error', q: 'optpower', unit: 'D', value: 3, min: 0.1, max: 20, tex: 'K_{\\mathrm{myo}}' }
      },
      solveFor: 'dfar',
      stories: { dfar: 'An eye has a myopic error of {Kmyo}. How far away is its far point?' }
    }
  ],
  examples: [{
    title: 'A third of a millimetre',
    q: 'Using 2.7 D per millimetre, by how much longer than normal is an eye with an error of −4 D, and what blur disc does it make for a 3 mm pupil?',
    steps: [
      { text: 'Length change from the rule:', tex: '\\Delta L = \\frac{4\\ \\text{D}}{2.7\\ \\text{D/mm}} \\approx 1.5\\ \\text{mm}' },
      'The traced model gives 1.58 mm for −4 D, a little more, because the factor falls slowly with the size of the error.',
      { text: 'The blur disc:', tex: '\\beta = K\\,p = 4 \\times 3 = 12\\ \\text{mrad} \\approx 41\\ \\text{arc-minutes}' }
    ],
    a: 'About 1.5 mm longer than the matching length; a blur disc of 12 mrad, forty times the detail that 20/20 resolves.'
  }],
  quiz: [
    { q: 'In an emmetropic eye with the lens relaxed, where do the rays from a distant point come to a focus?', choices: ['In front of the retina', 'On the retina', 'Behind the retina', 'On the cornea'], a: 1, why: 'That is the definition: the power and the length of the eye match. A focus in front of the retina is myopia and one behind it is hyperopia.' },
    { q: 'A young person sees distant signs clearly, so their eyes must be emmetropic.', a: false, why: 'A long-sighted eye can use accommodation to pull its focus onto the retina and see the distance clearly, while having an error. A clear distance view proves only that the eye can focus.' },
    { q: 'Roughly how much does an extra millimetre of axial length change the refractive state of the eye?', choices: ['0.3 D', '1 D', '2.7 D', '10 D'], a: 2, why: 'The eye has a focal length of about 17 mm, so a small shift of the retina is a large change in dioptres: about 2.7 D per millimetre near 0 D.' },
    { q: 'A pupil of 4 mm and a defocus of 2.5 D: how wide, in milliradians, is the blur disc of a point?', answer: 10, unit: 'mrad', why: 'The blur disc is the defocus in dioptres times the pupil in millimetres: 2.5 × 4 = 10 mrad, about 34 arc-minutes.' },
    { q: 'Why does squinting make things look a little clearer to an uncorrected eye?', choices: ['It moves the focus onto the retina', 'It narrows the pupil, so the blur disc is smaller', 'It makes the cornea steeper', 'It brightens the image'], a: 1, why: 'The blur disc is proportional to the pupil diameter. The focus does not move; the same defocus simply smears a point less.' }
  ],
  applications: [
    'Every eye examination starts from this idea: objective and subjective refraction find the lens that moves the focus onto the retina ([[the-eye-examination]]).',
    'Spectacles, contact lenses, implanted lenses and laser surgery are all ways of changing the match between power and length.',
    'Public-health estimates of vision impairment count uncorrected refractive error, because an inexpensive lens can remove it.',
    'Schematic and model eyes in optical design and in instruments for testing lenses use the same 60 D, 24 mm eye.'
  ],
  history: 'Johannes Kepler explained in 1604 that the eye forms an inverted image on the retina and that short and long sight are images falling in front of it or behind it. The words emmetropia and ametropia, and the classification of errors into myopia, hyperopia and astigmatism, come from Franciscus Donders, whose 1864 book on the anomalies of accommodation and refraction of the eye is the foundation of modern refraction.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the schematic eye and the refractive errors.',
    'Franciscus C. Donders, *On the Anomalies of Accommodation and Refraction of the Eye* (1864).',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the terms of refraction.',
    'World Health Organization, *World report on vision* (2019) — the extent of vision impairment and its causes.'
  ],
  sim: 're-eye-model'
},

/* ================================================================ myopia */
{
  id: 'myopia', parent: 'refractive-errors', title: 'Myopia (short sight)', level: 1,
  short: 'In myopia the eye is too long for its power, or too strong for its length, so a distant object comes to a focus in front of the retina and looks blurred. Near objects are sharp; the far point is at 1/|K| metres, and a diverging (minus) lens moves the focus back.',
  keywords: ['myopia', 'short sight', 'near-sighted', 'nearsighted', 'minus lens', 'far point', 'axial length', 'high myopia', 'progression', 'negative dioptres', 'concave lens'],
  prereq: ['emmetropia-and-refractive-error', 'focal-length-and-optical-power', 'accommodation'],
  related: ['hyperopia', 'how-spectacle-lenses-correct-vision', 'vertex-distance-and-effective-power', 'contact-lenses', 'intraocular-lenses-and-refractive-surgery', 'glaucoma-and-the-visual-field', 'macular-degeneration-and-retinal-disease', 'physics:vision-correction'],
  body: `
A short-sighted eye is a camera focused too near. Parallel rays from a distant object meet **in front of the retina** and spread out again, so on the retina a point of light becomes a disc. Bring the object closer and its rays arrive diverging; the eye focuses them farther back, and at one particular distance, the **far point**, they land exactly on the retina. Everything nearer than that is sharp; everything beyond is not. The far point of an eye with an error of $K$ dioptres (magnitude) is $1/K$ metres.

> [!note] This page explains how myopia works and how it is described. It is not a way to find out whether you have it, and what to do about it is a decision for an eye-care professional.

### What the numbers mean
| Error | Far point | Eye longer by (model) | Typical uncorrected acuity | Lens at 12 mm |
|---|---|---|---|---|
| −0.5 D | 2 m | 0.2 mm | 20/45 | −0.50 D |
| −1 D | 1 m | 0.4 mm | 20/80 | −1.01 D |
| −2 D | 50 cm | 0.8 mm | 20/180 | −2.05 D |
| −3 D | 33 cm | 1.2 mm | 20/320 | −3.11 D |
| −4 D | 25 cm | 1.6 mm | 20/500 | −4.20 D |
| −6 D | 17 cm | 2.5 mm | worse than 20/400 | −6.47 D |
Acuities are for a 4 mm pupil in daylight and are rough. The last column is the spectacle lens that places the focus at the far point; a contact lens, which sits on the eye, needs slightly less power, the difference growing with the error ([[vertex-distance-and-effective-power]]).

### The lens that corrects it
A diverging lens makes distant rays leave as if they came from a point at the far point. Its focal length is therefore the distance from the lens to the far point, with a minus sign: $F = -1/(d_{\\text{far}} - d_v)$, where $d_v$ is the distance of the lens from the eye ([[how-spectacle-lenses-correct-vision]]).

### Why it matters and how common it is
The near point of a myopic eye is also close: a −3 D eye of 25 years sees clearly from 33 cm in to 7 cm, which is why short-sighted people read without help and take their glasses off for fine work. Myopia usually begins in school age and grows as the eye lengthens, then settles in the twenties. A projection (Holden and colleagues, 2016) put myopia at about 1.4 billion people (23 %) in 2000 and about 4.8 billion (half the world) by 2050; high myopia was estimated to rise from about 160 million to about 940 million. In some urban East Asian populations most young adults are myopic. Studies link it to heredity, to near work and to little time outdoors; association is not a recipe.

### High myopia
An eye beyond about −6 D, or longer than about 26 mm, has a stretched wall and a thinner retina. Such eyes have a raised risk of retinal tears and detachment, of myopic damage at the macula, of glaucoma and of cataract, and are checked more carefully for that reason ([[macular-degeneration-and-retinal-disease]], [[glaucoma-and-the-visual-field]]).

> [!warn] Sudden flashes of light, a shower of new floaters, or a curtain or shadow spreading over part of the view can mean a torn or detached retina, to which myopic eyes are more prone. Seek urgent eye care.

> [!key] The myopic eye focuses in front of the retina; its far point is $1/K$ metres and a minus lens of that focal length corrects it. Each dioptre is a third of a millimetre of extra length.
`,
  ideas: [
    'A myopic eye focuses distant objects in front of the retina; near objects, inside the far point, are sharp.',
    'The far point is 1/|K| metres, and the correcting lens is a diverging lens whose focal length is the distance from the lens to the far point.',
    'About a third of a millimetre of extra length is one dioptre of myopia.',
    'Myopia usually starts in childhood and is rising worldwide; high myopia raises the risk of several retinal problems.',
    'A spectacle lens needs a little more power than the contact lens that does the same work.'
  ],
  pitfalls: [
    'A short-sighted person has better near vision than others — The near point is closer, so close work is sharp without help; but only because the whole range of clear sight is shifted towards the eye. It is a trade, and it does not make the eye better.',
    'Wearing glasses makes myopia worse — A correction does not change the length of the eye. Myopia grows with the eye\'s growth in childhood, and a correction only reveals how blurred sight already was.',
    'A minus lens makes distant things smaller because it is concave — The lens does shrink the image slightly, but the point is that it moves the focus back onto the retina. A person with myopia and no correction sees blur, not a larger or smaller world.',
    'Myopia is only a nuisance that glasses fully solve — In high myopia the eye itself is changed; the lens corrects the focus but not the stretched retina, so regular eye examinations matter.'
  ],
  terms: [
    { term: 'Myopia', also: ['short sight', 'near-sightedness'], def: 'A refractive error in which parallel light comes to a focus in front of the retina. Its size is given in negative dioptres.' },
    { term: 'Minus lens', also: ['diverging lens', 'concave lens', 'negative lens'], def: 'A lens thinner at the middle than at the edge, with a negative power, that spreads parallel light. It is the correction for myopia.' },
    { term: 'High myopia', def: 'Myopia of about −6 D or more, or an eye longer than about 26 mm. It carries a higher risk of retinal and other eye disease.' },
    { term: 'Axial length', def: 'The distance from the front of the cornea to the retina along the axis of the eye, about 24 mm in an emmetropic adult.' },
    { term: 'Myopia progression', def: 'The growth of myopic error as a child\'s eye lengthens, usually fastest at school age and slowing in the late teens and twenties.' }
  ],
  formulas: [
    {
      name: 'Far point of a myopic eye',
      expr: 'dfar = 1/Kmyo', tex: 'd_{\\mathrm{far}} = \\frac{1}{K_{\\mathrm{myo}}}',
      vars: {
        dfar: { name: 'far point', q: 'length', unit: 'cm', tex: 'd_{\\mathrm{far}}' },
        Kmyo: { name: 'size of the myopic error', q: 'optpower', unit: 'D', value: 3, min: 0.1, max: 20, tex: 'K_{\\mathrm{myo}}' }
      },
      solveFor: 'dfar',
      stories: { dfar: 'A myopic eye has an error of {Kmyo}. How far away is the farthest object it sees sharply?', Kmyo: 'A person can just see sharply at {dfar} and no farther. What is the size of the myopic error?' }
    },
    {
      name: 'Spectacle lens for a myopic eye',
      expr: 'Fs = -1/(dfar - dv)', tex: 'F = -\\frac{1}{d_{\\mathrm{far}} - d_v}',
      vars: {
        Fs: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', signed: true, tex: 'F' },
        dfar: { name: 'far point, from the cornea', q: 'length', unit: 'cm', value: 33.3, min: 5, max: 400, tex: 'd_{\\mathrm{far}}' },
        dv: { name: 'distance of the lens in front of the cornea', q: 'length', unit: 'mm', value: 12, min: 0, max: 20, tex: 'd_v' }
      },
      solveFor: 'Fs',
      note: 'A thin lens whose focal point is at the far point. For a contact lens, dv = 0.',
      stories: { Fs: 'The far point of an eye is {dfar} from the cornea and the spectacle lens sits {dv} in front of it. What power puts the focus on the retina?' }
    }
  ],
  examples: [{
    title: 'Glasses and contact lenses',
    q: 'An eye has a far point 22.2 cm from the cornea. What lens power would a contact lens need, and what would a spectacle lens need at 12 mm?',
    steps: [
      { text: 'The contact lens sits at the cornea, so its focal length is the far point:', tex: 'F_c = -\\frac{1}{0.222} = -4.50\\ \\text{D}' },
      { text: 'The spectacle lens is 12 mm closer to the object, so the far point is 12 mm nearer to it:', tex: 'F_s = -\\frac{1}{0.222 - 0.012} = -4.76\\ \\text{D}' }
    ],
    a: '−4.50 D as a contact lens and about −4.75 D as a spectacle lens at 12 mm: the lens held farther from the eye must be stronger.'
  }],
  quiz: [
    { q: 'Where is the far point of an eye with 2 D of myopia?', choices: ['At infinity', '2 m', '50 cm', '20 cm'], a: 2, why: 'The far point is 1/K metres: 1/2 D = 0.5 m. Objects beyond it are blurred; nearer ones are sharp.' },
    { q: 'A person with −4 D of myopia holds a book at 25 cm. How much accommodation does the book ask for?', choices: ['4 D', '2 D', 'None: 25 cm is the far point', '8 D'], a: 2, why: 'The far point of a −4 D eye is 1/4 D = 25 cm. A book there is focused on the retina by a relaxed lens. An emmetropic eye would need 4 D for the same book.' },
    { q: 'Wearing a minus lens for years makes the eye grow longer.', a: false, why: 'A correction restores the focus; it does not drive the eye\'s growth. Myopia progresses as the child\'s eye lengthens, and the cause is studied but not settled.' },
    { q: 'An eye has a far point 20 cm from the cornea. What is the size of its myopia, in dioptres?', answer: 5, unit: 'D', why: 'K = 1/d = 1/0.2 m = 5 D, so the error is −5 D.' },
    { q: 'Why is a spectacle lens for a short-sighted eye stronger than the contact lens for the same eye?', choices: ['Glass bends light more than plastic', 'The spectacle lens is farther from the eye, so the far point is nearer to it', 'The contact lens is thinner', 'Contact lenses magnify'], a: 1, why: 'The lens must have its focal point at the far point; from a lens 12 mm in front of the cornea the far point is 12 mm closer, so a shorter focal length (more power) is needed.' }
  ],
  applications: [
    'Choosing the power of spectacles and contact lenses from the measured error, with the vertex-distance correction.',
    'Planning schools, screens and reading distances: a −3 D person sees a phone at 30 cm without effort.',
    'Following the growth of children\'s eyes by their axial length as well as by their refraction.',
    'Counting, in public health, how much sight loss a simple lens would remove.'
  ],
  history: 'The Greek word for short sight, *myops*, means "closing the eyes", from the squint. Concave lenses for short sight were being made in Italy by the early sixteenth century; the physics of why they work waited for Kepler\'s account of the retinal image in 1604.',
  sources: [
    'B. A. Holden et al., "Global prevalence of myopia and high myopia and temporal trends from 2000 through 2050", *Ophthalmology* 123 (2016).',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — refractive errors and the ocular components.',
    'World Health Organization, *World report on vision* (2019).'
  ],
  sim: { id: 're-eye-model', params: { rx: -3 } }
},

/* ================================================================ hyperopia */
{
  id: 'hyperopia', parent: 'refractive-errors', title: 'Hyperopia (long sight)', level: 1,
  short: 'In hyperopia the eye is too short for its power, so parallel light would focus behind the retina. A young eye hides this by accommodating; with age the hiding runs out, near work tires first and finally distance blurs.',
  keywords: ['hyperopia', 'hypermetropia', 'long sight', 'farsighted', 'far-sighted', 'plus lens', 'latent hyperopia', 'accommodation', 'convex lens', 'eye strain'],
  prereq: ['emmetropia-and-refractive-error', 'accommodation', 'myopia'],
  related: ['presbyopia', 'amblyopia-and-strabismus', 'glaucoma-and-the-visual-field', 'how-spectacle-lenses-correct-vision', 'vertex-distance-and-effective-power', 'physics:vision-correction'],
  body: `
A long-sighted eye is a camera whose film is too near the lens: the focus of a distant object lies **behind the retina**. Unlike a short-sighted eye, a long-sighted eye has no far point on the near side of infinity; an object at infinity is already out of focus, and the nearer the object the worse it gets. What changes the picture is the lens of the eye. By thickening itself, **accommodation** adds power and pulls the focus forward onto the retina, so a young long-sighted person can see the distance sharply by effort alone, and may not know of the error.

> [!note] This page explains how hyperopia works and how it is described. It cannot say what is true of any one person's eyes, and treatment is for an eye-care professional to decide.

### The supply and the demand of focusing
Seeing an object at distance $d$ with a hyperopic error $K$ asks for accommodation $A = K + 1/d$: the usual $1/d$ for near work, **plus the error**, which is spent on seeing at all. The supply is limited and falls with age (see [[presbyopia]]).

| Hyperopia | Needs at 40 cm | Average amplitude falls to this at age |
|---|---|---|
| +1 D | 3.5 D | 50 |
| +2 D | 4.5 D | 47 |
| +3 D | 5.5 D | 43 |
| +4 D | 6.5 D | 40 |
A rule of thumb says that using more than about half of the supply is tiring, so the trouble starts earlier: for +2 D, at about 32 on an average eye. The ages are from an empirical average and vary widely between people.

### What it feels like, and what hides it
Hyperopia that is covered by accommodation, **latent hyperopia**, may cause nothing, or a tired feeling, headaches and strain with near work. When the effort is no longer enough, near vision blurs first, because it asks for most, and later the distance too. Because the eye must turn inwards as it accommodates, strong hyperopia in a child can pull an eye inwards (see [[amblyopia-and-strabismus]]).

### Short eyes
A +2 D eye is 0.72 mm shorter than the matching length and a +6 D eye about 2 mm shorter, 22 mm in all. Newborns are usually hyperopic, on average by roughly +2 D, and the eye grows and the lens flattens towards emmetropia in the first years. Very short eyes have a shallow front chamber and are more liable to a closure of the drainage angle ([[glaucoma-and-the-visual-field]]).

### The lens that corrects it
A converging (plus) lens adds the power the eye lacks and moves the focus forward. Because a spectacle lens sits 12 mm from the cornea, the lens for a long-sighted eye is slightly weaker than the equivalent contact lens, the opposite of the short-sighted case: $F_s = K/(1 + d_v K)$.

> [!key] The hyperopic eye is too short for its power. Accommodation can hide the error at the price of effort, which runs out with age; a plus lens supplies the missing power.
`,
  ideas: [
    'A hyperopic eye focuses parallel light behind the retina and must accommodate to see even at a distance.',
    'The accommodation needed is the error plus 1/d: the error is paid before any near work is done.',
    'A young long-sighted eye can hide the error until age or fatigue exhausts the supply of focusing.',
    'Hyperopia is common in babies and usually lessens as the eye grows; a short adult eye has a shallow front chamber.',
    'A plus lens moves the focus forward; for the same eye, a spectacle lens is slightly weaker than a contact lens.'
  ],
  pitfalls: [
    'Long sight means seeing far well and near badly — That is the usual picture for an older person, but a young long-sighted person may see everything sharply by accommodating, at a cost in effort. What matters is how much of the supply is used.',
    'Hyperopia is the opposite of myopia, so it matters less — It is the same kind of mismatch the other way round. Large errors in a child, or in an eye with a very short length, deserve attention just as much.',
    'The eye strain of long sight comes from the eyes being weak — It comes from sustained accommodation and convergence, which are muscular and neural efforts; the eye is working harder than a normal eye would at the same task.',
    'The glasses should have the same power as a contact lens — A lens held 12 mm in front of the cornea has a slightly lower effective power for a long-sighted eye; the power quoted changes with the distance of the lens from the eye.'
  ],
  terms: [
    { term: 'Hyperopia', also: ['hypermetropia', 'long sight', 'far-sightedness'], def: 'A refractive error in which parallel light would come to a focus behind the retina of a relaxed eye. Its size is given in positive dioptres.' },
    { term: 'Latent hyperopia', def: 'The part of hyperopia that is hidden by accommodation: the eye sees clearly by constant focusing effort.' },
    { term: 'Plus lens', also: ['converging lens', 'convex lens', 'positive lens'], def: 'A lens thicker at the middle than at the edge, with a positive power, that focuses parallel light. It corrects hyperopia and presbyopia.' },
    { term: 'Accommodative demand', def: 'The amount of focusing the eye must do for an object: for an emmetropic eye 1/d dioptres at a distance of d metres, and for a long-sighted eye that plus the error.' }
  ],
  formulas: [
    {
      name: 'Accommodation needed by a hyperopic eye',
      expr: 'Aneed = Khyp + 1/d', tex: 'A = K_{\\mathrm{hyp}} + \\frac{1}{d}',
      vars: {
        Aneed: { name: 'accommodation needed', q: 'optpower', unit: 'D', tex: 'A' },
        Khyp: { name: 'size of the hyperopic error', q: 'optpower', unit: 'D', value: 2, min: 0, max: 8, tex: 'K_{\\mathrm{hyp}}' },
        d: { name: 'distance of the object', q: 'length', unit: 'cm', value: 40, min: 10, max: 600, tex: 'd' }
      },
      solveFor: 'Aneed',
      note: 'For a short-sighted eye, the error enters with a minus sign: A = 1/d − |K|, which can be zero or negative.',
      stories: { Aneed: 'An eye has {Khyp} of hyperopia and reads at {d}. How much accommodation does it use?', Khyp: 'An eye reads at {d} using {Aneed} of accommodation. How large is its hyperopic error?' }
    },
    {
      name: 'Spectacle lens for a hyperopic eye',
      expr: 'Fs = Fc/(1 + dv*Fc)', tex: 'F_s = \\frac{F_c}{1 + d_v\\,F_c}',
      vars: {
        Fs: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', tex: 'F_s' },
        Fc: { name: 'power of the contact lens that does the same', q: 'optpower', unit: 'D', value: 5, min: 0.25, max: 15, tex: 'F_c' },
        dv: { name: 'distance of the spectacle lens from the cornea', q: 'length', unit: 'mm', value: 12, min: 0, max: 20, tex: 'd_v' }
      },
      solveFor: 'Fs',
      stories: { Fs: 'A contact lens of {Fc} corrects a long-sighted eye. What power does a spectacle lens {dv} from the cornea need?' }
    }
  ],
  examples: [{
    title: 'Hidden at 20, found at 45',
    q: 'A person has +2 D of hyperopia and reads at 40 cm. How much accommodation does it take, and what share of the average supply at 20 and at 45 years is that?',
    steps: [
      { text: 'The demand is the error plus the reading demand:', tex: 'A = 2 + \\frac{1}{0.40} = 4.5\\ \\text{D}' },
      'The average amplitude is 12.5 D at 20 years and 5.0 D at 45 years (Hofstetter\'s formula).',
      { text: 'The share of the supply:', tex: '\\frac{4.5}{12.5} = 36\\ \\% \\qquad \\frac{4.5}{5.0} = 90\\ \\%' }
    ],
    a: '4.5 D: about a third of the supply at 20, nearly all of it at 45. The same eye is comfortable at one age and strained at the other.'
  }],
  quiz: [
    { q: 'Where would parallel light come to a focus in a relaxed hyperopic eye?', choices: ['In front of the retina', 'On the retina', 'Behind the retina', 'At the pupil'], a: 2, why: 'The eye is too short for its power, so the rays are still converging when they reach the retina; the focus would lie behind it.' },
    { q: 'A young adult with +3 D of hyperopia reads a book at 33 cm. How much accommodation is needed, in dioptres?', answer: 6, unit: 'D', why: 'A = K + 1/d = 3 + 1/0.33 ≈ 3 + 3 = 6 D. A young eye has this to spare; an older one does not.' },
    { q: 'A person who sees distant things clearly cannot be hyperopic.', a: false, why: 'Accommodation can pull the focus of a hyperopic eye forward onto the retina. The error is "latent": hidden, but it still costs effort.' },
    { q: 'Why does long sight tend to give trouble at near before it does at a distance?', choices: ['The retina is thicker at near', 'Near objects need more accommodation, and the error is paid on top', 'The cornea flattens at near', 'The pupil enlarges at near'], a: 1, why: 'The demand is K + 1/d: at infinity the eye pays only K, at 40 cm it pays K + 2.5 D, so the supply runs out first at near.' },
    { q: 'For the same eye, for which kind of error is the spectacle lens stronger than the contact lens?', choices: ['Short sight only', 'Long sight only', 'Both', 'Neither'], a: 0, why: 'With short sight the lens moves away from the eye, so the far point is nearer to it and a stronger minus lens is needed. With long sight the lens is slightly weaker than the equivalent contact lens.' }
  ],
  applications: [
    'The routine eye examination of children, where a cycloplegic drop relaxes accommodation so the whole of the hyperopia can be measured.',
    'Explaining why reading glasses are needed earlier by long-sighted people.',
    'Estimating whether an eye is short enough to need an attentive look at the drainage angle.',
    'Laser and implant surgery planning, where the eye\'s length and corneal power are measured first.'
  ],
  history: 'Donders (1864) recognized that hyperopia is a mismatch like myopia, and that the young hide it by accommodation; he named the hidden part latent. Plus lenses were the first spectacles, made from the late thirteenth century for reading.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — refractive errors and accommodation.',
    'Franciscus C. Donders, *On the Anomalies of Accommodation and Refraction of the Eye* (1864).',
    'World Health Organization, *World report on vision* (2019).'
  ],
  sim: { id: 're-eye-model', params: { rx: 2.5, age: 20, d: 0.4, acc: 40 } }
},

/* ================================================================ astigmatism */
{
  id: 'astigmatism-of-the-eye', parent: 'refractive-errors', title: 'Astigmatism of the eye', level: 2,
  short: 'An astigmatic eye is more powerful in one meridian than in the one at right angles, usually because the cornea is shaped like the back of a spoon. A point is imaged as two focal lines with a blur between them, and lines running in one direction look sharper than in the other.',
  keywords: ['astigmatism', 'cylinder', 'axis', 'meridian', 'toric', 'Sturm', 'interval of Sturm', 'circle of least confusion', 'with the rule', 'against the rule', 'regular astigmatism', 'irregular astigmatism', 'spherical equivalent'],
  prereq: ['emmetropia-and-refractive-error', 'myopia', 'hyperopia'],
  related: ['astigmatism-of-lenses', 'cylinder-axis-and-transposition', 'reading-a-prescription', 'keratometry-and-corneal-topography', 'cross-cylinder-and-duochrome', 'keratoconus-and-corneal-shape', 'aberrations-of-the-eye'],
  body: `
Think of a spoon rather than a ball. The cornea of most eyes is a little steeper in one direction than in the direction at right angles, like the back of a spoon or a rugby ball lying on its side. Light in the steep **meridian** is bent more and focuses sooner; light in the flat meridian focuses later. The eye has not one focus but two **focal lines**, at right angles to each other, with a blur between them. This is **astigmatism** of the eye.

> [!note] This page explains how astigmatism works and how it is described. It is not a way to find out whether you have it; only an eye examination can.

### Two lines, not one point
A narrow pencil of rays from a point makes a **Sturm's conoid**: first a short line (the focus of the steep meridian), then an oval, then a round blur of smallest size, the **circle of least confusion**, then an oval turned the other way, and last a line at right angles (the flat meridian's focus). The distance between the lines is the **interval of Sturm**. In the model below each dioptre of difference separates the lines by about 0.37 mm; 2 D gives 0.74 mm. The circle of least confusion lies at the dioptric midpoint, the **spherical equivalent** $S + C/2$, and for a pupil of $p$ mm its diameter is $C\\,p/2$ milliradians: 4 mrad, or 14 arc-minutes, for 2 D and 4 mm.

### Sphere, cylinder and axis
The power along the meridian at angle $\\theta$ is
$$P(\\theta) = S + C\\sin^2(\\theta - \\alpha)$$
with sphere $S$, cylinder $C$ and axis $\\alpha$ (the meridian that has no cylinder power, in the minus-cylinder form; the same eye can be written with the other sign, see [[cylinder-axis-and-transposition]]). A keratometer reading of 43.0 D and 44.5 D in two meridians means 1.5 D of corneal cylinder. Corneal astigmatism is usually the larger part; the lens adds a little of its own.

### With the rule and against it
| Steeper meridian | Name | Where it is found |
|---|---|---|
| near vertical (90° ± 30°) | with the rule | commonest in the young |
| near horizontal (0° ± 30°) | against the rule | commoner with age |
| in between | oblique | less common |
Vertical lines blur when the vertical meridian focuses short of the retina. On a **spoke chart**, spokes in one direction look dark and sharp and those across it grey and smeared.

### Regular and irregular
In **regular** astigmatism the two principal meridians are at right angles and a cylindrical lens, which has power in one meridian only, restores one focus. In **irregular** astigmatism the surface is not toric, as after scarring or in keratoconus ([[keratoconus-and-corneal-shape]]); no simple lens corrects it and rigid contact lenses are used. The word also names an aberration of lenses ([[astigmatism-of-lenses]]): the cause differs, since an off-axis point makes two lines even in a perfect lens, but the picture of two focal lines is the same.

Most people have a little (a quarter of a dioptre or less); 1 D or more is found in roughly one person in five to one in three, depending on age and population.

> [!key] Astigmatism is a difference of power between meridians: two focal lines separated by the interval of Sturm, a least blur between them. It is written as sphere, cylinder and axis.
`,
  ideas: [
    'An astigmatic eye has two principal meridians, 90° apart, with different powers; light focuses at two lines.',
    'The interval of Sturm is about 0.37 mm per dioptre of cylinder; the round blur between the lines is at the spherical equivalent.',
    'The power along a meridian is S + C sin²(θ − α): sphere, cylinder, axis.',
    'With the rule means a steeper vertical meridian; against the rule, a steeper horizontal one.',
    'Regular astigmatism is corrected by a cylinder; irregular astigmatism needs more than a simple lens.'
  ],
  pitfalls: [
    'Astigmatism blurs everything equally — The blur depends on direction. Strokes along the sharp direction look crisp and those across it are smeared, which is why an astigmatic dial shows some spokes darker than others.',
    'Astigmatism means the eye is diseased or misshapen — A little corneal cylinder is normal. It becomes a visual problem only above a fraction of a dioptre, and the commonest forms are simple toric shapes.',
    'The circle of least confusion is the sharp image — It is the least bad blur, the best compromise for the pencil of rays, not a focus. A cylinder lens is needed to turn two focal lines into one point.',
    'The astigmatism of a lens and of the eye are the same thing — Both give two focal lines, but a lens shows it only off the axis because of its shape, while the eye shows it on the axis because its surfaces are not round.'
  ],
  terms: [
    { term: 'Astigmatism', def: 'A refractive error in which the power of the eye differs from one meridian to another, so that light comes to two focal lines instead of one point.' },
    { term: 'Meridian', def: 'A plane through the optical axis of the eye, named by its angle from the horizontal, 0° to 180°.' },
    { term: 'Cylinder and axis', also: ['cyl', 'axis'], def: 'The two numbers that describe astigmatism: the difference in power between the principal meridians, and the angle of the meridian that has no cylinder power.' },
    { term: 'Interval of Sturm', def: 'The distance along the axis between the two focal lines of an astigmatic pencil of light.' },
    { term: 'Circle of least confusion', def: 'The round patch of smallest size in an astigmatic pencil, halfway between the two focal lines in dioptres.' },
    { term: 'Spherical equivalent', also: ['SE', 'mean sphere'], def: 'The sphere plus half the cylinder: the single spherical power that puts the circle of least confusion on the retina.' },
    { term: 'With the rule', also: ['against the rule', 'oblique'], def: 'With the rule: the steeper corneal meridian is near vertical. Against the rule: near horizontal. Oblique: neither.' }
  ],
  formulas: [
    {
      name: 'Power along a meridian',
      expr: 'P = S + C*sin(th - ax)^2', tex: 'P(\\theta) = S + C\\sin^2(\\theta - \\alpha)',
      vars: {
        P: { name: 'power along the meridian', q: 'optpower', unit: 'D', signed: true, tex: 'P' },
        S: { name: 'sphere', q: 'optpower', unit: 'D', value: -1, signed: true, tex: 'S' },
        C: { name: 'cylinder (minus form)', q: 'optpower', unit: 'D', value: -2, signed: true, tex: 'C' },
        th: { name: 'meridian looked along', q: 'angle', unit: '°', value: 0, min: 0, max: 180, tex: '\\theta' },
        ax: { name: 'axis of the cylinder', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\alpha' }
      },
      solveFor: 'P',
      note: 'Minus-cylinder form: the axis is the meridian with no cylinder power, and the full cylinder acts 90° from it.',
      stories: { P: 'A prescription is sphere {S}, cylinder {C}, axis {ax}. What is the power of the eye along the {th} meridian?' }
    },
    {
      name: 'Spherical equivalent',
      expr: 'SE = S + C/2', tex: '\\mathrm{SE} = S + \\frac{C}{2}',
      vars: {
        SE: { name: 'spherical equivalent', q: 'optpower', unit: 'D', signed: true, tex: '\\mathrm{SE}' },
        S: { name: 'sphere', q: 'optpower', unit: 'D', value: -1, signed: true, tex: 'S' },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -2, signed: true, tex: 'C' }
      },
      solveFor: 'SE',
      stories: { SE: 'A prescription is sphere {S} with cylinder {C}. What is its spherical equivalent?' }
    },
    {
      name: 'Circle of least confusion',
      expr: 'b = C*p/2', tex: 'b = \\frac{C\\,p}{2}',
      vars: {
        b: { name: 'diameter of the circle of least confusion, as an angle', q: false, unit: 'mrad', tex: 'b' },
        C: { name: 'size of the cylinder', q: false, unit: 'D', value: 2, min: 0, max: 6, tex: 'C' },
        p: { name: 'pupil diameter', q: false, unit: 'mm', value: 4, min: 1, max: 8, tex: 'p' }
      },
      solveFor: 'b',
      note: 'A geometrical estimate: half the blur of a spherical error as large as the whole cylinder.',
      stories: { b: 'An eye has {C} of astigmatism and a pupil {p} across. How wide is the least blur?' }
    }
  ],
  examples: [{
    title: 'Reading a prescription as two powers',
    q: 'A prescription reads sphere +1.00 D, cylinder −2.00 D, axis 90°. What is the power of the eye along the horizontal and the vertical meridians, and what kind of astigmatism is it?',
    steps: [
      { text: 'Along the horizontal (0°), 90° from the axis, the whole cylinder acts:', tex: 'P(0^\\circ) = +1 - 2\\sin^2(0^\\circ - 90^\\circ) = -1\\ \\text{D}' },
      { text: 'Along the vertical (90°), the axis itself, there is no cylinder power:', tex: 'P(90^\\circ) = +1\\ \\text{D}' },
      'The spherical equivalent is +1 − 1 = 0 D. One meridian is long-sighted by 1 D and the other short-sighted by 1 D.'
    ],
    a: '−1 D horizontally and +1 D vertically: a mixed astigmatism, with the circle of least confusion on the retina when the eye is unaided.'
  }],
  quiz: [
    { q: 'What does an astigmatic eye do to a point of light?', choices: ['Forms one sharp point behind the retina', 'Forms two focal lines at right angles, with a blur between them', 'Spreads it evenly in every direction', 'Forms a ring'], a: 1, why: 'The two principal meridians have different powers and so focus at different distances: first one line, then the other, at right angles. Between them is the circle of least confusion.' },
    { q: 'A person has an astigmatism of 2.0 D. At the circle of least confusion, the eye is, on average, out of focus by about 1 D.', a: true, why: 'The circle of least confusion lies at the dioptric midpoint of the two focal lines, 1 D from each. This is the spherical equivalent, S + C/2.' },
    { q: 'A prescription reads sphere −1.00, cylinder −2.00, axis 90°. What is the power of the eye along the 0° meridian, in dioptres?', answer: -3, unit: 'D', why: 'At 0° the whole cylinder acts: −1 + (−2) sin²(0° − 90°) = −1 − 2 = −3 D.' },
    { q: 'The steeper meridian of a cornea is vertical. What is it called?', choices: ['Against the rule', 'With the rule', 'Oblique', 'Irregular'], a: 1, why: 'With the rule means that the steeper meridian is near vertical, the common form in young people. Against the rule is a steeper horizontal meridian.' },
    { q: 'Why can a spectacle lens with a cylinder not correct irregular astigmatism?', choices: ['Cylinders are too weak', 'The surface is not toric, so no single cylinder and axis describe its errors', 'Irregular astigmatism is only in the lens', 'The axis cannot be measured'], a: 1, why: 'A cylinder lens has power in one meridian only. An irregular surface has local steep and flat areas that no sphere-and-cylinder combination matches.' }
  ],
  applications: [
    'Spectacles and contact lenses with a cylinder, and toric lenses implanted at cataract surgery to correct corneal astigmatism.',
    'The astigmatic dial and the cross-cylinder test of the eye examination ([[cross-cylinder-and-duochrome]]).',
    'Keratometry and corneal topography, which measure the steep and flat meridians directly ([[keratometry-and-corneal-topography]]).',
    'Understanding why letters and lines on a screen can look blurred in one direction only.'
  ],
  history: 'Thomas Young found in 1801 that his own eye focused differently in different meridians; the name means "without a point" in Greek. George Airy had a cylindrical lens made for his own eye in 1825, the first correction of astigmatism. The conoid of rays is named after the mathematician Charles Sturm, who described it in 1838.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — corneal and ocular astigmatism.',
    'E. Hecht, *Optics* — astigmatism, the focal lines and the circle of least confusion.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — sphere, cylinder and axis.'
  ],
  sim: 're-astig'
},

/* ================================================================ presbyopia */
{
  id: 'presbyopia', parent: 'refractive-errors', title: 'Presbyopia', level: 1,
  short: 'With age the lens stiffens and the amplitude of accommodation falls from about 15 D in a child to nearly nothing near 60. The near point recedes past a comfortable reading distance, and a plus lens for near work makes up the difference.',
  keywords: ['presbyopia', 'near point', 'amplitude of accommodation', 'reading glasses', 'reading addition', 'bifocal', 'Hofstetter', 'accommodation', 'ageing eye', 'working distance'],
  prereq: ['accommodation', 'emmetropia-and-refractive-error', 'hyperopia'],
  related: ['bifocals-and-trifocals', 'progressive-lenses', 'occupational-and-computer-lenses', 'myopia', 'contact-lenses', 'intraocular-lenses-and-refractive-surgery', 'physics:vision-correction'],
  body: `
Hold a book at arm's length and bring it slowly towards your face. The print stays sharp until, at the **near point**, it begins to blur. In a child that point is some 7 cm from the eye; at 45 years it has receded to about 20 cm; at 55, to half a metre, and the arms become too short. This is **presbyopia**, from the Greek for "old eye". It is not a disease and not an error a person is born with: it is what happens to the focusing of every eye with time.

> [!note] This page explains how focusing changes with age and what a reading lens does. It cannot say what is true of any one person's eyes; an eye examination measures that.

### The amplitude falls steadily
The lens grows stiffer and the muscle that squeezes it can no longer round it up. The **amplitude of accommodation**, the number of dioptres of extra power the eye can add, falls with age. Hofstetter's formulas, fitted to measurements on many people, give $15 - 0.25\\,\\text{age}$ for the lowest eyes, $18.5 - 0.3\\,\\text{age}$ on average and $25 - 0.4\\,\\text{age}$ for the highest. Individuals scatter around them.

| Age | Average amplitude | Near point, emmetropic eye | A typical reading addition |
|---|---|---|---|
| 10 | 15.5 D | 6.5 cm | none |
| 40 | 6.5 D | 15 cm | +0.75 D |
| 45 | 5.0 D | 20 cm | +1.25 D |
| 50 | 3.5 D | 29 cm | +1.75 D |
| 55 | 2.0 D | 50 cm | +2.25 D |
| 60 | 0.5 D | 2 m | +2.50 D |
The additions are typical table values and vary with the person and the working distance; the formula floors at zero, while real eyes keep a little apparent focusing from their depth of focus.

### Why reading goes first, in the forties
Reading at 40 cm asks for 2.5 D. An eye cannot hold its whole amplitude for long; as a rule of thumb it is comfortable using about half. So reading is comfortable only while the amplitude is at least about 5 D, which on average is around 45. A long-sighted person starts earlier ([[hyperopia]]); a short-sighted one later, because the far point is already close ([[myopia]]).

### The reading addition
A plus lens in front of the eye supplies the missing power: $\\text{Add} \\approx 1/d - f\\,A$, the demand at the working distance $d$ less the part $fA$ of the amplitude the eye can comfortably use. It moves the zone of sharp sight towards the eye, and the far point comes in with it: a +2 D addition leaves anything beyond half a metre blurred. That is why reading glasses are taken off to look up, and why bifocals and progressive lenses put the extra power in the lower part of the lens ([[bifocals-and-trifocals]], [[progressive-lenses]]).

### How common
A review published in 2018 estimated about 1.8 billion people with presbyopia in 2015, of whom some 826 million had near vision impairment from presbyopia that was not corrected.

> [!key] Accommodation falls by about a dioptre every three years, from 15 D in childhood to almost none at 60. A reading lens replaces what has gone, at the price of a nearer far point.
`,
  ideas: [
    'The amplitude of accommodation falls steadily with age, from about 15 D in a child to nearly zero by 60.',
    'Reading at 40 cm asks for 2.5 D; an eye is comfortable using about half its amplitude, so the trouble starts around 45.',
    'The near point recedes from about 7 cm in a child to 20 cm at 45 and 50 cm at 55.',
    'A plus addition moves the zone of sharp sight towards the eye, and shortens the far point.',
    'Presbyopia is universal, not a disease; its onset depends on the refractive error and the work distance.'
  ],
  pitfalls: [
    'Reading glasses weaken the eyes, so waiting is better — A lens does not change how fast the lens of the eye stiffens. Without it the eye works at the edge of its range and the print is blurred; the optics are the same either way.',
    'Presbyopia is a kind of long sight — Long sight is a mismatch of power and length from birth. Presbyopia is the loss of focusing with age, and an eye of any refractive state gets it; a long-sighted eye merely feels it sooner.',
    'A person who is short-sighted never needs reading help — A short-sighted eye loses accommodation too, but the near point stays close, so reading unaided lasts longer; when a distance correction is worn, the same loss shows up.',
    'The same addition suits everyone of an age — It depends on the working distance and on how much of the amplitude is kept in reserve; tables give only typical values.'
  ],
  terms: [
    { term: 'Presbyopia', def: 'The age-related loss of the eye\'s ability to focus on near objects, as the amplitude of accommodation falls.' },
    { term: 'Amplitude of accommodation', also: ['AA'], def: 'The largest number of dioptres of power the eye can add by accommodating, equal to the difference of vergence between the far point and the near point.' },
    { term: 'Near point', also: ['punctum proximum'], def: 'The nearest distance at which an eye can see sharply with maximum accommodation. For an emmetropic eye it is 1/A metres.' },
    { term: 'Reading addition', also: ['add', 'near add'], def: 'The extra plus power, in dioptres, added to the distance prescription for near work.' },
    { term: 'Working distance', def: 'The distance from the eye to the task, such as the page or the screen. It sets the accommodative demand: 1/d dioptres.' },
    { term: 'Accommodative reserve', def: 'The part of the amplitude left unused at a given task. A rule of thumb asks for about half to be in reserve.' }
  ],
  formulas: [
    {
      name: 'Average amplitude of accommodation (Hofstetter)',
      expr: 'A = 18.5 - 0.3*age', tex: 'A = 18.5 - 0.3\\,\\mathrm{age}',
      vars: {
        A: { name: 'average amplitude', q: false, unit: 'D', min: 0, max: 20 },
        age: { name: 'age', q: false, unit: 'years', value: 45, min: 10, max: 60 }
      },
      solveFor: 'A',
      note: 'An empirical fit that holds between about 10 and 60 years; individuals scatter widely around it.',
      stories: { A: 'What is the average amplitude of accommodation at {age}?', age: 'At what age does the average amplitude of accommodation fall to {A}?' }
    },
    {
      name: 'Near point of an emmetropic eye',
      expr: 'dnear = 1/A', tex: 'd_{\\mathrm{near}} = \\frac{1}{A}',
      vars: {
        dnear: { name: 'near point', q: 'length', unit: 'cm', tex: 'd_{\\mathrm{near}}' },
        A: { name: 'amplitude of accommodation', q: 'optpower', unit: 'D', value: 5, min: 0.25, max: 20 }
      },
      solveFor: 'dnear',
      stories: { dnear: 'An emmetropic eye can accommodate by {A}. How near can it focus?' }
    },
    {
      name: 'Reading addition by the reserve rule',
      expr: 'Add = 1/d - f*A', tex: '\\mathrm{Add} = \\frac{1}{d} - f\\,A',
      vars: {
        Add: { name: 'addition', q: 'optpower', unit: 'D', signed: true, tex: '\\mathrm{Add}' },
        d: { name: 'working distance', q: 'length', unit: 'cm', value: 40, min: 15, max: 100 },
        f: { name: 'fraction of the amplitude used comfortably', q: false, unit: '', value: 0.5, min: 0.3, max: 1 },
        A: { name: 'amplitude of accommodation', q: 'optpower', unit: 'D', value: 2, min: 0, max: 15 }
      },
      solveFor: 'Add',
      note: 'The arithmetic behind the idea: it gives the size of an addition, not a prescription. Rules differ in the fraction kept in reserve.',
      stories: { Add: 'A person reads at {d} and has an amplitude of {A}. Using a fraction {f} of it, what addition makes up the rest?' }
    }
  ],
  examples: [{
    title: 'A reading lens and its other side',
    q: 'A 55-year-old emmetropic person with the average amplitude (2.0 D) puts on +2.00 D reading glasses. Between what distances is vision sharp, using the full amplitude?',
    steps: [
      { text: 'With the lens the eye needs 2 D less than the object\'s own demand. The nearest sharp distance asks for the whole amplitude plus the lens power:', tex: 'd_{\\mathrm{near}} = \\frac{1}{2.0 + 2.0} = 25\\ \\text{cm}' },
      { text: 'A relaxed eye now sees sharply an object whose own vergence the lens cancels:', tex: 'd_{\\mathrm{far}} = \\frac{1}{2.0} = 50\\ \\text{cm}' }
    ],
    a: 'From 25 cm to 50 cm: a book is sharp, a face across the table is not. That is the price of a single-power reading lens.'
  }],
  quiz: [
    { q: 'An emmetropic eye has 4 D of accommodation left. How near is its near point, in centimetres?', answer: 25, unit: 'cm', why: 'The near point is the reciprocal of the amplitude: 1/4 D = 0.25 m.' },
    { q: 'Why does trouble with reading usually begin in the mid-forties?', choices: ['The cornea flattens', 'The average amplitude has fallen to about 5 D, so reading at 40 cm uses about half of it', 'The retina thins', 'The pupil gets too large'], a: 1, why: 'Reading at 40 cm asks 2.5 D. When the amplitude is about 5 D, that is half of it, the point at which an eye begins to tire.' },
    { q: 'A person with −2 D of myopia, with no correction, will find reading at 40 cm easy for longer than an emmetropic person.', a: true, why: 'The far point of a −2 D eye is already 50 cm, so a book at 40 cm asks only 0.5 D of accommodation and stays easy as the amplitude falls.' },
    { q: 'Reading at 40 cm asks for how many dioptres of accommodation, for an emmetropic eye?', answer: 2.5, unit: 'D', why: 'The demand at distance d is 1/d: 1/0.4 m = 2.5 D.' },
    { q: 'A +2 D reading lens makes distant objects blurred beyond about what distance?', choices: ['25 cm', '50 cm', '2 m', 'It does not blur the distance'], a: 1, why: 'With the lens, the far point of an emmetropic relaxed eye moves to its focal length: 1/2 D = 50 cm.' }
  ],
  applications: [
    'Choosing the working distance of a reading lens: a computer screen at 70 cm needs a smaller addition than a book at 35 cm.',
    'Bifocal, trifocal and progressive spectacle lenses that put the addition where the eye looks down for near.',
    'Monovision contact lenses and multifocal contact and implanted lenses, which trade sharpness at some distances for range.',
    'Setting up reading light, print size and screen distance for older readers.'
  ],
  history: 'The loss of near focus with age was measured by Donders in 1864, who tabulated the near point at each age. Helmholtz explained accommodation in 1855 as the lens rounding itself when the ring muscle relaxes the tension on it. The age–amplitude formulas used here are those fitted by H. W. Hofstetter in the 1940s.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — accommodation and presbyopia.',
    'T. R. Fricke et al., "Global prevalence of presbyopia and vision impairment from uncorrected presbyopia", *Ophthalmology* 125 (2018).',
    'Franciscus C. Donders, *On the Anomalies of Accommodation and Refraction of the Eye* (1864).'
  ],
  sim: { id: 're-presbyopia', params: { age: 45, d: 0.4 } }
},

/* ================================================================ colour-vision deficiency */
{
  id: 'colour-vision-deficiency', parent: 'refractive-errors', title: 'Colour-vision deficiency', level: 1,
  short: 'In colour-vision deficiency one of the three kinds of cone is missing or its pigment is shifted. The red–green forms, protan and deutan, affect about 8 % of men and 0.5 % of women of northern European descent; the blue–yellow form is rare. Designs that rely on colour alone fail for them.',
  keywords: ['colour blindness', 'color blindness', 'colour-vision deficiency', 'protan', 'deutan', 'tritan', 'protanopia', 'deuteranopia', 'tritanopia', 'anomalous trichromacy', 'achromatopsia', 'Ishihara', 'confusion line', 'colour-safe palette', 'Daltonism'],
  prereq: ['trichromatic-colour-vision', 'the-retina-rods-and-cones', 'opponent-colours'],
  related: ['colour-vision-tests', 'metamerism', 'the-chromaticity-diagram', 'colour-spaces-and-gamuts', 'colour-difference-and-tolerance', 'physics:color-vision'],
  body: `
Most people have three kinds of cone: one most sensitive in the short wavelengths (S, peak near 420 nm), one in the middle (M, 534 nm), one in the long (L, 564 nm). The brain builds colour from the *differences* between their signals. In **colour-vision deficiency** one kind is missing or its pigment is shifted, and a dimension of colour is lost or narrowed.

> [!note] This page explains how colour vision can differ and how designs can allow for it. It does not find out what any one person sees; colour-vision tests do that ([[colour-vision-tests]]).

### Three kinds, and the degrees
| Kind | Cone involved | Names | How common |
|---|---|---|---|
| Protan | L (long) | protanomaly, protanopia | about 2 % of men |
| Deutan | M (medium) | deuteranomaly, deuteranopia | about 6 % of men |
| Tritan | S (short) | tritanomaly, tritanopia | about 1 in 10 000 people |
| Achromatopsia | no working cones | rod monochromacy | about 1 in 30 000 people |
In **anomalous trichromacy** all three pigments are present but one is shifted so that the L and M peaks, normally 30 nm apart, lie closer together; the colour difference they signal shrinks. In **dichromacy** one cone is absent and colour is spanned by two. Both come in degrees of severity.

### Why mostly red–green, and mostly men
The genes for the L and M pigments lie on the X chromosome. A man has one X, so one fault shows; a woman has two and shows it only if both carry it. If a fraction $q$ of X chromosomes carries the fault, men are affected at $q$ and women at about $q^2$: for 8 % in men, 0.64 % in women, near the observed 0.5 %. The rates vary with ancestry. Tritan and achromatopsia are not X-linked.

### What is confused
Colours that differ only along the red–green axis look alike: a red and a green, an orange and a brown, a pink and a grey. Differences in lightness remain, and so do blue and yellow; a person who cannot tell a red light from a green one still sees which lamp is lit. The simulation draws a transit map and a plate of dots with the colour-vision model of Machado and colleagues; the plate's shape is made of dots of the same lightness as the ground that differ in hue only.

### Designing for everyone
- Never carry meaning in colour alone: add a letter, a shape, a position or a pattern.
- Differ in lightness as well as in hue; a greyscale copy shows whether you do.
- Prefer a set chosen for the purpose, such as the one published by Okabe and Ito. In the simulation two lines at a colour difference $\\Delta E$ of 10 or less are hard to tell apart under deutan; the usual six-colour palette falls to 12, the colour-safe set keeps its closest pair at about 18.

A change in colour vision that begins in an adult, in one eye or with other symptoms, can come from disease, drugs or a clouding lens, and is a reason for an eye examination.

> [!key] A colour-vision deficiency is a lost or narrowed colour difference, usually red–green, usually inherited, and far commoner in men. Use colour as a second cue, never the only one.
`,
  ideas: [
    'There are three cone types; a deficiency is a missing or shifted pigment, protan (L), deutan (M) or tritan (S).',
    'Anomalous trichromats have shifted pigments; dichromats lack one; both come in degrees.',
    'The red–green forms are X-linked: about 8 % of men and 0.5 % of women of northern European descent.',
    'People with a deficiency confuse colours that differ only in red–green; lightness and blue–yellow differences remain.',
    'Colour must never be the only cue: add shape, label, position or lightness.'
  ],
  pitfalls: [
    'People with colour-vision deficiency see only grey — Total loss of colour is achromatopsia, about 1 in 30 000. Almost all people with a deficiency see many colours and confuse only some of them.',
    'A deficiency is a defect of the eye\'s optics — The lens and cornea are normal. The difference lies in the photopigments of the cones and in the signals the brain compares.',
    'Red–green deficiency means confusing red with green and nothing else — It confuses a whole family of colours along a line in colour space: browns with greens, oranges with olives, pinks with greys, purples with blues.',
    'A simulation shows exactly what a person sees — It shows an approximation on one screen. People with the same deficiency differ in degree and in how they use cues; the picture only suggests the loss of colour difference.'
  ],
  terms: [
    { term: 'Colour-vision deficiency', also: ['colour blindness', 'CVD', 'Daltonism'], def: 'A reduced ability to tell colours apart because one of the three cone types is missing or altered.' },
    { term: 'Protan', also: ['protanomaly', 'protanopia'], def: 'A red–green deficiency in which the long-wave (L) cones are missing (protanopia) or shifted (protanomaly); reds look darker.' },
    { term: 'Deutan', also: ['deuteranomaly', 'deuteranopia'], def: 'A red–green deficiency of the medium-wave (M) cones, missing (deuteranopia) or shifted (deuteranomaly); the commonest kind.' },
    { term: 'Tritan', also: ['tritanomaly', 'tritanopia'], def: 'A rare blue–yellow deficiency of the short-wave (S) cones.' },
    { term: 'Anomalous trichromacy', def: 'Colour vision with three cone types of which one has a shifted pigment, so that colour differences are reduced rather than lost.' },
    { term: 'Dichromacy', def: 'Colour vision based on only two cone types, because one is absent: protanopia, deuteranopia or tritanopia.' },
    { term: 'Achromatopsia', also: ['rod monochromacy'], def: 'The absence of working cones, so that only rods are used: no colour, poor acuity and dazzle in bright light.' }
  ],
  formulas: [
    {
      name: 'Frequency in women of an X-linked fault',
      expr: 'pw = pm^2', tex: 'p_{w} = p_{m}^{\\,2}',
      vars: {
        pw: { name: 'share of women affected', q: 'ratio', unit: '%', tex: 'p_w' },
        pm: { name: 'share of men affected', q: 'ratio', unit: '%', value: 8, min: 0, max: 50, tex: 'p_m' }
      },
      solveFor: 'pw',
      note: 'For one gene on the X chromosome in a large mixed population: a good first estimate, near the observed 0.5 % for 8 %.',
      stories: { pw: 'A fault on the X chromosome affects {pm} of men. What share of women is expected to be affected?' }
    },
    {
      name: 'Colour difference in CIELAB',
      expr: 'dE = sqrt(dL^2 + dA^2 + dB^2)', tex: '\\Delta E = \\sqrt{\\Delta L^2 + \\Delta a^2 + \\Delta b^2}',
      vars: {
        dE: { name: 'colour difference', tex: '\\Delta E' },
        dL: { name: 'difference in lightness', signed: true, value: 3, tex: '\\Delta L' },
        dA: { name: 'difference along red–green', signed: true, value: -5, tex: '\\Delta a' },
        dB: { name: 'difference along yellow–blue', signed: true, value: 4, tex: '\\Delta b' }
      },
      solveFor: 'dE',
      note: 'The 1976 CIE form. A difference of about 2 is just noticeable; 10 or less can be hard to tell apart in small areas or for a person with a deficiency.',
      stories: { dE: 'Two colours differ by {dL} in lightness, {dA} in red–green and {dB} in yellow–blue. What is their colour difference?' }
    }
  ],
  examples: [{
    title: 'Two lines on a map',
    q: 'Two metro lines differ in CIELAB by ΔL = 3, Δa = −5 and Δb = 4 as seen by a person with a deutan deficiency. Are they easy to tell apart?',
    steps: [
      { text: 'Combine the three differences:', tex: '\\Delta E = \\sqrt{3^2 + 5^2 + 4^2} = \\sqrt{50} \\approx 7.1' },
      'A difference below about 10 is hard to see in thin lines; the lines need a second cue.'
    ],
    a: 'ΔE ≈ 7, close to the limit for fine lines: give them different shapes, patterns or labels.'
  }],
  quiz: [
    { q: 'Which cone type is affected in a deutan deficiency?', choices: ['Long-wave (L)', 'Medium-wave (M)', 'Short-wave (S)', 'The rods'], a: 1, why: 'Deutan means a fault of the medium-wave cones; protan is the long-wave cones and tritan the short-wave.' },
    { q: 'Why are the red–green deficiencies much commoner in men?', choices: ['Men have fewer cones', 'The L and M pigment genes are on the X chromosome, and men have only one', 'Women\'s eyes repair them', 'Hormones switch them off in women'], a: 1, why: 'A man has one X chromosome, so a fault in it shows. A woman has two and is affected only if both carry the fault, which is roughly the square of the male rate.' },
    { q: 'About 8 % of men are affected by a red–green deficiency. What share of women does the X-linked square law predict, in per cent?', answer: 0.64, unit: '%', why: 'The share in women is the square of the share in men: 0.08² = 0.0064 = 0.64 %, close to the observed 0.5 %.' },
    { q: 'A person with protanopia sees the world in shades of grey.', a: false, why: 'Protanopia is the absence of the long-wave cones. The other two kinds remain, so blues, yellows and many other colours are seen, though reds and greens are confused.' },
    { q: 'How should a chart distinguish four lines if some viewers have a red–green deficiency?', choices: ['Use four shades of red', 'Use colour plus different line styles or labels, with colours chosen to differ in lightness', 'Use a darker red and a lighter green', 'Use only grey'], a: 1, why: 'A second cue survives the loss of a colour dimension, and differences in lightness are kept by almost all deficiencies.' }
  ],
  applications: [
    'Signs, signal lamps and instrument displays, where position and shape back up colour.',
    'Maps, charts and dashboards, drawn in palettes chosen to keep their differences under simulation.',
    'Colour codes such as resistor bands, where a second cue (a printed value) removes the risk of an error.',
    'Colour-vision testing for occupations in which colour signals matter.'
  ],
  history: 'John Dalton described his own colour-vision deficiency in 1798 and his name survives as "daltonism". The Young–Helmholtz theory of three receptors (1850s) gave the explanation; Shinobu Ishihara published his dot plates in 1917, and the colour match of the anomaloscope, devised by Nagel in the early 1900s, separates the kinds.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* — colour matching and the defects of colour vision.',
    'J. Birch, *Diagnosis of Defective Colour Vision* (Oxford University Press, 1993).',
    'G. M. Machado, M. M. Oliveira and L. A. F. Fernandes, "A physiologically-based model for simulation of color vision deficiency", *IEEE Transactions on Visualization and Computer Graphics* 15 (2009).'
  ],
  sim: { id: 're-cvd', params: { type: 'deutan', scene: 'map' } }
},

/* ================================================================ amblyopia and strabismus */
{
  id: 'amblyopia-and-strabismus', parent: 'refractive-errors', title: 'Amblyopia and strabismus', level: 2,
  short: 'Sight is built after birth: acuity climbs from about 1 cycle per degree in a newborn to 30 in a few years, if both eyes send a sharp, aligned picture. An eye that is blurred or turned is turned down by the brain during this sensitive period, and stays weak. That is amblyopia; the turned eye is strabismus.',
  keywords: ['amblyopia', 'lazy eye', 'strabismus', 'squint', 'esotropia', 'exotropia', 'prism dioptre', 'suppression', 'diplopia', 'double vision', 'anisometropia', 'sensitive period', 'stereopsis', 'vision screening'],
  prereq: ['binocular-vision-and-stereopsis', 'the-fovea-and-visual-acuity', 'hyperopia'],
  related: ['cover-test-and-binocular-balance', 'prism-in-spectacles', 'visual-acuity-charts', 'eye-movements', 'the-eye-examination', 'physics:the-eye'],
  body: `
The eye is built before birth, but sight is built after it. A newborn has the retina and the brain, but not yet the tuning: acuity at birth is about one cycle per degree (the equivalent of 20/600), and over the first years it climbs to the adult 30 cycles per degree (20/20), **provided each eye sends the brain a sharp picture and the two pictures match**. If one eye's picture is blurred or does not match, the brain turns that eye's input down during this **sensitive period**, and the eye ends up seeing less than its healthy structure allows. This is **amblyopia**, "lazy eye". It is a fault of the visual brain, not of the eye's optics.

> [!note] This page explains how sight develops and what a turned eye does. It cannot say whether a child has a problem; only an examination can, and treatment is decided by an eye specialist.

### Three ways it arises
- **Strabismus** (squint): the eyes point in different directions. The brain gets two unmatched pictures and ignores the turned eye's.
- **Unequal focus** (anisometropia), or high errors in both eyes: one picture is blurred; the brain prefers the sharp one. A child cannot say that one eye is poor.
- **Deprivation**: something blocks the light to one eye, such as a clouded lens or a drooping lid. This does the most damage and needs the earliest attention.

### Measuring a turn: the prism dioptre
A turn is stated in **prism dioptres** (Δ): 1 Δ displaces an image by 1 cm at 1 m, so $\\Delta = 100\\tan\\theta$, and 1 Δ is 0.57°. A turn of 20 Δ is 11.3°. Aligned eyes also converge on a near target: $63\\ \\text{mm}/d$ in prism dioptres, 15.8 Δ (9° in all) at 40 cm and about 1 Δ at 6 m. A turn inwards is an **esotropia**, outwards an **exotropia**; a **tropia** is always present, a **phoria** shows only when the eyes are made to work separately (the cover test, [[cover-test-and-binocular-balance]]).

### What the brain does with two pictures
A new turn in an adult gives **double vision**, the two images apart by the angle of the turn (the simulation shows this). A child's brain does something else: it **suppresses** the turned eye's picture. There is no double vision and no complaint, but the unused eye stops developing, and fine depth perception ([[binocular-vision-and-stereopsis]]) fails.

### How sight develops
| Age | Grating acuity (approximate) | Snellen equivalent |
|---|---|---|
| birth | about 1 cycle per degree | 20/600 |
| 6 months | about 6–12 | 20/100 to 20/50 |
| 3–5 years | about 30 | 20/20 |
By tradition the sensitive period closes at 7 or 8 years; later change is possible but harder, so early detection matters. Screening of preschool children checks acuity, alignment and the red reflex in photographs. Treatment aims to sharpen the weak eye's picture, remove the cause and make the eye work.

> [!warn] A white or cloudy-looking pupil in a flash photograph, an eye that turns constantly or at any time after about four months of age, or sudden double vision in a child or an adult can have serious causes. Seek urgent eye care.

> [!key] The brain learns to see during early childhood, and an eye that is blurred or turned is turned down. A turn is measured in prism dioptres, Δ = 100 tan θ; the risk is silent, so children are screened.
`,
  ideas: [
    'Acuity grows from about 1 cycle per degree at birth to 30 in the first few years, if both eyes send sharp, matching pictures.',
    'Amblyopia is a loss of sight from the brain turning an eye down during development; the eye itself is usually normal.',
    'Strabismus, unequal focus and deprivation are the three roads to amblyopia.',
    'A prism dioptre is 1 cm at 1 m: Δ = 100 tan θ; aligned eyes converge by 63 mm / d prism dioptres.',
    'A child suppresses the turned eye and has no double vision; an adult with a new turn sees double.'
  ],
  pitfalls: [
    'A child would complain if one eye were poor — The brain adapts by ignoring the poor eye and the good eye carries on, so children seldom notice or say. This is why screening matters.',
    'Amblyopia is an eye disease that can be seen — The eye is usually structurally normal. The loss is in the brain\'s use of the eye\'s picture, so a test of acuity, not a look at the eye, finds it.',
    'A baby\'s occasional turn means nothing — Eyes in newborns wander and usually settle in the first months, but a turn that is constant, or present after about four months, should be examined.',
    'Glasses cannot matter if the problem is in the brain — A sharp, focused picture is the very thing the developing brain needs; correcting a large focus error is often the first step in management.'
  ],
  terms: [
    { term: 'Amblyopia', also: ['lazy eye'], def: 'Reduced acuity in an eye that is structurally normal, caused by abnormal visual input in early childhood; it is a fault of the brain\'s processing of that eye\'s picture.' },
    { term: 'Strabismus', also: ['squint', 'heterotropia'], def: 'A misalignment of the eyes, so that only one points at the target at a time.' },
    { term: 'Esotropia and exotropia', def: 'A turn of an eye inwards (towards the nose) or outwards.' },
    { term: 'Prism dioptre', also: ['Δ', 'prism diopter'], def: 'The unit of angle for a turn or a prism: a displacement of 1 cm at a distance of 1 m. Δ = 100 tan θ.' },
    { term: 'Suppression', def: 'The brain\'s switching off of the picture from one eye, which prevents double vision in a person with a turned eye but weakens the suppressed eye.' },
    { term: 'Diplopia', also: ['double vision'], def: 'Seeing one object as two, when the two eyes point at different places.' },
    { term: 'Sensitive period', also: ['critical period'], def: 'The early years in which the visual brain is shaped by what the eyes send it, and an abnormal input can cause lasting loss.' }
  ],
  formulas: [
    {
      name: 'The prism dioptre',
      expr: 'Delta = 100*tan(theta)', tex: '\\Delta = 100\\tan\\theta',
      vars: {
        Delta: { name: 'size of the turn', q: 'prism', unit: 'Δ', tex: '\\Delta' },
        theta: { name: 'angle of the turn', q: 'angle', unit: '°', value: 11.3, min: 0, max: 45, tex: '\\theta' }
      },
      solveFor: 'Delta',
      note: '1 Δ displaces an image by 1 cm at 1 m. A prism of that power turns a ray by the same angle.',
      stories: { Delta: 'An eye points {theta} away from the target. How large is the turn in prism dioptres?', theta: 'An eye is turned by {Delta}. What angle is that?' }
    },
    {
      name: 'Convergence of aligned eyes',
      expr: 'Cv = 100*ipd/d', tex: 'C = \\frac{100\\,\\mathrm{ipd}}{d}',
      vars: {
        Cv: { name: 'convergence of both eyes together', q: 'prism', unit: 'Δ', tex: 'C' },
        ipd: { name: 'distance between the eyes', q: 'length', unit: 'mm', value: 63, min: 50, max: 75, tex: '\\mathrm{ipd}' },
        d: { name: 'distance of the target', q: 'length', unit: 'cm', value: 40, min: 10, max: 600, tex: 'd' }
      },
      solveFor: 'Cv',
      note: 'For small angles: the eyes together turn through ipd/d radians.',
      stories: { Cv: 'A person with {ipd} between the eyes looks at a target {d} away. How much do the eyes converge, in prism dioptres?' }
    }
  ],
  examples: [{
    title: 'Two lamps',
    q: 'An eye is turned by 15 Δ, and the person sees double. How far apart do the two images of a lamp 2 m away appear, as a distance at the lamp and as an angle?',
    steps: [
      { text: 'A turn of 15 Δ displaces an image by 15 cm per metre, so at 2 m:', tex: '15\\ \\text{cm} \\times 2 = 30\\ \\text{cm}' },
      { text: 'The angle:', tex: '\\theta = \\arctan\\!\\left(\\frac{15}{100}\\right) = 8.5^\\circ' }
    ],
    a: 'The images are 30 cm apart at the lamp, 8.5° apart: far wider than the lamp\'s own size, which is why double vision is so disturbing.'
  }],
  quiz: [
    { q: 'What angle, in degrees, is a turn of 20 prism dioptres?', answer: 11.3, unit: '°', why: 'Δ = 100 tan θ, so tan θ = 0.20 and θ = 11.3°.' },
    { q: 'Why does a child with a turned eye rarely see double?', choices: ['The images fall on the same place', 'The brain suppresses the picture of the turned eye', 'Children have no depth perception', 'The turned eye is blind'], a: 1, why: 'The developing brain switches off the picture from the turned eye. This stops double vision but lets that eye fall behind; an adult with a new turn has not learned to do this and sees double.' },
    { q: 'Amblyopia is a disease of the retina that an eye specialist can see by looking into the eye.', a: false, why: 'The eye is usually normal in structure. The loss is in the way the brain uses that eye\'s picture, so it is found by measuring acuity.' },
    { q: 'Two aligned eyes 63 mm apart look at a target 40 cm away. How much do they converge, in prism dioptres?', answer: 15.8, unit: 'Δ', why: 'C = 100 × 0.063 m / 0.40 m = 15.75 Δ, about 9° for both eyes together.' },
    { q: 'Which of these is more likely to be noticed straight away as double vision?', choices: ['A turn that begins at age 2', 'A turn that begins suddenly in an adult', 'A very small focus error', 'A cataract'], a: 1, why: 'An adult\'s visual system is no longer able to suppress the second picture, so a new turn gives double vision; a young child\'s does it automatically.' }
  ],
  applications: [
    'Vision screening of preschool children by acuity charts, photoscreeners and the red reflex.',
    'Choosing a spectacle correction that gives both eyes a sharp picture, sometimes with prism to bring the images together ([[prism-in-spectacles]]).',
    'Measuring a turn with the cover test and prism bars, in prism dioptres ([[cover-test-and-binocular-balance]]).',
    'Understanding why stereo vision, and the depth cues of 3-D displays, depend on both eyes seeing a matching picture.'
  ],
  history: 'The word amblyopia is Greek for dull sight. The proof that the brain has a sensitive period came from Hubel and Wiesel\'s experiments on kittens in the 1960s and 1970s: closing one eye in the first weeks left it permanently weak, whereas the same closure in an adult cat did nothing. The prism dioptre was proposed by Charles Prentice in the late nineteenth century.',
  sources: [
    'D. H. Hubel and T. N. Wiesel, "The period of susceptibility to the physiological effects of unilateral eye closure in kittens", *Journal of Physiology* 206 (1970).',
    'V. Dobson and D. Y. Teller, "Visual acuity in human infants: a review and comparison of behavioral and electrophysiological studies", *Vision Research* 18 (1978).',
    'G. K. von Noorden and E. C. Campos, *Binocular Vision and Ocular Motility*.'
  ],
  sim: { id: 're-eyes-aligned', params: { dev: 20, d: 0.4 } }
},

/* ================================================================ cataract */
{
  id: 'cataract', parent: 'refractive-errors', title: 'Cataract', level: 1,
  short: 'A cataract is a clouding of the lens of the eye. The cloudy lens scatters light forward, which veils the picture and surrounds lamps with glare, and it absorbs blue, so colours yellow. Contrast is lost long before the letters on a chart blur. It is cured by replacing the lens.',
  keywords: ['cataract', 'cloudy lens', 'glare', 'veiling glare', 'disability glare', 'contrast loss', 'yellowing', 'nuclear cataract', 'cortical cataract', 'posterior subcapsular', 'intraocular lens', 'phacoemulsification', 'scatter'],
  prereq: ['anatomy-of-the-eye', 'the-eye-as-a-camera', 'contrast-sensitivity'],
  related: ['intraocular-lenses-and-refractive-surgery', 'light-and-dark-adaptation', 'glare-and-uniformity', 'aberrations-of-the-eye', 'spectacle-lens-coatings', 'physics:the-eye'],
  body: `
The lens of the eye is a living piece of glass: closely packed clear protein, with an index of about 1.42 and no blood supply to renew it. Over the years the protein clumps and yellows and the lens turns cloudy. A **cataract** is that clouding. It is very common in later life, and the lens is the one part of the eye that can be replaced.

> [!note] This page explains what a clouded lens does to light. It cannot say whether someone has a cataract; only an examination can, and the decision to operate is for the patient and the surgeon.

### What a cloudy lens does to light
- **It scatters light forward.** Light that should have gone to a point on the retina is spread over a patch. Fine detail blurs and a bright lamp is surrounded by a halo.
- **It adds a veil.** Scattered light lands everywhere, adding the same amount to bright and dark parts. If the white is $I_{max}$, the black $I_{min}$ and the veil $L_v$, the contrast is
$$C = \\frac{I_{max} - I_{min}}{I_{max} + I_{min} + 2L_v}$$
White of 85 and black of 2 cd/m² give 0.95; with a veil of 50 they give 0.44.
- **It absorbs the short wavelengths.** The lens yellows, so blues dull and whites turn cream.
- **In one type, it changes its index**, and the eye becomes more myopic: glasses are changed, and some people briefly read again without them.

### Glare is the first sign
A lamp that gives illuminance $E$ lux at the eye, $\\theta$ degrees from the line of sight, adds an equivalent veil of about $10E/\\theta^2$ cd/m² in a young eye, and the standard formula multiplies it by $1 + (\\text{age}/62.5)^4$, about 2.6 at 70. A headlamp giving 1 lux at 3° makes a veil of 1.1 cd/m², nearly 3 at 70: as bright as the lit road itself, or brighter, for a road is around 1 cd/m². A cataract multiplies it again. This is why night driving is often the first thing to suffer, and why a high-contrast acuity chart can read near normal when contrast sensitivity and glare tests are poor ([[contrast-sensitivity]]).

### Kinds and numbers
| Kind | Where | Its effect |
|---|---|---|
| nuclear | the centre | yellowing, myopic shift, slow |
| cortical | wedges from the rim | glare, mostly spares the centre early |
| posterior subcapsular | the back of the lens | glare and trouble reading, can be quick |
Age is the main cause; ultraviolet light, diabetes, smoking, steroids and injury raise the risk, and some are present from birth. The World Health Organization estimates that about 94 million people have moderate or severe distance vision impairment or blindness from cataract, the leading cause of blindness worldwide.

### Replacing the lens
The cloudy lens is removed, usually by breaking it up with ultrasound through an incision of 2 to 3 mm, and replaced by an **intraocular lens** whose power, about 21 D on average in a range from 10 to 30, is chosen from the measured length and corneal curvature of the eye ([[intraocular-lenses-and-refractive-surgery]]).

> [!warn] A cataract comes on slowly. Sudden loss of vision, a painful red eye, new flashes of light or a curtain across the view are not signs of a cataract. Seek urgent eye care.

> [!key] A cataract scatters, veils and yellows the light a clear lens would have passed. It spoils contrast and causes glare before it spoils acuity, and a new lens cures it.
`,
  ideas: [
    'A cataract is a clouding of the crystalline lens, which scatters light forward and absorbs blue.',
    'Scattered light acts as a veil: contrast falls as (Imax − Imin)/(Imax + Imin + 2Lv).',
    'Glare from a lamp adds a veil of about 10E/θ² cd/m², larger with age, which is why night driving suffers first.',
    'Acuity charts at high contrast can look nearly normal while contrast and glare are poor.',
    'The cure is to replace the lens with an intraocular lens, about 21 D on average.'
  ],
  pitfalls: [
    'A cataract is a film growing over the eye — It is a change inside the lens, behind the clear cornea and the pupil. Nothing grows on the surface.',
    'Cataract is caused by high pressure in the eye — High pressure belongs to glaucoma. Cataract is a clouding of the lens by changes in its proteins.',
    'A cataract must be ripe before it can be removed — The decision rests on how much it affects the life of the person, not on a stage of the lens; modern surgery does not wait.',
    'If a person reads the chart, the lens is clear — A high-contrast chart in dim surroundings misses the loss. Scatter and glare show up with low-contrast targets and bright lights in the field.'
  ],
  terms: [
    { term: 'Cataract', def: 'A clouding of the crystalline lens of the eye that scatters and absorbs light and so reduces the quality of the image.' },
    { term: 'Veiling glare', also: ['disability glare', 'veiling luminance'], def: 'Light scattered in the eye from a bright source that lies over the whole retinal image like a haze and lowers its contrast.' },
    { term: 'Michelson contrast', def: 'The difference between the brightest and darkest parts of a pattern divided by their sum, from 0 to 1.' },
    { term: 'Nuclear, cortical and posterior subcapsular cataract', def: 'The three main kinds of cataract, named by where in the lens the clouding lies: the centre, the outer wedges, the back surface.' },
    { term: 'Intraocular lens', also: ['IOL'], def: 'An artificial lens placed in the eye in place of the clouded natural lens, with a power chosen from measurements of the eye.' },
    { term: 'Phacoemulsification', def: 'The usual way of removing a cataract: the lens is broken up by ultrasound and sucked out through a very small incision.' }
  ],
  formulas: [
    {
      name: 'Contrast with a veiling luminance',
      expr: 'C = (Imax - Imin)/(Imax + Imin + 2*Lv)', tex: 'C = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min} + 2L_v}',
      vars: {
        C: { name: 'contrast', tex: 'C' },
        Imax: { name: 'luminance of the bright part', q: 'luminance', unit: 'cd/m²', value: 85, tex: 'I_{\\max}' },
        Imin: { name: 'luminance of the dark part', q: 'luminance', unit: 'cd/m²', value: 2, tex: 'I_{\\min}' },
        Lv: { name: 'veiling luminance', q: 'luminance', unit: 'cd/m²', value: 10, min: 0, tex: 'L_v' }
      },
      solveFor: 'C',
      note: 'With no veil it reduces to the Michelson contrast (Imax − Imin)/(Imax + Imin).',
      stories: { C: 'A sign has a bright part of {Imax} and a dark part of {Imin}. A veil of {Lv} lies over the view. What is the contrast?' }
    },
    {
      name: 'Veil from a glare source',
      expr: 'Lv = 10*E/th^2', tex: 'L_v = \\frac{10\\,E}{\\theta^{2}}',
      vars: {
        Lv: { name: 'equivalent veiling luminance', q: 'luminance', unit: 'cd/m²', tex: 'L_v' },
        E: { name: 'illuminance at the eye from the source', q: 'illuminance', unit: 'lx', value: 1, min: 0, tex: 'E' },
        th: { name: 'angle from the line of sight', q: false, unit: '°', value: 3, min: 1, max: 30, tex: '\\theta' }
      },
      solveFor: 'Lv',
      note: 'The Stiles–Holladay form for a young eye, for angles of 1° to 30°. The standard formula multiplies it by 1 + (age/62.5)^4.',
      stories: { Lv: 'A headlamp gives {E} at the eye, {th} from the line of sight. What veiling luminance does it add?' }
    }
  ],
  examples: [{
    title: 'The sign in the veil',
    q: 'A road sign has white at 85 cd/m² and black at 2 cd/m². What is its contrast without a veil, with a veil of 10 cd/m², and with a veil of 50?',
    steps: [
      { text: 'No veil:', tex: 'C = \\frac{85 - 2}{85 + 2} = 0.95' },
      { text: 'Veil of 10:', tex: 'C = \\frac{83}{87 + 20} = 0.78' },
      { text: 'Veil of 50:', tex: 'C = \\frac{83}{87 + 100} = 0.44' }
    ],
    a: '0.95, 0.78 and 0.44: a veil of the size of the sign\'s own brightness halves its contrast without changing its size at all.'
  }],
  quiz: [
    { q: 'What optical effect of a cataract lowers the contrast of the whole picture?', choices: ['It makes the pupil smaller', 'It scatters light and adds a veil over the image', 'It lengthens the eye', 'It flattens the cornea'], a: 1, why: 'Scattered light lands on dark and bright parts alike, which adds a constant to both and lowers the ratio between them.' },
    { q: 'A cataract is caused by too high a pressure in the eye.', a: false, why: 'High pressure is a risk factor for glaucoma. A cataract is a clouding of the lens caused by changes in its proteins.' },
    { q: 'A sign has white at 85 cd/m² and black at 2 cd/m², seen through a veil of 10 cd/m². What is the contrast (to two decimals)?', answer: 0.78, why: '(85 − 2)/(85 + 2 + 2 × 10) = 83/107 = 0.78.' },
    { q: 'Why does night driving often become difficult before reading does?', choices: ['Headlamps put a veil over a dark road, and the road is dim', 'Roads are rougher at night', 'Lenses yellow only at night', 'The pupil is smaller'], a: 0, why: 'A headlamp 3° away adds a veil of the same size as the road\'s own luminance (about 1 cd/m²), halving contrast; a cataract and age multiply that.' },
    { q: 'About how strong is the artificial lens that replaces the natural one, on average?', choices: ['2 D', '21 D', '60 D', '100 D'], a: 1, why: 'The natural lens contributes about 19 D to the 60 D of the eye; the replacement is chosen from the eye\'s measured length and cornea, around 21 D on average.' }
  ],
  applications: [
    'Cataract surgery, among the most frequent operations in the world, with the lens power computed from the axial length and corneal curvature.',
    'Testing glare and contrast sensitivity, not only acuity, to assess how much a lens affects daily life.',
    'Lighting and sign design for older drivers: controlling glare and keeping the contrast of signs high.',
    'Sunglasses and ultraviolet-blocking lenses, since UV exposure is a risk factor.'
  ],
  history: 'Couching, pushing the clouded lens down out of the line of sight with a needle, was practised in ancient India and in the Middle East; Sushruta described it. Modern surgery began when Harold Ridley implanted the first artificial lens in London in 1949, after noticing that splinters of acrylic from aircraft canopies stayed harmlessly in the eyes of pilots. Charles Kelman introduced phacoemulsification in 1967.',
  sources: [
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the crystalline lens, its transmission and scatter.',
    'CIE 146:2002, *CIE equations for disability glare*.',
    'World Health Organization, *World report on vision* (2019).'
  ],
  sim: 're-cataract'
},

/* ================================================================ glaucoma */
{
  id: 'glaucoma-and-the-visual-field', parent: 'refractive-errors', title: 'Glaucoma', level: 2,
  short: 'Glaucoma is a group of conditions in which the fibres of the optic nerve are lost, usually slowly and without pain. Because the fibres arch around the centre, the visual field is lost in arcs from the edges inwards while sharp central vision lasts; it is found by measuring pressure, the nerve and the field.',
  keywords: ['glaucoma', 'intraocular pressure', 'IOP', 'optic nerve', 'visual field', 'arcuate scotoma', 'Bjerrum', 'nasal step', 'tunnel vision', 'angle closure', 'open-angle', 'tonometry', 'perimetry', 'Goldmann'],
  prereq: ['the-visual-field', 'anatomy-of-the-eye', 'the-blind-spot-and-filling-in'],
  related: ['perimetry', 'tonometry', 'ophthalmoscopy-and-fundus-imaging', 'oct-in-eye-care', 'hyperopia', 'myopia', 'the-eye-examination', 'physics:the-eye'],
  body: `
Every eye has a cable: the **optic nerve**, a bundle of roughly a million fibres, each the long thread of one cell of the retina, carrying the picture to the brain. In **glaucoma** these fibres die, a few at a time. It is usually painless, and it takes the visual field from the outside inwards while the middle of the picture stays sharp for a long time, so a person may have lost much of it before noticing anything.

> [!note] This page explains how glaucoma damages the field and how it is measured. It cannot say whether anyone has it; only an eye examination can, and treatment is decided by an eye specialist.

### Pressure, flow and the nerve
The eye is kept in shape by a clear fluid, the aqueous humour, made at about 2.5 µL per minute by the ciliary body, flowing through the pupil and draining at the angle between the iris and the cornea. The pressure is the inflow divided by the ease of drainage, plus the pressure in the veins it drains into (the Goldmann equation):
$$P = \\frac{F}{C} + P_v \\approx \\frac{2.5}{0.28} + 9 \\approx 18\\ \\text{mmHg}$$
Typical pressures lie between 10 and 21 mmHg (the range of 95 % of people, with a mean near 15 to 16). But pressure is a risk, not the definition: the nerve is damaged at pressures called normal in some people, and many with higher pressures never lose field. Pressure is measured by flattening the cornea: a force $F$ over a circle of area $A$ gives $P = F/A$; at a diameter of 3.06 mm, a force of 1 gram-force corresponds to 10 mmHg ([[tonometry]]).

### Why the loss is an arc
Fibres leave the retina and sweep in arcs around the macula towards the optic disc, 15° to the nasal side of the fovea, which gives the blind spot at 15° temporal in the field. A bundle damaged on its way makes an arc-shaped defect that starts at the blind spot and arches over or under the centre, ending in a straight edge at the horizontal midline, the **nasal step**. Later arcs join, the field narrows to a tunnel, and a small central island remains until late. The simulation draws such a map in the printed form of **perimetry** ([[perimetry]]), with test points 6° apart over the central 30°.

### Why it goes unnoticed
Each eye covers the gaps in the other, the two fields overlap through 120°, and the brain fills what is missing ([[the-blind-spot-and-filling-in]]); and central acuity, which a chart tests, is the last thing to go. Glaucoma is therefore often found at a routine examination, by the shape of the nerve head ([[ophthalmoscopy-and-fundus-imaging]]), the thickness of the nerve fibre layer ([[oct-in-eye-care]]), the pressure and the field. About 76 million people aged 40 to 80 were estimated to have it in 2020, and 112 million by 2040 (Tham and colleagues, 2014).

### Open angle and closed angle
In **open-angle** glaucoma, the commonest form, the drainage angle looks open but drains badly, and the field fails slowly. In **angle-closure** glaucoma the iris blocks the drainage; it is more likely in small, short, long-sighted eyes ([[hyperopia]]), and may close suddenly.

> [!warn] Sudden severe eye pain, a red eye, blurred vision, haloes around lights with headache, and nausea or vomiting can mean a blocked drainage angle, an emergency that threatens sight within hours. Seek urgent eye care.

> [!key] Glaucoma is loss of optic-nerve fibres, often with raised pressure. The fibres arch round the centre, so the field is lost in arcs from the blind spot, and sharp central vision outlasts it.
`,
  ideas: [
    'Glaucoma is the loss of optic-nerve fibres; it is usually slow and painless.',
    'Pressure is inflow ÷ outflow ease + venous pressure, typically 10–21 mmHg; it is a risk factor, not the definition.',
    'Nerve fibres arch round the macula, so damage makes an arcuate defect from the blind spot, with a nasal step.',
    'Central acuity is kept until late, so a chart does not find it; the field and the nerve do.',
    'A blocked drainage angle is an emergency: pain, a red eye, haloes, nausea.'
  ],
  pitfalls: [
    'Glaucoma is defined by pressure above 21 mmHg — Pressure is a risk factor. Some people lose nerve fibres at normal pressure and many with higher pressures never do; the diagnosis rests on the nerve and the field as well.',
    'If you can read the chart well, the eye is healthy — Central acuity is among the last functions to be lost. A field test can be abnormal when the acuity is 20/20.',
    'Glaucoma always hurts — The common form is painless. Pain, redness and haloes mark the acute angle-closure form, which is the exception.',
    'The dark patches of the field are noticed as black holes — The brain fills in missing areas, as it does for the blind spot, so the loss is usually unseen until it is large. The simulation\'s grey patches show where sight is missing, not what it looks like.'
  ],
  terms: [
    { term: 'Glaucoma', def: 'A group of eye conditions in which the optic nerve is progressively damaged, with a typical loss of visual field.' },
    { term: 'Intraocular pressure', also: ['IOP', 'eye pressure'], def: 'The fluid pressure inside the eye, in mmHg. Typical values are 10 to 21 mmHg; a risk factor for glaucoma.' },
    { term: 'Aqueous humour', def: 'The clear watery fluid in the front of the eye, made by the ciliary body and drained at the angle between the iris and the cornea.' },
    { term: 'Arcuate scotoma', also: ['Bjerrum scotoma', 'nasal step'], def: 'An arc-shaped area of lost field that starts at the blind spot and ends at the horizontal midline; the typical early defect of glaucoma.' },
    { term: 'Angle closure', def: 'A blockage of the drainage angle by the iris, which can raise the pressure suddenly and is an emergency.' },
    { term: 'Perimetry', also: ['visual field test'], def: 'The measurement of the sensitivity of each part of the visual field with spots of light of varying brightness.' }
  ],
  formulas: [
    {
      name: 'Eye pressure from flow and drainage',
      expr: 'P0 = Fa/Cf + Pv', tex: 'P = \\frac{F}{C} + P_v',
      vars: {
        P0: { name: 'intraocular pressure', q: false, unit: 'mmHg', tex: 'P' },
        Fa: { name: 'inflow of aqueous humour', q: false, unit: 'µL/min', value: 2.5, min: 0.5, max: 6, tex: 'F' },
        Cf: { name: 'outflow facility (ease of drainage)', q: false, unit: 'µL/min per mmHg', value: 0.28, min: 0.05, max: 0.6, tex: 'C' },
        Pv: { name: 'pressure in the veins that receive it', q: false, unit: 'mmHg', value: 9, min: 5, max: 15, tex: 'P_v' }
      },
      solveFor: 'P0',
      note: 'The Goldmann equation with typical values. Poorer drainage (a smaller C) raises the pressure.',
      stories: { P0: 'Aqueous humour is made at {Fa} and drains with a facility of {Cf}, into veins at {Pv}. What is the eye pressure?' }
    },
    {
      name: 'Pressure from flattening the cornea',
      expr: 'P = F/A', tex: 'P = \\frac{F}{A}',
      vars: {
        P: { name: 'pressure', q: 'pressure', unit: 'mmHg', tex: 'P' },
        F: { name: 'force on the cornea', q: 'force', unit: 'mN', value: 14.7, min: 0, tex: 'F' },
        A: { name: 'flattened area', q: 'area', unit: 'mm²', value: 7.35, min: 1, max: 20, tex: 'A' }
      },
      solveFor: 'P',
      note: 'The Imbert–Fick law. A flattened circle of 3.06 mm diameter (7.35 mm²) is chosen so that 9.8 mN (1 gram-force) means 10 mmHg.',
      stories: { P: 'A tonometer presses with {F} over a flattened area of {A}. What is the pressure?' }
    }
  ],
  examples: [{
    title: 'A reading of 1.5 grams',
    q: 'A tonometer flattens a circle of 3.06 mm diameter with a force of 1.5 gram-force (14.7 mN). What is the eye pressure?',
    steps: [
      { text: 'The area of the circle:', tex: 'A = \\pi\\,(1.53\\ \\text{mm})^2 = 7.35\\ \\text{mm}^2' },
      { text: 'The pressure:', tex: 'P = \\frac{14.7\\times10^{-3}\\ \\text{N}}{7.35\\times10^{-6}\\ \\text{m}^2} = 2000\\ \\text{Pa} = 15\\ \\text{mmHg}' }
    ],
    a: '15 mmHg, in the middle of the usual range. The scale is built so that grams of force times 10 give millimetres of mercury.'
  }],
  quiz: [
    { q: 'Where does the first loss of field in glaucoma typically appear?', choices: ['In the middle of the field', 'In an arc around the centre, starting at the blind spot', 'Evenly all round the edge', 'In one whole half of the field'], a: 1, why: 'Optic-nerve fibres sweep in arcs around the macula. A damaged bundle gives an arc-shaped defect from the blind spot, ending in a straight edge at the horizontal midline.' },
    { q: 'Glaucoma is defined as an eye pressure above 21 mmHg.', a: false, why: 'Pressure is an important risk factor, but the condition is damage to the optic nerve. Some people lose fibres at normal pressure and many people with higher pressure never do.' },
    { q: 'Aqueous humour is made at 2.5 µL/min, drains with a facility of 0.28 µL/min per mmHg, and the veins are at 9 mmHg. What is the eye pressure, in mmHg?', answer: 17.9, unit: 'mmHg', why: 'P = F/C + Pv = 2.5/0.28 + 9 = 8.9 + 9 = 17.9 mmHg.' },
    { q: 'Which set of symptoms should be treated as an emergency?', choices: ['A gradual narrowing of the peripheral field with no pain', 'Sudden severe eye pain, a red eye, haloes round lights and nausea', 'A small floating spot that has been there for years', 'Needing stronger reading glasses'], a: 1, why: 'These are the signs of acute angle closure, which can damage the nerve within hours and needs immediate care.' },
    { q: 'Why can a person lose much of the visual field before noticing?', choices: ['The field is not used in daily life', 'The other eye covers the gaps, the brain fills them in, and central vision lasts longest', 'The loss is always painless but quick', 'The optic nerve repairs itself'], a: 1, why: 'The two fields overlap, the brain fills in missing areas, and the sharp central acuity that people notice is lost last.' }
  ],
  applications: [
    'The eye examination, in which pressure, the nerve head and the visual field are all examined for glaucoma ([[the-eye-examination]]).',
    'Automated perimetry, which maps the field point by point and compares it with a normal range.',
    'Tonometers: applanation, air-puff and rebound, all based on the relation of force, area and pressure.',
    'Road safety, where the loss of the peripheral field makes driving and crossing a road harder than reading.'
  ],
  history: 'The Greek word glaukos, grey-blue, names the sea-green look of an eye in an acute attack. Albrecht von Graefe linked glaucoma to raised pressure in the 1850s. Jannik Bjerrum described the arcuate defect in 1889, and Hans Goldmann\'s applanation tonometer of the 1950s remains the reference for measuring pressure.',
  sources: [
    'Y.-C. Tham et al., "Global prevalence of glaucoma and projections of glaucoma burden through 2040", *Ophthalmology* 121 (2014).',
    'H. Goldmann and T. Schmidt, "Über Applanationstonometrie", *Ophthalmologica* 134 (1957).',
    'European Glaucoma Society, *Terminology and Guidelines for Glaucoma*.'
  ],
  sim: 're-glaucoma'
},

/* ================================================================ macular degeneration and retinal disease */
{
  id: 'macular-degeneration-and-retinal-disease', parent: 'refractive-errors', title: 'Macular degeneration and diseases of the retina', level: 2,
  short: 'Sharp vision comes from the macula, a patch of retina 5.5 mm across with the fovea at its centre. Damage there makes a blind patch in the middle of the view and bends straight lines, while the sides are spared. The Amsler grid shows such changes; other retinal diseases take other parts of the field.',
  keywords: ['macular degeneration', 'AMD', 'macula', 'fovea', 'scotoma', 'metamorphopsia', 'Amsler grid', 'drusen', 'diabetic retinopathy', 'retinal detachment', 'retinitis pigmentosa', 'central vision', 'eccentric viewing'],
  prereq: ['the-fovea-and-visual-acuity', 'the-retina-rods-and-cones', 'anatomy-of-the-eye'],
  related: ['ophthalmoscopy-and-fundus-imaging', 'oct-in-eye-care', 'low-vision-and-magnification', 'the-blind-spot-and-filling-in', 'perimetry', 'visual-acuity-charts', 'myopia', 'physics:the-eye'],
  body: `
Sharp vision lives in a small patch. The **macula**, the yellow-pigmented centre of the retina, is about 5.5 mm across, 18° of the field; the **fovea** at its middle, about 1.5 mm or 5°, holds the densest cones, and its centre, the foveola, is only 0.35 mm wide. A millimetre of retina covers 3.4° of the field, so a lesion 1 mm across takes out 3.4° of the view at the very place that is looked at. Reading, faces and detail all depend on it.

> [!note] This page explains how damage to the macula and retina changes sight and how it is detected. It cannot say what any person has; examination and imaging do that, and treatment is for specialists.

### What central damage does
Two things, often together: a **scotoma**, a patch where nothing is seen, and **metamorphopsia**, a warping that bends straight lines. The sides of the field are spared, so a person keeps their sense of space and moves about well while reading and recognizing faces fail. When the fovea is lost the eye uses the retina beside it, where cones are sparser, and acuity falls steeply with distance from the fovea, roughly as $20 \\times (1 + e/2°)$ for $e$ degrees of eccentricity:

| Distance from the fovea | Typical acuity |
|---|---|
| 0° | 20/20 |
| 2° | 20/40 |
| 5° | 20/70 |
| 10° | 20/120 |
| 20° | 20/220 |
These figures are rough and vary with the method of testing. The simulation lays a scotoma and a warp over a face, a line of print and the Amsler grid.

### Age-related macular degeneration
The commonest cause of lost central vision in older people. In the **dry** form, deposits (drusen) build up under the macula and the cells slowly thin and die. In the **wet** form new, leaky blood vessels grow and can scar the macula within weeks; it is the smaller group, roughly one in ten, and accounts for much of the severe loss. About 196 million people were estimated to have it in 2020, and 288 million by 2040 (Wong and colleagues, 2014). Age, smoking and family history raise the risk.

### The Amsler grid
A printed square of 20 × 20 squares, each 5 mm, held at about 30 cm so that each square covers about 1° and the whole grid about 19°. With one eye covered and the glasses used for reading, the viewer looks at the central dot and notes any wavy, missing or blurred lines. Devised by Marc Amsler in 1947, it is a way of noticing change, used when an examiner has asked for it; it does not replace an examination.

### Other diseases of the retina
- **Diabetic retinopathy**: damage to the small vessels, a leading cause of sight loss in working-age adults.
- **Retinal detachment**: the retina peels from the back wall; the part that is detached stops seeing.
- **Retinitis pigmentosa**: inherited loss of rods first, so night vision and the outer field fail before the centre.

Imaging of the macula in section, to micrometres, is done with OCT ([[oct-in-eye-care]]).

> [!warn] New wavy or bent straight lines, a new dark or blurred patch in the centre, sudden flashes of light, a shower of new floaters, or a curtain or shadow spreading over the view can mean damage that needs prompt assessment. Seek urgent eye care.

> [!key] The macula gives all sharp vision from 18° of retina. Damage there makes a central blind patch and bent lines, with the sides spared; the Amsler grid shows the change, and acuity at the patch's edge falls to a fraction of its central value.
`,
  ideas: [
    'The macula is 5.5 mm (18°) across and the fovea 1.5 mm (5°); a millimetre of retina is 3.4° of the field.',
    'Central damage gives a scotoma and metamorphopsia, while the peripheral field and the sense of space remain.',
    'Acuity falls steeply away from the fovea, roughly as 20 × (1 + e/2°).',
    'Age-related macular degeneration has a slow dry form and a smaller, faster wet form.',
    'The Amsler grid is a 10 cm grid of 5 mm squares, seen at 30 cm: a way to notice distortion and gaps.'
  ],
  pitfalls: [
    'Macular degeneration makes a person blind — It takes the centre and leaves the periphery, so people keep their sense of space and mobility; but reading and faces are lost. It is a loss of detail, not of all sight.',
    'The blind patch is a black spot that is always seen — Many people see a grey or blurred patch, or nothing at all, because the brain fills in; this is why the grid and a test of the field are used rather than the person\'s own impression.',
    'The Amsler grid maps the blind spot of the optic nerve — That blind spot lies 15° to the side, outside the grid, which reaches only about 9.5° from the centre. The grid tests the macula; lines bend in it where the macula is disturbed.',
    'Acuity is the same everywhere in the retina, so an unaffected side will do as well — Cone density falls steeply from the fovea; a good retina 5° away resolves only about a third of the fovea\'s detail.'
  ],
  terms: [
    { term: 'Macula', def: 'The central region of the retina, about 5.5 mm (18°) across, responsible for sharp central vision.' },
    { term: 'Fovea', def: 'The pit at the centre of the macula, about 1.5 mm (5°) across, which has the highest density of cones.' },
    { term: 'Age-related macular degeneration', also: ['AMD', 'ARMD'], def: 'A disease of ageing in which the macula deteriorates, in a dry form with slow thinning or a wet form with leaking new vessels.' },
    { term: 'Scotoma', def: 'A patch of the visual field in which sight is reduced or absent.' },
    { term: 'Metamorphopsia', def: 'A distortion of what is seen, in which straight lines look bent or wavy, caused by disturbance of the macula.' },
    { term: 'Amsler grid', def: 'A square grid of 20 × 20 squares of 5 mm, viewed at 30 cm, used to notice distortion or gaps in the central 20° of the field.' },
    { term: 'Retinal detachment', def: 'The separation of the retina from the layer behind it, which stops the detached part from seeing.' }
  ],
  formulas: [
    {
      name: 'Size on the retina of a field angle',
      expr: 's = 0.017*tan(theta)', tex: 's = 17\\ \\text{mm}\\cdot\\tan\\theta',
      vars: {
        s: { name: 'size on the retina', q: 'length', unit: 'mm', tex: 's' },
        theta: { name: 'angle of the field', q: 'angle', unit: '°', value: 5, min: 0, max: 60, tex: '\\theta' }
      },
      solveFor: 's',
      note: 'Using 17 mm from the rear nodal point to the retina: about 0.3 mm per degree.',
      stories: { s: 'A lesion covers {theta} of the field. How large is it on the retina?', theta: 'A lesion is {s} across on the retina. How many degrees of the field does it cover?' }
    },
    {
      name: 'Acuity away from the fovea',
      expr: 'den = 20*(1 + ecc/E2)', tex: 'N = 20\\left(1 + \\frac{\\varepsilon}{E_2}\\right)',
      vars: {
        den: { name: 'Snellen denominator (20/N)', q: false, tex: 'N' },
        ecc: { name: 'eccentricity from the fovea', q: false, unit: '°', value: 5, min: 0, max: 30, tex: '\\varepsilon' },
        E2: { name: 'eccentricity at which the minimum angle of resolution doubles', q: false, unit: '°', value: 2, min: 1, max: 4, tex: 'E_2' }
      },
      solveFor: 'den',
      note: 'A rough rule for the fall in grating and letter acuity with eccentricity; the value of E₂ depends on the task, 2° is typical.',
      stories: { den: 'A person looks with a retina {ecc} from the fovea, using E₂ = {E2}. What is the Snellen denominator?' }
    },
    {
      name: 'Angle covered by a grid',
      expr: 'th = 2*atan(w/(2*d))', tex: '\\theta = 2\\arctan\\!\\left(\\frac{w}{2d}\\right)',
      vars: {
        th: { name: 'angle covered', q: 'angle', unit: '°', tex: '\\theta' },
        w: { name: 'width of the grid', q: 'length', unit: 'mm', value: 100, min: 20, max: 400, tex: 'w' },
        d: { name: 'viewing distance', q: 'length', unit: 'cm', value: 30, min: 10, max: 100, tex: 'd' }
      },
      solveFor: 'th',
      stories: { th: 'A grid {w} across is held {d} away. How many degrees of the field does it cover?' }
    }
  ],
  examples: [{
    title: 'A small lesion, a big gap',
    q: 'A lesion at the fovea is 0.6 mm across on the retina. How large a patch of the field is lost, and how large is that against the 5 mm squares of an Amsler grid held at 30 cm?',
    steps: [
      { text: 'The angle subtended at the nodal point, 17 mm from the retina:', tex: '\\theta = \\arctan\\!\\left(\\frac{0.6}{17}\\right) = 2.0^\\circ' },
      'A square of the grid at 30 cm covers 0.95°, so the patch hides about two squares across.'
    ],
    a: 'About 2° of the field, a gap two squares of the grid wide, from a lesion a little over half a millimetre across.'
  }],
  quiz: [
    { q: 'How many degrees of the visual field does 1 mm of retina cover, taking 17 mm from the nodal point to the retina?', answer: 3.4, unit: '°', why: 'θ = arctan(1/17) = 3.37°, about 0.3 mm per degree.' },
    { q: 'What do straight lines on an Amsler grid look like if the macula is disturbed?', choices: ['Brighter', 'Wavy, broken or missing near the centre', 'Coloured', 'Doubled'], a: 1, why: 'Metamorphopsia and scotomas show as bent lines and gaps in the grid, near the dot that is looked at.' },
    { q: 'Macular degeneration leaves a person unable to see anything.', a: false, why: 'It takes the centre of the field and leaves the periphery, so a person with it can still see where things are and move about.' },
    { q: 'Using 20 × (1 + e/2°), which Snellen fraction does a retina 6° from the fovea give?', choices: ['20/40', '20/60', '20/80', '20/120'], a: 2, why: '20 × (1 + 6/2) = 20 × 4 = 80, so 20/80.' },
    { q: 'An Amsler grid is 100 mm wide and held 30 cm away. How many degrees does it cover?', answer: 18.9, unit: '°', why: 'θ = 2 arctan(50/300) = 18.9°.' }
  ],
  applications: [
    'Home and clinic monitoring of the central field with the Amsler grid, when a clinician has asked for it.',
    'OCT and fundus imaging of the macula, which show the layers of the retina and the deposits or fluid within them.',
    'Low-vision rehabilitation, where eccentric viewing and magnification are taught ([[low-vision-and-magnification]]).',
    'Understanding why reading speed and face recognition fail before mobility does.'
  ],
  history: 'The yellow spot, the macula lutea, was described by Samuel Thomas von Sömmerring in the late eighteenth century. Marc Amsler, a Swiss ophthalmologist, devised his grid in 1947 for the early detection of disease of the macula.',
  sources: [
    'W. L. Wong et al., "Global prevalence of age-related macular degeneration and disease burden projection for 2020 and 2040", *The Lancet Global Health* 2 (2014).',
    'M. Amsler, "Earliest symptoms of diseases of the macula", *British Journal of Ophthalmology* 37 (1953).',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the retina and the fall of acuity away from the fovea.'
  ],
  sim: 're-macula'
},

/* ================================================================ keratoconus */
{
  id: 'keratoconus-and-corneal-shape', parent: 'refractive-errors', title: 'Keratoconus and the irregular cornea', level: 3,
  short: 'In keratoconus the cornea thins and bulges into a cone, usually below the centre. The cone is neither a sphere nor a cylinder: it gives irregular astigmatism, a point becomes a comet, and spectacles can correct only part of it. Rings, curvature maps and thickness show it.',
  keywords: ['keratoconus', 'cornea', 'cone', 'irregular astigmatism', 'corneal topography', 'Placido', 'keratometry', 'K reading', 'higher-order aberrations', 'coma', 'cross-linking', 'scleral lens', 'rigid gas permeable', 'ectasia'],
  prereq: ['astigmatism-of-the-eye', 'aberrations-of-the-eye', 'keratometry-and-corneal-topography'],
  related: ['contact-lenses', 'intraocular-lenses-and-refractive-surgery', 'wavefront-error-and-zernike-polynomials', 'autorefractors-and-aberrometers', 'physics:the-eye'],
  body: `
The front surface of the cornea does most of the focusing of the eye. Its radius of about 7.8 mm and the step in index from air (1.000) to cornea (1.377) give it a power of $(1.377 - 1)/0.0078 \\approx 48$ D, which the back surface reduces to about 43 D in all. In **keratoconus** the cornea thins and the pressure of the eye pushes it forward into a cone, usually below the centre. A normal cornea is about 0.55 mm thick at the centre; in keratoconus it can fall to 0.45 mm or less.

> [!note] This page explains how a conical cornea affects light and how it is measured. It cannot say whether anyone has it; only an examination and corneal imaging can, and treatment is for a specialist.

### What the shape does to the picture
A sphere and a cylinder, the two shapes a spectacle lens can offset, are both smooth and symmetrical. A cone is neither. Where it steepens, rays are bent too much, and the rest of the pupil is normal, so the rays do not meet at one point or along two lines: a point of light becomes a comet with a tail, with **coma**-like higher-order aberrations ([[aberrations-of-the-eye]]), ghosts and several images of a single object, and haloes at night. This is **irregular astigmatism**.

### How the cornea is measured
A **Placido disc** casts concentric rings on the cornea, and the image of the rings in the cornea acts as a convex mirror: each ring appears where the surface has a particular slope, so on a regular cornea the rings are round and evenly spaced, a steeper place crowds them and a flatter one spreads them. The curvature is turned into a colour map. The keratometer power is $K = 337.5/R$ with $R$ in millimetres, using the fictitious index of 1.3375 so that front and back together come out right:

| Cornea | Radius | Keratometric power |
|---|---|---|
| typical | 7.8 mm | 43.3 D |
| steeper | 7.5 mm | 45.0 D |
| draws attention | 7.2 mm | 47 D |
| moderate cone | 6.75 mm | 50 D |
| advanced cone | 6.1 mm | 55 D |
The thresholds are only a guide: the diagnosis uses the map, the thickness and the pattern ([[keratometry-and-corneal-topography]]).

### Who, and how many
It usually begins in the teens or twenties, progresses for ten to twenty years and then settles. Studies have given between roughly 1 in 2000 and 1 in 400, depending on how it is counted. It is associated with family history, allergy and vigorous eye rubbing, though association does not show cause.

### Seeing past it
A spectacle lens corrects the sphere and the cylinder, and only part of the problem. A rigid contact lens, or a larger scleral lens that vaults the cornea, holds a layer of tears behind it. Tears (1.336) and cornea (1.377) have nearly the same index, so the tear layer fills in the irregularity and the smooth front surface of the lens takes over as the surface that focuses ([[contact-lenses]]). Corneal cross-linking, which stiffens the tissue with riboflavin and ultraviolet-A light of 365 nm, aims to stop it from progressing. Which is suitable is for a cornea specialist.

> [!warn] In a person known to have keratoconus, a sudden clouding of vision with pain and redness, or in anyone a painful red eye with reduced vision, needs prompt care. Seek urgent eye care.

> [!key] Keratoconus replaces a smooth round cornea by one with a cone. The result is irregular astigmatism, a comet-shaped point image, a crowding of the Placido rings and a steep patch on the curvature map; sphere and cylinder do not capture it.
`,
  ideas: [
    'The front of the cornea gives about 48 D by itself; the whole cornea about 43 D, which the keratometer reports as K = 337.5/R.',
    'In keratoconus the cornea thins and forms a cone, usually below the centre, and steepens locally.',
    'A cone is irregular: it is not a sphere or a cylinder, so a point becomes a comet and spectacles correct only part.',
    'Placido rings crowd in steep places and spread in flat ones; the curvature map shows a hot spot.',
    'A rigid or scleral lens with a tear layer replaces the irregular front surface by a smooth one.'
  ],
  pitfalls: [
    'Keratoconus is a big astigmatism and a stronger cylinder will cure it — The shape is not a cylinder; its local steep patch makes aberrations that no single sphere and cylinder can offset. That is why rigid lenses, which make a new front surface, are used.',
    'Keratometer readings give the power of the cornea — The keratometer uses a made-up index of 1.3375 to turn a measured radius into a number. It measures the shape of the front surface; the 48 D of the front surface is different.',
    'Placido rings are a photograph of the cornea\'s tissue — They are the reflection of a ring pattern in the front surface: each ring marks a place of a given slope, so crowded rings mean a steep place. The picture is of the light, shaped by the surface.',
    'It is caused by rubbing the eyes, so it can be prevented — Rubbing is associated with it, and a risk factor is not the same as a cause. The condition has several contributors, among them family history.'
  ],
  terms: [
    { term: 'Keratoconus', def: 'A condition in which the cornea thins and bulges forward into a cone, causing irregular astigmatism and blurred, distorted sight.' },
    { term: 'Irregular astigmatism', def: 'An error of focus that cannot be described by a sphere, a cylinder and an axis, because the surface is not toric.' },
    { term: 'Keratometry', also: ['K reading'], def: 'The measurement of the radius of the front surface of the cornea from the reflection of a ring, converted to dioptres with the index 1.3375: K = 337.5/R.' },
    { term: 'Placido disc', also: ['corneal topography'], def: 'A pattern of concentric rings whose reflection in the cornea is photographed and analysed to map its curvature.' },
    { term: 'Higher-order aberration', also: ['coma', 'trefoil'], def: 'An error of the wave front beyond sphere and cylinder, such as coma, which makes a point into a comet.' },
    { term: 'Corneal cross-linking', also: ['CXL'], def: 'A procedure that uses riboflavin and ultraviolet-A light to strengthen the cornea and slow the growth of a cone.' },
    { term: 'Rigid and scleral lenses', also: ['RGP lens', 'scleral lens'], def: 'Contact lenses of a hard material that keeps its shape; a scleral lens is large enough to rest on the white of the eye and vault the cornea. Both hold a layer of tears that gives a smooth refracting surface.' }
  ],
  formulas: [
    {
      name: 'Keratometric power',
      expr: 'K = 0.3375/R', tex: 'K = \\frac{1.3375 - 1}{R}',
      vars: {
        K: { name: 'keratometric power', q: 'optpower', unit: 'D', tex: 'K' },
        R: { name: 'radius of curvature of the front surface', q: 'length', unit: 'mm', value: 7.8, min: 4, max: 12, tex: 'R' }
      },
      solveFor: 'K',
      note: 'The keratometer uses a made-up index of 1.3375 so that the power of the front and back surfaces together comes out right.',
      stories: { K: 'A cornea has a radius of curvature of {R}. What is its keratometric power?', R: 'A keratometer reads {K}. What radius of curvature does it correspond to?' }
    },
    {
      name: 'Power of the front surface',
      expr: 'P = (n - 1)/R', tex: 'P = \\frac{n - 1}{R}',
      vars: {
        P: { name: 'power of the front surface', q: 'optpower', unit: 'D', tex: 'P' },
        n: { name: 'index of the cornea', value: 1.377, min: 1.3, max: 1.5, tex: 'n' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 7.8, min: 4, max: 12, tex: 'R' }
      },
      solveFor: 'P',
      stories: { P: 'The front of the cornea has an index of {n} and a radius of {R}. What is its power in air?' }
    }
  ],
  examples: [{
    title: 'A steep cornea',
    q: 'A keratometer reads K = 50 D. What radius of curvature is that, and what power would the front surface alone have, with an index of 1.377?',
    steps: [
      { text: 'Invert the keratometer formula:', tex: 'R = \\frac{337.5}{50} = 6.75\\ \\text{mm}' },
      { text: 'The front surface alone:', tex: 'P = \\frac{1.377 - 1}{0.00675} = 55.9\\ \\text{D}' }
    ],
    a: 'R = 6.75 mm, a moderate steepening; the front surface alone is nearly 56 D, about 5 D more than the keratometer reports.'
  }],
  quiz: [
    { q: 'A keratometer reads 50 D. What is the radius of curvature of the cornea, in millimetres?', answer: 6.75, unit: 'mm', why: 'R = 337.5/K = 337.5/50 = 6.75 mm.' },
    { q: 'Why can spectacles correct only part of the blur of keratoconus?', choices: ['The lenses are too weak', 'The cone is irregular: no single sphere and cylinder offset its local steep patch', 'Keratoconus is in the retina', 'The cone moves'], a: 1, why: 'A spectacle lens has a sphere and a cylinder. A cone creates aberrations such as coma that depend on position in the pupil and cannot be described by them.' },
    { q: 'Where the cornea is steeper, the Placido rings it reflects are crowded closer together.', a: true, why: 'Each ring appears where the surface has a given slope; a steeper surface reaches that slope sooner, so the rings are closer together.' },
    { q: 'Why does a rigid contact lens help an irregular cornea?', choices: ['It makes the cornea thicker', 'The tear layer fills the irregularity, and the lens\'s smooth front surface becomes the refracting surface', 'It filters the light', 'It lengthens the eye'], a: 1, why: 'Tears have nearly the same index as the cornea (1.336 against 1.377), so they remove the irregular front surface optically; the lens\'s own smooth surface focuses instead.' },
    { q: 'What power does a cornea with a radius of 7.8 mm and an index of 1.377 have at its front surface alone, in dioptres?', answer: 48.3, unit: 'D', why: 'P = (1.377 − 1)/0.0078 m = 48.3 D. The back surface and the aqueous reduce it to about 43 D for the whole cornea.' }
  ],
  applications: [
    'Corneal topography and tomography for diagnosis, staging and following change.',
    'Fitting rigid and scleral contact lenses, where the map tells the lens\'s shape.',
    'Screening of eyes before laser refractive surgery, since thin or steep corneas are at risk of bulging afterwards.',
    'Computing the power of an implanted lens after corneal surgery, where the usual keratometer index is less reliable.'
  ],
  history: 'The cone-shaped cornea was described by Burchard Mauchart in 1748 and received its modern description from John Nottingham in 1854. Antonio Placido introduced his disc of rings in 1880, and corneal cross-linking was first reported in patients by Wollensak, Spoerl and Seiler in 2003.',
  sources: [
    'Y. S. Rabinowitz, "Keratoconus", *Survey of Ophthalmology* 42 (1998).',
    'J. H. Krachmer, M. J. Mannis and E. J. Holland (eds.), *Cornea* — keratoconus and corneal topography.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the cornea and its shape.'
  ],
  sim: 're-cornea'
},

/* ================================================================ low vision and magnification */
{
  id: 'low-vision-and-magnification', parent: 'refractive-errors', title: 'Low vision and magnifying aids', level: 2,
  short: 'Low vision is sight that lenses, medicine or surgery cannot bring back to normal. The magnification that restores reading is the ratio of two sizes, what the eye can resolve against what the print offers, and it comes from larger print, a nearer page, a magnifier, a telescope or a screen.',
  keywords: ['low vision', 'visual impairment', 'legal blindness', 'magnification', 'magnifier', 'Kestenbaum', 'telescope', 'CCTV', 'electronic magnifier', 'eccentric viewing', 'large print', 'reading acuity', 'ICD-11'],
  prereq: ['the-fovea-and-visual-acuity', 'visual-acuity-charts', 'angular-magnification'],
  related: ['the-magnifier', 'macular-degeneration-and-retinal-disease', 'glaucoma-and-the-visual-field', 'cataract', 'contrast-sensitivity', 'occupational-and-computer-lenses', 'physics:vision-correction'],
  body: `
**Low vision** is sight that glasses, contact lenses, medicine or surgery cannot bring to normal and that gets in the way of everyday tasks: reading, recognizing faces, getting about. It is a matter of degree. The WHO classification (ICD-11) names the loss by the acuity of the better eye: **mild** worse than 6/12 (20/40), **moderate** worse than 6/18 (20/60), **severe** worse than 6/60 (20/200), **blindness** worse than 3/60 (20/400), with near vision impairment defined separately. In the United States "legal blindness" is 20/200 or worse, or a field of 20° or less.

> [!note] This page explains how magnification makes print and objects readable again. Which aid suits a person depends on their eyes, tasks and surroundings, and is for a low-vision specialist to advise.

### How big must print be?
Acuity of 20/N means the eye resolves detail $N/20$ times coarser than 20/20, and a letter must subtend $5' \\times N/20$ to be recognized. The **magnification needed** is the ratio of two sizes: what the eye needs over what the print gives. For capital letters of 1.8 mm, typical of newspaper text, at 40 cm (15.5′, a 20/62 letter):

| Acuity | Smallest letter at 40 cm | Magnification to just read it | To read it comfortably (twice that) |
|---|---|---|---|
| 20/40 | 1.2 mm | none | 1.3 |
| 20/60 | 1.7 mm | 1.0 | 1.9 |
| 20/100 | 2.9 mm | 1.6 | 3.2 |
| 20/200 | 5.8 mm | 3.2 | 6.5 |
| 20/400 | 11.6 mm | 6.5 | 13 |
Fluent reading needs print two to three times the smallest size the eye resolves.

### Four ways to magnify
- **Larger size.** Bigger print, bigger screen text; the cheapest and the most dependable.
- **Smaller distance.** Halving the distance doubles the angle, but the eye must focus on the near page, so a plus lens is needed. The rule of thumb of Kestenbaum gives the reading addition as the reciprocal of the acuity: 20/200 asks for +10 D and a page at 10 cm.
- **A lens.** A magnifier of power $D$ held at its focal length gives an angular magnification of $D\\,d_0$ against viewing at $d_0$: $D/4$ against the conventional 25 cm, and $D/2.5$ against the 40 cm of ordinary reading. Strong lenses have short focal lengths, small fields and close working distances ([[the-magnifier]]).
- **A telescope or a camera.** A telescope of objective focal length $f_o$ and eyepiece $f_e$ magnifies by $f_o/f_e$, for signs and blackboards. An electronic magnifier, a camera and a screen, can magnify from 2 to some 50 times, with contrast and colour changed at will.

### Not only size
Magnification narrows the field: ×5 shows a fifth of the angular view. A person with a restricted field ([[glaucoma-and-the-visual-field]]) may need the opposite, minification, or training in scanning. A person with a central scotoma ([[macular-degeneration-and-retinal-disease]]) learns **eccentric viewing**, using a retina off the fovea, whose acuity is lower, so that more magnification is needed. Contrast, lighting and glare matter as much as size ([[cataract]], [[contrast-sensitivity]]).

> [!warn] A sudden drop in sight, new distortion, flashes of light or a curtain over the view is not low vision to be lived with; it can be an emergency. Seek urgent eye care.

> [!key] The magnification needed is the ratio of the smallest letter the eye can read to the size of the print, and about twice that gives comfortable reading. It can be had by size, distance, a lens, a telescope or a screen, each at its own price in field and working distance.
`,
  ideas: [
    'Low vision is sight not correctable to normal that interferes with daily tasks; the WHO categories run from mild (worse than 20/40) to blindness (worse than 20/400).',
    'A letter must subtend 5′ × N/20 to be read at acuity 20/N; the magnification needed is the ratio of that to the print\'s own size.',
    'Comfortable reading needs about twice the magnification that makes print just legible.',
    'A magnifier of power D gives D/4 against 25 cm, or D/2.5 against 40 cm; Kestenbaum\'s rule gives the add as 1/acuity.',
    'Magnification narrows the field, and loss of the centre or of the periphery asks for different aids.'
  ],
  pitfalls: [
    'People with low vision see nothing, or only dark — Most have useful sight, often a good field with a poor centre or the reverse. The aim of magnification and light is to make the best use of it.',
    'Magnifiers restore normal sight — They enlarge the image on the retina; the retina and the brain still see what they could see. Print becomes readable, but the eye is no better.',
    'The strongest magnifier is the best — Power buys size at the price of a small field and a close working distance: the lens must be held at its focal length, 4 cm for 25 D. The smallest power that makes the task comfortable is the right one.',
    'Halving the distance doubles the size, so the page can simply be held nearer — It does, if the eye can focus: an older eye cannot, and a plus lens must make up what accommodation lacks.'
  ],
  terms: [
    { term: 'Low vision', also: ['visual impairment', 'partial sight'], def: 'Reduced sight that cannot be corrected to normal by lenses, medicine or surgery and that limits daily activity.' },
    { term: 'Legal blindness', def: 'A legal definition, in the United States, of acuity of 20/200 or worse in the better eye with correction, or a field of 20° or less; many people so classed still have some sight.' },
    { term: 'Magnification needed', def: 'The factor by which print or an object must be enlarged, in angle, to be as readable as the smallest letter the person can recognize: the ratio of the two letter sizes.' },
    { term: 'Relative-distance magnification', def: 'The gain in angular size from bringing an object nearer: halving the distance doubles the size, but needs the eye or a plus lens to focus at the shorter distance.' },
    { term: 'Kestenbaum\'s rule', def: 'A rule of thumb for the reading addition of a person with low vision: the reciprocal of the decimal acuity, in dioptres.' },
    { term: 'Eccentric viewing', also: ['preferred retinal locus'], def: 'Looking slightly to one side so that the image falls on a healthy part of the retina outside a central scotoma.' }
  ],
  formulas: [
    {
      name: 'Magnification needed',
      expr: 'Mneed = Nv/Np', tex: 'M = \\frac{N_v}{N_p}',
      vars: {
        Mneed: { name: 'magnification needed', tex: 'M' },
        Nv: { name: 'Snellen denominator of the person (20/N)', value: 100, min: 20, max: 800, tex: 'N_v' },
        Np: { name: 'Snellen denominator of the size of the print', value: 62, min: 10, max: 400, tex: 'N_p' }
      },
      solveFor: 'Mneed',
      note: 'The magnification at which the print is just legible; about twice that is comfortable for reading. The size of print is the 20/N letter that subtends the same angle.',
      stories: { Mneed: 'A person has an acuity of 20/{Nv}. The print they want to read is as large as a 20/{Np} letter. What magnification makes it just legible?' }
    },
    {
      name: 'Magnifier against a reference distance',
      expr: 'M = D*d0', tex: 'M = D\\,d_0',
      vars: {
        M: { name: 'angular magnification', tex: 'M' },
        D: { name: 'power of the magnifier', q: 'optpower', unit: 'D', value: 20, min: 1, max: 80, tex: 'D' },
        d0: { name: 'reference viewing distance', q: 'length', unit: 'cm', value: 25, min: 10, max: 100, tex: 'd_0' }
      },
      solveFor: 'M',
      note: 'For an object at the focal point of the magnifier, the angle is the object\'s size divided by the focal length, 1/D. With d₀ = 25 cm this is the usual M = D/4.',
      stories: { M: 'A magnifier of {D} is used with the object at its focal point. What is the magnification against {d0}?' }
    },
    {
      name: 'Reading addition by Kestenbaum\'s rule',
      expr: 'Add = N/20', tex: '\\mathrm{Add} = \\frac{N}{20}',
      vars: {
        Add: { name: 'reading addition', q: 'optpower', unit: 'D', tex: '\\mathrm{Add}' },
        N: { name: 'Snellen denominator of the person (20/N)', value: 100, min: 20, max: 800, tex: 'N' }
      },
      solveFor: 'Add',
      note: 'A rule of thumb: the reciprocal of the decimal acuity. The page is held at the focal length, 1/Add.',
      stories: { Add: 'A person has an acuity of 20/{N}. What addition does Kestenbaum\'s rule give?' }
    }
  ],
  examples: [{
    title: 'Newspaper print at 20/100',
    q: 'A person with 20/100 acuity wants to read newspaper print with capital letters 1.8 mm high, at 40 cm. What magnification gives comfortable reading, and what hand magnifier would supply it?',
    steps: [
      { text: 'The letters subtend:', tex: '\\arctan\\!\\left(\\frac{1.8}{400}\\right) = 15.5^\\prime \\;\\; (\\text{a 20/62 letter})' },
      { text: 'The smallest letter this eye reads is 20/100, which is 25′. Just legible needs:', tex: 'M = \\frac{25}{15.5} = 1.6' },
      { text: 'Comfortable reading needs about twice that, 3.2. A magnifier gives M = D d₀ against 40 cm:', tex: 'D = \\frac{3.2}{0.40\\ \\text{m}} = 8\\ \\text{D}' }
    ],
    a: 'About ×3 for comfort, supplied by a hand magnifier of about 8 D (focal length 12.5 cm), with the page at that distance.'
  }],
  quiz: [
    { q: 'A person with 20/200 acuity wants to read print as large as a 20/50 letter. What magnification makes it just legible?', answer: 4, why: 'M = 200/50 = 4: the print must be enlarged by the ratio of the denominators.' },
    { q: 'A magnifier of 20 D is used at its focal length. What is its magnification against the conventional reference distance of 25 cm?', answer: 5, why: 'M = D/4 = 20/4 = 5 against a reference of 25 cm. Its focal length is 5 cm.' },
    { q: 'Halving the distance to a page doubles the size of its image on the retina.', a: true, why: 'The angle subtended is inversely proportional to the distance. The eye must be able to focus at the shorter distance, which a plus lens can provide.' },
    { q: 'By Kestenbaum\'s rule, a person with 20/100 acuity has a reading addition of about how many dioptres?', answer: 5, unit: 'D', why: 'The addition is the reciprocal of the decimal acuity: 1/0.2 = 5 D, with the page at 1/5 m = 20 cm.' },
    { q: 'Why not always choose the strongest magnifier?', choices: ['It costs more', 'It has a small field and a very short working distance', 'It makes the print fainter', 'It tires the retina'], a: 1, why: 'The magnifier must be held at its focal length, so a strong lens means a few centimetres between lens and page and a small field of view.' }
  ],
  applications: [
    'Low-vision clinics, where acuity, field and contrast are measured and the aid is matched to the task.',
    'Large-print books, high-contrast signs and the zoom and contrast settings of phones and computers.',
    'Telescopic spectacles and handheld monoculars for signs, television and the blackboard.',
    'Electronic magnifiers and screen readers, which magnify, reverse the contrast and change colour.'
  ],
  history: 'Magnifying lenses were used for reading from the late thirteenth century. The rule of thumb of Alfred Kestenbaum dates from the 1940s, and the first closed-circuit television magnifiers for low vision appeared in the late 1960s.',
  sources: [
    'World Health Organization, *International Classification of Diseases, 11th revision* — categories of visual impairment; and *World report on vision* (2019).',
    'A. Colenbrander, *Visual Standards: Aspects and Ranges of Vision Loss* (International Council of Ophthalmology, 2002).',
    'E. Hecht, *Optics* — the simple magnifier and angular magnification.'
  ],
  sim: 're-lowvision'
}
);
