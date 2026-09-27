/* HYPER-BIOLOGY · content/biotech.js
 *
 * Biotechnology and Genomics: working with DNA (restriction enzymes and cloning, PCR, gel
 * electrophoresis, sequencing, CRISPR, measuring expression) and genomics and its uses
 * (genomes, bioinformatics, GMOs, gene therapy, biosafety and bioethics).
 *
 * These pages explain how the techniques work and what they have changed. They are not
 * laboratory protocols: no methods, quantities or conditions for working with organisms.
 * Simulations: sims/biotech.js (tech-*).
 */
Hyper.add(

{
  id: 'restriction-cloning', parent: 'dna-technology', title: 'Restriction enzymes and cloning', level: 2,
  short: 'Bacteria defend themselves with enzymes that cut DNA at short, specific sequences. Biologists borrowed them to cut a gene out of one molecule and paste it into another — a plasmid that a bacterium will then copy for them.',
  keywords: ['restriction enzyme', 'recognition site', 'sticky ends', 'blunt ends', 'palindrome', 'ligase', 'plasmid', 'vector', 'cloning', 'EcoRI', 'transformation', 'selection'],
  prereq: ['dna-structure', 'dna-replication', 'enzymes'],
  related: ['gel-electrophoresis', 'pcr', 'gmos', 'bacteria-archaea', 'chemistry:nucleic-acids'],
  body: `
A **restriction enzyme** is a bacterial nuclease that cuts double-stranded DNA wherever it finds one particular short sequence — its **recognition site**. The bacterium chemically marks its own copies of that sequence, so only foreign DNA, mostly from infecting viruses, is cut to pieces. The name comes from the phenomenon: certain phages were *restricted*, unable to grow, on certain bacterial strains.

Most recognition sites are **palindromes** in the double-stranded sense: the top strand read left to right is the same as the bottom strand read left to right. EcoRI reads GAATTC; its partner strand also reads GAATTC. That symmetry is no accident — the enzyme is a dimer of two identical subunits, each reading one strand.

### Sticky ends and blunt ends
Where the two strands are cut matters more than where the site is.

| Enzyme | Site | Cut | Ends |
|---|---|---|---|
| EcoRI | GAATTC | between G and A, on both strands | 4-base 5′ overhang (AATT) |
| BamHI | GGATCC | between G and G | 4-base 5′ overhang (GATC) |
| PstI | CTGCAG | between A and G | 4-base 3′ overhang |
| SmaI | CCCGGG | in the middle | blunt |
| NotI | GCGGCCGC | between GC and GG | 4-base 5′ overhang, rare site |

An offset cut leaves single-stranded **sticky ends** — short overhangs that pair with any other end cut by the same enzyme, wherever it came from. Two pieces of DNA from different species will hold together by those four hydrogen-bonded base pairs long enough for an enzyme called **DNA ligase** to seal the backbone. That is the whole trick of recombinant DNA, and it is why the first experiments in 1972–73 worked at all. Blunt ends join too, but any blunt end joins any other, so the joining is less controlled.

### How often does an enzyme cut?
If the four bases were equally common and independent, a particular $n$-letter site would appear once in every $4^n$ base pairs: about every 256 bp for a 4-cutter, every 4096 bp for a 6-cutter such as EcoRI, and every 65 536 bp for an 8-cutter such as NotI. That is why 6-cutters are the workhorses — a 3000 bp plasmid usually has a handful of sites, not hundreds — and why a rare-cutting 8-cutter is chosen when a genome must be broken into very large pieces. Real genomes deviate: sites containing CG are scarcer than predicted in vertebrate DNA, because methylated CG mutates readily to TG.

### Cloning: vector, ligation, selection
To **clone** a gene is to make many identical copies of it inside a living cell.

1. A **vector** carries it. The classic vector is a plasmid: a small circular DNA molecule that bacteria copy independently of their chromosome, carrying an origin of replication, a selectable marker such as an antibiotic-resistance gene, and a short stretch with many unique restriction sites.
2. Vector and the DNA of interest are cut with the same enzymes, so their ends match, and ligase joins them. Cutting with two different enzymes makes the insert go in one way round only.
3. Bacteria take the mixture up — **transformation** — and are then grown where only cells carrying the plasmid survive. That **selection** step is essential: uptake is rare, and without it the few successes would be lost among billions of ordinary cells. A second screen distinguishes plasmids that took the insert from those that simply closed up again.

> [!key] Restriction enzymes cut at fixed short sequences; matching sticky ends let DNA from any two sources be joined; a vector plus selection turns one joined molecule into a colony of billions of identical copies.

Restriction enzymes are used less for building constructs now — [[pcr|PCR]], synthesis of whole genes and overlap-based assembly methods are faster — but they remain the standard way to *check* a construct, and the logic of vector, insert and selection is unchanged. The techniques are described here as ideas; real work is done under the biosafety rules and approvals of one's institution and country (see [[biosafety-bioethics]]).
`,
  ideas: [
    'Restriction enzymes cut double-stranded DNA at a specific short, usually palindromic, recognition site.',
    'An offset cut leaves sticky ends that pair with any end cut by the same enzyme; ligase seals the join.',
    'A site of n letters is expected about once every 4ⁿ base pairs, so 6-cutters give convenient fragment sizes.',
    'Cloning = a vector that replicates, an insert joined to it, and a selection that finds the rare cell that took it up.',
    'Cutting with two different enzymes forces the insert in one orientation.'
  ],
  pitfalls: [
    'Sticky ends stick because the enzyme makes them chemically special — They are ordinary single-stranded overhangs; any two overhangs with complementary sequence pair, which is why DNA from different species joins.',
    'A restriction enzyme cuts a gene — It cuts a sequence. It has no idea what a gene is, and a site can fall anywhere: inside a gene, between genes, or nowhere in a given molecule.',
    'Every 6-cutter cuts a 4 kb plasmid exactly once — 4096 bp is an average expectation, not a rule. A given plasmid may have none, one or five sites for a given enzyme.'
  ],
  formulas: [
    {
      name: 'How often a recognition site is expected',
      expr: 'N = L/4^n', tex: 'N = \\dfrac{L}{4^{n}}',
      vars: {
        N: { name: 'expected number of sites', q: 'count' },
        L: { name: 'length of the DNA (bp)', q: false, unit: 'bp', value: 48502 },
        n: { name: 'letters in the recognition site', q: 'count', value: 6, int: true, min: 2, max: 10 }
      },
      note: 'Assumes the four bases are equally common and independent — a rough guide, not a prediction for a particular molecule.',
      stories: {
        N: 'How many EcoRI sites ({n} letters) would you expect in the {L} of phage lambda DNA?',
        n: 'A {L} molecule is cut into about {N} pieces by an enzyme. How many letters does its site have?'
      }
    },
    {
      name: 'Mean fragment length of a digest',
      expr: 'Lf = 4^n', tex: 'L_f = 4^{n}',
      vars: {
        Lf: { name: 'mean fragment length (bp)', q: false, unit: 'bp' },
        n: { name: 'letters in the recognition site', q: 'count', value: 6, int: true, min: 2, max: 10 }
      },
      note: '256 bp for a 4-cutter, 4096 bp for a 6-cutter, 65 536 bp for an 8-cutter.',
      stories: { Lf: 'An enzyme recognises a site of {n} letters. What fragment length would you expect on average?' }
    },
    {
      name: 'Insert-to-vector molar ratio',
      expr: 'R = (mi/Li)/(mv/Lv)', tex: 'R = \\dfrac{m_i/L_i}{m_v/L_v}',
      vars: {
        R: { name: 'molar ratio, insert : vector', q: 'ratio' },
        mi: { name: 'mass of insert (ng)', q: false, unit: 'ng', value: 30, tex: 'm_i' },
        Li: { name: 'length of insert (bp)', q: false, unit: 'bp', value: 1000, tex: 'L_i' },
        mv: { name: 'mass of vector (ng)', q: false, unit: 'ng', value: 50, tex: 'm_v' },
        Lv: { name: 'length of vector (bp)', q: false, unit: 'bp', value: 3000, tex: 'L_v' }
      },
      note: 'Equal masses are not equal numbers of molecules: a short insert has far more molecules per nanogram than a long vector.',
      stories: { R: 'You join {mi} of a {Li} insert to {mv} of a {Lv} vector. What is the molar ratio of insert to vector?' }
    }
  ],
  examples: [
    {
      title: 'Counting sites in a plasmid',
      q: 'A circular plasmid is 4800 bp long. How many EcoRI (GAATTC) sites would you expect, and how many fragments would you get from one site, two sites and three sites?',
      steps: [
        'Expected sites: $N = 4800/4^6 = 4800/4096 = 1.2$ — about one.',
        'A circle cut once becomes one linear piece; cut twice, two pieces; cut three times, three pieces.',
        'A linear molecule behaves differently: $k$ cuts give $k + 1$ pieces.'
      ],
      a: 'About one site expected; a circle cut k times gives k fragments, a linear molecule k + 1.'
    },
    {
      title: 'Why the molar ratio matters',
      q: 'You have 50 ng of a 3000 bp vector and 30 ng of a 1000 bp insert. What is the molar ratio?',
      steps: [
        'Moles are proportional to mass divided by length: vector $50/3000 = 0.0167$, insert $30/1000 = 0.030$.',
        '$R = 0.030/0.0167 = 1.8$ insert molecules for every vector molecule.',
        'Joining reactions are usually set up with a few times more insert than vector, so that a vector end is more likely to meet an insert than to close on itself.'
      ],
      a: 'About 1.8 : 1 — under two insert molecules per vector molecule.'
    }
  ],
  quiz: [
    { q: 'EcoRI (GAATTC) is expected to cut roughly once in every…', choices: ['256 bp', '4096 bp', '65 536 bp', '1 000 000 bp'], a: 1, why: 'A six-letter site: 4⁶ = 4096 bp on average, if the bases were equally common.' },
    { q: 'Why can a human gene cut with BamHI be joined to a bacterial plasmid cut with BamHI?', choices: ['The enzyme recognises human and bacterial DNA differently', 'Both cuts leave the same four-base overhang, which pairs by base-pairing', 'Ligase recognises the enzyme that made the cut', 'The plasmid copies the human sequence first'], a: 1, why: 'The overhangs are complementary single strands; base pairing holds the ends together and ligase seals the backbone. DNA chemistry is the same in every species.' },
    { q: 'A circular plasmid cut at three sites by one enzyme gives how many fragments?', answer: 3, why: 'Each cut on a circle opens it; k cuts give k fragments. A linear molecule would give k + 1 = 4.' },
    { q: 'An eight-letter recognition site is used when you want very large fragments.', a: true, why: '4⁸ = 65 536 bp expected between sites, so an 8-cutter breaks a genome into far fewer, far longer pieces than a 6-cutter.' },
    { q: 'Selection with an antibiotic-resistance gene on the plasmid is needed because…', choices: ['bacteria would otherwise digest the plasmid', 'only a tiny fraction of cells take up a plasmid, and they must be found', 'the insert will not replicate without it', 'ligase needs it to work'], a: 1, why: 'Transformation is rare. Growing the cells where only plasmid-carrying ones survive turns a rare event into a visible colony.' }
  ],
  problems: [
    { q: 'How many sites would you expect for a four-letter recognition site in a 20 000 bp molecule?', answer: 78, unit: '', tol: 0.03, steps: ['$N = 20000/4^4 = 20000/256 = 78$.'] },
    { q: 'What is the molar ratio if you use 20 ng of a 500 bp insert with 100 ng of a 5000 bp vector?', answer: 2, tol: 0.02, steps: ['Insert: $20/500 = 0.04$. Vector: $100/5000 = 0.02$. Ratio $= 2$.'] }
  ],
  applications: [
    'Cut a sequence with common enzymes and run the fragments on a virtual gel in [the digest tool](#/tools/sequence/digest).',
    'Checking that a construct is what it should be: a digest gives a predictable pattern of fragment sizes on a gel.',
    'Making proteins in bacteria or yeast — insulin, growth hormone, enzymes for detergents and food.',
    'Restriction fragment length polymorphisms (RFLPs), the first DNA markers used for mapping and identification.',
    'Cutting genomic DNA into pieces of a chosen size range before library construction and sequencing.'
  ],
  history: 'Werner Arber proposed host restriction in the 1960s; Hamilton Smith purified a site-specific enzyme in 1970 and Daniel Nathans used one to map a viral genome — the three shared the 1978 Nobel Prize. In 1972–73 Paul Berg, and then Stanley Cohen and Herbert Boyer, joined DNA from different sources and had bacteria copy it. The speed of that step worried its own inventors: the 1975 Asilomar conference, convened by the scientists themselves, agreed a moratorium and then a framework of containment rules — an early example of a field regulating itself.',
  sim: 'tech-digest'
},

{
  id: 'pcr', parent: 'dna-technology', title: 'The polymerase chain reaction', level: 2,
  short: 'PCR copies one chosen stretch of DNA over and over, doubling it every cycle, until a few molecules become billions. Three temperatures, two short primers and an enzyme that survives boiling are all it takes.',
  keywords: ['PCR', 'polymerase chain reaction', 'primer', 'Taq polymerase', 'annealing', 'melting temperature', 'Tm', 'amplicon', 'qPCR', 'Ct', 'real-time PCR', 'exponential amplification'],
  prereq: ['dna-replication', 'dna-structure', 'restriction-cloning'],
  related: ['gel-electrophoresis', 'dna-sequencing', 'gene-expression-tools', 'crispr', 'math:exponential-growth-decay', 'medicine:lab-tests'],
  body: `
DNA polymerase cannot start a strand from nothing: it extends an existing short piece — a **primer** — base by base along a template. PCR turns that limitation into a tool. Choose two primers, each about 18–25 bases long, matching the two ends of the stretch you want, on opposite strands and pointing towards each other. Everything between them gets copied; everything else does not.

### The three temperatures
Each cycle passes through three steps, which is why a PCR machine is really just a very precise, very fast heating block.

| Step | About | What happens |
|---|---|---|
| Denaturation | 95 °C | the double helix comes apart into single strands |
| Annealing | 50–65 °C | primers find and pair with their matching sequences |
| Extension | 72 °C | the polymerase extends each primer along its template |

The heat is the problem: an ordinary polymerase is a protein, and 95 °C destroys it (see [[protein-structure]]). Early PCR meant adding fresh enzyme by hand every cycle. The fix came from a bacterium, *Thermus aquaticus*, found in a hot spring in Yellowstone — its polymerase, **Taq**, works at 72 °C and survives repeated trips to 95 °C. One addition at the start now lasts thirty cycles, which is what made PCR a machine rather than an afternoon.

### Why it explodes
Every template strand becomes two; those two become four. After $n$ cycles a starting number $N_0$ has become

$$N = N_0(1 + E)^n$$

where the **efficiency** $E$ is 1 for perfect doubling. Thirty cycles of perfect doubling multiply by $2^{30} \\approx 1.07\\times10^9$: a single molecule becomes a billion, enough to see on a gel. From the third cycle onwards, nearly all of the product is exactly the stretch between the two primers — the **amplicon** — because only those molecules have an end defined by a primer at both ends.

Efficiency is never quite 1 in practice; 0.8–0.95 is typical, and a difference that sounds small compounds: after 30 cycles, $E = 0.9$ gives a quarter of the yield of $E = 1.0$. And no reaction is exponential for ever. As product accumulates, primers and nucleotides run low and strands re-pair with each other faster than with primers, so the curve bends over into a **plateau**. The plateau is why the amount of product at the end of an ordinary PCR tells you almost nothing about how much you started with.

### Primers and their melting temperature
A primer must pair firmly enough at the annealing temperature to stay put, and specifically enough not to pair elsewhere. Its **melting temperature** $T_m$ — where half of the copies are paired — rises with length and with GC content, because a G–C pair has three hydrogen bonds to A–T's two. For short primers a simple count is a decent guide: $T_m \\approx 2(n_A + n_T) + 4(n_G + n_C)$ °C. Annealing is usually run a few degrees below the lower of the two primers' $T_m$: too cold and the primers tolerate mismatches and amplify the wrong thing; too hot and nothing anneals at all. You can try this on the [sequence tools](#/tools/sequence).

### Real-time PCR: watching it happen
If a fluorescent signal reports the amount of product as the reaction runs, the useful number is not the end point but the **cycle threshold** $C_t$ — the cycle at which the signal first rises clearly above the background. A sample with twice as much starting material crosses the threshold one cycle earlier, so $C_t$ falls as the logarithm of the starting amount: with perfect doubling, a tenfold difference in starting material is $\\log_2 10 = 3.32$ cycles. Comparing $C_t$ values between a gene of interest and a steady reference gene, and between treated and untreated samples, gives the ΔΔCt measure used to quantify expression (see [[gene-expression-tools]]).

> [!key] PCR's power is exponential growth from a defined starting point: two primers set the boundaries, and doubling does the rest. Its weakness is the same exponential — a single stray molecule of the wrong DNA is amplified just as faithfully.

That sensitivity is why PCR reaches a few molecules in a forensic trace or a clinical swab, and why contamination control matters so much: the most common cause of an unexpected band is product from yesterday's reaction. PCR is described here as an idea; school and undergraduate teaching laboratories run it under supervision with their own institution's rules.
`,
  ideas: [
    'Two primers pointing towards each other define exactly which stretch is copied.',
    'Each cycle at best doubles the product: N = N₀(1 + E)ⁿ, so 30 cycles multiply by about a billion.',
    'A heat-stable polymerase (Taq, from a hot-spring bacterium) survives the 95 °C denaturation step, making cycling automatic.',
    'Primer melting temperature rises with length and GC content; the annealing temperature sets the specificity.',
    'Reactions plateau as reagents run out, so end-point amounts do not measure the starting amount — Ct in real-time PCR does.'
  ],
  pitfalls: [
    'PCR copies the whole DNA molecule — It copies only the stretch between the two primers; the rest of the template is never amplified exponentially.',
    'More cycles always give more product — Once the reaction plateaus, extra cycles add almost nothing, and they do add errors and non-specific products.',
    'A strong band means there was a lot of starting material — After a plateau, very different starting amounts give similar end amounts. That is exactly why quantitative PCR measures Ct instead.'
  ],
  derivation: {
    title: 'Why Ct falls logarithmically with starting amount',
    steps: [
      { text: 'The product grows by a factor $(1 + E)$ each cycle, so at the threshold cycle $C_t$ the amount has reached a fixed detection level $N_T$:', tex: 'N_T = N_0(1 + E)^{C_t}' },
      { text: 'Take logarithms and solve for $C_t$:', tex: 'C_t = \\frac{\\ln(N_T/N_0)}{\\ln(1 + E)}' },
      { text: 'So $C_t$ is a straight line against $\\ln N_0$ with a negative slope. With perfect doubling, ten times more starting material crosses the threshold $\\log_2 10 = 3.32$ cycles earlier.', tex: '\\Delta C_t = -\\log_{2} 10 \\approx -3.32' }
    ]
  },
  formulas: [
    {
      name: 'Exponential amplification',
      expr: 'N = N0*(1 + E)^n', tex: 'N = N_0(1 + E)^{n}',
      vars: {
        N: { name: 'copies after n cycles', q: 'count' },
        N0: { name: 'copies at the start', q: 'count', value: 1000, tex: 'N_0' },
        E: { name: 'efficiency per cycle', q: 'ratio', unit: '%', value: 100, min: 1, max: 100 },
        n: { name: 'number of cycles', q: 'count', value: 30, int: true, min: 1, max: 50 }
      },
      note: 'E = 100 % is perfect doubling. Real reactions run at 80–95 % and plateau once reagents run low.',
      practice: { unknowns: ['N', 'n', 'E'] },
      stories: {
        N: 'A reaction starts with {N0} copies and runs {n} cycles at {E} efficiency. How many copies are there at the end?',
        n: 'How many cycles at {E} efficiency turn {N0} copies into {N}?',
        E: 'Starting from {N0} copies, {n} cycles gave {N} copies. What was the efficiency per cycle?'
      }
    },
    {
      name: 'Primer melting temperature (the Wallace rule)',
      expr: 'Tm = 2*nAT + 4*nGC', tex: 'T_m = 2 n_{AT} + 4 n_{GC}',
      vars: {
        Tm: { name: 'melting temperature (°C)', q: false, unit: '°C', tex: 'T_m' },
        nAT: { name: 'number of A and T bases', q: 'count', value: 10, int: true, min: 0, max: 40, tex: 'n_{AT}' },
        nGC: { name: 'number of G and C bases', q: 'count', value: 10, int: true, min: 0, max: 40, tex: 'n_{GC}' }
      },
      note: 'A rough rule for primers shorter than about 14–20 bases; longer primers need a formula that accounts for length and salt.',
      stories: { Tm: 'A 20-base primer has {nAT} A/T bases and {nGC} G/C bases. What is its approximate melting temperature?' }
    },
    {
      name: 'Cycle threshold in real-time PCR',
      expr: 'Ct = ln(NT/N0)/ln(1 + E)', tex: 'C_t = \\dfrac{\\ln(N_T/N_0)}{\\ln(1 + E)}',
      vars: {
        Ct: { name: 'cycle threshold', q: 'count', tex: 'C_t' },
        NT: { name: 'copies at the detection threshold', q: 'count', value: 1e10, tex: 'N_T' },
        N0: { name: 'copies at the start', q: 'count', value: 1000, tex: 'N_0' },
        E: { name: 'efficiency per cycle', q: 'ratio', unit: '%', value: 100, min: 1, max: 100 }
      },
      note: 'The threshold level NT is set by the instrument, the same for every well, which is what makes Ct comparable between samples.',
      stories: {
        Ct: 'A reaction starting with {N0} copies at {E} efficiency is detected once it reaches {NT} copies. At which cycle?',
        N0: 'A well crosses the threshold of {NT} copies at cycle {Ct}, at {E} efficiency. How many copies did it start with?'
      }
    }
  ],
  examples: [
    {
      title: 'One molecule to a visible band',
      q: 'A forensic sample contains about 10 copies of a target. After 32 cycles at 90 % efficiency, how many copies are there — and is that enough to see?',
      steps: [
        '$N = 10\\times(1.9)^{32}$.',
        '$\\ln N = \\ln 10 + 32\\ln 1.9 = 2.30 + 32(0.642) = 22.8$, so $N \\approx 8\\times10^{9}$.',
        'A 300 bp double-stranded molecule weighs about $2\\times10^5$ g/mol, so $8\\times10^9$ copies is roughly 2.6 ng — a faint but visible band, since staining detects about a nanogram.'
      ],
      a: 'About 8 × 10⁹ copies, a few nanograms: visible, but faint enough that trace samples are usually run for more cycles or read in real time.'
    },
    {
      title: 'What two cycles of Ct mean',
      q: 'Two samples of the same target differ by 2.0 cycles in Ct, with an efficiency of 100 %. How much more target did the earlier one have?',
      steps: [
        'Each cycle is a doubling, so a difference of $\\Delta C_t$ cycles is a factor $2^{\\Delta C_t}$.',
        '$2^{2.0} = 4.0$.',
        'At a realistic 90 % efficiency it would be $1.9^{2.0} = 3.6$ — which is why the efficiency of an assay is measured before it is trusted.'
      ],
      a: 'Four times as much at perfect efficiency (3.6 times at 90 %).'
    },
    {
      title: 'Choosing an annealing temperature',
      q: 'A primer reads GCGATCGAATTCGCTAGC (18 bases: 6 A/T, 12 G/C). Estimate its Tm by the Wallace rule.',
      steps: [
        '$T_m = 2(6) + 4(12) = 12 + 48 = 60$ °C.',
        'Annealing a few degrees below this — around 55–57 °C — keeps the pairing specific.',
        'Its GC content is 12/18 = 67 %, which is high; a more balanced primer of the same length would melt nearer 50 °C.'
      ],
      a: 'About 60 °C, so anneal near 55–57 °C.'
    }
  ],
  quiz: [
    { q: 'After 20 cycles at perfect efficiency, one template molecule has become about…', choices: ['20 copies', '400 copies', 'a million copies', 'a billion copies'], a: 2, why: '2²⁰ = 1 048 576 — about a million. A billion takes 30 cycles.' },
    { q: 'Why is a heat-stable polymerase needed?', choices: ['DNA only melts if the enzyme is hot', 'Primers anneal better at high temperature', 'The 95 °C step that separates the strands would destroy an ordinary enzyme each cycle', 'It prevents contamination'], a: 2, why: 'Strand separation needs about 95 °C, which denatures ordinary proteins. Taq polymerase survives it, so the enzyme is added once instead of every cycle.' },
    { q: 'Lowering the annealing temperature by 10 °C is most likely to…', choices: ['stop the reaction', 'give extra, unwanted products', 'increase the efficiency to above 100 %', 'shorten the amplicon'], a: 1, why: 'Cooler annealing lets primers pair despite mismatches, so they prime at unintended sites and extra bands appear.' },
    { q: 'A sample that crosses the fluorescence threshold 3.3 cycles earlier than another started with about ten times more target (at 100 % efficiency).', a: true, why: 'log₂10 = 3.32, so a tenfold difference in starting amount is 3.32 doublings.' },
    { q: 'Two reactions run 30 cycles from very different starting amounts and end with similar amounts of product. The best explanation is…', choices: ['the efficiency was above 100 %', 'both reached the plateau, where reagents limit the yield', 'the primers were too long', 'the polymerase lost activity in the first cycle'], a: 1, why: 'Exponential growth cannot continue once primers and nucleotides run low; different starting amounts converge at the plateau. This is why end-point PCR is not quantitative.' }
  ],
  problems: [
    { q: 'Starting from 50 copies, how many are there after 25 cycles at 100 % efficiency?', answer: 1.68e9, tol: 0.03, steps: ['$50 \\times 2^{25} = 50 \\times 3.355\\times10^7 = 1.68\\times10^{9}$.'] },
    { q: 'How many cycles at 100 % efficiency are needed to turn 1 copy into 10⁹?', answer: 29.9, tol: 0.03, hint: 'Take logarithms to base 2.', steps: ['$n = \\log_2 10^9 = 9\\log_2 10 = 9 \\times 3.322 = 29.9$ — in practice, 30 cycles.'] },
    { q: 'A 22-base primer has 8 G/C bases. Estimate its Tm by the Wallace rule.', answer: 60, unit: '°C', tol: 0.02, steps: ['A/T bases: 22 − 8 = 14. $T_m = 2(14) + 4(8) = 28 + 32 = 60$ °C.'] }
  ],
  applications: [
    'Check a primer pair against a template and follow the product cycle by cycle in [the primer tool](#/tools/sequence/primers).',
    'Detecting an infection from a swab by amplifying a piece of the pathogen\'s genome — the basis of most molecular diagnostic tests.',
    'Forensic identification from trace amounts of DNA, and identifying remains.',
    'Amplifying a gene before sequencing or cloning it; preparing libraries for sequencing.',
    'Measuring gene expression by real-time PCR on cDNA made from RNA.',
    'Reading DNA from museum specimens, permafrost and ancient bones, where only fragments survive.'
  ],
  history: 'Kary Mullis described the idea in 1983 at Cetus Corporation and shared the 1993 Nobel Prize in Chemistry for it; his colleagues built the first working reactions and the thermal cycler. The heat-stable polymerase came from Thermus aquaticus, isolated from a Yellowstone hot spring by Thomas Brock in 1969 — a piece of pure curiosity-driven microbiology that turned out to be worth a whole industry, and a standing argument for studying organisms with no obvious use.',
  sim: 'tech-pcr'
},

{
  id: 'gel-electrophoresis', parent: 'dna-technology', title: 'Gel electrophoresis', level: 1,
  short: 'DNA is negatively charged, so an electric field drags it through a jelly of tangled fibres. Small fragments thread through faster than large ones, so a mixture sorts itself into bands by size.',
  keywords: ['electrophoresis', 'agarose', 'gel', 'ladder', 'DNA marker', 'migration', 'band', 'sieving', 'polyacrylamide', 'base pairs'],
  prereq: ['dna-structure', 'restriction-cloning', 'physics:electric-field'],
  related: ['pcr', 'dna-sequencing', 'protein-structure', 'chemistry:chromatography', 'physics:electric-charge'],
  body: `
Every phosphate in a DNA backbone carries one negative charge, and there is one phosphate per nucleotide. So a DNA molecule's charge is proportional to its length — and so, very nearly, is the force on it in an electric field. In free solution that is a dead end: twice the charge also means twice the drag, and every fragment moves at the same speed.

The trick is to make them move through something tangled. **Agarose**, a polysaccharide from seaweed, sets into a gel threaded with pores a few hundred nanometres across. A short fragment slips through easily; a long one must snake its way, head first, through a maze of openings barely wider than it is, and is held up much more. Size, not charge, now decides speed.

### Reading a gel
Samples are placed in wells at one end and a field of a few volts per centimetre pulls the DNA towards the positive electrode — always "to the red", a useful thing to remember. Over the useful range, the distance a fragment travels falls almost exactly as the logarithm of its size:

$$d = a - b\\log_{10}(\\text{bp})$$

A **ladder** — a mixture of fragments of known sizes, run in its own lane — calibrates $a$ and $b$ on that gel, that day. Plot the log of each ladder size against the distance it moved, draw the line, and read off the unknowns. The relation flattens at both ends: very large fragments pile up near the well and stop resolving, very small ones run off the end.

| Gel | Useful range |
|---|---|
| 0.5 % agarose | roughly 1000–30 000 bp |
| 1 % agarose | roughly 250–10 000 bp |
| 2 % agarose | roughly 50–2000 bp |
| Polyacrylamide | roughly 5–500 bp, to single-base resolution |

A denser gel has smaller pores and separates smaller fragments; the choice of gel is really a choice of which size range to spread out. Separating whole chromosomes needs a different idea altogether — pulsed-field electrophoresis, where the direction of the field keeps changing so that very long molecules must repeatedly reorient, and size matters again.

### What a gel tells you
- **Did the reaction work?** One clean band of the expected size after [[pcr|PCR]]; several bands of predicted sizes after a restriction digest.
- **How big is it?** Compared against the ladder, to within a few per cent.
- **Is it what I think it is?** A plasmid cut with two enzymes gives a fingerprint of sizes that a wrong construct will not match.
- **How much is there?** Brightness scales roughly with mass of DNA, so a band can be compared with a ladder of known amounts — roughly, not precisely.

> [!note] Bands are made visible with a dye that slips between the bases and glows under ultraviolet or blue light. Such dyes bind DNA — including the operator's — and ultraviolet light damages skin and eyes, so this step is done with the shielding, gloves and waste handling that the laboratory's own safety rules require.

Two subtleties catch people out. First, shape matters as much as size for circular DNA: a supercoiled plasmid is compact and runs fast, the same plasmid nicked into an open circle runs slow, and cut into a line runs in between — one plasmid, three bands, all the same number of base pairs. Second, a single-stranded molecule such as RNA folds on itself, so sizing it needs conditions that keep it unfolded.

Proteins are separated the same way but must first be given a uniform charge-to-mass ratio, by coating them with a detergent; then they too sort by size. Sequencing by the Sanger method was, for twenty years, electrophoresis pushed to its limit — a gel that resolves fragments differing by a single base (see [[dna-sequencing]]).
`,
  ideas: [
    'DNA has one negative charge per nucleotide, so charge is proportional to length and, in free solution, all sizes move at the same speed.',
    'A gel sieves: small fragments thread through the pores faster, so separation is by size.',
    'Distance travelled falls as the logarithm of the fragment size, so a ladder of known sizes calibrates the lane.',
    'Denser gels have smaller pores and resolve smaller fragments.',
    'Shape matters too: supercoiled, nicked and linear forms of one plasmid run as three different bands.'
  ],
  pitfalls: [
    'Big fragments move faster because they carry more charge — Extra charge is exactly cancelled by extra drag; in a gel the extra length is purely a handicap, so large fragments move slowest.',
    'Distance is proportional to size — It falls with the logarithm of size. Between 1000 and 2000 bp a band moves a certain distance; the same distance separates 2000 from 4000, not 2000 from 3000.',
    'Two bands mean two different sequences — One plasmid can give several bands because of supercoiling, and a partial digest gives extra bands from incompletely cut molecules.'
  ],
  formulas: [
    {
      name: 'Migration distance against size',
      expr: 'd = a - b*log(bp)', tex: 'd = a - b\\log_{10}(\\mathrm{bp})',
      vars: {
        d: { name: 'distance migrated', q: 'length', unit: 'cm' },
        a: { name: 'calibration intercept', q: 'length', unit: 'cm', value: 9 },
        b: { name: 'distance lost per tenfold in size', q: 'length', unit: 'cm', value: 2.2 },
        bp: { name: 'fragment size (bp)', q: false, unit: 'bp', value: 1000, min: 20, max: 50000, tex: '\\mathrm{bp}' }
      },
      note: 'a and b are read from the ladder on that gel; the relation bends away from a straight line at the very top and very bottom of the range.',
      practice: { unknowns: ['d', 'bp'] },
      stories: {
        d: 'On a gel calibrated with a = {a} and b = {b}, how far does a {bp} fragment run?',
        bp: 'A band runs {d} on a gel calibrated with a = {a} and b = {b}. How big is the fragment?'
      }
    },
    {
      name: 'Field strength across the gel',
      expr: 'Efield = V/L', tex: 'E = \\dfrac{V}{L}',
      vars: {
        Efield: { name: 'electric field', q: 'efield', unit: 'V/cm', tex: 'E' },
        V: { name: 'voltage applied', q: 'voltage', unit: 'V', value: 100 },
        L: { name: 'distance between the electrodes', q: 'length', unit: 'cm', value: 20 }
      },
      note: 'A few volts per centimetre is usual. Higher fields are faster but heat the gel and smear the bands.',
      stories: { Efield: 'A tank with its electrodes {L} apart is run at {V}. What is the field along the gel?' }
    }
  ],
  examples: [
    {
      title: 'Sizing an unknown band',
      q: 'On a gel, a 10 000 bp ladder band ran 0.2 cm and a 100 bp band ran 4.6 cm. An unknown band ran 2.4 cm. How big is it?',
      steps: [
        'Two points give the line: between 100 and 10 000 bp is two decades, and the distance changed by $4.6 - 0.2 = 4.4$ cm, so $b = 2.2$ cm per decade.',
        'From the 100 bp point: $4.6 = a - 2.2\\log_{10}100 = a - 4.4$, so $a = 9.0$ cm.',
        'For the unknown: $2.4 = 9.0 - 2.2\\log_{10}(\\mathrm{bp})$, so $\\log_{10}(\\mathrm{bp}) = 6.6/2.2 = 3.0$.'
      ],
      a: '1000 bp.'
    },
    {
      title: 'Which gel to pour',
      q: 'You expect digest fragments of about 120, 300 and 700 bp. Would a 0.5 % or a 2 % agarose gel be the better choice?',
      steps: [
        'A 0.5 % gel has large pores and spreads out fragments of thousands of base pairs; everything below about 1000 bp would run together near the bottom.',
        'A 2 % gel resolves roughly 50–2000 bp, which brackets all three fragments.',
        'The price is time — a denser gel runs more slowly.'
      ],
      a: 'The 2 % gel: its pores match the size range you need to separate.'
    }
  ],
  quiz: [
    { q: 'In a gel, the fragment that travels furthest is…', choices: ['the largest', 'the smallest', 'the one with most GC', 'the most negatively charged'], a: 1, why: 'Charge per base is the same for all of them, so the gel sorts by size alone: the smallest threads through the pores most easily.' },
    { q: 'If 2000 bp and 4000 bp bands are 0.66 cm apart, roughly how far apart are 4000 bp and 8000 bp?', choices: ['0.33 cm', '0.66 cm', '1.3 cm', '2.6 cm'], a: 1, why: 'Migration falls with the logarithm of size, so equal ratios give equal spacings — each doubling costs the same distance.' },
    { q: 'A single uncut plasmid preparation shows three bands on a gel. The most likely explanation is…', choices: ['three different plasmids', 'supercoiled, nicked-circular and linear forms of one plasmid', 'incomplete PCR', 'contamination with RNA only'], a: 1, why: 'Shape changes how a circle moves through the pores: compact supercoiled DNA runs fastest, open circles slowest, linear in between — same size, three bands.' },
    { q: 'In free solution (no gel), DNA fragments of different sizes separate by size in an electric field.', a: false, why: 'Charge and drag both scale with length, so they cancel: all sizes move at nearly the same speed. The sieving gel is what makes separation possible.' },
    { q: 'A ladder is run alongside the samples in order to…', choices: ['keep the gel cool', 'provide known sizes to calibrate the lane', 'stop the DNA diffusing', 'mark where the wells were'], a: 1, why: 'The calibration constants a and b differ between gels and runs, so known sizes are needed on the same gel to convert distance to base pairs.' }
  ],
  problems: [
    { q: 'A gel is calibrated with a = 8.5 cm and b = 2.0 cm per decade. How far does a 500 bp fragment run?', answer: 3.1, unit: 'cm', tol: 0.03, steps: ['$\\log_{10}500 = 2.70$.', '$d = 8.5 - 2.0(2.70) = 8.5 - 5.40 = 3.1$ cm.'] },
    { q: 'On the same gel (a = 8.5 cm, b = 2.0 cm), a band runs 4.5 cm. What size is it?', answer: 100, unit: 'bp', tol: 0.05, steps: ['$4.5 = 8.5 - 2.0\\log_{10}(\\mathrm{bp})$, so $\\log_{10}(\\mathrm{bp}) = 4.0/2.0 = 2.0$ and the fragment is 100 bp.'] },
    { q: 'A tank has its electrodes 25 cm apart and is run at 125 V. What is the field along the gel?', answer: 5, unit: 'V/cm', tol: 0.02, steps: ['$E = 125/25 = 5$ V/cm.'] }
  ],
  applications: [
    'Run a digest on a virtual gel beside a ladder in [the digest tool](#/tools/sequence/digest).',
    'Checking that a PCR gave one product of the right size before it is sequenced or cloned.',
    'Confirming a construct by the pattern of fragment sizes from a diagnostic digest.',
    'DNA profiling and paternity testing, where the pattern of fragment sizes identifies an individual.',
    'Separating proteins by size after coating them with a detergent that gives a uniform charge-to-mass ratio.',
    'Checking that RNA is intact before it is used to measure gene expression.'
  ],
  history: 'Electrophoresis as a separation method goes back to Arne Tiselius in the 1930s, who separated blood proteins in free solution and won the 1948 Nobel Prize in Chemistry. Gels made it a sizing method: starch in the 1950s, then polyacrylamide, then agarose in the early 1970s, which was cheap, easy to pour and transparent — and turned reading a digest into a fifteen-minute routine.',
  sim: 'tech-digest'
},

{
  id: 'dna-sequencing', parent: 'dna-technology', title: 'DNA sequencing', level: 2,
  short: 'Reading the order of bases along a DNA molecule: first by making a nested set of fragments that differ by one base, now by watching millions of copies being copied at once. The cost has fallen by a factor of about a million in twenty years.',
  keywords: ['sequencing', 'Sanger', 'dideoxy', 'chain termination', 'next-generation sequencing', 'NGS', 'read length', 'coverage', 'Illumina', 'nanopore', 'long reads', 'assembly', 'Human Genome Project'],
  prereq: ['dna-replication', 'gel-electrophoresis', 'pcr'],
  related: ['genomics', 'bioinformatics', 'gene-expression-tools', 'molecular-clock', 'medicine:cancer-genetics'],
  body: `
### Sanger sequencing: one base at a time, by size
Frederick Sanger's method (1977) copies the DNA you want to read, but poisons the reaction slightly. Along with ordinary nucleotides it supplies a few **dideoxy** nucleotides, which can be added to a growing strand but have no attachment point for the next one — so the strand stops dead there. In a tube containing a trace of dideoxy-A, every copy stops at *some* A: a nested set of fragments, one for each A in the sequence, each ending at a known letter.

Run those fragments out by size to single-base resolution (see [[gel-electrophoresis]]), with each of the four dideoxy nucleotides carrying a different fluorescent colour, and the sequence is simply the order of the colours from the shortest fragment upwards. A good Sanger read is **500–1000 bases** long and extremely accurate, and for reading one plasmid or one PCR product it is still the everyday method.

Its limit is that it reads one molecule's worth of sequence at a time. The Human Genome Project (1990–2003) got 3.1 billion bases this way at a cost of the order of a few billion US dollars, with hundreds of machines running for years.

### Next-generation sequencing: millions of reads at once
The change that made genomics ordinary was doing the same chemistry in **parallel**. The dominant approach immobilises hundreds of millions of DNA fragments on a surface, amplifies each one into a small cluster of identical copies, and then copies all of them in step: one labelled base is added per cycle to every cluster, a camera photographs the whole surface, the label is removed, and the next cycle begins. Each cluster's colour sequence is one **read**.

| Method | Typical read | Accuracy per base | Notes |
|---|---|---|---|
| Sanger | 500–1000 b | very high | one read per reaction; still standard for single fragments |
| Short-read (cluster) | 100–300 b | about 99.9 % | hundreds of millions of reads per run; lowest cost per base |
| Single-molecule long read | 10–25 kb | about 99.9 % with repeated passes | spans repeats; resolves structural variation |
| Nanopore | 10 kb to over 1 Mb | about 99 %, improving | reads the molecule itself; portable devices exist |

Short reads are cheap and accurate but blind to anything longer than themselves: a repeat of 5000 identical bases cannot be assembled from 150-base reads. Long reads solve that at some cost in per-base accuracy, and the two are often combined. It was long reads that finally closed the remaining gaps of the human reference sequence in 2022, nineteen years after the "finished" genome was announced.

### Coverage: how many times must each base be read?
Reads are scattered more or less at random, so some places get many and some few. The mean **coverage** (or depth) is

$$C = \\frac{NL}{G}$$

for $N$ reads of length $L$ over a genome of size $G$. If reads fall at random, the number covering a given base follows a Poisson distribution, so the fraction of the genome missed altogether is about $e^{-C}$: at 5× coverage that is 0.7 % — tens of millions of human bases — and at 10× it is 0.005 %. Calling the two copies of a position in a diploid genome reliably, and telling a real variant from a sequencing error, needs more: around 30× is the usual standard for a human genome, and far deeper for detecting a rare tumour sequence in a blood sample.

### The cost curve
Approximate and rounded, the cost of sequencing one human genome to a usable depth has run roughly: of the order of a billion US dollars for the first (2003); about ten million (2007); about ten thousand (2011); around a thousand (mid-2010s); a few hundred (2020s). For about a decade it fell faster than the cost of computing, which is unusual enough that the comparison became a standard slide. The consequence is that the bottleneck moved: the expensive, slow, judgement-heavy part of a genome project is now the analysis and the interpretation, not the reading (see [[bioinformatics]]).

> [!key] Sanger reads one fragment beautifully; next-generation sequencing reads hundreds of millions adequately, and wins by sheer number. Coverage — reads × read length ÷ genome size — is what decides whether the answer can be trusted.
`,
  ideas: [
    'Sanger sequencing makes a nested set of fragments each ending at a known base, and reads the sequence off by size.',
    'Next-generation methods gain their power from parallelism: hundreds of millions of short reads at once.',
    'Read length is the key trade-off: short reads are cheap and accurate, long reads span repeats.',
    'Coverage C = NL/G; the fraction of a genome missed by random reads is about e^(−C).',
    'The cost of a human genome fell from the order of a billion US dollars to a few hundred in about twenty years.'
  ],
  pitfalls: [
    'A sequenced genome is read end to end like a book — Except for the longest-read methods, it is read in millions of short pieces that must be assembled or mapped; repeats are where assemblies break.',
    '30× coverage means every base was read 30 times — It is an average. Reads fall unevenly, so some regions get 60× and some none at all; GC-rich and repetitive regions are systematically under-covered.',
    'More coverage always means a better answer — Beyond the point where errors are resolved, extra depth mostly buys diminishing returns; a systematic bias is not cured by reading the same biased library more deeply.'
  ],
  formulas: [
    {
      name: 'Coverage (depth)',
      expr: 'C = N*L/G', tex: 'C = \\dfrac{N L}{G}',
      vars: {
        C: { name: 'mean coverage (×)', q: 'ratio' },
        N: { name: 'number of reads', q: 'count', value: 6e8 },
        L: { name: 'read length (bases)', q: false, unit: 'b', value: 150 },
        G: { name: 'genome size (bases)', q: false, unit: 'b', value: 3.1e9 }
      },
      note: 'The Lander–Waterman relation. It assumes reads fall independently and at random, which real libraries only approximate.',
      practice: { unknowns: ['C', 'N'] },
      stories: {
        C: 'A run gives {N} reads of {L} on a genome of {G}. What is the mean coverage?',
        N: 'How many reads of {L} are needed for {C} coverage of a {G} genome?'
      }
    },
    {
      name: 'Fraction of the genome not covered',
      expr: 'f = exp(-C)', tex: 'f = e^{-C}',
      vars: {
        f: { name: 'fraction of bases with no read', q: 'ratio', unit: '%' },
        C: { name: 'mean coverage (×)', q: 'ratio', value: 5, min: 0.1, max: 60 }
      },
      note: 'From the Poisson distribution of randomly placed reads: the chance of zero reads at a given base.',
      stories: { f: 'Reads fall at random to a mean depth of {C}. What fraction of the genome gets no read at all?' }
    }
  ],
  examples: [
    {
      title: 'How much sequencing does a human genome need?',
      q: 'How many 150-base reads are needed for 30× coverage of a 3.1 Gb human genome, and how many bases is that in total?',
      steps: [
        '$N = CG/L = 30 \\times 3.1\\times10^9/150$.',
        '$= 9.3\\times10^{10}/150 = 6.2\\times10^{8}$ reads — about 620 million.',
        'Total bases read: $30 \\times 3.1\\times10^9 = 9.3\\times10^{10}$, that is 93 gigabases for one person.'
      ],
      a: 'About 620 million reads, some 93 Gb of sequence.'
    },
    {
      title: 'What 5× coverage misses',
      q: 'A bacterial genome of 4.6 Mb is sequenced at 5× mean coverage. About how many bases get no read at all?',
      steps: [
        'Fraction missed $\\approx e^{-5} = 0.0067$.',
        '$0.0067 \\times 4.6\\times10^6 = 3.1\\times10^{4}$ bases — about 31 000.',
        'They are not in one block: they are scattered as many small gaps, which is why low-coverage assemblies are fragmented.'
      ],
      a: 'About 31 000 bases, scattered in many small gaps.'
    }
  ],
  quiz: [
    { q: 'In Sanger sequencing, a dideoxy nucleotide stops the growing strand because…', choices: ['it cannot pair with the template', 'it has no attachment point for the next nucleotide', 'it repels the polymerase', 'it is fluorescent'], a: 1, why: 'The missing 3′ hydroxyl means the next nucleotide cannot be joined on, so every strand that takes one up terminates there.' },
    { q: 'The main advantage of next-generation over Sanger sequencing is…', choices: ['longer reads', 'higher accuracy per base', 'hundreds of millions of reads in parallel', 'it needs no polymerase'], a: 2, why: 'Its reads are shorter and no more accurate per base; the win is the sheer number of reads done at the same time, which collapses the cost per base.' },
    { q: 'How many reads of 100 bases give 20× coverage of a 5 Mb genome?', answer: 1e6, tol: 0.05, why: 'N = CG/L = 20 × 5×10⁶ / 100 = 1×10⁶ reads.' },
    { q: 'A region of a genome made of a 6000 bp repeat can be assembled unambiguously from 150-base reads.', a: false, why: 'A read shorter than the repeat cannot say which copy it came from, so the assembly collapses or breaks there. Long reads, which span the whole repeat, are what resolve it.' },
    { q: 'Doubling the coverage from 5× to 10× changes the fraction of bases with no read from about…', choices: ['0.7 % to 0.005 %', '0.7 % to 0.35 %', '7 % to 3.5 %', '0.7 % to 0.07 %'], a: 0, why: 'e⁻⁵ = 0.0067 and e⁻¹⁰ = 0.000045: the gaps shrink exponentially, not in proportion.' }
  ],
  problems: [
    { q: 'A run produces 400 million reads of 150 bases. What coverage does that give on a 3.1 Gb genome?', answer: 19.4, tol: 0.03, steps: ['Total bases: $4\\times10^8 \\times 150 = 6.0\\times10^{10}$.', '$C = 6.0\\times10^{10}/3.1\\times10^{9} = 19.4$.'] },
    { q: 'At 3× mean coverage, what fraction of a genome is expected to get no read?', answer: 4.98, unit: '%', tol: 0.03, steps: ['$e^{-3} = 0.0498 = 5.0$ %.'] }
  ],
  applications: [
    'Diagnosing rare genetic conditions by sequencing the coding regions of a person\'s genome.',
    'Identifying the genetic changes in a tumour to guide treatment choice.',
    'Tracking outbreaks: sequencing pathogen samples shows who infected whom and how the pathogen is changing.',
    'Reading the DNA of whole microbial communities — soil, gut, ocean — without culturing anything.',
    'Ancient DNA: sequencing degraded fragments from bones tens of thousands of years old.'
  ],
  history: 'Frederick Sanger won two Nobel Prizes: one for protein sequencing (1958) and one, shared with Walter Gilbert and Paul Berg, for DNA sequencing (1980). The first genome sequenced was a small bacteriophage in 1977; the first free-living organism, a bacterium, in 1995; a draft human genome was announced in 2000 by the public consortium and Celera together, published in 2001, and declared essentially complete in 2003 — with the last few per cent of repeats and centromeres finished only in 2022 by long-read methods.',
  sim: 'tech-assembly'
},

{
  id: 'crispr', parent: 'dna-technology', title: 'CRISPR genome editing', level: 3,
  short: 'A bacterial defence system, repurposed: a short RNA guide leads a cutting enzyme to one matching sequence in a genome, and the cell\'s own repair machinery turns that cut into an edit.',
  keywords: ['CRISPR', 'Cas9', 'guide RNA', 'PAM', 'protospacer', 'double-strand break', 'non-homologous end joining', 'homology-directed repair', 'base editing', 'prime editing', 'off-target', 'genome editing'],
  prereq: ['dna-replication', 'mutations', 'restriction-cloning'],
  related: ['gene-therapy', 'biosafety-bioethics', 'gmos', 'noncoding-rna', 'bioinformatics', 'medicine:cancer-treatment'],
  body: `
Bacteria are attacked by viruses constantly, and some of them keep a record of it. Between short repeated sequences in their genomes — **C**lustered **R**egularly **I**nterspaced **S**hort **P**alindromic **R**epeats — sit **spacers**: fragments of DNA captured from past infections. The bacterium transcribes those spacers into short RNAs, each of which guides a Cas nuclease to any incoming DNA that matches, and the nuclease cuts it. It is an adaptive immune system with a memory written in DNA.

### What makes it programmable
Cas9, from *Streptococcus pyogenes*, is the best-known of these enzymes. It carries a **guide RNA** whose first ~20 bases are the search string. Cas9 scans the genome, and wherever the guide's 20 bases pair with a DNA strand it cuts both strands, leaving a clean double-strand break.

The crucial detail — the reason Cas9 does not destroy the bacterium's own CRISPR array — is the **PAM**, the protospacer adjacent motif. Cas9 only cuts if the matching DNA is immediately followed by the three bases **NGG** (any base, then two Gs). No PAM, no cut, however good the match. The bacterium's own stored spacers have no PAM next to them, so they are safe; an invading virus's sequence does have one.

Two consequences follow. First, targets are easy to find: by chance, NGG occurs roughly once every eight base pairs counting both strands, so almost any region has usable sites. Second, the PAM constrains you — an edit must be made near one, which matters when a particular single base is the target. Other Cas enzymes with different PAMs widen the choice.

The cut falls about 3 bp inside the protospacer from the PAM, so the break position is predictable to the base.

### The edit is made by the cell, not by the enzyme
Cas9 only cuts. What happens next is the cell's own repair (see [[mutations]]), and this is where the outcome is decided.

- **Non-homologous end joining** simply sticks the ends back together and often loses or gains a few bases. Inside a coding sequence a small insertion or deletion usually shifts the reading frame and destroys the protein. This is the easy, efficient way to **switch a gene off**.
- **Homology-directed repair** copies from a supplied template that carries the desired sequence, writing a chosen change into the genome. It is far less efficient and works mainly in dividing cells, which is why precise correction is much harder than knock-out.

Newer tools avoid cutting both strands at all. **Base editors** dock a chemical-modifying enzyme onto a disabled Cas9, converting one base pair into another directly — C·G to T·A, or A·T to G·C — without a double-strand break. **Prime editors** carry a reverse transcriptase and an extended guide that also contains the new sequence to be written in. Both trade breadth for precision and reduce the indel mess.

### Off-target effects and how they are managed
A 20-base guide is long enough to be unique in a 3.1-billion-base genome by chance — but Cas9 tolerates mismatches, especially far from the PAM, so a guide can cut at sites differing by two or three bases. Off-target editing is therefore a real risk rather than a theoretical one, and it is handled by choosing guides computationally against the whole genome, by using higher-fidelity Cas9 variants, by delivering the protein so it is present only briefly, and by sequencing afterwards to look for unintended changes. Large unintended rearrangements around the cut site have also been reported and are part of why editing is assessed carefully before use in people.

### In medicine
In 2023 regulators in the United Kingdom and then the United States approved the first CRISPR-based therapy, for sickle cell disease and transfusion-dependent beta thalassaemia. In outline: a person's own blood stem cells are removed, edited outside the body to switch on the fetal haemoglobin that is normally silenced after birth, and returned. Editing cells outside the body sidesteps the hardest problem in the field — getting an editor into the right cells inside a living person — and the changes affect only that person's blood cells, not their children (see [[gene-therapy]] and, for the germline debate, [[biosafety-bioethics]]).

> [!key] CRISPR's guide RNA makes targeting a matter of typing 20 letters instead of engineering a new protein. That is the whole revolution — and the reason the ethical questions arrived faster than the answers.
`,
  ideas: [
    'CRISPR is a bacterial adaptive immune system: stored fragments of past invaders guide a nuclease to matching DNA.',
    'A 20-base guide RNA programs Cas9; a PAM (NGG for Cas9) must sit next to the match or there is no cut.',
    'The cut is blunt and falls about 3 bp from the PAM inside the target.',
    'The cell makes the edit: end joining knocks a gene out; homology-directed repair with a template writes a chosen change, far less efficiently.',
    'Base and prime editors change sequence without a double-strand break, trading range for precision.',
    'Off-target cutting at similar sequences is the central safety concern, and is why guides are checked genome-wide.'
  ],
  pitfalls: [
    'CRISPR rewrites a gene to whatever you want — On its own it only cuts. Precise rewriting needs homology-directed repair, base editing or prime editing, and is much less efficient than simply disrupting a gene.',
    'Editing a patient\'s cells changes their children\'s genes — Editing body cells (somatic) affects only that person. Only editing embryos or germ cells makes heritable changes, which is a separate and far more restricted question.',
    'A 20-base guide is unique, so there are no off-target cuts — Cas9 tolerates mismatches, particularly at the end away from the PAM, so near-matches elsewhere in the genome can be cut.'
  ],
  formulas: [
    {
      name: 'Expected number of PAM sites',
      expr: 'n = 2*L*pG^2', tex: 'n = 2 L\\, p_G^{2}',
      vars: {
        n: { name: 'expected NGG sites (both strands)', q: 'count' },
        L: { name: 'length of the region (bp)', q: false, unit: 'bp', value: 1000 },
        pG: { name: 'frequency of G', q: 'ratio', value: 0.25, min: 0.05, max: 0.45, tex: 'p_G' }
      },
      note: 'NGG needs two Gs in a row at fixed positions; the factor 2 counts both strands. At equal base frequencies this is one site every 8 bp.',
      stories: { n: 'How many NGG sites would you expect in {L} of DNA whose G frequency is {pG}?' }
    },
    {
      name: 'Expected exact matches of a guide in a genome',
      expr: 'm = 2*G/4^k', tex: 'm = \\dfrac{2G}{4^{k}}',
      vars: {
        m: { name: 'expected exact matches', q: 'count' },
        G: { name: 'genome size (bp)', q: false, unit: 'bp', value: 3.1e9 },
        k: { name: 'length of the guide (bases)', q: 'count', value: 20, int: true, min: 8, max: 30 }
      },
      note: 'Why 20 bases: at 17 bases a human genome is expected to contain a match by chance, at 20 it is not. Near-matches are far more common, which is the real off-target problem.',
      stories: {
        m: 'How many exact matches of a {k}-base guide are expected by chance in a genome of {G}?',
        k: 'How long must a guide be so that only {m} exact matches are expected in a {G} genome?'
      }
    }
  ],
  examples: [
    {
      title: 'Is 20 bases long enough?',
      q: 'Compare the expected number of chance matches of a 17-base and a 20-base guide in the 3.1 Gb human genome.',
      steps: [
        '17 bases: $4^{17} = 1.7\\times10^{10}$, so $m = 2(3.1\\times10^9)/1.7\\times10^{10} = 0.36$.',
        '20 bases: $4^{20} = 1.1\\times10^{12}$, so $m = 6.2\\times10^9/1.1\\times10^{12} = 0.0056$.',
        'A 17-base guide is on the edge of having a second exact match somewhere; 20 bases gives a margin of about 60 times.'
      ],
      a: '0.36 expected matches at 17 bases, 0.006 at 20 — but mismatched near-matches remain, and they are what off-target screening looks for.'
    },
    {
      title: 'Finding a target near a chosen base',
      q: 'You want to cut within 10 bp of a particular base in a gene whose G frequency is 0.25. Roughly how many PAM sites are in that 20 bp window?',
      steps: [
        '$n = 2 \\times 20 \\times 0.25^2 = 40 \\times 0.0625 = 2.5$.',
        'So on average about two or three usable PAMs — usually enough, but not guaranteed for any particular base.',
        'If none is close enough, a Cas enzyme with a different PAM, or a prime editor, widens the options.'
      ],
      a: 'About 2–3 expected PAM sites; sometimes none, which is a genuine practical constraint.'
    }
  ],
  quiz: [
    { q: 'The PAM is needed because…', choices: ['it is the part the guide RNA pairs with', 'Cas9 will not cut unless it is present next to the match', 'it marks where the repair template binds', 'it protects the guide RNA from degradation'], a: 1, why: 'Cas9 checks for the PAM first and cuts only if it is there. In bacteria this is how the system avoids cutting its own stored spacers, which have no PAM.' },
    { q: 'To switch a gene off, the easiest repair pathway to exploit is…', choices: ['homology-directed repair with a template', 'non-homologous end joining', 'mismatch repair', 'base excision repair'], a: 1, why: 'End joining frequently inserts or deletes a few bases, shifting the reading frame and destroying the protein — efficient, and no template needed.' },
    { q: 'Roughly how often does an NGG PAM occur, counting both strands of DNA with equal base frequencies?', choices: ['every 4 bp', 'every 8 bp', 'every 16 bp', 'every 64 bp'], a: 1, why: 'Two specified bases give a probability of 1/16 per position, doubled for two strands: one site every 8 bp on average.' },
    { q: 'Base editors make their change without cutting both strands of the DNA.', a: true, why: 'They use a disabled Cas9 to position a chemical-modifying enzyme, converting one base pair to another directly — avoiding the insertions and deletions that follow a double-strand break.' },
    { q: 'The 2023-approved CRISPR therapy for sickle cell disease works by…', choices: ['editing embryos so children are unaffected', 'editing a person\'s own blood stem cells outside the body and returning them', 'injecting Cas9 into the bloodstream to edit every cell', 'replacing the haemoglobin gene with a synthetic one in the germline'], a: 1, why: 'The cells are edited outside the body to switch fetal haemoglobin back on, then given back. It is a somatic change: it affects that person only, not their descendants.' }
  ],
  problems: [
    { q: 'How many exact matches of a 16-base guide are expected by chance in a 3.1 Gb genome (both strands)?', answer: 1.44, tol: 0.05, steps: ['$4^{16} = 4.29\\times10^{9}$.', '$m = 2(3.1\\times10^9)/4.29\\times10^{9} = 1.44$ — on average more than one, so 16 bases is too short.'] },
    { q: 'How many NGG sites are expected in a 4600 bp gene whose G frequency is 0.30?', answer: 828, tol: 0.03, steps: ['$n = 2 \\times 4600 \\times 0.30^2 = 9200 \\times 0.09 = 828$.'] }
  ],
  applications: [
    'Making knock-out cell lines and model organisms in weeks instead of years, which changed how gene function is studied.',
    'Therapies for blood disorders in which a person\'s own stem cells are edited outside the body.',
    'Editing crops for disease resistance or storage quality (see [[gmos]]), often without inserting DNA from another species.',
    'Engineering immune cells to recognise cancer.',
    'Gene drives — spreading an edit through a wild population — proposed against malaria mosquitoes and studied under strict containment because they are designed to spread.'
  ],
  history: 'The repeats were noticed in a bacterial genome in 1987 and their meaning guessed in 2005, when three groups independently saw that the spacers matched viruses. In 2012 Jennifer Doudna and Emmanuelle Charpentier showed that Cas9 could be programmed with a single engineered guide RNA to cut any chosen DNA; editing in human cells followed within months, and the two shared the 2020 Nobel Prize in Chemistry. The speed from curiosity about odd repeats in bacteria to an approved medicine — about eleven years from the 2012 paper — is almost without precedent.',
  sim: 'tech-crispr'
},

{
  id: 'gene-expression-tools', parent: 'dna-technology', title: 'Measuring gene expression', level: 2,
  short: 'Which genes is a cell using, and how hard? Count the messenger RNA — by amplifying one transcript and timing it (qPCR), or by sequencing all of them at once (RNA-seq).',
  keywords: ['gene expression', 'qPCR', 'RT-qPCR', 'delta delta Ct', 'reference gene', 'RNA-seq', 'transcriptome', 'RPKM', 'TPM', 'microarray', 'reporter gene', 'GFP', 'single-cell'],
  prereq: ['transcription', 'pcr', 'dna-sequencing'],
  related: ['eukaryotic-regulation', 'epigenetics', 'bioinformatics', 'statistics-bio', 'medicine:cancer-genetics'],
  body: `
Every cell in your body carries the same genome; what makes a neuron different from a liver cell is which genes it transcribes, and how much. Measuring that means counting messenger RNA molecules — and since all the methods actually measure something proportional to a count, the whole subject turns on what you compare against.

### Reverse transcription and qPCR
RNA cannot be copied by a DNA polymerase, so it is first turned into **complementary DNA** by reverse transcriptase, the enzyme retroviruses use. The cDNA is then amplified by real-time [[pcr|PCR]], and the useful number is $C_t$, the cycle at which signal rises above background: a sample with more of that transcript crosses earlier.

Raw $C_t$ values cannot be compared directly — wells differ in how much RNA went in and how well the reverse transcription worked. The standard fix is a double comparison, **ΔΔCt**:

1. Subtract the $C_t$ of a **reference gene** in the same well, one whose expression is assumed steady. This is $\\Delta C_t$ and it cancels loading differences.
2. Subtract the $\\Delta C_t$ of the control sample. This is $\\Delta\\Delta C_t$.
3. The fold change is $2^{-\\Delta\\Delta C_t}$ — because one cycle is one doubling.

The weak point is step 1. "Housekeeping" genes are not as constant as their name suggests; a treatment that changes cell growth changes them too, and then every result is scaled by a moving ruler. Good practice is to validate several reference genes under the actual conditions, and to use the measured amplification efficiency rather than assuming perfect doubling.

### RNA-seq: count everything
Sequencing the cDNA instead of amplifying one target gives, in one experiment, a number of reads for every gene at once. Those counts need two normalisations before genes or samples can be compared:

- **Sequencing depth.** A sample sequenced twice as deeply gives twice the reads for everything. Dividing by the total number of reads (per million) fixes this.
- **Gene length.** A 6 kb transcript yields more fragments than a 1 kb transcript at the same molar concentration, so read counts are divided by length in kilobases too.

Together these give **RPKM** (reads per kilobase per million) and its better-behaved relative **TPM** (transcripts per million), which normalises for length first and depth second, so that the values in every sample sum to the same total and can be compared across samples.

> [!note] For *differential expression* — is this gene higher in treated than control? — specialised statistical methods work from the raw counts with their own normalisation, because count data are noisy in a particular way and because thousands of genes are tested at once. Testing 20 000 genes at the 5 % level would give about 1000 false positives by chance alone, so p-values are corrected for multiple testing (see [[statistics-bio]]).

### The other tools
- **Microarrays**, the workhorse of the 2000s, measure hybridisation of labelled cDNA to a grid of probes. Cheaper than sequencing at the time, but limited to sequences already known and to a narrower range of signal.
- **Reporter genes** fuse a gene's control region to something visible — green fluorescent protein, or an enzyme that makes a colour — so expression can be watched in a living cell or a whole organism over time. Less quantitative, far more informative about *where* and *when*.
- **Single-cell RNA-seq** measures thousands of individual cells separately, revealing that an "average" from a tissue was often a mixture of very different cell types. It is noisy per cell — only a fraction of each cell's transcripts is captured — but it finds cell types nobody knew were there.
- **Protein-level methods** matter because mRNA is only a proxy. Correlation between mRNA and protein amounts across genes is often moderate (commonly reported around 0.4–0.6 in mammalian cells), since translation rates and protein lifetimes vary widely.

> [!key] Every expression measurement is a ratio against something: a reference gene, a control sample, the total reads. Choose the comparison badly and the number is meaningless, however precise it looks.
`,
  ideas: [
    'RNA is measured by first copying it into cDNA with reverse transcriptase.',
    'qPCR compares cycle thresholds: ΔΔCt corrects for loading with a reference gene and for the control sample, and the fold change is 2^(−ΔΔCt).',
    'RNA-seq counts reads for every gene at once; counts must be normalised for sequencing depth and for transcript length (RPKM, TPM).',
    'Reference genes are assumed steady but often are not — the main hidden error in qPCR.',
    'mRNA amount is only a proxy for protein amount; the two correlate imperfectly.'
  ],
  pitfalls: [
    'A lower Ct means less of the transcript — It means more: with more starting material the signal crosses the threshold earlier, so Ct falls as the amount rises.',
    'RPKM values can be compared straight between samples — Length-then-depth normalisation (TPM) is what makes totals equal across samples; RPKM totals differ, so comparisons between samples can be skewed by a few very high genes.',
    'A two-fold change in mRNA means a two-fold change in protein — Translation rate and protein lifetime intervene; measuring the protein is a different experiment.'
  ],
  formulas: [
    {
      name: 'The ΔΔCt comparison',
      expr: 'ddCt = (CT1 - CR1) - (CT2 - CR2)', tex: '\\mathrm{\\Delta\\Delta C_t} = (C_{T1} - C_{R1}) - (C_{T2} - C_{R2})',
      vars: {
        ddCt: { name: 'ΔΔCt (cycles)', q: 'count', signed: true, tex: '\\mathrm{\\Delta\\Delta C_t}' },
        CT1: { name: 'target gene, treated sample (cycles)', q: 'count', value: 22, tex: 'C_{T1}' },
        CR1: { name: 'reference gene, treated sample (cycles)', q: 'count', value: 18, tex: 'C_{R1}' },
        CT2: { name: 'target gene, control sample (cycles)', q: 'count', value: 25, tex: 'C_{T2}' },
        CR2: { name: 'reference gene, control sample (cycles)', q: 'count', value: 18, tex: 'C_{R2}' }
      },
      note: 'A negative ΔΔCt means the target crossed the threshold earlier in the treated sample: it went up.',
      stories: { ddCt: 'The target reads {CT1} and the reference {CR1} in the treated sample; {CT2} and {CR2} in the control. What is ΔΔCt?' }
    },
    {
      name: 'Fold change from ΔΔCt',
      expr: 'F = 2^(-ddCt)', tex: 'F = 2^{-\\mathrm{\\Delta\\Delta C_t}}',
      vars: {
        F: { name: 'fold change', q: 'ratio' },
        ddCt: { name: 'ΔΔCt (cycles)', q: 'count', value: -3, signed: true, min: -12, max: 12, tex: '\\mathrm{\\Delta\\Delta C_t}' }
      },
      note: 'Assumes 100 % efficiency for both assays; with a measured efficiency E the base 2 is replaced by (1 + E).',
      stories: { F: 'An experiment gives ΔΔCt = {ddCt}. By what factor did the gene change?' }
    },
    {
      name: 'Normalised read count (RPKM)',
      expr: 'RPKM = r*10^9/(T*L)', tex: '\\mathrm{RPKM} = \\dfrac{10^{9}\\,r}{T L}',
      vars: {
        RPKM: { name: 'reads per kilobase per million', q: 'ratio', tex: '\\mathrm{RPKM}' },
        r: { name: 'reads mapped to the gene', q: 'count', value: 12000 },
        T: { name: 'total mapped reads in the sample', q: 'count', value: 3e7 },
        L: { name: 'transcript length (bases)', q: false, unit: 'b', value: 2000 }
      },
      note: 'The 10⁹ converts "per base per read" into "per kilobase per million reads".',
      practice: { unknowns: ['RPKM', 'r'] },
      stories: { RPKM: 'A gene of {L} collects {r} of the {T} mapped reads in a sample. What is its RPKM?' }
    }
  ],
  examples: [
    {
      title: 'A ΔΔCt calculation',
      q: 'Treated sample: target Ct 22.0, reference Ct 18.0. Control sample: target Ct 25.0, reference Ct 18.0. How much did the gene change?',
      steps: [
        'Treated: $\\Delta C_t = 22.0 - 18.0 = 4.0$. Control: $\\Delta C_t = 25.0 - 18.0 = 7.0$.',
        '$\\Delta\\Delta C_t = 4.0 - 7.0 = -3.0$.',
        'Fold change $= 2^{3.0} = 8$.'
      ],
      a: 'An eight-fold increase in the treated sample.'
    },
    {
      title: 'Why length normalisation is needed',
      q: 'Two genes are present at the same number of transcripts per cell, but one is 1 kb long and the other 6 kb. What do the raw read counts look like, and what does RPKM give?',
      steps: [
        'Sequencing fragments the transcripts, so the number of fragments from a gene is proportional to concentration times length: the 6 kb gene gives about six times as many reads.',
        'Dividing each by its length in kilobases removes that factor.',
        'RPKM (and TPM) therefore report the two genes as equally expressed, which is what "same number of transcripts" should mean.'
      ],
      a: 'Raw counts differ six-fold; after dividing by length they agree.'
    }
  ],
  quiz: [
    { q: 'In an RT-qPCR experiment, ΔΔCt = −2.0. The gene has…', choices: ['gone down four-fold', 'gone up four-fold', 'gone down two-fold', 'not changed'], a: 1, why: 'Fold change is 2^(−ΔΔCt) = 2² = 4. A negative ΔΔCt means the target was detected earlier, so there was more of it.' },
    { q: 'The purpose of the reference gene in qPCR is to…', choices: ['set the threshold', 'correct for differences in how much RNA went into each well', 'measure the efficiency', 'detect contamination'], a: 1, why: 'Subtracting a co-measured steady gene cancels differences in input amount and reverse-transcription yield — which is also why a reference gene that is not actually steady corrupts every result.' },
    { q: 'Read counts in RNA-seq are divided by transcript length because…', choices: ['long transcripts are harder to sequence', 'a long transcript yields more fragments at the same concentration', 'short genes are expressed more', 'the polymerase is slower on long genes'], a: 1, why: 'Sequencing samples fragments, so a transcript twice as long contributes about twice as many of them at the same molar concentration.' },
    { q: 'Testing 20 000 genes for differential expression at p < 0.05 without correction would be expected to give about 1000 false positives.', a: true, why: '5 % of 20 000 = 1000 by chance alone, which is why multiple-testing correction is standard in RNA-seq analysis.' },
    { q: 'Single-cell RNA-seq is most valuable when…', choices: ['very precise numbers per gene are needed', 'a tissue is a mixture of different cell types', 'only one gene is of interest', 'the RNA is degraded'], a: 1, why: 'A bulk measurement averages over cell types and can hide or invent patterns. Per-cell measurements are noisy but reveal the composition of the tissue.' }
  ],
  problems: [
    { q: 'Treated: target Ct 20.5, reference 17.5. Control: target 23.0, reference 18.0. What is the fold change?', answer: 4, tol: 0.03, steps: ['Treated ΔCt = 3.0; control ΔCt = 5.0.', 'ΔΔCt = 3.0 − 5.0 = −2.0.', 'Fold change = 2² = 4.'] },
    { q: 'A 3 kb transcript collects 9000 of 20 million mapped reads. What is its RPKM?', answer: 150, tol: 0.03, steps: ['$\\mathrm{RPKM} = 10^9 \\times 9000/(2\\times10^7 \\times 3000) = 9\\times10^{12}/6\\times10^{10} = 150$.'] }
  ],
  applications: [
    'Classifying tumours by their expression pattern, which can guide treatment and predict recurrence.',
    'Finding which genes a drug, a hormone or a stress actually changes in a cell.',
    'Building cell atlases: cataloguing the cell types of a tissue or a whole organism by single-cell expression.',
    'Quality control in biotechnology — checking that an engineered cell line is expressing what it should.',
    'Studying development by following which genes switch on as a cell differentiates.'
  ],
  history: 'Northern blotting (1977) measured one RNA at a time on a membrane; RT-PCR made it sensitive; microarrays in the mid-1990s made it genome-wide; RNA-seq replaced them from about 2008, and single-cell methods became routine in the late 2010s. The green fluorescent protein that makes reporters visible came from a jellyfish, and earned Osamu Shimomura, Martin Chalfie and Roger Tsien the 2008 Nobel Prize in Chemistry.',
  sim: 'tech-pcr'
},

{
  id: 'genomics', parent: 'genomics-topic', title: 'Genomes and genomics', level: 2,
  short: 'A genome is the whole DNA sequence of an organism. Comparing genomes — their sizes, their gene counts, how much of them does anything — has overturned a surprising number of expectations, starting with how many genes a human has.',
  keywords: ['genome', 'genomics', 'gene count', 'C-value paradox', 'gene density', 'repeats', 'transposable elements', 'comparative genomics', 'metagenomics', 'GWAS', 'human variation', 'pan-genome'],
  prereq: ['dna-sequencing', 'genetic-code', 'dna-structure'],
  related: ['bioinformatics', 'human-genetics', 'molecular-clock', 'gene-therapy', 'microbiome', 'medicine:cancer-genetics'],
  body: `
### How big, and how many genes?

| Organism | Genome | Protein-coding genes |
|---|---|---|
| *Escherichia coli* (bacterium) | 4.6 Mb | about 4 400 |
| *Saccharomyces cerevisiae* (yeast) | 12 Mb | about 6 000 |
| *Drosophila melanogaster* (fruit fly) | 140 Mb | about 14 000 |
| *Arabidopsis thaliana* (a small weed) | 135 Mb | about 27 000 |
| *Homo sapiens* | 3.1 Gb | about 20 000 |
| *Paris japonica* (a plant) | about 150 Gb | unknown |

Two things jump out. The first is that a human has about 20 000 protein-coding genes — roughly as many as a weed, and fewer than many plants. Before the sequence arrived, estimates ran to 100 000; the sweepstake run among genome scientists in 2000 was won by the lowest guess, and even that was too high. Complexity is not bought with more genes but with more ways of using them: alternative splicing, regulatory regions, non-coding RNAs, and combinations of the same proteins in different tissues (see [[eukaryotic-regulation]]).

The second is that genome size has almost nothing to do with organism complexity — the old **C-value paradox**. A lungfish or a lily can carry ten times a human's DNA. The explanation is that most of a large genome is not genes at all.

### What is in a genome
Bacteria are economical: around 85–90 % of *E. coli*'s genome codes for protein, so gene density is about 1000 genes per megabase. A human genome is the opposite. Protein-coding exons are about 1–2 % of it. Something like half of it is derived from **transposable elements** — sequences that copy themselves about — and much of the rest is regulatory regions, introns, structural DNA and the accumulated debris of ancient duplications.

How much of the rest *does* something is genuinely contested. A large project reported in 2012 that most of the genome shows some biochemical activity; critics replied that being transcribed occasionally is not the same as having a function that selection maintains. Comparing species is the sharper test: roughly 8–10 % of the human genome looks constrained by selection, which is far more than the coding fraction and far less than "most".

### Comparing genomes
Sequencing many genomes turns biology into a comparative science.

- **Between species**, shared sequence marks shared ancestry, and what differs points at what changed. Human and chimpanzee genomes differ by about 1.2 % in aligned single bases, with more difference again in insertions, deletions and duplications.
- **Within a species**, two human genomes differ at roughly one base in a thousand — some 4–5 million differences per person against the reference, most of them single-base variants shared with many other people. Genome-wide association studies test millions of these variants against a trait in tens or hundreds of thousands of people; for common conditions they typically find many variants of individually tiny effect, not one gene "for" the trait.
- **For bacteria**, the idea of "the" genome of a species breaks down: strains of *E. coli* share a **core genome** of a few thousand genes while the **pan-genome** of all strains runs to tens of thousands, shuffled by horizontal transfer.
- **Metagenomics** sequences whole communities — a spoonful of soil, a gut, a litre of seawater — without culturing anything, which is how most microbial diversity was found at all (see [[microbiome]]).

> [!fact] Human genetic variation is mostly variation *within* populations: the great majority of it is found inside any one population, and only a small fraction distinguishes populations from one another. Human groups are not discrete biological categories, and the folk categories called "races" do not correspond to genetic divisions. Ancestry is real, gradual and geographically continuous; it is not a set of boxes.

> [!key] Genes are a small and shrinking part of the story a genome tells. Gene count says little about complexity, genome size says little about anything, and the interesting differences are usually in regulation.
`,
  ideas: [
    'A human genome is 3.1 Gb with about 20 000 protein-coding genes — a similar number to a small weed.',
    'Genome size does not track complexity (the C-value paradox): large genomes are mostly non-coding.',
    'Bacterial genomes are dense (about 1000 genes per Mb); coding exons are only 1–2 % of a human genome.',
    'Roughly 8–10 % of the human genome looks under selective constraint — more than the coding part, far less than all of it.',
    'Human genetic variation is overwhelmingly within populations rather than between them.'
  ],
  pitfalls: [
    'More complex organisms have more genes — Humans have about 20 000, similar to many plants and fewer than some. Regulation, splicing and combinations do the work.',
    'The genome was "finished" in 2003 — That draft left hundreds of gaps in repeats and centromeres; the first truly end-to-end human sequence came in 2022, using long reads.',
    'Non-coding DNA is junk — Some is, some is regulatory, and some is structural. The honest position is that the functional fraction is known only approximately, and is bigger than the coding part.'
  ],
  formulas: [
    {
      name: 'Gene density',
      expr: 'rho = g/G', tex: '\\rho = \\dfrac{g}{G}',
      vars: {
        rho: { name: 'genes per megabase', q: 'ratio', tex: '\\rho' },
        g: { name: 'number of protein-coding genes', q: 'count', value: 4400 },
        G: { name: 'genome size (Mb)', q: false, unit: 'Mb', value: 4.6 }
      },
      note: 'About 950 genes per Mb in E. coli; about 6.5 per Mb in a human genome — a 150-fold difference.',
      stories: { rho: 'A genome of {G} carries {g} protein-coding genes. What is its gene density?' }
    },
    {
      name: 'Fraction of a genome that codes for protein',
      expr: 'f = g*Lc/G', tex: 'f = \\dfrac{g\\,L_c}{G}',
      vars: {
        f: { name: 'coding fraction', q: 'ratio', unit: '%' },
        g: { name: 'number of protein-coding genes', q: 'count', value: 20000 },
        Lc: { name: 'mean coding length (bp)', q: false, unit: 'bp', value: 1300, tex: 'L_c' },
        G: { name: 'genome size (bp)', q: false, unit: 'bp', value: 3.1e9 }
      },
      note: 'Coding sequence only — introns and regulatory regions are not counted, which is why the answer for a human genome is around 1 %.',
      stories: { f: 'A genome of {G} has {g} genes whose coding parts average {Lc}. What fraction of it codes for protein?' }
    },
    {
      name: 'Expected differences between two genomes',
      expr: 'D = G*h', tex: 'D = G h',
      vars: {
        D: { name: 'expected differing bases', q: 'count' },
        G: { name: 'genome size (bp)', q: false, unit: 'bp', value: 3.1e9 },
        h: { name: 'difference per base', q: 'ratio', value: 0.001, min: 1e-5, max: 0.1 }
      },
      note: 'About one base in a thousand between two human genomes — and a few times higher between two chimpanzees, whose populations kept more ancestral variation than ours.',
      stories: { D: 'Two genomes of {G} differ at a rate of {h}. How many bases differ?' }
    }
  ],
  examples: [
    {
      title: 'Gene density, bacterium against human',
      q: 'Compare the gene density of E. coli (4400 genes in 4.6 Mb) with that of a human (20 000 genes in 3100 Mb).',
      steps: [
        'E. coli: $4400/4.6 = 956$ genes per Mb.',
        'Human: $20\\,000/3100 = 6.5$ genes per Mb.',
        'The ratio is about 150. A bacterium keeps its genes shoulder to shoulder; a human gene sits in a large neighbourhood of introns, regulatory sequence and repeats.'
      ],
      a: 'About 960 per Mb against 6.5 per Mb — a 150-fold difference in packing.'
    },
    {
      title: 'How much of you is coding?',
      q: 'With 20 000 genes averaging 1300 bp of coding sequence in a 3.1 Gb genome, what fraction codes for protein?',
      steps: [
        'Total coding: $20\\,000 \\times 1300 = 2.6\\times10^{7}$ bp.',
        '$f = 2.6\\times10^{7}/3.1\\times10^{9} = 0.0084$.',
        'Under one per cent — about 26 Mb of a 3100 Mb genome.'
      ],
      a: 'About 0.84 %, roughly 26 megabases.'
    }
  ],
  quiz: [
    { q: 'The approximate number of protein-coding genes in a human genome is…', choices: ['2 000', '20 000', '200 000', '2 000 000'], a: 1, why: 'About 20 000 — a great surprise in 2001, when estimates had run to 100 000.' },
    { q: 'The C-value paradox is that…', choices: ['gene count does not predict genome size', 'genome size does not track organism complexity', 'cells vary in DNA content', 'bacteria have no introns'], a: 1, why: 'Some amphibians and plants carry far more DNA than mammals. Most of a large genome is non-coding, so size says little about complexity.' },
    { q: 'Two unrelated human genomes differ at about…', choices: ['1 base in 10', '1 base in 100', '1 base in 1 000', '1 base in 1 000 000'], a: 2, why: 'Roughly one in a thousand, which over 3.1 Gb is some 3–5 million differences.' },
    { q: 'Most human genetic variation is found between, rather than within, populations.', a: false, why: 'The opposite: the great majority of variation is present within any single population. Human groups are not discrete biological categories.' },
    { q: 'A pan-genome is…', choices: ['the genome of an ancestor', 'all the genes found across the strains of a species, not just the shared core', 'the coding fraction of a genome', 'a genome assembled from long reads'], a: 1, why: 'Bacterial strains share a core set and differ in a large accessory set moved around by horizontal transfer, so the species\' total gene repertoire is far larger than any one strain\'s.' }
  ],
  problems: [
    { q: 'Yeast has about 6000 genes in 12 Mb. What is its gene density in genes per Mb?', answer: 500, tol: 0.03, steps: ['$6000/12 = 500$ genes per Mb — between a bacterium and an animal.'] },
    { q: 'How many bases are expected to differ between two human genomes of 3.1 Gb at one difference per 1000 bases?', answer: 3.1e6, tol: 0.03, steps: ['$D = 3.1\\times10^9 \\times 0.001 = 3.1\\times10^{6}$.'] }
  ],
  applications: [
    'Finding the genetic cause of a rare condition by sequencing a family and comparing genomes.',
    'Tracking pathogens during an outbreak, and detecting new variants as they arise.',
    'Breeding crops and livestock using genome-wide markers rather than visible traits alone.',
    'Conservation genomics: measuring the genetic diversity left in a small population.',
    'Reconstructing history — ancient genomes have rewritten the story of human migrations.'
  ],
  history: 'The first genome of a free-living organism, the bacterium Haemophilus influenzae, was published in 1995; yeast followed in 1996, a nematode in 1998, the fly in 2000, and the human draft in 2001. The public Human Genome Project released its data daily under the Bermuda Principles of 1996 — an early and consequential argument for open data, agreed while a commercial rival was assembling its own sequence.'
},

{
  id: 'bioinformatics', parent: 'genomics-topic', title: 'Bioinformatics and sequence alignment', level: 2,
  short: 'Comparing sequences is the workhorse of modern biology. Alignment scores similarity against a model of how sequences change, and tells you whether a resemblance means shared ancestry or nothing at all.',
  keywords: ['bioinformatics', 'sequence alignment', 'Needleman-Wunsch', 'Smith-Waterman', 'dynamic programming', 'BLAST', 'E-value', 'substitution matrix', 'BLOSUM', 'gap penalty', 'homology', 'dot plot'],
  prereq: ['dna-sequencing', 'genetic-code', 'math:probability-basics'],
  related: ['genomics', 'phylogenetics', 'molecular-clock', 'protein-structure', 'math:combinatorics', 'math:exponential-growth-decay'],
  body: `
When a new gene is sequenced, the first question is always: what does it look like? A protein whose sequence closely resembles a known enzyme is very probably an enzyme of the same kind, because sequence is inherited and function tends to travel with it. Turning "resembles" into a number is what **alignment** does.

### Aligning two sequences
An alignment writes two sequences one above the other, inserting gaps so that corresponding positions line up:

| | aligned sequence |
|---|---|
| query | \`A C G T A C G T A C\` |
| subject | \`A C G – A C C T A C\` |

Score it: a reward for each match, a penalty for each mismatch, a larger penalty for each gap. The alignment that matters is the highest-scoring one — and there are astronomically many possible alignments, so they cannot be tried one at a time.

**Dynamic programming** solves it exactly. Build a grid with one sequence along the top and the other down the side. Each cell holds the best score for aligning the two prefixes that end there, and can only be reached three ways: diagonally (align the two letters), from the left (a gap in one), or from above (a gap in the other). So each cell is the best of three sums, filled in from the top-left corner, and tracing the choices back from the last cell recovers the alignment itself. This is the **Needleman–Wunsch** algorithm (1970) for aligning sequences end to end; changing one rule — never let a score go below zero, and start the traceback from the highest cell anywhere — gives **Smith–Waterman** (1981), which finds the best matching *region* instead.

The cost is the grid: $(m+1)(n+1)$ cells. Two 1000-base sequences is a million cells, which is nothing; one sequence against a database of $10^{11}$ bases is not.

### Scoring: not all substitutions are equal
For proteins, treating every mismatch alike throws away information. A leucine replaced by isoleucine — same size, same chemistry — is common and harmless; leucine replaced by aspartate is neither. **Substitution matrices** such as the BLOSUM series give each of the 210 amino acid pairs a score derived from how often that swap is seen in real, confidently aligned proteins. BLOSUM62 is the usual default.

**Gaps** need care too. One gap of ten is a single insertion or deletion event; ten separate gaps of one are ten events and far less likely. So the penalty is **affine**: a large cost to open a gap, a small cost per extra position.

$$G = o + e\\,(k-1)$$

### BLAST and the E-value
Searching a whole database exactly is too slow, so **BLAST** (1990) is a heuristic: it first looks for short exact or near-exact "words" shared between query and database, and only extends an alignment around those seeds. It can miss the odd distant match, and it made searching a database something you do while waiting, rather than something you schedule.

The output that matters is not the score but the **E-value**: the number of alignments this good expected *by chance* in a database of this size. In bit-score form,

$$E = m\\,n\\,2^{-S'}$$

with $m$ the query length, $n$ the database size and $S'$ the bit score. An E-value of 10⁻⁵⁰ means chance is out of the question; a value of 2 means you would expect two such hits from random sequence. The database size appears directly, so **the same alignment becomes less significant as databases grow** — a genuinely uncomfortable property, and a reminder that significance here is a statement about a search, not only about two sequences.

> [!warn] A good score means similarity, and similarity usually means common ancestry — but not always, and common ancestry does not guarantee the same function. Genes duplicate and then diverge in job (paralogues); unrelated proteins occasionally converge on similar sequence; and a well-aligned gene of unknown function tells you only that two organisms share their ignorance. Annotation errors propagate happily from database to database.

### Dot plots: alignment you can see
A **dot plot** puts one sequence on each axis and marks every position where a short window matches. A diagonal line means a shared stretch; a broken diagonal, an insertion or deletion; a line at right angles, an inverted segment; a lattice of parallel lines, a repeat. Before any scoring, it shows the structure of the relationship — which is why it is still the first thing to draw when two sequences behave strangely. You can try alignments on the [sequence tools](#/tools/sequence).
`,
  ideas: [
    'Alignment scores similarity with rewards for matches and penalties for mismatches and gaps.',
    'Dynamic programming finds the best alignment exactly in (m+1)(n+1) steps: Needleman–Wunsch end-to-end, Smith–Waterman for the best local region.',
    'Substitution matrices (BLOSUM62) score amino acid swaps by how often they really occur; gap penalties are affine, because one long gap is one event.',
    'BLAST trades guaranteed optimality for speed by seeding on short shared words.',
    'The E-value is the number of hits this good expected by chance, and it grows with the size of the database searched.'
  ],
  pitfalls: [
    'A high percentage identity proves the two genes do the same thing — It suggests common ancestry. Duplicated genes diverge in function, and annotation transferred by similarity alone is how errors spread through databases.',
    'The E-value is a probability — It is an expected number of chance hits. For small values the two are nearly the same, but an E-value of 5 means "expect about five", not "5 % likely".',
    'A gap of ten costs ten times a gap of one — With affine penalties it costs much less: opening the gap is the expensive part, because one event of any length is still one event.'
  ],
  formulas: [
    {
      name: 'Alignment score',
      expr: 'S = nm*sm + nx*sx + ng*sg', tex: 'S = n_m s_m + n_x s_x + n_g s_g',
      vars: {
        S: { name: 'alignment score', signed: true },
        nm: { name: 'number of matches', value: 90, int: true, tex: 'n_m' },
        sm: { name: 'score per match', value: 5, signed: true, tex: 's_m' },
        nx: { name: 'number of mismatches', value: 8, int: true, tex: 'n_x' },
        sx: { name: 'score per mismatch', value: -4, signed: true, tex: 's_x' },
        ng: { name: 'total gap positions', value: 2, int: true, tex: 'n_g' },
        sg: { name: 'score per gap position', value: -10, signed: true, tex: 's_g' }
      },
      note: 'The classic nucleotide scheme is +5, −4 and −10. For proteins the match and mismatch scores come from a substitution matrix instead.',
      stories: { S: 'An alignment has {nm} matches, {nx} mismatches and {ng} gap positions, scored {sm}, {sx} and {sg}. What is its score?' }
    },
    {
      name: 'Affine gap penalty',
      expr: 'G = o + ex*(k - 1)', tex: 'G = o + e\\,(k - 1)',
      vars: {
        G: { name: 'total penalty for the gap' },
        o: { name: 'cost to open a gap', value: 10 },
        ex: { name: 'cost per extra position', value: 0.5, tex: 'e' },
        k: { name: 'length of the gap', value: 5, int: true, min: 1, max: 60 }
      },
      note: 'One insertion or deletion of ten bases is one evolutionary event, so it should not cost ten times a single-base gap.',
      stories: { G: 'A gap of {k} positions is scored with an opening cost of {o} and {ex} per extra position. What is the penalty?' }
    },
    {
      name: 'E-value of a database hit',
      expr: 'Eval = m*n*2^(-Sb)', tex: 'E = m\\,n\\,2^{-S\'}',
      vars: {
        Eval: { name: 'hits this good expected by chance', tex: 'E' },
        m: { name: 'query length (bases)', value: 300 },
        n: { name: 'database size (bases)', value: 3e9 },
        Sb: { name: 'bit score', value: 43, min: 5, max: 200, tex: 'S\'' }
      },
      note: 'Every extra bit of score halves the E-value; every doubling of the database doubles it.',
      practice: { unknowns: ['Eval', 'Sb'] },
      stories: {
        Eval: 'A {m} query scores {Sb} bits against a database of {n}. How many such hits are expected by chance?',
        Sb: 'What bit score does a {m} query need for an E-value of {Eval} against a {n} database?'
      }
    }
  ],
  examples: [
    {
      title: 'How big is the alignment grid?',
      q: 'How many cells does Needleman–Wunsch fill to align a 1200-base sequence with a 900-base one? And for two whole human chromosomes of 100 Mb each?',
      steps: [
        '$(1200 + 1)(900 + 1) = 1201 \\times 901 \\approx 1.08\\times10^{6}$ cells — a few milliseconds.',
        'For 100 Mb each: $(10^8)^2 = 10^{16}$ cells. At a billion cells per second that is about four months, and the memory alone is impossible.',
        'This is exactly why BLAST and other seeded heuristics exist.'
      ],
      a: 'About a million cells for the small pair; 10¹⁶ for the chromosomes, which is why exact alignment is not used at that scale.'
    },
    {
      title: 'Reading an E-value',
      q: 'A 300-base query scores 43 bits against a 3 × 10⁹ base database. What is the E-value, and what would it be if the database grew ten-fold?',
      steps: [
        '$E = 300 \\times 3\\times10^9 \\times 2^{-43} = 9\\times10^{11}/8.8\\times10^{12} = 0.10$.',
        'Ten times the database: $E = 1.0$ — one such hit expected by chance.',
        'The alignment has not changed at all. Its significance has, because you looked in ten times as many places.'
      ],
      a: 'E ≈ 0.10, rising to about 1.0 in a ten-fold larger database.'
    },
    {
      title: 'Why gaps are affine',
      q: 'Compare the penalty for one gap of 8 with eight gaps of 1, using o = 10 and e = 0.5.',
      steps: [
        'One gap of 8: $G = 10 + 0.5(7) = 13.5$.',
        'Eight separate gaps of 1: $8 \\times 10 = 80$.',
        'The scoring prefers, correctly, the explanation that involves one insertion or deletion rather than eight.'
      ],
      a: '13.5 against 80 — nearly six times cheaper for the single event.'
    }
  ],
  quiz: [
    { q: 'Needleman–Wunsch aligns two sequences…', choices: ['end to end, globally', 'only their best-matching region', 'by seeding on shared words', 'without any gaps'], a: 0, why: 'It is the global algorithm. Smith–Waterman, which differs by clamping scores at zero and tracing back from the best cell, finds the best local region.' },
    { q: 'An E-value of 1 × 10⁻⁴⁰ means…', choices: ['the sequences are 40 % identical', 'such a hit is essentially never expected by chance', 'the alignment is 40 bits long', 'there are 10⁻⁴⁰ matches'], a: 1, why: 'The E-value is the expected number of chance hits that good. 10⁻⁴⁰ makes coincidence untenable, so common ancestry is the reasonable explanation.' },
    { q: 'How many cells does the alignment grid have for sequences of 500 and 400 letters?', answer: 200901, tol: 0.02, why: '(500 + 1)(400 + 1) = 501 × 401 = 200 901.' },
    { q: 'Doubling the size of the database doubles the E-value of an unchanged alignment.', a: true, why: 'E = mn2^(−S′) is proportional to n. The same match becomes less surprising when you have searched twice as much sequence.' },
    { q: 'On a dot plot, a diagonal line broken by a horizontal jump indicates…', choices: ['an inversion', 'a repeat', 'an insertion or deletion in one sequence', 'a sequencing error only'], a: 2, why: 'The diagonal resumes offset, because one sequence has extra (or missing) letters at that point. An inversion shows as a diagonal at right angles; a repeat as several parallel lines.' }
  ],
  problems: [
    { q: 'An alignment has 120 matches (+5), 15 mismatches (−4) and 4 gap positions (−10). What is its score?', answer: 500, tol: 0.02, steps: ['$120(5) + 15(-4) + 4(-10) = 600 - 60 - 40 = 500$.'] },
    { q: 'With an opening cost of 11 and 1 per extra position, what is the penalty for a gap of 6?', answer: 16, tol: 0.02, steps: ['$G = 11 + 1(6 - 1) = 16$.'] },
    { q: 'What bit score gives an E-value of 0.01 for a 500-base query against a 2 × 10⁹ base database?', answer: 46.5, tol: 0.03, hint: 'Rearrange E = mn2^(−S′) and take logarithms to base 2.', steps: ['$2^{S\'} = mn/E = (500)(2\\times10^9)/0.01 = 1.0\\times10^{14}$.', '$S\' = \\log_2(10^{14}) = 46.5$ bits.'] }
  ],
  applications: [
    'Identifying an unknown sequence by searching it against everything already known.',
    'Finding the genes in a newly sequenced genome by similarity to known genes and by statistical models.',
    'Building phylogenetic trees from aligned sequences (see [[phylogenetics]]).',
    'Mapping billions of sequencing reads onto a reference genome — specialised alignment, tuned for speed.',
    'Predicting the effect of a variant in a patient\'s genome from how conserved that position is across species.'
  ],
  history: 'Margaret Dayhoff built the first protein sequence database and the first substitution matrices in the 1960s and 1970s, when sequences were few enough to print in a book — the origin of the whole field. Needleman and Wunsch published the alignment algorithm in 1970, Smith and Waterman the local version in 1981, and BLAST arrived in 1990; the BLAST paper is among the most cited in all of science, which says something about how much of biology now runs through a database search.',
  sim: 'tech-dotplot'
},

{
  id: 'gmos', parent: 'genomics-topic', title: 'Genetically modified organisms', level: 2,
  short: 'Crops and animals whose genomes have been deliberately changed — by adding a gene from another species, or now by editing a letter of their own. What they do, what the evidence on safety says, and why the argument is mostly not about biology.',
  keywords: ['GMO', 'transgenic', 'Bt crops', 'golden rice', 'herbicide tolerance', 'gene editing crops', 'regulation', 'substantial equivalence', 'gene flow', 'resistance management', 'refuge'],
  prereq: ['restriction-cloning', 'crispr', 'natural-selection'],
  related: ['gene-therapy', 'biosafety-bioethics', 'genomics', 'antibiotic-resistance', 'plant-nutrition'],
  body: `
Humans have been changing the genomes of crops for ten thousand years. Maize came from a grass with a dozen hard seeds; wheat is an accidental hybrid with three genomes in it; a great many modern varieties descend from seed deliberately irradiated or treated with chemicals in the mid-twentieth century to scramble genes at random and see what came out — a technique that remains unregulated as "conventional breeding" in most countries. What changed in the 1990s was not modification but **precision**: the ability to move one known gene and know what it does.

### What has actually been grown
Despite the range of possibilities, the great majority of the area planted worldwide — of the order of 190 million hectares by the late 2010s, mostly in the United States, Brazil, Argentina, Canada and India — has carried one or both of two traits.

- **Insect resistance (Bt)**: a gene from the soil bacterium *Bacillus thuringiensis* for a Cry protein. The protein is a crystal that dissolves in the alkaline gut of particular insect larvae and binds receptors found only there; mammals have neither the gut chemistry nor the receptors. The same bacterium has been sprayed on fields since the 1930s and is permitted in organic farming, which is one of the neater ironies of the debate.
- **Herbicide tolerance**: a version of an enzyme that a broad-spectrum herbicide cannot inhibit, so the crop survives spraying that kills the weeds around it.

**Golden rice** is the best-known example of a nutritional trait: rice engineered to make beta-carotene, a precursor of vitamin A, in the grain. Vitamin A deficiency is a leading cause of preventable childhood blindness, affecting on the order of a hundred and ninety million preschool-aged children by WHO estimates from around 2009. Golden rice was developed with public funding and licensed royalty-free for smallholders, but spent about two decades in regulatory and legal processes and field trials; the Philippines approved it for propagation in 2021, and that approval was overturned by a court in 2024. Its history is a reasonable case study in how little of this argument is settled by the biology.

### What the evidence says about safety
This is one of the most heavily studied questions in applied biology, and the conclusions of the major reviews are consistent: the United States National Academies' 2016 report, after examining some nine hundred studies, found no substantiated evidence that the GM crops then on the market were less safe to eat than their conventional counterparts, and a summary of a decade of European Union–funded research reached a similar conclusion in 2010. A 2014 meta-analysis of farm-level data reported, on average, about a 37 % reduction in chemical pesticide use, a 22 % increase in yield and higher farmer profits, with the largest gains in developing countries.

Those are averages over particular traits in particular places, and they do not make every future modification safe: each new trait is a new question, which is what case-by-case assessment is for.

### Where the real disagreements are
Most of the sustained criticism is not about whether the food is toxic.

- **Resistance.** Growing one insecticidal protein over millions of hectares is a colossal selection pressure, and pest populations have evolved resistance to some Bt proteins, just as weeds have to some herbicides. The main management tool is a **refuge**: a block of non-Bt crop where susceptible insects survive and can mate with the rare resistant ones, keeping the resistance allele rare and mostly in heterozygotes.
- **Who owns the seed.** Patents, licensing terms and the concentration of the seed industry in very few companies are genuine concerns about power — and entirely separate from molecular biology.
- **Gene flow** into wild relatives or neighbouring fields, which matters most where a crop's wild relatives grow nearby.
- **Herbicide use patterns**, where tolerance traits encouraged reliance on single herbicides and, predictably, resistant weeds.
- **Regulation.** The European Union regulates by *process* — what was done to make the organism — while Canada, and largely the United States, regulate by *product*: what the organism is like. Gene editing has made the difference awkward, since a crop with a single edited base may be indistinguishable from one produced by random mutagenesis. A 2018 European Court of Justice ruling placed edited crops under the GMO directive; proposals to change that have been debated since.

> [!key] "Is GM food safe?" is not one question. It is a question about each trait in each crop — and most of the public argument is really about ownership, farming systems and trust in institutions, which no amount of toxicology will settle.

Gene editing ([[crispr]]) is shifting the ground again: edits that delete or tweak a plant's own genes leave nothing foreign behind, and several such crops have reached market in countries that judge products rather than processes.
`,
  ideas: [
    'Nearly all GM area planted carries insect resistance (Bt) or herbicide tolerance, or both.',
    'The Bt protein acts on receptors in the guts of particular insect larvae; mammals lack them, and the bacterium has been sprayed on crops since the 1930s.',
    'Large reviews — including the US National Academies in 2016 — have found no substantiated evidence that marketed GM foods are less safe to eat than conventional ones.',
    'Pests evolve: refuges of non-Bt crop keep resistance alleles rare by letting susceptible insects survive and interbreed.',
    'Regulation differs fundamentally — by process in the EU, by product in Canada and largely the US — which gene editing has made harder to sustain.'
  ],
  pitfalls: [
    'GM crops are the first genetically altered food — Every crop has been genetically altered by selective breeding, hybridisation and, since the 1950s, deliberate random mutagenesis. What is new is knowing which gene changed.',
    'Bt crops are dangerous because they contain an insecticide — The protein needs an alkaline gut and specific receptors that mammals do not have; the same protein is approved for organic spraying. The real Bt concern is resistance evolving in pests.',
    'Eating DNA from another species transfers genes to you — Dietary DNA is digested like any other. Every meal already contains billions of foreign genes from plants, animals and microbes.'
  ],
  formulas: [
    {
      name: 'Spread of a resistance allele',
      expr: 'q1 = q0*(1 + s)^t', tex: 'q_1 = q_0 (1 + s)^{t}',
      vars: {
        q1: { name: 'allele frequency after t generations', q: 'ratio', tex: 'q_1' },
        q0: { name: 'starting allele frequency', q: 'ratio', value: 0.001, min: 1e-6, max: 0.5, tex: 'q_0' },
        s: { name: 'selective advantage per generation', q: 'ratio', unit: '%', value: 50, min: 1, max: 300 },
        t: { name: 'generations', q: 'count', value: 10, int: true, min: 1, max: 200 }
      },
      note: 'A simple haploid model: good while the allele is rare, and it slows as the allele becomes common and the population runs out of susceptible individuals.',
      practice: { unknowns: ['q1', 't'] },
      stories: {
        q1: 'A resistance allele starts at {q0} and gains {s} per generation. What is its frequency after {t}?',
        t: 'How many generations does a resistance allele need to go from {q0} to {q1} with an advantage of {s}?'
      }
    },
    {
      name: 'Resistant homozygotes in a field population',
      expr: 'n = N*q^2', tex: 'n = N q^{2}',
      vars: {
        n: { name: 'resistant homozygotes', q: 'count' },
        N: { name: 'insects in the population', q: 'count', value: 1e6 },
        q: { name: 'resistance allele frequency', q: 'ratio', value: 0.001, min: 1e-6, max: 0.5 }
      },
      note: 'From Hardy–Weinberg. When resistance is recessive and rare, almost every copy of the allele sits in a heterozygote — which is the whole logic of the refuge strategy.',
      stories: { n: 'A population of {N} insects carries a resistance allele at {q}. How many are resistant homozygotes?' }
    }
  ],
  examples: [
    {
      title: 'Why refuges work',
      q: 'A resistance allele is at a frequency of 0.001 in a population of a million insects, and resistance is recessive. How many insects are resistant, and how many merely carry the allele?',
      steps: [
        'Homozygotes: $n = 10^6 \\times (0.001)^2 = 1$ insect.',
        'Heterozygotes: $2pq \\times N = 2(0.999)(0.001)\\times10^6 \\approx 2000$ insects.',
        'So 2000 copies of the allele are hidden in carriers, and only one insect actually survives the crop. If that one mates with a susceptible insect from a refuge, all its offspring are carriers — not resistant.'
      ],
      a: 'One resistant insect against about 2000 carriers: the refuge keeps the rare resistant survivors marrying into a susceptible majority.'
    },
    {
      title: 'How fast can resistance spread?',
      q: 'An allele at 0.001 has a 50 % advantage per generation under heavy selection. How many generations until it reaches 0.5?',
      steps: [
        '$0.5 = 0.001(1.5)^t$, so $(1.5)^t = 500$.',
        '$t = \\ln 500/\\ln 1.5 = 6.21/0.405 = 15.3$.',
        'About fifteen generations — a handful of seasons for many insects. This is why resistance management is designed in from the start rather than added when resistance appears.'
      ],
      a: 'About 15 generations.'
    }
  ],
  quiz: [
    { q: 'The Bt protein is harmless to mammals mainly because…', choices: ['it is destroyed by cooking', 'it needs an alkaline gut and receptors that mammals do not have', 'it is present in tiny amounts', 'mammals excrete it unchanged'], a: 1, why: 'Its activation and binding depend on insect gut chemistry and specific receptors. Mammalian guts are acidic and lack the receptors.' },
    { q: 'A refuge of non-Bt crop is planted in order to…', choices: ['increase total yield', 'keep susceptible insects around so resistant ones mostly mate with them', 'dilute the Bt protein', 'satisfy organic certification'], a: 1, why: 'Resistance is usually recessive and rare. Susceptible mates from the refuge mean the rare resistant survivor produces heterozygous offspring, which the crop still kills.' },
    { q: 'The main conclusion of large reviews of GM food safety, such as the 2016 US National Academies report, is that…', choices: ['GM foods are more nutritious', 'no substantiated evidence was found that marketed GM foods are less safe to eat than conventional ones', 'all GM crops raise health risks', 'the evidence is too thin to say anything'], a: 1, why: 'That is the finding for the crops examined. It is a statement about the traits studied, not a guarantee about every possible future modification — which is why assessment is case by case.' },
    { q: 'The EU and the US differ in that the EU regulates the process used to make an organism, while the US largely regulates the product.', a: true, why: 'Process-based rules catch a technique wherever it is used; product-based rules ask what the organism is like. Gene editing, which can leave no trace of the method, strains the distinction.' },
    { q: 'Which of these is a scientific rather than a social or economic objection to current GM crops?', choices: ['Seed patents concentrate power in a few companies', 'Pests evolving resistance to insecticidal proteins', 'Consumers want the choice that labelling gives', 'Farmers are contractually restricted from saving seed'], a: 1, why: 'Resistance evolution is a biological consequence of intense selection, and it is measurable. The others are real concerns about ownership and choice, but they are not answered by biology.' }
  ],
  problems: [
    { q: 'A resistance allele at frequency 0.002 in a population of 5 million insects. How many resistant homozygotes, if resistance is recessive?', answer: 20, tol: 0.03, steps: ['$n = 5\\times10^6 \\times (0.002)^2 = 5\\times10^6 \\times 4\\times10^{-6} = 20$.'] },
    { q: 'Starting at 0.0005 with a 40 % advantage per generation, what is the allele frequency after 12 generations?', answer: 0.0289, tol: 0.03, steps: ['$(1.4)^{12} = 56.7$.', '$q = 0.0005 \\times 56.7 = 0.0289$ — nearly 3 % in a dozen generations.'] }
  ],
  applications: [
    'Insect-resistant cotton and maize, which reduced insecticide spraying in several major producing countries.',
    'Virus-resistant papaya, which kept the Hawaiian industry alive after ringspot virus.',
    'Non-browning apples and potatoes, made by silencing the plant\'s own enzyme rather than adding foreign genes.',
    'Insulin, rennet for cheese and many industrial enzymes, made by genetically modified microbes in contained vessels — the least controversial use of the technology by a wide margin.',
    'Edited crops for disease resistance and drought tolerance, several now reaching market in product-based regulatory systems.'
  ],
  history: 'The first genetically modified whole organism was a bacterium in 1973; the first GM plant, in 1983; the first commercial GM food, a slow-softening tomato, in 1994. Insect-resistant and herbicide-tolerant field crops followed from 1996 and spread faster than almost any agricultural technology before them. The public reaction in Europe in the late 1990s — arriving just after a food-safety scandal that had badly damaged trust in regulators — shaped a regulatory divergence that has lasted a quarter of a century.'
},

{
  id: 'gene-therapy', parent: 'genomics-topic', title: 'Gene therapy', level: 3,
  short: 'Treating a disease by changing the genes in a person\'s cells: adding a working copy, silencing a harmful one, or editing the sequence. After thirty difficult years it works — for a growing handful of conditions, at extraordinary cost.',
  keywords: ['gene therapy', 'vector', 'AAV', 'lentivirus', 'ex vivo', 'in vivo', 'insertional mutagenesis', 'CAR-T', 'lipid nanoparticle', 'somatic', 'germline', 'access'],
  prereq: ['crispr', 'viruses', 'dna-replication'],
  related: ['biosafety-bioethics', 'gmos', 'human-genetics', 'stem-cells', 'medicine:cancer-treatment', 'medicine:immunotherapy'],
  body: `
If a condition is caused by a broken gene, the obvious remedy is to supply a working one. The obvious remedy took thirty years, because the hard part is not the gene — it is delivery: getting enough DNA into enough of the right cells, in a person, without the immune system objecting and without breaking something else.

### Vectors: mostly repurposed viruses
Viruses have spent hundreds of millions of years learning to deliver nucleic acid into cells, so gene therapy borrows them and removes the genes that let them replicate.

| Vector | Carries | Genome | Typical use |
|---|---|---|---|
| Adeno-associated virus (AAV) | up to about 4.7 kb | stays mostly outside the chromosomes | delivered into the body: eye, liver, muscle, nervous system |
| Lentivirus | about 8 kb | integrates into the chromosome | cells treated outside the body, especially blood stem cells |
| Lipid nanoparticles | large; RNA | nothing integrates | mRNA and editing components, mainly to the liver |

AAV's small capacity is a real constraint — several important genes do not fit — and its tropism, which serotype infects which tissue, decides where a dose ends up. Because a systemic dose must reach a whole organ, the number of vector particles given is enormous — of the order of 10¹⁴ to 10¹⁵ for a systemic dose — and the immune response to that protein load is one of the field's central problems. Many people also carry antibodies from natural AAV exposure and cannot be treated at all.

**Ex vivo** therapy sidesteps delivery: take the cells out, treat them in a dish where efficiency can be measured, select the successes, and put them back. It works beautifully for blood, because blood stem cells can be removed and returned. **In vivo** therapy — injecting the vector into a person — is necessary for everything else and much harder to control.

### What has worked
- **Inherited immune deficiency.** Children with severe combined immunodeficiency were among the first treated, from the 1990s, by correcting their own blood stem cells. A therapy for one form was approved in Europe in 2016.
- **Inherited retinal dystrophy.** An AAV therapy injected under the retina for a rare form of blindness was approved in the US in 2017 — the first in vivo gene therapy approved there.
- **Spinal muscular atrophy.** An AAV therapy approved in 2019 delivers a working copy of the missing gene to motor neurons in infants, in a condition that was otherwise often fatal in early childhood.
- **Haemophilia.** AAV therapies delivering clotting factor genes to the liver have been approved since 2022, reducing or removing the need for regular factor infusions.
- **CAR-T cells for cancer.** A person's own T cells are taken out, given a gene for a receptor that recognises a cancer marker, and returned. Approved from 2017, and now standard treatment for several blood cancers (see [[medicine:immunotherapy]]).
- **Sickle cell disease and beta thalassaemia.** Both a lentiviral and a CRISPR-based therapy were approved in 2023, editing or adding genes in the person's own blood stem cells outside the body.

### Risks, honestly
- **Immune reactions** to the vector, which can be severe at high doses. In 1999 an eighteen-year-old volunteer, Jesse Gelsinger, died of a massive inflammatory reaction to an adenoviral vector in a trial — a death that stopped much of the field, prompted investigations into how the trial had been run and consented, and changed oversight permanently.
- **Insertional mutagenesis.** An integrating vector lands somewhere in the genome, and it can land next to a growth-promoting gene. Several children cured of immune deficiency in early trials later developed leukaemia from exactly this. Modern vector designs are engineered to make it much less likely, but the risk is not zero and it is disclosed.
- **Durability.** Non-integrating AAV is diluted away as cells divide, so a treated liver may lose the gene over years, especially in a growing child — and a second dose is blocked by immunity to the first.
- **Off-target editing** where editors are used (see [[crispr]]).

> [!key] Gene therapy is **somatic**: it changes the treated person's body cells and is not inherited. Changing embryos or germ cells is a different question altogether, and is prohibited or unapproved for reproduction almost everywhere (see [[biosafety-bioethics]]).

### The cost problem
These are among the most expensive medicines ever sold — commonly of the order of a million to three million US dollars for a single course. The arguments for the prices (a once-only treatment replacing a lifetime of care; tiny patient numbers over which to spread development costs) are real, and so is the consequence: health systems that cannot pay, and conditions common in low-income countries left untreated while the therapies target markets that can afford them. Sickle cell disease is the sharpest example — most of the world's cases are in sub-Saharan Africa, and the new therapies also require the resources of a transplant centre. Whether a technology that works for very few people is a triumph or an indictment is a fair question, and it is an economic and political one, not a scientific one.

> [!note] This page explains how these treatments work. Decisions about any individual's care belong with their own clinical team, who can weigh the evidence for that condition, that person and that moment.
`,
  ideas: [
    'The hard problem in gene therapy is delivery, not the gene.',
    'AAV is delivered into the body but carries only about 4.7 kb and does not integrate; lentivirus integrates and is used on cells treated outside the body.',
    'Ex vivo treatment of blood stem cells is far more controllable than injecting a vector into a person.',
    'Approved therapies now exist for inherited blindness, spinal muscular atrophy, haemophilia, some immune deficiencies, sickle cell disease and several blood cancers.',
    'The known risks are immune reactions to the vector, insertional mutagenesis, and loss of effect as cells divide.',
    'All approved gene therapies are somatic: they change the treated person only, not their descendants.'
  ],
  pitfalls: [
    'Gene therapy changes the genes a person passes on — Somatic therapy treats body cells only. Heritable change would require editing embryos or germ cells, which is not approved for reproduction.',
    'One dose fixes the gene for ever — With a non-integrating vector the DNA is diluted as cells divide, and pre-existing or acquired immunity can prevent a repeat dose. Durability is measured in years of follow-up, not assumed.',
    'Gene therapy is only for rare inherited diseases — The largest use so far is engineered immune cells against cancer, and the 2023 approvals target sickle cell disease, which affects millions of people worldwide.'
  ],
  formulas: [
    {
      name: 'Fraction of cells reached by a vector',
      expr: 'f = 1 - exp(-MOI)', tex: 'f = 1 - e^{-\\mathrm{MOI}}',
      vars: {
        f: { name: 'fraction of cells getting at least one vector', q: 'ratio', unit: '%' },
        MOI: { name: 'vector particles per cell', q: 'ratio', value: 3, min: 0.01, max: 100, tex: '\\mathrm{MOI}' }
      },
      note: 'Poisson statistics: vectors arrive independently, so some cells get several and some get none. Doubling the dose does not double the fraction reached.',
      stories: { f: 'Cells are exposed to {MOI} vector particles each. What fraction receives at least one?', MOI: 'What multiplicity of infection reaches {f} of the cells?' }
    },
    {
      name: 'Vector particles in a systemic dose (a hypothetical illustration)',
      expr: 'Ntot = D*m', tex: 'N_{tot} = D\\,m',
      vars: {
        Ntot: { name: 'total vector genomes', q: 'count', tex: 'N_{tot}' },
        D: { name: 'vector genomes per kg', q: false, unit: 'vg/kg', value: 1.1e14 },
        m: { name: 'body mass', q: 'mass', unit: 'kg', value: 8 }
      },
      note: 'An illustration of the scale only — of the order of 10¹⁵ particles for a small child. Real dosing is a clinical matter, specific to each therapy and patient, and decided by the treating team.',
      stories: { Ntot: 'A hypothetical therapy is given at {D} to a patient of {m}. How many vector genomes is that in total?' }
    }
  ],
  examples: [
    {
      title: 'Why more vector is not simply better',
      q: 'Compare the fraction of cells reached at an MOI of 1, 3 and 10.',
      steps: [
        'MOI 1: $f = 1 - e^{-1} = 0.63$.',
        'MOI 3: $f = 1 - e^{-3} = 0.95$.',
        'MOI 10: $f = 1 - e^{-10} = 0.99995$.',
        'Tripling from 1 to 3 gains 32 percentage points; tripling again from 3 to 10 gains 5. Meanwhile the immune load and cost rise in proportion to the dose.'
      ],
      a: '63 %, 95 % and 99.995 % — steeply diminishing returns against a linearly rising dose.'
    },
    {
      title: 'How much correction is enough?',
      q: 'Why can a therapy that reaches only a fraction of cells still cure a disease?',
      steps: [
        'For a secreted product — a clotting factor, an enzyme — corrected cells supply the whole body, so a few per cent of liver cells can lift factor levels out of the severe range.',
        'For blood stem cells, corrected cells often have a survival advantage, so their share rises over time.',
        'For a structural protein needed in every cell (some muscle conditions), partial correction helps proportionately less — which is one reason those diseases have been harder.'
      ],
      a: 'It depends on whether the product can be shared between cells and whether corrected cells outcompete the rest.'
    }
  ],
  quiz: [
    { q: 'The central technical difficulty of gene therapy is…', choices: ['finding the disease gene', 'synthesising the DNA', 'delivering the gene to enough of the right cells safely', 'keeping the protein folded'], a: 2, why: 'Disease genes have been known for decades and DNA is easy to make. Delivery — efficiency, targeting, immune response — is what took thirty years.' },
    { q: 'An advantage of treating cells outside the body (ex vivo) is that…', choices: ['no vector is needed', 'the efficiency can be measured and successful cells selected before they are returned', 'it works for every tissue', 'it avoids the need for consent'], a: 1, why: 'In a dish you can check what happened, and discard or enrich. Inside a body you cannot. The limitation is that only some tissues — chiefly blood — can be taken out and put back.' },
    { q: 'Insertional mutagenesis means that…', choices: ['the vector mutates', 'the inserted gene is the wrong sequence', 'the vector integrates near a growth-promoting gene and can cause cancer', 'the immune system destroys the vector'], a: 2, why: 'An integrating vector lands somewhere in the genome; landing next to a proto-oncogene can switch it on. Several children in early immune-deficiency trials developed leukaemia this way, and vector design changed in response.' },
    { q: 'A gene therapy given to an adult can be passed on to that person\'s children.', a: false, why: 'Approved therapies are somatic: they alter body cells only. Heritable change would require altering embryos or germ cells, which is not approved for reproduction.' },
    { q: 'Doubling an AAV dose from an MOI of 3 to 6 changes the fraction of cells reached from about 95 % to about…', choices: ['99.8 %', '100 %', '97 %', '190 %'], a: 0, why: '1 − e⁻⁶ = 0.9975. The fraction saturates while the dose, cost and immune load keep rising in proportion.' }
  ],
  problems: [
    { q: 'What fraction of cells receives at least one vector particle at an MOI of 0.5?', answer: 39.3, unit: '%', tol: 0.03, steps: ['$f = 1 - e^{-0.5} = 1 - 0.607 = 0.393$.'] },
    { q: 'What MOI is needed to reach 99 % of the cells?', answer: 4.6, tol: 0.03, steps: ['$0.99 = 1 - e^{-\\mathrm{MOI}}$, so $e^{-\\mathrm{MOI}} = 0.01$ and $\\mathrm{MOI} = \\ln 100 = 4.6$.'] }
  ],
  applications: [
    'Correcting inherited immune deficiencies by treating a person\'s own blood stem cells.',
    'Restoring some vision in a rare inherited retinal dystrophy by injecting a vector under the retina.',
    'Engineering a person\'s T cells to recognise and kill their cancer.',
    'Supplying clotting factor genes to the liver in haemophilia, reducing the need for regular infusions.',
    'Switching fetal haemoglobin back on in sickle cell disease and beta thalassaemia.'
  ],
  history: 'The first authorised gene transfer into a person was in 1990, for an immune deficiency. The 1999 death of Jesse Gelsinger in a trial, and the leukaemias that followed the first successes in immune deficiency, brought the field to a near halt for a decade and led to far stricter oversight of trials and of consent. Slow, unglamorous work on vector design brought it back: the first approvals in Europe came in 2012 and in the United States in 2017, and the pace has accelerated since.',
  sim: 'tech-crispr'
},

{
  id: 'biosafety-bioethics', parent: 'genomics-topic', title: 'Biosafety and bioethics', level: 2,
  short: 'The rules and the arguments that surround biological research: containment and oversight, consent and privacy, the line between treating a person and altering a lineage, and who benefits from what is discovered.',
  keywords: ['biosafety', 'containment', 'biosafety levels', 'institutional review', 'informed consent', 'genetic privacy', 'germline editing', 'He Jiankui', 'dual-use research', 'Asilomar', 'Cartagena Protocol', '3Rs'],
  prereq: ['crispr', 'gene-therapy', 'gmos'],
  related: ['genomics', 'human-genetics', 'aseptic-technique', 'experimental-design', 'medicine:clinical-trials', 'medicine:evidence-based-medicine'],
  body: `
Biology acquired the power to alter living things faster than societies worked out what to do about it. The response has been a patchwork of laboratory rules, institutional committees, national law and international agreement — and a set of arguments that are still live.

### Containment: matching the precautions to the risk
Work with biological material is done at one of four **biosafety levels**, rising with the risk the organism poses to the worker and to the community: from a teaching laboratory using agents not known to cause disease in healthy adults, through restricted access and enclosed handling for agents that cause treatable disease, to directional airflow and filtration for agents that can be inhaled and cause serious disease, and finally — in a very small number of facilities worldwide — positive-pressure suits with their own air supply, for agents that cause life-threatening disease with no reliable treatment.

The assignment of an organism to a level, the design of the facility, and every procedure used in it are decided by national regulators and an institution's own biosafety committee — not by an individual researcher, and not from a textbook. This page describes the framework; anyone doing such work follows the rules, training and approvals of their institution and country.

Parallel structures govern other risks: ethics committees or institutional review boards for research involving people, animal welfare committees, and for genetically modified organisms a biosafety committee and often a national licence. The international layer includes the **Cartagena Protocol** (2000) on moving living modified organisms across borders and the **Biological Weapons Convention** (in force 1975), which prohibits development and stockpiling of biological weapons but has no inspection regime — a gap argued about ever since.

### Research that could be misused
Some legitimate research produces knowledge that could cause harm if misapplied — the problem of **dual-use research of concern**. The debate became concrete in 2011–12 over experiments on the transmissibility of an influenza virus, and has continued over whether particular experiments should be done, published or funded at all. The governance answer, imperfect but broadly agreed, is that such proposals are reviewed *before* the work starts, by bodies including people from outside the immediate field. Scientists disagree, in good faith and in public, about where the line falls.

### Consent, and who owns a sample
In 1951 cells were taken from a tumour in Henrietta Lacks, a Black American woman treated for cervical cancer, without her knowledge — normal practice at the time. They grew indefinitely, became the HeLa line, and have been used in tens of thousands of studies; her family learned of it two decades later and had no say in its use or its commercial value for decades more. It is the standard case for teaching research ethics because every issue is in it at once: consent, race and power in medicine, privacy — a HeLa genome was published in 2013 without the family's agreement, then withdrawn and placed under a controlled-access arrangement negotiated with them — and benefit.

Modern practice rests on **informed consent**: a person understands what will be done, what might follow, and can refuse or withdraw without penalty. Genomic research strains it in specific ways:

- Sequencing reveals things nobody asked about, so participants are asked in advance what **incidental findings** they wish to be told.
- A genome is shared with relatives, so one person's consent discloses information about people who never consented. Investigators used this in 2018 to identify a criminal suspect through distant relatives' entries in a public genealogy database — a privacy question about people who had uploaded their own data for quite another purpose.
- Genetic data cannot be truly anonymised: a detailed genome is itself an identifier. Legal protection varies — the United States restricts genetic discrimination in health insurance and employment (2008), but not in all kinds of insurance, and other countries differ widely.

### Somatic and germline
The sharpest line in the field separates changing the cells of a person who consents from changing an embryo or a germ cell, where the change is inherited by everyone who follows.

In 2018 He Jiankui announced the birth of twin girls whose embryos he had edited, claiming to confer resistance to HIV. The scientific community condemned it: the medical need was doubtful, since safe ordinary methods of preventing transmission already existed; the consent process was misleading; oversight was evaded; the editing was incomplete and produced changes that had not been intended; and the children — who cannot consent and must be followed for life — were exposed to unknown risk for no clear benefit. He was convicted in China in 2019 and served three years. A WHO expert committee published a governance framework in 2021, and heritable editing remains prohibited or unapproved for reproduction essentially everywhere.

The arguments against heritable editing are not that it is unnatural. They are that the risks fall on people who cannot consent and on their descendants; that the alternatives — embryo selection, donor gametes, somatic therapy — already cover almost every case anyone can name; that safety could not be established without experiments on children; and that a technology available only to the wealthy would deepen existing inequalities. The arguments for keeping the door open concern the rare families for whom no alternative works.

> [!note] Genetic conditions are discussed here as conditions people live with, not as errors to be eliminated. Disabled people and their organisations have argued, with force, that framing prevention as the obvious goal says something about how existing lives are valued — a point that belongs in the discussion, not outside it.

### Animals, and sharing the benefits
Research on animals is governed everywhere by the **3Rs**: *replace* animal experiments with other methods wherever possible, *reduce* the number used to the minimum that will answer the question, and *refine* procedures to reduce suffering. Every protocol goes before an animal welfare committee.

Finally, **benefit sharing**: a country's genetic resources, and the knowledge of the communities that used them, are covered by the Nagoya Protocol (2014). Sequence data from outbreaks raise the same question in real time — countries that share samples fairly ask what they receive in return, a dispute that has repeatedly slowed responses to epidemics.

> [!key] Every rule in this field was written after something went wrong, or after scientists realised something could. The pattern from Asilomar in 1975 onwards is the same: those who understand a technology best are the first to see what it could do, and the worst placed to decide alone what should be done with it.
`,
  ideas: [
    'Biosafety levels 1 to 4 match containment to the risk an agent poses; the level, facility and every protocol are set by regulators and an institution\'s biosafety committee.',
    'Ethics committees, animal welfare committees and biosafety committees review work before it starts, not after.',
    'Informed consent is strained by genomics: incidental findings, information about relatives, and the impossibility of truly anonymising a genome.',
    'Somatic therapy changes a consenting person; germline editing changes descendants who cannot consent, and is prohibited or unapproved for reproduction almost everywhere.',
    'The 2018 embryo-editing case was condemned for absent medical need, evaded oversight, misleading consent and unknown risk to the children.',
    'Animal research follows the 3Rs: replace, reduce, refine.'
  ],
  pitfalls: [
    'Ethics committees exist to slow research down — They exist because research without them injured people. Review is a condition of doing the work, and the cases that shaped it are the reason anyone trusts published results at all.',
    'If a technique is possible it will inevitably be used — Human cloning has been technically imaginable for decades and is banned or unpracticed for reproduction almost everywhere; heritable editing has been feasible since 2015 and remains prohibited. Norms and law do restrain use.',
    'Germline editing is just gene therapy done earlier — The difference is consent and inheritance: the people affected do not exist yet and cannot agree, and the change passes to every generation after them.'
  ],
  examples: [
    {
      title: 'Working through the 2018 embryo-editing case',
      q: 'Why did the scientific community condemn the editing of embryos to resist HIV, when gene therapy for other conditions is approved?',
      steps: [
        'Medical need: safe, ordinary methods already prevent transmission from a parent with HIV, so the children gained nothing they could not have had otherwise.',
        'Consent: the participants were reportedly not clearly told what was being done, and the children could not consent to a change they will carry for life and pass on.',
        'Oversight: approvals were bypassed rather than obtained; no regulator had sanctioned heritable editing.',
        'Execution: the editing was incomplete and produced unintended changes, so the children carry alterations whose effects are unknown.',
        'Compare an approved somatic therapy: a consenting adult or a child\'s guardians accept a known risk for a clear benefit, under regulatory approval, and nothing is inherited.'
      ],
      a: 'Not because editing is inherently wrong, but because there was no need, no valid consent, no oversight, no control of the result — and the consequences fall on people who never agreed.'
    },
    {
      title: 'Whose consent covers a genome?',
      q: 'A person uploads their DNA profile to a public genealogy site. Investigators use it to find a distant relative suspected of a crime. Who has been affected, and what did they agree to?',
      steps: [
        'The uploader consented to genealogy matching — probably not to a criminal investigation.',
        'Every biological relative is now partly identifiable through that upload, and none of them agreed to anything.',
        'Genomes are shared property in a way no other personal data is: you cannot consent on your own behalf alone.',
        'Consequently, the policy question is not only "may the police use this?" but "what may one family member disclose about the rest?" — which most consent forms were never designed to answer.'
      ],
      a: 'One person consented; a whole family was made identifiable. Genetic privacy is irreducibly collective.'
    }
  ],
  quiz: [
    { q: 'The essential difference between somatic and germline editing is that…', choices: ['germline editing is more accurate', 'germline changes are inherited by descendants who cannot consent', 'somatic editing uses viruses', 'germline editing is cheaper'], a: 1, why: 'Somatic changes end with the treated person. Germline changes pass to every generation after, so the people affected cannot agree to the risk.' },
    { q: 'Biosafety level 4 is reserved for agents that…', choices: ['are genetically modified', 'grow slowly', 'cause life-threatening disease for which there is no reliable treatment', 'are used in teaching laboratories'], a: 2, why: 'The levels rise with risk to the worker and the community. Level 4 facilities, very few worldwide, exist for the most dangerous agents; level 1 is an ordinary teaching laboratory.' },
    { q: 'Why can genetic data not be truly anonymised?', choices: ['Laboratories keep records', 'A detailed genome is itself an identifier, and it is shared with relatives', 'Sequencing machines add a serial number', 'Consent forms require names'], a: 1, why: 'A genome identifies the person it came from, and partly identifies their family. Removing the name from the file does not remove the identifier.' },
    { q: 'The 3Rs of animal research are replace, reduce and refine.', a: true, why: 'Replace animal experiments where other methods will answer the question, reduce numbers to the minimum, and refine procedures to reduce suffering — reviewed by a welfare committee before work begins.' },
    { q: 'The Asilomar conference of 1975 is remembered because…', choices: ['it banned recombinant DNA permanently', 'scientists themselves called a moratorium and agreed containment rules before regulators acted', 'it was convened by the United Nations', 'it set the first biosafety level 4 standards'], a: 1, why: 'The researchers who had just invented the techniques paused their own work and agreed a framework of containment — the founding precedent for self-governance in the field, and a reason later crises were met with review rather than prohibition.' },
    { q: 'Dual-use research of concern is best handled by…', choices: ['banning all work on dangerous organisms', 'reviewing proposals before the work starts, including people from outside the immediate field', 'publishing everything and letting readers judge', 'leaving each laboratory to decide'], a: 1, why: 'Prior review that includes outside perspectives is the broadly agreed approach: it weighs risk and benefit before the knowledge exists, when the decision can still be made.' }
  ],
  applications: [
    'Institutional review boards and ethics committees, which every study involving people must pass before it begins.',
    'Consent frameworks for biobanks, including what participants wish to be told about incidental findings.',
    'National rules on genetic discrimination in insurance and employment, which differ markedly between countries.',
    'International agreements on moving modified organisms and on sharing pathogen samples and the benefits that follow.',
    'Prior review of research that could be misused, and of any proposal touching heritable human editing.'
  ],
  history: 'The Nuremberg Code (1947) and the Declaration of Helsinki (1964, revised since) followed atrocities committed in the name of research; the exposure of the Tuskegee syphilis study in 1972, in which treatment was withheld from Black American men for forty years, produced the Belmont Report (1979) and the modern American system of institutional review. Asilomar in 1975 brought the same logic to molecular biology. Each of these frameworks was written after harm, which is the strongest available argument for taking the existing ones seriously.'
}

);
