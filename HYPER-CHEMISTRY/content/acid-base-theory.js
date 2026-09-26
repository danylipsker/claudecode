/* HYPER-CHEMISTRY · content/acid-base-theory.js — acids, bases and pH: the definitions,
 * water's self-ionisation, the pH scale, strong and weak acids and bases, polyprotic
 * acids and the acidity of salt solutions. Simulations in sims/acids-bases.js. */
Hyper.add(

{
  id: 'acid-base-definitions', parent: 'acid-base-theory', title: 'Arrhenius, Brønsted–Lowry and Lewis acids', level: 1,
  short: 'Three ways of saying what an acid is: a source of hydrogen ions in water (Arrhenius), a proton donor (Brønsted–Lowry), or an electron-pair acceptor (Lewis). Each takes in more reactions than the one before.',
  keywords: ['acid', 'base', 'alkali', 'Arrhenius', 'Brønsted', 'Bronsted', 'Lowry', 'Lewis acid', 'Lewis base', 'proton donor', 'proton acceptor', 'conjugate acid', 'conjugate base', 'conjugate pair', 'hydronium', 'oxonium', 'amphiprotic', 'amphoteric', 'neutralisation', 'electron pair'],
  prereq: ['chemical-equations', 'reaction-types', 'lewis-structures'],
  related: ['water-autoionization', 'strong-acids-bases', 'weak-acids', 'coordination-compounds', 'bond-polarity'],
  body: `
Long before anyone knew about ions, acids were recognised by what they do: they taste sour, turn blue litmus red, fizz with carbonates and dissolve reactive metals with a stream of hydrogen. Bases (the soluble ones are called **alkalis**) taste bitter, feel slippery, turn litmus blue and — the key observation — cancel acids out. Three definitions explain that behaviour, each wider than the one before.

### Arrhenius: hydrogen ions and hydroxide ions
In the 1880s Svante Arrhenius proposed that an acid is a substance that releases hydrogen ions in water, and a base one that releases hydroxide ions:

$$\\ce{HCl(aq) -> H+(aq) + Cl-(aq)} \\qquad \\ce{NaOH(aq) -> Na+(aq) + OH-(aq)}$$

Neutralisation is then one reaction whatever the acid and base, $\\ce{H+ + OH- -> H2O}$ — which is why every strong acid–strong base neutralisation releases the same heat, about 56 kJ per mole of water. The definition has two blind spots: it only works in water, and it cannot explain why ammonia, which contains no hydroxide, is a base.

### Brønsted–Lowry: proton donors and acceptors
In 1923 Johannes Brønsted and Thomas Lowry independently put the proton at the centre. An **acid donates a proton** ($\\ce{H+}$), a **base accepts one**. No water is needed: hydrogen chloride and ammonia gases meet in the air as a white smoke of ammonium chloride, a proton transfer with no solvent at all, $\\ce{HCl(g) + NH3(g) -> NH4Cl(s)}$.

A bare proton never exists in water; it is always attached to a water molecule as the **hydronium ion** $\\ce{H3O+}$, and $\\ce{H+(aq)}$ is shorthand for it. When an acid dissolves, water is the base:

$$\\ce{HA + H2O <=> H3O+ + A-}$$

Every proton transfer creates **conjugate pairs**. Once $\\ce{HA}$ has lost its proton, $\\ce{A-}$ can take one back: $\\ce{A-}$ is the **conjugate base** of $\\ce{HA}$, and $\\ce{H3O+}$ the conjugate acid of water. The stronger the acid, the weaker its conjugate base: $\\ce{Cl-}$ has essentially no pull on a proton, while acetate, from the weak acetic acid, takes one back readily.

Some species go either way. Water gives a proton to ammonia and takes one from hydrogen chloride; hydrogencarbonate $\\ce{HCO3-}$, dihydrogenphosphate $\\ce{H2PO4-}$ and every amino acid do the same. They are **amphiprotic** — and water's double nature is the subject of [[water-autoionization]].

### Lewis: electron pairs
Also in 1923, Gilbert N. Lewis looked at the electrons. A base accepts a proton by sharing one of its lone pairs with it. Lewis dropped the proton from the definition: a **Lewis acid is an electron-pair acceptor**, a **Lewis base an electron-pair donor**. That takes in reactions with no protons at all:

$$\\ce{BF3 + NH3 -> F3B-NH3}$$

Boron in $\\ce{BF3}$ has only six valence electrons and takes the lone pair of ammonia to complete its octet. Metal ions holding water or ammonia molecules are Lewis acids bound to Lewis bases ([[coordination-compounds]]); carbon dioxide dissolving in alkali, $\\ce{CO2 + OH- -> HCO3-}$, is a Lewis acid–base reaction, and so is the catalysis by aluminium chloride that organic chemists use every day.

| Definition | Acid | Base | Scope |
|---|---|---|---|
| Arrhenius (1880s) | gives $\\ce{H+}$ in water | gives $\\ce{OH-}$ in water | aqueous solutions |
| Brønsted–Lowry (1923) | proton donor | proton acceptor | any proton transfer |
| Lewis (1923) | electron-pair acceptor | electron-pair donor | any bond made from a donated pair |

> [!tip] Use the narrowest definition that does the job. For pH, buffers and titrations in water, Brønsted–Lowry is the working language of this whole branch; Lewis is the tool for metal ions, boron and aluminium compounds and much of organic chemistry.

### What makes an acid strong?
In the Brønsted picture an acid is strong when the $\\ce{H-A}$ bond breaks easily and the anion left behind is stable. Down group 17 the bond to hydrogen weakens, so $\\ce{HCl}$, $\\ce{HBr}$ and $\\ce{HI}$ are strong while $\\ce{HF}$, with its short, strong bond, is weak. Among oxoacids, extra oxygen atoms draw electron density away and spread the anion's charge: hypochlorous acid $\\ce{HOCl}$ is weak ($\\mathrm{p}K_a$ 7.5), while perchloric acid $\\ce{HClO4}$ is one of the strongest acids known. The numbers behind "strong" and "weak" come in [[strong-acids-bases]] and [[weak-acids]].
`,
  ideas: [
    'Arrhenius: acids give H⁺ and bases give OH⁻ in water. Simple, but limited to water and blind to ammonia.',
    'Brønsted–Lowry: an acid donates a proton, a base accepts one. In water the proton rides on a water molecule as H₃O⁺.',
    'Each acid–base reaction links two conjugate pairs; the stronger the acid, the weaker its conjugate base.',
    'Amphiprotic species — water, HCO₃⁻, H₂PO₄⁻, amino acids — can act as either acid or base.',
    'Lewis: an acid accepts an electron pair and a base donates one. Every Brønsted base is a Lewis base.'
  ],
  pitfalls: [
    'A base must contain hydroxide — Only in Arrhenius\' narrow sense. Ammonia, carbonate and amines are bases because they accept a proton from water, which leaves OH⁻ behind.',
    'H⁺ ions float free in water — A bare proton would grab a water molecule at once; H⁺(aq) is shorthand for H₃O⁺ (and larger hydrated clusters).',
    'A strong acid has a strong conjugate base — The opposite: HCl gives up its proton completely because Cl⁻ has almost no tendency to take it back.'
  ],
  examples: [
    {
      title: 'Spotting conjugate pairs',
      q: 'Hydrogencarbonate reacts with water in two ways: $\\ce{HCO3- + H2O <=> CO3^2- + H3O+}$ and $\\ce{HCO3- + H2O <=> H2CO3 + OH-}$. In each, name the acid, the base and the conjugate pairs.',
      steps: [
        'First reaction: $\\ce{HCO3-}$ loses a proton, so it is the acid; water gains one, so it is the base.',
        'The pairs differ by one proton: $\\ce{HCO3-}$/$\\ce{CO3^2-}$ and $\\ce{H3O+}$/$\\ce{H2O}$.',
        'Second reaction: water gives a proton to $\\ce{HCO3-}$. Now water is the acid and $\\ce{HCO3-}$ the base; the pairs are $\\ce{H2CO3}$/$\\ce{HCO3-}$ and $\\ce{H2O}$/$\\ce{OH-}$.',
        'Both $\\ce{HCO3-}$ and water have acted as acid in one reaction and base in the other: both are amphiprotic.'
      ],
      a: 'HCO₃⁻ is an acid in the first reaction and a base in the second; water does the reverse.'
    },
    {
      title: 'Which definition covers it?',
      q: 'Classify each reaction: (a) $\\ce{HNO3 + H2O -> H3O+ + NO3-}$; (b) $\\ce{NH3 + H2O <=> NH4+ + OH-}$; (c) $\\ce{Cu^2+ + 4NH3 -> [Cu(NH3)4]^2+}$.',
      steps: [
        '(a) Nitric acid releases hydronium ions in water: an acid in all three senses.',
        '(b) Ammonia makes the solution basic but contains no hydroxide, so it is not an Arrhenius base. It accepts a proton from water: a Brønsted–Lowry base, and (using its lone pair) a Lewis base.',
        '(c) No proton moves. Each ammonia donates its lone pair to the copper ion: $\\ce{Cu^2+}$ is a Lewis acid and $\\ce{NH3}$ a Lewis base. Only the Lewis definition sees an acid–base reaction here.'
      ],
      a: '(a) all three definitions; (b) Brønsted–Lowry and Lewis; (c) Lewis only.'
    }
  ],
  quiz: [
    { q: 'What is the conjugate base of $\\ce{H2PO4-}$?', choices: ['$\\ce{HPO4^2-}$', '$\\ce{H3PO4}$', '$\\ce{PO4^3-}$', '$\\ce{OH-}$'], a: 0,
      why: 'A conjugate base has one proton fewer than its acid: remove one H⁺ from H₂PO₄⁻ and the charge falls by one, to HPO₄²⁻. H₃PO₄ is its conjugate acid.' },
    { q: 'In $\\ce{NH3 + H2O <=> NH4+ + OH-}$, water acts as…', choices: ['an acid', 'a base', 'neither', 'a Lewis acid only'], a: 0,
      why: 'Water gives a proton to ammonia, so it is the Brønsted acid; its conjugate base is OH⁻.' },
    { q: 'Boron trifluoride, $\\ce{BF3}$, is an acid according to…', choices: ['Arrhenius', 'Brønsted–Lowry', 'Lewis only', 'all three definitions'], a: 2,
      why: 'BF₃ has no hydrogen to give. It is an acid only because boron, with six valence electrons, accepts an electron pair from a donor such as NH₃ or F⁻.' },
    { q: 'Every Brønsted–Lowry base is also a Lewis base.', a: true,
      why: 'To accept a proton, a base must supply a lone pair to form the new bond — which is exactly what a Lewis base does. The reverse is not true of acids: many Lewis acids (BF₃, Al³⁺) have no proton to give.' },
    { q: 'Hydrochloric acid is strong, so the chloride ion is…', choices: ['a strong base', 'a weak base, but stronger than acetate', 'so weak a base that it hardly takes protons at all', 'an acid'], a: 2,
      why: 'HCl gives its proton away completely precisely because Cl⁻ has almost no attraction for it. Strong acids have negligibly weak conjugate bases.' }
  ],
  applications: [
    'Antacid tablets: carbonate and hydroxide bases neutralise excess stomach acid.',
    'Carbon-capture plants scrub CO₂ from flue gas with amine solutions, a reversible acid–base reaction.',
    'Aluminium chloride and boron trifluoride as Lewis-acid catalysts in plastics and pharmaceutical synthesis.',
    'Liming acid soils and lakes with calcium carbonate.'
  ],
  history: 'Lavoisier thought every acid contained oxygen — the name means "acid-former". Humphry Davy showed in 1810 that hydrochloric acid has none, and Justus von Liebig (1838) tied acidity to hydrogen that a metal can replace. Arrhenius\' ionic theory followed in the 1880s, and Brønsted, Lowry and Lewis all published their definitions in 1923.'
},

{
  id: 'water-autoionization', parent: 'acid-base-theory', title: 'The self-ionisation of water', level: 2,
  short: 'Water hands protons to itself: 2H₂O ⇌ H₃O⁺ + OH⁻. The product of the two ion concentrations, Kw, is 1.0 × 10⁻¹⁴ at 25 °C and fixes the balance between acidity and basicity in every aqueous solution.',
  keywords: ['autoionisation', 'autoionization', 'self-ionisation', 'autoprotolysis', 'ion product of water', 'Kw', 'pKw', 'neutral', 'hydronium', 'hydroxide', 'temperature', 'Grotthuss', 'ultrapure water', 'conductivity'],
  prereq: ['acid-base-definitions', 'equilibrium-constant', 'dynamic-equilibrium'],
  related: ['ph-scale', 'le-chatelier', 'vant-hoff', 'strong-acids-bases', 'physics:resistivity'],
  body: `
Water is not quite just $\\ce{H2O}$ molecules. Now and then one molecule hands a proton to its neighbour:

$$\\ce{2H2O(l) <=> H3O+(aq) + OH-(aq)}$$

Water acts as [[acid-base-definitions|acid and base]] at once. The reaction runs both ways all the time and at 25 °C settles at only $1.0 \\times 10^{-7}$ mol/L of each ion. A litre of water holds 55.5 mol of molecules, so about two in a billion are ionised at any instant. Yet those few ions set the pH of every aqueous solution.

### The ion product $K_w$
Write the [[equilibrium-constant]], leaving out the water (a pure liquid, activity 1), and you get the **ion product of water**:

$$K_w = [\\ce{H3O+}][\\ce{OH-}] = 1.0 \\times 10^{-14} \\quad \\text{at 25 °C}$$

The **product** is fixed, not the individual concentrations. Add acid and $[\\ce{H3O+}]$ rises, so $[\\ce{OH-}]$ must fall to keep the product at $K_w$: in 0.010 M hydrochloric acid, $[\\ce{OH-}] = 10^{-12}$ mol/L. Add a base and the reverse happens. No aqueous solution is ever free of either ion — concentrated sodium hydroxide still contains a few hydronium ions.

The reverse reaction is among the fastest in chemistry: a hydronium and a hydroxide ion that meet combine almost at once. That is why neutralisation is instantaneous, and why the heat of neutralisation of any strong acid by any strong base is the same, about 56 kJ per mole of water — it is always this reaction running backwards.

### Neutral does not mean pH 7
A solution is **neutral** when $[\\ce{H3O+}] = [\\ce{OH-}] = \\sqrt{K_w}$. At 25 °C that is $10^{-7}$ mol/L, pH 7 on the [[ph-scale]]. But self-ionisation absorbs heat ($\\Delta H^\\circ \\approx +56$ kJ/mol), so by [[le-chatelier|Le Chatelier's principle]] warming pushes it to the right and $K_w$ grows:

| Temperature | $K_w$ | $\\mathrm{p}K_w$ | Neutral pH |
|---|---|---|---|
| 0 °C | $1.1 \\times 10^{-15}$ | 14.94 | 7.47 |
| 25 °C | $1.0 \\times 10^{-14}$ | 14.00 | 7.00 |
| 37 °C | $2.4 \\times 10^{-14}$ | 13.62 | 6.81 |
| 50 °C | $5.5 \\times 10^{-14}$ | 13.26 | 6.63 |
| 100 °C | $5 \\times 10^{-13}$ | 12.3 | 6.1 |

Boiling water at pH 6.1 is exactly neutral. Blood at pH 7.40 and 37 °C is more alkaline than neutral by 0.6 units, not 0.4. The change with temperature follows the [[vant-hoff|van 't Hoff equation]] closely up to about 60 °C; above that $\\Delta H^\\circ$ itself falls and the constant-$\\Delta H$ formula overestimates $K_w$ (it predicts 12.0 instead of 12.3 at 100 °C).

> [!fact] Pure water barely conducts: its resistivity is 18.2 MΩ·cm at 25 °C, set entirely by these self-made ions. Semiconductor fabs, power-station boilers and laboratories monitor their "18-megohm" water with a conductivity cell — any dissolved salt shows up at once.

### Protons that hop
A hydronium ion does not have to travel to carry charge. A proton jumps from $\\ce{H3O+}$ to a neighbouring water molecule along a hydrogen bond, that molecule passes another proton on, and so on — the **Grotthuss mechanism**. The charge moves while no atom moves far, so hydronium conducts about seven times better than a sodium ion and hydroxide about four times better. That is why acids and alkalis conduct far better than salt solutions of the same concentration, a fact [[titration-curves|conductometric titrations]] exploit.
`,
  ideas: [
    'Water ionises itself slightly: 2H₂O ⇌ H₃O⁺ + OH⁻, about two molecules in a billion at 25 °C.',
    'Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C, in every aqueous solution, not just pure water.',
    'Raising one ion concentration lowers the other in proportion: the product stays at Kw.',
    'Neutral means [H₃O⁺] = [OH⁻]. Because Kw rises with temperature, neutral pH is 7 only at 25 °C.'
  ],
  pitfalls: [
    'Pure water always has pH 7 — Only at 25 °C. At 37 °C neutral water has pH 6.81, at 100 °C about 6.1, and it is still neutral.',
    'An acidic solution contains no hydroxide ions — It contains fewer: in 0.01 M HCl [OH⁻] is 10⁻¹² mol/L. The product with [H₃O⁺] is always Kw.',
    'Kw is 10⁻¹⁴ because pH runs from 0 to 14 — The other way round: the pH scale is centred on 7 because Kw happens to be 10⁻¹⁴ at room temperature.'
  ],
  formulas: [
    {
      name: 'The ion product of water',
      expr: 'Kw = H*OH', tex: 'K_w = \\mathrm{[\\ce{H3O+}]}\\,\\mathrm{[\\ce{OH-}]}',
      vars: {
        Kw: { name: 'ion product of water (25 °C)', value: 1.0e-14, fixed: true, tex: 'K_w' },
        H: { name: '[H₃O⁺] (mol/L)', value: 0.010, tex: '\\mathrm{[\\ce{H3O+}]}' },
        OH: { name: '[OH⁻] (mol/L)', tex: '\\mathrm{[\\ce{OH-}]}' }
      },
      solveFor: 'OH',
      note: 'Concentrations in mol/L, entered as plain numbers. $K_w$ = 1.0 × 10⁻¹⁴ at 25 °C; change it to 2.4 × 10⁻¹⁴ for 37 °C.',
      practice: { unknowns: ['OH', 'H'] },
      stories: {
        OH: 'A solution at 25 °C ($K_w$ = {Kw}) has a hydronium-ion concentration of {H} mol/L. What is its hydroxide-ion concentration, in mol/L?',
        H: 'A cleaning solution at 25 °C ($K_w$ = {Kw}) contains {OH} mol/L of hydroxide ions. What is its hydronium-ion concentration, in mol/L?'
      }
    },
    {
      name: 'Neutral pH at any temperature',
      expr: 'pHn = -0.5*log(Kw)', tex: '\\mathrm{pH}_\\text{neutral} = \\tfrac12\\,{\\mathrm{p}K}_w = -\\tfrac12\\log K_w',
      vars: {
        pHn: { name: 'pH of neutral water', tex: '\\mathrm{pH}_\\text{neutral}' },
        Kw: { name: 'ion product of water at that temperature', value: 2.4e-14, tex: 'K_w' }
      },
      note: 'Neutral means [H₃O⁺] = [OH⁻] = √Kw. The default is body temperature, 37 °C.',
      practice: { unknowns: ['pHn'] },
      stories: {
        pHn: 'At a certain temperature the ion product of water is {Kw}. What is the pH of neutral water there?',
        Kw: 'Neutral water at a certain temperature has pH {pHn}. What is $K_w$ at that temperature?'
      }
    },
    {
      name: 'Kw at another temperature (van \'t Hoff)',
      expr: 'Kw = Kw1*exp(-dH/R*(1/T - 1/T1))',
      tex: 'K_w = K_{w,1}\\,\\exp\\left[-\\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T} - \\frac{1}{T_1}\\right)\\right]',
      vars: {
        Kw: { name: 'ion product at temperature T', tex: 'K_w' },
        Kw1: { name: 'ion product at the reference temperature', value: 1.0e-14, fixed: true, tex: 'K_{w,1}' },
        dH: { name: 'enthalpy of self-ionisation', q: 'molarenergy', unit: 'kJ/mol', value: 55.8, fixed: true, tex: '\\Delta H^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37, min: 0, max: 100 },
        T1: { name: 'reference temperature', q: 'temperature', unit: 'K', value: 298.15, fixed: true, tex: 'T_1' }
      },
      note: 'Assumes ΔH° stays constant: good within about 35 °C of 25 °C; at 100 °C it gives pKw 12.0 against the measured 12.3.',
      practice: { unknowns: ['Kw', 'T'] },
      stories: {
        Kw: 'Self-ionisation of water has $\\Delta H^\\circ$ = {dH}. Taking $K_w$ = {Kw1} at 25 °C, estimate $K_w$ at {T}.',
        T: 'At what temperature does $K_w$ reach {Kw}, if $\\Delta H^\\circ$ = {dH} and $K_w$ = {Kw1} at 25 °C?'
      }
    }
  ],
  examples: [
    {
      title: 'Hydroxide in an acid',
      q: 'What is $[\\ce{OH-}]$ in 0.020 M hydrochloric acid at 25 °C?',
      steps: [
        'A strong acid ionises completely, so $[\\ce{H3O+}] = 0.020$ mol/L.',
        { text: 'The product of the two concentrations is $K_w$:', tex: '[\\ce{OH-}] = \\frac{K_w}{[\\ce{H3O+}]} = \\frac{1.0\\times10^{-14}}{0.020} = 5.0\\times10^{-13}\\ \\mathrm{mol/L}' },
        'Tiny, but not zero: hydronium ions outnumber hydroxide ions 40 billion to one.'
      ],
      a: '[OH⁻] = 5.0 × 10⁻¹³ mol/L.'
    },
    {
      title: 'Neutral water at body temperature',
      q: 'Estimate $K_w$ and the neutral pH at 37 °C, from $K_w = 1.0\\times10^{-14}$ at 25 °C and $\\Delta H^\\circ = +55.8$ kJ/mol.',
      steps: [
        'Temperatures in kelvin: $T_1 = 298.15$ K, $T = 310.15$ K.',
        { text: 'Van \'t Hoff:', tex: '\\ln\\frac{K_w}{K_{w,1}} = -\\frac{55\\,800}{8.314}\\left(\\frac{1}{310.15} - \\frac{1}{298.15}\\right) = 0.871' },
        '$K_w = 1.0\\times10^{-14} \\times e^{0.871} = 2.39\\times10^{-14}$, so $\\mathrm{p}K_w = 13.62$.',
        'Neutral pH is half of that: 6.81. Blood at pH 7.40 is therefore basic by 0.59 units.'
      ],
      a: 'Kw ≈ 2.4 × 10⁻¹⁴ and neutral pH 6.81 at 37 °C.'
    }
  ],
  quiz: [
    { q: 'At 25 °C a solution has $[\\ce{H3O+}] = 1\\times10^{-3}$ mol/L. What is $[\\ce{OH-}]$?', choices: ['$1\\times10^{-11}$ mol/L', '$1\\times10^{-3}$ mol/L', '$1\\times10^{-7}$ mol/L', 'zero: the solution is acidic'], a: 0,
      why: '[OH⁻] = Kw/[H₃O⁺] = 10⁻¹⁴/10⁻³ = 10⁻¹¹ mol/L. Hydroxide never disappears; it just becomes scarce.' },
    { q: 'Pure water always has pH 7.', a: false,
      why: 'Kw grows with temperature, so neutral pH falls: 7.47 at 0 °C, 6.81 at 37 °C, about 6.1 at 100 °C. Pure water is always neutral, but only at 25 °C is neutral pH 7.' },
    { q: 'Pure water is heated from 25 °C to 60 °C. What happens?', choices: ['its pH rises and it becomes basic', 'its pH falls and it becomes acidic', 'its pH falls but it stays neutral', 'nothing: Kw is a constant'], a: 2,
      why: 'Self-ionisation is endothermic, so heating increases Kw and both [H₃O⁺] and [OH⁻] rise together. The pH falls (to about 6.5), but the two ions remain equal: neutral.' },
    { q: 'What is $[\\ce{OH-}]$, in mol/L, in 0.050 M nitric acid at 25 °C?', answer: 2.0e-13,
      why: 'Nitric acid is strong: [H₃O⁺] = 0.050 mol/L, so [OH⁻] = 1.0 × 10⁻¹⁴ / 0.050 = 2.0 × 10⁻¹³ mol/L.' },
    { q: 'Why is the heat released by neutralising 1 mol of any strong acid with any strong base about the same, 56 kJ?', choices: ['all strong acids have the same molar mass', 'the reaction is always H₃O⁺ + OH⁻ → 2H₂O; the other ions are spectators', 'water always boils', 'it is a coincidence'], a: 1,
      why: 'Strong acids and bases are fully ionised, so the only reaction is hydronium meeting hydroxide — the self-ionisation of water in reverse, with ΔH° ≈ −56 kJ/mol.' }
  ],
  applications: [
    'Ultrapure-water monitoring in chip fabs and power stations: 18.2 MΩ·cm resistivity means nothing but water\'s own ions.',
    'Blood-gas analysers and pH meters correct for temperature, because neutral pH is 6.8 at body temperature.',
    'Boiler and cooling-water chemistry, where high temperature shifts neutral pH well below 7.',
    'Fuel cells and electrolysers: the Grotthuss hopping of protons carries the current through the membrane.'
  ],
  sim: 'ab-ph-scale'
},

{
  id: 'ph-scale', parent: 'acid-base-theory', title: 'The pH scale', level: 1,
  short: 'pH is minus the base-10 logarithm of the hydrogen-ion concentration in mol/L. Each unit is a factor of ten: lower pH is more acidic, pH 7 is neutral at 25 °C, and pH + pOH = 14.',
  keywords: ['pH', 'pOH', 'acidic', 'basic', 'alkaline', 'neutral', 'logarithmic scale', 'Sørensen', 'pH meter', 'glass electrode', 'litmus', 'indicator paper', 'acid rain', 'ocean acidification', 'activity'],
  prereq: ['water-autoionization', 'math:logarithms', 'math:logarithmic-scales'],
  related: ['indicators', 'strong-acids-bases', 'buffers', 'nernst-equation', 'electronics:sensor-interfacing', 'math:scientific-notation'],
  body: `
Hydrogen-ion concentrations in water span more than fourteen powers of ten, from about 1 mol/L in strong acid to $10^{-14}$ mol/L in strong alkali. Numbers like 0.000 000 04 are awkward to compare, so in 1909 the Danish chemist Søren Sørensen, studying proteins and brewing at the Carlsberg Laboratory, proposed a [[math:logarithmic-scales|logarithmic scale]]:

$$\\mathrm{pH} = -\\log_{10}[\\ce{H3O+}]$$

with the concentration in mol/L. The minus sign makes everyday values positive, and the [[math:logarithms|logarithm]] turns every factor of ten into one step: pH 3 has ten times the hydrogen-ion concentration of pH 4 and a thousand times that of pH 6. **Lower pH means more acidic.** Halving the concentration raises the pH by only $\\log 2 = 0.30$.

### pOH and the sum of 14
Hydroxide gets the same treatment, $\\mathrm{pOH} = -\\log[\\ce{OH-}]$, and the logarithm of $K_w = [\\ce{H3O+}][\\ce{OH-}]$ ([[water-autoionization]]) gives

$$\\mathrm{pH} + \\mathrm{pOH} = \\mathrm{p}K_w = 14.00 \\quad \\text{at 25 °C}$$

A basic solution with $[\\ce{OH-}] = 10^{-2}$ mol/L has pOH 2 and pH 12. Neutral water sits in the middle, at pH 7 — at 25 °C.

### Everyday values
| Substance | pH |
|---|---|
| Car-battery acid | below 1 |
| Stomach acid | 1.5 – 3.5 |
| Lemon juice | about 2.3 |
| Cola | about 2.5 |
| Vinegar | 2.5 – 3 |
| Coffee | about 5 |
| Clean rain | 5.6 |
| Milk | about 6.7 |
| Pure water, 25 °C | 7.0 |
| Blood | 7.35 – 7.45 |
| Sea water (surface) | about 8.1 |
| Baking-soda solution | about 8.3 |
| Milk of magnesia | about 10.5 |
| Household ammonia | about 11.5 |
| Limewater | 12.4 |
| Bleach | 12 – 13 |
| 1 M sodium hydroxide | 14 |

Even the cleanest rain is slightly acidic, because it dissolves carbon dioxide ([[polyprotic-acids|carbonic acid]]); "acid rain" means below about 5, from sulfur and nitrogen oxides. Surface sea water has fallen from about pH 8.2 before industrialisation to about 8.1 today as the oceans take up our carbon dioxide. That sounds small, but it is a 26 % rise in $[\\ce{H3O+}]$, since $10^{0.1} = 1.26$.

### Measuring pH
- **Indicator paper**, soaked in a mixture of dyes, changes colour across the scale and gives pH to about ±0.5 ([[indicators]]).
- A **pH meter** uses a thin glass membrane that develops a voltage set by the hydrogen-ion activity on its two sides. At 25 °C the voltage changes by $RT\\ln 10/F = 59.2$ mV per pH unit, as the [[nernst-equation|Nernst equation]] predicts. The membrane's resistance is enormous (hundreds of megohms), so the meter needs an amplifier drawing only picoamperes — a classic problem of [[electronics:sensor-interfacing|sensor interfacing]]. The electrode is calibrated with two or three standard buffers (pH 4.01, 7.00, 10.01), and its slope is corrected for temperature.

> [!warn] The scale does not stop at 0 and 14. Concentrated hydrochloric acid has a negative pH, and 10 M sodium hydroxide is above 14. In such strong solutions the ions crowd one another, and pH really measures the hydrogen-ion **activity**, an effective concentration. Below about 0.1 mol/L the difference is small, and that is where the simple calculations work.
`,
  ideas: [
    'pH = −log[H₃O⁺], with the concentration in mol/L; pOH = −log[OH⁻].',
    'Each pH unit is a factor of ten in [H₃O⁺]; lower pH is more acidic.',
    'pH + pOH = pKw = 14.00 at 25 °C.',
    'A pH meter measures a voltage that changes by 59.2 mV per pH unit at 25 °C.',
    'Strictly, pH measures hydrogen-ion activity; for dilute solutions activity ≈ concentration.'
  ],
  pitfalls: [
    'pH 4 is twice as acidic as pH 8 — It has 10⁴ = 10 000 times the hydrogen-ion concentration. The scale is logarithmic.',
    'pH cannot be below 0 or above 14 — It can: 2 M HCl has a pH near −0.3. The 0–14 range just covers 1 mol/L of H₃O⁺ to 1 mol/L of OH⁻.',
    'Diluting an acid tenfold always raises its pH by one — Only for a strong acid well above 10⁻⁶ M. A weak acid rises by about half a unit, and nothing diluted with water passes pH 7.'
  ],
  formulas: [
    {
      name: 'pH from the hydrogen-ion concentration',
      expr: 'pH = -log(H)', tex: '\\mathrm{pH} = -\\log\\mathrm{[\\ce{H3O+}]}',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}', signed: true },
        H: { name: '[H₃O⁺] (mol/L)', value: 5.0e-3, tex: '\\mathrm{[\\ce{H3O+}]}' }
      },
      note: 'The concentration is a plain number in mol/L. Solve for [H₃O⁺] to go back: $\\mathrm{[\\ce{H3O+}]} = 10^{-\\mathrm{pH}}$. Above 1 mol/L the pH comes out negative.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A fruit juice contains {H} mol/L of hydronium ions. What is its pH?',
        H: 'A solution has pH {pH}. What is its hydronium-ion concentration, in mol/L?'
      }
    },
    {
      name: 'pH and pOH',
      expr: 'pH + pOH = pKw', tex: '\\mathrm{pH} + \\mathrm{pOH} = {\\mathrm{p}K}_w',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}', min: 0, max: 14 },
        pOH: { name: 'pOH', value: 2.5, tex: '\\mathrm{pOH}', min: 0, max: 14 },
        pKw: { name: 'pKw (14.00 at 25 °C)', value: 14.00, fixed: true, tex: '{\\mathrm{p}K}_w' }
      },
      solveFor: 'pH',
      note: 'pKw = 14.00 at 25 °C; change it to 13.62 for 37 °C.',
      practice: { unknowns: ['pH', 'pOH'] },
      stories: {
        pH: 'A cleaning solution has pOH {pOH}. What is its pH at 25 °C (${\\mathrm{p}K}_w$ = {pKw})?',
        pOH: 'A solution has pH {pH}. What is its pOH at 25 °C (${\\mathrm{p}K}_w$ = {pKw})?'
      }
    },
    {
      name: 'How many times more acidic',
      expr: 'r = 10^(pH2 - pH1)', tex: 'r = \\frac{[\\ce{H3O+}]_1}{[\\ce{H3O+}]_2} = 10^{\\,\\mathrm{pH}_2 - \\mathrm{pH}_1}',
      vars: {
        r: { name: 'ratio of hydronium concentrations, solution 1 to solution 2', tex: 'r' },
        pH1: { name: 'pH of solution 1', value: 8.1, tex: '\\mathrm{pH}_1', min: 0, max: 14 },
        pH2: { name: 'pH of solution 2', value: 8.2, tex: '\\mathrm{pH}_2', min: 0, max: 14 }
      },
      note: 'Defaults: surface sea water today (8.1) against before industrialisation (8.2).',
      practice: { unknowns: ['r'] },
      stories: {
        r: 'Solution 1 has pH {pH1} and solution 2 has pH {pH2}. How many times the hydronium-ion concentration of solution 2 does solution 1 have?'
      }
    },
    {
      name: 'Slope of a pH electrode',
      expr: 'S = ln(10)*R*T/F', tex: 'S = \\frac{RT\\ln 10}{F}',
      vars: {
        S: { name: 'electrode voltage change per pH unit', q: 'voltage', unit: 'mV', min: 54, max: 67 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: 0, max: 100 },
        F: { const: 'F' }
      },
      note: 'The ideal Nernstian slope of a glass electrode for water between 0 and 100 °C; real electrodes reach 95–100 % of it, which is what calibration measures.',
      practice: { unknowns: ['S', 'T'] },
      stories: {
        S: 'By how many millivolts does an ideal glass electrode\'s voltage change per pH unit at {T}?',
        T: 'An ideal pH electrode shows a slope of {S} per pH unit. What is the temperature of the solution?'
      }
    }
  ],
  examples: [
    {
      title: 'Cola against coffee',
      q: 'Cola has pH 2.5 and black coffee pH 5.0. Find each hydronium-ion concentration and compare them.',
      steps: [
        'Invert the definition: $[\\ce{H3O+}] = 10^{-\\mathrm{pH}}$.',
        'Cola: $10^{-2.5} = 3.2\\times10^{-3}$ mol/L. Coffee: $10^{-5.0} = 1.0\\times10^{-5}$ mol/L.',
        'Ratio: $10^{5.0-2.5} = 10^{2.5} = 316$.'
      ],
      a: 'Cola has about 316 times the hydronium-ion concentration of coffee.'
    },
    {
      title: 'Reading a pH meter',
      q: 'After calibration at pH 7.00, a glass electrode at 25 °C reads 177 mV more positive in a sample (the acid direction). What is the pH of the sample?',
      steps: [
        'The ideal slope at 25 °C is $S = RT\\ln 10/F = 59.16$ mV per pH unit.',
        '177 mV is $177/59.16 = 2.99$ pH units towards the acid side.',
        'pH = 7.00 − 2.99 = 4.01.'
      ],
      a: 'pH 4.01 — which is why a pH 4.01 buffer is the usual second calibration point.'
    }
  ],
  quiz: [
    { q: 'Solution A has pH 3 and solution B pH 5. The hydronium-ion concentration in A is…', choices: ['twice that in B', '100 times that in B', '5/3 of that in B', '1/100 of that in B'], a: 1,
      why: 'Two pH units are two factors of ten: 10² = 100. Lower pH means more hydronium, so A has more.' },
    { q: 'What is the pH of a solution with $[\\ce{H3O+}] = 2.5\\times10^{-4}$ mol/L?', answer: 3.60,
      why: 'pH = −log(2.5 × 10⁻⁴) = 4 − log 2.5 = 4 − 0.40 = 3.60.' },
    { q: 'A strong acid at pH 2.0 is diluted tenfold with pure water. The new pH is…', choices: ['1.0', '2.1', '3.0', '7.0'], a: 2,
      why: 'Tenfold dilution cuts [H₃O⁺] from 10⁻² to 10⁻³ mol/L: pH 3.0. The pH moves towards 7, never past it.' },
    { q: 'A pH below zero is impossible.', a: false,
      why: 'pH = −log[H₃O⁺], so any concentration above 1 mol/L gives a negative pH. Concentrated hydrochloric acid (about 12 M) is far below zero.' },
    { q: 'The hydronium-ion concentration of a solution is halved. Its pH…', choices: ['rises by 0.30', 'rises by 0.5', 'doubles', 'falls by 0.30'], a: 0,
      why: 'pH changes by −log(½) = +0.30. Less hydronium means a higher pH, and the change is small because the scale is logarithmic.' }
  ],
  applications: [
    'Water treatment and swimming pools, kept at pH 7.2–7.8 for disinfection and comfort.',
    'Soil testing: most crops prefer pH 6–7; blueberries and rhododendrons want 4.5–5.5.',
    'Food safety: canned foods below pH 4.6 cannot support botulism bacteria and need less intense heating.',
    'Monitoring ocean acidification with pH sensors on buoys and research ships.'
  ],
  history: 'Søren Sørensen introduced the pH scale in 1909 while studying enzymes at the Carlsberg Laboratory in Copenhagen. The first practical glass-electrode pH meter was built by Arnold Beckman in 1934 for a citrus grower who needed to test lemon juice.',
  sim: 'ab-ph-scale'
},

{
  id: 'strong-acids-bases', parent: 'acid-base-theory', title: 'Strong acids and bases', level: 2,
  short: 'Strong acids and bases ionise completely in water, so the pH follows directly from the concentration. Only in very dilute solutions do water\'s own ions have to be counted too.',
  keywords: ['strong acid', 'strong base', 'hydrochloric acid', 'sulfuric acid', 'nitric acid', 'perchloric acid', 'sodium hydroxide', 'potassium hydroxide', 'barium hydroxide', 'levelling effect', 'complete ionisation', 'neutralisation', 'concentrated', 'dilute', 'charge balance'],
  prereq: ['ph-scale', 'acid-base-definitions', 'molarity'],
  related: ['weak-acids', 'titration-curves', 'titration-calculations', 'limiting-reagent', 'math:quadratic-equations'],
  body: `
A **strong acid** gives its proton to water completely. In hydrochloric acid there are, for practical purposes, no $\\ce{HCl}$ molecules left, only hydronium and chloride ions:

$$\\ce{HCl(aq) + H2O(l) -> H3O+(aq) + Cl-(aq)}$$

The single arrow says the reaction goes to completion. The common strong acids are few enough to learn: hydrochloric $\\ce{HCl}$, hydrobromic $\\ce{HBr}$, hydroiodic $\\ce{HI}$, nitric $\\ce{HNO3}$, perchloric $\\ce{HClO4}$ and sulfuric $\\ce{H2SO4}$ — for its first proton; the second, from $\\ce{HSO4-}$, is only moderately strong ($\\mathrm{p}K_a$ 1.99). The **strong bases** are the soluble metal hydroxides: those of group 1 ($\\ce{LiOH}$, $\\ce{NaOH}$, $\\ce{KOH}$) and the heavier group 2 hydroxides ($\\ce{Ca(OH)2}$, $\\ce{Sr(OH)2}$, $\\ce{Ba(OH)2}$), fully dissociated as far as they dissolve.

### The pH follows from the concentration
Every molecule reacts, so the hydronium concentration is the acid concentration, and a hydroxide gives $n$ hydroxide ions per formula unit:

$$[\\ce{H3O+}] = C_\\text{acid}, \\qquad [\\ce{OH-}] = n\\,C_\\text{base}$$

0.010 M $\\ce{HNO3}$ has pH 2.00; 0.0050 M $\\ce{Ba(OH)2}$ gives 0.010 mol/L of hydroxide, pOH 2.00, pH 12.00. Each tenfold dilution moves the pH one unit towards 7.

### Levelling: why they all look alike
In water every strong acid becomes the same acid, $\\ce{H3O+}$ — the strongest acid that can survive in water. Perchloric acid is far stronger than hydrochloric acid, but in water both are simply "completely ionised": the solvent **levels** them. To rank them you need a solvent that is a poorer base than water, such as pure acetic acid, in which they ionise only partly and to different extents. The same happens to bases: oxide $\\ce{O^2-}$, amide $\\ce{NH2-}$ and hydride $\\ce{H-}$ are far stronger bases than hydroxide, but in water they are all turned into it at once, $\\ce{O^2- + H2O -> 2OH-}$.

### Strong is not the same as concentrated
"Strong" says **how completely** an acid ionises; "concentrated" says **how much** is dissolved. $10^{-4}$ M hydrochloric acid is strong but dilute (pH 4); 1 M acetic acid is concentrated but weak (pH 2.4).

### Very dilute solutions: water joins in
The simple rule says $10^{-8}$ M HCl has pH 8 — a basic solution made by adding acid, which is absurd. At such low concentrations the ions from [[water-autoionization|water's own ionisation]] are no longer negligible. The exact answer comes from the **charge balance**: positive charge $[\\ce{H3O+}]$ equals negative charge $[\\ce{Cl-}] + [\\ce{OH-}]$. With $[\\ce{OH-}] = K_w/[\\ce{H3O+}]$ that is a [[math:quadratic-equations|quadratic]]:

$$[\\ce{H3O+}]^2 - C\\,[\\ce{H3O+}] - K_w = 0 \\quad\\Rightarrow\\quad [\\ce{H3O+}] = \\frac{C}{2} + \\sqrt{\\frac{C^2}{4} + K_w}$$

For $C = 10^{-8}$ M this gives pH 6.98: slightly acidic, as common sense demands. The correction only matters below about $10^{-6}$ M.

### Mixing a strong acid with a strong base
Hydronium and hydroxide react one to one, completely. Work in amounts, as for a [[limiting-reagent]]: whichever is in excess is left, spread through the combined volume. 25.0 mL of 0.100 M HCl (2.50 mmol) with 20.0 mL of 0.100 M NaOH (2.00 mmol) leaves 0.50 mmol of $\\ce{H3O+}$ in 45.0 mL: 0.0111 M, pH 1.95. Plot the pH against the volume of base and you have a [[titration-curves|titration curve]].

### In industry and at home
Sulfuric acid is the most produced chemical in the world, roughly 250 million tonnes a year, more than half of it for phosphate fertilisers; it is also the electrolyte of lead–acid batteries. Hydrochloric acid strips rust and scale from steel before galvanising ("pickling"); nitric acid goes into ammonium nitrate fertiliser and explosives. About 80 million tonnes a year of sodium hydroxide come from the [[electrolysis|chlor-alkali process]], for paper, alumina refining, soap and drain cleaners.

> [!warn] Diluting concentrated acids and alkalis releases a lot of heat. Always add acid to water, slowly and with stirring — never water to acid, which can boil where it lands and spit. Alkalis are more insidious on skin and in the eyes than acids: they dissolve fats and proteins, so the slippery feel of sodium hydroxide on your fingers is your skin turning into soap.
`,
  ideas: [
    'Strong acids (HCl, HBr, HI, HNO₃, HClO₄, H₂SO₄) and strong bases (group 1 and heavy group 2 hydroxides) ionise completely.',
    'For a strong acid [H₃O⁺] = C; for a hydroxide [OH⁻] = nC.',
    'Water levels all strong acids to H₃O⁺ and all stronger bases to OH⁻.',
    'Strength (how completely it ionises) is not concentration (how much is dissolved).',
    'Below about 10⁻⁶ M, the charge balance with Kw gives the pH; no acid solution ends up basic.'
  ],
  pitfalls: [
    'A strong acid always has a lower pH than a weak one — Concentration matters as much: 10⁻⁴ M HCl (pH 4) is less acidic than 1 M acetic acid (pH 2.4).',
    '10⁻⁸ M HCl has pH 8 — The water\'s own 10⁻⁷ M of hydronium dominates; the charge balance gives pH 6.98.',
    'Sulfuric acid gives two hydronium ions per molecule, fully — Only the first proton is strong. HSO₄⁻ (pKa 1.99) is only partly ionised in all but dilute solutions.'
  ],
  formulas: [
    {
      name: 'pH of a strong acid, counting water\'s own ions',
      expr: 'pH = -log(C/2 + sqrt(C^2/4 + Kw))', tex: '\\mathrm{pH} = -\\log\\left(\\frac{C}{2} + \\sqrt{\\frac{C^2}{4} + K_w}\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}', signed: true },
        C: { name: 'acid concentration (mol/L)', value: 1.0e-8 },
        Kw: { name: 'ion product of water (25 °C)', value: 1.0e-14, fixed: true, tex: 'K_w' }
      },
      note: 'From the charge balance [H₃O⁺] = [A⁻] + [OH⁻]. Above 10⁻⁶ M it is simply pH = −log C; the default shows where the simple rule breaks down.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A trace of hydrochloric acid, {C} mol/L, is dissolved in pure water at 25 °C ($K_w$ = {Kw}). What is the pH?',
        C: 'What concentration of a strong monoprotic acid, in mol/L, gives pH {pH} at 25 °C ($K_w$ = {Kw})?'
      }
    },
    {
      name: 'pH of a strong base',
      expr: 'pH = pKw + log(n*C)', tex: '\\mathrm{pH} = {\\mathrm{p}K}_w + \\log(n\\,C)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}', signed: true },
        pKw: { name: 'pKw (14.00 at 25 °C)', value: 14.00, fixed: true, tex: '{\\mathrm{p}K}_w' },
        n: { name: 'hydroxide ions per formula unit', int: true, value: 2, min: 1, max: 2 },
        C: { name: 'base concentration (mol/L)', value: 0.0050 }
      },
      note: 'n = 1 for NaOH and KOH, 2 for Ca(OH)₂ and Ba(OH)₂. Valid above about 10⁻⁶ M.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'What is the pH at 25 °C (${\\mathrm{p}K}_w$ = {pKw}) of a {C} mol/L solution of a hydroxide with {n} hydroxide ions per formula unit?',
        C: 'What concentration, in mol/L, of a hydroxide with {n} OH⁻ per formula unit has pH {pH} at 25 °C (${\\mathrm{p}K}_w$ = {pKw})?'
      }
    },
    {
      name: 'Excess acid after mixing a strong acid and a strong base',
      expr: 'Cx = (Ca*Va - Cb*Vb)/(Va + Vb)', tex: 'C_x = \\frac{C_a V_a - C_b V_b}{V_a + V_b}',
      vars: {
        Cx: { name: 'excess H₃O⁺ (negative: excess OH⁻)', q: 'concentration', unit: 'M', signed: true, tex: 'C_x' },
        Ca: { name: 'acid concentration', q: 'concentration', unit: 'M', value: 0.100, tex: 'C_a' },
        Va: { name: 'acid volume', q: 'volume', unit: 'mL', value: 25.0, tex: 'V_a' },
        Cb: { name: 'base concentration', q: 'concentration', unit: 'M', value: 0.100, tex: 'C_b' },
        Vb: { name: 'base volume', q: 'volume', unit: 'mL', value: 20.0, tex: 'V_b' }
      },
      note: 'For a monoprotic acid and a base with one OH⁻. A positive result is [H₃O⁺], so pH = −log of it in mol/L; a negative one is excess hydroxide.',
      practice: { unknowns: ['Cx'] },
      stories: {
        Cx: '{Va} of {Ca} hydrochloric acid is mixed with {Vb} of {Cb} sodium hydroxide. What concentration of excess acid is left (negative if hydroxide is in excess)?',
        Vb: 'How much {Cb} sodium hydroxide must be added to {Va} of {Ca} hydrochloric acid to leave an excess of {Cx} acid?'
      }
    }
  ],
  examples: [
    {
      title: 'Barium hydroxide',
      q: 'What is the pH of 0.0050 M $\\ce{Ba(OH)2}$ at 25 °C?',
      steps: [
        'Each formula unit gives two hydroxide ions: $[\\ce{OH-}] = 2 \\times 0.0050 = 0.010$ mol/L.',
        'pOH = −log 0.010 = 2.00.',
        'pH = 14.00 − 2.00 = 12.00.'
      ],
      a: 'pH 12.00.'
    },
    {
      title: 'Partial neutralisation',
      q: '25.0 mL of 0.100 M HCl is mixed with 20.0 mL of 0.100 M NaOH. What is the pH?',
      steps: [
        'Amounts: $n(\\ce{H3O+}) = 25.0 \\times 0.100 = 2.50$ mmol; $n(\\ce{OH-}) = 20.0 \\times 0.100 = 2.00$ mmol.',
        'They react one to one, leaving 0.50 mmol of hydronium.',
        'Total volume 45.0 mL: $[\\ce{H3O+}] = 0.50/45.0 = 0.0111$ mol/L.',
        'pH = −log 0.0111 = 1.95.'
      ],
      a: 'pH 1.95 — still strongly acidic with 80 % of the acid neutralised.'
    },
    {
      title: 'An extremely dilute acid',
      q: 'What is the pH of $1.0\\times10^{-8}$ M HCl at 25 °C?',
      steps: [
        'The naive answer, pH 8, would make an acid solution basic: water\'s own ions cannot be ignored.',
        { text: 'Charge balance, $[\\ce{H3O+}] = C + K_w/[\\ce{H3O+}]$, solved as a quadratic:', tex: '[\\ce{H3O+}] = \\frac{10^{-8}}{2} + \\sqrt{\\frac{10^{-16}}{4} + 10^{-14}} = 1.05\\times10^{-7}\\ \\mathrm{mol/L}' },
        'pH = −log(1.05 × 10⁻⁷) = 6.98.'
      ],
      a: 'pH 6.98: very slightly acidic.'
    }
  ],
  quiz: [
    { q: 'Which of these is a strong acid in water?', choices: ['$\\ce{HF}$', '$\\ce{HNO3}$', '$\\ce{CH3COOH}$', '$\\ce{H2CO3}$'], a: 1,
      why: 'Nitric acid ionises completely. Hydrofluoric, acetic and carbonic acids are weak: most of their molecules keep their protons.' },
    { q: 'What is the pH of 0.025 M nitric acid?', answer: 1.60,
      why: 'Strong: [H₃O⁺] = 0.025 mol/L, and −log 0.025 = 1.60.' },
    { q: 'What is the pH of 0.010 M $\\ce{Ba(OH)2}$ at 25 °C?', answer: 12.30,
      why: '[OH⁻] = 2 × 0.010 = 0.020 mol/L, pOH = 1.70, pH = 14.00 − 1.70 = 12.30.' },
    { q: 'A solution of a strong acid always has a lower pH than a solution of a weak acid.', a: false,
      why: 'Concentration counts too. 10⁻⁴ M HCl has pH 4.0; 1 M acetic acid, weak as it is, has pH 2.4.' },
    { q: 'What is the pH of $1.0\\times10^{-9}$ M HCl?', choices: ['9.0', 'just under 7.0', '6.0', 'exactly 9.0 minus 2'], a: 1,
      why: 'The acid adds only 1 % to the 10⁻⁷ M hydronium from water: the charge balance gives pH 6.998. An acid can never make water basic.' }
  ],
  applications: [
    'Steel pickling in hydrochloric acid before galvanising or cold rolling.',
    'Lead–acid batteries, whose sulfuric acid is consumed as they discharge (a hydrometer reads the state of charge).',
    'pH correction in water treatment with sodium hydroxide or sulfuric acid.',
    'Drain cleaners (NaOH) and descalers (HCl, sulfamic acid) at home.'
  ],
  sim: 'ab-strong-weak'
},

{
  id: 'weak-acids', parent: 'acid-base-theory', title: 'Weak acids and Ka', level: 2,
  short: 'A weak acid ionises only partly; its acid constant Ka (or pKa = −log Ka) says how far. From Ka and the concentration follow the pH and the percentage ionised, which grows as the acid is diluted.',
  keywords: ['weak acid', 'Ka', 'pKa', 'acid dissociation constant', 'acid ionisation constant', 'percentage ionisation', 'degree of dissociation', 'Ostwald dilution law', 'acetic acid', 'ethanoic acid', 'hydrofluoric acid', 'hypochlorous acid', 'carboxylic acid', 'approximation', '5 % rule'],
  prereq: ['strong-acids-bases', 'equilibrium-constant', 'ice-tables'],
  related: ['weak-bases', 'polyprotic-acids', 'buffers', 'henderson-hasselbalch', 'le-chatelier', 'math:quadratic-equations', 'carboxylic-acids-esters'],
  body: `
Most acids do not give up their protons completely. Acetic acid, the acid of vinegar, reaches an equilibrium in which most molecules keep their proton:

$$\\ce{CH3COOH + H2O <=> H3O+ + CH3COO-}$$

In 0.10 M acetic acid only about 1.3 % of the molecules are ionised at any moment — though which ones keeps changing, since protons are handed back and forth all the time ([[dynamic-equilibrium]]). The pH is 2.88, against 1.00 for a strong acid at the same concentration.

### The acid dissociation constant
For a weak acid $\\ce{HA + H2O <=> H3O+ + A-}$, the [[equilibrium-constant]] (water left out, concentrations in mol/L) is the **acid dissociation constant**

$$K_a = \\frac{[\\ce{H3O+}][\\ce{A-}]}{[\\ce{HA}]}, \\qquad \\mathrm{p}K_a = -\\log K_a$$

A larger $K_a$ — a **smaller** $\\mathrm{p}K_a$ — means a stronger acid, and each unit of $\\mathrm{p}K_a$ is a factor of ten.

| Acid | Formula | $K_a$ at 25 °C | $\\mathrm{p}K_a$ |
|---|---|---|---|
| hydrogensulfate ion | $\\ce{HSO4-}$ | $1.0\\times10^{-2}$ | 1.99 |
| hydrofluoric | $\\ce{HF}$ | $6.8\\times10^{-4}$ | 3.17 |
| formic (methanoic) | $\\ce{HCOOH}$ | $1.8\\times10^{-4}$ | 3.75 |
| lactic | $\\ce{CH3CH(OH)COOH}$ | $1.4\\times10^{-4}$ | 3.86 |
| benzoic | $\\ce{C6H5COOH}$ | $6.3\\times10^{-5}$ | 4.20 |
| acetic (ethanoic) | $\\ce{CH3COOH}$ | $1.75\\times10^{-5}$ | 4.76 |
| carbonic (dissolved $\\ce{CO2}$) | $\\ce{H2CO3}$ | $4.5\\times10^{-7}$ | 6.35 |
| hypochlorous | $\\ce{HOCl}$ | $3.0\\times10^{-8}$ | 7.53 |
| hydrocyanic | $\\ce{HCN}$ | $6.2\\times10^{-10}$ | 9.21 |
| ammonium ion | $\\ce{NH4+}$ | $5.6\\times10^{-10}$ | 9.25 |
| phenol | $\\ce{C6H5OH}$ | $1.0\\times10^{-10}$ | 10.0 |

### Calculating the pH
Set up an [[ice-tables|ICE table]] for an acid of concentration $C$. If $x$ mol/L ionises, $[\\ce{H3O+}] = [\\ce{A-}] = x$ and $[\\ce{HA}] = C - x$:

$$K_a = \\frac{x^2}{C - x}$$

a [[math:quadratic-equations|quadratic]] in $x$. When the acid is only slightly ionised ($x \\ll C$), drop the $x$ below the line:

$$x \\approx \\sqrt{K_a C}, \\qquad \\mathrm{pH} \\approx \\tfrac12\\left(\\mathrm{p}K_a - \\log C\\right)$$

For 0.10 M acetic acid, $x = \\sqrt{1.75\\times10^{-5} \\times 0.10} = 1.32\\times10^{-3}$ mol/L and pH 2.88 — the exact quadratic agrees to two decimals. The shortcut holds while less than about 5 % is ionised, roughly when $C/K_a > 400$. For $10^{-4}$ M acetic acid it fails: it predicts 42 % ionised and pH 4.38, while the truth is 34 % and pH 4.47. Water's own ions only matter when $K_a C$ approaches $10^{-12}$.

### Dilution raises the percentage ionised
The fraction ionised is $\\alpha = x/C \\approx \\sqrt{K_a/C}$. Dilute a hundredfold and $\\alpha$ rises tenfold: 1.3 % at 0.10 M, 12 % at 0.0010 M, approaching 100 % at extreme dilution. There are more particles on the right of the equation, so spreading them out favours ionisation — [[le-chatelier|Le Chatelier's principle]] again. This is **Ostwald's dilution law**. The pH still rises on dilution, only more slowly than for a strong acid.

### What makes an acid weak?
Hydrofluoric acid is weak while $\\ce{HCl}$ is strong because the $\\ce{H-F}$ bond is very strong and the small fluoride ion holds its charge tightly. In carboxylic acids the charge of the anion is shared over two oxygen atoms, which is what makes them acids at all; electron-withdrawing groups nearby strengthen them — chloroacetic acid ($\\mathrm{p}K_a$ 2.87) is nearly 80 times stronger than acetic acid.

> [!warn] Weak does not mean harmless. Hydrofluoric acid barely ionises, but its undissociated molecules pass through skin and bind the calcium in tissue and blood. Burns can be deep and delayed, and a splash the size of a palm can be fatal.
`,
  ideas: [
    'A weak acid ionises partly: HA + H₂O ⇌ H₃O⁺ + A⁻, with Ka = [H₃O⁺][A⁻]/[HA].',
    'Smaller pKa means stronger acid; one pKa unit is a factor of ten in Ka.',
    'For an acid alone, Ka = x²/(C − x); when x ≪ C, [H₃O⁺] ≈ √(Ka·C).',
    'The percentage ionised, ≈ √(Ka/C), grows as the acid is diluted.',
    'Weak acids still neutralise their full amount of base: the un-ionised molecules react as the base removes H₃O⁺.'
  ],
  pitfalls: [
    'A weak acid is a dilute acid — Weak means partly ionised at any concentration. Glacial acetic acid is concentrated and weak; 10⁻⁴ M HCl is dilute and strong.',
    'A weak acid needs less base to neutralise — 25 mL of 0.1 M acetic acid needs exactly as much NaOH as 25 mL of 0.1 M HCl. The reserve of HA molecules reacts as the base is added.',
    'The square-root shortcut always works — It fails when more than about 5 % ionises: for dilute solutions or fairly strong acids (HF, HSO₄⁻), solve the quadratic.'
  ],
  formulas: [
    {
      name: 'Ka of a weak acid on its own',
      expr: 'Ka = H^2/(C - H)', tex: 'K_a = \\frac{\\mathrm{[\\ce{H3O+}]}^2}{C - \\mathrm{[\\ce{H3O+}]}}',
      vars: {
        Ka: { name: 'acid dissociation constant', value: 1.75e-5, tex: 'K_a' },
        C: { name: 'acid concentration (mol/L)', value: 0.10 },
        H: { name: '[H₃O⁺] (mol/L)', tex: '\\mathrm{[\\ce{H3O+}]}' }
      },
      solveFor: 'H',
      note: 'Exact for a weak acid dissolved in water (as long as water\'s own ions are negligible); no square-root approximation. Defaults: 0.10 M acetic acid. Then pH = −log[H₃O⁺].',
      practice: { unknowns: ['H', 'Ka', 'C'] },
      stories: {
        H: 'What is the hydronium-ion concentration, in mol/L, in a {C} mol/L solution of an acid with $K_a$ = {Ka}?',
        Ka: 'A {C} mol/L solution of a weak acid contains {H} mol/L of hydronium ions. What is $K_a$?',
        C: 'What concentration of an acid with $K_a$ = {Ka} gives a hydronium-ion concentration of {H} mol/L?'
      }
    },
    {
      name: 'pKa',
      expr: 'pKa = -log(Ka)', tex: '{\\mathrm{p}K}_a = -\\log K_a',
      vars: {
        pKa: { name: 'pKa', tex: '{\\mathrm{p}K}_a' },
        Ka: { name: 'acid dissociation constant', value: 6.8e-4, tex: 'K_a' }
      },
      note: 'Default: hydrofluoric acid. Strong acids have Ka above 1 and a negative pKa.',
      stories: {
        pKa: 'A weak acid has $K_a$ = {Ka}. What is its ${\\mathrm{p}K}_a$?',
        Ka: 'A weak acid has ${\\mathrm{p}K}_a$ = {pKa}. What is its $K_a$?'
      }
    },
    {
      name: 'pH of a weak acid (square-root approximation)',
      expr: 'pH = (pKa - log(C))/2', tex: '\\mathrm{pH} \\approx \\tfrac12\\left({\\mathrm{p}K}_a - \\log C\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        C: { name: 'acid concentration (mol/L)', value: 0.10 }
      },
      note: 'Good when less than about 5 % is ionised (C/Ka > 400). Otherwise use the exact Ka formula above.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'Estimate the pH of a {C} mol/L solution of a weak acid with ${\\mathrm{p}K}_a$ = {pKa}.',
        C: 'What concentration, in mol/L, of a weak acid with ${\\mathrm{p}K}_a$ = {pKa} has pH {pH}?'
      }
    },
    {
      name: 'Fraction ionised (approximate)',
      expr: 'alpha = sqrt(Ka/C)', tex: '\\alpha \\approx \\sqrt{\\frac{K_a}{C}}',
      vars: {
        alpha: { name: 'fraction of the acid ionised', q: 'ratio', unit: '%', tex: '\\alpha' },
        Ka: { name: 'acid dissociation constant', value: 1.75e-5, tex: 'K_a' },
        C: { name: 'acid concentration (mol/L)', value: 0.0010 }
      },
      note: 'Ostwald\'s dilution law in its simplest form: a hundredfold dilution gives ten times the fraction ionised. Accurate while α stays below about 5 %; it overestimates beyond that.',
      practice: { unknowns: ['alpha', 'C'] },
      stories: {
        alpha: 'Roughly what percentage of the molecules is ionised in a {C} mol/L solution of a weak acid with $K_a$ = {Ka}?',
        C: 'At what concentration, in mol/L, is an acid with $K_a$ = {Ka} {alpha} ionised?'
      }
    }
  ],
  examples: [
    {
      title: 'The pH of vinegar',
      q: 'Table vinegar contains 5.0 g of acetic acid (60.05 g/mol) per 100 mL. Estimate its pH and the percentage ionised ($K_a = 1.75\\times10^{-5}$).',
      steps: [
        'Concentration: $50\\ \\mathrm{g/L} \\div 60.05\\ \\mathrm{g/mol} = 0.833$ mol/L.',
        '$C/K_a$ is about 48 000, so the shortcut is safe: $x = \\sqrt{1.75\\times10^{-5} \\times 0.833} = 3.82\\times10^{-3}$ mol/L.',
        'pH = −log(3.82 × 10⁻³) = 2.42.',
        'Percentage ionised: $3.82\\times10^{-3}/0.833 = 0.46\\ \\%$.'
      ],
      a: 'pH ≈ 2.4, with fewer than 1 molecule in 200 ionised.'
    },
    {
      title: 'Ka from a measured pH',
      q: 'A 0.020 M solution of benzoic acid has pH 2.96. Find $K_a$ and $\\mathrm{p}K_a$.',
      steps: [
        '$[\\ce{H3O+}] = 10^{-2.96} = 1.10\\times10^{-3}$ mol/L, and $[\\ce{A-}]$ is the same.',
        '$[\\ce{HA}] = 0.020 - 0.0011 = 0.0189$ mol/L.',
        { text: 'Put them into the constant:', tex: 'K_a = \\frac{(1.10\\times10^{-3})^2}{0.0189} = 6.4\\times10^{-5}' },
        '$\\mathrm{p}K_a = -\\log(6.4\\times10^{-5}) = 4.20$.'
      ],
      a: 'Ka ≈ 6.4 × 10⁻⁵, pKa 4.20.'
    },
    {
      title: 'When the shortcut fails',
      q: 'Compare the shortcut with the exact answer for $1.0\\times10^{-4}$ M acetic acid.',
      steps: [
        'Shortcut: $x = \\sqrt{1.75\\times10^{-5}\\times10^{-4}} = 4.18\\times10^{-5}$ mol/L — 42 % of the acid, far more than 5 %.',
        { text: 'Exact: solve $x^2 + K_a x - K_a C = 0$:', tex: 'x = \\frac{-K_a + \\sqrt{K_a^2 + 4K_aC}}{2} = 3.40\\times10^{-5}\\ \\mathrm{mol/L}' },
        'pH 4.47 exactly (34 % ionised), against 4.38 from the shortcut.'
      ],
      a: 'The quadratic gives pH 4.47; the shortcut is off by 0.09 because the acid is a third ionised.'
    }
  ],
  quiz: [
    { q: 'Acid X has $\\mathrm{p}K_a$ 3.2 and acid Y has $\\mathrm{p}K_a$ 4.8. Which is stronger?', choices: ['X: its Ka is about 40 times larger', 'Y: its pKa is larger', 'X, but only 1.6 times stronger', 'neither: pKa says nothing about strength'], a: 0,
      why: 'Smaller pKa means larger Ka. The difference of 1.6 units is a factor of 10^1.6 ≈ 40 in Ka.' },
    { q: 'What is the pH of 0.10 M hydrofluoric acid ($K_a = 6.8\\times10^{-4}$)?', answer: 2.10,
      why: 'x²/(0.10 − x) = 6.8 × 10⁻⁴ gives x = 7.9 × 10⁻³ mol/L (8 % ionised, so the quadratic is worth solving), and pH = 2.10.' },
    { q: 'Acetic acid is diluted from 0.10 M to 0.0010 M. The percentage ionised…', choices: ['stays at 1.3 %', 'rises to about 12 %', 'falls to 0.013 %', 'rises to 100 %'], a: 1,
      why: 'α ≈ √(Ka/C): a hundredfold dilution raises α tenfold, from 1.3 % to about 12 %.' },
    { q: 'A weak acid is one that has been diluted with a lot of water.', a: false,
      why: 'Weak means partly ionised, at any concentration. Pure (glacial) acetic acid is concentrated and still weak.' },
    { q: 'Which needs more sodium hydroxide to neutralise: 25 mL of 0.10 M HCl or 25 mL of 0.10 M acetic acid?', choices: ['the HCl', 'the acetic acid', 'the same amount', 'the acetic acid cannot be fully neutralised'], a: 2,
      why: 'Both contain 2.5 mmol of acid protons. As hydroxide removes H₃O⁺, more acetic acid ionises (Le Chatelier) until all of it has reacted.' }
  ],
  applications: [
    'Vinegar and pickling: undissociated acetic acid slips into microbes and acidifies them from inside.',
    'Swimming pools: at pH 7.5 about half the chlorine is present as the powerful disinfectant HOCl (pKa 7.53); above pH 8 most is the weaker OCl⁻.',
    'Lactic acid in yoghurt, sourdough and tired muscles.',
    'Hydrofluoric acid etches glass and cleans silicon wafers in chip manufacturing.'
  ],
  sim: ['ab-strong-weak', { id: 'ab-species', params: { acid: 'acetic' } }]
},

{
  id: 'weak-bases', parent: 'acid-base-theory', title: 'Weak bases and Kb', level: 2,
  short: 'A weak base takes a proton from water only partly, leaving some hydroxide behind. Its constant Kb works just like Ka, and for a conjugate pair Ka × Kb = Kw.',
  keywords: ['weak base', 'Kb', 'pKb', 'base dissociation constant', 'ammonia', 'amine', 'methylamine', 'aniline', 'pyridine', 'conjugate acid', 'Ka Kb = Kw', 'pKa + pKb = 14', 'free base', 'hydrochloride'],
  prereq: ['weak-acids', 'water-autoionization', 'acid-base-definitions'],
  related: ['salt-hydrolysis', 'buffers', 'titration-curves', 'functional-groups', 'amino-acids-proteins'],
  body: `
A weak base takes a proton from water, but only partly. Ammonia is the classic example:

$$\\ce{NH3 + H2O <=> NH4+ + OH-}$$

The lone pair on nitrogen accepts a proton from a water molecule, and the hydroxide left behind makes the solution basic — that is how a substance with no $\\ce{OH}$ in its formula can be a base. In 0.10 M ammonia only about 1.3 % of the molecules are protonated: the pH is 11.1, not the 13.0 of 0.10 M sodium hydroxide.

### The base dissociation constant
With water left out, the equilibrium constant is

$$K_b = \\frac{[\\ce{BH+}][\\ce{OH-}]}{[\\ce{B}]}, \\qquad \\mathrm{p}K_b = -\\log K_b$$

and the calculation mirrors the one for [[weak-acids]]. For a base of concentration $C$, $[\\ce{OH-}] = x$ with $K_b = x^2/(C - x)$, and when $x \\ll C$:

$$[\\ce{OH-}] \\approx \\sqrt{K_b C}, \\qquad \\mathrm{pOH} \\approx \\tfrac12(\\mathrm{p}K_b - \\log C), \\qquad \\mathrm{pH} = \\mathrm{p}K_w - \\mathrm{pOH}$$

The one extra step is the last: you find hydroxide first, then convert to pH.

### Conjugate pairs: $K_a K_b = K_w$
Every weak base has a conjugate acid, and their constants are tied together. Multiply $K_a$ of $\\ce{NH4+}$ by $K_b$ of $\\ce{NH3}$ and everything cancels except $[\\ce{H3O+}][\\ce{OH-}]$:

$$K_a K_b = K_w, \\qquad \\mathrm{p}K_a + \\mathrm{p}K_b = 14.00 \\ \\text{at 25 °C}$$

The stronger an acid, the weaker its conjugate base, in exact inverse proportion. Ammonium ion ($\\mathrm{p}K_a$ 9.25) pairs with ammonia ($\\mathrm{p}K_b$ 4.75). Many tables give only the $\\mathrm{p}K_a$ of the conjugate acid $\\ce{BH+}$, for bases as well as acids: a **higher** $\\mathrm{p}K_a$ of $\\ce{BH+}$ means a **stronger** base. The anions of weak acids are weak bases too — acetate has $K_b = 10^{-14}/(1.75\\times10^{-5}) = 5.7\\times10^{-10}$, which is why sodium acetate solutions are slightly basic ([[salt-hydrolysis]]).

| Base | Conjugate acid | $K_b$ | $\\mathrm{p}K_b$ |
|---|---|---|---|
| methylamine $\\ce{CH3NH2}$ | $\\ce{CH3NH3+}$ | $4.4\\times10^{-4}$ | 3.36 |
| carbonate $\\ce{CO3^2-}$ | $\\ce{HCO3-}$ | $2.1\\times10^{-4}$ | 3.67 |
| ammonia $\\ce{NH3}$ | $\\ce{NH4+}$ | $1.8\\times10^{-5}$ | 4.75 |
| hypochlorite $\\ce{OCl-}$ | $\\ce{HOCl}$ | $3.4\\times10^{-7}$ | 6.47 |
| pyridine $\\ce{C5H5N}$ | $\\ce{C5H5NH+}$ | $1.7\\times10^{-9}$ | 8.77 |
| acetate $\\ce{CH3COO-}$ | $\\ce{CH3COOH}$ | $5.7\\times10^{-10}$ | 9.24 |
| aniline $\\ce{C6H5NH2}$ | $\\ce{C6H5NH3+}$ | $4.3\\times10^{-10}$ | 9.37 |

### Nitrogen: the home of weak bases
Most neutral weak bases are **amines** — ammonia with carbon groups in place of hydrogen — and their basicity comes from the lone pair on nitrogen. Alkyl groups push electron density onto the nitrogen and strengthen the base (methylamine is about 25 times stronger than ammonia); a benzene ring draws the lone pair into its ring of electrons and makes aniline some 40 000 times weaker ([[aromatic-compounds]]).

Amines are behind the smell of fish (trimethylamine) — and behind the old trick of squeezing lemon over it: the acid turns the volatile amine into a non-volatile ammonium salt. Many drugs are amines (caffeine, nicotine, morphine, most local anaesthetics) and are sold as hydrochloride salts, which dissolve in water; the neutral "free base" is the form that crosses cell membranes. In the body, the side chains of lysine, arginine and histidine accept protons and set the charge of proteins at a given pH ([[amino-acids-proteins]]).
`,
  ideas: [
    'A weak base B takes a proton from water partly: B + H₂O ⇌ BH⁺ + OH⁻, with Kb = [BH⁺][OH⁻]/[B].',
    'Find [OH⁻] ≈ √(Kb·C) first, then pOH, then pH = pKw − pOH.',
    'For a conjugate pair, Ka × Kb = Kw, so pKa + pKb = 14.00 at 25 °C.',
    'The higher the pKa of BH⁺, the stronger the base B.',
    'Most weak bases are amines: the lone pair on nitrogen takes the proton.'
  ],
  pitfalls: [
    'Ammonia is basic because it contains hydroxide — NH₃ has no OH. It is basic because it takes H⁺ from water, and water left without its proton is OH⁻.',
    'Using Kb gives the pH directly — It gives [OH⁻], hence pOH. Forgetting to subtract from 14 is the commonest slip in base problems.',
    'A high pKa listed for a base means it is weak — Tables often list the pKa of the conjugate acid BH⁺; a high value means BH⁺ holds its proton tightly, so B is a strong base.'
  ],
  formulas: [
    {
      name: 'Kb of a weak base on its own',
      expr: 'Kb = OH^2/(C - OH)', tex: 'K_b = \\frac{\\mathrm{[\\ce{OH-}]}^2}{C - \\mathrm{[\\ce{OH-}]}}',
      vars: {
        Kb: { name: 'base dissociation constant', value: 1.8e-5, tex: 'K_b' },
        C: { name: 'base concentration (mol/L)', value: 0.10 },
        OH: { name: '[OH⁻] (mol/L)', tex: '\\mathrm{[\\ce{OH-}]}' }
      },
      solveFor: 'OH',
      note: 'Exact for a weak base in water. Then pOH = −log[OH⁻] and pH = 14.00 − pOH at 25 °C. Defaults: 0.10 M ammonia.',
      practice: { unknowns: ['OH', 'Kb'] },
      stories: {
        OH: 'What is the hydroxide-ion concentration, in mol/L, in a {C} mol/L solution of a weak base with $K_b$ = {Kb}?',
        Kb: 'A {C} mol/L solution of an amine contains {OH} mol/L of hydroxide ions. What is $K_b$?'
      }
    },
    {
      name: 'Conjugate pair: Ka × Kb = Kw',
      expr: 'Ka*Kb = Kw', tex: 'K_a K_b = K_w',
      vars: {
        Ka: { name: 'Ka of the acid of the pair', value: 1.75e-5, tex: 'K_a' },
        Kb: { name: 'Kb of the base of the pair', tex: 'K_b' },
        Kw: { name: 'ion product of water (25 °C)', value: 1.0e-14, fixed: true, tex: 'K_w' }
      },
      solveFor: 'Kb',
      note: 'Defaults: acetic acid and its conjugate base, acetate.',
      practice: { unknowns: ['Kb', 'Ka'] },
      stories: {
        Kb: 'A weak acid has $K_a$ = {Ka}. What is $K_b$ of its conjugate base at 25 °C ($K_w$ = {Kw})?',
        Ka: 'A weak base has $K_b$ = {Kb}. What is $K_a$ of its conjugate acid at 25 °C ($K_w$ = {Kw})?'
      }
    },
    {
      name: 'pH of a weak base (square-root approximation)',
      expr: 'pH = pKw - (pKb - log(C))/2', tex: '\\mathrm{pH} \\approx {\\mathrm{p}K}_w - \\tfrac12\\left({\\mathrm{p}K}_b - \\log C\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKw: { name: 'pKw (14.00 at 25 °C)', value: 14.00, fixed: true, tex: '{\\mathrm{p}K}_w' },
        pKb: { name: 'pKb of the base', value: 4.75, tex: '{\\mathrm{p}K}_b' },
        C: { name: 'base concentration (mol/L)', value: 0.10 }
      },
      note: 'Good while less than about 5 % of the base is protonated. Defaults: 0.10 M ammonia.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'Estimate the pH at 25 °C (${\\mathrm{p}K}_w$ = {pKw}) of a {C} mol/L solution of a weak base with ${\\mathrm{p}K}_b$ = {pKb}.',
        C: 'What concentration, in mol/L, of a weak base with ${\\mathrm{p}K}_b$ = {pKb} has pH {pH} at 25 °C (${\\mathrm{p}K}_w$ = {pKw})?'
      }
    }
  ],
  examples: [
    {
      title: 'The pH of ammonia solution',
      q: 'What is the pH of 0.10 M ammonia at 25 °C ($K_b = 1.8\\times10^{-5}$)?',
      steps: [
        'Shortcut: $[\\ce{OH-}] = \\sqrt{1.8\\times10^{-5} \\times 0.10} = 1.34\\times10^{-3}$ mol/L (1.3 % protonated, so it is safe).',
        'pOH = −log(1.34 × 10⁻³) = 2.87.',
        'pH = 14.00 − 2.87 = 11.13. Household ammonia, about 1 M, works out at pH 11.6.'
      ],
      a: 'pH 11.13.'
    },
    {
      title: 'Ranking bases from the pKa of their conjugate acids',
      q: 'The conjugate acids of pyridine, ammonia and methylamine have $\\mathrm{p}K_a$ 5.23, 9.25 and 10.64. Rank the bases and find $K_b$ of each.',
      steps: [
        'A higher pKa of BH⁺ means BH⁺ holds its proton more tightly, so B is the stronger base: methylamine > ammonia > pyridine.',
        '$\\mathrm{p}K_b = 14.00 - \\mathrm{p}K_a$: 3.36, 4.75 and 8.77.',
        '$K_b = 10^{-\\mathrm{p}K_b}$: $4.4\\times10^{-4}$, $1.8\\times10^{-5}$ and $1.7\\times10^{-9}$.'
      ],
      a: 'Methylamine (Kb 4.4 × 10⁻⁴) > ammonia (1.8 × 10⁻⁵) > pyridine (1.7 × 10⁻⁹).'
    }
  ],
  quiz: [
    { q: 'Pyridinium ion has $\\mathrm{p}K_a$ 5.23 and ammonium ion 9.25. Which is the stronger base?', choices: ['ammonia', 'pyridine', 'they are equal', 'cannot tell from pKa values'], a: 0,
      why: 'NH₄⁺ is the weaker acid (higher pKa), so its conjugate base, NH₃, is the stronger base. pKb(NH₃) = 4.75, pKb(pyridine) = 8.77.' },
    { q: 'What is the pH of 0.10 M methylamine ($K_b = 4.4\\times10^{-4}$) at 25 °C?', answer: 11.81,
      why: 'x²/(0.10 − x) = 4.4 × 10⁻⁴ gives [OH⁻] = 6.4 × 10⁻³ mol/L, pOH 2.19, pH 11.81.' },
    { q: 'Hydrofluoric acid has $K_a = 6.8\\times10^{-4}$. What is $K_b$ of the fluoride ion at 25 °C?', answer: 1.47e-11,
      why: 'Kb = Kw/Ka = 1.0 × 10⁻¹⁴ / 6.8 × 10⁻⁴ = 1.5 × 10⁻¹¹: a very weak base, as the conjugate of a fairly strong weak acid should be.' },
    { q: 'Ammonia solution is basic because ammonia molecules contain hydroxide groups.', a: false,
      why: 'NH₃ contains no oxygen at all. Its lone pair takes a proton from water, and the water molecule left behind is OH⁻.' },
    { q: 'Why does a squeeze of lemon take away the smell of fish?', choices: ['the acid protonates the volatile amines into non-volatile ammonium salts', 'citric acid is a perfume', 'the lemon oxidises the fish', 'acids break down proteins instantly'], a: 0,
      why: 'Trimethylamine (a weak base) evaporates easily. Protonated to (CH₃)₃NH⁺, it becomes an ion that stays dissolved and no longer reaches your nose.' }
  ],
  applications: [
    'Ammonia cleaners and fertilisers; ammonia scrubbing of acid gases.',
    'Drug formulation: amine drugs are sold as water-soluble hydrochloride salts and absorbed as the free base.',
    'Amine solutions (monoethanolamine) that capture CO₂ and H₂S in gas processing.',
    'Hypochlorite bleach, whose OCl⁻ is a weak base as well as the oxidant.'
  ],
  sim: { id: 'ab-titration', params: { kind: 'wb' } }
},

{
  id: 'polyprotic-acids', parent: 'acid-base-theory', title: 'Polyprotic acids', level: 3,
  short: 'Acids with two or three protons give them up one at a time, each step with its own, much smaller, constant. The first step sets the pH, the amphiprotic ions in between sit at the average of two pKa values, and the pH decides which species dominates.',
  keywords: ['polyprotic', 'diprotic', 'triprotic', 'phosphoric acid', 'carbonic acid', 'citric acid', 'sulfuric acid', 'oxalic acid', 'stepwise dissociation', 'Ka1', 'Ka2', 'amphiprotic', 'hydrogencarbonate', 'bicarbonate', 'distribution diagram', 'speciation', 'alpha fraction', 'zwitterion', 'isoelectric point'],
  prereq: ['weak-acids', 'weak-bases', 'ice-tables'],
  related: ['buffers', 'titration-curves', 'henderson-hasselbalch', 'amino-acids-proteins', 'math:logarithmic-scales'],
  body: `
Some acids have more than one proton to give. Sulfuric acid $\\ce{H2SO4}$ and carbonic acid $\\ce{H2CO3}$ are **diprotic**; phosphoric acid $\\ce{H3PO4}$ and citric acid are **triprotic**. They give up their protons one at a time, each step with its own constant:

$$\\ce{H3PO4 <=> H+ + H2PO4-} \\qquad K_{a1} = 7.1\\times10^{-3}\\ \\ (\\mathrm{p}K_{a1} = 2.15)$$
$$\\ce{H2PO4- <=> H+ + HPO4^2-} \\qquad K_{a2} = 6.3\\times10^{-8}\\ \\ (\\mathrm{p}K_{a2} = 7.20)$$
$$\\ce{HPO4^2- <=> H+ + PO4^3-} \\qquad K_{a3} = 4.5\\times10^{-13}\\ \\ (\\mathrm{p}K_{a3} = 12.35)$$

The constants always fall, usually by a factor of $10^4$ to $10^5$ per step: pulling a positive proton off an ion that is already negative gets harder each time.

| Acid | $\\mathrm{p}K_{a1}$ | $\\mathrm{p}K_{a2}$ | $\\mathrm{p}K_{a3}$ |
|---|---|---|---|
| sulfuric $\\ce{H2SO4}$ | strong | 1.99 | |
| oxalic $\\ce{H2C2O4}$ | 1.25 | 4.27 | |
| phosphoric $\\ce{H3PO4}$ | 2.15 | 7.20 | 12.35 |
| citric $\\ce{C6H8O7}$ | 3.13 | 4.76 | 6.40 |
| carbonic ($\\ce{CO2}$ + $\\ce{H2O}$) | 6.35 | 10.33 | |

### Three consequences of widely spaced constants
**The first step sets the pH.** In 0.10 M phosphoric acid the first ionisation gives 0.023 mol/L of hydronium (pH 1.63); the second adds less than $10^{-7}$ mol/L. Treat the acid as a monoprotic [[weak-acids|weak acid]] with $K_{a1}$.

**The doubly charged anion equals $K_{a2}$.** Because $[\\ce{H+}] \\approx [\\ce{H2PO4-}]$ from the first step, they cancel in the second constant, leaving $[\\ce{HPO4^2-}] \\approx K_{a2} = 6.3\\times10^{-8}$ mol/L — whatever the acid concentration.

**Amphiprotic ions sit in the middle.** Hydrogencarbonate can lose a proton or gain one. In its solution the two tendencies balance, and the pH is close to the average of the neighbouring constants, almost independent of concentration:

$$\\mathrm{pH} \\approx \\tfrac12\\left(\\mathrm{p}K_{a1} + \\mathrm{p}K_{a2}\\right)$$

Baking-soda solution: $\\tfrac12(6.35 + 10.33) = 8.34$. Sodium dihydrogenphosphate: 4.68; disodium hydrogenphosphate: 9.78.

### Which species is present? The distribution diagram
The fraction of the acid in each form depends only on the pH. For a diprotic acid, with $h = [\\ce{H+}]$ in mol/L,

$$\\alpha_{\\ce{H2A}} = \\frac{h^2}{D}, \\quad \\alpha_{\\ce{HA-}} = \\frac{K_{a1} h}{D}, \\quad \\alpha_{\\ce{A^2-}} = \\frac{K_{a1}K_{a2}}{D}, \\qquad D = h^2 + K_{a1} h + K_{a1}K_{a2}$$

Plotted against pH, neighbouring species cross at 50 % exactly where pH = $\\mathrm{p}K_a$; one unit away the ratio is 10 : 1, two units away 100 : 1. At blood pH 7.4, phosphate is 61 % $\\ce{HPO4^2-}$ and 39 % $\\ce{H2PO4-}$ — a good [[buffers|buffer]] pair. Dissolved carbon dioxide is mostly $\\ce{CO2(aq)}$ below pH 6.35, mostly hydrogencarbonate between 6.35 and 10.33, and carbonate above. In fresh water at pH 8.1, 98 % of it is hydrogencarbonate. Sea water is different: its salts shift the constants ($\\mathrm{p}K_{a2}$ ≈ 9.0 in sea water), so about a tenth is carbonate — the ion that corals and shellfish build with, and the one [[ph-scale|ocean acidification]] is eating into.

### Where you meet them
- Phosphoric acid gives cola its sharp taste, converts rust to a stable phosphate layer, and is the starting point of phosphate fertilisers.
- Citric acid (E330) sours drinks and sweets and binds metal ions in descalers.
- Amino acids are diprotic: glycine has $\\mathrm{p}K_a$ values of 2.34 ($\\ce{-COOH}$) and 9.60 ($\\ce{-NH3+}$), so near neutral pH it carries both charges at once, as a **zwitterion**, and its isoelectric point is $\\tfrac12(2.34 + 9.60) = 5.97$ ([[amino-acids-proteins]]).
- Oxalic acid in rhubarb leaves and spinach binds calcium; most kidney stones are calcium oxalate.
`,
  ideas: [
    'Polyprotic acids lose protons one at a time; Ka1 ≫ Ka2 ≫ Ka3, typically by 10⁴–10⁵ per step.',
    'The pH of the acid itself is set by the first step alone.',
    'For H₂A alone, [A²⁻] ≈ Ka2 whatever the concentration.',
    'Amphiprotic ions (HCO₃⁻, H₂PO₄⁻, HPO₄²⁻) give pH ≈ ½(pKa1 + pKa2).',
    'Neighbouring species are equal where pH = pKa; the distribution diagram shows every fraction against pH.'
  ],
  pitfalls: [
    'A diprotic acid gives twice the hydronium of a monoprotic one — Not at equilibrium: the second proton comes off far less readily. 0.1 M H₂CO₃ has almost the same pH as a monoprotic acid with Ka1.',
    'Phosphate in a solution is PO₄³⁻ — Only above pH 12.35. In blood, soil and cola it is H₂PO₄⁻ and HPO₄²⁻ (and H₃PO₄ in cola).',
    'The amphiprotic formula depends on concentration — To a good approximation it does not: 0.1 M and 0.001 M NaHCO₃ both give pH ≈ 8.3.'
  ],
  formulas: [
    {
      name: 'pH of an amphiprotic salt',
      expr: 'pH = (pKa1 + pKa2)/2', tex: '\\mathrm{pH} \\approx \\tfrac12\\left({\\mathrm{p}K}_{a1} + {\\mathrm{p}K}_{a2}\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa1: { name: 'pKa of the step that forms the ion', value: 6.35, tex: '{\\mathrm{p}K}_{a1}', min: 1, max: 8 },
        pKa2: { name: 'pKa of the step that removes its proton', value: 10.33, tex: '{\\mathrm{p}K}_{a2}', min: 6, max: 13 }
      },
      note: 'Use the two pKa values on either side of the ion: 6.35 and 10.33 for HCO₃⁻, 2.15 and 7.20 for H₂PO₄⁻, 7.20 and 12.35 for HPO₄²⁻. Holds unless the solution is very dilute.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A diprotic acid has ${\\mathrm{p}K}_{a1}$ = {pKa1} and ${\\mathrm{p}K}_{a2}$ = {pKa2}. Estimate the pH of a solution of its sodium hydrogen salt, NaHA.'
      }
    },
    {
      name: 'Fraction present as the middle species HA⁻',
      expr: 'a1 = Ka1*H/(H^2 + Ka1*H + Ka1*Ka2)', tex: '\\alpha_{\\ce{HA-}} = \\frac{K_{a1}\\mathrm{[\\ce{H+}]}}{\\mathrm{[\\ce{H+}]}^2 + K_{a1}\\mathrm{[\\ce{H+}]} + K_{a1}K_{a2}}',
      vars: {
        a1: { name: 'fraction as HA⁻', q: 'ratio', unit: '%', tex: '\\alpha_{\\ce{HA-}}' },
        Ka1: { name: 'first acid constant', value: 4.5e-7, tex: 'K_{a1}' },
        Ka2: { name: 'second acid constant', value: 4.7e-11, tex: 'K_{a2}' },
        H: { name: '[H⁺] (mol/L)', value: 5.0e-9, tex: '\\mathrm{[\\ce{H+}]}' }
      },
      note: 'Defaults: the carbonate system at pH 8.3, where hydrogencarbonate peaks. Solving for [H⁺] gives two answers, one on each side of the peak.',
      practice: { unknowns: ['a1'] },
      stories: {
        a1: 'A diprotic acid has $K_{a1}$ = {Ka1} and $K_{a2}$ = {Ka2}. What fraction of it is present as HA⁻ when $[\\ce{H+}]$ = {H} mol/L?'
      }
    }
  ],
  examples: [
    {
      title: 'Phosphoric acid: pH and the trace of hydrogenphosphate',
      q: 'Find the pH of 0.10 M $\\ce{H3PO4}$, and $[\\ce{HPO4^2-}]$ in it.',
      steps: [
        'Only the first step matters for the pH. $K_{a1} = 7.1\\times10^{-3}$ is large, so solve the quadratic $x^2/(0.10 - x) = 7.1\\times10^{-3}$.',
        '$x = 0.0233$ mol/L (23 % ionised — the shortcut would have been poor), so pH = 1.63.',
        'For the second step, $[\\ce{H+}] \\approx [\\ce{H2PO4-}] \\approx 0.0233$ mol/L, which cancel: $[\\ce{HPO4^2-}] \\approx K_{a2} = 6.3\\times10^{-8}$ mol/L.'
      ],
      a: 'pH 1.63; [HPO₄²⁻] ≈ 6.3 × 10⁻⁸ mol/L, three hundred thousand times less than [H₂PO₄⁻].'
    },
    {
      title: 'Phosphate at blood pH',
      q: 'What fractions of the phosphate in blood plasma (pH 7.40) are $\\ce{H2PO4-}$ and $\\ce{HPO4^2-}$ ($\\mathrm{p}K_{a2}$ = 7.20)?',
      steps: [
        'Far from $\\mathrm{p}K_{a1}$ and $\\mathrm{p}K_{a3}$, only these two species matter.',
        'Their ratio is $[\\ce{HPO4^2-}]/[\\ce{H2PO4-}] = 10^{\\,7.40 - 7.20} = 10^{0.20} = 1.58$.',
        'Fractions: $1.58/2.58 = 61\\ \\%$ and $1/2.58 = 39\\ \\%$.'
      ],
      a: '39 % H₂PO₄⁻ and 61 % HPO₄²⁻.'
    }
  ],
  quiz: [
    { q: 'Why is $K_{a2}$ of a diprotic acid always smaller than $K_{a1}$?', choices: ['the second proton must leave an ion that is already negative, which holds it more strongly', 'the second proton is heavier', 'water has been used up', 'Ka2 is measured at a lower temperature'], a: 0,
      why: 'After the first step the acid is an anion, and its charge attracts the remaining protons. Removing a second one costs more energy, so the equilibrium lies further to the left.' },
    { q: 'Estimate the pH of a sodium dihydrogenphosphate ($\\ce{NaH2PO4}$) solution. Phosphoric acid: $\\mathrm{p}K_a$ = 2.15, 7.20, 12.35.', answer: 4.68,
      why: 'H₂PO₄⁻ sits between the first and second steps: pH ≈ ½(2.15 + 7.20) = 4.68.' },
    { q: 'In 0.10 M carbonic acid, $[\\ce{CO3^2-}]$ is approximately…', choices: ['$K_{a2} = 4.7\\times10^{-11}$ mol/L', '0.10 mol/L', '0.05 mol/L', '$\\sqrt{K_{a2}\\times0.10}$ mol/L'], a: 0,
      why: 'The first step makes [H⁺] ≈ [HCO₃⁻]; they cancel in Ka2 = [H⁺][CO₃²⁻]/[HCO₃⁻], leaving [CO₃²⁻] ≈ Ka2.' },
    { q: 'A 0.10 M solution of a diprotic acid has twice the $[\\ce{H+}]$ of a 0.10 M monoprotic acid with the same $K_{a1}$.', a: false,
      why: 'The second ionisation is suppressed: Ka2 is thousands of times smaller, and the H⁺ from the first step pushes it back further. The extra H⁺ is negligible.' },
    { q: 'At pH 7.20, which two phosphate species are present in equal amounts?', choices: ['H₂PO₄⁻ and HPO₄²⁻', 'H₃PO₄ and H₂PO₄⁻', 'HPO₄²⁻ and PO₄³⁻', 'H₃PO₄ and PO₄³⁻'], a: 0,
      why: 'Neighbouring species are equal where pH equals the pKa of the step between them: 7.20 is pKa2, the step from H₂PO₄⁻ to HPO₄²⁻.' }
  ],
  applications: [
    'The carbonate system in oceans, lakes and blood — the largest buffer on the planet.',
    'Phosphoric acid in soft drinks, rust converters and fertiliser production.',
    'Citric acid as food acidulant and as a chelating descaler.',
    'Amino acids and proteins, whose charge at a given pH governs electrophoresis and protein purification.'
  ],
  sim: { id: 'ab-species', params: { acid: 'phosphoric' } }
},

{
  id: 'salt-hydrolysis', parent: 'acid-base-theory', title: 'Acidic and basic salts', level: 2,
  short: 'A salt solution is neutral only if both of its ions are spectators. The anion of a weak acid makes a solution basic, the cation of a weak base makes it acidic, and small highly charged metal ions are acids in their own right.',
  keywords: ['salt hydrolysis', 'hydrolysis', 'acidic salt', 'basic salt', 'neutral salt', 'sodium acetate', 'ammonium chloride', 'sodium carbonate', 'washing soda', 'metal ion acidity', 'hexaaqua', 'aluminium', 'iron(III)', 'alum', 'baking powder', 'spectator ion'],
  prereq: ['weak-acids', 'weak-bases', 'solubility'],
  related: ['buffers', 'titration-curves', 'polyprotic-acids', 'coordination-compounds', 'complex-ion-equilibria'],
  body: `
Neutralise an acid with a base and you get a salt and water — but the salt solution is not necessarily neutral. Sodium acetate gives a pH near 9, ammonium chloride about 5, iron(III) chloride below 2. The ions of a salt are acids and bases in their own right, and whether they act depends on where they came from.

### Four cases
1. **Strong acid + strong base** ($\\ce{NaCl}$, $\\ce{KNO3}$, $\\ce{NaClO4}$): the anion is the conjugate base of a strong acid, too weak to take protons, and group 1 and 2 cations give none. The solution is **neutral**.
2. **Weak acid + strong base** (sodium acetate, $\\ce{Na2CO3}$, $\\ce{NaOCl}$, soaps): the anion is a [[weak-bases|weak base]], $\\ce{A- + H2O <=> HA + OH-}$ with $K_b = K_w/K_a$. The solution is **basic**.
3. **Strong acid + weak base** ($\\ce{NH4Cl}$, $\\ce{NH4NO3}$, amine hydrochlorides): the cation is a [[weak-acids|weak acid]], $\\ce{NH4+ + H2O <=> NH3 + H3O+}$. The solution is **acidic**.
4. **Weak acid + weak base** (ammonium acetate, ammonium carbonate): both ions react and the one with the larger constant wins. The pH is roughly the average of the two $\\mathrm{p}K_a$ values, $\\tfrac12\\left(\\mathrm{p}K_a(\\ce{HA}) + \\mathrm{p}K_a(\\ce{BH+})\\right)$ — for ammonium acetate $\\tfrac12(4.76 + 9.25) = 7.0$, neutral by coincidence.

The old name for these reactions is **hydrolysis**, "splitting by water", but they are ordinary weak-acid and weak-base equilibria and the arithmetic is the same. For 0.10 M sodium acetate: $K_b = 5.7\\times10^{-10}$, $[\\ce{OH-}] = \\sqrt{K_b C} = 7.6\\times10^{-6}$ mol/L, pH 8.88. This is why the [[titration-curves|equivalence point]] of a weak acid titrated with sodium hydroxide lies above 7.

### Metal ions are acids
A small, highly charged metal ion in water holds six water molecules tightly ([[coordination-compounds]]). It draws electron density out of their O–H bonds so strongly that one of them lets a proton go:

$$\\ce{[Fe(H2O)6]^3+ + H2O <=> [Fe(H2O)5(OH)]^2+ + H3O+} \\qquad \\mathrm{p}K_a \\approx 2.2$$

Hydrated iron(III) is about as strong an acid as phosphoric acid; hydrated aluminium ($\\mathrm{p}K_a$ ≈ 5.0) is about as strong as acetic acid. The higher the charge and the smaller the ion, the more acidic: $\\ce{Na+}$ and $\\ce{K+}$ do nothing measurable, $\\ce{Mg^2+}$ very little, $\\ce{Cu^2+}$ and $\\ce{Zn^2+}$ a little. The yellow-brown colour of iron(III) solutions comes from the hydroxo complexes this reaction makes; with a little acid added, the ion stays as the pale violet $\\ce{[Fe(H2O)6]^3+}$.

### Salts at work
- **Washing soda** ($\\ce{Na2CO3}$, pH about 11.5) and **trisodium phosphate** clean because their anions make hydroxide, which turns grease into soap. Soaps themselves, sodium salts of fatty acids, have pH 9–10.
- **Baking powder** mixes sodium hydrogencarbonate with an acidic salt such as a calcium hydrogenphosphate; once wet, the acid salt protonates the hydrogencarbonate and carbon dioxide raises the dough.
- **Alum in water treatment**: aluminium sulfate added to raw water hydrolyses all the way to a fluffy aluminium hydroxide precipitate that sweeps clay and bacteria out with it.
- **Fertilisers acidify soil**: ammonium salts are weak acids, and soil bacteria oxidising ammonium to nitrate release more acid; farmers spread lime to compensate.
- **Swimming pools**: sodium hypochlorite ("liquid chlorine") is basic and raises the pH; sodium hydrogensulfate ("pH minus", $\\mathrm{p}K_a$ 1.99) lowers it.

> [!tip] To predict, ask of each ion: is it the partner of a weak acid or a weak base? Partners of strong acids and strong bases are spectators. If both ions react, compare their constants.
`,
  ideas: [
    'Ions from strong acids (Cl⁻, NO₃⁻, ClO₄⁻) and strong bases (Na⁺, K⁺, Ca²⁺) are spectators.',
    'The anion of a weak acid is a weak base (Kb = Kw/Ka): its salts are basic.',
    'The cation of a weak base is a weak acid: ammonium salts are acidic.',
    'Small, highly charged hydrated metal ions (Fe³⁺, Al³⁺) are acids.',
    'If both ions react, the pH lies near ½(pKa(HA) + pKa(BH⁺)).'
  ],
  pitfalls: [
    'A salt from neutralisation always gives a neutral solution — Only if both parents were strong. Sodium acetate is basic, ammonium chloride acidic.',
    'Metal salts are neutral because metals are not acids — Hydrated Fe³⁺ (pKa 2.2) and Al³⁺ (pKa 5.0) release protons from their water ligands: FeCl₃ solutions are strongly acidic.',
    'Sodium hydrogensulfate is a basic salt because it is a "hydrogen" salt of sodium — HSO₄⁻ is a fairly strong acid (pKa 1.99); NaHSO₄ is sold to lower pool pH.'
  ],
  formulas: [
    {
      name: 'pH of the salt of a weak acid (e.g. sodium acetate)',
      expr: 'pH = (pKw + pKa + log(C))/2', tex: '\\mathrm{pH} \\approx \\tfrac12\\left({\\mathrm{p}K}_w + {\\mathrm{p}K}_a + \\log C\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKw: { name: 'pKw (14.00 at 25 °C)', value: 14.00, fixed: true, tex: '{\\mathrm{p}K}_w' },
        pKa: { name: 'pKa of the parent weak acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        C: { name: 'salt concentration (mol/L)', value: 0.10 }
      },
      note: 'The anion as a weak base with pKb = pKw − pKa, in the square-root approximation. Defaults: 0.10 M sodium acetate.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'What is the pH at 25 °C (${\\mathrm{p}K}_w$ = {pKw}) of a {C} mol/L solution of the sodium salt of a weak acid with ${\\mathrm{p}K}_a$ = {pKa}?',
        C: 'What concentration, in mol/L, of the sodium salt of a weak acid with ${\\mathrm{p}K}_a$ = {pKa} has pH {pH} at 25 °C (${\\mathrm{p}K}_w$ = {pKw})?'
      }
    },
    {
      name: 'pH of the salt of a weak base (e.g. ammonium chloride)',
      expr: 'pH = (pKa - log(C))/2', tex: '\\mathrm{pH} \\approx \\tfrac12\\left({\\mathrm{p}K}_{a,\\ce{BH+}} - \\log C\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the cation BH⁺', value: 9.25, tex: '{\\mathrm{p}K}_{a,\\ce{BH+}}' },
        C: { name: 'salt concentration (mol/L)', value: 0.10 }
      },
      note: 'The cation treated as a weak acid. Defaults: 0.10 M ammonium chloride.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'What is the pH of a {C} mol/L solution of the hydrochloride of a weak base, whose cation BH⁺ has ${\\mathrm{p}K}_a$ = {pKa}?',
        C: 'What concentration, in mol/L, of a salt whose cation BH⁺ has ${\\mathrm{p}K}_a$ = {pKa} gives pH {pH}?'
      }
    },
    {
      name: 'pH of the salt of a weak acid and a weak base',
      expr: 'pH = (pKaA + pKaB)/2', tex: '\\mathrm{pH} \\approx \\tfrac12\\left({\\mathrm{p}K}_{a,\\ce{HA}} + {\\mathrm{p}K}_{a,\\ce{BH+}}\\right)',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKaA: { name: 'pKa of the weak acid HA', value: 4.76, tex: '{\\mathrm{p}K}_{a,\\ce{HA}}', min: 2, max: 8 },
        pKaB: { name: 'pKa of the cation BH⁺', value: 9.25, tex: '{\\mathrm{p}K}_{a,\\ce{BH+}}', min: 6, max: 12 }
      },
      note: 'Independent of concentration, to a first approximation. Defaults: ammonium acetate.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'Estimate the pH of a solution of the salt BHA: the weak acid HA has ${\\mathrm{p}K}_a$ = {pKaA} and the cation BH⁺ has ${\\mathrm{p}K}_a$ = {pKaB}.'
      }
    }
  ],
  examples: [
    {
      title: 'Sodium acetate',
      q: 'What is the pH of 0.10 M sodium acetate? Acetic acid has $K_a = 1.75\\times10^{-5}$.',
      steps: [
        '$\\ce{Na+}$ is a spectator; acetate is a weak base: $\\ce{CH3COO- + H2O <=> CH3COOH + OH-}$.',
        '$K_b = K_w/K_a = 1.0\\times10^{-14}/1.75\\times10^{-5} = 5.7\\times10^{-10}$.',
        '$[\\ce{OH-}] = \\sqrt{5.7\\times10^{-10}\\times0.10} = 7.6\\times10^{-6}$ mol/L, pOH 5.12.',
        'pH = 14.00 − 5.12 = 8.88.'
      ],
      a: 'pH 8.88: basic, although it was made by neutralisation.'
    },
    {
      title: 'Ammonium chloride',
      q: 'What is the pH of 0.10 M ammonium chloride ($K_a$ of $\\ce{NH4+}$ = $5.6\\times10^{-10}$)?',
      steps: [
        '$\\ce{Cl-}$ is a spectator; $\\ce{NH4+}$ is a weak acid.',
        '$[\\ce{H3O+}] = \\sqrt{5.6\\times10^{-10}\\times0.10} = 7.5\\times10^{-6}$ mol/L.',
        'pH = 5.13.'
      ],
      a: 'pH 5.13, the pH at the equivalence point of ammonia titrated with hydrochloric acid (at that concentration).'
    }
  ],
  quiz: [
    { q: 'Which salt gives a basic solution in water?', choices: ['$\\ce{KCl}$', '$\\ce{NH4NO3}$', '$\\ce{Na2CO3}$', '$\\ce{NaNO3}$'], a: 2,
      why: 'Carbonate is the conjugate base of the weak acid HCO₃⁻ and takes protons from water. KCl and NaNO₃ are neutral; NH₄NO₃ is acidic.' },
    { q: 'What is the pH of 0.20 M sodium hypochlorite ($K_a$ of $\\ce{HOCl}$ = $2.95\\times10^{-8}$) at 25 °C?', answer: 10.42,
      why: 'Kb = 10⁻¹⁴/2.95 × 10⁻⁸ = 3.4 × 10⁻⁷; [OH⁻] = √(3.4 × 10⁻⁷ × 0.20) = 2.6 × 10⁻⁴ mol/L; pOH 3.58; pH 10.42.' },
    { q: 'An aluminium chloride solution is…', choices: ['acidic', 'neutral', 'basic', 'acidic only when hot'], a: 0,
      why: 'Cl⁻ is a spectator, but hydrated Al³⁺ (pKa ≈ 5.0) releases protons from its water ligands. 0.1 M AlCl₃ has pH about 3.' },
    { q: 'At the equivalence point of acetic acid titrated with sodium hydroxide, the solution is neutral.', a: false,
      why: 'At that point the flask holds sodium acetate, whose anion is a weak base: the pH is above 7 (about 8.7 for 0.1 M solutions).' },
    { q: 'Ammonium acetate solution has pH close to 7 because…', choices: ['NH₄⁺ as an acid and CH₃COO⁻ as a base are almost equally strong', 'neither ion reacts with water', 'it is a salt of a strong acid and a strong base', 'acetate is a spectator ion'], a: 0,
      why: 'Both ions react, but Ka(NH₄⁺) = 5.6 × 10⁻¹⁰ and Kb(CH₃COO⁻) = 5.7 × 10⁻¹⁰ nearly cancel: pH ≈ ½(4.76 + 9.25) = 7.0.' }
  ],
  applications: [
    'Washing soda, trisodium phosphate and soaps as alkaline cleaners.',
    'Baking powder: an acidic salt and sodium hydrogencarbonate release CO₂ when wet.',
    'Aluminium sulfate and iron(III) chloride as coagulants in drinking-water and sewage treatment.',
    'Soil acidification by ammonium fertilisers, and its correction with lime.'
  ],
  sim: { id: 'ab-titration', params: { kind: 'wa' } }
}

);
