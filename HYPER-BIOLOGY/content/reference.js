/* HYPER-BIOLOGY · content/reference.js — the reference concept for biology authors:
 * its depth, tone, numbers and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'enzyme-kinetics', parent: 'enzymes-topic', title: 'Enzyme kinetics: Michaelis and Menten', level: 2,
  short: 'How fast an enzyme works depends on how much substrate it has: in proportion at first, then levelling off at a maximum as every enzyme molecule is kept busy. Two numbers describe it — the maximum rate Vmax and the Michaelis constant Km, the substrate concentration at half that rate.',
  keywords: ['enzyme kinetics', 'Michaelis–Menten', 'Km', 'Vmax', 'kcat', 'turnover number', 'saturation', 'Lineweaver–Burk', 'catalytic efficiency', 'initial rate'],
  prereq: ['enzymes', 'protein-structure', 'chemistry:rate-laws'],
  related: ['enzyme-inhibition', 'enzyme-regulation', 'atp-energy', 'chemistry:catalysis', 'chemistry:enzyme-kinetics', 'pharmaceutics:nonlinear-pk', 'medicine:how-drugs-work'],
  body: `
An enzyme is a protein that binds a particular molecule — its **substrate** — in a pocket called the active site, converts it into **product**, lets go and starts again. The binding step is the key to its kinetics. When substrate is scarce, most enzyme molecules sit idle waiting for one to arrive, and doubling the substrate doubles the rate. When substrate is plentiful, every active site is occupied almost all the time; the enzyme is **saturated**, and adding more substrate changes nothing. Between the two lies a smooth curve, first described by Leonor Michaelis and Maud Menten in 1913:

$$v = \\frac{V_{\\max}\\,[S]}{K_m + [S]}$$

- $v$ is the **initial rate** — measured at the start, before product builds up or substrate runs down.
- $V_{\\max}$ is the rate when all the enzyme is busy. It is proportional to how much enzyme there is: $V_{\\max} = k_{cat}[E]_0$, where $k_{cat}$, the **turnover number**, is how many substrate molecules one active site converts per second.
- $K_m$, the **Michaelis constant**, is the substrate concentration at which the rate is half of $V_{\\max}$. It has units of concentration and is, roughly, a measure of how tightly the enzyme holds its substrate: a small $K_m$ means the enzyme works well even at low substrate.

### Reading the curve
At $[S] = K_m$ the rate is exactly half the maximum. At $[S] = 9K_m$ it is 90 %; at $99K_m$, 99 % — saturation is approached slowly. Well below $K_m$, $v \\approx (V_{\\max}/K_m)[S]$: the rate is proportional to substrate, like a simple first-order reaction. That low-substrate slope, divided by the enzyme concentration, is the **catalytic efficiency** $k_{cat}/K_m$ — the best single number for comparing enzymes. The fastest enzymes reach about $10^8$–$10^9\\ \\mathrm{M^{-1}s^{-1}}$, where every encounter with substrate leads to reaction and the limit is simply how fast molecules diffuse together.

| Enzyme | Substrate | $K_m$ | $k_{cat}$ (per second) |
|---|---|---|---|
| Carbonic anhydrase | CO₂ | 12 mM | 1 000 000 |
| Catalase | H₂O₂ | about 25 mM | 40 000 000 |
| Acetylcholinesterase | acetylcholine | 0.09 mM | 14 000 |
| Hexokinase (brain) | glucose | 0.05 mM | about 60 |
| Glucokinase (liver) | glucose | 8 mM | about 60 |

The last two rows show why $K_m$ matters in physiology. Brain hexokinase is saturated at any normal blood glucose (4–8 mM), so the brain gets glucose even when little is available; liver glucokinase, with a $K_m$ near blood glucose, speeds up just when glucose is plentiful after a meal — so the liver stores the excess.

### Where the equation comes from
The enzyme E binds substrate S to form a complex ES, which either falls apart again or makes product:

$$\\mathrm{E + S} \\underset{k_{-1}}{\\overset{k_1}{\\rightleftharpoons}} \\mathrm{ES} \\xrightarrow{k_{cat}} \\mathrm{E + P}$$

If the complex is made as fast as it is used up (the **steady-state assumption** of Briggs and Haldane, 1925), a little algebra gives the Michaelis–Menten equation with $K_m = (k_{-1} + k_{cat})/k_1$. When $k_{cat}$ is small compared with $k_{-1}$, $K_m$ approaches the dissociation constant of ES — the "affinity" reading of $K_m$.

### Measuring $K_m$ and $V_{\\max}$
Biochemists measure initial rates at several substrate concentrations and fit the hyperbola. Before computers, they straightened it by taking reciprocals — the **Lineweaver–Burk** plot of $1/v$ against $1/[S]$ is a straight line with intercept $1/V_{\\max}$ and slope $K_m/V_{\\max}$. It is still the clearest way to see how an inhibitor acts (see [[enzyme-inhibition]]), but it distorts the errors of the low-substrate points, so fitting the curve itself is better for numbers.

> [!key] Two numbers tell an enzyme's story: $V_{\\max}$ (how fast, when saturated) and $K_m$ (how much substrate it takes to get halfway there). Below $K_m$ the enzyme responds to every change in substrate; far above it, it cannot go faster.

The same equation turns up well beyond enzymes: in the uptake of nutrients by cells and roots, in the growth of bacteria on a limiting food (Monod's equation), and in the elimination of drugs such as phenytoin and alcohol, whose liver enzymes saturate at therapeutic doses (see [[pharmaceutics:nonlinear-pk]]).
`,
  ideas: [
    'At low substrate the rate is proportional to [S]; at high substrate the enzyme saturates and the rate levels off at Vmax.',
    'Km is the substrate concentration giving half the maximum rate; a small Km means the enzyme works well at low substrate.',
    'Vmax = kcat [E]0: the turnover number times the amount of enzyme.',
    'kcat/Km, the catalytic efficiency, compares enzymes; the best approach the diffusion limit, about 10⁸–10⁹ per molar per second.',
    'The equation follows from the steady state of the enzyme–substrate complex.'
  ],
  pitfalls: [
    'Km is the substrate concentration where the enzyme is saturated — It is where the rate is only half the maximum; the enzyme is 90 % saturated at 9 Km and never fully so.',
    'A bigger Vmax means a better enzyme — Vmax also grows with the amount of enzyme; compare kcat, and better still kcat/Km.',
    'Doubling the substrate always doubles the rate — Only well below Km. Near and above Km the gain is smaller, and at saturation there is none.'
  ],
  derivation: {
    title: 'The Michaelis–Menten equation from the steady state',
    steps: [
      { text: 'The complex is formed at rate $k_1[E][S]$ and lost at rate $(k_{-1} + k_{cat})[ES]$. In the steady state these are equal:', tex: 'k_1[E][S] = (k_{-1} + k_{cat})[ES]' },
      { text: 'Write the free enzyme as the total minus the bound, $[E] = [E]_0 - [ES]$, and collect $K_m = (k_{-1} + k_{cat})/k_1$:', tex: '([E]_0 - [ES])[S] = K_m [ES] \\;\\Rightarrow\\; [ES] = \\frac{[E]_0[S]}{K_m + [S]}' },
      { text: 'The rate of product formation is $k_{cat}[ES]$, and $k_{cat}[E]_0 = V_{\\max}$:', tex: 'v = \\frac{V_{\\max}[S]}{K_m + [S]}' }
    ]
  },
  formulas: [
    {
      name: 'The Michaelis–Menten equation',
      expr: 'v = Vmax*S/(Km + S)', tex: 'v = \\dfrac{V_{\\max}\\,\\mathrm{[S]}}{K_m + \\mathrm{[S]}}',
      vars: {
        v: { name: 'initial rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_{\\max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 2, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 1, tex: 'K_m' }
      },
      note: 'Initial rates only, one substrate, no inhibitor; many enzymes with two substrates follow it for each substrate when the other is held constant.',
      practice: { unknowns: ['v', 'S', 'Km'] },
      stories: {
        v: 'An enzyme with Vmax = {Vmax} and Km = {Km} is given {S} of substrate. How fast does it work?',
        S: 'An enzyme with Vmax = {Vmax} and Km = {Km} works at {v}. What is the substrate concentration?',
        Km: 'At {S} of substrate an enzyme runs at {v}; its maximum rate is {Vmax}. What is its Km?'
      }
    },
    {
      name: 'Maximum rate and turnover number',
      expr: 'Vmax = kcat*E0', tex: 'V_{\\max} = k_{cat}\\,\\mathrm{[E]}_0',
      vars: {
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', tex: 'V_{\\max}' },
        kcat: { name: 'turnover number', q: 'rate', unit: '1/s', value: 100, tex: 'k_{cat}' },
        E0: { name: 'total enzyme concentration', q: 'concentration', unit: 'µM', value: 0.1, tex: '\\mathrm{[E]}_0' }
      },
      stories: { kcat: 'A 0.1 µM enzyme solution reaches a maximum rate of {Vmax}. What is the turnover number?' }
    },
    {
      name: 'Catalytic efficiency',
      expr: 'eff = kcat/Km', tex: '\\eta = \\dfrac{k_{cat}}{K_m}',
      vars: {
        eff: { name: 'catalytic efficiency', q: 'rateconst2', unit: '1/(M·s)', tex: '\\eta' },
        kcat: { name: 'turnover number', q: 'rate', unit: '1/s', value: 1e6, tex: 'k_{cat}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 12, tex: 'K_m' }
      },
      note: 'The diffusion limit — every encounter reacting — is about 10⁸–10⁹ M⁻¹s⁻¹.',
      stories: { eff: 'Carbonic anhydrase has kcat = {kcat} and Km = {Km}. What is its catalytic efficiency?' }
    },
    {
      name: 'Fraction of the maximum rate',
      expr: 'f = S/(Km + S)', tex: 'f = \\dfrac{v}{V_{\\max}} = \\dfrac{\\mathrm{[S]}}{K_m + \\mathrm{[S]}}',
      vars: {
        f: { name: 'fraction of Vmax', q: 'ratio', unit: '%' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 5, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 8, tex: 'K_m' }
      },
      note: 'Also the fraction of enzyme molecules that are busy at any moment.',
      stories: { f: 'Liver glucokinase (Km = {Km}) sees a blood glucose of {S}. What fraction of its maximum rate does it run at?', S: 'What substrate concentration makes an enzyme with Km = {Km} run at {f} of its maximum?' }
    }
  ],
  examples: [
    {
      title: 'Hexokinase and glucokinase after a meal',
      q: 'Blood glucose rises from 5 mM to 9 mM after a meal. By how much does the rate change for brain hexokinase (Km 0.05 mM) and liver glucokinase (Km 8 mM)? (Treat glucokinase as Michaelis–Menten, though it is actually slightly sigmoid.)',
      steps: [
        'Hexokinase: $5/(0.05 + 5) = 0.990$ and $9/(0.05 + 9) = 0.994$ of Vmax — a rise of 0.4 %.',
        'Glucokinase: $5/(8 + 5) = 0.385$ and $9/(8 + 9) = 0.529$ of Vmax — a rise of 37 %.',
        'The brain gets the same glucose flux whatever the meal; the liver responds to the extra glucose and stores it as glycogen.'
      ],
      a: 'Hexokinase barely changes (+0.4 %); glucokinase speeds up by 37 %.'
    },
    {
      title: 'Finding Km and Vmax from two measurements',
      q: 'An enzyme runs at 4.0 µM/s with 1 mM substrate and at 8.0 µM/s with 5 mM. Find Vmax and Km.',
      steps: [
        'Write both: $4 = V\\cdot1/(K+1)$ and $8 = V\\cdot5/(K+5)$.',
        'From the first, $V = 4(K + 1)$; substitute: $8(K + 5) = 20(K + 1)$, so $12K = 20$, $K = 1.67$ mM.',
        '$V = 4 \\times 2.67 = 10.7$ µM/s. Check: $10.7 \\times 5/6.67 = 8.0$ ✓.'
      ],
      a: 'Vmax ≈ 10.7 µM/s and Km ≈ 1.67 mM.'
    },
    {
      title: 'How efficient is carbonic anhydrase?',
      q: 'Carbonic anhydrase has kcat = 10⁶ s⁻¹ and Km = 12 mM for CO₂. Compare its efficiency with the diffusion limit.',
      steps: [
        '$k_{cat}/K_m = 10^6 / 0.012\\ \\mathrm{M} = 8.3\\times10^7\\ \\mathrm{M^{-1}s^{-1}}$.',
        'The diffusion limit is about $10^8$–$10^9$: carbonic anhydrase is within a factor of a few of perfection — almost every CO₂ molecule that meets the active site reacts.'
      ],
      a: 'About 8 × 10⁷ M⁻¹s⁻¹, close to the diffusion limit.'
    }
  ],
  quiz: [
    { q: 'At a substrate concentration equal to Km, the rate is…', choices: ['equal to Vmax', 'half of Vmax', 'a quarter of Vmax', 'zero'], a: 1, why: 'Put [S] = Km into the equation: v = Vmax·Km/(2Km) = Vmax/2 — the definition of Km.' },
    { q: 'Doubling the amount of enzyme (substrate unchanged) changes…', choices: ['Km only', 'Vmax only', 'both Km and Vmax', 'neither'], a: 1, why: 'Vmax = kcat[E]₀ doubles; Km is a property of the enzyme and does not depend on how much of it there is.' },
    { q: 'What fraction of Vmax does an enzyme reach at [S] = 9 Km?', answer: 90, unit: '%', why: '9/(1 + 9) = 0.9.' },
    { q: 'An enzyme with a smaller Km for the same substrate is less effective at low substrate concentrations.', a: false, why: 'A smaller Km means half-maximal rate is reached at a lower concentration: it works better when substrate is scarce.' },
    { q: 'Which number is best for comparing how well two enzymes catalyse a reaction at low substrate?', choices: ['Vmax', 'Km', 'kcat', 'kcat/Km'], a: 3, why: 'At low [S], v ≈ (kcat/Km)[E][S]. kcat/Km is the catalytic efficiency and does not depend on the amount of enzyme.' }
  ],
  problems: [
    { q: 'An enzyme has Km = 0.4 mM and Vmax = 25 µM/min. What is the rate at 0.1 mM substrate?', answer: 5, unit: 'µM/min', tol: 0.02, steps: ['$v = 25 \\times 0.1/(0.4 + 0.1) = 25 \\times 0.2 = 5$ µM/min.'] },
    { q: 'What substrate concentration gives 75 % of Vmax for an enzyme with Km = 2 mM?', answer: 6, unit: 'mM', tol: 0.02, steps: ['$0.75 = S/(2 + S)$, so $0.75 \\times 2 = 0.25 S$ and $S = 6$ mM — three times Km.'] }
  ],
  applications: [
    'Add inhibitors and read the Lineweaver–Burk plot in [the enzyme calculator](#/tools/cell/enzyme).','Designing drugs that inhibit enzymes (statins, ACE inhibitors, antivirals) and predicting how much they slow them.', 'Understanding saturable drug elimination (phenytoin, alcohol), where small dose changes cause large changes in blood levels.', 'Industrial enzymes in detergents, food processing and biofuel production, run at substrate concentrations far above Km.', 'Diagnostic tests that measure enzyme activity in blood.'],
  history: 'Leonor Michaelis and Maud Menten published their measurements on invertase, the enzyme that splits sucrose, in 1913, carefully measuring initial rates and controlling pH — both new at the time. George Briggs and J. B. S. Haldane gave the steady-state derivation used today in 1925.',
  sim: ['ref-enzyme', 'ref-drift']
}

);
