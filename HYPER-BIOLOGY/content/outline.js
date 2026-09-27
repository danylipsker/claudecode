/* HYPER-BIOLOGY · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold
 * (a planned concept never takes the id of a branch or topic — the validator checks).
 *
 * Hyper Biology is the science of living things, from molecules to the biosphere: the chemistry
 * of life, cells, energy, molecular biology, genetics, biotechnology, evolution, the diversity of
 * life, plants, animals, ecology, behaviour, microbes and how biology is done. The chemistry is
 * linked as chemistry:<id>, the physics as physics:<id>, the mathematics as math:<id>, the human
 * body and disease as medicine:<id>, medicines as pharmaceutics:<id>.
 */
Hyper.add(
  {
    id: 'biology', kind: 'root', title: 'Hyper Biology',
    short: 'The science of life from molecules to the biosphere: how cells work and divide, how genes are read, inherited and edited, how evolution shapes every species, and how living things fit together in ecosystems.',
    links: [['Sequence tools', '#/tools/sequence', 'dna'], ['Genetics calculators', '#/tools/genetics', 'calc'], ['Cell explorer', '#/tools/cell', 'cell']],
    body: 'A bacterium doubles in twenty minutes; a redwood lives for two thousand years; both run on the same genetic code, the same ATP, the same membranes of fat and protein. Biology is the study of how that shared machinery builds the astonishing variety of life — and of the one idea that explains why it looks the way it does: evolution by natural selection. On these pages you can follow a gene from DNA to protein, cross peas with Mendel, watch an allele drift to fixation, balance predators against prey, and see why an enzyme slows down when it runs out of substrate.\n\nStart with enzymes and Michaelis–Menten kinetics, try the [sequence tools](#/tools/sequence) on a real gene, the [genetics calculators](#/tools/genetics) for crosses and population genetics, or the [cell explorer](#/tools/cell). Every formula on these pages is a calculator that solves for any of its variables.\n\n> [!note] The biotechnology pages explain how techniques work and why they matter; they are not laboratory protocols. Working with organisms and genetic material follows the biosafety rules and approvals of your institution and country.'
  },

  /* ================================================================ CHEMISTRY OF LIFE */
  {
    id: 'chemistry-of-life', kind: 'branch', parent: 'biology', title: 'The Chemistry of Life', icon: 'molecule', hue: 30,
    short: 'Water, pH and the four families of biological molecules — carbohydrates, lipids, proteins and nucleic acids — and the enzymes that make chemistry fast enough for life, with the energy currency ATP.',
    body: 'Living things are made of ordinary atoms — mostly carbon, hydrogen, oxygen and nitrogen — arranged into a few families of large molecules. Sugars store energy and build walls; fats make membranes and store more energy still; proteins fold into machines, motors and signals; nucleic acids hold and copy the instructions. All of it happens in water, whose odd properties make life possible, and almost every reaction is sped up millions of times by an enzyme.'
  },
  { id: 'biomolecules', kind: 'topic', parent: 'chemistry-of-life', title: 'Molecules of life', short: 'Water, pH and buffers, carbohydrates, lipids, amino acids, protein structure and nucleic acids.',
    plan: [['water-in-life', 'Water and life'], ['ph-in-biology', 'pH and buffers in living things'], ['carbohydrates', 'Carbohydrates'], ['lipids', 'Lipids'],
           ['amino-acids', 'Amino acids and peptide bonds'], ['protein-structure', 'Protein structure and folding'], ['nucleic-acids', 'Nucleic acids']] },
  { id: 'enzymes-topic', kind: 'topic', parent: 'chemistry-of-life', title: 'Enzymes and energy', short: 'How enzymes work, Michaelis–Menten kinetics, inhibition, regulation, ATP and free energy.',
    plan: [['enzymes', 'How enzymes work'], ['enzyme-kinetics', 'Enzyme kinetics: Michaelis and Menten'], ['enzyme-inhibition', 'Enzyme inhibition'], ['enzyme-regulation', 'Allosteric regulation and feedback'],
           ['atp-energy', 'ATP and energy coupling'], ['bioenergetics', 'Free energy in living things']] },

  /* ================================================================ CELLS */
  {
    id: 'cells', kind: 'branch', parent: 'biology', title: 'Cells', icon: 'cell', hue: 200,
    short: 'The unit of life: its size and structure, prokaryotic and eukaryotic cells and their organelles, membranes and transport, signalling, the cell cycle, mitosis, cell death and stem cells.',
    body: 'Every living thing is made of cells, and every cell comes from another cell. A bacterium is a single cell a few micrometres long with no nucleus; your body is some thirty trillion cells of two hundred types, each packed with membrane-bound compartments. Cells stay small because they feed through their surface, talk to each other with chemical signals, and divide in a tightly controlled cycle — whose failure is cancer.'
  },
  { id: 'cell-structure', kind: 'topic', parent: 'cells', title: 'Cell structure', short: 'Cell theory and size, microscopy, prokaryotic and eukaryotic cells, the nucleus, endomembranes, mitochondria, chloroplasts and the cytoskeleton.',
    plan: [['cell-theory', 'Cell theory and the size of cells'], ['microscopy', 'Microscopes and what they reveal'], ['prokaryotic-cells', 'Prokaryotic cells'], ['eukaryotic-cells', 'Eukaryotic cells'],
           ['nucleus-ribosomes', 'The nucleus and ribosomes'], ['endomembrane', 'The endomembrane system'], ['mitochondria-chloroplasts', 'Mitochondria and chloroplasts'], ['cytoskeleton', 'The cytoskeleton']] },
  { id: 'membranes', kind: 'topic', parent: 'cells', title: 'Membranes and transport', short: 'The fluid mosaic membrane, diffusion and osmosis, water potential, active transport, endocytosis and exocytosis.',
    plan: [['membrane-structure', 'The fluid mosaic membrane'], ['diffusion-osmosis', 'Diffusion and osmosis'], ['water-potential', 'Water potential'], ['active-transport', 'Active transport and pumps'], ['endocytosis', 'Endocytosis and exocytosis']] },
  { id: 'cell-life', kind: 'topic', parent: 'cells', title: 'The life of a cell', short: 'Cell signalling, the cell cycle, mitosis, programmed cell death and stem cells.',
    plan: [['cell-signalling', 'Cell signalling'], ['cell-cycle', 'The cell cycle and its checkpoints'], ['mitosis', 'Mitosis'], ['apoptosis', 'Programmed cell death'], ['stem-cells', 'Stem cells and differentiation']] },

  /* ================================================================ METABOLISM */
  {
    id: 'metabolism', kind: 'branch', parent: 'biology', title: 'Energy and Metabolism', icon: 'zap', hue: 45,
    short: 'How cells harvest energy from food — glycolysis, the citric acid cycle, oxidative phosphorylation and fermentation — and how plants capture it from light in photosynthesis.',
    body: 'Life runs on a flow of energy. Plants catch sunlight and store it in sugar; almost everything else burns that sugar, slowly and in small steps, to make ATP. The two processes mirror each other: photosynthesis splits water and fixes carbon dioxide, respiration oxidises sugar back to carbon dioxide and water. Both use the same trick at their heart — pumping protons across a membrane and letting them flow back through a turbine-like enzyme, ATP synthase.'
  },
  { id: 'respiration', kind: 'topic', parent: 'metabolism', title: 'Cellular respiration', short: 'Metabolic pathways, glycolysis, the citric acid cycle, oxidative phosphorylation and fermentation.',
    plan: [['metabolism-overview', 'Metabolic pathways'], ['glycolysis', 'Glycolysis'], ['krebs-cycle', 'The citric acid cycle'], ['oxidative-phosphorylation', 'Oxidative phosphorylation and chemiosmosis'], ['fermentation', 'Fermentation and anaerobic respiration']] },
  { id: 'photosynthesis-topic', kind: 'topic', parent: 'metabolism', title: 'Photosynthesis', short: 'Photosynthesis, the light reactions, the Calvin cycle, C4 and CAM plants, limiting factors.',
    plan: [['photosynthesis', 'Photosynthesis'], ['light-reactions', 'The light reactions'], ['calvin-cycle', 'The Calvin cycle'], ['c4-cam', 'C4 and CAM plants'], ['limiting-factors', 'Limiting factors of photosynthesis']] },

  /* ================================================================ MOLECULAR BIOLOGY */
  {
    id: 'molecular-biology', kind: 'branch', parent: 'biology', title: 'Molecular Biology', icon: 'dna', hue: 270,
    short: 'The central dogma: the structure and replication of DNA, transcription, RNA processing, the genetic code and translation — and how genes are switched on and off, mutated, repaired and hijacked by viruses.',
    body: 'A cell\'s instructions are written in a four-letter chemical alphabet along a double helix two metres long, folded into a nucleus a hundredth of a millimetre across. The cell copies the whole text before every division with about one error in a billion letters, reads individual genes into messenger RNA, and translates each three-letter word into an amino acid. Which genes are read, when and how much, decides whether a cell becomes a neuron or a skin cell — and viruses are pieces of code that trick the machinery into copying them.'
  },
  { id: 'dna-to-protein', kind: 'topic', parent: 'molecular-biology', title: 'From DNA to protein', short: 'DNA structure, replication, transcription, RNA processing, the genetic code and translation.',
    plan: [['dna-structure', 'The structure of DNA'], ['dna-replication', 'DNA replication'], ['transcription', 'Transcription'], ['rna-processing', 'RNA processing and splicing'], ['genetic-code', 'The genetic code'], ['translation', 'Translation']] },
  { id: 'gene-regulation', kind: 'topic', parent: 'molecular-biology', title: 'Controlling genes', short: 'The lac operon, eukaryotic gene regulation, epigenetics, non-coding RNAs, mutations and repair, viruses.',
    plan: [['lac-operon', 'Gene regulation in bacteria: the lac operon'], ['eukaryotic-regulation', 'Gene regulation in eukaryotes'], ['epigenetics', 'Epigenetics'], ['noncoding-rna', 'Non-coding RNAs'],
           ['mutations', 'Mutations and DNA repair'], ['viruses', 'Viruses and how they replicate']] },

  /* ================================================================ GENETICS */
  {
    id: 'genetics', kind: 'branch', parent: 'biology', title: 'Genetics', icon: 'dna', hue: 320,
    short: 'How traits are inherited: Mendel\'s laws, Punnett squares and probability, dominance, blood groups, meiosis, sex linkage, linkage maps, pedigrees, chromosome changes and polygenic traits.',
    body: 'Gregor Mendel counted peas and found that inheritance is not a blending of fluids but a shuffling of discrete factors — genes — two in each individual, one passed to each offspring. Probability rules the shuffle, which is why ratios like 3 : 1 and 9 : 3 : 3 : 1 appear, and why a chi-square test can tell a real pattern from chance. Chromosomes carry the genes, meiosis deals them out, and the exceptions — linked genes, sex linkage, extra chromosomes — turned out to be as revealing as the rules.'
  },
  { id: 'mendelian', kind: 'topic', parent: 'genetics', title: 'Mendelian genetics', short: 'Mendel\'s laws, Punnett squares, dihybrid crosses, dominance, multiple alleles and chi-square tests.',
    plan: [['mendels-laws', 'Mendel\'s laws'], ['punnett-squares', 'Punnett squares and probability'], ['dihybrid-crosses', 'Dihybrid crosses and independent assortment'], ['dominance-types', 'Incomplete dominance and codominance'],
           ['multiple-alleles', 'Multiple alleles and blood groups'], ['chi-square-genetics', 'Testing ratios with chi-square']] },
  { id: 'chromosomes', kind: 'topic', parent: 'genetics', title: 'Chromosomes and inheritance', short: 'Meiosis, sex linkage, linkage and mapping, pedigrees, karyotypes, polygenic traits and human genetic disease.',
    plan: [['meiosis', 'Meiosis'], ['sex-linkage', 'Sex determination and sex linkage'], ['linkage-mapping', 'Linkage and gene mapping'], ['pedigrees', 'Pedigree analysis'],
           ['karyotypes', 'Chromosomes, karyotypes and nondisjunction'], ['polygenic-traits', 'Polygenic traits and heritability'], ['human-genetics', 'Human genetic disease']] },

  /* ================================================================ BIOTECHNOLOGY */
  {
    id: 'biotechnology', kind: 'branch', parent: 'biology', title: 'Biotechnology and Genomics', icon: 'microscope', hue: 180,
    short: 'Reading, copying, cutting and editing DNA: restriction enzymes and cloning, PCR, gel electrophoresis, sequencing, CRISPR, measuring gene expression — and genomes, bioinformatics, GMOs, gene therapy and the ethics of it all.',
    body: 'In fifty years biologists went from barely seeing DNA to reading a human genome in an afternoon and editing single letters of it. The tools are borrowed from nature: enzymes that bacteria use to cut viral DNA, a polymerase from a hot-spring microbe that survives the heat of PCR, a bacterial immune system that became CRISPR. These pages explain how the techniques work and what they have changed — in medicine, agriculture and forensics — and the questions of safety and ethics they raise. They are explanations, not laboratory protocols.'
  },
  { id: 'dna-technology', kind: 'topic', parent: 'biotechnology', title: 'Working with DNA', short: 'Restriction enzymes and cloning, PCR, gel electrophoresis, sequencing, CRISPR and measuring gene expression.',
    plan: [['restriction-cloning', 'Restriction enzymes and cloning'], ['pcr', 'The polymerase chain reaction'], ['gel-electrophoresis', 'Gel electrophoresis'], ['dna-sequencing', 'DNA sequencing'],
           ['crispr', 'CRISPR genome editing'], ['gene-expression-tools', 'Measuring gene expression']] },
  { id: 'genomics-topic', kind: 'topic', parent: 'biotechnology', title: 'Genomics and its uses', short: 'Genomes, bioinformatics, GMOs, gene therapy, biosafety and bioethics.',
    plan: [['genomics', 'Genomes and genomics'], ['bioinformatics', 'Bioinformatics and sequence alignment'], ['gmos', 'Genetically modified organisms'], ['gene-therapy', 'Gene therapy'], ['biosafety-bioethics', 'Biosafety and bioethics']] },

  /* ================================================================ EVOLUTION */
  {
    id: 'evolution', kind: 'branch', parent: 'biology', title: 'Evolution', icon: 'tree', hue: 140,
    short: 'The idea that makes sense of biology: the evidence, natural selection, Hardy–Weinberg equilibrium, drift, gene flow and mutation, sexual selection and coevolution; speciation, phylogenetic trees, molecular clocks and the history of life, including our own.',
    body: 'Populations change over generations because individuals differ, some of the differences are inherited, and some help their carriers leave more offspring. That is natural selection, and together with chance (drift), migration and mutation it explains the fit of organisms to their surroundings and the branching tree of all life. The evidence comes from fossils, anatomy, embryos, the geography of species, and above all from DNA, which records the family history of every living thing.'
  },
  { id: 'evolution-mechanisms', kind: 'topic', parent: 'evolution', title: 'How evolution works', short: 'The evidence, natural selection, Hardy–Weinberg, drift, gene flow and mutation, sexual selection and coevolution.',
    plan: [['evidence-evolution', 'The evidence for evolution'], ['natural-selection', 'Natural selection'], ['hardy-weinberg', 'Hardy–Weinberg equilibrium'], ['genetic-drift', 'Genetic drift'],
           ['gene-flow-mutation', 'Gene flow and mutation'], ['sexual-selection', 'Sexual selection'], ['coevolution', 'Coevolution']] },
  { id: 'history-of-life', kind: 'topic', parent: 'evolution', title: 'Species and the history of life', short: 'Speciation, phylogenetic trees, molecular clocks, the history of life on Earth and human evolution.',
    plan: [['speciation', 'Speciation'], ['phylogenetics', 'Phylogenetic trees'], ['molecular-clock', 'Molecular clocks'], ['life-history-earth', 'The history of life on Earth'], ['human-evolution', 'Human evolution']] },

  /* ================================================================ DIVERSITY */
  {
    id: 'diversity', kind: 'branch', parent: 'biology', title: 'The Diversity of Life', icon: 'globe', hue: 95,
    short: 'Classifying life: taxonomy and naming, the three domains, bacteria and archaea, protists and fungi; the diversity of plants, invertebrates and vertebrates, and the microbiomes that live with them.',
    body: 'About two million species have been named and perhaps ten times as many remain unknown. Classification brings order to them: a two-part Latin name for each species, groups nested in larger groups that reflect common descent, and three great domains — bacteria, archaea and eukaryotes. Most of life\'s chemical inventiveness lies in microbes; most of its visible variety in plants and animals, from mosses to whales.'
  },
  { id: 'classification', kind: 'topic', parent: 'diversity', title: 'Classifying life', short: 'Classification and naming, the three domains, bacteria and archaea, protists and fungi.',
    plan: [['taxonomy', 'Classification and naming'], ['three-domains', 'The three domains'], ['bacteria-archaea', 'Bacteria and archaea'], ['protists', 'Protists'], ['fungi', 'Fungi']] },
  { id: 'plants-animals-diversity', kind: 'topic', parent: 'diversity', title: 'Plants and animals', short: 'The diversity of plants, invertebrates, vertebrates and microbiomes.',
    plan: [['plant-diversity', 'The diversity of plants'], ['invertebrates', 'Invertebrates'], ['vertebrates', 'Vertebrates'], ['microbiome', 'Microbiomes']] },

  /* ================================================================ PLANTS */
  {
    id: 'plants', kind: 'branch', parent: 'biology', title: 'Plant Biology', icon: 'leaf', hue: 75,
    short: 'How plants are built and move water and sugar without a heart — transpiration, phloem, mineral nutrition — and how they grow, sense, flower and reproduce: hormones, tropisms, pollination, seeds and photoperiodism.',
    body: 'A tree lifts hundreds of litres of water a day to leaves forty metres up with no pump at all, pulled by evaporation through a chain of water molecules held together by cohesion. Plants cannot walk away from danger or towards a mate, so they grow towards light, send chemical signals, recruit insects to carry their pollen and time their flowering by the length of the night. These pages explain how.'
  },
  { id: 'plant-structure', kind: 'topic', parent: 'plants', title: 'Plant structure and transport', short: 'Plant organs and tissues, transpiration, phloem transport, mineral nutrition.',
    plan: [['plant-tissues', 'Plant organs and tissues'], ['transpiration', 'Transpiration and the rise of water'], ['phloem-transport', 'Phloem and the movement of sugars'], ['plant-nutrition', 'Mineral nutrition and soil']] },
  { id: 'plant-life', kind: 'topic', parent: 'plants', title: 'Plant growth and reproduction', short: 'Plant hormones, tropisms, flowers and pollination, seeds and germination, photoperiodism.',
    plan: [['plant-hormones', 'Plant hormones'], ['tropisms', 'Tropisms and plant movement'], ['flowering-reproduction', 'Flowers, pollination and fertilisation'], ['seeds-germination', 'Seeds and germination'], ['photoperiodism', 'Photoperiodism and flowering']] },

  /* ================================================================ ANIMALS */
  {
    id: 'animal-physiology', kind: 'branch', parent: 'biology', title: 'Animal Form and Function', icon: 'paw', hue: 15,
    short: 'How animals solve the same problems in different ways: homeostasis, temperature, gas exchange, circulation, osmoregulation, nerves and hormones; muscles, immunity, reproduction, development, and how size shapes everything.',
    body: 'A fish, a bird, an insect and a human all need to take in oxygen, move blood or its equivalent, keep water and salts in balance, sense the world and respond. Comparing their solutions — gills and lungs, open and closed circulations, kidneys of different designs — shows what physics and chemistry demand of any animal, and why an elephant\'s heart beats thirty times a minute while a shrew\'s beats a thousand. The human body in detail is in [[medicine:medicine|Hyper Medicine]].'
  },
  { id: 'animal-systems', kind: 'topic', parent: 'animal-physiology', title: 'Animal systems', short: 'Homeostasis, endotherms and ectotherms, gas exchange, circulation, osmoregulation, nervous systems and hormones compared.',
    plan: [['animal-homeostasis', 'Homeostasis in animals'], ['thermoregulation-animals', 'Endotherms and ectotherms'], ['gas-exchange-animals', 'Gas exchange across the animal kingdom'], ['circulation-animals', 'Circulatory systems compared'],
           ['osmoregulation', 'Osmoregulation and excretion'], ['animal-nervous-systems', 'Nervous systems compared'], ['animal-hormones', 'Hormones in animals']] },
  { id: 'animal-life', kind: 'topic', parent: 'animal-physiology', title: 'Movement, defence and reproduction', short: 'Muscles and movement, immune systems, reproduction, embryonic development, size and scaling.',
    plan: [['muscles-movement', 'Muscles and movement'], ['animal-immunity', 'Immune systems compared'], ['animal-reproduction', 'Animal reproduction'], ['animal-development', 'Embryonic development'], ['scaling-allometry', 'Size, scaling and metabolism']] },

  /* ================================================================ ECOLOGY */
  {
    id: 'ecology', kind: 'branch', parent: 'biology', title: 'Ecology', icon: 'leaf', hue: 160,
    short: 'Living things and their surroundings: ecosystems, energy flow and food webs, the carbon and nitrogen cycles, biomes; population growth, predators and prey, competition, succession and biodiversity; conservation, climate change, invasive species and what nature does for us.',
    body: 'Ecology asks how many of each kind live where, and why. Energy enters ecosystems as sunlight and leaks away at each step of a food chain, so there are always fewer foxes than rabbits. Nutrients, by contrast, cycle endlessly between air, soil and living things. Populations grow until something limits them; predators and prey rise and fall together; competitors divide up the world. Today the biggest ecological force on Earth is our own species, and ecology is the science that measures what that means.'
  },
  { id: 'ecosystems', kind: 'topic', parent: 'ecology', title: 'Ecosystems', short: 'Ecosystems, energy flow and trophic levels, the carbon and nitrogen cycles, biomes.',
    plan: [['ecosystems-intro', 'Ecosystems'], ['energy-flow', 'Energy flow and trophic levels'], ['carbon-cycle', 'The carbon cycle'], ['nitrogen-cycle', 'The nitrogen cycle'], ['biomes', 'Biomes']] },
  { id: 'populations', kind: 'topic', parent: 'ecology', title: 'Populations and communities', short: 'Population growth, predators and prey, competition and niches, succession, measuring biodiversity.',
    plan: [['population-growth', 'Population growth'], ['predator-prey', 'Predators and prey'], ['competition-niches', 'Competition and niches'], ['community-succession', 'Communities and succession'], ['biodiversity', 'Measuring biodiversity']] },
  { id: 'conservation', kind: 'topic', parent: 'ecology', title: 'People and the biosphere', short: 'Conservation biology, climate change and living things, invasive species, ecosystem services.',
    plan: [['conservation-biology', 'Conservation biology'], ['climate-ecosystems', 'Climate change and living things'], ['invasive-species', 'Invasive species'], ['ecosystem-services', 'Ecosystem services']] },

  /* ================================================================ BEHAVIOUR */
  {
    id: 'behaviour', kind: 'branch', parent: 'biology', title: 'Animal Behaviour', icon: 'paw', hue: 350,
    short: 'Why animals do what they do: innate and learned behaviour, communication, social life and altruism, foraging, migration and navigation, and the clocks inside living things.',
    body: 'Behaviour is biology in action, and it evolves like any other trait. A cuckoo chick pushing eggs out of the nest, bees dancing the way to flowers, birds crossing oceans by the stars, worker ants that never breed: each asks both how the behaviour works — genes, nerves, hormones, learning — and why it evolved. Hamilton\'s rule, optimal foraging and game theory give surprisingly precise answers.'
  },
  { id: 'behaviour-topic', kind: 'topic', parent: 'behaviour', title: 'Behaviour', short: 'Innate and learned behaviour, communication, social behaviour and altruism, foraging, migration, biological rhythms.',
    plan: [['innate-learned', 'Innate and learned behaviour'], ['communication', 'Animal communication'], ['social-behaviour', 'Social behaviour and altruism'], ['foraging', 'Optimal foraging'], ['migration-navigation', 'Migration and navigation'], ['biological-rhythms', 'Biological rhythms']] },

  /* ================================================================ MICROBIOLOGY */
  {
    id: 'microbiology', kind: 'branch', parent: 'biology', title: 'Microbiology', icon: 'virus', hue: 250,
    short: 'The invisible majority: bacterial growth, microbial metabolism, antibiotics and the evolution of resistance, biofilms and quorum sensing, microbes in food and industry, and the aseptic technique that keeps cultures pure.',
    body: 'Microbes were here first, still outnumber everything else, and run the planet\'s chemistry — fixing nitrogen, recycling the dead, making half the oxygen we breathe. A single bacterium dividing every twenty minutes would in principle outweigh the Earth in two days; in practice food runs out, which is why growth curves bend. Microbes make our bread, cheese and medicines, and a few make us ill — the resistance they evolve to antibiotics is evolution happening in front of us.'
  },
  { id: 'microbes-topic', kind: 'topic', parent: 'microbiology', title: 'Microbes', short: 'Bacterial growth, microbial metabolism, antibiotics and resistance, biofilms, microbes in industry, aseptic technique.',
    plan: [['bacterial-growth', 'Bacterial growth'], ['microbial-metabolism', 'Microbial metabolism'], ['antibiotic-resistance', 'Antibiotics and resistance'], ['biofilms', 'Biofilms and quorum sensing'],
           ['microbes-industry', 'Microbes in food and industry'], ['aseptic-technique', 'Aseptic technique and sterilisation']] },

  /* ================================================================ METHODS */
  {
    id: 'biology-methods', kind: 'branch', parent: 'biology', title: 'How Biology Is Done', icon: 'microscope', hue: 220,
    short: 'Asking good questions of living things: experimental design and controls, statistics for biologists, laboratory calculations and the model organisms that made modern biology.',
    body: 'Living things vary, so biology is a science of careful comparison: controls, replicates, randomisation and statistics that separate a real effect from the noise of individual differences. A handful of model organisms — a bacterium, a yeast, a worm, a fly, a weed and a mouse — taught us most of what we know, because what is true of them is so often true of us.'
  },
  { id: 'methods-topic', kind: 'topic', parent: 'biology-methods', title: 'Methods', short: 'Asking questions, experimental design, statistics, laboratory calculations, model organisms.',
    plan: [['scientific-method-bio', 'Asking questions in biology'], ['experimental-design', 'Experimental design and controls'], ['statistics-bio', 'Statistics for biologists'], ['lab-math', 'Laboratory calculations'], ['model-organisms', 'Model organisms']] }
);
