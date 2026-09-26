/* HYPER-PHYSICS · content/vision-color.js — the eye, its defects and their correction,
 * colour vision, colour mixing and the brightness of light.
 * Lens signs follow the geometric-optics convention: real is positive, f > 0 converging. */
Hyper.add(

{
  id: 'the-eye', parent: 'vision-color', title: 'The eye', level: 1,
  short: 'The eye is a living camera: the cornea and lens focus an image on the retina, the iris sets the aperture, and the lens changes shape to focus near or far.',
  keywords: ['eye', 'cornea', 'crystalline lens', 'retina', 'pupil', 'iris', 'accommodation', 'near point', 'far point', 'rods', 'cones', 'fovea', 'blind spot', 'optic nerve', 'dioptre'],
  prereq: ['thin-lenses', 'refraction'],
  related: ['vision-correction', 'color-vision', 'resolution', 'magnification'],
  body: `
Light entering the eye passes through the clear **cornea**, the watery aqueous humour, the **pupil** (the hole in the coloured **iris**), the **crystalline lens** and the jelly-like vitreous humour, and lands on the **retina**, about 24 mm behind the front of the eye. There the image is turned into nerve signals and sent to the brain along the optic nerve. Like a camera's, the image is real, inverted and much smaller than the scene; the brain makes sense of it the right way up.

### Who does the focusing?
Refraction is strongest where the refractive index jumps most. Going from air ($n = 1.00$) into the cornea ($n = 1.376$) is by far the biggest jump, so the curved cornea provides about **two-thirds** of the eye's power — roughly 43 dioptres. The lens ($n \\approx 1.39$–$1.41$) sits between fluids of index 1.336 and adds about 20 D. Together the eye has a power of about **60 D**. That is why you see blurred under water: against water ($n = 1.33$) the cornea loses almost all its power ([[lensmakers-equation|see the lensmaker's equation]]).

### Accommodation
A camera focuses by moving its lens; the human eye changes the **shape** of its lens. For distant objects the ring-shaped ciliary muscle relaxes, the lens is pulled flat and the eye is at its weakest. To look at something close, the muscle contracts, the lens bulges and the power rises. In a simple model with the retina 1.7 cm behind a single [[thin-lenses|thin lens]] in air:

$$P = \\frac{1}{d_o} + \\frac{1}{d_i}$$

Looking far away ($d_o \\to \\infty$) needs $P = 1/0.017 = 58.8$ D; reading at 25 cm needs $4$ D more. The extra power the lens can add is the **amplitude of accommodation**. It falls steadily with age — about 14 D at ten, 10 D at twenty, 4 D by the mid-forties and 1 D at sixty — so the **near point**, the closest distance you can focus, recedes from 7 cm to 25 cm to a metre. The **far point** of a normal eye is at infinity. The conventional near point used in optics is 25 cm.

### The retina
About 120 million **rods** handle dim light but see no colour; about 6 million **cones** work in daylight and come in three kinds that give [[color-vision|colour vision]]. The cones crowd into the **fovea**, a spot about 1.5 mm across in line with where you look, and that is the only place you see sharply. Where the optic nerve leaves there are no receptors at all: the **blind spot**, about 15° to the side of where you are looking, which the brain quietly fills in.

### Aperture and sharpness
The pupil opens from about 2 mm in bright light to 8 mm in the dark — only a 16-fold change in area. Most of the eye's enormous range, from starlight to sunshine, comes from chemistry in the retina. A 3 mm pupil has a [[resolution|diffraction limit]] of about 0.8 arcminutes, and foveal cones are about half an arcminute apart, so a healthy eye resolves about **1 arcminute** — a 1.5 mm gap at 5 m.

> [!tip] Find your blind spot: close your left eye, look at a small mark on a page with your right eye, and move a second mark sideways along the page about 8 cm to the right. At a certain point it vanishes.
`,
  ideas: [
    'The cornea does about two-thirds of the focusing; the lens supplies the adjustable part.',
    'The eye focuses by changing the shape of its lens (accommodation), not by moving it.',
    'The image on the retina is real and inverted; the total power of the eye is about 60 dioptres.',
    'Accommodation weakens with age, pushing the near point farther away.',
    'Sharp and colour vision come from the cone-rich fovea; rods serve dim light.'
  ],
  pitfalls: [
    'The lens does most of the focusing — The cornea does about two-thirds, because the jump from air to cornea is the largest change of refractive index in the eye.',
    'The eye focuses like a camera, by moving the lens — The human eye changes the lens\'s shape; fish and cameras move the lens instead.',
    'The pupil is what lets us see in both sunshine and starlight — It changes the light by only about 16 times; the retina adapts over a range of about a billion.'
  ],
  formulas: [
    {
      name: 'Power of the eye (simple model)',
      expr: 'P = 1/d_o + 1/d_i', tex: 'P = \\frac{1}{d_o} + \\frac{1}{d_i}', solveFor: 'P',
      vars: {
        P: { name: 'power of the eye', q: 'optpower', unit: 'D' },
        d_o: { name: 'distance of the object', q: 'length', unit: 'cm', value: 25, tex: 'd_o' },
        d_i: { name: 'distance from lens to retina', q: 'length', unit: 'cm', value: 1.7, tex: 'd_i' }
      },
      note: 'Treats the eye as one thin lens in air with the retina 1.7 cm behind it; real eyes are more complicated but the changes of power come out right.',
      stories: { P: 'What power must an eye (lens-to-retina distance {d_i}) have to focus on an object {d_o} away?', d_o: 'An eye with lens-to-retina distance {d_i} has a power of {P}. At what distance is it focused?' }
    },
    {
      name: 'Amplitude of accommodation (far point at infinity)',
      expr: 'A = 1/d_n', tex: 'A = \\frac{1}{d_n}',
      vars: {
        A: { name: 'amplitude of accommodation', q: 'optpower', unit: 'D' },
        d_n: { name: 'near point', q: 'length', unit: 'cm', value: 25, tex: 'd_n' }
      },
      note: 'The extra power the eye can add between looking at infinity and looking at its near point.',
      stories: { A: 'A person\'s near point is {d_n} and their distance vision is normal. What is their amplitude of accommodation?', d_n: 'Someone can add {A} of power by accommodation. How close can they focus?' }
    },
    {
      name: 'Size of the image on the retina',
      expr: 'h_i = h_o*d_i/d_o', tex: 'h_i = h_o\\,\\frac{d_i}{d_o}',
      vars: {
        h_i: { name: 'image height on the retina', q: 'length', unit: 'mm', tex: 'h_i' },
        h_o: { name: 'object height', q: 'length', unit: 'm', value: 15, tex: 'h_o' },
        d_i: { name: 'distance from lens to retina', q: 'length', unit: 'cm', value: 1.7, tex: 'd_i' },
        d_o: { name: 'distance of the object', q: 'length', unit: 'm', value: 60, tex: 'd_o' }
      },
      note: 'The size only; the image is inverted.',
      stories: { h_i: 'How tall is the image on your retina of a {h_o} tree {d_o} away (lens-to-retina distance {d_i})?' }
    }
  ],
  examples: [
    {
      title: 'How much does the lens change?',
      q: 'Using the simple model (retina 1.7 cm behind the lens), what power does the eye need for a distant mountain and for a book at 25 cm?',
      steps: [
        'Distant object: $1/d_o \\to 0$, so $P = 1/0.017\\ \\mathrm{m} = 58.8\\ \\mathrm{D}$.',
        'Book: $P = 1/0.25 + 1/0.017 = 4.0 + 58.8 = 62.8\\ \\mathrm{D}$.',
        'The lens must add 4 D, about 7% of the eye\'s power — the full accommodation of a typical 45-year-old.'
      ],
      a: '58.8 D for the mountain, 62.8 D for the book: 4 D of accommodation.'
    },
    {
      title: 'A tree on the retina',
      q: 'A tree 15 m tall stands 60 m away. How tall is its image on your retina?',
      steps: [
        'Similar triangles through the centre of the lens: $h_i = h_o\\,d_i/d_o = 15 \\times 0.017/60$.',
        '$h_i = 4.25\\times10^{-3}\\ \\mathrm{m} = 4.3\\ \\mathrm{mm}$, and upside down.'
      ],
      a: 'About 4.3 mm, inverted.'
    }
  ],
  quiz: [
    { q: 'Which part of the eye provides most of its focusing power?', choices: ['The lens', 'The cornea', 'The pupil', 'The retina'], a: 1,
      why: 'The air–cornea boundary has the largest jump in refractive index, so it bends light most: about 43 of the eye\'s 60 D.' },
    { q: 'To focus on a nearby object, the lens of the eye…', choices: ['moves forward', 'becomes more rounded and more powerful', 'becomes flatter and weaker', 'does not change; the pupil narrows'], a: 1,
      why: 'The ciliary muscle contracts, the lens bulges, and its power increases: accommodation.' },
    { q: 'Why is your vision blurred when you open your eyes under water?', choices: ['Water absorbs light', 'The cornea loses most of its power against water', 'The pupil closes', 'The retina stops working'], a: 1,
      why: 'Water ($n = 1.33$) is almost as dense optically as the cornea, so the cornea hardly bends the light any more.' },
    { q: 'At night a faint star is easier to see if you look slightly to one side of it. Why?', choices: ['The blind spot is in the centre', 'The rods, which work in dim light, are outside the fovea', 'The pupil is larger off-centre', 'The lens is thinner at the edge'], a: 1,
      why: 'The fovea is packed with cones, which need bright light. Rods, the dim-light receptors, are spread around it.' },
    { q: 'The image formed on the retina is upright.', a: false, why: 'Like any real image made by a converging lens, it is inverted. The brain interprets it.' }
  ],
  applications: [
    'Designing spectacles, contact lenses and intraocular lenses that replace a clouded lens after cataract surgery.',
    'Eye-safe display design: pixel densities chosen to match the eye\'s one-arcminute resolution.',
    'Ophthalmoscopes and retinal cameras that image the back of the eye through the pupil.'
  ],
  history: 'Johannes Kepler explained in 1604 that the eye forms an inverted image on the retina; Christoph Scheiner confirmed it in the 1620s by peeling the back off an animal\'s eye and seeing the image there.'
},

{
  id: 'vision-correction', parent: 'vision-color', title: 'Vision defects and correction', level: 2,
  short: 'Short sight, long sight, the stiffening of age and astigmatism are all focusing errors; a lens of the right power in front of the eye puts the image back on the retina.',
  keywords: ['myopia', 'short-sightedness', 'nearsightedness', 'hyperopia', 'hypermetropia', 'long-sightedness', 'farsightedness', 'presbyopia', 'astigmatism', 'glasses', 'spectacles', 'contact lenses', 'prescription', 'reading glasses', 'laser eye surgery'],
  prereq: ['the-eye', 'thin-lenses'],
  related: ['lensmakers-equation', 'magnification'],
  body: `
A normal eye focuses from infinity down to its near point. When the eye's power does not match its length, the image falls in front of or behind the retina and a correcting lens is needed. Spectacle prescriptions are written in **dioptres**, $P = 1/f$ with $f$ in metres: negative for diverging lenses, positive for converging ones ([[thin-lenses|thin lenses]]).

### Short sight (myopia)
The eyeball is a little too long, or the cornea too curved, for the eye's power. Distant objects focus **in front of** the retina and look blurred; near things are sharp. The eye's **far point** — the farthest distance it can focus — is finite, perhaps 50 cm.

The fix is a **diverging** lens that makes light from very distant objects appear to come from the far point. For a contact lens (at the eye) that means a focal length equal to minus the far-point distance:

$$P = -\\frac{1}{d_f}$$

A far point of 50 cm needs −2 D. Myopia has become much more common in recent decades, especially among children in East Asian cities.

### Long sight (hyperopia)
The eye is too short or too weak. The image of a near object lands **behind** the retina, and the **near point** is farther than 25 cm. A young long-sighted person can often see distant things clearly by accommodating, but reading is tiring. The fix is a **converging** lens that makes a page at the normal reading distance $N = 25$ cm appear to be at the near point $d_n$:

$$P = \\frac{1}{N} - \\frac{1}{d_n}$$

A near point of 1 m needs $4 - 1 = +3$ D.

### Presbyopia
With age the lens stiffens and accommodation fades, from about 10 D at twenty to 1 D at sixty. Sometime in their forties almost everyone starts holding the newspaper at arm's length. Reading glasses use the same formula as long sight. People who also need distance correction wear **bifocals** or **varifocals**, whose power changes from the top of the lens to the bottom.

### Astigmatism
If the cornea is curved more steeply in one direction than the other — more like a rugby ball than a football — lines in one orientation focus sharply while those at right angles blur. A **cylindrical** lens adds power in one direction only. That is why a prescription such as −2.00 / −0.75 × 180 has three numbers: sphere, cylinder and the axis of the cylinder in degrees.

### Glasses or contacts?
Glasses sit about 1–2 cm in front of the eye, so the lens must be slightly different from a contact lens of the same effect. For a short-sighted eye the lens must image infinity at the far point, now $d_f - x$ away from a lens a distance $x$ in front of the eye. The difference matters for strong prescriptions. Laser eye surgery takes another route: it reshapes the cornea itself.
`,
  ideas: [
    'Myopia: far point too close; corrected with a diverging lens, P = −1/d_f.',
    'Hyperopia: near point too far; corrected with a converging lens that moves the reading page optically to the near point.',
    'Presbyopia is the age-related loss of accommodation that affects everyone.',
    'Astigmatism is corrected with a cylindrical lens; prescriptions list sphere, cylinder and axis.'
  ],
  pitfalls: [
    'Short-sighted people need magnifying (converging) lenses — They need diverging lenses: their eyes already converge light too strongly.',
    'A short-sighted person has trouble seeing close up — The reverse: myopia blurs distant objects; near vision is fine.',
    'Long sight and presbyopia are the same thing — Hyperopia is an eye that is too short or weak, from childhood; presbyopia is the loss of accommodation with age, and happens to short-sighted people too.'
  ],
  formulas: [
    {
      name: 'Correcting short sight (lens at the eye)',
      expr: 'P = -1/d_f', tex: 'P = -\\frac{1}{d_f}',
      vars: {
        P: { name: 'power of the correcting lens', q: 'optpower', unit: 'D', signed: true },
        d_f: { name: 'far point of the uncorrected eye', q: 'length', unit: 'cm', value: 50, tex: 'd_f' }
      },
      stories: { P: 'A short-sighted student cannot see clearly beyond {d_f}. What power of contact lens does she need?', d_f: 'Someone wears {P} contact lenses. Without them, how far can they see clearly?' }
    },
    {
      name: 'Correcting long sight or presbyopia for reading',
      expr: 'P = 1/N - 1/d_n', tex: 'P = \\frac{1}{N} - \\frac{1}{d_n}',
      vars: {
        P: { name: 'power of the correcting lens', q: 'optpower', unit: 'D', signed: true },
        N: { name: 'desired reading distance', q: 'length', unit: 'cm', value: 25 },
        d_n: { name: 'near point of the uncorrected eye', q: 'length', unit: 'cm', value: 100, tex: 'd_n' }
      },
      note: 'For a lens close to the eye. The lens makes a page at $N$ appear at the near point $d_n$.',
      stories: { P: 'A 55-year-old\'s near point is {d_n}. What reading glasses let her read at {N}?', d_n: 'Reading glasses of {P} let someone read at {N}. Where is their near point without them?' }
    },
    {
      name: 'Glasses for short sight, allowing for the gap to the eye',
      expr: 'P = -1/(d_f - x)', tex: 'P = -\\frac{1}{d_f - x}',
      vars: {
        P: { name: 'power of the spectacle lens', q: 'optpower', unit: 'D', signed: true },
        d_f: { name: 'far point (measured from the eye)', q: 'length', unit: 'cm', value: 50, tex: 'd_f' },
        x: { name: 'distance from the lens to the eye', q: 'length', unit: 'cm', value: 2 }
      },
      stories: { P: 'An eye has its far point at {d_f}. What power should spectacle lenses worn {x} in front of the eye have?' }
    }
  ],
  examples: [
    {
      title: 'A short-sighted student',
      q: 'A student\'s far point is 40 cm. What contact lenses does she need? What if she wears glasses 2.0 cm from her eyes?',
      steps: [
        'Contact lenses: $P = -1/0.40 = -2.5\\ \\mathrm{D}$.',
        'Glasses: the far point is $40 - 2 = 38$ cm from the lens, so $P = -1/0.38 = -2.63\\ \\mathrm{D}$.',
        'Opticians round to quarter dioptres: −2.50 D contacts and −2.75 D glasses (or −2.50 D if she prefers slightly under-corrected glasses).'
      ],
      a: '−2.5 D contact lenses; about −2.6 D glasses.'
    },
    {
      title: 'Reading glasses',
      q: 'At 50, a man\'s near point has moved to 50 cm; at 60, to 1.0 m. What reading glasses does he need at each age to read at 25 cm?',
      steps: [
        'At 50: $P = 1/0.25 - 1/0.50 = 4 - 2 = +2.0\\ \\mathrm{D}$.',
        'At 60: $P = 1/0.25 - 1/1.0 = 4 - 1 = +3.0\\ \\mathrm{D}$.',
        'Check at 60: the lens makes a page at 25 cm appear at $d_i$ with $1/d_i = 3 - 4 = -1$, i.e. a virtual image 1.0 m away — exactly at his near point.'
      ],
      a: '+2.0 D at 50 and +3.0 D at 60.'
    }
  ],
  quiz: [
    { q: 'A short-sighted person needs…', choices: ['a converging lens', 'a diverging lens', 'a cylindrical lens', 'no lens for distance'], a: 1,
      why: 'Their eye converges light too strongly; a diverging lens reduces the total power so distant objects focus on the retina.' },
    { q: 'Glasses marked +2.5 D are…', choices: ['diverging, for short sight', 'converging, f = 40 cm, for long sight or presbyopia', 'converging, f = 2.5 m', 'cylindrical, for astigmatism'], a: 1, why: 'Positive power is converging, and $f = 1/2.5 = 0.40$ m.' },
    { q: 'Presbyopia is caused by…', choices: ['an eyeball that is too long', 'a cornea that is curved unevenly', 'the lens becoming stiffer with age', 'damage to the retina'], a: 2,
      why: 'A stiffer lens cannot bulge enough to add power for near vision.' },
    { q: 'A short-sighted person has difficulty seeing nearby objects clearly.', a: false, why: 'Myopia blurs distant objects. Near objects, inside the far point, are seen sharply.' },
    { q: 'Astigmatism is corrected with…', choices: ['a stronger spherical lens', 'a cylindrical lens', 'a prism', 'a tinted lens'], a: 1,
      why: 'The eye has different powers in two directions, so the correction must add power in one direction only.' }
  ],
  applications: [
    'Spectacles, contact lenses and varifocals.',
    'Laser refractive surgery (LASIK and similar), which reshapes the cornea.',
    'Intraocular lenses implanted after cataract surgery, chosen with the lensmaker\'s equation.',
    'Eye tests: the letter chart measures resolution, trial lenses find the power.'
  ]
},

{
  id: 'color-vision', parent: 'vision-color', title: 'Colour vision', level: 1,
  short: 'Colour is made in the eye and brain: three kinds of cone cell respond to overlapping ranges of wavelength, and the ratio of their signals is what we see as hue.',
  keywords: ['colour', 'color', 'colour vision', 'cones', 'trichromacy', 'visible spectrum', 'wavelength', 'metamerism', 'colour blindness', 'afterimage', 'opponent process', 'rods'],
  prereq: ['the-eye', 'em-spectrum'],
  related: ['color-mixing', 'dispersion', 'photon'],
  body: `
Visible light is the narrow slice of the [[em-spectrum|electromagnetic spectrum]] from about **380 to 750 nm**. A prism or a rainbow spreads it out and we give its parts names:

| Colour | Wavelength (nm) |
|---|---|
| violet | 380–450 |
| blue | 450–495 |
| green | 495–570 |
| yellow | 570–590 |
| orange | 590–620 |
| red | 620–750 |

But the colour is not *in* the light. It is what our visual system makes of it.

### Three kinds of cone
The retina has three types of cone, each containing a pigment that absorbs over a broad range of wavelengths: **S** (short, peak near 420–440 nm), **M** (medium, about 534 nm) and **L** (long, about 564 nm). The M and L curves overlap heavily. A single wavelength excites the three types in a particular ratio, and the brain reads that **ratio** as hue and the total as brightness. Light at 580 nm stimulates L strongly and M a little less: yellow. At 450 nm S dominates: blue.

### Consequences
Because only three numbers reach the brain, very different spectra can produce the same three signals and look identical — they are **metamers**. A mixture of red and green light excites L and M in the same ratio as pure 580 nm light, and the two look exactly the same yellow. This is why screens can show thousands of colours with just red, green and blue pixels ([[color-mixing|additive mixing]]), and why a shirt can match in the shop and clash in daylight.

Some colours have no wavelength of their own. **Magenta** comes from exciting S and L together without M — red plus blue light — and exists nowhere in the rainbow. White is all three cones excited about equally; brown is dark orange seen next to brighter surroundings.

### Colour blindness, afterimages and night
About 8% of men and 0.5% of women of northern European descent have red–green colour deficiency, because an M or L pigment is missing or shifted; the genes for both sit on the X chromosome. The signals are also compared in **opponent** pairs — red against green, blue against yellow, light against dark — which is why staring at a red patch leaves a green afterimage. In dim light only the rods work: one pigment means no colour, and because the rods peak near 500 nm, blue flowers look relatively brighter at dusk than red ones.

### The photons behind the colour
Each colour corresponds to a frequency $f = c/\\lambda$ and a [[photon|photon]] energy $E = hc/\\lambda$: about 1.8 eV at the red end and 3.1 eV at the violet. Ultraviolet photons carry enough energy to break chemical bonds in skin; infrared photons do not.
`,
  ideas: [
    'Visible light spans roughly 380–750 nm; colour names label parts of this range.',
    'Three cone types with broad, overlapping sensitivities send three signals; their ratio is perceived as hue.',
    'Different spectra that give the same three signals look identical (metamerism) — the basis of RGB screens.',
    'Some colours, such as magenta, correspond to no single wavelength.'
  ],
  pitfalls: [
    'Colour is a property of light alone — It is how the eye and brain respond to light; many different spectra look the same, and a bird with four cone types sees them differently.',
    'Every colour we see corresponds to a wavelength — Magenta, white, pink and brown have no place in the spectrum; they come from mixtures.',
    'A green leaf looks green because it absorbs green light — It reflects green and absorbs mostly red and blue.'
  ],
  formulas: [
    {
      name: 'Frequency of light',
      expr: 'f = c/lambda', tex: 'f = \\frac{c}{\\lambda}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'THz' },
        c: { const: 'c' },
        lambda: { name: 'wavelength (in vacuum)', q: 'length', unit: 'nm', value: 550 }
      },
      stories: { f: 'What is the frequency of green light of wavelength {lambda}?', lambda: 'A laser emits at {f}. What is its wavelength, and what colour is it?' }
    },
    {
      name: 'Photon energy',
      expr: 'E = h*c/lambda', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'energy of one photon', q: 'energy', unit: 'eV' },
        h: { const: 'h' },
        c: { const: 'c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 }
      },
      note: 'A handy shortcut: $E\\,[\\mathrm{eV}] \\approx 1240/\\lambda\\,[\\mathrm{nm}]$.',
      stories: { E: 'How much energy does one photon of {lambda} light carry?', lambda: 'What wavelength has photons of energy {E}?' }
    }
  ],
  examples: [
    {
      title: 'Yellow without yellow',
      q: 'A phone screen has only red, green and blue pixels. How can it show a lemon as yellow?',
      steps: [
        'Pure yellow light (about 580 nm) excites the L cones strongly and the M cones somewhat less, and the S cones hardly at all.',
        'Turning on red and green pixels together excites L (mostly from the red, partly from the green) and M (mostly from the green) in the same ratio, with S again dark.',
        'The brain receives the same three signals and sees the same yellow — even though no light near 580 nm is present.'
      ],
      a: 'By lighting red and green pixels in the right proportion: a metamer of spectral yellow.'
    },
    {
      title: 'Photon energies across the rainbow',
      q: 'Compare the photon energies at 700 nm (red) and 400 nm (violet), and at 300 nm (ultraviolet).',
      steps: [
        '$E = hc/\\lambda$, or about $1240/\\lambda$ with $\\lambda$ in nm and $E$ in eV.',
        'Red: $1240/700 = 1.77$ eV. Violet: $1240/400 = 3.10$ eV. Ultraviolet: $1240/300 = 4.13$ eV.',
        'Many chemical bonds need 3–5 eV to break, which is why ultraviolet light causes sunburn while red light, however bright, does not.'
      ],
      a: '1.77 eV, 3.10 eV and 4.13 eV.'
    }
  ],
  quiz: [
    { q: 'The most common form of colour blindness comes from a missing or altered…', choices: ['rod pigment', 'S-cone pigment', 'M- or L-cone pigment', 'lens'], a: 2,
      why: 'Red–green deficiency involves the M or L pigments, whose genes lie on the X chromosome — which is why it is far commoner in men.' },
    { q: 'A mixture of red and green light is compared with spectral yellow light of 580 nm. To a normal eye…', choices: ['the mixture looks orange', 'the mixture looks white', 'they can look identical', 'the mixture looks darker but the same hue'], a: 2,
      why: 'If the two produce the same three cone signals they are indistinguishable: they are metamers.' },
    { q: 'Where in the spectrum of a rainbow do you find magenta?', choices: ['Between red and violet', 'Next to blue', 'Nowhere: it is a mixture of red and blue light', 'Beyond violet'], a: 2,
      why: 'Magenta excites the S and L cones without M, which no single wavelength can do.' },
    { q: 'At night, colours fade because…', choices: ['objects reflect less colour at night', 'only the rods work, and they have a single pigment', 'the pupil filters colours', 'the lens turns yellow'], a: 1,
      why: 'With a single pigment there is no ratio to compare, so no hue — only brightness.' },
    { q: 'A green leaf looks green because it absorbs green light.', a: false, why: 'It reflects green and absorbs mostly red and blue light (used for photosynthesis).' }
  ],
  applications: [
    'Colour screens, cameras and printers, all built on three-channel colour.',
    'Colour-blind-friendly design of maps, charts and warning signs.',
    'Colour matching in paint, textiles and printing, where metamerism must be controlled.'
  ],
  history: 'Thomas Young proposed in 1802 that the eye needs only three kinds of receptor; Hermann von Helmholtz and James Clerk Maxwell developed the idea, and Maxwell projected the first colour photograph from three filtered images in 1861.',
  sim: { id: 'light-color-mixing', params: { mode: 'cones' } }
},

{
  id: 'color-mixing', parent: 'vision-color', title: 'Additive and subtractive colour', level: 1,
  short: 'Adding lights, as screens and stage lamps do, builds colours up from red, green and blue; mixing paints, inks and filters takes colours away, with cyan, magenta and yellow as the primaries.',
  keywords: ['additive colour', 'subtractive colour', 'RGB', 'CMY', 'CMYK', 'primary colours', 'secondary colours', 'complementary colours', 'filters', 'pigments', 'paint mixing', 'printing'],
  prereq: ['color-vision', 'dispersion'],
  related: ['light-intensity', 'thin-film-interference'],
  body: `
Mix red and green paint and you get a muddy brown. Shine a red and a green spotlight on the same patch of white wall and you get **yellow**. Both are "mixing colours", but they are opposite processes.

### Additive mixing: adding light
When lights overlap, their spectra **add**. The three [[color-vision|cone types]] respond most independently to red, green and blue light, so these are the **additive primaries**:

- red + green = yellow,
- green + blue = cyan,
- red + blue = magenta,
- red + green + blue = white.

Every screen works this way: each pixel has red, green and blue sub-pixels, usually with 256 levels each — about 16.7 million combinations. The colour code #FF8000 means full red, half green and no blue: orange. Two colours that add up to white — red and cyan, green and magenta, blue and yellow — are **complementary**.

### Subtractive mixing: removing light
A filter, dye, ink or pigment works by **absorbing** part of the white light that falls on it. What survives is what you see, so each layer **multiplies** the light that is left:

$$T = T_1 \\times T_2$$

at every wavelength. The **subtractive primaries** are the colours that each remove one additive primary:

- **cyan** absorbs red (passes green and blue),
- **magenta** absorbs green (passes red and blue),
- **yellow** absorbs blue (passes red and green).

Yellow and cyan together pass only green; magenta and yellow leave red; all three leave (ideally) black. The painter's traditional "red, yellow and blue" are rough versions of magenta, yellow and cyan.

### Printing
Printers use cyan, magenta and yellow inks, plus **black** (the K in CMYK): real inks are not perfect absorbers, so the three together give a muddy dark brown, and black ink is cheaper and makes sharp text.

### Coloured objects under coloured light
A surface looks the colour it reflects **from the light it receives**. A red apple under pure blue light reflects almost nothing and looks black. Shops lighting meat or bread use lamps that flatter their colours, and a garment chosen under shop lighting can look different in daylight.

> [!tip] In the simulation, switch between lights and filters, dim one of the three, and predict the colour of each overlap before you look.
`,
  ideas: [
    'Additive mixing adds light: red, green and blue light make every screen colour, and all three make white.',
    'Subtractive mixing removes light: each filter or ink multiplies the light left, and cyan, magenta and yellow are the primaries.',
    'Complementary colours add to white (red–cyan, green–magenta, blue–yellow).',
    'An object can only reflect colours present in the light falling on it.'
  ],
  pitfalls: [
    'Red and green light make brown, as paints do — Lights add: red and green light make yellow. Paint mixing is subtractive.',
    'The primary colours are red, yellow and blue — For light they are red, green and blue; for inks and filters, cyan, magenta and yellow.',
    'A red filter turns white light red by adding red — It removes green and blue and lets the red already in white light through.'
  ],
  formulas: [
    {
      name: 'Filters in series',
      expr: 'T = T1*T2', tex: 'T = T_1 \\times T_2',
      vars: {
        T: { name: 'fraction transmitted by both', q: 'ratio', unit: '%' },
        T1: { name: 'transmittance of the first filter', q: 'ratio', unit: '%', value: 80, tex: 'T_1' },
        T2: { name: 'transmittance of the second filter', q: 'ratio', unit: '%', value: 50, tex: 'T_2' }
      },
      note: 'Applies wavelength by wavelength. A filter that passes 90% of green and one that passes 5% of green together pass 4.5%.',
      stories: { T: 'At one wavelength, a yellow filter transmits {T1} and a cyan filter {T2}. What fraction passes through both?' }
    }
  ],
  examples: [
    {
      title: 'Stacking filters',
      q: 'White light passes through a yellow filter and then a cyan filter. What colour emerges? What if a magenta filter is added?',
      steps: [
        'Yellow absorbs blue and passes red and green.',
        'Cyan absorbs red and passes green and blue. Of the red and green arriving, only green survives.',
        'Magenta absorbs green, the only colour left: nothing gets through — black.'
      ],
      a: 'Green; then black with the magenta filter added.'
    },
    {
      title: 'A red shirt at a disco',
      q: 'A red shirt (reflecting red, absorbing green and blue) is lit first by white light, then by green light, then by magenta light. How does it look?',
      steps: [
        'White light contains red, which the shirt reflects: red.',
        'Green light contains no red, and the shirt absorbs green: it looks black.',
        'Magenta light is red plus blue. The shirt reflects the red and absorbs the blue: red again.'
      ],
      a: 'Red, black, red.'
    }
  ],
  quiz: [
    { q: 'A red and a green spotlight overlap on a white wall. The overlap looks…', choices: ['brown', 'yellow', 'white', 'black'], a: 1, why: 'Lights add. Red plus green light excites L and M cones like yellow light does.' },
    { q: 'You mix yellow and cyan paint. The result is…', choices: ['white', 'green', 'blue', 'black'], a: 1,
      why: 'Yellow removes blue, cyan removes red; only green is reflected by both.' },
    { q: 'Why do colour printers use black ink as well as cyan, magenta and yellow?', choices: ['Black ink is brighter', 'Real CMY inks together make a muddy dark brown, and black is cheaper and sharper', 'CMY cannot print grey', 'Black ink is needed to make white'], a: 1,
      why: 'Real pigments are imperfect absorbers, so the three together do not give a clean black.' },
    { q: 'A blue car is parked under a yellow sodium street lamp. It looks…', choices: ['blue', 'green', 'dark, almost black', 'yellow'], a: 2,
      why: 'Yellow light contains no blue for the car to reflect, and the car absorbs the yellow.' },
    { q: 'The complementary colour of blue light (the one that adds with it to make white) is yellow.', a: true,
      why: 'Yellow light is red plus green; adding blue completes the set of three primaries.' }
  ],
  applications: [
    'Screens and projectors (additive RGB).',
    'Colour printing (subtractive CMYK) and photographic colour film.',
    'Stage and architectural lighting with coloured LEDs.',
    'Colour filters in cameras: each sensor pixel sits under a red, green or blue filter.'
  ],
  sim: 'light-color-mixing'
},

{
  id: 'light-intensity', parent: 'vision-color', title: 'Intensity and the inverse-square law', level: 1,
  short: 'Light from a small source spreads over ever larger spheres, so its intensity falls as one over the distance squared: twice as far, a quarter as bright.',
  keywords: ['intensity', 'inverse-square law', 'irradiance', 'illuminance', 'lux', 'lumen', 'candela', 'luminous flux', 'luminous intensity', 'brightness', 'photometry', 'solar constant'],
  prereq: ['power', 'math:surface-area', 'math:power-functions'],
  related: ['em-wave-energy', 'solar-constant', 'stellar-magnitude', 'sound-intensity'],
  body: `
Move a reading lamp from 1 m to 50 cm above your book and the page becomes not twice but **four times** as bright. The reason is geometry.

### The inverse-square law
**Intensity** is power per unit area, in watts per square metre. A small source radiating a [[power|power]] $P$ equally in all directions spreads it over the surface of a sphere, whose [[math:surface-area|area]] is $4\\pi r^2$:

$$I = \\frac{P}{4\\pi r^2}$$

Double the distance and the same power covers four times the area: a quarter of the intensity. Triple it: a ninth. Comparing two distances,

$$\\frac{I_2}{I_1} = \\left(\\frac{r_1}{r_2}\\right)^2$$

The Sun radiates $3.83\\times10^{26}$ W. At the Earth's distance, $1.50\\times10^{11}$ m, that gives **1361 W/m²** above the atmosphere — the solar constant. Mars, 1.52 times farther away, gets 43% of that; Jupiter, at 5.2 times, just 3.7%.

The law holds only for a source that is small compared with the distance and light that spreads freely. A laser beam hardly spreads at all; a long fluorescent tube close up behaves more like a line (intensity ∝ $1/r$); fog and smoke absorb and scatter.

### Tilted surfaces
A surface tilted by an angle $\\theta$ away from facing the source catches less light, because the same beam is spread over a larger area: the received intensity is multiplied by $\\cos\\theta$. That is why winter sunshine, arriving at a low angle, warms the ground so much less than summer sunshine.

### Brightness as the eye sees it
The eye is not equally sensitive to all wavelengths: it peaks in the green, at 555 nm, and is blind to infrared and ultraviolet. **Photometry** weights light by that sensitivity:

| Quantity | Unit | Meaning |
|---|---|---|
| luminous flux | lumen (lm) | total visible "light output" of a source |
| luminous intensity | candela (cd) = lm/sr | output per unit solid angle, in one direction |
| illuminance | lux (lx) = lm/m² | light falling on a surface |

At 555 nm one watt of light is 683 lumens. A modern LED bulb gives about 100 lm per watt of electricity; an old filament bulb about 15. For a small source of luminous intensity $I_v$ the illuminance at distance $r$ on a surface tilted by $\\theta$ is $E = I_v\\cos\\theta/r^2$ — the same inverse-square law. Direct sunlight is about 100 000 lx, an office 300–500 lx, the full Moon a fraction of a lux, and a moonless starry sky about a thousandth of a lux: the [[the-eye|eye]] copes with all of them.

> [!note] The same law governs [[sound-intensity|sound]], gravity and electric fields — anything that spreads out evenly from a point in three dimensions.
`,
  ideas: [
    'Intensity is power per unit area; from a point source it spreads over a sphere of area 4πr².',
    'Intensity falls as 1/r²: twice as far, a quarter as bright.',
    'A tilted surface receives the intensity multiplied by cos θ.',
    'Photometric units (lumen, candela, lux) weight light by the eye\'s sensitivity, which peaks at 555 nm.'
  ],
  pitfalls: [
    'Twice as far means half as bright — It means a quarter as bright: the light is spread over four times the area.',
    'The inverse-square law applies to every light — Only to sources small compared with the distance and light that spreads freely; a laser beam or a long tube close up behaves differently.',
    'Lux and W/m² measure the same thing — Lux counts only light the eye can see, weighted by its sensitivity; an infrared lamp can deliver many W/m² and zero lux.'
  ],
  formulas: [
    {
      name: 'Intensity from a point source',
      expr: 'I = P/(4*pi*r^2)', tex: 'I = \\frac{P}{4\\pi r^2}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        P: { name: 'power radiated', q: 'power', unit: 'W', value: 100 },
        r: { name: 'distance from the source', q: 'length', unit: 'm', value: 2 }
      },
      stories: {
        I: 'A lamp radiates {P} of light evenly in all directions. What is the intensity {r} away?',
        r: 'At what distance from a source radiating {P} does the intensity fall to {I}?',
        P: 'A star is {r} away and delivers {I} to a telescope. What power does it radiate?'
      }
    },
    {
      name: 'Comparing two distances',
      expr: 'I2 = I1*(r1/r2)^2', tex: 'I_2 = I_1\\left(\\frac{r_1}{r_2}\\right)^2',
      vars: {
        I2: { name: 'intensity at the second distance', q: 'intensity', unit: 'W/m²', tex: 'I_2' },
        I1: { name: 'intensity at the first distance', q: 'intensity', unit: 'W/m²', value: 1361, tex: 'I_1' },
        r1: { name: 'first distance', q: 'length', unit: 'AU', value: 1, tex: 'r_1' },
        r2: { name: 'second distance', q: 'length', unit: 'AU', value: 5.2, tex: 'r_2' }
      },
      stories: {
        I2: 'Sunlight at the Earth ({r1} from the Sun) has an intensity of {I1}. What is it at Jupiter, {r2} from the Sun?',
        r2: 'How far from the Sun is sunlight {I2}, if it is {I1} at {r1}?'
      }
    },
    {
      name: 'Illuminance from a small lamp',
      expr: 'E = Iv*cos(theta)/r^2', tex: 'E = \\frac{I_v\\cos\\theta}{r^2}',
      vars: {
        E: { name: 'illuminance', q: 'illuminance', unit: 'lx' },
        Iv: { name: 'luminous intensity of the lamp', q: 'luminousint', unit: 'cd', value: 100, tex: 'I_v' },
        theta: { name: 'tilt of the surface away from facing the lamp', q: 'angle', unit: '°', value: 30, min: 0, max: 90 },
        r: { name: 'distance from the lamp', q: 'length', unit: 'm', value: 2 }
      },
      stories: {
        E: 'A lamp of {Iv} is {r} from a desk, and the desk is tilted {theta} away from facing it. What is the illuminance?',
        r: 'How close must a {Iv} lamp be to give {E} on a surface tilted {theta} away from it?'
      }
    }
  ],
  examples: [
    {
      title: 'Moving the reading lamp',
      q: 'A lamp 1.0 m above a book gives 100 lx. What does it give at 0.5 m? At 2.0 m?',
      steps: [
        '$E \\propto 1/r^2$, so halving the distance multiplies the illuminance by $2^2 = 4$: 400 lx.',
        'Doubling it divides by 4: 25 lx — too dim to read comfortably.'
      ],
      a: '400 lx at 0.5 m; 25 lx at 2.0 m.'
    },
    {
      title: 'Sunlight at the planets',
      q: 'Using the Sun\'s power of $3.83\\times10^{26}$ W, find the intensity of sunlight at the Earth (1 AU = $1.50\\times10^{11}$ m) and at Jupiter (5.2 AU).',
      steps: [
        'Earth: $I = \\dfrac{3.83\\times10^{26}}{4\\pi (1.50\\times10^{11})^2} = \\dfrac{3.83\\times10^{26}}{2.83\\times10^{23}} = 1360\\ \\mathrm{W/m^2}$.',
        'Jupiter: $1360/5.2^2 = 1360/27 = 50\\ \\mathrm{W/m^2}$.',
        'That is why the solar-powered Juno spacecraft at Jupiter carries three large solar wings spanning about 20 metres.'
      ],
      a: 'About 1360 W/m² at the Earth and 50 W/m² at Jupiter.'
    }
  ],
  quiz: [
    { q: 'You move three times farther from a small lamp. The intensity you receive becomes…', choices: ['1/3', '1/6', '1/9', '1/27'], a: 2, why: '$I \\propto 1/r^2$, and $3^2 = 9$.' },
    { q: 'Mars is 1.52 times as far from the Sun as the Earth. Sunlight there is about…', choices: ['66% as intense', '43% as intense', '23% as intense', 'the same, because space is empty'], a: 1, why: '$1/1.52^2 = 0.43$.' },
    { q: 'Why does a laser beam not follow the inverse-square law over short distances?', choices: ['Lasers are very bright', 'The beam is collimated and hardly spreads', 'Laser light is a single colour', 'Laser light is polarised'], a: 1,
      why: 'The law comes from light spreading over growing spheres. A collimated beam keeps nearly the same area for a long way.' },
    { q: 'A desk receives the most light from a lamp when the light falls on it perpendicularly.', a: true,
      why: 'Tilting the surface spreads the same beam over a larger area, reducing the illuminance by $\\cos\\theta$.' }
  ],
  applications: [
    'Lighting design: placing lamps to give the lux levels needed for offices, sports fields and operating theatres.',
    'Photography: flash exposure falls off with the square of the subject distance.',
    'Astronomy: comparing a star\'s brightness with its luminosity to find its distance.',
    'Solar power: panel output at different planets and different tilts.'
  ]
}

);
