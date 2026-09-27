/* HYPER-BIOLOGY · content/metabolism.js — Energy and Metabolism:
 *   respiration           metabolic pathways, glycolysis, the citric acid cycle, oxidative phosphorylation, fermentation
 *   photosynthesis-topic  photosynthesis, the light reactions, the Calvin cycle, C4 and CAM plants, limiting factors
 * Simulations in sims/metabolism.js (prefix met-). */
Hyper.add(

/* ================================================================ RESPIRATION */
{
  id: 'metabolism-overview', parent: 'respiration', title: 'Metabolic pathways', level: 2,
  short: 'Metabolism is the network of chemical reactions in a cell, organised into chains of enzyme-catalysed steps. Catabolic pathways break food down and release energy; anabolic pathways build the cell and spend it. ATP carries the energy between them, NADH and FADH₂ carry electrons to oxygen, and NADPH carries them into biosynthesis.',
  keywords: ['metabolism', 'catabolism', 'anabolism', 'metabolic pathway', 'NAD+', 'NADH', 'FAD', 'FADH2', 'NADPH', 'redox', 'electron carrier', 'reduction potential', 'energy charge', 'cellular respiration', 'ATP turnover', 'acetyl-CoA'],
  prereq: ['atp-energy', 'bioenergetics', 'enzymes', 'chemistry:redox'],
  related: ['glycolysis', 'krebs-cycle', 'oxidative-phosphorylation', 'fermentation', 'photosynthesis', 'enzyme-regulation', 'mitochondria-chloroplasts', 'microbial-metabolism', 'medicine:metabolism-energy', 'medicine:macronutrients', 'chemistry:electrode-potentials'],
  body: `
A cell is a crowded chemical factory. Thousands of different reactions run in it at once — the most complete reconstruction of human metabolism (Recon3D, 2018) lists more than 13 000 — and almost none of them would happen at a useful speed at body temperature on their own. Each is catalysed by its own [[enzymes|enzyme]], and the product of one enzyme is the substrate of the next. Such a chain is a **metabolic pathway**: glucose to pyruvate in ten steps ([[glycolysis]]), acetyl groups to CO₂ in a cycle of eight ([[krebs-cycle|the citric acid cycle]]), amino acids and nucleotides built from small precursors in pathways of five to fifteen steps.

### Two directions
- **Catabolism** breaks large molecules into small ones — starch to glucose, glucose to CO₂ and water — and releases free energy ($\\Delta G < 0$).
- **Anabolism** builds large molecules from small ones — amino acids into proteins, acetyl groups into fatty acids — and needs free energy ($\\Delta G > 0$).

The two are coupled by a handful of shared carriers. **ATP** carries energy as a phosphate group ready to be handed on (see [[atp-energy]]); **NADH** and **FADH₂** carry high-energy electrons from catabolism to be burnt with oxygen; **NADPH** carries electrons into biosynthesis. Keeping two separate electron pools lets a cell run both directions at once: in the cytosol NAD⁺ outnumbers NADH several hundredfold, so it stands ready to *accept* electrons from food, while NADPH outnumbers NADP⁺ about a hundredfold, so it stands ready to *give* them to anabolism.

### Oxidation is the source of the energy
Burning food means moving electrons from carbon to oxygen. The carbon of glucose has an average oxidation number of 0; in CO₂ it is +4. Oxidising one glucose therefore removes 24 electrons — and respiration collects every one: 10 NADH and 2 FADH₂ carry twelve pairs. A dehydrogenase lifts two electrons and a proton off its substrate as a hydride ion:

$$\\ce{NAD+ + 2e- + H+ -> NADH}$$

How much energy an electron pair carries is set by the [[chemistry:electrode-potentials|reduction potentials]] of donor and acceptor, $\\Delta G'^{\\circ} = -nF\\,\\Delta E'^{\\circ}$. NADH ($E'^{\\circ} = -0.32$ V) giving its electrons to oxygen (+0.82 V) releases 220 kJ per mole — far too much to capture in one step, which is why the electron transport chain lets the electrons fall in stages (see [[oxidative-phosphorylation]]).

| Stage | Where | Per glucose, in | Per glucose, out |
|---|---|---|---|
| [[glycolysis]] | cytosol | glucose, 2 NAD⁺, 2 ADP | 2 pyruvate, 2 NADH, 2 ATP (net) |
| pyruvate oxidation | mitochondrial matrix | 2 pyruvate | 2 acetyl-CoA, 2 NADH, 2 CO₂ |
| [[krebs-cycle]] | mitochondrial matrix | 2 acetyl-CoA | 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP (as GTP) |
| [[oxidative-phosphorylation]] | inner mitochondrial membrane | 10 NADH, 2 FADH₂, 6 O₂ | about 26–28 ATP, 12 H₂O |

Summed up, aerobic respiration is $\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$ with $\\Delta G'^{\\circ} = -2870$ kJ/mol; about a third of that is kept as 30–32 ATP and the rest warms the body.

### Hubs and control
Pathways meet at a few hub molecules — glucose 6-phosphate, pyruvate and above all **acetyl-CoA**, where sugars, fats and many amino acids converge. Fat yields most energy per gram (37 kJ/g against 17 kJ/g for carbohydrate and protein) because its carbons are more reduced: they carry more electrons to give away. The flow through each pathway is set at a few irreversible steps whose enzymes are regulated — by feedback from the pathway's own product, by the cell's **energy charge** (the balance of ATP, ADP and AMP, held between about 0.8 and 0.95), and in animals by hormones such as insulin and glucagon (see [[enzyme-regulation]] and [[medicine:glucose-regulation]]).

> [!key] Catabolism releases energy and electrons; anabolism spends them. ATP carries the energy, NADH and FADH₂ carry electrons to oxygen, NADPH carries them into biosynthesis.

A cell holds surprisingly little ATP — a whole human body only about 0.1 mol, some 50 g — but recycles it so fast that a resting adult makes and breaks down about 40 kg of it a day.
`,
  ideas: [
    'A metabolic pathway is a chain of enzyme-catalysed steps: the product of one enzyme is the substrate of the next.',
    'Catabolism breaks molecules down and releases energy; anabolism builds them and consumes energy; ATP and the electron carriers couple the two.',
    'Oxidising food moves electrons from carbon to oxygen: NAD⁺ and FAD collect them as NADH and FADH₂; NADPH carries electrons into biosynthesis.',
    'The energy of an electron pair follows from reduction potentials, ΔG = −nFΔE: NADH to oxygen releases about 220 kJ/mol.',
    'Flow through a pathway is controlled at a few irreversible steps by feedback, energy charge and hormones.'
  ],
  pitfalls: [
    'ATP is an energy store, like fat — ATP is a short-lived carrier. The body holds only about 50 g and recycles each molecule hundreds of times a day; the long-term stores are glycogen and fat.',
    'NADH and NADPH are interchangeable — They differ by one phosphate that enzymes recognise. NADH mostly feeds the electron transport chain; NADPH drives biosynthesis and antioxidant defences, and the cell keeps the two pools at opposite ratios.',
    'The oxygen we breathe in leaves as the CO₂ we breathe out — Inhaled O₂ is reduced to water at the end of the electron transport chain. The oxygen atoms of exhaled CO₂ come from glucose and water, removed in the decarboxylation steps.'
  ],
  formulas: [
    {
      name: 'Free energy of an electron transfer',
      expr: 'dG = -n*F*dE', tex: "\\Delta G'^{\\circ} = -n\\,F\\,\\Delta E'^{\\circ}",
      vars: {
        dG: { name: 'standard free-energy change (pH 7)', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: "\\Delta G'^{\\circ}" },
        n: { name: 'electrons transferred', int: true, value: 2 },
        F: { const: 'F' },
        dE: { name: 'difference in reduction potential (acceptor minus donor)', q: 'voltage', unit: 'V', value: 1.14, signed: true, tex: "\\Delta E'^{\\circ}" }
      },
      note: 'A positive ΔE (electrons flowing to the acceptor with the higher potential) gives a negative ΔG: the transfer releases energy. Standard biochemical values at pH 7; real cells shift them with the concentration ratios of the oxidised and reduced forms.',
      practice: { unknowns: ['dG', 'dE'] },
      stories: {
        dG: 'A carrier passes {n} electrons to an acceptor whose reduction potential is higher by {dE}. How much free energy is released per mole?',
        dE: 'Transferring {n} electrons per molecule from one carrier to another changes the free energy by {dG}. What is the difference in their reduction potentials?'
      }
    },
    {
      name: 'Efficiency of respiration',
      expr: 'eta = Y*dGp/dGc', tex: '\\eta = \\dfrac{Y\\,\\Delta G_p}{\\Delta G_{\\mathrm{glc}}}',
      vars: {
        eta: { name: 'fraction of the energy kept as ATP', q: 'ratio', unit: '%', tex: '\\eta' },
        Y: { name: 'ATP made per glucose', value: 32 },
        dGp: { name: 'free energy needed to make a mole of ATP', q: 'molarenergy', unit: 'kJ/mol', value: 30.5, tex: '\\Delta G_p' },
        dGc: { name: 'free energy released by oxidising a mole of glucose', q: 'molarenergy', unit: 'kJ/mol', value: 2870, tex: '\\Delta G_{\\mathrm{glc}}' }
      },
      note: 'With the standard 30.5 kJ/mol, 32 ATP keep 34 %. Inside a living cell, where ATP is held far from equilibrium, making it costs 50–60 kJ/mol and the true efficiency is nearer 55–65 % — better than a car engine.',
      stories: {
        eta: 'A cell makes {Y} ATP per glucose, each costing {dGp}, from the {dGc} that oxidising glucose releases. What fraction of the energy does it keep?',
        Y: 'Respiration keeps {eta} of the {dGc} released by glucose, as ATP costing {dGp} each. How many ATP are made per glucose?'
      }
    },
    {
      name: 'How much ATP a body recycles',
      expr: 'm = P*t*Y*M/dGc', tex: 'm = \\dfrac{P\\,t\\,Y M}{\\Delta G_{\\mathrm{glc}}}',
      vars: {
        m: { name: 'mass of ATP made (and used again)', q: 'mass', unit: 'kg' },
        P: { name: 'metabolic rate', q: 'power', unit: 'W', value: 80 },
        t: { name: 'time', q: 'time', unit: 'day', value: 1 },
        Y: { name: 'ATP made per glucose', value: 32 },
        M: { name: 'molar mass of ATP', q: 'molarmass', unit: 'g/mol', value: 507.2, fixed: true },
        dGc: { name: 'free energy released by oxidising a mole of glucose', q: 'molarenergy', unit: 'kJ/mol', value: 2870, tex: '\\Delta G_{\\mathrm{glc}}' }
      },
      note: 'Treats all fuel as glucose. Fat gives slightly fewer ATP per kilojoule, so this is an upper estimate.',
      practice: { unknowns: ['m', 'P', 't'] },
      stories: {
        m: 'A person has a metabolic rate of {P}. How much ATP do they turn over in {t}, at {Y} ATP per glucose?',
        P: 'Someone turns over {m} of ATP in {t}. What is their average metabolic rate?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting the electrons in glucose',
      q: 'Show that complete oxidation of glucose, $\\ce{C6H12O6}$, removes 24 electrons, and check that respiration\'s carriers account for all of them.',
      steps: [
        'In glucose, 12 H at +1 and 6 O at −2 sum to 0, so the six carbons together have oxidation number 0.',
        'In CO₂ each carbon is +4, so six carbons lose $6 \\times 4 = 24$ electrons.',
        'Respiration makes 2 NADH in glycolysis, 2 in pyruvate oxidation and 6 in the citric acid cycle, plus 2 FADH₂: 12 carriers of 2 electrons = 24.',
        'At the end of the chain 6 O₂ each accept 4 electrons: 24 again, making 12 H₂O.'
      ],
      a: '24 electrons, carried as 10 NADH and 2 FADH₂ and finally given to 6 O₂.'
    },
    {
      title: 'The energy of NADH',
      q: 'How much free energy is released when a mole of NADH ($E\'^{\\circ} = -0.32$ V) passes its two electrons to oxygen ($E\'^{\\circ} = +0.82$ V)? How many ATP (30.5 kJ/mol) could that pay for?',
      steps: [
        '$\\Delta E\'^{\\circ} = 0.82 - (-0.32) = 1.14$ V.',
        '$\\Delta G\'^{\\circ} = -2 \\times 96\\,485 \\times 1.14 = -2.20 \\times 10^5$ J/mol $= -220$ kJ/mol.',
        'That could pay for $220/30.5 \\approx 7$ ATP in principle; mitochondria make about 2.5 — the rest is lost as heat at each stage, and some pays for transport.'
      ],
      a: 'About −220 kJ/mol, enough in principle for 7 ATP; about 2.5 are made.'
    },
    {
      title: 'A day of ATP',
      q: 'A resting adult has a metabolic rate of 80 W. How much ATP (507 g/mol) do they make in a day, at 32 ATP per glucose? The body holds about 50 g of ATP: how often is each molecule recycled?',
      steps: [
        'Energy in a day: $80 \\times 86\\,400 = 6.9$ MJ, equivalent to $6.9 \\times 10^6 / 2.87 \\times 10^6 = 2.4$ mol of glucose.',
        'ATP: $2.4 \\times 32 = 77$ mol, or $77 \\times 0.507 = 39$ kg.',
        '$39\\,000 / 50 \\approx 800$ cycles a day — each ATP molecule is rebuilt roughly every two minutes.'
      ],
      a: 'About 39 kg a day; each molecule is recycled some 800 times.'
    }
  ],
  quiz: [
    { q: 'Which of these is an anabolic process?', choices: ['Glycolysis', 'Building a protein from amino acids', 'Digesting starch to glucose', 'The citric acid cycle'], a: 1, why: 'Anabolism builds large molecules and consumes energy. Glycolysis, digestion and the citric acid cycle all break molecules down — catabolism.' },
    { q: 'When glucose is fully oxidised, the oxygen atoms of the O₂ you breathe in end up mainly in…', choices: ['the CO₂ you breathe out', 'water', 'ATP', 'glucose'], a: 1, why: 'O₂ is the final electron acceptor and is reduced to water by complex IV. The oxygen in CO₂ comes from glucose and water.' },
    { q: 'How many electrons are removed from one glucose molecule when it is oxidised completely to CO₂?', answer: 24, why: 'Carbon goes from an average oxidation number of 0 to +4, for six carbons: 24 electrons, carried by 10 NADH and 2 FADH₂.' },
    { q: 'In the cytosol, NAD⁺ is kept mostly in its oxidised form, so that it is ready to accept electrons from glycolysis.', a: true, why: 'Free NAD⁺ outnumbers NADH several hundredfold in the cytosol; the NADPH pool is kept mostly reduced instead, ready to donate electrons to biosynthesis.' },
    { q: 'A redox reaction transfers 2 electrons with $\\Delta E\'^{\\circ} = +0.20$ V. Its $\\Delta G\'^{\\circ}$ is about…', choices: ['+39 kJ/mol', '−39 kJ/mol', '−19 kJ/mol', '−386 kJ/mol'], a: 1, why: '$\\Delta G = -2 \\times 96.5 \\times 0.20 = -38.6$ kJ/mol. A positive ΔE means a spontaneous transfer and a negative ΔG; −19 forgets the factor n = 2.' }
  ],
  problems: [
    { q: 'FADH₂ bound in succinate dehydrogenase (about 0.00 V) passes 2 electrons to oxygen (+0.82 V). How much free energy is released per mole? (Give the size.)', answer: 158, unit: 'kJ/mol', tol: 0.02, steps: ['$|\\Delta G| = 2 \\times 96\\,485 \\times 0.82 = 1.58 \\times 10^5$ J/mol = 158 kJ/mol — less than NADH\'s 220, which is why FADH₂ yields fewer ATP.'] },
    { q: 'A runner works at a metabolic rate of 1000 W for 2 hours. How many kilograms of ATP are turned over, taking 32 ATP per glucose and 507 g/mol?', answer: 40.7, unit: 'kg', tol: 0.03, steps: ['Energy: $1000 \\times 7200 = 7.2$ MJ = 2.51 mol of glucose equivalent.', 'ATP: $2.51 \\times 32 = 80.3$ mol × 0.507 kg/mol = 40.7 kg — a whole resting day\'s turnover in two hours.'] }
  ],
  applications: [
    'Nutrition: the energy in fat (37 kJ/g), carbohydrate and protein (17 kJ/g) follows from how reduced their carbon atoms are.',
    'Inborn errors of metabolism, such as phenylketonuria, are single broken enzymes in a pathway; newborn screening detects dozens of them from a drop of blood.',
    'Metabolic engineering adds, removes or re-tunes pathway steps in microbes to make fuels, medicines and plastics.',
    'Cancer cells rewire their metabolism; PET scans image the extra glucose many tumours take up.'
  ],
  history: 'Antoine Lavoisier and Pierre-Simon Laplace showed in 1783, with a guinea pig in an ice calorimeter, that respiration is a slow combustion. Arthur Harden and William Young found in 1906 that yeast juice needs a heat-stable "coferment" — NAD — whose structure Hans von Euler-Chelpin worked out. Over the next half-century pathway after pathway was traced, enzyme by enzyme and, from the 1940s, with radioactive isotopes.',
  sim: 'met-respiration'
},

{
  id: 'glycolysis', parent: 'respiration', title: 'Glycolysis', level: 2,
  short: 'Glycolysis splits one glucose into two pyruvate in ten enzyme steps in the cytosol. It needs no oxygen, spends 2 ATP and makes 4, for a net gain of 2 ATP and 2 NADH per glucose — a small yield, but fast and universal.',
  keywords: ['glycolysis', 'Embden–Meyerhof pathway', 'pyruvate', 'phosphofructokinase', 'PFK-1', 'hexokinase', 'pyruvate kinase', 'substrate-level phosphorylation', 'glyceraldehyde 3-phosphate', 'investment phase', 'payoff phase', 'fructose 2,6-bisphosphate', 'Warburg effect'],
  prereq: ['metabolism-overview', 'carbohydrates', 'enzymes', 'atp-energy'],
  related: ['krebs-cycle', 'fermentation', 'enzyme-regulation', 'oxidative-phosphorylation', 'microbial-metabolism', 'medicine:glucose-regulation', 'medicine:diabetes', 'chemistry:gibbs-equilibrium'],
  body: `
**Glycolysis** — "sugar splitting" — turns one glucose (six carbons) into two pyruvate (three carbons each). It runs in the cytosol of almost every cell on Earth, from bacteria to neurons, and needs no oxygen: it probably evolved before the atmosphere held any, more than 2.4 billion years ago. The overall reaction is

$$\\text{glucose} + 2\\,\\ce{NAD+} + 2\\,\\text{ADP} + 2\\,\\mathrm{P_i} \\to 2\\,\\text{pyruvate} + 2\\,\\ce{NADH} + 2\\,\\ce{H+} + 2\\,\\text{ATP} + 2\\,\\ce{H2O}$$

### Ten steps in two phases
In the **investment phase** (steps 1–5) the cell spends two ATP. Phosphorylating glucose traps it — a charged sugar phosphate cannot leave through the glucose transporters — and primes it to split. In the **payoff phase** (steps 6–10) each three-carbon sugar is oxidised: NAD⁺ takes two electrons while inorganic phosphate is attached, making a high-energy acyl phosphate, and two **substrate-level phosphorylations** hand phosphate groups straight to ADP.

| Step | Enzyme | What happens | Per glucose |
|---|---|---|---|
| 1 | hexokinase | glucose → glucose 6-phosphate | −1 ATP |
| 2 | phosphoglucose isomerase | → fructose 6-phosphate | |
| 3 | phosphofructokinase-1 (PFK-1) | → fructose 1,6-bisphosphate | −1 ATP |
| 4 | aldolase | splits into DHAP and glyceraldehyde 3-phosphate (G3P) | |
| 5 | triose phosphate isomerase | DHAP → G3P, so two G3P | |
| 6 | G3P dehydrogenase | G3P + Pᵢ → 1,3-bisphosphoglycerate | +2 NADH |
| 7 | phosphoglycerate kinase | → 3-phosphoglycerate | +2 ATP |
| 8 | phosphoglycerate mutase | → 2-phosphoglycerate | |
| 9 | enolase | → phosphoenolpyruvate (PEP) + water | |
| 10 | pyruvate kinase | → pyruvate | +2 ATP |

Net: 4 − 2 = **2 ATP**, **2 NADH** and **2 pyruvate** per glucose.

### Energy: a small first bite
Under standard conditions the whole pathway, including the 2 ATP made, has $\\Delta G'^{\\circ} \\approx -85$ kJ/mol. The two ATP keep only about 2 % of glucose's 2870 kJ/mol; most of the energy is still in the pyruvate and NADH, to be released by the [[krebs-cycle]] and [[oxidative-phosphorylation]]. Inside a cell, seven of the ten steps run close to equilibrium ($\\Delta G \\approx 0$), and the liver runs them backwards to make glucose (gluconeogenesis). Three are far from equilibrium — hexokinase, PFK-1 and pyruvate kinase, at about −33, −22 and −17 kJ/mol in a red blood cell — and these are the pathway's valves; gluconeogenesis bypasses them with different enzymes.

### The main valve: phosphofructokinase
PFK-1 is inhibited by ATP and citrate (energy is plentiful) and activated by AMP and fructose 2,6-bisphosphate (energy is needed; glucose is plentiful, a signal raised by insulin in the liver). AMP is a sensitive alarm: adenylate kinase keeps $\\ce{2ADP <=> ATP + AMP}$ near equilibrium, so a 10 % fall in ATP can raise AMP several-fold. PFK-1 responds to fructose 6-phosphate sigmoidally, like a switch (see [[enzyme-regulation]]).

### Where the NADH goes
Glycolysis stalls without NAD⁺, and the cytosol holds only a small pool. With oxygen, the electrons of NADH are carried into mitochondria by shuttles — the malate–aspartate shuttle in heart and liver, the glycerol-phosphate shuttle in muscle and brain — and burnt in the electron transport chain. Without oxygen, pyruvate itself takes them back and becomes lactate or ethanol: [[fermentation]].

> [!fact] Glycolysis is fast rather than efficient. Fast-twitch muscle can raise its glycolytic rate about a hundredfold in a sprint; red blood cells, which have no mitochondria, live on glycolysis alone; and many cancer cells run it flat out even with oxygen present (the Warburg effect), which PET scans exploit by imaging the uptake of a radioactive glucose analogue.
`,
  ideas: [
    'Glycolysis turns one glucose into two pyruvate in ten steps in the cytosol, without oxygen.',
    'Two ATP are invested and four made by substrate-level phosphorylation: a net 2 ATP and 2 NADH per glucose.',
    'Only about 2 % of glucose\'s free energy is captured; most remains in pyruvate and NADH.',
    'Hexokinase, phosphofructokinase-1 and pyruvate kinase are far from equilibrium and control the flow; PFK-1 is the main valve.',
    'NAD⁺ must be regenerated — by the electron transport chain with oxygen, or by fermentation without it.'
  ],
  pitfalls: [
    'Glycolysis makes 4 ATP per glucose — It makes 4 but spends 2 in the investment phase: the net gain is 2.',
    'Glycolysis needs oxygen — No step uses oxygen. What it needs is NAD⁺, which fermentation can regenerate without oxygen.',
    'Every step of a pathway is a control point — Most steps run near equilibrium and simply follow the flow; control sits at the few steps with a large negative ΔG.'
  ],
  formulas: [
    {
      name: 'Free energy of a step in the cell',
      expr: 'dG = dG0 + R*T*ln(Q)', tex: "\\Delta G = \\Delta G'^{\\circ} + RT\\ln Q",
      vars: {
        dG: { name: 'actual free-energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dG0: { name: 'standard free-energy change (pH 7)', q: 'molarenergy', unit: 'kJ/mol', value: 23.8, signed: true, tex: "\\Delta G'^{\\circ}" },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        Q: { name: 'mass-action ratio [products]/[reactants] (concentrations in mol/L)', value: 8e-5 }
      },
      note: 'Q uses the actual concentrations in mol/L (water and H⁺ at pH 7 are left out). The defaults are aldolase in a red blood cell: uphill under standard conditions, almost exactly at equilibrium in the cell.',
      practice: { unknowns: ['dG', 'Q'] },
      stories: {
        dG: 'A glycolytic step has a standard free-energy change of {dG0}. In the cell at {T} its mass-action ratio is {Q}. What is the actual ΔG?',
        Q: 'A step with ΔG\'° = {dG0} runs in a cell at {T} with ΔG = {dG}. What mass-action ratio does the cell maintain?'
      }
    },
    {
      name: 'Phosphofructokinase as a switch (Hill equation)',
      expr: 'f = S^n/(K^n + S^n)', tex: 'f = \\dfrac{\\mathrm{[F6P]}^n}{K_{0.5}^n + \\mathrm{[F6P]}^n}',
      vars: {
        f: { name: 'fraction of the maximum activity', q: 'ratio', unit: '%' },
        S: { name: 'fructose 6-phosphate concentration', q: 'concentration', unit: 'mM', value: 0.2, tex: '\\mathrm{[F6P]}' },
        K: { name: 'concentration giving half the maximum', q: 'concentration', unit: 'mM', value: 0.5, tex: 'K_{0.5}' },
        n: { name: 'Hill coefficient', value: 3, min: 0.5, max: 8 }
      },
      note: 'ATP raises K₀.₅; AMP and fructose 2,6-bisphosphate lower it. With n > 1 a modest shift in K₀.₅ switches the enzyme from nearly off to nearly on.',
      stories: {
        f: 'Phosphofructokinase (Hill coefficient {n}, K₀.₅ = {K}) sees {S} of fructose 6-phosphate. What fraction of its maximum rate does it reach?',
        K: 'At {S} of fructose 6-phosphate, PFK-1 (Hill coefficient {n}) runs at {f} of its maximum. What is its K₀.₅?'
      }
    }
  ],
  examples: [
    {
      title: 'An uphill step that runs downhill',
      q: 'Aldolase splits fructose 1,6-bisphosphate with $\\Delta G\'^{\\circ} = +23.8$ kJ/mol. In a red blood cell the concentrations are about 31 µM substrate, 138 µM DHAP and 19 µM G3P. Which way does it run at 37 °C?',
      steps: [
        '$Q = [\\text{DHAP}][\\text{G3P}]/[\\text{FBP}] = (138\\times10^{-6})(19\\times10^{-6})/(31\\times10^{-6}) = 8.5\\times10^{-5}$.',
        '$RT\\ln Q = 8.314 \\times 310 \\times \\ln(8.5\\times10^{-5}) = -24.2$ kJ/mol.',
        '$\\Delta G = 23.8 - 24.2 = -0.4$ kJ/mol: slightly downhill. Because one molecule becomes two, dilute concentrations favour the split; the cell keeps the products low by using them.'
      ],
      a: 'ΔG ≈ −0.4 kJ/mol: at equilibrium in practice, running forward as products are drawn off.'
    },
    {
      title: 'How much of the glucose energy does glycolysis keep?',
      q: 'Per glucose, glycolysis makes a net 2 ATP. What fraction of the 2870 kJ/mol released by complete oxidation is that (30.5 kJ/mol per ATP)?',
      steps: [
        '$2 \\times 30.5 = 61$ kJ/mol.',
        '$61/2870 = 0.021$, about 2 %.',
        'Glycolysis releases only about 146 kJ/mol in all; the other 2720 or so are still held by the two pyruvate and two NADH, and released only with oxygen.'
      ],
      a: 'About 2 %; most of the energy remains in pyruvate and NADH.'
    },
    {
      title: 'Turning PFK-1 on',
      q: 'PFK-1 has a Hill coefficient of 3. With plenty of ATP its K₀.₅ for fructose 6-phosphate is 0.5 mM; when AMP rises it drops to 0.1 mM. How active is it at 0.2 mM fructose 6-phosphate in each case?',
      steps: [
        'High ATP: $f = 0.2^3/(0.5^3 + 0.2^3) = 0.008/0.133 = 6$ %.',
        'High AMP: $f = 0.008/(0.001 + 0.008) = 89$ %.',
        'The substrate has not changed at all; a fivefold shift in K₀.₅ has turned a 6 % trickle into an 89 % flood.'
      ],
      a: 'From about 6 % to about 89 % of maximum.'
    }
  ],
  quiz: [
    { q: 'Glycolysis takes place in…', choices: ['the mitochondrial matrix', 'the cytosol', 'the inner mitochondrial membrane', 'the chloroplast stroma'], a: 1, why: 'All ten enzymes are in the cytosol — which is why bacteria and red blood cells, which have no mitochondria, can run it.' },
    { q: 'The net products of glycolysis per glucose are…', choices: ['4 ATP, 2 NADH, 2 pyruvate', '2 ATP, 2 NADH, 2 pyruvate', '2 ATP, 4 NADH, 2 pyruvate', '36 ATP, 6 CO₂'], a: 1, why: 'Four ATP are made but two were spent in the investment phase; one NADH is made per G3P, two per glucose.' },
    { q: 'Why does glycolysis begin by spending ATP?', choices: ['To trap glucose in the cell and prime it for splitting', 'To pay for oxygen', 'Because ATP is in excess', 'To make NADH'], a: 0, why: 'A phosphorylated sugar cannot leave through the glucose transporters, and fructose 1,6-bisphosphate splits easily into two three-carbon phosphates.' },
    { q: 'Glycolysis cannot run without oxygen.', a: false, why: 'No step uses oxygen. It needs NAD⁺, which fermentation regenerates without oxygen — at the cost of the much larger aerobic yield.' },
    { q: 'Which enzyme is the main control point of glycolysis?', choices: ['Aldolase', 'Phosphofructokinase-1', 'Enolase', 'Triose phosphate isomerase'], a: 1, why: 'PFK-1 catalyses the first step committed to glycolysis, is far from equilibrium and is regulated by ATP, AMP, citrate and fructose 2,6-bisphosphate. The others run near equilibrium.' }
  ],
  problems: [
    { q: 'A step has ΔG\'° = +7.5 kJ/mol. What mass-action ratio Q makes it run forward with ΔG = −2.0 kJ/mol at 37 °C?', answer: 0.0251, tol: 0.03, steps: ['$\\ln Q = (\\Delta G - \\Delta G\'^{\\circ})/RT = (-2000 - 7500)/(8.314 \\times 310.15) = -3.68$.', '$Q = e^{-3.68} = 0.025$: products must be kept at about 1/40 of the reactants.'] },
    { q: 'With a Hill coefficient of 4 and K₀.₅ = 1 mM, what percentage of its maximum activity does an enzyme reach at 0.5 mM substrate?', answer: 5.88, unit: '%', tol: 0.02, steps: ['$f = 0.5^4/(1 + 0.5^4) = 0.0625/1.0625 = 0.0588$ = 5.9 %.'] }
  ],
  applications: [
    'PET scans use fluorodeoxyglucose: hexokinase phosphorylates it but the next enzyme cannot use it, so it is trapped in cells that take up glucose fast — tumours, active brain regions, inflamed tissue.',
    'Red blood cells depend on glycolysis alone; inherited pyruvate kinase deficiency shortens their lives and causes anaemia.',
    'Brewing, baking and fuel ethanol all begin with glycolysis in yeast.',
    'Fast-twitch muscle fibres fuel bursts of seconds to a couple of minutes largely by glycolysis.'
  ],
  history: 'Eduard Buchner showed in 1897 that juice squeezed from yeast, with no living cells, ferments sugar — the end of the idea that fermentation needs a "vital force" (Nobel Prize 1907). Harden and Young then found that phosphate and a small coenzyme were essential. The ten steps were pieced together in the 1930s, largely by Gustav Embden, Otto Meyerhof and Jakub Parnas, which is why glycolysis is also called the Embden–Meyerhof–Parnas pathway.',
  sim: 'met-respiration'
},

{
  id: 'krebs-cycle', parent: 'respiration', title: 'The citric acid cycle', level: 2,
  short: 'In the mitochondrial matrix, pyruvate is converted to acetyl-CoA and the citric acid cycle oxidises the acetyl group completely to CO₂. Per glucose (two turns) it releases 4 CO₂ and makes 6 NADH, 2 FADH₂ and 2 ATP (as GTP): the cycle\'s real job is to load electron carriers.',
  keywords: ['citric acid cycle', 'Krebs cycle', 'TCA cycle', 'tricarboxylic acid cycle', 'acetyl-CoA', 'pyruvate dehydrogenase', 'link reaction', 'oxaloacetate', 'citrate', 'succinate dehydrogenase', 'anaplerotic', 'amphibolic', 'decarboxylation', 'glyoxylate cycle'],
  prereq: ['glycolysis', 'metabolism-overview', 'mitochondria-chloroplasts'],
  related: ['oxidative-phosphorylation', 'fermentation', 'enzyme-regulation', 'lipids', 'amino-acids', 'medicine:metabolism-energy', 'medicine:vitamins-minerals', 'chemistry:gibbs-equilibrium'],
  body: `
When oxygen is available, pyruvate from [[glycolysis]] is carried into the mitochondrial matrix, where its three carbons are oxidised completely to CO₂. Two stages do this: the link reaction, and the cycle named after citric acid (also the Krebs cycle or tricarboxylic acid, TCA, cycle).

### The link reaction
The **pyruvate dehydrogenase complex** — a giant assembly of dozens of subunits weighing several million daltons — removes one carbon as CO₂ and attaches the remaining acetyl group to coenzyme A:

$$\\text{pyruvate} + \\text{CoA} + \\ce{NAD+} \\to \\text{acetyl-CoA} + \\ce{CO2} + \\ce{NADH}$$

It needs five coenzymes made from vitamins: thiamine (B₁), riboflavin (B₂, in FAD), niacin (B₃, in NAD⁺), pantothenate (B₅, in CoA) and lipoic acid. The step is irreversible, which is why animals cannot turn fat — broken down to acetyl-CoA — back into glucose.

### Eight steps round the cycle
The two-carbon acetyl group joins four-carbon **oxaloacetate** to make six-carbon **citrate**; seven more steps remove two carbons as CO₂, collect eight electrons and rebuild oxaloacetate.

| Step | Enzyme | Product | Released |
|---|---|---|---|
| 1 | citrate synthase | citrate (6 C) | |
| 2 | aconitase | isocitrate | |
| 3 | isocitrate dehydrogenase | α-ketoglutarate (5 C) | CO₂, NADH |
| 4 | α-ketoglutarate dehydrogenase | succinyl-CoA (4 C) | CO₂, NADH |
| 5 | succinyl-CoA synthetase | succinate | GTP (or ATP) |
| 6 | succinate dehydrogenase | fumarate | FADH₂ |
| 7 | fumarase | malate | |
| 8 | malate dehydrogenase | oxaloacetate | NADH |

Per turn: **2 CO₂, 3 NADH, 1 FADH₂, 1 GTP**. Per glucose, two turns: 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP. With the link reaction's 2 CO₂ and 2 NADH, all six carbons of glucose have now left as CO₂, and the energy is loaded into 10 NADH and 2 FADH₂ (plus 4 ATP counting glycolysis). The cycle makes little ATP directly; its business is stripping electrons for [[oxidative-phosphorylation]].

### Why a cycle?
Oxaloacetate is rebuilt every turn, so a small pool can process any number of acetyl groups — it acts catalytically, like an enzyme. The last step, malate dehydrogenase, is uphill ($\\Delta G'^{\\circ} = +29.7$ kJ/mol): oxaloacetate is kept at nanomolar levels and citrate synthase (−32.2 kJ/mol) snatches it the moment it forms, pulling the pair forward. A surprise of isotope tracing: the two CO₂ released in a turn are *not* the carbons of the acetyl group that has just entered — those leave in later turns.

### A hub, not just a furnace
The cycle is **amphibolic**: it serves both directions of metabolism. α-Ketoglutarate becomes glutamate, oxaloacetate becomes aspartate, succinyl-CoA starts haem, and citrate exported to the cytosol supplies acetyl groups for fatty acids and cholesterol. Intermediates drawn off are replaced by **anaplerotic** ("filling up") reactions, chiefly pyruvate carboxylase. Fatty acids enter as acetyl-CoA from β-oxidation, amino acids at several points. Plants and bacteria also have the **glyoxylate cycle**, which skips the two CO₂-releasing steps and lets germinating oily seeds turn fat into sugar.

### Control
No step uses oxygen, yet the cycle stops within seconds without it: NADH piles up, NAD⁺ runs out and the dehydrogenases halt. Pyruvate dehydrogenase is inhibited by its products (acetyl-CoA, NADH) and switched off by phosphorylation; isocitrate and α-ketoglutarate dehydrogenases are activated by ADP and by Ca²⁺, which in muscle arrives with each contraction — the signal to burn faster.
`,
  ideas: [
    'The link reaction turns each pyruvate into acetyl-CoA, releasing CO₂ and making NADH; it is irreversible.',
    'Each turn of the cycle oxidises one acetyl group: 2 CO₂, 3 NADH, 1 FADH₂ and 1 GTP.',
    'Per glucose (two turns plus the link) all six carbons leave as CO₂ and the energy is held in 10 NADH and 2 FADH₂.',
    'Oxaloacetate is regenerated, so the cycle works catalytically; it stops without oxygen because NAD⁺ and FAD run out.',
    'The cycle is a hub: its intermediates feed biosynthesis and are replaced by anaplerotic reactions.'
  ],
  pitfalls: [
    'The citric acid cycle makes most of the ATP — It makes only 1 GTP per turn directly. Its NADH and FADH₂ make most of the ATP later, in oxidative phosphorylation.',
    'The cycle uses oxygen — No step does. It depends on oxygen indirectly, because only the electron transport chain regenerates its NAD⁺ and FAD.',
    'The CO₂ released in a turn comes from the acetyl group that just entered — Isotope tracing shows those carbons survive the first turn and leave in later ones.'
  ],
  formulas: [
    {
      name: 'ATP from one turn of the cycle',
      expr: 'Y = nN*PN + nF*PF + nG', tex: 'Y = n_N P_N + n_F P_F + n_G',
      vars: {
        Y: { name: 'ATP per acetyl-CoA' },
        nN: { name: 'NADH made per turn', value: 3, tex: 'n_N' },
        PN: { name: 'ATP per NADH (P/O ratio)', value: 2.5, tex: 'P_N' },
        nF: { name: 'FADH₂ made per turn', value: 1, tex: 'n_F' },
        PF: { name: 'ATP per FADH₂', value: 1.5, tex: 'P_F' },
        nG: { name: 'GTP (or ATP) made per turn', value: 1, tex: 'n_G' }
      },
      note: 'The P/O ratios 2.5 and 1.5 are the modern round values; older books used 3 and 2, giving 12 per turn.',
      practice: { unknowns: ['Y', 'PN'] },
      stories: {
        Y: 'One turn of the cycle makes {nN} NADH, {nF} FADH₂ and {nG} GTP. With {PN} ATP per NADH and {PF} per FADH₂, how many ATP does one acetyl-CoA yield?',
        PN: 'An acetyl-CoA yields {Y} ATP via {nN} NADH, {nF} FADH₂ (at {PF} each) and {nG} GTP. What P/O ratio for NADH does that imply?'
      }
    },
    {
      name: 'Equilibrium constant from the standard free energy',
      expr: 'K = exp(-dG0/(R*T))', tex: "K = e^{-\\Delta G'^{\\circ}/RT}",
      vars: {
        K: { name: 'equilibrium constant' },
        dG0: { name: 'standard free-energy change (pH 7)', q: 'molarenergy', unit: 'kJ/mol', value: 29.7, signed: true, tex: "\\Delta G'^{\\circ}" },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'The defaults are malate dehydrogenase: K ≈ 10⁻⁵, so at equilibrium hardly any oxaloacetate is present.',
      stories: {
        K: 'A step of the citric acid cycle has ΔG\'° = {dG0}. What is its equilibrium constant at {T}?',
        dG0: 'A reaction has an equilibrium constant of {K} at {T}. What is its standard free-energy change?'
      }
    }
  ],
  examples: [
    {
      title: 'Where the six carbons go',
      q: 'Follow the carbon atoms of one glucose through glycolysis, the link reaction and the cycle.',
      steps: [
        'Glycolysis: 6 C → 2 pyruvate of 3 C. No CO₂ yet.',
        'Link reaction: each pyruvate loses 1 C as CO₂ → 2 CO₂, leaving 2 acetyl groups of 2 C.',
        'Cycle: each turn releases 2 CO₂ → 4 CO₂ for two turns. Total $2 + 4 = 6$ CO₂: every carbon is accounted for (though, strictly, those released in this glucose\'s turns come from earlier acetyl groups).'
      ],
      a: '6 CO₂: 2 from the link reaction, 4 from the cycle.'
    },
    {
      title: 'Why malate dehydrogenase runs forward',
      q: 'Malate dehydrogenase has $\\Delta G\'^{\\circ} = +29.7$ kJ/mol. How much oxaloacetate is present at equilibrium with 0.5 mM malate, if NAD⁺/NADH in the matrix is 8?',
      steps: [
        '$K = e^{-29\\,700/(8.314 \\times 310)} = e^{-11.5} = 1.0 \\times 10^{-5}$.',
        '$K = \\dfrac{[\\text{OAA}][\\ce{NADH}]}{[\\text{malate}][\\ce{NAD+}]}$, so $[\\text{OAA}]/[\\text{malate}] = K \\times 8 = 8\\times10^{-5}$.',
        '$[\\text{OAA}] = 8\\times10^{-5} \\times 0.5$ mM $= 40$ nM. Citrate synthase ($\\Delta G\'^{\\circ} = -32.2$ kJ/mol) removes it at once, so the two steps together run downhill.'
      ],
      a: 'About 40 nM of oxaloacetate — pulled forward by citrate synthase.'
    },
    {
      title: 'The yield of one acetyl group',
      q: 'How many ATP does one acetyl-CoA yield through the cycle and the electron transport chain? And one glucose, from pyruvate onwards?',
      steps: [
        'Per turn: $3 \\times 2.5 + 1 \\times 1.5 + 1 = 10$ ATP.',
        'Per glucose: two turns give 20; the link reaction adds $2 \\times 2.5 = 5$ from its NADH.',
        'So 25 of the roughly 32 ATP per glucose come from pyruvate onwards — the mitochondrion\'s share.'
      ],
      a: '10 ATP per acetyl-CoA; 25 per glucose from pyruvate onwards.'
    }
  ],
  quiz: [
    { q: 'Per turn of the cycle (one acetyl-CoA), the products are…', choices: ['2 CO₂, 3 NADH, 1 FADH₂, 1 GTP', '3 CO₂, 4 NADH, 1 FADH₂, 1 ATP', '2 CO₂, 2 NADH, 2 FADH₂, 2 ATP', '1 CO₂, 3 NADH, 1 FADH₂, 1 ATP'], a: 0, why: 'Two decarboxylations, three NAD⁺-linked dehydrogenases, one FAD-linked (succinate dehydrogenase) and one substrate-level phosphorylation. The third CO₂ of pyruvate was lost in the link reaction.' },
    { q: 'How many CO₂ molecules do the link reaction and the cycle release per glucose?', answer: 6, why: '2 from the link reaction (one per pyruvate) and 4 from the two turns: all six carbons of glucose.' },
    { q: 'One step of the citric acid cycle uses oxygen directly.', a: false, why: 'None does. The cycle needs oxygen only indirectly: the electron transport chain must reoxidise its NADH and FADH₂.' },
    { q: 'In a eukaryotic cell the citric acid cycle runs in…', choices: ['the cytosol', 'the mitochondrial matrix', 'the intermembrane space', 'the nucleus'], a: 1, why: 'All its enzymes are in the matrix except succinate dehydrogenase, which sits in the inner membrane as complex II. In bacteria the cycle runs in the cytoplasm.' },
    { q: 'Acetyl-CoA is labelled with ¹⁴C. In the first turn of the cycle, the CO₂ released is…', choices: ['all labelled', 'half labelled', 'unlabelled: the label leaves in later turns', 'labelled only at step 3'], a: 2, why: 'The two carbons lost in a turn come from the oxaloacetate part of citrate; the acetyl carbons are released only in later turns.' }
  ],
  problems: [
    { q: 'How many ATP does complete oxidation of one pyruvate in the mitochondrion yield (link reaction plus one turn), at 2.5 ATP per NADH and 1.5 per FADH₂?', answer: 12.5, tol: 0.01, steps: ['Link reaction: 1 NADH = 2.5 ATP.', 'One turn: 3 NADH, 1 FADH₂, 1 GTP = 7.5 + 1.5 + 1 = 10.', 'Total 12.5 ATP.'] },
    { q: 'Citrate synthase has ΔG\'° = −32.2 kJ/mol. What is its equilibrium constant at 37 °C?', answer: 2.65e5, tol: 0.05, steps: ['$K = e^{32\\,200/(8.314 \\times 310.15)} = e^{12.49} = 2.6\\times10^5$ — the reaction lies far on the side of citrate.'] }
  ],
  applications: [
    'Thiamine (vitamin B₁) is needed by pyruvate and α-ketoglutarate dehydrogenase; its deficiency causes beriberi and Wernicke\'s encephalopathy.',
    'Citric acid for food and drinks — some two million tonnes a year — is made by the mould Aspergillus niger, grown so that its cycle overflows with citrate.',
    'Mutations in cycle enzymes (isocitrate dehydrogenase, succinate dehydrogenase, fumarase) drive some cancers through the "oncometabolites" they produce.',
    '¹³C-labelling experiments trace carbon through the cycle to map how cells and tissues route their fuel.'
  ],
  history: 'Hans Krebs and William Johnson proposed the cycle in 1937 from experiments on minced pigeon breast muscle, whose oxygen use was boosted far beyond expectation by tiny additions of citrate, succinate or fumarate — the mark of a catalytic cycle. Nature declined the paper and it appeared in Enzymologia. Krebs shared the 1953 Nobel Prize with Fritz Lipmann, discoverer of coenzyme A.',
  sim: 'met-respiration'
},

{
  id: 'oxidative-phosphorylation', parent: 'respiration', title: 'Oxidative phosphorylation and chemiosmosis', level: 3,
  short: 'The electron transport chain in the inner mitochondrial membrane passes electrons from NADH and FADH₂ to oxygen and uses the energy to pump protons out of the matrix. The protons flow back through ATP synthase, a rotary motor that makes about three ATP per turn. Together they make most of the cell\'s ATP: about 30–32 per glucose.',
  keywords: ['oxidative phosphorylation', 'electron transport chain', 'chemiosmosis', 'proton-motive force', 'ATP synthase', 'F0F1', 'binding change', 'P/O ratio', 'ubiquinone', 'cytochrome c', 'complex IV', 'uncoupler', 'dinitrophenol', 'thermogenin', 'brown fat', 'respiratory control', 'Mitchell', 'c-ring'],
  prereq: ['krebs-cycle', 'metabolism-overview', 'membrane-structure', 'chemistry:electrode-potentials'],
  related: ['light-reactions', 'mitochondria-chloroplasts', 'active-transport', 'fermentation', 'glycolysis', 'medicine:poisoning-overdose', 'medicine:thermoregulation', 'medicine:membrane-potential', 'chemistry:nernst-equation', 'chemistry:gibbs-energy'],
  body: `
Almost all the ATP a human makes — about 26–28 of the 30–32 per glucose — is made on the inner membrane of the mitochondria by two linked machines. The **electron transport chain** passes the electrons of NADH and FADH₂ down a staircase of carriers to oxygen, and uses the energy released to pump protons out of the matrix. **ATP synthase** lets the protons flow back and uses their energy to make ATP. What links the two is not a chemical intermediate but a gradient of protons across a membrane: Peter Mitchell's **chemiosmotic** theory.

### The electron transport chain
| Component | Takes electrons from | Gives them to | H⁺ pumped per 2 e⁻ |
|---|---|---|---|
| Complex I (NADH dehydrogenase) | NADH | ubiquinone (Q) | 4 |
| Complex II (succinate dehydrogenase) | succinate, via FADH₂ | ubiquinone | 0 |
| Complex III (cytochrome bc₁) | ubiquinol (QH₂) | cytochrome c | 4 (by the Q cycle) |
| Complex IV (cytochrome c oxidase) | cytochrome c | O₂, making H₂O | 2 |

Ubiquinone is a small fatty molecule that diffuses within the membrane; cytochrome c is a small protein on its outer face. The electrons fall from NADH at −0.32 V through ubiquinone (about +0.05 V) and cytochrome c (+0.25 V) to oxygen at +0.82 V: a drop of 1.14 V, or 220 kJ per mole of NADH, released in steps small enough to be caught. Complex IV holds each O₂ at an iron–copper centre until it has received all four electrons, so that almost no half-reduced oxygen escapes (a little leaks elsewhere as superoxide). The count: **10 H⁺ per NADH** (4 + 4 + 2) and **6 per FADH₂**, whose electrons join at ubiquinone and skip complex I.

### The proton-motive force
Pumping leaves the matrix negatively charged and alkaline, and both push protons back in. Together they make the **proton-motive force**:

$$\\Delta p = \\Delta\\psi + \\frac{2.303\\,RT}{F}\\,\\Delta\\mathrm{pH}$$

In a working mitochondrion the membrane potential Δψ is about 150–180 mV and the matrix is 0.5–0.8 pH units more alkaline, each unit worth 61.5 mV at 37 °C: Δp ≈ 200 mV. Across a membrane about 5 nm thick, 160 mV is a field of 3 × 10⁷ V/m — ten times the field at which air breaks down into a spark. Each mole of protons flowing back releases $F\\Delta p \\approx 19$ kJ, so the ten protons of one NADH store about 190 of its 220 kJ.

### ATP synthase: a rotary motor
The synthase is two motors on one shaft. **F₀**, in the membrane, is a ring of *c* subunits — 8 in animals, 10 in yeast and *E. coli*, 14 in spinach chloroplasts. Each proton that crosses binds to the ring, rides round and leaves into the matrix, turning the ring by one subunit. The ring turns a central stalk inside **F₁**, a knob of three α and three β subunits projecting into the matrix. As the stalk rotates, each β site cycles through three shapes — open, loose, tight — binding ADP and phosphate, squeezing them into ATP and releasing it: Paul Boyer's **binding-change mechanism**, three ATP per turn. In 1997 a fluorescent filament fixed to the stalk of a single F₁ was filmed turning, and a year later its 120° steps were resolved.

With 8 *c* subunits, a turn takes 8 protons for 3 ATP — about 2.7 H⁺ per ATP. One more proton pays for carrying phosphate into the matrix and ATP out to the cytosol, so each ATP delivered to the cell costs about 3.7 protons: round figure 4.

### Counting the ATP
The **P/O ratio** is the number of ATP made per pair of electrons given to oxygen (one O atom). With the round figures, NADH gives 10/4 = **2.5** and FADH₂ 6/4 = **1.5**, close to measured values.

| Source, per glucose | ATP |
|---|---|
| substrate level: glycolysis and the cycle | 2 + 2 |
| 10 NADH × 2.5 | 25 |
| 2 FADH₂ × 1.5 | 3 |
| **total** | **32** — or 30 if the NADH of glycolysis enters by the glycerol-phosphate shuttle, at 1.5 each |

> [!why] Older textbooks say 36–38 ATP. They assumed whole-number P/O ratios of 3 and 2 — one ATP per "coupling site" — giving 4 + 30 + 4 = 38 (36 with the glycerol-phosphate shuttle). Counting the protons actually pumped, the structure of the *c* ring and the proton cost of transport replaced those guesses with 2.5 and 1.5. Real cells make somewhat less still, because some protons leak back through the membrane without making ATP.

At the standard 30.5 kJ/mol per ATP, 32 ATP keep 34 % of glucose's 2870 kJ/mol; at the 55 kJ/mol an ATP is really worth inside a cell, about 60 %.

### Respiratory control, uncouplers and poisons
Electrons can flow only as fast as protons return. At rest, with little ADP, the synthase idles, Δp rises until pumping stalls, and oxygen use falls; start exercising, ADP rises and oxygen consumption climbs — **respiratory control**. An **uncoupler** is a proton leak: 2,4-dinitrophenol ferries protons across the membrane, so fuel is burnt and oxygen used but no ATP is made; the energy becomes heat. Brown fat does this on purpose with its uncoupling protein, thermogenin (UCP1), to warm newborn babies and hibernating mammals. Inhibitors block the chain at its complexes: rotenone at complex I, antimycin at III, cyanide, carbon monoxide and hydrogen sulfide at IV, oligomycin at the synthase.

> [!warn] Uncouplers and electron-transport inhibitors are dangerous poisons; dinitrophenol, once sold for weight loss, still causes deaths by overheating. Sudden breathlessness, confusion, collapse or a very high body temperature after a possible exposure is an emergency: call your local emergency number.
`,
  ideas: [
    'The electron transport chain passes electrons from NADH and FADH₂ to O₂ and pumps protons out of the matrix: 10 per NADH, 6 per FADH₂.',
    'The proton gradient stores energy as the proton-motive force, Δp = Δψ + (2.303RT/F)ΔpH, about 200 mV.',
    'ATP synthase is a rotary motor: protons turn its c ring, and each full turn makes 3 ATP in F₁.',
    'About 4 protons per ATP (including transport) give P/O ratios of 2.5 for NADH and 1.5 for FADH₂, and about 30–32 ATP per glucose.',
    'Electron flow and ATP synthesis are coupled through the gradient: uncouplers let fuel burn without making ATP; blocking the synthase stops respiration.'
  ],
  pitfalls: [
    'Each NADH makes exactly 3 ATP — That was an older assumption. The ATP made depends on protons pumped (10) and protons used per ATP (about 4), giving about 2.5; P/O ratios need not be whole numbers.',
    'Oxygen is needed to make ATP directly — Oxygen only accepts electrons at the end of the chain. Its role is to keep the electrons flowing; ATP is made by protons returning through the synthase.',
    'An uncoupler stops respiration — The reverse: oxygen use speeds up because nothing holds the pumps back, but the energy escapes as heat instead of being captured as ATP.'
  ],
  derivation: {
    title: 'ATP per glucose, counted in protons',
    steps: [
      { text: 'Protons pumped: 10 NADH at 10 H⁺ each and 2 FADH₂ at 6 H⁺ each.', tex: 'n_{\\ce{H+}} = 10 \\times 10 + 2 \\times 6 = 112' },
      { text: 'Protons per ATP delivered to the cytosol: $c/3$ through the synthase (8/3 in animals) plus 1 for transport — about 3.7, round figure 4.', tex: '\\frac{8}{3} + 1 \\approx 3.7 \\approx 4' },
      { text: 'ATP from the gradient, plus 4 from substrate-level phosphorylation in glycolysis and the cycle:', tex: '\\frac{112}{4} + 4 = 28 + 4 = 32' }
    ]
  },
  formulas: [
    {
      name: 'The proton-motive force',
      expr: 'dp = dpsi + 2.303*R*T*dpH/F', tex: '\\Delta p = \\Delta\\psi + \\dfrac{2.303\\,R\\,T}{F}\\,\\Delta\\mathrm{pH}',
      vars: {
        dp: { name: 'proton-motive force', q: 'voltage', unit: 'mV', tex: '\\Delta p' },
        dpsi: { name: 'membrane potential (matrix negative), as a magnitude', q: 'voltage', unit: 'mV', value: 160, tex: '\\Delta\\psi' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        F: { const: 'F' },
        dpH: { name: 'pH difference (matrix minus outside)', value: 0.75, tex: '\\Delta\\mathrm{pH}' }
      },
      note: 'At 37 °C each pH unit is worth 61.5 mV. In mitochondria most of Δp is the membrane potential; in chloroplasts most is ΔpH.',
      practice: { unknowns: ['dp', 'dpsi', 'dpH'] },
      stories: {
        dp: 'A mitochondrion at {T} has a membrane potential of {dpsi} and a matrix {dpH} pH units more alkaline than the outside. What is the proton-motive force?',
        dpsi: 'A proton-motive force of {dp} includes a pH difference of {dpH} units at {T}. How large is the membrane potential?'
      }
    },
    {
      name: 'Protons needed per ATP (thermodynamic minimum)',
      expr: 'nH = dGp/(F*dp)', tex: 'n_{\\mathrm{H}} = \\dfrac{\\Delta G_p}{F\\,\\Delta p}',
      vars: {
        nH: { name: 'protons per ATP, at least', tex: 'n_{\\mathrm{H}}' },
        dGp: { name: 'free energy needed to make ATP in the cell', q: 'molarenergy', unit: 'kJ/mol', value: 55, tex: '\\Delta G_p' },
        F: { const: 'F' },
        dp: { name: 'proton-motive force', q: 'voltage', unit: 'mV', value: 200, tex: '\\Delta p' }
      },
      note: 'Each mole of protons returning releases FΔp. The real machine uses a few more protons than this minimum (about 3.7), which keeps it running firmly forwards.',
      stories: {
        nH: 'Making ATP in the cytosol costs {dGp}; the proton-motive force is {dp}. What is the smallest number of protons that could pay for one ATP?',
        dp: 'If exactly {nH} protons had to pay for an ATP costing {dGp}, what proton-motive force would be needed?'
      }
    },
    {
      name: 'P/O ratio from the rotor',
      expr: 'PO = np/(c/3 + 1)', tex: '\\mathrm{P/O} = \\dfrac{n_p}{c/3 + 1}',
      vars: {
        PO: { name: 'ATP made per pair of electrons given to oxygen', tex: '\\mathrm{P/O}' },
        np: { name: 'protons pumped per electron pair', value: 10, int: true, tex: 'n_p' },
        c: { name: 'c subunits in the rotor ring', value: 8, int: true, min: 8, max: 17 }
      },
      note: 'c/3 protons turn the rotor for one ATP; the +1 pays for importing phosphate and exporting ATP. n = 10 for NADH, 6 for FADH₂.',
      stories: {
        PO: 'A mitochondrion pumps {np} protons per electron pair, and its ATP synthase has a ring of {c} c subunits. What is its P/O ratio?',
        np: 'A mitochondrion with a {c}-subunit rotor has a P/O ratio of {PO}. How many protons are pumped per pair of electrons?'
      }
    },
    {
      name: 'ATP per glucose',
      expr: 'Y = S + nN*PN + nF*PF', tex: 'Y = S + n_N P_N + n_F P_F',
      vars: {
        Y: { name: 'ATP per glucose' },
        S: { name: 'ATP (and GTP) made by substrate-level phosphorylation', value: 4 },
        nN: { name: 'NADH per glucose', value: 10, tex: 'n_N' },
        PN: { name: 'ATP per NADH', value: 2.5, tex: 'P_N' },
        nF: { name: 'FADH₂ per glucose', value: 2, tex: 'n_F' },
        PF: { name: 'ATP per FADH₂', value: 1.5, tex: 'P_F' }
      },
      note: 'Modern round values give 32 (30 with the glycerol-phosphate shuttle); the old ratios 3 and 2 give 38.',
      practice: { unknowns: ['Y', 'PN'] },
      stories: {
        Y: 'Respiration of glucose gives {S} ATP by substrate-level phosphorylation, {nN} NADH at {PN} ATP each and {nF} FADH₂ at {PF} each. How many ATP in all?',
        PN: 'A textbook counts {Y} ATP per glucose from {S} substrate-level ATP, {nN} NADH and {nF} FADH₂ at {PF} each. What P/O ratio does it assume for NADH?'
      }
    }
  ],
  examples: [
    {
      title: 'The proton-motive force of a mitochondrion',
      q: 'A mitochondrion at 37 °C has Δψ = 160 mV and its matrix is 0.75 pH units more alkaline than the intermembrane space. Find Δp, the energy per mole of protons, and the energy stored by the 10 protons pumped per NADH.',
      steps: [
        '$2.303RT/F = 2.303 \\times 8.314 \\times 310.15/96\\,485 = 61.5$ mV per pH unit.',
        '$\\Delta p = 160 + 61.5 \\times 0.75 = 206$ mV.',
        '$F\\Delta p = 96\\,485 \\times 0.206 = 19.9$ kJ per mole of protons; ten protons store 199 kJ of NADH\'s 220 kJ — the chain is about 90 % efficient at building the gradient.'
      ],
      a: 'Δp ≈ 206 mV; 19.9 kJ/mol per proton; about 199 kJ stored per NADH.'
    },
    {
      title: 'Why the count changed from 38 to about 32',
      q: 'Compare the ATP per glucose from the old P/O ratios (3 and 2) with the modern ones (2.5 and 1.5).',
      steps: [
        'Old: $4 + 10 \\times 3 + 2 \\times 2 = 38$.',
        'Modern: $4 + 10 \\times 2.5 + 2 \\times 1.5 = 32$.',
        'The difference lies wholly in the P/O ratios: 10 protons per NADH divided by about 4 per ATP is 2.5, not 3.'
      ],
      a: '38 by the old count, 32 by the modern one.'
    },
    {
      title: 'The field across the inner membrane',
      q: 'The inner mitochondrial membrane is about 5 nm thick and carries a membrane potential of 160 mV. What is the electric field?',
      steps: [
        '$E = V/d = 0.160/(5\\times10^{-9}) = 3.2\\times10^{7}$ V/m.',
        'Dry air breaks down into a spark at about $3\\times10^{6}$ V/m: the membrane holds ten times that, over a distance of a few atoms.'
      ],
      a: 'About 3 × 10⁷ V/m.'
    }
  ],
  quiz: [
    { q: 'Which complex of the chain does NOT pump protons?', choices: ['Complex I', 'Complex II', 'Complex III', 'Complex IV'], a: 1, why: 'Complex II (succinate dehydrogenase) passes electrons from FADH₂ to ubiquinone without pumping — one reason FADH₂ yields fewer ATP than NADH.' },
    { q: 'An uncoupler such as dinitrophenol is added to respiring mitochondria. Oxygen consumption…', choices: ['stops', 'falls', 'rises, while ATP synthesis falls', 'rises, and ATP synthesis rises too'], a: 2, why: 'Protons leak back without passing through the synthase, so nothing holds the pumps back: electrons race to oxygen, but no ATP is made and the energy becomes heat.' },
    { q: 'Oligomycin blocks ATP synthase. With no uncoupler present, the mitochondria\'s oxygen consumption…', choices: ['rises', 'falls nearly to zero', 'is unchanged', 'doubles'], a: 1, why: 'Respiratory control: with the synthase blocked, Δp builds up until the pumps can no longer push protons against it, and electron flow stops. Adding an uncoupler then restarts it.' },
    { q: 'A yeast mitochondrion has a c₁₀ ring and pumps 10 protons per NADH. Counting 1 proton per ATP for transport, what is its P/O ratio for NADH?', answer: 2.31, why: '$10/(10/3 + 1) = 10/4.33 = 2.31$ — a larger ring costs more protons per ATP.' },
    { q: 'The final electron acceptor of the chain is oxygen, which is reduced to water.', a: true, why: 'Complex IV passes four electrons to each O₂, which takes up four protons from the matrix and becomes two water molecules.' }
  ],
  problems: [
    { q: 'What is the proton-motive force (in mV) when Δψ = 140 mV and ΔpH = 1.0 at 37 °C?', answer: 201.5, unit: 'mV', tol: 0.02, steps: ['$\\Delta p = 140 + 61.5 \\times 1.0 = 201.5$ mV.'] },
    { q: 'Using the old whole-number P/O ratios of 3 for NADH and 2 for FADH₂ (malate–aspartate shuttle), how many ATP per glucose would you count?', answer: 38, tol: 0.01, steps: ['$4 + 10 \\times 3 + 2 \\times 2 = 38$.', 'With the modern 2.5 and 1.5 the same count gives 32.'] }
  ],
  applications: [
    'Brown fat: thermogenin (UCP1) uncouples on purpose to make heat — in newborn babies, hibernating mammals and, when it is cold, in adults too.',
    'Mitochondrial diseases: faults in the 13 chain proteins encoded by mitochondrial DNA, or in the many encoded in the nucleus, affect the most energy-hungry tissues — brain, muscle, heart and eye.',
    'Poisoning by cyanide, carbon monoxide or hydrogen sulfide is treated by emergency services with oxygen and antidotes that work on the chain.',
    'The same chemiosmotic machinery makes ATP in chloroplasts (see [[light-reactions]]) and drives the rotary flagellar motors of bacteria.'
  ],
  history: 'Peter Mitchell proposed in 1961 that electron transport and ATP synthesis are linked by a proton gradient rather than a high-energy chemical intermediate. Working largely in his own laboratory in a Cornish country house, he was doubted for years, but won the 1978 Nobel Prize in Chemistry. Paul Boyer\'s binding-change mechanism and John Walker\'s 1994 atomic structure of F₁ shared the 1997 prize, the year Hiroyuki Noji, Masasuke Yoshida, Kazuhiko Kinosita and colleagues watched a single F₁ turn.',
  sim: 'met-chemiosmosis'
},

{
  id: 'fermentation', parent: 'respiration', title: 'Fermentation and anaerobic respiration', level: 2,
  short: 'Without oxygen, cells regenerate the NAD⁺ that glycolysis needs by passing its electrons to a molecule made from pyruvate — lactate in muscle and yoghurt bacteria, ethanol and CO₂ in yeast. Fermentation yields only the 2 ATP of glycolysis. Anaerobic respiration is different: an electron transport chain with an acceptor other than oxygen.',
  keywords: ['fermentation', 'lactate', 'lactic acid', 'alcoholic fermentation', 'ethanol', 'yeast', 'anaerobic respiration', 'Pasteur effect', 'Crabtree effect', 'Cori cycle', 'facultative anaerobe', 'obligate anaerobe', 'denitrification', 'methanogen', 'sulfate reduction', 'lactate threshold'],
  prereq: ['glycolysis', 'metabolism-overview', 'oxidative-phosphorylation'],
  related: ['microbial-metabolism', 'microbes-industry', 'bacterial-growth', 'muscles-movement', 'nitrogen-cycle', 'medicine:physical-activity', 'medicine:alcohol', 'chemistry:redox-reactions'],
  body: `
[[glycolysis|Glycolysis]] runs only while NAD⁺ is there to accept its electrons, and a cell holds only a small pool of it. With oxygen, NADH hands its electrons to the electron transport chain. Without oxygen the cell must dump them somewhere else — and in **fermentation** it hands them to an organic molecule made from pyruvate itself. That regenerates NAD⁺ so glycolysis can carry on, but adds no ATP: fermentation yields just the **2 ATP per glucose** of glycolysis, against about 30 for respiration.

### Lactate fermentation
$$\\text{pyruvate} + \\ce{NADH} + \\ce{H+} \\to \\text{lactate} + \\ce{NAD+}$$

Lactate dehydrogenase does it in one step; overall, glucose → 2 lactate with $\\Delta G'^{\\circ} = -196$ kJ/mol. Lactic acid bacteria make yoghurt, cheese, sauerkraut, kimchi and sourdough this way; so do red blood cells, which have no mitochondria, and fast-twitch muscle in a sprint. Lactate is not waste: the heart and slow-twitch muscle burn it, and the liver rebuilds glucose from it (the **Cori cycle**, which costs 6 ATP for each glucose remade). Blood lactate is about 1 mM at rest, climbs steeply above the *lactate threshold* (often taken as 4 mM) and can reach 15–25 mM after an all-out effort.

### Alcoholic fermentation
Yeasts such as *Saccharomyces cerevisiae*, and plant roots in waterlogged soil, take two steps: pyruvate decarboxylase removes CO₂ to give acetaldehyde, which alcohol dehydrogenase reduces to ethanol with NADH.

$$\\ce{C6H12O6 -> 2C2H5OH + 2CO2}\\qquad \\Delta G'^{\\circ} \\approx -235\\ \\mathrm{kJ/mol}$$

The CO₂ raises bread and carbonates beer; the ethanol still holds about 90 % of the sugar's energy, which is why it burns as a fuel. The theoretical yield is 0.511 g of ethanol per gram of glucose; real fermentations reach 90–95 % of it, and most yeasts stop at 12–15 % alcohol by volume, poisoned by their own product.

### Anaerobic respiration is something else
Many bacteria and archaea without oxygen still run an electron transport chain and make ATP by chemiosmosis — they simply give the electrons to another final acceptor. The yield depends on how strongly the acceptor pulls electrons:

| Final electron acceptor | Product | $E'^{\\circ}$ of the couple (V) | Who does it |
|---|---|---|---|
| O₂ (aerobic respiration) | H₂O | +0.82 | animals, plants, many microbes |
| nitrate, NO₃⁻ | nitrite, then N₂ | +0.42 | denitrifying soil bacteria |
| sulfate, SO₄²⁻ | H₂S | −0.22 | sulfate reducers of black, smelly mud |
| CO₂ | methane, CH₄ | −0.24 | methanogenic archaea |

### Yield against speed
Because respiration makes about fifteen times as much ATP per glucose, a cell that loses its oxygen must burn sugar some fifteen times faster to keep up the same ATP supply. Louis Pasteur saw the other side in 1861: yeast given air consumed far less sugar — the **Pasteur effect**. Organisms cope differently: **obligate anaerobes** are harmed by oxygen; **facultative anaerobes** such as yeast and *E. coli* switch between respiring and fermenting; our muscles ferment only in bursts. Some cells ferment even with oxygen, trading yield for speed when sugar is plentiful — brewer's yeast in a sugary wort (the Crabtree effect) and many cancer cells (the Warburg effect).

> [!note] Muscle soreness a day or two after hard exercise is not caused by lactic acid, which is cleared from the blood within an hour or so; it comes from microscopic damage to the muscle fibres and the repair that follows.
`,
  ideas: [
    'Fermentation regenerates NAD⁺ by passing the electrons of NADH to a molecule made from pyruvate, so glycolysis can continue without oxygen.',
    'It yields only the 2 ATP per glucose of glycolysis; the lactate or ethanol still holds most of the energy.',
    'Lactate fermentation (muscle, red blood cells, lactic acid bacteria) makes lactate; alcoholic fermentation (yeast) makes ethanol and CO₂.',
    'Anaerobic respiration uses an electron transport chain with an acceptor other than O₂, such as nitrate or sulfate, and yields more than fermentation but less than aerobic respiration.',
    'For the same ATP, a fermenting cell burns about fifteen times more glucose — the Pasteur effect.'
  ],
  pitfalls: [
    'Fermentation and anaerobic respiration are the same thing — Fermentation has no electron transport chain; anaerobic respiration does, and makes ATP by chemiosmosis with nitrate, sulfate or another acceptor instead of oxygen.',
    'Fermentation makes extra ATP from pyruvate — The step after glycolysis makes no ATP at all; its only job is to regenerate NAD⁺.',
    'Lactic acid causes next-day muscle soreness — Lactate is cleared within about an hour and is burnt as fuel by the heart and other muscles; delayed soreness comes from fibre damage and repair.'
  ],
  formulas: [
    {
      name: 'Glucose needed for an ATP demand',
      expr: 'Jg = Ja/Y', tex: 'J_{\\mathrm{glc}} = \\dfrac{J_{\\mathrm{ATP}}}{Y}',
      vars: {
        Jg: { name: 'rate of glucose use', q: false, unit: 'mmol/min', tex: 'J_{\\mathrm{glc}}' },
        Ja: { name: 'rate of ATP use', q: false, unit: 'mmol/min', value: 50, tex: 'J_{\\mathrm{ATP}}' },
        Y: { name: 'ATP made per glucose', value: 32 }
      },
      note: 'Y is about 30–32 for aerobic respiration and 2 for fermentation. At steady state a cell makes ATP exactly as fast as it uses it.',
      stories: {
        Jg: 'Muscles use ATP at {Ja} and make it at {Y} ATP per glucose. How fast do they use glucose?',
        Y: 'Cells using ATP at {Ja} consume glucose at {Jg}. How many ATP do they make per glucose?'
      }
    },
    {
      name: 'Ethanol from sugar',
      expr: 'mE = 2*f*mG*ME/MG', tex: 'm_{\\mathrm{E}} = 2 f\\, m_{\\mathrm{G}}\\,\\dfrac{M_{\\mathrm{E}}}{M_{\\mathrm{G}}}',
      vars: {
        mE: { name: 'mass of ethanol made', q: 'mass', unit: 'g', tex: 'm_{\\mathrm{E}}' },
        f: { name: 'fraction of the sugar fermented to ethanol', q: 'ratio', unit: '%', value: 92, min: 0, max: 100 },
        mG: { name: 'mass of glucose', q: 'mass', unit: 'g', value: 200, tex: 'm_{\\mathrm{G}}' },
        ME: { name: 'molar mass of ethanol', q: 'molarmass', unit: 'g/mol', value: 46.07, fixed: true, tex: 'M_{\\mathrm{E}}' },
        MG: { name: 'molar mass of glucose', q: 'molarmass', unit: 'g/mol', value: 180.16, fixed: true, tex: 'M_{\\mathrm{G}}' }
      },
      note: 'Each glucose gives two ethanol (and two CO₂). With f = 100 % the yield is 0.511 g of ethanol per gram of glucose.',
      practice: { unknowns: ['mE', 'mG', 'f'] },
      stories: {
        mE: 'A litre of grape juice contains {mG} of sugar, and yeast ferments {f} of it to ethanol. How much ethanol is made?',
        mG: 'A brewer wants {mE} of ethanol and expects {f} of the sugar to be fermented. How much glucose is needed?'
      }
    }
  ],
  examples: [
    {
      title: 'The same ATP, sixteen times the sugar',
      q: 'Cells use ATP at 50 mmol/min. How fast must they use glucose if they respire (32 ATP per glucose) or if they ferment (2 ATP)? Give grams per minute (180 g/mol).',
      steps: [
        'Respiring: $50/32 = 1.56$ mmol/min $= 0.28$ g/min.',
        'Fermenting: $50/2 = 25$ mmol/min $= 4.5$ g/min.',
        'Sixteen times more glucose for the same ATP — and fermenting cells also pour out 50 mmol/min of lactate or ethanol.'
      ],
      a: '0.28 g/min respiring, 4.5 g/min fermenting.'
    },
    {
      title: 'From grape juice to wine',
      q: 'A litre of juice holds 200 g of sugar (treat it as glucose), and 92 % is fermented to ethanol. How much ethanol, what strength of wine (ethanol density 0.789 g/mL), and how much CO₂ gas escapes (24.5 L/mol at 25 °C)?',
      steps: [
        'Ethanol: $2 \\times 0.92 \\times 200 \\times 46.07/180.16 = 94$ g, which is $94/0.789 = 119$ mL — about 12 % by volume.',
        'CO₂: also 2 per glucose, $0.92 \\times 200/180.16 \\times 2 = 2.04$ mol, or 90 g.',
        '$2.04 \\times 24.5 = 50$ litres of gas per litre of juice — which is why fermenting vessels must be vented.'
      ],
      a: 'About 94 g of ethanol (≈ 12 % by volume) and 50 L of CO₂.'
    },
    {
      title: 'Why sulfate reducers grow slowly',
      q: 'Compare the free energy released when NADH ($E\'^{\\circ} = -0.32$ V) gives two electrons to oxygen (+0.82 V) with sulfate (−0.22 V).',
      steps: [
        'Oxygen: $\\Delta G = -2 \\times 96.5 \\times 1.14 = -220$ kJ/mol.',
        'Sulfate: $\\Delta G = -2 \\times 96.5 \\times 0.10 = -19$ kJ/mol.',
        'More than ten times less energy per electron pair: sulfate reducers pump few protons per NADH and grow slowly, and methanogens get even less.'
      ],
      a: 'About 220 kJ/mol with oxygen against 19 kJ/mol with sulfate.'
    }
  ],
  quiz: [
    { q: 'The main purpose of fermentation for a cell is to…', choices: ['make extra ATP from pyruvate', 'regenerate NAD⁺ so that glycolysis can continue', 'produce oxygen', 'make CO₂'], a: 1, why: 'The reduction of pyruvate (or acetaldehyde) makes no ATP; it reoxidises NADH so that glycolysis, the only ATP source without oxygen, keeps running.' },
    { q: 'How many ATP per glucose does lactate fermentation yield?', answer: 2, why: 'Only the net 2 ATP of glycolysis; converting pyruvate to lactate yields none.' },
    { q: 'Anaerobic respiration and fermentation are the same process.', a: false, why: 'Anaerobic respiration uses an electron transport chain and chemiosmosis with an acceptor such as nitrate or sulfate; fermentation has no chain at all.' },
    { q: 'Yeast growing on glucose is moved from air to no oxygen. To keep making ATP at the same rate, its glucose consumption must rise roughly…', choices: ['2-fold', '5-fold', '15-fold', 'not at all'], a: 2, why: 'About 30 ATP per glucose with oxygen against 2 without: roughly fifteen times as much glucose.' },
    { q: 'Muscle soreness a day or two after hard exercise is caused by lactic acid remaining in the muscles.', a: false, why: 'Lactate is cleared within about an hour. Delayed soreness comes from microscopic damage to muscle fibres and the inflammation of repair.' }
  ],
  problems: [
    { q: 'What is the greatest mass of ethanol that 1 kg of glucose can yield?', answer: 511, unit: 'g', tol: 0.01, steps: ['$1000/180.16 = 5.55$ mol of glucose gives 11.1 mol of ethanol.', '$11.1 \\times 46.07 = 511$ g.'] },
    { q: 'Muscle uses 30 mmol of ATP per minute. If 40 % comes from lactate fermentation and the rest from aerobic respiration at 32 ATP per glucose, how many mmol of glucose are used per minute?', answer: 6.56, tol: 0.02, steps: ['Fermentation: 12 mmol/min of ATP at 2 per glucose = 6 mmol/min.', 'Respiration: 18 mmol/min at 32 per glucose = 0.56 mmol/min.', 'Total 6.56 mmol/min: the 40 % made by fermentation uses over 90 % of the glucose.'] }
  ],
  applications: [
    'Food: yoghurt, cheese, sauerkraut, kimchi, soy sauce, sourdough, and the processing of cocoa and coffee all rely on fermenting microbes.',
    'Bread, beer, wine and fuel ethanol from sugar cane and maize.',
    'Sports science uses the lactate threshold to set training intensities.',
    'Wastewater treatment and biogas plants use anaerobic microbes to turn organic waste into methane.'
  ],
  history: 'Louis Pasteur showed in the 1850s and 1860s that fermentation is the work of living yeast — "life without air" — and that yeast given oxygen uses far less sugar. In 1897 Eduard Buchner fermented sugar with a cell-free extract of yeast, turning fermentation from a mystery of life into chemistry and founding modern biochemistry.',
  sim: ['met-yield', { id: 'met-respiration', params: { oxygen: false } }]
},

/* ================================================================ PHOTOSYNTHESIS */
{
  id: 'photosynthesis', parent: 'photosynthesis-topic', title: 'Photosynthesis', level: 1,
  short: 'Photosynthesis uses light to turn carbon dioxide and water into sugar and oxygen. In chloroplasts, the light reactions split water and make ATP and NADPH; the Calvin cycle spends them to fix CO₂. It feeds almost every food chain and made the oxygen in the air.',
  keywords: ['photosynthesis', 'chloroplast', 'chlorophyll', 'thylakoid', 'stroma', 'light reactions', 'Calvin cycle', 'dark reactions', 'quantum requirement', 'photosynthetic efficiency', 'primary production', 'oxygen', 'autotroph', 'carbon fixation'],
  prereq: ['metabolism-overview', 'mitochondria-chloroplasts', 'physics:photon'],
  related: ['light-reactions', 'calvin-cycle', 'c4-cam', 'limiting-factors', 'carbon-cycle', 'energy-flow', 'plant-tissues', 'transpiration', 'climate-ecosystems', 'physics:em-spectrum'],
  body: `
Photosynthesis turns the energy of light into the chemical energy of sugar. It feeds almost every food chain, filled the atmosphere with oxygen, and laid down the coal, oil and gas we burn. Plants, algae and cyanobacteria together fix about 105 billion tonnes of carbon a year — roughly half on land and half in the oceans — capturing some 130 terawatts, about seven times humanity's entire energy use.

$$\\ce{6CO2 + 12H2O ->[light] C6H12O6 + 6O2 + 6H2O}\\qquad \\Delta G'^{\\circ} = +2870\\ \\mathrm{kJ/mol}$$

Water is written on both sides to show where the atoms go: all the O₂ comes from the twelve water molecules on the left, while the oxygen of the sugar and of the new water comes from CO₂. Energetically photosynthesis is respiration run backwards, uphill, by light — but through quite different chemistry.

### Where: the chloroplast
A leaf mesophyll cell holds 20–100 chloroplasts, each about 5 µm long. Inside, flattened sacs called **thylakoids**, stacked into grana, hold the pigments and electron carriers; around them lies a protein-rich fluid, the **stroma**. Chloroplasts descend from cyanobacteria taken in by an early eukaryotic cell more than 1.5 billion years ago, and they still carry a small genome of about 100–130 genes (see [[mitochondria-chloroplasts]]).

### Two stages
| Stage | Where | In | Out |
|---|---|---|---|
| [[light-reactions|Light reactions]] | thylakoid membranes | light, H₂O, NADP⁺, ADP + Pᵢ | O₂, NADPH, ATP |
| [[calvin-cycle|Calvin cycle]] | stroma | CO₂, ATP, NADPH | sugar (G3P), NADP⁺, ADP + Pᵢ |

The light reactions use light to split water, release O₂ and make ATP and NADPH; the Calvin cycle spends the ATP and NADPH to fix CO₂ into sugar. Older books call the second stage the "dark reactions", but it runs in daylight — several of its enzymes are switched on by light and off in the dark.

### How efficient is it?
Fixing one CO₂ needs four electrons moved from water to NADP⁺, each boosted twice by light, once in each photosystem: at least **8 photons** per CO₂ (and per O₂). Leaves in the best conditions need about 9–10. Red photons at 680 nm carry 176 kJ per mole, so 8 of them bring 1408 kJ to store 478 kJ (a sixth of 2870): about 34 %. Counted from sunlight, much less survives. Only about 48 % of the Sun's energy lies in the 400–700 nm band that chlorophyll uses; some light is reflected or passes through; blue photons lose their extra energy as heat; photorespiration and the plant's own respiration take their share. The theoretical maximum is about 4.6 % of solar energy for C3 plants and 6 % for [[c4-cam|C4 plants]]; crops manage 1–2 % over a growing season. A solar panel converts about 20 % — but it cannot build, repair or copy itself.

> [!fact] Where does the mass of a tree come from? Almost all of it comes out of the air. In carbohydrate, (CH₂O)ₙ, the carbon and the oxygen — 28 of every 30 grams — come from CO₂; only the hydrogen comes from water, and minerals from the soil add a few per cent.

### Photosynthesis and the planet
Cyanobacteria began releasing oxygen more than 2.4 billion years ago, in time filling the air with it (the Great Oxidation Event) and making both aerobic respiration and the ozone layer possible. Today about half of the world's photosynthesis is done by microscopic phytoplankton. On land, the forests of the northern hemisphere draw down CO₂ every summer: the record from Mauna Loa rises and falls by about 6 ppm each year as the land breathes in and out (see [[carbon-cycle]]). How fast any one leaf photosynthesises depends on light, CO₂ and temperature — the subject of [[limiting-factors]].
`,
  ideas: [
    'Photosynthesis uses light to make sugar and O₂ from CO₂ and water: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O.',
    'The O₂ released comes from water; the carbon and oxygen of the sugar come from CO₂.',
    'The light reactions (thylakoids) make ATP, NADPH and O₂; the Calvin cycle (stroma) uses them to fix CO₂.',
    'At least 8 photons are needed per CO₂ fixed; plants convert only a few per cent of sunlight into biomass.',
    'Photosynthesis made Earth\'s oxygen atmosphere and supports almost every food chain.'
  ],
  pitfalls: [
    'The oxygen given off comes from carbon dioxide — It comes from water, as ¹⁸O labelling proved in 1941. The oxygen of CO₂ ends up in sugar and water.',
    'Plants get their mass from the soil — Most of a plant\'s dry mass is carbon and oxygen taken from the air as CO₂; the soil supplies water and a few per cent of minerals.',
    'Plants photosynthesise and animals respire — Plants respire too, day and night, in their mitochondria. In daylight their photosynthesis usually outpaces respiration; at night only respiration continues.'
  ],
  formulas: [
    {
      name: 'Energy efficiency of the photochemistry',
      expr: 'eta = dG/(n*Ep)', tex: '\\eta = \\dfrac{\\Delta G}{n\\,E_p}',
      vars: {
        eta: { name: 'fraction of the absorbed light energy stored', q: 'ratio', unit: '%', tex: '\\eta' },
        dG: { name: 'free energy stored per mole of CO₂ fixed as sugar', q: 'molarenergy', unit: 'kJ/mol', value: 478, tex: '\\Delta G' },
        n: { name: 'photons absorbed per CO₂', value: 8 },
        Ep: { name: 'energy of a mole of photons', q: 'molarenergy', unit: 'kJ/mol', value: 176, tex: 'E_p' }
      },
      note: '478 kJ/mol is a sixth of 2870. A mole of 680 nm photons carries 176 kJ; blue light carries more, but the extra is lost as heat before it is used.',
      stories: {
        eta: 'Fixing one CO₂ stores {dG} and takes {n} photons of {Ep} per mole. What fraction of the light energy is stored?',
        n: 'A leaf stores {dG} per CO₂ with an efficiency of {eta}, using photons of {Ep} per mole. How many photons does it use per CO₂?'
      }
    },
    {
      name: 'Biomass from sunlight',
      expr: 'm = eta*I*A*t/Eb', tex: 'm = \\dfrac{\\eta\\, I\\, A\\, t}{E_b}',
      vars: {
        m: { name: 'dry biomass produced', q: 'mass', unit: 't' },
        eta: { name: 'fraction of solar energy stored in biomass', q: 'ratio', unit: '%', value: 1, tex: '\\eta' },
        I: { name: 'average solar irradiance (day and night)', q: 'intensity', unit: 'W/m²', value: 200 },
        A: { name: 'area', q: 'area', unit: 'ha', value: 1 },
        t: { name: 'time', q: 'time', unit: 'yr', value: 1 },
        Eb: { name: 'energy content of dry biomass', q: 'specificenergy', unit: 'MJ/kg', value: 17.5, tex: 'E_b' }
      },
      note: 'Averaged over day, night and seasons, sunshine at the ground is about 100–250 W/m². Dry plant matter holds about 17–19 MJ/kg.',
      practice: { unknowns: ['m', 'eta', 'A'] },
      stories: {
        m: 'A field receives an average of {I} of sunlight and turns {eta} of it into dry biomass holding {Eb}. How much biomass does {A} produce in {t}?',
        eta: 'A crop yields {m} of dry biomass ({Eb}) from {A} in {t}, under an average sunlight of {I}. What fraction of the solar energy did it capture?'
      }
    }
  ],
  examples: [
    {
      title: 'How efficient can photosynthesis be?',
      q: 'Fixing one CO₂ into sugar stores 478 kJ/mol and needs at least 8 photons. What fraction of the energy of red light (680 nm, 176 kJ/mol) is stored? And with the 10 photons leaves typically need?',
      steps: [
        '8 photons: $8 \\times 176 = 1408$ kJ; $478/1408 = 0.34$.',
        '10 photons: $478/1760 = 0.27$.',
        'So the photochemistry itself stores about a third of the light it absorbs; the big losses from sunlight to biomass come before and after it.'
      ],
      a: 'About 34 % at 8 photons, 27 % at 10.'
    },
    {
      title: 'A kilogram of wood out of thin air',
      q: 'Treat dry wood as cellulose, $(\\ce{C6H10O5})_n$, 162 g per unit. How much CO₂ does a tree take up, and how much O₂ does it release, to make 1 kg of wood?',
      steps: [
        '$1000/162 = 6.17$ mol of glucose units, each needing 6 CO₂: 37.0 mol of CO₂.',
        'CO₂ taken up: $37.0 \\times 44.0 = 1630$ g.',
        'O₂ released: one per CO₂, $37.0 \\times 32.0 = 1190$ g. The difference, with water, makes up the wood.'
      ],
      a: 'About 1.6 kg of CO₂ taken in and 1.2 kg of O₂ given out per kilogram of dry wood.'
    },
    {
      title: 'A hectare of sugar cane',
      q: 'Sugar cane in the tropics receives an average of 200 W/m² and stores 1 % of it as dry biomass (17.5 MJ/kg). How much does a hectare grow in a year?',
      steps: [
        'Energy captured: $0.01 \\times 200 \\times 10^4\\ \\mathrm{m^2} \\times 3.16\\times10^7\\ \\mathrm{s} = 6.3\\times10^{11}$ J.',
        'Biomass: $6.3\\times10^{11}/1.75\\times10^{7} = 3.6\\times10^4$ kg = 36 t.',
        'That is close to the best measured yields of sugar cane, one of the most productive crops.'
      ],
      a: 'About 36 tonnes of dry biomass per hectare per year.'
    }
  ],
  quiz: [
    { q: 'The oxygen released by photosynthesis comes from…', choices: ['carbon dioxide', 'water', 'glucose', 'chlorophyll'], a: 1, why: 'Water is split at photosystem II. Ruben and Kamen proved it in 1941 with the heavy isotope ¹⁸O: labelled water gave labelled O₂, labelled CO₂ did not.' },
    { q: 'Where in the chloroplast does the Calvin cycle take place?', choices: ['thylakoid membrane', 'stroma', 'thylakoid lumen', 'outer envelope'], a: 1, why: 'The Calvin cycle enzymes, Rubisco among them, are dissolved in the stroma; the light reactions sit in the thylakoid membranes.' },
    { q: 'The "dark reactions" of photosynthesis run mainly at night.', a: false, why: 'They run in daylight, using the ATP and NADPH the light reactions are making; several of their enzymes are switched off in the dark.' },
    { q: 'Most of the dry mass of a tree comes from…', choices: ['minerals in the soil', 'water', 'carbon dioxide from the air', 'sunlight'], a: 2, why: 'Carbon and oxygen from CO₂ make up about 28 of every 30 g of carbohydrate; water supplies the hydrogen; soil minerals only a few per cent.' },
    { q: 'What is the minimum number of photons needed to release one molecule of O₂?', answer: 8, why: 'Four electrons must be moved from two water molecules to NADP⁺, and each electron is boosted twice, once by each photosystem.' }
  ],
  problems: [
    { q: 'A mole of blue photons at 450 nm carries how much energy? ($E = hcN_A/\\lambda$)', answer: 266, unit: 'kJ/mol', tol: 0.02, steps: ['$E = 6.626\\times10^{-34} \\times 2.998\\times10^{8} \\times 6.022\\times10^{23}/450\\times10^{-9} = 2.66\\times10^{5}$ J/mol.', 'About 266 kJ/mol — half as much again as red light, but the extra is lost as heat.'] },
    { q: 'A field receives an average of 180 W/m² and converts 0.8 % of it into dry biomass holding 17.5 MJ/kg. How many tonnes of biomass does one hectare make in a year?', answer: 26.0, unit: 't', tol: 0.03, steps: ['$0.008 \\times 180 \\times 10^4 \\times 3.156\\times10^7 = 4.54\\times10^{11}$ J.', '$4.54\\times10^{11}/1.75\\times10^7 = 2.6\\times10^4$ kg = 26 t.'] }
  ],
  applications: [
    'Food security: raising photosynthetic efficiency is a major goal of crop research — speeding up leaves\' recovery from sun protection raised field yields of tobacco by about 15 % in 2016.',
    'Satellites measure the faint fluorescence of chlorophyll to map photosynthesis across the globe.',
    'Forests, grasslands and ocean phytoplankton take up about half of the CO₂ humans emit each year.',
    'Artificial photosynthesis research aims to make fuels from sunlight, water and CO₂.'
  ],
  history: 'Jan Baptist van Helmont grew a willow for five years in the 1640s: it gained about 74 kg while its soil lost only 57 g, and he concluded — half rightly — that it was made of water. Joseph Priestley found in 1771 that a sprig of mint "restored" air in which a candle had burnt out; Jan Ingenhousz showed in 1779 that this needs light and green leaves; Jean Senebier and Nicolas-Théodore de Saussure showed that CO₂ is taken up and water adds to the mass. In the 1930s Cornelis van Niel, studying bacteria that use H₂S instead of water, argued that the O₂ must come from water, and in 1941 Samuel Ruben and Martin Kamen proved it with ¹⁸O.',
  sim: ['met-light-response', 'met-spectrum']
},

{
  id: 'light-reactions', parent: 'photosynthesis-topic', title: 'The light reactions', level: 2,
  short: 'In the thylakoid membranes, pigments absorb light and two photosystems in series — the Z-scheme — move electrons from water to NADP⁺, releasing O₂ and making NADPH. Protons pumped into the thylakoid drive ATP synthase; cyclic electron flow around photosystem I tops up the ATP.',
  keywords: ['light reactions', 'light-dependent reactions', 'photosystem II', 'photosystem I', 'P680', 'P700', 'Z-scheme', 'photolysis', 'oxygen-evolving complex', 'plastoquinone', 'plastocyanin', 'ferredoxin', 'cyclic electron flow', 'chlorophyll', 'carotenoid', 'absorption spectrum', 'action spectrum', 'non-photochemical quenching'],
  prereq: ['photosynthesis', 'oxidative-phosphorylation', 'physics:photon'],
  related: ['calvin-cycle', 'limiting-factors', 'mitochondria-chloroplasts', 'physics:em-spectrum', 'physics:color-vision', 'chemistry:electrode-potentials', 'chemistry:beer-lambert', 'chemistry:atomic-spectra'],
  body: `
The light reactions take place in the thylakoid membranes and do three things: catch light, use its energy to move electrons from water to NADP⁺ — releasing oxygen — and turn part of that energy into a proton gradient that makes ATP.

### Catching light
Chlorophyll *a* absorbs strongly in the blue (peak near 430 nm) and the red (near 662 nm, measured in solution); chlorophyll *b* shifts these to about 453 and 642 nm, and carotenoids absorb from 400 to 500 nm. Green light, in between, is absorbed less well; more of it is reflected and transmitted, which is why leaves look green — though a whole leaf still absorbs about three-quarters of the green light falling on it. The pigments sit in proteins that form **antennae** of a few hundred chlorophylls around each **reaction centre**. An absorbed photon's energy hops from pigment to pigment and reaches the reaction centre within a fraction of a nanosecond, where it drives a **charge separation**: an excited chlorophyll hands an electron to an acceptor. In full sunlight each chlorophyll catches about ten photons a second; pooling a few hundred lets a reaction centre work hundreds of times a second.

The **action spectrum** — the rate of photosynthesis against wavelength — follows the combined **absorption spectra** of the pigments. Theodor Engelmann showed this in 1882 with a prism, a filamentous alga and oxygen-seeking bacteria, which crowded along the alga in the red and the blue.

### Two photosystems in series: the Z-scheme
1. Light excites **P680**, the reaction centre of **photosystem II**; its electron passes via pheophytin to **plastoquinone**, which takes up protons from the stroma.
2. P680⁺ is the strongest oxidant in biology, about +1.2 V. It takes electrons back from water at the **oxygen-evolving complex**, a cluster of four manganese ions and one calcium: $\\ce{2H2O -> O2 + 4H+ + 4e-}$. Four photons must be absorbed, one at a time, before one O₂ is set free.
3. The **cytochrome b₆f** complex passes electrons from plastoquinol to **plastocyanin**, a copper protein, and pumps protons into the thylakoid lumen as it does so.
4. Light excites **P700** in **photosystem I**; its electron passes via iron–sulfur centres to **ferredoxin**, and the enzyme ferredoxin–NADP⁺ reductase makes NADPH.

Plotted against reduction potential the path looks like a Z on its side: two uphill leaps powered by light, each followed by a downhill run.

| Carrier | $E'^{\\circ}$ (V) |
|---|---|
| P680⁺ / P680 | about +1.2 |
| O₂ / H₂O | +0.82 |
| P700⁺ / P700 | +0.48 |
| plastocyanin | +0.37 |
| plastoquinone | about 0.0 to +0.1 |
| NADP⁺ / NADPH | −0.32 |
| ferredoxin | −0.43 |
| excited P700* | about −1.3 |

Overall the electrons climb from water (+0.82 V) to NADPH (−0.32 V): 1.14 V, storing 220 kJ per mole of NADPH — exactly what NADH releases on the way down in mitochondria.

### Protons and ATP
For every O₂ released (four electrons), 4 H⁺ are freed from water inside the lumen and 8 more are carried in by cytochrome b₆f: 12 H⁺ in all. The lumen falls to about pH 5–6 while the stroma rises to about 8, and in chloroplasts the proton-motive force is mostly this ΔpH. The chloroplast ATP synthase has a ring of 14 *c* subunits, 14/3 ≈ 4.7 H⁺ per ATP, so linear flow makes about 12/4.7 = 2.6 ATP per 2 NADPH — **1.29 ATP per NADPH**. The [[calvin-cycle]] needs 3 ATP for every 2 NADPH, 1.5 per NADPH. The shortfall is made good by **cyclic electron flow**: electrons from ferredoxin are sent back to plastoquinone and round through cytochrome b₆f and photosystem I again, pumping protons — ATP with no NADPH and no O₂.

### Too much light
A leaf in summer sun absorbs more light than it can use. The surplus makes reactive oxygen and damages photosystem II, whose D1 protein is destroyed and rebuilt continuously — within an hour or so in bright light. Leaves protect themselves by **non-photochemical quenching**: when the lumen becomes very acidic, the xanthophyll cycle turns violaxanthin into zeaxanthin and the antennae shed the extra energy as heat.
`,
  ideas: [
    'Pigments in antennae absorb light — chlorophylls in the blue and red, carotenoids in the blue-green — and funnel the energy to reaction centres.',
    'Photosystem II and photosystem I act in series (the Z-scheme), each photon boosting an electron once, from water at +0.82 V to NADPH at −0.32 V.',
    'Water is split at the manganese cluster of photosystem II: 2H₂O → O₂ + 4H⁺ + 4e⁻.',
    'Protons pumped into the thylakoid lumen drive ATP synthase; linear flow gives about 1.3 ATP per NADPH, cyclic flow around photosystem I adds ATP only.',
    'The action spectrum of photosynthesis follows the absorption spectra of its pigments.'
  ],
  pitfalls: [
    'Leaves look green because chlorophyll absorbs green light — The opposite: chlorophyll absorbs blue and red best and reflects or transmits relatively more green, though a thick leaf still absorbs most green light.',
    'Photosystem I acts first because it has the lower number — The numbers record the order of discovery. Electrons pass through photosystem II first, then photosystem I.',
    'The light reactions make only NADPH and O₂ — They also make ATP, by chemiosmosis exactly as in mitochondria; cyclic electron flow makes ATP alone.'
  ],
  formulas: [
    {
      name: 'Energy of a mole of photons',
      expr: 'Em = h*c*NA/lambda', tex: 'E_m = \\dfrac{h\\,c\\,N_A}{\\lambda}',
      vars: {
        Em: { name: 'energy per mole of photons', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_m' },
        h: { const: 'h' },
        c: { const: 'c' },
        NA: { const: 'NA' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 680, tex: '\\lambda' }
      },
      note: 'A mole of photons is sometimes called an einstein. Chlorophyll absorbs from about 400 to 700 nm: 171–299 kJ/mol.',
      stories: {
        Em: 'What is the energy of a mole of photons of wavelength {lambda}?',
        lambda: 'A mole of photons carries {Em}. What is their wavelength?'
      }
    },
    {
      name: 'Energy stored by moving electrons uphill',
      expr: 'dG = n*F*dE', tex: '\\Delta G = n\\,F\\,\\Delta E',
      vars: {
        dG: { name: 'free energy stored per mole', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta G' },
        n: { name: 'electrons moved per molecule', int: true, value: 2 },
        F: { const: 'F' },
        dE: { name: 'rise in reduction potential climbed (donor minus acceptor)', q: 'voltage', unit: 'V', value: 1.14, tex: '\\Delta E' }
      },
      note: 'From water (+0.82 V) to NADP⁺ (−0.32 V) the electrons climb 1.14 V: 220 kJ per mole of NADPH, paid for by four photons.',
      stories: {
        dG: 'Light moves {n} electrons per molecule up a potential difference of {dE}. How much free energy is stored per mole?',
        dE: 'Making a mole of a reduced carrier with {n} electrons each stores {dG}. How far up in potential were the electrons lifted?'
      }
    },
    {
      name: 'ATP per NADPH in linear electron flow',
      expr: 'r = nL/(c/3)', tex: 'r = \\dfrac{n_L}{c/3}',
      vars: {
        r: { name: 'ATP made per NADPH' },
        nL: { name: 'protons moved into the lumen per NADPH', value: 6, tex: 'n_L' },
        c: { name: 'c subunits in the chloroplast ATP synthase ring', value: 14, int: true, min: 8, max: 17 }
      },
      note: 'Twelve protons per O₂, two NADPH per O₂: 6 per NADPH. With c = 14 this gives 1.29 ATP per NADPH — short of the 1.5 the Calvin cycle needs.',
      stories: {
        r: 'Linear electron flow moves {nL} protons into the lumen per NADPH, and the ATP synthase ring has {c} subunits. How many ATP are made per NADPH?',
        c: 'A chloroplast makes {r} ATP per NADPH from {nL} protons per NADPH. How many c subunits does its ATP synthase ring have?'
      }
    }
  ],
  examples: [
    {
      title: 'The energy budget of the Z-scheme',
      q: 'Making one NADPH needs 4 photons (two electrons, each boosted twice). How much of the energy of four 680 nm photons is stored in NADPH (220 kJ/mol) and the 1.29 ATP made with it (30.5 kJ/mol each)?',
      steps: [
        'One mole of 680 nm photons: $hcN_A/\\lambda = 0.1196/680\\times10^{-9} = 176$ kJ; four moles: 704 kJ.',
        'Stored: $220 + 1.29 \\times 30.5 = 259$ kJ.',
        '$259/704 = 0.37$: the light reactions keep about 37 % of the light they absorb.'
      ],
      a: 'About 37 %.'
    },
    {
      title: 'Why cyclic electron flow is needed',
      q: 'Fixing one CO₂ in the Calvin cycle needs 3 ATP and 2 NADPH. Linear flow (4 electrons per CO₂) moves 12 H⁺ into the lumen, and the synthase uses 14/3 H⁺ per ATP. How short of ATP is linear flow, and how many electrons must go round the cyclic path, moving 2 H⁺ each, to make it up?',
      steps: [
        'Linear flow: $12/(14/3) = 2.57$ ATP per CO₂ — short by 0.43 ATP.',
        '0.43 ATP needs $0.43 \\times 14/3 = 2$ more protons.',
        'At 2 H⁺ per cycling electron, about one electron in five must go round the cycle (1 cyclic for every 4 linear).'
      ],
      a: 'Short by about 0.43 ATP per CO₂, made up by roughly one cyclic electron per four linear ones.'
    },
    {
      title: 'The pH gradient of a thylakoid',
      q: 'In bright light the lumen is at pH 5.5 and the stroma at pH 8.0, at 25 °C. What proton-motive force does this ΔpH alone give?',
      steps: [
        'At 25 °C, $2.303RT/F = 59.2$ mV per pH unit.',
        '$\\Delta\\mathrm{pH} = 2.5$, so $2.5 \\times 59.2 = 148$ mV.',
        'A small membrane potential adds a few tens of millivolts: in chloroplasts the gradient is mostly chemical, in mitochondria mostly electrical.'
      ],
      a: 'About 148 mV from the pH difference alone.'
    }
  ],
  quiz: [
    { q: 'Which part of the light reactions splits water?', choices: ['Photosystem I', 'Photosystem II', 'Cytochrome b₆f', 'ATP synthase'], a: 1, why: 'The manganese cluster of photosystem II refills P680⁺ with electrons taken from water, releasing O₂ and protons into the lumen.' },
    { q: 'In cyclic electron flow the chloroplast makes…', choices: ['ATP and NADPH', 'ATP only', 'NADPH only', 'O₂ and NADPH'], a: 1, why: 'Electrons from photosystem I return to plastoquinone and cytochrome b₆f, pumping protons; no water is split and no NADP⁺ is reduced.' },
    { q: 'Leaves look green because chlorophyll…', choices: ['absorbs green light best', 'reflects and transmits more green than red or blue', 'emits green light', 'is green only in white light'], a: 1, why: 'Chlorophyll absorbs blue and red strongly, green weakly, so the light reaching our eyes from a leaf is rich in green.' },
    { q: 'What is the energy of a mole of 680 nm photons, in kJ/mol?', answer: 176, unit: 'kJ/mol', why: '$hcN_A/\\lambda = (6.626\\times10^{-34})(2.998\\times10^{8})(6.022\\times10^{23})/(680\\times10^{-9}) = 1.76\\times10^{5}$ J/mol.' },
    { q: 'In chloroplasts, protons are pumped into the thylakoid lumen, which becomes acidic.', a: true, why: 'Water splitting and cytochrome b₆f release protons into the lumen, down to about pH 5–6; they return to the stroma through ATP synthase.' }
  ],
  problems: [
    { q: 'If the chloroplast ATP synthase had a ring of 10 c subunits instead of 14, how many ATP would linear flow make per NADPH (6 protons per NADPH)?', answer: 1.8, tol: 0.01, steps: ['$6/(10/3) = 1.8$ ATP per NADPH — more than the Calvin cycle\'s 1.5, so little cyclic flow would be needed.'] },
    { q: 'How many moles of 680 nm photons carry the same energy as the 220 kJ stored in a mole of NADPH?', answer: 1.25, tol: 0.02, steps: ['One mole of 680 nm photons: 176 kJ.', '$220/176 = 1.25$ — yet 4 are used, because each electron must be boosted twice and each step loses energy to make it fast and one-way.'] }
  ],
  applications: [
    'Many herbicides act here: some block the plastoquinone site of photosystem II, others divert electrons from photosystem I to make destructive reactive oxygen.',
    'Chlorophyll fluorescence meters measure how well photosystem II is working, to detect drought, heat or disease in crops.',
    'LED lighting for greenhouses and vertical farms is tuned to the red and blue that chlorophyll absorbs best.',
    'Chemists building artificial leaves copy the manganese–calcium cluster that splits water.'
  ],
  history: 'Robert Emerson found in 1957 that light beyond 680 nm drives photosynthesis poorly on its own but boosts it when shorter wavelengths are added — the enhancement effect, the first sign of two photosystems. Robin Hill and Fay Bendall drew the Z-scheme in 1960. Pierre Joliot (1969) and Bessel Kok (1970) found that dark-adapted algae release O₂ on every fourth flash of light, revealing water-splitting as a four-step clock. In 1966 André Jagendorf and Ernest Uribe made thylakoids produce ATP in the dark just by moving them from acid to alkaline buffer — strong support for Mitchell\'s chemiosmotic theory.',
  sim: 'met-spectrum'
},

{
  id: 'calvin-cycle', parent: 'photosynthesis-topic', title: 'The Calvin cycle', level: 2,
  short: 'In the stroma, the enzyme Rubisco fixes CO₂ onto ribulose bisphosphate; the product is reduced to the sugar G3P with ATP and NADPH, and most of it is recycled to regenerate the acceptor. Three CO₂ make one G3P for 9 ATP and 6 NADPH. Rubisco is slow and also reacts with oxygen, which leads to wasteful photorespiration.',
  keywords: ['Calvin cycle', 'Calvin–Benson–Bassham cycle', 'Rubisco', 'carbon fixation', 'ribulose bisphosphate', 'RuBP', '3-phosphoglycerate', 'G3P', 'photorespiration', 'oxygenation', 'specificity factor', 'C3 plants', 'sucrose', 'starch', 'thioredoxin', 'Rubisco activase'],
  prereq: ['photosynthesis', 'light-reactions', 'enzymes'],
  related: ['c4-cam', 'limiting-factors', 'enzyme-kinetics', 'carbohydrates', 'phloem-transport', 'carbon-cycle', 'glycolysis'],
  body: `
The Calvin cycle (the Calvin–Benson–Bassham cycle) runs in the stroma of the chloroplast and turns CO₂ into sugar, spending the ATP and NADPH made by the [[light-reactions]]. It is the doorway through which nearly all carbon enters the living world.

### Three phases
1. **Carboxylation.** The enzyme **Rubisco** joins CO₂ to the five-carbon sugar ribulose 1,5-bisphosphate (RuBP). The six-carbon product splits at once into two molecules of **3-phosphoglycerate** (3-PGA), the first stable product — three carbons, hence "C3" photosynthesis.
2. **Reduction.** Each 3-PGA is phosphorylated by ATP and reduced by NADPH to **glyceraldehyde 3-phosphate** (G3P): steps 7 and 6 of [[glycolysis]] run backwards, with NADPH in place of NADH.
3. **Regeneration.** Five G3P (15 carbons) are reshuffled through four-, five-, six- and seven-carbon sugars into three RuBP (15 carbons), and one more ATP per RuBP readies each to take up CO₂ again.

| Per 3 CO₂ fixed | molecules | carbons |
|---|---|---|
| RuBP in | 3 | 15 |
| CO₂ in | 3 | 3 |
| 3-PGA made | 6 | 18 |
| G3P made (6 ATP, 6 NADPH) | 6 | 18 |
| G3P exported as product | 1 | 3 |
| G3P recycled into 3 RuBP (3 ATP) | 5 | 15 |

For each G3P exported the cycle spends **9 ATP and 6 NADPH**; for each glucose (6 CO₂), 18 ATP and 12 NADPH. G3P leaves the chloroplast in exchange for phosphate and becomes sucrose, the sugar carried round the plant in the [[phloem-transport|phloem]]; or it stays and becomes starch, the chloroplast's store for the night.

### Rubisco: slow, confused and everywhere
Rubisco is a poor catalyst. Each active site fixes only about 3 CO₂ a second (carbonic anhydrase manages a million), and its Michaelis constant for CO₂, about 10–15 µM, is above the 5–10 µM of CO₂ in a chloroplast, so it runs well below its top speed (see [[enzyme-kinetics]]). Plants make up for it with sheer quantity: Rubisco can be half the soluble protein of a leaf, and at some 0.7 billion tonnes it is probably the most abundant protein on Earth.

Worse, Rubisco also reacts with O₂. **Oxygenation** of RuBP gives one 3-PGA and one 2-phosphoglycolate, which the plant salvages by **photorespiration** — a detour through chloroplast, peroxisome and mitochondrion that recovers three of every four carbons but releases CO₂ and ammonia and costs ATP. The balance is set by Rubisco's **specificity factor** $S_{c/o}$ (about 80–100 in crop plants) and the gases around it:

$$\\phi = \\frac{v_o}{v_c} = \\frac{[\\ce{O2}]}{S_{c/o}\\,[\\ce{CO2}]}$$

At 25 °C a C3 chloroplast holds about 250 µM O₂ and 8 µM CO₂, so φ ≈ 0.35 — roughly one oxygenation for every three carboxylations — and since each oxygenation loses half a CO₂, about 17 % of the carbon fixed is lost again. Heat makes it worse: S falls, and CO₂ becomes less soluble relative to O₂, so photorespiration passes 25 % in hot weather. Rubisco evolved over 3 billion years ago, when the air was rich in CO₂ and almost free of O₂, and the confusion cost nothing. Plants of hot, dry places have evolved ways round it: [[c4-cam|C4 and CAM photosynthesis]].

### Switched on by light
The cycle's enzymes work only in the light. As protons are pumped into the thylakoids the stroma becomes more alkaline (about pH 8) and richer in Mg²⁺, which activates Rubisco and other enzymes; the small protein thioredoxin, reduced by ferredoxin, switches on several more; and Rubisco activase clears inhibiting sugar phosphates from Rubisco's active sites. At night the cycle stops, so that it does not squander the ATP that respiration is making.
`,
  ideas: [
    'Rubisco fixes CO₂ onto RuBP, giving two 3-phosphoglycerate; ATP and NADPH reduce them to G3P.',
    'Of every six G3P made, one is exported as product and five regenerate three RuBP.',
    'One G3P (3 CO₂) costs 9 ATP and 6 NADPH; one glucose, 18 ATP and 12 NADPH.',
    'Rubisco is slow (about 3 per second) and also reacts with O₂, leading to photorespiration, which loses fixed carbon — more so in heat.',
    'The cycle\'s enzymes are switched on in the light and off in the dark.'
  ],
  pitfalls: [
    'The Calvin cycle makes glucose directly — Its product is the three-carbon sugar G3P, which becomes sucrose or starch; glucose is a bookkeeping unit.',
    'Photorespiration is a kind of respiration that makes ATP — It consumes ATP and releases CO₂: it is a costly salvage pathway for Rubisco\'s mistakes.',
    'Rubisco is a highly efficient enzyme — It is one of the slowest enzymes of central metabolism and confuses O₂ with CO₂; plants compensate by making enormous amounts of it.'
  ],
  formulas: [
    {
      name: 'Oxygenation versus carboxylation',
      expr: 'phi = O/(S*C)', tex: '\\phi = \\dfrac{\\mathrm{[\\ce{O2}]}}{S_{c/o}\\,\\mathrm{[\\ce{CO2}]}}',
      vars: {
        phi: { name: 'oxygenations per carboxylation (vo/vc)', tex: '\\phi' },
        O: { name: 'O₂ concentration in the chloroplast', q: 'concentration', unit: 'µM', value: 250, tex: '\\mathrm{[\\ce{O2}]}' },
        S: { name: 'Rubisco specificity factor', value: 90, tex: 'S_{c/o}' },
        C: { name: 'CO₂ concentration in the chloroplast', q: 'concentration', unit: 'µM', value: 8, tex: '\\mathrm{[\\ce{CO2}]}' }
      },
      note: 'Each oxygenation loses half a CO₂ in photorespiration, so the carbon lost per CO₂ fixed is φ/2.',
      stories: {
        phi: 'A chloroplast holds {O} of O₂ and {C} of CO₂; Rubisco\'s specificity factor is {S}. How many oxygenations are there per carboxylation?',
        C: 'Rubisco (specificity {S}) makes {phi} oxygenations per carboxylation with {O} of O₂ present. What is the CO₂ concentration?'
      }
    },
    {
      name: 'Rubisco-limited rate of carboxylation',
      expr: 'vc = kcat*Et*C/(C + Kc*(1 + O/Ko))',
      tex: 'v_c = \\dfrac{k_{cat}\\,E_t\\,\\mathrm{[\\ce{CO2}]}}{\\mathrm{[\\ce{CO2}]} + K_c\\left(1 + \\mathrm{[\\ce{O2}]}/K_o\\right)}',
      vars: {
        vc: { name: 'carboxylation rate per leaf area', q: false, unit: 'µmol/(m²·s)', tex: 'v_c' },
        kcat: { name: 'Rubisco turnover number', q: 'rate', unit: '1/s', value: 3.3, tex: 'k_{cat}' },
        Et: { name: 'Rubisco active sites per leaf area', q: false, unit: 'µmol/m²', value: 25, tex: 'E_t' },
        C: { name: 'CO₂ concentration in the chloroplast', q: 'concentration', unit: 'µM', value: 8, tex: '\\mathrm{[\\ce{CO2}]}' },
        Kc: { name: 'Michaelis constant for CO₂', q: 'concentration', unit: 'µM', value: 12, tex: 'K_c' },
        O: { name: 'O₂ concentration in the chloroplast', q: 'concentration', unit: 'µM', value: 250, tex: '\\mathrm{[\\ce{O2}]}' },
        Ko: { name: 'inhibition constant for O₂', q: 'concentration', unit: 'µM', value: 350, tex: 'K_o' }
      },
      note: 'Michaelis–Menten kinetics with O₂ as a competitive inhibitor: the heart of the Farquhar–von Caemmerer–Berry model (1980) used in crop and climate models. It applies when light is plentiful and Rubisco limits.',
      practice: { unknowns: ['vc', 'Et', 'C'] },
      stories: {
        vc: 'A leaf has {Et} of Rubisco sites turning over at up to {kcat}; its chloroplasts hold {C} of CO₂ and {O} of O₂ (Kc = {Kc}, Ko = {Ko}). How fast does it fix CO₂?',
        Et: 'A leaf fixes CO₂ at {vc} with {C} of CO₂ and {O} of O₂ in its chloroplasts (kcat = {kcat}, Kc = {Kc}, Ko = {Ko}). How many Rubisco sites does it have per square metre?'
      }
    }
  ],
  examples: [
    {
      title: 'The price of a sugar',
      q: 'Making one glucose in the Calvin cycle costs 18 ATP and 12 NADPH. Using 30.5 kJ/mol for ATP and 220 kJ/mol for NADPH, how much energy is spent to store the 2870 kJ/mol of glucose?',
      steps: [
        '$18 \\times 30.5 + 12 \\times 220 = 549 + 2640 = 3189$ kJ.',
        '$2870/3189 = 0.90$: the cycle itself is about 90 % efficient. The big losses happen earlier, in the light reactions.'
      ],
      a: 'About 3190 kJ spent to store 2870 kJ — roughly 90 % efficient.'
    },
    {
      title: 'How much carbon does photorespiration waste?',
      q: 'At 25 °C a C3 chloroplast holds 250 µM O₂ and 8 µM CO₂, and S = 90. At 35 °C (partly closed stomata, lower solubility) it holds 220 µM O₂ and 6.5 µM CO₂, and S = 70. What fraction of the fixed CO₂ is lost in each case?',
      steps: [
        '25 °C: $\\phi = 250/(90 \\times 8) = 0.35$; loss $= \\phi/2 = 17$ %.',
        '35 °C: $\\phi = 220/(70 \\times 6.5) = 0.48$; loss $= 24$ %.',
        'A hot, dry afternoon costs the leaf a quarter of its catch — the pressure that drove the evolution of C4 plants.'
      ],
      a: 'About 17 % at 25 °C and 24 % at 35 °C.'
    },
    {
      title: 'Why a leaf needs so much Rubisco',
      q: 'A leaf fixes 20 µmol CO₂ m⁻² s⁻¹ with 8 µM CO₂ and 250 µM O₂ in its chloroplasts ($K_c$ = 12 µM, $K_o$ = 350 µM, $k_{cat}$ = 3.3 s⁻¹). How many active sites does it need, and what mass of Rubisco (550 kDa, 8 sites per molecule)?',
      steps: [
        'Saturation: $8/(8 + 12 \\times (1 + 250/350)) = 8/28.6 = 0.28$ — Rubisco runs at 28 % of its top speed.',
        'Sites: $E_t = 20/(3.3 \\times 0.28) = 21.6$ µmol m⁻².',
        'Mass: $21.6\\times10^{-6} \\times 550\\,000/8 = 1.5$ g of Rubisco per square metre of leaf — a large share of the leaf\'s protein.'
      ],
      a: 'About 22 µmol of sites per square metre, some 1.5 g of Rubisco.'
    }
  ],
  quiz: [
    { q: 'To make one G3P from 3 CO₂, the Calvin cycle uses…', choices: ['6 ATP and 6 NADPH', '9 ATP and 6 NADPH', '18 ATP and 12 NADPH', '3 ATP and 2 NADPH'], a: 1, why: 'Reduction takes 6 ATP and 6 NADPH (one each per 3-PGA) and regeneration 3 ATP (one per RuBP). 18 and 12 is the cost of a glucose.' },
    { q: 'The first stable product of CO₂ fixation in C3 plants is…', choices: ['glucose', '3-phosphoglycerate', 'oxaloacetate', 'ribulose bisphosphate'], a: 1, why: 'Rubisco\'s six-carbon product splits at once into two 3-phosphoglycerate; oxaloacetate is the first product in C4 and CAM plants.' },
    { q: 'Of every 6 G3P made by the cycle, how many leave it as product?', answer: 1, why: 'Five G3P (15 C) must be recycled into three RuBP (15 C); only one (3 C) — the three CO₂ fixed — is profit.' },
    { q: 'Rubisco is a fast enzyme that plants need only in small amounts.', a: false, why: 'It turns over only about 3 times a second and confuses O₂ with CO₂, so leaves make huge amounts — up to half their soluble protein.' },
    { q: 'Warming a C3 leaf from 25 °C to 35 °C makes photorespiration…', choices: ['less important', 'more important, because Rubisco\'s specificity falls and CO₂ dissolves less well than O₂', 'disappear', 'unchanged'], a: 1, why: 'Both effects raise vo/vc. That is why C3 plants suffer in heat, and why C4 plants dominate hot grasslands.' }
  ],
  problems: [
    { q: 'A C3 chloroplast holds 6 µM CO₂ and 260 µM O₂; Rubisco\'s specificity factor is 85. How many oxygenations are there per carboxylation?', answer: 0.51, tol: 0.03, steps: ['$\\phi = 260/(85 \\times 6) = 0.51$ — one oxygenation for every two carboxylations.'] },
    { q: 'How many ATP does the Calvin cycle spend to supply the carbon for one molecule of sucrose (C₁₂)?', answer: 36, tol: 0.01, steps: ['12 CO₂ at 3 ATP each (with 2 NADPH each) = 36 ATP and 24 NADPH.'] }
  ],
  applications: [
    'Engineered shortcuts for photorespiration raised the biomass of field-grown tobacco by about 40 % (2019); similar work is under way in food crops.',
    'Greenhouse growers enrich the air to 800–1000 ppm CO₂, which suppresses photorespiration and raises yields.',
    'Researchers are moving CO₂-concentrating compartments from cyanobacteria (carboxysomes) and algae (pyrenoids) into crops.',
    'Rubisco discriminates against the heavy isotope ¹³C, leaving a signature used in ecology, food authentication and studies of past climates.'
  ],
  history: 'Melvin Calvin, Andrew Benson and James Bassham worked out the cycle at Berkeley between 1946 and 1953. They fed radioactive ¹⁴CO₂ to the green alga Chlorella in a thin flask nicknamed the "lollipop", killed samples in hot alcohol after a few seconds, and separated the labelled compounds by two-dimensional paper chromatography: after five seconds most of the label was already in 3-phosphoglycerate. When the light was switched off, 3-phosphoglycerate piled up and ribulose bisphosphate vanished; when the CO₂ was cut off, the reverse — the experiments that closed the cycle. Calvin received the 1961 Nobel Prize in Chemistry.',
  sim: ['met-calvin', 'met-c3c4cam']
},

{
  id: 'c4-cam', parent: 'photosynthesis-topic', title: 'C4 and CAM plants', level: 2,
  short: 'C4 and CAM plants avoid photorespiration by concentrating CO₂ around Rubisco. C4 plants fix CO₂ into four-carbon acids in mesophyll cells and release it in bundle-sheath cells; CAM plants fix it at night and use it by day behind closed stomata. Both pay extra ATP and save water.',
  keywords: ['C4 photosynthesis', 'CAM', 'crassulacean acid metabolism', 'Kranz anatomy', 'bundle sheath', 'mesophyll', 'PEP carboxylase', 'photorespiration', 'Hatch–Slack pathway', 'water-use efficiency', 'maize', 'sugar cane', 'cactus', 'pineapple', 'carbon isotopes'],
  prereq: ['calvin-cycle', 'photosynthesis', 'transpiration'],
  related: ['limiting-factors', 'plant-tissues', 'biomes', 'climate-ecosystems', 'plant-diversity', 'natural-selection'],
  body: `
In hot, dry, bright places a C3 plant is caught in a trap. To save water it half-closes its stomata; CO₂ inside the leaf falls while the O₂ from photosynthesis builds up; and heat lowers Rubisco's preference for CO₂. Photorespiration can then waste a quarter or more of the carbon fixed (see [[calvin-cycle]]). Two groups of plants escape the trap by concentrating CO₂ around Rubisco — **C4** plants in space, **CAM** plants in time.

### C4: a CO₂ pump between two kinds of cell
1. In the outer **mesophyll** cells, CO₂ (as hydrogencarbonate, HCO₃⁻) is fixed by **PEP carboxylase** onto the three-carbon phosphoenolpyruvate. The product, oxaloacetate, has four carbons — hence "C4". PEP carboxylase does not react with O₂ and binds its substrate tightly, so it works well even at low CO₂.
2. The C4 acid, as malate or aspartate, diffuses into the **bundle-sheath** cells arranged in a ring round each vein — **Kranz anatomy**, from the German for wreath.
3. There it is decarboxylated. The released CO₂ builds up to about ten times its level in a C3 chloroplast, Rubisco works close to saturation, and photorespiration almost vanishes.
4. The three-carbon remnant returns to the mesophyll and is turned back into PEP, at a cost of two ATP equivalents.

The pump raises the cost to about 5 ATP and 2 NADPH per CO₂, against 3 and 2 in C3 plants. In cool weather, when photorespiration is modest, the price is not worth paying and C3 plants do better; above about 25–30 °C in bright light C4 plants win. With Rubisco saturated they need less of it, and so less nitrogen, and they can photosynthesise with their stomata further closed, losing less water. Only about 3 % of flowering-plant species are C4, yet they do nearly a quarter of the photosynthesis on land: maize, sugar cane, sorghum, millet and many tropical grasses. C4 photosynthesis has evolved independently more than 60 times, mostly in the last 30 million years as the CO₂ of the air fell — a striking case of [[natural-selection|convergent evolution]].

### CAM: a CO₂ pump across day and night
**Crassulacean acid metabolism**, named after the stonecrop family, separates the two steps in time. At night, when the air is cool and humid, the stomata open; PEP carboxylase fixes CO₂ and the malic acid made is stored in the large vacuoles — the leaves taste sour by dawn. By day the stomata close tight; malate is decarboxylated and its CO₂, trapped behind closed stomata, feeds the Calvin cycle in the light. Cacti, agaves, pineapple and many orchids and bromeliads use CAM — about 6 % of plant species. They lose very little water, but they grow slowly, because a day's photosynthesis is limited by how much acid the vacuoles can hold overnight. Some plants switch to CAM only when drought comes.

| | C3 | C4 | CAM |
|---|---|---|---|
| First carboxylase | Rubisco | PEP carboxylase | PEP carboxylase, at night |
| First product | 3-PGA (3 C) | oxaloacetate (4 C) | oxaloacetate (4 C) |
| Steps separated | not at all | in space: mesophyll and bundle sheath | in time: night and day |
| Photorespiration | high in heat | very low | low |
| ATP per CO₂ | 3, plus photorespiration | about 5 | about 6 |
| Best temperatures | 15–25 °C | 30–40 °C | hot days, cool nights |
| Water lost per gram of dry matter | about 400–900 g | about 250–350 g | about 50–100 g |
| Examples | wheat, rice, soya, trees | maize, sugar cane, sorghum | cacti, pineapple, agave |

> [!tip] Carbon isotopes tell the pathways apart. Rubisco discriminates against the heavier isotope ¹³C much more than PEP carboxylase does, so C3 plant tissue has a δ¹³C of about −27 ‰ and C4 tissue about −13 ‰. The signature passes into the animals, and people, that eat them — which is how archaeologists trace the spread of maize farming.
`,
  ideas: [
    'C4 and CAM plants concentrate CO₂ around Rubisco, suppressing photorespiration.',
    'C4 plants separate the steps in space: PEP carboxylase in mesophyll cells, Rubisco in bundle-sheath cells (Kranz anatomy).',
    'CAM plants separate them in time: CO₂ is fixed into malic acid at night and released to Rubisco by day behind closed stomata.',
    'The CO₂ pump costs extra ATP, so C4 pays off in heat and bright light, while C3 does better in cool climates.',
    'Both save water: CAM plants lose five to ten times less water per gram of growth than C3 plants.'
  ],
  pitfalls: [
    'C4 plants do not use the Calvin cycle — They do; the C4 pathway only delivers concentrated CO₂ to Rubisco and the Calvin cycle in the bundle sheath.',
    'C4 photosynthesis is always better — It costs about two extra ATP per CO₂; in cool, dim or CO₂-rich conditions C3 plants photosynthesise as well or better.',
    'CAM plants photosynthesise at night — They take up CO₂ at night, but the light reactions and the Calvin cycle still run by day.'
  ],
  formulas: [
    {
      name: 'Carbon lost to photorespiration',
      expr: 'L = O/(2*S*C)', tex: 'L = \\dfrac{\\mathrm{[\\ce{O2}]}}{2\\,S_{c/o}\\,\\mathrm{[\\ce{CO2}]}}',
      vars: {
        L: { name: 'CO₂ released by photorespiration per CO₂ fixed by Rubisco', q: 'ratio', unit: '%' },
        O: { name: 'O₂ concentration around Rubisco', q: 'concentration', unit: 'µM', value: 250, tex: '\\mathrm{[\\ce{O2}]}' },
        S: { name: 'Rubisco specificity factor', value: 90, tex: 'S_{c/o}' },
        C: { name: 'CO₂ concentration around Rubisco', q: 'concentration', unit: 'µM', value: 8, tex: '\\mathrm{[\\ce{CO2}]}' }
      },
      note: 'Each oxygenation releases half a CO₂. A C4 bundle sheath raises [CO₂] about tenfold, cutting the loss tenfold.',
      stories: {
        L: 'Rubisco (specificity {S}) works with {C} of CO₂ and {O} of O₂. What fraction of the fixed carbon is lost again by photorespiration?',
        C: 'In the bundle sheath of a C4 leaf the photorespiratory loss is only {L}, with {O} of O₂ and a Rubisco specificity of {S}. What CO₂ concentration does the pump maintain?'
      }
    },
    {
      name: 'Water-use efficiency of a leaf',
      expr: 'W = Ca*(1 - chi)*P/(1.6*D)', tex: 'W = \\dfrac{C_a\\,(1 - \\chi)\\,P}{1.6\\,D}',
      vars: {
        W: { name: 'CO₂ fixed per water lost, mole for mole', q: 'ratio', unit: '‰' },
        Ca: { name: 'CO₂ in the air (mole fraction)', q: 'ratio', unit: 'ppm', value: 420, tex: 'C_a' },
        chi: { name: 'CO₂ inside the leaf relative to outside, Ci/Ca', value: 0.7, min: 0, max: 1, tex: '\\chi' },
        P: { name: 'air pressure', q: 'pressure', unit: 'kPa', value: 101.3 },
        D: { name: 'water vapour pressure difference from leaf to air', q: 'pressure', unit: 'kPa', value: 1.5 }
      },
      note: 'CO₂ enters and water vapour leaves through the same stomata; water diffuses 1.6 times faster. χ is about 0.7 in C3 leaves and 0.4 in C4 leaves, whose pump draws CO₂ down harder.',
      practice: { unknowns: ['W', 'chi', 'D'] },
      stories: {
        W: 'A leaf in air with {Ca} of CO₂ keeps its internal CO₂ at a fraction {chi} of the outside; the vapour pressure difference is {D} at an air pressure of {P}. How much CO₂ does it fix per mole of water lost?',
        chi: 'A leaf fixes {W} of CO₂ per mole of water in air with {Ca} of CO₂, with a vapour pressure difference of {D} at {P}. What is its ratio of internal to external CO₂?'
      }
    }
  ],
  examples: [
    {
      title: 'Photorespiration in C3 and C4 leaves',
      q: 'Rubisco has S = 90 and sees 250 µM O₂. In a C3 chloroplast CO₂ is 8 µM; in a C4 bundle sheath the pump raises it to 80 µM. Compare the photorespiratory losses.',
      steps: [
        'C3: $L = 250/(2 \\times 90 \\times 8) = 0.17$, or 17 %.',
        'C4: $L = 250/(2 \\times 90 \\times 80) = 0.017$, or 1.7 %.',
        'The pump spends about 2 extra ATP per CO₂ to save most of that 17 % — worth it when heat raises the C3 loss further.'
      ],
      a: 'About 17 % in C3 against under 2 % in C4.'
    },
    {
      title: 'Water use in maize and wheat',
      q: 'Air holds 420 ppm CO₂ at 101.3 kPa; the vapour pressure difference is 1.5 kPa. Wheat (C3) keeps χ = 0.7, maize (C4) χ = 0.4. How much water does each lose per CO₂ fixed?',
      steps: [
        'Wheat: $W = 420\\times10^{-6} \\times 0.3 \\times 101.3/(1.6 \\times 1.5) = 5.3\\times10^{-3}$: 188 mol of water per mol of CO₂.',
        'Maize: $W = 420\\times10^{-6} \\times 0.6 \\times 101.3/2.4 = 10.6\\times10^{-3}$: 94 mol of water per mol of CO₂.',
        'Maize fixes twice as much carbon per drop. (Whole plants lose more, through night-time leaks, respiration and hot afternoons.)'
      ],
      a: 'About 188 mol of water per mol of CO₂ for wheat, 94 for maize.'
    },
    {
      title: 'The overnight acid store of a CAM plant',
      q: 'A CAM leaf of 1 kg fresh mass per square metre (90 % water) builds up 150 mM malic acid in its cell sap overnight; each malate yields one CO₂ by day. How much CO₂ is that per square metre, compared with a C3 leaf fixing 15 µmol m⁻² s⁻¹ for 10 hours?',
      steps: [
        'CAM: $0.9\\ \\mathrm{L} \\times 0.150\\ \\mathrm{mol/L} = 0.135$ mol CO₂ per square metre per day.',
        'C3: $15\\times10^{-6} \\times 36\\,000 = 0.54$ mol per square metre per day.',
        'The CAM plant fixes about a quarter as much: its vacuoles set the ceiling, which is why cacti grow slowly.'
      ],
      a: 'About 0.14 mol/m² a day for CAM against 0.54 for a C3 leaf.'
    }
  ],
  quiz: [
    { q: 'In C4 plants, the enzyme that first fixes carbon in the mesophyll cells is…', choices: ['Rubisco', 'PEP carboxylase', 'carbonic anhydrase', 'pyruvate kinase'], a: 1, why: 'PEP carboxylase fixes HCO₃⁻ onto phosphoenolpyruvate. Carbonic anhydrase only interconverts CO₂ and HCO₃⁻; Rubisco works later, in the bundle sheath.' },
    { q: 'CAM plants open their stomata…', choices: ['by day', 'at night', 'never', 'only in rain'], a: 1, why: 'Opening in the cool, humid night loses far less water; the CO₂ is stored as malic acid until daylight.' },
    { q: 'Why do C3 plants often outcompete C4 plants in cool climates?', choices: ['C4 plants cannot grow below 20 °C', 'The C4 pump costs extra ATP, which is not repaid when photorespiration is low', 'C3 plants have more chlorophyll', 'C4 plants need more water'], a: 1, why: 'Photorespiration is modest in the cool, so the two extra ATP per CO₂ are wasted; C3 plants then have the higher quantum yield.' },
    { q: 'C4 photosynthesis evolved once, and all C4 plants inherited it from one ancestor.', a: false, why: 'It arose independently more than 60 times, in grasses, sedges and several families of flowering plants — convergent evolution under falling CO₂.' },
    { q: 'A C4 bundle sheath holds ten times more CO₂ than a C3 chloroplast, with the same O₂. By what factor is the photorespiratory loss reduced?', answer: 10, why: 'The loss is proportional to [O₂]/[CO₂]; ten times the CO₂ gives a tenth of the loss.' }
  ],
  problems: [
    { q: 'In a C3 leaf at 35 °C, Rubisco has S = 70 and sees 6 µM CO₂ and 220 µM O₂. What percentage of the fixed CO₂ is lost to photorespiration?', answer: 26.2, unit: '%', tol: 0.02, steps: ['$L = 220/(2 \\times 70 \\times 6) = 0.262$ = 26 %.'] },
    { q: 'A leaf in air with 420 ppm CO₂ at 101.3 kPa keeps χ = 0.4, and the vapour pressure difference is 2.0 kPa. How many moles of water does it lose per mole of CO₂ fixed?', answer: 125, tol: 0.02, steps: ['$W = 420\\times10^{-6} \\times 0.6 \\times 101.3/(1.6 \\times 2.0) = 7.98\\times10^{-3}$.', '$1/W = 125$ mol of water per mol of CO₂.'] }
  ],
  applications: [
    'Maize, sugar cane and sorghum — C4 crops — dominate tropical agriculture and fuel-ethanol production.',
    'The C4 Rice Project aims to engineer Kranz anatomy and the C4 pump into rice, which could raise yields substantially.',
    'Pineapple, agave (for fibre and spirits) and prickly pear are CAM crops for dry land.',
    'Carbon isotopes reveal whether ancient people and animals ate C3 or C4 plants, tracing the spread of maize farming.'
  ],
  history: 'In the 1960s Yuri Karpilov in the USSR (maize) and Hugo Kortschak in Hawaii (sugar cane) found radioactive carbon appearing first in four-carbon acids, not in 3-phosphoglycerate. Marshall Hatch and Roger Slack in Australia worked out the pathway between 1966 and 1970, and it is also called the Hatch–Slack pathway. The acid rhythm of CAM had been noticed much earlier: in 1815 Benjamin Heyne reported that the leaves of Bryophyllum in India tasted sour in the morning and bland by afternoon.',
  sim: 'met-c3c4cam'
},

{
  id: 'limiting-factors', parent: 'photosynthesis-topic', title: 'Limiting factors of photosynthesis', level: 2,
  short: 'The rate of photosynthesis is set by whichever condition is in shortest supply — light, CO₂ or temperature. A leaf\'s rate rises with light and then levels off at saturation; raising CO₂ or warming the leaf lifts the plateau. At the compensation point photosynthesis just balances respiration.',
  keywords: ['limiting factor', 'Blackman', 'light-response curve', 'light saturation', 'compensation point', 'quantum yield', 'CO2 enrichment', 'Q10', 'temperature optimum', 'law of the minimum', 'pondweed experiment', 'inverse square law'],
  prereq: ['photosynthesis', 'calvin-cycle', 'enzyme-kinetics'],
  related: ['c4-cam', 'light-reactions', 'transpiration', 'plant-nutrition', 'climate-ecosystems', 'experimental-design', 'physics:light-intensity', 'math:rational-functions'],
  body: `
How fast a leaf photosynthesises depends on several conditions at once — light, the concentration of CO₂, temperature, and behind them water and nutrients. Which of them matters at a given moment depends on which is in shortest supply.

### Blackman's principle
In 1905 Frederick Blackman proposed that when a process depends on several factors, its rate is set by the one in shortest supply — the **limiting factor**. Give a leaf in dim light more light and photosynthesis speeds up; keep adding light and the rate levels off, because now CO₂ or temperature is holding it back. Raise the CO₂ and the plateau rises: the light-response curve climbs higher before it flattens. Blackman drew curves with sharp corners. Real leaves bend smoothly near the corner, because different chloroplasts and different steps become limiting at slightly different points — near the shoulder, several factors limit together.

### Light
In darkness a leaf gives out CO₂ from respiration, typically 0.5–2 µmol m⁻² s⁻¹. As light increases, gross photosynthesis rises until it just balances respiration at the **light compensation point**, where net gas exchange is zero — about 10–40 µmol photons m⁻² s⁻¹ for a sun leaf, 1–2 % of full sunlight (about 2000). In dim light the rate is proportional to light, with a slope — the **quantum yield** — of about 0.05 CO₂ per photon for a C3 leaf in air. At higher light the curve bends, and a C3 sun leaf is **light-saturated** at roughly 500–1000, well below full sun. A simple description is a rectangular hyperbola minus respiration:

$$P = \\frac{P_{\\max}\\,I}{K + I} - R_d$$

| Leaf | $P_{\\max}$ (µmol CO₂ m⁻² s⁻¹) | light compensation (µmol photons m⁻² s⁻¹) | light saturation |
|---|---|---|---|
| shade leaf, forest floor | 3–8 | 2–10 | 100–300 |
| sun leaf, C3 (wheat) | 20–35 | 20–40 | 800–1500 |
| C4 (maize) | 40–60 | 30–50 | often not reached in full sun |

### Carbon dioxide
The air's 420 ppm of CO₂ does not saturate Rubisco in a C3 leaf: doubling it raises the light-saturated rate of many C3 crops by 30–50 % in the short term, and greenhouse growers enrich the air to 800–1000 ppm for that reason. Below about 40–50 ppm — the **CO₂ compensation point** — a C3 leaf loses more CO₂ by photorespiration and respiration than it fixes. C4 plants, with their CO₂ pump, are nearly saturated at today's levels and have compensation points below 10 ppm (see [[c4-cam]]).

### Temperature
The Calvin cycle's enzymes speed up with temperature, roughly doubling for each 10 °C (a **Q₁₀** of about 2), up to an optimum — about 20–30 °C for C3 plants and 30–40 °C for C4 — above which photorespiration grows, enzymes and membranes are damaged and the rate falls steeply. The capture of light itself hardly depends on temperature, and that was one of Blackman's clues: in dim light, warming a leaf changes little; in bright light, where the enzymes limit, it matters a great deal.

> [!tip] The classic school experiment: a sprig of pondweed (*Elodea* or *Cabomba*) in water with a little sodium hydrogencarbonate as a CO₂ source, a lamp at several distances, and a count of the oxygen bubbles each minute. For a small lamp the light falls with the square of the distance, so moving it from 10 to 20 cm quarters the light; a beaker of water between lamp and plant stops the lamp's heat from changing the temperature as well.

### Water and nutrients
A leaf short of water closes its stomata, and CO₂ becomes limiting even in full light. Nitrogen is needed for Rubisco and the chlorophyll-binding proteins, magnesium sits at the centre of every chlorophyll, and iron is needed to make it: short of any of them, leaves yellow and photosynthesis falls (see [[plant-nutrition]]). Justus von Liebig made the same point for crop nutrients in 1840 — the *law of the minimum*.
`,
  ideas: [
    'The rate of photosynthesis is limited by the factor in shortest supply — light, CO₂ or temperature (Blackman, 1905).',
    'Net photosynthesis rises with light, crosses zero at the light compensation point and levels off at light saturation.',
    'Raising CO₂ or temperature lifts the light-saturated plateau, but has little effect in dim light.',
    'Temperature speeds up the Calvin cycle enzymes (Q₁₀ ≈ 2) up to an optimum, beyond which the rate falls.',
    'Real leaves show co-limitation near the shoulder of the curve rather than Blackman\'s sharp corner.'
  ],
  pitfalls: [
    'More light always means faster photosynthesis — Only below saturation. Above it, CO₂ or the enzymes limit, and very strong light can even damage photosystem II.',
    'At the compensation point photosynthesis stops — It is running, but only as fast as respiration, so net gas exchange is zero.',
    'Warming always speeds photosynthesis — Only up to the optimum; beyond it photorespiration and damage make the rate fall, often steeply.'
  ],
  derivation: {
    title: 'The light compensation point',
    steps: [
      { text: 'At the compensation point net photosynthesis is zero:', tex: '\\frac{P_{\\max} I_c}{K + I_c} - R_d = 0' },
      { text: 'Multiply out by $K + I_c$:', tex: 'P_{\\max} I_c = R_d K + R_d I_c' },
      { text: 'Collect the terms in $I_c$:', tex: 'I_c = \\frac{K R_d}{P_{\\max} - R_d}' },
      { text: 'When respiration is small compared with $P_{\\max}$, $I_c \\approx K R_d/P_{\\max}$: shade leaves, with low respiration, reach a positive balance in very dim light.' }
    ]
  },
  formulas: [
    {
      name: 'Light-response curve',
      expr: 'P = Pmax*I/(K + I) - R', tex: 'P = \\dfrac{P_{\\max}\\,I}{K + I} - R_d',
      vars: {
        P: { name: 'net photosynthesis (CO₂)', q: false, unit: 'µmol/(m²·s)', signed: true },
        Pmax: { name: 'gross photosynthesis at light saturation', q: false, unit: 'µmol/(m²·s)', value: 25, tex: 'P_{\\max}' },
        I: { name: 'light (photon flux density, 400–700 nm)', q: false, unit: 'µmol/(m²·s)', value: 500 },
        K: { name: 'light giving half the maximum gross rate', q: false, unit: 'µmol/(m²·s)', value: 300 },
        R: { name: 'dark respiration', q: false, unit: 'µmol/(m²·s)', value: 1.5, tex: 'R_d' }
      },
      note: 'P, Pmax and Rd are in µmol CO₂ per square metre of leaf per second; I and K in µmol photons. Full sunlight is about 2000.',
      practice: { unknowns: ['P', 'I', 'Pmax'] },
      stories: {
        P: 'A leaf with a light-saturated gross rate of {Pmax}, a half-saturation light of {K} and respiration of {R} is lit with {I}. What is its net photosynthesis?',
        I: 'A leaf ({Pmax} at saturation, K = {K}, respiration {R}) photosynthesises at a net {P}. How much light is it getting?'
      }
    },
    {
      name: 'Light compensation point',
      expr: 'Ic = K*R/(Pmax - R)', tex: 'I_c = \\dfrac{K\\,R_d}{P_{\\max} - R_d}',
      vars: {
        Ic: { name: 'light at which net photosynthesis is zero', q: false, unit: 'µmol/(m²·s)', tex: 'I_c' },
        K: { name: 'light giving half the maximum gross rate', q: false, unit: 'µmol/(m²·s)', value: 300 },
        R: { name: 'dark respiration', q: false, unit: 'µmol/(m²·s)', value: 1.5, tex: 'R_d' },
        Pmax: { name: 'gross photosynthesis at light saturation', q: false, unit: 'µmol/(m²·s)', value: 25, tex: 'P_{\\max}' }
      },
      note: 'Follows from setting P = 0 in the light-response curve.',
      stories: {
        Ic: 'A leaf has a light-saturated gross rate of {Pmax}, half-saturation at {K} and dark respiration of {R}. At what light does it just break even?',
        R: 'A leaf with Pmax = {Pmax} and K = {K} breaks even at {Ic}. What is its dark respiration?'
      }
    },
    {
      name: 'Temperature and rate (Q₁₀)',
      expr: 'R2 = R1*Q10^((T2 - T1)/10)', tex: 'R_2 = R_1\\,Q_{10}^{(T_2 - T_1)/10}',
      vars: {
        R2: { name: 'rate at the new temperature', q: false, unit: 'µmol/(m²·s)', tex: 'R_2' },
        R1: { name: 'rate at the first temperature', q: false, unit: 'µmol/(m²·s)', value: 10, tex: 'R_1' },
        Q10: { name: 'factor per 10 °C', value: 2, tex: 'Q_{10}' },
        T2: { name: 'new temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_2' },
        T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 15, tex: 'T_1' }
      },
      note: 'Holds below the optimum, when enzymes limit. Q₁₀ is about 2 for enzyme-limited photosynthesis and respiration, nearer 1 for light-limited photosynthesis.',
      practice: { unknowns: ['R2', 'Q10', 'T2'] },
      stories: {
        R2: 'A light-saturated leaf photosynthesises at {R1} at {T1}. With Q₁₀ = {Q10}, what rate do you expect at {T2}?',
        Q10: 'A leaf\'s rate rises from {R1} at {T1} to {R2} at {T2}. What is its Q₁₀?'
      }
    }
  ],
  examples: [
    {
      title: 'A leaf on a sunny and a cloudy day',
      q: 'A sun leaf has $P_{\\max}$ = 25, K = 300 and $R_d$ = 1.5 (µmol m⁻² s⁻¹). Find its net rate in sunshine (1500 µmol photons m⁻² s⁻¹) and under cloud (150).',
      steps: [
        'Sun: $25 \\times 1500/1800 - 1.5 = 20.8 - 1.5 = 19.3$.',
        'Cloud: $25 \\times 150/450 - 1.5 = 8.3 - 1.5 = 6.8$.',
        'Ten times less light gives only about three times less photosynthesis: in sunshine the leaf is near saturation and much of the light is surplus.'
      ],
      a: 'About 19.3 in sun and 6.8 under cloud (µmol CO₂ m⁻² s⁻¹).'
    },
    {
      title: 'Sun leaf and shade leaf',
      q: 'Compare the light compensation points of the sun leaf above and a shade leaf with $P_{\\max}$ = 6, K = 100 and $R_d$ = 0.3.',
      steps: [
        'Sun leaf: $I_c = 300 \\times 1.5/(25 - 1.5) = 19$ µmol m⁻² s⁻¹.',
        'Shade leaf: $I_c = 100 \\times 0.3/(6 - 0.3) = 5.3$ µmol m⁻² s⁻¹.',
        'The shade leaf breaks even in a quarter of the light, thanks to its low respiration — but it saturates early and gains little from a sunfleck.'
      ],
      a: 'About 19 for the sun leaf and 5 for the shade leaf.'
    },
    {
      title: 'Pondweed and the inverse square law',
      q: 'A pondweed gives 40 bubbles a minute with a small lamp at 10 cm. The lamp is moved to 20 cm. How does the light change, and what might the bubble rate do?',
      steps: [
        'For a point source, intensity $\\propto 1/d^2$: doubling the distance gives a quarter of the light.',
        'If the plant was light-limited, the rate would fall to about 10 bubbles a minute; if it was near saturation at 10 cm, it would fall much less.',
        'The shape of rate against $1/d^2$ therefore shows whether light was the limiting factor.'
      ],
      a: 'The light falls to a quarter; the rate falls by up to four times, less if the plant was near saturation.'
    }
  ],
  quiz: [
    { q: 'A plant in bright light at 400 ppm CO₂ and 15 °C does not photosynthesise faster when the light is increased further. The most likely limiting factor is…', choices: ['light', 'CO₂ or temperature', 'chlorophyll', 'oxygen'], a: 1, why: 'The leaf is light-saturated, so light is no longer limiting; the plateau is set by CO₂ supply or by the enzymes, which are slow at 15 °C.' },
    { q: 'At the light compensation point…', choices: ['photosynthesis stops', 'photosynthesis equals respiration, so net gas exchange is zero', 'the leaf is light-saturated', 'the stomata close'], a: 1, why: 'Gross photosynthesis still runs, but only fast enough to replace the CO₂ released by respiration.' },
    { q: 'A small lamp is moved from 30 cm to 15 cm from a pondweed. By what factor does the light intensity increase?', answer: 4, why: 'Intensity varies as 1/d²: halving the distance quadruples it.' },
    { q: 'Raising the temperature always speeds up photosynthesis.', a: false, why: 'Only up to the optimum (about 20–30 °C for C3 plants); above it photorespiration rises and enzymes and membranes are damaged.' },
    { q: 'With Q₁₀ = 2, a leaf photosynthesises at 8 µmol m⁻² s⁻¹ at 25 °C. What rate do you expect at 15 °C (in µmol m⁻² s⁻¹)?', answer: 4, why: 'Ten degrees cooler halves the rate: 8/2 = 4.' }
  ],
  problems: [
    { q: 'A leaf has $P_{\\max}$ = 30, K = 400 and $R_d$ = 2 µmol m⁻² s⁻¹. What is its net photosynthesis at 800 µmol photons m⁻² s⁻¹?', answer: 18, tol: 0.01, steps: ['$30 \\times 800/1200 - 2 = 20 - 2 = 18$ µmol CO₂ m⁻² s⁻¹.'] },
    { q: 'For the same leaf, what is the light compensation point (µmol photons m⁻² s⁻¹)?', answer: 28.6, tol: 0.02, steps: ['$I_c = 400 \\times 2/(30 - 2) = 28.6$.'] }
  ],
  applications: [
    'Greenhouses pay for CO₂ enrichment, supplementary lighting or heating only when that factor is the one limiting growth.',
    'Crop and climate models predict yields and the land carbon sink from the responses of leaves to light, CO₂ and temperature.',
    'Shade-tolerant tree seedlings survive on the forest floor thanks to their low compensation points.',
    'In dense algal cultures for food or biofuel, light becomes limiting within a few centimetres of the surface as the cells shade each other.'
  ],
  history: 'Frederick Frost Blackman stated the principle of limiting factors in 1905, from experiments in which light, CO₂ and temperature were raised one at a time. Justus von Liebig had made a similar point for soil nutrients in 1840 — the law of the minimum, often pictured as a barrel whose water level is set by its shortest stave. Later measurements showed that real curves bend smoothly and that factors often limit together.',
  sim: 'met-light-response'
}

);
