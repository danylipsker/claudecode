/* HYPER-OPTICS · content/spectacles-and-contact-lenses.js — the topic "Spectacles and contact lenses" (parent: eye-and-vision)
 * how a lens in front of the eye corrects it; reading a prescription; vertex distance; cylinder, axis and transposition; prism;
 * lens materials; bifocals, trifocals and progressive lenses; occupational lenses; coatings, tints, photochromic and polarized
 * lenses; contact lenses; intraocular lenses and refractive surgery; fitting and the lensmeter.
 * These pages explain how each kind of lens works and what it corrects. They are not a prescription and give no advice about any
 * person's eyes: that belongs to an eye-care practitioner.
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'how-spectacle-lenses-correct-vision', parent: 'spectacles-and-contact-lenses', title: 'How a spectacle lens corrects the eye', level: 1,
  short: 'A spectacle lens does not change the eye; it changes the light on its way in. A lens for distance puts the image of a faraway object at the eye\'s far point, and the eye\'s own optics do the rest. Minus lenses diverge light for a too-long eye, plus lenses converge it for a too-short one.',
  keywords: ['spectacles', 'glasses', 'eyeglasses', 'correcting lens', 'far point', 'minus lens', 'plus lens', 'diverging lens', 'converging lens', 'meniscus', 'base curve', 'front curve', 'refractive error', 'ametropia', 'short sight', 'long sight', 'myopia', 'hyperopia', 'back vertex power'],
  prereq: ['the-eye-as-a-camera', 'emmetropia-and-refractive-error', 'focal-length-and-optical-power', 'real-and-virtual-images'],
  related: ['myopia', 'hyperopia', 'accommodation', 'vertex-distance-and-effective-power', 'reading-a-prescription', 'lens-shapes-and-names', 'lensmakers-formula', 'physics:vision-correction'],
  body: `
A short-sighted eye brings the light of a distant star to a point *in front of* the retina; a long-sighted eye brings it to a point *behind* it. Either way the star is a smear. A spectacle lens does not alter the eye. It alters the light before it enters, so that the eye's own optics, unchanged, bring the focus onto the retina.

### The far point
Every eye at rest has a **far point**: the farthest object it can see sharply without effort. For an eye with no refractive error (see [[emmetropia-and-refractive-error]]) it lies at infinity. For a short-sighted eye it is nearer: an eye of −3 D has a far point at 1/3 m, 33 cm, and everything beyond that is blurred. The lens for distance has one job: it takes an object at infinity and puts an **image** of it at the eye's far point. The eye then looks at that image as if it were the real thing and sees it sharp.

### Minus and plus
- A **minus (diverging) lens** spreads parallel rays so that they seem to come from a point in front of the lens, a virtual image ([[real-and-virtual-images]]). A lens whose focal length equals the far-point distance does exactly that: for a −3 D eye, a lens of focal length −33 cm. This is the lens of [[myopia|short sight]].
- A **plus (converging) lens** makes parallel rays converge. A long-sighted eye has its far point *behind* it, so the light must arrive already converging a little; the plus lens supplies it, and the eye adds the rest ([[hyperopia]]). A young eye can supply some of that extra effort itself by [[accommodation]].

The lens sits about 12 mm in front of the cornea, not on it, so the exact power differs slightly from the eye's error ([[vertex-distance-and-effective-power]]). Lenses are made in steps of 0.25 D, and the nearest step is what is ordered.

| Eye (far point) | Where the far point is | Lens 12 mm in front | To the nearest 0.25 D |
|---|---|---|---|
| −1 D | 1 m in front | −1.01 D | −1.00 D |
| −3 D | 33 cm in front | −3.11 D | −3.00 D |
| −6 D | 17 cm in front | −6.47 D | −6.50 D |
| −10 D | 10 cm in front | −11.36 D | −11.25 D |
| +2 D | 50 cm behind | +1.95 D | +2.00 D |
| +5 D | 20 cm behind | +4.72 D | +4.75 D |

### One power, many forms
The power of a thin lens is the sum of the powers of its two surfaces, $F = F_1 + F_2$, and the sum can be reached in many ways. A −6 D lens may have a front surface of +4 D and a back surface of −10 D. The front surface power is called the **base curve**. Spectacle lenses are made as **menisci**, convex in front and concave behind, like a watch glass, because the eye turns behind the lens: when the wearer looks to one side the light crosses the lens obliquely, and for each power there is a front curve for which the blur from that oblique crossing is smallest. A −6 D lens in a plastic of index 1.498 with a +4 D base curve has a front radius of 124.5 mm and a back radius of 49.7 mm; it is 1.5 mm thick at the centre and 4.1 mm thick 20 mm from it.

> [!warn] These pages explain how lenses work. They are not a prescription and do not replace an eye examination: a person's prescription is measured by an eye-care practitioner, and decisions about glasses, contact lenses or eye health belong with them.

> [!key] A distance lens makes a faraway object look as if it were at the eye's far point. The power is the same for any form of the lens; the form is chosen to keep the picture clear when the eye looks off to the side.
`,
  ideas: [
    'A spectacle lens changes the light entering the eye, not the eye: it puts the image of a distant object at the eye\'s far point.',
    'The far point of a short-sighted eye lies 1/|K| metres in front of it: 33 cm for −3 D.',
    'Minus lenses diverge light (virtual image), plus lenses converge it; the lens 12 mm from the eye needs a slightly different power from the eye\'s error: −3.00 D of error needs −3.11 D at 12 mm.',
    'The power of a lens is the sum of its two surfaces; the share given to the front surface (the base curve) sets its form without changing its power.',
    'Meniscus forms keep the oblique view through the lens clear as the eye turns behind it.'
  ],
  pitfalls: [
    'The lens corrects the eye by changing the eye — The eye stays as it is. The lens changes the vergence of the light entering it so that the eye\'s own power puts the focus on the retina; take it off and the error is back.',
    'A −6 D lens has two surfaces of −3 D each — Surface powers add, and any split is possible. A usual −6 D lens has a front surface of about +4 D and a back surface of about −10 D, the form chosen for clear oblique views.',
    'The lens focuses the light on the retina — The lens alone forms an image at the eye\'s far point (virtual for a minus lens). The retina is reached only after the cornea and the eye\'s own lens, which is why the eye\'s length and power both matter.',
    'A thicker lens is a stronger lens — Power comes from curvature and index, not from thickness. A strong minus lens is thin in the middle and thick at the edge, a plus lens the other way round; a high-index material makes the same power thinner.'
  ],
  terms: [
    { term: 'Far point', also: ['punctum remotum'], def: 'The farthest object that an eye, relaxed, sees sharply. At infinity for an eye with no refractive error; in front of a short-sighted eye; behind a long-sighted one (reached only with effort).' },
    { term: 'Refractive error', also: ['ametropia'], def: 'A mismatch between the power and the length of the eye, so that the image of a distant object does not fall on the retina when the eye is relaxed. Short sight, long sight and astigmatism are refractive errors.' },
    { term: 'Minus lens', also: ['negative lens', 'diverging lens', 'concave lens'], def: 'A lens with negative power, thinner in the middle than at the edge, that spreads parallel light so that it seems to come from a point in front of it. Used for short sight.' },
    { term: 'Plus lens', also: ['positive lens', 'converging lens', 'convex lens'], def: 'A lens with positive power, thicker in the middle than at the edge, that makes parallel light converge. Used for long sight and for reading additions.' },
    { term: 'Base curve', also: ['front curve', 'BC'], def: 'The power of the front surface of a spectacle lens, in dioptres. It sets the lens\'s form (flatter or more curved) without changing its total power; the back surface supplies the rest.' },
    { term: 'Meniscus lens', def: 'A lens whose two surfaces curve the same way, convex in front and concave behind, like a watch glass. All spectacle lenses of ordinary strength have this form.' },
    { term: 'Back vertex power', also: ['BVP', 'vertex power'], def: 'The power by which a spectacle lens is specified: the reciprocal of the distance from the back surface of the lens to the point where parallel light is brought to a focus, in dioptres.' }
  ],
  formulas: [
    {
      name: 'Lens that puts the image at the far point',
      expr: 'F = -1/(s - d)', tex: 'F = -\\frac{1}{s - d}',
      vars: {
        F: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', signed: true },
        s: { name: 'distance of the far point from the cornea', q: 'length', unit: 'cm', value: 33.3, min: 5, max: 500 },
        d: { name: 'distance from the lens to the cornea', q: 'length', unit: 'mm', value: 12, min: 0, max: 30 }
      },
      solveFor: 'F',
      note: 'For short sight (a far point in front of the eye). With d = 0 this is the contact lens, F = −1/s.',
      stories: {
        F: 'A person sees sharply out to {s} from the eye and no farther. What power must a spectacle lens {d} in front of the cornea have to make a distant object clear?',
        s: 'A −4.00 D lens worn {d} in front of the cornea makes a distant object clear. How far from the eye is the far point?'
      }
    },
    {
      name: 'The two surfaces of a thin lens',
      expr: 'P = (n - 1)*(1/R1 - 1/R2)', tex: 'P = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
      vars: {
        P: { name: 'power of the lens', q: 'optpower', unit: 'D', signed: true },
        n: { name: 'refractive index of the lens', value: 1.498, min: 1.3, max: 2 },
        R1: { name: 'radius of the front surface', q: 'length', unit: 'mm', value: 124.5, signed: true, tex: 'R_1' },
        R2: { name: 'radius of the back surface', q: 'length', unit: 'mm', value: 49.7, signed: true, tex: 'R_2' }
      },
      solveFor: 'P',
      note: 'Light left to right; a radius is positive when its centre of curvature lies to the right. A meniscus has both radii positive.'
    },
    {
      name: 'Blur from a wrong power',
      expr: 'b = Er*p', tex: 'b = \\Delta P\\,p',
      vars: {
        b: { name: 'angular diameter of the blur patch', q: 'angle', unit: '′' },
        Er: { name: 'error in the power reaching the eye', q: 'optpower', unit: 'D', value: 1, tex: '\\Delta P' },
        p: { name: 'diameter of the pupil', q: 'length', unit: 'mm', value: 4 }
      },
      solveFor: 'b',
      note: 'Geometrical blur of a point; the error is the difference between the power the eye needs and the power it gets.'
    }
  ],
  examples: [
    {
      title: 'A lens for a −4 D eye',
      q: 'An eye has a refractive state of −4.00 D. What spectacle power at 12 mm in front of the cornea puts the image of a distant object at its far point, and what step would be ordered?',
      steps: [
        'The far point is $1/4$ m = 250 mm in front of the cornea, so it is 250 − 12 = 238 mm in front of the lens.',
        { text: 'A diverging lens must have that focal length:', tex: 'F = -\\frac{1}{0.238\\ \\mathrm{m}} = -4.20\\ \\mathrm{D}' },
        'Lenses come in 0.25 D steps, so the nearest is −4.25 D.'
      ],
      a: '−4.20 D exactly; −4.25 D as the nearest step.'
    },
    {
      title: 'The wrong lens',
      q: 'A person whose eye is −3.00 D wears a −2.00 D lens 12 mm from the cornea. By how much is the eye out of focus, and how wide is the blur of a point for a 4 mm pupil?',
      steps: [
        { text: 'The vergence the lens delivers at the cornea:', tex: 'F_e = \\frac{-2.00}{1 + 0.012 \\times 2.00} = -1.95\\ \\mathrm{D}' },
        'The eye needs −3.00 D, so it is short by $3.00 - 1.95 = 1.05$ D.',
        { text: 'The blur patch, angle = error × pupil:', tex: 'b = 1.05\\ \\mathrm{m^{-1}} \\times 0.004\\ \\mathrm{m} = 4.2\\ \\mathrm{mrad} \\approx 14\\ \\text{arc-minutes}' }
      ],
      a: 'About 1.05 D out of focus; a point of light is spread over roughly 14 arc-minutes, much larger than the eye\'s one arc-minute of resolution.'
    }
  ],
  quiz: [
    { q: 'An eye sees sharply out to 50 cm and no farther. Which lens, worn on the cornea, makes distant objects clear?', choices: ['+2.00 D', '−2.00 D', '−0.50 D', '+0.50 D'], a: 1, why: 'The lens must make parallel rays seem to come from the far point, 0.5 m in front: a diverging lens of focal length −0.5 m, that is −1/0.5 = −2.00 D.' },
    { q: 'A spectacle lens changes the length or the shape of the eye wearing it.', a: false, why: 'It changes only the light entering. The eye\'s power and length are as they were; the lens makes the light arrive with the vergence the eye needs.' },
    { q: 'An eye of −3.00 D needs, at 12 mm in front of the cornea, a lens of about…', choices: ['−2.89 D', '−3.00 D exactly', '−3.11 D', '−3.36 D'], a: 2, why: 'The far point is 333 mm from the cornea, 321 mm from the lens, so $F = -1/0.321 = -3.11$ D. A lens that sits farther from the eye must be a little stronger.' },
    { q: 'A thin −6.00 D lens has a front surface of +4.00 D. What is the power of its back surface, in dioptres?', answer: -10, unit: 'D', why: 'Surface powers add: $F = F_1 + F_2$, so $F_2 = -6 - 4 = -10$ D. Both surfaces curve the same way, a meniscus.' },
    { q: 'Two lenses of the same power are made with different base curves. What differs?', choices: ['Where the focus falls', 'The form of the lens and its oblique-viewing quality', 'The size of the blur on the retina on axis', 'Nothing at all'], a: 1, why: 'The power sets the focus, whatever the split between the surfaces. The split changes the shape, the thickness at the edge, and how clear the picture stays when the eye looks off-axis.' }
  ],
  applications: [
    'Single-vision spectacles for distance or for reading: the lens form and the front curve are chosen from the blank\'s catalogue.',
    'Contact lenses, which do the same job from the cornea and so need a slightly different power ([[vertex-distance-and-effective-power]]).',
    'The dioptre adjustment ring of binoculars, microscopes and camera viewfinders, which slides a virtual image to the viewer\'s own far point by a few dioptres.',
    'Sunglasses and safety glasses made to a prescription, which use the same forms and the same arithmetic.'
  ],
  history: 'Reading glasses with convex lenses appeared in northern Italy in the late thirteenth century; concave lenses for short sight came about two hundred years later. A meniscus form for spectacles was introduced in the early 1800s. The dioptre, the reciprocal of the focal length in metres, was proposed in the 1870s and in time replaced the inch-based lens numbers.',
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the chapters on spectacle lens forms and on the correction of ametropia.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the correction of refractive errors by spectacle lenses.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — thin lenses, far points and the effectivity of spectacle lenses.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the definitions of back vertex power, base curve and related terms.'
  ],
  sim: 'sp-correction'
},

/* ================================================================ 2 */
{
  id: 'reading-a-prescription', parent: 'spectacles-and-contact-lenses', title: 'Reading a prescription', level: 1,
  short: 'A spectacle prescription is a short recipe for each eye: sphere, cylinder, axis, addition, perhaps prism, and the distance between the pupils. Each column answers one question, and together they describe the lens as a power in every direction.',
  keywords: ['prescription', 'Rx', 'OD', 'OS', 'OU', 'SPH', 'CYL', 'AXIS', 'ADD', 'PRISM', 'BASE', 'PD', 'pupillary distance', 'sphere', 'cylinder', 'addition', 'DS', 'plano', 'spectacle prescription', 'optician'],
  prereq: ['how-spectacle-lenses-correct-vision', 'focal-length-and-optical-power', 'cylindrical-and-toric-lenses'],
  related: ['cylinder-axis-and-transposition', 'vertex-distance-and-effective-power', 'prism-in-spectacles', 'progressive-lenses', 'fitting-measurements-and-the-lensmeter', 'astigmatism-of-the-eye', 'presbyopia', 'the-phoropter-and-subjective-refraction'],
  body: `
A prescription is a recipe for a pair of lenses: a handful of numbers per eye, in a fixed order, in a shorthand that has changed little in a century. It looks cryptic until you see that every column answers one question.

### The row for each eye
**OD** is the right eye (*oculus dexter*), **OS** the left (*oculus sinister*) and **OU** both; **RE** and **LE** mean the same. The right eye is listed first.

| Column | What it says | Notes |
|---|---|---|
| **SPH** (sphere) | the overall power in dioptres: minus for short sight, plus for long sight | steps of 0.25 D; *plano* or *PL* means none |
| **CYL** (cylinder) | extra power across one direction, for astigmatism | steps of 0.25 D; blank or *DS* (dioptre sphere) means none |
| **AXIS** | the direction of the cylinder, in whole degrees from 1 to 180 | 90 is vertical, 180 horizontal; never written 0 |
| **ADD** (addition) | the extra power for near, low in a bifocal or progressive lens | typically +0.75 D around age 40, rising to about +2.50 D in the sixties |
| **PRISM, BASE** | a prism in prism dioptres (Δ) and the direction of its base | BU up, BD down, BI towards the nose, BO towards the ear |
| **PD** | distance between the pupils, in millimetres | one number, or one per eye from the middle of the nose; adults mostly 54–74 mm |

### A decoded example
> OD −2.00 −1.50 × 090 ADD +2.00 &nbsp;·&nbsp; OS −1.75 −1.00 × 085 ADD +2.00 &nbsp;·&nbsp; PD 63

The right-eye lens has a sphere of −2.00 D. Its cylinder of −1.50 D has its axis at 90°, vertical: along the vertical line the power is just −2.00 D, while across it, in the horizontal direction, the power is −2.00 + (−1.50) = −3.50 D. For reading, the addition of +2.00 D is added to both: 0.00 D along the axis and −1.50 D across it. The same lens could be written **−3.50 +1.50 × 180** in plus-cylinder form ([[cylinder-axis-and-transposition]]).

### The axis scale
The axis is measured on a standard scale (the TABO scale) as the wearer's lens is *seen from the front*: counter-clockwise from the horizontal. Horizontal is 180 (or 0), vertical 90, and 45 is a line rising to the right. The axis gives a direction only; the *strength* of the astigmatism is the cylinder.

### What a prescription does not say
It states the power of the lens where it is worn, usually about 12–14 mm from the eye, so a contact-lens prescription is a different document ([[vertex-distance-and-effective-power]], [[contact-lenses]]). The fitting measurements, the lens material and the frame are chosen separately ([[fitting-measurements-and-the-lensmeter]]). A prescription is dated and has a validity set by local rules.

> [!warn] This page teaches how to read the shorthand. It does not tell anyone what their prescription should be, or whether to change it; that is measured by an eye-care practitioner after an examination.

> [!key] Each eye is a sphere, plus a cylinder along an axis, plus an addition for near. Sphere and cylinder are powers in dioptres; the axis is only a direction in degrees.
`,
  ideas: [
    'OD is the right eye, OS the left; each eye is written as SPH, CYL × AXIS, and ADD for near.',
    'The sphere is the power along the cylinder\'s axis; across the axis the power is sphere + cylinder.',
    'The axis is a direction (1–180°), not a strength; the cylinder is the strength.',
    'The reading power is the distance power plus the addition, in each direction.',
    'PD is the distance between the pupils in millimetres; it positions the optical centres in the frame.'
  ],
  pitfalls: [
    'OD is the left eye because it sounds like "left" — OD is *oculus dexter*, the right eye; OS (*sinister*) is the left. Mnemonic: D for dexter, right-handed.',
    'A bigger axis number means a stronger astigmatism — The axis is only an angle. The strength is the CYL value; an axis of 180 is as likely as one of 5.',
    'The ADD is the whole reading prescription — It is extra power added to the distance power in each eye. A +1.00 sphere with +2.00 ADD reads at +3.00 D.',
    'A spectacle prescription can be ordered as it stands for contact lenses — Contact-lens powers are converted for the vertex distance, and the base curve and diameter are added; beyond about ±4 D the numbers differ appreciably.'
  ],
  terms: [
    { term: 'OD, OS, OU', also: ['RE', 'LE', 'oculus dexter', 'oculus sinister'], def: 'Right eye, left eye and both eyes, from the Latin. The right eye is written first.' },
    { term: 'Sphere', also: ['SPH', 'DS', 'plano'], def: 'The power of the lens that is the same in every direction, in dioptres: minus to diverge light (short sight), plus to converge it (long sight). Plano or DS means no spherical power or a spherical lens alone.' },
    { term: 'Cylinder', also: ['CYL', 'DC'], def: 'The extra power that a lens has in one direction (across its axis) and not at right angles to it, which corrects astigmatism of the eye. Written in dioptres, in steps of 0.25 D.' },
    { term: 'Axis', also: ['AXIS', 'TABO scale'], def: 'The direction of the cylinder, in whole degrees from 1 to 180, measured counter-clockwise from the horizontal as the lens is seen from the front. It says where the power does not change, not how strong the astigmatism is.' },
    { term: 'Addition', also: ['ADD', 'near addition', 'reading add'], def: 'The extra power of the near part of a bifocal or progressive lens, in dioptres, added to the distance power to give the power for reading.' },
    { term: 'Prism and base', also: ['Δ', 'BU', 'BD', 'BI', 'BO'], def: 'A prescribed deviation of the line of sight, in prism dioptres, with the direction of the thick edge of the prism: base up, down, in (towards the nose) or out.' },
    { term: 'Pupillary distance', also: ['PD', 'IPD', 'monocular PD'], def: 'The distance between the centres of the pupils, in millimetres, used to place the optical centres of the lenses in front of the eyes. Monocular PDs give the distance from the middle of the nose to each pupil.' }
  ],
  formulas: [
    {
      name: 'Power along a direction',
      expr: 'P = S + C*sin(a - ax)^2', tex: 'P = S + C\\sin^2(\\alpha - \\alpha_0)',
      vars: {
        P: { name: 'power in the chosen direction', q: 'optpower', unit: 'D', signed: true },
        S: { name: 'sphere', q: 'optpower', unit: 'D', value: -2, signed: true },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -1.5, signed: true },
        a: { name: 'direction examined', q: 'angle', unit: '°', value: 180, min: 0, max: 180, tex: '\\alpha' },
        ax: { name: 'axis of the cylinder', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\alpha_0' }
      },
      solveFor: 'P',
      note: 'Along the axis the power is the sphere; at right angles to it, sphere + cylinder. The cylinder is written in its minus or plus form.',
      stories: { P: 'A lens is {S} sphere with {C} cylinder, axis {ax}. What is its power along the {a} direction?' }
    },
    {
      name: 'Reading power',
      expr: 'N = D + A', tex: 'P_{\\text{near}} = P_{\\text{dist}} + A',
      vars: {
        N: { name: 'power for reading, in one direction', q: 'optpower', unit: 'D', signed: true, tex: 'P_{\\text{near}}' },
        D: { name: 'distance power in the same direction', q: 'optpower', unit: 'D', value: 1, signed: true, tex: 'P_{\\text{dist}}' },
        A: { name: 'addition', q: 'optpower', unit: 'D', value: 2, tex: 'A' }
      },
      solveFor: 'N',
      note: 'Applies to sphere and to each principal meridian alike: the addition is the same in every direction.'
    }
  ],
  examples: [
    {
      title: 'Reading a slip',
      q: 'A slip reads: OD +1.50 −0.75 × 175, ADD +2.00. What is the power of the right-eye lens along its axis, across it, and for reading?',
      steps: [
        'The sphere is +1.50 D; the cylinder −0.75 D has its axis at 175°, nearly horizontal.',
        'Along 175° the power is the sphere: +1.50 D. Across it, at 85°, nearly vertical: $+1.50 + (-0.75) = +0.75$ D.',
        'For reading add +2.00 D to each: +3.50 D along the axis and +2.75 D across it.'
      ],
      a: '+1.50 D along the axis, +0.75 D across it; +3.50 D and +2.75 D for reading.'
    },
    {
      title: 'The same lens, two ways',
      q: 'Write OS −1.75 −1.00 × 085 in plus-cylinder form and give the powers of its two principal directions.',
      steps: [
        'Add the cylinder to the sphere: $-1.75 + (-1.00) = -2.75$; change the sign of the cylinder, +1.00; turn the axis by 90°, from 85° to 175°.',
        'The plus form is −2.75 +1.00 × 175; the powers are −1.75 D along 85° and −2.75 D along 175°.'
      ],
      a: '−2.75 +1.00 × 175: the same two principal powers, −1.75 D and −2.75 D.'
    }
  ],
  quiz: [
    { q: 'In a prescription, OS refers to…', choices: ['the right eye', 'the left eye', 'both eyes', 'the near addition'], a: 1, why: 'OS is *oculus sinister*, the left eye. The right eye is OD, *oculus dexter*, and OU is both.' },
    { q: 'A cylinder has its axis at 90°. Along which direction is the power just the sphere?', choices: ['Horizontal', 'Vertical', 'Both', 'Neither'], a: 1, why: 'Along the axis there is no cylinder power; the axis at 90° is the vertical line. Across it, in the horizontal direction, sphere and cylinder add.' },
    { q: 'The AXIS value says how strong the astigmatism is.', a: false, why: 'The axis is only a direction in degrees. The strength of the astigmatism is the cylinder, in dioptres.' },
    { q: 'A prescription has SPH +1.00 and ADD +2.50, no cylinder. What is the power for reading, in dioptres?', answer: 3.5, unit: 'D', why: 'The addition is added to the distance power: $+1.00 + 2.50 = +3.50$ D.' },
    { q: 'Written OD −2.00 −1.00 × 180, the right-eye lens has the power of −3.00 D along…', choices: ['the horizontal direction', 'the vertical direction', 'every direction', 'a direction at 45°'], a: 1, why: 'The axis is horizontal (180°), so along the horizontal the power is the sphere, −2.00 D; across it, vertically, it is −2.00 − 1.00 = −3.00 D.' }
  ],
  applications: [
    'The slip handed over after an eye examination, and the order a laboratory receives to make a pair of lenses.',
    'Checking a finished pair on a lensmeter against the prescription ([[fitting-measurements-and-the-lensmeter]]).',
    'Comparing a prescription written in minus-cylinder form with one in plus-cylinder form ([[cylinder-axis-and-transposition]]).',
    'Choosing a lens design: the size of the addition and the PD decide which progressive or bifocal designs are possible ([[progressive-lenses]]).'
  ],
  history: 'George Airy, the Astronomer Royal, had a cylindrical spectacle lens made for his own astigmatism in 1825, the first recorded. The shorthand of sphere, cylinder and axis settled in the later nineteenth century with the dioptre.',
  sources: [
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — the notation of the prescription and the power of a sphero-cylindrical lens.',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — prescriptions, abbreviations and the axis scale.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the definitions of sphere, cylinder, axis, addition and prism.'
  ],
  sim: { id: 'sp-prescription', params: { case: 'astig' } }
},

/* ================================================================ 3 */
{
  id: 'vertex-distance-and-effective-power', parent: 'spectacles-and-contact-lenses', title: 'Vertex distance and effective power', level: 2,
  short: 'A lens does not have one power for the eye: the effect of a lens depends on how far it stands from it. Moving a strong lens from 12 mm in front of the cornea to the cornea itself changes its effective power, minus lenses becoming weaker and plus lenses stronger.',
  keywords: ['vertex distance', 'back vertex distance', 'BVD', 'effective power', 'effectivity', 'equivalent power', 'spectacle to contact lens', 'distometer', 'spectacle magnification', 'minification', 'conversion', 'strong prescription'],
  prereq: ['how-spectacle-lenses-correct-vision', 'reading-a-prescription', 'focal-length-and-optical-power'],
  related: ['contact-lenses', 'intraocular-lenses-and-refractive-surgery', 'fitting-measurements-and-the-lensmeter', 'cylinder-axis-and-transposition', 'myopia', 'hyperopia'],
  body: `
The power printed on a spectacle lens is the power of that lens *where it sits*, about 12 mm in front of the cornea. Put the same glass on the surface of the eye, as a contact lens, and it no longer does the same job. A lens power is about where a lens puts a focus, and a lens 12 mm nearer the eye needs its focus 12 mm nearer too.

### The effective power
A lens of power $F$ brings parallel light to a focus at a distance $1/F$. A −10 D lens has its virtual focus 100 mm in front of itself, which is 112 mm in front of the cornea. A contact lens that puts the focus at the same place needs a focal length of −112 mm, that is −8.93 D. With the lens a distance $d$ in front of the cornea the **effective power** at the cornea is

$$F_e = \\frac{F}{1 - dF}$$

and the **vertex distance** $d$ is measured from the *back surface of the lens* to the front of the cornea.

| Spectacle lens at 12 mm | Effective power at the cornea | Change |
|---|---|---|
| −10.00 D | −8.93 D | +1.07 D |
| −6.00 D | −5.60 D | +0.40 D |
| −4.00 D | −3.82 D | +0.18 D |
| −2.00 D | −1.95 D | +0.05 D |
| +2.00 D | +2.05 D | +0.05 D |
| +4.00 D | +4.20 D | +0.20 D |
| +6.00 D | +6.47 D | +0.47 D |
| +10.00 D | +11.36 D | +1.36 D |

### Which way and how much
- **Minus lenses get weaker, plus lenses stronger** as they move closer to the eye, and the reverse as they move away. Below about ±4 D the change is under a quarter of a dioptre, the usual step of a prescription, and can be ignored; at ±10 D it exceeds one dioptre.
- **Glasses that slip.** A −10 D lens moved from 12 to 16 mm falls from −8.93 D to −8.62 D at the eye, weaker by 0.31 D; a +8 D lens moved the same way rises from +8.85 D to +9.17 D.
- **Astigmatic lenses** are converted meridian by meridian. A lens of −6.00 −2.00 × 180 has principal powers −6.00 D and −8.00 D, which become −5.60 D and −7.30 D at the cornea: −5.60 −1.70 × 180. The cylinder shrinks too.

### Size of the picture
The same distance changes the size of the retinal image. A thin lens of power $F$ at distance $d$ gives a **spectacle magnification** of about $1/(1 - dF)$: 0.893 for −10 D, the world 10.7 % smaller than with the unaided eye, and 1.106 for +8 D, 10.6 % larger. A lens on the cornea changes the size far less, one of the reasons strong prescriptions can look different through contact lenses.

### Measuring it
The vertex distance is measured with a **distometer**, a small caliper held against the closed eyelid, or read from a picture. Frames differ in how near they sit: the shape of the nose, the pads, the **pantoscopic tilt** and the **wrap** of the frame all change it ([[fitting-measurements-and-the-lensmeter]]). A refraction done with a trial frame or phoropter is carried out at a known distance, usually in the range of 12–14 mm.

> [!warn] These pages explain how the numbers relate. They are not a conversion service for any person's lenses: contact lenses and glasses are specified by a practitioner, who also decides the design, the fit and the base curve ([[contact-lenses]]).

> [!key] Effective power is $F/(1 - dF)$. Moving a lens toward the eye makes minus lenses weaker and plus lenses stronger; below about ±4 D the effect is smaller than the step of a prescription.
`,
  ideas: [
    'The effect of a lens on the eye depends on its distance from the eye: effective power $F_e = F/(1 - dF)$.',
    'Moving a lens toward the eye weakens minus lenses and strengthens plus lenses.',
    'Below about ±4 D the change is less than 0.25 D; at ±10 D it is over 1 D.',
    'Astigmatic lenses are converted meridian by meridian; the cylinder changes too.',
    'The vertex distance is measured from the back of the lens to the front of the cornea.'
  ],
  pitfalls: [
    'The prescription is the same for glasses and for contact lenses — Only for weak lenses. At −10 D the glass at 12 mm corresponds to −8.93 D at the cornea, and the base curve and diameter are added for a contact lens.',
    'Moving a lens along the nose changes nothing in its power — The marked power is true at the distance it was measured; at ±8 D, a few millimetres of slip change the effective power by a third of a dioptre.',
    'The vertex distance runs from the pupil or the front of the lens — It runs from the back surface of the lens to the front of the cornea; the pupil is a few millimetres behind the cornea, and the front of the lens depends on its thickness.',
    'Strong plus lenses weaken when moved away from the eye — The opposite: a plus lens held away from the eye is effectively stronger, a minus lens effectively weaker.'
  ],
  terms: [
    { term: 'Vertex distance', also: ['BVD', 'back vertex distance'], def: 'The distance from the back surface of a spectacle lens to the front of the cornea, usually 12–14 mm. It fixes what a given lens does for the eye.' },
    { term: 'Effective power', also: ['effectivity', 'equivalent power', 'power at the eye'], def: 'The power a lens would need at the cornea to give the same focus as a lens at the vertex distance: $F/(1 - dF)$. It differs from the marked power for strong lenses.' },
    { term: 'Distometer', also: ['vertex distance gauge'], def: 'A small instrument held against the closed eyelid that reads the distance from it to the back of the spectacle lens.' },
    { term: 'Spectacle magnification', also: ['relative spectacle magnification'], def: 'The ratio of the size of the retinal image with the lens to that without it, for a lens at a given distance. A strong minus lens minifies, a strong plus lens magnifies.' }
  ],
  formulas: [
    {
      name: 'Effective power at the cornea',
      expr: 'Fe = F/(1 - d*F)', tex: 'F_e = \\frac{F}{1 - dF}',
      vars: {
        Fe: { name: 'effective power at the cornea', q: 'optpower', unit: 'D', signed: true, tex: 'F_e' },
        F: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', value: -10, signed: true },
        d: { name: 'vertex distance', q: 'length', unit: 'mm', value: 12, min: 0, max: 30 }
      },
      solveFor: 'Fe',
      note: 'A thin lens in air. With d = 0 the lens is at the cornea and Fe = F.',
      stories: {
        Fe: 'A spectacle lens of {F} is worn {d} from the cornea. What power at the cornea has the same effect?',
        F: 'A contact lens of {Fe} has the same effect as a spectacle lens {d} from the cornea. What is the spectacle power?'
      }
    },
    {
      name: 'Where the focus lies',
      expr: 'x = 1/F - d', tex: 'x = \\frac{1}{F} - d',
      vars: {
        x: { name: 'distance of the focus behind the cornea (negative: in front)', q: 'length', unit: 'mm', signed: true },
        F: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', value: -10, signed: true },
        d: { name: 'vertex distance', q: 'length', unit: 'mm', value: 12, min: 0, max: 30 }
      },
      solveFor: 'x',
      note: 'The focus of parallel light. For the eye to see clearly at infinity, it must lie at the eye\'s far point.'
    },
    {
      name: 'Spectacle magnification of a thin lens',
      expr: 'M = 1/(1 - d*F)', tex: 'M = \\frac{1}{1 - dF}',
      vars: {
        M: { name: 'size of the retinal image relative to the unaided eye' },
        F: { name: 'power of the lens', q: 'optpower', unit: 'D', value: -10, signed: true },
        d: { name: 'vertex distance', q: 'length', unit: 'mm', value: 12, min: 0, max: 30 }
      },
      solveFor: 'M',
      note: 'Power factor only. The thickness and front curve of a real lens add a shape factor.'
    }
  ],
  examples: [
    {
      title: 'A strong lens moved to the cornea',
      q: 'A spectacle lens of −10.00 D is worn 12 mm from the cornea. What power at the cornea does the same job?',
      steps: [
        { text: 'Apply the effective-power formula with $d = 0.012$ m:', tex: 'F_e = \\frac{-10.00}{1 - 0.012 \\times (-10.00)} = \\frac{-10.00}{1.12}' },
        'That is −8.93 D. The focus lies 100 mm in front of the lens, 112 mm from the cornea, and a lens at the cornea must have a focal length of −112 mm.'
      ],
      a: '−8.93 D at the cornea, about a dioptre weaker.'
    },
    {
      title: 'With a cylinder',
      q: 'Convert the spectacle lens −6.00 −2.00 × 180, worn 12 mm from the cornea, to the cornea.',
      steps: [
        'The principal powers are −6.00 D (along 180°) and −8.00 D (across it).',
        { text: 'Convert each:', tex: '\\frac{-6.00}{1 + 0.072} = -5.60\\ \\mathrm{D} \\qquad \\frac{-8.00}{1 + 0.096} = -7.30\\ \\mathrm{D}' },
        'The cylinder is the difference, $-7.30 - (-5.60) = -1.70$ D, with the axis unchanged.'
      ],
      a: '−5.60 −1.70 × 180, before any other change.'
    }
  ],
  quiz: [
    { q: 'A −8.00 D spectacle lens worn 12 mm from the cornea has the same effect at the cornea as about…', choices: ['−8.00 D', '−7.30 D', '−8.70 D', '−6.50 D'], a: 1, why: '$-8/(1 + 0.012 \\times 8) = -8/1.096 = -7.30$ D. Minus lenses become weaker on moving closer to the eye.' },
    { q: 'Moving a strong plus lens farther from the eye makes it effectively weaker.', a: false, why: 'A plus lens moved away from the eye becomes effectively stronger: $F_e = F/(1 - dF)$ grows with $d$ for $F > 0$. A minus lens becomes weaker.' },
    { q: 'Which of these spectacle powers changes least on moving to the cornea at 12 mm?', choices: ['−12.00 D', '+10.00 D', '+3.00 D', '−8.00 D'], a: 2, why: 'The change is roughly $0.012F^2$ dioptres: about 0.11 D at +3 D, but 0.7 D at −8 D, 1.4 D at +10 D and 1.5 D at −12 D.' },
    { q: 'A −5.00 D lens sits 12 mm from the cornea. What is its effective power at the cornea, in dioptres?', answer: -4.72, unit: 'D', why: '$-5/(1 + 0.012 \\times 5) = -5/1.06 = -4.72$ D.' },
    { q: 'Why does an optician measure the vertex distance for a strong prescription?', choices: ['Because the distance sets how much of the lens the eye sees', 'Because the effective power at the eye changes with it', 'Because the frame must be centred on the nose', 'Because it fixes the pupil size'], a: 1, why: 'For strong lenses a few millimetres of distance change the power the eye receives by a fraction of a dioptre; the measurement lets the lens be specified for the actual position.' }
  ],
  applications: [
    'Converting a spectacle prescription to a contact-lens power, and the reverse ([[contact-lenses]]).',
    'Frame fitting: pads and tilt are set to bring a strong lens to the vertex distance for which it was made.',
    'Planning corrections at the corneal plane, where vertex-corrected powers are used for the laser dose and for lens-implant power ([[intraocular-lenses-and-refractive-surgery]]).',
    'Reading why a person with a strong plus prescription may see the world bigger through glasses than through contact lenses.'
  ],
  sources: [
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — vertex distance, effectivity and spectacle magnification.',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the vertex-distance correction and its conversion tables.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — spectacle correction and the size of the retinal image.'
  ],
  sim: 'sp-vertex'
}
,

/* ================================================================ 4 */
{
  id: 'cylinder-axis-and-transposition', parent: 'spectacles-and-contact-lenses', title: 'Cylinder, axis and transposition', level: 2,
  short: 'A cylinder lens has power in one direction and none at right angles to it. A sphero-cylindrical lens is a sphere plus a cylinder along an axis, and the same lens can be written with a minus or a plus cylinder. Transposition converts one form to the other without changing the lens.',
  keywords: ['cylinder', 'axis', 'transposition', 'transpose', 'plus cylinder', 'minus cylinder', 'power cross', 'meridian', 'sphero-cylindrical', 'toric', 'spherical equivalent', 'mean sphere', 'power vector', 'J0', 'J45', 'astigmatism correction'],
  prereq: ['reading-a-prescription', 'cylindrical-and-toric-lenses', 'astigmatism-of-the-eye'],
  related: ['how-spectacle-lenses-correct-vision', 'astigmatism-of-lenses', 'the-phoropter-and-subjective-refraction', 'keratometry-and-corneal-topography', 'contact-lenses', 'vertex-distance-and-effective-power'],
  body: `
A **cylinder lens** is curved like the side of a drinking glass: it has power across its axis and none along it. Where a sphere brings parallel light to a *point*, a cylinder brings it to a *line*, parallel to the axis. A lens for an astigmatic eye must have different powers in different directions; the simplest way to build that is a sphere with a cylinder added, a **sphero-cylindrical** or **toric** lens.

### The power cross
Take the right-eye lens of the last page, −2.00 −1.50 × 090. The sphere gives −2.00 D in every direction. The cylinder adds −1.50 D *across* its axis, which is vertical, so in the horizontal direction the power is −3.50 D. Those two numbers, at right angles, are the **power cross**. In any other direction the power lies between them, following a square-sine law:

$$P(\\alpha) = S + C \\sin^2(\\alpha - \\alpha_0)$$

where $S$ is the sphere, $C$ the cylinder and $\\alpha_0$ its axis. Half-way, 45° from the axis, the power is $S + C/2$: here −2.75 D.

### Transposition
The same lens can be written with a plus cylinder. The rule has three steps:
1. add the cylinder to the sphere: the new sphere is $S + C$;
2. change the sign of the cylinder;
3. turn the axis by 90°.

So −2.00 −1.50 × 090 becomes **−3.50 +1.50 × 180**: sphere −3.50 D along the horizontal axis, and +1.50 D more across it, vertically, giving −2.00 D. The powers in every direction are unchanged. Opticians and most optometrists write minus cylinders, many ophthalmologists plus cylinders, and a laboratory may convert whichever way suits its machines.

### Averages, equivalents and vectors
- The **spherical equivalent** $M = S + C/2$ is the sphere that blurs about as much as the astigmatic lens; it is −2.75 D here and is the same in both forms.
- Axes live on a circle that repeats every 180°, so 175° and 5° are 10° apart, not 170°; averaging axes as numbers fails. The cure is the **power vector** $(M, J_0, J_{45})$, with $J_0 = -\\tfrac{C}{2}\\cos 2\\alpha_0$ and $J_{45} = -\\tfrac{C}{2}\\sin 2\\alpha_0$, which can be added and averaged like any three numbers. Here $J_0 = -0.75$ D, $J_{45} = 0$.
- Two plus cylinders of equal power with axes at right angles make a sphere: +2.00 × 090 with +2.00 × 180 is +2.00 D in every direction.

### What it is made of
The cylinder is ground into one surface of the lens, which then has two curvatures, like a section of a doughnut: a **toric surface**. Modern lenses commonly carry it on the back surface, which is why they are usually specified in minus form.

> [!warn] The page explains the notation. The sphere, the cylinder and the axis for any person come from an eye examination; changing a number on a prescription changes the lens and what the eye sees.

> [!key] Power along a direction is $S + C\\sin^2(\\alpha - \\alpha_0)$. Transposition adds the cylinder to the sphere, flips its sign and turns the axis by 90°; both forms are the same lens.
`,
  ideas: [
    'A cylinder has power only across its axis; a sphero-cylindrical lens is a sphere plus a cylinder.',
    'The power in direction α is S + C sin²(α − axis); the power cross lists the two extremes.',
    'Transposition: add the cylinder to the sphere, change the cylinder\'s sign, turn the axis by 90°. The lens does not change.',
    'The spherical equivalent S + C/2 is the same in both forms.',
    'Axes repeat every 180°, so averages of prescriptions use the power vector (M, J0, J45), not the axis.'
  ],
  pitfalls: [
    'A plus-cylinder and a minus-cylinder prescription are two different lenses — They are the same lens written two ways. Transposition shows it: −2.00 −1.50 × 090 equals −3.50 +1.50 × 180, with the same power in every direction.',
    'The axis is where the cylinder has its power — It is the opposite: power acts across the axis, and along the axis there is none. A cylinder with the axis at 90° (vertical) changes the horizontal focus.',
    'The cylinder on a prescription is the astigmatism of the eye — It is the cylinder of the lens that compensates the astigmatism of the whole eye, which comes from the cornea and from the lens inside the eye together. It is not the corneal reading, and converting the lens to another distance from the eye changes it slightly.',
    'The average of the axes is the axis of the average — Axes wrap every 180°: 5° and 175° are 10° apart, so their mean is 0° (180°), not 90°. Use power vectors to average.'
  ],
  terms: [
    { term: 'Power cross', def: 'The two principal powers of a sphero-cylindrical lens written at right angles to each other: the sphere along the axis, sphere plus cylinder across it.' },
    { term: 'Meridian', def: 'A direction across the lens, given by its angle. The power of a sphero-cylindrical lens depends on the meridian, between the two principal meridians.' },
    { term: 'Transposition', also: ['transposing a prescription'], def: 'Rewriting a sphero-cylindrical prescription with the other sign of cylinder: add the cylinder to the sphere, change its sign, turn the axis by 90°. The lens is unchanged.' },
    { term: 'Spherical equivalent', also: ['SE', 'mean sphere', 'M'], def: 'The sphere plus half the cylinder, $S + C/2$: the single sphere that gives about the same overall blur as the astigmatic lens.' },
    { term: 'Power vector', also: ['M, J0, J45', 'Jackson cross-cylinder components'], def: 'A refractive error written as three numbers, the spherical equivalent M and two cross-cylinder components J0 and J45, which can be averaged and compared without the axis wrap.' },
    { term: 'Toric lens', also: ['sphero-cylindrical lens', 'astigmatic lens'], def: 'A lens with one surface curved differently in two perpendicular directions, so that it has a different power in each. It carries the cylinder of a prescription.' }
  ],
  formulas: [
    {
      name: 'Spherical equivalent',
      expr: 'M = S + C/2', tex: 'M = S + \\frac{C}{2}',
      vars: {
        M: { name: 'spherical equivalent', q: 'optpower', unit: 'D', signed: true },
        S: { name: 'sphere', q: 'optpower', unit: 'D', value: -2, signed: true },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -1.5, signed: true }
      },
      solveFor: 'M',
      note: 'The same in minus and plus form. It is the power half-way between the two principal powers.',
      stories: { M: 'A lens is {S} sphere with {C} cylinder. What is its spherical equivalent?' }
    },
    {
      name: 'Transposed sphere',
      expr: 'S2 = S1 + C1', tex: 'S_2 = S_1 + C_1',
      vars: {
        S2: { name: 'sphere of the transposed form', q: 'optpower', unit: 'D', signed: true, tex: 'S_2' },
        S1: { name: 'sphere as written', q: 'optpower', unit: 'D', value: -2, signed: true, tex: 'S_1' },
        C1: { name: 'cylinder as written', q: 'optpower', unit: 'D', value: -1.5, signed: true, tex: 'C_1' }
      },
      solveFor: 'S2',
      note: 'The cylinder of the transposed form is −C₁ and its axis is turned by 90°.'
    },
    {
      name: 'Cross-cylinder component J0',
      expr: 'J0 = -(C/2)*cos(2*ax)', tex: 'J_0 = -\\frac{C}{2}\\cos 2\\alpha_0',
      vars: {
        J0: { name: 'horizontal–vertical cross-cylinder component', q: 'optpower', unit: 'D', signed: true, tex: 'J_0' },
        C: { name: 'cylinder', q: 'optpower', unit: 'D', value: -1.5, signed: true },
        ax: { name: 'axis', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\alpha_0' }
      },
      solveFor: 'J0',
      note: 'With J45 = −(C/2) sin 2α₀ it describes the cylinder as two numbers that add like ordinary quantities.'
    }
  ],
  examples: [
    {
      title: 'Transposing',
      q: 'Write +1.50 −0.75 × 175 with a plus cylinder.',
      steps: [
        'New sphere: $+1.50 + (-0.75) = +0.75$ D.',
        'New cylinder: change the sign, +0.75 D.',
        'New axis: $175° + 90° = 265°$, and 265° − 180° = 85°.'
      ],
      a: '+0.75 +0.75 × 085. Check at the old axis: the powers across 175° and along it were +0.75 D and +1.50 D; the new form gives +0.75 D along 85° and +1.50 D along 175°.'
    },
    {
      title: 'A lens in three numbers',
      q: 'For OD −2.00 −1.50 × 090 give the spherical equivalent and the power-vector components.',
      steps: [
        { text: 'The spherical equivalent:', tex: 'M = -2.00 + \\frac{-1.50}{2} = -2.75\\ \\mathrm{D}' },
        { text: 'The cross-cylinder components, with $\\alpha_0 = 90°$:', tex: 'J_0 = -\\frac{-1.50}{2}\\cos 180° = -0.75\\ \\mathrm{D} \\qquad J_{45} = -\\frac{-1.50}{2}\\sin 180° = 0' }
      ],
      a: 'M = −2.75 D, J0 = −0.75 D, J45 = 0.'
    }
  ],
  quiz: [
    { q: 'Transposing −3.00 +1.00 × 090 gives…', choices: ['−2.00 −1.00 × 180', '−4.00 −1.00 × 090', '−2.00 +1.00 × 180', '−3.00 −1.00 × 180'], a: 0, why: 'New sphere −3.00 + 1.00 = −2.00; the cylinder changes sign to −1.00; the axis turns from 90° to 180°.' },
    { q: 'A plus-cylinder and a minus-cylinder form of a prescription can describe the same lens.', a: true, why: 'Transposition converts one into the other, and the power in every direction is unchanged.' },
    { q: 'What is the spherical equivalent, in dioptres, of −1.00 −2.00 × 180?', answer: -2, unit: 'D', why: '$M = S + C/2 = -1.00 - 1.00 = -2.00$ D.' },
    { q: 'Two cylinders of +2.00 D with axes at 90° and at 180° are placed together. The pair acts as…', choices: ['a +2.00 D sphere', 'a +4.00 D cylinder', 'a +2.00 D cylinder at 135°', 'a plane glass'], a: 0, why: 'The first adds +2 D across the vertical, the second +2 D across the horizontal: the same +2.00 D in every direction, which is a sphere.' },
    { q: 'Two prescriptions have axes 175° and 5°. By how many degrees do the axes differ?', choices: ['170°', '10°', '90°', '5°'], a: 1, why: 'Axes wrap every 180°: from 175° to 180° is 5° and on to 5° is 5° more, so 10° in all.' }
  ],
  applications: [
    'Reading prescriptions from practitioners who write the other form, and comparing lenses made by laboratories that grind in minus form.',
    'Averaging or comparing many prescriptions in studies and lens statistics, with power vectors.',
    'Planning contact lenses and corneal procedures, where the same astigmatism is described by its steep and flat meridians ([[keratometry-and-corneal-topography]]).',
    'Understanding the lensmeter and the phoropter, which measure and set the two principal powers and the axis ([[the-phoropter-and-subjective-refraction]], [[fitting-measurements-and-the-lensmeter]]).'
  ],
  history: 'Cylindrical lenses for astigmatism were first made in the 1820s, after George Airy used one for himself. Both ways of writing a cylinder have been in use since, and conventions still differ by profession and by country.',
  sources: [
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — sphero-cylindrical lenses, power in a meridian and transposition.',
    'L. N. Thibos, W. Wheeler and D. Horner, "Power vectors: an application of Fourier analysis to the description and statistical analysis of refractive error", *Optometry and Vision Science* 74 (1997).',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — toric lenses and the forms of the cylinder.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — sphere, cylinder, axis and power.'
  ],
  sim: { id: 'sp-prescription', params: { case: 'astig', form: 'plus' } }
},

/* ================================================================ 5 */
{
  id: 'prism-in-spectacles', parent: 'spectacles-and-contact-lenses', title: 'Prism in spectacles', level: 2,
  short: 'A prism turns a ray toward its base; its strength is measured in prism dioptres, 1 cm of deviation at 1 m. Every lens is a prism away from its optical centre (Prentice\'s rule: prism = power × decentration), so centring matters and prism can be put into a lens on purpose.',
  keywords: ['prism', 'prism dioptre', 'prismatic effect', 'Prentice', 'Prentice\'s rule', 'decentration', 'induced prism', 'base up', 'base down', 'base in', 'base out', 'vertical imbalance', 'anisometropia', 'Fresnel prism', 'prism thinning', 'optical centre'],
  prereq: ['how-spectacle-lenses-correct-vision', 'reading-a-prescription', 'prism-deviation'],
  related: ['spectacle-lens-materials', 'progressive-lenses', 'fitting-measurements-and-the-lensmeter', 'cover-test-and-binocular-balance', 'binocular-vision-and-stereopsis', 'cylinder-axis-and-transposition'],
  body: `
A prism bends light toward its thick edge, the **base**. Looking through one, the eye sees an object where the bent ray points, and the object seems displaced toward the thin end, the **apex**. A lens is a prism in disguise: each small piece of a lens off its centre has a thick side and a thin side. That is why the centring of strong lenses matters, and how a prism can be put into a lens on purpose.

### The prism dioptre
The strength of a prism is given in **prism dioptres**, written Δ: a prism of 1 Δ deviates a ray by 1 cm at a distance of 1 m, so

$$P = 100\\tan\\delta$$

| Prism | Deviation | 1 m | 6 m |
|---|---|---|---|
| 1 Δ | 0.573° | 1 cm | 6 cm |
| 2 Δ | 1.146° | 2 cm | 12 cm |
| 5 Δ | 2.862° | 5 cm | 30 cm |
| 10 Δ | 5.711° | 10 cm | 60 cm |
| 100 Δ | 45.00° | 1 m | 6 m |

A thin glass prism turns a ray by $(n - 1)A$, so 2 Δ needs an apex angle of 2.30° in CR-39 ($n$ = 1.498) and 1.72° in a 1.67 plastic ($n$ = 1.665).

### Prentice's rule
A lens of power $F$ bends a ray that crosses it at a distance $c$ from its optical centre by the angle $c/f = cF$. In prism dioptres, with $c$ in centimetres,

$$P = F\\,c$$

A +4 D lens used 5 mm from its centre contains 4 × 0.5 = 2 Δ. For a plus lens the base lies toward the optical centre; for a minus lens, away from it. The ray tracer in the simulation agrees with the rule to a couple of per cent.

### Where prism matters
- **Centring.** The optical centres should lie in front of the pupils. A pair set 2 mm wide of the wearer's PD puts 1 mm of decentration in each lens, 0.6 Δ for a +6 D lens but only 0.1 Δ for a +1 D lens.
- **Prism on purpose.** Prism can be prescribed to shift the line of sight of an eye whose partner does not line up with it; the examiner decides the amount, usually split between the two eyes. A prism is made by grinding a wedge or by decentring a lens by $c = P/F$: 2.5 Δ in a +5 D lens needs 5 mm.
- **Vertical imbalance.** When the two lenses differ in power, reading through the lower part (10 mm below the centres) gives the eyes different prism: +2.00 D and +4.00 D give 2.0 Δ and 4.0 Δ, a difference of 2.0 Δ. Designs exist to cancel it.
- **Prism thinning.** A prism of the *same* amount and direction in both eyes thins a lens and leaves the two eyes' lines of sight in step, so it causes no imbalance.
- **Press-on prisms.** A thin membrane of fine grooves on a lens gives prism cheaply, at some cost in contrast.

A prism spreads colours just as a lens does: its fringe is $P/V$, 0.10 Δ for a 6 Δ prism in a plastic of Abbe number 58.

> [!warn] The page explains prism. Whether a person has any prism in their glasses is decided by an examiner after tests of the eyes working together; double vision, a head tilt or a sudden change in alignment call for prompt eye care.

> [!key] A prism of 1 Δ turns a ray 1 cm at 1 m. Any lens off its centre is a prism of $F \\cdot c$ prism dioptres, base toward the centre in a plus lens, away in a minus lens.
`,
  ideas: [
    'A prism bends light toward its base; the object seems displaced toward the apex.',
    'One prism dioptre (1 Δ) deviates a ray 1 cm at 1 m: $P = 100\\tan\\delta$, so 1 Δ ≈ 0.573°.',
    'Prentice\'s rule: a lens of power F used c centimetres from its optical centre contains $P = Fc$ prism dioptres.',
    'Plus lens: base toward the optical centre; minus lens: base away from it.',
    'Strong lenses must be well centred; unequal lenses give vertical imbalance when reading below the centres.'
  ],
  pitfalls: [
    'Decentring a lens only shifts the picture sideways — It also turns the rays: the lens acts as a prism of strength power × decentration, which moves where the eye sees the object and strains the pair of eyes working together.',
    'The image moves toward the base of a prism — The light is bent toward the base, so the object appears displaced the other way, toward the apex.',
    'Centring errors matter the same for every lens — The induced prism is proportional to the power: a 1 mm slip is 0.1 Δ in a +1 D lens and 0.6 Δ in a +6 D lens.',
    'A prism dioptre is a degree — It is a slope: 1 cm in 100 cm. One prism dioptre is 0.573°, and 100 Δ is 45°, not 100°.'
  ],
  terms: [
    { term: 'Prism dioptre', also: ['Δ', 'prism diopter', 'cm/m'], def: 'The unit of prism strength: a prism of 1 Δ deviates a ray by 1 cm at 1 m, an angle of about 0.573°.' },
    { term: 'Base and apex', def: 'The thick edge of a prism is its base and the thin edge its apex. Light is bent toward the base; an object seen through the prism seems shifted toward the apex.' },
    { term: 'Prentice\'s rule', def: 'The prism contained in a lens at a distance c from its optical centre: $P = Fc$ prism dioptres, with the power F in dioptres and c in centimetres.' },
    { term: 'Decentration', also: ['optical centre displacement'], def: 'The distance by which the line of sight, or the centre of the pupil, is displaced from the optical centre of the lens it looks through. It induces prism.' },
    { term: 'Vertical imbalance', also: ['prismatic imbalance', 'anisometropic prism'], def: 'The difference between the vertical prisms of the two lenses at the point where each eye looks through, caused by unequal powers when the gaze is below or above the optical centres.' },
    { term: 'Fresnel prism', also: ['press-on prism'], def: 'A thin plastic membrane carrying fine parallel grooves that act as a prism, stuck to a spectacle lens to add prism cheaply or temporarily.' }
  ],
  formulas: [
    {
      name: 'Prentice\'s rule',
      expr: 'P = 100*F*dec', tex: 'P = 100\\,F\\,c',
      vars: {
        P: { name: 'prism at that point', q: 'prism', unit: 'Δ' },
        F: { name: 'power of the lens', q: 'optpower', unit: 'D', value: 4, min: 0, max: 20 },
        dec: { name: 'distance from the optical centre', q: 'length', unit: 'mm', value: 5, min: 0, max: 30, tex: 'c' }
      },
      solveFor: 'P',
      note: 'The power is taken without its sign; plus lens: base toward the optical centre, minus lens: base away.',
      stories: {
        P: 'The line of sight crosses a {F} lens {dec} from its optical centre. How much prism does the lens have there?',
        dec: 'A {F} lens must contain {P}. How far from the optical centre must the line of sight cross it?'
      }
    },
    {
      name: 'Prism and deviation',
      expr: 'P = 100*tan(d)', tex: 'P = 100\\tan\\delta',
      vars: {
        P: { name: 'prism strength', q: 'prism', unit: 'Δ' },
        d: { name: 'deviation of a ray', q: 'angle', unit: '°', value: 1.146, min: 0, max: 45, tex: '\\delta' }
      },
      solveFor: 'P',
      note: '1 Δ is 1 cm of deviation at 1 m; 100 Δ is 45°.'
    },
    {
      name: 'Colour fringe of a prism',
      expr: 'Cf = P/V', tex: 'C_f = \\frac{P}{V}',
      vars: {
        Cf: { name: 'spread of the prism between blue and red', q: 'prism', unit: 'Δ', tex: 'C_f' },
        P: { name: 'prism strength', q: 'prism', unit: 'Δ', value: 6 },
        V: { name: 'Abbe number of the material', value: 58, min: 15, max: 100 }
      },
      solveFor: 'Cf',
      note: 'Lateral chromatic aberration of a thin prism, to a good approximation.'
    }
  ],
  examples: [
    {
      title: 'Prism by decentring',
      q: 'A +5.00 D lens must contain 2.5 Δ. By how much must the line of sight be displaced from the optical centre?',
      steps: [
        { text: 'Solve Prentice\'s rule for the distance in centimetres:', tex: 'c = \\frac{P}{F} = \\frac{2.5}{5.00} = 0.5\\ \\mathrm{cm}' },
        'That is 5 mm. Because the lens is plus, the base lies toward the optical centre.'
      ],
      a: '5 mm of decentration.'
    },
    {
      title: 'Reading with unequal lenses',
      q: 'A person reads 10 mm below the optical centres through lenses of +2.00 D (right) and +4.00 D (left). What is the vertical prism in each eye and the difference?',
      steps: [
        { text: 'Apply the rule to each eye with $c = 1.0$ cm:', tex: 'P_R = 2.00 \\times 1.0 = 2.0\\ \\Delta \\qquad P_L = 4.00 \\times 1.0 = 4.0\\ \\Delta' },
        'Both are base up (plus lenses, with the centre above the line of sight), but unequal, so the eyes must tilt differently.'
      ],
      a: '2.0 Δ and 4.0 Δ: a vertical difference of 2.0 Δ between the eyes.'
    }
  ],
  quiz: [
    { q: 'A prism of 3 Δ deviates a ray. By how much at a distance of 2 m, in centimetres?', answer: 6, unit: 'cm', why: '1 Δ is 1 cm per metre, so 3 Δ is 3 cm per metre, 6 cm at 2 m.' },
    { q: 'The line of sight crosses a +5.00 D lens 4 mm from its optical centre. How many prism dioptres does the lens have there?', answer: 2, unit: 'Δ', why: 'Prentice\'s rule: $P = F c = 5.00 \\times 0.4 = 2.0$ Δ, base toward the optical centre.' },
    { q: 'In a minus lens, the prism induced by decentration has its base…', choices: ['toward the optical centre', 'away from the optical centre', 'always down', 'in the direction of the axis'], a: 1, why: 'A minus lens is thick at its edge and thin at its centre, so away from the centre is the thick side: the base lies away from the optical centre.' },
    { q: 'Light passing through a prism is bent toward the apex.', a: false, why: 'It is bent toward the base, the thick edge. An object seen through it seems displaced toward the apex.' },
    { q: 'Why can an equal prism in both eyes be used to thin a lens without causing double vision?', choices: ['Because prism does not affect vision', 'Because the two eyes see equal shifts of the whole scene, so there is no difference between them', 'Because the prism is cancelled by the lens', 'Because it is too small to see'], a: 1, why: 'An equal prism in the same direction shifts the scene equally for both eyes; the double vision of a prism difference arises only when the two eyes receive different shifts.' }
  ],
  applications: [
    'Centring strong lenses so that the optical centres lie in front of the pupils ([[fitting-measurements-and-the-lensmeter]]).',
    'Glasses made with prescribed prism, and temporary press-on prisms, for eyes whose lines of sight do not meet the target ([[cover-test-and-binocular-balance]]).',
    'Designing lenses for people whose two eyes differ in power, so that reading does not produce a vertical imbalance.',
    'Prism thinning in progressive and plus lenses, and prisms in binoculars, periscopes and cameras ([[prism-deviation]]).'
  ],
  history: 'The prism dioptre and the rule for the prism of a decentred lens were set out by Charles F. Prentice in the late nineteenth century, when decentring lenses was the usual way to make prism.',
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — prism, decentration and Prentice\'s rule.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — prismatic effects of lenses and vertical imbalance.',
    'E. Hecht, *Optics* — the chapter on geometrical optics, prisms and thin lenses.'
  ],
  sim: 'sp-prism'
},

/* ================================================================ 6 */
{
  id: 'spectacle-lens-materials', parent: 'spectacles-and-contact-lenses', title: 'Spectacle lens materials', level: 2,
  short: 'Lens materials trade index, density, dispersion and toughness. A higher index gives flatter curves and a thinner lens, a lower Abbe number gives larger colour fringes, and impact resistance comes from the plastic, not from thickness. Weight is thickness times density.',
  keywords: ['lens material', 'CR-39', 'polycarbonate', 'Trivex', 'high-index', '1.60', '1.67', '1.74', 'crown glass', 'refractive index', 'Abbe number', 'density', 'lens thickness', 'lens weight', 'impact resistance', 'colour fringes', 'lateral chromatic aberration', 'aspheric'],
  prereq: ['how-spectacle-lenses-correct-vision', 'the-abbe-number-and-glass-map', 'optical-plastics'],
  related: ['optical-glass', 'lateral-chromatic-aberration', 'spectacle-lens-coatings', 'vertex-distance-and-effective-power', 'fresnel-reflection', 'progressive-lenses'],
  body: `
Every spectacle lens is a compromise among four numbers: the **refractive index** $n$, the **Abbe number** $V$ (how much the index changes across the colours), the **density** $\\rho$ and the toughness of the material. The table lists typical values for the common materials, with the result for one example lens: −6 D, 55 mm across, 1.5 mm thick at the centre, front curve +4 D, the same in every material.

| Material | $n_d$ | $V$ | $\\rho$ (g/cm³) | Edge thickness | Weight |
|---|---|---|---|---|---|
| CR-39 plastic | 1.498 | 58 | 1.32 | 6.7 mm | 12.5 g |
| Crown glass | 1.523 | 59 | 2.54 | 6.4 mm | 23.2 g |
| Trivex | 1.530 | 44 | 1.11 | 6.3 mm | 10.1 g |
| Polycarbonate | 1.586 | 30 | 1.20 | 5.8 mm | 10.2 g |
| High-index 1.60 | 1.600 | 41 | 1.30 | 5.6 mm | 10.8 g |
| High-index 1.67 | 1.665 | 32 | 1.35 | 5.2 mm | 10.6 g |
| High-index 1.74 | 1.740 | 33 | 1.47 | 4.8 mm | 10.8 g |

### Why index makes a thinner lens
The power of a surface is $(n - 1)/R$, so a higher index needs a flatter surface, a larger radius, for the same power. Flatter surfaces drop less over the width of the lens, and what the surfaces drop is what the edge of a minus lens (or the centre of a plus lens) must be made of. Higher index also means a **higher reflectance** at each surface: 4.0 % for CR-39 but 7.3 % for the 1.74 plastic, so a high-index lens leans on its antireflection coating ([[spectacle-lens-coatings]]).

### Weight is thickness times density
The 1.74 plastic is thin but dense, and the saving in weight is small. Glass, at 2.54 g/cm³, is hardly thinner than CR-39 and nearly twice as heavy. A lens cut down to a smaller diameter, or with an **aspheric** surface that flattens the curves toward the edge, saves weight in every material.

### Colour fringes
Away from the optical centre a lens is a weak prism and, like any prism, separates colours. The fringe, in prism dioptres, is $|F|\\,c/V$ for $c$ in centimetres: at 10 mm from the centre of a −6 D lens, 0.10 Δ in CR-39 but 0.20 Δ in polycarbonate. Low-$V$ materials show larger fringes at the same power, noticed mostly near the edges of strong lenses.

### Toughness, hardness and ultraviolet
**Polycarbonate** and **Trivex** resist impact and are the usual choice where lenses must survive knocks, in children's, sports and safety eyewear; glass can shatter unless tempered, and CR-39 can chip. The price is a softer surface that needs a hard coat, and for polycarbonate a low Abbe number. CR-39 is a cast thermoset; polycarbonate is a thermoplastic that is injection-moulded. Polycarbonate and Trivex absorb ultraviolet up to about 395 nm by themselves, while clear CR-39 and crown glass start passing light near 350 nm and need an absorber to cut UV-A.

> [!warn] The page compares materials; it does not recommend one. The best material for a person depends on prescription, frame, use and safety needs, and is chosen with an optician.

> [!key] A higher index makes a flatter, thinner lens; the weight depends on thickness × density; a lower Abbe number makes larger colour fringes; impact resistance is a property of the plastic.
`,
  ideas: [
    'A higher refractive index needs flatter surfaces for the same power, giving a thinner edge or centre.',
    'Weight is volume times density, so a denser high-index plastic saves less weight than it saves thickness.',
    'A lower Abbe number means larger colour fringes: $|F|c/V$ prism dioptres at a distance c from the centre.',
    'Higher index reflects more at each surface, so antireflection coatings matter more.',
    'Impact resistance and hardness are properties of the plastic; polycarbonate and Trivex resist impact, glass is hard but heavy and can shatter.'
  ],
  pitfalls: [
    'Higher-index plastics are lighter — They are thinner, but denser: the −6 D example weighs 12.5 g in CR-39 and 10.8 g in the 1.74 plastic, a smaller saving than the thickness (6.7 mm to 4.8 mm).',
    'A thicker lens resists impact better — Impact resistance depends on the material and the processing. Thin polycarbonate resists a blow better than much thicker glass.',
    'The Abbe number says how clear a material is — It measures dispersion, the spread of the index across the spectrum, not transparency. A material of low V is just as clear but makes larger colour fringes.',
    'Glass lenses are thinner because glass has a higher index than plastic — The standard crown glass has n = 1.523, hardly above CR-39 at 1.498; its main differences are hardness and weight.'
  ],
  terms: [
    { term: 'Abbe number', also: ['V', 'ν_d', 'constringence'], def: 'A measure of a material\'s dispersion: $V = (n_d - 1)/(n_F - n_C)$. A high value means the index changes little across the colours; a low value means large colour fringes. Defined in the glass-map page.' },
    { term: 'CR-39', also: ['allyl diglycol carbonate', 'ADC'], def: 'The standard plastic for spectacle lenses: a cast thermosetting resin of index about 1.50 and Abbe number about 58, with good optical quality and a hard-coatable surface.' },
    { term: 'Polycarbonate', also: ['PC'], def: 'A tough, light thermoplastic of index about 1.59 and Abbe number about 30, used where impact resistance matters. It needs a hard coat to resist scratching.' },
    { term: 'Trivex', def: 'A lightweight, tough plastic for spectacle lenses, index about 1.53 and Abbe number about 44, with impact resistance close to polycarbonate\'s.' },
    { term: 'High-index lens', also: ['1.60', '1.67', '1.74'], def: 'A plastic lens of index 1.60 or more, which gives the same power with flatter, thinner surfaces than CR-39, at the price of a lower Abbe number and a denser material.' },
    { term: 'Colour fringes', also: ['lateral chromatic aberration', 'transverse chromatic aberration'], def: 'Coloured edges seen when the line of sight crosses a lens away from its centre, because the prism it contains bends the colours by different amounts.' }
  ],
  formulas: [
    {
      name: 'Surface power and radius',
      expr: 'P = (n - 1)/R', tex: 'P = \\frac{n - 1}{R}',
      vars: {
        P: { name: 'power of the surface', q: 'optpower', unit: 'D', signed: true },
        n: { name: 'refractive index of the lens', value: 1.498, min: 1.3, max: 2 },
        R: { name: 'radius of the surface', q: 'length', unit: 'mm', value: 124.5, signed: true }
      },
      solveFor: 'P',
      note: 'Surface between air and the lens material. For the same power the radius grows with n − 1.',
      stories: { R: 'A surface of {P} is cut in a plastic of index {n}. What is its radius?' }
    },
    {
      name: 'Sag of a surface',
      expr: 's = R - sqrt(R^2 - r^2)', tex: 's = R - \\sqrt{R^2 - r^2}',
      vars: {
        s: { name: 'sag: how far the surface drops at radius r', q: 'length', unit: 'mm' },
        R: { name: 'radius of curvature', q: 'length', unit: 'mm', value: 62.1, min: 10, max: 2000 },
        r: { name: 'distance from the axis', q: 'length', unit: 'mm', value: 27.5, min: 0, max: 40 }
      },
      solveFor: 's',
      note: 'The difference between the sags of the two surfaces, plus the centre thickness, is the edge thickness.'
    },
    {
      name: 'Colour fringe of a lens',
      expr: 'Cf = 100*F*h/V', tex: 'C_f = \\frac{100\\,F\\,h}{V}',
      vars: {
        Cf: { name: 'colour fringe', q: 'prism', unit: 'Δ', tex: 'C_f' },
        F: { name: 'power of the lens (without sign)', q: 'optpower', unit: 'D', value: 6, min: 0, max: 20 },
        h: { name: 'distance from the optical centre', q: 'length', unit: 'mm', value: 10, min: 0, max: 40 },
        V: { name: 'Abbe number', value: 58, min: 15, max: 100 }
      },
      solveFor: 'Cf',
      note: 'Prentice\'s rule divided by the Abbe number. Larger at the edges and in stronger lenses.',
      stories: { Cf: 'A {F} lens of Abbe number {V} is used {h} from its optical centre. What is the colour fringe?' }
    }
  ],
  examples: [
    {
      title: 'The back surface of a −4 D lens',
      q: 'A −4.00 D thin lens has a +4.00 D front surface. What is the back-surface radius in CR-39 ($n$ = 1.498) and in a 1.665 plastic?',
      steps: [
        'The back surface supplies $-4 - 4 = -8$ D, so $R_2 = (1 - n)/(-8)$ in metres.',
        { text: 'CR-39 and the 1.665 plastic:', tex: 'R_2 = \\frac{0.498}{8} = 62.3\\ \\mathrm{mm} \\qquad R_2 = \\frac{0.665}{8} = 83.1\\ \\mathrm{mm}' },
        'The flatter radius of the high-index lens drops less across 55 mm: its edge is about 3.9 mm thick against 4.8 mm in CR-39, for a 1.5 mm centre.'
      ],
      a: '62.3 mm in CR-39, 83.1 mm in the 1.665 plastic.'
    },
    {
      title: 'Colour fringes',
      q: 'A −8.00 D polycarbonate lens ($V$ = 32 here) is viewed 12.5 mm from its optical centre. What is the colour fringe?',
      steps: [
        { text: 'Prentice\'s rule divided by the Abbe number:', tex: 'C_f = \\frac{100 \\times 8.00 \\times 0.0125}{32}' },
        'That is $10/32 = 0.31$ Δ, three times the 0.1 Δ of a 6 Δ prism in CR-39 (V 58).'
      ],
      a: 'About 0.31 Δ.'
    }
  ],
  quiz: [
    { q: 'Which property of a lens material most reduces the edge thickness of a minus lens of the same power?', choices: ['A higher refractive index', 'A higher Abbe number', 'A higher density', 'A harder surface'], a: 0, why: 'A higher index lets the same power be made with flatter surfaces, which drop less over the lens width. The Abbe number controls colour fringes, density the weight.' },
    { q: 'Polycarbonate has an Abbe number of about 30 and CR-39 about 58. Which shows the larger colour fringes at the same power and distance?', choices: ['Polycarbonate', 'CR-39', 'They are equal', 'Neither shows any'], a: 0, why: 'The fringe is $|F|c/V$, so the lower Abbe number gives the larger fringe, nearly twice as large here.' },
    { q: 'A high-index plastic is always lighter than CR-39 for the same prescription.', a: false, why: 'Weight is volume times density. The denser plastics partly give back what the thinner lens saves: the −6 D example weighs 12.5 g in CR-39 and 10.8 g in the 1.74 plastic.' },
    { q: 'A −8.00 D lens of Abbe number 32 is used 12.5 mm from the optical centre. What colour fringe does it have, in prism dioptres?', answer: 0.31, unit: 'Δ', why: '$100 \\times 8 \\times 0.0125/32 = 0.31$ Δ.' },
    { q: 'About how much light does one uncoated surface of a 1.74 plastic lens reflect at normal incidence?', choices: ['0.5 %', '4 %', '7 %', '15 %'], a: 2, why: '$R = ((n - 1)/(n + 1))^2 = (0.74/2.74)^2 = 7.3$ %, against 4.0 % for CR-39. Each surface does it, so a coating matters more.' }
  ],
  applications: [
    'Selecting among materials in a lens catalogue by index, Abbe number and impact class for a given prescription and frame.',
    'Safety, sports and children\'s eyewear, where impact-resistant plastics are the usual materials.',
    'Rimless and drilled mounts, which need a material that does not crack at the holes.',
    'Estimating the weight and edge thickness of a pair before the lenses are made.'
  ],
  history: 'Glass was the only spectacle material until CR-39, developed in the 1940s, became the standard plastic. Polycarbonate entered spectacles in the 1980s, and the high-index plastics followed.',
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the chapters on lens materials, lens thickness and chromatic aberration.',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — lens materials and aberrations of spectacle lenses.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the definition of the Abbe number and the lens terms.'
  ],
  sim: 'sp-materials'
}
,

/* ================================================================ 7 */
{
  id: 'bifocals-and-trifocals', parent: 'spectacles-and-contact-lenses', title: 'Bifocals and trifocals', level: 2,
  short: 'A bifocal lens has the distance power over the whole lens and a segment of added power low down, for reading; a trifocal adds an intermediate segment above it. Where the eye crosses the dividing line the lens acts as a prism, so the picture jumps; how much depends on the segment\'s shape.',
  keywords: ['bifocal', 'trifocal', 'segment', 'flat-top', 'FT28', 'round segment', 'executive', 'E-style', 'Franklin', 'image jump', 'dividing line', 'segment height', 'addition', 'near segment', 'intermediate segment', 'double bifocal'],
  prereq: ['reading-a-prescription', 'prism-in-spectacles', 'presbyopia'],
  related: ['progressive-lenses', 'occupational-and-computer-lenses', 'accommodation', 'fitting-measurements-and-the-lensmeter', 'spectacle-lens-materials'],
  body: `
Around the middle forties the eye's focusing reserve ([[presbyopia]], [[accommodation]]) stops covering a book at arm's length. A **bifocal** lens meets that with two powers in one piece of glass: the distance power over the whole lens, and a **segment** of added power low down, where the eyes turn to read. Benjamin Franklin described "double spectacles" of this kind in the 1780s.

### The segments
| Segment | Shape | Segment optical centre | Image jump, +2.00 D addition |
|---|---|---|---|
| Flat-top 28 (FT28, D-segment) | flat top edge, rounded below, 28 mm wide | about 5 mm below the line | 1.0 Δ |
| Round 22 | a circle 22 mm across | at its middle, 11 mm below the top | 2.2 Δ |
| Executive (E-style) | the whole lower part, the line across the lens | on the dividing line | none |
| Trifocal 7 × 28 | a 7 mm intermediate segment above a 28 mm near one | one in each | a small jump, then a larger one |
| Blended | any of the above with the line smoothed away | as the original | as the original |

The positions are typical of textbook figures; makers' segments differ a little.

### Image jump
The eyes cross the **dividing line** and the line of sight enters the segment at its top edge, at some distance $d$ above the segment's own optical centre. There the segment is a prism ([[prism-in-spectacles]]) of strength

$$J = A\\,d$$

with $A$ the addition and $d$ in centimetres. The base lies toward the segment's centre, downward, so objects seem to jump *up* as the gaze descends. For an addition of +2.00 D a flat-top segment gives 2.00 × 0.5 = 1.0 Δ, about 4 mm at a book held 40 cm away; a round segment gives 2.00 × 1.1 = 2.2 Δ, 8.8 mm; an executive segment has its centre on the line and no jump. This is not a refocusing effect: it is the prism at the line.

### What each zone gives
The distance zone is focused for far objects. The near zone is focused, with no effort from the eye, for an object at $1/A$ metres: 50 cm for +2.00 D, with a little more range from whatever focusing the eye has left. In between there is nothing: a screen at 70 cm lies between the two zones ([[occupational-and-computer-lenses]]). A **trifocal** fills the gap with an intermediate segment, usually of half the near addition, +1.00 D for a +2.00 D addition, focused at 1 m, and has two lines and two jumps.

### Made and fitted
In a one-piece lens the segment is a steeper area of the front surface; in a fused glass lens it is a button of denser glass fused into a recess in the main lens. The dividing line is usually placed at the lower lid margin, so a small lowering of the gaze enters the segment, and the near portion is shifted a few millimetres toward the nose because the eyes converge for reading ([[fitting-measurements-and-the-lensmeter]]).

> [!warn] The page explains the designs. Which kind of lens, if any, suits a person is for an eye-care practitioner to decide after an examination; sudden changes in near or far vision should be checked promptly.

> [!key] A bifocal adds a near segment; the picture jumps at its top edge by the addition times the distance from the segment's own optical centre to that edge. Executive segments have no jump, round ones the most.
`,
  ideas: [
    'A bifocal lens has the distance power over the whole lens and a segment of added power low down for reading.',
    'At the dividing line the segment is a prism of strength $J = A\\,d$ (addition × distance of its optical centre from the edge), and the picture jumps up.',
    'A flat-top 28 gives 1.0 Δ for a +2.00 D addition, a round 22 gives 2.2 Δ, an executive segment none.',
    'The near zone is focused for $1/A$ metres: 50 cm for +2.00 D.',
    'A bifocal has a gap between its zones; a trifocal fills it with an intermediate segment of half the addition.'
  ],
  pitfalls: [
    'Image jump is the eye refocusing — It is a prism effect at the dividing line, caused by the lens, not by the eye\'s focusing; it happens whatever the eye\'s state.',
    'A bigger segment always means a bigger jump — The jump is the addition times the distance from the segment\'s optical centre to its top edge. Executive segments are large and have none; round segments are small and have the most.',
    'A bifocal wearer sees clearly at every distance through the segment — The near segment is focused for one distance, about 1/ADD metres, with a limited range around it; beyond that the view blurs, and the gap between distance and near is not covered.',
    'Trifocals are two bifocals stacked — The intermediate segment has about half the addition and its own optical centre, so the two lines have two different jumps.'
  ],
  terms: [
    { term: 'Bifocal lens', def: 'A lens with two powers: the distance power over most of the lens and a segment of added power in its lower part for near vision.' },
    { term: 'Segment', also: ['seg', 'segment top', 'segment height'], def: 'The part of a bifocal or trifocal lens that carries the added power. Its height is the distance of its top edge above the lowest point of the lens, or from the lower lid.' },
    { term: 'Image jump', def: 'The sudden shift of the picture as the line of sight crosses the dividing line, caused by the prism of the segment at its edge: addition × distance from the segment\'s optical centre to the edge.' },
    { term: 'Flat-top 28', also: ['FT28', 'D-segment', 'straight-top'], def: 'A bifocal segment with a straight top edge, 28 mm wide, with its optical centre about 5 mm below the line.' },
    { term: 'Executive bifocal', also: ['E-style', 'Franklin bifocal'], def: 'A bifocal whose dividing line runs across the whole lens, so the entire lower part has the near power. Its optical centre lies on the line and there is no image jump.' },
    { term: 'Trifocal', also: ['intermediate segment'], def: 'A multifocal lens with three zones: distance, an intermediate segment (typically half the near addition) and a near segment, separated by two lines.' }
  ],
  formulas: [
    {
      name: 'Image jump at the dividing line',
      expr: 'J = 100*A*d', tex: 'J = 100\\,A\\,d',
      vars: {
        J: { name: 'jump (prism at the top of the segment)', q: 'prism', unit: 'Δ' },
        A: { name: 'addition', q: 'optpower', unit: 'D', value: 2, min: 0.5, max: 4 },
        d: { name: 'distance from the segment\'s optical centre to its top edge', q: 'length', unit: 'mm', value: 5, min: 0, max: 15 }
      },
      solveFor: 'J',
      note: 'Prentice\'s rule applied to the segment: the addition is the power, and the line is at the distance d from the segment\'s centre.',
      stories: {
        J: 'A segment of {A} addition has its optical centre {d} below its top edge. What is the image jump?',
        d: 'A bifocal with a {A} addition shows an image jump of {J}. How far below the dividing line is the optical centre of the segment?'
      }
    },
    {
      name: 'How far the picture moves',
      expr: 's = J*L/100', tex: 's = \\frac{J\\,L}{100}',
      vars: {
        s: { name: 'shift of the picture at the object', q: 'length', unit: 'cm' },
        J: { name: 'prism', q: 'prism', unit: 'Δ', value: 1 },
        L: { name: 'distance of the object', q: 'length', unit: 'cm', value: 40, min: 10, max: 600 }
      },
      solveFor: 's',
      note: '1 Δ shifts the picture 1 cm for each metre of distance.'
    }
  ],
  examples: [
    {
      title: 'The jump of two segments',
      q: 'The addition is +2.00 D. What is the image jump of a flat-top segment (optical centre 5 mm below the line) and of a round 22 mm segment (optical centre 11 mm below its top)? How far does a page at 40 cm shift?',
      steps: [
        { text: 'Flat-top:', tex: 'J = 2.00 \\times 0.5 = 1.0\\ \\Delta \\quad\\Rightarrow\\quad s = 1.0 \\times 0.40 = 0.4\\ \\mathrm{cm}' },
        { text: 'Round:', tex: 'J = 2.00 \\times 1.1 = 2.2\\ \\Delta \\quad\\Rightarrow\\quad s = 2.2 \\times 0.40 = 0.88\\ \\mathrm{cm}' }
      ],
      a: '1.0 Δ (4 mm at 40 cm) for the flat-top; 2.2 Δ (8.8 mm) for the round segment.'
    },
    {
      title: 'Where the near zone is in focus',
      q: 'A near addition of +2.50 D. At what distance is an object in focus through the segment if the eye does not focus at all?',
      steps: [
        'The segment makes light from an object at distance $d$ arrive with the vergence $-1/d + A$; the eye at rest needs it to be zero.',
        'So $d = 1/A = 1/2.50 = 0.40$ m.'
      ],
      a: '40 cm, with some range around it from whatever focusing the eye has left.'
    }
  ],
  quiz: [
    { q: 'Which segment has no image jump?', choices: ['Round 22', 'Flat-top 28', 'Executive', 'Trifocal intermediate'], a: 2, why: 'In the executive style the optical centre of the segment lies on the dividing line, so there is no prism at the line and no jump.' },
    { q: 'A segment has an addition of +2.00 D and its optical centre 5 mm below the line. What is the image jump, in prism dioptres?', answer: 1, unit: 'Δ', why: '$J = 2.00 \\times 0.5 = 1.0$ Δ.' },
    { q: 'The intermediate segment of a trifocal typically has about half the near addition.', a: true, why: 'For a +2.00 D near addition the intermediate segment is about +1.00 D, focused at about 1 m, with the near segment at 50 cm.' },
    { q: 'A bifocal wearer finds the computer screen at 70 cm blurred in both zones. Why?', choices: ['The screen is too bright', 'The screen lies between the distance and the near zones, in the gap', 'The segment is too large', 'The prescription has the wrong axis'], a: 1, why: 'The distance zone reaches in only to a metre or more and the near zone is focused around 50 cm; 70 cm lies between the two. An intermediate zone fills such a gap.' },
    { q: 'Image jump is caused by…', choices: ['the eye refocusing', 'the prism of the segment at the dividing line', 'reflection at the line', 'dispersion in the glass'], a: 1, why: 'At the line the line of sight crosses the segment away from its optical centre, so it passes through a prism: addition × distance from the centre.' }
  ],
  applications: [
    'Spectacles for people who need a near addition and prefer a clear distinction between distance and near zones.',
    'Occupational bifocals: double segments with a near part above as well as below for people who work overhead, such as electricians and mechanics.',
    'Trifocals for work at a range of fixed distances, such as music stands, instrument panels or counters.',
    'The same idea in photography as a split-field close-up filter, half a close-up lens in front of the camera.'
  ],
  history: 'Benjamin Franklin, in a letter of 1785, described cutting his distance and reading lenses in half and joining them in one frame. Fused and one-piece bifocals followed in the nineteenth and twentieth centuries, and the progressive lens replaced much of their use from the 1960s.',
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the chapters on multifocal lenses and image jump.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — multifocal lenses, segment centres and image displacement.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — the definitions of segment, addition and image jump.'
  ],
  sim: 'sp-bifocal'
},

/* ================================================================ 8 */
{
  id: 'progressive-lenses', parent: 'spectacles-and-contact-lenses', title: 'Progressive (multifocal) lenses', level: 2,
  short: 'A progressive lens changes its power smoothly from the distance power at the top to the distance power plus the addition at the bottom, along a corridor, with no line. The price is unwanted astigmatism at the sides, which Minkwitz\'s theorem says cannot be removed, only moved around.',
  keywords: ['progressive lens', 'progressive addition lens', 'PAL', 'varifocal', 'multifocal', 'corridor', 'channel', 'fitting cross', 'addition', 'near zone', 'distance zone', 'unwanted astigmatism', 'Minkwitz', 'hard design', 'soft design', 'free-form', 'inset', 'swim'],
  prereq: ['bifocals-and-trifocals', 'cylinder-axis-and-transposition', 'presbyopia'],
  related: ['occupational-and-computer-lenses', 'fitting-measurements-and-the-lensmeter', 'prism-in-spectacles', 'spectacle-lens-materials', 'astigmatism-of-lenses', 'accommodation'],
  body: `
A progressive lens has no line. Its power changes smoothly from the distance power at the top to the distance power plus the **addition** at the bottom, so that some part of the lens suits every distance, from the far wall through the screen to the page, and there is no image jump. The simulation draws it as two maps, the added power and the unwanted astigmatism; the [progressive lens lab](#/tools/eyelab/progressive) draws the same on the page of the tools.

### The layout
- The **distance zone** fills the upper part. The **fitting cross**, an engraved mark, is set in front of the pupil.
- The **corridor** (or channel) runs down from there, and along it the power rises. Its length, from the fitting cross to the full addition, is typically **11 to 18 mm**: short corridors suit small frames, long ones are gentler.
- The **near zone** lies below, and is shifted a couple of millimetres toward the nose, the **inset**, because the eyes converge for reading.

### The price: unwanted astigmatism
A surface whose curvature changes along a line cannot be spherical on both sides of it. **Minkwitz's theorem** puts a number on this: near the corridor, the astigmatism of the surface grows sideways at about *twice* the rate at which the power changes along the corridor. In the model of the simulation a +2.00 D addition over a 14 mm corridor has its steepest power change in the middle, 0.21 D/mm, so the astigmatism rises sideways at up to 0.43 D/mm: 3 mm from the centre line it is already about 0.9 D, enough to blur print. The peak in the lower sides is about as large as the addition itself. What can be chosen is where this blur lies and how steeply it rises.

| Corridor, +2.00 D | Steepest power change | Sideways rise | Clear width, mid-corridor |
|---|---|---|---|
| 11 mm | 0.27 D/mm | 0.55 D/mm | 1.9 mm |
| 14 mm | 0.21 D/mm | 0.43 D/mm | 2.4 mm |
| 18 mm | 0.17 D/mm | 0.33 D/mm | 3.0 mm |

The last column, the width within which the astigmatism stays below 0.5 D, is the model's number; real designs differ, and quote their own.

### Hard and soft designs, short and long
A **hard** design gathers the astigmatism into smaller areas at the sides of the lower lens, leaving wide, clear distance and near zones but steeper rises between them. A **soft** design spreads it out: lower peaks and gentler changes, with smaller clear zones. Modern **free-form** lenses compute the surface for the wearer's own position of the glasses (vertex distance, tilt, wrap). Doubling the addition doubles the astigmatism; halving the corridor length doubles its rate.

### Fitting and adaptation
The fitting cross must lie in front of the pupil to within a millimetre or two, which makes the fitting height and PD measurements critical ([[fitting-measurements-and-the-lensmeter]]). Looking sideways through the lower lens meets the blurred zones; the wearer turns the head instead, and the sideways *swim* of the picture is the most common complaint. Most wearers adapt within days to a couple of weeks; some take longer.

> [!warn] This page explains the optics. Whether a progressive lens suits a person, and which design, is for an eye-care practitioner to judge; a sudden change in vision, or new flashes or floaters, call for prompt eye care.

> [!key] The power rises smoothly along the corridor; the astigmatism at the sides rises about twice as fast, and it cannot be removed. Designs only choose where it goes and how steeply it rises.
`,
  ideas: [
    'The power changes smoothly from the distance power at the top to distance plus addition at the bottom along a corridor of about 11–18 mm.',
    'The fitting cross is placed in front of the pupil; the near zone is shifted slightly toward the nose.',
    'Minkwitz\'s theorem: the astigmatism grows sideways at about twice the rate at which the power changes along the corridor, so it cannot be removed.',
    'A shorter corridor or a larger addition makes the astigmatism steeper and larger.',
    'Hard designs concentrate the astigmatism in small areas; soft designs spread it out.'
  ],
  pitfalls: [
    'A progressive lens has three powers: distance, intermediate and near — The power changes continuously; there are no steps, only a zone that is clearest at the top, one at the bottom, and a corridor in which every power in between is found once.',
    'The blur at the sides is a manufacturing fault better lenses avoid — It follows from geometry: a surface whose curvature changes smoothly must carry astigmatism (Minkwitz). A good design moves it, and shapes it; it cannot make it disappear.',
    'The whole lens is sharp for the wearer — Only the distance zone, the corridor and the near zone are; the lower sides are blurred. The head is turned, not the eyes, to look at something to one side while reading.',
    'The addition acts across the whole lower lens — It is reached only at the bottom of the corridor, in the near zone. The power is lower higher up, and zero in the distance zone.'
  ],
  terms: [
    { term: 'Progressive lens', also: ['progressive addition lens', 'PAL', 'varifocal', 'no-line multifocal'], def: 'A lens whose power increases smoothly from the distance power at the top to the distance power plus the addition in the lower part, with no visible line.' },
    { term: 'Corridor', also: ['channel', 'progression zone', 'corridor length'], def: 'The narrow part of a progressive lens in which the power rises from the distance to the near value. Its length is measured from the fitting cross to the full addition, typically 11–18 mm.' },
    { term: 'Fitting cross', also: ['fitting point', 'centration cross'], def: 'The mark on a progressive lens that is placed in front of the centre of the pupil when the wearer looks straight ahead; it fixes where the zones of the lens lie.' },
    { term: 'Unwanted astigmatism', also: ['peripheral astigmatism', 'swim'], def: 'The astigmatic error of a progressive lens at the sides of the corridor, not part of the prescription, which blurs the picture and makes it swim as the head turns.' },
    { term: 'Minkwitz\'s theorem', def: 'Near the corridor of a progressive surface the unwanted astigmatism increases sideways at about twice the rate at which the mean power changes along the corridor.' },
    { term: 'Hard design and soft design', def: 'Two philosophies of progressive lens: the hard design gathers the unwanted astigmatism in small areas and keeps wide clear zones; the soft design spreads it out for gentler changes and smaller clear zones.' },
    { term: 'Inset', also: ['near inset'], def: 'The displacement of the near zone toward the nose relative to the distance centre, typically a couple of millimetres, which follows the convergence of the eyes in reading.' }
  ],
  formulas: [
    {
      name: 'Sideways astigmatism (Minkwitz)',
      expr: 'U = 2*A*x/L', tex: 'U \\approx \\frac{2\\,A\\,x}{L}',
      vars: {
        U: { name: 'unwanted astigmatism at the side of the corridor', q: 'optpower', unit: 'D' },
        A: { name: 'addition', q: 'optpower', unit: 'D', value: 2, min: 0.5, max: 4 },
        x: { name: 'sideways distance from the centre line', q: 'length', unit: 'mm', value: 3, min: 0, max: 15 },
        L: { name: 'corridor length', q: 'length', unit: 'mm', value: 14, min: 8, max: 25 }
      },
      solveFor: 'U',
      note: 'A rough estimate near the corridor from the average rate of change of power, A/L. The steepest rate is about 1.5 times larger, and designs saturate at larger distances.',
      stories: { U: 'A progressive lens with a {A} addition has a corridor {L} long. About how large is the unwanted astigmatism {x} to the side of the centre line?' }
    },
    {
      name: 'Where the near zone is in focus',
      expr: 'dn = 1/A', tex: 'd_n = \\frac{1}{A}',
      vars: {
        dn: { name: 'distance at which the near zone is in focus without focusing', q: 'length', unit: 'cm', tex: 'd_n' },
        A: { name: 'addition', q: 'optpower', unit: 'D', value: 2, min: 0.5, max: 4 }
      },
      solveFor: 'dn',
      note: 'For an eye corrected for distance and not focusing at all; the eye\'s own focusing widens the range.'
    }
  ],
  examples: [
    {
      title: 'How steep is the blur?',
      q: 'A progressive lens has a +2.00 D addition and a 14 mm corridor. Estimate the unwanted astigmatism 3 mm from the centre line.',
      steps: [
        { text: 'The average rate of change of power along the corridor:', tex: '\\frac{A}{L} = \\frac{2.00\\ \\mathrm{D}}{14\\ \\mathrm{mm}} = 0.143\\ \\mathrm{D/mm}' },
        { text: 'By Minkwitz\'s theorem the astigmatism grows twice as fast sideways:', tex: 'U \\approx 2 \\times 0.143 \\times 3 = 0.86\\ \\mathrm{D}' }
      ],
      a: 'About 0.9 D, enough to blur print.'
    },
    {
      title: 'A shorter corridor',
      q: 'The same addition over an 11 mm corridor: how does the sideways rate change?',
      steps: [
        { text: 'The average gradient is now', tex: '\\frac{2.00}{11} = 0.182\\ \\mathrm{D/mm}' },
        'The sideways rate doubles it: 0.36 D/mm against 0.29 D/mm for the 14 mm corridor, about 27 % higher.'
      ],
      a: 'About 27 % steeper: a shorter corridor trades gentleness for a smaller frame.'
    }
  ],
  quiz: [
    { q: 'Why can a progressive lens not be free of unwanted astigmatism?', choices: ['Because the glass is too thin', 'Because a smooth change of power along a surface necessarily brings astigmatism at its sides', 'Because the lenses are cut badly', 'Because the near zone is too small'], a: 1, why: 'Minkwitz\'s theorem: where the surface\'s power changes along the corridor, astigmatism develops at its sides, growing about twice as fast. Designs only move it around.' },
    { q: 'Shortening the corridor of a progressive lens with the same addition makes the unwanted astigmatism steeper.', a: true, why: 'The power must rise over a shorter distance, so its gradient is larger and the astigmatism at the sides rises faster, about twice as fast as the gradient.' },
    { q: 'A near addition of +2.50 D: at what distance, in centimetres, is the near zone in focus for an eye that does not focus at all?', answer: 40, unit: 'cm', why: '$d = 1/A = 1/2.50 = 0.40$ m.' },
    { q: 'Where is the unwanted astigmatism of a progressive lens largest?', choices: ['In the middle of the distance zone', 'At the sides of the corridor and the lower lens', 'Exactly on the fitting cross', 'Nowhere: it is zero'], a: 1, why: 'It grows sideways from the corridor and is largest in the lower sides, where the power has reached its full change but the surface must still blend into the rim.' },
    { q: 'The fitting cross of a progressive lens is placed…', choices: ['at the bottom of the lens', 'in front of the pupil with the eye looking straight ahead', 'at the optical centre of the near zone', 'at the nose edge'], a: 1, why: 'The cross fixes where the zones lie; if it is misplaced by more than a millimetre or two, the clear zones fall in the wrong places.' }
  ],
  applications: [
    'Spectacles for presbyopia with a power for every distance and no line, and sunglasses made the same way.',
    'Lenses for computer and office work with wider intermediate zones ([[occupational-and-computer-lenses]]).',
    'Free-form lens computation, in which the back surface is calculated for the wearer\'s frame position.',
    'The same optical problem in camera zoom lenses with continuously varying power, and in the design of aspheric lens surfaces.'
  ],
  history: 'A lens with a continuously varying power was patented by Owen Aves in 1907, but the first successful commercial progressive lens was made by Bernard Maitenaz in France in 1959. Minkwitz published his theorem on the astigmatism of such surfaces in 1963; computer-controlled grinding made free-form designs possible from around the year 2000.',
  sources: [
    'G. Minkwitz, "Über den Flächenastigmatismus bei gewissen symmetrischen Aspheren", *Optica Acta* 10 (1963) — the sideways rise of astigmatism.',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the chapter on progressive power lenses.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — progressive power lenses and their fitting.',
    'ISO 13666, *Ophthalmic optics — Spectacle lenses — Vocabulary* — progressive-power lens, fitting cross, addition.'
  ],
  sim: 'sp-pal'
},

/* ================================================================ 9 */
{
  id: 'occupational-and-computer-lenses', parent: 'spectacles-and-contact-lenses', title: 'Occupational and computer lenses', level: 2,
  short: 'Desk work happens at 50–100 cm, where bifocals have a gap and progressive lenses a narrow corridor. Occupational lenses shift the power range toward near: the strongest power at the bottom, weaker above, so the view from the working distance to a chosen range is wide and no distance zone is provided.',
  keywords: ['occupational lens', 'office lens', 'degressive lens', 'room lens', 'computer glasses', 'screen distance', 'intermediate vision', 'working distance', 'depth of focus', 'accommodative reserve', 'single vision for screen', 'double bifocal', 'digital eye strain'],
  prereq: ['progressive-lenses', 'bifocals-and-trifocals', 'accommodation'],
  related: ['presbyopia', 'spectacle-lens-coatings', 'flicker-and-persistence-of-vision', 'ergonomics:visual-ergonomics', 'ergonomics:displays-design', 'reading-a-prescription'],
  body: `
A general-purpose progressive lens is built for walking about: distance at the top, reading at the bottom, a narrow corridor for everything between. Desk work does not fit that: a screen at 70 cm and a page at 40 cm sit in the middle of the range, where a bifocal has a gap and a progressive lens offers a few millimetres of clear corridor. **Occupational** lenses shift the whole power range toward near, to widen the zones that the work uses.

### The arithmetic of reach
With a lens of power $A$ in front of it, an eye that can use an amount of focusing $a$ keeps in focus the objects whose **proximity** $1/d$ (in dioptres, $d$ in metres) lies between $A - 0.25$ and $A + a + 0.25$: the amplitude it can use and its **depth of focus** of about 0.25 D on each side. Practitioners usually count on about *half* the average amplitude, the rest being kept in reserve to avoid fatigue. For a person of 58 years, whose average amplitude is 1.1 D, with an addition of +2.25 D (the simulation draws these):

| Lens | Sharp from … to … |
|---|---|
| Distance only | 125 cm to infinity |
| Reading only | 33 cm to 50 cm |
| Bifocal | 125 cm to infinity, and 33 to 50 cm: nothing between |
| Progressive | 33 cm to infinity, through different parts of the lens |
| Office lens, to 4 m | 33 cm to 4 m, no infinity |

The screen at 70 cm falls in the bifocal's gap, but inside the office lens's range.

### The kinds
- **Single vision for the screen**: one power, wide and free of unwanted astigmatism, clear over a short range.
- **Bifocals and trifocals** with the segment set for the screen or the page, and **double segments** with a near part above as well, for overhead work.
- **Degressive lenses** ("office" or "room" lenses): a progressive lens whose distance zone is replaced by an intermediate one. The power is greatest at the bottom, for reading, and *falls* toward the top, so that the range runs from the page to a chosen limit, typically about 1 m, 2 m or 4 m. The corridor is long and wide, the astigmatism small.
- **Progressive lenses with wide intermediate zones**, for people who need distance occasionally.

### Where the screen goes
Through a bifocal or an ordinary progressive lens the screen is seen through the lower part, so a monitor set high makes the head tip back; a lens for the screen allows the monitor at desk height and the head level. Focusing is one factor among several in screen comfort: blinking slows during concentrated screen work, and glare, viewing height, lighting and pauses matter as much ([[ergonomics:visual-ergonomics]]).

> [!warn] An office lens has no distance zone: objects across the street are blurred through it by design, and it is not meant for walking about outdoors or for driving. How a person's glasses are arranged is for an eye-care practitioner to decide.

> [!key] Each lens gives a window of sharp distances: from the nearest the eye can use through the lens power to the farthest the lens's weakest power allows. Occupational lenses move the window toward near and widen it where the work is.
`,
  ideas: [
    'With a lens of power A, objects at proximity between A − 0.25 D and A + a + 0.25 D stay sharp (a is the focusing in use).',
    'Practitioners count on about half the average amplitude; the amplitude falls with age to near zero by the early sixties.',
    'A bifocal has a gap between its zones, where the screen at 70 cm often falls.',
    'A degressive (office) lens has its strongest power at the bottom and weaker above, covering from the page to a chosen range such as 4 m.',
    'An office lens has no distance zone; it is not for walking about or driving.'
  ],
  pitfalls: [
    'A progressive lens covers the screen distance as well as any lens — It does, but through a narrow corridor and only when the head is tipped to bring the screen into it; the wide intermediate zone of an office lens is easier at a desk.',
    'Computer glasses are just weaker reading glasses — They are set for a longer working distance and a different window: the strongest power sits at the bottom, with weaker power above, and the range is chosen to suit the work.',
    'Focusing effort is the only cause of discomfort at a screen — Blinking slows, glare, screen height and lighting, posture and long unbroken work all matter, and a lens cannot correct them.',
    'An occupational lens can replace everyday glasses — It has no distance zone by design; objects across a street are blurred through it, so it is meant for the work it was made for.'
  ],
  terms: [
    { term: 'Degressive lens', also: ['office lens', 'room lens', 'occupational progressive'], def: 'A progressive-type lens whose power is greatest at the bottom and decreases upward, covering distances from the page to a chosen limit (about 1 m to 4 m) with no distance zone.' },
    { term: 'Working distance', def: 'The distance from the eyes to the task: about 40 cm for a page, 50–70 cm for a screen, farther for a music stand or instrument panel. It decides which lens power the work needs.' },
    { term: 'Accommodative reserve', also: ['reserve of accommodation'], def: 'The part of the eye\'s available focusing power that is left unused during a task. A common rule of thumb keeps about half the amplitude in reserve.' },
    { term: 'Computer lens', also: ['screen lens', 'intermediate lens'], def: 'A lens made for the screen: a single-vision lens of intermediate power, or a design whose widest zone is for the middle distance.' },
    { term: 'Proximity', def: 'The reciprocal of a distance in metres, in dioptres: 0 D is infinity, 1 D one metre, 2.5 D forty centimetres. It adds directly to the power of a lens.' }
  ],
  formulas: [
    {
      name: 'Nearest sharp distance through a lens',
      expr: 'dn = 1/(A + Am*f + dof)', tex: 'd_n = \\frac{1}{A + f\\,a_m + \\delta}',
      vars: {
        dn: { name: 'nearest distance that stays sharp', q: 'length', unit: 'cm', tex: 'd_n' },
        A: { name: 'power of the lens at that part', q: 'optpower', unit: 'D', value: 2.25, min: 0, max: 4 },
        Am: { name: 'amplitude of accommodation', q: 'optpower', unit: 'D', value: 1.1, min: 0, max: 15, tex: 'a_m' },
        f: { name: 'fraction of the amplitude in use', value: 0.5, min: 0, max: 1 },
        dof: { name: 'depth of focus on the near side', q: 'optpower', unit: 'D', value: 0.25, min: 0, max: 1, tex: '\\delta' }
      },
      solveFor: 'dn',
      note: 'A rule of thumb for the reach of a lens, from the vergence arithmetic. The average amplitude at an age comes from Hofstetter\'s formula, 18.5 − 0.3 × age.',
      stories: { dn: 'A reading lens of {A} is worn by an eye with an amplitude of {Am}, of which a fraction {f} is used, with a depth of focus of {dof}. What is the nearest distance that stays sharp?' }
    },
    {
      name: 'Proximity of an object',
      expr: 'V = 1/d', tex: 'V = \\frac{1}{d}',
      vars: {
        V: { name: 'proximity', q: 'optpower', unit: 'D' },
        d: { name: 'distance of the object', q: 'length', unit: 'cm', value: 70, min: 5, max: 1000 }
      },
      solveFor: 'V',
      note: 'The vergence of light from an object at distance d: 1.43 D for a screen at 70 cm.'
    }
  ],
  examples: [
    {
      title: 'The reach of a reading lens',
      q: 'A person has an average amplitude of 2.9 D (age 52) and wears a single-vision reading lens of +1.75 D. Using half the amplitude and a depth of focus of 0.25 D, over what range of distances is the view sharp? Does it include a screen at 70 cm?',
      steps: [
        { text: 'The nearest distance:', tex: 'd_n = \\frac{1}{1.75 + 1.45 + 0.25} = \\frac{1}{3.45} = 0.29\\ \\mathrm{m}' },
        { text: 'The farthest, with no focusing in use and the depth of focus on the far side:', tex: 'd_f = \\frac{1}{1.75 - 0.25} = 0.67\\ \\mathrm{m}' }
      ],
      a: '29 cm to 67 cm. The screen at 70 cm is just outside the range: slightly blurred.'
    },
    {
      title: 'The proximity of the screen',
      q: 'What is the proximity of a screen at 70 cm, and what lens power alone would bring it into focus for an eye that does not focus?',
      steps: [
        { text: 'Proximity:', tex: 'V = \\frac{1}{0.70\\ \\mathrm{m}} = 1.43\\ \\mathrm{D}' },
        'A lens of +1.43 D, in front of an eye with its far point at infinity, makes light from 70 cm arrive parallel (allowing the 0.25 D of depth of focus either side).'
      ],
      a: '1.43 D: a lens of about +1.50 D would centre the view on the screen.'
    }
  ],
  quiz: [
    { q: 'Which lens keeps both a room at 4 m and a page at 40 cm sharp for the same person?', choices: ['A bifocal', 'A single-vision reading lens', 'A degressive office lens', 'A single-vision distance lens'], a: 2, why: 'A degressive lens runs from the full addition at the bottom to a low power at the top, covering from the page to a range such as 4 m. A bifocal leaves a gap, and the single-vision lenses cover only one window.' },
    { q: 'A single-vision reading lens of +2.00 D is worn. About how far away, in centimetres, is the farthest object that stays sharp (depth of focus 0.25 D)?', answer: 57, unit: 'cm', why: '$d_f = 1/(2.00 - 0.25) = 0.571$ m.' },
    { q: 'A degressive lens has its strongest power at the top.', a: false, why: 'The strongest power, the full addition, is at the bottom for reading. It falls toward the top, which is set for the intermediate range.' },
    { q: 'Why does a screen set high cause neck strain with a bifocal or progressive lens?', choices: ['The lens is too heavy', 'The screen is seen through the lower part of the lens, so the head tips back', 'The glass reflects the light', 'The prism changes with temperature'], a: 1, why: 'The power for the screen lies in the lower part of such lenses; a high screen forces the wearer to tip the head back to look through it.' },
    { q: 'Which statement is true of an office (degressive) lens?', choices: ['It gives the best view of the horizon', 'It has no distance zone', 'It has no addition', 'It has a visible line'], a: 1, why: 'By design the power at the top is for the intermediate range, not for infinity. Objects across the street are blurred.' }
  ],
  applications: [
    'Office and screen work, where the working distance is 50–100 cm.',
    'Musicians reading a music stand, librarians, hairdressers and dentists, whose tasks sit at fixed middle distances.',
    'Pilots and drivers of instrument-laden cabs, with trifocals or double segments for the panels above and below.',
    'People who work overhead, such as electricians and mechanics, who need a near zone above as well as below.'
  ],
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — the chapter on occupational and office lenses.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — accommodation, depth of focus and lenses for near work.',
    'ISO 9241 (series), *Ergonomics of human-system interaction* — viewing conditions for visual displays.'
  ],
  sim: 'sp-reach'
}
,

/* ================================================================ 10 */
{
  id: 'spectacle-lens-coatings', parent: 'spectacles-and-contact-lenses', title: 'Coatings on spectacle lenses', level: 2,
  short: 'A modern spectacle lens carries several thin layers: a hard coat against scratches, an antireflection stack that cuts the 4–7 % lost at each surface to under 1 %, a water- and oil-repellent top coat, and often an ultraviolet or blue-light filter. The antireflection stack is a thin-film design, and its residual reflection has a colour.',
  keywords: ['antireflection', 'AR coating', 'anti-glare', 'multicoat', 'hard coat', 'scratch resistant', 'hydrophobic', 'oleophobic', 'top coat', 'easy-clean', 'UV400', 'ultraviolet protection', 'blue light', 'blue-cut', 'blue-light filter', 'residual reflection', 'crazing', 'ghost images'],
  prereq: ['antireflection-coatings', 'spectacle-lens-materials', 'fresnel-reflection'],
  related: ['multilayer-coatings', 'how-coatings-are-made', 'angle-of-incidence-and-coatings', 'photochromic-tinted-and-polarized-lenses', 'laser-damage-and-coating-durability', 'optical-glass'],
  body: `
Every uncoated glass or plastic surface throws back some of the light that meets it: $R = ((n-1)/(n+1))^2$ at normal incidence, [[fresnel-reflection]]. A lens has two surfaces, and the higher its index the more it reflects. The losses make the lens dimmer, the reflections make ghost images and glare in night driving and in photographs, and the lens shows its own surroundings to anyone looking at the wearer. Coatings answer all of that, and a modern lens is built up of several layers.

### The antireflection stack
A thin layer of index $n_L$ and a quarter-wave thickness reflects the least when $n_L = \\sqrt{n_s}$ ([[antireflection-coatings]]). No durable material has an index as low as 1.22–1.32, so a single layer of MgF₂ ($n$ = 1.38) is a compromise, and a stack of alternating high- and low-index layers does better. The values below are the share of daylight (weighted by the eye's sensitivity) lost at one surface at normal incidence; the three-layer design is the simulation's example and is not tuned for each index.

| Material | Uncoated | Single MgF₂ layer | Three-layer broadband |
|---|---|---|---|
| CR-39 | 4.0 % | 1.45 % | 0.11 % |
| Polycarbonate | 5.2 % | 0.88 % | 0.31 % |
| High-index 1.60 | 5.4 % | 0.81 % | 0.35 % |
| High-index 1.67 | 6.3 % | 0.52 % | 0.60 % |
| High-index 1.74 | 7.4 % | 0.30 % | 0.96 % |

The residual reflection is not white. A coating tuned for green leaves the ends of the spectrum, so it looks purple, green or blue by design. Tilt the glasses and the layers' optical thickness changes, the minimum moves to shorter wavelengths, and the colour and the amount change: for the polycarbonate example, 0.31 % at normal incidence rises to 1.2 % at 50° ([[angle-of-incidence-and-coatings]]).

### The other layers
- A **hard coat**, a lacquer a few micrometres thick, protects soft plastics; the antireflection stack sits on it.
- A **top coat** a few nanometres thick, a fluorinated layer that repels water and oils, makes the surface easier to clean.
- **Ultraviolet protection** comes from the material (polycarbonate and Trivex absorb it themselves), from an absorber, or from the coating; a lens marked UV400 transmits essentially nothing below 400 nm. Ultraviolet from behind and from the side can also reflect from the *back* surface into the eye, so the back coating matters too.
- A **blue-light filter** absorbs or reflects a share of 400–450 nm light, and the lens looks faintly yellow. Marketing claims concern eye strain, sleep and retinal protection. Systematic reviews of trials, including a Cochrane review published in 2023, found little or no evidence of a benefit for eye strain from the clear filtering lenses tested, and the evidence on sleep and on the retina is limited.
### What goes wrong
Plastic expands more than the oxide layers when heated, so a lens left on a hot dashboard can **craze**, the coating cracking in a fine network. Coatings are tested for adhesion, abrasion and humidity, and cleaned as the lens maker advises.

> [!warn] The page describes what coatings do. Which lens, coating or filter suits a person is for an optician or eye-care practitioner to advise.

> [!key] A coating stack cuts the 4–7 % lost at each surface to under 1 %, with a residual colour that moves with the angle. Hard, top and filter layers are added for scratches, cleaning and ultraviolet; the claims for blue-light filters are weaker than for the others.
`,
  ideas: [
    'An uncoated lens reflects 4–7 % at each surface at normal incidence, $R = ((n-1)/(n+1))^2$, rising with the index.',
    'A thin-film antireflection stack lowers this to under 1 %; the residual reflection is coloured by design and shifts with angle.',
    'A hard coat protects plastic, a top coat repels water and oil, and UV protection comes from the material or an absorber.',
    'Ultraviolet from behind can reflect off the back surface, so the back matters too.',
    'The evidence that clear blue-light filtering lenses reduce eye strain is weak or absent in reviews of trials.'
  ],
  pitfalls: [
    'Antireflection coatings only make the glasses look better — They raise the transmitted light by about 8–14 % of the whole, cut ghost images and glare at night, and make the eyes visible to others; the looks are a side effect.',
    'The purple or green tint of the reflection means the coating is faulty or dirty — It is the residual reflection of a thin-film design, whose colour is set by the layers.',
    'Blue-light lenses are proven to reduce eye strain — The reviews of trials, including a Cochrane review of 2023, found little or no benefit; such lenses do absorb more 400–450 nm light, as the simulation shows.',
    'Ultraviolet protection only needs the front of the lens — Light arrives from the side and behind too, and can reflect from the back surface into the eye; a well-designed back coating limits this.'
  ],
  terms: [
    { term: 'Antireflection coating', also: ['AR coating', 'anti-glare', 'multicoat'], def: 'A stack of thin layers deposited on a lens so that the reflections from its interfaces cancel, cutting the loss at each surface to under 1 %. Defined in the coatings topic.' },
    { term: 'Hard coat', also: ['scratch-resistant coating'], def: 'A lacquer a few micrometres thick applied to plastic lenses, harder than the plastic, which carries the antireflection stack and resists scratching.' },
    { term: 'Top coat', also: ['hydrophobic coating', 'oleophobic coating', 'easy-clean coating'], def: 'The outermost layer of a coated lens, a few nanometres of fluorinated material that repels water and oils so that the surface stays clean and is easy to wipe.' },
    { term: 'Residual reflection', also: ['reflex colour'], def: 'The light a good antireflection coating still reflects, typically under 1 %. It is coloured (purple, green or blue) and changes with the angle of view.' },
    { term: 'UV400', also: ['UV protection'], def: 'A label for lenses that transmit essentially no light of wavelengths below 400 nm. It describes transmission through the lens, not reflection from its back surface.' },
    { term: 'Blue-light filter', also: ['blue-cut', 'blue-light-blocking lens'], def: 'A lens that absorbs or reflects a share of violet and blue light, roughly 400–450 nm, and so looks faintly yellow. Claims for its health benefits are not firmly supported by trials.' },
    { term: 'Crazing', def: 'A network of fine cracks in a coating, caused for instance by heating a coated plastic lens, since the plastic expands more than the layers.' }
  ],
  formulas: [
    {
      name: 'Reflectance of an uncoated surface',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n - 1}{n + 1}\\right)^2',
      vars: {
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%' },
        n: { name: 'refractive index of the lens', value: 1.586, min: 1.2, max: 2.5 }
      },
      solveFor: 'R',
      note: 'Light in air at normal incidence. The value rises with the index.',
      stories: { R: 'One surface of a lens of index {n} is uncoated. What share of the light does it reflect at normal incidence?' }
    },
    {
      name: 'Transmission of a lens with two surfaces',
      expr: 'T = (1 - R)/(1 + R)', tex: 'T = \\frac{1 - R}{1 + R}',
      vars: {
        T: { name: 'transmittance, neglecting absorption', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%', value: 5.2 }
      },
      solveFor: 'T',
      note: 'Both surfaces alike, with the light reflected back and forth between them counted. Without it, $T \\approx (1 - R)^2$.'
    },
    {
      name: 'Residual reflection of one quarter-wave layer',
      expr: 'R = ((nl^2 - ns)/(nl^2 + ns))^2', tex: 'R = \\left(\\frac{n_L^2 - n_s}{n_L^2 + n_s}\\right)^2',
      vars: {
        R: { name: 'reflectance at the design wavelength', q: 'ratio', unit: '%' },
        nl: { name: 'index of the layer', value: 1.38, min: 1.1, max: 2.5, tex: 'n_L' },
        ns: { name: 'index of the lens', value: 1.6, min: 1.2, max: 2.5, tex: 'n_s' }
      },
      solveFor: 'R',
      note: 'Zero when $n_L = \\sqrt{n_s}$. MgF₂ ($n_L$ = 1.38) leaves 0.75 % on a 1.60 lens and 0.20 % on a 1.74 lens.'
    }
  ],
  examples: [
    {
      title: 'What an uncoated polycarbonate lens loses',
      q: 'Polycarbonate has $n$ = 1.586. What does one uncoated surface reflect at normal incidence, and what does a lens with two surfaces transmit?',
      steps: [
        { text: 'One surface:', tex: 'R = \\left(\\frac{0.586}{2.586}\\right)^2 = 0.0513' },
        { text: 'Two surfaces, with the interreflections:', tex: 'T = \\frac{1 - 0.0513}{1 + 0.0513} = 0.902' }
      ],
      a: '5.1 % per surface; 90.2 % transmitted, 9.8 % lost. A coating that leaves 0.3 % raises the transmission to 99.4 %.'
    },
    {
      title: 'A single MgF₂ layer on a high-index lens',
      q: 'How much does a quarter-wave layer of MgF₂ ($n$ = 1.38) leave at its design wavelength on a lens of index 1.74? What index would be ideal?',
      steps: [
        { text: 'The residual reflection:', tex: 'R = \\left(\\frac{1.38^2 - 1.74}{1.38^2 + 1.74}\\right)^2 = \\left(\\frac{0.164}{3.644}\\right)^2 = 0.0020' },
        { text: 'The ideal layer index:', tex: 'n_L = \\sqrt{1.74} = 1.32' }
      ],
      a: '0.20 % at the design wavelength. The ideal index is 1.32, close to MgF₂, which is why a simple layer works well on high-index lenses.'
    }
  ],
  quiz: [
    { q: 'Roughly what share of light does an uncoated 1.74 lens lose at its two surfaces together?', choices: ['4 %', '7 %', '14 %', '30 %'], a: 2, why: 'One surface reflects $((1.74 - 1)/(1.74 + 1))^2 = 7.3$ %; two surfaces transmit $(1 - R)/(1 + R) = 86.4$ %, so about 14 % is lost.' },
    { q: 'An antireflection coating is only cosmetic.', a: false, why: 'It raises the transmitted light, removes the ghost images and glare that reflections cause, in night driving and under bright light, and shows the wearer\'s eyes; the looks are one effect among several.' },
    { q: 'What is the reflectance of one uncoated surface of index 1.60, as a percentage?', answer: 5.33, unit: '%', why: '$R = (0.60/2.60)^2 = 0.0533$.' },
    { q: 'Why does the colour of the reflection from a coated lens change as you tilt it?', choices: ['The coating dissolves', 'The optical thickness of each layer changes with the angle of the light, moving the interference minimum', 'Dust collects on the surface', 'The lens expands'], a: 1, why: 'The path through a layer is shorter in effect at an angle; the layers are tuned for normal incidence, so the minimum shifts to shorter wavelengths and its colour changes.' },
    { q: 'Which layer sits outermost on a typical coated lens?', choices: ['The hard coat', 'The water- and oil-repellent top coat', 'The lens material', 'The ultraviolet absorber'], a: 1, why: 'The top coat, a few nanometres of fluorinated material, is the outermost layer; below it come the antireflection stack, the hard coat and then the lens.' }
  ],
  applications: [
    'Spectacle lenses for night driving and screen work, where reflected ghosts and glare are most noticed.',
    'Lenses seen on camera: antireflection coatings make the wearer\'s eyes visible in photographs and video.',
    'Sunglasses, where the back surface is coated to limit reflection of ultraviolet and visible light from behind.',
    'Sports and safety lenses with easy-clean top coats, and lenses in humid or dusty workplaces.'
  ],
  history: 'Alexander Smakula at Zeiss patented the vacuum-deposited antireflection coating in 1935; it was first used on camera and binocular lenses, and reached spectacles much later, once the coatings could be made durable on plastics.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — antireflection coatings and their colour.',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — coatings on spectacle lenses.',
    'J. G. Lawrenson and colleagues, "Blue-light filtering spectacle lenses for visual performance, sleep, and macular health in adults", Cochrane Database of Systematic Reviews (2023).',
    'E. Hecht, *Optics* — the chapter on interference, optical thin films.'
  ],
  sim: 'sp-coatings'
},

/* ================================================================ 11 */
{
  id: 'photochromic-tinted-and-polarized-lenses', parent: 'spectacles-and-contact-lenses', title: 'Photochromic, tinted and polarized lenses', level: 2,
  short: 'Sun lenses dim the light three ways: a tint absorbs, a photochromic lens darkens in ultraviolet and clears with time and warmth, and a polarized lens passes one direction of vibration and so removes much of the glare reflected from flat surfaces. The sunglass categories grade the darkness.',
  keywords: ['photochromic', 'tint', 'tinted lens', 'sunglasses', 'sunglass category', 'ISO 12312', 'polarized lens', 'polarising', 'glare', 'Brewster', 'gradient tint', 'mirror coating', 'light-adaptive', 'transmittance', 'driving', 'windscreen'],
  prereq: ['spectacle-lens-coatings', 'polarization-by-reflection-and-scattering', 'spectacle-lens-materials'],
  related: ['brewster-angle', 'polarizers-and-malus-law', 'polarization-in-practice', 'neutral-density-and-optical-density', 'fresnel-reflection', 'laser-eye-hazards-and-eyewear', 'light-and-dark-adaptation'],
  body: `
A lens can dim the light in three ways. A **tint** absorbs a fixed share. A **photochromic** lens changes how much it absorbs. A **polarized** lens does not dim in general at all but passes light of one vibration direction, which removes much of the glare reflected from flat surfaces.

### Tints and categories
A tint is a dye in the lens or a coating on it. Grey absorbs all colours alike, brown and green shift the colour balance, and a **gradient** is darker at the top. A **mirror coating** reflects part of the light. How dark a sun lens is graded by its luminous transmittance, in the categories of ISO 12312-1:

| Category | Transmittance | Typical use |
|---|---|---|
| 0 | 80–100 % | almost clear, fashion lenses |
| 1 | 43–80 % | dull light, mild sun |
| 2 | 18–43 % | medium sun |
| 3 | 8–18 % | bright sun, general use |
| 4 | 3–8 % | very strong sun; not suitable for driving |

The standard also sets limits on colour distortion for filters meant for driving, so that traffic signals stay recognizable.

### Photochromic lenses
The dye molecules (naphthopyrans in modern plastics, silver halide crystals in glass) switch to a coloured form when ultraviolet strikes them and relax back with time and warmth. The balance depends on the **ultraviolet** reaching the lens and on the **temperature**: in full sun, a lens may darken with a time constant of tens of seconds and clear with one of minutes; in the cold it settles darker and fades more slowly, in the heat it settles lighter and fades faster. A car windscreen absorbs most of the ultraviolet, so the lens stays only slightly tinted behind it, which is also why entering a tunnel on a bright day takes a while to clear. Typical clear states pass 80–90 % and darkened states 10–25 % at 23 °C; the simulation uses a two-state model with such numbers.

### Polarized lenses
Light reflected from a flat surface is partly polarized, most strongly at **Brewster's angle** (53° from the normal on water, 57° on glass), where the reflection is entirely polarized across the plane of incidence ([[polarization-by-reflection-and-scattering]]). For a horizontal surface that is horizontal vibration. A polarizing film, a stretched, iodine-stained sheet, mounted with its axis vertical, passes the vertical vibrations and blocks the horizontal ones. At Brewster's angle on water, an ideal polarizer removes all the reflected glare; for a head tilted 45° it does no better than a grey tint of equal transmittance, and at 90° it passes the horizontal glare freely. Other flat-surface glare (wet roads, snow, car bonnets) behaves alike. Side effects: **liquid-crystal displays** emit polarized light and can look dim or dark through the lens at some tilt, and stress in tempered car glass shows as patterns ([[polarization-in-practice]]).

> [!warn] These pages explain how sun lenses work; they are not advice on any person's choice. No sunglasses, of any category, are safe for looking at the Sun, an eclipse included; only filters made and certified for direct solar observation (ISO 12312-2) are. Seek urgent eye care after any bright flash or a sudden dark spot in the vision.

> [!key] A tint absorbs, a photochromic lens adapts to the ultraviolet and the temperature, a polarized lens removes the polarized part of glare. The categories grade the transmittance; category 4 is not for the road.
`,
  ideas: [
    'Sun lenses dim by absorption (tint), by adapting to ultraviolet (photochromic) or by passing one polarization (polarized).',
    'Sunglass categories 0–4 grade luminous transmittance: 80–100, 43–80, 18–43, 8–18 and 3–8 %.',
    'A photochromic lens darkens in tens of seconds and clears in minutes; it darkens less in the heat and behind a windscreen, which absorbs the ultraviolet.',
    'Light reflected from a horizontal surface is mostly horizontally polarized, entirely so at Brewster\'s angle; a polarizer with a vertical axis blocks it.',
    'A polarized lens tilted by 45° is no better than a grey tint of the same transmittance.'
  ],
  pitfalls: [
    'Photochromic lenses react to any light, so they darken inside a car — They respond mainly to ultraviolet, which a windscreen absorbs; some designs add a response to visible light, but the lens stays lighter behind glass.',
    'A polarized lens is simply a darker lens — The polarizer passes one direction of vibration. Its benefit is the glare of flat surfaces, which is mostly polarized; a polarized and a grey lens of equal transmittance treat other light alike.',
    'The darker the lens, the safer — Darker lenses protect against bright light, but category 4 is not for the road, and no sunglass is safe for looking at the Sun; only certified solar filters are.',
    'A photochromic lens performs the same at any temperature — It settles darker in the cold and fades more slowly, and settles lighter and clears faster in the heat.'
  ],
  terms: [
    { term: 'Photochromic lens', also: ['light-adaptive lens', 'reactive lens'], def: 'A lens containing dyes that darken when ultraviolet strikes them and fade again when it stops, at a rate that depends on the temperature.' },
    { term: 'Tint', also: ['dyed lens', 'gradient tint'], def: 'A fixed coloration of a lens, by dye in the material or in a coating, that absorbs a set share of light. A gradient tint is darker at the top than at the bottom.' },
    { term: 'Sunglass category', also: ['filter category', 'ISO 12312-1 category'], def: 'A grade from 0 to 4 given to sun lenses by their luminous transmittance; category 4 (3–8 %) is not suitable for driving.' },
    { term: 'Polarized lens', also: ['polarizing lens', 'polarised lens'], def: 'A lens containing a polarizing film with a vertical axis, which passes light vibrating vertically and blocks horizontal vibrations, and so removes much of the glare from flat surfaces.' },
    { term: 'Glare', also: ['veiling reflection'], def: 'Light reflected from a surface that brightens the scene and hides detail behind it, for example sunlight from water or a wet road.' },
    { term: 'Mirror coating', also: ['flash mirror'], def: 'A thin metal or dielectric layer on a sun lens that reflects part of the incident light, which adds to its dimming.' }
  ],
  formulas: [
    {
      name: 'Time constant of darkening',
      expr: 'tau = 1/(a*u + b)', tex: '\\tau = \\frac{1}{a\\,u + b}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's', tex: '\\tau' },
        a: { name: 'darkening rate in full sunlight', q: 'rate', unit: '1/s', value: 0.04 },
        u: { name: 'ultraviolet reaching the lens, relative to full sun', value: 1, min: 0, max: 1 },
        b: { name: 'fading rate at this temperature', q: 'rate', unit: '1/s', value: 0.006 }
      },
      solveFor: 'tau',
      note: 'A two-state model: darkening in proportion to the ultraviolet, fading at a rate that grows with temperature. The values are illustrative of the order of magnitude.'
    },
    {
      name: 'Where the darkening settles',
      expr: 'x = a*u/(a*u + b)', tex: 'x_\\infty = \\frac{a\\,u}{a\\,u + b}',
      vars: {
        x: { name: 'final fraction of full darkening', tex: 'x_\\infty' },
        a: { name: 'darkening rate in full sunlight', q: 'rate', unit: '1/s', value: 0.04 },
        u: { name: 'ultraviolet reaching the lens, relative to full sun', value: 1, min: 0, max: 1 },
        b: { name: 'fading rate at this temperature', q: 'rate', unit: '1/s', value: 0.006 }
      },
      solveFor: 'x',
      note: 'Less in the heat (larger b) and with less ultraviolet (smaller u).'
    },
    {
      name: 'Glare passed by a polarized lens',
      expr: 'G = Tax*(Rp*cos(ph)^2 + Rs*sin(ph)^2)/2', tex: 'G = \\frac{T_{ax}}{2}\\left(R_p\\cos^2\\varphi + R_s\\sin^2\\varphi\\right)',
      vars: {
        G: { name: 'share of the sunlight reaching the eye as glare' },
        Tax: { name: 'transmittance of the lens along its axis', value: 0.8, min: 0, max: 1, tex: 'T_{ax}' },
        Rp: { name: 'reflectance for the in-plane (p) vibration', value: 0.0119, min: 0, max: 1, tex: 'R_p' },
        Rs: { name: 'reflectance for the across-plane (s) vibration', value: 0.0309, min: 0, max: 1, tex: 'R_s' },
        ph: { name: 'tilt of the polarizer\'s axis from vertical', q: 'angle', unit: '°', value: 20, min: 1, max: 89, tex: '\\varphi' }
      },
      solveFor: 'G',
      note: 'For unpolarized sunlight reflected from a horizontal surface; with the axis upright (0°) only the p part passes. Water at 30° has Rp = 1.2 % and Rs = 3.1 %.'
    }
  ],
  examples: [
    {
      title: 'How fast does it darken?',
      q: 'In full sun the model gives a darkening rate of 0.040 s⁻¹ and a fading rate of 0.006 s⁻¹. What is the time constant of the darkening and how long does the lens take to reach half of its final darkness?',
      steps: [
        { text: 'The time constant:', tex: '\\tau = \\frac{1}{0.040 + 0.006} = 21.7\\ \\mathrm{s}' },
        { text: 'Half of the way to the final value takes', tex: 't_{1/2} = \\tau \\ln 2 = 15\\ \\mathrm{s}' }
      ],
      a: 'τ ≈ 22 s; about 15 s to reach half of the final darkness.'
    },
    {
      title: 'A lake at a low sun',
      q: 'At 80° from the normal on water the surface reflects $R_s$ = 45.7 % and $R_p$ = 23.9 % of the sunlight in the two vibrations. How much glare reaches the eye with no lens, with a grey tint passing 40 %, and with a polarized lens ($T_{ax}$ = 0.8, head upright)?',
      steps: [
        { text: 'No lens: the average of the two,', tex: '\\frac{45.7 + 23.9}{2} = 34.8\\ \\%' },
        'Grey tint: 0.40 × 34.8 % = 13.9 %.',
        { text: 'Polarized, axis vertical (φ = 0):', tex: 'G = \\frac{0.8 \\times 23.9}{2} = 9.6\\ \\%' }
      ],
      a: '34.8 % unaided, 13.9 % through the grey tint, 9.6 % through the polarized lens.'
    }
  ],
  quiz: [
    { q: 'Which sunglass category is not suitable for driving?', choices: ['Category 1', 'Category 2', 'Category 3', 'Category 4'], a: 3, why: 'Category 4, 3–8 % transmittance, is meant for very strong sun, such as high mountains and glaciers, and is too dark for the road.' },
    { q: 'A photochromic lens stays only slightly tinted behind a car windscreen.', a: true, why: 'Windscreen glass absorbs most of the ultraviolet that darkens the lens, so there is little to darken it; the lens takes minutes to clear when it comes in from the sun.' },
    { q: 'A polarized lens is tilted by 45°. Compared with a grey tint of equal transmittance, its glare reduction on water is…', choices: ['much better', 'about the same', 'much worse', 'zero for both'], a: 1, why: 'At 45° the polarizer passes half of each polarization of the reflection, so the glare is reduced by the same factor as for ordinary light: no better than a grey tint.' },
    { q: 'A photochromic lens darkens with a time constant of 20 s. How long does it take to reach half of its final darkness, in seconds?', answer: 13.9, unit: 's', why: '$t_{1/2} = \\tau \\ln 2 = 20 \\times 0.693 = 13.9$ s.' },
    { q: 'Which of these is safe for looking directly at the Sun?', choices: ['A category 4 sunglass', 'Two pairs of sunglasses worn together', 'A filter certified for direct solar observation (ISO 12312-2)', 'A polarized lens'], a: 2, why: 'Sunglasses of any kind transmit enough visible and infrared light to injure the retina when the Sun is looked at directly. Only filters certified for solar viewing are safe.' }
  ],
  applications: [
    'Sunglasses and prescription sun lenses by transmittance category, for driving, boating, skiing and the mountains.',
    'Photochromic lenses for people who move between indoors and outdoors and want one pair of glasses.',
    'Polarized lenses for anglers, boaters and drivers, where glare from water and wet roads dominates.',
    'Polarizing filters in photography and the stress patterns seen through them in car glass ([[polarization-in-practice]]).'
  ],
  history: 'Edwin Land made the first sheet polarizer in 1929 and polarizing sunglasses were sold from 1936. Photochromic glass was developed at Corning in the 1960s; photochromic plastic lenses became practical in the 1990s with new dyes.',
  sources: [
    'ISO 12312-1, *Eye and face protection — Sunglasses and related eyewear — Part 1: Sunglasses for general use* — the categories and their limits.',
    'ISO 12312-2, *Eye and face protection — Sunglasses and related eyewear — Part 2: Filters for direct observation of the sun*.',
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — tinted, photochromic and polarizing lenses.',
    'J. C. Crano and R. J. Guglielmetti (eds), *Organic Photochromic and Thermochromic Compounds* — the dyes of photochromic lenses.'
  ],
  sim: ['sp-photochromic', 'sp-glare']
}
,

/* ================================================================ 12 */
{
  id: 'contact-lenses', parent: 'spectacles-and-contact-lenses', title: 'Contact lenses', level: 2,
  short: 'A contact lens floats on the tear film of the cornea. Soft lenses drape over it, rigid gas-permeable lenses keep their shape and add a tear lens beneath them; toric designs carry a cylinder and must stay turned the right way, multifocal designs give distance and near images at once, and every design must let enough oxygen through.',
  keywords: ['contact lens', 'soft lens', 'hydrogel', 'silicone hydrogel', 'rigid gas permeable', 'RGP', 'scleral lens', 'toric', 'multifocal', 'monovision', 'tear lens', 'base curve', 'oxygen transmissibility', 'Dk', 'Dk/t', 'orthokeratology', 'hygiene'],
  prereq: ['vertex-distance-and-effective-power', 'how-spectacle-lenses-correct-vision', 'keratometry-and-corneal-topography'],
  related: ['cylinder-axis-and-transposition', 'presbyopia', 'astigmatism-of-the-eye', 'keratoconus-and-corneal-shape', 'intraocular-lenses-and-refractive-surgery', 'reading-a-prescription'],
  body: `
A contact lens is a thin lens that sits on the **tear film** covering the cornea, moves with the eye, and does the work of a spectacle lens from the surface of the eye. Because it is on the cornea its power is the effective power at the cornea ([[vertex-distance-and-effective-power]]).

### The families
| Family | Size, typical | Behaviour |
|---|---|---|
| **Soft** (hydrogel, silicone hydrogel) | diameter 13.8–14.5 mm, back radius 8.3–9.0 mm | drapes over the cornea and takes its shape; comfortable; the tears do not fill a gap |
| **Rigid gas-permeable** (RGP) | diameter 9–10 mm, back radius 7.4–8.2 mm | keeps its own shape; a tear lens forms behind it |
| **Scleral** | diameter 15–24 mm | vaults over the cornea and rests on the white of the eye, with a fluid reservoir beneath; used for irregular corneas |
| **Hybrid**, **orthokeratology** | | rigid centre with a soft skirt; rigid lenses worn overnight to reshape the cornea temporarily |

### The tear lens
Between a rigid lens and the cornea lies a film of tears, index 1.336, with the shape of the gap between two curves: it is a lens. If the back radius $R_b$ of the contact lens is *steeper* (smaller) than the corneal radius $R_c$ the film is thicker in the middle, a plus lens; if flatter, a minus lens:

$$F_t = 1000\\,(n_t - 1)\\left(\\frac{1}{R_b} - \\frac{1}{R_c}\\right) \\ \\text{dioptres, radii in mm}$$

For $R_c$ = 7.80 mm and $R_b$ = 7.70 mm, $F_t = +0.56$ D; every 0.05 mm of radius is about 0.28 D. The power ordered in air is $F_{cl} = P - F_t$, the power the eye needs less the tear lens ("steeper, add minus; flatter, add plus"). This also lets a spherical rigid lens neutralize most of the astigmatism of the front of the cornea: the film fills the cornea's toroidal gap. A soft lens drapes, its film is uniform, and corneal astigmatism is left in place, so **toric soft lenses** are made instead.

### Toric and multifocal designs
A toric lens carries a cylinder, so it must keep its axis: stabilized by a thicker lower edge (prism ballast), by truncation or by thin zones. If it settles $\\theta$ off its axis it leaves a residual cylinder of $2C\\sin\\theta$: a −2.00 D cylinder turned by 10° leaves 0.69 D. **Multifocal** lenses use *simultaneous vision*: rings or a smooth change of power put distance and near images on the retina together, and the brain attends to one; contrast falls and haloes appear at night. *Monovision* corrects one eye for distance and the other for near.

### Oxygen
The cornea has no blood vessels and draws its oxygen from the air through the tear film. A lens is characterized by its **permeability** $Dk$ (in barrer, 10⁻¹¹ cm²/s · mL O₂/(mL·mmHg)) and by its **transmissibility** $Dk/t$ with the thickness $t$ in cm, in units of 10⁻⁹: conventional hydrogels have Dk roughly 10 to 40 (rising with water content), silicone hydrogels roughly 60 to 150, and RGP materials from about 30 to well over 100. A thin lens passes more.

> [!warn] The page explains how the lenses work; it is not fitting advice. Wearing contact lenses carries a risk of infection and of injury to the cornea. Cleaning, storage, wearing time and replacement are set by the practitioner and the maker and should be followed. A red, painful or light-sensitive eye, or a sudden loss of vision, needs urgent eye care.

> [!key] A contact lens does the spectacle's job from the cornea: effective power, a tear lens under rigid designs, a cylinder that must hold its axis, and oxygen through the lens.
`,
  ideas: [
    'A contact lens works from the cornea, so its power is the effective power at the cornea and it changes picture size little.',
    'Under a rigid lens the tear film is a lens of power $(n_t - 1)(1/R_b - 1/R_c)$: plus if the lens is steeper than the cornea, minus if flatter.',
    'A soft lens drapes over the cornea and leaves corneal astigmatism; a rigid spherical lens neutralizes most of it.',
    'A toric lens that rotates by θ leaves a cylinder of $2C\\sin\\theta$; multifocal lenses show distance and near images at once.',
    'Oxygen reaches the cornea through the lens: the material\'s Dk and the thickness give Dk/t.'
  ],
  pitfalls: [
    'A contact-lens power is the same as the spectacle power — It is the effective power at the cornea, which differs for strong prescriptions, and a rigid lens also needs the tear lens allowed for.',
    'A soft lens corrects astigmatism as a rigid lens does — A soft lens takes the shape of the cornea and so does not mask its astigmatism; a rigid lens replaces the front surface with its own sphere, with a tear lens in the gap.',
    'A tight-fitting lens is a stronger lens — Steepness changes the tear lens by only 0.28 D per 0.05 mm of radius, and the lens\'s own power is separate; power comes from curvature differences, not from tightness.',
    'Lenses that let oxygen pass can be worn however long wanted — Oxygen is one factor; deposits, dryness, hygiene and fit matter too, and wearing schedules are set by the practitioner and the maker.'
  ],
  terms: [
    { term: 'Soft contact lens', also: ['hydrogel lens', 'silicone hydrogel lens'], def: 'A flexible lens of water-containing polymer that drapes over the cornea and a little beyond it, comfortable and quick to adapt to. Its tear film is uniform.' },
    { term: 'Rigid gas-permeable lens', also: ['RGP', 'GP lens', 'hard lens'], def: 'A small, firm lens of oxygen-permeable plastic that keeps its own shape on the cornea and forms a tear lens beneath it.' },
    { term: 'Tear lens', def: 'The film of tears between a rigid contact lens and the cornea, whose shape makes it a lens of power $(n_t - 1)(1/R_b - 1/R_c)$ with tear index $n_t$ = 1.336.' },
    { term: 'Base curve', also: ['BC', 'back optic zone radius'], def: 'For a contact lens, the radius of curvature of its back surface in millimetres, chosen in relation to the cornea\'s. (For a spectacle lens it means the front surface power.)' },
    { term: 'Oxygen transmissibility', also: ['Dk/t', 'Dk', 'permeability'], def: 'The measure of how much oxygen passes through a lens: the material\'s permeability Dk divided by the lens thickness t. Dk is in barrer; Dk/t is in units of 10⁻⁹.' },
    { term: 'Toric contact lens', also: ['toric soft lens'], def: 'A contact lens carrying a cylinder for astigmatism, built to stay turned the right way by thickening at the bottom, truncation or thin zones.' },
    { term: 'Simultaneous-vision multifocal', also: ['concentric multifocal', 'aspheric multifocal'], def: 'A multifocal lens that presents distance and near images on the retina at once, by rings of different power or a smooth change of power, leaving the brain to choose between them.' }
  ],
  formulas: [
    {
      name: 'Power of the tear lens',
      expr: 'Ft = (nt - 1)*(1/Rb - 1/Rc)', tex: 'F_t = (n_t - 1)\\left(\\frac{1}{R_b} - \\frac{1}{R_c}\\right)',
      vars: {
        Ft: { name: 'power of the tear lens', q: 'optpower', unit: 'D', signed: true, tex: 'F_t' },
        nt: { name: 'refractive index of tears', value: 1.336, min: 1.3, max: 1.4, tex: 'n_t' },
        Rb: { name: 'back radius of the contact lens', q: 'length', unit: 'mm', value: 7.7, min: 6.5, max: 9.5, tex: 'R_b' },
        Rc: { name: 'radius of the cornea', q: 'length', unit: 'mm', value: 7.8, min: 6.5, max: 9.5, tex: 'R_c' }
      },
      solveFor: 'Ft',
      note: 'A thin tear lens in the middle of the optic zone. Positive when the lens is steeper than the cornea.',
      stories: { Ft: 'A rigid lens with a back radius of {Rb} sits on a cornea of radius {Rc}. What is the power of the tear lens between them?' }
    },
    {
      name: 'Power to order in air',
      expr: 'Fcl = P - Ft', tex: 'F_{cl} = P - F_t',
      vars: {
        Fcl: { name: 'power of the lens in air', q: 'optpower', unit: 'D', signed: true, tex: 'F_{cl}' },
        P: { name: 'power the eye needs at the cornea', q: 'optpower', unit: 'D', value: -3, signed: true },
        Ft: { name: 'power of the tear lens', q: 'optpower', unit: 'D', value: 0.56, signed: true, tex: 'F_t' }
      },
      solveFor: 'Fcl',
      note: 'The contact lens and its tear lens together must supply the power the eye needs.'
    },
    {
      name: 'Cylinder left by a rotated toric lens',
      expr: 'Cr = 2*C*sin(th)', tex: 'C_r = 2\\,C\\,\\sin\\theta',
      vars: {
        Cr: { name: 'residual cylinder', q: 'optpower', unit: 'D', tex: 'C_r' },
        C: { name: 'cylinder of the lens', q: 'optpower', unit: 'D', value: 2, min: 0, max: 8 },
        th: { name: 'rotation of the axis', q: 'angle', unit: '°', value: 10, min: 0, max: 90, tex: '\\theta' }
      },
      solveFor: 'Cr',
      note: 'The magnitude of the cross-cylinder that remains when a cylinder is off its axis by θ; the axis of the residual is also different.',
      stories: { Cr: 'A toric lens with {C} of cylinder settles {th} off its axis. How large is the residual cylinder?' }
    },
    {
      name: 'Oxygen transmissibility',
      expr: 'DkT = Dk/(10000*t)', tex: 'T_{\\mathrm{O}_2} = \\frac{\\mathrm{Dk}}{10\\,t}',
      vars: {
        DkT: { name: 'transmissibility, in units of 10⁻⁹', tex: 'T_{\\mathrm{O}_2}' },
        Dk: { name: 'permeability of the material, in barrer', value: 100, min: 1, max: 300, tex: '\\mathrm{Dk}' },
        t: { name: 'thickness of the lens', q: 'length', unit: 'mm', value: 0.1, min: 0.02, max: 0.5 }
      },
      solveFor: 'DkT',
      note: 'Dk in barrer (10⁻¹¹ cm²/s · mL O₂/(mL·mmHg)), t in centimetres: Dk/t = Dk/(10 t) with t in millimetres, in units of 10⁻⁹.'
    }
  ],
  examples: [
    {
      title: 'Ordering a rigid lens',
      q: 'The eye needs −3.00 D at the cornea; the cornea has a radius of 7.80 mm and the lens has a back radius of 7.70 mm. What is the tear lens, and what is the power to be made in air?',
      steps: [
        { text: 'The tear lens:', tex: 'F_t = 1000 \\times 0.336 \\times \\left(\\frac{1}{7.70} - \\frac{1}{7.80}\\right) = +0.56\\ \\mathrm{D}' },
        { text: 'The power in air must supply the rest:', tex: 'F_{cl} = -3.00 - 0.56 = -3.56\\ \\mathrm{D}' }
      ],
      a: 'The tear lens is +0.56 D; the lens in air is −3.56 D.'
    },
    {
      title: 'A toric lens that has turned',
      q: 'A toric soft lens has a −2.00 D cylinder and rests 10° away from its axis. What cylinder is left uncorrected?',
      steps: [
        { text: 'Apply the misalignment relation:', tex: 'C_r = 2 \\times 2.00 \\times \\sin 10° = 0.69\\ \\mathrm{D}' }
      ],
      a: 'About 0.7 D, more than a third of the lens\'s cylinder, from a rotation of only 10°.'
    }
  ],
  quiz: [
    { q: 'A rigid lens is fitted 0.10 mm steeper than the cornea (7.70 against 7.80 mm). The tear lens has a power of about…', choices: ['+0.55 D', '−0.55 D', '0 D', '+5.5 D'], a: 0, why: 'A steeper lens leaves the film thicker in the middle, a plus lens: $1000 \\times 0.336 \\times (1/7.70 - 1/7.80) = +0.56$ D.' },
    { q: 'A soft contact lens neutralizes the astigmatism of the front of the cornea in the same way as a rigid lens does.', a: false, why: 'A soft lens drapes over the cornea and takes its shape, so the film beneath is uniform and the astigmatism remains; a rigid lens has its own spherical surface and a tear lens fills the toroidal gap.' },
    { q: 'A lens has permeability Dk = 120 and thickness 0.08 mm. What is its transmissibility Dk/t, in units of 10⁻⁹?', answer: 150, why: '$Dk/t = 120/(10 \\times 0.08) = 150$.' },
    { q: 'A toric lens with a −1.50 D cylinder settles 15° away from its axis. What cylinder is left, in dioptres?', answer: 0.78, unit: 'D', why: '$C_r = 2 \\times 1.50 \\times \\sin 15° = 0.78$ D.' },
    { q: 'Why do simultaneous-vision multifocal lenses reduce contrast?', choices: ['They are made of weaker material', 'Light from distant and near objects reaches the retina together, and the out-of-focus part veils the sharp one', 'They block ultraviolet', 'They are thicker at the edge'], a: 1, why: 'Rings or zones of different power send several images to the retina at once; the brain selects one, but the others add a haze and haloes.' }
  ],
  applications: [
    'Correcting short sight, long sight and astigmatism for people who prefer not to wear glasses, or whose strong prescriptions are better from the cornea.',
    'Rigid and scleral lenses for irregular corneas, where a spectacle lens cannot make a sharp image ([[keratoconus-and-corneal-shape]]).',
    'Multifocal and monovision lenses for presbyopia ([[presbyopia]]).',
    'Orthokeratology lenses worn overnight, and soft lenses with a tint for cosmetic or low-vision use.'
  ],
  history: 'Fick, Kalt and Müller made glass lenses that rested on the white of the eye in 1887–88. Kevin Tuohy\'s small plastic lens on the cornea followed in 1948, Otto Wichterle in Czechoslovakia made the first soft hydrogel lenses in the early 1960s, and silicone hydrogels arrived at the end of the 1990s.',
  sources: [
    'N. Efron, *Contact Lens Practice* — lens types, the tear lens, toric and multifocal designs.',
    'A. J. Phillips and L. Speedwell, *Contact Lenses* — the optics of contact lenses and the tear lens.',
    'B. A. Holden and G. W. Mertz, "Critical oxygen levels to avoid corneal edema for daily and extended wear contact lenses", *Investigative Ophthalmology & Visual Science* 25 (1984).',
    'ISO 18369 (series), *Ophthalmic optics — Contact lenses* — vocabulary and classification.'
  ],
  sim: 'sp-contact'
},

/* ================================================================ 13 */
{
  id: 'intraocular-lenses-and-refractive-surgery', parent: 'spectacles-and-contact-lenses', title: 'Intraocular lenses and refractive surgery', level: 3,
  short: 'Two ways to change the optics of an eye for good: replace or add a lens inside it, with a power calculated from the eye\'s length and the curvature of its cornea, or remove a lens-shaped layer from the front of the cornea with a laser, to a depth of about 12 micrometres for each dioptre over a 6 mm zone. The page explains the optics; whether any procedure suits a person is decided by a surgeon.',
  keywords: ['intraocular lens', 'IOL', 'cataract surgery', 'lens implant', 'monofocal', 'toric IOL', 'multifocal IOL', 'EDOF', 'phakic', 'biometry', 'axial length', 'effective lens position', 'LASIK', 'PRK', 'SMILE', 'excimer laser', 'Munnerlyn', 'optical zone', 'ablation depth'],
  prereq: ['vertex-distance-and-effective-power', 'contact-lenses', 'keratometry-and-corneal-topography'],
  related: ['cataract', 'the-eye-as-a-camera', 'myopia', 'presbyopia', 'keratoconus-and-corneal-shape', 'the-pupil', 'aberrations-of-the-eye'],
  body: `
The optics of the eye can be altered from the inside, by a lens implant, or from the front, by reshaping the cornea. Both are surgery, and both depend on measurements of the eye accurate to a tenth of a millimetre.

### The intraocular lens
When the natural lens has clouded ([[cataract]]) it is removed and an **intraocular lens** (IOL), a clear plastic optic about 6 mm across on supporting arms, is placed in the capsular bag. A **phakic** IOL is added in front of a natural lens that stays. The power comes from a vergence calculation: the cornea (power $K$) and the implant (power $P$, at an **effective lens position** $E$ behind the cornea) must bring light to the retina at the axial length $L$ in aqueous of index $n$ = 1.336,

$$P = \\frac{n}{L - E} - \\frac{n}{\\,n/K - E\\,}$$

with lengths in metres. For $L$ = 23.5 mm, $K$ = 43.5 D and $E$ = 5.25 mm this gives 20.7 D; implants are made in steps of 0.5 D, or 0.25 D. Every measurement counts: with the lens fixed, an eye 0.5 mm longer than measured shifts the result by about 1.3 D, a cornea 1 D steeper by 1.0 D, a lens 0.5 mm farther back by 0.7 D. Practical formulas (Haigis, SRK/T, Hoffer Q, Barrett and others) predict the position from other measurements. The simulation shows the simple form.

| Kind of IOL | What it does |
|---|---|
| Monofocal | one focus, usually for distance; glasses help for near |
| Toric | corrects corneal astigmatism; must be turned to its marked axis |
| Multifocal | rings or zones give several foci at once; the brain selects; haloes and lower contrast |
| Extended depth of focus | stretches one focus to cover intermediate distances, with fewer haloes |

### Reshaping the cornea
In **LASIK**, **PRK** and **SMILE** the front surface of the cornea is reshaped. An **excimer laser** (193 nm) breaks bonds in the tissue a fraction of a micrometre per pulse. To flatten a short-sighted cornea the tissue is removed in a lens-shaped layer, deepest at the centre. **Munnerlyn's relation** gives the depth at the centre, in micrometres,

$$t = \\frac{S^2 D}{3}$$

with the **optical zone** diameter $S$ in millimetres and the correction $D$ in dioptres: 12 µm per dioptre over 6 mm, 16 over 7 mm and 21 over 8 mm. A 3 D correction over 6 mm takes 36 µm of a cornea that is typically about 540 µm thick; the front radius lengthens from 7.80 mm to 8.32 mm. Surgeons plan from measurements of thickness, shape and curvature, because thinning weakens the cornea and some corneas are unsuitable ([[keratoconus-and-corneal-shape]]). Pupils larger than the zone at night can let light through the untreated edge, causing glare and haloes ([[the-pupil]]).

### After surgery
A cornea reshaped by a laser breaks the assumptions of the keratometer, which reads the front surface only and assumes a fixed relation to the back one; implant calculations after such surgery need special methods.

> [!warn] These pages explain the optics. They do not advise anyone whether to have an implant or surgery, which kind, or when. Sudden loss of vision, a curtain over the view, flashes and floaters, a painful red eye, or haloes with headache and nausea: seek urgent eye care.

> [!key] An implant's power follows from the length of the eye, the curvature of the cornea and the lens position; a laser takes $S^2D/3$ micrometres from the centre of a zone of diameter $S$. Both depend on exact measurement.
`,
  ideas: [
    'An implant\'s power comes from a vergence calculation using the axial length, the corneal power and the lens position.',
    'Small errors count: 0.5 mm of axial length shifts the result by over a dioptre.',
    'Monofocal, toric, multifocal and extended-depth-of-focus implants differ in how many foci they give.',
    'Munnerlyn: the depth at the centre of the removed layer is $t = S^2D/3$ µm, 12 µm per dioptre over a 6 mm zone.',
    'Depth grows as the square of the optical zone; the front radius of the cornea lengthens by about 0.5 mm for 3 D.'
  ],
  pitfalls: [
    'Implant lenses are standard sizes chosen by comfort — The power is calculated for each eye from its length, corneal curvature and the lens position, and is made to the nearest half-dioptre.',
    'Laser surgery changes the length of the eye — It leaves the length alone and flattens the front of the cornea by removing a lens-shaped layer of tissue, deepest at the centre.',
    'A multifocal implant uses different parts of the lens for different distances, like a progressive lens — Many put light from several distances through the same part of the optic at once and rely on the brain to pick one, at the cost of some haloes.',
    'A wider treatment zone only needs a little more tissue — The depth grows as the square of the zone diameter: widening 6 mm to 8 mm raises the depth for the same correction by 78 %.'
  ],
  terms: [
    { term: 'Intraocular lens', also: ['IOL', 'lens implant', 'pseudophakic lens'], def: 'A small artificial lens placed inside the eye, usually in the capsular bag after a cataract is removed, with a power calculated for the eye.' },
    { term: 'Effective lens position', also: ['ELP'], def: 'The distance from the cornea to the optical position of an implant, usually about 4.5–6 mm. It must be predicted and is one source of error in the power.' },
    { term: 'Biometry', also: ['axial length', 'keratometry'], def: 'The measurement of the eye needed for an implant: its length from cornea to retina, the curvature of the cornea and the depth of the front chamber.' },
    { term: 'Multifocal and extended-depth IOL', also: ['EDOF', 'diffractive IOL'], def: 'Implants that give more than one focus (multifocal) or an elongated focus (extended depth of focus) so as to see over a range of distances.' },
    { term: 'Excimer laser', def: 'An ultraviolet laser, usually 193 nm, that removes corneal tissue by breaking molecular bonds, a fraction of a micrometre per pulse, without heating the neighbouring tissue.' },
    { term: 'Optical zone', def: 'The central region of the cornea over which the refractive correction is made, typically 6–7 mm across, surrounded by a blend zone.' },
    { term: 'Munnerlyn\'s relation', def: 'The depth of tissue removed at the centre of the optical zone to correct a myopic error: $t = S^2D/3$ micrometres for a zone of diameter S mm and D dioptres.' }
  ],
  formulas: [
    {
      name: 'Implant power from the measurements',
      expr: 'P = n/(L - E) - n/(n/K - E)', tex: 'P = \\frac{n}{L - E} - \\frac{n}{n/K - E}',
      vars: {
        P: { name: 'power of the implant', q: 'optpower', unit: 'D' },
        n: { name: 'index of the aqueous and vitreous', value: 1.336, fixed: true },
        L: { name: 'axial length', q: 'length', unit: 'mm', value: 23.5, min: 18, max: 32 },
        E: { name: 'effective lens position', q: 'length', unit: 'mm', value: 5.25, min: 3, max: 7 },
        K: { name: 'power of the cornea', q: 'optpower', unit: 'D', value: 43.5, min: 36, max: 52 }
      },
      solveFor: 'P',
      note: 'A simple vergence formula for an eye aimed at distance vision; practical formulas refine E and K.',
      stories: { P: 'An eye is {L} long, its cornea has a power of {K} and the implant will sit {E} behind the cornea. What implant power puts distant objects in focus?' }
    },
    {
      name: 'Munnerlyn\'s depth of ablation',
      expr: 't = S^2*D/3', tex: 't = \\frac{S^2 D}{3}',
      vars: {
        t: { name: 'depth of tissue removed at the centre', q: 'length', unit: 'µm' },
        S: { name: 'diameter of the optical zone', q: 'length', unit: 'mm', value: 6, min: 4, max: 9 },
        D: { name: 'correction', q: 'optpower', unit: 'D', value: 3, min: 0.5, max: 12 }
      },
      solveFor: 't',
      note: 'For a myopic correction with a parabolic profile; the factor 3 corresponds to a corneal index of about 1.376.',
      stories: { t: 'A correction of {D} is made over an optical zone of {S}. How deep is the cut at the centre?' }
    },
    {
      name: 'Radius of the cornea after the treatment',
      expr: 'R2 = (nc - 1)/((nc - 1)/R1 - D)', tex: 'R_2 = \\frac{n_c - 1}{(n_c - 1)/R_1 - D}',
      vars: {
        R2: { name: 'radius after the treatment', q: 'length', unit: 'mm', tex: 'R_2' },
        nc: { name: 'index of the cornea', value: 1.376, fixed: true, tex: 'n_c' },
        R1: { name: 'radius before the treatment', q: 'length', unit: 'mm', value: 7.8, min: 6, max: 9.5, tex: 'R_1' },
        D: { name: 'correction of short sight', q: 'optpower', unit: 'D', value: 3, min: 0, max: 10 }
      },
      solveFor: 'R2',
      note: 'The front surface loses D dioptres of power: its radius lengthens.'
    }
  ],
  examples: [
    {
      title: 'An implant for a longer eye',
      q: 'An eye is 22.5 mm long with a cornea of 44.0 D and an implant position of 5.25 mm. What implant power puts distant objects in focus?',
      steps: [
        { text: 'The first term:', tex: '\\frac{1.336}{0.01725} = 77.45\\ \\mathrm{D}' },
        { text: 'The second: the focus of the cornea lies at $1.336/44.0 = 30.36$ mm; 5.25 mm farther, 25.11 mm:', tex: '\\frac{1.336}{0.02511} = 53.20\\ \\mathrm{D}' },
        'Their difference is the implant power, 24.25 D.'
      ],
      a: 'About 24.3 D: a shorter eye than the 23.5 mm example needs a stronger implant, about 3.5 D more.'
    },
    {
      title: 'Depth of a laser correction',
      q: 'How deep is the cut at the centre for 5 D over a 6.5 mm optical zone, and what share of a 540 µm cornea is that?',
      steps: [
        { text: 'Munnerlyn\'s relation:', tex: 't = \\frac{6.5^2 \\times 5}{3} = 70.4\\ \\mathrm{\\mu m}' },
        'As a fraction of 540 µm that is 13 %.'
      ],
      a: '70 µm at the centre, 13 % of the typical central thickness.'
    }
  ],
  quiz: [
    { q: 'For the same cornea and implant position, a shorter eye needs an implant that is…', choices: ['stronger', 'weaker', 'of the same power', 'a multifocal'], a: 0, why: 'The retina is nearer to the implant, so the light must converge more strongly to focus there: about 4 D more for each millimetre of shortness in the simple formula.' },
    { q: 'Doubling the diameter of the optical zone at the same correction multiplies the depth of ablation at the centre by…', choices: ['2', '4', '8', 'nothing: it does not change'], a: 1, why: 'Munnerlyn\'s relation is $t = S^2D/3$: the depth grows with the square of the zone diameter.' },
    { q: 'What is the depth at the centre, in micrometres, for 4 D over a 7 mm zone?', answer: 65.3, unit: 'µm', why: '$t = 7^2 \\times 4/3 = 65.3$ µm.' },
    { q: 'Which implant puts light from several distances on the retina at the same time, leaving the brain to select among them?', choices: ['A monofocal implant', 'A multifocal implant', 'A toric implant with one axis', 'None: all implants work alike'], a: 1, why: 'A multifocal implant has rings or zones of different power through which light from different distances reaches the retina together.' },
    { q: 'Why does an implant calculation need special care after laser surgery on the cornea?', choices: ['The eye has become shorter', 'The keratometer assumes a fixed relation between the front and back of the cornea, which the laser has broken', 'The implant is too small', 'The pupil has changed'], a: 1, why: 'A keratometer measures the front surface only and converts it to power by assuming a standard ratio of front to back; after a laser has reshaped the front, that ratio is no longer true.' }
  ],
  applications: [
    'Cataract surgery, in which the clouded lens is replaced by an implant whose power is calculated from the biometry.',
    'Phakic implants and clear-lens exchange for eyes whose errors are large.',
    'LASIK, PRK and SMILE for reducing the dependence on spectacles and contact lenses.',
    'Planning after surgery, where wavefront and corneal topography maps ([[keratometry-and-corneal-topography]]) guide further corrections.'
  ],
  history: 'Harold Ridley implanted the first intraocular lens in 1949, made of the plastic of aircraft canopies. Stephen Trokel and colleagues showed in 1983 that an excimer laser could shape the cornea, and LASIK developed in the 1990s.',
  sources: [
    'C. R. Munnerlyn, S. J. Koons and J. Marshall, "Photorefractive keratectomy: a technique for laser refractive surgery", *Journal of Cataract and Refractive Surgery* 14 (1988).',
    'J. T. Holladay and colleagues, "A three-part system for refining intraocular lens power calculations", *Journal of Cataract and Refractive Surgery* 14 (1988).',
    'D. A. Atchison and G. Smith, *Optics of the Human Eye* — the schematic eye and the optics of implants and corneal surgery.'
  ],
  sim: ['sp-iol', 'sp-laser']
},

/* ================================================================ 14 */
{
  id: 'fitting-measurements-and-the-lensmeter', parent: 'spectacles-and-contact-lenses', title: 'Fitting measurements and the lensmeter', level: 2,
  short: 'A lens is useful only when it sits right in front of the eye: the pupillary distance, the fitting height, the pantoscopic tilt, the wrap and the vertex distance place it. The lensmeter, or focimeter, then checks the finished lens by reading its sphere, cylinder, axis and prism.',
  keywords: ['fitting', 'dispensing', 'PD', 'pupillary distance', 'near PD', 'monocular PD', 'fitting height', 'segment height', 'pantoscopic tilt', 'wrap', 'face form angle', 'vertex distance', 'boxing system', 'eye size', 'bridge', 'effective diameter', 'decentration', 'lensmeter', 'focimeter', 'vertometer'],
  prereq: ['reading-a-prescription', 'vertex-distance-and-effective-power', 'prism-in-spectacles'],
  related: ['progressive-lenses', 'cylinder-axis-and-transposition', 'bifocals-and-trifocals', 'spectacle-lens-materials', 'the-phoropter-and-subjective-refraction', 'retinoscopy'],
  body: `
A prescription says what a lens must do; the **fitting measurements** say where it must be. A progressive lens set a few millimetres off, or a strong lens tilted, gives a different pair of glasses from the one prescribed. The **lensmeter** then checks the finished lens.

### What is measured
- **Pupillary distance (PD)**, in millimetres, between the pupil centres; the *monocular* PDs run from the middle of the nose to each pupil. Looking at a near object the eyes turn inward, and the line of sight crosses the lens closer to the nose. The **near PD** is $PD\\,(1 - 27/(d + 27))$ with $d$ the distance in mm to the object and 27 mm the typical distance from the lens to the eye's centre of rotation: 63 mm becomes 59.0 mm at 40 cm.
- **Fitting height**: from the pupil centre down to the lowest point of the lens opening in the frame; for a progressive lens it places the fitting cross, and the frame must be tall enough for the whole corridor ([[progressive-lenses]]).
- **Pantoscopic tilt**, the lower edge tilted toward the cheek, typically 8–12°, and **wrap** (face-form angle), the curve of the frame around the face. A lens tilted by $\\theta$ has an effective sphere $S(1 + \\sin^2\\theta/2n)$ and an induced cylinder $S'\\tan^2\\theta$: a +6.00 D lens in $n$ = 1.5 tilted 15° becomes +6.13 D with 0.44 D of cylinder, so strong lenses are made for their tilt.
- The **vertex distance** ([[vertex-distance-and-effective-power]]).

### The frame and the blank
Frames are marked in the **boxing system**, for example 52□18 140: an **eye size** $A$ of 52 mm, a bridge $DBL$ of 18 mm and temples of 140 mm. For one eye the optical centre must move $(A + DBL - PD)/2$ from the middle of the opening, 3.5 mm for a PD of 63 mm, and the uncut lens must be at least the frame's **effective diameter** plus twice that, plus a margin.

### The lensmeter
A **lensmeter** (focimeter, vertometer) measures the **back vertex power** of a lens held with its back surface against the stop. In the classical instrument a lit target sits in the focal plane of a standard lens of focal length $f_s$, so that its light is parallel; the lens under test is placed at the standard lens's second focal point, and a telescope views the target through it. The target is moved by $x$ until it is sharp, which is when the lens power is

$$F = \\frac{x}{f_s^2}$$

for $f_s$ = 50 mm each dioptre is 2.5 mm of travel. For a cylinder, the target lines of one direction come sharp at one drum setting and those at right angles at another: the reading nearer to plus is the sphere (in minus form), their difference the cylinder, the wheel angle at which the lines are along the cylinder's axis its axis. A prism moves the target away from the centre of the reticle, whose circles are 1 prism dioptre apart, in the direction of its base. The addition is read through the near zone. Modern automatic lensmeters send an array of beams through the lens and measure how each is bent, as in a wavefront sensor.

> [!warn] A lensmeter reads the lens in the glasses, not the eye. It tells whether the glasses match a prescription; it does not give a person their prescription, which an eye examination provides.

> [!key] The fitting measurements put the optical centre and the zones where the eyes look; the lensmeter reads the back vertex power, the cylinder, the axis and the prism of the finished lens.
`,
  ideas: [
    'The near PD is smaller than the distance PD because the eyes converge: 63 mm becomes about 59 mm at 40 cm.',
    'Fitting height places the fitting cross of a progressive lens in front of the pupil.',
    'Tilt and wrap change the effective sphere and add an induced cylinder, noticeably for strong lenses.',
    'The optical centre of each lens is moved by (A + DBL − PD)/2 from the middle of the lens opening.',
    'A lensmeter reads back vertex power: $F = x/f_s^2$; sphere, cylinder and axis come from two sets of lines, prism from the displacement of the target.'
  ],
  pitfalls: [
    'The PD is the same for near and far — The eyes turn in to read: the near PD is typically 3–4 mm smaller, and the lenses for reading are centred on it.',
    'The frame\'s eye size is the diameter of lens needed — It is the width of the opening; the uncut lens must also cover the decentration, so it is larger than the effective diameter by twice the decentration and a margin.',
    'A lensmeter measures a person\'s prescription — It measures the lens in the glasses; the prescription is measured on the eye by an examiner.',
    'Tilt and wrap are only about the look of the frame — A tilted or wrapped strong lens changes its effective sphere and induces a cylinder, and the lens may be designed for the tilt.'
  ],
  terms: [
    { term: 'Near PD', also: ['monocular PD', 'near pupillary distance'], def: 'The distance between the lines of sight at the lens when looking at a near target, a few millimetres less than the distance PD. A monocular PD is measured from the centre of the nose to one pupil.' },
    { term: 'Fitting height', also: ['segment height', 'OC height'], def: 'The vertical distance from the pupil centre, or the optical centre, to the lowest point of the frame opening. It places the fitting cross or the segment.' },
    { term: 'Pantoscopic tilt', def: 'The angle by which the lower edge of a spectacle lens is tilted toward the cheek, typically 8–12°. It changes the vertex distance and the power seen in the lower gaze.' },
    { term: 'Wrap', also: ['face-form angle', 'frame curve'], def: 'The angle by which the plane of the lens turns toward the temple from the plane of the face; sports and sun frames have the most.' },
    { term: 'Boxing system', also: ['eye size', 'DBL', 'bridge'], def: 'The way a frame is measured, as a box around each lens opening: eye size A (width), B (height), distance between lenses DBL, and the length of the temples, as in 52□18 140.' },
    { term: 'Lensmeter', also: ['focimeter', 'vertometer'], def: 'An instrument that measures the back vertex power, the cylinder, the axis, the prism and the addition of a spectacle lens, by looking at a target through it.' },
    { term: 'Effective diameter', also: ['ED'], def: 'Twice the greatest distance from the centre of a frame opening to its edge; with the decentration it fixes the size of the uncut lens that is needed.' }
  ],
  formulas: [
    {
      name: 'Decentration of each lens',
      expr: 'dec = (A + DBL - PD)/2', tex: 'c = \\frac{A + \\mathrm{DBL} - \\mathrm{PD}}{2}',
      vars: {
        dec: { name: 'decentration of one lens', q: 'length', unit: 'mm', signed: true, tex: 'c' },
        A: { name: 'eye size of the frame', q: 'length', unit: 'mm', value: 52, min: 30, max: 70 },
        DBL: { name: 'distance between the lenses', q: 'length', unit: 'mm', value: 18, min: 8, max: 30, tex: '\\mathrm{DBL}' },
        PD: { name: 'pupillary distance', q: 'length', unit: 'mm', value: 63, min: 45, max: 80, tex: '\\mathrm{PD}' }
      },
      solveFor: 'dec',
      note: 'Positive: the optical centre lies nearer the nose than the middle of the opening.',
      stories: { dec: 'A frame has an eye size of {A} and a bridge of {DBL}; the wearer\'s PD is {PD}. How far from the middle of each opening must the optical centre be placed?' }
    },
    {
      name: 'Near PD',
      expr: 'PDn = PD*(1 - c0/(d + c0))', tex: '\\mathrm{PD}_{n} = \\mathrm{PD}\\left(1 - \\frac{c_0}{d + c_0}\\right)',
      vars: {
        PDn: { name: 'near pupillary distance', q: 'length', unit: 'mm', tex: '\\mathrm{PD}_{n}' },
        PD: { name: 'distance PD', q: 'length', unit: 'mm', value: 63, min: 45, max: 80, tex: '\\mathrm{PD}' },
        c0: { name: 'distance from the lens to the centre of rotation of the eye', q: 'length', unit: 'mm', value: 27, fixed: true, tex: 'c_0' },
        d: { name: 'distance from the lens to the object', q: 'length', unit: 'cm', value: 40, min: 10, max: 600 }
      },
      solveFor: 'PDn',
      note: 'The lines of sight from the two centres of rotation cross a plane c₀ in front of them.',
      stories: { PDn: 'A wearer with a PD of {PD} reads at {d}. What is the near PD?' }
    },
    {
      name: 'Cylinder induced by tilt',
      expr: 'Ci = S*(1 + sin(th)^2/(2*n))*tan(th)^2', tex: 'C = S\\left(1 + \\frac{\\sin^2\\theta}{2n}\\right)\\tan^2\\theta',
      vars: {
        Ci: { name: 'induced cylinder', q: 'optpower', unit: 'D', tex: 'C' },
        S: { name: 'sphere of the lens', q: 'optpower', unit: 'D', value: 6, min: 0, max: 20 },
        th: { name: 'angle of tilt', q: 'angle', unit: '°', value: 15, min: 0, max: 40, tex: '\\theta' },
        n: { name: 'index of the lens', value: 1.5, min: 1.3, max: 2 }
      },
      solveFor: 'Ci',
      note: 'Martin\'s tilt formulae, for a thin lens turned about a horizontal axis; the effective sphere is S(1 + sin²θ/2n).',
      stories: { Ci: 'A {S} lens of index {n} is tilted by {th}. How much cylinder does the tilt induce?' }
    },
    {
      name: 'The lensmeter\'s drum',
      expr: 'F = x/fs^2', tex: 'F = \\frac{x}{f_s^2}',
      vars: {
        F: { name: 'power of the lens under test', q: 'optpower', unit: 'D', signed: true },
        x: { name: 'displacement of the target from the focal plane', q: 'length', unit: 'mm', signed: true, value: 5 },
        fs: { name: 'focal length of the standard lens', q: 'length', unit: 'mm', value: 50, min: 20, max: 200, tex: 'f_s' }
      },
      solveFor: 'F',
      note: 'Newton\'s equation: the target is moved by x so that the light leaves the lens under test parallel.',
      stories: { F: 'The target of a lensmeter with a standard lens of {fs} must be moved {x} to come sharp. What is the lens power?' }
    }
  ],
  examples: [
    {
      title: 'Placing the lenses in a frame',
      q: 'A frame is marked 52□18 140 and the wearer\'s PD is 63 mm. How far from the middle of each opening must the optical centre be, and what is the least diameter of the uncut lens if the frame\'s effective diameter is 58 mm and a margin of 2 mm is added?',
      steps: [
        { text: 'Decentration:', tex: 'c = \\frac{52 + 18 - 63}{2} = 3.5\\ \\mathrm{mm}' },
        'The uncut lens must reach 58 mm from the optical centre in every direction, which needs $58 + 2 \\times 3.5 + 2 = 67$ mm.'
      ],
      a: '3.5 mm toward the nose; an uncut lens of at least 67 mm.'
    },
    {
      title: 'The tilt of a strong lens',
      q: 'A +6.00 D lens of index 1.5 is tilted by 15°. What are its effective sphere and its induced cylinder?',
      steps: [
        { text: 'The effective sphere:', tex: 'S\' = 6.00\\left(1 + \\frac{\\sin^2 15°}{3}\\right) = 6.13\\ \\mathrm{D}' },
        { text: 'The induced cylinder:', tex: 'C = 6.13 \\tan^2 15° = 0.44\\ \\mathrm{D}' }
      ],
      a: '+6.13 D with 0.44 D of cylinder: a tenth of a dioptre more power and a cylinder larger than a quarter-dioptre step.'
    }
  ],
  quiz: [
    { q: 'A frame has an eye size of 50 mm and a bridge of 20 mm; the PD is 64 mm. By how much must each optical centre be decentred, in millimetres?', answer: 3, unit: 'mm', why: '$(A + DBL - PD)/2 = (50 + 20 - 64)/2 = 3$ mm, toward the nose.' },
    { q: 'The near PD is smaller than the distance PD because…', choices: ['the eyes converge, so the lines of sight cross the lens nearer the nose', 'the lens is thicker', 'the frame is bent', 'the pupils shrink'], a: 0, why: 'To look at a near object the eyes turn inward; where the lines of sight cross the spectacle plane the two points are closer together than the pupils at rest.' },
    { q: 'A lensmeter measures the front vertex power of the lens.', a: false, why: 'It measures the back vertex power, which is how spectacle lenses are specified: the lens is placed with its back surface against the stop.' },
    { q: 'A lensmeter has a standard lens of focal length 50 mm. The target is moved 5 mm to come sharp. What is the power of the lens, in dioptres?', answer: 2, unit: 'D', why: '$F = x/f_s^2 = 0.005/0.0025 = 2.0$ D.' },
    { q: 'Tilting a strong plus lens forward by 15°…', choices: ['changes nothing', 'raises the effective sphere a little and induces a cylinder', 'changes only the prism', 'removes the aberrations'], a: 1, why: 'Oblique light sees different power in the two meridians: the effective sphere rises as $S(1 + \\sin^2\\theta/2n)$ and a cylinder $S\'\\tan^2\\theta$ appears, 0.44 D for +6 D at 15°.' }
  ],
  applications: [
    'Dispensing: measuring the PD, fitting heights, tilt and vertex distance for each pair of glasses.',
    'Checking a finished pair against its prescription, and finding the power and prism of an old pair.',
    'Verifying progressive lenses by their engraved marks and the powers at their reference points.',
    'Designing lenses for the wearer\'s own position of wear, as in free-form progressive lenses.'
  ],
  history: 'The projection lensmeter, using a target at the focus of a standard lens, was developed in the early twentieth century and has changed little; the automatic lensmeters of the last decades replace the telescope with a sensor.',
  sources: [
    'M. Jalie, *Ophthalmic Lenses and Dispensing* — fitting measurements, the lensmeter and the effects of tilt and wrap.',
    'R. B. Rabbetts, *Bennett and Rabbetts\' Clinical Visual Optics* — the focimeter and oblique incidence.',
    'ISO 8624, *Ophthalmic optics — Spectacle frames — Measuring system and vocabulary* — the boxing system.',
    'ISO 8598-1, *Optics and optical instruments — Focimeters — Part 1: General purpose instruments*.'
  ],
  sim: 'sp-lensmeter'
}
);
