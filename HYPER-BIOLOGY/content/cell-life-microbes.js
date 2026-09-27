/* HYPER-BIOLOGY · content/cell-life-microbes.js
 *
 * The life of a cell (topic cell-life: signalling, the cell cycle, mitosis, programmed cell death,
 * stem cells) and Microbiology (topic microbes-topic: bacterial growth, microbial metabolism,
 * antibiotics and resistance, biofilms and quorum sensing, microbes in food and industry, aseptic
 * technique). Simulations are in sims/cell-life-microbes.js (ids mic-*).
 */
Hyper.add(

/* ================================================================ THE LIFE OF A CELL */
{
  id: 'cell-signalling', parent: 'cell-life', title: 'Cell signalling', level: 2,
  short: 'How cells talk to each other: a signal molecule binds a receptor, a relay of proteins and small "second messengers" carries the message inside, and each enzyme step multiplies it — so a few hormone molecules can move a hundred million molecules of product.',
  keywords: ['cell signalling', 'cell signaling', 'signal transduction', 'ligand', 'receptor', 'G protein', 'GPCR', 'second messenger', 'cAMP', 'cyclic AMP', 'calcium', 'IP3', 'protein kinase', 'phosphorylation', 'amplification', 'cascade', 'receptor tyrosine kinase', 'adrenaline', 'epinephrine', 'steroid hormone', 'paracrine', 'endocrine', 'Kd', 'receptor occupancy', 'cholera toxin'],
  prereq: ['membrane-structure', 'protein-structure', 'enzymes'],
  related: ['enzyme-regulation', 'animal-hormones', 'cell-cycle', 'apoptosis', 'biofilms', 'enzyme-kinetics', 'medicine:hormones', 'medicine:how-drugs-work', 'medicine:synapses'],
  body: `
A liver cell cannot see that you are frightened. It learns it chemically: the adrenal glands release adrenaline, a few nanomoles per litre of it reach the liver in the blood, and within seconds the liver cells are breaking down glycogen and pouring glucose into the circulation. Every conversation between cells has the same three parts — **reception** (a signal molecule binds a receptor), **transduction** (the message is relayed and amplified inside the cell) and **response** (something changes: an enzyme, a channel, a gene).

### How far the message travels
| Kind of signalling | Distance | Examples |
|---|---|---|
| Endocrine | the whole body, through the blood | adrenaline, insulin, oestrogen, thyroxine |
| Paracrine | neighbouring cells, up to about a millimetre | growth factors, histamine, prostaglandins |
| Synaptic | across a gap of about 20 nm | acetylcholine, glutamate, GABA |
| Autocrine | back onto the cell that made it | interleukin-2 on T cells |
| Contact (juxtacrine) | cells that touch | Notch and Delta in embryos |

### Receptors
The signal molecule, the **ligand**, fits a binding site on a receptor protein much as a substrate fits an enzyme, and binding is reversible. The fraction of receptors occupied is $f = [L]/(K_d + [L])$, where the **dissociation constant** $K_d$ is the ligand concentration that fills half of them. Hormone receptors have $K_d$ values in the nanomolar to picomolar range, which is why hormones can work at such tiny concentrations.

Water-soluble ligands cannot cross the membrane, so their receptors sit in it:
- **G-protein-coupled receptors** (GPCRs) snake seven times through the membrane. A bound ligand makes the receptor swap GDP for GTP on a G protein inside, switching it on. Humans have about 800 GPCR genes — receptors for adrenaline, light (rhodopsin), odours and tastes among them — and roughly a third of approved medicines act on one.
- **Receptor tyrosine kinases** (for insulin and many growth factors) pair up when bound and phosphorylate each other, creating docking sites for relay proteins such as **Ras**.
- **Ligand-gated ion channels** simply open a pore: the acetylcholine receptor at a nerve–muscle junction lets Na⁺ flood in within a millisecond.

Small fat-soluble signals — steroid and thyroid hormones, nitric oxide — slip through the membrane and bind receptors inside. A steroid–receptor complex is itself a transcription factor that switches genes on, so its effects take hours rather than seconds.

### Second messengers and the amplifying cascade
A GPCR never carries its ligand inside; it passes the message on. The active G protein switches on **adenylyl cyclase**, which makes **cyclic AMP** (cAMP) from ATP; cAMP activates **protein kinase A**, which phosphorylates further enzymes. Small, fast-diffusing molecules made in large numbers — cAMP, Ca²⁺, IP₃, diacylglycerol — are called **second messengers**. Because most steps are enzymes acting on enzymes, each step multiplies the signal. The liver's response to adrenaline, in round numbers per bound hormone molecule:

| Stage | Active molecules |
|---|---|
| adrenaline bound to a receptor | 1 |
| G proteins and adenylyl cyclases switched on | about 10² |
| cAMP made | about 10⁴ |
| protein kinase A active | about 10⁴ |
| phosphorylase kinase active | about 10⁵ |
| glycogen phosphorylase active | about 10⁶ |
| glucose 1-phosphate released | about 10⁸ |

A chain of $n$ stages each gaining a factor $a$ amplifies by $a^n$: six stages averaging twenty-fold give $6\\times10^7$. Amplification is also why a response can be complete when only a few per cent of the receptors are occupied.

### Switching off
A signal is only useful if it stops. The G protein's own GTPase switches it off within seconds; **phosphodiesterases** destroy cAMP (caffeine partly blocks them); **phosphatases** strip the phosphates off; receptors are desensitised and pulled into the cell. Cholera toxin jams the G protein of gut cells in its "on" state: cAMP stays high, the cells pump chloride and water into the gut, and a person can lose many litres of fluid a day.

> [!key] A ligand fits a receptor; a relay of enzymes and second messengers carries and multiplies the message; something in the cell changes. Every step also has an off switch — and many diseases and drugs act on exactly these switches.

Faulty signalling runs through medicine: a Ras protein stuck "on" drives about a fifth of human cancers ([[cell-cycle]]); type 2 diabetes involves cells that respond poorly to insulin; beta blockers, antihistamines and opioids all act on GPCRs ([[medicine:how-drugs-work|how drugs work]]). Bacteria signal too, counting their own numbers by the molecules they release ([[biofilms]]).
`,
  ideas: [
    'Signalling has three parts: reception (ligand binds receptor), transduction (relay and amplification inside) and response.',
    'Receptor occupancy follows f = [L]/(Kd + [L]); hormone receptors have nanomolar or smaller Kd values.',
    'Water-soluble ligands act on membrane receptors (GPCRs, receptor kinases, ion channels); steroids cross the membrane and act on genes.',
    'Second messengers such as cAMP and Ca²⁺ and cascades of enzymes acting on enzymes amplify a signal by many orders of magnitude.',
    'Every step has an off switch — GTPases, phosphodiesterases, phosphatases, receptor desensitisation.'
  ],
  pitfalls: [
    'The hormone enters the cell and does the work itself — Most hormones never enter: the receptor at the surface relays the message, and second messengers made inside the cell carry it on.',
    'A cell needs most of its receptors occupied to respond fully — Thanks to amplification a full response often needs only a few per cent occupancy; the rest are "spare" receptors.',
    'A second messenger is just a copy of the first messenger inside the cell — It is a different, small molecule (cAMP, Ca²⁺, IP₃) made or released in large numbers by an enzyme or channel that the receptor switched on.'
  ],
  formulas: [
    {
      name: 'Receptor occupancy',
      expr: 'f = L/(Kd + L)', tex: 'f = \\dfrac{\\mathrm{[L]}}{K_d + \\mathrm{[L]}}',
      vars: {
        f: { name: 'fraction of receptors occupied', q: 'ratio', unit: '%' },
        L: { name: 'ligand concentration', q: 'concentration', unit: 'nM', value: 1, tex: '\\mathrm{[L]}' },
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'nM', value: 2, tex: 'K_d' }
      },
      note: 'Simple one-site binding at equilibrium, ligand not depleted by binding. The same hyperbola as Michaelis–Menten, with Kd in place of Km.',
      practice: { unknowns: ['f', 'L', 'Kd'] },
      stories: {
        f: 'A hormone circulates at {L}; its receptor has a dissociation constant of {Kd}. What fraction of the receptors is occupied?',
        L: 'What hormone concentration occupies {f} of receptors whose Kd is {Kd}?',
        Kd: 'At a ligand concentration of {L}, {f} of the receptors are occupied. What is the Kd?'
      }
    },
    {
      name: 'Amplification by a cascade',
      expr: 'Nout = Nin*a^n', tex: 'N_{out} = N_{in}\\,a^{n}',
      vars: {
        Nout: { name: 'product molecules (or active molecules at the end)', q: 'count', tex: 'N_{out}' },
        Nin: { name: 'signal molecules bound', q: 'count', value: 1, tex: 'N_{in}' },
        a: { name: 'gain per stage', q: 'ratio', value: 20, tex: 'a' },
        n: { name: 'number of amplifying stages', q: 'count', value: 6, int: true, tex: 'n' }
      },
      note: 'Assumes every stage multiplies by the same factor a; real stages differ (some, like cAMP → protein kinase A, barely amplify). Multiply the individual gains for a real cascade.',
      stories: {
        Nout: 'A cascade has {n} stages, each multiplying the signal {a}-fold, and {Nin} hormone molecules are bound. How many product molecules result?',
        n: 'How many stages of {a}-fold gain turn {Nin} bound hormone molecule into {Nout} product molecules?',
        a: 'A {n}-stage cascade turns {Nin} bound hormone molecule into {Nout} products. What is the average gain per stage?'
      }
    },
    {
      name: 'Second messenger decay after the signal stops',
      expr: 'c = c0*exp(-k*t)', tex: 'c = c_0\\,e^{-k\\,t}',
      vars: {
        c: { name: 'second messenger concentration', q: 'concentration', unit: 'µM', tex: 'c' },
        c0: { name: 'concentration when the signal stops', q: 'concentration', unit: 'µM', value: 1, tex: 'c_0' },
        k: { name: 'breakdown rate constant', q: 'rate', unit: '1/s', value: 0.07, tex: 'k' },
        t: { name: 'time since the signal stopped', q: 'time', unit: 's', value: 30, tex: 't' }
      },
      note: 'First-order breakdown by phosphodiesterase with no new synthesis; the half-life is ln 2 / k (10 s for k = 0.07 per second).',
      stories: {
        c: 'cAMP stands at {c0} when the hormone is washed away; phosphodiesterase breaks it down with a rate constant of {k}. What is left after {t}?',
        t: 'How long after the signal stops does cAMP fall from {c0} to {c}, if k = {k}?'
      }
    }
  ],
  examples: [
    {
      title: 'Why low occupancy is enough',
      q: 'A hormone receptor has $K_d$ = 1 nM. During stress the hormone rises from 0.1 nM to 1 nM. What fraction of receptors is occupied before and after?',
      steps: [
        'Before: $f = 0.1/(1 + 0.1) = 0.091$ — about 9 %.',
        'After: $f = 1/(1 + 1) = 0.50$ — half.',
        'A tenfold rise in hormone gives a 5.5-fold rise in occupancy. With a cascade amplifying $10^7$-fold behind the receptor, 9 % occupancy may already give a substantial response.'
      ],
      a: 'About 9 % before and 50 % after.'
    },
    {
      title: 'Counting stages',
      q: 'A cascade has five enzyme stages, each amplifying 30-fold. How many product molecules per bound hormone? How many stages of tenfold gain would do the same?',
      steps: [
        '$30^5 = 2.43\\times10^7$ products per hormone molecule.',
        'Tenfold stages: $n = \\log_{10}(2.43\\times10^7) = 7.4$ — between seven and eight.'
      ],
      a: 'About 2.4 × 10⁷ products; it would take seven or eight tenfold stages.'
    },
    {
      title: 'Caffeine and the fading signal',
      q: 'After a hormone is removed, cAMP is broken down with a half-life of 10 s. What fraction remains after 30 s? What if a phosphodiesterase inhibitor doubles the half-life?',
      steps: [
        '$k = \\ln 2/10 = 0.069$ per second; after 30 s, $e^{-0.069\\times30} = 0.125$ — one eighth (three half-lives).',
        'With a 20 s half-life, $k = 0.035$ per second: $e^{-0.035\\times30} = 0.35$.',
        'The signal lingers almost three times as strongly — the inhibitor prolongs every cAMP-driven response.'
      ],
      a: '12.5 % remains; with the inhibitor about 35 %.'
    }
  ],
  quiz: [
    { q: 'Why can a steroid hormone such as cortisol act on a receptor inside the cell, while adrenaline cannot?', choices: ['Steroids are smaller than adrenaline', 'Steroids are lipid-soluble and diffuse through the membrane; adrenaline is water-soluble and charged', 'Adrenaline is destroyed at the membrane', 'Steroid receptors are more sensitive'], a: 1, why: 'The lipid bilayer lets small non-polar molecules through; adrenaline is polar and charged, so its receptor must be on the surface. Size is not the issue — cortisol (362 g/mol) is larger than adrenaline (183 g/mol).' },
    { q: 'A ligand is present at three times its $K_d$. What percentage of receptors is occupied?', answer: 75, unit: '%', why: 'f = 3Kd/(Kd + 3Kd) = 3/4.' },
    { q: 'Cholera toxin locks the G protein of gut cells in its active, GTP-bound state. What happens to cAMP in those cells?', choices: ['It falls to zero', 'It stays high even without a signal', 'It rises briefly and then falls normally', 'Nothing: cAMP is made by the receptor'], a: 1, why: 'The G protein cannot switch itself off, so adenylyl cyclase keeps making cAMP; the cells secrete chloride and water continuously — the watery diarrhoea of cholera.' },
    { q: 'Which statement about signal amplification is correct?', choices: ['Every step of a cascade multiplies the signal by the same amount', 'Amplification happens where one active enzyme activates or makes many molecules of the next', 'Amplification happens only at the receptor', 'Ion channels cannot amplify a signal'], a: 1, why: 'Enzymes are catalysts: one active adenylyl cyclase makes many cAMP molecules, one kinase phosphorylates many targets. Steps where one molecule activates just one (cAMP binding to protein kinase A) barely amplify. An open channel lets millions of ions through, so channels amplify too.' },
    { q: 'A second messenger is the hormone itself after it has been carried into the cell.', a: false, why: 'Second messengers are different small molecules — cAMP, Ca²⁺, IP₃, diacylglycerol — produced or released inside the cell when the receptor is activated.' }
  ],
  problems: [
    { q: 'A receptor has $K_d$ = 2 nM. What ligand concentration occupies 90 % of the receptors?', answer: 18, unit: 'nM', tol: 0.02, steps: ['$0.9 = L/(2 + L)$, so $0.9 \\times 2 = 0.1\\,L$ and $L = 18$ nM — nine times $K_d$.'] },
    { q: 'A cascade has four stages with gains of 100, 50, 20 and 10. How many product molecules does one bound hormone produce?', answer: 1e6, tol: 0.02, steps: ['Multiply the gains: $100 \\times 50 \\times 20 \\times 10 = 10^6$.'] }
  ],
  applications: [
    'About a third of approved medicines act on G-protein-coupled receptors — beta blockers, antihistamines, opioids, many psychiatric drugs.',
    'Kinase inhibitors such as imatinib block a stuck-on signalling enzyme in some leukaemias.',
    'Biosensors and assays that read receptor binding measure hormones and drugs at nanomolar levels.',
    'Understanding cholera toxin led to oral rehydration solution, which uses glucose-driven sodium uptake that the toxin does not block.'
  ],
  history: 'Earl Sutherland found cyclic AMP as the "second messenger" of adrenaline in liver in the late 1950s (Nobel Prize 1971). Martin Rodbell and Alfred Gilman showed that G proteins couple receptors to enzymes (Nobel 1994), and Robert Lefkowitz and Brian Kobilka revealed how a GPCR works, down to a crystal structure of a receptor caught in the act of activating its G protein in 2011 (Nobel 2012).',
  sim: 'mic-cascade'
},

{
  id: 'cell-cycle', parent: 'cell-life', title: 'The cell cycle and its checkpoints', level: 2,
  short: 'The ordered sequence by which a cell grows, copies its DNA and divides — G1, S, G2 and M, about a day in a human cell — driven by cyclins and cyclin-dependent kinases and guarded by checkpoints that stop the cycle when DNA is damaged. When the brakes fail, the result is cancer.',
  keywords: ['cell cycle', 'interphase', 'G1', 'S phase', 'G2', 'M phase', 'G0', 'checkpoint', 'restriction point', 'cyclin', 'CDK', 'cyclin-dependent kinase', 'MPF', 'Rb', 'E2F', 'p53', 'p21', 'MDM2', 'spindle checkpoint', 'APC/C', 'oncogene', 'tumour suppressor', 'proto-oncogene', 'two-hit hypothesis', 'mitotic index', 'cancer'],
  prereq: ['dna-replication', 'cell-signalling', 'eukaryotic-cells'],
  related: ['mitosis', 'apoptosis', 'stem-cells', 'meiosis', 'mutations', 'medicine:cancer-biology', 'medicine:cancer-genetics', 'medicine:tumour-growth'],
  body: `
A human cell growing in a culture dish divides roughly once a day. Between divisions it must double everything — its proteins, membranes, organelles and, exactly once, all 6.4 billion base pairs of its DNA — and then share them out. The **cell cycle** is the ordered programme that does this. Most of it is **interphase**, the time between divisions:

| Phase | What happens | Typical length (human cell in culture) |
|---|---|---|
| G1 (gap 1) | grows, makes proteins and organelles, decides whether to divide | about 11 h — the most variable |
| S (synthesis) | replicates the DNA; each chromosome becomes two sister chromatids | about 8 h |
| G2 (gap 2) | keeps growing, checks and repairs the copies | about 4 h |
| M (mitosis and cytokinesis) | separates the chromosomes and splits the cell | about 1 h |

Cells that stop dividing leave G1 for a resting state, **G0**. Most neurons and heart muscle cells stay there for life; liver cells sit in G0 for a year or more but can re-enter the cycle when part of the liver is removed. Differences in cycle length between cell types are mostly differences in G1. At the extremes, the first cleavages of a frog embryo take about 30 minutes — S and M alternate with no gaps and no growth — and budding yeast in rich medium cycles in about 90 minutes.

### The engine: cyclins and CDKs
The cycle is driven by **cyclin-dependent kinases** (CDKs), enzymes that phosphorylate target proteins but only when bound to a partner **cyclin**. CDK levels stay roughly constant; the cyclins are made and destroyed on schedule, so each stage has its own active pair:

| Complex | Active | Job |
|---|---|---|
| cyclin D–CDK4/6 | through G1, while growth factors are present | starts the cycle by phosphorylating Rb |
| cyclin E–CDK2 | at the G1/S transition | commits the cell to S phase |
| cyclin A–CDK2 | S and G2 | fires replication origins, prevents re-replication |
| cyclin B–CDK1 | late G2 to metaphase | condenses chromosomes, dissolves the nuclear envelope |

At anaphase a ubiquitin ligase, the **anaphase-promoting complex** (APC/C), tags cyclin B for destruction; the collapse of CDK1 activity lets the cell leave mitosis and start afresh.

The key decision comes late in G1, at the **restriction point**. The retinoblastoma protein **Rb** holds the transcription factor E2F captive. Growth-factor signals ([[cell-signalling]]) make cyclin D; cyclin D–CDK4/6 phosphorylates Rb and releases some E2F, which switches on cyclin E and the replication genes; cyclin E–CDK2 phosphorylates Rb further and frees more E2F. This positive feedback flips the cell irreversibly into S phase. Remove the growth factors before the restriction point and the cell drifts into G0; remove them after it and the cell finishes the cycle anyway.

### Checkpoints
Checkpoints pause the cycle until a condition is met:
- **G1/S** — damaged DNA is not replicated.
- **Intra-S and G2/M** — mitosis waits until replication is complete and breaks are repaired.
- **Spindle assembly checkpoint** (metaphase to anaphase) — one unattached kinetochore sends enough "wait" signal to block the APC/C, so sister chromatids part only when every chromosome is attached to both poles ([[mitosis]]).

The guardian of the G1 checkpoint is **p53**. Normally it is made and destroyed within about twenty minutes, tagged by its partner MDM2. DNA damage activates kinases (ATM, ATR) that phosphorylate p53 and protect it; p53 accumulates and, as a transcription factor, switches on **p21**, a CDK inhibitor that halts the cycle, along with DNA-repair genes. If the damage is too great, p53 switches on genes for self-destruction instead ([[apoptosis]]). One damaged cell is sacrificed rather than risk a lineage of mutants.

### When the brakes fail: cancer
Cancer is at root a failure of cell-cycle control: cells that divide when they should not and do not die when they should. The genes involved come in two kinds:
- **Proto-oncogenes** are the accelerator — growth-factor receptors, Ras, cyclin D, Myc. One mutated copy stuck "on" (an **oncogene**) is enough to push the cycle.
- **Tumour suppressors** are the brakes and the quality control — Rb, p53, BRCA1 and BRCA2. Usually both copies must be lost. Alfred Knudson's **two-hit hypothesis** (1971) came from counting retinoblastomas: children who inherit one faulty *RB1* gene need only one more "hit" in a retinal cell, so they often develop tumours in both eyes, and early.

*TP53* is mutated in about half of all human tumours. A tumour typically needs several such changes, which is one reason most cancers are diseases of later life. More in [[medicine:cancer-biology|how cancer starts]] and [[medicine:cancer-genetics|cancer genetics]].

> [!key] G1 → S → G2 → M, driven by cyclin–CDK pairs made and destroyed on schedule, committed at the restriction point, and stopped at checkpoints by p53 and the spindle checkpoint when something is wrong. Cancer is what happens when the accelerators stick and the brakes fail.

### Measuring the phases
In a population dividing asynchronously, the share of cells in each phase reflects how long the phase lasts. The **mitotic index** (the fraction of cells in mitosis, counted under a microscope) and the cycle time give the length of mitosis. A growing population has more young cells than old ones, so the exact relation for mitosis, the last phase, is $t_M = T\\log_2(1 + \\mathrm{MI})$; the simple proportion $t_M \\approx \\mathrm{MI} \\cdot T$ is close only when the index is small.
`,
  ideas: [
    'Interphase (G1, S, G2) takes most of the cycle; M is about an hour of a roughly 24-hour human cycle, and G1 varies most.',
    'Cyclin–CDK pairs drive each transition; cyclins are made and destroyed on schedule, CDKs stay.',
    'At the restriction point, Rb phosphorylation releases E2F and positive feedback commits the cell to divide.',
    'Checkpoints (G1/S, G2/M, spindle) halt the cycle; p53 stops it via p21 when DNA is damaged and triggers apoptosis if repair fails.',
    'Cancer needs stuck accelerators (oncogenes) and failed brakes (tumour suppressors such as Rb and p53).'
  ],
  pitfalls: [
    'Interphase is a resting phase — It is the busiest part of the cycle: the cell grows, doubles its contents and replicates its whole genome. The resting state is G0.',
    'A mutated p53 makes cells divide faster — p53 is a brake and a quality check, not an accelerator. Losing it lets damaged cells keep dividing and accumulate more mutations, which is what makes it dangerous.',
    'Cyclins are enzymes that drive the cycle — Cyclins are regulatory partners with no enzyme activity of their own; the kinases (CDKs) do the phosphorylating, and only when a cyclin is bound.'
  ],
  formulas: [
    {
      name: 'Length of mitosis from the mitotic index',
      expr: 'tM = T*log2(1 + MI)', tex: 't_M = T\\,\\log_2(1 + \\mathrm{MI})',
      vars: {
        tM: { name: 'duration of mitosis', q: 'time', unit: 'h', tex: 't_M' },
        T: { name: 'cell-cycle time', q: 'time', unit: 'h', value: 24, tex: 'T' },
        MI: { name: 'mitotic index (fraction of cells in mitosis)', q: 'ratio', unit: '%', value: 4, tex: '\\mathrm{MI}' }
      },
      note: 'For an exponentially growing, asynchronous population with no resting or dying cells. The textbook shortcut t = MI × T is close for small indices but runs low (by about 30 % at MI = 4 %).',
      stories: {
        tM: 'A culture doubles every {T} and {MI} of its cells are in mitosis. How long does mitosis last?',
        MI: 'In cells with a cycle of {T}, mitosis takes {tM}. What mitotic index do you expect?'
      }
    },
    {
      name: 'Cell number after dividing',
      expr: 'N = N0*2^(t/T)', tex: 'N = N_0\\,2^{t/T}',
      vars: {
        N: { name: 'number of cells', q: 'count', tex: 'N' },
        N0: { name: 'starting number of cells', q: 'count', value: 200000, tex: 'N_0' },
        t: { name: 'time elapsed', q: 'time', unit: 'day', value: 5, tex: 't' },
        T: { name: 'cell-cycle (doubling) time', q: 'time', unit: 'h', value: 24, tex: 'T' }
      },
      note: 'Every cell divides and none dies. Real tissues and tumours lose cells too, so their doubling time is far longer than their cell-cycle time.',
      stories: {
        N: 'You seed {N0} cells that divide every {T}. How many are there after {t}?',
        T: 'A culture grows from {N0} to {N} cells in {t}. What is its doubling time?'
      }
    }
  ],
  examples: [
    {
      title: 'How long is mitosis?',
      q: 'In a culture doubling every 22 h, 3.5 % of the cells are in mitosis. How long does mitosis take?',
      steps: [
        '$t_M = 22 \\times \\log_2(1.035) = 22 \\times 0.0496 = 1.09$ h — about 65 minutes.',
        'The shortcut $0.035 \\times 22 = 0.77$ h (46 min) is too short, because a growing population always has more newly born cells than cells about to divide.'
      ],
      a: 'About 65 minutes.'
    },
    {
      title: 'From one cell to a tumour',
      q: 'A tumour detectable on a scan contains about $10^9$ cells (roughly 1 cm³). How many doublings is that from one cell? How many more to reach a lethal burden of about $10^{12}$ cells?',
      steps: [
        '$\\log_2(10^9) = 9 \\times 3.32 = 29.9$ — about 30 doublings.',
        '$\\log_2(10^{12}) = 39.9$ — only about 10 doublings more.',
        'Most of a tumour\'s history is invisible: by the time it can be seen it has passed three quarters of its doublings. Because cells also die, real tumours double in weeks to months, not in a day.'
      ],
      a: 'About 30 doublings to 10⁹ cells, and only about 10 more to 10¹².'
    }
  ],
  quiz: [
    { q: 'Two kinds of human cell have cycle times of 18 h and 40 h. Which phase most likely accounts for the difference?', choices: ['G1', 'S', 'G2', 'M'], a: 0, why: 'S, G2 and M are fairly constant because DNA replication and mitosis take a fixed amount of work; the length of G1, where the cell decides whether to proceed, varies most.' },
    { q: 'A cell has lost both copies of the gene for Rb. What happens?', choices: ['It can no longer replicate its DNA', 'E2F is free, so the cell can enter S phase without growth-factor signals', 'It arrests permanently in G1', 'It skips mitosis'], a: 1, why: 'Rb holds E2F in check until growth-factor signalling phosphorylates it. Without Rb the restriction point is lost and the cell enters S phase on its own — the first step towards retinoblastoma.' },
    { q: 'A mutation in p53 directly makes a cell divide faster.', a: false, why: 'p53 is a brake that acts when DNA is damaged. Without it, damaged cells keep cycling and accumulate further mutations; the speed-up comes from other, later mutations.' },
    { q: 'Thirty doublings from a single cell give about how many cells?', answer: 1.07e9, why: '2³⁰ = 1 073 741 824, about a billion — a tumour of roughly one cubic centimetre.' },
    { q: 'One chromosome in a dividing cell has not attached to the spindle. What happens?', choices: ['Anaphase starts anyway and the chromosome is lost', 'The spindle assembly checkpoint blocks the APC/C and anaphase waits', 'The cell returns to G1', 'The chromosome is destroyed'], a: 1, why: 'A single unattached kinetochore generates a "wait" signal that inhibits the APC/C, so securin and cyclin B are not destroyed and sister chromatids stay together until every chromosome is attached.' }
  ],
  problems: [
    { q: 'A culture of 2 × 10⁵ cells doubles every 20 h. How many cells are there after 5 days?', answer: 1.28e7, tol: 0.02, steps: ['5 days = 120 h = 6 doublings.', '$2\\times10^5 \\times 2^6 = 1.28\\times10^7$ cells.'] },
    { q: 'In a population with an 18 h cycle, 5 % of cells are in mitosis. How many minutes does mitosis last?', answer: 76, unit: 'min', tol: 0.03, steps: ['$t_M = 18 \\times \\log_2(1.05) = 18 \\times 0.0704 = 1.27$ h ≈ 76 min.'] }
  ],
  applications: [
    'Cancer drugs aimed at the cycle: CDK4/6 inhibitors in breast cancer, and chemotherapy that damages DNA or blocks the spindle to kill dividing cells.',
    'Why chemotherapy hits hair follicles, gut lining and bone marrow: they are the body\'s fastest-cycling tissues.',
    'Radiotherapy relies on damaged cancer cells failing their checkpoints and dying.',
    'Cell biologists synchronise cultures (by starving them of growth factors, for example) to study one phase at a time.'
  ],
  history: 'Leland Hartwell found the budding-yeast "cell division cycle" (cdc) genes and the idea of checkpoints; Paul Nurse found the fission-yeast CDK, cdc2, and its human counterpart; Tim Hunt discovered cyclins in 1982 as proteins that rose and vanished with every division of sea-urchin eggs. They shared the Nobel Prize in 2001. p53, found in 1979, was first thought to be an oncogene; only in 1989 was it recognised as the most important tumour suppressor of all.',
  sim: 'mic-cell-cycle'
},

{
  id: 'mitosis', parent: 'cell-life', title: 'Mitosis', level: 1,
  short: 'The division of a nucleus into two identical nuclei: condensed chromosomes line up on a spindle of microtubules, their sister chromatids are pulled to opposite poles, and the cell splits in two. Each daughter gets exactly the chromosomes the parent had.',
  keywords: ['mitosis', 'prophase', 'prometaphase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis', 'chromatid', 'sister chromatids', 'centromere', 'kinetochore', 'spindle', 'centrosome', 'cohesin', 'separase', 'cleavage furrow', 'cell plate', 'diploid', '2n', 'nondisjunction', 'aneuploidy', 'colchicine', 'paclitaxel', 'chromosome number'],
  prereq: ['cell-cycle', 'dna-structure', 'cytoskeleton'],
  related: ['meiosis', 'karyotypes', 'stem-cells', 'nucleus-ribosomes', 'animal-development', 'medicine:cancer-treatment'],
  body: `
Mitosis shares one set of chromosomes, copied in S phase, equally between two nuclei; **cytokinesis** then splits the cell. It is how a fertilised egg becomes the roughly thirty trillion ($3\\times10^{13}$) cells of an adult, how skin, blood and gut lining are renewed, and how many single-celled eukaryotes reproduce. The goal is fidelity: each daughter must receive one copy of every chromosome — no more, no less.

### Counting chromosomes and chromatids
Human body cells have 46 chromosomes in 23 pairs — the diploid number, $2n = 46$. After S phase each chromosome consists of two identical **sister chromatids**, held together along their length by rings of the protein cohesin and most tightly at the **centromere**. The chromosome count stays at 46 until anaphase, when the sisters part and each becomes a chromosome in its own right: for a few minutes the cell holds 92, and each daughter receives 46.

| Stage | Chromosomes | Chromatids | DNA content |
|---|---|---|---|
| G1 | 46 | 46 | 2C |
| G2 to metaphase | 46 | 92 | 4C |
| anaphase (the whole cell) | 92 | 92 | 4C |
| each daughter after cytokinesis | 46 | 46 | 2C |

Here C is the DNA of one haploid set: about 3.1 billion base pairs, 3.3 pg. A diploid nucleus holds some 6.4 billion base pairs — about two metres of double helix, packed into a nucleus ten micrometres across.

### The stages
Mitosis is continuous, but it is divided into stages by what can be seen under the microscope. In a human cell in culture the whole of M takes about an hour.
- **Prophase** — the chromatin condenses, with the help of condensin, into compact rods visible under a light microscope; the two centrosomes, duplicated in S phase, move apart and nucleate the **spindle**, an array of microtubules.
- **Prometaphase** — CDK1 phosphorylates the nuclear lamina and the nuclear envelope breaks up. Microtubules grow and shrink, searching the space, and are captured by **kinetochores**, protein plates built on each centromere.
- **Metaphase** — every chromosome is attached by its two sister kinetochores to opposite poles and sits under tension on the **metaphase plate**. The spindle assembly checkpoint holds the cell here until the last kinetochore is attached ([[cell-cycle]]).
- **Anaphase** — the APC/C destroys securin, releasing the enzyme **separase**, which cuts the cohesin rings. The sisters move apart at about a micrometre per minute: kinetochore microtubules shorten (anaphase A) and the poles move apart (anaphase B). It is over in a few minutes.
- **Telophase** — nuclear envelopes re-form around the two sets, and the chromosomes decondense.
- **Cytokinesis** — in animal cells a contractile ring of actin and myosin tightens around the middle, creating the **cleavage furrow**. Plant cells, boxed in by rigid walls, instead build a **cell plate** from Golgi vesicles, growing from the centre outwards into a new wall.

> [!key] Copy (S phase), condense, attach every kinetochore to opposite poles, check, then cut the cohesin and pull the sisters apart. Mitosis gives two nuclei genetically identical to each other and to the parent.

### When it goes wrong
If sister chromatids fail to separate (**nondisjunction**), one daughter gets 47 chromosomes and the other 45 — **aneuploidy**. Most cancer cells are aneuploid, and many have lost the checkpoint that should have caught the error. Drugs that jam the spindle stop mitosis: colchicine, from the autumn crocus, is used to arrest cells in metaphase for [[karyotypes|karyotyping]]; the vinca alkaloids (vincristine) and taxanes (paclitaxel) are chemotherapy drugs that trigger the spindle checkpoint until dividing cancer cells die — and, because they strike all fast-dividing cells, cause hair loss and low blood counts.

### Mitosis and meiosis
Mitosis is one division that keeps the chromosome number and makes identical cells, for growth and repair. [[meiosis|Meiosis]] is two divisions that halve it and shuffle the genes, to make eggs and sperm. Their machinery is the same; what differs is how chromosomes are paired and attached in the first division.
`,
  ideas: [
    'Mitosis divides a copied set of chromosomes equally; each daughter is genetically identical to the parent.',
    'After S phase each chromosome has two sister chromatids; the chromosome number doubles only when they separate at anaphase.',
    'The stages — prophase, prometaphase, metaphase, anaphase, telophase — are followed by cytokinesis (furrow in animals, cell plate in plants).',
    'The spindle assembly checkpoint delays anaphase until every kinetochore is attached; separase then cuts cohesin.',
    'Errors give aneuploid cells; spindle poisons stop mitosis and are used in karyotyping and chemotherapy.'
  ],
  pitfalls: [
    'A chromosome in metaphase is two chromosomes — It is one chromosome made of two sister chromatids joined at the centromere; it counts as two only after the sisters separate at anaphase.',
    'DNA is copied during mitosis — It is copied in S phase, hours before; mitosis only separates the copies.',
    'Cytokinesis is part of mitosis — Strictly, mitosis is the division of the nucleus; cytokinesis, the division of the cytoplasm, overlaps its end but is a separate process (some cells, such as those of fruit-fly embryos, undergo mitosis without cytokinesis).'
  ],
  formulas: [
    {
      name: 'Cells after rounds of division',
      expr: 'N = N0*2^k', tex: 'N = N_0\\,2^{k}',
      vars: {
        N: { name: 'number of cells', q: 'count', tex: 'N' },
        N0: { name: 'starting number of cells', q: 'count', value: 1, tex: 'N_0' },
        k: { name: 'rounds of division', q: 'count', value: 45, int: true, tex: 'k' }
      },
      note: 'Every cell divides each round and none dies. In a real body many more divisions happen, because cells are continually lost and replaced.',
      stories: {
        N: 'Starting from {N0} cell, how many cells are made by {k} rounds of division?',
        k: 'How many rounds of division turn {N0} cell into {N} cells?'
      }
    },
    {
      name: 'Time to separate the chromatids',
      expr: 't = d/v', tex: 't = \\dfrac{d}{v}',
      vars: {
        t: { name: 'duration of anaphase movement', q: false, unit: 'min', tex: 't' },
        d: { name: 'distance each chromatid travels', q: false, unit: 'µm', value: 8, tex: 'd' },
        v: { name: 'speed of the chromatids', q: false, unit: 'µm/min', value: 1, tex: 'v' }
      },
      note: 'Anaphase A speeds are typically 0.5–2 µm per minute in animal cells — some fifty times slower than a free kinesin motor walks along a microtubule (about 0.8 µm per second).',
      stories: { t: 'Sister chromatids move {d} to the poles at {v}. How long does anaphase take?' }
    },
    {
      name: 'Length of DNA in a nucleus',
      expr: 'L = Nbp*h', tex: 'L = N_{bp}\\,h',
      vars: {
        L: { name: 'total length of the double helix', q: 'length', unit: 'm', tex: 'L' },
        Nbp: { name: 'number of base pairs', q: 'count', value: 6.4e9, tex: 'N_{bp}' },
        h: { name: 'rise per base pair (B-DNA)', q: 'length', unit: 'nm', value: 0.34, fixed: true, tex: 'h' }
      },
      note: 'A diploid human nucleus holds about 6.4 × 10⁹ base pairs; a metaphase chromosome packs its DNA some ten thousand times shorter.',
      stories: { L: 'A nucleus contains {Nbp} base pairs of DNA. How long is it laid end to end?', Nbp: 'How many base pairs make {L} of double helix?' }
    }
  ],
  examples: [
    {
      title: 'From one cell to a person',
      q: 'An adult has about $3\\times10^{13}$ cells. If every cell divided in step and none died, how many rounds of mitosis would it take to make them from the zygote?',
      steps: [
        '$k = \\log_2(3\\times10^{13}) = \\log_{10}(3\\times10^{13})/\\log_{10} 2 = 13.48/0.301 = 44.8$.',
        'About 45 rounds. In reality far more divisions happen over a lifetime — red cells alone are replaced at about two million a second.'
      ],
      a: 'About 45 rounds of division.'
    },
    {
      title: 'Packing a chromosome',
      q: 'Human chromosome 1 has about 248 million base pairs. How long is its DNA, and how much is it compacted in a metaphase chromosome about 10 µm long?',
      steps: [
        '$L = 2.48\\times10^8 \\times 0.34\\ \\mathrm{nm} = 8.4\\times10^7$ nm $= 8.4$ cm.',
        'Compaction: $0.084\\ \\mathrm{m} / 10^{-5}\\ \\mathrm{m} \\approx 8400$-fold.'
      ],
      a: 'About 8.4 cm of DNA, packed roughly 8000–10 000-fold.'
    }
  ],
  quiz: [
    { q: 'How many chromatids does a human cell contain at metaphase of mitosis?', answer: 92, why: '46 chromosomes, each made of two sister chromatids after S phase.' },
    { q: 'How many chromosomes does a human cell contain during anaphase (before cytokinesis)?', choices: ['23', '46', '92', '184'], a: 2, why: 'At anaphase the sisters separate and each counts as a chromosome: 2 × 46 = 92, shared 46 and 46 between the two poles.' },
    { q: 'What directly allows the sister chromatids to separate at anaphase?', choices: ['The nuclear envelope breaking down', 'Separase cutting the cohesin that holds them together', 'The chromosomes decondensing', 'DNA replication finishing'], a: 1, why: 'Once every kinetochore is attached, the APC/C destroys securin; the freed separase cleaves cohesin and the spindle pulls the sisters apart.' },
    { q: 'How does a plant cell divide its cytoplasm?', choices: ['With a contractile ring of actin and myosin', 'By building a cell plate from vesicles, from the centre outwards', 'By budding', 'It does not: plant cells stay multinucleate'], a: 1, why: 'A rigid wall cannot be pinched in; Golgi vesicles gather at the old metaphase plate and fuse into a new wall.' },
    { q: 'The two daughter cells of a mitosis are genetically different from each other, as siblings are.', a: false, why: 'Barring rare errors, they receive identical copies of every chromosome. Genetic shuffling happens in meiosis.' }
  ],
  problems: [
    { q: 'The fruit fly *Drosophila* has $2n = 8$. How many chromatids are in one of its cells at metaphase of mitosis?', answer: 16, tol: 0.001, steps: ['8 chromosomes × 2 sister chromatids = 16.'] },
    { q: 'A diploid human nucleus contains 6.4 × 10⁹ base pairs. How many metres of DNA is that?', answer: 2.18, unit: 'm', tol: 0.02, steps: ['$6.4\\times10^9 \\times 0.34\\times10^{-9}\\ \\mathrm{m} = 2.18$ m.'] }
  ],
  applications: [
    'Karyotyping: cells arrested in metaphase by colchicine show each chromosome at its most compact.',
    'Chemotherapy with taxanes and vinca alkaloids targets the mitotic spindle of dividing cancer cells.',
    'The mitotic index in a biopsy helps pathologists grade how aggressive a tumour is.',
    'Plant tissue culture and cloning rely on mitosis producing genetically identical cells.'
  ],
  history: 'Walther Flemming stained dividing salamander cells in the 1870s, saw the thread-like chromosomes split and move apart, and in 1882 named the process mitosis, from the Greek for thread. The molecular machinery — cohesin, separase and the spindle checkpoint — was worked out mostly in yeast in the 1990s.',
  sim: 'mic-mitosis'
},

{
  id: 'apoptosis', parent: 'cell-life', title: 'Programmed cell death', level: 2,
  short: 'Apoptosis is a tidy, genetically programmed suicide: the cell shrinks, cuts up its own proteins and DNA with enzymes called caspases, and is eaten by its neighbours without inflammation. Tens of billions of cells die this way in an adult every day; the programme sculpts embryos, removes dangerous cells, and fails in cancer.',
  keywords: ['apoptosis', 'programmed cell death', 'necrosis', 'caspase', 'Bcl-2', 'BAX', 'BAK', 'cytochrome c', 'apoptosome', 'death receptor', 'Fas', 'TNF', 'p53', 'DNA ladder', 'phosphatidylserine', 'blebbing', 'necroptosis', 'pyroptosis', 'C. elegans', 'cell turnover'],
  prereq: ['cell-cycle', 'cell-signalling', 'mitochondria-chloroplasts'],
  related: ['animal-development', 'animal-immunity', 'stem-cells', 'mutations', 'medicine:cancer-biology', 'medicine:adaptive-immunity', 'medicine:heart-attack'],
  body: `
An adult human replaces roughly 300 billion cells a day, most of them blood cells, and tens of billions of them die by deliberate self-destruction — hundreds of thousands every second. A cell that is damaged, infected, no longer needed or simply in the wrong place switches on an internal programme that dismantles it from within. This is **apoptosis** (from the Greek for leaves falling in autumn), and it is as much a part of normal life as division: in a tissue that stays the same size, every division is balanced by a death.

### Two ways to die
| | Apoptosis | Necrosis |
|---|---|---|
| Cause | an internal programme, set off by signals | injury: no oxygen, toxins, heat, trauma |
| Cell | shrinks; the membrane bulges into blebs | swells, organelles swell |
| Membrane | stays sealed; the cell breaks into apoptotic bodies | ruptures; the contents spill out |
| DNA | cut between nucleosomes into multiples of about 180 bp — a "ladder" on a gel | broken at random |
| Energy | needs ATP | none — it is passive |
| Aftermath | eaten by phagocytes, no inflammation | inflammation, harm to neighbours |
| Scale | single cells scattered through a healthy tissue | whole patches (a heart attack, a burn) |

### What it is for
- **Sculpting the body**: fingers separate when the cells of the webbing between them die; a tadpole's tail is resorbed at metamorphosis; about half the neurons first made in the developing brain die because they fail to connect.
- **Immune quality control**: more than 90 % of developing T cells in the thymus die, because their receptors are useless or react against the body's own tissues.
- **Defence**: cytotoxic T cells order virus-infected cells to kill themselves before the virus can multiply.
- **Genome protection**: a cell with DNA damage it cannot repair is removed via p53 ([[cell-cycle]]).
- **Turnover**: the gut lining is replaced every 3–5 days; a neutrophil lives about a day.

The worm *Caenorhabditis elegans* made the programme visible. Exactly 131 of the 1090 body cells made during its development die — the same cells in every worm — and mutants in the genes *ced-3*, *ced-4* and *ced-9* keep them alive or kill too many. Their human counterparts turned out to be a caspase, Apaf-1 and Bcl-2.

### The machinery
The executioners are **caspases**, protein-cutting enzymes made as inactive precursors. Initiator caspases activate executioner caspases (caspase-3 and -7), which cut hundreds of proteins — the nuclear lamina, the cytoskeleton, and the inhibitor that holds a DNA-cutting enzyme in check. Like a signalling cascade ([[cell-signalling]]) it amplifies, and unlike most cascades it cannot be undone.

Two pathways lead in:
- **Intrinsic (mitochondrial)** — stress, DNA damage or the loss of survival signals shifts the balance of the **Bcl-2 family** at the mitochondria. Pro-death members (BAX and BAK) punch holes in the outer mitochondrial membrane; cytochrome c leaks out and joins Apaf-1 in a wheel-shaped **apoptosome** that activates caspase-9. Anti-death members, Bcl-2 itself among them, block the holes.
- **Extrinsic (death receptor)** — a killer lymphocyte's Fas ligand, or the cytokine TNF, binds a death receptor on the target cell, which activates caspase-8 directly.

At the end the dying cell flips the lipid phosphatidylserine from the inner to the outer face of its membrane: an "eat me" signal for macrophages, which clear the remains within an hour or so — so quickly that apoptosis is rarely seen in tissue sections.

### Too little or too much
Cancer cells commonly evade apoptosis, by losing p53 or by making too much Bcl-2 — in follicular lymphoma a swap between chromosomes 14 and 18 puts the *BCL2* gene next to a powerful antibody-gene enhancer. Drugs that block Bcl-2, such as venetoclax (used in some leukaemias), give cancer cells that depend on it back the ability to die, and many chemotherapy drugs and radiotherapy work by triggering apoptosis. Too much apoptosis contributes to neurodegenerative disease. In a heart attack, cells at the centre of the starved zone die by necrosis and many around its edge by apoptosis ([[medicine:heart-attack|heart attack]]).

Other programmed deaths exist: **necroptosis** and **pyroptosis** are regulated too but end with the cell bursting, which deliberately alarms the immune system during infection.

> [!key] Apoptosis is death by a controlled, energy-requiring programme: caspases dismantle the cell from inside, the membrane stays sealed and phagocytes tidy up without inflammation. The balance between division and death sets the size of every tissue.
`,
  ideas: [
    'Apoptosis is programmed, energy-dependent and tidy; necrosis is accidental, passive and inflammatory.',
    'Caspases, activated in a cascade, dismantle the cell; DNA is cut into nucleosome-sized pieces.',
    'The intrinsic pathway runs through the Bcl-2 family and cytochrome c release from mitochondria; the extrinsic pathway through death receptors.',
    'Apoptosis sculpts embryos, culls useless or self-reactive immune cells and removes damaged cells.',
    'Tissue size is set by division minus death: cancers often grow because death is blocked, not only because division is faster.'
  ],
  pitfalls: [
    'All cell death is harmful — Tens of billions of cells die by apoptosis every day, and development, immunity and cancer prevention depend on it.',
    'Apoptosis and necrosis differ only in speed — They differ in mechanism and consequence: apoptosis is an active programme with an intact membrane and no inflammation; necrosis is uncontrolled swelling and bursting that inflames the surroundings.',
    'Tumours grow only because their cells divide fast — Growth is division minus death; a small drop in the death rate of a population whose divisions and deaths were balanced is enough to make it grow exponentially.'
  ],
  formulas: [
    {
      name: 'Turnover of a steady tissue',
      expr: 'D = N/tau', tex: 'D = \\dfrac{N}{\\tau}',
      vars: {
        D: { name: 'cells dying (and replaced) per day', q: 'rate', unit: '1/day', tex: 'D' },
        N: { name: 'number of cells in the tissue', q: 'count', value: 2.5e13, tex: 'N' },
        tau: { name: 'average lifespan of a cell', q: 'time', unit: 'day', value: 120, tex: '\\tau' }
      },
      note: 'For a population of constant size, where every death is replaced by a division. The default values are the red blood cells of an adult (which are removed by macrophages at the end of their 120 days).',
      stories: {
        D: 'A tissue of {N} cells whose cells live {tau} on average stays the same size. How many cells die and are replaced each day?',
        tau: 'A tissue of {N} cells replaces {D}. What is the average lifespan of its cells?'
      }
    },
    {
      name: 'Growth when division and death are out of balance',
      expr: 'N = N0*exp((b - d)*t)', tex: 'N = N_0\\,e^{(b - d)\\,t}',
      vars: {
        N: { name: 'number of cells', q: 'count', tex: 'N' },
        N0: { name: 'starting number of cells', q: 'count', value: 1e6, tex: 'N_0' },
        b: { name: 'division rate', q: 'rate', unit: '1/day', value: 0.1, tex: 'b' },
        d: { name: 'death rate', q: 'rate', unit: '1/day', value: 0.08, tex: 'd' },
        t: { name: 'time', q: 'time', unit: 'day', value: 30, tex: 't' }
      },
      note: 'Per-cell rates constant in time. The population is steady when b = d, grows when death falls below division and shrinks when it rises above.',
      stories: {
        N: '{N0} cells divide at {b} and die at {d}. How many are there after {t}?',
        d: 'A population of {N0} cells dividing at {b} becomes {N} cells in {t}. What is its death rate?'
      }
    }
  ],
  examples: [
    {
      title: 'Two million red cells a second',
      q: 'An adult has about $2.5\\times10^{13}$ red blood cells, each living about 120 days. How many must be removed and replaced every second?',
      steps: [
        '$D = 2.5\\times10^{13}/120 = 2.1\\times10^{11}$ per day.',
        'Per second: $2.1\\times10^{11}/86\\,400 = 2.4\\times10^6$.'
      ],
      a: 'About 2.4 million red cells a second.'
    },
    {
      title: 'A small change in death, a large change in size',
      q: 'In a patch of gut lining, cells divide and die at 0.20 per day each. A mutation lowers the death rate of one clone to 0.18 per day. How fast does the clone double, and how much does it grow in a year?',
      steps: [
        'Net rate: $0.20 - 0.18 = 0.02$ per day, so the doubling time is $\\ln 2/0.02 = 35$ days.',
        'In a year: $e^{0.02\\times365} = e^{7.3} \\approx 1500$-fold.',
        'A 10 % drop in the death rate, with no change at all in division, turns a steady tissue into an expanding clone.'
      ],
      a: 'Doubles every 35 days; about 1500-fold in a year.'
    }
  ],
  quiz: [
    { q: 'Which observation points to apoptosis rather than necrosis?', choices: ['Swollen cells with burst membranes and inflammation', 'Shrunken cells with blebs, DNA cut into a ladder of ~180 bp multiples, no inflammation', 'A large patch of dead tissue after a blocked artery', 'Cells dying without using any ATP'], a: 1, why: 'Shrinkage, blebbing, nucleosome-sized DNA fragments and quiet removal by phagocytes are the signature of apoptosis; swelling, rupture and inflammation are necrosis.' },
    { q: 'Why does apoptotic DNA run as a "ladder" on a gel?', choices: ['Caspases cut DNA at every gene', 'A caspase-activated nuclease cuts the linker DNA between nucleosomes, giving multiples of about 180 bp', 'DNA replicates in 180 bp pieces', 'Restriction enzymes are released from the mitochondria'], a: 1, why: 'Nucleosomes protect about 147 bp each; the nuclease cuts the exposed linker between them, so fragments come in multiples of the nucleosome repeat.' },
    { q: 'A cancer cell makes ten times the normal amount of Bcl-2. Which pathway of apoptosis is it most resistant to?', choices: ['The intrinsic (mitochondrial) pathway', 'The extrinsic (death-receptor) pathway only', 'Neither', 'Necrosis'], a: 0, why: 'Bcl-2 blocks BAX and BAK from releasing cytochrome c, the core of the intrinsic pathway used by DNA damage and many chemotherapy drugs.' },
    { q: 'Apoptosis needs energy in the form of ATP.', a: true, why: 'Forming the apoptosome, running the caspase programme and flipping phosphatidylserine all need ATP; a cell that runs out of ATP dies by necrosis instead.' },
    { q: 'A tissue of 10⁹ cells has an average cell lifespan of 5 days and stays the same size. How many cells die each day?', answer: 2e8, why: 'D = N/τ = 10⁹/5 = 2 × 10⁸ per day, each replaced by a division.' }
  ],
  problems: [
    { q: 'A population of 1000 cells divides at 0.50 per day and dies at 0.45 per day. How many cells are there after 60 days?', answer: 20086, tol: 0.02, steps: ['Net rate 0.05 per day; $1000 \\times e^{0.05\\times60} = 1000 \\times e^{3} = 2.0\\times10^4$.'] },
    { q: 'The gut lining holds roughly 10¹¹ epithelial cells and renews itself every 4 days. How many cells does it shed each day?', answer: 2.5e10, tol: 0.02, steps: ['$D = 10^{11}/4 = 2.5\\times10^{10}$ per day.'] }
  ],
  applications: [
    'Cancer treatment: radiotherapy and many chemotherapy drugs kill by triggering apoptosis; Bcl-2 blockers restore it in some leukaemias.',
    'Understanding why neurons are lost in stroke and neurodegenerative disease.',
    'Immunology: deletion of self-reactive lymphocytes, and cytotoxic T cells killing infected cells.',
    'Laboratory tests for apoptosis (annexin V binding phosphatidylserine, caspase assays) used in drug screening.'
  ],
  history: 'John Kerr, Andrew Wyllie and Alastair Currie described the orderly "shrinkage necrosis" of cells in 1972 and named it apoptosis. Sydney Brenner, H. Robert Horvitz and John Sulston traced every cell of *C. elegans*, found the genes of programmed cell death and shared the Nobel Prize in 2002.',
  sim: { id: 'mic-cell-cycle', params: { damage: 30 } }
},

{
  id: 'stem-cells', parent: 'cell-life', title: 'Stem cells and differentiation', level: 2,
  short: 'Stem cells can both renew themselves and give rise to specialised cells. Their potency ranges from the totipotent zygote, through pluripotent embryonic and induced (iPS) stem cells, to the multipotent stem cells that maintain adult blood, skin and gut. Blood stem-cell transplants are routine; most other stem-cell therapies are still in trials.',
  keywords: ['stem cell', 'totipotent', 'pluripotent', 'multipotent', 'unipotent', 'embryonic stem cell', 'ES cell', 'iPS cell', 'induced pluripotent stem cell', 'Yamanaka factors', 'differentiation', 'self-renewal', 'niche', 'transit-amplifying cell', 'haematopoietic stem cell', 'bone marrow transplant', 'Waddington landscape', 'nuclear transfer', 'cloning', 'organoid', 'regenerative medicine', 'teratoma'],
  prereq: ['cell-cycle', 'mitosis', 'eukaryotic-regulation'],
  related: ['epigenetics', 'animal-development', 'apoptosis', 'gene-therapy', 'biosafety-bioethics', 'medicine:blood-composition', 'medicine:type1-diabetes', 'medicine:parkinsons'],
  body: `
Almost every cell in your body carries the same genome, yet a neuron and a skin cell do utterly different jobs. They differ in which genes they use, and they reached their identities step by step from a single fertilised egg. **Stem cells** are the cells that keep the ability to make others: they can divide to make more of themselves (**self-renewal**) and to make daughters that go on to specialise (**differentiation**).

### Degrees of potency
| Potency | Can give rise to | Examples |
|---|---|---|
| Totipotent | every cell of the body and the placenta | the zygote and the cells of the first few divisions |
| Pluripotent | every cell of the body, but not the placenta | the inner cell mass of the blastocyst (about day 5), embryonic stem (ES) cells, iPS cells |
| Multipotent | the cell types of one tissue | blood-forming (haematopoietic) stem cells, neural stem cells, gut crypt stem cells |
| Unipotent | one cell type, while still self-renewing | muscle satellite cells, sperm-forming stem cells |

### How adult tissues are kept going
Adult stem cells are rare — perhaps one in ten or a hundred thousand bone-marrow cells is a true blood stem cell — and they divide seldom. They live in a **niche**, a neighbourhood of supporting cells and signals that keeps them undifferentiated. When a stem cell divides, on average one daughter remains a stem cell and the other becomes a **transit-amplifying** progenitor that divides quickly several more times before its descendants mature. The arrangement is clever: the precious, slowly dividing stem cells make few copying errors, and the short-lived amplifying cells do the bulk of the multiplying. Bone marrow turns out some 200 billion red cells and 100 billion neutrophils a day this way. Each crypt of the small intestine has about a dozen stem cells at its base, and the lining they feed is renewed every 3–5 days.

### Differentiation is gene regulation
A cell becomes a liver cell by switching on the liver's transcription factors and silencing the rest, and it keeps its identity through epigenetic marks — DNA methylation and modified histones — passed on at each division ([[epigenetics]], [[eukaryotic-regulation]]). Conrad Waddington pictured this in 1957 as a ball rolling down a landscape of branching valleys: easy to roll down, hard to climb back up.

### Turning back the clock
In 1962 John Gurdon put the nucleus of a tadpole's gut cell into a frog egg whose own nucleus had been destroyed, and got swimming tadpoles: a specialised cell still holds the whole genome. Dolly the sheep (1996) was cloned the same way from an adult udder cell. In 2006 Shinya Yamanaka found that just four transcription factors — Oct4, Sox2, Klf4 and c-Myc — reprogram mouse skin cells into **induced pluripotent stem (iPS) cells**; human iPS cells followed in 2007. iPS cells can be made from a patient's own tissue and need no embryos, but reprogramming is inefficient (well under one cell in a hundred) and any pluripotent cells left in a transplant can grow into a tumour called a teratoma.

### Therapy: what works and what is still being tested
- **Established**: blood stem-cell (bone marrow, blood or cord blood) transplants for leukaemias, lymphomas, severe immune deficiencies and some inherited blood disorders — first successful in 1968 and now performed tens of thousands of times a year worldwide. Skin grown from a patient's own cells for large burns; limbal stem cells for some injuries of the cornea. In 2023–24 a gene-edited treatment of a patient's own blood stem cells for sickle cell disease and β-thalassaemia was approved in the UK and the US ([[gene-therapy]]).
- **In clinical trials (mid-2020s)**: retinal cells made from ES or iPS cells for macular degeneration (the first iPS-derived transplant was in Japan in 2014), dopamine neurons for Parkinson's disease, insulin-making islet cells for type 1 diabetes. Early results in small groups of people are encouraging; none is yet a standard treatment.
- **Research tools**: **organoids** — miniature guts, kidneys or brain tissue grown from stem cells — for studying disease and testing drugs, reducing some animal experiments (the 3Rs: replace, reduce, refine).

> [!warn] Clinics in many countries sell unproven "stem-cell treatments" for conditions from arthritis to autism. Outside approved therapies and registered clinical trials there is no good evidence that they work, and people have been blinded, paralysed or infected by them. Questions about a treatment are best discussed with a specialist, and genuine trials are listed in public trial registries.

Human embryonic stem cells come from early embryos, usually ones left over from IVF, and their use is regulated differently from country to country; iPS cells eased but did not end the ethical debate ([[biosafety-bioethics]]).
`,
  ideas: [
    'A stem cell self-renews and gives rise to specialised cells; potency runs from totipotent through pluripotent and multipotent to unipotent.',
    'Adult tissues are maintained by rare, slowly dividing stem cells in niches feeding rapidly dividing transit-amplifying progenitors.',
    'Differentiation is a matter of which genes are expressed, locked in by transcription factors and epigenetic marks.',
    'Four transcription factors can reprogram adult cells into induced pluripotent stem cells.',
    'Blood stem-cell transplants are established medicine; most other stem-cell therapies are still in clinical trials.'
  ],
  pitfalls: [
    'Stem-cell therapy is already available for most diseases — Only a few are established (blood stem-cell transplants, some skin and eye treatments); the rest are in trials, and commercial clinics outside them sell unproven, sometimes dangerous procedures.',
    'Differentiated cells have lost the genes they do not use — Nuclear transfer and iPS cells show that a specialised cell keeps the whole genome; it has silenced, not discarded, the other programmes.',
    'Adult stem cells are pluripotent like embryonic stem cells — Most are multipotent or unipotent: a blood stem cell makes all kinds of blood cell but not, in any useful amount, neurons or liver.'
  ],
  formulas: [
    {
      name: 'Output of a transit-amplifying lineage',
      expr: 'P = s*2^k', tex: 'P = s\\,2^{k}',
      vars: {
        P: { name: 'mature cells produced per day', q: 'rate', unit: '1/day', tex: 'P' },
        s: { name: 'progenitors committed per day (from stem-cell divisions)', q: 'rate', unit: '1/day', value: 2e5, tex: 's' },
        k: { name: 'amplifying divisions before maturity', q: 'count', value: 20, int: true, tex: 'k' }
      },
      note: 'Every amplifying division doubles the lineage and none of its cells dies on the way; real lineages lose some cells, so they need more divisions.',
      stories: {
        P: 'Stem cells commit {s} to a lineage that divides {k} times before maturing. How many mature cells are made per day?',
        s: 'The marrow makes {P} with {k} amplifying divisions per lineage. How many progenitors must stem cells commit each day?',
        k: 'How many amplifying divisions turn {s} into {P}?'
      }
    },
    {
      name: 'Undifferentiated cells left in a transplant',
      expr: 'U = N*(1 - p)', tex: 'U = N\\,(1 - p)',
      vars: {
        U: { name: 'undifferentiated cells transplanted', q: 'count', tex: 'U' },
        N: { name: 'cells transplanted', q: 'count', value: 1e7, tex: 'N' },
        p: { name: 'purity (fraction fully differentiated)', q: 'ratio', unit: '%', value: 99.99, min: 0, max: 100, tex: 'p' }
      },
      note: 'Why pluripotent-cell therapies demand extreme purity: in mice a few hundred leftover pluripotent cells can seed a teratoma.',
      stories: {
        U: 'A dose of {N} retinal cells derived from iPS cells is {p} pure. How many undifferentiated cells does it contain?',
        p: 'What purity is needed so that a dose of {N} cells contains no more than {U} undifferentiated cells?'
      }
    }
  ],
  examples: [
    {
      title: 'How many stem-cell divisions make your blood?',
      q: 'The marrow makes about $2\\times10^{11}$ red cells a day. If each committed progenitor divides 20 times on the way, how many progenitors must be committed daily?',
      steps: [
        '$2^{20} = 1.05\\times10^6$ red cells per committed progenitor.',
        '$s = 2\\times10^{11}/1.05\\times10^{6} = 1.9\\times10^5$ per day.',
        'A pool of stem cells that divides rarely can easily supply this — the amplification is in the transit divisions.'
      ],
      a: 'About 190 000 committed progenitors a day.'
    },
    {
      title: 'Purity of a cell therapy',
      q: 'A dose of $10^7$ cells made from pluripotent stem cells is 99.99 % differentiated. How many undifferentiated cells does it carry, and what purity would bring that below one?',
      steps: [
        '$U = 10^7 \\times 0.0001 = 1000$ cells.',
        'For $U < 1$: $1 - p < 10^{-7}$, a purity above 99.99999 % — which is why such products are screened with very sensitive tests for leftover pluripotent cells.'
      ],
      a: '1000 undifferentiated cells; purity must exceed 99.99999 % for fewer than one.'
    }
  ],
  quiz: [
    { q: 'Which cells are pluripotent but not totipotent?', choices: ['The zygote', 'Cells of the inner cell mass of a blastocyst', 'Blood stem cells', 'Neurons'], a: 1, why: 'Inner-cell-mass cells (and ES cells made from them) can form every cell of the body but not the placenta; the zygote can do both; blood stem cells are multipotent; neurons are specialised.' },
    { q: 'How were the first iPS cells made?', choices: ['By fusing skin cells with eggs', 'By switching on four transcription factors in skin cells', 'By transplanting a nucleus into an egg', 'By growing cells from an early embryo'], a: 1, why: 'Yamanaka delivered the genes for Oct4, Sox2, Klf4 and c-Myc into mouse fibroblasts (2006). Nuclear transfer is Gurdon\'s older method; embryo-derived cells are ES cells.' },
    { q: 'Blood stem-cell (bone marrow) transplantation is an established treatment, used for decades.', a: true, why: 'Since 1968 it has treated leukaemias, lymphomas, immune deficiencies and inherited blood disorders; tens of thousands are done each year.' },
    { q: 'Why do tissues use transit-amplifying cells instead of letting stem cells divide rapidly themselves?', choices: ['Stem cells cannot divide', 'Few stem-cell divisions means few mutations in the long-lived cells that must last a lifetime', 'Transit-amplifying cells are pluripotent', 'It uses less energy'], a: 1, why: 'Each division risks copying errors. Keeping stem cells mostly quiet and doing the multiplication in short-lived progenitors protects the lineage — errors in progenitors are flushed out as the cells mature and die.' },
    { q: 'How many mature cells does one committed progenitor give after 15 amplifying divisions (no losses)?', answer: 32768, why: '2¹⁵ = 32 768.' }
  ],
  problems: [
    { q: 'A therapy delivers 5 × 10⁶ cells that are 99.9 % differentiated. How many undifferentiated cells are delivered?', answer: 5000, tol: 0.02, steps: ['$5\\times10^6 \\times (1 - 0.999) = 5000$.'] },
    { q: 'The marrow makes about 10¹¹ neutrophils a day. If each committed progenitor divides 17 times, how many progenitors must be committed per day?', answer: 7.63e5, tol: 0.02, steps: ['$2^{17} = 131\\,072$.', '$10^{11}/131\\,072 = 7.6\\times10^5$ per day.'] }
  ],
  applications: [
    'Blood stem-cell transplants for leukaemia, lymphoma and inherited blood and immune disorders.',
    'Patient-specific iPS cells to study diseases in a dish and screen drugs.',
    'Organoids for testing medicines on human tissue, reducing some animal testing.',
    'Gene-edited blood stem cells for sickle cell disease and β-thalassaemia.'
  ],
  history: 'James Till and Ernest McCulloch showed in 1961 that single marrow cells could rebuild the blood of irradiated mice — the first proof of stem cells. E. Donnall Thomas pioneered bone-marrow transplantation (Nobel 1990). Mouse ES cells were grown in 1981 and human ES cells by James Thomson in 1998. John Gurdon and Shinya Yamanaka shared the 2012 Nobel Prize for showing that specialised cells can be reprogrammed.'
},

/* ================================================================ MICROBIOLOGY */
{
  id: 'bacterial-growth', parent: 'microbes-topic', title: 'Bacterial growth', level: 2,
  short: 'Bacteria multiply by binary fission, so a population doubles every generation time — twenty minutes for E. coli in rich broth, most of a day for the tuberculosis bacterium. Growth is exponential only while the food lasts: a culture passes through lag, exponential, stationary and death phases.',
  keywords: ['bacterial growth', 'binary fission', 'generation time', 'doubling time', 'exponential growth', 'specific growth rate', 'growth curve', 'lag phase', 'log phase', 'exponential phase', 'stationary phase', 'death phase', 'carrying capacity', 'Monod equation', 'optical density', 'OD600', 'batch culture', 'psychrophile', 'mesophile', 'thermophile', 'cardinal temperatures'],
  prereq: ['prokaryotic-cells', 'population-growth', 'math:exponential-growth-decay'],
  related: ['microbial-metabolism', 'aseptic-technique', 'antibiotic-resistance', 'biofilms', 'enzyme-kinetics', 'lab-math', 'math:logarithms', 'math:logistic-equation', 'medicine:infection-spread'],
  body: `
A bacterium grows to about twice its size, copies its circular chromosome and splits down the middle: **binary fission**. Each daughter does the same, so the numbers run 1, 2, 4, 8, 16… — the population doubles every **generation time** $g$:

$$N = N_0\\,2^{t/g} = N_0\\,e^{\\mu t}, \\qquad \\mu = \\frac{\\ln 2}{g}$$

where $\\mu$ is the **specific growth rate**. The number of generations between two counts is $n = \\log_2(N/N_0) = 3.32\\,\\log_{10}(N/N_0)$.

| Organism | Conditions | Generation time |
|---|---|---|
| *Vibrio natriegens* | rich salty medium, 37 °C | just under 10 min |
| *Clostridium perfringens* | meat, near its optimum of 43–45 °C | about 10 min |
| *Escherichia coli* | rich broth, 37 °C | about 20 min |
| *E. coli* | glucose and mineral salts, 37 °C | about 50–60 min |
| *Staphylococcus aureus* | broth, 37 °C | about 30 min |
| *Mycobacterium tuberculosis* | 37 °C | about 18–24 h |
| bacteria in soil or the deep ocean | scarce food | days to years |

### The arithmetic of doubling
One *E. coli* cell weighs about a picogram ($10^{-15}$ kg). Doubling every 20 minutes, after one day (72 generations) it would have $2^{72} = 4.7\\times10^{21}$ descendants — nearly five thousand tonnes. After 133 generations, about 44 hours, the mass would be $2^{133}\\times10^{-15}$ kg $\\approx 10^{25}$ kg, more than the Earth ($6\\times10^{24}$ kg). It never happens because every cell eats: a millilitre of rich broth holds enough food for a few billion cells, and growth stops long before anything else runs out. Exponential growth is always a phase, never a way of life ([[population-growth]]).

### The growth curve
Put a few cells into fresh medium in a closed flask — a **batch culture** — and count them over time. On a logarithmic axis, where exponential growth is a straight line, four phases appear:
1. **Lag phase** — the cells adjust: they make the enzymes and ribosomes the new medium calls for and repair damage, and hardly divide. Minutes to hours; longer if the inoculum was old, chilled or moved to a poorer medium.
2. **Exponential (log) phase** — steady doubling at the fastest rate the conditions allow. The cells are uniform, and most sensitive to antibiotics that attack growth.
3. **Stationary phase** — a nutrient runs out or waste such as acid builds up; numbers level off at the **carrying capacity** $K$, typically $10^9$–$10^{10}$ cells per mL for *E. coli* in rich broth. Cells shrink and switch on stress genes; *Bacillus* and *Clostridium* make heat-resistant endospores.
4. **Death phase** — cells die, usually exponentially and often slowly (a few per cent an hour), so a flask may hold living cells for days.

A useful model is logistic growth after a lag: $N = K/\\left[1 + \\left(K/N_0 - 1\\right)e^{-\\mu t}\\right]$.

### What sets the pace
- **Food.** At low concentrations of the limiting nutrient the growth rate follows Jacques Monod's equation, $\\mu = \\mu_{max}S/(K_s + S)$ — the same hyperbola as an enzyme ([[enzyme-kinetics]]), because nutrients are taken up by saturable transporters. For *E. coli* on glucose $K_s$ is only a few micromolar. How far the culture grows is set by the amount of food and the **yield**: aerobically, about half a gram of cells (dry mass) per gram of glucose ([[microbial-metabolism]]).
- **Temperature.** Every species has a minimum, an optimum and a maximum. Psychrophiles grow best below 15 °C, mesophiles at 20–45 °C (nearly all human pathogens), thermophiles at 45–80 °C (compost heaps, hot springs) and hyperthermophiles above 80 °C, up to a record 122 °C for an archaeon from deep-sea vents. The rate climbs towards the optimum and collapses a few degrees above it as proteins unfold. A fridge at 4 °C slows most food-poisoning bacteria almost to a stop — though a few, such as *Listeria*, still creep along.
- **pH, oxygen, salt and sugar** (jam and salted fish keep because water is not available to microbes), and competition from other microbes.

### Measuring growth
- **Turbidity**: a spectrophotometer reads the optical density at 600 nm. For *E. coli*, an OD of 1 is very roughly $8\\times10^8$ cells per mL — fast, but it counts dead cells too, and is linear only at low densities.
- **Viable counts**: dilute in tenfold steps and spread a known volume on agar; each living cell grows into a colony, counted as **colony-forming units** (CFU) ([[aseptic-technique]]).
- **Counting chambers and flow cytometers** count cells directly.

> [!key] Doubling gives $N = N_0 2^{t/g}$, a straight line on a log plot. In a closed flask it lasts only until food runs out: lag, exponential growth, stationary phase at the carrying capacity, then death.
`,
  ideas: [
    'Binary fission doubles a population every generation time: N = N₀·2^(t/g), with specific growth rate μ = ln 2/g.',
    'Generation times range from under ten minutes to many hours, depending on the species and conditions.',
    'A batch culture passes through lag, exponential, stationary and death phases; exponential growth is a straight line on a log scale.',
    'Growth rate depends on nutrient concentration (Monod), temperature (cardinal temperatures), pH and water; the carrying capacity depends on how much food there is.',
    'Growth is measured by turbidity (total cells) or by viable counts in colony-forming units.'
  ],
  pitfalls: [
    'Bacteria in a flask keep growing exponentially — Only while nutrients last; in a closed flask they reach a stationary phase within hours and then die off.',
    'A short generation time means a big final population — The generation time sets how fast the culture grows; the final density is set by how much food there is. A slow grower in rich medium ends up denser than a fast one in poor medium.',
    'Stationary phase means every cell has stopped dividing — The count is steady because division and death balance or both slow down; many cells are alive and busy adapting to stress.'
  ],
  formulas: [
    {
      name: 'Exponential growth by doubling',
      expr: 'N = N0*2^(t/g)', tex: 'N = N_0\\,2^{t/g}',
      vars: {
        N: { name: 'cell density', q: 'numberdensity', unit: '1/mL', tex: 'N' },
        N0: { name: 'starting cell density', q: 'numberdensity', unit: '1/mL', value: 1000, tex: 'N_0' },
        t: { name: 'time', q: 'time', unit: 'h', value: 5, tex: 't' },
        g: { name: 'generation time', q: 'time', unit: 'min', value: 20, tex: 'g' }
      },
      note: 'The exponential phase only: no lag, no limit, no death.',
      practice: { unknowns: ['N', 't', 'g'] },
      stories: {
        N: 'Broth is seeded with {N0} of E. coli, which divides every {g}. What is the density after {t}?',
        t: 'Starting from {N0}, with a generation time of {g}, how long until the culture reaches {N}?',
        g: 'A culture grows from {N0} to {N} in {t}. What is the generation time?'
      }
    },
    {
      name: 'Specific growth rate and generation time',
      expr: 'mu = ln(2)/g', tex: '\\mu = \\dfrac{\\ln 2}{g}',
      vars: {
        mu: { name: 'specific growth rate', q: 'rate', unit: '1/h', tex: '\\mu' },
        g: { name: 'generation time', q: 'time', unit: 'min', value: 20, tex: 'g' }
      },
      stories: { mu: 'A bacterium divides every {g}. What is its specific growth rate?', g: 'A culture grows with a specific growth rate of {mu}. What is its generation time?' }
    },
    {
      name: 'Monod: growth rate and the limiting nutrient',
      expr: 'mu = mumax*S/(Ks + S)', tex: '\\mu = \\dfrac{\\mu_{max}\\,S}{K_s + S}',
      vars: {
        mu: { name: 'specific growth rate', q: 'rate', unit: '1/h', tex: '\\mu' },
        mumax: { name: 'maximum specific growth rate', q: 'rate', unit: '1/h', value: 2, tex: '\\mu_{max}' },
        S: { name: 'limiting nutrient concentration', q: 'concentration', unit: 'µM', value: 10, tex: 'S' },
        Ks: { name: 'half-saturation constant', q: 'concentration', unit: 'µM', value: 4, tex: 'K_s' }
      },
      note: 'Empirical, like Michaelis–Menten: at S = Ks the cells grow at half their maximum rate.',
      stories: {
        mu: 'E. coli (μmax = {mumax}, Ks = {Ks} for glucose) finds {S} of glucose. How fast does it grow?',
        S: 'What glucose concentration lets a bacterium with μmax = {mumax} and Ks = {Ks} grow at {mu}?'
      }
    },
    {
      name: 'Logistic growth to the carrying capacity',
      expr: 'N = K/(1 + (K/N0 - 1)*exp(-mu*t))', tex: 'N = \\dfrac{K}{1 + \\left(\\dfrac{K}{N_0} - 1\\right)e^{-\\mu t}}',
      vars: {
        N: { name: 'cell density', q: 'numberdensity', unit: '1/mL', tex: 'N' },
        K: { name: 'carrying capacity', q: 'numberdensity', unit: '1/mL', value: 2e9, tex: 'K' },
        N0: { name: 'starting cell density', q: 'numberdensity', unit: '1/mL', value: 1e4, tex: 'N_0' },
        mu: { name: 'specific growth rate', q: 'rate', unit: '1/h', value: 2, tex: '\\mu' },
        t: { name: 'time after the lag', q: 'time', unit: 'h', value: 6, tex: 't' }
      },
      note: 'A smooth approach to K; real cultures often stop more abruptly, when a nutrient runs out.',
      stories: {
        N: 'A flask with carrying capacity {K} is seeded at {N0}; the cells grow at {mu}. What is the density {t} after the lag?',
        t: 'How long after the lag does a culture seeded at {N0}, growing at {mu} towards {K}, reach {N}?'
      }
    }
  ],
  examples: [
    {
      title: 'Outweighing the Earth',
      q: 'One *E. coli* cell weighs about $10^{-15}$ kg. If it and its descendants doubled every 20 minutes without limit, how long until their mass exceeded the Earth\'s, $6\\times10^{24}$ kg?',
      steps: [
        'Cells needed: $6\\times10^{24}/10^{-15} = 6\\times10^{39}$.',
        'Generations: $\\log_2(6\\times10^{39}) = 39.78/0.301 = 132.1$ — so 133 doublings.',
        'Time: $133 \\times 20$ min $= 2660$ min $\\approx 44$ h.',
        'In reality a litre of broth supports only about $10^{12}$ cells — a gram or so — and the curve bends over within hours.'
      ],
      a: 'About 44 hours — less than two days.'
    },
    {
      title: 'Measuring a generation time',
      q: 'A culture holds $2\\times10^4$ cells per mL at 1 h and $6.4\\times10^6$ per mL at 5 h. What is the generation time?',
      steps: [
        'Ratio: $6.4\\times10^6/2\\times10^4 = 320$.',
        'Generations: $\\log_2 320 = 8.32$.',
        '$g = 240\\ \\mathrm{min}/8.32 = 28.8$ min, and $\\mu = \\ln 2/g = 1.44$ per hour.'
      ],
      a: 'About 29 minutes.'
    },
    {
      title: 'A picnic salad in the sun',
      q: 'A salad carries 100 *Staphylococcus aureus* cells per gram. At a warm 35 °C they divide about every 30 minutes. How many are there after 5 hours, ignoring the lag?',
      steps: [
        '5 h = 10 generations: $100 \\times 2^{10} = 1.0\\times10^5$ per gram.',
        'Food-safety guidance treats counts like this as a hazard, because *S. aureus* makes a heat-stable toxin once numbers are high; cooling below 5 °C stops the doubling almost completely.'
      ],
      a: 'About 10⁵ cells per gram.'
    }
  ],
  quiz: [
    { q: 'A culture at 10⁸ cells per mL doubles every 20 minutes. About how many minutes until it reaches 10⁹ per mL (still exponential)?', answer: 66, unit: 'min', why: 'A tenfold rise needs log₂10 = 3.32 generations: 3.32 × 20 ≈ 66 min.' },
    { q: 'How does the exponential phase appear on a plot of log(cell number) against time?', choices: ['As a curve bending upwards', 'As a straight line whose slope is the growth rate', 'As a horizontal line', 'As an S-shape'], a: 1, why: 'log N = log N₀ + (μ/ln 10)·t is linear in t; that is why growth curves are plotted on a log axis.' },
    { q: 'Cells from an old stationary-phase culture are moved into fresh broth. Compared with cells taken from an exponential culture, their lag phase is…', choices: ['shorter', 'longer', 'the same', 'absent'], a: 1, why: 'Starved, stressed cells must first repair damage and rebuild ribosomes and enzymes before they can divide; cells already growing fast barely pause.' },
    { q: 'In stationary phase every cell has stopped dividing.', a: false, why: 'The count stays level because division and death balance or both slow; many cells are alive, some still divide.' },
    { q: 'Most bacteria that cause disease in humans are…', choices: ['psychrophiles', 'mesophiles', 'thermophiles', 'hyperthermophiles'], a: 1, why: 'Body temperature, 37 °C, sits in the mesophile range; organisms adapted to it grow best between about 20 and 45 °C.' }
  ],
  problems: [
    { q: 'Ten *E. coli* cells divide every 20 minutes for 3 hours. How many cells are there?', answer: 5120, tol: 0.001, steps: ['3 h = 9 generations.', '$10 \\times 2^9 = 5120$.'] },
    { q: 'A culture grows from 1.0 × 10³ to 1.6 × 10⁴ cells per mL in 2 hours. What is its generation time in minutes?', answer: 30, unit: 'min', tol: 0.02, steps: ['Ratio 16 = 2⁴: four generations.', '$120/4 = 30$ min.'] }
  ],
  applications: [
    'Draw a growth curve and work out a plate count in [the growth calculator](#/tools/cell/growth).',
    'Food safety: keeping food cold or hot enough to stop doubling, and "use by" dates built on growth rates.',
    'Industrial fermenters are run to keep cells in the exponential phase for as long as possible.',
    'Clinical microbiology: slow growers such as M. tuberculosis need weeks of culture before a result.',
    'Predicting how quickly an infection or a contamination can grow.'
  ],
  history: 'Antonie van Leeuwenhoek saw bacteria in 1676. Robert Koch\'s laboratory introduced solid media in the early 1880s — agar, suggested by Fanny Hesse from her kitchen — and Julius Petri\'s dish in 1887, which made pure cultures and counting possible. Jacques Monod\'s thesis of 1942 turned bacterial growth into quantitative science and led him to the lac operon.',
  sim: ['mic-flask', 'mic-dilution']
},

{
  id: 'microbial-metabolism', parent: 'microbes-topic', title: 'Microbial metabolism', level: 2,
  short: 'Microbes have found almost every way of making a living that chemistry allows: energy from light or from chemical reactions, electrons from food or from rocks and gases, carbon from sugars or straight from CO₂. Some breathe nitrate, sulfate or iron instead of oxygen, and a few can pull nitrogen out of the air.',
  keywords: ['microbial metabolism', 'autotroph', 'heterotroph', 'phototroph', 'chemotroph', 'lithotroph', 'organotroph', 'chemolithotroph', 'chemoautotroph', 'photoautotroph', 'nitrogen fixation', 'nitrogenase', 'Rhizobium', 'root nodule', 'leghaemoglobin', 'nitrification', 'denitrification', 'methanogen', 'sulfate reduction', 'anaerobic respiration', 'obligate anaerobe', 'facultative anaerobe', 'microaerophile', 'hydrothermal vent', 'growth yield'],
  prereq: ['atp-energy', 'oxidative-phosphorylation', 'bacteria-archaea'],
  related: ['fermentation', 'nitrogen-cycle', 'carbon-cycle', 'photosynthesis', 'bacterial-growth', 'microbes-industry', 'three-domains', 'chemistry:redox-reactions', 'chemistry:gibbs-energy'],
  body: `
Plants and animals between them use two ways of life: plants build their food from light and carbon dioxide; animals eat it and burn it with oxygen. Microbes use both and a dozen more. Any organism's metabolism can be placed by answering three questions:

| Question | Answer | Prefix |
|---|---|---|
| Where does the energy come from? | light, or chemical reactions | photo-, chemo- |
| Where do the electrons come from? | organic molecules, or inorganic ones (H₂, H₂S, NH₃, Fe²⁺, even H₂O) | organo-, litho- |
| Where does the carbon come from? | CO₂, or organic molecules | auto-, hetero- |

| Way of life | Examples |
|---|---|
| photolithoautotroph | plants, algae and cyanobacteria (electrons from water); purple and green sulfur bacteria (from H₂S) |
| photoorganoheterotroph | purple non-sulfur bacteria, which use light but eat organic acids |
| chemolithoautotroph | nitrifiers (*Nitrosomonas*: ammonia to nitrite; *Nitrobacter*: nitrite to nitrate), sulfur and iron oxidisers, methanogenic archaea (H₂ + CO₂ → CH₄) |
| chemoorganoheterotroph | animals, fungi, *E. coli* and nearly all disease-causing bacteria |

### Living on rocks and gases
Chemolithotrophs "eat" inorganic chemicals. Sergei Winogradsky discovered them in the 1880s, in sulfur bacteria and in the nitrifiers of soil. In 1977 the submersible *Alvin* found whole ecosystems around hydrothermal vents on the Galápagos Rift, 2.5 km down in total darkness: giant tubeworms, clams and mussels, all fed by bacteria that oxidise hydrogen sulfide from the vents with oxygen from the seawater. The tubeworm *Riftia* has no mouth or gut; its body is packed with these bacteria.

Such reactions release little energy. Oxidising a mole of nitrite to nitrate gives *Nitrobacter* about 74 kJ, against 2870 kJ from a mole of glucose burnt to CO₂ — and it must spend part of it making NADH by running its electron chain backwards. So nitrifiers process huge amounts of substrate and grow slowly, dividing once every many hours.

### Breathing without oxygen
Respiration needs a final electron acceptor at the end of the electron transport chain ([[oxidative-phosphorylation]]). Oxygen gives the most energy; when it runs out, many microbes use others, in roughly this order of decreasing yield:
- **nitrate** — denitrifying bacteria turn it into N₂ gas, which is how waterlogged fields lose fertiliser;
- **manganese(IV) and iron(III)** — iron reducers in sediments;
- **sulfate** — sulfate reducers make H₂S, the rotten-egg smell of black mud;
- **CO₂** — methanogenic archaea make methane in wetlands, rice paddies, landfills and the rumens of cattle; microbes make most of the methane entering the atmosphere.

**Fermentation** needs no outside acceptor at all: an organic molecule is both donor and acceptor, and glycolysis yields just 2 ATP per glucose ([[fermentation]]).

| Relation to oxygen | Behaviour | Examples |
|---|---|---|
| obligate aerobe | needs O₂ | *Mycobacterium tuberculosis*, *Pseudomonas* |
| facultative anaerobe | uses O₂ when present; otherwise ferments or respires something else | *E. coli*, brewer's yeast |
| microaerophile | needs a little O₂ (2–10 %) | *Campylobacter*, *Helicobacter* |
| aerotolerant anaerobe | ignores O₂ and ferments | lactic acid bacteria |
| obligate anaerobe | poisoned by O₂ | *Clostridium*, methanogens, most gut *Bacteroides* |

### Fixing nitrogen
Nitrogen gas is 78 % of the air, but its triple bond is so strong that no plant or animal can use it. Only certain bacteria and archaea can, with the enzyme **nitrogenase**, at a cost of 16 ATP per molecule of N₂:

$$\\ce{N2 + 8H+ + 8e- -> 2NH3 + H2}$$

Nitrogenase is destroyed by oxygen, so fixers protect it: cyanobacteria such as *Anabaena* fix nitrogen in thick-walled cells called heterocysts; *Rhizobium* bacteria live inside root nodules of peas, beans and clover, where the plant's **leghaemoglobin** (which makes a healthy nodule pink) holds oxygen low but steady. Natural fixation adds very roughly 200 million tonnes of nitrogen a year to land and sea, comparable with the 120 million tonnes or so made industrially by the Haber–Bosch process ([[nitrogen-cycle]]).

### From energy to biomass
The energy a microbe captures decides how much of itself it can build. The **growth yield** — grams of cells per gram of substrate — is about 0.5 for aerobic growth on glucose, 0.1–0.2 when the same sugar is fermented, and far lower for chemolithotrophs. Yields decide how much food a fermenter needs and how much sludge a sewage works produces ([[microbes-industry]]).

> [!key] Energy from light or chemistry, electrons from organic or inorganic donors, carbon from CO₂ or food: microbes use every combination. Respiration can end on oxygen, nitrate, iron, sulfate or CO₂, and the energy per reaction sets how fast a microbe grows and how much of it there can be.
`,
  ideas: [
    'Metabolism is classified by energy source (photo/chemo), electron source (litho/organo) and carbon source (auto/hetero).',
    'Chemolithotrophs live on inorganic chemicals such as ammonia, H₂S, Fe²⁺ and H₂; whole vent ecosystems run on them.',
    'Anaerobic respiration uses nitrate, iron(III), sulfate or CO₂ as the final electron acceptor; fermentation uses none.',
    'Nitrogen fixation by nitrogenase costs 16 ATP per N₂ and must be shielded from oxygen.',
    'The energy captured per reaction sets the growth yield: about 0.5 g of cells per g of glucose aerobically, far less for chemolithotrophs.'
  ],
  pitfalls: [
    'All life ultimately depends on sunlight — Chemolithoautotrophs run on chemical energy from rocks and vents; the vent communities would survive a dark sky for as long as their oxygen lasted (that oxygen itself comes from photosynthesis above).',
    'Anaerobic means fermenting — Many anaerobes respire, using nitrate, sulfate, iron or CO₂ instead of oxygen at the end of an electron transport chain; fermentation is a different process with no external acceptor.',
    'Plants fix nitrogen — Only bacteria and archaea have nitrogenase; legumes house the bacteria in their root nodules and trade them sugar for ammonia.'
  ],
  formulas: [
    {
      name: 'ATP made from a reaction',
      expr: 'n = eta*dG/dGp', tex: 'n_{ATP} = \\dfrac{\\eta\\,\\Delta G_{r}}{\\Delta G_{p}}',
      vars: {
        n: { name: 'ATP made per mole of substrate (mol/mol)', tex: 'n_{ATP}' },
        eta: { name: 'fraction of the energy captured', q: 'ratio', unit: '%', value: 55, min: 0, max: 100, tex: '\\eta' },
        dG: { name: 'free energy released per mole of substrate (the size of ΔG)', q: 'molarenergy', unit: 'kJ/mol', value: 2870, tex: '\\Delta G_{r}' },
        dGp: { name: 'free energy to make one mole of ATP in the cell', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: '\\Delta G_{p}' }
      },
      note: 'About 50 kJ/mol is needed to make ATP at the concentrations found in cells (more than the 30.5 kJ/mol of standard conditions). Aerobic respiration of glucose captures a little over half its energy.',
      stories: {
        n: 'A reaction releases {dG} per mole; the cell captures {eta} of it, and each ATP costs {dGp}. How many ATP per mole of substrate?',
        eta: 'A cell makes {n} ATP from a reaction releasing {dG} per mole, at {dGp} per ATP. What fraction of the energy does it capture?'
      }
    },
    {
      name: 'Biomass from substrate (growth yield)',
      expr: 'X = Y*S', tex: 'X = Y_{X/S}\\,S',
      vars: {
        X: { name: 'dry biomass produced', q: 'massconc', unit: 'g/L', tex: 'X' },
        Y: { name: 'growth yield (g cells per g substrate)', value: 0.5, tex: 'Y_{X/S}' },
        S: { name: 'substrate consumed', q: 'massconc', unit: 'g/L', value: 2, tex: 'S' }
      },
      note: 'Typical yields on glucose: about 0.5 aerobically, 0.1–0.2 fermenting. One E. coli cell is about 0.3 pg of dry mass, so 1 g/L of cells is roughly 3 × 10⁹ cells per mL.',
      stories: {
        X: 'Bacteria growing aerobically (yield {Y}) use up {S} of glucose. How much dry biomass do they make?',
        S: 'How much glucose must be consumed, at a yield of {Y}, to make {X} of cells?'
      }
    }
  ],
  examples: [
    {
      title: 'Glucose against nitrite',
      q: 'Compare the ATP available from burning a mole of glucose ($|\\Delta G| = 2870$ kJ) with oxidising a mole of nitrite ($|\\Delta G| = 74$ kJ), if the cell captures 55 % and ATP costs 50 kJ/mol.',
      steps: [
        'Glucose: $0.55 \\times 2870/50 = 31.6$ ATP — close to the 30–32 counted by biochemists.',
        'Nitrite: $0.55 \\times 74/50 = 0.81$ ATP — less than one per molecule.',
        '*Nitrobacter* must oxidise dozens of times more substrate than *E. coli* for the same energy, which is why nitrifiers grow slowly.'
      ],
      a: 'About 32 ATP per glucose against less than 1 per nitrite.'
    },
    {
      title: 'How dense can a culture get?',
      q: 'A medium contains 20 g/L of glucose. If bacteria grow on it aerobically with a yield of 0.5 g/g, how much dry biomass can they make, and about how many cells per mL is that (0.3 pg dry mass per cell)?',
      steps: [
        '$X = 0.5 \\times 20 = 10$ g/L of dry cells.',
        'Cells: $10\\ \\mathrm{g/L} = 10^{-2}\\ \\mathrm{g/mL}$; $10^{-2}/(0.3\\times10^{-12}) = 3.3\\times10^{10}$ per mL — which is why industrial fermenters feed oxygen and sugar hard to reach such densities.'
      ],
      a: '10 g/L of biomass, about 3 × 10¹⁰ cells per mL.'
    },
    {
      title: 'The price of nitrogen',
      q: 'A good soybean crop fixes about 100 kg of nitrogen per hectare. At 8 ATP per NH₃, how many moles of ATP does that cost, and how much glucose would supply it at 30 ATP per glucose?',
      steps: [
        'Moles of N: $100\\,000\\ \\mathrm{g}/14\\ \\mathrm{g/mol} = 7140$ mol of NH₃.',
        'ATP: $8 \\times 7140 = 57\\,000$ mol.',
        'Glucose: $57\\,000/30 = 1900$ mol $\\times 180$ g/mol $\\approx 340$ kg per hectare — before counting the electrons, which roughly double the bill. The plant pays for its fertiliser in sugar.'
      ],
      a: 'About 57 000 mol of ATP, or some 340 kg of glucose per hectare (more with the electrons).'
    }
  ],
  quiz: [
    { q: '*Nitrosomonas* gets its energy by oxidising ammonia and builds its cells from CO₂. It is a…', choices: ['photoautotroph', 'chemolithoautotroph', 'chemoorganoheterotroph', 'photoheterotroph'], a: 1, why: 'Energy from a chemical reaction (chemo), electrons from an inorganic donor (litho), carbon from CO₂ (auto).' },
    { q: 'Why do nitrifying bacteria grow so much more slowly than *E. coli* in broth?', choices: ['They lack ribosomes', 'Each reaction they use releases little free energy, so they make little ATP per molecule processed', 'They are killed by oxygen', 'They can only divide in the dark'], a: 1, why: 'Oxidising ammonia or nitrite releases a small fraction of the energy of burning glucose; the cells must turn over vast amounts of substrate to grow at all.' },
    { q: 'Every microbe that lives without oxygen does so by fermentation.', a: false, why: 'Many respire anaerobically, passing electrons to nitrate, iron(III), sulfate or CO₂ through an electron transport chain; fermentation is a separate strategy with no external acceptor.' },
    { q: 'Why are healthy legume root nodules pink inside?', choices: ['They contain chlorophyll breakdown products', 'Leghaemoglobin binds oxygen, keeping it low enough for nitrogenase while still supplying respiration', 'The bacteria are red', 'They store iron for the plant'], a: 1, why: 'Nitrogenase is destroyed by O₂, yet the bacteroids need oxygen for respiration to fuel it; leghaemoglobin buffers oxygen at a very low, steady level.' },
    { q: 'Bacteria grow on 4 g/L glucose with a yield of 0.5 g/g. How many g/L of dry biomass can they make?', answer: 2, unit: 'g/L', why: 'X = Y·S = 0.5 × 4 = 2 g/L.' }
  ],
  problems: [
    { q: 'Ammonia oxidation to nitrite releases about 275 kJ/mol. If a nitrifier captures 40 % of it and ATP costs 50 kJ/mol, how many ATP does it make per ammonia?', answer: 2.2, tol: 0.02, steps: ['$0.40 \\times 275/50 = 2.2$ ATP per NH₃.'] },
    { q: 'Yeast ferments 5 g/L of sugar with a biomass yield of 0.1 g/g. How much yeast (g/L dry mass) is produced?', answer: 0.5, unit: 'g/L', tol: 0.02, steps: ['$X = 0.1 \\times 5 = 0.5$ g/L; the rest of the sugar ends up as ethanol and CO₂.'] }
  ],
  applications: [
    'Sewage works use nitrifiers and denitrifiers to remove ammonia and nitrate before water is released.',
    'Legume crops and rotations supply nitrogen with no manufactured fertiliser.',
    'Biogas plants use methanogens to turn waste into methane fuel.',
    'Bioleaching: iron- and sulfur-oxidising bacteria help extract copper and gold from low-grade ores.'
  ],
  history: 'Sergei Winogradsky discovered chemolithotrophy in sulfur bacteria in 1887 and isolated the nitrifying bacteria soon after. Martinus Beijerinck isolated *Rhizobium* from root nodules in 1888. The discovery of the Galápagos vent communities in 1977 showed that whole ecosystems can run on chemical energy.'
},

{
  id: 'antibiotic-resistance', parent: 'microbes-topic', title: 'Antibiotics and resistance', level: 2,
  short: 'Antibiotics kill bacteria or stop their growth by hitting targets our own cells lack or build differently — the cell wall, the bacterial ribosome, DNA gyrase, folate synthesis. In a population of billions a few resistant mutants already exist, and treatment selects them; resistance genes also jump between bacteria on plasmids. Careful use slows the process.',
  keywords: ['antibiotic', 'antibiotic resistance', 'antimicrobial resistance', 'AMR', 'penicillin', 'beta-lactam', 'beta-lactamase', 'MRSA', 'vancomycin', 'bacterial ribosome', 'tetracycline', 'macrolide', 'aminoglycoside', 'fluoroquinolone', 'DNA gyrase', 'sulfonamide', 'trimethoprim', 'folate', 'rifampicin', 'MIC', 'selective toxicity', 'bactericidal', 'bacteriostatic', 'horizontal gene transfer', 'conjugation', 'plasmid', 'efflux pump', 'persisters', 'combination therapy', 'stewardship'],
  prereq: ['bacterial-growth', 'natural-selection', 'mutations'],
  related: ['gene-flow-mutation', 'prokaryotic-cells', 'biofilms', 'translation', 'viruses', 'microbiome', 'medicine:antibiotics', 'medicine:antimicrobial-resistance', 'medicine:tuberculosis', 'medicine:how-drugs-work'],
  body: `
Before antibiotics, an infected scratch could turn into fatal blood poisoning, and pneumonia killed around a third of the people admitted to hospital with it. Penicillin, used on patients from 1941, and the flood of drugs that followed changed medicine more than almost anything else — surgery, chemotherapy and intensive care all depend on them. And bacteria began to resist them almost at once.

### Selective toxicity: hitting what we lack
An antibiotic must damage the bacterium and spare the patient, so the best targets are structures that bacteria have and we do not, or build differently:

| Target | What the drug does | Classes (examples) |
|---|---|---|
| cell wall (peptidoglycan) | blocks the enzymes (penicillin-binding proteins) that cross-link the wall; growing cells burst | β-lactams (penicillins, cephalosporins, carbapenems); glycopeptides (vancomycin) |
| ribosome, 30S subunit | stops or garbles protein synthesis | aminoglycosides (gentamicin), tetracyclines |
| ribosome, 50S subunit | blocks the growing protein chain | macrolides (erythromycin), chloramphenicol, linezolid |
| DNA gyrase and topoisomerase IV | traps the enzymes that untwist DNA, breaking the chromosome | fluoroquinolones (ciprofloxacin) |
| folate synthesis | blocks two steps in making folate for nucleotides — we take ours from food | sulfonamides, trimethoprim |
| RNA polymerase | blocks transcription | rifampicin |
| outer membrane | disrupts it like a detergent | polymyxins (colistin) |

Bacterial ribosomes (70S) differ enough from our cytoplasmic ones (80S) to be hit selectively — though our mitochondria, descendants of bacteria, have ribosomes of the bacterial type, which explains some side effects. **Bactericidal** drugs kill; **bacteriostatic** ones halt growth and leave the immune system to finish the job. Potency is measured as the **minimum inhibitory concentration** (MIC), the lowest concentration that prevents visible growth in a standard test. Antibiotics do nothing against viruses, which have none of these targets ([[viruses]]).

### How bacteria resist
- **Destroy or modify the drug** — β-lactamase enzymes cut open the β-lactam ring; extended-spectrum β-lactamases and carbapenemases defeat even the newest members of the class.
- **Change the target** — MRSA carries *mecA*, the gene for a penicillin-binding protein that β-lactams barely bind; one amino-acid change in DNA gyrase weakens fluoroquinolone binding; methylating ribosomal RNA blocks macrolides.
- **Pump it out** — efflux pumps, some of which expel several classes at once.
- **Keep it out** — fewer porin channels in the outer membrane of Gram-negative bacteria.
- **Go round it** — an extra, insensitive copy of the target enzyme.

Resistance is not the same as **tolerance**: dormant **persister** cells and bacteria in [[biofilms]] survive a course without any resistance gene, then regrow as sensitive as before.

### Evolution in fast-forward
Resistance is [[natural-selection]] happening in front of us, and it has two sources.

**Mutation.** For many drugs, resistant mutants arise at a frequency of about one in $10^7$ to $10^9$ cells, while a serious infection can hold $10^9$ to $10^{11}$ bacteria. So resistant mutants are usually present *before* the first dose: the chance that at least one exists in a population of $N$ is $P = 1 - e^{-Nu}$. The drug does not create them; it removes their competitors. As the susceptible majority dies, the rare resistant cells inherit the space, and their share rises exponentially.

**Horizontal gene transfer.** Bacteria swap genes across strains and even species: **conjugation** passes plasmids from cell to cell through a pilus; **transformation** takes up DNA released by dead cells; **transduction** carries genes inside bacteriophages. A single plasmid may carry resistance to five or more drugs on transposons and integrons, so using one drug can select resistance to all five. The carbapenemase NDM-1, first identified in 2008, spread on plasmids through many species and across the world within a few years ([[gene-flow-mutation]]).

Resistance genes themselves are ancient — some have been found in 30 000-year-old permafrost — because most antibiotics are weapons that soil microbes such as *Streptomyces* have made for hundreds of millions of years. What is new is the pressure.

**Combination therapy** turns the arithmetic around. In tuberculosis, rifampicin resistance arises in about one bacillus in $10^8$ and isoniazid resistance in about one in $10^6$; resistance to both at once, in about one in $10^{14}$ — far more than the $10^8$–$10^9$ bacilli in a lung cavity. That is why tuberculosis is treated with several drugs together ([[medicine:tuberculosis|tuberculosis]]).

### The size of the problem
Drug-resistant bacterial infections were estimated to have directly caused about 1.27 million deaths worldwide in 2019 and to have been involved in nearly 5 million (the Global Research on Antimicrobial Resistance study, 2022). Almost all antibiotics in use belong to classes discovered between 1940 and 1970.

### Stewardship
Every use selects resistance — in the patient's infection, in the trillions of harmless bacteria of their gut ([[microbiome]]), and on farms, where antibiotics were long used to make animals grow faster (banned for that purpose in the EU since 2006). Stewardship means using antibiotics only for bacterial infections, choosing the narrowest drug that works at the right dose for the right length of time — often shorter than it used to be, as trials have shown — and cutting infections in the first place with hygiene, clean water and vaccines. Resistance often carries a fitness cost, so resistant strains can decline when a drug is withdrawn, but compensating mutations reduce the cost and resistance tends to linger.

> [!note] How long an antibiotic is taken is decided by the prescriber, on the evidence for that infection. The standard advice is to take it exactly as prescribed, not to save or share leftovers, and to ask before stopping or changing it. More in [[medicine:antibiotics|antibiotics]] and [[medicine:antimicrobial-resistance|antimicrobial resistance]].

> [!warn] An infection that is getting worse fast — with confusion, very fast breathing, a racing heart, cold or mottled skin, or feeling extremely unwell — can be sepsis, a medical emergency: call your local emergency number.
`,
  ideas: [
    'Antibiotics exploit selective toxicity: peptidoglycan walls, 70S ribosomes, DNA gyrase, folate synthesis and RNA polymerase differ from ours.',
    'Bacteria resist by destroying the drug, changing the target, pumping the drug out, keeping it out or bypassing the target.',
    'Resistant mutants usually exist before treatment; the drug selects them by killing their susceptible competitors.',
    'Horizontal gene transfer (conjugation, transformation, transduction) spreads resistance genes, often several at once on plasmids.',
    'Combination therapy makes multi-resistance improbable; stewardship and infection prevention reduce the selection pressure.'
  ],
  pitfalls: [
    'Antibiotics cause bacteria to mutate into resistant forms — Mutations arise by chance whether or not the drug is present; the drug selects the resistant cells that happen to exist.',
    'People become resistant to antibiotics — Bacteria become resistant. A person carries resistant bacteria, which they can pass on to others.',
    'Antibiotics help colds and flu — These are viral infections; antibiotics have no target in a virus and only select resistance in the body\'s own bacteria.'
  ],
  formulas: [
    {
      name: 'Chance that a resistant mutant is already present',
      expr: 'P = 1 - exp(-N*u)', tex: 'P = 1 - e^{-N u}',
      vars: {
        P: { name: 'probability that at least one resistant cell exists', q: 'ratio', unit: '%', tex: 'P' },
        N: { name: 'number of bacteria', q: 'count', value: 1e8, tex: 'N' },
        u: { name: 'frequency of resistant mutants per cell', value: 1e-8, tex: 'u' }
      },
      note: 'Poisson statistics: the expected number of resistant cells is N·u, and the chance of none is e^(−Nu). Frequencies of 10⁻⁷ to 10⁻⁹ are typical for a single-step resistance mutation.',
      stories: {
        P: 'An infection holds {N} bacteria, and resistance to a drug arises in {u} of cells. What is the chance a resistant cell is already there?',
        N: 'How many bacteria give a {P} chance of containing a resistant mutant, if the mutant frequency is {u}?'
      }
    },
    {
      name: 'Double resistance under combination therapy',
      expr: 'M = N*u1*u2', tex: 'M = N\\,u_1\\,u_2',
      vars: {
        M: { name: 'expected cells resistant to both drugs', tex: 'M' },
        N: { name: 'number of bacteria', q: 'count', value: 1e9, tex: 'N' },
        u1: { name: 'frequency of resistance to drug 1', value: 1e-8, tex: 'u_1' },
        u2: { name: 'frequency of resistance to drug 2', value: 1e-6, tex: 'u_2' }
      },
      note: 'Assumes the two resistances arise independently and neither is already present — combination therapy protects only if the bacteria are not already resistant to one of the drugs.',
      stories: {
        M: 'A patient carries {N} bacilli; resistance to one drug arises at {u1} and to the other at {u2}. How many bacilli resistant to both are expected?',
        N: 'With frequencies of {u1} and {u2}, how many bacteria would you need to expect {M} doubly resistant cells?'
      }
    },
    {
      name: 'Rise of resistance under treatment',
      expr: 'x = x0*exp(s*t)', tex: 'x = x_0\\,e^{s\\,t}',
      vars: {
        x: { name: 'ratio of resistant to susceptible cells', tex: 'x' },
        x0: { name: 'starting ratio', value: 1e-8, tex: 'x_0' },
        s: { name: 'advantage of the resistant cells (difference in net growth rate)', q: 'rate', unit: '1/h', value: 1.5, tex: 's' },
        t: { name: 'time under treatment', q: 'time', unit: 'h', value: 12, tex: 't' }
      },
      note: 'Under the drug the susceptible cells shrink (negative net growth) while the resistant ones keep growing; s is the difference between the two rates.',
      stories: {
        x: 'Resistant cells start at a ratio of {x0}; under the drug they gain {s} on the susceptible ones. What is the ratio after {t}?',
        t: 'Starting from a ratio of {x0}, with an advantage of {s}, how long until resistant cells reach a ratio of {x}?'
      }
    }
  ],
  examples: [
    {
      title: 'Treat early, treat small',
      q: 'Rifampicin resistance arises in about one cell in $10^8$. What is the chance that a resistant mutant is already present in a population of $10^{10}$ bacteria, and in one of $10^7$?',
      steps: [
        '$N = 10^{10}$: $Nu = 100$ expected mutants; $P = 1 - e^{-100} \\approx 100\\ \\%$.',
        '$N = 10^7$: $Nu = 0.1$; $P = 1 - e^{-0.1} = 9.5\\ \\%$.',
        'Large bacterial populations almost guarantee pre-existing resistance to any single drug — one reason rifampicin is never used alone.'
      ],
      a: 'Practically certain for 10¹⁰ bacteria; about 9.5 % for 10⁷.'
    },
    {
      title: 'Why tuberculosis needs several drugs',
      q: 'A lung cavity holds $10^9$ tubercle bacilli. Isoniazid resistance arises at $10^{-6}$ and rifampicin resistance at $10^{-8}$. How many bacilli resist isoniazid alone, and how many resist both?',
      steps: [
        'Isoniazid: $10^9 \\times 10^{-6} = 1000$ resistant bacilli — treatment with isoniazid alone would select them.',
        'Both: $M = 10^9 \\times 10^{-6} \\times 10^{-8} = 10^{-5}$ — one patient in a hundred thousand.',
        'Adding a third and fourth drug in the first months makes treatment failure by fresh resistance vanishingly unlikely — provided the drugs are actually taken together.'
      ],
      a: 'About 1000 resist isoniazid; about 10⁻⁵ are expected to resist both.'
    },
    {
      title: 'How fast resistance takes over',
      q: 'Resistant cells start at one in $10^8$. Under a drug, susceptible cells die at a net rate of 1.0 per hour while resistant cells grow at 0.5 per hour. When do the resistant cells catch up with the susceptible ones?',
      steps: [
        'The advantage is $s = 0.5 - (-1.0) = 1.5$ per hour.',
        'Solve $1 = 10^{-8}e^{1.5t}$: $t = \\ln(10^8)/1.5 = 18.4/1.5 = 12.3$ h.',
        'Within half a day a population that was 99.999999 % susceptible becomes mostly resistant — if nothing else (the immune system, a second drug) removes the resistant cells.'
      ],
      a: 'After about 12 hours.'
    }
  ],
  quiz: [
    { q: 'Why do penicillins not harm human cells?', choices: ['Human cells pump them out', 'Human cells have no peptidoglycan cell wall for them to attack', 'They are destroyed in the blood', 'They only work at high temperature'], a: 1, why: 'β-lactams block the enzymes that cross-link peptidoglycan, a wall material only bacteria make — a textbook example of selective toxicity.' },
    { q: 'Antibiotics cause the mutations that make bacteria resistant.', a: false, why: 'Resistance mutations arise at random during DNA replication, with or without the drug; the antibiotic selects the resistant cells by killing the rest.' },
    { q: 'A plasmid carrying resistance genes passes from *E. coli* to *Klebsiella* through a pilus. This is…', choices: ['transformation', 'transduction', 'conjugation', 'binary fission'], a: 2, why: 'Conjugation is direct transfer of DNA, usually a plasmid, between cells in contact; it works between species.' },
    { q: 'An infection holds 10⁹ bacteria; resistance arises at 10⁻⁸ per cell. How many resistant cells are expected before treatment?', answer: 10, why: 'N·u = 10⁹ × 10⁻⁸ = 10.' },
    { q: 'Bacteria surviving in a biofilm after a course of antibiotic regrow and are just as sensitive as before. This is…', choices: ['resistance', 'tolerance', 'mutation', 'conjugation'], a: 1, why: 'Tolerance: the cells survived because they were dormant or protected, not because their genes changed. Resistant bacteria would pass higher MICs to their offspring.' }
  ],
  problems: [
    { q: 'A population of 5 × 10⁷ bacteria has a mutant frequency of 10⁻⁸ for resistance to a drug. What is the probability (in %) that at least one resistant cell is present?', answer: 39.3, unit: '%', tol: 0.02, steps: ['$Nu = 0.5$.', '$P = 1 - e^{-0.5} = 0.393$, about 39 %.'] },
    { q: 'Resistant cells start at a ratio of 10⁻⁷ to susceptible ones and gain 2 per hour under treatment. How many hours until they are equal in number?', answer: 8.06, unit: 'h', tol: 0.02, steps: ['$t = \\ln(10^7)/2 = 16.1/2 = 8.06$ h.'] }
  ],
  applications: [
    'Hospital antimicrobial stewardship programmes and infection control.',
    'Multi-drug regimens for tuberculosis and HIV (where the same arithmetic of mutants applies to antivirals).',
    'Rapid diagnostic tests that tell bacterial from viral infections or detect resistance genes, so the right drug is chosen sooner.',
    'Research on new antibiotics, phage therapy and drugs that block resistance enzymes (β-lactamase inhibitors).'
  ],
  history: 'Alexander Fleming noticed in 1928 that a *Penicillium* mould killed staphylococci on a plate; Howard Florey, Ernst Chain and Norman Heatley turned penicillin into a medicine in 1940–41. Gerhard Domagk had introduced the first sulfonamide in 1935, and Albert Schatz and Selman Waksman found streptomycin in soil bacteria in 1943. Edward Abraham and Chain described a bacterial enzyme that destroyed penicillin in 1940, before the drug was in general use, and Fleming warned in his 1945 Nobel lecture that underdosing would breed resistant microbes. MRSA was first reported in 1961.',
  sim: 'mic-resistance'
},

{
  id: 'biofilms', parent: 'microbes-topic', title: 'Biofilms and quorum sensing', level: 2,
  short: 'Most bacteria in nature live not as lone swimmers but in biofilms — crowded communities glued to surfaces by a slime they secrete, from dental plaque to ship hulls. Bacteria also sense how crowded they are through the signal molecules they release (quorum sensing), and switch on group behaviours — glowing, forming biofilms, releasing toxins — only when there are enough of them.',
  keywords: ['biofilm', 'extracellular polymeric substance', 'EPS', 'slime', 'dental plaque', 'quorum sensing', 'autoinducer', 'acyl-homoserine lactone', 'AHL', 'LuxI', 'LuxR', 'AI-2', 'Vibrio fischeri', 'Aliivibrio fischeri', 'bioluminescence', 'bobtail squid', 'Pseudomonas aeruginosa', 'cystic fibrosis', 'device infection', 'persisters', 'antibiotic tolerance', 'quorum quenching', 'stromatolite'],
  prereq: ['bacterial-growth', 'cell-signalling', 'prokaryotic-cells'],
  related: ['antibiotic-resistance', 'microbiome', 'communication', 'coevolution', 'social-behaviour', 'diffusion-osmosis', 'medicine:gut-microbiome'],
  body: `
In a flask of broth, bacteria swim alone. In nature most of them live in **biofilms**: communities stuck to a surface and wrapped in a matrix they make themselves, the **extracellular polymeric substance** (EPS) — a hydrated gel of polysaccharides, proteins and DNA that can make up most of a biofilm's dry mass. The plaque on unbrushed teeth, the slime in a drain or on a river stone, the lining of water pipes and the fouling on a ship's hull are all biofilms. So were some of the oldest signs of life: stromatolites, mounds built layer by layer by microbial mats, date back about 3.5 billion years.

### How a biofilm grows
1. **Attachment** — free-swimming cells land, first loosely, then firmly with pili and adhesins.
2. **Microcolonies** — the cells divide and begin to secrete matrix.
3. **Maturation** — the film thickens into mounds and towers tens to hundreds of micrometres high, threaded by water channels. Oxygen and food run out with depth, so cells at the surface grow fast and those at the base barely grow.
4. **Dispersal** — cells break free, or the matrix is digested, and new surfaces are colonised.

Dental plaque holds hundreds of species arranged in a reproducible architecture, early colonisers such as streptococci binding the tooth and later ones binding them.

### Why biofilms are hard to kill
Bacteria in a biofilm can survive ten to a thousand times the antibiotic concentration that kills the same strain swimming freely. Mostly this is not genetic resistance ([[antibiotic-resistance]]) but **tolerance**:
- cells deep in the film grow slowly or not at all, and many antibiotics attack growth;
- dormant **persister** cells survive almost anything and regrow later;
- the matrix binds some drugs (positively charged aminoglycosides stick to the negative polymers) and concentrates enzymes that destroy others;
- phagocytes of the immune system cannot engulf a film.

Simple diffusion is rarely the whole story: a small molecule crosses 100 µm of biofilm in seconds ($t \\approx x^2/2D$). Biofilms on catheters, artificial joints, heart valves and contact lenses, in chronic wounds and in the lungs of people with cystic fibrosis (where *Pseudomonas aeruginosa* can persist for decades) cause many chronic infections; an infected medical device often has to be removed. Useful biofilms are as common: they clean sewage in trickling filters, line the healthy gut ([[microbiome]]) and ferment vinegar.

### Quorum sensing: counting heads
Bacteria behave differently when crowded, and they know when they are crowded. Each cell continually releases small signal molecules, **autoinducers**, that diffuse in and out of cells. At low density the signal leaks away; as the population grows, its concentration rises in step with the number of cells until it crosses a threshold, binds a receptor protein and switches on a set of genes — in all the cells at once.

The classic case is the marine bacterium *Vibrio fischeri* (now *Aliivibrio fischeri*). In the open sea, at about a hundred cells per millilitre, it makes no light. In the light organ of the Hawaiian bobtail squid it reaches $10^{10}$–$10^{11}$ cells per mL and glows. The squid hunts on moonlit nights and uses the glow to cancel its own shadow; every dawn it expels most of its bacteria, and the rest regrow by nightfall. The circuit is simple:
- **LuxI** makes the autoinducer, an acyl-homoserine lactone (AHL);
- **LuxR** binds AHL and switches on the *lux* genes — the luciferase that makes the light, and *luxI* itself.

That last link is positive feedback: once the signal starts to rise, more signal is made, so the switch from dark to lit is sharp, and light per cell rises about a thousandfold.

Other bacteria use the same logic for other ends. *Pseudomonas aeruginosa* delays releasing toxins and building biofilms until it is numerous enough to overwhelm the host's defences; *Staphylococcus aureus* uses short peptides as its signal; *Vibrio cholerae* does the reverse and leaves the biofilm when crowded. A molecule called AI-2 is made by many species, allowing a kind of conversation between them. Blocking the signal — **quorum quenching** with enzymes that destroy AHLs, or with decoy molecules — could disarm pathogens without killing them, which might select less strongly for resistance.

> [!key] Biofilms are the normal way of bacterial life: attached, embedded in their own matrix, tolerant of antibiotics and the immune system. Quorum sensing lets bacteria measure their own density through a diffusible signal and act together once a threshold is crossed.
`,
  ideas: [
    'Most bacteria live in biofilms: surface-attached communities embedded in a self-made matrix of polysaccharides, proteins and DNA.',
    'Biofilm bacteria tolerate 10–1000 times more antibiotic than free cells, mainly because of slow growth, persisters and matrix binding.',
    'Quorum sensing: an autoinducer released by every cell accumulates with density and switches on genes once it crosses a threshold.',
    'In Vibrio fischeri, LuxI makes AHL and LuxR responds to it; positive feedback makes the light switch sharp.',
    'Quorum quenching could disarm pathogens without killing them.'
  ],
  pitfalls: [
    'Biofilm bacteria survive antibiotics because the drug cannot get in — Small molecules diffuse through 100 µm of biofilm in seconds; tolerance comes mostly from slow growth, dormant persisters and drugs being bound or destroyed in the matrix.',
    'Quorum sensing means bacteria communicate by touching — The signal is a small diffusible molecule; a cell responds to its concentration, which reflects how many cells are releasing it nearby.',
    'Bacteria in a biofilm are all alike — Gradients of oxygen and food create neighbourhoods of fast-growing, slow-growing and dormant cells, often of many species.'
  ],
  formulas: [
    {
      name: 'Autoinducer concentration and cell density',
      expr: 'A = p*N/(k*NA)', tex: '\\mathrm{[A]} = \\dfrac{p\\,N}{k\\,N_A}',
      vars: {
        A: { name: 'autoinducer concentration', q: 'concentration', unit: 'nM', tex: '\\mathrm{[A]}' },
        p: { name: 'signal molecules made per cell per unit time', q: 'rate', unit: '1/min', value: 100, tex: 'p' },
        N: { name: 'cell density', q: 'numberdensity', unit: '1/mL', value: 1e8, tex: 'N' },
        k: { name: 'loss rate of the signal (breakdown and washout)', q: 'rate', unit: '1/min', value: 0.01, tex: 'k' },
        NA: { const: 'NA', tex: 'N_A' }
      },
      note: 'The steady state of production p·N against first-order loss k·[A]. Illustrative numbers; the positive feedback of a real circuit raises p sharply once the threshold is crossed. Receptors such as LuxR respond at nanomolar AHL.',
      stories: {
        A: 'Cells at {N} each make {p} signal molecules; the signal is lost at {k}. What steady concentration does it reach?',
        N: 'The receptor switches on at {A}. With {p} per cell and a loss rate of {k}, what cell density is needed?'
      }
    },
    {
      name: 'Time to diffuse into a biofilm',
      expr: 't = x^2/(2*D)', tex: 't = \\dfrac{x^2}{2D}',
      vars: {
        t: { name: 'typical diffusion time', q: false, unit: 's', tex: 't' },
        x: { name: 'biofilm thickness', q: false, unit: 'µm', value: 100, tex: 'x' },
        D: { name: 'diffusion coefficient in the biofilm', q: false, unit: 'µm²/s', value: 400, tex: 'D' }
      },
      note: 'Small molecules diffuse at about 1000 µm²/s in water and perhaps half that in a biofilm. Doubling the thickness quadruples the time.',
      stories: { t: 'An antibiotic with D = {D} must cross a biofilm {x} thick. Roughly how long does diffusion take?', x: 'How thick a biofilm would take {t} to cross by diffusion, with D = {D}?' }
    }
  ],
  examples: [
    {
      title: 'Why the sea is dark and the squid glows',
      q: 'Cells each make 100 AHL molecules per minute and the signal is lost at 0.01 per minute. What density is needed to reach 5 nM, the switching threshold? What is the concentration at 100 cells per mL in the open ocean?',
      steps: [
        'Rearrange: $N = [A]\\,k\\,N_A/p$. In SI units $[A] = 5\\times10^{-6}$ mol/m³ and $k/p = 10^{-4}$ per molecule.',
        '$N = 5\\times10^{-6} \\times 10^{-4} \\times 6.02\\times10^{23} = 3.0\\times10^{14}$ per m³ $= 3\\times10^8$ per mL.',
        'At 100 per mL, $[A]$ is three million times lower — about $2\\times10^{-6}$ nM. Alone, a cell cannot tell itself from nothing; in the light organ, at $10^{10}$ per mL, the signal is far above threshold.'
      ],
      a: 'About 3 × 10⁸ cells per mL; in the ocean the signal is negligible (~10⁻⁶ nM).'
    },
    {
      title: 'Is diffusion the barrier?',
      q: 'How long does a small antibiotic ($D$ = 400 µm²/s) take to diffuse through a biofilm 100 µm thick, and one 1 mm thick?',
      steps: [
        '100 µm: $t = 100^2/(2\\times400) = 12.5$ s.',
        '1 mm: $t = 1000^2/800 = 1250$ s, about 21 minutes.',
        'Either way the drug arrives long before a course of treatment ends — unless it is bound or destroyed on the way, so tolerance must mostly come from the state of the cells.'
      ],
      a: 'About 12 s for 100 µm and 21 min for 1 mm.'
    }
  ],
  quiz: [
    { q: 'Why does *Vibrio fischeri* make no light in the open sea?', choices: ['It lacks the lux genes there', 'Its autoinducer diffuses away at low density and never reaches the threshold', 'There is no oxygen in sea water', 'Light is made only by the squid'], a: 1, why: 'The same cells glow when crowded; at a hundred per mL the signal concentration is millions of times below what LuxR needs.' },
    { q: 'Bacteria in biofilms survive antibiotics mainly because the drugs cannot diffuse into the film.', a: false, why: 'Small molecules cross hundreds of micrometres in seconds to minutes. Slow growth, persisters, and binding or destruction in the matrix matter more.' },
    { q: 'In the lux circuit, the AHL–LuxR complex also switches on *luxI*. What does this positive feedback do?', choices: ['Makes the response gradual', 'Makes the switch from dark to lit sharp and hard to reverse', 'Stops the cells growing', 'Destroys the signal'], a: 1, why: 'Once the signal starts to rise, the cells make more of it, pushing the whole population over the threshold together — a switch, not a dimmer.' },
    { q: 'In the simple model, if the cell density rises tenfold at steady state, by what factor does the autoinducer concentration rise?', answer: 10, why: '[A] = pN/(kN_A) is proportional to N (without feedback).' },
    { q: 'What is the hoped-for advantage of blocking quorum sensing instead of killing bacteria?', choices: ['It works on viruses too', 'Disarmed bacteria are not killed, so the pressure to evolve resistance is weaker', 'It makes bacteria grow faster', 'It removes biofilms instantly'], a: 1, why: 'A drug that stops toxin release or biofilm formation without affecting survival gives resistant mutants little advantage — though bacteria may still evolve around it.' }
  ],
  problems: [
    { q: 'How long does a small molecule with $D$ = 500 µm²/s take to diffuse through a biofilm 200 µm thick (use $t = x^2/2D$)?', answer: 40, unit: 's', tol: 0.02, steps: ['$t = 200^2/(2\\times500) = 40\\,000/1000 = 40$ s.'] },
    { q: 'Cells at 10⁹ per mL each make 100 signal molecules per minute; the signal is lost at 0.01 per minute. What is the steady concentration in nM?', answer: 16.6, unit: 'nM', tol: 0.02, steps: ['$N = 10^{15}$ per m³; $p/k = 10^4$.', '$[A] = 10^4 \\times 10^{15}/6.02\\times10^{23} = 1.66\\times10^{-5}$ mol/m³ $= 16.6$ nM.'] }
  ],
  applications: [
    'Designing catheters, implants and contact lenses that resist biofilm formation.',
    'Treating chronic infections in cystic fibrosis and chronic wounds, where biofilms protect bacteria.',
    'Biofilm reactors and trickling filters that clean wastewater.',
    'Quorum-quenching compounds and enzymes under study as anti-virulence therapies, and in aquaculture to protect fish larvae.'
  ],
  history: 'Kenneth Nealson, Terry Platt and J. Woodland Hastings showed in 1970 that luminous marine bacteria light up only when crowded, calling it autoinduction; the term "quorum sensing" was coined by Clay Fuqua, Stephen Winans and Peter Greenberg in 1994. Bill Costerton argued from the late 1970s that most bacteria in nature live in biofilms. Bonnie Bassler discovered AI-2 and quorum sensing between species.',
  sim: 'mic-quorum'
},

{
  id: 'microbes-industry', parent: 'microbes-topic', title: 'Microbes in food and industry', level: 1,
  short: 'People have used microbes for at least 9000 years to make bread, beer, wine, yoghurt, cheese and soy sauce. Today microbes also make antibiotics, citric acid, amino acids, enzymes, vaccines and human insulin, clean our wastewater and turn waste into fuel.',
  keywords: ['fermentation', 'yeast', 'Saccharomyces cerevisiae', 'bread', 'beer', 'wine', 'yoghurt', 'lactic acid bacteria', 'cheese', 'rennet', 'chymosin', 'soy sauce', 'Aspergillus', 'vinegar', 'citric acid', 'glutamate', 'penicillin production', 'recombinant insulin', 'biotechnology', 'industrial enzymes', 'Taq polymerase', 'bioethanol', 'biogas', 'activated sludge', 'bioremediation', 'mycoprotein', 'fermenter', 'bioreactor'],
  prereq: ['fermentation', 'microbial-metabolism', 'bacterial-growth'],
  related: ['restriction-cloning', 'gmos', 'pcr', 'fungi', 'aseptic-technique', 'ecosystem-services', 'medicine:type1-diabetes', 'medicine:vaccines', 'medicine:gut-microbiome'],
  body: `
### The oldest biotechnology
Residues in 9000-year-old pottery from Jiahu, in China, show a fermented drink of rice, honey and fruit; bread and beer are at least as old in the Middle East. For most of that time nobody knew microbes were involved. Louis Pasteur showed in the 1850s and 1860s that fermentation is the work of living yeasts and bacteria — and that spoilage is the work of the wrong ones.

| Food | Microbes | What they do |
|---|---|---|
| bread | baker's yeast, *Saccharomyces cerevisiae* | ferments sugar to CO₂, which raises the dough, and ethanol, which bakes off |
| beer, wine, cider | yeasts | ferment sugar to ethanol and CO₂ |
| yoghurt | *Lactobacillus delbrueckii* subsp. *bulgaricus* and *Streptococcus thermophilus* | turn lactose into lactic acid; at pH about 4.6 the milk protein casein sets into a gel |
| cheese | lactic acid bacteria, then moulds and bacteria as it ripens | acid and the enzyme chymosin (rennet) curdle the milk; ripening makes the flavour — *Penicillium roqueforti* the blue veins, *Propionibacterium* the holes in Emmental |
| sauerkraut, kimchi, pickles | lactic acid bacteria | acid preserves the vegetables |
| soy sauce, miso | the mould *Aspergillus oryzae*, then yeasts and bacteria | break soy and wheat proteins into amino acids, glutamate among them |
| vinegar | acetic acid bacteria | oxidise ethanol to acetic acid |

Fermented foods keep because the acid, the alcohol and the crowd of harmless fermenting microbes leave little room for spoilage and disease organisms. Alcoholic fermentation turns one glucose into two ethanol and two carbon dioxide ([[fermentation]]):

$$\\ce{C6H12O6 -> 2C2H5OH + 2CO2}$$

By mass, 180 g of glucose gives at most 92 g of ethanol (0.511 g per g) and 88 g of CO₂; yeasts reach about 90–95 % of this, spending the rest on growth and by-products such as glycerol.

### Microbes as factories
Industrial fermenters are sterile stainless-steel tanks of up to several hundred cubic metres, stirred, aerated and held at the right temperature and pH.
- **Acids and amino acids.** The mould *Aspergillus niger* makes about two million tonnes of citric acid a year for drinks and foods; the bacterium *Corynebacterium glutamicum* makes millions of tonnes of glutamate (as flavour enhancer) and lysine (for animal feed).
- **Antibiotics.** Fleming's mould made only a few milligrams of penicillin per litre; decades of mutation and selection of *Penicillium chrysogenum* pushed industrial strains to tens of grams per litre, a gain of more than ten-thousandfold.
- **Enzymes.** Proteases and amylases from *Bacillus* in washing powders; chymosin from engineered fungi and yeasts in most of today's cheese; Taq polymerase, from *Thermus aquaticus* found in a Yellowstone hot spring in 1969, which makes the [[pcr|polymerase chain reaction]] possible.
- **Medicines from engineered microbes.** Before 1982 insulin came from the pancreases of pigs and cattle. That year human insulin made by *E. coli* carrying the human gene became the first medicine of genetic engineering; today insulin is made in *E. coli* and yeast. Growth hormone, clotting factors and the hepatitis B vaccine (a viral surface protein made in yeast since 1986) followed ([[restriction-cloning]], [[gmos]]).
- **Energy and environment.** Yeast makes fuel ethanol from sugar cane and maize; methanogens in anaerobic digesters turn manure and food waste into biogas; the activated sludge of sewage works is a managed community of microbes that eats the organic load of our waste; oil-degrading bacteria help clean up spills (bioremediation); bacteria leach copper from low-grade ore.
- **Food itself.** Mycoprotein, from the fungus *Fusarium venenatum*, is grown in continuous fermenters as a meat substitute.

### Scaling up
Growing microbes by the tonne is an engineering problem: keep the culture pure (sterilised medium, filtered air — [[aseptic-technique]]), supply oxygen fast enough (water holds only about 7 mg of oxygen per litre at 30 °C, while a dense culture consumes grams per litre per hour), remove the heat the cells produce, and recover the product. The economics come down to titre (grams per litre), yield (grams per gram of sugar) and productivity (grams per litre per hour).

> [!key] Microbes turn cheap sugars into valuable molecules — ethanol, acids, amino acids, antibiotics, enzymes and, since genetic engineering, human proteins. The same organisms that spoil food preserve it when the right ones are put to work.
`,
  ideas: [
    'Fermented foods (bread, beer, wine, yoghurt, cheese, soy sauce) use yeasts, lactic acid bacteria and moulds; acid and alcohol preserve them.',
    'Alcoholic fermentation: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂, at most 0.511 g of ethanol per gram of glucose.',
    'Industrial microbes make citric acid, amino acids, antibiotics and enzymes by the million tonnes.',
    'Engineered microbes have made human insulin since 1982, and vaccines, hormones and enzymes since.',
    'Microbes also treat sewage, make biogas and fuel ethanol, and help clean up pollution.'
  ],
  pitfalls: [
    'Fermentation means making alcohol — Biochemically it is any energy-yielding breakdown with no external electron acceptor; yoghurt, sauerkraut and soy sauce ferment without making much alcohol, and industry calls any large-scale culture a "fermentation", even an aerobic one.',
    'Microbes are mostly harmful — Only a small minority cause disease; people have relied on microbes for food and drink for millennia, and industry, agriculture and sewage treatment depend on them.',
    'Insulin from engineered bacteria is a bacterial protein — It is human insulin, made from the human gene; the bacterium is only the factory.'
  ],
  formulas: [
    {
      name: 'Ethanol from sugar',
      expr: 'mE = Yt*f*mS', tex: 'c_E = Y_t\\,f\\,c_S',
      vars: {
        mE: { name: 'ethanol produced', q: 'massconc', unit: 'g/L', tex: 'c_E' },
        Yt: { name: 'theoretical yield (g ethanol per g glucose)', value: 0.511, fixed: true, tex: 'Y_t' },
        f: { name: 'fraction of the theoretical yield achieved', q: 'ratio', unit: '%', value: 92, min: 0, max: 100, tex: 'f' },
        mS: { name: 'sugar fermented', q: 'massconc', unit: 'g/L', value: 220, tex: 'c_S' }
      },
      note: 'From C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂: 92.14/180.16 = 0.511. The CO₂ is the other 0.489 g per g.',
      stories: {
        mE: 'Grape juice with {mS} of sugar is fermented to dryness at {f} of the theoretical yield. How much ethanol does the wine contain?',
        mS: 'How much sugar must be fermented, at {f} of theory, to reach {mE} of ethanol?'
      }
    },
    {
      name: 'Alcohol by volume',
      expr: 'ABV = cE/rho', tex: '\\mathrm{ABV} = \\dfrac{c_E}{\\rho_E}',
      vars: {
        ABV: { name: 'alcohol by volume', q: 'ratio', unit: '%', tex: '\\mathrm{ABV}' },
        cE: { name: 'ethanol concentration', q: false, unit: 'g/L', value: 103, tex: 'c_E' },
        rho: { name: 'density of ethanol', q: false, unit: 'g/L', value: 789, fixed: true, tex: '\\rho_E' }
      },
      note: 'Ignores the small shrinkage when ethanol and water mix; good to a few per cent of the value.',
      stories: { ABV: 'A wine contains {cE} of ethanol. What is its alcohol by volume?', cE: 'A beer is {ABV} alcohol by volume. How many grams of ethanol per litre is that?' }
    }
  ],
  examples: [
    {
      title: 'How strong will the wine be?',
      q: 'A grape juice holds 220 g/L of sugar. Yeast ferments it all, at 92 % of the theoretical yield. What is the alcohol content by volume?',
      steps: [
        'Ethanol: $0.511 \\times 0.92 \\times 220 = 103$ g/L.',
        'By volume: $103/789 = 0.131$, about 13 %.',
        'Winemakers use the rule of thumb that about 17 g/L of sugar makes 1 % of alcohol: $220/17 = 12.9$ %.'
      ],
      a: 'About 13 % alcohol by volume.'
    },
    {
      title: 'The gas that raises bread',
      q: 'Yeast in a dough ferments 5 g of glucose. What volume of CO₂ does it make at 35 °C and atmospheric pressure?',
      steps: [
        'Mass of CO₂: $0.489 \\times 5 = 2.44$ g, or $2.44/44 = 0.0556$ mol.',
        'Molar volume at 308 K: $RT/p = 8.314 \\times 308/101\\,325 = 0.0253$ m³ = 25.3 L/mol.',
        'Volume: $0.0556 \\times 25.3 = 1.4$ L — which is why a spoonful of sugar can double the size of a dough.'
      ],
      a: 'About 1.4 litres of CO₂.'
    }
  ],
  quiz: [
    { q: 'Why does milk thicken into yoghurt?', choices: ['Yeast makes CO₂ that foams it', 'Lactic acid bacteria lower the pH to about 4.6, where casein proteins come together as a gel', 'Heating evaporates the water', 'The bacteria make a starch'], a: 1, why: 'Casein micelles lose their charge near their isoelectric point and aggregate into a network that traps the water.' },
    { q: 'The holes in bread come from…', choices: ['ethanol vapour', 'CO₂ from yeast fermentation', 'air beaten in during kneading only', 'lactic acid'], a: 1, why: 'Yeast ferments sugars to CO₂ and ethanol; the gas is trapped by the gluten network and expands in the oven, while the ethanol evaporates.' },
    { q: 'Most human insulin used today is made by genetically engineered microbes.', a: true, why: 'Since 1982 human insulin (and later its engineered analogues) has been made in E. coli or yeast carrying the gene, replacing insulin extracted from animal pancreases.' },
    { q: 'Why is Taq polymerase used in PCR?', choices: ['It copies DNA faster than any other enzyme', 'It comes from a hot-spring bacterium and survives the repeated near-boiling steps of PCR', 'It is cheaper than human polymerase', 'It makes RNA'], a: 1, why: 'Thermus aquaticus lives at about 70 °C; its polymerase survives the 95 °C steps that separate the DNA strands, so it need not be added again each cycle.' },
    { q: 'What is the maximum mass of ethanol (in g) that 100 g of glucose can yield?', answer: 51.1, unit: 'g', why: '2 × 46.07/180.16 = 0.511 g per g, so 51.1 g.' }
  ],
  problems: [
    { q: 'A beer wort holds 80 g/L of fermentable sugar and ferments at 90 % of the theoretical yield. What is the alcohol by volume, in per cent?', answer: 4.66, unit: '%', tol: 0.02, steps: ['Ethanol: $0.511 \\times 0.90 \\times 80 = 36.8$ g/L.', 'ABV: $36.8/789 = 0.0466$, about 4.7 %.'] },
    { q: 'How many grams of CO₂ are released when yeast ferments 10 g of glucose completely?', answer: 4.89, unit: 'g', tol: 0.02, steps: ['2 × 44.01/180.16 = 0.489 g per g; $0.489 \\times 10 = 4.89$ g.'] }
  ],
  applications: [
    'Food and drink: bread, dairy, fermented vegetables, soy sauce, beer and wine.',
    'Medicines: antibiotics, insulin and other recombinant proteins, vaccines.',
    'Industrial chemicals and enzymes: citric acid, amino acids, detergent enzymes, Taq polymerase.',
    'Environment and energy: sewage treatment, biogas, fuel ethanol, bioremediation.'
  ],
  history: 'Pasteur showed that fermentation is done by living microbes (1857–1860s), and Eduard Buchner that yeast juice without cells could ferment sugar (1897, Nobel 1907), founding biochemistry. In the First World War Chaim Weizmann used *Clostridium acetobutylicum* to make acetone for explosives. Penicillin was mass-produced from 1943 in deep aerated tanks, with a strain found on a mouldy cantaloupe in Peoria, Illinois. Human insulin from engineered bacteria was approved in 1982.'
},

{
  id: 'aseptic-technique', parent: 'microbes-topic', title: 'Aseptic technique and sterilisation', level: 1,
  short: 'Aseptic technique is the set of habits that keeps unwanted microbes out of cultures and keeps cultures where they belong. Sterilisation — by steam under pressure, dry heat, filtration, radiation or chemicals — kills or removes all life, and its effect is counted in tenfold (log) reductions. Living cells are counted by diluting and plating.',
  keywords: ['aseptic technique', 'sterile', 'sterilisation', 'sterilization', 'disinfection', 'antisepsis', 'autoclave', 'moist heat', 'dry heat', 'filtration', 'irradiation', 'UV', '70 % ethanol', 'D-value', 'z-value', 'log reduction', 'sterility assurance level', 'endospores', 'pasteurisation', 'biosafety level', 'streak plate', 'spread plate', 'serial dilution', 'colony-forming units', 'CFU', 'plate count', 'Petri dish', 'agar'],
  prereq: ['bacterial-growth', 'prokaryotic-cells', 'lab-math'],
  related: ['microbes-industry', 'biosafety-bioethics', 'experimental-design', 'pcr', 'chemistry:dilution', 'math:logarithms', 'physics:radioactive-decay', 'medicine:infection-spread'],
  body: `
Microbes are everywhere — on skin, in dust, in every breath — and a dish of nutrient agar left open soon grows a garden of moulds and bacteria. Microbiology depends on **pure cultures**, one kind of organism at a time, and on keeping the people in the lab and the world outside it safe. Aseptic technique does both.

> [!note] This page explains principles at the level of a school or undergraduate teaching laboratory; it is not a protocol. Real laboratory work follows the training, biosafety rules and approvals of one's institution and country.

### Words that mean different things
| Term | Meaning |
|---|---|
| sterilisation | kills or removes all microbes, bacterial endospores included |
| disinfection | kills most microbes on objects and surfaces, but not necessarily spores |
| antisepsis | disinfection of living tissue, such as skin before an injection |
| sanitisation | lowers microbe numbers to a safe level (dishes, food surfaces) |
| pasteurisation | mild heat that kills disease-causing and most spoilage microbes in food (milk: 72 °C for 15 s) without sterilising it |
| aseptic | free of contaminating microbes — and the methods that keep things so |

### The habits of a teaching lab
- **Clean hands and bench** — hands washed; the bench wiped with a disinfectant (70 % ethanol is common) before and after work.
- **Sterile materials** — media, pipettes, loops and containers are sterilised before use; a wire loop is heated in a flame until it glows, a plastic one used once.
- **Short, shielded exposure** — containers are opened as briefly as possible; a Petri dish lid is lifted just enough and held over the dish, never put down on the bench; many labs work beside a Bunsen flame, whose rising air carries dust away from the work.
- **Label and tape** — in school labs a dish lid is held with a few short strips of tape rather than sealed all round, so air can enter and organisms that thrive without oxygen (many disease-causing ones among them) are not favoured; dishes are incubated upside down so condensation does not drip onto the agar.
- **Incubate cool** — school cultures are grown at no more than about 25–30 °C, not at body temperature, so organisms adapted to the human body are not encouraged.
- **Do not reopen; destroy before disposal** — incubated plates stay closed, and all cultures and used materials are sterilised before they are thrown away.

### Isolating and counting
A **streak plate** spreads a loopful of culture across the agar in successive, thinner streaks; in the last ones single cells land apart, and each grows overnight into a separate **colony** of millions of identical cells — a pure culture.

To count the living cells in a dense sample, it is **serially diluted** in tenfold steps (1 part into 9), and a known volume, often 0.1 mL, of several dilutions is spread on agar. Plates with 30–300 colonies are counted: fewer gives large random error, more and the colonies crowd and merge. Each colony started from one cell or one clump, so the result is given in **colony-forming units** (CFU):

$$C = \\frac{n}{d\\,V}$$

with $n$ colonies, $d$ the dilution (such as $10^{-6}$) and $V$ the volume plated. Colony numbers follow Poisson statistics, so a count of $n$ has an uncertainty of about $\\sqrt{n}$ — 100 colonies means ±10 %.

### The arithmetic of killing
Heat, radiation and chemicals kill microbes at random, so a population dies exponentially, like radioactive nuclei decaying: in each minute the same *fraction* dies. The **D-value** is the time to kill 90 % — a one-log, tenfold reduction — under given conditions:

$$N = N_0\\,10^{-t/D}$$

Hotter is faster: the **z-value** is the temperature rise that cuts D tenfold, typically about 10 °C for bacterial spores in steam. Because killing is exponential, sterility is a probability. Starting from $10^6$ spores, twelve D-values leave on average $10^{-6}$ survivors — at most one item in a million non-sterile, the **sterility assurance level** required of medical devices. Canning uses the same logic, heating low-acid food long enough to reduce heat-resistant spores a trillion-fold (the "12-D" standard).

| Method | Typical conditions | Used for | How it kills |
|---|---|---|---|
| autoclave (steam under pressure) | 121 °C for 15 min, about 1 bar above atmospheric | media, glassware, lab waste | denatures and coagulates proteins |
| dry heat (hot-air oven) | 160–180 °C for 1–2 h | glassware, metal instruments, powders | oxidation — slower than steam |
| filtration | pores of 0.2 µm | heat-sensitive solutions, air | removes cells (most viruses pass) |
| ionising radiation (gamma, electron beam) | about 25 kGy | disposable plastics, syringes, dressings | breaks DNA |
| ultraviolet light, 254 nm | minutes, at close range | surfaces, air, water | links neighbouring thymines; penetrates poorly |
| chemical gases | ethylene oxide, hydrogen peroxide vapour | heat-sensitive medical devices | alkylates or oxidises |

Steam beats dry air at the same temperature because condensing steam delivers its latent heat — 2.2 MJ per kg — straight onto the surface, and water makes proteins unfold far more easily. Spores of *Geobacillus stearothermophilus*, among the most heat-resistant known, are put in autoclave loads as biological indicators: if they fail to grow afterwards, the cycle worked. Prions, the infectious proteins of CJD, resist ordinary autoclaving and need special treatment.

### Biosafety levels
Microbes are grouped by the hazard they pose and labs by their containment, from level 1 — organisms that do not cause disease in healthy adults, such as laboratory strains of *E. coli* K-12 and baker's yeast, suitable for teaching — through level 2 (moderate hazard, such as *Staphylococcus aureus*: restricted access and safety cabinets) and level 3 (serious airborne disease, such as tuberculosis: sealed rooms under negative pressure) to level 4 for the most dangerous exotic viruses. Names and rules differ from country to country ([[biosafety-bioethics]]).

> [!key] Keep microbes out and in: clean surfaces, sterile tools, brief and shielded exposure, safe disposal. Sterilisation kills exponentially, measured in D-values; living cells are counted as colony-forming units after serial dilution.
`,
  ideas: [
    'Sterilisation kills everything, spores included; disinfection, antisepsis, sanitisation and pasteurisation kill less.',
    'Aseptic habits: clean hands and bench, sterile tools, brief shielded exposure, labelled and taped plates, cool incubation, safe disposal.',
    'Serial dilution and plating give colony-forming units: C = n/(d·V), counting plates with 30–300 colonies.',
    'Microbes die exponentially: each D-value kills 90 %, and sterility is a probability (10⁻⁶ for medical devices).',
    'Moist heat (121 °C, 15 min) is more effective than dry heat; filtration, radiation and chemicals serve heat-sensitive items.'
  ],
  pitfalls: [
    'Disinfected means sterile — Disinfectants kill most vegetative microbes but may leave bacterial spores alive; only sterilisation removes all life.',
    'Heating kills all the microbes at once when the right temperature is reached — Killing is exponential: each D-value removes 90 % of what is left, so the time needed depends on how many there were to start with.',
    'A colony count gives the number of cells — It gives colony-forming units: a chain or clump of cells makes a single colony, so CFU can underestimate cells, and dead cells are not counted at all.'
  ],
  formulas: [
    {
      name: 'Viable count from a plate',
      expr: 'C = n/(d*V)', tex: 'C = \\dfrac{n}{d\\,V}',
      vars: {
        C: { name: 'viable count in the original sample', q: 'numberdensity', unit: '1/mL', tex: 'C' },
        n: { name: 'colonies counted', q: 'count', value: 150, int: true, tex: 'n' },
        d: { name: 'dilution of the plated tube (e.g. 10⁻⁶)', value: 1e-6, tex: 'd' },
        V: { name: 'volume plated', q: 'volume', unit: 'mL', value: 0.1, tex: 'V' }
      },
      note: 'Count plates with 30–300 colonies; the uncertainty of a count n is about √n. Result in colony-forming units (CFU) per mL.',
      practice: { unknowns: ['C', 'n'] },
      stories: {
        C: 'Plating {V} of the {d} dilution gives {n} colonies. What is the viable count of the original sample?',
        n: 'A sample holds {C}. How many colonies do you expect from {V} of the {d} dilution?'
      }
    },
    {
      name: 'Survivors of sterilisation',
      expr: 'N = N0*10^(-t/D)', tex: 'N = N_0\\,10^{-t/D}',
      vars: {
        N: { name: 'expected survivors (below 1 it is a probability)', tex: 'N' },
        N0: { name: 'starting number of microbes (the bioburden)', q: 'count', value: 1e6, tex: 'N_0' },
        t: { name: 'exposure time', q: 'time', unit: 'min', value: 15, tex: 't' },
        D: { name: 'D-value (time for a tenfold reduction)', q: 'time', unit: 'min', value: 1.5, tex: 'D' }
      },
      note: 'First-order killing at constant conditions. Resistant spores and the start-up time of real cycles are why generous margins are used.',
      stories: {
        N: '{N0} spores with a D-value of {D} are held at 121 °C for {t}. How many survivors are expected?',
        t: 'How long must {N0} spores with a D-value of {D} be heated to reach {N} expected survivors?'
      }
    },
    {
      name: 'D-value at another temperature (z-value)',
      expr: 'D = Dref*10^((Tref - T)/z)', tex: 'D = D_{ref}\\,10^{(T_{ref} - T)/z}',
      vars: {
        D: { name: 'D-value at temperature T', q: 'time', unit: 'min', tex: 'D' },
        Dref: { name: 'D-value at the reference temperature', q: 'time', unit: 'min', value: 1.5, tex: 'D_{ref}' },
        Tref: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 121, tex: 'T_{ref}' },
        T: { name: 'actual temperature', q: 'temperature', unit: '°C', value: 115, tex: 'T' },
        z: { name: 'z-value (rise that cuts D tenfold)', q: 'dtemp', unit: '°C', value: 10, tex: 'z' }
      },
      note: 'About 10 °C for bacterial spores in moist heat; vegetative cells and dry heat have other z-values.',
      stories: {
        D: 'Spores have a D-value of {Dref} at {Tref} and z = {z}. What is their D-value at {T}?',
        T: 'At what temperature is the D-value {D}, if it is {Dref} at {Tref} and z = {z}?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a dilution series',
      q: 'A culture is diluted to $10^{-5}$, $10^{-6}$ and $10^{-7}$, and 0.1 mL of each is spread on a plate. The plates show too many colonies to count, 212 and 19. What is the viable count?',
      steps: [
        'Use the plate in the 30–300 range: 212 colonies from 0.1 mL of the $10^{-6}$ dilution.',
        '$C = 212/(10^{-6} \\times 0.1\\ \\mathrm{mL}) = 2.1\\times10^9$ CFU per mL.',
        'The $10^{-7}$ plate agrees ($19/10^{-8} = 1.9\\times10^9$), but with $\\sqrt{19} \\approx 4.4$ its uncertainty is about ±23 %, against ±7 % for 212.'
      ],
      a: 'About 2.1 × 10⁹ CFU per mL.'
    },
    {
      title: 'How sterile is sterile?',
      q: 'An autoclave load carries $10^6$ spores with $D_{121}$ = 1.5 min. How many survive 15 minutes at 121 °C? How long is needed for a sterility assurance level of $10^{-6}$?',
      steps: [
        '15 min is 10 D-values: $N = 10^6 \\times 10^{-10} = 10^{-4}$ — a one-in-ten-thousand chance that a spore survives.',
        '$10^{-6}$ needs 12 log reductions: $12 \\times 1.5 = 18$ min.'
      ],
      a: '10⁻⁴ expected survivors after 15 min; 18 min for 10⁻⁶.'
    },
    {
      title: 'When the steam does not reach 121 °C',
      q: 'Air trapped in a tightly packed autoclave keeps part of the load at only 115 °C. With $D_{121}$ = 1.5 min and $z$ = 10 °C, how many log reductions does a 15-minute cycle give there?',
      steps: [
        '$D_{115} = 1.5 \\times 10^{(121-115)/10} = 1.5 \\times 10^{0.6} = 6.0$ min.',
        '15 min / 6 min = 2.5 log reductions instead of 10.',
        'From $10^6$ spores about 3000 survive — which is why loads are packed loosely and every cycle is checked with indicators.'
      ],
      a: 'Only about 2.5 logs — thousands of spores could survive.'
    }
  ],
  quiz: [
    { q: 'Plates from successive tenfold dilutions show 1500, 160 and 14 colonies. Which plate should be used for the count?', choices: ['1500 — the most colonies', '160 — within the 30–300 range', '14 — the least crowded', 'The average of all three'], a: 1, why: 'Above ~300 colonies merge and compete; below ~30 the random (Poisson) error is large. 160 is in the reliable range.' },
    { q: 'Disinfecting a bench with 70 % ethanol makes it sterile.', a: false, why: 'Ethanol kills most vegetative bacteria and many viruses but not bacterial endospores; the bench is disinfected, not sterile.' },
    { q: 'Why does steam at 121 °C sterilise much faster than dry air at 121 °C?', choices: ['Steam is hotter', 'Condensing steam delivers latent heat quickly and water makes proteins denature more easily', 'Dry air contains oxygen that protects spores', 'Steam dissolves the spores'], a: 1, why: 'The temperature is the same; what differs is the rate of heat transfer (latent heat of condensation) and the hydration that lets proteins unfold and coagulate.' },
    { q: 'Plating 0.1 mL of a 10⁻⁴ dilution gives 45 colonies. What is the viable count, in CFU per mL?', answer: 4.5e6, unit: '1/mL', why: 'C = 45/(10⁻⁴ × 0.1) = 4.5 × 10⁶ CFU/mL.' },
    { q: 'Why are cultures in school laboratories incubated at 25–30 °C rather than 37 °C?', choices: ['Agar melts at 37 °C', 'To avoid favouring organisms adapted to the human body, which include most human pathogens', 'Bacteria cannot grow at 37 °C', 'To save electricity'], a: 1, why: 'Organisms that grow best at body temperature are the ones most likely to be able to infect people; cooler incubation favours harmless environmental microbes. (Agar melts near 85 °C.)' }
  ],
  problems: [
    { q: 'Spores have a D-value of 2 min at 121 °C. How long does a 6-log (millionfold) reduction take?', answer: 12, unit: 'min', tol: 0.02, steps: ['Each log takes one D-value: $6 \\times 2 = 12$ min.'] },
    { q: 'Plating 1 mL of a 10⁻³ dilution gives 120 colonies. What is the viable count per mL of the original sample?', answer: 1.2e5, unit: '1/mL', tol: 0.02, steps: ['$C = 120/(10^{-3} \\times 1\\ \\mathrm{mL}) = 1.2\\times10^5$ CFU/mL.'] }
  ],
  applications: [
    'Sterile manufacture of medicines, vaccines and medical devices, and hospital sterilisation departments.',
    'Food preservation: pasteurisation, canning and the design of cooking and chilling steps.',
    'Water-quality and food-safety testing by plate counts.',
    'Industrial fermentation, where one contaminant can ruin a batch of hundreds of cubic metres.'
  ],
  history: 'Ignaz Semmelweis cut deaths from childbed fever by having doctors wash their hands in chlorinated lime (1847); Louis Pasteur\'s swan-necked flasks (about 1860) showed that broth stays sterile if dust cannot reach it; Joseph Lister introduced antiseptic surgery with carbolic acid in 1867. Charles Chamberland, in Pasteur\'s laboratory, built the first autoclave in 1879, and Robert Koch\'s group made pure cultures on solid media routine.',
  sim: 'mic-dilution'
}

);
