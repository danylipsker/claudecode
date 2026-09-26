/* HYPER-CHEMISTRY · content/solubility-equilibria.js — sparingly soluble salts: the
 * solubility product, the common-ion effect, predicting precipitation and complex-ion
 * equilibria (simulations in sims/equilibrium.js). */
Hyper.add(

{
  id: 'solubility-product', parent: 'solubility-equilibria', title: 'The solubility product', level: 2,
  short: 'A saturated solution of a sparingly soluble salt is an equilibrium between the solid and its ions. The product of the ion concentrations, each raised to its coefficient, is a constant: the solubility product Ksp.',
  keywords: ['solubility product', 'Ksp', 'molar solubility', 'sparingly soluble', 'insoluble salt', 'saturated solution', 'silver chloride', 'barium sulfate', 'calcium fluoride', 'salt effect', 'ion pair'],
  prereq: ['equilibrium-constant', 'solubility', 'molarity'],
  related: ['common-ion-effect', 'precipitation', 'complex-ion-equilibria', 'gravimetric-analysis', 'lattice-energy', 'dynamic-equilibrium'],
  body: `
"Insoluble" salts are never completely insoluble. Shake silver chloride with water and a tiny amount dissolves — about 1.9 mg per litre at 25 °C — until the solution is saturated. From then on ions leave the crystals and settle back on them at equal rates: a [[dynamic-equilibrium|dynamic equilibrium]] between a solid and its ions.

$$\\ce{AgCl(s) <=> Ag+(aq) + Cl-(aq)} \\qquad K_{sp} = [\\ce{Ag+}][\\ce{Cl-}] = 1.8\\times10^{-10}$$

The solid drops out of the expression, as every pure solid does ([[equilibrium-constant]]), so the equilibrium constant is simply the product of the ion concentrations, each raised to its coefficient: the **solubility product**. It applies only while some solid is present; a solution holding less dissolved salt is simply unsaturated.

### From Ksp to solubility
Call the **molar solubility** $s$ the amount of salt that dissolves per litre. For a salt $\\mathrm{M}_a\\mathrm{X}_b$, dissolving $s$ mol/L gives $as$ of the cation and $bs$ of the anion, so

$$K_{sp} = (as)^a\\,(bs)^b = a^a\\,b^b\\,s^{a+b}$$

- 1 : 1 salts (AgCl, BaSO₄): $K_{sp} = s^2$ and $s = \\sqrt{K_{sp}}$. For silver chloride, $s = 1.34\\times10^{-5}$ mol/L.
- 1 : 2 and 2 : 1 salts (CaF₂, PbI₂, Mg(OH)₂, Ag₂CrO₄): $K_{sp} = 4s^3$. Fluorite, $\\ce{CaF2}$, dissolves to $2.1\\times10^{-4}$ mol/L, about 16 mg/L.
- 3 : 2 salts ($\\ce{Ca3(PO4)2}$): $K_{sp} = 108\\,s^5$.

Multiply by the [[molar-mass]] to get grams per litre. Some values at 25 °C:

| Salt | $K_{sp}$ | $s$ (mol/L) | mg per litre |
|---|---|---|---|
| $\\ce{AgCl}$ | $1.8\\times10^{-10}$ | $1.3\\times10^{-5}$ | 1.9 |
| $\\ce{AgBr}$ | $5.0\\times10^{-13}$ | $7.1\\times10^{-7}$ | 0.13 |
| $\\ce{AgI}$ | $8.5\\times10^{-17}$ | $9.2\\times10^{-9}$ | 0.002 |
| $\\ce{BaSO4}$ | $1.1\\times10^{-10}$ | $1.0\\times10^{-5}$ | 2.4 |
| $\\ce{CaCO3}$ (calcite) | $3.4\\times10^{-9}$ | $5.8\\times10^{-5}$ | 5.8 |
| $\\ce{CaF2}$ | $3.5\\times10^{-11}$ | $2.1\\times10^{-4}$ | 16 |
| $\\ce{PbI2}$ | $9.8\\times10^{-9}$ | $1.3\\times10^{-3}$ | 620 |
| $\\ce{Ag2CrO4}$ | $1.1\\times10^{-12}$ | $6.5\\times10^{-5}$ | 22 |
| $\\ce{Mg(OH)2}$ | $5.6\\times10^{-12}$ | $1.1\\times10^{-4}$ | 6.5 |
| $\\ce{Fe(OH)3}$ | $2.8\\times10^{-39}$ | $1.0\\times10^{-10}$ | $10^{-5}$ |

### Comparing salts
Ksp values can be compared directly only between salts of the same formula type. Silver chromate has the smaller $K_{sp}$ ($1.1\\times10^{-12}$ against $1.8\\times10^{-10}$), yet it is about **five times more soluble** than silver chloride, because its $K_{sp}$ contains $s^3$ rather than $s^2$. Convert to $s$ before comparing.

### When the simple picture fails
The arithmetic assumes that the dissolved salt exists only as free ions at low concentration. Real solutions bend the rule, nearly always towards *higher* solubility:
- **Other ions** raise the solubility a little, even when none is shared, because the crowd of ions shields each charge (the *salt effect*, a matter of activities).
- **Ions react with water.** Carbonate, phosphate, fluoride and sulfide are [[weak-bases|bases]], so their salts dissolve far better in acid — which is why vinegar removes limescale and acids attack tooth enamel.
- **Ion pairs form.** From its Ksp, calcium sulfate should dissolve to about 1 g/L; it actually dissolves to about 2 g/L, because much of it stays in solution as neutral $\\ce{CaSO4(aq)}$ pairs.
- **Temperature** changes Ksp like any K. Most salts dissolve better when hot; calcium carbonate and calcium sulfate slightly worse, which is one reason kettles and boilers scale up.

### Where it matters
Barium ions are poisonous, yet barium sulfate is swallowed as an X-ray contrast meal: at 2.4 mg/L it releases too little barium to do harm. Tooth enamel is hydroxyapatite, $\\ce{Ca5(PO4)3OH}$; fluoride swaps in for the hydroxide to make fluorapatite, whose Ksp is many orders of magnitude smaller. Kidney stones are mostly calcium oxalate ($K_{sp} \\approx 2\\times10^{-9}$), which crystallises when urine becomes supersaturated. And [[gravimetric-analysis]] relies on precipitates with tiny Ksp, so that practically none of the analyte stays behind in solution.
`,
  ideas: [
    'A saturated solution is a dynamic equilibrium between the solid and its dissolved ions.',
    'Ksp is the product of the ion concentrations, each raised to its coefficient; the solid does not appear.',
    'For MₐXᵦ, Ksp = aᵃbᵇ s^(a+b). Convert Ksp to the molar solubility s before comparing salts of different formulas.',
    'Ksp applies only while some solid is present.',
    'Ion pairs, reactions of the ions with water and activity effects make real solubilities larger than the simple estimate.'
  ],
  pitfalls: [
    'A smaller Ksp always means a less soluble salt — Only for salts of the same formula type. Ag₂CrO₄ (Ksp = 1.1 × 10⁻¹²) dissolves about five times better than AgCl (1.8 × 10⁻¹⁰).',
    'Adding more solid raises the ion concentrations — A saturated solution is saturated: the extra solid just sits at the bottom, and the ion product stays at Ksp.',
    'Forgetting the coefficient inside the bracket — In CaF₂, [F⁻] = 2s, so Ksp = s(2s)² = 4s³, not s³.'
  ],
  formulas: [
    {
      name: 'Solubility product and molar solubility',
      expr: 'Ksp = a^a*b^b*s^(a + b)', tex: 'K_{sp} = a^a\\,b^b\\,s^{a+b}',
      vars: {
        Ksp: { name: 'solubility product', value: 3.5e-11, tex: 'K_{sp}' },
        a: { name: 'cations per formula unit, a', int: true, fixed: true, value: 1 },
        b: { name: 'anions per formula unit, b', int: true, fixed: true, value: 2 },
        s: { name: 'molar solubility s (mol/L)' }
      },
      solveFor: 's',
      note: 'For a salt $\\mathrm{M}_a\\mathrm{X}_b$ dissolving in pure water, $[\\mathrm{M}] = as$ and $[\\mathrm{X}] = bs$. Defaults: fluorite, $\\ce{CaF2}$ ($a = 1$, $b = 2$). Set $a = b = 1$ for AgCl or BaSO₄.',
      practice: { unknowns: ['s', 'Ksp'] },
      stories: {
        s: 'Calcium fluoride has $K_{sp}$ = {Ksp} at 25 °C. What is its molar solubility in pure water, in mol/L?',
        Ksp: 'A saturated solution of calcium fluoride contains {s} mol/L of dissolved $\\ce{CaF2}$. What is its $K_{sp}$?'
      }
    },
    {
      name: 'Solubility in grams per litre',
      expr: 'S = s*M', tex: 'S = s\\,M',
      vars: {
        S: { name: 'solubility by mass', q: 'density', unit: 'g/L' },
        s: { name: 'molar solubility', q: 'concentration', unit: 'M', value: 2.06e-4 },
        M: { name: 'molar mass of the salt', q: 'molarmass', unit: 'g/mol', value: 78.07 }
      },
      note: 'Defaults: calcium fluoride. Multiply by 1000 for milligrams per litre.',
      practice: { unknowns: ['S', 's'] },
      stories: {
        S: 'A salt of molar mass {M} has a molar solubility of {s}. How many grams dissolve per litre?',
        s: 'At most {S} of a salt with molar mass {M} dissolves in water. What is its molar solubility?'
      }
    }
  ],
  examples: [
    {
      title: 'How much fluorite dissolves?',
      q: 'Calcium fluoride has $K_{sp} = 3.5\\times10^{-11}$ at 25 °C. What is its solubility in pure water in mol/L and in mg/L, and what fluoride concentration does a saturated solution hold?',
      steps: [
        '$\\ce{CaF2(s) <=> Ca^2+ + 2F-}$: dissolving $s$ gives $[\\ce{Ca^2+}] = s$ and $[\\ce{F-}] = 2s$.',
        '$K_{sp} = s\\,(2s)^2 = 4s^3$, so $s = \\sqrt[3]{3.5\\times10^{-11}/4} = 2.06\\times10^{-4}$ mol/L.',
        'By mass: $2.06\\times10^{-4} \\times 78.07 = 0.0161$ g/L, or 16 mg/L.',
        'Fluoride: $2s = 4.1\\times10^{-4}$ mol/L $\\times$ 19.00 g/mol = 7.8 mg/L — several times the fluoride level in drinking water. Groundwater that has soaked through fluorite-bearing rock can indeed carry too much fluoride.'
      ],
      a: 's = 2.1 × 10⁻⁴ mol/L (16 mg/L); [F⁻] = 4.1 × 10⁻⁴ mol/L.'
    },
    {
      title: 'Ksp from a measured solubility',
      q: 'A saturated solution of barium sulfate contains 2.45 mg of $\\ce{BaSO4}$ (233.39 g/mol) per litre. What is its $K_{sp}$?',
      steps: [
        '$s = 2.45\\times10^{-3}/233.39 = 1.05\\times10^{-5}$ mol/L.',
        '$\\ce{BaSO4 <=> Ba^2+ + SO4^2-}$: $[\\ce{Ba^2+}] = [\\ce{SO4^2-}] = s$.',
        '$K_{sp} = s^2 = (1.05\\times10^{-5})^2 = 1.1\\times10^{-10}$.'
      ],
      a: 'K_sp = 1.1 × 10⁻¹⁰.'
    },
    {
      title: 'Which dissolves better: AgCl or Ag₂CrO₄?',
      q: 'Silver chloride has $K_{sp} = 1.8\\times10^{-10}$ and silver chromate $K_{sp} = 1.1\\times10^{-12}$. Which is more soluble in water?',
      steps: [
        'AgCl: $s = \\sqrt{1.8\\times10^{-10}} = 1.34\\times10^{-5}$ mol/L.',
        '$\\ce{Ag2CrO4 <=> 2Ag+ + CrO4^2-}$: $K_{sp} = (2s)^2 s = 4s^3$, so $s = \\sqrt[3]{1.1\\times10^{-12}/4} = 6.5\\times10^{-5}$ mol/L.',
        'Silver chromate dissolves about five times better, despite a Ksp more than a hundred times smaller.'
      ],
      a: 'Ag₂CrO₄ (6.5 × 10⁻⁵ M against 1.3 × 10⁻⁵ M).'
    }
  ],
  quiz: [
    { q: 'What is the solubility product expression for calcium phosphate, $\\ce{Ca3(PO4)2}$?', choices: ['$[\\ce{Ca^2+}]^3[\\ce{PO4^3-}]^2$', '$[\\ce{Ca^2+}][\\ce{PO4^3-}]$', '$3[\\ce{Ca^2+}] \\times 2[\\ce{PO4^3-}]$', '$[\\ce{Ca^2+}]^3[\\ce{PO4^3-}]^2/[\\ce{Ca3(PO4)2}]$'], a: 0,
      why: 'Each ion concentration is raised to its coefficient in the dissolving equation, and the solid does not appear.' },
    { q: 'What is the molar solubility of silver chloride in pure water ($K_{sp} = 1.8\\times10^{-10}$), in mol/L?', answer: 1.34e-5,
      why: 'For a 1 : 1 salt, $K_{sp} = s^2$, so $s = \\sqrt{1.8\\times10^{-10}} = 1.34\\times10^{-5}$ mol/L.' },
    { q: 'Of two salts, the one with the smaller Ksp is always the less soluble.', a: false,
      why: 'Only when they have the same formula type. Ag₂CrO₄ has a smaller Ksp than AgCl yet dissolves about five times better, because its Ksp contains s³.' },
    { q: 'More solid silver chloride is added to a saturated solution of it. The concentration of Ag⁺…', choices: ['rises', 'falls', 'stays the same', 'rises, then falls'], a: 2,
      why: 'The solution is already saturated: the ion product is fixed at Ksp, and the extra solid just sits at the bottom.' },
    { q: 'Magnesium hydroxide has $K_{sp} = 5.6\\times10^{-12}$. What is the pH of its saturated solution at 25 °C?', answer: 10.35,
      why: '$4s^3 = 5.6\\times10^{-12}$ gives $s = 1.12\\times10^{-4}$ M, so $[\\ce{OH-}] = 2s = 2.24\\times10^{-4}$ M, pOH = 3.65 and pH = 10.35 — the mild alkalinity of milk of magnesia.' }
  ],
  applications: [
    'Barium sulfate contrast meals for X-ray imaging of the gut.',
    'Fluoride in toothpaste and drinking water: less soluble fluorapatite in enamel.',
    'Gravimetric analysis, and removing metals and phosphate from waste water by precipitation.',
    'Scale in kettles, boilers and pipes; kidney stones; caves and stalactites.'
  ],
  history: 'Walther Nernst introduced the solubility product in 1889, using the new theory of ions in solution to explain why a salt dissolves less in a solution that already contains one of its ions.',
  sim: 'eq-precip'
},

{
  id: 'common-ion-effect', parent: 'solubility-equilibria', title: 'The common-ion effect', level: 2,
  short: 'A salt dissolves less in a solution that already contains one of its ions. Ksp still holds, so the shared ion leaves room for less of the other.',
  keywords: ['common-ion effect', 'common ion', 'solubility suppression', 'salting out', 'washing precipitates', 'hydroxide precipitation', 'pH and solubility', 'salt effect'],
  prereq: ['solubility-product', 'le-chatelier', 'ice-tables'],
  related: ['precipitation', 'buffers', 'complex-ion-equilibria', 'gravimetric-analysis', 'weak-acids', 'ph-scale'],
  body: `
Silver chloride dissolves to $1.34\\times10^{-5}$ mol/L in pure water. In a solution that already contains chloride — seawater, a salt solution, the wash liquid of an analysis — it dissolves far less. Any ion the solution already holds that also belongs to the salt suppresses the salt's solubility: the **common-ion effect**.

It is [[le-chatelier|Le Chatelier's principle]] applied to $\\ce{AgCl(s) <=> Ag+ + Cl-}$: extra chloride pushes the equilibrium back towards the solid. The numbers come from the [[solubility-product]], which must still hold. With chloride already present at concentration $c$, and $s$ mol/L of silver chloride dissolving,

$$K_{sp} = [\\ce{Ag+}][\\ce{Cl-}] = s\\,(s + c)$$

When $c \\gg s$, the salt's own chloride is negligible and $s \\approx K_{sp}/c$. In 0.010 M sodium chloride, $s = 1.8\\times10^{-10}/0.010 = 1.8\\times10^{-8}$ mol/L — about 750 times less than in pure water. Every further tenfold increase in chloride cuts the solubility tenfold.

### The power matters
For a salt $\\mathrm{M}_a\\mathrm{X}_b$ in a solution with the anion at concentration $c$, $K_{sp} \\approx (as)^a c^b$, so the solubility falls as $c^{-b/a}$. Fluoride is squared in the solubility product of fluorite, $K_{sp} = [\\ce{Ca^2+}][\\ce{F-}]^2$, so added fluoride works far harder than added calcium: in 0.010 M sodium fluoride, calcium fluoride dissolves to $3.5\\times10^{-7}$ mol/L, about 600 times less than in water, while 0.010 M calcium chloride lowers it only sevenfold.

### Hydroxide as the common ion
For metal hydroxides the common ion is $\\ce{OH-}$, fixed by the [[ph-scale|pH]]: $s = K_{sp}/[\\ce{OH-}]^2$ for $\\ce{M(OH)2}$. Each unit of pH cuts the solubility of magnesium hydroxide a hundredfold: $5.6\\times10^{-4}$ mol/L at pH 10, $5.6\\times10^{-8}$ mol/L at pH 12. Water-treatment plants strip metals from waste water this way, and because different hydroxides come out at different pH values, the same idea can separate them ([[precipitation]]).

### Putting it to work
- **Washing precipitates.** In [[gravimetric-analysis]] a precipitate is washed with a dilute solution of a common ion (or of a volatile electrolyte) rather than pure water, so that less of it redissolves.
- **Salting out.** Adding sodium chloride to a hot soap mixture makes the sodium soap separate out; the extra sodium ions push its solubility down. Bubbling hydrogen chloride through saturated brine precipitates pure sodium chloride in the same way.
- **Buffers.** The effect works on weak acids too: acetate added to acetic acid pushes $\\ce{CH3COOH <=> H+ + CH3COO-}$ back and cuts its ionisation, the principle of a [[buffers|buffer]].

> [!warn] Too much of a common ion can backfire. Beyond a few millimoles per litre of chloride, silver chloride starts to dissolve *more* again, as $\\ce{AgCl(aq)}$ and $\\ce{AgCl2-}$ form ([[complex-ion-equilibria]]). And in concentrated salt solutions, activity effects raise solubilities as well.
`,
  ideas: [
    'An ion already in solution that the salt also contains lowers the salt\'s solubility.',
    'Ksp still holds: for a 1 : 1 salt with the common ion at c ≫ s, s ≈ Ksp/c.',
    'The effect is strongest for the ion raised to the higher power in Ksp.',
    'Hydroxide is the common ion for metal hydroxides, so their solubility falls steeply as the pH rises.',
    'Only shared ions suppress solubility; other salts raise it slightly.'
  ],
  pitfalls: [
    'Any added salt lowers the solubility — Only a common ion does. Sodium nitrate slightly raises the solubility of silver chloride, through the salt (activity) effect.',
    'Ignoring the common ion in the calculation — [Cl⁻] = s + c, not s. In 0.010 M NaCl, using s² = Ksp overestimates the solubility of AgCl 750-fold.',
    'More common ion always means less solubility — At high chloride, silver chloride dissolves again as chloro complexes.'
  ],
  formulas: [
    {
      name: 'AgCl in a chloride solution (exact)',
      expr: 'Ksp = s*(s + c)', tex: 'K_{sp} = s\\,(s + c)',
      vars: {
        Ksp: { name: 'solubility product', value: 1.8e-10, tex: 'K_{sp}' },
        s: { name: 'molar solubility s (mol/L)', value: 1.8e-8 },
        c: { name: 'common ion already present, c (mol/L)', value: 0.010 }
      },
      solveFor: 's',
      note: 'For a 1 : 1 salt such as AgCl in NaCl solution ($[\\ce{Ag+}] = s$, $[\\ce{Cl-}] = s + c$). $s$ appears twice, so it is found numerically; only the positive root is physical. With $c = 0$ it gives the solubility in pure water.',
      practice: { unknowns: ['s', 'c'] },
      stories: {
        s: 'Silver chloride ($K_{sp}$ = {Ksp}) is shaken with a sodium chloride solution containing {c} mol/L of chloride. What is its molar solubility, in mol/L?',
        c: 'What chloride concentration, in mol/L, cuts the solubility of silver chloride ($K_{sp}$ = {Ksp}) to {s} mol/L?'
      }
    },
    {
      name: 'Solubility with the anion in excess (approximate)',
      expr: 's = (Ksp/c^b)^(1/a)/a', tex: 's \\approx \\frac{1}{a}\\left(\\frac{K_{sp}}{c^{\\,b}}\\right)^{1/a}',
      vars: {
        s: { name: 'molar solubility s (mol/L)' },
        Ksp: { name: 'solubility product', value: 3.5e-11, tex: 'K_{sp}' },
        c: { name: 'anion already present, c (mol/L)', value: 0.010 },
        a: { name: 'cations per formula unit, a', int: true, fixed: true, value: 1 },
        b: { name: 'anions per formula unit, b', int: true, fixed: true, value: 2 }
      },
      note: 'From $K_{sp} = (as)^a c^b$, valid when $c$ is much larger than the salt\'s own anions, $bs$. Defaults: calcium fluoride in 0.010 M sodium fluoride.',
      practice: { unknowns: ['s', 'c'] },
      stories: {
        s: 'Calcium fluoride ($K_{sp}$ = {Ksp}) is placed in a sodium fluoride solution with {c} mol/L of fluoride. Estimate its molar solubility, in mol/L.',
        c: 'What fluoride concentration, in mol/L, holds the solubility of calcium fluoride ($K_{sp}$ = {Ksp}) down to {s} mol/L?'
      }
    },
    {
      name: 'A hydroxide M(OH)₂ at a fixed pH',
      expr: 'log(s) = log(Ksp) - 2*(pH - 14)', tex: '\\log s = \\log K_{sp} - 2\\,(\\mathrm{pH} - 14)',
      vars: {
        s: { name: 'molar solubility s (mol/L)' },
        Ksp: { name: 'solubility product', value: 5.6e-12, tex: 'K_{sp}' },
        pH: { name: 'pH of the solution (held fixed)', value: 10, min: 0, max: 14, tex: '\\mathrm{pH}' }
      },
      note: 'The logarithm of $s = K_{sp}/[\\ce{OH-}]^2$, with $[\\ce{OH-}] = 10^{\\mathrm{pH} - 14}$ mol/L at 25 °C: each unit of pH lowers the solubility a hundredfold. Valid while the solution is buffered, so the hydroxide from the dissolving solid does not change the pH. Defaults: magnesium hydroxide at pH 10.',
      practice: { unknowns: ['s', 'pH'] },
      stories: {
        s: 'Magnesium hydroxide has $K_{sp}$ = {Ksp}. What is its molar solubility, in mol/L, in a solution buffered at pH {pH}?',
        pH: 'At what pH does the solubility of magnesium hydroxide ($K_{sp}$ = {Ksp}) fall to {s} mol/L?'
      }
    }
  ],
  examples: [
    {
      title: 'Silver chloride in salt water',
      q: 'What is the solubility of silver chloride ($K_{sp} = 1.8\\times10^{-10}$) in 0.010 M sodium chloride? Compare it with pure water.',
      steps: [
        'ICE: $[\\ce{Ag+}] = s$, $[\\ce{Cl-}] = 0.010 + s$, so $K_{sp} = s(0.010 + s)$.',
        'Expect $s \\ll 0.010$: then $s \\approx 1.8\\times10^{-10}/0.010 = 1.8\\times10^{-8}$ mol/L. Check: $s$ is a millionth of 0.010, so the shortcut is excellent.',
        'In pure water $s = 1.34\\times10^{-5}$ mol/L: the chloride has cut the solubility by a factor of about 750.'
      ],
      a: 's = 1.8 × 10⁻⁸ mol/L, about 750 times less than in water.'
    },
    {
      title: 'Which ion suppresses fluorite more?',
      q: 'Compare the solubility of $\\ce{CaF2}$ ($K_{sp} = 3.5\\times10^{-11}$) in 0.010 M NaF and in 0.010 M $\\ce{CaCl2}$.',
      steps: [
        'In NaF: $[\\ce{F-}] \\approx 0.010$, $[\\ce{Ca^2+}] = s$, so $s = K_{sp}/0.010^2 = 3.5\\times10^{-7}$ mol/L.',
        'In $\\ce{CaCl2}$: $[\\ce{Ca^2+}] \\approx 0.010$, $[\\ce{F-}] = 2s$, so $0.010 \\times 4s^2 = K_{sp}$ and $s = \\sqrt{3.5\\times10^{-11}/0.040} = 3.0\\times10^{-5}$ mol/L.',
        'Against $2.1\\times10^{-4}$ mol/L in pure water, fluoride suppresses the solubility about 600-fold, calcium only sevenfold: the squared ion wins.'
      ],
      a: '3.5 × 10⁻⁷ M in NaF against 3.0 × 10⁻⁵ M in CaCl₂.'
    },
    {
      title: 'Magnesium hydroxide and pH',
      q: 'How much magnesium hydroxide ($K_{sp} = 5.6\\times10^{-12}$) can stay dissolved in water buffered at pH 10.0, and at pH 12.0?',
      steps: [
        'At pH 10.0, $[\\ce{OH-}] = 10^{-4}$ mol/L, so $s = 5.6\\times10^{-12}/10^{-8} = 5.6\\times10^{-4}$ mol/L (14 mg of magnesium per litre).',
        'At pH 12.0, $[\\ce{OH-}] = 10^{-2}$ mol/L, so $s = 5.6\\times10^{-12}/10^{-4} = 5.6\\times10^{-8}$ mol/L.',
        'Two pH units, a factor of ten thousand: raising the pH is a powerful way to pull metal ions out of water.'
      ],
      a: '5.6 × 10⁻⁴ M at pH 10; 5.6 × 10⁻⁸ M at pH 12.'
    }
  ],
  quiz: [
    { q: 'Which solution dissolves the least silver chloride?', choices: ['0.010 M NaCl', '0.010 M CaCl₂', '0.010 M NaNO₃', 'pure water'], a: 1,
      why: 'CaCl₂ supplies two chloride ions per formula, 0.020 M in all, which suppresses the solubility twice as much as 0.010 M NaCl. Sodium nitrate shares no ion with AgCl.' },
    { q: 'What is the solubility of silver chloride ($K_{sp} = 1.8\\times10^{-10}$) in 0.10 M NaCl, in mol/L?', answer: 1.8e-9,
      why: '$s \\approx K_{sp}/[\\ce{Cl-}] = 1.8\\times10^{-10}/0.10 = 1.8\\times10^{-9}$ mol/L.' },
    { q: 'Dissolving sodium nitrate in the water lowers the solubility of silver chloride.', a: false,
      why: 'Neither ion is shared with AgCl. The extra ions actually raise its solubility slightly, by lowering the activities of Ag⁺ and Cl⁻ (the salt effect).' },
    { q: 'At equal concentrations, which suppresses the solubility of lead iodide, $\\ce{PbI2}$, more?', choices: ['KI', 'Pb(NO₃)₂', 'both equally', 'neither'], a: 0,
      why: 'Iodide appears squared in Ksp = [Pb²⁺][I⁻]², so a given concentration of iodide leaves room for far less lead than the same concentration of lead leaves for iodide.' },
    { q: 'What is the molar solubility of magnesium hydroxide ($K_{sp} = 5.6\\times10^{-12}$) at pH 11.0?', answer: 5.6e-6,
      why: '$[\\ce{OH-}] = 10^{-3}$ mol/L, so $s = 5.6\\times10^{-12}/10^{-6} = 5.6\\times10^{-6}$ mol/L.' }
  ],
  applications: [
    'Washing precipitates in gravimetric analysis without dissolving them.',
    'Removing heavy metals from waste water by raising the pH.',
    'Salting out soaps, proteins and organic products.',
    'Buffers, where a common ion holds back the ionisation of a weak acid.'
  ],
  sim: 'eq-common-ion'
},

{
  id: 'precipitation', parent: 'solubility-equilibria', title: 'Predicting precipitation', level: 2,
  short: 'Mix two solutions and a precipitate forms only if the ion product Q, worked out after the dilution of mixing, exceeds the solubility product. Precipitation then continues until Q has fallen to Ksp.',
  keywords: ['precipitation', 'ion product', 'Q against Ksp', 'supersaturation', 'mixing solutions', 'selective precipitation', 'fractional precipitation', 'Mohr titration', 'nucleation', 'digestion'],
  prereq: ['solubility-product', 'reaction-quotient', 'dilution'],
  related: ['common-ion-effect', 'gravimetric-analysis', 'titration-calculations', 'reaction-types', 'complex-ion-equilibria', 'ice-tables'],
  body: `
Mix a solution of silver nitrate with one of sodium chloride and a white cloud appears at once; mix lead nitrate with sodium chloride at the same concentrations and nothing happens. Whether a solid forms is decided by the **ion product** — the [[reaction-quotient|reaction quotient]] of the dissolving equilibrium — compared with the [[solubility-product]]:

$$Q = [\\mathrm{M}]^a\\,[\\mathrm{X}]^b \\ \\text{(as mixed)} \\qquad \\text{against} \\qquad K_{sp}$$

- $Q < K_{sp}$: unsaturated. No precipitate; more solid could still dissolve.
- $Q = K_{sp}$: saturated, just at the edge.
- $Q > K_{sp}$: supersaturated. Solid comes out until what is left in solution satisfies $K_{sp}$ exactly.

### Remember the dilution
Mixing dilutes both solutions ([[dilution]]). After 50 mL of one is poured into 50 mL of the other, each ion is at half its original concentration, and Q uses the concentrations **in the mixture**:

$$[\\mathrm{M}] = c_1\\,\\frac{V_1}{V_1 + V_2}, \\qquad [\\mathrm{X}] = c_2\\,\\frac{V_2}{V_1 + V_2}$$

Equal volumes of 0.010 M lead nitrate and 0.010 M potassium iodide give $[\\ce{Pb^2+}] = [\\ce{I-}] = 0.0050$ M, so $Q = 0.0050 \\times 0.0050^2 = 1.25\\times10^{-7}$ — far above $K_{sp} = 9.8\\times10^{-9}$ for lead iodide, and a brilliant yellow precipitate forms. With sodium chloride instead, Q is the same, but $K_{sp}(\\ce{PbCl2}) = 1.7\\times10^{-5}$ is much larger, and the mixture stays clear.

### How much comes out
If $Q > K_{sp}$, an [[ice-tables|ICE-style]] calculation gives the amount: let $p$ mol/L of the salt precipitate, so that $([\\mathrm{M}] - ap)^a([\\mathrm{X}] - bp)^b = K_{sp}$. When one ion is in clear excess, nearly all of the other precipitates, and what remains of it follows from $K_{sp}$ and the excess ion's concentration — the [[common-ion-effect]] at work.

### One ion at a time
When a solution holds several ions that precipitate with the same reagent, they come out in turn as the reagent is added: first whichever reaches its own $K_{sp}$ first. In the **Mohr titration** of chloride, silver nitrate is run into a sample containing a little potassium chromate. White silver chloride precipitates first; brick-red silver chromate appears only once $[\\ce{Ag+}]$ has risen high enough, by which time more than 99.9 % of the chloride has gone. The colour marks the end point ([[titration-calculations]]).

Metal hydroxides separate by pH the same way. From a solution 0.010 M in each, iron(III) hydroxide starts to form near pH 1.8 and is essentially complete by pH 3–4, while magnesium hydroxide waits until pH 9.4. Mine drainage, electroplating effluent and drinking-water treatment all rely on it.

### Real precipitates
$Q > K_{sp}$ is necessary but not always enough. New crystals must first **nucleate**, and a supersaturated solution can stay clear for a surprisingly long time — until the glass is scratched or a seed crystal is dropped in. Analysts precipitate slowly, from hot dilute solution, and let the solid **digest** (stand warm) so that small crystals redissolve and large, pure, easily filtered ones grow ([[gravimetric-analysis]]).
`,
  ideas: [
    'A precipitate forms only if the ion product Q exceeds Ksp.',
    'Use the concentrations after mixing: both solutions dilute each other.',
    'Precipitation goes on until the ions left in solution satisfy Ksp exactly.',
    'With several ions and one reagent, the salt whose Ksp is reached first precipitates first: selective precipitation.',
    'Supersaturated solutions can persist until crystals nucleate.'
  ],
  pitfalls: [
    'Using the concentrations from before mixing — Pouring 50 mL into 50 mL halves every concentration; Q for a 1 : 2 salt falls eightfold.',
    'Q > Ksp means the solid appears instantly — It means the solid can form. Nucleation may be slow, and a supersaturated solution can stay clear for a while.',
    'The salt with the smallest Ksp always precipitates first — What counts is which Ksp is reached first at the concentrations present, which also depends on the formulas and on how much of each ion there is.'
  ],
  formulas: [
    {
      name: 'Ion product after mixing two solutions',
      expr: 'Q = (c1*V1/(V1 + V2))^a*(c2*V2/(V1 + V2))^b',
      tex: 'Q = \\left(c_1\\frac{V_1}{V_1 + V_2}\\right)^{a}\\left(c_2\\frac{V_2}{V_1 + V_2}\\right)^{b}',
      vars: {
        Q: { name: 'ion product in the mixture' },
        c1: { name: 'cation concentration in solution 1 (mol/L)', value: 0.010, tex: 'c_1' },
        V1: { name: 'volume of solution 1', q: 'volume', unit: 'mL', value: 50, tex: 'V_1' },
        c2: { name: 'anion concentration in solution 2 (mol/L)', value: 0.010, tex: 'c_2' },
        V2: { name: 'volume of solution 2', q: 'volume', unit: 'mL', value: 50, tex: 'V_2' },
        a: { name: 'cations per formula unit, a', int: true, fixed: true, value: 1 },
        b: { name: 'anions per formula unit, b', int: true, fixed: true, value: 2 }
      },
      note: 'Compare Q with $K_{sp}$. Defaults: lead nitrate and potassium iodide making $\\ce{PbI2}$ ($K_{sp} = 9.8\\times10^{-9}$). The volumes only enter as a ratio, so any volume unit works.',
      practice: { unknowns: ['Q', 'c1'] },
      stories: {
        Q: '{V1} of lead nitrate solution with {c1} mol/L of $\\ce{Pb^2+}$ is mixed with {V2} of potassium iodide solution with {c2} mol/L of $\\ce{I-}$. What is the ion product of $\\ce{PbI2}$ in the mixture?',
        c1: '{V1} of a lead nitrate solution is mixed with {V2} of {c2} mol/L potassium iodide, and the ion product of $\\ce{PbI2}$ is then {Q}. What was the lead concentration of the first solution, in mol/L?'
      }
    },
    {
      name: 'Where precipitation begins',
      expr: 'Ksp = M^a*X^b', tex: 'K_{sp} = \\mathrm{[M]}^a\\,\\mathrm{[X]}^b',
      vars: {
        Ksp: { name: 'solubility product', value: 1.1e-12, tex: 'K_{sp}' },
        M: { name: 'cation concentration [M] (mol/L)', tex: '\\mathrm{[M]}' },
        X: { name: 'anion concentration [X] (mol/L)', value: 5.0e-3, tex: '\\mathrm{[X]}' },
        a: { name: 'cations per formula unit, a', int: true, fixed: true, value: 2 },
        b: { name: 'anions per formula unit, b', int: true, fixed: true, value: 1 }
      },
      solveFor: 'M',
      note: 'The concentration of one ion at which the salt just starts to precipitate, given the other. Defaults: silver chromate, $\\ce{Ag2CrO4}$, with 5.0 mM chromate — the end-point indicator of the Mohr titration.',
      practice: { unknowns: ['M', 'X'] },
      stories: {
        M: 'A solution contains {X} mol/L of chromate. At what silver-ion concentration, in mol/L, does silver chromate ($K_{sp}$ = {Ksp}) begin to precipitate?',
        X: 'A solution contains {M} mol/L of silver ions. What chromate concentration, in mol/L, would start silver chromate ($K_{sp}$ = {Ksp}) precipitating?'
      }
    }
  ],
  examples: [
    {
      title: 'Silver chloride from dilute solutions',
      q: '50.0 mL of $1.00\\times10^{-3}$ M silver nitrate is mixed with 50.0 mL of $1.00\\times10^{-3}$ M sodium chloride. Does AgCl ($K_{sp} = 1.8\\times10^{-10}$) precipitate, and how much?',
      steps: [
        'After mixing (100 mL): $[\\ce{Ag+}] = [\\ce{Cl-}] = 5.0\\times10^{-4}$ M.',
        '$Q = (5.0\\times10^{-4})^2 = 2.5\\times10^{-7}$, over a thousand times $K_{sp}$: it precipitates.',
        'The ions are in the 1 : 1 ratio, so they fall together until $[\\ce{Ag+}] = [\\ce{Cl-}] = \\sqrt{K_{sp}} = 1.34\\times10^{-5}$ M.',
        'Precipitated: $5.0\\times10^{-4} - 1.34\\times10^{-5} = 4.87\\times10^{-4}$ mol/L, times 0.100 L times 143.32 g/mol = 7.0 mg — 97 % of the silver.'
      ],
      a: 'Yes: about 7.0 mg of AgCl, leaving 1.3 × 10⁻⁵ M of each ion.'
    },
    {
      title: 'The Mohr end point',
      q: 'Chloride is titrated with silver nitrate in the presence of $5.0\\times10^{-3}$ M chromate. At what $[\\ce{Ag+}]$ does red $\\ce{Ag2CrO4}$ ($K_{sp} = 1.1\\times10^{-12}$) begin to form, and how much chloride is still in solution then?',
      steps: [
        'Silver chromate starts when $[\\ce{Ag+}]^2[\\ce{CrO4^2-}] = K_{sp}$: $[\\ce{Ag+}] = \\sqrt{1.1\\times10^{-12}/5.0\\times10^{-3}} = 1.5\\times10^{-5}$ M.',
        'At that moment silver chloride is saturated too: $[\\ce{Cl-}] = 1.8\\times10^{-10}/1.5\\times10^{-5} = 1.2\\times10^{-5}$ M.',
        'If the sample started near 0.05 M chloride, only 0.02 % remains when the red colour appears: the chromate signals the end point almost exactly.'
      ],
      a: '[Ag⁺] ≈ 1.5 × 10⁻⁵ M; [Cl⁻] ≈ 1.2 × 10⁻⁵ M left.'
    }
  ],
  quiz: [
    { q: 'Equal volumes of $2.0\\times10^{-5}$ M $\\ce{AgNO3}$ and $2.0\\times10^{-5}$ M NaCl are mixed. Does AgCl ($K_{sp} = 1.8\\times10^{-10}$) precipitate?', choices: ['no: after mixing Q = 1.0 × 10⁻¹⁰ < Ksp', 'yes: Q = 4.0 × 10⁻¹⁰ > Ksp', 'yes, because AgCl is insoluble', 'only if the solution is stirred'], a: 0,
      why: 'Mixing halves both concentrations to 1.0 × 10⁻⁵ M, so Q = 1.0 × 10⁻¹⁰, below Ksp. Forgetting the dilution gives 4.0 × 10⁻¹⁰ and the wrong answer.' },
    { q: '25.0 mL of 0.0040 M $\\ce{Pb(NO3)2}$ is mixed with 75.0 mL of 0.0020 M KI. What is the ion product $[\\ce{Pb^2+}][\\ce{I-}]^2$ in the mixture?', answer: 2.25e-9,
      why: '$[\\ce{Pb^2+}] = 0.0040 \\times 25/100 = 0.0010$ M, $[\\ce{I-}] = 0.0020 \\times 75/100 = 0.0015$ M, so Q = $0.0010 \\times 0.0015^2 = 2.25\\times10^{-9}$ — below $K_{sp} = 9.8\\times10^{-9}$, so no precipitate.' },
    { q: 'A supersaturated solution always forms a precipitate immediately.', a: false,
      why: 'Crystals must nucleate first. Without a surface or seed to start on, a supersaturated solution can stay clear for minutes or months.' },
    { q: 'Silver nitrate is added slowly to a solution 0.010 M in both chloride and iodide. Which precipitates first?', choices: ['AgI', 'AgCl', 'both together', 'neither, until all the silver is added'], a: 0,
      why: 'AgI needs only [Ag⁺] = 8.5 × 10⁻¹⁷/0.010 = 8.5 × 10⁻¹⁵ M; AgCl needs 1.8 × 10⁻⁸ M. The iodide comes out first, almost completely, before any chloride does.' },
    { q: 'At what silver-ion concentration does $\\ce{Ag2CrO4}$ ($K_{sp} = 1.1\\times10^{-12}$) begin to precipitate from $5.0\\times10^{-3}$ M chromate, in mol/L?', answer: 1.48e-5,
      why: '$[\\ce{Ag+}] = \\sqrt{K_{sp}/[\\ce{CrO4^2-}]} = \\sqrt{1.1\\times10^{-12}/5.0\\times10^{-3}} = 1.48\\times10^{-5}$ M.' }
  ],
  applications: [
    'Qualitative analysis schemes that separate metal ions group by group.',
    'Mohr and Volhard titrations of chloride.',
    'Removing phosphate from sewage with iron or aluminium salts, and heavy metals from industrial waste water.',
    'Water hardness: limescale in boilers and soap scum in baths.'
  ],
  sim: { id: 'eq-precip', params: { salt: 3 } }
},

{
  id: 'complex-ion-equilibria', parent: 'solubility-equilibria', title: 'Complex-ion equilibria', level: 3,
  short: 'Metal ions bind ligands such as ammonia, cyanide or thiosulfate into complex ions. A large formation constant leaves almost no free metal ion, and that can dissolve an otherwise insoluble precipitate.',
  keywords: ['complex ion', 'formation constant', 'stability constant', 'Kf', 'ligand', 'silver ammine', 'thiosulfate', 'photographic fixer', 'cyanide leaching', 'EDTA', 'chelate', 'amphoteric hydroxide', 'halide test'],
  prereq: ['solubility-product', 'coordination-compounds', 'equilibrium-constant'],
  related: ['common-ion-effect', 'precipitation', 'acid-base-definitions', 'crystal-field-theory', 'le-chatelier', 'titration-calculations'],
  body: `
Silver chloride will not dissolve in water, nor in nitric acid — but pour in ammonia and the white precipitate vanishes. The ammonia has not attacked the chloride; it has captured the silver ions. Metal ions are Lewis acids ([[acid-base-definitions]]): they accept lone pairs from molecules or ions called **ligands** and form **complex ions** ([[coordination-compounds]]).

$$\\ce{Ag+(aq) + 2NH3(aq) <=> [Ag(NH3)2]+(aq)} \\qquad K_f = \\frac{[\\ce{[Ag(NH3)2]+}]}{[\\ce{Ag+}][\\ce{NH3}]^2} = 1.7\\times10^{7}$$

$K_f$ is the **formation constant** (or stability constant). Complexes form step by step — first $\\ce{[Ag(NH3)]+}$, then the second ammonia — and the overall constant is the product of the stepwise ones, often written $\\beta_2$. Typical values are enormous: $1.7\\times10^{7}$ for the silver–ammonia complex, about $10^{13}$ for $\\ce{[Cu(NH3)4]^2+}$ and for silver thiosulfate, about $10^{21}$ for $\\ce{[Ag(CN)2]-}$.

### How little metal is left free
With the ligand in excess, almost none of the metal stays as the free aquated ion. In a solution 0.010 M in silver with 1.0 M of free ammonia,

$$[\\ce{Ag+}] = \\frac{[\\ce{[Ag(NH3)2]+}]}{K_f[\\ce{NH3}]^2} = \\frac{0.010}{1.7\\times10^{7} \\times 1.0^2} = 5.9\\times10^{-10}\\ \\mathrm{mol/L}$$

— one silver ion in seventeen million is free. Every other equilibrium involving silver responds to that tiny free concentration.

### Dissolving a precipitate
Lower $[\\ce{Ag+}]$ and the ion product of silver chloride drops below $K_{sp}$, so more solid dissolves ([[le-chatelier]]). Adding the two equations gives the overall reaction, whose constant is the product of the two:

$$\\ce{AgCl(s) + 2NH3 <=> [Ag(NH3)2]+ + Cl-} \\qquad K = K_{sp}K_f = 1.8\\times10^{-10} \\times 1.7\\times10^{7} = 3.1\\times10^{-3}$$

If $s$ mol/L dissolves in ammonia of total concentration $c$, then $K = s^2/(c - 2s)^2$, or $\\sqrt{K} = s/(c - 2s)$. In 1.0 M ammonia $s = 0.050$ mol/L — about 7 g of silver chloride per litre, where pure water dissolves 2 mg. The same arithmetic separates the silver halides, which is the classic test for halide ions:

| Halide | $K = K_{sp}K_f$ in ammonia | $s$ in 1 M $\\ce{NH3}$ | In practice |
|---|---|---|---|
| AgCl | $3.1\\times10^{-3}$ | 0.050 M | dissolves in dilute ammonia |
| AgBr | $8.5\\times10^{-6}$ | 0.0029 M | dissolves in concentrated ammonia |
| AgI | $1.4\\times10^{-9}$ | $3.8\\times10^{-5}$ M | does not dissolve |

Thiosulfate binds silver about a million times more strongly than ammonia, so it dissolves silver bromide easily. That is how photographic "fixer" cleared the unexposed silver bromide out of film and paper.

### More examples
- **Amphoteric hydroxides.** Aluminium and zinc hydroxides precipitate when a little base is added and dissolve again in excess as $\\ce{[Al(OH)4]-}$ and $\\ce{[Zn(OH)4]^2-}$: their solubility against pH is U-shaped.
- **Gold mining.** Gold is too noble for oxygen to oxidise on its own, but cyanide binds $\\ce{Au+}$ so strongly ($K_f \\approx 10^{38}$) that dissolved oxygen can do it: $\\ce{4Au + 8CN- + O2 + 2H2O -> 4[Au(CN)2]- + 4OH-}$.
- **Chelates.** Ligands that grip a metal at several points, such as EDTA, form especially stable complexes. EDTA softens water, stops traces of metal from spoiling food, is the titrant in complexometric titrations of calcium and magnesium, and treats lead poisoning.
- **Colour.** Complex formation changes colour — pale blue copper(II) turns deep blue with ammonia, pink cobalt(II) blue with chloride — which is useful in analysis and explained by [[crystal-field-theory|crystal field theory]].
`,
  ideas: [
    'Metal ions accept electron pairs from ligands to form complex ions; the formation constant Kf measures how strongly.',
    'With excess ligand the free metal ion is tiny: [M] = [MLₙ]/(Kf[L]ⁿ).',
    'A ligand that complexes the metal dissolves its precipitates; the overall constant is Ksp × Kf.',
    'AgCl dissolves in dilute ammonia, AgBr in concentrated ammonia and AgI not at all: the halide test in numbers.',
    'Stepwise formation constants multiply to give the overall constant.'
  ],
  pitfalls: [
    'The ammonia reacts with the chloride of the precipitate — It captures the silver ion; the chloride is simply released into solution.',
    'A large Kf guarantees that the precipitate dissolves — What counts is Ksp × Kf. AgI has so small a Ksp that even Kf = 1.7 × 10⁷ leaves it undissolved in ammonia.',
    'Using the total ligand concentration as the free one — Each complex ties up n ligands. When the metal is concentrated, subtract them before using Kf.'
  ],
  formulas: [
    {
      name: 'Free metal ion in excess ligand',
      expr: 'Kf = ML/(M*L^n)', tex: 'K_f = \\frac{\\mathrm{[ML_n]}}{\\mathrm{[M]}\\,\\mathrm{[L]}^n}',
      vars: {
        Kf: { name: 'formation constant', value: 1.7e7, tex: 'K_f' },
        ML: { name: 'complex concentration [MLₙ] (mol/L)', value: 0.010, tex: '\\mathrm{[ML_n]}' },
        M: { name: 'free metal ion [M] (mol/L)', tex: '\\mathrm{[M]}' },
        L: { name: 'free ligand [L] (mol/L)', value: 1.0, tex: '\\mathrm{[L]}' },
        n: { name: 'ligands per complex, n', int: true, fixed: true, value: 2 }
      },
      solveFor: 'M',
      note: 'Defaults: $\\ce{[Ag(NH3)2]+}$ with 1.0 M free ammonia. When the ligand is in large excess, nearly all the metal is complexed, so [MLₙ] is close to the total metal concentration.',
      practice: { unknowns: ['M', 'L'] },
      stories: {
        M: 'A solution holds {ML} mol/L of $\\ce{[Ag(NH3)2]+}$ and {L} mol/L of free ammonia ($K_f$ = {Kf}). What is the concentration of free $\\ce{Ag+}$, in mol/L?',
        L: 'How much free ammonia, in mol/L, keeps the free silver ion down to {M} mol/L in a solution of {ML} mol/L $\\ce{[Ag(NH3)2]+}$ ($K_f$ = {Kf})?'
      }
    },
    {
      name: 'A silver halide dissolving in ammonia',
      expr: 'sqrt(Ksp*Kf) = s/(c - 2*s)', tex: '\\sqrt{K_{sp}K_f} = \\frac{s}{c - 2s}',
      vars: {
        Ksp: { name: 'solubility product of the silver halide', value: 1.8e-10, tex: 'K_{sp}' },
        Kf: { name: 'formation constant of the complex', value: 1.7e7, tex: 'K_f' },
        s: { name: 'molar solubility s (mol/L)', value: 0.05 },
        c: { name: 'total ammonia concentration c (mol/L)', value: 1.0 }
      },
      solveFor: 's',
      note: 'From $\\ce{AgX(s) + 2NH3 <=> [Ag(NH3)2]+ + X-}$ with $K = K_{sp}K_f = s^2/(c - 2s)^2$. Defaults: silver chloride in 1.0 M ammonia. The same form holds for any ligand that binds two to one metal, such as thiosulfate.',
      practice: { unknowns: ['s', 'c'] },
      stories: {
        s: 'Silver chloride ($K_{sp}$ = {Ksp}) is shaken with {c} mol/L ammonia; the complex has $K_f$ = {Kf}. How much dissolves, in mol/L?',
        c: 'What total ammonia concentration, in mol/L, dissolves {s} mol/L of silver chloride ($K_{sp}$ = {Ksp}, $K_f$ = {Kf})?'
      }
    }
  ],
  derivation: {
    title: 'Dissolving AgCl in ammonia',
    steps: [
      { text: 'The two equilibria and their constants:', tex: '\\ce{AgCl(s) <=> Ag+ + Cl-}\\ \\ (K_{sp}), \\qquad \\ce{Ag+ + 2NH3 <=> [Ag(NH3)2]+}\\ \\ (K_f)' },
      { text: 'Adding the equations cancels the free silver ion; adding equations multiplies their constants:', tex: '\\ce{AgCl(s) + 2NH3 <=> [Ag(NH3)2]+ + Cl-}, \\qquad K = K_{sp}K_f' },
      { text: 'If $s$ mol/L dissolves, nearly all of it as the complex, then $[\\ce{[Ag(NH3)2]+}] = [\\ce{Cl-}] = s$ and $[\\ce{NH3}] = c - 2s$:', tex: 'K = \\frac{s^2}{(c - 2s)^2}' },
      { text: 'Take the square root and solve for $s$:', tex: 's = \\frac{\\sqrt{K}\\,c}{1 + 2\\sqrt{K}}' }
    ],
    outro: 'For small K, $s \\approx \\sqrt{K}\\,c$: the solubility is proportional to the ammonia concentration, as the straight lines of the simulation show on log scales.'
  },
  examples: [
    {
      title: 'Silver chloride in ammonia',
      q: 'How much silver chloride ($K_{sp} = 1.8\\times10^{-10}$) dissolves in 1.0 M ammonia ($K_f = 1.7\\times10^{7}$ for $\\ce{[Ag(NH3)2]+}$)?',
      steps: [
        '$K = K_{sp}K_f = 3.06\\times10^{-3}$ and $\\sqrt{K} = 0.0553$.',
        '$s = \\sqrt{K}c/(1 + 2\\sqrt{K}) = 0.0553 \\times 1.0/1.111 = 0.050$ mol/L.',
        'That is $0.050 \\times 143.32 = 7.1$ g per litre, against 1.9 mg in pure water: nearly four thousand times more.'
      ],
      a: 's ≈ 0.050 mol/L (about 7 g/L).'
    },
    {
      title: 'Enough ammonia to dissolve a precipitate',
      q: '0.010 mol of silver chloride sits in 1.0 L of water. What total ammonia concentration will just dissolve all of it?',
      steps: [
        'All of it dissolves when $s = 0.010$ mol/L. From $\\sqrt{K} = s/(c - 2s)$: $c = s/\\sqrt{K} + 2s$.',
        '$c = 0.010/0.0553 + 0.020 = 0.181 + 0.020 = 0.20$ mol/L.',
        'Most of the ammonia stays free: it is the free ammonia, not the ammonia bound in the complex, that holds $[\\ce{Ag+}]$ down.'
      ],
      a: 'About 0.20 M ammonia.'
    }
  ],
  quiz: [
    { q: 'Why does silver chloride dissolve in aqueous ammonia?', choices: ['ammonia binds Ag⁺ into [Ag(NH₃)₂]⁺, so the ion product falls below Ksp', 'ammonia reacts with the chloride ions', 'ammonia raises the pH, and AgCl is a weak base', 'ammonia increases Ksp'], a: 0,
      why: 'Complex formation removes free Ag⁺, so [Ag⁺][Cl⁻] < Ksp and more solid dissolves. Ksp itself is unchanged.' },
    { q: 'What is K for $\\ce{AgBr(s) + 2NH3 <=> [Ag(NH3)2]+ + Br-}$, given $K_{sp} = 5.0\\times10^{-13}$ and $K_f = 1.7\\times10^{7}$?', answer: 8.5e-6,
      why: 'Adding the dissolving and complexing equations multiplies their constants: $5.0\\times10^{-13} \\times 1.7\\times10^{7} = 8.5\\times10^{-6}$.' },
    { q: 'Silver iodide dissolves in 1 M ammonia, because the silver–ammonia complex is very stable.', a: false,
      why: 'K = Ksp·Kf = 8.5 × 10⁻¹⁷ × 1.7 × 10⁷ = 1.4 × 10⁻⁹: only about 4 × 10⁻⁵ mol/L dissolves. AgI needs a far stronger ligand, such as thiosulfate or cyanide.' },
    { q: 'A solution contains 0.010 M $\\ce{[Ag(NH3)2]+}$ and 0.10 M free ammonia. What is the free $[\\ce{Ag+}]$ ($K_f = 1.7\\times10^{7}$), in mol/L?', answer: 5.9e-8,
      why: '$[\\ce{Ag+}] = 0.010/(1.7\\times10^{7} \\times 0.10^2) = 5.9\\times10^{-8}$ mol/L — a hundred times more than with 1.0 M ammonia, because the ligand appears squared.' },
    { q: 'Sodium hydroxide is added drop by drop to aluminium sulfate solution. What happens?', choices: ['a white precipitate forms, then dissolves in excess base as [Al(OH)₄]⁻', 'a precipitate forms and stays however much base is added', 'nothing, because aluminium hydroxide is soluble', 'the solution turns deep blue'], a: 0,
      why: 'Al(OH)₃ is amphoteric: it precipitates first and then, with excess hydroxide as the ligand, forms the soluble aluminate complex.' }
  ],
  applications: [
    'Photographic fixing with sodium thiosulfate.',
    'Gold and silver extraction by cyanide leaching.',
    'EDTA in water softening, food preservation, complexometric titrations and chelation therapy.',
    'Qualitative analysis: telling chloride, bromide and iodide apart with silver nitrate and ammonia.'
  ],
  history: 'Jannik Bjerrum showed in 1941, working on the ammonia complexes of metal ions, that complexes form in a series of steps with their own constants, and how to measure them — the foundation of modern stability-constant tables.',
  sim: 'eq-complex'
}

);
