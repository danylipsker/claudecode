/* HYPER-MEDICINE · content/cells-tissues.js — How the Body Works: cells and tissues.
 * The cell, moving across membranes, the membrane potential, tissues and organs, DNA and genes. */
Hyper.add(

/* ================================================================ THE CELL */
{
  id: 'cell-structure', parent: 'cells-tissues', title: 'The cell', level: 1,
  short: 'The smallest living unit of the body: a membrane-wrapped compartment of water, proteins and machinery, with a nucleus that holds the instructions and mitochondria that make the energy. About thirty trillion cells, of a few hundred kinds, make up an adult.',
  keywords: ['cell', 'organelle', 'nucleus', 'mitochondria', 'plasma membrane', 'cytoplasm', 'endoplasmic reticulum', 'Golgi', 'lysosome', 'ribosome', 'cytoskeleton', 'cilia', 'apoptosis', 'cell size', 'surface-to-volume ratio', 'diffusion'],
  prereq: ['chemistry:amino-acids-proteins', 'chemistry:lipids'],
  related: ['membrane-transport', 'tissue-types', 'dna-genes', 'metabolism-energy', 'what-is-cancer', 'microbes-types'],
  body: `
A finger-prick drop of blood, about 50 microlitres, holds roughly 250 million red blood cells. Each is a soft disc 7–8 µm across — a tenth of the width of a hair — and an adult carries about 25 trillion of them. Add skin, muscle, nerve, fat, bone, gut lining and immune cells, and a 2016 estimate for a 70 kg adult comes to about **30 trillion cells** of a few hundred distinct types. About as many bacteria live in and on us, mostly in the colon, but they are so much smaller that together they weigh only about 0.2 kg.

### A small, crowded factory
Every cell is wrapped in a **plasma membrane**: a film of fatty molecules (a lipid bilayer) about 5 nanometres thick, studded with proteins that work as gates, pumps and receivers for messages. Inside is the **cytoplasm**, a crowded gel of water, salts and proteins, and a set of compartments — the organelles — each with its own job:

| Part | What it does | When it goes wrong |
|---|---|---|
| Nucleus | keeps the DNA and copies genes into messenger RNA | mutations that remove the brakes on division can start a cancer |
| Ribosomes | read the messenger RNA and join amino acids into proteins | bacterial ribosomes differ from ours: several antibiotics exploit this |
| Endoplasmic reticulum | folds new proteins, makes lipids, stores calcium | the commonest cystic fibrosis mutation gives a protein that misfolds and is held back here |
| Golgi apparatus | finishes, sorts and addresses proteins for export | rare inherited faults in adding sugar chains cause severe disease |
| Lysosomes | acid sacs of enzymes that recycle worn parts | a missing enzyme lets waste pile up: storage diseases such as Tay–Sachs |
| Mitochondria | burn fuel with oxygen to make ATP, the energy currency | mitochondrial diseases strike energy-hungry brain, muscle, heart and eyes |
| Cytoskeleton | cables and tubes that give shape, carry cargo and split the cell in two | some cancer medicines jam the tubes of dividing cells |
| Cilia | beating hairs that sweep mucus up and out of the airways | smoking slows them; in primary ciliary dyskinesia they barely beat |

Mitochondria are the descendants of bacteria that moved into our ancestors' cells well over a billion years ago. They still carry a little DNA of their own — 16,569 letters, 37 genes — which a child inherits almost entirely from the mother.

### Why cells are small
There is no circulation inside a cell: oxygen, sugar and signals mostly wander by [[chemistry:effusion-diffusion|diffusion]], random jostling that covers ground only as the square root of time:

$$t \\approx \\frac{x^2}{2D}$$

For oxygen in water ($D \\approx 2 \\times 10^{-9}$ m²/s), crossing 10 µm takes about 25 milliseconds, 1 mm about four minutes, and 1 cm about seven hours. A cell the size of a grape would suffocate at its centre, which is why large animals need a circulation that brings blood within a fraction of a millimetre of nearly every cell. Size costs in a second way: the surface of a sphere grows as $r^2$ but its volume as $r^3$, so the surface-to-volume ratio is $3/r$ ([[math:scaling-laws|scaling]]). Double the radius and each unit of volume has half as much membrane to feed it. Cells that exchange a lot fold their surface: the brush border of gut cells, the fine branches of neurons.

### One genome, hundreds of cell types
Almost every cell carries the same DNA; a neuron and a liver cell differ because they switch on different genes ([[dna-genes]]). Red cells go further and discard their nucleus and mitochondria to make room for haemoglobin, so they cannot divide or repair themselves and last about 120 days. Cells are replaced all the time: a 2021 estimate puts the turnover at about 330 billion cells a day, roughly 1 % of the body, mostly blood cells and gut lining. Cells that are damaged or no longer wanted take themselves apart in a tidy, programmed death called **apoptosis**. Cancer, at its core, is cells escaping both the signals to stop dividing and the signal to die ([[what-is-cancer]]).

> [!fact] Bacteria are a different kind of cell altogether: typically 1–2 µm long, with no nucleus and no mitochondria, and a cell wall that ours lack. Those differences are the targets of [[antibiotics]] — and the reason antibiotics do nothing against viruses, which are not cells at all ([[microbes-types]]).
`,
  ideas: [
    'The cell is the smallest unit that is alive; about 30 trillion of them, of a few hundred types, make up an adult.',
    'Organelles divide the work: the nucleus stores instructions, ribosomes build proteins, mitochondria make ATP, lysosomes recycle.',
    'Diffusion time grows as distance squared, which keeps cells microscopic and makes a circulation necessary.',
    'Nearly every cell has the same genome; cell types differ in which genes are switched on.',
    'Cells are constantly renewed and removed by programmed death; cancer is the escape from both controls.'
  ],
  pitfalls: [
    'A bigger cell is simply a more capable cell — Volume grows faster than surface, and diffusion slows with the square of distance; beyond a few tens of micrometres a cell cannot feed its own centre.',
    'Every cell in the body is basically the same — The same DNA is read very differently: a red cell has no nucleus at all, a muscle fibre has hundreds, and a neuron may reach a metre in length.',
    'Antibiotics kill germs in general — They target features of bacterial cells (walls, ribosomes) that our cells and viruses do not have; they do not work on viral colds.'
  ],
  formulas: [
    {
      name: 'Time to diffuse a distance',
      expr: 't = x^2/(2*D)', tex: 't = \\frac{x^2}{2D}',
      vars: {
        t: { name: 'typical diffusion time', q: 'time', unit: 's' },
        x: { name: 'distance', q: 'length', unit: 'µm', value: 10 },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'm²/s', value: 2e-9 }
      },
      note: 'The one-dimensional random-walk estimate (in three dimensions the mean square distance is 6Dt). Oxygen in water at body temperature has D ≈ 2–3 × 10⁻⁹ m²/s; proteins are 10–100 times slower, and crowded cytoplasm slows everything further.',
      practice: { unknowns: ['t', 'x'] },
      stories: { t: 'An oxygen molecule leaves a capillary and must diffuse {x} to reach a cell. Roughly how long does that take?', x: 'How far does oxygen typically spread by diffusion alone in {t}?' }
    },
    {
      name: 'Surface-to-volume ratio of a sphere',
      expr: 'SV = 3/r', tex: 'S_V = \\frac{3}{r}',
      vars: {
        SV: { name: 'surface area ÷ volume (per µm)', tex: 'S_V' },
        r: { name: 'radius (µm)', value: 5 }
      },
      note: 'Area 4πr² divided by volume (4/3)πr³. The ratio falls as the cell grows, so large cells have too little membrane for their volume unless they flatten, fold or branch.',
      stories: { SV: 'A roughly spherical cell has a radius of {r} micrometres. How many square micrometres of membrane does it have per cubic micrometre of contents?' }
    }
  ],
  examples: [
    {
      title: 'Why there are no cells the size of a grape',
      q: 'A grape is about 1 cm across. If it were a single cell, how long would oxygen take to diffuse from its surface to its centre, 0.5 cm away? Compare a normal cell, whose centre is 10 µm from the nearest capillary.',
      steps: [
        'Use $t \\approx x^2/(2D)$ with $D = 2 \\times 10^{-9}$ m²/s.',
        'Grape-sized cell: $x = 5 \\times 10^{-3}$ m, so $t = 25 \\times 10^{-6} / (4 \\times 10^{-9}) \\approx 6250$ s — about 1 h 45 min.',
        'Normal cell: $x = 10^{-5}$ m, so $t = 10^{-10} / (4 \\times 10^{-9}) = 0.025$ s.',
        'The ratio of distances is 500, so the ratio of times is $500^2 = 250\\,000$. A cell burns its oxygen in seconds; the giant cell\'s core would die long before supplies arrived.'
      ],
      a: 'About 1.7 hours instead of 25 milliseconds: diffusion only works over microscopic distances, so bodies are built from small cells supplied by capillaries.'
    },
    {
      title: 'The spare membrane of a red cell',
      q: 'A red cell has a volume of about 90 fL (1 fL = 1 µm³) and a membrane area of about 136 µm². What area would a sphere of the same volume have, and why does the difference matter?',
      steps: [
        'Radius of the sphere: $r = \\sqrt[3]{3V/4\\pi} = \\sqrt[3]{3 \\times 90 / 4\\pi} \\approx 2.78$ µm.',
        'Its area: $4\\pi r^2 \\approx 97$ µm².',
        'The real disc has $136/97 \\approx 1.4$ times the membrane a sphere would need.',
        'That spare membrane lets the cell fold to squeeze through capillaries narrower than itself, and lets it swell by about two-thirds before the membrane is stretched tight and bursts.'
      ],
      a: 'About 97 µm² — the disc carries some 40 % extra membrane, which gives it flexibility and room to swell.'
    }
  ],
  quiz: [
    { q: 'Which of these cells has no nucleus when mature?', choices: ['a neuron', 'a red blood cell', 'a skeletal muscle fibre', 'a liver cell'], a: 1,
      why: 'Red cells expel their nucleus as they mature, to make room for haemoglobin. Skeletal muscle fibres go the other way, with hundreds of nuclei.' },
    { q: 'If a spherical cell doubles its radius, its surface-to-volume ratio…', choices: ['doubles', 'halves', 'falls to a quarter', 'stays the same'], a: 1,
      why: 'The ratio is 3/r: area grows fourfold and volume eightfold, so each unit of volume has half as much surface.' },
    { q: 'About how long does oxygen take to diffuse 100 µm through water (D = 2 × 10⁻⁹ m²/s)?', answer: 2.5, unit: 's',
      why: 't = x²/(2D) = (10⁻⁴)² / (4 × 10⁻⁹) = 2.5 s — a hundred times longer than for 10 µm, because time grows with distance squared.' },
    { q: 'Your liver cells and your neurons carry different genes, which is why they look and work so differently.', a: false,
      why: 'They carry essentially the same genome. What differs is which genes are switched on and off, set during development and kept by the cell.' },
    { q: 'The DNA in your mitochondria came…', choices: ['equally from both parents', 'almost entirely from your mother', 'almost entirely from your father', 'from neither: it is made new in each cell'], a: 1,
      why: 'The egg supplies the mitochondria of the embryo; the father\'s few mitochondria in the sperm are destroyed. This is why mitochondrial diseases pass down the maternal line.' }
  ],
  applications: ['Blood films and cytology (such as cervical screening), where changes in the look of cells reveal disease.', 'Antibiotics that hit bacterial ribosomes or cell walls and spare human cells.', 'Diagnosing mitochondrial and lysosomal storage diseases from cell and enzyme tests.', 'Bone-marrow transplants, which replace the cells that make all the others in the blood.'],
  history: 'Robert Hooke named "cells" in 1665 after the little rooms he saw in cork. Schleiden and Schwann proposed in 1838–39 that all living things are made of cells, and Rudolf Virchow added in 1855 that every cell comes from another cell. The electron microscope revealed the organelles in detail from the 1950s.',
  sim: 'fnd-cell'
},

/* ================================================================ MEMBRANE TRANSPORT */
{
  id: 'membrane-transport', parent: 'cells-tissues', title: 'Moving across membranes', level: 2,
  short: 'How substances enter and leave cells: by diffusing through the membrane, through channels and carriers, by pumps that spend energy, and in bubbles of membrane — and how water follows dissolved particles by osmosis.',
  keywords: ['diffusion', 'facilitated diffusion', 'active transport', 'sodium–potassium pump', 'Na+/K+-ATPase', 'cotransport', 'SGLT', 'GLUT', 'aquaporin', 'osmosis', 'osmolality', 'tonicity', 'isotonic', 'hypotonic', 'hypertonic', 'endocytosis', 'oral rehydration solution', 'cholera', 'cystic fibrosis'],
  prereq: ['cell-structure', 'chemistry:osmotic-pressure', 'chemistry:effusion-diffusion'],
  related: ['membrane-potential', 'body-fluids', 'electrolytes', 'digestion-absorption', 'tubular-function', 'glucose-regulation'],
  body: `
In a cholera outbreak a person can lose ten litres or more of watery stool in a day and die of dehydration within hours. Yet a simple drink — clean water with the right amounts of salt and sugar — saves most of them. It works because a protein in the lining of the small intestine carries sodium and glucose into the cell *together*; the salt that follows pulls water after it, and cholera does not switch that carrier off. Oral rehydration solution is credited with saving tens of millions of lives since the 1970s, and it rests entirely on how molecules cross membranes.

### Four ways in and out
The lipid bilayer is oily, so what can cross it on its own depends on size and charge:

- **Simple diffusion** — small, uncharged or fat-soluble molecules (oxygen, carbon dioxide, alcohol, steroid hormones, many medicines) slip straight through, always downhill from high to low concentration.
- **Channels and carriers** (facilitated diffusion) — ions, sugars and water need protein doorways. Channels are selective pores, often gated open and shut; a single potassium channel can pass tens of millions of ions a second. Water uses channels called **aquaporins**. Carriers such as the GLUT family bind glucose and flip it across. Still downhill, but faster and more selective.
- **Pumps** (primary active transport) — spend ATP to push substances *uphill*. The **sodium–potassium pump** throws out 3 Na⁺ and brings in 2 K⁺ for every ATP; it keeps cells low in sodium and rich in potassium, and uses something like a fifth to a quarter of the energy you burn at rest (far more in the brain and kidneys). The stomach's proton pump makes gastric acid.
- **Cotransporters** (secondary active transport) — let sodium run downhill into the cell and use that energy to drag something else in with it. SGLT1 in the gut is the one behind oral rehydration; SGLT2 recovers glucose in the kidney, and medicines that block it make people with diabetes pass extra sugar in their urine ([[tubular-function]]).

Large particles travel in bubbles of membrane: **endocytosis** brings in cholesterol particles and bacteria, **exocytosis** releases hormones and neurotransmitters.

### Osmosis: water follows particles
Water crosses membranes easily, and it moves towards the side with more dissolved particles. What counts is the number of particles, not their size: a litre of plasma holds about 290 milliosmoles of them — mostly sodium, chloride and bicarbonate outside cells, potassium and organic ions inside. The pull is enormous. By van 't Hoff's law, $\\pi = c R T$, a difference of just 1 mOsm per litre across a membrane exerts about 19 mmHg ([[chemistry:osmotic-pressure|osmotic pressure]]), so cells swell or shrink within seconds when the fluid around them changes.

What matters for a cell is **tonicity**: the particles that *cannot* get in. A 0.9 % salt solution ("normal saline") has about the same effective strength as plasma, so red cells in it keep their shape. In pure water they swell into spheres and burst; in strong salt they shrivel and pucker. A solution of urea can match plasma's osmolality and still burst cells, because urea leaks in and water follows it; 5 % glucose is safe in the bag but behaves like water once cells take the glucose up and burn it.

> [!warn] Dehydration from diarrhoea or vomiting can become dangerous quickly, especially in babies, young children and older people. Seek urgent medical help for very little or no urine, no tears, sunken eyes, unusual sleepiness or floppiness, inability to keep fluids down, or blood in the stool; if someone is hard to wake, confused or collapses, call your local emergency number.

### When transport fails
Cystic fibrosis is a faulty chloride channel (CFTR), so mucus in the lungs and pancreas becomes thick and sticky; medicines that help the faulty channel fold and open have transformed the outlook for many people with the condition. Cholera toxin does the opposite, locking the same channel open in the gut. Digoxin, an old heart medicine, works by partly blocking the sodium–potassium pump. And when plasma is diluted too fast, water rushes into brain cells — the danger behind severe low sodium ([[electrolytes]]).
`,
  ideas: [
    'Small uncharged molecules diffuse straight through the lipid bilayer; ions and sugars need channels or carriers.',
    'Pumps spend ATP to move ions uphill; the sodium–potassium pump sets up the gradients most other transport runs on.',
    'Cotransporters use sodium running downhill to carry glucose, amino acids and more — the principle of oral rehydration.',
    'Water follows dissolved particles; a 1 mOsm/L difference exerts about 19 mmHg of osmotic pressure.',
    'Tonicity (particles that cannot enter) decides whether a cell swells or shrinks, not total osmolality.'
  ],
  pitfalls: [
    'Active transport always burns ATP directly — Secondary active transporters such as SGLT use the sodium gradient instead; the ATP was spent earlier by the sodium–potassium pump.',
    'A solution with the same osmolality as plasma is always safe for cells — Only if its particles stay outside. Urea or glucose that enter the cells leave water behind to follow them, and the cells swell.',
    'Water moves towards the side with more water — It moves towards more dissolved particles; thinking "water dilutes the saltier side" gets the direction right.'
  ],
  formulas: [
    {
      name: 'Osmotic pressure (van \'t Hoff)',
      expr: 'dpi = dc*R*T', tex: '\\Delta\\pi = \\Delta c\\, R\\, T',
      vars: {
        dpi: { name: 'osmotic pressure difference', q: 'pressure', unit: 'mmHg', tex: '\\Delta\\pi' },
        dc: { name: 'difference in dissolved particles (osmolarity)', q: 'concentration', unit: 'mmol/L', value: 10, tex: '\\Delta c' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'For impermeant particles, in an ideal solution; 1 mOsm/L is one millimole of dissolved particles per litre. Only a difference across the membrane moves water.',
      practice: { unknowns: ['dpi', 'dc'] },
      stories: { dpi: 'The fluid around a cell becomes {dc} weaker in impermeant particles than the cell inside. What osmotic pressure drives water into the cell?', dc: 'What difference in particle concentration across a membrane produces an osmotic pressure of {dpi}?' }
    },
    {
      name: 'Particles from a dissolved salt',
      expr: 'Osm = phi*i*c', tex: '\\text{Osm} = \\phi\\, i\\, c',
      vars: {
        Osm: { name: 'effective osmolarity', q: 'concentration', unit: 'mmol/L', tex: '\\text{Osm}' },
        phi: { name: 'osmotic coefficient', value: 0.93, tex: '\\phi' },
        i: { name: 'particles per formula unit', value: 2, int: true },
        c: { name: 'concentration of the salt', q: 'concentration', unit: 'mmol/L', value: 154 }
      },
      note: 'NaCl gives 2 particles, CaCl₂ 3, glucose 1. The osmotic coefficient (about 0.93 for saline) corrects for ions that do not act fully independently.',
      practice: { unknowns: ['Osm', 'c'] },
      stories: { Osm: 'Normal saline (0.9 %) contains {c} of sodium chloride. What is its effective osmolarity?', c: 'What concentration of sodium chloride gives an effective osmolarity of {Osm}?' }
    },
    {
      name: 'How a cell\'s volume follows the outside (Boyle–van \'t Hoff)',
      expr: 'v = b + (1 - b)*O0/O', tex: 'v = b + (1 - b)\\,\\frac{O_0}{O}',
      vars: {
        v: { name: 'cell volume ÷ normal volume (V/V₀)' },
        b: { name: 'fraction of the cell that is not water (osmotically inactive)', value: 0.4, min: 0, max: 0.9 },
        O0: { name: 'normal osmolality', q: 'concentration', unit: 'mmol/L', value: 290, fixed: true, tex: 'O_0' },
        O: { name: 'effective osmolality outside', q: 'concentration', unit: 'mmol/L', value: 143 }
      },
      note: 'The cell water shrinks or swells in inverse proportion to the outside tonicity; for red cells b ≈ 0.4. A red cell bursts at about 1.66 times its normal volume, when its disc has become a sphere.',
      practice: { unknowns: ['v', 'O'] },
      stories: { v: 'A red cell is placed in half-strength saline, with an effective osmolality of {O}. By what factor does its volume change?', O: 'A red cell bursts when its volume reaches {v} times normal. At what outside osmolality does that happen?' }
    }
  ],
  examples: [
    {
      title: 'Red cells in half-strength saline',
      q: 'Half-strength saline (0.45 %) has an effective osmolality of about 143 mOsm/kg. What happens to red cells placed in it (b = 0.4), and how close do they come to bursting at 1.66 times normal volume?',
      steps: [
        'Water enters until the inside matches the outside: $V/V_0 = 0.4 + 0.6 \\times 290/143$.',
        '$290/143 = 2.03$, so $V/V_0 = 0.4 + 1.22 = 1.62$.',
        'The cells swell by 62 %, just short of the 66 % that turns the disc into a tight sphere. The most fragile cells burst; this is the basis of the old osmotic fragility test for inherited red-cell disorders.'
      ],
      a: 'They swell to about 1.6 times normal — right at the edge of bursting.'
    },
    {
      title: 'Adding up an oral rehydration solution',
      q: 'The WHO reduced-osmolarity oral rehydration solution contains, per litre, 75 mmol sodium, 65 mmol chloride, 75 mmol glucose, 20 mmol potassium and 10 mmol citrate. What is its osmolarity, and why is it slightly below plasma\'s 290?',
      steps: [
        'Each dissolved particle counts once: $75 + 65 + 75 + 20 + 10 = 245$ mOsm/L.',
        'Compared with plasma (about 290), the solution is slightly hypotonic, so water is drawn from the gut into the body rather than the other way round.',
        'Glucose and sodium in roughly equal amounts feed the SGLT1 cotransporter, which carries them in together — and water follows the absorbed particles.',
        'Older, stronger formulas (311 mOsm/L) were replaced in 2002 because the reduced version cut stool output and vomiting.'
      ],
      a: '245 mOsm/L: a little weaker than plasma, so water and salt are absorbed together.'
    }
  ],
  quiz: [
    { q: 'Which of these crosses a cell membrane most easily by simple diffusion?', choices: ['sodium ions', 'glucose', 'oxygen', 'albumin'], a: 2,
      why: 'Oxygen is small and uncharged, so it dissolves in the oily bilayer. Ions and glucose need channels or carriers; albumin, a large protein, needs vesicles.' },
    { q: 'Red cells are placed in a solution of urea at 300 mOsm/kg — the same osmolality as plasma. What happens?', choices: ['nothing: the solution is iso-osmotic', 'they shrink', 'they swell and may burst', 'they shrink and stay small'], a: 2,
      why: 'Urea crosses the membrane, so it is not an effective osmole: it leaks in, water follows, and with no impermeant particles outside to hold it back the cells swell until they burst. Tonicity, not osmolality, decides.' },
    { q: 'Active transport always uses ATP directly.', a: false,
      why: 'Secondary active transporters (such as SGLT1 and SGLT2) are driven by sodium flowing downhill into the cell; ATP was spent by the sodium–potassium pump to create that gradient.' },
    { q: 'What osmotic pressure does a difference of 5 mOsm/L produce across a membrane at 37 °C?', answer: 96.7, unit: 'mmHg',
      why: 'Δπ = Δc R T = 5 mol/m³ × 8.314 × 310 K ≈ 12 900 Pa ≈ 97 mmHg — more than the mean blood pressure, from a difference of under 2 %.' },
    { q: 'Why does an oral rehydration solution contain sugar as well as salt?', choices: ['to supply calories to a starving patient', 'because the gut carries sodium and glucose in together, and water follows', 'to hide the taste of the salt', 'because glucose kills the bacteria'], a: 1,
      why: 'The SGLT1 cotransporter moves sodium and glucose into gut cells together, and it keeps working in cholera; the absorbed particles pull water with them.' }
  ],
  applications: ['Oral rehydration solution for diarrhoea, one of the most effective treatments ever devised.', 'Choosing intravenous fluids: normal saline, glucose solutions and balanced solutions distribute differently.', 'Medicines that act on transporters: SGLT2 inhibitors, proton pump inhibitors, digoxin, diuretics.', 'Treatments for cystic fibrosis that help the faulty chloride channel reach the membrane and open.'],
  sim: 'fnd-osmosis'
},

/* ================================================================ MEMBRANE POTENTIAL */
{
  id: 'membrane-potential', parent: 'cells-tissues', title: 'The membrane potential', level: 2,
  short: 'Every cell is a tiny battery: its inside sits about 70 millivolts below the outside because potassium leaks out through open channels, down the gradient the sodium–potassium pump builds. The Nernst and Goldman equations predict the voltage from the ion concentrations.',
  keywords: ['membrane potential', 'resting potential', 'Nernst equation', 'Goldman equation', 'equilibrium potential', 'potassium', 'sodium', 'depolarisation', 'hyperpolarisation', 'hyperkalaemia', 'hypokalaemia', 'millivolt', 'ion channel', 'permeability'],
  prereq: ['membrane-transport', 'chemistry:nernst-equation', 'physics:electric-potential'],
  related: ['action-potential', 'neurons', 'electrolytes', 'ecg', 'arrhythmias', 'chemistry:concentration-cells'],
  body: `
A man on dialysis for kidney failure misses a session and eats a large bowl of fruit and a salty snack made with a potassium-based salt substitute. The next day his legs feel heavy and his heart flutters. His blood potassium is 7.0 mmol/L — normal is roughly 3.5 to 5.0 — and the hospital treats it as an emergency before anything else. The reason is not poisoning in any ordinary sense: potassium outside the cells sets the resting voltage of every heart and muscle cell, and a small rise in it shifts that voltage enough to disturb the heartbeat.

### A battery made of salt water
Measure between the inside of a nerve cell and the fluid around it and you find about −70 mV; skeletal and heart muscle sit near −85 to −90 mV. The voltage comes from two ingredients:

1. **Gradients.** The sodium–potassium pump keeps potassium about 30 times more concentrated inside the cell than outside, and sodium about 10 times more concentrated outside.
2. **Selective leaks.** At rest, the membrane has many open potassium channels and few open sodium channels. Potassium ions drift out down their gradient, each carrying a positive charge, and leave the inside slightly negative. That negativity pulls back on the potassium, and within a millisecond the electrical pull balances the chemical push.

The voltage at which the two balance for a single ion is its **equilibrium potential**, given by the [[chemistry:nernst-equation|Nernst equation]]:

$$E = \\frac{RT}{zF}\\ln\\frac{c_\\text{out}}{c_\\text{in}} \\approx \\frac{61.5\\ \\text{mV}}{z}\\,\\log_{10}\\frac{c_\\text{out}}{c_\\text{in}} \\quad (37\\ °\\text{C})$$

| Ion | Outside (mmol/L) | Inside (mmol/L) | Equilibrium potential |
|---|---|---|---|
| K⁺ | 5 | 140 | −89 mV |
| Na⁺ | 145 | 12 | +67 mV |
| Cl⁻ | 110 | 10 | −64 mV |
| Ca²⁺ (free) | 1.2 | 0.0001 | about +125 mV |

The real membrane is leaky to several ions at once, so its voltage is a weighted average of their equilibrium potentials, each weighted by how permeable the membrane is to it. That is the **Goldman equation**. With potassium dominating at rest (sodium permeability about 4 % of potassium's), it gives about −68 mV. Open the sodium channels so that sodium dominates, and the voltage swings towards +67 mV: that is the upstroke of the [[action-potential|action potential]].

> [!key] Remarkably few ions carry the charge. For a cell 20 µm across, reaching −70 mV means moving roughly one potassium ion in sixty thousand. The concentrations barely change; the voltage appears because the membrane is a thin insulator — a [[physics:capacitance|capacitor]] — and a tiny separation of charge across it makes a large voltage.

### What goes wrong
Because the resting potential tracks potassium, blood potassium is watched closely:

- **High potassium (hyperkalaemia)** makes the potential less negative. Sodium channels then partly inactivate, impulses spread more slowly, and the heart can slow, develop dangerous rhythms or stop. Causes include kidney failure, some blood-pressure medicines and potassium-sparing diuretics, potassium supplements, and severe tissue damage.
- **Low potassium (hypokalaemia)** makes it more negative and cells harder to excite: weakness, cramps, constipation, and abnormal rhythms. Vomiting, diarrhoea and some diuretics are common causes.
- A blood sample that was shaken or sat too long can leak potassium out of its red cells (which hold some twenty-five times more than plasma) and falsely show a high value — so a surprising result is usually repeated.

> [!warn] Someone with kidney disease or on medicines that raise potassium who develops palpitations, marked muscle weakness, chest pain, breathlessness or fainting needs urgent assessment — call your local emergency number. Never take potassium supplements or salt substitutes without asking a doctor or pharmacist if you have kidney disease.

The ECG shows these changes first — tall, peaked T waves with high potassium ([[ecg]]) — and the same physics sets the rhythm of the heart's pacemaker cells ([[arrhythmias]]).
`,
  ideas: [
    'The resting potential (about −70 mV in neurons, −90 mV in muscle) comes from ion gradients plus a membrane that is leakiest to potassium.',
    'The Nernst equation gives the voltage at which one ion is in balance: about 61.5 mV per tenfold gradient at body temperature.',
    'The Goldman equation weights each ion by its permeability; switching permeability from potassium to sodium flips the voltage positive.',
    'Only a tiny fraction of ions moves; the membrane is a capacitor that turns a minute charge into a large voltage.',
    'Blood potassium sets the resting potential of heart muscle, which is why both high and low potassium can be dangerous.'
  ],
  pitfalls: [
    'The resting potential exists because huge numbers of ions have piled up on one side — Only about one ion in tens of thousands moves; concentrations inside and outside hardly change.',
    'The sodium–potassium pump directly makes the voltage — Its direct electrical effect is only a few millivolts; its real job is to maintain the gradients that the leaky channels turn into a voltage.',
    'High potassium makes cells more excitable, so it is merely irritating — A modest rise makes cells slightly more excitable, but a larger one inactivates sodium channels and can silence the heart; it is a medical emergency.'
  ],
  formulas: [
    {
      name: 'The Nernst equation',
      expr: 'E = R*T/(z*F)*ln(co/ci)', tex: 'E = \\frac{R\\,T}{z\\,F}\\ln\\frac{c_o}{c_i}',
      vars: {
        E: { name: 'equilibrium potential (inside relative to outside)', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        z: { name: 'charge of the ion', value: 1, int: true, signed: true },
        F: { const: 'F' },
        co: { name: 'concentration outside', q: 'concentration', unit: 'mmol/L', value: 5, tex: 'c_o' },
        ci: { name: 'concentration inside', q: 'concentration', unit: 'mmol/L', value: 140, tex: 'c_i' }
      },
      note: 'z = +1 for K⁺ and Na⁺, +2 for Ca²⁺, −1 for Cl⁻. At 37 °C, RT/F = 26.7 mV, so each tenfold gradient is worth 61.5 mV for a singly charged ion.',
      practice: { unknowns: ['E', 'co'] },
      stories: { E: 'Potassium is {co} outside a heart muscle cell and {ci} inside, at {T}. What is its equilibrium potential?', co: 'At what outside concentration would the potassium equilibrium potential be {E}, with {ci} inside?' }
    },
    {
      name: 'The Goldman equation for potassium and sodium',
      expr: 'Vm = R*T/F*ln((Ko + b*Nao)/(Ki + b*Nai))', tex: 'V_m = \\frac{R\\,T}{F}\\ln\\frac{K_o + b\\,\\mathrm{Na}_o}{K_i + b\\,\\mathrm{Na}_i}',
      vars: {
        Vm: { name: 'membrane potential', q: 'voltage', unit: 'mV', signed: true, tex: 'V_m' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        F: { const: 'F' },
        Ko: { name: 'potassium outside', q: 'concentration', unit: 'mmol/L', value: 5, tex: 'K_o' },
        Ki: { name: 'potassium inside', q: 'concentration', unit: 'mmol/L', value: 140, tex: 'K_i' },
        Nao: { name: 'sodium outside', q: 'concentration', unit: 'mmol/L', value: 145, tex: '\\mathrm{Na}_o' },
        Nai: { name: 'sodium inside', q: 'concentration', unit: 'mmol/L', value: 12, tex: '\\mathrm{Na}_i' },
        b: { name: 'sodium permeability ÷ potassium permeability', value: 0.04 }
      },
      note: 'Chloride is left out (it adds a term with outside and inside swapped, because of its negative charge). At rest b ≈ 0.02–0.05; at the peak of an action potential it rises to about 20.',
      practice: { unknowns: ['Vm', 'Ko'] },
      stories: { Vm: 'A cell has {Ko} potassium outside, {Ki} inside, {Nao} sodium outside and {Nai} inside, and a sodium-to-potassium permeability ratio of {b}. What is its resting potential?', Ko: 'With the other values unchanged, what outside potassium would make the resting potential {Vm}?' }
    }
  ],
  examples: [
    {
      title: 'Potassium rises from 5 to 7 mmol/L',
      q: 'Using 140 mmol/L inside, find the potassium equilibrium potential at an outside potassium of 5 and of 7 mmol/L, and the Goldman resting potential in each case (sodium 145 outside, 12 inside, b = 0.04).',
      steps: [
        'Nernst at 5 mmol/L: $61.5 \\log_{10}(5/140) = 61.5 \\times (-1.447) = -89$ mV.',
        'Nernst at 7 mmol/L: $61.5 \\log_{10}(7/140) = 61.5 \\times (-1.301) = -80$ mV.',
        'Goldman at 5: $26.7 \\ln\\dfrac{5 + 0.04 \\times 145}{140 + 0.04 \\times 12} = 26.7 \\ln\\dfrac{10.8}{140.5} = -68.6$ mV.',
        'Goldman at 7: $26.7 \\ln\\dfrac{12.8}{140.5} = -64.0$ mV.',
        'A 2 mmol/L rise in blood potassium — invisible to the patient — moves every cell about 5 mV towards the threshold at which sodium channels start to inactivate.'
      ],
      a: 'The equilibrium potential moves from −89 to −80 mV and the resting potential from about −69 to −64 mV: enough to change how heart cells conduct.'
    },
    {
      title: 'The peak of an action potential',
      q: 'During an action potential the sodium channels open so that sodium permeability becomes about 20 times potassium\'s. With the same concentrations (K 5/140, Na 145/12), what voltage does the Goldman equation predict?',
      steps: [
        'Numerator: $5 + 20 \\times 145 = 2905$. Denominator: $140 + 20 \\times 12 = 380$.',
        '$V_m = 26.7 \\ln(2905/380) = 26.7 \\times 2.034 = +54$ mV.',
        'The membrane swings from −68 to +54 mV — close to, but not quite at, the sodium equilibrium potential of +67 mV, because potassium still leaks.'
      ],
      a: 'About +54 mV: which ion the membrane lets through decides the voltage.'
    }
  ],
  quiz: [
    { q: 'If a membrane were permeable only to potassium (5 outside, 140 inside), its voltage would be…', choices: ['0 mV', 'about −89 mV', 'about −70 mV', 'about +67 mV'], a: 1,
      why: 'With a single permeant ion the membrane settles at that ion\'s equilibrium potential, which for potassium is 61.5 log(5/140) ≈ −89 mV.' },
    { q: 'Raising the potassium concentration outside cells makes their resting potential…', choices: ['more negative', 'less negative (depolarised)', 'unchanged, because the pump compensates', 'reverse to positive'], a: 1,
      why: 'A smaller gradient means less push for potassium to leave, so the equilibrium potential — and the resting potential that follows it — moves towards zero.' },
    { q: 'What is the sodium equilibrium potential with 145 mmol/L outside and 15 mmol/L inside, at 37 °C?', answer: 60.6, unit: 'mV',
      why: 'E = 61.5 × log₁₀(145/15) = 61.5 × 0.985 ≈ +61 mV. Positive, because sodium would flow in until the inside is positive enough to stop it.' },
    { q: 'A resting potential of −70 mV requires a large change in the concentrations of potassium inside and outside the cell.', a: false,
      why: 'Only about one potassium ion in tens of thousands needs to cross; the membrane is a thin capacitor, so a tiny charge makes a large voltage.' },
    { q: 'A blood sample shows potassium 6.4 mmol/L, but it was delayed in transit and the lab notes haemolysis. The most likely explanation is…', choices: ['a true emergency needing no further tests', 'potassium leaked from damaged red cells into the sample', 'the patient ate a banana before the test', 'the lab confused sodium and potassium'], a: 1,
      why: 'Red cells contain some twenty-five times more potassium than plasma; when they break or leak in the tube the reading rises falsely. The test is repeated promptly — while taking symptoms and the ECG seriously.' }
  ],
  applications: ['Monitoring potassium in kidney disease and during treatment with diuretics or blood-pressure medicines.', 'Reading the ECG signs of high and low potassium.', 'Local anaesthetics and many heart-rhythm medicines, which act on the ion channels that set and change the membrane potential.', 'Pacemakers, defibrillators and nerve stimulators, which work by shifting membrane potentials.'],
  history: 'Walther Nernst derived his equation in 1889 for electrochemical cells. David Goldman (1943) and Alan Hodgkin and Bernard Katz (1949) extended it to membranes permeable to several ions, and Hodgkin and Katz showed that the action potential is a switch from potassium to sodium permeability.',
  sim: 'fnd-membrane-potential'
},

/* ================================================================ TISSUES */
{
  id: 'tissue-types', parent: 'cells-tissues', title: 'Tissues and organs', level: 1,
  short: 'Cells work in teams. Four basic tissues — epithelium, connective tissue, muscle and nerve — combine into organs and organ systems; how fast each tissue renews decides how well it heals.',
  keywords: ['tissue', 'epithelium', 'connective tissue', 'collagen', 'muscle', 'smooth muscle', 'cardiac muscle', 'nervous tissue', 'glia', 'organ', 'organ system', 'stem cells', 'regeneration', 'scar', 'fibrosis', 'wound healing', 'biopsy', 'histology', 'carcinoma', 'sarcoma'],
  prereq: ['cell-structure', 'chemistry:amino-acids-proteins'],
  related: ['dna-genes', 'what-is-cancer', 'blood-composition', 'neurons', 'heart-attack', 'bone-calcium', 'liver-function'],
  body: `
Graze your knee on the pavement and in a week or two the skin is whole again, often without a mark. Tear the cartilage inside the same knee and it may never truly heal. Both injuries hit the same joint of the same person; the difference is the **tissue**. Skin is an epithelium with a rich blood supply and a layer of stem cells that divide constantly; joint cartilage has no blood vessels at all, and its few cells sit locked in a matrix they can barely renew.

### Four basic tissues
Every organ is built from four kinds of tissue, recognisable under the microscope:

| Tissue | What it is | Where | Renewal |
|---|---|---|---|
| **Epithelium** | sheets of tightly joined cells that cover surfaces, line tubes and form glands | skin, gut lining, airways, kidney tubules, glands | fast: the small-intestine lining is replaced every few days, the skin surface every month or two |
| **Connective tissue** | cells scattered in a matrix they make — collagen fibres, elastic fibres, mineral or fluid | bone, cartilage, tendons, ligaments, fat, blood | varies: blood cells in days to months, bone remodelled over about ten years, cartilage hardly at all |
| **Muscle** | cells that contract | skeletal (voluntary, striped), cardiac (striped, beats by itself), smooth (in gut, vessels, airways, uterus) | skeletal muscle repairs from stem cells; heart muscle barely renews |
| **Nervous tissue** | neurons that signal, glia that support them | brain, spinal cord, nerves | neurons are mostly irreplaceable; cut peripheral nerves can regrow slowly |

Collagen, the rope of connective tissue, is the most abundant protein in the body — around a quarter to a third of all our protein. Blood counts as connective tissue too: cells suspended in a liquid matrix, plasma ([[blood-composition]]).

### From tissues to organs and systems
An **organ** combines tissues for a job. The stomach wall has an epithelium that secretes acid and enzymes, connective tissue carrying vessels and nerves, smooth muscle layers that churn, and nerve networks that coordinate them. Organs work together in **organ systems** — circulatory, respiratory, digestive, urinary, nervous, endocrine, immune, musculoskeletal, skin, reproductive — which is how this app is organised. Explore them on [the body map](#/tools/body).

### Healing: regeneration or scar
When tissue is damaged, the body either **regenerates** it with the same cells or **repairs** it with scar — collagen laid down by fibroblasts. Tissues with active stem cells and a good blood supply regenerate: skin, gut lining, bone (a fracture heals with true bone), and the liver, which can regrow from a portion within a couple of months, making living-donor transplants possible. Heart muscle killed in a [[heart-attack]] is replaced by scar that does not contract, and damaged brain tissue is not replaced, although the surviving brain can rewire. A healed skin wound has at best about 80 % of its original strength. Scarring inside organs — fibrosis of the liver, lungs or kidneys — is how many chronic diseases do their damage.

> [!warn] See a doctor promptly if a wound shows spreading redness or warmth, red streaks, pus, increasing pain or fever. If someone with an infected wound becomes confused, breathless, very drowsy or cold and mottled, call your local emergency number: these can be signs of [[sepsis]].

### Tissues in diagnosis
Pathologists diagnose many diseases by looking at thin slices of tissue — a **biopsy** — under the microscope, and cancers are named after the tissue they arise from: **carcinomas** from epithelium (most cancers, since epithelia divide fast and face the outside world), **adenocarcinomas** from glandular epithelium, **sarcomas** from connective tissue and muscle, **leukaemias** and **lymphomas** from blood-forming cells, **gliomas** from glia ([[what-is-cancer]]).

> [!note] Stem-cell treatments are proven for some conditions — bone-marrow (blood stem-cell) transplants, and skin and corneal grafts. Many clinics sell unproven "stem-cell therapies" for arthritis, autism or neurological disease; regulators in several countries have warned about them. Ask whether a treatment has been tested in clinical trials and approved for that condition ([[clinical-trials]]).
`,
  ideas: [
    'Four basic tissues — epithelium, connective tissue, muscle and nervous tissue — make every organ.',
    'Organs combine tissues for a task; organs working together form organ systems.',
    'Tissues with stem cells and a good blood supply regenerate; others heal with scar.',
    'Replacing short-lived cells takes enormous production: millions of red cells every second.',
    'Cancers are named after the tissue they come from; most arise in epithelia.'
  ],
  pitfalls: [
    'Heart muscle damaged in a heart attack grows back — Adult heart muscle cells barely divide; the dead muscle is replaced by scar, which is why fast treatment to reopen the artery matters.',
    'Blood is not a tissue, it is just a fluid — Blood is a connective tissue: specialised cells in a liquid matrix, made by the bone marrow.',
    'A scar is the same as the tissue it replaced — Scar is mostly collagen; it has no hair, sweat glands or muscle cells, and it is weaker.'
  ],
  formulas: [
    {
      name: 'Production needed to keep a cell population steady',
      expr: 'P = N/L', tex: 'P = \\frac{N}{L}',
      vars: {
        P: { name: 'cells made per second', q: 'rate', unit: '1/s' },
        N: { name: 'number of cells in the population', q: 'count', value: 2.5e13 },
        L: { name: 'average lifespan of a cell', q: 'time', unit: 'day', value: 120 }
      },
      note: 'At steady state, production equals loss. For red cells (about 25 trillion, living about 120 days) this is roughly 2.4 million a second, all made in the bone marrow.',
      stories: { P: 'An adult has about {N} red cells, each living about {L}. How many new ones must the bone marrow make each second?', L: 'A population of {N} cells is renewed at {P}. What is the average lifespan of a cell?' }
    }
  ],
  examples: [
    {
      title: 'The bone marrow\'s production line',
      q: 'An adult has about 25 trillion red cells, each lasting about 120 days. How many must be made each second? What happens to the count if production stops completely, for instance during intensive chemotherapy?',
      steps: [
        '$P = N/L = 2.5 \\times 10^{13} / (120 \\times 86\\,400\\ \\text{s}) \\approx 2.4 \\times 10^{6}$ per second.',
        'If production stops, about $1/120$ of the cells — under 1 % — are lost each day, so the red count falls slowly, over weeks.',
        'Platelets (lifespan about 10 days) and neutrophils (hours to days in the blood) fall much faster, which is why infections and bleeding are the early dangers when the marrow is suppressed.'
      ],
      a: 'About 2.4 million red cells a second; without production the red count falls under 1 % a day, but short-lived platelets and white cells drop within days.'
    },
    {
      title: 'Two injuries, one knee',
      q: 'A cyclist falls, grazing the skin of her knee and tearing the inner edge of the meniscus (the cartilage pad in the joint). Why does the graze heal within two weeks while the tear may not heal at all?',
      steps: [
        'The graze removes epidermis — an epithelium. Stem cells at the base of the epidermis and around hair follicles divide and migrate across the wound, fed by blood vessels just beneath.',
        'The inner part of the meniscus has no blood vessels. No clot forms to call in repair cells, and the few cartilage cells are trapped in dense matrix.',
        'Only the outer third of the meniscus, which has a blood supply, can heal after a tear, which is one reason surgeons repair tears there and trim them elsewhere.'
      ],
      a: 'Blood supply and stem cells: epithelium regenerates quickly, while avascular cartilage has almost no means to repair itself.'
    }
  ],
  quiz: [
    { q: 'Blood is classified as which basic tissue?', choices: ['epithelium', 'connective tissue', 'muscle', 'nervous tissue'], a: 1,
      why: 'Blood is a connective tissue: cells (red, white, platelets) scattered in a matrix, which in its case is liquid plasma.' },
    { q: 'Which tissue usually heals least well after injury?', choices: ['skin', 'joint cartilage', 'bone', 'liver'], a: 1,
      why: 'Joint cartilage has no blood supply and few, trapped cells. Skin, bone and liver all regenerate well.' },
    { q: 'A cancer arising from the glandular lining of the colon is called…', choices: ['a sarcoma', 'an adenocarcinoma', 'a lymphoma', 'a glioma'], a: 1,
      why: 'Carcinomas arise in epithelium; "adeno-" means gland. Sarcomas come from connective tissue, lymphomas from lymphocytes, gliomas from glia.' },
    { q: 'An adult has about 1.25 × 10¹² platelets, each living about 10 days. Roughly how many platelets are made each second?', answer: 1.45e6,
      why: 'P = N/L = 1.25 × 10¹² / (10 × 86 400 s) ≈ 1.4 million per second.' },
    { q: 'After a heart attack, the dead heart muscle is gradually replaced by new heart muscle.', a: false,
      why: 'Adult heart muscle cells renew at about 1 % a year or less; the dead area becomes a collagen scar that does not contract.' }
  ],
  applications: ['Biopsies and histology, which diagnose cancers and inflammatory diseases from tissue structure.', 'Bone-marrow and skin grafts, the established stem-cell treatments.', 'Wound care that supports each phase of healing.', 'Understanding fibrosis in chronic liver, lung and kidney disease.']
},

/* ================================================================ DNA AND GENES */
{
  id: 'dna-genes', parent: 'cells-tissues', title: 'DNA, genes and inheritance', level: 2,
  short: 'DNA stores the instructions for building proteins in a four-letter code. Genes are read into RNA and translated three letters at a time into amino acids; a change in one letter can alter a protein, and patterns of inheritance follow from our two copies of each gene.',
  keywords: ['DNA', 'gene', 'genome', 'chromosome', 'RNA', 'transcription', 'translation', 'genetic code', 'codon', 'mutation', 'point mutation', 'missense', 'nonsense', 'frameshift', 'inheritance', 'recessive', 'dominant', 'X-linked', 'carrier', 'sickle cell', 'cystic fibrosis', 'Hardy–Weinberg', 'genetic testing', 'epigenetics'],
  prereq: ['cell-structure', 'chemistry:nucleic-acids', 'chemistry:amino-acids-proteins', 'math:probability-basics'],
  related: ['cancer-genetics', 'anemia', 'malaria', 'vitamins-minerals', 'pharmacokinetics', 'pregnancy', 'math:binomial-distribution'],
  body: `
Two healthy parents are told that their newborn daughter has **sickle cell disease**. Neither is ill; each carries one altered copy of the gene for β-globin, part of haemoglobin, and one normal copy. Their daughter inherited the altered copy from both. The change is a single letter in about three billion — an A replaced by a T — and it swaps one amino acid in the protein. The new haemoglobin clumps into rigid fibres when it gives up its oxygen, bending red cells into sickles that block small vessels. The carrier state is common in Africa, the Middle East, India and around the Mediterranean because it gives partial protection against severe [[malaria]]; estimates for the 2010s–2021 put births with the disease at roughly 300,000 to 500,000 a year worldwide.

### The code
DNA is a double helix of two strands, each a chain of four bases — **A, T, G, C** — with A pairing to T and G to C across the helix ([[chemistry:nucleic-acids|nucleic acids]]). One set of human chromosomes holds about 3.1 billion base pairs; most cells have two sets, one from each parent — 46 chromosomes, 22 matched pairs plus XX or XY — about 2 m of DNA packed into a nucleus a few micrometres wide.

A **gene** is a stretch of DNA that is copied (**transcribed**) into messenger RNA. Ribosomes then **translate** the RNA three bases at a time: each triplet, a **codon**, names one of 20 amino acids ([[chemistry:amino-acids-proteins|amino acids]]), or says stop. With 64 codons for 21 meanings, the code is redundant — several codons usually mean the same amino acid — and it is nearly universal across life, which is why bacteria can be made to produce human insulin. Humans have about 20,000 protein-coding genes, but they occupy only 1–2 % of the genome; the rest includes the switches that decide which genes are on in which cell, genes for working RNAs, and long stretches of repeats.

### When a letter changes
| Change | What happens | Example |
|---|---|---|
| Silent | new codon, same amino acid | GAG → GAA: still glutamate |
| Missense | one amino acid swapped | GAG → GTG: glutamate → valine, sickle haemoglobin |
| Nonsense | an early stop codon: a short, usually useless protein | AAG → TAG in β-globin: a form of β-thalassaemia |
| Frameshift | a letter added or lost shifts every later codon | often a scrambled, truncated protein |

Each of us carries roughly 50–100 new changes not present in either parent, and two unrelated people differ at about one letter in a thousand. Most variants do nothing measurable. Mutations in body cells during life (somatic mutations) are not inherited, but they drive cancer ([[cancer-genetics]]).

### Patterns of inheritance
- **Autosomal recessive** (sickle cell disease, thalassaemias, cystic fibrosis, Tay–Sachs): both copies must be altered. Two carrier parents have a 1 in 4 chance, **in every pregnancy**, of an affected child, and a 1 in 2 chance of a carrier.
- **Autosomal dominant** (Huntington's disease, familial hypercholesterolaemia, *BRCA1/2* cancer predisposition): one altered copy is enough; each child of a carrier has a 1 in 2 chance of inheriting it.
- **X-linked recessive** (haemophilia, Duchenne muscular dystrophy, G6PD deficiency): mostly affects males, who have one X; a carrier mother passes it to half her sons.
- **Mitochondrial**: through the mother only.

Most common conditions — heart disease, type 2 diabetes, depression — are **polygenic**: hundreds of variants each nudge the risk a little, and environment and chance matter as much. "A gene for" such a condition usually means a small shift in probability, not a destiny. Chemical tags on DNA and its packaging (**epigenetics**) also change which genes are read, in response to development, age and environment.

> [!tip] Genetic tests range from newborn screening and carrier screening before pregnancy to diagnostic, predictive and pharmacogenetic tests (some predict dangerous reactions to specific medicines). Direct-to-consumer tests check only selected variants, so a "clear" result can miss a real risk. A genetic counsellor or doctor can help you decide whether to test and what a result means for you and your relatives.
`,
  ideas: [
    'DNA stores information in four bases; genes are transcribed into RNA and translated three bases (one codon) at a time into protein.',
    'The genetic code is redundant and nearly universal: 64 codons for 20 amino acids and stop.',
    'A single-letter change can be silent, swap an amino acid, create a stop, or — by insertion or deletion — shift the whole reading frame.',
    'We have two copies of most genes: recessive conditions need both altered, dominant ones only one.',
    'Chance applies afresh in every pregnancy; common diseases are shaped by many genes plus environment.'
  ],
  pitfalls: [
    'If carrier parents have one affected child, the next children are safe — Each pregnancy is independent: the chance stays 1 in 4 every time, just as a coin does not remember its last toss.',
    'There is a gene for heart disease (or depression, or intelligence) — Common traits are polygenic: many variants each shift risk slightly, and lifestyle, environment and chance weigh heavily.',
    'A mutation always causes disease — Most variants are harmless; many are silent, and some (like the sickle-cell carrier state against malaria) are even protective.'
  ],
  formulas: [
    {
      name: 'Carrier frequency from the frequency of a recessive condition (Hardy–Weinberg)',
      expr: 'c = 2*sqrt(P)*(1 - sqrt(P))', tex: 'c = 2\\sqrt{P}\\left(1 - \\sqrt{P}\\right)',
      vars: {
        c: { name: 'fraction of people who are carriers' },
        P: { name: 'fraction of births with the condition', value: 0.0004, min: 0, max: 0.25 }
      },
      note: 'If a fraction q of gene copies in a population carry the variant, P = q² and carriers are 2q(1 − q). Assumes random mating and a stable population; it breaks down with marriage between relatives or strong selection.',
      stories: { c: 'A recessive condition affects a fraction {P} of births (about 1 in 2500). What fraction of the population are carriers?', P: 'Carrier screening finds that a fraction {c} of people carry a recessive variant. What fraction of births would you expect to have the condition?' }
    },
    {
      name: 'Chance of at least one affected child',
      expr: 'p = 1 - (1 - r)^n', tex: 'p = 1 - (1 - r)^n',
      vars: {
        p: { name: 'probability of at least one affected child' },
        r: { name: 'chance per child', value: 0.25, min: 0, max: 1 },
        n: { name: 'number of children', value: 2, int: true }
      },
      note: 'For two carrier parents of a recessive condition r = 1/4; for a parent with a dominant variant r = 1/2. Each child is an independent draw.',
      practice: { unknowns: ['p'] },
      stories: { p: 'Two parents both carry a recessive variant, so each child has a chance {r} of the condition. If they have {n} children, what is the chance that at least one is affected?' }
    },
    {
      name: 'Length of DNA',
      expr: 'L = N*d', tex: 'L = N\\,d',
      vars: {
        L: { name: 'length of the DNA', q: 'length', unit: 'm' },
        N: { name: 'number of base pairs', q: 'count', value: 6.2e9 },
        d: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true }
      },
      note: 'Each base pair adds 0.34 nm along the double helix. The two sets of chromosomes in one cell stretch about 2 m, wound around proteins into a nucleus about 6 µm across.',
      stories: { L: 'A cell contains {N} base pairs of DNA. How long would it be if stretched out?' }
    }
  ],
  examples: [
    {
      title: 'Two carrier parents',
      q: 'Both parents carry one sickle-cell variant. What is the chance that a given child has sickle cell disease, is a carrier, or has neither? If they have three children, what is the chance that none has the disease?',
      steps: [
        'Each parent passes on one of two copies at random. The four equally likely combinations are: normal–normal, normal–variant, variant–normal, variant–variant.',
        'So each child has a $1/4$ chance of the disease, $1/2$ of being a carrier (sickle cell trait), and $1/4$ of neither.',
        'Children are independent: the chance that none of three is affected is $(3/4)^3 = 27/64 \\approx 0.42$.',
        'So the chance that at least one is affected is $1 - 0.42 = 0.58$ — higher than many people guess.'
      ],
      a: '1 in 4 affected, 1 in 2 carriers, 1 in 4 neither, for each child; with three children, about a 42 % chance that none is affected.'
    },
    {
      title: 'How common are carriers?',
      q: 'Among people of northern European ancestry, cystic fibrosis affects roughly 1 in 2500 births. Estimate the fraction of carriers.',
      steps: [
        'Frequency of the variant copy: $q = \\sqrt{1/2500} = 1/50 = 0.02$.',
        'Carriers: $2q(1 - q) = 2 \\times 0.02 \\times 0.98 = 0.039$.',
        'That is about 1 person in 25 — a hundred times more common than the condition itself, which is why most affected children are born to parents with no family history.'
      ],
      a: 'About 4 %, or 1 in 25 people.'
    },
    {
      title: 'Reading the sickle-cell change',
      q: 'The sixth codon of the β-globin gene is GAG in normal haemoglobin and GTG in sickle haemoglobin. Using the genetic code, what changes in the protein? What if the change were GAG → GAA?',
      steps: [
        'GAG codes for glutamate (glutamic acid), a charged, water-loving amino acid on the surface of the protein.',
        'GTG codes for valine, which is oily and uncharged. The valine on the surface sticks to a pocket on a neighbouring haemoglobin when oxygen is released, and the molecules stack into fibres.',
        'GAA also codes for glutamate: that change would be silent — the protein would be identical.'
      ],
      a: 'Glutamate becomes valine (a missense change that causes sickling); GAG → GAA would be silent.'
    }
  ],
  quiz: [
    { q: 'Two carriers of a recessive condition already have one affected child. What is the chance their next child is affected?', choices: ['0: it has already happened', '1 in 4', '1 in 2', '3 in 4'], a: 1,
      why: 'Each pregnancy is an independent draw of one copy from each parent. The chance is 1 in 4 every time.' },
    { q: 'Which change usually damages a protein most?', choices: ['a silent change in the third letter of a codon', 'a missense change swapping two similar amino acids', 'a one-letter deletion near the start of the gene', 'a change in DNA far from any gene'], a: 2,
      why: 'Deleting one letter shifts the reading frame, so every codon after it is misread — usually giving a scrambled protein that soon hits a stop codon.' },
    { q: 'Because the genetic code is redundant, some single-letter changes in a gene do not change the protein at all.', a: true,
      why: 'Most amino acids have two to six codons. A change that turns one codon into another for the same amino acid — often at the third position — is silent.' },
    { q: 'Both parents carry a recessive variant. What is the probability that at least one of their two children is affected?', answer: 0.4375,
      why: '1 − (3/4)² = 1 − 9/16 = 7/16 ≈ 0.44.' },
    { q: 'Why is the sickle-cell variant common in regions where malaria is (or was) widespread?', choices: ['malaria causes the mutation', 'carriers are partly protected against severe malaria, so the variant spreads', 'people with sickle cell disease cannot catch malaria', 'it is a coincidence of history'], a: 1,
      why: 'Carriers (one copy) survive severe malaria better, so the variant is passed on more often, even though two copies cause disease. People with the disease itself are, if anything, more endangered by malaria.' }
  ],
  applications: ['Newborn screening for sickle cell disease, cystic fibrosis and other treatable inherited conditions.', 'Carrier screening and genetic counselling before or during pregnancy.', 'Pharmacogenetic tests that predict serious reactions to certain medicines.', 'Gene therapies, including the first CRISPR-based treatment for sickle cell disease and β-thalassaemia, approved from late 2023.'],
  history: 'Gregor Mendel described dominant and recessive inheritance in peas in 1866. Watson and Crick, using Rosalind Franklin\'s X-ray images, proposed the double helix in 1953; the genetic code was deciphered by 1966, and in 1949 Linus Pauling\'s group showed that sickle cell anaemia is a "molecular disease". The first near-complete human genome was published in 2001–2003, and the first gap-free sequence in 2022.',
  sim: 'fnd-genetic-code'
}

);
