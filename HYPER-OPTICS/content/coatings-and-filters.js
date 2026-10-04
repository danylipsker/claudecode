/* HYPER-OPTICS · content/coatings-and-filters.js — the topic "Coatings and filters" (12 concepts)
 * why-surfaces-are-coated · antireflection-coatings · multilayer-coatings · dielectric-mirrors · metal-mirror-coatings ·
 * angle-of-incidence-and-coatings · interference-filters · dichroic-filters-and-mirrors · coloured-glass-filters ·
 * neutral-density-and-optical-density · how-coatings-are-made · laser-damage-and-coating-durability
 * Simulations: sims/coatings-and-filters.js (cf-…). Numbers come from the thin-film matrix code of the ray bench and the
 * stack designer; wavelengths in nm, normal incidence unless an angle is named.
 */
Hyper.add(

/* ================================================================ why surfaces are coated */
{
  id: 'why-surfaces-are-coated', parent: 'coatings-and-filters', title: 'Why surfaces are coated', level: 1,
  short: 'Every surface between air and glass reflects about 4 % of the light that meets it. That light is lost from the image, and part of it returns as ghosts and veiling glare. A lens of ten surfaces would lose a third of the light; a thin coating, a few hundred nanometres thick, brings the loss at each surface down to a fraction of a per cent.',
  keywords: ['coating', 'reflection loss', 'Fresnel reflection', '4 percent', 'ghost', 'flare', 'veiling glare', 'transmission', 'uncoated lens', 'AR', 'anti-reflection', 'surface loss', 'insertion loss', 'multicoated'],
  prereq: ['fresnel-reflection', 'refractive-index'],
  related: ['antireflection-coatings', 'ghosts-flare-and-stray-light', 'thin-film-interference', 'transmission-and-absorption', 'optical-glass', 'uv-and-infrared-materials', 'spectacle-lens-coatings', 'physics:thin-film-interference'],
  body: `
Hold a pane of window glass at an angle and you see a faint copy of the room in it. Look straight through it and you hardly notice the glass — but it is still there, taking about 8 % of the light. Every transparent solid behaves like this, and an optical instrument is a stack of such surfaces.

### How much a surface reflects
At normal incidence the share of the light reflected at the boundary between media of index $n_1$ and $n_2$ is

$$R = \\left(\\frac{n_2 - n_1}{n_2 + n_1}\\right)^2$$

For air ($n_1 = 1$) and glass this is $R = \\left(\\frac{n-1}{n+1}\\right)^2$: the [[fresnel-reflection|Fresnel reflection]]. It depends only on the index, so the higher the index, the worse it gets:

| Material | $n$ (visible or as stated) | Reflected per surface | Through two surfaces, straight on |
|---|---|---|---|
| Fused silica | 1.46 | 3.5 % | 93.1 % |
| Crown glass N-BK7 | 1.52 | 4.2 % | 91.7 % |
| Sapphire | 1.77 | 7.7 % | 85.1 % |
| Dense flint N-SF11 | 1.79 | 8.0 % | 84.6 % |
| Zinc selenide (infrared) | 2.40 | 17 % | 69 % |
| Silicon (infrared) | 3.42 | 30 % | 49 % |
| Germanium (infrared) | 4.00 | 36 % | 41 % |

### Many surfaces
The losses multiply. With $N$ surfaces the light that goes straight through is $T = (1 - R)^N$. For crown glass at 4.2 %:

| Surfaces | 2 (a window) | 6 | 10 | 20 | 30 (a zoom lens) |
|---|---|---|---|---|---|
| Uncoated | 92 % | 77 % | 65 % | 42 % | 27 % |
| With $R = 0.5$ % | 99 % | 97 % | 95 % | 90 % | 86 % |

Ten uncoated surfaces lose about a third of the light. For a long time that fixed the design of photographic lenses: before coatings, makers kept to four or six glass–air surfaces, and cameras with many elements were slow and hazy.

### The light that does not leave
The reflected light does not simply vanish. It travels back into the instrument and may be reflected again, by another surface, towards the image. A **ghost** is the copy that two reflections make: its brightness is the product of the two reflectances, $R_1 R_2 = 0.0424^2 = 0.18$ % of the main image. That sounds negligible until the scene holds a lamp or the Sun, a thousand times brighter than its surroundings: the ghost of the lamp is then brighter than the dark parts of the picture. With $N$ surfaces there are $N(N-1)/2$ pairs, each a ghost path; the light of all of them, spread over the picture, is **veiling glare** that lowers the contrast everywhere. See [[ghosts-flare-and-stray-light]].

So the coating pays twice: more light reaches the image, and less of it is in the wrong place. Mirrors, filters and beam splitters are coated for the opposite reason — to reflect or to select — and the same thin-film physics ([[thin-film-interference]]) serves both.

> [!key] An uncoated glass–air surface reflects $R = ((n-1)/(n+1))^2$, about 4 % for crown glass and 36 % for germanium. The loss multiplies, so ten surfaces lose a third; the reflections also return as ghosts. A coating is the remedy.
`,
  ideas: [
    'A surface between air and glass of index n reflects R = ((n − 1)/(n + 1))², about 4 % for ordinary glass.',
    'The higher the index, the larger the loss: 8 % for dense flint, 17 % for zinc selenide, 36 % for germanium.',
    'Surface losses multiply: N surfaces pass (1 − R)^N, so ten uncoated surfaces lose about a third of the light.',
    'Light reflected twice reaches the image as a ghost, R₁R₂ of the main beam, and as veiling glare that lowers contrast.',
    'A thin coating cuts the reflection of each surface to 0.2–1 % — more light, fewer ghosts.'
  ],
  pitfalls: [
    'Glass is transparent, so it passes all the light — Even clear glass reflects about 4 % at each surface; a window passes only about 92 % before any absorption.',
    'The reflected light is simply lost — It bounces on inside the instrument. Some of it reaches the image as ghosts and flare, which is worse than losing it.',
    'A coating only matters for the brightness of the picture — It matters as much for contrast: ghosts are the product of two reflectances, so halving each surface\'s reflection cuts the ghost to a quarter.',
    'Only the number of lenses matters — What counts is the number of glass–air surfaces. Cementing two lenses together removes the air gap, and with it two surfaces\' worth of reflection.'
  ],
  terms: [
    { term: 'Fresnel reflection', also: ['surface reflection', 'reflection loss'], def: 'The fraction of light reflected at the boundary between two media of different refractive index. At normal incidence it is ((n₂ − n₁)/(n₂ + n₁))².' },
    { term: 'Transmittance', also: ['T', 'transmission'], def: 'The fraction of the incident light that passes through a part. A window of crown glass, ignoring absorption, has T = 92 %.' },
    { term: 'Ghost image', also: ['ghost'], def: 'A faint copy of a bright object made by light that was reflected twice inside an instrument before it reached the image.' },
    { term: 'Veiling glare', also: ['flare', 'stray light'], def: 'A haze of stray light over the whole image, mostly from the multiple reflections between surfaces. It lowers contrast and is strongest when a bright source is in or near the field.' },
    { term: 'Anti-reflection coating', also: ['AR coating', 'antireflective coating', 'AR'], def: 'One or more thin transparent films on a surface, chosen so that the reflections from their interfaces cancel and the surface passes almost all the light.' }
  ],
  formulas: [
    {
      name: 'Reflection at an air–glass surface',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n-1}{n+1}\\right)^2',
      vars: {
        R: { name: 'reflectance of one surface', q: 'ratio', unit: '%' },
        n: { name: 'refractive index of the glass', value: 1.52, min: 1, max: 4.5 }
      },
      note: 'Normal incidence, light arriving from air.',
      stories: { R: 'Light meets a surface of glass of index {n} head-on from air. What share is reflected?', n: 'A surface reflects {R} of the light at normal incidence. What is its refractive index (taking n above 1)?' }
    },
    {
      name: 'Light through N surfaces',
      expr: 'T = (1 - R)^N', tex: 'T = (1 - R)^{N}',
      vars: {
        T: { name: 'light that goes straight through', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of each surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 60 },
        N: { name: 'number of glass–air surfaces', value: 10, min: 1, max: 100, int: true }
      },
      note: 'Counts only light that goes straight through; the light that bounces back and forth and finally leaves adds a little, as veiling glare.',
      stories: { T: 'A lens has {N} glass–air surfaces, each reflecting {R}. How much light goes straight through?', N: 'Each surface of a lens reflects {R}. How many surfaces would let only {T} of the light straight through?' }
    },
    {
      name: 'Brightness of a ghost',
      expr: 'G = R1*R2', tex: 'G = R_1\\,R_2',
      vars: {
        G: { name: 'ghost brightness, as a share of the main image', q: 'ratio', unit: '%' },
        R1: { name: 'reflectance of the first surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 60, tex: 'R_1' },
        R2: { name: 'reflectance of the second surface', q: 'ratio', unit: '%', value: 4.2, min: 0, max: 60, tex: 'R_2' }
      },
      note: 'The simplest ghost: reflected back by surface 2 and forward again by surface 1.'
    }
  ],
  examples: [
    {
      title: 'A six-element lens, with and without coatings',
      q: 'A camera lens has six glass elements, so twelve glass–air surfaces. If the glass is crown (4.2 % per surface), how much light goes straight through uncoated, and how much if every surface carries a coating that reflects 0.5 %?',
      steps: [
        { text: 'Uncoated:', tex: 'T = (1 - 0.042)^{12} = 0.958^{12} = 0.59' },
        { text: 'Coated:', tex: 'T = (1 - 0.005)^{12} = 0.995^{12} = 0.94' },
        'The coating lifts the transmitted light from 59 % to 94 %: a gain of 0.7 stop.'
      ],
      a: '59 % uncoated, 94 % coated. That is why every modern lens is multicoated.'
    },
    {
      title: 'The ghost of a street lamp',
      q: 'Two surfaces, each reflecting 4.2 %, make a ghost of a street lamp. How bright is the ghost compared with the lamp\'s image? If the lamp is 5000 times brighter than the dark road beside it, how does the ghost compare with the road?',
      steps: [
        { text: 'The ghost is reflected twice:', tex: 'G = 0.042 \\times 0.042 = 0.0018 = 0.18\\ \\%' },
        'Compared with the road: $0.0018 \\times 5000 = 9$. The ghost of the lamp is nine times brighter than the road around it.',
        'With coatings of 0.5 % on both surfaces, $G = 0.000025$, and the ghost is 0.13 of the road\'s brightness — below what the eye notices.'
      ],
      a: 'The ghost is 0.18 % of the lamp, which is nine times the brightness of the dark road — plainly visible. Coating the surfaces makes it vanish into the background.'
    }
  ],
  quiz: [
    { q: 'About what share of light does one surface of ordinary crown glass reflect at normal incidence?', choices: ['0.4 %', '4 %', '14 %', '40 %'], a: 1, why: '$R = ((1.52 - 1)/(1.52 + 1))^2 = 0.043$, about 4 %. A window therefore reflects about 8 % in all.' },
    { q: 'A lens of crown glass has 8 surfaces and no coating. About how much light goes straight through?', choices: ['92 %', '71 %', '50 %', '30 %'], a: 1, why: '$0.958^8 = 0.71$. The losses multiply, they do not add: 8 × 4 % would suggest 68 %, which is close only because the losses are small.' },
    { q: 'A material of higher refractive index loses more light at each uncoated surface.', a: true, why: 'R grows with the index: 3.5 % for fused silica, 8 % for dense flint, 36 % for germanium. That is why infrared optics of germanium or zinc selenide must be coated.' },
    { q: 'Two surfaces reflect 3 % each. What share of the main image\'s brightness has the ghost made by one reflection at each, in per cent?', answer: 0.09, unit: '%', why: 'The ghost is reflected twice: $0.03 \\times 0.03 = 0.0009$, that is 0.09 %.' },
    { q: 'Why is a ghost more of a problem than the simple loss of 4 % of the light?', choices: ['The lost light heats the lens', 'A bright source makes a visible, misplaced image, and the stray light lowers the contrast everywhere', 'Ghosts change the colour of the image', 'Ghosts only occur in cheap lenses'], a: 1, why: 'A 4 % loss is only a slightly dimmer picture. But the reflected light returns as ghosts and haze: it is the contrast, not the brightness, that suffers.' }
  ],
  applications: [
    'Camera lenses, binoculars, microscope objectives: dozens of glass–air surfaces whose coatings decide how bright and how contrasty the image is.',
    'Spectacle lenses: a coating removes the reflections that other people see as glare on your lenses, and the ones you see as faint ghosts at night.',
    'Solar panels and their cover glass: every per cent of reflection saved is a per cent more electricity.',
    'Infrared optics of germanium, silicon and zinc selenide, which are useless uncoated.',
    'Laser systems, where a reflection from a surface can travel back to the source and destabilise it, or burn what it meets.'
  ],
  history: 'The first hint came from old lenses: the English lens designer H. Dennis Taylor noticed in the 1890s that a lens whose surface had tarnished slightly passed more light than a new one, and patented a chemical treatment. The coating made on purpose, a thin vacuum-deposited film of fluoride, was developed by Alexander Smakula at Zeiss in 1935 and was a closely held wartime advantage; it made lenses of many elements practical.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 (The Propagation of Light) — the Fresnel equations and the reflectance at normal incidence.',
    'H. A. Macleod, *Thin-Film Optical Filters* — the introduction and the chapter on anti-reflection coatings.',
    'R. Kingslake, *A History of the Photographic Lens* — the effect of coatings on multi-element lenses.'
  ],
  sim: 'cf-surface-losses'
},

/* ================================================================ anti-reflection coatings */
{
  id: 'antireflection-coatings', parent: 'coatings-and-filters', title: 'Anti-reflection coatings', level: 2,
  short: 'A layer a quarter of a wavelength thick, whose index is the square root of the glass\'s, cancels the reflection exactly at one wavelength. Magnesium fluoride, the usual single layer, leaves about 1.3 % on crown glass; two layers make a V for lasers, three or more a broadband coating good across the visible.',
  keywords: ['anti-reflection', 'antireflection', 'AR coating', 'quarter-wave', 'MgF2', 'magnesium fluoride', 'V-coat', 'BBAR', 'broadband', 'multicoating', 'coated lens', 'purple tint', 'ideal index', 'reflectance curve', 'sol-gel', 'moth-eye'],
  prereq: ['why-surfaces-are-coated', 'thin-film-interference', 'refractive-index'],
  related: ['multilayer-coatings', 'angle-of-incidence-and-coatings', 'how-coatings-are-made', 'ghosts-flare-and-stray-light', 'spectacle-lens-coatings', 'uv-and-infrared-materials', 'optical-windows', 'physics:thin-film-interference'],
  body: `
An anti-reflection (AR) coating does not absorb the unwanted reflection; it **cancels** it with a second one. Put a transparent layer of thickness $d$ and index $n_f$ on glass of index $n_s$. Light is reflected at the top of the layer (ray 1) and at the boundary between layer and glass (ray 2). Ray 2 travels the extra distance $2d$ through the layer; if $n_f d = \\lambda/4$ that is half a wavelength of path, so the two reflections are out of step and cancel — provided they are equally strong. See [[thin-film-interference]].

### The quarter-wave layer
For the layer to be $\\lambda/4$ thick *optically*, its physical thickness is

$$d = \\frac{\\lambda}{4\\,n_f}$$

and the two reflections have equal strength when

$$n_f = \\sqrt{n_s}$$

The reflectance that is left at the design wavelength is $R = \\left(\\frac{n_s - n_f^2}{n_s + n_f^2}\\right)^2$. For crown glass ($n_s = 1.52$) the ideal layer would have $n_f = 1.23$, and no hard, durable solid has an index that low. The classic compromise is **magnesium fluoride**, $n_f = 1.38$: tough, transparent, easy to deposit. At 550 nm it is 99.6 nm thick and leaves $R = 1.27$ % — a third of the bare glass's 4.24 %.

On glass of higher index it does better, because $\\sqrt{n_s}$ moves up towards 1.38: 0.13 % on sapphire, 0.09 % on dense flint, and exactly zero on glass of index 1.90.

### Colour and bandwidth
The cancellation is perfect only at the design wavelength. Away from it the layer is no longer a quarter wave and the reflection rises again. Computed for crown glass (design 550 nm):

| Coating | Layers | Reflectance at 550 nm | Across the visible |
|---|---|---|---|
| Bare glass | — | 4.2 % | 4.2 % |
| MgF₂, single layer | 1 | 1.3 % | 1.3 % at 550 nm, 1.8 % at 430 and 680 nm |
| V-coat (MgF₂ + ZrO₂) | 2 | 0.0 % | below 1 % from 486 to 607 nm, then up: 2.8 % at 650, 5.5 % at 700 |
| Broadband (MgF₂, ZrO₂, Al₂O₃) | 3 | 0.2 % | below 0.9 % from 430 to 680 nm |

The eye is most sensitive to green, so coatings are usually centred near 550 nm; what remains of the reflection is at the blue and red ends, and the reflected light looks **purple or violet** — the tint of a coated lens. Designs centred on other wavelengths look amber or green, and multilayer designs show several colours at once.

### V-coats and broadband coatings
Two layers have two thicknesses to adjust, and can be chosen to make the reflectance exactly zero at one wavelength: the **V-coat**, whose curve is a narrow V. It is the usual coating of laser optics, which work at one wavelength, and of laser lines such as 532 or 1064 nm. Away from the V it can be worse than bare glass.

Three layers — a quarter-wave of low index, a half-wave of high, a quarter-wave of medium — hold the reflection below 1 % across the whole visible: the **broadband AR** (BBAR). Photographic lenses use designs of four to ten layers that do better, below 0.5 % and often near 0.2 % at all visible wavelengths.

### Other routes
A layer of porous silica made by a sol-gel process has an index of 1.2–1.3, close to the ideal, and a single layer of it does well; surfaces etched or moulded with sub-wavelength cones (a "moth-eye" structure) make the index change gradually and cut reflection over a wide band and a wide range of angles. Both are less hard than evaporated films.

### Angle
At an oblique angle the path through the layer lengthens, the cancellation moves to shorter wavelengths, and the reflection at the red end grows: a coated lens looks more strongly coloured at the edge of the field. See [[angle-of-incidence-and-coatings]].

> [!key] A quarter-wave layer of index $\\sqrt{n_s}$ cancels the reflection at one wavelength. MgF₂ leaves 1.3 % on crown glass; a V-coat reaches zero at one wavelength, a broadband multilayer stays under 1 % across the visible. The leftover reflection is why coated glass looks purple.
`,
  ideas: [
    'The reflections from the top and bottom of a quarter-wave layer are half a wave out of step and cancel — if they are equally strong.',
    'Equal strength needs the layer\'s index to be √n of the glass: 1.23 for crown glass.',
    'MgF₂ (n = 1.38, 99.6 nm for 550 nm) is hard and cheap and leaves about 1.3 % on crown glass.',
    'A V-coat of two layers is exactly zero at one wavelength; three or more layers cover the visible.',
    'The leftover reflection is at the blue and red ends, so a coated lens looks purple or green.'
  ],
  pitfalls: [
    'A coating absorbs the reflected light — It cancels it by interference. The energy is not lost: it goes into the transmitted beam, which is why the coated surface passes more light.',
    'Any transparent film reduces reflection — Only a layer of the right thickness (a quarter wave) and an index between that of air and glass does. A film of the wrong thickness can increase the reflection.',
    'A coated lens reflects no light — It reflects 0.2–1 % across the visible, 1.3 % for the simplest coating. The coloured sheen you see is that remainder.',
    'The coating works at all wavelengths and angles alike — It is tuned to one wavelength and one angle. Tilt it and the curve moves towards the blue.'
  ],
  terms: [
    { term: 'Quarter-wave layer', also: ['QW layer', 'λ/4 layer'], def: 'A film whose optical thickness n·d equals a quarter of the design wavelength. The reflections from its two faces are half a wavelength out of step.' },
    { term: 'Design wavelength', also: ['reference wavelength', 'λ₀', 'centre wavelength'], def: 'The wavelength at which the thicknesses of a coating are quarter or half waves. The coating works best there.' },
    { term: 'V-coat', also: ['V coating', 'two-layer AR'], def: 'A two-layer anti-reflection coating with zero reflection at one wavelength and a reflectance curve shaped like a V. The standard coating for laser lines.' },
    { term: 'Broadband anti-reflection', also: ['BBAR', 'multilayer AR', 'wideband AR'], def: 'A coating of three or more layers that keeps the reflectance low (typically under 1 %, often under 0.5 %) over a wide band such as the whole visible range.' },
    { term: 'Magnesium fluoride', also: ['MgF₂'], def: 'The standard low-index coating material (n = 1.38): hard, transparent from the ultraviolet to the infrared, and deposited by evaporation.' },
    { term: 'Ideal coating index', also: ['√n rule'], def: 'The index n_f = √n_s that a single quarter-wave layer needs to cancel the reflection completely on a substrate of index n_s.' }
  ],
  formulas: [
    {
      name: 'Ideal index of a single layer',
      expr: 'nf = sqrt(ns)', tex: 'n_f = \\sqrt{n_s}',
      vars: {
        nf: { name: 'index of the coating layer', tex: 'n_f' },
        ns: { name: 'index of the substrate', value: 1.52, min: 1, max: 4.5, tex: 'n_s' }
      },
      stories: { nf: 'What index should a single anti-reflection layer have on glass of index {ns}?', ns: 'A single layer of index {nf} is perfect on which substrate?' }
    },
    {
      name: 'Thickness of a quarter-wave layer',
      expr: 'd = lambda/(4*nf)', tex: 'd = \\frac{\\lambda}{4\\,n_f}',
      vars: {
        d: { name: 'physical thickness of the layer', q: 'length', unit: 'nm' },
        lambda: { name: 'design wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        nf: { name: 'index of the layer', value: 1.38, min: 1, max: 4.5, tex: 'n_f' }
      },
      stories: { d: 'How thick is a quarter-wave layer of index {nf} for light of {lambda}?' }
    },
    {
      name: 'Reflectance left by a single quarter-wave layer',
      expr: 'R = ((ns - nf^2)/(ns + nf^2))^2', tex: 'R = \\left(\\frac{n_s - n_f^2}{n_s + n_f^2}\\right)^2',
      vars: {
        R: { name: 'reflectance at the design wavelength', q: 'ratio', unit: '%' },
        ns: { name: 'index of the substrate', value: 1.52, min: 1, max: 4.5, tex: 'n_s' },
        nf: { name: 'index of the layer', value: 1.38, min: 1, max: 4.5, tex: 'n_f' }
      },
      note: 'Zero when the layer\'s index squared equals the substrate\'s index.',
      stories: { R: 'A single quarter-wave layer of index {nf} is put on glass of index {ns}. What reflectance is left at the design wavelength?' }
    }
  ],
  examples: [
    {
      title: 'MgF₂ on a crown-glass lens',
      q: 'A crown-glass lens ($n_s = 1.52$) is coated with MgF₂ ($n_f = 1.38$) for 550 nm. How thick is the layer, and how much light does each surface now reflect at 550 nm?',
      steps: [
        { text: 'The layer is a quarter wave thick:', tex: 'd = \\frac{550}{4 \\times 1.38} = 99.6\\ \\mathrm{nm}' },
        { text: 'The reflectance left:', tex: 'R = \\left(\\frac{1.52 - 1.38^2}{1.52 + 1.38^2}\\right)^2 = \\left(\\frac{1.52 - 1.904}{1.52 + 1.904}\\right)^2 = 0.0126' }
      ],
      a: '99.6 nm, and about 1.3 % reflected — against 4.3 % bare. A lens of ten such surfaces passes 88 % instead of 64 %.'
    },
    {
      title: 'Which glass is MgF₂ perfect on?',
      q: 'For a single layer to cancel the reflection exactly, $n_f^2 = n_s$. For which glass index is a MgF₂ layer ($n_f = 1.38$) ideal? How well does it do on sapphire ($n_s = 1.77$)?',
      steps: [
        'The condition gives $n_s = 1.38^2 = 1.90$: a dense lanthanum or heavy flint glass.',
        { text: 'On sapphire:', tex: 'R = \\left(\\frac{1.77 - 1.904}{1.77 + 1.904}\\right)^2 = 0.0013' }
      ],
      a: 'Perfect on glass of index 1.90; on sapphire 0.13 % remains. High-index glasses are the easiest to coat.'
    }
  ],
  quiz: [
    { q: 'What index should a single anti-reflection layer have on crown glass ($n_s = 1.52$)?', choices: ['1.00', '1.23', '1.52', '2.31'], a: 1, why: 'The two reflections are equal when $n_f = \\sqrt{n_s} = \\sqrt{1.52} = 1.23$. MgF₂ at 1.38 is the nearest hard material.' },
    { q: 'A quarter-wave layer of MgF₂ ($n = 1.38$) is made for 550 nm. Its thickness in nanometres is…', answer: 99.6, unit: 'nm', why: '$d = \\lambda/(4n) = 550/(4 \\times 1.38) = 99.6$ nm.' },
    { q: 'Where does the energy go that a coating "removes" from the reflection?', choices: ['It is absorbed in the coating', 'It is scattered sideways', 'It goes into the transmitted beam', 'It is converted to heat in the glass'], a: 2, why: 'Light is neither created nor destroyed by a lossless film. The two reflections cancel by interference, so the energy is carried by the transmitted wave: R + T = 1.' },
    { q: 'A V-coat designed for 532 nm is used at 700 nm. Its reflectance there may be higher than that of uncoated glass.', a: true, why: 'Away from the V the two layers are far from quarter waves and the reflections no longer cancel; the computed V-coat reflects 5.5 % at 700 nm, against 4.2 % for bare glass.' },
    { q: 'A coated lens looks purple in reflected light because…', choices: ['the glass is tinted', 'the coating is purple', 'it reflects least in the middle of the spectrum and a little more at the red and blue ends', 'it absorbs green light'], a: 2, why: 'The coating is tuned to the green. The residual reflection is at the two ends of the visible spectrum, red and blue together, which the eye sees as purple.' }
  ],
  applications: [
    'Camera, binocular and microscope lenses: multilayer broadband coatings on every air–glass surface.',
    'Laser optics: V-coats for 532, 1064 nm and other lines, with reflectances below 0.1 % at the line.',
    'Spectacle lenses, to remove the glare of the lens surfaces; solar cells and cover glasses, to let in more sunlight.',
    'Windows of sensors and instruments, display panels and picture-framing glass.',
    'Infrared lenses of germanium and zinc selenide, whose coatings raise the transmission of each surface from 64 % or 83 % to over 98 %.'
  ],
  history: 'After Smakula\'s fluoride coating of 1935, the 1930s and 1940s brought rapid progress: the single quarter-wave layer of MgF₂ became standard, then two-layer and three-layer designs. Computer design of many-layer coatings from the 1960s made broadband multilayers routine.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapters on basic theory and on anti-reflection coatings.',
    'E. Hecht, *Optics*, ch. 9 (Interference), the section on dielectric films — the quarter-wave coating.',
    'J. A. Dobrowolski, "Coatings and filters", in *Handbook of Optics* (ed. M. Bass) — design of AR coatings.'
  ],
  sim: 'cf-ar-coating'
},

/* ================================================================ multilayer coatings */
{
  id: 'multilayer-coatings', parent: 'coatings-and-filters', title: 'Multilayer coatings: how a stack is computed', level: 2,
  short: 'A multilayer coating is a pile of films of two or three materials with thicknesses a quarter or half wave. The reflectance of the pile is found by multiplying one two-by-two matrix for each layer. Designers write a stack as H L H L … — H for a quarter wave of high index, L of low — and let a computer choose the thicknesses.',
  keywords: ['multilayer', 'thin-film stack', 'characteristic matrix', 'transfer matrix', 'admittance', 'quarter-wave', 'half-wave', 'absentee layer', 'H and L', 'HL notation', 'optical thickness', 'phase thickness', 'coating design', 'TiO2', 'SiO2', 'thin film software'],
  prereq: ['thin-film-interference', 'antireflection-coatings', 'math:matrix-multiplication'],
  related: ['dielectric-mirrors', 'interference-filters', 'angle-of-incidence-and-coatings', 'how-coatings-are-made', 'ray-transfer-matrices', 'optical-path-length'],
  body: `
One layer on glass gives two reflections and a simple rule. Twenty layers give twenty-one reflections, and each of them is reflected again at every other interface on the way out. Tracing all those bounces by hand is hopeless; the method that every coating program uses turns the whole pile into a product of small matrices.

### One layer, one matrix
Light of wavelength $\\lambda$ crosses a layer of index $n$ and thickness $d$ at angle $\\theta$ inside the layer. It acquires the **phase thickness**

$$\\delta = \\frac{2\\pi}{\\lambda}\\, n\\, d \\cos\\theta$$

and the layer is described by the matrix

$$M = \\begin{pmatrix} \\cos\\delta & i\\sin\\delta/\\eta \\\\ i\\,\\eta\\sin\\delta & \\cos\\delta \\end{pmatrix}$$

with the **optical admittance** $\\eta = n\\cos\\theta$ for s-polarized light and $\\eta = n/\\cos\\theta$ for p. Multiply the matrices of all the layers from the substrate outwards, apply the product to the substrate's admittance, and the result is a single admittance $Y$ for the whole coating. The reflectance follows as in a single surface:

$$R = \\left|\\frac{\\eta_0 - Y}{\\eta_0 + Y}\\right|^2$$

with $\\eta_0$ the admittance of the incident medium. Every plot on this page is made that way: the computer repeats the product for each wavelength and each angle, in a few microseconds each.

### Quarter and half waves
Two thicknesses are special:
- **Quarter wave** ($\\delta = 90°$, $n d = \\lambda/4$): the layer turns the admittance upside down, $Y = n^2/n_s$. A high-index quarter wave on glass makes the surface look like a much *lower*-index one, and a low-index one makes it look higher. Stack them alternately and the effect compounds.
- **Half wave** ($\\delta = 180°$, $n d = \\lambda/2$): the matrix becomes minus the identity, and the layer has *no effect at that wavelength* — an "absentee" layer. It matters only off the design wavelength; the middle layer of a broadband AR coating is a half wave of high index.

### The shorthand
Designers write a stack as letters: **H** for a quarter wave of a high-index material, **L** for a quarter wave of a low-index one, **M** for medium, a number for more waves: $2H$ is a half wave, $(HL)^8 H$ is eight H–L pairs and one more H, 17 layers. The list runs from the air side to the glass unless it says otherwise.

| Material | Index (visible) | Role |
|---|---|---|
| MgF₂ | 1.38 | low |
| SiO₂ | 1.46 | low |
| Al₂O₃ | 1.63 | medium |
| HfO₂ | 1.95 | high |
| ZrO₂ | 2.05 | high |
| Ta₂O₅ | 2.10 | high |
| TiO₂ | 2.35 | high |

### How many layers
Two layers make a V-coat, three a broadband AR, seventeen a laser mirror, and filters with fifty to over a hundred layers are routine. Beyond a handful of layers, no one picks the thicknesses by hand: a program starts from a quarter-wave design and adjusts each thickness to bring a computed curve towards the specification. The matrix algorithm is the engine inside the loop.

### What the model leaves out
The method assumes smooth, flat, lossless layers with exactly known indices. Real layers absorb and scatter a little (parts per million to per cent), the interfaces are not perfectly sharp, and each layer's thickness is known only to a per cent or so — a uniform error of 1 % moves the whole spectrum by 1 % of its wavelength. Designs are chosen to tolerate that.

> [!key] A stack is the product of a 2 × 2 matrix per layer, with the phase thickness $\\delta = 2\\pi n d \\cos\\theta/\\lambda$. A quarter wave inverts the admittance, a half wave disappears. H L H L … is the language of the designer.
`,
  ideas: [
    'Each layer is a 2 × 2 matrix of its phase thickness δ and admittance η; the stack is their product.',
    'A quarter-wave layer (δ = 90°) turns the admittance upside down: Y = n²/n_s.',
    'A half-wave layer (δ = 180°) has no effect at its design wavelength: an absentee layer.',
    'H and L stand for quarter waves of high and low index; (HL)⁸H is a 17-layer stack.',
    'A design program optimises the thicknesses; the matrix product is evaluated at every wavelength and angle.'
  ],
  pitfalls: [
    'Add up the reflection of each interface to get the reflectance of a stack — The reflections are waves with phases; they add as amplitudes with the right phase, and each is itself reflected again. That bookkeeping is what the matrices do.',
    'A half-wave layer is useless — It is invisible at one wavelength but changes the curve everywhere else; designers use it to flatten or broaden the response.',
    'A thicker layer always means a thicker effect — The effect depends on the phase thickness, so a layer of two quarter waves has the same effect as none at its design wavelength.',
    'The coating program tells the truth about the real coating — It tells the truth about the model coating. The real one has thickness errors, absorption, scatter and indices that depend on how it was made.'
  ],
  terms: [
    { term: 'Phase thickness', also: ['δ'], def: 'The phase a wave acquires crossing a layer once: δ = 2π n d cosθ/λ. A quarter-wave layer has 90°, a half-wave layer 180°.' },
    { term: 'Characteristic matrix', also: ['transfer matrix', 'layer matrix'], def: 'The 2 × 2 matrix that describes how a layer connects the electric and magnetic fields on its two faces. The matrix of a stack is the product of the matrices of its layers.' },
    { term: 'Optical admittance', also: ['η', 'tilted admittance'], def: 'The ratio of the magnetic to the electric field of a wave in a medium: n cosθ for s, n/cosθ for p. The reflectance of a surface is set by the mismatch of admittances.' },
    { term: 'Optical thickness', also: ['n·d', 'optical path'], def: 'The index of a layer times its physical thickness. A quarter-wave layer has an optical thickness of λ/4.' },
    { term: 'H, L notation', also: ['HL notation', 'quarter-wave stack formula'], def: 'A shorthand for a coating: H is a quarter wave of a high-index material, L of a low-index one; 2H is a half wave; (HL)ⁿ repeats the pair n times.' },
    { term: 'Absentee layer', def: 'A half-wave layer (or any whole number of half waves): it has no effect on reflection at its design wavelength.' }
  ],
  formulas: [
    {
      name: 'Phase thickness of a layer',
      expr: 'delta = 2*pi*n*d*cos(theta)/lambda', tex: '\\delta = \\frac{2\\pi\\, n\\, d \\cos\\theta}{\\lambda}',
      vars: {
        delta: { name: 'phase thickness', q: 'angle', unit: '°', tex: '\\delta' },
        n: { name: 'index of the layer', value: 1.38, min: 1, max: 4.5 },
        d: { name: 'physical thickness', q: 'length', unit: 'nm', value: 99.6 },
        theta: { name: 'angle of the light inside the layer', q: 'angle', unit: '°', value: 0, min: 0, max: 80, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: '90° is a quarter wave, 180° a half wave.',
      stories: { delta: 'A layer of index {n} is {d} thick. What phase does light of {lambda} acquire in crossing it, at {theta} inside the layer?' }
    },
    {
      name: 'Thickness for m quarter waves',
      expr: 'd = m*lambda/(4*n)', tex: 'd = \\frac{m\\,\\lambda}{4\\,n}',
      vars: {
        d: { name: 'physical thickness', q: 'length', unit: 'nm' },
        m: { name: 'number of quarter waves (1 = quarter, 2 = half)', value: 1, min: 1, max: 20, int: true },
        lambda: { name: 'design wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        n: { name: 'index of the layer', value: 2.35, min: 1, max: 4.5 }
      },
      stories: { d: 'How thick is a layer of {m} quarter waves of a material of index {n} for light of {lambda}?' }
    },
    {
      name: 'Admittance transformed by a quarter-wave layer',
      expr: 'Y = n^2/Ys', tex: 'Y = \\frac{n^2}{Y_s}',
      vars: {
        Y: { name: 'admittance seen at the front of the layer' },
        n: { name: 'index of the quarter-wave layer', value: 2.35, min: 1, max: 4.5 },
        Ys: { name: 'admittance behind it (the substrate\'s index, for a first layer)', value: 1.52, min: 0.01, max: 100, tex: 'Y_s' }
      },
      note: 'Normal incidence. Apply it layer by layer from the substrate; then R = ((1 − Y)/(1 + Y))² in air.'
    },
    {
      name: 'Reflectance from the admittance',
      expr: 'R = ((n0 - Y)/(n0 + Y))^2', tex: 'R = \\left(\\frac{n_0 - Y}{n_0 + Y}\\right)^2',
      vars: {
        R: { name: 'reflectance', q: 'ratio', unit: '%' },
        n0: { name: 'index of the incident medium', value: 1, min: 1, max: 4.5, tex: 'n_0' },
        Y: { name: 'admittance of the coated surface', value: 9.42, min: 0.01, max: 1000 }
      },
      note: 'Y = 9.42 is the three-layer stack H L H on crown glass (see the example).'
    }
  ],
  examples: [
    {
      title: 'The phase of an MgF₂ layer at two wavelengths',
      q: 'A MgF₂ layer ($n = 1.38$) is 99.6 nm thick. What phase does it give at 550 nm and at 450 nm?',
      steps: [
        { text: 'At 550 nm:', tex: '\\delta = \\frac{2\\pi \\times 1.38 \\times 99.6}{550} = 1.570\\ \\mathrm{rad} = 90°' },
        { text: 'At 450 nm:', tex: '\\delta = \\frac{2\\pi \\times 1.38 \\times 99.6}{450} = 1.919\\ \\mathrm{rad} = 110°' }
      ],
      a: '90° (a quarter wave) at the design wavelength, 110° in blue light. The farther the phase from 90°, the less the cancellation: that is how a coating\'s curve rises on either side.'
    },
    {
      title: 'Three layers by hand',
      q: 'A stack H L H on crown glass ($n_s = 1.52$) uses TiO₂ (H, 2.35) and SiO₂ (L, 1.46). Find its reflectance at the design wavelength by turning the admittance over layer by layer.',
      steps: [
        { text: 'First H, next to the glass:', tex: 'Y_1 = \\frac{2.35^2}{1.52} = 3.64' },
        { text: 'Then L:', tex: 'Y_2 = \\frac{1.46^2}{3.64} = 0.586' },
        { text: 'Then H, the outermost:', tex: 'Y_3 = \\frac{2.35^2}{0.586} = 9.42' },
        { text: 'In air:', tex: 'R = \\left(\\frac{1 - 9.42}{1 + 9.42}\\right)^2 = 0.65' }
      ],
      a: '65 % reflected with just three layers. Each added H L pair multiplies the admittance by $(n_H/n_L)^2 = 2.6$ and drives R towards 100 %.'
    }
  ],
  quiz: [
    { q: 'A layer\'s phase thickness at the design wavelength is 180°. What can be said about its effect there?', choices: ['It reflects as a mirror', 'It has no effect: it is an absentee layer', 'It cancels the reflection', 'It absorbs the light'], a: 1, why: 'A half-wave layer ($\\delta = 180°$) has the matrix −I. The light comes out exactly as if the layer were not there, at that wavelength.' },
    { q: 'In the notation $(HL)^3 H$, how many layers are there?', answer: 7, why: 'Three H–L pairs are six layers, and the extra H makes seven.' },
    { q: 'The physical thickness of a quarter-wave layer is smaller in a higher-index material.', a: true, why: '$d = \\lambda/(4n)$: for 600 nm it is 63.8 nm of TiO₂ ($n = 2.35$) but 102.7 nm of SiO₂ ($n = 1.46$).' },
    { q: 'What is the physical thickness of a quarter-wave layer of TiO₂ ($n = 2.35$) for 600 nm, in nanometres?', answer: 63.8, unit: 'nm', why: '$d = 600/(4 \\times 2.35) = 63.8$ nm.' },
    { q: 'A coating is made 1 % too thick in every layer. Its spectrum…', choices: ['is unchanged', 'shifts by about 1 % towards longer wavelengths', 'shifts by 1 % towards shorter wavelengths', 'becomes narrower'], a: 1, why: 'Phase thickness goes as $d/\\lambda$, so every feature that depended on $\\delta$ now occurs at a wavelength 1 % longer.' }
  ],
  applications: [
    'Every anti-reflection, mirror and filter design: the matrix product is the core of all thin-film software.',
    'Checking a coating before it is made, with the thickness errors the coating machine is known to make.',
    'Understanding why a filter drifts with angle and temperature: both change δ.',
    'Reverse engineering: measuring the reflectance of an unknown coating and fitting layer thicknesses to it.'
  ],
  history: 'The matrix method for stratified films was formulated by Florin Abelès in 1950. It became the everyday tool of coating designers once computers could repeat the arithmetic for dozens of layers at hundreds of wavelengths.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapters on basic theory and the characteristic matrix.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 (the section on stratified media) — the matrix theory of multilayers.',
    'P. W. Baumeister, *Optical Coating Technology* — design and computation of multilayer coatings.'
  ],
  sim: { id: 'cf-stack', params: { layers: 5 } }
}

,

/* ================================================================ dielectric mirrors */
{
  id: 'dielectric-mirrors', parent: 'coatings-and-filters', title: 'Dielectric mirrors', level: 2,
  short: 'A stack of alternating high- and low-index layers, each a quarter wave thick, reflects over 99.9 % in a band around its design wavelength and absorbs almost nothing. Each interface reflects only a few per cent, but all the reflections return in step. The width of the band is set by the ratio of the two indices; the reflectance by the number of layers.',
  keywords: ['dielectric mirror', 'quarter-wave stack', 'Bragg mirror', 'high reflector', 'HR coating', 'laser mirror', 'stop band', 'reflection band', 'bandwidth', 'index ratio', 'no absorption', 'distributed Bragg reflector', 'broadband dielectric mirror', 'chirped mirror'],
  prereq: ['multilayer-coatings', 'thin-film-interference'],
  related: ['metal-mirror-coatings', 'angle-of-incidence-and-coatings', 'dichroic-filters-and-mirrors', 'interference-filters', 'mirrors-as-components', 'the-laser-cavity', 'laser-damage-and-coating-durability', 'fabry-perot-interferometer'],
  body: `
A metal mirror gets its reflection from free electrons and loses a few per cent to heat. A **dielectric mirror** has no metal at all: it is a stack of transparent films, and it reflects because the reflections of its many interfaces add up in step.

### Why the reflections add
Alternate a high-index material H with a low-index material L, each layer a **quarter wave** thick at the design wavelength $\\lambda_0$. At every interface a little light is reflected, with amplitude $(n_H - n_L)/(n_H + n_L)$ — 0.23 for TiO₂ against SiO₂, that is 5.5 % of the intensity. The reflections from H→L and from L→H have opposite signs; but the extra round trip through a quarter-wave layer is half a wavelength, which reverses the sign again. All the reflected waves come back in phase. Because nothing is absorbed, what is not reflected is transmitted: $T = 1 - R$.

### Reflectance against layers
A stack that begins and ends with H is written $(HL)^m H$. For TiO₂ (2.35) and SiO₂ (1.46) on crown glass, at the design wavelength:

| Layers | 1 | 3 | 5 | 7 | 9 | 11 | 13 | 17 | 21 | 25 |
|---|---|---|---|---|---|---|---|---|---|---|
| Reflectance | 32 % | 65.3 % | 84.9 % | 93.9 % | 97.6 % | 99.06 % | 99.64 % | 99.946 % | 99.992 % | 99.9988 % |

Each added H–L pair multiplies the admittance by $(n_H/n_L)^2 = 2.6$, so the *transmitted* fraction falls by that factor again and again: the number of nines grows steadily with every pair. Laser mirrors are usually 99.5–99.99 %; the best ion-beam-sputtered mirrors lose only a few parts per million.

### How wide the band is
The band of high reflectance — the **stop band** — is set by the index *ratio*, not by the number of layers:

$$\\frac{\\Delta\\lambda}{\\lambda_0} \\approx \\frac{4}{\\pi}\\arcsin\\frac{n_H - n_L}{n_H + n_L}$$

For a mirror designed at 600 nm the theoretical band is:

| Materials | $n_H / n_L$ | Stop band | Pairs for 99.9 % |
|---|---|---|---|
| TiO₂ / MgF₂ | 2.35 / 1.38 | 514–721 nm | 7 |
| TiO₂ / SiO₂ | 2.35 / 1.46 | 522–706 nm | 8 |
| Ta₂O₅ / SiO₂ | 2.10 / 1.46 | 538–678 nm | 10 |
| Al₂O₃ / SiO₂ | 1.63 / 1.46 | 580–622 nm | 36 |

A high contrast gives a wide band with few layers; a low contrast a narrow band that needs dozens. Outside the band the stack passes light again, with ripples (see the simulation); it has further bands at 1/3, 1/5 … of the design wavelength.

### Angle and polarization
Tilt a mirror and the whole band moves to shorter wavelengths, and the two polarizations part: at 45° the s band widens and the p band narrows (for the 17-layer example the reflectance stays above 90 % over 463–675 nm for s but only 487–629 nm for p). A mirror used at 45° is therefore designed for 45°. See [[angle-of-incidence-and-coatings]].

### Widening the band
A single stack covers 15–35 % of its wavelength. For more, stacks of different design wavelengths are put on top of each other, or the thicknesses are *chirped* — made to increase slowly through the stack. Mirrors for femtosecond pulses are chirped on purpose, so that different colours return with different delays and the mirror also compensates dispersion.

### Compared with metal
A dielectric mirror reflects much more in its band, absorbs almost nothing, and stands far higher laser power ([[laser-damage-and-coating-durability]]). A [[metal-mirror-coatings|metal]] mirror reflects over every colour and every angle, and costs less. High-power and cavity mirrors are dielectric; general mirrors are metal.

> [!key] A quarter-wave stack $(HL)^m H$ reflects 99.9 % and more in a band whose width is set by $n_H/n_L$; each added pair multiplies the leakage by about $(n_L/n_H)^2$. It absorbs almost nothing, but works only near its design wavelength and angle.
`,
  ideas: [
    'In a quarter-wave stack the reflections from all interfaces return in phase, so a few per cent each add up to nearly 100 %.',
    'Reflectance grows with the number of layers; each H–L pair multiplies the transmitted share by about (n_L/n_H)².',
    'The width of the stop band is set by the index ratio: Δλ/λ₀ ≈ (4/π) arcsin((n_H − n_L)/(n_H + n_L)).',
    'There is almost no absorption, so a dielectric mirror survives much more laser power than a metal one.',
    'Tilting moves the band to shorter wavelengths and separates the s and p reflectances.'
  ],
  pitfalls: [
    'A dielectric mirror reflects every colour like a metal one — It reflects only the stop band, 15–35 % of its design wavelength; outside it the stack transmits, which is why such mirrors look coloured.',
    'More layers make the band wider — More layers make the reflectance higher and the band edges steeper; the width is set by the index ratio.',
    'Dielectric mirrors do not reflect at an angle — They do, but the band moves to shorter wavelengths and narrows for p; mirrors for 45° are designed for 45°.',
    'The light that is not reflected is absorbed — It is transmitted. A good dielectric mirror at 99.99 % passes 0.01 %, which is why leakage through a laser mirror can be used to monitor the beam.'
  ],
  terms: [
    { term: 'Dielectric mirror', also: ['multilayer mirror', 'Bragg mirror', 'quarter-wave stack', 'distributed Bragg reflector'], def: 'A mirror made of alternating quarter-wave layers of high and low refractive index. It reflects strongly in a band around its design wavelength and absorbs almost nothing.' },
    { term: 'Stop band', also: ['reflection band', 'high-reflectance zone'], def: 'The range of wavelengths over which a quarter-wave stack reflects strongly. Its width depends on the ratio of the two indices.' },
    { term: 'High reflector', also: ['HR coating', 'HR'], def: 'A coating specified for very high reflectance, for example R > 99.9 % at the laser wavelength and angle of incidence.' },
    { term: 'Index contrast', also: ['index ratio', 'n_H/n_L'], def: 'The ratio of the high to the low refractive index in a stack. A larger ratio gives a wider stop band with fewer layers.' },
    { term: 'Chirped mirror', def: 'A dielectric mirror in which the layer thicknesses change gradually, so that different wavelengths are reflected at different depths. Used for ultrashort pulses and for broad bands.' }
  ],
  formulas: [
    {
      name: 'Reflectance of a quarter-wave stack (HL)ᵐH on a substrate',
      expr: 'R = ((1 - (nH/nL)^(2*m)*nH^2/ns)/(1 + (nH/nL)^(2*m)*nH^2/ns))^2',
      tex: 'R = \\left(\\frac{1 - Y}{1 + Y}\\right)^2, \\quad Y = \\left(\\frac{n_H}{n_L}\\right)^{2m}\\frac{n_H^2}{n_s}',
      vars: {
        R: { name: 'reflectance at the design wavelength', q: 'ratio', unit: '%' },
        nH: { name: 'high index', value: 2.35, min: 1, max: 4.5, tex: 'n_H' },
        nL: { name: 'low index', value: 1.46, min: 1, max: 4.5, tex: 'n_L' },
        ns: { name: 'substrate index', value: 1.52, min: 1, max: 4.5, tex: 'n_s' },
        m: { name: 'number of H–L pairs (plus one H)', value: 4, min: 0, max: 40, int: true }
      },
      note: 'Light arriving from air at normal incidence; the stack begins and ends with H. m = 8 is the 17-layer mirror.',
      stories: { R: 'A stack of {m} pairs of H and L ({nH} and {nL}) and one more H is put on glass of index {ns}. What does it reflect at the design wavelength?' },
      practice: { unknowns: ['R'] }
    },
    {
      name: 'Width of the stop band',
      expr: 'w = (4/pi)*asin((nH - nL)/(nH + nL))', tex: 'w = \\frac{\\Delta\\lambda}{\\lambda_0} = \\frac{4}{\\pi}\\arcsin\\frac{n_H - n_L}{n_H + n_L}',
      vars: {
        w: { name: 'width of the band as a share of the design wavelength', q: 'ratio', unit: '%' },
        nH: { name: 'high index', value: 2.35, min: 1, max: 4.5, tex: 'n_H' },
        nL: { name: 'low index', value: 1.46, min: 1, max: 4.5, tex: 'n_L' }
      },
      note: 'The band of an infinite stack, derived in frequency; in wavelength it is good to a few per cent for contrasts like these.',
      stories: { w: 'A quarter-wave stack alternates materials of index {nH} and {nL}. How wide is its stop band, as a share of the design wavelength?' }
    }
  ],
  examples: [
    {
      title: 'The 17-layer laser mirror',
      q: 'A mirror is $(HL)^8 H$ with TiO₂ ($n_H = 2.35$) and SiO₂ ($n_L = 1.46$) on crown glass ($n_s = 1.52$). What does it reflect at the design wavelength?',
      steps: [
        { text: 'The admittance of the whole stack:', tex: 'Y = \\left(\\frac{2.35}{1.46}\\right)^{16}\\frac{2.35^2}{1.52} = 2025 \\times 3.63 = 7350' },
        { text: 'The reflectance:', tex: 'R = \\left(\\frac{1 - 7350}{1 + 7350}\\right)^2 = 0.9995' }
      ],
      a: '99.95 %: 17 layers, about 1.4 µm of coating in all. The 0.05 % that gets through is the leakage, and no more than a hundredth of it is absorbed.'
    },
    {
      title: 'Low contrast costs layers',
      q: 'How many pairs does each of two designs need to reach 99.9 %: TiO₂/SiO₂ (ratio 1.61) and Al₂O₃/SiO₂ (ratio 1.12)?',
      steps: [
        'R = 99.9 % needs $Y \\approx 4000$. For TiO₂/SiO₂, $Y = 1.61^{2m} \\times 3.63$, so $1.61^{2m} \\geq 1100$ and $m \\geq 7.4$: **8 pairs**.',
        'For Al₂O₃/SiO₂ ($n_H = 1.63$, $n_H^2/n_s = 1.75$), $Y = 1.246^{m} \\times 1.75 \\geq 4000$ needs $1.246^{m} \\geq 2285$, so $m \\geq 35.2$: **36 pairs**.'
      ],
      a: '8 pairs against 36. The low-contrast stack also has a stop band only 42 nm wide instead of 184 nm.'
    }
  ],
  quiz: [
    { q: 'What fixes the width of the high-reflectance band of a quarter-wave stack?', choices: ['The number of layers', 'The ratio of the two refractive indices', 'The thickness of the substrate', 'The angle of the light only'], a: 1, why: 'Δλ/λ₀ depends on (n_H − n_L)/(n_H + n_L). More layers raise the reflectance and sharpen the edges but leave the width unchanged.' },
    { q: 'A good dielectric mirror absorbs about 0.001 % of the light. If it reflects 99.99 %, where does the other 0.009 % go?', choices: ['Into heat', 'It is transmitted', 'It is scattered back', 'It disappears'], a: 1, why: 'With negligible absorption, $R + T = 1$. A mirror reflecting 99.99 % transmits 0.01 %, less its small absorption and scatter.' },
    { q: 'Adding one H–L pair to a stack multiplies the transmitted share by about $(n_L/n_H)^2$.', a: true, why: 'Each pair multiplies the admittance by $(n_H/n_L)^2$, and the transmitted fraction goes as $4/Y$. With TiO₂/SiO₂ the leakage falls to 0.39 of its value per pair.' },
    { q: 'By about how many nanometres is the stop band of a TiO₂/SiO₂ mirror designed at 600 nm wide? (Use $\\Delta\\lambda/\\lambda_0 = 0.30$.)', answer: 180, unit: 'nm', why: '$0.30 \\times 600 = 180$ nm; the exact limits are 522 and 706 nm, 184 nm apart.' },
    { q: 'A mirror for 45° incidence is used at 0°. What happens?', choices: ['Nothing: the angle does not matter', 'Its band is shifted to longer wavelengths than designed', 'Its band is shifted to shorter wavelengths', 'It turns into a beam splitter'], a: 1, why: 'Tilting moves the band to shorter wavelengths, so a mirror made for 45° has its band at *longer* wavelengths when used head-on — which may be missing the laser line entirely.' }
  ],
  applications: [
    'Laser cavities: the mirrors of a helium–neon or solid-state laser, 99.9–99.99 %, with a partly transmitting output coupler.',
    'Mirrors with a few parts per million of loss in ring-laser gyroscopes, cavity ring-down spectroscopy and gravitational-wave detectors.',
    'High-power laser beam delivery, where metal would melt.',
    'Dichroic mirrors, hot and cold mirrors, which are stacks reflecting one colour and passing another.',
    'Vertical-cavity surface-emitting lasers, whose mirrors are semiconductor stacks grown with the laser itself.'
  ],
  history: 'Lord Rayleigh analysed the reflection of light from a regularly stratified medium in 1917. Practical multilayer mirrors followed the vacuum deposition of films in the 1930s and 1940s, and became the standard for lasers after 1960.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapter on multilayer high reflectors and edge filters.',
    'E. Hecht, *Optics*, ch. 9 (Interference), the section on periodic multilayer films — quarter-wave stacks.',
    'A. Yariv and P. Yeh, *Optical Waves in Crystals* — periodic layered media and the stop band.'
  ],
  sim: { id: 'cf-stack', params: { layers: 17 } }
},

/* ================================================================ metal mirror coatings */
{
  id: 'metal-mirror-coatings', parent: 'coatings-and-filters', title: 'Metal mirror coatings', level: 1,
  short: 'A thin film of aluminium, silver or gold on glass makes a mirror that reflects over a wide range of wavelengths and angles. Aluminium serves from the ultraviolet to the infrared, silver is best in the visible and near infrared, gold in the infrared. A metal mirror always absorbs a few per cent of the light.',
  keywords: ['aluminium mirror', 'silver mirror', 'gold mirror', 'copper mirror', 'protected aluminium', 'enhanced aluminium', 'metal coating', 'first-surface mirror', 'reflectance', 'plasma edge', 'oxide layer', 'overcoat', 'UV mirror', 'infrared mirror', 'free electrons'],
  prereq: ['law-of-reflection', 'fresnel-reflection'],
  related: ['dielectric-mirrors', 'mirrors-as-components', 'multilayer-coatings', 'reflecting-telescopes', 'how-coatings-are-made', 'laser-damage-and-coating-durability', 'physics:reflection'],
  body: `
A metal reflects because it is full of free electrons. They cannot follow a light wave without shielding the interior of the metal from it, so the wave is reflected at the surface and penetrates only a few nanometres. A film 100 nm thick is already opaque, and a few tenths of a micrometre of metal on glass is a mirror.

### How well, and why not 100 %
A metal is described by a complex index $n + ik$ with a large imaginary part $k$. At normal incidence in air its reflectance is

$$R = \\frac{(n-1)^2 + k^2}{(n+1)^2 + k^2}$$

For aluminium at 500 nm, $n = 0.77$ and $k = 6.08$, which gives $R = 92.3$ %. The rest is absorbed, in a layer only $\\lambda/(4\\pi k) = 6.5$ nm deep, and turns into heat. A metal mirror cannot reflect more than its optical constants allow, whatever its polish.

### Which metal for which band
Reflectance of fresh films (handbook optical constants; real mirrors are a point or two lower):

| Metal | 400 nm | 550 nm | 700 nm | 1000 nm | 2000 nm |
|---|---|---|---|---|---|
| Aluminium | 92 % | 92 % | 91 % | 95 % | 98 % |
| Silver | 96 % | 98.5 % | 99.3 % | 99.7 % | 99.5 % |
| Gold | 41 % | 79 % | 97 % | 98 % | 98 % |
| Copper | 51 % | 62 % | 96 % | 97 % | 98 % |

- **Aluminium** is the all-rounder: neutral in colour and above 90 % from about 250 nm to the infrared, with one shallow dip near 800 nm (87 %). It is the mirror of telescopes and of headlamp reflectors.
- **Silver** is best from 450 nm to the infrared, but falls to about 20 % at 300 nm and tarnishes in air, so it is always protected.
- **Gold** reflects the red and infrared and absorbs the blue — hence its yellow colour. It does not tarnish, and is the standard infrared mirror.
- **Copper** is similar to gold, less costly, and is used for high-power infrared lasers.

### Protection and enhancement
Bare aluminium grows a transparent oxide a few nanometres thick within seconds and then stops. For lasting mirrors it is covered by a hard dielectric overcoat: silicon dioxide for the visible, magnesium fluoride for the ultraviolet (the Hubble Space Telescope's 2.4 m mirror is aluminium under about 25 nm of MgF₂). A half-wave overcoat leaves the metal's reflectance nearly unchanged; a pair or two of quarter-wave layers put on top of the aluminium (**enhanced aluminium**) lifts the visible reflectance to 95–98 % — in the design band only, since outside it the film loses what it gained.

### Metal against dielectric
A metal mirror works at every wavelength and almost every angle: at 45° aluminium reflects 94 % of s and 89 % of p at 550 nm, a small spread beside a dielectric stack's. It is cheap, it is the only choice for broad bands, and it works in the ultraviolet and the far infrared. But it absorbs 1–8 %: a 1 kW laser beam leaves 15 W in a silver mirror, which heats, distorts and, in time, damages it. See [[dielectric-mirrors]].

### First surface
A household mirror has its silver behind the glass, so the light crosses the glass twice and a faint ghost image comes from the glass surface. Optical mirrors are **first-surface** mirrors: the coating faces the light. They are delicate — never touch or wipe a bare metal surface ([[cleaning-and-handling-optics]]).

> [!key] A metal mirror reflects $R = ((n-1)^2 + k^2)/((n+1)^2 + k^2)$ over a wide band: aluminium 92 % from the ultraviolet to the infrared, silver 98 %+ above 450 nm, gold 97 %+ above 650 nm. The rest is absorbed and heats the mirror.
`,
  ideas: [
    'Free electrons reflect light at a metal surface; the wave penetrates only a few nanometres.',
    'R = ((n − 1)² + k²)/((n + 1)² + k²) with k large: 92 % for aluminium, 98.5 % for silver in the green.',
    'Aluminium serves from the ultraviolet to the infrared, silver from the green out, gold and copper in the red and infrared.',
    'The absorbed fraction (1 − R) becomes heat, which limits metal mirrors at high power.',
    'Overcoats protect the metal, and extra dielectric pairs enhance it over a chosen band.'
  ],
  pitfalls: [
    'A mirror reflects all the light — Even silver absorbs 1.5 % in the green, aluminium 8 %, gold 21 %. A metal mirror is a lossy reflector; a dielectric one can be far better in its band.',
    'The metal film should be thick for a better mirror — Beyond about 100 nm the film is opaque and more metal changes nothing; the reflectance is a property of the metal, not of its thickness.',
    'Gold is yellow because it is coated with something yellow — Gold absorbs blue light and reflects red and yellow: its colour comes from its band structure.',
    'Silver is the best mirror for every purpose — Silver is poor in the ultraviolet and tarnishes; aluminium is better below 400 nm and more robust.'
  ],
  terms: [
    { term: 'Complex refractive index', also: ['n + ik', 'optical constants'], def: 'The refractive index of an absorbing material as a complex number: n sets the speed of the light and k, the extinction coefficient, how fast it dies away. Metals have a large k.' },
    { term: 'Protected aluminium', def: 'An aluminium mirror coated with a hard, transparent layer (usually silicon dioxide or magnesium fluoride) that prevents scratching and corrosion.' },
    { term: 'Enhanced aluminium', also: ['enhanced Al'], def: 'Aluminium with one or two quarter-wave pairs of dielectric layers on top, which raise the reflectance in the visible from about 90 % to 95–98 %.' },
    { term: 'First-surface mirror', also: ['front-surface mirror', 'surface-coated mirror'], def: 'A mirror whose reflecting coating faces the light, so the beam never crosses the glass and there is no ghost from its front surface.' },
    { term: 'Skin depth', also: ['penetration depth'], def: 'The depth in a metal at which the light intensity falls to 1/e, λ/(4πk): a few nanometres for aluminium in the visible.' }
  ],
  formulas: [
    {
      name: 'Reflectance of a metal at normal incidence',
      expr: 'R = ((n - 1)^2 + k^2)/((n + 1)^2 + k^2)', tex: 'R = \\frac{(n-1)^2 + k^2}{(n+1)^2 + k^2}',
      vars: {
        R: { name: 'reflectance', q: 'ratio', unit: '%' },
        n: { name: 'real part of the index', value: 0.77, min: 0.01, max: 10 },
        k: { name: 'extinction coefficient', value: 6.08, min: 0.01, max: 40 }
      },
      note: 'Light arriving from air. The defaults are aluminium at 500 nm.',
      stories: { R: 'A metal has n = {n} and k = {k} at the wavelength used. What fraction of the light does it reflect?' }
    },
    {
      name: 'Power absorbed by a mirror',
      expr: 'Pa = (1 - R)*P', tex: 'P_a = (1 - R)\\,P',
      vars: {
        Pa: { name: 'power absorbed (turned into heat)', q: 'power', unit: 'W' },
        R: { name: 'reflectance', q: 'ratio', unit: '%', value: 98.5, min: 0, max: 100 },
        P: { name: 'power of the incident beam', q: 'power', unit: 'W', value: 1000 }
      },
      stories: { Pa: 'A mirror of reflectance {R} is struck by a beam of {P}. How much heat does it absorb?' }
    },
    {
      name: 'Skin depth',
      expr: 'delta = lambda/(4*pi*k)', tex: '\\delta = \\frac{\\lambda}{4\\pi k}',
      vars: {
        delta: { name: 'depth at which the intensity falls to 1/e', q: 'length', unit: 'nm', tex: '\\delta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        k: { name: 'extinction coefficient', value: 6.6, min: 0.01, max: 40 }
      },
      note: 'Aluminium has k = 6.6 at 550 nm.'
    }
  ],
  examples: [
    {
      title: 'Heat in a laser mirror',
      q: 'A 1 kW infrared beam strikes a protected silver mirror ($R = 98.5$ %) and a dielectric mirror ($R = 99.99$ %, of which 0.001 % is absorbed). How much power does each absorb?',
      steps: [
        { text: 'The silver mirror:', tex: 'P_a = (1 - 0.985) \\times 1000\\ \\mathrm{W} = 15\\ \\mathrm{W}' },
        { text: 'The dielectric mirror absorbs only its own absorption, 0.001 %:', tex: 'P_a = 10^{-5} \\times 1000\\ \\mathrm{W} = 0.01\\ \\mathrm{W}' }
      ],
      a: '15 W against 0.01 W: fifteen hundred times more heat in the metal, which needs cooling that the dielectric mirror does not.'
    },
    {
      title: 'Why a thin film is enough',
      q: 'Aluminium has $k = 6.6$ at 550 nm. How deep does the light go, and by what factor does a 100 nm film reduce the light that gets through?',
      steps: [
        { text: 'The intensity falls to 1/e in:', tex: '\\delta = \\frac{550}{4\\pi \\times 6.6} = 6.6\\ \\mathrm{nm}' },
        'Through 100 nm the intensity falls by $e^{-100/6.6} = e^{-15} \\approx 3 \\times 10^{-7}$.'
      ],
      a: 'The light penetrates 6.6 nm; a 100 nm film passes about three parts in ten million, so it is opaque.'
    }
  ],
  quiz: [
    { q: 'Which metal coating is the best choice for a mirror in the ultraviolet around 300 nm?', choices: ['Gold', 'Silver', 'Aluminium', 'Copper'], a: 2, why: 'Aluminium stays above 90 % to about 250 nm. Silver is down to about 20 % at 300 nm, gold and copper to 35–40 %.' },
    { q: 'Gold looks yellow because it…', choices: ['is coated with yellow lacquer', 'absorbs blue light and reflects red and yellow', 'emits yellow light', 'scatters yellow light'], a: 1, why: 'Its reflectance rises from 41 % at 400 nm to 97 % at 700 nm: the blue is absorbed, the red and yellow reflected.' },
    { q: 'A thicker metal film makes a better mirror once it is opaque.', a: false, why: 'The reflectance is fixed by the optical constants of the metal. Beyond about 100 nm the film is opaque and extra thickness changes nothing.' },
    { q: 'A mirror reflects 92 % of a 50 W beam. How many watts does it absorb?', answer: 4, unit: 'W', why: '$(1 - 0.92) \\times 50 = 4$ W, turned into heat in a layer a few nanometres thick.' },
    { q: 'Why are the mirrors of precision optics usually first-surface?', choices: ['They are cheaper', 'The beam does not cross the glass, so there is no ghost from the front surface', 'Glass absorbs the light', 'They reflect more'], a: 1, why: 'A second-surface mirror sends the light through the glass twice and adds a ghost from the front surface; first-surface mirrors avoid both, at the price of a delicate coating.' }
  ],
  applications: [
    'Telescope mirrors, coated with aluminium (with a protective overcoat) and re-coated every few years.',
    'Headlamp and torch reflectors, and the reflectors of many projectors.',
    'Infrared mirrors of gold for spectrometers and scientific instruments; copper mirrors for high-power infrared lasers.',
    'Household mirrors (silver behind glass), and the silvered mirrors of solar cookers and concentrators.',
    'The thermal blankets of spacecraft, whose aluminised films reflect sunlight and radiate little heat.'
  ],
  history: 'Justus von Liebig invented the chemical silvering of glass in 1835, which made good mirrors cheap, and Léon Foucault used silvered glass for telescope mirrors in the 1850s. Vacuum-evaporated aluminium was introduced for telescope mirrors by John Strong in the 1930s, and aluminium has been the astronomer\'s coating since.',
  sources: [
    'E. Hecht, *Optics*, ch. 4 (the section on reflection from metals) — the complex index and the reflectance of metals.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 13 (Optics of metals) — optical constants and reflection.',
    'G. Hass and L. Hadley, "Optical properties of metals", in the *American Institute of Physics Handbook* — reflectance curves of the mirror metals.'
  ],
  sim: 'cf-metals'
},

/* ================================================================ angle of incidence */
{
  id: 'angle-of-incidence-and-coatings', parent: 'coatings-and-filters', title: 'Angle of incidence (AOI) and coatings', level: 2,
  short: 'A coating is designed for one angle of incidence, measured from the normal. At larger angles its whole curve moves towards shorter wavelengths, by about λ₀(1 − √(1 − sin²θ/n*²)), and splits into separate curves for the two polarizations. A lens sends light in a cone of angles, so a narrow filter used at the wrong angle, or in a fast beam, misses its target.',
  keywords: ['AOI', 'angle of incidence', 'cone half angle', 'CHA', 'blue shift', 'angle shift', 'effective index', 'n*', 'tilt tuning', 's and p', 'polarization splitting', 'filter at 45 degrees', 'chief ray angle', 'CRA', 'collimated', 'wavelength shift with angle'],
  prereq: ['antireflection-coatings', 'multilayer-coatings', 'snells-law'],
  related: ['interference-filters', 'dichroic-filters-and-mirrors', 'dielectric-mirrors', 'binning-roi-and-area-of-interest', 'automated-optical-inspection', 'the-f-number', 'polarizing-beam-splitters', 'telecentricity'],
  body: `
Every coating specification carries a line like "AOI 0° ± 5°" or "AOI 45°". The **angle of incidence** is the angle between the incoming ray and the *normal* to the surface — always the normal, never the surface itself ([[snells-law]]). 0° is head-on; 45° is the usual position of beam splitters and dichroic mirrors.

> [!note] **AOI** has three meanings in this app. Here it is the *angle of incidence*. On an image sensor it is the *area of interest*, the window that is read out ([[binning-roi-and-area-of-interest]]). In manufacturing it is *automated optical inspection* ([[automated-optical-inspection]]).

### The curve moves to the blue
In a thin film the path difference between the two reflections is $2\\,n\\,d\\cos\\theta_t$, with $\\theta_t$ the angle *inside* the layer ([[thin-film-interference]]). Tilt the beam and $\\theta_t$ grows, its cosine falls, and the path difference shrinks. A quarter-wave condition, a band edge or a peak that needed a certain path difference now needs a shorter wavelength to meet it, so every feature of the spectrum slides towards the blue. To a good approximation

$$\\lambda(\\theta) = \\lambda_0\\sqrt{1 - \\frac{\\sin^2\\theta}{n_*^2}}$$

where $n_*$ is an **effective index**, between the indices of the layers: 1.8–1.9 for a TiO₂/SiO₂ band-pass filter, about 1.75 for edge filters and mirrors. It is a *blue shift*: tilting can only move the curve to shorter wavelengths. For a band-pass filter designed for 550 nm (computed):

| AOI | 0° | 10° | 20° | 30° | 40° | 50° | 60° |
|---|---|---|---|---|---|---|---|
| Peak (nm) | 550.0 | 547.6 | 540.6 | 529.7 | 516.1 | 501.4 | 487 |
| Peak transmittance | 96 % | 96 % | 96 % | 95 % | 89 % | 80 % | 72 % |

A 3 nm wide filter has moved by ten of its own widths at 30°. An edge filter at 45° moves by about 8.5 %: a 600 nm long-pass edge goes to 549 nm.

### Two polarizations
At an oblique angle the reflectance of a surface differs for s and p ([[fresnel-reflection]]), and so does the coating's. The curves split: for the long-pass filter above, the edge at 45° is at 565 nm for s and 533 nm for p, 32 nm apart. A 45° dielectric mirror reflects s over a wider band than p. A beam splitter designed for 45° can reflect 80 % of s and 48 % of p at the same wavelength — and a coating can be designed to *use* that difference ([[polarizing-beam-splitters]]).

### The cone of a lens
Light from a lens arrives in a cone. Its half-angle $\\alpha$ follows from the f-number: $\\tan\\alpha = 1/(2N)$ — 14° at f/2, 7° at f/4. A filter in a converging beam sees every angle from $\\theta - \\alpha$ to $\\theta + \\alpha$ at once, and the curve it shows is the average of them all. For the 3 nm band-pass filter in an f/2 beam: the peak transmittance falls from 96 % to 58 % and the width doubles to 6.7 nm. That is why narrow filters sit in collimated light, or are specified with a **cone half-angle (CHA)**.

### Specifying and using
- A filter without a stated angle is made for 0°; a dichroic for 45° is made for 45°. A filter used at the wrong angle is a different filter.
- **Tilt tuning**: a band-pass filter can be tuned a few per cent towards the blue by tilting it; the inverse of the formula gives the tilt for a wanted wavelength.
- In a camera the filter next to the sensor sees the *chief ray angle*; an infrared-cut edge near 650 nm moves some 27 nm at 30°, which tints the corners of the picture. Telecentric designs keep the angle constant ([[telecentricity]]).
- Anti-reflection coatings also degrade with angle: a broadband coating averaging 0.11 % at 0° gives 0.75 % at 45° and 3.7 % at 60°.

> [!key] AOI is the angle between the ray and the normal. A coating's curve moves to shorter wavelengths as $\\lambda_0\\sqrt{1 - \\sin^2\\theta/n_*^2}$, splits into s and p, and in a fast beam is averaged over the whole cone. A filter specified at 0° fails at 45°.
`,
  ideas: [
    'AOI is measured from the normal to the surface; 0° is head-on.',
    'A coating\'s curve moves to shorter wavelengths with angle: λ(θ) = λ₀ √(1 − sin²θ/n*²), with n* an effective index of about 1.7–1.9.',
    'The s and p polarizations shift by different amounts, so the curve splits in two.',
    'A lens delivers a cone of half-angle α with tan α = 1/(2N); a filter in it averages over all angles, which lowers and widens a narrow peak.',
    'A filter must be used at the angle it was made for; narrow filters belong in collimated light.'
  ],
  pitfalls: [
    'AOI is measured from the surface — It is measured from the normal. A ray grazing the glass has an AOI near 90°.',
    'Tilting a filter can shift its wavelength either way — The shift is always towards shorter wavelengths (the blue); the normal incidence is the longest wavelength the filter ever passes.',
    'A filter works the same at any angle — A 550 nm band-pass filter passes 509 nm at 45°, and its peak is no longer where the laser is.',
    'An f/2 lens is the same as a collimated beam to a filter — It is a cone of ±14°. For a narrow filter that halves the peak transmittance and doubles the bandwidth.'
  ],
  terms: [
    { term: 'Angle of incidence', also: ['AOI'], def: 'The angle between an incoming ray and the normal to the surface. In coating specifications it is the angle at which the coating is designed to work, e.g. 0° or 45°.' },
    { term: 'Cone half-angle', also: ['CHA', 'half cone angle'], def: 'Half the full angle of the cone of light that reaches a filter. For a lens it follows from the f-number: tan α = 1/(2N).' },
    { term: 'Effective index', also: ['n*', 'effective refractive index'], def: 'The single index that makes λ(θ) = λ₀√(1 − sin²θ/n*²) describe how a filter shifts with angle. It lies between the indices of its layers.' },
    { term: 'Blue shift', also: ['angle shift', 'wavelength shift with angle'], def: 'The movement of a coating\'s spectral features towards shorter wavelengths as the angle of incidence grows.' },
    { term: 'Chief ray angle', also: ['CRA'], def: 'The angle at which the central ray of a beam arrives at a surface; for a sensor, the angle at which light from the lens meets the filter, microlenses and pixels at that point of the field.' },
    { term: 's and p polarization', def: 'The two polarizations of oblique light: s (from German senkrecht) is perpendicular to the plane of incidence, p parallel to it. Coatings treat them differently at angles.' }
  ],
  formulas: [
    {
      name: 'Wavelength of a filter feature at angle θ',
      expr: 'lt = l0*sqrt(1 - sin(theta)^2/ns^2)', tex: '\\lambda_\\theta = \\lambda_0\\sqrt{1 - \\frac{\\sin^2\\theta}{n_*^2}}',
      vars: {
        lt: { name: 'wavelength of the feature at the angle θ', q: 'length', unit: 'nm', tex: '\\lambda_\\theta' },
        l0: { name: 'wavelength at normal incidence', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_0' },
        theta: { name: 'angle of incidence', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\theta' },
        ns: { name: 'effective index n*', value: 1.86, min: 1.01, max: 4, tex: 'n_*' }
      },
      note: 'The peak of the band-pass filter in the simulation has n* = 1.86; edge filters and mirrors about 1.75.',
      stories: { lt: 'A band-pass filter with its peak at {l0} at normal incidence (effective index {ns}) is tilted to {theta}. Where is its peak now?', theta: 'A filter peaks at {l0} head-on and must pass {lt}. At what angle must it be tilted (effective index {ns})?' }
    },
    {
      name: 'Cone half-angle of a lens',
      expr: 'alpha = atan(1/(2*N))', tex: '\\alpha = \\arctan\\frac{1}{2N}',
      vars: {
        alpha: { name: 'half-angle of the cone', q: 'angle', unit: '°', tex: '\\alpha' },
        N: { name: 'f-number', value: 2, min: 0.5, max: 64 }
      },
      note: 'For a lens focused at infinity.',
      stories: { alpha: 'A filter sits in the converging beam of an f/{N} lens. What is the half-angle of the cone?', N: 'A filter must see a cone no wider than {alpha}. What f-number does that allow?' }
    },
    {
      name: 'Shift of an edge or peak with angle',
      expr: 'sh = l0*(1 - sqrt(1 - sin(theta)^2/ns^2))', tex: '\\Delta\\lambda = \\lambda_0\\left(1 - \\sqrt{1 - \\frac{\\sin^2\\theta}{n_*^2}}\\right)',
      vars: {
        sh: { name: 'shift towards the blue', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        l0: { name: 'wavelength at normal incidence', q: 'length', unit: 'nm', value: 650, tex: '\\lambda_0' },
        theta: { name: 'angle of incidence', q: 'angle', unit: '°', value: 30, min: 0, max: 80, tex: '\\theta' },
        ns: { name: 'effective index n*', value: 1.75, min: 1.01, max: 4, tex: 'n_*' }
      },
      stories: { sh: 'An infrared-cut filter has its edge at {l0} head-on (effective index {ns}). How far does the edge move at {theta}?' }
    }
  ],
  examples: [
    {
      title: 'A narrow filter in a fast lens',
      q: 'A 550 nm band-pass filter with a width of 3 nm ($n_* = 1.86$) is placed in the converging beam of an f/2 lens. What is the half-angle of the cone, and where does the peak move for rays at its edge?',
      steps: [
        { text: 'The half-angle:', tex: '\\alpha = \\arctan\\frac{1}{2 \\times 2} = 14.0°' },
        { text: 'The peak for a ray at 14°:', tex: '\\lambda = 550\\sqrt{1 - \\frac{\\sin^2 14°}{1.86^2}} = 550 \\times 0.9915 = 545.3\\ \\mathrm{nm}' }
      ],
      a: '14°, and the edge rays see a peak at 545.3 nm, 4.7 nm from the 550 nm line — more than the width of the filter. The averaged filter passes 58 % instead of 96 %, with twice the width.'
    },
    {
      title: 'Tuning by tilting',
      q: 'A band-pass filter peaks at 550 nm head-on ($n_* = 1.86$). At what angle will it pass a line at 530 nm?',
      steps: [
        { text: 'Invert the formula:', tex: '\\sin\\theta = n_*\\sqrt{1 - (\\lambda/\\lambda_0)^2} = 1.86\\sqrt{1 - (530/550)^2} = 0.50' },
        'The angle is $\\theta = 30°$.'
      ],
      a: '30°. At that tilt the peak transmittance is still 95 %, but only a few per cent of the design wavelength can be reached this way.'
    }
  ],
  quiz: [
    { q: 'A filter is made for 550 nm at normal incidence and tilted by 25°. Its peak moves…', choices: ['to a longer wavelength', 'to a shorter wavelength', 'it stays where it is', 'in either direction, depending on the polarization'], a: 1, why: 'The factor cosθ inside the layers only shortens the path difference, so every feature of the curve moves towards the blue.' },
    { q: 'What is the half-angle of the cone of light of an f/1 lens, in degrees? Use $\\tan\\alpha = 1/(2N)$.', answer: 26.6, unit: '°', why: '$\\alpha = \\arctan(1/2) = 26.6°$. Even f/2 is ±14°; narrow filters are not used in such beams.' },
    { q: 'The s and p polarizations see the same coating curve at 45°.', a: false, why: 'At oblique incidence the effective admittances of the layers differ for s and p, so the curves part: an edge filter\'s edge is some 30 nm apart for the two at 45°.' },
    { q: 'A band-pass filter peaks at 550 nm head-on ($n_* = 1.86$). At 20° it peaks at about… (nm)', answer: 540.6, unit: 'nm', why: '$550\\sqrt{1 - \\sin^2 20°/1.86^2} = 550 \\times 0.983 = 540.6$ nm.' },
    { q: 'A manufacturer says "AOI 45° ± 2°". The filter was designed…', choices: ['for normal incidence', 'for a tilt of 45° from the normal and tolerates a spread of two degrees', 'for an area of interest of 45 pixels', 'for any angle'], a: 1, why: 'The AOI is measured from the normal. A dichroic for 45° is tested and guaranteed in a beam within ±2° of that tilt.' }
  ],
  applications: [
    'Fluorescence microscopes, where the dichroic filter works at 45° and the band-pass filters at 0° in an almost collimated beam.',
    'Camera infrared-cut filters, whose edge shifts across the sensor with the chief ray angle and tints the corners.',
    'Laser line filters, tuned slightly to the blue of the laser by tilting.',
    'Laser mirrors and beam splitters, specified for 0° or for 45° and sold separately for each.',
    'Telecentric lenses, which present a constant angle to a filter or a sensor across the field.'
  ],
  history: 'The shift of interference colours with angle is as old as the study of soap films and Newton\'s rings. For coatings it became a practical concern as narrow-band filters came into use in astronomy and spectroscopy in the middle of the twentieth century, and filter makers now quote the angle behaviour in every datasheet.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the sections on oblique incidence and polarization splitting.',
    'E. Hecht, *Optics*, ch. 9 (Interference), the section on the Fabry–Perot interferometer — the angular dependence of its fringes.',
    'W. J. Smith, *Modern Optical Engineering* — the cone of rays and the f-number at the filter.'
  ],
  sim: 'cf-aoi'
}

,

/* ================================================================ interference filters */
{
  id: 'interference-filters', parent: 'coatings-and-filters', title: 'Interference filters: band-pass, edge, notch', level: 2,
  short: 'An interference filter is a stack of thin films that passes some wavelengths and reflects the rest. A band-pass filter is a Fabry–Perot cavity: two mirror stacks around a half-wave spacer. Edge filters pass everything on one side of a wavelength, notch filters block a narrow band. They are specified by their centre wavelength, width, peak transmittance and the optical density of their blocking.',
  keywords: ['interference filter', 'band-pass', 'bandpass', 'long-pass', 'short-pass', 'edge filter', 'notch filter', 'laser line filter', 'centre wavelength', 'CWL', 'FWHM', 'bandwidth', 'blocking', 'optical density', 'OD', 'cut-on', 'cut-off', 'cavity', 'hard coated', 'filter specification'],
  prereq: ['multilayer-coatings', 'dielectric-mirrors'],
  related: ['angle-of-incidence-and-coatings', 'dichroic-filters-and-mirrors', 'coloured-glass-filters', 'neutral-density-and-optical-density', 'fabry-perot-interferometer', 'machine-vision-lighting', 'spectrometers-and-monochromators', 'how-coatings-are-made'],
  body: `
A filter that selects a colour can absorb the rest, as coloured glass does, or **reflect** it. An interference filter does the second: layers a few hundred nanometres thick are chosen so that the waves reflected inside the stack cancel at the wavelengths wanted and add up at all others. Nothing is absorbed, the filter stays cool, and its edges can be steep. There are three families.

### Band-pass: a cavity between mirrors
Take two [[dielectric-mirrors|quarter-wave mirrors]] and separate them by a **spacer** exactly a half wave thick. Light of the design wavelength is in step with itself inside the spacer, so it passes; any other is reflected. It is a [[fabry-perot-interferometer|Fabry–Perot cavity]] in a film, written $(HL)^m\\,2H\\,(LH)^m$. The more layers in each mirror, the sharper the resonance. For TiO₂ and SiO₂ at 550 nm (computed):

| Pairs per mirror $m$ | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| Layers | 9 | 13 | 17 | 21 | 25 |
| Width (FWHM) | 25 nm | 8.6 nm | 3.2 nm | 1.2 nm | 0.4 nm |

The ratio $Q = \\lambda/\\Delta\\lambda$ is 170 for the 3.2 nm filter. Real filters use two to five cavities one after another, with 50 to over 150 layers, to get a flat top and steep sides.

### What a data sheet says
| Term | Meaning |
|---|---|
| **CWL** | centre wavelength of the pass band |
| **FWHM** | bandwidth between the half-maximum points |
| **Peak transmittance** | typically 85–95 % for hard-coated filters |
| **Blocking** | the optical density (OD 4 = 0.01 %, OD 6 = 0.0001 %) over a stated range of wavelengths |
| **AOI, CHA** | the angle and the cone half-angle the numbers are valid for ([[angle-of-incidence-and-coatings]]) |

### Blocking is a separate job
A single stack stops light only over the width of its high-reflectance zone, about a third of its wavelength. The simple filter of the simulation blocks to OD 2–3 beside the pass band, but at 450 nm it passes 62 % and at 444 nm almost all: the mirrors have stopped working. Real filters add more stacks centred elsewhere, or a piece of absorbing [[coloured-glass-filters|coloured glass]], to block to OD 4–6 from the ultraviolet to the infrared.

Loss matters, too. A cavity with mirrors of reflectance $R$ and a loss $A$ (absorption plus scatter) per mirror transmits at its peak only

$$T_{\\mathrm{peak}} = \\left(\\frac{1 - R - A}{1 - R}\\right)^2$$

With $R = 99$ % and $A = 0.5$ % that is 25 %: the narrower the filter, the better the layers must be.

### Edge filters
A **long-pass** filter passes the long wavelengths and blocks the short ones, a **short-pass** filter the opposite; the *edge* is where the transmittance crosses 50 %. A quarter-wave stack of TiO₂ and SiO₂ makes an edge that rises from 10 % to 50 % in about 11 nm (long-pass) or 7 nm (short-pass), with 97 % in the pass band and a stop band 130 to 190 nm wide for an edge at 600 nm; beyond it, the transmittance returns, so real edge filters stack several. Long-pass filters block the laser in fluorescence and Raman instruments; short-pass filters cut the infrared in cameras.

### Notch filters
A **notch** filter blocks a narrow band and passes the rest. A stack of materials of low contrast (Al₂O₃ and SiO₂) has a stop band only about 50 nm wide; the depth grows with the number of layers: OD 2 for 49 layers, OD 3.5 for 81. Notch filters remove a laser line from the spectrum in Raman spectroscopy and, as eyewear, from a view.

> [!key] An interference filter is a stack that reflects what it does not pass. A band-pass filter is a cavity of two mirrors around a half-wave spacer, narrower the more layers it has; its peak transmittance falls with the layer losses. A single stack blocks only near its band, so real filters add blocking.
`,
  ideas: [
    'An interference filter reflects the light it does not pass; it absorbs almost nothing and stays cool.',
    'A band-pass filter is a Fabry–Perot cavity: two quarter-wave mirrors around a half-wave spacer.',
    'More layers in the mirrors make the pass band narrower; Q = λ/Δλ.',
    'A single stack blocks only a band about a third of its wavelength wide; blocking elsewhere is added with more stacks or absorbing glass.',
    'Losses in the layers cut the peak transmittance: T = ((1 − R − A)/(1 − R))².'
  ],
  pitfalls: [
    'A filter specified at OD 6 blocks everywhere — The blocking range is stated: typically from the ultraviolet to a certain wavelength in the infrared. Beyond it, the transmittance may return.',
    'A narrower filter is always better — A narrower filter has a lower peak transmittance, is more sensitive to angle and temperature, and is dearer. Choose the width the job needs.',
    'The 50 % points define a filter — The edges of a good filter are far steeper than its FWHM suggests: the 10 % width is about 3 times the FWHM here, and flat-topped multi-cavity filters do better.',
    'Interference filters, like coloured glass, absorb what they do not pass — They reflect it. A filter in front of a bright source sends that light back where it may do harm.'
  ],
  terms: [
    { term: 'Band-pass filter', also: ['bandpass filter', 'BP'], def: 'A filter that passes a band of wavelengths around a centre wavelength and blocks the rest.' },
    { term: 'Centre wavelength', also: ['CWL', 'central wavelength'], def: 'The wavelength at the middle of the pass band of a band-pass filter.' },
    { term: 'Full width at half maximum', also: ['FWHM', 'bandwidth', 'bandpass width'], def: 'The width of the pass band between the two points at which the transmittance is half its peak value.' },
    { term: 'Blocking', also: ['out-of-band rejection', 'rejection'], def: 'How strongly a filter stops the wavelengths it should not pass, given as optical density (OD 4 = 10⁻⁴ transmittance) over a stated range.' },
    { term: 'Long-pass filter', also: ['LP', 'cut-on filter', 'edge filter'], def: 'A filter that blocks wavelengths shorter than its edge and passes longer ones.' },
    { term: 'Short-pass filter', also: ['SP', 'cut-off filter'], def: 'A filter that passes wavelengths shorter than its edge and blocks longer ones.' },
    { term: 'Notch filter', also: ['band-stop filter', 'band-rejection filter'], def: 'A filter that blocks a narrow band of wavelengths and passes everything else.' }
  ],
  formulas: [
    {
      name: 'Quality factor of a filter',
      expr: 'Q = lambda/dl', tex: 'Q = \\frac{\\lambda_0}{\\Delta\\lambda}',
      vars: {
        Q: { name: 'quality factor (selectivity)' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_0' },
        dl: { name: 'width (FWHM)', q: 'length', unit: 'nm', value: 3.2, tex: '\\Delta\\lambda' }
      },
      stories: { Q: 'A band-pass filter is centred at {lambda} and is {dl} wide. What is its quality factor?', dl: 'A filter centred at {lambda} must have a quality factor of {Q}. How wide is it?' }
    },
    {
      name: 'Peak transmittance of a lossy cavity',
      expr: 'Tp = ((1 - R - A)/(1 - R))^2', tex: 'T_{\\mathrm{peak}} = \\left(\\frac{1 - R - A}{1 - R}\\right)^2',
      vars: {
        Tp: { name: 'transmittance at the peak', q: 'ratio', unit: '%', tex: 'T_{\\mathrm{peak}}' },
        R: { name: 'reflectance of each mirror', q: 'ratio', unit: '%', value: 99, min: 50, max: 99.99 },
        A: { name: 'loss (absorption and scatter) of each mirror', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 5 }
      },
      note: 'Two equal mirrors; A < 1 − R.',
      stories: { Tp: 'A cavity has mirrors of reflectance {R}, each losing {A} to absorption and scatter. What does it transmit at its peak?' }
    },
    {
      name: 'Width of the pass band of a cavity (estimate)',
      expr: 'dl = lambda*(1 - R)/(pi*m*sqrt(R))', tex: '\\Delta\\lambda \\approx \\frac{\\lambda_0\\,(1 - R)}{\\pi\\, m \\sqrt{R}}',
      vars: {
        dl: { name: 'width of the pass band (FWHM)', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_0' },
        R: { name: 'reflectance of each mirror', q: 'ratio', unit: '%', value: 98, min: 50, max: 99.99 },
        m: { name: 'order: half waves in the spacer', value: 1, min: 1, max: 20, int: true }
      },
      note: 'A textbook estimate for high-reflectance mirrors; the mirrors of a film filter are not quite uniform, so the real width of a computed stack differs by tens of per cent.',
      stories: { dl: 'A cavity at {lambda} has mirrors of reflectance {R} and a spacer of {m} half waves. How wide is its pass band?' }
    }
  ],
  examples: [
    {
      title: 'Why narrow filters are lossy',
      q: 'A narrow cavity has mirrors of reflectance 99 %. Each mirror loses 0.5 % to absorption and scatter. What does the filter pass at its peak? What if the loss is cut to 0.1 %?',
      steps: [
        { text: 'With 0.5 % loss:', tex: 'T = \\left(\\frac{1 - 0.99 - 0.005}{1 - 0.99}\\right)^2 = (0.5)^2 = 0.25' },
        { text: 'With 0.1 % loss:', tex: 'T = \\left(\\frac{0.01 - 0.001}{0.01}\\right)^2 = 0.81' }
      ],
      a: '25 % and 81 %. The lower the loss of the layers, the more of the light the filter passes: the quality of the coating process decides the peak transmittance.'
    },
    {
      title: 'Ambient light behind a red LED',
      q: 'A vision system lights a part with a red LED line at 630 nm and puts a band-pass filter on the camera. Take the ambient light as flat across 400–700 nm. How much of it gets through a filter 10 nm wide, and through one 40 nm wide? (Each passes 90 % of the LED line.)',
      steps: [
        { text: 'A filter passes a share of a flat spectrum equal to its width over the band:', tex: '\\frac{10}{300} \\times 0.9 = 3\\ \\%, \\qquad \\frac{40}{300} \\times 0.9 = 12\\ \\%' }
      ],
      a: '3 % with the 10 nm filter and 12 % with the 40 nm one, while the LED line passes in full: the narrow filter improves the contrast four times. A tilt or a cone of the beam moves the peak, so the filter must be wide enough to keep the line.'
    }
  ],
  quiz: [
    { q: 'What is the central part of a band-pass interference filter?', choices: ['A layer of coloured glass', 'A half-wave spacer between two mirror stacks', 'A polarizer', 'A single quarter-wave layer'], a: 1, why: 'Two quarter-wave mirrors with a spacer a half wave thick form a Fabry–Perot cavity, which transmits only the wavelengths that fit it.' },
    { q: 'A filter has a centre wavelength of 532 nm and a width of 1 nm. Its quality factor is about…', choices: ['5', '53', '530', '5300'], a: 2, why: '$Q = \\lambda_0/\\Delta\\lambda = 532/1 = 532$.' },
    { q: 'Adding more layers to the mirrors of a cavity makes its pass band narrower.', a: true, why: 'Higher mirror reflectance means a sharper resonance: for the computed example the width falls from 25 nm to 0.4 nm as the pairs go from 2 to 6.' },
    { q: 'A cavity has mirrors of reflectance 98 % and a loss of 0.5 % per mirror. What is its peak transmittance, in per cent?', answer: 56.3, unit: '%', why: '$T = ((1 - 0.98 - 0.005)/(1 - 0.98))^2 = (0.75)^2 = 0.5625$.' },
    { q: 'A band-pass filter is "OD 6, 200–1100 nm". At 1200 nm it…', choices: ['still blocks to OD 6', 'may transmit light again: the blocking range ends at 1100 nm', 'blocks completely', 'turns into a long-pass filter'], a: 1, why: 'The blocking is only specified over the stated range; outside it a stack of finite width and the substrate\'s behaviour decide, and the transmittance can return.' }
  ],
  applications: [
    'Laser-line filters in microscopes, spectrometers and Raman instruments.',
    'Band-pass filters in machine vision that keep the light of the system\'s own LED and discard ambient light.',
    'Infrared-cut filters in front of camera sensors and long-pass emission filters in fluorescence microscopes.',
    'Astronomy: narrow-band filters isolating hydrogen-alpha, oxygen and sulphur lines through city light.',
    'Telecommunications: filters that separate the wavelength channels of a fibre link.'
  ],
  history: 'The interference filter grew from the Fabry–Perot etalon of 1897 and the vacuum-deposited films of the 1930s. All-dielectric band-pass filters were made in the 1940s and 1950s, and the multi-cavity design with flat tops and steep sides, aided by computers, followed from the 1960s.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapters on edge filters and on band-pass filters.',
    'E. Hecht, *Optics*, ch. 9 (Interference), the sections on the Fabry–Perot interferometer and on dielectric films.',
    'J. A. Dobrowolski, "Coatings and filters", in *Handbook of Optics* (ed. M. Bass) — filter types and specifications.'
  ],
  sim: 'cf-filters'
},

/* ================================================================ dichroic filters and mirrors */
{
  id: 'dichroic-filters-and-mirrors', parent: 'coatings-and-filters', title: 'Dichroic filters, hot and cold mirrors', level: 2,
  short: 'A dichroic mirror is an edge filter used on a tilted plate, typically at 45°: it passes the colours on one side of its edge and reflects those on the other, with almost no loss. Used to split light by colour, as hot and cold mirrors to separate heat from light, and as the beam splitter of a fluorescence filter cube.',
  keywords: ['dichroic', 'dichroic mirror', 'dichroic filter', 'colour splitter', 'hot mirror', 'cold mirror', 'filter cube', 'fluorescence filter set', 'excitation filter', 'emission filter', 'barrier filter', 'dichroic beam splitter', 'cut-on', 'Stokes shift', 'three-chip camera', 'X-cube', 'infrared reflecting'],
  prereq: ['interference-filters', 'angle-of-incidence-and-coatings'],
  related: ['dielectric-mirrors', 'fluorescence-and-confocal-microscopy', 'beam-splitters', 'polarizing-beam-splitters', 'the-data-projector', 'laser-eye-hazards-and-eyewear', 'physics:color-mixing'],
  body: `
"Dichroic" means "two-coloured": a **dichroic mirror** sends some colours one way and the rest the other, and in doing so it sorts light by wavelength rather than by amount or polarization. It is nothing but a [[interference-filters|long-pass or short-pass edge filter]] on a plate tilted to 45°. What it does not pass it *reflects*, so the beam it turns is as bright as the beam it lets through, with losses of a few per cent at most. (Not to be confused with *dichroic polarizers* that absorb one polarization, or with decorative dichroic glass.)

### The colour splitter
Set the edge of a long-pass dichroic at 560 nm. Daylight arrives at 45°: the red, orange and yellow-green pass straight on, and the blue, cyan and green are reflected at 90°. Slide the edge and the two colours trade places. Three dichroic coatings in sequence, or on the faces of a prism block, split a picture into red, green and blue for a three-sensor camera and put the three colours back together in some data projectors. Theatre lamps use dichroic filters for saturated colours that do not fade, since the rejected light is reflected rather than absorbed.

### Edge at 45°
A dichroic is made for its angle and its edge is quoted there ("cut-on 495 nm at 45°"). Away from 0° the edge moves towards the blue ([[angle-of-incidence-and-coatings]]) and splits into an s and a p edge about 30 nm apart at 45°; the plate's real edge is the middle of the two. Because it is made for 45° ± a few degrees, a tilt error of 1° moves it by about 1.7 nm.

### Hot and cold mirrors
Hot and cold mirrors split visible light from the invisible infrared that carries the heat:
- A **hot mirror** passes the visible and reflects the infrared above about 700 nm. It goes in front of projector panels and film, in medical lights and in cameras, to stop the heat.
- A **cold mirror** is the opposite: it reflects the visible (about 400–700 nm) and lets the infrared pass through. It is the reflector of the "cool-beam" halogen lamp, whose filament radiates only some 10 % of its power as visible light: the beam leaves almost free of heat, and the infrared leaves by the back of the lamp.

A single quarter-wave stack covers only about a third of its wavelength (the simulation shows it). Real hot and cold mirrors stack several to cover 400–1100 nm.

### The fluorescence filter cube
A fluorescence microscope sends blue light on a specimen and looks at the green light it gives back — which is a thousand to a million times fainter. A **filter cube** has three parts:
1. The **excitation filter** passes only the wavelengths that excite the dye, e.g. 470/40 nm (centre/width: 450–490 nm).
2. The **dichroic** reflects the excitation light (below its 495 nm edge) to the specimen and passes the fluorescence, which comes back at longer wavelengths — the **Stokes shift** — through it.
3. The **emission filter** passes the fluorescence, e.g. 525/50 nm (500–550 nm), and blocks the excitation light that scatters back.

Fluorescein absorbs best at 494 nm and emits at 521 nm: a Stokes shift of 27 nm, which is why the edges of the three parts must sit within a few nanometres of each other. The excitation light that leaks through must be blocked by OD 6 or more. The simple stacks of the simulation reach only about OD 2; real cubes are made with many more layers.

> [!key] A dichroic mirror is an edge filter at 45°: it passes one side of its edge and reflects the other, with almost no loss. Hot and cold mirrors split heat from light; a filter cube pairs a dichroic with excitation and emission filters. At 45° the edge is quoted for that angle and moves 1.7 nm per degree of tilt.
`,
  ideas: [
    'A dichroic mirror is an edge filter on a plate at 45°: it passes one side of its edge and reflects the other.',
    'Nothing is absorbed, so both beams are bright: dichroics split light by colour with a few per cent loss.',
    'The edge is specified at the angle of use, and it moves about 1.7 nm per degree of tilt.',
    'A hot mirror reflects the infrared and passes the visible; a cold mirror does the reverse.',
    'A fluorescence filter cube is an excitation filter, a dichroic and an emission filter, matched across the Stokes shift.'
  ],
  pitfalls: [
    'A dichroic is a colour filter that absorbs the rest — It reflects the rest. Both beams carry real light, which is the point of a colour splitter.',
    'A dichroic works at any angle — Its edge is set for one angle (usually 45°) and drifts with tilt. Used at 0° it is a different filter.',
    'Hot mirror and cold mirror are two names for the same thing — A hot mirror reflects the infrared (the hot part) and passes the light; a cold mirror reflects the light and passes the infrared.',
    'The emission filter is not needed once there is a dichroic — The dichroic reflects only part of the excitation light back; the emission filter removes what leaks through, which must be down to a millionth of it.'
  ],
  terms: [
    { term: 'Dichroic mirror', also: ['dichroic filter', 'dichroic beam splitter'], def: 'An edge filter made of thin-film layers on a plate, used at an angle (usually 45°): it passes the colours on one side of its edge and reflects those on the other.' },
    { term: 'Hot mirror', def: 'A dichroic that reflects the infrared and transmits the visible light, used to keep heat away from lamps\' targets, sensors and film.' },
    { term: 'Cold mirror', def: 'A dichroic that reflects the visible light and transmits the infrared. Used as the reflector of a lamp so that the beam carries little heat.' },
    { term: 'Filter cube', also: ['filter set', 'fluorescence filter set'], def: 'The unit of a fluorescence microscope that holds an excitation filter, a dichroic beam splitter and an emission filter.' },
    { term: 'Stokes shift', def: 'The difference in wavelength between the light a fluorescent dye absorbs most strongly and the light it emits most strongly: the emission is always at the longer wavelength.' },
    { term: 'Emission filter', also: ['barrier filter'], def: 'The filter in front of the detector of a fluorescence instrument that passes the fluorescence and blocks the excitation light.' },
    { term: 'Cut-on wavelength', also: ['edge wavelength'], def: 'The wavelength at which a long-pass filter or dichroic reaches 50 % transmittance, quoted for a stated angle.' }
  ],
  formulas: [
    {
      name: 'Edge of a filter made for 0° when used at 45°',
      expr: 'l45 = l0*sqrt(1 - 0.5/ns^2)', tex: '\\lambda_{45} = \\lambda_0\\sqrt{1 - \\frac{0.5}{n_*^2}}',
      vars: {
        l45: { name: 'edge at 45°', q: 'length', unit: 'nm', tex: '\\lambda_{45}' },
        l0: { name: 'edge at 0°', q: 'length', unit: 'nm', value: 600, tex: '\\lambda_0' },
        ns: { name: 'effective index n*', value: 1.75, min: 1.01, max: 4, tex: 'n_*' }
      },
      note: 'sin²45° = 0.5. A dichroic is made so that this edge falls on its nominal wavelength.',
      stories: { l45: 'A long-pass edge is at {l0} at normal incidence (effective index {ns}). Where is it at 45°?' }
    },
    {
      name: 'Stokes shift',
      expr: 'ds = lem - lex', tex: '\\Delta\\lambda_S = \\lambda_{\\mathrm{em}} - \\lambda_{\\mathrm{ex}}',
      vars: {
        ds: { name: 'Stokes shift', q: 'length', unit: 'nm', tex: '\\Delta\\lambda_S' },
        lem: { name: 'wavelength of peak emission', q: 'length', unit: 'nm', value: 521, tex: '\\lambda_{\\mathrm{em}}' },
        lex: { name: 'wavelength of peak excitation', q: 'length', unit: 'nm', value: 494, tex: '\\lambda_{\\mathrm{ex}}' }
      },
      note: 'Fluorescein, as in the standard green filter cube.'
    },
    {
      name: 'Fraction of the fluorescence that reaches the eye',
      expr: 'eta = Td*Tem', tex: '\\eta = T_d\\,T_{\\mathrm{em}}',
      vars: {
        eta: { name: 'share of the emitted light that is detected', q: 'ratio', unit: '%', tex: '\\eta' },
        Td: { name: 'transmittance of the dichroic at the emission wavelength', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: 'T_d' },
        Tem: { name: 'transmittance of the emission filter', q: 'ratio', unit: '%', value: 92, min: 0, max: 100, tex: 'T_{\\mathrm{em}}' }
      },
      note: 'Losses in the microscope objective and the rest of the optics come on top.'
    }
  ],
  examples: [
    {
      title: 'Where a 45° dichroic sits',
      q: 'A long-pass dichroic is made to have its edge at 495 nm at 45°. If the effective index is 1.75, where is its edge for light arriving at 0°?',
      steps: [
        { text: 'Invert the relation $\\lambda_{45} = \\lambda_0\\sqrt{1 - 0.5/n_*^2}$:', tex: '\\lambda_0 = \\frac{495}{\\sqrt{1 - 0.5/1.75^2}} = \\frac{495}{0.915} = 541\\ \\mathrm{nm}' }
      ],
      a: '541 nm. Used head-on the same plate would cut on at 541 nm, 46 nm to the red: that is why the quoted angle matters.'
    },
    {
      title: 'The margins of a green fluorescence cube',
      q: 'A cube has excitation 450–490 nm, a dichroic edge at 495 nm and an emission filter passing 500–550 nm. The edge moves by 1.7 nm per degree of tilt. How far may the dichroic be tilted from 45° before its edge reaches either band?',
      steps: [
        'Towards the blue the edge can move down from 495 to 490 nm, the end of the excitation band: 5 nm, which is $5/1.7 \\approx 3°$ of extra tilt.',
        'Towards the red it can move up to 500 nm, the start of the emission band: again 5 nm, about 3° less tilt.'
      ],
      a: 'About ±3°. Beyond that the dichroic starts to pass excitation light or to reflect fluorescence. Filter cubes are therefore made as rigid, pre-aligned units.'
    }
  ],
  quiz: [
    { q: 'A cold mirror in a lamp reflects…', choices: ['the infrared and passes the visible', 'the visible and passes the infrared', 'only blue light', 'nothing: it absorbs the heat'], a: 1, why: 'The visible light is reflected forward into the beam and the infrared passes through the mirror and leaves by the back of the lamp: a beam with little heat.' },
    { q: 'A dichroic mirror absorbs the light that it does not pass.', a: false, why: 'It reflects it. Both beams — the transmitted and the reflected — carry real light; only a few per cent are lost.' },
    { q: 'In the filter cube for fluorescein the emission filter passes 500–550 nm and the excitation is at 450–490 nm. What is the job of the emission filter?', choices: ['To excite the dye', 'To block the excitation light that reaches the detector, and pass the fluorescence', 'To split the beam in two', 'To polarize the light'], a: 1, why: 'The fluorescence is far fainter than the excitation light, a thousand to a million times. The dichroic reflects most excitation light, but the little that leaks through would swamp the picture without the emission filter.' },
    { q: 'A dye absorbs best at 494 nm and emits best at 521 nm. What is its Stokes shift in nanometres?', answer: 27, unit: 'nm', why: '$521 - 494 = 27$ nm. Emission is always at a longer wavelength than the absorption that caused it.' },
    { q: 'A dichroic made for 45° is used at 55°. Its edge…', choices: ['stays where it was', 'moves towards the red', 'moves towards the blue', 'disappears'], a: 2, why: 'A larger angle of incidence moves every feature towards shorter wavelengths: here by about 17 nm for 10° more tilt.' }
  ],
  applications: [
    'Fluorescence microscopes and confocal microscopes, with an excitation filter, a dichroic and an emission filter in one cube.',
    'Three-sensor video cameras and some data projectors, which split and recombine red, green and blue with dichroic coatings.',
    'Halogen lamps with cold-mirror reflectors, and dental and surgical lights that must keep heat off the patient.',
    'Hot mirrors in projectors, cameras and photo-lithography tools.',
    'Stage and architectural lighting filters in saturated colours that do not fade.'
  ],
  history: 'The word *dichroic* was first used for materials that show two colours depending on the direction in which they are seen. Thin-film dichroic mirrors were developed in the 1950s for colour television cameras, which used them to split an image into three colours; the hot and cold mirror followed for film projectors and lamps, and the filter cube arrived with the epifluorescence microscope in the 1960s.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the sections on edge filters, beam splitters used at oblique incidence, and colour separation.',
    'J. A. Dobrowolski, "Coatings and filters", in *Handbook of Optics* (ed. M. Bass) — dichroic coatings, hot and cold mirrors.',
    'J. W. Lichtman and J.-A. Conchello, "Fluorescence microscopy", *Nature Methods* 2 (2005) — the principle of the filter set.'
  ],
  sim: 'cf-dichroic'
},

/* ================================================================ coloured glass filters */
{
  id: 'coloured-glass-filters', parent: 'coatings-and-filters', title: 'Coloured glass and absorbing filters', level: 1,
  short: 'Coloured glass and dyed gels filter light by absorbing it. Their edges are gentle, they work the same at every angle, they block deeply over wide bands and they do not age. The passed fraction follows the Beer–Lambert law: doubling the thickness squares the internal transmittance.',
  keywords: ['coloured glass', 'colour filter', 'absorbing filter', 'gel', 'long-pass glass', 'sharp cut filter', 'Beer-Lambert', 'internal transmittance', 'absorption coefficient', 'heat absorbing glass', 'UV pass glass', 'dyed filter', 'colour glass edge', 'blocking filter', 'orange filter', 'red filter', 'yellow filter'],
  prereq: ['transmission-and-absorption', 'wavelength-frequency-and-colour'],
  related: ['interference-filters', 'neutral-density-and-optical-density', 'dichroic-filters-and-mirrors', 'angle-of-incidence-and-coatings', 'optical-glass', 'laser-eye-hazards-and-eyewear', 'additive-and-subtractive-mixing', 'chemistry:beer-lambert'],
  body: `
A piece of orange glass looks orange because it absorbs the blue and passes the rest. That is the oldest way to make a filter: put something that absorbs in the light path and choose its thickness. It is cheap, it is robust, and it has properties that an [[interference-filters|interference filter]] cannot copy.

### How the glass does it
The colour comes from what is dissolved or suspended in the glass: ions of transition metals (cobalt for blue, copper for blue-green, iron for the infrared-absorbing "heat" glasses, chromium for green), or microscopic crystals of cadmium sulfide and selenide, which make the yellow, orange and red **long-pass** glasses with their fairly sharp edges. Gels are dyes in a thin film of plastic. Light is absorbed along its path, so the fraction that survives the glass depends on how far it travels.

### The Beer–Lambert law
The **internal transmittance** $\\tau$ of a piece of glass of thickness $t$ and absorption coefficient $\\alpha$ is

$$\\tau = e^{-\\alpha t}$$

(the *Beer–Lambert* law, see [[chemistry:beer-lambert]]), and $\\alpha$ depends strongly on wavelength. Going from a thickness $t_1$ to $t_2$ changes $\\tau$ to $\\tau^{\\,t_2/t_1}$: if 3 mm of glass has $\\tau = 0.5$ at 570 nm, 6 mm has 0.25 and 1 mm has 0.79. The edge of a long-pass glass is therefore **not fixed**: it is defined at a stated thickness (typically 3 mm), and a thicker piece moves it to longer wavelengths — about 8 nm for each doubling in the simulation. Light also crosses the glass obliquely at an angle: the path is $t/\\cos\\theta_t$, a little longer.

The total transmittance includes the reflections at the two surfaces, $T \\approx (1-R)^2\\,\\tau$: 92 % at most for a glass of index 1.52.

### What coloured glass does well
- **Angle**: its edge moves by only a nanometre or two at 45°, where an interference edge moves by 50 nm. A coloured glass needs no cone half-angle on its data sheet.
- **Blocking**: on the short side of a long-pass glass the transmittance falls to $10^{-5}$ or less over the whole ultraviolet. An interference filter blocks only over its stop band, and lets the light back beyond it. The best filters therefore *combine* the two: coloured glass for broad deep blocking, a coating for the steep edge.
- **Stability**: no coating to scratch, no moisture to shift the spectrum, no drift with temperature to speak of.

### What it does badly
- The edge is **gentle**: tens of nanometres from 10 % to 90 %, against a few for a coating. A band-pass of two glasses is never as narrow as an interference filter.
- It **absorbs**: the light it does not pass becomes heat. In a strong beam the glass warms unevenly and can crack.
- The absorption sometimes comes back as weak **fluorescence**, and a given glass has one fixed colour: no tilting or tuning.
- Its peak transmittance is limited to about 90 % by the surfaces.

### Where it is used
Long-pass glasses as emission and blocking filters in fluorescence work; colour filters for black-and-white photography (a red filter darkens the sky); heat-absorbing glass in projectors; UV-pass and IR-pass glasses (opaque to visible light) for ultraviolet photography and infrared cameras; and the tinted lenses of eyewear, from sunglasses to laser goggles ([[laser-eye-hazards-and-eyewear]]).

> [!key] Coloured glass filters by absorption: $\\tau = e^{-\\alpha t}$, so thickness moves the edge and deepens the blocking. Its edge is gentle but hardly moves with angle, and it blocks deeply over a wide band. It heats where an interference filter reflects.
`,
  ideas: [
    'Coloured glass absorbs what it does not pass; the colour comes from ions or microcrystals in the glass.',
    'The internal transmittance is τ = exp(−αt), with α strongly dependent on wavelength.',
    'Doubling the thickness squares the internal transmittance and moves a long-pass edge to longer wavelengths.',
    'The edge of an absorbing filter is gentle but almost independent of the angle of incidence.',
    'Absorbing glass blocks deeply over wide bands; combining it with a coating gives a steep edge and deep blocking.'
  ],
  pitfalls: [
    'The edge of a coloured glass is a fixed property — It is quoted for a stated thickness (usually 3 mm); a thicker piece moves it to longer wavelengths and blocks more.',
    'Absorbing and interference filters are interchangeable — The glass has a gentle edge, no angle shift and wide deep blocking; the coating a steep edge, an angle shift and a limited stop band.',
    'Coloured glass passes 100 % in its pass band — It passes at most about 92 % of the light, because of the reflections at its two surfaces.',
    'A filter that absorbs the light is the safest in a strong beam — The absorbed light is heat, and the glass can crack; a reflecting filter sends the light elsewhere, which has its own dangers.'
  ],
  terms: [
    { term: 'Internal transmittance', also: ['τ', 'τᵢ'], def: 'The fraction of the light that survives the absorption in a piece of material, leaving out the reflection losses at its surfaces. It equals exp(−αt).' },
    { term: 'Absorption coefficient', also: ['α'], def: 'The rate at which a material absorbs light, per unit of path; the internal transmittance is exp(−αt). It depends strongly on wavelength.' },
    { term: 'Beer–Lambert law', also: ['Beer\'s law', 'Lambert–Beer law'], def: 'The statement that light is absorbed exponentially with the distance travelled: each equal thickness removes the same share of what reaches it.' },
    { term: 'Sharp-cut glass', also: ['long-pass glass', 'cut-on glass', 'colour glass filter'], def: 'A coloured glass whose absorption rises steeply below an edge wavelength, passing the longer wavelengths; an orange or red glass, for example.' },
    { term: 'Heat-absorbing glass', also: ['IR-absorbing glass', 'KG glass'], def: 'A blue-green glass, usually coloured with iron, that passes the visible light and absorbs the near infrared.' },
    { term: 'Gel filter', also: ['gel', 'dyed film'], def: 'A filter made by dyeing a thin sheet of plastic: cheap and available in many colours, but less stable than glass and unfit for heat.' }
  ],
  formulas: [
    {
      name: 'Internal transmittance',
      expr: 'tau = exp(-a*t)', tex: '\\tau = e^{-\\alpha t}',
      vars: {
        tau: { name: 'internal transmittance', q: 'ratio', unit: '%', tex: '\\tau' },
        a: { name: 'absorption coefficient', q: 'wavenumber', unit: '1/mm', value: 0.23, min: 0, max: 100, tex: '\\alpha' },
        t: { name: 'path in the glass', q: 'length', unit: 'mm', value: 3 }
      },
      stories: { tau: 'A glass absorbs with a coefficient of {a} per mm at the wavelength used. What fraction of the light survives {t} of it?' }
    },
    {
      name: 'A different thickness',
      expr: 'tau2 = tau1^(t2/t1)', tex: '\\tau_2 = \\tau_1^{\\,t_2/t_1}',
      vars: {
        tau2: { name: 'transmittance at the new thickness', q: 'ratio', unit: '%', tex: '\\tau_2' },
        tau1: { name: 'transmittance at the first thickness', q: 'ratio', unit: '%', value: 50, min: 0.0001, max: 100, tex: '\\tau_1' },
        t1: { name: 'first thickness', q: 'length', unit: 'mm', value: 3, tex: 't_1' },
        t2: { name: 'second thickness', q: 'length', unit: 'mm', value: 6, tex: 't_2' }
      },
      stories: { tau2: 'A glass passes {tau1} of the light at {t1}. How much does {t2} of the same glass pass?' }
    },
    {
      name: 'Total transmittance with the surface losses',
      expr: 'T = (1 - R)^2*tau', tex: 'T = (1 - R)^2\\,\\tau',
      vars: {
        T: { name: 'total transmittance', q: 'ratio', unit: '%' },
        R: { name: 'reflectance of each surface', q: 'ratio', unit: '%', value: 4.3, min: 0, max: 50 },
        tau: { name: 'internal transmittance', q: 'ratio', unit: '%', value: 100, min: 0, max: 100, tex: '\\tau' }
      },
      note: 'Ignores the light that bounces between the two surfaces, which adds a small amount.'
    },
    {
      name: 'Path in a tilted slab',
      expr: 'p = t/sqrt(1 - sin(theta)^2/n^2)', tex: 'p = \\frac{t}{\\cos\\theta_t} = \\frac{t}{\\sqrt{1 - \\sin^2\\theta/n^2}}',
      vars: {
        p: { name: 'path in the glass', q: 'length', unit: 'mm' },
        t: { name: 'thickness of the glass', q: 'length', unit: 'mm', value: 3 },
        theta: { name: 'angle of incidence', q: 'angle', unit: '°', value: 45, min: 0, max: 80, tex: '\\theta' },
        n: { name: 'refractive index of the glass', value: 1.52, min: 1, max: 4 }
      },
      stories: { p: 'Light meets a slab of glass {t} thick (index {n}) at {theta}. How long is its path inside?' }
    }
  ],
  examples: [
    {
      title: 'Thickness and the edge',
      q: 'A long-pass glass passes 50 % of the light (internal) at 570 nm when it is 3 mm thick. What does 6 mm pass at that wavelength? What does 1 mm pass?',
      steps: [
        { text: 'For 6 mm the path doubles, so the transmittance is squared:', tex: '\\tau = 0.5^{6/3} = 0.25' },
        { text: 'For 1 mm:', tex: '\\tau = 0.5^{1/3} = 0.79' }
      ],
      a: '25 % and 79 %. The 50 % point of the 6 mm glass is therefore at a longer wavelength than 570 nm, and the blocked band gets darker.'
    },
    {
      title: 'The same glass, tilted',
      q: 'The 3 mm glass of index 1.52 is tilted to 45°. What is the path of the light inside it, and what does the internal transmittance become at the edge wavelength, where it was 0.5?',
      steps: [
        { text: 'The path:', tex: 'p = \\frac{3}{\\sqrt{1 - 0.5/1.52^2}} = \\frac{3}{0.885} = 3.39\\ \\mathrm{mm}' },
        { text: 'The internal transmittance at the old edge:', tex: '\\tau = 0.5^{3.39/3} = 0.457' }
      ],
      a: 'The path is 13 % longer and the transmittance at the old edge falls only from 0.50 to 0.46: the edge moves by about a nanometre. The interference filter in the simulation moves by 50 nm.'
    }
  ],
  quiz: [
    { q: 'A piece of coloured glass passes 40 % internal transmittance at some wavelength. A second piece of the same glass is put behind it. The pair passes…', choices: ['80 %', '40 %', '16 %', '0 %'], a: 2, why: 'Internal transmittances multiply: $0.4 \\times 0.4 = 0.16$. Doubling the thickness squares the transmittance.' },
    { q: 'A coloured glass filter is tilted from 0° to 45°. Its edge moves…', choices: ['by about 50 nm to the blue', 'by a nanometre or two', 'to much longer wavelengths', 'it does not move at all'], a: 1, why: 'Only the path through the glass grows, by about 13 % at 45°, which moves the edge a nanometre or so. An interference filter\'s edge moves by 8 % of its wavelength.' },
    { q: 'Absorbing filters turn the light they block into heat.', a: true, why: 'Whatever is absorbed is converted to heat in the glass. That is why strong beams crack coloured glass and why interference filters, which reflect, are used in high-power systems.' },
    { q: 'The glass of 3 mm thickness has an internal transmittance of 81 % at some wavelength. What is it for 6 mm, in per cent?', answer: 65.6, unit: '%', why: '$0.81^{6/3} = 0.81^2 = 0.656$.' },
    { q: 'Why is a coloured glass often used together with an interference band-pass filter?', choices: ['To make the filter cheaper only', 'The glass blocks over a wide range that the coating cannot, while the coating gives the steep edge', 'To polarize the light', 'To correct the angle shift'], a: 1, why: 'A stack of layers stops light only over a limited zone; absorbing glass blocks deeply across the ultraviolet and visible. The two together give a steep edge and deep blocking over a wide range.' }
  ],
  applications: [
    'Blocking filters for fluorescence microscopes and spectrometers, often combined with an interference coating.',
    'Camera filters: yellow, orange and red filters for black-and-white photography; infrared-pass glass for infrared photography.',
    'Heat-absorbing glass in projectors and slide viewers; UV-pass glass in forensic and UV photography.',
    'Sunglasses and laser safety eyewear, where absorbing filters are chosen for their insensitivity to angle.',
    'Theatre and film lighting gels, where cheap dyes are enough for a short life.'
  ],
  history: 'Coloured glass is older than glass optics: stained glass is coloured with the same metal oxides. The systematic study of glasses for filters began with Otto Schott\'s laboratory at Jena in the 1880s, and glasses coloured by semiconductor microcrystals, whose edges are steeper than those of ionic glasses, became standard through the twentieth century.',
  sources: [
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the sections on absorption: the exponential law.',
    'W. J. Smith, *Modern Optical Engineering* — the chapter on optical materials: internal transmittance and the filter glasses.',
    'W. Vogel, *Glass Chemistry* — the colouring of glass by ions and colloids.'
  ],
  sim: 'cf-glass'
},

/* ================================================================ neutral density and optical density */
{
  id: 'neutral-density-and-optical-density', parent: 'coatings-and-filters', title: 'Neutral density and optical density', level: 1,
  short: 'A neutral-density filter dims every colour by the same factor. Its strength is given as an optical density, the logarithm of the dimming: OD 1 passes a tenth, OD 2 a hundredth, OD 3 a thousandth. Densities of stacked filters add, which is why the logarithm is used.',
  keywords: ['neutral density', 'ND filter', 'optical density', 'OD', 'attenuator', 'grey filter', 'ND8', 'ND1000', 'stops', 'variable ND', 'reflective ND', 'absorptive ND', 'attenuation', 'decibel', 'filter factor', 'density', 'dimming', 'step wedge'],
  prereq: ['transmission-and-absorption', 'why-surfaces-are-coated'],
  related: ['coloured-glass-filters', 'metal-mirror-coatings', 'interference-filters', 'exposure-and-the-exposure-triangle', 'shutter-speed-and-motion', 'polarizers-and-malus-law', 'laser-eye-hazards-and-eyewear', 'laser-power-and-energy-measures', 'beam-splitters', 'spectrophotometers'],
  body: `
Sometimes there is simply too much light: a camera that must use a long exposure at noon, a laser beam too strong for the detector that should measure it, a welding arc that an eye must watch. A **neutral-density filter** (ND filter) takes light away without changing anything else. "Neutral" means it removes the same fraction at every wavelength, so the colours stay as they were; it looks grey.

### Optical density
A filter that passes the fraction $T$ of the light has the **optical density**

$$\\mathrm{OD} = -\\log_{10} T \\qquad\\Longleftrightarrow\\qquad T = 10^{-\\mathrm{OD}}$$

| OD | passes | stops | decibels |
|---|---|---|---|
| 0.3 | 50 % | 1 | 3 |
| 0.6 | 25 % | 2 | 6 |
| 0.9 | 12.6 % | 3 | 9 |
| 1.0 | 10 % | 3.3 | 10 |
| 2.0 | 1 % | 6.6 | 20 |
| 3.0 | 0.1 % | 10 | 30 |
| 4.0 | 0.01 % | 13.3 | 40 |

The logarithm is used for one reason: when filters are **stacked**, their transmittances multiply but their densities **add**. OD 1.0 with OD 0.6 and OD 0.3 is OD 1.9, which passes 1.26 %. Each 0.3 of density is one photographic **stop**, a halving ([[exposure-and-the-exposure-triangle]]), and one unit of density is 10 decibels.

### Three ways of naming the same filter
Photographers meet all three. A filter that passes one eighth is **ND 0.9** (its density), **ND8** (its *filter factor*, the number the exposure time must be multiplied by) and a **3-stop** filter. An "ND1000" is OD 3.0 and close to 10 stops: it turns 1/250 s into 4 s, long enough to smooth moving water ([[shutter-speed-and-motion]]).

### Absorbing and reflecting filters
- An **absorbing** ND filter is grey glass, or a dyed sheet. The light it removes becomes heat in the glass ([[coloured-glass-filters]]). It sends little light back, but it warms in a strong beam, and most grey glasses are neutral only across the visible: in the near infrared they pass much more than their label says.
- A **reflecting** (metallic) ND filter is a thin, partly transparent film of metal on glass ([[metal-mirror-coatings]]). It is neutral over a far wider band, from the ultraviolet into the infrared. It removes light partly by reflecting it and partly by absorbing it in the film: a dense one sends about half of the beam back. That reflected beam must be sent somewhere safe, and the filter is tilted a little so that it does not return to a laser.

### Variable attenuators
A **circular variable** filter is a disc whose density rises around its rim: turn it to choose. A **step wedge** has a row of fixed densities. Two polarizers, one turned against the other, pass $\\cos^2\\theta$ of polarized light ([[polarizers-and-malus-law]]) and make the "variable ND" filters of video cameras; near their darkest setting they shade unevenly across a wide field.

### What to watch
A density is true at the wavelengths the maker states, and the reflections between two stacked metallic filters let a little more through than the sum of their densities promises. Laser eyewear is rated the same way, by the OD at a named wavelength ([[laser-eye-hazards-and-eyewear]]): OD 6 passes one part in a million there, and may pass everything at another wavelength.

> [!key] $\\mathrm{OD} = -\\log_{10}T$: each unit of density is a factor of ten, each 0.3 a stop. Stacked densities add. An absorbing filter turns the light into heat; a metallic one also reflects a large part of it, and that beam must be dealt with.
`,
  ideas: [
    'A neutral-density filter removes the same fraction of the light at every wavelength, so colours are unchanged.',
    'Optical density is the logarithm of the dimming: OD = −log₁₀ T, so OD 1, 2, 3 pass 10 %, 1 %, 0.1 %.',
    'Transmittances of stacked filters multiply; their optical densities add.',
    'A density of 0.3 is one stop (a halving); one unit of density is 10 decibels.',
    'Absorbing filters heat up; metallic filters also send a large part of the unwanted light back as a beam that must be caught.'
  ],
  pitfalls: [
    'An OD 2 filter is twice as dark as an OD 1 filter — It is ten times darker: each unit of density is another factor of ten.',
    'ND8 and ND 0.8 are the same filter — ND8 is a filter factor (passes 1/8, density 0.9); ND 0.8 is a density (passes 16 %).',
    'A neutral filter is neutral at every wavelength — Its density is stated for a range, usually the visible; many grey glasses pass far more in the near infrared.',
    'A reflecting ND filter makes the removed light disappear — A dense one reflects about half of the beam; that reflection can reach an eye or upset a laser.'
  ],
  terms: [
    { term: 'Neutral-density filter', also: ['ND filter', 'ND', 'grey filter', 'attenuator'], def: 'A filter that reduces the light by the same factor at every wavelength in its working range, changing brightness but not colour.' },
    { term: 'Optical density', also: ['OD', 'density', 'absorbance'], def: 'The logarithm of the dimming of a filter: OD = −log₁₀ T. OD 1 passes a tenth of the light, OD 2 a hundredth, OD 3 a thousandth.' },
    { term: 'Filter factor', also: ['ND2', 'ND4', 'ND8', 'ND1000'], def: 'The number by which a filter divides the light, and by which the exposure time must be multiplied: 1/T. An ND8 filter passes one eighth.' },
    { term: 'Reflective ND filter', also: ['metallic ND filter', 'reflecting attenuator'], def: 'A neutral-density filter made of a thin, partly transparent metal film, neutral over a wide range of wavelengths; it reflects a large part of the light it removes and absorbs the rest.' },
    { term: 'Absorptive ND filter', also: ['absorbing ND filter', 'grey glass'], def: 'A neutral-density filter of grey glass or dyed plastic, which removes light by absorbing it and turning it into heat.' },
    { term: 'Variable ND filter', also: ['variable attenuator', 'circular variable filter', 'step wedge'], def: 'An attenuator whose density can be chosen: a disc of rising density, a row of steps, or two polarizers turned against each other.' }
  ],
  formulas: [
    {
      name: 'Optical density of a transmittance',
      expr: 'OD = -log10(T)', tex: '\\mathrm{OD} = -\\log_{10} T',
      vars: {
        OD: { name: 'optical density', tex: '\\mathrm{OD}' },
        T: { name: 'transmittance', q: 'ratio', unit: '%', value: 12.5, min: 0.000001, max: 100 }
      },
      stories: { OD: 'A filter passes {T} of the light. What is its optical density?' }
    },
    {
      name: 'Transmittance of a density',
      expr: 'T = 10^(-OD)', tex: 'T = 10^{-\\mathrm{OD}}',
      vars: {
        T: { name: 'transmittance', q: 'ratio', unit: '%' },
        OD: { name: 'optical density', value: 1.9, min: 0, max: 10, tex: '\\mathrm{OD}' }
      },
      stories: { T: 'What fraction of the light passes a filter of optical density {OD}?' }
    },
    {
      name: 'Stacked filters',
      expr: 'OD = OD1 + OD2 + OD3', tex: '\\mathrm{OD} = \\mathrm{OD}_1 + \\mathrm{OD}_2 + \\mathrm{OD}_3',
      vars: {
        OD: { name: 'density of the stack', tex: '\\mathrm{OD}' },
        OD1: { name: 'density of the first filter', value: 1, min: 0, max: 10, tex: '\\mathrm{OD}_1' },
        OD2: { name: 'density of the second filter', value: 0.6, min: 0, max: 10, tex: '\\mathrm{OD}_2' },
        OD3: { name: 'density of the third filter', value: 0.3, min: 0, max: 10, tex: '\\mathrm{OD}_3' }
      },
      note: 'True for absorbing filters. Reflections between two metallic filters let slightly more through; tilt one of them.'
    },
    {
      name: 'Density in stops',
      expr: 'N = OD/0.30103', tex: 'N = \\frac{\\mathrm{OD}}{\\log_{10}2} = \\frac{\\mathrm{OD}}{0.301}',
      vars: {
        N: { name: 'number of stops' },
        OD: { name: 'optical density', value: 3, min: 0, max: 10, tex: '\\mathrm{OD}' }
      },
      stories: { N: 'How many stops of light does a filter of density {OD} take away?' }
    }
  ],
  examples: [
    {
      title: 'A long exposure at noon',
      q: 'A scene needs 1/125 s at the chosen aperture. The photographer fits an ND 0.9 filter to blur a waterfall. What fraction of the light passes, how many stops is that, and what is the new exposure time?',
      steps: [
        { text: 'The transmittance:', tex: 'T = 10^{-0.9} = 0.126' },
        { text: 'In stops:', tex: 'N = \\frac{0.9}{0.301} = 2.99 \\approx 3' },
        { text: 'Three stops are a factor of eight in time:', tex: 't = 8 \\times \\tfrac{1}{125}\\ \\mathrm{s} = \\tfrac{1}{15.6}\\ \\mathrm{s}' }
      ],
      a: 'The filter passes 12.6 %, three stops, and the exposure becomes about 1/15 s. For several seconds an OD 3 filter (ten stops) is the usual choice.'
    },
    {
      title: 'Bringing a laser down to the detector',
      q: 'A 5 mW laser must be measured by a detector that saturates above 0.1 mW. Filters of OD 1.0, 0.6 and 0.3 are stacked in the beam. What power reaches the detector?',
      steps: [
        { text: 'The densities add:', tex: '\\mathrm{OD} = 1.0 + 0.6 + 0.3 = 1.9' },
        { text: 'The transmittance:', tex: 'T = 10^{-1.9} = 0.0126' },
        { text: 'The power:', tex: 'P = 5\\ \\mathrm{mW} \\times 0.0126 = 0.063\\ \\mathrm{mW}' }
      ],
      a: 'About 63 µW, safely below the limit. If the filters are metallic, about half of the 5 mW comes back from the first one and needs a beam block.'
    }
  ],
  quiz: [
    { q: 'A filter of optical density 2 passes…', choices: ['half of the light', '20 %', '2 %', '1 %'], a: 3, why: '$T = 10^{-2} = 0.01$: one hundredth. Each unit of density is a factor of ten.' },
    { q: 'Filters of OD 0.3 and OD 0.6 are stacked. What is the transmittance of the pair, in per cent?', answer: 12.6, unit: '%', why: 'Densities add: OD 0.9, and $10^{-0.9} = 0.126$. Equivalently $0.50 \\times 0.25 = 0.125$.' },
    { q: 'A photographer\'s "ND8" filter has an optical density of about…', choices: ['8', '0.8', '0.9', '0.125'], a: 2, why: 'ND8 is a filter factor: it passes 1/8 of the light, three stops, and $-\\log_{10}(1/8) = 0.90$.' },
    { q: 'A dense metallic ND filter sends a strong reflected beam back towards the source.', a: true, why: 'A metal film reflects a large part of what it does not pass: about half of the beam for a dense filter. That beam has to be caught, and the filter is tilted so that it misses the laser.' },
    { q: 'Why is a grey-glass ND filter a poor choice in front of an infrared camera?', choices: ['Glass is opaque in the infrared', 'Many grey glasses are neutral only in the visible and pass much more in the near infrared', 'It polarizes the light', 'It would focus the beam'], a: 1, why: 'The density of an absorbing filter is stated for a range, usually the visible. Outside it the filter may be far weaker, so the infrared image is hardly dimmed.' }
  ],
  applications: [
    'Photography and video: long exposures in daylight, wide apertures in bright light, and the built-in variable ND of video cameras.',
    'Laser laboratories: bringing a beam down to the range of a detector, a camera or a beam profiler.',
    'Welding filters, solar filters and laser eyewear, all rated by their optical density.',
    'Spectrophotometers and densitometers, which report absorbance on the same logarithmic scale.',
    'Calibrating cameras and light meters with step wedges of known density.'
  ],
  history: 'The density scale comes from photography: in 1890 Ferdinand Hurter and Vero Driffield described the darkening of a developed plate by the logarithm of its opacity, because equal steps of density look like equal steps of grey. The same logarithm, applied to solutions, is the absorbance of chemistry.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the chapter on optical materials and filters: density, neutral filters.',
    'E. Hecht, *Optics* — absorption and the exponential law.',
    'J. A. Dobrowolski, "Optical properties of films and coatings", in M. Bass (ed.), *Handbook of Optics* — neutral filters, absorbing and metallic.'
  ],
  sim: 'cf-density'
},

/* ================================================================ how coatings are made */
{
  id: 'how-coatings-are-made', parent: 'coatings-and-filters', title: 'How coatings are made', level: 2,
  short: 'An optical coating is grown in a vacuum chamber, a few atoms at a time. The material is boiled or knocked off a source, flies in straight lines to the glass and condenses there, while a monitor watches the layer grow and stops it at the right thickness, to within about a nanometre.',
  keywords: ['coating', 'vacuum deposition', 'evaporation', 'electron beam', 'e-beam', 'sputtering', 'ion-assisted deposition', 'IAD', 'ion beam sputtering', 'IBS', 'magnetron', 'optical monitoring', 'quartz crystal monitor', 'quarter wave', 'turning point', 'thin film', 'PVD', 'coating chamber', 'planetary', 'witness glass', 'dip coating', 'atomic layer deposition'],
  prereq: ['multilayer-coatings', 'antireflection-coatings'],
  related: ['thin-film-interference', 'dielectric-mirrors', 'interference-filters', 'laser-damage-and-coating-durability', 'spectacle-lens-coatings', 'cleaning-and-handling-optics', 'surface-quality-and-flatness', 'ellipsometry', 'spectrophotometers', 'optical-plastics'],
  body: `
A quarter-wave layer of magnesium fluoride for green light is 99.6 nm thick: about four hundred atoms. A laser mirror stacks seventeen or more such layers, each of which must be right to about one per cent ([[multilayer-coatings]]). Nothing can be spread that thin. A coating is **grown**, atom by atom, in a vacuum.

### Why a vacuum
In air an atom of vapour would travel less than a tenth of a micrometre before it struck a gas molecule. The chamber is pumped down until the **mean free path** — the average distance between collisions — is longer than the chamber itself:

$$\\ell \\approx \\frac{6.6\\ \\mathrm{mm}}{p\\,[\\mathrm{Pa}]}$$

At $10^{-3}$ Pa (a hundred-millionth of an atmosphere) that is 6.6 m. The atoms then leave the source in straight lines, like light from a lamp, and reach the glass clean.

### Three ways to make the vapour
- **Evaporation.** The material is heated until it boils off: in a resistance-heated "boat", or by an **electron beam** aimed into a crucible, which melts even the oxides. It is fast and gentle, and has been the workhorse since the 1930s. The atoms arrive with little energy, so the layer grows as a forest of fine columns with empty space between them.
- **Ion-assisted deposition.** A second source showers the growing film with energetic ions that hammer it dense. The glass need not be hot, so plastics can be coated ([[spectacle-lens-coatings]]).
- **Sputtering.** Ions of argon strike a solid target and knock atoms off it. The atoms arrive fast and pack tightly. *Magnetron* sputtering coats large areas; **ion-beam sputtering** makes the smoothest, lowest-loss mirrors there are.

Other routes exist: dipping or spinning a liquid that hardens into a layer (sol–gel), and atomic layer deposition, which builds a film one chemical layer at a time, even inside deep holes.

### Uniform over every lens
The source sprays unevenly, as a lamp lights a ceiling unevenly. The lenses therefore sit on a dome above it that turns — often with a second, *planetary* rotation — so that each one visits every part of the cloud.

### Knowing when to stop
- A **quartz crystal** beside the lenses vibrates a little slower with every atom that lands on it; the change in frequency gives the mass, and so the thickness and the rate, typically 0.2 to 1 nm each second.
- An **optical monitor** shines one wavelength on a test glass and watches its reflection rise and fall as the layer grows. The curve turns exactly when the layer is a quarter wave thick at that wavelength: the machine closes the shutter at the turning point. It measures the very quantity the design asks for, the optical thickness.

### Porous and dense layers
The columns of an evaporated film take up water from the air. Water raises the index, and the whole spectrum moves a few nanometres to the red — and back again when the part is warmed. Dense films from ion-assisted deposition or sputtering do not shift: they are harder and steadier, though more highly stressed, enough to bend a thin substrate.

### Before and after
The glass is cleaned to the last molecule first, since a coating sticks no better than what lies beneath it. Afterwards a *witness glass* coated in the same run is measured in a [[spectrophotometers|spectrophotometer]], and tested for adhesion and wear ([[laser-damage-and-coating-durability]]).

> [!key] A coating is grown in vacuum from vapour that travels in straight lines. Evaporation is fast but leaves porous layers; ion assistance and sputtering make dense ones. A monitor stops each layer, usually at the turning point of a quarter wave.
`,
  ideas: [
    'Coating layers are about a hundred nanometres thick and are grown atom by atom from a vapour, not spread on.',
    'The chamber is evacuated so that the mean free path is longer than the chamber: the atoms then fly in straight lines.',
    'Evaporation boils the material off; sputtering knocks it off a target with ions; ion assistance compacts the growing film.',
    'A quartz crystal measures the mass that lands; an optical monitor watches the reflection turn at each quarter wave.',
    'Porous evaporated films absorb water and shift in wavelength; dense films do not.'
  ],
  pitfalls: [
    'A thicker coating is a better coating — Each layer has one right thickness, a quarter wave or the value the design gives; an error of 1 % moves the whole spectrum by 1 %.',
    'The vacuum is there to keep the coating clean — Mostly it is there so that the atoms reach the glass at all, in straight lines, without colliding with gas.',
    'A coating has the same index as the solid material — A porous film has a lower index than the bulk, and it changes when the pores fill with water.',
    'All coatings of the same design behave the same — The process matters: an evaporated and a sputtered coating of one design differ in hardness, drift, loss and stress.'
  ],
  terms: [
    { term: 'Physical vapour deposition', also: ['PVD', 'vacuum deposition', 'vacuum coating'], def: 'Growing a thin film in vacuum from a vapour of the coating material, made by evaporating or sputtering a solid source.' },
    { term: 'Electron-beam evaporation', also: ['e-beam evaporation', 'thermal evaporation'], def: 'Heating the coating material with a beam of electrons until it evaporates; the vapour condenses on the optics above.' },
    { term: 'Sputtering', also: ['magnetron sputtering', 'ion-beam sputtering', 'IBS'], def: 'Knocking atoms off a solid target with energetic ions; the atoms land on the optics with high energy and form a dense film.' },
    { term: 'Ion-assisted deposition', also: ['IAD', 'ion plating', 'plasma-assisted deposition'], def: 'Evaporation with a beam of ions aimed at the growing film to pack it densely, without heating the substrate much.' },
    { term: 'Mean free path', also: ['free path'], def: 'The average distance a gas atom travels between collisions. It is inversely proportional to the pressure: about 6.6 mm at 1 Pa in air.' },
    { term: 'Optical monitoring', also: ['optical monitor', 'turning-point monitoring', 'quartz crystal monitor', 'witness glass'], def: 'Following a layer as it grows by the light reflected or transmitted by a test glass; the signal turns at every quarter wave of optical thickness.' }
  ],
  formulas: [
    {
      name: 'Thickness of a quarter-wave layer',
      expr: 'd = lam/(4*n)', tex: 'd = \\frac{\\lambda}{4n}',
      vars: {
        d: { name: 'physical thickness of the layer', q: 'length', unit: 'nm' },
        lam: { name: 'design wavelength', q: 'length', unit: 'nm', value: 550, min: 150, max: 12000, tex: '\\lambda' },
        n: { name: 'refractive index of the layer', value: 1.38, min: 1.2, max: 4.5 }
      },
      stories: { d: 'How thick is a quarter-wave layer of index {n} for light of {lam}?' }
    },
    {
      name: 'Mean free path in the chamber',
      expr: 'L = 0.0066/p', tex: '\\ell \\approx \\frac{6.6\\times10^{-3}\\ \\mathrm{Pa\\,m}}{p}',
      vars: {
        L: { name: 'mean free path', q: 'length', unit: 'm', tex: '\\ell' },
        p: { name: 'pressure in the chamber', q: 'pressure', unit: 'mPa', value: 1, min: 0.0001, max: 100000000 }
      },
      note: 'For air at room temperature. The chamber should be several times smaller than this length.',
      stories: { L: 'A coating chamber is pumped to {p}. How far does an atom travel, on average, before it hits a gas molecule?' }
    },
    {
      name: 'Time to grow a layer',
      expr: 't = d/r', tex: 't = \\frac{d}{r}',
      vars: {
        t: { name: 'time', q: false, unit: 's' },
        d: { name: 'thickness of the layer', q: false, unit: 'nm', value: 99.6, min: 1, max: 5000 },
        r: { name: 'deposition rate', q: false, unit: 'nm/s', value: 0.5, min: 0.01, max: 20 }
      },
      stories: { t: 'A layer {d} nm thick is grown at {r} nm each second. How long does it take?' }
    },
    {
      name: 'Shift of the spectrum from a thickness error',
      expr: 'lam2 = lam*(1 + e1)', tex: '\\lambda_2 = \\lambda\\,(1 + \\varepsilon)',
      vars: {
        lam2: { name: 'wavelength where the coating now works', q: 'length', unit: 'nm', tex: '\\lambda_2' },
        lam: { name: 'design wavelength', q: 'length', unit: 'nm', value: 1064, min: 150, max: 12000, tex: '\\lambda' },
        e1: { name: 'error of every layer thickness', q: 'ratio', unit: '%', value: 1, min: -20, max: 20, tex: '\\varepsilon' }
      },
      note: 'When every layer is too thick by the same fraction, the whole spectrum moves to longer wavelengths by that fraction.'
    }
  ],
  examples: [
    {
      title: 'One layer of an anti-reflection coating',
      q: 'A single layer of magnesium fluoride (index 1.38) is to be a quarter wave thick at 550 nm, and is evaporated at 0.5 nm per second. How thick is it and how long does the layer take?',
      steps: [
        { text: 'The thickness:', tex: 'd = \\frac{550}{4 \\times 1.38} = 99.6\\ \\mathrm{nm}' },
        { text: 'The time:', tex: 't = \\frac{99.6}{0.5} = 199\\ \\mathrm{s}' }
      ],
      a: '99.6 nm, grown in a little over three minutes. On crown glass the monitor sees the reflection fall from 4.24 % to 1.27 % and stops there, at the turning point.'
    },
    {
      title: 'How good a vacuum',
      q: 'A chamber is 1 m across. What is the mean free path at 1 Pa, at 10 mPa and at 1 mPa, and which of these pressures will do for coating?',
      steps: [
        { text: 'At 1 Pa:', tex: '\\ell = \\frac{6.6\\ \\mathrm{mm}}{1} = 6.6\\ \\mathrm{mm}' },
        { text: 'At 10 mPa:', tex: '\\ell = \\frac{6.6\\ \\mathrm{mm}}{0.01} = 0.66\\ \\mathrm{m}' },
        { text: 'At 1 mPa:', tex: '\\ell = \\frac{6.6\\ \\mathrm{mm}}{0.001} = 6.6\\ \\mathrm{m}' }
      ],
      a: 'At 1 Pa the atoms are scattered within millimetres; at 10 mPa most collide on the way. Only at 1 mPa and below is the path several times the chamber, so that the vapour arrives in straight lines.'
    }
  ],
  quiz: [
    { q: 'Why are optical coatings deposited in a vacuum?', choices: ['So that the atoms of vapour reach the glass in straight lines without hitting gas molecules', 'Because glass melts in air', 'To cool the lenses', 'To make the layers thicker'], a: 0, why: 'In air the mean free path is under a tenth of a micrometre. Pumped to about 1 mPa it is several metres, longer than the chamber.' },
    { q: 'An optical monitor watches the reflection of a test glass at one wavelength while a layer grows. The reflection reaches a turning point when the layer is…', choices: ['one wavelength thick', 'a quarter wave in optical thickness', '1 nm thick', 'as thick as the glass'], a: 1, why: 'The reflection of a single growing layer swings between two extremes, and reaches one each time the optical thickness passes a quarter wave.' },
    { q: 'An evaporated filter is taken out of the chamber into humid air. Its pass band…', choices: ['moves a few nanometres to longer wavelengths', 'moves to shorter wavelengths', 'disappears', 'does not move in any coating'], a: 0, why: 'The pores of an evaporated film fill with water, the index of the layers rises, and the optical thickness with it. Dense sputtered films show no such shift.' },
    { q: 'How thick, in nanometres, is a quarter-wave layer of titanium dioxide (index 2.35) for light of 550 nm?', answer: 58.5, unit: 'nm', why: '$d = \\lambda/(4n) = 550/(4 \\times 2.35) = 58.5$ nm. High-index layers are thinner than low-index ones.' },
    { q: 'Sputtered films are denser than evaporated ones because the atoms arrive with more energy.', a: true, why: 'Atoms knocked off a target by ions arrive with several electron-volts and pack tightly; evaporated atoms arrive with about a tenth of an electron-volt and build loose columns.' }
  ],
  applications: [
    'Anti-reflection coatings on camera lenses, spectacle lenses and phone optics, made by the thousand in one chamber load.',
    'Laser mirrors and low-loss mirrors for gyroscopes and gravitational-wave detectors, by ion-beam sputtering.',
    'Architectural and display glass, coated in line by magnetron sputtering over square metres.',
    'Narrow band-pass filters for telecommunications, which need dense, drift-free layers and optical monitoring.',
    'Aluminium mirrors for telescopes, re-coated every few years in a chamber as large as the mirror.'
  ],
  history: 'Thin films of metal were evaporated in vacuum before 1900, and John Strong aluminized large telescope mirrors that way in the early 1930s. In 1935 Alexander Smakula at Zeiss patented the evaporated anti-reflection layer, and Strong and others published the same idea shortly after. Electron-beam sources, ion assistance and ion-beam sputtering followed from the 1960s to the 1980s, each making denser and more exact layers possible.',
  sources: [
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapters on the production of coatings and on layer monitoring.',
    'P. W. Baumeister, *Optical Coating Technology* — deposition processes and thickness control.',
    'R. R. Willey, *Practical Design and Production of Optical Thin Films* — the processes as they are run in practice.'
  ],
  sim: 'cf-deposition'
},

/* ================================================================ laser damage and durability */
{
  id: 'laser-damage-and-coating-durability', parent: 'coatings-and-filters', title: 'Laser damage and durability', level: 2,
  short: 'Every coating has a limit to the light it can take, the laser-induced damage threshold, given in joules per square centimetre for pulses. The beam must stay below it at its brightest point, with a margin. Coatings must also survive wiping, humidity and heat, which standard tests check.',
  keywords: ['laser damage', 'LIDT', 'damage threshold', 'fluence', 'J/cm2', 'pulse duration', 'peak fluence', 'Gaussian beam', 'safety factor', 'hot spot', 'durability', 'abrasion', 'adhesion', 'humidity', 'hard coating', 'soft coating', 'ISO 21254', 'ISO 9211', 'contamination', 'power handling'],
  prereq: ['dielectric-mirrors', 'the-gaussian-beam'],
  related: ['how-coatings-are-made', 'metal-mirror-coatings', 'antireflection-coatings', 'continuous-and-pulsed-lasers', 'q-switching-and-mode-locking', 'laser-power-and-energy-measures', 'focusing-a-laser-beam', 'cleaning-and-handling-optics', 'ghosts-flare-and-stray-light', 'laser-processing-systems', 'neutral-density-and-optical-density'],
  body: `
A coating is the weakest part of most optics. It is a hundred nanometres of material, never quite perfect, standing in the full beam. Two questions decide whether it survives: how much **light** it can take, and how much **handling and weather**.

### The damage threshold
The **laser-induced damage threshold** (LIDT) is the highest exposure at which a coating, in a standard test, shows no change. For pulses it is a **fluence**, energy per area, in J/cm²; for a continuous beam it is a power density, in W/cm², or a power per beam width, in W/cm. A threshold means nothing without its conditions: *wavelength, pulse length, repetition rate and spot size*. "10 J/cm² at 1064 nm, 10 ns, 10 Hz" is a complete statement.

### The beam is brightest in the middle
A laser beam is not evenly filled. In a Gaussian beam of radius $w$ ([[the-gaussian-beam]]) carrying a pulse of energy $E$, the fluence at the centre is

$$F_0 = \\frac{2E}{\\pi w^2}$$

**twice** the energy divided by the area of the $1/e^2$ circle. A 10 mJ pulse in a beam of 0.5 mm radius reaches 2.5 J/cm² at its centre. Real beams also carry hot spots — from dust, from diffraction at an edge — that rise above even that, which is why the working rule is to stay a factor of two to three, or more, below the stated threshold.

### Scaling to another pulse
For pulses between roughly 20 ps and 100 ns the damage is thermal, and the threshold grows as the square root of the pulse length:

$$\\mathrm{LIDT}_2 \\approx \\mathrm{LIDT}_1 \\sqrt{\\frac{\\tau_2}{\\tau_1}}$$

A coating good for 5 J/cm² at 10 ns takes only about 1.6 J/cm² at 1 ns. Thresholds also fall towards shorter wavelengths, roughly in proportion, and much faster in the ultraviolet. These are rules of thumb for a first estimate; the maker's figure for the actual conditions is what counts.

### Which coatings stand most
As orders of magnitude at 1064 nm and 10 ns: a dielectric laser-line mirror or a simple anti-reflection coating stands 10 to 20 J/cm² or more; a broadband coating of many layers a few; a protected silver or gold mirror about 1 to 3; protected aluminium a few tenths ([[metal-mirror-coatings]]). Metals absorb a few per cent of the light in a skin tens of nanometres deep, and that heat is what destroys them. Cemented lenses fail at the cement; absorbing filters fail by heat.

### How the damage starts
Almost never in perfect material. It starts at a **defect**: a nodule grown over a speck of dust, an absorbing inclusion, a scratch, a fingerprint. Dirt on a surface burns in and leaves a mark that absorbs more, and the damage grows with each pulse. Clean optics are the cheapest protection ([[cleaning-and-handling-optics]]). A reflection focused by a lens surface back into a component — a ghost focus ([[ghosts-flare-and-stray-light]]) — destroys optics that the main beam would never harm.

### Durability
Apart from light, a coating must stay on. Standard tests check **adhesion** (tape pressed on and pulled off), **abrasion** (rubbing with cloth, or harder with an eraser), **humidity** (a day at about 50 °C and 95 % humidity), temperature cycling, salt fog and solvents. *Hard* coatings — oxides, dense sputtered films — pass the severe versions; *soft* ones, such as bare metals and some infrared layers, must never be wiped.

> [!key] Compare the peak fluence $2E/\\pi w^2$ — not the average — with the threshold stated for your wavelength and pulse length, and keep a margin of two to three. Damage starts at defects and dirt. Durability is a separate question, answered by adhesion, abrasion and humidity tests.
`,
  ideas: [
    'The damage threshold of a coating is a fluence (J/cm²) for pulses and a power density for continuous beams, valid for stated conditions.',
    'The centre of a Gaussian beam has twice the average fluence: F₀ = 2E/πw².',
    'In the nanosecond range the threshold scales roughly as the square root of the pulse length, and falls at shorter wavelengths.',
    'Dielectric coatings stand far more than metal ones, because metals absorb a few per cent of the light.',
    'Damage begins at defects and contamination; durability against wiping and weather is tested separately.'
  ],
  pitfalls: [
    'Divide the pulse energy by the beam area and compare with the threshold — That is the average; the centre of a Gaussian beam has twice as much, and hot spots more.',
    'A threshold of 10 J/cm² holds for any pulse — It holds for the pulse length and wavelength it was measured at; at a tenth of the pulse length it is about a third.',
    'A larger beam is always safer for the same fluence — Larger test spots find more defects, so thresholds measured with tiny spots can be optimistic for big beams.',
    'A coating that survives the laser will survive cleaning — Light and handling are separate limits: bare gold stands a strong infrared beam and is ruined by one wipe.'
  ],
  terms: [
    { term: 'Laser-induced damage threshold', also: ['LIDT', 'damage threshold', 'LDT'], def: 'The highest fluence or power density at which an optic shows no damage in a standard test, stated with its wavelength, pulse length and repetition rate.' },
    { term: 'Fluence', also: ['radiant exposure', 'energy density', 'J/cm²'], def: 'The energy delivered per unit area, in joules per square centimetre. The peak fluence of a Gaussian beam is twice its average.' },
    { term: 'Safety factor', also: ['safety margin', 'derating'], def: 'The ratio of the damage threshold to the peak exposure in use. A factor of two to three or more allows for hot spots and for the scatter of thresholds.' },
    { term: 'Hot spot', also: ['beam modulation', 'ghost focus'], def: 'A small region of a beam, or a focused stray reflection, where the fluence is well above that of an ideal smooth beam; a frequent cause of damage.' },
    { term: 'Hard coating', also: ['soft coating', 'durable coating'], def: 'A coating that passes severe abrasion, adhesion and humidity tests, as dense oxide films do; a soft coating can be damaged by wiping.' },
    { term: 'Environmental durability test', also: ['adhesion test', 'abrasion test', 'humidity test', 'tape test'], def: 'A standard trial of a coating against tape, rubbing, damp heat, temperature cycles, salt fog or solvents, after which it must be unchanged.' }
  ],
  formulas: [
    {
      name: 'Peak fluence of a Gaussian pulse',
      expr: 'F = 2*E/(pi*w^2)', tex: 'F_0 = \\frac{2E}{\\pi w^2}',
      vars: {
        F: { name: 'fluence at the centre of the beam', q: 'fluence', unit: 'J/cm²', tex: 'F_0' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'mJ', value: 10, min: 0.000001, max: 100000 },
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm', value: 0.5, min: 0.001, max: 100 }
      },
      stories: { F: 'A pulse of {E} arrives in a Gaussian beam of radius {w}. What is the fluence at its centre?' }
    },
    {
      name: 'Threshold at another pulse length',
      expr: 'L2 = L1*sqrt(t2/t1)', tex: '\\mathrm{LIDT}_2 \\approx \\mathrm{LIDT}_1\\sqrt{\\frac{\\tau_2}{\\tau_1}}',
      vars: {
        L2: { name: 'threshold at the new pulse length', q: 'fluence', unit: 'J/cm²', tex: '\\mathrm{LIDT}_2' },
        L1: { name: 'stated threshold', q: 'fluence', unit: 'J/cm²', value: 5, min: 0.001, max: 1000, tex: '\\mathrm{LIDT}_1' },
        t1: { name: 'pulse length of the stated threshold', q: 'time', unit: 'ns', value: 10, min: 0.02, max: 100, tex: '\\tau_1' },
        t2: { name: 'pulse length in use', q: 'time', unit: 'ns', value: 1, min: 0.02, max: 100, tex: '\\tau_2' }
      },
      note: 'A rule of thumb for thermal damage, roughly 20 ps to 100 ns. It does not hold for femtosecond pulses or for continuous beams.'
    },
    {
      name: 'Safety factor',
      expr: 'S = L/F', tex: 'S = \\frac{\\mathrm{LIDT}}{F_0}',
      vars: {
        S: { name: 'safety factor' },
        L: { name: 'damage threshold for the conditions in use', q: 'fluence', unit: 'J/cm²', value: 10, min: 0.001, max: 1000, tex: '\\mathrm{LIDT}' },
        F: { name: 'peak fluence in use', q: 'fluence', unit: 'J/cm²', value: 2.55, min: 0.000001, max: 1000, tex: 'F_0' }
      },
      note: 'Aim for two to three or more.'
    },
    {
      name: 'Beam radius needed for a given fluence',
      expr: 'w = sqrt(2*E/(pi*F))', tex: 'w = \\sqrt{\\frac{2E}{\\pi F_0}}',
      vars: {
        w: { name: 'beam radius (1/e²)', q: 'length', unit: 'mm' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'mJ', value: 100, min: 0.000001, max: 100000 },
        F: { name: 'peak fluence allowed', q: 'fluence', unit: 'J/cm²', value: 1, min: 0.000001, max: 1000, tex: 'F_0' }
      },
      stories: { w: 'A pulse of {E} must not exceed {F} at the centre of the beam. How large must the beam radius be on the optic?' }
    }
  ],
  examples: [
    {
      title: 'Is this mirror safe?',
      q: 'A Q-switched laser gives 10 mJ pulses of 10 ns at 1064 nm in a Gaussian beam of 0.5 mm radius. A mirror is rated 10 J/cm² at 1064 nm and 10 ns. What is the peak fluence and the safety factor?',
      steps: [
        { text: 'The radius is 0.05 cm, so the peak fluence is', tex: 'F_0 = \\frac{2 \\times 0.010}{\\pi \\times 0.05^2} = 2.55\\ \\mathrm{J/cm^2}' },
        { text: 'The safety factor:', tex: 'S = \\frac{10}{2.55} = 3.9' }
      ],
      a: '2.55 J/cm² at the centre — twice the 1.27 J/cm² that energy over area would suggest — and a margin of 3.9: acceptable. A protected aluminium mirror rated a few tenths of a J/cm² would be destroyed.'
    },
    {
      title: 'A shorter pulse',
      q: 'An anti-reflection coating is rated 5 J/cm² at 1064 nm for 10 ns pulses. Estimate its threshold for 1 ns pulses, and the beam radius a 2 mJ, 1 ns pulse needs for a safety factor of 3.',
      steps: [
        { text: 'Scale with the square root of the pulse length:', tex: '\\mathrm{LIDT} \\approx 5\\sqrt{\\tfrac{1}{10}} = 1.58\\ \\mathrm{J/cm^2}' },
        { text: 'The peak fluence allowed:', tex: 'F_0 = \\frac{1.58}{3} = 0.53\\ \\mathrm{J/cm^2}' },
        { text: 'The radius:', tex: 'w = \\sqrt{\\frac{2 \\times 0.002}{\\pi \\times 0.53}} = 0.049\\ \\mathrm{cm} = 0.49\\ \\mathrm{mm}' }
      ],
      a: 'About 1.6 J/cm² at 1 ns, and a beam radius of at least 0.5 mm on the coating. The estimate should be confirmed with the maker for the real pulse length.'
    }
  ],
  quiz: [
    { q: 'A Gaussian beam carries a pulse of energy E in a radius w. The fluence at its centre is…', choices: ['E/πw²', '2E/πw²', 'E/2πw²', 'E/w'], a: 1, why: 'The peak of a Gaussian is twice its average over the 1/e² circle. Comparing the average with the threshold underestimates the risk by a factor of two.' },
    { q: 'A coating is rated 8 J/cm² for 10 ns pulses. By the square-root rule, what is its threshold for 40 ns pulses, in J/cm²?', answer: 16, unit: 'J/cm²', why: '$8\\sqrt{40/10} = 8 \\times 2 = 16$ J/cm². Longer pulses give the heat time to spread.' },
    { q: 'Which mirror coating stands the highest pulsed fluence?', choices: ['Protected aluminium', 'Protected silver', 'A dielectric laser-line mirror', 'Bare gold'], a: 2, why: 'A dielectric stack absorbs almost nothing, so little heat is deposited. Metals absorb a few per cent in a very thin skin and fail at far lower fluence.' },
    { q: 'Laser damage usually starts in the perfect parts of a coating, where the field is highest.', a: false, why: 'It usually starts at defects: nodules, inclusions, scratches and dirt, which absorb or concentrate the light.' },
    { q: 'A catalogue states "LIDT 10 J/cm²" with no other data. What is missing?', choices: ['Nothing; it is complete', 'The wavelength, pulse length and repetition rate of the test', 'The colour of the coating', 'The price'], a: 1, why: 'A threshold depends strongly on wavelength and pulse length, and on repetition rate and spot size. Without them the number cannot be applied.' }
  ],
  applications: [
    'Choosing mirrors, windows and lenses for Q-switched and ultrafast lasers, and the beam size on each of them.',
    'Laser marking, cutting and welding heads, where the protective window is the part that ages.',
    'High-energy laser facilities, whose large optics are scanned for damage sites and repaired between shots.',
    'Outdoor, military and space optics, specified by durability tests against sand, salt and humidity.',
    'Spectacle and camera lens coatings, tested for abrasion, adhesion and damp heat rather than for laser light.'
  ],
  history: 'Damage to optics appeared with the first Q-switched ruby lasers in the early 1960s, and limited every powerful laser built afterwards. Since 1969 an annual meeting at Boulder, Colorado, has been devoted to it, and the test methods grew from that work into the standards used now. The square-root scaling with pulse length was established in systematic measurements published in the 1980s and 1990s.',
  sources: [
    'R. M. Wood, *Laser-Induced Damage of Optical Materials* — mechanisms, scaling rules and the measurement of thresholds.',
    'B. C. Stuart et al., "Nanosecond-to-femtosecond laser-induced breakdown in dielectrics", *Physical Review B* 53 (1996) — the dependence on pulse length.',
    'ISO 21254, *Lasers and laser-related equipment — Test methods for laser-induced damage threshold*; ISO 9211, *Optics and photonics — Optical coatings* — the durability tests.',
    'H. A. Macleod, *Thin-Film Optical Filters* — the chapter on production and on the durability of coatings.'
  ],
  sim: 'cf-damage'
}
);
