/* HYPER-CHEMISTRY · content/liquids-solids.js — vapour pressure and boiling, phase
 * diagrams, the Clausius–Clapeyron equation, crystalline solids and unit cells, and the
 * surface tension and viscosity of liquids. */
Hyper.add(

{
  id: 'vapor-pressure', parent: 'liquids-solids', title: 'Vapour pressure and boiling', level: 1,
  short: 'Molecules escape from a liquid\'s surface until the vapour above it pushes back hard enough that as many return as leave. That balance pressure is the vapour pressure; a liquid boils when it equals the pressure around it.',
  keywords: ['vapour pressure', 'vapor pressure', 'evaporation', 'condensation', 'dynamic equilibrium', 'volatile', 'boiling point', 'normal boiling point', 'altitude', 'pressure cooker', 'relative humidity', 'dew point', 'saturated vapour'],
  prereq: ['intermolecular-forces', 'kinetic-molecular-theory', 'physics:latent-heat'],
  related: ['dynamic-equilibrium', 'clausius-clapeyron', 'phase-diagrams', 'partial-pressures', 'raoults-law', 'colligative-properties', 'imf-properties'],
  body: `
In a liquid the molecules jostle at close quarters, held together by [[intermolecular-forces]]. Their energies are spread out, like the speeds in a gas, and at any moment a few molecules at the surface are moving fast enough, in the right direction, to break free. That is **evaporation**. Leave a glass of water in a dry room and it slowly disappears.

Now put a lid on it. The escaped molecules fly around in the space above, and some of them hit the liquid surface and are captured again — **condensation**. The more vapour there is, the faster it condenses. Evaporation, on the other hand, goes at a steady rate set only by the temperature. So the vapour builds up until the two rates are equal. From then on nothing seems to change, although molecules keep crossing in both directions: a **dynamic equilibrium** ([[dynamic-equilibrium]]). The pressure of the vapour at that point is the liquid's **vapour pressure**.

> [!key] The vapour pressure depends only on the liquid and its temperature. A bigger flask, or more liquid, just means more molecules have to evaporate before the balance is reached — the pressure at balance is the same.

### What sets it
Liquids with weak intermolecular forces let molecules escape easily: they are **volatile**, with high vapour pressures. At 20 °C:

| Liquid | diethyl ether | acetone | ethanol | water | mercury |
|---|---|---|---|---|---|
| Vapour pressure | 58.7 kPa | 24.6 kPa | 5.8 kPa | 2.34 kPa | 0.16 Pa |
| Normal boiling point | 34.6 °C | 56.1 °C | 78.3 °C | 100.0 °C | 356.7 °C |

Temperature matters enormously: the fraction of molecules with enough energy to escape grows exponentially, so water's vapour pressure roughly doubles for every 11 °C of warming near room temperature ([[clausius-clapeyron]]).

### Boiling
When the vapour pressure reaches the pressure of the surroundings, bubbles of vapour can form **inside** the liquid and survive — that is boiling. The bubbles contain the liquid's own vapour, not air. The temperature at which this happens depends on the outside pressure:

- the **normal boiling point** is at 1 atm (100.0 °C for water; 99.6 °C at 1 bar);
- in Denver, at 1600 m and about 0.83 atm, water boils at 94.7 °C, so pasta takes longer; on the summit of Everest, at 0.33 atm, it boils at about 72 °C and tea is never hot;
- in a pressure cooker at about 2 atm it boils at about 120 °C, and food cooks two to three times faster;
- **vacuum distillation** boils delicate substances at low temperature, so that they do not decompose.

### Humidity
Air above water is **saturated** when the partial pressure of water vapour equals water's vapour pressure. The **relative humidity** is how close it is: $p_{\\ce{H2O}}/p^*$. Cool humid air and $p^*$ falls until it meets the actual partial pressure — the **dew point** — and dew, mist or the drops on a cold glass appear. Evaporation also carries away latent heat, which is why sweating cools you and why a wet-bulb thermometer reads low in dry air.
`,
  ideas: [
    'Evaporation goes at a rate set by temperature; condensation speeds up as vapour accumulates. The vapour pressure is where the two balance.',
    'Vapour pressure depends only on the substance and the temperature — not on the amount of liquid or the size of the container.',
    'Weaker intermolecular forces mean a higher vapour pressure and a lower boiling point.',
    'A liquid boils when its vapour pressure equals the outside pressure, so the boiling point falls with altitude and rises in a pressure cooker.',
    'Relative humidity compares the partial pressure of water vapour with water\'s vapour pressure at that temperature.'
  ],
  pitfalls: [
    'A bigger container gives a higher (or lower) vapour pressure — As long as some liquid remains, the pressure at equilibrium is the same; only the amount evaporated changes.',
    'Water always boils at 100 °C — Only at 1 atm. On a mountain it boils cooler, in a pressure cooker hotter.',
    'The bubbles in boiling water are air (or hydrogen and oxygen) — They are water vapour. Dissolved air comes out as small bubbles well before boiling, but boiling bubbles are the liquid itself turned to gas.'
  ],
  formulas: [
    {
      name: 'Relative humidity',
      expr: 'RH = pw/psat', tex: '\\mathrm{RH} = \\frac{p_{\\ce{H2O}}}{p^*}',
      vars: {
        RH: { name: 'relative humidity', q: 'ratio', unit: '%', tex: '\\mathrm{RH}' },
        pw: { name: 'partial pressure of water vapour', q: 'pressure', unit: 'kPa', value: 1.40, tex: 'p_{\\ce{H2O}}' },
        psat: { name: 'vapour pressure of water at the air temperature', q: 'pressure', unit: 'kPa', value: 2.339, tex: 'p^*' }
      },
      note: 'Water\'s vapour pressure is 1.23 kPa at 10 °C, 2.34 kPa at 20 °C, 3.17 kPa at 25 °C and 4.25 kPa at 30 °C. The defaults are air at 20 °C whose dew point is 12 °C.',
      stories: {
        RH: 'Air at 20 °C (vapour pressure of water {psat}) contains water vapour at a partial pressure of {pw}. What is the relative humidity?',
        pw: 'On a day at 25 °C the relative humidity is {RH}; water\'s vapour pressure is {psat}. What is the partial pressure of water vapour?'
      }
    },
    {
      name: 'Mass of vapour in a saturated space',
      expr: 'm = p*V*M/(R*T)', tex: 'm = \\frac{p^* V M}{RT}',
      vars: {
        m: { name: 'mass of vapour', q: 'mass', unit: 'g' },
        p: { name: 'vapour pressure', q: 'pressure', unit: 'kPa', value: 3.17, tex: 'p^*' },
        V: { name: 'volume of the space', q: 'volume', unit: 'L', value: 10.0 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'The ideal gas law applied to the vapour. If less liquid is present than this, it all evaporates and the space is not saturated. Defaults: water at 25 °C.',
      stories: {
        m: 'A sealed {V} flask at {T} contains some liquid water, whose vapour pressure is {p} at that temperature. What mass of water is present as vapour?',
        V: 'At {T} the vapour pressure of water is {p}. What volume of air can {m} of water saturate?'
      }
    },
    {
      name: 'Air pressure at altitude (isothermal atmosphere)',
      expr: 'P = P0*exp(-M*g*h/(R*T))', tex: 'P = p_0\\,e^{-Mgh/RT}',
      vars: {
        P: { name: 'pressure at altitude', q: 'pressure', unit: 'atm' },
        P0: { const: 'atm' },
        M: { name: 'molar mass of air', q: 'molarmass', unit: 'g/mol', value: 28.96 },
        g: { const: 'g' },
        h: { name: 'altitude', q: 'length', unit: 'm', value: 1609 },
        R: { const: 'R' },
        T: { name: 'average air temperature', q: 'temperature', unit: '°C', value: 15 }
      },
      solveFor: 'P',
      note: 'Treats the atmosphere as one temperature, which is good to a few per cent up to several kilometres. Combine with the vapour-pressure curve to find the boiling point at that height.',
      stories: {
        P: 'Estimate the air pressure in Denver, {h} above sea level, taking the air to be at {T}.',
        h: 'At what altitude has the air pressure fallen to {P}, taking the air to be at {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'Water in a sealed flask',
      q: 'A 10.0 L flask is sealed at 25 °C with 1.00 g of liquid water inside (and no air). The vapour pressure of water at 25 °C is 3.17 kPa. How much water evaporates, and what is the final pressure? What if the flask were 100 L?',
      steps: [
        { text: 'Mass needed to saturate 10.0 L:', tex: 'm = \\frac{p^* V M}{RT} = \\frac{3170 \\times 0.0100 \\times 18.02}{8.314 \\times 298.15} = 0.230\\ \\mathrm{g}' },
        'That is less than the 1.00 g available, so 0.230 g evaporates, 0.77 g stays liquid, and the pressure settles at 3.17 kPa.',
        'In 100 L it would take 2.30 g to saturate the space. Only 1.00 g exists, so all of it evaporates and the pressure stays below the vapour pressure: $p = 3.17 \\times 1.00/2.30 = 1.38\\ \\mathrm{kPa}$.'
      ],
      a: '0.230 g evaporates, the pressure is 3.17 kPa; in 100 L everything evaporates and the pressure is only 1.38 kPa.'
    },
    {
      title: 'Dew on a cold glass',
      q: 'A room is at 20 °C and 60 % relative humidity. A glass of iced drink sits on the table. Will water condense on it? Water\'s vapour pressure is 2.34 kPa at 20 °C and 1.40 kPa at 12 °C.',
      steps: [
        'Partial pressure of water in the room: $0.60 \\times 2.34 = 1.40\\ \\mathrm{kPa}$.',
        'Air cooled against the glass stays at that partial pressure until the vapour pressure falls to meet it. From the data, that happens at 12 °C: the **dew point**.',
        'The iced glass is near 0 °C, well below 12 °C, so the air touching it is supersaturated and water condenses on the glass.'
      ],
      a: 'Yes: the dew point is 12 °C, and the glass is colder than that.'
    }
  ],
  quiz: [
    { q: 'Two sealed flasks at 25 °C, one of 1 L and one of 5 L, each contain some liquid water. At equilibrium the vapour pressure in the 5 L flask is…', choices: ['five times higher', 'five times lower', 'the same', 'higher, because more water has evaporated'], a: 2,
      why: 'Vapour pressure depends only on the liquid and the temperature. More water evaporates into the bigger flask, but the pressure at balance is identical.' },
    { q: 'Why does water boil at a lower temperature on a high mountain?', choices: ['the air is colder', 'there is less oxygen', 'the outside pressure is lower, so the vapour pressure reaches it sooner', 'water molecules are lighter at altitude'], a: 2,
      why: 'Boiling needs vapour pressure = outside pressure. At 0.83 atm water only has to reach a vapour pressure of 0.83 atm, which it does at about 95 °C.' },
    { q: 'At room temperature, which liquid has the highest vapour pressure?', choices: ['water', 'ethanol', 'diethyl ether', 'glycerol'], a: 2,
      why: 'Diethyl ether molecules are held only by weak dispersion and dipole forces and cannot hydrogen-bond to one another. It boils at 34.6 °C and has a vapour pressure near 59 kPa at 20 °C.' },
    { q: 'The bubbles that rise in a pan of boiling water are mostly air that was dissolved in it.', a: false,
      why: 'Dissolved air comes out early as tiny bubbles on the pan. The big bubbles of a rolling boil are water vapour, formed wherever the vapour pressure matches the outside pressure.' },
    { q: 'Air at 25 °C has a water vapour partial pressure of 1.90 kPa. Water\'s vapour pressure at 25 °C is 3.17 kPa. What is the relative humidity, in per cent?', answer: 59.9, unit: '%',
      why: '$\\mathrm{RH} = 1.90/3.17 = 0.599$, about 60 %.' }
  ],
  applications: ['Cooking at altitude and in pressure cookers.', 'Vacuum distillation and freeze-drying.', 'Weather: humidity, dew point, fog and clouds.', 'Fuel volatility and the fire risk of solvents.', 'Mercury spills: a tiny vapour pressure, but enough to poison a closed room.'],
  sim: 'state-vapour'
},

{
  id: 'phase-diagrams', parent: 'liquids-solids', title: 'Phase diagrams', level: 2,
  short: 'A map of pressure against temperature showing whether a substance is solid, liquid or gas. The lines are where two phases coexist; they meet at the triple point, and the liquid–gas line ends at the critical point.',
  keywords: ['phase diagram', 'triple point', 'critical point', 'supercritical fluid', 'sublimation', 'deposition', 'melting curve', 'vapour pressure curve', 'dry ice', 'ice', 'Clapeyron equation', 'freeze-drying', 'phase boundary'],
  prereq: ['vapor-pressure', 'physics:latent-heat'],
  related: ['clausius-clapeyron', 'real-gases', 'colligative-properties', 'crystal-structures', 'physics:temperature-heat'],
  body: `
Which phase a substance is in depends on two things: how hot it is and how hard it is squeezed. A **phase diagram** plots pressure against temperature and colours in the region where each phase is the stable one. It is the whole story of melting, boiling and subliming on one page.

### Reading the map
- **Areas** are single phases: solid at low temperature and high pressure, gas at high temperature and low pressure, liquid in between.
- **Lines** are where two phases coexist in equilibrium. The liquid–gas line is the [[vapor-pressure|vapour-pressure]] curve; the solid–gas line is the sublimation curve; the solid–liquid line is the melting curve.
- The **triple point** is the one temperature and pressure where solid, liquid and gas coexist.
- The liquid–gas line stops at the **critical point**. Beyond it, liquid and gas become the same phase — a **supercritical fluid**, dense like a liquid but flowing and filling space like a gas.

Walk along a horizontal line at 1 atm and you meet the normal melting point and the normal boiling point. Walk up a vertical line at a fixed temperature and you see what compression does.

### Water: an odd one
| | Temperature | Pressure |
|---|---|---|
| Triple point | 0.01 °C (273.16 K) | 611.657 Pa (0.00604 atm) |
| Normal melting point | 0.00 °C | 1 atm |
| Normal boiling point | 100.0 °C | 1 atm |
| Critical point | 374.0 °C | 22.06 MPa (218 atm) |

Water's melting line leans slightly to the **left**: squeeze ice and it melts at a lower temperature. That happens because ice is less dense than liquid water (0.917 against 1.000 g/cm³) — pressure favours the phase that takes less room. The effect is tiny: about 0.0075 K per atmosphere, from the **Clapeyron equation**

$$\\frac{dP}{dT} = \\frac{\\Delta H}{T\\,\\Delta V}$$

For almost every other substance the solid is denser, $\\Delta V$ of melting is positive, and the line leans right.

### Carbon dioxide and dry ice
Carbon dioxide's triple point is at −56.6 °C and **5.11 atm**. At 1 atm there is no liquid region at all: solid carbon dioxide turns straight into gas at −78.5 °C. That is why "dry ice" is dry. Liquid carbon dioxide exists only under pressure — a fire extinguisher holds it at about 57 atm at room temperature — and above 31.0 °C and 72.8 atm it is supercritical. Supercritical carbon dioxide is a clean, tunable solvent: it decaffeinates coffee, extracts hop oils and replaces chlorinated solvents in dry cleaning, then evaporates without a trace.

### Using the map
- **Freeze-drying** (lyophilisation) freezes food or a vaccine, then lowers the pressure below the triple point so the ice sublimes without ever melting; the structure is kept.
- **Frost and snow** form by deposition, gas straight to solid, when the dew point is below 0 °C.
- **Pressure cookers and autoclaves** move along the vapour-pressure curve to hotter boiling.
- Dissolving a solute shifts the liquid region: it freezes lower and boils higher ([[colligative-properties]]).
`,
  ideas: [
    'A phase diagram shows the stable phase at each temperature and pressure; the lines are two-phase equilibria.',
    'At the triple point solid, liquid and gas coexist; at the critical point the liquid–gas distinction disappears.',
    'The slope of a phase boundary is given by the Clapeyron equation, dP/dT = ΔH/(TΔV).',
    'Water\'s melting line slopes backwards because ice is less dense than water.',
    'Below its triple-point pressure a solid sublimes instead of melting: dry ice at 1 atm, ice in a freeze-dryer.'
  ],
  pitfalls: [
    'Ice skates glide because the blade\'s pressure melts the ice — The pressure lowers the melting point by only a fraction of a degree. Friction heating and a thin liquid-like surface layer on ice explain skating, even at −20 °C.',
    'Above the critical temperature a substance is a gas — It is a supercritical fluid, which can be as dense as a liquid. There is simply no boundary to cross between liquid-like and gas-like states.',
    'The triple point is the normal melting point — They differ: water melts at 0.00 °C at 1 atm but its triple point is 0.01 °C at 0.006 atm. For carbon dioxide the difference is dramatic.'
  ],
  formulas: [
    {
      name: 'Shift of the melting point under pressure (Clapeyron)',
      expr: 'dT = T*dV*dP/dH', tex: '\\Delta T = \\frac{T\\,\\Delta V_\\text{fus}\\,\\Delta P}{\\Delta H_\\text{fus}}',
      vars: {
        dT: { name: 'change of melting point', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' },
        T: { name: 'normal melting point', q: 'temperature', unit: 'K', value: 273.15 },
        dV: { name: 'volume change on melting, per mole', q: 'molarvolume', unit: 'cm³/mol', value: -1.634, signed: true, tex: '\\Delta V_\\text{fus}' },
        dP: { name: 'extra pressure', q: 'pressure', unit: 'atm', value: 100, signed: true, tex: '\\Delta P' },
        dH: { name: 'enthalpy of fusion', q: 'molarenergy', unit: 'kJ/mol', value: 6.01, tex: '\\Delta H_\\text{fus}' }
      },
      note: 'Good for changes small enough that the line is nearly straight. For water $\\Delta V_\\text{fus}$ is negative, so pressure lowers the melting point.',
      stories: {
        dT: 'Ice ($\\Delta H_\\text{fus}$ = {dH}, $\\Delta V_\\text{fus}$ = {dV}) melts at {T} at 1 atm. By how much does its melting point change under an extra {dP}?',
        dP: 'What extra pressure lowers the melting point of ice ($\\Delta H_\\text{fus}$ = {dH}, $\\Delta V_\\text{fus}$ = {dV}, normal melting point {T}) by {dT}?'
      }
    },
    {
      name: 'Volume change on melting from the densities',
      expr: 'dV = M*(1/rhol - 1/rhos)', tex: '\\Delta V_\\text{fus} = M\\left(\\frac{1}{\\rho_l} - \\frac{1}{\\rho_s}\\right)',
      vars: {
        dV: { name: 'volume change on melting, per mole', q: 'molarvolume', unit: 'cm³/mol', signed: true, tex: '\\Delta V_\\text{fus}' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 },
        rhol: { name: 'density of the liquid', q: 'density', unit: 'g/cm³', value: 0.99984, tex: '\\rho_l' },
        rhos: { name: 'density of the solid', q: 'density', unit: 'g/cm³', value: 0.9167, tex: '\\rho_s' }
      },
      note: 'Negative when the solid is less dense than the liquid (water, silicon, gallium, bismuth); positive for almost everything else.',
      stories: {
        dV: 'Water at 0 °C has a density of {rhol} and ice {rhos}. What is the change in volume when one mole ($M$ = {M}) of ice melts?'
      }
    }
  ],
  examples: [
    {
      title: 'Does a skate melt the ice?',
      q: 'A 70 kg skater stands on one blade whose contact area with the ice is about 2.0 cm². By how much does the pressure lower the melting point of ice? ($\\Delta H_\\text{fus}$ = 6.01 kJ/mol, $\\Delta V_\\text{fus}$ = −1.634 cm³/mol.)',
      steps: [
        'Pressure under the blade: $P = mg/A = 70 \\times 9.81/(2.0 \\times 10^{-4}) = 3.4 \\times 10^6\\ \\mathrm{Pa}$, about 34 atm.',
        { text: 'Clapeyron, for a small change:', tex: '\\Delta T = \\frac{T\\,\\Delta V\\,\\Delta P}{\\Delta H} = \\frac{273.15 \\times (-1.634 \\times 10^{-6}) \\times 3.4 \\times 10^{6}}{6010} = -0.25\\ \\mathrm{K}' },
        'A quarter of a degree. On ice at −10 °C this cannot produce water; skating works because friction warms the surface and because ice carries a thin, disordered, liquid-like surface layer.'
      ],
      a: 'Only about 0.25 K — pressure melting cannot explain skating on cold ice.'
    },
    {
      title: 'Opening a carbon dioxide extinguisher',
      q: 'A carbon dioxide fire extinguisher at 20 °C holds liquid carbon dioxide under its own vapour pressure, about 57 atm. What comes out of the horn when it is fired, and why is the horn cold enough to frost?',
      steps: [
        'Inside, liquid and vapour coexist: the state sits on the liquid–gas line at 20 °C.',
        'Leaving the horn, the pressure drops towards 1 atm. On the phase diagram, 1 atm lies below the triple point (5.11 atm), where no liquid can exist.',
        'Part of the liquid flashes to gas; the evaporation absorbs so much heat that the rest cools to −78.5 °C and freezes into snow-like solid carbon dioxide.',
        'That "snow" then sublimes, never melting — and blankets the fire with dense, oxygen-free gas.'
      ],
      a: 'A mixture of cold gas and dry-ice snow at −78.5 °C; no liquid can survive at 1 atm.'
    }
  ],
  quiz: [
    { q: 'What exists at the triple point of a substance?', choices: ['only the solid', 'the liquid and the gas, which become identical', 'solid, liquid and gas in equilibrium', 'a supercritical fluid'], a: 2,
      why: 'The triple point is where the three two-phase lines meet: all three phases coexist. The critical point is where liquid and gas become identical.' },
    { q: 'Why does the melting line of water slope to the left (negative slope)?', choices: ['water has a high heat capacity', 'ice is less dense than liquid water', 'hydrogen bonds break when ice melts', 'water has a low molar mass'], a: 1,
      why: 'Pressure favours the denser phase. Liquid water is denser than ice, so squeezing ice turns it to water: the melting point falls as pressure rises. In the Clapeyron equation, $\\Delta V_\\text{fus}$ is negative.' },
    { q: 'At 1 atm, solid carbon dioxide melts into a liquid at −56.6 °C.', a: false,
      why: 'At 1 atm carbon dioxide sublimes directly at −78.5 °C. Its triple point is at 5.11 atm, so liquid carbon dioxide only exists above that pressure.' },
    { q: 'A substance is held above its critical temperature and critical pressure. It is…', choices: ['a solid', 'a liquid', 'a gas that can be liquefied by compression', 'a supercritical fluid'], a: 3,
      why: 'Above the critical point there is no distinction between liquid and gas; no amount of compression produces a separate liquid.' },
    { q: 'Freeze-drying removes water from frozen food by…', choices: ['melting the ice at low temperature', 'lowering the pressure below the triple point so the ice sublimes', 'raising the pressure so the ice melts', 'heating it above the critical point'], a: 1,
      why: 'Below 611 Pa the liquid region does not exist, so ice turns directly into vapour. The food keeps its shape because it never becomes wet.' }
  ],
  applications: ['Freeze-drying food, coffee and vaccines.', 'Supercritical carbon dioxide extraction and dry cleaning.', 'Dry ice for shipping and special effects.', 'Autoclaves and pressure cookers.', 'Choosing working fluids for refrigerators and heat pumps.'],
  history: 'Thomas Andrews discovered the critical point of carbon dioxide in 1869 by watching the meniscus between liquid and gas vanish as he raised the temperature past 31 °C. Émile Clapeyron derived the slope of a phase boundary in 1834, and Rudolf Clausius put it on a firm thermodynamic footing in 1850.',
  sim: 'state-phase'
},

{
  id: 'clausius-clapeyron', parent: 'liquids-solids', title: 'The Clausius–Clapeyron equation', level: 2,
  short: 'Vapour pressure rises exponentially with temperature. A plot of ln P against 1/T is a straight line whose slope is −ΔHvap/R, which lets you predict boiling points and measure enthalpies of vaporisation.',
  keywords: ['Clausius–Clapeyron equation', 'enthalpy of vaporisation', 'heat of vaporization', 'ln P against 1/T', 'vapour pressure curve', 'Trouton\'s rule', 'boiling point at altitude', 'pressure cooker', 'Antoine equation', 'Boltzmann factor'],
  prereq: ['vapor-pressure', 'math:logarithms', 'physics:latent-heat'],
  related: ['phase-diagrams', 'arrhenius-equation', 'vant-hoff', 'gibbs-equilibrium', 'math:exponential-functions', 'math:equation-of-a-line'],
  body: `
Heat a liquid by 10 degrees and its vapour pressure does not rise by a fixed amount — it multiplies. Water's vapour pressure is 2.3 kPa at 20 °C, 7.4 kPa at 40 °C, 20 kPa at 60 °C and 101 kPa at 100 °C. The reason is the same as for the steep rise of reaction rates: to escape, a molecule needs an energy of about $\\Delta H_\\text{vap}/N_A$, and the fraction of molecules with that much energy goes as the Boltzmann factor $e^{-\\Delta H_\\text{vap}/RT}$.

### The equation
Treating the vapour as an ideal gas, neglecting the liquid's volume and taking $\\Delta H_\\text{vap}$ as constant gives

$$\\ln P = -\\frac{\\Delta H_\\text{vap}}{R}\\cdot\\frac{1}{T} + C$$

A graph of $\\ln P$ against $1/T$ is a **straight line** with slope $-\\Delta H_\\text{vap}/R$ ([[math:equation-of-a-line|a line]], $y = mx + c$). Subtracting the equation at two temperatures removes the constant:

$$\\ln\\frac{P_2}{P_1} = -\\frac{\\Delta H_\\text{vap}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

Pressures appear only as a ratio, so any unit will do; temperatures must be in kelvin.

### What it is good for
- **Boiling at altitude.** Take $P_1$ = 1 atm and $T_1$ = 373.15 K for water, $\\Delta H_\\text{vap}$ = 40.7 kJ/mol. At 0.83 atm (Denver) the equation gives 94.6 °C; at 0.33 atm (Everest) 71 °C; at 2 atm (a pressure cooker) 121 °C.
- **Vapour pressure at storage temperature.** Knowing a solvent's boiling point and $\\Delta H_\\text{vap}$ tells you how much vapour a drum gives off on a hot day — vital for flammability and exposure limits.
- **Measuring $\\Delta H_\\text{vap}$.** Measure the vapour pressure at a few temperatures, plot $\\ln P$ against $1/T$, and read off the slope. No calorimeter is needed.

### Trouton's rule
Many liquids have nearly the same entropy of vaporisation at their normal boiling point, $\\Delta S_\\text{vap} = \\Delta H_\\text{vap}/T_b \\approx 85$–$88\\ \\mathrm{J/(mol\\cdot K)}$: benzene 87, diethyl ether 86. So $\\Delta H_\\text{vap} \\approx 87\\,T_b$ is a quick estimate. Liquids whose molecules are **ordered** by hydrogen bonds break the rule upwards — water 109, ethanol 110 — because vaporising them releases more order ([[entropy]]).

### Limits
$\\Delta H_\\text{vap}$ is not really constant: water's falls from 45.0 kJ/mol at 0 °C to 40.7 kJ/mol at 100 °C, and to zero at the critical point, so the line curves gently. Engineers therefore use fitted forms such as the **Antoine equation**, $\\log_{10} P = A - B/(C + t)$. The same equation, with the enthalpy of sublimation, describes the vapour pressure of a solid, and the same mathematics reappears as the [[arrhenius-equation]] for rates and the [[vant-hoff|van 't Hoff equation]] for equilibrium constants.
`,
  ideas: [
    'Vapour pressure grows exponentially with temperature because the fraction of molecules energetic enough to escape follows the Boltzmann factor.',
    'ln P plotted against 1/T gives a straight line with slope −ΔHvap/R.',
    'The two-point form ln(P2/P1) = −(ΔHvap/R)(1/T2 − 1/T1) predicts boiling points at other pressures.',
    'Trouton\'s rule: ΔHvap ≈ 87 J/(mol·K) × Tb for liquids without hydrogen bonding.',
    'The same shape of law governs reaction rates (Arrhenius) and equilibrium constants (van \'t Hoff).'
  ],
  pitfalls: [
    'Using Celsius temperatures in 1/T — 1/T must be in kelvin; 1/25 and 1/35 bear no relation to the physics.',
    'A plot of P against T should be straight — P rises exponentially; only ln P against 1/T is (nearly) a straight line.',
    'Getting the sign of the slope wrong — The slope of ln P against 1/T is negative (higher T, smaller 1/T, larger P); ΔHvap = −R × slope is positive.'
  ],
  derivation: {
    title: 'From the Clapeyron equation to Clausius–Clapeyron',
    steps: [
      { text: 'The Clapeyron equation for the liquid–vapour line:', tex: '\\frac{dP}{dT} = \\frac{\\Delta H_\\text{vap}}{T\\,(V_{m,g} - V_{m,l})}' },
      { text: 'The vapour occupies about a thousand times the volume of the liquid, so neglect $V_{m,l}$ and treat the vapour as ideal, $V_{m,g} = RT/P$:', tex: '\\frac{dP}{dT} = \\frac{\\Delta H_\\text{vap}\\,P}{RT^2}' },
      { text: 'Separate the variables ([[math:separable-equations|a separable equation]]):', tex: '\\frac{dP}{P} = \\frac{\\Delta H_\\text{vap}}{R}\\,\\frac{dT}{T^2}' },
      { text: 'Integrate between two states, taking $\\Delta H_\\text{vap}$ as constant:', tex: '\\ln\\frac{P_2}{P_1} = -\\frac{\\Delta H_\\text{vap}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)' }
    ]
  },
  formulas: [
    {
      name: 'Clausius–Clapeyron equation (two-point form)',
      expr: 'ln(P2/P1) = -dH/R*(1/T2 - 1/T1)', tex: '\\ln\\frac{P_2}{P_1} = -\\frac{\\Delta H_\\text{vap}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)',
      vars: {
        P2: { name: 'second vapour pressure', q: 'pressure', unit: 'atm', value: 0.826, tex: 'P_2' },
        P1: { name: 'first vapour pressure', q: 'pressure', unit: 'atm', value: 1.00, tex: 'P_1' },
        dH: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', value: 40.66, tex: '\\Delta H_\\text{vap}' },
        R: { const: 'R' },
        T2: { name: 'second temperature', q: 'temperature', unit: '°C', tex: 'T_2' },
        T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T_1' }
      },
      solveFor: 'T2',
      note: 'The defaults find the boiling point of water in Denver (0.826 atm) from its normal boiling point. The pressures appear as a ratio, so their unit cancels.',
      stories: {
        T2: 'Water boils at {T1} under {P1} ($\\Delta H_\\text{vap}$ = {dH}). At what temperature does it boil when the pressure is {P2}?',
        P2: 'A liquid has a vapour pressure of {P1} at {T1} and $\\Delta H_\\text{vap}$ = {dH}. What is its vapour pressure at {T2}?',
        dH: 'A liquid\'s vapour pressure is {P1} at {T1} and {P2} at {T2}. What is its enthalpy of vaporisation?'
      }
    },
    {
      name: 'Enthalpy of vaporisation from the slope of ln P against 1/T',
      expr: 'dH = -R*m', tex: '\\Delta H_\\text{vap} = -R\\,m',
      vars: {
        dH: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta H_\\text{vap}' },
        R: { const: 'R' },
        m: { name: 'slope of ln P against 1/T', q: 'dtemp', unit: 'K', value: -5140, signed: true }
      },
      note: 'The slope has the unit of temperature (ln P is a pure number, 1/T is in 1/K). The default is water between 25 °C and 100 °C, which gives an average of 42.7 kJ/mol.',
      stories: {
        dH: 'A plot of ln P against 1/T for a liquid has a slope of {m}. What is its enthalpy of vaporisation?',
        m: 'A liquid has $\\Delta H_\\text{vap}$ = {dH}. What slope do you expect on a plot of ln P against 1/T?'
      }
    },
    {
      name: 'Trouton\'s rule',
      expr: 'dH = dS*Tb', tex: '\\Delta H_\\text{vap} \\approx \\Delta S_\\text{vap}\\,T_b',
      vars: {
        dH: { name: 'enthalpy of vaporisation', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta H_\\text{vap}' },
        dS: { name: 'entropy of vaporisation (about 87 for most liquids)', q: 'molarheat', unit: 'J/(mol·K)', value: 87, tex: '\\Delta S_\\text{vap}' },
        Tb: { name: 'normal boiling point', q: 'temperature', unit: '°C', value: 80.1, tex: 'T_b' }
      },
      note: 'A rough estimate for liquids without hydrogen bonds; for water and alcohols use about 109 J/(mol·K). Default: benzene, whose measured value is 30.7 kJ/mol.',
      stories: {
        dH: 'Estimate the enthalpy of vaporisation of a liquid that boils at {Tb}, taking $\\Delta S_\\text{vap}$ = {dS}.',
        Tb: 'A liquid with no hydrogen bonding has $\\Delta H_\\text{vap}$ = {dH}. Taking $\\Delta S_\\text{vap}$ = {dS}, estimate its normal boiling point.'
      }
    }
  ],
  examples: [
    {
      title: 'Tea on Everest',
      q: 'The air pressure on the summit of Everest is about 0.333 atm. At what temperature does water boil there? ($\\Delta H_\\text{vap}$ = 40.66 kJ/mol; normal boiling point 100.0 °C.)',
      steps: [
        { text: 'Solve the two-point form for $1/T_2$:', tex: '\\frac{1}{T_2} = \\frac{1}{T_1} - \\frac{R}{\\Delta H_\\text{vap}}\\ln\\frac{P_2}{P_1}' },
        { text: 'Substitute:', tex: '\\frac{1}{T_2} = \\frac{1}{373.15} - \\frac{8.314}{40\\,660}\\ln 0.333 = 0.0026799 + 0.0002249 = 0.0029048\\ \\mathrm{K^{-1}}' },
        '$T_2 = 344.3\\ \\mathrm{K} = 71.1\\ ^{\\circ}\\mathrm{C}$. (Accurate steam tables give 71.8 °C; the small difference comes from treating $\\Delta H_\\text{vap}$ as constant.)'
      ],
      a: 'About 71 °C — too cool for a good cup of tea, and far too cool to cook rice.'
    },
    {
      title: 'Measuring the enthalpy of vaporisation of ethanol',
      q: 'Ethanol has a vapour pressure of 5.95 kPa at 20.0 °C and boils at 78.3 °C under 101.3 kPa. Estimate its enthalpy of vaporisation.',
      steps: [
        { text: 'Rearrange the two-point form:', tex: '\\Delta H_\\text{vap} = \\frac{R\\,\\ln(P_2/P_1)}{1/T_1 - 1/T_2}' },
        { text: 'Substitute ($T_1$ = 293.15 K, $T_2$ = 351.45 K):', tex: '\\Delta H_\\text{vap} = \\frac{8.314 \\times \\ln(101.3/5.95)}{0.0034112 - 0.0028454} = \\frac{8.314 \\times 2.835}{5.658 \\times 10^{-4}} = 41.7\\ \\mathrm{kJ/mol}' },
        'This is an average over the range; the tabulated values are 42.3 kJ/mol at 25 °C and 38.6 kJ/mol at the boiling point.',
        'Check with Trouton: $87 \\times 351.45 = 30.6$ kJ/mol is far too low — ethanol is hydrogen-bonded, so its $\\Delta S_\\text{vap}$ is about 110 J/(mol·K).'
      ],
      a: 'About 42 kJ/mol.'
    }
  ],
  quiz: [
    { q: 'Which plot of vapour-pressure data gives a straight line?', choices: ['P against T', 'ln P against T', 'ln P against 1/T', 'P against 1/T'], a: 2,
      why: '$\\ln P = -\\Delta H_\\text{vap}/(RT) + C$ is linear in $1/T$, with slope $-\\Delta H_\\text{vap}/R$.' },
    { q: 'Two liquids boil at the same temperature at 1 atm. Liquid A has the larger $\\Delta H_\\text{vap}$. Below the boiling point, which has the higher vapour pressure?', choices: ['A', 'B', 'they are equal at every temperature', 'it cannot be decided'], a: 1,
      why: 'Both lines pass through the same point (1 atm at $T_b$), but A\'s is steeper: its vapour pressure falls off faster as you cool. Below $T_b$, B has the higher vapour pressure.' },
    { q: 'Water\'s vapour pressure is 23.8 mmHg at 25 °C and $\\Delta H_\\text{vap}$ = 43.9 kJ/mol near room temperature. Estimate its vapour pressure at 35 °C.', answer: 42.3, unit: 'mmHg',
      why: '$\\ln(P_2/23.8) = -(43\\,900/8.314)(1/308.15 - 1/298.15) = 0.575$, so $P_2 = 23.8 \\times 1.777 = 42.3$ mmHg. (Measured: 42.2 mmHg.)' },
    { q: 'Water\'s entropy of vaporisation (109 J/(mol·K)) is larger than Trouton\'s value because liquid water is held in an ordered network of hydrogen bonds.', a: true,
      why: 'Breaking up the ordered liquid releases extra entropy on vaporisation. Liquids without hydrogen bonds cluster around 85–88 J/(mol·K).' }
  ],
  applications: ['Boiling points at altitude and in pressure vessels.', 'Designing distillation and drying processes.', 'Solvent safety: vapour concentrations and flash-point estimates.', 'Measuring enthalpies of vaporisation and sublimation from vapour pressures.'],
  history: 'Émile Clapeyron derived the slope of the phase boundary in 1834 from Sadi Carnot\'s work on heat engines; Rudolf Clausius rederived it in 1850 and added the ideal-gas approximation that gives the familiar logarithmic form. Frederick Trouton noticed his rule in 1884.',
  sim: { id: 'state-vapour', params: { graph: 'lnp' } }
},

{
  id: 'crystal-structures', parent: 'liquids-solids', title: 'Crystalline solids and unit cells', level: 2,
  short: 'In a crystal the particles repeat in a regular three-dimensional pattern. The smallest repeating box, the unit cell, fixes how many atoms each has, how tightly they pack and the density of the solid.',
  keywords: ['crystal', 'unit cell', 'lattice', 'simple cubic', 'body-centred cubic', 'face-centred cubic', 'bcc', 'fcc', 'hcp', 'close packing', 'coordination number', 'packing fraction', 'lattice constant', 'density', 'X-ray diffraction', 'rock salt', 'caesium chloride', 'amorphous', 'types of solid'],
  prereq: ['metallic-bonding', 'ionic-bonding', 'mole-concept'],
  related: ['physics:crystal-structure', 'lattice-energy', 'phase-diagrams', 'intermolecular-forces', 'physics:density', 'math:solid-geometry'],
  body: `
Salt grains are tiny cubes, snowflakes have six-fold symmetry and a cleaved crystal of calcite always breaks along the same planes. The outward regularity reflects an inner one: in a **crystalline solid** the particles sit in a pattern that repeats, identically, in three dimensions. Glass, many plastics and candle wax lack that long-range order: they are **amorphous** and soften gradually instead of melting at a sharp temperature.

### Kinds of crystalline solid
| Kind | Particles | Held by | Examples | Typical properties |
|---|---|---|---|---|
| Molecular | molecules | intermolecular forces | ice, sugar, iodine, dry ice | soft, low melting, insulating |
| Covalent network | atoms | covalent bonds throughout | diamond, quartz, silicon carbide | very hard, very high melting |
| Ionic | ions | electrostatic attraction | $\\ce{NaCl}$, $\\ce{MgO}$, $\\ce{CaF2}$ | hard, brittle, conduct when molten |
| Metallic | cations in an electron sea | metallic bonding | $\\ce{Cu}$, $\\ce{Fe}$, $\\ce{Al}$ | ductile, lustrous, conducting |

### The unit cell
The repeating pattern is described by a **unit cell**, a small box which, stacked like bricks, rebuilds the whole crystal. The three cubic cells are the simplest:

| Cell | Atoms at | Atoms per cell | Neighbours | Edge $a$ from radius $r$ | Space filled |
|---|---|---|---|---|---|
| Simple cubic | corners | 1 | 6 | $a = 2r$ | 52.4 % |
| Body-centred cubic (bcc) | corners + centre | 2 | 8 | $a = 4r/\\sqrt{3}$ | 68.0 % |
| Face-centred cubic (fcc) | corners + face centres | 4 | 12 | $a = 2\\sqrt{2}\\,r$ | 74.0 % |

**Counting atoms.** A corner atom is shared by the 8 cells that meet there, so only ⅛ of it belongs to one cell; a face atom is shared by 2 (½ each), an edge atom by 4 (¼), and a body atom belongs wholly. fcc: $8 \\times \\tfrac18 + 6 \\times \\tfrac12 = 4$.

**Packing.** fcc is one of the two ways of stacking equal spheres as tightly as possible (74 %); the other, **hexagonal close packing** (hcp), differs only in the order of the layers (ABAB… instead of ABCABC…). Copper, aluminium, silver, gold and nickel are fcc; magnesium, zinc and titanium hcp; iron (below 912 °C), chromium, tungsten and the alkali metals bcc. Only polonium is simple cubic.

### Density from the cell
A unit cell of edge $a$ holding $Z$ atoms (or formula units) of molar mass $M$ has density

$$\\rho = \\frac{Z\\,M}{N_A\\,a^3}$$

X-ray diffraction measures $a$ to five or six significant figures, which makes this one of the most precise ways of weighing atoms — the redefinition of the kilogram in 2019 relied partly on counting the atoms in a polished sphere of silicon this way.

### Ionic crystals
In rock salt ($\\ce{NaCl}$) the chloride ions form an fcc array and the sodium ions fill the gaps between them: each ion has 6 neighbours of the other kind, and the cell holds 4 formula units. Caesium ions are bigger, so caesium chloride adopts a cell with each ion surrounded by 8 of the other. It looks like bcc but is really simple cubic with a two-ion basis, because the centre and the corners hold different ions.

> [!fact] For engineers: iron is bcc (ferrite) below 912 °C and fcc (austenite) above. The gaps in fcc are larger, so austenite dissolves up to 2 % carbon against 0.02 % in ferrite — the basis of hardening steel by heating and quenching. The switch also changes the volume by about 1 %, which dilatometers use to track heat treatment.
`,
  ideas: [
    'A crystal is a regular three-dimensional repetition of a unit cell.',
    'Corner atoms count ⅛, face atoms ½, edge atoms ¼ and body atoms 1 towards a cell.',
    'Simple cubic, bcc and fcc cells hold 1, 2 and 4 atoms, with 6, 8 and 12 nearest neighbours.',
    'fcc and hcp are the closest packings of equal spheres, filling 74 % of space.',
    'Density follows from the cell: ρ = ZM/(N_A a³).'
  ],
  pitfalls: [
    'A unit cell with atoms at 8 corners contains 8 atoms — Each corner atom is shared by 8 cells, so the corners contribute only 1 atom in total.',
    'Caesium chloride is body-centred cubic — The centre and corner sites hold different ions, so they are not equivalent lattice points. It is simple cubic with two ions per point.',
    'Denser packing means a denser material — Packing fraction compares arrangements of the same atoms. Density also depends on the mass and size of the atoms: bcc tungsten (19.3 g/cm³) is far denser than fcc aluminium (2.70 g/cm³).'
  ],
  formulas: [
    {
      name: 'Density of a cubic crystal',
      expr: 'rho = Z*M/(NA*a^3)', tex: '\\rho = \\frac{Z\\,M}{N_A\\,a^3}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'g/cm³', tex: '\\rho' },
        Z: { name: 'atoms (or formula units) per cell', int: true, value: 4 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 63.546 },
        NA: { const: 'NA' },
        a: { name: 'edge of the unit cell', q: 'length', unit: 'pm', value: 361.49 }
      },
      note: 'Z = 1 (simple cubic), 2 (bcc), 4 (fcc, or rock salt counting formula units). The defaults are copper, whose measured density is 8.96 g/cm³.',
      stories: {
        rho: 'Copper ($M$ = {M}) crystallises face-centred cubic with {Z} atoms per cell and a cell edge of {a}. What is its density?',
        a: 'A metal of molar mass {M} and density {rho} has {Z} atoms per unit cell. How long is the edge of the cell?',
        M: 'A metal crystallises with {Z} atoms per cubic cell of edge {a}, and its density is {rho}. What is its molar mass?'
      }
    },
    {
      name: 'Atomic radius in a face-centred cubic metal',
      expr: 'r = sqrt(2)*a/4', tex: 'r = \\frac{\\sqrt{2}\\,a}{4}',
      vars: {
        r: { name: 'atomic (metallic) radius', q: 'length', unit: 'pm' },
        a: { name: 'edge of the unit cell', q: 'length', unit: 'pm', value: 361.49 }
      },
      note: 'In fcc the atoms touch along the face diagonal, which is $4r = \\sqrt2\\,a$. Default: copper.',
      stories: {
        r: 'Copper is face-centred cubic with a cell edge of {a}. What is the radius of a copper atom?',
        a: 'Silver atoms have a radius of {r} and pack face-centred cubic. How long is the cell edge?'
      }
    },
    {
      name: 'Atomic radius in a body-centred cubic metal',
      expr: 'r = sqrt(3)*a/4', tex: 'r = \\frac{\\sqrt{3}\\,a}{4}',
      vars: {
        r: { name: 'atomic (metallic) radius', q: 'length', unit: 'pm' },
        a: { name: 'edge of the unit cell', q: 'length', unit: 'pm', value: 286.65 }
      },
      note: 'In bcc the atoms touch along the body diagonal, $4r = \\sqrt3\\,a$. Default: iron at room temperature.',
      stories: {
        r: 'Iron is body-centred cubic with a cell edge of {a}. What is the radius of an iron atom?',
        a: 'Tungsten atoms have a radius of {r} and pack body-centred cubic. How long is the cell edge?'
      }
    },
    {
      name: 'Packing fraction',
      expr: 'phi = Z*4/3*pi*r^3/a^3', tex: '\\phi = \\frac{Z\\cdot\\tfrac43\\pi r^3}{a^3}',
      vars: {
        phi: { name: 'fraction of space filled', q: 'ratio', unit: '%', tex: '\\phi' },
        Z: { name: 'atoms per cell', int: true, value: 4 },
        r: { name: 'atomic radius', q: 'length', unit: 'pm', value: 127.8 },
        a: { name: 'edge of the unit cell', q: 'length', unit: 'pm', value: 361.49 }
      },
      note: 'The volume of the spheres in one cell over the volume of the cell: 52 % (simple cubic), 68 % (bcc), 74 % (fcc and hcp).',
      stories: {
        phi: 'A cubic cell of edge {a} contains {Z} atoms of radius {r}. What fraction of the space do they fill?'
      }
    }
  ],
  examples: [
    {
      title: 'The density of copper',
      q: 'Copper is face-centred cubic with a cell edge of 361.5 pm. Calculate its density and the radius of a copper atom.',
      steps: [
        'Atoms per fcc cell: $8 \\times \\tfrac18 + 6 \\times \\tfrac12 = 4$.',
        'Cell volume: $a^3 = (361.5 \\times 10^{-10}\\ \\mathrm{cm})^3 = 4.724 \\times 10^{-23}\\ \\mathrm{cm^3}$.',
        { text: 'Density:', tex: '\\rho = \\frac{4 \\times 63.55}{6.022 \\times 10^{23} \\times 4.724 \\times 10^{-23}} = 8.94\\ \\mathrm{g/cm^3}' },
        'Radius: the atoms touch along the face diagonal, $4r = \\sqrt2\\,a$, so $r = 127.8$ pm.'
      ],
      a: '8.94 g/cm³ (measured 8.96); r = 128 pm.'
    },
    {
      title: 'Counting atoms with a crystal of silicon',
      q: 'Silicon has the diamond structure, with 8 atoms per cubic cell of edge 543.10 pm. Its density is 2.3290 g/cm³ and its molar mass 28.0855 g/mol. What value of the Avogadro constant do these give?',
      steps: [
        { text: 'Rearrange $\\rho = ZM/(N_A a^3)$:', tex: 'N_A = \\frac{Z\\,M}{\\rho\\,a^3}' },
        'Cell volume: $(5.4310 \\times 10^{-8}\\ \\mathrm{cm})^3 = 1.6019 \\times 10^{-22}\\ \\mathrm{cm^3}$.',
        { text: 'Substitute:', tex: 'N_A = \\frac{8 \\times 28.0855}{2.3290 \\times 1.6019 \\times 10^{-22}} = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}' },
        'The international Avogadro project did exactly this with a near-perfect sphere of isotopically pure silicon-28, reaching a few parts in a hundred million.'
      ],
      a: '6.022 × 10²³ per mole.'
    }
  ],
  quiz: [
    { q: 'How many atoms belong to one face-centred cubic unit cell?', choices: ['4', '8', '14', '2'], a: 0,
      why: 'Eight corners at ⅛ each give 1; six faces at ½ each give 3. Total 4. Counting 14 forgets that the atoms are shared with neighbouring cells.' },
    { q: 'What is the coordination number (nearest neighbours) of an atom in a body-centred cubic metal?', choices: ['6', '8', '12', '4'], a: 1,
      why: 'The body-centre atom touches the 8 corner atoms along the body diagonals; by symmetry every atom has 8 neighbours.' },
    { q: 'Which arrangement fills the largest fraction of space with equal spheres?', choices: ['simple cubic', 'body-centred cubic', 'face-centred cubic', 'they all fill the same fraction'], a: 2,
      why: 'fcc (and hcp) fill 74 %, bcc 68 %, simple cubic 52 %.' },
    { q: 'Aluminium is fcc with a cell edge of 404.95 pm and molar mass 26.982 g/mol. What is its density?', answer: 2.70, unit: 'g/cm³',
      why: '$\\rho = 4 \\times 26.982/(6.022 \\times 10^{23} \\times (4.0495 \\times 10^{-8})^3) = 2.70$ g/cm³.' },
    { q: 'Caesium chloride has a caesium ion at the centre of a cube of chloride ions, so its lattice is body-centred cubic.', a: false,
      why: 'A lattice point must have identical surroundings. The centre and corner sites hold different ions, so the lattice is simple cubic with a two-ion basis (one formula unit per cell).' }
  ],
  applications: ['Heat treatment of steel (ferrite, austenite and martensite).', 'Choosing metals for ductility: fcc metals stay tough in the cold, many bcc steels turn brittle.', 'X-ray crystallography of minerals, drugs and proteins.', 'Silicon wafers for chips, and the silicon-sphere definition of the kilogram.'],
  history: 'Max von Laue showed in 1912 that crystals diffract X-rays, and William Henry and William Lawrence Bragg turned the effect into a way of measuring the positions of atoms in 1913 — rock salt was among the first structures solved.',
  sim: 'state-unitcell'
},

{
  id: 'surface-tension-viscosity', parent: 'liquids-solids', title: 'Surface tension and viscosity', level: 1,
  short: 'Molecules at a liquid\'s surface are pulled inwards, so the surface behaves like a stretched skin; molecules that cling to one another make a liquid flow sluggishly. Both grow with the strength of the intermolecular forces.',
  keywords: ['surface tension', 'viscosity', 'cohesion', 'adhesion', 'meniscus', 'capillary action', 'capillary rise', 'surfactant', 'detergent', 'droplet', 'Laplace pressure', 'motor oil', 'glycerol', 'temperature dependence of viscosity'],
  prereq: ['intermolecular-forces', 'hydrogen-bonding'],
  related: ['physics:surface-tension', 'physics:viscosity', 'imf-properties', 'vapor-pressure', 'lipids', 'polymers'],
  body: `
A steel paper clip can rest on water, a water strider runs across a pond, and a dripping tap makes round drops. A molecule inside a liquid is pulled equally in every direction by its neighbours; a molecule at the surface has neighbours only on one side and is pulled inwards. Making more surface means dragging molecules up from the comfortable interior, and that costs energy. So a liquid minimises its surface: small drops become spheres, and the surface resists being stretched like an elastic skin.

### Surface tension
**Surface tension** $\\gamma$ is the energy needed to create a unit area of new surface, or equivalently the force per unit length pulling along the surface; its unit is J/m² = N/m, usually quoted in mN/m. It tracks the strength of the [[intermolecular-forces]]:

| Liquid (20 °C) | hexane | ethanol | olive oil | glycerol | water | mercury |
|---|---|---|---|---|---|---|
| $\\gamma$ (mN/m) | 18.4 | 22.3 | about 32 | 63.4 | 72.8 | 486 |

Water, with its network of [[hydrogen-bonding|hydrogen bonds]], is the highest of the common liquids; mercury, held by metallic bonding, is higher still. **Surfactants** — soaps, detergents, the lung's own surfactant — have a water-loving head and an oily tail, crowd to the surface and cut water's surface tension to about 30 mN/m. That is how detergent lets water wet greasy fabric, and why a drop of washing-up liquid sinks the floating paper clip.

### Wetting and capillary action
Whether a liquid spreads on a solid is a contest between **cohesion** (liquid–liquid attraction) and **adhesion** (liquid–solid attraction). Water wets clean glass and climbs it, curving into a concave meniscus; mercury clings to itself, beads up and forms a convex meniscus. In a narrow tube the wetting liquid is pulled up until the weight of the column balances the surface force:

$$h = \\frac{2\\gamma\\cos\\theta}{\\rho g r}$$

Water rises about 3 cm in a tube of 0.5 mm radius and 15 cm in one of 0.1 mm; mercury, with a contact angle near 140°, is pushed *down*. Capillary action wicks water into paper, soil, towels and concrete, and helps (though does not alone explain) how water reaches the top of trees. The curved surface of a small drop also squeezes its contents: the pressure inside exceeds the outside by $2\\gamma/r$, 1.4 atm for a water droplet of radius 1 µm.

### Viscosity
**Viscosity** $\\eta$ is a liquid's resistance to flow ([[physics:viscosity]]). Molecules that hold on to one another, or long molecules that tangle, flow slowly:

| Liquid (20 °C) | water | ethanol | olive oil | glycerol | honey |
|---|---|---|---|---|---|
| $\\eta$ (mPa·s) | 1.00 | 1.2 | 84 | 1410 | 2000–10 000 |

Glycerol, with three OH groups per molecule, is over a thousand times more viscous than water. Heating makes molecules jump past their neighbours more easily, so viscosity falls steeply with temperature, roughly as $e^{E_a/RT}$: water drops from 1.79 mPa·s at 0 °C to 0.28 at 100 °C. A plain mineral oil can thicken a hundredfold between a hot engine and a frosty morning; **multigrade** oils (5W-30 and the like) contain polymers that uncoil when hot and partly offset the thinning.
`,
  ideas: [
    'Surface molecules are pulled inwards, so liquids minimise their surface area; surface tension is the energy per unit area of surface.',
    'Stronger intermolecular forces mean higher surface tension and higher viscosity.',
    'A liquid wets a solid and climbs a narrow tube when adhesion beats cohesion; capillary rise is h = 2γcosθ/(ρgr).',
    'Surfactants gather at the surface and lower surface tension.',
    'Viscosity falls steeply as temperature rises.'
  ],
  pitfalls: [
    'Surface tension is a separate "skin" of different material — It is the same liquid; the surface molecules simply have unbalanced forces and higher energy.',
    'Dense liquids are always more viscous — Mercury is 13.5 times denser than water but only about 1.5 times more viscous; glycerol is barely denser than water but a thousand times more viscous.',
    'Viscosity rises with temperature, as it does for gases — For liquids it falls: the molecules escape their neighbours more easily. (Gas viscosity does rise with temperature, for a different reason.)'
  ],
  formulas: [
    {
      name: 'Capillary rise',
      expr: 'h = 2*gamma*cos(theta)/(rho*g*r)', tex: 'h = \\frac{2\\gamma\\cos\\theta}{\\rho g r}',
      vars: {
        h: { name: 'height of rise (negative: depression)', q: 'length', unit: 'mm', signed: true },
        gamma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.8, tex: '\\gamma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 0, min: 0, max: 180, tex: '\\theta' },
        rho: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 998, tex: '\\rho' },
        g: { const: 'g' },
        r: { name: 'radius of the tube', q: 'length', unit: 'mm', value: 0.5 }
      },
      solveFor: 'h',
      note: 'Defaults: water in clean glass at 20 °C. For mercury in glass use 486 mN/m, about 140° and 13 534 kg/m³: the level is pushed down.',
      stories: {
        h: 'How high does water ($\\gamma$ = {gamma}, contact angle {theta}, density {rho}) rise in a glass capillary of radius {r}?',
        r: 'Water ($\\gamma$ = {gamma}, contact angle {theta}, density {rho}) rises {h} in a capillary. What is the radius of the tube?'
      }
    },
    {
      name: 'Pressure inside a small drop (Laplace)',
      expr: 'dP = 2*gamma/r', tex: '\\Delta P = \\frac{2\\gamma}{r}',
      vars: {
        dP: { name: 'excess pressure inside', q: 'pressure', unit: 'kPa', tex: '\\Delta P' },
        gamma: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72, tex: '\\gamma' },
        r: { name: 'radius of the drop', q: 'length', unit: 'µm', value: 1 }
      },
      note: 'Small drops are squeezed hard. The same excess pressure makes small drops evaporate faster than large ones and lets tiny bubbles dissolve.',
      stories: {
        dP: 'What is the excess pressure inside a water droplet ($\\gamma$ = {gamma}) of radius {r}?',
        r: 'For what radius does the pressure inside a water droplet ($\\gamma$ = {gamma}) exceed the outside by {dP}?'
      }
    },
    {
      name: 'Viscosity at another temperature',
      expr: 'eta = eta1*exp(Ea/R*(1/T - 1/T1))', tex: '\\eta = \\eta_1\\,\\exp\\!\\left[\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_1}\\right)\\right]',
      vars: {
        eta: { name: 'viscosity at T', q: 'viscosity', unit: 'mPa·s', tex: '\\eta' },
        eta1: { name: 'viscosity at T₁', q: 'viscosity', unit: 'mPa·s', value: 0.890, tex: '\\eta_1' },
        Ea: { name: 'activation energy for flow', q: 'molarenergy', unit: 'kJ/mol', value: 15.2, tex: 'E_a' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 60 },
        T1: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' }
      },
      solveFor: 'eta',
      note: 'An Arrhenius-like fit, fine over a few tens of degrees. For water $E_a$ is about 15 kJ/mol near 25–60 °C (it rises in the cold). Defaults: water from 25 °C (0.890 mPa·s) to 60 °C (measured 0.467).',
      stories: {
        eta: 'Water has a viscosity of {eta1} at {T1}. Taking $E_a$ = {Ea}, estimate its viscosity at {T}.',
        Ea: 'A liquid\'s viscosity is {eta1} at {T1} and {eta} at {T}. What is the activation energy for flow?'
      }
    }
  ],
  examples: [
    {
      title: 'Water and mercury in a capillary',
      q: 'Compare the level change in a glass capillary of radius 0.50 mm for water ($\\gamma$ = 72.8 mN/m, $\\theta$ = 0°, 998 kg/m³) and mercury ($\\gamma$ = 486 mN/m, $\\theta$ = 140°, 13 534 kg/m³).',
      steps: [
        { text: 'Water:', tex: 'h = \\frac{2 \\times 0.0728 \\times \\cos 0^{\\circ}}{998 \\times 9.81 \\times 0.00050} = 0.0297\\ \\mathrm{m} = 29.7\\ \\mathrm{mm}' },
        { text: 'Mercury:', tex: 'h = \\frac{2 \\times 0.486 \\times \\cos 140^{\\circ}}{13\\,534 \\times 9.81 \\times 0.00050} = -0.0112\\ \\mathrm{m}' },
        'Water climbs 30 mm; mercury is pushed 11 mm below the outside level. That is why mercury barometers and thermometers use wide bores, or read the top of a convex meniscus.'
      ],
      a: 'Water rises 29.7 mm; mercury falls 11.2 mm.'
    },
    {
      title: 'Hot water flows more easily',
      q: 'Water\'s viscosity is 0.890 mPa·s at 25 °C and 0.467 mPa·s at 60 °C. What activation energy for flow does that imply, and what does the same fit predict at 0 °C (measured: 1.79 mPa·s)?',
      steps: [
        { text: 'From the two points:', tex: 'E_a = \\frac{R\\,\\ln(\\eta_1/\\eta)}{1/T_1 - 1/T} = \\frac{8.314 \\times \\ln(0.890/0.467)}{1/298.15 - 1/333.15} = 15.2\\ \\mathrm{kJ/mol}' },
        { text: 'Extrapolate to 273.15 K:', tex: '\\eta = 0.890\\,\\exp\\!\\left[\\frac{15\\,200}{8.314}\\left(\\frac{1}{273.15} - \\frac{1}{298.15}\\right)\\right] = 1.56\\ \\mathrm{mPa\\cdot s}' },
        'The fit falls short of the measured 1.79 mPa·s: near freezing, hydrogen-bonded clusters make cold water stickier than a single activation energy can describe.'
      ],
      a: 'About 15 kJ/mol; the fit gives 1.56 mPa·s at 0 °C, below the real 1.79.'
    }
  ],
  quiz: [
    { q: 'Why do small drops of liquid take a spherical shape?', choices: ['gravity pulls them into spheres', 'a sphere has the least surface for its volume, and surface costs energy', 'the molecules repel one another', 'air pressure squeezes them'], a: 1,
      why: 'Surface molecules have higher energy, so the liquid minimises its area. For small drops surface forces beat gravity; big drops flatten under their weight.' },
    { q: 'Water forms a concave meniscus in glass, mercury a convex one. The difference is that…', choices: ['mercury is denser', 'water\'s adhesion to glass beats its cohesion; mercury\'s cohesion beats its adhesion', 'mercury is a metal and conducts', 'water has a lower surface tension'], a: 1,
      why: 'The shape of the meniscus is set by the balance between the liquid\'s attraction to itself and to the wall, not by density.' },
    { q: 'The viscosity of a liquid rises as it is heated.', a: false,
      why: 'Liquids flow more easily when hot: warmer molecules slip past their neighbours more readily. Water\'s viscosity falls six-fold from 0 °C to 100 °C.' },
    { q: 'Which liquid is the most viscous at room temperature?', choices: ['water', 'ethanol', 'glycerol', 'hexane'], a: 2,
      why: 'Glycerol, $\\ce{C3H5(OH)3}$, forms three hydrogen bonds per molecule and a sticky network: about 1.4 Pa·s, over a thousand times water.' },
    { q: 'How high (in mm) does water ($\\gamma$ = 72.8 mN/m, $\\theta$ = 0°, 998 kg/m³) rise in a glass tube of radius 0.10 mm?', answer: 148.8, unit: 'mm',
      why: '$h = 2 \\times 0.0728/(998 \\times 9.81 \\times 1.0 \\times 10^{-4}) = 0.149$ m — five times the rise in a 0.5 mm tube, because $h \\propto 1/r$.' }
  ],
  applications: ['Detergents, emulsifiers and wetting agents.', 'Ink-jet printing, spraying and coating.', 'Lubricants and multigrade motor oils.', 'Capillary action in soils, paper, textiles and building materials.', 'Lung surfactant, without which the alveoli would collapse.'],
  history: 'Thomas Young and Pierre-Simon Laplace worked out the mechanics of surface tension and capillarity around 1805. Agnes Pockels, working at her kitchen sink in the 1880s, invented the trough for measuring surface films that Irving Langmuir later developed.'
}

);
