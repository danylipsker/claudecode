/* HYPER-BIOLOGY · content/evolution.js
 *
 * The Evolution branch: how evolution works (evidence-evolution, natural-selection, hardy-weinberg,
 * genetic-drift, gene-flow-mutation, sexual-selection, coevolution) and species and the history of
 * life (speciation, phylogenetics, molecular-clock, life-history-earth, human-evolution).
 * Simulations are in sims/evolution.js (ids evo-…); the drift reference sim ref-drift is linked, not repeated.
 */
Hyper.add(

/* ================================================================ HOW EVOLUTION WORKS */
{
  id: 'evidence-evolution', parent: 'evolution-mechanisms', title: 'The evidence for evolution', level: 1,
  short: 'All living things descend, with modification, from common ancestors. Independent lines of evidence agree on it: fossils in the right order, shared anatomy and embryos, the geography of species, the DNA of every organism — and evolution observed as it happens.',
  keywords: ['evidence for evolution', 'common descent', 'fossil record', 'transitional fossil', 'Tiktaalik', 'Archaeopteryx', 'whale evolution', 'homology', 'homologous structures', 'vestigial structures', 'embryology', 'biogeography', 'pseudogene', 'endogenous retrovirus', 'cytochrome c', 'chromosome 2 fusion'],
  prereq: ['taxonomy', 'dna-structure', 'mutations'],
  related: ['natural-selection', 'phylogenetics', 'molecular-clock', 'life-history-earth', 'human-evolution', 'animal-development', 'antibiotic-resistance', 'physics:radioactive-decay'],
  body: `
Evolution means that living things are related: every species descends, with modification, from earlier species, and all of life traces back to common ancestors more than three and a half billion years ago. Charles Darwin laid out the case in *On the Origin of Species* in 1859. What makes it one of the best-established ideas in science is not any single observation but **consilience** — fossils, anatomy, embryos, geography and DNA were studied by different people with different methods, and they point to the same family tree.

### Fossils in the right order
Sedimentary rocks are laid down in layers, and radioactive decay dates them (see [[life-history-earth]]). The fossils fall in a consistent order: bacteria for billions of years before any animal, fish before amphibians, reptiles before mammals and birds. A single rabbit in 600-million-year-old rock would be a serious problem; none has ever turned up. The record also holds many **transitional forms** that mix the features of older and younger groups:

| Transition | Fossils (million years ago) |
|---|---|
| Fish to land animals | *Eusthenopteron* (385), *Tiktaalik* (375), *Acanthostega* (365) |
| Dinosaurs to birds | feathered dinosaurs from China, *Archaeopteryx* (150) |
| Land mammals to whales | *Pakicetus* (50), *Ambulocetus* (49), *Rodhocetus* (47), *Basilosaurus* (40), which still had tiny hind legs |
| Reptile jaw to mammal ear | cynodonts in which two jaw bones shrink into the hammer and anvil of the middle ear |

*Tiktaalik* was a prediction come true. Lobe-finned fish were known from 385 million years ago and four-legged animals from 365, so Neil Shubin and colleagues searched river-deposited rocks of about 375 million years in the Canadian Arctic — and in 2004 found a fish with a neck, sturdy fin bones like a wrist, and lungs as well as gills.

### Anatomy and embryos
The arm of a human, the wing of a bat, the flipper of a whale and the leg of a horse do different jobs with the same set of bones: one upper bone, two lower bones, wrist bones and five digits. Such **homologous** structures make sense as inherited from a common ancestor and modified, not as separate designs. Evolution also leaves leftovers: the pelvis of a whale, the wings of flightless birds, and the nerve to the larynx, which detours down into the chest and back — several metres in a giraffe — because it followed the heart as the neck lengthened. All vertebrate embryos pass through a stage with pharyngeal arches; in fish they become gills, in us parts of the jaw, the middle ear and the throat. A human embryo of five weeks has a tail. (Ernst Haeckel's famous drawings exaggerated the likeness, but the real similarities hold.)

### Geography
Islands hold species related to those of the nearest mainland: the Galápagos animals resemble South American ones, the Cape Verde species African ones. Australia's mammals are mostly marsupials, because the continent was isolated early. Alfred Russel Wallace mapped a sharp line through Indonesia with Asian animals on one side and Australian ones on the other.

### DNA
All life uses the same genetic code and the same core machinery, and the similarity of sequences follows the tree. Cytochrome c, a protein of 104 amino acids, differs from the human one at 0 sites in the chimpanzee, 1 in the rhesus monkey, 12 in the horse, 13 in the chicken, 21 in the tuna and about 45 in baker's yeast. Shared *mistakes* are the most telling: humans and other monkeys and apes carry the same broken gene for making vitamin C, with the same disabling mutations, and share thousands of viral insertions (endogenous retroviruses, about 8 % of our genome) at exactly the same places. Our chromosome 2 is two ape chromosomes fused end to end — which is why we have 46 chromosomes and the other great apes 48 — and still carries the telomere sequences in its middle.

### Evolution observed
Bacteria evolve resistance to antibiotics within years ([[antibiotic-resistance]]). In Richard Lenski's experiment, twelve populations of *E. coli* have evolved since 1988 for more than 75 000 generations, and one gained the ability to feed on citrate. Lizards moved to a small Croatian island in 1971 had, 36 years later, larger heads, a plant diet and new valves in their guts.

> [!key] Fossils, anatomy, embryos, geography and DNA were gathered independently, and they agree on the same tree of relationships. That agreement is what a theory of common descent predicts and what no alternative explains.

> [!note] In science a **theory** is not a guess but a well-tested explanation of many facts — like the atomic theory or the germ theory of disease. That living things have evolved is as well established as that the Earth goes round the Sun; biologists study *how* it happens (see [[natural-selection]] and [[genetic-drift]]).
`,
  ideas: [
    'Evolution is descent with modification: species are related through common ancestors.',
    'Fossils appear in a consistent order, and transitional forms such as Tiktaalik were predicted before they were found.',
    'Homologous structures, vestigial organs and embryonic features are inherited leftovers of common ancestry.',
    'DNA and protein sequences give the same tree as anatomy; shared mutations and viral insertions are especially convincing.',
    'Evolution is observed directly in bacteria, viruses, insects and wild populations.'
  ],
  pitfalls: [
    'Evolution is "only a theory" — In science a theory is a thoroughly tested explanation, not a hunch; common descent is supported by every independent line of evidence.',
    'There are no transitional fossils — Many are known (fish to tetrapods, dinosaurs to birds, land mammals to whales). Each new find fills a gap in a sequence that is already well ordered.',
    'Humans evolved from chimpanzees — Humans and chimpanzees share a common ancestor about 6–7 million years ago; both lineages have evolved for the same length of time since.'
  ],
  examples: [
    {
      title: 'Predicting where to find Tiktaalik',
      q: 'Lobe-finned fish with limb-like fin bones are known from rocks about 385 million years old, and the earliest four-legged animals from about 365 million. Where and in rocks of what age would you look for an animal halfway between?',
      steps: [
        'If tetrapods evolved from lobe-finned fish, the intermediates lived between the two: about 370–380 million years ago.',
        'Both groups lived in shallow fresh water, so look for rocks laid down by rivers and deltas, not in the deep sea.',
        'Rocks of that age and type are exposed on Ellesmere Island in the Canadian Arctic. After four field seasons the team found *Tiktaalik* there in 2004, in rocks about 375 million years old.'
      ],
      a: 'In river-deposited rocks about 375 million years old — exactly where Tiktaalik was found.'
    },
    {
      title: 'How likely is a shared viral insertion by chance?',
      q: 'A retrovirus can insert its DNA at practically any of the $3 \\times 10^9$ positions in a primate genome. Humans and chimpanzees share thousands of such insertions at identical positions. What is the chance that two independent insertions land at the same site, and what does that say?',
      steps: [
        'The chance that a second, independent insertion hits the same position as the first is about $1/(3\\times10^9) \\approx 3\\times10^{-10}$.',
        'For thousands of shared insertions to be coincidences, this improbable event would have to happen thousands of times over.',
        'The simple explanation is that each insertion happened once, in a common ancestor, and was inherited by both species.'
      ],
      a: 'About one in three billion for each insertion — shared insertions are inherited from a common ancestor.'
    }
  ],
  quiz: [
    { q: 'Which pair are homologous structures?', choices: ['a bat\'s wing and a butterfly\'s wing', 'a human arm and a whale\'s flipper', 'a bird\'s wing and a bee\'s wing', 'a shark\'s fin and a dolphin\'s dorsal fin'], a: 1, why: 'The arm and the flipper are built from the same bones inherited from a common ancestor. The other pairs do similar jobs with unrelated structures: they are analogous, the result of convergent evolution.' },
    { q: 'A vestigial structure has no function at all.', a: false, why: 'Vestigial means reduced from its ancestral role, not useless: the human tailbone anchors muscles and the whale pelvis supports the genitals. What marks it out is that its form reflects ancestry more than its present job.' },
    { q: 'Humans and other monkeys and apes carry the same broken vitamin C gene with the same disabling mutations. The best explanation is…', choices: ['the same mutations happened independently in each species', 'the gene broke once in a common ancestor and was inherited', 'the mutations were caused by a diet rich in vitamin C', 'the gene was never functional in any mammal'], a: 1, why: 'Identical mutations at the same place are overwhelmingly likely to have been inherited from one event. Guinea pigs, which lost the same gene independently, show different mutations.' },
    { q: 'A true statement about the fossil record:', choices: ['it contains no fossils intermediate between major groups', 'fossils appear in a consistent order that matches the tree from DNA', 'mammals appear before fish', 'it shows that all species appeared at the same time'], a: 1, why: 'The order of fossils (microbes, then fish, amphibians, reptiles, mammals and birds) agrees with the tree built independently from anatomy and molecules.' },
    { q: 'Out of 104 amino acids, human and tuna cytochrome c differ at 21. What percentage of sites are identical?', answer: 79.8, unit: '%', why: '(104 − 21)/104 = 83/104 = 0.798 — about 80 % identical, after some 430 million years of separate evolution.' }
  ],
  problems: [
    { q: 'Human and horse cytochrome c differ at 12 of 104 amino acids; human and chicken at 13. What fraction of sites differ between human and horse?', answer: 11.5, unit: '%', tol: 0.02, steps: ['$12/104 = 0.115$, about 11.5 %.', 'The horse and the chicken are almost equally distant from us at this protein, because both lineages split from ours long ago (about 90 and 320 million years).'] }
  ],
  applications: ['Choosing model organisms: common descent is why genes studied in yeast, flies and mice tell us about human biology.', 'Predicting and managing resistance to antibiotics, antivirals, pesticides and cancer drugs.', 'Using microfossils to date rock layers in geology and the search for oil.', 'Comparing genomes across species to find the parts that matter, because they are conserved.'],
  history: 'Richard Owen defined homology in the 1840s, before Darwin, though he explained it as variations on an ideal plan. Darwin\'s *Origin* (1859) sold out its first printing on the first day of sale, and *Archaeopteryx* was found two years later. Biochemists in the 1960s showed that protein sequences follow the same tree as anatomy, and genome sequencing since 2000 has turned the evidence into billions of letters.',
  sim: 'evo-tree'
},

{
  id: 'natural-selection', parent: 'evolution-mechanisms', title: 'Natural selection', level: 1,
  short: 'When individuals vary, the variation is inherited and some variants leave more offspring than others, the favoured variants become commoner generation after generation. Natural selection is the only known process that builds adaptations.',
  keywords: ['natural selection', 'fitness', 'relative fitness', 'selection coefficient', 'adaptation', 'peppered moth', 'industrial melanism', 'Darwin\'s finches', 'beak depth', 'Grant', 'antibiotic resistance', 'directional selection', 'stabilising selection', 'disruptive selection', 'balancing selection', 'breeder\'s equation', 'heritability'],
  prereq: ['evidence-evolution', 'mendels-laws', 'mutations'],
  related: ['hardy-weinberg', 'genetic-drift', 'sexual-selection', 'coevolution', 'antibiotic-resistance', 'polygenic-traits', 'medicine:antimicrobial-resistance', 'medicine:malaria'],
  body: `
Natural selection follows from three facts that anyone can check:

1. **Variation** — individuals of a species differ in size, colour, chemistry and behaviour.
2. **Inheritance** — some of the differences are passed from parents to offspring, through genes.
3. **Differential reproduction** — more young are born than can survive, and the ones whose traits suit their surroundings leave more offspring.

If all three hold, the favoured variants must become commoner in the next generation. Nothing has to "try" to adapt: mutations arise at random with respect to what the organism needs, and selection sorts them — the variation is random, the sorting is not. Darwin and Alfred Russel Wallace reached the idea independently and presented it together in 1858.

### Fitness and the selection coefficient
**Fitness** is reproductive success: how many offspring a type leaves, relative to the best type. If the best leaves 1 and another 0.8, the second has relative fitness $w = 0.8$ and a **selection coefficient** $s = 1 - w = 0.2$ against it. Strength, speed or health count only through their effect on offspring.

For a gene with alleles A and a and fitnesses $1 + s$ (AA), $1 + s/2$ (Aa) and 1 (aa) — *additive* selection — the frequency $p$ of A rises each generation by

$$\\Delta p = \\frac{s\\,p\\,q}{2\\,(1 + s\\,p)} \\approx \\frac{s\\,p\\,q}{2}$$

(books that call the heterozygote's advantage $s$ write $\\Delta p \\approx s\\,p\\,q$). The factor $p\\,q$ means change is slow while A is rare, fastest at $p = 0.5$ and slow again near fixation: an S-shaped rise. With $s = 0.1$, going from 1 % to 99 % takes $(2/s)\\ln(99 \\times 99) \\approx 184$ generations — a blink of geological time. An advantageous *recessive* allele is almost invisible to selection while rare, because it hides in heterozygotes.

### The peppered moth
The pale peppered moth rests on lichen-covered bark, where birds find it hard to see. A black form, *carbonaria*, due to one dominant mutation, was first recorded in Manchester in 1848; as soot from coal killed the lichens and blackened the trees, it rose to about 98 % of Manchester's moths by 1895. In the 1950s Bernard Kettlewell released marked moths: in a sooty Birmingham wood about twice as many dark as pale moths were recaptured (27.5 % against 13 %), in a clean Dorset wood the reverse — a selection coefficient near 0.5 either way. After the Clean Air Act of 1956 the trees cleaned up and the dark form fell, near Liverpool from about 90 % in 1959 to under 10 % by 2000. The mutation itself, a jumping gene inserted into the gene *cortex*, has been dated to about 1819.

### Darwin's finches, measured
Peter and Rosemary Grant have measured almost every medium ground finch on the tiny Galápagos island of Daphne Major since 1973. In the drought of 1977 about four birds in five died; the seeds that remained were large and hard, and the survivors had beaks about half a millimetre (some 5 %) deeper than the population before. Beak depth is highly heritable ($h^2 \\approx 0.8$), and the next generation hatched with deeper beaks — evolution measured in a single year. In later wet years, and in a 2004 drought when a larger competitor took the big seeds, selection ran the other way.

### Kinds of selection

| Mode | What it does | Example |
|---|---|---|
| Directional | shifts the mean | darker moths on sooty bark; antibiotic resistance |
| Stabilising | favours the middle, trims the extremes | human birth weight, where historic infant mortality was lowest near 3.5 kg |
| Disruptive | favours both extremes | African seedcracker finches with small or large bills for soft or hard seeds |
| Balancing | keeps two alleles | the sickle-cell allele, where carriers are protected against malaria ([[medicine:malaria]]) |

For a trait controlled by many genes ([[polygenic-traits]]) the response to one generation of selection is given by the **breeder's equation**, $R = h^2 S$: the shift in the next generation's mean equals the heritability times the **selection differential** $S$, the difference between the mean of the parents that breed and the mean of the whole population.

> [!key] Selection acts on individuals, but it is populations that evolve. It needs heritable variation, and it can only favour what works better *now* — it has no foresight.

> [!why] Antibiotics do not cause resistance mutations: in a billion bacteria, a few resistant mutants already exist before treatment (Luria and Delbrück showed this in 1943). The drug kills the rest, and the resistant ones inherit the infection. See [[antibiotic-resistance]] and [[medicine:antimicrobial-resistance]].
`,
  ideas: [
    'Heritable variation plus differential reproduction makes favoured variants commoner: natural selection.',
    'Mutations are random with respect to need; selection, the sorting of them, is not random.',
    'Fitness is relative reproductive success; the selection coefficient s = 1 − w measures how much less a type leaves.',
    'Under additive selection Δp ≈ spq/2: slow when rare, fastest at p = 0.5 — an S-shaped spread.',
    'Selection can be directional, stabilising, disruptive or balancing; for polygenic traits R = h²S.'
  ],
  pitfalls: [
    'Individuals evolve in response to their environment — Individuals do not evolve; the proportions of inherited types in a population change from one generation to the next.',
    'Organisms get the mutations they need — Mutations arise at random; the environment selects among variants that already exist (as bacteria resistant before any antibiotic show).',
    'Survival of the fittest means the strongest — Fitness is reproductive success, relative to the others; a drab moth or a small beak can be the fittest.'
  ],
  formulas: [
    {
      name: 'Selection coefficient from survival',
      expr: 's = 1 - W2/W1', tex: 's = 1 - \\dfrac{W_2}{W_1}',
      vars: {
        s: { name: 'selection coefficient against type 2', tex: 's', min: 0, max: 1 },
        W2: { name: 'survival (or offspring) of the less fit type', q: 'ratio', unit: '%', value: 13.1, tex: 'W_2' },
        W1: { name: 'survival (or offspring) of the fitter type', q: 'ratio', unit: '%', value: 27.5, tex: 'W_1' }
      },
      note: 'The relative fitness of type 2 is w = W₂/W₁ = 1 − s. Survival rates, recapture rates or numbers of offspring may be used, as long as both types are measured the same way.',
      stories: {
        s: 'In a sooty wood, {W1} of the dark moths released were recaptured but only {W2} of the pale ones. What is the selection coefficient against the pale form?',
        W2: 'The fitter form survives at {W1}, and selection against the other form is s = {s}. What is the survival of the other form?'
      }
    },
    {
      name: 'Change in allele frequency per generation (additive)',
      expr: 'dp = s*p*(1 - p)/(2*(1 + s*p))', tex: '\\Delta p = \\dfrac{s\\,p\\,(1 - p)}{2\\,(1 + s\\,p)}',
      vars: {
        dp: { name: 'change in the frequency of A in one generation', tex: '\\Delta p' },
        s: { name: 'selection coefficient (advantage of AA over aa)', value: 0.1, min: 0, max: 2, tex: 's' },
        p: { name: 'frequency of allele A', value: 0.5, min: 0, max: 1, tex: 'p' }
      },
      note: 'Fitnesses 1 + s, 1 + s/2 and 1 for AA, Aa and aa, random mating, a large population. For small s, Δp ≈ spq/2. Solving for p can give two frequencies with the same Δp, one on each side of the fastest point.',
      practice: { unknowns: ['dp', 's'] },
      stories: { dp: 'An allele with an additive advantage s = {s} is at frequency p = {p}. By how much does its frequency change in one generation?' }
    },
    {
      name: 'Generations for an allele to spread',
      expr: 't = (2/s)*ln(p1*(1 - p0)/(p0*(1 - p1)))', tex: 't = \\dfrac{2}{s}\\,\\ln\\dfrac{p_1\\,(1 - p_0)}{p_0\\,(1 - p_1)}',
      vars: {
        t: { name: 'number of generations', tex: 't' },
        s: { name: 'selection coefficient (additive)', value: 0.1, min: 0, max: 2, tex: 's' },
        p0: { name: 'starting frequency', value: 0.01, min: 0, max: 1, tex: 'p_0' },
        p1: { name: 'final frequency', value: 0.99, min: 0, max: 1, tex: 'p_1' }
      },
      note: 'From Δp ≈ spq/2 (weak additive selection): the log of the odds p/q grows by s/2 per generation. For a dominant or recessive allele the path is different, but the order of magnitude is the same.',
      stories: {
        t: 'A new allele with advantage s = {s} rises from {p0} to {p1}. About how many generations does it take?',
        s: 'An allele spread from {p0} to {p1} in {t} generations. What selection coefficient does that imply?'
      }
    },
    {
      name: 'The breeder\'s equation',
      expr: 'R = h2*S', tex: 'R = h^2 S',
      vars: {
        R: { name: 'response: change in the mean in the next generation', q: 'length', unit: 'mm', tex: 'R' },
        h2: { name: 'heritability', value: 0.8, min: 0, max: 1, tex: 'h^2' },
        S: { name: 'selection differential: mean of the breeders minus the population mean', q: 'length', unit: 'mm', value: 0.5, tex: 'S' }
      },
      note: 'Heritability here is narrow-sense: the share of the variation passed on additively from parents to offspring. The trait may be any measurement — beak depth, body mass, milk yield.',
      stories: {
        R: 'After a drought the surviving finches have beaks {S} deeper than the average before. With a heritability of {h2}, how much deeper will their offspring\'s beaks be?',
        h2: 'Parents selected {S} above the mean produce offspring {R} above it. What is the heritability of the trait?'
      }
    }
  ],
  examples: [
    {
      title: 'Kettlewell\'s moths: how strong was the selection?',
      q: 'In a sooty wood near Birmingham in 1953, 27.5 % of marked dark moths were recaptured and 13.1 % of pale ones. In a clean Dorset wood in 1955 the figures were 6.3 % dark and 12.5 % pale. Find the selection coefficient in each wood.',
      steps: [
        'Birmingham: the pale moths\' fitness relative to the dark is $w = 13.1/27.5 = 0.48$, so $s = 1 - 0.48 = 0.52$ against pale moths.',
        'Dorset: the dark moths\' relative fitness is $w = 6.3/12.5 = 0.50$, so $s = 0.50$ against dark moths.',
        'Selection of about 50 % per generation is extraordinarily strong — enough to change the population within decades, as happened.'
      ],
      a: 's ≈ 0.52 against pale moths in the sooty wood and s ≈ 0.50 against dark moths in the clean one.'
    },
    {
      title: 'The rise of the dark moth in Manchester',
      q: 'Dark moths made up about 1 % of the Manchester population around 1848 and about 98 % in 1895: some 47 generations, one a year. The dark allele is dominant. Estimate the selection coefficient with the additive spread formula.',
      steps: [
        'Pale moths are recessive homozygotes, so $q^2$ is the pale fraction. In 1848: $q = \\sqrt{0.99} = 0.99499$, $p_0 = 0.0050$. In 1895: $q = \\sqrt{0.02} = 0.1414$, $p_1 = 0.8586$.',
        { text: 'The change in log-odds:', tex: '\\ln\\frac{p_1 (1 - p_0)}{p_0 (1 - p_1)} = \\ln\\frac{0.8586 \\times 0.99499}{0.0050 \\times 0.1414} = \\ln 1205 = 7.09' },
        'Then $s = 2 \\times 7.09/47 = 0.30$.',
        'J. B. S. Haldane made a similar estimate in 1924 and concluded that dark moths had about half as many offspring again as pale ones — far stronger selection than anyone had imagined.'
      ],
      a: 'About s ≈ 0.3 per generation in favour of the dark form.'
    },
    {
      title: 'Finch beaks after the drought',
      q: 'The finches that survived the 1977 drought had beaks about 0.5 mm deeper than the average bird before it, and the heritability of beak depth is about 0.8. Predict the change in the next generation.',
      steps: [
        'Selection differential $S = 0.5$ mm, heritability $h^2 = 0.8$.',
        '$R = h^2 S = 0.8 \\times 0.5 = 0.4$ mm.',
        'On beaks about 9–10 mm deep this is roughly 4 % — close to what the Grants measured in the chicks of 1978.'
      ],
      a: 'About 0.4 mm deeper beaks in the next generation.'
    }
  ],
  quiz: [
    { q: 'Which is essential for natural selection to change a population?', choices: ['heritable variation that affects survival or reproduction', 'individuals trying to adapt to their surroundings', 'a very large population', 'mutations caused by the environment when needed'], a: 0, why: 'Selection needs variation that is inherited and that makes a difference to reproduction. Effort, population size and directed mutations are not required (and directed mutation does not happen).' },
    { q: 'Bacteria become resistant because the antibiotic causes the mutations they need.', a: false, why: 'Resistant mutants arise at random, before any antibiotic is present; the drug kills the susceptible cells and leaves the resistant ones to multiply.' },
    { q: 'Using $\\Delta p \\approx s\\,p\\,q/2$, how much does an allele at $p = 0.5$ with $s = 0.1$ change in one generation?', answer: 0.0125, why: '0.1 × 0.5 × 0.5 / 2 = 0.0125. (The exact formula, with 1 + sp in the denominator, gives 0.0119.)' },
    { q: 'A new advantageous allele is rare. It will spread fastest at first if it is…', choices: ['recessive', 'dominant', 'the same either way', 'neither: rare alleles cannot spread'], a: 1, why: 'A rare allele is almost always in heterozygotes. If it is dominant, heterozygotes show the advantage; if recessive, selection hardly sees it until it becomes common.' },
    { q: 'Infants of middle birth weight historically survived best, and very small or very large babies less well. This is…', choices: ['directional selection', 'stabilising selection', 'disruptive selection', 'genetic drift'], a: 1, why: 'Favouring the middle and trimming both tails is stabilising selection; it keeps the mean where it is and narrows the spread.' }
  ],
  problems: [
    { q: 'Dairy cows selected as parents give on average 1000 L more milk a year than the herd mean. The heritability of milk yield is 0.3. How much more milk will their daughters give?', answer: 300, unit: 'L', tol: 0.02, steps: ['$R = h^2 S = 0.3 \\times 1000 = 300$ L a year above the old mean.'] },
    { q: 'Of 200 lizards with long legs, 120 survive a storm; of 200 with short legs, 90 survive. What is the selection coefficient against short legs?', answer: 0.25, tol: 0.02, steps: ['Survival: 60 % and 45 %.', '$s = 1 - 45/60 = 0.25$.'] }
  ],
  applications: ['Antibiotic stewardship: completing appropriate courses and avoiding needless use reduce the selection that spreads resistance.', 'Pest and weed management: refuges of non-resistant plants slow the evolution of resistance to insecticidal crops and herbicides.', 'Plant and animal breeding, which is artificial selection predicted by the breeder\'s equation.', 'Cancer treatment, where tumour cells evolve resistance to drugs by the same logic.'],
  history: 'Darwin worked on natural selection for twenty years before a letter arrived in 1858 from Wallace, in the Moluccas, describing the same idea; their papers were read together at the Linnean Society that July. The mathematics came in the 1920s and 1930s from R. A. Fisher, J. B. S. Haldane and Sewall Wright, whose "modern synthesis" joined Darwin to Mendel.',
  sim: 'evo-camouflage'
},

{
  id: 'hardy-weinberg', parent: 'evolution-mechanisms', title: 'Hardy–Weinberg equilibrium', level: 2,
  short: 'In a large, randomly mating population with no selection, mutation or migration, allele frequencies stay constant and the genotypes occur in the proportions p², 2pq and q². It is the null model that tells us when a population is evolving.',
  keywords: ['Hardy–Weinberg', 'Hardy-Weinberg', 'allele frequency', 'genotype frequency', 'p² + 2pq + q²', 'gene pool', 'carrier frequency', 'random mating', 'chi-square test', 'heterozygosity', 'inbreeding coefficient', 'equilibrium', 'null model'],
  prereq: ['mendels-laws', 'punnett-squares', 'math:probability'],
  related: ['chi-square-genetics', 'genetic-drift', 'natural-selection', 'gene-flow-mutation', 'human-genetics', 'multiple-alleles', 'sex-linkage', 'math:hypothesis-testing', 'medicine:blood-groups'],
  body: `
In 1908 the geneticist Reginald Punnett was asked a puzzling question: if short fingers are caused by a dominant allele, why don't short fingers take over the population, until three people in four have them? He passed it to his cricket partner, the mathematician G. H. Hardy, who answered in a one-page letter. The German physician Wilhelm Weinberg found the same result the same year. The answer is that dominance does not change allele frequencies at all.

### The gene pool
Think of all the gametes of a population as one pool. For a gene with two alleles, A makes up a fraction $p$ of the pool and a a fraction $q = 1 - p$. With **random mating**, each offspring is two independent draws from the pool, so

$$p^2 + 2pq + q^2 = (p + q)^2 = 1$$

— a fraction $p^2$ of offspring are AA, $2pq$ are Aa and $q^2$ are aa. The next generation's pool again contains A at $p^2 + pq = p(p + q) = p$: the allele frequencies do not change, however dominant or recessive the alleles are. One generation of random mating is enough to reach these proportions, and they then stay.

| $p$ (A) | AA $= p^2$ | Aa $= 2pq$ | aa $= q^2$ |
|---|---|---|---|
| 0.9 | 0.81 | 0.18 | 0.01 |
| 0.5 | 0.25 | 0.50 | 0.25 |
| 0.1 | 0.01 | 0.18 | 0.81 |
| 0.99 | 0.9801 | 0.0198 | 0.0001 |

The last row holds the most useful lesson: when an allele is rare, almost all its copies sit in heterozygotes. With $q = 0.01$ there are 198 carriers for every affected person.

### The assumptions — and why they matter
The equilibrium holds only if there is **no selection, no mutation, no migration, no drift** (an infinitely large population) and **random mating**. No real population meets all five, and that is the point: Hardy–Weinberg is to evolution what Newton's first law is to motion — it says what happens when nothing acts, so any departure measures a force. Selection, mutation, [[gene-flow-mutation|migration]] and [[genetic-drift|drift]] change allele frequencies. Non-random mating — inbreeding, or a sample that mixes two populations — changes only the genotype proportions: it produces too few heterozygotes. The shortfall is the **inbreeding coefficient** $F = 1 - H_o/H_e$, with $H_o$ the observed and $H_e = 2pq$ the expected heterozygosity.

### Using it: carriers of recessive conditions
Cystic fibrosis affects about 1 child in 2500 among people of northern European ancestry. If the population is near equilibrium, $q^2 = 1/2500$, so $q = 0.02$, and the carriers are $2pq = 2 \\times 0.98 \\times 0.02 = 0.039$ — about **1 person in 25**. Such estimates guide genetic counselling and screening. Allele frequencies differ between populations and the estimate lumps many different mutations together, so it is a guide, not a diagnosis. For X-linked genes the frequency in males equals the allele frequency: about 8 % of men of northern European ancestry have red–green colour blindness, so $q = 0.08$ and about $q^2 = 0.64$ % of women do.

### Testing it: the chi-square test
Count the genotypes in a sample of $n$ individuals, estimate $p = (2n_{AA} + n_{Aa})/2n$, work out the expected counts $np^2$, $2npq$, $nq^2$, and compute $\\chi^2 = \\sum (O - E)^2/E$ (see [[chi-square-genetics]]). There are three classes, minus one for the total and one for the estimated $p$: **one degree of freedom**, so $\\chi^2 > 3.84$ is a departure at the 5 % level. For two alleles the statistic has a neat form, $\\chi^2 = n F^2$. Geneticists run this test on every marker of a genotyping study: a marker badly out of equilibrium usually signals a laboratory error.

> [!key] Allele frequencies stay put and genotypes settle at $p^2 : 2pq : q^2$ unless something acts — selection, mutation, migration, drift or non-random mating. Measuring the departure is how evolution is detected.

With more alleles the same logic expands $(p + q + r)^2$: for the ABO blood groups, type O is $r^2$, type A is $p^2 + 2pr$ ([[multiple-alleles]]).
`,
  ideas: [
    'With random mating, genotype frequencies are p², 2pq and q², reached in one generation.',
    'Allele frequencies do not change on their own: dominance does not make an allele commoner.',
    'The equilibrium assumes no selection, mutation, migration or drift, and random mating; departures reveal evolution.',
    'A rare recessive allele hides mostly in carriers: 2pq is much larger than q².',
    'A chi-square test with one degree of freedom checks a sample against the equilibrium (χ² = nF² for two alleles).'
  ],
  pitfalls: [
    'A dominant allele will spread until three quarters of people show the trait — Dominance affects which genotypes show a trait, not how common the allele is; without selection its frequency stays the same.',
    'Hardy–Weinberg needs p = q = 0.5 — Any allele frequency is an equilibrium; the proportions p², 2pq, q² hold for every p.',
    'Inbreeding changes allele frequencies — On its own it only shifts genotypes from heterozygotes to homozygotes; the allele frequencies are unchanged (though it exposes recessive alleles to selection).'
  ],
  formulas: [
    {
      name: 'Carriers of a recessive condition',
      expr: 'c = 2*sqrt(f)*(1 - sqrt(f))', tex: 'f_{Aa} = 2\\sqrt{f_{aa}}\\left(1 - \\sqrt{f_{aa}}\\right)',
      vars: {
        c: { name: 'frequency of carriers (heterozygotes)', q: 'ratio', unit: '%', tex: 'f_{Aa}' },
        f: { name: 'frequency of the recessive condition (aa)', q: 'ratio', unit: '%', value: 0.04, min: 0, max: 25, tex: 'f_{aa}' }
      },
      note: 'Assumes Hardy–Weinberg proportions: q = √f and carriers = 2pq. Valid for a single population; frequencies differ between populations.',
      stories: {
        c: 'A recessive condition affects {f} of births. What fraction of people are carriers?',
        f: 'If {c} of a population are carriers of a recessive allele, how common is the condition?'
      }
    },
    {
      name: 'Allele frequency from genotype counts',
      expr: 'p = (2*nAA + nAa)/(2*(nAA + nAa + naa))', tex: 'p = \\dfrac{2n_{AA} + n_{Aa}}{2\\,(n_{AA} + n_{Aa} + n_{aa})}',
      vars: {
        p: { name: 'frequency of allele A', min: 0, max: 1, tex: 'p' },
        nAA: { name: 'number of AA individuals', q: 'count', int: true, value: 298, tex: 'n_{AA}' },
        nAa: { name: 'number of Aa individuals', q: 'count', int: true, value: 489, tex: 'n_{Aa}' },
        naa: { name: 'number of aa individuals', q: 'count', int: true, value: 213, tex: 'n_{aa}' }
      },
      note: 'Each AA carries two copies of A, each Aa one; the sample holds 2n copies in all. This works whether or not the population is in equilibrium.',
      practice: { unknowns: ['p'] },
      stories: { p: 'A sample contains {nAA} AA, {nAa} Aa and {naa} aa individuals. What is the frequency of allele A?' }
    },
    {
      name: 'Inbreeding coefficient (heterozygote deficit)',
      expr: 'F = 1 - Ho/He', tex: 'F = 1 - \\dfrac{H_o}{H_e}',
      vars: {
        F: { name: 'inbreeding coefficient', signed: true, min: -1, max: 1, tex: 'F' },
        Ho: { name: 'observed fraction of heterozygotes', value: 0.3, min: 0, max: 1, tex: 'H_o' },
        He: { name: 'expected fraction of heterozygotes, 2pq', value: 0.48, min: 0, max: 1, tex: 'H_e' }
      },
      note: 'F = 0 at equilibrium, positive when heterozygotes are missing (inbreeding, or two populations sampled together), negative when there are too many.',
      stories: { F: 'A population expected to have {He} heterozygotes has only {Ho}. What is the inbreeding coefficient?' }
    },
    {
      name: 'Chi-square for Hardy–Weinberg (two alleles)',
      expr: 'chi2 = n*F^2', tex: '\\chi^2 = n\\,F^2',
      vars: {
        chi2: { name: 'chi-square statistic (1 degree of freedom)', tex: '\\chi^2' },
        n: { name: 'number of individuals in the sample', q: 'count', int: true, value: 200, tex: 'n' },
        F: { name: 'inbreeding coefficient of the sample, 1 − Ho/He', signed: true, value: 0.375, min: -1, max: 1, tex: 'F' }
      },
      note: 'Exactly equal to Σ(O − E)²/E for three genotypes with p estimated from the sample. Above 3.84 the departure is significant at the 5 % level. Solving for F gives ±F: a deficit or an excess of heterozygotes.',
      stories: {
        chi2: 'A sample of {n} individuals has F = {F}. What is the chi-square statistic?',
        n: 'A heterozygote deficit of F = {F} gives χ² = {chi2}. How large was the sample?'
      }
    }
  ],
  examples: [
    {
      title: 'Is the MN blood group in equilibrium?',
      q: 'Suppose a sample of 1000 people gives 298 of blood group MM, 489 MN and 213 NN (M and N are codominant). Are these numbers consistent with Hardy–Weinberg equilibrium?',
      steps: [
        'Allele frequency: $p = (2 \\times 298 + 489)/2000 = 1085/2000 = 0.5425$, $q = 0.4575$.',
        'Expected: MM $1000 \\times 0.5425^2 = 294.3$; MN $1000 \\times 2 \\times 0.5425 \\times 0.4575 = 496.4$; NN $1000 \\times 0.4575^2 = 209.3$.',
        { text: 'Chi-square:', tex: '\\chi^2 = \\frac{3.7^2}{294.3} + \\frac{7.4^2}{496.4} + \\frac{3.7^2}{209.3} = 0.047 + 0.110 + 0.065 = 0.22' },
        'With one degree of freedom the 5 % critical value is 3.84; 0.22 is far below it (p ≈ 0.64).'
      ],
      a: 'Yes: χ² = 0.22, well within what chance produces — the sample fits the equilibrium.'
    },
    {
      title: 'How many people carry cystic fibrosis?',
      q: 'Cystic fibrosis affects about 1 in 2500 births among people of northern European ancestry. Estimate the carrier frequency, and check it against the chance that two carriers have an affected child.',
      steps: [
        '$q^2 = 1/2500 = 0.0004$, so $q = 0.02$ and $p = 0.98$.',
        'Carriers: $2pq = 2 \\times 0.98 \\times 0.02 = 0.0392$, about 1 in 25.',
        'Check: the chance that both parents are carriers is $(1/25.5)^2 = 1/650$, and each child of two carriers is affected with probability 1/4, giving $1/2600$ — consistent with 1 in 2500.'
      ],
      a: 'About 3.9 % of people — 1 in 25 — are carriers.'
    },
    {
      title: 'An X-linked trait',
      q: 'About 8 % of men of northern European ancestry have red–green colour blindness, which is X-linked recessive. What fraction of women have it, and what fraction are carriers?',
      steps: [
        'A man has one X chromosome, so the frequency of affected men equals the allele frequency: $q = 0.08$.',
        'Affected women need two copies: $q^2 = 0.0064$, about 0.6 %.',
        'Carrier women: $2pq = 2 \\times 0.92 \\times 0.08 = 0.147$, about 15 %.'
      ],
      a: 'About 0.6 % of women are colour-blind and about 15 % are carriers.'
    }
  ],
  quiz: [
    { q: 'In a population in equilibrium with $p = 0.3$, what fraction are heterozygotes?', answer: 0.42, why: '2pq = 2 × 0.3 × 0.7 = 0.42.' },
    { q: 'A population has 50 AA, 0 Aa and 50 aa individuals. What is the most likely explanation?', choices: ['it is in Hardy–Weinberg equilibrium', 'two separate populations, one all AA and one all aa, were sampled together', 'the A allele is dominant', 'mutation is very frequent'], a: 1, why: 'With p = 0.5 we expect 25 : 50 : 25. A complete lack of heterozygotes means the individuals are not mating at random — for instance two isolated groups counted as one (the Wahlund effect).' },
    { q: 'After one generation of random mating, genotype frequencies at an autosomal gene reach Hardy–Weinberg proportions.', a: true, why: 'Random union of gametes gives p², 2pq, q² immediately, whatever the parents\' genotype frequencies were.' },
    { q: 'For a rare recessive allele with $q = 0.01$, how many carriers are there for every affected person?', answer: 198, why: '2pq/q² = 2p/q = 2 × 0.99/0.01 = 198.' },
    { q: 'Which of these changes genotype frequencies but not allele frequencies?', choices: ['natural selection', 'inbreeding', 'migration', 'mutation'], a: 1, why: 'Inbreeding makes relatives mate, turning heterozygotes into homozygotes, but it does not add or remove alleles. The other three change allele frequencies.' }
  ],
  problems: [
    { q: 'A recessive condition affects 1 in 10 000 births. What percentage of the population are carriers?', answer: 1.98, unit: '%', tol: 0.02, steps: ['$q = \\sqrt{0.0001} = 0.01$, $p = 0.99$.', '$2pq = 2 \\times 0.99 \\times 0.01 = 0.0198$ — about 2 %, 1 person in 50.'] },
    { q: 'A sample of 200 individuals contains 90 AA, 60 Aa and 50 aa. Calculate the chi-square statistic for Hardy–Weinberg equilibrium.', answer: 28.1, tol: 0.02, hint: 'First estimate p from the counts.', steps: ['$p = (180 + 60)/400 = 0.6$. Expected: 72, 96, 32.', '$\\chi^2 = 18^2/72 + 36^2/96 + 18^2/32 = 4.5 + 13.5 + 10.1 = 28.1$.', 'Check: $H_o = 0.3$, $H_e = 0.48$, $F = 0.375$, $nF^2 = 200 \\times 0.1406 = 28.1$. Far above 3.84: a large heterozygote deficit.'] }
  ],
  applications: [
    'Test genotype counts against Hardy–Weinberg, or find carrier frequencies, in [the Hardy–Weinberg calculator](#/tools/genetics/hardy).','Estimating carrier frequencies for genetic counselling and screening programmes.', 'Quality control in genotyping studies: markers far out of equilibrium usually indicate laboratory errors.', 'Forensic DNA profiles, where genotype frequencies from allele frequencies give the chance of a random match.', 'Detecting inbreeding, population mixing or selection in wild and captive populations.'],
  history: 'Hardy published his letter in *Science* in July 1908, somewhat embarrassed to put such simple mathematics in print; Weinberg had given the same result in a lecture in Stuttgart in January. William Castle had noticed a special case in 1903. The principle became the foundation of population genetics.',
  sim: 'evo-hw'
},

{
  id: 'genetic-drift', parent: 'evolution-mechanisms', title: 'Genetic drift', level: 2,
  short: 'Each generation is a random sample of the genes of the one before, so allele frequencies wander by chance — most in small populations. Drift fixes or loses neutral alleles, wears away genetic variation and can overpower weak selection.',
  keywords: ['genetic drift', 'random drift', 'Wright–Fisher model', 'sampling error', 'effective population size', 'Ne', 'bottleneck', 'founder effect', 'fixation', 'loss of heterozygosity', 'fixation probability', 'neutral theory', 'Kimura', 'nearly neutral', 'elephant seal', 'cheetah'],
  prereq: ['hardy-weinberg', 'natural-selection', 'math:binomial-distribution'],
  related: ['gene-flow-mutation', 'speciation', 'molecular-clock', 'conservation-biology', 'human-evolution', 'human-genetics', 'math:random-variables'],
  body: `
A population of $N$ diploid individuals carries $2N$ copies of each gene. The next generation is formed from a limited number of eggs and sperm, which carry a random sample of those copies. Even when every allele is equally good, the sample is never exactly representative, just as 20 coin tosses rarely give exactly 10 heads. This is **genetic drift**. In the simplest model, the **Wright–Fisher model**, the next generation's $2N$ copies are $2N$ independent draws from the current pool, so the number of A copies is binomial and the frequency changes by a random amount with standard deviation

$$\\sigma_{\\Delta p} = \\sqrt{\\frac{p\\,q}{2N}}$$

With 10 individuals and $p = 0.5$ that is 0.11 per generation; with 1000 individuals, 0.011. Drift is strong in small populations and weak in large ones, but never zero.

### Where drift leads
Frequencies wander until an allele is **lost** ($p = 0$) or **fixed** ($p = 1$); once there, nothing but mutation or migration brings the other allele back. For a neutral allele the chance of eventual fixation equals its present frequency — so a brand-new mutation, one copy among $2N$, fixes with probability $1/(2N)$. Most new mutations are lost within a few generations; the rare ones that fix take on average about $4N_e$ generations to do so. Meanwhile genetic variation decays: the expected heterozygosity falls by a fraction $1/(2N_e)$ each generation,

$$H_t = H_0\\left(1 - \\frac{1}{2N_e}\\right)^{t} \\approx H_0\\,e^{-t/2N_e}$$

so a population of 50 loses 1 % of its heterozygosity per generation and about 18 % in 20 generations. The simulations show this in replicate populations.

### Effective population size
Drift acts through the **effective population size** $N_e$ — the size of an ideal Wright–Fisher population that drifts as fast as the real one. It is usually much smaller than the census count, often about a tenth in wild animals, because:

| Cause | Effect on $N_e$ |
|---|---|
| Unequal numbers of breeding males and females | $N_e = 4N_mN_f/(N_m + N_f)$: 10 males and 90 females act like 36 |
| Some parents leave many more offspring than others | lowers $N_e$ below the number of adults |
| Population size changes over time | $N_e$ is the **harmonic mean** of the sizes, dominated by the smallest |

Humans number eight billion, but our long-term effective size, read from the variation in our genomes, is only about 10 000 — our ancestors lived in small groups for most of our history.

### Bottlenecks and founders
When a population crashes, the survivors carry a fraction of its variation, and rare alleles are the first to go. Northern elephant seals were hunted down to perhaps a few dozen animals in the 1890s; they now number over 200 000, yet are almost uniform genetically. Cheetahs passed through a bottleneck some ten thousand years ago and are so alike that skin grafts between unrelated animals are not rejected. A **founder effect** is a bottleneck at the start of a new population: a few colonists bring a random handful of alleles. Some inherited conditions are therefore much commoner in communities founded by a few families — Ellis–van Creveld syndrome among the Old Order Amish of Pennsylvania, for example — which is one reason genetic services consider a family's ancestry.

### Drift against selection
Selection wins when its push is larger than the random jitter: in the notation of [[natural-selection]], when $2N_e s \\gg 1$. Kimura's formula gives the chance that an allele starting at frequency $p$ becomes fixed:

$$u = \\frac{1 - e^{-2N_e s p}}{1 - e^{-2N_e s}}$$

A new mutation with an advantage of $s = 0.01$ in a large population fixes with probability only about 1 % — 99 % of such good mutations are lost by bad luck while still rare. And an allele with $s = 0.001$ behaves almost neutrally in a population of 100 but is reliably favoured in one of 10 000. In small populations, slightly harmful mutations can drift to fixation: a problem for endangered species ([[conservation-biology]]).

> [!key] Drift is evolution by sampling error. It has no direction and does not adapt anything, but it is inevitable, it is fastest in small populations, and at the level of DNA — where most changes make little difference — it is the main force. That is the **neutral theory** of Motoo Kimura, and the basis of the [[molecular-clock]].
`,
  ideas: [
    'Each generation samples 2N gene copies at random, so allele frequencies change by chance: SD = √(pq/2N) per generation.',
    'A neutral allele fixes with probability equal to its frequency: 1/(2N) for a new mutation, taking about 4Ne generations when it does.',
    'Heterozygosity decays by a factor (1 − 1/2Ne) per generation.',
    'The effective size Ne is usually far below the census size: unequal sex ratios, variable family sizes and past crashes all reduce it.',
    'Selection beats drift only when 2Ne·s ≫ 1; even beneficial mutations are usually lost while rare.'
  ],
  pitfalls: [
    'Drift makes populations better adapted — Drift is random: it is as likely to fix a harmful allele (if only slightly harmful) as a helpful one, and it erodes the variation selection needs.',
    'Only the number of individuals counted matters — Drift depends on the effective size, which may be a tenth of the census and is dominated by the smallest generations.',
    'A beneficial mutation is bound to spread — While it is present in one or a few copies it is at the mercy of chance; with an advantage of 1 % it is lost about 99 times in 100.'
  ],
  formulas: [
    {
      name: 'Loss of heterozygosity by drift',
      expr: 'Ht = H0*(1 - 1/(2*N))^t', tex: 'H_t = H_0\\left(1 - \\dfrac{1}{2N_e}\\right)^{t}',
      vars: {
        Ht: { name: 'heterozygosity after t generations', min: 0, max: 1, tex: 'H_t' },
        H0: { name: 'starting heterozygosity', value: 0.5, min: 0, max: 1, tex: 'H_0' },
        N: { name: 'effective population size', q: 'count', int: true, value: 50, tex: 'N_e' },
        t: { name: 'number of generations', q: 'count', int: true, value: 20, tex: 't' }
      },
      note: 'The expected value over many populations; any single population fluctuates around it. No mutation or migration.',
      stories: {
        Ht: 'A captive population with an effective size of {N} starts with heterozygosity {H0}. What is it expected to be after {t} generations?',
        N: 'A population lost heterozygosity from {H0} to {Ht} in {t} generations. What was its effective size?',
        t: 'How many generations does a population of effective size {N} take to drop from heterozygosity {H0} to {Ht}?'
      }
    },
    {
      name: 'Effective size with unequal numbers of males and females',
      expr: 'Ne = 4*Nm*Nf/(Nm + Nf)', tex: 'N_e = \\dfrac{4 N_m N_f}{N_m + N_f}',
      vars: {
        Ne: { name: 'effective population size', q: 'count', tex: 'N_e' },
        Nm: { name: 'number of breeding males', q: 'count', int: true, value: 10, tex: 'N_m' },
        Nf: { name: 'number of breeding females', q: 'count', int: true, value: 90, tex: 'N_f' }
      },
      note: 'Half of every offspring\'s genes come from the fathers, however few they are, so the rarer sex limits Ne.',
      stories: {
        Ne: 'In a herd, {Nm} males and {Nf} females breed. What is the effective population size?',
        Nm: 'A population with {Nf} breeding females has an effective size of {Ne}. How many males breed?'
      }
    },
    {
      name: 'Probability of fixation (Kimura)',
      expr: 'u = (1 - exp(-2*N*s*p))/(1 - exp(-2*N*s))', tex: 'u = \\dfrac{1 - e^{-2N_e s p}}{1 - e^{-2N_e s}}',
      vars: {
        u: { name: 'probability that A becomes fixed', q: 'ratio', unit: '%', tex: 'u' },
        N: { name: 'effective population size', q: 'count', int: true, value: 100, tex: 'N_e' },
        s: { name: 'selection coefficient (additive: AA 1 + s, Aa 1 + s/2)', signed: true, value: 0.01, min: -0.5, max: 0.5, tex: 's' },
        p: { name: 'starting frequency of A (1/2N for a new mutation)', value: 0.005, min: 0, max: 1, tex: 'p' }
      },
      note: 'Diffusion approximation, valid for small s. As s → 0 it tends to u = p, the neutral result. For a new mutation in a large population with 2Ns ≫ 1, u ≈ s. A negative s gives the (small) chance that a harmful allele fixes.',
      practice: { unknowns: ['u', 'p'] },
      stories: {
        u: 'A new mutation (p = {p}) with an advantage s = {s} arises in a population of effective size {N}. What is the chance it becomes fixed?',
        p: 'In a population of effective size {N}, an allele with s = {s} has a chance {u} of fixation. What is its current frequency?'
      }
    },
    {
      name: 'Time for a neutral mutation to become fixed',
      expr: 'T = 4*N*g', tex: 'T \\approx 4N_e\\,g',
      vars: {
        T: { name: 'average time to fixation (for those that fix)', q: 'time', unit: 'Myr', tex: 'T' },
        N: { name: 'effective population size', q: 'count', int: true, value: 10000, tex: 'N_e' },
        g: { name: 'generation time', q: 'time', unit: 'yr', value: 29, tex: 'g' }
      },
      note: 'About 4Ne generations on average, with a wide spread; the many new mutations that are lost disappear within a few generations.',
      stories: {
        T: 'Humans have a long-term effective size of about {N} and a generation time of {g}. How long does a new neutral mutation take to become fixed, if it does?',
        N: 'Neutral mutations in a species with a generation time of {g} take about {T} to fix. What is its effective size?'
      }
    }
  ],
  examples: [
    {
      title: 'Keeping variation in a zoo population',
      q: 'A zoo keeps 25 male and 25 female antelopes, all breeding, for 20 generations. How much heterozygosity is lost? What if only 5 males breed with 45 females?',
      steps: [
        'Equal sexes: $N_e = 50$, and $(1 - 1/100)^{20} = 0.818$ — about 18 % of the heterozygosity is lost.',
        'Five males: $N_e = 4 \\times 5 \\times 45/50 = 18$, and $(1 - 1/36)^{20} = 0.569$ — 43 % is lost.',
        'Same number of animals, more than twice the loss: this is why breeding programmes rotate males and manage who mates with whom.'
      ],
      a: 'About 18 % with equal sexes; about 43 % with 5 breeding males.'
    },
    {
      title: 'One bad year',
      q: 'A population numbers 1000 in four generations out of five but crashes to 20 in one of them. What is its effective size over the five generations?',
      steps: [
        { text: 'The effective size is the harmonic mean of the sizes:', tex: 'N_e = \\frac{5}{\\frac{4}{1000} + \\frac{1}{20}} = \\frac{5}{0.004 + 0.05} = 92.6' },
        'A single crash drags the effective size from 1000 down to about 93: the small generation dominates, because the variation lost in it cannot be regained by the large ones.'
      ],
      a: 'About 93 — less than a tenth of the usual census size.'
    },
    {
      title: 'Most good mutations are lost',
      q: 'A new mutation with an advantage of $s = 0.01$ appears as a single copy in a population of effective size 10 000. What is the chance it becomes fixed, and how does that compare with a neutral mutation?',
      steps: [
        '$p = 1/(2N) = 1/20\\,000 = 5\\times10^{-5}$ and $2N s = 200$.',
        '$u = (1 - e^{-2Nsp})/(1 - e^{-200}) = (1 - e^{-0.01})/1 = 0.00995$ — about 1 %.',
        'A neutral mutation fixes with probability $1/20\\,000 = 0.005$ %: the advantage makes fixation 200 times likelier, yet 99 times in 100 the good mutation is still lost by chance while rare.'
      ],
      a: 'About 1 % (u ≈ s), against 0.005 % for a neutral mutation.'
    }
  ],
  quiz: [
    { q: 'Genetic drift changes allele frequencies fastest in…', choices: ['large populations', 'small populations', 'populations under strong selection', 'populations with high mutation rates'], a: 1, why: 'The random change per generation has variance pq/2N: the fewer gene copies, the larger the sampling error.' },
    { q: 'A neutral allele is at 30 % in a population. What is the chance that it eventually becomes fixed?', answer: 30, unit: '%', why: 'For a neutral allele the fixation probability equals its current frequency: each of the 2N copies is equally likely to be the ancestor of all future copies.' },
    { q: 'Genetic drift tends to make populations better adapted to their environment.', a: false, why: 'Drift is random with respect to fitness; it can fix slightly harmful alleles and it removes variation. Adaptation comes only from selection.' },
    { q: 'In a population of 510 adults, 10 males and 500 females breed. What is the effective population size?', answer: 39.2, why: 'Ne = 4 × 10 × 500/510 = 39.2 — the ten males limit it.' },
    { q: 'In a population of effective size 20, a mutation with s = −0.02 fixes with probability 1.6 % against 2.5 % for a neutral one. What does this show?', choices: ['selection is always stronger than drift', 'in small populations slightly harmful mutations behave almost like neutral ones', 'harmful mutations can never be fixed', 'drift only acts on neutral alleles'], a: 1, why: 'Here 2Ne|s| = 0.8, less than 1: selection is too weak to control the allele\'s fate, and drift decides. This is the "nearly neutral" regime.' }
  ],
  problems: [
    { q: 'A population of effective size 25 starts with heterozygosity 0.5. What is the expected heterozygosity after 10 generations?', answer: 0.4085, tol: 0.02, steps: ['$H_{10} = 0.5 \\times (1 - 1/50)^{10} = 0.5 \\times 0.98^{10} = 0.5 \\times 0.817 = 0.409$.'] },
    { q: 'Five males and 45 females breed each year. What is the effective population size?', answer: 18, tol: 0.02, steps: ['$N_e = 4 \\times 5 \\times 45/(5 + 45) = 900/50 = 18$.'] }
  ],
  applications: [
    'Run many populations side by side in [the drift simulator](#/tools/genetics/drift).','Conservation genetics: minimum population sizes and breeding plans that keep variation in endangered species.', 'Explaining why some inherited conditions are commoner in communities founded by few people.', 'The neutral theory and the molecular clock, which rest on the fixation of neutral mutations by drift.', 'Interpreting genome data: the pattern of variation records past bottlenecks and migrations.'],
  history: 'Sewall Wright and R. A. Fisher described drift mathematically around 1930 and disagreed for decades about how much it mattered. Motoo Kimura\'s neutral theory (1968) argued that most changes in DNA and proteins are fixed by drift, not selection — controversial then, now the starting point of molecular evolution. Kimura also gave the fixation-probability formula in 1962.',
  sim: ['ref-drift', 'evo-fixation', 'evo-bottleneck']
},

{
  id: 'gene-flow-mutation', parent: 'evolution-mechanisms', title: 'Gene flow and mutation', level: 2,
  short: 'Mutation is the ultimate source of new alleles: slow and steady, about 70 new changes in each human newborn. Gene flow — migrants and their genes moving between populations — spreads alleles and keeps populations alike, working against drift and local selection.',
  keywords: ['mutation rate', 'de novo mutation', 'gene flow', 'migration', 'island model', 'FST', 'fixation index', 'one migrant per generation', 'mutation–selection balance', 'introgression', 'local adaptation', 'human genetic variation', 'Luria–Delbrück', 'paternal age'],
  prereq: ['hardy-weinberg', 'genetic-drift', 'mutations'],
  related: ['natural-selection', 'speciation', 'molecular-clock', 'human-evolution', 'antibiotic-resistance', 'conservation-biology', 'dna-replication'],
  body: `
Selection and drift can only work with variation that already exists. Two processes supply and spread it: **mutation**, which creates new alleles, and **gene flow**, which moves alleles between populations.

### Mutation: rare per letter, common per genome
DNA replication with proofreading and repair makes about one error per $10^9$–$10^{10}$ bases copied ([[dna-replication]], [[mutations]]). Per generation in humans, the rate is about $1.2 \\times 10^{-8}$ per base, and since each child inherits two genomes of $3.1 \\times 10^9$ bases, every newborn carries roughly **60–80 new point mutations** that neither parent had. Most come from the father, and their number rises by one or two for each year of his age at conception.

| Organism | Mutation rate |
|---|---|
| RNA viruses (influenza, HIV) | $10^{-6}$–$10^{-4}$ per base per replication |
| *E. coli* | about $2 \\times 10^{-10}$ per base per replication (one new mutation per thousand genomes copied) |
| Humans | about $1.2 \\times 10^{-8}$ per base per generation |
| A human disease gene | $10^{-6}$–$10^{-4}$ new harmful alleles per generation |

On its own mutation changes allele frequencies very slowly — at $10^{-5}$ per generation it would take about 70 000 generations to halve an allele's frequency. What matters is the supply: the eight billion people alive today carry some 600 billion new mutations between them, so almost every possible single-letter change has occurred in someone now living. Mutations are random with respect to need: Salvador Luria and Max Delbrück showed in 1943 that virus-resistant bacteria arose before the virus was added, in "jackpots" that only chance could explain.

Most mutations are neutral or slightly harmful, a few are beneficial. Harmful recessive alleles persist at a **mutation–selection balance**: new copies arise at rate $\\mu$ and are removed when they meet in homozygotes, which settles at $\\hat{q} \\approx \\sqrt{\\mu/s}$ — about 0.3 % for a lethal recessive with $\\mu = 10^{-5}$. Because neutral mutations are fixed by drift at exactly the rate they arise, independent of population size, they tick like a clock ([[molecular-clock]]).

### Gene flow: the great homogeniser
Pollen blows for kilometres, young animals disperse, seeds travel with birds. When a fraction $m$ of a population's genes comes each generation from a source with frequency $\\bar{p}$, the population is pulled towards it:

$$p_t - \\bar{p} = (p_0 - \\bar{p})(1 - m)^t$$

Gene flow works against drift, which makes populations diverge. In Sewall Wright's island model they balance at a differentiation

$$F_{ST} \\approx \\frac{1}{1 + 4N_e m}$$

where $N_e m$ is the number of migrants per generation. The striking result: **one migrant per generation** ($F_{ST} = 0.2$) is enough to stop populations drifting far apart, whatever their size. Gene flow also carries good alleles between species: Tibetans owe a variant of the gene *EPAS1*, which helps at high altitude, to interbreeding with Denisovans ([[human-evolution]]).

Selection can hold populations apart despite gene flow when it is stronger than the migration rate. Grasses growing on the spoil heaps of old copper and zinc mines are metal-tolerant, while the same species a few metres away on ordinary pasture is not — tolerance costs growth where it is not needed.

### Human variation
Humans have moved and mixed throughout their history, so gene flow has kept us one species with little differentiation: $F_{ST}$ between continental populations is only about 0.1–0.15. Put another way, about **85–90 % of human genetic variation lies within any population**, and only a small part between them (Richard Lewontin first measured this in 1972). Variation changes gradually across geography rather than in blocks, so "races" are not discrete biological categories; two people from the same town can differ more than people from different continents.

> [!key] Mutation supplies new alleles, gene flow mixes them between populations, drift samples them at random and selection sorts them. Every change in allele frequency comes from one of these four forces (or from non-random mating shifting genotypes).
`,
  ideas: [
    'Mutation is rare per base (about 10⁻⁸ per generation in humans) but common per genome: about 70 new changes per newborn.',
    'Mutations arise at random with respect to need; most are neutral or harmful.',
    'Harmful recessive alleles persist at a mutation–selection balance, q ≈ √(μ/s).',
    'Gene flow makes populations alike; one migrant per generation keeps FST near 0.2.',
    'Most human genetic variation lies within populations, not between them.'
  ],
  pitfalls: [
    'Mutations happen when an organism needs them — The Luria–Delbrück experiment and replica plating showed that useful mutations arise before, and regardless of, the need; selection then favours them.',
    'Gene flow requires many migrants — A handful per generation is enough to keep populations from diverging by drift; the absolute number matters, not the fraction.',
    'Human populations are genetically distinct groups — Variation is mostly within populations and changes gradually over geography; the lines between "races" are social, not biological.'
  ],
  formulas: [
    {
      name: 'New mutations in each genome',
      expr: 'n = 2*G*mu', tex: 'n = 2\\,G\\,\\mu',
      vars: {
        n: { name: 'new point mutations in a diploid genome', q: 'count', tex: 'n' },
        G: { name: 'haploid genome size (base pairs)', q: 'count', value: 3.1e9, tex: 'G' },
        mu: { name: 'mutation rate per base per generation', value: 1.2e-8, tex: '\\mu' }
      },
      note: 'Two genome copies per diploid individual. Most of the new mutations fall outside genes and are neutral; about 1 % land in protein-coding sequence.',
      stories: {
        n: 'A genome of {G} base pairs mutates at {mu} per base per generation. How many new mutations does each diploid offspring carry?',
        mu: 'Sequencing parents and child finds {n} new mutations in a genome of {G} base pairs. What is the mutation rate per base per generation?'
      }
    },
    {
      name: 'Mutation–selection balance (recessive allele)',
      expr: 'q = sqrt(mu/s)', tex: '\\hat{q} = \\sqrt{\\dfrac{\\mu}{s}}',
      vars: {
        q: { name: 'equilibrium frequency of the harmful allele', min: 0, max: 1, tex: '\\hat{q}' },
        mu: { name: 'mutation rate to the allele per generation', value: 1e-5, tex: '\\mu' },
        s: { name: 'selection coefficient against the homozygote', value: 1, min: 0, max: 1, tex: 's' }
      },
      note: 'For a fully recessive allele in a large, randomly mating population. If heterozygotes suffer a small cost hs, the balance is much lower: q ≈ μ/(hs).',
      stories: {
        q: 'A lethal recessive allele (s = {s}) arises by mutation at {mu} per generation. At what frequency does it settle?',
        mu: 'A recessive allele with s = {s} is found at frequency {q}. What mutation rate would maintain it?'
      }
    },
    {
      name: 'Gene flow into an island',
      expr: 'pt = pm + (p0 - pm)*(1 - m)^t', tex: 'p_t = \\bar{p} + (p_0 - \\bar{p})\\,(1 - m)^{t}',
      vars: {
        pt: { name: 'allele frequency on the island after t generations', min: 0, max: 1, tex: 'p_t' },
        pm: { name: 'allele frequency in the migrants (mainland)', value: 0.6, min: 0, max: 1, tex: '\\bar{p}' },
        p0: { name: 'starting frequency on the island', value: 0.1, min: 0, max: 1, tex: 'p_0' },
        m: { name: 'fraction of genes from migrants each generation', value: 0.05, min: 0, max: 1, tex: 'm' },
        t: { name: 'number of generations', q: 'count', int: true, value: 20, tex: 't' }
      },
      note: 'One-way migration from a large source, no selection or drift. The difference from the source shrinks by a factor (1 − m) each generation.',
      practice: { unknowns: ['pt', 't', 'm'] },
      stories: {
        pt: 'An island population with p = {p0} receives {m} of its genes each generation from a mainland where p = {pm}. What is p after {t} generations?',
        t: 'How many generations does it take for gene flow at m = {m} to bring an island from p = {p0} to {pt}, if the mainland has {pm}?'
      }
    },
    {
      name: 'Differentiation with migration (island model)',
      expr: 'Fst = 1/(1 + 4*M)', tex: 'F_{ST} \\approx \\dfrac{1}{1 + 4M}',
      vars: {
        Fst: { name: 'fixation index, the share of variation between populations', min: 0, max: 1, tex: 'F_{ST}' },
        M: { name: 'migrants per generation, M = Ne·m', value: 1, tex: 'M' }
      },
      note: 'Equilibrium between drift (which raises FST) and migration (which lowers it) among many equal populations. Real populations are rarely so tidy, so read it as an order of magnitude.',
      stories: {
        Fst: 'Populations exchange about {M} migrants per generation. What FST do you expect?',
        M: 'Populations of a species show FST = {Fst}. How many migrants per generation does that suggest?'
      }
    }
  ],
  examples: [
    {
      title: 'How many new mutations did you inherit?',
      q: 'The human genome has $3.1 \\times 10^9$ base pairs and the mutation rate is about $1.2 \\times 10^{-8}$ per base per generation. How many new mutations does a newborn carry, and how many possible single-letter changes are there?',
      steps: [
        '$n = 2 \\times 3.1\\times10^9 \\times 1.2\\times10^{-8} = 74$ new point mutations.',
        'Possible single-letter changes: $3.1 \\times 10^9$ sites × 3 alternative bases ≈ $9 \\times 10^9$.',
        'Eight billion people carry some $6 \\times 10^{11}$ new mutations between them — so each possible change has arisen, on average, dozens of times in people alive today. Mutation supply is not the limit; selection and drift decide what becomes common.'
      ],
      a: 'About 70; every possible single-letter change is present many times over in the living population.'
    },
    {
      title: 'An island pulled towards the mainland',
      q: 'An island population has allele frequency 0.1. Each generation, 5 % of its genes come from the mainland, where the frequency is 0.6. What is the frequency after 20 generations?',
      steps: [
        '$(1 - m)^t = 0.95^{20} = 0.358$.',
        '$p_{20} = 0.6 + (0.1 - 0.6) \\times 0.358 = 0.6 - 0.179 = 0.42$.',
        'The gap to the mainland has closed by 64 % in 20 generations.'
      ],
      a: 'About 0.42.'
    },
    {
      title: 'One migrant per generation',
      q: 'Compare the equilibrium FST of populations exchanging 0.25, 1 and 10 migrants per generation.',
      steps: [
        '$M = 0.25$: $F_{ST} = 1/(1 + 1) = 0.5$ — strongly differentiated.',
        '$M = 1$: $F_{ST} = 1/5 = 0.2$.',
        '$M = 10$: $F_{ST} = 1/41 = 0.024$ — almost one gene pool.'
      ],
      a: 'FST = 0.5, 0.2 and 0.024: a single migrant per generation already keeps populations fairly alike.'
    }
  ],
  quiz: [
    { q: 'About how often does a given base in the human genome mutate per generation?', choices: ['10⁻³', '10⁻⁵', '10⁻⁸', '10⁻¹⁵'], a: 2, why: 'About 1.2 × 10⁻⁸ per base per generation — rare for any one letter, but some 70 new changes per genome.' },
    { q: 'Mutations arise more often when they would help the organism survive.', a: false, why: 'Mutations are random with respect to their usefulness; Luria and Delbrück showed that resistant bacteria arose before exposure to the virus.' },
    { q: 'In the island model, what FST do you expect with one migrant per generation?', answer: 0.2, why: 'FST = 1/(1 + 4 × 1) = 0.2.' },
    { q: 'Gene flow between two populations tends to…', choices: ['make them more different', 'make them more alike', 'increase drift', 'create new mutations'], a: 1, why: 'Migrants carry alleles from one population into the other, pulling their frequencies together; it counters drift and local selection.' },
    { q: 'Where is most human genetic variation found?', choices: ['between continents', 'between "races"', 'within populations', 'only in Africa'], a: 2, why: 'About 85–90 % of the variation is found within any population; differences between population averages are a small part. (Africa does hold the most variation, but most of it is still shared within populations.)' }
  ],
  problems: [
    { q: 'A lethal recessive allele arises by mutation at 4 × 10⁻⁶ per generation. At what frequency does it settle?', answer: 0.002, tol: 0.02, steps: ['$\\hat{q} = \\sqrt{\\mu/s} = \\sqrt{4\\times10^{-6}/1} = 0.002$.', 'Affected births: $q^2 = 4 \\times 10^{-6}$ — equal to the mutation rate, as it must be: each affected child removes two copies, and new ones arrive at rate 2μ per person.'] },
    { q: 'Five per cent of an island population\'s genes come each generation from a mainland with frequency 0.6. Starting at 0.1, what is the island frequency after 20 generations?', answer: 0.42, tol: 0.02, steps: ['$p_{20} = 0.6 - 0.5 \\times 0.95^{20} = 0.6 - 0.179 = 0.421$.'] }
  ],
  applications: ['Genetic rescue: bringing a few individuals into an inbred, isolated population (Florida panthers, 1995) restores variation.', 'Wildlife corridors that let animals, and their genes, move between reserves.', 'Estimating mutation rates from family sequencing, which calibrates the molecular clock and helps interpret new mutations found in children.', 'Following the spread of resistance genes between bacteria and between hospitals.'],
  history: 'Hugo de Vries coined "mutation" around 1901. Luria and Delbrück\'s fluctuation test (1943) and the Lederbergs\' replica plating (1952) settled that mutations are undirected. Sewall Wright developed the island model and F-statistics in the 1930s–1950s. Direct measurement of human mutation by sequencing parents and children began around 2010.'
},

{
  id: 'sexual-selection', parent: 'evolution-mechanisms', title: 'Sexual selection', level: 2,
  short: 'Selection for traits that win mates rather than help survival: ornaments the other sex chooses and weapons rivals fight with. It explains the peacock\'s train, the stag\'s antlers and why males and females of many species look so different.',
  keywords: ['sexual selection', 'mate choice', 'female choice', 'male–male competition', 'intrasexual selection', 'intersexual selection', 'sexual dimorphism', 'peacock', 'widowbird', 'runaway selection', 'Fisher', 'handicap principle', 'Zahavi', 'good genes', 'Bateman', 'anisogamy', 'parental investment', 'lek', 'sperm competition'],
  prereq: ['natural-selection', 'animal-reproduction'],
  related: ['communication', 'social-behaviour', 'coevolution', 'speciation', 'meiosis'],
  body: `
The peacock's train troubled Darwin: a metre and a half of feathers that is costly to grow, heavy to carry and conspicuous to predators cannot help its owner survive. He wrote to a friend that the sight of one made him feel sick. His answer, developed in *The Descent of Man* (1871), was a second kind of selection: **sexual selection**, the advantage some individuals have over others of the same sex in getting mates. A trait that shortens life can still spread if it more than makes up for it in offspring.

### Why the sexes differ
The root is **anisogamy**. Eggs are large and few — a human egg is about 0.1 mm across — while sperm are tiny and made by the million; in many species females also carry, feed and guard the young. A male's reproduction is then limited mainly by how many mates he gets, a female's by the resources she can turn into young. Angus Bateman found in 1948 that the number of offspring of male fruit flies varied far more than that of females and rose with each extra mate. Robert Trivers generalised it in 1972: the sex that invests more in each offspring becomes the choosy one, and the other competes for it. The test is the exceptions: in seahorses and pipefish the males carry the eggs in a brood pouch, and in some pipefish and in phalaropes and jacanas it is the females that are brighter, larger or more competitive.

### Two routes: weapons and ornaments

| Route | How it works | Examples |
|---|---|---|
| Competition within a sex | fights and displays between rivals favour size and weapons | antlers of red deer; bull elephant seals of up to 2 tonnes, three times the cows' weight |
| Choice by the other sex | the choosy sex prefers certain traits, which spread | peacock trains, long-tailed widowbirds, guppy colours, birdsong |
| After mating | sperm compete inside the female, who may bias fertilisation | large testes in species where females mate with several males |

Competition can be extreme: among northern elephant seals a small minority of bulls father most of the pups each season. Choice was tested directly by Malte Andersson in 1982: he shortened the half-metre tails of some male long-tailed widowbirds and glued the cut pieces onto others, lengthening them by about 25 cm. The males with extended tails attracted the most nesting females. Marion Petrie showed that peahens prefer males with more eyespots on their trains (they carry about 150), and that removing 20 eyespots reduced a male's success.

### Why prefer an ornament?
- **Direct benefits** — a mate with a better territory, food gifts or care.
- **Good genes and honest signals** — only a healthy male can afford an extravagant ornament, so it is an honest advertisement (Amotz Zahavi's **handicap principle**, 1975). Peahens mated to males with more elaborate trains raised chicks that grew faster and survived better; William Hamilton and Marlene Zuk proposed in 1982 that bright plumage signals resistance to parasites.
- **Runaway** — R. A. Fisher's argument: once females prefer long tails, their sons inherit long tails and their daughters the preference, the two become genetically linked, and the trait and the taste escalate together until natural selection's costs call a halt.
- **Sensory bias** — a preference that already existed for another reason, such as spotting food, can be exploited by a display.

### A balance of forces
In Trinidad, male guppies are brilliantly coloured in streams with few predators and drab where predatory fish are common; John Endler moved guppies to a predator-free stream and the males became more colourful within a few years — sexual selection pushing one way, predation the other. The strength of sexual selection can be measured as the **opportunity for selection**, $I_s = V/\\bar{m}^2$, the variance in mating success relative to its square mean: large in lekking birds and elephant seals, small in monogamous species.

> [!note] Field experiments on animals, like the widowbird and guppy studies, are now planned under ethical review and the **3Rs** — replace, reduce and refine — using as few animals as possible and the least intrusive methods.

> [!key] Sexual selection favours traits that bring mates, even at a cost to survival. The sex that invests less in each offspring usually competes; the one that invests more usually chooses.
`,
  ideas: [
    'Sexual selection arises from differences in mating success among individuals of the same sex.',
    'Anisogamy and unequal parental investment make one sex (usually females) choosy and the other competitive; role-reversed species confirm the rule.',
    'Competition within a sex favours weapons and size; choice by the other sex favours ornaments and displays.',
    'Preferences can be explained by direct benefits, good genes (honest handicaps), runaway and sensory bias.',
    'Sexual and natural selection often pull in opposite directions, and the trait settles where they balance.'
  ],
  pitfalls: [
    'Sexual selection is just part of survival of the fittest — It works through mating success, not survival, and often favours traits that shorten life.',
    'Males are always the showy sex — The rule follows investment, not sex: where males care for the young (seahorses, pipefish, phalaropes), females compete and may be the brighter sex.',
    'Ornaments mean females make conscious aesthetic judgements — Preference is any consistent bias in mating; it can be as simple as responding more to a longer tail or a louder call.'
  ],
  formulas: [
    {
      name: 'Opportunity for sexual selection',
      expr: 'Is = V/m^2', tex: 'I_s = \\dfrac{V}{\\bar{m}^2}',
      vars: {
        Is: { name: 'opportunity for sexual selection', tex: 'I_s' },
        V: { name: 'variance in the number of mates', value: 5.6, tex: 'V' },
        m: { name: 'mean number of mates', value: 1, tex: '\\bar{m}' }
      },
      note: 'The maximum possible strength of selection through mating success (the variance in relative success). It is zero when every individual mates equally often.',
      stories: {
        Is: 'Males in a lek have on average {m} mates with a variance of {V}. What is the opportunity for sexual selection?',
        V: 'A population in which the mean number of mates is {m} has I_s = {Is}. What is the variance in mating success?'
      }
    }
  ],
  examples: [
    {
      title: 'Measuring sexual selection at a lek',
      q: 'At a lek of 20 males and 20 females, each female mates once. Two males get 8 matings each, four get one each and fourteen none. Find the opportunity for sexual selection in males and in females.',
      steps: [
        'Males: mean $\\bar{m} = 20/20 = 1$. Mean of the squares: $(2 \\times 64 + 4 \\times 1)/20 = 6.6$, so $V = 6.6 - 1^2 = 5.6$.',
        '$I_s = 5.6/1^2 = 5.6$ for males.',
        'Females all mate exactly once: $V = 0$ and $I_s = 0$. All the potential for sexual selection is on the males.'
      ],
      a: 'I_s = 5.6 for males and 0 for females.'
    },
    {
      title: 'Designing the widowbird experiment',
      q: 'To test whether females prefer long tails, Andersson shortened some males\' tails and lengthened others. Why did he also cut and re-glue the tails of a third group, and leave a fourth untouched?',
      steps: [
        'Cutting and gluing might itself disturb a bird; the cut-and-re-glued group had the same handling but a normal tail length.',
        'The untouched group showed normal success without any handling.',
        'Only if the lengthened group beat both controls, and the shortened group did worse, can the difference be put down to tail length. That is what he found.'
      ],
      a: 'The two control groups separate the effect of tail length from the effect of handling.'
    },
    {
      title: 'Body size and mating systems',
      q: 'In gibbons, which pair for life, males and females are about the same size; male gorillas weigh about twice as much as females; bull elephant seals weigh about three times as much as cows. Explain the pattern.',
      steps: [
        'In a monogamous species each male gets about one mate, so the variance in male mating success — and the payoff for size — is small.',
        'Where one male can hold a harem, winning fights brings many mates, and selection for size and weapons is intense.',
        'The more polygynous the mating system, the larger the difference between the sexes.'
      ],
      a: 'Size dimorphism grows with the variance in male mating success, from monogamous gibbons to harem-holding elephant seals.'
    }
  ],
  quiz: [
    { q: 'In a species of pipefish the males carry the eggs in a pouch. Which sex would you expect to compete for mates and be more ornamented?', choices: ['males, as always', 'females', 'neither: both are equal', 'it cannot be predicted'], a: 1, why: 'Male pregnancy makes males the scarce, high-investment sex, so females compete for them — and in such species females are often the brighter sex.' },
    { q: 'According to the handicap principle, an ornament is a reliable signal of quality because…', choices: ['it is cheap to produce', 'only high-quality individuals can afford its cost', 'females cannot see low-quality males', 'it has no effect on survival'], a: 1, why: 'A costly ornament cannot be faked: a weak male that grew one would pay too high a price in survival, so the size of the ornament honestly reflects condition.' },
    { q: 'In Fisher\'s runaway process, the preference and the preferred trait become genetically associated and can escalate together.', a: true, why: 'Offspring of choosy females and ornamented males inherit both the preference and the trait, so the two spread together and reinforce each other.' },
    { q: 'Sexual selection always opposes natural selection.', a: false, why: 'Often it does (bright guppies are eaten more), but not always: if ornaments signal good genes, choosy females get fitter offspring, and the two forces align.' },
    { q: 'Ten males compete; one mates with all ten females and the rest not at all. What is the opportunity for sexual selection in males?', answer: 9, why: 'Mean = 1; mean of squares = 100/10 = 10; variance = 10 − 1 = 9; I_s = 9/1 = 9.' }
  ],
  problems: [
    { q: 'Five males have 4, 1, 0, 0 and 0 matings. What is the opportunity for sexual selection?', answer: 2.4, tol: 0.02, steps: ['Mean $= 5/5 = 1$.', 'Mean of squares $= (16 + 1)/5 = 3.4$; variance $= 3.4 - 1 = 2.4$.', '$I_s = 2.4/1^2 = 2.4$.'] }
  ],
  applications: ['Captive breeding: letting animals choose their mates often improves breeding success in conservation programmes.', 'The sterile insect technique, which works only if released sterile males compete successfully for mates.', 'Understanding bird song, colour and courtship, which are often the first signs of new species forming.', 'Sexual selection helps explain why sexual differences in lifespan and disease risk are found across many animals.'],
  history: 'Darwin introduced sexual selection in 1859 and developed it in 1871; for a century it was widely doubted, especially female choice. Fisher sketched the runaway process in 1915 and 1930, Bateman measured mating success in flies in 1948, and Trivers\'s parental investment theory (1972) and Andersson\'s widowbird experiment (1982) brought it back to the centre of evolutionary biology.'
},

{
  id: 'coevolution', parent: 'evolution-mechanisms', title: 'Coevolution', level: 2,
  short: 'When two species are each a strong selective force on the other, each evolves in response to the other: predators and prey in arms races, parasites and hosts in endless cycles, flowers and pollinators fitted to each other like lock and key.',
  keywords: ['coevolution', 'arms race', 'Red Queen', 'host–parasite', 'predator–prey', 'mutualism', 'pollination', 'Darwin\'s orchid', 'Xanthopan', 'Angraecum', 'rough-skinned newt', 'tetrodotoxin', 'garter snake', 'myxomatosis', 'frequency-dependent selection', 'figs and fig wasps', 'geographic mosaic'],
  prereq: ['natural-selection', 'predator-prey'],
  related: ['sexual-selection', 'speciation', 'flowering-reproduction', 'antibiotic-resistance', 'mitochondria-chloroplasts', 'medicine:hiv', 'medicine:influenza-covid'],
  body: `
Most of an organism's environment is other organisms. When species A is a strong selective force on species B *and* B on A, each change in one selects for a change in the other: **coevolution**. Paul Ehrlich and Peter Raven named it in 1964, after noticing that each family of butterflies feeds on a few plant families whose chemical defences it has learned to overcome.

### Arms races
Rough-skinned newts of western North America carry tetrodotoxin in their skin, the nerve poison of pufferfish, in amounts that would kill almost any predator many times over. Almost — common garter snakes in the same areas have evolved changes in their sodium channels, the very proteins the toxin blocks, and eat the newts. Edmund Brodie and his colleagues found that where the snakes are most resistant, the newts are most toxic, and where there are no resistant snakes, the newts carry little toxin. Resistance has a price: highly resistant snakes crawl more slowly, and after eating a toxic newt they may lie paralysed for hours. The race runs at different speeds in different places — a **geographic mosaic** of hot spots and cold spots.

### The Red Queen
In 1973 Leigh Van Valen noticed that in many groups of fossil animals the chance of a genus going extinct did not fall with its age: old genera were no safer than young ones. He explained it with the Red Queen of *Through the Looking-Glass*, who has to run as fast as she can to stay in the same place. Every species' competitors, predators and parasites keep evolving, so its environment keeps getting worse, and it must keep evolving just to hold its ground. If extinction risk is constant, survival falls exponentially, $S = e^{-t/\\tau}$.

Hosts and parasites run the fastest Red Queen races, because parasites have short generations and huge numbers. Parasites adapt to the commonest host genotypes, so rare host genotypes are favoured, become common and are then attacked in turn: **frequency-dependent selection** that keeps genetic variation cycling rather than settling. This may be why sex exists: recombination makes offspring different from their parents, a moving target. In New Zealand freshwater snails, sexual reproduction is commoner where parasitic flukes are abundant, as the idea predicts.

A natural experiment began in 1950, when the myxoma virus was released in Australia to control rabbits. It first killed over 99 % of infected rabbits; within a few years the commonest strains killed fewer — about 70–95 % — because rabbits that lived longer with open sores passed on more virus through biting insects, and the rabbits themselves evolved resistance. Neither side "won"; both changed.

### Partners
Coevolution also builds partnerships. The Madagascar star orchid hides its nectar at the bottom of a spur about 30 cm long. In 1862 Darwin predicted that a moth with a tongue long enough to reach it must exist; in 1903 a hawkmoth with a tongue of about 25 cm was described and named *praedicta*, and in the 1990s it was photographed visiting the orchid. About 750 species of figs are each pollinated by their own tiny wasps, which breed only inside the figs — a partnership some 75 million years old. Mitochondria and chloroplasts began as bacteria living inside other cells: coevolution so complete that the partners became one ([[mitochondria-chloroplasts]]).

| Interaction | Example | Typical outcome |
|---|---|---|
| Predator–prey | garter snakes and toxic newts | escalating arms race |
| Host–parasite | rabbits and myxoma; people and influenza | cycles, rising resistance, evolving virulence |
| Mutualism | figs and fig wasps; orchids and hawkmoths | matched traits, specialisation |
| Brood parasitism | cuckoos and reed warblers | egg mimicry against egg rejection |

> [!key] Coevolution needs reciprocal change: each species evolves in response to the other. An organism adapting to cold, or to a predator that is not itself changing in response, is adaptation, not coevolution.

Our own species is in such races too: influenza changes its surface proteins every season, so vaccines are updated every year ([[medicine:influenza-covid]]), and HIV evolves inside each infected person faster than any other known system ([[medicine:hiv]]).
`,
  ideas: [
    'Coevolution is reciprocal evolutionary change in interacting species.',
    'Predator and prey, or toxin and resistance, can escalate in an arms race, with costs that stop it somewhere.',
    'The Red Queen: species must keep evolving just to keep up with enemies that are evolving too; extinction risk does not fall with age.',
    'Host–parasite coevolution favours rare host genotypes and keeps variation cycling; it may explain the existence of sex.',
    'Mutualisms such as pollination and figs and fig wasps can make partners exquisitely matched and dependent.'
  ],
  pitfalls: [
    'Any adaptation to another species is coevolution — Only reciprocal change counts; a moth adapting to soot, or a prey species adapting to a predator that does not respond, is ordinary adaptation.',
    'Parasites always evolve to be harmless — Virulence evolves to whatever maximises transmission; that is often intermediate, sometimes high.',
    'An arms race ends with one side winning — Usually both keep changing, costs limit escalation, and the balance differs from place to place.'
  ],
  formulas: [
    {
      name: 'Survival of lineages with a constant extinction risk',
      expr: 'S = exp(-t/tau)', tex: 'S = e^{-t/\\tau}',
      vars: {
        S: { name: 'fraction of lineages still surviving', q: 'ratio', unit: '%', tex: 'S' },
        t: { name: 'time since the lineages appeared', q: 'time', unit: 'Myr', value: 30, tex: 't' },
        tau: { name: 'mean lifetime of a lineage (1 / extinction rate)', q: 'time', unit: 'Myr', value: 15, tex: '\\tau' }
      },
      note: 'Van Valen\'s "law of constant extinction": if old lineages are no safer than young ones, survivorship is exponential, like radioactive decay; the half-life is τ ln 2.',
      stories: {
        S: 'Genera in a group last {tau} on average, and their extinction risk does not change with age. What fraction survives {t}?',
        tau: 'Of the genera that appeared together, {S} are still alive after {t}. What is their mean lifetime?'
      }
    }
  ],
  examples: [
    {
      title: 'Darwin\'s prediction',
      q: 'The spur of the Madagascar star orchid is about 30 cm long, with nectar only in its lowest 4 cm or so. What did Darwin infer, and why must the moth\'s tongue be long but not much longer than the spur?',
      steps: [
        'To reach the nectar, a visitor needs a tongue of at least about 25 cm.',
        'The flower is pollinated only if the moth has to push its head against the flower to drain the spur, picking up pollen. An orchid with a spur longer than the local tongues is pollinated more often, so spurs get longer — and moths with longer tongues get more nectar, so tongues get longer too.',
        'Darwin predicted such a moth in 1862; it was found in 1903 with a tongue of about 25 cm.'
      ],
      a: 'A hawkmoth with a tongue of about 25 cm — found 41 years later; spur and tongue escalate together.'
    },
    {
      title: 'Running to stay in place',
      q: 'The genera of a group of marine animals last 15 million years on average, and their risk of extinction does not change with age. What fraction of genera that appeared together are still alive after 30 million years, and what is their half-life?',
      steps: [
        '$S = e^{-30/15} = e^{-2} = 0.135$ — about 13.5 %.',
        'Half-life: $\\tau \\ln 2 = 15 \\times 0.693 = 10.4$ million years.',
        'A genus that has already survived 30 million years still has the same 10.4-million-year half-life ahead of it: age brings no safety.'
      ],
      a: 'About 13.5 % survive; the half-life is about 10 million years at any age.'
    },
    {
      title: 'Why myxoma became milder',
      q: 'Myxoma virus spreads between rabbits through biting mosquitoes and fleas, which pick it up from skin lesions of living rabbits. The first strains killed rabbits in about 10 days; milder strains let them live for weeks. Which spread better, and why did virulence not fall to zero?',
      steps: [
        'A rabbit that lives for weeks with infectious lesions is bitten many more times than one that dies within days, so milder strains were transmitted more.',
        'But a strain too mild produces few lesions and little virus, and the rabbit may recover quickly, so it too is transmitted less.',
        'Selection therefore favours an intermediate virulence that maximises transmission — and rabbits meanwhile evolved resistance, shifting the balance again.'
      ],
      a: 'Intermediate strains spread best: virulence evolves towards maximum transmission, not towards harmlessness.'
    }
  ],
  quiz: [
    { q: 'Which is the clearest example of coevolution?', choices: ['finch beaks changing after a drought', 'garter snake resistance and newt toxicity escalating together', 'moths darkening on sooty bark', 'bacteria evolving resistance to a new antibiotic'], a: 1, why: 'Only the newts and snakes each evolve in response to the other. Droughts, soot and antibiotics do not evolve back.' },
    { q: 'According to the Red Queen hypothesis, older genera are less likely to go extinct than younger ones.', a: false, why: 'Van Valen found the opposite of that expectation: extinction risk is roughly constant with age, because the environment — other evolving species — keeps deteriorating.' },
    { q: 'In a host population attacked by parasites that adapt to the commonest host genotype, which host genotypes are favoured?', choices: ['the commonest', 'rare ones', 'all equally', 'only the oldest'], a: 1, why: 'Parasites track the common types, so rare genotypes escape — until they in turn become common. This negative frequency-dependent selection makes frequencies cycle.' },
    { q: 'If extinction risk is constant with a mean lifetime of 15 Myr, what percentage of lineages survive 30 Myr?', answer: 13.5, unit: '%', why: 'S = e^(−30/15) = e^(−2) = 0.135.' },
    { q: 'Over its first years in Australia, the myxoma virus evolved to kill…', choices: ['more of the rabbits it infected', 'fewer of the rabbits it infected', 'no rabbits at all', 'only young rabbits'], a: 1, why: 'Case fatality fell from over 99 % to about 70–95 %, because rabbits that survived longer transmitted more virus; resistance in rabbits rose as well.' }
  ],
  problems: [
    { q: 'Genera in a group have a constant extinction risk and a half-life of 7 million years. What is their mean lifetime τ?', answer: 10.1, unit: 'Myr', tol: 0.02, steps: ['$t_{1/2} = \\tau \\ln 2$, so $\\tau = 7/0.693 = 10.1$ million years.'] }
  ],
  applications: ['Designing vaccines and antivirals for fast-evolving viruses, which coevolve with our immune systems.', 'Biological control of pests, where predator, parasite and host will evolve in response to each other.', 'Conserving specialised pollinators and the plants that depend on them.', 'Crop breeding for disease resistance, which pathogens repeatedly overcome — a Red Queen race in agriculture.'],
  history: 'Darwin described flowers and insects shaping each other in 1862. Ehrlich and Raven coined "coevolution" in 1964; Van Valen proposed the Red Queen in 1973; Frank Fenner documented the coevolution of myxoma and rabbits from the 1950s, one of the best-recorded cases of evolution in real time. John Thompson\'s geographic mosaic theory (2005) described how coevolution varies across landscapes.',
  sim: 'evo-redqueen'
},

/* ================================================================ SPECIES AND THE HISTORY OF LIFE */
{
  id: 'speciation', parent: 'history-of-life', title: 'Speciation', level: 2,
  short: 'New species form when populations stop exchanging genes — usually after geography separates them (allopatric speciation), sometimes within one area through ecological divergence or, in plants, doubling of the chromosomes. Reproductive barriers are the mark of a new species.',
  keywords: ['speciation', 'species', 'biological species concept', 'reproductive isolation', 'prezygotic barrier', 'postzygotic barrier', 'allopatric speciation', 'sympatric speciation', 'peripatric', 'polyploidy', 'ring species', 'hybrid zone', 'hybrid sterility', 'mule', 'Dobzhansky–Muller', 'adaptive radiation', 'cichlids', 'apple maggot fly', 'Haldane\'s rule'],
  prereq: ['natural-selection', 'genetic-drift', 'gene-flow-mutation'],
  related: ['phylogenetics', 'taxonomy', 'karyotypes', 'meiosis', 'sexual-selection', 'biodiversity', 'plant-diversity'],
  body: `
About two million species have been named, and estimates of the total run to around nine million eukaryotes, besides uncounted microbes. All of them arose by the splitting of earlier species. The key is gene flow: as long as two populations interbreed, their gene pools stay mixed ([[gene-flow-mutation]]); once they stop, mutation, selection and drift make them diverge.

### What is a species?
Ernst Mayr's **biological species concept** (1942) defines species as groups of interbreeding natural populations that are reproductively isolated from other such groups. It fits most animals, but not organisms that reproduce asexually, nor fossils, so biologists also use morphological and phylogenetic definitions (the smallest group sharing a common ancestor and diagnosable features). The boundaries are fuzzy by nature, because speciation is a process, not an event.

### Reproductive barriers

| Barrier | When it acts | Example |
|---|---|---|
| Habitat | before mating | two populations using different host plants |
| Temporal | before mating | species breeding in different seasons or times of day |
| Behavioural | before mating | courtship songs and colours the other species ignores |
| Mechanical and gametic | before fertilisation | genitalia or flower shapes that do not fit; sperm and egg proteins that do not match |
| Hybrid inviability and sterility | after fertilisation | a mule: horse (64 chromosomes) × donkey (62) gives 63, which cannot pair at meiosis |
| Hybrid breakdown | later generations | hybrids fertile, their offspring weak or sterile |

Postzygotic barriers often arise from **Dobzhansky–Muller incompatibilities**: a new allele at one gene works in its own population but clashes with a new allele at another gene that arose in the other population. Because every new difference can clash with every earlier one, incompatibilities accumulate faster than the differences themselves — a "snowball". In hybrids between two species, the sex with two different sex chromosomes (males in mammals, females in birds) is usually the one that is sterile or absent (Haldane's rule, 1922).

### Allopatric speciation
Most species arise when a barrier splits a population — a mountain range, a river, rising sea — or when a few colonists reach an island. When the Isthmus of Panama closed about 3 million years ago it split marine animals into Caribbean and Pacific populations; pairs of snapping shrimp species on either side now mate far less readily with each other than with their own kind. Islands are speciation factories: Hawaii has about a thousand species of fruit flies, and the Galápagos about 18 species of Darwin's finches, which arose within one or two million years.

### Sympatric speciation
Speciation without geographic separation is harder, because gene flow keeps mixing the population, but it happens:

- **Polyploidy.** An error in meiosis can double the chromosome number; the new tetraploid is fertile with its own kind but not with its parents. Chromosome doubling is involved in about one in seven speciation events of flowering plants; bread wheat has six sets. Two new goatsbeard species (*Tragopogon*) arose this way in the north-western USA in the twentieth century.
- **Host shifts.** Apple maggot flies began laying in apples, introduced to North America, in the 1860s; they now mate on apples, which ripen weeks earlier than their native hawthorns, so the two races are partly isolated in time.
- **Sexual selection.** About 500 species of cichlid fish evolved in Lake Victoria, which was almost dry some 15 000 years ago; females choose males by colour. Where pollution has made the water murky, females can no longer tell colours apart and species are merging again.

### Ring species
Greenish warblers form a ring around the Tibetan Plateau: neighbouring populations interbreed all the way round, yet where the two ends meet in Siberia they sing different songs and do not interbreed. *Ensatina* salamanders do the same around California's Central Valley. A ring species shows in space the stages of speciation that normally happen over time.

> [!key] Speciation is the evolution of reproductive isolation. It usually starts with a geographic split, proceeds by selection, drift and sexual selection in each part, and takes from thousands to millions of years.
`,
  ideas: [
    'Biological species are groups of interbreeding populations reproductively isolated from others.',
    'Barriers act before mating (habitat, timing, behaviour, mechanics, gametes) or after it (hybrid inviability, sterility, breakdown).',
    'Most speciation is allopatric: geography stops gene flow and the parts diverge.',
    'Sympatric speciation happens through polyploidy, host shifts and strong sexual selection.',
    'Incompatibilities snowball, and ring species and hybrid zones show speciation in progress.'
  ],
  pitfalls: [
    'If two animals can produce offspring they are the same species — Horses and donkeys produce mules, but the mules are sterile and the gene pools stay separate; lions and tigers can hybridise in captivity but not in the wild.',
    'A new species appears when one individual is born different — Speciation happens in populations over many generations; only polyploidy in plants can create a new species in one step.',
    'Speciation has never been observed — New polyploid plant species have arisen in historical times, and every stage of the process is visible in living hybrid zones and ring species.'
  ],
  formulas: [
    {
      name: 'Growth of a lineage by speciation',
      expr: 'N = N0*exp(r*t)', tex: 'N = N_0\\,e^{r t}',
      vars: {
        N: { name: 'number of species', q: 'count', tex: 'N' },
        N0: { name: 'starting number of species', q: 'count', int: true, value: 1, tex: 'N_0' },
        r: { name: 'net diversification rate (speciation minus extinction)', q: false, unit: '1/Myr', value: 0.68, tex: 'r' },
        t: { name: 'time', q: false, unit: 'Myr', value: 5, tex: 't' }
      },
      note: 'A pure-birth model with a constant net rate; real radiations often start fast and slow down. Most groups diversify at a few tenths per million years or less.',
      stories: {
        r: 'A single colonist gave rise to {N} species in {t}. What was the net diversification rate?',
        t: 'How long does a lineage diversifying at {r} take to grow from {N0} to {N} species?'
      }
    },
    {
      name: 'The snowball of incompatibilities',
      expr: 'I = k*K*(K - 1)/2', tex: 'I = p\\,\\dfrac{K\\,(K - 1)}{2}',
      vars: {
        I: { name: 'expected number of hybrid incompatibilities', tex: 'I' },
        k: { name: 'chance that a given pair of new alleles is incompatible', value: 0.001, min: 0, max: 1, tex: 'p' },
        K: { name: 'number of differences (substitutions) between the species', q: 'count', int: true, value: 100, tex: 'K' }
      },
      note: 'Orr\'s model (1995): each of the K(K − 1)/2 pairs of new alleles has a small chance of clashing, so incompatibilities grow with the square of the divergence.',
      stories: {
        I: 'Two species differ by {K} substitutions, and any pair clashes with probability {k}. How many incompatibilities do you expect?',
        K: 'How many differences must accumulate before {I} incompatibilities are expected, if each pair clashes with probability {k}?'
      }
    }
  ],
  examples: [
    {
      title: 'Why mules are sterile',
      q: 'A horse has 64 chromosomes and a donkey 62. How many does a mule have, and why can it not make normal eggs or sperm?',
      steps: [
        'Each parent gives half its set: $32 + 31 = 63$ chromosomes.',
        'At meiosis chromosomes must pair with a partner of the same kind. The horse and donkey sets differ in number and arrangement, so many chromosomes find no proper partner.',
        'Unpaired chromosomes are shared out unevenly, gametes get unbalanced sets, and almost all fail.'
      ],
      a: '63 chromosomes, which cannot pair properly at meiosis — a postzygotic barrier.'
    },
    {
      title: 'The silversword radiation',
      q: 'The Hawaiian silverswords, about 30 species, descend from a single colonist that arrived about 5 million years ago. Estimate their net diversification rate.',
      steps: [
        '$r = \\ln(N/N_0)/t = \\ln 30/5 = 3.40/5 = 0.68$ per million years.',
        'That is several times the typical rate for flowering plants: islands with empty niches fuel fast radiations.'
      ],
      a: 'About 0.7 new species per species per million years.'
    },
    {
      title: 'The snowball',
      q: 'If any pair of new alleles has a 1-in-1000 chance of being incompatible, how many incompatibilities are expected after 100 and after 200 substitutions?',
      steps: [
        '$K = 100$: $0.001 \\times 100 \\times 99/2 = 4.95$.',
        '$K = 200$: $0.001 \\times 200 \\times 199/2 = 19.9$.',
        'Doubling the divergence quadruples the incompatibilities — isolation, once started, accelerates.'
      ],
      a: 'About 5 and about 20.'
    }
  ],
  quiz: [
    { q: 'Which of these is a prezygotic barrier?', choices: ['hybrids die as embryos', 'hybrids are sterile', 'the two species breed in different months', 'hybrids\' offspring are weak'], a: 2, why: 'Breeding at different times prevents mating in the first place (temporal isolation). The others act after a hybrid zygote has formed.' },
    { q: 'Horses and donkeys can produce offspring, so they belong to the same biological species.', a: false, why: 'Their offspring, mules, are sterile, so no genes flow between the two gene pools: they are separate species.' },
    { q: 'A ring species such as the greenish warbler shows…', choices: ['that species never change', 'the stages of speciation laid out in space', 'sympatric speciation by polyploidy', 'that hybrids are always fertile'], a: 1, why: 'Neighbouring populations interbreed, but the two ends of the chain behave as distinct species: a snapshot of gradual divergence.' },
    { q: 'In plants, chromosome doubling can create a reproductively isolated new species in a single generation.', a: true, why: 'A tetraploid crossed with its diploid parent gives triploid offspring that are largely sterile, so the new form breeds only with its own kind at once.' },
    { q: 'Two species differ by 100 substitutions, and each pair of new alleles is incompatible with probability 0.001. How many incompatibilities are expected?', answer: 4.95, why: 'I = 0.001 × 100 × 99/2 = 4.95.' }
  ],
  problems: [
    { q: 'A group of lake fishes grew from 2 species to 500 in 10 million years. What was its net diversification rate, per million years?', answer: 0.552, tol: 0.02, steps: ['$r = \\ln(500/2)/10 = \\ln 250/10 = 5.52/10 = 0.552$ per million years.'] }
  ],
  applications: ['Conservation: deciding which populations are distinct enough to be protected as separate species or units.', 'Plant breeding: many crops (wheat, cotton, strawberries, potatoes) are polyploids, and new ones are made deliberately.', 'Understanding how pests and pathogens form new host races that attack new crops.', 'Biodiversity estimates, which depend on how species are defined.'],
  history: 'Darwin\'s book was about the origin of species, but he said little about how barriers arise. Theodosius Dobzhansky (1937) and Ernst Mayr (1942) put reproductive isolation at the centre; Hermann Muller described incompatibilities in 1942; Niles Eldredge and Stephen Jay Gould proposed punctuated equilibrium in 1972. Genomics now finds "islands" of divergence between populations that still exchange genes elsewhere.'
},

{
  id: 'phylogenetics', parent: 'history-of-life', title: 'Phylogenetic trees', level: 2,
  short: 'A phylogenetic tree is a hypothesis of who shares a more recent common ancestor with whom. Read it by its branching points, not by the order of the names along the tips: turning a branch around its node changes nothing.',
  keywords: ['phylogenetic tree', 'phylogeny', 'cladogram', 'tree thinking', 'clade', 'node', 'sister group', 'most recent common ancestor', 'monophyletic', 'paraphyletic', 'polyphyletic', 'outgroup', 'root', 'synapomorphy', 'homoplasy', 'parsimony', 'maximum likelihood', 'bootstrap'],
  prereq: ['evidence-evolution', 'speciation', 'taxonomy'],
  related: ['molecular-clock', 'bioinformatics', 'three-domains', 'human-evolution', 'vertebrates', 'dna-sequencing', 'medicine:hiv'],
  body: `
A phylogenetic tree draws the family history of a group. Its **tips** are living species (or genes, or fossils); its **branches** are lineages through time; each **node** where branches split is a common ancestor, the point where one species became two; the **root** is the ancestor of everything on the tree. A **clade** is an ancestor with all its descendants — everything you can cut off the tree with one snip.

### Reading a tree correctly
Relatedness is measured by how recently two species share an ancestor: follow both tips back to the node where their lineages meet. The more recent that node, the closer the relatives. Two species whose lineages meet at a node with no other branch between are **sister groups**.

The tree is like a hanging mobile: each node can be spun, swapping its two branches, and the relationships are unchanged. So the **order of the names along the tips means nothing**, and neither does which branch is drawn on top. The commonest misreadings follow from forgetting this:

- *Reading along the tips.* On a tree drawn with the frog next to the tuna, it is tempting to call them close. But the frog shares a more recent ancestor with humans (the first four-legged animals, about 350 million years ago) than with the tuna (the first bony fish, about 430 million years ago).
- *Seeing a ladder of progress.* The species drawn at the end is not "most advanced"; every living species has evolved for exactly the same time since the root.
- *Counting nodes.* The number of nodes between two tips depends on how many other species happen to be included, not on how related the two are.
- *Taking living species for ancestors.* Chimpanzees are our cousins, not our ancestors; ancestors sit at the nodes, and are extinct.

A crocodile is more closely related to a bird than to a lizard: crocodiles and birds (archosaurs) share an ancestor about 245 million years ago, and their common ancestor with lizards lived about 280 million years ago. Birds are living dinosaurs.

### Natural groups
A **monophyletic** group (a clade) contains an ancestor and all of its descendants: mammals, birds, flowering plants. A **paraphyletic** group leaves some descendants out: "reptiles" without birds, "fish" without the four-legged animals that evolved from them — in the tree's terms, we are lobe-finned fish. A **polyphyletic** group gathers species from different branches because of a similarity that evolved separately: "warm-blooded animals" joins birds and mammals. Modern classification ([[taxonomy]]) names only clades.

### Building trees
Trees are inferred from **shared derived characters** (synapomorphies): hair and milk mark the mammals, feathers the birds. A shared *ancestral* character, such as a backbone within the vertebrates, says nothing about groupings inside. Similarity from convergence (**homoplasy**) — the wings of bats and birds, the four-chambered hearts of birds and mammals — can mislead, which is why many characters are used. Today most trees come from DNA sequences, by **parsimony** (the tree needing the fewest changes), **distance** methods, or **maximum likelihood** and **Bayesian** methods with models of how sequences change; **bootstrap** values say how strongly the data support each node.

The number of possible trees explodes with the number of species: 3 rooted trees for 3 species, 105 for 5, 34 million for 10, $8 \\times 10^{21}$ for 20. Checking them all is impossible, so programs search cleverly.

### What trees are for
Trees traced HIV to a chimpanzee virus that crossed into people in west-central Africa in the early twentieth century ([[medicine:hiv]]), and have been used in court to show who infected whom. They track the variants of influenza and coronaviruses, identify the closest living relatives of whales (hippos), and, from ribosomal RNA, revealed the three domains of life ([[three-domains]]). With a [[molecular-clock]] their branches become a timescale.

> [!warn] Adjacent on the page does not mean closest relatives. Read a tree by its nodes: find where the lineages of two species join; the more recent that join, the closer they are.
`,
  ideas: [
    'Tips are taxa, nodes are common ancestors, branches are lineages, the root is the oldest ancestor.',
    'Relatedness is set by the most recent common ancestor; rotating branches about a node changes nothing.',
    'Order of tips, top or bottom, and number of nodes between tips carry no meaning.',
    'Clades (monophyletic groups) contain an ancestor and all its descendants; "reptiles" without birds is paraphyletic.',
    'Trees are built from shared derived characters, today mostly DNA, by parsimony, likelihood and Bayesian methods.'
  ],
  pitfalls: [
    'Species next to each other on the page are the closest relatives — The order of tips is arbitrary; closeness is read from the node where two lineages join.',
    'The species at the end of the tree is the most evolved — All living species have evolved for the same time since their common ancestor; a tree is not a ladder.',
    'Living species on the tree are the ancestors of the others — Ancestors sit at the nodes and are usually extinct; living species are all cousins.'
  ],
  formulas: [
    {
      name: 'Number of possible rooted trees',
      expr: 'T = fact(2*n - 3)/(2^(n - 2)*fact(n - 2))', tex: 'T_n = \\dfrac{(2n - 3)!}{2^{\\,n-2}\\,(n - 2)!}',
      vars: {
        T: { name: 'number of distinct rooted, bifurcating trees', q: 'count', tex: 'T_n' },
        n: { name: 'number of species (tips)', q: 'count', int: true, value: 10, min: 2, max: 150, tex: 'n' }
      },
      note: 'The product 1 × 3 × 5 × … × (2n − 3). For unrooted trees replace n by n − 1. The count explodes, which is why tree-building programs search rather than try every tree.',
      practice: { unknowns: ['T'] },
      stories: { T: 'How many different rooted trees could relate {n} species?' }
    }
  ],
  examples: [
    {
      title: 'Reading a vertebrate tree',
      q: 'A tree groups (mouse, human), (crocodile, bird), then lizard with the crocodile–bird pair, then the mammals with the reptiles, then frog, tuna and shark in turn. It happens to be drawn with the frog next to the tuna. Is the frog closer to the tuna or to the human? Is the crocodile closer to the lizard or to the bird?',
      steps: [
        'Frog and human: their lineages join at the node of the four-legged animals (tetrapods, about 350 million years ago).',
        'Frog and tuna: they join only at the older node of the bony vertebrates (about 430 million years ago). So the frog is closer to the human, wherever it is drawn.',
        'Crocodile and bird join at the archosaur node (about 245 million years ago); the lizard joins them further back (about 280). The crocodile is closer to the bird.'
      ],
      a: 'The frog is closer to the human, and the crocodile to the bird — read the nodes, not the page order.'
    },
    {
      title: 'Too many trees to check',
      q: 'How many rooted trees are there for 5, 10 and 20 species? If a computer could score a billion trees a second, how long would it take to check all trees for 20 species?',
      steps: [
        '5 species: $1 \\times 3 \\times 5 \\times 7 = 105$. 10 species: $17!! = 34\\,459\\,425$.',
        '20 species: $37!! \\approx 8.2 \\times 10^{21}$.',
        'At $10^9$ per second: $8.2\\times10^{12}$ s, about 260 000 years. Hence heuristic searches.'
      ],
      a: '105, about 34 million and about 8 × 10²¹ — the last would take some 260 000 years to check exhaustively.'
    },
    {
      title: 'Are "fish" a natural group?',
      q: 'Sharks, tuna and coelacanths are called fish; frogs, lizards and humans are not. The coelacanth is more closely related to four-legged animals than to the tuna. Is "fish" monophyletic?',
      steps: [
        'The smallest clade containing shark, tuna and coelacanth is the jawed vertebrates — which also contains every four-legged animal.',
        'Calling only the water-dwellers "fish" leaves out descendants of their common ancestor, so "fish" is paraphyletic.',
        'Cladistically, tetrapods (including us) are a branch of the lobe-finned fish.'
      ],
      a: 'No — "fish" is paraphyletic unless it includes the tetrapods.'
    }
  ],
  quiz: [
    { q: 'Swapping the two branches at a node of a tree changes the relationships it shows.', a: false, why: 'Rotating about a node is like spinning part of a mobile: every species keeps the same common ancestors, so the tree is the same.' },
    { q: 'Is a crocodile more closely related to a lizard or to a bird?', choices: ['a lizard', 'a bird', 'equally to both', 'to neither'], a: 1, why: 'Crocodiles and birds share a more recent common ancestor (the archosaurs) than either does with lizards.' },
    { q: 'Which of these groups is paraphyletic?', choices: ['mammals', 'birds', '"reptiles" without birds', 'flowering plants'], a: 2, why: 'Birds descend from the common ancestor of reptiles, so "reptiles" that exclude birds leave out part of a clade.' },
    { q: 'How many rooted trees are possible for 6 species?', answer: 945, why: '1 × 3 × 5 × 7 × 9 = 945.' },
    { q: 'A tree is drawn with the frog next to the tuna and the human at the far end. What can you conclude?', choices: ['the frog is closest to the tuna', 'the human is the most advanced species', 'nothing from the order: find where the lineages join', 'the tuna is the frog\'s ancestor'], a: 2, why: 'Tip order and position are arbitrary; only the branching points carry information.' }
  ],
  problems: [
    { q: 'How many different rooted trees could relate 8 species?', answer: 135135, tol: 0.001, steps: ['$1 \\times 3 \\times 5 \\times 7 \\times 9 \\times 11 \\times 13 = 135\\,135$.'] }
  ],
  applications: ['Tracing the origin and spread of epidemics (HIV, influenza, coronaviruses) and outbreaks in hospitals.', 'Forensic cases of disease transmission, and identifying the source of food-borne infections.', 'Classifying organisms by descent and predicting the properties of poorly known species from their relatives.', 'Choosing wild relatives of crops as sources of resistance genes.'],
  history: 'Darwin\'s only figure in the *Origin* was a branching tree, and a notebook sketch of 1837 is headed "I think". Willi Hennig founded cladistics in 1950; computational methods followed from the 1960s (Felsenstein\'s likelihood method in 1981). Carl Woese\'s ribosomal RNA tree of 1977 revealed the archaea.',
  sim: 'evo-tree'
},

{
  id: 'molecular-clock', parent: 'history-of-life', title: 'Molecular clocks', level: 3,
  short: 'Neutral mutations accumulate at a roughly steady rate, so the number of differences between two species\' DNA measures the time since they shared an ancestor — once the clock has been calibrated with fossils or dated events.',
  keywords: ['molecular clock', 'substitution rate', 'neutral theory', 'calibration', 'divergence time', 'genetic distance', 'Jukes–Cantor', 'saturation', 'multiple hits', 'relaxed clock', 'generation-time effect', 'human–chimpanzee divergence', 'mitochondrial DNA', 'Zuckerkandl and Pauling'],
  prereq: ['phylogenetics', 'mutations', 'genetic-drift'],
  related: ['gene-flow-mutation', 'human-evolution', 'life-history-earth', 'bioinformatics', 'physics:radioactive-decay', 'medicine:hiv'],
  body: `
In the early 1960s Emile Zuckerkandl and Linus Pauling compared the haemoglobins of different animals and noticed that the number of amino acid differences grew roughly in proportion to the time since the animals' lineages split, as dated by fossils. They called it a **molecular clock**. A few years later Motoo Kimura's neutral theory explained why it ticks ([[genetic-drift]]): a neutral mutation arises at rate $\\mu$ per generation in each of $2N$ gene copies and fixes with probability $1/2N$, so neutral substitutions accumulate at

$$k = 2N\\mu \\times \\frac{1}{2N} = \\mu$$

— the mutation rate itself, independent of population size and of selection. Like radioactive decay ([[physics:radioactive-decay]]), the ticks are random but their average rate is steady.

### Reading the clock
Two species that split $T$ years ago have each accumulated changes along their own lineage, so the genetic distance between them is $d = 2rT$, with $r$ the substitution rate per site per year, and

$$T = \\frac{d}{2r}$$

Humans and chimpanzees differ at about 1.2 % of aligned DNA letters. With a primate rate of about $1 \\times 10^{-9}$ per site per year, $T = 0.012/(2 \\times 10^{-9}) = 6$ million years — in line with the oldest fossils on the human side, such as *Sahelanthropus*, about 7 million years old.

### Calibration
A clock must be set. Rates come from:
- **fossils** of known age that fix the minimum age of a node (for example the oldest fossils of a group);
- **geological events** such as the closing of the Isthmus of Panama about 3 million years ago, which split marine populations;
- **dated samples**, for fast-evolving viruses sampled over years;
- **pedigrees**, counting new mutations in parents and children ([[gene-flow-mutation]]).

| Sequence | Substitution rate (per site per year) |
|---|---|
| Primate nuclear DNA, neutral sites | about $1 \\times 10^{-9}$ |
| Rodent nuclear DNA | about $2$–$4 \\times 10^{-9}$ (short generations) |
| Mammalian mitochondrial DNA | about $10^{-8}$ (roughly 2 % divergence per million years) |
| Influenza, HIV, SARS-CoV-2 | about $10^{-3}$ — visible within a single epidemic |

Genes differ too: parts of proteins where almost any change is harmful, such as histones, barely change in a billion years, while the fibrinopeptides, which are cut off and thrown away, change fast. Choosing the right gene sets the clock's range, like choosing between a stopwatch and a calendar.

### Why the clock is not a stopwatch
- **Saturation.** After a site has changed once it can change again, even back to the original letter. The fraction of sites that differ, $p$, therefore grows more slowly than the true number of changes and levels off at 75 % for random DNA. The **Jukes–Cantor** correction, $d = -\\tfrac34 \\ln(1 - \\tfrac43 p)$, estimates the hidden changes.
- **Rates vary** between lineages (animals with short generations tick faster per year), between genes and over time. Modern **relaxed clocks** let the rate vary across the tree and use many calibrations at once.
- **Genes split before species.** The ancestral population was already variable, so the two species' copies of a gene may have diverged well before the species did. This is one reason why the slow mutation rate measured in human families, about $1.2 \\times 10^{-8}$ per generation, points to an older human–chimpanzee split than fossils suggest; estimates range from about 6 to 10 million years.

> [!key] Distance divided by twice the rate gives the time. Every estimate rests on a calibration and carries an uncertainty, often ±20 % or more; the strength of the method is that thousands of genes and many fossils can be combined.
`,
  ideas: [
    'Neutral substitutions accumulate at the mutation rate, independent of population size: k = μ.',
    'Two lineages each change for time T, so the distance is d = 2rT and T = d/2r.',
    'Clocks are calibrated with fossils, geological events, dated samples or pedigrees.',
    'Multiple hits saturate sequences; the Jukes–Cantor formula corrects for them.',
    'Rates vary between genes and lineages; relaxed clocks and many calibrations make estimates robust.'
  ],
  pitfalls: [
    'The molecular clock ticks at the same rate in every gene and every species — Rates differ by orders of magnitude between genes and vary between lineages; each clock must be calibrated.',
    'The fraction of differing sites is proportional to time forever — It saturates (at 75 % for random DNA), so old divergences need the multiple-hit correction or a slower gene.',
    'A molecular date is exact — It inherits the uncertainty of its calibration and of the rate, and genes diverge before species do.'
  ],
  formulas: [
    {
      name: 'Divergence time from genetic distance',
      expr: 'T = d/(2*r)', tex: 'T = \\dfrac{d}{2r}',
      vars: {
        T: { name: 'time since the two lineages split', q: 'time', unit: 'Myr', tex: 'T' },
        d: { name: 'genetic distance (substitutions per site)', value: 0.012, min: 0, tex: 'd' },
        r: { name: 'substitution rate per site per year, in each lineage', q: 'rate', unit: '1/yr', value: 1e-9, tex: 'r' }
      },
      note: 'The factor 2 is because both lineages change independently after the split. Use the corrected distance (Jukes–Cantor) when more than a few per cent of sites differ.',
      stories: {
        T: 'Two species differ by d = {d} substitutions per site, and the rate is {r}. How long ago did they split?',
        r: 'Two lineages that split {T} ago differ by d = {d}. What is the substitution rate per site per year?'
      }
    },
    {
      name: 'Correcting for multiple hits (Jukes–Cantor)',
      expr: 'd = -0.75*ln(1 - 4*p/3)', tex: 'd = -\\tfrac{3}{4}\\ln\\left(1 - \\tfrac{4}{3}p\\right)',
      vars: {
        d: { name: 'estimated substitutions per site', tex: 'd' },
        p: { name: 'fraction of sites that differ', value: 0.2, min: 0, max: 0.7499, tex: 'p' }
      },
      note: 'Assumes all four bases are equally common and every change equally likely. For small p, d ≈ p; as p approaches 0.75 the distance becomes unmeasurable.',
      stories: {
        d: 'Two sequences differ at {p} of their sites. How many substitutions per site have really occurred?',
        p: 'If {d} substitutions per site have occurred, what fraction of sites will differ?'
      }
    },
    {
      name: 'Rate per year from rate per generation',
      expr: 'r = mu/g', tex: 'r = \\dfrac{\\mu}{g}',
      vars: {
        r: { name: 'substitution rate per site per year', q: 'rate', unit: '1/yr', tex: 'r' },
        mu: { name: 'mutation rate per site per generation', value: 1.2e-8, tex: '\\mu' },
        g: { name: 'generation time', q: 'time', unit: 'yr', value: 29, tex: 'g' }
      },
      note: 'Neutral substitution rate = mutation rate, per generation. Species with short generations therefore tick faster per year (the generation-time effect).',
      stories: {
        r: 'Family sequencing gives {mu} new mutations per site per generation, and the generation time is {g}. What is the rate per year?',
        g: 'A mutation rate of {mu} per generation corresponds to {r}. What generation time does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'When did our lineage split from the chimpanzees\'?',
      q: 'Human and chimpanzee DNA differ at 1.2 % of aligned sites. Taking a rate of $1 \\times 10^{-9}$ substitutions per site per year, estimate the split.',
      steps: [
        'Correct for multiple hits: $d = -0.75\\ln(1 - 4 \\times 0.012/3) = 0.0121$ — hardly different at this small distance.',
        '$T = d/2r = 0.0121/(2 \\times 10^{-9}) = 6.0 \\times 10^6$ years.'
      ],
      a: 'About 6 million years ago.'
    },
    {
      title: 'Saturation',
      q: 'Two sequences differ at 45 % of their sites; the rate is $1 \\times 10^{-9}$ per site per year. Compare the naive and the corrected divergence times.',
      steps: [
        'Naive: $T = 0.45/(2 \\times 10^{-9}) = 225$ million years.',
        'Jukes–Cantor: $d = -0.75 \\ln(1 - 0.6) = -0.75 \\ln 0.4 = 0.687$.',
        'Corrected: $T = 0.687/(2\\times10^{-9}) = 344$ million years — half as old again. At high divergence, many changes are hidden.'
      ],
      a: 'About 225 million years naively, about 344 million after correction.'
    },
    {
      title: 'The pedigree rate puzzle',
      q: 'Sequencing families gives $\\mu = 1.2 \\times 10^{-8}$ mutations per site per generation, and human generations average about 29 years. What divergence time does this give for the 1.2 % human–chimpanzee difference, and why is it older than 6 million years?',
      steps: [
        '$r = \\mu/g = 1.2\\times10^{-8}/29 = 4.1 \\times 10^{-10}$ per site per year.',
        '$T = 0.012/(2 \\times 4.1\\times10^{-10}) = 14.5$ million years.',
        'Part of the 1.2 % arose *before* the split, as variation in the ancestral population; generation times and mutation rates in the past may also have differed. Allowing for these brings the estimate to about 7–10 million years.'
      ],
      a: 'About 14.5 million years before corrections — which shows how much a clock depends on its calibration.'
    }
  ],
  quiz: [
    { q: 'Why do neutral mutations accumulate at a steady rate?', choices: ['selection favours them at a constant rate', 'their substitution rate equals the mutation rate, whatever the population size', 'large populations fix more of them', 'they only occur in mitochondria'], a: 1, why: '2Nμ new neutral mutations arise per generation, each fixing with probability 1/2N, so substitutions accumulate at μ — the population size cancels.' },
    { q: 'If the substitution rate used is twice too high, the estimated divergence time will be…', choices: ['twice too old', 'half the true age', 'unchanged', 'four times too old'], a: 1, why: 'T = d/2r: doubling r halves T.' },
    { q: 'For very divergent sequences, the fraction of differing sites underestimates the number of changes that have occurred.', a: true, why: 'Sites that change twice, or back again, show at most one difference: the raw count saturates, and a correction such as Jukes–Cantor is needed.' },
    { q: 'Two species differ by d = 0.02 substitutions per site; the rate is 10⁻⁹ per site per year. How long ago did they split?', answer: 10, unit: 'Myr', why: 'T = 0.02/(2 × 10⁻⁹) = 10⁷ years.' },
    { q: 'Mitochondrial DNA of mammals changes faster than most nuclear DNA.', a: true, why: 'Its substitution rate is roughly ten times higher, which makes it useful for recent divergences — and saturated for ancient ones.' }
  ],
  problems: [
    { q: 'Two sequences differ at 30 % of their sites. What is the Jukes–Cantor distance?', answer: 0.383, tol: 0.02, steps: ['$d = -0.75\\ln(1 - 0.4) = -0.75 \\ln 0.6 = 0.383$ substitutions per site.'] },
    { q: 'Two rodent species differ by d = 0.1, and rodent DNA changes at $2.5\\times10^{-9}$ per site per year. How long ago did they split, in millions of years?', answer: 20, unit: 'Myr', tol: 0.02, steps: ['$T = 0.1/(2 \\times 2.5\\times10^{-9}) = 2 \\times 10^7$ years = 20 million years.'] }
  ],
  applications: ['Dating the branches of the tree of life, including splits with no fossil record.', 'Dating the origin of epidemics: HIV to the early twentieth century, and new virus variants within weeks.', 'Estimating when human populations separated and when they mixed.', 'Testing hypotheses of vicariance, such as whether a group split when continents separated.'],
  history: 'Zuckerkandl and Pauling proposed the molecular clock in 1962–65. Kimura\'s neutral theory (1968) supplied the reason; Allan Wilson and Vincent Sarich used it in 1967 to argue, against the fossil consensus of the time, that humans and African apes split only about 5 million years ago. Relaxed-clock Bayesian methods arrived in the 2000s.',
  sim: 'evo-clock'
},

{
  id: 'life-history-earth', parent: 'history-of-life', title: 'The history of life on Earth', level: 1,
  short: 'Earth is 4.54 billion years old. Life appeared within its first billion years, filled the air with oxygen, stayed microscopic for most of its history, and then, in the last half-billion years, diversified into animals and plants — interrupted by five mass extinctions.',
  keywords: ['history of life', 'geological time scale', 'deep time', 'age of the Earth', 'Hadean', 'Archean', 'Proterozoic', 'Phanerozoic', 'first life', 'stromatolites', 'Great Oxidation Event', 'eukaryotes', 'Snowball Earth', 'Cambrian explosion', 'mass extinction', 'end-Permian', 'end-Cretaceous', 'radiometric dating'],
  prereq: ['evidence-evolution', 'three-domains', 'physics:radioactive-decay'],
  related: ['photosynthesis', 'mitochondria-chloroplasts', 'plant-diversity', 'vertebrates', 'human-evolution', 'climate-ecosystems', 'biodiversity', 'physics:radiocarbon-dating', 'chemistry:isotopes'],
  body: `
### Dating deep time
Radioactive isotopes decay at fixed rates, so the ratio of a daughter isotope to its parent in a crystal tells how long ago it formed: $t = t_{1/2}\\log_2(1 + D/P)$. Uranium-238 decays to lead-206 with a half-life of 4.47 billion years, ideal for the oldest rocks. Meteorites formed 4.567 billion years ago, the Earth about **4.54 billion years ago**; the oldest mineral grains, zircons from Western Australia, are 4.4 billion years old and the oldest rocks about 4.0.

| Eon | Time (billion years ago) | Life |
|---|---|---|
| Hadean | 4.54–4.0 | molten beginnings, the Moon-forming impact, first oceans |
| Archean | 4.0–2.5 | first microbes, stromatolites, oxygen-making cyanobacteria |
| Proterozoic | 2.5–0.539 | oxygen in the air, eukaryotes, first multicellular life, Snowball Earth |
| Phanerozoic | 0.539–now | animals, plants on land, dinosaurs, mammals, us |

### Three billion years of microbes
The earliest traces of life are about **3.7 billion years** old: carbon enriched in the light isotope in Greenland rocks, as living things leave it (the claim is debated). By 3.48 billion years ago microbial mats were building layered mounds, **stromatolites**, in what is now Western Australia. Cyanobacteria invented oxygen-releasing photosynthesis ([[photosynthesis]]) by about 2.7–3.0 billion years ago; their oxygen first rusted the iron dissolved in the seas, laying down banded iron formations, and then, in the **Great Oxidation Event about 2.4 billion years ago**, began to build up in the air — a poison to much of the life of the time and the precondition for everything that breathes. Cells with nuclei, the eukaryotes, appear by about 1.7 billion years ago, powered by mitochondria that were once free-living bacteria ([[mitochondria-chloroplasts]]). A red alga of 1.05 billion years is the first clearly multicellular organism. Between 720 and 635 million years ago the Earth froze over, perhaps almost to the equator, at least twice (Snowball Earth).

### The Phanerozoic
Large, soft-bodied Ediacaran organisms appear around 575 million years ago. Then, from about **539 million years ago**, the **Cambrian explosion**: within some 25 million years almost every animal phylum appears in the fossil record, with shells, eyes, legs and the first predators. Plants reached land about 470 million years ago, forests by 385; fish with legs such as *Tiktaalik* crawled out about 375 million years ago; reptile-like amniotes laid eggs on land from about 320. Dinosaurs and the first mammals appeared around 230–225 million years ago, birds (*Archaeopteryx*) by 150, flowering plants by about 130.

### The big five
Five times the fossil record shows most species vanishing within a geologically short time:

| Extinction | Million years ago | Species lost (estimates) | Main suspect |
|---|---|---|---|
| End-Ordovician | 445 | about 85 % | glaciation and falling sea level |
| Late Devonian | about 372 | about 75 % | oceans losing oxygen |
| End-Permian | 252 | about 80–90 % of marine species | Siberian volcanic eruptions: warming, acid oceans |
| End-Triassic | 201 | about 75–80 % | volcanism as the Atlantic opened |
| End-Cretaceous | 66 | about 75 % | a 10-km asteroid at Chicxulub, Mexico |

Each extinction emptied niches that the survivors refilled: the mammals radiated only after the non-bird dinosaurs disappeared. Today species are being lost at rates estimated at tens to hundreds of times the background rate of the fossil record, which is why some biologists speak of a sixth mass extinction ([[biodiversity]], [[climate-ecosystems]]).

### The day of the Earth
Squeeze the 4.54 billion years into 24 hours. Life appears at about 4:26 in the morning; oxygen fills the air at about 11:19; the Cambrian explosion comes at 21:09; the dinosaurs die at 23:39; our lineage splits from the chimpanzees' about two minutes before midnight; and *Homo sapiens* arrives in the last six seconds. All of written history fits in the last tenth of a second.

> [!key] For most of its history life was single-celled: animals, plants and fungi fill only the last eighth of the story. The air we breathe, and the complex cells that breathe it, are themselves products of evolution.
`,
  ideas: [
    'Radiometric dating puts the Earth at 4.54 billion years and gives the ages of rocks and fossils.',
    'Life appeared by about 3.7–3.5 billion years ago and was microbial for about three billion years.',
    'Cyanobacteria oxygenated the air in the Great Oxidation Event, about 2.4 billion years ago.',
    'Eukaryotes arose by about 1.7 billion years ago; the Cambrian explosion began about 539 million years ago.',
    'Five mass extinctions reset the living world; the end-Permian was the worst, the end-Cretaceous ended the non-bird dinosaurs.'
  ],
  pitfalls: [
    'Humans and dinosaurs lived at the same time — The non-bird dinosaurs died out 66 million years ago; the human lineage is about 7 million years old (birds, however, are living dinosaurs).',
    'Life has always been mostly animals and plants — For some 3 billion years there were only microbes, and they are still most of life\'s diversity and much of its mass.',
    'Evolution is steady progress towards more complex life — Most lineages stayed simple, extinctions repeatedly reset diversity, and chance events like asteroid impacts decided who inherited the Earth.'
  ],
  formulas: [
    {
      name: 'Earth\'s history on a 24-hour clock',
      expr: 'tc = D*(1 - A/Ae)', tex: 't_c = D\\left(1 - \\dfrac{A}{A_E}\\right)',
      vars: {
        tc: { name: 'time on the clock', q: 'time', unit: 'h', tex: 't_c' },
        D: { name: 'length of the clock day', q: 'time', unit: 'h', value: 24, fixed: true, tex: 'D' },
        A: { name: 'age of the event', q: 'time', unit: 'Myr', value: 539, tex: 'A' },
        Ae: { name: 'age of the Earth', q: 'time', unit: 'Gyr', value: 4.54, fixed: true, tex: 'A_E' }
      },
      note: 'One clock hour is 189 million years, one minute 3.15 million years, one second about 52 500 years.',
      practice: { unknowns: ['tc', 'A'] },
      stories: {
        tc: 'An event happened {A} ago. At what time does it appear on a 24-hour clock of the Earth\'s history?',
        A: 'An event appears at {tc} on the 24-hour clock of the Earth\'s history. How long ago did it happen?'
      }
    },
    {
      name: 'Radiometric age',
      expr: 't = th*log2(1 + DP)', tex: 't = t_{1/2}\\,\\log_2\\left(1 + \\mathrm{D/P}\\right)',
      vars: {
        t: { name: 'age of the crystal', q: 'time', unit: 'Gyr', tex: 't' },
        th: { name: 'half-life of the parent isotope', q: 'time', unit: 'Gyr', value: 4.468, tex: 't_{1/2}' },
        DP: { name: 'ratio of daughter to parent atoms', value: 0.98, min: 0, tex: '\\mathrm{D/P}' }
      },
      note: 'Assumes the crystal started with no daughter isotope and has lost none since. For uranium-238 → lead-206 the half-life is 4.468 billion years; zircons are ideal because they exclude lead when they form.',
      stories: {
        t: 'A zircon has {DP} atoms of lead-206 for every atom of uranium-238 (half-life {th}). How old is it?',
        DP: 'What lead-206/uranium-238 ratio would a {t}-old zircon have (half-life {th})?'
      }
    }
  ],
  examples: [
    {
      title: 'The Earth\'s day',
      q: 'On a 24-hour clock of the Earth\'s 4.54-billion-year history, when does the Cambrian explosion (539 million years ago) happen, and how many seconds before midnight do *Homo sapiens* (300 000 years ago) appear?',
      steps: [
        'Cambrian: $t_c = 24\\ \\mathrm{h} \\times (1 - 539/4540) = 24 \\times 0.8813 = 21.15$ h, about 21:09.',
        '*Homo sapiens*: $86\\,400\\ \\mathrm{s} \\times 0.3/4540 = 5.7$ s before midnight.'
      ],
      a: 'The Cambrian begins at about 21:09; our species appears 5.7 seconds before midnight.'
    },
    {
      title: 'Dating the oldest mineral grain',
      q: 'A zircon contains 0.98 atoms of lead-206 for every atom of uranium-238. The half-life is 4.468 billion years. How old is it?',
      steps: [
        '$\\log_2(1 + 0.98) = \\ln 1.98/\\ln 2 = 0.6831/0.6931 = 0.9855$.',
        '$t = 4.468 \\times 0.9855 = 4.40$ billion years.'
      ],
      a: 'About 4.40 billion years — as old as the oldest known zircons from Jack Hills, Western Australia.'
    }
  ],
  quiz: [
    { q: 'Which came first?', choices: ['the Cambrian explosion', 'the Great Oxidation Event', 'the first land plants', 'the first dinosaurs'], a: 1, why: 'Oxygen built up in the air about 2.4 billion years ago, nearly two billion years before the Cambrian (539 million), land plants (470 million) and dinosaurs (230 million).' },
    { q: 'On a 24-hour clock of Earth\'s history, when do the non-bird dinosaurs die out?', choices: ['about 12:00', 'about 18:00', 'about 22:00', 'about 23:39'], a: 3, why: '66 million years is 66/4540 of the day, about 21 minutes before midnight: 23:39.' },
    { q: 'Early humans lived alongside the non-bird dinosaurs.', a: false, why: 'About 59 million years separate the last non-bird dinosaurs (66 million years ago) from the first hominins (about 7 million).' },
    { q: 'For most of the history of life, living things were single-celled.', a: true, why: 'From the first life (about 3.7 billion years ago) to the Ediacaran (575 million), roughly three billion years, life was microbial.' },
    { q: 'On the 24-hour clock, at what hour (as a decimal) does the Great Oxidation Event of 2.4 billion years ago fall?', answer: 11.3, unit: 'h', why: '24 × (1 − 2.4/4.54) = 24 × 0.471 = 11.3 h, about 11:19.' }
  ],
  problems: [
    { q: 'A crystal has 0.5 atoms of lead-206 for each atom of uranium-238 (half-life 4.468 billion years). How old is it, in billions of years?', answer: 2.61, unit: 'Gyr', tol: 0.02, steps: ['$t = 4.468 \\times \\log_2 1.5 = 4.468 \\times 0.585 = 2.61$ billion years.'] },
    { q: 'At what time on the 24-hour clock of Earth\'s history (4.54 billion years) did the end-Permian extinction (252 million years ago) happen? Give hours as a decimal.', answer: 22.67, unit: 'h', tol: 0.01, steps: ['$24 \\times (1 - 252/4540) = 24 \\times 0.9445 = 22.67$ h, about 22:40.'] }
  ],
  applications: ['Understanding past climate change and mass extinctions as guides to the present one.', 'Oil, gas and mineral exploration, which relies on dating rock layers with fossils.', 'The search for life elsewhere: what early Earth\'s microbes and their chemical traces looked like tells astrobiologists what to look for.', 'Explaining why modern ecosystems contain the groups they do, as survivors and heirs of past extinctions.'],
  history: 'In the eighteenth century James Hutton argued that the Earth was immeasurably old; William Smith mapped rock layers by their fossils around 1815. Radiometric dating began with Ernest Rutherford and Bertram Boltwood around 1905–07, and Clair Patterson dated the Earth at 4.55 billion years from meteorite lead in 1956. Luis and Walter Alvarez linked the end-Cretaceous extinction to an asteroid in 1980; the Chicxulub crater was identified in 1991.',
  sim: 'evo-earth-clock'
},

{
  id: 'human-evolution', parent: 'history-of-life', title: 'Human evolution', level: 2,
  short: 'Humans are one twig of the primate tree. Our lineage split from the chimpanzees\' about 6–7 million years ago in Africa, walked upright long before brains grew large, and our own species arose in Africa about 300 000 years ago, spreading worldwide and mixing a little with Neanderthals and Denisovans.',
  keywords: ['human evolution', 'hominin', 'primates', 'Sahelanthropus', 'Ardipithecus', 'Australopithecus', 'Lucy', 'Laetoli', 'Homo habilis', 'Homo erectus', 'Neanderthal', 'Denisovan', 'Homo sapiens', 'Jebel Irhoud', 'out of Africa', 'bipedalism', 'stone tools', 'admixture', 'introgression', 'brain size', 'lactase persistence'],
  prereq: ['phylogenetics', 'molecular-clock', 'speciation'],
  related: ['gene-flow-mutation', 'genetic-drift', 'human-genetics', 'polygenic-traits', 'life-history-earth', 'vertebrates', 'medicine:dna-genes'],
  body: `
Humans are primates, and among the living primates our closest relatives are the chimpanzee and the bonobo: our DNA differs from theirs at about 1.2 % of single letters. The gorilla branched off earlier, then the orangutan. The **hominins** are the species on our side of the split from the chimpanzee lineage, about 6–7 million years ago in Africa. We did not evolve from chimpanzees; we and they descend from a common ancestor, and both lineages have been evolving ever since.

### Upright first, big brains later
The oldest hominin candidates — *Sahelanthropus* in Chad (about 7 million years), *Orrorin* in Kenya (6 million), *Ardipithecus* in Ethiopia (4.4 million) — show signs of walking on two legs while keeping ape-sized brains. The australopithecines made it certain: "Lucy", *Australopithecus afarensis*, lived 3.2 million years ago, and footprints at Laetoli in Tanzania, 3.66 million years old, show a fully upright stride. Their brains were about 400–500 cm³, like a chimpanzee's.

| Hominin | Time (million years ago) | Brain (cm³) | Notes |
|---|---|---|---|
| *Australopithecus afarensis* | 3.9–2.9 | about 450 | upright, climbing too; eastern Africa |
| *Homo habilis* | 2.4–1.4 | about 600 | early *Homo*; stone tools from 2.6 million years (older ones 3.3) |
| *Homo erectus* | 1.9–0.1 | 600–1100 | human body proportions; left Africa by 1.8 million years; hand axes |
| Neanderthals | 0.4–0.04 | about 1450 | Europe and western Asia; tools, fire, burials |
| *Homo sapiens* | 0.3–now | about 1350 | Africa, then worldwide |

The family tree is bushy, not a single line: several hominin species usually lived at the same time. Until about 50 000 years ago *Homo sapiens* shared the planet with Neanderthals, Denisovans, the small *Homo floresiensis* of Indonesia and others.

### Our species, out of Africa
The oldest fossils with features of our species, from Jebel Irhoud in Morocco, are about 300 000 years old. Genetic diversity is highest in Africa, and each population outside Africa carries a subset of it — the signature of a small group leaving Africa, roughly 50 000–70 000 years ago, and spreading: to Australia by about 50 000–65 000 years ago and into the Americas by at least 16 000 years ago, possibly well before. Each step of the journey was a small founder event ([[genetic-drift]]), so diversity falls with distance from Africa.

### Interbreeding
Ancient DNA transformed the story. Neanderthal genomes, first sequenced in 2010, showed that people whose ancestry lies outside Africa carry about **2 %** Neanderthal DNA, from interbreeding some 45 000–50 000 years ago; people in Papua New Guinea and Aboriginal Australians carry a further 3–5 % from Denisovans, a group known from a few bones and a genome. Some of these inherited pieces were useful: a Denisovan variant of the gene *EPAS1* helps Tibetans live at high altitude, and some immune genes came from Neanderthals. The admixture can be dated because recombination cuts introduced segments shorter every generation: after $t$ generations the average segment is about $100/t$ centimorgans long.

### One human family
Humans are a young species with little genetic variation compared with chimpanzees, and most of what exists (about 85–90 %) is found within any population rather than between populations ([[gene-flow-mutation]]). Visible differences such as skin colour track ultraviolet light and evolved several times, and variation changes gradually over geography, so human "races" are not discrete biological categories. Recent evolution continues: lactase persistence, the ability to digest milk as an adult, spread in the last 10 000 years by at least four different mutations in dairying peoples of Europe, Africa and the Middle East. Traits such as behaviour and intelligence are shaped by very many genes together with environment and culture ([[polygenic-traits]]); genes do not fix a person's destiny.

> [!key] Humans share a common ancestor with chimpanzees about 6–7 million years ago; bipedalism came first and large brains later; our species arose in Africa about 300 000 years ago, spread worldwide within the last 70 000 years, and carries a little Neanderthal and Denisovan DNA.
`,
  ideas: [
    'Chimpanzees and bonobos are our closest living relatives; the lineages split about 6–7 million years ago.',
    'Walking upright evolved millions of years before large brains.',
    'The hominin tree is bushy: several species usually coexisted.',
    'Homo sapiens arose in Africa about 300 000 years ago and spread worldwide from about 50 000–70 000 years ago.',
    'People outside Africa carry about 2 % Neanderthal DNA; most human variation lies within populations, and races are not discrete biological groups.'
  ],
  pitfalls: [
    'Humans evolved from chimpanzees — Humans and chimpanzees are cousins with a common ancestor; neither is the other\'s ancestor.',
    'Human evolution was a single march from ape to human — Many hominin species lived side by side, and most were side branches that left no descendants.',
    'Human races are distinct genetic groups — Human genetic variation is mostly within populations and changes gradually across the world; no set of genes divides people into discrete races.'
  ],
  formulas: [
    {
      name: 'Dating admixture from segment length',
      expr: 'L = 100*g/T', tex: 'L \\approx \\dfrac{100\\,g}{T}',
      vars: {
        L: { name: 'average length of an introduced DNA segment', q: false, unit: 'cM', tex: 'L' },
        g: { name: 'generation time', q: 'time', unit: 'yr', value: 29, tex: 'g' },
        T: { name: 'time since the interbreeding', q: 'time', unit: 'kyr', value: 50, tex: 'T' }
      },
      note: 'After t = T/g generations, recombination has cut the introduced pieces to about 1/t morgans (100/t centimorgans) on average. One centimorgan is roughly a million base pairs in humans.',
      stories: {
        L: 'Interbreeding happened {T} ago, with generations of {g}. How long are the surviving segments on average?',
        T: 'Neanderthal segments in modern genomes average {L} long. With generations of {g}, when did the interbreeding happen?'
      }
    },
    {
      name: 'Encephalisation quotient',
      expr: 'EQ = Mb/(k*Mbody^(2/3))', tex: '\\mathrm{EQ} = \\dfrac{M_{br}}{k\\,M^{2/3}}',
      vars: {
        EQ: { name: 'encephalisation quotient', tex: '\\mathrm{EQ}' },
        Mb: { name: 'brain mass', q: false, unit: 'g', value: 1350, tex: 'M_{br}' },
        k: { name: 'mammal brain–body constant', value: 0.12, fixed: true, tex: 'k' },
        Mbody: { name: 'body mass', q: false, unit: 'g', value: 65000, tex: 'M' }
      },
      note: 'Brain mass relative to that of a typical mammal of the same body mass (Jerison\'s scaling, masses in grams). It compares species on average; it says nothing about individuals, and within a species brain size does not measure intelligence.',
      stories: {
        EQ: 'A species has a brain of {Mb} and a body of {Mbody}. What is its encephalisation quotient?',
        Mb: 'What brain mass would give an EQ of {EQ} to a species with a body of {Mbody}?'
      }
    }
  ],
  examples: [
    {
      title: 'When did Neanderthals and modern humans interbreed?',
      q: 'Neanderthal segments in the genomes of people outside Africa average about 0.058 centimorgans. With 29-year generations, when did the interbreeding happen?',
      steps: [
        'Generations since admixture: $t = 100/L = 100/0.058 = 1724$.',
        'Years: $1724 \\times 29 \\approx 50\\,000$ years ago.',
        'That fits the time when modern humans were leaving Africa and meeting Neanderthals in western Asia.'
      ],
      a: 'About 50 000 years ago (some 1700 generations).'
    },
    {
      title: 'Brains through time',
      q: 'Using EQ = brain/(0.12 × body^(2/3)) in grams, compare a chimpanzee (brain 400 g, body 45 kg), *Australopithecus* (450 g, 35 kg), *Homo erectus* (900 g, 55 kg) and a modern human (1350 g, 65 kg).',
      steps: [
        'Chimpanzee: $0.12 \\times 45\\,000^{2/3} = 152$; EQ $= 400/152 = 2.6$.',
        '*Australopithecus*: $0.12 \\times 35\\,000^{2/3} = 128$; EQ $= 3.5$.',
        '*Homo erectus*: $0.12 \\times 55\\,000^{2/3} = 174$; EQ $= 5.2$.',
        'Human: $0.12 \\times 65\\,000^{2/3} = 194$; EQ $= 7.0$ — about seven times the brain expected for a mammal of our size.'
      ],
      a: 'EQ rises from about 2.6 (chimpanzee) and 3.5 (Australopithecus) to 5.2 (H. erectus) and 7.0 (H. sapiens).'
    }
  ],
  quiz: [
    { q: 'Humans evolved from chimpanzees.', a: false, why: 'Humans and chimpanzees share a common ancestor that lived about 6–7 million years ago; each lineage has evolved separately since.' },
    { q: 'Which evolved first in the hominin lineage?', choices: ['a large brain', 'walking upright', 'language', 'agriculture'], a: 1, why: 'Australopithecines walked upright over 3.5 million years ago with chimpanzee-sized brains; large brains came with Homo, much later.' },
    { q: 'Where is human genetic diversity greatest?', choices: ['Europe', 'Asia', 'Africa', 'the Americas'], a: 2, why: 'Our species arose in Africa, and the populations that left carried only part of its variation — so diversity is highest in Africa and falls with distance from it.' },
    { q: 'About how much of the genome of people with ancestry outside Africa comes from Neanderthals?', choices: ['0 %', 'about 2 %', 'about 20 %', 'about 50 %'], a: 1, why: 'About 1–2 %, from interbreeding some 45 000–50 000 years ago.' },
    { q: 'Human races are discrete biological categories with clear genetic boundaries.', a: false, why: 'Most variation is within populations and changes gradually across geography; racial categories are social, not natural genetic divisions.' }
  ],
  problems: [
    { q: 'Denisovan segments in a population average 0.07 cM. With 29-year generations, how many thousand years ago did the interbreeding happen?', answer: 41.4, unit: 'kyr', tol: 0.02, steps: ['$t = 100/0.07 = 1429$ generations.', '$1429 \\times 29 = 41\\,400$ years.'] }
  ],
  applications: ['Understanding human genetic diversity, which matters for medicine that works well for everyone.', 'Explaining inherited traits from archaic ancestors, such as high-altitude adaptation and some immune responses.', 'Dating human migrations with ancient DNA, archaeology and molecular clocks.', 'Countering racist misuse of biology with the evidence of a single, recently shared human family.'],
  history: 'Darwin predicted in 1871 that humans arose in Africa, when almost no fossils were known. Raymond Dart described the first australopithecine, the Taung child, in 1925; Lucy was found in 1974 and the Laetoli footprints in 1978. Mitochondrial DNA pointed to a recent African origin in 1987, and Svante Pääbo\'s sequencing of Neanderthal DNA (2010) and the discovery of the Denisovans earned him the 2022 Nobel Prize.',
  sim: { id: 'evo-tree', params: { tree: 'primates' } }
}

);
