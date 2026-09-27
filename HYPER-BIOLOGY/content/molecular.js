/* HYPER-BIOLOGY · content/molecular.js — Molecular Biology: from DNA to protein, and controlling genes.
 *   dna-to-protein:  dna-structure, dna-replication, transcription, rna-processing, genetic-code, translation
 *   gene-regulation: lac-operon, eukaryotic-regulation, epigenetics, noncoding-rna, mutations, viruses
 * Simulations in sims/molecular.js (prefix molb-). */
Hyper.add(

{
  id: 'dna-structure', parent: 'dna-to-protein', title: 'The structure of DNA', level: 1,
  short: 'DNA is two long chains of nucleotides wound around each other in a right-handed double helix, held together by A–T and G–C base pairs. Because each base has only one partner, either strand fixes the sequence of the other — the key to copying and reading genes.',
  keywords: ['DNA', 'double helix', 'base pairing', 'complementary', 'Chargaff\'s rules', 'nucleotide', 'deoxyribose', 'phosphodiester', 'antiparallel', '5′ and 3′', 'purine', 'pyrimidine', 'major groove', 'minor groove', 'B-DNA', 'melting temperature', 'GC content', 'nucleosome', 'Photo 51'],
  prereq: ['nucleic-acids', 'chemistry:hydrogen-bonding', 'nucleus-ribosomes'],
  related: ['dna-replication', 'transcription', 'epigenetics', 'genomics', 'pcr', 'gel-electrophoresis', 'chemistry:nucleic-acids', 'medicine:dna-genes'],
  body: `
Every cell carries its instructions as DNA, a molecule so long and thin that the DNA of a single human cell, stretched out, would reach about two metres — yet it fits in a nucleus a few micrometres across. The design that makes this possible, and that lets the text be copied and read, is the **double helix**.

### The building blocks
A DNA strand is a chain of **nucleotides**. Each has three parts: a phosphate, the sugar **deoxyribose**, and one of four **bases** — adenine (A) and guanine (G), the two-ringed **purines**, and cytosine (C) and thymine (T), the one-ringed **pyrimidines**. Phosphodiester bonds join the phosphate on the 5′ carbon of one sugar to the 3′ carbon of the next, making a sugar–phosphate backbone with the bases sticking out. The chain therefore has a direction: a **5′ end** and a **3′ end**, and sequences are always written 5′ → 3′. Every phosphate carries a negative charge, which is why DNA runs towards the positive electrode in [[gel-electrophoresis]].

### Two strands, one helix
In the cell, two strands lie side by side, running in **opposite directions** (antiparallel), and twist into a right-handed helix. The backbones are on the outside; the bases stack flat in the middle, like the steps of a spiral staircase, and pair across the axis:

- **A pairs with T** through two hydrogen bonds;
- **G pairs with C** through three.

Each pair is one purine plus one pyrimidine, so every step has the same width and the helix is perfectly regular whatever the sequence. The hydrogen bonds give the pairing its **specificity**; most of the helix's **stability** comes from the stacking of the flat bases on top of each other (see [[chemistry:intermolecular-forces|intermolecular forces]]). Because the sugars attach to each pair off-centre, the helix has a wide **major groove** and a narrow **minor groove**. Proteins read the sequence through the edges of the bases exposed in the major groove — without opening the helix.

| Feature of B-DNA (the usual form) | Value |
|---|---|
| Diameter | about 2.0 nm |
| Rise per base pair | 0.34 nm |
| Base pairs per turn | about 10.5 |
| Length of one turn (pitch) | about 3.6 nm |
| Mass per base pair | about 650 g/mol |
| *E. coli* genome (one circular molecule) | 4.6 million bp, 1.6 mm |
| Human genome, one set (haploid) | 3.1 × 10⁹ bp, about 1 m |
| One human cell (diploid, 46 molecules) | 6.2 × 10⁹ bp, about 2 m |

### Chargaff's rules
In the late 1940s Erwin Chargaff found that in the DNA of any species the amount of A equals that of T, and G equals C — the pairing rule, seen in bulk. The **GC content**, though, differs widely between species: about 41 % in humans, 51 % in *E. coli*, 19 % in the malaria parasite *Plasmodium falciparum* and over 70 % in *Streptomyces* soil bacteria. The rule holds for the double helix, not for a single strand, where A and T need not match.

### Complementarity is information
Knowing one strand gives you the other: 5′-ATGCC-3′ pairs with 3′-TACGG-5′, which, written the usual way, is 5′-GGCAT-3′ — the **reverse complement**. This is how DNA is copied ([[dna-replication]]), how genes are read ([[transcription]]), and how PCR primers, hybridisation probes and CRISPR guides find their targets. Try it on any sequence with the [sequence tools](#/tools/sequence).

### Melting and re-annealing
Heat separates the strands. The **melting temperature** $T_m$ rises with GC content — three hydrogen bonds and stronger stacking — roughly as $T_m \\approx 69.3 + 0.41\\times\\%\\mathrm{GC}$ °C in 0.2 M sodium salt (Marmur and Doty, 1962). Unstacked bases absorb more ultraviolet light, so absorbance at 260 nm rises by about 40 % on melting (the hyperchromic effect). On slow cooling, complementary strands find each other again — the basis of PCR and of every hybridisation test.

### Packing two metres into a nucleus
In eukaryotes, 147 bp of DNA wrap 1.65 turns around a disc of eight histone proteins to form a **nucleosome**, one about every 200 bp, like beads on a string. Nucleosomes fold into loops and domains; a mitotic chromosome is some ten thousand times shorter than its DNA. How tightly a stretch is packed decides whether its genes can be read ([[eukaryotic-regulation]], [[epigenetics]]).

> [!key] Two antiparallel strands, bases inside, A with T and G with C: the pairing rule makes every strand a template for its partner, and the regular helix lets any sequence be stored in the same shape.
`,
  ideas: [
    'A DNA strand is a sugar–phosphate backbone carrying a sequence of four bases; it has a 5′ and a 3′ end.',
    'Two antiparallel strands pair A–T (two hydrogen bonds) and G–C (three) and twist into a right-handed helix: 0.34 nm and about 10.5 bp per turn.',
    'In double-stranded DNA A = T and G = C (Chargaff), but the GC content differs between species.',
    'Each strand determines the other: the basis of replication, transcription, PCR and hybridisation.',
    'GC-rich DNA melts at a higher temperature; the strands re-anneal on cooling.'
  ],
  pitfalls: [
    'The two strands of DNA have the same sequence — They are complementary and antiparallel: the partner of 5′-ATGC-3′ is 5′-GCAT-3′, its reverse complement.',
    'Hydrogen bonds are what holds the helix together — They give the pairing its specificity, but most of the stability comes from base stacking; GC-rich DNA is more stable partly because G–C pairs stack more strongly.',
    'Chargaff\'s rule means every DNA is 25 % of each base — It only says A = T and G = C in the double helix; the GC content varies from under 20 % to over 70 % between species.'
  ],
  formulas: [
    {
      name: 'Length of a DNA molecule',
      expr: 'L = N*d', tex: 'L = N\\,d',
      vars: {
        L: { name: 'contour length', q: 'length', unit: 'm' },
        N: { name: 'number of base pairs', q: false, unit: 'bp', value: 6.2e9 },
        d: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true }
      },
      note: 'B-DNA, the usual form in cells. A-DNA (0.26 nm per bp) and Z-DNA (0.37 nm) differ.',
      practice: { unknowns: ['L', 'N'] },
      stories: {
        L: 'A human cell holds {N} of DNA. Laid end to end, how long is it?',
        N: 'A DNA molecule stretched out on a microscope slide is {L} long. How many base pairs does it contain?'
      }
    },
    {
      name: 'Turns of the helix',
      expr: 'n = N/p', tex: 'n = \\dfrac{N}{p}',
      vars: {
        n: { name: 'number of helical turns', q: 'count' },
        N: { name: 'number of base pairs', q: false, unit: 'bp', value: 147 },
        p: { name: 'base pairs per turn', q: false, unit: 'bp/turn', value: 10.5, fixed: true }
      },
      stories: { n: 'A nucleosome wraps {N} of DNA around its histones. How many turns of the double helix is that?' }
    },
    {
      name: 'Chargaff\'s rules: base composition from GC content',
      expr: 'xA = (1 - xGC)/2', tex: 'x_A = x_T = \\dfrac{1 - x_{GC}}{2}',
      vars: {
        xA: { name: 'fraction of A (and of T)', q: 'ratio', unit: '%', tex: 'x_A' },
        xGC: { name: 'GC content', q: 'ratio', unit: '%', value: 41, min: 0, max: 100, tex: 'x_{GC}' }
      },
      note: 'Double-stranded DNA only. G and C are each half of the GC content.',
      stories: {
        xA: 'The human genome is {xGC} G + C. What fraction of its bases are adenine?',
        xGC: 'A sample of double-stranded DNA is {xA} adenine. What is its GC content?'
      }
    },
    {
      name: 'Melting temperature from GC content (Marmur–Doty)',
      expr: 'Tm = 69.3 + 0.41*GC', tex: 'T_m = 69.3 + 0.41\\,\\mathrm{GC}',
      vars: {
        Tm: { name: 'melting temperature', q: false, unit: '°C', tex: 'T_m' },
        GC: { name: 'GC content, in per cent', value: 50, min: 0, max: 100, tex: '\\mathrm{GC}' }
      },
      note: 'Long DNA in about 0.2 M Na⁺. Short primers follow other rules (the sequence tools use the Wallace rule below 14 nt).',
      stories: { Tm: 'At what temperature does half of a long DNA that is {GC} per cent G + C come apart?', GC: 'A bacterial DNA melts at {Tm}. Estimate its GC content in per cent.' }
    }
  ],
  examples: [
    {
      title: 'Two metres in every cell',
      q: 'A human cell has $6.2\\times10^9$ base pairs of DNA. How long is it laid end to end, and how does that compare with a nucleus 6 µm across?',
      steps: [
        '$L = N d = 6.2\\times10^9 \\times 0.34\\ \\mathrm{nm} = 2.1\\times10^9\\ \\mathrm{nm} = 2.1$ m.',
        '$2.1\\ \\mathrm{m} / 6\\times10^{-6}\\ \\mathrm{m} \\approx 350\\,000$: the DNA is some 350 000 times longer than the nucleus is wide — like 20 km of thread in a tennis ball.',
        'The body has roughly $10^{13}$ cells with nuclei, so all its DNA together is about $2\\times10^{13}$ m — more than a hundred times the distance to the Sun.'
      ],
      a: 'About 2.1 m, 350 000 times the width of the nucleus.'
    },
    {
      title: 'Chargaff\'s arithmetic',
      q: 'A double-stranded DNA is 22 % adenine. What are the percentages of T, G and C, and its GC content?',
      steps: [
        'A pairs with T, so T = 22 %.',
        'A + T = 44 %, so G + C = 56 %; G pairs with C, so G = C = 28 %.',
        'By Marmur–Doty, $T_m \\approx 69.3 + 0.41 \\times 56 = 92$ °C.'
      ],
      a: 'T 22 %, G 28 %, C 28 %; GC content 56 %.'
    },
    {
      title: 'A sequence that reads the same both ways',
      q: 'Write the partner strand of 5′-GAATTC-3′, 5′ to 3′.',
      steps: [
        'Complement each base: 5′-GAATTC-3′ pairs with 3′-CTTAAG-5′.',
        'Read the partner from its own 5′ end: 5′-GAATTC-3′ — the same sequence.',
        'Such **palindromes** are where many restriction enzymes cut; GAATTC is the site of EcoRI ([[restriction-cloning]]).'
      ],
      a: '5′-GAATTC-3′: the site is its own reverse complement.'
    }
  ],
  quiz: [
    { q: 'A double-stranded DNA is 30 % G. What percentage is A?', answer: 20, unit: '%', why: 'G = C = 30 %, so A + T = 40 % and A = T = 20 %.' },
    { q: 'The reverse complement of 5′-ATGCC-3′ is…', choices: ['5′-GGCAT-3′', '5′-TACGG-3′', '5′-CCGTA-3′', '5′-ATGCC-3′'], a: 0, why: 'The complement, base by base, is 3′-TACGG-5′; read from its 5′ end it is GGCAT. TACGG is the complement written backwards (3′ → 5′); CCGTA is only reversed.' },
    { q: 'In any single strand of DNA, the number of A equals the number of T.', a: false, why: 'Chargaff\'s A = T holds for the double helix, because every A is paired with a T on the other strand. A single strand can have any composition.' },
    { q: 'Which DNA needs the higher temperature to separate its strands?', choices: ['one with 35 % GC', 'one with 65 % GC', 'both the same, if equally long', 'it depends only on the number of A–T pairs'], a: 1, why: 'G–C pairs have three hydrogen bonds and stack more strongly; by Marmur–Doty the 65 % GC DNA melts about 12 °C higher.' },
    { q: 'Why is the double helix the same width whatever its sequence?', choices: ['Every pair joins a purine to a pyrimidine', 'All four bases are the same size', 'The backbone stretches to fit', 'Histones hold it at a fixed width'], a: 0, why: 'A–T and G–C each join a two-ringed purine to a one-ringed pyrimidine, and the two pairs have almost the same shape, so every step spans the same distance.' }
  ],
  problems: [
    { q: 'The *E. coli* chromosome has $4.64\\times10^6$ bp. How long is it, in millimetres?', answer: 1.58, unit: 'mm', tol: 0.02, steps: ['$L = 4.64\\times10^6 \\times 0.34\\ \\mathrm{nm} = 1.58\\times10^6\\ \\mathrm{nm} = 1.58$ mm — about 800 times the length of the cell.'] },
    { q: 'How many turns of the double helix are in the 147 bp wrapped around one nucleosome?', answer: 14, tol: 0.03, steps: ['$n = 147/10.5 = 14$ turns.'] },
    { q: 'A DNA melts at 85 °C. Estimate its GC content with the Marmur–Doty rule, in per cent.', answer: 38.3, tol: 0.03, steps: ['$\\mathrm{GC} = (85 - 69.3)/0.41 = 38$ %.'] }
  ],
  applications: [
    'Paste a sequence for its GC content, melting temperature and reverse complement in [the sequence tools](#/tools/sequence/analyse).',
    'DNA profiling in forensics and paternity testing reads short repeats whose lengths differ between people.',
    'Designing PCR primers and probes: their GC content sets the temperature at which they bind.',
    'DNA nanotechnology ("DNA origami") folds long strands into shapes by programming which pieces pair.',
    'Storing digital data in synthetic DNA: in principle a gram could hold hundreds of petabytes.'
  ],
  history: 'Friedrich Miescher isolated "nuclein" from pus cells in 1869. In 1944 Oswald Avery, Colin MacLeod and Maclyn McCarty showed that DNA carries genetic information, and by 1950 Erwin Chargaff had found his base ratios. Rosalind Franklin and Raymond Gosling\'s X-ray photograph of B-DNA ("Photo 51", 1952) revealed a helix with a 3.4 nm repeat; James Watson and Francis Crick, shown Franklin\'s data without her knowledge, built their model and published it in *Nature* in April 1953, beside papers by Maurice Wilkins\'s and Franklin\'s groups. Watson, Crick and Wilkins shared the 1962 Nobel Prize; Franklin had died in 1958.',
  sim: 'molb-helix'
},

{
  id: 'dna-replication', parent: 'dna-to-protein', title: 'DNA replication', level: 2,
  short: 'Before a cell divides it copies all its DNA. The two strands separate and each becomes the template for a new partner, so every daughter molecule keeps one old strand — semiconservative replication — with about one mistake in a billion bases.',
  keywords: ['replication', 'semiconservative', 'Meselson–Stahl', 'DNA polymerase', 'helicase', 'primase', 'RNA primer', 'leading strand', 'lagging strand', 'Okazaki fragments', 'DNA ligase', 'origin of replication', 'replication fork', 'proofreading', 'mismatch repair', 'topoisomerase', 'sliding clamp', 'telomere', 'telomerase', 'S phase'],
  prereq: ['dna-structure', 'enzymes', 'cell-cycle'],
  related: ['mutations', 'pcr', 'mitosis', 'dna-sequencing', 'chemistry:isotopes', 'medicine:cancer-biology'],
  body: `
Every time a cell divides it must hand each daughter a complete copy of its DNA — 6.2 billion base pairs in a human cell, 4.6 million in *E. coli* — and it must do so fast and almost without error. The base-pairing rule makes the principle simple: unzip the helix, and let each old strand serve as the **template** for a new complementary strand. Each daughter molecule then contains one old and one new strand. This is **semiconservative** replication.

### The experiment that proved it
In 1958 Matthew Meselson and Franklin Stahl grew *E. coli* for many generations on the heavy nitrogen isotope $\\ce{^{15}N}$, then moved the cells to ordinary $\\ce{^{14}N}$ and took samples after each generation. DNA spun in a caesium chloride density gradient settles where its density matches the solution, so heavy, hybrid and light DNA form separate bands. After one generation there was a single band exactly halfway — every molecule was a hybrid. After two, half the DNA was hybrid and half light. That rules out **conservative** copying (the old helix kept whole, which would give heavy and light bands after one generation) and, with a heating test that separated intact heavy and light strands, **dispersive** copying (old and new mixed along every strand). Try all three models in the simulation below.

### The machinery at the fork
Replication starts at **origins** and moves outwards in both directions, so each origin makes a bubble with two **replication forks**. At each fork a team of proteins works together:

| Protein | Job |
|---|---|
| Helicase | unwinds the helix, using ATP |
| Single-strand binding protein | keeps the separated strands apart |
| Topoisomerase (gyrase in bacteria) | relieves the twisting that builds up ahead of the fork |
| Primase | lays down a short RNA **primer**, about 10 nucleotides |
| DNA polymerase (Pol III in bacteria; Pol ε and δ in eukaryotes) | extends the primer, adding nucleotides to the 3′ end |
| Sliding clamp (β clamp; PCNA) | keeps the polymerase on the DNA for thousands of bases |
| Pol I, or RNase H and FEN1 | remove the primers and fill the gaps |
| DNA ligase | seals the last nicks in the backbone |

### Leading and lagging strands
DNA polymerase has two limitations: it cannot start a chain from nothing (it needs a primer), and it can only add to a 3′ end, so a new strand always grows **5′ → 3′**. The two template strands run in opposite directions, so at a fork one new strand — the **leading strand** — can grow continuously towards the fork, while the other — the **lagging strand** — must be made backwards, away from the fork, in short pieces. These **Okazaki fragments** are 1000–2000 nucleotides long in bacteria and 100–200 in eukaryotes; each needs its own primer, and ligase stitches them together. Because the forks of a bubble move in opposite directions, the same template strand is copied continuously on one side of an origin and in fragments on the other.

### Speed, and why cells need many origins
| | *E. coli* | Human cell |
|---|---|---|
| DNA to copy | 4.6 × 10⁶ bp | 6.2 × 10⁹ bp |
| Fork speed | about 1000 nt/s | about 20–50 nt/s |
| Origins | one (oriC) | tens of thousands used per S phase |
| Time to copy | about 40 min | S phase lasts about 8 h |

With one origin and two forks, *E. coli* needs about 40 minutes — yet in rich medium it divides every 20. It manages by starting new rounds before the old ones finish, so a fast-growing cell holds partly replicated chromosomes with several forks. Human forks are slower and the genome is 1300 times bigger: with one origin per chromosome it would take weeks. Origins fire in a set order through S phase — open, active regions early, packed heterochromatin late.

### One error in a billion
Polymerases pick the right nucleotide about 99.99–99.999 % of the time. A built-in 3′ → 5′ **proofreading** exonuclease removes most wrong bases as soon as they are added (about 100-fold better), and **mismatch repair** then fixes most that escape (another 100–1000-fold), for about one error per $10^9$–$10^{10}$ bases copied. A human cell division still leaves a few new changes — the raw material of [[mutations]].

### The end problem
On a linear chromosome the last stretch of the lagging strand cannot be primed, so the ends shorten by some 50–100 bp per division. The ends are capped by **telomeres** — thousands of copies of TTAGGG in humans, 5–15 kb in all — and replenished by **telomerase**, an enzyme that carries its own RNA template. Stem cells and germ cells make telomerase; most body cells do not, and about nine in ten cancers switch it back on ([[medicine:cancer-biology|cancer biology]]).

> [!tip] The polymerase chain reaction ([[pcr]]) is replication in a tube: heat separates the strands, primers mark the start, and a heat-stable polymerase copies both — doubling a chosen stretch of DNA every cycle.
`,
  ideas: [
    'Replication is semiconservative: each new helix has one parental and one new strand (Meselson and Stahl, 1958).',
    'DNA polymerase needs a primer and adds only to 3′ ends, so new strands grow 5′ → 3′.',
    'At each fork the leading strand is made continuously and the lagging strand in Okazaki fragments, joined by ligase.',
    'Bacteria use one origin and fast forks (about 1000 nt/s); human cells use tens of thousands of origins and slower forks (tens of nt/s).',
    'Base selection, proofreading and mismatch repair together bring errors down to about one in 10⁹–10¹⁰ bases.'
  ],
  pitfalls: [
    'The lagging strand is made in pieces because that strand is copied more slowly — Both are copied at the same speed; the pieces are needed because polymerase can only extend 5′ → 3′, and on that strand this means moving away from the fork.',
    'Replication starts at one end of the chromosome and runs to the other — It starts at internal origins and runs both ways; a human chromosome has thousands of origins.',
    'DNA polymerase can start a new strand wherever it is needed — It cannot: it only extends an existing 3′ end, so every new strand, and every Okazaki fragment, begins with an RNA primer.'
  ],
  formulas: [
    {
      name: 'Time to copy a genome',
      expr: 't = N/(2*n*v)', tex: 't = \\dfrac{N}{2\\,n\\,v}',
      vars: {
        t: { name: 'replication time', q: 'time', unit: 'min' },
        N: { name: 'genome size', q: false, unit: 'bp', value: 4.64e6 },
        n: { name: 'origins firing together', q: 'count', int: true, value: 1, min: 1 },
        v: { name: 'fork speed', q: false, unit: 'nt/s', value: 1000 }
      },
      note: 'Two forks per origin, all origins firing at once and forks meeting halfway. Real eukaryotic origins fire in a programme through S phase, so S phase is several times longer.',
      practice: { unknowns: ['t', 'v', 'n'] },
      stories: {
        t: 'A bacterium has a {N} genome with a single origin, and its forks move at {v}. How long does one round of replication take?',
        v: 'A {N} chromosome with one origin is copied in {t}. How fast do its forks move?',
        n: 'To copy {N} in {t} with forks moving at {v}, how many origins must fire together?'
      }
    },
    {
      name: 'New errors per replication',
      expr: 'M = mu*N', tex: 'M = \\mu N',
      vars: {
        M: { name: 'expected new errors per genome copy', q: 'count' },
        mu: { name: 'error rate per base pair copied', value: 1e-9, tex: '\\mu' },
        N: { name: 'genome size', q: false, unit: 'bp', value: 6.2e9 }
      },
      note: 'After proofreading and mismatch repair. The actual number in a given division follows a Poisson distribution around this mean.',
      stories: { M: 'A human cell copies {N} with an error rate of {mu} per base pair. How many new errors does one division leave, on average?', mu: 'A genome of {N} picks up {M} new errors per replication. What is the error rate per base pair?' }
    },
    {
      name: 'Meselson–Stahl: hybrid DNA after g generations',
      expr: 'f = 2^(1 - g)', tex: 'f_{hyb} = 2^{\\,1 - g}',
      vars: {
        f: { name: 'fraction of DNA molecules that are hybrid (heavy/light)', q: 'ratio', unit: '%', tex: 'f_{hyb}' },
        g: { name: 'generations in light medium', q: 'count', int: true, value: 3, min: 1, max: 20 }
      },
      note: 'Semiconservative replication, starting from fully heavy DNA; the rest is light. The two original heavy strands are never lost — they are shared out among ever more molecules.',
      stories: { f: 'Heavy-labelled bacteria grow for {g} in light medium. What fraction of their DNA molecules are hybrid?', g: 'After how many generations in light medium are only {f} of the DNA molecules hybrid?' }
    }
  ],
  examples: [
    {
      title: 'Copying the *E. coli* chromosome',
      q: '*E. coli* has $4.64\\times10^6$ bp, one origin and forks moving at 1000 nt/s. How long does a round of replication take, and how can the cell divide every 20 minutes?',
      steps: [
        'Two forks share the work: $t = 4.64\\times10^6/(2\\times1\\times1000) = 2320$ s $\\approx 39$ min.',
        'Plus about 20 min to separate the chromosomes and divide, a cell cycle cannot be shorter than an hour — if rounds happened one at a time.',
        'In rich medium *E. coli* starts new rounds at the origin before the previous round has finished, so each newborn cell already carries a half-copied chromosome.'
      ],
      a: 'About 39 min per round; overlapping rounds let the cell divide every 20 min.'
    },
    {
      title: 'Why human cells need so many origins',
      q: 'A human cell copies $6.2\\times10^9$ bp with forks at 50 nt/s. How long would it take with one origin per chromosome (46), and with 30 000 origins firing together?',
      steps: [
        'One origin per chromosome: $t = 6.2\\times10^9/(2\\times46\\times50) = 1.35\\times10^6$ s — about 16 days.',
        '30 000 origins at once: $t = 6.2\\times10^9/(2\\times30\\,000\\times50) \\approx 2070$ s — about 35 min.',
        'The measured S phase lasts about 8 hours, because origins fire in a timed sequence rather than all together.'
      ],
      a: 'About 16 days with 46 origins; about 35 min if 30 000 fired together (S phase is really about 8 h).'
    },
    {
      title: 'Reading Meselson and Stahl\'s tubes',
      q: 'Heavy-labelled bacteria grow three generations in light medium. What bands appear under semiconservative replication?',
      steps: [
        'Each original molecule has become $2^3 = 8$ molecules; the two original heavy strands sit in two of them.',
        'Hybrid fraction: $f = 2^{1-3} = 25$ %; the other 75 % are fully light.',
        'Two bands: a faint hybrid band and a strong light band — and no heavy band ever again.'
      ],
      a: '25 % hybrid, 75 % light.'
    }
  ],
  quiz: [
    { q: 'Heavy DNA is copied for two generations in light medium. Under **semiconservative** replication the gradient shows…', choices: ['one hybrid band', 'a hybrid and a light band, equal amounts', 'a heavy and a light band', 'one band a quarter of the way from light to heavy'], a: 1, why: 'Four molecules: two carry an old heavy strand (hybrid) and two are all new (light). One band a quarter of the way is the dispersive prediction; heavy plus light is the conservative one.' },
    { q: 'Why is the lagging strand made in fragments?', choices: ['Polymerase can only add nucleotides to a 3′ end, and on that strand this means working away from the fork', 'Its template is damaged more often', 'Primase works only on that strand', 'The helicase blocks the polymerase on that side'], a: 0, why: 'New strands grow 5′ → 3′ only. On the lagging-strand template this direction points away from the moving fork, so synthesis must restart again and again as more template is exposed.' },
    { q: 'A 5-million-bp bacterial genome has one origin and forks at 1000 nt/s. How many minutes does a round of replication take?', answer: 41.7, unit: 'min', why: '$t = 5\\times10^6/(2\\times1000) = 2500$ s = 41.7 min.' },
    { q: 'DNA polymerase can begin a new strand on a bare single-stranded template.', a: false, why: 'It can only extend an existing 3′ end. Primase makes a short RNA primer first; the primers are later removed and replaced with DNA.' },
    { q: 'Which enzyme joins Okazaki fragments into a continuous strand?', choices: ['DNA ligase', 'helicase', 'primase', 'topoisomerase'], a: 0, why: 'Ligase seals the nick between neighbouring fragments by making the last phosphodiester bond, using ATP (or NAD⁺ in bacteria).' }
  ],
  problems: [
    { q: 'Okazaki fragments in *E. coli* average about 1500 nucleotides. Roughly how many are made to copy its $4.6\\times10^6$ bp genome once? (Each fork makes one lagging strand; together they cover one strand\'s length.)', answer: 3070, tol: 0.05, steps: ['The lagging strands of all forks together cover one full strand: $4.6\\times10^6$ nt.', '$4.6\\times10^6/1500 \\approx 3070$ fragments, each with its own primer.'] },
    { q: 'With an error rate of $10^{-9}$ per base pair, how many new errors does copying a human genome ($6.2\\times10^9$ bp) leave, on average?', answer: 6.2, tol: 0.02, steps: ['$M = 10^{-9}\\times6.2\\times10^9 = 6.2$ errors per division.'] },
    { q: 'What fraction of DNA molecules are hybrid after 5 generations in light medium (semiconservative)? Give a percentage.', answer: 6.25, unit: '%', tol: 0.02, steps: ['$f = 2^{1-5} = 1/16 = 6.25$ %.'] }
  ],
  applications: [
    'PCR copies DNA in a test tube using the same rules: primers, a polymerase and 5′ → 3′ synthesis.',
    'Many anticancer and antiviral drugs are nucleotide look-alikes that stop replication once built into DNA.',
    'Telomere length and telomerase are studied in ageing and in cancer, where most tumours reactivate telomerase.',
    'DNA sequencing by synthesis watches a polymerase add one labelled nucleotide at a time.'
  ],
  history: 'Arthur Kornberg purified the first DNA polymerase in 1956 (Nobel Prize 1959). Matthew Meselson and Franklin Stahl\'s 1958 density-gradient experiment, often called the most beautiful experiment in biology, settled how DNA is copied. John Cairns photographed a replicating *E. coli* chromosome in 1963, and Reiji and Tsuneko Okazaki discovered the short fragments of the lagging strand in 1966–68. Elizabeth Blackburn and Carol Greider found telomerase in 1984 (Nobel Prize 2009, with Jack Szostak).',
  sim: ['molb-fork', 'molb-meselson']
},

{
  id: 'transcription', parent: 'dna-to-protein', title: 'Transcription', level: 2,
  short: 'Transcription copies the sequence of a gene into RNA. RNA polymerase opens the DNA at a promoter, reads the template strand and builds an RNA with the same sequence as the coding strand (U in place of T), at a few tens of nucleotides a second.',
  keywords: ['transcription', 'RNA polymerase', 'promoter', 'TATA box', '−10 and −35 boxes', 'sigma factor', 'general transcription factors', 'template strand', 'coding strand', 'sense', 'antisense', 'initiation', 'elongation', 'termination', 'terminator', 'Rho', 'transcription bubble', 'mRNA', 'rRNA', 'tRNA', 'mRNA half-life', 'rifampicin', 'α-amanitin'],
  prereq: ['dna-structure', 'nucleic-acids', 'enzymes'],
  related: ['rna-processing', 'translation', 'lac-operon', 'eukaryotic-regulation', 'noncoding-rna', 'gene-expression-tools', 'medicine:dna-genes'],
  body: `
A cell does not use its DNA directly to make proteins. It copies the gene it needs into a working copy of **RNA** — as you might photocopy one recipe rather than take the whole cookbook into the kitchen. The copying is **transcription**, and because one gene can be transcribed hundreds of times, it is also the cell's main way of deciding how much of each protein to make.

### Which strand is read
RNA polymerase reads one DNA strand, the **template strand** (also called antisense), from its 3′ end towards its 5′ end, and builds an RNA that grows 5′ → 3′, pairing A with U (RNA has uracil in place of thymine), T with A, G with C and C with G. The result has the same sequence as the other DNA strand, the **coding strand** (sense), with U for T:

| Strand | Sequence |
|---|---|
| Coding strand (DNA) | 5′-ATG GCC AAG TGA-3′ |
| Template strand (DNA) | 3′-TAC CGG TTC ACT-5′ |
| mRNA | 5′-AUG GCC AAG UGA-3′ |

Which strand is the template differs from gene to gene: neighbouring genes may be read in opposite directions. RNA differs from DNA in its sugar (ribose), its uracil, and in being single-stranded and short-lived. Transcription needs no primer: RNA polymerase can start a chain from scratch.

### Three stages
1. **Initiation.** The polymerase must find the start of a gene, the **promoter**. In bacteria a detachable **sigma factor** recognises two short boxes about 10 and 35 bases upstream of the start (consensus TATAAT and TTGACA). In eukaryotes, **general transcription factors** assemble first — TFIID binds the **TATA box** about 25–30 bp upstream in many promoters — then recruit RNA polymerase II through the large Mediator complex. The polymerase melts about 12–14 bp to form a **transcription bubble**.
2. **Elongation.** The polymerase moves along at roughly 20–80 nucleotides a second, holding an RNA–DNA hybrid of about 8–9 bp; the DNA closes behind it. It makes about one error in $10^5$ bases — far worse than DNA replication, but errors in RNA are not inherited.
3. **Termination.** In bacteria the RNA folds into a GC-rich hairpin followed by a run of U's that shakes it loose, or the Rho helicase pulls it off. In eukaryotes, cutting the RNA at the poly(A) signal ([[rna-processing]]) makes the polymerase fall off further downstream.

### Polymerases compared
| | Bacteria (*E. coli*) | Eukaryotes |
|---|---|---|
| Enzymes | one core enzyme (5 subunits) + σ | Pol I (ribosomal RNA), Pol II (mRNA, most microRNAs), Pol III (tRNA, 5S rRNA) |
| Size | about 400 kDa | Pol II: 12 subunits, about 550 kDa |
| Speed | 40–80 nt/s | about 20–70 nt/s |
| Blocked by | rifampicin (an antibiotic) | α-amanitin of the death-cap mushroom (Pol II) |
| Translation | begins while the RNA is still being made | after processing and export from the nucleus |

The differences between the bacterial and our polymerase are why rifampicin can kill bacteria without harming us, and why eating death caps destroys the liver: its cells cannot make mRNA.

### How long, and how much?
At about 40 nt/s a typical 30 kb human gene takes some 12 minutes to transcribe; the 2.2-million-base dystrophin gene takes about 16 hours. How much mRNA a cell holds depends on a balance: new molecules are made at rate $k$ and each is destroyed with a half-life $t_{1/2}$, so the number settles at $k\\,t_{1/2}/\\ln 2$. Bacterial mRNAs last only 2–5 minutes, so bacteria can change course quickly; mammalian mRNAs have a median half-life of several hours, from minutes for signalling genes such as *FOS* to days for globin.

> [!key] The template strand is read 3′ → 5′; the RNA is made 5′ → 3′ and matches the coding strand, with U for T. A promoter says where to start, and how often polymerases start sets how much RNA is made.

You can transcribe, reverse-complement and translate any sequence with the [sequence tools](#/tools/sequence), and watch an RNA grow in real time in the simulation below.
`,
  ideas: [
    'RNA polymerase reads the template strand 3′ → 5′ and makes RNA 5′ → 3′, with the sequence of the coding strand (U for T).',
    'Transcription starts at a promoter (σ factor in bacteria; general transcription factors and the TATA box in eukaryotes) and needs no primer.',
    'Elongation runs at a few tens of nucleotides a second; the error rate is about 1 in 10⁵.',
    'Bacteria have one RNA polymerase and translate while they transcribe; eukaryotes have three, and process and export the RNA first.',
    'The amount of an mRNA is set by its rate of synthesis and its half-life: m = k·t½/ln 2.'
  ],
  pitfalls: [
    'The mRNA has the sequence of the template strand — It is complementary to the template, so it has the sequence of the coding strand, with U in place of T.',
    'One strand of a chromosome is always the template — Each gene has its own template strand; neighbouring genes are often read from opposite strands.',
    'RNA polymerase, like DNA polymerase, needs a primer — It starts chains on its own at the promoter; only DNA polymerases need primers.'
  ],
  formulas: [
    {
      name: 'Time to transcribe a gene',
      expr: 't = L/v', tex: 't = \\dfrac{L}{v}',
      vars: {
        t: { name: 'transcription time', q: 'time', unit: 'min' },
        L: { name: 'length of the transcribed region', q: false, unit: 'nt', value: 30000 },
        v: { name: 'polymerase speed', q: false, unit: 'nt/s', value: 40 }
      },
      note: 'One polymerase from start to end, ignoring pauses. Many polymerases can follow each other on the same gene.',
      stories: {
        t: 'RNA polymerase II moves at {v} along a gene of {L}. How long does one transcript take?',
        v: 'A {L} gene is transcribed in {t}. How fast does the polymerase move?',
        L: 'A polymerase moving at {v} takes {t} to reach the end of a gene. How long is the gene?'
      }
    },
    {
      name: 'Steady-state number of mRNA molecules',
      expr: 'm = k*th/ln(2)', tex: 'm = \\dfrac{k\\,t_{1/2}}{\\ln 2}',
      vars: {
        m: { name: 'mRNA molecules per cell', q: 'count' },
        k: { name: 'transcription rate', q: 'rate', unit: '1/h', value: 2 },
        th: { name: 'mRNA half-life', q: 'time', unit: 'h', value: 9, tex: 't_{1/2}' }
      },
      note: 'Synthesis at a constant rate k, first-order decay; ln 2/t½ is the decay constant. Cell division also dilutes mRNA — add it to the decay rate for fast-growing cells.',
      practice: { unknowns: ['m', 'k', 'th'] },
      stories: {
        m: 'A gene is transcribed {k} and its mRNA has a half-life of {th}. How many copies of the mRNA does the cell hold at steady state?',
        k: 'A cell holds {m} copies of an mRNA whose half-life is {th}. How fast is the gene transcribed?',
        th: 'A gene is transcribed {k} and the cell holds {m} copies of its mRNA. What is the mRNA half-life?'
      }
    }
  ],
  examples: [
    {
      title: 'The longest gene',
      q: 'The human dystrophin gene spans about 2.2 million bases. At 40 nt/s, how long does one transcript take?',
      steps: [
        '$t = 2.2\\times10^6/40 = 55\\,000$ s.',
        '$55\\,000/3600 \\approx 15$ h.'
      ],
      a: 'About 15–16 hours for a single mRNA — longer than the cell cycle of many cells.'
    },
    {
      title: 'Bacterial and human mRNA levels',
      q: 'A bacterial gene is transcribed once a minute and its mRNA lasts 3 min (half-life). A human gene is transcribed twice an hour and its mRNA has a half-life of 9 h. How many mRNA copies does each cell hold?',
      steps: [
        'Bacterium: $m = 1\\ \\mathrm{min^{-1}} \\times 3\\ \\mathrm{min}/0.693 = 4.3$ copies.',
        'Human: $m = 2\\ \\mathrm{h^{-1}}\\times 9\\ \\mathrm{h}/0.693 = 26$ copies.',
        'The human gene is transcribed 30 times less often, yet the cell holds six times more mRNA — because each molecule lasts 180 times longer. The bacterium pays for speed: it can drop an mRNA to a tenth in 10 minutes.'
      ],
      a: 'About 4 copies in the bacterium and 26 in the human cell.'
    },
    {
      title: 'From template to message',
      q: 'The template strand of a short stretch of DNA reads 3′-TACGGATTC-5′. Write the mRNA and the coding strand.',
      steps: [
        'Pair each template base: T→A, A→U, C→G, G→C. The mRNA, made 5′ → 3′, is 5′-AUGCCUAAG-3′.',
        'The coding strand is complementary to the template: 5′-ATGCCTAAG-3′ — the mRNA with T for U.'
      ],
      a: 'mRNA 5′-AUGCCUAAG-3′; coding strand 5′-ATGCCTAAG-3′.'
    }
  ],
  quiz: [
    { q: 'The coding strand of a gene reads 5′-ATGTTC-3′. The mRNA reads…', choices: ['5′-AUGUUC-3′', '5′-UACAAG-3′', '5′-GAACAU-3′', '5′-ATGTTC-3′'], a: 0, why: 'The mRNA has the coding-strand sequence with U for T. UACAAG is the complement (the template read in the wrong direction); GAACAU is the reverse complement; ATGTTC is still DNA.' },
    { q: 'How many minutes does a polymerase moving at 40 nt/s take to transcribe a 30 000-nt gene?', answer: 12.5, unit: 'min', why: '$30\\,000/40 = 750$ s = 12.5 min.' },
    { q: 'RNA polymerase needs an RNA primer to begin a transcript.', a: false, why: 'RNA polymerases start new chains on their own at the promoter. It is DNA polymerase that cannot start without a primer — and the primers it uses are made by an RNA polymerase, primase.' },
    { q: 'Rifampicin blocks bacterial RNA polymerase but not ours. What does this show?', choices: ['Bacterial and eukaryotic RNA polymerases differ in structure', 'Human cells do not transcribe genes', 'Rifampicin cannot enter any cell', 'Bacteria do not need RNA polymerase'], a: 0, why: 'Selective toxicity: the drug fits a pocket in the bacterial enzyme that our Pol I, II and III do not have — the same idea as the antibiotics that target bacterial ribosomes.' },
    { q: 'An mRNA is made at a steady rate. If its half-life doubles, its steady-state level…', choices: ['doubles', 'halves', 'stays the same', 'rises fourfold'], a: 0, why: '$m = k\\,t_{1/2}/\\ln 2$ is proportional to the half-life: each molecule survives twice as long, so twice as many accumulate.' }
  ],
  problems: [
    { q: 'A cell holds 60 copies of an mRNA whose half-life is 2 h. How many new copies per hour must it make?', answer: 20.8, unit: '1/h', tol: 0.02, steps: ['$k = m\\ln2/t_{1/2} = 60\\times0.693/2 = 20.8$ per hour.'] },
    { q: 'Behind a leading polymerase on a strongly expressed gene, a new polymerase starts every 2 s. At 40 nt/s, how far apart are they along the DNA, in nucleotides?', answer: 80, unit: 'nt', tol: 0.02, steps: ['Distance = speed × interval = $40\\times2 = 80$ nt — polymerases can follow each other closely, like cars on a road.'] }
  ],
  applications: [
    'Rifampicin, a key drug against tuberculosis, blocks bacterial RNA polymerase.',
    'Measuring which genes are transcribed (RNA sequencing) shows what a cell or tumour is doing ([[gene-expression-tools]]).',
    'Protein production in biotechnology puts a gene behind a strong, switchable promoter.',
    'mRNA vaccines and medicines use RNA made in the laboratory by a bacteriophage RNA polymerase.'
  ],
  history: 'The enzyme that makes RNA from a DNA template was found independently in 1960 by Samuel Weiss, Jerard Hurwitz and Audrey Stevens. Sigma factor was identified by Richard Burgess and Andrew Travers in 1969. Roger Kornberg solved the atomic structure of RNA polymerase II caught in the act of transcription and received the 2006 Nobel Prize in Chemistry — 47 years after his father Arthur received the Medicine prize for DNA polymerase.',
  sim: 'molb-express'
},

{
  id: 'rna-processing', parent: 'dna-to-protein', title: 'RNA processing and splicing', level: 2,
  short: 'In eukaryotes the first RNA copy of a gene is edited before it leaves the nucleus: a cap goes on the 5′ end, a poly(A) tail on the 3′ end, and the introns are cut out by the spliceosome. Choosing different exons — alternative splicing — lets one gene make several proteins.',
  keywords: ['pre-mRNA', 'RNA processing', '5′ cap', 'poly(A) tail', 'polyadenylation', 'splicing', 'intron', 'exon', 'spliceosome', 'snRNA', 'snRNP', 'GU–AG rule', 'branch point', 'lariat', 'alternative splicing', 'isoform', 'exon skipping', 'Dscam', 'nonsense-mediated decay', 'RNA editing', 'nuclear export'],
  prereq: ['transcription', 'nucleus-ribosomes', 'eukaryotic-cells'],
  related: ['translation', 'eukaryotic-regulation', 'noncoding-rna', 'mutations', 'genomics', 'human-genetics'],
  body: `
In bacteria the RNA that comes off a gene is ready to use — ribosomes start on it before it is even finished. In eukaryotes the first transcript, the **pre-mRNA**, is a rough draft. It is edited in the nucleus while it is still being made, and only the finished message is exported to the cytoplasm.

### Genes in pieces
Most of our genes are **split**: the parts that end up in the mRNA, the **exons**, are separated by **introns** that are cut out. A typical human protein-coding gene spans about 25–30 kb but gives an mRNA of only 2–3 kb, so roughly nine-tenths of each pre-mRNA is thrown away. Exons average about 150 nucleotides, while introns average several thousand — a few are hundreds of thousands long. Altogether introns make up about a third of our genome, exons less than 2 %.

### Three edits
| Edit | What happens | Why it matters |
|---|---|---|
| **5′ cap** | a 7-methylguanosine is attached back-to-front (5′–5′) after the first 20–30 nucleotides | protects the 5′ end, helps export, recruits the ribosome |
| **Poly(A) tail** | the RNA is cut 10–30 nt past an AAUAAA signal; poly(A) polymerase adds about 200–250 A's | protects the 3′ end; the tail shortens with time, a clock for decay |
| **Splicing** | introns removed, exons joined | makes the reading frame continuous; allows alternative forms |

### How splicing works
Introns are marked by short signals: almost all begin with **GU** and end with **AG**, and carry a **branch-point A** some 20–50 nucleotides before the end. The **spliceosome** — five small nuclear RNAs (U1, U2, U4, U5, U6) packaged with about 150 proteins — recognises these signals by base pairing and carries out two chemical steps. First the 2′-OH of the branch-point A attacks the 5′ splice site, looping the intron into a **lariat**; then the freed end of the first exon attacks the 3′ splice site, joining the exons and releasing the lariat. The catalysis is done by the RNA itself: some introns in other organisms splice themselves with no protein at all, a clue that RNA once ran all of life's chemistry.

A splice site one base out of place would shift the reading frame, so accuracy matters. Roughly one in ten disease-causing variants in humans disturbs splicing — for example in some forms of β-thalassaemia and of cystic fibrosis.

### One gene, many proteins
The spliceosome does not always choose the same exons. In **alternative splicing** an exon can be skipped or included, a splice site shifted, an intron retained, or one of a set of mutually exclusive exons chosen. About 95 % of human multi-exon genes are spliced in more than one way, often differently in different tissues, which is part of how some 20 000 genes make a far larger variety of proteins. Two famous cases:

- The fruit-fly gene *Dscam* has four clusters of alternative exons with 12, 48, 33 and 2 choices: $12\\times48\\times33\\times2 = 38\\,016$ possible proteins, used by nerve cells to tell their own branches from others'.
- In mammals, the calcitonin gene makes the hormone calcitonin in the thyroid but a different peptide, CGRP, in nerve cells — the same pre-mRNA, spliced two ways.

### Quality control
The spliceosome leaves a protein marker (the exon junction complex) at each join. If a ribosome meets a stop codon well before the last junction, the message is probably faulty, and **nonsense-mediated decay** destroys it — which is why many nonsense [[mutations]] give no protein at all rather than a short one. Some RNAs are also **edited** after transcription: an enzyme called ADAR turns particular A's into inosine, read as G, in brain messages.

> [!key] Cap, tail and splicing turn a pre-mRNA into a message fit for export. Splicing removes introns with the precision of a single nucleotide, and choosing among exons gives one gene several proteins.
`,
  ideas: [
    'Eukaryotic pre-mRNA is capped at the 5′ end, given a poly(A) tail at the 3′ end and spliced before export.',
    'Introns begin with GU and end with AG; the spliceosome (snRNAs plus proteins) removes them as lariats in two steps.',
    'About nine-tenths of a typical human pre-mRNA is intron; exons are less than 2 % of the genome.',
    'Alternative splicing lets one gene make several proteins; about 95 % of human multi-exon genes use it.',
    'Messages with premature stop codons are destroyed by nonsense-mediated decay.'
  ],
  pitfalls: [
    'Introns are junk that the cell merely tolerates — Many contain regulatory sequences and non-coding RNA genes, and splicing itself enables alternative forms and quality control, although much intron sequence is indeed not under strong selection.',
    'One gene makes exactly one protein — Alternative splicing, alternative start sites and alternative poly(A) sites give most human genes several products.',
    'Bacteria splice their mRNAs too — Bacterial genes almost never have spliceosomal introns; their mRNA is translated as it is made, often with several genes on one message.'
  ],
  formulas: [
    {
      name: 'Isoforms from independent cassette exons',
      expr: 'N = 2^k', tex: 'N = 2^{k}',
      vars: {
        N: { name: 'possible mRNA isoforms', q: 'count' },
        k: { name: 'number of independent optional exons', q: 'count', int: true, value: 4, min: 0, max: 40 }
      },
      note: 'Each optional (cassette) exon is either included or skipped, independently. Real genes use only some combinations; for mutually exclusive clusters multiply the number of choices in each cluster instead.',
      stories: { N: 'A gene has {k} exons that can each be included or skipped. How many different mRNAs could it make?', k: 'A gene could make {N} isoforms by including or skipping exons independently. How many optional exons does it have?' }
    }
  ],
  examples: [
    {
      title: 'How much is thrown away',
      q: 'A pre-mRNA of 30 000 nt contains 10 exons averaging 250 nt. What fraction of it is removed as introns?',
      steps: [
        'Exons: $10\\times250 = 2500$ nt.',
        'Introns: $30\\,000 - 2500 = 27\\,500$ nt, which is 92 % of the transcript.',
        'Transcribing the introns at 40 nt/s costs about 11 minutes of polymerase time for every copy of this gene.'
      ],
      a: 'About 92 % is intron; the mRNA keeps 2500 nt plus its cap and tail.'
    },
    {
      title: 'Dscam\'s 38 016 proteins',
      q: 'The *Dscam* gene has alternative exon clusters with 12, 48, 33 and 2 mutually exclusive choices. How many different proteins can it encode? How does this compare with the fly\'s roughly 14 000 genes?',
      steps: [
        'Exactly one exon is chosen from each cluster, so the numbers multiply: $12\\times48\\times33\\times2 = 38\\,016$.',
        'That is almost three times as many isoforms as the fly has genes.'
      ],
      a: '38 016 isoforms from a single gene.'
    }
  ],
  quiz: [
    { q: 'Which part of a pre-mRNA is removed by splicing?', choices: ['introns', 'exons', 'the 5′ cap', 'the poly(A) tail'], a: 0, why: 'Introns are cut out and exons joined. The cap and tail are added, not removed.' },
    { q: 'Almost all spliceosomal introns begin and end with…', choices: ['GU … AG', 'AG … GU', 'AUG … UAA', 'AAUAAA … poly(A)'], a: 0, why: 'The GU–AG rule: the 5′ splice site starts with GU, the 3′ site ends with AG. AUG and UAA are start and stop codons; AAUAAA is the poly(A) signal.' },
    { q: 'A gene has 5 exons that can each be included or skipped independently. How many different mRNAs could it make?', answer: 32, why: '$2^5 = 32$ combinations (including the one with every optional exon skipped).' },
    { q: 'Bacterial mRNAs are normally capped and spliced before translation.', a: false, why: 'Bacteria have no nucleus: ribosomes start translating while the RNA is still being made, and bacterial genes almost never contain spliceosomal introns.' },
    { q: 'A nonsense mutation in an early exon often gives no protein at all, rather than a short one. Why?', choices: ['Nonsense-mediated decay destroys mRNAs with a premature stop codon', 'The ribosome cannot find the start codon', 'Transcription stops at the mutation', 'The poly(A) tail is not added'], a: 0, why: 'A stop codon well upstream of the last exon junction marks the message as faulty, and it is degraded before much protein is made.' }
  ],
  problems: [
    { q: 'A gene has three clusters of mutually exclusive exons with 4, 3 and 5 choices, plus two independent cassette exons. How many isoforms are possible?', answer: 240, tol: 0.001, steps: ['Clusters: $4\\times3\\times5 = 60$.', 'Two cassette exons: $2^2 = 4$.', 'Total: $60\\times4 = 240$.'] }
  ],
  applications: [
    'Nusinersen, an antisense drug for spinal muscular atrophy, works by changing how the *SMN2* pre-mRNA is spliced.',
    'Exon-skipping drugs aim to restore the reading frame of a mutated dystrophin gene in Duchenne muscular dystrophy.',
    'Gene sequencing reports classify variants near splice sites because they can disrupt splicing.',
    'mRNA medicines are made with a cap and a poly(A) tail so that cells treat them as their own messages.'
  ],
  history: 'In 1977 the groups of Phillip Sharp and Richard Roberts found, by looking at RNA–DNA hybrids under the electron microscope, that adenovirus messages are stitched together from separate pieces of the genome (Nobel Prize 1993). Thomas Cech showed in 1982 that an intron of the ciliate *Tetrahymena* splices itself, the first known RNA enzyme (Nobel Prize in Chemistry 1989, with Sidney Altman).'
},

{
  id: 'genetic-code', parent: 'dna-to-protein', title: 'The genetic code', level: 2,
  short: 'The genetic code is the dictionary that turns three-letter words of mRNA — codons — into amino acids. Its 64 codons stand for 20 amino acids and three stop signals; it is redundant, read in a fixed frame without gaps, and almost the same in every living thing.',
  keywords: ['genetic code', 'codon', 'triplet', 'anticodon', 'degeneracy', 'redundancy', 'synonymous codon', 'wobble', 'start codon', 'AUG', 'stop codon', 'UAA', 'UAG', 'UGA', 'reading frame', 'open reading frame', 'ORF', 'universality', 'mitochondrial code', 'selenocysteine', 'codon usage', 'codon table'],
  prereq: ['transcription', 'amino-acids', 'nucleic-acids'],
  related: ['translation', 'mutations', 'bioinformatics', 'evidence-evolution', 'genomics', 'math:combinatorics'],
  body: `
Four letters in the nucleic acid, twenty amino acids in proteins: the cell needs a code. One letter per amino acid gives only 4 words and two letters only $4^2 = 16$ — too few. Three letters give $4^3 = 64$, more than enough. The code is indeed a **triplet code**: each amino acid is specified by a **codon** of three bases, read one after another from a fixed starting point, with no gaps and no overlaps.

### The codon table
Find the first base on the left, the second along the top; the entry lists the codons by their third base.

| First base | second U | second C | second A | second G |
|---|---|---|---|---|
| **U** | UUU, UUC Phe; UUA, UUG Leu | UCU, UCC, UCA, UCG Ser | UAU, UAC Tyr; UAA, UAG **stop** | UGU, UGC Cys; UGA **stop**; UGG Trp |
| **C** | CUU, CUC, CUA, CUG Leu | CCU, CCC, CCA, CCG Pro | CAU, CAC His; CAA, CAG Gln | CGU, CGC, CGA, CGG Arg |
| **A** | AUU, AUC, AUA Ile; **AUG Met (start)** | ACU, ACC, ACA, ACG Thr | AAU, AAC Asn; AAA, AAG Lys | AGU, AGC Ser; AGA, AGG Arg |
| **G** | GUU, GUC, GUA, GUG Val | GCU, GCC, GCA, GCG Ala | GAU, GAC Asp; GAA, GAG Glu | GGU, GGC, GGA, GGG Gly |

### Features worth noticing
- **Redundant, not ambiguous.** 61 codons encode 20 amino acids, so most amino acids have several codons (**synonyms**): leucine, serine and arginine six, methionine and tryptophan only one. But each codon means only one thing.
- **The third base matters least.** Synonyms usually differ only in the third position. Counting all possible single-base changes in the 61 sense codons, 69 % of third-position changes leave the amino acid unchanged, against 4 % in the first position and none in the second. Overall 24 % of random single-base changes in a coding sequence are silent, 71 % change the amino acid and 4 % create a stop codon (see [[mutations]]).
- **Similar codons, similar amino acids.** Every codon with U in the middle encodes a water-repelling amino acid (Phe, Leu, Ile, Met, Val), so many mistakes swap one for a similar one. Compared with random codes, ours is among the best at limiting the damage of errors — probably a product of selection.
- **Start and stop.** AUG both starts translation and encodes methionine inside proteins. UAA, UAG and UGA have no tRNA; they are recognised by release factors that end the chain.
- **Reading frames.** A sequence can be read in three frames on each strand, six in all. A long stretch from an AUG to a stop without interruption, an **open reading frame**, is the usual sign of a gene. Look for them with the [sequence tools](#/tools/sequence).

### Wobble
A cell does not need 61 different tRNAs. The third codon base pairs loosely with the first base of the anticodon — Crick's **wobble** — so a G in the anticodon reads both U and C, and inosine (a modified A) reads U, C and A. Bacteria manage with about 40 tRNA types; humans have about 50 anticodon types spread over some 400 tRNA genes.

### Almost universal
The same code is used by bacteria, archaea, plants, fungi and animals, which is among the strongest evidence that all life shares one ancestor ([[evidence-evolution]]) and why a human insulin gene works in *E. coli*. The exceptions are small and revealing: in vertebrate mitochondria UGA means tryptophan, AUA methionine and AGA/AGG stop; in *Mycoplasma* bacteria UGA means tryptophan; in some ciliates UAA and UAG mean glutamine; in the yeast *Candida albicans* CUG means serine. Two rare extra amino acids are built in by recoding a stop codon: **selenocysteine** (UGA, with a special signal in the mRNA; humans have 25 selenoproteins) and **pyrrolysine** (UAG, in some archaea). Organisms also prefer some synonyms to others — **codon usage bias** — which is why genes moved between species are often rewritten with the host's favourite codons.

> [!key] Triplet codons, read in a fixed frame from AUG to a stop; 61 codons for 20 amino acids and 3 stops. Synonyms mostly differ in the third base, so many mutations there are silent.
`,
  ideas: [
    'Codons are three bases long because 4³ = 64 is the smallest power of 4 that covers 20 amino acids.',
    'The code is redundant (61 codons, 20 amino acids) but unambiguous; synonyms mostly differ in the third base.',
    'AUG starts translation (and codes for methionine); UAA, UAG and UGA stop it.',
    'The code is read in a fixed frame without gaps or overlaps; each strand has three possible frames.',
    'The code is nearly universal — strong evidence of common descent — with small variations in mitochondria and a few organisms.'
  ],
  pitfalls: [
    'Redundant means a codon can code for more than one amino acid — It is the other way round: several codons can mean the same amino acid, but each codon has only one meaning.',
    'Stop codons are read by special tRNAs that carry no amino acid — No tRNA reads them (in the standard code); protein release factors recognise them.',
    'The genetic code is the genome — The code is the dictionary relating codons to amino acids; the genome is the text written with it.'
  ],
  formulas: [
    {
      name: 'Number of different code words',
      expr: 'N = 4^n', tex: 'N = 4^{n}',
      vars: {
        N: { name: 'number of possible codons', q: 'count' },
        n: { name: 'bases per codon', q: 'count', int: true, value: 3, min: 1, max: 12 }
      },
      note: 'Four bases, n positions, each chosen independently. For 20 amino acids plus a stop signal, n = 3 is the shortest that works.',
      stories: { N: 'How many different words of {n} letters can be written with the four bases?' }
    },
    {
      name: 'Possible protein sequences',
      expr: 'S = 20^L', tex: 'S = 20^{L}',
      vars: {
        S: { name: 'number of possible sequences', q: 'count' },
        L: { name: 'protein length in amino acids', q: 'count', int: true, value: 10, min: 1, max: 200 }
      },
      note: 'With the 20 standard amino acids. A modest 100-residue protein has about 10¹³⁰ possible sequences — more than the atoms in the observable universe (about 10⁸⁰).',
      stories: { S: 'How many different peptides of {L} amino acids could be made from the 20 standard amino acids?', L: 'How long must a peptide be for there to be {S} possible sequences?' }
    }
  ],
  examples: [
    {
      title: 'Reading a message',
      q: 'Translate the mRNA 5′-GGAUGGCCUUUAAGUGAC-3′.',
      steps: [
        'Find the first AUG: GG**AUG**GCC… The frame starts there.',
        'Read triplets: AUG Met, GCC Ala, UUU Phe, AAG Lys, UGA stop.',
        'The bases before AUG and after the stop are untranslated.'
      ],
      a: 'Met-Ala-Phe-Lys (MAFK), then stop.'
    },
    {
      title: 'How many messages spell the same protein?',
      q: 'How many different mRNA coding sequences encode the peptide Met-Trp-Leu-Arg, followed by a stop?',
      steps: [
        'Count the codons for each: Met 1, Trp 1, Leu 6, Arg 6, stop 3.',
        'Choices multiply: $1\\times1\\times6\\times6\\times3 = 108$.',
        'For a real protein of 300 amino acids the number is astronomically large — which is why a gene can be rewritten with preferred codons without changing its protein.'
      ],
      a: '108 different coding sequences.'
    }
  ],
  quiz: [
    { q: 'How many of the 64 codons specify an amino acid in the standard code?', answer: 61, why: 'Three (UAA, UAG, UGA) are stop codons; the other 61 encode the 20 amino acids.' },
    { q: 'A codon\'s third base is changed. The most likely result is…', choices: ['the same amino acid (a silent change)', 'a stop codon', 'a frameshift', 'loss of the start codon'], a: 0, why: 'Synonymous codons usually differ only in the third position: 69 % of third-position substitutions keep the amino acid.' },
    { q: 'Why could a doublet code (two bases per codon) not work?', choices: ['It gives only 16 words, fewer than the 20 amino acids', 'Ribosomes cannot move two bases at a time', 'tRNAs have three-base anticodons', 'It would have no stop codons'], a: 0, why: '$4^2 = 16 < 20$. Three bases give $4^3 = 64$ words, enough for 20 amino acids and stops.' },
    { q: 'The genetic code is identical in every organism and organelle.', a: false, why: 'It is nearly universal, but vertebrate mitochondria, *Mycoplasma*, some ciliates and some yeasts read a few codons differently — small variations on one shared code.' },
    { q: 'How many different mRNA coding sequences (without the stop) encode the tripeptide Met-Lys-Trp?', answer: 2, why: 'Met has 1 codon, Lys 2 (AAA, AAG), Trp 1: $1\\times2\\times1 = 2$.' }
  ],
  problems: [
    { q: 'An amino acid alphabet of 20 letters: how many different peptides of 5 residues are possible?', answer: 3.2e6, tol: 0.01, steps: ['$20^5 = 3\\,200\\,000$.'] },
    { q: 'A primitive code might have used two-base codons with an alphabet of 4 bases. How many amino acids plus one stop signal could it specify at most?', answer: 16, tol: 0.001, steps: ['$4^2 = 16$ words: at most 15 amino acids and one stop signal.'] }
  ],
  applications: [
    'Translate any sequence in all six frames, with the code table, in [the sequence tools](#/tools/sequence/translate).',
    'Codon optimisation: genes for vaccines and industrial proteins are rewritten with the host\'s preferred codons to make more protein.',
    'Genome annotation finds genes as open reading frames and judges them by codon usage ([[bioinformatics]]).',
    'Expanded genetic codes built in the laboratory add non-standard amino acids to proteins by reassigning a stop codon.',
    'Mitochondrial DNA analysis must use the mitochondrial version of the code.'
  ],
  history: 'Francis Crick, Sydney Brenner and colleagues showed in 1961, with frameshift mutants of phage T4, that the code is read in triplets from a fixed start. The same year Marshall Nirenberg and Heinrich Matthaei found that synthetic poly-U RNA makes polyphenylalanine — UUU means Phe. By 1966 the groups of Nirenberg and Har Gobind Khorana had assigned all 64 codons; they shared the 1968 Nobel Prize with Robert Holley, who determined the first tRNA sequence.',
  sim: 'molb-mutation'
},

{
  id: 'translation', parent: 'dna-to-protein', title: 'Translation', level: 2,
  short: 'Translation is protein synthesis: a ribosome moves along an mRNA three bases at a time while transfer RNAs bring the matching amino acids, and the ribosome links them into a chain — about 15–20 amino acids a second in bacteria and 5–6 in human cells.',
  keywords: ['translation', 'protein synthesis', 'ribosome', 'rRNA', 'tRNA', 'aminoacyl-tRNA synthetase', 'anticodon', 'A site', 'P site', 'E site', 'peptidyl transferase', 'initiation', 'elongation', 'termination', 'Shine–Dalgarno', 'Kozak sequence', 'release factor', 'polysome', 'GTP', 'signal peptide', 'ribozyme', 'antibiotics'],
  prereq: ['genetic-code', 'transcription', 'amino-acids', 'nucleus-ribosomes'],
  related: ['protein-structure', 'rna-processing', 'mutations', 'endomembrane', 'atp-energy', 'antibiotic-resistance', 'medicine:antibiotics'],
  body: `
Translation turns a sequence of nucleotides into a sequence of amino acids — a different chemical language, hence the name. It is the most expensive thing a growing cell does: a fast-growing bacterium spends a large share of its energy and packs up to 70 000 ribosomes into a cell two micrometres long.

### The players
- **mRNA** carries the codons ([[genetic-code]]).
- **Transfer RNAs** (tRNAs), about 76 nucleotides folded into an L shape, are the adaptors: an **anticodon** at one end pairs with the codon, and the matching amino acid is attached at the other end (the 3′ CCA end).
- **Aminoacyl-tRNA synthetases**, one for each amino acid, attach the right amino acid to the right tRNAs, using ATP. They are the real translators: a ribosome checks only the codon–anticodon match, so the meaning of the code is set by these twenty enzymes. Several proofread their own work.
- The **ribosome**, a machine of RNA and protein, holds everything in place and makes the peptide bonds.

| | Bacteria | Eukaryotes (cytoplasm) |
|---|---|---|
| Ribosome | 70S = 30S + 50S subunits, 2.5 MDa | 80S = 40S + 60S subunits, 4.3 MDa |
| Ribosomal RNAs / proteins | 3 / about 55 | 4 / about 80 |
| Start signal | Shine–Dalgarno sequence (AGGAGG) about 8 nt before AUG | 5′ cap; scanning to the first AUG in a good (Kozak) context |
| First amino acid | formyl-methionine | methionine |
| Speed | about 15–20 amino acids/s | about 5–6 amino acids/s |

### The cycle
The ribosome has three tRNA sites: **A** (aminoacyl, where the new tRNA arrives), **P** (peptidyl, holding the growing chain) and **E** (exit).

1. **Initiation.** The small subunit finds the start codon, the initiator tRNA carrying methionine settles in the P site, and the large subunit joins.
2. **Elongation.** A charged tRNA, delivered by an elongation factor with GTP, enters the A site; it stays only if its anticodon pairs with the codon. The chain on the P-site tRNA is transferred to the amino acid on the A-site tRNA — a new peptide bond. The ribosome then moves one codon along (using a second GTP), shifting the tRNAs from A to P and P to E. Repeat.
3. **Termination.** A stop codon in the A site is recognised by a **release factor**; the chain is cut free, and the ribosome comes apart to be used again.

The peptide bond is made by the ribosomal **RNA**, not by a protein: the ribosome is a ribozyme, and the active site contains no protein within about 1.8 nm. Each peptide bond costs four high-energy phosphate bonds — two from ATP to charge the tRNA, two GTP for delivery and moving on.

### Speed, accuracy and polysomes
Ribosomes make about one mistake in $10^4$ codons. That sounds good, but it means that only $(1-10^{-4})^{400} \\approx 96$ % of 400-residue proteins come out perfect, and a giant like titin (about 34 000 residues) is almost never error-free. Many ribosomes read one mRNA at the same time, spaced along it like beads — a **polysome** — so one message can make dozens of proteins at once.

### After the chain is made
The chain folds as it leaves the ribosome, often helped by chaperones ([[protein-structure]]). Proteins destined for membranes or for secretion begin with a **signal peptide** that steers the ribosome to the endoplasmic reticulum while it is still translating ([[endomembrane]]). Many are then cut, glycosylated or phosphorylated.

### Why antibiotics can target it
Bacterial and eukaryotic ribosomes differ enough that many antibiotics block one and not the other: tetracyclines stop tRNAs entering the A site, macrolides such as erythromycin plug the exit tunnel, chloramphenicol blocks peptide bond formation, and aminoglycosides such as streptomycin make the ribosome misread codons ([[medicine:antibiotics|antibiotics]], [[antibiotic-resistance]]). Our mitochondria have bacteria-like ribosomes, which explains some side effects of these drugs.

> [!key] The synthetases give each tRNA its amino acid; the ribosome matches anticodon to codon, joins the amino acids and moves three bases at a time from AUG to a stop.
`,
  ideas: [
    'tRNAs are adaptors: an anticodon pairs with the codon and the matching amino acid rides on the other end.',
    'Aminoacyl-tRNA synthetases attach the right amino acid to each tRNA; they set the meaning of the code.',
    'The ribosome has A, P and E sites; its RNA forms the peptide bonds, making it a ribozyme.',
    'Each peptide bond costs four high-energy phosphate bonds; bacteria add 15–20 amino acids a second, our cells 5–6.',
    'Differences between bacterial and eukaryotic ribosomes let many antibiotics act selectively.'
  ],
  pitfalls: [
    'The ribosome decides which amino acid matches each codon — It only checks codon–anticodon pairing; which amino acid is on the tRNA was decided earlier by its synthetase.',
    'Ribosomes are made of protein — They are about two-thirds RNA in bacteria, and the RNA does the catalysis.',
    'Translation starts at the first base of the mRNA — It starts at a start codon, AUG, found by the Shine–Dalgarno sequence in bacteria or by scanning from the cap in eukaryotes; the bases before it are untranslated.'
  ],
  formulas: [
    {
      name: 'Time to make a protein',
      expr: 't = L/v', tex: 't = \\dfrac{L}{v}',
      vars: {
        t: { name: 'synthesis time', q: 'time', unit: 's' },
        L: { name: 'protein length', q: false, unit: 'aa', value: 400 },
        v: { name: 'elongation speed', q: false, unit: 'aa/s', value: 15 }
      },
      note: 'One ribosome, elongation only; initiation and termination add a few seconds.',
      stories: {
        t: 'A bacterial ribosome adds {v}. How long does it take to make a protein of {L}?',
        v: 'A ribosome makes a protein of {L} in {t}. How fast does it work?'
      }
    },
    {
      name: 'Chance of an error-free protein',
      expr: 'P = (1 - eps)^L', tex: 'P = (1 - \\varepsilon)^{L}',
      vars: {
        P: { name: 'fraction of proteins with no mistake', q: 'ratio', unit: '%' },
        eps: { name: 'error rate per codon', value: 1e-4, min: 0, max: 0.5, tex: '\\varepsilon' },
        L: { name: 'protein length in amino acids', q: 'count', int: true, value: 400, min: 1 }
      },
      note: 'Independent errors, each codon read correctly with probability 1 − ε. For small ε, P ≈ e^(−εL).',
      stories: { P: 'A ribosome misreads about {eps} of codons. What fraction of proteins {L} residues long are made without a single mistake?', L: 'With an error rate of {eps} per codon, how long can a protein be before only {P} of the copies are perfect?' }
    },
    {
      name: 'Mass of a protein from its length',
      expr: 'M = m0*L', tex: 'M = m_0\\,L',
      vars: {
        M: { name: 'molecular mass', q: false, unit: 'kDa' },
        m0: { name: 'average mass of an amino acid residue', q: false, unit: 'kDa', value: 0.11, fixed: true, tex: 'm_0' },
        L: { name: 'number of amino acids', q: false, unit: 'aa', value: 238 }
      },
      note: 'A rule of thumb (110 Da per residue); the exact mass depends on the composition — the sequence tools add up the real residue masses.',
      stories: { M: 'Green fluorescent protein has {L}. Estimate its mass.', L: 'A band on a protein gel runs at {M}. About how many amino acids long is the protein?' }
    }
  ],
  examples: [
    {
      title: 'GFP in a bacterium, titin in a muscle',
      q: 'How long does one ribosome take to make green fluorescent protein (238 amino acids) in *E. coli* at 15 aa/s, and titin (about 34 000 amino acids) in a human muscle cell at 5 aa/s?',
      steps: [
        'GFP: $t = 238/15 \\approx 16$ s.',
        'Titin: $t = 34\\,000/5 = 6800$ s, nearly 2 hours for one molecule.',
        'The mRNA of titin is about 100 000 nt long; many ribosomes translate it at once.'
      ],
      a: 'About 16 s for GFP; nearly 2 h for titin.'
    },
    {
      title: 'Perfect copies',
      q: 'With one error per $10^4$ codons, what fraction of a 400-residue protein and of titin (34 000 residues) are error-free?',
      steps: [
        '400 residues: $P = (1 - 10^{-4})^{400} = e^{-0.04} \\approx 0.96$ — 96 % perfect.',
        'Titin: $P = e^{-3.4} \\approx 0.033$ — only about 3 %. Most titin molecules carry a few substitutions, usually harmless.'
      ],
      a: '96 % for the 400-residue protein; about 3 % for titin.'
    },
    {
      title: 'The energy bill',
      q: 'How many high-energy phosphate bonds does a cell spend to make one 300-residue protein?',
      steps: [
        'Four per peptide bond (two for charging the tRNA, two GTP for elongation), and 299 peptide bonds.',
        '$4 \\times 299 \\approx 1200$ bonds, plus a few for initiation and termination — and the cost of making and later destroying the mRNA.'
      ],
      a: 'About 1200 phosphoanhydride bonds.'
    }
  ],
  quiz: [
    { q: 'Which molecule actually ensures that a codon is matched with the correct amino acid?', choices: ['the aminoacyl-tRNA synthetase that charged the tRNA', 'the ribosome', 'the mRNA', 'the release factor'], a: 0, why: 'The ribosome checks only codon–anticodon pairing. If a synthetase puts the wrong amino acid on a tRNA, the ribosome builds it in without noticing.' },
    { q: 'In which ribosomal site does a newly arrived aminoacyl-tRNA bind?', choices: ['A site', 'P site', 'E site', 'the exit tunnel'], a: 0, why: 'A for aminoacyl; the growing chain sits on the tRNA in the P site, and empty tRNAs leave from the E site.' },
    { q: 'A bacterial ribosome makes a 450-residue protein at 18 amino acids per second. How many seconds does it take?', answer: 25, unit: 's', why: '$450/18 = 25$ s.' },
    { q: 'The peptide bond is made by a protein enzyme in the large subunit.', a: false, why: 'The catalytic centre (peptidyl transferase) is ribosomal RNA; no protein comes close to it. The ribosome is a ribozyme.' },
    { q: 'Why do some antibiotics that act on ribosomes have side effects in human cells?', choices: ['Our mitochondria have bacteria-like ribosomes', 'Human ribosomes are identical to bacterial ones', 'The drugs destroy mRNA', 'Human cells have no ribosomes of their own'], a: 0, why: 'Mitochondria descend from bacteria and keep 70S-like ribosomes; drugs such as chloramphenicol and aminoglycosides can inhibit them.' }
  ],
  problems: [
    { q: 'A protein runs on a gel as a 66 kDa band. Estimate its length in amino acids.', answer: 600, unit: 'aa', tol: 0.03, steps: ['$L = M/m_0 = 66/0.11 = 600$ amino acids.'] },
    { q: 'Ribosomes on an mRNA are spaced 40 codons apart and each moves at 5 aa/s. How many proteins does the mRNA produce per minute?', answer: 7.5, tol: 0.02, steps: ['A new ribosome finishes each time the line advances one spacing: every $40/5 = 8$ s.', '$60/8 = 7.5$ proteins per minute.'] }
  ],
  applications: [
    'Find the open reading frames of your own sequence in [the sequence tools](#/tools/sequence/translate).',
    'Antibiotics such as tetracyclines, macrolides, aminoglycosides and chloramphenicol target bacterial ribosomes.',
    'Producing therapeutic proteins (insulin, antibodies) in bacteria, yeast or cultured cells uses their translation machinery.',
    'mRNA vaccines deliver a message that the recipient\'s own ribosomes translate into a viral protein.',
    'Ribosome profiling measures which messages are being translated, codon by codon.'
  ],
  history: 'Francis Crick proposed in 1955 that an "adaptor" must link codons to amino acids; Paul Zamecnik and Mahlon Hoagland found it — transfer RNA — in 1958. The atomic structures of the ribosome and its subunits, solved in 2000, showed that its catalytic centre is RNA; Venkatraman Ramakrishnan, Thomas Steitz and Ada Yonath shared the 2009 Nobel Prize in Chemistry.',
  sim: 'molb-express'
},

{
  id: 'lac-operon', parent: 'gene-regulation', title: 'Gene regulation in bacteria: the lac operon', level: 2,
  short: 'E. coli makes the enzymes for using lactose only when lactose is present and glucose, its preferred sugar, is scarce. A repressor keeps the genes off unless lactose is around; an activator, CAP, switches them fully on only when glucose runs low. Together they work like a logical AND gate.',
  keywords: ['operon', 'lac operon', 'lacZ', 'lacY', 'lacA', 'lacI', 'repressor', 'operator', 'promoter', 'inducer', 'allolactose', 'IPTG', 'CAP', 'CRP', 'cAMP', 'catabolite repression', 'inducer exclusion', 'diauxie', 'negative control', 'positive control', 'β-galactosidase', 'cis and trans', 'Jacob and Monod'],
  prereq: ['transcription', 'prokaryotic-cells', 'enzyme-regulation'],
  related: ['eukaryotic-regulation', 'bacterial-growth', 'microbial-metabolism', 'restriction-cloning', 'gene-expression-tools', 'cell-signalling'],
  body: `
A bacterium lives on whatever food drifts by. Enzymes for every possible sugar would waste energy and space, so *E. coli* keeps most of them switched off and makes them only when they are useful. The enzymes for lactose, the sugar of milk, are the classic example — the system in which François Jacob and Jacques Monod first explained how genes are switched on and off.

### The parts
The **lac operon** is a group of three genes read into one mRNA from a single promoter:

- *lacZ* — **β-galactosidase**, which splits lactose into glucose and galactose (and makes a little **allolactose** as a by-product);
- *lacY* — **lactose permease**, which pumps lactose into the cell;
- *lacA* — a transacetylase whose role is still unclear.

Just before the genes lie the **promoter**, where RNA polymerase binds, and the **operator**, overlapping it. Nearby, a separate gene, *lacI*, is always transcribed at a low rate and makes the **lac repressor** — only about ten molecules (tetramers) per cell.

### Negative control: the repressor
With no lactose, the repressor sits on the operator and stops RNA polymerase from transcribing the genes. Ten molecules may seem few, but in a cell of about one femtolitre a single molecule is at about 1.7 nM, so ten repressors are some 17 nM — far more than needed to keep the operator occupied almost all the time. When lactose enters, a little is turned into allolactose, which binds the repressor and changes its shape (an **allosteric** change, see [[enzyme-regulation]]) so that it lets go of the DNA. Transcription can then begin. **IPTG**, a sulfur-containing look-alike, does the same but is not broken down — a "gratuitous" inducer used in laboratories to switch on genes placed behind the lac promoter.

### Positive control: CAP and glucose
Even with the repressor off, the lac promoter is weak. Full expression needs an activator, the **catabolite activator protein** (CAP, also called CRP), with its signal molecule **cyclic AMP**. When glucose is scarce, cAMP rises; CAP–cAMP binds just upstream of the promoter, bends the DNA and helps RNA polymerase to start, raising transcription some fifty-fold. When glucose is plentiful, cAMP is low and, just as important, the glucose-transport machinery blocks the lactose permease (**inducer exclusion**), so little allolactose is made.

| Glucose | Lactose | Repressor on operator? | CAP–cAMP bound? | lac expression |
|---|---|---|---|---|
| present | absent | yes | little | off (basal, about 0.1 %) |
| present | present | mostly not | little | low (a few per cent) |
| absent | absent | yes | yes | off (basal) |
| absent | present | no | yes | **fully on** (100 %) |

The operon is on only if lactose is present **and** glucose is absent: a biological AND gate. From off to fully on, β-galactosidase rises about a thousandfold.

### Diauxie
Grow *E. coli* on a mixture of glucose and lactose and it grows in two spurts: first on glucose, then — after a pause of up to an hour while it makes the lac enzymes — on lactose. Monod described this **diauxie** in 1941; it was the puzzle that led him to the operon.

### What the mutants taught
Jacob and Monod worked out the logic from mutants, using cells with two copies of the region (one on a plasmid) to test which parts act on their own DNA only (*cis*) and which make a diffusible product (*trans*):

| Mutant | Phenotype | With a normal second copy |
|---|---|---|
| *lacI⁻* (no working repressor) | always on | normal: the good repressor diffuses to both operators (*trans*) |
| *lacOᶜ* (operator the repressor cannot bind) | always on | still on for the genes next to the bad operator (*cis*-dominant) |
| *lacIˢ* (repressor that cannot bind allolactose) | never induced | never induced (dominant) |

These results introduced two ideas used throughout biology: regulatory **genes** that make diffusible proteins, and regulatory **sites** on the DNA that act only on the genes beside them.

> [!key] Repressor off the operator (lactose present) **and** CAP–cAMP on its site (glucose absent) — only then are lacZ, lacY and lacA transcribed at full rate.
`,
  ideas: [
    'An operon is a set of genes transcribed together from one promoter and controlled together.',
    'The lac repressor blocks transcription until allolactose (or IPTG) binds it and releases it from the operator — negative control.',
    'CAP with cAMP activates the promoter when glucose is scarce — positive control; glucose also blocks lactose uptake (inducer exclusion).',
    'Full expression needs lactose present AND glucose absent; induction raises the enzymes about a thousandfold.',
    'Mutants revealed trans-acting regulatory genes (lacI) and cis-acting sites (the operator).'
  ],
  pitfalls: [
    'Lactose itself binds the repressor — The inducer is allolactose, made from lactose by the few β-galactosidase molecules present even in the "off" state (or IPTG in the laboratory).',
    'With the repressor gone, the genes are fully on — Without CAP–cAMP the lac promoter is weak; in the presence of glucose, expression stays at a few per cent.',
    'CAP is a second repressor that glucose activates — CAP is an activator, active when cAMP is high, which happens when glucose is scarce.'
  ],
  formulas: [
    {
      name: 'Concentration of a few molecules in a cell',
      expr: 'c = n*1e24/(NA*V)', tex: 'c = \\dfrac{n}{N_A\\,V}',
      vars: {
        c: { name: 'concentration, in nM', q: false, unit: 'nM' },
        n: { name: 'number of molecules', q: 'count', value: 10 },
        NA: { const: 'NA' },
        V: { name: 'cell volume, in femtolitres', q: false, unit: 'fL', value: 1 }
      },
      note: 'With V in femtolitres (1 fL = 1 µm³) and c in nanomolar the unit factors combine to 10²⁴, so c ≈ 1.66 n/V. An *E. coli* cell is about 1 fL.',
      practice: { unknowns: ['c', 'n'] },
      stories: { c: 'An *E. coli* cell of {V} holds {n} lac repressor tetramers. What is their concentration?', n: 'A protein is at {c} in a cell of {V}. How many molecules is that?' }
    },
    {
      name: 'Expression left by a repressor',
      expr: 'FC = 1/(1 + R/K)', tex: '\\mathrm{FC} = \\dfrac{1}{1 + \\mathrm{[R]}/K_d}',
      vars: {
        FC: { name: 'expression relative to no repressor', q: 'ratio', unit: '%', tex: '\\mathrm{FC}' },
        R: { name: 'active repressor concentration', q: 'concentration', unit: 'nM', value: 17, tex: '\\mathrm{[R]}' },
        K: { name: 'effective dissociation constant for the operator', q: 'concentration', unit: 'nM', value: 0.02, tex: 'K_d' }
      },
      note: 'The operator is free a fraction K/(K + [R]) of the time; the gene is transcribed only then. The numbers are illustrative: the effective constant in the cell depends on salt, DNA looping and competing sites. An inducer works by raising K (weaker binding).',
      stories: { FC: 'A cell holds {R} of active repressor, which binds its operator with an effective constant {K}. What fraction of full expression leaks through?', K: 'Expression leaks through at {FC} of the full level with {R} of repressor. What is the effective binding constant?' }
    }
  ],
  examples: [
    {
      title: 'Ten molecules in a bacterium',
      q: 'An *E. coli* cell (1 fL) contains 10 lac repressor tetramers. What is their concentration?',
      steps: [
        'One molecule: $c = 1/(6.02\\times10^{23}\\ \\mathrm{mol^{-1}}\\times10^{-15}\\ \\mathrm{L}) = 1.66\\times10^{-9}$ M = 1.66 nM.',
        'Ten molecules: about 17 nM — enough to keep an operator that binds tightly almost always covered.'
      ],
      a: 'About 17 nM.'
    },
    {
      title: 'How an inducer releases the brake (illustrative numbers)',
      q: 'With 17 nM active repressor and an effective operator constant of 0.02 nM, what fraction of full expression leaks through? If allolactose weakens binding a thousandfold, what then?',
      steps: [
        'Without inducer: $FC = 1/(1 + 17/0.02) = 1/851 \\approx 0.12$ %.',
        'With inducer, $K_d = 20$ nM: $FC = 1/(1 + 17/20) = 0.54$ — 54 %.',
        'Induction ratio: $0.54/0.0012 \\approx 460$-fold; CAP–cAMP adds its own boost on top when glucose is absent.'
      ],
      a: 'About 0.12 % before and 54 % after induction — a rise of several hundredfold.'
    }
  ],
  quiz: [
    { q: 'A culture has both glucose and lactose. The lac operon is…', choices: ['expressed only weakly, a few per cent of maximum', 'fully on', 'completely silent, zero transcription', 'on only in cells without CAP'], a: 0, why: 'Lactose removes most of the repressor, but low cAMP leaves CAP inactive and glucose transport blocks lactose uptake: expression is low until the glucose runs out.' },
    { q: 'A *lacI⁻* mutant (no working repressor) grown without lactose and without glucose makes β-galactosidase…', choices: ['at a high level all the time', 'only when lactose is added', 'never', 'only when glucose is added'], a: 0, why: 'With no repressor the operator is always free, and with no glucose CAP–cAMP is active: the operon is on even without lactose (constitutive).' },
    { q: 'A cell carries a normal lac operon on its chromosome and a second copy with a *lacOᶜ* operator on a plasmid. Without lactose, which copy is transcribed?', choices: ['only the copy with the lacOᶜ operator', 'both copies', 'neither copy', 'only the chromosomal copy'], a: 0, why: 'The operator acts only on the genes beside it (cis). The repressor cannot bind the mutant operator, so its genes are on, while the normal operator is still repressed.' },
    { q: 'CAP is a repressor that glucose activates.', a: false, why: 'CAP is an activator. It needs cAMP, which is high when glucose is scarce; then it helps RNA polymerase bind the lac promoter.' },
    { q: 'What is the concentration, in nM, of a single molecule in a cell of 2 fL?', answer: 0.83, unit: 'nM', why: '$c = 1.66/2 = 0.83$ nM: in a small cell, even one molecule is a meaningful concentration.' }
  ],
  problems: [
    { q: 'A 1 fL bacterium contains 3000 molecules of an enzyme. What is its concentration in µM?', answer: 4.98, unit: 'µM', tol: 0.02, steps: ['$c = 1.66\\times3000/1 = 4980$ nM = 4.98 µM.'] },
    { q: 'With the repressor fully active, expression leaks at 0.1 % of full. Treating it as $FC = 1/(1 + [R]/K_d)$, what is the ratio $[R]/K_d$?', answer: 999, tol: 0.01, steps: ['$1/(1 + x) = 0.001$, so $1 + x = 1000$ and $x = 999$.'] }
  ],
  applications: [
    'The lac promoter and IPTG are a standard switch for producing proteins in *E. coli*.',
    'Blue–white screening: colonies with an intact *lacZ* fragment turn a colourless substrate (X-gal) blue, revealing which clones carry an insert ([[restriction-cloning]]).',
    'Synthetic biology builds logic gates and oscillators from repressors and activators modelled on the lac system.',
    'Lactose-free milk is made by adding β-galactosidase (lactase) to split the lactose.'
  ],
  history: 'Jacques Monod discovered diauxie in 1941. With Arthur Pardee and François Jacob he showed in 1959 that a diffusible repressor controls the lactose genes, and in 1961 Jacob and Monod proposed the operon model with its operator and messenger RNA. They shared the 1965 Nobel Prize with André Lwoff. Walter Gilbert and Benno Müller-Hill isolated the lac repressor in 1966 by its binding to IPTG — the first gene-regulatory protein ever purified.',
  sim: 'molb-lac'
},

{
  id: 'eukaryotic-regulation', parent: 'gene-regulation', title: 'Gene regulation in eukaryotes', level: 2,
  short: 'Our cells control genes at many levels — how tightly the DNA is packed, which transcription factors sit on promoters and distant enhancers, how the RNA is processed, how long it lasts and how often it is translated. Combinations of about 1600 transcription factors make one genome into hundreds of kinds of cell.',
  keywords: ['gene regulation', 'transcription factor', 'enhancer', 'silencer', 'promoter', 'Mediator', 'chromatin', 'nucleosome', 'histone acetylation', 'euchromatin', 'heterochromatin', 'chromatin remodelling', 'combinatorial control', 'cooperativity', 'Hill coefficient', 'insulator', 'CTCF', 'TAD', 'nuclear receptor', 'master regulator', 'MyoD', 'iPS cells', 'mRNA stability', 'differentiation'],
  prereq: ['transcription', 'lac-operon', 'dna-structure', 'eukaryotic-cells'],
  related: ['epigenetics', 'noncoding-rna', 'rna-processing', 'stem-cells', 'cell-signalling', 'animal-development', 'animal-hormones', 'medicine:cancer-genetics'],
  body: `
A neuron and a liver cell in your body carry the same DNA. They differ because they use different genes — a typical cell has about 20 000 protein-coding genes available and uses roughly half, many of them shared "housekeeping" genes and a few thousand that make the cell what it is. Eukaryotic cells control this at every step from DNA to finished protein, but mostly at the start of transcription.

### Levels of control
| Level | How | Example |
|---|---|---|
| Chromatin | packing DNA so tightly that it cannot be read, or opening it | silent heterochromatin; [[epigenetics|epigenetic]] marks |
| Transcription | transcription factors on promoters and enhancers | hormone receptors, master regulators |
| RNA processing | alternative splicing, alternative poly(A) sites | tissue-specific isoforms ([[rna-processing]]) |
| mRNA stability | half-lives from minutes to days; microRNAs | *FOS* mRNA lasts about 15 min, globin mRNA more than a day |
| Translation | proteins or RNAs that block the ribosome | ferritin made only when iron is plentiful |
| Protein | modification, localisation, destruction | ubiquitin tags proteins for the proteasome |

### Chromatin: open or closed
DNA wound round nucleosomes is hard for proteins to reach. Enzymes that add acetyl groups to histone tails (histone acetyltransferases) loosen the packing and mark active genes; histone deacetylases remove them. ATP-driven **remodelling** machines slide or evict nucleosomes to uncover a promoter. Densely packed **heterochromatin** — around centromeres and in whole silenced regions — is mostly silent; looser **euchromatin** holds the active genes.

### Transcription factors and enhancers
The human genome encodes about 1600 **transcription factors**: proteins that bind short DNA motifs of 6–12 bases, through domains such as zinc fingers (the largest family), homeodomains, helix-loop-helix and leucine zippers. **Activators** recruit co-activators, histone-modifying enzymes and the large **Mediator** complex, which in turn helps RNA polymerase II assemble on the promoter; **repressors** do the opposite.

Many binding sites lie not at the promoter but in **enhancers** — clusters of sites that can work thousands, even a million, bases away, upstream, downstream or inside an intron. The DNA loops to bring the enhancer next to the promoter. Insulator proteins such as CTCF divide chromosomes into looped domains (TADs) of hundreds of kilobases, so an enhancer talks mostly to genes in its own domain. Hundreds of thousands of candidate enhancers have been mapped in the human genome; changes in them underlie many differences between species and between people.

### Combinations make cell types
No single factor defines a cell. A gene is switched on when the right **combination** of factors is present, and because factors bind cooperatively, the response is often switch-like: the output rises steeply over a narrow range of factor concentration. The steepness is captured by a Hill coefficient $n$ — for $n = 1$ the factor must rise 81-fold to take the gene from 10 % to 90 % of full activity; for $n = 4$ only threefold.

A few **master regulators** can redirect a whole cell. MyoD alone turns fibroblasts into muscle-like cells (1987), and four factors — Oct4, Sox2, Klf4 and c-Myc — turn skin cells back into embryonic-like **induced pluripotent stem cells** (Yamanaka, 2006; [[stem-cells]]). Signals from outside act through factors too: steroid hormones bind **nuclear receptors** that enter the nucleus and bind DNA directly ([[animal-hormones]]); other signals activate factors through cascades of kinases ([[cell-signalling]]).

### Bacteria and eukaryotes compared
Bacteria group genes into operons and regulate mainly by repressors and activators near the promoter ([[lac-operon]]); translation starts before transcription ends. Eukaryotes regulate each gene separately, add chromatin, distant enhancers and a nuclear envelope that separates transcription from translation — slower, but capable of the fine, lasting distinctions a many-celled body needs. Misregulation is a hallmark of cancer: a translocation that puts the *MYC* gene next to a strong immune-cell enhancer drives Burkitt lymphoma ([[medicine:cancer-genetics|cancer genetics]]).

> [!key] Chromatin decides whether a gene can be read; combinations of transcription factors on promoters and distant enhancers decide whether it is, and how much. Later steps fine-tune the output.
`,
  ideas: [
    'Different cell types express different subsets of the same genes; control is mostly at the start of transcription.',
    'Chromatin packing (nucleosomes, histone acetylation, remodelling) sets whether DNA is accessible.',
    'Transcription factors bind short motifs at promoters and at enhancers that can act from far away by DNA looping.',
    'Combinations of cooperatively binding factors give switch-like, cell-type-specific responses.',
    'Splicing, mRNA stability, translation and protein destruction add further layers of control.'
  ],
  pitfalls: [
    'Each gene has its own dedicated regulator — Genes are controlled by combinations of shared factors; about 1600 factors regulate some 20 000 genes.',
    'An enhancer must lie just upstream of its gene — Enhancers can act from far upstream, downstream or inside introns, even hundreds of kilobases away, by looping.',
    'Different cells have different genes — Almost all cells of a body have the same genome; they differ in which genes they express.'
  ],
  formulas: [
    {
      name: 'Response of a gene to an activator (Hill function)',
      expr: 'f = TF^n/(K^n + TF^n)', tex: 'f = \\dfrac{\\mathrm{[TF]}^{n}}{K^{n} + \\mathrm{[TF]}^{n}}',
      vars: {
        f: { name: 'fraction of full activity', q: 'ratio', unit: '%' },
        TF: { name: 'activator concentration', q: 'concentration', unit: 'nM', value: 30, tex: '\\mathrm{[TF]}' },
        K: { name: 'concentration for half activity', q: 'concentration', unit: 'nM', value: 20 },
        n: { name: 'Hill coefficient (cooperativity)', value: 2, min: 0.5, max: 10 }
      },
      note: 'A phenomenological description: n > 1 when several factor molecules must bind together. The same form describes oxygen binding to haemoglobin (n ≈ 2.8).',
      practice: { unknowns: ['f', 'TF'] },
      stories: { f: 'An activator with K = {K} and Hill coefficient {n} is present at {TF}. What fraction of full activity does its target gene reach?', TF: 'How much activator (K = {K}, n = {n}) is needed to switch a gene to {f} of full activity?' }
    },
    {
      name: 'How sharp is the switch? (10 % to 90 %)',
      expr: 'R = 81^(1/n)', tex: 'R = 81^{1/n}',
      vars: {
        R: { name: 'fold change in activator from 10 % to 90 % response' },
        n: { name: 'Hill coefficient', value: 4, min: 0.2, max: 20 }
      },
      note: 'From the Hill function: 10 % response at [TF] = K·9^(−1/n) and 90 % at K·9^(1/n), a ratio of 81^(1/n).',
      stories: { R: 'By what factor must an activator with Hill coefficient {n} rise to switch its gene from 10 % to 90 % activity?', n: 'A gene goes from 10 % to 90 % activity when its activator rises {R}-fold. What is the Hill coefficient?' }
    }
  ],
  examples: [
    {
      title: 'Graded or switch-like',
      q: 'Compare the activator rise needed to take a gene from 10 % to 90 % of full activity for Hill coefficients 1, 2 and 4.',
      steps: [
        '$n = 1$: $R = 81$ — an 81-fold change, a gentle dimmer.',
        '$n = 2$: $R = 9$.',
        '$n = 4$: $R = 81^{1/4} = 3$ — a threefold rise flips the gene, a near-digital switch. Such steep responses help turn smooth gradients of signals in an embryo into sharp boundaries between tissues.'
      ],
      a: '81-fold, 9-fold and 3-fold.'
    },
    {
      title: 'Just above the threshold',
      q: 'An activator has $K = 20$ nM and $n = 2$. What fraction of full activity does its target reach at 10 nM, 20 nM and 30 nM?',
      steps: [
        '10 nM: $100/(400 + 100) = 20$ %.',
        '20 nM: $400/(400 + 400) = 50$ %.',
        '30 nM: $900/(400 + 900) = 69$ %.'
      ],
      a: '20 %, 50 % and 69 %.'
    }
  ],
  quiz: [
    { q: 'A skin cell and a nerve cell from the same person differ mainly because…', choices: ['they express different sets of genes', 'they contain different genes', 'one has lost most of its chromosomes', 'mutations have changed their DNA'], a: 0, why: 'Nearly every cell has the same genome; cell identity comes from which genes are switched on, maintained by transcription factors and chromatin.' },
    { q: 'An enhancer can activate its gene from 50 000 bases away. How?', choices: ['The DNA loops so that factors on the enhancer contact the promoter', 'RNA polymerase slides from the enhancer to the gene', 'The enhancer is copied next to the promoter', 'The enhancer encodes an activator protein'], a: 0, why: 'Proteins bound at the enhancer reach the promoter through a DNA loop, helped by Mediator and cohesin; the intervening DNA is not read.' },
    { q: 'Histone acetylation usually makes a gene…', choices: ['more accessible and more likely to be transcribed', 'permanently silent', 'mutated', 'spliced differently'], a: 0, why: 'Acetyl groups neutralise positive charges on histone tails, loosening their grip on DNA, and recruit activating proteins.' },
    { q: 'Eukaryotic genes are usually organised in operons, like bacterial ones.', a: false, why: 'Eukaryotic genes are almost always transcribed and regulated individually, each with its own promoter and enhancers (nematodes and trypanosomes are exceptions).' },
    { q: 'An activator acts with Hill coefficient 2. By what factor must it rise to take its gene from 10 % to 90 % of full activity?', answer: 9, why: '$R = 81^{1/2} = 9$.' }
  ],
  problems: [
    { q: 'An activator has K = 50 nM and Hill coefficient 3. What concentration (in nM) gives 90 % activity?', answer: 104, unit: 'nM', tol: 0.02, steps: ['$0.9 = x^3/(K^3 + x^3)$ gives $x^3 = 9K^3$.', '$x = 9^{1/3}\\times50 = 2.08\\times50 = 104$ nM.'] }
  ],
  applications: [
    'Reprogramming skin cells into induced pluripotent stem cells for research and possible therapies.',
    'Many drugs act through transcription factors: glucocorticoids, tamoxifen (oestrogen receptor), thyroid hormone analogues.',
    'Gene therapy vectors use tissue-specific enhancers to express a gene only in the target cells.',
    'Genome-wide association studies find that most variants linked to common diseases lie in enhancers, not in coding sequence.'
  ],
  history: 'In 1981 Walter Schaffner\'s group found that a 72-bp repeat from the virus SV40 boosted transcription of a gene placed thousands of bases away, in either orientation — the first enhancer. Robert Tjian purified the first human transcription factor, Sp1, in the early 1980s. Harold Weintraub\'s group showed in 1987 that MyoD converts fibroblasts to muscle, and Shinya Yamanaka reprogrammed adult cells with four factors in 2006 (Nobel Prize 2012, shared with John Gurdon).'
},

{
  id: 'epigenetics', parent: 'gene-regulation', title: 'Epigenetics', level: 2,
  short: 'Epigenetic marks — methyl groups on DNA and chemical tags on histones — change how genes are used without changing the DNA sequence, and many are copied when a cell divides. They let a liver cell stay a liver cell; how far they pass between generations in humans is still uncertain.',
  keywords: ['epigenetics', 'DNA methylation', '5-methylcytosine', 'CpG', 'CpG island', 'DNMT1', 'maintenance methylation', 'TET enzymes', 'histone modification', 'histone code', 'H3K27me3', 'H3K4me3', 'Polycomb', 'X inactivation', 'Xist', 'genomic imprinting', 'cell memory', 'reprogramming', 'transgenerational inheritance', 'epigenetic clock', 'vernalisation'],
  prereq: ['eukaryotic-regulation', 'dna-structure', 'cell-cycle'],
  related: ['stem-cells', 'noncoding-rna', 'human-genetics', 'animal-development', 'photoperiodism', 'medicine:cancer-genetics'],
  body: `
When a liver cell divides it makes two liver cells, not a neuron and a skin cell, although all three carry the same genes. Something besides the DNA sequence must record which genes are in use, and be copied at each division. That something is **epigenetic** (from Greek *epi*, "on top of"): chemical marks on DNA and on the histones around it that are inherited from mother cell to daughter cell. Conrad Waddington pictured development as a ball rolling down a landscape of valleys; epigenetic marks help keep each cell in its valley.

### DNA methylation
In mammals a methyl group can be added to cytosine where it is followed by guanine — a **CpG** site. Of the roughly 28 million CpGs in the human genome, 70–80 % are methylated. The exceptions are **CpG islands**, CpG-rich stretches about a kilobase long at some 60–70 % of gene promoters, which are usually unmethylated; when an island is methylated, its gene is silenced, because methyl-binding proteins recruit enzymes that close the chromatin.

The pattern survives cell division because CpG reads CpG on the other strand. After replication each site is methylated on the old strand only; the enzyme **DNMT1** recognises these half-methylated sites and methylates the new strand to match — an echo of [[dna-replication|semiconservative replication]]. DNMT3A and 3B set new patterns during development, and TET enzymes remove marks by oxidising the methyl group. If maintenance stops, methylation is halved at every division and fades away.

### Histone marks
Histone tails carry acetyl, methyl, phosphate and other groups. Some marks go with active genes (acetylation; trimethylated lysine 4 of histone H3, written H3K4me3), others with silent ones (H3K27me3, placed by Polycomb proteins on developmental genes that must stay off; H3K9me3 in heterochromatin). Proteins that "write", "read" and "erase" marks reinforce each other — a reader of a silent mark often recruits a writer of the same mark — which is how a chromatin state can persist.

### Cell memory in action
- **X inactivation.** In female mammals one X chromosome in every cell is shut down early in development, coated by the long non-coding RNA *Xist* ([[noncoding-rna]]) and then methylated. The choice is random and is inherited by all descendants — hence the orange and black patches of a calico cat.
- **Genomic imprinting.** About a hundred human genes are expressed only from the copy inherited from one parent. Loss of the active paternal copies in one region of chromosome 15 causes Prader–Willi syndrome; loss of the active maternal copy of a gene in the same region causes Angelman syndrome.
- **Plants remember winter.** In many plants, weeks of cold silence the flowering repressor *FLC* by Polycomb marks, and the silence persists through cell divisions into spring, so the plant flowers at the right time ([[photoperiodism]]).
- **One genome, two castes.** Honeybee larvae fed royal jelly become queens; methylation differences are part of the switch.

### Environment, inheritance and the limits
Diet, stress and toxins can change epigenetic marks, and some changes last. Mice with a particular *Agouti* allele, whose coat colour depends on methylation of a transposon next to the gene, had more brown-coated offspring when their mothers' diet was rich in methyl donors (2003). People conceived during the Dutch Hunger Winter of 1944–45 showed slightly lower methylation at the *IGF2* gene six decades later. These findings are real, but the effects are small, specific to particular loci, and hard to separate from other causes.

> [!warn] Be wary of strong claims that trauma, diet or lifestyle are "written into your genes" and passed to grandchildren. In mammals most methylation is wiped and reset twice — soon after fertilisation and again in the cells that will make eggs and sperm. Inheritance of epigenetic states over several generations is well documented in plants and in the worm *C. elegans*, but robust evidence in humans is limited.

### Uses
Methylation at a few hundred CpGs predicts a person's age to within a few years (Horvath's **epigenetic clock**, 2013). Cancer cells typically lose methylation overall yet methylate the promoters of tumour-suppressor genes; drugs that block DNA methyltransferases (azacitidine, decitabine) or histone deacetylases (vorinostat) are used against some blood cancers ([[medicine:cancer-genetics|cancer genetics]]).

> [!key] Epigenetic marks change how genes are read, not what they say. They are copied at cell division, which gives cells a memory of what they are, but most are erased between generations.
`,
  ideas: [
    'Epigenetic marks alter gene activity without changing the DNA sequence and can be copied through cell division.',
    'Methylation of CpG islands at promoters silences genes; DNMT1 copies the pattern onto the new strand after replication.',
    'Histone marks such as acetylation (active) and H3K27me3 (repressed) are written, read and erased by proteins that reinforce each other.',
    'X inactivation, genomic imprinting and plant vernalisation are well understood examples of epigenetic memory.',
    'In mammals most marks are reset between generations; claims of human transgenerational epigenetic inheritance need caution.'
  ],
  pitfalls: [
    'Epigenetic changes are mutations — They leave the DNA sequence unchanged and can in principle be reversed; that is what makes them useful for cell memory and as drug targets.',
    'Epigenetics means that genes are not important — Epigenetic marks are placed by proteins encoded by genes and act on genes; they are a layer of regulation, not a replacement for heredity.',
    'Whatever happens to us is epigenetically passed to our grandchildren — Most marks are erased in the germline and after fertilisation; evidence for inheritance over several generations comes mainly from plants and worms.'
  ],
  formulas: [
    {
      name: 'How long a mark survives without reinforcement',
      expr: 'f = m^g', tex: 'f = m^{g}',
      vars: {
        f: { name: 'fraction of sites still methylated', q: 'ratio', unit: '%' },
        m: { name: 'maintenance fidelity per site per division', q: 'ratio', unit: '%', value: 99, min: 0, max: 100 },
        g: { name: 'number of cell divisions', q: 'count', int: true, value: 50, min: 0, max: 1000 }
      },
      note: 'A simple model: each methylated site is copied with probability m at every division, and lost sites are never re-methylated. m = 50 % is pure dilution (no maintenance). In cells, de novo methylation and reader–writer loops restore lost marks, which is why patterns are stable.',
      stories: {
        f: 'A methylated site is copied faithfully {m} of the time. What fraction of such sites keeps its methyl group after {g} divisions?',
        m: 'After {g} cell divisions, {f} of the methylated sites remain. What was the maintenance fidelity per division?',
        g: 'With a maintenance fidelity of {m}, after how many divisions does only {f} of the methylation remain?'
      }
    }
  ],
  examples: [
    {
      title: 'Why maintenance must be good',
      q: 'After 50 divisions, what fraction of methylated sites remains if DNMT1 copies each site faithfully 99 % of the time? 95 %? And with no maintenance at all, after 10 divisions?',
      steps: [
        '$0.99^{50} = 0.61$: 61 % remain.',
        '$0.95^{50} = 0.077$: only 8 % remain — a pattern with 95 % fidelity would be gone within the life of a tissue.',
        'No maintenance: every division halves the methylation: $0.5^{10} \\approx 0.001$ — 0.1 %.',
        'Measured patterns are far more stable than even the 99 % case, because lost marks are put back by de novo enzymes guided by the surrounding chromatin.'
      ],
      a: '61 %, 8 %, and 0.1 %.'
    }
  ],
  quiz: [
    { q: 'Which of these is an epigenetic change?', choices: ['methylation of a gene\'s promoter CpG island', 'a C→T substitution in an exon', 'deletion of a chromosome segment', 'a frameshift insertion'], a: 0, why: 'Methylation adds a chemical group without altering the base sequence; the other three change the DNA sequence and are mutations.' },
    { q: 'How is a DNA methylation pattern copied after replication?', choices: ['DNMT1 methylates the new strand opposite methylated CpGs on the old strand', 'Methylated bases are inserted directly by DNA polymerase', 'The pattern is re-read from the RNA', 'It is not copied; it is set again in each cell'], a: 0, why: 'CpG is palindromic, so each half-methylated site after replication is a template for DNMT1 — maintenance methylation.' },
    { q: 'Almost all calico (tortoiseshell) cats are female because…', choices: ['the orange and black alleles are on the X, and random X inactivation makes patches', 'males die before birth', 'coat colour is imprinted', 'females have more pigment genes'], a: 0, why: 'A female heterozygous for the X-linked colour gene inactivates one X at random in each early cell; the clones form orange and black patches. Males have one X (rare calico males are XXY).' },
    { q: 'Epigenetic marks change the DNA sequence of a gene.', a: false, why: 'They change how the sequence is packaged and read, not the sequence itself.' },
    { q: 'With no maintenance methylation at all, what percentage of the original methylation is left after 3 divisions?', answer: 12.5, unit: '%', why: 'Each division halves it: $0.5^3 = 12.5$ %.' }
  ],
  problems: [
    { q: 'A methylation pattern keeps 90 % of its sites after 100 divisions (with no re-methylation). What is the maintenance fidelity per division, as a percentage?', answer: 99.895, unit: '%', tol: 0.001, steps: ['$m = 0.9^{1/100} = e^{\\ln 0.9/100} = 0.99895$ — 99.9 % fidelity per site per division.'] }
  ],
  applications: [
    'Epigenetic clocks estimate biological age in research on ageing.',
    'DNA methyltransferase and histone deacetylase inhibitors are used against some blood cancers.',
    'Methylation tests on blood DNA are being developed to detect cancers early.',
    'Plant breeders study stable epigenetic variants (epialleles), such as the flower shape of toadflax described by Linnaeus.'
  ],
  history: 'Conrad Waddington coined "epigenetics" in 1942 for the processes linking genes to the organism. Mary Lyon proposed X inactivation in 1961. The link between DNA methylation and gene silencing was proposed in 1975 by Arthur Riggs and by Robin Holliday and John Pugh, and imprinting was discovered in mice in 1984 by the groups of Azim Surani and Davor Solter.'
},

{
  id: 'noncoding-rna', parent: 'gene-regulation', title: 'Non-coding RNAs', level: 3,
  short: 'Only a small part of the genome codes for protein, yet much of it is transcribed. Non-coding RNAs do jobs of their own: ribosomal and transfer RNAs build proteins, small RNAs such as microRNAs and siRNAs silence genes by base pairing, and long non-coding RNAs help to organise chromatin.',
  keywords: ['non-coding RNA', 'ncRNA', 'microRNA', 'miRNA', 'siRNA', 'RNA interference', 'RNAi', 'RISC', 'Argonaute', 'Dicer', 'Drosha', 'seed sequence', 'piRNA', 'lncRNA', 'Xist', 'snRNA', 'snoRNA', 'ribozyme', 'riboswitch', 'RNA world', 'antisense', 'RNA medicines'],
  prereq: ['transcription', 'eukaryotic-regulation', 'rna-processing'],
  related: ['epigenetics', 'translation', 'crispr', 'gene-expression-tools', 'gene-therapy', 'viruses', 'life-history-earth'],
  body: `
Protein-coding exons make up less than 2 % of the human genome, yet most of the genome is transcribed at some time, in some cell. Many of those RNAs are never translated. Some are simply by-products; many others are **non-coding RNAs** (ncRNAs) whose job is done by the RNA itself — by folding into a shape, or by base pairing with other nucleic acids.

### The old workhorses
| RNA | Size | Job |
|---|---|---|
| Ribosomal RNA (rRNA) | 120–5000 nt | forms the ribosome and makes peptide bonds; about 80 % of a cell's RNA |
| Transfer RNA (tRNA) | about 76 nt | adaptor between codon and amino acid; about 15 % of the RNA |
| Small nuclear RNA (snRNA) | 100–200 nt | the catalytic heart of the spliceosome ([[rna-processing]]) |
| Small nucleolar RNA (snoRNA) | 60–300 nt | guides chemical modifications of rRNA |
| RNase P, telomerase RNA | 300–450 nt | a ribozyme that trims tRNAs; the template for telomeres |

### MicroRNAs: fine-tuning by base pairing
A **microRNA** (miRNA) gene is transcribed into a long RNA that folds into a hairpin. In the nucleus the enzyme Drosha cuts out the hairpin; after export, Dicer trims it to a duplex of about 22 nucleotides. One strand is loaded into an **Argonaute** protein, forming the RNA-induced silencing complex (RISC). The guide strand then scans mRNAs for sites, mostly in their 3′ untranslated regions, that pair with its **seed** — nucleotides 2 to 8. Binding reduces translation and speeds up decay of the target. The effect on any one target is usually modest, often less than twofold, but one miRNA acts on hundreds of genes, and more than 60 % of human protein-coding genes have conserved miRNA sites. Humans have several hundred confidently identified miRNAs; they help to shape development, the heart, the immune system and more, and their misregulation is common in cancer.

### siRNAs and RNA interference
When the pairing is perfect along the whole guide, Argonaute acts as a knife: it cuts the target. Short interfering RNAs (**siRNAs**) made by Dicer from long double-stranded RNA work this way. In plants, fungi and invertebrates this **RNA interference** (RNAi) is a defence against viruses and transposons ([[viruses]]). Laboratories use synthetic siRNAs to silence a chosen gene, and since 2018 siRNA medicines have been approved — patisiran for hereditary transthyretin amyloidosis was the first; inclisiran lowers LDL cholesterol by silencing *PCSK9* in the liver. In animal germ cells a third class, **piRNAs** (24–31 nt), keeps transposons silent to protect the genome passed to the next generation.

### Long non-coding RNAs
**lncRNAs** are longer than 200 nucleotides and look like mRNAs — capped, spliced, polyadenylated — but encode no protein. Human gene catalogues list about 20 000 of them. A few are well understood: *Xist* coats the X chromosome it comes from and silences it ([[epigenetics]]); others guide chromatin-modifying complexes to particular genes or act as decoys. Most are expressed at low levels in few cell types and are poorly conserved between species, and whether most have a function is still debated.

### How much of the genome does something?
In 2012 the ENCODE project reported "biochemical activity" (transcription, protein binding, open chromatin) across about 80 % of the human genome. Evolutionary biologists replied that activity is not function: comparing mammals, only about 8–15 % of the genome appears to be under selection. The truth — that far more than the 2 % of coding sequence matters, but far less than everything — is where most researchers now stand.

### RNA before DNA?
Riboswitches (bacterial mRNAs that change shape when they bind a metabolite), self-splicing introns and the ribosome's RNA active site show that RNA can both carry information and catalyse reactions. Many biologists think early life used RNA for both, before DNA and proteins took over — the **RNA world** ([[life-history-earth]]). The CRISPR systems that bacteria use against viruses are guided by RNA too ([[crispr]]).

> [!key] RNA does more than carry messages. Base pairing lets small RNAs find their targets — miRNAs fine-tune hundreds of genes each, siRNAs destroy one — and structured RNAs build ribosomes and spliceosomes.
`,
  ideas: [
    'Less than 2 % of the human genome codes for protein; much of the rest is transcribed, and many RNAs work without being translated.',
    'rRNA, tRNA, snRNA and snoRNA are the core non-coding RNAs of protein synthesis and RNA processing.',
    'MicroRNAs (about 22 nt) guide Argonaute to partly matching sites in mRNAs, reducing translation and stability of hundreds of targets.',
    'siRNAs pair perfectly and cut their target; RNA interference is an antiviral defence and a laboratory and medical tool.',
    'Long non-coding RNAs such as Xist organise chromatin, but the function of most lncRNAs is still uncertain.'
  ],
  pitfalls: [
    'Non-coding DNA is junk — Much of it contains regulatory elements and genes for functional RNAs; but not all transcribed or protein-bound DNA is functional either — only a minority appears to be under selection.',
    'A microRNA silences one specific gene — A miRNA pairs through a 7-nucleotide seed and affects hundreds of genes, each usually modestly; it is the siRNA with its perfect match that targets one gene.',
    'Every RNA that is transcribed must have a purpose — Transcription is somewhat leaky; many low-abundance RNAs may be noise that selection tolerates.'
  ],
  formulas: [
    {
      name: 'Chance matches of a short sequence',
      expr: 'n = L/4^k', tex: 'n = \\dfrac{L}{4^{k}}',
      vars: {
        n: { name: 'expected number of matching sites', q: 'count' },
        L: { name: 'length of sequence searched', q: false, unit: 'nt', value: 2.5e7 },
        k: { name: 'length of the matching sequence', q: 'count', int: true, value: 7, min: 1, max: 30 }
      },
      note: 'Random sequence with the four bases equally common, one strand. Real sequence is not random, but the estimate shows why a 7-nt seed finds many targets and a 19–21-nt siRNA can be unique.',
      stories: {
        n: 'A microRNA seed of {k} is searched against {L} of 3′ untranslated regions. How many matching sites would you expect by chance?',
        k: 'How long must a sequence be to be expected only {n} times by chance in {L}?'
      }
    }
  ],
  examples: [
    {
      title: 'A seed finds many targets; an siRNA finds one',
      q: 'Human 3′ untranslated regions total roughly $2.5\\times10^7$ nucleotides. How many sites would a 7-nt miRNA seed match by chance? How often would a 19-nt siRNA sequence occur in the whole genome, both strands ($6.2\\times10^9$ nt)?',
      steps: [
        'Seed: $4^7 = 16\\,384$, so $n = 2.5\\times10^7/16\\,384 \\approx 1500$ sites — enough to touch hundreds of genes.',
        'siRNA: $4^{19} = 2.7\\times10^{11}$, so $n = 6.2\\times10^9/2.7\\times10^{11} \\approx 0.02$.',
        'A 19-nt sequence is expected to occur nowhere else by chance, which is why a well-designed siRNA can silence one gene — although partial matches through its seed still cause "off-target" effects.'
      ],
      a: 'About 1500 seed sites; about 0.02 chance matches for the siRNA.'
    }
  ],
  quiz: [
    { q: 'How do microRNAs find the genes they regulate?', choices: ['By base pairing, mainly through a 7-nt seed, with sites in mRNA 3′ untranslated regions', 'By binding to promoters as proteins do', 'By methylating DNA', 'By being translated into repressor proteins'], a: 0, why: 'The miRNA guides an Argonaute protein to mRNAs through partial base pairing; the seed (nt 2–8) matters most.' },
    { q: 'Which enzyme cuts double-stranded RNA and pre-miRNA hairpins into pieces about 22 nt long?', choices: ['Dicer', 'Drosha', 'RNA polymerase II', 'DNA ligase'], a: 0, why: 'Dicer produces the ~22-nt duplexes in the cytoplasm; Drosha acts earlier, in the nucleus, cutting the hairpin out of the long primary transcript.' },
    { q: 'The ribosome\'s catalytic centre is made of protein.', a: false, why: 'Peptide bonds are formed by ribosomal RNA; the ribosome is a ribozyme — one of the strongest clues for an early RNA world.' },
    { q: 'Using $n = L/4^k$, how many times would a 10-nt sequence be expected by chance in $10^6$ nt of random sequence?', answer: 0.954, why: '$4^{10} = 1\\,048\\,576$; $10^6/1\\,048\\,576 = 0.95$.' },
    { q: 'Which non-coding RNA silences one of the two X chromosomes in female mammals?', choices: ['Xist', 'let-7', 'U6 snRNA', 'transfer RNA'], a: 0, why: 'Xist, a long non-coding RNA, coats the X chromosome it is transcribed from and recruits silencing complexes.' }
  ],
  problems: [
    { q: 'What is the shortest sequence length $k$ (in nucleotides) expected less than once by chance in a 3.1 × 10⁹-nt genome (one strand)? Give the smallest whole number.', answer: 16, tol: 0.001, steps: ['Need $4^k > 3.1\\times10^9$: $k > \\ln(3.1\\times10^9)/\\ln 4 = 15.8$.', 'So $k = 16$: $4^{16} = 4.3\\times10^9$.'] }
  ],
  applications: [
    'siRNA medicines silence disease genes in the liver (patisiran, givosiran, inclisiran).',
    'RNAi screens switch off genes one at a time to find what each does.',
    'Antisense oligonucleotides, short synthetic strands, block or redirect specific RNAs.',
    'Circulating microRNAs are studied as blood markers of disease.'
  ],
  history: 'In 1993 the groups of Victor Ambros and Gary Ruvkun found that the worm gene *lin-4* makes a tiny RNA that pairs with the mRNA of *lin-14* and blocks its translation — the first microRNA. The second, *let-7* (2000), turned out to exist in humans and flies too. Ambros and Ruvkun received the 2024 Nobel Prize. Andrew Fire and Craig Mello showed in 1998 that double-stranded RNA silences matching genes in worms — RNA interference (Nobel Prize 2006).'
},

{
  id: 'mutations', parent: 'gene-regulation', title: 'Mutations and DNA repair', level: 2,
  short: 'A mutation is a change in the DNA sequence. One base swapped for another may do nothing, change an amino acid or create a premature stop; bases added or removed can shift the reading frame. Cells repair almost all damage; the rare changes that remain are the raw material of evolution and a cause of disease.',
  keywords: ['mutation', 'point mutation', 'substitution', 'transition', 'transversion', 'silent', 'synonymous', 'missense', 'nonsense', 'frameshift', 'insertion', 'deletion', 'indel', 'repeat expansion', 'mutation rate', 'de novo mutation', 'mutagen', 'DNA damage', 'mismatch repair', 'base excision repair', 'nucleotide excision repair', 'double-strand break', 'thymine dimer', 'somatic', 'germline', 'sickle cell', 'Luria–Delbrück'],
  prereq: ['dna-replication', 'genetic-code', 'translation'],
  related: ['human-genetics', 'gene-flow-mutation', 'natural-selection', 'molecular-clock', 'antibiotic-resistance', 'crispr', 'medicine:cancer-genetics', 'medicine:anemia'],
  body: `
DNA is copied with astonishing accuracy and constantly repaired, yet it does change. A **mutation** is any lasting change in the sequence. Most are harmless, some cause disease, and a very few are useful — the variation on which [[natural-selection|natural selection]] acts.

### Kinds of change
- **Substitutions** swap one base for another. A **transition** swaps a purine for a purine (A ↔ G) or a pyrimidine for a pyrimidine (C ↔ T); a **transversion** swaps a purine for a pyrimidine. Although there are twice as many possible transversions, transitions are about twice as common in human DNA.
- **Insertions and deletions** (indels) add or remove bases.
- **Larger changes**: duplications, inversions and translocations of chromosome segments ([[karyotypes]]), and expansions of short repeats — Huntington's disease results when a CAG repeat in the *HTT* gene grows beyond about 36–40 copies.

### What a change does to a protein
| Class | Example | Effect |
|---|---|---|
| **Silent** (synonymous) | GGA → GGC, both glycine | protein unchanged (usually harmless) |
| **Missense** | GAG → GTG in β-globin: glutamate → valine | one amino acid changed — here the cause of sickle-cell disease |
| **Nonsense** | GGA → TGA in *CFTR* (G542X) | premature stop: short or no protein |
| **Frameshift** | deleting AG in *BRCA1* (185delAG) | every codon after it is misread, usually ending at a new stop |
| **In-frame indel** | loss of 3 bases in *CFTR* (F508del) | one amino acid missing |

Because the code is redundant ([[genetic-code]]), random single-base changes in a coding sequence are about 24 % silent, 71 % missense and 4 % nonsense. Missense changes range from harmless (one water-repelling amino acid for another) to devastating, depending on where they hit. Indels of one or two bases in a coding sequence always shift the frame; a stop codon soon appears in the new frame, and the mRNA is often destroyed by nonsense-mediated decay. Try each kind in the mutation lab below.

### Where mutations come from
Most arise from the chemistry of life itself. Every day, in every cell, thousands of bases fall off DNA (depurination), a hundred or more cytosines lose an amino group and become uracil, and oxygen radicals damage bases — in all, tens of thousands of lesions per cell per day. Replication adds errors ([[dna-replication]]). External **mutagens** add more: ultraviolet light joins neighbouring pyrimidines into dimers, ionising radiation breaks both strands, some chemicals add groups to bases, and flat molecules slipped between base pairs cause frameshifts.

### Repair
| System | Fixes | When it fails |
|---|---|---|
| Proofreading and **mismatch repair** | mispaired bases left by replication | Lynch syndrome: higher risk of bowel and other cancers |
| **Base excision repair** | single damaged or wrong bases (uracil, oxidised G) | |
| **Nucleotide excision repair** | bulky lesions such as UV dimers | xeroderma pigmentosum: skin cancer risk over a thousandfold higher |
| Homologous recombination | double-strand breaks, copied from the sister chromatid | *BRCA1*/*BRCA2* variants raise breast and ovarian cancer risk |
| Non-homologous end joining | double-strand breaks, glued directly | quick but may lose a few bases |

### How often
In human sperm and eggs about $1.2\\times10^{-8}$ new substitutions arise per base pair per generation — some 60–70 new mutations in each child, most from the father, whose count rises by one or two for each year of his age at conception. A bacterium such as *E. coli* gains about one mutation per thousand genome copies; RNA viruses, with no proofreading, one per $10^4$–$10^6$ nucleotides copied, which is why they evolve so fast ([[viruses]]).

**Germline** mutations are inherited; **somatic** mutations arise in body cells and affect only their descendants — their accumulation in one cell lineage is what drives cancer ([[medicine:cancer-genetics|cancer genetics]]). In 1943 Salvador Luria and Max Delbrück showed that bacteria resistant to a phage arise by chance before they meet it, not in response to it: mutations are random with respect to need. Selection, not mutation, gives evolution its direction.

> [!note] The same mutation can be harmful and helpful. People with sickle-cell disease inherit the β-globin variant from both parents; carriers of one copy are well protected against severe malaria, which is why the variant is common where malaria was ([[human-genetics]]).
`,
  ideas: [
    'Mutations are substitutions (transitions or transversions), insertions and deletions, or larger rearrangements.',
    'In coding sequence a substitution can be silent, missense or nonsense; one- or two-base indels shift the reading frame.',
    'Most DNA damage is spontaneous; mismatch, base-excision, nucleotide-excision and double-strand-break repair fix almost all of it.',
    'Humans gain about 60–70 new mutations per generation (μ ≈ 1.2 × 10⁻⁸ per bp); RNA viruses mutate thousands of times faster per base.',
    'Mutations arise at random with respect to need; selection sorts them.'
  ],
  pitfalls: [
    'Mutations are always harmful — Most are neutral, many are mildly harmful, a few are beneficial; and the effect can depend on the environment, as with the sickle-cell variant and malaria.',
    'Organisms mutate in response to what they need, like bacteria "learning" resistance — Luria and Delbrück showed that resistant mutants exist before the drug or phage arrives; selection then enriches them.',
    'Any change in a gene changes its protein — About a quarter of random substitutions in coding sequence are silent, and changes outside exons often have no effect at all (though some alter splicing or regulation).'
  ],
  formulas: [
    {
      name: 'New mutations per genome per generation',
      expr: 'M = mu*N', tex: 'M = \\mu\\,N',
      vars: {
        M: { name: 'expected new mutations', q: 'count' },
        mu: { name: 'mutation rate per base pair per generation', value: 1.2e-8, tex: '\\mu' },
        N: { name: 'genome size (both copies)', q: false, unit: 'bp', value: 6.2e9 }
      },
      note: 'Per generation, counting both genome copies a child inherits. Note the difference from the error rate per replication: many cell divisions separate one generation from the next in the germline.',
      stories: { M: 'The human germline mutation rate is {mu} per base pair per generation, and a child inherits {N}. How many new mutations does a child carry?', mu: 'Sequencing parents and child finds {M} new mutations in {N}. What is the mutation rate per base pair per generation?' }
    },
    {
      name: 'New mutations at one site across a population',
      expr: 'n = 2*Np*mu', tex: 'n = 2 N_p\\,\\mu',
      vars: {
        n: { name: 'new mutations at a given base pair per generation', q: 'count' },
        Np: { name: 'population size (diploid individuals)', q: 'count', value: 8e9, tex: 'N_p' },
        mu: { name: 'mutation rate per base pair per generation', value: 1.2e-8, tex: '\\mu' }
      },
      note: 'Two genome copies per diploid individual. In a large population almost every possible single-base change arises somewhere in each generation.',
      stories: { n: 'With {Np} people and a mutation rate of {mu}, how many new mutations hit any one base pair of the genome in a generation?' }
    }
  ],
  examples: [
    {
      title: 'Your own new mutations',
      q: 'With $\\mu = 1.2\\times10^{-8}$ per bp per generation and $6.2\\times10^9$ bp inherited, how many new mutations does a child carry? How many are likely to change a protein, if about 1.2 % of the genome is protein-coding and about three-quarters of coding changes alter an amino acid?',
      steps: [
        '$M = 1.2\\times10^{-8}\\times6.2\\times10^9 \\approx 74$ new mutations.',
        'In coding sequence: $74\\times0.012 \\approx 0.9$.',
        'Protein-altering: $0.9\\times0.75 \\approx 0.7$ — most children carry about one new amino-acid change, usually harmless.'
      ],
      a: 'About 74 new mutations, roughly one of which changes a protein.'
    },
    {
      title: 'The sickle-cell change',
      q: 'The β-globin gene begins ATG GTG CAC CTG ACT CCT GAG GAG AAG. In sickle-cell disease the A in the seventh codon (counting ATG) becomes T. Classify the change.',
      steps: [
        'Codon 7 GAG (glutamate) becomes GTG (valine): an A → T transversion.',
        'Glutamate is negatively charged; valine is water-repelling — a non-conservative missense change.',
        'Traditionally counted without the initial methionine, it is "Glu6Val". Deoxygenated haemoglobin with valine at this position sticks to its neighbours, forming fibres that deform red cells.'
      ],
      a: 'A missense transversion, Glu → Val.'
    },
    {
      title: 'A frameshift',
      q: 'Delete the first G of GAG in codon 7 of ATG GTG CAC CTG ACT CCT GAG GAG AAG TCT. What does the new frame read?',
      steps: [
        'The sequence becomes ATG GTG CAC CTG ACT CCT AGG AGA AGT CT…',
        'New codons from 7: AGG (Arg), AGA (Arg), AGT (Ser)… — every downstream codon is different, until a stop codon appears in the new frame.'
      ],
      a: 'A frameshift: the protein is normal for 6 residues, then nonsense.'
    }
  ],
  quiz: [
    { q: 'A change turns the codon UGG (Trp) into UAG. This is a…', choices: ['nonsense mutation', 'silent mutation', 'missense mutation', 'frameshift'], a: 0, why: 'UAG is a stop codon: the chain ends early. A single substitution cannot shift the frame.' },
    { q: 'Which is more likely to wreck a protein?', choices: ['deleting one base near the start of the coding sequence', 'deleting three consecutive bases near the start', 'a silent substitution', 'a substitution in the third base of a leucine codon'], a: 0, why: 'One deleted base shifts the frame for all later codons. Deleting three bases removes one amino acid but keeps the frame; the last two are usually silent.' },
    { q: 'Bacteria become resistant to a phage because meeting the phage causes the right mutations.', a: false, why: 'Luria and Delbrück\'s fluctuation test showed that resistant mutants arise at random before exposure; the phage only selects them.' },
    { q: 'Which repair system removes thymine dimers made by ultraviolet light in human cells?', choices: ['nucleotide excision repair', 'mismatch repair', 'non-homologous end joining', 'telomerase'], a: 0, why: 'NER cuts out a short stretch around the bulky dimer and fills the gap. People with xeroderma pigmentosum lack it and are extremely sensitive to sunlight.' },
    { q: 'With a mutation rate of $1.2\\times10^{-8}$ per bp per generation, how many new mutations does a child with $6.2\\times10^9$ bp carry?', answer: 74, why: '$1.2\\times10^{-8}\\times6.2\\times10^9 = 74$.' }
  ],
  problems: [
    { q: 'An *E. coli* genome of $4.6\\times10^6$ bp has a mutation rate of $2\\times10^{-10}$ per bp per generation. How many generations pass, on average, between new mutations in one lineage?', answer: 1087, tol: 0.02, steps: ['Mutations per genome per generation: $2\\times10^{-10}\\times4.6\\times10^6 = 9.2\\times10^{-4}$.', 'Generations per mutation: $1/9.2\\times10^{-4} \\approx 1090$.'] },
    { q: 'A culture of $10^9$ bacteria, each with a 5-million-bp genome and $\\mu = 2\\times10^{-10}$ per bp per division, has just divided once. How many cells carry a new mutation at one particular base pair?', answer: 0.2, tol: 0.02, steps: ['Each division has a chance $\\mu = 2\\times10^{-10}$ of changing that base.', '$10^9\\times2\\times10^{-10} = 0.2$ — but with $10^{10}$ cells, two would; large populations explore every single-base change.'] }
  ],
  applications: [
    'Genetic testing classifies variants as silent, missense, nonsense or frameshift to judge whether they may cause disease.',
    'The Ames test uses bacterial mutants to screen chemicals for mutagenic activity.',
    'Cancer drugs called PARP inhibitors exploit the repair defect of tumours lacking BRCA1 or BRCA2.',
    'Counting accumulated mutations dates the splits between species (the [[molecular-clock]]).'
  ],
  history: 'Hermann Muller showed in 1927 that X-rays cause mutations in fruit flies (Nobel Prize 1946). Salvador Luria and Max Delbrück\'s fluctuation test of 1943 showed that mutations arise at random. In the 1970s Bruce Ames developed his bacterial test for mutagens. Tomas Lindahl, Paul Modrich and Aziz Sancar shared the 2015 Nobel Prize in Chemistry for working out base excision, mismatch and nucleotide excision repair.',
  sim: 'molb-mutation'
},

{
  id: 'viruses', parent: 'gene-regulation', title: 'Viruses and how they replicate', level: 2,
  short: 'A virus is a set of genes — DNA or RNA — packed in a protein coat, with no metabolism of its own. It multiplies only inside a host cell by taking over the cell\'s machinery; some viruses kill the cell at once (lytic), others insert their genome and wait (lysogenic or latent).',
  keywords: ['virus', 'virion', 'capsid', 'envelope', 'bacteriophage', 'phage', 'lytic cycle', 'lysogenic cycle', 'prophage', 'temperate phage', 'lambda', 'T4', 'burst size', 'latent period', 'multiplicity of infection', 'retrovirus', 'reverse transcriptase', 'integrase', 'provirus', 'HIV', 'Baltimore classification', 'host range', 'endogenous retrovirus', 'antiviral', 'vaccine'],
  prereq: ['transcription', 'translation', 'prokaryotic-cells'],
  related: ['mutations', 'bacteria-archaea', 'noncoding-rna', 'crispr', 'gene-therapy', 'biosafety-bioethics', 'medicine:hiv', 'medicine:vaccines', 'medicine:influenza-covid', 'medicine:microbes-types'],
  body: `
Viruses are the most abundant biological entities on Earth: there are some $10^{31}$ bacteriophages (viruses of bacteria), about ten for every bacterium, and a millilitre of seawater holds around ten million. Yet a virus particle — a **virion** — does nothing on its own. It has no ribosomes and makes no ATP. It is a genome in a protective shell, waiting to meet a cell it can use.

### What a virus is
- A **genome** of DNA or RNA, single- or double-stranded, from under 2 kb (circoviruses) to 2.5 Mb (the giant pandoraviruses).
- A **capsid** of many copies of a few proteins, often forming a helix or an icosahedron — an economical shape built from identical parts.
- In many animal viruses, an **envelope** of host membrane studded with viral proteins.

Virions range from about 20 nm to over 700 nm: poliovirus 30 nm, influenza and SARS-CoV-2 about 100 nm, herpes viruses about 200 nm. Most are too small for a light microscope.

### Seven ways to make mRNA
Every virus must get its genes read by the host's ribosomes, so David Baltimore classified viruses by how they make mRNA:

| Class | Genome | Examples |
|---|---|---|
| I | double-stranded DNA | herpes viruses, adenoviruses, phages T4 and λ |
| II | single-stranded DNA | parvoviruses |
| III | double-stranded RNA | rotaviruses |
| IV | (+) single-stranded RNA, itself an mRNA | poliovirus, coronaviruses |
| V | (−) single-stranded RNA, copied into mRNA | influenza, measles |
| VI | RNA copied into DNA (reverse transcription) | retroviruses such as HIV |
| VII | DNA made via an RNA intermediate | hepatitis B virus |

### The cycle
All viruses follow the same outline: **attach** to a receptor on the host cell (which decides which cells, and which species, a virus can infect), **enter** and release the genome, **express** viral genes and **copy** the genome using host and viral enzymes, **assemble** new virions and **release** them — by bursting the cell or budding through its membrane.

### Lytic and lysogenic
Bacteriophages show the two strategies most clearly. A **virulent** phage such as T4 is always **lytic**: about 25 minutes after infecting *E. coli* at 37 °C the cell bursts, releasing some 100–200 new phages. A **temperate** phage such as λ (lambda) has a choice. It may go lytic, or it may **integrate** its DNA into the bacterial chromosome as a **prophage**, keep its lytic genes switched off with a repressor protein, and be copied quietly with the host at every division — the **lysogenic** cycle. The decision depends on conditions: when several phages infect the same cell, or the cell is starving, lysogeny is more likely — a bet that hosts are scarce. Lysogens are immune to further infection by the same phage. When the host's DNA is damaged, the repressor is destroyed, the prophage cuts itself out, and the lytic cycle resumes: the virus abandons a sinking ship. Some prophages carry genes that change their host — the toxin genes of the bacteria that cause diphtheria and cholera arrived this way.

### Retroviruses
**Retroviruses** reverse the usual flow of information. Their RNA genome is copied into DNA by **reverse transcriptase**, and **integrase** inserts that DNA into a host chromosome as a **provirus**, where it is transcribed like a cellular gene. HIV infects immune cells that carry the CD4 receptor; its reverse transcriptase makes about one error per 30 000 bases copied, so every new virus is slightly different — one reason the virus escapes immune responses and why treatment combines drugs against reverse transcriptase, protease and integrase ([[medicine:hiv|HIV]]). Retroviruses that infected the germline of our ancestors left their proviruses behind: about 8 % of the human genome is endogenous retroviral sequence, and one of these genes, syncytin, now helps to build the placenta.

### Evolution, defence and use
RNA viruses mutate fast ([[mutations]]), which is why influenza vaccines are updated every year ([[medicine:vaccines|vaccines]]). Bacteria defend themselves with restriction enzymes and CRISPR ([[crispr]]); plants and invertebrates with RNA interference ([[noncoding-rna]]). Antibiotics act on bacterial structures that viruses lack, so they do not work against viral infections. Viruses are also tools: modified viruses deliver genes in [[gene-therapy]], and phages are being tested against antibiotic-resistant bacteria.

> [!note] This page explains how viruses work; it is not a laboratory protocol. Any work with viruses — even harmless laboratory phages — follows the biosafety rules and approvals of your institution and country ([[biosafety-bioethics]]).
`,
  ideas: [
    'A virus is a genome (DNA or RNA) in a protein capsid, sometimes with an envelope; it has no metabolism and replicates only inside cells.',
    'The Baltimore classification sorts viruses by genome type and how they make mRNA.',
    'Every cycle has attachment, entry, gene expression and genome copying, assembly and release; receptors set the host range.',
    'Lytic phages burst the cell within minutes; temperate phages can integrate as prophages and are induced later.',
    'Retroviruses copy RNA into DNA with reverse transcriptase and integrate it; their error-prone copying makes them evolve fast.'
  ],
  pitfalls: [
    'Viruses are very small bacteria — They are not cells at all: no ribosomes, no metabolism, no division; they are assembled from parts made by the host.',
    'Antibiotics can cure viral infections — Antibiotics target bacterial walls, ribosomes and enzymes, which viruses do not have; antiviral drugs target viral enzymes such as polymerases and proteases.',
    'A lysogenic phage has been defeated — The prophage is kept silent but intact, and is induced back into the lytic cycle when the host is damaged.'
  ],
  formulas: [
    {
      name: 'Fraction of cells infected (Poisson)',
      expr: 'f = 1 - exp(-MOI)', tex: 'f = 1 - e^{-\\mathrm{MOI}}',
      vars: {
        f: { name: 'fraction of cells infected by at least one virus', q: 'ratio', unit: '%' },
        MOI: { name: 'multiplicity of infection (viruses per cell)', value: 1, min: 0, max: 50, tex: '\\mathrm{MOI}' }
      },
      note: 'Viruses land on cells at random, so the number per cell follows a Poisson distribution with mean MOI; e^(−MOI) of the cells receive none.',
      stories: { f: 'Phages are mixed with bacteria at a multiplicity of {MOI}. What fraction of the bacteria are infected?', MOI: 'What multiplicity of infection is needed to infect {f} of the cells?' }
    },
    {
      name: 'Amplification over several lytic cycles (idealised)',
      expr: 'A = b^c', tex: 'A = b^{c}',
      vars: {
        A: { name: 'increase in the number of phages', q: 'count' },
        b: { name: 'burst size (phages released per infected cell)', q: 'count', value: 100 },
        c: { name: 'number of synchronous cycles', q: 'count', int: true, value: 3, min: 1, max: 10 }
      },
      note: 'An upper limit, reached only while uninfected hosts are plentiful; in any real culture the hosts run out within a few cycles.',
      stories: { A: 'A phage with a burst size of {b} goes through {c} cycles with unlimited hosts. By what factor does it multiply?' }
    }
  ],
  examples: [
    {
      title: 'Who gets infected',
      q: 'Phages are added to bacteria at an average of 2 per cell. What fraction of cells receive none, one, and two or more?',
      steps: [
        'None: $e^{-2} = 13.5$ %.',
        'Exactly one: $2e^{-2} = 27.1$ %.',
        'Two or more: $100 - 13.5 - 27.1 = 59.4$ % — the cells in which a temperate phage such as λ most often chooses lysogeny.'
      ],
      a: '13.5 % uninfected, 27.1 % singly infected, 59.4 % multiply infected.'
    },
    {
      title: 'A burst in numbers',
      q: 'T4 releases about 150 phages per cell after about 25 minutes. Idealised, how much could one phage multiply in 75 minutes?',
      steps: [
        '75 minutes is three cycles: $A = 150^3 \\approx 3.4\\times10^6$.',
        'In practice a culture of $10^8$ bacteria per millilitre would be used up within a few cycles — the population crashes, which is what the simulation shows.'
      ],
      a: 'About three million times, while hosts last.'
    }
  ],
  quiz: [
    { q: 'Why do antibiotics not work against a cold or influenza?', choices: ['Viruses lack the bacterial structures and enzymes antibiotics attack', 'Viruses are too small for antibiotics to reach', 'Viruses are killed by the immune system too quickly', 'Antibiotics only work on skin infections'], a: 0, why: 'Antibiotics target things such as bacterial cell walls and ribosomes; a virus uses the host\'s ribosomes and has no wall.' },
    { q: 'A temperate phage integrates its DNA into the host chromosome and keeps its lytic genes off. This is…', choices: ['the lysogenic cycle', 'the lytic cycle', 'reverse transcription', 'transduction'], a: 0, why: 'The integrated prophage is replicated with the host; DNA damage can induce it back into the lytic cycle.' },
    { q: 'What does reverse transcriptase do?', choices: ['makes DNA from an RNA template', 'makes RNA from a DNA template', 'makes protein from RNA', 'cuts viral DNA into the host genome'], a: 0, why: 'It copies the retroviral RNA genome into DNA; integrase then inserts the DNA into the host genome.' },
    { q: 'All viruses have DNA genomes.', a: false, why: 'Many have RNA genomes — influenza, measles, polio, coronaviruses and retroviruses among them.' },
    { q: 'At a multiplicity of infection of 3, what percentage of cells stay uninfected?', answer: 4.98, unit: '%', why: '$e^{-3} = 0.0498$, about 5 %.' }
  ],
  problems: [
    { q: 'What multiplicity of infection is needed so that 99 % of cells are infected?', answer: 4.6, tol: 0.02, steps: ['$1 - e^{-m} = 0.99$ gives $e^{-m} = 0.01$.', '$m = \\ln 100 = 4.6$.'] }
  ],
  applications: [
    'Vaccines train the immune system against viral proteins; antiviral drugs block viral enzymes.',
    'Viral vectors (adeno-associated viruses, lentiviruses) deliver genes in gene therapy and CAR-T cell therapy.',
    'Phage therapy is being explored against bacteria resistant to all antibiotics.',
    'Phage enzymes and phage display are everyday tools of molecular biology.'
  ],
  history: 'Dmitri Ivanovsky (1892) and Martinus Beijerinck (1898) showed that tobacco mosaic disease is caused by an agent that passes through filters that stop bacteria. Frederick Twort (1915) and Félix d\'Hérelle (1917) discovered bacteriophages. Alfred Hershey and Martha Chase showed in 1952, with labelled phages, that DNA rather than protein enters the cell. André Lwoff explained lysogeny in the 1950s, and Howard Temin and David Baltimore discovered reverse transcriptase in 1970 (Nobel Prize 1975).',
  sim: 'molb-phage'
}

);
