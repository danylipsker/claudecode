/* HYPER-OPTICS · content/optical-materials.js — the topic "Optical materials" (simulations: sims/optical-materials.js, prefix om-)
 *   optical-glass, the-abbe-number-and-glass-map, dispersion-formulas, transmission-and-absorption,
 *   uv-and-infrared-materials, optical-plastics, optical-crystals, thermal-effects-in-optics,
 *   glass-quality-and-defects, surface-quality-and-flatness, optical-drawings-and-iso-10110, making-optics
 */
Hyper.add(

/* ================================================================ optical glass */
{
  id: 'optical-glass', parent: 'optical-materials', title: 'Optical glass: crowns and flints', level: 1,
  short: 'Optical glass is glass made for its optics: a catalogue of a hundred-odd types, each fixed by two numbers, the refractive index and the Abbe number, written together as a six-digit glass code. Crowns disperse light weakly, flints strongly; N-BK7 is the everyday crown.',
  keywords: ['optical glass', 'crown glass', 'flint glass', 'N-BK7', 'BK7', 'glass code', 'six-digit code', '517642', 'glass catalogue', 'lead-free glass', 'borosilicate crown', 'dense flint', 'lanthanum crown', 'fluor crown', 'glass type', 'nd', 'Vd', 'melt'],
  prereq: ['refractive-index', 'dispersion-and-the-spectrum', 'snells-law'],
  related: ['the-abbe-number-and-glass-map', 'glass-quality-and-defects', 'achromatic-doublet', 'apochromats-and-ed-glass', 'optical-plastics', 'optical-crystals', 'transmission-and-absorption', 'making-optics', 'physics:dispersion'],
  body: `
Almost every lens, prism and window in an instrument is cut from **optical glass**: glass melted, stirred and cooled for its optical quality rather than for its strength or looks. It is clearer, far more uniform and much more tightly specified than window glass; a bubble nobody would notice in a bottle can scatter enough light to spoil a lens.

### Two numbers fix a glass
How a glass behaves in an optical system comes down to two properties:

- the **refractive index** $n_d$, measured at the yellow helium line (587.56 nm): how strongly it bends light;
- the **Abbe number** $V_d$: how much the index changes with colour. A high $V_d$ means weak dispersion ([[the-abbe-number-and-glass-map|the next page]] draws the map).

Density, expansion, transmission and price come second, but they decide many choices.

### Crown and flint
The names are old. *Crown glass* was spun into discs for windows; *flint glass* was lead glass, named after the flints that once supplied its silica. In 1758 John Dollond put a crown lens and a flint lens together so that the colour fringes of one cancelled those of the other, the first practical achromat. The words survive as two classes:

| | Abbe number | Index $n_d$ | Examples |
|---|---|---|---|
| Crown | above about 50 | 1.46 to about 1.75 | N-BK7, N-K5, N-SK16, N-FK51A |
| Flint | below about 50 | 1.57 to about 1.95 | F2, N-SF5, N-SF11 |

The conventional dividing line is $V_d = 55$ for $n_d < 1.60$ and $V_d = 50$ above that. An [[achromatic-doublet|achromatic doublet]] pairs one of each.

### Reading a glass name
The letters are families. **BK** borosilicate crown, **K** crown, **SK** dense (heavy) crown, **LAK** lanthanum crown, **FK** fluor crown, **F** flint, **BAF** barium flint, **SF** dense flint. The prefix **N-** marks the modern lead- and arsenic-free versions that replaced most older types: N-BK7 is the glass of the table below, while a plain *F2* is a classic leaded flint. Heavy ingredients (barium, lanthanum, titanium, niobium) raise the index and the price.

### The glass code
Glass is ordered by one number that holds both properties. Take $n_d - 1$ to three digits and $10\\,V_d$ to three digits:

| Glass | Code | $n_d$ | $V_d$ | Density (g/cm³) |
|---|---|---|---|---|
| N-FK51A | 487845 | 1.4866 | 84.5 | 3.68 |
| Fused silica | 458678 | 1.4585 | 67.8 | 2.20 |
| N-BK7 | 517642 | 1.5168 | 64.2 | 2.51 |
| N-SK16 | 620603 | 1.6204 | 60.3 | 3.58 |
| F2 | 620364 | 1.6200 | 36.4 | 3.60 |
| N-SF11 | 785257 | 1.7847 | 25.7 | 3.22 |

So 517642 reads: index 1.517, Abbe number 64.2. Adding the density gives a seven-digit code, 517642.251 for N-BK7. A near-equivalent from another maker has the same or a neighbouring code, which is how a designer finds a substitute. The code is rounded: two melts of the same code are close, not identical.

### How glass is bought
A catalogue sheet gives the index at a dozen spectral lines, the dispersion constants ([[dispersion-formulas]]), the transmission ([[transmission-and-absorption]]), expansion, density and hardness. An order adds tolerances: $\\pm 0.0005$ in $n_d$ is the usual standard grade. Grades for homogeneity, stress, bubbles and striae are on [[glass-quality-and-defects]].

> [!key] Optical glass is chosen by index and Abbe number, which together make the six-digit glass code (517642 is N-BK7). Crowns ($V_d$ above about 50) disperse little, flints a lot; designers combine them to cancel colour error.
`,
  ideas: [
    'A glass is chosen by two numbers: the index n_d (how much it bends) and the Abbe number V_d (how little it disperses).',
    'Crown glass has V_d above about 50 and weak dispersion; flint glass is below, with strong dispersion. A doublet pairs one of each.',
    'The six-digit glass code is (n_d − 1) to three digits followed by 10 × V_d to three digits: 517642 is n_d 1.517, V_d 64.2.',
    'The N- prefix marks lead- and arsenic-free glasses; the letters BK, SK, LAK, FK, F, SF name the family.',
    'Besides the code a glass order fixes tolerances on index, homogeneity, stress, bubbles and striae.'
  ],
  pitfalls: [
    'Flint glass is made from flints — Today it has no flint in it. The word marks high dispersion (V_d below about 50), and the modern N- flints get their high index from titanium and niobium oxides instead of lead.',
    'A higher index is always better — A high index bends light more with gentler curves, but it usually brings stronger dispersion, more absorption in the blue, higher density and a higher price. The best glass is the one that fits the job.',
    'All BK7 is the same, whoever sells it — The code is rounded and each maker has its own melt; near-equivalents differ in the fourth decimal of the index and a little in the transmission. A lens design is traced with the exact data of the glass chosen.',
    'Optical glass is just very clean window glass — Window glass has a similar index but varies from batch to batch, carries iron that tints it green, has striae and is cooled in hours. Optical glass is melted in small controlled batches, annealed for days and tested piece by piece.'
  ],
  terms: [
    { term: 'Optical glass', def: 'Glass made and tested for use in lenses, prisms and windows: controlled index and dispersion, high homogeneity, few bubbles and low stress. It is sold as blanks, slabs or rods with a catalogue datasheet.' },
    { term: 'Crown glass', also: ['crown', 'K glass'], def: 'Optical glass of low dispersion (Abbe number above about 50) and usually lower index. N-BK7 is the everyday crown. The word comes from the discs once spun for windows.' },
    { term: 'Flint glass', also: ['flint', 'F glass'], def: 'Optical glass of higher dispersion (Abbe number below about 50) and usually higher index, such as F2 and N-SF11. Originally a lead glass; paired with a crown it cancels colour error.' },
    { term: 'Glass code', also: ['glass number', 'six-digit code', 'glass designation'], def: 'A six-digit number: n_d − 1 to three digits followed by 10 × V_d to three digits. 517642 means n_d = 1.517, V_d = 64.2. A seventh group, the density, may follow after a full stop.' },
    { term: 'N- glass', also: ['lead-free glass', 'eco glass'], def: 'A catalogue glass whose name starts with N-, made without lead and arsenic. Most older leaded types have an N- successor with a close index and Abbe number.' },
    { term: 'Glass catalogue', also: ['glass datasheet', 'melt data'], def: 'The maker\'s list of glass types with index at many spectral lines, dispersion constants, transmission, thermal and mechanical data. Lens-design software holds these catalogues.' }
  ],
  formulas: [
    {
      name: 'Principal dispersion from the glass code',
      expr: 'Dn = (nd - 1)/Vd', tex: '\\Delta n = \\frac{n_d - 1}{V_d}',
      vars: {
        Dn: { name: 'principal dispersion n_F − n_C', tex: '\\Delta n' },
        nd: { name: 'index at the d line', value: 1.5168, min: 1, max: 4, tex: 'n_d' },
        Vd: { name: 'Abbe number', value: 64.2, min: 5, max: 120, tex: 'V_d' }
      },
      note: 'The spread between the blue (F) and red (C) indices: for N-BK7 0.0081, for N-SF11 0.0306.',
      stories: { Dn: 'A glass has n_d = {nd} and an Abbe number of {Vd}. By how much does its index change between the blue F line and the red C line?' }
    }
  ],
  examples: [
    {
      title: 'Decoding a glass code',
      q: 'A drawing calls for glass 620603. What are its index and Abbe number, is it a crown or a flint, and which glass in the table above is it?',
      steps: [
        'The first three digits, 620, are $n_d - 1$ in thousandths: $n_d = 1.620$.',
        'The last three, 603, are ten times the Abbe number: $V_d = 60.3$.',
        'Above 50 means a crown, and with $n_d$ above 1.60 a *dense* crown. In the table that is N-SK16.'
      ],
      a: 'n_d = 1.620, V_d = 60.3: a dense crown, N-SK16. Note that F2 (620364) has the same index and a very different Abbe number: the index alone does not identify a glass.'
    },
    {
      title: 'How much more does a dense flint spread the colours?',
      q: 'Compare N-BK7 (517642) with N-SF11 (785257): by what factor is the principal dispersion $n_F - n_C$ larger in the flint?',
      steps: [
        { text: 'N-BK7:', tex: '\\Delta n = \\frac{0.517}{64.2} = 0.00805' },
        { text: 'N-SF11:', tex: '\\Delta n = \\frac{0.785}{25.7} = 0.03055' },
        'The ratio is $0.03055/0.00805 = 3.8$.'
      ],
      a: 'N-SF11 spreads blue and red almost four times as much as N-BK7. A prism or a lens of the same shape gives almost four times the colour fringing.'
    }
  ],
  quiz: [
    { q: 'What is the refractive index $n_d$ of a glass with the code 517642?', choices: ['1.517', '1.642', '5.17', '1.76'], a: 0, why: 'The first three digits are $n_d - 1$ in thousandths: 517 gives $n_d = 1.517$. The last three digits, 642, are the Abbe number multiplied by ten (64.2).' },
    { q: 'Which of these glasses disperses colours the most?', choices: ['N-FK51A, 487845', 'N-BK7, 517642', 'N-SK16, 620603', 'F2, 620364'], a: 3, why: 'The lowest Abbe number disperses the most: 36.4 for F2, against 84.5, 64.2 and 60.3 for the others. F2 and N-SK16 have the same index, so the Abbe number is what tells them apart.' },
    { q: 'The prefix N- on a glass such as N-SF11 means that the glass is free of lead and arsenic.', a: true, why: 'The N- types replaced most older leaded and arsenic-bearing glasses with close optical data. A plain F2 is a classic leaded flint.' },
    { q: 'A glass has $n_d = 1.785$ and $V_d = 25.7$. What is $n_F - n_C$?', answer: 0.0305, why: '$n_F - n_C = (n_d - 1)/V_d = 0.785/25.7 = 0.0305$.' },
    { q: 'Why is an achromatic doublet made from a crown and a flint rather than from two crowns?', choices: ['Their dispersions differ, so the colour error of one can cancel that of the other', 'Flint glass has a lower index and so makes thinner lenses', 'Two crowns would be too heavy', 'The flint absorbs the blue light that would blur the image'], a: 0, why: 'Cancelling the colour error needs two glasses whose Abbe numbers are different; two glasses of equal dispersion would cancel nothing. Flint glass has the higher index, not the lower.' }
  ],
  applications: [
    'Camera, microscope and projector lenses: every element is a glass chosen from the catalogue, and a ten-element photographic zoom may use six or seven different types.',
    'Binocular and rangefinder prisms: N-BAK4 (n = 1.569, critical angle 39.6°) beats N-BK7 (n = 1.517, 41.2°) because total reflection then holds over the whole aperture and the exit pupil stays round.',
    'Telescope objectives and apochromats: a fluor crown such as N-FK51A (V_d 84.5) with an unusual blue dispersion removes the last of the colour fringes.',
    'Laser windows, beam splitters and mirror substrates: N-BK7 for the visible and near infrared, fused silica when the ultraviolet or a high damage threshold is needed.',
    'Spectacle lenses: ordinary crown glass (n = 1.523) was the standard until plastics took over.'
  ],
  history: 'Chester Moor Hall made an achromatic lens in 1733 and John Dollond patented his in 1758, both from a crown and a flint. For another century lens makers had only a handful of glasses. Otto Schott founded his glassworks at Jena in 1884 with Ernst Abbe and Carl Zeiss, and the new borosilicate and barium glasses filled the empty regions of the glass map; the first catalogues of the 1880s listed a few dozen types. The lead-free N- glasses arrived in the 1990s and early 2000s.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, the chapter on optical materials and coatings — glass types, the glass code and the Abbe diagram.',
    'ISO 12123, *Optics and photonics — Specification of raw optical glass* — the properties and grades that a glass order states.',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — optical glasses and their data.',
    'Optical-glass makers\' technical information sheets (published with each catalogue) on refractive index and dispersion, transmittance, homogeneity and stress.'
  ],
  sim: 'om-glass-code'
},

/* ================================================================ the Abbe number and the glass map */
{
  id: 'the-abbe-number-and-glass-map', parent: 'optical-materials', title: 'The Abbe number and the glass map', level: 2,
  short: 'The Abbe number V = (n_d − 1)/(n_F − n_C) rates how strongly a material spreads colours: a high V means little spread. Plotting index against Abbe number gives the glass map, with crowns on the left and flints on the right; every achromatic design is a choice of two points on it.',
  keywords: ['Abbe number', 'Abbe diagram', 'glass map', 'glass diagram', 'Vd', 'V-number', 'constringence', 'nu d', 'principal dispersion', 'partial dispersion', 'P_gF', 'normal line', 'ED glass', 'achromat', 'crown', 'flint', 'dispersion'],
  prereq: ['optical-glass', 'dispersion-and-the-spectrum', 'refractive-index'],
  related: ['dispersion-formulas', 'achromatic-doublet', 'apochromats-and-ed-glass', 'axial-chromatic-aberration', 'optical-plastics', 'prism-deviation', 'physics:dispersion'],
  body: `
The refractive index says how much a glass bends light; the **Abbe number** says how much it bends different colours by different amounts. It is named after Ernst Abbe and defined from the index at three standard spectral lines:

$$V_d = \\frac{n_d - 1}{n_F - n_C}$$

$n_d$ is the index in the yellow line of helium (587.56 nm), $n_F$ in the blue line of hydrogen (486.13 nm) and $n_C$ in its red line (656.27 nm). The numerator measures how strongly the middle of the spectrum is bent; the denominator, the **principal dispersion** $n_F - n_C$, how much farther the blue is bent than the red. Strong bending and weak spread make a big $V$. A *low* Abbe number is *high* dispersion.

### Some values
| Material | $n_d$ | $V_d$ | $n_F - n_C$ |
|---|---|---|---|
| Calcium fluoride | 1.4338 | 95.0 | 0.0046 |
| N-FK51A (fluor crown) | 1.4866 | 84.5 | 0.0058 |
| N-BK7 | 1.5168 | 64.2 | 0.0081 |
| Acrylic (PMMA) | 1.4918 | 57.4 | 0.0086 |
| F2 flint | 1.6200 | 36.4 | 0.0171 |
| Polycarbonate | 1.5855 | 29.9 | 0.0196 |
| N-SF11 dense flint | 1.7847 | 25.7 | 0.0306 |

### The glass map
Put every glass on a plot with the index $n_d$ upwards and the Abbe number $V_d$ along the bottom, running from high on the left to low on the right (the old convention, so that the dispersive glasses sit on the right). This is the **Abbe diagram**, or glass map. Most glasses fall along a band from the lower left (low index, low dispersion: fluor crowns) to the upper right (high index, high dispersion: dense flints). Crowns lie left of the line at $V_d \\approx 50$ to 55, flints right of it. Plastics and crystals fit on the same map: PMMA among the crowns, polycarbonate among the flints, calcium fluoride and magnesium fluoride at the far left.

### Why designers read it
A thin achromat needs two lenses with powers in the ratio of their Abbe numbers, so the focal lengths of crown and flint satisfy

$$f_1 = f\\,\\frac{V_1 - V_2}{V_1} \\qquad f_2 = -f\\,\\frac{V_1 - V_2}{V_2}$$

The two points should be far apart horizontally. For $f = 100$ mm, N-BK7 with F2 ($\\Delta V = 27.8$) needs lenses of 43 mm and −76 mm; a fluor crown with a dense flint such as N-SF5 ($\\Delta V = 52$) needs 62 mm and −162 mm, much gentler curves with much less aberration. That is the use of fluor crowns and lanthanum glasses: they stretch the map.

### What the Abbe number leaves out
$V_d$ looks only at the red-to-blue part of the spectrum. How the *far* blue is bent is told by the **relative partial dispersion** $P_{g,F} = (n_g - n_F)/(n_F - n_C)$, with the g line at 435.83 nm. Most glasses lie on a straight "normal line" on a plot of $P_{g,F}$ against $V_d$; glasses that sit off it, such as N-FK51A with $P_{g,F} = 0.536$ against 0.50 on the line, can cancel the secondary spectrum that two normal glasses leave behind: [[apochromats-and-ed-glass|apochromats]].

> [!tip] A thin lens of focal length $f$ focuses blue light $f/V_d$ nearer than red: 1.6 mm on a 100 mm N-BK7 singlet.

> [!key] $V_d = (n_d - 1)/(n_F - n_C)$: high means little dispersion. On the glass map crowns are left of $V_d \\approx 50$, flints right; an achromat uses two glasses far apart in $V_d$.
`,
  ideas: [
    'V_d = (n_d − 1)/(n_F − n_C), from the index at the d (587.56 nm), F (486.13 nm) and C (656.27 nm) lines.',
    'A high Abbe number means weak dispersion; crowns have V_d above about 50, flints below.',
    'On the glass map index runs upwards and V_d from high on the left to low on the right; the glasses fall in a band from fluor crowns to dense flints.',
    'An achromat is made from two glasses far apart in V_d: the more they differ, the gentler the lens curves.',
    'The Abbe number covers only F to C; partial dispersion P_g,F tells how glasses behave in the far blue and sets the secondary spectrum.'
  ],
  pitfalls: [
    'A high Abbe number means strong dispersion — It is the other way round: V is large when the spread n_F − n_C is small. Fluorite, V = 95, is the least dispersive glass-like material; dense flint, V = 26, the most.',
    'Two glasses with the same index disperse alike — N-SK16 and F2 both have n_d = 1.620, yet F2 spreads the colours 1.7 times as much (V_d 36.4 against 60.3).',
    'The Abbe number describes the whole spectrum — It uses only three lines. Two glasses of equal V_d can differ in the blue, which is why partial dispersion exists and why apochromats need special glasses.',
    'Crown and flint are defined by the index — They are defined by the Abbe number. Lanthanum crowns have indices up to 1.7 and are still crowns.'
  ],
  terms: [
    { term: 'Abbe number', also: ['V_d', 'ν_d', 'V-number', 'constringence'], def: 'V_d = (n_d − 1)/(n_F − n_C): the index excess divided by the principal dispersion. A high value means a weakly dispersive material (a crown), a low value a strongly dispersive one (a flint).' },
    { term: 'Principal dispersion', also: ['mean dispersion', 'n_F − n_C'], def: 'The difference between the indices at the F (486.13 nm) and C (656.27 nm) lines: how much more strongly the blue is refracted than the red.' },
    { term: 'Spectral lines F, d, C', also: ['Fraunhofer lines', 'd-line'], def: 'The reference wavelengths of glass data: F, blue hydrogen, 486.13 nm; d, yellow helium, 587.56 nm; C, red hydrogen, 656.27 nm. Catalogues also list e (546.07 nm), g (435.83 nm) and others.' },
    { term: 'Abbe diagram', also: ['glass map', 'glass diagram'], def: 'A plot of refractive index n_d against Abbe number V_d, with V_d decreasing to the right, on which every glass is a point. Designers read it to pick glasses for achromats.' },
    { term: 'Relative partial dispersion', also: ['P_g,F', 'partial dispersion'], def: 'P_g,F = (n_g − n_F)/(n_F − n_C): how much of the principal dispersion lies in the blue end (g to F). Glasses off the normal line of P_g,F against V_d are used to cancel the secondary spectrum.' },
    { term: 'ED glass', also: ['extra-low dispersion glass', 'anomalous-dispersion glass'], def: 'A glass with a high Abbe number and an unusual partial dispersion, such as the fluor crown N-FK51A or calcium fluoride, used to reduce residual colour error in telephoto lenses and apochromats.' }
  ],
  formulas: [
    {
      name: 'The Abbe number',
      expr: 'Vd = (nd - 1)/(nF - nC)', tex: 'V_d = \\frac{n_d - 1}{n_F - n_C}',
      vars: {
        Vd: { name: 'Abbe number', tex: 'V_d' },
        nd: { name: 'index at the d line, 587.56 nm', value: 1.5168, min: 1, max: 4, tex: 'n_d' },
        nF: { name: 'index at the F line, 486.13 nm', value: 1.52238, min: 1, max: 4, tex: 'n_F' },
        nC: { name: 'index at the C line, 656.27 nm', value: 1.51432, min: 1, max: 4, tex: 'n_C' }
      },
      solveFor: 'Vd',
      note: 'The default values are N-BK7.',
      stories: { Vd: 'A glass has indices of {nF} in the blue F line, {nd} in the d line and {nC} in the red C line. What is its Abbe number?' }
    },
    {
      name: 'Colour shift of a thin lens',
      expr: 'df = f/Vd', tex: '\\Delta f = \\frac{f}{V_d}',
      vars: {
        df: { name: 'focal length of the red light minus that of the blue', q: 'length', unit: 'mm', tex: '\\Delta f' },
        f: { name: 'focal length at the d line', q: 'length', unit: 'mm', value: 100 },
        Vd: { name: 'Abbe number of the lens glass', value: 64.2, min: 5, max: 120, tex: 'V_d' }
      },
      note: 'Thin lens in air: f_C − f_F ≈ f/V_d. The blue focus is that much nearer the lens.',
      stories: { df: 'A thin lens of focal length {f} is made of glass with an Abbe number of {Vd}. How much nearer to the lens does blue light focus than red?' }
    },
    {
      name: 'Crown element of a thin achromat',
      expr: 'f1 = f*(V1 - V2)/V1', tex: 'f_1 = f\\,\\frac{V_1 - V_2}{V_1}',
      vars: {
        f1: { name: 'focal length of the crown element', q: 'length', unit: 'mm', tex: 'f_1' },
        f: { name: 'focal length of the doublet', q: 'length', unit: 'mm', value: 100 },
        V1: { name: 'Abbe number of the crown', value: 64.2, min: 5, max: 120, tex: 'V_1' },
        V2: { name: 'Abbe number of the flint', value: 36.4, min: 5, max: 120, tex: 'V_2' }
      },
      note: 'Thin lenses in contact. The flint element has f_2 = −f_1 V_1/V_2.',
      stories: { f1: 'A 100 mm achromat is made from a crown of Abbe number {V1} and a flint of {V2}. What is the focal length of the crown element?' }
    }
  ],
  examples: [
    {
      title: 'Which pair makes the gentler doublet?',
      q: 'A 100 mm achromat is to be made either from N-BK7 and F2 (Abbe numbers 64.2 and 36.4) or from N-FK51A and N-SF5 (84.5 and 32.3). Find the focal lengths of the elements in each.',
      steps: [
        { text: 'N-BK7 with F2:', tex: 'f_1 = 100\\,\\frac{64.2 - 36.4}{64.2} = 43.3\\ \\mathrm{mm},\\quad f_2 = -100\\,\\frac{27.8}{36.4} = -76.4\\ \\mathrm{mm}' },
        { text: 'N-FK51A with N-SF5:', tex: 'f_1 = 100\\,\\frac{52.2}{84.5} = 61.8\\ \\mathrm{mm},\\quad f_2 = -100\\,\\frac{52.2}{32.3} = -161.9\\ \\mathrm{mm}' },
        'The second pair has the larger gap in Abbe number, so each lens needs less power and has flatter surfaces.'
      ],
      a: '43 mm and −76 mm against 62 mm and −162 mm. Flatter surfaces mean less spherical aberration and an easier design, which is why high-end achromats use glasses far apart on the map.'
    },
    {
      title: 'Colour error of a singlet',
      q: 'A 50 mm focal-length singlet of N-BK7 ($V_d = 64.2$) images a white point. How far apart are the blue and the red foci?',
      steps: [
        { text: 'For a thin lens:', tex: '\\Delta f = \\frac{f}{V_d} = \\frac{50\\ \\mathrm{mm}}{64.2} = 0.78\\ \\mathrm{mm}' }
      ],
      a: 'About 0.8 mm, the colour error (axial chromatic aberration) that a doublet is designed to remove.'
    }
  ],
  quiz: [
    { q: 'A material has $V_d = 95$. Compared with N-BK7 ($V_d = 64$) its dispersion is…', choices: ['weaker', 'stronger', 'the same', 'zero'], a: 0, why: 'A higher Abbe number means a smaller spread $n_F - n_C$ relative to $n_d - 1$. Calcium fluoride, with $V_d = 95$, has weaker dispersion than any ordinary glass.' },
    { q: 'On the Abbe diagram, where do you find dense flint glasses such as N-SF11?', choices: ['Upper right: high index, low Abbe number', 'Lower left: low index, high Abbe number', 'Upper left', 'Lower right'], a: 0, why: 'With the Abbe number decreasing to the right, high-index, strongly dispersive glasses lie at the upper right; fluor crowns lie at the lower left.' },
    { q: 'Two glasses with the same refractive index $n_d$ must also have the same Abbe number.', a: false, why: 'Index and Abbe number are independent properties. N-SK16 and F2 both have $n_d = 1.620$ but $V_d$ of 60.3 and 36.4.' },
    { q: 'A thin singlet of N-BK7 ($V_d = 64.2$) has $f = 100$ mm. By how many millimetres do the red and blue foci differ?', answer: 1.56, why: '$\\Delta f = f/V_d = 100/64.2 = 1.56$ mm.' },
    { q: 'Why do designers of apochromats look for glasses off the "normal line" of partial dispersion?', choices: ['Their blue end is bent differently from ordinary glasses of the same Abbe number, which can cancel the secondary spectrum', 'They have the highest refractive indices', 'They absorb the blue light that causes fringes', 'They are the cheapest glasses'], a: 0, why: 'Two ordinary glasses on the normal line cannot cancel the colour error at three wavelengths at once. A glass with unusual partial dispersion can.' }
  ],
  applications: [
    'Lens design: the glass map is where a designer starts when choosing the crown and the flint of an achromat or the glasses of an apochromat.',
    'Telephoto and astronomical lenses use ED or fluor crown glass (V_d above 80) to cut colour fringes on bright edges.',
    'Spectacle lenses: the Abbe number of the lens material (CR-39 at 58, high-index plastics at 32 to 41) tells how much colour fringing the wearer will see when looking through the edge of the lens.',
    'Prism spectrometers: a dense flint gives the widest spread of colours for a given prism.'
  ],
  history: 'Ernst Abbe introduced the dispersion number in the 1870s and 1880s while working with Carl Zeiss on microscope objectives, and found that the available glasses could not remove the colour errors he wanted to correct. His collaboration with the glass chemist Otto Schott produced new glasses that moved points on the map and made the apochromatic microscope objective possible around 1886. The symbol is V in English-language and ν in German-language texts.',
  sources: [
    'E. Hecht, *Optics*, the sections on dispersion and on chromatic aberration — the Abbe number and its use in achromats.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* — the glass map and the choice of glasses for achromats and apochromats.',
    'W. J. Smith, *Modern Optical Engineering*, the chapters on aberrations and on optical materials — the Abbe number and partial dispersion.'
  ],
  sim: 'om-glass-map'
},

/* ================================================================ dispersion formulas */
{
  id: 'dispersion-formulas', parent: 'optical-materials', title: 'Dispersion formulas: Cauchy and Sellmeier', level: 3,
  short: 'A dispersion formula turns a handful of fitted constants into the refractive index at any wavelength. Cauchy\'s two-term formula works in the visible; Sellmeier\'s three resonance terms, valid from the ultraviolet to the infrared edge, is what glass catalogues print.',
  keywords: ['Sellmeier', 'Cauchy', 'dispersion formula', 'dispersion equation', 'Sellmeier coefficients', 'B1 B2 B3 C1 C2 C3', 'Schott formula', 'Herzberger', 'refractive index versus wavelength', 'n of lambda', 'group index', 'resonance', 'normal dispersion'],
  prereq: ['the-abbe-number-and-glass-map', 'refractive-index', 'dispersion-and-the-spectrum'],
  related: ['optical-glass', 'transmission-and-absorption', 'uv-and-infrared-materials', 'axial-chromatic-aberration', 'wavelength-frequency-and-colour', 'physics:dispersion', 'physics:electromagnetic-waves'],
  body: `
A catalogue lists the index at a dozen spectral lines. A designer needs it at 1064 nm for a laser, at 532 nm for another, at every wavelength of a spectrum. A **dispersion formula** closes the gap: a short expression with a few constants, fitted to measurements, that returns $n$ at any wavelength inside its range.

### Where the shape comes from
Electrons and ions in glass behave like tiny oscillators with natural frequencies in the ultraviolet and in the infrared. Light of a lower frequency than a resonance finds the glass more polarizable the closer it comes, so the index rises towards each resonance from the long-wavelength side. In the transparent window between the ultraviolet and infrared resonances the index therefore falls as the wavelength grows (**normal dispersion**), steeply in the blue, gently in the red.

### Sellmeier's formula
Each resonance becomes one term of the formula, with $\\lambda$ in micrometres:

$$n^2 = 1 + \\frac{B_1\\lambda^2}{\\lambda^2 - C_1} + \\frac{B_2\\lambda^2}{\\lambda^2 - C_2} + \\frac{B_3\\lambda^2}{\\lambda^2 - C_3}$$

The resonance of term $i$ sits at $\\lambda_i = \\sqrt{C_i}$ and $B_i$ is its strength. For N-BK7 the constants are $B = 1.0396,\\ 0.2318,\\ 1.0105$ and $C = 0.00600,\\ 0.02002,\\ 103.56\\ \\mu\\mathrm{m}^2$: resonances at 0.077 µm and 0.141 µm in the ultraviolet and at 10.2 µm in the infrared, where glass absorbs strongly. Three terms reproduce the index to better than $10^{-5}$ from about 0.3 to 2.3 µm.

| Wavelength | 365 nm | 486.1 nm | 587.6 nm | 632.8 nm | 1064 nm | 1550 nm |
|---|---|---|---|---|---|---|
| N-BK7 | 1.5363 | 1.5224 | 1.5168 | 1.5151 | 1.5066 | 1.5007 |
| Fused silica | 1.4745 | 1.4631 | 1.4585 | 1.4570 | 1.4496 | 1.4440 |

### Cauchy's formula
The older and simpler form is a power series in $1/\\lambda^2$:

$$n = A + \\frac{B}{\\lambda^2} + \\frac{C}{\\lambda^4}$$

Fitted over 400 to 700 nm, two terms give N-BK7 as $A = 1.5046$, $B = 0.00420\\ \\mu\\mathrm{m}^2$, right to about $10^{-4}$ across the visible. It has no physics behind it, though: it never "knows" about the infrared resonance, so it drifts away outside the fitted range. At 1550 nm the two-term fit gives 1.5063 where the real index is 1.5007. Use Cauchy to interpolate in the visible and Sellmeier for anything else.

### Beyond the phase index
- **Group index** $n_g = n - \\lambda\\,dn/d\\lambda$ is what a pulse of light feels: 1.546 against $n = 1.519$ for N-BK7 at 550 nm. It sets the speed of short pulses and the dispersion of fibres.
- **Validity.** A formula holds only inside the range it was fitted to; extrapolating past it can fail without warning.
- **Other forms.** Catalogues of crystals and infrared materials use Sellmeier with more terms; older ones use the Schott, Herzberger or Hartmann forms.
- **Temperature.** The constants belong to a stated temperature; $dn/dT$ is added separately ([[thermal-effects-in-optics]]).

> [!key] Sellmeier's formula sums one resonance per term and is valid from the ultraviolet edge to the infrared edge; Cauchy's $A + B/\\lambda^2$ fits only the visible. Wavelength in micrometres, always.
`,
  ideas: [
    'A dispersion formula gives n at any wavelength from a few constants fitted to catalogue data.',
    'Sellmeier: n² = 1 + Σ B_i λ²/(λ² − C_i), λ in µm; every term is a resonance of the material at √C_i.',
    'Cauchy: n = A + B/λ² + …; it fits the visible well and fails outside the fitted range.',
    'Glass has resonances in the ultraviolet (below 0.15 µm) and in the infrared (about 10 µm), which is why n falls with wavelength in between.',
    'Never extrapolate a formula beyond its stated range; the group index n − λ dn/dλ governs pulses.'
  ],
  pitfalls: [
    'The index is a constant of the glass — It is a function of wavelength: 1.5363 at 365 nm and 1.5007 at 1550 nm for N-BK7. Quoting "n = 1.52" without a wavelength is meaningful to about 0.01 only.',
    'Cauchy\'s formula is as good as Sellmeier\'s — Only where it was fitted. Outside the visible its error grows quickly (0.006 at 1550 nm for N-BK7), and it cannot represent a material with several resonances.',
    'The wavelength in the formula is in nanometres — Sellmeier and Cauchy constants are defined for micrometres. Entering 550 in place of 0.55 gives nonsense.',
    'Light in glass travels at c/n — Phase fronts do; a pulse travels at c/n_g, and the group index is larger (1.546 against 1.519 for N-BK7).'
  ],
  terms: [
    { term: 'Sellmeier equation', also: ['Sellmeier formula', 'Sellmeier coefficients'], def: 'n² = 1 + Σ B_i λ²/(λ² − C_i), with λ in micrometres: a sum of one term per resonance of the material. The constants B_i and C_i are tabulated for each glass and crystal.' },
    { term: 'Cauchy formula', also: ['Cauchy equation'], def: 'n = A + B/λ² + C/λ⁴: a power series in 1/λ² that fits the index of a transparent material in the visible. Two or three terms are common.' },
    { term: 'Normal dispersion', def: 'The usual behaviour of a transparent material: the index falls as the wavelength grows, so blue is bent more than red. Near an absorption band the opposite happens (anomalous dispersion).' },
    { term: 'Resonance wavelength', def: 'The wavelength √C_i of a Sellmeier term: where the material has a natural absorption band. Glass has two in the ultraviolet and one in the infrared.' },
    { term: 'Group index', also: ['n_g'], def: 'n_g = n − λ dn/dλ. A pulse of light travels at c/n_g, not at c/n. It is larger than n wherever dispersion is normal.' },
    { term: 'Spectral range of validity', also: ['fitted range'], def: 'The wavelength interval within which a dispersion formula has been fitted and checked. Outside it the formula should not be trusted.' }
  ],
  formulas: [
    {
      name: 'Sellmeier equation (three terms)',
      expr: 'n = sqrt(1 + B1*lam^2/(lam^2 - C1) + B2*lam^2/(lam^2 - C2) + B3*lam^2/(lam^2 - C3))',
      tex: 'n = \\sqrt{1 + \\frac{B_1\\lambda^2}{\\lambda^2 - C_1} + \\frac{B_2\\lambda^2}{\\lambda^2 - C_2} + \\frac{B_3\\lambda^2}{\\lambda^2 - C_3}}',
      vars: {
        n: { name: 'refractive index', tex: 'n' },
        lam: { name: 'wavelength in micrometres', q: false, unit: 'µm', value: 0.5876, min: 0.2, max: 2.4, tex: '\\lambda' },
        B1: { name: 'strength of the first resonance', q: false, value: 1.03961212, min: 0.01, max: 6, tex: 'B_1' },
        B2: { name: 'strength of the second resonance', q: false, value: 0.231792344, min: 0.01, max: 6, tex: 'B_2' },
        B3: { name: 'strength of the third resonance', q: false, value: 1.01046945, min: 0.01, max: 6, tex: 'B_3' },
        C1: { name: 'first resonance, squared', q: false, unit: 'µm²', value: 0.00600069867, min: 0.0001, max: 0.1, tex: 'C_1' },
        C2: { name: 'second resonance, squared', q: false, unit: 'µm²', value: 0.0200179144, min: 0.0001, max: 0.2, tex: 'C_2' },
        C3: { name: 'infrared resonance, squared', q: false, unit: 'µm²', value: 103.560653, min: 10, max: 1000, tex: 'C_3' }
      },
      solveFor: 'n',
      note: 'The values are N-BK7. Type the six constants of any other glass from its datasheet to get its index at any wavelength in its range.',
      practice: { unknowns: ['n'] },
      stories: { n: 'N-BK7 has the Sellmeier constants shown. What is its index at a wavelength of {lam} micrometres?' }
    },
    {
      name: 'Cauchy equation (two terms)',
      expr: 'n = A + B/lam^2', tex: 'n = A + \\frac{B}{\\lambda^2}',
      vars: {
        n: { name: 'refractive index', tex: 'n' },
        A: { name: 'long-wavelength index', q: false, value: 1.5046, min: 1, max: 4 },
        B: { name: 'dispersion constant', q: false, unit: 'µm²', value: 0.0042, min: 0.0001, max: 0.1 },
        lam: { name: 'wavelength in micrometres', q: false, unit: 'µm', value: 0.55, min: 0.35, max: 1.2, tex: '\\lambda' }
      },
      solveFor: 'n',
      note: 'A and B of N-BK7, fitted over 400 to 700 nm. Valid in the visible only.',
      stories: { n: 'Using the Cauchy constants A = {A} and B = {B} for N-BK7, what is the index at {lam} micrometres?' }
    },
    {
      name: 'Resonance wavelength of a Sellmeier term',
      expr: 'lamr = sqrt(C)', tex: '\\lambda_r = \\sqrt{C}',
      vars: {
        lamr: { name: 'resonance wavelength', q: false, unit: 'µm', tex: '\\lambda_r' },
        C: { name: 'Sellmeier constant C', q: false, unit: 'µm²', value: 103.560653, min: 0.0001, max: 2000 }
      },
      note: 'C = 103.56 µm² gives the infrared resonance of N-BK7 at 10.2 µm.',
      practice: false
    }
  ],
  examples: [
    {
      title: 'N-BK7 at 550 nm by hand',
      q: 'Use the Sellmeier constants of N-BK7 to find its index at 550 nm.',
      steps: [
        'With $\\lambda = 0.55$ µm, $\\lambda^2 = 0.3025$ µm².',
        { text: 'The three terms are', tex: '1.0397\\,\\frac{0.3025}{0.3025 - 0.0060} = 1.0607,\\quad 0.2318\\,\\frac{0.3025}{0.3025 - 0.0200} = 0.2482,\\quad 1.0105\\,\\frac{0.3025}{0.3025 - 103.56} = -0.0030' },
        { text: 'Add 1 and take the square root:', tex: 'n = \\sqrt{1 + 1.0607 + 0.2482 - 0.0030} = \\sqrt{2.3059} = 1.5185' }
      ],
      a: '$n = 1.5185$. The infrared term is tiny and negative here: far from a resonance the term is small, and on the short side of its resonance it lowers the index.'
    },
    {
      title: 'How wrong is a visible Cauchy fit in the infrared?',
      q: 'The two-term Cauchy constants of N-BK7 ($A = 1.5046$, $B = 0.0042$ µm²) were fitted in the visible. Compare their prediction at 1064 nm with the Sellmeier value 1.50663.',
      steps: [
        { text: 'At 1.064 µm:', tex: 'n = 1.5046 + \\frac{0.0042}{1.064^2} = 1.5046 + 0.00371 = 1.5083' },
        'The difference from 1.5066 is about 0.0017.'
      ],
      a: 'Cauchy gives 1.5083, an error of 0.0017: harmless for a quick estimate but ruinous for the focus of a laser lens at the wavelength where depth of focus is a few micrometres.'
    }
  ],
  quiz: [
    { q: 'In a Sellmeier formula, what does a term $B\\lambda^2/(\\lambda^2 - C)$ represent?', choices: ['An absorption resonance of the material at $\\lambda = \\sqrt{C}$', 'The absorption coefficient at wavelength $\\lambda$', 'The temperature dependence of the index', 'A correction for surface reflection'], a: 0, why: 'Each term has a pole at $\\lambda^2 = C$, the wavelength of a natural resonance. $B$ sets its strength. Absorption, temperature and reflection are separate effects.' },
    { q: 'Sellmeier constants for N-BK7 are given for $\\lambda$ in micrometres. A student inserts $\\lambda = 550$. What happens?', choices: ['The result is meaningless: it is a wavelength of 550 µm, far from the fitted range', 'The result is the index at 550 nm anyway', 'The formula returns an error because 550 is too large', 'The result is 550 times too large'], a: 0, why: 'The constants $C_i$ are in µm², so 550 means 550 µm, deep in the infrared where the formula is not valid.' },
    { q: 'Cauchy\'s formula fitted to the visible is trustworthy in the near infrared.', a: false, why: 'It has no infrared resonance in it and drifts away from the real index (by 0.0056 at 1550 nm for N-BK7). Sellmeier terms include the resonances and stay valid across the whole transparent range.' },
    { q: 'The infrared resonance of N-BK7 has $C_3 = 103.56\\ \\mu\\mathrm{m}^2$. At what wavelength, in micrometres, is it?', answer: 10.18, why: '$\\lambda_3 = \\sqrt{103.56} = 10.18$ µm. Silicate glasses absorb strongly near 9 to 10 µm, which is why ordinary glass is opaque in the thermal infrared.' },
    { q: 'Light of 550 nm in N-BK7 has phase index 1.519 and group index 1.546. A short pulse travels at…', choices: ['$c/1.546$, slower than the phase fronts', '$c/1.519$, the same as the phase fronts', '$c/1.546$, faster than the phase fronts', '$c$, as in vacuum'], a: 0, why: 'A pulse travels at the group velocity $c/n_g$. With normal dispersion $n_g > n$, so the envelope of the pulse is slower than the wave crests inside it.' }
  ],
  applications: [
    'Lens design software holds the Sellmeier constants of every catalogue glass and evaluates them at each wavelength of a trace.',
    'Laser optics: lenses and windows for 1064, 532, 355 and 266 nm need the index at exactly those wavelengths to find the true focus.',
    'Ultrafast lasers: the group-velocity dispersion that stretches a femtosecond pulse in glass comes from the second derivative of the Sellmeier curve.',
    'Optical fibres and waveguides: the zero-dispersion wavelength near 1.3 µm of silica follows from the same equation.',
    'Material identification: fitting measured indices to a Sellmeier form reveals a material\'s resonances.'
  ],
  history: 'Augustin-Louis Cauchy proposed his series in 1836, an empirical fit to the measured indices of transparent materials. Wolfgang Sellmeier derived his formula in 1871 from a mechanical picture of particles that oscillate when driven by the light wave, and quantum theory later gave it a new foundation in the twentieth century. Modern glass catalogues print Sellmeier constants fitted to indices measured to a few parts in 10⁻⁶.',
  sources: [
    'E. Hecht, *Optics*, the sections on dispersion and on the classical model of refraction — the oscillator picture behind Sellmeier\'s equation.',
    'M. Born and E. Wolf, *Principles of Optics*, the chapter on the electromagnetic theory of dispersion and absorption of light.',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — dispersion formulas and the constants of glasses and crystals.'
  ],
  sim: 'om-dispersion'
},

/* ================================================================ transmission and absorption */
{
  id: 'transmission-and-absorption', parent: 'optical-materials', title: 'Transmission and absorption', level: 2,
  short: 'Light arriving at a plate is split three ways: reflected at the two surfaces, absorbed along the path, scattered by flaws. The internal transmittance follows the Beer–Lambert law; the external transmittance adds the Fresnel losses, about 8 % for an uncoated plate of crown glass. Every material transmits only inside a window.',
  keywords: ['transmission', 'transmittance', 'internal transmittance', 'external transmittance', 'absorption', 'absorption coefficient', 'Beer-Lambert', 'Fresnel loss', 'reflection loss', 'transmission window', 'cutoff wavelength', 'optical density', 'tau', 'solarization', 'datasheet transmittance'],
  prereq: ['optical-glass', 'fresnel-reflection', 'dispersion-formulas'],
  related: ['uv-and-infrared-materials', 'why-surfaces-are-coated', 'neutral-density-and-optical-density', 'coloured-glass-filters', 'thermal-effects-in-optics', 'glass-quality-and-defects', 'physics:light-intensity', 'chemistry:beer-lambert'],
  body: `
A plate of clear glass looks as if it passes everything. It does not. Light that arrives is divided three ways: some is **reflected** at the two surfaces, some is **absorbed** on the way through, and a little is **scattered** by bubbles and inclusions. What emerges is the **transmittance**.

### Surface losses: Fresnel
At normal incidence each surface reflects a fraction $R = \\left(\\frac{n-1}{n+1}\\right)^2$ of the light ([[fresnel-reflection]]). For N-BK7 ($n = 1.519$ at 550 nm) that is 4.2 % per surface. Light bouncing back and forth between the two surfaces adds a little to the beam, and with no absorption at all the plate passes

$$T = \\frac{1 - R}{1 + R}$$

which is 91.9 % for N-BK7: about 8 % is lost to reflection however thin the plate is. Only a coating reduces it ([[why-surfaces-are-coated]]).

| Material | $n$ | $R$ per surface | $T$ of an uncoated plate |
|---|---|---|---|
| Fused silica | 1.46 | 3.5 % | 93.2 % |
| N-BK7 | 1.52 | 4.2 % | 91.9 % |
| N-SF11 | 1.79 | 8.0 % | 85.1 % |
| Zinc selenide (infrared) | 2.40 | 17.0 % | 70.9 % |
| Germanium (infrared) | 4.00 | 36.0 % | 47.0 % |

### Absorption inside: Beer–Lambert
In the material each millimetre removes the same *fraction* of the light. After a thickness $d$ the fraction that survives is the **internal transmittance**

$$\\tau_i = e^{-\\alpha d}$$

where $\\alpha$ is the absorption coefficient, in 1/mm or 1/cm. Doubling the thickness squares $\\tau_i$. Datasheets list $\\tau_i$ for 10 mm and 25 mm at many wavelengths, because it does not depend on the surfaces; good optical glass passes better than 99 % per 25 mm through most of the visible, and the figure falls only towards the ends of its window. What a spectrophotometer measures is the **external** (total) transmittance,

$$T = \\frac{(1-R)^2\\,\\tau_i}{1 - R^2\\tau_i^2}$$

### The window
Every material has two edges. At short wavelengths photons carry enough energy to lift electrons across the band gap, and the material turns opaque: the ultraviolet edge. At long wavelengths the lattice vibrates in resonance with the light: the infrared edge. Typical windows for a piece a few millimetres thick:

| N-BK7 | fused silica | sapphire | CaF₂ | PMMA | germanium |
|---|---|---|---|---|---|
| 350 nm – 2 µm | 185 nm – 2.1 µm | 170 nm – 5.5 µm | 130 nm – 9 µm | 390 nm – 1.6 µm | 2 – 14 µm |

The edges are gradual, and a thicker piece cuts in further. Beyond the edges the damage is fast: $e^{-\\alpha d}$ with $\\alpha$ rising by a factor ten within a few per cent of the edge wavelength.

### Other things that take light
Iron and other impurities tint thick glass (the green edge of window glass), absorption lines of water appear in silica, and ultraviolet or radiation can darken glass (*solarization*; cerium-doped glasses resist it). Absorbed power becomes heat ([[thermal-effects-in-optics]]).

> [!key] Loss at the surfaces ($R$ each) is independent of thickness; loss inside ($e^{-\\alpha d}$) grows with it. Crown glass loses about 8 % at its faces and well under 1 % in 25 mm of the glass itself.
`,
  ideas: [
    'A plate loses light by reflection at both surfaces, absorption inside and scattering from flaws.',
    'Each uncoated surface reflects R = ((n − 1)/(n + 1))²: 4.2 % on N-BK7, 36 % on germanium; the plate passes (1 − R)/(1 + R) with no absorption.',
    'Inside the material τ_i = e^(−αd): thickness squares or cubes the loss. The datasheet gives τ_i per 10 or 25 mm.',
    'External transmittance T = (1 − R)² τ_i /(1 − R² τ_i²) is what an instrument measures.',
    'Every material transmits only in a window, set by electronic absorption in the ultraviolet and lattice vibrations in the infrared.'
  ],
  pitfalls: [
    'Clear glass transmits 100 % of visible light — A plain N-BK7 plate passes about 92 %; the missing 8 % is reflected at the two surfaces, not absorbed. Ten uncoated surfaces pass 65 %.',
    'A thicker window loses more to reflection — Reflection loss is per surface and independent of thickness. Only the absorption loss depends on how much glass the light crosses.',
    'Transmittance is the same at all wavelengths of the window — It dips near both edges and at impurity bands. A window "clear to 2.5 µm" may pass 90 % at 1 µm and 20 % at 2.4 µm.',
    'Colourless glass has no absorption — It has very little. A metre of ordinary window glass looks green because iron ions absorb a few per cent per centimetre of the red.'
  ],
  terms: [
    { term: 'Transmittance', also: ['T', 'transmission', 'external transmittance', 'total transmittance'], def: 'The fraction of the incident power that emerges from an element, including the losses at its surfaces. For an uncoated plate with no absorption, T = (1 − R)/(1 + R).' },
    { term: 'Internal transmittance', also: ['τ_i', 'bulk transmittance'], def: 'The fraction of light that survives the path inside the material itself, without surface losses: τ_i = e^(−αd). Datasheets give it for 10 mm and 25 mm thicknesses.' },
    { term: 'Absorption coefficient', also: ['α', 'attenuation coefficient'], def: 'The fraction of power lost per unit length in a material, in 1/mm or 1/cm. With the natural-logarithm form e^(−αd) it is 2.303 times the decadic absorbance per unit length.' },
    { term: 'Beer–Lambert law', also: ['Bouguer–Lambert law', 'Lambert law'], def: 'Light passing through an absorbing medium decays exponentially with the distance: each equal slice removes the same fraction.' },
    { term: 'Fresnel loss', also: ['reflection loss', 'surface loss'], def: 'The light reflected at a surface between media of different index, R = ((n₂ − n₁)/(n₂ + n₁))² at normal incidence. It is independent of thickness and is removed by anti-reflection coatings.' },
    { term: 'Transmission window', also: ['transmission range', 'passband', 'cutoff wavelength'], def: 'The range of wavelengths a material passes: bounded in the ultraviolet by electronic absorption and in the infrared by lattice vibrations. The edge position is quoted for a stated thickness.' }
  ],
  formulas: [
    {
      name: 'Beer–Lambert law',
      expr: 'tau = exp(-alpha*d)', tex: '\\tau_i = e^{-\\alpha d}',
      vars: {
        tau: { name: 'internal transmittance', q: 'ratio', unit: '%', min: 0, max: 100, tex: '\\tau_i' },
        alpha: { name: 'absorption coefficient', q: 'wavenumber', unit: '1/mm', value: 0.0004, min: 0, max: 10, tex: '\\alpha' },
        d: { name: 'path length in the material', q: 'length', unit: 'mm', value: 25 }
      },
      solveFor: 'tau',
      note: 'α = 0.0004 per mm is a good optical glass in the green: 99 % in 25 mm.',
      stories: { tau: 'Light crosses {d} of a glass with an absorption coefficient of {alpha}. What fraction survives, ignoring the surfaces?', d: 'A glass has an absorption coefficient of {alpha}. How thick must a piece be to pass only {tau} of the light, surfaces not counted?' }
    },
    {
      name: 'Reflectance of one uncoated surface',
      expr: 'R = ((n - 1)/(n + 1))^2', tex: 'R = \\left(\\frac{n - 1}{n + 1}\\right)^2',
      vars: {
        R: { name: 'reflectance at normal incidence', q: 'ratio', unit: '%', min: 0, max: 100 },
        n: { name: 'refractive index (the other side is air)', value: 1.519, min: 1, max: 6 }
      },
      stories: { R: 'What fraction of light does a surface between air and a material of index {n} reflect at normal incidence?', n: 'An uncoated surface reflects {R} of the light at normal incidence. What is the index of the material (the other side is air)?' }
    },
    {
      name: 'External transmittance of a plate',
      expr: 'T = (1 - R)^2*tau/(1 - R^2*tau^2)', tex: 'T = \\frac{(1 - R)^2\\,\\tau_i}{1 - R^2\\tau_i^2}',
      vars: {
        T: { name: 'external transmittance', q: 'ratio', unit: '%', min: 0, max: 100 },
        R: { name: 'reflectance of each surface', q: 'ratio', unit: '%', value: 4.24, min: 0, max: 60 },
        tau: { name: 'internal transmittance', q: 'ratio', unit: '%', value: 99, min: 1, max: 100, tex: '\\tau_i' }
      },
      solveFor: 'T',
      note: 'Both faces equal, multiple reflections included. With τ_i = 100 % this is (1 − R)/(1 + R).',
      stories: { T: 'A plate has surfaces that each reflect {R} and an internal transmittance of {tau}. What fraction of the light does it pass?' }
    },
    {
      name: 'Optical density',
      expr: 'OD = -log(T)', tex: '\\mathrm{OD} = -\\log_{10} T',
      vars: {
        OD: { name: 'optical density', tex: '\\mathrm{OD}' },
        T: { name: 'transmittance', q: 'ratio', unit: '%', value: 10, min: 0.0001, max: 100 }
      },
      note: 'OD 1 is 10 %, OD 2 is 1 %, OD 0.3 is half. Densities add when filters are stacked.',
      stories: { OD: 'A filter passes {T} of the light. What is its optical density?' }
    }
  ],
  examples: [
    {
      title: 'Where does a prism lose its light?',
      q: 'A glass prism in a periscope has 50 mm of glass in the path, entry and exit faces both uncoated ($n = 1.519$, $R = 4.24$ % each), and the glass has $\\tau_i = 99.9$ % per 10 mm. How much of the light gets through, and which loss matters more?',
      steps: [
        { text: 'Absorption over 50 mm, five lots of 10 mm:', tex: '\\tau_i = 0.999^5 = 0.995' },
        { text: 'External transmittance:', tex: 'T = \\frac{(1 - 0.0424)^2 \\times 0.995}{1 - 0.0424^2 \\times 0.995^2} = \\frac{0.9123}{0.9982} = 0.914' },
        'The faces lose 8.3 % (without absorption $T$ would be 91.7 %); the glass takes only about 0.5 %.'
      ],
      a: 'About 91 % gets through. The two faces lose sixteen times more than 50 mm of good glass, which is why high-quality prisms are coated.'
    },
    {
      title: 'A germanium window',
      q: 'A germanium window ($n = 4.00$) has $\\tau_i = 98$ %. What does it pass uncoated, and with a coating that leaves 0.5 % reflectance on each face?',
      steps: [
        { text: 'Uncoated, $R = 36$ %:', tex: 'T = \\frac{0.64^2 \\times 0.98}{1 - 0.36^2 \\times 0.98^2} = \\frac{0.4014}{0.8755} = 0.46' },
        { text: 'Coated, $R = 0.5$ %:', tex: 'T = \\frac{0.995^2 \\times 0.98}{1 - 0.005^2 \\times 0.98^2} = 0.970' }
      ],
      a: '46 % uncoated against 97 % coated: every high-index infrared material needs an anti-reflection coating.'
    }
  ],
  quiz: [
    { q: 'A 3 mm plate of N-BK7 absorbs almost nothing. Roughly what fraction of green light passes it at normal incidence?', choices: ['92 %', '96 %', '100 %', '84 %'], a: 0, why: 'Each surface reflects 4.2 %, and with the interreflections the plate passes $(1-R)/(1+R) = 91.9$ %. 96 % would be one surface; 84 % two surfaces of a much higher-index glass.' },
    { q: 'A glass sample 10 mm thick has an internal transmittance of 0.90. What is it for 20 mm of the same glass?', choices: ['0.81', '0.80', '0.95', '0.90'], a: 0, why: 'Equal slices remove equal fractions: $\\tau_i(20) = 0.90^2 = 0.81$. Subtracting the loss twice (0.80) is the linear mistake.' },
    { q: 'Doubling the thickness of an uncoated window doubles its reflection loss.', a: false, why: 'Reflection happens at the two surfaces and does not change with thickness. Only the absorption loss grows with the path.' },
    { q: 'What fraction of light does a bare surface between air and germanium ($n = 4.0$) reflect at normal incidence? (as a fraction)', answer: 0.36, why: '$R = ((4-1)/(4+1))^2 = 0.36$. More than a third of the light is lost at each face.' },
    { q: 'Why does the edge of a thick plate of ordinary window glass look green?', choices: ['Iron ions absorb part of the red and blue along the long path', 'The glass reflects green at its surfaces', 'Striae scatter green light', 'The glass fluoresces under daylight'], a: 0, why: 'The absorption per centimetre is small, but through a long path $e^{-\\alpha d}$ accumulates and the small absorption by iron ions colours the transmitted light.' }
  ],
  applications: [
    'Choosing a window: its transmittance at the working wavelength, with and without coating, decides whether a laser, camera or detector gets enough light.',
    'Spectrophotometers and sample cuvettes: ultraviolet work needs fused silica cells because ordinary glass and plastic absorb below about 350 nm.',
    'Thermal imaging: germanium windows lose 36 % per face uncoated, and absorption inside heats the lens.',
    'High-power lasers: even 0.01 % absorbed from a kilowatt beam is 100 mW of heat in the optic, enough to change its focus.',
    'Radiation environments: cerium-doped glass keeps its transmission under X-rays and gamma rays, where ordinary glass browns.'
  ],
  history: 'Pierre Bouguer described in 1729 how light dies away in the sea and in the atmosphere, and Johann Heinrich Lambert gave the exponential form in 1760. August Beer added the dependence on the concentration of a dissolved substance in 1852; the combined law is the basis of every absorption measurement in chemistry and optics.',
  sources: [
    'E. Hecht, *Optics*, the sections on reflection and transmission at an interface and on absorption in matter — the Fresnel losses and the attenuation of light.',
    'W. J. Smith, *Modern Optical Engineering*, the chapter on optical materials and coatings — transmittance of glass, internal and external.',
    'Optical-glass makers\' technical information sheets on transmittance (internal transmittance per 10 and 25 mm at many wavelengths).',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — transmission ranges of glasses, crystals and infrared materials.'
  ],
  sim: 'om-transmission'
},

/* ================================================================ ultraviolet and infrared materials */
{
  id: 'uv-and-infrared-materials', parent: 'optical-materials', title: 'Materials for the ultraviolet and the infrared', level: 2,
  short: 'Ordinary glass is clear only from about 350 nm to 2.5 µm. For the ultraviolet there are fused silica, fluorides and sapphire; for the infrared silicon, germanium, zinc selenide, zinc sulfide and chalcogenide glasses. The high-index ones reflect so much that they need coatings: germanium reflects 36 % at every surface.',
  keywords: ['ultraviolet optics', 'infrared optics', 'fused silica', 'UV grade', 'calcium fluoride', 'magnesium fluoride', 'sapphire', 'silicon', 'germanium', 'zinc selenide', 'ZnSe', 'zinc sulfide', 'chalcogenide', 'thermal imaging lens', 'CO2 laser optics', 'MWIR', 'LWIR', 'SWIR', 'transmission range', 'band gap'],
  prereq: ['transmission-and-absorption', 'optical-glass'],
  related: ['optical-crystals', 'thermal-effects-in-optics', 'infrared-and-thermal-sensors', 'night-vision-and-thermal-cameras', 'co2-and-excimer-lasers', 'antireflection-coatings', 'the-optical-spectrum', 'physics:em-spectrum'],
  body: `
Ordinary glass is a window onto a narrow slice of the spectrum: N-BK7 is clear from about 350 nm to 2 µm and absorbs outside it. Ultraviolet lithography, spectrometers, thermal cameras and CO₂ lasers all work beyond those edges, and each needs its own materials.

### Why a window has edges
The photon energy is $E = hc/\\lambda$. When it exceeds the energy needed to lift an electron across the band gap, the material absorbs: the **ultraviolet edge**. Silicon, with a gap of 1.12 eV, is opaque below 1.1 µm; germanium (0.66 eV) below about 1.9 µm. That is why both look like metal and work as infrared lenses. The **infrared edge** comes from the vibrations of the lattice: light atoms bound strongly (silica) absorb near 3 to 4 µm, while heavy atoms and weak bonds (fluorides, selenides, germanium) vibrate more slowly and let the light through much farther.

### For the ultraviolet
| Material | Window | $n$ | Notes |
|---|---|---|---|
| Fused silica | 185 nm – 2.1 µm | 1.46 | UV grades have few metal and OH impurities |
| Sapphire | 170 nm – 5.5 µm | 1.77 | very hard; birefringent: cut along its axis |
| Calcium fluoride | 130 nm – 9 µm | 1.43 | soft; fears thermal shock |
| Magnesium fluoride | 120 nm – 7 µm | 1.38 | birefringent; also the classic coating |

Fused silica is the workhorse down to 185 nm; the fluorides reach the vacuum ultraviolet.

### For the infrared
| Material | Window | $n$ | Notes |
|---|---|---|---|
| Silicon | 1.2 – 7 µm | 3.42 | cheap, light; mid-wave infrared and lasers |
| Germanium | 2 – 14 µm | 4.00 | the lens of thermal cameras; turns opaque above about 100 °C |
| Zinc selenide | 0.6 – 16 µm | 2.40 | CO₂-laser optics; passes a red alignment beam |
| Zinc sulfide | 0.4 – 12 µm | 2.20 | tougher; multispectral grades pass visible light |
| Chalcogenide glasses | about 1 – 12 µm | 2.4 – 2.8 | mouldable; contain arsenic or selenium |

Thermal cameras use two atmospheric windows, the mid-wave band (3 to 5 µm) and the long-wave band (8 to 14 µm), where the air is clear and room-temperature objects radiate.

### The price of a high index
A high index means a high Fresnel loss. Germanium reflects $((4-1)/(4+1))^2 = 36$ % at each surface, so a plain plate passes 47 %; zinc selenide loses 17 % per face and silicon 30 %. All are therefore coated ([[antireflection-coatings]]), and the exposed front lens of a thermal camera gets a hard coating as well. Their $dn/dT$ is large too (germanium 396 × 10⁻⁶ per K), so focus drifts with temperature ([[thermal-effects-in-optics]]).

> [!warn] Zinc selenide, zinc sulfide and chalcogenide glasses contain selenium, sulfur or arsenic compounds: dust from grinding or scratching is toxic, so wear gloves, wash hands, and let a specialist cut and polish them. Alkali halides such as KBr and NaCl are hygroscopic. UV-C and UV-B below 315 nm injure eyes and skin: never look into the beam.

> [!key] Choose the material by its window first, then by Fresnel loss, thermal behaviour and toughness. Ultraviolet: fused silica, fluorides, sapphire. Infrared: Si, Ge, ZnSe, ZnS, chalcogenides, each needing an anti-reflection coating.
`,
  ideas: [
    'The ultraviolet edge of a window is where the photon energy hc/λ exceeds the band gap; the infrared edge comes from lattice vibrations.',
    'Fused silica reaches 185 nm, calcium and magnesium fluoride the vacuum ultraviolet, sapphire is tough but birefringent.',
    'Silicon (1.2–7 µm), germanium (2–14 µm), zinc selenide (0.6–16 µm) and chalcogenide glasses are the infrared lens materials.',
    'A high index means a large reflection loss: 36 % per surface on germanium, so the optics must be coated.',
    'Large dn/dT and toxic dust call for athermal designs and careful handling.'
  ],
  pitfalls: [
    'Glass lenses will do for a thermal camera — Ordinary glass is opaque beyond about 2.5 µm; thermal cameras need germanium, chalcogenide or similar. A camera lens held in front of a thermal camera shows only a dark disc.',
    'Silicon and germanium are opaque, so they are not optical materials — They are opaque to the eye but clear in the infrared; that is what makes them lenses and windows for it.',
    'A material that transmits at 10 µm also transmits at 1 µm — Each has its own window: germanium is dark below 1.9 µm, silicon below 1.1 µm, zinc selenide is the exception that works from the red to 16 µm.',
    'Any "UV" window will do — Plastics and ordinary glass absorb below about 350 nm, and even among fused silicas the grade matters at 193 and 248 nm.'
  ],
  terms: [
    { term: 'Band gap', also: ['bandgap', 'E_g'], def: 'The energy a photon needs to lift an electron from the valence to the conduction band. Photons of higher energy (shorter wavelength) are absorbed; the cutoff wavelength is λ_c = hc/E_g.' },
    { term: 'UV-grade fused silica', also: ['synthetic fused silica'], def: 'Fused silica made from pure vapour-deposited silica or selected quartz, low in metal and hydroxyl impurities, transmitting down to about 185 nm and, in special grades, 160 nm.' },
    { term: 'Atmospheric windows', also: ['SWIR', 'MWIR', 'LWIR'], def: 'The infrared bands where air is clear: short-wave 1–1.7 µm, mid-wave 3–5 µm and long-wave 8–14 µm. Infrared cameras and lenses are designed for them.' },
    { term: 'Germanium', also: ['Ge'], def: 'A semiconductor with index 4.0, transparent from about 2 to 14 µm. The standard lens material of long-wave thermal cameras; reflects 36 % per uncoated surface and becomes opaque when hot.' },
    { term: 'Chalcogenide glass', also: ['IR glass'], def: 'A glass made from sulfur, selenium or tellurium with germanium, arsenic or antimony. Transparent in the mid and long-wave infrared and moulded into lenses.' },
    { term: 'Vacuum ultraviolet', also: ['VUV'], def: 'Wavelengths below about 200 nm, absorbed by air, so that instruments are evacuated or purged. Only fluorides and the best silica transmit.' }
  ],
  formulas: [
    {
      name: 'Cutoff wavelength from the band gap',
      expr: 'lamc = h*c/Eg', tex: '\\lambda_c = \\frac{h\\,c}{E_g}',
      vars: {
        lamc: { name: 'cutoff wavelength', q: 'length', unit: 'µm', tex: '\\lambda_c' },
        h: { const: 'h' },
        c: { const: 'c' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.12, tex: 'E_g' }
      },
      note: 'Silicon, 1.12 eV: 1.1 µm. Germanium, 0.66 eV: 1.9 µm. Indirect gaps blur the edge.',
      stories: { lamc: 'A semiconductor has a band gap of {Eg}. Beyond what wavelength is it transparent?' }
    },
    {
      name: 'Plate of an uncoated high-index material',
      expr: 'T = (1 - ((n - 1)/(n + 1))^2)/(1 + ((n - 1)/(n + 1))^2)', tex: 'T = \\frac{1 - R}{1 + R},\\quad R = \\left(\\frac{n-1}{n+1}\\right)^2',
      vars: {
        T: { name: 'transmittance of the plate without absorption', q: 'ratio', unit: '%', min: 0, max: 100 },
        n: { name: 'refractive index', value: 4.0, min: 1, max: 6 }
      },
      note: 'Germanium (n = 4.0) 47 %; silicon (3.42) 54 %; zinc selenide (2.40) 71 %.',
      stories: { T: 'An uncoated, non-absorbing plate is made of material of index {n}. What fraction of the light does it pass?' }
    }
  ],
  examples: [
    {
      title: 'Why is silicon dark?',
      q: 'Silicon has a band gap of 1.12 eV. Beyond which wavelength does it become transparent, and how does that compare with the red end of the visible?',
      steps: [
        { text: 'Cutoff wavelength:', tex: '\\lambda_c = \\frac{hc}{E_g} = \\frac{1240\\ \\mathrm{eV\\,nm}}{1.12\\ \\mathrm{eV}} = 1107\\ \\mathrm{nm}' }
      ],
      a: 'About 1.1 µm, well beyond the red end of the visible at 0.78 µm: all visible light is absorbed, so silicon looks like a mirror-grey metal and passes only the near infrared.'
    },
    {
      title: 'A lens for a CO₂ laser and an alignment beam',
      q: 'A lens must focus a 10.6 µm CO₂ laser and also pass a red helium–neon alignment beam at 633 nm. Which of silicon, germanium, zinc selenide and fused silica works?',
      steps: [
        'Fused silica absorbs strongly beyond about 4 µm, so it fails at 10.6 µm.',
        'Silicon and germanium are opaque at 633 nm (their cutoffs are 1.1 and 1.9 µm).',
        'Zinc selenide is clear from 0.6 to 16 µm.'
      ],
      a: 'Zinc selenide, whose window covers both. It is the standard CO₂-laser lens material, and its yellowish transparency lets the red beam through.'
    }
  ],
  quiz: [
    { q: 'Which material is clear for the long-wave infrared (8–14 µm) and opaque to the eye?', choices: ['Germanium', 'N-BK7', 'Fused silica', 'Acrylic'], a: 0, why: 'Germanium transmits from about 2 to 14 µm. N-BK7, fused silica and acrylic all absorb strongly beyond 2.5 to 4 µm.' },
    { q: 'An uncoated germanium plate ($n = 4.0$) passes about…', choices: ['47 % of the light', '92 % of the light', '64 % of the light', '36 % of the light'], a: 0, why: 'Each surface reflects 36 %, and with the interreflections the plate passes $(1-R)/(1+R) = 0.64/1.36 = 47$ %. 64 % would be one surface only.' },
    { q: 'Calcium fluoride transmits farther into the ultraviolet than fused silica.', a: true, why: 'Its window starts near 130 nm, against about 185 nm for fused silica. It is softer and more fragile, which is the price.' },
    { q: 'A semiconductor has a band gap of 0.66 eV. Beyond what wavelength, in micrometres, does it transmit?', answer: 1.88, why: '$\\lambda_c = 1.2398\\ \\mathrm{eV\\,\\mu m}/0.66\\ \\mathrm{eV} = 1.88\\ \\mu\\mathrm{m}$: germanium.' },
    { q: 'Why must lenses of germanium and zinc selenide be coated?', choices: ['Their high index makes the Fresnel loss per surface very large', 'They are soft and would scratch', 'They dissolve in water', 'They are transparent only when coated'], a: 0, why: 'Reflectance grows with the index: 36 % per face for germanium, 17 % for zinc selenide. A coating cuts that to under 1 %.' }
  ],
  applications: [
    'Thermal cameras: germanium, chalcogenide and zinc-sulfide lenses for the 8–14 µm and 3–5 µm bands.',
    'CO₂ lasers for cutting and surgery: zinc selenide windows and lenses at 10.6 µm.',
    'Deep-ultraviolet lithography and excimer lasers: fused silica and calcium fluoride lenses at 248 and 193 nm.',
    'Infrared spectroscopy: windows of KBr, ZnSe and diamond for sample cells; sapphire windows for high-pressure cells.',
    'Silicon lenses and windows in mid-wave systems and as filters that block the visible.'
  ],
  history: 'Infrared optics began with rock salt, which Macedonio Melloni used from the 1830s to show that heat radiation obeys the laws of light. Germanium lenses appeared with night-vision and thermal systems in the 1950s, and the chalcogenide glasses were developed from the 1970s to give a mouldable alternative to crystals. Deep-ultraviolet lithography made calcium fluoride and synthetic fused silica among the purest materials ever grown.',
  sources: [
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — transmission ranges, indices and thermal data of ultraviolet and infrared materials.',
    'W. J. Smith, *Modern Optical Engineering*, the chapter on optical materials and coatings — infrared materials and their properties.',
    'R. Paschotta, *Encyclopedia of Laser Physics and Technology* (Wiley-VCH) — the entries on infrared and ultraviolet optical materials.',
    'M. J. Weber, *Handbook of Optical Materials* (CRC Press) — index and transmission data for crystals and glasses.'
  ],
  sim: 'om-band-chart'
},

/* ================================================================ optical plastics */
{
  id: 'optical-plastics', parent: 'optical-materials', title: 'Optical plastics', level: 1,
  short: 'Acrylic, polycarbonate, polystyrene and cyclo-olefin polymers make lenses that are light, cheap in volume and mouldable into aspheres. They pay with a thermal index change fifty to a hundred times that of glass, ten times the expansion, moulded-in birefringence and soft surfaces.',
  keywords: ['optical plastic', 'PMMA', 'acrylic', 'polycarbonate', 'polystyrene', 'cyclo-olefin', 'COP', 'COC', 'injection moulding', 'moulded lens', 'plastic lens', 'phone camera lens', 'hard coat', 'birefringence', 'water absorption', 'CR-39', 'high-index plastic'],
  prereq: ['optical-glass', 'the-abbe-number-and-glass-map'],
  related: ['thermal-effects-in-optics', 'making-optics', 'spectacle-lens-materials', 'mobile-phone-lenses', 'aspheric-surfaces', 'glass-quality-and-defects', 'cleaning-and-handling-optics'],
  body: `
Most of the lenses made today are plastic: phone cameras, spectacles, car lamps, printers and sensors. A plastic lens weighs half as much as a glass one and, because it is **injection moulded**, can have any aspheric shape without extra cost per piece.

### The four materials
| | $n_d$ | $V_d$ | Density (g/cm³) | Expansion (10⁻⁶/K) | $dn/dT$ (10⁻⁶/K) |
|---|---|---|---|---|---|
| Acrylic (PMMA) | 1.492 | 57.4 | 1.19 | 68 | −105 |
| Polycarbonate (PC) | 1.586 | 29.9 | 1.20 | 67 | −107 |
| Polystyrene (PS) | 1.591 | 30.9 | 1.05 | 70 | −140 |
| Cyclo-olefin polymer (COP) | 1.531 | 55.8 | 1.01 | 60 | −101 |
| *For comparison: N-BK7* | 1.517 | 64.2 | 2.51 | 7.1 | +1.6 |

Acrylic is the crown of plastics, polystyrene and polycarbonate the flints; a lens pair of PMMA and PS gives $\\Delta V = 26$, nearly as good for an achromat as N-BK7 with F2 ($\\Delta V = 28$). Cyclo-olefins combine acrylic's Abbe number with a higher index and almost no water uptake; they have taken over camera lenses.

### Why use them
- **Mass.** A 50 mm disc 10 mm thick weighs 49 g in N-BK7 and 23 g in acrylic.
- **Aspheres and features for free.** The mould carries the asphere, the flange, the mounting pegs, the lens array.
- **Cost at volume.** A mould is expensive; the lens then costs cents.

### What they cost
- **Temperature.** $dn/dT$ is some 100 times that of glass and the expansion ten times: a plastic lens drifts out of focus with every few degrees ([[thermal-effects-in-optics]]).
- **Birefringence.** Flow and cooling freeze stress into the part; polycarbonate shows it most (its stress-optic coefficient is more than twenty times glass's), acrylic and COP least.
- **Water.** Acrylic takes up about 0.3 % of water in a day and swells; COP less than 0.01 %.
- **Softness and heat.** They scratch (so hard-coat them), melt near 100 to 150 °C, are attacked by solvents and yellow in strong ultraviolet; polycarbonate absorbs below 390 nm.
- **Range.** Indices from 1.49 to about 1.65 only; spectacle plastics reach 1.74 ([[spectacle-lens-materials]]).

### Hybrids
Designers mix them: glass elements for power and thermal stability, one or two plastic aspheres to correct aberrations. A phone camera has five to seven moulded elements of two or three different plastics.

> [!warn] Do not clean plastic optics with acetone or other strong solvents, which craze the surface, and do not rub them dry: dust scratches them and static holds it. Use a blower and a mild cleaner ([[cleaning-and-handling-optics]]).

> [!key] Plastic optics trade glass's stability for low weight and cheap, complex shapes: half the density, free aspheres, but $dn/dT$ about 100 times larger, soft surfaces and birefringence.
`,
  ideas: [
    'Optical plastics are PMMA (a crown), polycarbonate and polystyrene (flints) and the cyclo-olefins (a crown with low water uptake).',
    'Injection moulding gives low weight, aspheric surfaces and integrated mounts at low cost per lens.',
    'dn/dT of −100 × 10⁻⁶/K and expansion of 60–70 × 10⁻⁶/K make plastic lenses drift out of focus with temperature.',
    'Moulding freezes stress into the part: polycarbonate is the most birefringent, COP and acrylic the least.',
    'Plastics scratch, absorb water (acrylic), soften near 100–150 °C and craze in solvents; hard coats and hybrids with glass mitigate this.'
  ],
  pitfalls: [
    'A plastic lens is just a cheaper glass lens — It behaves differently: its focus moves with temperature about a hundred times faster, it absorbs water, scratches and may be birefringent. Designs are made for plastic from the start.',
    'All clear plastics are alike — Acrylic and COP are low-dispersion; polycarbonate and polystyrene disperse twice as much and are used where a flint is needed; COP takes no water, acrylic does.',
    'Plastic is always the cheaper lens — The mould is a large fixed cost. For a few pieces a ground glass lens or a diamond-turned one costs less; plastic wins from some thousands of lenses upward.',
    'Birefringence matters only for polarization experiments — Moulded-in stress also blurs images, changes the focus of polarized light and shows as rainbow patterns between polarizers, useful for checking a mould.'
  ],
  terms: [
    { term: 'PMMA', also: ['acrylic', 'poly(methyl methacrylate)'], def: 'The clearest and most scratch-resistant of the common optical plastics: n_d = 1.49, V_d = 57. The crown of plastics; it takes up water and softens near 100 °C.' },
    { term: 'Polycarbonate', also: ['PC'], def: 'A tough, impact-resistant plastic with n_d = 1.59 and V_d = 30: the flint of plastics. Used for safety glasses and moulded lenses; strongly birefringent when stressed.' },
    { term: 'Cyclo-olefin polymer', also: ['COP', 'COC', 'cyclic olefin'], def: 'A family of plastics with n_d about 1.53, V_d about 56, very low water uptake and low birefringence. The main material of moulded phone-camera and sensor lenses.' },
    { term: 'Injection moulding', also: ['moulded optics'], def: 'Forming a lens by injecting molten plastic into a polished metal mould. Each lens takes seconds to tens of seconds; the mould carries the surfaces and mounting features.' },
    { term: 'Hard coat', also: ['scratch-resistant coating'], def: 'A thin hard layer, often a silicon-based lacquer, applied to plastic optics to resist scratching; it is usually under the anti-reflection coating.' },
    { term: 'Thermo-optic coefficient', also: ['dn/dT'], def: 'The change of refractive index per kelvin. About −100 × 10⁻⁶/K for plastics and from −10 to +10 × 10⁻⁶/K for glasses.' }
  ],
  formulas: [
    {
      name: 'Mass of a cylindrical lens blank',
      expr: 'm = rho*pi*D^2*t/4', tex: 'm = \\rho\\,\\frac{\\pi D^2}{4}\\,t',
      vars: {
        m: { name: 'mass', q: 'mass', unit: 'g' },
        rho: { name: 'density', q: 'density', unit: 'g/cm³', value: 1.19, tex: '\\rho' },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 50 },
        t: { name: 'thickness', q: 'length', unit: 'mm', value: 10 }
      },
      solveFor: 'm',
      note: 'A flat disc; a real lens is lighter by the missing curved volume.',
      stories: { m: 'A disc {D} across and {t} thick is made of a material of density {rho}. What does it weigh?' }
    },
    {
      name: 'Change of index with temperature',
      expr: 'Dn = dndt*DT', tex: '\\Delta n = \\beta\\,\\Delta T',
      vars: {
        Dn: { name: 'change of refractive index', signed: true, tex: '\\Delta n' },
        dndt: { name: 'thermo-optic coefficient dn/dT', q: 'expansion', unit: 'ppm/K', value: -105, signed: true, tex: '\\beta' },
        DT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      solveFor: 'Dn',
      note: 'PMMA: −105 ppm/K. A rise of 40 K lowers the index by 0.0042, about the entire dispersion between blue and red.',
      stories: { Dn: 'A material has dn/dT = {dndt}. By how much does its index change when it warms by {DT}?' }
    }
  ],
  examples: [
    {
      title: 'Glass or plastic for a hand-held scanner lens?',
      q: 'A 50 mm diameter, 10 mm thick lens blank would be made either of N-BK7 (2.51 g/cm³) or of acrylic (1.19 g/cm³). Compare their masses.',
      steps: [
        { text: 'The volume of the disc:', tex: 'V = \\frac{\\pi \\times (5\\ \\mathrm{cm})^2}{4} \\times 1\\ \\mathrm{cm} = 19.6\\ \\mathrm{cm^3}' },
        'N-BK7: $2.51 \\times 19.6 = 49.3$ g. Acrylic: $1.19 \\times 19.6 = 23.4$ g.'
      ],
      a: '49 g against 23 g: acrylic is less than half as heavy. The saving matters for hand-held or head-worn devices, though acrylic costs scratch resistance and thermal stability.'
    },
    {
      title: 'An acrylic lens in the sun',
      q: 'A 100 mm acrylic singlet warms by 40 K. By roughly how much does its index change, and compare with the glass singlet N-BK7 ($dn/dT = +1.6$ ppm/K).',
      steps: [
        { text: 'Acrylic:', tex: '\\Delta n = -105 \\times 10^{-6} \\times 40 = -0.0042' },
        { text: 'N-BK7:', tex: '\\Delta n = +1.6 \\times 10^{-6} \\times 40 = +0.00006' }
      ],
      a: 'Acrylic loses 0.0042 of its 0.49 index excess, about 0.9 %: the focal length changes by roughly 1 %, a millimetre on a 100 mm lens. In N-BK7 the change is 70 times smaller, and of the opposite sign.'
    }
  ],
  quiz: [
    { q: 'Which statement about $dn/dT$ is true?', choices: ['Plastics have a negative $dn/dT$ about 100 times larger in size than typical glasses', 'Plastics and glasses have equal $dn/dT$', 'Plastics have a positive $dn/dT$ ten times that of glass', 'Plastics have $dn/dT = 0$'], a: 0, why: 'Plastics expand a lot on heating, which dilutes them and lowers the index: about −100 × 10⁻⁶/K, against a few × 10⁻⁶/K (either sign) for glass.' },
    { q: 'Which of these plastics takes up the most water, so that it swells and changes index in humid air?', choices: ['Acrylic (PMMA)', 'Cyclo-olefin polymer', 'Polystyrene', 'Polycarbonate'], a: 0, why: 'Acrylic absorbs about 0.3 % of its weight of water in a day, and more over time; the cyclo-olefins take up under 0.01 %, and polystyrene and polycarbonate lie in between.' },
    { q: 'The refractive index of an acrylic lens rises as it warms.', a: false, why: 'Its $dn/dT$ is negative, about −105 × 10⁻⁶ per kelvin: heating lowers the index. Glass such as N-BK7 has a small positive $dn/dT$.' },
    { q: 'What does a 50 mm diameter, 10 mm thick disc of polycarbonate (1.20 g/cm³) weigh, in grams?', answer: 23.6, why: '$m = 1.20 \\times \\pi (2.5\\ \\mathrm{cm})^2 \\times 1\\ \\mathrm{cm} = 23.6$ g.' },
    { q: 'Why do moulded plastic lenses show coloured fringes between crossed polarizers?', choices: ['Stress frozen in during cooling makes them birefringent', 'Plastics are optically active', 'They absorb one polarization', 'Their coating is a polarizer'], a: 0, why: 'Flow and uneven cooling lock in stress; stress makes the material birefringent, and the retardation shows as colour between crossed polarizers.' }
  ],
  applications: [
    'Phone and compact cameras: five to seven moulded aspheric elements of COP and polycarbonate.',
    'Spectacle lenses: CR-39 (n = 1.50, V_d 58), polycarbonate and high-index plastics instead of glass.',
    'Vehicle lighting, light guides and sensor optics, where aspheric or freeform shapes are moulded in one piece.',
    'Fresnel lenses, lens arrays and lenticular sheets, moulded or embossed in acrylic.',
    'Disposable optics: barcode-scanner and optical-mouse lenses, microscope slides and cuvettes.'
  ],
  history: 'Acrylic sheet was developed in the 1930s and used for aircraft canopies in the Second World War. Pilots whose eyes were struck by splinters of it tolerated the material, which led the ophthalmologist Harold Ridley to implant the first acrylic intraocular lens in 1949. CR-39 followed in the 1940s and became the standard spectacle plastic in the 1960s. Moulded aspheric plastic lenses came to cameras later in the century, and cyclo-olefins brought them to phones in the 2000s.',
  sources: [
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* — the notes on plastic lenses and their thermal behaviour.',
    'W. J. Smith, *Modern Optical Engineering*, the chapter on optical materials and coatings — plastics and their properties.',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — optical plastics: indices, dn/dT and water absorption.'
  ],
  sim: [{ id: 'om-properties', params: { group: 'plastic', prop: 'dndt' } }]
},

/* ================================================================ optical crystals */
{
  id: 'optical-crystals', parent: 'optical-materials', title: 'Optical crystals', level: 2,
  short: 'Crystals transmit where glass cannot, from the vacuum ultraviolet to the far infrared, and many are harder than glass. Most have directions: one index along an optic axis and another across it, so calcite shows a double image. Other crystals make lasers, double their frequency or switch light.',
  keywords: ['optical crystal', 'calcite', 'Iceland spar', 'quartz', 'sapphire', 'fluorite', 'calcium fluoride', 'magnesium fluoride', 'diamond', 'birefringent crystal', 'uniaxial', 'optic axis', 'ordinary ray', 'extraordinary ray', 'walk-off', 'nonlinear crystal', 'BBO', 'KDP', 'lithium niobate', 'YAG', 'beam displacer'],
  prereq: ['optical-glass', 'uv-and-infrared-materials', 'refractive-index'],
  related: ['birefringence', 'wave-plates', 'polarizing-beam-splitters', 'optical-isolators-and-modulators', 'frequency-doubling-and-nonlinear-optics', 'solid-state-lasers', 'apochromats-and-ed-glass', 'physics:polarization'],
  body: `
A **crystal** has its atoms on a regular lattice. For optics that has three consequences. Some crystals transmit far beyond the edges of any glass. Many are harder, or conduct heat better, than glass. And most have *directions*: the light meets a different index along one axis than across it.

### Cubic crystals and uniaxial crystals
Cubic crystals (calcium fluoride, silicon, germanium, diamond, sodium chloride, YAG) are isotropic: one index for every direction and polarization, like glass. Crystals with one special direction, the **optic axis**, are **uniaxial**: calcite, quartz, sapphire, magnesium fluoride. Light polarized across the axis sees the **ordinary** index $n_o$; light polarized in the plane of the axis and the ray sees the **extraordinary** index $n_e$ ([[birefringence]]).

| Crystal | $n_o$ | $n_e$ | Window | Remarks |
|---|---|---|---|---|
| Calcite | 1.658 | 1.486 | 0.22 – 2.3 µm | strongest birefringence of the common crystals ($-0.172$); soft |
| Quartz (crystalline) | 1.544 | 1.553 | 0.19 – 2.9 µm | $+0.009$: wave plates; rotates the plane of polarization |
| Sapphire | 1.768 | 1.760 | 0.17 – 5.5 µm | $-0.008$; hardness just below diamond |
| Magnesium fluoride | 1.378 | 1.390 | 0.12 – 7 µm | $+0.012$; ultraviolet windows and coatings |
| Calcium fluoride | 1.434 | (cubic) | 0.13 – 9 µm | low dispersion, $V_d = 95$ |

### The usual crystals
- **Fluorides.** Calcium fluoride (fluorite) and magnesium fluoride reach the vacuum ultraviolet; fluorite's very low dispersion and unusual partial dispersion make the lenses of apochromats. They are soft, scratch easily and crack in sudden heating.
- **Sapphire** is aluminium oxide: scratch-proof windows for watches, scanners and pressure cells. A window is cut with the optic axis along the beam so that the double refraction vanishes.
- **Quartz** is crystalline silica (fused silica is the glass). Its small birefringence suits wave plates, and it also rotates polarization (about 22° per millimetre in yellow light along the axis).
- **Calcite** splits an unpolarized beam in two. When the optic axis is at about 42° to the beam, the extraordinary ray leaves the straight path by up to $\\rho_{max} = \\arctan\\frac{n_o^2 - n_e^2}{2\\,n_e n_o} = 6.26°$, so a rhomb 10 mm long displaces it by 1.1 mm: the beam displacer and the Glan prism.
- **Diamond** (grown by vapour deposition) is clear from 0.23 µm to the far infrared with an index of 2.42 and conducts heat five times better than copper: windows for kilowatt CO₂ lasers.

### Crystals that do something to light
Laser hosts: Nd:YAG (neodymium in yttrium aluminium garnet), Nd:YVO₄, ruby, Ti:sapphire. Nonlinear crystals double or mix frequencies: KDP, BBO, LBO, KTP, lithium niobate ([[frequency-doubling-and-nonlinear-optics]]). Electro-optic crystals (lithium niobate, KD*P, BBO) switch or modulate light in microseconds to picoseconds; tellurium dioxide deflects it with sound ([[optical-isolators-and-modulators]]).

### How they are made
Optical crystals are grown slowly from a melt or a solution, a boule of fluorite taking weeks, then cut along the crystal axes and polished like glass, but with care: they cleave, have hard and soft directions, and cost much more.

> [!key] Cubic crystals behave like glass with an unusual window; uniaxial crystals have two indices, $n_o$ and $n_e$, and split light into two polarized rays. Choose a crystal for its window, its hardness, its double refraction or its laser or nonlinear action.
`,
  ideas: [
    'Crystals transmit beyond glass (calcium fluoride 0.13–9 µm, sapphire 0.17–5.5 µm) and are often harder.',
    'Cubic crystals (CaF₂, Si, Ge, diamond) are isotropic; uniaxial crystals (calcite, quartz, sapphire, MgF₂) have an ordinary and an extraordinary index.',
    'Calcite, with n_o = 1.658 and n_e = 1.486, gives a double image and a beam walk-off of up to 6.3°; quartz is weakly birefringent and used for wave plates.',
    'Windows of sapphire and MgF₂ are cut along the optic axis to avoid double refraction.',
    'Laser, nonlinear and electro-optic crystals (YAG, BBO, KDP, lithium niobate) are named for what they do to the light.'
  ],
  pitfalls: [
    'All crystals are birefringent — Only those below cubic symmetry. Calcium fluoride, silicon, germanium, diamond and rock salt have one index for all directions, like glass.',
    'Calcite\'s double image is a flaw in the crystal — It is its nature: two indices, two refracted rays with perpendicular polarizations. Cutting calcite into prisms and rhombs uses the effect.',
    'Sapphire is just very hard glass — It is crystalline aluminium oxide, grown from the melt, with its own axes and birefringence. It transmits to 5.5 µm, far beyond glass.',
    'A crystal is always better than glass — It is also scarcer, dearer, softer (fluorides, calcite), liable to thermal shock and limited in size.'
  ],
  terms: [
    { term: 'Optic axis', def: 'The direction in a uniaxial crystal along which light of any polarization sees the same index. Light across it sees two different indices.' },
    { term: 'Ordinary and extraordinary rays', also: ['o-ray', 'e-ray', 'n_o', 'n_e'], def: 'The two rays into which a birefringent crystal divides a beam. The ordinary ray obeys Snell\'s law with index n_o; the extraordinary ray sees an index between n_o and n_e depending on its direction and may leave the straight path (walk-off).' },
    { term: 'Birefringence', also: ['double refraction', 'Δn'], def: 'The difference n_e − n_o between the two indices of a crystal. Calcite −0.172, quartz +0.009, sapphire −0.008, magnesium fluoride +0.012.' },
    { term: 'Walk-off', also: ['beam displacement'], def: 'The sideways displacement of the extraordinary ray in a birefringent crystal, up to 6.3° for calcite. A beam displacer uses it to separate two polarizations.' },
    { term: 'Nonlinear crystal', also: ['frequency doubler'], def: 'A crystal (KDP, BBO, LBO, KTP, lithium niobate) whose response to an intense light wave is not proportional to it, so that light of one frequency makes light of the double or the sum frequency.' },
    { term: 'Laser host crystal', also: ['gain crystal'], def: 'A crystal doped with ions (neodymium, titanium, chromium) whose energy levels make the gain of a solid-state laser: Nd:YAG, Ti:sapphire, ruby.' }
  ],
  formulas: [
    {
      name: 'Greatest walk-off angle of a uniaxial crystal',
      expr: 'rho = atan((no^2 - ne^2)/(2*ne*no))', tex: '\\rho_{max} = \\arctan\\frac{n_o^2 - n_e^2}{2\\,n_e\\,n_o}',
      vars: {
        rho: { name: 'greatest angle between ray and wave direction', q: 'angle', unit: '°', signed: true, tex: '\\rho_{max}' },
        no: { name: 'ordinary index', value: 1.6584, min: 1.2, max: 3, tex: 'n_o' },
        ne: { name: 'extraordinary index', value: 1.4864, min: 1.2, max: 3, tex: 'n_e' }
      },
      solveFor: 'rho',
      note: 'Calcite: 6.26°. Quartz: 0.3°.',
      stories: { rho: 'A uniaxial crystal has an ordinary index of {no} and an extraordinary index of {ne}. What is the greatest angle by which the extraordinary ray leaves the wave direction?' }
    },
    {
      name: 'Displacement by a beam displacer',
      expr: 'd = t*tan(rho)', tex: 'd = t\\,\\tan\\rho',
      vars: {
        d: { name: 'sideways separation of the two beams', q: 'length', unit: 'mm' },
        t: { name: 'length of the crystal', q: 'length', unit: 'mm', value: 10 },
        rho: { name: 'walk-off angle', q: 'angle', unit: '°', value: 6.26, min: 0, max: 45, tex: '\\rho' }
      },
      solveFor: 'd',
      stories: { d: 'A calcite beam displacer is {t} long and cut for a walk-off of {rho}. How far apart do the two beams leave it?' }
    },
    {
      name: 'Birefringence',
      expr: 'Dn = ne - no', tex: '\\Delta n = n_e - n_o',
      vars: {
        Dn: { name: 'birefringence', signed: true, tex: '\\Delta n' },
        ne: { name: 'extraordinary index', value: 1.4864, min: 1.2, max: 3, tex: 'n_e' },
        no: { name: 'ordinary index', value: 1.6584, min: 1.2, max: 3, tex: 'n_o' }
      },
      note: 'Negative: the crystal is called negative uniaxial (calcite, sapphire); positive: quartz, MgF₂.',
      practice: false
    }
  ],
  examples: [
    {
      title: 'A calcite beam displacer',
      q: 'A rhomb of calcite is 20 mm long and cut so that the walk-off is the greatest possible, 6.26°. How far apart are the ordinary and extraordinary beams when they leave?',
      steps: [
        { text: 'Each unit of length of crystal moves the extraordinary ray sideways by $\\tan\\rho$:', tex: 'd = t\\tan\\rho = 20\\ \\mathrm{mm} \\times \\tan 6.26° = 2.19\\ \\mathrm{mm}' },
        'The two beams leave parallel, 2.2 mm apart, and are polarized perpendicular to each other.'
      ],
      a: 'About 2.2 mm. Two beams a few millimetres apart are easy to separate with a mask or aperture: that is how calcite displacers make a polarizing beam splitter.'
    },
    {
      title: 'A window for 150 nm',
      q: 'An instrument for the vacuum ultraviolet needs a window at 150 nm. Of calcite, crystalline quartz, sapphire, magnesium fluoride and calcium fluoride, which can be used?',
      steps: [
        'The windows begin at 220, 190, 170, 120 and 130 nm respectively.',
        'Only the fluorides transmit at 150 nm; both are used, magnesium fluoride (cut along its axis) and calcium fluoride (cubic, no axis).'
      ],
      a: 'The two fluorides. Calcium fluoride avoids double refraction altogether; magnesium fluoride is harder and withstands moisture better.'
    }
  ],
  quiz: [
    { q: 'Which of these crystals is not birefringent?', choices: ['Calcium fluoride', 'Calcite', 'Quartz', 'Sapphire'], a: 0, why: 'Calcium fluoride is cubic, so its index does not depend on direction. Calcite, quartz and sapphire are uniaxial, with two indices.' },
    { q: 'An unpolarized laser beam passes straight through a calcite rhomb. What do you see leaving it?', choices: ['Two parallel beams with perpendicular polarizations', 'One beam, slightly brighter', 'One beam, polarized', 'A diverging cone of light'], a: 0, why: 'The ordinary and extraordinary components see different indices; the extraordinary beam walks off sideways while the ordinary beam continues straight.' },
    { q: 'A sapphire window is cut with its optic axis perpendicular to the faces so that a beam travelling along it is not split.', a: true, why: 'Along the optic axis the two polarizations see the same index, so there is no double refraction at normal incidence. In an arbitrary cut the window would split the beam into two.' },
    { q: 'Calcite has $n_o = 1.658$ and $n_e = 1.486$. What is the greatest walk-off angle, in degrees?', answer: 6.26, why: '$\\rho = \\arctan\\frac{n_o^2 - n_e^2}{2 n_e n_o} = \\arctan\\frac{0.541}{4.93} = 6.26°$.' },
    { q: 'Why is calcium fluoride used in apochromatic lenses?', choices: ['Its very low dispersion and unusual partial dispersion cancel residual colour error', 'It has the highest refractive index of all', 'It is birefringent and so cancels colour', 'It is harder than glass'], a: 0, why: 'With $V_d = 95$ and a partial dispersion off the normal line, fluorite lets a designer correct the colour at three wavelengths. It is soft and has a lower, not higher, index than glass.' }
  ],
  applications: [
    'Beam displacers, Glan polarizing prisms and polarimeters from calcite; wave plates from quartz, MgF₂ and sapphire.',
    'Apochromatic telescopes and telephoto lenses with fluorite or fluorite-like elements.',
    'Scratch-proof windows of sapphire: watch crystals, scanner windows, high-pressure and high-temperature viewports.',
    'Ultraviolet windows and lenses of MgF₂ and CaF₂ for excimer lasers and spectrometers.',
    'Laser rods and frequency converters: Nd:YAG, Ti:sapphire, BBO, KTP, lithium niobate modulators.'
  ],
  history: 'Calcite from Iceland ("Iceland spar") was described by Erasmus Bartholin in 1669 when he saw a line seen through it doubled; Huygens explained the double image with his wavefront construction in 1690, and Étienne-Louis Malus found polarization with a calcite crystal in 1808. Synthetic sapphire, grown by flame fusion from 1902, put sapphire windows within reach, and since the 1960s the laser has driven the growth of YAG, KDP and other crystals of optical quality.',
  sources: [
    'E. Hecht, *Optics*, the chapter on polarization — double refraction in calcite and the ordinary and extraordinary indices.',
    'M. Bass (ed.), *Handbook of Optics*, the volumes on optical properties of materials and on nonlinear optics — crystals, their indices, windows and nonlinear coefficients.',
    'A. Yariv and P. Yeh, *Optical Waves in Crystals* — the optics of uniaxial and biaxial crystals, walk-off and electro-optic effects.',
    'M. J. Weber, *Handbook of Optical Materials* (CRC Press) — property tables for crystals.'
  ],
  sim: [{ id: 'om-properties', params: { group: 'crystal', prop: 'vd' } }]
},

/* ================================================================ thermal effects */
{
  id: 'thermal-effects-in-optics', parent: 'optical-materials', title: 'Heat and optics: expansion and dn/dT', level: 3,
  short: 'A temperature change alters a lens three ways: it expands, its index changes, and the housing holding it moves. The thermal power coefficient γ = (dn/dT)/(n − 1) − α sums the first two; with the barrel it fixes how far the focus drifts, and the athermal design that cancels it.',
  keywords: ['thermal', 'temperature', 'expansion', 'CTE', 'dn/dT', 'thermo-optic coefficient', 'focus shift', 'athermal', 'athermalization', 'thermal defocus', 'low expansion', 'zero expansion', 'thermal lens', 'thermal power coefficient', 'housing', 'invar', 'thermal stress', 'thermal shock'],
  prereq: ['optical-glass', 'optical-plastics', 'depth-of-focus'],
  related: ['uv-and-infrared-materials', 'transmission-and-absorption', 'mirrors-as-components', 'optomechanics-and-mounts', 'infrared-and-thermal-sensors', 'night-vision-and-thermal-cameras', 'laser-damage-and-coating-durability', 'physics:thermal-expansion'],
  body: `
Optics are made to micrometres and used at whatever temperature the room, the sun or the laser provides. Warm a lens by a few tens of kelvin and three things happen.

1. **The lens expands.** Every length grows by $\\alpha\\,\\Delta T$, radii and thickness included; with the surfaces a little flatter, the focal length lengthens.
2. **The index changes** by $\\Delta n = (dn/dT)\\,\\Delta T$. For glass this is a few millionths per kelvin, of either sign; for plastics about $-100 \\times 10^{-6}$/K; for infrared crystals $+60$ to $+400 \\times 10^{-6}$/K.
3. **The mount moves.** The barrel that holds lens and sensor expands too (aluminium $23 \\times 10^{-6}$/K), and a lens clamped too tightly is stressed, becoming birefringent or changing its shape.

### The thermal power coefficient
Differentiate the power $\\varphi = (n - 1)(c_1 - c_2)$, with each curvature falling as the lens grows:

$$\\frac{1}{\\varphi}\\frac{d\\varphi}{dT} = \\gamma = \\frac{dn/dT}{n - 1} - \\alpha$$

| Material | $\\alpha$ | $dn/dT$ | $\\gamma$ (10⁻⁶/K) |
|---|---|---|---|
| N-BK7 | 7.1 | +1.6 | −4 |
| Fused silica | 0.55 | +10 | +21 |
| Calcium fluoride | 18.9 | −10.6 | −43 |
| Acrylic | 68 | −105 | −282 |
| Silicon | 2.6 | +160 | +64 |
| Germanium | 6.1 | +396 | +126 |

The focal length changes by $\\Delta f/f = -\\gamma\\,\\Delta T$. A negative $\\gamma$ means the focus moves *out* when the lens warms. A 100 mm acrylic lens warmed by 40 K gains 1.1 mm; one of N-BK7 only 16 µm.

### Focus shift in a barrel
The sensor sits about one focal length behind the lens, on a spacer of expansion $\\alpha_h$. The sensor then lies beyond the image by $\\Delta z = f(\\gamma + \\alpha_h)\\Delta T$. For a 100 mm f/4 N-BK7 lens warmed by 40 K the image-side tolerance is the depth of focus $\\pm 2\\lambda N^2 = \\pm 17.6$ µm, and

| Barrel | $\\alpha_h$ | $\\Delta z$ |
|---|---|---|
| Aluminium | 23 | +76 µm: out of focus |
| Titanium | 8.6 | +18 µm: at the limit |
| Invar | 1.3 | −11 µm: fine |

### Athermalization
Cancelling the drift needs $\\alpha_h = -\\gamma$: 4 ppm/K for N-BK7, between invar and titanium; 282 ppm/K for acrylic, which no housing has. Designers have three tools. *Mechanical*: low-expansion spacers or two-metal compensators. *Optical*: pairs of materials with opposite $\\gamma$ (germanium with a chalcogenide glass in thermal cameras), or a diffractive surface whose power depends only on $\\alpha$. *Active*: a focus motor and a temperature sensor.

### Mirrors
Mirrors have no $dn/dT$ but must keep their figure. Substrates are chosen for low expansion: glass-ceramics and titania-silicate glass about $0 \\pm 0.1$ ppm/K, fused silica 0.55, borosilicate 3.3, silicon carbide 2.5. An all-aluminium telescope, mirrors and frame alike, scales uniformly and stays in focus.

> [!key] $\\gamma = (dn/dT)/(n-1) - \\alpha$ is how fast a lens\'s power moves with temperature; the focus stays put only when the housing expands by $-\\gamma$. Plastics and infrared crystals drift most.
`,
  ideas: [
    'Heat expands the lens (α), changes its index (dn/dT) and moves the mount (α_h); the three together shift the focus.',
    'γ = (dn/dT)/(n − 1) − α is the relative change of power per kelvin: −4 ppm/K for N-BK7, −282 for acrylic, +126 for germanium.',
    'Defocus at the sensor is Δz = f(γ + α_h)ΔT; compare it with the depth of focus ±2λN².',
    'A passive athermal design needs a housing of α_h = −γ; plastics need optical compensation, thermal cameras pair materials of opposite γ.',
    'Mirrors need low-expansion substrates (glass-ceramics, titania-silicate, fused silica) or the same material throughout.'
  ],
  pitfalls: [
    'Thermal expansion is the only thermal effect in a lens — In most lenses the change of index is as large or larger: for acrylic it is three times the expansion, for germanium twenty times.',
    'A glass lens needs no thermal design — The glass drifts little, but an aluminium barrel moves the sensor by 76 µm over 40 K in our example, more than four times the depth of focus at f/4.',
    'dn/dT is always positive — It is negative for plastics, fluorides and some glasses. Hence γ can be negative and the focus move outward on heating.',
    'Low expansion alone makes a mirror stable — Gradients bend the mirror even if the mean expansion is small, and the coefficient itself varies with temperature (titania-silicate glass crosses zero near room temperature).'
  ],
  terms: [
    { term: 'Coefficient of thermal expansion', also: ['CTE', 'α', 'linear expansion coefficient'], def: 'The fractional change in length per kelvin, usually in 10⁻⁶/K (ppm/K): 7 for N-BK7, 0.55 for fused silica, 23 for aluminium, 60 to 70 for plastics.' },
    { term: 'Thermo-optic coefficient', also: ['dn/dT', 'thermal index coefficient'], def: 'The change of refractive index per kelvin, in 10⁻⁶/K. Glasses between about −10 and +10, plastics about −100, germanium +396.' },
    { term: 'Thermal power coefficient', also: ['γ', 'thermal glass constant'], def: 'γ = (dn/dT)/(n − 1) − α: the relative change in the power of a lens per kelvin, neglecting the mount. Its negative is the relative change in focal length.' },
    { term: 'Athermal design', also: ['athermalization', 'athermalized lens'], def: 'A lens-and-housing combination whose focus stays within the depth of focus over a stated temperature range, by matching materials, adding compensating elements or refocusing.' },
    { term: 'Thermal lensing', def: 'A change of focus caused by heating from absorbed light: the centre of a beam heats the optic most, and the index profile (and its expansion) acts as a lens.' },
    { term: 'Low-expansion glass-ceramic', also: ['zero-expansion substrate', 'titania-silicate glass'], def: 'A material with a thermal expansion close to zero near room temperature (about 0 ± 0.1 ppm/K), used for telescope mirrors, interferometer spacers and lithography optics.' }
  ],
  formulas: [
    {
      name: 'Thermal power coefficient',
      expr: 'gam = dndt/(n - 1) - alpha', tex: '\\gamma = \\frac{\\beta}{n - 1} - \\alpha',
      vars: {
        gam: { name: 'thermal power coefficient', q: 'expansion', unit: 'ppm/K', signed: true, tex: '\\gamma' },
        dndt: { name: 'thermo-optic coefficient dn/dT', q: 'expansion', unit: 'ppm/K', value: 1.6, signed: true, tex: '\\beta' },
        n: { name: 'refractive index', value: 1.5168, min: 1.1, max: 5 },
        alpha: { name: 'thermal expansion of the lens', q: 'expansion', unit: 'ppm/K', value: 7.1, tex: '\\alpha' }
      },
      solveFor: 'gam',
      note: 'The default values are N-BK7. The relative change of focal length is −γ ΔT.',
      stories: { gam: 'A lens material has n = {n}, dn/dT = {dndt} and expansion {alpha}. What is its thermal power coefficient?' }
    },
    {
      name: 'Focus shift in a barrel',
      expr: 'dz = f*(gam + alphah)*DT', tex: '\\Delta z = f\\,(\\gamma + \\alpha_h)\\,\\Delta T',
      vars: {
        dz: { name: 'sensor beyond the image by', q: 'length', unit: 'µm', signed: true, tex: '\\Delta z' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 },
        gam: { name: 'thermal power coefficient of the lens', q: 'expansion', unit: 'ppm/K', value: -4, signed: true, tex: '\\gamma' },
        alphah: { name: 'expansion of the housing', q: 'expansion', unit: 'ppm/K', value: 23, tex: '\\alpha_h' },
        DT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      solveFor: 'dz',
      note: 'The sensor is about one focal length behind the lens. Positive Δz: the sensor is behind the image.',
      stories: { dz: 'A {f} lens with γ = {gam} sits in a housing that expands at {alphah}. By how much does the sensor miss the image after a change of {DT}?', alphah: 'A {f} lens with γ = {gam} must stay in focus ({dz} allowed) over {DT}. What housing expansion is the largest allowed?' }
    },
    {
      name: 'Growth of a part with temperature',
      expr: 'DL = alpha*L*DT', tex: '\\Delta L = \\alpha\\,L\\,\\Delta T',
      vars: {
        DL: { name: 'change of length', q: 'length', unit: 'µm', signed: true, tex: '\\Delta L' },
        alpha: { name: 'thermal expansion', q: 'expansion', unit: 'ppm/K', value: 23, tex: '\\alpha' },
        L: { name: 'length', q: 'length', unit: 'mm', value: 100 },
        DT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 40, signed: true, tex: '\\Delta T' }
      },
      solveFor: 'DL',
      stories: { DL: 'A {L} aluminium spacer ({alpha}) warms by {DT}. How much longer does it become?' }
    },
    {
      name: 'Depth of focus (diffraction criterion)',
      expr: 'dzf = 2*lam*N^2', tex: '\\delta z = 2\\,\\lambda\\,N^2',
      vars: {
        dzf: { name: 'tolerable focus error (plus or minus)', q: 'length', unit: 'µm', tex: '\\delta z' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 4, min: 0.7, max: 64 }
      },
      note: 'Rayleigh quarter-wave criterion; pixel-based criteria may be tighter.',
      stories: { dzf: 'How much may the sensor move either way from the focus of a lens of f/{N} in light of {lam} before the quarter-wave limit is passed?' }
    }
  ],
  examples: [
    {
      title: 'A glass lens in an aluminium barrel',
      q: 'A 100 mm f/4 N-BK7 lens ($\\gamma = -4$ ppm/K) is mounted in an aluminium barrel (23 ppm/K), with the sensor one focal length behind it. How far does the focus miss the sensor when the camera warms by 40 K, and what barrel would cure it?',
      steps: [
        { text: 'Focus error:', tex: '\\Delta z = 100\\ \\mathrm{mm}\\,(-4 + 23)\\times 10^{-6}\\times 40 = 0.076\\ \\mathrm{mm}' },
        { text: 'Tolerance at f/4 in green light:', tex: '2\\lambda N^2 = 2 \\times 0.55\\ \\mu\\mathrm{m} \\times 16 = 17.6\\ \\mu\\mathrm{m}' },
        'The error is 76 µm, four times the tolerance. The cure is a barrel with $\\alpha_h = -\\gamma = 4$ ppm/K, which in practice means invar or titanium; or a focus motor.'
      ],
      a: '76 µm, beyond the 17.6 µm depth of focus: out of focus. A titanium barrel (8.6 ppm/K) gives 18 µm, invar (1.3) about −11 µm.'
    },
    {
      title: 'Acrylic in the sun',
      q: 'A 100 mm acrylic lens ($\\gamma = -282$ ppm/K) is in a plastic housing of 67 ppm/K and warms by 40 K. How far does the focus move relative to the sensor?',
      steps: [
        { text: 'With the plastic housing:', tex: '\\Delta z = 100\\ \\mathrm{mm}\\,(-282 + 67)\\times 10^{-6}\\times 40 = -0.86\\ \\mathrm{mm}' }
      ],
      a: 'The image has moved 0.86 mm behind the sensor, fifty times the depth of focus of an f/4 lens. Plastic lenses are therefore kept short, mixed with glass elements, or refocused by the autofocus motor.'
    }
  ],
  quiz: [
    { q: 'A material has a negative $\\gamma$. What happens to its lens when it warms?', choices: ['The focal length grows (the focus moves out)', 'The focal length shrinks', 'The lens does not change', 'The lens turns birefringent'], a: 0, why: 'The relative change of focal length is $-\\gamma\\Delta T$; with $\\gamma < 0$ the focal length increases on heating.' },
    { q: 'For which housing material is a 100 mm N-BK7 lens nearest to being athermal?', choices: ['Invar or titanium (1 to 9 ppm/K)', 'Aluminium (23 ppm/K)', 'Plastic (67 ppm/K)', 'Brass (19 ppm/K)'], a: 0, why: 'Athermal means $\\alpha_h = -\\gamma = 4$ ppm/K, between invar (1.3) and titanium (8.6); aluminium, brass and plastic expand much more.' },
    { q: 'For plastic lenses the change of index with temperature matters more than their expansion.', a: true, why: 'For acrylic $(dn/dT)/(n-1) = -214$ ppm/K against an expansion of 68 ppm/K, so the index effect is three times the size effect.' },
    { q: 'What is $\\gamma$ for germanium ($n = 4.0$, $dn/dT = 396$ ppm/K, $\\alpha = 6.1$ ppm/K), in ppm/K?', answer: 125.9, why: '$\\gamma = 396/3.0 - 6.1 = 132 - 6.1 = 125.9$ ppm/K. The large positive value means the focal length shortens on heating, strongly.' },
    { q: 'Why does an all-aluminium telescope keep its focus as the temperature changes?', choices: ['Mirrors and frame scale by the same factor, so the shape and the spacing stay similar', 'Aluminium does not expand', 'Aluminium has no dn/dT', 'The mirrors are cooled'], a: 0, why: 'If every part expands by the same factor the design scales uniformly and the focus stays at the same relative position; a mirror has no index to change.' }
  ],
  applications: [
    'Machine-vision and surveillance lenses: titanium or invar spacers, or focus compensation for outdoor use from −30 to +60 °C.',
    'Thermal-imaging lenses: germanium and chalcogenide glass elements arranged so that their opposite signs cancel the focus drift.',
    'Telescope mirrors and interferometer spacers of glass-ceramic and titania-silicate glass, with expansion near zero.',
    'Automotive cameras: plastic and glass hybrids with a barrel chosen to keep the focus from −40 to +105 °C.',
    'High-power laser optics: thermal lensing in windows and crystals sets the limit on average power.'
  ],
  history: 'Charles Édouard Guillaume found in 1896 that an alloy of iron and nickel, invar, hardly expands, and received the Nobel Prize in Physics in 1920 for it. Glass-ceramics of near-zero expansion were developed in the 1960s, in time for large telescope mirrors. Athermal infrared lenses became a design discipline with the first thermal-imaging systems in the 1970s.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, the chapters on optical materials and on tolerances — thermal properties of glasses and athermalization.',
    'P. R. Yoder and D. Vukobratovich, *Opto-Mechanical Systems Design* — thermal effects, athermal mounts and low-expansion materials.',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical properties of materials — expansion and dn/dT of glasses, crystals and plastics.'
  ],
  sim: 'om-thermal'
},

/* ================================================================ glass quality and defects */
{
  id: 'glass-quality-and-defects', parent: 'optical-materials', title: 'Glass quality: bubbles, striae, homogeneity', level: 2,
  short: 'Two blanks with the same glass code can make very different lenses. Their quality is graded by bubbles and inclusions, striae, homogeneity of the index, stress birefringence and the accuracy of index and Abbe number, each with its own classes. Homogeneity of ±2 × 10⁻⁶ over 50 mm costs a third of a wave of wavefront error.',
  keywords: ['glass quality', 'bubbles', 'inclusions', 'striae', 'cords', 'homogeneity', 'inhomogeneity', 'stress birefringence', 'annealing', 'index tolerance', 'glass grade', 'precision annealed', 'shadowgraph', 'OPD', 'wavefront error', 'blank', 'fine annealed'],
  prereq: ['optical-glass', 'transmission-and-absorption'],
  related: ['surface-quality-and-flatness', 'optical-drawings-and-iso-10110', 'photoelasticity-and-stress', 'testing-optics-with-fringes', 'making-optics', 'wavefront-error-and-zernike-polynomials', 'birefringence'],
  body: `
The glass code of a blank (517642) says what the glass is. It says nothing about how well it was made. Five imperfections are graded, and a drawing can ask for a class of each.

| Property | What it is | What it does |
|---|---|---|
| Bubbles and inclusions | gas bubbles, unmelted grains, crystals | scatter light; matter in lasers and in pupils |
| Striae | thin layers of slightly different index, from imperfect mixing | distort the wavefront; cannot be seen without a test |
| Homogeneity | slow variation of $n_d$ across the piece | wavefront error, defocus, a spoiled interferometer |
| Stress birefringence | frozen-in stress from uneven cooling | the glass becomes weakly birefringent; matters between polarizers and in lasers |
| Index and Abbe number | lot-to-lot scatter of $n_d$ and $V_d$ | focal length and colour correction shift |

### Bubbles and inclusions
Every melt contains some. The grades count the *total cross-section* of bubbles and inclusions above a small threshold (a few hundredths of a millimetre) in a given volume of glass; the better classes allow only a fraction of a square millimetre in 100 cm³ of glass. A bubble in a lens near the aperture stop blocks a minute part of the light; in a laser optic it can be a damage site.

### Striae
Cords and striae are streaks of glass whose index differs by a few $10^{-6}$ to $10^{-5}$ from its neighbours. Each is invisible to the eye in the glass, yet it bends light and spoils the wavefront. They are found by shining a point-source or collimated beam through the blank onto a screen, where they appear as thin lines. Grades run from "none seen" to "many strong ones".

### Homogeneity
Even without striae, the index drifts slowly over the blank. The classes give the allowed variation of $n_d$ within a piece, written as $\\pm$ some millionths. They convert directly to **optical path difference** $\\mathrm{OPD} = \\Delta n \\times t$ through a thickness $t$:

| Class | Variation of $n_d$ | Wavefront error through 50 mm (peak to valley) |
|---|---|---|
| 1 | $\\pm 20 \\times 10^{-6}$ | 3.2 waves |
| 2 | $\\pm 5 \\times 10^{-6}$ | 0.79 wave |
| 3 | $\\pm 2 \\times 10^{-6}$ | 0.32 wave |
| 4 | $\\pm 1 \\times 10^{-6}$ | 0.16 wave |
| 5 | $\\pm 0.5 \\times 10^{-6}$ | 0.08 wave |

(Waves of 632.8 nm; the classes follow the usual catalogue and drawing convention, and a given edition of the standard may differ in detail.) Imaging lenses of a few millimetres tolerate classes 2 or 3; an interferometer reference flat of 100 mm needs class 4 or 5.

### Stress birefringence
Glass cooled unevenly freezes in stress. Stress makes glass birefringent, with a retardation proportional to path and stress, and it is quoted as **nanometres per centimetre** of path. Ordinary annealing gives some ten to twenty; precision annealing, with cooling of days instead of hours, a few. A stress of only 0.36 MPa gives 10 nm/cm in N-BK7 ([[photoelasticity-and-stress]]).

### Index tolerance
The index of a melt is known to about $\\pm 5 \\times 10^{-4}$ in the standard grade; slower annealing raises $n_d$ by some $10^{-4}$ and tighter lots narrow it. A lens design is therefore re-optimized for the measured index of the melt.

> [!key] Graded defects: bubbles, striae, homogeneity, stress, index. The one that most often matters to image quality is homogeneity, because it multiplies by the thickness: $\\mathrm{OPD} = \\Delta n\\,t$.
`,
  ideas: [
    'Five properties grade a glass blank: bubbles and inclusions, striae, homogeneity, stress birefringence and index tolerance.',
    'Bubbles scatter; striae and inhomogeneity distort the wavefront; stress makes the glass birefringent.',
    'Homogeneity converts to wavefront error by OPD = Δn × thickness: ±2 × 10⁻⁶ over 50 mm is 0.32 wave peak to valley.',
    'Stress birefringence is quoted in nm/cm: 10 nm/cm corresponds to about 0.36 MPa in N-BK7.',
    'The measured index of the melt, not the catalogue value, is used to finish a precision design.'
  ],
  pitfalls: [
    'Striae can be seen in the glass — They are invisible by ordinary inspection. They are found with a shadowgraph or an interferometer, which is why a blank can be "clear" and still unsuitable for an interferometer.',
    'A bubble-free blank is a perfect blank — Bubbles are the easiest to see and the least harmful in many uses. Inhomogeneity, which cannot be seen, often matters more.',
    'Stress birefringence only matters when you use polarizers — It also changes the focus of polarized beams and the behaviour of laser cavities, and a stressed blank can break when it is ground.',
    'Higher quality is free — Each class tighter takes a longer anneal, finer selection of the melt and more testing, and the price rises accordingly; ask only for what the job needs.'
  ],
  terms: [
    { term: 'Striae', also: ['cords', 'schlieren'], def: 'Thin streaks in glass where the refractive index differs slightly from the surroundings, from incomplete mixing in the melt. Invisible to the eye, they distort the wavefront.' },
    { term: 'Homogeneity', also: ['inhomogeneity', 'index homogeneity'], def: 'The uniformity of the refractive index over a piece of glass. The class states the largest variation of n_d in a blank, ± some millionths.' },
    { term: 'Stress birefringence', also: ['residual stress', 'strain birefringence'], def: 'The weak double refraction that stress frozen into glass causes, stated as the optical path difference in nanometres per centimetre of path.' },
    { term: 'Annealing', also: ['fine annealing', 'precision annealing'], def: 'The slow, controlled cooling of glass through its transformation range to remove stress and set the index. Slower cooling gives lower stress and a slightly higher index.' },
    { term: 'Optical path difference', also: ['OPD', 'wavefront error'], def: 'The difference in optical path between two rays, n × length summed along each. For an index error Δn through thickness t, OPD = Δn t; it is quoted in nanometres or waves.' },
    { term: 'Shadowgraph', also: ['schlieren test'], def: 'A test in which a collimated beam passes through the glass onto a screen; striae appear as dark and bright lines because they bend the rays slightly.' }
  ],
  formulas: [
    {
      name: 'Wavefront error from an index error',
      expr: 'W = Dn*t/lam', tex: 'W = \\frac{\\Delta n\\,t}{\\lambda}',
      vars: {
        W: { name: 'wavefront error in waves (peak to valley)', tex: 'W' },
        Dn: { name: 'peak-to-valley index variation', q: 'ratio', unit: 'ppm', value: 4, tex: '\\Delta n' },
        t: { name: 'thickness of glass crossed', q: 'length', unit: 'mm', value: 50 },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'W',
      note: 'A class 3 blank (±2 ppm, so 4 ppm peak to valley) 50 mm thick: 0.32 wave at 632.8 nm.',
      stories: { W: 'The index in a {t} thick blank varies by {Dn} from one edge to the other. What wavefront error does light of {lam} pick up on a single pass?', Dn: 'A {t} thick blank may add only 0.1 wave of {lam} light to a wavefront. How large a peak-to-valley index variation is allowed?' }
    },
    {
      name: 'Retardation from stress',
      expr: 'opd = 10*K*sigma*t', tex: '\\mathrm{OPD} = 10\\,K\\,\\sigma\\,t',
      vars: {
        opd: { name: 'optical path difference between the two polarizations', q: false, unit: 'nm', tex: '\\mathrm{OPD}' },
        K: { name: 'stress-optic coefficient, in brewsters (10⁻¹² per pascal)', q: false, unit: 'B', value: 2.77, min: 0.1, max: 100 },
        sigma: { name: 'stress in megapascals', q: false, unit: 'MPa', value: 1, tex: '\\sigma', min: 0, max: 100 },
        t: { name: 'path length in centimetres', q: false, unit: 'cm', value: 1, min: 0.01, max: 100 }
      },
      solveFor: 'opd',
      note: 'Units as shown: K in brewsters, σ in MPa, t in cm give the OPD in nm (the 10 is the conversion). N-BK7: K = 2.77 B, so 1 MPa over 1 cm gives 27.7 nm.',
      stories: { opd: 'Glass with a stress-optic coefficient of {K} is under a stress of {sigma} over a path of {t}. How large is the retardation in nanometres?', sigma: 'A glass with a stress-optic coefficient of {K} must show no more than {opd} of retardation over {t}. How large a stress is allowed?' }
    }
  ],
  examples: [
    {
      title: 'Is a class 3 blank good enough for a 50 mm interferometer flat?',
      q: 'A 50 mm thick fused-silica test flat is to be used in transmission at 632.8 nm and its wavefront error from index variation must stay below $\\lambda/10$. The blank has homogeneity class 3 ($\\pm 2 \\times 10^{-6}$). Does it qualify?',
      steps: [
        { text: 'Peak-to-valley index variation $4\\times 10^{-6}$; wavefront error', tex: 'W = \\frac{4\\times 10^{-6}\\times 50\\ \\mathrm{mm}}{632.8\\ \\mathrm{nm}} = \\frac{200\\ \\mathrm{nm}}{632.8\\ \\mathrm{nm}} = 0.32\\ \\text{wave}' },
        'The requirement is 0.1 wave: three times smaller than the 0.32 wave of class 3.'
      ],
      a: 'No: class 3 gives 0.32 wave, three times too much. Class 4 (0.16 wave) is still too much; class 5 (0.08 wave) passes.'
    },
    {
      title: 'What stress is 10 nm/cm?',
      q: 'A glass is accepted when its birefringence is below 10 nm/cm. N-BK7 has a stress-optic coefficient of 2.77 brewsters. What stress corresponds?',
      steps: [
        { text: 'Solve $\\mathrm{OPD} = 10\\,K\\sigma t$ for the stress, with $t = 1$ cm:', tex: '\\sigma = \\frac{10\\ \\mathrm{nm}}{10 \\times 2.77} = 0.36\\ \\mathrm{MPa}' }
      ],
      a: 'About 0.36 MPa, a few atmospheres: an optical polariscope detects stresses far below what could break the glass.'
    }
  ],
  quiz: [
    { q: 'A 100 mm thick blank has an index variation of $\\pm 1\\times 10^{-6}$ across it. What wavefront error does a beam at 632.8 nm pick up in a single pass?', choices: ['About 0.32 wave peak to valley', 'About 0.03 wave', 'About 3 waves', 'None: a variation of one millionth cannot matter'], a: 0, why: 'Peak to valley $2\\times 10^{-6}$ times 100 mm is 200 nm, which is 0.32 of 632.8 nm. Thickness multiplies the tiny index differences.' },
    { q: 'Which defect of a glass blank is detected with a shadowgraph or an interferometer rather than by looking at the glass?', choices: ['Striae', 'Large bubbles', 'A chip at the edge', 'A scratch'], a: 0, why: 'Striae differ from the glass around them only by millionths in index, so they cannot be seen directly, but the rays bend slightly and show on a screen or in a fringe pattern.' },
    { q: 'Stress birefringence is quoted in nm/cm because the retardation is proportional to the path length through the stressed glass.', a: true, why: 'The optical path difference is $K\\sigma t$: for a given stress it grows with the thickness, so a thick blank needs less stress per centimetre.' },
    { q: 'How much retardation, in nanometres, does N-BK7 ($K = 2.77$ B) under 1 MPa of stress show over 1 cm of path?', answer: 27.7, why: '$\\mathrm{OPD} = 10 K\\sigma t = 10 \\times 2.77 \\times 1 \\times 1 = 27.7$ nm (so 10 nm/cm needs 0.36 MPa).' },
    { q: 'Why is a lens re-optimized for the measured index of the melt?', choices: ['Even a standard-grade tolerance of ±0.0005 shifts focal length and aberrations enough to matter in a precision design', 'Catalogue indices are always wrong by 1 %', 'The index changes while the lens is polished', 'Measured values are needed for the glass code'], a: 0, why: 'A change of 0.0005 in index changes the power of a surface by $0.0005/(n-1) \\approx 0.1$ %, which a high-precision design cannot ignore.' }
  ],
  applications: [
    'Interferometer reference flats, spheres and beam splitters: class 4 or 5 homogeneity and very low stress.',
    'Laser optics: few bubbles and inclusions, since each is a possible damage site, and low stress.',
    'Camera and telescope objectives: precision-annealed blanks with the index of the melt measured and the design adjusted.',
    'Polariscopes and polarization microscopes, and optics placed between polarizers: low-stress glass, graded in nm/cm.',
    'Large telescope blanks: homogeneity and striae decide whether a glass mirror blank or lens can be figured to a fraction of a wave.'
  ],
  history: 'Striae were the great problem of early optical glass. Around 1800 the Swiss craftsman Pierre-Louis Guinand found that stirring the melt with a fireclay rod gave far more uniform glass, and at Benediktbeuern near Munich, where Joseph von Fraunhofer worked with him, the method produced the best lenses of the day. Test methods for homogeneity grew with the laser interferometer in the 1960s, and the classes of glass quality became part of the ISO drawing standard for optics.',
  sources: [
    'ISO 12123, *Optics and photonics — Specification of raw optical glass* — the properties and grades of raw glass.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — indication of material imperfections: bubbles, homogeneity, striae and stress birefringence.',
    'Optical-glass makers\' technical information sheets on homogeneity, stress birefringence, bubbles and striae.',
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — testing glass for homogeneity and striae.'
  ],
  sim: [{ id: 'om-fringes', params: { mode: 'blank' } }]
},

/* ================================================================ surface quality and flatness */
{
  id: 'surface-quality-and-flatness', parent: 'optical-materials', title: 'Surface quality: flatness, irregularity, scratch-dig', level: 2,
  short: 'A polished surface can be wrong in three ways: in shape (flatness, power and irregularity, in waves of 632.8 nm), in cosmetics (scratch-dig numbers such as 60-40) and in roughness (nanometres), all within a stated clear aperture. One fringe of an interferogram is half a wavelength of height, so λ/4 means half a fringe.',
  keywords: ['flatness', 'surface flatness', 'lambda over 4', 'lambda/10', 'surface form', 'irregularity', 'power', 'fringes', 'scratch-dig', '60-40', '20-10', 'MIL-PRF-13830', 'surface roughness', 'RMS roughness', 'clear aperture', 'surface quality', 'test plate', 'Fizeau', 'TIS'],
  prereq: ['optical-glass', 'thin-film-interference', 'glass-quality-and-defects'],
  related: ['optical-drawings-and-iso-10110', 'making-optics', 'testing-optics-with-fringes', 'newtons-rings-and-wedge-fringes', 'mirrors-as-components', 'optical-windows', 'reading-an-optics-catalogue', 'laser-damage-and-coating-durability'],
  body: `
A polished surface can be wrong in three different ways, and each has its own specification: it can have the wrong **shape** (form), blemishes you can see (**scratches and digs**), or a roughness too fine to see that scatters light (**texture**). A fourth item, the **clear aperture**, says over which part of the surface the others apply.

### Form: flatness in waves
Form is measured with an interferometer, or in the shop by laying a reference flat (a *test plate*) on the surface and looking at the fringes. The light crosses the gap twice, so one fringe stands for a height difference of **half a wavelength**: 316.4 nm at the helium–neon line, 632.8 nm, which is the usual test wavelength. Flatness is the peak-to-valley departure from the ideal surface in waves of that light:

| Grade | Height error | Fringes | Typical use |
|---|---|---|---|
| λ/2 | 316 nm | 1 | commercial windows |
| λ/4 | 158 nm | ½ | standard precision |
| λ/10 | 63 nm | 0.2 | high precision, laser mirrors |
| λ/20 | 32 nm | 0.1 | laser quality |
| λ/40 | 16 nm | 0.05 | reference flats |

Unless it says RMS, the figure is peak to valley; RMS is a quarter to a fifth of it.

### Power and irregularity
The departure splits in two. **Power** is a regular curvature, a sphere, which shows as rings; **irregularity** is everything left after the best sphere is removed: saddle, hills, turned-down edge, ripple. A drawing gives them separately in fringes, for example *power 1, irregularity ½* ([[optical-drawings-and-iso-10110]]). Power can often be absorbed by refocusing; irregularity cannot.

### What a surface error does to the light
A height error $\\Delta z$ moves a reflected wavefront by $2\\Delta z$ and a wavefront refracted at a glass surface in air by $(n-1)\\Delta z$. A λ/4 mirror therefore gives half a wave of wavefront error, too much for imaging; a λ/4 window face adds only 0.13 wave. Mirrors need grades twice as fine as windows.

### Scratch–dig
The cosmetic grade of the US military specification MIL-PRF-13830B is two numbers. The **scratch** number is found by comparing the worst scratch with reference scratches under standard light: very roughly a tenth of a micrometre of width per unit. The **dig** number is the diameter of the largest pit in hundredths of a millimetre: 50 is 0.5 mm, 10 is 0.1 mm. The standard also limits how many are allowed.

| Grade | Use |
|---|---|
| 80-50 | commercial |
| 60-40 | standard |
| 40-20 | precision |
| 20-10 | high-precision, laser |
| 10-5 | laser quality |

### Roughness
RMS roughness is quoted in nanometres or ångströms: a ground surface a micrometre, polished glass 1 to 2 nm, superpolished mirrors under 0.5 nm. Roughness $\\sigma$ scatters a fraction $\\mathrm{TIS} \\approx (4\\pi\\sigma/\\lambda)^2$ of the light: 0.04 % at 632.8 nm for 1 nm.

### Clear aperture
The specification holds only inside the **clear aperture**, typically 90 % of the diameter; the rim holds the chamfer and chips.

> [!key] One fringe is half a wave of height. λ/4 is half a fringe; scratch-dig 60-40 allows scratches of a few micrometres and digs of 0.4 mm; roughness sets the scatter.
`,
  ideas: [
    'Surface quality has four parts: form (flatness), cosmetics (scratch-dig), roughness and the clear aperture within which they apply.',
    'One interferometric fringe is half a wavelength of surface height: λ/4 is half a fringe, λ/10 is 0.2 fringe, usually at 632.8 nm.',
    'Form splits into power (rings, a sphere) and irregularity (everything else).',
    'A surface error Δz gives a wavefront error of 2Δz on a mirror, (n − 1)Δz on a glass surface: mirrors need twice the grade.',
    'Scratch-dig 60-40 means a scratch matching reference 60 and a dig no more than 0.4 mm; roughness of σ scatters about (4πσ/λ)².'
  ],
  pitfalls: [
    'λ/4 flatness is a quarter of a fringe — It is half a fringe: the light crosses the gap twice, so a fringe is λ/2 of height. Specification and interferogram are easily confused by a factor two.',
    'The scratch number is the scratch width in micrometres — It is a visual match to a reference scratch, only roughly a tenth of a micrometre per unit; the standard concerns visibility, not a measured width.',
    'A scratch-dig of 10-5 is always better — For ordinary imaging it is wasted money. Laser and high-power optics need it because defects scatter and absorb; a camera lens rarely does.',
    'Flatness is the same as roughness — Flatness is the shape over the whole surface in fractions of a wavelength; roughness is the nanometre texture within a small patch. A mirror can be flat to λ/20 and still scatter.'
  ],
  terms: [
    { term: 'Flatness', also: ['surface form', 'figure', 'surface accuracy'], def: 'The peak-to-valley departure of a surface from the ideal, usually in waves of 632.8 nm: λ/4, λ/10, λ/20. It includes power and irregularity.' },
    { term: 'Fringe', also: ['interference fringe'], def: 'One light-and-dark period of an interferogram. Against a reference flat it stands for a height difference of half a wavelength.' },
    { term: 'Power and irregularity', also: ['irregularity', 'sphericity'], def: 'The two parts of a form error: power is the regular spherical curvature, irregularity what remains after removing the best sphere. Both are stated in fringes.' },
    { term: 'Scratch–dig', also: ['scratch and dig', 'surface quality grade', 'MIL-PRF-13830B'], def: 'The cosmetic grade of a polished surface in the form 60-40: a scratch number by comparison with reference scratches, and a dig number equal to the diameter of the largest pit in hundredths of a millimetre.' },
    { term: 'Clear aperture', also: ['CA', 'usable aperture'], def: 'The part of the surface, usually 90 % of the diameter, over which the specified flatness, scratch-dig and coating hold. The rest is chamfer and edge.' },
    { term: 'RMS surface roughness', also: ['σ', 'Rq', 'Å RMS'], def: 'The root-mean-square height of the surface texture over a small patch, in nanometres or ångströms. It sets the scattered light: TIS ≈ (4πσ/λ)².' },
    { term: 'Test plate', also: ['optical flat', 'reference flat'], def: 'A reference surface of known shape laid on a work piece in the shop. The air gap between them gives fringes that show the error.' }
  ],
  formulas: [
    {
      name: 'Height error from fringes',
      expr: 'h = Fr*lam/2', tex: 'h = F\\,\\frac{\\lambda}{2}',
      vars: {
        h: { name: 'height error of the surface', q: 'length', unit: 'nm' },
        Fr: { name: 'number of fringes (peak to valley)', value: 0.5, tex: 'F', min: 0, max: 100 },
        lam: { name: 'test wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'h',
      note: 'Half a fringe is λ/4: 158 nm at 632.8 nm.',
      stories: { h: 'A test plate shows {Fr} fringes of departure in light of {lam}. How large is the height error?', Fr: 'A surface is flat to {h} peak to valley. How many fringes of {lam} light does it show against a test plate?' }
    },
    {
      name: 'Wavefront error from a surface error',
      expr: 'W = k*dz/lam', tex: 'W = \\frac{k\\,\\Delta z}{\\lambda}',
      vars: {
        W: { name: 'wavefront error in waves', tex: 'W' },
        k: { name: 'factor: 2 for a mirror, n − 1 for glass in air', value: 2, min: 0.1, max: 4 },
        dz: { name: 'surface height error', q: 'length', unit: 'nm', value: 158, tex: '\\Delta z' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'W',
      note: 'A λ/4 mirror (158 nm) gives half a wave; the same error on a glass face (k = 0.52) only 0.13.',
      stories: { W: 'A surface has a height error of {dz} (peak to valley). With a factor of {k}, what wavefront error does it cause for light of {lam}?' }
    },
    {
      name: 'Total integrated scatter',
      expr: 'TIS = (4*pi*sigma/lam)^2', tex: '\\mathrm{TIS} = \\left(\\frac{4\\pi\\sigma}{\\lambda}\\right)^2',
      vars: {
        TIS: { name: 'fraction of the light scattered', q: 'ratio', unit: 'ppm', tex: '\\mathrm{TIS}' },
        sigma: { name: 'RMS roughness', q: 'length', unit: 'nm', value: 1, tex: '\\sigma' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'TIS',
      note: 'For a reflecting surface at normal incidence and a roughness much smaller than the wavelength.',
      stories: { TIS: 'A mirror has an RMS roughness of {sigma}. What fraction of {lam} light does it scatter?' }
    }
  ],
  examples: [
    {
      title: 'A λ/4 mirror in a telescope',
      q: 'A mirror is flat to λ/4 peak to valley at 632.8 nm. What wavefront error does it add on reflection, and what flatness would give a wavefront error of λ/10?',
      steps: [
        { text: 'Surface height error λ/4 = 158 nm; on reflection the wavefront error is twice that:', tex: 'W = \\frac{2\\times 158\\ \\mathrm{nm}}{632.8\\ \\mathrm{nm}} = 0.5\\ \\text{wave}' },
        'For a wavefront error of $\\lambda/10$ the surface needs half as much, $\\lambda/20$.'
      ],
      a: 'A λ/4 mirror adds half a wave (λ/2), which blurs an image badly; a λ/10 wavefront needs a λ/20 surface. This is why imaging and laser mirrors are specified λ/10 to λ/20 although windows can be λ/4.'
    },
    {
      title: 'How much light does a polished mirror scatter?',
      q: 'A mirror polished to 1 nm RMS reflects 632.8 nm light. What fraction is scattered, and how much for a superpolished surface of 0.3 nm?',
      steps: [
        { text: 'For $\\sigma = 1$ nm and $\\lambda = 632.8$ nm:', tex: '\\mathrm{TIS} = \\left(\\frac{4\\pi \\times 1}{632.8}\\right)^2 = 3.9\\times 10^{-4}' },
        'For 0.3 nm: $(4\\pi \\times 0.3/632.8)^2 = 3.5\\times 10^{-5}$.'
      ],
      a: '0.039 % for 1 nm and 0.0035 % for 0.3 nm: about 390 and 35 parts per million. Because scatter goes as the roughness squared, a surface three times smoother scatters nine times less.'
    }
  ],
  quiz: [
    { q: 'A surface is flat to λ/4 at 632.8 nm. How many fringes does it show against a reference flat?', choices: ['Half a fringe', 'A quarter of a fringe', 'One fringe', 'Two fringes'], a: 0, why: 'The light crosses the gap twice, so one fringe is λ/2 of height. λ/4 is half of that: half a fringe.' },
    { q: 'In scratch-dig 60-40, what does the 40 stand for?', choices: ['The largest allowed dig, 0.4 mm across', 'A scratch 40 µm wide', 'Forty digs allowed', 'The roughness in ångströms'], a: 0, why: 'The dig number is the diameter in hundredths of a millimetre: 40 is 0.4 mm. The scratch number (60) is a visual comparison with reference scratches.' },
    { q: 'A mirror and a window are both flat to λ/4. The mirror adds the larger wavefront error.', a: true, why: 'Reflection doubles the effect of a height error: $2\\Delta z$, against $(n-1)\\Delta z \\approx 0.5\\Delta z$ at a glass surface in air.' },
    { q: 'What is the total integrated scatter, in parts per million, of a surface of 2 nm RMS roughness at 632.8 nm?', answer: 1577, why: '$(4\\pi \\times 2/632.8)^2 = 1.58 \\times 10^{-3}$, that is 1577 ppm (0.16 %). Doubling the roughness quadruples the scatter.' },
    { q: 'Why does a drawing give power and irregularity separately?', choices: ['Power can be removed by refocusing, irregularity cannot, so they matter differently', 'Power is measured at a different wavelength', 'Irregularity is a cosmetic defect', 'The two have different clear apertures'], a: 0, why: 'A system can be refocused to absorb the regular curvature of power, but the residual irregularity stays in the wavefront.' }
  ],
  applications: [
    'Laser mirrors and windows: λ/10 or better flatness, 20-10 or 10-5 scratch-dig and sub-nanometre roughness to keep scatter and damage low.',
    'Interferometer reference flats and spheres: λ/20 to λ/100 surfaces, since every error goes straight into the measurement.',
    'Camera and microscope lenses: 60-40 or 40-20 surfaces with a few fringes of power and irregularity of a fraction of a fringe.',
    'Machine-vision windows and filters: λ/4 to λ/2 flatness is enough, and the scratch-dig is chosen to avoid visible defects in the image.',
    'Prisms and beam splitters: flatness of the faces sets the wavefront error and the quality of the transmitted image.'
  ],
  history: 'The test glass is old: opticians laid master surfaces on work, and from the nineteenth century they counted the fringes (Newton\'s rings) between them. Foucault\'s knife-edge test of 1858 let mirror makers find errors of a fraction of a wavelength. The scratch-dig scheme comes from the US military specifications for fire-control optics of the Second World War and Cold War era, and the laser interferometer in the 1960s replaced the test plate for precise work.',
  sources: [
    'MIL-PRF-13830B, *Optical components for fire control instruments: general specification governing the manufacture, assembly, and inspection of* — the scratch-dig standard.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — the parts on surface form tolerances, imperfections and texture.',
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — test plates, Fizeau interferometers and the measurement of form.',
    'J. C. Stover, *Optical Scattering: Measurement and Analysis* (SPIE Press) — roughness and total integrated scatter.'
  ],
  sim: [{ id: 'om-fringes', params: { mode: 'surface' } }]
},

/* ================================================================ optical drawings and ISO 10110 */
{
  id: 'optical-drawings-and-iso-10110', parent: 'optical-materials', title: 'Optical drawings and ISO 10110', level: 2,
  short: 'An optical drawing is the contract between designer and optical shop. Besides the shape and size it states the glass and its grade, the form and centring of each surface, its surface imperfections, roughness, coating and chamfers. ISO 10110 gives each of these a fixed place and notation, so that a drawing reads the same in every workshop.',
  keywords: ['optical drawing', 'ISO 10110', 'drawing standard', 'lens drawing', 'tolerance', 'centring', 'decentre', 'wedge', 'clear aperture', 'chamfer', 'bevel', 'surface imperfection', 'form tolerance', 'material specification', 'toleranced data', 'optical specification'],
  prereq: ['surface-quality-and-flatness', 'glass-quality-and-defects', 'optical-glass'],
  related: ['reading-an-optics-catalogue', 'lens-tolerances-and-centration', 'making-optics', 'specifying-an-optical-system', 'tolerancing-and-alignment-budget', 'cleaning-and-handling-optics', 'angle-of-incidence-and-coatings'],
  body: `
A mechanical drawing says where the metal is. An **optical drawing** must also say what the part does to light, and to what accuracy. It is the contract between the designer and the shop, and since the shop may be in another country the notation is standardized: **ISO 10110**, *Preparation of drawings for optical elements and systems*, a series of parts, one for each kind of indication.

### What a drawing states
1. **Shape and size**: diameter, radii of curvature (with a sign), thicknesses, chamfers, with tolerances.
2. **Material**: the glass or crystal, its index and Abbe number with tolerances, and the grades for homogeneity, stress birefringence, bubbles and striae ([[glass-quality-and-defects]]).
3. **Form of each surface**: power and irregularity in fringes at a stated wavelength ([[surface-quality-and-flatness]]).
4. **Centring**: how well the optical axis coincides with the mechanical one, as a tilt of the axis (arcminutes) or an offset (millimetres).
5. **Surface imperfections**: scratches and digs, either in the ISO form (number and size of imperfections) or the military scratch-dig.
6. **Texture, treatment, coating and laser damage threshold**: roughness, coating specification with the angle of incidence ([[angle-of-incidence-and-coatings]]) and the wavelength band, protective chamfers.

### How it is laid out
The element is drawn in section with the light travelling from the left, an axis in chain line and surfaces numbered from the left. Beside the drawing is a **table** with a column for the left surface, one for the right surface and one for the material, so that each tolerance sits in a fixed cell. Dimensions are in millimetres, and the **clear aperture** is marked: the diameter inside which the optical specifications apply.

| Entry (plano-convex lens, f = 100 mm) | Typical value |
|---|---|
| Material | N-BK7, $n_d = 1.5168 \\pm 0.0005$ |
| Diameter | 25.4 mm, +0/−0.1 |
| Radius $R_1$ | 51.7 mm, since $R = (n-1)f$ |
| Centre thickness | 4.5 mm ± 0.1 (edge thickness 2.9 mm, sag 1.58 mm) |
| Clear aperture | at least 90 % of the diameter, 22.9 mm |
| Form | power 2 fringes, irregularity ½ fringe at 632.8 nm |
| Centring | beam deviation up to 3 arcminutes |
| Imperfections | 60-40 scratch-dig |
| Coating | anti-reflection, 400–700 nm, under 0.5 % per face at 0° |
| Chamfer | protective, 0.3 mm maximum |

### Tolerances cost money
Each tolerance has grades, and tightening one costs more:

| | Commercial | Precision | High precision |
|---|---|---|---|
| Diameter | +0/−0.1 mm | +0/−0.025 mm | +0/−0.01 mm |
| Centring | 3 to 5′ | 1 to 3′ | under 1′ |
| Focal length | ±2 % | ±1 % | ±0.1 to 0.5 % |
| Scratch-dig | 80-50 | 60-40 or 40-20 | 20-10 |

These are typical ladders; shops differ. A drawing should ask only for what the function needs. Over-specifying, for example a 10-5 surface on a lens inside a camera, can double the cost for no gain; under-specifying a laser mirror costs far more in the failed instrument.

### What a drawing does not say
It does not say how the part is made, how it is mounted, or what happens to the coating in the field. For a cemented doublet a second drawing states the cement layer, the relative centring and the assembly.

> [!key] An optical drawing states shape, material grade, form, centring, imperfections, roughness and coating, in the fixed places and units of ISO 10110, with the clear aperture marked. Tighter tolerances cost more: specify what the job needs.
`,
  ideas: [
    'An optical drawing states more than size: material grades, surface form, centring, imperfections, roughness, coating.',
    'ISO 10110 fixes a place, a unit and a notation for each, so that drawings read alike everywhere.',
    'Each surface and the material has its own column in the table beside the section drawing; the clear aperture is marked.',
    'Centring is stated as a tilt of the optical axis (arcminutes) or a decentre (mm); form in fringes at a stated wavelength.',
    'Tolerances come in grades, and every tightening costs more: specify only what the function needs.'
  ],
  pitfalls: [
    'A drawing with only diameter, radius and thickness is enough — It is a mechanical drawing. Without form, centring and imperfections, a shop will supply its own commercial grade, which may fail the system.',
    'The diameter is the area that must be good — The specification holds only over the clear aperture (usually 90 %); the rim is chamfered and may be chipped.',
    'A tighter tolerance everywhere is the safe choice — It raises the price steeply and can lower the yield. Specify what the system needs, with the budget spread over the elements.',
    'ISO 10110 replaces scratch-dig — Both are in use. The military scratch-dig grade is common in catalogues; ISO 10110 states surface imperfections as numbers and sizes and is common in drawings.'
  ],
  terms: [
    { term: 'ISO 10110', also: ['optical drawing standard'], def: 'The international standard series for preparing drawings of optical elements and systems. Each part covers one kind of indication: material, form, centring, imperfections, texture, coating, laser damage.' },
    { term: 'Centring tolerance', also: ['decentre', 'wedge', 'beam deviation', 'axis tilt'], def: 'The allowed error between the optical axis of an element and its mechanical axis, given as a tilt (arcminutes of beam deviation) or a lateral offset (millimetres).' },
    { term: 'Protective chamfer', also: ['bevel', 'edge chamfer'], def: 'A small flat ground on the edge of a lens or window to prevent chipping, quoted as a maximum size, for example 0.3 mm at 45°. It lies outside the clear aperture.' },
    { term: 'Surface imperfection tolerance', also: ['cosmetic tolerance'], def: 'The number and size of scratches, pits, bubbles and chips allowed on a surface. The ISO form gives a count and a size grade; the military form is scratch-dig.' },
    { term: 'Material specification', also: ['glass specification'], def: 'The part of a drawing that names the glass or crystal and grades its index, homogeneity, stress birefringence, bubbles and striae.' }
  ],
  formulas: [
    {
      name: 'Radius of a plano-convex lens',
      expr: 'R = (n - 1)*f', tex: 'R = (n - 1)\\,f',
      vars: {
        R: { name: 'radius of the curved surface', q: 'length', unit: 'mm' },
        n: { name: 'refractive index', value: 1.5168, min: 1.1, max: 4 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 100 }
      },
      solveFor: 'R',
      note: 'Thin lens with one flat face; the lensmaker\'s equation with R2 infinite.',
      stories: { R: 'A plano-convex lens of index {n} is to have a focal length of {f}. What radius must the curved surface have?' }
    },
    {
      name: 'Edge thickness of a plano-convex lens',
      expr: 'et = ct - (R - sqrt(R^2 - (D/2)^2))', tex: 'e = t_c - \\left(R - \\sqrt{R^2 - \\left(\\tfrac{D}{2}\\right)^2}\\right)',
      vars: {
        et: { name: 'edge thickness', q: 'length', unit: 'mm', tex: 'e' },
        ct: { name: 'centre thickness', q: 'length', unit: 'mm', value: 4.5, tex: 't_c' },
        R: { name: 'radius of the curved surface', q: 'length', unit: 'mm', value: 51.68, min: 13 },
        D: { name: 'diameter', q: 'length', unit: 'mm', value: 25.4 }
      },
      solveFor: 'et',
      note: 'The sag of the curved surface, 1.58 mm here, is what the centre is thicker than the edge.',
      stories: { et: 'A plano-convex lens {D} across has a centre thickness of {ct} and a curved face of radius {R}. How thick is its edge?' }
    }
  ],
  examples: [
    {
      title: 'The numbers of a catalogue lens',
      q: 'A plano-convex lens of N-BK7 ($n = 1.5168$) is wanted with a focal length of 100 mm and a diameter of 25.4 mm. What radius does the drawing give, and how thick is the edge if the centre is 4.5 mm?',
      steps: [
        { text: 'Radius:', tex: 'R = (n-1)f = 0.5168 \\times 100\\ \\mathrm{mm} = 51.7\\ \\mathrm{mm}' },
        { text: 'Sag of the curved face at the rim:', tex: 's = R - \\sqrt{R^2 - (D/2)^2} = 51.68 - \\sqrt{51.68^2 - 12.7^2} = 1.58\\ \\mathrm{mm}' },
        'Edge thickness $= 4.5 - 1.58 = 2.9$ mm.'
      ],
      a: '51.7 mm and 2.9 mm. The edge must be thick enough to hold and chamfer safely; designers check it before choosing the centre thickness.'
    },
    {
      title: 'Clear aperture',
      q: 'The drawing says clear aperture 90 % of the diameter for a 25.4 mm lens. Within what diameter must the form, scratch-dig and coating specifications hold?',
      steps: [
        { text: 'Ninety per cent of the diameter:', tex: '0.90 \\times 25.4\\ \\mathrm{mm} = 22.9\\ \\mathrm{mm}' }
      ],
      a: '22.9 mm. Outside it, 1.25 mm all round, there may be the chamfer, small chips and an edge of the coating that is not controlled.'
    }
  ],
  quiz: [
    { q: 'Where do the specifications for flatness and scratch-dig apply on a lens?', choices: ['Within the clear aperture', 'Over the whole diameter, edge included', 'Only at the centre', 'Only on the flat face'], a: 0, why: 'The clear aperture, typically 90 % of the diameter, is the zone where the optical specification holds; the rim carries the chamfer and may be chipped.' },
    { q: 'What does the centring tolerance of a lens limit?', choices: ['The angle or offset between its optical axis and its mechanical axis', 'The thickness at the centre', 'The index at the centre of the glass', 'The roughness of the centre of the surface'], a: 0, why: 'A lens whose optical axis is tilted or offset from the mechanical axis steers the beam or shifts the image in its mount. It is quoted as a tilt in arcminutes or an offset in millimetres.' },
    { q: 'A drawing that lists only diameter, radius and thickness is a complete optical drawing.', a: false, why: 'It lacks the material grade, surface form, centring, imperfections, roughness and coating, the very items that make it an optical drawing; the shop would fall back on commercial grades.' },
    { q: 'A plano-convex lens of $n = 1.5168$ and $f = 100$ mm has what radius of curvature, in mm?', answer: 51.68, why: '$R = (n-1)f = 0.5168 \\times 100 = 51.68$ mm, from the lensmaker\'s equation with one flat face.' },
    { q: 'Why is it wasteful to ask for scratch-dig 10-5 on every lens of a machine-vision objective?', choices: ['The cost rises steeply and the image rarely needs it', 'The grade does not exist for lenses', 'It would make the lens too soft', 'The lens could not be coated afterwards'], a: 0, why: 'Tighter cosmetic grades take more polishing and inspection and cost many times as much. Surfaces near the stop and the image matter more than others, and 60-40 is usually enough.' }
  ],
  applications: [
    'Ordering custom lenses, windows and prisms from an optical shop: the drawing is the specification and the acceptance test.',
    'Reading a catalogue: the entries (diameter, EFL, centre thickness, scratch-dig, clear aperture, coating) are the abbreviated drawing of a stock part.',
    'Tolerance budgeting: a designer allots the system\'s error budget among the elements and states each on its drawing.',
    'Incoming inspection and disputes: the drawing defines what a part is allowed to be.',
    'Documentation of a design for production, with assembly drawings for cemented and mounted groups.'
  ],
  history: 'Optical drawings grew out of workshop practice in the nineteenth and twentieth centuries, with national standards in Germany (DIN) and the United States (military specifications) that differed in notation. The ISO 10110 series, first issued in the 1990s, unified the notation and has been revised since; each part is updated separately.',
  sources: [
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — the series, one part for each kind of indication.',
    'W. J. Smith, *Modern Optical Engineering*, the chapter on tolerances — what to state and how tight.',
    'R. R. Shannon, *The Art and Science of Optical Design* (Cambridge) — tolerancing and the preparation of drawings.'
  ],
  sim: 'om-drawing'
},

/* ================================================================ making optics */
{
  id: 'making-optics', parent: 'optical-materials', title: 'How optics are made', level: 2,
  short: 'A lens is made by grinding a blank to shape with diamond, lapping it with ever finer abrasive to remove the damage of the coarser one, polishing it with cerium oxide to nanometre roughness, then centring and edging it. Glass and plastic can instead be moulded, crystals and metal mirrors diamond turned, and aspheres finished by computer-controlled polishing.',
  keywords: ['making optics', 'optical fabrication', 'grinding', 'lapping', 'polishing', 'cerium oxide', 'generating', 'centring', 'edging', 'cementing', 'precision glass moulding', 'injection moulding', 'diamond turning', 'magnetorheological finishing', 'MRF', 'ion beam figuring', 'subsurface damage', 'Preston', 'optical shop', 'pitch lap'],
  prereq: ['optical-glass', 'surface-quality-and-flatness', 'optical-drawings-and-iso-10110'],
  related: ['how-coatings-are-made', 'optical-plastics', 'optical-crystals', 'aspheric-surfaces', 'testing-surfaces-with-interferometers', 'lens-tolerances-and-centration', 'cleaning-and-handling-optics'],
  body: `
A lens begins as a block of glass and ends as a surface good to a fraction of a wavelength. The path between has changed little in principle since Newton: remove glass with something hard, then with something softer and finer, and measure at each step.

### The stages
| Stage | Tool and abrasive | What it does | Surface afterwards |
|---|---|---|---|
| Cutting and **generating** | bonded diamond saw and cup wheel | rough shape, radius and thickness to about 0.05 mm | rough, a micrometre or more |
| **Grinding** and lapping | spherical iron or brass tool, loose abrasive or diamond pellets, from 30 down to about 3 µm | remove the damage of generating and set the radius | matt, a tenth of a micrometre |
| **Polishing** | pitch or polyurethane lap, cerium oxide of about 1 µm in water | removes the last damage layer, makes the surface clear | 1 to 2 nm RMS, sub-nanometre if superpolished |
| **Centring and edging** | diamond wheel on the lens turning about its optical axis | sets the diameter and the optical axis | chamfered edge |
| **Cementing**, coating, inspection | optical cement, vacuum coaters ([[how-coatings-are-made]]), interferometers | assemble doublets, coat, test | the finished part |

Each stage must remove the **subsurface damage** left by the one before, a layer of cracks a few times as deep as the abrasive is large, before the next is useful. The finer stage takes longer for the same area, so a shop moves on as soon as the damage is gone.

### Why most lens surfaces are spheres
Rub two surfaces together with random strokes and they wear to fit each other; the only shape that fits itself in every position is a sphere (a plane is a sphere of infinite radius, found by lapping three flats against each other). The tool shape fixes the lens shape, so a sphere is cheap to make and an asphere is not.

### The cup wheel
In generating, a diamond ring of mean diameter $D_w$ is tilted by an angle $\\alpha$ to the axis of the turning blank, and cuts a sphere of radius $R = D_w/(2\\sin\\alpha)$: a 100 mm ring at 60° gives 57.7 mm.

### Moulding, turning and correcting
- **Moulded glass.** A preform of low-melting glass is heated above its glass-transition temperature and pressed between precise moulds in nitrogen. Aspheres for cameras are made this way in minutes.
- **Moulded plastic** ([[optical-plastics]]) by injection moulding, in seconds.
- **Diamond turning.** A single diamond cuts germanium, silicon, zinc selenide, fluorides, plastics and metal mirrors to a few nanometres roughness, with aspheres and freeforms as easily as spheres.
- **Computer-controlled finishing.** A small tool dwells longer where a measured error map says glass must go; magnetorheological finishing uses a magnetically stiffened fluid ribbon, ion-beam figuring a beam of ions. Form errors of a few nanometres follow.

> [!warn] Fine glass and crystal dust, cerium oxide and polishing slurries need extraction, gloves and protection of eyes and lungs; some materials (ZnSe, chalcogenides) are toxic ([[uv-and-infrared-materials]]).

> [!key] Grind to shape, lap finer to remove the damage, polish to nanometres, centre and edge, test at every stage. Spheres are cheap because tool and work wear to fit each other; moulding, diamond turning and computer-controlled finishing make the rest.
`,
  ideas: [
    'Making a lens is a chain of finer abrasives: diamond generating, loose-abrasive lapping, cerium-oxide polishing, then centring.',
    'Each stage must remove the subsurface damage of the last, a few times deeper than the abrasive size.',
    'Spherical surfaces are cheap because tool and work wear to fit each other under random strokes; a plane is a sphere of infinite radius.',
    'Moulding (glass or plastic), diamond turning and computer-controlled polishing (MRF, ion-beam figuring) make aspheres and freeforms.',
    'Every stage is followed by measurement; the final accuracy is the accuracy of the test.'
  ],
  pitfalls: [
    'Polishing is just very fine sanding — It combines mechanical abrasion with chemistry at the glass surface (water and the cerium oxide particle), reaching nanometre roughness; nothing "flows".',
    'Aspheres are made with the same tools, just pressed harder — A lap cannot fit an asphere in every position, so aspheres need other methods: generation with small tools, moulding, diamond turning, computer-controlled finishing, and a precision test.',
    'A finer abrasive can start earlier to save time — Each stage must remove the damage of the previous, so skipping a stage leaves cracks the polish cannot reach; a polished surface can show them later as scratches.',
    'The machine decides the accuracy — The test does: a surface cannot be made better than it can be measured. The best-known failure, the Hubble primary mirror, was polished very precisely to the wrong shape, 2 µm off at the edge, because of an error in the measuring setup.'
  ],
  terms: [
    { term: 'Generating', also: ['rough grinding', 'curve generating'], def: 'The first shaping of a blank with a bonded-diamond cup wheel, which gives the radius, thickness and rough form before fine grinding and polishing.' },
    { term: 'Lapping', also: ['fine grinding', 'loose-abrasive grinding'], def: 'Grinding against a shaped tool with loose abrasive of decreasing size, removing the damage of coarser stages and refining the radius.' },
    { term: 'Polishing', def: 'The final stage, with a pitch or polyurethane lap and a slurry of a fine oxide (usually cerium oxide), taking away the last layer of damage and leaving 1 to 2 nm RMS roughness or less.' },
    { term: 'Subsurface damage', also: ['SSD'], def: 'The layer of microcracks below a ground surface, reaching a few times deeper than the abrasive size. It must be polished away; unremoved, it scatters light and weakens the part.' },
    { term: 'Centring and edging', also: ['edging', 'centring machine'], def: 'The step in which a lens is aligned on its optical axis and ground to its final diameter, so that the optical and mechanical axes coincide within the tolerance.' },
    { term: 'Magnetorheological finishing', also: ['MRF'], def: 'Computer-controlled polishing with a magnetic fluid that stiffens in a field into a polishing ribbon; the dwell time is set from the measured error map. Corrects form to a few nanometres.' },
    { term: 'Diamond turning', also: ['single-point diamond turning', 'SPDT'], def: 'Cutting an optical surface with a single-crystal diamond tool on an ultra-precision lathe. For metals, plastics and infrared crystals; gives aspheres and freeforms without polishing.' }
  ],
  formulas: [
    {
      name: 'Radius generated by a cup wheel',
      expr: 'R = Dw/(2*sin(alpha))', tex: 'R = \\frac{D_w}{2\\sin\\alpha}',
      vars: {
        R: { name: 'radius of the generated sphere', q: 'length', unit: 'mm' },
        Dw: { name: 'mean diameter of the diamond ring', q: 'length', unit: 'mm', value: 100, tex: 'D_w' },
        alpha: { name: 'tilt of the wheel axis to the work axis', q: 'angle', unit: '°', value: 60, min: 5, max: 90, tex: '\\alpha' }
      },
      solveFor: 'R',
      note: 'The ring cuts a circle on the blank; its size and tilt fix the sphere through that circle.',
      stories: { R: 'A diamond cup wheel with a mean ring diameter of {Dw} is tilted at {alpha} to the axis of the blank. What radius does it generate?', alpha: 'A cup wheel of mean ring diameter {Dw} must generate a sphere of radius {R}. At what tilt must it be set?' }
    }
  ],
  examples: [
    {
      title: 'Setting the generator for a radius',
      q: 'A convex surface of radius 57.7 mm is to be generated with a cup wheel of mean ring diameter 100 mm. What tilt of the wheel is needed?',
      steps: [
        { text: 'Solve $R = D_w/(2\\sin\\alpha)$ for the angle:', tex: '\\sin\\alpha = \\frac{D_w}{2R} = \\frac{100}{115.4} = 0.866 \\quad\\Rightarrow\\quad \\alpha = 60°' }
      ],
      a: '60°. The smaller the angle, the flatter the surface: a plane would need the wheel axis parallel to the work axis.'
    },
    {
      title: 'How much to polish off',
      q: 'Fine grinding with 9 µm abrasive leaves damage perhaps three times as deep as the grain. About how much glass must polishing remove before the surface is good?',
      steps: [
        { text: 'Depth of the damage layer:', tex: '3 \\times 9\\ \\mu\\mathrm{m} \\approx 27\\ \\mu\\mathrm{m}' },
        'A little more is removed for safety, since the polish is slow.'
      ],
      a: 'At least 25 to 30 µm. Polishing is slow (micrometres per hour to per minute), which is why shops grind to a finer stage first and keep the damage shallow.'
    }
  ],
  quiz: [
    { q: 'Why is it the sphere that is the natural surface of a lens?', choices: ['Tool and work wear to fit each other under random strokes, and only a sphere fits itself in every position', 'Light focuses best through a sphere', 'Glass naturally assumes a spherical shape', 'It is the cheapest shape to measure'], a: 0, why: 'Lapping two surfaces together with random motion makes both spherical (one convex, one concave) or, with three flats, plane. Spherical aberration is a separate matter and is the price of the shape.' },
    { q: 'Subsurface damage from grinding is typically…', choices: ['a few times deeper than the abrasive grain size', 'much shallower than the grain', 'exactly equal to the grain', 'present only after polishing'], a: 0, why: 'Hard grains press cracks into the glass to a depth of several grain diameters; each following stage must remove that layer.' },
    { q: 'Diamond turning is the usual method of finishing an optical glass lens.', a: false, why: 'Glass is brittle and chips; glass lenses are ground and polished or moulded. Diamond turning is for metals, plastics and infrared crystals such as germanium.' },
    { q: 'A diamond cup wheel with a ring of mean diameter 100 mm is tilted at 60°. What radius does it generate, in mm?', answer: 57.7, why: '$R = D_w/(2\\sin 60°) = 100/1.732 = 57.7$ mm.' },
    { q: 'Which method corrects the form of a surface by choosing where a small tool dwells, from a measured error map?', choices: ['Computer-controlled finishing, such as magnetorheological finishing or ion-beam figuring', 'Cementing', 'Centring and edging', 'Anti-reflection coating'], a: 0, why: 'The error map becomes a dwell-time map: the tool stays where more material must go. This is how aspheres and high-grade flats are corrected to nanometres.' }
  ],
  applications: [
    'Camera, microscope and binocular lenses: ground, polished, centred and coated, in batches of tens blocked together.',
    'Aspheres for phone cameras and projectors: moulded glass and plastic.',
    'Thermal-imaging lenses of germanium and chalcogenide glass: diamond turned or moulded.',
    'Telescope mirrors: ground and polished over months with computer-controlled finishing, tested by interferometry.',
    'Lithography and space optics: MRF and ion-beam figuring to a few nanometres of form error.'
  ],
  history: 'Newton polished the metal mirror of his reflecting telescope of 1668 with pitch and fine abrasive, and studied the fringes between a lens and a flat glass that now carry his name. Foucault introduced the knife-edge test in 1858 and silvered glass mirrors in the same years. Diamond turning grew out of ultra-precision machining in the 1960s and 1970s, and magnetorheological finishing, developed in the 1990s, made deterministic finishing of aspheres routine. The Hubble mirror of 1990 was polished to the wrong shape, 2 µm too flat at its edge, because its test setup was wrong, an error found only in orbit.',
  sources: [
    'H. H. Karow, *Fabrication Methods for Precision Optics* (Wiley) — the stages of grinding, lapping and polishing, and the machines.',
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the measurements that guide every stage.',
    'M. Bass (ed.), *Handbook of Optics*, the volume on optical elements and systems — the chapter on optical fabrication.',
    'ISO 10110, *Optics and photonics — Preparation of drawings for optical elements and systems* — what the shop is asked to make.'
  ],
  sim: 'om-making'
}

);
