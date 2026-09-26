/* HYPER-CHEMISTRY · content/reference.js — the reference concept for chemistry authors:
 * its depth, practical angle and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'limiting-reagent', parent: 'reactions', title: 'The limiting reagent', level: 1,
  short: 'Reactants are rarely mixed in exactly the ratio of the equation. The one that runs out first stops the reaction and alone decides how much product forms; the others are left over.',
  keywords: ['limiting reagent', 'limiting reactant', 'excess reagent', 'excess reactant', 'stoichiometric ratio', 'theoretical yield', 'air–fuel ratio', 'lean', 'rich'],
  prereq: ['chemical-equations', 'mole-concept', 'molar-mass', 'reaction-stoichiometry'],
  related: ['percent-yield', 'titration-calculations', 'ideal-gas-law', 'math:fractions-ratios'],
  body: `
A balanced equation fixes the **ratio** in which particles react. For burning hydrogen,

$$\\ce{2H2 + O2 -> 2H2O}$$

two molecules of hydrogen use one of oxygen. Mix them in any other ratio and one of the two will be used up while some of the other is still there. The one that runs out is the **limiting reagent**: when it is gone the reaction stops, so it — and only it — sets how much product you can make. The other reactant is **in excess**, and some of it is left at the end, unchanged.

It is the same as making sandwiches from 10 slices of bread and 3 slices of cheese: two slices of bread per slice of cheese. The cheese allows 3 sandwiches, the bread 5, so you make 3 sandwiches and 4 slices of bread are left over. The cheese is limiting even though you had fewer *slices* of bread per sandwich than you might think: what counts is the amount **compared with what the recipe needs**.

### Finding it
Work in moles — never in grams, because a gram of hydrogen contains sixteen times as many molecules as a gram of oxygen.

1. Convert each reactant to amount: $n = m/M$ ([[molar-mass]]).
2. Divide each amount by its coefficient in the balanced equation. The **smallest** $n/\\nu$ belongs to the limiting reagent.
3. Everything else follows from that reactant alone: the product it can make, and how much of each other reactant it uses.

An equivalent check is to work out how much product each reactant could make on its own; the one that gives **less** is limiting, and that smaller amount is the [[percent-yield|theoretical yield]].

### What is left over
The excess reactant is consumed in proportion to the limiting one. With $A$ limiting,

$$n_{B,\\text{left}} = n_B - n_A\\,\\frac{\\nu_B}{\\nu_A}$$

Mass is conserved throughout: the mass of the products plus the mass of the leftover reactant equals the mass you started with — a good check on any calculation.

> [!tip] A reaction with a limiting reagent has a clear end point, and that is what a [[titration-calculations|titration]] exploits: the titrant is limiting until the equivalence point, then the analyte is.

### Excess on purpose
Chemists rarely mix exact stoichiometric amounts. They put in an excess of the **cheaper or more easily removed** reactant so that the expensive one reacts as completely as possible: air in a furnace, water in a hydrolysis, a cheap acid to dissolve an ore. The limiting reagent is then chosen, not an accident.

An engine is a good example. Burning octane needs

$$\\ce{2C8H18 + 25O2 -> 16CO2 + 18H2O}$$

which works out to about 15 kg of air for every kilogram of fuel (petrol blends are quoted at 14.7 : 1). A **lean** mixture has more air than that — the fuel is limiting and burns completely, but the hot excess oxygen forms nitrogen oxides. A **rich** mixture has too little air: oxygen is limiting, and the unburnt fuel leaves as carbon monoxide and hydrocarbons. A catalytic converter only works well within a narrow window around the stoichiometric ratio, which is why the engine's oxygen sensor keeps nudging the mixture back to it.
`,
  ideas: [
    'The balanced equation gives the ratio in which particles react; the actual amounts rarely match it.',
    'Compare amounts in moles divided by their coefficients: the smallest n/ν is the limiting reagent.',
    'The limiting reagent alone sets the amount of product (the theoretical yield).',
    'The excess reactant is used in proportion to the limiting one; the rest is left unchanged.',
    'An excess of the cheaper reactant is often chosen deliberately, to use up the valuable one.'
  ],
  pitfalls: [
    'The reactant with the smaller mass is limiting — Compare moles divided by coefficients, not grams. 10 g of hydrogen is five moles; 10 g of oxygen is less than a third of a mole.',
    'The reactant with fewer moles is limiting — Only if the coefficients are equal. In 2H₂ + O₂, 3 mol H₂ with 2 mol O₂ leaves oxygen over: hydrogen is limiting.',
    'The excess reactant is not used at all — It reacts until the limiting one runs out; only the surplus is left.',
    'Adding more of the excess reactant gives more product — Not once it is in excess; only more of the limiting reagent helps.'
  ],
  formulas: [
    {
      name: 'Product a reactant can make',
      expr: 'nP = nA*p/a', tex: 'n_P = n_A\\,\\frac{p}{a}',
      vars: {
        nP: { name: 'amount of product', q: 'amount', unit: 'mol', tex: 'n_P' },
        nA: { name: 'amount of reactant A', q: 'amount', unit: 'mol', value: 3, tex: 'n_A' },
        a: { name: 'coefficient of A in the equation', int: true, fixed: true, value: 3 },
        p: { name: 'coefficient of the product', int: true, fixed: true, value: 2 }
      },
      note: 'Do it for each reactant: the smallest $n_P$ is what you actually get, and that reactant is limiting. The defaults are hydrogen in $\\ce{N2 + 3H2 -> 2NH3}$; change the coefficients for another reaction.',
      practice: { unknowns: ['nP', 'nA'] },
      stories: {
        nP: 'In $\\ce{N2 + 3H2 -> 2NH3}$, how much ammonia can {nA} of hydrogen make, with nitrogen in excess?',
        nA: 'You need {nP} of ammonia from $\\ce{N2 + 3H2 -> 2NH3}$. What amount of hydrogen must react?'
      }
    },
    {
      name: 'Mass of product from a mass of reactant',
      expr: 'mP = mA/MA*p/a*MP', tex: 'm_P = \\frac{m_A}{M_A}\\,\\frac{p}{a}\\,M_P',
      vars: {
        mP: { name: 'mass of product', q: 'mass', unit: 'g', tex: 'm_P' },
        mA: { name: 'mass of reactant A', q: 'mass', unit: 'g', value: 10, tex: 'm_A' },
        MA: { name: 'molar mass of A', q: 'molarmass', unit: 'g/mol', value: 2.016, fixed: true, tex: 'M_A' },
        a: { name: 'coefficient of A', int: true, fixed: true, value: 2 },
        p: { name: 'coefficient of the product', int: true, fixed: true, value: 2 },
        MP: { name: 'molar mass of the product', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_P' }
      },
      note: 'The whole chain in one line: grams → moles → moles of product → grams. The defaults are hydrogen burning to water, $\\ce{2H2 + O2 -> 2H2O}$.',
      practice: { unknowns: ['mP', 'mA'] },
      stories: {
        mP: '{mA} of hydrogen ($M$ = {MA}) burns completely in plenty of oxygen: $\\ce{2H2 + O2 -> 2H2O}$. What mass of water ($M$ = {MP}) forms?',
        mA: 'You want {mP} of water ($M$ = {MP}) from burning hydrogen ($M$ = {MA}). What mass of hydrogen do you need?'
      }
    },
    {
      name: 'Excess reactant left over',
      expr: 'nBleft = nB - nA*b/a', tex: 'n_{B,\\text{left}} = n_B - n_A\\,\\frac{b}{a}',
      vars: {
        nBleft: { name: 'excess reactant left', q: 'amount', unit: 'mol', tex: 'n_{B,\\text{left}}' },
        nB: { name: 'amount of excess reactant B at the start', q: 'amount', unit: 'mol', value: 3, tex: 'n_B' },
        nA: { name: 'amount of limiting reactant A', q: 'amount', unit: 'mol', value: 4, tex: 'n_A' },
        b: { name: 'coefficient of B', int: true, fixed: true, value: 1 },
        a: { name: 'coefficient of A', int: true, fixed: true, value: 2 }
      },
      note: 'Valid only when A really is limiting, so that the result is not negative. Defaults: 4 mol H₂ with 3 mol O₂.',
      practice: { unknowns: ['nBleft', 'nB'] },
      stories: {
        nBleft: '{nA} of hydrogen burns in {nB} of oxygen: $\\ce{2H2 + O2 -> 2H2O}$. How much oxygen is left over?'
      }
    }
  ],
  examples: [
    {
      title: 'Ammonia from nitrogen and hydrogen',
      q: '28.0 g of nitrogen and 9.00 g of hydrogen react: $\\ce{N2 + 3H2 -> 2NH3}$. Which is limiting, what mass of ammonia forms, and what is left over?',
      steps: [
        'Amounts: $n(\\ce{N2}) = 28.0/28.014 = 0.9995\\ \\mathrm{mol}$, $n(\\ce{H2}) = 9.00/2.016 = 4.464\\ \\mathrm{mol}$.',
        'Divide by the coefficients: nitrogen $0.9995/1 = 0.9995$, hydrogen $4.464/3 = 1.488$. Nitrogen gives the smaller number: **nitrogen is limiting**.',
        'Ammonia: $n = 2 \\times 0.9995 = 1.999\\ \\mathrm{mol}$, so $m = 1.999 \\times 17.031 = 34.0\\ \\mathrm{g}$.',
        'Hydrogen used: $3 \\times 0.9995 = 2.999\\ \\mathrm{mol} = 6.05\\ \\mathrm{g}$; left over $9.00 - 6.05 = 2.95\\ \\mathrm{g}$.',
        'Check: $34.0 + 2.95 = 37.0\\ \\mathrm{g}$, the same as $28.0 + 9.00$. Mass is conserved.'
      ],
      a: 'Nitrogen is limiting: 34.0 g of ammonia, with 2.95 g of hydrogen left.'
    },
    {
      title: 'A rich mixture in an engine',
      q: 'A cylinder receives 1.00 g of octane ($\\ce{C8H18}$, 114.23 g/mol) and 12.0 g of air, which is 23.2 % oxygen by mass. Is there enough oxygen to burn all the fuel to carbon dioxide and water?',
      steps: [
        'Oxygen: $12.0 \\times 0.232 = 2.78\\ \\mathrm{g}$, or $2.78/32.00 = 0.0870\\ \\mathrm{mol}$.',
        'Octane: $1.00/114.23 = 0.00875\\ \\mathrm{mol}$. The equation $\\ce{2C8H18 + 25O2 -> 16CO2 + 18H2O}$ asks for $25/2 = 12.5$ mol of oxygen per mole of octane: $0.109\\ \\mathrm{mol}$.',
        'Only 0.0870 mol is there, so **oxygen is limiting** — a rich mixture. It can burn completely $0.0870/12.5 = 0.00696\\ \\mathrm{mol}$ of octane, about 80 % of the fuel.',
        'The stoichiometric ratio is $12.5 \\times 32.00/0.232/114.23 = 15.1$ g of air per gram of octane; 12.0 : 1 is well short of it.'
      ],
      a: 'No: oxygen is limiting, enough for only about 80 % of the octane. The rest leaves as CO and unburnt hydrocarbons.'
    }
  ],
  quiz: [
    { q: 'For $\\ce{2H2 + O2 -> 2H2O}$ you mix 4 mol of $\\ce{H2}$ with 3 mol of $\\ce{O2}$. Which is the limiting reagent?', choices: ['hydrogen', 'oxygen', 'neither: they are in the right ratio', 'it depends on the temperature'], a: 0,
      why: '4 mol of hydrogen needs only 2 mol of oxygen; there are 3. Dividing by coefficients: 4/2 = 2 for hydrogen, 3/1 = 3 for oxygen — hydrogen is smaller, so it runs out first, leaving 1 mol of oxygen.' },
    { q: 'The reactant present in the smallest mass is always the limiting reagent.', a: false,
      why: 'Mass says nothing about the number of particles. 10 g of hydrogen (5 mol) and 10 g of oxygen (0.31 mol): oxygen is limiting even though the masses are equal, and it would be with 20 g of it too.' },
    { q: '10.0 g of hydrogen and 10.0 g of oxygen react to form water. What mass of water forms?', answer: 11.26, unit: 'g',
      why: 'Oxygen is limiting: 10.0/32.00 = 0.3125 mol, making 2 × 0.3125 = 0.625 mol of water, 0.625 × 18.015 = 11.26 g. Most of the hydrogen is left over.' },
    { q: 'A reaction has used up its limiting reagent. You add more of the excess reactant. What happens?', choices: ['more product forms', 'nothing more forms', 'the product decomposes', 'the limiting reagent is regenerated'], a: 1,
      why: 'There is nothing left for the excess reactant to react with. Only adding more of the limiting reagent makes more product.' },
    { q: 'Why is the cheaper reactant usually the one added in excess in industry?', choices: ['it reacts faster', 'it makes the expensive reactant react as completely as possible', 'it lowers the activation energy', 'excess reactants increase the equilibrium constant'], a: 1,
      why: 'With the expensive reactant limiting, as much of it as possible turns into product; the leftover cheap reactant is recovered or discarded at little cost.' }
  ],
  problems: [
    { q: 'Aluminium reacts with chlorine: $\\ce{2Al + 3Cl2 -> 2AlCl3}$. What mass of aluminium chloride (133.34 g/mol) forms from 5.40 g of aluminium (26.98 g/mol) and 21.3 g of chlorine (70.90 g/mol)?', answer: 26.7, unit: 'g', tol: 0.01,
      hint: 'Compare n/ν for both reactants first.',
      steps: ['$n(\\ce{Al}) = 5.40/26.98 = 0.2001$ mol; $n(\\ce{Cl2}) = 21.3/70.90 = 0.3004$ mol.', 'Divided by coefficients: $0.2001/2 = 0.10007$, $0.3004/3 = 0.10014$ — almost exactly the stoichiometric ratio, with aluminium (just) limiting.',
              '$n(\\ce{AlCl3}) = n(\\ce{Al}) = 0.2001$ mol, so $m = 0.2001 \\times 133.34 = 26.7$ g — nearly all of the 26.7 g of reactants, with a trace of chlorine left over.'] },
    { q: 'For $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$, 2.0 mol of methane burns in 5.0 mol of oxygen. How much oxygen remains?', answer: 1.0, unit: 'mol',
      steps: ['Methane: 2.0/1 = 2.0; oxygen: 5.0/2 = 2.5. Methane is limiting.', 'It uses $2 \\times 2.0 = 4.0$ mol of oxygen, so $5.0 - 4.0 = 1.0$ mol is left.'] }
  ],
  applications: ['Setting the air–fuel ratio of engines, burners and furnaces.', 'Industrial synthesis: choosing which reactant to use in excess.', 'Titration, where the titrant is limiting until the equivalence point.', 'Airbags, rocket propellants and other reactions that must use their fuel completely.'],
  sim: 'ref-limiting'
}

);
