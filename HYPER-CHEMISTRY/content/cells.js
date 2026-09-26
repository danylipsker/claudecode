/* HYPER-CHEMISTRY · content/cells.js — electrochemical cells: galvanic cells, electrode
 * potentials, the link to free energy and K, the Nernst equation, concentration cells,
 * batteries and fuel cells, and corrosion. */
Hyper.add(

{
  id: 'galvanic-cells', parent: 'cells', title: 'Galvanic cells', level: 2,
  short: 'A redox reaction split into two half-cells joined by a wire and a salt bridge. The electrons must travel through the wire, so the reaction becomes a source of electric current.',
  keywords: ['galvanic cell', 'voltaic cell', 'Daniell cell', 'half-cell', 'anode', 'cathode', 'salt bridge', 'cell notation', 'cell diagram', 'electromotive force', 'EMF', 'porous pot', 'electrode', 'internal resistance'],
  prereq: ['redox-reactions', 'physics:electric-potential', 'electronics:voltage'],
  related: ['electrode-potentials', 'batteries-fuel-cells', 'electrolysis', 'nernst-equation', 'physics:emf-internal-resistance', 'electronics:multimeter'],
  body: `
When zinc sits in copper sulfate solution, electrons jump straight from zinc atoms to copper ions and all the energy of the reaction ends up as heat. Now separate the partners. Put a zinc rod in zinc sulfate solution and a copper rod in copper sulfate solution in a second beaker, join the rods with a wire, and connect the two solutions with a **salt bridge** — a tube of potassium nitrate jelly, or a porous wall. The same reaction runs, but the electrons can only get from zinc to copper **through the wire**, and on the way they can light a lamp or turn a motor. That is a **galvanic** (or voltaic) cell, and this one is the **Daniell cell**.

### Anode and cathode
Each beaker is a **half-cell**, with its own half-reaction:

$$\\text{anode (oxidation):}\\quad \\ce{Zn(s) -> Zn^2+(aq) + 2e-}$$
$$\\text{cathode (reduction):}\\quad \\ce{Cu^2+(aq) + 2e- -> Cu(s)}$$

The **anode** is where oxidation happens and the **cathode** where reduction happens — in every kind of cell, galvanic or electrolytic. In a galvanic cell the anode releases electrons, so it is the **negative** terminal; the cathode consumes them and is **positive**. Electrons flow through the wire from anode to cathode, so the conventional [[physics:electric-current|current]] leaves the cell at the positive copper terminal, as for any battery. As the cell runs the zinc rod thins and the copper rod thickens, the zinc beaker gains $\\ce{Zn^2+}$ and the copper beaker loses $\\ce{Cu^2+}$.

### Why the salt bridge
Without it the current stops within a fraction of a second: the zinc beaker would fill with positive charge, the copper beaker would be left with excess sulfate, and the resulting electric field would stop the electrons. The bridge lets ions drift to cancel the imbalance: **anions** ($\\ce{NO3-}$) move towards the anode compartment, **cations** ($\\ce{K+}$) towards the cathode. The circuit is then closed: electrons through the metal, ions through the solutions. Lift the bridge out and the reading drops to zero at once.

### The voltage
A voltmeter with a very high resistance draws almost no current, so it reads the cell's **electromotive force** (EMF): the [[physics:electric-potential|potential difference]] between the terminals at zero current. For the Daniell cell at standard conditions (1 M solutions, 25 °C) it is 1.10 V. That number belongs to the chemistry, not to the size: a thimble-sized cell and a bathtub-sized one both give 1.10 V. Size decides the **capacity** — how much charge flows before a reactant runs out — and how much current the cell can supply.

The EMF is the difference of the two [[electrode-potentials|electrode potentials]],

$$E_{\\text{cell}} = E_{\\text{cathode}} - E_{\\text{anode}}$$

and it measures how strongly the reaction wants to go: $\\Delta G = -nFE$ ([[cell-potential-gibbs]]). Draw current and the terminal voltage falls below the EMF, because the ions have to squeeze through the solutions and the bridge: the cell has an **internal resistance**, and $V = E - Ir$ ([[physics:emf-internal-resistance]]).

### Cell notation
A cell is written in one line, anode on the left:

$$\\ce{Zn(s) | Zn^2+(aq) || Cu^2+(aq) | Cu(s)}$$

A single bar is a boundary between phases (metal against solution), the double bar is the salt bridge. When both members of a couple are dissolved, an inert platinum wire carries the electrons, as in $\\ce{Pt(s) | Fe^2+(aq) , Fe^3+(aq)}$; gases need one too, as in the hydrogen electrode $\\ce{Pt(s) | H2(g) | H+(aq)}$.

> [!tip] "**An Ox**, **Red Cat**": the **an**ode is where **ox**idation happens, the **cat**hode where **red**uction happens. The sign of each electrode depends on the kind of cell; the chemistry never does.
`,
  ideas: [
    'Separating the two half-reactions forces the electrons through an external wire, where they can do work.',
    'The anode is where oxidation happens (negative in a galvanic cell); the cathode is where reduction happens (positive).',
    'A salt bridge keeps both solutions electrically neutral; without it the current stops.',
    'The EMF is set by the chemistry: E_cell = E_cathode − E_anode. Size sets capacity and current, not voltage.',
    'Under load the terminal voltage is lower than the EMF by the drop across the internal resistance.'
  ],
  pitfalls: [
    'The anode is always the positive terminal — Only in electrolysis. In a galvanic cell (a battery discharging) the anode is negative. What defines the anode is oxidation.',
    'Electrons flow through the salt bridge — Electrons travel only through the metal wire. In the bridge and the solutions the charge is carried by ions.',
    'A bigger cell gives a higher voltage — Voltage depends on the half-reactions and concentrations only. A bigger cell stores more charge and can give more current.'
  ],
  formulas: [
    {
      name: 'Cell potential from the electrode potentials',
      expr: 'E = Ec - Ea', tex: 'E_{\\text{cell}} = E_{\\text{cathode}} - E_{\\text{anode}}',
      vars: {
        E: { name: 'cell potential (EMF)', q: 'voltage', unit: 'V', signed: true, tex: 'E_{\\text{cell}}' },
        Ec: { name: 'reduction potential of the cathode couple', q: 'voltage', unit: 'V', value: 0.34, signed: true, tex: 'E_{\\text{cathode}}' },
        Ea: { name: 'reduction potential of the anode couple', q: 'voltage', unit: 'V', value: -0.76, signed: true, tex: 'E_{\\text{anode}}' }
      },
      note: 'Both potentials are **reduction** potentials, as listed in tables. Defaults: the Daniell cell, copper (+0.34 V) against zinc (−0.76 V). A negative result means the reaction runs the other way.',
      stories: {
        E: 'In a cell, the cathode couple has a reduction potential of {Ec} and the anode couple {Ea}. What is the cell potential?',
        Ea: 'A cell reads {E}. Its cathode couple has a reduction potential of {Ec}. What is the potential of the anode couple?'
      }
    },
    {
      name: 'Terminal voltage under load',
      expr: 'V = E - I*r', tex: 'V = E - Ir',
      vars: {
        V: { name: 'terminal voltage', q: 'voltage', unit: 'V' },
        E: { name: 'EMF of the cell', q: 'voltage', unit: 'V', value: 1.1 },
        I: { name: 'current drawn', q: 'current', unit: 'A', value: 0.02 },
        r: { name: 'internal resistance', q: 'resistance', unit: 'Ω', value: 5 }
      },
      note: 'The internal resistance of a laboratory cell with a salt bridge is ohms to hundreds of ohms, which is why such cells cannot light a torch bulb. Practical batteries are built with large electrodes close together to keep $r$ in the milliohms.',
      stories: {
        V: 'A Daniell cell with EMF {E} and internal resistance {r} supplies {I}. What voltage appears at its terminals?',
        r: 'A cell with EMF {E} reads {V} while delivering {I}. What is its internal resistance?'
      }
    },
    {
      name: 'Charge a mass of anode metal can deliver',
      expr: 'Q = m*z*F/M', tex: 'Q = \\frac{m z F}{M}',
      vars: {
        Q: { name: 'charge (capacity)', q: 'charge', unit: 'A·h' },
        m: { name: 'mass of metal that dissolves', q: 'mass', unit: 'g', value: 10 },
        z: { name: 'electrons per atom', value: 2, int: true, fixed: true },
        F: { const: 'F' },
        M: { name: 'molar mass of the metal', q: 'molarmass', unit: 'g/mol', value: 65.38, fixed: true }
      },
      note: 'Every mole of zinc gives two moles of electrons, $2F$ = 53.6 A·h. Defaults: zinc.',
      practice: { unknowns: ['Q', 'm'] },
      stories: {
        Q: 'The zinc anode of a cell weighs {m}. If it all dissolves as $\\ce{Zn^2+}$ ($M$ = {M}), what charge can the cell deliver?',
        m: 'What mass of zinc ($M$ = {M}) must dissolve to deliver {Q}?'
      }
    }
  ],
  examples: [
    {
      title: 'The Daniell cell',
      q: 'For $\\ce{Zn | Zn^2+ (1 M) || Cu^2+ (1 M) | Cu}$ with $E^\\circ(\\ce{Cu^2+/Cu}) = +0.34$ V and $E^\\circ(\\ce{Zn^2+/Zn}) = -0.76$ V: write the half-reactions, find the EMF, and say which way electrons and ions move.',
      steps: [
        'Anode (oxidation, negative): $\\ce{Zn -> Zn^2+ + 2e-}$. Cathode (reduction, positive): $\\ce{Cu^2+ + 2e- -> Cu}$.',
        { text: 'EMF:', tex: 'E_{\\text{cell}} = 0.34 - (-0.76) = 1.10\\ \\mathrm{V}' },
        'Electrons leave the zinc, travel through the wire and enter the copper electrode.',
        'In the salt bridge, nitrate ions drift towards the zinc beaker (which is gaining $\\ce{Zn^2+}$) and potassium ions towards the copper beaker (which is losing $\\ce{Cu^2+}$).'
      ],
      a: '1.10 V; zinc is the negative anode, copper the positive cathode.'
    },
    {
      title: 'How long will the zinc last?',
      q: 'A Daniell cell has 10.0 g of zinc and plenty of copper sulfate. For how long can it supply a steady 50 mA?',
      steps: [
        'Moles of zinc: $10.0/65.38 = 0.153\\ \\mathrm{mol}$; electrons: $2 \\times 0.153 = 0.306\\ \\mathrm{mol}$.',
        'Charge: $0.306 \\times 96\\,485 = 29\\,500\\ \\mathrm{C} = 8.20\\ \\mathrm{A\\,h}$.',
        'Time: $8.20\\ \\mathrm{A\\,h} / 0.050\\ \\mathrm{A} = 164\\ \\mathrm{h}$, nearly a week.'
      ],
      a: 'About 164 hours (8.2 A·h at 50 mA).'
    }
  ],
  quiz: [
    { q: 'In a galvanic cell, which electrode is the negative terminal?', choices: ['the anode, where oxidation releases electrons', 'the cathode, where reduction happens', 'whichever electrode is larger', 'it depends on which way the voltmeter is connected'], a: 0,
      why: 'Oxidation at the anode releases electrons into the metal, making it negative; the cathode gives electrons up to the ions in solution and is left positive.' },
    { q: 'The salt bridge of a working Daniell cell is lifted out. What happens?', choices: ['the current stops at once', 'the cell keeps working until the zinc is used up', 'the voltage doubles', 'the electrons flow through the air instead'], a: 0,
      why: 'Without the bridge nothing can carry charge between the solutions. Charge builds up in each beaker within microseconds and stops further transfer of electrons: the circuit is open.' },
    { q: 'A Daniell cell built with electrodes ten times larger gives ten times the voltage.', a: false,
      why: 'The EMF depends on the half-reactions and concentrations only. A larger cell has lower internal resistance and more capacity, but the same 1.10 V.' },
    { q: 'In the potassium nitrate salt bridge of a Daniell cell, which way do the nitrate ions move?', choices: ['towards the zinc (anode) compartment', 'towards the copper (cathode) compartment', 'they stay put; only potassium ions move', 'they alternate direction'], a: 0,
      why: 'The anode compartment is gaining $\\ce{Zn^2+}$ ions; negative nitrate ions move in to balance their charge. The cathode compartment is losing $\\ce{Cu^2+}$, so potassium ions move there.' },
    { q: 'A cell is built from copper and silver: $\\ce{Cu | Cu^2+ || Ag+ | Ag}$. With $E^\\circ(\\ce{Ag+/Ag}) = +0.80$ V and $E^\\circ(\\ce{Cu^2+/Cu}) = +0.34$ V, what is its standard EMF, in volts?', answer: 0.46, unit: 'V',
      why: 'Silver has the higher reduction potential, so it is the cathode: $E = 0.80 - 0.34 = 0.46$ V. The coefficient 2 in $\\ce{2Ag+ + Cu -> 2Ag + Cu^2+}$ does not change the potential.' }
  ],
  applications: [
    'Every battery is a galvanic cell, from a coin cell to a car battery.',
    'Electrochemical sensors: pH electrodes, oxygen and lambda sensors, breath-alcohol and glucose meters.',
    'Unwanted galvanic cells cause the corrosion of dissimilar metals in contact.',
    'Measuring free energies, entropies and equilibrium constants from cell voltages.'
  ],
  history: 'Alessandro Volta\'s pile of 1800 stacked zinc and copper (or silver) discs separated by brine-soaked cloth — the first source of steady current. John Frederic Daniell\'s cell of 1836 kept the two solutions apart, which stopped hydrogen bubbles from smothering the copper, and it powered the early telegraph networks.',
  sim: 'ec-galvanic'
},

{
  id: 'electrode-potentials', parent: 'cells', title: 'Standard electrode potentials', level: 2,
  short: 'How strongly each half-reaction takes electrons, measured in volts against the standard hydrogen electrode. The higher the reduction potential, the stronger the oxidising agent; any two half-reactions combine into a cell.',
  keywords: ['standard electrode potential', 'standard reduction potential', 'E°', 'standard hydrogen electrode', 'SHE', 'electrochemical series', 'reference electrode', 'calomel electrode', 'silver chloride electrode', 'redox couple', 'spontaneity', 'oxidising strength'],
  prereq: ['galvanic-cells', 'redox-reactions', 'physics:electric-potential'],
  related: ['cell-potential-gibbs', 'nernst-equation', 'corrosion', 'electrolysis', 'balancing-redox', 'gibbs-energy'],
  body: `
Only a potential **difference** can be measured — a voltmeter has two leads — so no one can measure the potential of a single half-cell. Chemists do what surveyors do with heights: they choose a reference and call it zero. The reference is the **standard hydrogen electrode** (SHE): platinum coated with finely divided platinum, dipping into acid with $\\ce{H+}$ at 1 M (strictly, activity 1), with hydrogen at 1 bar bubbling over it.

$$\\ce{2H+(aq) + 2e- <=> H2(g)} \\qquad E^\\circ = 0\\ \\text{V by definition}$$

The **standard electrode potential** $E^\\circ$ of any other couple is the EMF of a cell with the SHE on the left of the cell diagram and that half-cell on the right, everything at standard conditions: 1 M solutes, 1 bar gases, pure solids, usually 25 °C. Copper against the SHE reads 0.34 V with copper positive; zinc reads 0.76 V with zinc negative. So $E^\\circ(\\ce{Cu^2+/Cu}) = +0.34$ V and $E^\\circ(\\ce{Zn^2+/Zn}) = -0.76$ V.

### The table
Potentials are listed for the half-reactions written as **reductions**, with the strongest oxidising agent at the top (values at 25 °C):

| Half-reaction | $E^\\circ$ / V |
|---|---|
| $\\ce{F2 + 2e- -> 2F-}$ | +2.87 |
| $\\ce{H2O2 + 2H+ + 2e- -> 2H2O}$ | +1.78 |
| $\\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O}$ | +1.51 |
| $\\ce{Cl2 + 2e- -> 2Cl-}$ | +1.36 |
| $\\ce{O2 + 4H+ + 4e- -> 2H2O}$ | +1.23 |
| $\\ce{Br2 + 2e- -> 2Br-}$ | +1.07 |
| $\\ce{Ag+ + e- -> Ag}$ | +0.80 |
| $\\ce{Fe^3+ + e- -> Fe^2+}$ | +0.77 |
| $\\ce{I2 + 2e- -> 2I-}$ | +0.54 |
| $\\ce{Cu^2+ + 2e- -> Cu}$ | +0.34 |
| $\\ce{2H+ + 2e- -> H2}$ | 0 (reference) |
| $\\ce{Pb^2+ + 2e- -> Pb}$ | −0.13 |
| $\\ce{Ni^2+ + 2e- -> Ni}$ | −0.26 |
| $\\ce{Fe^2+ + 2e- -> Fe}$ | −0.44 |
| $\\ce{Zn^2+ + 2e- -> Zn}$ | −0.76 |
| $\\ce{2H2O + 2e- -> H2 + 2OH-}$ | −0.83 |
| $\\ce{Al^3+ + 3e- -> Al}$ | −1.66 |
| $\\ce{Mg^2+ + 2e- -> Mg}$ | −2.37 |
| $\\ce{Na+ + e- -> Na}$ | −2.71 |
| $\\ce{Li+ + e- -> Li}$ | −3.04 |

### Reading it
- A species on the **left** of a high entry is a strong **oxidising agent**: fluorine, peroxide, permanganate, chlorine. A species on the **right** of a low entry is a strong **reducing agent**: lithium, sodium, magnesium.
- The oxidising agent of one line reacts with the reducing agent of any line **below** it. In a cell, the couple with the higher potential is the cathode, and $E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$ is positive for the reaction that goes.
- Can iron(III) oxidise iodide? $0.77 > 0.54$, so yes, with $E^\\circ_{\\text{cell}} = +0.23$ V. Can iodine oxidise iron(II)? No.
- Metals below hydrogen (zinc, iron, nickel) dissolve in 1 M acid giving hydrogen; copper and silver do not. Copper does dissolve in nitric acid, because nitrate, not $\\ce{H+}$, is the oxidant ($\\ce{NO3-}$ to $\\ce{NO}$: +0.96 V).

### Potentials do not scale with the equation
Multiplying a half-reaction by 2 doubles the electrons and the free energy, but **not** $E^\\circ$, because a potential is energy per unit charge. In $\\ce{2Ag+ + Cu -> 2Ag + Cu^2+}$ silver still counts 0.80 V, never 1.60 V. For the same reason two half-reaction potentials cannot simply be added to give a third: add their free energies, $nFE^\\circ$, instead. From $\\ce{Fe^3+/Fe^2+}$ (+0.77 V, one electron) and $\\ce{Fe^2+/Fe}$ (−0.44 V, two electrons), the couple $\\ce{Fe^3+/Fe}$ is $(0.77 - 0.88)/3 = -0.04$ V.

### Reference electrodes in practice
A hydrogen electrode is awkward, so laboratories use secondary references of known potential: **silver/silver chloride** (+0.197 V in saturated KCl) and the **saturated calomel** electrode (+0.241 V). A reading against either is converted to the hydrogen scale by adding its value. One of them sits inside every pH probe.

> [!warn] Standard potentials describe standard conditions and say nothing about speed. At other concentrations use the [[nernst-equation|Nernst equation]]. A large positive $E^\\circ$ says a reaction *can* go, not that it will be quick: hydrogen and oxygen can sit together for years without a spark or a catalyst.
`,
  ideas: [
    'Single-electrode potentials are defined relative to the standard hydrogen electrode, set at exactly 0 V.',
    'Tables list reduction potentials: the more positive, the stronger the oxidising agent on the left; the more negative, the stronger the reducing agent on the right.',
    'The couple with the higher potential is the cathode; E°cell = E°cathode − E°anode, positive for the spontaneous direction.',
    'Potentials are intensive: multiplying a half-reaction does not change E°. Combine free energies (nFE°), not potentials.',
    'Practical measurements use secondary references such as Ag/AgCl (+0.197 V) or calomel (+0.241 V).'
  ],
  pitfalls: [
    'Multiply E° by the coefficient when the half-reaction is doubled — E° is energy per coulomb and stays the same; only ΔG° doubles.',
    'Reverse the sign of the anode potential and then subtract it again — Use E°cathode − E°anode with both as tabulated reduction potentials; flipping the sign as well counts the reversal twice.',
    'A positive E° means the reaction is fast — It means ΔG° is negative. Rate depends on kinetics: many favourable electrode reactions (oxygen reduction, hydrogen on lead) are very slow.'
  ],
  formulas: [
    {
      name: 'Standard cell potential',
      expr: 'E = Ec - Ea', tex: 'E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}',
      vars: {
        E: { name: 'standard cell potential', q: 'voltage', unit: 'V', signed: true, tex: 'E^\\circ_{\\text{cell}}' },
        Ec: { name: 'standard reduction potential of the cathode couple', q: 'voltage', unit: 'V', value: 0.77, signed: true, tex: 'E^\\circ_{\\text{cathode}}' },
        Ea: { name: 'standard reduction potential of the anode couple', q: 'voltage', unit: 'V', value: 0.54, signed: true, tex: 'E^\\circ_{\\text{anode}}' }
      },
      note: 'Defaults: iron(III) oxidising iodide, $\\ce{2Fe^3+ + 2I- -> 2Fe^2+ + I2}$. A positive result means the reaction as written is spontaneous at standard conditions.',
      stories: {
        E: 'Will the oxidant of a couple with $E^\\circ$ = {Ec} oxidise the reductant of a couple with $E^\\circ$ = {Ea}? Find the standard cell potential.',
        Ec: 'A cell has a standard EMF of {E}; its anode couple has $E^\\circ$ = {Ea}. What is the standard potential of the cathode couple?'
      }
    },
    {
      name: 'Combining two half-reactions into a third',
      expr: 'E3 = (n1*E1 + n2*E2)/n3', tex: 'E_3^\\circ = \\frac{n_1 E_1^\\circ + n_2 E_2^\\circ}{n_3}',
      vars: {
        E3: { name: 'potential of the combined half-reaction', q: 'voltage', unit: 'V', signed: true, tex: 'E_3^\\circ' },
        n1: { name: 'electrons in the first half-reaction', value: 1, int: true, tex: 'n_1' },
        E1: { name: 'potential of the first', q: 'voltage', unit: 'V', value: 0.77, signed: true, tex: 'E_1^\\circ' },
        n2: { name: 'electrons in the second', value: 2, int: true, tex: 'n_2' },
        E2: { name: 'potential of the second', q: 'voltage', unit: 'V', value: -0.44, signed: true, tex: 'E_2^\\circ' },
        n3: { name: 'electrons in the combined one (n₁ + n₂)', value: 3, int: true, tex: 'n_3' }
      },
      note: 'Free energies add, potentials do not. Defaults: $\\ce{Fe^3+ + e- -> Fe^2+}$ plus $\\ce{Fe^2+ + 2e- -> Fe}$ gives $\\ce{Fe^3+ + 3e- -> Fe}$.',
      practice: { unknowns: ['E3', 'E2'] },
      stories: {
        E3: 'A one-electron reduction has $E^\\circ$ = {E1}; the next, two-electron step has {E2}. What is $E^\\circ$ for the overall three-electron reduction?'
      }
    },
    {
      name: 'Converting a reading to the hydrogen scale',
      expr: 'Eshe = Emeas + Eref', tex: 'E_{\\text{SHE}} = E_{\\text{meas}} + E_{\\text{ref}}',
      vars: {
        Eshe: { name: 'potential against the standard hydrogen electrode', q: 'voltage', unit: 'V', signed: true, tex: 'E_{\\text{SHE}}' },
        Emeas: { name: 'potential measured against the reference electrode', q: 'voltage', unit: 'V', value: 0.143, signed: true, tex: 'E_{\\text{meas}}' },
        Eref: { name: 'potential of the reference electrode (vs SHE)', q: 'voltage', unit: 'V', value: 0.197, signed: true, tex: 'E_{\\text{ref}}' }
      },
      note: 'Defaults: a copper electrode in 1 M copper sulfate read against a saturated Ag/AgCl reference (+0.197 V). For a saturated calomel electrode use +0.241 V.',
      stories: {
        Eshe: 'An electrode reads {Emeas} against a reference electrode whose own potential is {Eref} on the hydrogen scale. What is its potential against the SHE?',
        Emeas: 'An electrode at {Eshe} on the hydrogen scale is measured against a reference at {Eref}. What will the meter read?'
      }
    }
  ],
  examples: [
    {
      title: 'Halogens displacing halides',
      q: 'Does chlorine oxidise bromide ions? Does iodine? Use $E^\\circ(\\ce{Cl2/Cl-}) = +1.36$ V, $E^\\circ(\\ce{Br2/Br-}) = +1.07$ V, $E^\\circ(\\ce{I2/I-}) = +0.54$ V.',
      steps: [
        { text: 'Chlorine as cathode, bromide as anode:', tex: '\\ce{Cl2 + 2Br- -> 2Cl- + Br2}\\qquad E^\\circ = 1.36 - 1.07 = +0.29\\ \\mathrm{V}' },
        'Positive: chlorine water turns a bromide solution orange-brown. This is how bromine is extracted from seawater.',
        { text: 'Iodine as cathode, bromide as anode:', tex: '\\ce{I2 + 2Br- -> 2I- + Br2}\\qquad E^\\circ = 0.54 - 1.07 = -0.53\\ \\mathrm{V}' },
        'Negative: no reaction. The reverse, bromine oxidising iodide, is the one that goes.'
      ],
      a: 'Chlorine oxidises bromide (+0.29 V); iodine cannot (−0.53 V).'
    },
    {
      title: 'Which metals dissolve in acid?',
      q: 'Which of zinc, iron, copper and silver dissolve in 1 M hydrochloric acid with the release of hydrogen?',
      steps: [
        'The oxidising agent is $\\ce{H+}$ (0 V). A metal dissolves if its couple lies below 0 V, so that $E^\\circ_{\\text{cell}} = 0 - E^\\circ_{\\text{metal}} > 0$.',
        'Zinc: $0 - (-0.76) = +0.76$ V — dissolves. Iron: $+0.44$ V — dissolves.',
        'Copper: $0 - 0.34 = -0.34$ V; silver: $-0.80$ V — neither dissolves.'
      ],
      a: 'Zinc and iron dissolve, releasing hydrogen; copper and silver do not.'
    }
  ],
  quiz: [
    { q: 'Which is the strongest reducing agent?', choices: ['$\\ce{Li}$', '$\\ce{Zn}$', '$\\ce{Cu}$', '$\\ce{F-}$'], a: 0,
      why: 'Reducing agents sit on the right of the table; the lower the potential, the stronger. $\\ce{Li+/Li}$ is at −3.04 V, the bottom. Fluoride, on the right of the highest entry, is the weakest reducing agent of all.' },
    { q: '$E^\\circ(\\ce{Ag+/Ag}) = +0.80$ V. What is $E^\\circ$ for $\\ce{2Ag+ + 2e- -> 2Ag}$?', choices: ['+0.80 V', '+1.60 V', '+0.40 V', '−0.80 V'], a: 0,
      why: 'A potential is energy per unit charge. Doubling the equation doubles both the energy and the charge, so the potential is unchanged.' },
    { q: 'Copper metal dissolves in 1 M hydrochloric acid, releasing hydrogen.', a: false,
      why: 'For $\\ce{Cu + 2H+ -> Cu^2+ + H2}$, $E^\\circ = 0 - 0.34 = -0.34$ V: not spontaneous. Copper needs an oxidising acid such as nitric acid, where nitrate takes the electrons.' },
    { q: 'A copper electrode reads +0.143 V against a saturated Ag/AgCl reference (+0.197 V against the SHE). What is its potential on the hydrogen scale, in volts?', answer: 0.34, unit: 'V',
      why: 'Add the reference potential: $0.143 + 0.197 = 0.340$ V, the standard potential of copper.' },
    { q: 'Iron(III) and iodide are mixed; $E^\\circ(\\ce{Fe^3+/Fe^2+}) = +0.77$ V and $E^\\circ(\\ce{I2/I-}) = +0.54$ V. What happens?', choices: ['iodide is oxidised to iodine and iron(III) is reduced ($E^\\circ$ = +0.23 V)', 'iodine oxidises iron(II)', 'nothing: both potentials are positive', 'iron(III) is oxidised to iron(IV)'], a: 0,
      why: 'The higher couple (iron) runs as the reduction, the lower (iodine) as the oxidation: $E^\\circ = 0.77 - 0.54 = +0.23$ V > 0. Both being positive does not matter — only their difference.' }
  ],
  applications: [
    'Predicting which reactions go: metals in acids, halogen displacement, the choice of oxidant or reductant in synthesis.',
    'Reference electrodes in pH meters, corrosion probes and laboratory potentiostats.',
    'Choosing battery chemistries: the wider the gap between the electrodes, the higher the voltage — lithium, at the bottom of the table, gives lithium cells their 3–4 V.',
    'The galvanic series engineers use to avoid corrosion between dissimilar metals.'
  ],
  sim: { id: 'ec-galvanic', params: { a: 'H2', c: 'Cu' } }
},

{
  id: 'cell-potential-gibbs', parent: 'cells', title: 'Cell potential, free energy and K', level: 3,
  short: 'A cell\'s voltage is the free energy of its reaction per unit of charge: ΔG = −nFE. At standard conditions the same link ties E° to the equilibrium constant, so one measured voltage gives ΔG°, K and — from its temperature dependence — ΔS°.',
  keywords: ['Gibbs free energy', 'ΔG = −nFE', 'Faraday constant', 'equilibrium constant', 'maximum electrical work', 'spontaneity', 'temperature coefficient', 'entropy from EMF', 'solubility product from potentials', 'fuel cell efficiency', 'thermoneutral voltage'],
  prereq: ['electrode-potentials', 'gibbs-energy', 'gibbs-equilibrium'],
  related: ['nernst-equation', 'equilibrium-constant', 'batteries-fuel-cells', 'solubility-product', 'physics:electric-potential-energy', 'math:logarithms'],
  body: `
A volt is a joule per coulomb ([[physics:electric-potential-energy]]). When a cell pushes the electrons of its reaction through a potential difference $E$, the electrical work it can do is charge × voltage. A mole of electrons carries a charge $F = N_A e = 96\\,485$ C — the **Faraday constant** — so a reaction that moves $n$ moles of electrons per mole of reaction can deliver at most $nFE$ joules. That maximum useful work is exactly the fall in [[gibbs-energy|Gibbs free energy]]:

$$\\Delta G = -nFE$$

The minus sign carries the whole meaning: a **positive** cell potential goes with a **negative** $\\Delta G$, a spontaneous reaction. A negative $E$ means the reverse reaction is the spontaneous one. For the Daniell cell, $n = 2$ and $E^\\circ = 1.10$ V, so $\\Delta G^\\circ = -2 \\times 96\\,485 \\times 1.10 = -212$ kJ per mole of zinc.

### Intensive and extensive
$E$ does not depend on how the equation is written; $\\Delta G$ does. Double every coefficient and $n$ doubles, $\\Delta G$ doubles, $E$ stays put. That is why tables list potentials rather than free energies, and why half-reactions must be combined through their free energies, not their potentials ([[electrode-potentials]]).

### Voltage and the equilibrium constant
Standard free energy and the equilibrium constant are linked by $\\Delta G^\\circ = -RT\\ln K$ ([[gibbs-equilibrium]]). Together with $\\Delta G^\\circ = -nFE^\\circ$:

$$E^\\circ = \\frac{RT}{nF}\\ln K \\qquad\\Longleftrightarrow\\qquad K = \\exp\\!\\left(\\frac{nFE^\\circ}{RT}\\right)$$

At 25 °C, $RT/F = 25.69$ mV, and in base-10 [[math:logarithms|logarithms]] $\\log_{10} K = nE^\\circ/(0.05916\\ \\text{V})$. The exponential turns modest voltages into enormous constants: every 59 mV is a factor of ten in $K$ for a one-electron reaction. The Daniell cell's 1.10 V gives $\\log_{10} K = 2 \\times 1.10/0.05916 = 37.2$, so $K \\approx 1.5 \\times 10^{37}$ — no analysis could ever detect the copper ions left at equilibrium. A one-electron cell with $E^\\circ = 0.10$ V has $K$ of only about 50.

So three quantities form one triangle: $\\Delta G^\\circ$, $K$ and $E^\\circ$ each give the other two, and their signs always agree. $E^\\circ > 0$, $\\Delta G^\\circ < 0$ and $K > 1$ all say "products favoured". Cell voltages are one of the best ways to measure constants that are too large or too small to find by analysing a mixture — the [[solubility-product|solubility products]] of silver halides, the stability of complex ions, even the ionic product of water.

### Temperature and entropy
Because $\\partial(\\Delta G)/\\partial T = -\\Delta S$, the temperature coefficient of the EMF gives the entropy of reaction directly:

$$\\frac{dE^\\circ}{dT} = \\frac{\\Delta S^\\circ}{nF}$$

and then $\\Delta H^\\circ = \\Delta G^\\circ + T\\Delta S^\\circ$. For hydrogen and oxygen forming liquid water, $\\Delta S^\\circ = -163$ J/(mol·K), so the EMF falls by about 0.85 mV for every kelvin. A few careful readings of a cell's voltage at different temperatures give all three state functions — a classic experiment in physical chemistry, and a reminder that [[physics:entropy|entropy]] is as measurable as heat.

### The limit on a fuel cell
A heat engine is limited by Carnot's efficiency; a fuel cell is limited by $\\Delta G/\\Delta H$. For $\\ce{H2 + 1/2 O2 -> H2O(l)}$, $\\Delta G^\\circ = -237.1$ kJ/mol and $\\Delta H^\\circ = -285.8$ kJ/mol, so at most 83 % of the heat of combustion can come out as electricity at 25 °C. The voltage equivalent of the whole enthalpy, $285.8\\ \\text{kJ/mol} / 2F = 1.48$ V, is called the **thermoneutral voltage**. A real fuel cell working at 0.70 V turns $0.70/1.48 \\approx 47$ % of the hydrogen's heat of combustion into electricity; the rest becomes heat. Run backwards, the same numbers set the minimum voltage for [[electrolysis]] of water: 1.23 V, and 1.48 V to run without drawing heat from the surroundings.
`,
  ideas: [
    'ΔG = −nFE: the cell potential is the free energy of reaction per coulomb of charge moved.',
    'Positive E means negative ΔG and a spontaneous reaction; E, ΔG and K always agree in sign.',
    'E is intensive (same however the equation is written); ΔG is extensive (it scales with n).',
    'E° = (RT/nF) ln K: at 25 °C every 59 mV/n of E° is a factor of ten in K.',
    'dE°/dT = ΔS°/nF, so voltages measured at several temperatures give ΔS° and ΔH° too.'
  ],
  pitfalls: [
    'Doubling the equation doubles E° — It doubles n and ΔG°, but E° = −ΔG°/(nF) is unchanged.',
    'A reaction with E° = 0.2 V is only slightly favourable — For n = 2 that is K ≈ 6 × 10⁶: essentially complete. The logarithm hides how large K becomes.',
    'Using E instead of E° in ln K — Only the standard potential is tied to K. The actual E depends on the current concentrations and is zero at equilibrium.'
  ],
  formulas: [
    {
      name: 'Free energy from cell potential',
      expr: 'dG = -n*F*E', tex: '\\Delta G^\\circ = -nFE^\\circ',
      vars: {
        dG: { name: 'standard Gibbs energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G^\\circ' },
        n: { name: 'moles of electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' },
        E: { name: 'standard cell potential', q: 'voltage', unit: 'V', value: 1.1, signed: true, tex: 'E^\\circ' }
      },
      note: 'Defaults: the Daniell cell. The same relation holds away from standard conditions with $\\Delta G$ and $E$.',
      practice: { unknowns: ['dG', 'E'] },
      stories: {
        dG: 'A cell reaction transfers {n} electrons and has a standard EMF of {E}. What is its standard Gibbs energy change?',
        E: 'A redox reaction has $\\Delta G^\\circ$ = {dG} with {n} electrons transferred. What standard EMF would a cell based on it give?'
      }
    },
    {
      name: 'Equilibrium constant from the standard potential',
      expr: 'K = exp(n*F*E/(R*T))', tex: 'K = \\exp\\!\\left(\\frac{nFE^\\circ}{RT}\\right)',
      vars: {
        K: { name: 'equilibrium constant' },
        n: { name: 'moles of electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' },
        E: { name: 'standard cell potential', q: 'voltage', unit: 'V', value: 0.23, signed: true, tex: 'E^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'Defaults: $\\ce{2Fe^3+ + 2I- <=> 2Fe^2+ + I2}$, $E^\\circ = +0.23$ V, which gives $K \\approx 6 \\times 10^{7}$.',
      practice: { unknowns: ['K', 'E'] },
      stories: {
        K: 'A reaction transferring {n} electrons has a standard cell potential of {E} at {T}. What is its equilibrium constant?',
        E: 'A redox equilibrium with {n} electrons transferred has $K$ = {K} at {T}. What is its standard cell potential?'
      }
    },
    {
      name: 'EMF change with temperature (entropy of reaction)',
      expr: 'dE = dS*dT/(n*F)', tex: '\\Delta E^\\circ = \\frac{\\Delta S^\\circ\\,\\Delta T}{nF}',
      vars: {
        dE: { name: 'change in the standard EMF', q: 'voltage', unit: 'mV', signed: true, tex: '\\Delta E^\\circ' },
        dS: { name: 'standard entropy of reaction', q: 'molarheat', unit: 'J/(mol·K)', value: -163.3, signed: true, tex: '\\Delta S^\\circ' },
        dT: { name: 'change in temperature', q: 'dtemp', unit: 'K', value: 10, signed: true, tex: '\\Delta T' },
        n: { name: 'moles of electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' }
      },
      note: 'The integrated form of $dE^\\circ/dT = \\Delta S^\\circ/nF$, good over a few tens of kelvin. Defaults: $\\ce{H2 + 1/2 O2 -> H2O(l)}$, whose EMF falls by 0.85 mV per kelvin.',
      practice: { unknowns: ['dE', 'dS'] },
      stories: {
        dS: 'The EMF of a cell transferring {n} electrons changes by {dE} when it is warmed by {dT}. What is the standard entropy of its reaction?',
        dE: 'A cell reaction with {n} electrons has $\\Delta S^\\circ$ = {dS}. By how much does its EMF change when the temperature rises by {dT}?'
      }
    }
  ],
  derivation: {
    title: 'From electrical work to ΔG = −nFE and to K',
    steps: [
      { text: 'Moving a charge $Q$ through a potential difference $E$ exchanges electrical work', tex: 'W = QE' },
      { text: 'One mole of reaction moves $n$ moles of electrons, a charge $nF$, so the most work it can deliver is', tex: 'W_{\\max} = nFE' },
      { text: 'At constant temperature and pressure the maximum work other than expansion equals the fall in Gibbs energy:', tex: '-\\Delta G = nFE \\;\\Rightarrow\\; \\Delta G = -nFE' },
      { text: 'At standard conditions, $\\Delta G^\\circ = -RT\\ln K$ as well. Equate the two:', tex: '-nFE^\\circ = -RT\\ln K \\;\\Rightarrow\\; E^\\circ = \\frac{RT}{nF}\\ln K' }
    ]
  },
  examples: [
    {
      title: 'The Daniell cell as thermodynamics',
      q: 'The Daniell cell has $E^\\circ = 1.10$ V with $n = 2$. Find $\\Delta G^\\circ$ and $K$ at 25 °C for $\\ce{Zn + Cu^2+ -> Zn^2+ + Cu}$.',
      steps: [
        { text: 'Free energy:', tex: '\\Delta G^\\circ = -2 \\times 96\\,485 \\times 1.10 = -2.12 \\times 10^{5}\\ \\mathrm{J/mol} = -212\\ \\mathrm{kJ/mol}' },
        { text: 'Equilibrium constant:', tex: '\\log_{10} K = \\frac{2 \\times 1.10}{0.05916} = 37.2 \\;\\Rightarrow\\; K \\approx 1.5 \\times 10^{37}' },
        'At equilibrium $[\\ce{Zn^2+}]/[\\ce{Cu^2+}] = 1.5 \\times 10^{37}$: starting from 1 M copper sulfate, the copper ions left would be around $10^{-37}$ M — far fewer than one ion in any real beaker.'
      ],
      a: 'ΔG° = −212 kJ/mol and K ≈ 1.5 × 10³⁷: the reaction goes to completion.'
    },
    {
      title: 'A solubility product from two potentials',
      q: 'Use $E^\\circ(\\ce{AgCl/Ag}) = +0.222$ V (for $\\ce{AgCl + e- -> Ag + Cl-}$) and $E^\\circ(\\ce{Ag+/Ag}) = +0.800$ V to find $K_{sp}$ of silver chloride at 25 °C.',
      steps: [
        'Subtract the second half-reaction from the first: $\\ce{AgCl -> Ag+ + Cl-}$, the dissolving reaction, with $n = 1$.',
        { text: 'Its standard potential:', tex: 'E^\\circ = 0.222 - 0.800 = -0.578\\ \\mathrm{V}' },
        { text: 'Then', tex: 'K_{sp} = \\exp\\!\\left(\\frac{F \\times (-0.578)}{RT}\\right) = \\exp(-22.50) = 1.7 \\times 10^{-10}' },
        'This matches the value found by other methods — measured in minutes with a voltmeter, for a salt whose saturated solution holds only about 13 µmol of silver per litre.'
      ],
      a: 'K_sp ≈ 1.7 × 10⁻¹⁰.'
    }
  ],
  quiz: [
    { q: 'A cell reaction has $E^\\circ = -0.20$ V. Which is true?', choices: ['$\\Delta G^\\circ > 0$ and $K < 1$: the reverse reaction is favoured', '$\\Delta G^\\circ < 0$ and $K > 1$', '$\\Delta G^\\circ > 0$ and $K > 1$', 'the reaction cannot take place in either direction'], a: 0,
      why: '$\\Delta G^\\circ = -nFE^\\circ$ is positive and $K = \\exp(nFE^\\circ/RT)$ is less than 1. The reverse reaction has $E^\\circ = +0.20$ V and goes.' },
    { q: 'All the coefficients of a cell reaction are doubled. Then…', choices: ['ΔG° doubles, E° is unchanged', 'both ΔG° and E° double', 'E° doubles, ΔG° is unchanged', 'neither changes'], a: 0,
      why: '$n$ doubles, so $\\Delta G^\\circ = -nFE^\\circ$ doubles while $E^\\circ$ — energy per unit charge — stays the same. $K$ is squared.' },
    { q: 'A one-electron reaction has $E^\\circ = 0.1183$ V at 25 °C. What is $\\log_{10} K$?', answer: 2,
      why: '$\\log_{10} K = nE^\\circ/0.05916 = 0.1183/0.05916 = 2.00$, so $K = 100$.' },
    { q: 'A large positive $E^\\circ$ guarantees that the reaction proceeds quickly.', a: false,
      why: '$E^\\circ$ fixes $\\Delta G^\\circ$ and $K$ — how far the reaction can go — not its rate. A mixture of hydrogen and oxygen ($E^\\circ$ = 1.23 V) is stable for years without a catalyst or spark.' },
    { q: 'A cell reaction with $n = 2$ has $E^\\circ = 0.46$ V. What is $\\Delta G^\\circ$, in kJ/mol?', answer: -88.8, unit: 'kJ/mol',
      why: '$\\Delta G^\\circ = -2 \\times 96\\,485 \\times 0.46 = -88\\,800$ J/mol $= -88.8$ kJ/mol. This is the copper–silver cell.' }
  ],
  applications: [
    'Measuring equilibrium constants too large or too small to analyse directly, such as solubility products and complex stabilities.',
    'Thermodynamic data (ΔG°, ΔH°, ΔS°) from EMF measurements at several temperatures.',
    'The efficiency limit of fuel cells and the minimum voltage needed for electrolysis.',
    'Estimating the energy a battery chemistry can store: nFE per mole of reaction.'
  ],
  sim: { id: 'ec-nernst', params: { mode: 'daniell' } }
},

{
  id: 'nernst-equation', parent: 'cells', title: 'The Nernst equation', level: 3,
  short: 'How a cell\'s voltage depends on concentrations: E = E° − (RT/nF) ln Q. At 25 °C every factor of ten in the reaction quotient shifts the potential by 59 mV divided by the number of electrons.',
  keywords: ['Nernst equation', 'reaction quotient', 'concentration dependence', '59 mV per decade', 'pH dependence', 'non-standard conditions', 'equilibrium', 'activity', 'half-cell potential', 'RT/F', 'pH electrode'],
  prereq: ['cell-potential-gibbs', 'reaction-quotient', 'math:logarithms'],
  related: ['concentration-cells', 'ph-scale', 'electrode-potentials', 'batteries-fuel-cells', 'le-chatelier', 'electronics:sensor-interfacing'],
  body: `
Standard potentials are for 1 M solutions. Change the concentrations and the voltage changes: a Daniell cell whose copper sulfate is nearly used up gives less than 1.10 V, and a flat battery gives almost nothing. The rule comes straight from the way free energy depends on composition, $\\Delta G = \\Delta G^\\circ + RT\\ln Q$ ([[reaction-quotient]]). Divide by $-nF$:

$$E = E^\\circ - \\frac{RT}{nF}\\ln Q$$

This is the **Nernst equation**. $Q$ is the reaction quotient of the cell reaction, written like an equilibrium constant but with the concentrations actually present: dissolved species in mol/L divided by 1 M (so $Q$ has no units), gases as partial pressures in bar, pure solids and the water solvent left out. At 25 °C, in base-10 logarithms,

$$E = E^\\circ - \\frac{0.05916\\ \\text{V}}{n}\\log_{10} Q$$

### Reading it
- **Direction.** Products building up make $Q$ larger and $E$ smaller; adding reactant does the opposite — [[le-chatelier|Le Chatelier's principle]] in volts.
- **Size.** The effect is logarithmic and small: a tenfold change in $Q$ moves $E$ by 59 mV when $n = 1$, by 30 mV when $n = 2$. A Daniell cell stays near 1.1 V for most of its life and collapses only at the very end.
- **Equilibrium.** As a cell discharges, $Q$ grows until it equals $K$. Then $E = 0$: no more work can be had, and the battery is flat. Setting $E = 0$ gives back $E^\\circ = (RT/nF)\\ln K$ ([[cell-potential-gibbs]]).
- **Temperature.** The slope is proportional to the absolute temperature: 54 mV per decade at 0 °C, 59 at 25 °C, 74 at 100 °C, for $n = 1$.

For the Daniell cell, $Q = [\\ce{Zn^2+}]/[\\ce{Cu^2+}]$. With 1.0 M zinc ions and 0.010 M copper ions, $\\log_{10} Q = 2$ and $E = 1.10 - 0.02958 \\times 2 = 1.04$ V. Even with 99.9999 % of the copper gone ($[\\ce{Cu^2+}] = 10^{-6}$ M) the cell still gives 0.92 V.

### One electrode at a time
The equation also applies to a single half-reaction written as a reduction, $\\text{Ox} + ne^- \\to \\text{Red}$:

$$E = E^\\circ - \\frac{RT}{nF}\\ln\\frac{[\\text{Red}]}{[\\text{Ox}]}$$

For a metal in a solution of its ions the metal is a pure solid, so $E = E^\\circ + (RT/nF)\\ln[\\mathrm{M}^{n+}]$: a copper electrode in 0.001 M copper sulfate sits 89 mV below one in 1 M, at +0.25 V.

### pH in the potential
Whenever $\\ce{H+}$ takes part in a half-reaction, the potential depends on pH. For permanganate,

$$E = 1.51 - \\frac{0.05916}{5}\\log_{10}\\frac{[\\ce{Mn^2+}]}{[\\ce{MnO4-}][\\ce{H+}]^8}$$

so each pH unit costs $8 \\times 0.05916/5 = 95$ mV: at pH 3 permanganate is down to 1.23 V. Titrations with permanganate are run in strong acid for exactly that reason. The hydrogen electrode itself gives $E = -0.05916\\ \\text{V} \\times \\text{pH}$ (at 1 bar of hydrogen): a straight line of −59 mV per pH unit, which is the principle of the [[ph-scale|pH]] meter. A glass pH electrode reproduces that slope across a thin glass membrane, so a pH meter is really a millivoltmeter with an enormous input resistance ([[electronics:sensor-interfacing]]).

> [!note] Strictly, $Q$ uses **activities**, not concentrations. In dilute solutions they are nearly the same; in concentrated electrolytes such as battery acid or seawater they differ, and careful work uses activity coefficients.
`,
  ideas: [
    'E = E° − (RT/nF) ln Q: the voltage falls as products build up and rises as reactants are added.',
    'At 25 °C the slope is 59.16 mV per factor of ten in Q, divided by n.',
    'At equilibrium Q = K and E = 0: a flat battery is a cell at equilibrium.',
    'For one electrode, E = E° − (RT/nF) ln([Red]/[Ox]); a metal in its ions gives E = E° + (RT/nF) ln[Mⁿ⁺].',
    'Half-reactions involving H⁺ have pH-dependent potentials; the hydrogen electrode changes by −59 mV per pH unit.'
  ],
  pitfalls: [
    'Using concentrations in mol/m³ or mmol/L inside the logarithm — Q must be built from concentrations divided by 1 mol/L (pressures by 1 bar). A 1 mM solution enters as 0.001.',
    'Putting the metal electrodes into Q — Pure solids (and the solvent water) have activity 1 and are left out.',
    'The standard potential changes with concentration — E° is fixed for the reaction; it is E, the actual potential, that shifts with Q.'
  ],
  formulas: [
    {
      name: 'The Nernst equation',
      expr: 'E = E0 - R*T/(n*F)*ln(Q)', tex: 'E_{\\text{cell}} = E^\\circ - \\frac{RT}{nF}\\ln Q',
      vars: {
        E: { name: 'cell potential', q: 'voltage', unit: 'V', signed: true, tex: 'E_{\\text{cell}}' },
        E0: { name: 'standard cell potential', q: 'voltage', unit: 'V', value: 1.1, signed: true, tex: 'E^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        n: { name: 'moles of electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' },
        Q: { name: 'reaction quotient (concentrations in mol/L, gases in bar)', value: 100 }
      },
      note: 'Defaults: a Daniell cell with $Q = [\\ce{Zn^2+}]/[\\ce{Cu^2+}] = 1.0/0.010 = 100$.',
      practice: { unknowns: ['E', 'Q'] },
      stories: {
        E: 'A cell with $E^\\circ$ = {E0} transfers {n} electrons. At {T} its reaction quotient is {Q}. What voltage does it give?',
        Q: 'A cell with $E^\\circ$ = {E0} and {n} electrons reads {E} at {T}. What is its reaction quotient?'
      }
    },
    {
      name: 'A metal electrode in a solution of its ions',
      expr: 'E = E0 + R*T/(n*F)*ln(c)', tex: 'E_{\\mathrm{M}} = E^\\circ + \\frac{RT}{nF}\\ln c_{\\mathrm{M}}',
      vars: {
        E: { name: 'electrode potential (vs SHE)', q: 'voltage', unit: 'V', signed: true, tex: 'E_{\\mathrm{M}}' },
        E0: { name: 'standard electrode potential', q: 'voltage', unit: 'V', value: 0.34, signed: true, tex: 'E^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        n: { name: 'charge of the metal ion', value: 2, int: true },
        F: { const: 'F' },
        c: { name: 'metal-ion concentration [Mⁿ⁺] (mol/L)', value: 0.001, tex: 'c_{\\mathrm{M}}' }
      },
      note: 'Defaults: copper in 0.001 M copper sulfate. The concentration $c_{\\mathrm{M}} = [\\mathrm{M}^{n+}]$ enters as a pure number in mol/L.',
      practice: { unknowns: ['E', 'c'] },
      stories: {
        E: 'A copper electrode ($E^\\circ$ = {E0}) dips into a solution with {c} mol/L of copper(II) ions at {T}. What is its potential?',
        c: 'A copper electrode ($E^\\circ$ = {E0}) reads {E} against the hydrogen electrode at {T}. What is the copper(II) concentration in mol/L?'
      }
    },
    {
      name: 'The hydrogen electrode and pH',
      expr: 'E = -R*T*ln(10)/F*pH', tex: 'E = -\\frac{RT\\ln 10}{F}\\,\\mathrm{pH}',
      vars: {
        E: { name: 'potential of a hydrogen electrode (1 bar H₂) vs SHE', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        F: { const: 'F' },
        pH: { name: 'pH of the solution', value: 7, min: -1, max: 15, tex: '\\mathrm{pH}' }
      },
      note: '−59.16 mV per pH unit at 25 °C, and proportional to the absolute temperature: a pH meter needs the temperature to convert millivolts into pH.',
      practice: { unknowns: ['E', 'pH'] },
      stories: {
        E: 'A hydrogen electrode at {T} dips into a solution of pH {pH}. What is its potential against the standard hydrogen electrode?',
        pH: 'A hydrogen electrode at {T} reads {E} against the SHE. What is the pH?'
      }
    }
  ],
  examples: [
    {
      title: 'A Daniell cell running down',
      q: 'A Daniell cell starts with 1.0 M of both ions. (a) What is its EMF when $[\\ce{Zn^2+}] = 1.0$ M and $[\\ce{Cu^2+}] = 0.010$ M? (b) When the copper is down to $1.0 \\times 10^{-6}$ M and zinc has risen to 1.1 M?',
      steps: [
        { text: '(a)', tex: 'E = 1.10 - \\frac{0.05916}{2}\\log_{10}\\frac{1.0}{0.010} = 1.10 - 0.0296 \\times 2 = 1.04\\ \\mathrm{V}' },
        { text: '(b)', tex: 'E = 1.10 - 0.0296 \\times \\log_{10}\\frac{1.1}{1.0\\times10^{-6}} = 1.10 - 0.0296 \\times 6.04 = 0.92\\ \\mathrm{V}' },
        'A millionfold fall in copper-ion concentration costs less than 0.2 V: cell voltages are remarkably flat until a reactant is almost gone.'
      ],
      a: '(a) 1.04 V; (b) 0.92 V.'
    },
    {
      title: 'Permanganate loses strength as acid is used up',
      q: 'Find the potential of the $\\ce{MnO4-/Mn^2+}$ couple ($E^\\circ$ = 1.51 V) at pH 3.0 with $[\\ce{MnO4-}] = [\\ce{Mn^2+}]$.',
      steps: [
        'Half-reaction: $\\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O}$, so $Q = [\\ce{Mn^2+}]/([\\ce{MnO4-}][\\ce{H+}]^8)$.',
        'With equal permanganate and manganese(II), $\\log_{10} Q = -8\\log_{10}[\\ce{H+}] = 8 \\times 3.0 = 24$.',
        { tex: 'E = 1.51 - \\frac{0.05916}{5} \\times 24 = 1.51 - 0.28 = 1.23\\ \\mathrm{V}' }
      ],
      a: 'About 1.23 V, 0.28 V lower than in 1 M acid.'
    }
  ],
  quiz: [
    { q: 'In a Daniell cell, more copper sulfate is dissolved in the copper half-cell. The voltage…', choices: ['rises slightly', 'falls', 'stays exactly the same', 'drops to zero'], a: 0,
      why: 'More $\\ce{Cu^2+}$, a reactant, makes $Q = [\\ce{Zn^2+}]/[\\ce{Cu^2+}]$ smaller and $E$ larger — by about 30 mV for each tenfold increase.' },
    { q: 'A cell with $E^\\circ = 1.10$ V and $n = 2$ has $Q = 1000$ at 25 °C. What is $E$, in volts?', answer: 1.011, unit: 'V',
      why: '$E = 1.10 - (0.05916/2) \\times \\log_{10} 1000 = 1.10 - 0.0296 \\times 3 = 1.011$ V.' },
    { q: 'A battery whose cell reaction has reached equilibrium reads 0 V.', a: true,
      why: 'At equilibrium $Q = K$, and $E^\\circ - (RT/nF)\\ln K = 0$. No free energy is left to drive electrons, so the battery is flat.' },
    { q: 'By how much does the potential of a hydrogen electrode change when the pH rises from 4 to 7 at 25 °C?', choices: ['it falls by about 177 mV', 'it rises by about 177 mV', 'it falls by about 59 mV', 'it does not change'], a: 0,
      why: '$E = -59.16\\ \\text{mV} \\times \\text{pH}$, so three pH units make it 177 mV more negative: less acid, weaker oxidising power of $\\ce{H+}$.' },
    { q: 'Why are the zinc and copper metals left out of $Q$ for the Daniell cell?', choices: ['pure solids have an activity of 1', 'the metals do not take part in the reaction', 'their concentrations are too large to measure', 'they appear on both sides and cancel'], a: 0,
      why: 'The chemical potential of a pure solid does not change as the reaction proceeds, so it enters the quotient as 1. Only the dissolved ions change.' }
  ],
  applications: [
    'pH meters and ion-selective electrodes (fluoride, sodium, calcium, nitrate) that read concentration as a logarithmic voltage.',
    'Redox-potential (ORP) sensors for disinfection in swimming pools and water treatment.',
    'Understanding why cell voltage stays nearly flat during discharge and why "open-circuit voltage" is a poor fuel gauge for most batteries.',
    'Membrane potentials of nerve and muscle cells, which follow ion concentration ratios.'
  ],
  history: 'Walther Nernst derived the equation in 1889, at twenty-five, from the thermodynamics of dilute solutions and osmotic pressure. He later won the 1920 Nobel Prize in Chemistry for the heat theorem that became the third law of thermodynamics.',
  sim: 'ec-nernst'
},

{
  id: 'concentration-cells', parent: 'cells', title: 'Concentration cells', level: 3,
  short: 'Two half-cells of the same couple at different concentrations make a cell with E° = 0. Its voltage comes entirely from the concentration ratio, and the current flows so as to even the concentrations out.',
  keywords: ['concentration cell', 'E° = 0', 'Nernst potential', 'membrane potential', 'resting potential', 'lambda sensor', 'oxygen sensor', 'zirconia', 'differential aeration', 'ion-selective electrode', 'glass electrode'],
  prereq: ['nernst-equation', 'galvanic-cells', 'math:logarithms'],
  related: ['corrosion', 'ph-scale', 'electrode-potentials', 'limiting-reagent', 'entropy', 'electronics:sensors'],
  body: `
Build a cell from two copper half-cells: one copper rod in 1.0 M copper sulfate, another in 0.001 M, joined by a salt bridge. Both electrodes have the same standard potential, so $E^\\circ = 0$ — yet a voltmeter reads about 89 mV. Nothing is being made or destroyed; the driving force is the tendency of the two concentrations to become equal, the same tendency that drives diffusion.

### Which way it runs
In the concentrated half-cell copper ions are reduced and plate out, lowering the concentration; in the dilute half-cell copper dissolves, raising it. So the **dilute** side is the anode (negative) and the **concentrated** side the cathode (positive). The net "reaction" only moves ions from the strong solution to the weak one:

$$\\ce{Cu^2+}(\\text{conc}) \\to \\ce{Cu^2+}(\\text{dil})$$

The [[nernst-equation|Nernst equation]] with $E^\\circ = 0$ and $Q = c_\\text{dil}/c_\\text{conc}$ gives

$$E = \\frac{RT}{nF}\\ln\\frac{c_\\text{conc}}{c_\\text{dil}}$$

— 29.6 mV per factor of ten for copper ($n = 2$), 59.2 mV for silver ($n = 1$), at 25 °C. The cell runs until the concentrations are equal and $E = 0$. The energy it delivers comes from the [[entropy]] of mixing, not from any bond being made or broken.

### Membranes: the voltage of life
A membrane that lets only one kind of ion through acts as a concentration cell without any electrodes. Inside a nerve cell potassium is about 140 mM and outside about 5 mM. Potassium leaks out through its channels, leaving the inside negative, until the inside is negative enough to hold the rest back. That balance point is the **Nernst potential** of the ion, with $z$ its charge:

$$E_\\text{ion} = \\frac{RT}{zF}\\ln\\frac{c_\\text{out}}{c_\\text{in}}$$

At body temperature, 37 °C, $RT/F$ is 26.7 mV, so $E_\\text{K} = 26.7\\ \\text{mV} \\times \\ln(5/140) = -89$ mV. Sodium, concentrated outside (about 145 mM against 12 mM inside), has a Nernst potential of about +67 mV. A resting neuron sits near −70 mV, close to potassium's value because its resting membrane is mostly permeable to potassium; a nerve impulse is a brief switch to sodium permeability that swings the voltage towards sodium's.

### Sensors that are concentration cells
- The **lambda sensor** in a car exhaust is a thimble of zirconia ($\\ce{ZrO2}$), a ceramic that conducts oxide ions when hot, with platinum electrodes on both faces. Air is on one side and exhaust on the other, and the voltage is $E = (RT/4F)\\ln(p_\\text{air}/p_\\text{exhaust})$ — four electrons per $\\ce{O2}$. A rich mixture leaves almost no oxygen in the exhaust (of the order of $10^{-20}$ bar at 700 °C) and gives about 0.9 V; a lean one with 1 % oxygen left gives only about 0.06 V. The sharp jump between the two tells the engine computer when the air–fuel ratio passes the stoichiometric point ([[limiting-reagent]]).
- The **glass pH electrode** is a concentration cell for $\\ce{H+}$ across a thin glass membrane: 59 mV per pH unit at 25 °C ([[ph-scale]]).
- **Ion-selective electrodes** for fluoride, sodium, calcium or nitrate do the same with other membranes.

### Concentration cells you do not want
A steel plate half-buried in wet sand has oxygen-rich water near the surface and oxygen-poor water lower down. The two regions form an oxygen concentration cell in which the **oxygen-poor** region becomes the anode and corrodes. This **differential aeration** is why rust pits form under water drops, washers, mud and marine growth, and why crevices corrode faster than open surfaces ([[corrosion]]).
`,
  ideas: [
    'A concentration cell has the same couple on both sides, so E° = 0; its voltage comes from the concentration ratio alone.',
    'E = (RT/nF) ln(c_conc/c_dil): 59.2 mV per decade divided by n at 25 °C.',
    'The dilute side is the anode; the current flows until the concentrations are equal.',
    'Ion-selective membranes give Nernst potentials, the basis of nerve signals, pH electrodes and ion sensors.',
    'Oxygen concentration cells drive lambda sensors — and differential-aeration corrosion.'
  ],
  pitfalls: [
    'With E° = 0 there can be no voltage — E° refers to standard (equal, 1 M) conditions. With unequal concentrations Q ≠ 1 and E ≠ 0.',
    'The concentrated side is the anode because it has more ions to give — The concentrated side is where ions are removed by reduction: it is the cathode. The dilute side dissolves.',
    'The oxygen-rich area of a steel surface corrodes — Oxygen is reduced there (cathode); the metal is lost where oxygen is scarce.'
  ],
  formulas: [
    {
      name: 'Voltage of a concentration cell',
      expr: 'E = R*T/(n*F)*ln(c2/c1)', tex: 'E = \\frac{RT}{nF}\\ln\\frac{c_2}{c_1}',
      vars: {
        E: { name: 'cell voltage', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        n: { name: 'electrons per ion discharged', value: 2, int: true },
        F: { const: 'F' },
        c2: { name: 'concentration in the concentrated half-cell', q: 'concentration', unit: 'M', value: 1, tex: 'c_2' },
        c1: { name: 'concentration in the dilute half-cell', q: 'concentration', unit: 'M', value: 0.001, tex: 'c_1' }
      },
      note: 'Only the ratio matters, so the two concentrations may be in any (the same) unit. Defaults: copper, 1 M against 1 mM.',
      practice: { unknowns: ['E', 'c1'] },
      stories: {
        E: 'Two copper electrodes stand in {c2} and {c1} copper sulfate, joined by a salt bridge, at {T}. What voltage does the cell give?',
        c1: 'A copper concentration cell reads {E} at {T}; the concentrated side is {c2}. What is the concentration on the dilute side?'
      }
    },
    {
      name: 'Nernst potential across a membrane',
      expr: 'E = R*T/(z*F)*ln(co/ci)', tex: 'E = \\frac{RT}{zF}\\ln\\frac{c_\\text{out}}{c_\\text{in}}',
      vars: {
        E: { name: 'equilibrium (Nernst) potential, inside relative to outside', q: 'voltage', unit: 'mV', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 310.15 },
        z: { name: 'charge number of the ion', value: 1, int: true, signed: true },
        F: { const: 'F' },
        co: { name: 'concentration outside the cell', q: 'concentration', unit: 'mM', value: 5, tex: 'c_\\text{out}' },
        ci: { name: 'concentration inside the cell', q: 'concentration', unit: 'mM', value: 140, tex: 'c_\\text{in}' }
      },
      note: 'Defaults: potassium in a nerve cell at 37 °C, giving −89 mV. For chloride $z = -1$, for calcium $z = +2$.',
      practice: { unknowns: ['E', 'ci'] },
      stories: {
        E: 'A cell has {ci} of an ion (charge {z}) inside and {co} outside, at {T}. What is the Nernst potential of that ion?',
        ci: 'The Nernst potential of an ion with charge {z} is {E} at {T}, with {co} outside the cell. What is its concentration inside?'
      }
    },
    {
      name: 'Zirconia oxygen (lambda) sensor',
      expr: 'E = R*T/(4*F)*ln(pa/px)', tex: 'E = \\frac{RT}{4F}\\ln\\frac{p_\\text{air}}{p_\\text{exh}}',
      vars: {
        E: { name: 'sensor voltage', q: 'voltage', unit: 'V', signed: true },
        R: { const: 'R' },
        T: { name: 'sensor temperature', q: 'temperature', unit: 'K', value: 973.15 },
        F: { const: 'F' },
        pa: { name: 'oxygen partial pressure of the reference air', q: 'pressure', unit: 'bar', value: 0.21, tex: 'p_\\text{air}' },
        px: { name: 'oxygen partial pressure in the exhaust', q: 'pressure', unit: 'bar', value: 0.01, tex: 'p_\\text{exh}' }
      },
      note: 'Four electrons per $\\ce{O2}$: $\\ce{O2 + 4e- -> 2O^2-}$. Defaults: a lean exhaust at 700 °C (about 0.06 V). A rich exhaust, with around $10^{-20}$ bar of oxygen, gives about 0.9 V.',
      practice: { unknowns: ['E', 'px'] },
      stories: {
        E: 'A lambda sensor at {T} has air ({pa} of oxygen) on one side and exhaust with {px} of oxygen on the other. What voltage does it give?',
        px: 'A lambda sensor at {T} reads {E} with reference air at {pa} of oxygen. What is the oxygen partial pressure in the exhaust?'
      }
    }
  ],
  examples: [
    {
      title: 'A silver concentration cell',
      q: 'Silver electrodes dip into 1.0 M and 0.010 M silver nitrate, joined by a salt bridge. Find the voltage at 25 °C and say which electrode dissolves.',
      steps: [
        { text: 'With $n = 1$:', tex: 'E = 0.05916 \\times \\log_{10}\\frac{1.0}{0.010} = 0.05916 \\times 2 = 0.118\\ \\mathrm{V}' },
        'Silver dissolves at the electrode in 0.010 M (the anode, negative) and plates out of the 1.0 M solution (the cathode).',
        'As it runs, the dilute side grows more concentrated and the concentrated side more dilute until, with equal volumes, both are 0.505 M and the voltage is zero.'
      ],
      a: '0.118 V; the electrode in the dilute solution dissolves.'
    },
    {
      title: 'The lambda sensor, rich and lean',
      q: 'A zirconia sensor at 700 °C has air (0.21 bar of oxygen) inside. What voltage does it give with exhaust at (a) 0.01 bar of oxygen (lean) and (b) $1 \\times 10^{-20}$ bar (rich)?',
      steps: [
        'At 973 K, $RT/4F = 8.314 \\times 973.15/(4 \\times 96\\,485) = 0.02096$ V.',
        '(a) $E = 0.02096 \\times \\ln(0.21/0.01) = 0.02096 \\times 3.04 = 0.064$ V.',
        '(b) $E = 0.02096 \\times \\ln(0.21/10^{-20}) = 0.02096 \\times 44.5 = 0.93$ V.',
        'Around the stoichiometric ratio the exhaust oxygen swings through many powers of ten, so the voltage jumps between these levels — an ideal switch for feedback.'
      ],
      a: '(a) about 0.06 V (lean); (b) about 0.93 V (rich).'
    }
  ],
  quiz: [
    { q: 'In the cell $\\ce{Cu | Cu^2+}$ (0.01 M) $\\|$ $\\ce{Cu^2+}$ (1 M) $\\ce{| Cu}$, which electrode loses mass?', choices: ['the one in 0.01 M (the anode)', 'the one in 1 M', 'neither: E° is zero', 'both equally'], a: 0,
      why: 'Copper dissolves where the solution is dilute, raising its concentration, and plates out where it is concentrated. The process continues until the concentrations are equal.' },
    { q: 'What voltage does a silver concentration cell with 0.10 M and 0.0010 M silver nitrate give at 25 °C, in volts?', answer: 0.118, unit: 'V',
      why: '$E = 0.05916 \\times \\log_{10}(0.10/0.0010) = 0.05916 \\times 2 = 0.118$ V. Only the ratio (100) matters.' },
    { q: 'A concentration cell can give a voltage even though its standard cell potential is zero.', a: true,
      why: '$E = E^\\circ - (RT/nF)\\ln Q$. With $E^\\circ = 0$ the voltage comes entirely from $Q$, which is not 1 when the concentrations differ.' },
    { q: 'Why does a zirconia lambda sensor jump from about 0.1 V to 0.9 V as the mixture passes the stoichiometric ratio?', choices: ['the oxygen partial pressure in the exhaust falls by many powers of ten once there is no excess air', 'the sensor switches to a different chemical reaction', 'the exhaust temperature doubles', 'nitrogen begins to conduct'], a: 0,
      why: 'The voltage depends on the logarithm of the pressure ratio. With excess air a few per cent of oxygen remains; without it the equilibrium oxygen pressure drops to around $10^{-20}$ bar, a change of some 18 powers of ten.' },
    { q: 'The resting voltage of a nerve cell (about −70 mV) is closest to the Nernst potential of which ion?', choices: ['potassium, about −89 mV', 'sodium, about +67 mV', 'hydrogen ions', 'glucose'], a: 0,
      why: 'At rest the membrane is mostly permeable to potassium, so the voltage sits near $E_\\text{K}$; a small sodium leak pulls it a little towards $E_\\text{Na}$. Glucose is not an ion.' }
  ],
  applications: [
    'Oxygen (lambda) sensors in every petrol-engine exhaust, and oxygen analysers in furnaces and boilers.',
    'Glass pH electrodes and ion-selective electrodes in laboratories, water treatment and medicine.',
    'Nerve impulses, heartbeats and muscle contraction, all driven by ion concentration differences across membranes.',
    'Explaining crevice corrosion and pitting under deposits by differential aeration.'
  ],
  sim: { id: 'ec-nernst', params: { mode: 'conc' } }
},

{
  id: 'batteries-fuel-cells', parent: 'cells', title: 'Batteries and fuel cells', level: 2,
  short: 'Practical galvanic cells: primary batteries used once, rechargeable batteries whose reaction is driven backwards on charging, and fuel cells fed continuously with fuel and air. Voltage comes from the chemistry, capacity from the amount of reactant.',
  keywords: ['battery', 'primary cell', 'secondary cell', 'rechargeable', 'lead–acid', 'alkaline', 'lithium-ion', 'LFP', 'NiMH', 'nickel–cadmium', 'zinc–air', 'fuel cell', 'PEM', 'capacity', 'ampere-hour', 'specific energy', 'Wh/kg', 'intercalation', 'C-rate', 'state of charge', 'series', 'parallel'],
  prereq: ['galvanic-cells', 'cell-potential-gibbs', 'electronics:batteries'],
  related: ['nernst-equation', 'electrolysis', 'faradays-laws', 'electronics:supercapacitors', 'electronics:power-energy', 'physics:emf-internal-resistance'],
  body: `
A battery is a [[galvanic-cells|galvanic cell]] engineered to be sealed, portable and robust. Three numbers describe it, and each has a chemical origin:

- **Voltage** comes from the pair of half-reactions: the gap between their [[electrode-potentials|electrode potentials]], adjusted for concentrations by the [[nernst-equation|Nernst equation]].
- **Capacity**, in ampere-hours, comes from how many moles of reactant there are and how many electrons each gives up. One mole of electrons is 96 485 C, or 26.8 A·h ([[faradays-laws]]).
- **Energy** is the product of the two, $W = VQ$: one ampere-hour at 3.6 V is 3.6 Wh.

Strictly, a battery is several cells connected together. Cells in **series** add their voltages; cells in **parallel** add their capacities. A laptop pack of six 3.6 V, 3.0 A·h cells, three in series and two in parallel, gives 10.8 V and 6.0 A·h: 65 Wh.

### Primary cells
The everyday **alkaline cell** has a zinc-powder anode in potassium hydroxide and a manganese dioxide cathode; a simplified overall reaction is

$$\\ce{Zn + 2MnO2 -> ZnO + Mn2O3} \\qquad \\text{about } 1.5\\ \\text{V}$$

**Lithium primary cells** (lithium metal against manganese dioxide or iron disulfide) give 3 V or 1.5 V with far more energy per kilogram and a shelf life of ten years or more. The **zinc–air** button cell of a hearing aid takes its cathode reactant, oxygen, from the air through tiny holes, so almost the whole can is filled with zinc.

### Rechargeable cells
In a secondary cell the reaction can be driven backwards by pushing current in: charging is [[electrolysis]]. The **lead–acid** car battery, discharging from left to right:

$$\\ce{Pb + PbO2 + 2H2SO4 <=> 2PbSO4 + 2H2O} \\qquad \\text{about } 2.05\\ \\text{V per cell}$$

Six cells in series make the 12 V battery. Both electrodes turn into lead sulfate as it discharges and the sulfuric acid is consumed, so the density of the electrolyte shows the state of charge. **Nickel–metal hydride** cells (1.2 V) replaced nickel–cadmium in AA rechargeables and powered the first generations of hybrid cars.

**Lithium-ion** cells work differently: no electrode dissolves. Lithium ions shuttle between two host materials that let them slip in between their atomic layers — **intercalation** — graphite at the negative electrode and a lithium metal oxide or phosphate at the positive:

$$\\ce{LiC6 + FePO4 <=> C6 + LiFePO4} \\qquad \\text{about } 3.2\\ \\text{V}$$

for the lithium iron phosphate (LFP) chemistry; nickel–manganese–cobalt oxides give 3.6–3.7 V. Graphite holds one lithium for every six carbons, 372 mA·h per gram; iron phosphate 170 mA·h/g. The high voltage comes from lithium's place at the very bottom of the table of potentials (−3.04 V), and it is only possible because the electrolyte is an organic solvent: water would be split at such voltages.

### Theory against practice
The **theoretical specific energy** counts only the reacting chemicals: $nFE$ divided by their total molar mass. For lead–acid that is $2 \\times 96\\,485 \\times 2.05$ J per 642.5 g, or 171 Wh/kg. A real lead–acid battery stores 30–40 Wh/kg: the lead grids, the water in the acid, the separators, the case and the active material that cannot be reached at a useful rate all add weight. Lithium-ion cells reach roughly 150–270 Wh/kg, which is why they took over portable electronics and electric vehicles.

Real cells also lose voltage under load, through internal resistance ($V = E - Ir$, [[physics:emf-internal-resistance]]) and the finite speed of the electrode reactions, and their rated capacity assumes a stated discharge current. Charge and discharge rates are quoted as a **C-rate**: 1 C empties the rated capacity in one hour, 0.2 C in five hours. The circuit side — capacity, C-rate and internal resistance in practice — is in [[electronics:batteries]].

### Fuel cells
A fuel cell is a battery whose reactants flow in continuously and whose product flows out. In the proton-exchange-membrane (PEM) fuel cell:

$$\\text{anode: } \\ce{H2 -> 2H+ + 2e-} \\qquad \\text{cathode: } \\ce{O2 + 4H+ + 4e- -> 2H2O}$$

A thin polymer membrane carries protons but not electrons, and platinum on both sides catalyses the slow electrode reactions. The standard EMF is 1.23 V; under load a cell gives about 0.6–0.8 V, so stacks of hundreds of cells feed a vehicle's motor. Hydrogen stores about 33 kWh of free energy per kilogram, but it needs heavy tanks at 700 bar. The efficiency limit is not Carnot's but $\\Delta G/\\Delta H = 83$ % at 25 °C ([[cell-potential-gibbs]]).

> [!warn] A battery's open-circuit voltage is a poor fuel gauge for many chemistries: because of the logarithm in the Nernst equation, and in LFP cells because two solid phases coexist, the voltage stays nearly flat over most of the discharge. Battery management systems count coulombs instead.
`,
  ideas: [
    'Voltage comes from the electrode chemistry, capacity from the moles of reactant (26.8 A·h per mole of electrons), energy from their product.',
    'Series connection adds voltages; parallel connection adds capacities.',
    'Primary cells are used once; in a secondary (rechargeable) cell the reaction is reversed by electrolysis during charging.',
    'Theoretical specific energy is nFE per total molar mass of reactants; practical cells reach only a fraction of it.',
    'A fuel cell is fed its reactants continuously; its efficiency limit is ΔG/ΔH, not the Carnot limit.'
  ],
  pitfalls: [
    'A bigger battery has a higher voltage — A D cell and an AAA cell are both 1.5 V. Size sets the capacity (A·h) and the current it can deliver.',
    'Ampere-hours measure energy — A·h is charge. Energy needs the voltage too: 2 A·h at 3.7 V is 7.4 Wh, at 1.2 V only 2.4 Wh.',
    'A fuel cell stores energy like a battery — It converts the energy of a fuel supplied from outside; its capacity is set by the tank, its power by the size of the stack.'
  ],
  formulas: [
    {
      name: 'Capacity of an electrode material',
      expr: 'Q = m*z*F/M', tex: 'Q = \\frac{m z F}{M}',
      vars: {
        Q: { name: 'charge the material can store', q: 'charge', unit: 'mA·h' },
        m: { name: 'mass of active material', q: 'mass', unit: 'g', value: 1 },
        z: { name: 'electrons per formula unit', value: 1, int: true, fixed: true },
        F: { const: 'F' },
        M: { name: 'molar mass per formula unit', q: 'molarmass', unit: 'g/mol', value: 72.066 }
      },
      note: 'Defaults: graphite, one lithium (one electron) per $\\ce{C6}$ unit of 72.07 g/mol — 372 mA·h per gram. For $\\ce{LiFePO4}$ use 157.76 g/mol (170 mA·h/g).',
      practice: { unknowns: ['Q', 'm'] },
      stories: {
        Q: 'Graphite stores one lithium per $\\ce{C6}$ unit ({M}). How much charge can {m} of it hold?',
        m: 'What mass of graphite ({M} per $\\ce{C6}$) is needed to hold {Q}?'
      }
    },
    {
      name: 'Energy stored in a cell',
      expr: 'W = V*Q', tex: 'W = VQ',
      vars: {
        W: { name: 'energy', q: 'energy', unit: 'Wh' },
        V: { name: 'average (nominal) voltage', q: 'voltage', unit: 'V', value: 3.6 },
        Q: { name: 'capacity', q: 'charge', unit: 'A·h', value: 3 }
      },
      note: 'Defaults: a typical 18650 lithium-ion cell. For a battery, use the pack voltage (cells in series) and the pack capacity (cells in parallel).',
      stories: {
        W: 'A cell has a nominal voltage of {V} and a capacity of {Q}. How much energy does it store?',
        Q: 'A {V} battery must store {W}. What capacity does it need?'
      }
    },
    {
      name: 'Theoretical specific energy of a cell reaction',
      expr: 'w = n*F*E/Ms', tex: 'w = \\frac{nFE}{M_{\\text{tot}}}',
      vars: {
        w: { name: 'theoretical specific energy', q: 'specificenergy', unit: 'kWh/kg' },
        n: { name: 'electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' },
        E: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 2.05 },
        Ms: { name: 'total molar mass of the reactants', q: 'molarmass', unit: 'g/mol', value: 642.5, tex: 'M_{\\text{tot}}' }
      },
      note: 'Defaults: lead–acid, $\\ce{Pb + PbO2 + 2H2SO4}$ = 642.5 g/mol, giving 0.171 kWh/kg. Real batteries reach a quarter or less of this.',
      practice: { unknowns: ['w', 'E'] },
      stories: {
        w: 'A cell reaction transfers {n} electrons at {E}, and its reactants weigh {Ms} per mole of reaction. What is its theoretical specific energy?'
      }
    }
  ],
  examples: [
    {
      title: 'How much lead does a car battery need?',
      q: 'A 12 V lead–acid battery (six cells in series) is rated 60 A·h. What is the least mass of reactants — lead, lead dioxide and sulfuric acid — it must contain?',
      steps: [
        'Each cell in series carries the full 60 A·h: $60 \\times 3600 = 216\\,000$ C, or $216\\,000/96\\,485 = 2.24$ mol of electrons.',
        'The reaction moves 2 electrons, so each cell needs 1.12 mol of $\\ce{Pb}$ (232 g), 1.12 mol of $\\ce{PbO2}$ (268 g) and 2.24 mol of $\\ce{H2SO4}$ (220 g) — 720 g per cell.',
        'Six cells: about 4.3 kg of reactants, even if every gram were used.',
        'A real 60 A·h battery weighs about 15 kg: grids, water, separators, case and unusable active material make up the difference.'
      ],
      a: 'At least 4.3 kg of reactants — less than a third of the battery\'s real mass.'
    },
    {
      title: 'A laptop battery pack',
      q: 'Six lithium-ion cells, each 3.6 V and 3.0 A·h, are connected three in series and two in parallel (3S2P). What are the pack voltage, capacity and energy?',
      steps: [
        'Series adds voltage: $3 \\times 3.6 = 10.8$ V.',
        'Parallel adds capacity: $2 \\times 3.0 = 6.0$ A·h.',
        'Energy: $10.8 \\times 6.0 = 64.8$ Wh — the same as six cells × 10.8 Wh each, however they are wired.'
      ],
      a: '10.8 V, 6.0 A·h, 64.8 Wh.'
    }
  ],
  quiz: [
    { q: 'Two identical cells are connected in parallel instead of in series. Compared with the series pair, the parallel pair has…', choices: ['half the voltage and twice the capacity', 'twice the voltage and the same capacity', 'twice the voltage and twice the capacity', 'the same voltage and the same capacity'], a: 0,
      why: 'Series: voltages add, capacity stays that of one cell. Parallel: voltage stays that of one cell, capacities add. The stored energy is the same either way.' },
    { q: 'How much energy, in watt-hours, does a 3.7 V, 5.0 A·h cell store?', answer: 18.5, unit: 'Wh',
      why: '$W = VQ = 3.7 \\times 5.0 = 18.5$ Wh (66.6 kJ).' },
    { q: 'Charging a rechargeable battery is an electrolysis.', a: true,
      why: 'An external source forces current through the cell against its EMF, driving the discharge reaction backwards. That is exactly what electrolysis is.' },
    { q: 'Why does a real lead–acid battery store only 30–40 Wh/kg when its reaction offers 171 Wh/kg?', choices: ['grids, water, separators, the case and unusable active material add mass', 'the Nernst equation cuts the voltage to a fifth', 'lead–acid cells lose most of their charge as heat on discharge', 'the theoretical figure assumes pure hydrogen'], a: 0,
      why: 'The theoretical figure counts only the reacting chemicals. Everything else a working battery needs adds weight without storing energy, and only part of the active material can be reached at practical currents.' },
    { q: 'In a PEM fuel cell, what crosses the membrane?', choices: ['protons (H⁺)', 'electrons', 'oxygen molecules', 'hydrogen molecules'], a: 0,
      why: 'The membrane conducts protons but not electrons, which is what forces the electrons round the external circuit. Oxygen and hydrogen are kept apart by it.' }
  ],
  applications: [
    'Lead–acid batteries for starting engines and for standby power in telephone exchanges and data centres.',
    'Lithium-ion packs in phones, laptops, power tools, electric cars and grid storage.',
    'Primary lithium and zinc–air cells in medical implants, utility meters and hearing aids.',
    'Fuel cells in buses, forklift trucks, backup power and spacecraft — Apollo and the Space Shuttle drank the water they made.'
  ],
  history: 'Gaston Planté built the first rechargeable battery, lead–acid, in 1859. The lithium-ion battery grew from work by Stanley Whittingham, John Goodenough and Akira Yoshino in the 1970s and 1980s, honoured with the 2019 Nobel Prize in Chemistry; the first commercial cells went on sale in 1991.',
  sim: 'ec-battery'
},

{
  id: 'corrosion', parent: 'cells', title: 'Corrosion and its prevention', level: 2,
  short: 'Metals returning to their ores through galvanic cells on their own surface. Iron needs water and oxygen to rust; salt, dissimilar metals and oxygen differences speed it up; coatings, sacrificial anodes and impressed currents stop it.',
  keywords: ['corrosion', 'rust', 'rusting', 'galvanic corrosion', 'bimetallic corrosion', 'galvanic series', 'galvanising', 'sacrificial anode', 'cathodic protection', 'impressed current', 'passivation', 'stainless steel', 'differential aeration', 'pitting', 'crevice corrosion', 'anodising', 'tin plate'],
  prereq: ['galvanic-cells', 'electrode-potentials', 'redox-reactions'],
  related: ['concentration-cells', 'electroplating', 'faradays-laws', 'electrolysis', 'metallic-bonding'],
  body: `
Iron is found in the ground as oxides, and it took a blast furnace full of coke to reduce it. Left in damp air, it slowly goes back. **Corrosion** is that return journey, and it runs on electrochemistry: a rusting piece of steel is a short-circuited [[galvanic-cells|galvanic cell]], with anodes and cathodes side by side on the same surface and the metal itself as the wire.

### How iron rusts
At anodic spots iron dissolves:

$$\\ce{Fe -> Fe^2+ + 2e-}$$

The electrons run through the metal to cathodic spots, where dissolved oxygen takes them:

$$\\ce{O2 + 2H2O + 4e- -> 4OH-}$$

Iron(II) and hydroxide ions meet in the water between, precipitate as iron(II) hydroxide, and further oxidation by air turns that into rust, a hydrated iron(III) oxide, $\\ce{Fe2O3.xH2O}$. Three consequences follow:

- **Water and oxygen are both needed.** Steel stays bright in dry air and in boiled, oxygen-free water.
- **Salt speeds it up**, because it makes the water a better ionic conductor — the salt bridge of the cell. Cars rust from road salt and ships from the sea.
- **Rust forms away from the pit.** The metal is lost at the anode, but the rust precipitates where the ions meet, so a rust stain can hide a deep pit.

### Where the anode forms
Any difference between two parts of a surface can make one of them the anode:
- **Differential aeration.** Under a water drop, a washer or a layer of mud the oxygen supply is poor. The oxygen-starved region becomes the anode and corrodes while the well-aerated rim is the cathode. This [[concentration-cells|oxygen concentration cell]] is why crevices, lap joints and the waterline of steel piles corrode.
- **Stress and defects.** Bent or cold-worked metal, grain boundaries and scratches are slightly more active than the rest.
- **Dissimilar metals: galvanic corrosion.** Two metals touching in an electrolyte form a cell, and the more active one is the anode. A steel bolt in a copper sheet corrodes quickly; an aluminium fitting on a stainless-steel boat corrodes around the joint. Engineers use a **galvanic series** — metals ranked by their potential in seawater, in the same spirit as the [[electrode-potentials|table of standard potentials]] — to keep dissimilar metals apart or insulated from each other.

**Area matters.** The anode's current is concentrated on its own area. A small anode against a large cathode (steel rivets in a copper sheet) is disastrous; a large anode against a small cathode (copper rivets in a steel sheet) is tolerable.

### Prevention
1. **Barriers** — paint, plastic coatings, grease, enamel — keep out water and oxygen. They fail where they are scratched.
2. **Galvanising: a sacrificial coating.** Zinc (−0.76 V) is more active than iron (−0.44 V). Where a zinc coating is scratched, zinc becomes the anode and dissolves while the exposed steel is the cathode and stays protected. A tin coating (−0.14 V) is the opposite: excellent while intact, but at a scratch the steel becomes the anode of a tin–iron cell and rusts faster than bare steel — the fate of a dented food can.
3. **Cathodic protection with sacrificial anodes.** Blocks of zinc, aluminium or magnesium bolted to ship hulls, buried beside pipelines or screwed into water heaters corrode instead of the steel. They are used up at a rate fixed by [[faradays-laws|Faraday's law]] — zinc supplies about 820 A·h per kilogram in theory — and are replaced at intervals.
4. **Impressed-current cathodic protection.** A DC power supply pushes electrons into the steel through inert anodes (mixed-metal oxide, silicon iron), holding the structure at a potential where iron cannot dissolve. For steel in soil or seawater a common criterion is −0.85 V against a copper/copper sulfate reference electrode. Pipelines, harbour piling and the steel in concrete bridge decks are protected this way.
5. **Passivation.** Some metals protect themselves with a thin, tight oxide film: aluminium, titanium, chromium. Stainless steel contains at least 10.5 % chromium, whose oxide film heals itself when scratched. **Anodising** thickens the film on aluminium by making the part the anode in an acid bath ([[electroplating]]).
6. **Changing the environment:** removing oxygen from boiler water, dosing cooling water with inhibitors, keeping steel dry.

### How fast
A corrosion current becomes a rate of metal loss through Faraday's law. For iron, a current density of 1 µA/cm² removes about 12 µm of metal a year. Carbon steel fully immersed in seawater typically loses of the order of 0.1 mm a year: a 10 mm plate would take many decades to rust through evenly. The real danger is **localised** attack — pits and crevices that go deep while the rest of the surface looks sound.

> [!fact] Corrosion is expensive. Estimates put its worldwide cost at about 3 % of global GDP, most of it spent replacing, painting and protecting steel.
`,
  ideas: [
    'Corrosion is an unwanted galvanic cell: metal dissolves at anodic sites and oxygen is reduced at cathodic sites on the same surface.',
    'Rusting needs both water and oxygen; dissolved salt speeds it up by carrying the ionic current.',
    'Differences in oxygen supply, stress or metal create the anodes; the oxygen-poor or more active region corrodes.',
    'A more active metal in contact (zinc, magnesium, aluminium) sacrifices itself and protects steel; a less active one (copper, tin) makes it corrode faster.',
    'The rate of metal loss follows Faraday\'s law from the corrosion current.'
  ],
  pitfalls: [
    'Iron corrodes fastest where oxygen is plentiful — Oxygen is reduced there; the metal dissolves where oxygen is scarce, such as the centre of a drop or inside a crevice.',
    'Any metal coating protects steel — Only a more active coating (zinc) protects at a scratch. A more noble coating (tin, copper, nickel) speeds up attack on exposed steel.',
    'Stainless steel cannot corrode — It relies on a passive film. In stagnant chloride solutions, crevices and under deposits the film can break down and pit.'
  ],
  formulas: [
    {
      name: 'Thickness lost to a corrosion current',
      expr: 'd = i*t*M/(z*F*rho)', tex: 'd = \\frac{i\\,t\\,M}{zF\\rho}',
      vars: {
        d: { name: 'thickness of metal lost', q: 'length', unit: 'µm' },
        i: { name: 'corrosion current density', q: 'currentdensity', unit: 'A/m²', value: 0.01 },
        t: { name: 'time', q: 'time', unit: 'yr', value: 1 },
        M: { name: 'molar mass of the metal', q: 'molarmass', unit: 'g/mol', value: 55.845, fixed: true },
        z: { name: 'electrons per atom', value: 2, int: true, fixed: true },
        F: { const: 'F' },
        rho: { name: 'density of the metal', q: 'density', unit: 'g/cm³', value: 7.87, fixed: true }
      },
      note: 'Defaults: iron at 0.01 A/m², which is 1 µA/cm² — about 12 µm a year. The loss is assumed uniform over the surface.',
      practice: { unknowns: ['d', 'i'] },
      stories: {
        d: 'Steel ($M$ = {M}, density {rho}) corrodes with a current density of {i}. How much thickness does it lose in {t}?',
        i: 'A steel surface ($M$ = {M}, density {rho}) loses {d} in {t}. What is the corrosion current density?'
      }
    },
    {
      name: 'Life of a sacrificial anode',
      expr: 't = m*z*F*u/(M*I)', tex: 't = \\frac{m z F u}{M I}',
      vars: {
        t: { name: 'service life', q: 'time', unit: 'yr' },
        m: { name: 'mass of the anode', q: 'mass', unit: 'kg', value: 10 },
        z: { name: 'electrons per atom', value: 2, int: true, fixed: true },
        F: { const: 'F' },
        u: { name: 'usable fraction (efficiency × utilisation)', value: 0.85, min: 0.1, max: 1 },
        M: { name: 'molar mass of the anode metal', q: 'molarmass', unit: 'g/mol', value: 65.38, fixed: true },
        I: { name: 'protection current', q: 'current', unit: 'A', value: 0.5 }
      },
      note: 'Defaults: a 10 kg zinc anode supplying 0.5 A, of which 85 % of the metal is usefully consumed. For magnesium use $M$ = 24.31 g/mol; for aluminium $z$ = 3 and $M$ = 26.98 g/mol.',
      practice: { unknowns: ['t', 'm'] },
      stories: {
        t: 'A {m} zinc anode ($M$ = {M}) protects a steel structure that draws {I}. If a fraction {u} of the zinc is usefully consumed, how long will it last?',
        m: 'A structure needs {I} of protection current for {t}. What mass of zinc ($M$ = {M}) is needed, with a usable fraction of {u}?'
      }
    }
  ],
  examples: [
    {
      title: 'Galvanised and tin-plated steel at a scratch',
      q: 'Explain, with potentials, why a scratch in galvanised steel stays bright while a scratch in tin plate rusts. $E^\\circ$: $\\ce{Zn^2+/Zn}$ −0.76 V, $\\ce{Fe^2+/Fe}$ −0.44 V, $\\ce{Sn^2+/Sn}$ −0.14 V.',
      steps: [
        'At a scratch, the coating and the exposed steel touch through a film of water: a galvanic cell.',
        'Zinc and iron: zinc has the lower potential, so zinc is the anode (it dissolves) and iron the cathode, where only oxygen is reduced. Cell: $-0.44 - (-0.76) = 0.32$ V driving zinc to protect the steel.',
        'Tin and iron: iron now has the lower potential and becomes the anode. The large tin surface serves as cathode, and the small exposed patch of steel corrodes faster than if there were no coating at all.'
      ],
      a: 'Zinc sacrifices itself for the steel; tin makes the steel sacrifice itself for the tin.'
    },
    {
      title: 'Sizing a zinc anode for a hull',
      q: 'A small steel hull needs 2.0 A of protection current for 3 years between dockings. What mass of zinc must be fitted if 85 % of it can be usefully consumed?',
      steps: [
        'Charge: $2.0 \\times 3 \\times 3.156 \\times 10^{7}\\ \\mathrm{s} = 1.89 \\times 10^{8}$ C.',
        'Zinc: $n = Q/2F = 1.89 \\times 10^{8}/(2 \\times 96\\,485) = 981$ mol, or $981 \\times 65.38 = 64.2$ kg.',
        'With 85 % usable: $64.2/0.85 = 75$ kg of zinc anodes.'
      ],
      a: 'About 75 kg of zinc.'
    }
  ],
  quiz: [
    { q: 'Which combination corrodes fastest in seawater?', choices: ['small steel rivets in a large copper sheet', 'large steel sheet with small copper rivets', 'a copper sheet on its own', 'a steel sheet kept in dry air'], a: 0,
      why: 'Steel is the anode against copper. With a small anode and a large cathode, the whole cathodic current is concentrated on the rivets, which dissolve rapidly.' },
    { q: 'Galvanised steel is scratched through to the iron. What happens at the scratch?', choices: ['the zinc corrodes and the exposed iron is protected', 'the iron rusts faster than bare iron', 'nothing: zinc is inert', 'zinc is plated back onto the scratch'], a: 0,
      why: 'Zinc is more active than iron, so it is the anode of the zinc–iron cell. It dissolves while the steel acts as a cathode — sacrificial protection that works even where the coating is gone.' },
    { q: 'Iron corrodes fastest where oxygen is most plentiful, such as the edge of a water drop.', a: false,
      why: 'The oxygen-rich edge is the cathode, where oxygen is reduced. Metal dissolves at the oxygen-poor centre (the anode). Rust may appear near the edge, where the ions meet, but the pit is in the middle.' },
    { q: 'A buried pipeline draws 0.20 A of protection current from a magnesium anode ($M$ = 24.31 g/mol, two electrons per atom). What mass of magnesium is consumed per year at 100 % efficiency, in kilograms?', answer: 0.795, unit: 'kg',
      why: 'Charge in a year: $0.20 \\times 3.156 \\times 10^{7} = 6.31 \\times 10^{6}$ C; moles of Mg: $6.31 \\times 10^{6}/(2 \\times 96\\,485) = 32.7$ mol; mass $32.7 \\times 24.31 = 795$ g.' },
    { q: 'Why is stainless steel "stainless"?', choices: ['its chromium forms a thin, self-healing oxide film', 'it contains no iron', 'nickel makes iron as noble as gold', 'it is always coated with zinc'], a: 0,
      why: 'With at least 10.5 % chromium, a few nanometres of chromium-rich oxide cover the surface and re-form when scratched, as long as oxygen is available.' }
  ],
  applications: [
    'Galvanised crash barriers, roofing, fasteners and car bodies.',
    'Sacrificial anodes on ship hulls, offshore platforms, pipelines and inside hot-water cylinders.',
    'Impressed-current protection of buried pipelines, storage tanks, harbour structures and reinforced-concrete bridges.',
    'Choosing materials and insulating joints so that dissimilar metals do not form galvanic cells.'
  ],
  sim: 'ec-corrosion'
}

);
