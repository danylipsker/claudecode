/* HYPER-MEDICINE · content/immunity.js — topic "immunity": innate and adaptive immunity,
 * antibodies, allergy, autoimmune disease and immunodeficiency.
 * Simulations in sims/blood-immunity.js. */
Hyper.add(

{
  id: 'innate-immunity', parent: 'immunity', title: 'Innate immunity and inflammation', level: 1,
  short: 'The defences that are ready before any germ arrives: skin and mucus, cells that eat invaders, and the alarm called inflammation — redness, heat, swelling and pain — that brings help to the right place within hours.',
  keywords: ['innate immunity', 'inflammation', 'neutrophils', 'macrophages', 'phagocytosis', 'natural killer cells', 'complement', 'chemotaxis', 'pus', 'fever', 'CRP', 'cytokines', 'toll-like receptors', 'white cell count', 'neutropenia', 'absolute neutrophil count', 'swelling', 'redness'],
  prereq: ['blood-composition', 'microbes-types', 'cell-structure'],
  related: ['adaptive-immunity', 'sepsis', 'infection-spread', 'thermoregulation', 'immunodeficiency', 'allergy', 'atherosclerosis', 'chemistry:effusion-diffusion', 'math:exponential-growth-decay'],
  body: `
A splinter slides into your fingertip while you are gardening. By evening the skin around it is red, warm, swollen and throbbing; a day later a bead of yellow pus may appear. None of that is the infection itself. It is your **innate immune system** at work — defences that are in place before any germ arrives, recognise whole classes of invaders rather than particular ones, and act within minutes to hours.

### The walls
Most microbes never get in. Skin is dry, slightly acidic and constantly shedding; the airways are lined with sticky mucus swept upwards by beating hairs (cilia); stomach acid kills much of what is swallowed; tears and saliva contain an enzyme, lysozyme, that splits bacterial walls; and the friendly bacteria of the skin and gut take up the space and food a newcomer would need (see [[gut-microbiome]]). A cut, a burn, a catheter or damaged airways open the walls — which is why these are where infections start.

### The first responders
| Cell | What it does |
|---|---|
| Neutrophils | the commonest white cells (about 40–75 % of them); rush in within hours, swallow and kill bacteria and fungi, then die — pus is mostly dead neutrophils |
| Macrophages | large "eating" cells resident in every tissue, grown from blood monocytes; eat microbes and debris, raise the alarm, and later clean up |
| Dendritic cells | sample their surroundings and carry pieces of invaders to the lymph nodes, starting [[adaptive-immunity]] |
| Natural killer cells | kill virus-infected and some cancer cells that have hidden their identity markers |
| Mast cells, eosinophils, basophils | alarm and anti-parasite cells — also the drivers of [[allergy]] |

The marrow makes on the order of a hundred billion neutrophils a day; they live only a day or so in the blood, which is why chemotherapy, by pausing the marrow, empties the blood of them within a week or two.

### Recognising trouble
Innate cells carry **pattern-recognition receptors** that detect molecules common to whole groups of microbes and absent from our own cells: pieces of bacterial walls, the protein of bacterial tails, viral genetic material in the wrong place. Other receptors notice the contents of our own damaged cells. In the blood, some thirty **complement** proteins cascade onto microbe surfaces, tagging them for eating, calling in cells and punching holes in some bacteria.

### Inflammation
Alerted cells release histamine, prostaglandins and signalling proteins called cytokines. Nearby small vessels widen, bringing more blood — the **redness** and **heat** — and become leaky, so plasma carrying complement and antibodies seeps into the tissue — the **swelling**. Nerve endings become sensitised — the **pain**, which makes you protect the part — and the part may work less well. Neutrophils in the blood slow down, roll along the vessel lining, stick and squeeze out between its cells, then crawl up a chemical trail towards the source: **chemotaxis**. They find their target the way you find a bakery by its smell, following the direction in which the scent gets stronger.

When the alarm is big enough, cytokines reach the whole body: the brain raises the temperature set-point — **fever** (see [[thermoregulation]]) — the liver pours out proteins such as C-reactive protein (the CRP of blood tests), and the marrow releases extra neutrophils, raising the white count. Fever helps: many microbes grow less well and immune cells work faster a few degrees warmer. Fever-lowering medicines can make a person more comfortable but do not treat the cause.

### When it goes wrong
- **Too little**: a low neutrophil count (neutropenia) after chemotherapy or with some medicines, or rare inherited defects, lets ordinary bacteria and fungi cause dangerous infections — see [[immunodeficiency]].
- **Too much, everywhere**: in [[sepsis]] the response to an infection spills into the whole body and starts damaging the body's own organs — a leading cause of death worldwide.
- **Not switching off**: chronic, low-grade inflammation contributes to [[atherosclerosis]], rheumatoid arthritis, inflammatory bowel disease and more.

> [!warn] Signs that an infection may be turning into sepsis: confusion, slurred speech or unusual drowsiness; very fast breathing or breathlessness; a racing heart; mottled, bluish or very pale skin; shivering or feeling very cold; passing little or no urine; or a sense that something is badly wrong. A fever in someone having chemotherapy is also an emergency. Call your local emergency number.
`,
  ideas: [
    'Innate immunity is ready before infection, recognises classes of microbes, and acts within minutes to hours.',
    'Barriers — skin, mucus, acid, enzymes and friendly microbes — stop most germs before any cell has to act.',
    'Neutrophils and macrophages eat invaders; dendritic cells carry the news to the adaptive system.',
    'Inflammation — redness, heat, swelling, pain — is leaky, widened vessels delivering cells and proteins, which reach the site by chemotaxis.',
    'Too weak an innate response invites infection; too strong a one, as in sepsis, damages the body itself.'
  ],
  pitfalls: [
    'Inflammation means infection — It is the body\'s response to any harm: a sprain, a burn or an autoimmune attack inflames tissues without any germ.',
    'Fever is always harmful and should always be brought down — Fever is part of the defence. Lowering it can ease discomfort, but it does not speed recovery; what matters is how unwell the person is and why.',
    'Pus means the infection is getting worse — Pus is mostly dead neutrophils that have done their job. A walled-off collection may need draining, but its presence shows the defence working.'
  ],
  formulas: [
    {
      name: 'Absolute neutrophil count',
      expr: 'ANC = WBC*fN', tex: '\\text{ANC} = \\text{WBC} \\times f_\\text{N}',
      vars: {
        ANC: { name: 'absolute neutrophil count (×10⁹/L)', tex: '\\text{ANC}' },
        WBC: { name: 'white cell count (×10⁹/L)', value: 7, tex: '\\text{WBC}' },
        fN: { name: 'share of white cells that are neutrophils', q: 'ratio', unit: '%', value: 60, min: 0, max: 100, tex: 'f_\\text{N}' }
      },
      note: '×10⁹/L is the same as thousands per microlitre. A healthy adult typically has about 2–7.5; below 1.5 is neutropenia and below 0.5 severe, with a high risk of serious infection. Healthy people of some ancestries run lower counts; laboratories differ.',
      practice: { unknowns: ['ANC', 'fN'] },
      stories: { ANC: 'A blood count shows {WBC} thousand white cells per microlitre, of which {fN} are neutrophils. What is the absolute neutrophil count?' }
    },
    {
      name: 'Why the first hours matter: bacteria doubling',
      expr: 'N = N0*2^(t/Td)', tex: 'N = N_0 \\cdot 2^{t/T_d}',
      vars: {
        N: { name: 'bacteria after time t', q: 'count', tex: 'N' },
        N0: { name: 'bacteria at the start', q: 'count', value: 10, tex: 'N_0' },
        t: { name: 'time since entry', q: 'time', unit: 'h', value: 8, tex: 't' },
        Td: { name: 'doubling time', q: 'time', unit: 'min', value: 30, tex: 'T_d' }
      },
      note: 'Unchecked growth (see [[math:exponential-growth-decay|exponential growth]]). In real tissue growth slows as food runs out and defences arrive, but the first hours decide whether a few invaders are mopped up or a colony is established.',
      stories: { N: '{N0} bacteria enter a wound and double every {Td}. If nothing stopped them, how many would there be after {t}?', t: 'Bacteria doubling every {Td} grow from {N0} to {N}. How long does that take?' }
    }
  ],
  examples: [
    {
      title: 'A blood count during chemotherapy',
      q: 'Before chemotherapy a woman\'s white count is 7.0 × 10⁹/L with 60 % neutrophils. Ten days after a treatment it is 1.2 × 10⁹/L with 30 % neutrophils. Compare the absolute neutrophil counts.',
      steps: [
        'Before: $7.0 \\times 0.60 = 4.2 \\times 10^9$/L — normal.',
        'After: $1.2 \\times 0.30 = 0.36 \\times 10^9$/L — below 0.5, severe neutropenia.',
        'With so few neutrophils, bacteria from her own gut and skin can invade, and the usual signs of infection (pus, swelling) may be missing: a fever may be the only clue.',
        'This is why treatment teams tell patients to act at once on a temperature and give them a number to call.'
      ],
      a: '4.2 before, 0.36 after (× 10⁹/L): severe neutropenia, in which a fever is an emergency.'
    },
    {
      title: 'A race against doubling',
      q: 'Ten bacteria enter a scratch and double every 30 minutes. How many would there be after 8 hours without any defence?',
      steps: [
        'Number of doublings: $8 \\text{ h} / 0.5 \\text{ h} = 16$.',
        '$N = 10 \\times 2^{16} = 655\\,360$.',
        'Resident macrophages act within minutes and neutrophils arrive within hours, so in a healthy person most such invasions end in the first few doublings, unnoticed.'
      ],
      a: 'About 655 000 — which is why the defences that act in the first hours matter so much.'
    }
  ],
  quiz: [
    { q: 'What is pus mainly made of?', choices: ['dead neutrophils, bacteria and debris', 'antibodies', 'blood plasma', 'dead skin cells'], a: 0,
      why: 'Neutrophils swarm to the site, eat bacteria and die within a day or two. Their remains, with the microbes and broken tissue, form pus.' },
    { q: 'Why is inflamed skin red and warm?', choices: ['nearby small blood vessels widen and carry more blood', 'bacteria produce heat', 'the skin cells are dying', 'the nerves are overactive'], a: 0,
      why: 'Histamine, prostaglandins and cytokines widen the local vessels, so more warm blood flows through the area.' },
    { q: 'A white count of 5.0 × 10⁹/L with 50 % neutrophils gives what absolute neutrophil count, in 10⁹/L?', answer: 2.5,
      why: '5.0 × 0.50 = 2.5 × 10⁹/L, within the usual range.' },
    { q: 'Innate immune cells recognise each microbe by a receptor made specially for that one species.', a: false,
      why: 'That is how the adaptive system works. Innate receptors detect patterns shared by whole groups of microbes — bacterial wall components, viral genetic material — and signs of damage.' },
    { q: 'How do neutrophils find bacteria in a tissue?', choices: ['they crawl towards higher concentrations of chemical signals from the site', 'they wander at random until they bump into them', 'they are carried there by lymph', 'antibodies drag them there'], a: 0,
      why: 'Chemotaxis: bacteria, complement and alarmed cells release attractant molecules that spread out from the site, and neutrophils move in the direction in which the signal grows stronger.' }
  ],
  applications: ['The white count and CRP in blood tests as markers of infection and inflammation.', 'Protecting people with neutropenia during cancer treatment.', 'Recognising sepsis early, when treatment saves most lives.', 'Anti-inflammatory medicines, which dampen parts of this response.'],
  history: 'Élie Metchnikoff saw mobile cells gather around a thorn stuck into a starfish larva in 1882 and proposed that such eating cells defend the body — phagocytosis — sharing a Nobel Prize in 1908.',
  sim: 'bi-neutrophils'
},

{
  id: 'adaptive-immunity', parent: 'immunity', title: 'Adaptive immunity: T and B cells', level: 2,
  short: 'The part of the immune system that learns: lymphocytes with receptors made by shuffling genes, so that among millions of them a few fit any invader; those few multiply, fight, and leave memory cells that make the next encounter quick — the basis of vaccination.',
  keywords: ['adaptive immunity', 'lymphocytes', 'T cells', 'B cells', 'helper T cells', 'CD4', 'CD8', 'cytotoxic T cells', 'clonal selection', 'immunological memory', 'MHC', 'HLA', 'antigen', 'lymph nodes', 'plasma cells', 'tolerance', 'V(D)J recombination', 'primary response', 'secondary response'],
  prereq: ['innate-immunity', 'dna-genes', 'blood-composition'],
  related: ['antibodies', 'vaccines', 'autoimmunity', 'immunodeficiency', 'hiv', 'allergy', 'dialysis-transplant', 'immunotherapy', 'math:combinatorics'],
  body: `
At five, Leo catches chickenpox from a classmate. Two weeks later he has a fever and hundreds of itchy spots, and he is ill for a week. When his baby sister catches it the next year and they share a room, nothing happens to him at all. Between the two encounters his immune system has *learned*: it found, among millions of cells, the few that recognised the chickenpox virus, multiplied them into an army, and kept a standing reserve.

### Two kinds of lymphocyte
**B cells** mature in the bone marrow and make [[antibodies]]. **T cells** mature in the thymus, a gland behind the breastbone, and come in several kinds: **helper T cells** (carrying the marker CD4) coordinate the response and license B cells and killer cells; **cytotoxic T cells** (CD8) kill infected cells; **regulatory T cells** keep the rest in check. Lymphocytes circulate between the blood and the lymph nodes, spleen, tonsils and gut lining, the meeting places where they inspect what the innate system has brought in.

### A receptor for (almost) everything
Each lymphocyte carries one kind of receptor, many copies of it. The receptor genes come in segments that are cut and joined at random while the cell matures, with extra letters added or removed at the joins. The combinations alone run to millions, and the untidy joins multiply that many times over, so the possible receptors outnumber anything a person could meet (see [[math:combinatorics|combinatorics]]). No one designed a receptor for a new virus; among the tens of millions of different receptors present in an adult, some will fit it by chance.

### How a T cell sees
T cells do not see whole germs. Every cell displays fragments of the proteins inside it on molecules called **MHC** (in humans, **HLA**). Class I molecules on almost all cells show what the cell is making — so a killer T cell can spot a cell making viral protein. Class II molecules on dendritic cells, macrophages and B cells show what they have swallowed, to helper T cells. HLA types vary hugely between people, which is why organs are matched before a transplant (see [[dialysis-transplant]]) and why some HLA types are linked to particular diseases.

### Clonal selection: the first response
For any one foreign fragment perhaps one T cell in a hundred thousand to a million fits. When a dendritic cell presents that fragment in a lymph node, the matching cell is *selected*: it divides, and its descendants — a **clone** — keep dividing every several hours for about a week, growing thousands-fold. Helper T cells release signals; killer T cells leave to hunt infected cells; B cells become **plasma cells**, each pouring out thousands of antibody molecules a second. In the lymph node's germinal centres, B cells mutate their receptors and the best-fitting are kept, so antibodies improve over weeks (affinity maturation), and switch from the early IgM to IgG or IgA. All this takes one to two weeks — the time you spend ill with a new infection. The response in the simulation shows it.

### Memory: the second response
When the germ is gone most of the army dies, but **memory cells** remain, some for decades. At the next encounter they are more numerous, faster to act and already switched and refined, so antibodies rise within days, higher than before, often before any symptom. That is why most people have measles or chickenpox only once — and it is exactly what [[vaccines]] exploit: a harmless version of the germ, or one of its proteins, trains the memory without the illness. Memory is not equally durable for every germ: some viruses, like influenza, keep changing their surface, and some vaccines need boosters.

### Knowing self from non-self
Random receptors will also fit the body's own proteins. In the thymus, T cells are shown fragments of proteins from all over the body, and most that react strongly are destroyed; regulatory T cells restrain the self-reactive cells that slip through. When this tolerance fails, the result is [[autoimmunity]].

### When it goes wrong
HIV destroys helper T cells, crippling the whole adaptive response ([[hiv]], [[immunodeficiency]]); allergy is an adaptive response aimed at a harmless target ([[allergy]]); and lymphomas and some leukaemias are cancers of lymphocytes. Cancer medicine now harnesses T cells directly — releasing their brakes or engineering them to find tumours (see [[immunotherapy]]).

> [!note] Catching a disease to become immune is a poor bargain. Measles, for example, kills and disables, and it can also wipe out a large part of existing immune memory — in one 2019 study, between about a tenth and nearly three-quarters of a child's antibody repertoire — leaving them open to other infections for years. A vaccine builds the memory without these costs.
`,
  ideas: [
    'B cells make antibodies; helper T cells (CD4) coordinate; cytotoxic T cells (CD8) kill infected cells.',
    'Receptors are made by shuffling gene segments at random, so among millions of lymphocytes a few fit any invader.',
    'T cells recognise protein fragments presented on MHC (HLA) molecules, not whole germs.',
    'Clonal selection: the matching cells multiply thousands-fold over a week or two — the primary response.',
    'Memory cells make the second response faster, bigger and better — the principle behind vaccines.'
  ],
  pitfalls: [
    'The immune system designs an antibody for each new germ — Nothing is designed: receptors are made at random in advance, and the germ selects the ones that happen to fit, which then multiply and are refined.',
    'Immunity is only about antibodies — T cells are just as important: helper T cells are needed for strong antibody responses, and killer T cells clear virus-infected cells that antibodies cannot reach.',
    'Once immune, always immune — Memory lasts for decades against some germs, but wanes against others, and germs such as influenza change their surface, so boosters and updated vaccines are needed.'
  ],
  formulas: [
    {
      name: 'Clonal expansion',
      expr: 'N = N0*2^(t/Td)', tex: 'N = N_0 \\cdot 2^{t/T_d}',
      vars: {
        N: { name: 'cells in the clone after time t', q: 'count', tex: 'N' },
        N0: { name: 'matching cells at the start', q: 'count', value: 100, tex: 'N_0' },
        t: { name: 'time since activation', q: 'time', unit: 'day', value: 7, tex: 't' },
        Td: { name: 'time between divisions', q: 'time', unit: 'h', value: 12, tex: 'T_d' }
      },
      note: 'An idealised model: division times of 6–12 hours at the peak are seen in experiments, and expansion stops as the germ is cleared. It shows why a response built from a handful of cells takes about a week.',
      stories: { N: '{N0} T cells that recognise a virus start dividing every {Td}. How many are there after {t}?', t: 'How long does it take a clone to grow from {N0} to {N} cells if it divides every {Td}?' }
    },
    {
      name: 'Antibody diversity from gene segments alone',
      expr: 'Nr = V*D*J*L', tex: 'N_r = V \\cdot D \\cdot J \\cdot L',
      vars: {
        Nr: { name: 'different antibodies from combinations', q: 'count', tex: 'N_r' },
        V: { name: 'heavy-chain V segments', q: 'count', value: 40, int: true, tex: 'V' },
        D: { name: 'heavy-chain D segments', q: 'count', value: 23, int: true, tex: 'D' },
        J: { name: 'heavy-chain J segments', q: 'count', value: 6, int: true, tex: 'J' },
        L: { name: 'different light chains', q: 'count', value: 320, int: true, tex: 'L' }
      },
      note: 'Approximate numbers of working human segments; the light chains come from two gene families (about 40 × 5 and 30 × 4 combinations). The random trimming and adding of letters at each join multiplies the total many thousands of times more.',
      stories: { Nr: 'With {V} V, {D} D and {J} J segments for the heavy chain and {L} possible light chains, how many antibodies can combination alone produce?' }
    }
  ],
  examples: [
    {
      title: 'From a hundred cells to an army',
      q: 'A hundred T cells recognise a new virus. If each divides every 12 hours, how many descendants are there after a week?',
      steps: [
        'Number of divisions: $7 \\times 24 / 12 = 14$.',
        '$N = 100 \\times 2^{14} = 1\\,638\\,400$ — about 1.6 million cells.',
        'The first days produce few cells — 800 after a day and a half — which is why the primary response takes a week or more to become effective.'
      ],
      a: 'About 1.6 million cells after a week.'
    },
    {
      title: 'Counting antibodies',
      q: 'A heavy chain is built from one of about 40 V, 23 D and 6 J segments, and pairs with one of about 320 light chains. How many antibodies can these combinations make?',
      steps: [
        'Heavy chains: $40 \\times 23 \\times 6 = 5520$.',
        'With light chains: $5520 \\times 320 = 1\\,766\\,400$.',
        'The imprecise joins between segments multiply this by a huge factor, so the potential diversity far exceeds the number of B cells in a body: each person carries only a sample of what could be made.'
      ],
      a: 'About 1.8 million from combinations alone; many orders of magnitude more with the junctions.'
    },
    {
      title: 'Leo and his sister',
      q: 'Why was Leo ill for a week with his first chickenpox, but untouched when exposed a year later?',
      steps: [
        'First exposure: only a few of his lymphocytes fitted the virus. They had to be found, activated and multiplied, and his antibodies started as early IgM — while the virus spread.',
        'Recovery left memory B and T cells, more numerous and already refined.',
        'Second exposure: memory cells recognised the virus within days and produced high levels of IgG before it could spread — no illness.',
        'The chickenpox vaccine creates the same memory without the first illness.'
      ],
      a: 'The first time the response had to be built from scratch; the second time memory cells were ready.'
    }
  ],
  quiz: [
    { q: 'Why does it take one to two weeks to control a new infection with the adaptive immune system?', choices: ['the few matching lymphocytes must be activated and multiplied', 'new antibody genes must be designed', 'lymphocytes must travel from the bone marrow', 'the germ must first be killed by fever'], a: 0,
      why: 'Only a tiny fraction of lymphocytes fits a given germ. They must be selected and divide repeatedly — clonal expansion — before there are enough to win.' },
    { q: 'A cytotoxic (CD8) T cell recognises an infected cell by…', choices: ['viral protein fragments displayed on the cell\'s MHC class I molecules', 'antibodies stuck to the virus', 'the whole virus on the cell surface', 'the cell\'s blood group'], a: 0,
      why: 'Every cell displays fragments of the proteins it is making on class I MHC. A cell making viral proteins shows viral fragments, and a matching CD8 T cell kills it.' },
    { q: 'Vaccines work by creating immune memory without the person having the disease.', a: true,
      why: 'A vaccine presents a harmless form of the germ or one of its parts, so a primary response and memory cells develop; a later real infection meets a fast secondary response.' },
    { q: 'HIV damages the whole adaptive immune system mainly because it destroys…', choices: ['helper (CD4) T cells', 'red cells', 'neutrophils', 'the bone marrow'], a: 0,
      why: 'Helper T cells coordinate both antibody and killer-T-cell responses; as they fall, both weaken.' },
    { q: 'Fifty T cells divide every 8 hours for 4 days. About how many cells are there at the end?', answer: 204800,
      why: '4 days = 96 hours = 12 divisions; 50 × 2¹² = 204 800.' }
  ],
  applications: ['Vaccination, which trains memory cells in advance.', 'Tissue typing (HLA matching) for organ and stem-cell transplants.', 'Measuring CD4 counts in people living with HIV.', 'Cancer immunotherapies that unleash or engineer T cells.'],
  history: 'Frank Macfarlane Burnet proposed clonal selection in 1957; Susumu Tonegawa showed in 1976 how antibody genes are assembled from shuffled segments; the thymus\'s role in making T cells was found by Jacques Miller in 1961.',
  sim: 'bi-clonal'
},

{
  id: 'antibodies', parent: 'immunity', title: 'Antibodies', level: 2,
  short: 'Y-shaped proteins made by B cells that grip one particular shape on a germ or toxin. They block, tag and clump invaders, pass from mother to baby, and have become tools for tests and some of the most important medicines of recent decades.',
  keywords: ['antibodies', 'immunoglobulin', 'IgG', 'IgM', 'IgA', 'IgE', 'IgD', 'antigen', 'epitope', 'neutralisation', 'opsonisation', 'complement', 'affinity', 'maternal antibodies', 'passive immunity', 'breast milk', 'serology', 'monoclonal antibody', 'immunoglobulin replacement'],
  prereq: ['adaptive-immunity', 'chemistry:amino-acids-proteins', 'chemistry:equilibrium-constant'],
  related: ['vaccines', 'blood-groups', 'allergy', 'autoimmunity', 'immunodeficiency', 'lab-tests', 'pregnancy', 'birth-newborn', 'immunotherapy', 'math:exponential-growth-decay'],
  body: `
In the last months of pregnancy, Amara was offered a vaccine against whooping cough. Her own immune system made more antibodies against it, and those antibodies crossed the placenta into her baby. When her daughter was born, she carried her mother's protection — enough to guard her through the first weeks, when whooping cough is most dangerous and before she was old enough for her own vaccines. The borrowed antibodies faded over the following months, just as her own began to rise.

### The shape
An antibody (immunoglobulin) is a Y about 10 nanometres across, built from two identical heavy protein chains and two identical light ones. The tips of the two arms are the variable part, folded into a pocket that fits one small patch of a target — the **epitope** — by shape and charge. The stem is the constant part: it tells the rest of the immune system what to do with whatever the arms have caught.

| Class | Where it is found | What it is good for |
|---|---|---|
| IgM | first class made in a new response; five Ys joined in a star (ten arms) | clumping microbes and triggering complement; its presence suggests a recent infection |
| IgG | about three-quarters of the antibody in blood | the long-lasting workhorse of memory and vaccines; crosses the placenta; half-life about three weeks |
| IgA | mucus, tears, saliva, breast milk, as a pair of Ys | guarding the surfaces; the body makes more IgA each day than all other classes together |
| IgE | traces in blood, mostly bound to mast cells | defence against parasites — and the trigger of [[allergy]] |
| IgD | on the surface of young B cells | a receptor; its other roles are still being worked out |

### What antibodies do
Antibodies rarely kill anything themselves. They **neutralise** — covering the parts a virus or toxin uses to enter cells, which is how tetanus and diphtheria vaccines protect; they **tag** microbes so that phagocytes, which carry receptors for the stem, eat them readily; they switch on **complement**, which punches holes in some bacteria; they point natural killer cells at infected cells; and, having two or more arms, they **clump** microbes (or mismatched red cells, see [[blood-groups]]) together.

Binding is reversible: an antibody arm lets go and grips again. How tightly it holds is described by a dissociation constant $K_d$, the concentration of target at which half the arms are occupied (see [[chemistry:equilibrium-constant|equilibrium constant]]):

$$\\theta = \\frac{C}{C + K_d}$$

Early antibodies may have a $K_d$ around a micromolar; after weeks of refinement, nanomolar or better — a thousand times tighter, so they work at far lower concentrations.

### Passive immunity: borrowed antibodies
IgG is carried actively across the placenta, mostly in the last three months of pregnancy, so a baby born at term starts life with about its mother's level (and one born very early with much less). The borrowed IgG decays with a half-life of roughly three to six weeks, depending on the antibody, so it has largely gone by six to twelve months, while the baby's own production builds up; the combined level dips at about three to six months. Breast milk adds IgA that coats the baby's gut. Vaccinating mothers in pregnancy — against whooping cough, and in many countries influenza, COVID-19 and RSV — boosts this handover. Borrowed antibodies can also blunt some live vaccines, one reason the measles vaccine is usually given at around nine to fifteen months.

Ready-made antibodies are also given as treatment: immunoglobulin pooled from thousands of donors for people who cannot make their own ([[immunodeficiency]]), specific immunoglobulins after exposure to rabies, tetanus or hepatitis B, antivenoms, and long-acting antibodies that protect infants against RSV.

### Antibodies as tools
Blood tests look for antibodies to show past infection or vaccination — IgM for recent, IgG for past — and many rapid tests, including home pregnancy and virus antigen tests, use antibodies to catch their target on a strip. **Monoclonal antibodies**, copies of a single antibody made in cell culture, are now major medicines, their generic names ending in *-mab*: against cancers (trastuzumab, rituximab, pembrolizumab), autoimmune diseases (adalimumab), migraine, high cholesterol and severe asthma.

### When they go wrong
Antibodies aimed at the body itself cause many [[autoimmunity|autoimmune diseases]]; IgE aimed at pollen or peanuts causes allergy; too few antibodies leave people open to repeated chest and ear infections. With dengue, antibodies from a first infection can occasionally make a second infection with a different type worse, a rare example of antibodies helping a virus.

> [!warn] Young babies depend on borrowed protection. In a baby under three months, a temperature of 38 °C or more; or in any baby, floppiness, being hard to wake, fast breathing or pauses in breathing, turning blue, or a rash that does not fade when pressed — call your local emergency number.
`,
  ideas: [
    'An antibody is a Y: two variable arms grip one epitope, and the constant stem directs the response.',
    'IgM comes first, IgG lasts and crosses the placenta, IgA guards mucous surfaces, IgE drives allergy.',
    'Antibodies neutralise, tag, trigger complement and clump — they rarely kill on their own.',
    'Binding is reversible: the fraction of arms occupied is C/(C + Kd), and affinity improves as a response matures.',
    'Maternal IgG protects babies for months, with a half-life of a few weeks; monoclonal antibodies are now major medicines.'
  ],
  pitfalls: [
    'Antibodies kill germs directly — Mostly they block and tag: phagocytes, complement and killer cells do the destroying.',
    'Having antibodies always means being protected — Antibodies differ in which part they bind and how tightly; some tests detect antibodies that do not neutralise, and levels wane.',
    'Babies have no immune protection until their first vaccines — They carry their mother\'s IgG and receive IgA in breast milk, though this protection fades over the first months and is weaker in babies born early.'
  ],
  formulas: [
    {
      name: 'Fraction of antibody arms bound',
      expr: 'theta = C/(C + Kd)', tex: '\\theta = \\frac{C}{C + K_d}',
      vars: {
        theta: { name: 'fraction of arms occupied', q: 'ratio', unit: '%', tex: '\\theta' },
        C: { name: 'concentration of free target', q: 'concentration', unit: 'nM', value: 10, tex: 'C' },
        Kd: { name: 'dissociation constant', q: 'concentration', unit: 'nM', value: 1, tex: 'K_d' }
      },
      note: 'Simple one-site binding at equilibrium. A smaller Kd means tighter binding; at C = Kd half the sites are filled. The same law describes a drug binding its receptor.',
      stories: { theta: 'An antibody with a dissociation constant of {Kd} meets its target at {C}. What fraction of its arms are occupied?', Kd: 'An antibody has {theta} of its arms occupied when its target is at {C}. What is its dissociation constant?' }
    },
    {
      name: 'Borrowed antibodies fading',
      expr: 'F = 0.5^(t/th)', tex: 'F = \\left(\\tfrac{1}{2}\\right)^{t/t_{1/2}}',
      vars: {
        F: { name: 'fraction of maternal IgG left', q: 'ratio', unit: '%', tex: 'F' },
        t: { name: 'baby\'s age', q: 'time', unit: 'day', value: 90, tex: 't' },
        th: { name: 'half-life of the maternal IgG', q: 'time', unit: 'day', value: 30, tex: 't_{1/2}' }
      },
      note: 'Exponential decay (see [[math:exponential-growth-decay|exponential decay]]). Half-lives of about 20–45 days are measured for different maternal antibodies. Protection lasts until the level falls below what is needed, so a higher start buys time.',
      practice: { unknowns: ['F', 't'] },
      stories: { F: 'Maternal IgG has a half-life of {th}. What fraction is left when the baby is {t} old?', t: 'With a half-life of {th}, when has maternal IgG fallen to {F} of its level at birth?' }
    }
  ],
  examples: [
    {
      title: 'Fading protection',
      q: 'Maternal IgG in a baby has a half-life of 30 days. What fraction is left at three and at six months (90 and 180 days)?',
      steps: [
        'At 90 days: three half-lives, $0.5^3 = 0.125$ — 12.5 %.',
        'At 180 days: six half-lives, $0.5^6 = 0.016$ — 1.6 %.',
        'Meanwhile the baby\'s own antibody production is rising, so the total dips at around three to six months before climbing.'
      ],
      a: '12.5 % at three months and 1.6 % at six months.'
    },
    {
      title: 'How long does a head start last?',
      q: 'Suppose a baby needs a certain level of antibody against whooping cough to be protected. If a mother vaccinated in pregnancy gives her baby eight times that level at birth, and an unvaccinated mother 1.5 times, how long does protection last with a 30-day half-life?',
      steps: [
        'Protection lasts until $F$ falls to the protective level: $t = t_{1/2} \\log_2(\\text{start}/\\text{needed})$.',
        'Vaccinated: $30 \\times \\log_2 8 = 30 \\times 3 = 90$ days.',
        'Unvaccinated: $30 \\times \\log_2 1.5 = 30 \\times 0.585 = 17.5$ days.',
        'Illustrative numbers — but they show why vaccination in pregnancy covers the first two to three months, until the baby\'s own vaccines take over.'
      ],
      a: 'About 90 days against about 18 days.'
    },
    {
      title: 'Why affinity matters',
      q: 'An antibody with $K_d$ = 1 nM meets its target at 10 nM. What fraction of arms is occupied? And if the target is only 1 nM?',
      steps: [
        'At 10 nM: $\\theta = 10/(10 + 1) = 0.91$ — 91 %.',
        'At 1 nM: $\\theta = 1/(1 + 1) = 0.50$ — 50 %.',
        'An early antibody with $K_d$ = 1000 nM would fill only about 1 % of its arms at 10 nM: affinity maturation is what lets small amounts of antibody work.'
      ],
      a: '91 % at 10 nM, 50 % at 1 nM.'
    }
  ],
  quiz: [
    { q: 'Which antibody class crosses the placenta and protects a newborn?', choices: ['IgG', 'IgM', 'IgA', 'IgE'], a: 0,
      why: 'The placenta has a receptor that actively carries IgG from mother to baby, mostly in the last trimester. IgA reaches the baby through breast milk instead.' },
    { q: 'A blood test shows IgM antibodies against a virus but no IgG. The most likely explanation is…', choices: ['a recent infection', 'an infection years ago', 'vaccination in childhood', 'immunity passed on by the mother'], a: 0,
      why: 'IgM is made first in a new response; IgG follows after class switching and persists. IgM without IgG fits an infection in the last few weeks.' },
    { q: 'When the concentration of target equals the dissociation constant, what percentage of antibody arms is occupied?', answer: 50,
      why: 'θ = C/(C + Kd) = Kd/(2 Kd) = 0.5 — that is the definition of the dissociation constant.' },
    { q: 'Antibodies usually destroy bacteria by themselves.', a: false,
      why: 'Antibodies mark, block and clump. The destruction is done by complement, phagocytes and natural killer cells recruited through the antibody stem.' },
    { q: 'Why is the measles vaccine not usually given at birth?', choices: ['antibodies from the mother can neutralise the live vaccine virus', 'newborns cannot catch measles', 'the vaccine damages the placenta', 'babies have no B cells'], a: 0,
      why: 'Maternal IgG against measles mops up the weakened vaccine virus before it can train the baby\'s immune system, so the vaccine is given once those antibodies have faded.' }
  ],
  applications: ['Vaccination in pregnancy to protect newborns.', 'Serology tests for past infection and immunity.', 'Monoclonal antibody medicines for cancer, autoimmune disease, migraine and asthma.', 'Immunoglobulin replacement, antivenoms and post-exposure protection against rabies and tetanus.'],
  history: 'Emil von Behring and Shibasaburo Kitasato showed in 1890 that serum from immunised animals protected against diphtheria and tetanus toxins; Rodney Porter and Gerald Edelman worked out the Y-shaped structure in the 1960s; Georges Köhler and César Milstein made the first monoclonal antibodies in 1975.',
  sim: 'bi-infant-igg'
},

{
  id: 'allergy', parent: 'immunity', title: 'Allergy', level: 2,
  short: 'An immune response aimed at something harmless — pollen, dust mites, a food, a sting. A silent first exposure primes mast cells with IgE; the next exposure makes them burst open within minutes, causing symptoms from sneezing to life-threatening anaphylaxis.',
  keywords: ['allergy', 'allergic', 'IgE', 'mast cells', 'histamine', 'hay fever', 'allergic rhinitis', 'food allergy', 'peanut allergy', 'anaphylaxis', 'adrenaline', 'epinephrine', 'auto-injector', 'antihistamine', 'hives', 'eczema', 'sensitisation', 'skin prick test', 'immunotherapy', 'desensitisation', 'penicillin allergy'],
  prereq: ['antibodies', 'adaptive-immunity', 'innate-immunity'],
  related: ['anaphylaxis', 'asthma', 'autoimmunity', 'bayes-diagnosis', 'diagnostic-accuracy', 'side-effects-interactions', 'antibiotics', 'math:bayes-theorem'],
  body: `
Every May, when the grass flowers, Jonah's nose runs, his eyes itch and he sneezes through his exams. His friend Noa has a different problem: at eight, a biscuit that turned out to contain peanut made her lips swell and her throat feel tight within minutes; she now carries an adrenaline auto-injector everywhere. Both are **allergy**: the adaptive immune system mounting a full defence against something that is harmless.

### Step one: sensitisation, silently
The first contact with an allergen — a protein in pollen, house-dust-mite droppings, animal dander, a food, insect venom, latex or a medicine — goes unnoticed. In people prone to allergy, dendritic cells present it to helper T cells that take a particular route (called type 2), and these instruct B cells to make **IgE** against it. IgE clings to receptors on **mast cells**, which sit in the skin, the lining of the nose, airways and gut, and near blood vessels. The mast cells are now armed, sometimes for years, but nothing is felt.

### Step two: the reaction
At the next contact, the allergen bridges two IgE molecules on a mast cell, and within seconds the cell empties its granules. Out comes **histamine**, followed within minutes by other messengers (leukotrienes and prostaglandins):

- small vessels widen and leak — redness, swelling, hives, a blocked or running nose, and, if widespread, a falling blood pressure;
- nerves are irritated — itching and sneezing;
- smooth muscle tightens and mucus pours out — wheeze and cough in the airways, cramps and vomiting in the gut.

Hours later a *late phase* follows, as eosinophils and other cells arrive, which is why asthma can worsen at night after a daytime exposure. The simulation walks through both steps.

### A spectrum of conditions
Hay fever (allergic rhinitis) affects somewhere between one in ten and one in three people, depending on the country and the survey. Food allergy affects a few per cent of children in high-income countries — commonly to milk, egg, peanut, tree nuts, sesame, fish, shellfish, wheat and soy; many children outgrow milk and egg allergy, fewer outgrow peanut and tree-nut allergy. Eczema, food allergy, [[asthma]] and hay fever often cluster in the same people and families.

Some reactions are not IgE allergy at all. Contact dermatitis from nickel or hair dye is a delayed T-cell reaction that appears a day or two later. Lactose intolerance is a shortage of a digestive enzyme, not an immune reaction. And about one person in ten has a penicillin allergy on their records, yet when properly tested more than nine in ten of them can take penicillin safely.

### Why is allergy becoming more common?
Allergies have risen over decades, especially in wealthy, urban countries. One idea — the "hygiene" or "old friends" hypothesis — holds that less early contact with a rich variety of microbes leaves the immune system prone to misfire; children raised on traditional farms have fewer allergies. The evidence is suggestive rather than settled. One finding is solid: in the LEAP trial (2015), infants at high risk who ate peanut regularly from the first year of life were about 80 % less likely to be allergic to it at five than those who avoided it. Guidelines in many countries now advise introducing peanut and egg during infancy instead of delaying; babies with severe eczema or an existing food allergy may need a health professional's advice first.

### Testing
Skin-prick tests and blood tests for specific IgE show **sensitisation** — that IgE exists — not whether it causes symptoms. Many sensitised people eat the food without trouble. A test means most when it matches a clear story; when it does not, a supervised food challenge in a clinic, where the food is eaten in small steps, is the reference test. How a result changes the probability of a true allergy depends on how likely it was before (see [[bayes-diagnosis]]).

### Treatment
Avoiding the trigger where possible; **antihistamines**, which block histamine's receptor and ease itching, sneezing and hives; steroid nasal sprays for hay fever; **allergen immunotherapy** — gradually increasing doses given under specialist care, as tablets, drops or injections, for pollen, dust mite and insect-venom allergy, and oral immunotherapy for peanut in some countries; and, for severe allergic asthma or hives, a monoclonal antibody that mops up IgE. People at risk of severe reactions carry **adrenaline (epinephrine) auto-injectors** and a written plan, and their family, school or workplace learns how to use them.

> [!warn] **Anaphylaxis** is a severe, whole-body allergic reaction and an emergency (first aid in [[anaphylaxis]]). Warning signs: swelling of the tongue or throat, a hoarse voice or trouble swallowing; noisy or difficult breathing, wheeze or a persistent cough; feeling faint, dizziness, collapse, or a pale, floppy child — often, but not always, with hives, flushing or vomiting. Use the person's adrenaline auto-injector straight away if they carry one, and call your local emergency number.
`,
  ideas: [
    'Allergy is an adaptive immune response against a harmless target, usually through IgE.',
    'Sensitisation is silent: IgE is made and arms mast cells without symptoms.',
    'On re-exposure, the allergen bridges IgE on mast cells, which release histamine and other messengers within minutes.',
    'A positive skin or blood test shows sensitisation, not necessarily allergy; the history decides what it means.',
    'Antihistamines ease mild symptoms; anaphylaxis needs adrenaline and an emergency call.'
  ],
  pitfalls: [
    'I reacted the first time I ate it, so it cannot be an allergy — Many first reactions follow an unnoticed earlier sensitisation (through the skin, for instance), so a "first" reaction is common.',
    'An antihistamine will treat anaphylaxis — Antihistamines act slowly and do not open airways or raise blood pressure. Adrenaline is the treatment; antihistamines only help the skin symptoms.',
    'A positive allergy test means I am allergic — It shows sensitisation. Many people with positive tests tolerate the food; the history, and sometimes a supervised challenge, decide.'
  ],
  formulas: [
    {
      name: 'Probability after a test (likelihood ratio)',
      expr: 'P2 = P1*LR/(1 - P1 + P1*LR)', tex: 'P_\\text{after} = \\frac{P_\\text{before}\\,\\text{LR}}{1 - P_\\text{before} + P_\\text{before}\\,\\text{LR}}',
      vars: {
        P2: { name: 'probability of a true allergy after the test', q: 'ratio', unit: '%', tex: 'P_\\text{after}' },
        P1: { name: 'probability of a true allergy before the test', q: 'ratio', unit: '%', value: 5, min: 0, max: 100, tex: 'P_\\text{before}' },
        LR: { name: 'likelihood ratio of the result', value: 3, tex: '\\text{LR}' }
      },
      note: 'Bayes\' theorem in odds form (see [[math:bayes-theorem|Bayes\' theorem]]): the odds after = the odds before × the likelihood ratio. The likelihood ratio of a positive result is sensitivity ÷ (1 − specificity); for allergy tests it depends heavily on the size of the reaction or the IgE level, and the value here is illustrative.',
      practice: { unknowns: ['P2', 'P1'] },
      stories: { P2: 'Before testing, the chance that a child is allergic to a food is {P1}. A positive skin-prick test has a likelihood ratio of {LR}. What is the chance of a true allergy now?' }
    }
  ],
  examples: [
    {
      title: 'The same test, two children',
      q: 'Two children have the same positive peanut skin-prick test, with an (illustrative) likelihood ratio of 3. Child A has never reacted to peanut and was tested as part of a broad panel (chance of allergy before the test 5 %). Child B had swollen lips and hives minutes after eating peanut (chance before 60 %). What does the test mean for each?',
      steps: [
        'Child A: $0.05 \\times 3 / (1 - 0.05 + 0.05 \\times 3) = 0.15 / 1.10 = 0.14$ — about 14 %.',
        'Child B: $0.6 \\times 3 / (1 - 0.6 + 0.6 \\times 3) = 1.8 / 2.2 = 0.82$ — about 82 %.',
        'For child A the result is most likely sensitisation without allergy; stopping a food he eats happily could even make a real allergy more likely. For child B the test confirms a clear story.',
        'This is why allergy specialists test for suspected foods rather than screening panels.'
      ],
      a: 'About 14 % for child A and 82 % for child B — the same result, very different meanings.'
    },
    {
      title: 'An old label',
      q: 'A woman\'s records say "penicillin allergy" because of a rash during an antibiotic course when she was four. Why might it be worth reviewing?',
      steps: [
        'Rashes during childhood infections are often caused by the infection itself, not the antibiotic.',
        'True penicillin allergy can also fade over years.',
        'The label steers doctors to other antibiotics that are often broader, less effective or more likely to cause side effects and resistance (see [[antibiotics]]).',
        'An allergy specialist can assess the history and, where appropriate, carry out skin testing or a supervised dose — most such labels are removed.'
      ],
      a: 'Most such labels turn out to be wrong; a specialist assessment can remove them safely.'
    }
  ],
  quiz: [
    { q: 'Why does a first exposure to an allergen usually cause no symptoms?', choices: ['IgE has not yet been made and bound to mast cells', 'the allergen is destroyed by stomach acid', 'the first dose is always too small', 'mast cells are not yet born'], a: 0,
      why: 'Sensitisation — making IgE and arming mast cells — takes days to weeks and is silent. Only a later exposure can cross-link IgE and trigger the mast cells.' },
    { q: 'An antihistamine tablet is enough to treat anaphylaxis.', a: false,
      why: 'Anaphylaxis narrows the airways and drops the blood pressure within minutes. Adrenaline reverses both; antihistamines are too slow and too weak for that, and should never delay adrenaline and an emergency call.' },
    { q: 'A child who eats peanut butter every week without any problem has a positive peanut skin-prick test. What is the best interpretation?', choices: ['sensitised but not allergic', 'allergic, so peanut must be stopped', 'the test must be faulty', 'the child will certainly develop an allergy'], a: 0,
      why: 'Tolerating the food regularly is the strongest evidence. The test shows IgE exists but not that it causes reactions; stopping a tolerated food is not advised without specialist input.' },
    { q: 'Before a test the chance of a true allergy is 20 %. A positive result has a likelihood ratio of 4. What is the chance afterwards, in per cent?', answer: 50,
      why: 'Odds before 0.25; × 4 = odds 1; probability 1/(1 + 1) = 50 %.' },
    { q: 'Which of these is NOT an immune (allergic) reaction?', choices: ['lactose intolerance', 'hay fever', 'nickel contact dermatitis', 'hives after a wasp sting'], a: 0,
      why: 'Lactose intolerance is a lack of the enzyme lactase in the gut. The others are immune reactions — IgE in hay fever and sting reactions, T cells in nickel dermatitis.' }
  ],
  applications: ['Adrenaline auto-injectors and allergy action plans in schools.', 'Allergen immunotherapy for hay fever, dust mite and venom allergy.', 'Early introduction of allergenic foods in infant feeding guidance.', 'Food labelling laws that require the main allergens to be declared.'],
  sim: 'bi-allergy'
},

{
  id: 'autoimmunity', parent: 'immunity', title: 'Autoimmune disease', level: 2,
  short: 'When the immune system\'s tolerance of the body\'s own tissues breaks down, antibodies and T cells attack them — the thyroid, the insulin-making cells, the joints, the nerves or many organs at once. Together these diseases affect about one person in ten.',
  keywords: ['autoimmune disease', 'autoimmunity', 'tolerance', 'autoantibodies', 'rheumatoid arthritis', 'lupus', 'SLE', 'type 1 diabetes', 'multiple sclerosis', 'coeliac disease', 'Graves disease', 'Hashimoto', 'myasthenia gravis', 'psoriasis', 'ANA', 'HLA', 'immunosuppressants', 'biologics', 'molecular mimicry'],
  prereq: ['adaptive-immunity', 'antibodies', 'dna-genes'],
  related: ['type1-diabetes', 'thyroid', 'celiac-disease', 'multiple-sclerosis', 'ibd', 'anemia', 'immunodeficiency', 'diagnostic-accuracy', 'bayes-diagnosis', 'math:bayes-theorem'],
  body: `
For three months Sara, 32, has woken with stiff, swollen knuckles on both hands; it takes over an hour of moving them before she can do up buttons. Blood tests show raised inflammation markers and antibodies typical of **rheumatoid arthritis**, in which the immune system attacks the lining of the joints. Started early, treatment that calms the immune system can stop the joints being damaged — which is why persistent joint swelling is worth an early medical opinion.

### Tolerance, and how it fails
Lymphocyte receptors are made at random (see [[adaptive-immunity]]), so some inevitably fit the body's own proteins. Most such cells are removed while they mature, in the thymus and bone marrow, and regulatory T cells hold back those that escape. Everyone has some self-reactive cells; disease comes when genes and triggers tip the balance:

- **Genes**: particular HLA types raise the risk of particular diseases, and dozens of other genes each add a little. Yet when one identical twin has type 1 diabetes, the other develops it in only some cases — roughly a third to two-thirds, depending on the study and how long the twins are followed — so the genes are not the whole story.
- **Infections** can start it, when a microbe's protein resembles one of ours: rheumatic fever after a streptococcal throat infection attacks the heart. A large 2022 study of US military recruits found that multiple sclerosis became about 32 times more likely after infection with the Epstein–Barr virus.
- **Other triggers**: smoking (rheumatoid arthritis), gluten ([[celiac-disease]]), some medicines, and sex hormones — women are affected about twice as often as men overall, and around nine times as often for lupus.

A 2023 study of 22 million UK health records found that about one person in ten had at least one of nineteen common autoimmune diseases — roughly 13 % of women and 7 % of men.

### How the damage is done
Autoantibodies can stimulate or block a receptor or destroy cells; immune complexes can lodge in the kidneys, joints and skin; T cells can kill cells directly.

| Condition | Target | What happens |
|---|---|---|
| [[type1-diabetes|Type 1 diabetes]] | insulin-making cells of the pancreas (T cells) | no insulin; lifelong insulin treatment |
| Graves' disease | the thyroid's TSH receptor (stimulating antibodies) | overactive thyroid (see [[thyroid]]) |
| Hashimoto's thyroiditis | thyroid cells | underactive thyroid |
| [[celiac-disease|Coeliac disease]] | gut lining, triggered by gluten | poor absorption, anaemia |
| [[multiple-sclerosis|Multiple sclerosis]] | myelin in the brain and spinal cord | episodes of weakness, numbness, visual loss |
| Myasthenia gravis | acetylcholine receptors at the nerve–muscle junction (blocking antibodies) | muscle weakness that worsens with use |
| Rheumatoid arthritis | the lining of joints | painful, swollen joints, damage if untreated |
| Systemic lupus erythematosus | many tissues (immune complexes) | rashes, joint pain, kidney inflammation, fatigue |
| Pernicious anaemia | stomach cells needed to absorb vitamin B12 | [[anemia|anaemia]] and nerve damage |
| Psoriasis | skin | thick, scaly plaques; sometimes arthritis |

Having one autoimmune disease raises the chance of another, and many follow a course of flares and quieter spells.

### Diagnosis
There is rarely a single test. Doctors combine symptoms and examination with inflammation markers, specific autoantibodies, organ function tests, imaging and sometimes a biopsy. Some autoantibody tests are far from specific: antinuclear antibodies (ANA) are found in about one person in seven in large surveys, rising with age, although lupus affects only about one in a thousand. A positive result in someone without a suggestive illness usually means nothing — the formula below shows why.

### Treatment
- **Replacing** what has been lost: insulin, thyroid hormone (levothyroxine), vitamin B12.
- **Calming the immune system**: corticosteroids for flares; longer-term medicines such as methotrexate, hydroxychloroquine, azathioprine and mycophenolate; biologic medicines that block one signal (adalimumab and infliximab against TNF; others against interleukins) or remove B cells (rituximab); and tablets that block signalling inside cells (JAK inhibitors).
- **New directions**: an antibody (teplizumab) that delayed the onset of type 1 diabetes by about two years on average in trials of people at high risk; and small early studies, since 2021, of engineered CAR-T cells that reset the immune system in severe lupus — promising but still experimental.

Suppressing the immune system raises the risk of infection, so treatment involves regular blood tests, attention to vaccinations and quick action on fevers; the balance of benefit and risk is for each person to discuss with their specialist team.

> [!warn] Some autoimmune conditions can declare themselves as emergencies. Great thirst, passing large amounts of urine, weight loss and tiredness — especially in a child — need a same-day glucose test; with vomiting, tummy pain, deep rapid breathing or drowsiness, or with weakness spreading up from the legs, or difficulty breathing or swallowing — call your local emergency number.
`,
  ideas: [
    'Tolerance normally removes or restrains self-reactive lymphocytes; autoimmune disease is its failure.',
    'Genes (especially HLA types), infections, smoking, hormones and other triggers combine to cause it.',
    'Damage comes from autoantibodies, immune complexes or T cells, in one organ or throughout the body.',
    'About one person in ten has an autoimmune disease; women are affected about twice as often as men.',
    'Autoantibody tests need context: a positive ANA in a healthy person usually means nothing.'
  ],
  pitfalls: [
    'A positive ANA test means lupus — Around one in seven healthy people test positive, while lupus is rare; the test is useful mainly when symptoms already point to it.',
    'Autoimmune diseases are caused by a weak immune system — The immune system is misdirected, not weak; the treatments that calm it are what make infections more likely.',
    'Autoimmune disease is purely genetic — Identical twins often differ: environmental triggers such as infections and smoking matter too.'
  ],
  formulas: [
    {
      name: 'Positive predictive value of a test',
      expr: 'PPV = Se*p/(Se*p + (1 - Sp)*(1 - p))', tex: '\\text{PPV} = \\frac{\\text{Se}\\,p}{\\text{Se}\\,p + (1 - \\text{Sp})(1 - p)}',
      vars: {
        PPV: { name: 'chance that a positive result is a true positive', q: 'ratio', unit: '%', tex: '\\text{PPV}' },
        Se: { name: 'sensitivity', q: 'ratio', unit: '%', value: 95, min: 0, max: 100, tex: '\\text{Se}' },
        Sp: { name: 'specificity', q: 'ratio', unit: '%', value: 85, min: 0, max: 100, tex: '\\text{Sp}' },
        p: { name: 'how common the disease is among those tested', q: 'ratio', unit: '%', value: 0.1, min: 0, max: 100, tex: 'p' }
      },
      note: 'Bayes\' theorem. The values shown are illustrative for an ANA test and lupus; real figures depend on the laboratory method and cut-off. See [[bayes-diagnosis]] and the test calculator in [the medical calculators](#/tools/clinical/test).',
      practice: { unknowns: ['PPV', 'p'] },
      stories: { PPV: 'A test with sensitivity {Se} and specificity {Sp} is used where {p} of those tested have the disease. What fraction of positive results are true?' }
    }
  ],
  examples: [
    {
      title: 'An ANA in the general population',
      q: 'An ANA test with sensitivity 95 % and specificity 85 % is done on 100 000 people from the general population, where 0.1 % have lupus. How many positives are true?',
      steps: [
        'With lupus: 100 people, of whom 95 test positive.',
        'Without lupus: 99 900 people, of whom 15 % — 14 985 — test positive.',
        'True share of positives: $95 / (95 + 14\\,985) = 0.0063$ — about 0.6 %.',
        'More than 99 in 100 positives are false alarms, which is why the test is not used to screen healthy people.'
      ],
      a: 'About 0.6 % of positive results are true.'
    },
    {
      title: 'The same test in a specialist clinic',
      q: 'In a rheumatology clinic, among patients with rashes, joint pain and kidney findings, 30 % have lupus. What do positive and negative results mean now?',
      steps: [
        'Of 1000 patients, 300 have lupus: 285 test positive, 15 negative.',
        'Of 700 without lupus, 105 test positive and 595 negative.',
        'Positive: $285 / (285 + 105) = 0.73$ — 73 %.',
        'Negative: $595 / (595 + 15) = 0.975$ — a negative result makes lupus unlikely.'
      ],
      a: 'A positive result now means lupus about 73 % of the time; a negative one rules it out with about 97.5 % confidence.'
    },
    {
      title: 'Sara\'s joints',
      q: 'Why does Sara\'s specialist want to start treatment soon, rather than wait and see?',
      steps: [
        'Rheumatoid arthritis inflames the joint lining, which in time erodes cartilage and bone.',
        'Much of the damage happens in the first years, and treatment started early — often methotrexate, with other medicines added if needed — is more likely to bring the disease under control.',
        'Because these medicines affect the immune system, she will have regular blood tests and advice on vaccination and infections.',
        'Smoking worsens the disease and blunts treatment; stopping is part of the plan if it applies.'
      ],
      a: 'Early treatment protects the joints before permanent damage builds up.'
    }
  ],
  quiz: [
    { q: 'In Graves\' disease, the thyroid becomes overactive because…', choices: ['autoantibodies switch on the receptor for the thyroid-stimulating hormone', 'T cells destroy the thyroid', 'the pituitary makes too much hormone', 'iodine builds up in the gland'], a: 0,
      why: 'The antibodies mimic the pituitary\'s hormone, so the thyroid is stimulated non-stop — one of the few diseases in which an autoantibody turns something on.' },
    { q: 'A positive ANA test on its own means a person has lupus.', a: false,
      why: 'About one in seven healthy people have a positive ANA, and lupus is rare. The test helps when symptoms already suggest lupus; alone, most positives are false alarms.' },
    { q: 'A test with sensitivity 90 % and specificity 90 % is used where 1 % of people have the disease. What percentage of positive results are true?', answer: 8.3,
      why: 'Per 1000: 9 true positives and 99 false positives, so 9/108 = 8.3 %.' },
    { q: 'Identical twins share their genes, yet often only one develops an autoimmune disease. What does this show?', choices: ['environmental triggers matter as well as genes', 'autoimmune diseases are not inherited at all', 'the tests are unreliable', 'the second twin is protected by the first'], a: 0,
      why: 'Genes raise the risk, but triggers such as infections, smoking and chance events in the immune system decide whether disease develops.' },
    { q: 'Why do many treatments for autoimmune disease raise the risk of infection?', choices: ['they suppress parts of the immune system that also fight germs', 'they damage the skin barrier', 'they destroy red cells', 'they are made from bacteria'], a: 0,
      why: 'The same immune cells and signals that attack the body also defend against microbes, so damping them carries a trade-off — hence monitoring and attention to vaccinations.' }
  ],
  applications: ['Screening relatives of people with type 1 diabetes for autoantibodies, and delaying its onset.', 'Biologic medicines that target single immune signals.', 'Gluten-free diet as the treatment of coeliac disease.', 'Interpreting autoantibody tests with Bayes\' theorem.'],
  sim: { id: 'bi-clonal', params: { antigen: 'self' } }
},

{
  id: 'immunodeficiency', parent: 'immunity', title: 'Immunodeficiency', level: 2,
  short: 'When part of the immune system is missing or weakened — through a rare inherited condition, or far more often through HIV, cancer treatment, medicines, malnutrition or the loss of the spleen — infections become more frequent, more severe and stranger.',
  keywords: ['immunodeficiency', 'immunocompromised', 'primary immunodeficiency', 'inborn errors of immunity', 'SCID', 'agammaglobulinaemia', 'CVID', 'IgA deficiency', 'HIV', 'AIDS', 'CD4 count', 'neutropenia', 'splenectomy', 'immunosuppression', 'immunoglobulin replacement', 'live vaccines', 'recurrent infections'],
  prereq: ['innate-immunity', 'adaptive-immunity', 'antibodies'],
  related: ['hiv', 'sepsis', 'vaccines', 'cancer-treatment', 'autoimmunity', 'dialysis-transplant', 'ageing', 'antibiotics'],
  body: `
By his first birthday Omar had been in hospital three times with pneumonia, and an ear infection had needed antibiotics through a drip. Tests showed almost no antibodies in his blood and no B cells at all: X-linked agammaglobulinaemia, an inherited condition in which B cells cannot mature. He had been well for his first six months because he was living on his mother's antibodies (see [[antibodies]]). Now he receives immunoglobulin — antibodies pooled from donors — every few weeks, and he is at school with his friends.

### Inborn errors of immunity
More than 450 genetic conditions are now known to weaken some part of the immune system. Each is rare, together they are less rare, and while many appear in childhood, some — such as common variable immunodeficiency — are often diagnosed only in adults.

| Condition | What is missing | Typical problem |
|---|---|---|
| Severe combined immunodeficiency (SCID) | T cells, and with them effective B cells | severe infections from the first months; fatal without a stem-cell transplant or gene therapy — found by newborn screening in many countries |
| X-linked agammaglobulinaemia | B cells and antibodies | chest, sinus and ear infections once maternal antibodies fade |
| Common variable immunodeficiency | good antibody production | repeated chest infections and lung damage, often diagnosed in adults |
| Selective IgA deficiency | IgA | the commonest (about 1 in 500 people of European ancestry); most have no symptoms |
| Chronic granulomatous disease | the killing power of phagocytes | deep bacterial and fungal abscesses |
| Complement deficiencies | late complement proteins | repeated meningococcal infections |

### Acquired immunodeficiency — far more common
- **Malnutrition**, the commonest cause worldwide, weakens barriers, cells and antibodies, and is why measles and diarrhoea kill undernourished children.
- **HIV** destroys helper T cells. Without treatment the CD4 count falls over years and infections that a healthy immune system easily controls take hold; AIDS is defined by a CD4 count below 200 cells per microlitre or by these infections. With effective treatment the immune system recovers, life expectancy approaches normal, and a person whose virus is undetectable does not pass HIV on sexually (see [[hiv]]).
- **Cancer and its treatment**: chemotherapy empties the blood of neutrophils for a week or two; leukaemias, lymphomas and myeloma crowd out or disable immune cells (see [[cancer-treatment]]).
- **Medicines** that suppress the immune system on purpose — after transplants ([[dialysis-transplant]]) or for autoimmune disease ([[autoimmunity]]) — and high-dose corticosteroids.
- **No working spleen** (after removal, or damaged by sickle cell disease) leaves a person open to overwhelming infection by bacteria with sugary capsules — pneumococcus, meningococcus — which is prevented with vaccines, sometimes daily antibiotics, and urgent care for any fever.
- Diabetes, kidney failure, liver cirrhosis and ageing (see [[ageing]]) all blunt immunity, which is why older people are offered stronger versions of some vaccines.

### Clues that an immune problem may be present
Infections that are **serious** (needing hospital or antibiotics through a drip), **persistent** (not clearing with the usual treatment), **unusual** (germs that rarely trouble healthy people, or infections in unusual places) or **recurrent** (far more than peers have) — together with poor growth in a baby, or a family history of immune problems or early deaths from infection — are reasons to ask whether the immune system has been checked. First tests are simple: a full blood count, antibody levels, responses to vaccines, lymphocyte subsets (such as the CD4 count), and an HIV test.

### Living with immunodeficiency
Treatment depends on what is missing: **immunoglobulin replacement** (into a vein every three or four weeks, or under the skin weekly), antibiotics to prevent infections, prompt treatment of any that do occur, **stem-cell transplantation**, and for a few conditions **gene therapy**. Vaccines matter: inactivated ones are generally safe though they may work less well, while **live vaccines** — such as those against measles, chickenpox, yellow fever, tuberculosis (BCG) and rotavirus — can cause disease in people with severe immunodeficiency. Such people are protected instead by the vaccination of everyone around them, from their household to the whole community (see [[vaccines]]).

> [!warn] In someone having chemotherapy, without a spleen, or with a known severe immunodeficiency, a temperature of 38 °C or more, shivering, or suddenly feeling very unwell is urgent: contact the treatment team's emergency line at once if one has been given. With confusion, fast breathing, mottled or bluish skin, or collapse — call your local emergency number.
`,
  ideas: [
    'Immunodeficiency is inborn (more than 450 rare genetic conditions) or acquired (far more common).',
    'Which part is missing decides which infections occur: antibodies (chest and ear infections), T cells (viruses, fungi), phagocytes (abscesses), complement (meningococcus).',
    'Malnutrition, HIV, cancer treatment, immunosuppressive medicines and the loss of the spleen are the main acquired causes.',
    'Serious, persistent, unusual or recurrent infections are clues worth investigating.',
    'Live vaccines can be dangerous in severe immunodeficiency; vaccinating those around the person protects them.'
  ],
  pitfalls: [
    'Frequent colds mean a weak immune system — Young children normally catch many colds a year, especially in nurseries. The clues are infections that are serious, persistent, unusual or need hospital treatment.',
    'Immune "boosting" supplements fix immunodeficiency — Real immunodeficiencies need specific treatment such as immunoglobulin, antiretrovirals or transplantation; supplements help only if a person is actually deficient, for example malnourished.',
    'People with HIV inevitably develop AIDS — With effective antiretroviral treatment the CD4 count recovers and AIDS is prevented; people can expect a near-normal lifespan.'
  ],
  formulas: [
    {
      name: 'Absolute CD4 count',
      expr: 'CD4 = 1000*WBC*fL*fC', tex: '\\text{CD4} = 1000 \\times \\text{WBC} \\times f_\\text{lymph} \\times f_\\text{CD4}',
      vars: {
        CD4: { name: 'CD4 T cells (cells per µL)', tex: '\\text{CD4}' },
        WBC: { name: 'white cell count (×10⁹/L)', value: 5, tex: '\\text{WBC}' },
        fL: { name: 'share of white cells that are lymphocytes', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'f_\\text{lymph}' },
        fC: { name: 'share of lymphocytes that are CD4 T cells', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'f_\\text{CD4}' }
      },
      note: 'The factor 1000 turns 10⁹ per litre into cells per microlitre. Adults typically have about 500–1500 CD4 cells/µL (laboratory ranges differ); below 200 marks AIDS. Children have higher counts.',
      practice: { unknowns: ['CD4', 'fC'] },
      stories: { CD4: 'A blood test shows a white count of {WBC} thousand per µL, {fL} lymphocytes, and {fC} of the lymphocytes are CD4 T cells. What is the CD4 count?' }
    }
  ],
  examples: [
    {
      title: 'Two CD4 counts',
      q: 'Person A: white count 5.0 × 10⁹/L, 30 % lymphocytes, 40 % of them CD4 cells. Person B, newly diagnosed with HIV: 3.5 × 10⁹/L, 25 % lymphocytes, 18 % CD4 cells. Compare their CD4 counts.',
      steps: [
        'A: $1000 \\times 5.0 \\times 0.30 \\times 0.40 = 600$ cells/µL — normal.',
        'B: $1000 \\times 3.5 \\times 0.25 \\times 0.18 = 158$ cells/µL — below 200, the threshold that defines AIDS.',
        'B needs antiretroviral treatment promptly (it is now recommended for everyone with HIV, whatever the count) and medicines to prevent certain infections until the count recovers.'
      ],
      a: '600 against about 160 cells/µL.'
    },
    {
      title: 'A fever ten days after chemotherapy',
      q: 'A man ten days after chemotherapy feels shivery and has a temperature of 38.3 °C, but no other symptoms. Why does his team treat this as an emergency?',
      steps: [
        'Ten days after treatment is when the neutrophil count is usually lowest.',
        'Without neutrophils there may be no pus, no redness and no localising signs — the fever may be the only sign of a bacterial infection.',
        'Infection can progress to sepsis within hours, so guidelines call for antibiotics through a drip within about an hour of arrival, before test results are back.'
      ],
      a: 'A fever may be the only sign of a fast-moving infection when neutrophils are absent.'
    }
  ],
  quiz: [
    { q: 'What is the commonest cause of immunodeficiency worldwide?', choices: ['malnutrition', 'inherited immune diseases', 'HIV', 'chemotherapy'], a: 0,
      why: 'Undernutrition weakens barriers, immune cells and antibody production in hundreds of millions of people, and is why common infections kill so many malnourished children.' },
    { q: 'A white count of 6.0 × 10⁹/L, 25 % lymphocytes and 30 % CD4 cells among them gives what CD4 count (cells/µL)?', answer: 450,
      why: '1000 × 6.0 × 0.25 × 0.30 = 450 cells/µL.' },
    { q: 'Babies with X-linked agammaglobulinaemia usually stay well for their first months because…', choices: ['they carry IgG from their mother', 'they are not exposed to germs', 'their T cells make antibodies instead', 'breast milk contains B cells'], a: 0,
      why: 'Maternal IgG crosses the placenta and protects for several months; as it decays, infections begin.' },
    { q: 'Live vaccines are safe for everyone with an immunodeficiency.', a: false,
      why: 'In severe immunodeficiency even a weakened live virus or bacterium can cause disease. These people are protected by vaccinating those around them; which vaccines are safe is decided case by case by their specialists.' },
    { q: 'Why is a fever urgent in someone without a working spleen?', choices: ['bacteria with sugary capsules can cause overwhelming infection within hours', 'the fever itself damages the brain', 'they cannot make red cells', 'they are allergic to antibiotics'], a: 0,
      why: 'The spleen filters these bacteria from the blood. Without it, pneumococcal or meningococcal infection can become life-threatening very fast, so early antibiotics are vital.' }
  ],
  applications: ['Newborn screening for SCID, allowing a cure before infections strike.', 'Immunoglobulin replacement for antibody deficiencies.', 'CD4 counts and viral loads in HIV care.', 'Vaccination schedules for people without a spleen and for their households.'],
  sim: [{ id: 'bi-neutrophils', params: { anc: 0.3 } }, { id: 'bi-clonal', params: { cd4: 15 } }]
}

);
