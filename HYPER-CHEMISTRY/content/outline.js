/* HYPER-CHEMISTRY · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Chemistry here is general and physical chemistry with an introduction to organic
 * and analytical chemistry: what matter is made of, how atoms bond, how much reacts,
 * how far and how fast. The physics underneath (quantum mechanics, thermodynamics,
 * nuclear physics) lives in Hyper Physics and is linked as physics:<id>; the
 * mathematics (logarithms, exponentials, linear systems) as math:<id>; batteries and
 * sensors as circuits in Hyper Electronics as electronics:<id>.
 */
Hyper.add(
  {
    id: 'chemistry', kind: 'root', title: 'Hyper Chemistry',
    short: 'Chemistry as a map of connected ideas: from atoms and bonds to equilibrium, acids, electrochemistry and organic molecules — every concept explained, every formula a calculator, every molecule something you can turn in your hands.',
    body: ''
  },

  /* ================================================================ ATOMS */
  {
    id: 'atoms-periodicity', kind: 'branch', parent: 'chemistry', title: 'Atoms and the Periodic Table', icon: 'atom', hue: 245,
    short: 'What atoms are made of, how their electrons are arranged, and why that arrangement repeats down the periodic table.',
    body: 'Every chemical fact starts with the atom: a tiny nucleus that fixes the element, and a cloud of electrons that decides how it behaves. The electrons fill orbitals in a set order, and because the outermost ones repeat their pattern every period, elements in the same column act alike. Radius, ionisation energy and electronegativity all follow from how strongly the nucleus holds those outer electrons — which is why the periodic table is the most useful chart in science.'
  },
  { id: 'atomic-structure', kind: 'topic', parent: 'atoms-periodicity', title: 'Atomic structure', short: 'Elements and compounds, the particles inside the atom, and isotopes.',
    plan: [['atomic-theory', 'Atoms, elements and compounds'], ['subatomic-particles', 'Protons, neutrons and electrons'], ['isotopes', 'Isotopes and relative atomic mass']] },
  { id: 'electrons-in-atoms', kind: 'topic', parent: 'atoms-periodicity', title: 'Electrons in atoms', short: 'Energy levels and spectra, orbitals and quantum numbers, and how electrons fill them.',
    plan: [['atomic-spectra', 'Atomic spectra and energy levels'], ['quantum-numbers', 'Quantum numbers and orbitals'], ['orbital-shapes', 'The shapes of orbitals'],
           ['electron-configuration', 'Electron configuration'], ['valence-electrons', 'Valence electrons and Lewis symbols']] },
  { id: 'periodicity', kind: 'topic', parent: 'atoms-periodicity', title: 'Periodicity', short: 'The periodic table and the trends that run across and down it.',
    plan: [['periodic-table', 'The periodic table'], ['effective-nuclear-charge', 'Effective nuclear charge and shielding'], ['periodic-trends', 'Periodic trends'],
           ['atomic-radius', 'Atomic and ionic radius'], ['ionization-energy', 'Ionisation energy and electron affinity'], ['electronegativity', 'Electronegativity']] },
  { id: 'nuclear-chemistry', kind: 'topic', parent: 'atoms-periodicity', title: 'Nuclear chemistry', short: 'Unstable nuclei, the equations of decay, half-life, and fission and fusion.',
    plan: [['nuclear-stability', 'Nuclear stability and decay modes'], ['nuclear-equations', 'Nuclear equations'], ['radioactive-half-life', 'Radioactive decay and half-life'], ['fission-fusion', 'Fission and fusion']] },

  /* ================================================================ BONDING */
  {
    id: 'bonding', kind: 'branch', parent: 'chemistry', title: 'Bonding and Structure', icon: 'bond', hue: 212,
    short: 'Why atoms stick together, the shapes the resulting molecules take, and the weaker forces between molecules.',
    body: 'Atoms bond because the bonded arrangement has lower energy: electrons transferred between very different atoms give ions held by their charges, electrons shared between similar ones give covalent bonds, and a sea of shared electrons holds a metal. Once bonds form, the electron pairs push one another as far apart as they can, and that sets the shape of a molecule — which in turn sets whether it is polar, how it packs, and how it reacts. The forces between molecules are weaker, but they decide boiling points, solubility and the shape of proteins.'
  },
  { id: 'ionic-metallic', kind: 'topic', parent: 'bonding', title: 'Ionic and metallic bonding', short: 'Ions held by their charges, the energy of a crystal lattice, and the electron sea of metals.',
    plan: [['ionic-bonding', 'Ionic bonding'], ['lattice-energy', 'Lattice energy and the Born–Haber cycle'], ['metallic-bonding', 'Metallic bonding']] },
  { id: 'covalent', kind: 'topic', parent: 'bonding', title: 'Covalent bonding', short: 'Shared electron pairs, Lewis structures and the rules for drawing them, and polar bonds.',
    plan: [['covalent-bonds', 'Covalent bonds'], ['lewis-structures', 'Lewis structures'], ['formal-charge', 'Formal charge'], ['resonance', 'Resonance'],
           ['bond-polarity', 'Bond polarity and dipoles'], ['bond-order-length', 'Bond order, length and strength']] },
  { id: 'molecular-shape', kind: 'topic', parent: 'bonding', title: 'Molecular shape and orbitals', short: 'VSEPR shapes, polarity of whole molecules, hybrid orbitals, sigma and pi bonds, and molecular orbitals.',
    plan: [['vsepr', 'VSEPR: the shapes of molecules'], ['molecular-polarity', 'Molecular polarity'], ['hybridization', 'Hybridisation'],
           ['sigma-pi-bonds', 'Sigma and pi bonds'], ['molecular-orbitals', 'Molecular orbital theory']] },
  { id: 'intermolecular', kind: 'topic', parent: 'bonding', title: 'Intermolecular forces', short: 'The weak attractions between molecules and the properties they control.',
    plan: [['intermolecular-forces', 'Intermolecular forces'], ['hydrogen-bonding', 'Hydrogen bonding'], ['imf-properties', 'How intermolecular forces set properties']] },
  { id: 'coordination', kind: 'topic', parent: 'bonding', title: 'Coordination chemistry', short: 'Metal ions surrounded by ligands, and why their compounds are coloured.',
    plan: [['coordination-compounds', 'Coordination compounds and ligands'], ['crystal-field-theory', 'Crystal field theory and colour']] },

  /* ================================================================ STOICHIOMETRY */
  {
    id: 'stoichiometry', kind: 'branch', parent: 'chemistry', title: 'Reactions and Stoichiometry', icon: 'scale', hue: 32,
    short: 'Counting atoms by weighing them: the mole, chemical equations, and how much of each substance reacts and forms.',
    body: 'Chemists cannot count atoms one by one, so they count them in moles — a fixed, huge number that turns grams on a balance into numbers of particles. A balanced equation then says in what ratio the particles react, and from there everything is arithmetic: how much product a given mass can make, which reactant runs out first, and how much you actually got compared with what was possible. The same bookkeeping works for solutions, where volume and concentration take the place of mass.'
  },
  { id: 'moles', kind: 'topic', parent: 'stoichiometry', title: 'The mole', short: 'Counting particles, molar mass, and what a formula tells you about composition.',
    plan: [['mole-concept', 'The mole and the Avogadro constant'], ['molar-mass', 'Molar mass'], ['percent-composition', 'Percentage composition'], ['empirical-formula', 'Empirical and molecular formulas']] },
  { id: 'reactions', kind: 'topic', parent: 'stoichiometry', title: 'Chemical reactions', short: 'Writing and balancing equations, the kinds of reaction, and the amounts that react.',
    plan: [['chemical-equations', 'Chemical equations and balancing'], ['reaction-types', 'Types of chemical reaction'], ['reaction-stoichiometry', 'Reacting masses'],
           ['limiting-reagent', 'The limiting reagent'], ['percent-yield', 'Theoretical and percentage yield']] },
  { id: 'solution-stoichiometry', kind: 'topic', parent: 'stoichiometry', title: 'Solution stoichiometry', short: 'Molarity, dilution and titration — reacting amounts measured by volume.',
    plan: [['molarity', 'Concentration and molarity'], ['dilution', 'Dilution'], ['titration-calculations', 'Titration calculations']] },

  /* ================================================================ STATES OF MATTER */
  {
    id: 'states-of-matter', kind: 'branch', parent: 'chemistry', title: 'States of Matter and Solutions', icon: 'gas', hue: 188,
    short: 'Gases and their laws, liquids and solids and the changes between them, and what happens when one substance dissolves in another.',
    body: 'Whether a substance is a gas, a liquid or a solid is a contest between the energy of its molecules\' motion and the forces holding them together. Gases are the simple case — far apart, their molecules obey laws that ignore what they are made of. Liquids and solids keep their neighbours, so their properties depend on the forces between molecules and on how they pack. Mixing a solute into a solvent changes the solvent\'s vapour pressure, boiling and freezing points and osmotic pressure in proportion to the number of dissolved particles alone.'
  },
  { id: 'gases', kind: 'topic', parent: 'states-of-matter', title: 'Gases', short: 'Pressure, volume, temperature and amount, the ideal gas law, and the molecular picture behind it.',
    plan: [['gas-laws', 'The gas laws'], ['ideal-gas-law', 'The ideal gas law'], ['partial-pressures', 'Partial pressures and Dalton\'s law'],
           ['kinetic-molecular-theory', 'Kinetic molecular theory'], ['effusion-diffusion', 'Effusion and diffusion'], ['real-gases', 'Real gases and the van der Waals equation']] },
  { id: 'liquids-solids', kind: 'topic', parent: 'states-of-matter', title: 'Liquids, solids and phase changes', short: 'Vapour pressure, phase diagrams, the Clausius–Clapeyron equation and crystal structures.',
    plan: [['vapor-pressure', 'Vapour pressure and boiling'], ['phase-diagrams', 'Phase diagrams'], ['clausius-clapeyron', 'The Clausius–Clapeyron equation'],
           ['crystal-structures', 'Crystalline solids and unit cells'], ['surface-tension-viscosity', 'Surface tension and viscosity']] },
  { id: 'solutions', kind: 'topic', parent: 'states-of-matter', title: 'Solutions', short: 'Solubility, the laws of Henry and Raoult, and the colligative properties.',
    plan: [['solubility', 'Solubility and the dissolving process'], ['concentration-units', 'Concentration units: molality, mole fraction, ppm'], ['henrys-law', 'Gas solubility and Henry\'s law'],
           ['raoults-law', 'Raoult\'s law and vapour pressure lowering'], ['colligative-properties', 'Boiling-point elevation and freezing-point depression'], ['osmotic-pressure', 'Osmotic pressure']] },

  /* ================================================================ THERMODYNAMICS */
  {
    id: 'thermodynamics', kind: 'branch', parent: 'chemistry', title: 'Thermochemistry and Thermodynamics', icon: 'heat', hue: 5,
    short: 'The heat a reaction gives out or takes in, and the entropy and free energy that decide whether it goes at all.',
    body: 'Reactions move energy around: burning fuel releases it, melting ice absorbs it. Enthalpy is the bookkeeping for that heat at constant pressure, and because it depends only on where you start and finish, it can be added up from tables or from bond energies. But heat alone does not decide which way a reaction runs — entropy, the spreading of energy over more arrangements, matters too. Gibbs free energy combines the two into one number whose sign says whether a change is spontaneous, and whose size fixes the equilibrium constant.'
  },
  { id: 'thermochemistry', kind: 'topic', parent: 'thermodynamics', title: 'Thermochemistry', short: 'Enthalpy changes, measuring them with calorimeters, and adding them up with Hess\'s law.',
    plan: [['enthalpy', 'Enthalpy and heats of reaction'], ['calorimetry', 'Calorimetry'], ['hess-law', 'Hess\'s law'],
           ['enthalpy-of-formation', 'Standard enthalpies of formation'], ['bond-enthalpies', 'Bond enthalpies']] },
  { id: 'chemical-thermodynamics', kind: 'topic', parent: 'thermodynamics', title: 'Entropy and free energy', short: 'Entropy, Gibbs free energy and spontaneity, and the link to equilibrium.',
    plan: [['entropy', 'Entropy'], ['gibbs-energy', 'Gibbs free energy and spontaneity'], ['gibbs-temperature', 'How temperature decides spontaneity'], ['gibbs-equilibrium', 'Free energy and the equilibrium constant']] },

  /* ================================================================ KINETICS */
  {
    id: 'kinetics', kind: 'branch', parent: 'chemistry', title: 'Chemical Kinetics', icon: 'clock', hue: 285,
    short: 'How fast reactions go: rate laws and their orders, how concentration changes with time, and why heat and catalysts speed things up.',
    body: 'Thermodynamics says whether a reaction can happen; kinetics says how long it takes. Diamond turning into graphite is favourable and takes geological time, while an explosion is over in microseconds. Rates depend on concentration in ways that must be measured, not read from the equation, and they rise steeply with temperature because only collisions with enough energy to cross an activation barrier succeed. Catalysts, from platinum in a car exhaust to the enzymes in every cell, work by offering a lower barrier.'
  },
  { id: 'rates', kind: 'topic', parent: 'kinetics', title: 'Reaction rates', short: 'Measuring rate, rate laws and order, and how concentration falls with time.',
    plan: [['reaction-rate', 'Reaction rate'], ['rate-laws', 'Rate laws and reaction order'], ['initial-rates', 'The method of initial rates'],
           ['integrated-rate-laws', 'Integrated rate laws'], ['reaction-half-life', 'The half-life of a reaction']] },
  { id: 'mechanisms', kind: 'topic', parent: 'kinetics', title: 'Mechanisms and catalysis', short: 'Collisions and activation energy, the Arrhenius equation, mechanisms, catalysts and enzymes.',
    plan: [['collision-theory', 'Collision theory'], ['arrhenius-equation', 'Activation energy and the Arrhenius equation'], ['reaction-mechanisms', 'Reaction mechanisms'],
           ['catalysis', 'Catalysis'], ['enzyme-kinetics', 'Enzyme kinetics']] },

  /* ================================================================ EQUILIBRIUM */
  {
    id: 'equilibrium', kind: 'branch', parent: 'chemistry', title: 'Chemical Equilibrium', icon: 'equilibrium', hue: 160,
    short: 'Reactions that run both ways and settle: the equilibrium constant, how to calculate with it, and how an equilibrium answers a disturbance.',
    body: 'Most reactions do not run to completion. As products build up, the reverse reaction speeds up until the two rates match and the composition stops changing — not because nothing happens, but because everything happens both ways at once. The equilibrium constant sums up where that balance lies, and the reaction quotient tells you which way a mixture will move to reach it. Push on an equilibrium by adding, removing, compressing or heating, and it shifts to take up part of the push.'
  },
  { id: 'equilibrium-basics', kind: 'topic', parent: 'equilibrium', title: 'The equilibrium constant', short: 'Dynamic equilibrium, K and Q, Kc and Kp, ICE tables and Le Chatelier\'s principle.',
    plan: [['dynamic-equilibrium', 'Dynamic equilibrium'], ['equilibrium-constant', 'The equilibrium constant'], ['reaction-quotient', 'The reaction quotient'], ['kp-kc', 'Kp and Kc'],
           ['ice-tables', 'Equilibrium calculations with ICE tables'], ['le-chatelier', 'Le Chatelier\'s principle'], ['vant-hoff', 'Temperature and K: the van \'t Hoff equation']] },
  { id: 'solubility-equilibria', kind: 'topic', parent: 'equilibrium', title: 'Solubility equilibria', short: 'Sparingly soluble salts, the solubility product, common ions, precipitation and complex ions.',
    plan: [['solubility-product', 'The solubility product'], ['common-ion-effect', 'The common-ion effect'], ['precipitation', 'Predicting precipitation'], ['complex-ion-equilibria', 'Complex-ion equilibria']] },

  /* ================================================================ ACIDS AND BASES */
  {
    id: 'acids-bases', kind: 'branch', parent: 'chemistry', title: 'Acids and Bases', icon: 'ph', hue: 325,
    short: 'Proton donors and acceptors, the pH scale, weak acids and their constants, buffers, and titrations.',
    body: 'An acid gives away a proton and a base takes one — a simple idea that runs through stomach chemistry, ocean chemistry, cleaning products and every living cell. Water itself does both, which is why pH, the logarithm of the hydrogen-ion concentration, can describe any aqueous solution on one scale. Strong acids give up their protons completely, weak ones only partly, and the balance is fixed by an acid constant. Mix a weak acid with its partner base and you get a buffer that holds the pH steady; add base drop by drop and watch the pH jump at the equivalence point of a titration.'
  },
  { id: 'acid-base-theory', kind: 'topic', parent: 'acids-bases', title: 'Acids, bases and pH', short: 'Definitions, water\'s self-ionisation, pH, and strong and weak acids and bases.',
    plan: [['acid-base-definitions', 'Arrhenius, Brønsted–Lowry and Lewis acids'], ['water-autoionization', 'The self-ionisation of water'], ['ph-scale', 'The pH scale'],
           ['strong-acids-bases', 'Strong acids and bases'], ['weak-acids', 'Weak acids and Ka'], ['weak-bases', 'Weak bases and Kb'],
           ['polyprotic-acids', 'Polyprotic acids'], ['salt-hydrolysis', 'Acidic and basic salts']] },
  { id: 'buffers-titrations', kind: 'topic', parent: 'acids-bases', title: 'Buffers and titrations', short: 'Solutions that resist pH change, and following a neutralisation with a pH meter or an indicator.',
    plan: [['buffers', 'Buffers'], ['henderson-hasselbalch', 'The Henderson–Hasselbalch equation'], ['titration-curves', 'Titration curves'], ['indicators', 'Acid–base indicators']] },

  /* ================================================================ ELECTROCHEMISTRY */
  {
    id: 'electrochemistry', kind: 'branch', parent: 'chemistry', title: 'Electrochemistry', icon: 'battery', hue: 58,
    short: 'Electrons moving between substances: oxidation and reduction, cells that make electricity, and electricity that drives reactions.',
    body: 'In a redox reaction one substance loses electrons and another gains them. Put the two halves in separate compartments joined by a wire and the electrons have to travel through the wire — that is a battery, and its voltage measures how strongly the reaction wants to go. Run the current the other way and you force a reaction uphill: electrolysis makes aluminium, chlorine and hydrogen, plates jewellery and charges your phone. The same chemistry, left uncontrolled, rusts bridges.'
  },
  { id: 'redox', kind: 'topic', parent: 'electrochemistry', title: 'Oxidation and reduction', short: 'Oxidation numbers, what is oxidised and what reduced, and balancing redox equations.',
    plan: [['oxidation-numbers', 'Oxidation numbers'], ['redox-reactions', 'Oxidation and reduction'], ['balancing-redox', 'Balancing redox equations with half-reactions']] },
  { id: 'cells', kind: 'topic', parent: 'electrochemistry', title: 'Electrochemical cells', short: 'Galvanic cells, electrode potentials, the Nernst equation, batteries and corrosion.',
    plan: [['galvanic-cells', 'Galvanic cells'], ['electrode-potentials', 'Standard electrode potentials'], ['cell-potential-gibbs', 'Cell potential, free energy and K'],
           ['nernst-equation', 'The Nernst equation'], ['concentration-cells', 'Concentration cells'], ['batteries-fuel-cells', 'Batteries and fuel cells'], ['corrosion', 'Corrosion and its prevention']] },
  { id: 'electrolysis-topic', kind: 'topic', parent: 'electrochemistry', title: 'Electrolysis', short: 'Driving reactions with a current, and how much product a given charge makes.',
    plan: [['electrolysis', 'Electrolysis'], ['faradays-laws', 'Faraday\'s laws of electrolysis'], ['electroplating', 'Electroplating and industrial electrolysis']] },

  /* ================================================================ ORGANIC */
  {
    id: 'organic', kind: 'branch', parent: 'chemistry', title: 'Organic Chemistry', icon: 'benzene', hue: 125,
    short: 'The chemistry of carbon compounds: how they are built and named, their isomers, the reactions that transform them, and the molecules of life.',
    body: 'Carbon forms four strong bonds and happily bonds to itself, so it builds chains, rings and branches in endless variety — millions of known compounds, from methane to DNA. The variety is tamed by functional groups: a hydroxyl, a carbonyl or a double bond reacts in much the same way whatever carbon skeleton it sits on. Learn the groups, the ways electrons move when bonds break and form, and the fact that molecules have a shape in space, and organic chemistry becomes a small set of patterns applied again and again.'
  },
  { id: 'organic-structure', kind: 'topic', parent: 'organic', title: 'Structure and naming', short: 'Carbon skeletons, functional groups, names, and isomers in two and three dimensions.',
    plan: [['carbon-bonding', 'Carbon: chains, rings and hybrid orbitals'], ['hydrocarbons', 'Alkanes, alkenes and alkynes'], ['functional-groups', 'Functional groups'],
           ['nomenclature', 'Naming organic compounds'], ['structural-isomers', 'Structural isomers'], ['stereoisomers', 'Stereoisomers and chirality'], ['aromatic-compounds', 'Benzene and aromatic compounds']] },
  { id: 'organic-reactions', kind: 'topic', parent: 'organic', title: 'Organic reactions', short: 'Substitution, elimination and addition, carbonyl chemistry, esters and polymers.',
    plan: [['reaction-mechanisms-organic', 'Curly arrows: how organic reactions happen'], ['nucleophilic-substitution', 'Nucleophilic substitution: SN1 and SN2'], ['elimination', 'Elimination reactions'],
           ['addition-alkenes', 'Addition to alkenes'], ['carbonyl-chemistry', 'Aldehydes and ketones'], ['carboxylic-acids-esters', 'Carboxylic acids and esters'], ['polymers', 'Polymers']] },
  { id: 'biomolecules', kind: 'topic', parent: 'organic', title: 'Molecules of life', short: 'Sugars, amino acids and proteins, fats, and nucleic acids.',
    plan: [['carbohydrates', 'Carbohydrates'], ['amino-acids-proteins', 'Amino acids and proteins'], ['lipids', 'Lipids'], ['nucleic-acids', 'Nucleic acids']] },

  /* ================================================================ ANALYTICAL */
  {
    id: 'analytical', kind: 'branch', parent: 'chemistry', title: 'Analytical Chemistry', icon: 'spectrum', hue: 88,
    short: 'Finding out what is in a sample and how much: careful measurement, weighing, light absorption, spectroscopy and separation.',
    body: 'Every number in chemistry comes from a measurement, and every measurement has an uncertainty. Analytical chemistry is the craft of getting reliable numbers: weighing a precipitate, following a colour with a spectrophotometer, reading the fingerprint of a molecule in its infrared or NMR spectrum, weighing its fragments in a mass spectrometer, or pulling a mixture apart by chromatography. Knowing how each method works tells you what it can see and what it will miss.'
  },
  { id: 'analysis', kind: 'topic', parent: 'analytical', title: 'Methods of analysis', short: 'Uncertainty, gravimetry, the Beer–Lambert law, IR, NMR and mass spectrometry, and chromatography.',
    plan: [['measurement-uncertainty', 'Measurement, uncertainty and significant figures'], ['gravimetric-analysis', 'Gravimetric analysis'], ['beer-lambert', 'Absorbance and the Beer–Lambert law'],
           ['ir-spectroscopy', 'Infrared spectroscopy'], ['nmr-spectroscopy', 'NMR spectroscopy'], ['mass-spectrometry', 'Mass spectrometry'], ['chromatography', 'Chromatography']] }
);
