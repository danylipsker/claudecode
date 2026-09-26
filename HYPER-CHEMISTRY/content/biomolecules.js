/* HYPER-CHEMISTRY · content/biomolecules.js — the molecules of life: carbohydrates,
 * amino acids and proteins, lipids, and nucleic acids. */
Hyper.add(

{
  id: 'carbohydrates', parent: 'biomolecules', title: 'Carbohydrates', level: 2,
  short: 'Sugars and their polymers, roughly Cₙ(H₂O)ₘ. Simple sugars close into rings and link by glycosidic bonds into sucrose, starch and cellulose: starch and glycogen store fuel, cellulose builds plants and is the most abundant organic compound on Earth.',
  keywords: ['carbohydrate', 'sugar', 'monosaccharide', 'disaccharide', 'polysaccharide', 'glucose', 'fructose', 'galactose', 'ribose', 'sucrose', 'lactose', 'maltose', 'starch', 'amylose', 'amylopectin', 'glycogen', 'cellulose', 'glycosidic bond', 'anomer', 'mutarotation', 'hemiacetal', 'reducing sugar', 'aldose', 'ketose', 'invert sugar'],
  prereq: ['functional-groups', 'stereoisomers', 'carbonyl-chemistry'],
  related: ['polymers', 'hydrogen-bonding', 'nucleic-acids', 'enzyme-kinetics', 'enthalpy', 'carbon-bonding'],
  body: `
The name means "hydrate of carbon": glucose, $\\ce{C6H12O6}$, can be written $\\mathrm{C_6(H_2O)_6}$. The formula misleads — there is no water inside — but it records where the atoms came from. Plants build sugars by photosynthesis,

$$\\ce{6CO2 + 6H2O ->[\\text{light}] C6H12O6 + 6O2}\\qquad \\Delta H \\approx +2800\\ \\mathrm{kJ/mol}$$

storing the energy of sunlight, which cells release again by respiration. Digestible carbohydrates supply about 17 kJ per gram.

### Simple sugars
**Monosaccharides** are chains of three to seven carbons carrying an –OH on every carbon but one, which is a carbonyl: an aldehyde in an **aldose** (glucose, galactose, ribose), a ketone in a **ketose** (fructose). Glucose, an aldohexose, has four stereocentres, so there are $2^4 = 16$ aldohexoses; galactose and mannose are among glucose's diastereomers. Sugars are labelled D or L by the stereocentre farthest from the carbonyl, compared with glyceraldehyde; nearly all natural sugars are D.

### Rings
In water, the –OH on carbon 5 of glucose adds to its own aldehyde group to form a **hemiacetal**, closing a six-membered ring of five carbons and an oxygen ([[carbonyl-chemistry]]). The old carbonyl carbon becomes a new stereocentre, the **anomeric carbon**, with its –OH either below the ring (the **α** anomer) or above it (**β**). In the chair, β-D-glucose has every large group equatorial — the most relaxed arrangement of any aldohexose, and perhaps why glucose is the sugar life chose.

The two anomers interconvert through the open chain. Pure α-D-glucose rotates polarised light by +112.2°, pure β by +18.7°; either one, dissolved, drifts to +52.7° (**mutarotation**) as the mixture settles at about 36 % α and 64 % β. The open chain makes up well under 1 %. Fructose, a ketose, closes through its carbon 2 into either a six- or a five-membered ring; in sucrose it is the five-membered one.

### Linking sugars
Two sugars join by a **glycosidic bond**: the anomeric –OH of one condenses with an –OH of the other, releasing water.
- **Maltose**: glucose α(1→4) glucose, from digested starch.
- **Lactose**: galactose β(1→4) glucose, milk sugar (about 5 % of cow's milk). Most adults worldwide gradually lose the lactase enzyme that splits it.
- **Sucrose**: glucose α(1→2) fructose, joined through both anomeric carbons. With no free hemiacetal it cannot open to an aldehyde, so it is a **non-reducing** sugar: it gives no colour with Benedict's or Fehling's solution until it is hydrolysed. Hydrolysis also flips its optical rotation from +66.5° to about −20°, because fructose rotates strongly to the left — hence "invert sugar", the sweetness of honey and golden syrup.

### Polysaccharides: the same glucose, two linkages
- **Starch** stores energy in plants: **amylose**, unbranched α(1→4) chains coiled into helices (they trap iodine and turn blue-black), and **amylopectin**, with α(1→6) branches every 24–30 units.
- **Glycogen**, the animal version, is branched every 8–12 units, giving many ends that enzymes can nibble quickly; an adult stores roughly 100 g in the liver and 400 g in muscle.
- **Cellulose** uses **β(1→4)** links. Each glucose is flipped relative to the next, so the chains are straight and lie side by side, hydrogen-bonded into strong fibres. Cotton is about 90 % cellulose, wood 40–50 %.

One stereocentre changes food into fibre: human enzymes cut α links but not β links, so we cannot digest cellulose. Cows and termites rely on gut microbes that can.

### Sugars at work
Fermentation turns glucose into ethanol, $\\ce{C6H12O6 -> 2C2H5OH + 2CO2}$, for drinks and fuel. An enzyme isomerises glucose into the sweeter fructose for syrups. Cellulose becomes paper, viscose and cellulose acetate. Ribose and deoxyribose are the sugars in the backbones of RNA and DNA ([[nucleic-acids]]), and chitin — a polymer of an amino sugar — makes the shells of insects and crabs.
`,
  ideas: [
    'Monosaccharides are polyhydroxy aldehydes (aldoses) or ketones (ketoses); glucose is an aldohexose, fructose a ketohexose.',
    'In water sugars close into rings by forming a hemiacetal; the new stereocentre gives α and β anomers, which interconvert (mutarotation).',
    'Glycosidic bonds join sugars by condensation; sucrose is non-reducing because both anomeric carbons are used.',
    'Starch and glycogen (α links) are energy stores; cellulose (β links) forms straight, hydrogen-bonded structural fibres.',
    'Digestible carbohydrate supplies about 17 kJ/g.'
  ],
  pitfalls: [
    'Sugar molecules in water are straight chains — Well over 99 % of dissolved glucose is in ring forms; the open chain drawn in textbooks is a minor partner.',
    'Starch and cellulose are made of different sugars — Both are polymers of glucose. They differ in the configuration of the glycosidic link (α or β), which changes their shape and digestibility completely.',
    'All carbohydrates are sweet — Starch and cellulose are not; sweetness depends on fitting the sweet-taste receptor, and fructose is sweeter than sucrose, which is sweeter than glucose.'
  ],
  formulas: [
    {
      name: 'Share of the α anomer from optical rotation',
      expr: 'x = (am - ab)/(aa - ab)', tex: 'x_\\alpha = \\frac{\\alpha_{\\text{mix}} - \\alpha_\\beta}{\\alpha_\\alpha - \\alpha_\\beta}',
      vars: {
        x: { name: 'fraction of the α anomer', q: 'ratio', unit: '%', tex: 'x_\\alpha' },
        am: { name: 'specific rotation of the mixture', signed: true, value: 52.7, tex: '\\alpha_{\\text{mix}}' },
        aa: { name: 'specific rotation of the pure α anomer', signed: true, value: 112.2, tex: '\\alpha_\\alpha' },
        ab: { name: 'specific rotation of the pure β anomer', signed: true, value: 18.7, tex: '\\alpha_\\beta' }
      },
      note: 'All three are specific rotations $[\\alpha]$ in degrees. Rotations add in proportion to the amounts present (the open chain is negligible). Defaults: D-glucose at equilibrium in water.',
      practice: { unknowns: ['x', 'am'] },
      stories: {
        x: 'A glucose solution has settled to a specific rotation of {am}°. The pure anomers have {aa}° (α) and {ab}° (β). What fraction is α?',
        am: 'A glucose solution contains a fraction {x} of the α anomer ({aa}°), the rest β ({ab}°). What specific rotation does it show?'
      }
    },
    {
      name: 'Molar mass of a glucose chain',
      expr: 'M = n*Mr + Mw', tex: 'M = n\\,M_r + M_{\\ce{H2O}}',
      vars: {
        M: { name: 'molar mass of the chain', q: 'molarmass', unit: 'g/mol' },
        n: { name: 'number of glucose units', int: true, value: 10000 },
        Mr: { name: 'molar mass of one glucose residue, C₆H₁₀O₅', q: 'molarmass', unit: 'g/mol', value: 162.14, fixed: true, tex: 'M_r' },
        Mw: { name: 'molar mass of water (the two chain ends)', q: 'molarmass', unit: 'g/mol', value: 18.02, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: 'Each glycosidic bond removes one water, so a chain of $n$ glucose units weighs $n \\times 180.16 - (n-1) \\times 18.02$. With $n = 1$ it gives glucose itself. Default: a cotton cellulose chain.',
      practice: { unknowns: ['M', 'n'] },
      stories: {
        M: 'A cellulose chain contains {n} glucose units. What is its molar mass?',
        n: 'An amylose molecule has a molar mass of {M}. How many glucose units does it contain?'
      }
    },
    {
      name: 'Energy released by burning or respiring a sugar',
      expr: 'E = m/M*q', tex: 'E = \\frac{m}{M}\\,q_c',
      vars: {
        E: { name: 'energy released', q: 'energy', unit: 'kJ' },
        m: { name: 'mass of sugar', q: 'mass', unit: 'g', value: 25 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 180.16 },
        q: { name: 'heat of combustion per mole', q: 'molarenergy', unit: 'kJ/mol', value: 2803, tex: 'q_c' }
      },
      note: 'Respiration releases the same total energy as burning, in many small steps. Defaults: glucose (2803 kJ/mol); sucrose is 5645 kJ/mol for 342.30 g/mol.',
      practice: { unknowns: ['E', 'm'] },
      stories: {
        E: 'How much energy does the complete oxidation of {m} of a sugar of molar mass {M} release, if its heat of combustion is {q}?',
        m: 'What mass of glucose (molar mass {M}, {q}) supplies {E}?'
      }
    }
  ],
  examples: [
    {
      title: 'Mutarotation',
      q: 'Freshly dissolved α-D-glucose rotates light by +112.2°; after some hours the value has settled at +52.7°. Pure β-D-glucose shows +18.7°. What is the equilibrium composition?',
      steps: [
        'Let $x$ be the fraction of α. The rotations add: $52.7 = 112.2\\,x + 18.7\\,(1 - x)$.',
        '$x = (52.7 - 18.7)/(112.2 - 18.7) = 34.0/93.5 = 0.364$.',
        'So 36 % α and 64 % β. The β anomer, with its –OH equatorial, is favoured.'
      ],
      a: 'About 36 % α-D-glucose and 64 % β-D-glucose.'
    },
    {
      title: 'Why "invert" sugar?',
      q: 'Sucrose has $[\\alpha] = +66.5°$. Hydrolysis gives equal amounts of glucose (+52.7° at equilibrium) and fructose (−92°). What is the specific rotation of the mixture, per gram of sugar?',
      steps: [
        'Equal masses of glucose and fructose (both $\\ce{C6H12O6}$), so each contributes half.',
        '$[\\alpha] = (52.7 - 92)/2 = -19.7°$.',
        'The sign has turned from + to −: the direction of rotation is inverted, which gave invert sugar its name.'
      ],
      a: 'About −20°, against +66.5° for the sucrose.'
    },
    {
      title: 'How big is a cellulose molecule?',
      q: 'Cotton cellulose chains contain about 10 000 glucose units. What is their molar mass, and how long is such a chain if each unit adds 0.515 nm?',
      steps: [
        '$M = 10\\,000 \\times 162.14 + 18.02 = 1.62 \\times 10^6$ g/mol.',
        'Length: $10\\,000 \\times 0.515\\ \\mathrm{nm} = 5.2\\ \\mu\\mathrm{m}$ — a single molecule as long as a bacterium, yet under a nanometre wide.'
      ],
      a: 'About 1.6 million g/mol and 5 µm.'
    }
  ],
  quiz: [
    { q: 'Which of these is a ketose?', choices: ['glucose', 'galactose', 'fructose', 'ribose'], a: 2,
      why: 'Fructose has its carbonyl at carbon 2, a ketone. Glucose, galactose and ribose are aldoses, with an aldehyde at carbon 1.' },
    { q: 'Sucrose gives a brick-red precipitate when warmed with Benedict\'s solution.', a: false,
      why: 'Both anomeric carbons are tied up in the glycosidic bond, so sucrose cannot open to an aldehyde. After acid hydrolysis, its glucose and fructose do give a positive test.' },
    { q: 'Why can humans digest starch but not cellulose?', choices: ['cellulose contains no glucose', 'our enzymes split α-glycosidic links but not the β links of cellulose', 'cellulose is insoluble in stomach acid', 'cellulose molecules are too heavy'], a: 1,
      why: 'Both are glucose polymers. Amylase fits α(1→4) links; nothing in our digestive enzymes fits β(1→4), so cellulose passes through as fibre.' },
    { q: 'Glucose releases 2803 kJ/mol on complete oxidation. How much energy (in kJ) is in 25.0 g of glucose (180.16 g/mol)?', answer: 389, unit: 'kJ',
      why: '$25.0/180.16 = 0.1388$ mol; $0.1388 \\times 2803 = 389$ kJ — about 15.6 kJ per gram.' },
    { q: 'What reaction closes glucose into a ring?', choices: ['an –OH adds to the aldehyde group, forming a hemiacetal', 'two –OH groups lose water, forming an ether', 'the aldehyde is reduced', 'a glycosidic bond forms with another sugar'], a: 0,
      why: 'The C5 hydroxyl attacks the C1 carbonyl within the same molecule: an intramolecular nucleophilic addition giving a cyclic hemiacetal.' }
  ],
  applications: ['Food energy, sweeteners and syrups; fermentation to drinks and bioethanol.', 'Paper, cotton, viscose and cellulose acetate from cellulose.', 'Medical tests for glucose (enzyme strips) and, historically, Benedict\'s test.', 'Polarimetry of sugar solutions in the sugar industry.'],
  history: 'Emil Fischer worked out the configurations of glucose and its relatives between 1884 and 1894, earning the 1902 Nobel Prize. Walter Haworth established the ring structures of sugars and shared the 1937 Nobel Prize.',
  sim: { id: 'org-groups', params: { mol: 'glucose' } }
},

{
  id: 'amino-acids-proteins', parent: 'biomolecules', title: 'Amino acids and proteins', level: 2,
  short: 'Amino acids carry an amine and a carboxylic acid on the same carbon; in water they are zwitterions whose charge depends on pH. Joined by peptide (amide) bonds into chains hundreds long, they fold into proteins — enzymes, muscle, antibodies — whose shape is their function.',
  keywords: ['amino acid', 'alpha amino acid', 'zwitterion', 'isoelectric point', 'pI', 'side chain', 'R group', 'L-amino acid', 'essential amino acids', 'peptide bond', 'polypeptide', 'protein', 'primary structure', 'secondary structure', 'alpha helix', 'beta sheet', 'tertiary structure', 'quaternary structure', 'disulfide bridge', 'denaturation', 'electrophoresis', 'haemoglobin', 'insulin'],
  prereq: ['carboxylic-acids-esters', 'stereoisomers', 'henderson-hasselbalch', 'hydrogen-bonding'],
  related: ['polymers', 'nucleic-acids', 'enzyme-kinetics', 'intermolecular-forces', 'functional-groups', 'chromatography'],
  body: `
### Twenty building blocks
An α-amino acid has an amino group and a carboxyl group on the same carbon, the α-carbon, which also carries a hydrogen and a side chain R: $\\ce{H2N-CHR-COOH}$. Twenty of them, differing only in R, are written into the genetic code. The side chains give each its character:
- **non-polar**: glycine (R = H), alanine ($\\ce{CH3}$), valine, leucine, isoleucine, proline, phenylalanine, methionine, tryptophan;
- **polar, uncharged**: serine and threonine (–OH), cysteine (–SH), asparagine and glutamine (amides), tyrosine (a phenol);
- **acidic**: aspartic and glutamic acid (a second –COOH);
- **basic**: lysine, arginine, histidine.

Adults must eat nine of them (the **essential** amino acids); the body makes the rest. Every amino acid except glycine has a stereocentre at the α-carbon, and proteins use only the **L** forms — S by the CIP rules, except cysteine, whose sulfur changes the priorities.

### Zwitterions and the isoelectric point
An amino acid is both an acid and a base, and the two groups react with each other: in water and in the crystal it exists as a **zwitterion**, $\\ce{H3N+}$–CHR–$\\ce{COO-}$. That is why amino acids are high-melting solids (glycine decomposes above 230 °C) that dissolve in water but not in oil — they behave like salts.

The charge depends on pH ([[henderson-hasselbalch]]). Glycine has p$K_a$ values of 2.34 (the –COOH) and 9.60 (the –NH₃⁺):
- at pH 1 both groups are protonated: $\\ce{H3N+}$–CH₂–COOH, charge +1;
- near pH 6 the zwitterion dominates, net charge 0;
- at pH 12 both are deprotonated: H₂N–CH₂–$\\ce{COO-}$, charge −1.

The pH of zero net charge is the **isoelectric point**, pI — for glycine $(2.34 + 9.60)/2 = 5.97$. Amino acids with acidic side chains have low pI (aspartic acid 2.77), basic ones high pI (lysine 9.74). In an electric field a molecule moves towards the electrode of opposite charge and stops at its pI, which is how **electrophoresis** and isoelectric focusing separate amino acids and proteins.

### The peptide bond
The –COOH of one amino acid condenses with the –NH₂ of the next, releasing water and forming an amide — here called a **peptide bond**. A chain is written from the free amino end (N-terminus) to the free carboxyl end (C-terminus); Gly-Ala and Ala-Gly are different dipeptides. The C–N bond has partial double-bond character (1.33 Å, against 1.47 Å for a single C–N bond), so each peptide unit is flat and rigid; the chain can only twist at the α-carbons. The sweetener aspartame is a dipeptide (Asp-Phe) methyl ester.

With 20 choices at every position the variety is endless: $20^{100} \\approx 10^{130}$ possible chains of 100 residues. An average residue weighs about 110 g/mol; insulin has 51 residues (5808 g/mol), haemoglobin 574 in four chains (about 64.5 kg/mol), and the muscle protein titin over 30 000.

### Four levels of structure
- **Primary**: the sequence. A single change can matter: in sickle-cell haemoglobin, glutamic acid 6 of the β-chain is replaced by valine.
- **Secondary**: hydrogen bonds between backbone C=O and N–H groups. In the **α-helix**, each C=O bonds to the N–H four residues along, with 3.6 residues per turn and 0.54 nm per turn; in the **β-sheet**, extended strands lie side by side, as in silk.
- **Tertiary**: the whole chain folds so that non-polar side chains are buried inside, away from water, while charged and polar ones face out; hydrogen bonds, ionic attractions between –COO⁻ and –NH₃⁺, and covalent **disulfide bridges** between cysteines hold the fold.
- **Quaternary**: several chains assemble, like the four of haemoglobin.

Heat, extremes of pH, salts or solvents disrupt the weak interactions and the protein unfolds — it is **denatured**, as when an egg white turns solid on cooking. The peptide bonds survive; breaking them needs strong acid, hot alkali or digestive enzymes. Enzymes owe their catalytic power to the precise shape of the fold ([[enzyme-kinetics]]).
`,
  ideas: [
    'An α-amino acid has H₂N– and –COOH on the same carbon plus a side chain R; twenty are coded by genes, all L except achiral glycine.',
    'In water amino acids are zwitterions; their net charge goes from + at low pH to − at high pH.',
    'At the isoelectric point the net charge is zero; for a simple amino acid pI = (pKa₁ + pKa₂)/2.',
    'Peptide bonds are flat, rigid amides formed by condensation, joining amino acids from N- to C-terminus.',
    'Primary, secondary, tertiary and quaternary structure; denaturation destroys the fold but not the chain.'
  ],
  pitfalls: [
    'Amino acids exist as neutral H₂N–CHR–COOH molecules — In water and in crystals they are zwitterions; the neutral form is a negligible minority at any pH.',
    'At the isoelectric point an amino acid carries no charges — It carries equal positive and negative charges; only the net charge is zero.',
    'Denaturing a protein breaks it into amino acids — Only the folded shape is lost; the peptide bonds stay intact.'
  ],
  derivation: {
    title: 'Derive the isoelectric point',
    steps: [
      { text: 'Call the three forms of a simple amino acid the cation $\\ce{C+}$ ($\\ce{H3N+}$–CHR–COOH), the zwitterion Z and the anion $\\ce{A-}$. Their two acid constants are', tex: 'K_1 = \\frac{[\\text{Z}][\\ce{H+}]}{[\\ce{C+}]}, \\qquad K_2 = \\frac{[\\ce{A-}][\\ce{H+}]}{[\\text{Z}]}' },
      { text: 'The zwitterion is neutral overall, so the net charge is zero when the small amounts of cation and anion are equal:', tex: '[\\ce{C+}] = [\\ce{A-}] \\;\\Rightarrow\\; \\frac{[\\text{Z}][\\ce{H+}]}{K_1} = \\frac{K_2[\\text{Z}]}{[\\ce{H+}]}' },
      { text: 'Solve for the hydrogen-ion concentration:', tex: '[\\ce{H+}]^2 = K_1 K_2' },
      { text: 'Take minus the logarithm of both sides:', tex: '\\mathrm{pI} = \\tfrac12\\left({\\mathrm{p}K}_1 + {\\mathrm{p}K}_2\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Isoelectric point of a simple amino acid',
      expr: 'pI = (pK1 + pK2)/2', tex: '\\mathrm{pI} = \\frac{{\\mathrm{p}K}_1 + {\\mathrm{p}K}_2}{2}',
      vars: {
        pI: { name: 'isoelectric point', tex: '\\mathrm{pI}' },
        pK1: { name: 'pKa of the α-COOH', value: 2.34, tex: '{\\mathrm{p}K}_1' },
        pK2: { name: 'pKa of the α-NH₃⁺', value: 9.60, tex: '{\\mathrm{p}K}_2' }
      },
      note: 'For amino acids whose side chain does not ionise. With an ionisable side chain, average the two pKa values on either side of the zwitterion: the two lowest for an acidic side chain, the two highest for a basic one. Defaults: glycine.',
      practice: { unknowns: ['pI', 'pK2'] },
      stories: { pI: 'An amino acid has pKa values of {pK1} and {pK2}, and no ionisable side chain. What is its isoelectric point?' }
    },
    {
      name: 'Net charge of a simple amino acid',
      expr: 'z = 1/(1 + 10^(pH - pK2)) - 1/(1 + 10^(pK1 - pH))', tex: 'z = \\frac{1}{1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_2}} - \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_1 - \\mathrm{pH}}}',
      vars: {
        z: { name: 'average net charge', signed: true },
        pH: { name: 'pH of the solution', value: 7, min: 0, max: 14, tex: '\\mathrm{pH}' },
        pK1: { name: 'pKa of the α-COOH', value: 2.34, tex: '{\\mathrm{p}K}_1' },
        pK2: { name: 'pKa of the α-NH₃⁺', value: 9.60, tex: '{\\mathrm{p}K}_2' }
      },
      note: 'The first term is the fraction of amino groups still protonated (+1), the second the fraction of carboxyl groups ionised (−1). Defaults: glycine at pH 7, net charge −0.0025.',
      practice: { unknowns: ['z', 'pH'] },
      stories: {
        z: 'An amino acid with pKa values {pK1} and {pK2} is dissolved in a buffer of pH {pH}. What is its average net charge?',
        pH: 'At what pH does an amino acid with pKa values {pK1} and {pK2} carry an average net charge of {z}?'
      }
    },
    {
      name: 'Molar mass of a protein from its length',
      expr: 'M = n*m0 + mw', tex: 'M \\approx n\\,m_0 + M_{\\ce{H2O}}',
      vars: {
        M: { name: 'molar mass of the chain', q: 'molarmass', unit: 'g/mol' },
        n: { name: 'number of amino-acid residues', int: true, value: 51 },
        m0: { name: 'average mass of one residue', q: 'molarmass', unit: 'g/mol', value: 110, fixed: true, tex: 'm_0' },
        mw: { name: 'molar mass of water (the two chain ends)', q: 'molarmass', unit: 'g/mol', value: 18.02, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: 'A rule of thumb used every day in biochemistry: a protein weighs about 110 g/mol (110 daltons) per residue. Default: insulin, 51 residues (actual 5808 g/mol).',
      practice: { unknowns: ['M', 'n'] },
      stories: {
        M: 'Estimate the molar mass of a protein chain of {n} amino acids.',
        n: 'A protein band on a gel corresponds to {M}. Roughly how many amino acids long is the chain?'
      }
    }
  ],
  examples: [
    {
      title: 'Glycine across the pH scale',
      q: 'Glycine has p$K_a$ values 2.34 and 9.60. Find its pI, and its net charge at pH 1.0, 7.0 and 12.0.',
      steps: [
        'pI $= (2.34 + 9.60)/2 = 5.97$.',
        'pH 1.0: amino group fully protonated (+1); carboxyl ionised only $1/(1 + 10^{1.34}) = 0.044$. Net $+0.96$.',
        'pH 7.0: amino $1/(1 + 10^{-2.6}) = 0.9975$, carboxyl $0.99998$. Net $-0.0025$ — practically zero, the zwitterion.',
        'pH 12.0: amino protonated only $1/(1 + 10^{2.4}) = 0.004$, carboxyl fully ionised. Net $-0.996$.'
      ],
      a: 'pI 5.97; charges about +0.96, 0.00 and −1.00.'
    },
    {
      title: 'An acidic amino acid',
      q: 'Aspartic acid has p$K_a$ values 1.88 (α-COOH), 3.65 (side-chain COOH) and 9.60 (α-NH₃⁺). What is its isoelectric point?',
      steps: [
        'Start fully protonated at very low pH: charge +1 (only the –NH₃⁺ is charged).',
        'Losing the first proton (pKa 1.88) gives the neutral zwitterion; losing the second (3.65) gives charge −1.',
        'The neutral form lies between pKa 1.88 and 3.65, so pI $= (1.88 + 3.65)/2 = 2.77$.'
      ],
      a: 'pI ≈ 2.77: aspartic acid is negatively charged at physiological pH.'
    },
    {
      title: 'Building a tripeptide',
      q: 'What is the molar mass of the tripeptide Gly-Ala-Ser (glycine 75.07, alanine 89.09, serine 105.09 g/mol)? How many different tripeptides can be made from the 20 amino acids?',
      steps: [
        'Two peptide bonds form, each releasing one water: $75.07 + 89.09 + 105.09 - 2 \\times 18.02 = 233.22$ g/mol.',
        'Each of the three positions can be any of 20 amino acids: $20^3 = 8000$ tripeptides.'
      ],
      a: '233.22 g/mol; 8000 possible tripeptides.'
    }
  ],
  quiz: [
    { q: 'In which form does glycine mainly exist at pH 1?', choices: ['$\\ce{H2N-CH2-COOH}$', '$\\ce{H3N+}$–CH₂–COOH', '$\\ce{H3N+}$–CH₂–$\\ce{COO-}$', 'H₂N–CH₂–$\\ce{COO-}$'], a: 1,
      why: 'At pH 1, below both pKa values (2.34 and 9.60), both groups hold their protons: the amino group is –NH₃⁺ and the carboxyl stays –COOH. Net charge +1.' },
    { q: 'Alanine has pKa values 2.34 and 9.69. What is its isoelectric point?', answer: 6.01,
      why: 'pI = (2.34 + 9.69)/2 = 6.015.' },
    { q: 'Cooking an egg breaks the peptide bonds of its proteins.', a: false,
      why: 'Heat disrupts hydrogen bonds and other weak interactions, so the proteins unfold and tangle (denature). The covalent peptide bonds survive.' },
    { q: 'What holds an α-helix together?', choices: ['disulfide bridges', 'hydrogen bonds between backbone C=O and N–H groups four residues apart', 'ionic bonds between side chains', 'peptide bonds between side chains'], a: 1,
      why: 'Secondary structure is held by backbone hydrogen bonds: in the α-helix, the C=O of residue i bonds to the N–H of residue i + 4.' },
    { q: 'In electrophoresis at pH 7, which way does lysine (pI 9.74) move?', choices: ['towards the negative electrode', 'towards the positive electrode', 'it does not move', 'it moves both ways'], a: 0,
      why: 'Below its pI lysine is net positive (about +1 at pH 7), so it travels towards the cathode, the negative electrode.' }
  ],
  applications: ['Protein separation by electrophoresis and isoelectric focusing.', 'Nutrition: essential amino acids and protein quality.', 'Recombinant insulin and antibody drugs.', 'Cooking, cheese-making and hair perming all change protein structure.'],
  history: 'Emil Fischer made the first synthetic peptides and proposed the peptide bond in 1902. Linus Pauling and Robert Corey predicted the α-helix and β-sheet in 1951; Frederick Sanger sequenced insulin in 1955, the first protein sequence ever read.',
  sim: 'org-amino-ph'
},

{
  id: 'lipids', parent: 'biomolecules', title: 'Lipids', level: 2,
  short: 'Lipids are the molecules of life that dissolve in oil rather than water: fats and oils (triglycerides), the phospholipids of cell membranes, and steroids such as cholesterol. Long hydrocarbon tails make them compact energy stores and self-assembling barriers.',
  keywords: ['lipid', 'fat', 'oil', 'triglyceride', 'triacylglycerol', 'fatty acid', 'saturated', 'unsaturated', 'monounsaturated', 'polyunsaturated', 'omega-3', 'cis', 'trans fat', 'hydrogenation', 'iodine value', 'saponification value', 'soap', 'micelle', 'phospholipid', 'lipid bilayer', 'cell membrane', 'cholesterol', 'steroid', 'biodiesel'],
  prereq: ['carboxylic-acids-esters', 'intermolecular-forces', 'addition-alkenes'],
  related: ['stereoisomers', 'hydrogen-bonding', 'solubility', 'enthalpy', 'carbohydrates', 'amino-acids-proteins'],
  body: `
Lipids are grouped by behaviour rather than by one functional group: they are the biomolecules that dissolve in non-polar solvents and not in water. What they share is a large hydrocarbon part.

### Fatty acids
A fatty acid is a long, unbranched hydrocarbon chain with a carboxylic acid at one end — usually with an even number of carbons, 12 to 22, because cells build them two carbons at a time.

| Fatty acid | Carbons : C=C | mp |
|---|---|---|
| palmitic (hexadecanoic) | 16 : 0 | 63 °C |
| stearic (octadecanoic) | 18 : 0 | 69 °C |
| oleic | 18 : 1, cis | 13 °C |
| linoleic | 18 : 2, cis | −5 °C |
| α-linolenic | 18 : 3, cis | −11 °C |

**Saturated** chains are straight zigzags that pack neatly and attract each other along their whole length, so they melt high. Natural **unsaturated** fatty acids have cis double bonds, each of which puts a fixed bend in the chain; bent chains cannot pack, and the melting point drops sharply. A trans double bond keeps the chain nearly straight — elaidic acid, the trans isomer of oleic acid, melts at 45 °C. **Omega-3** fatty acids have their last double bond three carbons from the methyl (ω) end: α-linolenic acid from flax, EPA and DHA from oily fish.

### Fats and oils: triglycerides
Glycerol (propane-1,2,3-triol) esterified with three fatty acids gives a **triglyceride** ([[carboxylic-acids-esters]]). Animal fats, rich in saturated chains, are solid at room temperature; plant oils, rich in unsaturated chains, are liquid (palm and coconut oil are the saturated exceptions). Fat is the body's long-term energy store: at about 37 kJ per gram it holds more than twice the energy of carbohydrate or protein, because its carbons are almost fully reduced and it is stored without water. A lean adult carries 10–15 kg of it — enough to fuel several weeks without food — against about half a kilogram of glycogen.

The chemistry of fats is the chemistry of esters and alkenes:
- **Hydrolysis** by lipase enzymes in digestion; boiling with sodium hydroxide (**saponification**) gives glycerol and soap.
- **Hydrogenation** of the C=C bonds hardens oils ([[addition-alkenes]]).
- **Oxidation** by air attacks the positions next to C=C bonds by a radical chain, making the short-chain aldehydes and acids of rancid fat; antioxidants such as vitamin E interrupt it.
- **Transesterification** with methanol swaps glycerol for methyl groups, giving biodiesel.

Two numbers characterise an oil. The **iodine value**, the mass of iodine taken up by 100 g, measures unsaturation: coconut oil about 10, olive about 80, sunflower about 130, linseed about 180 (which is why linseed oil "dries" in paints — its many double bonds cross-link in air). The **saponification value**, milligrams of KOH needed per gram, measures chain length: the shorter the chains, the more ester groups per gram.

### Soaps and micelles
A soap is the sodium salt of a fatty acid: an ionic head that loves water and a hydrocarbon tail that avoids it. In water the tails cluster into **micelles**, balls with the tails inside and the heads outside, which dissolve grease in their oily core so it rinses away. In hard water, calcium and magnesium ions precipitate soap as scum; synthetic detergents with sulfonate heads do not.

### Membranes
A **phospholipid** is glycerol with two fatty acids and a third, phosphate-containing head group. Two tails are too bulky for a micelle, so phospholipids form a **bilayer**, about 5 nm thick, with the heads facing the water on both sides. Every cell is wrapped in one; ions and polar molecules cannot cross without protein channels. The same self-assembly makes liposomes and the lipid nanoparticles that deliver mRNA vaccines.

### Steroids
Steroids have four fused rings — three six-membered and one five-membered. **Cholesterol**, $\\ce{C27H46O}$, stiffens cell membranes and is the raw material for vitamin D, bile acids and the steroid hormones: testosterone, oestradiol, cortisol. Its five degrees of unsaturation are its four rings and one C=C.
`,
  ideas: [
    'Lipids are defined by solubility: they dissolve in non-polar solvents, not in water.',
    'Triglycerides are triesters of glycerol with three fatty acids; fats are mostly saturated, oils mostly unsaturated.',
    'Cis double bonds bend fatty-acid chains, spoil packing and lower melting points; trans chains pack like saturated ones.',
    'Fat stores about 37 kJ/g, over twice as much as carbohydrate.',
    'Amphiphilic molecules self-assemble: soaps into micelles, phospholipids into the bilayers of cell membranes.'
  ],
  pitfalls: [
    'A fat is a single compound — Natural fats are mixtures of many triglycerides with different fatty acids, which is why they soften over a range instead of melting sharply.',
    'Unsaturated fats contain fewer calories — Per gram they provide almost exactly the same energy (about 37 kJ); they differ in their effects on blood lipids.',
    'Cholesterol is a fat, and all of it is harmful — Cholesterol is a steroid alcohol, not a triglyceride, and every cell membrane needs it; the health question concerns how it is carried in the blood.'
  ],
  formulas: [
    {
      name: 'Iodine value',
      expr: 'IV = 100*nd*MI/M', tex: '\\mathrm{IV} = \\frac{100\\,n\\,M_{\\ce{I2}}}{M}',
      vars: {
        IV: { name: 'iodine value (g of I₂ per 100 g of fat)', tex: '\\mathrm{IV}' },
        nd: { name: 'C=C double bonds per molecule', int: true, value: 3, tex: 'n' },
        MI: { name: 'molar mass of iodine', q: 'molarmass', unit: 'g/mol', value: 253.8, fixed: true, tex: 'M_{\\ce{I2}}' },
        M: { name: 'molar mass of the fat', q: 'molarmass', unit: 'g/mol', value: 885.45 }
      },
      note: 'Each C=C takes up one I₂ (in practice iodine monochloride is used, with the result expressed as iodine). Default: triolein, glycerol with three oleic acids.',
      practice: { unknowns: ['IV', 'nd'] },
      stories: {
        IV: 'A triglyceride of molar mass {M} has {nd} C=C double bonds per molecule. What is its iodine value?',
        nd: 'A pure triglyceride of molar mass {M} has an iodine value of {IV}. How many C=C bonds does each molecule contain?'
      }
    },
    {
      name: 'Saponification value',
      expr: 'SV = 1000*ne*MK/M', tex: '\\mathrm{SV} = \\frac{1000\\,n_e\\,M_{\\ce{KOH}}}{M}',
      vars: {
        SV: { name: 'saponification value (mg KOH per g of fat)', tex: '\\mathrm{SV}' },
        ne: { name: 'ester groups per molecule', int: true, value: 3, fixed: true, tex: 'n_e' },
        MK: { name: 'molar mass of KOH', q: 'molarmass', unit: 'g/mol', value: 56.11, fixed: true, tex: 'M_{\\ce{KOH}}' },
        M: { name: 'molar mass of the fat', q: 'molarmass', unit: 'g/mol', value: 885.45 }
      },
      note: 'Each ester group consumes one KOH. Solved for M, it gives the average molar mass of an oil from a titration. Default: triolein.',
      practice: { unknowns: ['SV', 'M'] },
      stories: {
        SV: 'How many milligrams of KOH does one gram of a triglyceride of molar mass {M} need for complete saponification?',
        M: 'An oil has a saponification value of {SV}. What is the average molar mass of its triglycerides?'
      }
    }
  ],
  examples: [
    {
      title: 'Characterising triolein',
      q: 'Triolein, the triglyceride of oleic acid, is $\\ce{C57H104O6}$ (885.45 g/mol) with three C=C. Find its iodine value and saponification value.',
      steps: [
        'Iodine value: $100 \\times 3 \\times 253.8/885.45 = 86.0$ g of I₂ per 100 g.',
        'Saponification value: $1000 \\times 3 \\times 56.11/885.45 = 190$ mg of KOH per g.',
        'Olive oil, mostly triolein, has an iodine value close to this; oils richer in linoleic acid score higher.'
      ],
      a: 'IV = 86; SV = 190 mg KOH/g.'
    },
    {
      title: 'Making soap',
      q: 'Tristearin ($\\ce{C57H110O6}$, 891.50 g/mol) is boiled with sodium hydroxide. What mass of NaOH is needed for 1.000 kg of fat, and what mass of sodium stearate ($\\ce{C17H35COONa}$, 306.47 g/mol) forms?',
      steps: [
        'Amount of fat: $1000/891.50 = 1.1217$ mol. Each has three ester links: $3 \\times 1.1217 = 3.365$ mol of NaOH.',
        'NaOH: $3.365 \\times 40.00 = 134.6$ g.',
        'Soap: $3.365 \\times 306.47 = 1031$ g, plus 103 g of glycerol.'
      ],
      a: 'About 135 g of NaOH; about 1.03 kg of soap.'
    }
  ],
  quiz: [
    { q: 'Which fatty acid has the lowest melting point?', choices: ['stearic (18:0)', 'palmitic (16:0)', 'elaidic (18:1, trans)', 'linoleic (18:2, cis)'], a: 3,
      why: 'Two cis double bonds put two bends in the chain, so linoleic acid packs worst and melts at −5 °C. The trans acid is nearly straight and melts at 45 °C.' },
    { q: 'Trans fats are unsaturated but pack together much like saturated fats.', a: true,
      why: 'A trans double bond keeps the chain almost straight, so the molecules line up like saturated ones — which is why partially hydrogenated oils became solid.' },
    { q: 'Trilinolein ($\\ce{C57H98O6}$, 879.40 g/mol) has six C=C per molecule. What is its iodine value?', answer: 173.2,
      why: '$100 \\times 6 \\times 253.8/879.40 = 173$ g of iodine per 100 g — typical of highly unsaturated oils such as sunflower or linseed.' },
    { q: 'What forms when a fat is boiled with sodium hydroxide?', choices: ['glycerol and soap (sodium salts of fatty acids)', 'glycerol and fatty acids', 'margarine', 'biodiesel'], a: 0,
      why: 'Saponification hydrolyses the three ester links; in alkali the fatty acids end up as their sodium salts — soap — and glycerol is released.' },
    { q: 'Why do phospholipids form bilayers in water?', choices: ['they are ionic', 'each has a water-loving head and two water-avoiding tails, so the tails hide between two layers of heads', 'they react with water', 'they are denser than water'], a: 1,
      why: 'Amphiphilic molecules arrange to keep their tails away from water. Two bulky tails per molecule fit best in a flat bilayer rather than a spherical micelle.' }
  ],
  applications: ['Margarine, cooking oils and the regulation of trans fats.', 'Soap-making and detergents.', 'Biodiesel from vegetable oils and waste fats.', 'Lipid nanoparticles for mRNA vaccines and drug delivery.'],
  history: 'Michel Eugène Chevreul showed between 1811 and 1823 that fats are compounds of glycerol and fatty acids, and explained soap-making. In 1925 Gorter and Grendel extracted the lipid from red blood cell membranes and found enough to cover the cells twice — the first evidence for the bilayer.',
  sim: { id: 'org-groups', params: { mol: 'oleic' } }
},

{
  id: 'nucleic-acids', parent: 'biomolecules', title: 'Nucleic acids', level: 2,
  short: 'DNA and RNA are chains of nucleotides — a sugar, a phosphate and a base. Two DNA strands wind into a double helix held by hydrogen-bonded base pairs, A with T and G with C, so each strand is a template for the other: the chemistry behind heredity, PCR and mRNA vaccines.',
  keywords: ['nucleic acid', 'DNA', 'RNA', 'nucleotide', 'nucleoside', 'base', 'purine', 'pyrimidine', 'adenine', 'guanine', 'cytosine', 'thymine', 'uracil', 'deoxyribose', 'ribose', 'phosphodiester bond', 'double helix', 'base pairing', 'Chargaff rules', 'melting temperature', 'genetic code', 'codon', 'replication', 'PCR', 'mRNA'],
  prereq: ['carbohydrates', 'hydrogen-bonding', 'polymers'],
  related: ['amino-acids-proteins', 'aromatic-compounds', 'acid-base-definitions', 'enzyme-kinetics', 'math:exponential-growth-decay', 'math:combinatorics'],
  body: `
### Nucleotides
A nucleic acid is a condensation polymer of **nucleotides**, each built from three parts:
- a **phosphate** group;
- a five-carbon sugar: **2-deoxyribose** in DNA (no –OH on carbon 2), **ribose** in RNA;
- a **base**: a flat, aromatic ring system containing nitrogen ([[aromatic-compounds]]). The **purines** adenine (A) and guanine (G) have two fused rings; the **pyrimidines** cytosine (C), thymine (T, in DNA) and uracil (U, in RNA) have one.

The phosphate links the 3′ carbon of one sugar to the 5′ carbon of the next (a **phosphodiester** bond), giving a sugar–phosphate backbone with the bases hanging off it. A strand therefore has a direction, from a 5′ end to a 3′ end. Each phosphate has a p$K_a$ near 1, so at any biological pH it carries a negative charge: DNA is a long polyanion, which is why it moves towards the positive electrode in gel electrophoresis.

### The double helix
In 1953 James Watson and Francis Crick built a model that fitted Rosalind Franklin and Raymond Gosling's X-ray photographs and Erwin Chargaff's rule that in any DNA the amount of A equals that of T, and G equals C. Two strands run in opposite directions (**antiparallel**) and wind around each other; the backbones lie outside and the bases stack inside, 0.34 nm apart, about 10.5 base pairs per turn, in a helix 2 nm wide.

Across the middle the bases pair by [[hydrogen-bonding|hydrogen bonds]]: **A with T by two**, **G with C by three**. Only a purine opposite a pyrimidine fits the fixed width of the helix, and only these partners line up their hydrogen-bond donors and acceptors. The pairing makes the strands **complementary**: one strand's sequence dictates the other's, so when the helix is unzipped each half can template a new partner — the copying mechanism Watson and Crick noticed at once.

The hydrogen bonds give the pairing its specificity, but much of the helix's stability comes from the stacking of the flat bases on top of each other. Heating unstacks and separates the strands ("melting"); GC-rich DNA, with three hydrogen bonds per pair and stronger stacking, melts at a higher temperature. For short strands a useful estimate is $T_m \\approx 2(A + T) + 4(G + C)$ °C.

### Scale
A human cell's nucleus holds about $6.2 \\times 10^9$ base pairs (two copies of a $3.1 \\times 10^9$ genome). At 0.34 nm each, that is about **2 metres** of DNA, wound around histone proteins and packed into a nucleus a few micrometres across.

### From DNA to protein
Genes are copied into messenger **RNA** (transcription), with U in place of T, and the RNA is read three bases at a time (translation). With four bases there are $4^3 = 64$ **codons** for 20 amino acids and three stop signals, so most amino acids have several codons ([[amino-acids-proteins]]).

Why two nucleic acids? RNA's extra 2′-OH can attack the neighbouring phosphodiester bond and cut the chain, so RNA is a short-lived working copy; DNA, without it, is a stable archive. DNA uses thymine rather than uracil because cytosine slowly loses its amino group and becomes uracil; a U in DNA is then recognisable as damage and repaired.

### Nucleic-acid chemistry at work
The **polymerase chain reaction** (PCR) copies a chosen stretch of DNA by cycling the temperature: about 95 °C to separate the strands, 50–65 °C to let short primers pair, 72 °C for a heat-stable polymerase (from a hot-spring bacterium) to extend them. Every cycle doubles the number of copies, so 30 cycles multiply it by about a billion — enough to detect a virus or identify a person from a trace. **mRNA vaccines** deliver synthetic messenger RNA, chemically modified to evade the immune alarm, inside lipid nanoparticles ([[lipids]]); the cell's ribosomes read it and make the viral protein that trains the immune system.
`,
  ideas: [
    'Nucleotides are phosphate + sugar (deoxyribose in DNA, ribose in RNA) + a nitrogenous base.',
    'Phosphodiester bonds form a negatively charged sugar–phosphate backbone with a 5′ → 3′ direction.',
    'DNA is a double helix of two antiparallel strands; A pairs with T (two hydrogen bonds), G with C (three).',
    'Complementary pairing lets each strand template the other: the basis of replication, transcription and PCR.',
    'GC-rich DNA melts at higher temperature; base stacking contributes much of the helix\'s stability.'
  ],
  pitfalls: [
    'The two strands of DNA are identical copies — They are complementary and run in opposite directions: where one has A the other has T.',
    'Hydrogen bonds alone hold the double helix together — They make the pairing specific, but stacking of the flat bases on each other provides much of the stability.',
    'Chargaff\'s rule A = T holds for a single strand — Only for double-stranded DNA, where every A is paired with a T; a single strand (or RNA) can have any composition.'
  ],
  formulas: [
    {
      name: 'Length of a DNA double helix',
      expr: 'L = N*d', tex: 'L = N\\,d',
      vars: {
        L: { name: 'length of the helix', q: 'length', unit: 'm' },
        N: { name: 'number of base pairs', q: 'count', value: 3.1e9 },
        d: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true }
      },
      note: 'Default: one copy of the human genome, just over a metre of DNA.',
      practice: { unknowns: ['L', 'N'] },
      stories: {
        L: 'How long is a DNA double helix of {N} base pairs?',
        N: 'A circular bacterial chromosome is {L} long. How many base pairs does it contain?'
      }
    },
    {
      name: 'Melting temperature of a short DNA strand (Wallace rule)',
      expr: 'Tm = 2*AT + 4*GC', tex: 'T_m \\approx 2\\,n_{AT} + 4\\,n_{GC}',
      vars: {
        Tm: { name: 'melting temperature (°C)', tex: 'T_m' },
        AT: { name: 'number of A and T bases', int: true, value: 10, tex: 'n_{AT}' },
        GC: { name: 'number of G and C bases', int: true, value: 10, tex: 'n_{GC}' }
      },
      note: 'An empirical rule for primers of about 14–20 bases in typical PCR salt conditions: each A·T pair adds about 2 °C, each G·C pair about 4 °C. Longer DNA needs more complete models.',
      practice: { unknowns: ['Tm', 'GC'] },
      stories: {
        Tm: 'A PCR primer contains {AT} A or T bases and {GC} G or C bases. Estimate its melting temperature in °C.',
        GC: 'A primer with {AT} A or T bases should melt at about {Tm} °C. How many G or C bases does it need?'
      }
    },
    {
      name: 'Copies after PCR cycles',
      expr: 'Nc = N0*2^n', tex: 'N = N_0 \\, 2^{n}',
      vars: {
        Nc: { name: 'number of copies after the cycles', q: 'count', tex: 'N' },
        N0: { name: 'number of copies at the start', q: 'count', value: 10, tex: 'N_0' },
        n: { name: 'number of cycles', int: true, value: 30 }
      },
      note: 'Ideal doubling in every cycle ([[math:exponential-growth-decay]]). Real reactions run at 90–100 % efficiency and level off once primers or nucleotides run low.',
      practice: { unknowns: ['Nc', 'n'] },
      stories: {
        Nc: 'A sample contains {N0} copies of a viral gene. How many copies are there after {n} ideal PCR cycles?',
        n: 'How many ideal PCR cycles turn {N0} copies into {Nc}?'
      }
    }
  ],
  examples: [
    {
      title: 'Chargaff\'s rules',
      q: 'A sample of double-stranded DNA contains 22 % adenine. What are the percentages of the other three bases?',
      steps: [
        'Every A is paired with a T: T = 22 %.',
        'That leaves $100 - 44 = 56$ % for G and C, which are also paired: G = C = 28 %.'
      ],
      a: 'T 22 %, G 28 %, C 28 %.'
    },
    {
      title: 'Two metres in a nucleus',
      q: 'A human cell contains $6.2 \\times 10^9$ base pairs of DNA. How long would it be stretched out?',
      steps: [
        '$L = 6.2 \\times 10^9 \\times 0.34 \\times 10^{-9}\\ \\mathrm{m} = 2.1$ m.',
        'The nucleus is about 6 µm across, some 350 000 times smaller: the DNA is wound around histones, then coiled and looped again and again.'
      ],
      a: 'About 2.1 m.'
    },
    {
      title: 'How fast PCR amplifies',
      q: 'A swab contains 10 copies of a viral gene. How many copies after 30 ideal cycles, and how long does it take at 2 minutes per cycle?',
      steps: [
        '$N = 10 \\times 2^{30} = 10 \\times 1.07 \\times 10^9 = 1.1 \\times 10^{10}$ copies.',
        'Time: $30 \\times 2 = 60$ min — about an hour from undetectable to easily measured.'
      ],
      a: 'About 10¹⁰ copies in an hour.'
    }
  ],
  quiz: [
    { q: 'In DNA, guanine pairs with…', choices: ['adenine', 'thymine', 'cytosine', 'uracil'], a: 2,
      why: 'G pairs with C through three hydrogen bonds; A pairs with T through two. Uracil replaces thymine in RNA.' },
    { q: 'A double-stranded DNA is 30 % adenine. What percentage is guanine?', answer: 20,
      why: 'A = T = 30 %, leaving 40 % shared equally between G and C: 20 % each.' },
    { q: 'RNA contains thymine.', a: false,
      why: 'RNA uses uracil, which pairs with adenine just as thymine does; thymine (5-methyluracil) is used in DNA.' },
    { q: 'Why does GC-rich DNA melt at a higher temperature than AT-rich DNA?', choices: ['G and C are heavier', 'G·C pairs have three hydrogen bonds and stack more strongly', 'G and C are charged', 'AT-rich DNA has no backbone'], a: 1,
      why: 'Three hydrogen bonds per G·C pair against two per A·T pair, and stronger stacking, make GC-rich regions harder to pull apart.' },
    { q: 'How many different codons (three-letter words) can be made from the four bases?', answer: 64,
      why: 'Four choices for each of three positions: 4³ = 64 — more than enough for 20 amino acids plus stop signals.' }
  ],
  applications: ['PCR testing for infections and forensic DNA profiling.', 'DNA sequencing and genome medicine.', 'mRNA vaccines and therapies.', 'Gel electrophoresis, which separates DNA fragments by size.'],
  history: 'Friedrich Miescher isolated "nuclein" from pus cells in 1869. The double helix was published by Watson and Crick in 1953, based on X-ray images by Rosalind Franklin and Raymond Gosling. Kary Mullis invented PCR in 1983; mRNA vaccine work by Katalin Karikó and Drew Weissman won the 2023 Nobel Prize.'
}

);
