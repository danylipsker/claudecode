/* HYPER-BIOLOGY · content/cells.js — the Cells branch, part 1: cell structure (cell theory and size,
 * microscopy, prokaryotic and eukaryotic cells, the nucleus and ribosomes, the endomembrane system,
 * mitochondria and chloroplasts, the cytoskeleton) and membranes and transport (the fluid mosaic
 * membrane, diffusion and osmosis, water potential, active transport, endocytosis and exocytosis).
 * Simulations are in sims/cells.js (ids cell-…). */
Hyper.add(

/* ================================================================ CELL STRUCTURE */
{
  id: 'cell-theory', parent: 'cell-structure', title: 'Cell theory and the size of cells', level: 1,
  short: 'All living things are made of cells, the cell is the smallest unit of life, and every cell comes from another cell. Cells stay small because they live through their surface, and surface grows more slowly than volume.',
  keywords: ['cell theory', 'omnis cellula e cellula', 'Schleiden', 'Schwann', 'Virchow', 'Hooke', 'Leeuwenhoek', 'cell size', 'surface area to volume ratio', 'SA:V', 'why cells are small', 'diffusion limit', 'spontaneous generation'],
  prereq: ['math:surface-area', 'math:scaling-laws'],
  related: ['microscopy', 'prokaryotic-cells', 'eukaryotic-cells', 'diffusion-osmosis', 'scaling-allometry', 'gas-exchange-animals', 'viruses', 'medicine:cell-structure'],
  body: `
Every living thing is built of **cells**, and three short statements — the **cell theory** — sum up what that means:

1. All organisms are made of one or more cells.
2. The cell is the smallest unit that is alive: it takes in energy and materials, keeps its inside different from its outside, and can reproduce itself.
3. Every cell comes from a pre-existing cell by division — *omnis cellula e cellula*.

The third statement is the deepest. No cell is ever assembled from scratch: your cells descend, by an unbroken chain of divisions, from the fertilised egg you started as, that egg from cells of your parents, and so on back some 3.5–4 billion years to the first cells on Earth. Viruses are not cells — they have no metabolism of their own and are copied only inside a host cell — which is why they sit at the edge of life ([[viruses]]).

### How big are cells?
Most cells are between 1 and 100 µm across: invisible to the naked eye, which separates points about 0.1 mm apart, but easy to see with a light microscope ([[microscopy]]).

| Cell | Typical size | Volume | Surface ÷ volume (per µm) |
|---|---|---|---|
| *Mycoplasma*, the smallest free-living bacteria | 0.3 µm | 0.01 µm³ | 20 |
| *Escherichia coli* | 1 µm × 2 µm rod | about 1 µm³ (1 fL) | about 5 |
| Baker's yeast | 5 µm | 65 µm³ | 1.2 |
| Human red blood cell | 7.5 µm disc, 2 µm thick | 90 µm³ | 1.5 (a sphere of the same volume: 1.1) |
| Liver cell | 20 µm | about 5 000 µm³ | 0.3 |
| Human egg | 120 µm | 900 000 µm³ (0.9 nL) | 0.05 |
| Frog egg | 1.5 mm | 1.8 mm³ | 0.004 |

An adult human is about $3\\times10^{13}$ cells of more than two hundred types — and carries a similar number of bacteria, mostly in the gut.

### Why cells are small: surface and volume
A cell lives through its surface. Oxygen, sugar and salts come in through the membrane, wastes and heat go out through it, but how much of them the cell needs is set by the volume of living material inside. For a sphere of radius $r$ and diameter $d$,

$$A = 4\\pi r^2, \\qquad V = \\tfrac{4}{3}\\pi r^3, \\qquad \\frac{A}{V} = \\frac{3}{r} = \\frac{6}{d}$$

and for a cube of side $L$, $A/V = 6/L$. Whatever the shape, **the surface-area-to-volume ratio falls in inverse proportion to size**: double the diameter and each cubic micrometre of cell is served by half as much membrane, because the area has grown fourfold and the volume eightfold. A 1 µm bacterium has 6 µm² of surface for every µm³ inside; a 20 µm liver cell has 0.3, twenty times less; a 120 µm egg 0.05.

### Diffusion sets a second limit
Inside a cell most molecules move by diffusion, which is quick over short distances and hopeless over long ones: the time to spread a distance $x$ grows with its **square**, $t \\approx x^2/2D$ ([[diffusion-osmosis]]). For oxygen in water, $D \\approx 2\\times10^{-9}\\ \\mathrm{m^2/s}$:

| Distance | Time for oxygen to diffuse it |
|---|---|
| 1 µm | 0.25 ms |
| 10 µm | 25 ms |
| 100 µm | 2.5 s |
| 1 mm | 4 minutes |
| 1 cm | 7 hours |

A cell tens of micrometres across is supplied in milliseconds; a living blob a centimetre across would suffocate at its centre.

### How big cells cope
- **Flatten or stretch**: red cells are thin discs; the axon of a motor neuron can be a metre long but only 1–20 µm wide.
- **Fold the surface**: the microvilli of a gut lining cell multiply its absorbing surface about twentyfold.
- **Fill up with inert material**: an egg is mostly yolk and a plant cell mostly a water-filled vacuole, which presses the living cytoplasm into a thin layer under the membrane.
- **Move things actively**: motor proteins and cytoplasmic streaming inside cells, and in animals a circulation that brings a capillary within about 0.1 mm of almost every cell.
- **Divide**: cutting one cube into eight doubles the total surface without changing the volume — try it in the simulation below.

> [!key] Area grows as size squared, volume as size cubed, so $A/V \\propto 1/\\text{size}$. Together with diffusion times that grow as distance squared, this keeps almost all cells between 1 and 100 µm — big organisms have more cells, not bigger ones.
`,
  ideas: [
    'All organisms are made of cells; the cell is the smallest living unit; every cell comes from a pre-existing cell.',
    'Surface area grows as size squared and volume as size cubed, so the surface-area-to-volume ratio (6/d for a sphere) falls as a cell grows.',
    'Diffusion time rises with the square of the distance: milliseconds across a cell, hours across a centimetre.',
    'Large cells cope by being flat, long, folded or full of inert material; large organisms by being made of many small cells supplied by a circulation.'
  ],
  pitfalls: [
    'Bigger organisms have bigger cells — An elephant\'s liver cells are about the size of a mouse\'s. Large organisms have more cells, not larger ones; eggs and long nerve cells are the special cases.',
    'A cell twice as wide has twice as much surface for its volume — It has half: its surface grows four times but its volume eight times, so A/V = 6/d halves.',
    'Viruses are the smallest cells — Viruses are not cells at all: they cannot make energy or proteins and are copied only inside a host cell. The smallest cells are bacteria such as Mycoplasma, about 0.3 µm across.'
  ],
  formulas: [
    {
      name: 'Surface-area-to-volume ratio of a sphere',
      expr: 'SV = 6/d', tex: '\\mathrm{SA{:}V} = \\dfrac{A}{V} = \\dfrac{6}{d}',
      vars: {
        SV: { name: 'surface-area-to-volume ratio', q: 'wavenumber', unit: '1/µm', tex: '\\mathrm{SA{:}V}' },
        d: { name: 'cell diameter', q: 'length', unit: 'µm', value: 20 }
      },
      note: 'The same as 3/r. A cube of side L has 6/L; any shape scales as 1/size. Read 0.3 µm⁻¹ as "0.3 µm² of membrane for every µm³ of cell".',
      stories: {
        SV: 'A roughly spherical liver cell is {d} across. What is its surface-area-to-volume ratio?',
        d: 'A spherical cell has a surface-area-to-volume ratio of {SV}. What is its diameter?'
      }
    },
    {
      name: 'Total surface after cutting a cube into n × n × n pieces',
      expr: 'A = 6*L^2*n', tex: 'A_{\\mathrm{tot}} = 6L^2 n',
      vars: {
        A: { name: 'total surface of all the pieces', q: 'area', unit: 'µm²', tex: 'A_{\\mathrm{tot}}' },
        L: { name: 'side of the original cube', q: 'length', unit: 'µm', value: 20 },
        n: { name: 'pieces along each edge (n³ pieces in all)', int: true, value: 2, min: 1 }
      },
      note: 'The volume stays L³ however finely it is cut; each piece has side L/n, so the ratio rises to 6n/L.',
      stories: {
        A: 'A cube of living material {L} on a side is cut into n³ equal cubes, with n = {n} along each edge. What is their total surface area?',
        n: 'A cube {L} on a side is cut into n × n × n equal cubes with a total surface of {A}. How many pieces lie along each edge?'
      }
    },
    {
      name: 'Volume of a spherical cell',
      expr: 'V = pi*d^3/6', tex: 'V = \\dfrac{\\pi d^3}{6}',
      vars: {
        V: { name: 'volume', q: false, unit: 'µm³' },
        d: { name: 'diameter', q: false, unit: 'µm', value: 120 }
      },
      note: '1 µm³ is 1 femtolitre (fL); 1000 µm³ is 1 picolitre; a million µm³ is 1 nanolitre.',
      stories: { V: 'A human egg is {d} across. What is its volume?', d: 'A spherical cell has a volume of {V}. How wide is it?' }
    }
  ],
  examples: [
    {
      title: 'A bacterium and a liver cell',
      q: 'Compare the surface-area-to-volume ratios of a 1 µm bacterium and a 20 µm liver cell, treating both as spheres. How many times more volume does the liver cell have?',
      steps: [
        'Bacterium: $6/d = 6/1 = 6\\ \\mathrm{\\mu m^{-1}}$. Liver cell: $6/20 = 0.3\\ \\mathrm{\\mu m^{-1}}$.',
        'Ratio of the two: $6/0.3 = 20$ — the bacterium has twenty times more membrane per unit of cytoplasm.',
        'Volume goes as $d^3$: $(20/1)^3 = 8000$.'
      ],
      a: 'SA:V is 6 µm⁻¹ against 0.3 µm⁻¹ (20 times more for the bacterium); the liver cell holds 8000 times the volume.'
    },
    {
      title: 'Cutting a cube',
      q: 'A cube of cytoplasm 20 µm on a side is divided into 8 equal cubes, then into 64. Find the total surface area and SA:V each time.',
      steps: [
        'Whole cube: $A = 6 \\times 20^2 = 2400\\ \\mathrm{\\mu m^2}$, $V = 8000\\ \\mathrm{\\mu m^3}$, ratio $0.3\\ \\mathrm{\\mu m^{-1}}$.',
        'Eight cubes ($n = 2$): $A = 6 \\times 400 \\times 2 = 4800\\ \\mathrm{\\mu m^2}$ with the same volume, ratio $0.6\\ \\mathrm{\\mu m^{-1}}$.',
        'Sixty-four cubes ($n = 4$): $A = 9600\\ \\mathrm{\\mu m^2}$, ratio $1.2\\ \\mathrm{\\mu m^{-1}}$ — each division along the edges adds surface in proportion.'
      ],
      a: '2400, 4800 and 9600 µm²; SA:V 0.3, 0.6 and 1.2 µm⁻¹.'
    },
    {
      title: 'How big can a cell without a circulation be?',
      q: 'Oxygen diffuses with D ≈ 2 × 10⁻⁹ m²/s. How long does it take to reach the centre of a spherical cell 20 µm across, and of a ball of cells 2 mm across?',
      steps: [
        'The distance to the centre is the radius: 10 µm and 1 mm.',
        '$t = x^2/2D = (10^{-5})^2/(4\\times10^{-9}) = 0.025$ s.',
        '$t = (10^{-3})^2/(4\\times10^{-9}) = 250$ s — and the cells on the way use up the oxygen long before it arrives, so the centre of such a ball dies. This is why grown tissues and tumour spheroids more than about half a millimetre thick develop a dead core.'
      ],
      a: 'About 25 ms for the cell; about 4 minutes for the 2 mm ball, far too slow.'
    }
  ],
  quiz: [
    { q: 'A spherical cell doubles its diameter. Its surface-area-to-volume ratio…', choices: ['doubles', 'stays the same', 'halves', 'falls to one eighth'], a: 2, why: 'Area rises four times and volume eight times, so A/V = 6/d halves. One eighth would be the change in A/V if area did not grow at all.' },
    { q: 'Which statement is part of the cell theory?', choices: ['Cells can arise from non-living matter under the right conditions', 'Every cell comes from a pre-existing cell', 'Every cell has a nucleus', 'Viruses are the simplest cells'], a: 1, why: 'Omnis cellula e cellula (Virchow, 1855). Spontaneous generation was disproved by Pasteur; bacteria have no nucleus; viruses are not cells.' },
    { q: 'What is the surface-area-to-volume ratio of a spherical cell 3 µm across?', answer: 2, unit: '1/µm', why: '6/d = 6/3 = 2 µm⁻¹.' },
    { q: 'Cutting a cube into eight equal smaller cubes doubles its total surface area.', a: true, why: 'Each small cube has a quarter of the face area of the big one, and there are eight of them: 8 × 1/4 = 2 times the surface (6L²n with n = 2).' },
    { q: 'A frog egg is 1.5 mm across and still a single cell. Why can it be so large?', choices: ['Frog cells have faster diffusion', 'It is mostly inert yolk, so little of its volume needs supplying', 'Its membrane is folded into microvilli', 'It has no mitochondria'], a: 1, why: 'Yolk is a food store that uses almost no oxygen; the active cytoplasm is a thin layer. Diffusion is no faster in frogs.' }
  ],
  problems: [
    { q: 'A cube of cytoplasm 30 µm on a side is cut into 27 equal cubes. What is their total surface area?', answer: 16200, unit: 'µm²', tol: 0.02, steps: ['27 cubes means n = 3 along each edge.', '$A = 6L^2n = 6 \\times 900 \\times 3 = 16\\,200\\ \\mathrm{\\mu m^2}$ — three times the original 5400 µm².'] },
    { q: 'How long does oxygen (D = 2 × 10⁻⁹ m²/s) take to diffuse 50 µm?', answer: 0.625, unit: 's', tol: 0.03, steps: ['$t = x^2/2D = (5\\times10^{-5})^2/(4\\times10^{-9})$', '$= 2.5\\times10^{-9}/4\\times10^{-9} = 0.63$ s.'] }
  ],
  applications: [
    'Tissue engineering: grown tissue thicker than a few hundred micrometres dies at its centre unless it is given blood vessels or a perfused scaffold.',
    'Cell culture and bioreactors, where the oxygen supply limits the thickness of cell layers and the size of spheroids and organoids.',
    'Why animals larger than a few millimetres needed gills, lungs and a circulation, and why insects, which rely on air tubes, stay small.',
    'Nanoparticles and powdered catalysts, which exploit a huge surface for their volume.'
  ],
  history: 'Robert Hooke named "cells" in 1665 after the empty boxes he saw in a slice of cork. From 1674 Antonie van Leeuwenhoek, with lenses of his own making, saw living single cells — protists, sperm and bacteria. Matthias Schleiden (1838, for plants) and Theodor Schwann (1839, for animals) proposed that all organisms are made of cells; Robert Remak showed that new cells arise by division, and Rudolf Virchow made "omnis cellula e cellula" famous in 1855. Louis Pasteur\'s swan-neck flask experiments (1859–1862) disposed of spontaneous generation.',
  sim: 'cell-sav'
},

{
  id: 'microscopy', parent: 'cell-structure', title: 'Microscopes and what they reveal', level: 1,
  short: 'A microscope magnifies, but what it can show is limited by its resolution — about 200 nm for light, set by the wavelength, and well under a nanometre for electrons. Fluorescent labels light up single kinds of molecule in living cells.',
  keywords: ['microscope', 'magnification', 'resolution', 'resolving power', 'Abbe limit', 'numerical aperture', 'electron microscope', 'TEM', 'SEM', 'cryo-EM', 'fluorescence', 'GFP', 'confocal', 'super-resolution', 'scale bar', 'empty magnification'],
  prereq: ['cell-theory', 'physics:magnification', 'physics:resolution'],
  related: ['physics:optical-instruments', 'physics:single-slit-diffraction', 'physics:de-broglie-wavelength', 'prokaryotic-cells', 'eukaryotic-cells', 'protein-structure', 'gene-expression-tools'],
  body: `
Nearly everything interesting about cells is smaller than the eye can see. The unaided eye, looking at something 25 cm away, separates two points about 0.1 mm apart; a typical cell is 10–100 µm across, a mitochondrion 1 µm, a ribosome 25 nm. A microscope does two different jobs, and it is easy to confuse them:

- **Magnification** makes the image bigger.
- **Resolution** is the smallest distance between two points that still shows them as two. It decides how much *detail* there is to magnify.

### Magnification
$$M = \\frac{\\text{image size}}{\\text{actual size}}$$

Both sizes must be in the same unit — the classic slip is to divide millimetres by micrometres. A mitochondrion 2 µm long that appears 30 mm long on a micrograph is magnified $30\\,000\\ \\mathrm{\\mu m} / 2\\ \\mathrm{\\mu m} = 15\\,000$ times. In a compound light microscope the total magnification is the objective's times the eyepiece's: a 40× objective with a 10× eyepiece gives 400×. Printed micrographs carry a **scale bar**, which stays correct however the picture is enlarged or shrunk. (Units to keep straight: 1 mm = 1000 µm, 1 µm = 1000 nm.)

### Resolution: the wavelength wins
Light passing through the aperture of a lens spreads by diffraction, so even a perfect lens images a point as a small blurred disc (an Airy disc). Ernst Abbe showed in 1873 that two points closer than about

$$d = \\frac{\\lambda}{2\\,\\mathrm{NA}}$$

cannot be separated, where $\\lambda$ is the wavelength and NA the **numerical aperture** — the refractive index between specimen and lens times the sine of the lens's half-angle of acceptance, at most about 1.4 for an oil-immersion objective. With green light (550 nm) that is about **200 nm**. (Rayleigh's criterion, $0.61\\lambda/\\mathrm{NA}$, gives 240 nm — the same order.) A light microscope therefore shows cells, nuclei, chloroplasts and bacteria, and mitochondria only as specks — but not ribosomes (25 nm), membranes (5 nm) or most viruses (20–300 nm). Magnifying beyond the point where 200 nm becomes visible to the eye — roughly 1000 × NA — adds nothing: this is **empty magnification**, a larger blur.

### Electron microscopes
Electrons have a wavelength too, $\\lambda = h/p$; accelerated through 100 kV it is about 0.004 nm, more than 100 000 times shorter than green light. Magnetic lenses are far from perfect, so the practical limit is about 0.1–0.2 nm in a **transmission electron microscope** (TEM), which sends electrons through a section 50–100 nm thin stained with heavy metals, and 1–10 nm in a **scanning electron microscope** (SEM), which scans a beam over a metal-coated surface and gives a vivid three-dimensional look. The price is that specimens sit in a vacuum, fixed, sliced or coated: they are dead. **Cryo-electron microscopy** freezes molecules in glass-like ice and averages many thousands of images of them; it now resolves proteins to 2–3 Å, close to individual atoms.

| Instrument | Best resolution | Specimen |
|---|---|---|
| Eye | 0.1 mm | — |
| Light microscope | 200 nm | living or fixed, in colour |
| Confocal fluorescence | 200 nm across, 500 nm in depth | living, in optical slices |
| Super-resolution fluorescence (STED, PALM, STORM) | 20–50 nm | labelled, often living |
| Scanning EM | 1–10 nm | coated surfaces, in vacuum |
| Transmission EM | 0.1–0.2 nm (about 1 nm in stained cell sections) | thin fixed sections |
| Cryo-EM of purified proteins | 0.2–0.3 nm | frozen molecules |

### Seeing the invisible: contrast and fluorescence
Cells are mostly water and nearly transparent. Stains (iodine for starch, methylene blue, the Gram stain for bacteria) give contrast to dead cells; **phase contrast** and **differential interference contrast** turn tiny differences in refractive index into light and dark in living ones. **Fluorescence** microscopy lights up only the molecules you label — with a dye, an antibody carrying a dye, or a protein fused to **green fluorescent protein** (GFP) from a jellyfish, which absorbs blue light and glows green. A **confocal** microscope blocks out-of-focus light with a pinhole to cut optical slices through a living cell, and **super-resolution** methods get round Abbe's limit by switching fluorescent molecules on and off so that neighbours are never bright at the same time.

> [!tip] Magnification without resolution is empty. Ask first what the instrument can *resolve*; then magnify just enough for the eye to see that detail.
`,
  ideas: [
    'Magnification = image size / actual size, with both in the same unit.',
    'Resolution, not magnification, limits what can be seen: about λ/2NA ≈ 200 nm for a light microscope.',
    'Electrons have wavelengths of picometres, so electron microscopes resolve down to about 0.1–0.2 nm — but the specimen must be dead and in a vacuum.',
    'Fluorescent labels such as GFP show where particular molecules are in living cells; super-resolution methods beat the diffraction limit.'
  ],
  pitfalls: [
    'A higher magnification always shows more detail — Only up to the resolution limit; beyond about 1000 × NA the image just gets bigger and blurrier (empty magnification).',
    'Light microscopes cannot see anything smaller than 200 nm — They cannot *separate* two things closer than that, but a single bright fluorescent object far smaller (one labelled protein) shows up as a 200 nm spot, and its centre can be located to a few nanometres.',
    'Electron microscopes show living cells in more detail — Electron microscopy needs a vacuum and fixed, stained or frozen specimens: it shows dead cells. Living cells are studied with light.'
  ],
  formulas: [
    {
      name: 'Magnification',
      expr: 'M = I/A', tex: 'M = \\dfrac{I}{A}',
      vars: {
        M: { name: 'magnification' },
        I: { name: 'size of the image', q: 'length', unit: 'mm', value: 30 },
        A: { name: 'actual size of the object', q: 'length', unit: 'µm', value: 2 }
      },
      note: 'The calculator converts the units; by hand, put both sizes in the same unit first.',
      practice: { unknowns: ['M', 'A', 'I'] },
      stories: {
        M: 'A mitochondrion {A} long is {I} long on a micrograph. What is the magnification?',
        A: 'On a micrograph magnified {M} times, a chloroplast measures {I}. How long is it really?',
        I: 'A red blood cell {A} across is photographed at a magnification of {M}. How big is its image?'
      }
    },
    {
      name: 'Resolution limit (Abbe)',
      expr: 'd = lambda/(2*NA)', tex: 'd = \\dfrac{\\lambda}{2\\,\\mathrm{NA}}',
      vars: {
        d: { name: 'smallest resolvable distance', q: 'length', unit: 'nm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550 },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.05, max: 1.6, tex: '\\mathrm{NA}' }
      },
      note: 'NA = n sin θ: about 0.1 for a 4× objective, 0.65 for 40× dry, 1.3–1.4 for 100× oil immersion. Rayleigh\'s criterion uses 0.61 λ/NA.',
      stories: {
        d: 'An oil-immersion objective with NA = {NA} is used with light of wavelength {lambda}. What is the smallest separation it can resolve?',
        NA: 'To resolve details {d} apart with light of {lambda}, what numerical aperture is needed?',
        lambda: 'With NA = {NA}, what wavelength would resolve {d}?'
      }
    },
    {
      name: 'Total magnification of a compound microscope',
      expr: 'M = Mo*Me', tex: 'M = M_o\\,M_e',
      vars: {
        M: { name: 'total magnification' },
        Mo: { name: 'objective magnification', value: 40, tex: 'M_o' },
        Me: { name: 'eyepiece magnification', value: 10, tex: 'M_e' }
      },
      stories: { M: 'A {Mo} objective is used with a {Me} eyepiece. What is the total magnification?', Mo: 'Which objective gives a total magnification of {M} with a {Me} eyepiece?' }
    },
    {
      name: 'Wavelength of an electron beam',
      expr: 'lambda = h/sqrt(2*me*qe*U)', tex: '\\lambda = \\dfrac{h}{\\sqrt{2\\,m_e\\,e\\,U}}',
      vars: {
        lambda: { name: 'electron wavelength', q: 'length', unit: 'pm' },
        h: { const: 'h' }, me: { const: 'me' }, qe: { const: 'qe' },
        U: { name: 'accelerating voltage', q: 'voltage', unit: 'kV', value: 100 }
      },
      note: 'The de Broglie wavelength h/p without relativity; at 100 kV the true value is about 5 % shorter (3.7 pm). Lens aberrations, not the wavelength, limit real electron microscopes.',
      stories: { lambda: 'Electrons are accelerated through {U} in a transmission electron microscope. What is their wavelength?', U: 'What accelerating voltage gives electrons a wavelength of {lambda}?' }
    }
  ],
  examples: [
    {
      title: 'Measuring a cell on a micrograph',
      q: 'A red blood cell measures 36 mm across on a micrograph with a scale bar showing that 20 mm represents 4 µm. What is the magnification, and how wide is the cell?',
      steps: [
        'Magnification from the scale bar: $M = 20\\ \\mathrm{mm}/4\\ \\mathrm{\\mu m} = 20\\,000\\ \\mathrm{\\mu m}/4\\ \\mathrm{\\mu m} = 5000$.',
        'Actual size: $36\\ \\mathrm{mm}/5000 = 36\\,000\\ \\mathrm{\\mu m}/5000 = 7.2\\ \\mathrm{\\mu m}$.'
      ],
      a: '5000×; the cell is 7.2 µm across.'
    },
    {
      title: 'Can a light microscope separate two ribosomes?',
      q: 'Ribosomes on the rough ER lie about 50 nm apart. Can the best light microscope (NA 1.4, blue light 450 nm) resolve them?',
      steps: [
        '$d = \\lambda/2\\mathrm{NA} = 450/(2\\times1.4) = 161$ nm.',
        'The ribosomes are three times closer than that, so they merge into a blur; even a single ribosome, 25 nm wide, is far below the limit.',
        'An electron microscope, resolving about 1 nm in a stained section, shows them clearly — that is how George Palade discovered them in the 1950s.'
      ],
      a: 'No: the limit is about 160 nm, and ribosomes are 50 nm apart.'
    },
    {
      title: 'Useful magnification',
      q: 'The eye resolves about 0.2 mm comfortably. What total magnification makes the 200 nm limit of an oil-immersion objective just visible?',
      steps: ['$M = 0.2\\ \\mathrm{mm}/200\\ \\mathrm{nm} = 2\\times10^{-4}/2\\times10^{-7} = 1000$.', 'Beyond about 1000–1500× the image only gets bigger, not sharper.'],
      a: 'About 1000×; that is why light microscopes stop at 1000–1500×.'
    }
  ],
  quiz: [
    { q: 'A structure 5 µm long appears 25 mm long in a drawing. The magnification is…', choices: ['5×', '500×', '5000×', '125×'], a: 2, why: '25 mm = 25 000 µm; 25 000/5 = 5000. Dividing 25 by 5 without converting units gives the wrong answer 5.' },
    { q: 'Why can a light microscope not show ribosomes, however much it magnifies?', choices: ['Ribosomes are transparent', 'Its resolution is limited by the wavelength of light to about 200 nm', 'Glass lenses cannot magnify more than 400×', 'Ribosomes move too fast'], a: 1, why: 'Diffraction limits resolution to about λ/2NA; a 25 nm ribosome is well below that. More magnification only enlarges the blur.' },
    { q: 'Using ultraviolet light (250 nm) instead of green (550 nm) with the same objective improves the resolution.', a: true, why: 'd = λ/2NA is proportional to the wavelength: 250 nm light roughly halves d. (Glass absorbs UV, so quartz optics are needed.)' },
    { q: 'What is the Abbe limit, in nm, for green light (550 nm) and NA = 1.25?', answer: 220, unit: 'nm', why: '550/(2 × 1.25) = 220 nm.' },
    { q: 'Which method would you choose to follow where a protein goes inside a living cell?', choices: ['Transmission electron microscopy', 'Scanning electron microscopy', 'Fluorescence microscopy of the protein fused to GFP', 'Staining with methylene blue'], a: 2, why: 'A GFP fusion lights up only that protein, in a living cell. Electron microscopy needs dead, fixed specimens; a general stain does not pick out one protein.' }
  ],
  problems: [
    { q: 'A bacterium 2.5 µm long is photographed at 12 000×. How long is its image, in mm?', answer: 30, unit: 'mm', tol: 0.02, steps: ['Image = M × actual = 12 000 × 2.5 µm = 30 000 µm = 30 mm.'] },
    { q: 'An objective has NA = 0.65. What is its resolution limit with 500 nm light?', answer: 385, unit: 'nm', tol: 0.02, steps: ['$d = 500/(2\\times0.65) = 385$ nm — too coarse to separate two small mitochondria lying side by side.'] }
  ],
  applications: [
    'Pathology: diagnosing cancer and infection from stained tissue sections and smears.',
    'Following proteins, organelles and whole cells live with fluorescent reporters in research and drug discovery.',
    'Cryo-electron microscopy of viral and membrane proteins for vaccine and drug design.',
    'Electron microscopy of virus particles, which first showed the shapes of many viruses.'
  ],
  history: 'Compound microscopes appeared in the Netherlands around 1600; Hooke and van Leeuwenhoek used them in the 1660s–1670s. Ernst Abbe worked out the diffraction limit in 1873 with the lens maker Carl Zeiss. Ernst Ruska and Max Knoll built the first electron microscope in 1931 (Ruska\'s Nobel Prize came in 1986); Frits Zernike won the 1953 Nobel Prize for phase contrast. GFP (Shimomura, Chalfie and Tsien, Nobel Prize 2008), super-resolution microscopy (Betzig, Hell and Moerner, 2014) and cryo-EM (Dubochet, Frank and Henderson, 2017) followed.',
  sim: 'cell-microscope'
},

{
  id: 'prokaryotic-cells', parent: 'cell-structure', title: 'Prokaryotic cells', level: 1,
  short: 'Bacteria and archaea: small cells, usually 0.5–5 µm, with no nucleus and no membrane-bound organelles — one circular chromosome in a nucleoid, 70S ribosomes, a cell wall, and often plasmids, a capsule and flagella.',
  keywords: ['prokaryote', 'bacteria', 'archaea', 'nucleoid', 'plasmid', '70S ribosome', 'peptidoglycan', 'cell wall', 'Gram stain', 'Gram-positive', 'Gram-negative', 'capsule', 'pili', 'flagellum', 'binary fission', 'E. coli'],
  prereq: ['cell-theory', 'microscopy', 'nucleic-acids'],
  related: ['eukaryotic-cells', 'bacteria-archaea', 'three-domains', 'bacterial-growth', 'antibiotic-resistance', 'mitochondria-chloroplasts', 'medicine:microbes-types', 'medicine:antibiotics'],
  body: `
Prokaryotes — **bacteria** and **archaea** — are cells without a nucleus. They were the only life on Earth for perhaps two billion years and are still by far the most numerous, some $10^{30}$ cells in soil, ocean sediments, hot springs and our own gut. Small and plain in layout, they are biochemically the most inventive organisms there are.

### The layout of a bacterium
Take *Escherichia coli*, the best-studied cell of all: a rod about 1 µm wide and 2 µm long, with a volume of about 1 fL.

- **Cytoplasm** with no membrane-bound compartments. The DNA sits in an irregular region, the **nucleoid**, with no membrane round it.
- One **circular chromosome** of 4.6 million base pairs carrying about 4300 genes. Stretched out it would be 1.6 mm long — some 800 times the length of the cell — so it is folded and supercoiled with proteins.
- Often **plasmids**: small extra circles of DNA, a few thousand base pairs long, which may carry genes for antibiotic resistance and can pass from cell to cell.
- **70S ribosomes** (a 50S and a 30S subunit), 20 nm across — under ten thousand in a slowly growing cell, about seventy thousand in one that doubles every twenty minutes.
- A **plasma membrane** that also does the work mitochondria do in our cells: respiration and ATP synthesis happen on it.
- A **cell wall** of **peptidoglycan** — sugar chains cross-linked by short peptides into one giant bag-shaped molecule that holds the cell's internal pressure.
- Outside, in many species: a slimy **capsule**, hair-like **pili** for sticking to surfaces and passing DNA, and one or more **flagella**.

### Two kinds of wall: the Gram stain
| | Gram-positive (*Staphylococcus*, *Bacillus*) | Gram-negative (*E. coli*, *Salmonella*) |
|---|---|---|
| Peptidoglycan | thick, 20–80 nm | thin, 2–7 nm |
| Outer membrane | none | yes, with lipopolysaccharide |
| Colour after Gram staining | purple (the dye is held in the thick wall) | pink (the counterstain) |
| Penicillin and lysozyme | usually vulnerable | the outer membrane often shields the wall |

The wall matters in medicine. Penicillin blocks the enzymes that cross-link peptidoglycan, and human cells have no peptidoglycan at all, so the drug harms bacteria and not us; other antibiotics exploit the differences between 70S and 80S ribosomes ([[medicine:antibiotics|antibiotics]]).

### A rotary motor
A bacterial flagellum is a helical protein filament turned by a true rotary motor in the membrane, powered by protons flowing into the cell — roughly a thousand per revolution. It spins at about 100 revolutions a second (the sodium-driven motors of *Vibrio* exceed 1000) and drives *E. coli* at 20–30 µm/s, ten body lengths a second. The cell steers by reversing the motor now and then: straight runs and random tumbles, with longer runs when things are getting better.

### Growth by division
Bacteria reproduce by **binary fission**: the chromosome is copied, the copies move apart and a ring of the protein FtsZ pinches the cell in two. In rich medium at 37 °C *E. coli* divides every 20 minutes, so one cell could in principle become $2^{72} \\approx 5\\times10^{21}$ in a day; food runs out long before ([[bacterial-growth]]).

### Archaea
Archaea look like bacteria under the microscope but are a separate domain ([[three-domains]]), recognised by Carl Woese in 1977 from their ribosomal RNA. Their membrane lipids are ether-linked isoprenoid chains instead of the ester-linked fatty acids of bacteria and eukaryotes, their walls lack peptidoglycan, and their machinery for copying and reading DNA resembles ours more than a bacterium's. Many live in extremes — one methane-maker grows at 122 °C, halophiles in saturated brine — and none is known to cause disease.

> [!note] "Prokaryote" describes a cell plan, not a family: archaea are in fact more closely related to us than to bacteria.
`,
  ideas: [
    'Prokaryotes (bacteria and archaea) have no nucleus and no membrane-bound organelles; their DNA lies in a nucleoid.',
    'A typical bacterium has one circular chromosome, often plasmids, 70S ribosomes, a plasma membrane that makes ATP, and a peptidoglycan wall.',
    'Gram-positive walls are thick peptidoglycan; Gram-negative ones are thin, with an outer membrane.',
    'Bacteria divide by binary fission, as fast as every 20 minutes; flagella are rotary motors driven by ion flow.'
  ],
  pitfalls: [
    'Prokaryotes have no ribosomes because they have no organelles — They have plenty of ribosomes (70S); ribosomes are not bounded by a membrane, so they are not "organelles" in the membrane sense.',
    'Bacterial DNA floats loose and unorganised — The chromosome is compacted by proteins and supercoiling into a structured nucleoid, and its position in the cell is actively controlled.',
    'All prokaryotes are germs — Only a tiny fraction of bacteria cause disease, and no archaeon is known to; most are harmless or essential, from nitrogen-fixers to the gut microbiome.'
  ],
  formulas: [
    {
      name: 'Binary fission',
      expr: 'N = N0*2^(t/g)', tex: 'N = N_0 \\cdot 2^{t/g}',
      vars: {
        N: { name: 'number of cells' },
        N0: { name: 'starting number of cells', value: 1 },
        t: { name: 'time', q: 'time', unit: 'h', value: 3 },
        g: { name: 'doubling (generation) time', q: 'time', unit: 'min', value: 20 }
      },
      note: 'Unlimited growth only; real cultures slow down as food runs out (see bacterial growth curves).',
      practice: { unknowns: ['N', 't', 'g'] },
      stories: {
        N: 'A bacterium that divides every {g} is given ideal conditions for {t}. Starting from {N0} cell(s), how many are there?',
        t: 'Starting from {N0} cell(s) dividing every {g}, how long does it take to reach {N} cells?',
        g: 'A culture grows from {N0} to {N} cells in {t}. What is the doubling time?'
      }
    },
    {
      name: 'Length of a DNA molecule',
      expr: 'L = N*b', tex: 'L = N\\,b',
      vars: {
        L: { name: 'length of the DNA', q: 'length', unit: 'mm' },
        N: { name: 'number of base pairs', value: 4.64e6 },
        b: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true }
      },
      note: 'B-form DNA rises 0.34 nm per base pair (10.5 base pairs per turn of 3.6 nm).',
      stories: { L: 'The E. coli chromosome has {N} base pairs. How long is it when stretched out?', N: 'A circular bacterial chromosome is {L} long. How many base pairs does it have?' }
    }
  ],
  examples: [
    {
      title: 'From one cell to a colony',
      q: 'One *E. coli* cell divides every 20 minutes. How many cells are there after 3 hours, and after 10 hours if growth stayed unlimited?',
      steps: [
        '3 h = 180 min = 9 doublings: $2^9 = 512$ cells.',
        '10 h = 30 doublings: $2^{30} \\approx 1.1\\times10^9$ — about the number of cells in a visible colony on an agar plate.'
      ],
      a: '512 cells after 3 hours; about a billion after 10.'
    },
    {
      title: 'Packing the chromosome',
      q: 'How long is the 4.64 million base pair chromosome of *E. coli*, and how many times the 2 µm length of the cell is that?',
      steps: ['$L = 4.64\\times10^6 \\times 0.34\\ \\mathrm{nm} = 1.58\\times10^6\\ \\mathrm{nm} = 1.58$ mm.', '$1580\\ \\mathrm{\\mu m} / 2\\ \\mathrm{\\mu m} \\approx 790$.'],
      a: '1.6 mm — nearly 800 times the length of the cell.'
    },
    {
      title: 'How fast is a swimming bacterium?',
      q: '*E. coli* swims at 25 µm/s. How many body lengths (2 µm) per second is that, and how fast would a 1.8 m person go at the same rate?',
      steps: ['$25/2 = 12.5$ body lengths per second.', '$12.5 \\times 1.8\\ \\mathrm{m} = 22.5$ m/s, about 80 km/h — though for a bacterium water is as thick as honey would be to us, and it stops within a fraction of a nanometre when the motor stops.'],
      a: '12.5 lengths a second, like a person running at about 80 km/h.'
    }
  ],
  quiz: [
    { q: 'Which of these is found in prokaryotic cells?', choices: ['a nucleus', 'mitochondria', '70S ribosomes', 'endoplasmic reticulum'], a: 2, why: 'Prokaryotes have ribosomes (70S) but no membrane-bound compartments: no nucleus, mitochondria or ER.' },
    { q: 'Penicillin kills many bacteria but does not harm human cells because…', choices: ['human cells have no ribosomes', 'it blocks the building of peptidoglycan walls, which human cells do not have', 'bacteria have no plasma membrane', 'human cells pump it out immediately'], a: 1, why: 'Selective toxicity: the drug hits a structure only bacteria have.' },
    { q: 'Bacterial DNA is enclosed in a nuclear membrane that lacks pores.', a: false, why: 'There is no nuclear membrane at all; the DNA lies in the nucleoid, directly in the cytoplasm, where ribosomes can start translating an mRNA while it is still being transcribed.' },
    { q: 'A bacterium divides every 30 minutes. Starting from one cell, how many are there after 4 hours of unlimited growth?', answer: 256, why: '4 h = 8 doublings; 2⁸ = 256.' },
    { q: 'Archaea are best described as…', choices: ['bacteria that live in extreme places', 'a separate domain of prokaryotes whose DNA machinery resembles that of eukaryotes', 'the ancestors of viruses', 'eukaryotes that lost their nucleus'], a: 1, why: 'Archaea are a domain of their own (Woese, 1977). Many live in ordinary places — soil, oceans, our gut — and their transcription and translation machinery is eukaryote-like.' }
  ],
  problems: [
    { q: 'The chromosome of *Staphylococcus aureus* has about 2.8 million base pairs. How long is it, in mm?', answer: 0.952, unit: 'mm', tol: 0.02, steps: ['$L = 2.8\\times10^6 \\times 0.34\\ \\mathrm{nm} = 9.5\\times10^5$ nm = 0.95 mm.'] },
    { q: 'A culture grows from 1000 to 64 000 cells in 2 hours. What is the doubling time, in minutes?', answer: 20, unit: 'min', tol: 0.02, steps: ['64 000/1000 = 64 = 2⁶: six doublings.', '120 min / 6 = 20 min.'] }
  ],
  applications: [
    'Click through the parts of a bacterium in [the cell explorer](#/tools/cell/explorer).',
    'Antibiotics aimed at structures only bacteria have — peptidoglycan walls and 70S ribosomes.',
    'Bacteria as factories: human insulin has been made in *E. coli* since 1982.',
    'Nitrogen fixation, decomposition and bioremediation, all done largely by prokaryotes.',
    'Enzymes from heat-loving prokaryotes, such as the DNA polymerase used in PCR.'
  ],
  history: 'Antonie van Leeuwenhoek described bacteria from rainwater and tooth scrapings in letters to the Royal Society in 1676 and 1683. Hans Christian Gram published his stain in 1884. Édouard Chatton coined "prokaryote" and "eukaryote" in 1925, and Roger Stanier and C. B. van Niel defined the distinction in 1962. In 1977 Carl Woese and George Fox showed from ribosomal RNA that the prokaryotes are two domains, bacteria and archaea.'
},

{
  id: 'eukaryotic-cells', parent: 'cell-structure', title: 'Eukaryotic cells', level: 1,
  short: 'Cells with a nucleus and membrane-bound organelles — those of animals, plants, fungi and protists. Typically 10–100 µm across, they divide their interior into compartments, each with its own chemistry.',
  keywords: ['eukaryote', 'organelle', 'nucleus', 'endoplasmic reticulum', 'Golgi', 'lysosome', 'peroxisome', 'mitochondrion', 'chloroplast', 'vacuole', 'cell wall', 'plant cell', 'animal cell', 'compartmentalisation', 'prokaryote versus eukaryote'],
  prereq: ['cell-theory', 'prokaryotic-cells', 'microscopy'],
  related: ['nucleus-ribosomes', 'endomembrane', 'mitochondria-chloroplasts', 'cytoskeleton', 'membrane-structure', 'protists', 'fungi', 'plant-tissues', 'medicine:cell-structure'],
  body: `
Eukaryotic cells — those of animals, plants, fungi and protists — are typically ten times wider than a bacterium and a thousand times its volume. What sets them apart is **internal membranes**. The DNA is enclosed in a **nucleus** (Greek *eu karyon*, "true kernel"), and the cytoplasm is divided into membrane-bound **organelles**, each a compartment with its own chemistry. Explore them in the [cell explorer](#/tools/cell).

### The parts and what they do
| Organelle | Job | Size and number |
|---|---|---|
| Nucleus | holds the chromosomes; transcription; ribosome assembly in the nucleolus | 5–10 µm; one per cell (none in red blood cells, hundreds in a muscle fibre) |
| Ribosomes (80S) | make proteins | 25–30 nm; millions per cell |
| Rough ER | makes proteins for membranes and for export | a network of flat sacs studded with ribosomes |
| Smooth ER | makes lipids, detoxifies drugs, stores Ca²⁺ | a network of tubes |
| Golgi apparatus | modifies, sorts and ships proteins | stacks of 4–8 sacs about 1 µm across |
| Lysosomes | digest worn-out parts and ingested material at pH 4.5–5 | 0.2–0.5 µm; hundreds |
| Peroxisomes | break down fatty acids and hydrogen peroxide | 0.2–1 µm; hundreds |
| Mitochondria | aerobic respiration, making ATP | 0.5–1 µm wide, 1–10 µm long; hundreds to thousands |
| Chloroplasts (plants, algae) | photosynthesis | 5–10 µm; tens per leaf cell |
| Cytoskeleton | shape, movement, transport, division | filaments 7–25 nm wide |
| Plasma membrane | boundary, transport, signalling | 5 nm thick |

### Where the volume and the membrane are
In a liver cell about 54 % of the volume is cytosol, 22 % mitochondria (some 1700 of them), 15 % endoplasmic reticulum and Golgi, 6 % nucleus, and a few per cent lysosomes, peroxisomes and endosomes. The membranes are even more lopsided: the plasma membrane is only about 2 % of the cell's membrane, the ER about half and the folded inner membranes of the mitochondria about a third. A cell that secretes protein for a living — a pancreatic cell making digestive enzymes — devotes some 60 % of its membrane to rough ER.

Compartments let a cell run incompatible chemistry side by side: acid digestion in lysosomes, oxidation in peroxisomes, protein folding in the ER, energy conversion across the mitochondrial membranes. They also give it far more membrane — the surface on which much of its chemistry happens — than its outer boundary alone could provide ([[cell-theory]]).

### Plant, animal and fungal cells
| | Animal | Plant | Fungus |
|---|---|---|---|
| Cell wall | none | cellulose | chitin |
| Chloroplasts | no | in green parts | no |
| Large central vacuole | no (small vacuoles) | yes, up to 90 % of the volume | often |
| Centrioles | yes | no (except in some sperm) | not in most |
| Stored carbohydrate | glycogen | starch | glycogen |
| Channels between cells | gap junctions | plasmodesmata | pores in the cross-walls |

### Prokaryote and eukaryote compared
| | Prokaryote | Eukaryote |
|---|---|---|
| Size | 0.2–5 µm | 10–100 µm |
| DNA | one circular chromosome in a nucleoid, plus plasmids | several linear chromosomes wound on histones, in a nucleus |
| Ribosomes | 70S | 80S (70S-like in mitochondria and chloroplasts) |
| Membrane-bound organelles | none | nucleus, ER, Golgi, mitochondria and more |
| Cytoskeleton | simple relatives of actin and tubulin | actin filaments, microtubules, intermediate filaments, motor proteins |
| Division | binary fission | mitosis (and meiosis for sex) |
| Genes | mostly uninterrupted | mostly split by introns |

### Where eukaryotes came from
The oldest fossils that are clearly eukaryotic are about 1.6–1.8 billion years old, some two billion years after the first prokaryotes. The eukaryotic cell arose when an archaeal host took in a bacterium that became the mitochondrion ([[mitochondria-chloroplasts]]); Asgard archaea, discovered from their DNA in 2015, carry genes resembling our cytoskeleton and membrane-trafficking proteins. Every eukaryote alive — yeast, oak, human — descends from a last common ancestor that already had a nucleus, mitochondria, an endomembrane system and a cytoskeleton.
`,
  ideas: [
    'Eukaryotic cells have a nucleus and membrane-bound organelles; prokaryotes have neither.',
    'Compartments let incompatible reactions run side by side and multiply the membrane area available to the cell.',
    'Most of a cell\'s membrane is inside it: in a liver cell the plasma membrane is only about 2 % of the total.',
    'Plant cells add a cellulose wall, chloroplasts and a large vacuole; fungal walls are chitin; animal cells have no wall.'
  ],
  pitfalls: [
    'Every eukaryotic cell has exactly one nucleus — Mature red blood cells have none, skeletal muscle fibres have hundreds, and some fungi and slime moulds have many nuclei in one continuous cytoplasm.',
    'Plant cells have chloroplasts instead of mitochondria — Plant cells have both: chloroplasts make sugar in the light, mitochondria burn it for ATP day and night, and root cells have mitochondria but no chloroplasts.',
    'Organelles float in water — The cytoplasm is crowded: proteins make up some 20–30 % of its mass, and a cytoskeleton holds organelles in place and moves them along tracks.'
  ],
  formulas: [
    {
      name: 'How many times the volume',
      expr: 'k = (d1/d2)^3', tex: 'k = \\left(\\dfrac{d_1}{d_2}\\right)^3',
      vars: {
        k: { name: 'ratio of the volumes' },
        d1: { name: 'diameter of the larger cell', q: 'length', unit: 'µm', value: 20 },
        d2: { name: 'diameter of the smaller cell', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'For cells of the same shape: volumes scale as the cube of the size.',
      stories: { k: 'How many times the volume of a {d2} bacterium has a {d1} eukaryotic cell of the same shape?', d1: 'A eukaryotic cell has {k} times the volume of a bacterium {d2} across (same shape). How wide is it?' }
    },
    {
      name: 'Counting organelles from a volume fraction',
      expr: 'N = f*Vc/Vo', tex: 'N = \\dfrac{f\\,V_c}{V_o}',
      vars: {
        N: { name: 'number of organelles' },
        f: { name: 'fraction of the cell volume they fill', q: 'ratio', unit: '%', value: 22 },
        Vc: { name: 'volume of the cell', q: false, unit: 'µm³', value: 5000, tex: 'V_c' },
        Vo: { name: 'volume of one organelle', q: false, unit: 'µm³', value: 0.6, tex: 'V_o' }
      },
      note: 'Volume fractions come from measuring the areas of organelles on electron micrographs (stereology).',
      stories: { N: 'Mitochondria fill {f} of a liver cell of volume {Vc}, and each has a volume of about {Vo}. Roughly how many are there?', Vo: '{N} organelles fill {f} of a cell of {Vc}. What is the volume of each?' }
    }
  ],
  examples: [
    {
      title: 'How many bacteria would fit in a liver cell?',
      q: 'Treat a liver cell as a 20 µm sphere and a bacterium as a 1 µm sphere. How many bacterial volumes fit in the liver cell?',
      steps: ['$k = (20/1)^3 = 8000$.', 'Measured volumes (about 5000 µm³ against 1 µm³) give a similar answer: a few thousand.'],
      a: 'Several thousand — about 8000 for spheres of these sizes.'
    },
    {
      title: 'Counting mitochondria',
      q: 'Mitochondria fill 22 % of a 5000 µm³ liver cell, and each is roughly a cylinder 0.5 µm wide and 3 µm long. About how many are there?',
      steps: [
        'Volume of one: $\\pi (0.25)^2 \\times 3 = 0.59\\ \\mathrm{\\mu m^3}$.',
        '$N = 0.22 \\times 5000/0.59 \\approx 1900$ — close to the 1700 counted on electron micrographs.'
      ],
      a: 'About 1800–1900 mitochondria.'
    }
  ],
  quiz: [
    { q: 'Which feature do plant cells have that animal cells lack?', choices: ['mitochondria', 'a cellulose cell wall', 'ribosomes', 'a Golgi apparatus'], a: 1, why: 'Both have mitochondria, ribosomes and Golgi. Plants add a cellulose wall, chloroplasts and a large central vacuole.' },
    { q: 'In a liver cell, most of the membrane area belongs to…', choices: ['the plasma membrane', 'the endoplasmic reticulum and the inner mitochondrial membranes', 'the nuclear envelope', 'lysosomes'], a: 1, why: 'The ER is about half and the mitochondrial inner membranes about a third; the plasma membrane is only about 2 %.' },
    { q: 'All eukaryotic cells have exactly one nucleus.', a: false, why: 'Mature red cells lose theirs; muscle fibres form by the fusion of many cells and keep hundreds of nuclei.' },
    { q: 'A cell 10 µm across has how many times the volume of a 1 µm cell of the same shape?', answer: 1000, why: '(10/1)³ = 1000.' },
    { q: 'Why is it useful to digest material inside lysosomes rather than in the cytosol?', choices: ['the enzymes work only in the dark', 'the acid hydrolases work at pH 4.5–5 and are kept away from the cell\'s own molecules', 'lysosomes make ATP', 'the cytosol has no water'], a: 1, why: 'Compartments keep harmful chemistry contained; even if a lysosome leaks, its enzymes are nearly inactive at the cytosol\'s pH of 7.2.' }
  ],
  problems: [
    { q: 'Peroxisomes fill 1 % of a 5000 µm³ cell and each has a volume of 0.12 µm³. About how many are there?', answer: 417, tol: 0.03, steps: ['$N = 0.01 \\times 5000/0.12 \\approx 417$ — a few hundred, as counted.'] }
  ],
  applications: [
    'Click through the parts of an animal and a plant cell in [the cell explorer](#/tools/cell/explorer).',
    'Medicines that target organelles: many antibiotics work because bacteria lack the eukaryotic versions of ribosomes and walls.',
    'Diseases of single organelles — lysosomal storage diseases, peroxisomal disorders and mitochondrial diseases.',
    'Yeast as a model eukaryote: much of what we know about the cell cycle, secretion and ageing came from it.'
  ],
  history: 'Robert Brown named the nucleus in 1831, in orchid cells. Camillo Golgi saw the apparatus that bears his name in nerve cells in 1898 with a silver stain. The electron microscope, and cell fractionation in the centrifuge, revealed the ER, ribosomes, lysosomes and the inner structure of mitochondria in the 1940s–1950s — work for which Albert Claude, Christian de Duve and George Palade shared the 1974 Nobel Prize.'
},

{
  id: 'nucleus-ribosomes', parent: 'cell-structure', title: 'The nucleus and ribosomes', level: 2,
  short: 'The nucleus stores two metres of DNA behind a double membrane pierced by pores that control what goes in and out; ribosomes — machines of RNA and protein, 70S in bacteria and 80S in eukaryotes — read messenger RNA and build proteins.',
  keywords: ['nucleus', 'nuclear envelope', 'nuclear pore', 'nuclear localisation signal', 'importin', 'nucleolus', 'chromatin', 'nucleosome', 'lamina', 'ribosome', '80S', '70S', 'Svedberg', 'rRNA', 'ribozyme', 'polysome', 'free and bound ribosomes', 'signal sequence'],
  prereq: ['eukaryotic-cells', 'nucleic-acids', 'protein-structure'],
  related: ['transcription', 'translation', 'rna-processing', 'dna-structure', 'epigenetics', 'endomembrane', 'antibiotic-resistance', 'medicine:antibiotics'],
  body: `
The nucleus is the cell's library and the ribosome its factory floor. DNA stays in the nucleus; working copies of genes, as messenger RNA, travel out through pores to ribosomes in the cytoplasm, which read them and build proteins ([[transcription]], [[translation]]).

### The nucleus
A typical mammalian nucleus is about 6 µm across and holds a diploid genome of 6.4 billion base pairs — about **2 metres** of DNA — in 46 chromosomes. The DNA is wound around histone proteins in **nucleosomes** (147 base pairs on each, some 30 million in a nucleus) and folded further into **chromatin**: loosely packed, active euchromatin and dense, silent heterochromatin ([[epigenetics]]).

- The **nuclear envelope** is a double membrane whose outer layer is continuous with the endoplasmic reticulum. It is lined inside by the **lamina**, a mesh of lamin filaments that gives the nucleus its shape and anchors chromatin.
- **Nuclear pores** pierce the envelope — about 2000–4000 in a human cell. Each is a ring built from some 30 different proteins in many copies, about 110 million daltons in all, one of the largest structures in the cell. Small molecules and proteins below about 40 kDa diffuse through; larger ones need a passport — a **nuclear localisation signal** read by importin carriers, or an export signal read by exportins — and a gradient of the small protein Ran sets the direction. A single pore handles around a thousand crossings a second.
- The **nucleolus**, a dense region with no membrane, forms around the ribosomal RNA genes (several hundred copies, on five pairs of chromosomes). Here rRNA is made and packed with proteins into ribosomal subunits — thousands a minute in a growing cell — which leave through the pores.

### Ribosomes
A ribosome is a two-part machine of RNA and protein that reads mRNA three bases at a time and links amino acids into a chain.

| | Bacteria and archaea | Eukaryotic cytoplasm |
|---|---|---|
| Whole ribosome | 70S, 2.5 MDa, about 20 nm | 80S, 4.3 MDa, 25–30 nm |
| Small subunit | 30S: 16S rRNA + 21 proteins | 40S: 18S rRNA + 33 proteins |
| Large subunit | 50S: 23S and 5S rRNA + 33 proteins | 60S: 28S, 5.8S and 5S rRNA + 47 proteins |
| Speed | 15–20 amino acids a second | 5–6 amino acids a second |
| Number per cell | 10 000–70 000 | millions (up to about 10 million) |

The S numbers are **Svedberg units**, which measure how fast a particle sinks in an ultracentrifuge. They depend on shape as well as mass, which is why 50S + 30S makes 70S, not 80S.

The heart of the ribosome is RNA: the site that joins amino acids is built entirely of rRNA, so the ribosome is a **ribozyme** — a strong hint that in early life RNA both stored information and did the catalysis. Several ribosomes read one mRNA at once, one every hundred or so bases, forming a **polysome**.

### Free and bound ribosomes
Ribosomes in the cytosol make proteins that stay there or go to the nucleus, mitochondria or peroxisomes. When the first amino acids of a new chain form a **signal sequence**, the ribosome is steered to the rough ER and the protein is threaded into it as it is made — the start of the route to membranes, lysosomes and secretion ([[endomembrane]]). Free and bound ribosomes are identical: the protein being made decides where the ribosome goes.

> [!fact] Streptomycin, tetracycline, erythromycin and chloramphenicol block 70S ribosomes much more than 80S ones — that is why they are antibiotics. Mitochondria, descended from bacteria, have bacterial-like ribosomes too, which accounts for some of the side effects of these drugs ([[mitochondria-chloroplasts]]).
`,
  ideas: [
    'The nucleus holds about 2 m of DNA packed on histones, behind a double envelope continuous with the ER.',
    'Nuclear pores let small molecules through freely and move large ones selectively, by signals read by importins and exportins.',
    'The nucleolus makes rRNA and assembles ribosomal subunits.',
    'Ribosomes are ribozymes of rRNA and protein: 70S in prokaryotes, 80S in the eukaryotic cytoplasm, with the peptide-joining site made of RNA.',
    'Free and bound ribosomes are the same; a signal sequence on the new protein sends the ribosome to the ER.'
  ],
  pitfalls: [
    'A 50S and a 30S subunit add up to an 80S ribosome — Svedberg units measure sedimentation rate, which is not additive; 50S + 30S = 70S, and 60S + 40S = 80S.',
    'Ribosomes are made of protein, so proteins do the catalysis — The peptidyl transferase centre is pure rRNA; the ribosomal proteins mainly hold the RNA in shape.',
    'Nuclear pores are open holes — They are selective gates: anything above about 40 kDa needs a signal and a carrier, and mRNA leaves only once it has been processed.'
  ],
  formulas: [
    {
      name: 'Time to make one protein',
      expr: 't = n/r', tex: 't = \\dfrac{n}{r}',
      vars: {
        t: { name: 'time to translate the protein', q: 'time', unit: 's' },
        n: { name: 'number of amino acids', value: 500 },
        r: { name: 'elongation rate (amino acids per second)', q: 'rate', unit: '1/s', value: 6 }
      },
      note: 'Eukaryotic ribosomes add 5–6 amino acids a second, bacterial ones 15–20. Initiation adds a little more.',
      stories: {
        t: 'A human ribosome adding {r} amino acids per second makes a protein of {n} amino acids. How long does it take?',
        n: 'A ribosome working at {r} amino acids per second finishes a protein in {t}. How many amino acids long is it?'
      }
    },
    {
      name: 'How tightly the nucleus packs DNA',
      expr: 'k = N*b/d', tex: 'k = \\dfrac{N\\,b}{d}',
      vars: {
        k: { name: 'length of DNA per width of the nucleus' },
        N: { name: 'base pairs in the nucleus', value: 6.4e9 },
        b: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true },
        d: { name: 'diameter of the nucleus', q: 'length', unit: 'µm', value: 6 }
      },
      note: 'A diploid human cell has 6.4 × 10⁹ base pairs; the nucleus is typically 5–10 µm across.',
      stories: { k: 'A nucleus {d} across holds {N} base pairs of DNA. How many times its own width is the DNA, laid end to end?' }
    }
  ],
  examples: [
    {
      title: 'The longest and a short protein',
      q: 'How long does a human ribosome (6 amino acids per second) take to make a 146-amino-acid haemoglobin chain, and titin, the giant muscle protein of about 34 000 amino acids?',
      steps: ['Haemoglobin β chain: $146/6 \\approx 24$ s.', 'Titin: $34\\,000/6 \\approx 5700$ s, about an hour and a half — with dozens of ribosomes on each mRNA, a muscle cell still turns out titin steadily.'],
      a: 'About 24 seconds and about 95 minutes.'
    },
    {
      title: 'Two metres in six micrometres',
      q: 'A diploid human nucleus, 6 µm across, holds 6.4 × 10⁹ base pairs. How long is the DNA, and how many times the width of the nucleus?',
      steps: ['$L = 6.4\\times10^9 \\times 0.34\\ \\mathrm{nm} = 2.2$ m.', '$k = 2.2\\ \\mathrm{m}/6\\ \\mathrm{\\mu m} \\approx 360\\,000$ — like packing 24 km of fine thread into a tennis ball, and still being able to find and read any page.'],
      a: '2.2 m, about 360 000 times the width of the nucleus.'
    },
    {
      title: 'Why a growing cell needs millions of ribosomes',
      q: 'A human cell holds about 2 × 10⁹ protein molecules averaging 400 amino acids, and divides once a day. At 5 amino acids per second, how many ribosomes must be working all the time to double its protein?',
      steps: [
        'Amino acids to add in a day: $2\\times10^9 \\times 400 = 8\\times10^{11}$.',
        'Per second: $8\\times10^{11}/86\\,400 \\approx 9.3\\times10^6$.',
        'Ribosomes: $9.3\\times10^6/5 \\approx 1.9\\times10^6$ working flat out — so a few million ribosomes, as observed.'
      ],
      a: 'About 2 million busy ribosomes.'
    }
  ],
  quiz: [
    { q: 'What happens in the nucleolus?', choices: ['DNA is replicated', 'ribosomal RNA is made and assembled into ribosomal subunits', 'proteins are glycosylated', 'mRNA is translated'], a: 1, why: 'The nucleolus forms around the rRNA genes; subunits assembled there are exported. Translation happens on ribosomes in the cytoplasm.' },
    { q: 'A 60 kDa protein made in the cytoplasm must enter the nucleus. What does it need?', choices: ['nothing — pores are open holes', 'a nuclear localisation signal recognised by importins', 'to be made on the rough ER', 'to be packed in a vesicle'], a: 1, why: 'Proteins above about 40 kDa cross only with a signal and a carrier. The nuclear envelope has no vesicle traffic for import.' },
    { q: 'A 50S and a 30S subunit together form an 80S ribosome.', a: false, why: 'They form a 70S ribosome: Svedberg values reflect sedimentation, which depends on shape, and do not add up.' },
    { q: 'At 5 amino acids per second, how many seconds does a ribosome take to make a 400-amino-acid protein?', answer: 80, unit: 's', why: '400/5 = 80 s.' },
    { q: 'Which part of the ribosome forms the peptide bonds?', choices: ['a protein enzyme in the small subunit', 'the rRNA of the large subunit', 'the mRNA', 'the tRNA'], a: 1, why: 'The peptidyl transferase site is rRNA in the large subunit — the ribosome is a ribozyme.' }
  ],
  problems: [
    { q: 'How long, in metres, is the DNA of a diploid human cell (6.4 × 10⁹ base pairs)?', answer: 2.18, unit: 'm', tol: 0.02, steps: ['$6.4\\times10^9 \\times 0.34\\times10^{-9}\\ \\mathrm{m} = 2.18$ m.'] },
    { q: 'A bacterial ribosome adds 18 amino acids per second. How long does it take to make a 300-amino-acid protein?', answer: 16.7, unit: 's', tol: 0.02, steps: ['$t = 300/18 = 16.7$ s — about three times faster than a human ribosome.'] }
  ],
  applications: [
    'Antibiotics that target bacterial ribosomes (aminoglycosides, tetracyclines, macrolides) and the rising problem of resistance to them.',
    'Ribosomal RNA sequences, used to classify microbes and build the tree of life.',
    'Nuclear transport signals, used to deliver engineered proteins into the nucleus.',
    'Diseases of the nuclear lamina (laminopathies) such as progeria, which show how the envelope supports the nucleus.'
  ],
  history: 'Robert Brown described the nucleus in 1831. Theodor Svedberg built the ultracentrifuge in the 1920s (Nobel Prize 1926). George Palade saw ribosomes with the electron microscope in 1955. Günter Blobel\'s signal hypothesis (1970s) won the 1999 Nobel Prize, and the atomic structures of the ribosome, solved around 2000, earned Venki Ramakrishnan, Thomas Steitz and Ada Yonath the 2009 Nobel Prize in Chemistry — confirming that its catalytic heart is RNA.'
},

{
  id: 'endomembrane', parent: 'cell-structure', title: 'The endomembrane system', level: 2,
  short: 'The connected membranes of a eukaryotic cell — nuclear envelope, endoplasmic reticulum, Golgi apparatus, lysosomes, endosomes, vesicles and the plasma membrane — along which proteins and lipids are made, modified, sorted and shipped.',
  keywords: ['endomembrane system', 'endoplasmic reticulum', 'rough ER', 'smooth ER', 'signal sequence', 'signal recognition particle', 'glycosylation', 'Golgi apparatus', 'cis', 'trans', 'vesicle', 'COPII', 'clathrin', 'SNARE', 'secretion', 'pulse-chase', 'lysosome', 'mannose-6-phosphate', 'autophagy', 'lysosomal storage disease'],
  prereq: ['eukaryotic-cells', 'nucleus-ribosomes', 'membrane-structure'],
  related: ['endocytosis', 'translation', 'protein-structure', 'carbohydrates', 'lipids', 'human-genetics', 'medicine:cell-structure'],
  body: `
Proteins that will end up in a membrane, in a lysosome or outside the cell all travel one route, through a connected set of membranes — the **endomembrane system**: nuclear envelope, endoplasmic reticulum, Golgi apparatus, lysosomes, endosomes, vesicles and the plasma membrane (and, in plants, the vacuole). Its parts are either continuous or linked by small **vesicles** that bud from one compartment and fuse with the next. Mitochondria, chloroplasts and peroxisomes are not part of it: they import their proteins directly from the cytosol.

### The endoplasmic reticulum
The ER is a network of flattened sacs and tubes enclosing one continuous space, the **lumen**; it is often more than half of all the membrane in a cell.

- **Rough ER** is studded with ribosomes. A protein bound for the secretory route begins with a **signal sequence** of 15–30 mostly hydrophobic amino acids. As it emerges from the ribosome, a signal-recognition particle pauses translation and docks the ribosome on a channel in the ER membrane, and the growing chain is threaded through. In the lumen, chaperones help it fold, disulfide bonds form, and a ready-made block of 14 sugars is attached to chosen asparagines (**N-glycosylation**). Proteins that fail to fold are sent back out and destroyed; if too many pile up, the cell slows protein synthesis — the **unfolded protein response**.
- **Smooth ER** has no ribosomes. It makes phospholipids and steroid hormones, detoxifies drugs and alcohol in liver cells (the cytochrome P450 enzymes), and in muscle stores the Ca²⁺ whose release triggers contraction.

### The Golgi apparatus
A stack of 4–8 flattened sacs (cisternae), each about 1 µm across, with a receiving **cis** face towards the ER and a shipping **trans** face. As proteins pass through, their sugar chains are trimmed and rebuilt, and they are sorted by tags: enzymes bound for lysosomes get a **mannose-6-phosphate** label, secretory proteins are packed into secretory vesicles, membrane proteins are sent to the plasma membrane. Cells that secrete a lot — goblet cells making mucus, plasma cells making antibodies — have large Golgi stacks.

### Vesicles: the parcels
Vesicles 50–100 nm across carry cargo between compartments. Coat proteins bend the membrane into a bud and gather the right cargo (COPII from ER to Golgi, COPI back again, clathrin from the trans-Golgi and the plasma membrane). Rab proteins act as address labels, and **SNARE** proteins on vesicle and target zip together to fuse the two membranes. Vesicles are carried along microtubules by motor proteins ([[cytoskeleton]]).

### The route of a secreted protein
**Rough ER → vesicle → cis-Golgi → trans-Golgi → secretory vesicle → plasma membrane → outside**, and the vesicle membrane becomes part of the plasma membrane. George Palade traced this route in the 1960s by giving pancreatic tissue a short pulse of a radioactive amino acid, then following the label by electron microscopy: within minutes it was in the rough ER, after 10–20 minutes in the Golgi, and after an hour or two in the secretory granules at the cell surface. The simulation below repeats the experiment.

### Lysosomes: the digestive system
Lysosomes are membrane sacs of about 50 hydrolytic enzymes — proteases, nucleases, lipases, glycosidases — that work best at pH 4.5–5, kept acidic by a proton pump in the lysosome membrane. They digest material brought in by endocytosis ([[endocytosis]]) and worn-out organelles wrapped up by **autophagy**. When one enzyme is missing, its substrate builds up: in Tay–Sachs disease a ganglioside accumulates in nerve cells; in I-cell disease the enzymes lack their mannose-6-phosphate tag and are secreted instead of delivered. About 50 such **lysosomal storage diseases** are known, and some are now treated by supplying the missing enzyme.

> [!key] Membrane flows outward — made in the ER, carried through the Golgi to lysosomes and the cell surface — while endocytosis brings membrane back in. The system is a conveyor, not a set of separate boxes.
`,
  ideas: [
    'The endomembrane system is the nuclear envelope, ER, Golgi, lysosomes, endosomes, vesicles and plasma membrane, linked by continuity or by vesicles.',
    'A signal sequence sends a new protein into the rough ER, where it folds and is glycosylated.',
    'The Golgi modifies proteins and sorts them by tags: mannose-6-phosphate to lysosomes, others to secretion or the plasma membrane.',
    'Secretion runs ER → Golgi → secretory vesicle → plasma membrane, as Palade\'s pulse-chase experiment showed.',
    'Lysosomes digest at pH 4.5–5; a missing enzyme causes a lysosomal storage disease.'
  ],
  pitfalls: [
    'Mitochondria and chloroplasts belong to the endomembrane system — They do not exchange vesicles with it; they import proteins made on free ribosomes, a legacy of their bacterial origin.',
    'The Golgi makes proteins — Proteins are made on ribosomes; the Golgi modifies, sorts and packages what the ER sends it.',
    'Secreted proteins cross the plasma membrane on their way out — They never cross a membrane after entering the ER: they stay in the lumen of the ER, Golgi and vesicles, which is topologically the outside of the cell, and are released when a vesicle fuses.'
  ],
  formulas: [
    {
      name: 'Vesicles needed to deliver a membrane area',
      expr: 'N = A/(pi*d^2)', tex: 'N = \\dfrac{A}{\\pi d^2}',
      vars: {
        N: { name: 'number of vesicles' },
        A: { name: 'membrane area to deliver', q: 'area', unit: 'µm²', value: 1000 },
        d: { name: 'vesicle diameter', q: 'length', unit: 'nm', value: 80 }
      },
      note: 'Each spherical vesicle carries its surface, πd², of membrane.',
      stories: { N: 'A cell doubles its plasma membrane of {A} before dividing, using vesicles {d} across. How many vesicles fuse?', d: '{N} vesicles deliver {A} of membrane. How wide is each?' }
    },
    {
      name: 'Vesicle traffic needed to grow the plasma membrane',
      expr: 'n = A/(pi*d^2*t)', tex: 'n = \\dfrac{A}{\\pi d^2\\,t}',
      vars: {
        n: { name: 'vesicles fusing per second', q: 'rate', unit: '1/s' },
        A: { name: 'membrane area to add', q: 'area', unit: 'µm²', value: 1000 },
        d: { name: 'vesicle diameter', q: 'length', unit: 'nm', value: 80 },
        t: { name: 'time available', q: 'time', unit: 'h', value: 24 }
      },
      note: 'Real traffic is far greater, because membrane is also taken back by endocytosis and recycled.',
      stories: { n: 'A cell adds {A} of plasma membrane in {t} with vesicles {d} across. How many vesicles must fuse each second?' }
    }
  ],
  examples: [
    {
      title: 'Membrane for a dividing cell',
      q: 'Before dividing, a cell doubles its plasma membrane of 1000 µm² in a day using 80 nm vesicles. How many vesicles, and how many per second?',
      steps: ['Area of one vesicle: $\\pi d^2 = \\pi \\times (0.08\\ \\mathrm{\\mu m})^2 = 0.020\\ \\mathrm{\\mu m^2}$.', '$N = 1000/0.020 \\approx 50\\,000$ vesicles.', 'Per second: $50\\,000/86\\,400 \\approx 0.6$ — a trickle compared with the hundreds of vesicles a second that endocytosis and recycling move.'],
      a: 'About 50 000 vesicles — roughly one every two seconds.'
    },
    {
      title: 'Following a lysosomal enzyme',
      q: 'Trace a lysosomal protease from its gene to the lysosome, naming each compartment and the signal that directs it.',
      steps: [
        'Its mRNA is translated on a ribosome that the signal sequence steers to the rough ER; the chain enters the lumen and is glycosylated.',
        'A COPII vesicle carries it to the cis-Golgi; there an enzyme recognises the protein and adds phosphate to a mannose — the mannose-6-phosphate tag.',
        'In the trans-Golgi network, mannose-6-phosphate receptors gather it into clathrin-coated vesicles bound for endosomes; the acid there releases it, and the endosome matures into a lysosome.'
      ],
      a: 'Rough ER (signal sequence) → Golgi (mannose-6-phosphate) → endosome → lysosome.'
    }
  ],
  quiz: [
    { q: 'Which route does a protein secreted by a pancreatic cell take?', choices: ['Golgi → rough ER → vesicle → plasma membrane', 'rough ER → Golgi → secretory vesicle → plasma membrane', 'nucleus → rough ER → lysosome → outside', 'free ribosome → mitochondrion → plasma membrane'], a: 1, why: 'This is the order Palade saw the radioactive label move in his pulse-chase experiment.' },
    { q: 'A secretory protein whose gene has lost the part coding for its signal sequence ends up…', choices: ['secreted as normal', 'in the cytosol', 'in a lysosome', 'in the nuclear envelope'], a: 1, why: 'Without a signal sequence the ribosome is never sent to the ER, so the protein is made and stays in the cytosol.' },
    { q: 'Mitochondria are part of the endomembrane system.', a: false, why: 'They exchange no vesicles with the ER or Golgi and import their proteins from the cytosol.' },
    { q: 'In I-cell disease, lysosomal enzymes lack their mannose-6-phosphate tag. Where do they end up?', choices: ['in the nucleus', 'secreted out of the cell', 'in mitochondria', 'still in lysosomes'], a: 1, why: 'Without the tag they are not sorted at the trans-Golgi and follow the default route out of the cell, while undigested material piles up in the lysosomes.' },
    { q: 'How many 100 nm vesicles carry 500 µm² of membrane?', answer: 15900, why: 'Each carries π × (0.1 µm)² = 0.0314 µm²; 500/0.0314 ≈ 15 900.' }
  ],
  problems: [
    { q: 'A plasma cell adds 2000 µm² of membrane with 60 nm secretory vesicles. How many vesicles is that?', answer: 176800, tol: 0.03, steps: ['Area per vesicle: $\\pi (0.06)^2 = 0.01131\\ \\mathrm{\\mu m^2}$.', '$N = 2000/0.01131 \\approx 1.77\\times10^5$.'] }
  ],
  applications: [
    'Biotechnology: therapeutic antibodies and other glycoproteins are made in mammalian cells because only they add human-like sugar chains in the ER and Golgi.',
    'Enzyme replacement therapy for lysosomal storage diseases, which relies on the cell taking up enzymes carrying a mannose-6-phosphate or mannose tag.',
    'Liver smooth ER and its cytochrome P450 enzymes, which break down most medicines and explain many drug interactions.',
    'Brefeldin A and similar drugs that block ER-to-Golgi traffic, used as research tools.'
  ],
  history: 'Camillo Golgi saw the apparatus in 1898, but many doubted it was real until the electron microscope showed it in the 1950s. Keith Porter and colleagues named the endoplasmic reticulum in 1945, Christian de Duve discovered lysosomes in 1955, and George Palade\'s pulse-chase experiments of the 1960s mapped the secretory pathway. Randy Schekman (yeast secretion genes), James Rothman (the vesicle fusion machinery) and Thomas Südhof (its control at synapses) shared the 2013 Nobel Prize.',
  sim: 'cell-endomembrane'
},

{
  id: 'mitochondria-chloroplasts', parent: 'cell-structure', title: 'Mitochondria and chloroplasts', level: 2,
  short: 'The energy converters of eukaryotic cells: mitochondria make ATP by respiration and chloroplasts capture light in photosynthesis. Both have two membranes, their own DNA and bacterial-type ribosomes — because both descend from bacteria taken in by an ancestral cell.',
  keywords: ['mitochondrion', 'mitochondria', 'cristae', 'matrix', 'mitochondrial DNA', 'maternal inheritance', 'chloroplast', 'thylakoid', 'grana', 'stroma', 'plastid', 'endosymbiosis', 'endosymbiotic theory', 'Lynn Margulis', 'alpha-proteobacteria', 'cyanobacteria', 'secondary endosymbiosis'],
  prereq: ['eukaryotic-cells', 'prokaryotic-cells', 'atp-energy'],
  related: ['oxidative-phosphorylation', 'krebs-cycle', 'photosynthesis', 'light-reactions', 'calvin-cycle', 'three-domains', 'evidence-evolution', 'life-history-earth', 'nucleus-ribosomes'],
  body: `
Mitochondria and chloroplasts are the cell's power stations — and they are former bacteria. Both convert energy with the same trick: pumping protons across a membrane and letting them flow back through the turbine-like enzyme ATP synthase ([[oxidative-phosphorylation]], [[light-reactions]]).

### Mitochondria
- **Size and shape**: 0.5–1 µm wide and 1–10 µm long, often joined into branching networks that constantly fuse and divide.
- **Two membranes**: a smooth, porous outer membrane and a deeply folded **inner membrane**, whose folds (**cristae**) carry the electron-transport chain and ATP synthase. The inner membrane is about 75 % protein by mass and contains cardiolipin, a lipid otherwise typical of bacteria.
- The **matrix** holds the enzymes of the citric acid cycle and of fatty-acid breakdown ([[krebs-cycle]]), with ribosomes and several copies of the mitochondrion's own DNA.
- **Numbers** follow demand: none in mature red blood cells, 50–75 in the midpiece of a sperm, about 1700 in a liver cell, and about a third of the volume of a heart muscle cell. An egg carries hundreds of thousands of copies of mitochondrial DNA.

The human mitochondrial genome is a circle of 16 569 base pairs with 37 genes: 13 proteins of the respiratory chain, 22 transfer RNAs and 2 ribosomal RNAs. The other thousand or more mitochondrial proteins are encoded in the nucleus, made in the cytosol and imported. Mitochondria are inherited almost entirely from the mother, and they read a slightly different genetic code (UGA means tryptophan instead of stop).

### Chloroplasts
- **Size**: lens-shaped, 5–10 µm long; a leaf mesophyll cell holds roughly 20–100.
- **Three membrane systems**: an outer and an inner envelope membrane, and inside them the **thylakoids** — flattened sacs stacked into **grana** — which carry chlorophyll, the light-harvesting complexes and ATP synthase.
- The **stroma** around the thylakoids contains the enzymes of the Calvin cycle, including Rubisco, the most abundant protein on Earth ([[calvin-cycle]]), with starch grains, ribosomes and DNA.
- Chloroplast DNA is a circle of 120–160 thousand base pairs with about 100–130 genes.

Chloroplasts are one kind of **plastid**; the family also includes starch-storing amyloplasts (in potato tubers) and coloured chromoplasts (in tomatoes and petals).

### They were once bacteria: endosymbiosis
The **endosymbiotic theory**, championed by Lynn Margulis from 1967, holds that mitochondria descend from an aerobic bacterium taken in by an ancestral host cell some 1.5–2 billion years ago, and chloroplasts from a photosynthetic cyanobacterium engulfed later by a cell that already had mitochondria. The evidence is broad:

| Evidence | What it shows |
|---|---|
| Two membranes around each | the inner is the bacterium's own membrane; the outer carries β-barrel porins like the outer membrane of a Gram-negative bacterium |
| Their own circular DNA, without histones | like a bacterial chromosome |
| Ribosomes of the bacterial type, blocked by antibiotics such as chloramphenicol | bacterial, not eukaryotic, protein synthesis |
| Protein synthesis starting with formyl-methionine | as in bacteria |
| Division by fission; never made from scratch | a cell that loses them cannot rebuild them |
| Gene and rRNA sequences | mitochondria fall with the α-proteobacteria, chloroplasts with the cyanobacteria |

Since the merger most of the endosymbionts' genes have moved to the nucleus, tying them to their host for good. The process can still be seen: the amoeba *Paulinella* acquired a new cyanobacterial partner only about 100 million years ago, and many algae carry plastids taken from a second, eukaryotic alga (**secondary endosymbiosis**), wrapped in three or four membranes.

> [!key] Mitochondria and chloroplasts both make ATP by chemiosmosis, carry their own DNA and ribosomes, and divide like bacteria — because they were bacteria.
`,
  ideas: [
    'Mitochondria (respiration) and chloroplasts (photosynthesis) both make ATP by letting protons flow back through ATP synthase across an inner membrane.',
    'Mitochondria: outer membrane, folded inner membrane with cristae, matrix. Chloroplasts: two envelope membranes, thylakoids stacked in grana, stroma.',
    'Both carry circular DNA and bacterial-type ribosomes; most of their proteins are now encoded in the nucleus.',
    'The endosymbiotic theory: mitochondria came from α-proteobacteria and chloroplasts from cyanobacteria, taken in by ancestral cells.'
  ],
  pitfalls: [
    'Plant cells have chloroplasts instead of mitochondria — They have both. Chloroplasts make sugar in the light; mitochondria turn it into ATP day and night, and roots have no chloroplasts at all.',
    'Mitochondria make energy — Energy is not made; mitochondria convert the chemical energy of food into ATP, capturing about half of it and releasing the rest as heat.',
    'The mitochondrial genome encodes all mitochondrial proteins — Only 13 in humans; the other thousand or more are encoded in the nucleus and imported.'
  ],
  formulas: [
    {
      name: 'How much ATP you recycle in a day',
      expr: 'm = f*E*M/G', tex: 'm = \\dfrac{f\\,E\\,M}{\\Delta G_{\\mathrm{ATP}}}',
      vars: {
        m: { name: 'mass of ATP made (and used) per day', q: 'mass', unit: 'kg' },
        f: { name: 'fraction of food energy captured as ATP', q: 'ratio', unit: '%', value: 50 },
        E: { name: 'food energy used in a day', q: 'energy', unit: 'kJ', value: 8400 },
        M: { name: 'molar mass of ATP', q: 'molarmass', unit: 'g/mol', value: 507, fixed: true },
        G: { name: 'free energy of ATP hydrolysis in the cell', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: '\\Delta G_{\\mathrm{ATP}}' }
      },
      note: 'The body holds only about 100 g of ATP at any moment, so each molecule is recycled several hundred times a day. In cells ATP hydrolysis releases 50–60 kJ/mol (30.5 kJ/mol under standard conditions).',
      stories: { m: 'A person uses {E} of food energy in a day, and {f} of it is captured as ATP at {G} per mole. How much ATP is made and broken down?', E: 'A body turns over {m} of ATP a day, capturing {f} of its food energy at {G} per mole. How much food energy does it use?' }
    },
    {
      name: 'Efficiency of aerobic respiration',
      expr: 'eta = n*G/Q', tex: '\\eta = \\dfrac{n\\,\\Delta G_{\\mathrm{ATP}}}{\\Delta G_{\\mathrm{glc}}}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        n: { name: 'ATP made per glucose', value: 32 },
        G: { name: 'free energy stored per ATP', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: '\\Delta G_{\\mathrm{ATP}}' },
        Q: { name: 'free energy released by oxidising glucose', q: 'molarenergy', unit: 'kJ/mol', value: 2870, tex: '\\Delta G_{\\mathrm{glc}}' }
      },
      note: 'About 30–32 ATP per glucose in human cells; the rest of the energy is released as heat, which keeps us warm.',
      stories: { eta: 'A cell makes {n} ATP per glucose, each storing {G}; glucose oxidation releases {Q}. What fraction is captured?', n: 'To capture {eta} of the {Q} in glucose as ATP storing {G} each, how many ATP must be made?' }
    }
  ],
  examples: [
    {
      title: 'Your body weight in ATP',
      q: 'A person uses 8400 kJ of food energy a day, half of it captured as ATP at 50 kJ/mol. How much ATP (507 g/mol) is made and used each day?',
      steps: ['Energy into ATP: $0.5 \\times 8400 = 4200$ kJ.', 'Moles: $4200/50 = 84$ mol.', 'Mass: $84 \\times 507\\ \\mathrm{g} \\approx 43$ kg.', 'With only about 100 g of ATP in the body at any time, each molecule is used and remade some 400 times a day.'],
      a: 'About 40 kg — close to one\'s own body mass, recycled from about 100 g.'
    },
    {
      title: 'How efficient is respiration?',
      q: 'Oxidising glucose releases 2870 kJ/mol; the cell makes about 32 ATP, each storing about 50 kJ/mol under cell conditions. What is the efficiency? Compare a car engine (about 25–30 %).',
      steps: ['$\\eta = 32 \\times 50/2870 = 0.56$.', 'About 56 %, roughly twice a petrol engine; the rest becomes body heat.'],
      a: 'About 55 %.'
    }
  ],
  quiz: [
    { q: 'Which of these is NOT evidence that mitochondria descend from bacteria?', choices: ['they have two membranes', 'they have their own circular DNA', 'their ribosomes are blocked by antibiotics that block bacterial ribosomes', 'they are most numerous in cells that use a lot of energy'], a: 3, why: 'Their numbers reflect their job, not their ancestry. The other three are shared with bacteria.' },
    { q: 'Where is the ATP synthase of a chloroplast?', choices: ['in the outer envelope', 'in the thylakoid membranes', 'free in the stroma', 'in the cell wall'], a: 1, why: 'Light drives protons into the thylakoid space; they flow back out through ATP synthase in the thylakoid membrane, making ATP in the stroma.' },
    { q: 'Leaf cells have chloroplasts, so they have no mitochondria.', a: false, why: 'Photosynthetic cells need mitochondria too: to make ATP at night, and to supply the energy and building blocks that photosynthesis alone does not.' },
    { q: 'A cell makes 30 ATP per glucose, storing 50 kJ/mol each; glucose releases 2870 kJ/mol. What percentage is captured?', answer: 52.3, unit: '%', why: '30 × 50/2870 = 0.523.' },
    { q: 'Why is mitochondrial DNA inherited from the mother?', choices: ['sperm have no mitochondria', 'the egg provides nearly all the cytoplasm, and sperm mitochondria are destroyed after fertilisation', 'mitochondrial genes lie on the X chromosome', 'fathers\' mitochondria have no DNA'], a: 1, why: 'Sperm do have mitochondria (to power swimming), but the few that enter the egg are tagged and destroyed.' }
  ],
  problems: [
    { q: 'An athlete uses 14 000 kJ in a day and captures 50 % as ATP at 50 kJ/mol. How many kilograms of ATP (507 g/mol) are recycled?', answer: 71, unit: 'kg', tol: 0.02, steps: ['$0.5 \\times 14\\,000/50 = 140$ mol.', '$140 \\times 0.507 = 71$ kg.'] }
  ],
  applications: [
    'Mitochondrial diseases, which affect energy-hungry organs such as brain, muscle, heart and eyes, and mitochondrial replacement techniques that let a mother avoid passing them on (licensed in the UK since 2015).',
    'Tracing maternal ancestry and identifying remains from mitochondrial DNA, which is abundant and inherited through the female line.',
    'Herbicides that block electron flow in chloroplasts (photosystem II inhibitors).',
    'Some side effects of antibiotics that also slow mitochondrial ribosomes.'
  ],
  history: 'Richard Altmann saw mitochondria in 1890 and Carl Benda named them in 1898. Konstantin Mereschkowski proposed in 1905 that chloroplasts were once free-living cyanobacteria, and Ivan Wallin argued the same for mitochondria in the 1920s; both were ignored until Lynn Margulis revived the idea in 1967. Mitochondrial DNA was found in 1963, and the human mitochondrial genome was sequenced in Cambridge in 1981. Peter Mitchell\'s chemiosmotic theory of 1961 explained how both organelles make ATP (Nobel Prize 1978).'
},

{
  id: 'cytoskeleton', parent: 'cell-structure', title: 'The cytoskeleton', level: 2,
  short: 'A network of protein filaments — actin filaments, intermediate filaments and microtubules — that gives a cell its shape, moves it, carries cargo on motor proteins and pulls chromosomes apart. It is constantly built and taken down.',
  keywords: ['cytoskeleton', 'actin', 'microfilament', 'intermediate filament', 'keratin', 'microtubule', 'tubulin', 'dynamic instability', 'centrosome', 'motor protein', 'kinesin', 'dynein', 'myosin', 'axonal transport', 'cilia', 'flagella', '9 + 2 axoneme'],
  prereq: ['eukaryotic-cells', 'protein-structure', 'atp-energy'],
  related: ['mitosis', 'cell-cycle', 'muscles-movement', 'endomembrane', 'endocytosis', 'prokaryotic-cells', 'medicine:nerve-cells'],
  body: `
A cell is not a bag of soup. A network of protein filaments — the **cytoskeleton** — gives it shape, holds organelles in place, carries cargo along tracks, pulls chromosomes apart at division and, in many cells, makes them crawl or swim. Unlike a skeleton of bone it is rebuilt all the time: most of its filaments grow and shrink within seconds to minutes.

### Three kinds of filament
| | Actin filaments | Intermediate filaments | Microtubules |
|---|---|---|---|
| Diameter | 7 nm | 10 nm | 25 nm, hollow, 13 protofilaments |
| Built from | actin (42 kDa), in a two-stranded helix | a family: keratins, vimentin, neurofilament proteins, nuclear lamins | α/β-tubulin dimers, 8 nm long |
| Polarity and motors | polar; myosins | not polar; no motors | polar; kinesins and dyneins |
| Behaviour | treadmilling: added at the + end, lost at the − end | stable, rope-like | dynamic instability: grow, then collapse |
| Jobs | cell cortex, microvilli, crawling, muscle contraction, the ring that pinches a dividing animal cell | tensile strength, above all in skin and nerve; the nuclear lamina | tracks for transport, the mitotic spindle, cilia and flagella |

- **Actin** is among the most abundant proteins of most cells, often 5–10 % of their protein. At the front of a crawling cell, actin polymerisation pushes the membrane forward in a thin sheet, the lamellipodium, while myosin contracts the network behind. A microvillus is a finger of membrane held up by a bundle of 20–30 parallel actin filaments.
- **Intermediate filaments** are the cell's steel cables: they stretch without breaking and spread strain across a tissue through cell junctions. People with epidermolysis bullosa simplex, caused by faulty skin keratins, have skin that blisters at the slightest rub.
- **Microtubules** grow from a **centrosome** near the nucleus, their minus ends anchored there and their plus ends exploring the cell. A growing end carries a cap of tubulin bound to GTP; if the cap is lost the microtubule peels apart and shrinks several times faster than it grew — **dynamic instability**, discovered in 1984 — until it is rescued or disappears. This search-and-capture lets microtubules find the chromosomes at mitosis ([[mitosis]]).

### Motor proteins
Motors turn the energy of ATP into steps along a filament.

| Motor | Track and direction | Step | Jobs |
|---|---|---|---|
| Kinesin-1 | microtubule, towards the + end (outwards) | 8 nm per ATP, about 100 steps a second | carries vesicles and organelles down axons |
| Cytoplasmic dynein | microtubule, towards the − end (inwards) | 8–32 nm | brings cargo back to the cell body; positions the spindle |
| Myosin II | actin, towards the + end | 5–10 nm power stroke | muscle contraction, the dividing ring |
| Myosin V | actin, towards the + end | 36 nm | walks cargo along actin cables |

Kinesin walks hand over hand: its two heads bind alternately, one ATP for each 8 nm step — the length of a tubulin dimer — reaching about 0.8 µm/s and pulling against loads up to about 6 pN. In nerve cells, whose axons can be a metre long, motors are the only way to supply the far end: **fast axonal transport** moves vesicles 200–400 mm a day, while diffusion over the same metre would take thousands of years ([[diffusion-osmosis]]).

### Cilia and flagella
Eukaryotic cilia and flagella are built on an **axoneme** of nine outer microtubule doublets round a central pair — the "9 + 2" pattern — about 0.25 µm across. Dynein arms between the doublets slide them against each other, and because they are tied together the sliding becomes bending. The cilia lining our airways beat 10–20 times a second, sweeping mucus towards the throat at several millimetres a minute; a human sperm's flagellum is about 50 µm long. Bacterial flagella are entirely different — a rigid spiral turned by a rotary motor ([[prokaryotic-cells]]).

> [!fact] Some of the most useful cancer medicines are cytoskeletal poisons: paclitaxel freezes microtubules and vincristine stops them growing, so dividing cells stall in mitosis. Colchicine, used for gout, also binds tubulin.
`,
  ideas: [
    'Three filament systems: actin (7 nm), intermediate filaments (10 nm) and microtubules (25 nm, hollow).',
    'Actin and microtubules are polar and dynamic, and serve as tracks for motors; intermediate filaments are stable cables that resist stretching.',
    'Motor proteins convert ATP into steps: kinesin moves outwards and dynein inwards on microtubules, myosins move on actin.',
    'Microtubules show dynamic instability, which lets the spindle capture chromosomes; cilia and flagella bend by dynein sliding in a 9 + 2 axoneme.'
  ],
  pitfalls: [
    'The cytoskeleton is a fixed scaffold — Most of it turns over in seconds to minutes; a microtubule can grow for a minute and vanish in seconds.',
    'Bacterial and eukaryotic flagella work the same way — A bacterial flagellum is a rigid spiral spun by a rotary motor powered by ion flow; a eukaryotic flagellum bends, driven by dynein and ATP along its whole length.',
    'Motor proteins move cargo by pushing through the cytoplasm at random — They walk step by step along specific tracks in a set direction (kinesin to + ends, dynein to − ends), one ATP per step.'
  ],
  formulas: [
    {
      name: 'Speed of a motor protein',
      expr: 'v = s*f', tex: 'v = s\\,f',
      vars: {
        v: { name: 'speed', q: 'speed', unit: 'µm/s' },
        s: { name: 'step size', q: 'length', unit: 'nm', value: 8 },
        f: { name: 'steps per second', q: 'rate', unit: '1/s', value: 100 }
      },
      note: 'Kinesin: 8 nm steps, one ATP each; myosin V: 36 nm steps. The stepping rate falls when ATP is scarce or the load is heavy.',
      stories: { v: 'A kinesin takes {s} steps at {f}. How fast does it move?', f: 'A motor moving at {v} takes {s} steps. How many steps a second, and so how many ATP a second, does it use?' }
    },
    {
      name: 'Time to carry cargo along an axon',
      expr: 't = L/v', tex: 't = \\dfrac{L}{v}',
      vars: {
        t: { name: 'travel time', q: 'time', unit: 'day' },
        L: { name: 'length of the axon', q: 'length', unit: 'm', value: 1 },
        v: { name: 'transport speed', q: 'speed', unit: 'µm/s', value: 4.6 }
      },
      note: 'Fast axonal transport runs at 200–400 mm a day (about 2–5 µm/s); slow transport of cytoskeletal proteins at 0.2–8 mm a day.',
      stories: { t: 'Vesicles move at {v} down a motor-neuron axon {L} long. How long does the trip take?' }
    },
    {
      name: 'Tubulin dimers in a microtubule',
      expr: 'N = 13*L/a', tex: 'N = \\dfrac{13\\,L}{a}',
      vars: {
        N: { name: 'number of tubulin dimers' },
        L: { name: 'length of the microtubule', q: 'length', unit: 'µm', value: 10 },
        a: { name: 'length of one dimer', q: 'length', unit: 'nm', value: 8, fixed: true }
      },
      note: 'Thirteen protofilaments side by side, each a chain of 8 nm dimers.',
      stories: { N: 'How many tubulin dimers are there in a microtubule {L} long?', L: 'A microtubule contains {N} tubulin dimers. How long is it?' }
    }
  ],
  examples: [
    {
      title: 'Down the longest axon',
      q: 'A motor neuron\'s axon runs 1 m from the spinal cord to the foot. How long does cargo take at a single kinesin\'s 0.8 µm/s, at typical fast transport (4.6 µm/s), and by diffusion of a vesicle (D ≈ 10⁻¹² m²/s)?',
      steps: [
        'One kinesin, non-stop: $1/0.8\\times10^{-6} = 1.25\\times10^6$ s ≈ 14 days.',
        'Fast axonal transport: $1/4.6\\times10^{-6} = 2.2\\times10^5$ s ≈ 2.5 days.',
        'Diffusion: $t = x^2/2D = 1/(2\\times10^{-12}) = 5\\times10^{11}$ s ≈ 16 000 years.'
      ],
      a: 'About 2.5 days by fast transport — against some 16 000 years by diffusion.'
    },
    {
      title: 'Building a microtubule',
      q: 'How many tubulin dimers make a 10 µm microtubule, and how many GTP molecules does its assembly bind?',
      steps: ['$N = 13 \\times 10\\,000\\ \\mathrm{nm}/8\\ \\mathrm{nm} = 16\\,250$ dimers.', 'Each dimer adds with a GTP on its β-tubulin, which is hydrolysed soon after: some 16 000 GTP.'],
      a: 'About 16 000 dimers.'
    }
  ],
  quiz: [
    { q: 'Which filament is a hollow tube 25 nm across?', choices: ['actin filament', 'intermediate filament', 'microtubule', 'myosin filament'], a: 2, why: 'Microtubules are hollow cylinders of 13 protofilaments; actin filaments are 7 nm and intermediate filaments 10 nm, both solid.' },
    { q: 'A drug that stops microtubules from growing first stops…', choices: ['muscle contraction', 'the separation of chromosomes in mitosis', 'the strength of skin', 'the diffusion of oxygen'], a: 1, why: 'The mitotic spindle is built of dynamic microtubules, so dividing cells stall in mitosis — the basis of drugs such as vincristine. Muscle contraction runs on actin and myosin.' },
    { q: 'Intermediate filaments are polar and serve as tracks for motor proteins.', a: false, why: 'They are non-polar, rope-like and carry no motors; their job is to resist stretching.' },
    { q: 'A kinesin takes 8 nm steps at 80 steps per second. What is its speed?', answer: 0.64, unit: 'µm/s', why: '8 nm × 80/s = 640 nm/s = 0.64 µm/s.' },
    { q: 'Why do nerve cells carry vesicles on motors instead of letting them diffuse?', choices: ['vesicles cannot diffuse at all', 'diffusion time grows with the square of distance, so over centimetres to metres it would take years', 'diffusion only works outwards', 'motors need no energy'], a: 1, why: 't ≈ x²/2D: fine over micrometres, hopeless over the length of an axon. Motors cost ATP but move at a steady speed whatever the distance.' }
  ],
  problems: [
    { q: 'Vesicles move at 3 µm/s along a 0.5 m axon. How many days does the trip take?', answer: 1.93, unit: 'day', tol: 0.02, steps: ['$t = 0.5/3\\times10^{-6} = 1.67\\times10^5$ s.', '$1.67\\times10^5/86\\,400 = 1.93$ days.'] },
    { q: 'How many tubulin dimers are there in a 2.5 µm microtubule?', answer: 4062.5, tol: 0.02, steps: ['$N = 13 \\times 2500/8 = 4063$.'] }
  ],
  applications: [
    'Cancer chemotherapy with microtubule poisons (taxanes, vinca alkaloids) that stop dividing cells.',
    'Understanding diseases of cilia (primary ciliary dyskinesia, with chronic airway infections) and of motor proteins in nerves (some inherited neuropathies).',
    'How white blood cells crawl to an infection and how cancer cells invade, both driven by actin.',
    'Colchicine in gout, which works partly by stopping white blood cells from moving.'
  ],
  history: 'Microtubules were seen in electron micrographs in the early 1960s and tubulin was isolated in 1968; actin had been found in muscle by Brunó Straub in 1942. Kinesin was discovered in 1985 from squid giant axons. Tim Mitchison and Marc Kirschner described dynamic instability in 1984, and single-molecule experiments in the 1990s measured kinesin\'s 8 nm steps directly.',
  sim: 'cell-kinesin'
},

/* ================================================================ MEMBRANES AND TRANSPORT */
{
  id: 'membrane-structure', parent: 'membranes', title: 'The fluid mosaic membrane', level: 2,
  short: 'Every cell membrane is a 5 nm double layer of lipids — fluid like oil and self-assembling — with proteins floating in it. The oily core blocks ions and polar molecules, so proteins decide what crosses.',
  keywords: ['cell membrane', 'plasma membrane', 'fluid mosaic model', 'phospholipid bilayer', 'amphipathic', 'cholesterol', 'membrane fluidity', 'unsaturated fatty acids', 'integral protein', 'peripheral protein', 'glycocalyx', 'glycoprotein', 'permeability', 'lateral diffusion', 'flip-flop', 'Singer and Nicolson'],
  prereq: ['lipids', 'protein-structure', 'cell-theory'],
  related: ['diffusion-osmosis', 'active-transport', 'endocytosis', 'cell-signalling', 'chemistry:lipids', 'chemistry:intermolecular-forces', 'medicine:membrane-transport', 'medicine:cholesterol-lipids'],
  body: `
Every cell, and every organelle of a eukaryotic cell, is wrapped in a membrane only about **5 nm** thick — twenty thousand of them stacked would make one sheet of paper. Its design, the **fluid mosaic model** of Jonathan Singer and Garth Nicolson (1972), is simple: a double layer of lipids, fluid like oil, with proteins floating in it like icebergs.

### The lipid bilayer
Membrane lipids are **amphipathic**: a water-loving head (a phosphate group, or a sugar) and two water-hating fatty tails ([[lipids]]). In water they arrange themselves into a bilayer, heads out and tails in, because that hides the tails from water — no machinery is needed, and a torn bilayer reseals by itself. The hydrophobic core is about 3 nm thick; with the head groups, 4–5 nm. One square micrometre of bilayer holds about five million lipid molecules.

| Lipid | Where | Role |
|---|---|---|
| Phosphatidylcholine, sphingomyelin | mostly outer leaflet | the bulk of the bilayer |
| Phosphatidylethanolamine, phosphatidylserine | mostly inner leaflet | phosphatidylserine appearing outside marks a dying cell for removal |
| Cholesterol | both leaflets; 30–40 % of the lipid molecules in animal plasma membranes | stiffens a warm membrane, keeps a cold one fluid, and lowers permeability |
| Glycolipids | outer leaflet only | recognition; carry some blood-group sugars |

The two leaflets differ, and stay different, because a phospholipid flips from one side to the other only rarely — less than once a month in a pure bilayer — unless enzymes (flippases and scramblases) move it. Within its own leaflet, though, a lipid is free: it swaps places with its neighbours some ten million times a second and wanders about 2 µm in a second (a diffusion coefficient of about 1 µm²/s).

### Fluidity
A membrane has to be fluid to work: proteins must move and change shape, vesicles bud and fuse. Fluidity rises with temperature and with the proportion of **unsaturated** fatty-acid tails, whose kinks stop the chains packing; saturated tails pack tightly and set like butter. Cholesterol buffers both ways. Organisms adjust their lipids to temperature — **homeoviscous adaptation**: bacteria grown in the cold, fish of polar seas and even the lower legs of reindeer all use more unsaturated fatty acids.

### The proteins
Proteins make up about half the mass of a typical plasma membrane — from a quarter in myelin, an electrical insulator, to three quarters in the inner mitochondrial membrane, which is packed with the respiratory chain.

- **Integral proteins** span the bilayer, usually as α-helices of about 20 hydrophobic amino acids (20 × 0.15 nm = 3 nm, the thickness of the core), or as β-barrels.
- **Peripheral proteins** sit on one surface, attached to integral proteins or to head groups.
- **Lipid-anchored proteins** hang from a fatty chain inserted in the bilayer.

They do the membrane's work: **transport** (channels, carriers, pumps), **receptors** for signals ([[cell-signalling]]), **enzymes**, **adhesion** to neighbouring cells and the matrix, **recognition** — the sugar chains of glycoproteins and glycolipids form a coat, the glycocalyx, that labels the cell — and **anchoring** the cytoskeleton. When a mouse cell and a human cell are fused, their membrane proteins mix completely within about 40 minutes at 37 °C, but not in the cold: the mosaic really is fluid.

### A selective barrier
The oily core lets small uncharged molecules through and stops ions and large polar ones. Permeabilities through a pure lipid bilayer span more than ten orders of magnitude:

| Molecule | Permeability (cm/s) | Crosses… |
|---|---|---|
| O₂, CO₂, N₂ | very high | freely |
| Water | about 10⁻³ | quite well; far faster through aquaporins |
| Urea, glycerol | about 10⁻⁶ | slowly |
| Glucose | about 10⁻⁷ or less | hardly; needs carriers |
| K⁺, Na⁺, Cl⁻ | 10⁻¹²–10⁻¹¹ | practically not at all without channels |

So nearly everything a cell needs that is charged or large — ions, sugars, amino acids — crosses by way of proteins, and the cell controls its traffic by choosing which proteins to make ([[diffusion-osmosis]], [[active-transport]]).

> [!key] A fluid lipid bilayer that assembles itself and blocks ions and polar molecules, studded with proteins that choose what crosses and which signals get through: that is a membrane.
`,
  ideas: [
    'Membranes are phospholipid bilayers about 5 nm thick, with hydrophobic tails inside and hydrophilic heads facing the water.',
    'The bilayer is fluid: lipids and many proteins diffuse sideways within a leaflet, but rarely flip between leaflets.',
    'Fluidity rises with temperature and unsaturation; cholesterol buffers it.',
    'Integral, peripheral and lipid-anchored proteins carry out transport, signalling, adhesion and recognition.',
    'The bilayer lets small uncharged molecules through and blocks ions and large polar molecules, which need proteins.'
  ],
  pitfalls: [
    'The membrane is a rigid wall — It is a two-dimensional liquid; lipids swap places millions of times a second and proteins drift across the cell surface in minutes.',
    'Water cannot cross a lipid bilayer — Water crosses pure bilayers fairly well because it is small; aquaporins make it much faster, but the bilayer itself is not waterproof. Ions are the ones that are truly blocked.',
    'The two sides of a membrane are the same — The leaflets differ in lipids (phosphatidylserine inside, glycolipids outside) and every protein has a fixed orientation.'
  ],
  formulas: [
    {
      name: 'Flux through a membrane',
      expr: 'J = P*dC', tex: 'J = P\\,\\Delta C',
      vars: {
        J: { name: 'flux (moles per square metre per second)', unit: 'mol/(m²·s)' },
        P: { name: 'permeability coefficient', q: 'speed', unit: 'cm/s', value: 1e-6 },
        dC: { name: 'concentration difference across the membrane', q: 'concentration', unit: 'mM', value: 10, tex: '\\Delta C' }
      },
      note: 'P folds together the diffusion coefficient in the membrane, how well the solute dissolves in lipid, and the membrane thickness.',
      stories: { J: 'Urea (P = {P}) has a concentration difference of {dC} across a bilayer. What is the flux?', P: 'A flux of {J} crosses a membrane with a concentration difference of {dC}. What is the permeability?' }
    },
    {
      name: 'How far a lipid wanders in the membrane',
      expr: 'x = sqrt(4*D*t)', tex: 'x = \\sqrt{4Dt}',
      vars: {
        x: { name: 'root-mean-square distance travelled', q: 'length', unit: 'µm' },
        D: { name: 'lateral diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 1e-12 },
        t: { name: 'time', q: 'time', unit: 's', value: 1 }
      },
      note: 'Diffusion in two dimensions: ⟨x²⟩ = 4Dt. Lipids: D ≈ 10⁻¹² m²/s (1 µm²/s); membrane proteins 10⁻¹⁴–10⁻¹³ m²/s, or not at all when anchored.',
      stories: { x: 'A phospholipid has a lateral diffusion coefficient of {D}. How far does it typically wander in {t}?', t: 'How long does a membrane protein with D = {D} take to wander {x}?' }
    },
    {
      name: 'Amino acids in a membrane-spanning helix',
      expr: 'n = d/h', tex: 'n = \\dfrac{d}{h}',
      vars: {
        n: { name: 'number of amino acids' },
        d: { name: 'thickness of the hydrophobic core', q: 'length', unit: 'nm', value: 3 },
        h: { name: 'rise per amino acid in an α-helix', q: 'length', unit: 'nm', value: 0.15, fixed: true }
      },
      note: 'Stretches of about 20 hydrophobic amino acids in a protein sequence are the tell-tale sign of a membrane-spanning helix.',
      stories: { n: 'How many amino acids must an α-helix have to cross a hydrophobic core {d} thick?' }
    }
  ],
  examples: [
    {
      title: 'Lipids and proteins on the move',
      q: 'How long does a lipid (D = 1 µm²/s) take to wander 20 µm, the width of a cell? And a membrane protein with D = 0.05 µm²/s?',
      steps: [
        'In two dimensions $t = x^2/4D$.',
        'Lipid: $t = 20^2/(4\\times1) = 100$ s, under two minutes.',
        'Protein: $t = 400/(4\\times0.05) = 2000$ s, about half an hour — matching the 40 minutes it took mouse and human proteins to mix in Frye and Edidin\'s fused cells.'
      ],
      a: 'About 2 minutes for the lipid and 30 minutes for the protein.'
    },
    {
      title: 'Why ions need channels',
      q: 'K⁺ is 136 mM more concentrated inside a cell than outside. Its permeability through a pure bilayer is about 10⁻¹² cm/s. How many ions leak through the 1000 µm² surface of a cell each second? One open potassium channel passes about 10⁷ ions a second.',
      steps: [
        '$J = P\\Delta C = 10^{-14}\\ \\mathrm{m/s} \\times 136\\ \\mathrm{mol/m^3} = 1.4\\times10^{-12}\\ \\mathrm{mol/(m^2\\,s)}$.',
        'Over $10^{-9}\\ \\mathrm{m^2}$: $1.4\\times10^{-21}$ mol/s, which is $1.4\\times10^{-21}\\times6.0\\times10^{23} \\approx 800$ ions a second.',
        'A single channel lets through ten thousand times more than the whole bilayer.'
      ],
      a: 'About 800 ions a second through the whole bilayer — against 10 million through one channel.'
    }
  ],
  quiz: [
    { q: 'Which crosses a pure lipid bilayer fastest?', choices: ['Na⁺', 'glucose', 'O₂', 'Cl⁻'], a: 2, why: 'Small, uncharged and fat-soluble, O₂ dissolves in the core and passes freely. Ions and glucose need proteins.' },
    { q: 'A fish is moved from warm water to cold. Over the following days its cell membranes…', choices: ['become more saturated', 'become more unsaturated, keeping them fluid', 'lose all their cholesterol', 'stay exactly the same'], a: 1, why: 'Homeoviscous adaptation: more kinked, unsaturated tails stop the membrane stiffening in the cold.' },
    { q: 'Phospholipids flip freely between the two leaflets, so both leaflets have the same composition.', a: false, why: 'Flip-flop is extremely slow without enzymes, and flippases keep the leaflets different (phosphatidylserine inside).' },
    { q: 'How many amino acids must an α-helix have to span a 3.3 nm hydrophobic core (0.15 nm per residue)?', answer: 22, why: '3.3/0.15 = 22.' },
    { q: 'When a mouse cell and a human cell are fused, their membrane proteins mix within about 40 minutes at 37 °C but not at 0 °C. This shows that…', choices: ['proteins are made in the membrane', 'membrane proteins diffuse sideways in a fluid bilayer', 'the two species have identical proteins', 'proteins flip between the leaflets'], a: 1, why: 'Frye and Edidin (1970): proteins drift within the fluid lipid layer, and cold makes the membrane too viscous.' }
  ],
  problems: [
    { q: 'A lipid has D = 1 µm²/s (10⁻¹² m²/s). What root-mean-square distance does it wander in 10 s?', answer: 6.32, unit: 'µm', tol: 0.02, steps: ['$x = \\sqrt{4Dt} = \\sqrt{4\\times10^{-12}\\times10} = 6.3\\times10^{-6}$ m.'] }
  ],
  applications: [
    'Liposomes — artificial bilayer vesicles — that carry medicines and the mRNA of vaccines into cells.',
    'Anaesthetics, alcohol and detergents, which act partly by dissolving in or disrupting membranes.',
    'Designing drugs that can cross membranes: small, uncharged, moderately fat-soluble molecules absorb best.',
    'Predicting membrane proteins from a genome by looking for stretches of about 20 hydrophobic amino acids.'
  ],
  history: 'In 1925 Evert Gorter and François Grendel spread the lipids of red cells on water and found they covered about twice the cells\' surface — the first evidence for a bilayer. Hugh Davson and James Danielli pictured proteins coating both faces (1935); freeze-fracture electron microscopy then showed proteins passing through the bilayer, and in 1970 Larry Frye and Michael Edidin watched mouse and human proteins mix. Singer and Nicolson combined the evidence into the fluid mosaic model in 1972.',
  sim: { id: 'cell-diffusion', params: { solute: 'ion' } }
},

{
  id: 'diffusion-osmosis', parent: 'membranes', title: 'Diffusion and osmosis', level: 2,
  short: 'Random molecular motion makes substances spread from high to low concentration — fast over micrometres, painfully slow over centimetres. Osmosis is the diffusion of water across a membrane that holds back solutes: cells swell in dilute solutions and shrink in concentrated ones.',
  keywords: ['diffusion', 'Fick\'s law', 'diffusion coefficient', 'random walk', 'concentration gradient', 'facilitated diffusion', 'channel', 'carrier', 'aquaporin', 'GLUT1', 'osmosis', 'osmotic pressure', 'tonicity', 'hypotonic', 'hypertonic', 'isotonic', 'haemolysis', 'crenation', 'osmolarity'],
  prereq: ['membrane-structure', 'chemistry:molarity', 'chemistry:osmotic-pressure'],
  related: ['water-potential', 'active-transport', 'cell-theory', 'enzyme-kinetics', 'gas-exchange-animals', 'osmoregulation', 'math:heat-equation', 'chemistry:effusion-diffusion', 'medicine:membrane-transport', 'medicine:electrolytes'],
  body: `
Molecules in a liquid never stop moving. Each is jostled by its neighbours billions of times a second and wanders in a **random walk**. No molecule "knows" where the others are, yet if there are more of them on one side of a boundary, more will wander across from that side than back — a **net movement from high concentration to low**. That is **diffusion**. The cell pays nothing for it: the motion is the heat of the surroundings, and the drive is the rise in entropy as the molecules spread out.

### Fick's law and the square of the distance
Adolf Fick (1855) found that the net flow through a surface is proportional to the concentration gradient:

$$J = -D\\,\\frac{\\Delta C}{\\Delta x}$$

$J$ is the flux (moles crossing each square metre each second) and $D$ the **diffusion coefficient**, larger for small molecules, thin liquids and high temperature. Double the difference in concentration and the flux doubles; double the thickness of the barrier and it halves. That is why exchange surfaces are large, thin and kept steep by blood flow — the wall between air and blood in the lung is about 0.5 µm thick ([[gas-exchange-animals]]).

The time a molecule takes to wander a distance $x$ grows with the **square** of the distance (Einstein, 1905):

$$t \\approx \\frac{x^2}{2D}$$

| Molecule, in water at 25 °C | $D$ (m²/s) | Time to diffuse 10 µm | Time to diffuse 1 mm |
|---|---|---|---|
| Oxygen | $2\\times10^{-9}$ | 25 ms | 4 minutes |
| Glucose | $6.7\\times10^{-10}$ | 75 ms | 12 minutes |
| Haemoglobin | $7\\times10^{-11}$ | 0.7 s | 2 hours |

Across a cell, diffusion is fast; across a tissue it is hopeless ([[cell-theory]]). Across a 20 nm synaptic cleft it takes under a microsecond. In the crowded cytoplasm molecules move several times more slowly than in water.

### Crossing a membrane: simple and facilitated diffusion
Small uncharged molecules — O₂, CO₂, ethanol, steroid hormones — diffuse straight through the lipid bilayer ([[membrane-structure]]). Ions and polar molecules need proteins, but when they go downhill it is still diffusion, **facilitated diffusion**:

- **Channels** are pores that open and close, gated by voltage, a signal molecule or stretch. A potassium channel passes tens of millions of ions a second yet turns away the smaller sodium ion; an **aquaporin** passes some three billion water molecules a second in single file.
- **Carriers** bind their solute, change shape and release it on the other side. Handling one molecule at a time, they **saturate**, following the same curve as an enzyme ([[enzyme-kinetics]]): the red-cell glucose carrier GLUT1 has a $K_m$ of a few millimolar.

Neither can move anything against its gradient; that needs energy — [[active-transport]].

### Osmosis
**Osmosis** is the net diffusion of **water** across a membrane that lets water through but holds back a solute. Water moves towards the side with more dissolved particles — from high to low water potential ([[water-potential]]). What counts is the number of particles, not their kind: a mole of NaCl gives about two moles of particles, a mole of glucose one. The pressure that would just stop the flow is the **osmotic pressure** ([[chemistry:osmotic-pressure|van 't Hoff's law]]):

$$\\pi = iCRT$$

Blood plasma, at about 290 mOsm/L, has an osmotic pressure of 7.5 bar at 37 °C — the pressure at the bottom of 75 m of water.

### Tonicity: cells in solutions
**Tonicity** compares a solution with a cell's contents, counting only solutes that cannot cross the membrane:

| Solution | Water moves | Red blood cell | Plant cell |
|---|---|---|---|
| Hypotonic (fewer particles outside) | in | swells into a sphere and bursts: **haemolysis** | swells until the wall pushes back: **turgid** |
| Isotonic (0.9 % NaCl, about 290 mOsm/L) | no net flow | a biconcave disc of about 90 fL | **flaccid** |
| Hypertonic (more particles outside) | out | shrinks and crinkles: **crenation** | the membrane pulls away from the wall: **plasmolysis** |

A red cell behaves as an almost ideal **osmometer**: its volume, less an osmotically inactive part (mostly haemoglobin, about 40 % of it), varies in inverse proportion to the outside osmolarity. Its membrane can bend but hardly stretch, so once the cell has swollen into a sphere of the same surface — about 150 fL — it bursts. That happens at about 150 mOsm/L, half the normal value. Animal cells without walls survive only in fluid kept isotonic by the kidneys ([[osmoregulation]]); freshwater protists bail out the water that keeps coming in with contractile vacuoles.

> [!note] This is why fluids given into a vein are made isotonic with blood; pure water injected into a vein would burst red cells.
`,
  ideas: [
    'Diffusion is the net movement from high to low concentration caused by random molecular motion; it needs no energy from the cell.',
    'Fick\'s law: flux is proportional to the concentration gradient, J = −D ΔC/Δx.',
    'Diffusion time grows with the square of the distance, t ≈ x²/2D: milliseconds across a cell, hours across a centimetre.',
    'Facilitated diffusion uses channels and carriers but still runs downhill; carriers saturate.',
    'Osmosis moves water towards more solute particles; red cells burst in hypotonic and shrink in hypertonic solutions, plant cells become turgid or plasmolysed.'
  ],
  pitfalls: [
    'In diffusion molecules move towards the lower concentration on purpose — Each molecule moves at random; the net flow appears only because more molecules start on the crowded side.',
    'Diffusion stops at equilibrium — Molecules keep crossing in both directions; only the net flow stops.',
    'A solution isosmotic with a cell is always isotonic — Only if its solutes cannot enter. Red cells in isosmotic urea swell and burst, because urea diffuses in and water follows.'
  ],
  formulas: [
    {
      name: 'Diffusion time',
      expr: 't = x^2/(2*D)', tex: 't = \\dfrac{x^2}{2D}',
      vars: {
        t: { name: 'typical time to diffuse the distance', q: 'time', unit: 's' },
        x: { name: 'distance', q: 'length', unit: 'µm', value: 10 },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 2e-9 }
      },
      note: 'From the mean square displacement along one direction, ⟨x²⟩ = 2Dt; the mean square distance from the start in three dimensions is 6Dt. O₂ in water 2 × 10⁻⁹, glucose 6.7 × 10⁻¹⁰, a protein about 10⁻¹⁰ m²/s.',
      practice: { unknowns: ['t', 'x'] },
      stories: {
        t: 'How long does oxygen (D = {D}) take to diffuse {x}?',
        x: 'In {t}, how far does a molecule with D = {D} typically diffuse?',
        D: 'A dye spreads {x} in {t}. What is its diffusion coefficient?'
      }
    },
    {
      name: 'Fick\'s first law',
      expr: 'J = D*dC/dx', tex: 'J = D\\,\\dfrac{\\Delta C}{\\Delta x}',
      vars: {
        J: { name: 'flux (moles per square metre per second)', unit: 'mol/(m²·s)' },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 1e-9 },
        dC: { name: 'concentration difference', q: 'concentration', unit: 'mM', value: 5, tex: '\\Delta C' },
        dx: { name: 'distance (thickness of the layer)', q: 'length', unit: 'µm', value: 10, tex: '\\Delta x' }
      },
      note: 'The flux flows down the gradient (the minus sign in J = −D dC/dx gives its direction).',
      stories: { J: 'Glucose (D = {D}) differs by {dC} across a layer {dx} thick. What is the flux?', dx: 'To carry a flux of {J} with D = {D} and a difference of {dC}, how thin must the layer be?' }
    },
    {
      name: 'Osmotic pressure (van \'t Hoff)',
      expr: 'posm = i*C*R*T', tex: '\\pi = iCRT',
      vars: {
        posm: { name: 'osmotic pressure', q: 'pressure', unit: 'kPa', tex: '\\pi' },
        i: { name: 'particles per formula unit (van \'t Hoff factor)', int: true, value: 2, min: 1 },
        C: { name: 'concentration', q: 'concentration', unit: 'mM', value: 154 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'Ideal, dilute solutions. Real salt solutions give a little less (0.9 % NaCl is about 286 mOsm/kg, not 308) because the ions are not fully independent.',
      stories: { posm: 'Saline for injection is {C} NaCl (i = {i}). What is its osmotic pressure at {T}?', C: 'What concentration of a solute with i = {i} has an osmotic pressure of {posm} at {T}?' }
    },
    {
      name: 'A red cell as an osmometer (Boyle–van \'t Hoff)',
      expr: 'V = V0*(b + (1 - b)*C0/C)', tex: 'V = V_0\\left[b + (1-b)\\dfrac{C_0}{C}\\right]',
      vars: {
        V: { name: 'cell volume', q: false, unit: 'fL' },
        V0: { name: 'volume in isotonic fluid', q: false, unit: 'fL', value: 90 },
        b: { name: 'osmotically inactive fraction', q: 'ratio', unit: '%', value: 40, min: 0, max: 90 },
        C0: { name: 'isotonic osmolarity', q: 'osmol', unit: 'mOsm/L', value: 290 },
        C: { name: 'osmolarity outside', q: 'osmol', unit: 'mOsm/L', value: 150 }
      },
      note: 'Only for solutes that cannot enter. A human red cell bursts when V passes about 150 fL — the volume of a sphere with its 135 µm² of membrane.',
      stories: { V: 'A red cell of {V0} is put into a solution of {C}. What volume does it reach?', C: 'At what outside osmolarity does a red cell of {V0} swell to {V}?' }
    }
  ],
  examples: [
    {
      title: 'Red cells in dilute salt',
      q: 'A red cell (90 fL at 290 mOsm/L, 40 % inactive volume) bursts at about 148 fL. Does it survive 150 mOsm/L? 140 mOsm/L?',
      steps: [
        'At 150: $V = 90[0.4 + 0.6\\times290/150] = 90\\times1.56 = 140$ fL — swollen, nearly spherical, intact.',
        'At 140: $V = 90[0.4 + 0.6\\times290/140] = 90\\times1.64 = 148$ fL — at the limit; the weakest cells burst.',
        'This is the osmotic fragility test: haemolysis begins near 0.45 % NaCl (about 150 mOsm/L) in normal blood, and at higher concentrations when red cells are already rounder than normal.'
      ],
      a: 'It survives 150 mOsm/L (140 fL) and reaches bursting point near 140 mOsm/L.'
    },
    {
      title: 'Is saline isotonic?',
      q: 'Normal saline is 0.9 % NaCl: 9 g per litre, molar mass 58.4 g/mol. What is its ideal osmotic pressure at 37 °C, compared with plasma at 290 mOsm/L?',
      steps: [
        '$9/58.4 = 0.154$ mol/L = 154 mM; with $i = 2$, 308 mOsm/L.',
        '$\\pi = 308\\ \\mathrm{mol/m^3} \\times 8.314 \\times 310 = 794$ kPa.',
        'Plasma: $290 \\times 8.314 \\times 310 = 748$ kPa. With the real osmotic coefficient (0.93) saline comes to about 286 mOsm/kg — close to isotonic.'
      ],
      a: 'About 790 kPa ideal (about 740 kPa real), close to plasma\'s 750 kPa.'
    },
    {
      title: 'Across a synapse',
      q: 'A neurotransmitter with D = 4 × 10⁻¹⁰ m²/s crosses a synaptic cleft 20 nm wide. How long does it take?',
      steps: ['$t = x^2/2D = (2\\times10^{-8})^2/(8\\times10^{-10}) = 5\\times10^{-7}$ s.'],
      a: 'About half a microsecond — diffusion is the right way to cross a synapse, and the wrong way to cross a leg.'
    }
  ],
  quiz: [
    { q: 'Which change doubles the rate of diffusion across a membrane?', choices: ['doubling its thickness', 'doubling the concentration difference', 'halving its surface area', 'halving the absolute temperature'], a: 1, why: 'Fick: flux ∝ area × ΔC / thickness. Doubling the thickness halves the rate; halving area or temperature slows it.' },
    { q: 'Red blood cells are put in 0.3 % NaCl (about 100 mOsm/L). What happens?', choices: ['they shrink and crinkle', 'nothing', 'they swell and burst', 'they swell a little and stop'], a: 2, why: 'V = 90[0.4 + 0.6 × 2.9] ≈ 190 fL, well beyond the 150 fL at which the membrane bursts.' },
    { q: 'Facilitated diffusion through a carrier can move glucose into a cell against its concentration gradient.', a: false, why: 'Facilitated diffusion only speeds up downhill movement. Moving glucose uphill takes active transport, such as the Na⁺-driven SGLT1.' },
    { q: 'How long (in s) does glucose (D = 6.7 × 10⁻¹⁰ m²/s) take to diffuse 20 µm?', answer: 0.3, unit: 's', why: 't = (2 × 10⁻⁵)²/(2 × 6.7 × 10⁻¹⁰) = 4 × 10⁻¹⁰/1.34 × 10⁻⁹ ≈ 0.3 s.' },
    { q: 'Red cells are put in a urea solution of 290 mOsm/L, the same osmolarity as their contents. They…', choices: ['stay the same: the solution is isotonic', 'shrink', 'swell and burst, because urea enters and water follows it', 'become spheres without changing volume'], a: 2, why: 'Urea crosses the membrane, so it does not hold water outside: the solution is isosmotic but hypotonic in effect.' }
  ],
  problems: [
    { q: 'What is the ideal osmotic pressure of 0.1 M sucrose at 25 °C, in kPa?', answer: 248, unit: 'kPa', tol: 0.02, steps: ['$\\pi = iCRT = 1 \\times 100\\ \\mathrm{mol/m^3} \\times 8.314 \\times 298.15 = 2.48\\times10^5$ Pa.'] },
    { q: 'A red cell of 90 fL (40 % inactive) is put in 200 mOsm/L saline. What volume does it reach, in fL?', answer: 114.3, unit: 'fL', tol: 0.02, steps: ['$V = 90[0.4 + 0.6 \\times 290/200] = 90 \\times 1.27 = 114$ fL.'] }
  ],
  applications: [
    'Intravenous fluids, eye drops and contact-lens solutions are made isotonic so that cells neither swell nor shrink.',
    'Preserving food with salt or sugar: the hypertonic surroundings pull water out of microbes.',
    'Dialysis, in which small waste molecules diffuse out of blood across a membrane into fluid that has none of them.',
    'Designing exchange surfaces — lungs, gills, placentas and industrial membranes — to be large and thin.'
  ],
  history: 'Robert Brown watched particles from pollen jiggle in water in 1827; Adolf Fick stated his laws of diffusion in 1855; Wilhelm Pfeffer measured osmotic pressure with clay-pot membranes in 1877, and Jacobus van \'t Hoff showed in 1886 that it obeys a law like that of gases (he won the first Nobel Prize in Chemistry, 1901). Einstein\'s 1905 theory of Brownian motion linked diffusion to molecular motion. Peter Agre discovered aquaporins in red cells in 1992 (Nobel Prize 2003).',
  sim: ['cell-diffusion', 'cell-osmosis']
},

{
  id: 'water-potential', parent: 'membranes', title: 'Water potential', level: 2,
  short: 'Water potential ψ measures the free energy of water per unit volume, relative to pure water at atmospheric pressure (zero). Water always moves from higher to lower ψ. In a plant cell ψ = ψs + ψp: solutes make it negative, turgor pressure pushes it back up.',
  keywords: ['water potential', 'psi', 'solute potential', 'osmotic potential', 'pressure potential', 'turgor', 'turgid', 'flaccid', 'plasmolysis', 'incipient plasmolysis', 'MPa', 'Höfler diagram', 'potato cylinders', 'relative humidity', 'cohesion–tension'],
  prereq: ['diffusion-osmosis', 'physics:pressure', 'chemistry:osmotic-pressure'],
  related: ['transpiration', 'plant-tissues', 'plant-nutrition', 'phloem-transport', 'osmoregulation', 'physics:hydrostatic-pressure', 'chemistry:gibbs-energy'],
  body: `
Plants have no heart, yet water moves through them by hundreds of litres a day — from soil into roots, up the xylem, into leaf cells and out into the air. One quantity explains it all: the **water potential** $\\psi$ (psi), the free energy of water per unit volume, measured from that of pure water at atmospheric pressure. **Water always moves from higher to lower water potential**, and since pure water is defined as zero, almost every value in a living plant is negative.

### Two main parts
$$\\psi = \\psi_s + \\psi_p$$

- **Solute potential** $\\psi_s$ (or osmotic potential) is zero for pure water and negative for any solution: dissolved particles dilute the water and lower its free energy. For dilute solutions $\\psi_s = -iCRT$, the osmotic pressure with a minus sign. A 0.1 M sucrose solution at 20 °C has $\\psi_s = -0.24$ MPa; cell sap typically −0.5 to −2 MPa; sea water about −2.7 MPa.
- **Pressure potential** $\\psi_p$ is the physical pressure on the water above atmospheric. In a plant cell it is the **turgor pressure** of the protoplast pressing on its wall, typically +0.3 to +1 MPa — several times the pressure in a car tyre. In xylem, where water is pulled upwards by evaporation from the leaves, it is negative: a tension of −0.5 to −2 MPa or more ([[transpiration]]).

Units: 1 MPa = 10 bar ≈ 9.9 atm. Water potential is a pressure because free energy per unit volume, J/m³, is the same as N/m². In tall trees a **gravitational** term $\\rho_w g h$ adds 0.01 MPa for every metre of height, and in dry soils and cell walls a **matric** term accounts for water held on surfaces.

### A plant cell in different solutions
Picture a cell whose sap has $\\psi_s = -0.8$ MPa.

- **In pure water** ($\\psi = 0$) water flows in; the protoplast swells and presses on the wall, and $\\psi_p$ rises until $\\psi_s + \\psi_p = 0$. The cell is **turgid**: at equilibrium, though still full of solutes, because the wall pushes back. This is why plant cells do not burst.
- **At incipient plasmolysis** the protoplast just touches the wall with no pressure: $\\psi_p = 0$, so $\\psi = \\psi_s$. The cell is **flaccid**. A solution with the same $\\psi$ as the sap causes no net flow.
- **In a more concentrated solution** (with $\\psi$ below the sap's) water leaves, the protoplast shrinks away from the wall and the cell is **plasmolysed**. Wilting is the whole plant losing turgor.

The **Höfler diagram**, drawn in the simulation below, plots the three potentials against the volume of the cell.

### Measuring it: potato cylinders
A classic experiment puts identical cylinders of potato into a series of sucrose solutions and weighs them an hour later. They gain mass in dilute solutions and lose it in strong ones; the concentration of no change — typically 0.25–0.3 M — has the same water potential as the tissue, $\\psi = -iCRT \\approx -0.6$ to $-0.7$ MPa at 20 °C.

### From soil to air
Water potential falls all the way along the path of water through a plant:

| Where | Typical $\\psi$ (MPa) |
|---|---|
| Moist soil | −0.01 to −0.3 (−1.5 is the conventional wilting point) |
| Root cells | −0.2 to −0.6 |
| Leaf xylem | −0.5 to −1.5 |
| Leaf cells | −0.8 to −2 |
| Air at 90 % relative humidity, 20 °C | −14 |
| Air at 50 % relative humidity, 20 °C | −94 |

Even humid air is enormously "drier" than a leaf, so whenever the stomata open water evaporates, and the tension pulls a continuous column of water up the xylem — the cohesion–tension mechanism. The water potential of air follows from its relative humidity: $\\psi = (RT/\\bar{V}_w)\\ln \\mathrm{RH}$.

> [!tip] Signs trip people up: "higher" water potential means closer to zero. −0.3 MPa is higher than −0.8 MPa, so water flows from the −0.3 cell to the −0.8 cell.
`,
  ideas: [
    'Water potential ψ is the free energy of water per volume, zero for pure water at atmospheric pressure; water moves from higher (less negative) to lower ψ.',
    'ψ = ψs + ψp: solutes make ψs negative (ψs = −iCRT); turgor makes ψp positive, tension in the xylem negative.',
    'A plant cell in pure water becomes turgid (ψp = −ψs); at incipient plasmolysis ψp = 0; in a stronger solution it plasmolyses.',
    'Water potential falls from soil through the plant to the air, which is why water flows up a plant without a pump.'
  ],
  pitfalls: [
    'A cell with more solutes always gains water from a neighbour — Only if its total ψ is lower. A turgid cell full of solutes can have a higher ψ than a flaccid one with fewer, and lose water to it.',
    'A more negative water potential is higher — The reverse: −1.0 MPa is lower than −0.4 MPa, and water moves towards it.',
    'A turgid cell has stopped taking in water because it is full — Water still crosses both ways; the net flow stops because the wall\'s pressure has raised ψ inside to match the outside.'
  ],
  formulas: [
    {
      name: 'Water potential of a plant cell',
      expr: 'psi = psis + psip', tex: '\\psi = \\psi_s + \\psi_p',
      vars: {
        psi: { name: 'water potential', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi' },
        psis: { name: 'solute potential', q: 'pressure', unit: 'MPa', value: -0.8, signed: true, tex: '\\psi_s' },
        psip: { name: 'pressure potential (turgor)', q: 'pressure', unit: 'MPa', value: 0.3, signed: true, tex: '\\psi_p' }
      },
      note: 'Pure water at atmospheric pressure is ψ = 0. In the xylem ψp is negative (tension).',
      stories: {
        psi: 'A leaf cell has a solute potential of {psis} and a turgor pressure of {psip}. What is its water potential?',
        psip: 'A cell with solute potential {psis} is in equilibrium with a solution of water potential {psi}. What is its turgor pressure?'
      }
    },
    {
      name: 'Solute potential',
      expr: 'psis = -i*C*R*T', tex: '\\psi_s = -iCRT',
      vars: {
        psis: { name: 'solute potential', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi_s' },
        i: { name: 'particles per formula unit (1 for sucrose)', int: true, value: 1, min: 1 },
        C: { name: 'concentration', q: 'concentration', unit: 'M', value: 0.3 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Dilute, ideal solutions. Always zero or negative.',
      stories: {
        psis: 'What is the solute potential of {C} sucrose at {T}?',
        C: 'Potato cylinders neither gain nor lose mass in sucrose at {T} when their water potential is {psis}. What sucrose concentration is that?'
      }
    },
    {
      name: 'Water potential of air',
      expr: 'psi = R*T/Vw*ln(RH)', tex: '\\psi = \\dfrac{RT}{\\bar{V}_w}\\ln \\mathrm{RH}',
      vars: {
        psi: { name: 'water potential of the air', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 },
        Vw: { name: 'molar volume of water', q: 'molarvolume', unit: 'cm³/mol', value: 18, fixed: true, tex: '\\bar{V}_w' },
        RH: { name: 'relative humidity', q: 'ratio', unit: '%', value: 50, min: 0.1, max: 100, tex: '\\mathrm{RH}' }
      },
      note: 'Saturated air (100 %) has ψ = 0; even 99 % relative humidity is about −1.4 MPa.',
      stories: { psi: 'What is the water potential of air at {RH} relative humidity and {T}?', RH: 'At {T}, what relative humidity has a water potential of {psi}?' }
    },
    {
      name: 'Gravitational water potential',
      expr: 'psig = rhoW*g*h', tex: '\\psi_g = \\rho_w g h',
      vars: {
        psig: { name: 'gravitational component', q: 'pressure', unit: 'MPa', tex: '\\psi_g' },
        rhoW: { const: 'rhoW' }, g: { const: 'g' },
        h: { name: 'height above the reference level', q: 'length', unit: 'm', value: 40 }
      },
      note: 'About 0.01 MPa per metre: water at the top of a 100 m redwood needs 1 MPa of extra tension just to be held up.',
      stories: { psig: 'By how much does gravity raise the water potential the xylem must overcome at the top of a {h} tree?', h: 'At what height does the gravitational term reach {psig}?' }
    }
  ],
  examples: [
    {
      title: 'Which way does the water go?',
      q: 'Cell A has ψs = −0.9 MPa and ψp = +0.5 MPa; neighbouring cell B has ψs = −0.6 MPa and ψp = +0.1 MPa. Which way does water move?',
      steps: ['A: $\\psi = -0.9 + 0.5 = -0.4$ MPa. B: $\\psi = -0.6 + 0.1 = -0.5$ MPa.', 'Water moves from higher to lower: from A to B — even though A has more solutes.'],
      a: 'From A (−0.4 MPa) to B (−0.5 MPa).'
    },
    {
      title: 'Potato cylinders',
      q: 'Potato cylinders keep their mass in 0.28 M sucrose at 20 °C. What is the water potential of the potato cells?',
      steps: ['$\\psi_s = -iCRT = -1 \\times 280\\ \\mathrm{mol/m^3} \\times 8.314 \\times 293.15 = -6.8\\times10^5$ Pa.', 'At equilibrium the tissue\'s ψ equals the solution\'s: −0.68 MPa.'],
      a: 'About −0.68 MPa.'
    },
    {
      title: 'Why leaves lose water',
      q: 'A leaf\'s cells are at −1.0 MPa. What is the water potential of air at 50 % relative humidity and 20 °C?',
      steps: ['$RT/\\bar{V}_w = 8.314 \\times 293.15 / 18\\times10^{-6} = 1.354\\times10^8$ Pa.', '$\\psi = 1.354\\times10^8 \\times \\ln 0.5 = -9.4\\times10^7$ Pa = −94 MPa.', 'The gradient from leaf to air is nearly a hundred times the one from soil to leaf: evaporation drives the whole flow.'],
      a: 'About −94 MPa, far below the leaf\'s −1 MPa.'
    }
  ],
  quiz: [
    { q: 'Water moves from a cell with ψ = −0.3 MPa into one with ψ = −0.7 MPa.', a: true, why: '−0.3 is the higher (less negative) water potential; water moves down the gradient to −0.7.' },
    { q: 'A plant cell has ψs = −1.2 MPa and ψp = +0.5 MPa. What is its water potential, in MPa?', answer: -0.7, unit: 'MPa', why: 'ψ = −1.2 + 0.5 = −0.7 MPa.' },
    { q: 'At incipient plasmolysis…', choices: ['ψp = 0', 'ψs = 0', 'ψ = 0', 'ψp = ψs'], a: 0, why: 'The protoplast just touches the wall without pressing on it, so the turgor is zero and ψ = ψs.' },
    { q: 'Why does a plant cell not burst in pure water?', choices: ['its sap has no solutes', 'the cell wall resists expansion, raising ψp until ψ inside equals zero', 'plant membranes are impermeable to water', 'the vacuole pumps water out'], a: 1, why: 'The wall builds up turgor pressure; when ψs + ψp = 0 there is no net inflow.' },
    { q: 'Fertiliser spilled heavily around a plant\'s roots can make it wilt, because…', choices: ['the soil water\'s ψ rises', 'the soil water\'s ψ falls below that of the root cells, so water stops entering or leaves', 'fertiliser blocks the xylem', 'the root cells gain too much water'], a: 1, why: 'Dissolved salts lower the soil water\'s solute potential; when it drops below the roots\' ψ, the gradient reverses — "fertiliser burn".' }
  ],
  problems: [
    { q: 'What is the solute potential of 0.5 M sucrose at 25 °C, in MPa?', answer: -1.24, unit: 'MPa', tol: 0.02, steps: ['$\\psi_s = -iCRT = -500 \\times 8.314 \\times 298.15 = -1.24\\times10^6$ Pa.'] },
    { q: 'What sucrose concentration (in M) has a water potential of −0.73 MPa at 20 °C?', answer: 0.3, unit: 'M', tol: 0.02, steps: ['$C = -\\psi_s/(iRT) = 7.3\\times10^5/(8.314 \\times 293.15) = 300\\ \\mathrm{mol/m^3}$ = 0.30 M.'] }
  ],
  applications: [
    'Irrigation and salinity: salty soil water has a low ψ, so crops struggle to take it up; salt-tolerant crops accumulate solutes to lower their own ψ.',
    'Plant physiologists measure leaf ψ with a pressure chamber to judge drought stress and schedule watering.',
    'Stomata open and close as guard cells take up or lose K⁺, changing their ψ and turgor.',
    'Food preservation, crisping lettuce in cold water, and the shrivelling of salted vegetables.'
  ],
  history: 'Wilhelm Pfeffer measured osmotic pressure with membranes in clay pots (1877), and Hugo de Vries used plasmolysis of plant cells to compare solutions (1884). Henry Dixon and John Joly proposed the cohesion–tension theory of the rise of sap in 1894. The modern concept of water potential was set out by Ralph Slatyer and Sterling Taylor in 1960, and Per Scholander\'s pressure chamber (1965) made it measurable in the field.',
  sim: { id: 'cell-osmosis', params: { mode: 'plant' } }
},

{
  id: 'active-transport', parent: 'membranes', title: 'Active transport and pumps', level: 2,
  short: 'Moving a substance against its concentration or electrical gradient costs energy. Pumps spend ATP directly — the Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in per ATP — and co-transporters spend the gradients the pumps build.',
  keywords: ['active transport', 'pump', 'sodium–potassium pump', 'Na+/K+-ATPase', 'ATPase', 'electrogenic', 'primary active transport', 'secondary active transport', 'symport', 'antiport', 'co-transport', 'SGLT1', 'sodium–calcium exchanger', 'proton pump', 'ABC transporter', 'ouabain', 'digoxin', 'oral rehydration', 'electrochemical gradient'],
  prereq: ['diffusion-osmosis', 'atp-energy', 'bioenergetics'],
  related: ['membrane-structure', 'oxidative-phosphorylation', 'phloem-transport', 'osmoregulation', 'chemistry:nernst-equation', 'medicine:membrane-potential', 'medicine:action-potential', 'medicine:digestion-absorption', 'medicine:how-drugs-work'],
  body: `
Diffusion only ever runs downhill. Yet a cell keeps potassium thirty times more concentrated inside than out, sodium ten times less, and free calcium ten thousand times less; a root cell piles up nitrate from dilute soil water; the stomach lining pumps acid to a million times the concentration of hydrogen ions in blood. Moving a substance **against** its gradient takes energy, and the proteins that do it are **pumps**: this is **active transport**.

| Ion | Outside a cell (mM) | Inside (mM) |
|---|---|---|
| Na⁺ | 145 | 12 |
| K⁺ | 4 | 140 |
| Ca²⁺ (free) | 1.2 | 0.0001 |
| Cl⁻ | 110 | 10–30 |

### Primary active transport: the Na⁺/K⁺ pump
The **sodium–potassium pump** (Na⁺/K⁺-ATPase), discovered by Jens Skou in 1957 in crab nerves, is the best known. In each cycle it:

1. binds **3 Na⁺** from the cytoplasm;
2. splits ATP and is **phosphorylated** on an aspartate, which snaps it into an outward-facing shape;
3. releases the 3 Na⁺ outside and binds **2 K⁺**;
4. loses the phosphate, flips back and releases the 2 K⁺ inside.

**3 Na⁺ out, 2 K⁺ in, one ATP** — around a hundred cycles a second for each pump. Because it carries one net positive charge out per cycle it is **electrogenic**, making the inside a few millivolts more negative directly; its bigger contribution is the gradients themselves, on which the resting potential and every nerve impulse depend ([[medicine:membrane-potential|membrane potential]]). The pump uses roughly a fifth to a quarter of all the ATP a resting person makes, and more than half of the brain's. The plant toxin ouabain and the heart medicine digoxin block it. Watch its cycle in the simulation below.

Relatives in the same family (**P-type ATPases**) pump Ca²⁺ from the cytosol into the ER (SERCA, 2 Ca²⁺ per ATP) and H⁺ out of plant and fungal cells, building membrane potentials of −120 to −200 mV. **V-type** proton pumps acidify lysosomes and plant vacuoles. **ABC transporters** pump a huge variety of molecules — including, in cancer cells, the very drugs meant to kill them (multidrug resistance).

### The energy bill
The free energy needed to move one mole of an ion from side 1 to side 2 has a concentration part and an electrical part:

$$\\Delta G = RT\\ln\\frac{C_2}{C_1} + zF\\,\\Delta V$$

For Na⁺ leaving a cell (12 → 145 mM, from −70 mV inside to 0 outside) at 37 °C: $2.58\\ln(145/12) + 96.5\\times0.070 = 6.4 + 6.8 = 13.2$ kJ/mol. For K⁺ entering (4 → 140 mM, but from 0 to −70 mV, which helps): $2.58\\ln 35 - 6.8 = 2.4$ kJ/mol. One cycle needs $3\\times13.2 + 2\\times2.4 = 44$ kJ per mole — a little less than the 50–60 kJ/mol that ATP supplies in a cell. The pump runs close to its thermodynamic limit.

### Secondary active transport: riding the sodium gradient
The Na⁺ gradient is stored energy, and cells spend it to pull other things uphill. A **symporter** moves two things the same way, an **antiporter** in opposite directions.

| Transporter | Kind | Moves | Where and why |
|---|---|---|---|
| SGLT1 | symport | 2 Na⁺ + 1 glucose in | gut and kidney: absorbs glucose even when little is left |
| Na⁺/Ca²⁺ exchanger | antiport | 3 Na⁺ in, 1 Ca²⁺ out | heart muscle: lowers Ca²⁺ between beats |
| Na⁺/H⁺ exchanger | antiport | 1 Na⁺ in, 1 H⁺ out | nearly every cell: controls pH |
| H⁺–sucrose symporter | symport | 1 H⁺ + 1 sucrose in | plants: loads sugar into the phloem, driven by the proton pump ([[phloem-transport]]) |

With two Na⁺ per glucose and a membrane potential of −70 mV, SGLT1 can in principle concentrate glucose some 27 000-fold. **Oral rehydration solution** — clean water with a little salt and glucose — works because SGLT1 keeps pulling sodium and glucose, and the water that follows them, out of the gut even in cholera, when other routes fail; it has saved millions of lives. Digoxin works on the same coupling in reverse: blocking the Na⁺/K⁺ pump lets Na⁺ build up inside heart cells, the Na⁺/Ca²⁺ exchanger then removes less Ca²⁺, and each beat is stronger.

> [!warn] Severe dehydration — very little urine, intense thirst, drowsiness or confusion, cold hands and feet — is an emergency, especially in babies and older people: call your local emergency number.

> [!key] Primary active transport spends ATP directly (the Na⁺/K⁺ pump: 3 out, 2 in, per ATP). Secondary active transport spends a gradient that a pump has built. Channels and carriers without an energy source can only let things run downhill.
`,
  ideas: [
    'Active transport moves substances against their electrochemical gradient and needs an energy source.',
    'The Na⁺/K⁺ pump moves 3 Na⁺ out and 2 K⁺ in for each ATP, going through phosphorylated shapes that face in and out alternately.',
    'The energy to move an ion is ΔG = RT ln(C₂/C₁) + zFΔV: a concentration part and an electrical part.',
    'Secondary active transport (symport and antiport) uses the Na⁺ or H⁺ gradient built by pumps, e.g. SGLT1 takes up glucose with 2 Na⁺.',
    'Pumps are a major energy cost: about a quarter of resting ATP use goes to the Na⁺/K⁺ pump.'
  ],
  pitfalls: [
    'The Na⁺/K⁺ pump makes the resting potential by itself — Its direct electrogenic effect is only a few millivolts; the resting potential comes mostly from K⁺ leaking out through channels down the gradient the pump built.',
    'Secondary active transport uses no energy — It uses no ATP directly, but it spends the energy stored in an ion gradient, which pumps paid for with ATP. Stop the pumps and it runs down.',
    'Active transport is just faster diffusion — It is a different kind of process: it can move a substance from low to high concentration, which diffusion never does.'
  ],
  formulas: [
    {
      name: 'Free energy to move an ion across a membrane',
      expr: 'dG = R*T*ln(C2/C1) + z*F*dV', tex: '\\Delta G = RT\\ln\\dfrac{C_2}{C_1} + zF\\,\\Delta V',
      vars: {
        dG: { name: 'free energy per mole moved from side 1 to side 2', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        C1: { name: 'concentration on the starting side', q: 'concentration', unit: 'mM', value: 12, tex: 'C_1' },
        C2: { name: 'concentration on the destination side', q: 'concentration', unit: 'mM', value: 145, tex: 'C_2' },
        z: { name: 'charge of the ion', int: true, signed: true, value: 1 },
        F: { const: 'F' },
        dV: { name: 'potential of side 2 minus side 1', q: 'voltage', unit: 'mV', value: 70, signed: true, tex: '\\Delta V' }
      },
      note: 'Positive ΔG: the move needs energy (active transport); negative: it can happen by itself (diffusion through a channel). The default values are Na⁺ leaving a cell whose inside is at −70 mV.',
      practice: { unknowns: ['dG', 'C2', 'dV'] },
      stories: {
        dG: 'How much free energy does it take to move Na⁺ out of a cell, from {C1} inside to {C2} outside, when the outside is {dV} above the inside, at {T}?',
        C2: 'With {dG} available per mole, up to what concentration can a pump push an ion (charge {z}) from {C1} against a potential difference of {dV}?'
      }
    },
    {
      name: 'Nernst equilibrium potential',
      expr: 'E = R*T/(z*F)*ln(Co/Ci)', tex: 'E = \\dfrac{RT}{zF}\\ln\\dfrac{C_{\\mathrm{out}}}{C_{\\mathrm{in}}}',
      vars: {
        E: { name: 'equilibrium potential (inside relative to outside)', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        z: { name: 'charge of the ion', int: true, signed: true, value: 1 },
        F: { const: 'F' },
        Co: { name: 'concentration outside', q: 'concentration', unit: 'mM', value: 4, tex: 'C_{\\mathrm{out}}' },
        Ci: { name: 'concentration inside', q: 'concentration', unit: 'mM', value: 140, tex: 'C_{\\mathrm{in}}' }
      },
      note: 'The membrane potential at which an ion is in equilibrium: no net flow through its channels. At 37 °C RT/F = 26.7 mV. K⁺ about −95 mV, Na⁺ about +67 mV.',
      stories: { E: 'An ion of charge {z} is at {Co} outside a cell and {Ci} inside. What is its equilibrium potential at {T}?', Ci: 'A cell sits at the K⁺ equilibrium potential of {E} with {Co} outside. What is the K⁺ concentration inside?' }
    },
    {
      name: 'How far a Na⁺ symporter can concentrate its cargo',
      expr: 'A = (No/Ni)^n*exp(-n*F*Vm/(R*T))', tex: 'A = \\left(\\dfrac{\\mathrm{[Na^+]}_o}{\\mathrm{[Na^+]}_i}\\right)^{n} \\exp\\left(-\\dfrac{nFV_m}{RT}\\right)',
      vars: {
        A: { name: 'maximum ratio of cargo inside to outside' },
        No: { name: 'Na⁺ outside', q: 'concentration', unit: 'mM', value: 145, tex: '\\mathrm{[Na^+]}_o' },
        Ni: { name: 'Na⁺ inside', q: 'concentration', unit: 'mM', value: 12, tex: '\\mathrm{[Na^+]}_i' },
        n: { name: 'Na⁺ ions carried with each cargo molecule', int: true, value: 2, min: 1 },
        F: { const: 'F' },
        Vm: { name: 'membrane potential (inside relative to outside)', q: 'voltage', unit: 'mV', value: -70, signed: true, tex: 'V_m' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'For an uncharged cargo such as glucose, at equilibrium of the transporter; real cells reach far less because the cargo also leaks out.',
      stories: { A: 'SGLT1 carries {n} Na⁺ with each glucose. With Na⁺ at {No} outside and {Ni} inside and a membrane potential of {Vm}, how many times more concentrated can glucose become inside?' }
    }
  ],
  examples: [
    {
      title: 'The energy bill for one pump cycle',
      q: 'Using the concentrations in the table, a membrane potential of −70 mV and 37 °C, how much energy does one mole of Na⁺/K⁺ pump cycles need? Compare with ATP (about 55 kJ/mol in a cell).',
      steps: [
        '$RT = 8.314 \\times 310 = 2.58$ kJ/mol; $F\\times0.070\\ \\mathrm{V} = 6.75$ kJ/mol.',
        '3 Na⁺ out: $3[2.58\\ln(145/12) + 6.75] = 3 \\times 13.2 = 39.5$ kJ.',
        '2 K⁺ in: $2[2.58\\ln(140/4) - 6.75] = 2 \\times 2.4 = 4.8$ kJ.',
        'Total 44 kJ per mole of cycles, from about 55 kJ of ATP: some 80 % of the energy ends up in the gradients.'
      ],
      a: 'About 44 kJ/mol — roughly 80 % of what the ATP provides.'
    },
    {
      title: 'Equilibrium potentials of K⁺ and Na⁺',
      q: 'Find the Nernst potentials of K⁺ (4 mM out, 140 mM in) and Na⁺ (145 mM out, 12 mM in) at 37 °C.',
      steps: ['$RT/F = 26.7$ mV.', 'K⁺: $26.7\\ln(4/140) = 26.7 \\times (-3.56) = -95$ mV.', 'Na⁺: $26.7\\ln(145/12) = 26.7 \\times 2.49 = +67$ mV.', 'A resting cell (−70 mV) lies near the K⁺ potential because it is mostly permeable to K⁺; both ions leak towards their own equilibrium, and the pump undoes the leak.'],
      a: 'E(K⁺) ≈ −95 mV, E(Na⁺) ≈ +67 mV.'
    },
    {
      title: 'How far SGLT1 can concentrate glucose',
      q: 'SGLT1 carries 2 Na⁺ with each glucose. With Na⁺ at 145 mM outside and 12 mM inside, and −70 mV across the membrane, what is the largest possible glucose ratio inside : outside?',
      steps: ['Concentration term: $(145/12)^2 = 146$.', 'Electrical term: $\\exp(2 \\times 96\\,485 \\times 0.070/2578) = e^{5.24} = 188$.', '$A = 146 \\times 188 \\approx 27\\,000$.'],
      a: 'About 27 000 times — enough to take up practically every glucose molecule in the gut.'
    }
  ],
  quiz: [
    { q: 'For each ATP it splits, the Na⁺/K⁺ pump moves…', choices: ['2 Na⁺ out and 3 K⁺ in', '3 Na⁺ out and 2 K⁺ in', '3 Na⁺ in and 2 K⁺ out', '1 Na⁺ out and 1 K⁺ in'], a: 1, why: 'Three sodium out, two potassium in: one net positive charge leaves per cycle, so the pump is electrogenic.' },
    { q: 'A cell runs out of ATP. What happens to glucose uptake by SGLT1?', choices: ['nothing: SGLT1 uses no ATP', 'it slows and stops as the Na⁺ gradient runs down', 'it reverses immediately', 'it speeds up'], a: 1, why: 'SGLT1 spends the Na⁺ gradient, which the ATP-driven pump maintains. Without ATP the gradient dissipates and so does uptake.' },
    { q: 'The Na⁺/K⁺ pump moves net positive charge out of the cell.', a: true, why: 'Three positive charges out, two in: one net charge per cycle — it is electrogenic.' },
    { q: 'What is the Nernst potential of K⁺ at 37 °C with 5 mM outside and 150 mM inside, in mV?', answer: -90.9, unit: 'mV', why: '26.7 mV × ln(5/150) = 26.7 × (−3.40) = −90.9 mV.' },
    { q: 'Which is secondary active transport?', choices: ['O₂ crossing the bilayer', 'glucose entering red cells through GLUT1', 'glucose entering gut cells with Na⁺ through SGLT1', 'the Na⁺/K⁺ pump'], a: 2, why: 'SGLT1 couples uphill glucose movement to downhill Na⁺ movement. GLUT1 is facilitated diffusion; the pump is primary active transport.' }
  ],
  problems: [
    { q: 'How much free energy (kJ/mol) does it take to move Ca²⁺ out of a cell at 37 °C, from 0.0001 mM inside (at −70 mV) to 1.2 mM outside (at 0 mV)?', answer: 37.7, unit: 'kJ/mol', tol: 0.02, steps: ['Concentration part: $2.579 \\times \\ln(12\\,000) = 2.579 \\times 9.39 = 24.2$ kJ/mol.', 'Electrical part: $zF\\Delta V = 2 \\times 96.485 \\times 0.070 = 13.5$ kJ/mol.', 'Total 37.7 kJ/mol — which is why a Ca²⁺ pump moves only one or two ions per ATP.'] }
  ],
  applications: [
    'Oral rehydration therapy for diarrhoeal disease, which relies on Na⁺–glucose co-transport.',
    'Heart medicines (digoxin) and the diuretics that block kidney co-transporters; SGLT2 inhibitors that make the kidney pass glucose, used in diabetes and heart failure.',
    'Proton-pump inhibitors, which block the H⁺/K⁺ pump of the stomach to reduce acid.',
    'Multidrug resistance of cancer cells and bacteria through ABC efflux pumps.'
  ],
  history: 'Jens Skou found the Na⁺/K⁺-ATPase in crab nerve membranes in 1957 and shared the 1997 Nobel Prize in Chemistry for it. Robert Crane proposed Na⁺–glucose co-transport in 1960. The success of oral rehydration against cholera, proven in field trials in Bangladesh and India around 1968–1971, rested on that discovery.',
  sim: 'cell-pump'
},

{
  id: 'endocytosis', parent: 'membranes', title: 'Endocytosis and exocytosis', level: 2,
  short: 'Cells move large things across the membrane in bulk, wrapped in vesicles: endocytosis folds the membrane inwards to take material in (phagocytosis, pinocytosis, receptor-mediated uptake through clathrin-coated pits), and exocytosis fuses vesicles with the membrane to release their contents.',
  keywords: ['endocytosis', 'exocytosis', 'phagocytosis', 'pinocytosis', 'receptor-mediated endocytosis', 'clathrin', 'coated pit', 'dynamin', 'LDL receptor', 'endosome', 'lysosome', 'transcytosis', 'SNARE', 'secretion', 'regulated exocytosis', 'synaptic vesicle', 'macrophage'],
  prereq: ['membrane-structure', 'endomembrane', 'cytoskeleton'],
  related: ['active-transport', 'animal-immunity', 'viruses', 'medicine:innate-immunity', 'medicine:synapses', 'medicine:cholesterol-lipids'],
  body: `
Some things are too big for any channel or carrier — a bacterium, a gulp of fluid full of proteins, a cholesterol-carrying particle, a batch of hormone or neurotransmitter. Cells move them in and out in bulk, wrapped in membrane: **endocytosis** brings material in by folding the plasma membrane inwards into a vesicle, and **exocytosis** sends it out when a vesicle fuses with the plasma membrane. Both cost energy, and together they keep the plasma membrane in balance: what exocytosis adds, endocytosis takes back ([[endomembrane]]).

### Three ways in
- **Phagocytosis** ("cell eating"): the cell pushes out arms of membrane, driven by actin, around a particle larger than about 0.5 µm and swallows it into a phagosome, which then fuses with lysosomes. Amoebae feed this way; in us macrophages and neutrophils eat bacteria and debris, and the macrophages of the spleen and liver dispose of some 200 billion worn-out red cells every day.
- **Pinocytosis** ("cell drinking"): small vesicles and larger ruffles take in gulps of the surrounding fluid with whatever is dissolved in it. A macrophage drinks about a quarter of its own volume every hour, and takes in an area of membrane equal to its whole surface in about half an hour — returning it just as fast.
- **Receptor-mediated endocytosis**: receptors gather their particular cargo into **clathrin-coated pits**, dimples 100–150 nm across lined with a basket of the protein clathrin, which cover about 2 % of a typical cell's surface. Each pit pinches off within a minute or so — the protein dynamin wrings its neck — and concentrates the cargo more than a thousandfold compared with drinking the fluid. Cholesterol enters cells this way, carried in LDL particles about 22 nm across that bind the **LDL receptor**; iron enters bound to transferrin. Many viruses, influenza among them, and several toxins hijack the same route ([[viruses]]).

### Sorting inside: endosomes
The vesicles shed their coats and merge into **early endosomes**, mildly acidic (pH about 6–6.5), where receptors and cargo part company. Receptors go back to the surface to be used again — an LDL receptor makes the round trip every ten minutes or so, hundreds of times in its life — while the cargo moves on as the endosome matures (pH about 5.5) and joins lysosomes (pH 4.5–5) to be digested. The rising acidity is itself a signal: it makes iron fall off transferrin, and it triggers influenza's fusion protein to fuse the viral envelope with the endosome membrane.

### Exocytosis
- **Constitutive** exocytosis runs all the time in every cell, delivering new membrane proteins and lipids and secreting proteins such as collagen and antibodies.
- **Regulated** exocytosis waits for a signal, usually a rise in Ca²⁺ inside the cell: insulin from pancreatic β-cells when blood glucose rises, digestive enzymes from the pancreas, and neurotransmitter from nerve endings, where synaptic vesicles 40 nm across fuse within a fraction of a millisecond of calcium entering ([[medicine:synapses|synapses]]).

Fusion is driven by **SNARE** proteins — one on the vesicle, two on the target membrane — that twist together into a tight bundle and pull the two bilayers into one. Botulinum and tetanus toxins are enzymes that cut SNAREs, which is why they paralyse. In **transcytosis** a vesicle crosses a whole cell: antibodies from a mother's blood reach the fetus across the placenta this way.

> [!key] Endocytosis folds membrane in (phagocytosis, pinocytosis, receptor-mediated uptake through clathrin-coated pits); exocytosis fuses vesicles out (all the time, or when Ca²⁺ rises). Receptors are recycled; cargo goes on to lysosomes.
`,
  ideas: [
    'Endocytosis and exocytosis move large molecules, particles and fluid across the membrane in vesicles, at a cost in energy.',
    'Phagocytosis engulfs particles; pinocytosis takes in fluid; receptor-mediated endocytosis concentrates specific cargo in clathrin-coated pits.',
    'Endosomes sort cargo from receptors: receptors recycle to the surface, cargo goes to lysosomes, and acidity drives the sorting.',
    'Exocytosis is constitutive or regulated (triggered by Ca²⁺); SNARE proteins fuse the vesicle with the plasma membrane.'
  ],
  pitfalls: [
    'Endocytosed material is inside the cytoplasm — It is inside a vesicle, still separated from the cytosol by a membrane; it enters the cytosol only if it (or a virus) crosses that membrane later.',
    'Endocytosis steadily shrinks the plasma membrane — Membrane taken in is returned by exocytosis at the same rate; a macrophage cycles its whole surface every half hour without changing size.',
    'Receptors are digested along with their cargo — Most receptors (LDL, transferrin) are separated in the endosome and recycled hundreds of times.'
  ],
  formulas: [
    {
      name: 'Time to take in a cell\'s whole surface',
      expr: 't = A/(n*pi*d^2)', tex: 't = \\dfrac{A}{n\\,\\pi d^2}',
      vars: {
        t: { name: 'time to internalise an area equal to the surface', q: 'time', unit: 'min' },
        A: { name: 'surface area of the cell', q: 'area', unit: 'µm²', value: 1000 },
        n: { name: 'vesicles formed per minute', q: 'rate', unit: '1/min', value: 1000 },
        d: { name: 'vesicle diameter', q: 'length', unit: 'nm', value: 100 }
      },
      note: 'Each vesicle removes πd² of membrane. Exocytosis returns it at the same rate.',
      stories: { t: 'A cell with a surface of {A} forms {n} endocytic vesicles {d} across. How long until it has taken in its whole surface?', n: 'A macrophage with {A} of surface internalises it all in {t} using vesicles {d} across. How many vesicles a minute is that?' }
    },
    {
      name: 'Molecules in a vesicle',
      expr: 'N = c*NA*pi*d^3/6', tex: 'N = c\\,N_A\\,\\dfrac{\\pi d^3}{6}',
      vars: {
        N: { name: 'number of molecules' },
        c: { name: 'concentration inside the vesicle', q: 'concentration', unit: 'M', value: 0.5 },
        NA: { const: 'NA' },
        d: { name: 'inner diameter of the vesicle', q: 'length', unit: 'nm', value: 30 }
      },
      note: 'A synaptic vesicle (about 40 nm outside, 30 nm inside) holds a few thousand transmitter molecules — one "quantum" of release.',
      stories: { N: 'A synaptic vesicle with an inner diameter of {d} holds transmitter at {c}. How many molecules does it release?', c: 'A vesicle {d} across holds {N} molecules. What is their concentration?' }
    }
  ],
  examples: [
    {
      title: 'A macrophage recycles its surface',
      q: 'A macrophage with 1000 µm² of surface internalises 3 % of it each minute in vesicles 100 nm across. How many vesicles a minute, and how long for the whole surface?',
      steps: ['Area per minute: $0.03 \\times 1000 = 30\\ \\mathrm{\\mu m^2}$.', 'Area per vesicle: $\\pi \\times (0.1\\ \\mathrm{\\mu m})^2 = 0.0314\\ \\mathrm{\\mu m^2}$, so $30/0.0314 \\approx 950$ vesicles a minute — about 16 a second.', 'Whole surface: $1000/30 \\approx 33$ minutes.'],
      a: 'About 950 vesicles a minute; the whole surface every half hour.'
    },
    {
      title: 'One quantum of neurotransmitter',
      q: 'A synaptic vesicle has an inner diameter of 30 nm and holds acetylcholine at about 0.5 M. How many molecules does it release when it fuses?',
      steps: ['Volume: $\\pi d^3/6 = \\pi (3\\times10^{-8})^3/6 = 1.41\\times10^{-23}\\ \\mathrm{m^3}$.', '$N = 500\\ \\mathrm{mol/m^3} \\times 6.02\\times10^{23} \\times 1.41\\times10^{-23} \\approx 4300$.'],
      a: 'About 4000 molecules — close to the size of the "quanta" measured at nerve–muscle junctions.'
    }
  ],
  quiz: [
    { q: 'A neutrophil engulfing a bacterium is an example of…', choices: ['pinocytosis', 'phagocytosis', 'exocytosis', 'facilitated diffusion'], a: 1, why: 'Engulfing a particle larger than about 0.5 µm with pseudopodia is phagocytosis.' },
    { q: 'After LDL is taken in by receptor-mediated endocytosis, the LDL receptor is…', choices: ['digested with the LDL in a lysosome', 'separated in the endosome and recycled to the surface', 'secreted from the cell', 'kept in the nucleus'], a: 1, why: 'The acidic endosome releases the LDL; the receptor returns to the surface, making hundreds of trips.' },
    { q: 'Release of neurotransmitter by exocytosis is triggered by a rise in calcium ions inside the nerve ending.', a: true, why: 'An action potential opens Ca²⁺ channels; Ca²⁺ binds sensors on the vesicles and triggers SNARE-driven fusion within a fraction of a millisecond.' },
    { q: 'A cell forms 1200 vesicles of 100 nm per minute. How many minutes until it has internalised 1500 µm² of membrane?', answer: 39.8, unit: 'min', why: 'Each vesicle takes π × 0.1² = 0.0314 µm²; 1500/(1200 × 0.0314) ≈ 39.8 min.' },
    { q: 'Why doesn\'t continuous endocytosis shrink the plasma membrane?', choices: ['the vesicles are too small to matter', 'exocytosis returns membrane at the same rate', 'the membrane is made again from scratch every minute', 'endocytosis takes only proteins, not lipids'], a: 1, why: 'Membrane cycles in and out; the amount taken in by endocytosis is balanced by vesicles fusing back.' }
  ],
  problems: [
    { q: 'How many molecules are in a vesicle with an inner diameter of 50 nm holding a solute at 100 mM?', answer: 3940, tol: 0.03, steps: ['Volume: $\\pi (5\\times10^{-8})^3/6 = 6.54\\times10^{-23}\\ \\mathrm{m^3}$.', '$N = 100 \\times 6.022\\times10^{23} \\times 6.54\\times10^{-23} \\approx 3940$.'] }
  ],
  applications: [
    'Familial hypercholesterolaemia: people with faulty LDL receptors cannot clear LDL from the blood and have high cholesterol from birth; statins work partly by making liver cells display more LDL receptors.',
    'Delivering medicines and nanoparticles into cells, which usually enter by endocytosis and must then escape the endosome.',
    'How viruses and toxins get in, and why some antiviral strategies target endosome acidification or fusion.',
    'Botulinum toxin, used in minute medical doses to relax overactive muscles because it blocks SNARE-driven release of acetylcholine.'
  ],
  history: 'Élie Metchnikoff discovered phagocytosis in starfish larvae in 1882 and founded the study of innate immunity (Nobel Prize 1908). Michael Brown and Joseph Goldstein worked out receptor-mediated endocytosis of LDL in the 1970s while studying familial hypercholesterolaemia (Nobel Prize 1985). The machinery of vesicle fusion earned James Rothman, Randy Schekman and Thomas Südhof the 2013 Nobel Prize.',
  sim: { id: 'cell-endomembrane', params: { endo: true } }
}

);
