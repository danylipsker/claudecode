/* HYPER-WATER · content/the-sculptor-inside-every-cell.js — the topic "The sculptor inside every cell" (branch Water in Life).
 * Twelve concepts: water as the matrix of life, how much of us it is, what it does to proteins (hydration shells, the
 * hydrophobic effect), membranes and DNA, water as a reagent, proton wires, aquaporins, osmosis, blood and the daily
 * budget, and life's start in water. The simulations are in sims/the-sculptor-inside-every-cell.js (ids cell-…).
 * Sources: Ball, PNAS 114, 13327 (2017) for the argument of the first page and the shape of the rest; NASA JPL (2017)
 * for the vent chemistry of Enceladus; standard biochemistry, cell biology and physiology texts for the numbers.
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'the-matrix-of-life', parent: 'the-sculptor-inside-every-cell', title: 'The matrix of life', level: 1,
  short: 'Ninety-nine of every hundred molecules in a cell are water, and for most of a century biology treated them as the stage. Szent-Györgyi called water the matrix of life, and Philip Ball\'s 2017 argument is that the phrase is literal: water is an active participant, a structured liquid and a reagent, in everything the cell does.',
  keywords: ['matrix of life', 'Szent-Györgyi', 'Philip Ball', 'cytoplasm', 'crowding', 'macromolecular crowding', 'water in the cell', 'active matrix', 'protic', 'polar solvent', 'hydration water', 'bulk water', '99 percent'],
  prereq: ['what-a-hydrogen-bond-is', 'the-structure-of-liquid-water', 'biology:water-in-life'],
  related: ['how-much-water-we-are', 'hydration-shells-and-proteins', 'water-as-a-reagent', 'water-the-amphoteric', 'the-hydrophobic-effect', 'chemistry:hydrogen-bonding', 'biology:protein-structure'],
  body: `
Take a bacterium one micrometre long and count what is inside it. There are about 3 million protein molecules, a few hundred million small molecules and ions, and about **twenty thousand million water molecules**. For every protein there are some seven thousand waters; for every molecule of anything else, about a hundred. In a human cell the proportions are the same. Ninety-nine of every hundred molecules in a living cell are water, yet textbooks of cell biology spend their pages on the other one.

### A phrase and an argument
Albert Szent-Györgyi, the Hungarian biochemist who won the 1937 Nobel Prize for vitamin C and muscle chemistry, called water the **matrix of life**. For decades that sounded like a poetic way of saying that cells need a solvent. In 2017 Philip Ball, in a paper in *PNAS* (source 9), made the case that it is literal. Water is not a mystical life-giver and it is not a passive filler either: it is an **active participant**, in three ways.

1. **A structured liquid.** Each molecule makes about 3.7 hydrogen bonds, broken and re-made every picosecond ([[what-a-hydrogen-bond-is]]). That network senses and answers the surfaces it touches.
2. **A reagent.** Water is polar, protic (it can give a proton) and amphoteric (it can also take one, [[water-the-amphoteric]]). It is split, made, added and removed in the reactions of the cell ([[water-as-a-reagent]]).
3. **A shaper.** Near a protein, a membrane or a strand of DNA the water is arranged differently from the water in a glass, and that arrangement helps fold the protein, close the membrane and hold the helix (the pages that follow).

### The crowded cell
| In a typical bacterium | By mass | By number of molecules |
|---|---|---|
| water | about 70 % | about 99 % |
| protein | about 15 % | about 0.01 % |
| RNA, DNA, lipid, sugar polymers | about 11 % | a fraction of 0.01 % |
| small molecules and ions | a few % | about 1 % |

Approximate figures, after standard cell-biology texts and Milo and Phillips, *Cell Biology by the Numbers*. The two columns do not disagree: a water molecule has a mass of 18, an average protein 50,000, so the water molecules are numerous and the proteins heavy.

The cytoplasm is not a thin soup. Macromolecules fill it to **300–400 g/L**, a quarter of the volume, so that neighbouring proteins are separated by only about 1.5 nm of water — five molecules wide. No water molecule in a cell is far from a surface. That is why the questions of the next pages (what does water do next to a protein?) are not about a rare corner of the cell but about nearly all of it.

### How different is the water?
Measurements by NMR, neutron scattering and terahertz spectroscopy agree on this picture. In the **first layer** against a protein, water rotates and diffuses two to three times more slowly than ordinary water. Beyond a layer or two it is, on the time scale of picoseconds, hardly distinguishable from the bulk. Of the order of a tenth to a quarter of cell water is in first layers; **most cell water is bulk-like**. The popular claim that cell water is an "exclusion zone" or a "fourth phase", or that "structured water" sold in bottles does anything, is not supported: the real perturbation is real but short-ranged and modest, and it is exactly what this topic explains.

> [!key] The cell is 99 % water by number and about 70 % by mass, packed so tightly with macromolecules that every water molecule is near a surface. Water is the matrix in Ball's sense: a structured liquid and a reagent that takes part in folding, assembly, catalysis and signalling rather than merely surrounding them.`,
  ideas: ['About 99 % of the molecules in a cell are water — roughly 70 % of its mass — because a water molecule is so light.', 'Szent-Györgyi\'s "matrix of life" was made precise by Ball (2017): water is a structured liquid and a polar, protic, amphoteric reagent, not a passive solvent.', 'Cytoplasm is crowded: 300–400 g/L of macromolecules leave gaps of only a few water molecules.', 'Water in the first layer on a surface is slowed by a factor of two or three; most cell water behaves like bulk water.'],
  pitfalls: ['"Water is just the solvent in which the real chemistry happens" — It takes part: it folds proteins, closes membranes, carries protons and is made and consumed by reactions.', '"Cell water is a special gel-like phase" — Only the first layer or two next to a surface is measurably different, and slowed by a factor of 2–3, not frozen; the rest behaves like ordinary water.', '"If 99 % of the molecules are water, the cell is 99 % water" — By number yes, by mass about 70 %: a protein weighs as much as thousands of water molecules.'],
  terms: [
    { term: 'Matrix of life', also: ['life\'s matrix'], def: 'Szent-Györgyi\'s name for water as the medium in which life is embedded; in Ball\'s 2017 sense, an active participant in the structure and chemistry of the cell rather than a passive filler.' },
    { term: 'Cytoplasm', also: ['cytosol'], def: 'The contents of a cell outside its nucleus (the cytosol is the fluid part): about 70 % water by mass and packed with 300–400 g/L of proteins, RNA and other macromolecules.' },
    { term: 'Macromolecular crowding', also: ['crowding', 'excluded volume effect'], def: 'The effect of a high concentration of large molecules, which take up a quarter of the cell volume and so leave less room for others: it speeds up association and favours compact shapes, and it keeps every water molecule near a surface.' },
    { term: 'Bulk water', also: ['free water'], def: 'Water far enough from any surface to behave like pure liquid water; in a cell this is still most of the water, though never more than a few molecules from a protein.' },
    { term: 'Protic solvent', also: ['protic'], def: 'A solvent with a hydrogen that can be given up as a proton. Water is the standard protic solvent, and also accepts protons, so it is amphoteric.' }
  ],
  formulas: [
    { name: 'The share of molecules that are water', expr: 'x = nw/(nw+ns)', tex: 'x_w = \\frac{n_w}{n_w + n_s}',
      vars: { x: { name: 'water share by number', q: 'ratio', unit: '%', tex: 'x_w' }, nw: { name: 'water, per litre of cell', q: 'concentration', unit: 'mol/L', value: 38.3, tex: 'n_w', hint: 'About 38 mol/L in cytoplasm: 690 g of water per litre (the cell is 1.05 kg/L and 66 % water by mass) divided by 18 g/mol.' }, ns: { name: 'everything else, per litre', q: 'concentration', unit: 'mol/L', value: 0.31, tex: 'n_s', hint: 'About 0.3 mol/L of small molecules and ions plus a few millimoles of macromolecules.' } },
      solveFor: 'x', note: 'Counting molecules, not mass. Pure water is 55.5 mol/L; a cell is mostly water, though less of it per litre.',
      stories: { x: 'A litre of cytoplasm holds {nw} of water and {ns} of everything else. What share of the molecules is water?', ns: 'Water makes up {x} of the molecules, with {nw} of it per litre. How much of everything else is there?' } },
    { name: 'Water molecules in a cell', expr: 'N = cw*Vc*NA*1e-18', tex: 'N = c_w\\,V_c\\,N_A \\times 10^{-18}',
      vars: { N: { name: 'water molecules' }, cw: { name: 'water concentration', q: 'concentration', unit: 'mol/L', value: 38.3, tex: 'c_w' }, Vc: { name: 'cell volume (µm³)', value: 1, min: 0, tex: 'V_c', hint: 'A bacterium is about 1 µm³ (1 femtolitre); a red blood cell 90 µm³; a liver cell about 5,000 µm³.' }, NA: { const: 'NA' } },
      solveFor: 'N', note: 'The factor 10⁻¹⁸ turns cubic micrometres into cubic metres.',
      stories: { N: 'A cell of {Vc} µm³ holds water at {cw}. How many water molecules is that?', Vc: 'A cell holds {N} water molecules at {cw}. What is its volume in cubic micrometres?' } },
    { name: 'Gap between neighbouring proteins', expr: 'd = (M/(c*NA))^(1/3)', tex: 'd = \\left(\\frac{M}{c\\,N_A}\\right)^{1/3}',
      vars: { d: { name: 'mean centre-to-centre spacing', q: 'length', unit: 'nm' }, M: { name: 'molar mass of the protein', q: 'molarmass', unit: 'g/mol', value: 50000, min: 1000, hint: 'A typical protein is 30–60 kDa.' }, c: { name: 'protein concentration', q: 'density', unit: 'g/L', value: 330, min: 1, hint: '300–400 g/L in cytoplasm; blood plasma has 70 g/L.' }, NA: { const: 'NA' } },
      solveFor: 'd', note: 'Each protein gets a cube of side d. Subtract the protein\'s own diameter (about 4.9 nm for 50 kDa) to get the water gap: 1.4 nm at 330 g/L.',
      stories: { d: 'Proteins of {M} fill a cell at {c}. How far apart are their centres on average?', c: 'Proteins of {M} sit {d} apart centre to centre. What is the concentration?' } },
    { name: 'The share of cell water in first layers', expr: 'f = h*cp/cw', tex: 'f = \\frac{h\\,c_p}{c_w}',
      vars: { f: { name: 'water in first layers', q: 'ratio', unit: '%' }, h: { name: 'water per gram of macromolecule', value: 0.35, min: 0, hint: '0.3–0.4 g/g is a full first layer on a small protein; less for big ones.' }, cp: { name: 'macromolecules', q: 'density', unit: 'g/L', value: 300, tex: 'c_p' }, cw: { name: 'water', q: 'density', unit: 'g/L', value: 690, tex: 'c_w' } },
      solveFor: 'f', note: 'An upper estimate, since not every macromolecule has a full layer; the answer is the "tenth to a quarter" quoted above.',
      stories: { f: 'Macromolecules at {cp} each hold {h} of water per gram in their first layer, in a cell with {cw} of water. What share of the water is in first layers?' } }
  ],
  examples: [
    { title: 'Counting a bacterium\'s water', q: 'A bacterium of 1 µm³ is 70 % water by mass at a density of 1.05 g/cm³. How many water molecules does it hold, and how many per protein if it has 3 million proteins?',
      steps: ['Mass of the cell: $1.05\\times10^{-12}$ g (1 µm³ = $10^{-12}$ cm³). Water: 70 %, or $0.735\\times10^{-12}$ g.', 'Moles: $0.735\\times10^{-12}/18.02 = 4.1\\times10^{-14}$ mol.', 'Molecules: $4.1\\times10^{-14}\\times6.022\\times10^{23} = 2.5\\times10^{10}$.', 'Per protein: $2.5\\times10^{10} / 3\\times10^{6} \\approx 8{,}000$.'],
      a: 'About $2.5\\times10^{10}$ water molecules, some eight thousand for each protein.' },
    { title: 'How close are the proteins?', q: 'Proteins of 50 kDa and diameter 4.9 nm fill a cell at 330 g/L. How wide is the water gap between neighbours, and how does it compare with a dilute solution at 10 g/L?',
      steps: ['Spacing: $d = (M/cN_A)^{1/3}$. At 330 g/L: $M/c = 50\\ \\mathrm{kg/mol} / 330\\ \\mathrm{kg/m^3} = 0.152\\ \\mathrm{m^3/mol}$; divided by $N_A$ this is $2.5\\times10^{-25}$ m³ and the cube root is 6.3 nm.', 'Gap: $6.3 - 4.9 = 1.4$ nm, or five water molecules (0.28 nm each).', 'At 10 g/L the volume per protein is 33 times larger and the spacing 3.2 times larger: 20 nm, a gap of 15 nm or fifty molecules.'],
      a: 'A gap of 1.4 nm (five waters) in the cell against 15 nm (fifty) in a dilute solution.' }
  ],
  quiz: [
    { q: 'What share of the molecules in a typical cell is water?', choices: ['About 10 %', 'About 50 %', 'About 70 %', 'About 99 %'], a: 3, why: 'By number, 99 %. The figure 70 % is the mass share; the two differ because a protein weighs as much as thousands of water molecules.' },
    { q: 'Water in the first layer on a protein surface is frozen in place.', a: false, why: 'It rotates and diffuses two to three times more slowly than bulk water but still exchanges with the bulk in picoseconds to nanoseconds; it is slowed, not frozen.' },
    { q: 'A cell is 70 % water by mass but 99 % by number because', choices: ['water molecules are far lighter than the macromolecules', 'there are more proteins than water molecules', 'most water is bound and does not count', 'the cell membrane concentrates water'], a: 0, why: 'A molecule of water has mass 18; an average protein, 50,000. A few macromolecules outweigh thousands of waters.' },
    { q: 'Ball (2017) argued that water in the cell is', choices: ['a passive solvent', 'a quasi-solid gel throughout the cytoplasm', 'a structured liquid and a reagent that takes an active part in the cell\'s chemistry', 'mostly bound to proteins and unavailable'], a: 2, why: 'His point was that neither extreme is right: not a passive filler, not a mystical special phase, but a liquid whose structure and chemistry participate.' },
    { q: 'A protein carries 0.35 g of water per gram in its first layer. How many grams of water are in the first layers of 200 g of protein?', answer: 70, unit: 'g', why: '0.35 × 200 = 70 g. In a cell with 690 g of water per litre this is about a tenth of the water.' }
  ],
  applications: ['Why drugs and proteins behave differently in a cell than in a dilute test tube: crowding changes how fast and how tightly they bind.', 'Cryopreservation and freeze-drying, which have to deal with the fraction of cell water that behaves differently from the bulk.', 'The design of protein therapeutics, whose stability depends on the hydration shell and the buffer around them.', 'Understanding water-activity limits for life: below a certain humidity the cell\'s water cannot do its job.'],
  history: 'Albert Szent-Györgyi (1893–1986) spent his later career on the idea that the water of the cell is as important as its molecules, and his speculations about "biological water" were often ahead of the evidence. Philip Ball\'s 2017 paper sorts the sound parts of that tradition — a structured, reactive, shaping liquid — from the claims that measurement has not supported.',
  sources: ['Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — the argument of this page (source 9).', 'Milo and Phillips, *Cell Biology by the Numbers* (2016) — molecule counts and sizes in bacterial and animal cells.', 'Alberts and colleagues, *Molecular Biology of the Cell*, chapter 2 — the chemical composition of the cell.', 'Szent-Györgyi, *Bioenergetics* (1957) — the matrix-of-life idea.'],
  sim: 'cell-crowded-cytoplasm'
},

/* ================================================================ 2 */
{
  id: 'how-much-water-we-are', parent: 'the-sculptor-inside-every-cell', title: 'How much water we are', level: 1,
  short: 'An adult is about 60 % water: 42 litres in a 70 kg man, two-thirds inside the cells and one-third outside, of which only three litres are in the blood. A newborn is 75 % water, the brain 75 %, a bone 30 %, and fat holds almost none, so the leaner the body, the wetter.',
  keywords: ['total body water', 'body water percentage', 'intracellular fluid', 'extracellular fluid', 'interstitial fluid', 'plasma volume', '60 percent', 'newborn', 'fat and water', 'lean body mass', 'water in organs'],
  prereq: ['the-matrix-of-life'],
  related: ['blood-and-the-daily-budget', 'osmosis-in-cells', 'the-body-at-37-degrees', 'drinking-water-and-thirst', 'medicine:electrolytes', 'medicine:blood-composition', 'biology:water-in-life'],
  body: `
Weigh a man of 70 kg and about 42 kg of him is water. If you could drain it, the rest would weigh 28 kg: the protein of the muscles and the skin, the fat, the minerals of the bones and a little carbohydrate. We are a bag of water in which a modest amount of machinery is dissolved and suspended, and the proportion is fixed by what the machinery is made of.

### Three bags in one
Body water sits in compartments separated by membranes, and the split matters because the compartments behave differently.

| Compartment (70 kg man) | Volume | Share of body water | What it contains |
|---|---|---|---|
| inside the cells (intracellular) | about 28 L | two-thirds | potassium, protein, phosphate |
| between the cells (interstitial) | about 11 L | one-sixth | sodium, chloride; the bath of the cells |
| blood plasma | about 3 L | one-fourteenth | sodium, chloride, plasma proteins |

The last two together are the **extracellular fluid**, about 14 L or one-third of the total. Plasma is only about a fifth of it. Small amounts of fluid in the gut, the spinal canal and the joints (the "transcellular" water) are counted with the extracellular group. The numbers are standard textbook physiology and vary person to person by a few litres.

### Why the percentage varies
Different tissues hold different amounts of water: blood plasma 92 %, lung and kidney about 80 %, muscle and brain about 75 %, skin about 65 %, bone about 30 %, fat tissue only 10–20 %. Lean body mass, everything but the fat, is close to **73 % water** in almost everyone (Pace and Rathbun, 1945). So the water percentage of a person depends mainly on how much of them is fat:

$$\\text{water fraction} \\approx (1 - f)\\times 0.73 + f\\times 0.10$$

with $f$ the fat fraction. A man with 20 % fat comes to 60 %; a woman with 30 % fat, 54 %; a lean athlete with 8 % fat, 68 %; a person with 40 % fat, 49 %.

| Group | Water, % of body mass | Why |
|---|---|---|
| newborn | about 75 % | little fat, much water-rich tissue, a large extracellular share |
| infant of one year | about 65 % | |
| adult man | about 60 % | |
| adult woman | about 50–55 % | more fat on average |
| older adult | about 45–55 % | muscle mass falls, fat share rises |

Babies therefore lose water faster, in proportion, than adults, and they cannot afford to: a newborn exchanges about a seventh of its water each day, an adult about a sixteenth.

### Always on the move
The 42 litres are not a store but a stream. A person takes in and loses about 2.5 L a day ([[blood-and-the-daily-budget]]), so that the average water molecule stays in the body for about 17 days and half of it is replaced in 9 to 12 days. Isotope-labelled water drunk on Monday shows up, diluted, in every compartment by evening.

### The tissues, in the cell's terms
Everything on the previous page ([[the-matrix-of-life]]) applies within each of these numbers: the 28 L inside the cells is the crowded, 70 % water cytoplasm; the 14 L outside it is thinner, with a tenth of the protein, in which the cells bathe.

> [!key] A 70 kg man is 42 litres of water: two-thirds inside the cells, a third outside, three litres of it in the blood. Because lean tissue is 73 % water and fat only about 10 %, the water share of the body tracks how lean it is: 75 % in a newborn, 60 % in a man, about 50 % in an older woman.`,
  ideas: ['Lean tissue is about 73 % water and fat about 10 %, so a lean body is wetter: newborns 75 %, men 60 %, women 50–55 %.', 'A 70 kg man holds about 42 L: 28 L in the cells, 11 L between them, 3 L in the plasma.', 'Tissues differ: plasma 92 %, brain and muscle about 75 %, bone 30 %, fat tissue 10–20 %.', 'The water is a stream, not a store: a person replaces half of it in 9–12 days.'],
  pitfalls: ['"Women have less water because they are built differently" — The difference is almost entirely fat: matched for body fat, lean tissue is about 73 % water in both.', '"Blood is a big share of body water" — Plasma is only about 3 L of 42, a fourteenth; most water is inside the cells.', '"Bones are dry" — Fresh bone is about 30 % water; it is only dry by comparison with soft tissue.'],
  terms: [
    { term: 'Total body water', also: ['TBW'], def: 'All the water in the body, in litres or as a share of body mass: about 60 % (42 L) in a 70 kg man, 75 % in a newborn.' },
    { term: 'Intracellular fluid', also: ['ICF', 'cell water'], def: 'The water inside the cells, about two-thirds of total body water (28 L in a 70 kg man), rich in potassium and protein.' },
    { term: 'Extracellular fluid', also: ['ECF'], def: 'All the water outside the cells, about a third of the total (14 L), made of the interstitial fluid between the cells and the blood plasma; rich in sodium and chloride.' },
    { term: 'Interstitial fluid', also: ['tissue fluid'], def: 'The fluid in the spaces between cells, about 11 L, which carries nutrients and wastes between the blood and the cells.' },
    { term: 'Lean body mass', also: ['fat-free mass'], def: 'Body mass without fat: muscle, organs, bone and water. It is about 73 % water, nearly the same in everyone.' }
  ],
  formulas: [
    { name: 'Total body water from fat', expr: 'V = m*((1-fat)*hl + fat*hf)/rhoW', tex: 'V = \\frac{m\\,[(1-f)\\,h_l + f\\,h_f]}{\\rho_w}',
      vars: { V: { name: 'total body water', q: 'volume', unit: 'L' }, m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70, min: 2, max: 200 }, fat: { name: 'body fat', q: 'ratio', unit: '%', value: 0.2, min: 0, max: 0.6, tex: 'f', hint: 'Typical: men 15–25 %, women 25–35 %.' }, hl: { name: 'water in lean tissue', q: 'ratio', unit: '%', value: 0.73, min: 0, max: 1, tex: 'h_l', hint: '73 % in nearly everyone (Pace and Rathbun, 1945).' }, hf: { name: 'water in fat tissue', q: 'ratio', unit: '%', value: 0.10, min: 0, max: 1, tex: 'h_f', hint: '10–20 %; adipose tissue holds some water, pure fat none.' }, rhoW: { const: 'rhoW' } },
      solveFor: 'V', note: 'A model good to a litre or two for adults; infants and the very old need their own lean-tissue values.',
      stories: { V: 'A person of {m} has {fat} body fat. How many litres of water does the body hold?', fat: 'A person of {m} holds {V} of water. What body fat does that suggest?' } },
    { name: 'Plasma volume', expr: 'Vp = V*fe*fp', tex: 'V_p = V\\,f_e\\,f_p',
      vars: { Vp: { name: 'plasma volume', q: 'volume', unit: 'L', tex: 'V_p' }, V: { name: 'total body water', q: 'volume', unit: 'L', value: 42 }, fe: { name: 'extracellular share of the water', q: 'ratio', unit: '%', value: 0.333, tex: 'f_e', hint: 'One third in adults; 0.4–0.5 in newborns.' }, fp: { name: 'plasma share of the extracellular water', q: 'ratio', unit: '%', value: 0.214, tex: 'f_p', hint: 'About a fifth: 3 L of 14 L.' } },
      solveFor: 'Vp', note: 'The 3 L of plasma is less than one-fifteenth of the water in the body.',
      stories: { Vp: 'A person holds {V} of water, {fe} of it outside the cells and {fp} of that in the plasma. How big is the plasma volume?' } },
    { name: 'Half-life of the body\'s water', expr: 't = ln(2)*V/F', tex: 't_{1/2} = \\frac{\\ln 2\\;V}{F}',
      vars: { t: { name: 'half-life', q: 'time', unit: 'day', tex: 't_{1/2}' }, V: { name: 'body water', q: 'volume', unit: 'L', value: 42 }, F: { name: 'water turned over', q: 'flowrate', unit: 'mL/min', value: 1.74, hint: '2.5 L a day is 1.74 mL a minute; hot weather or hard work can double it.' } },
      solveFor: 't', note: 'The turnover is first-order: replacement in proportion to what is there, as in a well-stirred tank. Heavy-water tracer studies give 8–12 days for adults.',
      stories: { t: 'The body holds {V} of water and turns over {F}. After how long has half of the water been replaced?' } }
  ],
  examples: [
    { title: 'A man, a woman and an athlete', q: 'Estimate the total body water of a 70 kg man with 20 % fat, a 60 kg woman with 30 % fat and a 70 kg athlete with 8 % fat.',
      steps: ['Man: $0.8\\times0.73 + 0.2\\times0.10 = 0.604$, so $70\\times0.604 = 42.3$ L.', 'Woman: $0.7\\times0.73 + 0.3\\times0.10 = 0.541$, so $60\\times0.541 = 32.5$ L.', 'Athlete: $0.92\\times0.73 + 0.08\\times0.10 = 0.680$, so $70\\times0.68 = 47.6$ L.'],
      a: 'About 42 L (60 %), 32 L (54 %) and 48 L (68 %): the same lean tissue, a different fat share.' },
    { title: 'How long a molecule stays', q: 'A man holds 42 L and takes in 2.5 L of water a day. How long does an average water molecule stay, and when has half been replaced?',
      steps: ['Mean residence time: volume over flow, $42/2.5 = 16.8$ days.', 'Half-life: $\\ln 2\\times 16.8 = 11.6$ days.', 'The measured value from tracer studies, 9–10 days, is a little shorter because real intake is nearer 3 L a day, and some water exchanges by diffusion across skin and gut.'],
      a: 'About 17 days on average; half the water is replaced in 10–12 days.' }
  ],
  quiz: [
    { q: 'Which has the highest water content?', choices: ['Brain', 'Blood plasma', 'Skeletal muscle', 'Bone'], a: 1, why: 'Plasma is 92 % water; brain and muscle about 75 %, bone about 30 %.' },
    { q: 'An average adult woman has a lower water percentage than an average man because lean tissue in women is drier.', a: false, why: 'Lean tissue is about 73 % water in both; the difference is the larger fat share in women, and fat holds little water.' },
    { q: 'Of a man\'s 42 litres of water, roughly how much is in the blood plasma?', choices: ['About 0.5 L', 'About 3 L', 'About 14 L', 'About 28 L'], a: 1, why: '14 L is the whole extracellular fluid and 28 L the intracellular fluid; the plasma is about a fifth of the extracellular fluid, or 3 L.' },
    { q: 'Two people have the same mass; one has twice the body fat of the other. Which holds more water?', choices: ['The one with more fat', 'The one with less fat', 'They hold the same', 'It depends on height only'], a: 1, why: 'Fat holds very little water, so for the same mass the leaner body holds more.' },
    { q: 'How many litres of water are in a 3.5 kg newborn who is 75 % water?', answer: 2.6, unit: 'L', why: '0.75 × 3.5 = 2.6 kg, which is 2.6 litres.' }
  ],
  applications: ['Dosing drugs by body weight or by lean mass: water-soluble drugs spread through total body water, fat-soluble ones into fat.', 'Bioimpedance scales estimate body water from how well a weak current passes through it, and from that, body fat.', 'Why babies and the elderly dehydrate quickly: smaller stores and, in the old, less thirst.', 'Understanding fluid balance in medicine: where a litre of drip fluid goes depends on whether it is salty or plain.'],
  history: 'The measurement of body water began with the dilution principle: drink a known amount of a tracer, wait until it has spread, measure its concentration. Pace and Rathbun in 1945 used heavy water on guinea pigs and found lean tissue constant at 73 % water, which made body composition a matter of weighing water and fat.',
  sources: ['Guyton and Hall, *Textbook of Medical Physiology*, chapter on body fluid compartments — the standard 28/11/3 litre division.', 'Pace and Rathbun, "Studies on body composition III", *Journal of Biological Chemistry* 158, 685 (1945) — the 73 % water of lean tissue.', 'Wang and colleagues, "Hydration of fat-free body mass", *American Journal of Clinical Nutrition* (1999) — modern confirmation of lean-tissue hydration.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — the cell\'s side of the same numbers.'],
  sim: { id: 'cell-body-water', params: { view: 'where' } }
},

/* ================================================================ 3 */
{
  id: 'hydration-shells-and-proteins', parent: 'the-sculptor-inside-every-cell', title: 'Hydration shells and proteins', level: 2,
  short: 'A protein is wrapped in a skin of water: about 0.3–0.4 g of water per gram in the first layer, held in definite places by hydrogen bonds to the polar groups, rotating two to three times more slowly than the liquid. It shows up in crystal structures, in the B-factors, and in every part of what the protein does.',
  keywords: ['hydration shell', 'hydration layer', 'bound water', 'ordered water', 'water in crystal structures', 'B-factor', 'water per gram of protein', 'residence time', 'buried water', 'first hydration layer', 'dynamical slowdown'],
  prereq: ['the-matrix-of-life', 'what-a-hydrogen-bond-is', 'biology:protein-structure'],
  related: ['the-hydrophobic-effect-folds-proteins', 'proton-wires-and-enzymes', 'dna-needs-water', 'the-structure-of-liquid-water', 'bonds-that-flicker', 'chemistry:amino-acids-proteins', 'like-dissolves-like'],
  body: `
Lysozyme is a small enzyme of egg white and tears, 14,300 daltons, about 3 nm across. Dissolved in water it carries with it, wherever it goes, roughly 270 water molecules in contact with its surface: a **hydration shell** of about 0.35 g of water for every gram of protein. They are not a coat that sticks; they are neighbours that stay a little longer than neighbours usually do.

### What the first layer looks like
Water meets a protein surface that is a patchwork. Charged groups (lysine, arginine, aspartate, glutamate) bind water strongly. Polar groups, the backbone C=O and N–H and the side chains of serine, threonine, asparagine, glutamine, give or take hydrogen bonds. Oily patches (leucine, valine, phenylalanine) offer water nothing to hold. The first layer therefore consists of

- waters **bound to polar and charged sites** by one or two hydrogen bonds, each with its other bonds to the next waters, in positions that repeat from molecule to molecule;
- a thinner, looser arrangement over the **oily patches**, where water cannot bond to the surface and keeps its bonds to its own kind ([[the-hydrophobic-effect]]);
- a **second layer**, bridging, much less fixed;
- beyond that, ordinary liquid.

Hydration waters are far from rigid. Neutron scattering, NMR and molecular simulation agree that in the first layer water **rotates and diffuses about two to three times more slowly** than bulk water, and exchanges with it on a time scale of tens to hundreds of picoseconds (the bulk hydrogen-bond lifetime is 1.2 ps, [[bonds-that-flicker]]). A few waters buried inside the protein, as in the four of BPTI, stay put from nanoseconds to milliseconds. How far the disturbance reaches depends on the method: one to two layers by most, up to a few layers (about 0.5–1 nm) by terahertz absorption, and the matter is still argued (source 9).

### The numbers
| Quantity | Value |
|---|---|
| surface of a globular protein of mass $M$ (Da) | about $6.3\\,M^{0.73}$ Å² |
| area one first-layer water covers | about 25 Å² |
| water in a full first layer | 0.3–0.4 g/g for a small protein |
| lysozyme (14.3 kDa) | surface about 6,800 Å², about 270 waters, 0.34 g/g |
| a 100 kDa protein | surface 28,000 Å², 1,100 waters, 0.20 g/g |
| slowing of rotation in the first layer | about 2–3 × |
| ordered waters in a good crystal structure | roughly one per residue |

Large proteins carry less per gram because the surface grows as the 0.73 power of the mass, not the first.

### How it is seen
In an **X-ray crystal structure** the water appears as peaks of electron density at fixed places in every unit cell, mostly on the surface and in the grooves; a good high-resolution structure lists about one per residue. Each atom carries a **B-factor**, $B = 8\\pi^2\\langle u^2\\rangle$, which measures how much its position smears; a typical protein atom has $B$ = 15–30 Å² (rms displacement 0.4–0.6 Å), and ordered surface waters are a little higher, a measure of how much freer they are. Tightly held internal waters have B-factors as low as the protein\'s own.

### Why it matters
Dry a lysozyme powder: it does nothing until it has taken up about 0.2 g of water per gram, enough to cover its charged groups, and reaches full activity near the 0.38 g/g of a complete first layer (Rupley and Careri). Hydration is not a medium for the protein; it is part of its working structure.

> [!key] A protein carries a hydration shell of about 0.3–0.4 g of water per gram: waters held in definite places on its polar groups, rotating two to three times more slowly than bulk water, visible in crystals and essential to its action. The shell is a slowing, not a freezing, and reaches one or two layers.`,
  ideas: ['The first layer is about 0.3–0.4 g of water per gram of a small protein, set by the surface (about 25 Å² per water).', 'Waters bind to polar and charged sites in repeatable positions; over oily patches they are fewer and looser.', 'First-layer water rotates and diffuses 2–3 times more slowly than bulk water but still exchanges in picoseconds to nanoseconds.', 'Ordered waters show up in crystal structures, and the B-factor measures how much each one smears.'],
  pitfalls: ['"Bound water is frozen" — It is slowed by a factor of 2–3 and exchanges with the bulk in picoseconds to nanoseconds; only a few buried waters last longer.', '"Hydration water is a different substance" — It is the same molecule making the same bonds; only its freedom is reduced by the surface.', '"The shell is a layer of uniform thickness" — It is uneven: dense over polar groups, sparse over oily ones, and its reach depends on the method of measurement.'],
  terms: [
    { term: 'Hydration shell', also: ['hydration layer', 'solvation shell', 'hydration water'], def: 'The layer or layers of water next to a solute or surface whose arrangement and motion differ from bulk water. Around a protein the first layer holds about 0.3–0.4 g of water per gram.' },
    { term: 'Ordered water', also: ['bound water', 'structural water', 'crystallographic water'], def: 'Water molecules that sit in the same place in every copy of a molecule, so that they appear in an X-ray structure. "Bound" does not mean fixed for ever: surface waters exchange in picoseconds to nanoseconds.' },
    { term: 'Residence time', also: ['exchange time'], def: 'How long a water molecule stays at a given site before exchanging with the bulk: tens to hundreds of picoseconds for most surface waters, nanoseconds to milliseconds for a few buried ones.' },
    { term: 'B-factor', also: ['temperature factor', 'atomic displacement parameter'], def: 'The number that tells how far an atom\'s position is smeared in a crystal structure: $B = 8\\pi^2\\langle u^2\\rangle$ in Å². Larger values mean a looser atom.' },
    { term: 'Buried water', also: ['internal water'], def: 'A water molecule inside a protein, in a cavity and bonded to the polar groups around it; it behaves as part of the structure, as do the four in BPTI.' }
  ],
  formulas: [
    { name: 'Surface area of a globular protein', expr: 'A = 6.3*M^0.73', tex: 'A = 6.3\\,M^{0.73}',
      vars: { A: { name: 'accessible surface area (Å²)' }, M: { name: 'protein mass (Da)', value: 14300, min: 1000, hint: 'Lysozyme is 14,300; haemoglobin 64,500; a ribosome many million.' } },
      solveFor: 'A', note: 'The empirical rule of Miller, Janin, Lesk and Chothia (1987) for compact single-domain proteins; elongated or multi-domain ones have more.',
      stories: { A: 'A protein has a mass of {M} daltons. What is its surface area in square ångströms?' } },
    { name: 'Water in a full first layer, per gram', expr: 'h = mw*A/(aw*M)', tex: 'h = \\frac{m_w\\,A}{a_w\\,M}',
      vars: { h: { name: 'grams of water per gram of protein' }, mw: { name: 'mass of a water molecule (Da)', value: 18.015, fixed: true, tex: 'm_w' }, A: { name: 'surface area (Å²)', value: 6800 }, aw: { name: 'area per first-layer water (Å²)', value: 25, tex: 'a_w', hint: 'About 25 Å² per water in contact with a real surface, a little more than a molecule\'s own 9 Å² footprint because the surface is rough and partly oily.' }, M: { name: 'protein mass (Da)', value: 14300, min: 1000 } },
      solveFor: 'h', note: 'Gives 0.34 g/g for lysozyme. Use the area formula above to get A from M.',
      stories: { h: 'A protein of {M} daltons has a surface of {A} Å², with {aw} Å² per first-layer water. How many grams of water per gram of protein?' } },
    { name: 'B-factor', expr: 'B = 8*pi^2*u2', tex: 'B = 8\\pi^2\\,\\sigma_u^2',
      vars: { B: { name: 'B-factor (Å²)' }, u2: { name: 'mean-square displacement (Å²)', value: 0.25, tex: '\\sigma_u^2', hint: 'An rms displacement of 0.5 Å gives 0.25 Å².' } },
      solveFor: 'B', note: 'Includes static disorder as well as thermal motion, so B-factors are an upper bound on the vibration alone.',
      stories: { B: 'An atom\'s mean-square displacement is {u2} square ångströms. What is its B-factor?' } }
  ],
  examples: [
    { title: 'Hydrating lysozyme', q: 'Lysozyme has a mass of 14,300 Da. Estimate its surface, the number of waters in a full first layer and the water per gram.',
      steps: ['Surface: $A = 6.3\\times14300^{0.73}$. $\\ln 14300 = 9.568$, times 0.73 is 6.985, $e^{6.985} = 1{,}080$; $A = 6.3\\times1080 = 6{,}800$ Å².', 'Waters: $6800/25 = 272$.', 'Mass of water: $272\\times18 = 4{,}900$ Da; per gram of protein $4900/14300 = 0.34$ g/g.'],
      a: 'About 6,800 Å², 270 water molecules, 0.34 g of water per gram of protein.' },
    { title: 'A large protein', q: 'The same calculation for a 100 kDa protein. What happens to the water per gram, and why?',
      steps: ['Surface: $A = 6.3\\times100000^{0.73}$. Since $100000^{0.73} = 10^{3.65} = 4{,}467$, $A = 28{,}100$ Å².', 'Waters: $28100/25 = 1{,}120$, mass $20{,}200$ Da, so $0.20$ g/g.', 'The surface grew only $4\\times$ for a seven-fold mass increase: the interior has no surface.'],
      a: 'About 0.2 g/g: bigger proteins are relatively drier on the surface, because area rises more slowly than mass.' }
  ],
  quiz: [
    { q: 'Compared with bulk water, the rotation of water in the first layer next to a protein is', choices: ['about the same', 'about 2–3 times slower', 'about 100 times slower', 'faster, because the surface repels it'], a: 1, why: 'The first layer is slowed by a factor of two or three; it is not locked in place, and it does not move faster.' },
    { q: 'A protein\'s water per gram is smaller for a large protein than a small one because', choices: ['large proteins repel water', 'surface area rises more slowly than mass', 'large proteins are more hydrophobic', 'water cannot get close to big proteins'], a: 1, why: 'Surface area grows as about M^0.73, so the surface per unit mass falls with size.' },
    { q: 'Waters seen in X-ray structures of proteins sit at fixed places for ever and never exchange with the bulk.', a: false, why: 'Most exchange in tens to hundreds of picoseconds; a few buried waters last nanoseconds to milliseconds. "Ordered" means the same place in every copy at the instant of freezing, not for ever.' },
    { q: 'The first hydration layer around a protein is thickest and most ordered over', choices: ['oily patches', 'polar and charged groups', 'the protein core', 'the termini only'], a: 1, why: 'Water bonds to polar and charged groups; over oily patches it can only keep bonding to other water, so the layer is thinner and looser.' },
    { q: 'An atom in a crystal structure has an rms displacement of 0.5 Å. Its B-factor (in Å²) is', answer: 19.7, why: 'B = 8π² × 0.25 = 19.7 Å², typical of a protein atom.' }
  ],
  applications: ['Drug design: ordered waters in a binding pocket are either displaced or exploited by a ligand, a major part of the energy of binding.', 'Protein crystallography: placing the waters correctly is part of refining a structure, and their B-factors tell how well it is known.', 'Freeze-drying of proteins and vaccines: the water that is removed last is the first layer, and replacing it with sugars protects the structure.', 'Understanding why dry enzyme powders work only above a threshold of hydration.'],
  history: 'That proteins carry water with them was recognised in the 1920s and 30s from sorption isotherms. Kuntz and Kauzmann\'s 1974 review in *Advances in Protein Chemistry* gave the 0.3–0.4 g/g figure and the picture of a layer bound to polar groups; the first waters were seen in a crystal structure of lysozyme in the 1960s and neutron and NMR work in the 1980s and 1990s showed how short-lived most of them are.',
  sources: ['Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — hydration shells and slowed dynamics (source 9).', 'Kuntz and Kauzmann, "Hydration of proteins and polypeptides", *Advances in Protein Chemistry* 28, 239 (1974).', 'Miller, Janin, Lesk and Chothia, "Interior and surface of monomeric proteins", *Journal of Molecular Biology* 196, 641 (1987) — the area formula.', 'Rupley and Careri, "Protein hydration and function", *Advances in Protein Chemistry* 41, 37 (1991) — hydration and enzyme activity.'],
  sim: 'cell-protein-surface'
},

/* ================================================================ 4 */
{
  id: 'the-hydrophobic-effect-folds-proteins', parent: 'the-sculptor-inside-every-cell', title: 'The hydrophobic effect folds proteins', level: 2,
  short: 'A protein chain folds in milliseconds to a shape with an oily core and a polar skin, because water pushes the oily side chains together. Kauzmann saw this in 1959; the Levinthal paradox shows it cannot be a random search; heat and urea undo it. A lattice model of beads that hate water folds before your eyes.',
  keywords: ['protein folding', 'hydrophobic effect', 'hydrophobic core', 'oil drop', 'Kauzmann', 'Levinthal paradox', 'Anfinsen', 'denaturation', 'urea', 'cold denaturation', 'HP model', 'folding funnel', 'native state', 'chaperone'],
  prereq: ['hydration-shells-and-proteins', 'the-hydrophobic-effect', 'biology:protein-structure'],
  related: ['membranes-assemble-themselves', 'dna-needs-water', 'like-dissolves-like', 'the-matrix-of-life', 'chemistry:amino-acids-proteins', 'biology:enzymes', 'what-remains-unknown'],
  body: `
Cut a folded protein in half and you find a surprise: the inside is oil. The side chains of leucine, isoleucine, valine and phenylalanine crowd together in a core packed as tightly as a crystal, and the charged and polar groups line the surface where the water is. A chain of 100 to 500 amino acids, released from the ribosome as a floppy string, reaches that arrangement in milliseconds to seconds. Water is the reason.

### The oil drop
Walter Kauzmann argued in 1959 that the main driving force of folding is the **hydrophobic effect**: oily groups that stick into water force the water to arrange itself around them, which costs entropy ([[the-hydrophobic-effect]]), and burying them removes that cost. Max Perutz saw the same in the first structures, that the inside of haemoglobin is oily. The cost of exposure is roughly proportional to the oily surface, about **100 J per mole per ångström squared** (24 cal/mol/Å²; Chothia, 1974). A leucine side chain buried from water saves about 130 Å², or 13 kJ/mol; the oily surface buried in a small protein is several thousand ångströms squared, a few hundred kilojoules per mole.

### And yet proteins are barely stable
The net free energy of folding is small, only **20–60 kJ/mol**, the energy of a few hydrogen bonds. It is the difference of large opposing terms:

| Contribution | Effect on folding | Size |
|---|---|---|
| hydrophobic effect (burying oily groups) | favours folding | hundreds of kJ/mol |
| van der Waals packing in the core | favours | large |
| hydrogen bonds | roughly neutral in water: they replace bonds to water | small net |
| loss of the chain\'s conformational freedom | opposes | very large |
| burying charges and polar groups unpaired | opposes | large |

A protein is stable at body temperature, but marginally: ΔG of unfolding 20–60 kJ/mol means that 1 molecule in $10^{3}$ to $10^{10}$ is unfolded at any instant (see the formulas), which keeps it flexible and degradable, as life needs.

### Undoing it
- **Heat.** Warming a protein past its melting temperature (50–80 °C for most) breaks the balance: the chain gains entropy faster than the hydrophobic term pays. An egg white sets because the unfolded proteins stick together.
- **Urea or guanidinium chloride** at 6–8 mol/L make the interior more soluble in water: the oily side chains are no longer so unwelcome in it. Anfinsen showed in the 1950s that ribonuclease unfolded in urea refolds when the urea is removed.
- **Cold.** The hydrophobic effect weakens on cooling, and many proteins unfold near or below 0 °C: cold denaturation, seen in the 1980s.
- **Acid, alkali, detergent, solvents** that charge or dissolve the core.

### Levinthal\'s paradox, and how it is solved
A chain of 100 residues with three plausible shapes per residue has $3^{100} = 5\\times10^{47}$ conformations. Trying one every $10^{-13}$ s would take $5\\times10^{34}$ s, a hundred million billion times the age of the universe. Yet proteins fold in less than a second. Cyrus Levinthal drew the conclusion in 1968: folding is **not a random search**. It follows a path, or many, downhill. The modern picture is the **folding funnel** (Wolynes, Onuchic and Dill): a landscape of energy against shape that narrows towards the native state, so that each step towards the core lowers the energy and a chain falling in from anywhere on the rim finds the floor. Small fast folders take microseconds; most take milliseconds to seconds; chaperones such as GroEL stop the unfolded chains clumping on the way.

### The simplest model
Lau and Dill\'s HP model (1989) strips the story to its logic: a chain of beads on a square grid, each hydrophobic (H) or polar (P), non-crossing, with one unit of energy for each pair of H beads that touch without being neighbours in the chain. That is all. In the simulation a chain of 20 beads finds the shape with 9 contacts, the H beads in the middle and the P beads outside, in about a quarter of a million moves — a few seconds of computer time, from tens of millions of possible shapes. Add urea (weaker ε) or heat (higher kT) and it unfolds again.

> [!key] Proteins fold because water excludes oily side chains: burying them saves hundreds of kJ/mol, against an equal cost in lost chain freedom, so the folded state wins by only 20–60 kJ/mol. The fold is found by descent of a funnel, not by search (Levinthal), and heat, cold and urea undo it by changing the balance.`,
  ideas: ['The folded core is oily and the surface polar because water pushes non-polar groups together: the hydrophobic effect (Kauzmann, 1959).', 'Burying oily surface saves about 100 J/mol per Å², but the net stability of a folded protein is only 20–60 kJ/mol.', 'Levinthal\'s paradox: 3^100 shapes cannot be searched; folding follows a downhill funnel and takes ms–s.', 'Heat, cold, urea and detergents undo the fold by tipping the balance, and the fold can come back (Anfinsen).'],
  pitfalls: ['"Hydrogen bonds hold a protein in shape" — In water a protein hydrogen bond only replaces bonds to water, so its net gain is small; the hydrophobic effect and packing do most of the work, though buried bonds must be satisfied.', '"Hydrophobic means repelled by water" — There is no repulsion: water attracts itself more than it attracts oil, and the oil is squeezed out as a result.', '"Protein folding is slow because there are so many shapes" — The chain does not try them; the funnel guides it, and small proteins fold in microseconds.'],
  terms: [
    { term: 'Hydrophobic core', also: ['oily core', 'oil-drop core'], def: 'The interior of a folded globular protein, made of non-polar side chains packed together away from water, with polar and charged groups on the surface.' },
    { term: 'Native state', also: ['native fold', 'folded state'], def: 'The compact, functional three-dimensional shape of a protein, fixed by its amino-acid sequence (Anfinsen) and the water around it.' },
    { term: 'Denaturation', also: ['unfolding'], def: 'The loss of the native shape, by heat, cold, urea, acid or detergent, without breaking the chain\'s covalent bonds. Often reversible at first.' },
    { term: 'Levinthal\'s paradox', also: ['Levinthal paradox'], def: 'The observation that a chain cannot find its fold by trying all shapes: a 100-residue chain has about $10^{47}$ of them but folds in under a second, so folding must follow a guided path.' },
    { term: 'Folding funnel', also: ['energy landscape'], def: 'The picture of an energy surface that narrows towards the native state, so that the many starting shapes all lead downhill to it.' },
    { term: 'HP model', also: ['hydrophobic–polar lattice model', 'Lau–Dill model'], def: 'A lattice model of folding in which each bead is hydrophobic (H) or polar (P) and every touching pair of H beads lowers the energy by one unit.' }
  ],
  formulas: [
    { name: 'Free energy of burying oily surface', expr: 'dG = -g*dA', tex: '\\Delta G = -\\gamma\\,\\Delta A',
      vars: { dG: { name: 'free energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' }, g: { name: 'cost of exposed oily surface (J/mol per Å²)', value: 100, tex: '\\gamma', hint: 'About 100 J/mol per Å² (24 cal/mol/Å²), from the transfer of hydrocarbons from oil into water (Chothia, 1974).' }, dA: { name: 'oily surface buried (Å²)', value: 130, tex: '\\Delta A', hint: 'A buried leucine side chain removes about 130 Å².' } },
      solveFor: 'dG', note: 'A rule of thumb; the real values depend on the surface and the temperature (the hydrophobic effect is entropic at room temperature and enthalpic when cold).',
      stories: { dG: 'Folding buries {dA} of oily surface at {g} per square ångström. What is the free-energy change?', dA: 'Folding releases {dG}. How much oily surface has to be buried?' } },
    { name: 'Fraction of molecules folded', expr: 'f = 1/(1+exp(-dGu/(R*T)))', tex: 'f = \\frac{1}{1 + e^{-\\Delta G_u/RT}}',
      vars: { f: { name: 'fraction folded', q: 'ratio', unit: '%' }, dGu: { name: 'free energy of unfolding', q: 'molarenergy', unit: 'kJ/mol', value: 40, signed: true, tex: '\\Delta G_u', hint: 'Positive when the folded state is more stable; 20–60 kJ/mol for most proteins.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37, min: -50 } },
      solveFor: 'f', note: 'A two-state model: every molecule is either folded or unfolded. The ratio of folded to unfolded is $e^{\\Delta G_u/RT}$.',
      stories: { f: 'A protein is more stable folded by {dGu} at {T}. What fraction is folded?', dGu: 'At {T} a fraction {f} of the protein is folded. How much more stable is the folded state?' } },
    { name: 'Time to search all conformations', expr: 't = n^L/k', tex: 't = \\frac{n^{L}}{k}',
      vars: { t: { name: 'search time', q: 'time', unit: 's' }, n: { name: 'shapes per residue', value: 3, min: 1, hint: 'Levinthal used 2–3; real residues have more.' }, L: { name: 'residues in the chain', value: 100, min: 2, max: 300, int: true }, k: { name: 'conformations tried per second', q: 'frequency', unit: 'Hz', value: 1e13, hint: 'A bond rotation takes about 0.1 ps, so 10¹³ per second is generous.' } },
      solveFor: 't', note: 'About $5\\times10^{34}$ s for 100 residues, against an age of the universe of $4\\times10^{17}$ s. Proteins do not search.',
      stories: { t: 'A chain of {L} residues has {n} shapes per residue, and tries {k}. How long to try them all?' } }
  ],
  examples: [
    { title: 'How stable is stable?', q: 'A small protein has an unfolding free energy of 40 kJ/mol at 37 °C. What is the ratio of folded to unfolded molecules, and what if a mutation lowers it to 10 kJ/mol?',
      steps: ['$RT = 8.314\\times310.15 = 2.58$ kJ/mol.', 'Ratio $= e^{40/2.58} = e^{15.5} = 5.4\\times10^{6}$. One molecule in 5 million is unfolded.', 'With 10 kJ/mol: $e^{3.88} = 48$, so 2 % of the molecules are unfolded at any moment; heat a few degrees and the fraction climbs steeply.'],
      a: 'From 5 million to one down to 48 to one: a mutation costing 30 kJ/mol — three hydrogen bonds\' worth — takes the protein from rock-steady to marginal.' },
    { title: 'Levinthal\'s sum', q: 'A chain of 100 residues, 3 shapes each, tries $10^{13}$ shapes per second. How long would it take to try them all, compared with the age of the universe?',
      steps: ['Shapes: $3^{100} = 5.15\\times10^{47}$.', 'Time: $5.15\\times10^{47}/10^{13} = 5.15\\times10^{34}$ s.', 'The universe is $4.35\\times10^{17}$ s old: the ratio is $1.2\\times10^{17}$.'],
      a: 'About $5\\times10^{34}$ s, a hundred million billion universe-ages. Real proteins fold in milliseconds, so they do not search.' }
  ],
  quiz: [
    { q: 'The inside of a typical globular protein is', choices: ['polar and charged, to hold the chain\'s own water', 'oily, packed with non-polar side chains', 'a hollow filled with water', 'made of hydrogen bonds only'], a: 1, why: 'The non-polar side chains are pushed together by the water outside, forming the hydrophobic core; polar and charged groups face the water.' },
    { q: 'Levinthal\'s paradox shows that folding', choices: ['is impossible', 'happens at random', 'cannot proceed by trying every possible shape', 'needs a ribosome in every case'], a: 2, why: 'There are far too many shapes to test in the time proteins take, so folding must follow a guided, downhill path.' },
    { q: 'Urea at 8 mol/L unfolds proteins by making it easier for the oily side chains to sit in water.', a: true, why: 'Urea weakens the hydrophobic effect (and binds the backbone), so the cost of exposing the core falls; removing the urea lets the protein refold, as Anfinsen showed.' },
    { q: 'A protein has ΔG of unfolding of 20 kJ/mol at 37 °C (RT = 2.58 kJ/mol). Roughly how many folded molecules per unfolded one?', answer: 2336, why: 'e^(20/2.58) = e^7.76 = 2,340: one molecule in 2,300 is unfolded.' },
    { q: 'In the HP model a contact is worth energy only when', choices: ['any two beads touch', 'two H beads touch without being chain neighbours', 'a P bead touches an H bead', 'two P beads touch'], a: 1, why: 'The hydrophobic effect is the saving when two oily beads hide from the water by touching; chain neighbours touch anyway, and polar beads gain nothing.' }
  ],
  applications: ['Protein therapeutics and enzymes in detergents: stability engineering is largely a matter of strengthening the core.', 'Misfolding diseases such as the amyloidoses, in which the hydrophobic regions find each other in the wrong way.', 'Protein structure prediction, from Anfinsen\'s idea that the sequence fixes the fold to deep-learning systems such as AlphaFold (2020–21).', 'Cooking: heat denatures egg and meat proteins, which cross-link and set.', 'Cold-chain storage of proteins and vaccines, which must avoid cold and heat denaturation alike.'],
  history: 'Kauzmann\'s 1959 review, "Some factors in the interpretation of protein denaturation", named the hydrophobic interaction as the main force of folding. Anfinsen (Nobel Prize 1972) showed in the 1950s–60s that ribonuclease refolds from urea unaided, so that sequence fixes structure. Levinthal posed his paradox in 1968, Lau and Dill the HP model in 1989, and the funnel was developed by Wolynes, Onuchic, Dill and others in the 1990s. The 2024 Nobel Prize in Chemistry went to Baker, Hassabis and Jumper for designing and predicting protein structures.',
  sources: ['Kauzmann, "Some factors in the interpretation of protein denaturation", *Advances in Protein Chemistry* 14, 1 (1959).', 'Dill, "Dominant forces in protein folding", *Biochemistry* 29, 7133 (1990).', 'Lau and Dill, "A lattice statistical mechanics model of the conformational and sequence spaces of proteins", *Macromolecules* 22, 3986 (1989) — the HP model.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — water and folding (source 9).'],
  sim: 'cell-hp-folding'
},

/* ================================================================ 5 */
{
  id: 'membranes-assemble-themselves', parent: 'the-sculptor-inside-every-cell', title: 'Membranes assemble themselves', level: 2,
  short: 'Put phospholipids in water and they form a bilayer five nanometres thick, closing into a sphere with no ends. No bond joins the lipids and no machine builds the sheet: water pushes the oily tails together, and the membrane is the arrangement in which the fewest tails touch it.',
  keywords: ['lipid bilayer', 'phospholipid', 'membrane', 'self-assembly', 'amphiphile', 'micelle', 'vesicle', 'liposome', 'critical micelle concentration', 'packing parameter', 'fluid mosaic', 'hydrophobic effect', 'cell membrane'],
  prereq: ['the-hydrophobic-effect', 'like-dissolves-like', 'the-matrix-of-life'],
  related: ['the-hydrophobic-effect-folds-proteins', 'soap-and-surfactants', 'surface-tension', 'aquaporins', 'lifes-start-in-water', 'biology:membranes', 'biology:membrane-structure', 'medicine:membrane-transport'],
  body: `
A soap bubble and a cell have something in common that is easy to miss: both are a sheet of molecules with a head that likes water and a tail that does not. Drop phospholipids in water and they do not dissolve and do not make a blob; they arrange themselves into sheets two molecules thick, the tails tucked inside and the heads facing out on both sides, and the sheet bends round into a closed bag. It takes no enzyme, no template and no energy source. The water does it.

### The shape of a lipid
A **phospholipid** has a head containing phosphate and often a charged group (choline, serine, ethanolamine), and two fatty-acid tails of 14 to 20 carbons, such as the 16-carbon palmitate. The head is polar and hydrogen-bonds to water; the tails are hydrocarbon and cannot. A molecule with both is an **amphiphile**.

### Why water pushes them together
Each tail in water makes its neighbours rearrange to avoid wasting hydrogen bonds ([[the-hydrophobic-effect]]), costing roughly 100 J/mol per Å² of exposed surface, about **3 kJ/mol for each CH₂** group. Put the tails together and the cost disappears, because they now touch each other. What stops the tails from simply clumping is the heads, which must stay in water. The arrangement that satisfies both is a sheet: tails inside, heads outside.

| Where | What the lipid does |
|---|---|
| one-tailed amphiphile (soap, detergent) | spheres of 50–100 molecules (micelles) above the critical micelle concentration — 8 mM for sodium dodecyl sulfate |
| two-tailed phospholipid | sheets and vesicles; the critical concentration is a nanomolar or less, ten million times lower |
| shape rule (packing parameter $P$) | $P < 1/3$ spheres; $1/3$–$1/2$ cylinders; $1/2$–$1$ bilayers and vesicles |

The **packing parameter** $P = v/(a\\,l_c)$ (Israelachvili, Mitchell and Ninham, 1976) compares the volume $v$ of the tails with the area $a$ of the head and the length $l_c$ of the tail. A cone-shaped one-tailed lipid (small $v$) curves into a sphere; a cylinder-shaped two-tailed lipid ($P$ near 0.8) lies flat, and flat means a bilayer.

### The numbers of a membrane
- **Thickness 5 nm** from one headgroup layer to the other; the oily core is about 3 nm. A 16-carbon chain extends at most $0.15 + 0.1265\\times16 = 2.2$ nm (Tanford).
- **Area per lipid about 0.65 nm²**, so a red blood cell, whose surface is 140 µm², has about 4 × 10⁸ lipids in the two leaflets.
- **Fluid, not rigid.** Lipids diffuse sideways at about 1 µm²/s, so one crosses a bacterium in a second, but flip from one leaflet to the other only over hours unless an enzyme helps. Singer and Nicolson\'s *fluid mosaic* model (1972) pictures proteins floating in this two-dimensional liquid.
- **Self-sealing.** A hole exposes tails to water, which costs energy, so a small tear closes. A sheet with an open edge curls into a vesicle, because a closed bag has no edge.

### What it means for life
A cell is a bag held closed by the hydrophobic effect. The same force inserts membrane proteins, whose oily belts match the oily core. The same force makes **vesicles** (liposomes), the carriers in cells and the model for the lipid nanoparticles of mRNA vaccines. And it makes the origin of cells easy: fatty acids dropped in water form vesicles on their own, and in the experiments of Szostak and colleagues such vesicles grow and divide ([[lifes-start-in-water]]).

> [!key] A membrane is not built but formed: phospholipids put in water pack tails together and heads out because that arrangement hides the most oily surface from the water. The result is a bilayer 5 nm thick that closes into a bag, with no bonds between the lipids and no energy spent.`,
  ideas: ['A phospholipid has a water-loving head and two oily tails; in water it sorts with other lipids so that tails touch tails and heads face the water.', 'The force is the hydrophobic effect, not a bond: roughly 3 kJ/mol for every CH₂ hidden from water.', 'Two tails and a cylinder shape (packing parameter near 0.8) give a bilayer; one tail and a cone give a micelle.', 'A bilayer is 5 nm thick, fluid in its plane, self-sealing, and closes into a vesicle because an open edge exposes tails.'],
  pitfalls: ['"The lipids in a membrane are chemically bonded together" — None are; the sheet is held by water pushing the tails together, which is why it is fluid and self-healing.', '"The bilayer has a hole-free inside full of water" — The core is a layer of oil about 3 nm thick that water and ions can hardly cross, which is what makes it a barrier.', '"Soap and phospholipids do the same thing" — They share the idea, but one tail makes a micelle at millimolar concentration and two tails make a sheet at nanomolar.'],
  terms: [
    { term: 'Amphiphile', also: ['amphipathic molecule', 'surfactant'], def: 'A molecule with a water-loving head and a water-avoiding tail, such as soap or a phospholipid.' },
    { term: 'Phospholipid', also: ['glycerophospholipid'], def: 'The main lipid of cell membranes: a polar phosphate-containing head and two fatty-acid tails of 14–20 carbons joined to a glycerol backbone.' },
    { term: 'Lipid bilayer', also: ['bilayer', 'membrane'], def: 'A sheet two lipids thick with the tails inside and the heads outside, about 5 nm across; the basis of every cell membrane.' },
    { term: 'Micelle', also: ['micellar aggregate'], def: 'A small sphere in which the tails of single-tailed amphiphiles gather inside and the heads face the water; forms above the critical micelle concentration.' },
    { term: 'Vesicle', also: ['liposome', 'protocell'], def: 'A closed bag of bilayer enclosing water. Cells, organelles and transport capsules are vesicles; liposomes are those made in the laboratory.' },
    { term: 'Packing parameter', also: ['critical packing parameter'], def: 'The ratio $v/(a\\,l_c)$ of tail volume to head area times tail length, which predicts the shape an amphiphile forms: below 1/3 spheres, up to 1/2 cylinders, 1/2–1 bilayers.' }
  ],
  formulas: [
    { name: 'Lipids in a membrane', expr: 'N = 2*A/a', tex: 'N = \\frac{2A}{a}',
      vars: { N: { name: 'lipid molecules' }, A: { name: 'membrane area', q: 'area', unit: 'µm²', value: 140, hint: 'A red blood cell has about 140 µm²; a bacterium 6 µm².' }, a: { name: 'area per lipid', q: 'area', unit: 'nm²', value: 0.65, hint: 'About 0.6–0.7 nm² for a fluid phospholipid.' } },
      solveFor: 'N', note: 'The factor 2 is for the two layers of the bilayer.',
      stories: { N: 'A membrane has an area of {A} and each lipid takes {a}. How many lipids does it hold?' } },
    { name: 'Packing parameter', expr: 'P = v/(a*lc)', tex: 'P = \\frac{v}{a\\,l_c}',
      vars: { P: { name: 'packing parameter' }, v: { name: 'volume of the tails (nm³)', value: 0.92, hint: 'About 0.027 + 0.027 n nm³ per chain of n carbons (Tanford): 0.46 for a 16-carbon chain.' }, a: { name: 'area of the head (nm²)', value: 0.64 }, lc: { name: 'length of the tails (nm)', value: 1.75, tex: 'l_c', hint: 'A little less than the fully stretched length 0.15 + 0.1265 n.' } },
      solveFor: 'P', note: 'Below 1/3 spheres, 1/3–1/2 cylinders (rods), 1/2–1 bilayers and vesicles. The default is a phospholipid with two 16-carbon tails (P = 0.82).',
      stories: { P: 'An amphiphile has tails of {v} nm³, a head of {a} nm² and tails {lc} nm long. What is its packing parameter?' } },
    { name: 'Length of a hydrocarbon chain', expr: 'lmax = 0.15 + 0.1265*n', tex: 'l_{\\max} = 0.15 + 0.1265\\,n',
      vars: { lmax: { name: 'extended length (nm)', tex: 'l_{\\max}' }, n: { name: 'carbon atoms in the chain', value: 16, min: 1, int: true } },
      solveFor: 'lmax', note: 'Tanford\'s formula for the fully extended chain; in a real bilayer the chain is kinked and about 70–80 % of this.',
      stories: { lmax: 'A fatty-acid tail has {n} carbon atoms. How long is it fully stretched, in nanometres?' } },
    { name: 'Lipids in a vesicle', expr: 'N = 4*pi*(R^2 + (R-d)^2)/a', tex: 'N = \\frac{4\\pi\\,[R^2 + (R-d)^2]}{a}',
      vars: { N: { name: 'lipid molecules' }, R: { name: 'outer radius', q: 'length', unit: 'nm', value: 50, min: 5 }, d: { name: 'bilayer thickness', q: 'length', unit: 'nm', value: 5, min: 0.1 }, a: { name: 'area per lipid', q: 'area', unit: 'nm²', value: 0.65 } },
      solveFor: 'N', note: 'The outer leaflet has the larger area; the inner one has radius $R-d$.',
      stories: { N: 'A vesicle of radius {R} has a bilayer {d} thick and {a} per lipid. How many lipids are in it?' } }
  ],
  examples: [
    { title: 'Lipids in a red cell', q: 'A red blood cell has a surface area of about 140 µm². Estimate its lipids, and the extent to which the two leaflets cover it.',
      steps: ['Area per lipid 0.65 nm², and 1 µm² = $10^{6}$ nm², so the surface is $1.4\\times10^{8}$ nm².', 'One layer: $1.4\\times10^{8}/0.65 = 2.2\\times10^{8}$ lipids; two layers: $4.3\\times10^{8}$.', 'Gorter and Grendel in 1925 extracted the lipids from a known number of red cells, spread them on water, and found they covered about twice the cells\' surface: the first sign of a bilayer.'],
      a: 'About 4 × 10⁸ lipids; the lipid film from a red cell covers twice its area.' },
    { title: 'Micelle or bilayer?', q: 'Sodium dodecyl sulfate has a 12-carbon tail (volume 0.35 nm³), a head of 0.57 nm² and a tail length of 1.67 nm. A phospholipid has 0.92 nm³, 0.64 nm² and 1.75 nm. What shapes do they form?',
      steps: ['SDS: $P = 0.35/(0.57\\times1.67) = 0.37$, between 1/3 and 1/2: rods and spheres (micelles).', 'Phospholipid: $P = 0.92/(0.64\\times1.75) = 0.82$, between 1/2 and 1: bilayers and vesicles.', 'The two tails roughly double the tail volume without doubling the head: the cone becomes a cylinder.'],
      a: 'SDS makes micelles ($P$ = 0.37); the phospholipid makes bilayers ($P$ = 0.82).' }
  ],
  quiz: [
    { q: 'What holds the lipids of a bilayer together?', choices: ['Covalent bonds between the tails', 'Hydrogen bonds between the heads', 'The hydrophobic effect: water pushes the tails together', 'Ionic bonds with calcium'], a: 2, why: 'There are no bonds between the lipids; the sheet exists because the arrangement hides the tails from water, so it is fluid and self-healing.' },
    { q: 'A bilayer with an open edge is stable, and closes into a vesicle only when it is forced.', a: false, why: 'An edge exposes tails to water, which costs energy; a sheet curls round to remove the edge, and closed vesicles form on their own.' },
    { q: 'A single-tailed detergent forms micelles; a two-tailed phospholipid forms bilayers because', choices: ['its head is bigger', 'its tails have a larger volume relative to the head area, so its shape is a cylinder not a cone', 'it is charged', 'it is heavier'], a: 1, why: 'The packing parameter v/(a lc) is about 0.8 for the phospholipid and 0.37 for the single-tailed lipid; the bigger value means a flat sheet.' },
    { q: 'The thickness of a lipid bilayer, headgroup to headgroup, is about', choices: ['0.5 nm', '5 nm', '50 nm', '500 nm'], a: 1, why: 'About 5 nm, with an oily core of about 3 nm; a few tens of nanometres would be thick for a membrane.' },
    { q: 'How many lipids are in the two leaflets of a vesicle of 140 µm² area, at 0.65 nm² per lipid? (give the number, in millions)', answer: 430, why: 'N = 2A/a = 2 × 140×10⁶ nm² / 0.65 nm² = 4.3×10⁸ lipids, or 430 million.' }
  ],
  applications: ['Every cell and organelle: membranes keep the inside different from the outside and carry the proteins of respiration, photosynthesis and signalling.', 'Soaps and detergents, which use the same amphiphile logic to lift oil from cloth.', 'Liposomes and lipid nanoparticles for drug delivery, including the capsules that carry mRNA vaccines.', 'Artificial cells and the study of life\'s origin, using fatty-acid vesicles.', 'Membrane filtration and synthetic bilayers for sensing.'],
  history: 'Gorter and Grendel in Leiden, 1925, extracted the lipids of red cells, spread them as a film on water and found twice the cell surface: the bilayer. Danielli and Davson proposed a sandwich model in 1935; Singer and Nicolson\'s fluid mosaic model followed in 1972. Alec Bangham made the first liposomes in the 1960s, and Charles Tanford\'s *The Hydrophobic Effect* (1973, 1980) showed that no special force is needed beyond the one in the title.',
  sources: ['Tanford, *The Hydrophobic Effect: Formation of Micelles and Biological Membranes* (2nd ed., 1980).', 'Israelachvili, Mitchell and Ninham, "Theory of self-assembly of hydrocarbon amphiphiles into micelles and bilayers", *Journal of the Chemical Society, Faraday Transactions 2* 72, 1525 (1976).', 'Alberts and colleagues, *Molecular Biology of the Cell*, chapter 10 (membrane structure).', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).'],
  sim: 'cell-bilayer'
},

/* ================================================================ 6 */
{
  id: 'dna-needs-water', parent: 'the-sculptor-inside-every-cell', title: 'DNA needs water', level: 2,
  short: 'The double helix is not one shape but two or three, and water chooses between them: the long slim B form in the wet cell, the short fat A form when the humidity drops below about 75 %. A spine of water fills the minor groove, ions hide the charge of the phosphates, and the hydrogen bonds of the base pairs work only against a background of water.',
  keywords: ['DNA', 'B-DNA', 'A-DNA', 'double helix', 'hydration', 'spine of hydration', 'minor groove', 'counter-ions', 'Manning condensation', 'base pair', 'melting temperature', 'GC content', 'Franklin', 'relative humidity'],
  prereq: ['hydration-shells-and-proteins', 'the-dielectric-constant', 'what-a-hydrogen-bond-is'],
  related: ['the-hydrophobic-effect-folds-proteins', 'membranes-assemble-themselves', 'how-salt-dissolves', 'the-matrix-of-life', 'biology:water-in-life', 'chemistry:hydrogen-bonding'],
  body: `
In 1951 Rosalind Franklin, working in London with the student Raymond Gosling, noticed that a thread of DNA photographed in X-rays gave two quite different patterns depending on how damp the air around it was. In dry air (75 % relative humidity) the fibre shortened and gave a crystalline pattern, the **A form**. In moist air (92 %) it lengthened and gave the diffuse cross of the **B form** — the famous Photo 51, which showed the helix. DNA, it turned out, has no fixed shape: its shape depends on how much water is around it.

### Two helices
| | B-DNA | A-DNA |
|---|---|---|
| where | in water, in the cell | dry fibres, RNA duplexes, DNA–RNA hybrids |
| base pairs per turn | about 10 (10.5 in solution) | 11 |
| rise per base pair | 0.34 nm | 0.26 nm |
| one turn (pitch) | 3.4 nm | 2.9 nm |
| diameter | about 2.0 nm | about 2.3 nm |
| major groove | wide, deep | narrow, very deep |
| minor groove | narrow (about 0.6 nm), deep | wide, shallow |
| water | about 20 per nucleotide, in the grooves | about 10, mostly round the phosphates |

(After Saenger. The water counts are approximate fibre and crystal values.) A third form, the left-handed Z-DNA, appears at high salt in repeating sequences. In a living cell nearly all DNA is B; RNA double helices are A-like because the extra oxygen on the ribose cannot fit the B form.

### Water in the groove
In 1981 Drew and Dickerson solved the crystal structure of a B-DNA dodecamer, CGCGAATTCGCG, and found a **spine of hydration**: a chain of water molecules running down the narrow minor groove of the AATT stretch, each bridging the edges of neighbouring bases, with a second layer of water over it. The waters are part of the structure, not a coating. Remove water (drying or adding ethanol) and the helix shortens and widens: it moves to the A form.

### Charges and ions
Each nucleotide carries one negative charge, on its phosphate; the two strands are charged every 0.17 nm along their axis. Two strands so charged would repel each other with a force that no helix could survive in an ordinary solvent. Water\'s dielectric constant of 78 ([[the-dielectric-constant]]) divides all electrical forces by 78; and positive ions (Na⁺, K⁺, Mg²⁺) crowd round the helix, so that about **76 % of the charge is neutralised** (Manning, 1969). The estimate rests on the Bjerrum length $l_B$ = 0.71 nm, the distance at which two charges in water repel by one $k_BT$: the ratio $\\xi = l_B/b$ = 0.71/0.17 = 4.2 exceeds one, so a fraction $1 - 1/\\xi$ of the charge condenses.

### Base pairs: bonds that need a background
Two hydrogen bonds join A to T and three join G to C. The surprise is how little this matters for stability. In water, every base can bond to water as well as to its partner, so the net gain from a base-pair bond is small. Measurements (Yakovchuk and colleagues, 2006) show that **stacking** of the flat bases, driven by the hydrophobic effect and by dispersion forces, supplies most of the stability of the helix. The hydrogen bonds supply **specificity**: only the right partner satisfies every donor and acceptor at once, and a wrong pair leaves bonds unsatisfied inside the helix where water cannot reach to make up for them.

GC-rich DNA melts hotter than AT-rich: three bonds and better stacking. The rule of Marmur and Doty (1962) gives the melting temperature in the usual saline buffer as $T_m = 69.3 + 0.41\\times(\\%\\text{GC})$ °C; a 41 % GC human genome melts near 86 °C, a 70 % GC bacterium near 98 °C. The copying cycle of PCR heats the DNA to 94–98 °C to make it open.

### The size of it
Human DNA has 6.2 billion base pairs in a cell\'s two copies, at 0.34 nm each: **2.1 metres** of helix, folded into a nucleus 6 µm across. It stays in its B form there because it is wet.

> [!key] DNA\'s shape is set by its water: the B form in the cell, the A form when dry. Water fills the groove with a spine of molecules, its dielectric constant lets the charged strands sit side by side, and it contributes through stacking more than the base-pair hydrogen bonds do, which provide specificity.`,
  ideas: ['DNA has two main forms: B (long and slim, in water) and A (short and wide, below about 75 % humidity or in ethanol).', 'A spine of water fills the minor groove of B-DNA and is part of the structure (Drew and Dickerson, 1981).', 'Water\'s dielectric constant and the ions around the helix hide about 76 % of the phosphate charge.', 'Base stacking supplies most of the helix\'s stability; hydrogen bonds supply specificity. GC-rich DNA melts hotter (Tm = 69.3 + 0.41 × %GC).'],
  pitfalls: ['"Hydrogen bonds between the bases hold the helix together" — They give specificity; most of the stability comes from the stacking of the bases, which water forces together.', '"DNA is a fixed structure" — It is a flexible polymer whose form changes with water, ions and sequence.', '"A–T is weaker than G–C only because it has one fewer bond" — Stacking differs too: the number of bonds is part of the difference, not all of it.'],
  terms: [
    { term: 'B-DNA', also: ['B form'], def: 'The right-handed double helix of DNA in water: about 10 base pairs per 3.4 nm turn, a narrow deep minor groove and a wide deep major groove; the form of nearly all DNA in cells.' },
    { term: 'A-DNA', also: ['A form'], def: 'The shorter, wider right-handed double helix with 11 base pairs per turn, favoured when the water activity is low and in RNA duplexes and DNA–RNA hybrids.' },
    { term: 'Spine of hydration', also: ['minor-groove water'], def: 'The chain of water molecules down the narrow minor groove of B-DNA, each bridging bases on opposite strands, seen first by Drew and Dickerson in 1981.' },
    { term: 'Counter-ion condensation', also: ['Manning condensation'], def: 'The gathering of positive ions round a highly charged polymer such as DNA, so that about 76 % of its charge is neutralised in water.' },
    { term: 'Base stacking', also: ['stacking interaction'], def: 'The attraction between neighbouring flat bases, from dispersion forces and the hydrophobic effect, which supplies most of the free energy of the double helix.' },
    { term: 'Melting temperature', also: ['Tm', 'DNA melting'], def: 'The temperature at which half of the base pairs of a DNA duplex have opened; 69.3 + 0.41 × (%GC) °C in standard saline-citrate buffer.' }
  ],
  formulas: [
    { name: 'DNA melting temperature', expr: 'Tm = 69.3 + 0.41*gc', tex: 'T_m = 69.3 + 0.41\\,\\mathrm{GC}',
      vars: { Tm: { name: 'melting temperature (°C)', tex: 'T_m' }, gc: { name: 'GC content (%)', value: 41, min: 0, max: 100, tex: '\\mathrm{GC}', hint: '41 % in the human genome, 51 % in E. coli, 35 % in yeast, 72 % in some Streptomyces.' } },
      solveFor: 'Tm', note: 'The Marmur–Doty rule for long DNA in 0.15 M NaCl with 0.015 M citrate; lower salt lowers Tm, and short strands melt lower still.',
      stories: { Tm: 'A DNA has {gc} per cent G and C. At what temperature in degrees Celsius does it melt in standard saline-citrate?', gc: 'A DNA melts at {Tm} degrees Celsius in standard saline-citrate. What is its GC content in per cent?' } },
    { name: 'The Bjerrum length', expr: 'lB = qe^2/(4*pi*eps0*er*kB*T)', tex: 'l_B = \\frac{q_e^2}{4\\pi\\varepsilon_0\\,\\varepsilon_r\\,k_B T}',
      vars: { lB: { name: 'Bjerrum length', q: 'length', unit: 'nm', tex: 'l_B' }, qe: { const: 'qe' }, eps0: { const: 'eps0' }, er: { name: 'relative permittivity of the medium', value: 78.4, min: 1, tex: '\\varepsilon_r', hint: '78.4 for water at 25 °C, about 2 for oil.' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -40 } },
      solveFor: 'lB', note: 'The distance at which the repulsion between two unit charges equals the thermal energy: 0.71 nm in water, 28 nm in oil.',
      stories: { lB: 'Two unit charges sit in a medium of relative permittivity {er} at {T}. At what separation does their electrostatic energy equal $k_BT$?', er: 'The Bjerrum length is {lB} at {T}. What is the relative permittivity of the medium?' } },
    { name: 'Fraction of DNA charge neutralised', expr: 'f = 1 - b/lB', tex: 'f = 1 - \\frac{b}{l_B}',
      vars: { f: { name: 'charge neutralised', q: 'ratio', unit: '%' }, b: { name: 'charge spacing along the axis', q: 'length', unit: 'nm', value: 0.17, hint: 'Two phosphates per 0.34 nm of rise.' }, lB: { name: 'Bjerrum length', q: 'length', unit: 'nm', value: 0.714, tex: 'l_B' } },
      solveFor: 'f', note: 'Manning\'s limiting law for a line charge with monovalent counter-ions; valid when $l_B$ exceeds $b$. For lower $l_B$ no ions condense.',
      stories: { f: 'DNA has phosphate charges every {b} along its axis in water with a Bjerrum length of {lB}. What fraction of its charge is neutralised by condensed ions?' } },
    { name: 'Length of DNA in a cell', expr: 'L = n*h', tex: 'L = n\\,h',
      vars: { L: { name: 'contour length', q: 'length', unit: 'm' }, n: { name: 'number of base pairs', value: 6.2e9, min: 1, hint: 'The two copies of the human genome in a diploid cell: 6.2 billion.' }, h: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, hint: '0.34 nm in B-DNA, 0.26 nm in A-DNA.' } },
      solveFor: 'L', note: 'About 2 m, packed into a nucleus a few micrometres across; by comparison, a 10 kb plasmid is 3.4 µm.',
      stories: { L: 'A cell has {n} base pairs of B-DNA with a rise of {h}. How long is the DNA when stretched out?' } }
  ],
  examples: [
    { title: 'Why DNA stays together in water', q: 'Estimate the Bjerrum length in water and in oil (relative permittivity 2) at 25 °C, and say what it implies for DNA.',
      steps: ['In vacuum, $q_e^2/(4\\pi\\varepsilon_0) = 2.307\\times10^{-28}$ J·m, and $k_BT = 4.11\\times10^{-21}$ J at 25 °C.', 'Water: $l_B = 2.307\\times10^{-28}/(78.4\\times4.11\\times10^{-21}) = 7.16\\times10^{-10}$ m = 0.71 nm.', 'Oil ($\\varepsilon_r = 2$): $l_B = 2.307\\times10^{-28}/(2\\times4.11\\times10^{-21}) = 28$ nm.', 'Charges spaced 0.17 nm apart are well inside both lengths, but in water 0.71 nm means ions can cancel the charge readily and the repulsion between strands is screened to a few nanometres; in oil it would reach 28 nm and the helix could not hold two phosphate strands side by side.'],
      a: '0.71 nm in water against 28 nm in oil: DNA lives where it does because water divides the electrical forces by 78.' },
    { title: 'Melting the genomes', q: 'Which melts higher: human DNA (41 % GC) or the bacterium Streptomyces (72 % GC)? By how much?',
      steps: ['Human: $69.3 + 0.41\\times41 = 86.1$ °C.', 'Streptomyces: $69.3 + 0.41\\times72 = 98.8$ °C.', 'Difference: $0.41\\times31 = 12.7$ °C.'],
      a: 'Streptomyces melts about 13 °C higher, at about 99 °C: three-bond G–C pairs and their stronger stacking.' }
  ],
  quiz: [
    { q: 'When DNA fibres are dried below about 75 % relative humidity, the helix', choices: ['becomes longer and thinner (B form)', 'becomes shorter and wider (A form)', 'comes apart into single strands', 'does not change'], a: 1, why: 'Franklin and Gosling saw the A form in dry fibres: 11 base pairs per turn and 0.26 nm per pair, against 10 and 0.34 nm for the wet B form.' },
    { q: 'The hydrogen bonds between bases provide most of the free energy that holds the double helix together.', a: false, why: 'Stacking of the bases supplies most of the stability (Yakovchuk 2006); the hydrogen bonds provide specificity, since only the right pair satisfies all donors and acceptors.' },
    { q: 'A DNA fragment with 70 % GC melts, compared with one with 30 % GC,', choices: ['at a lower temperature', 'at the same temperature', 'at a higher temperature, by about 16 °C', 'at a higher temperature, by about 100 °C'], a: 2, why: 'The Marmur–Doty rule gives 0.41 °C for each percent of GC, so 40 percentage points make 16 °C.' },
    { q: 'About what fraction of the phosphate charge on DNA is neutralised by condensed ions in water?', choices: ['10 %', '40 %', '76 %', '100 %'], a: 2, why: 'Manning\'s estimate 1 − b/lB = 1 − 0.17/0.71 = 76 %.' },
    { q: 'How long is the DNA in a diploid human cell (6.2 billion base pairs, 0.34 nm each), in metres?', answer: 2.1, unit: 'm', why: '6.2×10⁹ × 0.34×10⁻⁹ m = 2.1 m.' }
  ],
  applications: ['PCR and DNA sequencing, whose cycles depend on melting and annealing, and on primers matched in GC content.', 'DNA storage and preservation: dry DNA in the A-like state is stable for long periods in seeds and spores.', 'Drug design: many antibiotics and cancer drugs bind in the grooves, displacing the spine of hydration.', 'Gene regulation: proteins read the sequence through the shape of the grooves and the water in them (the tryptophan repressor uses water-mediated contacts).', 'Biosensors and the calculation of hybridisation for DNA microarrays and diagnostics.'],
  history: 'Franklin and Gosling published the A and B patterns in 1953 (*Nature* 171, 740), alongside Watson and Crick\'s model; Photo 51 was taken in 1952. Falk, Hartman and Lord measured the water bound to DNA in the early 1960s. Drew and Dickerson found the spine of hydration in 1981, and Manning formulated counter-ion condensation in 1969.',
  sources: ['Franklin and Gosling, "Molecular configuration in sodium thymonucleate", *Nature* 171, 740 (1953).', 'Drew and Dickerson, "Structure of a B-DNA dodecamer. III. Geometry of hydration", *Journal of Molecular Biology* 151, 535 (1981).', 'Saenger, *Principles of Nucleic Acid Structure* (1984) — the A and B parameters.', 'Marmur and Doty, "Determination of the base composition of deoxyribonucleic acid from its thermal denaturation temperature", *Journal of Molecular Biology* 5, 109 (1962).', 'Yakovchuk, Protozanova and Frank-Kamenetskii, "Base-stacking and base-pairing contributions into thermal stability of the DNA double helix", *Nucleic Acids Research* 34, 564 (2006).'],
  sim: 'cell-dna-helix'
},

/* ================================================================ 7 */
{
  id: 'water-as-a-reagent', parent: 'the-sculptor-inside-every-cell', title: 'Water as a reagent', level: 2,
  short: 'Water is not only the place where the chemistry happens, it is one of the chemicals: ATP is split by it, peptide bonds are cut by it, photosynthesis tears oxygen out of it, and respiration makes it. A person makes about 300 mL of water a day from food, and loses about as much by breathing.',
  keywords: ['hydrolysis', 'condensation reaction', 'ATP hydrolysis', 'metabolic water', 'water splitting', 'photosystem II', 'oxygen-evolving complex', 'respiration', 'peptide bond', 'camel hump', 'kangaroo rat', 'dehydration synthesis', 'nucleophile', 'water in reactions'],
  prereq: ['the-matrix-of-life', 'water-the-amphoteric', 'what-a-hydrogen-bond-is'],
  related: ['proton-wires-and-enzymes', 'lifes-start-in-water', 'water-made-the-air', 'blood-and-the-daily-budget', 'hydration-shells-and-proteins', 'biology:photosynthesis', 'biology:enzymes', 'chemistry:equilibrium'],
  body: `
Ask a chemist what water does in a reaction and the first answer is "nothing: it is the solvent". Ask a biochemist and the answer is the opposite: look at what the cell does with it. It is added to bonds to break them (hydrolysis), removed from molecules to join them (condensation), split to make oxygen and made again when the oxygen is used. Water is substrate and product of the central reactions of life, and its quantity inside the cell is not a background condition but a variable.

### Splitting with water: hydrolysis
Water is **amphoteric**: it can give or take a proton ([[water-the-amphoteric]]), and the oxygen can attack a carbon or phosphorus as a nucleophile. Hydrolysis uses both. The reaction that powers the cell is the hydrolysis of ATP:

$$\\ce{ATP + H2O -> ADP + P_i}\\qquad \\Delta G^{\\circ\\prime} = -30.5\\ \\mathrm{kJ/mol}$$

Under the conditions inside a living cell (about 3 mM ATP, 0.1 mM free ADP, 5 mM phosphate) the free energy is much larger, −50 to −65 kJ/mol. The "energy" is not stored in a fragile bond, as is often said; it comes from the products being much better solvated, with better hydrogen bonds to water and more resonance than the reactants, and from relief of charge crowding. Water is a participant in the energy.

The same reaction splits proteins (proteases), fats (lipases), starch (amylase), DNA (nucleases), and is the reverse of every polymer-building step. The enzymes called hydrolases are one of the six classes of enzyme.

### Building with water taken out
A peptide bond forms by **condensation**: two amino acids join and release a molecule of water. In water this is uphill by about +10 to +20 kJ/mol; at equilibrium in a cell, with water at 55 M, the dipeptide is a tiny fraction. The reverse is easy: the uncatalysed hydrolysis of a peptide bond in neutral water has a half-life of hundreds of years (Radzicka and Wolfenden, 1996) — slow, but it is the direction the equilibrium runs. The cell therefore builds proteins by paying with ATP and GTP and by making the active site of the ribosome a place where water is kept away; and degrades them with proteases that do in milliseconds what water would do in centuries.

### Splitting water: photosynthesis
Light makes oxygen by taking apart water: $\\ce{2H2O -> O2 + 4H+ + 4e-}$. This happens at one place in nature, the **oxygen-evolving complex** of photosystem II, a cluster of four manganese atoms and one calcium bridged by oxygens ($\\ce{Mn4CaO5}$) whose structure was seen at 1.9 Å in 2011 (Umena and colleagues). It steps through five states, taking one electron out per photon, until four have been removed and an $\\ce{O2}$ molecule leaves. That the oxygen comes from water and not from carbon dioxide was shown in 1941 by Ruben and Kamen using the heavy oxygen isotope $^{18}$O. Every breath is therefore drawn from a reaction that splits water ([[water-made-the-air]]).

### Making water: respiration
The reverse is respiration. The last enzyme of the chain, cytochrome c oxidase, takes four electrons and four protons and reduces one $\\ce{O2}$ to two $\\ce{H2O}$; burning a glucose gives six. The water so made is **metabolic water**.

| Fuel | Water made per gram | Oxygen used per gram | Energy per gram |
|---|---|---|---|
| starch | 0.56 g | 0.83 L | 17.5 kJ |
| glucose | 0.60 g | 0.75 L | 15.6 kJ |
| protein (mixed) | about 0.41 g | 0.97 L | about 18 kJ |
| fat (palmitic acid) | 1.13 g | 2.01 L | 39 kJ |

A person using 10 MJ a day makes about **300 mL** of metabolic water, one-eighth of the daily intake ([[blood-and-the-daily-budget]]).

### Camels and kangaroo rats
The camel\'s hump is fat, not water; a kilogram of fat makes 1.1 kg of water when burned, and the hump holds up to 30–40 kg of fat. But burning it needs oxygen, and every litre of oxygen breathed costs water vapour in the exhaled air, so the metabolic water is largely paid back to the lungs (the simulation counts both). The animals that live on metabolic water, such as the kangaroo rat, which can survive on dry seeds alone, do it by breathing out cool air: their long nasal passages cool the outgoing breath so that most of the vapour condenses back inside the nose (Schmidt-Nielsen).

> [!key] Water is a chemical in the cell\'s reactions: hydrolysis uses it to split ATP, proteins and polymers; condensation makes it when they are built; photosynthesis splits it to make oxygen; respiration makes about 300 mL a day of it. Because water is both a reagent and the solvent, the cell has to pay ATP to make bonds that water would break.`,
  ideas: ['Hydrolysis splits a bond by adding water; condensation joins two molecules and releases water.', 'ATP hydrolysis is −30.5 kJ/mol at standard conditions and −50 to −65 kJ/mol in the cell, partly because the products are better solvated.', 'Photosystem II splits two waters to make one O₂ at a Mn₄CaO₅ cluster; the oxygen of the air comes from water.', 'Respiration makes water: about 300 mL a day, 1.13 g per gram of fat; breathing out costs about as much.'],
  pitfalls: ['"The oxygen from photosynthesis comes from carbon dioxide" — It comes from water; Ruben and Kamen traced it with ¹⁸O in 1941.', '"ATP stores energy in a high-energy bond" — The energy is released by the hydrolysis as a whole: the products are better solvated and less crowded in charge.', '"A camel\'s hump holds water" — It holds fat; burning it produces water, but the oxygen needed costs water vapour in breathing.'],
  terms: [
    { term: 'Hydrolysis', also: ['hydrolytic cleavage'], def: 'The splitting of a bond by the addition of water, as when ATP becomes ADP and phosphate, a protein is cut, or starch is broken to glucose.' },
    { term: 'Condensation reaction', also: ['dehydration synthesis'], def: 'A reaction that joins two molecules and releases a small one, usually water, as when two amino acids form a peptide bond.' },
    { term: 'ATP', also: ['adenosine triphosphate'], def: 'The energy currency of the cell: its hydrolysis to ADP and phosphate releases 30.5 kJ/mol under standard conditions and 50–65 kJ/mol in the cell. A person turns over roughly their own body mass of it each day.' },
    { term: 'Metabolic water', also: ['oxidation water', 'water of oxidation'], def: 'The water made by the oxidation of food in the cells: about 300 mL a day in a person, 0.56 g per gram of starch and 1.13 g per gram of fat.' },
    { term: 'Oxygen-evolving complex', also: ['water-oxidising complex', 'Mn₄CaO₅ cluster'], def: 'The cluster of four manganese atoms and a calcium in photosystem II that takes four electrons from two waters and releases O₂ and four protons.' }
  ],
  formulas: [
    { name: 'Free energy of ATP hydrolysis in the cell', expr: 'dG = dG0 + R*T*ln(ADP*Pi/(ATP*c0))', tex: '\\Delta G = \\Delta G^{\\circ\\prime} + RT\\ln\\frac{\\mathrm{ADP}\\;P_{\\mathrm{i}}}{\\mathrm{ATP}\\;c_0}',
      vars: { dG: { name: 'free energy of hydrolysis', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' }, dG0: { name: 'standard free energy (pH 7)', q: 'molarenergy', unit: 'kJ/mol', value: -30.5, signed: true, tex: '\\Delta G^{\\circ\\prime}' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37, min: 0 }, ADP: { name: 'ADP (free)', q: 'concentration', unit: 'mM', value: 0.1, tex: '\\mathrm{ADP}', hint: 'Free ADP in a working cell is about 0.05–0.2 mM, far below the total.' }, Pi: { name: 'phosphate', q: 'concentration', unit: 'mM', value: 5, tex: 'P_{\\mathrm{i}}' }, ATP: { name: 'ATP', q: 'concentration', unit: 'mM', value: 3, tex: '\\mathrm{ATP}', hint: '1–5 mM in most cells.' }, c0: { name: 'standard concentration', q: 'concentration', unit: 'mol/L', value: 1, fixed: true, tex: 'c_0' } },
      solveFor: 'dG', note: 'Water does not appear in the quotient: at 55 M its concentration is taken as constant and absorbed in ΔG°′. The values give about −52 kJ/mol.',
      stories: { dG: 'In a cell at {T}, ATP is {ATP}, free ADP {ADP} and phosphate {Pi}. What is the free energy of ATP hydrolysis?' } },
    { name: 'Metabolic water from a fuel', expr: 'm = n*Mw*mf/Mf', tex: 'm_w = \\frac{n\\,M_w\\,m_f}{M_f}',
      vars: { m: { name: 'water made', q: 'mass', unit: 'g', tex: 'm_w' }, n: { name: 'water molecules made per fuel molecule', value: 6, int: true, min: 0, hint: '6 for glucose, 5 for a starch unit, 16 for palmitic acid.' }, Mw: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_w' }, mf: { name: 'mass of fuel burned', q: 'mass', unit: 'g', value: 100, tex: 'm_f' }, Mf: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 180.16, tex: 'M_f', hint: '180 for glucose, 256 for palmitic acid, 162 per starch unit.' } },
      solveFor: 'm', note: 'Complete oxidation of a carbohydrate or fat: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, C₁₆H₃₂O₂ + 23 O₂ → 16 CO₂ + 16 H₂O. Protein is about 0.41 g/g.',
      stories: { m: 'Burning {mf} of a fuel of molar mass {Mf} makes {n} waters per molecule. How much water is made?' } },
    { name: 'Half-life from a rate constant', expr: 't = ln(2)/k', tex: 't_{1/2} = \\frac{\\ln 2}{k}',
      vars: { t: { name: 'half-life', q: 'time', unit: 'yr', tex: 't_{1/2}' }, k: { name: 'first-order rate constant', q: 'rate', unit: '1/yr', value: 0.0014, hint: 'Hydrolysis of a peptide bond in neutral water: about 0.0014 per year (half-life 500 years).' } },
      solveFor: 't', note: 'For a first-order process. A protease with a turnover of 10 per second has k = 3×10⁸ per year: ten orders of magnitude faster.',
      stories: { t: 'A bond hydrolyses with a rate constant of {k}. What is its half-life?' } }
  ],
  examples: [
    { title: 'What a cell gets from ATP', q: 'At 37 °C a cell has 3 mM ATP, 0.1 mM free ADP and 5 mM phosphate. What is the free energy of hydrolysis, and how much does this differ from the standard value of −30.5 kJ/mol?',
      steps: ['Quotient (in mol/L): $0.0001\\times0.005/0.003 = 1.67\\times10^{-4}$, and $\\ln = -8.70$.', '$RT = 8.314\\times310.15 = 2.58$ kJ/mol, so $RT\\ln Q = -22.4$ kJ/mol.', '$\\Delta G = -30.5 - 22.4 = -52.9$ kJ/mol.'],
      a: 'About −53 kJ/mol: far more than the standard value, because the cell keeps ATP high and ADP and phosphate low.' },
    { title: 'Water made in a day', q: 'A person burns 100 g of fat and 250 g of starch in a day. How much metabolic water is made?',
      steps: ['Fat (palmitic acid): $16\\times18.015\\times100/256.4 = 112.4$ g.', 'Starch ($\\ce{C6H10O5}$, 5 waters per 162.1 g): $5\\times18.015\\times250/162.1 = 138.9$ g.', 'Total: $112.4 + 138.9 = 251$ g, a quarter of a litre.'],
      a: 'About 250 g of water, which with some protein reaches the usual 300 mL.' },
    { title: 'Peptide bond against protease', q: 'A peptide bond has a half-life of 500 years in neutral water. A protease cuts it with a rate constant of 10 per second. How much faster is the protease?',
      steps: ['Uncatalysed rate constant: $\\ln 2/(500\\ \\mathrm{yr}) = 0.0014$ per year $= 4.4\\times10^{-11}$ per second.', 'Enzyme: 10 per second.', 'Ratio: $10/4.4\\times10^{-11} = 2.3\\times10^{11}$.'],
      a: 'The protease is about $2\\times10^{11}$ times faster than water alone.' }
  ],
  quiz: [
    { q: 'In photosynthesis the oxygen released comes from', choices: ['carbon dioxide', 'water', 'glucose', 'the air'], a: 1, why: 'The oxygen-evolving complex of photosystem II takes electrons from water; Ruben and Kamen traced the oxygen atoms with ¹⁸O in water in 1941.' },
    { q: 'Forming a peptide bond from two amino acids in water releases a molecule of water and needs energy.', a: true, why: 'It is a condensation, uphill by 10–20 kJ/mol; the cell pays with ATP (or GTP) and keeps water away from the active site.' },
    { q: 'Burning 1 g of fat makes about how much water?', choices: ['0.1 g', '0.4 g', '1.1 g', '10 g'], a: 2, why: 'Palmitic acid makes 16 water molecules per 256 g: 1.13 g per gram, twice the 0.56 g of starch.' },
    { q: 'Why does a camel\'s hump of fat not give it much usable water?', choices: ['Burning fat makes no water', 'The oxygen needed costs water vapour in the breath, offsetting most of what is made', 'The hump is mostly water already', 'Fat cannot be burned in the cold'], a: 1, why: 'Fat makes 1.1 g of water per gram, but needs 2 litres of oxygen per gram, and breathing that much air out takes about as much vapour away.' },
    { q: 'Hydrolysis of ATP in a cell releases more energy than at standard conditions because', choices: ['the cell is warmer', 'ATP is kept high and ADP and phosphate low, so the quotient is small', 'the ATP bond is stronger in cells', 'water is more concentrated in cells'], a: 1, why: 'ΔG = ΔG°′ + RT ln Q, and with Q about 10⁻⁴ the logarithm adds −22 kJ/mol.' }
  ],
  applications: ['Digestion, which is hydrolysis by water at the active sites of amylase, lipase and the proteases.', 'Photosynthesis and artificial photosynthesis, which try to copy the water-splitting cluster to make hydrogen from sunlight.', 'The ageing and storage of foods and drugs, whose shelf-life is set by hydrolysis of esters and amides.', 'Desert biology: how animals survive without drinking, by metabolic water and by cooling the breath.', 'Biodegradable plastics and the recycling of PET, in which water cuts ester bonds.'],
  history: 'Lavoisier showed in the 1780s–90s that respiration is a slow combustion that makes water as well as carbon dioxide. Ruben and Kamen\'s ¹⁸O experiment of 1941 settled the source of photosynthetic oxygen; the five-step cycle of the water-splitting complex was worked out by Joliot and Kok around 1970. Mitchell, Boyer and Walker earned Nobel Prizes for how the hydrolysis of ATP is run in reverse; Knut Schmidt-Nielsen\'s *Desert Animals* (1964) described camels and kangaroo rats.',
  sources: ['Nelson and Cox, *Lehninger Principles of Biochemistry*, chapters on bioenergetics and photosynthesis — ATP free energies and the oxygen-evolving complex.', 'Umena, Kawakami, Shen and Kamiya, "Crystal structure of oxygen-evolving photosystem II at a resolution of 1.9 Å", *Nature* 473, 55 (2011).', 'Radzicka and Wolfenden, "Rates of uncatalyzed peptide bond hydrolysis in neutral solution", *Journal of the American Chemical Society* 118, 6105 (1996).', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — water as a reagent (source 9).'],
  sim: 'cell-metabolic-water'
},

/* ================================================================ 8 */
{
  id: 'proton-wires-and-enzymes', parent: 'the-sculptor-inside-every-cell', title: 'Proton wires and enzymes', level: 3,
  short: 'A proton in water does not travel, it is passed: each water molecule gives one proton to the next along a chain, the Grotthuss mechanism. Enzymes, pumps and the ATP synthase build these chains of water into their structure, and the proton hops along them a million times faster than the enzyme turns over.',
  keywords: ['Grotthuss mechanism', 'proton wire', 'water wire', 'proton transfer', 'carbonic anhydrase', 'bacteriorhodopsin', 'cytochrome c oxidase', 'ATP synthase', 'proton motive force', 'chemiosmosis', 'Eigen cation', 'Zundel cation', 'hydronium', 'proton mobility'],
  prereq: ['the-proton-hops', 'water-as-a-reagent', 'hydration-shells-and-proteins'],
  related: ['aquaporins', 'lifes-start-in-water', 'water-the-amphoteric', 'bonds-that-flicker', 'biology:enzymes', 'biology:photosynthesis', 'chemistry:water-autoionization'],
  body: `
A proton added to water would be expected to diffuse like any ion, shoved by collisions through the crowd. It does not. In a field its mobility is $36.2\\times10^{-8}$ m²/(V·s), seven times that of a sodium ion, though a proton is the smaller particle. The reason, proposed by Theodor von Grotthuss in 1806 and confirmed in the 1990s, is that **the proton is not carried: it is relayed**. One water molecule gives up a proton to its neighbour, that one gives another to the next, and the charge moves along the chain while the atoms hardly move.

### How the relay works
The excess proton sits as a hydronium ion, $\\ce{H3O+}$, but with a fluctuating shell: sometimes an **Eigen** cation $\\ce{H9O4+}$ (hydronium and three waters), sometimes a **Zundel** cation $\\ce{H5O2+}$ (a proton shared equally by two waters). Computer simulations by Marx, Tuckerman, Hutter and Parrinello (1999) showed that the proton passes from one form to the other, and that the slow step is not the hop itself but the breaking of a hydrogen bond in the second shell that makes the next hop possible: about a picosecond or two per hop, the time that a hydrogen bond lasts in liquid water ([[bonds-that-flicker]], [[the-proton-hops]]).

The relay needs a **continuous chain of water molecules with every hydrogen pointing the same way**, and when the proton has gone the chain points the wrong way. Before another proton can pass, the molecules must turn round. That is the restriction, and the reason that a protein needs more than a hole: it needs a hole of the right width, lined to hold waters in the right orientations.

### Four machines
- **Carbonic anhydrase II** makes carbon dioxide into bicarbonate, $\\ce{CO2 + H2O <=> HCO3- + H+}$, at $10^{6}$ turnovers per second per enzyme, one of the fastest known, within a factor of 100 of the diffusion limit. A zinc ion held by three histidines binds a water and turns it to hydroxide; the hydroxide adds to the CO₂. The rate-limiting step is getting the proton out again: it is carried from the zinc water along a **chain of two or three water molecules to His64**, which swings out and hands it to the buffer outside. Replace His64 by alanine and the rate falls ten-fold; add a buffer (imidazole) in the solution and the rate returns, as if the missing shuttle had been replaced.
- **Bacteriorhodopsin**, the purple protein of a salt-loving archaeon, absorbs green light and pumps one proton out of the cell per photon. The proton moves from the retinal to Asp85 and out along a chain of hydrogen-bonded waters and side chains; a second one is taken in from the cytoplasm at the other end. A full photocycle takes about 10 ms.
- **Cytochrome c oxidase**, the last enzyme of respiration, turns $\\ce{O2}$ into water and pumps four more protons across the mitochondrial membrane for each oxygen, along channels (the D and K channels) of chained waters.
- **ATP synthase** lets protons flow back down the gradient through a half-channel to a ring of 8–15 subunits, turning it like a water wheel; the turning shaft makes three ATP per revolution. The ring turns 100–150 times a second, and at 8 subunits in a human mitochondrion, 2.7 protons make an ATP.

### The numbers of the gradient
The membrane voltage of the inner mitochondrial membrane is about 180 mV (negative inside) with a pH difference of 0.5, together the **proton motive force** of about 200 mV, which Peter Mitchell proposed in 1961 (Nobel Prize 1978). Each mole of protons crossing it yields $F\\times\\mathrm{pmf} = 96{,}485\\times0.18 = 17$ kJ. An ATP needs about 50 kJ/mol, so 3 protons per ATP is about right — and 8 subunits give 2.7. A person turns over their own mass of ATP every day (50–75 kg) by this wheel.

### What the wire is for
The wire does not limit the speed: the proton crosses a five-water wire in about 6 ps, a million-fold faster than the enzyme turns over (1 µs). What the water wire provides is **control**: the protein can open it, close it or break it by moving one side chain or turning one molecule. The next page shows an extreme case, a channel that conducts a billion waters a second and stops every proton.

> [!key] A proton moves through water by relay along a chain of hydrogen-bonded molecules, about a picosecond per hop. Enzymes and pumps such as carbonic anhydrase (10⁶ turnovers a second), bacteriorhodopsin, cytochrome c oxidase and ATP synthase build such wires into their structure, so that the water is part of the machine.`,
  ideas: ['A proton moves through water by relay (Grotthuss): each molecule gives a proton to the next, so its mobility is 4–7 times what its size allows.', 'The slow step in each hop is the rearrangement of a hydrogen bond, about 1–2 ps; the chain must then turn round before the next proton.', 'Carbonic anhydrase (10⁶ s⁻¹) shuttles protons through a 2–3 water chain to His64; ATP synthase, bacteriorhodopsin and cytochrome c oxidase use water chains too.', 'The proton motive force of about 200 mV gives 17 kJ/mol of protons, so about 3 protons make an ATP.'],
  pitfalls: ['"A proton diffuses through water like an ion" — It hops along the hydrogen-bond network, which is why its mobility is so much higher.', '"The water wire sets the speed of the enzyme" — The wire passes protons in picoseconds; the enzyme\'s turnover of microseconds is limited by gating, conformational change and the rest of the cycle.', '"The proton in water is H⁺" — A bare proton does not exist in water; it is shared in H₃O⁺, H₅O₂⁺ or H₉O₄⁺.'],
  terms: [
    { term: 'Grotthuss mechanism', also: ['proton hopping', 'structural diffusion'], def: 'The movement of a proton through water by relay: one molecule gives a proton to its neighbour and the charge moves along while the atoms stay near their places. Proposed by Theodor von Grotthuss in 1806.' },
    { term: 'Proton wire', also: ['water wire', 'water chain'], def: 'A chain of hydrogen-bonded water molecules (sometimes with amino-acid side chains) inside a protein through which a proton can hop.' },
    { term: 'Hydronium ion', also: ['H₃O⁺', 'Eigen cation', 'Zundel cation'], def: 'The form in which a proton exists in water: H₃O⁺, with fluctuating shells, as the Eigen cation H₉O₄⁺ or the Zundel cation H₅O₂⁺ in which two waters share the proton.' },
    { term: 'Proton motive force', also: ['pmf', 'chemiosmotic potential'], def: 'The energy stored as a proton gradient across a membrane, the sum of a voltage and a pH term; about 200 mV, or 19 kJ per mole of protons, in a mitochondrion.' },
    { term: 'Carbonic anhydrase', also: ['CA II'], def: 'A zinc enzyme that converts CO₂ and water to bicarbonate and a proton at about 10⁶ turnovers per second, using a water chain to His64 to remove the proton.' },
    { term: 'ATP synthase', also: ['F₁F₀ ATPase'], def: 'The molecular turbine that makes ATP as protons flow through its membrane ring and turn a shaft; the final step of respiration and of photosynthesis.' }
  ],
  formulas: [
    { name: 'Mobility from diffusion (Einstein)', expr: 'u = qe*D/(kB*T)', tex: 'u = \\frac{q_e\\,D}{k_B T}',
      vars: { u: { name: 'mobility (m²/(V·s))' }, qe: { const: 'qe' }, D: { name: 'diffusion coefficient (m²/s)', value: 9.31e-9, min: 0, hint: '9.31×10⁻⁹ for H⁺, 1.33×10⁻⁹ for Na⁺, 2.3×10⁻⁹ for water itself.' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -40 } },
      solveFor: 'u', note: 'For H⁺ this gives 36×10⁻⁸ m²/(V·s), the measured mobility.',
      stories: { u: 'An ion has a diffusion coefficient of {D} at {T}. What is its electrical mobility?' } },
    { name: 'Time for a proton to cross a wire', expr: 't = n*tau', tex: 't = n\\,\\tau',
      vars: { t: { name: 'crossing time', q: 'time', unit: 'ps' }, n: { name: 'waters in the chain', value: 5, int: true, min: 1 }, tau: { name: 'time per hop', q: 'time', unit: 'ps', value: 1.2, tex: '\\tau', hint: 'About the hydrogen-bond lifetime, 1.2 ps at 25 °C.' } },
      solveFor: 't', note: 'The wire\'s passage time is picoseconds; the enzyme\'s cycle is microseconds, a million times slower.',
      stories: { t: 'A proton hops along {n} water molecules at {tau} per hop. How long does it take to cross?' } },
    { name: 'Energy of a proton gradient', expr: 'dG = F*pmf', tex: '\\Delta G = F\\,\\Delta p',
      vars: { dG: { name: 'free energy per mole of protons', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta G' }, F: { const: 'F' }, pmf: { name: 'proton motive force', q: 'voltage', unit: 'mV', value: 180, tex: '\\Delta p', hint: 'About 150–200 mV across the inner mitochondrial membrane.' } },
      solveFor: 'dG', note: 'One mole of charge falling through one volt yields 96.5 kJ.',
      stories: { dG: 'A membrane keeps a proton motive force of {pmf}. How much energy does each mole of protons release in crossing it?' } },
    { name: 'Protons needed to make an ATP', expr: 'n = dGatp/(F*pmf)', tex: 'n = \\frac{\\Delta G_{\\mathrm{ATP}}}{F\\,\\Delta p}',
      vars: { n: { name: 'protons per ATP' }, dGatp: { name: 'free energy of making ATP', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: '\\Delta G_{\\mathrm{ATP}}', hint: '50–65 kJ/mol in a working cell.' }, F: { const: 'F' }, pmf: { name: 'proton motive force', q: 'voltage', unit: 'mV', value: 180, tex: '\\Delta p' } },
      solveFor: 'n', note: 'The thermodynamic minimum; the c-ring of human ATP synthase has 8 subunits, so 8/3 = 2.7 protons per ATP.',
      stories: { n: 'ATP needs {dGatp} and the proton motive force is {pmf}. What is the least number of protons per ATP?' } }
  ],
  examples: [
    { title: 'Why a proton is quick', q: 'The diffusion coefficient of H⁺ in water at 25 °C is 9.3×10⁻⁹ m²/s and that of Na⁺ is 1.33×10⁻⁹. Compare their mobilities.',
      steps: ['$u = q_eD/k_BT$. At 25 °C, $q_e/k_BT = 1.602\\times10^{-19}/4.114\\times10^{-21} = 38.9\\ \\mathrm{V^{-1}}$.', 'H⁺: $u = 38.9\\times9.3\\times10^{-9} = 3.6\\times10^{-7}$ m²/(V·s).', 'Na⁺: $u = 38.9\\times1.33\\times10^{-9} = 5.2\\times10^{-8}$.', 'Ratio $= 9.3/1.33 = 7.0$.'],
      a: 'The proton is seven times more mobile than sodium; hopping is faster than any ion can push through water.' },
    { title: 'Wire against enzyme', q: 'A proton crosses a five-water wire at 1.2 ps per hop. Carbonic anhydrase turns over at 10⁶ per second. How much faster is the wire?',
      steps: ['Crossing time: $5\\times1.2 = 6$ ps.', 'Cycle time of the enzyme: $1/10^{6}$ s $= 10^{-6}$ s $= 10^{6}$ ps.', 'Ratio: $10^{6}/6 = 1.7\\times10^{5}$.'],
      a: 'The wire is about 170,000 times faster than the enzyme turns over, so something else is limiting.' }
  ],
  quiz: [
    { q: 'A proton moves through water faster than a sodium ion because', choices: ['it is lighter', 'it is passed along a chain of water molecules rather than carried', 'it is not charged', 'it moves through the molecules rather than between them'], a: 1, why: 'In the Grotthuss relay each water molecule hands on a proton, so the charge moves along the hydrogen-bond network without a particle having to travel.' },
    { q: 'The rate of carbonic anhydrase is limited by the speed of proton hopping along its water chain.', a: false, why: 'The wire passes a proton in picoseconds; the enzyme turns over in microseconds. The limits are the gating, the swing of His64 and the rest of the cycle.' },
    { q: 'A membrane has a proton motive force of 180 mV. Each mole of protons crossing it releases about', choices: ['0.2 kJ', '2 kJ', '17 kJ', '170 kJ'], a: 2, why: 'F × 0.18 V = 96,485 × 0.18 = 17.4 kJ per mole.' },
    { q: 'Why must a water chain turn round after one proton has passed?', choices: ['The molecules heat up', 'Each molecule has given a hydrogen to the next, so the chain now points the wrong way for a second proton', 'The protein closes the channel', 'The proton leaves a hole in the wire'], a: 1, why: 'The relay leaves every molecule with its bonds reversed; the orientations have to be restored before another proton can follow.' },
    { q: 'At 50 kJ/mol per ATP and 180 mV, how many protons are needed per ATP at the very least?', answer: 2.9, why: '50,000 / (96,485 × 0.18) = 2.88, so 3; the ring of 8 subunits gives 2.7 in human mitochondria.' }
  ],
  applications: ['Understanding why the fastest enzymes are as fast as they are: carbonic anhydrase underlies the carrying of CO₂ in blood and the acidity of the stomach.', 'Design of fuel-cell membranes, which conduct protons by the same relay through water-filled channels.', 'Drug design: inhibitors of carbonic anhydrase treat glaucoma and altitude sickness by their action on this enzyme.', 'Light-driven proton pumps (rhodopsins) used in optogenetics to hyperpolarise neurons.', 'Understanding the structure of acid and base solutions: the hydrogen ion in water is a relay, not a particle.'],
  history: 'Grotthuss proposed his chain mechanism in 1806, long before protons were known. Mitchell\'s chemiosmotic hypothesis (1961) made the gradient the currency of energy; Boyer and Walker explained ATP synthase\'s rotation (Nobel 1997). Silverman, Christianson and colleagues worked out the carbonic anhydrase shuttle in the 1980s–90s; Marx and colleagues\' simulations (1999) brought the Eigen and Zundel forms into one picture; Pomès and Roux explained why protein wires need the chain to reorient (2002).',
  sources: ['Marx, Tuckerman, Hutter and Parrinello, "The nature of the hydrated excess proton in water", *Nature* 397, 601 (1999).', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — water in proton transfer and enzyme mechanisms (source 9).', 'Nelson and Cox, *Lehninger Principles of Biochemistry*, chapters on oxidative phosphorylation.', 'Silverman and McKenna, "Solvent-mediated proton transfer in catalysis by carbonic anhydrase", *Accounts of Chemical Research* 40, 669 (2007).'],
  sim: { id: 'cell-water-wire', params: { mode: 'wire' } }
},

/* ================================================================ 9 */
{
  id: 'aquaporins', parent: 'the-sculptor-inside-every-cell', title: 'Aquaporins', level: 2,
  short: 'An aquaporin is a channel just wide enough for one water molecule at a time, passing about three billion a second, and yet it will not pass a single proton. Its secret is a break in the middle of the water chain and a positive charge at the narrowest point. Peter Agre found the first in red blood cells in 1988, and shared the 2003 Nobel Prize in Chemistry.',
  keywords: ['aquaporin', 'water channel', 'Peter Agre', 'AQP1', 'NPA motif', 'single file', 'proton exclusion', 'selectivity filter', 'kidney water', 'plant aquaporins', 'osmotic permeability', 'CHIP28', 'Nobel Prize 2003'],
  prereq: ['proton-wires-and-enzymes', 'membranes-assemble-themselves', 'osmosis-and-osmotic-pressure'],
  related: ['osmosis-in-cells', 'the-proton-hops', 'blood-and-the-daily-budget', 'transpiration-pull', 'water-the-amphoteric', 'biology:membrane-structure', 'biology:diffusion-osmosis', 'medicine:kidney-function', 'medicine:membrane-transport'],
  body: `
The membrane of a cell is a sheet of oil five nanometres thick, and water can cross it, slowly, by dissolving in the oil. Red blood cells and the cells of the kidney cross it a hundred times faster. By the 1980s everyone expected a channel; nobody had found one. In 1988 Peter Agre, at Johns Hopkins, was purifying the Rhesus blood-group protein and kept finding a stubborn contaminant of 28 kDa which was abundant in red cells and the kidney. In 1992 he and his colleagues put the messenger RNA for it into frog eggs, put the eggs in dilute water, and watched them swell and burst (Preston and colleagues, *Science*). The protein was a water channel. He shared the 2003 Nobel Prize in Chemistry with Roderick MacKinnon, who had solved the potassium channel.

### What it looks like
**Aquaporin-1** (AQP1) is a tetramer, four identical subunits, each with a pore of its own. The pore is an hourglass: wide at the two mouths, narrowest in two places.

- At the outer end is the **aromatic/arginine filter** (ar/R) of four residues, including an arginine. It is 2.8 Å across, the diameter of a water molecule, so water must pass **one at a time**, and the positive arginine repels any cation.
- At the middle two short helices meet, each carrying the three-residue **NPA motif** (asparagine–proline–alanine). The two asparagines donate hydrogen bonds to the oxygen of the water in the centre.

Water crosses in single file, about eight molecules in the pore at any time, at **about three billion molecules a second each way** per subunit. A red cell has about 200,000 copies, so $6\\times10^{14}$ molecules a second cross in each direction, and the roughly $2\\times10^{12}$ water molecules inside the cell are exchanged in a few milliseconds.

### Net flow is the small difference
At rest, as many molecules cross in as out; osmosis ([[osmosis-and-osmotic-pressure]]) is the slight imbalance. In single-file transport the osmotic permeability $p_f$ exceeds the diffusive permeability $p_d$ by a factor $N+1$, where $N$ is the number of molecules in the file (Finkelstein): a push on one end of the file is felt along all of it. For 300 mOsm/L, a physiological push, the net flow per channel is about 5 % of the traffic in each direction, 10⁸ molecules a second.

### The proton problem
A cell must let water through and keep protons out. A water-filled channel is a **proton wire**: the previous page showed how readily a proton hops down a chain of waters, and if the aquaporin conducted protons it would short-circuit the gradient on which the cell\'s energy depends. Two things stop them.

1. **A broken wire.** Simulations (de Groot and Grubmüller, 2001; Tajkhorshid and colleagues, 2002) show that the NPA asparagines and the dipoles of the two half-helices turn the waters in one half of the pore one way and in the other half the opposite way, so that at the centre the chain is reversed. No proton can hop across a chain of molecules that point against each other.
2. **An electrostatic barrier.** The arginine of the filter and the positive ends of the helices raise a barrier of a few tens of kJ/mol to any positive ion, including $\\ce{H3O+}$. Later simulations gave this barrier a larger share than the broken wire; both are real, and the exact split is still discussed.

Water, which needs neither a charge nor a hydrogen-bond chain with a single orientation to cross, goes straight through.

### Where they work
- **Kidney:** 180 litres a day are filtered and 99 % taken back. AQP1 does about two-thirds in the first stretch of the tubule; in the collecting duct AQP2 is inserted into the membrane when the hormone vasopressin arrives, and that decides whether the urine is dilute or concentrated ([[blood-and-the-daily-budget]]). When AQP2 or its signal fails, a person can pass many litres of dilute urine a day.
- **Eye and brain:** AQP0 in the lens, AQP1 in the cornea, AQP4 in the brain.
- **Plants:** the thale cress has 35 of them; roots, leaves and guard cells depend on them to move water into and out of cells ([[transpiration-pull]]).
- **Bacteria:** a relative, GlpF, passes glycerol instead.

> [!key] An aquaporin is a 2.8 Å pore that passes water single file at about 3 × 10⁹ molecules per second and blocks protons: the water chain is reversed at the NPA motif in the middle, and a positive arginine at the filter raises an electrostatic barrier. The cell gets fast water without losing its proton gradient.`,
  ideas: ['Agre found the first water channel in 1988 and proved it in 1992 with frog eggs that burst in dilute water; Nobel Prize 2003.', 'The pore is 2.8 Å at its narrowest, so water passes single file, at about 3 × 10⁹ molecules per second each way per subunit.', 'Protons are kept out by a water chain reversed at the central NPA motif and by an electrostatic barrier from a filter arginine and the helix dipoles.', 'The kidney, the lens, the brain, roots and leaves all use aquaporins, regulated by hormones and signals.'],
  pitfalls: ['"Water cannot cross a membrane without a channel" — It can cross slowly by dissolving in the oil; the channel makes it about ten times faster.', '"Aquaporins pump water" — They are passive: water goes where osmosis pushes it, and net flow is a small difference of two large opposite flows.', '"A channel wide enough for water passes protons too" — A proton hops along a continuous, aligned water chain, and the aquaporin breaks the chain and repels charge.'],
  terms: [
    { term: 'Aquaporin', also: ['AQP', 'water channel'], def: 'A membrane protein that forms a narrow channel passing water (and in some types glycerol) but not ions or protons; thirteen are known in humans.' },
    { term: 'Single-file transport', also: ['single-file diffusion'], def: 'Movement through a pore so narrow that molecules cannot pass each other, so that they move in order; the osmotic permeability then exceeds the diffusive one by a factor N + 1.' },
    { term: 'NPA motif', also: ['Asn–Pro–Ala motif'], def: 'Asparagine–proline–alanine: the sequence at the centre of each aquaporin subunit, where two half-helices meet and the asparagines organise the water into a reversed arrangement that blocks proton hopping.' },
    { term: 'Aromatic/arginine filter', also: ['ar/R filter', 'selectivity filter'], def: 'The narrowest part of the pore, 2.8 Å wide, lined with aromatic residues and a positively charged arginine: it admits water and repels cations.' },
    { term: 'Osmotic permeability', also: ['pf', 'Pf'], def: 'The volume of water crossing a membrane per second per unit osmotic difference; for a single channel pf is about N + 1 times pd, the diffusive permeability.' },
    { term: 'Proton exclusion', also: ['proton blocking'], def: 'The failure of a water-filled channel to conduct protons, achieved in aquaporins by reversing the orientation of the water chain at the centre and by an electrostatic barrier.' }
  ],
  formulas: [
    { name: 'Traffic through a cell\'s channels', expr: 'J = n*r', tex: 'J = n\\,r',
      vars: { J: { name: 'water molecules per second, each way', q: 'rate', unit: '1/s' }, n: { name: 'number of channels', value: 2e5, min: 0, hint: 'About 200,000 copies of AQP1 per red blood cell.' }, r: { name: 'rate per channel', q: 'rate', unit: '1/s', value: 3e9, hint: 'About 3×10⁹ per second each way (the figure usually quoted).' } },
      solveFor: 'J', note: 'The number of water molecules passing in each direction; the net flow is a small difference between the two.',
      stories: { J: 'A cell has {n} channels each passing {r}. How many water molecules cross per second in each direction?' } },
    { name: 'Time to exchange a cell\'s water', expr: 't = N/J', tex: 't = \\frac{N}{J}',
      vars: { t: { name: 'exchange time', q: 'time', unit: 'ms' }, N: { name: 'water molecules in the cell', value: 2.1e12, min: 1, hint: 'A red cell of 90 fL is about 70 % water: 2×10¹² molecules.' }, J: { name: 'traffic each way', q: 'rate', unit: '1/s', value: 6e14 } },
      solveFor: 't', note: 'The time for the cell\'s water to change for water from outside: a few milliseconds with channels, ten times longer without.',
      stories: { t: 'A cell holds {N} water molecules and exchanges {J} each way. How long does the water take to change?' } },
    { name: 'Single-file transport', expr: 'r = N + 1', tex: 'r_p = N + 1',
      vars: { r: { name: 'pf / pd (osmotic over diffusive permeability)', tex: 'r_p' }, N: { name: 'water molecules in a row in the pore', value: 9, int: true, min: 1, hint: 'About 7–10 in AQP1.' } },
      solveFor: 'r', note: 'Finkelstein\'s result for a channel in which molecules cannot pass each other: osmosis moves more water than diffusion because a push on one end is transmitted along the whole file.',
      stories: { r: 'A single-file channel holds {N} water molecules at a time. What is the ratio of its osmotic to diffusive permeability?' } },
    { name: 'Net flow as a share of the exchange', expr: 'f = (N+1)*vw*dc', tex: 'f = (N+1)\\,v_w\\,\\Delta c',
      vars: { f: { name: 'net flow / flow each way', q: 'ratio', unit: '%' }, N: { name: 'water molecules in the pore', value: 9, int: true, min: 1 }, vw: { name: 'molar volume of water', q: 'molarvolume', unit: 'cm³/mol', value: 18, tex: 'v_w' }, dc: { name: 'osmotic difference', q: 'osmol', unit: 'mOsm/L', value: 300, tex: '\\Delta c' } },
      solveFor: 'f', note: 'Valid for small osmotic differences. 300 mOsm/L is roughly all the solute of a cell on one side and none on the other.',
      stories: { f: 'A channel holds {N} waters and the osmotic difference across it is {dc}. What share of the traffic is net flow?' } }
  ],
  examples: [
    { title: 'A red cell exchanges its water', q: 'A red cell has 200,000 AQP1 subunits, each passing 3×10⁹ molecules per second in each direction, and holds 2.1×10¹² water molecules. How long does it take to exchange its water with its surroundings?',
      steps: ['Traffic each way: $2\\times10^{5}\\times3\\times10^{9} = 6\\times10^{14}$ per second.', 'Exchange time: $2.1\\times10^{12}/6\\times10^{14} = 3.5\\times10^{-3}$ s.'],
      a: 'About 3.5 ms. Without channels, passing through the oil alone, the exchange is about ten times slower — tens of milliseconds, still fast, which is why red cells swell within a second of being put in dilute water.' },
    { title: 'A push of 300 mOsm', q: 'A channel holding 9 waters sits across a membrane with an osmotic difference of 300 mOsm/L. What is the net flow, as a share of the exchange and in molecules per second?',
      steps: ['$v_w = 18\\ \\mathrm{cm^3/mol} = 1.8\\times10^{-5}\\ \\mathrm{m^3/mol}$ and $\\Delta c = 300\\ \\mathrm{mol/m^3}$.', '$f = 10\\times1.8\\times10^{-5}\\times300 = 0.054$.', 'Net flow: $0.054\\times3\\times10^{9} = 1.6\\times10^{8}$ per second.'],
      a: 'About 5 % of the traffic, 1.6×10⁸ molecules per second per channel.' }
  ],
  quiz: [
    { q: 'How did Agre\'s group show in 1992 that CHIP28 is a water channel?', choices: ['They watched it bind water by X-rays', 'Frog eggs given its messenger RNA swelled and burst in dilute water', 'They blocked it with mercury and saw the kidney stop', 'They measured its mass'], a: 1, why: 'Eggs normally resist swelling in dilute water; those expressing the protein took in water so fast that they burst.' },
    { q: 'An aquaporin passes protons readily, since protons are smaller than water molecules.', a: false, why: 'It passes no protons: the water chain is reversed at the NPA motif, so there is no relay, and the arginine of the filter and the helix dipoles raise a barrier to positive ions.' },
    { q: 'Water goes through an aquaporin one molecule at a time because', choices: ['the pump pushes them', 'the narrowest part is 2.8 Å, the width of a water molecule', 'only one molecule at a time has the right charge', 'the pore is closed most of the time'], a: 1, why: 'The pore is as wide as a single water molecule, so they pass in single file.' },
    { q: 'The net flow through an aquaporin driven by an osmotic difference compared with the exchange in each direction is', choices: ['about the same', 'much larger', 'a small fraction', 'zero'], a: 2, why: 'At 300 mOsm/L the net flow is about 5 % of the traffic each way; the two large opposite flows nearly cancel.' },
    { q: 'How many ms does a cell with 2×10¹² water molecules take to exchange its water if it has channels passing 3×10¹⁴ molecules per second each way? (number only)', answer: 6.7, why: '2×10¹² / 3×10¹⁴ s⁻¹ = 6.7×10⁻³ s = 6.7 ms.' }
  ],
  applications: ['Kidney physiology: the concentration of urine is set by inserting AQP2 into collecting-duct membranes under the control of vasopressin.', 'Plant biology: aquaporins control how fast roots take up water and how leaves lose it.', 'Desalination: membranes that copy aquaporins are being tried for energy-efficient water treatment.', 'Disease: mutations in AQP0 cause inherited cataracts; mutations in AQP2 or in its signalling cause nephrogenic diabetes insipidus.', 'Cell volume regulation and wound healing, where cells need to move water quickly.'],
  history: 'Agre found CHIP28 in red-cell membranes in 1988 and proved its function in 1992 (Preston, Carroll, Guggino and Agre). Murata and colleagues solved the structure at low resolution in 2000, Sui and colleagues at 2.2 Å in 2001. Computer simulations by de Groot and Grubmüller (2001) and Tajkhorshid and colleagues (2002) explained the single-file water and the proton block. Agre and MacKinnon shared the 2003 Nobel Prize in Chemistry.',
  sources: ['Preston, Carroll, Guggino and Agre, "Appearance of water channels in Xenopus oocytes expressing red cell CHIP28 protein", *Science* 256, 385 (1992).', 'Murata and colleagues, "Structural determinants of water permeation through aquaporin-1", *Nature* 407, 599 (2000).', 'Agre, Nobel Lecture, "Aquaporin water channels" (2003).', 'de Groot and Grubmüller, "Water permeation across biological membranes: mechanism and dynamics of aquaporin-1 and GlpF", *Science* 294, 2353 (2001).'],
  sim: { id: 'cell-water-wire', params: { mode: 'aqp' } }
},

/* ================================================================ 10 */
{
  id: 'osmosis-in-cells', parent: 'the-sculptor-inside-every-cell', title: 'Osmosis in cells', level: 2,
  short: 'A red blood cell kept in 0.9 % salt solution (about 290 mOsm/kg) keeps its shape; in pure water it swells and bursts; in 3 % salt it shrivels. A plant cell swells until its wall pushes back at up to 1 MPa, and a pond protist pumps the water out as fast as it leaks in. All follow from one pressure, osmotic pressure, which at body temperature is 7.5 atmospheres.',
  keywords: ['osmosis', 'osmolarity', 'tonicity', 'isotonic', 'hypotonic', 'hypertonic', 'red blood cell', 'haemolysis', 'crenation', 'turgor pressure', 'plasmolysis', 'water potential', 'contractile vacuole', 'saline', 'pump-leak', 'wilting'],
  prereq: ['osmosis-and-osmotic-pressure', 'how-much-water-we-are', 'membranes-assemble-themselves'],
  related: ['aquaporins', 'blood-and-the-daily-budget', 'colligative-properties', 'transpiration-pull', 'roots-and-root-pressure', 'the-salt-of-the-sea', 'biology:diffusion-osmosis', 'biology:water-potential', 'medicine:electrolytes'],
  body: `
Put three drops of blood in three tubes: pure water, 0.9 % salt solution and 3 % salt solution. In the first the red cells burst, and the drop turns clear red. In the second they sit unchanged, round-edged discs. In the third they shrink and bristle with spikes. The membrane that holds them lets water through easily and salt hardly at all, and what happens is **osmosis**: water goes to the side that has more dissolved particles, until the pressure, or the cell, gives way.

### Osmotic pressure, in numbers
The pressure that would stop the flow is $\\Pi = c\\,RT$, with $c$ the **osmolarity**, the number of moles of dissolved particles per cubic metre ([[osmosis-and-osmotic-pressure]]). For blood plasma at 37 °C:

- osmolality about 290 mOsm/kg (275–295; laboratory ranges vary), so $c$ = 290 mol/m³,
- $\\Pi = 290\\times8.314\\times310 = 748$ kPa, **7.4 atmospheres**.

That is a lot of pressure to hold in a membrane 5 nm thick. It does not matter while both sides match.

| Solution | Particles (mOsm/L) | Effect on a red cell |
|---|---|---|
| pure water | 0 | swells and bursts at once |
| 0.45 % NaCl | about 145 | swells to a sphere; the weakest cells burst |
| 0.9 % NaCl ("normal saline") | about 286 | stays a biconcave disc: isotonic |
| 3 % NaCl | about 920 | loses half its volume; spiky (crenated) |

The 0.9 % figure is 154 mmol/L of NaCl giving two particles each, $308$ mOsm/L if the ions were independent, 286 mOsm/kg measured, because sodium and chloride attract a little (osmotic coefficient 0.93).

### Why animal cells do not just swell
Inside every cell there are large, charged molecules (proteins, nucleic acids) that cannot leave. Their counter-ions are osmotically active, and left alone they would pull water in until the cell burst. Animal cells prevent this by **pumping**: the sodium–potassium ATPase throws sodium out, so that sodium, in effect, is a particle that stays outside. This is the pump–leak balance of Tosteson and Hoffman (1960), and it is why poisoning the pump with ouabain makes cells swell. A large share of the energy a resting cell uses goes into keeping its volume.

### The red cell as a ruler
A red cell has a volume of 90 fL and a membrane area of 140 µm², and the membrane does not stretch more than a few per cent. A sphere with that area holds 156 fL, about 1.7 times as much. So the cell can swell only to a sphere, and then it bursts. Its volume follows the **Boyle–van't Hoff law**,

$$V/V_0 = V_b/V_0 + (1 - V_b/V_0)\\,\\frac{c_0}{c},$$

with about a fifth of its volume $V_b$ being solids that are not osmotically active. In 0.45 % saline (145 mOsm/L) it gives $0.2 + 0.8\\times290/145 = 1.8$: the edge of bursting. The classical test of osmotic fragility finds the first red cells bursting at about 0.45 % and all by 0.3 %.

### Walls, and the plant cell
A plant cell has a wall, and so it can swell until the wall pushes back. The balance is written as a **water potential**, $\\Psi = P - \\Pi$, where $P$ is the pressure the wall exerts (the **turgor pressure**) and $\\Pi$ the osmotic pressure of the cell sap. Water moves from high $\\Psi$ to low. In pure water the cell swells until $P = \\Pi$, which in a typical cell of 400 mOsm/L is about 1 MPa — ten atmospheres, the pressure in a bicycle tyre, and the reason plants stand up without bones. Put it in a solution stronger than the sap and water leaves: first $P$ falls to zero (the wilting point), then the living part pulls away from the wall (**plasmolysis**). Turgor opens the stomata, extends root tips and pushes pollen tubes; bacteria also have walls, with turgor of 0.3 MPa in gram-negative and up to 2 MPa in gram-positive cells.

### Pumping out the pond
A freshwater protist such as *Paramecium* lives in water of a few mOsm/L with an interior of about a hundred, and has no wall. Water streams in, and a **contractile vacuole** collects it and squirts it out: filling and emptying every ten seconds or so, expelling a volume equal to the cell\'s in under an hour. Put the cell in stronger solution and the rate falls and stops when the inside and outside match; poison the pump and it swells and bursts. This is the pump of the pump–leak story made visible.

> [!key] Cells are osmometers: water crosses their membranes towards the side with more dissolved particles, with a pressure of 7.4 atm at body temperature. A red cell stays put at 290 mOsm/L, bursts below about 145 and shrivels above, a plant cell stops swelling when its wall pushes back at up to 1 MPa, and a pond protist spends its energy pumping the water out.`,
  ideas: ['The osmotic pressure of body fluids is Π = cRT: 290 mOsm/L at 37 °C gives 748 kPa, 7.4 atm.', 'A red cell keeps its shape in 0.9 % NaCl, bursts below about 0.45 % (when it reaches a sphere, 1.7–1.8 × normal volume) and crenates above.', 'Animal cells hold their volume by pumping sodium out; plant cells by a wall (turgor up to ~1 MPa); freshwater protists by a contractile vacuole.', 'Water potential Ψ = P − Π decides the direction in plants: water moves to lower Ψ.'],
  pitfalls: ['"Isotonic means the same salt concentration" — It means the same effective particle concentration for particles that cannot cross the membrane. Urea at 290 mOsm/L is isosmotic with plasma but not isotonic, because it crosses and the cell swells.', '"Osmosis is water being pulled by the salt" — Water moves because its free energy is higher on the dilute side; nothing pulls on it in particular.', '"A plant cell in pure water would burst like a red cell" — Its wall pushes back at about 1 MPa and stops the flow.'],
  terms: [
    { term: 'Tonicity', also: ['isotonic', 'hypotonic', 'hypertonic'], def: 'The effect of a solution on cell volume: isotonic leaves it unchanged, hypotonic makes the cell swell, hypertonic makes it shrink. It depends on the particles that cannot cross the membrane, unlike osmolarity.' },
    { term: 'Osmolality', also: ['osmolarity', 'mOsm/kg'], def: 'The concentration of osmotically active particles in a solution, in milliosmoles per kilogram of water (osmolality) or per litre of solution (osmolarity). Plasma: about 275–295 mOsm/kg.' },
    { term: 'Turgor pressure', also: ['turgor'], def: 'The pressure inside a walled cell that presses the contents against the wall: 0.5–1 MPa in typical plant cells, which keeps them rigid.' },
    { term: 'Water potential', also: ['Ψ', 'psi'], def: 'The free energy of water per unit volume, relative to pure water at atmospheric pressure, in pascals: Ψ = P − Π (plus minor terms). Water flows from high to low Ψ.' },
    { term: 'Plasmolysis', also: ['protoplast shrinkage'], def: 'The shrinking of a plant cell\'s living part away from its wall when it is placed in a solution stronger than its sap.' },
    { term: 'Contractile vacuole', also: ['water expulsion vesicle'], def: 'An organelle of freshwater protists that collects the water leaking in by osmosis and pumps it out, filling and emptying every few seconds.' }
  ],
  formulas: [
    { name: 'Osmotic pressure', expr: 'p = osm*R*T', tex: '\\Pi = c\\,R\\,T',
      vars: { p: { name: 'osmotic pressure', q: 'pressure', unit: 'kPa', tex: '\\Pi' }, osm: { name: 'osmolarity', q: 'osmol', unit: 'mOsm/L', value: 290, tex: 'c', hint: '275–295 for plasma; 1,100 for sea water; 50–1,200 for urine.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37, min: -10 } },
      solveFor: 'p', note: 'The van \'t Hoff law, valid for dilute solutions; at the strength of body fluids the real pressure differs from it by a few per cent.',
      stories: { p: 'A solution has an osmolarity of {osm} at {T}. What is its osmotic pressure?', osm: 'A solution has an osmotic pressure of {p} at {T}. What is its osmolarity?' } },
    { name: 'Volume of a red blood cell', expr: 'v = vb + (1-vb)*c0/c', tex: 'v = v_b + (1 - v_b)\\,\\frac{c_0}{c}',
      vars: { v: { name: 'volume relative to normal' }, vb: { name: 'non-osmotic share of the volume', q: 'ratio', unit: '%', value: 0.2, min: 0, max: 0.9, tex: 'v_b', hint: 'About a fifth to a quarter: haemoglobin and membrane that take no part in osmosis.' }, c0: { name: 'normal osmolarity', q: 'osmol', unit: 'mOsm/L', value: 290, fixed: true, tex: 'c_0' }, c: { name: 'osmolarity outside', q: 'osmol', unit: 'mOsm/L', value: 150, min: 1 } },
      solveFor: 'v', note: 'The Boyle–van\'t Hoff law. The cell bursts when v exceeds about 1.7–1.8, the volume of a sphere with the membrane\'s area.',
      stories: { v: 'A red blood cell is put in a solution of {c}. What is its volume relative to normal?', c: 'A red cell has a relative volume of {v}. What is the osmolarity outside?' } },
    { name: 'Water potential of a plant cell', expr: 'psi = P - osm*R*T', tex: '\\Psi = P - c\\,R\\,T',
      vars: { psi: { name: 'water potential', q: 'pressure', unit: 'MPa', signed: true, tex: '\\Psi' }, P: { name: 'turgor pressure', q: 'pressure', unit: 'MPa', value: 0.6, min: 0 }, osm: { name: 'osmolarity of the sap', q: 'osmol', unit: 'mOsm/L', value: 400, tex: 'c', hint: '300–600 in most leaves.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: -10 } },
      solveFor: 'psi', note: 'Zero in pure water at atmospheric pressure; a cell takes up water when its Ψ is below that of its surroundings. Matric terms are neglected.',
      stories: { psi: 'A plant cell with sap at {osm} has a turgor of {P} at {T}. What is its water potential?', P: 'A cell\'s sap is {osm} at {T} and its water potential is {psi}. What is its turgor?' } },
    { name: 'Osmolality of a salt solution', expr: 'osm = i*phi*w/Mm', tex: 'c = \\frac{i\\,\\phi\\,w}{M}',
      vars: { osm: { name: 'osmolarity', q: 'osmol', unit: 'mOsm/L', tex: 'c' }, i: { name: 'ions per formula unit', value: 2, int: true, min: 1, hint: '2 for NaCl, 3 for CaCl₂.' }, phi: { name: 'osmotic coefficient', value: 0.93, min: 0.5, max: 1.2, tex: '\\phi', hint: '0.93 for NaCl near 0.15 mol/L.' }, w: { name: 'mass concentration', q: 'density', unit: 'g/L', value: 9, hint: '9 g/L is 0.9 % NaCl.' }, Mm: { name: 'molar mass of the salt', q: 'molarmass', unit: 'g/mol', value: 58.44, tex: 'M', hint: '58.44 for NaCl.' } },
      solveFor: 'osm', note: 'Gives 286 mOsm/L for 0.9 % saline; with φ = 1 it would be 308.',
      stories: { osm: 'A solution has {w} of a salt of molar mass {Mm} giving {i} ions per unit with osmotic coefficient {phi}. What is its osmolarity?' } }
  ],
  examples: [
    { title: 'Seven atmospheres inside a cell', q: 'Plasma at 37 °C has 290 mOsm/kg. Estimate its osmotic pressure, and the pressure that a plant cell with sap of 400 mOsm/L at 20 °C can reach.',
      steps: ['Plasma: $\\Pi = 290\\times8.314\\times310.15 = 7.48\\times10^{5}$ Pa = 748 kPa = 7.4 atm.', 'Plant sap: $\\Pi = 400\\times8.314\\times293.15 = 9.75\\times10^{5}$ Pa = 0.97 MPa = 9.6 atm.', 'In pure water the plant cell swells until its wall pushes back with this pressure.'],
      a: 'About 7.4 atm for plasma and about 9.6 atm (1 MPa) for the plant cell.' },
    { title: 'Where a red cell bursts', q: 'A red cell has 20 % non-osmotic volume and bursts at 1.8 times its normal volume. At what osmolarity outside does it burst?',
      steps: ['Boyle–van\'t Hoff: $1.8 = 0.2 + 0.8\\times290/c$.', 'So $290/c = 1.6/0.8 = 2.0$ and $c = 145$ mOsm/L.', 'In sodium chloride, 1 mOsm/L is $58.44/(2\\times0.93) = 31.4$ mg/L, so 145 mOsm/L is 4.6 g/L, or 0.46 %.'],
      a: 'At about 145 mOsm/L, 0.46 % NaCl, which matches the classical onset of haemolysis at about 0.45 %.' }
  ],
  quiz: [
    { q: 'Red blood cells in pure water will', choices: ['shrink', 'stay the same', 'swell and burst', 'divide'], a: 2, why: 'Water flows in towards the higher particle concentration inside; the membrane cannot stretch to hold more than a sphere of its area, so the cell bursts.' },
    { q: 'A solution of urea at the same osmolarity as plasma is isotonic with it.', a: false, why: 'Urea crosses the membrane, so it does not hold water outside the cell: it is isosmotic but hypotonic, and red cells in it swell.' },
    { q: 'Why does a plant cell in pure water not burst?', choices: ['Its membrane is stronger', 'Its wall pushes back with a turgor pressure that matches the osmotic pressure of the sap', 'It has no water channels', 'It pumps out the water'], a: 1, why: 'Water enters until the wall\'s pressure P equals the osmotic pressure Π of the sap (about 1 MPa); then Ψ = P − Π = 0 and the flow stops.' },
    { q: 'What is the osmotic pressure, in kPa, of plasma at 290 mOsm/L and 37 °C?', answer: 748, unit: 'kPa', why: 'Π = cRT = 290 × 8.314 × 310.15 = 748 kPa, about 7.4 atmospheres.' },
    { q: 'A freshwater protist is moved from pond water to a solution of 100 mOsm/L, equal to its interior. Its contractile vacuole', choices: ['beats faster', 'beats at the same rate', 'slows down and stops', 'bursts'], a: 2, why: 'With no net water entering, there is nothing to pump out; the vacuole\'s rate falls with the difference in osmolarity across the membrane.' }
  ],
  applications: ['Intravenous fluids are made isotonic (0.9 % saline, 5 % glucose with its salts) so as not to burst or shrink blood cells; pure water is never given into a vein.', 'Food preservation: salt and sugar draw water out of bacteria by osmosis.', 'Wilting and watering: plants stand by turgor, and fail when the soil is saline or dry.', 'Dialysis and kidney physiology, which manage the osmolarity of the blood ([[blood-and-the-daily-budget]]).', 'Cryopreservation, where cells have to be dehydrated before freezing so as not to burst with ice.'],
  history: 'Nollet saw osmosis in a pig\'s bladder in 1748; Dutrochet named it in 1826. Pfeffer measured osmotic pressure with a copper-ferrocyanide membrane in 1877, and van \'t Hoff showed in 1885–86 that it followed the gas law for solutes, work that earned the first Nobel Prize in Chemistry (1901). Hamburger measured the osmotic behaviour of red cells around 1900; Tosteson and Hoffman gave the pump–leak model in 1960.',
  sources: ['Alberts and colleagues, *Molecular Biology of the Cell*, chapter 11 (osmosis and the control of cell volume).', 'Taiz and Zeiger, *Plant Physiology*, chapters on water potential and turgor.', 'Guyton and Hall, *Textbook of Medical Physiology*, the chapter on the transport of substances through membranes — osmosis and osmolality.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).'],
  sim: 'cell-osmosis'
},

/* ================================================================ 11 */
{
  id: 'blood-and-the-daily-budget', parent: 'the-sculptor-inside-every-cell', title: 'Blood and the daily water budget', level: 2,
  short: 'Blood is a tissue that is 55 % plasma, and plasma is 92 % water. A person takes in about 2.5 litres a day (drinks, food and the water of metabolism) and loses the same by urine, skin and breath. Thirst begins when the water in the body falls by 1–2 % of body mass; the kidneys keep the books.',
  keywords: ['blood plasma', 'water balance', 'daily water intake', 'dehydration', 'thirst', 'urine', 'insensible loss', 'sweat', 'ADH', 'vasopressin', 'hyponatraemia', 'water intoxication', 'hydration', 'plasma osmolality'],
  prereq: ['how-much-water-we-are', 'osmosis-in-cells', 'aquaporins'],
  related: ['drinking-water-and-thirst', 'water-as-a-reagent', 'the-body-at-37-degrees', 'evaporative-cooling', 'the-hydrophobic-effect-folds-proteins', 'medicine:electrolytes', 'medicine:blood-composition', 'medicine:kidney-function', 'medicine:membrane-transport'],
  body: `
A litre of blood weighs 1.05 kg. Spin it in a centrifuge and it separates into a red layer at the bottom (the cells, about 45 % of the volume, the *haematocrit*) and a straw-coloured layer above (the **plasma**, 55 %). The plasma is 92 % water, with about 7 % protein (mostly albumin) and 1 % salts, sugar and other small molecules. A body holds about five litres of blood and three of plasma ([[how-much-water-we-are]]). This is the stream through which all the body\'s water passes.

### The daily budget
| In | Litres a day | Out | Litres a day |
|---|---|---|---|
| drinks | about 1.4 (1.0–2.0, widely variable) | urine | about 1.5 (0.8–2.0) |
| water in food | about 0.8 | skin (diffusion and sweat) and breath | about 0.9 |
| metabolic water ([[water-as-a-reagent]]) | about 0.3 | faeces | about 0.1 |
| **total** | **about 2.5** | **total** | **about 2.5** |

These are averages for a sedentary adult in a temperate climate and they hide wide ranges. Sweating in the heat or exercise adds 0.5–2 litres an hour, so that a hot working day can use 8–10 litres. Food supplies a third of the intake, and coffee and tea contribute to it nearly as much as plain water: the oft-repeated "eight glasses a day" was examined by Valtin in 2002, who found no scientific basis for it.

### How the kidneys keep the books
The kidneys filter 180 litres of plasma a day and take back 99 % of it. The part they let go is the control: if the body has too much water, urine can be dilute, as low as 50 mOsm/kg and up to about a litre an hour; if too little, it can be concentrated to 1,200 mOsm/kg. Because the body must excrete 600–800 mOsm of solute a day (urea, salts), the smallest possible urine is about **0.5 litre a day**. Whatever the intake, the output follows, within hours.

### Thirst and the hormone
The controller is the osmolality of the plasma, held at 285–295 mOsm/kg. Sensors in the brain (osmoreceptors) detect a rise of 1–2 %, which happens when the body loses a litre or so of water, and cause two things: the pituitary releases **antidiuretic hormone** (vasopressin), which inserts aquaporin-2 into the collecting ducts of the kidney ([[aquaporins]]) and so retrieves water into the blood; and, a little higher, **thirst**. At about 1–2 % loss of body mass thirst is felt; a fall in blood volume of 8–10 % triggers a second system, which retains salt as well. The simulation follows the arithmetic for three days.

> [!warn] **Dehydration and heat illness.** Dark urine, dry mouth, headache and tiredness are early signs. Confusion, fainting, a very fast heartbeat, hot dry skin, being unable to keep fluids down, or passing almost no urine for many hours can mean a medical emergency: call your local emergency number. This page explains how the body handles water; it is not advice on how much any person should drink, which depends on health, medicines and conditions, and is a question for a doctor, nurse or pharmacist.

### When water is too much
Blood sodium is normally 135–145 mmol/L (reference ranges vary with the laboratory, and in the US the unit mEq/L is numerically the same). Drink much more than the kidneys can pass (their limit is about 0.7–1 litre an hour at most), and the extra dilutes the sodium: 4 extra litres in 42 lowers 140 to 128 mmol/L. This is **hyponatraemia**, and as the blood becomes weaker than the cells, water enters the cells, including the brain. In a study of the 2002 Boston Marathon, 13 % of runners finished with blood sodium below 135 mmol/L and 0.6 % below 120 (Almond and colleagues, 2005); the likeliest cause was drinking more than was lost, together with the hormone that holds water. The simulation shows how it happens: 5 litres drunk within 2 hours sends the sodium below the line.

> [!warn] **Overhydration.** Severe headache, nausea and vomiting, confusion, or a seizure after drinking a great deal of water in a short time can be life-threatening: call your local emergency number. Do not wait for it to pass.

### What keeps the water in the vessels
Plasma proteins, which cannot leave the capillaries, hold water in by their own osmotic pressure, the **oncotic pressure**, about 25 mmHg (3.3 kPa). That is only a thousandth of the total osmotic pressure of the blood (748 kPa), but it is the part that matters across the capillary wall, which lets salt through. When it falls, or the capillary pressure rises, water seeps into the tissue as swelling (oedema).

> [!key] Blood is 55 % plasma and plasma is 92 % water. A person turns over about 2.5 L a day, in by drink, food and metabolism and out by urine, skin and breath; the kidneys match the output to the intake by concentrating or diluting the urine under the control of plasma osmolality, which sets thirst at about 1–2 % loss and hormones that retain water.`,
  ideas: ['Blood is about 45 % cells and 55 % plasma; plasma is 92 % water, with 7 % protein.', 'A person takes in and loses about 2.5 L a day: drinks 1.4, food 0.8, metabolism 0.3 in; urine 1.5, skin and breath 0.9, faeces 0.1 out.', 'Plasma osmolality (285–295 mOsm/kg) is the control signal: a 1–2 % rise triggers ADH and thirst, and the kidneys can concentrate urine to 1,200 or dilute it to 50.', 'Drinking faster than the kidneys can pass (about 0.7–1 L an hour) dilutes the blood sodium: hyponatraemia, a danger in endurance events.'],
  pitfalls: ['"You must drink eight glasses of water a day" — There is no scientific basis for that exact figure (Valtin, 2002); needs vary with size, climate, work and diet, and food and other drinks count.', '"Thirst means you are already badly dehydrated" — Thirst begins at a loss of about 1–2 % of body mass, a litre or so: the body\'s early warning.', '"More water is always better" — The kidneys can pass only about a litre an hour; drinking beyond that for hours dilutes the blood and can be dangerous.'],
  terms: [
    { term: 'Plasma', also: ['blood plasma'], def: 'The liquid part of blood after the cells are removed: about 55 % of the volume, 92 % water, with about 7 % protein and 1 % salts and other small molecules.' },
    { term: 'Insensible water loss', also: ['insensible loss'], def: 'Water lost without being noticed, by diffusion through the skin and by evaporation from the lungs: about 0.7–0.9 L a day at rest, more in dry air or heat. Sweat is sensible loss.' },
    { term: 'Antidiuretic hormone', also: ['ADH', 'vasopressin', 'AVP'], def: 'A hormone released by the pituitary when plasma osmolality rises or blood volume falls: it inserts aquaporin-2 into the collecting ducts of the kidney, so that more water is reabsorbed and the urine becomes concentrated.' },
    { term: 'Dehydration', also: ['water deficit'], def: 'A loss of body water greater than its replacement. Thirst begins at about 1–2 % of body mass; marked effects follow at 5 % and danger at more.' },
    { term: 'Hyponatraemia', also: ['low blood sodium', 'water intoxication'], def: 'Blood sodium below about 135 mmol/L (reference ranges vary), most often from too much water relative to sodium; it makes cells, including brain cells, swell.' },
    { term: 'Oncotic pressure', also: ['colloid osmotic pressure'], def: 'The osmotic pressure of the plasma proteins, about 25 mmHg (3.3 kPa), which keeps water in the capillaries.' }
  ],
  formulas: [
    { name: 'Daily water balance', expr: 'dW = drink + food + meta - urine - skin - faeces', tex: '\\Delta W = I_d + I_f + I_m - O_u - O_s - O_f',
      vars: { dW: { name: 'net gain per day', q: 'volume', unit: 'L', signed: true, tex: '\\Delta W' }, drink: { name: 'drinks', q: 'volume', unit: 'L', value: 1.4, tex: 'I_d' }, food: { name: 'water in food', q: 'volume', unit: 'L', value: 0.8, tex: 'I_f' }, meta: { name: 'metabolic water', q: 'volume', unit: 'L', value: 0.3, tex: 'I_m' }, urine: { name: 'urine', q: 'volume', unit: 'L', value: 1.5, tex: 'O_u' }, skin: { name: 'skin, sweat and breath', q: 'volume', unit: 'L', value: 0.9, tex: 'O_s' }, faeces: { name: 'faeces', q: 'volume', unit: 'L', value: 0.1, tex: 'O_f' } },
      solveFor: 'dW', note: 'Zero for a person in balance; the kidneys adjust the urine so that it stays near zero over a few days.',
      stories: { dW: 'In a day a person drinks {drink}, eats {food} of water, makes {meta}, and loses {urine} in urine, {skin} through skin and breath and {faeces} in stool. What is the net change?', drink: 'A person loses {urine} in urine, {skin} through skin and breath and {faeces} in stool, takes {food} in food and {meta} from metabolism and is in balance ({dW}). How much did they drink?' } },
    { name: 'Calculated plasma osmolality', expr: 'osm = 2*Na + glu + urea', tex: 'c = 2\\,[\\mathrm{Na}] + [\\mathrm{Glu}] + [\\mathrm{Urea}]',
      vars: { osm: { name: 'osmolality', q: 'osmol', unit: 'mOsm/L', tex: 'c' }, Na: { name: 'sodium', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\mathrm{Na}', hint: 'Reference range about 135–145 mmol/L; varies by laboratory.' }, glu: { name: 'glucose', q: 'concentration', unit: 'mmol/L', value: 5, tex: '\\mathrm{Glu}', hint: 'About 4–6 mmol/L (70–110 mg/dL) fasting.' }, urea: { name: 'urea', q: 'concentration', unit: 'mmol/L', value: 5, tex: '\\mathrm{Urea}', hint: 'About 2.5–7 mmol/L (blood urea nitrogen 7–20 mg/dL).' } },
      solveFor: 'osm', note: 'The doubling of sodium accounts for its accompanying anions. Measured values run a few mOsm higher.',
      stories: { osm: 'A blood test gives sodium {Na}, glucose {glu} and urea {urea}. What is the calculated osmolality?' } },
    { name: 'Sodium after extra water', expr: 'Na2 = Na1*V/(V+dV)', tex: '\\mathrm{Na}_2 = \\mathrm{Na}_1\\,\\frac{V}{V + \\Delta V}',
      vars: { Na2: { name: 'sodium after', q: 'concentration', unit: 'mmol/L', tex: '\\mathrm{Na}_2' }, Na1: { name: 'sodium before', q: 'concentration', unit: 'mmol/L', value: 140, tex: '\\mathrm{Na}_1' }, V: { name: 'total body water', q: 'volume', unit: 'L', value: 42 }, dV: { name: 'extra water retained', q: 'volume', unit: 'L', value: 4, min: 0, tex: '\\Delta V' } },
      solveFor: 'Na2', note: 'A simple dilution assuming no sodium is lost and water spreads through all compartments; real cases differ in detail but show the size of the effect.',
      stories: { Na2: 'A person with {V} of body water and blood sodium of {Na1} retains an extra {dV} of plain water. What does the sodium become?' } },
    { name: 'Share of body mass lost as water', expr: 'd = dW*rhoW/m', tex: 'd = \\frac{\\Delta W\\,\\rho_w}{m}',
      vars: { d: { name: 'loss of body mass', q: 'ratio', unit: '%' }, dW: { name: 'water lost', q: 'volume', unit: 'L', value: 1.4, tex: '\\Delta W' }, rhoW: { const: 'rhoW' }, m: { name: 'body mass', q: 'mass', unit: 'kg', value: 70, min: 2 } },
      solveFor: 'd', note: 'A loss of 1–2 % of body mass is where thirst begins; 5 % causes marked weakness; much beyond that is dangerous.',
      stories: { d: 'A {m} person loses {dW} of water. What share of body mass is that?' } }
  ],
  examples: [
    { title: 'A day in balance', q: 'Add up the default budget and say what the kidneys must do if the drinks fall from 1.4 to 0.5 litres.',
      steps: ['In: $1.4 + 0.8 + 0.3 = 2.5$ L. Out: $1.5 + 0.9 + 0.1 = 2.5$ L: balance.', 'With 0.5 L of drinks, in = 1.6 L. The skin, breath and faeces still lose 1.0 L (they do not adjust much), so urine must be $1.6 - 1.0 = 0.6$ L.', 'That is 700 mOsm in 0.6 L, 1,170 mOsm/L: nearly the kidney\'s concentrating limit of 1,200, and plasma osmolality rises into the thirst range.'],
      a: 'Urine falls to about 0.6 L and becomes very concentrated; any further cut would go straight into a water deficit.' },
    { title: 'Too much, too fast', q: 'A runner of 70 kg with 42 L of body water and a sodium of 140 mmol/L drinks 5 L in 2 hours while the kidneys, holding water back, pass 0.5 L an hour. What happens to the sodium?',
      steps: ['Retained: $5 - 2\\times0.5 = 4$ L.', 'Sodium: $140\\times42/(42+4) = 128$ mmol/L.', 'That is below 135 mmol/L, the usual lower limit.'],
      a: 'Down to 128 mmol/L: hyponatraemia, from water alone with no loss of salt.' }
  ],
  quiz: [
    { q: 'Blood plasma is about what percentage water?', choices: ['50 %', '70 %', '92 %', '99 %'], a: 2, why: 'Plasma is 92 % water, about 7 % protein and 1 % salts and small molecules; whole blood with its cells is nearer 80 %.' },
    { q: 'Thirst appears only when a person is already seriously dehydrated, at a 10 % loss of body water.', a: false, why: 'Thirst begins at about 1–2 % of body mass, a litre or so, triggered by a 1–2 % rise in plasma osmolality; it is an early warning.' },
    { q: 'Why is the smallest possible urine volume about half a litre a day?', choices: ['The bladder cannot hold less', 'Solute of 600–800 mOsm has to be excreted and urine cannot exceed 1,200 mOsm/kg', 'The kidneys stop below that', 'Water is needed to cool the kidney'], a: 1, why: '700 mOsm ÷ 1,200 mOsm/L = 0.6 L; the limit comes from the solute load and the maximum concentrating power.' },
    { q: 'Drinking much more than the kidneys can pass over a few hours mainly causes', choices: ['dehydration', 'a rise of blood sodium', 'a fall of blood sodium by dilution', 'a rise of plasma protein'], a: 2, why: 'The extra water is retained and dilutes the sodium, which can swell cells, including brain cells.' },
    { q: 'A 70 kg person loses 1.4 L of water. What percentage of body mass is that?', answer: 2, unit: '%', why: '1.4 kg / 70 kg = 0.02, or 2 %: about where thirst is established.' }
  ],
  applications: ['Clinical fluid management: the choice between saline, glucose and balanced solutions follows from where each lands in the compartments.', 'Sports medicine: advice on drinking is tied to sweat rates and the risk of hyponatraemia.', 'Public health: oral rehydration solutions for diarrhoeal disease use sugar to carry sodium and water across the gut.', 'Military and occupational heat safety: water budgets for work in heat.', 'Diagnostics: blood osmolality, sodium and urine concentration are routine tests of the water balance.'],
  history: 'Claude Bernard\'s idea of the *milieu intérieur* (1850s) and Walter Cannon\'s homeostasis (1932) made the constancy of the blood a principle of physiology. Verney showed in 1947 that osmoreceptors control the release of antidiuretic hormone; du Vigneaud synthesised vasopressin in 1953 (Nobel Prize 1955). Almond and colleagues\' 2005 study established exercise-associated hyponatraemia as a risk of over-drinking in marathons.',
  sources: ['Guyton and Hall, *Textbook of Medical Physiology*, chapters on body fluids, the kidney and the regulation of osmolality.', 'Valtin, "Drink at least eight glasses of water a day. Really?", *American Journal of Physiology — Regulatory, Integrative and Comparative Physiology* 283, R993 (2002).', 'Almond and colleagues, "Hyponatremia among runners in the Boston Marathon", *New England Journal of Medicine* 352, 1550 (2005).', 'Institute of Medicine (US), *Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate* (2005).'],
  sim: { id: 'cell-body-water', params: { view: 'budget' } }
},

/* ================================================================ 12 */
{
  id: 'lifes-start-in-water', parent: 'the-sculptor-inside-every-cell', title: 'Life\'s start in water', level: 2,
  short: 'Every candidate for the birthplace of life is wet: Darwin\'s warm little pond, or an alkaline vent on the seafloor where water reacting with rock makes hydrogen and a natural proton gradient across a wall a micrometre thick. The oldest traces are about 3.5 billion years old, and Enceladus shows the same chemistry running today.',
  keywords: ['origin of life', 'abiogenesis', 'warm little pond', 'primordial soup', 'Miller-Urey', 'hydrothermal vent', 'Lost City', 'serpentinisation', 'proton gradient', 'water paradox', 'wet-dry cycles', 'Lane', 'Russell', 'oldest fossils', 'methanogenesis', 'Enceladus'],
  prereq: ['the-matrix-of-life', 'proton-wires-and-enzymes', 'water-as-a-reagent'],
  related: ['membranes-assemble-themselves', 'enceladus', 'europa', 'what-life-needs', 'where-the-oceans-came-from', 'could-life-use-another-liquid', 'the-search-follows-the-water', 'tidal-heating', 'biology:water-in-life', 'chemistry:equilibrium'],
  body: `
Nobody knows how life began, and the candidates disagree on almost everything but one thing: it began in liquid water. The question is which water, and what it was doing.

### The warm little pond
In an 1871 letter to Joseph Hooker, Darwin imagined that the first living thing might have formed "in some warm little pond" holding ammonia and phosphates, with light and heat to drive the chemistry. Oparin in 1924 and Haldane in 1929 developed it into the primordial soup. In 1953 Stanley Miller, working with Harold Urey, ran an electric spark through methane, ammonia, hydrogen and water vapour above a flask of water, and in a week the water held amino acids. The pond picture has its modern form in shallow, hot-spring pools, in which wet and dry cycles concentrate the ingredients and drive them together (Damer and Deamer), and in the chemistry of Sutherland\'s group, which in 2009 made the building blocks of RNA from simple molecules by ultraviolet light.

### The alkaline vent
In 2000 a new kind of hydrothermal field was found on the Atlantis Massif, near the mid-Atlantic ridge: **Lost City**, white carbonate chimneys up to 60 metres high, venting fluids at 40–90 °C and **pH 9–11** (Kelley and colleagues, 2001). The heat does not come from magma. It comes from the reaction of seawater with the green rock olivine, **serpentinisation**:

$$\\ce{3Fe2SiO4 + 2H2O -> 2Fe3O4 + 3SiO2 + 2H2}$$

The iron in the olivine takes oxygen from the water and leaves hydrogen, which rises in the fluid at up to 15 mmol/kg. Together with carbon dioxide dissolved in the ocean this is food: $\\ce{CO2 + 4H2 -> CH4 + 2H2O}$ is how methanogens live today, and the same two gases feed one of the oldest carbon-fixing pathways known.

Michael Russell, and later Nick Lane and William Martin, argued that such vents could have been the birthplace. The early ocean was acid (pH about 6, rich in CO₂); the vent fluid was alkaline. Between them stood a wall of iron–sulfur minerals, full of pores, a micrometre thick. A pH difference of 3 or more across it is a proton gradient of 180–250 mV, the same size as the gradient that every living cell makes with its respiratory chain. On this picture the first cells did not have to build a battery; they found one, and learned to tap it with a rudimentary version of the ATP synthase ([[proton-wires-and-enzymes]]). Even the neutral point moves: at 70 °C water\'s neutral pH is 6.4, not 7 ([[water-the-amphoteric]]).

### The water paradox
All life is built by condensation, by joining small molecules and releasing water ([[water-as-a-reagent]]), but the building takes place in water, which does the opposite. At equilibrium in 55 M water, two amino acids at 0.1 mol/L each make only about 0.4 µM of dipeptide (see the formulas), and longer chains fare worse by many orders of magnitude. This is the **water paradox** or water problem. Ways round it: wet–dry cycles in which the water evaporates and the condensation proceeds in the film; mineral surfaces and pores that exclude water; and a constant supply of energy to pay for the bonds.

### Dates
| Time before now | Event |
|---|---|
| 4.54 billion years | Earth forms |
| 4.4 billion years | zircons from Western Australia record oxygen isotopes of rock that had met liquid water (Wilde and colleagues, 2001) |
| about 4.1 billion | carbon in a zircon, possibly life\'s (Bell and colleagues, 2015, disputed) |
| 3.7 billion | Isua, Greenland: structures claimed as stromatolites (disputed) |
| **3.5 billion** | **stromatolites and a hot-spring deposit in the Dresser Formation, Western Australia — the earliest evidence generally accepted**; microfossil claims of 3.46 Ga (Apex chert) are disputed |
| 2.4 billion | oxygen from photosynthesis, made by splitting water, begins to rise |

If the oldest accepted evidence is a hot-spring deposit of 3.5 Ga, life had arisen within a few hundred million years of the first oceans, or sooner.

### The same chemistry elsewhere
In October 2015 the Cassini spacecraft flew through the plume of Enceladus and found molecular hydrogen, about 1 % of the gas, with carbon dioxide and methane in a plume that is 98 % water (NASA JPL, 2017; source 7). The simplest explanation is hot water reacting with rock on the moon\'s seafloor, serpentinisation. If so, the same hydrogen that fed the earliest known life is available there ([[enceladus]], [[what-life-needs]]). Whether anything lives on it is unknown.

> [!key] Life began in liquid water, in a warm pond or at an alkaline vent, and the vent picture is attractive because water reacting with rock supplies both hydrogen and a natural proton gradient of about 200 mV. The water paradox, that building polymers in water runs against hydrolysis, is why wet–dry cycles, mineral pores and a steady energy supply keep appearing in every theory.`,
  ideas: ['Darwin\'s warm little pond (1871), Oparin, Haldane and Miller–Urey (1953) put the first chemistry in water.', 'Alkaline vents such as Lost City make hydrogen by serpentinisation and sit between acid ocean and alkaline fluid, with a natural proton gradient of about 200 mV.', 'Condensation in water is uphill (water paradox): wet–dry cycles, mineral pores and a constant energy supply are proposed remedies.', 'The earliest accepted traces of life are about 3.5 billion years old, and Enceladus\'s plume holds hydrogen from the same kind of reaction.'],
  pitfalls: ['"Life began in a vent" or "in a pond" is settled — Neither is; the evidence is circumstantial and the two pictures can be combined.', '"Miller–Urey made life in a flask" — It made amino acids, some of the building blocks, under the then-assumed atmosphere; the step to a self-copying system is the open problem.', '"Water is the problem for polymers, so life cannot start in water" — It is a problem, solved by cells today with ATP and sealed active sites, and suggested to be solved early by wetting and drying, minerals and energy.'],
  terms: [
    { term: 'Alkaline hydrothermal vent', also: ['Lost City-type vent'], def: 'A seafloor vent where seawater reacting with olivine-rich rock makes warm (40–90 °C), alkaline (pH 9–11), hydrogen-rich fluid that builds carbonate chimneys; the type found at Lost City in 2000.' },
    { term: 'Serpentinisation', also: ['serpentinization'], def: 'The reaction of water with iron- and magnesium-rich rock (olivine) that makes serpentine minerals, magnetite and molecular hydrogen, and releases heat.' },
    { term: 'Primordial soup', also: ['warm little pond', 'Oparin–Haldane hypothesis'], def: 'The idea, from Darwin\'s 1871 letter and Oparin and Haldane, that life began in a pool of simple organic molecules formed in early Earth\'s water.' },
    { term: 'Water paradox', also: ['water problem'], def: 'The difficulty that polymers (proteins, RNA) are made by condensation, releasing water, yet the early chemistry took place in water, which drives hydrolysis, the reverse.' },
    { term: 'Wet–dry cycle', also: ['hydration–dehydration cycle'], def: 'The repeated evaporation and re-wetting of a pool: concentrating ingredients and removing water from the equilibrium, it can drive condensation reactions.' },
    { term: 'Methanogen', also: ['methane-producing archaeon'], def: 'A microbe that makes energy by combining hydrogen and carbon dioxide to methane and water; its chemistry resembles the earliest known pathways and the possible metabolism of Enceladus.' }
  ],
  formulas: [
    { name: 'Voltage across a pH gradient', expr: 'pmf = ln(10)*R*T/F*dpH', tex: '\\Delta p = \\frac{\\ln 10\\;RT}{F}\\,\\Delta\\mathrm{pH}',
      vars: { pmf: { name: 'proton motive force', q: 'voltage', unit: 'mV', tex: '\\Delta p' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 70, min: 0 }, F: { const: 'F' }, dpH: { name: 'pH difference across the wall', value: 3.5, tex: '\\Delta\\mathrm{pH}', hint: 'Vent fluid at pH 9.5, ocean at pH 6: 3.5 units.' } },
      solveFor: 'pmf', note: 'The Nernst slope is 59 mV per pH unit at 25 °C and 68 mV at 70 °C. A mitochondrion has about 200 mV.',
      stories: { pmf: 'A mineral wall separates fluids with a pH difference of {dpH} at {T}. What proton motive force does it carry?', dpH: 'A wall at {T} carries {pmf}. What pH difference is that?' } },
    { name: 'How much dipeptide at equilibrium?', expr: 'cP = c1*c2*exp(-dG/(R*T))/cw', tex: 'c_P = \\frac{c_1\\,c_2}{c_w}\\,e^{-\\Delta G/RT}',
      vars: { cP: { name: 'dipeptide at equilibrium', q: 'concentration', unit: 'µM', tex: 'c_P' }, c1: { name: 'first amino acid', q: 'concentration', unit: 'mol/L', value: 0.1, tex: 'c_1' }, c2: { name: 'second amino acid', q: 'concentration', unit: 'mol/L', value: 0.1, tex: 'c_2' }, dG: { name: 'free energy of condensation', q: 'molarenergy', unit: 'kJ/mol', value: 15, signed: true, tex: '\\Delta G', hint: 'About +10 to +20 kJ/mol for a peptide bond in water at pH 7.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0 }, cw: { name: 'water', q: 'concentration', unit: 'mol/L', value: 55.5, fixed: true, tex: 'c_w' } },
      solveFor: 'cP', note: 'Condensation $A + B \\rightleftharpoons AB + \\mathrm{H_2O}$: the water on the right appears in the quotient, so a high water concentration pushes the equilibrium back.',
      stories: { cP: 'Two amino acids at {c1} and {c2} condense with a free energy of {dG} at {T}. How much dipeptide is there at equilibrium?' } },
    { name: 'Neutral pH', expr: 'pHn = pKw/2', tex: '\\mathrm{pH}_{n} = \\frac{\\mathrm{pK_w}}{2}',
      vars: { pHn: { name: 'neutral pH', tex: '\\mathrm{pH}_{n}' }, pKw: { name: 'pKw of water', value: 14, min: 0, tex: '\\mathrm{pK_w}', hint: '14.0 at 25 °C, 12.8 at 70 °C, 12.4 at 90 °C: water ionises more as it warms.' } },
      solveFor: 'pHn', note: 'At the temperature of a vent, a fluid of pH 9.5 is 3.1 units more alkaline than neutral, not 2.5.',
      stories: { pHn: 'At some temperature water has pKw = {pKw}. What is the pH of neutral water there?' } }
  ],
  examples: [
    { title: 'A battery in the rock', q: 'A vent wall separates fluid at pH 9.5 from ocean at pH 6. What is the proton motive force at 70 °C, and how many protons would an ATP synthase need to make one ATP at 50 kJ/mol?',
      steps: ['$\\ln10\\,RT/F = 2.303\\times8.314\\times343.15/96485 = 0.0681$ V per pH unit.', '$\\Delta p = 0.0681\\times3.5 = 0.238$ V = 238 mV.', 'Energy per mole of protons: $96.485\\times0.238 = 23$ kJ. For 50 kJ: $50/23 = 2.2$ protons.'],
      a: '238 mV, a little more than a mitochondrion\'s 200 mV, and about 2 protons per ATP.' },
    { title: 'The water paradox', q: 'Two amino acids at 0.1 mol/L each condense to a dipeptide with ΔG = +15 kJ/mol at 25 °C. How much dipeptide is there at equilibrium?',
      steps: ['$RT = 2.48$ kJ/mol, so $e^{-15/2.48} = e^{-6.05} = 2.4\\times10^{-3}$.', '$c_1c_2/c_w = 0.01/55.5 = 1.8\\times10^{-4}$ mol/L.', '$c_P = 1.8\\times10^{-4}\\times2.4\\times10^{-3} = 4.3\\times10^{-7}$ mol/L = 0.43 µM.'],
      a: 'About 0.4 µM, four parts in a million of the amino acid: and a chain of 100 would be astronomically smaller. Wet–dry cycles, minerals or ATP are needed.' }
  ],
  quiz: [
    { q: 'What makes the hydrogen in the fluid of an alkaline vent like Lost City?', choices: ['Volcanic eruptions', 'Seawater reacting with olivine-rich rock (serpentinisation)', 'Sunlight on the sea surface', 'Decay of organic matter'], a: 1, why: 'Iron in olivine takes oxygen from water, releasing molecular hydrogen, and the reaction releases heat.' },
    { q: 'The water paradox says that life could not have started in water.', a: false, why: 'It says that making polymers in water is uphill; cells do it today with ATP, and the origin-of-life theories propose ways round it (wet–dry cycles, minerals, energy).' },
    { q: 'The pH difference between an alkaline vent fluid and the early ocean could give a voltage across a thin wall of about', choices: ['2 mV', '20 mV', '200 mV', '20 V'], a: 2, why: '3 to 4 pH units × 59–68 mV per unit is 180–270 mV, the size of the gradient across a mitochondrion\'s membrane.' },
    { q: 'The earliest generally accepted evidence of life on Earth is about', choices: ['1 billion years old', '2.4 billion', '3.5 billion', '4.4 billion'], a: 2, why: 'Stromatolites and hot-spring deposits of the Dresser Formation, 3.48 billion years old; older claims are disputed.' },
    { q: 'What was found in the Enceladus plume in 2015 that points to hydrothermal chemistry like Lost City\'s?', choices: ['Molecular hydrogen', 'Oxygen', 'Chlorophyll', 'Pure helium'], a: 0, why: 'About 1 % hydrogen, from hot water reacting with rock on the seafloor, together with CO₂ and methane (Waite and colleagues, 2017).' }
  ],
  applications: ['Planning the search for life on Europa and Enceladus, where water and rock may react as at Lost City.', 'Laboratory origin-of-life chemistry, which now tests wet–dry cycles, mineral surfaces and vent-like electrochemical reactors.', 'Natural hydrogen: serpentinisation produces hydrogen that is now being explored as an energy source, as in Mali.', 'Carbon capture by mineralisation of olivine, the same minerals that react at vents.', 'Reconstructing the last universal common ancestor, which gene-based studies place near hydrogen-using, carbon-fixing microbes.'],
  history: 'Darwin\'s letter to Hooker of 1 February 1871 gave the warm little pond; Oparin (1924) and Haldane (1929) the soup; Miller (1953) the first experiment. Black smokers were found in 1977–79, alkaline vents proposed by Russell and Hall in 1997, Lost City discovered in 2000, and the proton-gradient view developed by Lane and Martin (2012). Cassini\'s 2015 dive through Enceladus\'s plume found hydrogen (published 2017).',
  sources: ['NASA JPL, "NASA missions provide new insights into \'ocean worlds\'" (13 April 2017), reporting Waite and colleagues, *Science* 356, 155 — hydrogen in the Enceladus plume (source 7).', 'Lane and Martin, "The origin of membrane bioenergetics", *Cell* 151, 1406 (2012).', 'Kelley and colleagues, "An off-axis hydrothermal vent field near the Mid-Atlantic Ridge at 30° N", *Nature* 412, 145 (2001) — Lost City.', 'Lane, *The Vital Question* (2015).', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).'],
  sim: { id: 'cell-water-wire', params: { mode: 'vent' } }
}
);
