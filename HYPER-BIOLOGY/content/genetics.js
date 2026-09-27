/* HYPER-BIOLOGY · content/genetics.js
 * Branch "Genetics": topic mendelian (Mendel's laws, Punnett squares, dihybrid crosses, dominance,
 * multiple alleles, chi-square) and topic chromosomes (meiosis, sex linkage, linkage mapping, pedigrees,
 * karyotypes, polygenic traits, human genetic disease). Simulations in sims/genetics.js (prefix gen-).
 */
Hyper.add(

{
  id: 'mendels-laws', parent: 'mendelian', title: 'Mendel\'s laws', level: 1,
  short: 'Gregor Mendel crossed pea plants and counted their offspring. He found that traits are passed on by discrete factors — genes — that come in pairs, separate cleanly into the sex cells (segregation) and, for different genes, sort independently of one another (independent assortment).',
  keywords: ['Mendel', 'law of segregation', 'law of independent assortment', 'allele', 'dominant', 'recessive', 'genotype', 'phenotype', 'homozygous', 'heterozygous', 'monohybrid cross', 'F1', 'F2', 'true-breeding', 'test cross', 'garden pea', '3 : 1 ratio'],
  prereq: ['flowering-reproduction', 'math:probability-basics'],
  related: ['punnett-squares', 'dihybrid-crosses', 'chi-square-genetics', 'meiosis', 'dna-structure', 'model-organisms', 'medicine:dna-genes'],
  body: `
For most of history people assumed that a child is a blend of its parents, the way two paints mix. Blending has a fatal flaw: mixed paint never separates again, yet a trait can vanish in one generation and come back, unchanged, in the next. Gregor Mendel, a friar and teacher in Brno (then Brünn, in the Austrian Empire), set out to find the rule. Between 1856 and 1863 he grew some 28 000 pea plants in the monastery garden and did what none of his predecessors had done systematically: he **counted** the offspring of each kind.

### Why peas
The garden pea *Pisum sativum* came in many varieties that differed in clear-cut, either–or traits — round or wrinkled seeds, violet or white flowers. Peas normally pollinate themselves, so a variety selfed for generations was **true-breeding**: it produced only its own kind. Yet any two could be crossed by hand, by removing a flower's anthers before they shed pollen and dusting its stigma with pollen from another plant. And a generation took one season.

### The experiment
Mendel crossed a true-breeding round-seeded line with a wrinkled one (the parental or **P** generation). Every seed of the first filial generation, **F₁**, was round: wrinkledness had vanished. He let the F₁ plants pollinate themselves, and in the **F₂** wrinkled seeds were back — 1850 of them beside 5474 round ones, a ratio of 2.96 : 1. Six other traits behaved the same way:

| Trait | Dominant form | Recessive form | F₂ dominant | F₂ recessive | Ratio |
|---|---|---|---|---|---|
| Seed shape | round | wrinkled | 5474 | 1850 | 2.96 : 1 |
| Seed colour | yellow | green | 6022 | 2001 | 3.01 : 1 |
| Flower colour | violet | white | 705 | 224 | 3.15 : 1 |
| Pod shape | inflated | constricted | 882 | 299 | 2.95 : 1 |
| Pod colour | green | yellow | 428 | 152 | 2.82 : 1 |
| Flower position | along the stem | at the tip | 651 | 207 | 3.14 : 1 |
| Stem length | tall | dwarf | 787 | 277 | 2.84 : 1 |
| **All seven** | | | **14 949** | **5 010** | **2.98 : 1** |

### Mendel's explanation
Each plant carries **two** hereditary factors for each trait — today, two **alleles** of a **gene**, one from each parent. Write the round allele $R$ and the wrinkled one $r$. A plant's **genotype** is $RR$, $Rr$ or $rr$; its **phenotype** is what we see. The round allele is **dominant**: one copy is enough, so $RR$ and $Rr$ are both round and only the **homozygous** recessive $rr$ is wrinkled. The F₁ were all **heterozygous**, $Rr$.

**The law of segregation.** The two alleles of a gene separate when sex cells form, so each gamete carries just one, and a heterozygote makes $R$ and $r$ gametes in equal numbers. Pollen and eggs meet at random, so the F₂ is $\\tfrac14\\,RR : \\tfrac12\\,Rr : \\tfrac14\\,rr$ — three round to one wrinkled (the bookkeeping is in [[punnett-squares]]).

Mendel tested the idea instead of just fitting it. If he was right, a third of the round F₂ plants ($RR$) should breed true and two-thirds ($Rr$) should split again 3 : 1. Of 565 round-seeded F₂ plants, 193 bred true and 372 split — 1 : 1.93. Crossing the F₁ back to the recessive parent, a **test cross**, gave round and wrinkled in equal numbers, as $Rr \\times rr$ should.

**The law of independent assortment.** Followed two at a time, the alleles of one gene went into the gametes without regard to the alleles of the other, giving the 9 : 3 : 3 : 1 of [[dihybrid-crosses]]. This holds for genes on different chromosomes; genes close together on one chromosome are the exception ([[linkage-mapping]]).

> [!key] Inheritance is particulate. Alleles do not blend or wear out: a recessive allele hidden in a heterozygote comes out of it unchanged, and each gamete receives one allele of each gene, chosen as if by the toss of a coin.

### What Mendel could not see
Mendel never saw a chromosome. Around 1902 Walter Sutton and Theodor Boveri noticed that chromosomes behave exactly like his factors: they come in pairs, the pairs separate in [[meiosis]], and different pairs line up independently. Segregation is the parting of homologous chromosomes; independent assortment is the random orientation of different pairs.

A century on, his genes were found. The wrinkled allele carries an 800-base-pair insertion that wrecks a starch-branching enzyme (1990): the seed makes less starch and more sugar, takes up water, and wrinkles as it dries. The dwarf allele is a single-letter change in an enzyme that makes the growth hormone gibberellin (1997); green seeds lack a "stay-green" protein needed to break down chlorophyll (2007). In each case one working copy is enough — which is why the working allele is dominant.
`,
  ideas: [
    'Each individual carries two alleles of each gene, one from each parent; each gamete carries one.',
    'Segregation: a heterozygote puts its two alleles into equal numbers of gametes, so Aa × Aa gives 1 AA : 2 Aa : 1 aa — a 3 : 1 phenotype ratio when A is dominant.',
    'Independent assortment: genes on different chromosomes are sorted into gametes independently of one another.',
    'A recessive allele is hidden, not changed, in a heterozygote and reappears intact in a quarter of the F₂.',
    'Meiosis is the physical basis: homologous chromosomes separate, and different pairs orient at random.'
  ],
  pitfalls: [
    'A dominant allele is the common one — Dominance describes how two alleles combine in a heterozygote, not how frequent they are. Many dominant alleles (extra fingers, Huntington disease) are rare, while blood group O, which is recessive, is the commonest group in many populations.',
    'A 3 : 1 ratio means three of every four offspring show the dominant trait — It is a probability for each offspring. A family of four has only a 42 % chance of showing exactly 3 : 1; 4 : 0 (32 %) and 2 : 2 (21 %) are common.',
    'The recessive allele is weakened or changed by living alongside a dominant one — It re-emerges in the F₂ exactly as it went in; alleles do not contaminate each other.'
  ],
  formulas: [
    {
      name: 'Observed ratio of dominant to recessive offspring',
      expr: 'r = nD/nR', tex: 'r = \\dfrac{n_D}{n_R}',
      vars: {
        r: { name: 'ratio (dominant per recessive)', tex: 'r' },
        nD: { name: 'offspring with the dominant phenotype', q: 'count', value: 5474, int: true, tex: 'n_D' },
        nR: { name: 'offspring with the recessive phenotype', q: 'count', value: 1850, int: true, tex: 'n_R' }
      },
      note: 'A monohybrid F₂ should give r close to 3; a test cross close to 1. Whether a departure is chance is a question for the chi-square test.',
      practice: { unknowns: ['r', 'nR'] },
      stories: {
        r: 'Mendel counted {nD} round and {nR} wrinkled seeds in an F₂. What is the ratio of round to wrinkled?',
        nR: 'An F₂ of {nD} tall plants shows a ratio of {r} tall per dwarf. How many dwarf plants were there?'
      }
    },
    {
      name: 'Chance that a heterozygote shows no recessive offspring',
      expr: 'P = 0.75^n', tex: 'P = \\left(\\tfrac34\\right)^{n}',
      vars: {
        P: { name: 'chance of no recessive offspring', q: 'ratio', unit: '%' },
        n: { name: 'offspring examined', q: 'count', value: 10, int: true }
      },
      note: 'Each offspring of Aa × Aa (or of a selfed Aa) shows the recessive trait with chance ¼, independently. Mendel judged many F₂ plants on 10 offspring each, so about 5.6 % of heterozygotes would have looked true-breeding.',
      stories: {
        P: 'A dominant-looking plant is scored by selfing it and raising {n} offspring. If it is really heterozygous, what is the chance that none of them shows the recessive trait?',
        n: 'How many offspring must be raised so that a heterozygote is missed with a chance of only {P}?'
      }
    }
  ],
  examples: [
    {
      title: 'Predicting an F₂',
      q: 'An F₁ plant $Rr$ is selfed and sets 800 seeds. How many round and wrinkled seeds do you expect, and how many of the round ones are heterozygous?',
      steps: [
        'Segregation gives $\\tfrac14 RR$, $\\tfrac12 Rr$, $\\tfrac14 rr$.',
        'Round: $\\tfrac34 \\times 800 = 600$; wrinkled: $\\tfrac14 \\times 800 = 200$.',
        'Of the 600 round seeds, $Rr$ make up $\\tfrac{1/2}{3/4} = \\tfrac23$, about 400; about 200 are $RR$.'
      ],
      a: 'About 600 round (≈ 200 RR and 400 Rr) and 200 wrinkled.'
    },
    {
      title: 'Mendel\'s progeny test and Fisher\'s objection',
      q: 'For traits of the whole plant, Mendel classified each dominant-looking F₂ plant by raising 10 of its offspring: if all 10 were dominant he called it true-breeding. How often would a heterozygote be misclassified, and what ratio of true-breeding to segregating plants should he then have seen?',
      steps: [
        'A heterozygote gives a recessive offspring with chance ¼, so all 10 are dominant with chance $0.75^{10} = 0.056$.',
        'Of 600 dominant F₂ plants, 200 are $AA$ and 400 are $Aa$; about $0.056 \\times 400 = 23$ heterozygotes would be scored as true-breeding.',
        'The expected split is then $223 : 377$, or $1 : 1.69$ — not $1 : 2$.',
        'Mendel\'s reported numbers sit close to 1 : 2. In 1936 R. A. Fisher used this and other comparisons to argue that the data fit the theory too well. Suggested explanations range from an assistant\'s bias to Mendel reporting his best experiments; the argument is not settled.'
      ],
      a: 'About 5.6 % of heterozygotes are missed, so the expected ratio is about 1 : 1.7 rather than 1 : 2.'
    }
  ],
  quiz: [
    { q: 'True-breeding tall peas are crossed with dwarf ones and all the F₁ are tall. What fraction of the F₂ will be dwarf?', choices: ['none', '1/4', '1/2', '3/4'], a: 1, why: 'The F₁ are $Tt$; selfing gives ¼ $TT$, ½ $Tt$ and ¼ $tt$, and only $tt$ is dwarf.' },
    { q: 'A round F₂ pea is picked at random from a monohybrid F₂. What is the chance that it is heterozygous?', choices: ['1/4', '1/3', '1/2', '2/3'], a: 3, why: 'Among the round plants $RR : Rr = 1 : 2$, so two-thirds are $Rr$. Knowing the seed is round removes the $rr$ quarter from the count.' },
    { q: 'In the F₁ of round × wrinkled, the wrinkled allele is lost for good.', a: false, why: 'It is present in every F₁ plant ($Rr$) but masked by the dominant allele; it reappears unchanged in a quarter of the F₂.' },
    { q: 'Which event in meiosis is the physical basis of the law of segregation?', choices: ['DNA replication before meiosis', 'separation of homologous chromosomes at anaphase I', 'crossing over in prophase I', 'cytokinesis at the end of meiosis II'], a: 1, why: 'The two alleles of a gene sit on the two homologues, and homologues part at anaphase I. Crossing over mixes alleles of different genes; it does not separate the two alleles of one gene.' },
    { q: 'A plant with the dominant phenotype is crossed with a homozygous recessive and gives 38 dominant and 41 recessive offspring. What was its genotype?', choices: ['homozygous dominant', 'heterozygous', 'homozygous recessive', 'cannot be told'], a: 1, why: 'A test cross of $AA$ gives only dominant offspring; a roughly 1 : 1 split means the parent made $A$ and $a$ gametes equally — it was $Aa$.' }
  ],
  problems: [
    { q: 'An F₁ heterozygote is selfed and gives 1 200 seeds. How many are expected to show the recessive trait?', answer: 300, tol: 0.01, steps: ['A quarter of the F₂ is homozygous recessive: $1200/4 = 300$.'] },
    { q: 'A round F₂ plant is scored by growing 5 of its offspring. If it is really $Rr$, what is the chance that all five are round, so the plant looks true-breeding?', answer: 23.7, unit: '%', tol: 0.02, steps: ['Each offspring is round with chance ¾, independently.', '$0.75^5 = 0.237$, about 24 %: five offspring are far too few for a reliable test.'] }
  ],
  applications: [
    'Plant and animal breeding: fixing a trait in a true-breeding line, and producing uniform F₁ hybrid seed from two true-breeding parents.',
    'Predicting the chance that a child inherits a single-gene condition — the starting point of genetic counselling (see [[human-genetics]]).',
    'Finding carriers of recessive alleles in breeding programmes for dogs, cattle and crops, once by test crosses and now by DNA tests.'
  ],
  history: 'Mendel presented his results to the Natural History Society of Brünn in February and March 1865 and published them in 1866 as "Experiments on plant hybrids". Few read the paper and fewer understood it; Mendel became abbot in 1868 and died in 1884. In 1900 Hugo de Vries, Carl Correns and Erich von Tschermak reached similar results and found his paper. William Bateson championed it and coined the word "genetics" in 1905; Wilhelm Johannsen coined "gene" in 1909.',
  sim: [{ id: 'gen-peas', params: { exp: 'mono' } }, 'gen-punnett']
},

{
  id: 'punnett-squares', parent: 'mendelian', title: 'Punnett squares and probability', level: 1,
  short: 'A Punnett square lists the gametes of two parents along its edges and the offspring they make in its cells; because every cell is equally likely, counting cells gives probabilities. Behind it are two rules — multiply for "and", add for "or" — which handle crosses of many genes and whole families.',
  keywords: ['Punnett square', 'probability', 'product rule', 'sum rule', 'test cross', 'monohybrid', 'branch diagram', 'forked-line method', 'binomial', 'conditional probability', 'genotype ratio', 'phenotype ratio'],
  prereq: ['mendels-laws', 'math:probability-basics'],
  related: ['dihybrid-crosses', 'pedigrees', 'chi-square-genetics', 'hardy-weinberg', 'math:binomial-distribution', 'math:conditional-probability'],
  body: `
A Punnett square is bookkeeping for the law of segregation. Write the gametes one parent can make along the top, those of the other down the side, and fill each cell with the zygote their union makes. A heterozygote makes each kind of gamete equally often and gametes meet at random, so **every cell is equally likely** and counting cells gives probabilities. For two heterozygotes, $Aa \\times Aa$:

| | $A$ (½) | $a$ (½) |
|---|---|---|
| $A$ (½) | $AA$ (¼) | $Aa$ (¼) |
| $a$ (½) | $Aa$ (¼) | $aa$ (¼) |

The genotypes come out $1\\,AA : 2\\,Aa : 1\\,aa$ and, with $A$ dominant, the phenotypes $3 : 1$. A **test cross** — an individual of dominant phenotype crossed with a homozygous recessive — shows what it carries: $AA \\times aa$ gives only dominant offspring, $Aa \\times aa$ half and half.

### Two rules behind the square
- **Product rule** (*and*): the chance that independent events all happen is the product of their chances. An $aa$ zygote needs an $a$ egg *and* an $a$ sperm: $\\tfrac12 \\times \\tfrac12 = \\tfrac14$.
- **Sum rule** (*or*): the chance that one of several mutually exclusive events happens is the sum of their chances. A heterozygote comes from an $A$ egg with an $a$ sperm *or* an $a$ egg with an $A$ sperm: $\\tfrac14 + \\tfrac14 = \\tfrac12$.

With these you seldom need a big square. For $AaBbCc \\times AaBbcc$ the chance of an $aa\\,B\\text{–}\\,cc$ offspring is $\\tfrac14 \\times \\tfrac34 \\times \\tfrac12 = \\tfrac{3}{32}$ — one line instead of a 32-cell grid. This **branch** (forked-line) method works whenever the genes assort independently.

### Conditional probability
What we already know narrows the possibilities. A child of $Aa \\times Aa$ who shows the dominant trait is $AA$ or $Aa$; the $aa$ quarter is ruled out, so the chance of being a carrier is $\\tfrac{2/4}{3/4} = \\tfrac23$, not ½. This two-thirds appears again and again in [[pedigrees]].

### Families: the binomial
Each child is a fresh draw, whatever came before — chance has no memory. The number of children with a trait in a family of $n$ follows the **binomial distribution**. For two carriers of a recessive allele (chance $\\tfrac14$ per child) with four children:

| Affected children | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Probability | 0.316 | 0.422 | 0.211 | 0.047 | 0.004 |

"One in four" is a chance per child, not a quota: about a third of such families of four have no affected child, and one in five has two.

> [!tip] Use the square for one or two genes, the product rule for more, and the binomial for several offspring. The [genetics calculators](#/tools/genetics) do the arithmetic for your own crosses.

Every Punnett square assumes that alleles segregate fairly, that all gametes are equally able to fertilise, and that all zygotes survive. When a real cross departs from its prediction, one of these has failed — a lethal genotype, linkage, or plain chance — and a [[chi-square-genetics|chi-square test]] helps decide which.
`,
  ideas: [
    'Each cell of a Punnett square is equally likely because gametes are made in equal numbers and meet at random.',
    'Multiply the chances of independent events that must all happen; add the chances of mutually exclusive alternatives.',
    'For many genes, multiply the per-gene chances (branch method) instead of drawing a huge square.',
    'A dominant-looking offspring of two heterozygotes is a carrier with chance 2/3.',
    'Each child is an independent draw; family outcomes follow the binomial distribution.'
  ],
  pitfalls: [
    'After three affected children, the next is less likely to be affected — Each conception is independent, so the chance is the same ¼ every time. Chance has no memory.',
    'A Punnett square tells you how many offspring of each kind there will be — It gives probabilities. Small crosses and real families often depart from the ratio; only large numbers approach it.',
    'Adding the chances of events that must all happen — The sum rule is for mutually exclusive alternatives ("or"); for independent events that must all occur ("and"), multiply.'
  ],
  formulas: [
    {
      name: 'Product rule for independent events',
      expr: 'P = PA*PB', tex: 'P = P_A \\cdot P_B',
      vars: {
        P: { name: 'chance that both happen', q: 'ratio', unit: '%' },
        PA: { name: 'chance of the first event', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: 'P_A' },
        PB: { name: 'chance of the second event', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: 'P_B' }
      },
      note: 'Extend it to any number of independent events: the chance that an AaBbCc selfing gives aabbcc is ¼ · ¼ · ¼ = 1/64.',
      stories: {
        P: 'The egg carries the recessive allele with chance {PA} and the sperm with chance {PB}. What is the chance of a homozygous recessive zygote?',
        PB: 'A zygote is homozygous recessive with chance {P}; the egg carries the recessive allele with chance {PA}. What is the chance for the sperm?'
      }
    },
    {
      name: 'Binomial: exactly k of n offspring',
      expr: 'P = fact(n)/(fact(k)*fact(n - k))*p^k*(1 - p)^(n - k)', tex: 'P = \\dfrac{n!}{k!\\,(n-k)!}\\,p^{k}\\,(1-p)^{n-k}',
      vars: {
        P: { name: 'chance of exactly k', q: 'ratio', unit: '%' },
        n: { name: 'number of offspring', q: 'count', value: 4, int: true },
        k: { name: 'offspring with the trait', q: 'count', value: 2, int: true },
        p: { name: 'chance per offspring', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 }
      },
      note: 'Assumes each offspring is independent with the same chance p. The fraction n!/(k!(n−k)!) counts the birth orders that give k.',
      practice: { unknowns: ['P'] },
      stories: {
        P: 'Two carriers of a recessive allele have {n} children, each with a chance {p} of being affected. What is the chance that exactly {k} of them are affected?'
      }
    },
    {
      name: 'Chance of at least one',
      expr: 'P = 1 - (1 - p)^n', tex: 'P = 1 - (1 - p)^{n}',
      vars: {
        P: { name: 'chance of at least one', q: 'ratio', unit: '%' },
        p: { name: 'chance per offspring', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 },
        n: { name: 'number of offspring', q: 'count', value: 3, int: true }
      },
      note: 'The complement of "none": (1 − p)ⁿ is the chance that every one of n independent trials misses.',
      stories: {
        P: 'Each child of a couple has a chance {p} of inheriting a recessive condition. What is the chance that at least one of {n} children inherits it?',
        n: 'Each offspring shows a trait with chance {p}. How many offspring are needed for a {P} chance of seeing it at least once?'
      }
    }
  ],
  examples: [
    {
      title: 'A test cross with guinea pigs',
      q: 'Black coat ($B$) is dominant to white ($b$) in guinea pigs. A black male mated with white females sires 9 pups, all black. How sure can you be that he is $BB$?',
      steps: [
        'If he were $Bb$, each pup would be white with chance ½, independently.',
        'The chance of 9 black pups from a $Bb$ father is $0.5^9 = 0.002$.',
        'So the data would be very unlikely if he were a carrier: he is almost certainly $BB$. One white pup would prove him $Bb$ at once.'
      ],
      a: 'A heterozygote would give 9 black pups only 0.2 % of the time, so he is very probably BB.'
    },
    {
      title: 'Three genes in one line',
      q: 'Two plants $AaBbCc$ are crossed (independent genes, full dominance). Find the chance of an $aabbcc$ offspring, of one showing all three dominant traits, and of one that is $AaBbCc$ like its parents.',
      steps: [
        '$aabbcc$: $\\tfrac14\\cdot\\tfrac14\\cdot\\tfrac14 = \\tfrac{1}{64}$.',
        'All three dominant: $\\tfrac34\\cdot\\tfrac34\\cdot\\tfrac34 = \\tfrac{27}{64} = 0.42$.',
        '$AaBbCc$: each gene is heterozygous with chance ½, so $\\left(\\tfrac12\\right)^3 = \\tfrac18$.'
      ],
      a: '1/64, 27/64 and 1/8.'
    },
    {
      title: 'A family of three',
      q: 'Two carriers of a recessive allele have three children. What is the chance that none, exactly one, and at least one is affected?',
      steps: [
        'None: $(3/4)^3 = 0.422$.',
        'Exactly one: three birth orders, each $\\tfrac14\\cdot\\left(\\tfrac34\\right)^2$, so $3 \\times 0.1406 = 0.422$.',
        'At least one: $1 - 0.422 = 0.578$.'
      ],
      a: '42 % none, 42 % exactly one, 58 % at least one.'
    }
  ],
  quiz: [
    { q: 'Two heterozygotes have had three children, all with the recessive trait. What is the chance that their fourth child has it too?', choices: ['1/4', '1/64', '1/256', 'almost zero'], a: 0, why: 'Each conception is an independent draw: ¼, whatever happened before. The 1/256 is the chance of four in a row judged before any were born.' },
    { q: 'What is the probability that $AaBb \\times AaBb$ gives an $AABB$ offspring?', choices: ['1/4', '1/8', '1/16', '9/16'], a: 2, why: '$P(AA) \\cdot P(BB) = \\tfrac14 \\cdot \\tfrac14 = \\tfrac{1}{16}$. The 9/16 is the chance of showing both dominant traits, which includes four genotypes.' },
    { q: 'A child of $Aa \\times Aa$ shows the dominant trait. What is the chance, in per cent, that the child is heterozygous?', answer: 66.7, unit: '%', why: 'Given dominant, the possibilities are $AA$ (¼) and $Aa$ (½): $\\tfrac{1/2}{3/4} = \\tfrac23 \\approx 66.7\\,\\%$.' },
    { q: 'The sum rule gives the chance that two independent events both happen.', a: false, why: 'That is the product rule. The sum rule adds the chances of alternatives that cannot happen together.' },
    { q: 'How many cells does a Punnett square for $AaBbCc \\times AaBbCc$ have?', answer: 64, why: 'Each parent makes $2^3 = 8$ kinds of gamete, so the square is 8 × 8 = 64 cells.' }
  ],
  problems: [
    { q: 'Two heterozygotes $Aa$ have four children. What is the chance that all four show the dominant phenotype?', answer: 0.316, tol: 0.02, steps: ['Each child is dominant with chance ¾.', '$0.75^4 = 0.316$.'] },
    { q: 'What fraction of the offspring of $AaBbCcDd \\times AaBbCcDd$ is $aabbccdd$?', answer: 0.00390625, tol: 0.02, steps: ['$\\left(\\tfrac14\\right)^4 = \\tfrac{1}{256} = 0.0039$.'] }
  ],
  applications: [
    'Cross any two genotypes of up to four genes in [the cross calculator](#/tools/genetics/cross).',
    'Genetic counselling: the chance that a child of two carriers inherits a recessive condition, and the chance for relatives.',
    'Breeding: estimating how many offspring must be raised to find one with a wanted combination of alleles.',
    'Checking experiments: the expected counts from a Punnett square are the "E" in a chi-square test.'
  ],
  history: 'Reginald Punnett, a Cambridge geneticist who worked with William Bateson, introduced the square in the first decade of the twentieth century as a teaching aid. Punnett also has a place in the story of [[hardy-weinberg|Hardy–Weinberg equilibrium]]: in 1908 he took to his colleague and fellow cricketer, the mathematician G. H. Hardy, the question of why a dominant allele does not spread until three-quarters of a population show it, and Hardy wrote down the answer.',
  sim: 'gen-punnett'
},

{
  id: 'dihybrid-crosses', parent: 'mendelian', title: 'Dihybrid crosses and independent assortment', level: 2,
  short: 'Following two genes at once, Mendel found the ratio 9 : 3 : 3 : 1: the alleles of one gene go into gametes independently of those of another, so the chances multiply. Genes that interact give modified ratios such as 9 : 3 : 4 and 9 : 7; genes on the same chromosome break the rule altogether.',
  keywords: ['dihybrid cross', '9:3:3:1', 'independent assortment', 'recombinant phenotype', 'dihybrid test cross', '1:1:1:1', 'trihybrid', 'branch method', 'epistasis', '9:3:4', '9:7', '15:1', '12:3:1', 'Labrador coat colour'],
  prereq: ['mendels-laws', 'punnett-squares'],
  related: ['meiosis', 'linkage-mapping', 'chi-square-genetics', 'polygenic-traits', 'dominance-types'],
  body: `
Mendel's second law came from following two traits at once. He crossed a true-breeding line with round yellow seeds ($RRYY$) with one whose seeds were wrinkled and green ($rryy$). The F₁ were all round and yellow, $RrYy$ — a **dihybrid**, heterozygous at two genes. Selfing them gave 556 F₂ seeds:

| F₂ phenotype | Observed | Expected 9 : 3 : 3 : 1 |
|---|---|---|
| round yellow | 315 | 312.75 |
| round green | 108 | 104.25 |
| wrinkled yellow | 101 | 104.25 |
| wrinkled green | 32 | 34.75 |

Two classes, round green and wrinkled yellow, were combinations that neither grandparent had shown — **recombinant** phenotypes. And each trait on its own still gave 3 : 1 (423 round : 133 wrinkled, 416 yellow : 140 green): one gene had not disturbed the other.

### Why 9 : 3 : 3 : 1
If the two genes assort independently, the F₁ makes four kinds of gamete — $RY$, $Ry$, $rY$ and $ry$ — a quarter each. A 4 × 4 Punnett square has 16 equally likely cells holding 9 genotypes and, with dominance at both genes, 4 phenotypes. The product rule gets there in one line: a seed is round with chance ¾ and, independently, yellow with chance ¾, so

$$P(\\text{round, yellow}) = \\tfrac34\\cdot\\tfrac34 = \\tfrac{9}{16},\\qquad P(\\text{round, green}) = \\tfrac34\\cdot\\tfrac14 = \\tfrac{3}{16},\\qquad P(\\text{wrinkled, green}) = \\tfrac14\\cdot\\tfrac14 = \\tfrac{1}{16}.$$

The **dihybrid test cross** $RrYy \\times rryy$ shows the four gametes directly: the offspring come 1 : 1 : 1 : 1.

### More genes
Each extra heterozygous gene doubles the kinds of gamete and multiplies the square by four:

| Heterozygous genes | Gamete types | Punnett cells | F₂ genotypes | F₂ phenotypes (full dominance) |
|---|---|---|---|---|
| 1 | 2 | 4 | 3 | 2 |
| 2 | 4 | 16 | 9 | 4 |
| 3 | 8 | 64 | 27 | 8 |
| $n$ | $2^n$ | $4^n$ | $3^n$ | $2^n$ |

For all seven of Mendel's traits a square would need 16 384 cells; the product rule needs seven fractions. As $n$ grows and the genes add to one trait, the classes merge into a bell curve — the route to [[polygenic-traits]].

### When genes interact: epistasis
9 : 3 : 3 : 1 assumes each gene controls its own trait. When two genes act on the same trait, the sixteenths are still there but some classes look alike — **epistasis** gives modified ratios:

| Ratio | Kind | Example |
|---|---|---|
| 9 : 3 : 4 | recessive epistasis | Labrador coat: $ee$ dogs are yellow whatever their $B$ gene; black is $B\\text{–}E\\text{–}$, chocolate $bb\\,E\\text{–}$ |
| 9 : 7 | complementary genes | sweet-pea flowers are purple only with a working allele of both of two pathway genes |
| 12 : 3 : 1 | dominant epistasis | summer-squash fruit: white, yellow, green |
| 15 : 1 | duplicate genes | shepherd's-purse seed capsules: triangular unless both genes are homozygous recessive |

A ratio in sixteenths is itself a clue that two independently assorting genes are at work, and which kind of ratio tells how their products are connected in a pathway.

### The limits of independence
Independent assortment is the random orientation of different chromosome pairs at metaphase I of [[meiosis]]. Genes on the same chromosome can break it: in 1905 Bateson and Punnett crossed sweet peas and found far too many parental combinations and far too few new ones — the first case of **linkage** ([[linkage-mapping]]). Several of Mendel's seven genes share a chromosome, but the pairs he reported lie on different chromosomes or far enough apart to assort almost freely.
`,
  ideas: [
    'A dihybrid F₁ makes four kinds of gamete in equal numbers when its genes assort independently.',
    'The F₂ phenotypes come 9 : 3 : 3 : 1 because the chances for the two genes multiply: (3 : 1) × (3 : 1).',
    'The dihybrid test cross gives 1 : 1 : 1 : 1 and shows the gametes directly.',
    'With n independent heterozygous genes: 2ⁿ gametes, 3ⁿ genotypes and 4ⁿ Punnett cells.',
    'Interacting genes give modified ratios in sixteenths (9 : 3 : 4, 9 : 7, 12 : 3 : 1, 15 : 1); linked genes depart from independence.'
  ],
  pitfalls: [
    'The 9 : 3 : 3 : 1 classes are four genotypes — They are phenotypes. The F₂ has nine genotypes; the "9" class alone contains four of them (AABB, AABb, AaBB, AaBb).',
    'A new combination of traits in the F₂ needs a new mutation — Round green and wrinkled yellow seeds are recombinant phenotypes: old alleles in new combinations, produced by independent assortment.',
    'Any departure from 9 : 3 : 3 : 1 overturns Mendel — Epistasis, linkage and lethal genotypes give other ratios for good reasons, and chance gives small deviations; a chi-square test separates them.'
  ],
  formulas: [
    {
      name: 'Kinds of gamete from n heterozygous genes',
      expr: 'G = 2^n', tex: 'G = 2^{n}',
      vars: {
        G: { name: 'kinds of gamete', q: 'count' },
        n: { name: 'heterozygous, independently assorting genes', q: 'count', value: 3, int: true }
      },
      note: 'The Punnett square for a selfing then has G × G = 4ⁿ cells, holding 3ⁿ genotypes.',
      stories: { G: 'How many kinds of gamete does a plant heterozygous at {n} unlinked genes produce?', n: 'A plant makes {G} kinds of gamete. At how many unlinked genes is it heterozygous?' }
    },
    {
      name: 'Fraction of the F₂ showing every dominant trait',
      expr: 'fdom = 0.75^n', tex: 'f_{dom} = \\left(\\tfrac34\\right)^{n}',
      vars: {
        fdom: { name: 'fraction with all n dominant phenotypes', q: 'ratio', unit: '%', tex: 'f_{dom}' },
        n: { name: 'heterozygous, independently assorting genes', q: 'count', value: 2, int: true }
      },
      note: 'Selfing a plant heterozygous at n unlinked genes with full dominance at each: 9/16 for two genes, 27/64 for three.',
      stories: { fdom: 'A plant heterozygous at {n} unlinked genes is selfed. What fraction of the offspring shows all the dominant traits?' }
    },
    {
      name: 'Fraction of the F₂ recessive for every gene',
      expr: 'frec = 0.25^n', tex: 'f_{rec} = \\left(\\tfrac14\\right)^{n}',
      vars: {
        frec: { name: 'fraction homozygous recessive at all n genes', q: 'ratio', unit: '%', tex: 'f_{rec}' },
        n: { name: 'heterozygous, independently assorting genes', q: 'count', value: 2, int: true }
      },
      note: 'Why breeders need large F₂ populations: with 5 genes only 1 plant in 1 024 is recessive at all of them.',
      stories: {
        frec: 'A breeder selfs a plant heterozygous at {n} unlinked genes and wants the plant recessive at all of them. What fraction of the F₂ is that?',
        n: 'Only {frec} of an F₂ is recessive at every gene. How many unlinked heterozygous genes does the F₁ have?'
      }
    }
  ],
  examples: [
    {
      title: 'Mendel\'s two-gene count, predicted',
      q: 'For 556 F₂ seeds from $RrYy$ selfed, find the expected numbers in each class and compare them with Mendel\'s 315 : 108 : 101 : 32.',
      steps: [
        '$556 \\times \\tfrac{9}{16} = 312.75$; $556 \\times \\tfrac{3}{16} = 104.25$ (twice); $556 \\times \\tfrac{1}{16} = 34.75$.',
        'The deviations are +2.25, +3.75, −3.25 and −2.75 seeds — small. A chi-square test gives $\\chi^2 = 0.47$ with 3 degrees of freedom, $p = 0.93$ ([[chi-square-genetics]]).'
      ],
      a: 'Expected 312.75 : 104.25 : 104.25 : 34.75 — an excellent fit.'
    },
    {
      title: 'Three genes by the branch method',
      q: 'A plant $AaBbCc$ is selfed (independent genes, full dominance). What fraction of the offspring is $A\\text{–}B\\text{–}cc$, and what fraction shows exactly two of the three dominant traits?',
      steps: [
        '$A\\text{–}B\\text{–}cc$: $\\tfrac34\\cdot\\tfrac34\\cdot\\tfrac14 = \\tfrac{9}{64}$.',
        'Exactly two dominant: the recessive one can be any of the three genes, each case $\\tfrac{9}{64}$, so $3 \\times \\tfrac{9}{64} = \\tfrac{27}{64} = 0.42$.'
      ],
      a: '9/64 and 27/64.'
    },
    {
      title: 'Labrador puppies',
      q: 'Two black Labradors, both $BbEe$, have 16 puppies. How many of each colour would you expect?',
      steps: [
        'Black needs $B\\text{–}E\\text{–}$: $\\tfrac{9}{16}$ → 9 puppies.',
        'Chocolate is $bb\\,E\\text{–}$: $\\tfrac14\\cdot\\tfrac34 = \\tfrac{3}{16}$ → 3 puppies.',
        'Yellow is any $ee$, whatever $B$: $\\tfrac14 = \\tfrac{4}{16}$ → 4 puppies. The 9 : 3 : 3 : 1 has become 9 : 3 : 4.'
      ],
      a: 'About 9 black, 3 chocolate and 4 yellow — though a real litter of 16 would vary.'
    }
  ],
  quiz: [
    { q: 'What ratio does the dihybrid test cross $AaBb \\times aabb$ give for two unlinked genes?', choices: ['9 : 3 : 3 : 1', '1 : 1 : 1 : 1', '3 : 1', '1 : 2 : 1'], a: 1, why: 'The dihybrid makes $AB$, $Ab$, $aB$ and $ab$ gametes equally; the $aabb$ parent adds only $ab$, so each gamete type becomes its own phenotype.' },
    { q: 'In $AaBb \\times AaBb$, what fraction of the offspring is recessive for gene A but dominant for gene B?', choices: ['1/16', '3/16', '9/16', '1/4'], a: 1, why: '$P(aa) \\cdot P(B\\text{–}) = \\tfrac14 \\cdot \\tfrac34 = \\tfrac{3}{16}$.' },
    { q: 'How many kinds of gamete does an $AaBbCcDd$ individual make if all four genes are on different chromosomes?', answer: 16, why: '$2^4 = 16$: each gene contributes a factor of two.' },
    { q: 'A dihybrid F₂ gives 9 purple : 7 white. The best explanation is…', choices: ['one gene with incomplete dominance', 'two genes whose products are both needed for colour', 'tight linkage between two genes', 'a recessive lethal allele'], a: 1, why: 'Only $A\\text{–}B\\text{–}$ (9/16) is coloured; lacking either working allele (3 + 3 + 1 = 7/16) gives white — complementary genes in one pathway.' },
    { q: 'Independent assortment holds for every pair of genes in an organism.', a: false, why: 'It holds for genes on different chromosomes, or far apart on one. Genes close together on a chromosome are linked and travel together unless crossing over separates them.' }
  ],
  problems: [
    { q: 'An $RrYy$ pea is selfed and yields 1 600 seeds. How many are expected to be wrinkled and green?', answer: 100, tol: 0.01, steps: ['$rryy$ is $\\tfrac{1}{16}$ of the F₂.', '$1600/16 = 100$.'] },
    { q: 'What fraction of the offspring of $AaBbCc \\times AaBbCc$ shows all three dominant traits (unlinked genes, full dominance)?', answer: 0.421875, tol: 0.02, steps: ['$\\left(\\tfrac34\\right)^3 = \\tfrac{27}{64} = 0.422$.'] }
  ],
  applications: [
    'Build the 16-cell square and test your counts against 9:3:3:1 in [the cross calculator](#/tools/genetics/cross).',
    'Plant breeding: combining disease resistance from one variety with yield from another, and sizing the F₂ needed to find the rare plant with both.',
    'Dog, cat and livestock breeders predict coat colours with two-gene models such as the Labrador B and E genes.',
    'Modified ratios reveal biochemical pathways: a 9 : 7 means two steps that are both needed; a 9 : 3 : 4 means one gene acts before the other.'
  ],
  history: 'Mendel reported the round-yellow by wrinkled-green cross, and a three-gene cross, in his 1866 paper. Bateson and Punnett\'s sweet-pea experiments of 1904–1905 supplied both the 9 : 7 ratio of complementary genes and the first hint of linkage, which Thomas Hunt Morgan explained in 1911 as genes lying together on one chromosome.',
  sim: [{ id: 'gen-punnett', params: { loci: 2 } }, { id: 'gen-peas', params: { exp: 'di' } }]
},

{
  id: 'dominance-types', parent: 'mendelian', title: 'Incomplete dominance and codominance', level: 2,
  short: 'Not every heterozygote looks like one of its parents. In incomplete dominance it is intermediate (red × white snapdragons give pink, and the F₂ comes 1 : 2 : 1); in codominance it shows both forms fully (blood group AB, roan cattle). Whether an allele is dominant depends on which trait you measure.',
  keywords: ['incomplete dominance', 'codominance', 'complete dominance', 'snapdragon', 'pink flowers', '1:2:1', 'roan', 'MN blood group', 'sickle-cell trait', 'overdominance', 'heterozygote advantage', 'lethal allele', 'yellow mice', '2:1 ratio', 'degree of dominance'],
  prereq: ['mendels-laws', 'punnett-squares', 'protein-structure'],
  related: ['multiple-alleles', 'human-genetics', 'natural-selection', 'dihybrid-crosses', 'enzymes', 'medicine:anemia'],
  body: `
Dominance is not a property of an allele on its own but of a pair of alleles in a heterozygote — and of the trait you choose to measure. Mendel's seven traits all showed **complete dominance**: the heterozygote looked exactly like one homozygote. That is usual when one working copy of a gene makes enough product for the full effect. The pea's round allele gives the heterozygote half the normal starch-branching enzyme, and half is plenty.

### Incomplete dominance
Snapdragons (*Antirrhinum majus*) with red flowers crossed with white ones give F₁ plants with **pink** flowers. Selfing the pink F₁ gives

$$\\tfrac14\\ \\text{red} : \\tfrac12\\ \\text{pink} : \\tfrac14\\ \\text{white}$$

— the 1 : 2 : 1 genotype ratio appears directly, because every genotype looks different. The red allele encodes an enzyme of the anthocyanin pathway, and one copy makes roughly half the pigment. Nothing has blended: the F₂ contains pure red and pure white again. Four-o'clock flowers, palomino horses (one copy of the cream allele on a chestnut coat) and "blue" Andalusian fowl (black × white) behave the same way.

### Codominance
In **codominance** the heterozygote shows *both* parental forms in full, side by side. People with blood group MN carry both the M and the N version of a red-cell surface protein; people of group AB carry both the A and the B sugar ([[multiple-alleles]]). A roan cow has red hairs and white hairs mixed, not pink ones. On a gel, the haemoglobin of a carrier of the sickle-cell allele runs as two bands, HbA and HbS.

### It depends on what you measure
The sickle-cell allele of the β-globin gene shows every kind of dominance at once:

| Level observed | Heterozygote (sickle-cell trait) | Relationship |
|---|---|---|
| sickle cell disease | usually healthy | the allele is **recessive** |
| haemoglobin molecules | both HbA and HbS | **codominant** |
| red cells under very low oxygen | some cells sickle | roughly **incomplete** |
| survival where malaria is common | better than either homozygote | **overdominant** (heterozygote advantage) |

Tay–Sachs disease is similar: carriers are healthy (the allele is recessive for the disease), but their cells have about half the normal activity of the enzyme hexosaminidase A (incomplete dominance at the level of the enzyme) — which is how carrier screening, begun in 1971, identified them.

### Lethal alleles
In 1905 Lucien Cuénot crossed yellow mice with each other and got 2 yellow : 1 non-yellow — never 3 : 1, and never a yellow mouse that bred true. The yellow allele $A^Y$ is dominant for coat colour but recessive for a lethal effect: $A^YA^Y$ embryos die early, so of the expected $1 : 2 : 1$ only the $2 : 1$ is born, and litters are a quarter smaller. The tailless Manx cat shows the same pattern.

> [!key] "Dominant" and "recessive" describe what a heterozygote looks like for a particular trait. One allele can be dominant for one effect and recessive for another; what decides it is how much of the gene's product the trait needs.

### A number for dominance
Quantitative geneticists place the heterozygote on a scale between the homozygotes. The **degree of dominance** $h$ is 0 when $Aa$ looks like $aa$, ½ when it is exactly intermediate (the effects are additive), 1 for complete dominance of $A$, and above 1 for overdominance. The same $h$ decides how fast [[natural-selection]] can act: a rare advantageous allele that is recessive ($h$ near 0) is almost invisible to selection, because it sits in heterozygotes.
`,
  ideas: [
    'Dominance is a relation between two alleles in a heterozygote, for a particular trait.',
    'Incomplete dominance: the heterozygote is intermediate, and the F₂ shows the genotype ratio 1 : 2 : 1 directly.',
    'Codominance: the heterozygote shows both parental forms fully (AB and MN blood groups, roan coats).',
    'The same allele can be recessive, codominant or overdominant depending on the level observed — sickle-cell haemoglobin is the classic case.',
    'A recessive lethal allele turns an expected 3 : 1 into 2 : 1 among the offspring that are born.'
  ],
  pitfalls: [
    'Incomplete dominance is blending inheritance — The F₂ gets back pure red and pure white; the alleles stay separate, and only their products add up in the heterozygote.',
    'Codominance and incomplete dominance are the same thing — In incomplete dominance the heterozygote is intermediate (pink); in codominance it shows both parental forms in full (both M and N proteins; red and white hairs).',
    'A recessive allele does nothing in a heterozygote — Often it is inactive, but carriers can have half the normal enzyme, and some "recessive" alleles have effects of their own in heterozygotes, such as sickling under very low oxygen.'
  ],
  formulas: [
    {
      name: 'Degree of dominance',
      expr: 'h = (Phet - Paa)/(PAA - Paa)', tex: 'h = \\dfrac{P_{Aa} - P_{aa}}{P_{AA} - P_{aa}}',
      vars: {
        h: { name: 'degree of dominance of allele A', signed: true },
        Phet: { name: 'phenotype of the heterozygote Aa', q: false, unit: 'mg/g', value: 1.05, tex: 'P_{Aa}' },
        PAA: { name: 'phenotype of the homozygote AA', q: false, unit: 'mg/g', value: 2.0, tex: 'P_{AA}' },
        Paa: { name: 'phenotype of the homozygote aa', q: false, unit: 'mg/g', value: 0.1, tex: 'P_{aa}' }
      },
      note: 'Any measured trait will do (pigment per gram of petal, enzyme activity, height). h = 0: A recessive; ½: additive or incomplete dominance; 1: A completely dominant; above 1: overdominance; below 0: underdominance.',
      practice: { unknowns: ['h', 'Phet'] },
      stories: {
        h: 'Red snapdragon petals hold {PAA} of anthocyanin, white ones {Paa} and pink heterozygotes {Phet}. What is the degree of dominance of the red allele?',
        Phet: 'Homozygotes have {PAA} and {Paa} of a pigment, and the red allele has a degree of dominance of {h}. How much pigment does the heterozygote have?'
      }
    }
  ],
  examples: [
    {
      title: 'Snapdragon crosses',
      q: 'Pink snapdragons ($C^RC^W$) are selfed and 200 offspring raised; then a pink plant is crossed with a white one. What do you expect?',
      steps: [
        'Pink × pink: $\\tfrac14\\,C^RC^R$ red, $\\tfrac12\\,C^RC^W$ pink, $\\tfrac14\\,C^WC^W$ white → 50 red, 100 pink, 50 white.',
        'Pink × white: the white parent gives only $C^W$, so the offspring are $\\tfrac12$ pink and $\\tfrac12$ white.',
        'No true-breeding pink line can ever be made: pink is always a heterozygote.'
      ],
      a: '50 : 100 : 50 from pink × pink; 1 pink : 1 white from pink × white.'
    },
    {
      title: 'Yellow mice',
      q: 'Mice normally have litters of about 8. What do you expect from yellow × yellow ($A^Ya \\times A^Ya$)?',
      steps: [
        'Conceptions: $\\tfrac14\\,A^YA^Y$ (die as embryos), $\\tfrac12\\,A^Ya$ (yellow), $\\tfrac14\\,aa$ (not yellow).',
        'Of 8 conceptions about 2 are lost, leaving about 6 pups: 4 yellow and 2 non-yellow.',
        'Among the pups born, yellow : non-yellow = 2 : 1, and every yellow pup is a heterozygote.'
      ],
      a: 'Litters of about 6, in a 2 : 1 ratio of yellow to non-yellow.'
    },
    {
      title: 'Dominance depends on the measurement',
      q: 'For the Tay–Sachs gene, homozygous normal cells have 100 % of the normal hexosaminidase A activity, affected children about 0 % and carriers about 50 %. Carriers are healthy. What is the degree of dominance of the normal allele for enzyme activity and for health?',
      steps: [
        'Enzyme: $h = (50 - 0)/(100 - 0) = 0.5$ — additive.',
        'Health: carriers are like normal homozygotes, so $h = 1$ — the normal allele is completely dominant.',
        'Half the enzyme is more than enough to clear the lipid it digests; that is why the disease allele is recessive.'
      ],
      a: 'h = 0.5 for enzyme activity, h = 1 for health.'
    }
  ],
  quiz: [
    { q: 'Two pink snapdragons are crossed. What fraction of the offspring is pink?', choices: ['1/4', '1/2', '3/4', 'all of them'], a: 1, why: 'Pink is the heterozygote; $C^RC^W \\times C^RC^W$ gives ½ heterozygotes.' },
    { q: 'A roan cow has red and white hairs intermingled. This is an example of…', choices: ['incomplete dominance', 'codominance', 'epistasis', 'a lethal allele'], a: 1, why: 'Each hair shows one parental form in full; the heterozygote displays both — codominance. Incomplete dominance would give uniformly intermediate (pinkish) hairs.' },
    { q: 'Yellow mice crossed together give 2 yellow : 1 non-yellow because…', choices: ['yellow is incompletely dominant', 'embryos homozygous for the yellow allele die', 'the yellow allele is on the X chromosome', 'yellow mice make fewer yellow gametes'], a: 1, why: 'The expected ¼ $A^YA^Y$ is missing among the pups: that genotype dies before birth, leaving ½ : ¼ = 2 : 1.' },
    { q: 'Whether an allele counts as dominant can depend on which trait of the heterozygote you measure.', a: true, why: 'The sickle-cell allele is recessive for the disease, codominant for the haemoglobin made and overdominant for survival where malaria is common.' },
    { q: 'An enzyme gene\'s homozygotes have 100 and 0 units of activity and the heterozygote 50. What is the degree of dominance h of the 100-unit allele?', answer: 0.5, why: '$h = (50 - 0)/(100 - 0) = 0.5$: the effects are additive.' }
  ],
  problems: [
    { q: 'Red × white snapdragons give a pink F₁; 480 F₂ plants are raised. How many are expected to be pink?', answer: 240, tol: 0.01, steps: ['The F₂ is 1 red : 2 pink : 1 white.', 'Pink: $\\tfrac12 \\times 480 = 240$.'] },
    { q: 'Yellow mice ($A^Ya$) are crossed with each other. Of 90 pups born, how many are expected to be yellow?', answer: 60, tol: 0.01, steps: ['Among surviving pups yellow : non-yellow = 2 : 1.', '$\\tfrac23 \\times 90 = 60$.'] }
  ],
  applications: [
    'Carrier screening by enzyme level or protein pattern (Tay–Sachs, sickle-cell trait) works because carriers differ measurably at the molecular level.',
    'Breeders recognise heterozygotes by eye where dominance is incomplete — pink snapdragons, roan cattle, palomino horses.',
    'Heterozygote advantage explains why some harmful alleles stay common, such as the sickle-cell allele where malaria has long been widespread.'
  ],
  history: 'Carl Correns described the intermediate F₁ of four-o\'clock flowers in the years after 1900. Lucien Cuénot reported the yellow-mouse ratio in 1905; in 1910 William Castle and Clarence Little argued that the missing homozygotes die, and dead embryos were found in the uterus of yellow females a few years later. Anthony Allison linked the sickle-cell allele to protection from malaria in 1954.',
  sim: { id: 'gen-punnett', params: { dom: 'incomplete' } }
},

{
  id: 'multiple-alleles', parent: 'mendelian', title: 'Multiple alleles and blood groups', level: 2,
  short: 'A gene can have many alleles in a population, though each person carries only two. The ABO blood groups come from three alleles of one gene — Iᴬ and Iᴮ codominant, both dominant to i — giving four blood groups and six genotypes; the Rh factor is a second, separate gene.',
  keywords: ['multiple alleles', 'ABO blood groups', 'blood group A', 'blood group B', 'blood group AB', 'blood group O', 'Rh factor', 'rhesus', 'antigen', 'antibody', 'transfusion', 'dominance series', 'Himalayan rabbit', 'Bombay phenotype', 'HLA', 'allele frequency'],
  prereq: ['dominance-types', 'punnett-squares', 'carbohydrates'],
  related: ['hardy-weinberg', 'pedigrees', 'human-genetics', 'medicine:blood-groups', 'medicine:antibodies', 'medicine:pregnancy'],
  body: `
Each diploid individual carries at most two alleles of a gene, but a population can hold many. With $n$ alleles there are $n$ homozygotes and $n(n-1)/2$ heterozygotes — $n(n+1)/2$ genotypes in all: 6 for three alleles, 10 for four. The alleles often form a **dominance series**. In rabbits, full colour $C$ is dominant to chinchilla $c^{ch}$, which is dominant to Himalayan $c^h$, which is dominant to albino $c$. The Himalayan allele makes a heat-sensitive enzyme of melanin synthesis that works only in the cooler extremities — dark ears, nose, feet and tail on a white body. A similar allele gives Siamese cats their colour points.

### The ABO blood groups
The best-known multiple-allele system is the *ABO* gene on chromosome 9. It encodes an enzyme that adds one sugar to a short sugar chain, the H antigen, on red cells. The $I^A$ enzyme adds *N*-acetylgalactosamine, making antigen A; the $I^B$ enzyme, which differs from it by just four amino acids, adds galactose, making antigen B. Most $i$ (O) alleles carry a one-base deletion that shifts the reading frame and leaves no working enzyme, so the H antigen stays bare. $I^A$ and $I^B$ are codominant; both are dominant to $i$.

| Genotype | Blood group | Antigens on red cells | Antibodies in plasma |
|---|---|---|---|
| $I^AI^A$ or $I^Ai$ | A | A | anti-B |
| $I^BI^B$ or $I^Bi$ | B | B | anti-A |
| $I^AI^B$ | AB | A and B | neither |
| $ii$ | O | neither (H only) | anti-A and anti-B |

The antibodies are why transfusions must be matched: plasma attacks red cells that carry an antigen it lacks. Group O RhD-negative red cells carry neither A, B nor D and are given in emergencies when there is no time to test; people of group AB can receive red cells of any ABO group ([[medicine:blood-groups]]).

Allele frequencies differ from place to place, but all three alleles occur almost everywhere. In much of Europe $i$ is about 0.65, $I^A$ about 0.25 and $I^B$ under 0.1; $I^B$ is commonest in Central and South Asia, and group O is almost universal in some Indigenous peoples of South America. The frequencies change gradually across the map rather than jumping at borders — one of many signs that human variation lies mostly within populations and does not fall into discrete races.

### The Rh factor
The RhD antigen is made by a different gene, *RHD*, on chromosome 1. Rh-positive ($D$) is dominant; most Rh-negative people of European ancestry lack the whole gene on both chromosomes. About 15 % of people of European ancestry are Rh-negative, fewer in Africa, and under 1 % in East Asia. When an Rh-negative mother carries an Rh-positive baby, fetal red cells reaching her blood, mostly at birth, can prompt her to make anti-D antibodies; in a later pregnancy these can cross the placenta and destroy the red cells of an Rh-positive fetus — haemolytic disease of the fetus and newborn. Since the late 1960s, anti-D immunoglobulin has prevented most such sensitisations, and blood-group checks are part of routine antenatal care.

### When another gene intervenes
A person with two non-working copies of the *FUT1* gene (the rare **Bombay** phenotype, described in 1952) makes no H antigen, so neither A nor B can be built on it. They type as group O whatever their *ABO* genes say, and can have a group A or B child with a group O partner — a classic surprise in family studies.

> [!note] Before DNA testing, blood groups were used to exclude parentage: a group O parent and a group AB parent, for example, have children of group A or B only. Blood groups can exclude but never prove, and rare variants such as Bombay or cis-AB can mislead.
`,
  ideas: [
    'A population can hold many alleles of a gene; each diploid individual carries at most two.',
    'n alleles give n(n + 1)/2 genotypes.',
    'ABO: Iᴬ and Iᴮ are codominant and both dominant to i, giving four blood groups from six genotypes.',
    'People make antibodies against the A or B antigen they lack — the basis of transfusion matching.',
    'The Rh factor is a separate gene; an Rh-negative mother can be sensitised by an Rh-positive fetus, which anti-D immunoglobulin prevents.'
  ],
  pitfalls: [
    'A person can carry three alleles of the ABO gene — Each person has two copies of chromosome 9 and so at most two ABO alleles; three main alleles exist in the population.',
    'Group O is dominant because it is the commonest — The i allele is recessive; how common an allele is depends on its history, not on dominance.',
    'An AB parent and an O parent can have AB or O children — Every child gets i from the O parent and Iᴬ or Iᴮ from the other, so is group A or B (barring rare variants).'
  ],
  formulas: [
    {
      name: 'Genotypes possible with n alleles',
      expr: 'G = n*(n + 1)/2', tex: 'G = \\dfrac{n(n + 1)}{2}',
      vars: {
        G: { name: 'number of genotypes', q: 'count' },
        n: { name: 'number of alleles in the population', q: 'count', value: 3, int: true }
      },
      note: 'n homozygotes plus n(n − 1)/2 heterozygotes.',
      stories: { G: 'A gene has {n} alleles in a population. How many different genotypes are possible?', n: 'A gene shows {G} different genotypes in a large population. How many alleles does it have?' }
    },
    {
      name: 'Frequency of blood group O',
      expr: 'fO = r^2', tex: 'f_O = r^{2}',
      vars: {
        fO: { name: 'frequency of group O', q: 'ratio', unit: '%', tex: 'f_O' },
        r: { name: 'frequency of the i allele', q: 'ratio', unit: '%', value: 66, min: 0, max: 100 }
      },
      note: 'Assumes Hardy–Weinberg proportions (random mating). Solving for r estimates the O allele frequency from the share of group O: r = √f_O.',
      stories: { fO: 'The i allele has a frequency of {r}. What share of people are group O?', r: '{fO} of blood donors are group O. What is the frequency of the i allele?' }
    },
    {
      name: 'Frequency of blood group A',
      expr: 'fA = p^2 + 2*p*r', tex: 'f_A = p^{2} + 2pr',
      vars: {
        fA: { name: 'frequency of group A', q: 'ratio', unit: '%', tex: 'f_A' },
        p: { name: 'frequency of the Iᴬ allele', q: 'ratio', unit: '%', value: 26, min: 0, max: 100 },
        r: { name: 'frequency of the i allele', q: 'ratio', unit: '%', value: 66, min: 0, max: 100 }
      },
      note: 'Group A is IᴬIᴬ (p²) or Iᴬi (2pr). Likewise group B is q² + 2qr and group AB is 2pq, with p + q + r = 1.',
      stories: { fA: 'In a population the Iᴬ allele has frequency {p} and the i allele {r}. What share of people are group A?' }
    },
    {
      name: 'The Iᴬ allele frequency from blood-group counts',
      expr: 'p = 1 - sqrt(fB + fO)', tex: 'p = 1 - \\sqrt{f_B + f_O}',
      vars: {
        p: { name: 'frequency of the Iᴬ allele', q: 'ratio', unit: '%' },
        fB: { name: 'frequency of group B', q: 'ratio', unit: '%', value: 11, min: 0, max: 100, tex: 'f_B' },
        fO: { name: 'frequency of group O', q: 'ratio', unit: '%', value: 44, min: 0, max: 100, tex: 'f_O' }
      },
      note: 'Bernstein\'s trick: groups B and O together are (q + r)² = (1 − p)². In the same way q = 1 − √(f_A + f_O).',
      stories: { p: 'A blood bank finds {fB} of donors are group B and {fO} group O. Estimate the frequency of the Iᴬ allele.' }
    }
  ],
  examples: [
    {
      title: 'Children of an A and a B parent',
      q: 'A group A parent and a group B parent have a group O child. What are the parents\' genotypes, and what are the chances for their next child?',
      steps: [
        'The O child is $ii$, so each parent carries $i$: the parents are $I^Ai$ and $I^Bi$.',
        'The square gives $I^AI^B$, $I^Ai$, $I^Bi$ and $ii$, a quarter each.',
        'So each further child is AB, A, B or O with chance ¼ each — all four groups from one couple.'
      ],
      a: 'Iᴬi × Iᴮi; each child has a 25 % chance of each of AB, A, B and O.'
    },
    {
      title: 'Allele frequencies from a donor survey',
      q: 'Donors are 44 % group O, 41 % A, 11 % B and 4 % AB. Estimate the frequencies of i, Iᴬ and Iᴮ.',
      steps: [
        '$r = \\sqrt{0.44} = 0.663$.',
        '$p = 1 - \\sqrt{0.11 + 0.44} = 1 - 0.742 = 0.258$.',
        '$q = 1 - \\sqrt{0.41 + 0.44} = 1 - 0.922 = 0.078$.',
        'Check: $0.663 + 0.258 + 0.078 = 0.999$ — close to 1, so the three-allele model fits.'
      ],
      a: 'i ≈ 0.66, Iᴬ ≈ 0.26, Iᴮ ≈ 0.08.'
    }
  ],
  quiz: [
    { q: 'A mother is group O and her child is group A. What could the father\'s group be?', choices: ['O only', 'A or AB', 'B only', 'any group'], a: 1, why: 'The child\'s Iᴬ must come from the father, so he is A (IᴬIᴬ or Iᴬi) or AB. A group B or O father has no Iᴬ to give.' },
    { q: 'How many different genotypes are possible for a gene with 4 alleles?', answer: 10, why: '$4 \\times 5/2 = 10$: four homozygotes and six heterozygotes.' },
    { q: 'Which blood group has neither anti-A nor anti-B antibodies in its plasma?', choices: ['O', 'A', 'B', 'AB'], a: 3, why: 'People of group AB carry both antigens, so their immune system treats both as self and makes neither antibody.' },
    { q: 'Two group A parents can have a group O child.', a: true, why: 'If both are Iᴬi, each child has a ¼ chance of being ii, group O.' },
    { q: 'Himalayan rabbits have dark ears, nose and paws on a white body because…', choices: ['those parts have a different genotype', 'their pigment enzyme works only at lower temperatures', 'pigment migrates to the extremities', 'a second gene is active only there'], a: 1, why: 'The $c^h$ allele makes a heat-sensitive enzyme: every cell has the same genotype, but only the cooler extremities make pigment. Shave a patch of back and keep it cool, and it grows back dark.' }
  ],
  problems: [
    { q: 'In a population the frequency of the i allele is 0.7. What percentage of people are group O (random mating)?', answer: 49, unit: '%', tol: 0.01, steps: ['$f_O = r^2 = 0.7^2 = 0.49$.'] },
    { q: 'A gene has 5 alleles in a population. How many different genotypes are possible?', answer: 15, tol: 0.01, steps: ['$5 \\times 6/2 = 15$.'] }
  ],
  applications: [
    'Blood transfusion and organ transplantation: matching ABO and Rh, and for organs the HLA genes, which have thousands of known alleles.',
    'Preventing haemolytic disease of the fetus and newborn with anti-D immunoglobulin.',
    'Human population history: blood-group frequencies were among the first genetic markers used to trace migrations.'
  ],
  history: 'Karl Landsteiner found the A, B and O groups in Vienna in 1900–1901 (Nobel Prize, 1930); the AB group was reported in 1902. In 1910 Emil von Dungern and Ludwik Hirszfeld showed that the groups are inherited, and in 1924 Felix Bernstein proved from population frequencies that they come from three alleles of one gene, not two genes. The Rh factor was described in 1939–1940 by Philip Levine and Rufus Stetson and by Landsteiner and Alexander Wiener.',
  sim: 'gen-abo'
},

{
  id: 'chi-square-genetics', parent: 'mendelian', title: 'Testing ratios with chi-square', level: 2,
  short: 'Real crosses never give exactly 3 : 1 or 9 : 3 : 3 : 1. The chi-square test measures how far the counts are from the expected ones and gives the chance that a deviation that large would arise by luck alone if the hypothesis were true.',
  keywords: ['chi-square', 'χ²', 'goodness of fit', 'p-value', 'degrees of freedom', 'expected count', 'observed count', 'null hypothesis', 'significance level', '0.05', 'critical value', 'Pearson', 'Fisher'],
  prereq: ['punnett-squares', 'dihybrid-crosses', 'math:hypothesis-testing'],
  related: ['mendels-laws', 'hardy-weinberg', 'linkage-mapping', 'statistics-bio', 'experimental-design', 'math:probability'],
  body: `
A cross never gives exactly its predicted ratio. Mendel expected 3 : 1 and counted 2.96 : 1 for seed shape and 2.84 : 1 for stem length; were those close enough? The **chi-square test** turns the question into a number. It asks: *if the hypothesis were true, how often would chance alone produce a deviation at least as large as the one observed?*

### The statistic
For each class compare the observed count $O$ with the count $E$ expected under the hypothesis, and add up

$$\\chi^2 = \\sum \\frac{(O - E)^2}{E}.$$

Squaring makes every deviation count positively; dividing by $E$ puts it in proportion — ten extra plants matter more in a class of 30 than in a class of 3000. If the hypothesis is right, $\\chi^2$ follows a known distribution that depends only on the **degrees of freedom**: the number of classes minus one, minus one more for every parameter estimated from the data (as in a [[hardy-weinberg|Hardy–Weinberg]] test).

### From χ² to a p-value
The **p-value** is the chance, under the hypothesis, of a $\\chi^2$ at least this large. By convention, $p < 0.05$ counts as evidence against the hypothesis. The critical values:

| df | p = 0.10 | p = 0.05 | p = 0.01 | p = 0.001 |
|---|---|---|---|---|
| 1 | 2.71 | 3.84 | 6.63 | 10.83 |
| 2 | 4.61 | 5.99 | 9.21 | 13.82 |
| 3 | 6.25 | 7.81 | 11.34 | 16.27 |
| 4 | 7.78 | 9.49 | 13.28 | 18.47 |

For Mendel's 5474 round : 1850 wrinkled the expected counts are 5493 and 1831, $\\chi^2 = 0.26$ with 1 df, and $p = 0.61$: a deviation at least this big would turn up by chance six times in ten. His dihybrid F₂ gives $\\chi^2 = 0.47$ with 3 df, $p = 0.93$. Both fit well.

### The recipe
1. State the hypothesis precisely: "the two genes assort independently, giving 9 : 3 : 3 : 1".
2. Turn it into expected **counts** — never percentages — from the total observed.
3. Compute $\\chi^2$ and the degrees of freedom.
4. Find $p$ (the [genetics calculators](#/tools/genetics) and the simulation below do this) and conclude: the data are *consistent with* the hypothesis, or it is *rejected* at the 5 % level.

Each expected count should be at least about 5; merge small classes or collect more data otherwise.

### What the test can and cannot say
- A large p-value does not **prove** the hypothesis; it says only that the data give no reason to doubt it. A small experiment can hardly reject anything.
- A small p-value does not say what is wrong. Yellow mice give 2 : 1 because one genotype dies; a test cross with too many parental types points to linkage; poor germination of one class distorts any ratio.
- With the same proportions, $\\chi^2$ grows in proportion to the sample size, so enormous samples detect departures too small to matter biologically.
- At the 5 % level, one experiment in twenty is rejected by bad luck even when the hypothesis is true.

> [!history] Karl Pearson published the chi-square test in 1900, the year Mendel's work was rediscovered. In 1936 R. A. Fisher added up the χ² values of Mendel's experiments and found them too **small**: a fit as good as Mendel's would be expected only a few times in 100 000 honest repetitions. A fit that is too good is as suspicious as one that is too poor.
`,
  ideas: [
    'χ² = Σ(O − E)²/E compares observed with expected counts class by class.',
    'Degrees of freedom = classes − 1 (minus any parameters estimated from the data).',
    'The p-value is the chance of a deviation at least this large if the hypothesis is true; p < 0.05 is the usual threshold for rejecting it.',
    'Use counts, not percentages: χ² grows with the sample size at the same proportions.',
    'Not rejecting is not proving; rejecting does not say which alternative is right.'
  ],
  pitfalls: [
    'p > 0.05 proves the hypothesis — It only means the data are consistent with it. Other hypotheses may fit as well, and a small sample can hardly reject anything.',
    'p is the probability that the hypothesis is true — p is the probability of data at least this extreme if the hypothesis is true; it is not the probability of the hypothesis.',
    'Percentages will do in the formula — Use counts. A 60 : 40 split of 10 offspring gives χ² = 0.4; of 1 000 offspring, χ² = 40.'
  ],
  formulas: [
    {
      name: 'Chi-square for a 3 : 1 hypothesis',
      expr: 'chi2 = (nD - 3*nR)^2/(3*(nD + nR))', tex: '\\chi^2 = \\dfrac{(n_D - 3n_R)^2}{3\\,(n_D + n_R)}',
      vars: {
        chi2: { name: 'chi-square (1 degree of freedom)', tex: '\\chi^2' },
        nD: { name: 'offspring with the dominant phenotype', q: 'count', value: 5474, int: true, tex: 'n_D' },
        nR: { name: 'offspring with the recessive phenotype', q: 'count', value: 1850, int: true, tex: 'n_R' }
      },
      note: 'Σ(O − E)²/E for the two classes with E = ¾N and ¼N simplifies to this one expression. Above 3.84, the 3 : 1 hypothesis is rejected at the 5 % level.',
      practice: { unknowns: ['chi2'] },
      stories: { chi2: 'An F₂ gives {nD} dominant and {nR} recessive offspring. What is χ² for the hypothesis of a 3 : 1 ratio?' }
    },
    {
      name: 'Chi-square for a 1 : 1 hypothesis',
      expr: 'chi2 = (n1 - n2)^2/(n1 + n2)', tex: '\\chi^2 = \\dfrac{(n_1 - n_2)^2}{n_1 + n_2}',
      vars: {
        chi2: { name: 'chi-square (1 degree of freedom)', tex: '\\chi^2' },
        n1: { name: 'count in the first class', q: 'count', value: 62, int: true, tex: 'n_1' },
        n2: { name: 'count in the second class', q: 'count', value: 38, int: true, tex: 'n_2' }
      },
      note: 'For a monohybrid test cross (Aa × aa) or a sex ratio. Each class is expected to hold half the total.',
      practice: { unknowns: ['chi2'] },
      stories: { chi2: 'A test cross gives {n1} offspring of one kind and {n2} of the other. What is χ² for a 1 : 1 hypothesis?' }
    },
    {
      name: 'p-value with one degree of freedom',
      expr: 'P = 1 - erf(sqrt(chi2/2))', tex: 'p = 1 - \\operatorname{erf}\\sqrt{\\chi^2/2}',
      vars: {
        P: { name: 'p-value', tex: 'p' },
        chi2: { name: 'chi-square', value: 3.84, tex: '\\chi^2' }
      },
      note: 'Exact for one degree of freedom (two classes, or a Hardy–Weinberg test): χ² with 1 df is the square of a standard normal variable.',
      stories: { P: 'A two-class cross gives χ² = {chi2}. What is the p-value?', chi2: 'What value of χ² with one degree of freedom corresponds to p = {P}?' }
    },
    {
      name: 'p-value with two degrees of freedom',
      expr: 'P = exp(-chi2/2)', tex: 'p = e^{-\\chi^2/2}',
      vars: {
        P: { name: 'p-value', tex: 'p' },
        chi2: { name: 'chi-square', value: 5.99, tex: '\\chi^2' }
      },
      note: 'Exact for two degrees of freedom — for example a 1 : 2 : 1 ratio with three classes.',
      stories: { P: 'An F₂ of snapdragons tested against 1 : 2 : 1 gives χ² = {chi2}. What is the p-value?', chi2: 'Which χ² with two degrees of freedom gives p = {P}?' }
    }
  ],
  examples: [
    {
      title: 'Mendel\'s dihybrid count',
      q: 'Test Mendel\'s 315 : 108 : 101 : 32 (556 seeds) against 9 : 3 : 3 : 1.',
      steps: [
        'Expected: 312.75, 104.25, 104.25, 34.75.',
        { text: 'Add the four terms:', tex: '\\chi^2 = \\frac{2.25^2}{312.75} + \\frac{3.75^2}{104.25} + \\frac{3.25^2}{104.25} + \\frac{2.75^2}{34.75} = 0.016 + 0.135 + 0.101 + 0.218 = 0.47' },
        'Four classes give 3 degrees of freedom. 0.47 is far below 7.81; the p-value is 0.93.'
      ],
      a: 'χ² = 0.47, df = 3, p ≈ 0.93: consistent with independent assortment.'
    },
    {
      title: 'A test cross that fails',
      q: 'A test cross $AaBb \\times aabb$ is scored for gene A alone and gives 62 $Aa$ : 38 $aa$. Is this consistent with 1 : 1?',
      steps: [
        '$\\chi^2 = (62 - 38)^2/100 = 5.76$ with 1 df.',
        '5.76 > 3.84, and $p = 1 - \\operatorname{erf}\\sqrt{2.88} = 0.016$.',
        'Reject 1 : 1 at the 5 % level. Possible reasons: the $aa$ offspring survive less well, or chance (1.6 % of the time). More data would tell.'
      ],
      a: 'χ² = 5.76, p ≈ 0.016: the 1 : 1 hypothesis is rejected at the 5 % level.'
    },
    {
      title: 'Which hypothesis fits the yellow mice?',
      q: 'Yellow × yellow mice give 160 yellow and 80 non-yellow pups. Test 3 : 1 and 2 : 1.',
      steps: [
        '3 : 1: expected 180 and 60; $\\chi^2 = 20^2/180 + 20^2/60 = 2.22 + 6.67 = 8.89$, $p = 0.003$ — rejected.',
        '2 : 1: expected 160 and 80; $\\chi^2 = 0$ — a perfect fit.',
        'The data favour a lethal homozygote. The test rejected one hypothesis; biology (dead embryos found in the uterus) supplied the other.'
      ],
      a: '3 : 1 is rejected (p ≈ 0.003); 2 : 1 fits exactly.'
    }
  ],
  quiz: [
    { q: 'How many degrees of freedom does a test of a 9 : 3 : 3 : 1 ratio have?', answer: 3, why: 'Four classes minus one: once three counts and the total are known, the fourth is fixed.' },
    { q: 'A χ² test gives p = 0.30. What does this mean?', choices: ['the hypothesis is true with probability 0.30', 'if the hypothesis is true, a deviation at least this large happens 30 % of the time', '30 % of the offspring do not fit the ratio', 'the hypothesis should be rejected'], a: 1, why: 'The p-value is computed assuming the hypothesis. p = 0.30 means the deviation is quite ordinary for chance, so there is no reason to reject.' },
    { q: 'You may compute χ² from the percentage in each class instead of the counts.', a: false, why: 'χ² depends on the sample size, and percentages hide it: 60 : 40 in 10 offspring gives χ² = 0.4, in 1 000 offspring χ² = 40.' },
    { q: 'Two F₂ populations of 400 and 4 000 plants show exactly the same proportions, slightly off 3 : 1. How does χ² for the larger one compare?', choices: ['the same', '√10 times larger', '10 times larger', '100 times larger'], a: 2, why: 'Each (O − E)² grows 100-fold and each E 10-fold, so χ² grows 10-fold — the same deviation is more convincing in a bigger sample.' },
    { q: 'An F₂ of 400 plants shows 280 dominant and 120 recessive. What is χ² for the 3 : 1 hypothesis?', answer: 5.33, why: 'Expected 300 and 100: $20^2/300 + 20^2/100 = 1.33 + 4 = 5.33$ — above 3.84, so 3 : 1 is rejected at 5 % (p ≈ 0.02).' }
  ],
  problems: [
    { q: 'A test cross gives 55 and 45 offspring in its two classes. What is χ² for a 1 : 1 hypothesis?', answer: 1.0, tol: 0.02, steps: ['$\\chi^2 = (55 - 45)^2/(55 + 45) = 100/100 = 1.0$ — well below 3.84.'] },
    { q: 'A snapdragon F₂ tested against 1 : 2 : 1 gives χ² = 5.2 with 2 degrees of freedom. What is the p-value?', answer: 0.0743, tol: 0.02, steps: ['With 2 df, $p = e^{-\\chi^2/2} = e^{-2.6} = 0.074$ — not significant at the 5 % level.'] }
  ],
  applications: [
    'Test any counts against any ratio in [the χ² calculator](#/tools/genetics/chi).',
    'Testing Mendelian ratios, linkage and segregation distortion in crosses of crops, livestock and model organisms.',
    'Checking whether genotype counts fit Hardy–Weinberg proportions — a routine quality control in genome studies.',
    'Comparing counts in ecology and medicine, such as habitat choices or treatment outcomes in contingency tables.'
  ],
  history: 'Karl Pearson introduced the chi-square test in 1900. In 1922 R. A. Fisher showed how the degrees of freedom must be reduced when parameters are estimated from the data, and his 1936 re-analysis of Mendel\'s results started a debate about their "too good" fit that is still discussed.',
  sim: 'gen-peas'
},

/* ================================================================ CHROMOSOMES AND INHERITANCE */

{
  id: 'meiosis', parent: 'chromosomes', title: 'Meiosis', level: 2,
  short: 'The two cell divisions that make eggs, sperm and spores: one diploid cell becomes four haploid cells, each with one chromosome of every pair. Homologues pair, cross over and separate in the first division; sister chromatids separate in the second. The result is gametes that are all genetically different.',
  keywords: ['meiosis', 'haploid', 'diploid', 'homologous chromosomes', 'sister chromatids', 'synapsis', 'bivalent', 'crossing over', 'chiasma', 'independent assortment', 'reduction division', 'meiosis I', 'meiosis II', 'gametes', 'oogenesis', 'spermatogenesis'],
  prereq: ['mitosis', 'dna-replication', 'mendels-laws'],
  related: ['cell-cycle', 'linkage-mapping', 'karyotypes', 'sex-linkage', 'dihybrid-crosses', 'animal-reproduction', 'flowering-reproduction'],
  body: `
Every sexually reproducing organism faces the same arithmetic problem: if egg and sperm each carried a full set of chromosomes, the number would double every generation. **Meiosis** solves it. It is a special pair of cell divisions, used only to make gametes (or, in plants and fungi, spores), that turns one **diploid** cell ($2n$, two sets of chromosomes) into four **haploid** cells ($n$, one set). In humans $2n = 46$ and $n = 23$, and fertilisation restores 46. At the same time meiosis shuffles the parental chromosomes so thoroughly that no two gametes are alike.

### One replication, two divisions
The DNA is copied once, in the S phase before meiosis, so each chromosome enters as two identical **sister chromatids**. Then the cell divides twice.

- **Prophase I** — the long, decisive stage. Each chromosome finds its **homologue**, the matching chromosome from the other parent, and the two zip together along their length (synapsis) into a **bivalent** of four chromatids. Enzymes cut and rejoin DNA between non-sister chromatids: **crossing over**, visible later as X-shaped **chiasmata**. Every pair makes at least one crossover; a human meiosis makes roughly 50 in men and 70 in women.
- **Metaphase I** — the bivalents line up across the spindle. Which homologue faces which pole is decided independently for every pair.
- **Anaphase I** — the **homologues separate**, while sister chromatids stay joined at their centromeres. This is the reduction division: each daughter cell gets one member of every pair.
- **Telophase I** — two cells, each haploid, each chromosome still double.
- **Meiosis II** — a mitosis without a new round of replication: at anaphase II the **sister chromatids separate**, giving four haploid cells with single chromatids.

| | Mitosis | Meiosis |
|---|---|---|
| Divisions | one | two |
| Homologues pair and cross over | no | yes, in prophase I |
| Separated at anaphase | sister chromatids | homologues (I), then sisters (II) |
| Products | 2 diploid cells, identical | 4 haploid cells, all different |
| Role | growth, repair, asexual reproduction | gametes and spores |

### Where the variety comes from
- **Independent assortment.** Each of the 23 bivalents orients at random, so one person can make $2^{23} = 8\\,388\\,608$ combinations of whole chromosomes, and a couple about $7 \\times 10^{13}$ different zygotes.
- **Crossing over.** Every chromosome leaving meiosis is a patchwork of the two grandparental chromosomes, so the true number of possible gametes is astronomically larger still.
- **Random fertilisation** pairs any egg with any sperm.

This is the physical basis of Mendel's laws: the two alleles of a gene separate because homologues separate ([[mendels-laws]]), and genes on different chromosomes assort independently because the bivalents orient independently ([[dihybrid-crosses]]). Genes on one chromosome are separated only by crossing over — the basis of [[linkage-mapping]].

### Eggs and sperm
In men meiosis runs continuously from puberty; each spermatocyte gives four sperm, and making a sperm from a stem cell takes about ten weeks. In women meiosis starts before birth: oocytes enter prophase I in the fetal ovary and then **pause** — for up to fifty years — until shortly before ovulation. Meiosis I then ends in a very unequal division (one egg and a tiny polar body), and meiosis II is completed only when a sperm enters. The long pause is one reason errors in chromosome separation become commoner with maternal age ([[karyotypes]]).

> [!key] The chromosome number is halved in the first division, when homologues separate — not in the second. Crossing over and the random orientation of the pairs make every gamete genetically unique.
`,
  ideas: [
    'Meiosis turns one diploid cell into four haploid cells: one round of DNA replication, two divisions.',
    'In prophase I homologues pair and cross over; at anaphase I they separate, halving the chromosome number.',
    'Meiosis II separates sister chromatids, like mitosis.',
    'Independent orientation of the pairs gives 2ⁿ chromosome combinations — about 8.4 million for n = 23 — and crossing over multiplies them further.',
    'Segregation and independent assortment are the behaviour of chromosomes in meiosis.'
  ],
  pitfalls: [
    'Meiosis II halves the chromosome number — The number is halved in meiosis I, when homologues separate. Meiosis II separates sister chromatids and keeps the number at n.',
    'Crossing over happens between sister chromatids — Exchanges between identical sisters would change nothing; the crossovers that matter are between non-sister chromatids of homologous chromosomes.',
    'A gamete carries all the chromosomes from one grandparent — Each pair orients independently and crossing over mixes each chromosome. All 23 from one grandparent (ignoring crossing over) has a chance of about 1 in 8 million.'
  ],
  formulas: [
    {
      name: 'Chromosome combinations in one parent\'s gametes',
      expr: 'C = 2^n', tex: 'C = 2^{n}',
      vars: {
        C: { name: 'combinations from independent assortment', q: 'count' },
        n: { name: 'haploid chromosome number', q: 'count', value: 23, int: true }
      },
      note: 'Counts whole chromosomes only; crossing over adds vastly more variety.',
      stories: { C: 'An organism has a haploid number of {n}. How many chromosome combinations can its gametes carry by independent assortment alone?', n: 'A species can make {C} chromosome combinations by independent assortment. What is its haploid number?' }
    },
    {
      name: 'Chromosome combinations in a zygote',
      expr: 'Z = 4^n', tex: 'Z = 2^{n} \\cdot 2^{n} = 4^{n}',
      vars: {
        Z: { name: 'possible zygote combinations', q: 'count' },
        n: { name: 'haploid chromosome number', q: 'count', value: 23, int: true }
      },
      note: 'Any of 2ⁿ eggs can meet any of 2ⁿ sperm: for humans about 7 × 10¹³.',
      stories: { Z: 'How many chromosome combinations can the children of one couple have, from independent assortment alone, if the haploid number is {n}?' }
    },
    {
      name: 'Chance that a gamete carries only its grandmother\'s chromosomes',
      expr: 'P = 0.5^n', tex: 'P = \\left(\\tfrac12\\right)^{n}',
      vars: {
        P: { name: 'chance, ignoring crossing over', q: 'ratio', unit: '%' },
        n: { name: 'haploid chromosome number', q: 'count', value: 4, int: true }
      },
      note: 'Every pair must orient the same way. For a fruit fly (n = 4) it is 1 in 16; for humans (n = 23) about 1 in 8.4 million.',
      stories: { P: 'An organism has a haploid number of {n}. Ignoring crossing over, what is the chance that one of its gametes carries only the chromosomes it inherited from its mother?' }
    }
  ],
  examples: [
    {
      title: 'Counting through a human meiosis',
      q: 'Follow the chromosome number, the number of chromatids and the DNA content (1C ≈ 3.3 pg, one haploid genome) of one human spermatocyte through meiosis.',
      steps: [
        'Before S phase (G₁): 46 chromosomes, 46 chromatids, 2C ≈ 6.6 pg.',
        'After S phase: still 46 chromosomes, but 92 chromatids and 4C ≈ 13 pg.',
        'After meiosis I: each cell has 23 chromosomes, 46 chromatids, 2C.',
        'After meiosis II: each sperm has 23 chromosomes, 23 chromatids, 1C ≈ 3.3 pg.'
      ],
      a: '46 → 46 (doubled) → 23 (doubled) → 23; DNA 2C → 4C → 2C → 1C.'
    },
    {
      title: 'Variety in a fruit fly',
      q: '*Drosophila melanogaster* has $2n = 8$. How many chromosome combinations can one fly\'s gametes carry, and how many zygote combinations can a pair of flies produce, from independent assortment alone?',
      steps: [
        '$n = 4$, so one fly makes $2^4 = 16$ combinations.',
        'Zygotes: $16 \\times 16 = 256$.',
        'Crossing over in females (male fruit flies do not cross over) multiplies the variety far beyond this.'
      ],
      a: '16 gamete combinations and 256 zygote combinations.'
    }
  ],
  quiz: [
    { q: 'At which stage do homologous chromosomes separate?', choices: ['prophase I', 'anaphase I', 'anaphase II', 'telophase II'], a: 1, why: 'Anaphase I pulls the homologues of each pair to opposite poles; anaphase II separates sister chromatids.' },
    { q: 'How many chromosomes does a human cell have at metaphase II?', answer: 23, why: 'Meiosis I has already halved the number to 23; each chromosome still has two chromatids until anaphase II.' },
    { q: 'Meiosis II halves the chromosome number.', a: false, why: 'Meiosis I does. Meiosis II separates sister chromatids, so each cell keeps n chromosomes.' },
    { q: 'A plant has 2n = 12. How many chromosome combinations can its gametes carry from independent assortment alone?', answer: 64, why: '$n = 6$, and $2^6 = 64$.' },
    { q: 'Crossing over exchanges segments between…', choices: ['sister chromatids of one chromosome', 'non-sister chromatids of homologous chromosomes', 'chromosomes of different pairs', 'the X chromosome and an autosome'], a: 1, why: 'Paired homologues exchange segments between their non-sister chromatids, recombining the alleles of the two parents.' }
  ],
  problems: [
    { q: 'Mice have 2n = 40. How many chromosome combinations can one mouse\'s gametes carry through independent assortment alone?', answer: 1048576, tol: 0.01, steps: ['$n = 20$, so $2^{20} = 1\\,048\\,576$ — about a million.'] },
    { q: 'A human sperm contains about 3.3 pg of DNA. How much DNA, in pg, does a primary spermatocyte hold after S phase?', answer: 13.2, tol: 0.03, steps: ['A sperm is 1C; after replication the spermatocyte is 4C.', '$4 \\times 3.3 = 13.2$ pg.'] }
  ],
  applications: [
    'Plant breeding: meiosis in a hybrid creates the new combinations breeders select from; seedless bananas and watermelons are triploid and cannot complete a normal meiosis.',
    'Fertility medicine: most chromosome errors in embryos arise in meiosis, which is why their frequency rises with maternal age.',
    'Genetic mapping and ancestry analysis count crossovers between DNA markers.'
  ],
  history: 'Oscar Hertwig watched egg and sperm nuclei fuse in sea urchins in 1876, and Edouard van Beneden showed in 1883 that the gametes of the roundworm *Ascaris* carry half the chromosomes of its body cells. August Weismann argued in 1887 that a reduction division must exist. In 1909 Frans Janssens proposed that chiasmata mark exchanges, and in 1931 Harriet Creighton and Barbara McClintock proved with visibly marked maize chromosomes that crossing over physically swaps chromosome segments.',
  sim: 'gen-meiosis'
},

{
  id: 'sex-linkage', parent: 'chromosomes', title: 'Sex determination and sex linkage', level: 2,
  short: 'How sex is set — by X and Y chromosomes in mammals, Z and W in birds, chromosome number in bees, incubation temperature in many reptiles — and why genes on the X chromosome show a special pattern: recessive traits are much commoner in males and pass from a carrier mother to her sons.',
  keywords: ['sex determination', 'XY', 'ZW', 'X0', 'haplodiploidy', 'temperature-dependent sex determination', 'SRY', 'sex linkage', 'X-linked', 'hemizygous', 'carrier', 'colour blindness', 'haemophilia', 'Duchenne', 'X-inactivation', 'Barr body', 'calico cat', 'Morgan', 'white-eyed fly'],
  prereq: ['meiosis', 'mendels-laws', 'punnett-squares'],
  related: ['pedigrees', 'human-genetics', 'karyotypes', 'epigenetics', 'social-behaviour', 'medicine:hemostasis', 'physics:color-vision'],
  body: `
In many animals one pair of chromosomes differs between the sexes. In mammals females are **XX** and males **XY**; a gene on the Y, *SRY* (identified in 1990), switches the developing gonad onto the testis pathway. The sex that makes two kinds of gamete — X-bearing and Y-bearing sperm — is called heterogametic. Nature has found many other systems:

| System | Females | Males | Examples |
|---|---|---|---|
| XY | XX | XY | mammals, many insects, some plants |
| ZW | ZW | ZZ | birds, butterflies and moths, some reptiles and fish |
| X0 | XX | X0 (one X, no partner) | grasshoppers, crickets |
| haplodiploidy | diploid (from fertilised eggs) | haploid (from unfertilised eggs) | bees, ants, wasps |
| temperature | set by the incubation temperature of the egg | | many turtles, all crocodilians, some lizards |

In many turtles, eggs incubated warm — above a pivotal temperature near 29 °C — hatch as females. Where nesting beaches have warmed, hatchlings are now overwhelmingly female: a 2018 study found that more than 99 % of young green turtles from the northern Great Barrier Reef were female. Sex determination is more varied than any single rule; in humans, too, sex development involves many genes, and some people have differences of sex development.

### X-linked inheritance
The human X is a large chromosome (about 156 million base pairs and some 800 protein-coding genes); the Y is small (about 57 million base pairs and a few dozen genes). Genes on the X are **X-linked**. A male has one X and is **hemizygous** for its genes: a single recessive allele shows, because there is no second copy to mask it. Hence the pattern of an X-linked recessive trait:

- It is much commoner in males than in females.
- A man passes his X to all his daughters and to none of his sons — there is no father-to-son transmission.
- A carrier mother passes the allele to half her sons, who are affected, and half her daughters, who are carriers.
- It often skips a generation, reappearing in the grandsons of an affected man through his carrier daughters.

Thomas Hunt Morgan found the first X-linked gene in 1910, in a white-eyed male fruit fly. White-eyed male × red-eyed female gave an all-red F₁ and an F₂ of 3 red : 1 white — but every white-eyed fly was male.

| Condition | Gene product | Approximate frequency in males |
|---|---|---|
| Red–green colour vision deficiency | cone opsin pigments | about 8 % of men of northern European ancestry; lower in many other populations |
| Haemophilia A | clotting factor VIII | about 1 in 5 000 male births |
| Haemophilia B | clotting factor IX | about 1 in 25 000 male births |
| Duchenne muscular dystrophy | dystrophin | about 1 in 3 500–5 000 male births |

Queen Victoria carried haemophilia B, which passed through her daughters into the royal families of Spain, Prussia and Russia; DNA from the remains of the Romanov family identified the mutation in 2009. X-linked **dominant** traits, such as X-linked hypophosphataemia (a form of rickets), are rarer: an affected father passes them to every daughter and to no son. **Y-linked** genes pass from a father to every son.

### X-inactivation
Why do women not make twice as much of every X-linked product as men? Early in development each cell of a female embryo switches off one of its two X chromosomes at random, packing it into a dense **Barr body**, and all the cell's descendants keep the same X silent (Mary Lyon, 1961). A female is therefore a mosaic. Tortoiseshell and calico cats show it on the surface: an orange/black coat-colour gene sits on the X, so patches of orange and of black fur are clones of cells with different active X chromosomes — and nearly all such cats are female (the rare males are usually XXY). For the same reason, a woman who carries an X-linked allele can have mild signs of the condition.
`,
  ideas: [
    'Sex is set by chromosomes in many animals (XY, ZW, X0, haplodiploidy) and by incubation temperature in many reptiles.',
    'Males are hemizygous for X-linked genes, so a single recessive allele is expressed.',
    'X-linked recessive traits: commoner in males, no father-to-son transmission, carrier mothers pass them to half their sons.',
    'If an X-linked recessive allele has frequency q, about q of men and q² of women are affected.',
    'X-inactivation makes every female mammal a mosaic of cells with different active X chromosomes.'
  ],
  pitfalls: [
    'X-linked traits affect only males — Women are affected when they inherit the allele from both parents (frequency q²), and carriers can show mild signs because of X-inactivation.',
    'A son can inherit an X-linked allele from his father — A father gives his son the Y, not the X; a boy\'s X always comes from his mother.',
    'The Y chromosome carries as many genes as the X — The human Y has only a few dozen protein-coding genes, mostly for male development and sperm production.'
  ],
  formulas: [
    {
      name: 'An X-linked recessive trait in women',
      expr: 'fF = q^2', tex: 'f_F = q^{2}',
      vars: {
        fF: { name: 'frequency among women', q: 'ratio', unit: '%', tex: 'f_F' },
        q: { name: 'allele frequency (= frequency among men)', q: 'ratio', unit: '%', value: 8, min: 0, max: 100 }
      },
      note: 'Random mating assumed. A man is affected with chance q (one X); a woman needs the allele on both, q².',
      stories: { fF: '{q} of men have an X-linked recessive trait caused by one gene. What share of women are expected to have it?', q: '{fF} of women have an X-linked recessive trait. What share of men are expected to have it?' }
    },
    {
      name: 'Carrier women',
      expr: 'C = 2*q*(1 - q)', tex: 'C = 2q\\,(1 - q)',
      vars: {
        C: { name: 'frequency of carrier (heterozygous) women', q: 'ratio', unit: '%' },
        q: { name: 'allele frequency (= frequency among men)', q: 'ratio', unit: '%', value: 4, min: 0, max: 50 }
      },
      note: 'For a rare allele carrier women are about twice as common as affected men.',
      stories: { C: 'An X-linked recessive allele has frequency {q}. What share of women are carriers?' }
    },
    {
      name: 'Affected men per affected woman',
      expr: 'k = 1/q', tex: 'k = \\dfrac{q}{q^{2}} = \\dfrac{1}{q}',
      vars: {
        k: { name: 'affected men for each affected woman' },
        q: { name: 'allele frequency (= frequency among men)', q: 'ratio', unit: '%', value: 0.02, min: 0, max: 100 }
      },
      note: 'The rarer the allele, the more lopsided the sexes: haemophilia A, with q ≈ 1/5 000, gives about 5 000 affected men per affected woman.',
      stories: { k: 'An X-linked recessive condition affects {q} of male births. About how many affected males are there for each affected female?' }
    }
  ],
  examples: [
    {
      title: 'A carrier mother',
      q: 'A woman who carries haemophilia A ($X^HX^h$) and an unaffected man ($X^HY$) have children. What are the chances for sons and daughters?',
      steps: [
        'Her eggs carry $X^H$ or $X^h$ (½ each); his sperm carry $X^H$ or $Y$ (½ each).',
        'Daughters get his $X^H$: half are $X^HX^H$, half $X^HX^h$ carriers; none are affected.',
        'Sons get his $Y$: half are $X^HY$, half $X^hY$ and affected.'
      ],
      a: 'Each son has a 50 % chance of haemophilia; each daughter a 50 % chance of being a carrier.'
    },
    {
      title: 'Colour vision in women',
      q: 'About 8 % of men of northern European ancestry have red–green colour vision deficiency. How many women would you expect to have it, and why is the observed figure (about 0.4 %) lower?',
      steps: [
        'Treating it as one gene: $q^2 = 0.08^2 = 0.0064$, or 0.64 %.',
        'In fact it involves two neighbouring genes: about 6 % of men have a green-pigment ("deutan") defect and about 2 % a red ("protan") one.',
        'A woman is affected only if both her X chromosomes carry a defect of the same kind: $0.06^2 + 0.02^2 = 0.004$ — 0.4 %, as observed. A woman with one deutan and one protan X sees normally.'
      ],
      a: 'The one-gene estimate is 0.64 %; allowing for two genes gives 0.4 %, matching observation.'
    },
    {
      title: 'The grandsons of an affected man',
      q: 'A man with an X-linked recessive condition has children with a non-carrier woman. What are the risks for his children and for the sons of his daughters (whose partners are unaffected)?',
      steps: [
        'Every daughter receives his X: all are carriers, none affected. Every son receives his Y: none affected.',
        'Each son of a carrier daughter has a 50 % chance of being affected.',
        'The condition skips his children and reappears in his grandsons through his daughters.'
      ],
      a: 'Children: daughters all carriers, sons unaffected. Daughters\' sons: 50 % each.'
    }
  ],
  quiz: [
    { q: 'A man with haemophilia A and a woman who is not a carrier have a son. What is the chance that the son has haemophilia?', choices: ['0', '1/4', '1/2', '1'], a: 0, why: 'The son gets his father\'s Y and his mother\'s X, which carries the normal allele.' },
    { q: 'From which parent did a man with red–green colour vision deficiency inherit the allele?', choices: ['his father', 'his mother', 'either', 'both'], a: 1, why: 'A man\'s only X comes from his mother; his father gave him the Y.' },
    { q: 'Male tortoiseshell and calico cats are usually…', choices: ['XY', 'XXY', 'X0', 'XYY'], a: 1, why: 'Orange and black patches need two different X chromosomes, one active in each patch; a male with them nearly always has an extra X (XXY).' },
    { q: 'In birds, which sex has two different sex chromosomes?', choices: ['males', 'females', 'neither', 'it depends on temperature'], a: 1, why: 'Birds use the ZW system: females are ZW and males ZZ — the reverse of mammals.' },
    { q: 'If 1 man in 12 has an X-linked recessive trait caused by one gene, about what fraction of women have it?', choices: ['1/12', '1/24', '1/144', '1/288'], a: 2, why: 'Men are affected with frequency q = 1/12, women with q² = 1/144.' }
  ],
  problems: [
    { q: 'Haemophilia A affects about 1 in 5 000 male births. About how many affected males are there for each affected female?', answer: 5000, tol: 0.02, steps: ['Males: q = 1/5000. Females: q² = 1/25 000 000.', 'Ratio: 1/q = 5 000.'] },
    { q: 'An X-linked recessive allele has frequency 0.04. What percentage of women are carriers?', answer: 7.68, unit: '%', tol: 0.02, steps: ['$2q(1 - q) = 2 \\times 0.04 \\times 0.96 = 0.0768$.'] }
  ],
  applications: [
    'Genetic counselling for families with haemophilia or Duchenne muscular dystrophy: finding carrier women and the chance for each son.',
    'Poultry hatcheries sort day-old chicks by sex-linked feather colour or growth, using the Z chromosome.',
    'Turtle conservation: shading nests or moving eggs where warm sand now produces almost only females.'
  ],
  history: 'Nettie Stevens and Edmund Wilson independently linked sex to the X and Y chromosomes in 1905. Morgan\'s white-eyed fly (1910) tied a gene to a particular chromosome for the first time, and his student Calvin Bridges used flies with extra or missing X chromosomes (1916) to prove the chromosome theory of inheritance. Murray Barr saw the condensed X in 1949, Mary Lyon explained it in 1961, and SRY was identified in 1990.',
  sim: 'gen-xlinked'
},

{
  id: 'linkage-mapping', parent: 'chromosomes', title: 'Linkage and gene mapping', level: 3,
  short: 'Genes on the same chromosome tend to be inherited together unless crossing over separates them, and the closer they are, the less often that happens. Counting recombinant offspring gives the recombination frequency; 1 % recombination is one centimorgan, and mapping functions turn frequencies into distances that add up.',
  keywords: ['linkage', 'linked genes', 'recombination frequency', 'recombinant', 'parental type', 'map unit', 'centimorgan', 'cM', 'genetic map', 'three-point test cross', 'double crossover', 'interference', 'coefficient of coincidence', 'Haldane mapping function', 'Kosambi', 'coupling', 'repulsion', 'Sturtevant'],
  prereq: ['meiosis', 'dihybrid-crosses', 'math:logarithms'],
  related: ['chi-square-genetics', 'sex-linkage', 'genomics', 'human-genetics', 'dna-sequencing', 'model-organisms'],
  body: `
Mendel's second law holds for genes on different chromosomes. But a chromosome carries hundreds or thousands of genes, and genes on the same chromosome — **linked** genes — tend to travel together into the gametes. Only crossing over in [[meiosis]] can separate them, and the closer together two genes lie, the less often a crossover falls between them.

### Recombination frequency
Take a fly heterozygous for two linked genes, with both dominant alleles on one homologue and both recessive ones on the other ($AB/ab$, called **coupling**; $Ab/aB$ is **repulsion**). Cross it with a double recessive, $ab/ab$: each offspring then shows directly which gamete it received from the heterozygote. **Parental** types ($AB$, $ab$) come from chromosomes not recombined between the genes; **recombinant** types ($Ab$, $aB$) from those that were. The **recombination frequency** is

$$\\mathrm{RF} = \\frac{\\text{recombinant offspring}}{\\text{all offspring}}.$$

Unlinked genes give $\\mathrm{RF} = 50\\,\\%$ — the 1 : 1 : 1 : 1 of a dihybrid test cross; linked genes give less. One per cent recombination is one **map unit**, or **centimorgan** (cM), after Thomas Hunt Morgan.

### Making a map
In 1911 Morgan proposed that the frequency of recombination reflects the distance between genes. His undergraduate student Alfred Sturtevant realised that the frequencies could place genes in a line, and in a single night drew the first genetic map — six genes on the *Drosophila* X chromosome, published in 1913. Distances roughly add: if $a$–$b$ is 12 cM and $b$–$c$ is 20 cM, then $a$–$c$ is about 32 cM and $b$ lies between them.

A **three-point test cross** does this in one experiment. The two rarest classes of offspring are the **double crossovers**; comparing them with the parental classes shows which gene is in the middle, because it is the one that has changed partners.

### Why distance is not recombination frequency
Two crossovers between the same pair of genes put the outer alleles back together, so the second one is invisible. For distant genes the recombination frequency therefore stops growing and levels off at 50 % however far apart they lie. **Mapping functions** convert RF into a distance that does add up. If crossovers occur independently of one another (J. B. S. Haldane, 1919), the distance in morgans is

$$d = -\\tfrac12 \\ln(1 - 2\\,\\mathrm{RF}),$$

and D. D. Kosambi's function (1944) allows for **interference**, the tendency of one crossover to make another nearby less likely:

$$d = \\tfrac14 \\ln\\frac{1 + 2\\,\\mathrm{RF}}{1 - 2\\,\\mathrm{RF}}.$$

For small RF both give $d \\approx \\mathrm{RF}$; at RF = 20 % Haldane gives 25.5 cM and Kosambi 21.2 cM. Interference is measured with the **coefficient of coincidence** — observed double crossovers divided by the number expected if the two intervals were independent — and $I = 1 - \\text{CoC}$.

### Genetic and physical distance
Centimorgans measure recombination, not DNA. The human genome is about 3 100 million base pairs and its map, averaged over the sexes, about 3 500 cM, so 1 cM is roughly a million base pairs on average. But crossovers cluster in **hotspots** a few thousand base pairs wide, the female map is about 1.6 times longer than the male, and male fruit flies do not cross over at all. In yeast, 1 cM is only about 3 000 base pairs.

> [!tip] Linkage mapping found genes before anyone could read DNA. In 1983 a DNA marker on chromosome 4 was found to travel with Huntington disease through large families, and in 1985 the cystic fibrosis gene was placed on chromosome 7 the same way (it was identified in 1989). Dense maps of DNA markers now underlie crop breeding, genome assembly and the search for genes in [[human-genetics]].
`,
  ideas: [
    'Linked genes lie on the same chromosome and are separated only by crossing over.',
    'Recombination frequency = recombinant offspring / all offspring in a test cross; 1 % = 1 centimorgan.',
    'RF never exceeds 50 %; unlinked genes, and genes far apart on one chromosome, both give 50 %.',
    'The rarest classes of a three-point cross are double crossovers; they reveal the middle gene.',
    'Mapping functions (Haldane, Kosambi) correct for hidden double crossovers; centimorgans are only loosely tied to base pairs.'
  ],
  pitfalls: [
    'Map distance equals recombination frequency at any distance — Only for short distances. Double crossovers hide recombination, so RF levels off at 50 % and must be converted with a mapping function.',
    'An RF of 50 % means the genes are on different chromosomes — It means they assort independently; they may also lie far apart on the same chromosome.',
    'A genetic map shows physical distances — It shows how often crossovers separate genes; hotspots and differences between the sexes make centimorgans and base pairs only loosely related.'
  ],
  formulas: [
    {
      name: 'Recombination frequency',
      expr: 'RF = nrec/N', tex: '\\mathrm{RF} = \\dfrac{n_{rec}}{N}',
      vars: {
        RF: { name: 'recombination frequency', q: 'ratio', unit: '%', tex: '\\mathrm{RF}' },
        nrec: { name: 'recombinant offspring', q: 'count', value: 170, int: true, tex: 'n_{rec}' },
        N: { name: 'all offspring scored', q: 'count', value: 1000, int: true }
      },
      note: 'From a test cross, where each offspring reveals the gamete of the heterozygous parent. 1 % = 1 cM for short distances.',
      stories: { RF: 'A test cross gives {nrec} recombinant offspring among {N}. What is the recombination frequency?', nrec: 'Two genes are known to recombine at {RF}. How many recombinants do you expect among {N} test-cross offspring?' }
    },
    {
      name: 'Haldane\'s mapping function',
      expr: 'd = -50*ln(1 - 2*r)', tex: 'd = -50\\,\\ln(1 - 2r)',
      vars: {
        d: { name: 'map distance', q: false, unit: 'cM' },
        r: { name: 'recombination frequency', q: 'ratio', unit: '%', value: 20, min: 0, max: 49.9 }
      },
      note: 'Assumes crossovers occur independently (no interference). The 50 converts morgans to centimorgans and includes the ½ of d = −½ ln(1 − 2r).',
      stories: { d: 'Two genes recombine at {r}. What is their map distance by Haldane\'s function?', r: 'Two genes are {d} apart. What recombination frequency does Haldane\'s function predict?' }
    },
    {
      name: 'Kosambi\'s mapping function',
      expr: 'd = 25*ln((1 + 2*r)/(1 - 2*r))', tex: 'd = 25\\,\\ln\\dfrac{1 + 2r}{1 - 2r}',
      vars: {
        d: { name: 'map distance', q: false, unit: 'cM' },
        r: { name: 'recombination frequency', q: 'ratio', unit: '%', value: 20, min: 0, max: 49.9 }
      },
      note: 'Allows for interference; widely used for plant and animal maps. It gives shorter distances than Haldane\'s for the same r.',
      stories: { d: 'Two genes recombine at {r}. What is their map distance by Kosambi\'s function?', r: 'By Kosambi\'s function two markers are {d} apart. What recombination frequency is expected?' }
    },
    {
      name: 'Interference from a three-point cross',
      expr: 'I = 1 - ndco/(r1*r2*N)', tex: 'I = 1 - \\dfrac{n_{DCO}}{r_1\\,r_2\\,N}',
      vars: {
        I: { name: 'interference', signed: true },
        ndco: { name: 'observed double crossovers', q: 'count', value: 14, int: true, tex: 'n_{DCO}' },
        r1: { name: 'recombination frequency, first interval', q: 'ratio', unit: '%', value: 12, tex: 'r_1' },
        r2: { name: 'recombination frequency, second interval', q: 'ratio', unit: '%', value: 20, tex: 'r_2' },
        N: { name: 'offspring scored', q: 'count', value: 1000, int: true }
      },
      note: 'r₁r₂N is the number of double crossovers expected if the intervals were independent; the ratio is the coefficient of coincidence. I = 1 means no doubles at all; I < 0 (negative interference) means more than expected.',
      practice: { unknowns: ['I', 'ndco'] },
      stories: { I: 'A three-point cross of {N} offspring shows {ndco} double crossovers; the two intervals recombine at {r1} and {r2}. What is the interference?', ndco: 'Two adjacent intervals recombine at {r1} and {r2} and the interference is {I}. How many double crossovers do you expect among {N} offspring?' }
    }
  ],
  examples: [
    {
      title: 'A two-point test cross',
      q: 'A fly $AB/ab$ is test-crossed and gives 420 $AB$, 410 $ab$, 88 $Ab$ and 82 $aB$ offspring. Find the recombination frequency and the map distance.',
      steps: [
        'Recombinants: $88 + 82 = 170$ of 1 000, so $\\mathrm{RF} = 17\\,\\%$ — 17 cM as a first estimate.',
        'Haldane: $d = -50\\ln(1 - 0.34) = 20.8$ cM. Kosambi: $d = 25\\ln(1.34/0.66) = 17.7$ cM.',
        'The genes are clearly linked: unlinked genes would give about 250 of each class.'
      ],
      a: 'RF = 17 %: about 17–21 cM depending on the mapping function.'
    },
    {
      title: 'A three-point test cross',
      q: `A fly heterozygous for three recessive mutations, which received $a\\,b\\,c$ from one parent and $+\\,+\\,+$ from the other, is test-crossed. The 1 000 offspring, with the genes listed in alphabetical order, are:

| Class | $+\\,+\\,+$ | $a\\,b\\,c$ | $a\\,+\\,+$ | $+\\,b\\,c$ | $a\\,b\\,+$ | $+\\,+\\,c$ | $+\\,b\\,+$ | $a\\,+\\,c$ |
|---|---|---|---|---|---|---|---|---|
| Count | 350 | 344 | 54 | 52 | 95 | 91 | 8 | 6 |

Find the gene order, the map distances and the interference.`,
      steps: [
        'The largest classes, $+++$ and $abc$, are parental; the smallest, $+b+$ and $a+c$ (14 in all), are the double crossovers.',
        'Compared with the parentals, the double crossovers have switched only $b$, so $b$ is in the middle: the order is $a$–$b$–$c$.',
        'Interval $a$–$b$: singles $a{+}{+}$ and $+bc$ (106) plus the doubles (14): RF = 120/1000 = 12.0 %.',
        'Interval $b$–$c$: singles $ab{+}$ and ${+}{+}c$ (186) plus the doubles: RF = 200/1000 = 20.0 %.',
        'Expected doubles: $0.12 \\times 0.20 \\times 1000 = 24$; observed 14, so CoC = 0.58 and $I = 0.42$.',
        'Scored directly, $a$ and $c$ recombine in only 292 offspring (29.2 %) — less than 32 %, because each double crossover restores the outer pair.'
      ],
      a: 'Order a–b–c; a–b 12 cM, b–c 20 cM; interference 0.42.'
    }
  ],
  quiz: [
    { q: 'What is the largest recombination frequency that can be observed between two genes?', choices: ['25 %', '50 %', '75 %', '100 %'], a: 1, why: 'Even very distant genes, with many crossovers between them, come out recombinant only half the time; unlinked genes also give 50 %.' },
    { q: 'In a three-point test cross, the two rarest classes of offspring are…', choices: ['the parental types', 'single crossovers in the first interval', 'single crossovers in the second interval', 'the double crossovers'], a: 3, why: 'A double crossover needs two independent (and interfering) events, so its chance is about the product of the two recombination frequencies.' },
    { q: 'One centimorgan corresponds to the same number of base pairs everywhere in the genome.', a: false, why: 'Crossovers cluster in hotspots and differ between the sexes and between species: 1 cM is about 1 million base pairs on average in humans but only about 3 000 in yeast.' },
    { q: 'A test cross gives 170 recombinants among 1 000 offspring. What is the recombination frequency, in per cent?', answer: 17, unit: '%', why: '170/1000 = 0.17.' },
    { q: 'Genes a–b recombine at 12 % and b–c at 20 %, with b in the middle. Scored directly in the same cross, a and c will recombine…', choices: ['at exactly 32 %', 'at a little less than 32 %', 'at a little more than 32 %', 'at 8 %'], a: 1, why: 'Double crossovers switch b but leave a and c in their parental combination, so they are missed when only a and c are scored.' }
  ],
  problems: [
    { q: 'A test cross of 1 000 offspring includes 230 recombinants. What is the recombination frequency, in per cent?', answer: 23, unit: '%', tol: 0.01, steps: ['$230/1000 = 0.23$ — about 23 cM.'] },
    { q: 'Use Haldane\'s mapping function to convert a recombination frequency of 30 % into a map distance, in cM.', answer: 45.8, tol: 0.02, steps: ['$d = -50\\ln(1 - 0.6) = -50\\ln 0.4 = 45.8$ cM — well above the naive 30.'] }
  ],
  applications: [
    'Turn test-cross counts into map distances in [the linkage calculator](#/tools/genetics/linkage).',
    'Marker-assisted selection in crop and livestock breeding: choosing seedlings that carry a DNA marker tightly linked to a resistance gene.',
    'Locating human disease genes by following markers through families (linkage analysis) — the route to the Huntington and cystic fibrosis genes.',
    'Ordering and checking genome assemblies, and estimating how many generations ago two people inherited a shared stretch of DNA.'
  ],
  history: 'In 1905 William Bateson, Edith Saunders and Reginald Punnett found two sweet-pea genes, for flower colour and pollen shape, that broke independent assortment. Morgan explained linkage by crossing over in 1911, and Sturtevant published the first map in 1913. Haldane\'s mapping function followed in 1919 and Kosambi\'s in 1944. In 1980 David Botstein and colleagues proposed mapping human genes with DNA markers, which made family linkage studies practical.',
  sim: { id: 'gen-meiosis', params: { d: 20 } }
},

{
  id: 'pedigrees', parent: 'chromosomes', title: 'Pedigree analysis', level: 2,
  short: 'A pedigree is a family tree drawn to follow one trait. Because people cannot be crossed like peas, geneticists read inheritance from families: who is affected in each generation, in which sex, and from which parent, reveal whether a trait is dominant or recessive, autosomal or X-linked — and give the chances for relatives.',
  keywords: ['pedigree', 'family tree', 'proband', 'autosomal dominant', 'autosomal recessive', 'X-linked recessive', 'X-linked dominant', 'Y-linked', 'mitochondrial inheritance', 'carrier', 'consanguinity', 'penetrance', 'expressivity', 'new mutation', 'genetic counselling'],
  prereq: ['punnett-squares', 'sex-linkage', 'mendels-laws'],
  related: ['human-genetics', 'linkage-mapping', 'multiple-alleles', 'mitochondria-chloroplasts', 'medicine:cancer-genetics'],
  body: `
A pedigree is a family tree drawn to follow one trait. Human geneticists cannot arrange crosses, so they read the crosses that families have already made. The symbols are standard: squares for males, circles for females, filled symbols for people who have the trait, a horizontal line joining partners and a vertical line down to their children, who hang from a sibship line in birth order. Generations are numbered I, II, III…, and an arrow marks the **proband**, the person through whom the family came to attention. A dot in a symbol marks a known carrier; a double line joins partners who are related to each other.

### The patterns
| Pattern | Tell-tale signs | Examples |
|---|---|---|
| Autosomal dominant | in every generation; each affected person has an affected parent; about half the children of an affected parent are affected; both sexes; father-to-son transmission occurs | Huntington disease, familial hypercholesterolaemia, Marfan syndrome |
| Autosomal recessive | skips generations; unaffected parents can have affected children (¼ each); both sexes; more likely when parents are related | cystic fibrosis, sickle cell disease, phenylketonuria |
| X-linked recessive | mostly males; passed through unaffected carrier women; never father to son; all daughters of an affected man are carriers | haemophilia A and B, Duchenne muscular dystrophy |
| X-linked dominant | an affected father has all daughters and no sons affected; affected women outnumber affected men | X-linked hypophosphataemia |
| Y-linked | males only; from a father to all his sons | a few genes needed for sperm production |
| Mitochondrial | from an affected mother to all her children, never from a father | Leber hereditary optic neuropathy |

### Reasoning like a geneticist
Start by ruling out, not by guessing. Two unaffected parents with an affected child point to a **recessive** trait. An affected daughter of an unaffected father then rules out X-linked recessive, leaving autosomal recessive. Transmission from father to son rules out anything on the X. An affected man with unaffected daughters rules out X-linked dominant. Often several modes remain possible, and then rarity decides: a recessive explanation of a rare trait needs several unrelated partners who marry into the family to be carriers, which is unlikely.

### Risks from pedigrees
Once the mode is known, a pedigree gives risks. If someone's brother or sister has an autosomal recessive condition, both parents are carriers. Being unaffected, the person is not $aa$, so they are a carrier with probability $\\tfrac23$ ([[punnett-squares]]). With a partner from the general population whose chance of being a carrier is $c$, the chance of an affected child is

$$P = \\tfrac23 \\times c \\times \\tfrac14,$$

about 1 in 150 for cystic fibrosis in people of northern European ancestry, where $c \\approx 1/25$.

### Real families are messier
Textbook pedigrees are tidy; real ones are complicated by **incomplete penetrance** — not everyone with the genotype shows the trait (roughly 70 % of women with a harmful *BRCA1* variant develop breast cancer by age 80, by estimates published in 2017) — by **variable expressivity** (one allele, mild in one person and severe in another), by **new mutations** (about 80 % of people with achondroplasia have parents of average height), by late onset, by different genes causing the same condition, and by small families and unknown relatives.

> [!note] Pedigree analysis explains how traits are passed on; it is not a diagnosis. Families with questions about a condition can ask a doctor or genetic counsellor, who can combine the family history with testing where that helps.
`,
  ideas: [
    'Pedigrees use standard symbols: squares for males, circles for females, filled for affected, generations in Roman numerals.',
    'Unaffected parents with an affected child indicate a recessive trait; father-to-son transmission rules out X-linkage.',
    'X-linked recessive traits mostly affect males and pass through carrier women; mitochondrial traits pass from mothers to all their children.',
    'An unaffected sibling of a person with an autosomal recessive condition is a carrier with probability 2/3.',
    'Incomplete penetrance, variable expressivity and new mutations make real pedigrees harder to read.'
  ],
  pitfalls: [
    'A trait in every generation must be dominant — A common recessive allele can appear in every generation when carriers keep marrying in, and dominant traits can skip a generation through incomplete penetrance.',
    'The unaffected sibling of an affected person is a carrier with chance 1/2 — Knowing they are unaffected removes the aa quarter, leaving 2/3.',
    'If nobody else in the family is affected, the condition cannot be genetic — New mutations, recessive inheritance in small families and incomplete penetrance all produce single cases.'
  ],
  formulas: [
    {
      name: 'Risk of an affected child, recessive trait',
      expr: 'P = c1*c2/4', tex: 'P = \\tfrac14\\,c_1\\,c_2',
      vars: {
        P: { name: 'chance that a child is affected', q: 'ratio', unit: '%' },
        c1: { name: 'chance that the first parent is a carrier', q: 'ratio', unit: '%', value: 66.67, min: 0, max: 100, tex: 'c_1' },
        c2: { name: 'chance that the second parent is a carrier', q: 'ratio', unit: '%', value: 4, min: 0, max: 100, tex: 'c_2' }
      },
      note: 'Both parents must be carriers (independent chances), and then each child is affected with chance ¼. An unaffected sibling of an affected person has c = 2/3; a known carrier c = 1.',
      stories: {
        P: 'One partner is a carrier with probability {c1}, the other with probability {c2}. What is the chance that their first child has the recessive condition?',
        c2: 'One partner is a carrier with probability {c1}. What carrier probability of the other partner gives a {P} risk for each child?'
      }
    },
    {
      name: 'Risk to a child of a heterozygous parent, dominant trait',
      expr: 'P = K/2', tex: 'P = \\tfrac12\\,K',
      vars: {
        P: { name: 'chance that a child develops the trait', q: 'ratio', unit: '%' },
        K: { name: 'penetrance', q: 'ratio', unit: '%', value: 80, min: 0, max: 100 }
      },
      note: 'The child inherits the allele with chance ½ and then shows it with chance K (the penetrance, which may depend on age).',
      stories: { P: 'A dominant condition has a penetrance of {K}. What is the chance that a child of a heterozygous parent develops it?', K: 'Children of heterozygous parents develop a dominant condition with chance {P}. What is its penetrance?' }
    }
  ],
  examples: [
    {
      title: 'Ruling out modes',
      q: 'In generation I, two unaffected parents have three children in generation II: an affected daughter, an unaffected daughter and an unaffected son. Which modes of inheritance fit?',
      steps: [
        'Autosomal dominant: an affected child needs an affected parent (with full penetrance) — ruled out.',
        'X-linked recessive: an affected daughter needs an affected father — ruled out. X-linked dominant: also needs an affected parent — ruled out.',
        'Mitochondrial: the mother would be affected — ruled out. Y-linked: never affects daughters — ruled out.',
        'Autosomal recessive: both parents carriers, the daughter $aa$ — fits.'
      ],
      a: 'Only autosomal recessive (assuming full penetrance and no new mutation).'
    },
    {
      title: 'A risk for a sibling',
      q: 'Anna\'s brother has cystic fibrosis; Anna and her parents do not. Her partner has no family history, and about 1 in 25 people of his ancestry are carriers. What is the chance that their first child has cystic fibrosis?',
      steps: [
        'Anna\'s parents are both carriers. Anna is unaffected, so her chance of being a carrier is $\\tfrac23$.',
        'Her partner\'s chance is $\\tfrac{1}{25}$.',
        'If both are carriers, each child is affected with chance ¼: $\\tfrac23 \\times \\tfrac{1}{25} \\times \\tfrac14 = \\tfrac{1}{150}$.',
        'A carrier test for the partner would change this estimate; a genetic counsellor explains what a test can and cannot rule out.'
      ],
      a: 'About 1 in 150 (0.67 %).'
    }
  ],
  quiz: [
    { q: 'A trait passes from a father to his son. Which mode of inheritance does this rule out?', choices: ['autosomal dominant', 'autosomal recessive', 'X-linked', 'none of them'], a: 2, why: 'A son receives his father\'s Y chromosome, not his X, so an X-linked allele cannot pass from father to son.' },
    { q: 'Two unaffected parents have an affected daughter. The most likely mode is…', choices: ['autosomal dominant', 'autosomal recessive', 'X-linked recessive', 'Y-linked'], a: 1, why: 'Unaffected parents point to a recessive trait. An X-linked recessive trait in a daughter would need an affected father, so it must be autosomal.' },
    { q: 'The unaffected brother of a child with an autosomal recessive condition is a carrier with probability…', choices: ['1/4', '1/2', '2/3', '3/4'], a: 2, why: 'Of the four equally likely outcomes of Aa × Aa, he is not aa, leaving AA (1) and Aa (2): 2/3.' },
    { q: 'A trait that appears in every generation of a pedigree must be dominant.', a: false, why: 'A common recessive trait can appear in every generation when carriers marry in — blood group O is recessive and turns up in most family trees.' },
    { q: 'A woman has a condition caused by a mitochondrial DNA variant. Which of her children can inherit the variant?', choices: ['sons only', 'daughters only', 'all of her children', 'none of them'], a: 2, why: 'Mitochondria are passed on in the egg, so all her children inherit them; how severely they are affected varies with the share of mutant mitochondria.' }
  ],
  problems: [
    { q: 'Two unaffected partners each have a brother with the same autosomal recessive condition. What is the chance that their first child is affected?', answer: 0.1111, tol: 0.02, steps: ['Each partner is a carrier with probability 2/3.', '$\\tfrac23 \\times \\tfrac23 \\times \\tfrac14 = \\tfrac19 \\approx 0.111$.'] },
    { q: 'An autosomal dominant condition has 80 % penetrance. What is the chance, in per cent, that a child of a heterozygous parent develops it?', answer: 40, unit: '%', tol: 0.01, steps: ['$\\tfrac12 \\times 0.80 = 0.40$.'] }
  ],
  applications: [
    'Genetic counselling: estimating risks for relatives and helping families decide whether testing would be useful.',
    'Animal breeding records — pedigrees on a large scale — used to avoid inbreeding and to estimate breeding values.',
    'Research: large pedigrees in isolated communities led to the discovery of many disease genes by linkage.'
  ],
  history: 'In 1902 Archibald Garrod noticed that alkaptonuria, a condition that darkens urine, was unusually common among children of first-cousin marriages and recognised it as a Mendelian recessive — the first human trait so explained, and the seed of his idea of "inborn errors of metabolism". Standard pedigree symbols were agreed by genetic counsellors in 1995 and revised in 2008 and 2022, the latest revision making them more inclusive of sex and gender diversity.',
  sim: 'gen-pedigree'
},

{
  id: 'karyotypes', parent: 'chromosomes', title: 'Chromosomes, karyotypes and nondisjunction', level: 2,
  short: 'A karyotype is the full set of a cell\'s chromosomes arranged in pairs: 46 in humans. When chromosomes fail to separate in meiosis (nondisjunction), gametes gain or lose one, giving trisomies such as Down syndrome — whose frequency rises with maternal age — or monosomies such as Turner syndrome.',
  keywords: ['karyotype', 'chromosome number', 'autosome', 'sex chromosome', 'G-banding', 'centromere', 'aneuploidy', 'nondisjunction', 'trisomy', 'monosomy', 'trisomy 21', 'Down syndrome', 'maternal age', 'Turner syndrome', 'Klinefelter syndrome', 'translocation', 'Philadelphia chromosome', 'polyploidy'],
  prereq: ['meiosis', 'nucleus-ribosomes', 'sex-linkage'],
  related: ['human-genetics', 'mitosis', 'speciation', 'plant-diversity', 'medicine:pregnancy', 'medicine:cancer-genetics', 'medicine:screening-harms'],
  body: `
A **karyotype** is the full set of chromosomes of a cell, photographed during division — when they are condensed and visible — and arranged in matching pairs by size and shape. A normal human karyotype has 46 chromosomes: 22 pairs of **autosomes**, numbered roughly from largest to smallest (chromosome 1 has about 248 million base pairs; 21, the smallest, about 46 million), and two **sex chromosomes**, written 46,XX or 46,XY. Staining with Giemsa dye gives each chromosome a barcode of light and dark bands (**G-banding**, 400–850 bands in a good preparation), so missing, extra or moved pieces a few million base pairs long can be seen. Smaller changes need fluorescent probes (FISH), DNA microarrays or sequencing.

Chromosomes also differ in where the centromere sits: in the middle (metacentric), off-centre (submetacentric) or near one end (acrocentric, like human 13, 14, 15, 21 and 22). The number of chromosomes says little about complexity:

| Species | 2n |
|---|---|
| fruit fly | 8 |
| bread wheat (hexaploid: six sets of 7) | 42 |
| human | 46 |
| chimpanzee | 48 (human chromosome 2 is a fusion of two ape chromosomes) |
| potato (tetraploid) | 48 |
| dog | 78 |
| adder's-tongue fern *Ophioglossum reticulatum* | about 1 440 |

### Nondisjunction
If a pair of homologues fails to separate at anaphase I, or two sister chromatids fail to part at anaphase II, a gamete ends up with an extra chromosome ($n + 1$) or without one ($n - 1$): **nondisjunction**. Fertilised by a normal gamete, it gives a **trisomy** ($2n + 1$) or a **monosomy** ($2n - 1$). An error in meiosis I gives two $n + 1$ and two $n - 1$ gametes; an error in one cell at meiosis II gives one of each and two normal gametes.

Such errors are common in humans: a large share of eggs, rising steeply with age, carry the wrong number of chromosomes, and about half of first-trimester miscarriages have an abnormal karyotype. Most aneuploid embryos are lost; those that can survive involve small autosomes or the sex chromosomes:

| Karyotype | Condition | Approximate frequency at birth |
|---|---|---|
| 47,+21 | Down syndrome | about 1 in 700–1 000 births, varying with country and maternal age |
| 47,+18 | trisomy 18 (Edwards syndrome) | about 1 in 5 000 live births |
| 47,+13 | trisomy 13 (Patau syndrome) | about 1 in 10 000–16 000 |
| 45,X | Turner syndrome | about 1 in 2 500 female births |
| 47,XXY | Klinefelter syndrome | about 1 in 500–1 000 male births |
| 47,XXX and 47,XYY | often never noticed | about 1 in 1 000 of each sex |

### Maternal age and trisomy 21
About 95 % of Down syndrome comes from a free extra chromosome 21, and in about nine cases in ten the extra copy comes from the egg, mostly through an error in meiosis I. The oocyte has waited in prophase I since before the mother was born, and the proteins that hold paired chromosomes together weaken over the decades, so the chance rises with maternal age. A curve fitted to birth data from the 1980s, before prenatal screening was widespread, gives a chance at birth of about 1 in 1 350 at 25, 1 in 900 at 30, 1 in 385 at 35, 1 in 110 at 40 and 1 in 30 at 45. Some 3–4 % of cases come from a **Robertsonian translocation** — chromosome 21 joined to another acrocentric chromosome — which can be inherited, and 1–2 % are mosaic.

> [!note] Prenatal **screening** tests (blood tests, including cell-free DNA, and ultrasound) estimate how likely a pregnancy is to have a trisomy; **diagnostic** tests (chorionic villus sampling, amniocentesis) examine fetal cells and carry a small procedure-related risk. Whether to be tested, and what to do with a result, are personal decisions to talk through with a doctor, midwife or genetic counsellor.

People with Down syndrome have a wide range of abilities and health. With modern care their life expectancy in high-income countries has risen from about ten years in the 1960s to around sixty.

### Changes in structure
Pieces of chromosome can be lost (**deletions**, such as the loss from chromosome 5 in cri-du-chat syndrome), doubled (**duplications**), turned around (**inversions**) or moved to another chromosome (**translocations**). A swap between chromosomes 9 and 22 — the **Philadelphia chromosome**, seen in 1960 — fuses two genes into *BCR-ABL*, which drives chronic myeloid leukaemia; imatinib, a drug that blocks the fused protein, was approved in 2001. Whole-genome duplication (**polyploidy**) is rare in animals but common in plants: wheat, cotton, potatoes, bananas and strawberries (eight sets) are polyploid.
`,
  ideas: [
    'A human karyotype has 46 chromosomes: 22 pairs of autosomes plus XX or XY.',
    'Nondisjunction in meiosis I or II produces gametes with an extra or a missing chromosome, leading to trisomy or monosomy.',
    'Only a few aneuploidies survive to birth: trisomies 21, 18 and 13 and changes in the number of sex chromosomes.',
    'The chance of trisomy 21 rises steeply with maternal age because oocytes wait decades in meiosis I.',
    'Structural changes — deletions, duplications, inversions, translocations — and polyploidy also alter karyotypes.'
  ],
  pitfalls: [
    'Down syndrome is inherited from a parent who has it — Almost all cases are new errors in the making of an egg or sperm; only the translocation form (3–4 %) can run in families.',
    'Only older mothers have babies with Down syndrome — The chance rises with age, but because many more babies are born to younger mothers, many babies with Down syndrome are born to mothers under 35.',
    'More chromosomes mean a more complex organism — Chromosome number reflects history (fusions, fissions, polyploidy), not complexity: dogs have 78, humans 46.'
  ],
  formulas: [
    {
      name: 'Chance of trisomy 21 at birth by maternal age (fitted curve)',
      expr: 'N = 1/(a + exp(b + c*A))', tex: 'N = \\dfrac{1}{a + e^{\\,b + c A}}',
      vars: {
        N: { name: 'chance expressed as "1 in N"' },
        A: { name: 'maternal age at delivery', q: false, unit: 'yr', value: 35, min: 15, max: 50 },
        a: { name: 'part of the risk independent of age', value: 0.000627, fixed: true },
        b: { name: 'fitted constant', value: -16.2395, fixed: true, signed: true },
        c: { name: 'rise of the log-risk per year of age', q: false, unit: '1/yr', value: 0.286, fixed: true }
      },
      note: 'A curve fitted to birth data from before widespread prenatal screening (Cuckle and colleagues, 1987). It is approximate and describes populations: the chance for a particular pregnancy is estimated by screening, not by age alone.',
      practice: { unknowns: ['N', 'A'] },
      stories: {
        N: 'According to the fitted curve, what is the chance of trisomy 21 at birth for a mother aged {A}? Give it as "1 in N".',
        A: 'At what maternal age does the fitted chance of trisomy 21 at birth reach 1 in {N}?'
      }
    }
  ],
  examples: [
    {
      title: 'Nondisjunction in meiosis I and in meiosis II',
      q: 'Follow chromosome 21 through an egg-producing meiosis in which it fails to separate (a) at anaphase I, (b) at anaphase II in one cell. What gametes result, and what happens after fertilisation by a normal sperm?',
      steps: [
        '(a) Both homologues go to one pole: two gametes carry two *different* chromosomes 21 (one from each grandparent) and two carry none.',
        '(b) Meiosis I is normal; in one cell the sister chromatids stay together: one gamete has two *identical* copies, one has none, the two from the other cell are normal.',
        'Fertilised by a normal sperm: two copies + one = trisomy 21 (47,+21); none + one = monosomy 21, which is not viable.',
        'DNA markers near the centromere tell the two apart — different parental copies point to meiosis I — which is how we know most cases arise in meiosis I.'
      ],
      a: 'MI error: 2 × (n + 1) and 2 × (n − 1). MII error: 1 × (n + 1), 1 × (n − 1) and 2 normal.'
    },
    {
      title: 'Reading the maternal-age curve',
      q: 'Use the fitted curve to compare the chance of trisomy 21 at birth for mothers aged 30 and 40.',
      steps: [
        'At 30: $0.000627 + e^{-16.2395 + 8.58} = 0.000627 + 0.000471 = 0.00110$, about 1 in 910.',
        'At 40: $0.000627 + e^{-16.2395 + 11.44} = 0.000627 + 0.00823 = 0.00886$, about 1 in 113.',
        'The chance rises about eightfold over the decade; the age-dependent part grows by $e^{2.86} \\approx 17$ times.'
      ],
      a: 'About 1 in 910 at 30 and 1 in 113 at 40.'
    },
    {
      title: 'Why age is not the whole story',
      q: 'Illustration: suppose 90 % of births are to mothers under 35, with an average chance of trisomy 21 of 1 in 1 100, and 10 % to mothers of 35 and over, with an average of 1 in 200. Of babies born with trisomy 21, what share have mothers under 35?',
      steps: [
        'Per 100 000 births: under 35, $90\\,000/1100 = 82$; 35 and over, $10\\,000/200 = 50$.',
        'Share with younger mothers: $82/(82 + 50) = 62\\,\\%$.',
        'A higher rate in a smaller group can still mean fewer cases: always ask how big each group is.'
      ],
      a: 'About 62 % — most of them, in this illustration.'
    }
  ],
  quiz: [
    { q: 'What karyotype does a person with Klinefelter syndrome typically have?', choices: ['45,X', '47,XXY', '47,XYY', '47,+21'], a: 1, why: 'Klinefelter syndrome is an extra X in a male: 47,XXY. 45,X is Turner syndrome.' },
    { q: 'A nondisjunction of one chromosome in one of the two cells at meiosis II produces…', choices: ['four n + 1 gametes', 'two n + 1 and two n − 1 gametes', 'one n + 1, one n − 1 and two normal gametes', 'four normal gametes'], a: 2, why: 'Meiosis I was normal, so the other cell divides normally into two normal gametes; only the faulty cell gives n + 1 and n − 1.' },
    { q: 'Why does the chance of trisomy 21 rise with maternal age?', choices: ['older women make more eggs', 'oocytes stay paused in meiosis I for decades and chromosome cohesion weakens', 'the father\'s age is the real cause', 'chromosome 21 grows longer with age'], a: 1, why: 'Human oocytes enter prophase I before birth and finish meiosis I only near ovulation; the proteins holding homologues together deteriorate over that long wait, so errors in separation become commoner.' },
    { q: 'Bread wheat has 2n = 42 and is hexaploid (six sets). What is its basic chromosome number x?', answer: 7, why: '42 / 6 = 7: each of the three ancestral genomes contributed two sets of seven.' },
    { q: 'The number of chromosomes is a good measure of how complex an organism is.', a: false, why: 'Dogs have 78 chromosomes, humans 46, fruit flies 8 and some ferns over a thousand: chromosome number reflects fusions, splits and polyploidy in a lineage\'s history.' }
  ],
  problems: [
    { q: 'Using the fitted curve on this page, what is the approximate chance of trisomy 21 at birth for a mother aged 38? Give N in "1 in N".', answer: 190, tol: 0.03, steps: ['$0.000627 + e^{-16.2395 + 0.286 \\times 38} = 0.000627 + e^{-5.372} = 0.000627 + 0.00465 = 0.00527$.', '$1/0.00527 \\approx 190$.'] },
    { q: 'In a species with 2n = 24, how many chromosomes does a gamete carry if it received the extra chromosome from a nondisjunction in meiosis I?', answer: 13, tol: 0.01, steps: ['A normal gamete has n = 12; the faulty one has n + 1 = 13.'] }
  ],
  applications: [
    'Prenatal and preimplantation testing for chromosome number, and investigation of recurrent miscarriage.',
    'Cancer diagnosis and treatment choice: the Philadelphia chromosome in chronic myeloid leukaemia and other translocations in leukaemias and lymphomas.',
    'Plant breeding with polyploids: seedless triploid watermelons and bananas, and new crops such as triticale, a wheat–rye hybrid.'
  ],
  history: 'Human chromosomes were long thought to number 48; in 1956 Joe Hin Tjio and Albert Levan counted 46. In 1959 Jérôme Lejeune, Marthe Gautier and Raymond Turpin found an extra chromosome 21 in children with Down syndrome, and the same year Charles Ford and colleagues described 45,X in Turner syndrome and Patricia Jacobs and John Strong 47,XXY in Klinefelter syndrome. Banding methods from 1970 allowed every chromosome to be told apart.',
  sim: { id: 'gen-meiosis', params: { nd: 1 } }
},

{
  id: 'polygenic-traits', parent: 'chromosomes', title: 'Polygenic traits and heritability', level: 2,
  short: 'Height, skin colour, yield and blood pressure vary continuously because many genes, each with a small effect, add up — and the environment adds more. Heritability measures how much of the variation in a population goes with genetic differences; it says nothing about individuals, fixed destinies or differences between groups.',
  keywords: ['polygenic', 'quantitative trait', 'continuous variation', 'additive genes', 'normal distribution', 'Nilsson-Ehle', 'wheat colour', 'heritability', 'broad-sense heritability', 'narrow-sense heritability', 'H²', 'h²', 'breeder\'s equation', 'response to selection', 'twin study', 'variance', 'GWAS', 'height'],
  prereq: ['dihybrid-crosses', 'math:normal-distribution', 'math:descriptive-statistics'],
  related: ['natural-selection', 'dominance-types', 'human-genetics', 'statistics-bio', 'epigenetics', 'math:binomial-distribution'],
  body: `
Mendel chose traits that fall into clear classes. Most traits do not: height, weight, skin colour, blood pressure, milk yield and the oil content of maize grain vary smoothly from one extreme to the other. Early in the twentieth century that seemed to contradict Mendel — until breeders and statisticians showed that such **quantitative** traits are what Mendelian genes produce when many act together.

### Many genes, small effects
In 1909 Herman Nilsson-Ehle crossed red-grained with white-grained wheat. The F₁ was an intermediate red; in the F₂ of some crosses one plant in 16 was white, in others one in 64, with a range of reds between. He explained it with two or three genes whose "red" alleles each add a similar amount of pigment. With $n$ such genes a plant carries anywhere from 0 to $2n$ red alleles, so the F₂ of two heterozygotes falls into $2n + 1$ classes in binomial proportions:

| Genes | Classes | F₂ proportions |
|---|---|---|
| 1 | 3 | 1 : 2 : 1 |
| 2 | 5 | 1 : 4 : 6 : 4 : 1 |
| 3 | 7 | 1 : 6 : 15 : 20 : 15 : 6 : 1 |

With more genes the steps become smaller and the histogram approaches the **normal distribution** — the shape of any sum of many small independent contributions ([[math:normal-distribution|normal distribution]]). The environment then blurs the steps completely: food, light, illness and chance during development add their own variation. Human height is influenced by thousands of variants: a study of 5.4 million people published in 2022 found about 12 000 that together account for roughly 40–45 % of the variation in height among people of European ancestry — less in other groups, whose genomes have been studied far less.

### Partitioning variation
The variance of a trait in a population, $V_P$, can be split into genetic and environmental parts,

$$V_P = V_G + V_E,\\qquad V_G = V_A + V_D + V_I,$$

where $V_A$ is the **additive** variance (from alleles whose effects simply add), $V_D$ comes from dominance and $V_I$ from interactions between genes. Two ratios follow:

- **Broad-sense heritability** $H^2 = V_G/V_P$: the share of the variation that goes with all genetic differences.
- **Narrow-sense heritability** $h^2 = V_A/V_P$: the share passed predictably from parents to offspring. Breeders use it in the **breeder's equation** $R = h^2 S$: the response to selection $R$ (the shift in the mean in the next generation) is $h^2$ times the selection differential $S$ (how far the chosen parents' mean lies from the population mean).

Heritabilities are estimated from the resemblance of relatives: the slope of offspring on the mean of their parents estimates $h^2$, and comparing identical with fraternal twins gives $h^2 \\approx 2(r_{MZ} - r_{DZ})$. Typical values: height in well-fed populations about 0.8; milk yield in dairy cattle 0.25–0.35; litter size in pigs about 0.1. In the Illinois maize experiment, begun in 1896, a century of selection raised the oil content of the grain from about 5 % to over 20 %.

### What heritability does not mean
- It describes **variation in a population**, not individuals. A heritability of 0.8 for height does not mean that 80 % of your height comes from your genes: your height needs both genes and food, as the area of a rectangle needs both its sides.
- It belongs to **one population in one environment**. Make the environment more uniform and heritability rises; change the environment and it changes. Dutch men have grown about 15–20 cm taller on average since the mid-nineteenth century, in a population where height is highly heritable — the cause was better food and health, not new genes.
- **Differences between groups** are a separate question. Sow one handful of mixed seed in rich soil and another in poor soil: within each tray the differences are largely genetic, yet the difference between the trays is entirely environmental (Richard Lewontin's example, 1970).
- High heritability is not destiny. Phenylketonuria is entirely genetic, yet a special diet from birth prevents its harm; short sight is heritable, and glasses correct it.

> [!warn] For complex human traits — above all behaviour and abilities — thousands of variants each have tiny effects entangled with family, schooling, culture and circumstance. Genetic scores predict little for any one person and nothing about differences between groups.
`,
  ideas: [
    'Quantitative traits vary continuously because many genes of small, additive effect combine and the environment adds more variation.',
    'n additive genes give 2n + 1 genotypic classes in binomial proportions, approaching a normal curve as n grows.',
    'Phenotypic variance splits into genetic and environmental parts: V_P = V_G + V_E.',
    'Broad-sense H² = V_G/V_P; narrow-sense h² = V_A/V_P predicts the response to selection, R = h²S.',
    'Heritability is a property of a population in an environment, not of individuals, and says nothing about differences between groups.'
  ],
  pitfalls: [
    'Heritability says how much of one person\'s trait is due to genes — It describes variation within a population; for an individual, genes and environment are inseparable.',
    'Highly heritable traits cannot be changed — Heritability says nothing about what a new environment could do: average height rose by many centimetres as nutrition improved, and diet prevents the effects of PKU.',
    'If a heritable trait differs between groups, the difference must be genetic — Heritability within groups says nothing about the cause of differences between them (Lewontin\'s two trays of seed).'
  ],
  formulas: [
    {
      name: 'Share of the F₂ in one extreme class',
      expr: 'f = 0.25^n', tex: 'f = \\left(\\tfrac14\\right)^{n}',
      vars: {
        f: { name: 'fraction as extreme as one parent', q: 'ratio', unit: '%' },
        n: { name: 'number of additive genes that differ', q: 'count', value: 3, int: true }
      },
      note: 'The F₂ of two parents differing at n unlinked additive genes. Nilsson-Ehle read the number of genes from this fraction: 1/16 means two, 1/64 means three.',
      stories: { f: 'Two wheat lines differ at {n} additive colour genes. What fraction of the F₂ is as white as the white parent?', n: 'In a wheat F₂, {f} of the plants are as white as the white parent. How many additive genes differ between the parents?' }
    },
    {
      name: 'Broad-sense heritability',
      expr: 'H2 = VG/(VG + VE)', tex: 'H^2 = \\dfrac{V_G}{V_G + V_E}',
      vars: {
        H2: { name: 'broad-sense heritability', tex: 'H^2' },
        VG: { name: 'genetic variance', q: false, unit: 'cm²', value: 40, tex: 'V_G' },
        VE: { name: 'environmental variance', q: false, unit: 'cm²', value: 10, tex: 'V_E' }
      },
      note: 'V_G + V_E is the phenotypic variance V_P (ignoring gene–environment interaction and correlation). Any trait unit will do, squared.',
      stories: { H2: 'In a population the genetic variance of height is {VG} and the environmental variance {VE}. What is the broad-sense heritability?', VE: 'Height has a genetic variance of {VG} and a broad-sense heritability of {H2}. What is the environmental variance?' }
    },
    {
      name: 'The breeder\'s equation',
      expr: 'R = h2*S', tex: 'R = h^2 S',
      vars: {
        R: { name: 'response to selection (change in the mean)', q: 'length', unit: 'cm', signed: true },
        h2: { name: 'narrow-sense heritability', value: 0.4, min: 0, max: 1, tex: 'h^2' },
        S: { name: 'selection differential (parents\' mean minus population mean)', q: 'length', unit: 'cm', value: 20, signed: true }
      },
      note: 'Predicts one generation of selection on a trait such as plant height. Measuring R and S in a selection experiment gives the "realised" heritability R/S.',
      stories: {
        R: 'Plants chosen as parents average {S} taller than their population, and the heritability is {h2}. How much taller will the next generation be on average?',
        h2: 'Parents selected {S} above the mean produced offspring {R} above the old mean. What is the realised heritability?'
      }
    },
    {
      name: 'Heritability from twins (Falconer)',
      expr: 'h2 = 2*(rMZ - rDZ)', tex: 'h^2 \\approx 2\\,(r_{MZ} - r_{DZ})',
      vars: {
        h2: { name: 'heritability', tex: 'h^2' },
        rMZ: { name: 'correlation between identical (MZ) twins', value: 0.9, min: 0, max: 1, tex: 'r_{MZ}' },
        rDZ: { name: 'correlation between fraternal (DZ) twins', value: 0.48, min: 0, max: 1, tex: 'r_{DZ}' }
      },
      note: 'Identical twins share all their genes, fraternal twins half their segregating genes on average; the formula assumes both kinds share their environments equally, which is only approximately true.',
      stories: { h2: 'For height, identical twins correlate at {rMZ} and fraternal twins at {rDZ}. Estimate the heritability.' }
    }
  ],
  examples: [
    {
      title: 'Nilsson-Ehle\'s wheat with three genes',
      q: 'Red and white wheat differ at three additive genes, each "red" allele adding one unit of colour. What classes appear in the F₂ and in what proportions?',
      steps: [
        'An F₂ plant carries 0 to 6 red alleles: 7 classes.',
        'Each of the 6 allele positions is red with chance ½, so the counts follow the binomial $\\binom{6}{k}/64$: 1, 6, 15, 20, 15, 6, 1 (out of 64).',
        'Only 1 in 64 is as white as the white parent and 1 in 64 as red as the red parent; the middle shade is the commonest, at 20/64.'
      ],
      a: 'Seven shades in the ratio 1 : 6 : 15 : 20 : 15 : 6 : 1.'
    },
    {
      title: 'Selecting taller plants',
      q: 'A plant population averages 100 cm. The plants chosen as parents average 120 cm, and the narrow-sense heritability of height is 0.4. What mean height do you expect in the next generation?',
      steps: [
        'Selection differential $S = 120 - 100 = 20$ cm.',
        'Response $R = h^2 S = 0.4 \\times 20 = 8$ cm.',
        'Expected mean: 108 cm. The offspring "regress" towards the old mean because only the additive part of the parents\' advantage is inherited.'
      ],
      a: 'About 108 cm.'
    },
    {
      title: 'Heritability from twins',
      q: 'For adult height, identical twins correlate at about 0.90 and fraternal twins at about 0.48. Estimate the heritability, and name one assumption.',
      steps: [
        '$h^2 \\approx 2(0.90 - 0.48) = 0.84$.',
        'The estimate assumes that identical and fraternal twins share their environments to the same degree, and that the effects of genes add up.',
        'It applies to the population studied, in its environment: in a population where some children were badly fed it would be lower.'
      ],
      a: 'About 0.84, assuming equal environments for both kinds of twin.'
    }
  ],
  quiz: [
    { q: 'With four additive genes, how many phenotypic classes can the F₂ of two quadruple heterozygotes show, ignoring the environment?', answer: 9, why: '2n + 1 = 9: from 0 to 8 "plus" alleles.' },
    { q: 'The heritability of height in a population is 0.8. This means that…', choices: ['80 % of each person\'s height is caused by genes', '80 % of the variation in height among people in that population goes with genetic differences', 'height cannot be changed by diet', 'children reach 80 % of their parents\' height'], a: 1, why: 'Heritability is a ratio of variances in a population. It says nothing about the make-up of one person\'s height, or about what a different environment would do.' },
    { q: 'A trait with a high heritability cannot be changed by the environment.', a: false, why: 'Height is highly heritable, yet average height has risen by many centimetres with better nutrition; PKU is entirely genetic, yet diet prevents its effects.' },
    { q: 'The narrow-sense heritability of body mass in a flock is 0.5, and the birds chosen for breeding are 10 kg above the flock mean. What response do you expect in the next generation?', answer: 5, unit: 'kg', why: '$R = h^2 S = 0.5 \\times 10 = 5$ kg.' },
    { q: 'Two trays of the same genetically varied seed are grown in rich and in poor soil; the rich tray grows taller, and heritability within each tray is high. The difference between the trays is…', choices: ['mostly genetic', 'entirely environmental', 'half genetic, half environmental', 'impossible to say'], a: 1, why: 'Both trays hold the same mix of genotypes, so the difference between them comes only from the soil — whatever the heritability within each tray.' }
  ],
  problems: [
    { q: 'In a wheat F₂, 1 plant in 1 024 is as white as the white parent. Assuming equal additive genes, how many genes differ between the parents?', answer: 5, tol: 0.01, steps: ['$(1/4)^n = 1/1024$, so $4^n = 1024 = 4^5$.', '$n = 5$ genes.'] },
    { q: 'The genetic variance of a trait is 30 cm² and the environmental variance 20 cm². What is the broad-sense heritability?', answer: 0.6, tol: 0.01, steps: ['$H^2 = 30/(30 + 20) = 0.6$.'] }
  ],
  applications: [
    'Animal and plant breeding: predicting gains from selection with the breeder\'s equation, and genomic selection with thousands of DNA markers.',
    'Medicine: polygenic risk scores for common conditions such as coronary heart disease add up small effects of many variants; they shift probabilities rather than predicting what will happen to a person.',
    'Evolutionary biology: measuring how fast wild populations respond to selection, from beak size in Galápagos finches to the timing of breeding in birds.'
  ],
  history: 'Francis Galton measured the heights of parents and children in the 1880s and found that children of tall parents are tall but less extreme — "regression towards the mean". Biometricians and Mendelians argued for years over whether continuous variation could be Mendelian; Nilsson-Ehle\'s wheat (1909) and Edward East\'s maize showed that it could, and in 1918 R. A. Fisher proved that many Mendelian genes produce exactly the correlations between relatives that the biometricians had measured. Jay Lush developed heritability and the breeder\'s equation for animal breeding in the 1930s and 1940s.',
  sim: 'gen-polygenic'
},

{
  id: 'human-genetics', parent: 'chromosomes', title: 'Human genetic disease', level: 2,
  short: 'Some conditions come from a single gene, others from extra or missing chromosomes, and most common ones from many genes together with the environment. Why harmful alleles persist, how carriers and genetic tests fit in, and what treatment can already do — explained, not diagnosed.',
  keywords: ['genetic disease', 'single-gene disorder', 'Mendelian disorder', 'carrier', 'cystic fibrosis', 'sickle cell disease', 'phenylketonuria', 'PKU', 'Huntington disease', 'familial hypercholesterolaemia', 'newborn screening', 'carrier screening', 'genetic testing', 'genetic counselling', 'predictive testing', 'heterozygote advantage', 'founder effect', 'rare diseases'],
  prereq: ['pedigrees', 'dominance-types', 'mutations'],
  related: ['hardy-weinberg', 'genetic-drift', 'gene-therapy', 'crispr', 'genomics', 'karyotypes', 'medicine:dna-genes', 'medicine:screening-harms', 'medicine:bayes-diagnosis'],
  body: `
The human genome holds about 20 000 protein-coding genes, and everyone carries variants in some of them that would cause disease in two copies: most people are carriers of at least one recessive condition without knowing it. Genetic conditions fall into a few broad kinds:

- **Chromosomal** — extra, missing or rearranged chromosomes ([[karyotypes]]).
- **Single-gene (Mendelian)** — caused by variants in one gene and inherited in the patterns of [[pedigrees]]. Several thousand are known; each is rare, but together rare diseases, most of them genetic, affect an estimated 3.5–6 % of people (a 2020 estimate).
- **Mitochondrial** — variants in the small mitochondrial genome, passed on by mothers.
- **Multifactorial** — common conditions such as coronary heart disease, type 2 diabetes and many birth differences, shaped by many genes of small effect together with environment and way of life ([[polygenic-traits]]).
- **Somatic** — changes that arise in body cells during life rather than being inherited; most cancers are driven by them ([[medicine:cancer-genetics]]).

### Single-gene conditions
| Condition | Gene | Inheritance | Approximate frequency (population, date) |
|---|---|---|---|
| Cystic fibrosis | *CFTR* | autosomal recessive | 1 in 2 500–3 500 births of northern European ancestry; carriers about 1 in 25 |
| Sickle cell disease | *HBB* | autosomal recessive | roughly 300 000 babies a year worldwide (2010 estimate), most in sub-Saharan Africa |
| Phenylketonuria | *PAH* | autosomal recessive | about 1 in 10 000 births in Europe |
| Huntington disease | *HTT* | autosomal dominant | about 5–10 per 100 000 people of European ancestry |
| Familial hypercholesterolaemia | *LDLR* and others | autosomal dominant | about 1 in 250 |
| Haemophilia A | *F8* | X-linked recessive | about 1 in 5 000 male births |

A variant usually acts by changing a protein. The commonest cystic fibrosis variant, F508del — the loss of a single amino acid, found on about 70 % of affected chromosomes in northern Europe — makes a chloride channel that misfolds and seldom reaches the cell surface, so thick mucus builds up in the lungs and pancreas. In sickle cell disease one base change swaps glutamic acid for valine in β-globin; the haemoglobin polymerises when oxygen is low and bends red cells into sickles. In Huntington disease a run of CAG repeats in *HTT* is too long: 40 or more repeats cause the condition, and 36–39 sometimes do.

### Why harmful alleles persist
- **Hidden in carriers.** For a recessive allele of frequency $q$, carriers outnumber affected people by $2(1-q)/q$ — about 100 to 1 for cystic fibrosis — so selection against affected people removes few copies ([[hardy-weinberg]]).
- **Heterozygote advantage.** Carriers of the sickle-cell allele are protected against severe malaria, which keeps the allele common where malaria has long been widespread.
- **Founder effects and drift.** A small founding group may carry an allele by chance ([[genetic-drift]]), which is why some conditions are commoner in particular communities, as Tay–Sachs disease once was among Ashkenazi Jewish families.
- **Late onset and new mutations.** Huntington disease usually begins after people have had children, and some conditions are renewed by fresh mutations each generation.

Carrier frequencies differ between populations because of such history, but the same variants occur in people of every ancestry, and most human genetic variation lies within populations rather than between them. Testing offered by ancestry alone misses people — one reason many programmes now offer the same carrier panel to everyone.

### Genetic testing
| Kind of test | The question it answers |
|---|---|
| Newborn screening | Does this baby need early treatment? (a heel-prick blood spot in the first days of life: PKU since the 1960s, now cystic fibrosis, sickle cell disease and others) |
| Diagnostic | What explains this person's symptoms? (increasingly by exome or genome sequencing) |
| Carrier | Could a couple's children inherit a recessive condition? |
| Prenatal and preimplantation | Does a pregnancy or an embryo carry a particular condition? |
| Predictive | Will a person without symptoms develop a late-onset condition such as Huntington disease? |
| Pharmacogenetic | Will a medicine work, or cause harm, given a person's variants? |

Results are often probabilities rather than yes-or-no answers: a negative carrier test lowers a risk without removing it, some variants are "of uncertain significance", and a result can matter for relatives too. Genetic counselling helps people decide whether to be tested and what a result means, and many countries protect genetic information by law — in the USA, for example, the Genetic Information Nondiscrimination Act of 2008.

Treatments are improving. Newborn screening and a low-phenylalanine diet let children with PKU grow up without the intellectual disability it once caused; since 2019, medicines that help the faulty chloride channel fold and open have transformed the outlook of most people with cystic fibrosis; and in late 2023 the first CRISPR-based therapy was approved in the UK and the USA for sickle cell disease ([[gene-therapy]], [[crispr]]).

> [!note] These pages explain how genetic conditions work; they cannot tell anyone what they have or what to do. Questions about a condition in a family are best taken to a doctor or a genetic counsellor. We write "a person with cystic fibrosis" or "a child with sickle cell disease": a condition is something a person has, not who they are.
`,
  ideas: [
    'Genetic conditions can be chromosomal, single-gene, mitochondrial, multifactorial or somatic.',
    'Single-gene conditions are individually rare but collectively common; each follows a Mendelian pattern.',
    'Recessive alleles persist mostly hidden in healthy carriers; heterozygote advantage, founder effects and late onset also keep harmful alleles in populations.',
    'Genetic tests answer different questions — newborn, diagnostic, carrier, prenatal, predictive, pharmacogenetic — and often give probabilities, not certainties.',
    'Knowing the gene has led to treatments: diet for PKU, channel-correcting drugs for cystic fibrosis, gene editing for sickle cell disease.'
  ],
  pitfalls: [
    'Genetic means untreatable — Many genetic conditions can be treated or prevented from causing harm: diet for PKU, clotting-factor replacement for haemophilia, channel-correcting drugs for cystic fibrosis.',
    'Carriers of recessive conditions are rare — Most people carry at least one such variant; carriers are usually healthy and unaware of it.',
    'A condition that is commoner in one population occurs only there — The same variants occur in people of every ancestry; their frequencies differ because of history, such as founder effects and malaria.'
  ],
  formulas: [
    {
      name: 'Carrier frequency from the birth incidence (Hardy–Weinberg)',
      expr: 'C = 2*sqrt(I)*(1 - sqrt(I))', tex: 'C = 2\\sqrt{I}\\,\\left(1 - \\sqrt{I}\\right)',
      vars: {
        C: { name: 'frequency of carriers', q: 'ratio', unit: '%' },
        I: { name: 'incidence of the recessive condition at birth', q: 'ratio', unit: '%', value: 0.04, min: 0, max: 25 }
      },
      note: 'The allele frequency is q = √I and carriers are 2pq. Assumes random mating and a single common allele; it is an estimate for a population, not for a person.',
      stories: { C: 'A recessive condition affects {I} of births. What share of people are carriers?', I: '{C} of people carry a recessive allele. What share of births would be affected, with random mating?' }
    },
    {
      name: 'Carriers for each affected person',
      expr: 'k = 2*(1 - q)/q', tex: 'k = \\dfrac{2pq}{q^{2}} = \\dfrac{2\\,(1 - q)}{q}',
      vars: {
        k: { name: 'carriers per affected person' },
        q: { name: 'frequency of the recessive allele', q: 'ratio', unit: '%', value: 2, min: 0, max: 100 }
      },
      note: 'Why selection against a rare recessive allele is slow: nearly all copies sit in healthy carriers.',
      stories: { k: 'A recessive allele has a frequency of {q}. How many carriers are there for each person with the condition?', q: 'There are {k} carriers for each affected person. What is the allele frequency?' }
    },
    {
      name: 'Remaining chance of being a carrier after a negative test',
      expr: 'Pres = C*(1 - D)/(C*(1 - D) + 1 - C)', tex: 'P_{res} = \\dfrac{C\\,(1 - D)}{C\\,(1 - D) + (1 - C)}',
      vars: {
        Pres: { name: 'chance of being a carrier after a negative result', q: 'ratio', unit: '%', tex: 'P_{res}' },
        C: { name: 'chance of being a carrier before the test', q: 'ratio', unit: '%', value: 4, min: 0, max: 100 },
        D: { name: 'share of carriers the test detects', q: 'ratio', unit: '%', value: 90, min: 0, max: 100 }
      },
      note: 'Bayes\' theorem: carriers the test misses, C(1 − D), divided by everyone who tests negative (assuming no false positives). A good test lowers a risk; it rarely removes it.',
      stories: { Pres: 'Before testing, a person has a {C} chance of being a carrier. The test detects {D} of carriers and comes back negative. What chance remains?', D: 'A negative test lowers a {C} prior chance of being a carrier to {Pres}. What share of carriers does the test detect?' }
    }
  ],
  examples: [
    {
      title: 'Carriers of cystic fibrosis',
      q: 'Cystic fibrosis affects about 1 in 2 500 births in a population. Estimate the allele frequency, the carrier frequency and the number of carriers per affected person.',
      steps: [
        '$q = \\sqrt{1/2500} = 0.02$, so $p = 0.98$.',
        'Carriers: $2pq = 2 \\times 0.98 \\times 0.02 = 0.039$ — about 1 person in 25.',
        'Carriers per affected person: $2(0.98)/0.02 = 98$.'
      ],
      a: 'q ≈ 0.02; about 1 in 25 are carriers — roughly 100 for every person with the condition.'
    },
    {
      title: 'What a negative carrier test means',
      q: 'A person with no family history (prior chance of being a carrier 1 in 25) takes a test that detects 90 % of carriers, and the result is negative. What is the remaining chance that they are a carrier?',
      steps: [
        'Of 10 000 such people, 400 are carriers; the test finds 360 and misses 40.',
        'Everyone else, 9 600 people, tests negative too: 9 640 negatives, of whom 40 are carriers.',
        { text: 'The remaining chance:', tex: 'P_{res} = \\frac{0.04 \\times 0.10}{0.04 \\times 0.10 + 0.96} = \\frac{40}{9640} \\approx 0.0041' },
        'That is about 1 in 240 — ten times lower than before, but not zero.'
      ],
      a: 'About 1 in 240.'
    },
    {
      title: 'Two carriers of the sickle-cell allele',
      q: 'Two people with sickle-cell trait (each a carrier, $Aa$ with $a$ the sickle allele) have children. What are the chances for each child?',
      steps: [
        'Each parent passes $a$ with chance ½.',
        '$aa$ — sickle cell disease: ¼. $Aa$ — sickle-cell trait, usually without symptoms: ½. $AA$: ¼.',
        'The chances are the same for every child, independently of brothers and sisters.'
      ],
      a: '25 % sickle cell disease, 50 % sickle-cell trait, 25 % neither.'
    }
  ],
  quiz: [
    { q: 'A recessive condition affects 1 in 10 000 births. About what fraction of people are carriers?', choices: ['1 in 50', '1 in 100', '1 in 5 000', '1 in 10 000'], a: 0, why: '$q = \\sqrt{1/10\\,000} = 0.01$, so carriers are $2pq \\approx 0.02$ — 1 in 50, two hundred times as many as affected people.' },
    { q: 'A negative carrier test means that the person cannot be a carrier.', a: false, why: 'Most tests look for the commoner variants and miss some carriers. A negative result lowers the chance — often roughly tenfold — but does not remove it.' },
    { q: 'Why is the sickle-cell allele common where malaria has long been widespread?', choices: ['malaria causes the mutation', 'carriers are protected against severe malaria', 'people with sickle cell disease resist every infection', 'the allele spreads by infection'], a: 1, why: 'Heterozygotes survive malaria better than either homozygote, so selection keeps both alleles in the population: a balance of benefit in carriers and harm in homozygotes.' },
    { q: 'Newborn screening for phenylketonuria is valuable because…', choices: ['it corrects the gene', 'a diet started early prevents the harm the condition would otherwise cause', 'it predicts adult diseases', 'it finds carriers among the parents'], a: 1, why: 'Children with PKU cannot break down phenylalanine; a low-phenylalanine diet from the first weeks prevents the brain damage it would otherwise cause.' },
    { q: 'Which wording follows people-first language?', choices: ['a haemophiliac', 'a haemophilia sufferer', 'a person with haemophilia', 'a victim of haemophilia'], a: 2, why: 'Naming the person first treats the condition as something a person has, not as who they are, and avoids assuming suffering.' }
  ],
  problems: [
    { q: 'A recessive condition affects 1 in 10 000 births. Using Hardy–Weinberg proportions, what percentage of people are carriers?', answer: 1.98, unit: '%', tol: 0.02, steps: ['$q = 0.01$, $p = 0.99$.', '$2pq = 2 \\times 0.99 \\times 0.01 = 0.0198$, about 2 %.'] },
    { q: 'A test detects 95 % of carriers. A person whose prior chance of being a carrier is 1 in 25 tests negative. What chance, in per cent, remains that they are a carrier?', answer: 0.208, unit: '%', tol: 0.03, steps: ['Missed carriers: $0.04 \\times 0.05 = 0.002$.', 'All negatives: $0.002 + 0.96 = 0.962$.', '$0.002/0.962 = 0.00208$, about 0.21 % or 1 in 480.'] }
  ],
  applications: [
    'Newborn screening programmes that allow early treatment of PKU, congenital hypothyroidism, cystic fibrosis and sickle cell disease.',
    'Carrier screening offered to couples, which in communities that adopted it from the 1970s cut the number of babies born with Tay–Sachs disease by more than 90 %.',
    'Pharmacogenetics: testing variants that affect how medicines are handled before certain drugs are prescribed.',
    'Gene-targeted treatment: channel-correcting drugs for cystic fibrosis, gene therapy and genome editing.'
  ],
  history: 'Archibald Garrod described "inborn errors of metabolism" in 1908. In 1949 Linus Pauling and colleagues showed that sickle-cell haemoglobin differs from normal haemoglobin — the first "molecular disease" — and in 1956–1957 Vernon Ingram found the single amino-acid change. Robert Guthrie\'s blood-spot test made newborn screening for PKU possible in the early 1960s. The cystic fibrosis gene was found in 1989, the Huntington gene in 1993, and the draft human genome was published in 2001.',
  sim: 'gen-pedigree'
}

);
