/* HYPER-BIOLOGY · content/diversity-methods.js
 * Branch "The Diversity of Life": classification (taxonomy, three domains, bacteria and archaea, protists,
 * fungi) and plants and animals (plant diversity, invertebrates, vertebrates, microbiomes); branch
 * "How Biology Is Done": methods (asking questions, experimental design, statistics, laboratory
 * calculations, model organisms). Simulations in sims/diversity-methods.js (prefix div-). */
Hyper.add(

/* ================================================================ CLASSIFICATION */
{
  id: 'taxonomy', parent: 'classification', title: 'Classification and naming', level: 1,
  short: 'Every species gets a two-part Latin name and a place in nested groups — genus, family, order, class, phylum, kingdom, domain. Modern classification tries to make every group a whole branch of the tree of life.',
  keywords: ['taxonomy', 'systematics', 'binomial nomenclature', 'Linnaeus', 'genus', 'species', 'rank', 'kingdom', 'phylum', 'clade', 'monophyletic', 'paraphyletic', 'polyphyletic', 'cladistics', 'dichotomous key', 'DNA barcoding', 'scientific name'],
  prereq: ['speciation', 'evidence-evolution', 'phylogenetics'],
  related: ['three-domains', 'model-organisms', 'biodiversity', 'invertebrates', 'vertebrates', 'protists', 'dna-sequencing'],
  body: `
Biologists have named about **2.1 million species**, and they add some 15 000–20 000 more every year — most of them insects, spiders, fungi and plants from the tropics. Estimates of how many species live on Earth run from about 8.7 million eukaryotes (Camilo Mora and colleagues, 2011) to far more once bacteria are counted. **Taxonomy** names organisms and sorts them into groups; **systematics** asks how the groups are related. Since Darwin the goal has been a classification that mirrors the family tree of life ([[phylogenetics]]).

### Ranks from domain to species
Carl Linnaeus arranged living things in nested ranks in *Systema Naturae* — its 10th edition (1758) is the official starting point for animal names, his *Species Plantarum* (1753) for plants. The main ranks today:

| Rank | Human | Honeybee | Garden pea | *E. coli* |
|---|---|---|---|---|
| Domain | Eukarya | Eukarya | Eukarya | Bacteria |
| Kingdom | Animalia | Animalia | Plantae | Pseudomonadati |
| Phylum | Chordata | Arthropoda | Tracheophyta | Pseudomonadota |
| Class | Mammalia | Insecta | Magnoliopsida | Gammaproteobacteria |
| Order | Primates | Hymenoptera | Fabales | Enterobacterales |
| Family | Hominidae | Apidae | Fabaceae | Enterobacteriaceae |
| Genus | *Homo* | *Apis* | *Pisum* | *Escherichia* |
| Species | *Homo sapiens* | *Apis mellifera* | *Pisum sativum* | *Escherichia coli* |

Ranks are a filing system, not a law of nature: a family of beetles is not "equal" to a family of mammals in age or in number of species. (Bacteria received formal kingdoms only in 2024.)

### Writing scientific names
Each species has a two-part, **binomial** name, and the rules are the same the world over:
- The **genus** starts with a capital, the **specific epithet** is all lower case, and both are in *italics* (underlined when handwritten): *Homo sapiens*, never Homo Sapiens.
- The epithet never stands alone — "sapiens" means nothing without *Homo* — and the same epithet may be reused in other genera (*Bellis perennis*, the daisy; *Lolium perenne*, ryegrass).
- After the first mention the genus is shortened: *E. coli*, *D. melanogaster*. "sp." means one unidentified species of a genus, "spp." several (*Salmonella* spp.).
- Ranks above the genus are capitalised but not italic: Mammalia, Hominidae. Animal families end in *-idae*, plant and bacterial families in *-aceae*.
- A subspecies adds a third word (*Panthera tigris tigris*); the author and year may follow the name (*Homo sapiens* Linnaeus, 1758).

Separate codes govern names of animals (ICZN), of algae, fungi and plants (ICN) and of prokaryotes (ICNP). Every name is anchored to a **type specimen**, and when two names turn out to mean one species the older name usually wins — the principle of **priority**.

### Clades and traditional groups
Modern classification is **cladistic** (Willi Hennig, 1950): a proper group — a **clade**, or **monophyletic** group — contains an ancestor and *all* of its descendants, and is recognised by shared derived characters such as feathers or milk. Many familiar groups fail the test:
- **Paraphyletic** groups leave some descendants out: "reptiles" without birds, "fish" without the tetrapods, "invertebrates" without vertebrates, "protists" without animals, plants and fungi.
- **Polyphyletic** groups collect organisms by a trait that evolved more than once: "algae", "warm-blooded animals".

The old words stay useful for ways of life, but they are not branches of the tree. A crocodile is more closely related to a sparrow than to a lizard, and a salmon is closer to you than to a shark.

> [!key] A good group is a whole branch of the tree of life: one ancestor and every one of its descendants.

### Identifying species
In the field, a **dichotomous key** narrows an organism down by a chain of paired choices — try one below. In the laboratory, **DNA barcoding** reads a standard stretch of DNA and looks it up in a reference library: 648 bases of the mitochondrial *COI* gene for animals, the *rbcL* and *matK* genes for plants, the ITS region for fungi and 16S ribosomal RNA for bacteria.
`,
  ideas: [
    'Every species has a binomial name: a capitalised genus and a lower-case epithet, both in italics.',
    'Ranks nest from domain down to species; ranks at the same level are not equivalent between groups.',
    'A clade (monophyletic group) is an ancestor with all its descendants; paraphyletic groups leave some out, polyphyletic groups gather look-alikes.',
    'Reptiles without birds, fish without tetrapods, invertebrates and protists are paraphyletic; algae are polyphyletic.',
    'Species are identified with dichotomous keys in the field and with DNA barcodes in the laboratory.'
  ],
  pitfalls: [
    'Organisms that look alike belong together — Similarity can come from convergence (wings of bats and birds); clades are defined by common descent, shown by shared derived characters and DNA.',
    'The species epithet can be used on its own, as in "sapiens" — It is meaningful only with its genus; "coli" could be several species in different genera.',
    'Two families are comparable units — Ranks are conventions: a mammal family and a beetle family differ hugely in age and species count.'
  ],
  examples: [
    {
      title: 'Putting names right',
      q: 'A student writes: "We grew Escherichia Coli, and fed the flies (drosophila melanogaster) with yeast from the family *saccharomycetaceae*." Correct the names.',
      steps: [
        'Genus capitalised, epithet lower case, both italic: *Escherichia coli* (then *E. coli*).',
        'The fly: *Drosophila melanogaster* — a capital D, and italics.',
        'A family is capitalised and not italic: Saccharomycetaceae.'
      ],
      a: '*Escherichia coli*, *Drosophila melanogaster*, Saccharomycetaceae.'
    },
    {
      title: 'Clade or not?',
      q: 'Birds and crocodilians share a common ancestor that is not shared with lizards; mammals branched off before all of them. Which of these groups are clades: (a) mammals, (b) reptiles in the old sense (lizards, snakes, turtles, crocodilians), (c) crocodilians plus birds, (d) warm-blooded vertebrates (birds and mammals)?',
      steps: [
        '(a) Mammals: an ancestor and all its descendants — a clade.',
        '(b) Old-style reptiles leave out birds, descendants of the same ancestor — paraphyletic.',
        '(c) Crocodilians plus birds (the archosaurs among living animals) include the whole branch — a clade.',
        '(d) Warm-bloodedness evolved separately in birds and mammals; their common ancestor was not warm-blooded and most of its descendants are left out — polyphyletic.'
      ],
      a: 'Clades: (a) and (c). (b) is paraphyletic, (d) polyphyletic.'
    }
  ],
  quiz: [
    { q: 'Which is written correctly in a printed text?', choices: ['Homo Sapiens', '*homo sapiens*', '*Homo sapiens*', '*Homo* Sapiens'], a: 2, why: 'Genus capitalised, epithet lower case, both italic.' },
    { q: 'Crocodiles are more closely related to birds than to lizards.', a: true, why: 'Crocodilians and birds are archosaurs, sharing an ancestor that lizards do not share. That is why "reptiles" without birds is paraphyletic.' },
    { q: 'The traditional group "fish" (sharks, ray-finned fish, lungfish, coelacanths) is…', choices: ['monophyletic', 'paraphyletic', 'polyphyletic', 'a domain'], a: 1, why: 'Its common ancestor is the ancestor of all jawed vertebrates, including tetrapods — which "fish" leaves out.' },
    { q: 'Two species in the same family must also be in the same…', choices: ['genus', 'order', 'species', 'subspecies'], a: 1, why: 'Ranks nest: a family sits inside one order, one class, one phylum. The same family may contain many genera.' },
    { q: 'A report mentions "*Streptomyces* spp.". What does it mean?', choices: ['one unidentified species of *Streptomyces*', 'several species of the genus *Streptomyces*', 'a subspecies', 'a species named "spp."'], a: 1, why: '"sp." is one unidentified species, "spp." several.' }
  ],
  applications: [
    'Field guides and keys used by ecologists, foresters and border biosecurity inspectors.',
    'DNA barcoding to detect food fraud, identify fish in markets and trace illegal wildlife trade.',
    'Conservation: a species needs a name before it can be assessed for the IUCN Red List or protected by law.',
    'Medicine: naming a pathogen correctly decides which tests and treatments apply.'
  ],
  history: 'Aristotle sorted about 500 kinds of animal around 350 BC. John Ray defined species by reproduction in 1686, and Linnaeus made two-part names standard in the 1750s. Darwin (1859) explained why organisms fall into nested groups — common descent — and Willi Hennig turned that into a method, cladistics, in 1950. DNA sequencing since the 1990s has redrawn many branches.',
  sim: ['div-key', 'div-tree']
},

{
  id: 'three-domains', parent: 'classification', title: 'The three domains', level: 2,
  short: 'All cellular life falls into three domains — Bacteria, Archaea and Eukarya — discovered by Carl Woese in 1977 by comparing ribosomal RNA. Archaea look like bacteria but share key machinery with eukaryotes, which probably arose from within them.',
  keywords: ['three domains', 'Bacteria', 'Archaea', 'Eukarya', 'Woese', '16S rRNA', 'ribosomal RNA', 'methanogens', 'Asgard archaea', 'LUCA', 'two-domain tree', 'Jukes–Cantor', 'p-distance', 'five kingdoms'],
  prereq: ['taxonomy', 'prokaryotic-cells', 'phylogenetics'],
  related: ['bacteria-archaea', 'eukaryotic-cells', 'mitochondria-chloroplasts', 'molecular-clock', 'life-history-earth', 'protists', 'fungi', 'viruses'],
  body: `
For most of the twentieth century life was split in two: **prokaryotes**, cells without a nucleus, and **eukaryotes**, cells with one. Robert Whittaker's five kingdoms (1969) — Monera, Protista, Fungi, Plantae and Animalia — put every prokaryote into one kingdom. The picture changed when Carl Woese stopped comparing what cells look like and began comparing their molecules.

### A tree written in ribosomal RNA
Every cell makes proteins on ribosomes, and every ribosome contains a small-subunit RNA — **16S rRNA** in prokaryotes (about 1 540 nucleotides in *E. coli*), **18S** in eukaryotes (about 1 800). It is an ideal record of deep history: all cells have it, it does the same job everywhere, it is rarely passed sideways between species, and it has slowly changing regions next to faster ones. In 1977 Woese and George Fox cut the 16S rRNA of dozens of microbes into fragments and compared the catalogues. The methane-making microbes, **methanogens**, turned out to be as different from ordinary bacteria as bacteria are from us. They called them archaebacteria; in 1990 Woese, Otto Kandler and Mark Wheelis proposed three **domains**: **Bacteria**, **Archaea** and **Eukarya**.

### What sets the domains apart
Archaea look like bacteria under the microscope, share much of their molecular machinery with eukaryotes, and have membranes unlike anyone else's.

| Feature | Bacteria | Archaea | Eukarya |
|---|---|---|---|
| Nucleus and organelles | no | no | yes |
| Membrane lipids | fatty acids, ester-linked | branched isoprenoids, ether-linked | fatty acids, ester-linked |
| Peptidoglycan in the wall | yes (almost all) | never | never |
| RNA polymerase | one, 5 subunits | one, about 11 subunits | three, 12 or more subunits |
| Histones on the DNA | no | in many | yes |
| First amino acid of a protein | formyl-methionine | methionine | methionine |
| Ribosomes | 70S, stopped by streptomycin | 70S, not stopped | 80S, not stopped |
| Growth above 100 °C | none known | several (record 122 °C) | none |
| Methane production | no | only here | no |

### Where eukaryotes came from
Eukaryotic cells are chimeras. Their mitochondria descend from an engulfed alphaproteobacterium and their chloroplasts from a cyanobacterium ([[mitochondria-chloroplasts]]), while their genes for copying and reading DNA resemble those of archaea. In 2015 DNA from sea-floor sediments near a hydrothermal vent field called Loki's Castle revealed the **Asgard archaea**, whose genomes carry genes for proteins once thought unique to eukaryotes, such as relatives of actin. In 2020 a Japanese team, after twelve years of patient culturing, grew one of them: a tiny cell with long, branching protrusions. Many biologists now draw a **two-domain tree**, with eukaryotes branching from *within* the archaea, beside the Asgard group, after a merger with a bacterium.

Two more complications: frequent **horizontal gene transfer** among prokaryotes makes the base of the tree look more like a web, and **viruses** belong to no domain — they are not cells and share no universal gene ([[viruses]]).

> [!fact] The last universal common ancestor (LUCA) lived roughly 4 billion years ago. The oldest widely accepted microbial fossils are about 3.5 billion years old; recognisable eukaryotes appear 1.6–1.8 billion years ago.

### Measuring the distance between two sequences
To compare two aligned rRNA sequences, count the fraction of sites that differ — the **p-distance**. Because a site can change twice (A→G→A, say), $p$ underestimates the real number of substitutions. The **Jukes–Cantor** correction (1969) estimates it, assuming the four bases replace one another equally often:

$$d = -\\tfrac{3}{4}\\ln\\left(1 - \\tfrac{4}{3}p\\right)$$

At $p = 0.1$, $d = 0.107$ — hardly different. At $p = 0.5$, $d = 0.82$; and as $p$ approaches 0.75, the match two random sequences give by chance, $d$ runs off to infinity: the signal is **saturated**. That is why the deepest branches must be read in slowly changing genes such as rRNA.
`,
  ideas: [
    'Comparing 16S/18S ribosomal RNA revealed three domains of cellular life: Bacteria, Archaea and Eukarya (Woese and Fox, 1977; named 1990).',
    'Archaea resemble bacteria in size and shape but eukaryotes in their RNA polymerase, histones and protein start.',
    'Ether-linked isoprenoid membrane lipids are unique to archaea.',
    'Eukaryotes probably arose from within the archaea (near the Asgard group) by merging with a bacterium that became the mitochondrion.',
    'The Jukes–Cantor distance corrects the raw fraction of differing sites for multiple changes at one site.'
  ],
  pitfalls: [
    'Archaea are a kind of bacteria — They were first called archaebacteria, but they are a separate domain with different membranes, walls and gene-reading machinery.',
    'All archaea live in extreme places — Many live in the open ocean, soils, rice paddies and animal guts, including ours.',
    'Viruses form a fourth domain — Viruses are not cells and share no universal gene with cellular life; they are not placed in the three domains.'
  ],
  formulas: [
    {
      name: 'p-distance between two aligned sequences',
      expr: 'p = k/L', tex: 'p = \\dfrac{k}{L}',
      vars: {
        p: { name: 'fraction of sites that differ', q: 'ratio', unit: '%' },
        k: { name: 'number of differing sites', q: 'count', value: 150, int: true },
        L: { name: 'number of aligned sites', q: 'count', value: 1500, int: true }
      },
      note: 'Count only sites present in both sequences (gaps excluded).',
      stories: { p: 'Two 16S rRNA sequences, aligned over {L} sites, differ at {k} of them. What is the p-distance?', k: 'Two sequences aligned over {L} sites have a p-distance of {p}. At how many sites do they differ?' }
    },
    {
      name: 'Jukes–Cantor distance',
      expr: 'd = -(3/4)*ln(1 - 4*p/3)', tex: 'd = -\\tfrac{3}{4}\\ln\\left(1 - \\tfrac{4}{3}p\\right)',
      vars: {
        d: { name: 'estimated substitutions per site' },
        p: { name: 'fraction of sites that differ', q: 'ratio', unit: '%', value: 25, min: 0, max: 74.9 }
      },
      note: 'Assumes all substitutions equally likely and all sites changing at the same rate. Near p = 0.75 the estimate becomes meaningless: the sequences are saturated.',
      practice: { unknowns: ['d', 'p'] },
      stories: { d: 'Two aligned sequences differ at {p} of their sites. How many substitutions per site have really happened, by Jukes–Cantor?', p: 'Two lineages have accumulated {d} substitutions per site. What fraction of sites would you see differing?' }
    }
  ],
  examples: [
    {
      title: 'Correcting a distance',
      q: 'Two 16S rRNA sequences aligned over 1 450 sites differ at 377. Find the p-distance and the Jukes–Cantor distance.',
      steps: [
        '$p = 377/1450 = 0.260$.',
        '$1 - \\tfrac{4}{3}(0.260) = 0.653$, and $\\ln 0.653 = -0.426$.',
        '$d = -0.75 \\times (-0.426) = 0.320$ substitutions per site — about 23 % more than the raw count suggests.'
      ],
      a: 'p = 0.26; d ≈ 0.32 substitutions per site.'
    },
    {
      title: 'Which domain?',
      q: 'A microbe from a hot spring grows best at 95 °C, has no nucleus, has no peptidoglycan, its membrane lipids are ether-linked isoprenoids, and streptomycin does not stop its ribosomes. Which domain?',
      steps: [
        'No nucleus rules out Eukarya.',
        'Ether-linked isoprenoid lipids and the absence of peptidoglycan are the hallmarks of Archaea; so is the insensitivity of its 70S ribosomes to streptomycin.',
        'Growth near 100 °C fits too, though it is not proof on its own.'
      ],
      a: 'Archaea.'
    }
  ],
  quiz: [
    { q: 'Which molecule did Woese and Fox compare to discover the archaea?', choices: ['haemoglobin', 'small-subunit ribosomal RNA', 'cytochrome c', 'mitochondrial DNA'], a: 1, why: 'Every cell has 16S or 18S rRNA and it changes slowly, so it can compare the most distant organisms. Mitochondrial DNA and haemoglobin are missing from prokaryotes.' },
    { q: 'Which of these do archaea share with eukaryotes rather than with bacteria?', choices: ['no nucleus', 'methionine (not formyl-methionine) as the first amino acid of proteins', 'ester-linked fatty-acid membranes', 'peptidoglycan walls'], a: 1, why: 'Archaea start proteins with methionine, have complex RNA polymerases and often histones, as eukaryotes do. Lacking a nucleus they share with bacteria; ester-linked fatty acids are bacterial and eukaryotic, not archaeal.' },
    { q: 'All archaea are extremophiles.', a: false, why: 'Archaea are common in ordinary places: ocean plankton, soils, wetlands, and the guts of cows and people.' },
    { q: 'Two sequences differ at 30 % of their sites. What is the Jukes–Cantor distance (substitutions per site)?', answer: 0.383, why: '$d = -0.75\\ln(1 - 0.4) = -0.75 \\times (-0.511) = 0.383$.' },
    { q: 'Why is a p-distance near 0.75 a warning sign?', choices: ['the sequences are identical', 'the sequences match no better than random ones: multiple changes have erased the signal', 'the alignment is too short', 'it means the organisms are in the same genus'], a: 1, why: 'Random sequences of four equally common bases match at one site in four, so they differ at 75 % of sites; the Jukes–Cantor distance diverges there.' }
  ],
  problems: [
    { q: 'Two aligned sequences of 1 500 sites differ at 120. What is the Jukes–Cantor distance?', answer: 0.0846, tol: 0.02, steps: ['$p = 120/1500 = 0.08$.', '$d = -0.75\\ln(1 - 0.1067) = -0.75 \\times (-0.1128) = 0.0846$.'] },
    { q: 'What p-distance corresponds to a Jukes–Cantor distance of 1 substitution per site?', answer: 0.552, tol: 0.02, steps: ['$1 - \\tfrac{4}{3}p = e^{-4/3} = 0.2636$.', '$p = 0.75 \\times (1 - 0.2636) = 0.552$: more than half the sites differ, yet every site has changed once on average.'] }
  ],
  applications: [
    'Identifying bacteria by sequencing their 16S rRNA gene, in clinical laboratories and in microbiome surveys.',
    'Antibiotics such as streptomycin and tetracycline target 70S ribosomes, sparing our 80S ones (mitochondria, with bacterial-type ribosomes, are the reason for some side effects).',
    'Heat-stable enzymes from archaea, such as the proof-reading DNA polymerase of *Pyrococcus furiosus*, used in high-fidelity PCR.',
    'Metagenomics — sequencing DNA straight from the environment — has found entire phyla, including the Asgard archaea, that no one has seen alive.'
  ],
  history: 'Woese\'s 1977 claim of a "third form of life" made the front page of *The New York Times* and was met with scepticism by many microbiologists, who were used to classifying bacteria by shape and chemistry. The molecular evidence won; Woese received the Crafoord Prize in 2003. The Asgard archaea (2015) and the culturing of one of them (2020) reopened the question of whether there are three domains or two.',
  sim: [{ id: 'div-tree', params: { open: ['Bacteria', 'Archaea', 'Eukarya'] } }, { id: 'div-key', params: { key: 'life' } }]
},

{
  id: 'bacteria-archaea', parent: 'classification', title: 'Bacteria and archaea', level: 2,
  short: 'The two prokaryotic domains: tiny cells without a nucleus that invented most of life\'s chemistry. Bacteria have peptidoglycan walls and ester-linked lipids; archaea have neither, and include the record-holders for heat, acid and salt.',
  keywords: ['bacteria', 'archaea', 'prokaryote', 'Gram stain', 'Gram-positive', 'Gram-negative', 'peptidoglycan', 'outer membrane', 'S-layer', 'ether lipids', 'extremophiles', 'thermophile', 'halophile', 'methanogen', 'cyanobacteria', 'surface-to-volume ratio', 'binary fission'],
  prereq: ['prokaryotic-cells', 'three-domains', 'membrane-structure'],
  related: ['bacterial-growth', 'microbial-metabolism', 'antibiotic-resistance', 'biofilms', 'nitrogen-cycle', 'microbiome', 'diffusion-osmosis', 'medicine:microbes-types', 'pcr'],
  body: `
Prokaryotes — bacteria and archaea — are the oldest, most numerous and most chemically inventive living things. Earth holds about $10^{30}$ prokaryotic cells, more than there are stars in the observable universe, and together they contain some 77 billion tonnes of carbon (bacteria about 70, archaea about 7), second only to plants. Yet only about 20 000 bacteria and fewer than a thousand archaea have been formally named. Most cannot yet be grown: a sample of soil or sea water shows around a hundred times more cells under the microscope than will form colonies on a plate. Sequencing DNA straight from the environment (metagenomics) has revealed whole phyla known only from their genomes.

### Small cells, and why
A typical prokaryote is 0.5–5 µm long; *E. coli* is a rod about 2 µm by 1 µm, with a volume near 1 µm³ (a femtolitre). A cell feeds and breathes through its surface, and for a sphere the surface-to-volume ratio is $3/r$: halve the radius, and each cubic micrometre of cytoplasm has twice as much membrane to serve it. Diffusion is quick over short distances — a small molecule wanders 1 µm in about half a millisecond — but the time grows with the *square* of the distance, so a cell a hundred times wider waits ten thousand times longer. The exception proves the rule: *Thiomargarita magnifica*, a sulfur bacterium up to 2 cm long described in 2022, is mostly a huge vacuole, with its living cytoplasm in a thin layer near the surface.

### Shapes and walls
Most prokaryotes are spheres (**cocci**), rods (**bacilli**), curved rods (**vibrios**) or spirals (**spirilla**, **spirochaetes**). Outside the membrane most bacteria have a wall of **peptidoglycan**, a mesh of sugar chains cross-linked by short peptides. Christian Gram's stain (1884) splits them in two:
- **Gram-positive** bacteria (*Staphylococcus*, *Bacillus*) have a thick wall, 20–80 nm, and stain purple.
- **Gram-negative** bacteria (*E. coli*, *Salmonella*) have a thin wall inside a second, **outer membrane** studded with lipopolysaccharide, and stain pink. The outer membrane keeps many antibiotics out.

Archaea never have peptidoglycan. Many are wrapped in a crystalline protein coat, the **S-layer**; some methanogens have a look-alike polymer, pseudomurein. That is one reason penicillin, which blocks the cross-linking of peptidoglycan, leaves archaea alone.

### The lipid divide
The deepest difference is in the membrane. Bacteria, like eukaryotes, build lipids from straight fatty acids joined to glycerol by **ester** bonds. Archaea use branched **isoprenoid** chains joined by **ether** bonds, to glycerol of the opposite handedness. Many heat-lovers have lipids that span the whole membrane, forming a single tough layer that neither melts nor leaks at 100 °C or pH 1.

### Extremophiles — and ordinary places
| Limit | Record holder | Domain |
|---|---|---|
| Heat | *Methanopyrus kandleri*, grows at 122 °C under high pressure | Archaea |
| Acid | *Picrophilus torridus*, grows best at pH 0.7 | Archaea |
| Salt | *Halobacterium salinarum*, in saturated brine (about 5 M NaCl) | Archaea |
| Radiation | *Deinococcus radiodurans*, survives 5 000 Gy (about 5 Gy can kill a person) | Bacteria |
| Cold | *Planococcus halocryophilus*, divides at −15 °C | Bacteria |

Archaea are not only extremophiles: ammonia-oxidising archaea are a large share of the plankton of the deep ocean, and methanogens live in rice paddies, cow rumens and the human gut. No archaeon is known to cause disease.

### What only prokaryotes do
Prokaryotes invented most of life's chemistry: **oxygenic photosynthesis** (cyanobacteria, which oxygenated the atmosphere about 2.4 billion years ago), **nitrogen fixation** ([[nitrogen-cycle]]), **methanogenesis** (archaea only), and living on rock by oxidising iron, sulfur or ammonia ([[microbial-metabolism]]). They reproduce by binary fission — *E. coli* every 20 minutes in rich broth at 37 °C ([[bacterial-growth]]) — and swap genes sideways by transformation, transduction and conjugation, which is how resistance spreads ([[antibiotic-resistance]]).
`,
  ideas: [
    'Prokaryotes are small because a cell is supplied through its surface: surface-to-volume ratio falls as 3/r, and diffusion time grows as distance squared.',
    'Gram-positive bacteria have a thick peptidoglycan wall; Gram-negative bacteria a thin wall plus an outer membrane.',
    'Archaea have ether-linked isoprenoid lipids and no peptidoglycan; they hold the records for heat, acid and salt.',
    'Oxygenic photosynthesis, nitrogen fixation and methanogenesis were all invented by prokaryotes.',
    'Most prokaryotes have never been grown in the laboratory; DNA sequencing reveals them.'
  ],
  pitfalls: [
    'Bacteria are mostly germs — Only a tiny fraction cause disease; most recycle nutrients, fix nitrogen, make oxygen or live harmlessly with plants and animals.',
    'Archaea are just unusual bacteria — They differ from bacteria in membranes, walls and the machinery that reads genes, and are as distinct from bacteria as we are.',
    'A bigger bacterium would simply grow faster — Doubling the radius halves the surface per unit volume and quadruples diffusion times, so supply cannot keep up; giant bacteria have special tricks such as vacuoles.'
  ],
  formulas: [
    {
      name: 'Surface-to-volume ratio of a sphere',
      expr: 'SV = 3/r', tex: '\\mathrm{SA/V} = \\dfrac{3}{r}',
      vars: {
        SV: { name: 'surface area per unit volume', q: 'wavenumber', unit: '1/µm', tex: '\\mathrm{SA/V}' },
        r: { name: 'cell radius', q: 'length', unit: 'µm', value: 0.5 }
      },
      note: 'From $4\\pi r^2 / \\tfrac{4}{3}\\pi r^3$. For a long rod of radius r the ratio approaches 2/r.',
      stories: { SV: 'A coccus has a radius of {r}. How much membrane does each unit volume of its cytoplasm have?', r: 'What radius gives a spherical cell a surface-to-volume ratio of {SV}?' }
    },
    {
      name: 'Time to diffuse a distance',
      expr: 't = x^2/(2*D)', tex: 't = \\dfrac{x^2}{2D}',
      vars: {
        t: { name: 'typical diffusion time', q: 'time', unit: 'ms' },
        x: { name: 'distance', q: 'length', unit: 'µm', value: 1 },
        D: { name: 'diffusion coefficient', q: 'kinvisc', unit: 'mm²/s', value: 0.001 }
      },
      note: 'The mean-square displacement along one direction is 2Dt. D ≈ 10⁻⁹ m²/s (0.001 mm²/s) for a small molecule in water, 2 × 10⁻⁹ m²/s for oxygen; proteins are about ten times slower.',
      practice: { unknowns: ['t', 'x'] },
      stories: { t: 'How long does a small molecule (D = {D}) take to diffuse {x}?', x: 'How far does a molecule with D = {D} typically diffuse in {t}?' }
    }
  ],
  examples: [
    {
      title: 'A coccus and a giant',
      q: 'Compare the surface-to-volume ratio of a coccus of radius 0.5 µm with that of *Thiomargarita namibiensis*, a spherical cell about 600 µm across.',
      steps: [
        'Coccus: $3/0.5 = 6\\ \\mathrm{\\mu m^{-1}}$.',
        'Giant: $r = 300$ µm, so $3/300 = 0.01\\ \\mathrm{\\mu m^{-1}}$ — 600 times less membrane per unit volume.',
        'It survives because about 98 % of its volume is a vacuole storing nitrate; the living cytoplasm is a skin only a few micrometres thick, so every part of it is close to the surface.'
      ],
      a: '6 µm⁻¹ against 0.01 µm⁻¹, a factor of 600.'
    },
    {
      title: 'Diffusion inside and across cells',
      q: 'A small molecule has $D = 10^{-9}\\ \\mathrm{m^2/s}$. How long does it take to diffuse 1 µm (across a bacterium) and 1 mm?',
      steps: [
        '1 µm: $t = (10^{-6})^2/(2 \\times 10^{-9}) = 5\\times10^{-4}$ s = 0.5 ms.',
        '1 mm: a thousand times the distance, a million times the time — $500$ s, over 8 minutes.',
        'Inside a bacterium diffusion is effectively instant; a millimetre-sized cell could not rely on it.'
      ],
      a: 'About 0.5 ms for 1 µm, but about 8 minutes for 1 mm.'
    }
  ],
  quiz: [
    { q: 'Penicillin kills *Staphylococcus* but has no effect on a methanogenic archaeon. Why?', choices: ['archaea are too small for penicillin to enter', 'archaea have no peptidoglycan for penicillin to act on', 'archaea live without oxygen', 'archaea have a nucleus that protects them'], a: 1, why: 'Penicillin blocks the enzymes that cross-link peptidoglycan. Archaea have S-layers or pseudomurein instead.' },
    { q: 'Halving the radius of a spherical cell changes its surface-to-volume ratio by a factor of…', choices: ['0.5', '2', '4', '8'], a: 1, why: 'SA/V = 3/r, so halving r doubles it (surface falls by 4, volume by 8).' },
    { q: 'Every archaeon lives in an extreme environment.', a: false, why: 'Archaea are abundant in the open ocean and in soils, and methanogens live in guts.' },
    { q: 'Which structure makes Gram-negative bacteria resistant to many antibiotics?', choices: ['a thick peptidoglycan wall', 'an outer membrane with lipopolysaccharide', 'an S-layer', 'a nuclear envelope'], a: 1, why: 'The outer membrane is a second barrier that many drugs cannot cross; Gram-positive bacteria have a thick wall but no outer membrane.' },
    { q: 'How long (in seconds) does a molecule with D = 10⁻⁹ m²/s take to diffuse 100 µm in one direction?', answer: 5, unit: 's', why: '$t = (10^{-4})^2/(2\\times10^{-9}) = 10^{-8}/(2\\times10^{-9}) = 5$ s.' }
  ],
  problems: [
    { q: 'What is the surface-to-volume ratio of a spherical cell 4 µm in diameter?', answer: 1.5, unit: '1/µm', tol: 0.02, steps: ['$r = 2$ µm, so SA/V $= 3/2 = 1.5\\ \\mathrm{\\mu m^{-1}}$.'] },
    { q: 'Oxygen (D = 2 × 10⁻⁹ m²/s) must reach the centre of a spherical colony of radius 50 µm. Roughly how long does it take, in seconds?', answer: 0.625, unit: 's', tol: 0.05, hint: 'Use t = x²/(2D) with x = 50 µm.', steps: ['$t = (5\\times10^{-5})^2/(2 \\times 2\\times10^{-9}) = 2.5\\times10^{-9}/(4\\times10^{-9}) = 0.625$ s.'] }
  ],
  applications: [
    'PCR works because of *Taq* polymerase, from *Thermus aquaticus*, a bacterium found in a Yellowstone hot spring in 1969 ([[pcr]]).',
    'Methanogenic archaea turn sewage sludge and farm waste into biogas.',
    'Nitrogen-fixing bacteria in legume root nodules add some 50–200 kg of nitrogen per hectare a year to fields.',
    'The Gram stain is still the first test on many clinical samples, because it guides the first choice of antibiotic.'
  ],
  history: 'Antonie van Leeuwenhoek saw bacteria — his "animalcules" — in 1676 with a single-lens microscope. Christian Gram published his stain in 1884. Thomas Brock found *Thermus aquaticus* in Yellowstone in 1966–69, showing that life thrives in near-boiling water, and Carl Woese\'s rRNA work (1977) split the prokaryotes into two domains.',
  sim: { id: 'div-tree', params: { open: ['Bacteria', 'Archaea'] } }
},

{
  id: 'protists', parent: 'classification', title: 'Protists', level: 1,
  short: 'Every eukaryote that is not an animal, a land plant or a fungus: algae that make much of the world\'s oxygen, amoebae, ciliates, slime moulds and parasites such as the malaria parasite. A convenient word, not a branch of the tree.',
  keywords: ['protists', 'protozoa', 'algae', 'diatoms', 'dinoflagellates', 'coccolithophores', 'kelp', 'amoeba', 'Paramecium', 'ciliates', 'slime mould', 'Plasmodium', 'malaria', 'apicoplast', 'secondary endosymbiosis', 'phytoplankton', 'paraphyletic', 'choanoflagellates'],
  prereq: ['eukaryotic-cells', 'three-domains', 'mitochondria-chloroplasts'],
  related: ['taxonomy', 'fungi', 'photosynthesis', 'diffusion-osmosis', 'coevolution', 'carbon-cycle', 'medicine:malaria', 'medicine:microbes-types'],
  body: `
"Protist" is not a branch of the tree of life but a leftover: any eukaryote that is not an animal, a land plant or a fungus. The word gathers some of the most different organisms on Earth — a kelp 45 m long, the alga *Ostreococcus* less than a micrometre across, the amoeba of the school microscope, the parasite that causes malaria — whose last common ancestor is the ancestor of *all* eukaryotes. Protists are therefore **paraphyletic**, scattered across every major eukaryotic supergroup. Tens of thousands of species are named, and DNA surveys of sea water suggest many times more.

### Where protists sit on the tree
| Supergroup | Protists in it | Other members |
|---|---|---|
| Opisthokonts | choanoflagellates | animals, fungi |
| Amoebozoa | *Amoeba*, slime moulds (*Dictyostelium*, *Physarum*) | — |
| Archaeplastida | green algae, red algae | land plants |
| SAR: stramenopiles | diatoms, brown algae (kelps), water moulds | — |
| SAR: alveolates | ciliates, dinoflagellates, *Plasmodium* | — |
| SAR: rhizarians | foraminifera, radiolarians | — |
| Excavates | *Euglena*, trypanosomes, *Giardia* | — |
| Haptophytes | coccolithophores | — |

The choanoflagellates, collared cells that filter bacteria from water, are the closest living relatives of animals: their collars look almost exactly like the feeding cells of sponges.

### Algae: the photosynthetic protists
Marine **phytoplankton** carry out about half of all photosynthesis on Earth. **Diatoms** — single cells in two-part boxes of glass (silica) — fix perhaps a fifth of the planet's carbon on their own. **Coccolithophores** armour themselves with plates of chalk; their fallen skeletons built the white cliffs of Dover. **Dinoflagellates** spin with two flagella; some live inside corals and feed them sugar, others bloom as toxic red tides. **Brown algae** include kelps that grow up to half a metre a day, and **red algae** give us agar, carrageenan and nori.

Many algal chloroplasts are second-hand. A red or a green alga was swallowed by another eukaryote and kept as a chloroplast, so diatoms, kelps and *Euglena* have chloroplasts wrapped in three or four membranes instead of two — **secondary endosymbiosis**. Photosynthesis has jumped between branches of the tree, which is why "algae" is **polyphyletic**.

### Hunters and grazers
- **Amoebae** crawl and engulf food by flowing out **pseudopodia** (*Amoeba proteus* is about 0.5 mm long).
- **Ciliates** such as *Paramecium* (0.2–0.3 mm) beat thousands of cilia, keep two kinds of nucleus — a large working macronucleus and a small germ-line micronucleus — and bail out the water that seeps in by osmosis with a **contractile vacuole** ([[diffusion-osmosis]]).
- **Foraminifera** build chambered shells of chalk; the oxygen isotopes in fossil shells are one of our main records of past ocean temperatures.
- **Slime moulds** blur the line between one cell and many: starving *Dictyostelium* amoebae stream together, guided by pulses of cyclic AMP, into a crawling slug that becomes a stalked fruiting body.

### Parasites
A few protists cause major diseases, and understanding their biology is how they are fought. **Malaria** is caused by *Plasmodium*, an alveolate carried by female *Anopheles* mosquitoes. The parasite multiplies first in the liver and then inside red blood cells, which burst in synchronised waves every 48 hours in *P. falciparum* and *P. vivax* — the cause of the periodic fevers. The WHO estimated about 249 million cases and 608 000 deaths in 2022, most of them young children in Africa. *Plasmodium* keeps a relic chloroplast, the **apicoplast**, that no longer photosynthesises but is essential — an inheritance from an algal ancestor, and a drug target. Other parasites include trypanosomes (sleeping sickness, Chagas disease), *Giardia* and *Toxoplasma*; the water mould *Phytophthora infestans* destroyed the potato crops behind the Irish famine that began in 1845.

> [!warn] Fever during or after a stay in an area with malaria can be malaria, which can turn severe within a day, especially in children. Seek medical care promptly and mention the travel; if the person is confused, very drowsy, breathless or having seizures, call your local emergency number.
`,
  ideas: [
    'Protists are all the eukaryotes that are not animals, land plants or fungi — a paraphyletic group spread across the eukaryotic supergroups.',
    'Photosynthetic protists (algae) do much of the world\'s photosynthesis; diatoms alone fix about a fifth of global carbon.',
    'Chloroplasts with three or four membranes come from secondary endosymbiosis, which makes "algae" polyphyletic.',
    'Choanoflagellates are the closest living relatives of animals.',
    'Parasitic protists such as Plasmodium have complex life cycles; its relic chloroplast is a drug target.'
  ],
  pitfalls: [
    'Protists are a kingdom like animals or plants — They are defined by what they are not; their common ancestor is that of all eukaryotes.',
    'Protists are simple because they are single cells — A ciliate has two kinds of nucleus, a mouth, a contractile vacuole and thousands of coordinated cilia: one cell can be as complex as any.',
    'All algae are closely related to plants — Only green (and red) algae sit near land plants; diatoms and kelps got their chloroplasts second-hand and belong to a different supergroup.'
  ],
  examples: [
    {
      title: 'Reading a chloroplast\'s history',
      q: 'A land plant\'s chloroplast has two membranes; a diatom\'s has four. What does this suggest about their origins?',
      steps: [
        'Two membranes: the chloroplast descends directly from a cyanobacterium engulfed by an early eukaryote — **primary** endosymbiosis, shared by land plants, green algae and red algae.',
        'Four membranes: an alga that already had a primary chloroplast was itself engulfed. The extra membranes are the alga\'s own cell membrane and the host\'s engulfing membrane — **secondary** endosymbiosis.',
        'The diatom\'s plastid also carries red-algal genes, so its donor was a red alga.'
      ],
      a: 'The plant\'s chloroplast is first-hand, from a cyanobacterium; the diatom\'s is second-hand, from an engulfed red alga.'
    },
    {
      title: 'Why protists are not a clade',
      q: 'Using the supergroup table, name three groups that share an ancestor with protists but are left out of "protists".',
      steps: [
        'Animals and fungi sit among the opisthokonts with the choanoflagellates.',
        'Land plants sit among the Archaeplastida with the green and red algae.',
        'The ancestor of all protists is the ancestor of all eukaryotes, and animals, fungi and land plants descend from it: the group leaves out some descendants.'
      ],
      a: 'Animals, fungi and land plants — so "protists" is paraphyletic.'
    }
  ],
  quiz: [
    { q: 'Which protists are the closest living relatives of animals?', choices: ['amoebae', 'choanoflagellates', 'ciliates', 'green algae'], a: 1, why: 'Choanoflagellates and animals are sister groups within the opisthokonts; sponge feeding cells look just like them.' },
    { q: 'The protists form a clade.', a: false, why: 'They are the eukaryotes left over when animals, plants and fungi are removed — a paraphyletic group.' },
    { q: 'A chloroplast surrounded by four membranes most likely came from…', choices: ['a cyanobacterium engulfed directly', 'an engulfed eukaryotic alga (secondary endosymbiosis)', 'a mitochondrion', 'a virus'], a: 1, why: 'Primary chloroplasts have two membranes; the extra ones are left from engulfing a whole alga.' },
    { q: 'Why does a freshwater *Paramecium* need a contractile vacuole?', choices: ['to digest food', 'to pump out water that keeps entering by osmosis', 'to store starch', 'to swim faster'], a: 1, why: 'Its cytoplasm is saltier than pond water, so water flows in continuously; without bailing it out the cell would burst.' },
    { q: 'Why can a drug that attacks the apicoplast kill *Plasmodium* while sparing human cells?', choices: ['human cells have no plastid, and the apicoplast\'s bacterial-type machinery differs from ours', 'the apicoplast makes the parasite\'s DNA', 'human cells also have apicoplasts but are protected by their walls', 'the drug only works in mosquitoes'], a: 0, why: 'The apicoplast descends from a cyanobacterium via an alga; its ribosomes and enzymes resemble bacterial ones and have no counterpart in our cells.' }
  ],
  applications: [
    'Agar from red algae solidifies the culture plates of microbiology; carrageenan and alginate thicken foods.',
    'Diatomaceous earth, the fossil shells of diatoms, is used in filters and as a mild abrasive.',
    'Fossil foraminifera date rocks and record past climates; oil geologists use them to correlate strata.',
    'Malaria control combines insecticide-treated bed nets, drugs and, since 2021 and 2023, two WHO-recommended vaccines.'
  ],
  history: 'Leeuwenhoek described protists in pond water in 1674. Ernst Haeckel proposed a kingdom Protista in 1866. Alphonse Laveran saw the malaria parasite in blood in 1880, and Ronald Ross showed in 1897 that mosquitoes carry it — both received Nobel Prizes. Molecular trees since the 1990s broke "Protista" up across the eukaryotic supergroups.',
  sim: [{ id: 'div-tree', params: { open: ['Eukarya', 'SAR', 'Archaeplastida'], highlight: 'protists' } }, { id: 'div-key', params: { key: 'life' } }]
},

{
  id: 'fungi', parent: 'classification', title: 'Fungi', level: 1,
  short: 'Absorptive eukaryotes built from threads called hyphae, with walls of chitin — closer to animals than to plants. They decompose wood, feed most plants through mycorrhizae, and gave us penicillin, bread and beer.',
  keywords: ['fungi', 'hyphae', 'mycelium', 'chitin', 'yeast', 'mould', 'mushroom', 'Ascomycota', 'Basidiomycota', 'decomposition', 'lignin', 'white rot', 'mycorrhiza', 'lichen', 'penicillin', 'Fleming', 'ergosterol', 'death cap'],
  prereq: ['eukaryotic-cells', 'three-domains', 'carbohydrates'],
  related: ['protists', 'plant-nutrition', 'carbon-cycle', 'microbes-industry', 'model-organisms', 'coevolution', 'medicine:antibiotics', 'medicine:poisoning-overdose'],
  body: `
A mushroom is only the fruit. The fungus itself is a hidden web of threads, **hyphae**, 2–10 µm wide, that spreads through soil, wood, leaves or bread as a **mycelium**. Fungi are **absorptive heterotrophs**: they pour digestive enzymes into their food and take up the small molecules released. Long grouped with plants, fungi are in fact **opisthokonts**, closer to animals: like us they store glycogen rather than starch. Their walls are made of **chitin**, the polymer of insect skeletons, and their membranes contain **ergosterol** instead of cholesterol — the target of most antifungal drugs.

### Growing at the tips
A hypha grows only at its tip, where a cluster of vesicles delivers new wall and membrane, and branches behind it. A mould on an agar plate therefore spreads as a ring whose radius grows at a nearly **constant speed** — typically a few millimetres a day, several centimetres a day for the fastest moulds such as *Neurospora* — rather than exponentially as a bacterial population does. Cross-walls (septa) divide most hyphae into compartments, with pores that let cytoplasm and even nuclei stream through; bread moulds have none. Mycelia can be vast: one honey fungus (*Armillaria ostoyae*) in the Blue Mountains of Oregon covers about 9 km² and may be thousands of years old. At the other extreme, **yeasts** are single cells 5–10 µm across that reproduce by budding.

### Diversity
About 150 000 species of fungi have been named, out of an estimated 2–4 million.

| Group | Named species (approx.) | Examples |
|---|---|---|
| Sac fungi (Ascomycota) | 90 000 | baker's yeast, *Penicillium*, *Aspergillus*, morels, truffles, most lichen fungi |
| Club fungi (Basidiomycota) | 50 000 | mushrooms, bracket fungi, puffballs, rusts, smuts |
| Mucoromycota and relatives | a few thousand | bread moulds (*Rhizopus*), arbuscular mycorrhizal fungi |
| Chytrids and early branches | a few thousand | swimming spores; the amphibian chytrid |

### Decomposers
Fungi are the chief recyclers of plant bodies. Only some of them — the white-rot basidiomycetes — can dismantle **lignin**, the tough polymer that stiffens wood, using peroxidases and laccases that attack it with oxygen radicals. With bacteria, decomposers return to the air most of the roughly 60 billion tonnes of carbon that land plants fix each year ([[carbon-cycle]]). One hypothesis holds that the great coal deposits of the Carboniferous formed partly because lignin-digesting fungi had not yet evolved.

### Partners
- **Mycorrhizae**: about 85 % of land plant species live with fungi in or on their roots. The hyphae, far thinner than roots, explore a much larger volume of soil and deliver phosphate, nitrogen and water; the plant pays with sugars and lipids — often a tenth or more of the carbon it fixes. The 407-million-year-old Rhynie chert shows such partnerships already in the earliest land plants.
- **Lichens** are fungi that farm algae or cyanobacteria inside their tissues — some 20 000 species, pioneers on bare rock and bark.
- Leaf-cutter ants and some termites grow fungi as their crop.

### Medicines, food and harm
In 1928 Alexander Fleming noticed that a *Penicillium* mould contaminating a plate of *Staphylococcus* had cleared a halo of bacteria around itself. Howard Florey, Ernst Chain and Norman Heatley purified **penicillin** in 1939–41, and wartime mass production used a strain of *Penicillium chrysogenum* found on a mouldy cantaloupe in Peoria, Illinois. Penicillin blocks the enzymes that cross-link peptidoglycan, so it kills growing bacteria and leaves our cells alone ([[medicine:antibiotics]]). Fungi also gave us ciclosporin, which made organ transplants routine, the first statins, industrial citric acid, and bread, beer, wine, soy sauce and blue cheese ([[microbes-industry]]).

On the other side of the ledger, fungi are the worst plant pathogens — rice blast, wheat rusts, ash dieback — and the chytrid *Batrachochytrium dendrobatidis* has contributed to the decline of some 500 amphibian species. A few cause serious human infections, mostly in people whose immunity is weakened.

> [!warn] The death cap (*Amanita phalloides*) causes most fatal mushroom poisonings. Its toxin, α-amanitin, stops RNA polymerase II, and symptoms may begin only 6–24 hours after the meal, when the liver is already being damaged. Never eat a wild mushroom that an expert has not identified. If someone may have eaten a poisonous mushroom, contact a poison centre at once and keep any leftovers; if they are unwell, call your local emergency number.
`,
  ideas: [
    'Fungi are absorptive heterotrophs made of hyphae; mushrooms are just their spore-bearing fruiting bodies.',
    'Fungi are closer to animals than to plants: chitin walls, glycogen stores, ergosterol in their membranes.',
    'A mycelium grows at its tips, so a colony\'s radius increases at a roughly constant speed.',
    'White-rot fungi are the main decomposers of lignin; mycorrhizal fungi feed about 85 % of plant species.',
    'Penicillin (Fleming, 1928; Florey, Chain and Heatley, 1939–41) is a fungal weapon against bacteria.'
  ],
  pitfalls: [
    'Fungi are a kind of plant — They cannot photosynthesise, have chitin walls and store glycogen; DNA places them next to animals.',
    'The mushroom is the fungus — It is a short-lived reproductive structure; the long-lived body is the mycelium in the soil or wood.',
    'Antifungal drugs are as easy to find as antibiotics — Fungi are eukaryotes like us, so there are few targets they have and we lack; ergosterol and the chitin wall are the main ones.'
  ],
  formulas: [
    {
      name: 'Radial growth of a fungal colony',
      expr: 'r = r0 + k*t', tex: 'r = r_0 + k\\,t',
      vars: {
        r: { name: 'colony radius', q: false, unit: 'mm' },
        r0: { name: 'radius of the inoculum', q: false, unit: 'mm', value: 5 },
        k: { name: 'radial growth rate', q: false, unit: 'mm/day', value: 4 },
        t: { name: 'time since growth began', q: false, unit: 'day', value: 7 }
      },
      note: 'Holds once the colony is established and until nutrients run out or it reaches the edge of the plate: only the hyphal tips at the margin extend.',
      practice: { unknowns: ['r', 'k', 't'] },
      stories: { r: 'A plug of mould {r0} in radius is placed on agar; the colony spreads at {k}. What is its radius after {t}?', k: 'A mould colony grows from {r0} to {r} in radius in {t}. What is its radial growth rate?', t: 'A colony starting at {r0} spreads at {k}. How long until its radius reaches {r}?' }
    }
  ],
  examples: [
    {
      title: 'Covering a Petri dish',
      q: 'A plug of *Aspergillus* 5 mm in radius is placed at the centre of a 90 mm Petri dish. The colony spreads at 4 mm a day. When does it reach the edge?',
      steps: [
        'The dish radius is 45 mm; the colony must grow $45 - 5 = 40$ mm.',
        '$t = 40/4 = 10$ days.',
        'A bacterial culture doubling every hour would grow by a factor of $2^{24}$ in one day — but a mould colony only adds a constant width at its rim, because only the tips grow.'
      ],
      a: 'After about 10 days.'
    },
    {
      title: 'How much soil does a fungus reach?',
      q: 'A root 0.5 mm in diameter can absorb phosphate from about 1 mm of soil around it. A mycorrhizal fungus sends hyphae 5 µm wide up to 5 cm beyond the root. Compare the volume of soil within reach, per centimetre of root.',
      steps: [
        'Root alone: a cylinder of radius about 1.25 mm: $\\pi (0.125\\ \\mathrm{cm})^2 \\times 1\\ \\mathrm{cm} \\approx 0.05\\ \\mathrm{cm^3}$.',
        'With hyphae: a radius of about 5 cm: $\\pi (5)^2 \\times 1 \\approx 80\\ \\mathrm{cm^3}$ — over a thousand times more soil, reached with a small investment in thin threads.',
        'Phosphate hardly moves in soil, so bringing it from beyond the root\'s own depletion zone is the fungus\'s most valuable service to the plant.'
      ],
      a: 'Roughly 0.05 cm³ for the root alone against about 80 cm³ with the fungus.'
    }
  ],
  quiz: [
    { q: 'Fungi are more closely related to…', choices: ['plants', 'animals', 'bacteria', 'algae'], a: 1, why: 'Fungi and animals are opisthokonts; they share chitin-making, glycogen storage and many genes. The plant-like look is convergence.' },
    { q: 'A mushroom is the main body of a fungus.', a: false, why: 'It is a fruiting body made to spread spores; the fungus lives as a mycelium of hyphae.' },
    { q: 'A mould colony starts at 2 mm radius and spreads at 3 mm a day. What is its radius after 10 days (mm)?', answer: 32, unit: 'mm', why: '$r = 2 + 3 \\times 10 = 32$ mm: linear, not exponential, growth.' },
    { q: 'Why are there far fewer antifungal drugs than antibacterial ones?', choices: ['fungi are eukaryotes like us, so there are few targets they have and we lack', 'fungi never cause disease', 'fungi have no cell membrane', 'antifungal drugs are illegal'], a: 0, why: 'Bacteria differ from us in walls, ribosomes and enzymes; fungi share most of our cell machinery. Ergosterol and the chitin/glucan wall are the main differences.' },
    { q: 'What do plants give their mycorrhizal fungi in return for phosphate and water?', choices: ['nitrogen gas', 'sugars and lipids made by photosynthesis', 'chitin', 'oxygen only'], a: 1, why: 'The plant pays in carbon — sugars and lipids — often a tenth or more of what it fixes.' }
  ],
  problems: [
    { q: 'A colony grows from 6 mm to 30 mm radius in 8 days. What is its radial growth rate in mm per day?', answer: 3, unit: 'mm/day', tol: 0.02, steps: ['$k = (30 - 6)/8 = 3$ mm per day.'] }
  ],
  applications: [
    'Antibiotics (penicillins, cephalosporins), immunosuppressants (ciclosporin) and cholesterol-lowering statins, all first found in fungi.',
    'Baking, brewing and wine-making with *Saccharomyces cerevisiae*; soy sauce and miso with *Aspergillus oryzae*; mycoprotein as a meat substitute.',
    'Mycorrhizal inoculants in forestry and restoration; white-rot fungi to break down pollutants.',
    'Insect-killing fungi such as *Beauveria* used as biological pest control.'
  ],
  history: 'Anton de Bary founded mycology in the 1860s and proved that microbes cause plant diseases, starting with potato blight (whose culprit, we now know, is a water mould rather than a true fungus). Simon Schwendener proposed in 1867 that lichens are two organisms living together — ridiculed at first. Albert Frank coined "mycorrhiza" in 1885. Fleming\'s observation of 1928 became a medicine only in 1941, and penicillin shared the 1945 Nobel Prize.',
  sim: { id: 'div-tree', params: { open: ['Eukarya', 'Opisthokonts', 'Fungi'] } }
},

/* ================================================================ PLANTS AND ANIMALS */
{
  id: 'plant-diversity', parent: 'plants-animals-diversity', title: 'The diversity of plants', level: 1,
  short: 'Land plants evolved from green algae about 470 million years ago and conquered dry land in steps: mosses and liverworts, then ferns with water-conducting vessels, then gymnosperms with seeds, and finally flowering plants — nine in ten of today\'s species.',
  keywords: ['land plants', 'embryophytes', 'bryophytes', 'mosses', 'liverworts', 'hornworts', 'ferns', 'lycophytes', 'gymnosperms', 'conifers', 'angiosperms', 'flowering plants', 'alternation of generations', 'gametophyte', 'sporophyte', 'seeds', 'pollen', 'vascular tissue', 'double fertilisation'],
  prereq: ['taxonomy', 'photosynthesis', 'life-history-earth'],
  related: ['plant-tissues', 'transpiration', 'flowering-reproduction', 'seeds-germination', 'fungi', 'coevolution', 'conservation-biology', 'meiosis'],
  body: `
Land plants — the **embryophytes** — descend from freshwater green algae that crept onto land about 470–500 million years ago; their closest living relatives are the zygnematophytes, algae of ponds and damp soil. Everything since has been a series of inventions for life in air: keeping water in, lifting it up, and reproducing without sperm that swim. About 380 000 species are known today, and roughly nine in ten are flowering plants.

### Two generations
All land plants **alternate generations**. A haploid **gametophyte** makes eggs and sperm by mitosis; fertilisation gives a diploid **sporophyte**; the sporophyte makes haploid spores by [[meiosis]], and each spore grows into a new gametophyte. Through plant evolution the balance swings from the gametophyte to the sporophyte:
- In a moss the green cushion is the gametophyte; the sporophyte is a stalked capsule that stays attached to it and is fed by it.
- In a fern the leafy plant is the sporophyte; the gametophyte is a heart-shaped green sheet a few millimetres wide, living on its own on damp soil.
- In a seed plant the gametophytes have shrunk to a few cells: the pollen grain (male) and the embryo sac inside the ovule (female).

### The groups
| Group | Species (approx.) | Water-conducting vessels | Seeds | Examples | Oldest fossils |
|---|---|---|---|---|---|
| Liverworts | 7 300 | no | no | *Marchantia* | about 470 Myr (spores) |
| Mosses | 12 700 | no | no | *Sphagnum*, *Physcomitrium* | — |
| Hornworts | 220 | no | no | *Anthoceros* | — |
| Lycophytes | 1 300 | yes | no | clubmosses, *Selaginella* | about 425 Myr |
| Ferns and horsetails | 10 500 | yes | no | bracken, tree ferns, *Equisetum* | about 390 Myr |
| Gymnosperms | 1 100 | yes | naked | conifers, cycads, *Ginkgo* | about 365 Myr |
| Flowering plants | 300 000–370 000 | yes | inside fruits | grasses, orchids, oaks | about 135 Myr |

Liverworts, mosses and hornworts — the **bryophytes** — stay small: without lignified vessels they cannot lift water far, and their sperm must swim through a film of water to reach the egg. Recent genome studies suggest the three form a single clade, the sister group of all vascular plants.

### The inventions, in order
1. **A waxy cuticle, stomata and spores with tough walls** — life in dry air.
2. **Vascular tissue stiffened with lignin** — xylem for water, phloem for sugar — and true roots and leaves: height ([[plant-tissues]]). The Carboniferous swamp forests of giant clubmosses and horsetails, up to 35 m tall, became much of our coal.
3. **Seeds**: an embryo packed with food in a protective coat, able to wait dormant for years and to travel ([[seeds-germination]]). With **pollen** carrying the male gametophyte through the air, fertilisation no longer needs open water.
4. **Flowers and fruits**: flowers recruit animals to carry pollen — nearly nine in ten flowering plants are pollinated by animals — and fruits recruit them to carry seeds ([[flowering-reproduction]]). **Double fertilisation** makes the food store, the endosperm, only once an egg has been fertilised. Flowering plants appear about 135 million years ago and within a few tens of millions of years dominated most landscapes — Darwin's "abominable mystery".

### Records and riches
The tallest living tree is a coast redwood, *Hyperion*, about 116 m; the oldest known individual tree, a Great Basin bristlecone pine, is about 4 850 years old. The smallest flowering plant, *Wolffia*, is a floating speck under 1 mm, while *Rafflesia arnoldii* bears a single flower about 1 m across. The largest families are the daisies (about 32 000 species), the orchids (28 000) and the legumes (20 000). Three grasses — rice, wheat and maize — supply about half of all the calories people eat. Kew's 2020 assessment estimated that about two in five plant species are threatened with extinction ([[conservation-biology]]).

> [!tip] Open the plant branch of the tree of life below and switch to the log scale: flowering plants outnumber all other land plants together about ten to one.
`,
  ideas: [
    'Land plants evolved from freshwater green algae about 470–500 million years ago.',
    'All land plants alternate a haploid gametophyte with a diploid sporophyte; evolution shifted dominance from the gametophyte (mosses) to the sporophyte (ferns, seed plants).',
    'Key innovations came in order: cuticle and stomata, lignified vascular tissue, seeds and pollen, then flowers and fruits.',
    'Flowering plants, about 135 million years old, are roughly nine in ten of today\'s 380 000 plant species.'
  ],
  pitfalls: [
    'The green moss plant is the diploid generation, like a fern — In mosses the leafy plant is the haploid gametophyte; the diploid sporophyte is only the capsule on its stalk.',
    'Gymnosperms are primitive plants on their way to becoming flowering plants — Conifers are a successful living lineage that dominates the vast northern forests; the two groups have evolved separately for over 300 million years.',
    'Seeds and spores are the same thing — A spore is a single haploid cell; a seed is a multicellular package with a diploid embryo, a food store and a coat.'
  ],
  examples: [
    {
      title: 'Placing an unknown plant',
      q: 'A plant has lignified xylem, feathery leaves with brown dots of sporangia underneath, no flowers and no seeds. Where does it belong?',
      steps: [
        'Xylem: a vascular plant, so not a bryophyte.',
        'No seeds: a lycophyte or a fern. Large, divided leaves with sporangia on their undersides are typical of ferns (lycophytes have small, simple leaves).',
        'The leafy plant is therefore the diploid sporophyte; its gametophyte would be a tiny free-living sheet.'
      ],
      a: 'A fern.'
    },
    {
      title: 'Counting chromosomes through a moss life cycle',
      q: 'A moss has a haploid chromosome number of 12. How many chromosomes are in the cells of (a) the leafy cushion, (b) the capsule wall, (c) a spore, (d) a sperm cell?',
      steps: [
        '(a) The leafy plant is the gametophyte: haploid, 12.',
        '(b) The capsule is part of the sporophyte, grown from the fertilised egg: diploid, 24.',
        '(c) Spores are made by meiosis in the capsule: 12.',
        '(d) Sperm are made by mitosis in the gametophyte: 12.'
      ],
      a: '12, 24, 12, 12.'
    }
  ],
  quiz: [
    { q: 'In a fern, the large leafy plant you see is…', choices: ['the haploid gametophyte', 'the diploid sporophyte', 'a bryophyte', 'a seedling'], a: 1, why: 'In ferns and seed plants the sporophyte dominates; the fern gametophyte is a small separate sheet.' },
    { q: 'Why do mosses stay small?', choices: ['they cannot photosynthesise well', 'they lack lignified vessels to lift water and their sperm must swim', 'they have no chloroplasts in their leaves', 'they are always eaten'], a: 1, why: 'Without xylem, water moves slowly from cell to cell, and fertilisation needs a film of water — both keep mosses low and in damp places.' },
    { q: 'Roughly what fraction of land plant species are flowering plants?', choices: ['about 10 %', 'about 50 %', 'about 90 %', 'over 99 %'], a: 2, why: 'About 300 000–370 000 of roughly 380 000 species.' },
    { q: 'A pine\'s sperm must swim through rain water to reach the egg.', a: false, why: 'Pollen reaches the ovule by air, and a pollen tube delivers the sperm to the egg: seed plants do not need open water for fertilisation.' },
    { q: 'Double fertilisation in flowering plants produces…', choices: ['two embryos', 'an embryo and the endosperm that feeds it', 'pollen and ovules', 'a spore and a gamete'], a: 1, why: 'One sperm fertilises the egg (embryo); the other fuses with two polar nuclei to make triploid endosperm.' }
  ],
  applications: [
    'Food: rice, wheat and maize supply about half of human calories; legumes fix nitrogen with root bacteria.',
    'Medicines from plants: paclitaxel from yews, artemisinin from sweet wormwood, morphine from the opium poppy.',
    'Peat bogs of *Sphagnum* moss store about a third of the world\'s soil carbon on a few per cent of the land.',
    'Seed banks such as the Millennium Seed Bank and the Svalbard vault safeguard crop and wild plant diversity.'
  ],
  history: 'Wilhelm Hofmeister worked out the alternation of generations across mosses, ferns and conifers in 1851, eight years before *On the Origin of Species* — evidence of a shared plan. Darwin called the sudden rise of flowering plants "an abominable mystery" in a letter of 1879; fossil and molecular work has since shown an earlier, slower start than the fossil record then suggested.',
  sim: { id: 'div-tree', params: { open: ['Eukarya', 'Archaeplastida', 'Land plants', 'Vascular plants', 'Seed plants'] } }
},

{
  id: 'invertebrates', parent: 'plants-animals-diversity', title: 'Invertebrates', level: 1,
  short: 'Animals without a backbone — about 95 % of animal species, from sponges and jellyfish to snails, octopuses, starfish and the million named insects. A useful word, but not a branch of the tree: it leaves out the vertebrates that evolved from among them.',
  keywords: ['invertebrates', 'animal phyla', 'sponges', 'cnidarians', 'flatworms', 'nematodes', 'annelids', 'molluscs', 'arthropods', 'insects', 'beetles', 'echinoderms', 'exoskeleton', 'moulting', 'Dyar\'s rule', 'metamorphosis', 'bilateral symmetry', 'protostomes', 'deuterostomes', 'coelom'],
  prereq: ['taxonomy', 'eukaryotic-cells', 'animal-development'],
  related: ['vertebrates', 'model-organisms', 'gas-exchange-animals', 'circulation-animals', 'coevolution', 'flowering-reproduction', 'conservation-biology', 'scaling-allometry'],
  body: `
Of the roughly 1.5 million animal species named so far, about **95 %** have no backbone. "Invertebrate" describes an absence rather than a group: it takes in sponges, jellyfish, worms of many kinds, snails, octopuses, starfish and all the arthropods, and it leaves out their descendants, the vertebrates — a textbook **paraphyletic** grouping ([[taxonomy]]). A starfish is more closely related to you than to a snail.

### Body plans
Animal diversity is organised by a few deep features ([[animal-development]]):
- **Symmetry**: none (sponges), radial (jellyfish, corals) or bilateral, with a head end — the Bilateria, about 99 % of animal species.
- **Germ layers**: two in cnidarians, three (ectoderm, mesoderm, endoderm) in bilaterians.
- **Body cavity**: none (flatworms), a pseudocoelom (nematodes) or a true coelom lined with mesoderm (annelids, molluscs, echinoderms, vertebrates).
- **Development**: in **protostomes** the first opening of the embryo becomes the mouth; in **deuterostomes** — echinoderms and chordates — it becomes the anus. Protostomes split into the **Ecdysozoa**, which moult (arthropods, nematodes), and the **Lophotrochozoa** (molluscs, annelids, flatworms).

| Phylum | Species named (approx.) | Examples | Notable |
|---|---|---|---|
| Porifera | 9 000 | sponges | no true tissues; filter water with collared cells |
| Cnidaria | 10 000 | jellyfish, corals, sea anemones | stinging cells; corals build reefs |
| Platyhelminthes | 30 000 | planarians, tapeworms, flukes | flat, no body cavity; many parasites |
| Nematoda | 25 000 | roundworms, *C. elegans* | perhaps four in five animals on Earth are nematodes |
| Annelida | 17 000 | earthworms, leeches, ragworms | segmented body |
| Mollusca | 85 000 | snails, clams, squid, octopus | an octopus has about 500 million neurons |
| Arthropoda | 1 200 000 | insects, spiders, crabs, millipedes | jointed legs, chitin exoskeleton |
| Echinodermata | 7 500 | starfish, sea urchins | five-part symmetry as adults; tube feet |

### Arthropods and the insects
Arthropods are the most successful animals by any count. Their **exoskeleton** of chitin and protein — hardened with chalk in crabs — is armour, waterproofing and a skeleton for muscles all at once. The price is **moulting**: the exoskeleton cannot grow, so the animal sheds it and swells before the new one hardens, and growth comes in steps. At each moult body dimensions tend to be multiplied by a nearly constant factor, typically about 1.4 (**Dyar's rule**, 1890).

About **one million insect species** are described — beetles alone about 390 000 — and the true total may be around 5.5 million. Their success has several roots: small size, which divides the world into many niches; **flight**, achieved some 100 million years before any vertebrate flew; **complete metamorphosis**, in which larva and adult lead different lives and do not compete (beetles, flies, butterflies, bees and wasps — most insect species); and a long partnership with flowering plants ([[coevolution]]). Insects breathe through **tracheae**, air tubes that carry oxygen right to the tissues. Over millimetres that works superbly, but it is one reason insects stay small; the giant griffinfly *Meganeuropsis* of the Permian, 70 cm across the wings, may have depended on air richer in oxygen than today's.

### Why they matter
Invertebrates run ecosystems. Pollinators — mostly bees, flies, butterflies and beetles — benefit about three quarters of the leading food crops; earthworms turn over and aerate soil; zooplankton link algae to fish; reef-building corals shelter about a quarter of all marine fish species. Surveys such as one in German nature reserves, which found a 76 % fall in flying-insect biomass over 27 years (published 2017), have raised alarm about insect declines, though trends differ between regions and groups ([[conservation-biology]]).
`,
  ideas: [
    'About 95 % of named animal species are invertebrates, but "invertebrates" is a paraphyletic group defined by an absence.',
    'Animal body plans differ in symmetry, germ layers, body cavity and whether the first embryonic opening becomes mouth or anus.',
    'Echinoderms and chordates are deuterostomes: a starfish is closer to us than to a snail.',
    'Arthropods grow by moulting their exoskeleton, in steps of roughly constant ratio (Dyar\'s rule).',
    'About a million insect species are named; small size, flight, metamorphosis and flowering plants help explain their diversity.'
  ],
  pitfalls: [
    'Invertebrates are a natural group like mammals — They are all animals except the vertebrates, which evolved from among them; the group has no shared defining feature.',
    'Invertebrates are simple animals — Octopuses solve problems with half a billion neurons, and bees navigate by the sun and dance directions to food.',
    'Spiders and woodlice are insects — Insects have six legs and three body parts; spiders (eight legs) are arachnids and woodlice (fourteen legs) are crustaceans.'
  ],
  formulas: [
    {
      name: 'Dyar\'s rule: growth by moults',
      expr: 'w = w0*k^n', tex: 'w_n = w_0\\,k^{n}',
      vars: {
        w: { name: 'size after n moults (e.g. head width)', q: 'length', unit: 'mm', tex: 'w_n' },
        w0: { name: 'size of the first larval stage', q: 'length', unit: 'mm', value: 0.5, tex: 'w_0' },
        k: { name: 'growth ratio per moult', value: 1.4, min: 1, max: 3 },
        n: { name: 'number of moults', q: 'count', value: 4, int: true }
      },
      note: 'An empirical rule (Harrison Dyar, 1890), best for hard parts such as head capsules, which cannot grow between moults. Typical ratios are 1.2–1.7.',
      practice: { unknowns: ['w', 'n', 'k'] },
      stories: { w: 'A caterpillar\'s head capsule is {w0} wide in the first stage and grows by a factor {k} at each moult. How wide is it after {n} moults?', n: 'A larva\'s head grows from {w0} to {w}, by a factor of {k} per moult. How many moults has it gone through?', k: 'A head capsule grows from {w0} to {w} in {n} moults. What is the growth ratio per moult?' }
    }
  ],
  examples: [
    {
      title: 'Counting instars from head widths',
      q: 'A beetle larva\'s head capsule is 0.40 mm wide when it hatches and 2.0 mm wide in its final larval stage. If each moult multiplies the width by 1.5, how many moults has it made?',
      steps: [
        '$2.0/0.40 = 5.0 = 1.5^n$.',
        '$n = \\ln 5.0/\\ln 1.5 = 1.609/0.405 = 3.97$.',
        'Four moults — so the larva has five stages (instars). Entomologists use exactly this to tell which instar a larva found in the field is.'
      ],
      a: 'Four moults (five instars).'
    },
    {
      title: 'Who is related to whom?',
      q: 'Rank a starfish, a snail and an earthworm by closeness of relationship to humans.',
      steps: [
        'Humans and starfish are both deuterostomes: they share an ancestor that snails and earthworms do not.',
        'Snails and earthworms are both lophotrochozoan protostomes, equally distant from us.',
        'Body resemblance misleads: the five-armed starfish looks nothing like us, but its early embryo develops as ours does.'
      ],
      a: 'The starfish is closest; the snail and the earthworm are equally more distant.'
    }
  ],
  quiz: [
    { q: 'Roughly what share of named animal species are invertebrates?', choices: ['about 50 %', 'about 75 %', 'about 95 %', 'about 99.9 %'], a: 2, why: 'About 1.4 million of roughly 1.5 million named animals; vertebrates number about 75 000.' },
    { q: 'A starfish is more closely related to humans than to snails.', a: true, why: 'Echinoderms and chordates are deuterostomes; snails are protostomes.' },
    { q: 'Why must an arthropod moult in order to grow?', choices: ['its exoskeleton cannot expand once hardened', 'it needs to change colour', 'moulting removes parasites', 'its muscles grow only when it moults'], a: 0, why: 'The chitin cuticle is a rigid shell; growth happens in the short soft period after it is shed.' },
    { q: 'A caterpillar head capsule is 0.6 mm wide in the first stage and grows 1.5 times at each moult. How wide is it after three moults (mm)?', answer: 2.025, unit: 'mm', why: '$0.6 \\times 1.5^3 = 0.6 \\times 3.375 = 2.03$ mm.' },
    { q: 'Which of these is not an arthropod?', choices: ['spider', 'woodlouse', 'earthworm', 'centipede'], a: 2, why: 'Earthworms are segmented annelids without jointed legs or an exoskeleton.' }
  ],
  problems: [
    { q: 'A larva hatches with a 0.30 mm head capsule and moults five times with a ratio of 1.35. How wide is the head in the final stage?', answer: 1.345, unit: 'mm', tol: 0.02, steps: ['$0.30 \\times 1.35^5 = 0.30 \\times 4.484 = 1.35$ mm.'] }
  ],
  applications: [
    'Pollination of crops by bees and other insects; honey, silk, shellac and carmine.',
    'Biological control: ladybirds and parasitoid wasps against crop pests.',
    'Forensic entomology: the known development times of blowfly larvae help estimate time since death.',
    'Model organisms — the fruit fly *Drosophila* and the nematode *C. elegans* — that revealed genes shared with us ([[model-organisms]]).'
  ],
  history: 'Jean-Baptiste Lamarck coined "invertebrates" (animaux sans vertèbres) around 1801 and classified them far more carefully than Linnaeus, who had lumped most into "insects" and "worms". In 1997 DNA studies united all moulting animals — arthropods and nematodes — as the Ecdysozoa, overturning the long-held idea that segmented annelids and arthropods were close relatives.',
  sim: ['div-key', { id: 'div-tree', params: { open: ['Eukarya', 'Opisthokonts', 'Animals', 'Arthropods'], highlight: 'invertebrates' } }]
},

{
  id: 'vertebrates', parent: 'plants-animals-diversity', title: 'Vertebrates', level: 1,
  short: 'Animals with a backbone and a skull: about 74 000 species of fish, amphibians, reptiles, birds and mammals. Their history is a sequence of inventions — jaws, bony skeletons and lungs, limbs, the amniotic egg, and warm blood, twice.',
  keywords: ['vertebrates', 'chordates', 'notochord', 'jaws', 'fish', 'sharks', 'ray-finned fish', 'lobe-finned fish', 'tetrapods', 'amphibians', 'reptiles', 'amniotic egg', 'birds', 'dinosaurs', 'mammals', 'endothermy', 'Tiktaalik', 'encephalisation quotient', 'brain size'],
  prereq: ['invertebrates', 'taxonomy', 'life-history-earth'],
  related: ['human-evolution', 'thermoregulation-animals', 'gas-exchange-animals', 'circulation-animals', 'scaling-allometry', 'animal-nervous-systems', 'evidence-evolution', 'model-organisms'],
  body: `
Vertebrates are one branch of one animal phylum, the **chordates**. Every chordate has, at some stage of its life, a **notochord** (a flexible supporting rod), a hollow nerve cord along its back, openings in the throat (pharyngeal slits) and a tail beyond the anus. Sea squirts show these features only as swimming larvae; lancelets keep them all their lives. In vertebrates the notochord gives way to a column of **vertebrae** around the nerve cord, and a skull protects an enlarged brain. There are about **74 000 vertebrate species** — some 5 % of named animals — and they include the largest animals that have ever lived.

### The classes and their hallmarks
| Group | Species (approx.) | Innovation or hallmark |
|---|---|---|
| Jawless fish (hagfish, lampreys) | 130 | a skull and vertebral elements, but no jaws |
| Cartilaginous fish (sharks, rays) | 1 300 | **jaws**, paired fins, a skeleton of cartilage |
| Ray-finned fish | 34 500 | bony skeleton, swim bladder; half of all vertebrates |
| Lobe-finned fish (coelacanths, lungfish) | 8 | fleshy fins with bones like those of our limbs; lungs |
| Amphibians | 8 700 | **four limbs**; moist skin used in breathing; eggs laid in water |
| Reptiles | 12 000 | the **amniotic egg**, able to develop on land; scaly skin |
| Birds | 11 000 | feathers, flight, endothermy — living dinosaurs |
| Mammals | 6 600 | hair, milk, three middle-ear bones, a diaphragm, endothermy |

### Key steps, in order
1. **Jaws**, around 430 million years ago, formed from the front gill arches and opened up predation on large prey.
2. **Bony skeletons and lungs** appeared in early bony fish; in ray-finned fish the lung became the swim bladder, a gas float.
3. **Limbs**: lobe-finned fish such as *Tiktaalik* (375 million years old) had a neck and wrist bones, and by 365 million years ago four-limbed **tetrapods** were paddling in shallow water. A lungfish is therefore more closely related to you than to a salmon.
4. The **amniotic egg**, about 320 million years ago, with membranes that hold water and exchange gases, freed reproduction from water. Amniotes then split into the **synapsids**, leading to mammals, and the **sauropsids**: turtles, lizards and snakes, crocodilians, dinosaurs — and birds.
5. **Endothermy**, making body heat to keep warm, evolved twice: in mammals and in birds, which are living theropod dinosaurs ([[thermoregulation-animals]]).

"Fish" and "reptiles" in the old sense are therefore paraphyletic ([[taxonomy]]): the first leaves out the tetrapods, the second leaves out birds.

### Extremes
The smallest known vertebrate is the New Guinea frog *Paedophryne amauensis*, 7.7 mm long; the largest animal ever known is the blue whale, up to about 30 m and 150 tonnes or more. Bats make up about one in five mammal species and rodents about two in five. Greenland sharks are estimated to live for centuries — perhaps 400 years.

### Brains and body size
Across species, brain mass grows less than in proportion to body mass — roughly as body mass to the power 2/3 to 3/4 ([[scaling-allometry]]). Harry Jerison (1973) defined an **encephalisation quotient**, EQ: the brain mass divided by that expected for a typical mammal of the same body mass. Humans score about 7, bottlenose dolphins 4–5, chimpanzees about 2.5 and mice about 0.5. It is a crude, species-level index: crows and parrots have small brains packed with neurons more densely than any primate's, and EQ says nothing about differences between individual animals, let alone people.
`,
  ideas: [
    'Chordates have a notochord, a dorsal hollow nerve cord, pharyngeal slits and a post-anal tail; vertebrates add vertebrae and a skull.',
    'About 74 000 vertebrate species exist; half of them are ray-finned fish.',
    'Jaws, bony skeletons and lungs, limbs, the amniotic egg and endothermy arose in that order.',
    'Birds are living dinosaurs, so "reptiles" without birds and "fish" without tetrapods are paraphyletic.',
    'The encephalisation quotient compares a species\' brain with the brain expected for its body size.'
  ],
  pitfalls: [
    'Whales and dolphins are fish because they swim with fins — They are mammals: they breathe air, have hair at some stage and feed their young on milk; their flippers contain the bones of a mammal\'s hand.',
    'Amphibians gave rise to reptiles, reptiles to mammals, like rungs of a ladder — These are branches, not rungs: mammals descend from early amniotes that were not reptiles, and living amphibians are as evolved as we are.',
    'A bigger brain always means a cleverer animal — Brain size tracks body size; relative size, neuron numbers and brain structure matter more, and bird brains are densely packed.'
  ],
  formulas: [
    {
      name: 'Encephalisation quotient (mammals)',
      expr: 'EQ = Mb/(0.12*M^(2/3))', tex: '\\mathrm{EQ} = \\dfrac{M_{brain}}{0.12\\,(M_{body})^{2/3}}',
      vars: {
        EQ: { name: 'encephalisation quotient', tex: '\\mathrm{EQ}' },
        Mb: { name: 'brain mass', q: false, unit: 'g', value: 1350, tex: 'M_{brain}' },
        M: { name: 'body mass', q: false, unit: 'g', value: 65000, tex: 'M_{body}' }
      },
      note: 'Jerison\'s fit for mammals, with both masses in grams: an average mammal scores 1. Other groups and other studies use different constants and exponents, so compare values only within one scheme.',
      stories: { EQ: 'A species has a brain of {Mb} and a body of {M}. What is its encephalisation quotient?', Mb: 'What brain mass would give an animal of {M} an EQ of {EQ}?' }
    }
  ],
  examples: [
    {
      title: 'Chimpanzee and dolphin',
      q: 'A chimpanzee has a 400 g brain and a 45 kg body; a bottlenose dolphin a 1 600 g brain and a 150 kg body. Find their EQs.',
      steps: [
        'Chimpanzee: $45\\,000^{2/3} = 1\\,265$, so the expected brain is $0.12 \\times 1\\,265 = 152$ g and $\\mathrm{EQ} = 400/152 = 2.6$.',
        'Dolphin: $150\\,000^{2/3} = 2\\,823$, expected $339$ g, $\\mathrm{EQ} = 1\\,600/339 = 4.7$.',
        'Both have far larger brains than a typical mammal of their size; the dolphin\'s relative brain size is second only to ours.'
      ],
      a: 'About 2.6 for the chimpanzee and 4.7 for the dolphin.'
    },
    {
      title: 'Is it a mammal?',
      q: 'The platypus lays eggs, has a duck-like bill and venomous spurs, is covered in fur and feeds its young on milk that seeps from its skin. Classify it.',
      steps: [
        'Hair and milk are the defining mammal characters; egg-laying is an ancestral amniote trait that most mammals have lost.',
        'Egg-laying mammals, the monotremes (platypus and four echidnas), branched off before marsupials and placentals.',
        'Its bill and venom are its own later specialisations.'
      ],
      a: 'A mammal — a monotreme.'
    }
  ],
  quiz: [
    { q: 'Which innovation let vertebrates reproduce away from water?', choices: ['jaws', 'lungs', 'the amniotic egg', 'feathers'], a: 2, why: 'The amnion and other membranes keep the embryo in its own pond and let it exchange gases through a shell.' },
    { q: 'Birds are reptiles in the cladistic sense.', a: true, why: 'Birds descend from theropod dinosaurs; a clade containing crocodiles, lizards and dinosaurs must include birds.' },
    { q: 'Vertebrate jaws evolved from…', choices: ['teeth', 'gill arches', 'the skull roof', 'fin rays'], a: 1, why: 'The front pharyngeal (gill) arches were remodelled into upper and lower jaws; traces remain in our middle-ear bones.' },
    { q: 'A dolphin has a 1 600 g brain and a 150 kg body. What is its EQ (Jerison)?', answer: 4.72, why: '$0.12 \\times 150\\,000^{2/3} = 339$ g, and $1\\,600/339 = 4.7$.' },
    { q: 'About half of all vertebrate species are…', choices: ['mammals', 'birds', 'ray-finned fish', 'amphibians'], a: 2, why: 'About 34 500 of 74 000.' }
  ],
  problems: [
    { q: 'A mouse has a 0.40 g brain and a 20 g body. What is its EQ?', answer: 0.45, tol: 0.03, steps: ['$20^{2/3} = 7.37$; expected brain $= 0.12 \\times 7.37 = 0.884$ g.', '$\\mathrm{EQ} = 0.40/0.884 = 0.45$.'] }
  ],
  applications: [
    'Fisheries and conservation: about two in five amphibian species are threatened, more than any other vertebrate class (Global Amphibian Assessment, 2023).',
    'Comparative anatomy explains human features — our middle-ear bones began as jaw bones.',
    'Zebrafish and mice are vertebrate models for human development and disease ([[model-organisms]]).'
  ],
  history: 'Georges Cuvier founded comparative anatomy around 1800. Thomas Huxley argued from *Archaeopteryx* (found in 1861) that birds are related to dinosaurs, an idea confirmed by feathered dinosaurs from China since 1996. In 2004 Neil Shubin, Edward Daeschler and Farish Jenkins found *Tiktaalik* on Ellesmere Island after deliberately searching rocks of the age evolution predicted — about 375 million years — for a fish on the way to limbs.',
  sim: { id: 'div-tree', params: { open: ['Eukarya', 'Opisthokonts', 'Animals', 'Chordates', 'Vertebrates', 'Lobe-finned vertebrates', 'Tetrapods', 'Amniotes', 'Reptiles (with birds)'], highlight: 'fish' } }
},

{
  id: 'microbiome', parent: 'plants-animals-diversity', title: 'Microbiomes', level: 2,
  short: 'The communities of microbes living on and in plants and animals, and their genes. A person carries about 38 trillion bacteria — roughly one per human cell, not ten — mostly in the colon, where they ferment fibre, make vitamins and keep invaders out.',
  keywords: ['microbiome', 'microbiota', 'gut bacteria', 'colon', 'ten to one', 'short-chain fatty acids', 'butyrate', 'fibre', 'Bacteroidota', 'Bacillota', 'germ-free', 'faecal microbiota transplant', 'Clostridioides difficile', 'probiotics', 'symbiosis', 'Buchnera', 'rumen'],
  prereq: ['bacteria-archaea', 'coevolution', 'medicine:digestive-system'],
  related: ['medicine:gut-microbiome', 'medicine:antibiotics', 'antibiotic-resistance', 'biofilms', 'fermentation', 'experimental-design', 'plant-nutrition', 'medicine:innate-immunity'],
  body: `
You are an ecosystem. Your skin, mouth, gut, airways and genital tract carry communities of bacteria, archaea, fungi, protists and viruses — the **microbiota** — and their combined genes are the **microbiome** (the two words are often used interchangeably). Every plant and animal studied so far has one, and many cannot live normally without it.

### How many? Not ten to one
A figure repeated for forty years held that our bacteria outnumber our own cells ten to one; it came from a rough estimate made in the 1970s. A careful recount by Ron Sender, Shai Fuchs and Ron Milo (2016), for a "reference man" of 70 kg, found:

| | Number | Notes |
|---|---|---|
| Human cells | about $3.0\\times10^{13}$ | 84 % of them red blood cells |
| Bacteria | about $3.8\\times10^{13}$ | together weighing about 0.2 kg |

The ratio is about **1.3 : 1** — roughly one bacterium per human cell — and it shifts with every bowel movement, which removes about a third of the colon's bacteria. Nearly all of them live in the **colon**, whose roughly 0.4 L of contents hold about $10^{11}$ bacteria per millilitre, one of the densest microbial habitats known. The acid stomach holds few; along the small intestine numbers rise from about $10^{3}$ to $10^{8}$ per millilitre. The genes tell a different story: a 2010 survey of European guts catalogued 3.3 million microbial genes, about 150 times our 20 000 protein-coding genes.

### Who lives there
A healthy adult gut holds a few hundred bacterial species, mostly strict anaerobes from two phyla, the **Bacillota** (Firmicutes) and the **Bacteroidota** (Bacteroidetes), with smaller numbers of *Bifidobacterium* and *Akkermansia*, the methane-making archaeon *Methanobrevibacter*, and many viruses that infect bacteria (phages). *E. coli*, the laboratory favourite, is under 1 % of the community. Each person's mix is distinctive and fairly stable for years, though diet, antibiotics and illness shift it.

### What the microbes do
- **Ferment fibre** that our own enzymes cannot digest into short-chain fatty acids — acetate, propionate and butyrate ([[fermentation]]). Butyrate is the main fuel of the cells lining the colon; together these acids supply perhaps 5–10 % of our energy.
- **Make and transform molecules**: vitamin K2 and some B vitamins, bile acids, and drugs — a gut bacterium, *Eggerthella lenta*, can inactivate the heart drug digoxin.
- **Keep invaders out** by occupying space and eating the nutrients first. After broad-spectrum antibiotics, *Clostridioides difficile* can take over and cause severe diarrhoea.
- **Train the immune system**: animals raised germ-free develop abnormal immune tissue in the gut ([[medicine:innate-immunity]]).

A baby is colonised at birth — differently after vaginal and caesarean delivery — and through feeding. Human milk contains about 200 kinds of oligosaccharide that the baby cannot digest; they feed *Bifidobacterium* instead. By about the age of three the gut community resembles an adult's.

### Correlation, causation and caution
Differences in the microbiome have been linked with obesity, inflammatory bowel disease, diabetes, allergies and even mood. Most of these links are **correlations** — illness, diet and medicines change the microbiome too ([[experimental-design]]). Stronger evidence comes from germ-free mice given microbes from a donor, and from randomised trials. One treatment is well established: **faecal microbiota transplantation** cleared recurrent *C. difficile* infection in about 80–90 % of patients in trials, far more often than antibiotics alone.

> [!note] Products sold as probiotics vary widely, and there is good evidence of benefit only for some strains in some conditions. Questions about using them, or about gut symptoms, are best discussed with a doctor, nurse or pharmacist.

### Beyond humans
Aphids depend on the bacterium *Buchnera*, which lives inside special cells and makes amino acids that plant sap lacks; its genome has shrunk to about 640 000 base pairs. Cows digest grass in a rumen of 100–150 L teeming with microbes, whose methanogens release methane. Termites digest wood with gut protists and bacteria; legumes house nitrogen-fixing rhizobia in root nodules ([[plant-nutrition]]); and corals bleach when heat drives out their algal partners ([[coevolution]]).
`,
  ideas: [
    'A microbiome is a community of microbes living with a host, together with its genes.',
    'A 70 kg person carries about 3.8 × 10¹³ bacteria and 3.0 × 10¹³ human cells — about 1.3 to 1, not 10 to 1.',
    'Almost all our bacteria live in the colon, about 10¹¹ per millilitre, mostly anaerobes of two phyla.',
    'Gut microbes ferment fibre to short-chain fatty acids, make vitamins, resist pathogens and shape immunity.',
    'Most microbiome–disease links are correlations; germ-free animals and randomised trials test causation.'
  ],
  pitfalls: [
    'Bacteria outnumber our cells ten to one — The best estimate (2016) is about 1.3 to 1; the old figure came from a rough 1970s guess.',
    'A microbiome difference in sick people shows the microbes caused the illness — The illness, its treatment or the diet may have changed the microbes; causation needs experiments.',
    'All gut bacteria are harmful or all are good — The same species can help in the colon and harm elsewhere, and a healthy community depends on balance and diversity rather than on single "good" strains.'
  ],
  formulas: [
    {
      name: 'Counting bacteria in a volume',
      expr: 'N = n*V', tex: 'N = n\\,V',
      vars: {
        N: { name: 'number of bacteria', q: 'count' },
        n: { name: 'bacteria per unit volume', q: 'numberdensity', unit: '1/mL', value: 9.2e10 },
        V: { name: 'volume of contents', q: 'volume', unit: 'mL', value: 410 }
      },
      note: 'Sender, Fuchs and Milo (2016) used about 410 mL of colon contents and about 0.9 × 10¹¹ bacteria per gram of wet stool.',
      stories: { N: 'The colon of a reference adult holds {V} of contents with {n}. How many bacteria is that?', n: 'A sample of {V} holds {N} bacteria. What is their density?' }
    },
    {
      name: 'Bacteria per human cell',
      expr: 'R = Nb/Nh', tex: 'R = \\dfrac{N_b}{N_h}',
      vars: {
        R: { name: 'bacteria per human cell' },
        Nb: { name: 'number of bacteria', q: 'count', value: 3.8e13, tex: 'N_b' },
        Nh: { name: 'number of human cells', q: 'count', value: 3.0e13, tex: 'N_h' }
      },
      note: 'Varies between people and over the day by a factor of about two.',
      stories: { R: 'A person carries {Nb} bacteria and {Nh} human cells. How many bacteria per human cell?', Nb: 'How many bacteria would a body of {Nh} human cells carry at a ratio of {R}?' }
    }
  ],
  examples: [
    {
      title: 'Counting the colon',
      q: 'Colon contents of about 410 mL hold about 0.92 × 10¹¹ bacteria per millilitre. Estimate the total and compare with 3.0 × 10¹³ human cells.',
      steps: [
        '$N = 0.92\\times10^{11}\\ \\mathrm{mL^{-1}} \\times 410\\ \\mathrm{mL} = 3.8\\times10^{13}$.',
        'Other sites (skin, mouth, small intestine) add only about 1 %.',
        '$R = 3.8\\times10^{13}/3.0\\times10^{13} = 1.3$.'
      ],
      a: 'About 3.8 × 10¹³ bacteria, some 1.3 per human cell.'
    },
    {
      title: 'Where "ten to one" came from',
      q: 'An old estimate assumed 1 kg of intestinal contents with 10¹¹ bacteria per gram, and 10¹³ human cells. What ratio does that give, and what went wrong?',
      steps: [
        '$10^{3}\\ \\mathrm{g} \\times 10^{11}\\ \\mathrm{g^{-1}} = 10^{14}$ bacteria; $10^{14}/10^{13} = 10$.',
        'The colon holds about 0.4 kg, not 1 kg, of contents, and the density is slightly lower: $3.8\\times10^{13}$ bacteria.',
        'Human cells were undercounted: red blood cells alone number about $2.5\\times10^{13}$, for a total near $3\\times10^{13}$.'
      ],
      a: 'The old inputs gave 10 : 1; better numbers for both give about 1.3 : 1.'
    }
  ],
  quiz: [
    { q: 'What is the best current estimate of the ratio of bacteria to human cells in an adult?', choices: ['100 : 1', '10 : 1', 'about 1.3 : 1', '1 : 10'], a: 2, why: 'About 3.8 × 10¹³ bacteria against 3.0 × 10¹³ human cells (Sender, Fuchs and Milo, 2016).' },
    { q: 'Most bacteria in the human colon are strict anaerobes.', a: true, why: 'The colon is almost free of oxygen; *Bacteroides*, *Faecalibacterium* and relatives are killed by air.' },
    { q: 'Which is an established treatment based on the microbiome?', choices: ['faecal microbiota transplantation for recurrent *C. difficile* infection', 'probiotics to cure diabetes', 'antibiotics to boost gut diversity', 'fasting to remove all gut bacteria'], a: 0, why: 'Randomised trials show cure rates around 80–90 % in recurrent *C. difficile* infection. The other claims are unsupported or wrong: antibiotics reduce diversity.' },
    { q: 'Butyrate made by gut bacteria is…', choices: ['a toxin', 'the main fuel of the cells lining the colon', 'a vitamin', 'a bacterial wall component'], a: 1, why: 'Colonocytes take most of their energy from butyrate, a short-chain fatty acid from the fermentation of fibre.' },
    { q: 'A bowel movement removes about a third of 3.8 × 10¹³ colon bacteria. What is the ratio of bacteria to 3.0 × 10¹³ human cells just afterwards?', answer: 0.84, why: '$(2/3) \\times 3.8\\times10^{13} = 2.53\\times10^{13}$, and $2.53/3.0 = 0.84$ — for a while, human cells outnumber bacteria.' }
  ],
  applications: [
    'Faecal microbiota transplantation for recurrent *C. difficile* infection.',
    'Antibiotic stewardship: narrow-spectrum drugs and shorter courses spare the gut community ([[medicine:antibiotics]]).',
    'Feed additives and breeding to cut the methane that rumen microbes make in cattle.',
    'Rhizobium and mycorrhizal inoculants that help crops take up nitrogen and phosphate.'
  ],
  history: 'Antonie van Leeuwenhoek described bacteria from his own dental plaque in 1683. Theodor Escherich isolated *E. coli* from infants\' stools in 1885, and Élie Metchnikoff linked fermented milk to long life in 1907. Germ-free animal colonies from the 1940s onward made experiments on the microbiome possible, and DNA sequencing — above all the Human Microbiome Project (2007–2016) — revealed the communities that culture had missed.'
},

/* ================================================================ METHODS */
{
  id: 'scientific-method-bio', parent: 'methods-topic', title: 'Asking questions in biology', level: 1,
  short: 'Biology advances by testable hypotheses: predict what should happen if an idea is right, design a test whose result could prove it wrong, and let the data decide — then repeat. Falsification, controls, replication and honesty about many tests keep us from fooling ourselves.',
  keywords: ['scientific method', 'hypothesis', 'prediction', 'falsification', 'Popper', 'null hypothesis', 'theory', 'law', 'experiment', 'observational study', 'correlation', 'causation', 'confounding', 'replication', 'multiple testing', 'Bonferroni', 'preregistration', 'Redi', 'Pasteur'],
  prereq: ['cell-theory', 'math:probability-basics'],
  related: ['experimental-design', 'statistics-bio', 'evidence-evolution', 'dna-replication', 'medicine:evidence-based-medicine', 'medicine:reading-health-news', 'math:hypothesis-testing'],
  body: `
Science is a way of finding things out that protects us from fooling ourselves. In biology the danger is real — living things vary, are hard to control and invite wishful thinking — so the method matters. It is less a fixed recipe than a cycle:

1. **Observe** something puzzling: maggots appear on rotting meat.
2. **Ask a question** and propose a **hypothesis** — a tentative, testable explanation: maggots hatch from eggs laid by flies.
3. **Predict** what should happen if the hypothesis is right, and what if it is wrong: meat covered with fine gauze will stay free of maggots.
4. **Test** the prediction with an experiment or new observations, designed so that the result could come out either way ([[experimental-design]]).
5. **Analyse** the results, usually with statistics ([[statistics-bio]]), draw a conclusion, and publish so that others can criticise and repeat the work.

Francesco Redi did exactly this in 1668: meat in open jars crawled with maggots, meat under gauze did not, although flies laid eggs on the gauze.

### Falsification
The philosopher Karl Popper (1934) pointed out an asymmetry: no number of white swans proves that all swans are white, but one black swan disproves it. A scientific hypothesis must therefore be **falsifiable** — it must forbid something that could be observed. "Shoots bend towards light because a growth hormone moves to their shaded side" can be tested; "plants grow as they are meant to" cannot. In practice a single failed prediction is weighed with care, since the fault may lie in an instrument or a hidden assumption rather than in the hypothesis — one reason results are replicated.

Statistics makes the logic formal. The **null hypothesis** $H_0$ says there is no effect — the fertiliser does nothing — and the analysis asks how surprising the data would be if $H_0$ were true.

### Hypothesis, theory, law
In everyday speech a theory is a hunch. In science a **theory** is the opposite: a broad explanation supported by many independent lines of evidence that has survived repeated attempts to refute it — cell theory, the germ theory of disease, the theory of evolution ([[evidence-evolution]]). A **law** describes a regularity, often without explaining it, like Mendel's laws.

### Experiments and observations
In an **experiment** the investigator changes one factor and holds the rest constant. Much of biology cannot be done that way: we cannot rerun evolution or assign people to smoke. **Observational** and **comparative** studies — across species, habitats, populations or fossils — then test predictions instead. Their trap is **confounding**: ice-cream sales and drownings rise together because both follow hot weather. A correlation alone does not show a cause; controlled experiments, natural experiments and converging lines of evidence can.

### Tests that changed biology
- **Pasteur's swan-neck flasks** (1859–62): boiled broth in flasks with long, bent necks stayed clear for months — air could enter, but dust and microbes settled in the bend. Snap the neck and microbes grew. Spontaneous generation was refuted.
- **Semmelweis** (1847) saw that childbed fever killed about 10 % of mothers on a ward run by doctors who came straight from dissections, against about 4 % on the midwives' ward. Hand-washing in chlorinated lime brought deaths down to 1–2 %.
- **Meselson and Stahl** (1958) worked out what three rival models of DNA replication predicted for DNA labelled with heavy nitrogen; only the semi-conservative model survived ([[dna-replication]]).
- **Marshall and Warren** proposed in 1982 that a bacterium, *Helicobacter pylori*, causes most stomach ulcers, against the belief that stress and acid did. Trials that cured ulcers with antibiotics convinced the field; they shared the 2005 Nobel Prize.

### When many hypotheses are tested
Test 20 hypotheses that are all false, each at a significance level of 5 %, and the chance of at least one "significant" result is $1 - 0.95^{20} = 64\\%$. Fishing through many comparisons and reporting only the hits manufactures false discoveries. The remedies: state hypotheses and analyses in advance (**preregistration**), correct for the number of tests — the Bonferroni correction tests each at $\\alpha/k$ — report every result, and **replicate**. When one company tried to reproduce 53 landmark cancer-biology studies in 2012, it could confirm only 6.

> [!key] A good hypothesis sticks its neck out: it predicts something that could turn out to be false.
`,
  ideas: [
    'A hypothesis is a testable explanation; a prediction says what should happen if it is true.',
    'Hypotheses must be falsifiable; experiments are designed so the result could go either way.',
    'A scientific theory is a well-tested explanation supported by many lines of evidence, not a guess.',
    'Correlation in observational data can come from confounding; causation needs experiments or converging evidence.',
    'Many tests at α = 0.05 almost guarantee false positives: preregister, correct for multiple tests and replicate.'
  ],
  pitfalls: [
    'A good experiment proves a hypothesis true — Experiments can refute a hypothesis or support it; support accumulates, but proof in the mathematical sense does not exist in empirical science.',
    'Evolution is "only a theory" — In science a theory is an explanation supported by overwhelming evidence and tested countless times; that is the highest status an idea can have.',
    'A significant result from one study settles the question — False positives, bias and chance mean single results need replication before they are trusted.'
  ],
  formulas: [
    {
      name: 'Chance of at least one false positive in k tests',
      expr: 'P = 1 - (1 - a)^k', tex: 'P = 1 - (1 - \\alpha)^{k}',
      vars: {
        P: { name: 'chance of at least one false positive', q: 'ratio', unit: '%' },
        a: { name: 'significance level of each test', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 50, tex: '\\alpha' },
        k: { name: 'number of independent tests', q: 'count', value: 20, int: true }
      },
      note: 'Assumes every null hypothesis is true and the tests are independent.',
      stories: { P: 'A study tests {k} independent hypotheses, each at a significance level of {a}, and none of the effects is real. What is the chance of at least one "significant" result?', k: 'How many independent tests at {a} give a {P} chance of at least one false positive?' }
    },
    {
      name: 'Bonferroni correction',
      expr: 'ai = a/k', tex: '\\alpha_{each} = \\dfrac{\\alpha}{k}',
      vars: {
        ai: { name: 'significance level for each test', q: 'ratio', unit: '%', tex: '\\alpha_{each}' },
        a: { name: 'overall significance level wanted', q: 'ratio', unit: '%', value: 5, tex: '\\alpha' },
        k: { name: 'number of tests', q: 'count', value: 10, int: true }
      },
      note: 'Keeps the chance of any false positive at or below α; conservative when tests are many or correlated.',
      stories: { ai: 'You will test {k} plant extracts and want an overall false-positive risk of {a}. What significance level should each test use?' }
    }
  ],
  examples: [
    {
      title: 'Do woodlice prefer damp places?',
      q: 'Turn the idea "woodlice prefer damp places" into a hypothesis, a prediction, a null hypothesis and a result that would falsify it.',
      steps: [
        'Hypothesis: woodlice move towards damp conditions, because they lose water easily through their cuticle.',
        'Prediction: in a choice chamber with a damp half and a dry half, otherwise identical and in uniform light, more woodlice will settle on the damp side than the 50 % expected by chance.',
        'Null hypothesis $H_0$: they settle at random — half on each side.',
        'Falsifying result: over repeated, randomised trials, no excess — or an excess on the dry side. A chi-square test ([[statistics-bio]]) says how large an excess chance could produce.'
      ],
      a: 'A clear, testable prediction with a null hypothesis the data could reject.'
    },
    {
      title: 'Screening ten plant extracts',
      q: 'A student tests 10 plant extracts for antibacterial activity, each at α = 0.05. Suppose none works. What is the chance of at least one false positive, and what significance level should each test use to keep the overall risk at 5 %?',
      steps: [
        '$P = 1 - 0.95^{10} = 1 - 0.599 = 0.401$ — a 40 % chance of a spurious "hit".',
        'Bonferroni: $\\alpha_{each} = 0.05/10 = 0.005$.',
        'Better still: follow up any hit with an independent replicate experiment.'
      ],
      a: 'About 40 %; test each at 0.005.'
    }
  ],
  quiz: [
    { q: 'Which statement is a falsifiable hypothesis?', choices: ['Plants grow as nature intends.', 'Bean seedlings grow taller in blue light than in red light of the same intensity.', 'Some unknown factor may affect growth.', 'Living things are wonderful.'], a: 1, why: 'It forbids an observable outcome — taller seedlings in red light would refute it. The others predict nothing specific.' },
    { q: 'In science, a "theory" is…', choices: ['a guess awaiting evidence', 'a well-tested explanation supported by many lines of evidence', 'the same as a hypothesis', 'a law that has been proved'], a: 1, why: 'Cell theory and the theory of evolution are explanations that have survived extensive testing.' },
    { q: 'A survey finds that people who own more houseplants have lower blood pressure. This shows that houseplants lower blood pressure.', a: false, why: 'Observational data can be confounded — by income, age, time at home or lifestyle. A randomised experiment would be needed.' },
    { q: 'You test 10 true null hypotheses, each at α = 5 %. What is the chance (in %) of at least one false positive?', answer: 40.1, unit: '%', why: '$1 - 0.95^{10} = 0.401$.' },
    { q: 'Pasteur\'s swan-neck flasks were designed so that…', choices: ['no air could reach the broth', 'air could reach the broth but dust and microbes could not', 'the broth could not be boiled', 'microbes were added to the broth'], a: 1, why: 'Critics said spontaneous generation needed air; the bent neck let air in while trapping particles, so the only difference from an open flask was the microbes.' }
  ],
  applications: [
    'Designing laboratory experiments, field studies and clinical trials that can give a clear answer.',
    'Reading health news critically: asking whether a claim comes from a correlation or an experiment ([[medicine:reading-health-news]]).',
    'Preregistered studies and registered reports, now offered by many journals, reduce selective reporting.'
  ],
  history: 'Francesco Redi\'s gauze-covered jars (1668) were an early controlled experiment. Louis Pasteur\'s flasks (1859–62) ended the debate on spontaneous generation, and Karl Popper made falsifiability the mark of science in 1934. The "replication crisis" of the 2010s led to preregistration, open data and large collaborative replication projects.',
  sim: { id: 'div-ttest', params: { effect: 0 }, title: 'When there is no effect: false positives' }
},

{
  id: 'experimental-design', parent: 'methods-topic', title: 'Experimental design and controls', level: 2,
  short: 'How to set up an experiment whose answer can be trusted: one variable changed, negative and positive controls, enough independent replicates, random allocation, blocking, blinding, and a sample size chosen for adequate power — with the 3Rs for work on animals.',
  keywords: ['experimental design', 'independent variable', 'dependent variable', 'control', 'negative control', 'positive control', 'placebo', 'vehicle control', 'replication', 'biological replicate', 'technical replicate', 'pseudoreplication', 'randomisation', 'blocking', 'blinding', 'confounding', 'power', 'sample size', 'factorial design', '3Rs', 'Fisher'],
  prereq: ['scientific-method-bio', 'math:probability-basics', 'math:standard-deviation'],
  related: ['statistics-bio', 'model-organisms', 'lab-math', 'microbiome', 'medicine:clinical-trials', 'medicine:evidence-based-medicine', 'math:normal-distribution'],
  body: `
A good experiment answers one question clearly, and its answer does not depend on who did it, on which bench the plants stood, or on what the experimenter hoped to see. Ronald Fisher set out the principles at the Rothamsted agricultural station in the 1920s and 30s (*The Design of Experiments*, 1935), and they apply to a Petri dish as much as to a field trial or a clinical trial.

### Variables
- The **independent variable** is what you change: the dose of fertiliser.
- The **dependent variable** is what you measure: plant height after 21 days.
- **Controlled variables** are held constant: light, temperature, soil, watering, seed batch.
- A **confounding variable** changes together with the independent variable and could explain the result on its own. If all the fertilised pots stood by the window, light is confounded with fertiliser.

### Controls
A **negative control** gets everything except the factor under test, showing what happens without it: plants watered with plain water; cells given only the solvent the drug is dissolved in (a **vehicle control**); animals given a sham operation; patients given a placebo. A **positive control** gets something known to work, proving the method *can* detect an effect — a known antibiotic on a plate used to test plant extracts. If the positive control fails, a negative result means nothing.

### Replication
Individuals differ, so one of each tells you almost nothing. **Biological replicates** are independent units — separate plants, animals, or cultures grown from different colonies — and they are what the sample size $n$ counts. **Technical replicates**, measuring one sample three times, show the precision of the method, not biological variation. Treating them as independent is **pseudoreplication** (Stuart Hurlbert, 1984): twenty fish in one tank per treatment are a single replicate, because anything peculiar to that tank affects all twenty.

### Randomisation and blocking
Assign units to treatments by chance — with random numbers, not "the first ten plants I picked". Randomisation spreads unknown confounders evenly between the groups and is what makes the statistics valid. When a known source of variation exists — benches with different light, days, litters of mice, batches of reagent — **block** on it: put every treatment in every block and randomise within each. Testing two factors in all their combinations (a **factorial design**, such as 2 × 2) reveals interactions — fertiliser that helps only when water is plentiful — at no extra cost.

### Blinding
People see what they expect. Whoever measures or scores — plant heights, microscope images, animal behaviour, symptoms — should not know which group a unit belongs to: code the labels. In clinical trials **double blinding** keeps both patients and clinicians unaware ([[medicine:clinical-trials]]).

### How many replicates?
**Power** is the probability that an experiment detects an effect that is really there; 80 % is a common target. To compare two means that differ by $\\delta$, with standard deviation $\\sigma$, at a 5 % significance level:

$$n \\approx \\frac{2\\,(z_{\\alpha/2} + z_{\\beta})^2\\,\\sigma^2}{\\delta^2} \\approx 15.7\\,\\frac{\\sigma^2}{\\delta^2}\\quad\\text{per group}$$

An effect of one standard deviation needs about 16–17 per group; half a standard deviation, about 63; a fifth, about 400. Too few replicates waste the whole effort — and, less obviously, the significant results that underpowered studies do produce tend to exaggerate the true effect. Try it in the simulation below.

| Principle | Protects against |
|---|---|
| Negative control | crediting the treatment with effects of something else |
| Positive control | missing an effect because the method failed |
| Biological replication | mistaking individual variation for an effect |
| Randomisation | selection bias and unknown confounders |
| Blocking | known sources of variation swamping the effect |
| Blinding | the expectations of observers and subjects |
| Power analysis | too few, or needlessly many, replicates |

### Animals and ethics
Experiments on animals are approved and monitored by ethics committees under national law, and follow the **3Rs** of William Russell and Rex Burch (1959): **Replace** animals with cells, organoids, computer models or less sentient organisms wherever possible; **Reduce** the number used to the minimum that answers the question — a power calculation does exactly this; **Refine** procedures, housing and care to minimise pain and distress. The ARRIVE reporting guidelines (2010, revised 2020) ask for randomisation, blinding and the reasoning behind the sample size to be stated.
`,
  ideas: [
    'Change one variable, measure another, hold the rest constant, and watch for confounders.',
    'Negative controls show what happens without the treatment; positive controls show the method works.',
    'n counts independent biological replicates, not repeated measurements of one sample.',
    'Randomisation, blocking and blinding remove bias; power analysis sets the sample size (about 15.7 σ²/δ² per group for 80 % power at α = 0.05).',
    'Animal work follows the 3Rs: replace, reduce, refine.'
  ],
  pitfalls: [
    'Measuring one sample three times gives n = 3 — Those are technical replicates; n counts independent biological units.',
    'A control group is only needed when the effect is small — Without a control you cannot tell the treatment\'s effect from changes that would have happened anyway, however large.',
    'Picking "typical-looking" animals or plants for each group is as good as randomising — Unconscious choices introduce bias; only random allocation spreads unknown confounders evenly.'
  ],
  formulas: [
    {
      name: 'Replicates needed per group (two-group comparison)',
      expr: 'n = 2*(za + zb)^2*(s/d)^2', tex: 'n = 2\\,(z_{\\alpha/2} + z_{\\beta})^2\\,\\dfrac{\\sigma^2}{\\delta^2}',
      vars: {
        n: { name: 'biological replicates per group (round up)' },
        za: { name: 'z for the significance level (1.96 for 5 %, two-sided)', value: 1.96, tex: 'z_{\\alpha/2}' },
        zb: { name: 'z for the power (0.84 for 80 %, 1.28 for 90 %)', value: 0.84, tex: 'z_{\\beta}' },
        s: { name: 'standard deviation between individuals', q: 'length', unit: 'cm', value: 4, tex: '\\sigma' },
        d: { name: 'smallest difference worth detecting (same units)', q: 'length', unit: 'cm', value: 2, tex: '\\delta' }
      },
      note: 'Normal approximation for comparing two means; the exact t-test answer is one or two larger for small n. σ and δ may be in any unit as long as it is the same.',
      practice: { unknowns: ['n', 'd'] },
      stories: { n: 'Plant heights vary with a standard deviation of {s}. How many plants per group are needed to detect a difference of {d} with α = 5 % and 80 % power?', d: 'With {n} plants per group and a standard deviation of {s}, what is the smallest difference detectable with α = 5 % and 80 % power?' }
    },
    {
      name: 'Power of a two-group comparison',
      expr: 'P = ncdf(d/s*sqrt(n/2) - za)', tex: 'P = \\Phi\\left(\\dfrac{\\delta}{\\sigma}\\sqrt{\\dfrac{n}{2}} - z_{\\alpha/2}\\right)',
      vars: {
        P: { name: 'power (chance of detecting the effect)', q: 'ratio', unit: '%' },
        d: { name: 'true difference between the groups', q: 'length', unit: 'cm', value: 2, tex: '\\delta' },
        s: { name: 'standard deviation between individuals', q: 'length', unit: 'cm', value: 4, tex: '\\sigma' },
        n: { name: 'replicates per group', value: 20 },
        za: { name: 'z for the significance level (1.96 for 5 %)', value: 1.96, tex: 'z_{\\alpha/2}' }
      },
      note: 'Φ is the standard normal distribution function. A normal approximation, slightly optimistic for small groups.',
      practice: { unknowns: ['P', 'n'] },
      stories: { P: 'An experiment has {n} plants per group, a standard deviation of {s}, and the true effect is {d}. What is its power at α = 5 %?', n: 'How many replicates per group give a power of {P} for a difference of {d} when the standard deviation is {s}?' }
    }
  ],
  examples: [
    {
      title: 'What is wrong with this experiment?',
      q: 'To test a fertiliser, a student puts 5 fertilised plants on a sunny windowsill and 5 unfertilised plants on a shelf, then measures them herself after three weeks. List the flaws and a better design.',
      steps: [
        'Light is **confounded** with fertiliser: any difference could be the windowsill.',
        'Five per group is probably **underpowered** for a modest effect.',
        'The plants were not **randomly allocated**, and the measurer knew which were which — no **blinding**.',
        'Better: 20 plants per group (after a power calculation), all in the same place, positions randomised and rotated or blocked by shelf, pots coded by a friend, and heights measured blind. Water every pot the same volume.'
      ],
      a: 'Confounding by light, too few plants, no randomisation, no blinding — fix all four.'
    },
    {
      title: 'Planning the sample size',
      q: 'Plant heights vary with a standard deviation of 4 cm. How many plants per group are needed to detect a 2 cm difference at α = 0.05 with 80 % power? And with 90 % power?',
      steps: [
        '80 % power: $n = 2(1.96 + 0.84)^2 (4/2)^2 = 2 \\times 7.84 \\times 4 = 62.7$, so 63 per group.',
        '90 % power: $z_\\beta = 1.28$: $n = 2(3.24)^2 \\times 4 = 84.0$, so 84 per group.',
        'Wanting to detect a 1 cm difference instead would quadruple both numbers.'
      ],
      a: '63 per group for 80 % power, 84 for 90 %.'
    }
  ],
  quiz: [
    { q: 'What is a positive control for?', choices: ['to show what happens without the treatment', 'to show that the method can detect an effect when one exists', 'to increase the sample size', 'to replace randomisation'], a: 1, why: 'If a known active treatment fails to show an effect, the assay is not working and a negative result tells you nothing.' },
    { q: 'Measuring the height of one plant three times gives three biological replicates.', a: false, why: 'Those are technical replicates of one plant; biological replicates are separate plants.' },
    { q: 'Why allocate units to treatments at random?', choices: ['it makes the experiment faster', 'it spreads unknown confounding factors evenly between groups', 'it guarantees a significant result', 'it removes the need for controls'], a: 1, why: 'Random allocation prevents systematic differences — known or unknown — between the groups at the start.' },
    { q: 'At α = 0.05 and 80 % power, about how many replicates per group are needed to detect a difference equal to one standard deviation?', answer: 15.7, why: '$n = 2(1.96 + 0.84)^2 \\times 1 = 15.7$ — round up to 16 (17 with the exact t-test).' },
    { q: 'Halving the difference you want to detect (same σ, α and power) multiplies the sample size by…', choices: ['2', '√2', '4', '8'], a: 2, why: 'n is proportional to (σ/δ)², so halving δ quadruples n.' }
  ],
  problems: [
    { q: 'Mouse body weights vary with SD 2.5 g. How many mice per group are needed to detect a 2.5 g difference at α = 0.05 with 90 % power (z = 1.96 and 1.28)?', answer: 21, tol: 0.03, hint: 'δ/σ = 1.', steps: ['$n = 2(1.96 + 1.28)^2 \\times 1 = 2 \\times 10.50 = 21.0$ per group.', 'Round up: 21 (the exact t-test gives 22–23). Using no more animals than this serves the "Reduce" of the 3Rs.'] }
  ],
  applications: [
    'Agricultural field trials of crop varieties and fertilisers, using randomised blocks as Fisher did.',
    'Randomised, double-blind, placebo-controlled clinical trials ([[medicine:clinical-trials]]).',
    'Planning animal studies to use the fewest animals that can answer the question (the 3Rs).',
    'Microbiome and drug screens with vehicle controls, positive controls and blinded scoring.'
  ],
  history: 'Ronald Fisher developed randomisation, blocking, factorial designs and the analysis of variance for field trials at Rothamsted from 1919; his 1935 book opens with a lady who claims to taste whether milk was poured into the tea first. The first modern randomised controlled trial in medicine, of streptomycin for tuberculosis, was published in 1948. Russell and Burch set out the 3Rs in *The Principles of Humane Experimental Technique* (1959).',
  sim: 'div-ttest'
},

{
  id: 'statistics-bio', parent: 'methods-topic', title: 'Statistics for biologists', level: 2,
  short: 'Living things vary, so every comparison needs statistics: the mean and standard deviation describe a sample, the standard error and confidence interval say how precisely it estimates the population, and tests such as the t-test and chi-square give a p-value — the chance of data this extreme if there were no effect.',
  keywords: ['statistics', 'mean', 'median', 'standard deviation', 'standard error', 'confidence interval', 'normal distribution', 'null hypothesis', 'p-value', 'significance', 't-test', 'Welch', 'Student', 'chi-square', 'degrees of freedom', 'effect size', 'Cohen\'s d', 'type I error', 'type II error', 'ANOVA', 'error bars'],
  prereq: ['experimental-design', 'math:standard-deviation', 'math:normal-distribution'],
  related: ['math:hypothesis-testing', 'math:central-limit-theorem', 'math:descriptive-statistics', 'chi-square-genetics', 'math:linear-regression', 'scientific-method-bio', 'lab-math', 'medicine:evidence-based-medicine'],
  body: `
Two groups of plants never come out exactly alike, even when the treatment does nothing. Statistics answers the question every biologist has to ask: is this difference bigger than the variation between individuals would produce by chance? It works in three steps — describe the data, estimate what they say about the whole population, and test a hypothesis.

### Describing a sample
For measurements $x_1, x_2, \\dots, x_n$:
- The **mean** $\\bar{x} = \\sum x_i/n$ is the centre; the **median**, the middle value, resists outliers and suits skewed data.
- The **standard deviation** $s = \\sqrt{\\sum (x_i - \\bar{x})^2/(n - 1)}$ measures how much individuals spread. Dividing by $n - 1$ rather than $n$ corrects for measuring deviations from the sample's own mean, which sits slightly too close to the data.
- Many biological measurements are roughly **normal**: about 68 % of individuals lie within one SD of the mean, 95 % within 1.96 SD and 99.7 % within three ([[math:normal-distribution]]). Others — bacterial counts, enzyme activities, gene expression — are skewed and become near-normal after taking logarithms.

### How precise is the mean?
The mean of a sample is itself random: another sample would give another mean. Its spread from sample to sample is the **standard error**, $\\mathrm{SE} = s/\\sqrt{n}$. Quadrupling the sample halves the SE — precision grows only with the square root of effort. By the central limit theorem, means are close to normal even when individuals are not ([[math:central-limit-theorem]]).

A **95 % confidence interval** is $\\bar{x} \\pm t^{*}\\,\\mathrm{SE}$, where $t^{*}$ comes from Student's t distribution with $n - 1$ degrees of freedom: 2.571 for $n = 6$, 2.262 for $n = 10$, 2.042 for $n = 31$, approaching 1.96 for large samples. Its promise is about the method: intervals built this way contain the true mean in 95 % of experiments — the first simulation below shows it happening. The SD describes individuals; the SE and the confidence interval describe the estimate. Error bars must say which they show.

### Testing a hypothesis
1. State the **null hypothesis** $H_0$ — no difference, no effect — and a significance level, usually $\\alpha = 0.05$.
2. Compute a **test statistic**: how far the data are from what $H_0$ predicts, in units of their expected noise.
3. The **p-value** is the probability, *if $H_0$ were true*, of getting a statistic at least as extreme as the one observed. If $p < \\alpha$, reject $H_0$.

What a p-value is **not**: the probability that $H_0$ is true, the probability that the result is a fluke, or a measure of how large or important the effect is. A trivial effect is highly significant in a huge sample; a large, real effect can miss significance in a small one — and $p > 0.05$ is not evidence of *no* effect. Report the **effect size** with its confidence interval. With $\\alpha = 0.05$, one test in twenty of a true null hypothesis comes out "significant" anyway, a **type I error**; missing a real effect is a **type II error**, whose probability is one minus the power ([[experimental-design]]).

### Comparing two means: the t-test
William Sealy Gosset, a chemist at the Guinness brewery in Dublin, published the t distribution in 1908 under the pen name "Student", to judge small samples of barley and hops. For two independent groups, **Welch's t-test** divides the difference in means by its standard error:

$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$$

For two groups of ten, $|t|$ above about 2.1 is significant at 5 %. When the same individuals are measured twice, before and after, a **paired t-test** on the differences is far more sensitive. A unit-free effect size is **Cohen's d**, the difference divided by the pooled SD: about 0.2 is small, 0.5 medium, 0.8 large.

### Counts in categories: chi-square
When the data are counts — seeds of each colour, woodlice in each zone, patients who recover or not — compare the observed counts $O$ with those expected under $H_0$, $E$:

$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$

The degrees of freedom are the number of categories minus one (for an $r \\times c$ table, $(r - 1)(c - 1)$), and the 5 % critical values are 3.84 for one degree of freedom, 5.99 for two and 7.81 for three. Every expected count should be at least about 5. Mendel's ratios are the classic case ([[chi-square-genetics]]).

### Choosing a test
| Question | Data | Common test |
|---|---|---|
| Do two groups differ? | measurements, roughly normal | t-test (Welch's; paired if matched) |
| Do three or more groups differ? | measurements | analysis of variance (ANOVA) |
| Do two groups differ? | skewed measurements, small samples | Mann–Whitney U (Wilcoxon for pairs) |
| Do counts fit a ratio, or are two factors associated? | counts in categories | chi-square; Fisher's exact test for small counts |
| Does one measurement change with another? | pairs of measurements | correlation and regression ([[math:linear-regression]]) |

> [!key] SD for the spread of individuals, SE and confidence intervals for the precision of a mean, p-values for how surprising the data would be with no effect — and always the effect size itself.
`,
  ideas: [
    'The standard deviation describes individuals; the standard error s/√n describes the precision of the mean.',
    'A 95 % confidence interval, x̄ ± t*·SE, is built so that 95 % of such intervals contain the true mean.',
    'A p-value is the probability of data at least this extreme if the null hypothesis were true — not the probability that it is true.',
    'The t-test compares two means in units of their standard error; chi-square compares observed and expected counts.',
    'Report effect sizes and confidence intervals, not just "significant" or "not significant".'
  ],
  pitfalls: [
    'p = 0.03 means a 3 % chance that the null hypothesis is true — It is the chance of such extreme data if the null hypothesis were true; the probability of the hypothesis itself needs more information, such as prior plausibility.',
    'Not significant means no effect — Small samples often miss real effects; look at the confidence interval, which may include large effects as well as zero.',
    'SE bars are just smaller SD bars — They answer different questions: SD shows variation among individuals, SE the uncertainty of the mean. Label which one you plot.'
  ],
  formulas: [
    {
      name: 'Standard error of the mean',
      expr: 'SE = s/sqrt(n)', tex: '\\mathrm{SE} = \\dfrac{s}{\\sqrt{n}}',
      vars: {
        SE: { name: 'standard error of the mean', q: 'length', unit: 'mm', tex: '\\mathrm{SE}' },
        s: { name: 'sample standard deviation', q: 'length', unit: 'mm', value: 5.83 },
        n: { name: 'sample size', q: 'count', value: 6, int: true }
      },
      note: 'Any unit works, as long as SE and s share it. Quadruple n to halve SE.',
      practice: { unknowns: ['SE', 'n'] },
      stories: { SE: 'Seedling heights have a standard deviation of {s} in a sample of {n}. What is the standard error of the mean?', n: 'With a standard deviation of {s}, how many individuals are needed for a standard error of {SE}?' }
    },
    {
      name: 'Half-width of a confidence interval',
      expr: 'h = tc*s/sqrt(n)', tex: 'h = t^{*}\\,\\dfrac{s}{\\sqrt{n}}',
      vars: {
        h: { name: 'half-width of the interval (mean ± h)', q: 'length', unit: 'mm' },
        tc: { name: 'critical t (95 %: 2.571 for n = 6, 2.262 for n = 10, about 1.96 for large n)', value: 2.571, tex: 't^{*}' },
        s: { name: 'sample standard deviation', q: 'length', unit: 'mm', value: 5.83 },
        n: { name: 'sample size', q: 'count', value: 6, int: true }
      },
      note: 'Take t* for n − 1 degrees of freedom; if you change n, change t* too.',
      practice: { unknowns: ['h', 's'] },
      stories: { h: 'A sample of {n} has a standard deviation of {s}; the critical t is {tc}. How wide is each side of the confidence interval?' }
    },
    {
      name: 'Welch\'s t statistic for two groups',
      expr: 't = (x1 - x2)/sqrt(s1^2/n1 + s2^2/n2)', tex: 't = \\dfrac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}',
      vars: {
        t: { name: 't statistic', signed: true },
        x1: { name: 'mean of group 1', q: 'length', unit: 'cm', value: 14.7, tex: '\\bar{x}_1' },
        x2: { name: 'mean of group 2', q: 'length', unit: 'cm', value: 12.4, tex: '\\bar{x}_2' },
        s1: { name: 'standard deviation of group 1', q: 'length', unit: 'cm', value: 2.5, tex: 's_1' },
        s2: { name: 'standard deviation of group 2', q: 'length', unit: 'cm', value: 2.1, tex: 's_2' },
        n1: { name: 'size of group 1', q: 'count', value: 10, int: true, tex: 'n_1' },
        n2: { name: 'size of group 2', q: 'count', value: 10, int: true, tex: 'n_2' }
      },
      note: 'Compare |t| with the t distribution; for groups of about ten, |t| > 2.1 means p < 0.05. Welch\'s version does not assume equal variances.',
      practice: { unknowns: ['t'] },
      stories: { t: 'Fertilised plants (n = {n1}) average {x1} with SD {s1}; controls (n = {n2}) average {x2} with SD {s2}. What is the t statistic?' }
    },
    {
      name: 'p-value of a chi-square with one degree of freedom',
      expr: 'p = 2*(1 - ncdf(sqrt(X2)))', tex: 'p = 2\\left[1 - \\Phi\\left(\\sqrt{\\chi^2}\\right)\\right]',
      vars: {
        p: { name: 'p-value', min: 0, max: 1 },
        X2: { name: 'chi-square statistic (1 degree of freedom)', value: 3.84, tex: '\\chi^2' }
      },
      note: 'Exact for one degree of freedom (two categories, or a 2 × 2 table), because such a χ² is the square of a standard normal variable. For more categories use a χ² table or the simulation below.',
      stories: { p: 'A cross gives a chi-square of {X2} with one degree of freedom. What is the p-value?', X2: 'What chi-square value (one degree of freedom) gives p = {p}?' }
    }
  ],
  examples: [
    {
      title: 'Six seedlings',
      q: 'Seedling heights (mm): 42, 51, 47, 39, 55, 48. Find the mean, SD, SE and 95 % confidence interval.',
      steps: [
        'Mean: $282/6 = 47.0$ mm.',
        'Deviations −5, 4, 0, −8, 8, 1; squares sum to 170. $s = \\sqrt{170/5} = \\sqrt{34} = 5.83$ mm.',
        '$\\mathrm{SE} = 5.83/\\sqrt{6} = 2.38$ mm.',
        '$t^{*}$ for 5 degrees of freedom is 2.571: $h = 2.571 \\times 2.38 = 6.1$ mm, so the interval is 40.9 to 53.1 mm.'
      ],
      a: 'Mean 47.0 mm, SD 5.8 mm, SE 2.4 mm, 95 % CI 40.9–53.1 mm.'
    },
    {
      title: 'Did the fertiliser work?',
      q: 'Ten fertilised plants average 14.7 cm (SD 2.5); ten controls average 12.4 cm (SD 2.1). Carry out Welch\'s t-test.',
      steps: [
        'SE of the difference: $\\sqrt{2.5^2/10 + 2.1^2/10} = \\sqrt{0.625 + 0.441} = 1.03$ cm.',
        '$t = (14.7 - 12.4)/1.03 = 2.23$, with about 17.5 degrees of freedom (Welch\'s formula).',
        'The two-sided p-value is 0.039 < 0.05: reject $H_0$. The difference is 2.3 cm, 95 % CI about 0.1 to 4.5 cm; Cohen\'s d ≈ 1.0, a large effect measured imprecisely.'
      ],
      a: 't = 2.23, p ≈ 0.04: significant at 5 %, with a wide confidence interval.'
    },
    {
      title: 'Woodlice in a choice chamber',
      q: 'Sixty woodlice settle in four zones: dry–light 8, dry–dark 12, damp–light 15, damp–dark 25. Test whether they choose at random.',
      steps: [
        '$H_0$: equal preference, so $E = 15$ in each zone.',
        '$\\chi^2 = (49 + 9 + 0 + 100)/15 = 10.53$ with $4 - 1 = 3$ degrees of freedom.',
        'The critical value is 7.81; the p-value is 0.015. Reject $H_0$: the woodlice are not choosing at random — most went to damp and dark.'
      ],
      a: 'χ² = 10.5, df = 3, p ≈ 0.015: a real preference.'
    }
  ],
  quiz: [
    { q: 'You measure more and more individuals. Which quantity gets steadily smaller?', choices: ['the standard deviation', 'the standard error of the mean', 'the mean', 'the range'], a: 1, why: 'SE = s/√n shrinks as n grows; the SD settles at the population\'s true spread.' },
    { q: 'p = 0.03 means there is a 3 % chance that the null hypothesis is true.', a: false, why: 'It is the probability of data at least this extreme *assuming* the null hypothesis is true.' },
    { q: 'A sample of 36 has SD 12. What is the standard error of the mean?', answer: 2, why: '$12/\\sqrt{36} = 2$.' },
    { q: 'To halve the standard error, multiply the sample size by…', choices: ['2', '4', '√2', '8'], a: 1, why: 'SE ∝ 1/√n.' },
    { q: 'A coin lands heads 60 times in 100. What is χ² against a fair coin?', answer: 4, why: '$(60 - 50)^2/50 + (40 - 50)^2/50 = 2 + 2 = 4$ — above 3.84, so p < 0.05 (p = 0.046).' }
  ],
  problems: [
    { q: 'Ten measurements have mean 23.5 and SD 4.0. What is the half-width of the 95 % confidence interval (t* = 2.262)?', answer: 2.86, tol: 0.02, steps: ['$\\mathrm{SE} = 4.0/\\sqrt{10} = 1.265$.', '$h = 2.262 \\times 1.265 = 2.86$, so the interval is 20.6 to 26.4.'] },
    { q: 'Mendel counted 5 474 round and 1 850 wrinkled seeds. What is χ² for a 3 : 1 ratio?', answer: 0.263, tol: 0.03, steps: ['Total 7 324; expected 5 493 and 1 831.', '$\\chi^2 = 19^2/5493 + 19^2/1831 = 0.066 + 0.197 = 0.263$ — p ≈ 0.61, an excellent fit.'] }
  ],
  applications: [
    'Every published experiment in biology and medicine reports means with SDs or SEs, confidence intervals and tests.',
    'Clinical trials decide whether a treatment works using pre-specified tests and sample sizes ([[medicine:evidence-based-medicine]]).',
    'Genetics: chi-square tests of Mendelian ratios and of Hardy–Weinberg proportions.',
    'Genomics tests thousands of genes at once and must control false discoveries.'
  ],
  history: 'Karl Pearson introduced the chi-square test in 1900. Gosset ("Student") published the t distribution in 1908 because Guinness wanted reliable decisions from small samples. Ronald Fisher popularised p-values and the 5 % level in the 1920s — as a rough guide, not a rule. In 2016 the American Statistical Association issued a statement warning against treating p < 0.05 as proof.',
  sim: ['div-sampling', 'div-ttest', 'div-chisq']
},

{
  id: 'lab-math', parent: 'methods-topic', title: 'Laboratory calculations', level: 1,
  short: 'The arithmetic of the bench: moles, molarity and the mass to weigh out, per cent solutions, dilutions with C₁V₁ = C₂V₂, serial dilutions and plate counts, and absorbance with the Beer–Lambert law and standard curves.',
  keywords: ['molarity', 'concentration', 'dilution', 'C1V1 = C2V2', 'serial dilution', 'dilution factor', 'stock solution', 'per cent solution', 'w/v', 'plate count', 'CFU', 'colony-forming unit', 'absorbance', 'transmittance', 'Beer–Lambert', 'molar absorptivity', 'standard curve', 'spectrophotometer', 'A260', 'NADH'],
  prereq: ['chemistry:mole-concept', 'chemistry:molarity', 'chemistry:dilution'],
  related: ['chemistry:beer-lambert', 'chemistry:concentration-units', 'bacterial-growth', 'aseptic-technique', 'pcr', 'gel-electrophoresis', 'enzyme-kinetics', 'statistics-bio', 'math:logarithms'],
  body: `
Most mistakes at the bench are arithmetic, not technique: a factor of a thousand lost between millimolar and micromolar, a dilution factor applied twice. A few relations cover nearly everything, and they are worth doing slowly with the units written in.

### Units and amounts
| Prefix | Concentration | Volume | Mass | Amount |
|---|---|---|---|---|
| — | M (mol/L) | L | g | mol |
| milli, 10⁻³ | mM | mL | mg | mmol |
| micro, 10⁻⁶ | µM | µL | µg | µmol |
| nano, 10⁻⁹ | nM | nL | ng | nmol |

Useful equivalences: 1 µM is 1 nmol per mL, which is 1 pmol per µL; 1 µL of a 1 µM solution holds 1 pmol, about $6\\times10^{11}$ molecules ([[chemistry:mole-concept]]).

### Making a solution
The mass to weigh out is concentration × volume × molar mass:

$$m = c\\,V\\,M$$

For 500 mL of 0.15 M NaCl ($M = 58.44$ g/mol): $0.15 \\times 0.500 \\times 58.44 = 4.38$ g. Dissolve it in less than the final volume, then make up to the mark ([[chemistry:molarity]]).

**Per cent solutions** are common in biology: **w/v** means grams per 100 mL (1 % agarose is 1 g in 100 mL; 0.9 % saline is 9 g/L of NaCl, or 154 mM), **v/v** millilitres per 100 mL (70 % ethanol), **w/w** grams per 100 g. Many buffers are kept as concentrated **stocks** — 10× PBS, 50× TAE — and diluted to "1×" for use.

### Dilutions
Diluting changes the volume but not the amount of solute, so

$$C_1 V_1 = C_2 V_2$$

To make 100 mL of 1× buffer from a 10× stock: $V_1 = 1 \\times 100/10 = 10$ mL of stock plus 90 mL of water. The **dilution factor** is the final volume divided by the volume of sample, 10 here. Beware "1 : 10": most biologists mean one part in ten in total (tenfold), some mean one part plus ten parts (elevenfold) — say which ([[chemistry:dilution]]).

### Serial dilutions and plate counts
To dilute a million-fold accurately, nobody pipettes 1 µL into a litre. Instead, dilute tenfold six times: 0.1 mL into 0.9 mL, mix, then 0.1 mL of that into the next 0.9 mL, and so on. After $n$ steps of factor $D$ the concentration is $C_0/D^{n}$.

Serial dilutions are how microbiologists count live cells. A known volume from several dilutions is spread on agar and incubated; each colony grows from one **colony-forming unit** (CFU), a single cell or a clump. Only plates with 30–300 colonies are counted: fewer are statistically unreliable, more crowd and merge. Then

$$\\text{CFU per mL} = \\frac{\\text{colonies}}{\\text{dilution} \\times \\text{volume plated}}$$

so 156 colonies from 0.1 mL of the $10^{-6}$ dilution mean $156/(10^{-6} \\times 0.1\\ \\mathrm{mL}) = 1.56\\times10^{9}$ CFU per mL in the original culture — try it with the tubes below. Plate counts in teaching laboratories use harmless organisms and the aseptic technique of [[aseptic-technique]].

### Absorbance and the Beer–Lambert law
A spectrophotometer shines light of one wavelength through a cuvette and measures the fraction transmitted, $T = I/I_0$. The **absorbance** $A = \\log_{10}(I_0/I)$ is proportional to concentration — the **Beer–Lambert law** ([[chemistry:beer-lambert]]):

$$A = \\varepsilon\\, l\\, c$$

where $\\varepsilon$ is the molar absorptivity of the substance at that wavelength and $l$ the path length, usually 1 cm. An absorbance of 1 lets 10 % of the light through, an absorbance of 2 only 1 %. Two classics: NADH absorbs at 340 nm with $\\varepsilon = 6\\,220\\ \\mathrm{L\\,mol^{-1}\\,cm^{-1}}$, which is how countless enzyme assays are followed ([[enzyme-kinetics]]); and double-stranded DNA with $A_{260} = 1$ contains about 50 µg/mL (RNA about 40 µg/mL), with $A_{260}/A_{280} \\approx 1.8$ for pure DNA.

### Standard curves
When $\\varepsilon$ is unknown — protein assays such as Bradford or BCA, or a coloured reaction product — measure **standards** of known concentration, fit a straight line of absorbance against concentration, and read the unknowns off it. The rules: include a blank; keep unknowns *within* the range of the standards (interpolate, never extrapolate); dilute samples that read too high and multiply back; and stay in the linear range — often up to an absorbance of about 1–1.5, beyond which stray light bends the line.

> [!tip] Write every quantity with its unit and cancel units as you go. If the answer comes out in "mM·mL/µL", you have not finished — and a mistake of 1 000 will show itself.
`,
  ideas: [
    'Mass to weigh = concentration × volume × molar mass (m = cVM).',
    'Diluting conserves the amount of solute: C₁V₁ = C₂V₂.',
    'After n serial dilutions of factor D the concentration is C₀/Dⁿ; plate counts use plates with 30–300 colonies.',
    'CFU per mL = colonies ÷ (dilution × volume plated).',
    'Absorbance A = εlc; standard curves turn absorbance into concentration within their linear range.'
  ],
  pitfalls: [
    'A "1 : 10 dilution" always means the same thing — It usually means 1 part in 10 total, but sometimes 1 part plus 10 parts; state the volumes.',
    'Transmittance is proportional to concentration — Absorbance is; transmittance falls exponentially (10 % at A = 1, 1 % at A = 2).',
    'A standard curve can be extended beyond its highest standard — Above the linear range the response bends; dilute the sample into range instead.'
  ],
  formulas: [
    {
      name: 'Mass to weigh for a solution',
      expr: 'm = c*V*M', tex: 'm = c\\,V\\,M',
      vars: {
        m: { name: 'mass of solute', q: 'mass', unit: 'g' },
        c: { name: 'concentration wanted', q: 'concentration', unit: 'M', value: 0.15 },
        V: { name: 'final volume', q: 'volume', unit: 'mL', value: 500 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 58.44 }
      },
      practice: { unknowns: ['m', 'c', 'V'] },
      stories: { m: 'How much NaCl (M = {M}) is needed for {V} of a {c} solution?', c: '{m} of a salt with M = {M} is dissolved to {V}. What is the concentration?', V: 'You have {m} of a compound with M = {M}. What volume of {c} solution can you make?' }
    },
    {
      name: 'Dilution',
      expr: 'C1*V1 = C2*V2', tex: 'C_1 V_1 = C_2 V_2',
      vars: {
        C1: { name: 'stock concentration', q: 'concentration', unit: 'mM', value: 10, tex: 'C_1' },
        V1: { name: 'volume of stock', q: 'volume', unit: 'mL', tex: 'V_1' },
        C2: { name: 'final concentration', q: 'concentration', unit: 'mM', value: 1, tex: 'C_2' },
        V2: { name: 'final volume', q: 'volume', unit: 'mL', value: 100, tex: 'V_2' }
      },
      solveFor: 'V1',
      note: 'Works for any concentration unit (molar, mg/mL, "×" of a stock, cells per mL) as long as C₁ and C₂ share it. The diluent volume is V₂ − V₁.',
      stories: { V1: 'How much of a {C1} stock do you need to make {V2} of {C2}?', C2: '{V1} of a {C1} stock is made up to {V2}. What is the new concentration?', V2: 'To what final volume should {V1} of a {C1} stock be diluted to give {C2}?' }
    },
    {
      name: 'Serial dilution',
      expr: 'C = C0/D^n', tex: 'C_n = \\dfrac{C_0}{D^{n}}',
      vars: {
        C: { name: 'concentration after n steps', q: 'numberdensity', unit: '1/mL', tex: 'C_n' },
        C0: { name: 'starting concentration', q: 'numberdensity', unit: '1/mL', value: 1e9, tex: 'C_0' },
        D: { name: 'dilution factor per step', value: 10, min: 1.01 },
        n: { name: 'number of steps', q: 'count', value: 6, int: true }
      },
      note: 'For a tenfold step, transfer 1 part into 9 parts of diluent (e.g. 0.1 mL into 0.9 mL).',
      practice: { unknowns: ['C', 'n'] },
      stories: { C: 'A culture of {C0} is diluted {D}-fold {n} times. What is the concentration in the last tube?', n: 'How many {D}-fold steps bring {C0} down to {C}?' }
    },
    {
      name: 'Viable count from a plate',
      expr: 'N = k/(f*V)', tex: 'N = \\dfrac{k}{f\\,V}',
      vars: {
        N: { name: 'colony-forming units per mL of the original', q: 'numberdensity', unit: '1/mL' },
        k: { name: 'colonies counted', q: 'count', value: 156, int: true },
        f: { name: 'dilution of the plated tube (e.g. 10⁻⁶)', value: 1e-6 },
        V: { name: 'volume spread on the plate', q: 'volume', unit: 'mL', value: 0.1 }
      },
      note: 'Count plates with 30–300 colonies. The same as kit.bio.cfu in the simulations.',
      practice: { unknowns: ['N', 'k'] },
      stories: { N: '{k} colonies grow from {V} of a tube diluted by a factor {f}. What was the concentration in the original culture?', k: 'A culture holds {N}. How many colonies do you expect from {V} of the {f} dilution?' }
    },
    {
      name: 'Beer–Lambert law',
      expr: 'A = eps*l*c', tex: 'A = \\varepsilon\\, l\\, c',
      vars: {
        A: { name: 'absorbance' },
        eps: { name: 'molar absorptivity', q: 'molarabs', unit: 'L/(mol·cm)', value: 6220, tex: '\\varepsilon' },
        l: { name: 'path length', q: 'length', unit: 'cm', value: 1 },
        c: { name: 'concentration', q: 'concentration', unit: 'µM', value: 100 }
      },
      note: 'NADH at 340 nm: ε = 6 220 L mol⁻¹ cm⁻¹; p-nitrophenol at 405 nm (alkaline): about 18 000. Linear up to an absorbance of roughly 1–1.5 on most instruments.',
      practice: { unknowns: ['A', 'c', 'eps'] },
      stories: { A: 'What is the absorbance of {c} NADH (ε = {eps}) in a {l} cuvette?', c: 'An NADH solution (ε = {eps}) reads A = {A} in a {l} cuvette. What is its concentration?', eps: 'A {c} solution in a {l} cuvette has absorbance {A}. What is its molar absorptivity?' }
    }
  ],
  examples: [
    {
      title: 'A Tris buffer',
      q: 'How much Tris base (M = 121.14 g/mol) is needed for 250 mL of 50 mM Tris?',
      steps: [
        'Convert: 50 mM = 0.050 mol/L; 250 mL = 0.250 L.',
        '$m = 0.050 \\times 0.250 \\times 121.14 = 1.51$ g.',
        'Dissolve in about 200 mL, adjust the pH, then make up to 250 mL.'
      ],
      a: '1.51 g.'
    },
    {
      title: 'Counting yeast in a culture',
      q: 'A yeast culture is diluted tenfold seven times (0.1 mL into 0.9 mL each time), and 0.1 mL of the 10⁻⁵, 10⁻⁶ and 10⁻⁷ tubes is spread on plates. They grow too many to count, 156 and 14 colonies. Estimate the concentration of the culture.',
      steps: [
        'Only the 10⁻⁶ plate falls within 30–300 colonies; 14 is too few to trust and the first plate is uncountable.',
        '$N = 156/(10^{-6} \\times 0.1\\ \\mathrm{mL}) = 1.56\\times10^{9}$ CFU/mL.',
        'Check: the 10⁻⁷ plate should then show about 16 colonies — it shows 14, consistent.'
      ],
      a: 'About 1.6 × 10⁹ CFU/mL.'
    },
    {
      title: 'Reading a standard curve',
      q: 'p-Nitrophenol standards give a line $A = 0.0181\\,c + 0.004$ (c in µM, 405 nm, 1 cm). A sample diluted fivefold reads A = 0.720. What is the concentration in the original sample?',
      steps: [
        'In the cuvette: $c = (0.720 - 0.004)/0.0181 = 39.6$ µM — inside the range of the standards.',
        'Undo the dilution: $39.6 \\times 5 = 198$ µM.',
        'The slope, 0.0181 per µM, is $\\varepsilon l$: $\\varepsilon = 18\\,100\\ \\mathrm{L\\,mol^{-1}cm^{-1}}$, close to the textbook value.'
      ],
      a: 'About 198 µM.'
    }
  ],
  quiz: [
    { q: 'How many grams of NaCl (58.44 g/mol) make 1 L of 0.5 M solution?', answer: 29.2, unit: 'g', why: '$0.5 \\times 1 \\times 58.44 = 29.2$ g.' },
    { q: 'You need 50 mL of 0.5 mM from a 20 mM stock. How much stock (mL)?', answer: 1.25, unit: 'mL', why: '$V_1 = 0.5 \\times 50/20 = 1.25$ mL, made up to 50 mL.' },
    { q: 'Three successive tenfold dilutions give a total dilution of…', choices: ['30-fold', '100-fold', '1 000-fold', '10 000-fold'], a: 2, why: 'Dilution factors multiply: 10 × 10 × 10 = 1 000.' },
    { q: 'A solution has an absorbance of 2. What percentage of the light passes through?', answer: 1, unit: '%', why: '$T = 10^{-A} = 10^{-2} = 1$ %.' },
    { q: 'An unknown reads twice as high as your top standard, but the line is straight, so you can extend it.', a: false, why: 'You have no evidence the response stays linear beyond the standards; dilute the sample into range and multiply back.' }
  ],
  problems: [
    { q: 'A DNA sample diluted 1 in 20 reads A₂₆₀ = 0.35. What is the DNA concentration of the original (µg/mL), taking A₂₆₀ = 1 as 50 µg/mL?', answer: 350, unit: 'µg/mL', tol: 0.02, steps: ['In the cuvette: $0.35 \\times 50 = 17.5$ µg/mL.', 'Original: $17.5 \\times 20 = 350$ µg/mL.'] },
    { q: 'An NADH solution reads A₃₄₀ = 0.311 in a 1 cm cuvette. What is its concentration in µM (ε = 6 220 L mol⁻¹ cm⁻¹)?', answer: 50, unit: 'µM', tol: 0.02, steps: ['$c = A/(\\varepsilon l) = 0.311/6220 = 5.0\\times10^{-5}$ M = 50 µM.'] }
  ],
  applications: [
    'Preparing buffers, media and reagents for every biology experiment.',
    'Counting bacteria and yeast in food, water and fermentation quality control by plate counts.',
    'Measuring DNA, RNA and protein concentrations before PCR, sequencing or electrophoresis.',
    'Following enzyme reactions by the absorbance of NADH or of a coloured product.'
  ],
  history: 'August Beer (1852) and, earlier, Pierre Bouguer (1729) and Johann Lambert (1760) worked out how light is absorbed by solutions and by thickness. Robert Koch\'s laboratory introduced solid media in the 1880s — agar, suggested by Fanny Hesse from her kitchen, and the dishes of Julius Petri (1887) — making colony counts possible.',
  sim: ['div-dilution', 'div-standard']
},

{
  id: 'model-organisms', parent: 'methods-topic', title: 'Model organisms', level: 1,
  short: 'A few convenient species — a bacterium, a yeast, a worm, a fly, a weed, a fish and a mouse — taught us most of what we know about genes, cells and development, because life shares its machinery. Their generation times, genomes and the discoveries they made, and the 3Rs that govern animal research.',
  keywords: ['model organisms', 'E. coli', 'yeast', 'Saccharomyces cerevisiae', 'C. elegans', 'Drosophila', 'fruit fly', 'Arabidopsis', 'zebrafish', 'mouse', 'knockout mouse', 'generation time', 'genome size', 'gene density', '3Rs', 'animal research', 'replacement', 'reduction', 'refinement'],
  prereq: ['scientific-method-bio', 'genomics', 'taxonomy'],
  related: ['experimental-design', 'lac-operon', 'cell-cycle', 'apoptosis', 'noncoding-rna', 'sex-linkage', 'linkage-mapping', 'animal-development', 'crispr', 'fungi', 'invertebrates'],
  body: `
Most of what we know about how genes, cells and bodies work was learned from a handful of species. They were chosen not because they are typical, but because they are convenient: small, cheap, quick to breed, easy to keep and — above all — open to genetics. Because all life shares its ancestry, what is true of them is astonishingly often true of us: about three quarters of the genes known to cause human disease have a recognisable counterpart in the fruit fly, and about 70 % of human genes have one in the zebrafish.

### The standard set
| Organism | What it is | Generation time | Genome (Mb) | Protein-coding genes | Famous for |
|---|---|---|---|---|---|
| *Escherichia coli* K-12 | gut bacterium | 20 min | 4.6 | 4 300 | genetic code, gene regulation, DNA replication, recombinant DNA |
| *Saccharomyces cerevisiae* | budding yeast | 90 min | 12 | 6 000 | cell cycle, secretion, autophagy; first eukaryotic genome (1996) |
| *Caenorhabditis elegans* | nematode, 1 mm | 3–4 days | 100 | 20 000 | every cell's lineage, programmed cell death, RNA interference |
| *Drosophila melanogaster* | fruit fly | 10 days | 140 | 14 000 | chromosomes and linkage, *Hox* genes, body plan, circadian clock |
| *Arabidopsis thaliana* | thale cress | 6–8 weeks | 135 | 27 000 | flower development, plant hormones; first plant genome (2000) |
| *Danio rerio* | zebrafish | 3 months | 1 400 | 26 000 | transparent embryos, organ formation, regeneration |
| *Mus musculus* | house mouse | 9–10 weeks | 2 700 | 20 000 | mammalian genetics, immunology, cancer; knockout mice |
| *Homo sapiens* (for comparison) | — | about 25 years | 3 100 | 20 000 | — |

Genome sizes are in megabases (millions of base pairs); generation times are typical laboratory values.

### What each one taught us
- **Bacteria and their viruses** laid the foundations of molecular biology: the genetic code, the regulation of the *lac* operon (Jacob and Monod, 1961; [[lac-operon]]), semi-conservative replication, and in 1973 the first recombinant DNA.
- **Yeast**, a eukaryote that grows like a bacterium, revealed the genes that drive the cell cycle ([[cell-cycle]]) — Leland Hartwell's mutants in budding yeast and Paul Nurse's in fission yeast (Nobel Prize 2001) — and the machinery of secretion (2013) and autophagy (2016).
- **The worm**: Sydney Brenner chose *C. elegans* in the 1960s for its transparency and fixed body plan: an adult hermaphrodite has exactly 959 somatic cells, and John Sulston traced the division that makes each one. The genes for programmed cell death were found in it ([[apoptosis]]; Nobel 2002), then RNA interference (Fire and Mello, 1998) and the first microRNA ([[noncoding-rna]]). Its 302 neurons were the first nervous system to be mapped completely.
- **The fly**: Thomas Hunt Morgan's white-eyed male of 1910 tied a gene to the X chromosome ([[sex-linkage]]), and his student Alfred Sturtevant drew the first genetic map in 1913 ([[linkage-mapping]]). Screens for mutants that scramble the larval body plan (Christiane Nüsslein-Volhard and Eric Wieschaus, 1980) and the study of *Hox* genes (Edward Lewis) won the 1995 Nobel Prize; the fly also gave us the genes of the circadian clock (2017) and the Toll receptors of innate immunity (2011).
- **Arabidopsis**, a weed with a small genome and a six-week life cycle, showed how three classes of genes specify sepals, petals, stamens and carpels (the ABC model, 1991).
- **Zebrafish** embryos develop outside the mother and are transparent, so a heart can be watched beating a day after fertilisation.
- **The mouse** is a mammal with a short generation and inbred strains, and it received the first targeted gene knockouts (Mario Capecchi, Martin Evans and Oliver Smithies; Nobel 2007).

### Limits
A model is a stand-in, not a small human. Mice differ from us in metabolism, immunity and lifespan, and the great majority of drug candidates that look promising in animal models fail in human trials. Findings are most trustworthy when they hold across several species, and when experiments use both sexes, randomisation and blinding ([[experimental-design]]).

### Using animals responsibly
Research on vertebrates — and in many countries on cephalopods such as octopuses — is licensed and overseen by ethics committees under national law, for example the EU Directive 2010/63/EU and the UK Animals (Scientific Procedures) Act 1986. It follows the **3Rs**: **Replace** animals wherever another method can answer the question — cell cultures, organoids, computer models, or microbes and invertebrates; **Reduce** the number used to the minimum needed, through good design and power calculations; **Refine** procedures, housing and care to minimise pain and distress. Much of the value of *E. coli*, yeast, worms and flies is that they can replace vertebrates in the early stages of a question.
`,
  ideas: [
    'Model organisms are chosen for convenience — short generations, small size, easy genetics — and work because life shares its machinery.',
    'E. coli, yeast, C. elegans, Drosophila, Arabidopsis, zebrafish and the mouse each opened a field: gene regulation, the cell cycle, cell death and RNAi, the body plan, flower development, organ formation, mammalian genetics.',
    'Short generation times let geneticists follow many generations quickly: a fly lab covers in a year what would take humans about 900 years.',
    'Results from models must be checked across species; many animal findings fail to translate to humans.',
    'Animal research follows the 3Rs — replace, reduce, refine — under ethical review and law.'
  ],
  pitfalls: [
    'What works in mice will work in people — Most drug candidates that succeed in animal models fail in human trials; models suggest, humans must be tested.',
    'Model organisms are studied because they are like humans — They are studied because they are convenient; their usefulness comes from shared ancestry, and their differences must be kept in mind.',
    'Bigger genomes mean more complex organisms — Genome size depends largely on non-coding DNA; an onion\'s genome is about five times larger than ours, while gene numbers of worms and humans are similar.'
  ],
  formulas: [
    {
      name: 'Generations in a given time',
      expr: 'n = t/g', tex: 'n = \\dfrac{t}{g}',
      vars: {
        n: { name: 'number of generations' },
        t: { name: 'time available', q: 'time', unit: 'yr', value: 1 },
        g: { name: 'generation time', q: 'time', unit: 'day', value: 10 }
      },
      stories: { n: 'An organism has a generation time of {g}. How many generations fit into {t}?', g: 'A lab wants {n} generations in {t}. What generation time does it need?' }
    },
    {
      name: 'Genome length per gene',
      expr: 'b = L/G', tex: 'b = \\dfrac{L}{G}',
      vars: {
        b: { name: 'base pairs per protein-coding gene' },
        L: { name: 'genome size (base pairs)', value: 4.6e6 },
        G: { name: 'number of protein-coding genes', q: 'count', value: 4300, int: true }
      },
      note: 'Bacteria pack about one gene per kilobase; the human genome has one per 150 kb, most of the rest being introns, regulatory and repetitive DNA.',
      stories: { b: 'A genome of {L} base pairs carries {G} protein-coding genes. How many base pairs is that per gene?' }
    }
  ],
  examples: [
    {
      title: 'A year in the lab',
      q: 'How many generations fit into one year for *E. coli* (20 min), *Drosophila* (10 days), the mouse (10 weeks) and humans (25 years)?',
      steps: [
        '*E. coli*: $525\\,960\\ \\mathrm{min}/20\\ \\mathrm{min} \\approx 26\\,000$ (in continuous culture).',
        '*Drosophila*: $365/10 \\approx 37$. Mouse: $52/10 \\approx 5$. Humans: $1/25 = 0.04$.',
        'Thirty-seven fly generations would take humans about $37 \\times 25 \\approx 900$ years — why Morgan could do genetics in a room of milk bottles.'
      ],
      a: 'About 26 000, 37, 5 and 0.04 generations.'
    },
    {
      title: 'How densely are genes packed?',
      q: 'Compare base pairs per gene for *E. coli* (4.6 Mb, 4 300 genes) and humans (3 100 Mb, 20 000 genes).',
      steps: [
        '*E. coli*: $4.6\\times10^{6}/4\\,300 = 1\\,070$ bp per gene — about 88 % of its DNA codes for protein.',
        'Human: $3.1\\times10^{9}/20\\,000 = 155\\,000$ bp per gene — only about 1.5 % of our DNA codes for protein.',
        'The difference is introns, regulatory regions and repeated sequences ([[genomics]]).'
      ],
      a: 'About 1 kb per gene in *E. coli* against 155 kb in humans.'
    }
  ],
  quiz: [
    { q: 'Why was *C. elegans* chosen to trace the origin of every cell?', choices: ['it is a mammal', 'it is transparent and has a fixed, small number of cells', 'it has no genes', 'it lives for years'], a: 1, why: 'Cells can be watched dividing through its transparent body, and every adult hermaphrodite has the same 959 somatic cells.' },
    { q: 'Mutants of which organism revealed the genes that drive the eukaryotic cell cycle?', choices: ['*E. coli*', 'yeast', 'zebrafish', '*Arabidopsis*'], a: 1, why: 'Hartwell\'s *cdc* mutants in budding yeast and Nurse\'s in fission yeast; the genes turned out to work the same way in human cells.' },
    { q: 'The 3Rs of animal research stand for…', choices: ['Record, Report, Repeat', 'Replace, Reduce, Refine', 'Randomise, Replicate, Review', 'Rest, Recover, Release'], a: 1, why: 'Russell and Burch (1959): replace animals where possible, reduce their number, refine procedures to minimise suffering.' },
    { q: 'How many generations per year does a fly with a 12-day generation time give?', answer: 30.4, why: '$365.25/12 = 30.4$.' },
    { q: 'A drug that cures a disease in mice will almost certainly work in people.', a: false, why: 'The great majority of candidates that work in animal models fail in human trials, because of differences in biology and in how the disease is modelled.' }
  ],
  applications: [
    'Drug discovery: screens in yeast, worms, flies and zebrafish before mammalian studies.',
    'Genetic engineering: *E. coli* and yeast make insulin, vaccines and enzymes.',
    'Human genetics: mice and zebrafish carrying patient mutations test whether a variant causes disease.',
    'Crop science: genes found in *Arabidopsis* guide the breeding of wheat, rice and maize.'
  ],
  history: 'Morgan\'s "fly room" at Columbia (from 1908) made *Drosophila* the first great genetic model. Phage and *E. coli* genetics in the 1940s–60s founded molecular biology. Brenner proposed the worm in 1963, and genome sequences followed quickly: *E. coli* 1997, yeast 1996, *C. elegans* 1998, *Drosophila* 2000, *Arabidopsis* 2000, mouse 2002, zebrafish 2013.'
}

);
