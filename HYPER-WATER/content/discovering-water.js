/* HYPER-WATER · content/discovering-water.js — the topic "Discovering water", branch The Molecule.
 *   water-as-an-element                           from Thales to the eighteenth century: why water was thought simple
 *   cavendishs-spark                              1781: a spark in a closed jar, a dew on the glass, and what it was
 *   lavoisier-names-it                            1783-84: synthesis and decomposition, hydrogen named, phlogiston buried, the water controversy
 *   two-to-one                                    two volumes to one: Gay-Lussac, Dalton's HO, Avogadro, Cannizzaro: H2O settled about 1860
 *   henderson-and-the-fitness-of-the-environment  1913: the argument that water's properties are uniquely fit for life
 *   polywater-and-water-memory                    two ideas about water that failed their tests, and how such claims are tested
 * Simulations: sims/discovering-water.js (dw-spark-jar, dw-gun-barrel, dw-two-to-one, dw-timeline, dw-blind-trial, dw-fitness).
 */
Hyper.add(

/* ================================================================ water as an element */
{
  id: 'water-as-an-element', parent: 'discovering-water', title: 'Water as an element', level: 1,
  short: 'For about 2,300 years water was not made of anything: Thales called it the source of all things, Empedocles and Aristotle one of four elements. The belief rested on good observations, and it took careful weighing in the 1760s and 1780s to undo it.',
  keywords: ['element', 'Thales', 'Empedocles', 'Aristotle', 'four elements', 'earth air fire water', 'van Helmont', 'willow', 'Boyle', 'transmutation', 'arche', 'wu xing', 'Plato icosahedron', 'history of water'],
  prereq: ['what-water-is'],
  related: ['cavendishs-spark', 'lavoisier-names-it', 'the-matrix-of-life', 'biology:photosynthesis', 'chemistry:molar-mass'],
  body: `
Fill a glass at the tap and ask what it is made of. For most of recorded history the sensible answer was “water, and nothing simpler”. Water was not a compound of anything; it was one of the ingredients out of which other things were compounded. This page follows that idea from the first Greek philosophers to the 1780s, when it stopped being true, and shows why it was a reasonable thing to believe for two thousand years.

### Water as the first principle
Thales of Miletus, active about 585 BC, is the first person we know of to have said that everything comes from one material, and that the material is water. Nothing he wrote survives. Aristotle, writing two and a half centuries later, reports the claim and guesses at the reasons: seeds and food are moist, and the warmth of a living thing depends on moisture. It was a better guess than it sounds. Water is the one common substance that anyone could watch in all three states — liquid in the river, solid in the ice, vapour in mist and steam — so it was the obvious candidate for a stuff that turns into other stuffs.

### Four roots
Empedocles of Acragas, about 450 BC, named four unchanging “roots” — fire, air, water and earth — mixed and parted by Love and Strife. Plato’s *Timaeus* (about 360 BC) gave each root a regular solid, and water the icosahedron: twenty faces, the roundest and most mobile of the solids built from triangles. Aristotle (about 350 BC) dropped the geometry and kept the qualities. Fire is hot and dry, air hot and wet, **water cold and wet**, earth cold and dry; two elements that share a quality can change into each other when the other quality is reversed. Other civilisations built their own lists: the Chinese *wu xing* (wood, fire, earth, metal, water) and the five great elements of Indian philosophy both include water, but the lists mean different things and should not be read as one idea.

### Why the idea lasted
It fitted what could be seen. Water boiled into “air” (steam) and froze into a hard clear “earth” (ice). Water boiled for weeks in a glass flask left a white, earthy deposit. And in about 1640 Jan Baptist van Helmont, whose book was printed in 1648, grew a willow that seemed to be made of nothing but water.

| | pounds | kilograms |
|---|---|---|
| willow at the start | 5 | 2.3 |
| willow after five years | about 169 | 76.7 |
| dried earth at the start | 200 | 90.7 |
| earth lost in five years | about 2 oz | 0.06 |

The tree had gained 164 pounds; the earth had lost almost nothing; only rain water had been added. So the tree was water. He was half right, and the half is instructive. A fresh willow is about half water by weight (roughly 38 kg of the 77). Of the dry half, about half is carbon, some 19 kg, which came from carbon dioxide in the air — the thing van Helmont never thought to weigh — and only about 6 % of the dry matter, the hydrogen, comes from the water. The earth’s small loss was the minerals the roots took up.

### The cracks
In *The Sceptical Chymist* (1661) Robert Boyle argued that an element is whatever experiment cannot decompose, not whatever a philosopher declares it to be. Water passed that test, for nobody could split it. But the “water into earth” observation fell first. Between 1768 and 1770 Lavoisier sealed distilled water in a glass vessel and heated it for 101 days; the earthy sediment appeared as before, but the glass had lost almost exactly the weight the sediment had gained. The earth was the glass. A few years later two chemists, one in London and one in Paris, would make water from two gases and take it apart again: [[cavendishs-spark]] and [[lavoisier-names-it]].

> [!key] For about 2,300 years water was a simple thing — Thales’ source of everything, then one of four elements — and the belief rested on honest observation: it comes in three states, and plants seem to grow on it. It was undone by the balance, not by argument: weigh the glass, weigh the gases.`,
  ideas: ['Thales (about 585 BC) took water to be the source of all things; Empedocles and Aristotle made it one of four elements, cold and wet.', 'The belief was supported by observation: water is the only common substance seen as liquid, solid and vapour, and a willow grew on rain water alone.', 'Van Helmont’s willow gained 164 lb on 2 oz of lost soil. Half of a fresh tree is water, but its carbon came from the air, which he never weighed.', 'Boyle’s test — an element is what experiment cannot break up — and Lavoisier’s 101-day experiment of 1768–70 began the decline of the doctrine.'],
  pitfalls: ['“The Greek elements are the same thing as chemical elements” — Greek “earth” was a quality of stuff (cold, dry, heavy), not a substance; a chemical element is one that experiment cannot decompose, a definition due to Boyle and Lavoisier.', '“Van Helmont proved plants are made of water” — He showed that the soil lost almost nothing. He did not weigh the air, from which the tree’s carbon came; it is about half water by weight only because it is alive.', '“The ancients were simply wrong” — Water really is the most abundant compound at the surface of the Earth and in living things, and it really does change state. The error was the step from “everywhere” to “simple”.'],
  terms: [
    { term: 'Arche', also: ['archê', 'first principle'], def: 'The Greek word for the single origin or governing principle from which all things arise. Thales named water as the arche; later philosophers named other things.' },
    { term: 'Classical elements', also: ['four elements', 'four roots', 'earth, air, fire and water'], def: 'Fire, air, water and earth, taken by Empedocles and Aristotle as the basic kinds of matter. Each was a bundle of qualities, not a pure substance, and each could change into another.' },
    { term: 'Chemical element', also: ['element (Boyle)'], def: 'A substance that no chemical experiment can break into simpler ones. Boyle proposed the test in 1661; Lavoisier applied it, and water failed it in 1783–84 when it was decomposed into hydrogen and oxygen.' },
    { term: 'Transmutation of elements', also: ['transmutation'], def: 'In the old theory, the change of one element into another, such as water into air on boiling or water into earth on long heating. Lavoisier’s sealed-flask test showed the “earth” came from the glass.' },
    { term: 'Pelican', also: ['sealed distilling vessel'], def: 'A closed glass vessel in which a liquid was boiled and condensed again and again. Lavoisier’s 101-day experiment on water used one, and weighed both the vessel and its sediment.' }
  ],
  formulas: [
    { name: 'Water held in a fresh tree', expr: 'mw = M*w', tex: 'm_w = M\\,w',
      vars: { mw: { name: 'mass of water in the tree', q: 'mass', unit: 'kg', tex: 'm_w' }, M: { name: 'fresh mass of the tree', q: 'mass', unit: 'kg', value: 76.7, hint: 'Van Helmont’s willow: 169 lb 3 oz, or 76.7 kg.' }, w: { name: 'water fraction', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, hint: 'Fresh wood and leaves are typically 45–60 % water by mass.' } },
      solveFor: 'mw', note: 'Most of what van Helmont weighed was water held in the cells, not water built into the wood.',
      stories: { mw: 'A tree weighing {M} fresh is {w} water. How much water does it hold?' } },
    { name: 'Carbon in the dry wood', expr: 'mC = M*(1 - w)*fc', tex: 'm_C = M\\,(1 - w)\\,f_c',
      vars: { mC: { name: 'mass of carbon', q: 'mass', unit: 'kg', tex: 'm_C' }, M: { name: 'fresh mass of the tree', q: 'mass', unit: 'kg', value: 76.7 }, w: { name: 'water fraction', q: 'ratio', unit: '%', value: 50, min: 0, max: 99 }, fc: { name: 'carbon fraction of dry wood', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: 'f_c', hint: 'Dry wood is close to 50 % carbon by mass.' } },
      solveFor: 'mC', note: 'All of it was taken from the carbon dioxide in the air.',
      stories: { mC: 'A tree of {M} fresh mass is {w} water, and its dry wood is {fc} carbon. How much carbon is in it?' } },
    { name: 'Carbon dioxide taken from the air', expr: 'mCO2 = mC*MCO2/MC', tex: 'm_{\\mathrm{CO_2}} = m_C\\,\\frac{M_{\\mathrm{CO_2}}}{M_C}',
      vars: { mCO2: { name: 'mass of carbon dioxide', q: 'mass', unit: 'kg', tex: 'm_{\\mathrm{CO_2}}' }, mC: { name: 'mass of carbon', q: 'mass', unit: 'kg', value: 19.2, tex: 'm_C' }, MCO2: { name: 'molar mass of CO₂', q: 'molarmass', unit: 'g/mol', value: 44.01, fixed: true, tex: 'M_{\\mathrm{CO_2}}' }, MC: { name: 'molar mass of carbon', q: 'molarmass', unit: 'g/mol', value: 12.011, fixed: true, tex: 'M_C' } },
      solveFor: 'mCO2', note: 'Each kilogram of carbon needs 3.66 kg of carbon dioxide: 44.01 / 12.011.',
      stories: { mCO2: 'A tree holds {mC} of carbon taken from the air. How much carbon dioxide did that take?' } }
  ],
  examples: [
    { title: 'The willow’s balance sheet', q: 'Van Helmont’s willow weighed 169 lb 3 oz (76.7 kg) after five years. Taking it as half water and its dry wood as half carbon, find the water it held, the carbon it contains and the carbon dioxide that carbon came from.',
      steps: ['Water held: $76.7 \\times 0.50 = 38.4$ kg.', 'Dry wood: $76.7 - 38.4 = 38.4$ kg, of which half is carbon: $19.2$ kg.', { text: 'Carbon dioxide needed, using $M_{\\mathrm{CO_2}}/M_C = 44.01/12.011$:', tex: 'm_{\\mathrm{CO_2}} = 19.2 \\times \\frac{44.01}{12.011} = 70.4\\ \\mathrm{kg}' }, 'The hydrogen in the dry wood (about 6 %, or 2.3 kg) came from water; nearly everything else came from the air.'],
      a: 'About 38 kg of water held in the tissue and 19 kg of carbon, which took some 70 kg of carbon dioxide out of the air. Van Helmont weighed the soil and the tree but not the air.' },
    { title: 'How little the earth lost', q: 'Van Helmont’s 200 lb of dried earth lost about 2 oz in five years. What percentage is that, and why did he think it negligible?',
      steps: ['There are 16 oz in a pound, so the earth weighed $200 \\times 16 = 3200$ oz.', 'Loss: $2/3200 = 0.000625$, which is 0.0625 %.', 'He weighed to about an ounce, so this was well within the scatter of his drying: for him the tree had not come from the earth.'],
      a: '0.0625 %. He was right that the tree was not made of soil; what he could not see was that it was made largely of air.' }
  ],
  quiz: [
    { q: 'Which thinker is reported by Aristotle to have held that water is the source of all things?', choices: ['Empedocles', 'Thales', 'Plato', 'Boyle'], a: 1, why: 'Thales of Miletus, about 585 BC. Empedocles made water one of four roots, Plato gave it a solid, and Boyle questioned the whole scheme in 1661.' },
    { q: 'In Aristotle’s scheme, water is', choices: ['hot and wet', 'cold and wet', 'cold and dry', 'hot and dry'], a: 1, why: 'Fire is hot and dry, air hot and wet, water cold and wet, earth cold and dry. Sharing a quality let one element change into a neighbour.' },
    { q: 'Van Helmont’s willow gained 164 lb while the soil lost 2 oz. What was missing from his accounting?', choices: ['The sunlight that fell on it', 'The carbon dioxide taken from the air', 'The oxygen given off by the roots', 'Water that evaporated from the pot'], a: 1, why: 'The tree’s carbon, about half of its dry mass, came from carbon dioxide. He never weighed the air. Sunlight is energy, not matter.' },
    { q: 'Lavoisier’s 101-day experiment showed that the “earth” left by long-boiled water was', choices: ['water turned to earth', 'dust that fell in', 'material dissolved from the glass vessel', 'a salt present in the water'], a: 2, why: 'The glass lost almost exactly the weight the sediment gained, so the sediment was glass, not transmuted water.' },
    { q: 'The Greek “elements” were chemical elements in the modern sense.', a: false, why: 'They were bundles of qualities that could turn into one another. A chemical element is a substance that cannot be broken into simpler ones by experiment.' },
    { q: 'Van Helmont’s 200 lb of earth lost 2 oz. What percentage of its mass is that?', answer: 0.0625, unit: '%', why: '2 oz / (200 × 16 oz) = 6.25 × 10⁻⁴, which is 0.0625 %.' }
  ],
  applications: ['The definition of “element” you meet in the first chemistry lesson — a substance no experiment can break down — is Boyle’s test of 1661, and water is the textbook case of a thing that looked like an element and turned out not to be.', 'Forestry and climate science account for a tree’s carbon exactly as van Helmont should have done: weigh the dry wood, take half as carbon, and multiply by 3.67 for the carbon dioxide drawn from the air.', 'Gardeners’ hydroponics grow plants on water and dissolved minerals alone — and still need air for their carbon.', 'Everyday speech keeps the old list: “the elements” for wind, rain, fire and ground, and the zodiac’s water signs.'],
  history: 'Thales is placed about 585 BC because Herodotus links him to a solar eclipse of that year. Aristotle’s report is in the *Metaphysics*, book I. Van Helmont’s experiment appeared in *Ortus medicinae* (1648), printed after his death in 1644. Boyle’s book is *The Sceptical Chymist* (1661); Lavoisier’s sealed-flask experiment was begun in 1768 and reported in 1770.',
  sources: ['Aristotle, *Metaphysics* I.3 (983b), for the report on Thales; Plato, *Timaeus* 53c–56c, for the solids.', 'van Helmont, *Ortus medicinae* (1648), the willow experiment; Boyle, *The Sceptical Chymist* (1661).', 'Lavoisier, memoir on whether water can change into earth, *Mémoires de l’Académie des sciences* (1770).', 'Ball, *H₂O: A Biography of Water*, the early chapters on the history of ideas about water.'],
  sim: [{ id: 'dw-timeline', params: { from: -600, to: 1783, year: -585 } }]
},

/* ================================================================ Cavendish's spark */
{
  id: 'cavendishs-spark', parent: 'discovering-water', title: 'Cavendish’s spark, 1781', level: 2,
  short: 'In 1781 Henry Cavendish exploded “inflammable air” (hydrogen) with “dephlogisticated air” (oxygen) in a closed glass vessel. The two gases vanished into a dew that was pure water, the vessel weighed what it had weighed, and the volumes were two to one.',
  keywords: ['Cavendish', 'inflammable air', 'dephlogisticated air', 'hydrogen', 'oxygen', 'spark', 'eudiometer', 'Warltire', 'Priestley', 'dew', 'synthesis of water', '1781', '1784', 'Experiments on Air', 'argon'],
  prereq: ['water-as-an-element', 'what-water-is'],
  related: ['lavoisier-names-it', 'two-to-one', 'polywater-and-water-memory', 'chemistry:molar-mass', 'chemistry:gas-laws'],
  body: `
Imagine a glass globe the size of a large grapefruit, with two wires passing through the glass and meeting at a gap of a few millimetres in the middle. It holds two invisible gases. A charge from an electrical machine jumps the gap with a flash and a bang, and when the glass has cooled it is clouded inside with a fine dew. No other fluid has been added. That, in London in 1781, was the experiment that showed water could be made.

### Two airs
By the 1770s chemists had learned that “air” was not one thing. In 1766 **Henry Cavendish** had shown that acids acting on metals give off a gas about a tenth the density of common air, which burns: *inflammable air*, our hydrogen. In 1774 Joseph Priestley, heating red calx of mercury, found a gas in which a flame burned fiercely: *dephlogisticated air*, our oxygen. Both belonged to the *phlogiston* picture of the time, in which burning released a fire-stuff and a gas hungry for it was “dephlogisticated”. The picture was wrong, but it made the experiment natural: mix a gas full of phlogiston with a gas that wants it, and strike a spark.

### The experiment
John Warltire had exploded inflammable air with common air in a closed copper vessel in 1781 and thought he saw a loss of weight, the weight of heat. Priestley repeated it in glass and noticed a dew on the clean glass, and thought it unimportant. Cavendish took it seriously. In a closed vessel, with the gases measured in graduated tubes, he sparked them and weighed what he had. His findings, in *Experiments on Air* (read to the Royal Society in January 1784):

- **The volumes.** 423 measures of inflammable air consumed 1,000 measures of common air. Common air is about a fifth oxygen, so that is about 2 of hydrogen for 1 of oxygen.
- **The weight.** Nothing measurable was lost: the vessel weighed the same after as before. Heat has no weight, and no matter had escaped.
- **The dew.** It was clear, tasteless and left no residue: pure water, equal in weight to the two gases that had disappeared.
- **The acid.** When the air was in excess the dew was sour. In 1785 he showed that the spark was making nitric acid from the nitrogen of the air. A small bubble of gas, about 1/120 of the nitrogen, would not react at all; a century later it turned out to be argon.

### What he thought it meant
Cavendish wrote in the language of phlogiston. He took *dephlogisticated air* to be water that had lost its phlogiston, and inflammable air to be water with phlogiston added, or phlogiston itself, so that burning one into the other gave water back. It is a mistake of interpretation, and his measurements are untouched by it. The shrewder reading — that water *is* a compound of the two gases, which are elements — came from Paris, in [[lavoisier-names-it]].

### The man
Cavendish (1731–1810) was rich, brilliant and painfully shy. His biographers, Jungnickel and McCormmach, report that he spoke to almost no one outside the Royal Society dinners, and the stories of how he arranged his household — notes left on a table for his housekeeper rather than speech, servants told to keep out of his sight — are told, with due caution, as part of the same pattern. He published a fraction of what he did; the rest lay in his papers until James Clerk Maxwell edited them in 1879. That he published the water experiment at all, three years after doing it, is typical: he waited until he was sure.

> [!key] A spark in a closed jar turned two gases into a dew of pure water without any change in weight: the gases were consumed in the proportion two volumes to one, and the product was water. Cavendish explained it with phlogiston, but the experiment was the first synthesis of water, and it made the next question — *what is water made of?* — impossible to avoid.`,
  ideas: ['Hydrogen (“inflammable air”, 1766) and oxygen (“dephlogisticated air”, 1774) can be made separately; sparked together they disappear into a dew of pure water.', 'The sealed vessel weighs the same afterwards, so the dew weighs as much as the two gases together: nothing was lost, and heat has no weight.', 'The gases combine as 2 volumes of hydrogen to 1 of oxygen; 423 measures of hydrogen consumed 1,000 of air, whose oxygen is a fifth.', 'The leftover bubble Cavendish noticed in 1785 was argon, found by Rayleigh and Ramsay in 1894.'],
  pitfalls: ['“Cavendish proved water is H₂O” — He proved it can be made from two gases, in the proportion two volumes to one. The formula needed Avogadro’s hypothesis, and was settled only about 1860.', '“Cavendish explained it as we do” — He read it through phlogiston and thought water was a form of the two airs, not a compound of two elements.', '“The dew came from the glass or the air” — Clean dry gases in a dry vessel give it, and its weight equals the weight lost by the gases. The spark only starts the reaction; the gases supply all the matter.'],
  terms: [
    { term: 'Inflammable air', also: ['hydrogen (old name)'], def: 'The 18th-century name for hydrogen, a gas that burns, made by dissolving metals in acids. Cavendish measured its density at roughly a tenth of that of air in 1766.' },
    { term: 'Dephlogisticated air', also: ['oxygen (old name)'], def: 'The phlogiston-theory name for oxygen: air from which phlogiston has been removed, so that it takes up more of the stuff of fire. Priestley made it in 1774.' },
    { term: 'Eudiometer', def: 'A graduated glass tube, closed at one end and standing in water or mercury, in which a gas mixture can be sparked and the shrinking of its volume read off. Alessandro Volta designed the form with a spark in 1777.' },
    { term: 'Synthesis', also: ['synthesis of water'], def: 'Making a compound from its elements. Burning hydrogen in oxygen to make water is the synthesis that showed water to be a compound rather than an element.' },
    { term: 'Conservation of mass', also: ['mass balance'], def: 'The rule that the total mass of a closed system does not change in a chemical reaction. Cavendish’s unchanged weight and Lavoisier’s systematic use of the balance rest on it.' }
  ],
  formulas: [
    { name: 'Hydrogen that burns the oxygen in a sample of air', expr: 'VH = 2*f*Vair', tex: 'V_H = 2\\,f\\,V_{air}',
      vars: { VH: { name: 'volume of hydrogen', q: 'volume', unit: 'mL', tex: 'V_H' }, f: { name: 'oxygen fraction of the air', q: 'ratio', unit: '%', value: 20.95, min: 0, max: 100, hint: 'Dry air is 20.95 % oxygen by volume; Cavendish’s result implies 21.2 %.' }, Vair: { name: 'volume of air', q: 'volume', unit: 'mL', value: 1000, tex: 'V_{air}' } },
      solveFor: 'VH', note: 'Two volumes of hydrogen for each volume of oxygen, at the same temperature and pressure. Cavendish found 423 for 1,000 of air; this gives 419.',
      stories: { VH: 'A tube holds {Vair} of air. How much hydrogen does it take to burn all its oxygen?', f: 'It takes {VH} of hydrogen to burn the oxygen in {Vair} of air. What fraction of the air is oxygen?' } },
    { name: 'Oxygen that burns a mass of hydrogen', expr: 'mO = mH*MO2/(2*MH2)', tex: 'm_O = m_H\\,\\frac{M_{\\mathrm{O_2}}}{2\\,M_{\\mathrm{H_2}}}',
      vars: { mO: { name: 'mass of oxygen', q: 'mass', unit: 'g', tex: 'm_O' }, mH: { name: 'mass of hydrogen', q: 'mass', unit: 'g', value: 1, tex: 'm_H' }, MO2: { name: 'molar mass of O₂', q: 'molarmass', unit: 'g/mol', value: 31.998, fixed: true, tex: 'M_{\\mathrm{O_2}}' }, MH2: { name: 'molar mass of H₂', q: 'molarmass', unit: 'g/mol', value: 2.016, fixed: true, tex: 'M_{\\mathrm{H_2}}' } },
      solveFor: 'mO', note: '2 H₂ + O₂ → 2 H₂O: one mole of oxygen for two of hydrogen, so 7.94 g of oxygen for every gram of hydrogen.',
      stories: { mO: 'How many grams of oxygen are needed to burn {mH} of hydrogen completely?' } },
    { name: 'Conservation of mass in the jar', expr: 'mW = mH + mO', tex: 'm_W = m_H + m_O',
      vars: { mW: { name: 'mass of water (dew)', q: 'mass', unit: 'mg', tex: 'm_W' }, mH: { name: 'mass of hydrogen used', q: 'mass', unit: 'mg', value: 8.38, tex: 'm_H' }, mO: { name: 'mass of oxygen used', q: 'mass', unit: 'mg', value: 66.5, tex: 'm_O' } },
      solveFor: 'mW', note: 'The dew weighs what the gases weighed. The default values are 100 mL of hydrogen and 50 mL of oxygen at 20 °C.',
      stories: { mW: 'A jar contains {mH} of hydrogen and {mO} of oxygen, which burn completely. What does the dew weigh?' } }
  ],
  examples: [
    { title: 'Cavendish’s oxygen fraction', q: 'Cavendish found that 423 measures of inflammable air consumed 1,000 measures of common air. What oxygen fraction of air does that imply, and how far is it from the modern 20.95 %?',
      steps: ['Two volumes of hydrogen burn one of oxygen, so the oxygen in 1,000 measures of air was $423/2 = 211.5$ measures.', 'Fraction: $211.5/1000 = 21.15\\ \\%$.', 'Difference from 20.95 %: $0.2$ percentage points, about 1 %.'],
      a: 'About 21.2 % oxygen, within 1 % of today’s value, from apparatus made of glass tubes, a bladder and a spark.' },
    { title: 'Weighing the dew', q: 'A jar holds 100 mL of hydrogen and 50 mL of oxygen at 20 °C and 1 atm (one mole of gas takes 24.06 L). How much dew forms, and how does its volume compare with the gas that made it?',
      steps: ['Moles of hydrogen: $0.100/24.06 = 4.157$ mmol, which is 8.38 mg; oxygen: $0.050/24.06 = 2.078$ mmol, which is 66.5 mg.', 'They burn in the ratio 2 : 1, so all of both is used and $4.157$ mmol of water forms: $4.157 \\times 18.015 = 74.9$ mg.', 'Check: $8.38 + 66.5 = 74.9$ mg. Mass is conserved.', 'The dew is 0.0749 mL of liquid; the gas was 150 mL.'],
      a: '74.9 mg of water, 2,000 times smaller in volume than the gases that made it. The jar’s weight does not change.' }
  ],
  quiz: [
    { q: 'What did Cavendish call the gas we call hydrogen?', choices: ['Dephlogisticated air', 'Fixed air', 'Inflammable air', 'Nitrous air'], a: 2, why: 'Inflammable air: it burns. Dephlogisticated air was oxygen; fixed air was carbon dioxide.' },
    { q: 'After the spark, the sealed jar and its contents weigh', choices: ['less, because the gases escaped as heat', 'the same, within the balance’s precision', 'more, because water is heavier than gas', 'less, because gas is lighter than liquid'], a: 1, why: 'Nothing enters or leaves a closed vessel, so the mass is conserved. The dew weighs as much as the two gases that disappeared; heat has no weight.' },
    { q: 'Cavendish’s experiment proves water is H₂O.', a: false, why: 'It shows only that water is made from two gases which combine as two volumes to one. The formula H₂O needs the relation between volumes and numbers of molecules, Avogadro’s hypothesis (1811), and was agreed only about 1860.' },
    { q: 'How many mL of hydrogen burn all the oxygen in 500 mL of air (20.95 % oxygen)?', answer: 209.5, unit: 'mL', why: 'Oxygen: 0.2095 × 500 = 104.75 mL; hydrogen needed: twice that, 209.5 mL.' },
    { q: 'When Cavendish used too much air, the dew was sour. This was because', choices: ['the water itself had become acid', 'the spark made nitric acid from the nitrogen of the air', 'the hydrogen contained sulfur', 'the glass dissolved'], a: 1, why: 'The spark oxidises a little nitrogen to nitrogen oxides, which dissolve in the dew as nitric acid. The unreactive 1/120 left over was argon.' }
  ],
  applications: ['Every hydrogen flame, rocket engine and fuel cell does Cavendish’s reaction. The Space Shuttle’s main engines burned liquid hydrogen with about 6 parts of oxygen to 1 by mass, less than the 8 : 1 that burns everything, because the lighter exhaust gives a faster jet.', 'Hydrogen as a fuel makes only water at the point of use: the oldest experiment in the topic is the cleanest combustion there is.', 'The eudiometer, the sparked gas tube, was the standard tool of gas analysis in the 19th century and still has descendants in the lab.', 'The same two-to-one is seen when water is split: electrolysis gives twice as much hydrogen as oxygen by volume.'],
  history: 'Cavendish’s work on air is in a paper he read in January 1784; he dated the experiments to 1781 and refined them in the next years. Charles Blagden, his assistant and friend, carried news of the result to Paris in June 1783, which began the dispute with Lavoisier and with James Watt over priority, told on the next page. The unreactive bubble was investigated again by Lord Rayleigh and William Ramsay in 1894, who named argon and credited Cavendish.',
  sources: ['Cavendish, “Experiments on Air”, *Philosophical Transactions of the Royal Society* 74 (1784), 119–153.', 'Jungnickel and McCormmach, *Cavendish: The Experimental Life* (1999), on his experiments and his temperament.', 'Partington, *A History of Chemistry*, vol. 3 (1962), on the chemistry of airs before Lavoisier.', 'Standard molar masses (IUPAC); ideal-gas molar volume at 20 °C and 1 atm.'],
  sim: 'dw-spark-jar'
},

/* ================================================================ Lavoisier names it */
{
  id: 'lavoisier-names-it', parent: 'discovering-water', title: 'Lavoisier names it', level: 2,
  short: 'In 1783–84 Lavoisier and his colleagues burned hydrogen to make water and passed steam over red-hot iron to unmake it, the iron gaining the oxygen’s weight. Water was a compound; its gas was named hydrogène, the water-former; phlogiston was buried; and the credit has been argued over ever since.',
  keywords: ['Lavoisier', 'Laplace', 'Meusnier', 'hydrogen', 'water-former', 'oxygen', 'phlogiston', 'gun barrel', 'iron', 'steam', 'decomposition of water', 'Watt', 'Blagden', 'water controversy', 'nomenclature', 'conservation of mass', '1783', '1784', '1787'],
  prereq: ['cavendishs-spark'],
  related: ['two-to-one', 'water-as-an-element', 'chemistry:molar-mass', 'chemistry:gas-laws', 'chemistry:ideal-gas-law'],
  body: `
Picture a rifle barrel packed with iron turnings and laid through a furnace until it glows. At one end a flask of water is boiling and sending steam in; at the other end no steam comes out, but a gas that burns, bubbling into a jar over water. The barrel, taken out and weighed, is heavier than it went in. This is the apparatus of Antoine Lavoisier and Jean-Baptiste Meusnier in 1784, and what it showed was that the gas had come out of the water and the missing weight had gone into the iron.

### Weighing, not guessing
Lavoisier’s method was bookkeeping. In the 1770s he had shown that metals burned in air gain weight and that the air loses the same, so burning is a *combination* with something from the air, not the escape of phlogiston, a supposed fire-stuff that had to have negative weight to fit. The something was the gas he named *oxygène*. The theory that the 18th century had built around phlogiston did not so much lose an argument as lose its need to exist.

### Two experiments, one conclusion
In June 1783 Lavoisier and Laplace burned hydrogen in oxygen in a closed vessel and weighed the water. A year later he and Meusnier did the reverse. Steam passed over red-hot iron:

$$\\ce{3Fe + 4H2O -> Fe3O4 + 4H2}$$

Both at once: the iron gains the weight of the oxygen, the hydrogen leaves as a gas, and the two together account for all the water.

| Per 72.06 g of steam decomposed | Mass |
|---|---|
| hydrogen collected | 8.06 g |
| gain of the iron | 64.00 g |
| total | 72.06 g |

So the iron gains **7.94 times** the weight of the hydrogen that is collected. Water was not an element: it could be built from two gases and torn into them again, and the weights balanced both ways. In the 1780s the proportions Lavoisier gave were close to 85 parts oxygen to 15 of hydrogen; the true figures are 88.8 and 11.2, and the difference shows how hard it was to weigh a light gas in 1784.

### The names
In 1787 Lavoisier, with Guyton de Morveau, Berthollet and Fourcroy, published a new chemical language. *Oxygène*, “acid-former”, was Lavoisier’s name for the gas he thought was in every acid (a mistake: hydrochloric acid has none). *Hydrogène*, from the Greek for water and for producing, “water-former”, named Cavendish’s inflammable air by what it made when burned. The names stayed because the idea in them was right about hydrogen.

### Whose discovery?
The “water controversy” is one of the best-documented priority quarrels in science. Cavendish had done the experiment in 1781 and read his paper in January 1784. Lavoisier’s account of the Paris experiment in June 1783 came days after Charles Blagden had told the Paris chemists of Cavendish’s result, and Blagden and others thought Lavoisier gave Cavendish too little credit. James Watt, whose letter to Priestley of April 1783 proposed that water is made of dephlogisticated air and phlogiston, had a claim of his own; his paper was read in April 1784. Historians generally give Cavendish the experiment and Lavoisier the interpretation; Watt’s part is real but a different one.

Lavoisier was a tax farmer as well as a chemist, and in 1794 the revolutionary tribunal condemned him with the other members of the Ferme générale. He was guillotined at fifty, with the *Traité élémentaire de chimie* of 1789 a modern book in everything but its list of elements.

> [!key] Lavoisier and his colleagues showed with a balance that water is built from two gases and can be split into them: the iron gained eight times the weight of the hydrogen. They named the gas hydrogène, “water-former”, and the idea of phlogiston went with the old picture of water as a simple thing.`,
  ideas: ['Passing steam over red-hot iron gives hydrogen, and the iron gains the weight of the oxygen: 3 Fe + 4 H₂O → Fe₃O₄ + 4 H₂.', 'Synthesis (burning hydrogen) and decomposition (steam on iron) together show that water is a compound with weights that balance both ways.', 'The iron gains 7.94 times the mass of hydrogen released; each gram of hydrogen corresponds to 8.94 g of water.', 'Hydrogène means “water-former”; the 1787 nomenclature replaced phlogiston-language with names that say what a substance is made of.'],
  pitfalls: ['“Lavoisier discovered oxygen and hydrogen” — Priestley and Scheele made oxygen first and Cavendish isolated hydrogen in 1766; Lavoisier’s contribution was to see what they were, to weigh, and to name.', '“Lavoisier made water first” — Cavendish had done it in 1781; Lavoisier’s experiment of June 1783 followed news of Cavendish’s result. The interpretation and the proof by decomposition were Lavoisier’s.', '“Oxygen means ‘oxygen makes acids’ and is right” — The name is “acid-former” and the idea was wrong; hydrochloric acid has no oxygen. The name outlived the error.'],
  terms: [
    { term: 'Phlogiston', def: 'The fire-stuff of 18th-century chemistry, supposed to be released from a burning body and taken up by air. Lavoisier showed that burning adds weight from the air, and the idea was dropped.' },
    { term: 'Hydrogen', also: ['hydrogène', 'water-former'], def: 'The lightest element, named by Lavoisier’s group in 1787 from Greek for “water” and “producing”, because it makes water when it burns. At room temperature the gas is H₂.' },
    { term: 'Oxygen', also: ['oxygène', 'acid-former'], def: 'The element named by Lavoisier from Greek “acid” and “producing”, in the mistaken belief that all acids contain it. In water it makes up 88.8 % of the mass.' },
    { term: 'Water controversy', also: ['water dispute'], def: 'The 18th-century quarrel over who first recognised that water is a compound: Cavendish, who did the experiment, Watt, who proposed the idea, or Lavoisier, who proved it by decomposition.' },
    { term: 'Calx', also: ['metal calx'], def: 'The old word for what is left when a metal is burned or roasted, now called an oxide. Lavoisier showed it weighs more than the metal because it has combined with oxygen.' }
  ],
  formulas: [
    { name: 'The iron’s gain in weight', expr: 'dm = mH*MO/MH2', tex: '\\Delta m = m_H\\,\\frac{M_O}{M_{\\mathrm{H_2}}}',
      vars: { dm: { name: 'gain in weight of the iron', q: 'mass', unit: 'g', tex: '\\Delta m' }, mH: { name: 'mass of hydrogen collected', q: 'mass', unit: 'g', value: 1, tex: 'm_H' }, MO: { name: 'molar mass of O atoms', q: 'molarmass', unit: 'g/mol', value: 15.999, fixed: true, tex: 'M_O' }, MH2: { name: 'molar mass of H₂', q: 'molarmass', unit: 'g/mol', value: 2.016, fixed: true, tex: 'M_{\\mathrm{H_2}}' } },
      solveFor: 'dm', note: 'Each H₂ released leaves one oxygen atom in the iron, so the gain is 7.94 times the hydrogen.',
      stories: { dm: 'A gun barrel with iron turnings yields {mH} of hydrogen from steam. By how much does the iron gain weight?' } },
    { name: 'Water decomposed for a given hydrogen', expr: 'mW = mH*MW/MH2', tex: 'm_W = m_H\\,\\frac{M_W}{M_{\\mathrm{H_2}}}',
      vars: { mW: { name: 'mass of water decomposed', q: 'mass', unit: 'g', tex: 'm_W' }, mH: { name: 'mass of hydrogen released', q: 'mass', unit: 'g', value: 1, tex: 'm_H' }, MW: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_W' }, MH2: { name: 'molar mass of H₂', q: 'molarmass', unit: 'g/mol', value: 2.016, fixed: true, tex: 'M_{\\mathrm{H_2}}' } },
      solveFor: 'mW', note: 'Each molecule of H₂ comes from one molecule of water: 8.94 g of water per gram of hydrogen.',
      stories: { mW: 'The steam over the iron has given {mH} of hydrogen. How much water was decomposed?' } },
    { name: 'Volume of the hydrogen collected', expr: 'V = mH/MH2*R*T/p', tex: 'V = \\frac{m_H}{M_{\\mathrm{H_2}}}\\frac{R\\,T}{p}',
      vars: { V: { name: 'volume of hydrogen', q: 'volume', unit: 'L' }, mH: { name: 'mass of hydrogen', q: 'mass', unit: 'g', value: 4.032, tex: 'm_H' }, MH2: { name: 'molar mass of H₂', q: 'molarmass', unit: 'g/mol', value: 2.016, fixed: true, tex: 'M_{\\mathrm{H_2}}' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: -273 }, p: { name: 'pressure (absolute)', q: 'pressure', unit: 'kPa', value: 101.325 } },
      solveFor: 'V', note: 'The ideal-gas law, good for hydrogen at everyday conditions to better than 0.1 %.',
      stories: { V: 'The barrel has released {mH} of hydrogen at {T} and {p}. What volume of gas is collected in the jar?' } }
  ],
  examples: [
    { title: 'Two moles of steam over hot iron', q: 'Two moles of steam (36.03 g) are decomposed by hot iron. Find the hydrogen released, its volume at 20 °C and 1 atm, the iron’s gain in weight and the iron consumed.',
      steps: ['Each mole of H₂O gives one mole of H₂: 2 mol of hydrogen, which is $2 \\times 2.016 = 4.032$ g.', 'Volume at 20 °C and 1 atm: $2 \\times 24.06 = 48.1$ L.', 'The oxygen left in the iron: 2 mol of O atoms, $2 \\times 15.999 = 32.00$ g. Check: $4.03 + 32.00 = 36.03$ g.', 'Iron consumed, from 3 Fe : 4 H₂O: $\\tfrac{3}{4} \\times 2 = 1.5$ mol, which is $1.5 \\times 55.845 = 83.8$ g.'],
      a: '4.03 g of hydrogen (48 L), the iron 32.0 g heavier, and 83.8 g of iron turned to black oxide Fe₃O₄. Water in = hydrogen out + weight gained.' },
    { title: 'Lavoisier’s composition of water', q: 'Lavoisier gave the composition of water as about 85 parts oxygen to 15 of hydrogen by weight. How does the hydrogen share compare with the true 11.19 %?',
      steps: ['True share: $2 \\times 1.008/18.015 = 0.1119$, which is 11.19 %.', 'Lavoisier: 15 %. The ratio of the two is $15/11.19 = 1.34$.', 'The oxygen to hydrogen ratio he implied is $85/15 = 5.7$, against the true $7.94$.'],
      a: 'His hydrogen share was about a third too large. For the lightest gas, weighed in 1784 with the apparatus of the day, that is a respectable result.' }
  ],
  quiz: [
    { q: 'In the gun-barrel experiment, why was the iron’s gain in weight so important?', choices: ['It showed the iron was impure', 'It showed that the weight of the oxygen of the water had gone into the iron', 'It showed that hydrogen is heavier than steam', 'It proved the barrel leaked'], a: 1, why: 'The water that disappeared equalled the hydrogen collected plus the iron’s gain: the oxygen had been taken out of the water and kept by the iron.' },
    { q: 'The name hydrogène means', choices: ['“light gas”', '“acid-former”', '“water-former”', '“fire-air”'], a: 2, why: 'From Greek *hydor* (water) and *genes* (forming). “Acid-former” is oxygène.' },
    { q: 'Lavoisier was the first to make water by burning hydrogen in oxygen.', a: false, why: 'Cavendish had done it in 1781, and Lavoisier’s experiment of June 1783 followed news of Cavendish’s result. Lavoisier’s lasting contribution was the interpretation, the decomposition experiment and the names.' },
    { q: 'How many grams does the iron gain when the steam over it releases 1.000 g of hydrogen?', answer: 7.94, unit: 'g', why: 'Each H₂ released leaves one O atom in the iron: 15.999/2.016 = 7.94.' },
    { q: 'The name “oxygen” (acid-former) reflects an idea that', choices: ['was correct, since all acids contain oxygen', 'was wrong: hydrochloric acid, for one, contains no oxygen', 'was correct for water only', 'was never published'], a: 1, why: 'Lavoisier believed that oxygen is the acidifying principle. Humphry Davy showed in 1810 that hydrochloric acid has no oxygen.' }
  ],
  applications: ['The steam–iron process was an industrial source of hydrogen in the early 1900s: Lavoisier’s apparatus, scaled up.', 'Rust. Iron in water with a little dissolved oxygen takes up the same oxygen far more slowly, which is why a steam boiler corrodes and why boilers are treated to remove dissolved oxygen.', 'Mass balances in every process plant: what goes in must come out as products plus accumulation — Lavoisier’s rule written for engineers.', 'Water splitting today, by electrolysis or heat, is the reverse of the synthesis: the same 8.94 g of water for each gram of hydrogen.'],
  history: 'Lavoisier (1743–1794) was elected to the Académie des sciences in 1768. The decomposition of water with Meusnier is dated 1784, with a larger public demonstration in 1785. The 1787 nomenclature was prepared by a committee of four; the English translation by Robert Kerr (1790) of the *Traité* carried the new names into English. Meusnier, a young army engineer, was killed at Mainz in 1793.',
  sources: ['Lavoisier, *Traité élémentaire de chimie* (1789); Guyton de Morveau, Lavoisier, Berthollet and Fourcroy, *Méthode de nomenclature chimique* (1787).', 'Donovan, *Antoine Lavoisier: Science, Administration, and Revolution* (1993), for the experiments and the priority question.', 'Jungnickel and McCormmach, *Cavendish: The Experimental Life* (1999), on the water controversy.', 'Partington, *A History of Chemistry*, vol. 3 (1962); IUPAC standard atomic weights.'],
  sim: 'dw-gun-barrel'
}

);

Hyper.add(

/* ================================================================ two volumes to one */
{
  id: 'two-to-one', parent: 'discovering-water', title: 'Two volumes to one', level: 2,
  short: 'Two volumes of hydrogen combine with one of oxygen and make two of steam, and the mass ratio is 1 : 8. Turning that into the formula H₂O took Gay-Lussac (1805), Dalton’s rival HO, Avogadro’s hypothesis (1811), and Cannizzaro at Karlsruhe in 1860.',
  keywords: ['two volumes', 'Gay-Lussac', 'Humboldt', 'Dalton', 'HO', 'H2O', 'Avogadro', 'Cannizzaro', 'Karlsruhe', 'atomic weight', 'eudiometer', 'combining volumes', 'diatomic', 'mole', 'mass ratio 1 to 8', 'formula of water'],
  prereq: ['lavoisier-names-it', 'chemistry:gas-laws'],
  related: ['cavendishs-spark', 'what-water-is', 'the-bent-shape', 'chemistry:molar-mass', 'chemistry:ideal-gas-law'],
  body: `
After Lavoisier the question was no longer whether water is a compound but of what, and in what proportion. By weight the answer was settled fairly quickly: 8 parts of oxygen to 1 of hydrogen, to within a few per cent. By volume it was neater. By number of atoms it took until about 1860, and the reason is a good lesson in how a measurement waits for an idea.

### What Gay-Lussac and Humboldt measured
In 1805 Joseph Louis Gay-Lussac and Alexander von Humboldt, working in Paris, sparked hydrogen and oxygen in a graduated tube and found that 100 volumes of oxygen consumed very nearly 200 of hydrogen. Three years later Gay-Lussac generalised: gases combine in simple whole-number proportions by volume, and the product, if a gas, also has a simple proportion. For water, measured as steam above 100 °C:

$$\\ce{2 volumes H2 + 1 volume O2 -> 2 volumes steam}$$

The volumes are all at the same temperature and pressure. Two plus one makes two, not three, which is a clue.

### The puzzle
John Dalton’s atomic theory (*A New System of Chemical Philosophy*, 1808) gave every element its own atoms, with a weight. For compounds he adopted a rule of simplicity: if two elements form only one compound, assume one atom of each. Water would then be **HO**, and the mass ratio 1 : 8 would make an oxygen atom eight times as heavy as a hydrogen atom (his own measurements gave 7). He distrusted Gay-Lussac’s volumes, because if gases hold equal numbers of atoms in equal volumes, 1 volume of hydrogen and 1 of oxygen could make at most 1 volume of HO, and two of hydrogen with one of oxygen would need an oxygen atom to be split in two.

### Avogadro’s way out
In 1811 Amedeo Avogadro proposed two things. First, **equal volumes of any gas, at the same temperature and pressure, contain the same number of molecules.** Second, the molecules of hydrogen, oxygen and some other gases are not single atoms but pairs. Then the volumes are counts: two molecules of H₂ and one of O₂ give two of H₂O, with no splitting of atoms:

$$\\ce{2H2 + O2 -> 2H2O}$$

and water is H₂O, with an oxygen atom sixteen times the weight of the hydrogen atom. A cubic centimetre of any gas at 20 °C and 1 atm holds about $2.5 \\times 10^{19}$ molecules: Avogadro could not count them, but he could see that the number does not depend on the gas.

### Why it took fifty years
Few chemists accepted it. Dalton rejected it; the words *atom*, *molecule* and *equivalent* were used interchangeably, and in the 1850s textbooks gave water as HO, H₂O and even H₂O₂ depending on the author. At the first international congress of chemists, held at Karlsruhe in September 1860, Stanislao Cannizzaro revived Avogadro and showed that the molecular weights of gases measured by their densities, combined with analysis, give a single consistent table of atomic weights. Within a few years the textbooks agreed: **H₂O, with oxygen at 16**.

| | H₂ | O₂ | H₂O (steam) |
|---|---|---|---|
| volume | 2 | 1 | 2 |
| molecules (relative) | 2 | 1 | 2 |
| mass per mole | 2.016 g | 31.998 g | 18.015 g |
| mass in the reaction | 4.032 g | 31.998 g | 36.03 g |

The last row gives the mass ratio 1 : 7.94 directly.

### What you can do with it
Count water by gas volume (the eudiometer’s trick), find atomic weights from densities, and know that water has two hydrogens for each oxygen before you can even imagine why the molecule is bent: that comes in [[the-bent-shape]].

> [!key] Two volumes of hydrogen and one of oxygen make two of steam; with Avogadro’s rule that equal volumes hold equal numbers of molecules, and diatomic H₂ and O₂, this reads as 2 H₂ + O₂ → 2 H₂O. The formula H₂O was settled around 1860, half a century after the data that imply it.`,
  ideas: ['Gay-Lussac and Humboldt (1805): 100 volumes of oxygen take about 200 of hydrogen, and the product is 200 of steam.', 'Dalton’s simplicity rule gave HO and an oxygen atom of 8 (7 in his data); it could not explain the volumes.', 'Avogadro (1811): equal volumes of gases at the same T and p contain equal numbers of molecules; elemental gases are diatomic. Then 2 H₂ + O₂ → 2 H₂O.', 'Cannizzaro made it persuasive at Karlsruhe in 1860; the mass ratio 1 : 7.94 and the formula H₂O give an oxygen atom 15.9 times a hydrogen atom.'],
  pitfalls: ['“Two volumes to one means the formula is H₂O directly” — Volumes give formulas only with Avogadro’s rule and the knowledge that H₂ and O₂ are molecules; without them the same data fit HO.', '“The mass ratio 1 : 8 and the volume ratio 2 : 1 contradict each other” — They agree. Oxygen is sixteen times heavier per atom, so one volume of O₂ (32 units) weighs eight times two volumes of H₂ (4 units).', '“Avogadro’s hypothesis is about equal masses” — It is about equal numbers of molecules in equal volumes. Equal volumes of hydrogen and oxygen differ in mass by a factor of sixteen.'],
  terms: [
    { term: 'Law of combining volumes', also: ['Gay-Lussac’s law of gases'], def: 'Gay-Lussac’s 1808 finding that gases react in simple whole-number ratios of volume, measured at the same temperature and pressure: 2 H₂ : 1 O₂ : 2 H₂O.' },
    { term: 'Avogadro’s hypothesis', also: ['Avogadro’s law'], def: 'Equal volumes of all gases at the same temperature and pressure contain the same number of molecules. Proposed in 1811, it is the bridge from combining volumes to molecular formulas.' },
    { term: 'Diatomic molecule', def: 'A molecule made of two atoms. Hydrogen (H₂), oxygen (O₂) and nitrogen (N₂) are diatomic gases, which Avogadro saw was needed to explain the volume data.' },
    { term: 'Atomic weight', also: ['relative atomic mass'], def: 'The mass of an atom relative to a standard, now one twelfth of carbon-12. Hydrogen is 1.008 and oxygen 15.999, so oxygen is 15.87 times heavier.' },
    { term: 'Equivalent weight', def: 'The 19th-century measure of how much of an element combines with a fixed amount of another, such as 8 g of oxygen per 1 g of hydrogen. It is not the atomic weight, and mixing the two caused much of the confusion over the formula of water.' }
  ],
  formulas: [
    { name: 'Volumes that combine (Gay-Lussac)', expr: 'Vh = 2*Vo', tex: 'V_H = 2\\,V_O',
      vars: { Vh: { name: 'volume of hydrogen', q: 'volume', unit: 'mL', tex: 'V_H' }, Vo: { name: 'volume of oxygen', q: 'volume', unit: 'mL', value: 20, tex: 'V_O' } },
      solveFor: 'Vh', note: 'Both gases at the same temperature and pressure. The steam formed has the same volume as the hydrogen used (above 100 °C).',
      stories: { Vh: 'A tube holds {Vo} of oxygen. What volume of hydrogen burns it completely?', Vo: 'A tube holds {Vh} of hydrogen. What volume of oxygen is needed to burn it completely?' } },
    { name: 'Mass fraction of hydrogen in water', expr: 'w = 2*AH/MW', tex: 'w = \\frac{2\\,A_H}{M_W}',
      vars: { w: { name: 'hydrogen fraction by mass', q: 'ratio', unit: '%' }, AH: { name: 'atomic weight of hydrogen', q: 'molarmass', unit: 'g/mol', value: 1.008, fixed: true, tex: 'A_H' }, MW: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_W' } },
      solveFor: 'w', note: 'The 11.19 % that Lavoisier estimated as 15 %. The rest, 88.81 %, is oxygen: a mass ratio of 7.94 to 1.',
      stories: { w: 'Water has two hydrogen atoms of {AH} each in a molecule of {MW}. What fraction of its mass is hydrogen?' } },
    { name: 'The atomic weight of oxygen the formula implies', expr: 'AO = r*n*AH', tex: 'A_O = r\\,n\\,A_H',
      vars: { AO: { name: 'atomic weight of oxygen', q: 'molarmass', unit: 'g/mol', tex: 'A_O' }, r: { name: 'oxygen to hydrogen, by mass, in water', value: 7.936, min: 0, hint: 'From analysis of water: 88.81 % to 11.19 %.' }, n: { name: 'hydrogen atoms per oxygen in the formula', value: 2, int: true, min: 1, max: 4, hint: '1 for HO (Dalton), 2 for H₂O (Avogadro, Cannizzaro).' }, AH: { name: 'atomic weight of hydrogen', q: 'molarmass', unit: 'g/mol', value: 1.008, fixed: true, tex: 'A_H' } },
      solveFor: 'AO', note: 'The same measured mass ratio gives 8.0 if water is HO and 16.0 if it is H₂O. The weights came from the formula you assumed.',
      stories: { AO: 'Water is {r} times as much oxygen as hydrogen by mass, and its formula has {n} hydrogen atoms for each oxygen. What does the oxygen atom weigh?' } },
    { name: 'How many molecules in a volume of gas', expr: 'N = p*V/(kB*T)', tex: 'N = \\frac{p\\,V}{k_B\\,T}',
      vars: { N: { name: 'number of molecules' }, p: { name: 'pressure', q: 'pressure', unit: 'atm', value: 1 }, V: { name: 'volume', q: 'volume', unit: 'mL', value: 1 }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20, min: -273 } },
      solveFor: 'N', note: 'The same number for every gas: Avogadro’s hypothesis follows from the ideal-gas law. 2.5 × 10¹⁹ per millilitre at 20 °C and 1 atm.',
      stories: { N: 'A volume of {V} of any gas at {p} and {T}: how many molecules does it hold?' } }
  ],
  examples: [
    { title: 'A tube with gas to spare', q: 'A closed tube holds 30 mL of hydrogen and 20 mL of oxygen, at 120 °C and the same pressure. A spark is passed. What is in the tube, and how much water results if it is cooled to 20 °C?',
      steps: ['Hydrogen burns with half its volume of oxygen: 30 mL needs 15 mL. Oxygen is in excess by $20 - 15 = 5$ mL.', 'Steam formed has the volume of the hydrogen used: 30 mL at 120 °C.', 'Cooled, the steam condenses. In moles, $30\\ \\mathrm{mL}$ is $30 \\times 4.157\\times10^{-5} = 1.247$ mmol (at 20 °C), which is $1.247 \\times 18.015 = 22.5$ mg of liquid.'],
      a: '30 mL of steam and 5 mL of unburnt oxygen; after cooling, 22.5 mg of water (0.022 mL) and 5 mL of oxygen.' },
    { title: 'Dalton’s oxygen and Cannizzaro’s', q: 'Analysis of water gives 7.94 g of oxygen per gram of hydrogen. What atomic weight of oxygen follows if water is HO, and what if it is H₂O? Take hydrogen as 1.008.',
      steps: ['If HO: one oxygen atom for each hydrogen atom, so the oxygen atom weighs $7.936 \\times 1.008 = 8.0$.', 'If H₂O: two hydrogens for each oxygen, so the oxygen atom weighs $2 \\times 7.936 \\times 1.008 = 16.0$.', 'Other compounds, such as carbon dioxide and its gas density, fixed which to use: Cannizzaro’s test was to find the smallest amount of an element in any gaseous molecule.'],
      a: '8.0 for HO and 16.0 for H₂O. The data from water alone cannot decide; the densities of many gases can.' }
  ],
  quiz: [
    { q: 'In the reaction of hydrogen and oxygen to give steam, the volumes (at one temperature and pressure) are in the ratio', choices: ['1 : 1 : 1', '2 : 1 : 2', '2 : 1 : 3', '1 : 2 : 1'], a: 1, why: '2 volumes of hydrogen, 1 of oxygen, 2 of steam: Gay-Lussac’s result of 1805–08, explained by 2 H₂ + O₂ → 2 H₂O.' },
    { q: 'Why did Dalton write water as HO?', choices: ['He measured one hydrogen atom to one oxygen atom', 'He assumed the simplest ratio when only one compound of two elements is known', 'He thought oxygen was lighter than hydrogen', 'Gay-Lussac’s volumes demanded it'], a: 1, why: 'His rule of greatest simplicity. Gay-Lussac’s volumes, 2 : 1 : 2, did not fit, and Dalton chose to doubt the volumes.' },
    { q: 'Avogadro’s hypothesis says that equal volumes of gases at the same temperature and pressure contain equal masses.', a: false, why: 'It says equal numbers of molecules. A litre of oxygen weighs sixteen times a litre of hydrogen because each of its molecules does.' },
    { q: 'How many grams of oxygen combine with 1.000 g of hydrogen to make water?', answer: 7.94, unit: 'g', why: 'Oxygen is 88.81 % of water and hydrogen 11.19 %: 88.81/11.19 = 7.94.' },
    { q: 'The formula H₂O became generally accepted after', choices: ['Lavoisier’s experiments in 1784', 'Dalton’s atomic theory in 1808', 'Cannizzaro at the Karlsruhe congress in 1860', 'Mendeleev’s table in 1869 alone'], a: 2, why: 'Cannizzaro’s presentation of Avogadro’s hypothesis and a consistent set of atomic weights in September 1860 turned the argument. Mendeleev, who attended Karlsruhe, built on it.' }
  ],
  applications: ['School electrolysis demonstrations (the Hofmann voltameter) show twice as much hydrogen as oxygen by volume above the electrodes: the same 2 : 1.', 'Gas stoichiometry in engines, furnaces and fuel cells uses volumes as counts: every volume of hydrogen burnt needs half a volume of oxygen.', 'The idea that equal volumes mean equal numbers gives molar volume, the molar mass and Avogadro’s constant: 24.06 L per mole of any gas at 20 °C and 1 atm.', 'Hydrogen and air burn over a wide range of mixtures, from about 4 % to 75 % hydrogen by volume, which is why hydrogen leaks are treated so seriously.'],
  history: 'Gay-Lussac’s memoir on the combination of gases was read in 1808 and published in 1809. Avogadro’s *Essai d’une manière de déterminer les masses relatives des molécules élémentaires des corps* appeared in *Journal de physique* in 1811; Ampère reached a similar idea in 1814. The congress at Karlsruhe, 3–5 September 1860, was organised by Kekulé, Wurtz and Weltzien; about 140 chemists attended and Cannizzaro’s 1858 paper was handed out. The name “Avogadro’s constant” dates from Jean Perrin’s work of about 1909.',
  sources: ['Gay-Lussac and Humboldt, memoir on eudiometric means and the composition of the atmosphere, *Journal de physique* (1805); Gay-Lussac, memoir on the combination of gaseous substances (1808).', 'Avogadro, *Journal de physique* 73 (1811); Cannizzaro, *Sunto di un corso di filosofia chimica* (1858).', 'Brock, *The Norton History of Chemistry*, chapters on the atom and on the problem of atomic weights.', 'IUPAC standard atomic weights; Atkins, *Physical Chemistry*, the ideal-gas law.'],
  sim: 'dw-two-to-one'
},

/* ================================================================ Henderson */
{
  id: 'henderson-and-the-fitness-of-the-environment', parent: 'discovering-water', title: 'Henderson and the fitness of the environment', level: 2,
  short: 'In 1913 the Harvard physiologist Lawrence J. Henderson turned Darwin round: instead of asking how life fits its surroundings, he asked how well the surroundings fit life, and found water at the top of every list that mattered. His argument is the ancestor of this whole app.',
  keywords: ['Henderson', 'fitness of the environment', '1913', 'water properties', 'specific heat', 'latent heat', 'surface tension', 'dielectric constant', 'anthropic', 'fine-tuning', 'habitability', 'teleology', 'Darwin', 'carbon dioxide', 'biochemistry'],
  prereq: ['what-a-hydrogen-bond-is', 'why-ice-floats', 'specific-heat-of-water'],
  related: ['the-strange-reason', 'could-life-use-another-liquid', 'the-list-of-anomalies', 'the-matrix-of-life', 'latent-heat-of-vaporisation', 'two-to-one'],
  body: `
Darwin taught biology to ask how living things fit the world they live in: the claws, the lungs, the camouflage. In 1913 **Lawrence J. Henderson** (1878–1942), a Harvard physiologist best known for the equation that describes how blood and cells keep their acidity steady, asked the question the other way up. Suppose life is a chemical process. How well does the world’s chemistry suit it? His book, *The Fitness of the Environment*, collected the evidence that of all the substances that could have been abundant, water, carbon dioxide and the compounds of carbon, hydrogen and oxygen are the ones that make life workable.

### The case for water
Henderson went through the physical properties of water one by one, measured them against other liquids, and asked what each did for living things. In today’s numbers:

| Property | Water | Other common liquids | What it does for life |
|---|---|---|---|
| specific heat | 4,182 J/(kg·K) | 1,700–2,500 | evens out temperature in bodies, oceans and air |
| latent heat of vaporisation | 2,257 kJ/kg | 335–1,100 | evaporative cooling; the water cycle |
| surface tension | 72.8 mN/m | 18–63 | water in soil, capillaries, leaves |
| dielectric constant | 78.4 | 2–43 | pulls salts and charged groups apart |
| thermal conductivity | 0.60 W/(m·K) | 0.12–0.29 | spreads heat within cells and lakes |
| density maximum, ice floats | 3.98 °C; 917 kg/m³ ice | none | lakes freeze from the top |

Water stands first, usually by a wide margin, among the ordinary liquids, and he stressed that the properties come together: the same liquid that dissolves salts also stores heat, climbs capillaries and floats its own solid. Henderson called this **reciprocal fitness**. Life is adapted to its environment, but the environment is also “fit” for life, and in a way that no adaptation could have produced, because water was there first.

### How good is the argument?
It is a real one, and it can be pressed from three sides.

- **The circle.** Life on Earth began in water, so of course it uses water’s properties. If a heat-storing, high-tension solvent were not available, life would have used whatever was. Henderson saw this and answered that even so, the liquid has to exist with those extremes, and few do.
- **One coincidence, not six.** The properties do not come independently. Almost all follow from one thing, the hydrogen bond in a bent, lopsided molecule — the thread of this app. Counting them as separate coincidences overstates the case.
- **What is left.** That the molecule exists, and in quantity, is something: hydrogen is the commonest element in the universe and oxygen the third, so water is made of the most plentiful reactive materials there are. Whether another liquid might do, ammonia or methane or a hydrocarbon at low temperature, is the subject of [[could-life-use-another-liquid]].

Henderson read the pattern as a sign of an order in nature, and said so with more caution than some of those who later took up the theme. He wrote a second book on it, *The Order of Nature* (1917). Modern discussions of the anthropic principle, such as Barrow and Tipler’s of 1986 and Michael Denton’s later *Nature’s Destiny*, treat him as a forerunner. His detailed catalogue of properties is the list that still opens the chapter on water in every biology textbook.

### Use the dashboard
The simulation puts water’s numbers against nine other liquids and counts the properties on which it comes first. With all ten it wins two of the five: liquid ammonia stores a little more heat, and mercury, a metal, is better on surface tension and conductivity. Restricted to the ordinary liquids of a living planet, it wins all five.

> [!key] Henderson showed in 1913 that water is extreme in every property that matters for life, and that the extremes cooperate. The argument has weaknesses — life evolved in water, and the properties share one cause — but it set the question that the rest of this app answers: why this molecule?`,
  ideas: ['Henderson reversed Darwin’s question: not how organisms fit the environment but how fit the environment is for organisms.', 'Water is extreme among ordinary liquids in specific heat, latent heat, surface tension, dielectric constant and conductivity, and it floats its own solid.', 'The properties are not independent: they share one cause, the hydrogen bond, so the “coincidences” are fewer than six.', 'The circle objection — life used what existed — is real; Henderson’s reply is that so few candidates have the whole set.'],
  pitfalls: ['“Henderson showed that water was designed for life” — He argued that water is uniquely fit, and read that as a mark of order in nature. The inference from fitness to purpose is a philosophical step many scientists, then and since, have declined to take.', '“Water is the best on every property” — It leads the ordinary liquids on these five, but liquid ammonia stores more heat per kilogram and mercury has higher surface tension and conductivity. The case is strong, not unconditional.', '“Water’s properties are an independent list” — They share a single source, the hydrogen bond; the unlikely thing is the molecule, not six separate numbers.'],
  terms: [
    { term: 'Fitness of the environment', also: ['Henderson’s fitness'], def: 'Henderson’s phrase for the degree to which the properties of matter, above all of water, carbon dioxide and carbon compounds, suit them to the needs of living things.' },
    { term: 'Reciprocal fitness', def: 'Henderson’s idea that organisms are fitted to their environment, as Darwin said, and that the environment is also fitted for organisms, so that the two match in both directions.' },
    { term: 'Teleology', def: 'Explanation by purpose or end. Henderson saw a hint of order in nature in the fitness he catalogued; most biologists restrict explanation to natural selection and physical causes.' },
    { term: 'Anthropic principle', also: ['fine-tuning argument'], def: 'The argument that the physical conditions of the universe must be such as to permit observers to exist, and that this is either a selection effect or a deeper puzzle. Henderson’s book is an early instance of the reasoning.' },
    { term: 'Henderson–Hasselbalch equation', def: 'The equation for the pH of a buffer, pH = pKa + log([base]/[acid]). Henderson derived the relation for the hydrogen-ion concentration in 1908; Hasselbalch gave the logarithmic form in 1916.' }
  ],
  formulas: [
    { name: 'Sweat needed to carry away heat', expr: 'm = P*t/Lv', tex: 'm = \\frac{P\\,t}{L_v}',
      vars: { m: { name: 'mass of water evaporated', q: 'mass', unit: 'kg' }, P: { name: 'heat to be removed', q: 'power', unit: 'W', value: 700, hint: 'A runner turns about 800–1,000 W of food energy into heat; resting, a person gives off about 100 W.' }, t: { name: 'time', q: 'time', unit: 'h', value: 1 }, Lv: { name: 'latent heat of vaporisation', q: 'latent', unit: 'kJ/kg', value: 2420, tex: 'L_v', hint: '2,257 kJ/kg at 100 °C, about 2,420 at skin temperature (33 °C).' } },
      solveFor: 'm', note: 'Evaporation does the cooling because the latent heat is so large. For ethanol (841 kJ/kg) three times as much would be needed.',
      stories: { m: 'A runner has {P} to lose for {t}. How much sweat must evaporate?' } },
    { name: 'Warming by a given amount of heat', expr: 'dT = Q/(m*c)', tex: '\\Delta T = \\frac{Q}{m\\,c}',
      vars: { dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', tex: '\\Delta T' }, Q: { name: 'heat absorbed', q: 'energy', unit: 'kJ', value: 100 }, m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 }, c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 4182, hint: 'Water 4,182; ethanol 2,440; olive oil 1,970; dry sand 830; iron 449.' } },
      solveFor: 'dT', note: 'Try the specific heats of other substances: the same heat warms a kilogram of ethanol by 41 K, not 24 K, and a kilogram of sand by 120 K.',
      stories: { dT: 'A mass of {m} absorbs {Q}. If its specific heat is {c}, by how much does it warm?' } },
    { name: 'Force between two ions in a solvent', expr: 'F = ke*zz*qe^2/(eps*r^2)', tex: 'F = \\frac{k_e\\,z\\,q_e^2}{\\varepsilon\\,r^2}',
      vars: { F: { name: 'force between the ions', q: 'force', unit: 'N' }, ke: { const: 'ke' }, zz: { name: 'product of the ion charges (in electrons)', value: 1, int: true, min: 1, tex: 'z', hint: '1 for Na⁺ and Cl⁻; 4 for Ca²⁺ and SO₄²⁻ (2 × 2).' }, qe: { const: 'qe' }, eps: { name: 'dielectric constant of the medium', value: 78.4, min: 1, tex: '\\varepsilon', hint: '1 for vacuum, 78.4 for water at 25 °C, 24.5 for ethanol, 1.9 for hexane.' }, r: { name: 'separation of the ions', q: 'length', unit: 'pm', value: 280 } },
      solveFor: 'F', note: 'The force in water is 1/78 of the force in vacuum, so thermal motion can pull a salt crystal apart. Set the dielectric constant to 1.89 (hexane) to see why salt does not dissolve in oil.',
      stories: { F: 'Two ions (charge product {zz}) are {r} apart in a liquid of dielectric constant {eps}. What is the force?' } }
  ],
  examples: [
    { title: 'A runner’s sweat', q: 'A marathon runner turns 700 W of excess heat into the air for an hour by evaporating sweat. How much sweat evaporates? How much would it be if sweat were ethanol?',
      steps: ['Heat to remove: $700 \\times 3600 = 2.52 \\times 10^6$ J.', 'Water: $m = 2.52\\times10^6 / 2.42\\times10^6 = 1.04$ kg, roughly a litre.', 'Ethanol (841 kJ/kg): $m = 2.52\\times10^6/8.41\\times10^5 = 3.0$ kg, which is 3.8 L at its density of 789 kg/m³.'],
      a: 'About 1 kg (1 L) of sweat an hour — in line with measured sweat rates. A runner who sweated ethanol would need nearly four litres.' },
    { title: 'The sea and the sand', q: 'On a hot day a kilogram of sea water and a kilogram of dry sand each absorb 100 kJ. By how much does each warm? Take specific heats 3,990 and 830 J/(kg·K).',
      steps: ['Sea water: $\\Delta T = 100\\,000 / (1 \\times 3990) = 25$ K.', 'Sand: $\\Delta T = 100\\,000 / (1 \\times 830) = 120$ K.', 'Sand warms 4.8 times as much for the same heat.'],
      a: '25 K for the sea, 120 K for the sand: the sand is scorching and the sea merely warm, and this is why coasts have mild climates.' }
  ],
  quiz: [
    { q: 'Henderson’s “fitness of the environment” means', choices: ['that organisms are well adapted to their surroundings', 'that the properties of water and other matter are unusually well suited to life', 'that fit organisms survive', 'that water is a perfect solvent for everything'], a: 1, why: 'Darwin’s fitness is the organism’s fit to its environment; Henderson’s is the reverse, the environment’s suitability for life.' },
    { q: 'Which statement is a fair objection to Henderson’s argument?', choices: ['Water has no unusual properties', 'Life arose in water and so is bound to use water’s properties', 'Ice does not float', 'Water has no hydrogen bonds'], a: 1, why: 'The circularity objection: life took what was there. Henderson’s answer is that the liquid has to have all the extremes at once, and few do.' },
    { q: 'Among all ten liquids in the dashboard, water is first on every one of the five properties.', a: false, why: 'Liquid ammonia has a higher specific heat and mercury a higher surface tension and conductivity. Among the ordinary liquids of a living planet water is first on all five.' },
    { q: 'By what factor is the force between two ions reduced in water compared with vacuum?', answer: 78.4, why: 'The dielectric constant is 78.4 at 25 °C, and the force falls by that factor.' },
    { q: 'Which of these elements is the third most abundant in the universe, after hydrogen and helium?', choices: ['carbon', 'oxygen', 'nitrogen', 'iron'], a: 1, why: 'By number of atoms: hydrogen, helium, then oxygen. Water is made from the first and third.' }
  ],
  applications: ['Biology textbooks still open the chapter on water with Henderson’s list: high specific heat, high heat of vaporisation, cohesion and surface tension, solvent power, ice that floats.', 'Astrobiology’s “follow the water” policy for the search for life is a descendant of his argument, and the criteria for other solvents are Henderson’s properties.', 'Climate modelling uses water’s specific heat and latent heat as the basis of the ocean’s storage and the hydrological cycle.', 'Philosophers of physics and cosmology cite him in debates on fine-tuning and anthropic reasoning.'],
  history: 'Henderson (1878–1942) trained in medicine and chemistry and spent his career at Harvard, in physiology and later in the sociology of science. The Henderson equation for buffers (1908) is the one still taught. *The Fitness of the Environment* was published by Macmillan in 1913 and *The Order of Nature* in 1917; both argue that the environment is adapted to life by laws of nature. A scan of the first is public domain.',
  sources: ['Henderson, *The Fitness of the Environment* (Macmillan, 1913); *The Order of Nature* (1917).', 'Barrow and Tipler, *The Anthropic Cosmological Principle* (Oxford University Press, 1986); Denton, *Nature’s Destiny* (1998).', 'Ball, “Water is an active matrix of life for cell and molecular biology”, *PNAS* 114, 13327 (2017).', 'CRC Handbook of Chemistry and Physics; IAPWS data for the properties of water.'],
  sim: 'dw-fitness'
},

/* ================================================================ polywater and water memory */
{
  id: 'polywater-and-water-memory', parent: 'discovering-water', title: 'Polywater and water memory', level: 2,
  short: 'Two claims about water that could not survive being tested: a denser, stickier “polywater” (1962–73), which turned out to be impure water, and the “memory of water” (1988), which vanished when the experiment was blinded. Their stories show how such claims are settled, and how to read the next one.',
  keywords: ['polywater', 'anomalous water', 'Deryagin', 'Fedyakin', 'Lippincott', 'Rousseau', 'water memory', 'Benveniste', 'homeopathy', 'Maddox', 'Randi', 'blinded trial', 'structured water', 'alkaline water', 'pseudoscience', 'replication', 'Avogadro limit', 'self-correcting science'],
  prereq: ['what-a-hydrogen-bond-is', 'two-to-one'],
  related: ['bonds-that-flicker', 'the-strange-reason', 'the-structure-of-liquid-water', 'chemistry:ph-scale', 'medicine:acid-base-balance', 'chemistry:hydrogen-bonding'],
  body: `
Water is so ordinary and so strange that it has been the subject of two famous mistakes in the last sixty years. Both were made by serious people with real instruments; both were corrected within a few years; and the way they were corrected is a lesson in how a surprising claim about nature is settled.

### Polywater, 1962–1973
In 1961–62 Nikolai Fedyakin, in Kostroma, condensed water vapour in quartz capillaries a few micrometres across and obtained a few micrograms of a liquid that seemed to differ from ordinary water: denser, much more viscous, not freezing at 0 °C, not boiling at 100 °C. Boris Deryagin, an eminent surface chemist in Moscow, took it up. At a meeting of the Faraday Society in Nottingham in 1966 the claim reached the West, and by 1969 laboratories in Britain and the United States were making it. Ellis Lippincott’s group at the University of Maryland read their infrared and Raman spectra as a new, polymerised water — **polywater** — and the press added a fear: that the stuff could spread and turn the oceans into it.

The fear was a mood from fiction (Vonnegut’s *ice-nine*), but the science was real. The samples were minute, the spectra differed between laboratories, and nobody could make a larger quantity. In 1970–71 Denis Rousseau at Bell Laboratories showed that the spectra matched those of human sweat, and others found that the samples contained sodium, potassium, chlorine, lactate and fragments of silicate leached from the glass. The contaminated “polywater” of each lab was whatever dissolved from its own glassware and fingers. Samples made with more care showed no anomaly; by 1973 the consensus, which Deryagin’s own group came to share, was that polywater did not exist. Some hundreds of papers had been written.

### The memory of water, 1988
Homeopathic remedies are dilutions: one part in a hundred, shaken, then again, and so on, thirty times in a “30C” preparation. Each step multiplies the water by a hundred, and after about **12 steps** a mole of starting material (6 × 10²³ molecules) is expected to leave less than one molecule. Beyond that there is nothing left but water. Defenders say that the water *remembers* what was dissolved in it.

On 30 June 1988 *Nature* published a paper by Jacques Benveniste (INSERM, Clamart) and twelve co-authors reporting that human white blood cells degranulated in response to an antibody diluted to 10⁻¹²⁰, which is 60C. *Nature’s* editor, John Maddox, printed it with a note that he did not believe it, and in July took with him to the laboratory the magician and sceptic James Randi and Walter Stewart, an investigator of scientific misconduct. They watched the experiments, then repeated them with the vials coded by a third party so that nobody present knew which was which. The effect disappeared. The investigators’ report (*Nature*, 28 July 1988) called the claims a delusion; Benveniste protested at the process and maintained his results until he died in 2004, but no independent blinded replication has been generally accepted.

### Why water cannot remember
Water would have to hold a pattern for weeks while its hydrogen bonds break and re-form every picosecond. In [[bonds-that-flicker]] we measured that a bond lasts about 1.2 ps and the network rearranges completely in a few picoseconds; there is no scale of time on which a specific shape could be stored. Systematic reviews of homeopathy, including the *Lancet* analysis of 110 trials by Shang and colleagues (2005), find effects compatible with placebo.

### How a claim like this is tested
- **Blind** the assessor, so that expectation cannot tilt the reading, and **randomise** the order.
- **Fix** the outcome and the analysis in advance.
- **Replicate** in other laboratories; pooled results kill a one-off accident.
- **Ask for a mechanism** that fits what else is known.

“Structured” or “hexagonal” water, and drinks sold as alkaline, get the same treatment. Water has short-lived local structure, but nothing in it lasts long enough to be sold in a bottle. A drink of pH 9 meets stomach acid at pH 1.5–3.5 and is neutralised in seconds, while blood is held at pH 7.35–7.45 by the lungs and kidneys whatever one drinks.

> [!key] Polywater was impure water, shown by a spectrum; the memory of water was an artefact of knowing which vial was which, shown by blinding. Water is strange enough without extra properties, and the way to meet a claim of one is to ask for the blinded, replicated test.`,
  ideas: ['Polywater (1962–73): a viscous, dense “new water” from quartz capillaries, shown in 1970–71 to be ordinary water contaminated with sweat, silicates and salts.', 'The memory of water (1988): a blinded, coded repeat at Benveniste’s own laboratory, in the presence of Maddox, Randi and Stewart, made the effect disappear.', 'Beyond about 12 centesimal dilutions of a mole there is, on average, less than one molecule of the original substance in the vial.', 'Hydrogen bonds last about 1.2 ps, so water cannot store a pattern for days; blinding, replication and mechanism are the tests for any new claim.'],
  pitfalls: ['“Polywater was a hoax” — It was an honest error by careful people. The samples were tiny and contaminated, and the first confirmations were genuine measurements of the contaminant.', '“Benveniste’s result was refuted by showing that the cells do not respond” — The cells did respond to real antibody. What failed was the response to dilutions beyond any molecule, and it failed under blinding.', '“If it works for some people it must do something” — Unblinded effects, regression to the mean and the 1-in-20 false positive of any single test are why trials are blinded and replicated.'],
  terms: [
    { term: 'Polywater', also: ['anomalous water', 'orthowater'], def: 'A supposed polymerised form of water reported from 1962 in quartz capillaries, denser and more viscous than water, shown in 1970–73 to be ordinary water with dissolved impurities.' },
    { term: 'Water memory', also: ['memory of water'], def: 'The claim that water keeps a record of substances once dissolved in it, so that high dilutions retain their activity. It was reported in 1988 and fails in blinded tests.' },
    { term: 'Blinding', also: ['blind trial', 'double-blind'], def: 'Arranging a test so that those who assess the results, and in a double-blind test those who deliver the treatment too, do not know which sample is which, so that expectation cannot colour the reading.' },
    { term: 'Centesimal dilution', also: ['C scale', '30C'], def: 'A homeopathic dilution of one part in 100 at each step. A 12C preparation is diluted 10²⁴-fold, the limit beyond which a mole of starting material leaves less than one molecule.' },
    { term: 'Replication', also: ['independent replication'], def: 'Repeating an experiment in other hands and with other equipment. A real effect survives it; an artefact, a contaminant or a statistical accident usually does not.' }
  ],
  formulas: [
    { name: 'Molecules left after dilution', expr: 'N = N0*100^(-C)', tex: 'N = N_0\\,100^{-C}',
      vars: { N: { name: 'expected molecules of the original substance' }, N0: { name: 'molecules at the start', value: 6.022e23, tex: 'N_0', hint: 'One mole is 6.022 × 10²³ molecules.' }, C: { name: 'centesimal dilutions', value: 12, int: true, min: 0, max: 100, hint: '“30C” means 30 steps of 1 in 100.' } },
      solveFor: 'N', note: 'Below 1, the number is an expectation: the chance that even one molecule remains is about N. At 12C a mole leaves 0.6; at 30C, 6 × 10⁻³⁷.',
      stories: { N: 'A mole of a substance is diluted {C} times, one part in 100 each time. How many molecules are expected in the final vial?', C: 'How many centesimal dilutions leave {N} molecules from {N0}?' } },
    { name: 'Chance that some laboratory finds an effect by luck', expr: 'P = 1 - (1 - a)^m', tex: 'P = 1 - (1 - \\alpha)^m',
      vars: { P: { name: 'chance of at least one false positive', q: 'ratio', unit: '%' }, a: { name: 'significance level of each test', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: '\\alpha', hint: 'The conventional 5 % means one false positive in 20 when there is nothing to find.' }, m: { name: 'independent tests or laboratories', value: 20, int: true, min: 1 } },
      solveFor: 'P', note: 'With 20 independent tests of a false claim, the chance that at least one reports a “significant” result is 64 %. This is why single positive results need replication.',
      stories: { P: 'A false claim is tested in {m} laboratories at the {a} level. What is the chance that at least one of them finds an effect?' } },
    { name: 'How surprising is a score at guessing', expr: 'z = (k - n/2)/(sqrt(n)/2)', tex: 'z = \\frac{k - n/2}{\\sqrt{n}\\,/\\,2}',
      vars: { z: { name: 'standard deviations above chance', signed: true }, k: { name: 'correct calls', value: 30, int: true, min: 0 }, n: { name: 'trials', value: 40, int: true, min: 1 } },
      solveFor: 'z', note: 'For a person guessing between two vials, the correct calls have a mean of n/2 and a standard deviation of √n/2. A score above 1.65 is “significant” at the one-in-20 level; 3.16 is about one in a thousand.',
      stories: { z: 'An assessor identifies {k} of {n} coded vials correctly. How many standard deviations is that above guessing?' } }
  ],
  examples: [
    { title: 'Where the last molecule goes', q: 'Starting from one mole of a substance, how many 1-in-100 dilutions leave an expected number of molecules below one? How many are left at 30C, the usual strength?',
      steps: [{ text: 'Expected molecules after C steps:', tex: 'N = 6.022\\times10^{23}\\times 100^{-C}' }, 'At $C = 11$: $N = 60$. At $C = 12$: $N = 0.6$. So 12 steps is the limit.', 'At $C = 30$: $N = 6.022\\times10^{23}\\times10^{-60} = 6\\times10^{-37}$.'],
      a: '12 dilutions. At 30C the expected number of molecules is 6 × 10⁻³⁷, about one chance in 10³⁶ that the vial contains a single one; the remedy is water.' },
    { title: 'Twenty laboratories', q: 'A claim that is false is tested independently in 20 laboratories, each at the 5 % level. What is the chance that at least one reports a significant effect? And in 100?',
      steps: [{ text: 'Chance that one laboratory reports nothing:', tex: '1 - 0.05 = 0.95' }, '20 laboratories: $0.95^{20} = 0.358$, so at least one reports an effect with probability $1 - 0.358 = 64\\ \\%$.', '100 laboratories: $0.95^{100} = 0.0059$; the chance is 99.4 %.'],
      a: '64 % for 20 laboratories, 99.4 % for 100. A single positive laboratory is not evidence; a pooled and blinded result is.' }
  ],
  quiz: [
    { q: 'Polywater’s anomalous properties were eventually traced to', choices: ['a new polymer of water molecules', 'a hoax by Soviet scientists', 'contamination of tiny samples by impurities such as sweat and glass', 'a magnetic effect in the capillaries'], a: 2, why: 'Rousseau’s spectra (1970–71) matched sweat, and samples made with scrupulous care had none of the anomalies.' },
    { q: 'Why did Maddox, Randi and Stewart code the vials?', choices: ['to save time', 'so that nobody present knew which vials contained the antibody dilution', 'to hide the results from Benveniste forever', 'because Nature required it'], a: 1, why: 'Blinding removes the chance that the person reading the result is influenced by expectation. The effect, visible when the vial identity was known, disappeared when it was not.' },
    { q: 'Water’s hydrogen bonds break and re-form in about a picosecond, so it can store a specific structure for days.', a: false, why: 'The network is reshuffled about a trillion times a second. A pattern that lasts days would need to be held by something other than the hydrogen bonds, and nothing is known that does that.' },
    { q: 'After how many 1-in-100 dilutions of one mole is the expected number of original molecules below one?', answer: 12, why: '6.0 × 10²³ × 100⁻¹² = 0.6.' },
    { q: 'Why is a pH 9 “alkaline water” unlikely to change the acidity of your blood?', choices: ['Blood has no pH', 'The stomach neutralises it, and the lungs and kidneys hold blood at pH 7.35–7.45', 'Water cannot be alkaline', 'Blood contains the same water memory'], a: 1, why: 'Stomach acid has a pH of about 1.5–3.5 and the quantity of mild base in a bottle is small; the body regulates blood pH within narrow limits regardless of the drink.' }
  ],
  applications: ['Randomised, double-blind, placebo-controlled trials in medicine descend from this logic. They are why new drugs are tested before sale.', 'Consumer protection: “structured”, “energised”, “hexagonal” and “alkaline” water products are sold on claims that can be put to a blinded test, and have not passed one.', 'Journal policy: *Nature* and other journals now ask for descriptions of blinding and randomisation, and for statistical review of surprising claims.', 'The same pattern — a small effect, a hard-to-reproduce set-up, wide publicity, quick correction — reappears in the cold-fusion episode of 1989, and the LK-99 superconductor claim of 2023, and is a useful checklist for any breaking news in science.'],
  history: 'Fedyakin’s capillary work began in Kostroma in 1961 and Deryagin’s group in Moscow reported it from 1962. Lippincott’s paper “Polywater” appeared in *Science* in 1969. Rousseau’s “Polywater and sweat: similarities between the infrared spectra” appeared in *Science* in 1971. Felix Franks’s *Polywater* (MIT Press, 1981) is the standard account. Benveniste’s *Nature* paper of 30 June 1988 and the investigators’ report of 28 July are both available in the journal’s archive.',
  sources: ['Davenas, Beauvais, Amara, … and Benveniste, “Human basophil degranulation triggered by very dilute antiserum against IgE”, *Nature* 333, 816 (1988); Maddox, Randi and Stewart, “‘High-dilution’ experiments a delusion”, *Nature* 334, 287 (1988).', 'Rousseau, “Polywater and sweat”, *Science* 171, 170 (1971); Lippincott et al., “Polywater”, *Science* 164, 1482 (1969); Franks, *Polywater* (MIT Press, 1981).', 'Shang et al., “Are the clinical effects of homeopathy placebo effects?”, *The Lancet* 366, 726 (2005).', 'Fecko, Eaves, Loparo, Tokmakoff and Geissler, *Science* 301, 1698 (2003), for the picosecond life of a hydrogen bond; Ball, *PNAS* 114, 13327 (2017).'],
  sim: [{ id: 'dw-blind-trial' }, { id: 'dw-timeline', params: { from: 1960, to: 1990, year: 1962 } }]
}

);
