/* HYPER-CHEMISTRY · content/redox.js — oxidation and reduction: oxidation numbers,
 * what is oxidised and what reduced, and balancing redox equations with half-reactions. */
Hyper.add(

{
  id: 'oxidation-numbers', parent: 'redox', title: 'Oxidation numbers', level: 1,
  short: 'A bookkeeping charge for every atom in a compound, found by pretending that each bond is ionic. When an atom\'s oxidation number rises it has been oxidised; when it falls it has been reduced.',
  keywords: ['oxidation number', 'oxidation state', 'Stock notation', 'Roman numerals', 'iron(III)', 'peroxide', 'hydride', 'superoxide', 'average oxidation state', 'mixed valence', 'redox bookkeeping'],
  prereq: ['electronegativity', 'ionic-bonding', 'lewis-structures'],
  related: ['redox-reactions', 'balancing-redox', 'formal-charge', 'coordination-compounds', 'valence-electrons'],
  body: `
In a salt such as sodium chloride it is plain who has the electrons: sodium has given one away and chlorine has taken it, so the ions carry charges of +1 and −1. In a molecule the electrons are shared and no atom carries a whole charge. An **oxidation number** (or oxidation state) pretends otherwise. It hands every shared pair entirely to the more [[electronegativity|electronegative]] of the two atoms and asks what charge each atom would then have.

The answer is not a real charge — the carbon in carbon dioxide does not carry +4 — but it is superb bookkeeping. When an atom's oxidation number goes **up** in a reaction it has lost electrons: it has been **oxidised**. When it goes **down** it has gained electrons: it has been **reduced**. That is the whole reason for inventing it.

### The rules
You rarely need a Lewis structure. A short list, applied in this order, settles almost every case:

1. An atom in an element is 0: $\\ce{Fe}$, $\\ce{O2}$, $\\ce{S8}$, $\\ce{Cl2}$.
2. A monatomic ion has its own charge: $\\ce{Na+}$ is +1, $\\ce{S^2-}$ is −2.
3. The oxidation numbers of all the atoms add up to the charge of the species: 0 for a neutral compound, −2 for $\\ce{SO4^2-}$.
4. Fluorine is always −1. In compounds the group 1 metals are +1, the group 2 metals +2, aluminium +3.
5. Hydrogen is +1 with non-metals but −1 in metal hydrides such as $\\ce{NaH}$ and $\\ce{CaH2}$.
6. Oxygen is −2, except in peroxides ($\\ce{H2O2}$, $\\ce{Na2O2}$: −1), superoxides ($\\ce{KO2}$: −½) and with fluorine ($\\ce{OF2}$: +2).
7. Whatever element is left over follows from rule 3.

Take the permanganate ion $\\ce{MnO4-}$: four oxygens give $4 \\times (-2) = -8$ and the total must be −1, so manganese is **+7**. In potassium dichromate $\\ce{K2Cr2O7}$, $2(+1) + 2x + 7(-2) = 0$ gives $x = +6$.

### Names and ranges
The oxidation number goes into names as a Roman numeral: iron(II) sulfate $\\ce{FeSO4}$, iron(III) oxide $\\ce{Fe2O3}$, manganese(IV) oxide $\\ce{MnO2}$. Most elements have a range. Nitrogen runs from −3 in $\\ce{NH3}$ through 0 in $\\ce{N2}$, +2 in $\\ce{NO}$ and +4 in $\\ce{NO2}$ up to +5 in $\\ce{HNO3}$; carbon from −4 in methane to +4 in carbon dioxide. The limits are set by the [[valence-electrons]]: sulfur, with six, spans −2 to +6; manganese reaches +7 and osmium, in $\\ce{OsO4}$, +8.

This tells you what a substance can do. An element in its **highest** state can only be reduced, so the compound is an oxidising agent ($\\ce{MnO4-}$, $\\ce{Cr2O7^2-}$, $\\ce{HNO3}$). One in its **lowest** state can only be oxidised: a reducing agent ($\\ce{H2S}$, $\\ce{I-}$, metals). Species in between, such as $\\ce{H2O2}$ or $\\ce{SO2}$, can go either way.

### Fractions and averages
Rule 3 sometimes gives a fraction. In magnetite, $\\ce{Fe3O4}$, three iron atoms share +8: an average of $+8/3$, which is really one iron(II) and two iron(III) in the crystal. In the tetrathionate ion $\\ce{S4O6^2-}$ the average is +2.5, although the two central sulfur atoms are 0 and the outer two +5. An average is still exact for counting electrons, and that is all balancing needs.

### Carbon in organic molecules
The same bookkeeping follows oxidation in organic chemistry: every bond to hydrogen lowers carbon's number by one, every bond to oxygen raises it by one, and C–C bonds count nothing. Methane (−4), methanol (−2), methanal (0), methanoic acid (+2) and carbon dioxide (+4) are the steps of burning one carbon atom — which is why an alcohol is oxidised to an aldehyde and then to an acid, and why fats (mostly C–H) store more energy than sugars (already part-oxidised).

> [!warn] An oxidation number is not a [[formal-charge|formal charge]]. Formal charge shares every bond equally and says where charge sits in one Lewis structure; the oxidation number gives the whole bond to the more electronegative atom and tracks electron transfer. In carbon monoxide carbon has oxidation number +2 but formal charge −1.
`,
  ideas: [
    'An oxidation number is the charge an atom would have if every bond were fully ionic, with the electrons given to the more electronegative atom.',
    'The oxidation numbers of all atoms in a species add up to its charge.',
    'A rise in oxidation number is oxidation (loss of electrons); a fall is reduction (gain).',
    'Fixed values (F −1, group 1 +1, group 2 +2, H +1, O −2) settle the others through the sum rule; peroxides and hydrides are the exceptions.',
    'Fractional values are averages over atoms that are not alike, and are still exact for counting electrons.'
  ],
  pitfalls: [
    'The oxidation number is the real charge on the atom — It is a bookkeeping device. The carbon in CO₂ carries a small partial positive charge, nowhere near +4.',
    'Oxygen is always −2 — Not in peroxides (−1), superoxides (−½) or OF₂ (+2). Check the oxygen–oxygen bonds before applying the rule.',
    'Every colour change is a change of oxidation number — Yellow chromate turns orange dichromate in acid with chromium staying +6; that reaction is acid–base, not redox.'
  ],
  formulas: [
    {
      name: 'Oxidation number from the charge (two elements)',
      expr: 'z = nA*xA + nB*xB', tex: 'z = n_A\\,x_A + n_B\\,x_B',
      vars: {
        z: { name: 'charge of the species', value: -1, int: true, signed: true },
        nA: { name: 'atoms of element A in the formula', value: 1, int: true, tex: 'n_A' },
        xA: { name: 'oxidation number of element A', signed: true, tex: 'x_A' },
        nB: { name: 'atoms of element B in the formula', value: 4, int: true, tex: 'n_B' },
        xB: { name: 'oxidation number of element B (known, e.g. O = −2)', value: -2, int: true, signed: true, tex: 'x_B' }
      },
      solveFor: 'xA',
      note: 'The sum rule. The defaults are the permanganate ion $\\ce{MnO4-}$: one Mn, four O at −2, charge −1, so Mn is +7.',
      practice: { unknowns: ['xA'] },
      stories: {
        xA: 'An ion contains {nA} atom(s) of element A and {nB} atom(s) of element B, whose oxidation number is {xB}. Its overall charge is {z}. What is the oxidation number of A?'
      }
    },
    {
      name: 'Oxidation number from the charge (three elements)',
      expr: 'z = nA*xA + nB*xB + nC*xC', tex: 'z = n_A\\,x_A + n_B\\,x_B + n_C\\,x_C',
      vars: {
        z: { name: 'charge of the species', value: 0, int: true, signed: true },
        nA: { name: 'atoms of the unknown element A', value: 2, int: true, tex: 'n_A' },
        xA: { name: 'oxidation number of element A', signed: true, tex: 'x_A' },
        nB: { name: 'atoms of element B', value: 2, int: true, tex: 'n_B' },
        xB: { name: 'oxidation number of B (e.g. K = +1)', value: 1, int: true, signed: true, tex: 'x_B' },
        nC: { name: 'atoms of element C', value: 7, int: true, tex: 'n_C' },
        xC: { name: 'oxidation number of C (e.g. O = −2)', value: -2, int: true, signed: true, tex: 'x_C' }
      },
      solveFor: 'xA',
      note: 'Defaults: potassium dichromate $\\ce{K2Cr2O7}$, neutral, with two K at +1 and seven O at −2 — chromium comes out at +6.',
      practice: { unknowns: ['xA'] },
      stories: {
        xA: 'A species contains {nB} atoms of a metal at {xB}, {nC} atoms of oxygen at {xC} and {nA} atoms of element A. Its overall charge is {z}. What is the (average) oxidation number of A?'
      }
    }
  ],
  examples: [
    {
      title: 'Chromate and dichromate',
      q: 'Yellow potassium chromate $\\ce{K2CrO4}$ turns into orange potassium dichromate $\\ce{K2Cr2O7}$ when acid is added: $\\ce{2CrO4^2- + 2H+ -> Cr2O7^2- + H2O}$. Is this a redox reaction?',
      steps: [
        'In $\\ce{CrO4^2-}$: $x + 4(-2) = -2$, so $x = +6$.',
        'In $\\ce{Cr2O7^2-}$: $2x + 7(-2) = -2$, so $2x = 12$ and $x = +6$.',
        'Hydrogen stays +1 and oxygen stays −2 throughout. No oxidation number changes.'
      ],
      a: 'No: chromium is +6 on both sides. The colour change is an acid–base condensation, not a redox reaction.'
    },
    {
      title: 'Magnetite and its average',
      q: 'Find the oxidation number of iron in magnetite, $\\ce{Fe3O4}$, and explain the result.',
      steps: [
        'Sum rule: $3x + 4(-2) = 0$, so $x = +8/3 \\approx +2.67$.',
        'No single atom can have lost two-thirds of an electron. The crystal holds two kinds of iron: $a$ iron(II) and $b$ iron(III) with $a + b = 3$ and $2a + 3b = 8$.',
        'Solving: $b = 2$, $a = 1$. Magnetite is $\\ce{FeO.Fe2O3}$ — one iron(II) and two iron(III) per formula.'
      ],
      a: 'An average of +8/3: one Fe(II) and two Fe(III) in each Fe₃O₄ unit.'
    }
  ],
  quiz: [
    { q: 'What is the (average) oxidation number of sulfur in the thiosulfate ion $\\ce{S2O3^2-}$?', answer: 2,
      why: 'Sum rule: $2x + 3(-2) = -2$, so $2x = 4$ and $x = +2$. It is an average: the two sulfur atoms are bonded differently and are not really alike, but +2 is exact for electron counting.' },
    { q: 'In hydrogen peroxide, $\\ce{H2O2}$, the oxidation number of oxygen is…', choices: ['−2', '−1', '0', '+1'], a: 1,
      why: 'Hydrogen is +1, so the two oxygens share −2: −1 each. The O–O bond joins identical atoms, so its electrons are split evenly and do not count — which is why peroxides break the "oxygen is −2" rule.' },
    { q: 'The carbon atom in $\\ce{CO2}$ carries a real electric charge of +4.', a: false,
      why: 'The +4 comes from giving both shared pairs of each C=O bond to oxygen. The real charge on carbon is a fraction of an elementary charge; oxidation numbers are bookkeeping, not measured charges.' },
    { q: 'What are the oxidation numbers of nitrogen in ammonium nitrate, $\\ce{NH4NO3}$?', choices: ['−3 in the ammonium ion and +5 in the nitrate ion', '+1 in both', '0 in both, since the salt is neutral', '+3 in the ammonium ion and −5 in the nitrate ion'], a: 0,
      why: 'Treat the two ions separately. $\\ce{NH4+}$: $x + 4(+1) = +1$, so $x = -3$. $\\ce{NO3-}$: $x + 3(-2) = -1$, so $x = +5$. Averaging them to +1 hides the fact that one nitrogen can be oxidised and the other reduced — which is why ammonium nitrate can explode.' },
    { q: 'Which of these can act only as an oxidising agent, never as a reducing agent?', choices: ['$\\ce{MnO4-}$', '$\\ce{H2O2}$', '$\\ce{SO2}$', '$\\ce{Fe^2+}$'], a: 0,
      why: 'In permanganate manganese is +7, its highest possible state (all seven valence electrons given away), so it can only go down. Peroxide (O at −1), sulfur dioxide (S at +4) and iron(II) are in intermediate states and can be oxidised or reduced.' }
  ],
  applications: [
    'Naming compounds of metals with several states: copper(I) and copper(II) oxide, iron(II) and iron(III) chloride.',
    'Spotting oxidising and reducing agents at a glance from the highest and lowest states.',
    'Counting electrons in redox titrations and in the half-reactions of batteries.',
    'Following carbon through combustion and metabolism, from −4 in methane to +4 in carbon dioxide.'
  ],
  history: 'The Roman-numeral names, such as iron(III) chloride, were proposed by the German chemist Alfred Stock around 1919 and are still called Stock notation.',
  sim: 'ec-oxnum'
},

{
  id: 'redox-reactions', parent: 'redox', title: 'Oxidation and reduction', level: 1,
  short: 'Oxidation is the loss of electrons and reduction the gain. The two always happen together, because the electrons one substance gives up must go to another.',
  keywords: ['oxidation', 'reduction', 'redox', 'oxidising agent', 'reducing agent', 'oxidant', 'reductant', 'OIL RIG', 'electron transfer', 'disproportionation', 'displacement', 'activity series', 'reactivity series', 'half-reaction', 'redox titration', 'permanganate'],
  prereq: ['oxidation-numbers', 'reaction-types', 'chemical-equations'],
  related: ['balancing-redox', 'galvanic-cells', 'electrode-potentials', 'corrosion', 'electrolysis', 'titration-calculations'],
  body: `
Drop a strip of zinc into blue copper sulfate solution. Within minutes the zinc is coated with a brown, spongy layer of copper, the blue begins to fade and the beaker warms up. Nothing has been added but zinc; what has happened is a transfer of electrons:

$$\\ce{Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s)}$$

Each zinc atom hands two electrons to a copper ion. The zinc is **oxidised**: it loses electrons, and its [[oxidation-numbers|oxidation number]] rises from 0 to +2. The copper ion is **reduced**: it gains electrons, and its oxidation number falls from +2 to 0. The mnemonic **OIL RIG** — oxidation is loss, reduction is gain — is worth keeping.

### Always in pairs
Free electrons do not float about in water, so every electron released by an oxidation is taken up at the same moment by a reduction. The reaction as a whole is a **redox** reaction. Writing it as two **half-reactions** shows the bookkeeping:

$$\\ce{Zn -> Zn^2+ + 2e-} \\qquad \\ce{Cu^2+ + 2e- -> Cu}$$

The electrons cancel when the halves are added. The substance that is reduced makes the other one lose electrons, so it is called the **oxidising agent** (here $\\ce{Cu^2+}$); the substance that is oxidised is the **reducing agent** ($\\ce{Zn}$). An oxidising agent is itself reduced: the names describe what each does to its partner.

### Older definitions
Oxidation first meant combining with oxygen — iron rusting, carbon burning — and reduction meant taking oxygen away: "reducing" an ore to its metal, as in the blast furnace,

$$\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$$

where iron goes from +3 to 0 (reduced) and carbon from +2 to +4 (oxidised). Both are special cases of the electron picture, which also covers reactions without any oxygen, such as sodium burning in chlorine to $\\ce{Na+}$ and $\\ce{Cl-}$.

### Recognising redox
Assign oxidation numbers to every atom on both sides. If any change, the reaction is redox; the element whose number rises is oxidised, the one whose number falls is reduced, and the total rise equals the total fall. Precipitation and acid–base neutralisation change no oxidation number and are not redox.

Sometimes one element goes both ways. In **disproportionation** a single species is both oxidised and reduced: chlorine bubbled into cold sodium hydroxide gives chloride (−1) and hypochlorite (+1) — household bleach:

$$\\ce{Cl2 + 2OH- -> Cl- + ClO- + H2O}$$

Hydrogen peroxide slowly does the same, to water (O at −2) and oxygen gas (0). The reverse, **comproportionation**, brings a high and a low state of one element to a middle one.

### Who takes electrons from whom
Metals can be ranked by how readily they give up electrons, the **activity series**: a metal displaces from solution the ions of any metal below it. Zinc reduces $\\ce{Cu^2+}$; a copper wire in silver nitrate grows glittering silver crystals as copper reduces $\\ce{Ag+}$; but copper in zinc sulfate does nothing at all. The series is the qualitative face of [[electrode-potentials|standard electrode potentials]], which put a number in volts on every pairing.

Common oxidising agents are oxygen, the halogens, permanganate, dichromate, hydrogen peroxide, nitric acid and hypochlorite. Common reducing agents are reactive metals, hydrogen, carbon and carbon monoxide, iron(II), sulfite and thiosulfate. Combustion, respiration, photosynthesis, bleaching, [[corrosion]] and every battery are redox reactions.

### Counting electrons: redox titrations
Because electrons are conserved, the moles of electrons given by the reducing agent equal the moles taken by the oxidising agent. That is the basis of redox [[titration-calculations|titrations]]. Purple permanganate is decolourised by iron(II) in acid until the last $\\ce{Fe^2+}$ is used up, and the next drop turns the flask pink — the titrant is its own indicator. Each $\\ce{MnO4-}$ takes five electrons and each $\\ce{Fe^2+}$ gives one, so at the end point $5\\,n(\\ce{MnO4-}) = n(\\ce{Fe^2+})$.
`,
  ideas: [
    'Oxidation is loss of electrons (the oxidation number rises); reduction is gain (it falls).',
    'Oxidation and reduction always happen together: the electrons lost by one species are gained by another.',
    'The oxidising agent is the species that is reduced; the reducing agent is the one that is oxidised.',
    'A reaction is redox exactly when some oxidation number changes.',
    'Electrons are conserved: electrons lost = electrons gained, which fixes the ratio in which oxidant and reductant react.'
  ],
  pitfalls: [
    'The oxidising agent is the substance that gets oxidised — The other way round: an oxidising agent oxidises its partner by taking its electrons, and is itself reduced.',
    'Oxidation always involves oxygen — Oxygen was the first example, but zinc in copper sulfate and sodium in chlorine are oxidations with no oxygen in sight. Oxidation means losing electrons.',
    'A more reactive metal "gives" its reactivity to the solution — Displacement goes one way only: zinc reduces copper ions, but copper cannot reduce zinc ions, however long you wait.'
  ],
  formulas: [
    {
      name: 'Electron balance in a redox titration',
      expr: 'c1*V1*z1 = c2*V2*z2', tex: 'c_1 V_1 z_1 = c_2 V_2 z_2',
      vars: {
        c1: { name: 'concentration of the titrant (oxidising agent)', q: 'concentration', unit: 'M', value: 0.02 },
        V1: { name: 'volume of titrant at the end point', q: 'volume', unit: 'mL', value: 22.4 },
        z1: { name: 'electrons taken by one oxidant ion', value: 5, int: true, fixed: true },
        c2: { name: 'concentration of the analyte (reducing agent)', q: 'concentration', unit: 'M' },
        V2: { name: 'volume of analyte titrated', q: 'volume', unit: 'mL', value: 25 },
        z2: { name: 'electrons given by one reductant ion', value: 1, int: true, fixed: true }
      },
      solveFor: 'c2',
      note: 'Moles of electrons taken = moles of electrons given. The defaults are permanganate ($z_1 = 5$, reduced to $\\ce{Mn^2+}$ in acid) titrating iron(II) ($z_2 = 1$).',
      practice: { unknowns: ['c2', 'V1'] },
      stories: {
        c2: '{V2} of an iron(II) solution needs {V1} of {c1} potassium permanganate to reach the pink end point. What is the concentration of iron(II)?',
        V1: 'What volume of {c1} permanganate is needed to titrate {V2} of {c2} iron(II) solution in acid?'
      }
    },
    {
      name: 'Moles of electrons from a mass of reactant',
      expr: 'ne = m/M*N*dx', tex: 'n_e = \\frac{m}{M}\\,N\\,\\Delta x',
      vars: {
        ne: { name: 'amount of electrons transferred', q: 'amount', unit: 'mol', tex: 'n_e' },
        m: { name: 'mass of the reactant', q: 'mass', unit: 'g', value: 6.54 },
        M: { name: 'molar mass of the reactant', q: 'molarmass', unit: 'g/mol', value: 65.38, fixed: true },
        N: { name: 'atoms of the changing element per formula unit', value: 1, int: true, fixed: true },
        dx: { name: 'change in its oxidation number', value: 2, fixed: true, tex: '\\Delta x' }
      },
      note: 'Moles of substance × atoms per formula × change in oxidation number. Defaults: zinc dissolving as $\\ce{Zn^2+}$. This number of moles of electrons is what links redox to [[faradays-laws|Faraday\'s laws]].',
      practice: { unknowns: ['ne', 'm'] },
      stories: {
        ne: '{m} of zinc ($M$ = {M}) dissolves in acid as $\\ce{Zn^2+}$. How many moles of electrons does it give up?',
        m: 'What mass of zinc ($M$ = {M}) must dissolve as $\\ce{Zn^2+}$ to release {ne} of electrons?'
      }
    }
  ],
  examples: [
    {
      title: 'The blast furnace',
      q: 'In a blast furnace, $\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$. What is oxidised, what is reduced, which are the agents, and how many electrons move per $\\ce{Fe2O3}$?',
      steps: [
        'Iron: +3 in $\\ce{Fe2O3}$, 0 in the metal — reduced. Carbon: +2 in $\\ce{CO}$, +4 in $\\ce{CO2}$ — oxidised. Oxygen stays −2.',
        'So $\\ce{Fe2O3}$ is the oxidising agent and $\\ce{CO}$ the reducing agent.',
        'Electrons gained: 2 iron atoms × 3 = 6. Electrons lost: 3 carbon atoms × 2 = 6. They match, as they must.'
      ],
      a: 'Iron(III) is reduced by carbon monoxide, which is oxidised; six electrons pass per Fe₂O₃.'
    },
    {
      title: 'Iron in an ore by permanganate titration',
      q: 'A 0.500 g sample of iron ore is dissolved in acid and all its iron reduced to $\\ce{Fe^2+}$. Titration needs 22.40 mL of 0.0200 M $\\ce{KMnO4}$. What percentage of the ore is iron?',
      steps: [
        'Permanganate used: $n = 0.0200 \\times 0.02240 = 4.48 \\times 10^{-4}\\ \\mathrm{mol}$.',
        { text: 'Each $\\ce{MnO4-}$ takes 5 electrons and each $\\ce{Fe^2+}$ gives 1:', tex: '\\ce{MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O}' },
        'So $n(\\ce{Fe}) = 5 \\times 4.48 \\times 10^{-4} = 2.24 \\times 10^{-3}\\ \\mathrm{mol}$, a mass of $2.24 \\times 10^{-3} \\times 55.845 = 0.1251\\ \\mathrm{g}$.',
        'Percentage: $0.1251/0.500 \\times 100 = 25.0\\ \\%$.'
      ],
      a: '25.0 % iron by mass.'
    }
  ],
  quiz: [
    { q: 'In the thermite reaction, $\\ce{2Al + Fe2O3 -> Al2O3 + 2Fe}$, which species is the oxidising agent?', choices: ['$\\ce{Al}$', '$\\ce{Fe2O3}$', '$\\ce{Al2O3}$', '$\\ce{Fe}$'], a: 1,
      why: 'Iron goes from +3 to 0, so $\\ce{Fe2O3}$ is reduced — it is the oxidising agent, taking electrons from aluminium (0 → +3), the reducing agent. Products are never called the agents.' },
    { q: 'A clean copper wire is placed in zinc sulfate solution. What happens?', choices: ['the copper becomes coated with zinc', 'nothing: copper cannot reduce zinc ions', 'the solution slowly turns blue as zinc is deposited', 'hydrogen is given off at the copper'], a: 1,
      why: 'Zinc is above copper in the activity series: it gives up electrons more readily. Zinc metal reduces copper ions, but copper metal cannot push electrons onto zinc ions, so no reaction occurs.' },
    { q: 'In any redox reaction, the total increase in oxidation numbers equals the total decrease.', a: true,
      why: 'Each unit of increase is one electron lost and each unit of decrease one electron gained. Electrons are neither created nor destroyed, so the totals must match — the basis of balancing and of titration calculations.' },
    { q: 'Chlorine reacts with cold sodium hydroxide: $\\ce{Cl2 + 2OH- -> Cl- + ClO- + H2O}$. This reaction is…', choices: ['a disproportionation: chlorine is both oxidised and reduced', 'not redox: it is a neutralisation', 'only a reduction of chlorine', 'an oxidation of the hydroxide ion'], a: 0,
      why: 'Chlorine starts at 0 and ends at −1 in chloride (reduced) and +1 in hypochlorite (oxidised). Oxygen and hydrogen do not change. One element going both ways is disproportionation.' },
    { q: '25.0 mL of an iron(II) solution needs 18.0 mL of 0.0200 M permanganate in acid. What is the iron(II) concentration, in mol/L?', answer: 0.072, unit: 'M',
      why: 'Electrons: $0.0200 \\times 18.0 \\times 5 = 1.80$ mmol of electrons taken, so 1.80 mmol of $\\ce{Fe^2+}$ in 25.0 mL: $1.80/25.0 = 0.0720\\ \\mathrm{M}$.' }
  ],
  applications: [
    'Extracting metals from their ores by reduction with carbon, carbon monoxide, hydrogen or electricity.',
    'Bleaching and disinfection with hypochlorite, hydrogen peroxide and ozone.',
    'Redox titrations: iron in ores, vitamin C in juice, dissolved oxygen and the chemical oxygen demand of waste water.',
    'Energy in living cells: glucose is oxidised to carbon dioxide while oxygen is reduced to water.'
  ],
  sim: { id: 'ec-galvanic', params: { a: 'Zn', c: 'Cu' } }
},

{
  id: 'balancing-redox', parent: 'redox', title: 'Balancing redox equations with half-reactions', level: 2,
  short: 'Split the reaction into an oxidation and a reduction, balance each for atoms and charge using water, H⁺ (or OH⁻) and electrons, then scale the halves so that the electrons cancel.',
  keywords: ['half-reaction method', 'ion–electron method', 'balancing redox equations', 'acidic solution', 'basic solution', 'alkaline', 'electron balance', 'permanganate', 'dichromate', 'charge balance'],
  prereq: ['redox-reactions', 'oxidation-numbers', 'chemical-equations'],
  related: ['titration-calculations', 'electrode-potentials', 'galvanic-cells', 'math:systems-of-equations'],
  body: `
Balancing by inspection works for burning methane but not for permanganate oxidising iron(II) in acid:

$$\\ce{MnO4- + Fe^2+ -> Mn^2+ + Fe^3+}\\quad\\text{(unbalanced)}$$

Here atoms are not the only thing to balance. **Charge** must balance too, and the electrons lost by one species must equal the electrons gained by the other. The **half-reaction method** handles all three systematically, and it mirrors what really happens in a [[galvanic-cells|cell]], where the two halves sit in separate beakers.

### In acidic solution
1. **Split** into two skeleton half-reactions, one oxidation and one reduction: $\\ce{Fe^2+ -> Fe^3+}$ and $\\ce{MnO4- -> Mn^2+}$.
2. **Balance the atoms other than O and H.** Here they already are.
3. **Balance oxygen by adding $\\ce{H2O}$** to the side short of it: $\\ce{MnO4- -> Mn^2+ + 4H2O}$.
4. **Balance hydrogen by adding $\\ce{H+}$** to the side short of it: $\\ce{MnO4- + 8H+ -> Mn^2+ + 4H2O}$.
5. **Balance charge by adding electrons** to the more positive side. On the left $-1 + 8 = +7$, on the right $+2$, so five electrons go on the left: $\\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O}$. The iron half needs one: $\\ce{Fe^2+ -> Fe^3+ + e-}$.
6. **Multiply** each half so that both move the same number of electrons (their least common multiple): the iron half × 5.
7. **Add and cancel** whatever appears on both sides — the electrons first:

$$\\ce{MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O}$$

Check: every element balances, and the charge is $-1 + 10 + 8 = +17$ on the left, $+2 + 15 = +17$ on the right. Step 5 agrees with [[oxidation-numbers]]: manganese goes from +7 to +2, so it must take five electrons.

### In basic solution
Balance as if in acid, then **add as many $\\ce{OH-}$ to both sides as there are $\\ce{H+}$**. Each $\\ce{H+}$ and $\\ce{OH-}$ on the same side become a water molecule; cancel any water that now appears on both sides. For permanganate reduced to manganese dioxide, the acid form is

$$\\ce{MnO4- + 4H+ + 3e- -> MnO2 + 2H2O}$$

Adding four $\\ce{OH-}$ to each side turns the $\\ce{4H+}$ into four waters; two of them cancel with the two on the right:

$$\\ce{MnO4- + 2H2O + 3e- -> MnO2 + 4OH-}$$

The medium changes the chemistry, not just the bookkeeping: in acid permanganate is reduced all the way to colourless $\\ce{Mn^2+}$ (five electrons); in neutral or alkaline solution it stops at brown $\\ce{MnO2}$ (three).

### Why the extra species are allowed
Adding $\\ce{H2O}$, $\\ce{H+}$ and $\\ce{OH-}$ is not cheating: they are the solvent and its ions, always present, and they really take part — the oxygen atoms of permanganate do end up in water molecules, which is why the reaction uses up acid. Electrons are the one thing that must never appear in the final equation: every electron released by the oxidation is used by the reduction.

> [!tip] Always finish with the two checks: count each element, then add up the charges on each side. A wrong charge total almost always means the electron count in step 5 was wrong.

### The same job by algebra
Any equation can also be balanced as a [[math:systems-of-equations|system of linear equations]]: one unknown coefficient per species, one equation per element and one for charge. That is how a computer does it — including the checker in the simulation below — but the half-reaction route shows *why* the numbers come out as they do, and it gives you the half-reactions you need for [[electrode-potentials]].
`,
  ideas: [
    'A redox equation must balance atoms, charge and electrons.',
    'Balance each half-reaction separately: other atoms, then O with H₂O, then H with H⁺, then charge with electrons.',
    'Scale the halves to a common number of electrons, add them, and cancel species that appear on both sides.',
    'In base, add OH⁻ to both sides to neutralise every H⁺, then cancel water.',
    'The electrons in a half-reaction equal the change in oxidation number times the number of atoms that change.'
  ],
  pitfalls: [
    'Balancing atoms is enough — An equation such as Cu + Ag⁺ → Cu²⁺ + Ag has balanced atoms but a charge of +1 on the left and +2 on the right. It needs 2Ag⁺ and 2Ag.',
    'In basic solution you can just write OH⁻ wherever H⁺ was — That breaks the hydrogen and oxygen balance. Add the same number of OH⁻ to both sides, combine them with H⁺ to make water, and cancel.',
    'Electrons go on the side with more atoms — They go on the side whose total charge is more positive, so that both sides end up with the same charge.'
  ],
  formulas: [
    {
      name: 'Electrons from the change in oxidation number',
      expr: 'ne = N*(x1 - x2)', tex: 'n_e = N\\,(x_1 - x_2)',
      vars: {
        ne: { name: 'electrons gained per formula unit (negative: electrons lost)', signed: true, tex: 'n_e' },
        N: { name: 'atoms of the element that changes, per formula unit', value: 2, int: true },
        x1: { name: 'oxidation number before', value: 6, signed: true, tex: 'x_1' },
        x2: { name: 'oxidation number after', value: 3, signed: true, tex: 'x_2' }
      },
      note: 'Defaults: dichromate $\\ce{Cr2O7^2-}$ reduced to $\\ce{Cr^3+}$ — two chromium atoms each fall from +6 to +3, so one dichromate ion takes six electrons. A negative result is an oxidation.',
      practice: { unknowns: ['ne', 'x2'] },
      stories: {
        ne: 'In a half-reaction, {N} atoms of one element per formula unit go from oxidation number {x1} to {x2}. How many electrons does one formula unit gain? (A negative answer means electrons are lost.)',
        x2: 'One formula unit gains {ne} electrons (negative: loses them) while {N} atoms of one element start at oxidation number {x1}. What is their final oxidation number?'
      }
    },
    {
      name: 'Electrons that balance the charge',
      expr: 'ne = qL - qR', tex: 'n_e = q_L - q_R',
      vars: {
        ne: { name: 'electrons to add on the left (negative: add them on the right)', signed: true, tex: 'n_e' },
        qL: { name: 'total charge on the left, before electrons', value: 7, int: true, signed: true, tex: 'q_L' },
        qR: { name: 'total charge on the right', value: 2, int: true, signed: true, tex: 'q_R' }
      },
      note: 'Step 5 of the method. Defaults: $\\ce{MnO4- + 8H+}$ (charge +7) → $\\ce{Mn^2+ + 4H2O}$ (charge +2) needs $5e^-$ on the left.',
      practice: { unknowns: ['ne'] },
      stories: {
        ne: 'After balancing atoms, a half-reaction has a total charge of {qL} on the left and {qR} on the right. How many electrons must be added to the left side?'
      }
    }
  ],
  examples: [
    {
      title: 'Dichromate and iron(II) in acid',
      q: 'Balance $\\ce{Cr2O7^2- + Fe^2+ -> Cr^3+ + Fe^3+}$ in acidic solution.',
      steps: [
        'Reduction skeleton: $\\ce{Cr2O7^2- -> Cr^3+}$. Chromium: $\\ce{Cr2O7^2- -> 2Cr^3+}$.',
        'Oxygen: $\\ce{Cr2O7^2- -> 2Cr^3+ + 7H2O}$. Hydrogen: $\\ce{Cr2O7^2- + 14H+ -> 2Cr^3+ + 7H2O}$.',
        { text: 'Charge: left $-2 + 14 = +12$, right $+6$. Add six electrons on the left:', tex: '\\ce{Cr2O7^2- + 14H+ + 6e- -> 2Cr^3+ + 7H2O}' },
        'Oxidation: $\\ce{Fe^2+ -> Fe^3+ + e-}$, multiplied by 6 to match.',
        { text: 'Add and cancel the electrons:', tex: '\\ce{Cr2O7^2- + 6Fe^2+ + 14H+ -> 2Cr^3+ + 6Fe^3+ + 7H2O}' },
        'Check charge: $-2 + 12 + 14 = +24$; $6 + 18 = +24$.'
      ],
      a: 'Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O'
    },
    {
      title: 'Chlorine in hot alkali',
      q: 'Hot sodium hydroxide turns chlorine into chloride and chlorate: $\\ce{Cl2 -> Cl- + ClO3-}$. Balance it in basic solution.',
      steps: [
        'Reduction: $\\ce{Cl2 + 2e- -> 2Cl-}$.',
        'Oxidation: $\\ce{Cl2 -> 2ClO3-}$; oxygen: $\\ce{Cl2 + 6H2O -> 2ClO3-}$; hydrogen: $\\ce{Cl2 + 6H2O -> 2ClO3- + 12H+}$; charge: $0$ on the left, $-2 + 12 = +10$ on the right, so $\\ce{Cl2 + 6H2O -> 2ClO3- + 12H+ + 10e-}$.',
        'Electrons: reduction × 5. Adding: $\\ce{6Cl2 + 6H2O -> 10Cl- + 2ClO3- + 12H+}$.',
        'Base: add $\\ce{12OH-}$ to both sides; the right-hand $\\ce{12H+ + 12OH-}$ become $\\ce{12H2O}$, and six of them cancel the six on the left: $\\ce{6Cl2 + 12OH- -> 10Cl- + 2ClO3- + 6H2O}$.',
        'Divide by 2 and check the charge: $-6$ on the left, $-5 - 1 = -6$ on the right.'
      ],
      a: '3Cl₂ + 6OH⁻ → 5Cl⁻ + ClO₃⁻ + 3H₂O'
    }
  ],
  quiz: [
    { q: 'Balance $\\ce{Cu + NO3- -> Cu^2+ + NO}$ in acid, with the smallest whole numbers. What is the coefficient of $\\ce{H+}$?', answer: 8,
      why: 'Oxidation: $\\ce{Cu -> Cu^2+ + 2e-}$. Reduction: $\\ce{NO3- + 4H+ + 3e- -> NO + 2H2O}$. Six electrons: ×3 and ×2, giving $\\ce{3Cu + 2NO3- + 8H+ -> 3Cu^2+ + 2NO + 4H2O}$.' },
    { q: 'In the charge-balancing step, the electrons are added to…', choices: ['the side whose total charge is more positive', 'the side with more atoms', 'always the left-hand side', 'the side with the oxidised species'], a: 0,
      why: 'Electrons are negative; adding them to the more positive side brings both sides to the same charge. In a reduction that is the left, in an oxidation the right.' },
    { q: 'A balanced redox equation may leave a few electrons on one side, as long as all the atoms balance.', a: false,
      why: 'Electrons released by the oxidation are all taken by the reduction; none are left over in solution. If electrons remain, the two halves were not scaled to the same electron count.' },
    { q: 'You have balanced a half-reaction as if in acid, but the reaction runs in basic solution. What next?', choices: ['add as many OH⁻ to both sides as there are H⁺, turn H⁺ + OH⁻ into water, cancel water', 'replace every H⁺ with OH⁻', 'delete the H⁺ — they are not there in base', 'add water to the left until the charges balance'], a: 0,
      why: 'Adding the same thing to both sides keeps the equation balanced; then each H⁺ + OH⁻ pair is water. Simply swapping H⁺ for OH⁻ would unbalance both hydrogen and oxygen.' },
    { q: 'Permanganate takes five electrons per ion in acid but only three in alkaline solution. Why?', choices: ['in acid it is reduced to Mn²⁺ (+2); in base only as far as MnO₂ (+4)', 'hydroxide ions supply two of the electrons', 'electrons are more expensive in base', 'manganese is +5 in basic solution'], a: 0,
      why: 'The electron count is the fall in oxidation number: +7 → +2 is five, +7 → +4 is three. The product depends on the medium.' }
  ],
  applications: [
    'Writing the equations behind redox titrations with permanganate, dichromate, iodine and thiosulfate.',
    'The half-reactions of batteries and fuel cells, which are balanced in exactly this way.',
    'Dosing oxidants in water treatment (chlorine, ozone, permanganate) from the electrons each can take.'
  ],
  sim: 'ec-halfbal'
}

);
