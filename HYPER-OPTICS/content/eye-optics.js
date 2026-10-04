/* HYPER-OPTICS · content/eye-optics.js — the topic "The eye as an optical system" (prefix ey- for the simulations).
 * anatomy-of-the-eye, the-eye-as-a-camera, accommodation, the-pupil, the-retina-rods-and-cones, the-fovea-and-visual-acuity,
 * contrast-sensitivity, the-visual-field, binocular-vision-and-stereopsis, eye-movements, light-and-dark-adaptation,
 * flicker-and-persistence-of-vision, aberrations-of-the-eye.
 * The numbers come from the standard schematic eye of the engine (Le Grand's eye with Navarro's surfaces), from the eye
 * tables of the engine and from calculations in the formulas of each page. The pages explain how the eye works; they never
 * diagnose and never tell a reader what to do about their own eyes.
 */
Hyper.add(

/* ================================================================ anatomy */
{
  id: 'anatomy-of-the-eye', parent: 'eye-optics', title: 'Anatomy of the eye', level: 1,
  short: `The eye is a nearly spherical globe about 24 mm long. Light enters through the clear cornea, crosses the aqueous humour, the iris and its pupil, the crystalline lens and the vitreous gel, and reaches the retina at the back, where receptors turn it into nerve signals that leave through the optic nerve.`,
  keywords: ['eye', 'anatomy of the eye', 'cornea', 'iris', 'pupil', 'lens', 'retina', 'vitreous', 'aqueous humour', 'sclera', 'choroid', 'ciliary body', 'fovea', 'macula', 'optic disc', 'blind spot', 'optic nerve', 'globe'],
  prereq: ['refractive-index', 'refraction-at-a-curved-surface', 'focal-length-and-optical-power'],
  related: ['the-eye-as-a-camera', 'accommodation', 'the-pupil', 'the-retina-rods-and-cones', 'the-fovea-and-visual-acuity', 'the-eye-examination', 'the-slit-lamp', 'physics:the-eye', 'medicine:vision'],
  body: `
Look into a mirror from close up and the eye shows its front: a white wall, a coloured ring and a black hole in the ring's middle. Behind that front is a fluid-filled globe about 24 mm long, with a clear window at the front, a lens inside and a screen of receptors at the back: a camera built of water and protein.

### The path of light
Light meets the parts in this order:

| Part | What it is | Index $n_d$ | In the standard model eye |
|---|---|---|---|
| Cornea | the clear front window | 1.377 | 0.55 mm thick, front radius 7.8 mm |
| Aqueous humour | clear watery fluid | 1.337 | 3.05 mm deep on the axis |
| Iris and pupil | a diaphragm and its hole | — | opening 2 to 8 mm |
| Crystalline lens | a flexible clear lens | 1.42 | 4.0 mm thick, 9–10 mm across |
| Vitreous humour | a clear gel | 1.336 | 16.6 mm behind the lens |
| Retina | the light-sensitive layer | — | about 0.25 mm thick |

These are the numbers of the standard schematic eye traced in the simulation; real eyes differ by a millimetre or so in length and by several dioptres in power.

### Where the bending happens
Nearly all of the eye's focusing is **refraction**, and most of it happens at the first surface. From air ($n = 1.000$) into the cornea ($n = 1.377$), the front surface, of radius 7.8 mm, has a power of $(1.377 - 1)/0.0078\\ \\mathrm{m} \\approx 48$ D. The back of the cornea, against the aqueous, takes about 6 D away again, so the whole cornea has close to 43 D: two thirds of the eye's 60 D. The lens gives 19 to 22 D, depending on the model, and matters more than its share because it can change ([[accommodation]]).

### Three coats and a lining
The **sclera** (opaque and white) and the **cornea** (transparent) form the tough outer coat. The middle coat, the **uvea**, is the **choroid** (a dark, blood-rich layer that feeds the retina and absorbs stray light), the **ciliary body** (the muscle that reshapes the lens, and the tissue that makes the aqueous humour) and the **iris**. The inner lining is the **retina**, a part of the brain, whose receptors lie at its *back*, behind the layers of nerve cells that process what they sense ([[the-retina-rods-and-cones]]).

### Two special places on the retina
The **fovea** is a pit in the centre of the macula, about 5° across, where the nerve cells are pushed aside and the cones are packed most densely: it sees sharpest, and the eye turns to put what it examines on it ([[the-fovea-and-visual-acuity]]). About 15° towards the nose lies the **optic disc**, where roughly 1.2 million nerve fibres leave and the blood vessels enter. It has no receptors, so a patch of the field is unseen: the blind spot ([[the-visual-field]]).

### Fluid and pressure
The ciliary body makes the aqueous humour, which drains at the angle between iris and cornea. Making and draining keep the globe at a typical pressure of 10 to 21 mmHg ([[tonometry]]); a raised pressure is a risk factor for [[glaucoma-and-the-visual-field|glaucoma]].

> [!warn] This page explains how an eye is built; it cannot say whether yours is healthy. Sudden loss of vision, a curtain over part of the view, new flashes or floaters, or a painful red eye need an examination at once: seek urgent eye care.

> [!key] Light crosses cornea, aqueous, pupil, lens and vitreous to reach the retina. The cornea does about two thirds of the focusing; the lens does the rest and can change. The fovea sees sharpest; the optic disc has no receptors.
`,
  ideas: [
    `Light crosses the cornea, aqueous humour, pupil, lens and vitreous gel before it reaches the retina.`,
    `The cornea gives about 43 D of the eye's 60 D; the lens gives the rest and is the part that can change.`,
    `The retina is a part of the brain, and its receptors lie at the back, behind the layers of nerve cells.`,
    `The fovea sees sharpest; the optic disc, 15° towards the nose, has no receptors and makes the blind spot.`,
    `The aqueous and the vitreous are clear fluids of almost the same index, 1.337 and 1.336.`
  ],
  pitfalls: [
    `The lens does most of the eye's focusing — About two thirds of the power is at the front surface of the cornea, where air meets tissue. The lens fine-tunes it. Under water the cornea almost loses its power (water has an index of 1.333, the cornea 1.377), which is why things are blurred without goggles.`,
    `Light falls directly on the receptors, like a camera sensor — The receptors lie behind layers of nerve cells and blood vessels. In the fovea those layers are pushed aside into a pit so that the light reaches the cones with the least scattering.`,
    `The pupil is a part of the eye that opens and closes — The pupil is only a hole; the iris, the ring of muscle around it, is what moves.`,
    `The blind spot is a hole that two eyes cover for each other, and that is all — The patch has no receptors at all. With one eye the brain fills it in with its surroundings, so you do not see a gap; with two eyes the other eye covers that part of the field.`
  ],
  terms: [
    { term: 'Cornea', def: `The clear, curved window at the front of the eye. Its front surface, where air meets tissue, does about two thirds of the eye's focusing.` },
    { term: 'Iris and pupil', also: ['diaphragm of the eye'], def: `The iris is the coloured ring of muscle that works as the eye's diaphragm; the pupil is the hole in it through which light enters. Its apparent diameter runs from about 2 to 8 mm.` },
    { term: 'Crystalline lens', also: ['lens of the eye'], def: `The clear, flexible lens behind the pupil. It changes shape to focus near and far, and it stiffens and may cloud with age.` },
    { term: 'Aqueous and vitreous humour', also: ['aqueous humor', 'vitreous humor', 'vitreous gel'], def: `The two clear fluids of the eye: the watery aqueous between cornea and lens, and the clear vitreous gel that fills the globe behind the lens. Both have an index of about 1.336 to 1.337.` },
    { term: 'Retina', def: `The light-sensitive layer lining the back of the eye: rods and cones, and the nerve cells that begin to process what they sense.` },
    { term: 'Fovea', also: ['macula', 'foveola'], def: `The pit at the centre of the macula, about 5° across, with the densest cones and the sharpest vision. Its centre, the foveola, is about 1° across and has no rods.` },
    { term: 'Optic disc', also: ['optic nerve head', 'blind spot'], def: `The place, about 15° from the fovea towards the nose, where the nerve fibres leave the eye. It has no receptors; the patch of the field it hides is the blind spot.` }
  ],
  formulas: [
    {
      name: 'Power of one refracting surface',
      expr: 'P = (n2 - n1)/R', tex: 'P = \\frac{n_2 - n_1}{R}',
      vars: {
        P: { name: 'power of the surface', q: 'optpower', unit: 'D', signed: true },
        n1: { name: 'index of the medium in front', value: 1.0, min: 1, max: 3, tex: 'n_1' },
        n2: { name: 'index of the medium behind', value: 1.377, min: 1, max: 3, tex: 'n_2' },
        R: { name: 'radius of curvature (positive when the centre lies beyond the surface)', q: 'length', unit: 'mm', value: 7.8, signed: true }
      },
      solveFor: 'P',
      note: 'The power in dioptres is the change of index divided by the radius in metres. A convex front surface (R > 0) between a lower and a higher index converges the light.',
      stories: { P: 'Light goes from a medium of index {n1} into one of index {n2} through a surface of radius {R}. What power does the surface have?', R: 'A surface between media of index {n1} and {n2} has a power of {P}. What is its radius of curvature?' }
    }
  ],
  examples: [
    {
      title: 'The front of the cornea',
      q: `The front surface of the cornea has a radius of 7.8 mm and separates air from tissue of index 1.377. What power does it have, and what share of the whole eye's 60 D is that?`,
      steps: [
        { text: 'Apply the power of a single surface:', tex: 'P = \\frac{n_2 - n_1}{R} = \\frac{1.377 - 1.000}{0.0078\\ \\mathrm{m}} = 48.3\\ \\mathrm{D}' },
        `The back surface of the cornea, a concave surface from index 1.377 into the aqueous at 1.337 with a radius of 6.5 mm, has $(1.337 - 1.377)/0.0065 \\approx -6.1$ D. Together, with the thin cornea between them, they give about 42.5 D.`,
        `That is about 71 % of 60 D: the first surface alone is stronger than the whole eye's power would suggest.`
      ],
      a: `48 D for the front surface and about 43 D for the whole cornea, which is two thirds to three quarters of the eye's power.`
    },
    {
      title: 'Why a swimmer sees badly',
      q: `Underwater the cornea meets water ($n = 1.333$) instead of air. What does the power of its front surface become?`,
      steps: [
        { text: 'Same formula with $n_1 = 1.333$:', tex: 'P = \\frac{1.377 - 1.333}{0.0078} = 5.6\\ \\mathrm{D}' },
        `The front surface loses about 43 of its 48 D. Traced through the model eye with water in front, the whole eye is left with about 21 D instead of 60, and the image of a distant object forms some 45 mm behind the retina.`
      ],
      a: `5.6 D: the cornea almost stops working. Goggles restore a layer of air in front of it, and with it the eye's power.`
    }
  ],
  quiz: [
    { q: 'Which part of the eye contributes the largest share of its focusing power?', choices: ['The cornea', 'The crystalline lens', 'The vitreous humour', 'The iris'], a: 0, why: `The front surface of the cornea, where air meets tissue, has a power of about 48 D, and the whole cornea about 43 D of the eye's 60 D. The lens gives the rest and is the part that changes shape.` },
    { q: 'The optic disc, where the nerve fibres leave the eye, has no receptors.', a: true, why: `The patch of the visual field it covers is the blind spot, about 15° from the line of sight towards the temple. We do not notice it because the brain fills it in and the other eye covers it.` },
    { q: 'A corneal front surface has a radius of 7.8 mm and separates air from tissue of index 1.377. What is its power, in dioptres?', answer: 48.3, unit: 'D', why: `$P = (1.377 - 1.000)/0.0078 = 48.3$ D. The back of the cornea takes about 6 D away again.` },
    { q: 'Why do things look blurred when you open your eyes under water?', choices: ['The cornea loses most of its power because water has nearly the same index', 'The lens stiffens in water', 'The pupil closes', 'The retina is washed out'], a: 0, why: `The first surface bends light because of the change of index. From water (1.333) into the cornea (1.377) the change is small, so the front surface has only about 6 D instead of 48 D.` },
    { q: 'Which structure changes its shape to focus on near objects?', choices: ['The crystalline lens, through the ciliary muscle', 'The cornea', 'The sclera', 'The retina'], a: 0, why: `The ciliary muscle slackens the fibres that hold the lens and the lens rounds up. The cornea does not change in this way.` }
  ],
  applications: [
    `Spectacles, contact lenses and laser surgery all change or replace the power of the cornea or the lens; every procedure starts from this anatomy.`,
    `An eye examination uses it: the slit lamp views the cornea, aqueous and lens in a thin slice of light, and an ophthalmoscope looks through the pupil at the retina and the optic disc.`,
    `Optical engineers use model eyes, built from these indices and radii, to test headsets, displays, intraocular lenses and ophthalmic instruments.`,
    `Diving masks and swimming goggles put a layer of air in front of the cornea so that its power is restored.`
  ],
  history: `Johannes Kepler recognised in 1604 that the lens of the eye forms an upside-down image on the retina, and Christoph Scheiner showed such images in the eyes of animals soon after. The standard models of the eye's optics were built by Allvar Gullstrand, who received the Nobel Prize in Physiology or Medicine in 1911 for his work on the way the eye forms images.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — the dimensions, indices and powers of the eye and of its schematic models.`,
    `J. Schwiegerling, *Field Guide to Visual and Ophthalmic Optics* (SPIE, 2004) — the eye's structure and optics on one page each.`,
    `*Handbook of Optics*, volume III, *Vision and Vision Optics* (McGraw-Hill) — the anatomy and the optical properties of the ocular media.`
  ],
  sim: 'ey-anatomy'
},

/* ================================================================ the eye as a camera */
{
  id: 'the-eye-as-a-camera', parent: 'eye-optics', title: 'The eye as a camera', level: 1,
  short: `Seen as an instrument, the eye is a camera: a lens of about 60 dioptres and 16.7 mm focal length, an iris that runs from f/8 to f/2, and a curved sensor at the back that holds an upside-down image. It differs from a camera in what matters: it is sharp only in the middle, it refocuses by changing the lens, and the brain does the rest.`,
  keywords: ['eye as a camera', 'schematic eye', 'reduced eye', 'power of the eye', '60 dioptres', 'retinal image', 'inverted image', 'f-number of the eye', 'nodal point', 'focal length of the eye', 'image on the retina'],
  prereq: ['anatomy-of-the-eye', 'focal-length-and-optical-power', 'the-f-number'],
  related: ['accommodation', 'the-pupil', 'the-pinhole-camera', 'how-a-camera-works', 'cardinal-points', 'field-of-view-and-focal-length', 'real-and-virtual-images', 'physics:the-eye'],
  body: `
Take away the biology and the eye is an optical instrument with a recognisable list of parts. The cornea and the lens together are the objective lens; the pupil is the aperture; the retina is the sensor; the muscles that change the lens are the focusing mechanism. The difference from a camera is that nothing in the eye is fixed except the retina's place, and that most of the processing happens after the image is taken.

### The numbers of the traced eye
A standard schematic eye, traced ray by ray in the simulation, gives:

| Quantity | Value |
|---|---|
| Power of the whole eye | 59.9 D |
| Cornea alone, lens alone | about 42.5 D and 22 D (they do not simply add: several millimetres separate them) |
| Focal length in air terms, $f = 1/P$ | 16.7 mm |
| Focal length towards the retina, $n' f$ | 22.3 mm (the index of the vitreous is 1.336) |
| Length of the eye | 24.2 mm |
| Scale on the retina | 0.291 mm per degree, 4.85 µm per arc-minute |

The last row is the one that links everything else: the image of an object that subtends an angle $\\theta$ has a height $h = f\\tan\\theta$ on the retina, so the Moon, half a degree wide, makes an image 0.15 mm across, and a person 1.8 m tall seen from 6 m (17°) an image 5 mm tall.

### The iris as a diaphragm
With the focal length fixed, the f-number is set by the pupil alone, $N = f/D$ with $D$ the apparent pupil:

| Pupil (mm) | 2 | 3 | 4 | 6 | 8 |
|---|---|---|---|---|---|
| f-number | f/8.3 | f/5.6 | f/4.2 | f/2.8 | f/2.1 |

So the eye is a lens that stops down from about f/8 in sunlight to about f/2 in the dark: four stops, a factor of 16 in the light admitted, against a range of a billion to one in the light the eye can work in. The pupil is only a small part of how the eye adapts ([[light-and-dark-adaptation]]).

### An upside-down picture
The image on the retina is inverted and reversed, exactly as in a camera: the top of the scene lands on the bottom of the retina. The brain has never known any other arrangement and interprets it the right way up; people who wear inverting lenses for days adapt to them, and the world turns upright again.

### Where the eye is not a camera
- **Its sensor is curved**, which helps keep a wide field in focus, and it is *not uniform*: sharp only in the central degree or two ([[the-fovea-and-visual-acuity]]), so the eye moves constantly ([[eye-movements]]).
- **Its optics are poor off the axis** and only moderately good on it, as [[aberrations-of-the-eye]] shows; the brain compensates.
- **It focuses by changing the power of the lens**, not by moving it ([[accommodation]]).
- **Its receptors face away from the light**, behind the nerve-cell layers.
- **There is no shutter**: the eye signals continuously, and the brain builds a stable picture from three or four fixations a second.

> [!key] The eye is a 60 D lens of 16.7 mm focal length with an iris that works from f/8 to f/2, forming an inverted image on a curved retina at 0.29 mm per degree. It is a camera only in its optics: the sensor, the focusing and the processing are all different.
`,
  ideas: [
    `The whole eye has a power of about 60 D, a focal length of 16.7 mm and a length of 24 mm.`,
    `The image of an object of angular size θ on the retina has a height f tan θ: 0.29 mm for each degree.`,
    `With a fixed focal length the pupil alone sets the f-number, from about f/8 (2 mm) to f/2 (8 mm).`,
    `The retinal image is upside down; the brain interprets it the right way up.`,
    `Unlike a camera the eye has a curved, uneven sensor, changes the power of its lens to focus, and has no shutter.`
  ],
  pitfalls: [
    `The brain turns the upside-down image over, like a computer rotating a picture — There is no picture to rotate. The brain's wiring simply treats "up in the world" as the lower retina; a person wearing inverting lenses learns, over days, to treat the new arrangement as the normal one.`,
    `The eye focuses by moving its lens, like a camera — The distance between lens and retina does not change. The eye refocuses by making the lens rounder, which raises its power ([[accommodation]]).`,
    `The eye's f-number is fixed at about f/2 — With a focal length of 16.7 mm and a pupil of 2 to 8 mm it runs from f/8 to f/2; only in the dark is it a fast lens.`,
    `The eye sees everything in a wide field as sharply as a camera does — Only the central degree or two is sharp; the rest of the field is coarse and the brain fills in detail from where the eye has just looked.`
  ],
  terms: [
    { term: 'Schematic eye', also: ['model eye', 'Gullstrand eye', 'Le Grand eye'], def: `A table of radii, thicknesses and indices that reproduces the optics of an average eye. It is used to calculate and to trace rays through the eye.` },
    { term: 'Reduced eye', def: `The simplest model of the eye: a single refracting surface and a single medium, with a focal length of about 17 mm and the retina about 22 mm behind the surface.` },
    { term: 'Dioptre', also: ['D', 'diopter', 'vergence'], def: `The unit of optical power, the reciprocal of the focal length in metres. The relaxed eye has a power of about 60 D.` },
    { term: 'Nodal point', def: `A point of an optical system such that a ray aimed at it leaves at the same angle. In the eye the rear nodal point is about 7.5 mm behind the cornea, 16.7 mm in front of the retina; angles in the world become distances on the retina by this length.` },
    { term: 'Retinal image', def: `The picture that the eye's optics form on the retina: inverted, small (0.29 mm per degree of the scene) and sharp only in the middle.` },
    { term: 'f-number of the eye', def: `The eye's focal length divided by the diameter of its pupil, from about f/8 with a 2 mm pupil to about f/2 with an 8 mm pupil.` }
  ],
  formulas: [
    {
      name: 'Size of the image on the retina',
      expr: 'h = f*tan(theta)', tex: 'h = f\\tan\\theta',
      vars: {
        h: { name: 'height of the image on the retina', q: 'length', unit: 'mm' },
        f: { name: 'focal length of the eye (in air terms)', q: 'length', unit: 'mm', value: 16.7 },
        theta: { name: 'angle that the object subtends', q: 'angle', unit: '°', value: 10, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'h',
      note: 'The retina is curved, so this is exact only near the axis.',
      stories: { h: 'An object subtends {theta} at the eye. How tall is its image on the retina?', theta: 'An image on the retina is {h} tall. How large is the object, in angle?' }
    },
    {
      name: 'f-number of the eye',
      expr: 'N = f/D', tex: 'N = \\frac{f}{D}',
      vars: {
        N: { name: 'f-number' },
        f: { name: 'focal length of the eye', q: 'length', unit: 'mm', value: 16.7 },
        D: { name: 'diameter of the pupil (as seen from outside)', q: 'length', unit: 'mm', value: 4 }
      },
      solveFor: 'N',
      stories: { N: 'An eye of focal length {f} has a pupil {D} across. What is its f-number?', D: 'At what pupil diameter is the eye working at f/{N}?' }
    },
    {
      name: 'Power and focal length',
      expr: 'P = 1/f', tex: 'P = \\frac{1}{f}',
      vars: {
        P: { name: 'power', q: 'optpower', unit: 'D' },
        f: { name: 'focal length (in air terms)', q: 'length', unit: 'mm', value: 16.7 }
      },
      solveFor: 'P',
      note: 'The eye has 60 D, so f = 16.7 mm; the focal length in the vitreous is longer by its index, 1.336.'
    }
  ],
  examples: [
    {
      title: 'The Moon on the retina',
      q: `The Moon subtends 0.52°. How large is its image on the retina of an eye of focal length 16.7 mm, and how many cones, 0.5 arc-minute apart in the fovea, does it cover side by side?`,
      steps: [
        { text: 'The size of the image:', tex: 'h = f\\tan\\theta = 16.7\\ \\mathrm{mm} \\times \\tan 0.52° = 0.152\\ \\mathrm{mm}' },
        `Its width is $0.52 \\times 60 = 31$ arc-minutes. With cones 0.5′ apart that is about $31/0.5 = 62$ cones across.`
      ],
      a: `0.15 mm, about 60 cones wide: the full Moon is a small disc even in the sharpest part of the retina.`
    },
    {
      title: 'Two stops',
      q: `A pupil opens from 3 mm to 6 mm. What are the two f-numbers, and how much more light enters?`,
      steps: [
        `$N = f/D$: $16.7/3 = 5.6$ and $16.7/6 = 2.8$.`,
        `The light follows the area, $(6/3)^2 = 4$ times, which is two stops: from f/5.6 to f/2.8.`
      ],
      a: `f/5.6 and f/2.8; four times the light (two stops).`
    }
  ],
  quiz: [
    { q: 'About how large is the image of a person 1.8 m tall, seen from 6 m, on the retina?', choices: ['About 5 mm', 'About 0.5 mm', 'About 50 mm', 'About 0.05 mm'], a: 0, why: `The person subtends $2\\arctan(0.9/6) = 17°$, and $h = f\\tan\\theta = 16.7 \\times \\tan 17° \\approx 5$ mm. The whole retina is about 24 mm across in this direction.` },
    { q: 'The image on the retina is upright, because the lens corrects the inversion.', a: false, why: `The image is inverted and reversed, as in any single lens forming a real image. The brain's wiring handles it.` },
    { q: 'An eye with a focal length of 16.7 mm has a pupil of 4 mm. What is its f-number?', answer: 4.2, why: `$N = f/D = 16.7/4 = 4.2$.` },
    { q: 'A person walks from bright sunlight into a dim room and the pupil grows from 2 mm to 6 mm. By how many stops does the light on the retina rise?', choices: ['About 3 stops', 'About 1.5 stops', 'About 6 stops', 'It does not change'], a: 0, why: `The light admitted goes as the area, $(6/2)^2 = 9$ times, which is $\\log_2 9 = 3.2$ stops. The f-number goes from f/8.3 to f/2.8.` },
    { q: 'How does the eye change focus from a far object to a near one?', choices: ['It makes the lens rounder, raising the power of the eye', 'It moves the lens forward', 'It lengthens the whole eyeball', 'It moves the retina backward'], a: 0, why: `The distance from lens to retina stays the same. The ciliary muscle lets the lens round up, which raises the power of the eye by a few dioptres.` }
  ],
  applications: [
    `Camera lenses and sensors are specified with the same words as the eye, and a camera is often chosen to give a picture that matches what the eye sees (a "normal" lens has a field of about 40° to 50°).`,
    `Virtual-reality and augmented-reality optics are designed around the eye's pupil, field and 0.29 mm-per-degree scale.`,
    `Eye models underpin the design of spectacles, contact lenses and intraocular lenses: the surgeon's lens power is calculated from the eye's length and the corneal curvature.`,
    `Machine-vision engineers compare their cameras with the eye when they ask how many pixels per degree a viewer needs.`
  ],
  history: `The comparison of the eye with the camera obscura goes back to Kepler, who in 1604 explained that the lens makes an inverted image on the retina, and to Descartes, who in 1637 described an experiment with the eye of an ox. The first complete numerical models of the eye's optics date from the second half of the nineteenth century: Helmholtz gave one in his *Handbuch der physiologischen Optik*, and Gullstrand refined it in the early twentieth.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — the schematic eyes, their powers and cardinal points.`,
    `E. Hecht, *Optics* — the section on the eye in the chapter on geometrical optics.`,
    `J. Schwiegerling, *Field Guide to Visual and Ophthalmic Optics* (SPIE, 2004) — the reduced and schematic eyes.`
  ],
  sim: 'ey-camera'
},

/* ================================================================ accommodation */
{
  id: 'accommodation', parent: 'eye-optics', title: 'Accommodation', level: 2,
  short: `Accommodation is the eye's way of refocusing: the ciliary muscle lets the lens round up, which raises the power of the eye by 15 dioptres or more in a child and by next to nothing in an older adult. The nearest point that can be seen sharply is the reciprocal of what is left.`,
  keywords: ['accommodation', 'focusing', 'near point', 'amplitude of accommodation', 'ciliary muscle', 'zonules', 'lens', 'Hofstetter', 'near reflex', 'reading distance', 'focusing demand', 'presbyopia'],
  prereq: ['the-eye-as-a-camera', 'focal-length-and-optical-power', 'real-and-virtual-images'],
  related: ['presbyopia', 'myopia', 'hyperopia', 'the-pupil', 'binocular-vision-and-stereopsis', 'intraocular-lenses-and-refractive-surgery', 'depth-of-field', 'physics:the-eye'],
  body: `
A camera lens focuses on a nearer object by moving away from the sensor. The eye cannot: the retina is fixed in its place at the back of a rigid globe. It changes the *power* of its lens instead. That is **accommodation**, and the simulation above traces it: as the object comes closer the lens front, which has a radius of 10.2 mm when relaxed, steepens to about 7 mm at 25 cm, and the lens becomes thicker.

### How it works
The lens is held in a ring of fine fibres, the zonules, which pull it flat when the eye is relaxed. When the circular **ciliary muscle** contracts, the ring shrinks, the fibres slacken, and the lens, which is elastic, rounds up under its own tension. A rounder lens is a stronger lens. Looking at something far away relaxes the muscle again.

### How much is needed
Light from an object at distance $d$ arrives diverging with a vergence of $-1/d$ in dioptres; the eye must add that much. An eye that is relaxed for distance (an emmetropic eye) therefore needs

$$A = \\frac{1}{d}$$

dioptres to see an object at $d$ metres sharply: 0.5 D for 2 m, 2.5 D for reading at 40 cm, 4 D at 25 cm, 10 D at 10 cm. The nearest distance at which the eye can still focus is the same relation turned round, $d_{near} = 1/A_{max}$.

### How much there is: the loss with age
The maximum accommodation, the **amplitude**, falls steadily with age as the lens hardens and its capsule loses spring. Hofstetter's formulae put the average at $A = 18.5 - 0.3 \\times \\text{age}$ dioptres:

| Age | 10 | 20 | 30 | 40 | 45 | 50 | 55 | 60 |
|---|---|---|---|---|---|---|---|---|
| Average amplitude (D) | 15.5 | 12.5 | 9.5 | 6.5 | 5.0 | 3.5 | 2.0 | 0.5 |
| Nearest sharp distance | 6.5 cm | 8 cm | 10.5 cm | 15 cm | 20 cm | 29 cm | 50 cm | 2 m |

A person cannot keep the muscle at its limit; a usual guide is to keep a third of the amplitude in reserve. Reading at 40 cm needs 2.5 D, so $1.5 \\times 2.5 = 3.75$ D of amplitude, which the average eye has until about 49. That is the age at which the loss of near focus, [[presbyopia]], begins to be noticed.

### The near triad
Accommodation is part of a reflex with two companions. When the eyes look at something close they converge ([[binocular-vision-and-stereopsis]]), the pupil narrows ([[the-pupil]]) and the lens rounds up. Convergence and accommodation are linked in the brain, so each drives a little of the other, and this link is why lenses and displays that put the focus and the convergence at different distances can tire the eyes.

### What it does not do
Accommodation does not fix a mismatch between the eye's power and its length. A short-sighted eye ([[myopia]]) has too much power for its length and uses none of its amplitude for distance; a long-sighted eye ([[hyperopia]]) must use some of it even to see far away, and has less left for near.

> [!key] The eye focuses near by raising the power of its lens by $A = 1/d$ dioptres for an object at $d$ metres. The amplitude falls from about 15 D in childhood to about 0.5 D at 60, which sets the nearest point that can be seen sharply and brings presbyopia.
`,
  ideas: [
    `The retina cannot move, so the eye refocuses by making the lens rounder and so more powerful.`,
    `An emmetropic eye needs A = 1/d dioptres to see an object at d metres: 2.5 D at 40 cm.`,
    `The average amplitude falls with age, from about 15 D at 10 years to 0.5 D at 60 (Hofstetter: 18.5 − 0.3 × age).`,
    `The nearest sharp distance is the reciprocal of the amplitude left; reading comfortably needs about 1.5 times the demand.`,
    `Accommodation, convergence and pupil narrowing happen together as the near reflex.`
  ],
  pitfalls: [
    `The eye focuses by moving its lens forward or by lengthening the eyeball — Neither moves. The lens changes shape, and its radii of curvature fall, which raises the power by the amount needed.`,
    `Near focus fails with age because the eye's muscle weakens, and exercises would restore it — The loss comes from the lens itself hardening; the ciliary muscle still contracts. A reading addition supplies the missing power from outside.`,
    `Distance vision costs the eye no effort — This is true for an eye with no refractive error. A long-sighted eye has to accommodate even for distance, and its near range suffers sooner.`,
    `The amplitude of a given age is the same for everyone — Hofstetter's formulae give the average and a spread, from the low end 15 − 0.25 × age to the high end 25 − 0.4 × age, and real people differ from either.`
  ],
  terms: [
    { term: 'Accommodation', def: `The change in the power of the eye's lens that brings objects at different distances to a focus on the retina. It is done by the ciliary muscle.` },
    { term: 'Amplitude of accommodation', also: ['accommodative amplitude'], def: `The greatest change of power the eye can make, in dioptres. It falls from about 15 D in childhood to nearly zero at about 60.` },
    { term: 'Near point', also: ['punctum proximum'], def: `The nearest distance at which the eye can still see sharply: the reciprocal, in metres, of the amplitude in dioptres for an eye with no refractive error.` },
    { term: 'Ciliary muscle and zonules', also: ['zonular fibres'], def: `The ring of muscle around the lens and the fine fibres that connect it to the lens. When the muscle contracts the fibres slacken and the lens rounds up.` },
    { term: 'Near triad', also: ['near reflex'], def: `The three actions that accompany a look at something close: the lens accommodates, the eyes converge and the pupils narrow.` },
    { term: 'Accommodative demand', def: `The accommodation that an object at a given distance calls for: $1/d$ dioptres for an object at $d$ metres.` }
  ],
  formulas: [
    {
      name: 'Accommodation needed for a distance',
      expr: 'A = 1/d', tex: 'A = \\frac{1}{d}',
      vars: {
        A: { name: 'accommodation needed', q: 'optpower', unit: 'D' },
        d: { name: 'distance of the object', q: 'length', unit: 'cm', value: 40 }
      },
      solveFor: 'A',
      note: 'For an eye with no refractive error. The same relation gives the near point from the amplitude: d = 1/A.',
      stories: { A: 'An emmetropic eye looks at an object {d} away. How much accommodation does it need?', d: 'An emmetropic eye with {A} of accommodation: what is the nearest distance it can see sharply?' }
    },
    {
      name: 'Average amplitude with age (Hofstetter)',
      expr: 'A = 18.5 - 0.3*age', tex: 'A = 18.5 - 0.3\\,\\mathrm{age}',
      vars: {
        A: { name: 'average amplitude of accommodation', q: false, unit: 'D', min: 0, max: 18.5 },
        age: { name: 'age', q: false, unit: 'years', value: 30, min: 0, max: 61.5 }
      },
      solveFor: 'A',
      note: 'An empirical average, in dioptres and years: it is not meant for a single person and is zero beyond about 62.'
    },
    {
      name: 'Amplitude needed to read comfortably',
      expr: 'Ar = 1.5/d', tex: 'A_r = \\frac{1.5}{d}',
      vars: {
        Ar: { name: 'amplitude to keep a third in reserve', q: 'optpower', unit: 'D', tex: 'A_r' },
        d: { name: 'reading distance', q: 'length', unit: 'cm', value: 40 }
      },
      solveFor: 'Ar',
      note: 'A rule of thumb: use no more than two thirds of the amplitude for sustained near work.'
    }
  ],
  examples: [
    {
      title: 'A student at the library',
      q: `A 25-year-old reads a book at 25 cm. How much accommodation does that need, and what share of the average amplitude at that age?`,
      steps: [
        { text: 'The demand is', tex: 'A = \\frac{1}{0.25\\ \\mathrm{m}} = 4\\ \\mathrm{D}' },
        `The average amplitude at 25 is $18.5 - 0.3 \\times 25 = 11$ D, so the demand uses $4/11 = 36$ %: comfortably inside the two thirds.`
      ],
      a: `4 D, about 36 % of the 11 D that the average 25-year-old has.`
    },
    {
      title: 'When does reading at 40 cm get hard?',
      q: `At what age does the average eye have just the amplitude that comfortable reading at 40 cm asks for?`,
      steps: [
        `The comfortable amplitude is $A_r = 1.5/0.4 = 3.75$ D.`,
        { text: 'Solve Hofstetter\'s formula for the age:', tex: '\\text{age} = \\frac{18.5 - 3.75}{0.3} = 49' }
      ],
      a: `About 49 years, which is where the need for a reading addition usually begins.`
    }
  ],
  quiz: [
    { q: 'How much accommodation does an eye with no refractive error need to see a page at 25 cm?', choices: ['4 D', '0.25 D', '2.5 D', '25 D'], a: 0, why: `$A = 1/d = 1/0.25 = 4$ D. 2.5 D is the demand at 40 cm.` },
    { q: 'The nearest distance an eye can see sharply is 50 cm. About how much accommodation does it have?', answer: 2, unit: 'D', why: `The near point is the reciprocal of the amplitude: $1/0.5\\ \\mathrm{m} = 2$ D, which is the average at 55 years.` },
    { q: 'During accommodation the distance from the lens to the retina becomes shorter.', a: false, why: `That distance is fixed. The lens changes its shape: both surfaces curve more, the front especially, and the lens thickens.` },
    { q: 'With the average amplitude of 3.5 D at age 50, which task is hardest?', choices: ['Reading at 25 cm (4 D)', 'Looking at a screen at 70 cm (1.4 D)', 'Looking at a face across a table at 1 m (1 D)', 'Looking at a distant tree'], a: 0, why: `The demand of 4 D is higher than the amplitude of 3.5 D, so a page at 25 cm cannot be brought into focus at all; the others need less than the amplitude, and distance needs none.` },
    { q: 'Why can staring at a close display for hours tire the eyes?', choices: ['The ciliary muscle and the eye muscles that converge both work continuously', 'The cornea dries out only because of the light', 'The retina uses up its pigment', 'The lens becomes thinner'], a: 0, why: `A near display demands accommodation and convergence together for as long as one looks at it. That sustained effort is the reason for the common advice to look away at a distance from time to time.` }
  ],
  applications: [
    `Choosing a reading addition: the addition that [[presbyopia]] calls for is found from how much amplitude is missing at the working distance.`,
    `Designing displays and viewfinders: the screen in a headset is imaged at a distance that sets the accommodation demand, typically about 1 to 2 m.`,
    `Photography and film: an actor's face at 40 cm and the horizon at infinity are focused by two different amounts, which is why a film's focus puller has to follow the actor.`,
    `Intraocular lenses and refractive surgery: the "accommodating" and multifocal lenses try to give back some of the near range that the natural lens has lost.`
  ],
  history: `Thomas Young showed in 1801, with an eye whose cornea was neutralised by immersion in water, that the change in focus comes from the lens. Hermann von Helmholtz described the mechanism in 1855: the ciliary muscle contracts, the zonules slacken and the elastic lens rounds up. Hofstetter published his age–amplitude formulae in 1950.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — the accommodation of the eye and the change of its surfaces.`,
    `H. W. Hofstetter, "A useful age–amplitude formula", *Optical World* 38 (1950) — the formulae used here.`,
    `*Handbook of Optics*, volume III, *Vision and Vision Optics* (McGraw-Hill) — accommodation and its loss with age.`
  ],
  sim: [{ id: 'ey-accommodation', params: { d: 0.25, age: 25 } }]
}

);

Hyper.add(

/* ================================================================ the pupil */
{
  id: 'the-pupil', parent: 'eye-optics', title: 'The pupil', level: 2,
  short: `The pupil is the hole in the iris and the aperture stop of the eye. It runs from about 2 mm in bright light to 8 mm in the dark, and it sets how much light is admitted, how deep the range of focus is, how large the diffraction blur is and how much the eye's aberrations matter. Sharpest vision comes near a diameter of 3 mm.`,
  keywords: ['pupil', 'iris', 'aperture stop', 'entrance pupil', 'pupil size', 'miosis', 'mydriasis', 'light reflex', 'depth of focus', 'diffraction', 'trolands', 'Stiles-Crawford', 'pinhole'],
  prereq: ['the-eye-as-a-camera', 'aperture-stop', 'entrance-and-exit-pupils', 'the-airy-disk'],
  related: ['aberrations-of-the-eye', 'depth-of-focus', 'light-and-dark-adaptation', 'accommodation', 'the-f-number', 'the-pinhole-camera', 'photometric-quantities', 'physics:the-eye'],
  body: `
The iris holds two muscles: a ring that narrows the opening and a set of radial fibres that widens it. The opening they leave is the **pupil**. Optically it is the **aperture stop** of the eye, and what one measures from outside is its image seen through the cornea, the **entrance pupil**, about 13 % larger than the real hole.

### How big, and when
The pupil follows the light on the retina. A standard fit to measurements (de Groot and Gebhard) gives:

| Scene luminance (cd/m²) | 0.001 | 0.1 | 1 | 10 | 100 | 1000 |
|---|---|---|---|---|---|---|
| Pupil (mm) | 6.4 | 5.2 | 4.4 | 3.6 | 2.8 | 2.0 |

From starlight to a bright day the area changes about tenfold, while the scene changes by a factor of millions: the pupil is a small part of the eye's adaptation ([[light-and-dark-adaptation]]). It also narrows when one looks at something near, is smaller in older people, and responds in both eyes together when light falls on only one.

### What the pupil sets
**Light.** The light admitted goes as the area, $D^2$. Retinal illuminance is quoted in *trolands*: luminance in cd/m² times pupil area in mm². White paper at 100 cd/m² with a pupil of 2.8 mm gives about 600 td.

**Diffraction.** The pupil is a round hole, so a point of light makes an Airy disc of angular diameter $2.44\\lambda/D$ ([[the-airy-disk]]).

**Aberrations.** Rays through the edge of the pupil are bent differently from rays through the middle. The blur this causes grows roughly as the *cube* of the diameter.

**Depth of focus.** A point that is out of focus by $\\Delta D$ dioptres makes a blur disc of angular diameter $\\Delta D \\times D$, so a small pupil forgives errors of focus. The error at which that blur equals the diffraction blur is $\\pm 2.44\\lambda/D^2$ dioptres. This is why looking through a 1 mm hole sharpens a blurred view ([[the-pinhole-camera]]).

| Pupil (mm) | 2 | 3 | 4 | 6 |
|---|---|---|---|---|
| Airy disc (arc-minutes) | 2.31 | 1.54 | 1.15 | 0.77 |
| Aberration blur, traced model (arc-minutes) | 0.24 | 0.85 | 2.1 | 7.9 |
| Both combined (arc-minutes) | 2.3 | 1.8 | 2.4 | 7.9 |
| Depth of focus, ± dioptres | 0.34 | 0.15 | 0.08 | 0.04 |

The two blurs run in opposite directions, so the combined blur has a minimum: near 3 mm in the model, and in practice between about 3 and 4 mm, which is why acuity is best at the pupil sizes of ordinary indoor and shaded daylight.

### A refinement
Light entering near the edge of the pupil is less effective than light through the centre, because the cones are directional (the Stiles–Crawford effect): rays 3 mm from the centre are only about a third as effective. The pupil counts, optically, as slightly smaller than it is.

> [!warn] A pupil that suddenly differs in size from the other, that no longer reacts to light, or that changes after a blow to the head or with a headache or loss of vision may signal a serious problem: seek urgent eye care.

> [!key] The pupil is the eye's aperture stop: 2 to 8 mm, so f/8 to f/2. A small pupil gives more depth of focus and fewer aberrations but more diffraction; the best compromise is near 3 mm.
`,
  ideas: [
    `The pupil is the aperture stop of the eye: 2 to 8 mm, as seen from outside, following the light on the retina.`,
    `It changes the light admitted by only about ten times, a small part of the eye's adaptation to the light.`,
    `A small pupil gives less aberration and more depth of focus, but more diffraction; a large one the reverse.`,
    `The combined blur is smallest near a pupil of 3 mm.`,
    `Retinal illuminance in trolands is the luminance times the pupil area in mm².`
  ],
  pitfalls: [
    `The pupil adapts the eye to the dark — The pupil changes the light admitted by a factor of about ten. The eye's range of working light is a hundred million times wider; most of the adaptation is in the retina.`,
    `A bigger pupil always means better vision at night — It lets in more light, but it also admits more aberrations, so the image is sharper through a smaller pupil whenever there is light enough.`,
    `A small pupil reduces sharpness because it makes the lens smaller — Down to about 3 mm a smaller pupil sharpens the image, by cutting aberrations. Only below that does diffraction outweigh the gain.`,
    `The pupil size is a measure of the real hole — What we see from outside is its magnified image through the cornea, 13 % larger than the hole itself.`
  ],
  terms: [
    { term: 'Pupil', def: `The opening in the iris through which light enters the eye. Its apparent diameter runs from about 2 mm in bright light to 8 mm in the dark.` },
    { term: 'Entrance pupil', def: `The image of the aperture stop seen from the front, through the cornea. For the eye it is about 13 % larger than the real hole in the iris, and is what is measured when a pupil is quoted.` },
    { term: 'Pupillary light reflex', also: ['light reflex'], def: `The narrowing of both pupils when light enters one eye, and their widening in the dark.` },
    { term: 'Depth of focus', also: ['focus tolerance'], def: `The range of focusing error, in dioptres, that the eye tolerates without visible blur. It grows as the pupil shrinks.` },
    { term: 'Troland', also: ['td'], def: `A unit of retinal illuminance: the luminance of the scene in cd/m² times the area of the pupil in mm². It allows for the pupil's effect on the light that reaches the retina.` },
    { term: 'Stiles–Crawford effect', def: `The fall in the effectiveness of light as it enters the pupil away from its centre: the cones are directional, so rays through the edge count for less.` }
  ],
  formulas: [
    {
      name: 'Diffraction blur of the pupil (Airy disc)',
      expr: 'theta = 2.44*lambda/D', tex: '\\theta = \\frac{2.44\\,\\lambda}{D}',
      vars: {
        theta: { name: 'angular diameter of the Airy disc', q: 'angle', unit: '′', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 3 }
      },
      solveFor: 'theta',
      note: 'To the first dark ring, for light of one wavelength; a perfect eye would show this blur.',
      stories: { theta: 'A perfect eye with a pupil of {D} looks at a point of {lambda} light. How wide is the Airy disc, in angle?', D: 'The Airy disc of 550 nm light is {theta} across. What is the pupil?' }
    },
    {
      name: 'Depth of focus of the eye',
      expr: 'dD = 2.44*lambda/D^2', tex: '\\Delta D = \\frac{2.44\\,\\lambda}{D^{2}}',
      vars: {
        dD: { name: 'focusing error that equals the diffraction blur (±)', q: 'optpower', unit: 'D', tex: '\\Delta D' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        D: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 3 }
      },
      solveFor: 'dD',
      note: 'A focus error ΔD makes a blur disc of angle ΔD·D; this is the error at which that equals the Airy disc. Measured depths of focus are somewhat larger.'
    },
    {
      name: 'Retinal illuminance in trolands',
      expr: 'T = L*pi*D^2/4', tex: 'T = L\\,\\frac{\\pi D^2}{4}',
      vars: {
        T: { name: 'retinal illuminance', q: false, unit: 'td' },
        L: { name: 'luminance of the scene', q: 'luminance', unit: 'cd/m²', value: 100 },
        D: { name: 'pupil diameter (taken in mm)', q: false, unit: 'mm', value: 2.8, min: 0.5, max: 10 }
      },
      solveFor: 'T',
      note: 'A troland is one cd/m² seen through a pupil of one square millimetre.'
    },
    {
      name: 'Blur disc from a focusing error',
      expr: 'beta = dD*D', tex: '\\beta = \\Delta D\\cdot D',
      vars: {
        beta: { name: 'angular diameter of the blur disc', q: 'angle', unit: '′', tex: '\\beta' },
        dD: { name: 'focusing error', q: 'optpower', unit: 'D', value: 0.5, tex: '\\Delta D' },
        D: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 4 }
      },
      solveFor: 'beta',
      note: 'Geometrical optics: a point out of focus by ΔD spreads over an angle equal to ΔD times the pupil diameter.'
    }
  ],
  examples: [
    {
      title: 'A pupil of 3 mm against 6 mm',
      q: `Compare a pupil of 3 mm with one of 6 mm, for light of 550 nm: the Airy disc, the depth of focus and the light.`,
      steps: [
        { text: 'The Airy disc:', tex: '\\theta = \\frac{2.44 \\times 550\\ \\mathrm{nm}}{D} = 1.54′\\ (3\\ \\mathrm{mm}),\\quad 0.77′\\ (6\\ \\mathrm{mm})' },
        { text: 'The depth of focus:', tex: '\\Delta D = \\frac{2.44\\lambda}{D^2} = \\pm 0.15\\ \\mathrm{D}\\ (3\\ \\mathrm{mm}),\\quad \\pm 0.04\\ \\mathrm{D}\\ (6\\ \\mathrm{mm})' },
        `The light grows as $(6/3)^2 = 4$ times.`
      ],
      a: `The bigger pupil gives half the diffraction blur, but a quarter of the depth of focus, four times the light — and far more aberration, which the diffraction figures leave out.`
    },
    {
      title: 'The light at a desk',
      q: `White paper has a luminance of 100 cd/m² and the pupil is 2.8 mm. What is the retinal illuminance?`,
      steps: [
        { text: 'The area of the pupil is $\\pi \\times 2.8^2/4 = 6.16$ mm², so', tex: 'T = 100 \\times 6.16 = 616\\ \\mathrm{td}' }
      ],
      a: `About 600 trolands (616 for exactly 2.8 mm).`
    }
  ],
  quiz: [
    { q: 'The pupil opens from 2 mm to 6 mm. By what factor does the light entering the eye increase?', choices: ['9', '3', '6', '18'], a: 0, why: `The light goes as the area: $(6/2)^2 = 9$. The diameter grows by 3, the area by 9.` },
    { q: 'The pupil alone is enough to let the eye work from starlight to bright sunlight.', a: false, why: `The pupil changes the light by a factor of about ten. The eye works over a range of roughly a hundred million; the rest is done in the retina.` },
    { q: 'What is the angular diameter, in arc-minutes, of the Airy disc of 550 nm light for a pupil of 3 mm?', answer: 1.54, unit: '′', why: `$\\theta = 2.44 \\times 550 \\times 10^{-9}/0.003 = 4.5 \\times 10^{-4}$ rad $= 1.54′$.` },
    { q: 'Why does a hole of 1 mm in front of the eye sharpen a blurred view?', choices: ['It makes the blur disc of every out-of-focus point smaller', 'It makes the lens stronger', 'It lets in more light', 'It lengthens the eye'], a: 0, why: `The blur disc is $\\Delta D \\times D$, so shrinking the aperture shrinks the blur in proportion. The price is less light and a larger diffraction disc.` },
    { q: 'Why is a pupil of about 3 mm the best compromise for sharp vision?', choices: ['Smaller pupils lose to diffraction and larger ones to aberrations', 'The retina is most sensitive at 3 mm', 'The lens is sharpest at its centre', 'Larger pupils let in too much light'], a: 0, why: `The Airy disc falls as $1/D$ and the aberration blur grows roughly as $D^3$: the sum has a minimum near 3 mm.` }
  ],
  applications: [
    `Photography and instruments borrow the idea: the same trade-off between diffraction and aberration sets the "sweet spot" aperture of a lens, two or three stops below its maximum.`,
    `Pupillometry: the speed and size of the pupil's response to light are part of an eye and neurological examination.`,
    `Multifocal contact lenses and intraocular lenses work differently at different pupil sizes, so the pupil in dim light affects the result.`,
    `Lighting and displays: a bright field makes the pupil smaller and the viewer less sensitive to a dim region next to it, which is why glare hides details.`
  ],
  history: `Stiles and Crawford found in 1933 that light entering at the edge of the pupil is less effective than light through its centre. The fit for pupil size against luminance that is used here was published by de Groot and Gebhard in 1952, and Campbell and Gubisch measured in 1966 how the sharpness of the image on the retina changes with the pupil.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — pupil size, the Stiles–Crawford effect and the effect of the pupil on the image.`,
    `F. W. Campbell and R. W. Gubisch, "Optical quality of the human eye", *Journal of Physiology* 186 (1966) 558–578 — the line spread of the eye at different pupil sizes.`,
    `H. de Groot and J. W. Gebhard, "Pupil size as determined by adapting luminance", *Journal of the Optical Society of America* 42 (1952) 492–495.`
  ],
  sim: 'ey-pupil'
},

/* ================================================================ the retina: rods and cones */
{
  id: 'the-retina-rods-and-cones', parent: 'eye-optics', title: 'The retina: rods and cones', level: 2,
  short: `The retina is a sheet of nerve tissue a quarter of a millimetre thick, built back to front, with about 100 million rods for dim light and about 5 million cones for daylight and colour. Cones crowd into the centre, rods peak 10–20° away, and signals from a hundred million receptors leave through only about 1.2 million nerve fibres.`,
  keywords: ['retina', 'rods', 'cones', 'photoreceptors', 'rhodopsin', 'cone density', 'rod density', 'L cone', 'M cone', 'S cone', 'ganglion cells', 'scotopic', 'photopic', 'receptor mosaic', 'optic nerve fibres'],
  prereq: ['anatomy-of-the-eye', 'the-eye-as-a-camera', 'wavelength-frequency-and-colour'],
  related: ['the-fovea-and-visual-acuity', 'light-and-dark-adaptation', 'trichromatic-colour-vision', 'colour-vision-deficiency', 'nyquist-sampling-and-aliasing', 'how-a-pixel-detects-light', 'macular-degeneration-and-retinal-disease', 'physics:color-vision'],
  body: `
The retina lines the back of the eye like the film in a camera, but it is living tissue, built back to front. Light has to cross layers of nerve cells (and the blood vessels that feed them) before it reaches the **receptors**, which lie at the very back against the pigment layer that absorbs what passes through. The retina is in fact a piece of the brain, and it starts the processing of the image: the receptors are only the first of five kinds of cell.

### Two kinds of receptor
| | Rods | Cones |
|---|---|---|
| Number in the whole retina | roughly 90 to 120 million | roughly 4.5 to 6 million |
| Peak density | about 150 000 per mm², 10–20° from the fovea | about 200 000 per mm², in the fovea |
| Light level | twilight and night (scotopic) | daylight (photopic) |
| Pigment, peak of absorption | rhodopsin, 498 nm | S 420 nm, M 534 nm, L 564 nm |
| Colour | none: one pigment | three kinds, hence colour vision |
| Sensitivity | respond to single photons | need a hundred to a thousand times more light |
| Acuity | low: many rods feed one cell | high: in the fovea about one cone per fibre |

The counts are averages from studies of human retinas and differ by tens of per cent between studies and between people.

### Where they are
The central 1° or so, the *foveola*, has only cones: about 2.4 µm apart, or half an arc-minute. Moving out, the cone density falls by a factor of about 25 by 10° (to about 8 000 per mm²), while rods, absent in the centre, rise to their peak in a ring 10° to 20° out. The simulation draws a patch of the mosaic at any eccentricity. This is why faint stars vanish when looked at directly, but can be seen from the corner of the eye, and why reading needs the fovea.

### Three kinds of cone
The L ("long-wave", red-sensitive), M (green-sensitive) and S (blue-sensitive) cones have broad, overlapping curves, so each wavelength excites them in a different ratio, and every colour is reduced to three numbers ([[trichromatic-colour-vision]]). The L-to-M ratio varies from about 1:1 to 4:1 or more between people with normal colour vision; the S cones are only 5–10 % of the cones and are absent from the centre of the foveola. A person who lacks or has a changed cone type has a [[colour-vision-deficiency]].

### From receptors to nerve fibres
About a hundred million receptors send their signals through only about 1.2 million ganglion-cell fibres, an average of 80 to 100 receptors per fibre. The compression is uneven: in the fovea a cone has nearly a fibre of its own, which gives the sharpest sampling; in the periphery hundreds of rods are pooled, which gives sensitivity and costs detail.

### A mosaic, not a sensor
The receptors sample the image like pixels. Cones half an arc-minute apart can sample, by the sampling theorem, patterns up to 60 cycles per degree, close to the limit of the eye's optics ([[nyquist-sampling-and-aliasing]]). The irregular arrangement of the cones turns what would be moiré into noise. A popular claim that the eye has "576 megapixels" ignores that only the central degrees are sampled so finely.

> [!key] Cones (about 5 million; three kinds; daylight and colour; fovea) and rods (about 100 million; one kind; dim light; periphery) sample the retinal image as a mosaic, 2.4 µm apart at the fovea. The signal from a hundred million receptors is carried by 1.2 million fibres.
`,
  ideas: [
    `Light crosses the nerve-cell layers of the retina before it reaches the receptors at the back.`,
    `There are about 100 million rods (dim light, no colour) and about 5 million cones (daylight, three kinds, colour).`,
    `Cones are densest in the fovea, about 2.4 µm apart; rods are absent there and peak 10–20° out.`,
    `Three cone pigments (S 420, M 534, L 564 nm) turn every spectrum into three numbers.`,
    `About 100 receptors share each optic-nerve fibre on average, but in the fovea almost one cone has a fibre of its own.`
  ],
  pitfalls: [
    `Rods see in black and white because they are simpler than cones — They have only one pigment, so a rod cannot tell a change in wavelength from a change in brightness. Their signal carries only intensity.`,
    `We see colour all over the retina equally well — Colour comes from cones, which are dense only near the centre. In the far periphery the cones are few and spread out.`,
    `The eye is a camera sensor of 100 million pixels — Most of those receptors are rods, pooled by the thousand into very few fibres; the sharp, coloured part of the picture comes from a few hundred thousand cones in the centre.`,
    `The blind spot lies where the retina is damaged — It is a normal part of the eye, where the nerve fibres and vessels pass through the retina and there is no room for receptors.`
  ],
  terms: [
    { term: 'Rod', def: `A receptor for dim light: very sensitive, one pigment (rhodopsin, peak 498 nm), no colour, low detail. About 100 million in each eye.` },
    { term: 'Cone', def: `A receptor for daylight and colour: three kinds (S, M and L), concentrated in the fovea. About 5 million in each eye.` },
    { term: 'Photopic, scotopic and mesopic vision', def: `Vision with the cones in daylight (photopic), with the rods in the dark (scotopic) and with both in between (mesopic).` },
    { term: 'Ganglion cell', def: `The nerve cell whose fibre carries the retina's output along the optic nerve. There are about 1.2 million, after the receptors and two other layers of cells.` },
    { term: 'Receptor mosaic', also: ['cone mosaic'], def: `The pattern in which the receptors tile the retina. The spacing of the cones sets how fine a pattern the retina can sample.` },
    { term: 'Rhodopsin', also: ['visual purple'], def: `The pigment of the rods. A photon changes its molecule, which starts the electrical signal; it then has to be rebuilt, which takes many minutes in the dark.` }
  ],
  formulas: [
    {
      name: 'Spacing of the receptors from their density',
      expr: 'd = 1000*sqrt(2/(sqrt(3)*rho))', tex: 'd = 1000\\,\\sqrt{\\frac{2}{\\sqrt{3}\\,\\rho}}',
      vars: {
        d: { name: 'distance between neighbouring receptors', q: false, unit: 'µm' },
        rho: { name: 'density of receptors (per square millimetre)', q: false, unit: '/mm²', value: 199000, min: 1000, max: 400000, tex: '\\rho' }
      },
      solveFor: 'd',
      note: 'For a hexagonal packing. The density is in receptors per mm² and the spacing in micrometres (the 1000 turns millimetres into micrometres).'
    },
    {
      name: 'Distance on the retina from an angle',
      expr: 's = 0.291*ecc', tex: 's = 0.291\\ \\mathrm{mm/deg}\\times \\mathrm{ecc}',
      vars: {
        s: { name: 'distance from the fovea along the retina', q: false, unit: 'mm' },
        ecc: { name: 'eccentricity (angle from the line of sight)', q: false, unit: '°', value: 15, min: 0, max: 90, tex: '\\mathrm{ecc}' }
      },
      solveFor: 's',
      note: 'Near the axis, from 16.7 mm × π/180; the retina is curved, so the figure is approximate far from the centre.'
    }
  ],
  examples: [
    {
      title: 'How far apart are the cones?',
      q: `The density of cones in the fovea is about 199 000 per mm². What is the spacing, in micrometres and in arc-minutes (4.85 µm on the retina per arc-minute)?`,
      steps: [
        { text: 'Hexagonal packing:', tex: 'd = \\sqrt{\\frac{2}{\\sqrt{3}\\times 199\\,000\\ \\mathrm{mm}^{-2}}} = 2.4\\ \\mu\\mathrm{m}' },
        `In angle that is $2.4/4.85 = 0.50$ arc-minutes.`,
        `Two cones across a 1-arc-minute stroke: the stroke of a 6/6 letter spans two cones.`
      ],
      a: `2.4 µm, half an arc-minute.`
    },
    {
      title: 'Rods against cones at 10°',
      q: `At 10° from the fovea the model density is 7 800 cones and 148 000 rods per mm². What is the ratio, and how far from the fovea is that on the retina?`,
      steps: [
        `The ratio of rods to cones is $148\\,000/7\\,800 = 19$.`,
        `The distance is $0.291 \\times 10 = 2.9$ mm.`
      ],
      a: `Nearly 19 rods for each cone, 2.9 mm from the fovea.`
    }
  ],
  quiz: [
    { q: 'In the centre of the foveola, which receptors are found?', choices: ['Cones only', 'Rods only', 'Equal numbers of both', 'Neither: it is the blind spot'], a: 0, why: `The foveola, about 1° across, is rod-free. Rods begin to appear at about 0.6° and peak in a ring 10° to 20° from the centre.` },
    { q: 'Rods respond to single photons and have only one pigment, which is why night vision has no colour.', a: true, why: `With one pigment a rod cannot tell a change of wavelength from a change of intensity. Colour needs at least two pigments compared.` },
    { q: 'About how many receptors, on average, share each fibre of the optic nerve?', choices: ['About 100', 'About 1', 'About 1000', 'About 10 000'], a: 0, why: `About 100 million receptors and 1.2 million fibres: 80 to 100 each on average, from one cone per fibre in the fovea to hundreds of rods in the periphery.` },
    { q: 'What is the spacing, in micrometres, of a hexagonal mosaic with a density of 7 800 per mm²? (Answer to one decimal place.)', answer: 12.2, unit: 'µm', why: `$d = \\sqrt{2/(\\sqrt{3} \\times 7800)} = 0.0122$ mm $= 12.2$ µm.` },
    { q: 'A faint star disappears when you look straight at it but returns when you look slightly to one side. Why?', choices: ['The fovea has no rods, and rods are what sense dim light', 'The pupil closes when looked at directly', 'The lens focuses badly on the axis', 'Stars blink'], a: 0, why: `The centre of the retina has only cones, which need far more light. Looking aside puts the star on a region rich in rods.` }
  ],
  applications: [
    `Display and camera designers use the cones' sensitivity curves, and the fact that the eye has three of them, to give three-primary colour reproduction.`,
    `Night-time instruments such as red cockpit lighting and planetariums use light that the rods barely see, to keep the eyes dark-adapted ([[light-and-dark-adaptation]]).`,
    `Imaging methods in eye care (OCT, fundus photographs) show the layers and the density of the receptors, and are used to follow diseases of the retina.`,
    `Image sensors with a Bayer mosaic and a low-pass filter borrow the same idea: a regular or irregular mosaic must not be asked to sample detail finer than its spacing.`
  ],
  history: `Max Schultze showed in 1866, from the retinas of animals that are active by day and by night, that rods and cones are two separate kinds of receptor and proposed that rods serve twilight and cones daylight. Franz Boll saw the bleaching of "visual purple" in 1876; George Wald worked out the chemistry of rhodopsin and the role of vitamin A, for which he shared the 1967 Nobel Prize in Physiology or Medicine. Curcio and her colleagues published the standard counts of the human mosaic in 1990.`,
  sources: [
    `C. A. Curcio, K. R. Sloan, R. E. Kalina and A. E. Hendrickson, "Human photoreceptor topography", *Journal of Comparative Neurology* 292 (1990) 497–523 — the counts and densities.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — the photoreceptors and the retina.`,
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — the receptors as an optical sampling array.`
  ],
  sim: 'ey-retina'
},

/* ================================================================ the fovea and visual acuity */
{
  id: 'the-fovea-and-visual-acuity', parent: 'eye-optics', title: 'The fovea and visual acuity', level: 2,
  short: `The fovea is the small pit at the centre of the retina where cones are packed half an arc-minute apart. Visual acuity, the smallest detail seen, is about one arc-minute there, the stroke of a 6/6 (20/20) letter, and it falls to a fifth by 10° away. The eye moves constantly to keep what matters on the fovea.`,
  keywords: ['fovea', 'visual acuity', 'minimum angle of resolution', 'MAR', 'arc-minute', '20/20', '6/6', 'Snellen', 'logMAR', 'optotype', 'cone spacing', 'vernier acuity', 'hyperacuity', 'Nyquist', 'grating acuity'],
  prereq: ['the-retina-rods-and-cones', 'spatial-frequency-and-line-pairs', 'resolution-limits'],
  related: ['visual-acuity-charts', 'contrast-sensitivity', 'eye-movements', 'the-pupil', 'the-visual-field', 'nyquist-sampling-and-aliasing', 'low-vision-and-magnification', 'physics:resolution'],
  body: `
Hold a pencil at arm's length: its width is about a degree of your view, and the sharp part of your vision is hardly wider than that. The fovea is a pit about 1.5 mm (5°) across at the centre of the macula, in which the retina is thinned so that light reaches the cones without crossing the nerve layers, and the cones are packed at about half an arc-minute apart (2.4 µm). Nowhere else can the eye see so much detail.

### What acuity measures
**Visual acuity** is the smallest detail the eye can resolve, written as an angle, the *minimum angle of resolution* (MAR). A gap of one arc-minute between two strokes, which is the width of a stroke on a 6/6 letter, is the standard of normal acuity. The same fact is written four ways:

| Snellen (6 m) | Snellen (20 ft) | Decimal | MAR | logMAR | Letter height at 6 m |
|---|---|---|---|---|---|
| 6/6 | 20/20 | 1.0 | 1′ | 0.00 | 8.7 mm |
| 6/9 | 20/30 | 0.67 | 1.5′ | 0.18 | 13.1 mm |
| 6/12 | 20/40 | 0.5 | 2′ | 0.30 | 17.5 mm |
| 6/24 | 20/80 | 0.25 | 4′ | 0.60 | 34.9 mm |
| 6/60 | 20/200 | 0.1 | 10′ | 1.00 | 87.3 mm |

The 5-by-5 letters of a chart are built so that each stroke and each gap is one-fifth of the height, and a 6/6 letter is therefore 5′ tall: $h = d\\tan(5′\\times\\text{MAR})$. The denominator of the Snellen fraction is the distance at which the letter's *strokes* would span one arc-minute, so $20/x$ has $\\text{MAR} = x/20$ minutes. See [[visual-acuity-charts]].

### What limits it
Three things, nearly in step:
- **Diffraction and aberrations** of the eye's own optics ([[the-pupil]]): diffraction alone cuts off at 94 cycles per degree for a 3 mm pupil, and aberrations lower the practical limit.
- **The cone mosaic.** Cones 0.5′ apart can sample at most one cycle per 1′: 60 cycles per degree, or MAR 0.5′ (20/10). That is the theoretical limit of a perfect young eye, reached by the best gratings; a letter's 20/20 stroke is two cones wide.
- **The nerve cells after the cones.** At the fovea each cone has a fibre of its own; away from it the cells pool the signals.

Because the mosaic is only fine in the centre, acuity falls steeply with eccentricity $e$. A common rule of thumb is $\\text{MAR} \\approx 1′\\times(1 + e/2.5°)$: a fifth of the central acuity at 10°.

### Hyperacuity
Acuity for *resolving* is not the only kind. People can tell that two line segments are not collinear (vernier acuity) to a few seconds of arc: a tenth of the width of a cone. The brain does this by comparing the *positions* of the images across many cones, not by resolving them.

### Using the fovea
The sharp field is about 2° across, so the eye must move to look ([[eye-movements]]): in reading, one fixation takes in about 8 to 9 letters. A letter outside the fovea needs to be much larger to be read, as the simulation shows.

> [!key] The fovea samples at 0.5′ and sees about 1′ details: the stroke of a 6/6 letter, 5′ high. The limit is set together by optics, the cone mosaic and the nerve cells; it falls to a fifth by 10° from the centre.
`,
  ideas: [
    `The fovea is a pit about 5° across; its cones are about 2.4 µm (0.5′) apart.`,
    `Normal visual acuity is a minimum angle of resolution of 1 arc-minute: 6/6, 20/20, decimal 1.0, logMAR 0.`,
    `A 6/6 letter is 5′ tall on a 5-by-5 grid, which is 8.7 mm at 6 m.`,
    `The limit is set by the eye's optics, by the cone spacing (60 cycles per degree) and by the nerve cells.`,
    `Acuity falls with eccentricity as 1 ÷ (1 + e/2.5°): a fifth of the central value at 10°.`
  ],
  pitfalls: [
    `20/20 vision is perfect vision — It is the standard for normal acuity: the best eyes read 20/10, and acuity says nothing about contrast, colour, the field or the health of the eye.`,
    `The eye resolves detail evenly across the whole field — Only the central 2° is sharp. The impression of an evenly sharp world is built by the brain from successive looks.`,
    `A smaller denominator is a weaker acuity — 20/200 is much worse than 20/20: the person must be at 20 feet to read what a normal eye reads at 200.`,
    `Seeing a line as broken means resolving its parts — The eye can detect a break of a few seconds of arc in a line (vernier acuity), far below the cone spacing; detecting a displacement is not resolving two objects.`
  ],
  terms: [
    { term: 'Visual acuity', def: `The smallest detail that can be seen, measured from the smallest letters or gratings read correctly at a distance.` },
    { term: 'Minimum angle of resolution', also: ['MAR'], def: `The smallest angle between two features that can be seen as separate, in arc-minutes. Normal acuity is 1′.` },
    { term: 'Snellen fraction', also: ['6/6', '20/20', 'decimal acuity'], def: `A way of writing acuity: the test distance over the distance at which the smallest letter read would have strokes of 1′. 6/6 and 20/20 are normal.` },
    { term: 'logMAR', def: `The logarithm to base 10 of the minimum angle of resolution in arc-minutes: 0 for 6/6, 0.3 for 6/12, 1.0 for 6/60.` },
    { term: 'Optotype', def: `A standard test symbol, such as a Sloan letter or Landolt ring, built on a 5 by 5 grid so that its strokes and gaps are one-fifth of its height.` },
    { term: 'Vernier acuity', also: ['hyperacuity'], def: `The ability to see that two lines are offset, down to a few seconds of arc. It is much finer than the cone spacing.` }
  ],
  formulas: [
    {
      name: 'Height of a letter for a given acuity',
      expr: 'h = d*tan(5*M)', tex: 'h = d\\,\\tan(5\\,\\mathrm{MAR})',
      vars: {
        h: { name: 'height of the letter', q: 'length', unit: 'mm' },
        d: { name: 'viewing distance', q: 'length', unit: 'm', value: 6 },
        M: { name: 'minimum angle of resolution', q: 'angle', unit: '′', value: 1, min: 0.2, max: 60, tex: '\\mathrm{MAR}' }
      },
      solveFor: 'h',
      note: 'A 5-by-5 optotype is five times as tall as the stroke that the eye must resolve.',
      stories: { h: 'What height must a letter have at {d} for an eye whose MAR is {M} to read it just?', M: 'A letter {h} tall, at {d}, is just readable. What is the eye\'s MAR?' }
    },
    {
      name: 'logMAR',
      expr: 'L = log(M)', tex: '\\mathrm{logMAR} = \\log_{10}\\mathrm{MAR}',
      vars: {
        L: { name: 'logMAR', signed: true, tex: '\\mathrm{logMAR}' },
        M: { name: 'minimum angle of resolution, in arc-minutes', q: false, unit: '′', value: 2, min: 0.2, max: 100, tex: '\\mathrm{MAR}' }
      },
      solveFor: 'L',
      note: 'The logarithm is to base 10; 6/6 gives 0, and each 0.1 is a step of one chart line.'
    },
    {
      name: 'Snellen denominator',
      expr: 'x = 20*M', tex: 'x = 20\\,\\mathrm{MAR}',
      vars: {
        x: { name: 'denominator of 20/x' },
        M: { name: 'minimum angle of resolution, in arc-minutes', q: false, unit: '′', value: 2, min: 0.2, max: 100, tex: '\\mathrm{MAR}' }
      },
      solveFor: 'x',
      note: 'MAR of 1′ gives 20/20; 2′ gives 20/40. For the 6 m form use 6 × MAR.'
    },
    {
      name: 'Sampling limit of the cone mosaic',
      expr: 'nu = 1/(2*s)', tex: '\\nu_{N} = \\frac{1}{2s}',
      vars: {
        nu: { name: 'finest pattern the cones can sample', q: 'angfreq', unit: 'cycles/°', tex: '\\nu_{N}' },
        s: { name: 'spacing of the cones, in angle', q: 'angle', unit: '′', value: 0.5 }
      },
      solveFor: 'nu',
      note: 'A pattern needs two samples per cycle (the Nyquist limit): half an arc-minute spacing gives 60 cycles per degree.'
    }
  ],
  examples: [
    {
      title: 'A letter for 6/9',
      q: `How tall must a letter be, at 6 m, for a person with 6/9 acuity just to read it?`,
      steps: [
        `6/9 corresponds to a MAR of $9/6 = 1.5′$.`,
        { text: 'The letter is five times that stroke:', tex: 'h = 6000\\ \\mathrm{mm} \\times \\tan(5 \\times 1.5′) = 6000 \\times 0.00218 = 13.1\\ \\mathrm{mm}' }
      ],
      a: `13.1 mm, a letter on the 6/9 line of a chart.`
    },
    {
      title: 'The limit of the mosaic',
      q: `Cones 0.5′ apart: what finest grating can they sample, and to what Snellen fraction does it correspond if a stroke is half a cycle?`,
      steps: [
        { text: 'Two samples per cycle:', tex: '\\nu = \\frac{1}{2 \\times 0.5′} = 1\\ \\text{cycle per arc-minute} = 60\\ \\text{cycles/degree}' },
        `One stroke is half a cycle, 0.5′, so MAR = 0.5′ and the denominator is $20 \\times 0.5 = 10$.`
      ],
      a: `60 cycles per degree, which is 20/10: the limit of the best young eyes.`
    }
  ],
  quiz: [
    { q: 'A 6/6 letter has a height of 5 arc-minutes. How tall is it at 6 m?', choices: ['About 8.7 mm', 'About 1.7 mm', 'About 87 mm', 'About 0.87 mm'], a: 0, why: `$h = 6000\\ \\mathrm{mm}\\times\\tan(5′) = 8.7$ mm. The stroke is a fifth of that, 1.7 mm, one arc-minute.` },
    { q: 'A person reads 20/40 at best. What is the MAR, in arc-minutes?', answer: 2, unit: '′', why: `The denominator is $20\\times\\mathrm{MAR}$, so MAR $= 40/20 = 2′$ and the logMAR is 0.30.` },
    { q: 'Acuity is about the same in the centre and at 10° from it.', a: false, why: `By the rule of thumb the MAR at 10° is about five times that at the centre, because the cones are sparser and the nerve cells pool the signals.` },
    { q: 'Why can people see that two lines are slightly offset when the offset is smaller than the spacing of the cones?', choices: ['The brain compares the positions of the images across many cones', 'The cones move', 'The lens magnifies the offset', 'The lines are blurred and so look wider'], a: 0, why: `Vernier acuity (hyperacuity) does not resolve parts; it locates edges to a fraction of a cone by comparing the signals of many cones.` },
    { q: 'Which Snellen fraction is worse than 20/40?', choices: ['20/100', '20/20', '20/30', '20/10'], a: 0, why: `A bigger denominator means that the letter had to be bigger, or the viewer nearer, so that it could be read: 20/100 needs strokes of 5′, against 2′ for 20/40.` }
  ],
  applications: [
    `Eye charts and driving-licence tests use acuity, expressed as 6/6, 20/20, decimal or logMAR, with the 5-by-5 letters described here.`,
    `Cameras and displays are designed so that their pixels are smaller than the eye resolves at the viewing distance: about 1 arc-minute for a standard display, half of it for a "retina" display.`,
    `Road signs and printed text are sized for acuity: the stroke height of a sign letter is the distance times 1 arc-minute (about 1.7 mm per 6 m), times a factor for older viewers and poor light.`,
    `Low-vision aids use the ratio of the person's MAR to the normal one to say how much magnification a reader needs ([[low-vision-and-magnification]]).`
  ],
  history: `Hermann Snellen published his charts in 1862 in Utrecht, building letters whose details subtended one arc-minute at the test distance, a value that goes back to Robert Hooke's observation in the seventeenth century that two stars closer than about one arc-minute cannot be told apart. The logMAR chart with equal steps was introduced by Bailey and Lovie in 1976.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — acuity, the cone mosaic and the sampling limit.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — the retinal sampling of the image and acuity.`,
    `S. M. Anstis, "A chart demonstrating variations in acuity with retinal position", *Vision Research* 14 (1974) 589–592.`
  ],
  sim: 'ey-acuity'
},

/* ================================================================ contrast sensitivity */
{
  id: 'contrast-sensitivity', parent: 'eye-optics', title: 'Contrast sensitivity', level: 2,
  short: `Contrast sensitivity is how faint a pattern the eye can see, for each size of detail. The curve is an upside-down U that peaks at about 8 cycles per degree, where a contrast of 0.5 % is visible, and falls to zero near 60: acuity is only the right-hand end of it.`,
  keywords: ['contrast sensitivity', 'CSF', 'contrast sensitivity function', 'Campbell-Robson chart', 'Pelli-Robson', 'Michelson contrast', 'spatial frequency', 'cycles per degree', 'threshold', 'grating', 'low contrast', 'lateral inhibition'],
  prereq: ['the-fovea-and-visual-acuity', 'spatial-frequency-and-line-pairs', 'the-modulation-transfer-function'],
  related: ['visual-acuity-charts', 'resolution-and-contrast', 'the-pupil', 'cataract', 'glaucoma-and-the-visual-field', 'brightness-and-contrast-illusions', 'physics:resolution'],
  body: `
A chart of letters tests one thing: the smallest *high-contrast* detail that can be read. Real scenes are full of faint detail: a face in dusk, a grey car in fog, a pale line on paper. How well the eye does with *low contrast* is a second measurement, and the two together give the whole picture.

### Contrast and sensitivity
For a pattern of light and dark stripes, the **Michelson contrast** is

$$C = \\frac{L_{max} - L_{min}}{L_{max} + L_{min}}$$

from 0 (no pattern) to 1 (black and white). The **threshold** is the smallest contrast that can just be seen, and the **sensitivity** is its reciprocal, $S = 1/C_{threshold}$. The size of the stripes is described by their **spatial frequency** in cycles per degree, which for stripes of period $p$ seen at distance $d$ is $d/p$ cycles per radian (17.5 cycles per degree for 1 mm stripes seen from 1 m).

### The curve
Plotted for all spatial frequencies the sensitivity is the **contrast sensitivity function** (CSF), an upside-down U. With the typical shape of a young adult in good light, and a peak sensitivity of 200:

| Spatial frequency (cycles/°) | 0.5 | 1 | 2 | 4 | 8 | 16 | 30 | 50 | 60 |
|---|---|---|---|---|---|---|---|---|---|
| Sensitivity | 39 | 64 | 108 | 165 | 200 | 141 | 38 | 3 | 1 |
| Threshold contrast | 2.6 % | 1.6 % | 0.9 % | 0.6 % | 0.5 % | 0.7 % | 2.6 % | 29 % | about 100 % |

Three reasons make the curve what it is. At **high frequencies** the eye's optics blur the stripes (the modulation transfer function of the lens and the pupil) and the cones, 0.5′ apart, cannot sample finer patterns; this end meets a contrast of 100 % near 60 cycles per degree, and that point is the acuity limit, about 20/10 for a good eye. At **low frequencies** the retina's own circuits, which compare each point with its surroundings (lateral inhibition), suppress broad uniform patches. In the **middle**, a few cycles per degree, the eye sees best: this is where faces and most useful detail lie.

### The chart
The Campbell–Robson chart in the simulation puts the curve on the page: frequency rises from left to right, contrast falls from bottom to top, and the line where the stripes fade is the curve itself.

### What it depends on
Sensitivity falls with dim light, defocus, a small pupil (diffraction) or a large one (aberrations), and age; the *high-frequency* end is the first to suffer from blur. Eye conditions such as cataract and glaucoma can lower contrast sensitivity while acuity on a chart stays normal; the **Pelli–Robson chart** tests the low-contrast end with large letters that fade in steps.

### Why it matters
A single visual-acuity number is one point on this curve. Two people with the same 6/6 can see very differently in fog, at dusk and on a dim display.

> [!key] The eye's contrast sensitivity is an upside-down U in spatial frequency, peaking near 8 cycles per degree at about 0.5 % contrast and reaching zero near 60. Acuity measures only its right-hand end.
`,
  ideas: [
    `Contrast is (Lmax − Lmin)/(Lmax + Lmin); sensitivity is the reciprocal of the smallest contrast that can be seen.`,
    `The contrast sensitivity function is an upside-down U: sensitivity peaks near 8 cycles per degree (a contrast of about 0.5 %).`,
    `The high-frequency end falls because of the eye's optics and the cone spacing, and reaches zero near 60 cycles per degree: the acuity limit.`,
    `The low-frequency end falls because of lateral inhibition in the retina.`,
    `A chart of letters tests only the high-contrast end; two people with the same acuity can differ in low-contrast vision.`
  ],
  pitfalls: [
    `Good acuity means good vision in every condition — Acuity is the high-contrast, fine-detail end of the curve. Fog, dusk, glare and some eye conditions reduce sensitivity at medium frequencies, where daily life happens, while a chart still reads 6/6.`,
    `The eye sees coarse patterns best — The sensitivity is highest at medium detail, about 8 cycles per degree, and falls at low frequencies, where the retina's circuits suppress broad uniform areas.`,
    `Contrast sensitivity is a fixed property of the eye — It changes with the light, the pupil, the focus and the age, and it differs between observers and tests.`,
    `Stripes finer than the limit are invisible — They can still be seen, as false coarse patterns, if the display or the receptor array samples them too coarsely (aliasing).`
  ],
  terms: [
    { term: 'Contrast', also: ['Michelson contrast', 'modulation'], def: `For a pattern of light and dark, the difference of the extreme luminances divided by their sum. 0 is no pattern; 1 is black and white.` },
    { term: 'Contrast threshold', def: `The smallest contrast at which a pattern can just be seen. The typical best value is about 0.5 %.` },
    { term: 'Contrast sensitivity function', also: ['CSF'], def: `The curve of contrast sensitivity, the reciprocal of the contrast threshold, against spatial frequency. For the human eye it is an inverted U with a peak at about 4 to 8 cycles per degree.` },
    { term: 'Spatial frequency', also: ['cycles per degree', 'cpd'], def: `The number of light-dark cycles of a pattern that fit in one degree of the field of view. A 6/6 letter has details of about 30 cycles per degree.` },
    { term: 'Campbell–Robson chart', def: `A chart of stripes whose frequency rises across the page and whose contrast falls up the page, so that the boundary where the stripes vanish traces the contrast sensitivity curve.` },
    { term: 'Pelli–Robson chart', def: `A chart of large letters whose contrast falls in steps, used to test low-contrast sensitivity at a medium spatial frequency.` }
  ],
  formulas: [
    {
      name: 'Michelson contrast',
      expr: 'C = (Lmax - Lmin)/(Lmax + Lmin)', tex: 'C = \\frac{L_{\\max} - L_{\\min}}{L_{\\max} + L_{\\min}}',
      vars: {
        C: { name: 'contrast', q: 'ratio', unit: '%' },
        Lmax: { name: 'luminance of the bright parts', q: 'luminance', unit: 'cd/m²', value: 120, tex: 'L_{\\max}' },
        Lmin: { name: 'luminance of the dark parts', q: 'luminance', unit: 'cd/m²', value: 114, tex: 'L_{\\min}' }
      },
      solveFor: 'C',
      stories: { C: 'A pattern is {Lmax} in its bright parts and {Lmin} in its dark ones. What is its contrast?' }
    },
    {
      name: 'Sensitivity from the threshold',
      expr: 'S = 1/C', tex: 'S = \\frac{1}{C}',
      vars: {
        S: { name: 'contrast sensitivity' },
        C: { name: 'threshold contrast', q: 'ratio', unit: '%', value: 0.5, min: 0.01, max: 100 }
      },
      solveFor: 'S',
      note: 'A threshold of 0.5 % is a sensitivity of 200.'
    },
    {
      name: 'Spatial frequency of stripes',
      expr: 'nu = d/p', tex: '\\nu = \\frac{d}{p}',
      vars: {
        nu: { name: 'spatial frequency', q: 'angfreq', unit: 'cycles/°', tex: '\\nu' },
        d: { name: 'viewing distance', q: 'length', unit: 'm', value: 1 },
        p: { name: 'period of the stripes (one light and one dark)', q: 'length', unit: 'mm', value: 1 }
      },
      solveFor: 'nu',
      note: 'The number of cycles per radian is distance over period (for small angles); the calculator converts to cycles per degree.',
      stories: { nu: 'Stripes with a period of {p} are viewed from {d}. What is their spatial frequency?' }
    }
  ],
  examples: [
    {
      title: 'A faint letter',
      q: `A grey letter is printed on grey paper: the paper has a luminance of 120 cd/m² and the letter 114 cd/m². What is the contrast, and can a typical eye see detail of 30 cycles per degree at that contrast?`,
      steps: [
        { text: 'The contrast:', tex: 'C = \\frac{120 - 114}{120 + 114} = 0.026 = 2.6\\ \\%' },
        `At 30 cycles per degree the typical threshold is 2.6 %: the letter is at the limit of visibility.`
      ],
      a: `A contrast of 2.6 %, which is just the threshold at 30 cycles per degree, the detail of a 6/6 letter. A paler letter would disappear even for a 6/6 eye.`
    },
    {
      title: 'The pixels of a screen',
      q: `A screen has pixels 0.25 mm apart and is viewed from 60 cm. At what spatial frequency does the pixel grid itself (a period of two pixels) fall, and is that within the visible range?`,
      steps: [
        `The period of one light and one dark pixel is 0.5 mm.`,
        { text: 'The frequency is', tex: '\\nu = \\frac{d}{p} = \\frac{600}{0.5} = 1200\\ \\text{cycles/radian} = 21\\ \\text{cycles/degree}' }
      ],
      a: `21 cycles per degree: well inside the visible range (the limit is about 50–60), so the pixel structure can be seen at this distance.`
    }
  ],
  quiz: [
    { q: 'Where is the contrast sensitivity of the eye greatest?', choices: ['At about 8 cycles per degree', 'At the highest spatial frequencies', 'At the lowest spatial frequencies', 'It is equal at all frequencies'], a: 0, why: `The curve rises from low frequencies, peaks at a few to 8 cycles per degree, then falls to zero near 60.` },
    { q: 'Two eyes that both read 6/6 must have the same contrast sensitivity.', a: false, why: `Acuity only fixes the high-frequency end of the curve (where sensitivity falls to 1). The curve at medium frequencies can differ, with the light, the focus and the state of the eye.` },
    { q: 'A pattern has a bright luminance of 110 and a dark one of 90 cd/m². What is its Michelson contrast, in per cent?', answer: 10, unit: '%', why: `$C = (110 - 90)/(110 + 90) = 0.10$, which is 10 %.` },
    { q: 'What causes the fall of sensitivity at low spatial frequencies?', choices: ['Lateral inhibition in the retina, which suppresses broad uniform regions', 'The diffraction of the pupil', 'The spacing of the cones', 'The thickness of the lens'], a: 0, why: `The retina's cells compare each point with its surroundings, which cuts the response to slow changes of brightness. The loss at high frequencies is optical and from the cone sampling.` },
    { q: 'On the Campbell–Robson chart the stripes fade out along a curve. What is that curve?', choices: ['The eye\'s contrast threshold for each spatial frequency', 'The contrast of the printing', 'The focus error of the eye', 'The modulation of the screen'], a: 0, why: `Frequency increases to the right and contrast falls upwards; the boundary of what can be seen is where contrast equals the threshold at that frequency.` }
  ],
  applications: [
    `Eye care uses contrast tests such as the Pelli–Robson chart to find losses that an acuity chart misses.`,
    `Image and video compression (JPEG and its relatives) allocates fewer bits to spatial frequencies where the eye is least sensitive.`,
    `Display design: whether a pixel grid, a screen-door effect or text smoothing is visible follows from the CSF and the viewing distance.`,
    `Road signs, number plates and cockpit displays are designed with enough contrast at the spatial frequencies of their symbols to be read at dusk and in fog.`
  ],
  history: `Fergus Campbell and John Robson published in 1968 their way of testing the eye with sine-wave gratings of different spatial frequencies, which showed that the eye's response is best described as a set of channels tuned to different frequencies, not just a limit on the smallest detail. The Pelli–Robson chart followed in 1988. The curve used in the simulation is the closed-form fit published by Mannos and Sakrison in 1974.`,
  sources: [
    `F. W. Campbell and J. G. Robson, "Application of Fourier analysis to the visibility of gratings", *Journal of Physiology* 197 (1968) 551–566.`,
    `J. L. Mannos and D. J. Sakrison, "The effects of a visual fidelity criterion on the encoding of images", *IEEE Transactions on Information Theory* 20 (1974) 525–536 — the curve used here.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — spatial vision and the contrast sensitivity function.`
  ],
  sim: 'ey-csf'
}

);

Hyper.add(

/* ================================================================ the visual field */
{
  id: 'the-visual-field', parent: 'eye-optics', title: 'The visual field', level: 1,
  short: `The visual field is everything one eye sees while it looks straight ahead: about 60° towards the nose, 100° towards the temple, 60° up and 75° down. Two eyes cover about 200° across, 120° of it seen by both. Only the middle 2° or so is sharp, and a patch 15° from the centre, the blind spot, is not seen at all.`,
  keywords: ['visual field', 'field of view of the eye', 'peripheral vision', 'binocular field', 'monocular field', 'blind spot', 'optic disc', 'perimetry', 'tunnel vision', 'central vision', 'field of vision', '200 degrees'],
  prereq: ['anatomy-of-the-eye', 'the-eye-as-a-camera', 'the-retina-rods-and-cones'],
  related: ['the-fovea-and-visual-acuity', 'binocular-vision-and-stereopsis', 'the-blind-spot-and-filling-in', 'perimetry', 'glaucoma-and-the-visual-field', 'field-of-view-and-focal-length', 'binoculars', 'physics:the-eye'],
  body: `
Close one eye and look at a point straight ahead. Without moving, notice how much you still know of what lies around it: a hand waving at the side, the edge of your nose, a light on the ceiling. That whole region is the **visual field**, measured as the angles from the line of sight over which a small target can still be seen.

### How far it reaches
| Direction | One eye, from the line of sight |
|---|---|
| Towards the nose (nasal) | about 60° |
| Towards the temple (temporal) | about 100° |
| Up | about 60° |
| Down | about 75° |

The nose, the brow and the cheek set the limits. Each eye therefore covers 160° across and 135° from top to bottom. Two eyes together cover about **200°** across, because the fields overlap by about **120°** in the middle: $2\\times160° - 120° = 200°$. The overlap is where both eyes see the same thing and depth can be judged from the difference between them ([[binocular-vision-and-stereopsis]]). Many prey animals have eyes at the sides of the head, a panoramic field and little overlap; those of hunters face forward, as ours do.

### Seeing is not equal across the field
- **Detail.** The sharp zone is only about 2° across, about the width of your thumb at arm's length, and the macula adds a coarse zone to 5° ([[the-fovea-and-visual-acuity]]). The share of the field that sees sharply is far below one per cent.
- **Colour.** Large bright targets keep their colour out to about 60°; the field for blue extends a little farther than that for red and green. Dim or small targets lose colour much sooner.
- **Movement and flicker.** The periphery is good at noticing change, which is why something moving at the edge of your view makes you turn ([[flicker-and-persistence-of-vision]]).
- **Dim light.** Rods dominate the periphery, so at night it is more sensitive than the centre ([[light-and-dark-adaptation]]).

### The blind spot
About 15° from the line of sight on the temple side of each eye is a patch about 5.5° wide and 7.5° high: the image of the optic disc, which has no receptors. It is eleven times as wide as the full Moon. We never notice it, because the brain fills it in from its surroundings ([[the-blind-spot-and-filling-in]]) and because the other eye covers it. The test in the simulation puts a dot on it: close the left eye, look at the cross with the right, and the dot disappears when the distance to the screen is the separation divided by $\\tan 15°$.

### Measuring it, and losing it
[[perimetry]] maps the field by showing dim spots at known angles on a dome. The shape of a field defect, an arc, a half-field or a shrinking ring, tells an eye professional where in the eye or the brain the signal is interrupted ([[glaucoma-and-the-visual-field]]).

> [!warn] This page describes a normal visual field. A new dark patch, a curtain or shadow that moves across the view, or a sudden narrowing of what you can see needs an examination at once: seek urgent eye care.

> [!key] One eye sees about 160° across and 135° up and down; two eyes see about 200° across, 120° of it overlapping. Only the central 2° is sharp; the blind spot lies 15° out towards the temple.
`,
  ideas: [
    `One eye sees about 60° nasal, 100° temporal, 60° up and 75° down.`,
    `Two eyes cover about 200° across, with 120° seen by both eyes; that overlap is where depth is judged from disparity.`,
    `Only the central 2° is sharp; colour reaches about 60°; movement and dim light are served by the periphery.`,
    `The blind spot, 5.5° by 7.5°, lies 15° from the line of sight on the temple side, where the optic nerve leaves.`,
    `Perimetry maps the field; patterns of loss help to locate a problem.`
  ],
  pitfalls: [
    `We see 200° at once in sharp detail — Only a small spot at the centre is sharp. The rest of the field is coarse, and the feeling of a rich surrounding is built from where the eyes have just been.`,
    `The blind spot is a hole that we get used to — It is not noticed because the brain fills it in, and the other eye covers it. It does not shrink; the test shows it is always there.`,
    `Peripheral vision is just a weaker version of central vision — The periphery is poor at detail and colour but better than the centre at detecting movement and, in the dark, faint light.`,
    `A wider field of view in a camera lens means that the lens sees as much as the eye — A 24 mm full-frame lens covers 74° across, much less than the eye's 200°, and everything in that picture is sharp, unlike the eye's.`
  ],
  terms: [
    { term: 'Visual field', also: ['field of vision'], def: `The region of space, given as angles from the line of sight, in which a target can be seen while the eye looks straight ahead.` },
    { term: 'Monocular and binocular field', def: `The field of one eye, and the part (about 120° across) that both eyes see at once. Together the two eyes cover about 200° across.` },
    { term: 'Peripheral vision', also: ['central and peripheral field'], def: `Vision away from the line of sight: poor in detail and colour, good at movement and, in dim light, at faint targets.` },
    { term: 'Blind spot', also: ['physiological scotoma'], def: `The patch of the field, 15° from the line of sight towards the temple, whose image falls on the optic disc where there are no receptors.` },
    { term: 'Perimetry', def: `The measurement of the visual field by showing targets of known size and brightness at different angles and recording which are seen.` }
  ],
  formulas: [
    {
      name: 'Angle subtended by a window or screen',
      expr: 'theta = 2*atan(w/(2*d))', tex: '\\theta = 2\\arctan\\frac{w}{2d}',
      vars: {
        theta: { name: 'angle across the field', q: 'angle', unit: '°', tex: '\\theta' },
        w: { name: 'width of the object', q: 'length', unit: 'cm', value: 60 },
        d: { name: 'distance from the eye', q: 'length', unit: 'cm', value: 70 }
      },
      solveFor: 'theta',
      stories: { theta: 'A screen {w} wide is viewed from {d}. How much of the field does it cover, across?', d: 'How far from a screen {w} wide must the eye be for the screen to cover {theta}?' }
    },
    {
      name: 'Distance for the blind-spot test',
      expr: 'd = s/tan(theta)', tex: 'd = \\frac{s}{\\tan\\theta}',
      vars: {
        d: { name: 'distance from the eye to the page', q: 'length', unit: 'cm' },
        s: { name: 'separation of the cross and the dot', q: 'length', unit: 'mm', value: 60 },
        theta: { name: 'angle of the blind spot from the line of sight', q: 'angle', unit: '°', value: 15, min: 5, max: 30, tex: '\\theta' }
      },
      solveFor: 'd',
      note: 'Close the left eye, look at the cross with the right eye: the dot vanishes at this distance.'
    }
  ],
  examples: [
    {
      title: 'A phone and a monitor',
      q: `A phone 7 cm wide is held at 30 cm; a monitor 60 cm wide is viewed from 70 cm. How much of the 160° horizontal field of one eye does each cover?`,
      steps: [
        { text: 'The phone:', tex: '\\theta = 2\\arctan\\frac{7}{2 \\times 30} = 13.3°' },
        { text: 'The monitor:', tex: '\\theta = 2\\arctan\\frac{60}{2 \\times 70} = 46.4°' },
        `As fractions of 160°: 8 % and 29 %. Both are far larger than the 2° that sees sharply, so the eye has to scan them ([[eye-movements]]).`
      ],
      a: `13° (8 % of the field) and 46° (29 %).`
    },
    {
      title: 'Setting up the blind-spot test',
      q: `A cross and a dot are 60 mm apart on a page. At what distance should the right eye be held for the dot to fall on the blind spot, 15° from the line of sight?`,
      steps: [
        { text: 'From the geometry:', tex: 'd = \\frac{s}{\\tan 15°} = \\frac{60\\ \\mathrm{mm}}{0.268} = 224\\ \\mathrm{mm}' }
      ],
      a: `About 22 cm. At twice the separation the distance doubles, to 45 cm.`
    }
  ],
  quiz: [
    { q: 'About how many degrees across do two eyes cover together?', choices: ['About 200°', 'About 120°', 'About 160°', 'About 270°'], a: 0, why: `Each eye covers about 160° across (60° nasal and 100° temporal), and the fields overlap by 120°: $2 \\times 160 - 120 = 200$.` },
    { q: 'The part of the field seen by both eyes is about 120° wide.', a: true, why: `Each eye's nasal field is about 60°, so the central 120° is seen by both. That overlap is where depth is judged from the difference between the two images.` },
    { q: 'A cross and a dot are 90 mm apart. At what distance, in millimetres, should the right eye be for the dot to fall on the blind spot at 15°?', answer: 336, unit: 'mm', why: `$d = s/\\tan 15° = 90/0.268 = 336$ mm.` },
    { q: 'Why do we not notice the blind spot?', choices: ['The brain fills it in, and the other eye covers it', 'It is too small to see', 'It moves with the eye', 'The cornea hides it'], a: 0, why: `The patch (5.5° by 7.5°) is large; it is concealed because the brain fills it with surrounding patterns and because the other eye sees that part of the field.` },
    { q: 'In which of these is the periphery of the field better than the centre?', choices: ['Detecting faint light in the dark and detecting movement', 'Reading small print', 'Telling colours apart', 'Judging fine detail'], a: 0, why: `The periphery is rich in rods and its signals are pooled: it sees faint light and change well, and detail and colour poorly.` }
  ],
  applications: [
    `Perimetry tests in eye care map the field; the results are a main way to follow some diseases and to show where a problem in the visual pathway lies.`,
    `Driving rules and the design of vehicles, goggles and masks take into account how much of the field a frame or a pillar blocks.`,
    `Photographers and film-makers choose a lens for the share of the field it will fill; virtual-reality headsets try to reach about 100° across.`,
    `Interface and warning design: a message at the edge of the field is noticed because it moves or flashes, not because its text can be read.`
  ],
  history: `The blind spot was discovered by Edme Mariotte in 1668, who noticed that an object vanishes when its image falls on the place where the optic nerve enters the eye. Quantitative perimetry began in the nineteenth century with arc instruments such as Förster's, and Hans Goldmann's bowl perimeter of 1945 standardised the test.`,
  sources: [
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000) — the extent of the visual field and the blind spot.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — the retina and the visual field.`,
    `J. Schwiegerling, *Field Guide to Visual and Ophthalmic Optics* (SPIE, 2004).`
  ],
  sim: [{ id: 'ey-field', params: { mode: 'field' } }]
},

/* ================================================================ binocular vision and stereopsis */
{
  id: 'binocular-vision-and-stereopsis', parent: 'eye-optics', title: 'Binocular vision and stereopsis', level: 2,
  short: `Two eyes about 63 mm apart see a scene from two points. The angle at which they converge and, above all, the small differences between their two images, the disparity, give the sense of depth called stereopsis. It can detect differences of a few seconds of arc, but its range ends at a few hundred metres.`,
  keywords: ['binocular vision', 'stereopsis', 'disparity', 'binocular disparity', 'convergence', 'vergence', 'interpupillary distance', 'stereo acuity', 'depth perception', 'random-dot stereogram', 'diplopia', 'fusion', 'horopter', 'Panum'],
  prereq: ['the-visual-field', 'accommodation', 'the-eye-as-a-camera'],
  related: ['stereoscopic-3d-displays', 'autostereograms-and-lenticular-images', 'depth-and-perspective-illusions', 'amblyopia-and-strabismus', 'cover-test-and-binocular-balance', 'prism-in-spectacles', 'binoculars', 'projections:photogrammetry'],
  body: `
Hold a finger up at arm's length and close each eye in turn: the finger jumps against the background. That jump, the difference between what the two eyes see, is the raw material of depth perception.

### Convergence
To look at a point at distance $d$ both eyes turn inwards, and the angle between their lines of sight is

$$\\theta = 2\\arctan\\frac{a}{2d}$$

with $a$ the **interpupillary distance**, about 63 mm for an adult (50 to 75 mm is the range). It is 0.6° at 6 m, 3.6° at 1 m and 9.0° at 40 cm. Eye care expresses it in prism dioptres, $100\\,a/d$: 6.3 Δ at 1 m and 15.8 Δ at 40 cm. The brain senses the effort of the eye muscles, a weak cue for distances up to a few metres.

### Disparity
A second point B at another distance falls on slightly different places in the two retinas. The difference of the two vergence angles is the **binocular disparity**:

$$\\eta = a\\left(\\frac{1}{d_1} - \\frac{1}{d_2}\\right)$$

For two points 5 m and 5.5 m away it is 236″, plainly visible; for points 100 m and 105 m away it is only 6″. A point behind the fixation point has uncrossed disparity, one in front crossed.

### How small a step can be seen
**Stereo acuity** is the smallest disparity that gives depth: typically 10 to 60 arc-seconds in clinical tests (20″ is used here), a few seconds in the best observers: finer than the spacing of the cones, 30″. The smallest depth step at distance $d$ follows by turning the formula round:

$$\\Delta d = \\frac{\\eta\\,d^2}{a}$$

| Distance | 0.5 m | 1 m | 5 m | 20 m | 100 m |
|---|---|---|---|---|---|
| Smallest step for 20″ | 0.4 mm | 1.5 mm | 3.8 cm | 62 cm | 15 m |

It grows with the *square* of the distance, so stereopsis is precise at arm's length and gone at a distance: when the step equals the distance itself, at $a/\\eta = 650$ m for 20″, even a point at infinity is not distinguished from this one.

### Matching the two images
To measure disparity the brain must decide which point in one eye's image corresponds to which in the other. Béla Julesz showed with random-dot stereograms (1960) that this alone creates depth: two patterns of random dots, identical except for a shifted patch, each show no shape to either eye, and together make a floating square. Disparities up to a fraction of a degree fuse; larger ones are seen double (diplopia): look at a far wall with a finger at 30 cm and the finger appears double.

### Other cues, and what two eyes give
Beyond some tens of metres depth comes from monocular cues (size, perspective, overlap, shading, haze) and from the motion of the scene when the head moves. Two eyes also give a field wider than one's, a covered blind spot, and a gain in sensitivity of about 40 % over one eye. A fair proportion of people, from a few per cent to about one in ten by different estimates, have little or no stereopsis, and judge distance well with the other cues; early misalignment of the eyes is a common cause ([[amblyopia-and-strabismus]]).

> [!key] Two eyes 63 mm apart converge by $\\theta = 2\\arctan(a/2d)$ and see differences of $\\eta = a(1/d_1 - 1/d_2)$ between their images; stereo acuity of a few tens of seconds makes depth steps of 1.5 mm visible at 1 m and none beyond a few hundred metres.
`,
  ideas: [
    `Two eyes about 63 mm apart see a scene from two points; the difference between the images, the disparity, gives depth.`,
    `Convergence is 2 arctan(a/2d): 3.6° at 1 m, 9° at 40 cm, and only a weak cue beyond a few metres.`,
    `Disparity is a(1/d₁ − 1/d₂); stereo acuity of about 20″ detects steps of 1.5 mm at 1 m.`,
    `The smallest visible depth step grows as the square of the distance; stereopsis ends at a few hundred metres.`,
    `Random-dot stereograms show that matching the two images alone makes depth, with no object visible to either eye.`
  ],
  pitfalls: [
    `Depth perception needs two eyes — Many cues work with one eye: perspective, overlap, shading, haze and motion parallax. A person with one eye judges distance well, though not as finely as with two at arm's length.`,
    `Convergence is the main cue to the distance of faraway things — The angle between the lines of sight falls below a degree beyond about 3.6 m and is useless for judging distance far away; disparity and the other cues take over.`,
    `Disparity falls inversely with distance, so depth steps are equally visible at any distance — The disparity of a step of given size falls as $1/d^2$, which is why the smallest visible step grows as $d^2$.`,
    `3-D films give depth because they trick the focusing — They give each eye its own image, and so a disparity; the focus stays on the screen, which is one reason why some viewers tire.`
  ],
  terms: [
    { term: 'Binocular disparity', def: `The difference between the positions of a point in the two eyes' images, measured as an angle. It is the main cue to depth at distances up to about 100 m.` },
    { term: 'Stereopsis', also: ['stereoscopic vision', 'stereo vision'], def: `The sense of depth that arises from the binocular disparity of the images in the two eyes.` },
    { term: 'Convergence', also: ['vergence'], def: `The turning of the two eyes inwards to look at a near object. The angle between the lines of sight is $2\\arctan(a/2d)$.` },
    { term: 'Interpupillary distance', also: ['IPD', 'PD'], def: `The distance between the centres of the pupils of the two eyes: about 63 mm in an adult, with a range from about 50 to 75 mm.` },
    { term: 'Stereo acuity', also: ['stereoacuity'], def: `The smallest binocular disparity that produces a sense of depth, usually 10 to 60 arc-seconds.` },
    { term: 'Diplopia', also: ['double vision'], def: `Seeing one object as two when its images fall on parts of the two retinas that the brain cannot fuse.` }
  ],
  formulas: [
    {
      name: 'Convergence angle',
      expr: 'theta = 2*atan(a/(2*d))', tex: '\\theta = 2\\arctan\\frac{a}{2d}',
      vars: {
        theta: { name: 'angle between the lines of sight', q: 'angle', unit: '°', tex: '\\theta' },
        a: { name: 'interpupillary distance', q: 'length', unit: 'mm', value: 63 },
        d: { name: 'distance of the fixation point', q: 'length', unit: 'm', value: 1 }
      },
      solveFor: 'theta',
      stories: { theta: 'A person with eyes {a} apart looks at a point {d} away. At what angle do the lines of sight meet?', d: 'The eyes, {a} apart, converge by {theta}. How far away is the point?' }
    },
    {
      name: 'Binocular disparity of two points',
      expr: 'eta = a*(1/d1 - 1/d2)', tex: '\\eta = a\\left(\\frac{1}{d_1} - \\frac{1}{d_2}\\right)',
      vars: {
        eta: { name: 'disparity', q: 'angle', unit: '″', signed: true, tex: '\\eta' },
        a: { name: 'interpupillary distance', q: 'length', unit: 'mm', value: 63 },
        d1: { name: 'distance of the nearer point', q: 'length', unit: 'm', value: 5, tex: 'd_1' },
        d2: { name: 'distance of the farther point', q: 'length', unit: 'm', value: 5.5, tex: 'd_2' }
      },
      solveFor: 'eta',
      note: 'For small angles. Positive when the second point is farther than the first.',
      stories: { eta: 'Two points are {d1} and {d2} away from a viewer whose eyes are {a} apart. What is their binocular disparity?' }
    },
    {
      name: 'Smallest depth step that can be seen',
      expr: 'dd = eta*d^2/a', tex: '\\Delta d = \\frac{\\eta\\,d^{2}}{a}',
      vars: {
        dd: { name: 'depth step', q: 'length', unit: 'cm', tex: '\\Delta d' },
        eta: { name: 'stereo acuity', q: 'angle', unit: '″', value: 20, tex: '\\eta' },
        d: { name: 'distance', q: 'length', unit: 'm', value: 5 },
        a: { name: 'interpupillary distance', q: 'length', unit: 'mm', value: 63 }
      },
      solveFor: 'dd',
      note: 'Valid while the step is small against the distance.'
    }
  ],
  examples: [
    {
      title: 'Reading distance',
      q: `A reader looks at a page 40 cm away with eyes 63 mm apart. What convergence is that, in degrees and prism dioptres?`,
      steps: [
        { text: 'The angle:', tex: '\\theta = 2\\arctan\\frac{63}{2 \\times 400} = 9.0°' },
        `In prism dioptres, $100 \\times 0.063/0.40 = 15.75$ Δ.`
      ],
      a: `9.0°, or 15.8 prism dioptres.`
    },
    {
      title: 'Near against far',
      q: `For a viewer with a stereo acuity of 20″, which of two depth steps is easier to see: 50 cm between points 5 m and 5.5 m away, or 5 m between points 100 m and 105 m away?`,
      steps: [
        { text: 'First pair:', tex: '\\eta = 0.063\\,\\left(\\frac{1}{5} - \\frac{1}{5.5}\\right) = 1.15 \\times 10^{-3}\\ \\mathrm{rad} = 236″' },
        { text: 'Second pair:', tex: '\\eta = 0.063\\,\\left(\\frac{1}{100} - \\frac{1}{105}\\right) = 3.0 \\times 10^{-5}\\ \\mathrm{rad} = 6.2″' }
      ],
      a: `The first, at 236″, is far above the 20″ threshold; the second, at 6″, is below it. A tenfold larger step at 20 times the distance is still less visible.`
    }
  ],
  quiz: [
    { q: 'About how large is the convergence angle of two eyes 63 mm apart looking at a point 1 m away?', choices: ['About 3.6°', 'About 36°', 'About 0.36°', 'About 7.2°'], a: 0, why: `$\\theta = 2\\arctan(0.063/2) = 3.6°$; at 40 cm it is 9°.` },
    { q: 'At 10 times the distance, the smallest depth step that can be seen is about 10 times larger.', a: false, why: `The smallest step is $\\eta d^2/a$, which grows as the square of the distance: 100 times larger.` },
    { q: 'What is the smallest depth step, in cm, for a stereo acuity of 20″ at 5 m with eyes 63 mm apart?', answer: 3.8, unit: 'cm', why: `$\\Delta d = \\eta d^2/a = (20/206\\,265) \\times 25/0.063 = 0.0385$ m.` },
    { q: 'What do random-dot stereograms show?', choices: ['Depth can be seen from disparity alone, with no recognisable object in either image', 'The brain needs two eyes to see colour', 'Convergence is the main cue to depth', 'Both eyes must see the same pattern'], a: 0, why: `Julesz's patterns have no shape in either eye's image; the brain, by matching the dots and measuring their offsets, builds a floating shape out of the disparity alone.` },
    { q: 'Why does a person with sight in one eye still judge distance reasonably?', choices: ['Perspective, overlap, shading, haze, size and motion parallax all give depth with one eye', 'The other eye compensates', 'The brain adds the missing image', 'Convergence still works'], a: 0, why: `Most depth cues are monocular. Disparity adds fine depth steps at close range, which is what a single eye misses.` }
  ],
  applications: [
    `3-D cinema, headsets and stereoscopic displays give each eye its own image with a disparity that corresponds to the intended depth; their comfort depends on how it compares with the focus demand.`,
    `Range finding and photogrammetry reproduce the arrangement with two cameras: the distance of a point follows from its disparity, as in the human eye, and a longer baseline reaches farther.`,
    `Binoculars and stereo microscopes have two optical paths, sometimes with a wider baseline than the eyes (as in some binoculars), to exaggerate depth.`,
    `Eye care checks that the eyes work together: tests of alignment, stereo acuity and fusion form part of an examination, especially in children.`
  ],
  history: `Charles Wheatstone showed in 1838 that depth can be made from two flat pictures, one for each eye, and built the stereoscope to show it; the paper that began the study of stereopsis is his "Contributions to the physiology of vision". Béla Julesz introduced random-dot stereograms in 1960, which proved that the matching can be done before any shape is recognised.`,
  sources: [
    `I. P. Howard and B. J. Rogers, *Binocular Vision and Stereopsis* (Oxford University Press, 1995).`,
    `B. Julesz, *Foundations of Cyclopean Perception* (University of Chicago Press, 1971) — random-dot stereograms.`,
    `C. Wheatstone, "Contributions to the physiology of vision. Part the first", *Philosophical Transactions of the Royal Society* 128 (1838) 371–394.`
  ],
  sim: 'ey-stereo'
},

/* ================================================================ eye movements */
{
  id: 'eye-movements', parent: 'eye-optics', title: 'Eye movements', level: 2,
  short: `Because only the central 2° sees sharply, the eyes keep moving. They jump between fixations, three or four times a second, in saccades that last 20 to 100 ms and reach hundreds of degrees per second; they glide after moving targets in smooth pursuit; and even when they hold still they drift and tremble.`,
  keywords: ['eye movements', 'saccade', 'smooth pursuit', 'fixation', 'microsaccade', 'drift', 'tremor', 'vestibulo-ocular reflex', 'optokinetic', 'vergence', 'saccadic suppression', 'main sequence', 'eye tracking', 'nystagmus'],
  prereq: ['the-fovea-and-visual-acuity', 'the-visual-field', 'anatomy-of-the-eye'],
  related: ['binocular-vision-and-stereopsis', 'flicker-and-persistence-of-vision', 'motion-illusions', 'the-retina-rods-and-cones', 'contrast-sensitivity', 'perimetry', 'physics:the-eye'],
  body: `
The sharp part of the visual field is about 2° across. To inspect a scene the eyes must therefore be turned from point to point, by six small muscles on each globe, and the way they are turned depends on what the eyes are doing.

### Saccades
A **saccade** is a rapid jump from one fixation to the next, made three or four times a second. Its size can be anything from a fraction of a degree to 40° or more; the eye accelerates, runs, and brakes, in a time of about

$$T \\approx 21 + 2.2\\,A\\ \\text{ms}$$

for an amplitude of $A$ degrees: 43 ms for 10°, 65 ms for 20°. These are among the fastest movements the body makes: with a smooth profile the peak speed is about 1.9 times the average and reaches 440°/s for 10° and about 580°/s for 20°, after which it levels off. A saccade cannot be steered once started, and it starts about 200 ms after a target appears. In reading the saccades are about 2° long (7 to 9 letters) and the fixations last 200 to 250 ms.

| Saccade | 1° | 5° | 10° | 20° | 40° |
|---|---|---|---|---|---|
| Duration (ms) | 23 | 32 | 43 | 65 | 109 |
| Average speed (°/s) | 43 | 156 | 233 | 308 | 367 |

### Saccadic suppression
During a saccade the image slides across the retina at hundreds of degrees a second, and it is not seen: sensitivity falls just before and during the jump. This is why you cannot watch your own eyes move in a mirror, and why the world does not smear every time you look around.

### Smooth pursuit
To follow a moving target the eyes turn smoothly, at its speed. The ratio of the eye's speed to the target's, the gain, is close to 1 up to 20 to 30°/s and falls for faster targets, which the eyes then follow with a mixture of smooth movement and catch-up saccades. The eyes cannot glide smoothly across a stationary scene on command: try it, and they jump.

### Reflexes
The **vestibulo-ocular reflex** turns the eyes against the head within about 10 ms, so that the image stays still on the retina when you walk or nod. The **optokinetic** response follows a moving scene (a train window) with a slow drift and a quick return. **Vergence** turns the eyes in opposite directions to look near or far ([[binocular-vision-and-stereopsis]]).

### Even a held gaze moves
When fixing a point the eyes make *tremor* (a tiny shake, a fraction of an arc-minute, at 50 to 100 Hz), *drift* (a slow wander of a few arc-minutes per second) and *microsaccades* (jumps of 6 to 30 arc-minutes, once or twice a second) that bring the gaze back. These movements are needed: an image held fixed on the retina, with no movement relative to it, fades from view in seconds. The simulation shows all three kinds.

> [!key] The eyes jump (saccades, $T \\approx 21 + 2.2A$ ms, up to 500°/s), glide after moving targets (pursuit) and, even when still, drift and make microsaccades; vision is suppressed in each jump, and a steady image would fade without the motion.
`,
  ideas: [
    `Saccades are fast jumps, 3 to 4 a second, lasting about 21 + 2.2 A milliseconds for A degrees and reaching hundreds of degrees per second.`,
    `Vision is suppressed during a saccade; the eyes cannot be steered once a saccade has begun.`,
    `Smooth pursuit follows a moving target at its speed up to about 30°/s; faster ones add catch-up saccades.`,
    `The vestibulo-ocular reflex keeps the image steady when the head moves, within about 10 ms.`,
    `A steady fixation still has tremor, drift and microsaccades, and a perfectly stabilised image fades away.`
  ],
  pitfalls: [
    `We can see the world while the eyes are moving, like a video panning — The signal from the eye during a saccade is suppressed. The brain gives the impression of continuity by combining the successive fixations.`,
    `The eye can sweep smoothly across a still scene — Without a moving target the eyes cannot glide: they jump. Smooth movement needs something moving to follow, or the head to move against the vestibulo-ocular reflex.`,
    `When we fix a point, our eyes are still — They drift, tremble and jump by tiny amounts all the time, and this keeps the retinal image fresh.`,
    `Reading is a smooth sweep along the line — It is a series of saccades of 7 to 9 letters with a fixation of about 0.25 s between them, in which the words are taken in.`
  ],
  terms: [
    { term: 'Saccade', def: `A rapid jump of the eyes from one fixation point to another, with a duration of 20 to 100 ms and a speed of up to several hundred degrees per second.` },
    { term: 'Smooth pursuit', def: `The slow, smooth turning of the eyes that follows a moving target, with the eye's speed close to the target's up to about 30°/s.` },
    { term: 'Fixation', def: `The holding of the gaze on a point for 200 to 300 ms or more, during which the eye still drifts, trembles and makes microsaccades.` },
    { term: 'Microsaccade', also: ['fixational eye movements', 'drift', 'tremor'], def: `A tiny jump of 6 to 30 arc-minutes made once or twice a second during fixation; it comes with a slow drift and a very small tremor.` },
    { term: 'Vestibulo-ocular reflex', also: ['VOR'], def: `The reflex that turns the eyes in the opposite direction to the head, within about 10 ms, to keep the image still on the retina.` },
    { term: 'Saccadic suppression', def: `The loss of sensitivity to vision during a saccade, which stops the smear of the image from being seen.` }
  ],
  formulas: [
    {
      name: 'Duration of a saccade (the main sequence)',
      expr: 'T = 21 + 2.2*A', tex: 'T = 21 + 2.2\\,A',
      vars: {
        T: { name: 'duration', q: false, unit: 'ms' },
        A: { name: 'amplitude of the saccade', q: false, unit: '°', value: 10, min: 0, max: 60 }
      },
      solveFor: 'T',
      note: 'An empirical rule of thumb, in milliseconds and degrees, for saccades from about 1° to 60°.',
      stories: { T: 'A saccade crosses {A} of visual angle. About how long does it take?', A: 'A saccade lasts {T}. About how large is it?' }
    },
    {
      name: 'Average speed of a saccade',
      expr: 'v = 1000*A/T', tex: 'v = \\frac{A}{T}',
      vars: {
        v: { name: 'average speed', q: false, unit: '°/s' },
        A: { name: 'amplitude', q: false, unit: '°', value: 10 },
        T: { name: 'duration', q: false, unit: 'ms', value: 43, min: 1, max: 500 }
      },
      solveFor: 'v',
      note: 'The factor 1000 converts milliseconds to seconds. The peak speed is about 1.9 times the average.'
    },
    {
      name: 'Gain of smooth pursuit',
      expr: 'G = ve/vt', tex: 'G = \\frac{v_e}{v_t}',
      vars: {
        G: { name: 'pursuit gain' },
        ve: { name: 'speed of the eye', q: 'angvel', unit: '°/s', value: 18, tex: 'v_e' },
        vt: { name: 'speed of the target', q: 'angvel', unit: '°/s', value: 20, tex: 'v_t' }
      },
      solveFor: 'G'
    }
  ],
  examples: [
    {
      title: 'A saccade of 10°',
      q: `The eyes jump 10° from one word to another. How long does it take, and how fast do they move on average and at the peak?`,
      steps: [
        `$T = 21 + 2.2 \\times 10 = 43$ ms.`,
        { text: 'The average speed:', tex: 'v = \\frac{10°}{0.043\\ \\mathrm{s}} = 233°/\\mathrm{s}' },
        `With the smooth profile of a real saccade the peak is about 1.9 times that: 436°/s.`
      ],
      a: `43 ms, 233°/s on average, about 440°/s at the peak.`
    },
    {
      title: 'Time spent blind to the world',
      q: `A person scanning a scene makes 3.5 saccades a second of about 5° each. What fraction of the time are the eyes in a saccade, with vision suppressed?`,
      steps: [
        `A 5° saccade takes $21 + 2.2 \\times 5 = 32$ ms.`,
        `In a second the saccades add up to $3.5 \\times 32 = 112$ ms: a little over 11 % of the time.`
      ],
      a: `About 11 %, in short pieces that you never notice.`
    }
  ],
  quiz: [
    { q: 'About how long does a saccade of 10° last?', choices: ['About 43 ms', 'About 4 ms', 'About 400 ms', 'About 4 s'], a: 0, why: `$T = 21 + 2.2 \\times 10 = 43$ ms. Saccades are quick: a 40° jump is still under 110 ms.` },
    { q: 'During a saccade, vision continues as normal, and the blur is simply forgotten.', a: false, why: `Sensitivity is reduced during a saccade (saccadic suppression), so the smeared image is not seen at all.` },
    { q: 'A saccade of 20° lasts 65 ms. What is its average speed, in degrees per second? (Round to the nearest ten.)', answer: 310, unit: '°/s', why: `$v = 20°/0.065\\ \\mathrm{s} = 308°/\\mathrm{s}$.` },
    { q: 'A target moves faster than the eye can follow smoothly. What happens?', choices: ['The eye makes catch-up saccades as well as smooth movement', 'The eye stops', 'The target becomes invisible', 'The pupil closes'], a: 0, why: `Pursuit gain falls for fast targets, so the eye lags and then jumps ahead with a catch-up saccade.` },
    { q: 'Why does a perfectly stabilised image on the retina fade from view?', choices: ['Receptors and nerve cells respond to change, so without any movement the response dies away', 'The image goes out of focus', 'The pupil closes', 'The lens clouds'], a: 0, why: `The visual system signals changes. The tremor, drift and microsaccades of a fixing eye keep making them; when an experiment removes them, the picture fades within seconds.` }
  ],
  applications: [
    `Eye tracking records where people look in reading, driving, sport and interface design, from the position of the pupil or the reflection of light on the cornea.`,
    `Video and film frame rates and display design take saccadic suppression and pursuit into account, since moving images are followed smoothly.`,
    `Clinical tests of eye movements and the vestibulo-ocular reflex help locate problems in the nerves and balance system.`,
    `Reading research shows how text layout, word length and line spacing affect where the eyes land and how long they stay.`
  ],
  history: `Louis Émile Javal observed in 1879 that the eyes do not glide along a line of text but jump from one point to the next. Raymond Dodge showed in 1900 that nothing is seen during the jump. Ditchburn, Riggs and their colleagues showed in the early 1950s that a stabilised image fades, and Alfred Yarbus recorded in 1967 how the pattern of a viewer's fixations on a painting changes with the question asked.`,
  sources: [
    `R. H. S. Carpenter, *Movements of the Eyes* (Pion, 1988) — saccades, pursuit and the reflexes.`,
    `A. T. Bahill, M. R. Clark and L. Stark, "The main sequence, a tool for studying human eye movements", *Mathematical Biosciences* 24 (1975) 191–204.`,
    `S. Martinez-Conde, S. L. Macknik and D. H. Hubel, "The role of fixational eye movements in visual perception", *Nature Reviews Neuroscience* 5 (2004) 229–240.`
  ],
  sim: 'ey-movements'
}

);

Hyper.add(

/* ================================================================ light and dark adaptation */
{
  id: 'light-and-dark-adaptation', parent: 'eye-optics', title: 'Light and dark adaptation', level: 2,
  short: `The eye works over some ten orders of magnitude of light, from a starlit night to sunlit snow. The pupil covers only a tenth of an order of that; the rest is done by the retina, which changes its gain and hands over from cones to rods. Adapting to light takes seconds, adapting to the dark about half an hour.`,
  keywords: ['adaptation', 'dark adaptation', 'light adaptation', 'photopic', 'mesopic', 'scotopic', 'Purkinje shift', 'rods and cones', 'night vision', 'rhodopsin', 'V prime', 'luminosity function', 'red light', 'night blindness'],
  prereq: ['the-retina-rods-and-cones', 'the-pupil', 'the-luminosity-function'],
  related: ['the-fovea-and-visual-acuity', 'photometric-quantities', 'lumens-candelas-lux-and-nits', 'illuminance-levels-in-practice', 'colour-vision-deficiency', 'laser-eye-hazards-and-eyewear', 'night-vision-and-thermal-cameras', 'physics:color-vision', 'ergonomics:lighting-levels'],
  body: `
Step from a bright street into a dark cinema and you see nothing. After ten minutes you can find a seat; after half an hour you can make out faces in the glow of the screen. Meanwhile the eye has become tens of thousands of times more sensitive. That change is **adaptation**.

### How large a range
The light a person meets runs from about $10^{-6}$ cd/m² on a moonless night to $10^{5}$ cd/m² on sunlit snow: ten orders of magnitude. At any one setting the eye copes with only a range of perhaps a hundred to a thousand to one within a scene; adaptation moves that window up and down the scale. The pupil, 2 to 8 mm, adjusts the light by only a factor of ten ([[the-pupil]]).

### Three regimes
| | Luminance (rough) | Receptors | Colour | Acuity |
|---|---|---|---|---|
| Photopic | above about 3 cd/m² | cones | full | 20/20 or better |
| Mesopic | about 0.001 to 3 cd/m² | both | fading | falling |
| Scotopic | below about 0.001 cd/m² | rods | none | roughly 20/100 to 20/200 |

The boundaries depend on how they are defined and on the colour of the light. In the scotopic regime the fovea, which has no rods, is blind to faint things, which is why a faint star disappears when you look straight at it ([[the-retina-rods-and-cones]]).

### The Purkinje shift
Cones and rods have different spectral sensitivity: the daylight curve $V(\\lambda)$ peaks at 555 nm and the night curve $V'(\\lambda)$ near 505 nm. The consequence is that colours change brightness as the light fades:

| Wavelength | 450 nm | 500 nm | 555 nm | 600 nm | 650 nm |
|---|---|---|---|---|---|
| By day, $V$ | 0.04 | 0.32 | 1.00 | 0.63 | 0.11 |
| By night, $V'$ | 0.40 | 0.99 | 0.42 | 0.05 | 0.001 |

At dusk red flowers sink into black before blue ones, and the three patches of the simulation, equally bright by day, separate completely. A deep-red light is almost invisible to rods, so a red torch, a red cockpit lamp or a red observatory light preserves dark adaptation. The unit of light follows the curve: 683 lumens per watt at 555 nm by day, 1700 lumens per watt at 507 nm by night ([[the-luminosity-function]]).

### How the eye adapts
1. **The pupil**: a factor of ten at most.
2. **The receptors' gain**: each receptor lowers its response in bright light and raises it in the dark.
3. **The switch from cones to rods**, and the chemistry of the pigment: rhodopsin, bleached by light, takes tens of minutes to rebuild.
4. **Pooling**: in the dark the retina adds the signals of larger areas, trading detail for sensitivity.

Dark adaptation shows two stages. The cones adapt over the first 5 to 10 minutes and level off; the rods, slower to start, overtake them at the *rod–cone break* after about 7 minutes and continue to gain for 30 to 40 minutes. The dark-adapted eye can respond to a flash of only a hundred or so photons at the cornea, of which perhaps 5 to 14 are absorbed by rods. Adapting to bright light takes a minute at most, after a dazzled moment.

> [!tip] A marked new difficulty seeing in dim light, when others around you see well, is a good reason to have your eyes examined. Looking a little to the side of a faint object (averted vision) uses the rods.

> [!key] Adaptation spans about ten orders of magnitude by the pupil (×10), the receptors' gain and the switch from cones to rods. Dark adaptation takes about 30 minutes; rods shift the peak sensitivity from 555 to about 505 nm, so red goes dark first.
`,
  ideas: [
    `The eye works over about ten orders of magnitude of light; the pupil accounts for only a factor of ten.`,
    `Photopic (cones, above about 3 cd/m²), mesopic and scotopic (rods, below about 0.001 cd/m²) vision differ in colour, acuity and sensitivity.`,
    `The Purkinje shift: the peak moves from 555 nm by day to about 505 nm by night, so red fades before blue.`,
    `Dark adaptation has two stages, cones then rods, with a break at about 7 minutes and a total of about 30 to 40 minutes.`,
    `Red light preserves dark adaptation because rods barely respond to it.`
  ],
  pitfalls: [
    `The pupil does the adapting — It changes the light by a factor of ten. The adaptation to a range of ten million to one is done by the retina.`,
    `Dark adaptation is quick, like the pupil — The pupil opens in seconds, but the retina needs 30 to 40 minutes to reach its best sensitivity, and a short glare can undo much of it.`,
    `At night we see in black and white because it is too dark to see colour — Colour needs cones, which need more light; below the cone threshold only rods work, and they have one pigment, so no colour.`,
    `Red torches help because red light is the dimmest colour — They work because rods are nearly insensitive to deep red, so the dark-adapted rods keep their sensitivity while the cones see the red light well enough to read a map.`
  ],
  terms: [
    { term: 'Dark adaptation', def: `The increase in the eye's sensitivity in the dark, over about 30 to 40 minutes after bright light: first the cones, then, after about 7 minutes, the rods.` },
    { term: 'Photopic, mesopic and scotopic vision', def: `Seeing with cones in daylight (photopic), with both at dusk (mesopic) and with rods in near darkness (scotopic).` },
    { term: 'Purkinje shift', def: `The shift of the eye's peak sensitivity from about 555 nm by day to about 505 nm in the dark, which makes reds darker and blues brighter as the light fades.` },
    { term: 'Scotopic luminosity function', also: ['V′(λ)', 'V prime'], def: `The spectral sensitivity of the rods, with its peak near 505 nm. Its counterpart for the cones, $V(\\lambda)$, peaks at 555 nm.` },
    { term: 'Rod–cone break', def: `The bend in the dark-adaptation curve, after about 7 minutes in the dark, where the more sensitive rods take over from the cones.` },
    { term: 'Averted vision', def: `Looking slightly away from a faint object so that its image falls on the rod-rich retina rather than the rod-free fovea.` }
  ],
  formulas: [
    {
      name: 'Luminous flux of monochromatic light by day',
      expr: 'phi = Km*V*P', tex: '\\Phi_v = K_m\\,V(\\lambda)\\,P',
      vars: {
        phi: { name: 'luminous flux (photopic)', q: 'luminousflux', unit: 'lm', tex: '\\Phi_v' },
        Km: { const: 'Km', tex: 'K_m' },
        V: { name: 'photopic luminous efficiency at the wavelength', value: 0.885, min: 0, max: 1 },
        P: { name: 'optical power', q: 'power', unit: 'mW', value: 5 }
      },
      solveFor: 'phi',
      note: 'V is 0.885 at 532 nm and 0.107 at 650 nm; $K_m$ is 683 lm/W.',
      stories: { phi: 'A laser emits {P} at a wavelength where V = {V}. How many lumens does it give by day?' }
    },
    {
      name: 'Luminous flux of monochromatic light by night',
      expr: 'phis = 1700*Vs*P', tex: '\\Phi_{s} = 1700\\,V_{s}(\\lambda)\\,P',
      vars: {
        phis: { name: 'luminous flux (scotopic)', q: 'luminousflux', unit: 'lm', tex: '\\Phi_{s}' },
        Vs: { name: 'scotopic luminous efficiency at the wavelength', value: 0.757, min: 0, max: 1, tex: 'V_{s}' },
        P: { name: 'optical power', q: 'power', unit: 'mW', value: 5 }
      },
      solveFor: 'phis',
      note: 'The scotopic maximum is 1700 lm/W near 507 nm; the scotopic efficiency is 0.757 at 532 nm and 0.0009 at 650 nm.'
    },
    {
      name: 'Range of light in orders of magnitude',
      expr: 'N = log(Lhi/Llo)', tex: 'N = \\log_{10}\\frac{L_{hi}}{L_{lo}}',
      vars: {
        N: { name: 'number of orders of magnitude' },
        Lhi: { name: 'the brighter luminance', q: 'luminance', unit: 'cd/m²', value: 5000, tex: 'L_{hi}' },
        Llo: { name: 'the dimmer luminance', q: 'luminance', unit: 'cd/m²', value: 0.001, tex: 'L_{lo}' }
      },
      solveFor: 'N',
      note: 'The logarithm is to base 10: 6.7 means a ratio of about five million.'
    }
  ],
  examples: [
    {
      title: 'Two laser pointers, by day and by night',
      q: `A 5 mW green laser (532 nm; $V = 0.885$, $V' = 0.757$) and a 5 mW red one (650 nm; $V = 0.107$, $V' = 0.0009$). Compare their luminous fluxes by day and by night.`,
      steps: [
        { text: 'By day:', tex: '\\Phi_{green} = 683 \\times 0.885 \\times 0.005 = 3.0\\ \\mathrm{lm}\\quad \\Phi_{red} = 683 \\times 0.107 \\times 0.005 = 0.37\\ \\mathrm{lm}' },
        { text: 'By night:', tex: '\\Phi_{s,green} = 1700 \\times 0.757 \\times 0.005 = 6.4\\ \\mathrm{lm}\\quad \\Phi_{s,red} = 1700 \\times 0.0009 \\times 0.005 = 0.008\\ \\mathrm{lm}' }
      ],
      a: `By day the green one is 8 times as bright as the red; by night it is about 800 times as bright. The same power looks very different to the cones and the rods.`
    },
    {
      title: 'How big is the range?',
      q: `A clear blue sky has a luminance of 5000 cd/m² and the night sky 0.001 cd/m². How many orders of magnitude apart are they?`,
      steps: [
        { text: 'Take the logarithm of the ratio:', tex: 'N = \\log_{10}\\frac{5000}{0.001} = \\log_{10}(5 \\times 10^{6}) = 6.7' }
      ],
      a: `6.7 orders of magnitude, a ratio of 5 million. The pupil covers only the last factor of ten of it.`
    }
  ],
  quiz: [
    { q: 'At dusk, which of these flowers fades to dark first?', choices: ['A red one', 'A blue one', 'A green one', 'All fade equally'], a: 0, why: `The rods are most sensitive near 505 nm and barely respond to red ($V'(650\\ \\mathrm{nm}) \\approx 0.001$), so red things sink into darkness before blue ones.` },
    { q: 'Dark adaptation is finished within two minutes.', a: false, why: `The cones adapt in 5 to 10 minutes; the rods continue to gain sensitivity for 30 to 40 minutes.` },
    { q: 'A bright sky of 5000 cd/m² and a dim scene of 0.5 cd/m² differ by how many orders of magnitude?', answer: 4, why: `$\\log_{10}(5000/0.5) = \\log_{10} 10^4 = 4$.` },
    { q: 'Why does a red torch protect dark adaptation?', choices: ['Rods are almost insensitive to deep red, so they are not bleached', 'Red light is weaker than other colours', 'It closes the pupil', 'Cones are faster in red'], a: 0, why: `Rhodopsin absorbs red poorly. The torch lights the cones enough to read while the rods stay unbleached.` },
    { q: 'What is the usual effect on colour when the light falls to the scotopic range?', choices: ['Colour disappears: only rods work and they have one pigment', 'Colours become more saturated', 'Only blue is lost', 'Nothing changes'], a: 0, why: `With one pigment the rod cannot tell wavelength from intensity, so the world is in shades of grey.` }
  ],
  applications: [
    `Red lighting in observatories, aircraft cockpits, submarines and on night walks keeps the observers' eyes dark-adapted.`,
    `Tunnel and road lighting is graded so that the driver's eyes do not have to adapt in a few seconds to a much darker interior; the entrance zone is lit more strongly.`,
    `Display design: "night mode" settings reduce the luminance and shift to warmer colours so as not to blind a dark-adapted viewer.`,
    `Photometry: the same lamp has two different values in lumens, photopic and scotopic, and lighting for streets and roads is considered in the mesopic range between them.`
  ],
  history: `Jan Evangelista Purkyně noticed in the 1820s that red flowers lose their brightness before blue ones at dusk, an effect now named after him. Selig Hecht and his colleagues, in the 1930s and 1940s, measured the curve of dark adaptation and showed that the dark-adapted eye can respond to a flash of only a few photons absorbed in the rods.`,
  sources: [
    `S. Hecht, S. Shlaer and M. H. Pirenne, "Energy, quanta, and vision", *Journal of General Physiology* 25 (1942) 819–840 — the absolute threshold of the dark-adapted eye.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — light and dark adaptation, and the rod and cone systems.`,
    `G. Wyszecki and W. S. Stiles, *Color Science* (Wiley, 2nd ed., 1982) — the photopic and scotopic luminous efficiency functions.`
  ],
  sim: 'ey-adaptation'
},

/* ================================================================ flicker and persistence of vision */
{
  id: 'flicker-and-persistence-of-vision', parent: 'eye-optics', title: 'Flicker and persistence of vision', level: 2,
  short: `A light that flashes faster than the critical flicker frequency, from about 15 Hz in dim light to 60–90 Hz when bright, looks steady. Film, television and lamps depend on that. Apparent motion between separate pictures is a different effect, and "persistence of vision" does not explain it.`,
  keywords: ['flicker', 'critical flicker frequency', 'CFF', 'flicker fusion', 'persistence of vision', 'Ferry-Porter law', 'phi phenomenon', 'apparent motion', 'frame rate', 'refresh rate', 'PWM', 'stroboscopic effect', 'film', '24 frames per second'],
  prereq: ['the-retina-rods-and-cones', 'light-and-dark-adaptation', 'the-visual-field'],
  related: ['stroboscopic-effects', 'drivers-dimming-and-flicker', 'eye-movements', 'motion-illusions', 'flash-and-strobe', 'rolling-and-global-shutter', 'flat-panel-displays', 'ergonomics:visual-ergonomics'],
  body: `
Flick a light on and off slowly and each flash is seen. Speed up and at some rate the flashing blends into steady light. That rate is the **critical flicker frequency** (CFF), and the eye's temporal blur behind it is what makes film, television and fluorescent lamps look steady.

### Why it fuses
The retina and the brain add up light over some tens of milliseconds, so a rapid train of flashes is seen as its average. The simulation represents the eye as a simple smoothing filter: the faster the flashes, the smaller the ripple that survives. The flicker is noticed when the ripple that is left exceeds a threshold, and that threshold is lowest at about 8 to 10 Hz, as the **temporal** equivalent of the contrast sensitivity curve ([[contrast-sensitivity]]).

### How fast is fast enough
- **It rises with brightness**: roughly 10 Hz for each factor of ten in luminance (the Ferry–Porter law), from about 15 Hz in dim light to 60 Hz and more in bright light.
- **It depends on where the light falls**: for a small light the centre of the retina has the higher limit, but for a large bright field the periphery does, up to about 90 Hz. That is why a 60 Hz screen may shimmer out of the corner of the eye and not when looked at.
- **It depends on the waveform**: a deeper modulation and a larger area flicker at higher rates.

| Source | Flash rate |
|---|---|
| Film, each frame shown once | 24 Hz (visibly flickering when bright) |
| Film projector, 2-blade, 3-blade shutter | 48 Hz, 72 Hz |
| A lamp on 50 Hz or 60 Hz mains | 100 Hz or 120 Hz |
| Computer display refresh | 60 to 144 Hz |
| LED dimmed by pulse-width modulation | from a few hundred Hz upward |

### Persistence of vision is not apparent motion
The popular account says that film shows motion because the image lingers on the retina. That is not what happens. Two separate effects are at work. *Flicker fusion* hides the dark intervals between frames. *Apparent motion* (the phi phenomenon, described by Wertheimer in 1912) makes the brain see a single object moving when it is shown in two nearby places in quick succession: it starts at about 10 steps per second, and 24 per second is smooth for most film. A projector flashes each 24 fps frame two or three times: the frame rate is chosen for motion, the flash rate for flicker.

### When the fusion fails
- A fast-moving object, or a moving eye, under a flashing light shows a row of separate images, the *stroboscopic* or phantom-array effect ([[stroboscopic-effects]]).
- Poorly driven LED lamps and dimmed displays can flicker at a rate that some people notice in the periphery or in a saccade ([[drivers-dimming-and-flicker]]), and a few find uncomfortable.

> [!warn] Flashing lights between about 3 and 30 Hz, and most of all at 15 to 25 Hz, can provoke seizures in a small number of people with photosensitive epilepsy. If you or someone near you is photosensitive, avoid strong flashing displays and take medical advice.

> [!key] Flashes fuse above the critical flicker frequency, about 10 Hz higher for each factor of ten in brightness (15 to 90 Hz in all). Film works by two separate effects: fusion hides the dark gaps, and apparent motion joins the steps.
`,
  ideas: [
    `Flashes fuse into steady light above the critical flicker frequency, which is about 15 Hz in dim light and 60 to 90 Hz when bright.`,
    `The limit rises by about 10 Hz for every factor of ten in brightness and is higher in the periphery for a large bright field.`,
    `Film at 24 frames per second is flashed two or three times a frame (48 or 72 Hz) so that it does not flicker.`,
    `Apparent motion (the phi phenomenon) is a separate effect from flicker fusion, and persistence of vision does not explain it.`,
    `Lamps on mains flicker at 100 or 120 Hz and LEDs dimmed by pulses at much higher rates; some people notice what the fusion misses.`
  ],
  pitfalls: [
    `Film looks like motion because the image persists on the retina — Persistence only hides the dark gaps between frames. The sense of movement comes from the brain linking successive positions (the phi phenomenon), which happens even with long gaps between flashes.`,
    `If you cannot see the flicker, the light is steady for the eye — The fusion is not complete for the visual system: a rapidly moving eye or object can show a flash train, and some people find fast flicker uncomfortable.`,
    `The flicker limit is the same everywhere in the field and for every light — It rises with brightness and with the size of the flashing area, and is higher in the periphery than at the centre for a large bright field.`,
    `24 frames per second is the rate at which the eye stops seeing flicker — At 24 flashes per second a bright film flickers plainly; the rate is chosen for motion, and the flash rate is raised by repeating each frame.`
  ],
  terms: [
    { term: 'Critical flicker frequency', also: ['CFF', 'flicker fusion frequency'], def: `The rate of flashes above which a flashing light looks steady. It is about 15 Hz in dim light and 60 to 90 Hz in bright light.` },
    { term: 'Ferry–Porter law', def: `The finding that the critical flicker frequency rises in proportion to the logarithm of the brightness: about 10 Hz for each factor of ten.` },
    { term: 'Persistence of vision', def: `The idea that an image lingers briefly in the eye. It explains why flashes fuse, but not why still pictures shown in succession look like motion.` },
    { term: 'Phi phenomenon', also: ['apparent motion', 'beta movement'], def: `The illusion of motion produced by showing a light in two nearby places in quick succession. It is the basis of film and animation.` },
    { term: 'Frame rate and refresh rate', def: `The number of different pictures shown per second (frame rate, 24 for film) and the number of times per second a display redraws the screen (refresh rate, 60 Hz or more).` },
    { term: 'Pulse-width modulation', also: ['PWM'], def: `Dimming a light by switching it fully on and off rapidly and varying the share of time that it is on. The switching frequency must be well above the flicker limit.` }
  ],
  formulas: [
    {
      name: 'Flash rate of a film projector',
      expr: 'f = fps*n', tex: 'f = n \\times \\mathrm{fps}',
      vars: {
        f: { name: 'flash rate', q: 'frequency', unit: 'Hz' },
        fps: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 24, tex: '\\mathrm{fps}' },
        n: { name: 'number of times each frame is flashed', value: 3, int: true, min: 1, max: 6 }
      },
      solveFor: 'f',
      stories: { f: 'A film at {fps} is flashed {n} times per frame. What is the flash rate?', n: 'A film of {fps} flashes at {f}. How many times is each frame flashed?' }
    },
    {
      name: 'Period of the flashes',
      expr: 'T = 1/f', tex: 'T = \\frac{1}{f}',
      vars: {
        T: { name: 'period', q: 'time', unit: 'ms' },
        f: { name: 'flash rate', q: 'frequency', unit: 'Hz', value: 100 }
      },
      solveFor: 'T'
    },
    {
      name: 'Critical flicker frequency against brightness (rough rule)',
      expr: 'CFF = 45 + 10*log(L/100)', tex: '\\mathrm{CFF} \\approx 45 + 10\\log_{10}\\frac{L}{100}',
      vars: {
        CFF: { name: 'critical flicker frequency', q: false, unit: 'Hz', tex: '\\mathrm{CFF}' },
        L: { name: 'luminance of the flashing light', q: 'luminance', unit: 'cd/m²', value: 100 }
      },
      solveFor: 'CFF',
      note: 'The Ferry–Porter law with typical constants for the centre of the retina: a rough guide in Hz, not a measurement of any person. Larger fields and the periphery give higher values.'
    },
    {
      name: 'Step of a moving object between frames',
      expr: 'step = v/fps', tex: '\\mathrm{step} = \\frac{v}{\\mathrm{fps}}',
      vars: {
        step: { name: 'distance moved between two frames', q: 'length', unit: 'cm', tex: '\\mathrm{step}' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1 },
        fps: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 24, tex: '\\mathrm{fps}' }
      },
      solveFor: 'step'
    }
  ],
  examples: [
    {
      title: 'A three-blade projector',
      q: `A film runs at 24 frames per second and each frame is flashed three times. What is the flash rate, and what flicker limit does it have to beat for a screen of 40 cd/m² (centre of the retina)?`,
      steps: [
        `The flash rate is $3 \\times 24 = 72$ Hz.`,
        { text: 'The rough limit for the centre of the retina:', tex: '\\mathrm{CFF} = 45 + 10\\log_{10}\\frac{40}{100} = 41\\ \\mathrm{Hz}' },
        `At 24 Hz the film would flicker; at 48 Hz (two blades) it clears 41 Hz narrowly; 72 Hz has a good margin.`
      ],
      a: `72 Hz against a limit of about 41 Hz for the centre of the retina, which is why three blades are used for brighter screens or for a viewer sensitive to peripheral flicker.`
    },
    {
      title: 'Steps of a moving ball',
      q: `A ball crosses a screen at 1 m/s. How far does it move between frames at 12, 24 and 60 frames per second?`,
      steps: [
        { text: 'The step is speed over frame rate:', tex: '\\mathrm{step} = \\frac{100\\ \\mathrm{cm/s}}{\\mathrm{fps}} = 8.3\\ \\mathrm{cm},\\ 4.2\\ \\mathrm{cm},\\ 1.7\\ \\mathrm{cm}' }
      ],
      a: `8.3 cm, 4.2 cm and 1.7 cm. Larger steps are seen as jerks; short ones fuse into motion.`
    }
  ],
  quiz: [
    { q: 'A projector shows 24 frames per second and flashes each frame twice. What is the flash rate?', choices: ['48 Hz', '24 Hz', '12 Hz', '96 Hz'], a: 0, why: `$2 \\times 24 = 48$ Hz. The frame rate fixes the motion, the flash rate the flicker.` },
    { q: 'Persistence of vision is the reason why a series of still pictures looks like movement.', a: false, why: `Persistence explains why flashes fuse. Movement is seen because the brain links successive positions of an object (the phi phenomenon), which also works with long gaps between pictures.` },
    { q: 'By the rough Ferry–Porter rule, how many Hz higher is the flicker limit for a light 10 times brighter?', answer: 10, unit: 'Hz', why: `The critical flicker frequency rises by about 10 Hz per factor of ten of luminance.` },
    { q: 'A 60 Hz screen seems to flicker at the edge of the eye but not at the centre. Why?', choices: ['For a large bright field the peripheral retina has a higher fusion limit', 'The periphery is blind to light', 'The lens refocuses', 'The pupil is larger at the edge'], a: 0, why: `The flicker limit is higher in the periphery for large bright stimuli, so a rate that fuses at the centre can still be seen out of the corner of the eye.` },
    { q: 'A lamp on 50 Hz mains flickers at...', choices: ['100 Hz', '50 Hz', '25 Hz', '200 Hz'], a: 0, why: `The light follows the power, which peaks twice per cycle of the voltage: 100 Hz for 50 Hz mains and 120 Hz for 60 Hz mains.` }
  ],
  applications: [
    `Film, television and video choose their frame and refresh rates from this: 24 fps with 48 or 72 Hz flashing, 50 and 60 Hz for broadcast, 120 Hz and above for fast screens.`,
    `Lighting design chooses drivers and dimming methods whose flicker is far above the visible limit, and asks for low flicker where people sit under a lamp for hours.`,
    `Displays and virtual-reality headsets, used close to the eye and over a wide field, need rates of 90 Hz or more, partly because of the flicker limit of the periphery.`,
    `Safety standards for flashing content on screens and in broadcasting limit the rate and area of flashes to protect photosensitive viewers.`
  ],
  history: `Peter Mark Roget described in 1824 the illusion of spokes of a wheel seen through slits, and "persistence of vision" became the standard explanation of the moving picture. Ferry in 1892 and Porter in 1902 found that the flicker limit rises with the logarithm of the brightness. Max Wertheimer's experiments of 1912 on the phi phenomenon showed that apparent motion is a separate process.`,
  sources: [
    `S. Hecht and E. L. Verrijp, "Intermittent stimulation by light, III. The relation between intensity and critical fusion frequency for different retinal locations", *Journal of General Physiology* 17 (1933) 251–265.`,
    `J. Anderson and B. Anderson, "The myth of persistence of vision revisited", *Journal of Film and Video* 45 (1993) 3–12.`,
    `B. A. Wandell, *Foundations of Vision* (Sinauer, 1995) — temporal vision.`
  ],
  sim: 'ey-flicker'
},

/* ================================================================ aberrations of the eye */
{
  id: 'aberrations-of-the-eye', parent: 'eye-optics', title: 'Aberrations of the eye', level: 3,
  short: `The eye's own optics are far from perfect: about 2 D of chromatic aberration across the spectrum, spherical aberration that grows steeply with the pupil, oblique astigmatism away from the axis and irregular higher-order errors that differ from person to person. The receptor mosaic and the brain hide most of it.`,
  keywords: ['aberrations of the eye', 'chromatic aberration', 'spherical aberration', 'higher-order aberrations', 'wavefront', 'Zernike', 'aberrometer', 'night myopia', 'chromostereopsis', 'adaptive optics', 'Strehl ratio', 'ocular aberrations'],
  prereq: ['what-aberrations-are', 'spherical-aberration', 'axial-chromatic-aberration', 'the-pupil'],
  related: ['autorefractors-and-aberrometers', 'wavefront-error-and-zernike-polynomials', 'cross-cylinder-and-duochrome', 'astigmatism-of-the-eye', 'intraocular-lenses-and-refractive-surgery', 'astronomical-observatories-and-adaptive-optics', 'the-point-spread-function', 'physics:the-eye'],
  body: `
The eye is a remarkable but optically modest instrument: a cornea with a curved front surface and a lens of varying index, working in water. Traced ray by ray, as in the simulation, a point of light comes to a small smear on the retina, not to a point. The smear is smaller than the retina can resolve in daylight at the centre, so most of it goes unnoticed.

### Defocus and astigmatism
The largest errors are the simplest, a wrong focus and a different focus in two directions: the "low-order" errors that spectacles correct ([[myopia]], [[hyperopia]], [[astigmatism-of-the-eye]]). Together they make up the greater part of the eye's wavefront error. What remains is what this page is about.

### Chromatic aberration
The media of the eye bend blue light more than red, so the power of the eye changes with wavelength. In the traced model it goes from 59.4 D at 700 nm to 62.0 D at 400 nm, 2.6 D; measurements give about 2 D. A published fit to the measurements (Thibos and colleagues) is $R = 1.68524 - 633.46/(\\lambda - 214.10)$ dioptres:

| Wavelength | 400 nm | 450 | 500 | 550 | 590 | 650 | 700 |
|---|---|---|---|---|---|---|---|
| Focus error (D) | −1.7 | −1.0 | −0.5 | −0.2 | 0 | +0.2 | +0.4 |

The eye is at best focus near 590 nm; blue light comes to a focus in front of the retina and red behind it. A focus error of 1 D with a 4 mm pupil is a blur of 14 arc-minutes. It is not noticed because the S cones are few (5–10 %) and absent from the central foveola, blue light adds little to the sensation of brightness (0.04 at 450 nm against 1.0 at 555), and the lens and macula absorb blue. The effect is still there: red text on blue looks to many people at different depths (chromostereopsis), and the duochrome test of the eye examination uses the difference between red and green light ([[cross-cylinder-and-duochrome]]).

### Spherical aberration
Rays through the edge of the pupil are bent more than rays through its centre, so they focus nearer. In the traced eye the edge of the pupil gains extra power as the pupil opens:

| Pupil (mm) | 3 | 4 | 5 | 6 | 8 |
|---|---|---|---|---|---|
| Extra power at the edge (D) | 0.29 | 0.53 | 0.86 | 1.3 | 2.6 |
| Blur at the best focus, arc-minutes | 0.85 | 2.1 | 4.3 | 7.9 | 21 |

The cornea has positive spherical aberration; in a young eye the lens has a negative one that partly cancels it, and with age the balance is lost. Large pupils make it worse, so a dim-light shift of the best focus towards short sight (night myopia) and halos round lights are partly aberration. Real eyes have less than this model: of the order of a tenth of a micrometre of wavefront error at 6 mm, varying widely between people.

### Higher orders, and away from the axis
Coma, trefoil and other irregular errors, described by Zernike polynomials ([[wavefront-error-and-zernike-polynomials]]) and measured with aberrometers ([[autorefractors-and-aberrometers]]), add to a few tenths of a micrometre at 6 mm. They differ from eye to eye like a fingerprint and change with the blink, with accommodation and with age. Off the axis, oblique astigmatism and field curvature spoil the image; the curved retina helps.

> [!key] The eye has about 2 D of chromatic aberration and spherical aberration that grows steeply with the pupil: 0.3 D at the edge of a 3 mm pupil, 1.3 D at 6 mm, plus irregular higher orders. The sharpest vision is therefore through a small pupil, near 3 mm, in the middle of the spectrum.
`,
  ideas: [
    `The eye's chromatic aberration is about 2 D from 400 to 700 nm: blue focuses in front of the retina, red behind it.`,
    `It goes largely unnoticed because blue adds little to brightness and the S cones are few and absent from the centre.`,
    `Spherical aberration grows steeply with the pupil: the edge gains 0.3 D at 3 mm and 1.3 D at 6 mm in the model.`,
    `The cornea's positive spherical aberration is partly cancelled by the lens in the young; the balance is lost with age.`,
    `Higher-order aberrations, measured by aberrometers and described by Zernike polynomials, differ from person to person.`
  ],
  pitfalls: [
    `The eye is an excellent lens — It is an excellent *system*: modest optics, a small and well-placed mosaic and a brain that fills in the rest. A camera lens of its quality would be sold as a poor one.`,
    `The aberrations of the eye are the same as the need for spectacles — Glasses correct defocus and astigmatism, the biggest errors. Spherical aberration, coma and the others remain.`,
    `A larger pupil always makes vision sharper — Beyond about 3 mm the spherical aberration, which grows as the cube of the pupil, outweighs the gain in diffraction.`,
    `Colour fringes would be visible if the eye's chromatic aberration were as big as it is — The aberration is large, but the receptors that see blue are few, the macular pigment absorbs blue, and the brain attends to the middle of the spectrum.`
  ],
  terms: [
    { term: 'Longitudinal chromatic aberration', also: ['LCA', 'axial colour'], def: `The change of focus of the eye with wavelength, about 2 D from 400 to 700 nm: blue is focused in front of the retina and red behind it.` },
    { term: 'Spherical aberration of the eye', def: `The difference of focus between rays through the centre and the edge of the pupil. It grows roughly as the cube of the pupil diameter.` },
    { term: 'Higher-order aberrations', also: ['HOA', 'coma', 'trefoil'], def: `Wavefront errors other than defocus and astigmatism, such as coma, trefoil and spherical aberration. They are irregular and differ from eye to eye.` },
    { term: 'Zernike polynomials', def: `A set of mathematical functions in which the wavefront error of an eye is written as a sum of terms such as defocus, astigmatism, coma and spherical aberration.` },
    { term: 'Night myopia', def: `A shift of the eye's best focus towards short sight in dim light, caused partly by spherical aberration with the larger pupil, by the shift of sensitivity to bluer light and by the eye's resting focus.` },
    { term: 'Chromostereopsis', def: `The effect that red and blue areas of the same distance seem to lie at different depths, owing to the chromatic aberration of the eye.` }
  ],
  formulas: [
    {
      name: 'Chromatic focus error of the eye (a fit to measurements)',
      expr: 'R = 1.68524 - 633.46/(lam - 214.10)', tex: 'R = 1.68524 - \\frac{633.46}{\\lambda - 214.10}',
      vars: {
        R: { name: 'focus error of the eye relative to a point near 590 nm', q: false, unit: 'D', signed: true },
        lam: { name: 'wavelength', q: false, unit: 'nm', value: 450, min: 380, max: 780, tex: '\\lambda' }
      },
      solveFor: 'R',
      note: 'The reduced chromatic eye of Thibos and colleagues (1992): zero at 590 nm, about −1.7 D at 400 nm and +0.4 D at 700 nm.'
    },
    {
      name: 'Blur circle from a focus error',
      expr: 'beta = dD*p', tex: '\\beta = \\Delta D\\cdot p',
      vars: {
        beta: { name: 'angular diameter of the blur circle', q: 'angle', unit: '′', tex: '\\beta' },
        dD: { name: 'focus error', q: 'optpower', unit: 'D', value: 1, tex: '\\Delta D' },
        p: { name: 'pupil diameter', q: 'length', unit: 'mm', value: 4 }
      },
      solveFor: 'beta',
      note: 'Geometrical optics: a point out of focus by ΔD spreads over an angle equal to ΔD times the pupil diameter.',
      stories: { beta: 'The eye is out of focus for a colour by {dD}, with a pupil of {p}. How wide is the blur circle, in angle?' }
    }
  ],
  examples: [
    {
      title: 'How blurred is the blue?',
      q: `The eye is focused on 590 nm light. By how much is it out of focus for 450 nm light, and how large is the blur circle with a 4 mm pupil?`,
      steps: [
        { text: 'The fit gives', tex: 'R = 1.68524 - \\frac{633.46}{450 - 214.10} = -1.0\\ \\mathrm{D}' },
        { text: 'The blur circle is', tex: '\\beta = \\Delta D \\cdot p = 1.0\\ \\mathrm{D} \\times 4\\ \\mathrm{mm} = 4 \\times 10^{-3}\\ \\mathrm{rad} = 13.8′' }
      ],
      a: `Out of focus by 1 D, with a blur of 14 arc-minutes, much larger than the 1′ stroke of a 6/6 letter. The reason that blue light does not ruin acuity is that it contributes little to the brightness signal.`
    },
    {
      title: 'A large pupil against a small one',
      q: `In the traced eye, a 6 mm pupil gives a blur of 7.9′ at the best focus and a 3 mm pupil 0.85′. How many times larger is the first, and how does that compare with the ratio of the diameters cubed?`,
      steps: [
        `The ratio of the blurs is $7.9/0.85 = 9.3$.`,
        `The ratio of the diameters is 2, and $2^3 = 8$.`
      ],
      a: `A factor of 9.3, close to the factor of 8 predicted by the cube of the diameter, as expected for third-order spherical aberration.`
    }
  ],
  quiz: [
    { q: 'In an eye focused on yellow light, where does blue light come to a focus?', choices: ['In front of the retina', 'Behind the retina', 'On the retina', 'Nowhere: blue is not refracted'], a: 0, why: `Blue is bent more strongly than red by the media of the eye, so its focus lies closer to the lens. Red focuses behind the retina.` },
    { q: 'Spherical aberration of the eye grows as the pupil opens.', a: true, why: `Rays at the edge of a large pupil are bent too strongly. The blur grows roughly as the cube of the pupil diameter, which is why vision is sharpest through a small pupil of about 3 mm.` },
    { q: 'What is the angular diameter, in arc-minutes, of the blur circle for a focus error of 1 D with a pupil of 4 mm?', answer: 13.8, unit: '′', why: `$\\beta = \\Delta D \\times p = 1 \\times 0.004 = 0.004$ rad $= 13.8′$.` },
    { q: 'Why is the eye\'s chromatic aberration hardly noticed?', choices: ['Few receptors see blue, blue adds little to brightness, and the brain emphasises the middle of the spectrum', 'The lens has no chromatic aberration', 'The pupil removes it', 'The retina is curved'], a: 0, why: `The aberration is large (about 2 D), but the S cones are 5–10 % of the cones and absent from the foveola, and the visual system builds acuity mainly from the middle of the spectrum.` },
    { q: 'What do aberrometers measure?', choices: ['The wavefront error of the eye, including its higher-order terms', 'The pressure in the eye', 'The thickness of the retina', 'The field of vision'], a: 0, why: `An aberrometer measures how the wavefront from a point on the retina departs from a perfect sphere after crossing the eye, usually written in Zernike terms.` }
  ],
  applications: [
    `Aspheric intraocular lenses are designed to cancel the cornea's spherical aberration, and customised ("wavefront-guided") laser treatments aim to reduce the eye's aberrations.`,
    `Adaptive-optics ophthalmoscopes cancel the eye's aberrations in real time and show individual cones in a living eye.`,
    `The duochrome test uses the chromatic aberration of the eye to fine-tune a spectacle prescription.`,
    `Displays and symbols for night use take account of night myopia and halos: large pupils and dim light make glare and blur worse.`
  ],
  history: `Thomas Young found in 1801 that his own eye was astigmatic, the first measurement of an aberration of the eye. Wald and Griffin measured in 1947 how the focus of the human eye changes with wavelength, and Thibos and colleagues published their reduced chromatic eye in 1992. Liang, Grimm, Goelz and Bille measured the wave aberration of the living eye with a Hartmann–Shack sensor in 1994, and Liang and Williams used adaptive optics in 1997 to correct it and image the retina.`,
  sources: [
    `L. N. Thibos, M. Ye, X. Zhang and A. Bradley, "The chromatic eye: a new reduced-eye model of ocular chromatic aberration in humans", *Applied Optics* 31 (1992) 3594–3600.`,
    `L. N. Thibos, R. A. Applegate, J. T. Schwiegerling, R. Webb and VSIA Standards Taskforce Members, "Standards for reporting the optical aberrations of eyes", *Journal of Refractive Surgery* 18 (2002) S652–S660.`,
    `G. Wald and D. R. Griffin, "The change in refractive power of the human eye in dim and bright light", *Journal of the Optical Society of America* 37 (1947) 321–336.`,
    `D. A. Atchison and G. Smith, *Optics of the Human Eye* (Butterworth-Heinemann, 2000).`
  ],
  sim: 'ey-aberrations'
}

);
