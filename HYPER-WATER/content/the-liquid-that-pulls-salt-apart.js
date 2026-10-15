/* HYPER-WATER · content/the-liquid-that-pulls-salt-apart.js — the topic "The liquid that pulls salt apart" (branch The Solvent).
 * Eleven concepts: how salt dissolves, the dielectric constant, like dissolves like, the hydrophobic effect, gases in water,
 * colligative properties, osmosis, the salt of the sea, pure water and conductivity, water as acid and base, hard water.
 * Simulations are in sims/the-liquid-that-pulls-salt-apart.js (ids sol-…).
 */
Hyper.add(

/* ================================================================ 1 */
{
  id: 'how-salt-dissolves', parent: 'the-liquid-that-pulls-salt-apart', title: 'How salt dissolves', level: 1,
  short: 'Water molecules turn their oxygen ends towards sodium ions and their hydrogen ends towards chloride ions, and peel the crystal apart one ion at a time. Dissolving costs 787 kJ/mol to break the lattice and returns almost exactly that as hydration; the small shortfall, +3.9 kJ/mol, is paid for by entropy.',
  keywords: ['dissolving', 'salt', 'sodium chloride', 'hydration shell', 'solvation', 'ion-dipole', 'lattice energy', 'enthalpy of solution', 'solubility', 'NaCl', 'why salt dissolves', 'electrolyte'],
  prereq: ['polarity-and-the-dipole', 'what-a-hydrogen-bond-is'],
  related: ['the-dielectric-constant', 'like-dissolves-like', 'the-salt-of-the-sea', 'hydration-shells-and-proteins', 'colligative-properties', 'chemistry:solutions', 'chemistry:solubility', 'chemistry:lattice-energy'],
  body: `
Stir a spoonful of salt into a glass of water and in half a minute it has gone. Nothing was destroyed and nothing reacted: the sodium and chloride ions that stacked into the crystal are still there, still ions, only now each one is wrapped in water and wandering on its own. Why should water be able to do that to a crystal that is held together by one of the strongest forces in chemistry?

### A crystal held by charge
Sodium chloride is a cubic checkerboard of Na⁺ and Cl⁻ ions, 2.82 Å from neighbour to neighbour. Every ion is pulled by six opposite charges next to it. Taking one mole of the crystal apart into free gaseous ions costs the **lattice enthalpy**, 787 kJ/mol: about 320 times the thermal energy $RT$ per mole. Heated in air, salt melts only at 801 °C. No amount of room-temperature jostling will pull an ion out of that.

### What water offers
A water molecule is a small dipole, 1.85 D, with its oxygen end negative and its hydrogens positive ([[polarity-and-the-dipole]]). Near a sodium ion it swings its **oxygen** towards the ion; near a chloride ion it swings a **hydrogen** towards it, forming a weak hydrogen bond to the ion. Five or six water molecules gather around each Na⁺ (the oxygens 2.4 Å away) and six or so around each Cl⁻. That cage is the **hydration shell**. Every molecule in it is attracted by the ion, and the ion, in turn, no longer feels its neighbours so strongly, because the water screens them ([[the-dielectric-constant]]).

The dissolving starts at the corners and edges, where an ion has only three or four neighbours in the crystal instead of six and several water molecules can reach it at once. It is pulled out, hydrated and carried off; the next ion is now a corner. The crystal is peeled like an onion.

### The energy ledger
| Step | kJ/mol |
|---|---|
| Pull NaCl apart into gaseous ions (lattice enthalpy) | +787 |
| Surround the Na⁺ with water (hydration enthalpy) | −406 |
| Surround the Cl⁻ with water | −363 |
| Total from these table values | +18 |
| Heat of solution actually measured | +3.9 |

Two numbers near 800 kJ/mol cancel to within a few kilojoules. The table values disagree with the calorimeter by 10–15 kJ/mol because the hydration enthalpies of single ions cannot be measured, only the sum for a pair, and each book splits it by its own convention; the measured +3.9 is the one to trust. Either way the water pays back almost exactly what the crystal charged. That is the achievement of hydration: it replaces one set of strong attractions with another.

### Paid for by entropy
Dissolving NaCl takes in a little heat — dissolve 10 g in 100 g of water and the glass cools by about 1.5 K. So it is not driven downhill in energy. It is driven by **entropy**: ions free to wander through the whole volume have vastly more arrangements than ions fixed on a lattice. At 25 °C the free energy of solution is about −9 kJ/mol, made of +4 kJ/mol of enthalpy and −13 kJ/mol of $-T\\Delta S$ (the entropy gain is about 43 J/(mol·K)). The same near-zero enthalpy explains why salt's solubility hardly moves with temperature: 35.7 g per 100 g of water at 0 °C, 36.0 at 25 °C, 39.1 at 100 °C.

### A limit set by the water itself
The solubility of 36 g per 100 g means 0.62 mol of NaCl, 1.23 mol of ions, to 5.55 mol of water: only **4.5 water molecules per ion**. That is fewer than a full shell, so in a saturated solution the shells overlap and share. Water cannot dress the next ion fully; the crystal and the solution are in balance. Salts with strongly exothermic or endothermic ledgers behave differently: calcium chloride (−83 kJ/mol) warms the water it dissolves in, ammonium nitrate (+26 kJ/mol) chills it, which is how an instant cold pack works.

> [!key] Salt dissolves because water's oxygen-and-hydrogen dipole can replace each ion's neighbours with its own: the hydration energy returns almost all of the 787 kJ/mol the lattice costs, and entropy pays the difference. Nothing is destroyed — a dissolved crystal is just ions in cages of water.`,
  ideas: ['Water\'s oxygen end points at positive ions and a hydrogen points at negative ions, so each ion ends up in a shell of five or six oriented molecules.', 'The crystal costs 787 kJ/mol to pull apart and the shells give back almost exactly that; the net heat for NaCl is a mere +3.9 kJ/mol.', 'Dissolving is driven by entropy: free ions have far more arrangements than ions fixed in a lattice.', 'At saturation there are only about 4.5 water molecules per ion, fewer than a full shell, which is why more salt cannot dissolve.'],
  pitfalls: ['"Salt reacts with water" — No new substance forms. The ions were already ions in the crystal; evaporate the water and the same crystals return.', '"Dissolving always releases or always absorbs heat" — It can do either. NaCl is almost thermoneutral, calcium chloride gives heat and ammonium nitrate takes it up. What every dissolving that happens by itself has in common is a falling free energy, not a falling enthalpy.', '"Water pulls the ions out because it is wet" — The pull is electrical: a dipole near a charge. A non-polar liquid with the same density and viscosity (hexane) does nothing to a salt crystal.'],
  terms: [
    { term: 'Hydration shell', also: ['solvation shell', 'hydration sphere', 'first shell'], def: 'The layer of water molecules held around an ion or a solute by its charge or its hydrogen-bonding groups. Around Na⁺ there are five to six molecules, oxygen towards the ion; around Cl⁻ about six, a hydrogen towards the ion.' },
    { term: 'Lattice enthalpy', also: ['lattice energy', 'crystal energy'], def: 'The energy needed to separate one mole of an ionic crystal into free gaseous ions: 787 kJ/mol for NaCl, 3,791 kJ/mol for MgO.' },
    { term: 'Enthalpy of hydration', also: ['hydration enthalpy', 'ΔH_hyd'], def: 'The heat released when one mole of free gaseous ions is surrounded by water: about −406 kJ/mol for Na⁺ and −363 for Cl⁻ by the usual tables. It grows with the ion\'s charge and shrinks with its size.' },
    { term: 'Enthalpy of solution', also: ['heat of solution', 'ΔH_sol'], def: 'The heat absorbed when one mole of a solute dissolves in so much solvent that more makes no difference: the lattice enthalpy plus the hydration enthalpies. +3.9 kJ/mol for NaCl, −83 for CaCl₂, +26 for NH₄NO₃.' },
    { term: 'Solubility', also: ['saturation'], def: 'The most a solute that dissolves in a given amount of solvent at a given temperature; for NaCl in water, 36 g per 100 g at 25 °C. A solution holding that much is saturated and is in balance with the undissolved solid.' },
    { term: 'Electrolyte', also: ['ionic conductor'], def: 'A substance that gives ions when dissolved and so lets the solution carry an electric current. Salts, strong acids and strong bases are strong electrolytes; sugar and ethanol are not electrolytes.' }
  ],
  formulas: [
    { name: 'Enthalpy of solution from the ledger', expr: 'dH = U - Hh', tex: '\\Delta H_\\mathrm{sol} = U_\\mathrm{lat} - H_\\mathrm{hyd}',
      vars: { dH: { name: 'enthalpy of solution', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H_\\mathrm{sol}', hint: 'Positive: the solution cools. Negative: it warms. Measured +3.9 kJ/mol for NaCl.' }, U: { name: 'lattice enthalpy', q: 'molarenergy', unit: 'kJ/mol', value: 787, tex: 'U_\\mathrm{lat}', hint: '787 kJ/mol for NaCl, 717 for KCl, 3,791 for MgO.' }, Hh: { name: 'total hydration enthalpy (magnitude)', q: 'molarenergy', unit: 'kJ/mol', value: 769, tex: 'H_\\mathrm{hyd}', hint: 'The energy returned when the ions are hydrated, 406 + 363 = 769 kJ/mol by the usual table values for Na⁺ and Cl⁻.' } },
      solveFor: 'dH', note: 'The table values give +18; calorimetry gives +3.9. The sum of two numbers near 800 is only as good as its two parts, and single-ion hydration enthalpies depend on convention.',
      stories: { dH: 'A crystal needs {U} to be pulled into free ions and the ions return {Hh} on hydration. What is the heat of solution?', Hh: 'A crystal with lattice enthalpy {U} has a heat of solution of {dH}. How much does hydration return?' } },
    { name: 'Free energy of solution', expr: 'dG = dH - T*dS', tex: '\\Delta G = \\Delta H - T\\,\\Delta S',
      vars: { dG: { name: 'free energy of solution', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' }, dH: { name: 'enthalpy of solution', q: 'molarenergy', unit: 'kJ/mol', value: 3.9, signed: true, tex: '\\Delta H' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -50, max: 300 }, dS: { name: 'entropy of solution', q: 'molarheat', unit: 'J/(mol·K)', value: 43, signed: true, tex: '\\Delta S', hint: 'About +43 J/(mol·K) for NaCl at the standard concentration: the ions gain freedom, the water around them loses a little.' } },
      solveFor: 'dG', note: 'Standard-state values at 25 °C. Spontaneous dissolving needs $\\Delta G < 0$: here the entropy term, −12.9 kJ/mol, outweighs +3.9 kJ/mol of heat.',
      stories: { dG: 'Dissolving a salt takes {dH} of heat and raises the entropy by {dS}. What is the free energy of solution at {T}?', dS: 'A salt\'s solution has ΔH of {dH} and ΔG of {dG} at {T}. What is the entropy change?' } },
    { name: 'Salt that saturates a mass of water', expr: 'm = s*mw', tex: 'm = s\\,m_w',
      vars: { m: { name: 'mass of salt that dissolves', q: 'mass', unit: 'g' }, s: { name: 'solubility (mass of salt per mass of water)', q: 'ratio', unit: '%', value: 36, tex: 's', hint: '36 g per 100 g of water for NaCl at 25 °C is 36 %; 35.7 % at 0 °C and 39.1 % at 100 °C.' }, mw: { name: 'mass of water', q: 'mass', unit: 'g', value: 250 } },
      solveFor: 'm', note: 'Valid for a single salt in pure water; a second salt in the solution changes the limit.',
      stories: { m: 'A saturated solution is made in {mw} of water at 25 °C. How much salt dissolves?', mw: 'A saturated solution holds {m} of salt at a solubility of {s}. How much water is there?' } },
    { name: 'Ion pairs in a pinch of salt', expr: 'N = m/Mm*NA', tex: 'N = \\frac{m}{M}\\,N_A',
      vars: { N: { name: 'number of Na⁺Cl⁻ pairs', hint: 'Every pair is a sodium ion and a chloride ion, twice as many ions as pairs.' }, m: { name: 'mass of salt', q: 'mass', unit: 'mg', value: 300 }, Mm: { name: 'molar mass of NaCl', q: 'molarmass', unit: 'g/mol', value: 58.44, tex: 'M' }, NA: { const: 'NA' } },
      solveFor: 'N', note: 'A teaspoon of salt is about 6 g.',
      stories: { N: 'A pinch of table salt weighs {m}. How many NaCl pairs is that?' } }
  ],
  examples: [
    { title: 'A cooling glass', q: 'Dissolve 10 g of NaCl in 100 g of water. If the heat of solution is +3.9 kJ/mol, by how much does the temperature fall? Take the solution to have the heat capacity of 100 g of water.',
      steps: [{ text: 'Moles of salt:', tex: 'n = 10/58.44 = 0.171\\ \\mathrm{mol}' }, { text: 'Heat taken from the water:', tex: 'Q = 0.171 \\times 3.9 = 0.67\\ \\mathrm{kJ}' }, { text: 'Temperature fall:', tex: '\\Delta T = \\frac{670}{0.100 \\times 4184} = 1.6\\ \\mathrm{K}' }],
      a: 'About 1.6 K colder — a real but small effect. For ammonium nitrate, whose heat of solution is +25.7 kJ/mol, the same 10 g would cool the water by about 4.5 K.' },
    { title: 'Not enough water to go round', q: 'How many water molecules are there for every ion in a saturated solution of NaCl (36 g in 100 g of water)? Compare with a full hydration shell of about 12 molecules per ion pair.',
      steps: ['Salt: $36/58.44 = 0.616$ mol, which is $1.232$ mol of ions (Na⁺ and Cl⁻).', 'Water: $100/18.015 = 5.55$ mol.', { text: 'Ratio:', tex: '5.55/1.232 = 4.5\\ \\text{water molecules per ion}' }],
      a: '4.5 per ion, 9 per pair — well below a full shell of 5–6 per ion. Hydration shells are shared and incomplete in a saturated solution, and that is what stops further dissolving.' }
  ],
  quiz: [
    { q: 'Which part of a water molecule points at a sodium ion?', choices: ['A hydrogen atom', 'The oxygen atom', 'Both hydrogens equally, forming a V around it', 'None: water molecules do not orient near ions'], a: 1, why: 'Sodium is positive, so it attracts the negative end of the dipole, the oxygen. A chloride ion, being negative, attracts a hydrogen.' },
    { q: 'Dissolving NaCl absorbs a little heat (+3.9 kJ/mol), yet it happens by itself. The reason is that', choices: ['the water was warmer than the salt', 'the entropy increase more than compensates', 'the reaction is exothermic after all', 'the lattice energy is negative'], a: 1, why: 'A spontaneous process needs a negative free energy, ΔG = ΔH − TΔS. Here TΔS is about +13 kJ/mol, larger than the +4 kJ/mol of heat.' },
    { q: 'When salt dissolves, the sodium and chloride ions are chemically changed into new substances by the water.', a: false, why: 'The ions already exist in the crystal. Dissolving only separates them and surrounds them with water; evaporating the water brings back the same crystal.' },
    { q: 'The solubility of NaCl rises by only about 10 % between 0 °C and 100 °C, while that of potassium nitrate rises about twelve-fold. What does this say about the two heats of solution?', choices: ['NaCl\'s is near zero and potassium nitrate\'s is strongly positive', 'NaCl\'s is strongly negative', 'They are equal', 'Both are strongly negative'], a: 0, why: 'By Le Chatelier\'s principle a solute that absorbs heat when it dissolves dissolves more when heated. NaCl is almost thermoneutral (+3.9 kJ/mol), so it hardly responds; KNO₃ takes up about 35 kJ/mol and responds strongly.' },
    { q: 'How many water molecules per ion are there in a saturated NaCl solution (36 g per 100 g of water)?', answer: 4.5, why: '5.55 mol of water for 1.23 mol of ions: 4.5. A full shell would need 5–6, so the shells must overlap.' }
  ],
  applications: ['Salting food, brine and pickling: the dissolved salt both flavours and, by lowering the water\'s availability, preserves ([[colligative-properties]], [[osmosis-and-osmotic-pressure]]).', 'Instant cold packs (ammonium nitrate or urea, +26 kJ/mol) and hand warmers (calcium chloride, −83 kJ/mol) are the two ends of the ledger.', 'Intravenous saline (0.9 % NaCl) and sports drinks: the electrolytes that carry nerve signals and fluid balance are dissolved salts.', 'The sea itself, 35 g of dissolved ions in every kilogram ([[the-salt-of-the-sea]]).', 'Crystal growing, salt production and the purification of chemicals by recrystallisation reverse the same ledger by evaporation or cooling.'],
  history: 'The idea that dissolved salts are split into charged ions even without a current was Svante Arrhenius\'s doctoral claim in Uppsala in 1884, which his examiners marked down as barely acceptable; he won the Nobel Prize in Chemistry for it in 1903. The energy balance between lattice and hydration was worked out in the 1910s–20s with the Born–Haber cycle (Born and Haber, 1919) and Born\'s 1920 model of the ion in a dielectric.',
  sources: ['Atkins and de Paula, *Physical Chemistry*, chapters on ionic solids and on ions in solution (lattice and hydration enthalpies).', 'CRC *Handbook of Chemistry and Physics*: solubility of NaCl against temperature, enthalpies of solution, standard thermodynamic quantities.', 'Marcus, *Ion Solvation* (Wiley, 1985): hydration numbers and enthalpies of single ions and the conventions behind them.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017): hydration shells as active partners.'],
  sim: 'sol-dissolving-crystal'
},

/* ================================================================ 2 */
{
  id: 'the-dielectric-constant', parent: 'the-liquid-that-pulls-salt-apart', title: 'The dielectric constant', level: 2,
  short: 'Water\'s relative permittivity is 78.4 at 25 °C: the force between two charges immersed in it is 78 times weaker than in a vacuum. That is why the sodium and chloride ions of a crystal, which hold on with 490 kJ/mol in vacuum, attract each other with only 6 kJ/mol — two and a half thermal kicks — once water is between them.',
  keywords: ['dielectric constant', 'relative permittivity', 'epsilon', '78.4', 'Coulomb', 'screening', 'Bjerrum length', 'Debye length', 'Born energy', 'polar solvent', 'why water dissolves salts', 'microwave'],
  prereq: ['how-salt-dissolves', 'polarity-and-the-dipole', 'physics:dielectrics'],
  related: ['like-dissolves-like', 'what-a-hydrogen-bond-is', 'the-structure-of-liquid-water', 'hydration-shells-and-proteins', 'pure-water-and-conductivity', 'feynman:dielectrics-feyn'],
  body: `
Coulomb\'s law says two charges $q_1$ and $q_2$ a distance $r$ apart attract or repel with a force $F = k\\,q_1 q_2/r^2$. That is the law in a vacuum. Put the charges in a material and the force falls by a factor $\\varepsilon_r$, the **relative permittivity**, usually called the dielectric constant. For air it is 1.0005, for oil 3, for ethanol 24.5, for glass about 5 — and for liquid water, **78.4** at 25 °C. Two charges in water pull on each other 78 times more weakly than in empty space. No other common liquid comes close.

### What this does to a crystal
Two neighbouring ions in the NaCl lattice, +1 and −1, 2.82 Å apart, attract with an energy $k e^2/r$ of 8.2 × 10⁻¹⁹ J (5.1 eV), 492 kJ/mol. That is 200 times the thermal energy $RT$: not an attraction anything can undo by shaking. Now put them in water. The energy falls to 492/78.4 = **6.3 kJ/mol**, only about 2.5 $RT$. At that level a thermal kick breaks the pair apart within nanoseconds. This, as much as the hydration shell, is why salt dissolves in water ([[how-salt-dissolves]]); and the loss of attraction is exactly the work the dissolving does not have to pay for.

| Medium | Relative permittivity | Pair energy at 2.82 Å, kJ/mol | In units of $RT$ |
|---|---|---|---|
| vacuum | 1 | 492 | 199 |
| hexane | 1.9 | 260 | 105 |
| olive oil | 3.1 | 159 | 64 |
| acetone | 20.7 | 24 | 9.6 |
| ethanol | 24.5 | 20 | 8.1 |
| methanol | 32.7 | 15 | 6.1 |
| water, 25 °C | 78.4 | 6.3 | 2.5 |

Sodium chloride dissolves to 36 g per 100 g in water, but only about 1.4 g in methanol, 0.06 g in ethanol, and effectively none in acetone or hexane. The order of the solubilities follows the order of the permittivities.

### Where the number comes from
Water\'s single molecule has a dipole of 1.85 D, less than acetone\'s 2.9 D, so the large permittivity is not about one molecule\'s dipole. It is about how the molecules cooperate. In an electric field each dipole turns to line up with it; in water the hydrogen-bond network passes that alignment from molecule to molecule, so that neighbours turn together. Treating the molecules as independent dipoles (Onsager\'s model) gives a permittivity near 30; the correlation of orientations through hydrogen bonds — measured by Kirkwood\'s factor, about 2.6 for water — lifts it to 78. Ethanol and methanol, which also bond, reach 25 and 33; acetone, which cannot bond to itself, 21.

Warming scrambles the alignment, so the permittivity falls with temperature: 87.7 at 0 °C, 78.3 at 25 °C, 69.9 at 50 °C, 55.7 at 100 °C. The number is also for slow fields. The molecules take about 8 ps to reorient, so above about 20 GHz they cannot keep up; at the 2.45 GHz of a microwave oven water still follows the field but with a lag that turns the field's energy into heat.

### Three consequences
- **Screening.** In an electrolyte, ions are surrounded by a cloud of opposite charge which cuts the reach of their field to the Debye length: 0.96 nm in 0.1 mol/L NaCl, 0.4 nm in sea water.
- **The Bjerrum length** $l_B = k e^2/(\\varepsilon_r k_B T)$ is the distance at which the electric energy of two unit charges equals $k_B T$: 0.71 nm in water, 56 nm in vacuum. Ions closer than 0.7 nm feel each other; further than that, thermal motion wins.
- **The Born energy** of putting an ion of radius $a$ into a dielectric, $-\\dfrac{N_A k z^2 e^2}{2a}(1 - 1/\\varepsilon_r)$, is the hydration energy in a continuum picture. For Na⁺ it gives about −670 kJ/mol, too large: near an ion the field is so strong that the water dipoles saturate and the local permittivity drops to about 6, so the continuum overstates the benefit. The measured −400 to −440 kJ/mol is more modest.

> [!key] The dielectric constant 78.4 divides every electric force in water by 78, cutting the grip of one ion on another from 200 thermal energies to 2.5. It comes from hydrogen-bonded molecules turning together in a field, not from the size of one molecule\'s dipole, and it falls as the water warms.`,
  ideas: ['In a medium of relative permittivity $\\varepsilon_r$ every electrostatic force and energy is divided by $\\varepsilon_r$; for water at 25 °C that is 78.4.', 'Ions in a crystal hold on to each other with 492 kJ/mol in vacuum, but with only 6.3 kJ/mol (2.5 thermal energies) in water.', 'The high value comes from cooperative alignment of hydrogen-bonded dipoles, not from a large molecular dipole: acetone\'s dipole is larger and its permittivity is 21.', 'It falls on warming (87.7 at 0 °C, 55.7 at 100 °C) and near ions, where the strong field saturates the water.'],
  pitfalls: ['"Water dissolves salt because its molecules are very polar" — The molecule\'s dipole (1.85 D) is smaller than acetone\'s (2.9 D). What matters is the permittivity of the liquid, which the hydrogen-bond network raises to 78.', '"Water cuts the charge on an ion" — The ion keeps its charge. The water molecules around it turn and carry opposite charge to the near side, so the field beyond them is weaker.', '"The dielectric constant of water is the same at every frequency" — It is the slow, low-frequency value. Above about 20 GHz the molecules cannot turn fast enough and the value drops, to about 5 at terahertz frequencies and 1.8 in visible light.'],
  terms: [
    { term: 'Relative permittivity', also: ['dielectric constant', 'ε_r', 'ε'], def: 'The factor by which a material divides the electric force and energy between charges, compared with vacuum. 78.4 for water at 25 °C, 1 for vacuum, 1.9 for hexane. It has no unit.' },
    { term: 'Polarisation', also: ['dielectric polarisation'], def: 'The alignment of a material\'s molecular dipoles with an applied field. In water it is cooperative: hydrogen bonds pass the turning from molecule to molecule.' },
    { term: 'Bjerrum length', also: ['l_B'], def: 'The distance at which the electrostatic energy of two unit charges equals the thermal energy k_B T: 0.71 nm in water at 25 °C. Closer than this, ions are bound; farther, they move independently.' },
    { term: 'Debye length', also: ['screening length', 'Debye–Hückel length'], def: 'The distance beyond which the field of an ion is screened by the cloud of other ions around it: about 0.30 nm divided by the square root of the ionic strength in mol/L for a 1:1 salt in water at 25 °C.' },
    { term: 'Born energy', also: ['Born solvation energy'], def: 'The electric energy released when an ion is moved from vacuum into a dielectric of permittivity ε_r: −N_A k z²e²/(2a) times (1 − 1/ε_r) for an ion of radius a. It overestimates real hydration energies because it ignores saturation near the ion.' },
    { term: 'Kirkwood factor', also: ['correlation factor g_K'], def: 'The measure of how much hydrogen-bonded neighbours align their dipoles beyond what independent molecules would: about 2.6 for liquid water, which accounts for the difference between ε ≈ 30 and ε = 78.' }
  ],
  formulas: [
    { name: 'Force between two ions in a medium', expr: 'F = 1e9*ke*z1*z2*qe^2/(eps*r^2)', tex: 'F = \\frac{k\\,z_1 z_2\\,e^2}{\\varepsilon_r\\,r^2}',
      vars: { F: { name: 'force in nanonewtons (positive repels, negative attracts)', signed: true, tex: 'F' }, ke: { const: 'ke' }, z1: { name: 'charge of the first ion (in units of e)', value: 1, int: true, signed: true, tex: 'z_1' }, z2: { name: 'charge of the second ion (in units of e)', value: -1, int: true, signed: true, tex: 'z_2' }, qe: { const: 'qe' }, eps: { name: 'relative permittivity of the medium', value: 78.4, min: 1, max: 200, tex: '\\varepsilon_r', hint: '1 in vacuum, 1.9 hexane, 24.5 ethanol, 78.4 water at 25 °C.' }, r: { name: 'distance between the ions', q: 'length', unit: 'pm', value: 282, min: 50, hint: '282 pm is the Na⁺–Cl⁻ distance in the NaCl crystal.' } },
      solveFor: 'F', note: 'Point charges in a uniform medium. At a few ångström the surrounding water is partly saturated, so the true screening is weaker than 78-fold.',
      stories: { F: 'Two ions of charge {z1} and {z2} sit {r} apart in a medium of relative permittivity {eps}. What force acts between them, in nN?', eps: 'Two ions {r} apart attract each other with {F} nN. What is the relative permittivity of the medium between them?' } },
    { name: 'Energy of an ion pair in a medium', expr: 'E = NA*ke*z1*z2*qe^2/(eps*r)', tex: 'E = \\frac{N_A\\,k\\,z_1 z_2\\,e^2}{\\varepsilon_r\\,r}',
      vars: { E: { name: 'electrostatic energy per mole of pairs', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: 'E' }, NA: { const: 'NA' }, ke: { const: 'ke' }, z1: { name: 'charge of the first ion', value: 1, int: true, signed: true, tex: 'z_1' }, z2: { name: 'charge of the second ion', value: -1, int: true, signed: true, tex: 'z_2' }, qe: { const: 'qe' }, eps: { name: 'relative permittivity of the medium', value: 78.4, min: 1, max: 200, tex: '\\varepsilon_r' }, r: { name: 'distance between the ions', q: 'length', unit: 'pm', value: 282, min: 50, tex: 'r' } },
      solveFor: 'E', note: 'Negative energy means the pair is bound. Compare with the thermal energy $RT$ = 2.48 kJ/mol at 25 °C: a pair bound by less than about three of those comes apart readily.',
      stories: { E: 'An Na⁺ and a Cl⁻ sit {r} apart in a medium of relative permittivity {eps}. What is their interaction energy per mole of pairs?', eps: 'Two oppositely charged ions {r} apart have a pair energy of {E}. What is the permittivity of the medium?' } },
    { name: 'The Bjerrum length', expr: 'lB = ke*qe^2/(eps*kB*T)', tex: 'l_B = \\frac{k\\,e^2}{\\varepsilon_r\\,k_B\\,T}',
      vars: { lB: { name: 'Bjerrum length', q: 'length', unit: 'nm', tex: 'l_B' }, ke: { const: 'ke' }, qe: { const: 'qe' }, eps: { name: 'relative permittivity', value: 78.4, min: 1, max: 200, tex: '\\varepsilon_r' }, kB: { const: 'kB' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -50, max: 300 } },
      solveFor: 'lB', note: 'The distance at which two unit charges have an energy equal to $k_B T$. 0.71 nm in water at 25 °C; 56 nm in vacuum.',
      stories: { lB: 'In a liquid of relative permittivity {eps} at {T}, what is the Bjerrum length?' } },
    { name: 'The Born energy of an ion', expr: 'G = -NA*ke*(z*qe)^2/(2*a)*(1 - 1/eps)', tex: 'G = -\\frac{N_A\\,k\\,z^2 e^2}{2a}\\left(1 - \\frac{1}{\\varepsilon_r}\\right)',
      vars: { G: { name: 'Born solvation energy', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: 'G' }, NA: { const: 'NA' }, ke: { const: 'ke' }, z: { name: 'charge number of the ion', value: 1, int: true, tex: 'z' }, qe: { const: 'qe' }, a: { name: 'ion radius', q: 'length', unit: 'pm', value: 102, min: 20, hint: 'Crystal radius of Na⁺ is 102 pm, of Cl⁻ 181 pm. Using it overestimates the hydration energy.' }, eps: { name: 'relative permittivity', value: 78.4, min: 1, max: 200, tex: '\\varepsilon_r' } },
      solveFor: 'G', note: 'A continuum model: it overshoots the measured −400 to −440 kJ/mol for Na⁺ because the field at the ion\'s surface saturates the water.',
      stories: { G: 'An ion of charge {z} and radius {a} is moved into a liquid of relative permittivity {eps}. By the Born model, what energy is released?' } },
    { name: 'The permittivity of water against temperature', expr: 'eps = 87.74 - 0.40008*(T - T0) + 9.398e-4*(T - T0)^2 - 1.41e-6*(T - T0)^3', tex: '\\varepsilon_r = 87.74 - 0.40008\\,(T - T_0) + 9.398\\times10^{-4}(T - T_0)^2 - 1.41\\times10^{-6}(T - T_0)^3',
      vars: { eps: { name: 'relative permittivity of water', tex: '\\varepsilon_r' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 100 }, T0: { const: 'T0' } },
      solveFor: 'eps', note: 'Malmberg and Maryott\'s fit for liquid water, 0–100 °C, at low frequency.',
      stories: { eps: 'What is the relative permittivity of liquid water at {T}?', T: 'At what temperature does liquid water have a relative permittivity of {eps}?' } }
  ],
  examples: [
    { title: 'A pair of ions in a crystal and in water', q: 'Na⁺ and Cl⁻ sit 2.82 Å apart. How strong is their mutual attraction in vacuum and in water at 25 °C, and in units of $RT$?',
      steps: [{ text: 'In vacuum:', tex: 'E = \\frac{N_A k e^2}{r} = \\frac{(6.022\\times10^{23})(8.988\\times10^9)(1.602\\times10^{-19})^2}{2.82\\times10^{-10}} = 4.93\\times10^5\\ \\mathrm{J/mol}' }, { text: 'In water, divide by 78.4:', tex: 'E = 492.7/78.4 = 6.3\\ \\mathrm{kJ/mol}' }, { text: 'In thermal units, with $RT = 2.48$ kJ/mol:', tex: '6.3/2.48 = 2.5' }],
      a: '493 kJ/mol (199 RT) in vacuum, 6.3 kJ/mol (2.5 RT) in water. The pair is held by about two and a half thermal kicks: it falls apart readily.' },
    { title: 'Temperature and the permittivity', q: 'By how much does the attraction between the same two ions change when the water is heated from 25 °C to 100 °C?',
      steps: ['Permittivity: 78.3 at 25 °C and 55.7 at 100 °C.', { text: 'Pair energy is inversely proportional to it:', tex: '\\frac{E_{100}}{E_{25}} = \\frac{78.3}{55.7} = 1.41' }],
      a: 'The pair energy rises by 41 %, from 6.3 to 8.8 kJ/mol — and since $RT$ rises by 25 % over the same range, the ratio $E/RT$ goes from 2.5 to 2.8. Hot water is a slightly worse screen of charge, partly offset by the extra thermal motion.' }
  ],
  quiz: [
    { q: 'Two ions in water at 25 °C attract each other with a force that is, compared with the same ions at the same distance in vacuum,', choices: ['78 times as strong', 'the same', '78 times weaker', '$\\sqrt{78}$ times weaker'], a: 2, why: 'Coulomb\'s law in a medium divides the force by the relative permittivity: F = k q₁q₂ / (ε_r r²). Water\'s ε_r = 78.4 makes the force 78 times smaller.' },
    { q: 'Which molecule has the larger dipole moment, water or acetone?', choices: ['Water, which is why it has the larger permittivity', 'Acetone, although its permittivity is far lower', 'They are equal', 'Neither has a dipole in the liquid'], a: 1, why: 'Acetone\'s dipole is about 2.9 D, water\'s 1.85 D. Water\'s permittivity (78) is larger because hydrogen bonds make its dipoles turn together; acetone\'s molecules cannot bond to one another and align independently (ε = 21).' },
    { q: 'The permittivity of water increases when it is heated.', a: false, why: 'It falls: 87.7 at 0 °C, 78.3 at 25 °C, 55.7 at 100 °C. Thermal motion scrambles the alignment of the dipoles with the field.' },
    { q: 'What is the energy of attraction, in kJ/mol, between Na⁺ and Cl⁻ 282 pm apart in water of relative permittivity 78.4?', answer: 6.28, unit: 'kJ/mol', why: 'In vacuum k e² N_A / r = 492.7 kJ/mol; dividing by 78.4 gives 6.28 kJ/mol. The sign is negative (bound); the magnitude is about 2.5 RT.' },
    { q: 'A charged amino-acid side chain buried in the oily core of a protein, where the permittivity is about 3, is compared with the same side chain at the surface in water. Its electrostatic energy is', choices: ['much the same', 'about 25 times larger in magnitude in the core', 'about 25 times smaller in the core', 'zero in the core'], a: 1, why: 'Energies scale as 1/ε_r. In the core, ε_r ≈ 3 instead of 78, so every charge interaction is about 26 times stronger, which is why buried charges are rare and costly and why charged groups sit at the water-facing surface.' }
  ],
  applications: ['Why batteries and supercapacitors use high-permittivity solvents (ethylene carbonate, ε ≈ 90) to keep lithium salts dissociated.', 'Protein structure: charged residues face the water, where their charges are screened; the interior is oily with ε ≈ 2–4.', 'Microwave ovens and radio-frequency heating of water-rich food depend on how the permittivity lags at gigahertz frequencies.', 'Electrophoresis and capillary electrophoresis, colloid stability (the Debye length sets how close particles come), and the design of water treatment coagulation.', 'Distinguishing liquids electrically: capacitive level and moisture sensors read the permittivity of what lies between the plates.'],
  history: 'Faraday found in the 1830s that the space between the plates of a capacitor changed its capacity when filled with different insulators, and used the word dielectric on the advice of William Whewell. Debye\'s theory of polar molecules (1912) explained the temperature dependence; Onsager (1936) and Kirkwood (1939) took the correlation of neighbours into account. Born gave the continuum model of ion hydration in 1920.',
  sources: ['Malmberg and Maryott, "Dielectric constant of water from 0 to 100 °C", *Journal of Research of the National Bureau of Standards* 56, 1 (1956) — the fit used here.', 'Kirkwood, "The dielectric polarization of polar liquids", *Journal of Chemical Physics* 7, 911 (1939) — the correlation factor.', 'Israelachvili, *Intermolecular and Surface Forces*, chapters on the Born energy, the Bjerrum length and the Debye length.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water* (Oxford, 1969), chapter on the dielectric properties.'],
  sim: { id: 'sol-dissolving-crystal', params: { focus: 'dielectric' } }
},

/* ================================================================ 3 */
{
  id: 'like-dissolves-like', parent: 'the-liquid-that-pulls-salt-apart', title: 'Like dissolves like', level: 1,
  short: 'A substance dissolves in water when it can make hydrogen bonds or ion–dipole contacts as good as those it breaks; sugar, ethanol and salt qualify, oil and wax do not. The rule is an accounting of attractions, and it has an exchange rate: every extra CH₂ group in an alcohol cuts its solubility by a factor of about three.',
  keywords: ['like dissolves like', 'polar', 'non-polar', 'miscible', 'immiscible', 'hydrophilic', 'solubility', 'sugar', 'oil and water', 'partition coefficient', 'log P', 'alcohols', "Traube's rule", 'octanol'],
  prereq: ['how-salt-dissolves', 'what-a-hydrogen-bond-is'],
  related: ['the-dielectric-constant', 'the-hydrophobic-effect', 'soap-and-surfactants', 'clathrate-hydrates', 'chemistry:solubility', 'chemistry:intermolecular-forces'],
  body: `
Put in front of you a glass of water and five things to add: salt, sugar, ethanol, olive oil and candle wax. The first three disappear; the oil floats as a layer and the wax sits as lumps. The old chemist\'s rule, *like dissolves like*, sums it up: polar dissolves polar, non-polar dissolves non-polar. It is a true rule with a precise meaning, and a few instructive exceptions.

### What "like" means
Mixing is a swap of attractions. To dissolve, a molecule has to push its way between water molecules, giving up some of the roughly 20 kJ/mol hydrogen bonds each of them holds ([[what-a-hydrogen-bond-is]]), and in return it makes new attractions with the water around it. If it can make bonds as good as those it broke, the swap is free and entropy does the rest. If it can only offer the weak London forces of a hydrocarbon (a few kJ/mol), the water loses more than it gains and the two liquids stay apart.

- **Sugar** (sucrose, C₁₂H₂₂O₁₁) carries eight OH groups, every one a hydrogen-bond donor and acceptor: 200 g dissolve in 100 g of water at 20 °C.
- **Ethanol** mixes with water in all proportions; its OH joins the network. (A curiosity: 50 mL of ethanol and 50 mL of water make only about 96 mL, because the ethanol molecules fit into the network.)
- **Salt** dissolves because the water can hydrate the ions ([[how-salt-dissolves]]).
- **Hexane, olive oil, paraffin wax** are chains of CH₂ with only dispersion forces. Hexane dissolves to about one part in 100,000.

| Solute | What it can offer water | Solubility in water, g per 100 g, 20–25 °C |
|---|---|---|
| glycerol, ethanol, acetone | OH or C=O: hydrogen bonds | miscible |
| sucrose | eight OH groups | 200 |
| table salt | ions, hydration shells | 36 |
| 1-butanol | one OH, four carbons | 7.4 |
| diethyl ether | one oxygen, four carbons | 6.9 |
| 1-octanol | one OH, eight carbons | 0.054 |
| benzene | no bonding group | 0.18 |
| iodine | non-polar, large | 0.03 |
| hexane | non-polar | 0.001 |
| paraffin wax | non-polar | practically 0 |

### The exchange rate for oil
Walk down the alcohols: methanol, ethanol and propanol mix with water without limit. 1-butanol dissolves to 7.4 g per 100 g, pentanol to 2.2, hexanol to 0.58, heptanol to 0.17, octanol to 0.054. Each CH₂ divides the solubility by about 3.3, which corresponds to a free-energy cost of $RT\\ln 3.3 \\approx 3$ kJ/mol per carbon (Traube\'s rule, 1891). One OH group can pull about three carbons into solution; beyond that the tail wins. Molecules with a polar head and a long non-polar tail, such as soap, sit between the two worlds ([[soap-and-surfactants]]).

### Octanol and water as a ruler
Chemists measure the balance by shaking a compound between water and 1-octanol and comparing the two concentrations: the partition coefficient $P = C_\\text{oct}/C_\\text{water}$, quoted as $\\log P$. Sugar has $\\log P \\approx -3.7$, caffeine −0.07, benzene +2.1, hexane +3.9. A drug with $\\log P$ near 2 can cross the oily membranes of the cell and still travel in the blood; this single number is a first filter in drug design.

### Where the rule bends
- **Size and shape.** A large molecule with a few polar groups may not be able to hide its oily part: cholesterol, with one OH and 27 carbons, is insoluble.
- **Ionic is not always soluble.** Silver chloride, calcium carbonate and barium sulfate are ionic but nearly insoluble; their lattice enthalpies are too large for the hydration to repay ([[how-salt-dissolves]]). "Ionic dissolves in water" is only a tendency.
- **Polar without hydrogen bonds** can go either way: acetone mixes, diethyl ether only partly.
- **Temperature.** Mixing is a matter of free energy, so a pair that separates when cooled (phenol and water below 66 °C) can mix when warmed.

The hydrogen-bond view also shows that the oil\'s refusal is not a repulsion at all: it is the water that is unwilling, for reasons of entropy ([[the-hydrophobic-effect]]).

> [!key] Like dissolves like because dissolving swaps attractions: a molecule enters water only if it can bond to water about as strongly as water bonds to itself. One OH group will carry about three carbons into solution, and each carbon beyond that costs a factor of three in solubility.`,
  ideas: ['A solute dissolves in water if the bonds it makes with water repay the water–water bonds it breaks; hydrogen-bonding and charged solutes do, hydrocarbons do not.', 'Sugar (eight OH groups) dissolves to 200 g per 100 g, ethanol mixes completely, hexane hardly at all.', 'In a series of alcohols each extra CH₂ lowers the solubility about 3.3-fold — about 3 kJ/mol per carbon.', 'The octanol–water partition coefficient is the chemist\'s ruler of this balance and a first screen for drugs.'],
  pitfalls: ['"Oil and water repel each other" — The attraction between oil and water molecules is weak but not negative; oil stays out because water would lose its own hydrogen bonds and, more importantly, entropy ([[the-hydrophobic-effect]]).', '"Anything with a polar bond dissolves in water" — Polarity is necessary but not enough. A polar group has to be able to bond to water, and one group can only carry a few carbons.', '"Soluble means it dissolves a lot" — Soluble is a matter of degree. Table salt is far less soluble in water than sugar, and ethanol is not soluble but miscible: it mixes at every ratio.'],
  terms: [
    { term: 'Miscible', also: ['miscibility'], def: 'Two liquids are miscible if they mix in all proportions to give a single phase: ethanol and water are, hexane and water are not.' },
    { term: 'Hydrophilic', also: ['water-loving', 'polar'], def: 'Describes a molecule or surface that can bond to water, through charges or hydrogen-bonding groups such as OH, NH₂ or C=O, and so dissolves or wets readily.' },
    { term: 'Amphiphile', also: ['amphiphilic', 'surfactant'], def: 'A molecule with a hydrophilic head and a hydrophobic tail, such as soap or a phospholipid. It collects at the boundary between water and oil or air.' },
    { term: 'Partition coefficient', also: ['log P', 'K_ow', 'octanol–water coefficient'], def: 'The ratio of the concentrations of a compound in 1-octanol and water at equilibrium, P = C_oct / C_water, usually quoted as log P. It measures lipophilicity: log P is −3.7 for sugar and +3.9 for hexane.' },
    { term: 'Traube\'s rule', also: ['homologous series rule'], def: 'In a series of compounds differing by CH₂, the solubility in water falls by a roughly constant factor, about 3 for alcohols, per carbon added; equivalently each CH₂ costs about 3 kJ/mol of free energy.' }
  ],
  formulas: [
    { name: 'The partition coefficient', expr: 'logP = log(Co/Cw)', tex: '{\\log P}_{\\text{o/w}} = \\log_{10}\\frac{C_\\mathrm{oct}}{C_\\mathrm{wat}}',
      vars: { logP: { name: 'log P (octanol/water)', tex: '{\\log P}_{\\text{o/w}}', signed: true, hint: 'Positive: prefers oil. Negative: prefers water. Zero: even.' }, Co: { name: 'concentration in octanol', q: 'concentration', unit: 'mM', value: 134, tex: 'C_\\mathrm{oct}' }, Cw: { name: 'concentration in water', q: 'concentration', unit: 'mM', value: 1, tex: 'C_\\mathrm{wat}' } },
      solveFor: 'logP', note: 'The two concentrations are measured after the compound has shaken to balance between the two layers. The example values give benzene\'s 2.13.',
      stories: { logP: 'A compound is found at {Co} in the octanol layer and {Cw} in the water layer. What is its log P?', Co: 'A compound with log P of {logP} is at {Cw} in water. What concentration is in the octanol?' } },
    { name: 'The free energy of moving a solute from water to oil', expr: 'dG = -R*T*ln(Co/Cw)', tex: '\\Delta G_{w\\to o} = -RT\\,\\ln\\frac{C_\\mathrm{oct}}{C_\\mathrm{wat}}',
      vars: { dG: { name: 'free energy of transfer from water to octanol', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G_{w\\to o}', hint: 'Negative if the solute prefers octanol.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -20, max: 100 }, Co: { name: 'concentration in octanol', q: 'concentration', unit: 'mM', value: 134, tex: 'C_\\mathrm{oct}' }, Cw: { name: 'concentration in water', q: 'concentration', unit: 'mM', value: 1, tex: 'C_\\mathrm{wat}' } },
      solveFor: 'dG', note: 'Each factor of ten in P is $RT\\ln 10$ = 5.7 kJ/mol at 25 °C.',
      stories: { dG: 'A solute is at {Co} in octanol and {Cw} in water at {T}. What is the free energy of moving it from water to octanol?' } },
    { name: 'Traube\'s rule for a series of alcohols', expr: 'S = S0*exp(-(n - n0)*gc/(R*T))', tex: 'S = S_0\\exp\\left[-\\frac{(n - n_0)\\,g_c}{RT}\\right]',
      vars: { S: { name: 'solubility of the alcohol with n carbons', q: 'ratio', unit: '%', hint: 'Grams per 100 g of water, written as a percentage.' }, S0: { name: 'solubility of the reference alcohol', q: 'ratio', unit: '%', value: 7.4, tex: 'S_0', hint: '1-butanol, with four carbons: 7.4 g per 100 g of water.' }, n: { name: 'carbons in the alcohol', value: 8, int: true, min: 1, max: 20 }, n0: { name: 'carbons in the reference alcohol', value: 4, int: true, fixed: true, tex: 'n_0' }, gc: { name: 'free energy cost per CH₂', q: 'molarenergy', unit: 'kJ/mol', value: 3.0, tex: 'g_c', hint: 'About 3 kJ/mol per carbon, a factor of 3.3 in solubility at 25 °C.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 60 } },
      solveFor: 'S', note: 'Holds for straight-chain 1-alcohols from butanol upwards; shorter ones are miscible with water. For n = 8 it gives 0.058 g per 100 g against 0.054 measured.',
      stories: { S: 'A straight-chain alcohol with {n} carbons loses {gc} for every carbon beyond four, starting from butanol\'s {S0}. What is its solubility?', n: 'An alcohol has a solubility of {S} when butanol has {S0}. How many carbons has it?' } }
  ],
  examples: [
    { title: 'Where does the series stop being soluble?', q: 'Use Traube\'s rule to estimate the solubility of 1-decanol in water, starting from octanol (0.054 g per 100 g) and taking 3 kJ/mol per carbon.',
      steps: [{ text: 'Factor per CH₂ at 25 °C:', tex: 'e^{3000/2479} = 3.35' }, { text: 'Two more carbons:', tex: 'S = \\frac{0.054}{3.35^2} = 0.0048\\ \\mathrm{g}/100\\ \\mathrm{g}' }],
      a: 'About 0.005 g per 100 g (50 mg/L). The measured value for decanol is about 0.004; the rule works well along a whole homologous series.' },
    { title: 'Why dish soap works', q: 'A greasy plate is rinsed in water at 40 °C and stays greasy. Adding washing-up liquid cleans it. Explain in terms of the rule.',
      steps: ['The grease is a long-chain hydrocarbon or triglyceride: it offers water only weak dispersion forces and stays out.', 'Washing-up liquid contains molecules with a charged head (sulfate or sulfonate) and a 12-carbon tail. The tails dissolve into the grease, the heads face the water.', 'The grease breaks into droplets, each wearing a coat of heads — in effect a droplet with a surface the water can bond to — and is rinsed away.'],
      a: 'The surfactant turns a non-polar droplet into one with a polar outside: it makes oil "like" water at its surface.' }
  ],
  quiz: [
    { q: 'Which of these is miscible with water in all proportions?', choices: ['Hexane', 'Ethanol', 'Olive oil', '1-Octanol'], a: 1, why: 'Ethanol\'s OH makes hydrogen bonds with water as good as water\'s own. Octanol has the same OH but an eight-carbon tail, which brings its solubility down to 0.05 g per 100 g.' },
    { q: 'In the alcohol series from butanol (7.4 g/100 g) to octanol (0.054 g/100 g), each added CH₂ lowers the solubility by roughly', choices: ['10 %', 'a factor of 3', 'a factor of 100', 'it does not change'], a: 1, why: '7.4 → 2.2 → 0.58 → 0.17 → 0.054: a factor of about 3.3 each step. This is Traube\'s rule, equivalent to about 3 kJ/mol per CH₂.' },
    { q: 'Every ionic compound dissolves in water because water is polar.', a: false, why: 'Silver chloride, barium sulfate and calcium carbonate are ionic and nearly insoluble: their lattice enthalpies are too large for hydration to repay. The rule is a tendency, not a law.' },
    { q: 'The free energy cost per CH₂ is 3.0 kJ/mol at 25 °C. By what factor does solubility fall per added carbon?', answer: 3.36, why: 'exp(3000 / 2479) = 3.36, matching the observed factor of 3.3 along the alcohol series.' },
    { q: 'A drug has log P = 3 between octanol and water. Compared with a compound of log P = 0, it', choices: ['prefers water 1,000-fold more', 'prefers the oily phase 1,000-fold more', 'is 3 times more soluble in water', 'is equally distributed'], a: 1, why: 'log P = 3 means C_oct/C_water = 1,000. It will cross cell membranes readily but dissolve poorly in blood and urine.' }
  ],
  applications: ['Dry cleaning, paint thinners and nail-polish remover are non-polar or semi-polar solvents chosen to dissolve what water cannot.', 'Drug design: log P and polar surface area decide whether a molecule is absorbed, reaches the brain or is excreted.', 'Solvent extraction: caffeine is pulled out of coffee beans with supercritical CO₂ or ethyl acetate, vanilla with ethanol, essential oils with hexane.', 'Detergents, shampoos and emulsifiers (the lecithin in mayonnaise) all rely on molecules with a head from each world.', 'Reversed-phase chromatography separates compounds by how strongly they prefer an oily column to a watery liquid.'],
  history: 'The rule is old — alchemists wrote *similia similibus solvuntur* — but its modern content came with Traube\'s 1891 observation of the constant factor per CH₂ in the surface activity and solubility of alcohols, and with Hansch\'s introduction of octanol–water partition coefficients as a measure of biological activity in the 1960s.',
  sources: ['CRC *Handbook of Chemistry and Physics*: solubilities of organic compounds in water, octanol–water partition coefficients.', 'Tanford, *The Hydrophobic Effect: Formation of Micelles and Biological Membranes* (Wiley, 2nd ed. 1980): free energy per CH₂ group.', 'Hansch and Leo, *Exploring QSAR: Fundamentals and Applications in Chemistry and Biology* (ACS, 1995): log P values.', 'Franks (ed.), *Water: A Comprehensive Treatise*, vol. 4, on aqueous solutions of simple non-electrolytes.'],
  sim: 'sol-like-dissolves'
},

/* ================================================================ 4 */
{
  id: 'the-hydrophobic-effect', parent: 'the-liquid-that-pulls-salt-apart', title: 'The hydrophobic effect', level: 2,
  short: 'Oil does not fear water and is not pushed away by it. Water pays an entropy price for every oily surface it must wrap, so oily molecules are pushed together to shrink the surface: about 0.1 kJ/mol for every square ångström, or 3–4 kJ/mol for each CH₂ group, and enough to fold proteins and build cell membranes.',
  keywords: ['hydrophobic effect', 'hydrophobic', 'oil and water', 'entropy', 'iceberg model', 'Frank and Evans', 'surface area', 'hydrophobic interaction', 'micelle', 'protein folding', 'dewetting', 'Chandler', 'Tanford'],
  prereq: ['like-dissolves-like', 'what-a-hydrogen-bond-is', 'the-tetrahedral-network'],
  related: ['the-hydrophobic-effect-folds-proteins', 'membranes-assemble-themselves', 'hydration-shells-and-proteins', 'surface-tension', 'soap-and-surfactants', 'clathrate-hydrates', 'chemistry:intermolecular-forces', 'biology:membrane-structure'],
  body: `
Shake a jar of oil and water and the oil breaks into drops; leave it and the drops find each other and merge into a layer. Pour olive oil into soup and the beads of fat run together on the surface. It looks like a repulsion — the oil seems to shun the water and cling to itself. It is not. Two oil molecules attract each other weakly (a few kJ/mol of dispersion force) and attract water about as weakly. What drives them together is water\'s own preference, and the currency it pays in is entropy.

### The price of making room
A solute has to be surrounded by water. A polar one is welcome: water bonds to it. A non-polar one offers nothing to bond with, so the water molecules next to it must make do with their remaining neighbours and arrange themselves so as to lose as few hydrogen bonds as possible. That costs freedom: fewer orientations are open to a molecule that must keep its hydrogens tangent to a wall. The free energy cost is shown by the experiment. Moving ethane from liquid hydrocarbon into water costs about **+16 kJ/mol** at 25 °C; each further CH₂ adds 3–4 kJ/mol. For small alkanes the enthalpy is near zero or slightly negative, and the whole cost is the $-T\\Delta S$ term, +20 to +30 kJ/mol. That is why it is called an *effect* and not a force: it is the free energy of the water, not an attraction between the oil molecules.

### Surface is the currency
Because the cost falls on the water in contact with the solute, it grows with the **surface area** exposed:

$$\\Delta G \\approx \\gamma\\,A$$

with $\\gamma \\approx 25$ cal/(mol·Å²) ≈ 100 J/(mol·Å²) ≈ 17 mN/m for small solutes (Chothia, 1974), rising towards the macroscopic oil–water interfacial tension of 50 mN/m (about 300 J/(mol·Å²)) for large drops. Ethane\'s 1.6 nm² of exposed surface thus costs 16 kJ/mol. Merge two spheres of equal size and the surface falls by 21 %; merge eight into one and it halves. The pull towards a single drop is a bill that gets smaller as the surface shrinks.

### The iceberg that was not there
In 1945 Henry Frank and Marjorie Evans noticed that the entropy of dissolving non-polar gases was large and negative and proposed that water forms an ordered, ice-like cage — an "iceberg" — around the solute. The picture stuck for fifty years. Simulations and scattering experiments since the 1990s tell a subtler story. Around a **small** solute (smaller than about 1 nm: methane, ethane, one side chain) water keeps nearly all its hydrogen bonds by tilting a little around it; there is no frozen cage, only a modest loss of orientations and the cost of making a cavity. Around a **large** surface (larger than about a nanometre, such as a big oil drop or the face of a folded protein) water cannot bend round and ends up with dangling hydrogen bonds at the interface, an enthalpic cost, and a thin, vapour-like layer forms (Lum, Chandler and Weeks, 1999; Chandler, 2005). The crossover is why the free energy per area (17 mN/m) climbs for larger drops.

### Temperature
Because the dominant term is entropic, the hydrophobic effect does not melt away in hot water. Between 0 and about 100 °C it gets *stronger* as the temperature rises, and the entropy of transfer of hydrocarbons passes through zero only near 110 °C (Baldwin, 1986). Cooler water is the weaker glue, which is why many proteins unfold in the cold ("cold denaturation") as well as in the heat.

### What it builds
- **Micelles and bilayers.** A soap or phospholipid molecule has an oily tail and a water-loving head ([[like-dissolves-like]]); in water the tails herd together and the heads face out. Sodium dodecyl sulfate forms micelles above 8 mmol/L; phospholipids with two long tails form bilayers at concentrations around $10^{-10}$ mol/L ([[membranes-assemble-themselves]]).
- **Folded proteins.** An enzyme collapses so that its oily side chains lie in a core, away from water, and its polar ones lie outside ([[the-hydrophobic-effect-folds-proteins]]).
- **Binding.** A drug fits an oily pocket in its target partly because that frees the water that had been forced to wrap the drug and the pocket.

> [!key] The hydrophobic effect is not oil repelling water but water economising: it pays an entropy cost (≈ 0.1 kJ/mol per Å²) for every non-polar surface it must wrap, so non-polar things are squeezed together. That entropic bill, not any bond, folds proteins, closes membranes and beads the oil on soup.`,
  ideas: ['Oil and water do not repel; water loses freedom of orientation (entropy) around non-polar surfaces, and non-polar things are pushed together to shrink that surface.', 'The cost scales with exposed area: about 25 cal/(mol·Å²) (17 mN/m) for small solutes, up to 50 mN/m for large drops; roughly 3–4 kJ/mol per CH₂.', 'The "iceberg" cage of Frank and Evans is not found around small solutes; around large surfaces water cannot keep its bonds and dewets.', 'The effect is entropic, so it strengthens on warming up to about 100 °C; it builds micelles, membranes and protein cores.'],
  pitfalls: ['"Hydrophobic means water-fearing, so there is a repulsion" — There is no repulsive force. The effective attraction between oily groups is a property of the water, and it disappears if the water is replaced by a liquid with no hydrogen-bond network.', '"Water forms an ice-like cage around every oily molecule" — That was the 1945 iceberg picture; neutron scattering and simulation find that water around small non-polar molecules is hardly more ordered than bulk water.', '"The hydrophobic effect is the same as hydrogen bonding in the protein" — It acts alongside hydrogen bonds and charge pairs. It is the reason the protein collapses; the bonds then fix what the collapse brings together.'],
  terms: [
    { term: 'Hydrophobic effect', also: ['hydrophobic interaction', 'hydrophobic force'], def: 'The tendency of non-polar substances to aggregate in water, driven by the free energy water pays to accommodate their surfaces; at 25 °C mostly entropic, about 17–50 mN/m of exposed surface.' },
    { term: 'Hydrophobic hydration', also: ['hydrophobic solvation'], def: 'The structure of water around a non-polar solute: for small solutes the molecules rearrange to keep their hydrogen bonds; for large ones hydrogen bonds are lost and the water is depleted at the surface.' },
    { term: 'Iceberg model', also: ['Frank–Evans iceberg', 'flickering cluster picture'], def: 'The 1945 proposal that water forms an ice-like ordered cage around a non-polar solute, accounting for its large negative entropy of solution. Not borne out for small solutes.' },
    { term: 'Solvent-accessible surface area', also: ['SASA', 'accessible surface'], def: 'The area traced by the centre of a water-sized sphere rolled over a molecule\'s surface. The hydrophobic free energy is roughly proportional to it.' },
    { term: 'Critical micelle concentration', also: ['CMC'], def: 'The concentration above which surfactant molecules assemble into micelles; 8 mmol/L for sodium dodecyl sulfate in water at 25 °C.' },
    { term: 'Dewetting', also: ['drying transition'], def: 'The expulsion of water from a gap between two large hydrophobic surfaces when they are closer than about a nanometre; a vapour-like cavity forms and pulls the surfaces together.' }
  ],
  formulas: [
    { name: 'Hydrophobic free energy of an exposed surface', expr: 'G = gamma*A*NA', tex: 'G = \\gamma\\,A\\,N_A',
      vars: { G: { name: 'free energy cost per mole of solute', q: 'molarenergy', unit: 'kJ/mol', tex: 'G' }, gamma: { name: 'effective surface tension of the hydrophobic surface', q: 'surfacetension', unit: 'mN/m', value: 16.6, tex: '\\gamma', hint: '16.6 mN/m (= 25 cal/mol/Å²) for a small solute; up to 50 mN/m for a large oil drop.' }, A: { name: 'exposed (accessible) surface area', q: 'area', unit: 'nm²', value: 1.6, hint: 'About 1.6 nm² for ethane, 2.0 for propane, 3.3 for hexane.' }, NA: { const: 'NA' } },
      solveFor: 'G', note: 'A rough rule. For ethane it returns 16 kJ/mol, matching the transfer from liquid hydrocarbon to water; for large drops use the interfacial tension, 50 mN/m.',
      stories: { G: 'A non-polar solute exposes {A} of surface to water at an effective {gamma}. What does it cost per mole?', A: 'A solute costs {G} per mole at an effective {gamma}. How much surface does it expose?' } },
    { name: 'Energy released when droplets merge', expr: 'dG = gamma*NA*4*pi*r^2*(n - n^(2/3))', tex: '\\Delta G = \\gamma\\,N_A\\,4\\pi r^2\\left(n - n^{2/3}\\right)',
      vars: { dG: { name: 'free energy released when n drops become one (per mole of mergers)', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta G' }, gamma: { name: 'interfacial tension', q: 'surfacetension', unit: 'mN/m', value: 50, tex: '\\gamma', hint: 'About 50 mN/m for hexane–water and for most oil–water interfaces.' }, NA: { const: 'NA' }, r: { name: 'radius of each drop', q: 'length', unit: 'nm', value: 2 }, n: { name: 'number of drops that merge', value: 8, int: true, min: 1, max: 1000 } },
      solveFor: 'dG', note: 'Equal spheres, total volume conserved: n drops of radius $r$ become one of radius $r\\,n^{1/3}$. Per single merger multiply by $1/N_A$; here the energy is for one mole of such mergers.',
      stories: { dG: '{n} oil drops of radius {r} coalesce into one under an interfacial tension of {gamma}. What free energy is released, per mole of such events?' } },
    { name: 'Surface that remains after merging', expr: 'f = n^(-1/3)', tex: 'f_A = n^{-1/3}',
      vars: { f: { name: 'area of the merged drop as a fraction of the total before', q: 'ratio', unit: '%', tex: 'f_A' }, n: { name: 'number of equal drops merged', value: 8, int: true, min: 1, max: 100000 } },
      solveFor: 'f', note: 'Because area grows as $r^2$ and volume as $r^3$. Two drops: 79 %. Eight: 50 %. A thousand: 10 %.',
      stories: { f: '{n} equal oil drops merge into one. What fraction of their original surface does it have?', n: 'Merging equal drops into one leaves {f} of the original surface. How many drops were there?' } }
  ],
  examples: [
    { title: 'Why a CH₂ costs 3–4 kJ/mol', q: 'A CH₂ group on an alkane chain exposes roughly 0.3 nm² of surface to water. What cost per carbon does the surface-area rule give, at 17 mN/m?',
      steps: [{ text: 'Cost of 0.3 nm²:', tex: 'G = (16.6\\times10^{-3})(0.3\\times10^{-18})(6.022\\times10^{23}) = 3.0\\ \\mathrm{kJ/mol}' }],
      a: 'About 3 kJ/mol per carbon, which matches the 3–3.7 kJ/mol measured for the solubilities of hydrocarbons and alcohols. A chain of eight carbons has 24 kJ/mol to pay — 10 thermal energies — and is almost insoluble.' },
    { title: 'Eight drops become one', q: 'Eight oil drops of radius 2 nm merge into one. How much interfacial energy is released, and how does it compare with the thermal energy at 25 °C?',
      steps: ['Area of one drop: $4\\pi(2\\ \\mathrm{nm})^2 = 50.3$ nm²; eight drops: 402 nm².', 'The merged drop has radius $2 \\times 8^{1/3} = 4$ nm and area 201 nm²: half.', { text: 'Energy released at 50 mN/m:', tex: 'E = (50\\times10^{-3})(201\\times10^{-18}) = 1.0\\times10^{-17}\\ \\mathrm{J}' }, 'Thermal energy $k_B T = 4.1\\times10^{-21}$ J, so $E/k_BT \\approx 2{,}400$.'],
      a: 'About 10⁻¹⁷ J, 2,400 thermal energies. Once merged, the drops will not separate again on their own.' }
  ],
  quiz: [
    { q: 'The best description of the hydrophobic effect is', choices: ['a repulsive force between oil and water molecules', 'an attraction between oil molecules stronger than water-oil attraction', 'a free-energy cost to the water around a non-polar surface, mostly entropic at room temperature', 'the freezing of water around oily molecules'], a: 2, why: 'There is no new force. Wrapping a non-polar surface costs water entropy (and, for large surfaces, hydrogen bonds), so non-polar things are pushed together to expose less area. The "freezing" picture is the discarded iceberg model.' },
    { q: 'Heating water from 20 °C to 60 °C makes the hydrophobic attraction between oil drops weaker.', a: false, why: 'The effect is mainly entropic, so it grows with the temperature in this range and the entropy term vanishes only around 110 °C. Hot soup does not stop its fat from beading.' },
    { q: 'Two equal spherical drops merge into one of the same total volume. The area of the surface falls by about', choices: ['10 %', '21 %', '50 %', '75 %'], a: 1, why: 'The merged radius is 2^(1/3) r, so the area is 2^(2/3) × 4πr² = 1.59 × 4πr², against 2 × 4πr² before: a fall of 1 − 0.794 = 21 %.' },
    { q: 'A small hydrocarbon exposes 3.0 nm² of surface to water. At 16.6 mN/m, how much does that cost in kJ/mol?', answer: 30, unit: 'kJ/mol', why: '16.6×10⁻³ N/m × 3.0×10⁻¹⁸ m² × 6.022×10²³ mol⁻¹ = 30.0 kJ/mol.' },
    { q: 'According to modern simulations, water around a small non-polar solute (about 0.5 nm across)', choices: ['freezes into a solid ice-like cage', 'rearranges and keeps almost all its hydrogen bonds, with a modest loss of orientations', 'loses all its hydrogen bonds', 'is expelled completely, leaving a vacuum'], a: 1, why: 'For solutes smaller than about a nanometre the water bends around and keeps its bonds. Large surfaces are different: water cannot bend and a vapour-like layer forms.' }
  ],
  applications: ['Protein folding: nearly every globular protein has an oily core and a polar surface, assembled by the hydrophobic effect ([[the-hydrophobic-effect-folds-proteins]]).', 'Cell membranes, micelles and the lipid droplets in cells assemble without any machinery ([[membranes-assemble-themselves]]).', 'Soaps, shampoos and detergents work because their tails are driven out of water into grease and their heads stay in it.', 'Reversed-phase chromatography and hydrophobic-interaction chromatography separate molecules by the strength of this effect.', 'Drug binding: part of the free energy of binding of many drugs is the release of water from oily pockets.'],
  history: 'Frank and Evans proposed the iceberg picture in 1945. Walter Kauzmann argued in 1959 that the hydrophobic interaction is a main force of protein folding, and Charles Tanford\'s monograph *The Hydrophobic Effect* (1973) put numbers on it through the solubility of hydrocarbons. David Chandler and colleagues gave the size-dependent picture in 1999–2005.',
  sources: ['Tanford, *The Hydrophobic Effect: Formation of Micelles and Biological Membranes* (Wiley, 2nd ed. 1980).', 'Frank and Evans, "Free volume and entropy in condensed systems III", *Journal of Chemical Physics* 13, 507 (1945) — the iceberg proposal.', 'Chandler, "Interfaces and the driving force of hydrophobic assembly", *Nature* 437, 640 (2005).', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — hydrophobic effects in folding and assembly.'],
  sim: 'sol-hydrophobic'
},

/* ================================================================ 5 */
{
  id: 'gases-in-water', parent: 'the-liquid-that-pulls-salt-apart', title: 'Gases in water', level: 1,
  short: 'A gas dissolves in water in proportion to its pressure (Henry\'s law): about 8.4 mg of oxygen per litre from air at 25 °C, 14.6 at 0 °C. Warm water holds less, so ponds suffocate in summer, soda goes flat in the sun and the ocean is losing oxygen as it warms.',
  keywords: ['Henry\'s law', 'dissolved oxygen', 'carbon dioxide', 'carbonation', 'solubility of gases', 'fizz', 'bends', 'decompression sickness', 'fish kill', 'ocean oxygen', 'supersaturation', 'hypoxia'],
  prereq: ['like-dissolves-like', 'the-hydrophobic-effect', 'chemistry:gas-laws'],
  related: ['colligative-properties', 'the-salt-of-the-sea', 'transpiration-pull', 'water-treatment', 'chemistry:henrys-law', 'chemistry:le-chatelier', 'biology:climate-ecosystems', 'medicine:blood'],
  body: `
Open a bottle of fizzy water and the sound is a pressure of about three atmospheres of carbon dioxide being let go; the stream of bubbles that follows is the gas that was dissolved in the liquid at that pressure and now cannot stay. Opposite phenomena in a warm pond: fish gather at the surface gulping, because the water cannot hold enough oxygen. Both obey one law.

### Henry\'s law
At a fixed temperature, the concentration of a dissolved gas is proportional to the pressure of that gas above the liquid: $c = k_H\\,p$. William Henry found it in 1803. The constant $k_H$ is the gas\'s solubility. At 25 °C:

| Gas | $k_H$, mol/(L·atm) | Dissolved from the air (or from pure gas for CO₂) |
|---|---|---|
| nitrogen | 6.5 × 10⁻⁴ | 0.51 mmol/L at 0.78 atm |
| oxygen | 1.3 × 10⁻³ | 0.26 mmol/L at 0.21 atm: **8.4 mg/L** |
| argon | 1.4 × 10⁻³ | |
| carbon dioxide | 3.4 × 10⁻² | 0.10 mol/L at 3 atm: 4.5 g/L |
| ammonia | 61 | reacts with water as well |

Oxygen is twice as soluble as nitrogen, so the air dissolved in water is 35 % oxygen, not 21 %. Carbon dioxide is 26 times more soluble than oxygen (a larger, polarisable molecule that also reacts a little with water to form carbonic acid). Henry\'s law holds for dilute solutions of gases that do not react strongly; for ammonia, hydrogen chloride and sulfur dioxide the apparent constants are huge because they ionise.

### Why warm water holds less
Dissolving a gas in water is exothermic: oxygen gives out about 14 kJ/mol, carbon dioxide about 20 kJ/mol, nitrogen 11 (the gas gains attraction to water but the water pays the hydrophobic cost of making room, [[the-hydrophobic-effect]]). By Le Chatelier\'s principle, heating pushes the balance towards the gas. The solubility of oxygen from air at 1 atm falls by half between 0 °C and 30 °C:

| Temperature | 0 °C | 10 °C | 20 °C | 25 °C | 30 °C | 35 °C |
|---|---|---|---|---|---|---|
| dissolved O₂ from air, mg/L (fresh water) | 14.6 | 11.6 | 9.4 | 8.4 | 7.6 | 6.8 |

Measured tables run a few per cent lower in the middle (9.1 mg/L at 20 °C); the trend is what matters. Salt lowers it further: sea water at 35 g/kg holds about 18 % less.

### Why it matters
- **Fish need about 5 mg/L or more.** Trout stress below 6 mg/L; below 2 mg/L the water is hypoxic and fish leave or die. A summer pond at 30 °C starts from 7.6 mg/L, and the bacteria that feed on organic matter use up the oxygen faster at a higher temperature: a double blow.
- **Air is a richer source than water.** A litre of air holds about 280 mg of oxygen, 33 times as much as a litre of water at 25 °C, and oxygen diffuses 10,000 times more slowly in water than in air ($2\\times10^{-9}$ against $2\\times10^{-5}$ m²/s). A fish must pass a lot of water across its gills; hence the gill\'s huge area and the fish\'s constant motion.
- **The ocean is losing oxygen.** Records from 1960 to 2010 show a decline of more than 2 % in the oxygen content of the ocean (Schmidtko, Stramma and Visbeck, 2017). Warming reduces solubility directly, and also makes the surface lighter so that it mixes less with the deep.
- **Carbonation.** Soft drinks hold 3–4 "volumes" of CO₂ (3–4 litres of gas, at standard conditions, per litre of drink) at 2–4 atm; colder drinks hold more at the same pressure (0.18 mol/L at 5 °C and 3 atm against 0.10 at 25 °C). On opening, the pressure falls from 3 atm to the 0.0004 atm of carbon dioxide in air; the drink is supersaturated about 7,000-fold and bubbles grow wherever there is a nucleus — a scratch, a speck, a fibre in a glass that was dried with a cloth.
- **The bends.** A diver at 30 m breathes air at 4 atm; the nitrogen pressure is 3.1 atm and the tissues dissolve four times as much nitrogen as at the surface (fat holds about five times as much as water). Ascend too fast and the gas comes out as bubbles in joints and blood vessels. Haldane found in 1908 that tissues tolerate about a 2:1 ratio of dissolved to ambient pressure; all decompression tables are built on that idea.

> [!key] Henry\'s law: the dissolved gas is proportional to its pressure, and dissolving gives out heat, so warmer water holds less — half as much oxygen at 30 °C as at 0 °C. Fizzy drinks, summer fish kills, the bends and ocean deoxygenation are the same law.`,
  ideas: ['Henry\'s law: the concentration of a dissolved gas is proportional to its partial pressure, $c = k_H p$.', 'Gas solubility falls as water warms because dissolving releases heat: oxygen from air drops from 14.6 mg/L at 0 °C to 7.6 at 30 °C.', 'Carbon dioxide is 26 times more soluble than oxygen, which makes carbonation possible; the pressure of the drink is 2–4 atm.', 'Water is a poor oxygen reservoir compared with air, so aquatic life is at the mercy of temperature and mixing; divers meet the opposite problem when the pressure falls.'],
  pitfalls: ['"Warm water holds less gas because the molecules move faster and escape" — That is the intuition, but the quantitative reason is thermodynamic: dissolving gas releases heat, so heating favours the gas phase (Le Chatelier).', '"Fizz is carbon dioxide being made when you open the bottle" — The gas was already dissolved under pressure. Opening the bottle lowers the pressure above the liquid and the gas has to come out.', '"Fish suffocate in warm water because it has no oxygen" — It has less (about half at 30 °C), but also the fish\'s own demand rises with temperature, and the bacteria in the water use more.'],
  terms: [
    { term: 'Henry\'s law', also: ['Henry law', 'gas solubility law'], def: 'The concentration of a dissolved gas is proportional to its partial pressure above the solution at fixed temperature, c = k_H p. Stated by William Henry in 1803.' },
    { term: 'Dissolved oxygen', also: ['DO'], def: 'The oxygen dissolved in water, in mg/L. Water in balance with air at 25 °C holds 8.4 mg/L (14.6 mg/L at 0 °C); fish need at least about 5.' },
    { term: 'Supersaturation', also: ['supersaturated'], def: 'A state in which a solution holds more dissolved gas than it would at equilibrium. It is metastable: bubbles grow at nuclei such as scratches or dust.' },
    { term: 'Volumes of CO₂', also: ['carbonation level', 'vol. of CO₂'], def: 'The carbonation of a drink: the volume of CO₂ gas (at 0 °C and 1 atm) dissolved in one volume of liquid. Soft drinks 3–4 volumes, beer about 2.5.' },
    { term: 'Hypoxia', also: ['oxygen deficiency', 'dead zone'], def: 'Water with less than about 2 mg/L of dissolved oxygen (63 µmol/kg), too little for most fish and invertebrates.' },
    { term: 'Decompression sickness', also: ['the bends', 'caisson disease'], def: 'Injury from nitrogen bubbles that form in tissues when a diver\'s pressure falls faster than the dissolved gas can leave.' }
  ],
  formulas: [
    { name: 'Henry\'s law', expr: 'c = kH*p', tex: 'c = k_H\\,p',
      vars: { c: { name: 'dissolved concentration', q: 'concentration', unit: 'M' }, kH: { name: 'Henry\'s constant (solubility)', q: 'henry', unit: 'M/atm', value: 3.4e-2, tex: 'k_H', hint: 'At 25 °C: CO₂ 0.034, O₂ 0.0013, N₂ 0.00065, He 0.00038 mol/(L·atm).' }, p: { name: 'partial pressure of the gas', q: 'pressure', unit: 'atm', value: 3 } },
      solveFor: 'c', note: 'For a dilute solution of a gas that does not react strongly with water. For CO₂ at 3 atm and 25 °C it gives 0.10 mol/L.',
      stories: { c: 'A drink is bottled under {p} of CO₂ with a Henry constant of {kH}. How much CO₂ dissolves?', p: 'A gas of constant {kH} gives {c} in water. At what partial pressure?' } },
    { name: 'Solubility against temperature', expr: 'kH = kref*exp(C*(1/T - 1/Tref))', tex: 'k_H = k_\\mathrm{ref}\\exp\\left[C\\left(\\frac{1}{T} - \\frac{1}{T_\\mathrm{ref}}\\right)\\right]',
      vars: { kH: { name: 'Henry\'s constant at temperature T', q: 'henry', unit: 'M/atm', tex: 'k_H' }, kref: { name: 'Henry\'s constant at the reference temperature', q: 'henry', unit: 'M/atm', value: 3.4e-2, tex: 'k_\\mathrm{ref}' }, C: { name: 'temperature coefficient ΔH/R', q: 'dtemp', unit: 'K', value: 2400, hint: 'About 2,400 K for CO₂, 1,700 for O₂, 1,300 for N₂. Equal to the heat of solution divided by R, with the sign changed.' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 5, min: 0, max: 100 }, Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true, tex: 'T_\\mathrm{ref}' } },
      solveFor: 'kH', note: 'The van \'t Hoff form of the temperature dependence. CO₂ at 5 °C is 1.8 times as soluble as at 25 °C.',
      stories: { kH: 'A gas has a Henry constant of {kref} at 25 °C and a temperature coefficient of {C}. What is it at {T}?' } },
    { name: 'Dissolved oxygen from the air', expr: 'rho = kH*xO2*p*M', tex: '\\rho_{\\ce{O2}} = k_H\\,x_{\\ce{O2}}\\,p\\,M_{\\ce{O2}}',
      vars: { rho: { name: 'mass of dissolved oxygen per volume (g/m³ is the same as mg/L)', q: 'density', unit: 'g/m³', tex: '\\rho_{\\ce{O2}}' }, kH: { name: 'Henry\'s constant for oxygen', q: 'henry', unit: 'M/atm', value: 1.3e-3, tex: 'k_H', hint: '1.3 × 10⁻³ at 25 °C; 2.2 × 10⁻³ at 0 °C.' }, xO2: { name: 'oxygen fraction of the air', q: 'ratio', unit: '%', value: 20.95, tex: 'x_{\\ce{O2}}' }, p: { name: 'air pressure', q: 'pressure', unit: 'atm', value: 1, hint: 'Take 1 atm at sea level, 0.7 at 3,000 m. Subtract the water vapour pressure (3 % at 25 °C) for a closer figure.' }, M: { name: 'molar mass of O₂', q: 'molarmass', unit: 'g/mol', value: 31.998, fixed: true, tex: 'M_{\\ce{O2}}' } },
      solveFor: 'rho', note: 'Air-saturated fresh water at 1 atm and 25 °C holds about 8.4 mg/L; a mountain lake at 3,000 m holds 30 % less.',
      stories: { rho: 'Water at 25 °C (Henry constant {kH} for O₂) is in balance with air containing {xO2} oxygen at {p}. How much oxygen is dissolved?', p: 'Water holds {rho} of oxygen at a Henry constant of {kH}. What is the air pressure?' } },
    { name: 'Gas released when a drink is opened', expr: 'V = (c1 - c2)*Vl*R*T/p', tex: 'V_g = \\frac{(c_1 - c_2)\\,V_l\\,R\\,T}{p}',
      vars: { V: { name: 'gas released', q: 'volume', unit: 'L', tex: 'V_g' }, c1: { name: 'dissolved concentration before opening', q: 'concentration', unit: 'M', value: 0.102 }, c2: { name: 'concentration in balance with air afterwards', q: 'concentration', unit: 'M', value: 1.4e-5, hint: 'Henry\'s constant 0.034 M/atm times CO₂ in the air, 0.0004 atm: 14 µM.' }, Vl: { name: 'volume of drink', q: 'volume', unit: 'L', value: 1, tex: 'V_l' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 40 }, p: { name: 'pressure of the released gas', q: 'pressure', unit: 'atm', value: 1 } },
      solveFor: 'V', note: 'Ideal gas at the room pressure. A litre of cola at 25 °C and 3 atm gives about 2.5 L of gas, a cold one about 4.',
      stories: { V: 'A {Vl} bottle holds {c1} of dissolved CO₂ and ends at {c2} when opened at {T}. How much gas escapes at {p}?' } }
  ],
  examples: [
    { title: 'A hot day on the pond', q: 'A pond is in balance with air at 10 °C and warms to 30 °C. By what fraction does the oxygen it can hold fall? If fish need at least 5 mg/L, what does this leave in margin?',
      steps: ['Equilibrium oxygen at 10 °C: 11.6 mg/L. At 30 °C: 7.6 mg/L.', { text: 'Loss:', tex: '\\frac{11.6 - 7.6}{11.6} = 0.35' }, 'Margin above 5 mg/L: from 6.6 mg/L at 10 °C to 2.6 mg/L at 30 °C — two-fifths as much.'],
      a: 'The pond can hold a third less oxygen, and its margin above the fish\'s minimum shrinks by 60 % — before any extra demand from bacteria or algae at night.' },
    { title: 'A cold bottle and a warm one', q: 'One litre of cola is bottled with 3 atm of CO₂. How much gas is released on opening at 25 °C, and at 5 °C?',
      steps: [{ text: 'At 25 °C, $c = 0.034 \\times 3 = 0.102$ mol/L. Gas: $0.102 \\times RT/p = 0.102 \\times 24.5\\ \\mathrm{L}$', tex: 'V = 2.5\\ \\mathrm{L}' }, { text: 'At 5 °C, $k_H = 0.034\\,e^{2400(1/278 - 1/298)} = 0.061$ M/atm, so $c = 0.182$ mol/L, and the gas has volume at 5 °C:', tex: 'V = 0.182 \\times 22.8 = 4.2\\ \\mathrm{L}' }],
      a: 'At the same 3 atm, a litre of cold cola holds 4.2 L of gas and a warm one 2.5 L, so the cold drink is the fizzier one. But bottle it cold and let it warm to 25 °C and the same 0.18 mol/L would be in balance with about 5 atm: the sealed bottle is under that pressure, and the warm bottle foams over when opened because the gas leaves faster the warmer it is.' }
  ],
  quiz: [
    { q: 'Compared with water at 5 °C, water at 30 °C in contact with the same air holds', choices: ['more dissolved oxygen', 'about the same', 'about 40 % less dissolved oxygen', 'no oxygen at all'], a: 2, why: 'Dissolved oxygen from air is about 13.0 mg/L at 5 °C and 7.6 mg/L at 30 °C: roughly 40 % less. Dissolving gas releases heat, so heating drives it out.' },
    { q: 'Why is the air dissolved in water richer in oxygen (35 %) than the air above it (21 %)?', choices: ['Fish produce oxygen', 'Oxygen is about twice as soluble as nitrogen', 'Photosynthesis', 'Water splits to oxygen and hydrogen'], a: 1, why: 'Henry constants: O₂ 1.3×10⁻³, N₂ 6.5×10⁻⁴ mol/(L·atm). Oxygen is twice as soluble, and 2×0.21/(2×0.21 + 0.78) is about 35 %.' },
    { q: 'Opening a bottle of fizzy water makes carbon dioxide by a chemical reaction.', a: false, why: 'The CO₂ was already dissolved under pressure; opening the bottle lowers the pressure above the liquid, and by Henry\'s law the liquid can no longer hold it.' },
    { q: 'How many mol/L of CO₂ dissolve at 25 °C under 3.0 atm of the pure gas (k_H = 0.034 mol/(L·atm))?', answer: 0.102, unit: 'mol/L', why: 'c = k_H p = 0.034 × 3.0 = 0.102 mol/L, or 4.5 g/L: about 2.5 litres of gas at room conditions per litre of water.' },
    { q: 'A diver descends from the surface to 30 m (about 4 atm absolute). The partial pressure of nitrogen in the air breathed is', choices: ['0.78 atm, as at the surface', 'about 3.1 atm', 'about 4 atm', 'about 0.2 atm'], a: 1, why: 'Nitrogen is 78 % of the gas, at 4 atm absolute: 0.78 × 4 = 3.1 atm. By Henry\'s law, the dissolved nitrogen is about four times what it is at the surface — which has to come out slowly on the way up.' }
  ],
  applications: ['Carbonated drinks and beer: the CO₂ pressure and the temperature of filling decide the fizz; breweries measure it in volumes.', 'Aquaculture and wastewater treatment: aeration sets the dissolved oxygen that fish and aerobic bacteria need; probes report it in mg/L and in per cent saturation.', 'Scuba diving and caisson work: all decompression schedules are applications of Henry\'s law to tissues.', 'The ocean\'s uptake of CO₂ from the air (about a quarter of human emissions), and the loss of oxygen in the warming sea.', 'Degassing: boiled water tastes flat because the dissolved air is gone; hydraulic and pneumatic systems must remove dissolved air to avoid cavitation.'],
  history: 'William Henry, working in Manchester in 1803, found that the weight of a gas absorbed by water at a given temperature was proportional to the pressure. The bends were described among the Brooklyn Bridge caisson workers of the 1870s; Paul Bert showed in 1878 that nitrogen bubbles were the cause, and John Scott Haldane and colleagues produced the first decompression tables in 1908.',
  sources: ['Sander, "Compilation of Henry\'s law constants (version 4.0) for water as solvent", *Atmospheric Chemistry and Physics* 15, 4399 (2015) — the constants and their temperature coefficients.', 'USGS Water Science School, "Dissolved oxygen and water" — the temperature dependence and the effect on aquatic life.', 'Schmidtko, Stramma and Visbeck, "Decline in global oceanic oxygen content during the past five decades", *Nature* 542, 335 (2017).', 'Haldane, Boycott and Damant, "The prevention of compressed-air illness", *Journal of Hygiene* 8, 342 (1908).'],
  sim: 'sol-fizzy-bottle'
},

/* ================================================================ 6 */
{
  id: 'colligative-properties', parent: 'the-liquid-that-pulls-salt-apart', title: 'Colligative properties', level: 2,
  short: 'Anything dissolved in water lowers its freezing point, raises its boiling point, lowers its vapour pressure and creates an osmotic pressure — by an amount that depends on how many particles are dissolved, not what they are. A kilogram of water with one mole of sugar freezes at −1.86 °C; with one mole of salt, nearly twice as far.',
  keywords: ['colligative', 'freezing point depression', 'boiling point elevation', 'vapour pressure lowering', 'Raoult', 'van \'t Hoff factor', 'molality', 'road salt', 'antifreeze', 'ice cream', 'eutectic', 'cryoscopic constant', 'sea water freezing'],
  prereq: ['how-salt-dissolves', 'vapour-pressure-and-evaporation', 'chemistry:colligative-properties'],
  related: ['osmosis-and-osmotic-pressure', 'the-salt-of-the-sea', 'icebergs-and-sea-ice', 'supercooling-and-nucleation', 'water-in-the-kitchen', 'boiling-at-altitude', 'chemistry:solutions', 'chemistry:le-chatelier'],
  body: `
Scatter salt on an icy road at −5 °C and the ice turns to slush. Pack an ice-cream maker with ice and salt and it falls to −18 °C. Add antifreeze to a radiator and it stays liquid at −37 °C. In each, something dissolved in water has pushed its freezing point down. The remarkable thing is that, in dilute solutions, it does not matter *what* is dissolved; only how many particles there are. The name, from the Latin for "collected together" (Ostwald, 1891), is for properties that depend on the collection, not the members.

### The four properties
| Property | Law | For water |
|---|---|---|
| vapour pressure lowering | $p = x_w\\,p^*$ (Raoult) | 1 mol/kg of particles lowers it 1.8 % |
| freezing point depression | $\\Delta T_f = i\\,K_f\\,m$ | $K_f = 1.86$ K·kg/mol |
| boiling point elevation | $\\Delta T_b = i\\,K_b\\,m$ | $K_b = 0.512$ K·kg/mol |
| osmotic pressure | $\\Pi = i\\,M\\,R\\,T$ | 24.8 bar per mol/L at 25 °C ([[osmosis-and-osmotic-pressure]]) |

Here $m$ is the molality (mol of solute per kg of water) and $i$ the **van 't Hoff factor**, the number of particles one formula unit gives: 1 for sugar, ethylene glycol, urea and ethanol; very nearly 2 for NaCl (measured 1.9 because oppositely charged ions pair up a little); 3 for CaCl₂ and MgCl₂.

### Why the freezing point falls
Pure ice contains only water. The liquid in contact with it is a mixture, so each water molecule in it has a little less tendency to leave the liquid — its escaping tendency (chemical potential) is lowered by the entropy of mixing, $RT\\ln x_w$. At 0 °C the liquid has fallen below the ice\'s level, so ice melts. Only by cooling the liquid until its tendency matches ice\'s again can the two coexist; the freezing point has fallen. The same lowered escaping tendency raises the boiling point (more heat is needed to make the vapour pressure reach 1 atm) and lowers the vapour pressure.

The constant is not empirical: it follows from the latent heat. For the freezing point, $K_f = R T_f^2 M_w/\\Delta H_\\text{fus} = (8.314)(273.15)^2(0.018015)/6010 = 1.86$, and for boiling, with 40.66 kJ/mol at 373 K, $K_b = 0.512$. The stiffer the hydrogen-bonded liquid holds on to its molecules (the larger the latent heat), the smaller the response.

### Putting numbers on it
| Solution | Freezing point | Remarks |
|---|---|---|
| sea water (35 g/kg) | −1.9 °C | $m \\approx 1.1$ mol/kg of particles |
| human blood plasma | −0.52 °C | 0.28 mol/kg of particles |
| 10 % NaCl by mass | −6.5 °C | (ideal law: −7.1 °C) |
| 23.3 % NaCl, the eutectic | −21.1 °C | below this, salt crystals and ice form together |
| 30 % CaCl₂ | about −50 °C | the strongest cheap de-icer |
| 50 % ethylene glycol | −37 °C | coolant, ideal law would give −30 °C |
| 33 % ethylene glycol | −18 °C | a common radiator mix |

The straight-line law holds only for dilute solutions (below about 1 mol/kg); beyond that the ions and molecules interact and the real curve differs. Every salt has a **eutectic**, the lowest temperature at which a liquid remains: −21.1 °C for NaCl, −33 °C for MgCl₂, −10.7 °C for KCl. Road salt stops working near −10 °C in practice because the melting is too slow, which is why very cold cities use CaCl₂ or sand.

### What it is not
Adding salt to the pasta water does not make it cook faster. Ten grams of salt in a litre raises the boiling point by $2 \\times 0.512 \\times 0.171 = 0.18$ K. Salt on ice does not "melt" it by heating: the melting needs the latent heat of fusion, 333 kJ/kg, and it takes it from the surroundings, which is exactly how an ice-cream maker or a salted bucket of ice cools the mix. Nor are all antifreeze effects colligative: antifreeze proteins in polar fish and insects bind to ice crystals and stop them growing, and lower the freezing point by up to a kelvin at millimolar concentrations — hundreds of times more than the number of particles would suggest.

> [!key] A dissolved particle lowers the freezing point of water by 1.86 K per mole per kilogram, whatever it is: sugar once, salt nearly twice, calcium chloride three times. The law comes from the entropy of mixing and the latent heat, holds when dilute, and sets the limits of road salt, antifreeze and the freezing of the sea.`,
  ideas: ['A solute lowers the freezing point and raises the boiling point in proportion to its molality and the number of particles it makes: $\\Delta T = i K m$.', 'Kf = 1.86 and Kb = 0.512 K·kg/mol follow from water\'s latent heats of fusion and vaporisation.', 'NaCl counts almost twice per formula unit, CaCl₂ three times, sugar once: that is why salts beat sugar at melting ice.', 'Each salt has a eutectic: NaCl bottoms out at −21.1 °C (23.3 %), CaCl₂ near −50 °C. The law is straight only in dilute solution.'],
  pitfalls: ['"Salting the pasta water makes it boil hotter and cook faster" — The rise is 0.18 K for 10 g per litre; invisible, and the cooking time is unchanged.', '"Salt melts ice by making heat" — It lowers the freezing point, so the ice melts by taking heat from its surroundings; the brine gets colder, down to the eutectic.', '"Ten grams of sugar and ten grams of salt in water do the same" — Per gram, salt gives 12 times as many particles (58 g/mol and two ions, against 342 g/mol and one molecule) and 12 times the effect.'],
  terms: [
    { term: 'Colligative property', also: ['colligative'], def: 'A property of a solution that depends on the number of dissolved particles rather than their identity: vapour pressure lowering, freezing point depression, boiling point elevation, osmotic pressure.' },
    { term: 'Molality', also: ['m', 'mol/kg'], def: 'Moles of solute per kilogram of solvent. Unlike molarity it does not change with temperature, so it is used in colligative laws.' },
    { term: 'van \'t Hoff factor', also: ['i'], def: 'The ratio of the number of particles in solution to the number of formula units dissolved. 1 for sugar, ideally 2 for NaCl (about 1.9 measured), 3 for CaCl₂.' },
    { term: 'Cryoscopic constant', also: ['K_f', 'freezing-point depression constant'], def: 'The fall in freezing point per mole of solute particles per kilogram of solvent: 1.86 K·kg/mol for water. The ebullioscopic constant for boiling is K_b = 0.512.' },
    { term: 'Eutectic', also: ['eutectic point'], def: 'The composition and temperature at which a solution freezes completely to a mixture of solvent crystals and solute crystals: −21.1 °C at 23.3 % NaCl, about −50 °C for CaCl₂ near 30 %.' },
    { term: 'Raoult\'s law', also: ['vapour pressure lowering'], def: 'The vapour pressure of the solvent above an ideal solution equals the mole fraction of solvent times the vapour pressure of the pure solvent, p = x_w p*.' }
  ],
  formulas: [
    { name: 'Freezing point depression', expr: 'dT = i*Kf*m', tex: '\\Delta T_f = i\\,K_f\\,m',
      vars: { dT: { name: 'lowering of the freezing point', q: 'dtemp', unit: 'K', tex: '\\Delta T_f' }, i: { name: 'van \'t Hoff factor', value: 2, min: 1, max: 5, hint: '1 for sugar and glycol, about 1.9 for NaCl, 2.7 for CaCl₂ measured.' }, Kf: { name: 'cryoscopic constant of water', q: 'colligative', unit: 'K·kg/mol', value: 1.86, fixed: true, tex: 'K_f' }, m: { name: 'molality of the solute', q: 'molality', unit: 'mol/kg', value: 1 } },
      solveFor: 'dT', note: 'Dilute solutions only (below about 1 mol/kg). At higher concentrations use measured tables.',
      stories: { dT: 'A solute giving {i} particles per formula unit is dissolved at {m}. By how much does the freezing point fall?', m: 'A salt with i = {i} lowers the freezing point by {dT}. What molality does that take?' } },
    { name: 'Boiling point elevation', expr: 'dT = i*Kb*m', tex: '\\Delta T_b = i\\,K_b\\,m',
      vars: { dT: { name: 'rise of the boiling point', q: 'dtemp', unit: 'K', tex: '\\Delta T_b' }, i: { name: 'van \'t Hoff factor', value: 2, min: 1, max: 5 }, Kb: { name: 'ebullioscopic constant of water', q: 'colligative', unit: 'K·kg/mol', value: 0.512, fixed: true, tex: 'K_b' }, m: { name: 'molality of the solute', q: 'molality', unit: 'mol/kg', value: 0.171, hint: '10 g of salt in a litre of pasta water is 0.171 mol/kg.' } },
      solveFor: 'dT', note: 'Smaller than the freezing effect, because $K_b$ is a third of $K_f$.',
      stories: { dT: 'A pot of water holds {m} of a salt with i = {i}. By how much does the boiling point rise?' } },
    { name: 'Molality from the mass fraction', expr: 'm = w/((1 - w)*Ms)', tex: 'm = \\frac{w}{(1 - w)\\,M_s}',
      vars: { m: { name: 'molality', q: 'molality', unit: 'mol/kg' }, w: { name: 'mass fraction of solute', q: 'ratio', unit: '%', value: 10, min: 0, max: 60 }, Ms: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol', value: 58.44, tex: 'M_s', hint: 'NaCl 58.44, CaCl₂ 110.98, ethylene glycol 62.07, sucrose 342.3.' } },
      solveFor: 'm', note: 'To convert a label ("10 % salt by mass") into a molality for the freezing-point law.',
      stories: { m: 'A brine is {w} salt by mass (molar mass {Ms}). What is its molality?', w: 'A solution of {Ms} solute has a molality of {m}. What is its mass fraction?' } },
    { name: 'The constant from the latent heat', expr: 'K = R*T^2*Mw/dH', tex: 'K = \\frac{R\\,T^2\\,M_w}{\\Delta H}',
      vars: { K: { name: 'cryoscopic or ebullioscopic constant', q: 'colligative', unit: 'K·kg/mol' }, R: { const: 'R' }, T: { name: 'melting point (or boiling point)', q: 'temperature', unit: '°C', value: 0, min: -100, max: 400 }, Mw: { name: 'molar mass of the solvent', q: 'molarmass', unit: 'g/mol', value: 18.015, tex: 'M_w' }, dH: { name: 'molar enthalpy of fusion (or vaporisation)', q: 'molarenergy', unit: 'kJ/mol', value: 6.01, tex: '\\Delta H', hint: '6.01 kJ/mol for melting ice, 40.66 kJ/mol for boiling at 100 °C.' } },
      solveFor: 'K', note: 'With 6.01 kJ/mol at 0 °C this gives 1.86; with 40.66 kJ/mol at 100 °C it gives 0.512.',
      stories: { K: 'A solvent of molar mass {Mw} melts at {T} with an enthalpy of fusion of {dH}. What is its cryoscopic constant?' } }
  ],
  derivation: { title: 'Where the cryoscopic constant 1.86 comes from', steps: [
    { text: 'Ice and the solution coexist when the chemical potential of water in the liquid equals that of pure ice. For the liquid, $\\mu_w = \\mu_w^* + RT\\ln x_w$, where $x_w$ is the mole fraction of water. Using the Gibbs–Helmholtz relation with the enthalpy of fusion gives:', tex: '\\ln x_w = -\\frac{\\Delta H_\\text{fus}}{R}\\left(\\frac{1}{T} - \\frac{1}{T_f}\\right)' },
    { text: 'For a dilute solution $\\ln x_w \\approx -x_s$, and for a small shift $\\frac{1}{T} - \\frac{1}{T_f} \\approx \\frac{\\Delta T}{T_f^2}$. So:', tex: 'x_s = \\frac{\\Delta H_\\text{fus}}{R\\,T_f^2}\\,\\Delta T' },
    { text: 'In dilute solution the mole fraction is $x_s \\approx n_s/n_w = m\\,M_w$, with $m$ the molality and $M_w$ the molar mass of water in kg/mol. Solving for the shift:', tex: '\\Delta T = \\frac{R\\,T_f^2\\,M_w}{\\Delta H_\\text{fus}}\\,m = K_f\\,m' },
    { text: 'Inserting the numbers:', tex: 'K_f = \\frac{(8.314)(273.15)^2(0.018015)}{6010} = 1.86\\ \\mathrm{K\\,kg/mol}' }
  ] },
  examples: [
    { title: 'How much salt for a −10 °C road?', q: 'What mass fraction of NaCl is needed to keep a brine liquid at −10 °C, taking $i = 2$ and the ideal law? Compare with the tables.',
      steps: [{ text: 'Molality:', tex: 'm = \\frac{10}{2 \\times 1.86} = 2.69\\ \\mathrm{mol/kg}' }, { text: 'Salt per kilogram of water: $2.69 \\times 58.44 = 157$ g. Mass fraction:', tex: 'w = \\frac{157}{1000 + 157} = 13.6\\ \\%' }],
      a: '13.6 %. The measured freezing-point table gives about 14 % NaCl at −10 °C, so the ideal law is good here. Below −10 °C the brine needed grows fast: 23.3 % at −21 °C, the limit.' },
    { title: 'Ethylene glycol at 50 %', q: 'A radiator holds a 50 % by mass mixture of ethylene glycol (62.07 g/mol) in water. What does the ideal law predict for the freezing point, and how does it compare with the measured −37 °C?',
      steps: [{ text: 'Molality:', tex: 'm = \\frac{500/62.07}{0.500} = 16.1\\ \\mathrm{mol/kg}' }, { text: 'Depression, with $i = 1$:', tex: '\\Delta T = 1.86 \\times 16.1 = 30\\ \\mathrm{K}' }],
      a: 'The ideal law gives −30 °C against the measured −37 °C. At 16 mol/kg the solution is not dilute and the molecules interact strongly (hydrogen bonds between the glycol and water), so the law is a first estimate only.' }
  ],
  quiz: [
    { q: 'One mole each of glucose, NaCl and CaCl₂ are dissolved in a kilogram of water. Which freezes lowest (ideal law)?', choices: ['Glucose', 'NaCl', 'CaCl₂', 'They freeze at the same temperature'], a: 2, why: 'CaCl₂ gives 3 particles per formula unit, NaCl 2 and glucose 1, so the depressions are 5.6, 3.7 and 1.9 K.' },
    { q: 'Adding 10 g of salt to a litre of pasta water raises its boiling point by about', choices: ['0.2 K', '2 K', '10 K', '20 K'], a: 0, why: 'The molality is 0.171 mol/kg of NaCl, 0.342 mol/kg of ions; times K_b = 0.512 gives 0.18 K. The common belief that salt "makes the water hotter" is false by a factor of ten or more.' },
    { q: 'Ten grams of table salt in 100 g of water lowers the freezing point about as much as ten grams of sugar.', a: false, why: 'Salt (58 g/mol, two particles) has 12 times as many particles per gram as sugar (342 g/mol, one particle), so its effect is 12 times as large.' },
    { q: 'What freezing point depression does the ideal law give for a 1.00 mol/kg NaCl solution (i = 2)?', answer: 3.72, unit: 'K', why: 'ΔT = i K_f m = 2 × 1.86 × 1.00 = 3.72 K. (Measured: 3.5 K, because the ions pair up slightly and i is nearer 1.9.)' },
    { q: 'Why does sea water not freeze at 0 °C but at about −1.9 °C?', choices: ['It is denser', 'The 35 g/kg of dissolved salt gives about 1.1 mol/kg of particles, and 1.1 × 1.86 = 2.0 K', 'Waves keep it moving', 'It contains antifreeze proteins'], a: 1, why: 'Colligative lowering: about 1.1 mol of ions per kilogram of water gives 2 K, in line with the measured −1.9 °C.' }
  ],
  applications: ['De-icing roads, runways and ships\' decks: NaCl to about −10 °C, CaCl₂ and MgCl₂ below that.', 'Engine coolants and aircraft de-icers: ethylene glycol and propylene glycol mixtures set to a freezing point below the lowest expected air temperature (and also a higher boiling point).', 'Freezing-point osmometers measure the osmolality of blood and urine from the depression: blood is at −0.52 °C.', 'Ice cream, sorbets and the ice-salt bath: the cream mix freezes at about −2.5 °C because of its sugars, and the ice-salt brine cools it far below.', 'Sea ice: freezing rejects brine, which sinks and drives the deep-ocean circulation; sea ice itself is only about 5 g/kg salty.'],
  history: 'Charles Blagden showed in 1788 that the depression of the freezing point is proportional to the amount of salt. François-Marie Raoult established the law for many solutes in the 1880s; van \'t Hoff showed in 1887 that the colligative properties follow the ideal-gas law and are linked by thermodynamics, and Wilhelm Ostwald coined "colligative" in 1891.',
  sources: ['Atkins and de Paula, *Physical Chemistry*, chapter on the properties of solutions (colligative properties and the derivation of $K_f$).', 'CRC *Handbook of Chemistry and Physics*: freezing-point depression of aqueous solutions and eutectic compositions.', 'ASHRAE *Handbook — Fundamentals*, secondary coolants: freezing points of aqueous ethylene glycol and propylene glycol.', 'Davies and others on the antifreeze proteins of fishes, e.g. DeVries, "Glycoproteins as biological antifreeze agents in Antarctic fishes", *Science* 172, 1152 (1971).'],
  sim: 'sol-colligative'
},

/* ================================================================ 7 */
{
  id: 'osmosis-and-osmotic-pressure', parent: 'the-liquid-that-pulls-salt-apart', title: 'Osmosis and osmotic pressure', level: 2,
  short: 'Behind a membrane that lets water through but not salt, water flows towards the saltier side until a pressure builds up that stops it: Π = iMRT, the same formula as an ideal gas. Sea water has 27 bar of it, blood 7.5 bar, a plant cell about 5–10 — and reverse osmosis desalinates by pushing harder than that.',
  keywords: ['osmosis', 'osmotic pressure', 'semipermeable membrane', 'van \'t Hoff', 'reverse osmosis', 'tonicity', 'isotonic', 'turgor', 'osmolarity', 'desalination', 'cell', 'saline'],
  prereq: ['colligative-properties', 'how-salt-dissolves', 'chemistry:osmotic-pressure'],
  related: ['osmosis-in-cells', 'aquaporins', 'desalination', 'the-salt-of-the-sea', 'roots-and-root-pressure', 'the-matrix-of-life', 'biology:diffusion-osmosis', 'biology:osmoregulation', 'medicine:electrolytes'],
  body: `
Put a raisin in water and it swells; salt a slug and it shrivels; drink sea water and you end up thirstier. All three are **osmosis**: the passage of water through a membrane towards the side where it is less free to leave because more is dissolved in it. The membrane has to pass water and hold back the solute — the cell\'s lipid skin, a sausage casing, a polyamide film, the lining of a root. Water goes from the dilute side to the concentrated side, which is the direction that would even out the concentrations if the solute could move.

### The pressure that stops it
Put pure water on one side of such a membrane and a salt solution on the other, in a U-tube. Water flows into the solution and raises its level. As the column of solution rises, its weight presses back, and when the extra hydrostatic pressure equals the **osmotic pressure** $\\Pi$ the flow stops. That is the definition: the pressure that must be put on the solution to hold it in balance with pure water through a semipermeable membrane. Jacobus van 't Hoff noticed in 1886 that Pfeffer\'s measurements of 1877 obeyed

$$\\Pi = i\\,M\\,R\\,T$$

the equation of an ideal gas, with the molar concentration $M$ in place of $n/V$: the dissolved particles exert on the membrane the pressure they would exert as a gas filling the same volume. (It is a formal resemblance, not a mechanism: the solute does not push on the membrane; the solvent\'s lowered tendency to leave draws water in.) It is the fourth colligative property ([[colligative-properties]]), and a large one: 24.8 bar for every mole per litre of particles at 25 °C.

| Solution | Particle concentration | Osmotic pressure |
|---|---|---|
| 0.1 mol/L glucose | 0.1 osmol/L | 2.5 bar |
| blood plasma, 37 °C | 0.29 osmol/L | 7.3–7.7 bar |
| 0.9 % NaCl ("physiological saline") | 0.30 osmol/L | 7.5 bar |
| sea water, 35 g/kg | about 1.1 osmol/L | 27 bar |
| saturated brine | about 11 osmol/L | roughly 380 bar |

A U-tube would have to be very tall to measure it: 27 bar balances about 275 m of water. Real osmometers use a pressure transducer, or measure the freezing point instead.

### The cell is an osmometer
A red blood cell sits happily in 0.9 % salt solution. In pure water it takes in water, swells and bursts within minutes; in a 3 % solution it loses water and shrinks. The solutions are called isotonic, hypotonic and hypertonic. Plant cells are walled, so they do not burst but build **turgor pressure** of 5–10 bar, which holds up leaves and stems; a plant wilts when the pressure goes. Freshwater protozoa pump out the water that floods in through a contractile vacuole; freshwater fish pass dilute urine all day, saltwater fish drink the sea and pump out the salt. Aquaporins make cell membranes permeable to water, thousands of molecules per second per channel ([[aquaporins]], [[osmosis-in-cells]]).

### Reverse osmosis
Apply a pressure greater than $\\Pi$ to the salt side and the flow reverses: pure water is squeezed out through the membrane while the salt stays behind. That is **reverse osmosis**. Sea water of 27 bar needs well over that, since the brine left behind gets saltier as water leaves: plants run at 55–70 bar and recover about half of the water. The minimum possible work, for 35 g/kg at 50 % recovery, is about 1.1 kWh per cubic metre (Elimelech and Phillip, 2011); good plants use 2.5–3. The same membranes clean the water of boilers and laboratories ([[desalination]], [[ultrapure-water]]).

### Why you cannot drink the sea
Sea water is 1.1 osmol/L; the best urine a human kidney can make reaches 1.2 osmol/L. To excrete the salt in a litre of sea water the body needs more than a litre of water, so each drink leaves it in water debt. Sailors and castaways who drank it died faster than those who did not.

> [!key] Osmosis moves water towards the side with more solute, until a pressure $\\Pi = iMRT$ — 24.8 bar per mole of particles per litre — opposes it. Cells live on this pressure, and reverse osmosis exceeds it to make fresh water from the sea.`,
  ideas: ['Water crosses a semipermeable membrane towards the side with more dissolved particles, because its tendency to leave is lowered there.', 'The osmotic pressure $\\Pi = iMRT$ is the pressure that stops the flow; it follows the ideal-gas formula with the molar concentration, 24.8 bar per mol/L at 25 °C.', 'Sea water has about 27 bar, blood about 7.5 bar, saturated brine several hundred bar: cells in the wrong solution swell, shrink or burst.', 'Reverse osmosis applies more than $\\Pi$ to push water out of a solution; the minimum work for sea water is about 1.1 kWh/m³ and real plants use 2.5–3.'],
  pitfalls: ['"Osmotic pressure is the pressure the solution exerts" — It is the pressure that must be applied to the solution to stop water entering. A solution in the open has no osmotic pressure to speak of until it meets a membrane.', '"The solute particles push the water through" — Water moves because its free energy is lower in the solution; nothing is pulled by the solute. The ideal-gas look of the formula is a result, not a cause.', '"Osmosis is diffusion of the solute" — Osmosis is the movement of the solvent through a membrane that stops the solute; diffusion moves each substance down its own gradient.'],
  terms: [
    { term: 'Osmosis', also: ['osmotic flow'], def: 'The net passage of solvent through a semipermeable membrane from the side where the solute concentration is lower to the side where it is higher.' },
    { term: 'Semipermeable membrane', also: ['selectively permeable membrane'], def: 'A barrier that passes some molecules (water) but not others (dissolved salts, sugars, proteins). Cell membranes, cellophane and reverse-osmosis films are examples.' },
    { term: 'Osmotic pressure', also: ['Π', 'osmotic potential'], def: 'The pressure that must be applied to a solution to stop water entering through a semipermeable membrane from pure water. By van \'t Hoff, Π = iMRT for dilute solutions.' },
    { term: 'Tonicity', also: ['isotonic', 'hypotonic', 'hypertonic'], def: 'The effect of a solution on the volume of a cell placed in it. Isotonic: no change. Hypotonic (less solute): the cell swells. Hypertonic (more solute): the cell shrinks.' },
    { term: 'Osmolarity', also: ['osmolality', 'osmol/L'], def: 'The concentration of osmotically active particles: moles of particles per litre (osmolarity) or per kilogram of water (osmolality). 0.9 % NaCl is about 0.30 osmol/L.' },
    { term: 'Reverse osmosis', also: ['RO'], def: 'Forcing water through a semipermeable membrane against its osmotic pressure by applying a larger pressure to the solution side, to produce fresh water from salt water.' }
  ],
  formulas: [
    { name: 'The van \'t Hoff equation', expr: 'Pos = i*M*R*T', tex: '\\Pi = i\\,M\\,R\\,T',
      vars: { Pos: { name: 'osmotic pressure', q: 'pressure', unit: 'bar', tex: '\\Pi' }, i: { name: 'van \'t Hoff factor', value: 2, min: 1, max: 5, hint: '1 for sugar, 2 for NaCl, 3 for CaCl₂ (ideal).' }, M: { name: 'molar concentration of the solute', q: 'concentration', unit: 'M', value: 0.6, hint: '0.6 mol/L of NaCl is about the salt content of sea water.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -20, max: 100 } },
      solveFor: 'Pos', note: 'For dilute ideal solutions. Real sea water is at 27 bar rather than the 29.7 bar the formula gives, because its osmotic coefficient is about 0.9.',
      stories: { Pos: 'A solution of {M} with i = {i} at {T} faces pure water across a semipermeable membrane. What is the osmotic pressure?', M: 'A solution (i = {i}) at {T} has an osmotic pressure of {Pos}. What is its molar concentration?' } },
    { name: 'The height of the column that balances it', expr: 'h = Pos/(rhoW*g)', tex: 'h = \\frac{\\Pi}{\\rho_w\\,g}',
      vars: { h: { name: 'height of water that balances Π', q: 'length', unit: 'm' }, Pos: { name: 'osmotic pressure', q: 'pressure', unit: 'bar', value: 27, tex: '\\Pi' }, rhoW: { const: 'rhoW' }, g: { const: 'g' } },
      solveFor: 'h', note: 'The hydrostatic head. 27 bar is 275 m of water: a U-tube would have to be taller than a skyscraper.',
      stories: { h: 'A solution has an osmotic pressure of {Pos}. How tall a column of water balances it?' } },
    { name: 'The least work for a cubic metre of fresh water', expr: 'E = Pos*V', tex: 'E_\\mathrm{min} = \\Pi\\,V',
      vars: { E: { name: 'energy', q: 'energy', unit: 'kWh', tex: 'E_\\mathrm{min}' }, Pos: { name: 'osmotic pressure of the feed', q: 'pressure', unit: 'bar', value: 27, tex: '\\Pi' }, V: { name: 'volume of fresh water', q: 'volume', unit: 'm³', value: 1 } },
      solveFor: 'E', note: 'The limit for taking out an infinitesimal amount of water, 0.75 kWh/m³ for sea water. At 50 % recovery the feed concentrates and the minimum rises to about 1.1 kWh/m³; real plants use 2.5–3.',
      stories: { E: 'Fresh water is squeezed out of a feed with osmotic pressure {Pos}, at the thermodynamic minimum. What energy does {V} take?' } },
    { name: 'The salt that makes an isotonic solution', expr: 'rhos = Osm*Mm/i', tex: '\\rho_s = \\frac{\\mathrm{Osm}\\,M_m}{i}',
      vars: { rhos: { name: 'mass of salt per volume', q: 'density', unit: 'g/L', tex: '\\rho_s' }, Osm: { name: 'target osmolarity', q: 'concentration', unit: 'mM', value: 300, tex: '\\mathrm{Osm}', hint: 'Blood plasma is 285–295 mosmol/L.' }, Mm: { name: 'molar mass of the salt', q: 'molarmass', unit: 'g/mol', value: 58.44, tex: 'M_m' }, i: { name: 'particles per formula unit', value: 2, min: 1, max: 5 } },
      solveFor: 'rhos', note: 'About 8.8 g/L for NaCl with i = 2. With the measured i = 1.85 the same recipe gives 9.5 g/L; the clinical 0.9 % (9 g/L) lies between them: 308 mOsm/L nominal, about 286 measured.',
      stories: { rhos: 'To make a solution of {Osm} from a salt of molar mass {Mm} with {i} particles per formula unit, how much salt per litre?' } }
  ],
  derivation: { title: 'Derive Π = MRT', steps: [
    { text: 'At balance, the solvent has the same chemical potential on both sides. On the pure side it is $\\mu_w^*(p)$; on the solution side the solvent is at pressure $p + \\Pi$ and is diluted:', tex: '\\mu_w^*(p) = \\mu_w^*(p + \\Pi) + RT\\ln x_w' },
    { text: 'For an incompressible liquid $\\mu_w^*(p + \\Pi) - \\mu_w^*(p) = V_m\\,\\Pi$, with $V_m$ the molar volume of the solvent:', tex: 'V_m\\,\\Pi = -RT\\ln x_w' },
    { text: 'For a dilute solution $-\\ln x_w \\approx x_s \\approx n_s/n_w$, and $n_w V_m \\approx V$, the volume of the solution:', tex: '\\Pi = \\frac{n_s}{V}\\,RT = M\\,R\\,T' }
  ] },
  examples: [
    { title: 'The pressure of sea water', q: 'Sea water has a salinity of 35 g/kg, mostly as NaCl. Estimate its osmotic pressure at 25 °C using a NaCl concentration of 0.6 mol/L, and compare with the measured 27 bar.',
      steps: [{ text: 'Particle concentration with $i = 2$:', tex: 'iM = 1.2\\ \\mathrm{mol/L}' }, { text: 'Pressure:', tex: '\\Pi = (1200\\ \\mathrm{mol/m^3})(8.314)(298.15) = 2.97\\times10^6\\ \\mathrm{Pa} = 29.7\\ \\mathrm{bar}' }],
      a: '29.7 bar by the ideal formula against 27 bar measured: the ions attract slightly, so each counts as only 0.9 of a particle (the osmotic coefficient). A reverse-osmosis plant must therefore run well above 27 bar, and above 54 bar when half the water has gone and the brine is twice as salty.' },
    { title: 'A cell in the wrong water', q: 'A red blood cell with the osmolarity of 0.30 osmol/L is placed in pure water. What pressure difference is the membrane exposed to, and what happens?',
      steps: [{ text: 'At 37 °C:', tex: '\\Pi = (300)(8.314)(310.15) = 7.7\\times10^5\\ \\mathrm{Pa} = 7.7\\ \\mathrm{bar}' }, 'The cell membrane cannot hold a pressure of this size; it bursts (haemolysis) after swelling to about one and a half times its volume.'],
      a: 'The inward osmotic drive is 7.7 bar, more than three times the gauge pressure of a car tyre, acting on a membrane a few nanometres thick; the cell swells and lyses. Hence IV drips are made isotonic (0.9 % NaCl, 5 % glucose).' }
  ],
  quiz: [
    { q: 'Pure water and a sugar solution are separated by a semipermeable membrane. Water will', choices: ['flow into the sugar solution', 'flow out of the sugar solution', 'not flow, because the sugar blocks the pores', 'flow until the sugar crosses'], a: 0, why: 'Water moves towards the side where it is less free to leave, the solution. The sugar stays; the flow stops when the solution\'s level has risen enough to press back with the osmotic pressure.' },
    { q: 'A red blood cell in a 3 % NaCl solution will', choices: ['swell and burst', 'shrink', 'stay the same', 'dissolve'], a: 1, why: '3 % NaCl is about 1 osmol/L, hypertonic to the cell\'s 0.3. Water leaves the cell down its gradient and the cell shrinks and crinkles (crenation).' },
    { q: 'Applying a pressure of 20 bar to sea water (Π = 27 bar) on one side of a semipermeable membrane, with pure water on the other, makes fresh water flow out of the sea water.', a: false, why: 'The applied pressure is less than Π, so the net flow is still from pure water into the sea water, only slowed. Reverse osmosis needs more than Π — in practice 55–70 bar.' },
    { q: 'What is the osmotic pressure, in bar, of 0.100 mol/L glucose at 37 °C?', answer: 2.58, unit: 'bar', why: 'Π = iMRT = 1 × 100 mol/m³ × 8.314 × 310.15 = 2.58 × 10⁵ Pa = 2.58 bar.' },
    { q: 'Drinking sea water dehydrates because', choices: ['it contains poisons', 'the kidneys cannot make urine more concentrated than the sea, so excreting its salt takes more water than it supplies', 'it is hot', 'the stomach rejects it'], a: 1, why: 'Sea water is 1.1 osmol/L and the maximum urine concentration is about 1.2 osmol/L. Each litre of sea water drunk needs more than a litre of urine to carry out its salt.' }
  ],
  applications: ['Reverse osmosis desalination, which now supplies drinking water to Israel, the Gulf, Spain and California, and household under-sink filters ([[desalination]]).', 'Intravenous fluids, eye drops and injectables are made isotonic (0.9 % NaCl, 5 % glucose) so that cells do not swell or shrink.', 'Food preservation by osmosis: sugar in jam, salt in curing, brine in pickling and honey\'s water activity of 0.6 keep micro-organisms from growing, as cells dry out.', 'Plant physiology: roots draw water in osmotically, turgor holds leaves up and guard cells open and close the stomata by osmotic swelling ([[roots-and-root-pressure]]).', 'Dialysis and haemodialysis, and forward osmosis and pressure-retarded osmosis for extracting energy from the meeting of river and sea.'],
  history: 'Jean-Antoine Nollet noticed in 1748 that a pig\'s bladder in water swelled if it held spirits of wine; René Dutrochet called the phenomenon "osmose" in 1826. Wilhelm Pfeffer measured osmotic pressures in a porcelain cell lined with copper ferrocyanide in 1877. Van \'t Hoff\'s recognition in 1886–87 that these followed the gas laws earned him the first Nobel Prize in Chemistry in 1901.',
  sources: ['Atkins and de Paula, *Physical Chemistry*, chapter on colligative properties (osmosis and the van \'t Hoff equation).', 'Elimelech and Phillip, "The future of seawater desalination: energy, technology, and the environment", *Science* 333, 712 (2011) — the least work and real energy use.', 'Nobel, *Physicochemical and Environmental Plant Physiology* — osmotic and turgor pressures of plant cells.', 'Taiz and Zeiger, *Plant Physiology*, chapter on water balance of plants.'],
  sim: 'sol-osmosis-utube'
},

/* ================================================================ 8 */
{
  id: 'the-salt-of-the-sea', parent: 'the-liquid-that-pulls-salt-apart', title: 'The salt of the sea', level: 1,
  short: 'Every kilogram of sea water carries 35 g of dissolved salts — mostly sodium and chloride, always in nearly the same proportions. They came from rock weathered by rain and from vents on the sea floor, and have stayed for tens to hundreds of millions of years; the sea is neither getting much saltier nor fresher.',
  keywords: ['salinity', 'sea water', 'ocean salt', 'why is the sea salty', 'residence time', 'Dead Sea', 'salt pan', 'evaporite', 'Marcet', 'density of sea water', 'brine', 'chloride', 'practical salinity'],
  prereq: ['how-salt-dissolves', 'the-density-maximum'],
  related: ['colligative-properties', 'osmosis-and-osmotic-pressure', 'pure-water-and-conductivity', 'water-the-amphoteric', 'ocean-currents', 'how-much-water-earth-has', 'desalination', 'the-deep-time-of-water', 'chemistry:solubility'],
  body: `
A kilogram of sea water holds about 35 g of dissolved matter: 3.5 %. It is enough that, were the oceans to evaporate, the salt would make a layer 45 m thick over the whole Earth, or 150 m over the land. Where did all that come from, what is in it, and why does the sea not keep getting saltier?

### What is in it
| Ion | g per kg | mmol per kg |
|---|---|---|
| chloride, Cl⁻ | 19.35 | 546 |
| sodium, Na⁺ | 10.78 | 469 |
| sulfate, SO₄²⁻ | 2.71 | 28 |
| magnesium, Mg²⁺ | 1.28 | 53 |
| calcium, Ca²⁺ | 0.41 | 10 |
| potassium, K⁺ | 0.40 | 10 |
| hydrogen carbonate, HCO₃⁻ | 0.11 | 1.8 |
| bromide, Br⁻ | 0.067 | 0.84 |
| everything else | < 0.05 | |

Six ions make 99 % of the salt, and two — sodium and chloride, the components of table salt — make 86 %. In 1819 Alexander Marcet noticed that the proportions of the major ions are the same in sea water from all over the world; Wilhelm Dittmar confirmed it on the samples of the *Challenger* expedition in 1884. Salinity changes by evaporation and rain, but not the recipe. That is why a single measurement, the electrical conductivity, is enough to find the salinity of a sample ([[pure-water-and-conductivity]]). The recipe does not apply to estuaries, to brine pools or to the Dead Sea, whose magnesium exceeds its sodium.

### Where it came from
Rain is weakly acidic with the CO₂ it has dissolved, and over land it slowly dissolves rocks. Rivers carry the products to the sea at about 4 billion tonnes a year, mostly calcium, bicarbonate, silica, sulfate and sodium. Hot water circulating in the sea-floor crust at the mid-ocean ridges takes up magnesium and sulfate from the sea and returns calcium, potassium and silica ([[the-deep-time-of-water]]). Most of the chloride came from volcanic hydrogen chloride early in the Earth\'s history, and the sodium from weathering.

### The sea is in balance
River water is only 0.012 % dissolved matter and rich in bicarbonate and calcium, yet the sea is rich in sodium and chloride. The difference is **residence time**: the average time an ion spends in the sea before something removes it — shells and corals take calcium and carbonate, clays take potassium, vent reactions remove magnesium. Sodium and chloride, which nothing grabs quickly, stay for tens of millions of years.

| Ion | Residence time |
|---|---|
| chloride | about 100 million years |
| sodium | about 70 million years |
| magnesium | about 13 million years |
| sulfate, potassium | about 10 million years |
| calcium | about 1 million years |
| aluminium | about 100 years |

The residence time is the amount in the sea divided by the rate of supply, $\\tau = N/F$. With about 15 × 10¹⁸ kg of sodium in the ocean and the rivers bringing 2 × 10¹¹ kg a year, the answer is about 70 million years. An ocean this old has not been getting saltier in any simple way; inputs balance outputs, including salt deposited in lagoons. When the Mediterranean dried almost completely between about 6 and 5.3 million years ago (the Messinian salinity crisis) it left a salt layer of about a million cubic kilometres — some 5 % of the ocean\'s salt — that is still there under the sea floor.

### Properties of the mixture
The salt raises the density to about 1,026 kg/m³ at 15 °C (1,028 at 0 °C, 1,023 at 25 °C), lowers the freezing point to −1.9 °C and raises the osmotic pressure to 27 bar ([[colligative-properties]], [[osmosis-and-osmotic-pressure]]). Above 24.7 g/kg the freezing point is lower than the temperature of maximum density, so ocean water keeps getting denser as it cools all the way to freezing: there is no 4 °C layer in the open sea. Salinity varies from about 7 g/kg in the Baltic and 18 in the Black Sea to 38 in the Mediterranean, 41 in the Red Sea and 340 in the Dead Sea, whose density of 1,240 kg/m³ holds a swimmer with only about 80 % of the body below the surface, instead of 96 % in the open sea.

### Salt pans
Evaporate sea water in shallow ponds and the salts come out in order of solubility: first calcium carbonate, then gypsum (calcium sulfate) when about four-fifths of the water have gone, then **halite** (sodium chloride) when about nine-tenths have gone; what remains, the *bittern*, is rich in magnesium and potassium salts. Sea salt is harvested in this sequence in pans from Brittany to Guerande to Gujarat.

> [!key] Sea water is 3.5 % salt, 86 % of it sodium chloride, in proportions that hardly change from place to place. It arrives from weathered rock and hot sea-floor vents, leaves through shells, clays and salt deposits, and lingers for tens of millions of years, so the sea is salty because nothing removes sodium and chloride quickly.`,
  ideas: ['Sea water averages 35 g of dissolved salts per kg, 86 % of it sodium and chloride; six ions make up 99 %.', 'The proportions of the major ions are constant everywhere (Marcet, 1819), so conductivity can give the salinity.', 'Rivers and sea-floor vents supply the ions; shells, clays and salt deposits remove them. Residence times run from 100 years (aluminium) to 100 million years (chloride).', 'A salt pan precipitates minerals in order: carbonate, gypsum, halite, then magnesium and potassium bittern salts.'],
  pitfalls: ['"The sea gets saltier every year as rivers keep adding salt" — Inputs are balanced by losses, to salt pans, shells, clays and vent reactions. Salinity has changed little for hundreds of millions of years.', '"Rivers are fresh, so the sea\'s salt cannot have come from rivers" — Rivers carry only 0.01 % dissolved matter, but they have been delivering it for billions of years and the water that leaves the sea by evaporation leaves the salt behind.', '"Sea water is sodium chloride solution" — Sodium chloride is 78 % of the salt; magnesium and sulfate are a large part of the rest and make sea water taste bitter, not just salty.'],
  terms: [
    { term: 'Salinity', also: ['practical salinity', 'PSU', 'absolute salinity'], def: 'The mass of dissolved salts per kilogram of sea water, about 35 g/kg in the open ocean. In practice it is found from the conductivity (practical salinity scale of 1978), and expressed as a number without units.' },
    { term: 'Residence time', also: ['turnover time'], def: 'The average time an ion or a water molecule stays in a reservoir: the amount present divided by the rate at which it is supplied. For sodium in the ocean, about 70 million years.' },
    { term: 'Marcet\'s principle', also: ['constant proportions', 'Dittmar\'s law'], def: 'The ratios of the major ions in open-ocean water are constant, whatever the total salinity, because the ocean mixes faster than the ions are added or removed.' },
    { term: 'Evaporite', also: ['salt deposit', 'halite'], def: 'A rock formed by the evaporation of salt water: gypsum, halite (rock salt) and the bittern potassium and magnesium salts, in that order.' },
    { term: 'Brine', also: ['hypersaline water'], def: 'Water saltier than sea water: the Dead Sea at 340 g/kg, saturated sodium chloride at 264 g/kg of solution at 25 °C.' },
    { term: 'Bittern', also: ['mother liquor'], def: 'The magnesium- and potassium-rich liquid left when sodium chloride has been crystallised out of evaporating sea water.' }
  ],
  formulas: [
    { name: 'Salt in a volume of sea water', expr: 'ms = S*rho*V', tex: 'm_s = S\\,\\rho\\,V',
      vars: { ms: { name: 'mass of salt', q: 'mass', unit: 'kg', tex: 'm_s' }, S: { name: 'salinity (mass fraction)', q: 'ratio', unit: '%', value: 3.5, hint: '3.5 % is 35 g/kg; the Dead Sea is 34 %.' }, rho: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, V: { name: 'volume', q: 'volume', unit: 'm³', value: 1 } },
      solveFor: 'ms', note: 'A cubic metre of the open ocean holds 36 kg of salt; the oceans together about 5 × 10¹⁹ kg.',
      stories: { ms: 'A tank of {V} of sea water has a salinity of {S} and a density of {rho}. How much salt is dissolved in it?' } },
    { name: 'If the sea dried up', expr: 'h = Mo*S/(rhoS*A)', tex: 'h = \\frac{M_o\\,S}{\\rho_s\\,A}',
      vars: { h: { name: 'thickness of the salt layer', q: 'length', unit: 'm' }, Mo: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.4e21, tex: 'M_o' }, S: { name: 'salinity', q: 'ratio', unit: '%', value: 3.5 }, rhoS: { name: 'density of the dried salt', q: 'density', unit: 'kg/m³', value: 2165, tex: '\\rho_s', hint: 'Halite is 2,165 kg/m³; a mixed deposit is looser.' }, A: { name: 'area it is spread over', q: 'area', unit: 'km²', value: 5.1e8, hint: '5.1 × 10⁸ km² is the whole Earth; the land is 1.5 × 10⁸ km².' } },
      solveFor: 'h', note: 'About 43 m over the whole Earth, 150 m over the land alone.',
      stories: { h: 'The oceans, {Mo} of water at {S} salinity, evaporate and leave their salt (density {rhoS}) spread over {A}. How thick is the layer?' } },
    { name: 'The residence time of an ion', expr: 'tau = N/F', tex: '\\tau = \\frac{N}{F}',
      vars: { tau: { name: 'residence time', q: 'time', unit: 'Myr', tex: '\\tau' }, N: { name: 'amount of the element in the ocean', q: 'mass', unit: 'kg', value: 1.5e19, hint: 'About 1.5 × 10¹⁹ kg of sodium (10.8 g/kg of 1.4 × 10²¹ kg).' }, F: { name: 'rate of supply (or removal)', q: 'massflow', unit: 'kg/s', value: 7000, hint: 'About 2 × 10¹¹ kg of sodium a year from the rivers is 7,000 kg/s.' } },
      solveFor: 'tau', note: 'A steady-state estimate; the supply and the removal must balance for it to be meaningful.',
      stories: { tau: 'The ocean holds {N} of an element and receives {F} from the rivers. What is the average residence time?' } },
    { name: 'How deep a swimmer floats', expr: 'f = rhoB/rhoW', tex: 'f = \\frac{\\rho_b}{\\rho_w}',
      vars: { f: { name: 'fraction of the body below the surface', q: 'ratio', unit: '%' }, rhoB: { name: 'density of the body', q: 'density', unit: 'kg/m³', value: 985, tex: '\\rho_b', hint: 'A person with lungs half full is roughly 985 kg/m³ and swims with their head just out of the water.' }, rhoW: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 1240, tex: '\\rho_w', hint: '998 for fresh water, 1,025 for the sea, 1,240 for the Dead Sea.' } },
      solveFor: 'f', note: 'The same Archimedes rule as for an iceberg.',
      stories: { f: 'A person of density {rhoB} floats in water of density {rhoW}. What fraction of the body is submerged?' } }
  ],
  examples: [
    { title: 'A tonne of table salt from the sea', q: 'How much sea water must be evaporated to harvest one tonne of sodium chloride, if the sea water holds 10.78 g/kg of sodium and every sodium atom ends up in the salt?',
      steps: [{ text: 'NaCl per kg of sea water, from the sodium (molar masses 58.44 and 22.99):', tex: '10.78 \\times \\frac{58.44}{22.99} = 27.4\\ \\mathrm{g}' }, { text: 'Sea water per tonne of salt:', tex: '\\frac{1000\\ \\mathrm{kg}}{0.0274\\ \\mathrm{kg/kg}} = 36.5\\ \\mathrm{t}' }],
      a: 'At least 36.5 tonnes of sea water for one tonne of salt. Real pans recover only part of it, since the last of the salt stays in the bittern, and they need around 40–50 tonnes.' },
    { title: 'Floating on the Dead Sea', q: 'A person with a density of 985 kg/m³ floats in the Atlantic (1,025 kg/m³) and in the Dead Sea (1,240 kg/m³). How much of the body is under water in each?',
      steps: [{ text: 'Atlantic:', tex: '985/1025 = 96\\ \\%' }, { text: 'Dead Sea:', tex: '985/1240 = 79\\ \\%' }],
      a: '96 % submerged in the ocean — the head just out — and 79 % in the Dead Sea, where a fifth of the body is above water and one can float and read a newspaper.' }
  ],
  quiz: [
    { q: 'Which two ions make up most of the dissolved salt of sea water?', choices: ['Sodium and chloride', 'Calcium and carbonate', 'Magnesium and sulfate', 'Potassium and bromide'], a: 0, why: 'Chloride (19.35 g/kg) and sodium (10.78 g/kg) are 86 % of the 35 g/kg.' },
    { q: 'The salinity of the open ocean is, over geological time, essentially constant because', choices: ['the rivers have stopped bringing salt', 'inputs from rivers and vents are balanced by removal in shells, clays and salt deposits', 'the sea is too big to change', 'salt is destroyed by the Sun'], a: 1, why: 'Sodium has a residence time of about 70 million years: it is supplied and removed at nearly the same rate, so the sea\'s salinity changes little over hundreds of millions of years.' },
    { q: 'If the proportions of salts in sea water are always the same, a single measurement of electrical conductivity gives the salinity.', a: true, why: 'That is the idea of the practical salinity scale, used on every oceanographic instrument. It fails in lakes and brines whose mix is different.' },
    { q: 'Spread over the whole Earth\'s surface (5.1×10⁸ km²), the salt of the oceans would form a layer about how thick, in metres? (Ocean mass 1.4×10²¹ kg, salinity 3.5 %, salt density 2,165 kg/m³.)', answer: 43, unit: 'm', why: '1.4×10²¹ × 0.035 = 4.9×10¹⁹ kg; ÷ 2165 = 2.26×10¹⁶ m³; ÷ 5.1×10¹⁴ m² = 44 m. Over the land alone (1.49×10¹⁴ m²) it would be about 150 m.' },
    { q: 'When sea water is evaporated, the first mineral to crystallise is calcium carbonate, then gypsum, then', choices: ['halite (sodium chloride)', 'magnesium chloride', 'potassium chloride', 'sodium sulfate'], a: 0, why: 'In order of solubility: carbonate, gypsum at about four-fifths evaporated, halite at about nine-tenths. The bitter magnesium and potassium salts come last.' }
  ],
  applications: ['Sea salt and salt production in pans, and the salt mines of Cheshire, Wieliczka and Hallstatt that are old evaporite deposits.', 'Oceanography: salinity and temperature together fix the density of the sea and drive the deep circulation ([[ocean-currents]]).', 'Desalination plants and the brine they discharge, which is saltier and denser than the sea ([[desalination]]).', 'Ship stability and loading: the Plimsoll line gives different marks for fresh water and for the salt water that supports ships higher.', 'Archaeology of climate: the Messinian salt and ice-core and sediment records of past salinity.'],
  history: 'Robert Boyle examined the salinity of sea water in the 1670s; Marcet\'s analysis came in 1819, and the *Challenger* expedition of 1872–76 collected 77 sea-water samples, analysed by Dittmar, who found the constant proportions. Edmond Halley proposed in 1715 that the age of the Earth could be found from the rate of accumulation of salt in the sea. John Joly tried it in 1899 and got 90 million years — an argument that failed by overlooking the removal of salt.',
  sources: ['Millero, Feistel, Wright and McDougall, "The composition of Standard Seawater and the definition of the Reference-Composition Salinity Scale", *Deep-Sea Research I* 55, 50 (2008).', 'Broecker and Peng, *Tracers in the Sea* (1982) — residence times of the elements.', 'IOC, SCOR and IAPSO, *The International Thermodynamic Equation of Seawater — 2010 (TEOS-10)*: density and freezing point of sea water.', 'USGS Water Science School, "Why is the ocean salty?" and "Water density".'],
  sim: 'sol-seawater'
},

/* ================================================================ 9 */
{
  id: 'pure-water-and-conductivity', parent: 'the-liquid-that-pulls-salt-apart', title: 'Pure water and conductivity', level: 2,
  short: 'Pure water is a very poor conductor — 0.055 µS/cm, a resistivity of 18.2 MΩ·cm — because only one molecule in 550 million is ionised. Tap water is a thousand times better, sea water a million, and every bit of that comes from dissolved salts. "Water conducts electricity" really means "salty water does".',
  keywords: ['conductivity', 'conductance', 'pure water', 'ultrapure', 'resistivity', '18.2 megohm', 'microsiemens', 'TDS', 'ions', 'Grotthuss', 'electrolyte', 'does water conduct electricity', 'sea water conductivity'],
  prereq: ['how-salt-dissolves', 'the-proton-hops', 'physics:conduction'],
  related: ['water-the-amphoteric', 'the-salt-of-the-sea', 'ultrapure-water', 'water-treatment', 'the-dielectric-constant', 'medicine:electrolytes', 'chemistry:water-autoionization'],
  body: `
Everyone is told that water and electricity do not mix, and everyone knows that a hair dryer in the bath is lethal. Yet in the laboratories where chips are made the "water" is so pure that it is a good insulator: a cell of 1 cm in length and 1 cm² cross-section filled with it would have a resistance of 18.2 million ohms. The difference is dissolved ions. Electric current in water is not a flow of electrons, as in a wire; it is ions drifting in the field, sodium and calcium towards the negative electrode, chloride and bicarbonate towards the positive one. No ions, no current.

### Pure water has some ions of its own
Water ionises a very little: $2\\,\\ce{H2O} \\rightleftharpoons \\ce{H3O+} + \\ce{OH-}$ ([[water-the-amphoteric]]). At 25 °C the concentration of each ion is $10^{-7}$ mol/L, one for every 550 million molecules. These are not slow ions: the proton moves not by diffusing but by passing along a chain of hydrogen bonds from molecule to molecule ([[the-proton-hops]]), and the hydroxide moves in a similar way, so that their molar conductivities, 349.8 and 198.6 S·cm²/mol, are 5 and 3 times those of sodium (50.1) and chloride (76.3). The conductivity of the purest water is therefore

$$\\kappa = c\\,(\\lambda_{\\ce{H+}} + \\lambda_{\\ce{OH-}}) = (10^{-4}\\ \\mathrm{mol/m^3})(0.0548\\ \\mathrm{S\\,m^2/mol}) = 5.5\\times10^{-6}\\ \\mathrm{S/m} = 0.055\\ \\mathrm{\\mu S/cm}$$

and its resistivity 18.2 MΩ·cm. This is a floor which no amount of cleaning can pass, and it moves with temperature: 0.011 µS/cm at 0 °C, 0.18 at 50 °C, 0.8 at 100 °C, the ionisation and the mobilities both rising on heating.

### Real waters
| Water | Conductivity, µS/cm | Resistivity |
|---|---|---|
| theoretical pure water, 25 °C | 0.055 | 18.2 MΩ·cm |
| laboratory deionised water | 0.1–1 | 1–10 MΩ·cm |
| distilled water, freshly made | 0.5–5 | |
| rain | 5–30 | |
| tap water | 50–800 | 1.2–20 kΩ·cm |
| EU limit for drinking water | 2,500 | |
| human blood plasma | 12,000–15,000 | |
| sea water, 35 g/kg, 25 °C | 53,000 (5.3 S/m) | 19 Ω·cm |

Each ten-fold step in dissolved salt is about a ten-fold step in conductivity, which is why an inexpensive meter is the standard way to check a water supply. As a rule of thumb the mass of total dissolved solids (TDS) in mg/L is about 0.5–0.7 times the conductivity in µS/cm. A salt gives, per mole, about 125 S·cm²/mol for NaCl (126.4 at infinite dilution) falling a little with concentration.

### Why a drop in the air changes it
Left in the open, ultrapure water takes in carbon dioxide from the air within minutes: $\\ce{CO2 + H2O <=> H+ + HCO3-}$. At the CO₂ pressure of the air (about 0.0004 atm) this makes the water mildly acidic, pH 5.6, and raises its conductivity to about 1 µS/cm — twenty times higher. That is why the water in laboratory beakers never reads 0.055, and why semiconductor and power-station plants measure the water in the pipe and not after it has been poured.

### Temperature and dissolved salt
Ionic conductivity rises about 2 % per kelvin, because warmer water is less viscous and the ions move faster; metals do the opposite. Probes therefore report the value converted to 25 °C. Seawater at 35 g/kg gives 4.3 S/m at 15 °C and 5.3 at 25 °C; instruments dropped from ships (CTDs) turn this into salinity ([[the-salt-of-the-sea]]).

### The difference between conducting and being dangerous
Whether a bath is dangerous has less to do with the water than with the body. Wet skin has a resistance of about a kilohm, dry skin a hundred times that; the current passes through the body, and the water is the path that completes the circuit. A bathtub of tap water offers a path of the order of a hundred ohms. Ultrapure water, ironically, is hazardous in another way: it is so hungry for ions that it leaches them from the pipes and from anything it touches, and corrodes copper and dissolves silica ([[ultrapure-water]]).

> [!key] Pure water conducts only 0.055 µS/cm because 1 molecule in 550 million is an ion; dissolve a pinch of salt and the conductivity rises a thousand-fold, because ions, not electrons, carry the current. Hydrogen and hydroxide ions carry it three to five times better than other ions, because protons hop along hydrogen bonds.`,
  ideas: ['Current in water is carried by ions, so conductivity measures how much is dissolved: 0.055 µS/cm for pure water, 50–800 for tap water, 53,000 for the sea.', 'Pure water has ions of its own — $10^{-7}$ mol/L of H₃O⁺ and OH⁻ at 25 °C, one in 550 million molecules — which sets the floor of 18.2 MΩ·cm.', 'H⁺ and OH⁻ conduct 3 to 5 times better than Na⁺ or Cl⁻ because protons are passed along hydrogen bonds rather than dragged through the liquid.', 'Ionic conductivity rises about 2 % per kelvin; CO₂ from the air takes ultrapure water to about 1 µS/cm in minutes.'],
  pitfalls: ['"Water conducts electricity" — Pure water barely does. Salty or mineral water conducts, because of the ions dissolved in it; distilled water in a clean vessel is an insulator by comparison.', '"Pure water is a perfect insulator" — It conducts a little through its own ions, and at a thousandth of tap water\'s level it is still a million times better than quartz.', '"Electrons flow through the water as through a wire" — Electrons are exchanged only at the electrodes (where water splits into hydrogen and oxygen); in between, the ions carry the charge.'],
  terms: [
    { term: 'Electrical conductivity', also: ['κ', 'specific conductance'], def: 'The current density per unit field in a material, S/m (often µS/cm: 1 S/m = 10,000 µS/cm). For water it measures the dissolved ions: 0.055 µS/cm pure, 5.3 S/m sea water.' },
    { term: 'Resistivity', also: ['specific resistance', 'MΩ·cm'], def: 'The reciprocal of conductivity. Ultrapure water at 25 °C has 18.18 MΩ·cm.' },
    { term: 'Molar conductivity', also: ['Λ', 'ionic conductivity'], def: 'The conductivity of a solution divided by its concentration, S·m²/mol. Each ion contributes its own: H⁺ 349.8, OH⁻ 198.6, Cl⁻ 76.3, Na⁺ 50.1 S·cm²/mol at 25 °C.' },
    { term: 'Total dissolved solids', also: ['TDS'], def: 'The mass of dissolved matter per litre, in mg/L. Estimated from conductivity as about 0.5–0.7 times its value in µS/cm.' },
    { term: 'Ion product of water', also: ['K_w', 'autoionisation'], def: 'The product [H₃O⁺][OH⁻] = 10⁻¹⁴ mol²/L² at 25 °C, giving 10⁻⁷ mol/L of each ion in pure water.' }
  ],
  formulas: [
    { name: 'Conductivity of a salt solution', expr: 'kappa = Lam*c', tex: '\\kappa = \\Lambda\\,c',
      vars: { kappa: { name: 'conductivity', q: 'conductivity', unit: 'µS/cm', tex: '\\kappa' }, Lam: { name: 'molar conductivity (S·m²/mol)', unit: 'S·m²/mol', value: 0.0124, tex: '\\Lambda', hint: '0.0124 S·m²/mol = 124 S·cm²/mol is NaCl at about 1 mmol/L; it falls to 0.0090 at 0.6 mol/L.' }, c: { name: 'concentration of the salt', q: 'concentration', unit: 'mM', value: 0.171, hint: '0.171 mmol/L is 10 mg/L of NaCl.' } },
      solveFor: 'kappa', note: 'Valid for a single dilute 1:1 electrolyte; the molar conductivity drops as the concentration rises.',
      stories: { kappa: 'A salt with molar conductivity {Lam} is dissolved at {c}. What is the conductivity?', c: 'A solution of a salt with molar conductivity {Lam} has a conductivity of {kappa}. What is its concentration?' } },
    { name: 'Resistivity and conductivity', expr: 'kappa = 1/rho', tex: '\\kappa = \\frac{1}{\\rho}',
      vars: { kappa: { name: 'conductivity', q: 'conductivity', unit: 'µS/cm', tex: '\\kappa' }, rho: { name: 'resistivity', q: 'resistivity', unit: 'Ω·cm', value: 18.2e6, tex: '\\rho', hint: '18.2 MΩ·cm is 18,200,000 Ω·cm.' } },
      solveFor: 'kappa', note: 'Ultrapure water is always specified by its resistivity, 18.2 MΩ·cm, and everything else by its conductivity.',
      stories: { kappa: 'Ultrapure water has a resistivity of {rho}. What is its conductivity?', rho: 'A water has a conductivity of {kappa}. What is its resistivity?' } },
    { name: 'Dissolved solids from conductivity', expr: 'TDS = 10*f*kappa', tex: '\\mathrm{TDS} = f\\,\\kappa',
      vars: { TDS: { name: 'total dissolved solids', q: 'density', unit: 'g/m³', tex: '\\mathrm{TDS}', hint: 'g/m³ is the same as mg/L.' }, f: { name: 'conversion factor (mg/L per µS/cm)', value: 0.64, min: 0.4, max: 0.9, hint: 'About 0.5 for NaCl-like waters, 0.65 for natural waters, up to 0.9 for sulfate-rich waters.' }, kappa: { name: 'conductivity', q: 'conductivity', unit: 'µS/cm', value: 500, tex: '\\kappa' } },
      solveFor: 'TDS', note: 'An empirical rule. The factor of 10 inside converts from S/m to µS/cm and from kg/m³ to mg/L.',
      stories: { TDS: 'A tap water reads {kappa} on a conductivity meter. With a factor of {f}, how much dissolved solid does it hold?' } },
    { name: 'Correcting the reading to 25 °C', expr: 'k25 = kT/(1 + a*(T - Tref))', tex: '\\kappa_{25} = \\frac{\\kappa_T}{1 + a\\,(T - T_\\mathrm{ref})}',
      vars: { k25: { name: 'conductivity at 25 °C', q: 'conductivity', unit: 'µS/cm', tex: '\\kappa_{25}' }, kT: { name: 'conductivity read at temperature T', q: 'conductivity', unit: 'µS/cm', value: 420, tex: '\\kappa_T' }, a: { name: 'temperature coefficient', unit: '1/K', value: 0.02, fixed: true, tex: 'a', hint: 'About 2 % per kelvin for natural waters; 1.9–2.2 %.' }, T: { name: 'temperature of the measurement', q: 'temperature', unit: '°C', value: 15, min: 0, max: 40 }, Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true, tex: 'T_\\mathrm{ref}' } },
      solveFor: 'k25', note: 'Linear compensation; good to a few per cent between 5 and 35 °C. Pure water needs a stronger correction (about 5 % per kelvin).',
      stories: { k25: 'A probe in {T} water reads {kT}. What would it read at 25 °C?' } }
  ],
  derivation: { title: 'Where 0.055 µS/cm comes from', steps: [
    { text: 'The conductivity is the sum, over the ions, of concentration times molar conductivity. Pure water has $c = 10^{-7}$ mol/L $= 10^{-4}$ mol/m³ of each of two ions (from $K_w = 10^{-14}$):', tex: '\\kappa = c_{\\ce{H+}}\\,\\lambda_{\\ce{H+}} + c_{\\ce{OH-}}\\,\\lambda_{\\ce{OH-}}' },
    { text: 'With the molar conductivities at infinite dilution, 349.8 and 198.6 S·cm²/mol (0.03498 and 0.01986 S·m²/mol):', tex: '\\kappa = (10^{-4})(0.03498 + 0.01986) = 5.48\\times10^{-6}\\ \\mathrm{S/m}' },
    { text: 'In the units of the instrument, with 1 S/m = 10⁴ µS/cm, and the reciprocal for the resistivity:', tex: '\\kappa = 0.0548\\ \\mathrm{\\mu S/cm},\\qquad \\rho = \\frac{1}{\\kappa} = 18.2\\ \\mathrm{M\\Omega\\,cm}' }
  ] },
  examples: [
    { title: 'A pinch in the bath', q: 'Ten milligrams of table salt are stirred into a litre of ultrapure water. What conductivity results, and how many times that of the pure water?',
      steps: [{ text: 'Concentration: $0.010/58.44 = 1.71\\times10^{-4}$ mol/L $= 0.171$ mol/m³.' }, { text: 'Conductivity, with $\\Lambda \\approx 0.0124$ S·m²/mol:', tex: '\\kappa = 0.0124 \\times 0.171 = 2.1\\times10^{-3}\\ \\mathrm{S/m} = 21\\ \\mu\\mathrm{S/cm}' }, { text: 'Ratio to the pure water:', tex: '21/0.055 = 390' }],
      a: '21 µS/cm, nearly 400 times the conductivity of the pure water. Ten milligrams, a few grains, are enough to bring it into the range of rain.' },
    { title: 'Why sea water reads 5 S/m', q: 'Sea water is about 0.6 mol/L of NaCl (plus other salts). Estimate its conductivity, taking the molar conductivity of NaCl at that concentration as 88 S·cm²/mol.',
      steps: [{ text: 'Convert the concentration: 0.6 mol/L = $6\\times10^{-4}$ mol/cm³.' }, { text: 'Multiply:', tex: '\\kappa = (88\\ \\mathrm{S\\,cm^2/mol})(6\\times10^{-4}\\ \\mathrm{mol/cm^3}) = 0.053\\ \\mathrm{S/cm} = 5.3\\ \\mathrm{S/m}' }],
      a: '5.3 S/m, in agreement with the measured 5.3 S/m at 25 °C. Sea water is nearly a hundred thousand times as conductive as the purest water.' }
  ],
  quiz: [
    { q: 'The conductivity of perfectly pure water is about 0.055 µS/cm. What is its resistivity, in MΩ·cm?', answer: 18.2, unit: 'MΩ·cm', why: '1/(0.055×10⁻⁶ S/cm) = 1.82×10⁷ Ω·cm = 18.2 MΩ·cm.' },
    { q: 'Why does pure water conduct at all?', choices: ['It contains free electrons', 'A very small fraction of its molecules are ionised into H₃O⁺ and OH⁻', 'Impurities always remain', 'Hydrogen bonds carry current'], a: 1, why: 'Autoionisation gives 10⁻⁷ mol/L of each ion at 25 °C, one in 550 million molecules. Real water has impurities too, but even the purest still conducts.' },
    { q: 'Hydrogen ions (H⁺) conduct better in water than sodium ions because', choices: ['they are smaller', 'they carry a larger charge', 'the proton is passed from molecule to molecule along hydrogen bonds', 'they react with electrons'], a: 2, why: 'The Grotthuss mechanism ([[the-proton-hops]]) moves the charge without moving the whole ion: 349.8 against 50.1 S·cm²/mol.' },
    { q: 'A conductivity meter reads 600 µS/cm for a stream at 10 °C. At 25 °C the same water reads about', choices: ['450 µS/cm', '600 µS/cm', '780 µS/cm', '1,200 µS/cm'], a: 2, why: 'Conductivity rises about 2 % per kelvin: 15 K more gives 30 %, so 600 × 1.3 = 780 µS/cm. The probe\'s temperature compensation does that sum.' },
    { q: 'Ultrapure water left in an open beaker keeps its 0.055 µS/cm.', a: false, why: 'Carbon dioxide from the air dissolves, forming H⁺ and HCO₃⁻, and takes the water to about 1 µS/cm and pH 5.6 within minutes.' }
  ],
  applications: ['Conductivity meters check drinking water, aquarium and hydroponic nutrient solutions, boiler water and rivers; the factor to total dissolved solids (TDS) is printed on pocket meters.', 'Semiconductor and pharmaceutical plants specify 18.2 MΩ·cm water, and monitor the resistivity in the pipe as a first alarm for contamination ([[ultrapure-water]]).', 'Oceanographers measure conductivity, temperature and depth (a CTD) to find salinity and density at every depth.', 'Electrochemistry and the electrolysis of water for hydrogen: pure water needs salt, acid or base added before the cell will pass useful current.', 'Medical bio-impedance, heart-rate and body-fat scales send small currents through the body\'s salty water; sweat sensors and cardiograph electrodes use saline gel.'],
  history: 'Friedrich Kohlrausch measured the conductivity of electrolytes with alternating current at Göttingen and Würzburg in the 1870s–80s and found that each ion contributes independently at high dilution (the law of independent migration of ions). With Heydweiller he made the purest water of his time in 1894 and measured a value consistent with water\'s ionisation: the number from which the ion product was first obtained.',
  sources: ['CRC *Handbook of Chemistry and Physics*: limiting ionic conductivities and conductivity of aqueous solutions; the conductivity of pure water against temperature.', 'IOC, SCOR and IAPSO, *TEOS-10* and the Practical Salinity Scale 1978 — conductivity of sea water.', 'Atkins and de Paula, *Physical Chemistry*, chapter on ionic conductivity and Grotthuss mechanism.', 'Agmon, "The Grotthuss mechanism", *Chemical Physics Letters* 244, 456 (1995).'],
  sim: { id: 'sol-conductivity-ph', params: { focus: 'conductivity' } }
},

/* ================================================================ 10 */
{
  id: 'water-the-amphoteric', parent: 'the-liquid-that-pulls-salt-apart', title: 'Water, acid and base', level: 2,
  short: 'Water can give a proton and take one, so it is both an acid and a base, and it ionises itself: 2 H₂O ⇌ H₃O⁺ + OH⁻, with an ion product of 10⁻¹⁴ at 25 °C. That makes pH 7 neutral only at 25 °C — at 100 °C neutral water has pH 6.1 — and sets the stage for every acid, base and buffer, from the blood (pH 7.4) to the sea (pH 8.1).',
  keywords: ['amphoteric', 'autoionisation', 'ion product of water', 'Kw', 'pH', 'neutral', 'hydronium', 'hydroxide', 'Brønsted', 'levelling effect', 'buffer', 'blood pH', 'ocean acidification', 'pKw'],
  prereq: ['pure-water-and-conductivity', 'the-proton-hops', 'chemistry:acid-base-theory'],
  related: ['gases-in-water', 'the-salt-of-the-sea', 'water-as-a-reagent', 'proton-wires-and-enzymes', 'hard-water-and-limescale', 'chemistry:water-autoionization', 'chemistry:ph-scale', 'biology:ph-in-biology', 'medicine:acid-base-balance'],
  body: `
Ask anyone the pH of pure water and they say 7. That is true at 25 °C, and false at every other temperature. The number is a consequence of one fact about the water molecule: it is both an acid and a base, and therefore reacts with itself.

### Water reacts with water
A proton can leave one molecule and attach to a lone pair on a neighbour, along a hydrogen bond:

$$\\ce{2H2O <=> H3O+ + OH-}$$

The ions are short-lived — the proton that has just hopped across lasts a picosecond or so before it hops again ([[the-proton-hops]]) — but at any moment there are some. The **ion product** is $K_w = [\\ce{H3O+}][\\ce{OH-}]$, which at 25 °C is $1.0\\times10^{-14}$ mol²/L², so in pure water each ion is $10^{-7}$ mol/L: one molecule in 550 million is ionised. A free proton never exists in water; it is bound as $\\ce{H3O+}$ (itself solvated by more water, in forms such as $\\ce{H9O4+}$).

Because water gives and takes protons, it is *amphoteric*, in the Brønsted–Lowry view of acids (proton donors) and bases (proton acceptors). With a base like ammonia it acts as an acid: $\\ce{NH3 + H2O <=> NH4+ + OH-}$. With an acid like HCl it acts as a base: $\\ce{HCl + H2O -> H3O+ + Cl-}$. Its own acid strength is tiny — $\\mathrm{p}K_a = 15.7$ — and so is the strength of its conjugate acid $\\ce{H3O+}$ ($\\mathrm{p}K_a = -1.7$).

### Neutral is not always 7
Neutral means $[\\ce{H3O+}] = [\\ce{OH-}]$, that is $\\mathrm{pH} = \\tfrac{1}{2}\\mathrm{p}K_w$. Autoionisation absorbs heat (56 kJ/mol: the hydrogen bonds must be disrupted), so it increases with temperature and the neutral pH goes down:

| Temperature | p$K_w$ | Neutral pH | Ions per molecule |
|---|---|---|---|
| 0 °C | 14.94 | 7.47 | 6 × 10⁻¹⁰ |
| 25 °C | 14.00 | 7.00 | 1.8 × 10⁻⁹ |
| 50 °C | 13.26 | 6.63 | 4.2 × 10⁻⁹ |
| 100 °C | 12.26 | 6.13 | 1.3 × 10⁻⁸ |
| 250 °C | 11.2 | 5.6 | |

Water at 100 °C of pH 6.1 is not acidic; it is exactly neutral, with equal numbers of the two ions. A pH of 7.0 at 100 °C would be slightly *basic*. A boiler operator wants a neutral pH of 5.6 at 250 °C. A pH meter that is not temperature-compensated would give the wrong answer; every one of them has a temperature input. (Heavy water has $\\mathrm{p}K_w = 14.87$ at 25 °C, and neutral pD is 7.4.)

### Levelling: the strongest acid water allows
No acid stronger than $\\ce{H3O+}$ can exist in water, because it would hand its proton on to the solvent. HCl, HBr, HNO₃ and HClO₄ all appear as equally strong in water; to rank them one uses a weaker acid as solvent, such as acetic acid. In the same way, the strongest base in water is $\\ce{OH-}$. This is the **levelling effect**.

### Pure water has no defence
Pure water has no buffer capacity. One drop (0.05 mL) of 1 mol/L HCl in a litre of pure water makes $5\\times10^{-5}$ mol/L of $\\ce{H3O+}$ and takes the pH from 7 to 4.3. Water in contact with air quickly takes in CO₂ and reaches 5.6; rain is naturally that acidic, and "acid rain" is below 5.

### Buffers: the sea and the blood
A **buffer** is a weak acid with its conjugate base, which resists change of pH by absorbing added acid or base. Blood is held at pH 7.35–7.45 chiefly by the carbonic acid–bicarbonate pair, according to $\\mathrm{pH} = 6.1 + \\log\\left([\\ce{HCO3-}]/[\\ce{CO2}]\\right)$ = 6.1 + log(24 mmol/L ÷ 1.2 mmol/L) = 7.40. A fall to below 6.8 or a rise above 7.8 is incompatible with life; the lungs adjust the CO₂ within seconds and the kidneys the bicarbonate within hours ([[medicine:acid-base-balance|acid–base balance]]). The sea has a similar carbonate buffer, which holds its surface at pH 8.1. As the oceans absorb about a quarter of the CO₂ we emit, the pH has fallen by about 0.1 since the 1800s: a 26 % rise in the concentration of $\\ce{H3O+}$ (the scale is logarithmic), and a fall in the carbonate that shell-builders use ([[the-salt-of-the-sea]], [[gases-in-water]]).

> [!key] Water ionises itself, $\\ce{2H2O <=> H3O+ + OH-}$, with $K_w = 10^{-14}$ at 25 °C. So pH 7 is neutral only at that temperature (6.1 at 100 °C), no acid stronger than $\\ce{H3O+}$ can exist in water, and pure water, with no buffer, changes pH at the touch of a drop of acid or a breath of CO₂.`,
  ideas: ['Water is amphoteric: it can donate a proton (acid) and accept one (base), and it does both to itself: $\\ce{2H2O <=> H3O+ + OH-}$.', '$K_w = [\\ce{H3O+}][\\ce{OH-}] = 10^{-14}$ at 25 °C, so pure water has $10^{-7}$ mol/L of each ion — one molecule in 550 million.', 'Neutral means equal ions, not pH 7: $K_w$ grows with temperature, and neutral pH is 7.47 at 0 °C, 7.00 at 25 °C and 6.13 at 100 °C.', 'Buffers (the carbonate system of the blood, pH 7.4, and the sea, pH 8.1) hold the pH; pure water has none.'],
  pitfalls: ['"Neutral is pH 7" — Neutral is [H₃O⁺] = [OH⁻], which is pH 7 only at 25 °C. Water at 100 °C has pH 6.13 and is neutral.', '"A solution of pH 6 must be acidic" — Only compared with the neutral point at the same temperature. At 25 °C, pH 6 is acidic; at 100 °C, it is slightly basic.', '"A dilute acid of 10⁻⁸ mol/L has pH 8" — An acid cannot make water basic. The water\'s own ions (10⁻⁷ mol/L) must be counted, and the true pH is 6.98.'],
  terms: [
    { term: 'Amphoteric', also: ['amphiprotic'], def: 'Able to act as an acid or as a base. Water donates protons to bases and accepts them from acids.' },
    { term: 'Autoionisation', also: ['autoprotolysis', 'self-ionisation'], def: 'The reaction of a liquid with itself to give ions: 2 H₂O ⇌ H₃O⁺ + OH⁻ for water, 10⁻⁷ mol/L of each at 25 °C.' },
    { term: 'Ion product of water', also: ['K_w', 'pK_w'], def: 'The product [H₃O⁺][OH⁻]: 10⁻¹⁴ at 25 °C, 1.15 × 10⁻¹⁵ at 0 °C and 5.5 × 10⁻¹³ at 100 °C. pK_w = −log K_w.' },
    { term: 'pH', also: ['potential of hydrogen'], def: 'The negative decimal logarithm of the hydronium activity (concentration in mol/L for dilute solutions). 7.00 for pure water at 25 °C, 7.4 for blood, 8.1 for the sea.' },
    { term: 'Levelling effect', also: ['levelling'], def: 'The fact that all acids stronger than H₃O⁺ look equally strong in water, as they all give up their protons to the solvent; likewise for bases stronger than OH⁻.' },
    { term: 'Buffer', also: ['buffer solution', 'buffering'], def: 'A weak acid with its conjugate base, which resists a change of pH when acid or base is added. The pH is pK_a + log([base]/[acid]).' }
  ],
  formulas: [
    { name: 'The ion product of water', expr: 'Kw = H*OH', tex: 'K_w = \\mathrm{[\\ce{H3O+}]}\\,\\mathrm{[\\ce{OH-}]}',
      vars: { Kw: { name: 'ion product K_w (mol²/L²)', value: 1e-14, tex: 'K_w', hint: '1.15 × 10⁻¹⁵ at 0 °C, 1.0 × 10⁻¹⁴ at 25 °C, 5.5 × 10⁻¹³ at 100 °C.' }, H: { name: '[H₃O⁺] (mol/L)', value: 1e-7, tex: '\\mathrm{[\\ce{H3O+}]}' }, OH: { name: '[OH⁻] (mol/L)', tex: '\\mathrm{[\\ce{OH-}]}' } },
      solveFor: 'OH', note: 'Concentrations in mol/L, not SI (see the note on logarithms). Valid in all dilute aqueous solutions at the given temperature.',
      stories: { OH: 'A solution has a hydronium concentration of {H} mol/L and $K_w$ of {Kw}. What is the hydroxide concentration (mol/L)?' } },
    { name: 'pH', expr: 'pH = -log(H)', tex: '\\mathrm{pH} = -\\log \\mathrm{[\\ce{H3O+}]}',
      vars: { pH: { name: 'pH', tex: '\\mathrm{pH}' }, H: { name: '[H₃O⁺] (mol/L)', value: 1e-7, tex: '\\mathrm{[\\ce{H3O+}]}' } },
      solveFor: 'pH', note: 'Strictly the activity of H₃O⁺, which equals the concentration in dilute solutions. A change of one pH unit is a factor of ten in concentration.',
      stories: { pH: 'A solution has [H₃O⁺] = {H} mol/L. What is its pH?', H: 'A solution has pH {pH}. What is [H₃O⁺] in mol/L?' } },
    { name: 'The pH of neutral water', expr: 'pHn = pKw/2', tex: '\\mathrm{pH}_\\mathrm{neutral} = \\frac{{\\mathrm{p}K}_w}{2}',
      vars: { pHn: { name: 'pH of neutral water', tex: '\\mathrm{pH}_\\mathrm{neutral}' }, pKw: { name: 'pK_w at the temperature', value: 13.995, min: 10, max: 16, tex: '{\\mathrm{p}K}_w', hint: '14.94 at 0 °C, 13.995 at 25 °C, 13.26 at 50 °C, 12.26 at 100 °C.' } },
      solveFor: 'pHn', note: 'Neutral means equal hydronium and hydroxide, so each has concentration $\\sqrt{K_w}$.',
      stories: { pHn: 'Water at a temperature where pK_w is {pKw} is neutral. What is its pH?' } },
    { name: 'The Henderson–Hasselbalch buffer equation', expr: 'pH = pKa + log(B/A)', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{\\mathrm{[B]}}{\\mathrm{[A]}}',
      vars: { pH: { name: 'pH of the buffer', tex: '\\mathrm{pH}' }, pKa: { name: 'pK_a of the weak acid', value: 6.1, tex: '{\\mathrm{p}K}_a', hint: '6.1 for the CO₂ / bicarbonate pair in blood (an apparent value that includes dissolved CO₂).' }, B: { name: 'concentration of the base (conjugate)', q: 'concentration', unit: 'mM', value: 24, tex: '\\mathrm{[B]}', hint: 'Bicarbonate in blood: 24 mmol/L.' }, A: { name: 'concentration of the acid', q: 'concentration', unit: 'mM', value: 1.2, tex: '\\mathrm{[A]}', hint: 'Dissolved CO₂ in blood at 40 mmHg: 0.03 × 40 = 1.2 mmol/L.' } },
      solveFor: 'pH', note: 'The blood example gives pH 7.40. A buffer works best within one pH unit of its pK_a.',
      stories: { pH: 'A buffer has pK_a {pKa}, {B} of base and {A} of acid. What is its pH?', B: 'A buffer of pK_a {pKa} and {A} of acid has pH {pH}. What concentration of base does it hold?' } },
    { name: 'The fraction of molecules ionised', expr: 'x = sqrt(Kw)/cw', tex: 'x = \\frac{\\sqrt{K_w}}{c_w}',
      vars: { x: { name: 'fraction of molecules ionised', hint: 'One in 550 million at 25 °C.' }, Kw: { name: 'ion product K_w (mol²/L²)', value: 1e-14, tex: 'K_w' }, cw: { name: 'molar concentration of water (mol/L)', value: 55.5, fixed: true, tex: 'c_w' } },
      solveFor: 'x', note: 'Each ionised molecule makes one hydronium ion, so the fraction is $[\\ce{H3O+}]/c_w$. 1.8 × 10⁻⁹ at 25 °C.',
      stories: { x: 'At a temperature where K_w is {Kw}, what fraction of the water molecules is ionised?' } }
  ],
  examples: [
    { title: 'Neutral water at 100 °C', q: 'At 100 °C, $\\mathrm{p}K_w = 12.26$. What are the hydronium concentration and the pH of pure water, and is it acidic?',
      steps: [{ text: 'Equal ions, so each has concentration $\\sqrt{K_w}$:', tex: '[\\ce{H3O+}] = 10^{-12.26/2} = 10^{-6.13} = 7.4\\times10^{-7}\\ \\mathrm{mol/L}' }, { text: 'pH:', tex: '\\mathrm{pH} = 6.13' }],
      a: 'pH 6.13, and it is exactly neutral because [OH⁻] is also 7.4 × 10⁻⁷ mol/L. At this temperature a solution of pH 7.0 would be basic: its [OH⁻] would be six times its [H₃O⁺].' },
    { title: 'A very dilute acid', q: 'What is the pH of 1.0 × 10⁻⁸ mol/L hydrochloric acid at 25 °C?',
      steps: ['Two sources of H₃O⁺: the acid (1.0 × 10⁻⁸ mol/L) and the water. Let $x = [\\ce{H3O+}]$; charge balance gives $x = 10^{-8} + [\\ce{OH-}] = 10^{-8} + K_w/x$.', { text: 'Solving the quadratic:', tex: 'x^2 - 10^{-8}x - 10^{-14} = 0 \\Rightarrow x = 1.05\\times10^{-7}\\ \\mathrm{mol/L}' }, { text: 'pH:', tex: '\\mathrm{pH} = 6.98' }],
      a: 'pH 6.98, not 8. An acid can never make water basic: the water\'s own ions, 10⁻⁷ mol/L, dominate when the acid is that dilute.' }
  ],
  quiz: [
    { q: 'Pure water at 100 °C has pH 6.13. It is', choices: ['acidic', 'neutral', 'basic', 'impossible to tell'], a: 1, why: 'Neutral means equal concentrations of H₃O⁺ and OH⁻. At 100 °C K_w = 5.5×10⁻¹³, so each is 7.4×10⁻⁷ mol/L and pH = 6.13.' },
    { q: 'Why are HCl and HNO₃ equally strong in water?', choices: ['They are identical molecules', 'Both are completely ionised, and no acid stronger than H₃O⁺ can exist in water (levelling)', 'Water is a neutral solvent', 'They have the same pK_a'], a: 1, why: 'Both hand their proton entirely to water, so what is left is H₃O⁺ in either case. Their intrinsic difference shows only in a weaker-basic solvent such as acetic acid.' },
    { q: 'Raising the temperature of pure water makes it acidic, because its pH falls.', a: false, why: 'Its pH falls because K_w rises, but [H₃O⁺] and [OH⁻] stay equal. Water stays neutral at every temperature.' },
    { q: 'What pH does a buffer have with pK_a = 6.1, 24 mmol/L of base and 1.2 mmol/L of acid? (This is blood bicarbonate.)', answer: 7.40, why: 'pH = 6.1 + log(24/1.2) = 6.1 + log 20 = 6.1 + 1.30 = 7.40.' },
    { q: 'The pH of the surface ocean has fallen by about 0.1 since the 1800s. The hydronium concentration has risen by about', choices: ['1 %', '10 %', '26 %', '100 %'], a: 2, why: '10^0.1 = 1.26: the concentration of H₃O⁺ is 26 % higher. A pH change of 0.3 would be a doubling.' }
  ],
  applications: ['Acid–base titration, pH meters and indicators all depend on water\'s ion product; electrodes are calibrated at a known temperature.', 'Boiler and power-plant water chemistry controls the pH at operating temperature, where the neutral point has moved.', 'Blood gas analysis and intensive care keep the blood pH at 7.4 by managing CO₂ and bicarbonate ([[medicine:electrolytes]]).', 'Ocean acidification: the pH of the sea, the carbonate available for shells and the survival of corals and plankton.', 'Swimming pools, aquaria and agriculture hold pH within a narrow range with buffers; soil pH controls which nutrients dissolve.'],
  history: 'Kohlrausch and Heydweiller\'s measurements of the conductivity of the purest water (1894) first gave the concentration of H₃O⁺ and OH⁻ in it. Søren Sørensen introduced pH at the Carlsberg laboratory in 1909 to describe the acidity of beer brewing, and Johannes Brønsted and Thomas Lowry independently proposed the proton-transfer definition of acids in 1923.',
  sources: ['Marshall and Franck, "Ion product of water substance, 0–1000 °C, 1–10,000 bars", *Journal of Physical and Chemical Reference Data* 10, 295 (1981) — p$K_w$ against temperature.', 'CRC *Handbook of Chemistry and Physics*: ion product of water and the dissociation of weak acids.', 'IPCC, *Sixth Assessment Report*, Working Group I, chapters 2 and 5: the pH of the surface ocean and its fall.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017) — water as a protic, amphoteric reagent.'],
  sim: { id: 'sol-conductivity-ph', params: { focus: 'ph', T: 100 } }
},

/* ================================================================ 11 */
{
  id: 'hard-water-and-limescale', parent: 'the-liquid-that-pulls-salt-apart', title: 'Hard water and limescale', level: 1,
  short: 'Hard water has picked up calcium and magnesium ions from limestone. Warm it and the dissolved bicarbonate turns back into solid calcium carbonate: kettle fur, clogged pipes and soap scum on one side, stalactites on the other. A water with 200 mg/L of hardness can leave up to 0.2 g of scale for every litre boiled.',
  keywords: ['hard water', 'limescale', 'kettle fur', 'calcium carbonate', 'temporary hardness', 'permanent hardness', 'water softener', 'ion exchange', 'degrees of hardness', 'soap scum', 'stalactites', 'dH', 'mg/L as CaCO3'],
  prereq: ['how-salt-dissolves', 'gases-in-water', 'water-the-amphoteric'],
  related: ['weathering-and-caves', 'water-treatment', 'drinking-water-and-thirst', 'water-cools-machines', 'soap-and-surfactants', 'the-salt-of-the-sea', 'chemistry:solubility-product', 'chemistry:equilibrium', 'chemistry:le-chatelier'],
  body: `
Inside most kettles there is a pale crust, and in most showers a white fur around the holes. It is calcium carbonate, the stuff of chalk and shells, and it was dissolved in the water you drank. The mineral that made it dissolve in the first place was the same one that decorates caves and builds seashells.

### How water becomes hard
Rain falls through air and soil with dissolved carbon dioxide and is slightly acidic. When it meets limestone or chalk (CaCO₃) or dolomite (CaMg(CO₃)₂) it dissolves a little:

$$\\ce{CaCO3 + CO2 + H2O <=> Ca^2+ + 2HCO3-}$$

Limestone alone is nearly insoluble in pure water (15 mg/L); with CO₂ the water can carry 10 to 30 times that. The water that has done this is **hard**: its hardness is the amount of dissolved calcium and magnesium (and a little iron and strontium), by tradition quoted as the mass of calcium carbonate that would hold the same amount, in mg/L. By the USGS scale, below 60 mg/L is soft, 61–120 moderately hard, 121–180 hard and above 180 very hard. London\'s tap water is about 270 mg/L, Manchester\'s about 30.

| Unit | Equals, in mg/L as CaCO₃ |
|---|---|
| 1 mmol/L of Ca²⁺ or Mg²⁺ | 100.1 |
| 1 German degree, °dH | 17.85 |
| 1 French degree, °fH | 10.0 |
| 1 English (Clark) degree | 14.25 |
| 1 US grain per gallon | 17.1 |

### Heat undoes it
The reaction above runs back when the water warms: CO₂ is less soluble hot ([[gases-in-water]]), it leaves, and the equilibrium shifts:

$$\\ce{Ca^2+ + 2HCO3- -> CaCO3(s) + CO2(g) + H2O}$$

Solid calcium carbonate forms on the element, the walls and the inside of pipes. That part of the hardness is called **temporary** hardness (or carbonate hardness) because boiling removes it. What remains after boiling, calcium and magnesium combined with sulfate or chloride, is **permanent** hardness. A cave does the same thing with time instead of a stove: a drop of water hanging on the ceiling loses CO₂ to the cave air, and a speck of calcite is left behind. Over thousands of years stalactites grow, a fraction of a millimetre per year ([[weathering-and-caves]]).

### Why it matters
- **Scale.** An element under a layer of scale conducts heat out poorly (calcite scale 1–3 W/(m·K), copper 400) and runs hotter and fails sooner. Boilers, heat exchangers and water pipes silt up; scale of a few millimetres can halve the flow in a small pipe.
- **Soap.** Calcium and magnesium combine with soap anions to make insoluble scum: $\\ce{Ca^2+ + 2 C17H35COO- -> Ca(C17H35COO)2(s)}$. Hard water takes about 6 mg of soap for every milligram of hardness (as CaCO₃) in the water before any lather forms. Synthetic detergents, whose calcium salts are more soluble, were developed partly to get round this.
- **Protection.** The same scale coats the inside of pipes and protects old lead and iron pipes from corrosion; Roman lead pipes survive in hard-water regions. Calcium and magnesium in water are also minor nutrients. The WHO sets no health-based limit for hardness.

### Softening
- **Boiling** removes temporary hardness only.
- **Lime softening** (Thomas Clark, 1841) adds calcium hydroxide, which turns the bicarbonate into insoluble carbonate that can be filtered off.
- **Ion exchange** resins hold sodium and swap it for calcium and magnesium; they are regenerated with a strong salt solution. Softened water has more sodium, not less dissolved matter.
- **Reverse osmosis** and distillation remove nearly everything.
- **Chelating agents** (citric acid, EDTA, polyphosphates) tie up the calcium so that it does not form scale. Descaling a kettle with vinegar or citric acid dissolves the carbonate back into solution. Magnetic and electronic descalers have not been shown to work.

> [!key] Hard water is rain that has dissolved limestone with the help of CO₂. Heating, or the drip of a cave roof, drives the CO₂ off and the calcium carbonate comes back out: as kettle scale, as scum with soap, as stalactites. The hardness in mg/L as CaCO₃, times the volume and the fraction that comes out, gives the scale.`,
  ideas: ['Rain with dissolved CO₂ dissolves limestone to calcium and bicarbonate ions: that is hardness.', 'Heating, or loss of CO₂, reverses the reaction and precipitates calcium carbonate: limescale, which is the "temporary" hardness; sulfate and chloride hardness stays.', 'Hardness is quoted as mg/L of CaCO₃ (100 mg/L = 1 mmol/L); above 180 mg/L is very hard.', 'Calcium and magnesium also bind soap; softening removes them by lime, ion exchange, reverse osmosis or chelation.'],
  pitfalls: ['"Hard water is dirty or unhealthy" — It is clean and harmless to drink; the hardness is dissolved minerals. It spoils soap, kettles and boilers, not health.', '"Softened water contains fewer dissolved salts" — Ion exchange swaps calcium for sodium ion for ion (two sodium per calcium), so the dissolved matter is not reduced and the sodium content is higher.', '"Limescale is lime" — Lime is calcium oxide. Limescale is calcium carbonate (mostly calcite, sometimes aragonite), the same material as chalk, marble and shells.'],
  terms: [
    { term: 'Hardness', also: ['total hardness', 'water hardness'], def: 'The concentration of dissolved calcium and magnesium (and other divalent metal) ions in water, quoted as the equivalent mass of CaCO₃ per litre: 100.1 mg/L per mmol/L.' },
    { term: 'Temporary hardness', also: ['carbonate hardness'], def: 'The part of the hardness that comes with hydrogen carbonate and is removed by boiling, which turns it into solid calcium carbonate.' },
    { term: 'Permanent hardness', also: ['non-carbonate hardness'], def: 'The part of the hardness belonging to sulfate, chloride and nitrate salts of calcium and magnesium, which boiling does not remove.' },
    { term: 'Limescale', also: ['scale', 'kettle fur'], def: 'A hard deposit of calcium carbonate (calcite or aragonite) from hard water on hot surfaces and in pipes.' },
    { term: 'Ion exchange', also: ['water softener'], def: 'Swapping the calcium and magnesium of hard water for sodium on a resin bed, which is regenerated with salt water.' },
    { term: 'Degree of hardness', also: ['°dH', '°fH', 'grains per gallon'], def: 'A traditional unit of water hardness: the German degree (17.85 mg/L as CaCO₃), the French degree (10), the English or Clark degree (14.25) and the US grain per gallon (17.1).' }
  ],
  formulas: [
    { name: 'Scale from a volume of water', expr: 'm = H*V*f', tex: 'm = H\\,V\\,f',
      vars: { m: { name: 'mass of scale', q: 'mass', unit: 'g' }, H: { name: 'hardness as CaCO₃ (g/m³ is the same as mg/L)', q: 'density', unit: 'g/m³', value: 200 }, V: { name: 'volume of water heated', q: 'volume', unit: 'L', value: 1.5 }, f: { name: 'fraction that comes out of solution', q: 'ratio', unit: '%', value: 70, min: 0, max: 100, hint: 'Boiling removes the carbonate hardness, 60–80 % of the total in most waters, but never all: about 15 mg/L stays in solution.' } },
      solveFor: 'm', note: 'Each mmol of Ca²⁺ in bicarbonate form gives one mmol (100 mg) of CaCO₃.',
      stories: { m: 'A kettle boils {V} of water with a hardness of {H}, and a fraction {f} of it comes out. How much scale is left in it?' } },
    { name: 'Hardness from calcium and magnesium', expr: 'H = (Ca/MCa + Mg/MMg)*MCO3', tex: 'H = \\left(\\frac{\\mathrm{[Ca]}}{M_\\mathrm{Ca}} + \\frac{\\mathrm{[Mg]}}{M_\\mathrm{Mg}}\\right)M_{\\ce{CaCO3}}',
      vars: { H: { name: 'hardness as CaCO₃', q: 'density', unit: 'g/m³' }, Ca: { name: 'calcium', q: 'density', unit: 'g/m³', value: 80, tex: '\\mathrm{[Ca]}' }, MCa: { name: 'molar mass of calcium', q: 'molarmass', unit: 'g/mol', value: 40.078, fixed: true, tex: 'M_\\mathrm{Ca}' }, Mg: { name: 'magnesium', q: 'density', unit: 'g/m³', value: 20, tex: '\\mathrm{[Mg]}' }, MMg: { name: 'molar mass of magnesium', q: 'molarmass', unit: 'g/mol', value: 24.305, fixed: true, tex: 'M_\\mathrm{Mg}' }, MCO3: { name: 'molar mass of CaCO₃', q: 'molarmass', unit: 'g/mol', value: 100.086, fixed: true, tex: 'M_{\\ce{CaCO3}}' } },
      solveFor: 'H', note: 'The same as the familiar $2.497\\,[\\mathrm{Ca}] + 4.118\\,[\\mathrm{Mg}]$ in mg/L. 80 mg/L Ca and 20 mg/L Mg give 282 mg/L: very hard.',
      stories: { H: 'A water analysis shows {Ca} of calcium and {Mg} of magnesium. What is its hardness as CaCO₃?' } },
    { name: 'Soap lost to hardness', expr: 'ms = 2*H*V*Msoap/Mcalc', tex: 'm_\\mathrm{soap} = \\frac{2\\,H\\,V\\,M_\\mathrm{soap}}{M_{\\ce{CaCO3}}}',
      vars: { ms: { name: 'mass of soap that forms scum', q: 'mass', unit: 'g', tex: 'm_\\mathrm{soap}' }, H: { name: 'hardness as CaCO₃', q: 'density', unit: 'g/m³', value: 200 }, V: { name: 'volume of water', q: 'volume', unit: 'L', value: 150, hint: 'A full bath holds 150–200 L.' }, Msoap: { name: 'molar mass of the soap (sodium stearate)', q: 'molarmass', unit: 'g/mol', value: 306.5, fixed: true, tex: 'M_\\mathrm{soap}' }, Mcalc: { name: 'molar mass of CaCO₃', q: 'molarmass', unit: 'g/mol', value: 100.086, fixed: true, tex: 'M_{\\ce{CaCO3}}' } },
      solveFor: 'ms', note: 'Two soap anions per divalent ion. Ignores the partial solubility of the scum.',
      stories: { ms: 'A bath of {V} has a hardness of {H}. How much sodium stearate soap is wasted before the water can lather?' } },
    { name: 'Converting to German degrees', expr: 'dH = H*1000/17.848', tex: 'D_\\mathrm{dH} = \\frac{H}{17.85\\ \\mathrm{mg/L}}',
      vars: { dH: { name: 'hardness in German degrees (°dH)', tex: 'D_\\mathrm{dH}' }, H: { name: 'hardness as CaCO₃', q: 'density', unit: 'g/m³', value: 200 } },
      solveFor: 'dH', note: 'One German degree is 10 mg/L of calcium oxide, equivalent to 17.85 mg/L of CaCO₃. The expression has the factor 1,000 because the calculator works in kg/m³ internally.',
      stories: { dH: 'A water has a hardness of {H} as CaCO₃. What is it in German degrees?' } }
  ],
  examples: [
    { title: 'A year of kettle fur', q: 'A household boils 1.5 L of water five times a day. The water has a hardness of 200 mg/L as CaCO₃ and 70 % of it deposits. How much scale forms in a year, and what is its volume at the density of calcite (2.71 g/cm³)?',
      steps: [{ text: 'Per boil:', tex: 'm = 200\\ \\mathrm{mg/L} \\times 1.5\\ \\mathrm{L} \\times 0.70 = 210\\ \\mathrm{mg}' }, { text: 'Per year: 5 boils a day times 365 days is 1,825 boils:', tex: '1825 \\times 0.21\\ \\mathrm{g} = 383\\ \\mathrm{g}' }, { text: 'Volume:', tex: '383/2.71 = 141\\ \\mathrm{cm^3}' }],
      a: 'Almost 400 g of scale a year — 141 cm³ of calcite, a cube five centimetres on each side. If it all stuck to a heating element of 100 cm², the layer would be 1.4 cm thick; in practice most of it ends up as flakes in the water and is poured out.' },
    { title: 'Soap in the bath', q: 'How much sodium stearate soap does a 150-litre bath of 200 mg/L hardness consume before it lathers?',
      steps: [{ text: 'Calcium (as CaCO₃) in the bath:', tex: '\\frac{0.200\\ \\mathrm{g/L} \\times 150\\ \\mathrm{L}}{100.09\\ \\mathrm{g/mol}} = 0.300\\ \\mathrm{mol}' }, { text: 'Two soap anions per calcium, 306.5 g/mol:', tex: 'm = 2 \\times 0.300 \\times 306.5 = 184\\ \\mathrm{g}' }],
      a: '184 g of soap: a whole bar of soap, lost to scum before any cleaning is done. Hard-water districts used to need much more soap, and a ring of scum around the bath.' }
  ],
  quiz: [
    { q: 'Which part of the hardness is removed by boiling?', choices: ['All of it', 'Temporary (carbonate) hardness', 'Permanent hardness (sulfates, chlorides)', 'None of it'], a: 1, why: 'Heating drives off CO₂ and turns calcium bicarbonate into insoluble calcium carbonate. Calcium sulfate and chloride stay dissolved.' },
    { q: 'Limescale is calcium oxide ("lime") deposited by hard water.', a: false, why: 'Lime is CaO. Limescale is calcium carbonate, CaCO₃, the same material as chalk and seashells.' },
    { q: 'Water with 2.5 mmol/L of calcium and no magnesium has a hardness, in mg/L as CaCO₃, of', answer: 250, unit: 'mg/L', why: '1 mmol/L of Ca²⁺ is 100.09 mg/L as CaCO₃, so 2.5 mmol/L is 250 mg/L: very hard (above 180).' },
    { q: 'A stalactite grows because', choices: ['the rock above it melts', 'water dripping from the roof loses CO₂ to the cave air and deposits calcite', 'bacteria build it', 'calcium evaporates'], a: 1, why: 'The same chemistry as the kettle: CO₂ escapes from the drop, calcium bicarbonate turns to carbonate, and a speck of calcite is left on the tip.' },
    { q: 'A softener on the mains replaces calcium by sodium. Compared with the hard water, the softened water', choices: ['has fewer dissolved ions', 'has more sodium and about the same number of charges dissolved', 'is pure', 'is acidic'], a: 1, why: 'Each calcium ion (two charges) is exchanged for two sodium ions. The dissolved matter is not lower; it merely no longer forms scale.' }
  ],
  applications: ['Kettles, coffee machines, dishwashers, boilers and heat exchangers: descaling schedules and water softeners are designed around the hardness of the supply.', 'Detergent formulation: builders (zeolites, citrates, phosphates) are added to bind calcium and magnesium so the surfactants can work.', 'Brewing and cooking: the calcium and bicarbonate content of the water shapes the style of beer and the texture of tea and pasta.', 'Cave science and speleothems: the growth rate of stalactites is a record of past climate ([[weathering-and-caves]]).', 'Water treatment plants soften with lime, and the scale protects old distribution pipes, so changing a supply can change what pipes release ([[water-treatment]]).'],
  history: 'Thomas Clark, a professor in Aberdeen, patented the lime-softening process in 1841 and defined the degree of hardness named after him. Ion-exchange softening with natural zeolites was introduced by Robert Gans in Germany in 1905, and synthetic resins that replaced them were invented in the 1930s–40s.',
  sources: ['USGS Water Science School, "Hardness of water" — the classification and conversions.', 'World Health Organization, *Hardness in Drinking-water: Background document for development of WHO Guidelines for Drinking-water Quality* (2011).', 'Stumm and Morgan, *Aquatic Chemistry* — the carbonate system, calcite saturation and scale.', 'CRC *Handbook of Chemistry and Physics*: solubility of calcium carbonate against temperature and CO₂ pressure.'],
  sim: 'sol-hard-water'
}
);
