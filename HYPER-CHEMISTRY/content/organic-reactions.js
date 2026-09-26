/* HYPER-CHEMISTRY · content/organic-reactions.js — how organic reactions happen:
 * curly arrows, substitution, elimination, addition, carbonyl chemistry, acids and
 * esters, and polymers. */
Hyper.add(

{
  id: 'reaction-mechanisms-organic', parent: 'organic-reactions', title: 'Curly arrows: how organic reactions happen', level: 2,
  short: 'Organic reactions are electrons on the move: a pair flows from where there are plenty — a lone pair, a π bond — to an atom that lacks them. Curly arrows track each pair, and the short-lived intermediates they create, carbocations and radicals, decide the products.',
  keywords: ['mechanism', 'curly arrow', 'nucleophile', 'electrophile', 'heterolytic fission', 'homolytic fission', 'radical', 'free radical', 'carbocation', 'carbanion', 'intermediate', 'transition state', 'rate-determining step', 'inductive effect', 'hyperconjugation', 'chain reaction', 'initiation', 'propagation', 'termination', 'chlorination of methane', 'ozone depletion'],
  prereq: ['functional-groups', 'bond-polarity', 'lewis-structures', 'reaction-mechanisms'],
  related: ['nucleophilic-substitution', 'addition-alkenes', 'elimination', 'bond-enthalpies', 'arrhenius-equation', 'acid-base-definitions'],
  body: `
A balanced equation tells you what goes in and what comes out. A **mechanism** tells you how: which bonds break, which form, in what order, and where every electron goes. Organic chemistry has millions of reactions but only a handful of mechanisms, so learning them is the shortcut to predicting products you have never seen.

### Two ways to break a bond
A covalent bond is a shared pair of electrons, and it can come apart in two ways.
- **Homolytic** fission: each atom keeps one electron, giving two **radicals** — neutral species with an unpaired electron, written with a dot. $\\ce{Cl2 ->[UV] 2Cl.}$ Non-polar bonds, light, heat and the gas phase favour it.
- **Heterolytic** fission: one atom takes both electrons, giving ions. $\\ce{(CH3)3CBr -> (CH3)3C+ + Br-}$. Polar bonds in polar solvents favour it.

### Nucleophiles and electrophiles
Most organic reactions pair an electron-rich species with an electron-poor one.
- A **nucleophile** ("nucleus-loving") donates an electron pair: $\\ce{OH-}$, $\\ce{CN-}$, halide ions, $\\ce{H2O}$ and $\\ce{NH3}$ with their lone pairs, and the π bond of an alkene.
- An **electrophile** accepts one: $\\ce{H+}$, the δ+ carbon of a C–Br or C=O bond, carbocations, the polarised end of $\\ce{Br2}$, the nitronium ion $\\ce{NO2+}$.

They are the organic names for [[acid-base-definitions|Lewis bases and Lewis acids]].

### Curly arrows
A curly arrow shows **one pair of electrons** moving.
1. It starts at the electrons — a lone pair or a bond — never at a positive charge or at an atom as such.
2. It ends where the pair goes: on an atom (a new lone pair) or between two atoms (a new bond).
3. Atoms of the second period cannot exceed eight electrons: if a new bond forms to a carbon that already has four, one of its bonds must break in the same step.
4. Charges must balance on both sides.

For hydroxide and bromomethane, one arrow runs from a lone pair on O to the carbon, and a second from the C–Br bond to the bromine, which leaves as $\\ce{Br-}$. A half-headed "fishhook" arrow moves a single electron, in radical reactions.

### Intermediates and transition states
A reaction profile is a landscape. A **transition state** is a peak: a fleeting arrangement with bonds half made and half broken that lasts about one molecular vibration and can never be bottled. An **intermediate** is a valley between peaks — a real species with a finite lifetime, such as a carbocation or a radical. The highest peak is the **rate-determining step** ([[reaction-mechanisms]]).

**Carbocations** are flat (sp²) with an empty p orbital. Alkyl groups stabilise them by pushing electron density towards the positive carbon (the inductive effect) and by letting neighbouring C–H bonds overlap with the empty orbital (**hyperconjugation**), so

$$\\text{tertiary} > \\text{secondary} > \\text{primary} > \\text{methyl}$$

Radicals follow the same order, less steeply. Because the transition state leading to an intermediate resembles it, a more stable intermediate forms faster — the key to [[addition-alkenes|Markovnikov's rule]] and to [[nucleophilic-substitution|SN1]].

### A radical chain: chlorinating methane
In ultraviolet light methane and chlorine react by a **chain**:
- **Initiation**: $\\ce{Cl2 -> 2Cl.}$ (light supplies the 243 kJ/mol of the Cl–Cl bond).
- **Propagation**: $\\ce{Cl. + CH4 -> HCl + CH3.}$ then $\\ce{CH3. + Cl2 -> CH3Cl + Cl.}$ — the chlorine atom comes back, so one photon can start thousands of cycles.
- **Termination**: two radicals meet, $\\ce{Cl. + CH3. -> CH3Cl}$ or $\\ce{2CH3. -> C2H6}$ — traces of ethane in the product are the fingerprint of this step.

Bond enthalpies give the energy of each step: breaking C–H (439) and Cl–Cl (243), making H–Cl (432) and C–Cl (351) releases 101 kJ/mol overall. Further substitution gives $\\ce{CH2Cl2}$, $\\ce{CHCl3}$ and $\\ce{CCl4}$ as well. In larger alkanes a chlorine atom takes a tertiary hydrogen about five times as readily as a primary one; a bromine atom is far choosier.

The same chain chemistry happens high in the atmosphere: ultraviolet light splits chlorofluorocarbons, and each chlorine atom destroys thousands of ozone molecules ($\\ce{Cl. + O3 -> ClO. + O2}$, $\\ce{ClO. + O -> Cl. + O2}$) before it is locked away. That is why CFCs were phased out under the Montreal Protocol of 1987, and why the ozone layer is now slowly recovering.
`,
  ideas: [
    'A mechanism shows which bonds break and form, in what order, with curly arrows for moving electron pairs.',
    'Nucleophiles donate an electron pair; electrophiles accept one.',
    'Homolytic fission gives radicals; heterolytic fission gives ions.',
    'Intermediates (valleys) can be detected; transition states (peaks) cannot. The highest barrier sets the rate.',
    'Carbocations and radicals are stabilised by alkyl groups: tertiary > secondary > primary > methyl.'
  ],
  pitfalls: [
    'Curly arrows show atoms moving — They show electron pairs moving; atoms follow their electrons. An arrow must start at a lone pair or a bond.',
    'An intermediate and a transition state are the same thing — An intermediate sits in an energy valley and has a real lifetime; a transition state is the top of a barrier and exists only for an instant.',
    'A radical is a kind of ion — A radical is usually neutral; what makes it reactive is its unpaired electron.'
  ],
  formulas: [
    {
      name: 'Enthalpy change from bond enthalpies',
      expr: 'dH = Eb - Ef', tex: '\\Delta H = \\sum E_{\\text{broken}} - \\sum E_{\\text{formed}}',
      vars: {
        dH: { name: 'enthalpy change of the reaction', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H' },
        Eb: { name: 'total energy of the bonds broken', q: 'molarenergy', unit: 'kJ/mol', value: 682, tex: 'E_{\\text{broken}}' },
        Ef: { name: 'total energy of the bonds formed', q: 'molarenergy', unit: 'kJ/mol', value: 783, tex: 'E_{\\text{formed}}' }
      },
      note: 'Defaults: $\\ce{CH4 + Cl2 -> CH3Cl + HCl}$, breaking C–H (439) and Cl–Cl (243), forming C–Cl (351) and H–Cl (432) kJ/mol. With average bond enthalpies the result is an estimate.',
      practice: { unknowns: ['dH', 'Ef'] },
      stories: {
        dH: 'A step breaks bonds worth {Eb} and forms bonds worth {Ef}. What is its enthalpy change?',
        Ef: 'A reaction breaks bonds worth {Eb} and has ΔH = {dH}. How much bond energy is released in the bonds formed?'
      }
    },
    {
      name: 'Product share in radical halogenation',
      expr: 'f = na*ra/(na*ra + nb*rb)', tex: 'f_a = \\frac{n_a r_a}{n_a r_a + n_b r_b}',
      vars: {
        f: { name: 'share of product from hydrogens of type a', q: 'ratio', unit: '%', tex: 'f_a' },
        na: { name: 'number of hydrogens of type a', int: true, value: 2, tex: 'n_a' },
        ra: { name: 'reactivity of each type-a hydrogen (relative)', value: 3.8, tex: 'r_a' },
        nb: { name: 'number of hydrogens of type b', int: true, value: 6, tex: 'n_b' },
        rb: { name: 'reactivity of each type-b hydrogen (relative)', value: 1, tex: 'r_b' }
      },
      note: 'Each product forms in proportion to the number of hydrogens that lead to it times how reactive each one is. Defaults: chlorinating propane at 25 °C (2 secondary H at 3.8, 6 primary H at 1), giving 56 % 2-chloropropane. For bromine at 125 °C secondary hydrogens are about 80 times as reactive as primary.',
      practice: { unknowns: ['f', 'ra'] },
      stories: {
        f: 'An alkane has {na} hydrogens of one kind, each {ra} times as reactive as its {nb} hydrogens of the other kind (reactivity {rb}). What share of the monochlorinated product comes from the first kind?',
        ra: 'Chlorinating an alkane with {na} secondary and {nb} primary hydrogens gives {f} of the secondary product. How reactive is a secondary hydrogen compared with a primary one (reactivity {rb})?'
      }
    }
  ],
  examples: [
    {
      title: 'The energy of a chain',
      q: 'Using C–H 439, Cl–Cl 243, H–Cl 432 and C–Cl 351 kJ/mol, find ΔH for each propagation step of the chlorination of methane, and overall.',
      steps: [
        'Step 1, $\\ce{Cl. + CH4 -> HCl + CH3.}$: break C–H, make H–Cl: $439 - 432 = +7$ kJ/mol.',
        'Step 2, $\\ce{CH3. + Cl2 -> CH3Cl + Cl.}$: break Cl–Cl, make C–Cl: $243 - 351 = -108$ kJ/mol.',
        'The two steps add to the overall equation $\\ce{CH4 + Cl2 -> CH3Cl + HCl}$: $7 - 108 = -101$ kJ/mol.',
        'The first step is nearly thermoneutral, the second strongly downhill — and the chlorine atom that starts step 1 is made again by step 2.'
      ],
      a: '+7 and −108 kJ/mol; −101 kJ/mol overall.'
    },
    {
      title: 'Chlorine or bromine?',
      q: 'Propane has six primary and two secondary hydrogens. A chlorine atom attacks a secondary H 3.8 times as fast as a primary one; a bromine atom about 82 times. Predict the share of 2-halopropane in each case.',
      steps: [
        'Chlorine: $\\dfrac{2 \\times 3.8}{2 \\times 3.8 + 6 \\times 1} = \\dfrac{7.6}{13.6} = 0.56$.',
        'Bromine: $\\dfrac{2 \\times 82}{2 \\times 82 + 6} = \\dfrac{164}{170} = 0.965$.',
        'Bromination is slower but much more selective: its hydrogen-removing step is uphill, so its transition state feels the difference between secondary and primary radicals much more.'
      ],
      a: 'About 56 % 2-chloropropane but 97 % 2-bromopropane.'
    }
  ],
  quiz: [
    { q: 'Which of these is a nucleophile?', choices: ['$\\ce{NH3}$', '$\\ce{H+}$', '$\\ce{CH3+}$', '$\\ce{AlCl3}$'], a: 0,
      why: 'Ammonia has a lone pair to donate. H⁺, a carbocation and AlCl₃ all lack electrons: they are electrophiles.' },
    { q: 'Where must a curly arrow start?', choices: ['at a positive charge', 'at the atom that will move', 'at a lone pair or a bond', 'at the electrophile'], a: 2,
      why: 'An arrow shows a pair of electrons moving, so it starts where that pair is: a lone pair or a bond. It points towards the electrophile.' },
    { q: 'Which carbocation is the most stable?', choices: ['$\\ce{CH3+}$', '$\\ce{CH3CH2+}$', '$\\ce{(CH3)2CH+}$', '$\\ce{(CH3)3C+}$'], a: 3,
      why: 'Three methyl groups donate electron density to the positive carbon by induction and hyperconjugation: tertiary is most stable, methyl least.' },
    { q: 'Using Cl–Cl 243 and C–Cl 351 kJ/mol, what is ΔH (kJ/mol) for $\\ce{CH3. + Cl2 -> CH3Cl + Cl.}$?', answer: -108, unit: 'kJ/mol',
      why: 'Break Cl–Cl (+243), form C–Cl (−351): 243 − 351 = −108 kJ/mol.' },
    { q: 'Cooled quickly enough, the transition state of a reaction could be isolated and studied in a bottle.', a: false,
      why: 'A transition state is an energy maximum: it lasts about one vibration (~10⁻¹³ s) and falls to one side or the other. Intermediates, in energy minima, can sometimes be trapped or detected.' }
  ],
  applications: ['Designing syntheses: chemists plan routes by pushing curly arrows on paper.', 'Ozone depletion by chlorine radicals from CFCs, and its reversal after the Montreal Protocol.', 'Rancid fats and drying paints are radical chain reactions with oxygen; antioxidants such as vitamin E stop the chains.', 'Radical polymerisation makes poly(ethene), PVC and polystyrene.'],
  history: 'Robert Robinson and Christopher Ingold developed the curly-arrow notation and the electronic theory of organic reactions in the 1920s and 1930s; Ingold named nucleophiles, electrophiles and the SN1 and SN2 mechanisms.',
  sim: 'org-markovnikov'
},

{
  id: 'nucleophilic-substitution', parent: 'organic-reactions', title: 'Nucleophilic substitution: SN1 and SN2', level: 2,
  short: 'A nucleophile replaces a leaving group on a saturated carbon. SN2 does it in one step from the back, inverting the carbon, and is fastest on uncrowded carbons; SN1 goes through a flat carbocation, favoured by tertiary substrates and polar protic solvents.',
  keywords: ['nucleophilic substitution', 'SN1', 'SN2', 'haloalkane', 'halogenoalkane', 'alkyl halide', 'leaving group', 'backside attack', 'Walden inversion', 'inversion of configuration', 'racemisation', 'carbocation', 'solvolysis', 'hydrolysis', 'steric hindrance', 'polar aprotic solvent', 'polar protic solvent', 'unimolecular', 'bimolecular', 'silver nitrate test'],
  prereq: ['reaction-mechanisms-organic', 'rate-laws', 'stereoisomers'],
  related: ['elimination', 'functional-groups', 'integrated-rate-laws', 'reaction-half-life', 'arrhenius-equation', 'carboxylic-acids-esters'],
  body: `
In a haloalkane the carbon–halogen bond is polar: the carbon is δ+, and the halogen can leave as a stable halide ion. A nucleophile can therefore swap itself in:

$$\\ce{Nu- + R-X -> R-Nu + X-}$$

This one pattern makes alcohols ($\\ce{OH-}$), nitriles ($\\ce{CN-}$, adding one carbon to the chain), amines ($\\ce{NH3}$) and ethers (alkoxide ions) from haloalkanes, and it is how many drugs, pesticides and dyes are assembled.

### The leaving group
A good leaving group is a weak base, stable on its own with the electrons it takes away. For the halogens, $\\ce{I-} > \\ce{Br-} > \\ce{Cl-} \\gg \\ce{F-}$: the carbon–halogen bond weakens down the group (C–F 467, C–Cl 346, C–Br 290, C–I 228 kJ/mol), and fluoroalkanes hardly react at all. Warm haloalkanes with aqueous silver nitrate and the halide precipitates as it is released: yellow AgI appears first, then cream AgBr, then, slowly, white AgCl. $\\ce{OH-}$ is a poor leaving group, so alcohols need acid first: protonated, the –OH leaves as water ($\\ce{ROH + HBr -> RBr + H2O}$).

### SN2: one step, from the back
The nucleophile attacks the carbon on the side **opposite** the leaving group, and as the new bond forms the old one breaks. In the transition state the carbon is flat, with five partial bonds; the three other groups then flip through like an umbrella turning inside out in the wind. The carbon's configuration is **inverted** (Walden inversion): (R)-2-bromobutane with iodide gives (S)-2-iodobutane.

Both reactants are in the one step, so the rate law is second order ("S" substitution, "N" nucleophilic, "2" bimolecular):

$$\\text{rate} = k\\,[\\ce{RX}]\\,[\\ce{Nu}]$$

Crowding around the carbon blocks the back-side approach. Relative SN2 rates run roughly methyl 30 : ethyl 1 : isopropyl 0.03 : tert-butyl ≈ 0. Strong, negatively charged nucleophiles help, and so do **polar aprotic** solvents such as propanone or DMSO: they dissolve salts but cannot hydrogen-bond to the anion, which is left "naked" and reactive.

### SN1: the leaving group goes first
A tertiary haloalkane cannot be attacked from behind — but it can ionise. The C–X bond breaks on its own to give a **carbocation** (slow), which any nucleophile then captures (fast). Only the substrate is in the slow step, so

$$\\text{rate} = k\\,[\\ce{RX}]$$

— first order, whatever the concentration of nucleophile ("1" for unimolecular). Anything that stabilises the carbocation speeds SN1: tertiary > secondary ≫ primary, and **polar protic** solvents (water, alcohols) that surround the ions with hydrogen bonds. The nucleophile can be weak — often the solvent itself (**solvolysis**): 2-bromo-2-methylpropane in water gives 2-methylpropan-2-ol. The flat cation is attacked from both faces, so a chiral substrate gives both enantiomers, usually with a small excess of inversion because the departing halide briefly shields the front face. Carbocations can also rearrange to more stable ones, and lose $\\ce{H+}$ instead ([[elimination|E1]]).

### Which one?

| Substrate | SN2 | SN1 |
|---|---|---|
| methyl, primary | yes, readily | no (cation too unstable) |
| secondary | with strong nucleophiles, aprotic solvents | with weak nucleophiles, protic solvents |
| tertiary | no (too crowded) | yes; elimination competes |

### In living things and medicine
Cells methylate DNA, hormones and neurotransmitters by SN2 reactions of S-adenosylmethionine, nature's methyl donor. Many anticancer drugs of the first generation, the nitrogen mustards, work by alkylating the bases of DNA through substitution, which stops fast-dividing cells from copying it. Bromomethane was used for decades to fumigate soil; its bromine atoms damage the ozone layer, and it has been phased out.
`,
  ideas: [
    'A nucleophile replaces a leaving group on an sp³ carbon; weak bases (I⁻, Br⁻) are the best leaving groups.',
    'SN2 is one step with back-side attack: rate = k[RX][Nu], configuration inverted, fastest for methyl and primary carbons.',
    'SN1 goes through a carbocation: rate = k[RX], independent of the nucleophile, favoured by tertiary substrates and protic solvents.',
    'SN1 at a stereocentre gives both enantiomers (racemisation, with a little extra inversion).',
    'Polar aprotic solvents speed SN2; polar protic solvents speed SN1.'
  ],
  pitfalls: [
    'The "1" in SN1 means first order in the nucleophile — It means one species (the substrate) in the rate-determining step; the rate does not depend on the nucleophile at all.',
    'Inversion always turns R into S — Inversion is a change of geometry. The label changes only if the new group takes the old group\'s place in the priority order; it often does, but check.',
    'Tertiary haloalkanes are unreactive because they are crowded — They are blocked for SN2 but react fast by SN1 and elimination.'
  ],
  formulas: [
    {
      name: 'SN2 rate',
      expr: 'r = k*A*B', tex: '\\text{rate} = k\\,\\text{[RX]}\\,\\text{[Nu]}',
      vars: {
        r: { name: 'rate of reaction', q: 'reactionrate', unit: 'M/s', tex: '\\text{rate}' },
        k: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·s)', value: 2.0e-3 },
        A: { name: 'concentration of the haloalkane', q: 'concentration', unit: 'M', value: 0.10, tex: '\\text{[RX]}' },
        B: { name: 'concentration of the nucleophile', q: 'concentration', unit: 'M', value: 0.20, tex: '\\text{[Nu]}' }
      },
      note: 'Doubling either concentration doubles the rate. Default k is typical of a primary bromoalkane with hydroxide at room temperature.',
      practice: { unknowns: ['r', 'k'] },
      stories: {
        r: 'A primary bromoalkane at {A} reacts with a nucleophile at {B} by SN2 with k = {k}. What is the initial rate?',
        k: 'At {A} of haloalkane and {B} of nucleophile, an SN2 reaction runs at {r}. What is the rate constant?'
      }
    },
    {
      name: 'SN1 rate',
      expr: 'r = k*A', tex: '\\text{rate} = k\\,\\text{[RX]}',
      vars: {
        r: { name: 'rate of reaction', q: 'reactionrate', unit: 'M/s', tex: '\\text{rate}' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/s', value: 1.1e-3 },
        A: { name: 'concentration of the haloalkane', q: 'concentration', unit: 'M', value: 0.10, tex: '\\text{[RX]}' }
      },
      note: 'The nucleophile does not appear. Default: a tertiary bromoalkane solvolysing in aqueous solution.',
      practice: { unknowns: ['r', 'A'] },
      stories: { r: 'A tertiary haloalkane at {A} ionises with k = {k}. What is the rate of the SN1 reaction?' }
    },
    {
      name: 'Half-life of a first-order substitution',
      expr: 't = ln(2)/k', tex: 't_{1/2} = \\frac{\\ln 2}{k}',
      vars: {
        t: { name: 'half-life of the haloalkane', q: 'time', unit: 's', tex: 't_{1/2}' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/s', value: 1.1e-3 }
      },
      note: 'Valid for SN1, and for SN2 when the nucleophile is in large excess (then $k = k_2[\\ce{Nu}]$). See [[reaction-half-life]].',
      practice: { unknowns: ['t', 'k'] },
      stories: { t: 'A haloalkane is hydrolysed by SN1 with k = {k}. What is its half-life?', k: 'Half of a tertiary haloalkane has reacted after {t}. What is the first-order rate constant?' }
    }
  ],
  examples: [
    {
      title: 'Which rate changes?',
      q: 'Bromoethane reacts with hydroxide by SN2; 2-bromo-2-methylpropane by SN1. What happens to each initial rate if [OH⁻] is doubled, and if [RBr] is doubled?',
      steps: [
        'SN2: rate = k[RBr][OH⁻]. Doubling either concentration doubles the rate.',
        'SN1: rate = k[RBr]. Doubling [RBr] doubles the rate; doubling [OH⁻] changes nothing, because hydroxide only captures the carbocation after the slow step.',
        'This is exactly how the two mechanisms were told apart by Hughes and Ingold in the 1930s.'
      ],
      a: 'Bromoethane: both double the rate. 2-Bromo-2-methylpropane: only [RBr] matters.'
    },
    {
      title: 'Predicting the stereochemistry',
      q: '(R)-2-bromobutane is heated with sodium iodide in propanone. What is the product?',
      steps: [
        'A secondary substrate, a strong nucleophile and a polar aprotic solvent: SN2.',
        'Iodide attacks from the back, and the carbon inverts.',
        'Priorities before: Br > CH₂CH₃ > CH₃ > H; after: I > CH₂CH₃ > CH₃ > H. The new group takes the top priority, as bromine did, so inverting the geometry also swaps the label.',
        'Sodium bromide is insoluble in propanone and precipitates, pulling the reaction to completion.'
      ],
      a: '(S)-2-iodobutane.'
    },
    {
      title: 'How long does hydrolysis take?',
      q: 'A tertiary chloroalkane solvolyses in aqueous ethanol with $k = 1.1 \\times 10^{-3}\\ \\mathrm{s^{-1}}$. What is its half-life, and how long until 90 % has reacted?',
      steps: [
        { text: 'Half-life:', tex: 't_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{1.1 \\times 10^{-3}} = 630\\ \\mathrm{s} \\approx 10.5\\ \\mathrm{min}' },
        'For 90 %: $[\\ce{RX}]/[\\ce{RX}]_0 = 0.1$, so $t = \\ln 10 / k = 2.303/1.1 \\times 10^{-3} = 2090$ s, about 35 minutes (a little over three half-lives).'
      ],
      a: 'About 10.5 min; 90 % after about 35 min.'
    }
  ],
  quiz: [
    { q: 'For an SN1 reaction, doubling the concentration of the nucleophile…', choices: ['doubles the rate', 'halves the rate', 'leaves the rate unchanged', 'quadruples the rate'], a: 2,
      why: 'The rate-determining step is the ionisation of the haloalkane alone; the nucleophile joins afterwards, in a fast step.' },
    { q: 'Which reacts fastest with cyanide ions by SN2?', choices: ['$\\ce{CH3Br}$', '$\\ce{CH3CH2Br}$', '$\\ce{(CH3)2CHBr}$', '$\\ce{(CH3)3CBr}$'], a: 0,
      why: 'SN2 needs a clear path to the back of the carbon. Each extra alkyl group crowds it; the tertiary compound does not react by SN2 at all.' },
    { q: 'SN2 attack of hydroxide on (S)-2-bromobutane gives (R)-butan-2-ol.', a: true,
      why: 'The carbon is inverted. OH takes the top priority that Br had (O > C > C > H with the same order of the other groups), so the inverted geometry is labelled R.' },
    { q: 'Which is the best leaving group?', choices: ['$\\ce{F-}$', '$\\ce{Cl-}$', '$\\ce{I-}$', '$\\ce{OH-}$'], a: 2,
      why: 'Iodide is the weakest base of these and the C–I bond is the weakest, so it leaves most easily. Fluoride and hydroxide are poor leaving groups.' },
    { q: 'Why do polar aprotic solvents such as DMSO speed up SN2 reactions of anions?', choices: ['they stabilise carbocations', 'they do not hydrogen-bond to the anion, leaving it more reactive', 'they are more viscous', 'they react with the leaving group'], a: 1,
      why: 'Protic solvents wrap anions in hydrogen bonds that must be shed before attack. Aprotic solvents solvate the cation but leave the anion bare.' }
  ],
  applications: ['Making alcohols, ethers, nitriles and amines from haloalkanes in synthesis.', 'Biological methylation by S-adenosylmethionine.', 'Alkylating anticancer drugs that damage DNA.', 'The silver nitrate test that identifies chloro-, bromo- and iodoalkanes.'],
  history: 'Paul Walden discovered in 1896 that substitution can turn a compound into its mirror image. Edward Hughes and Christopher Ingold measured the rates and stereochemistry in the 1930s and named the SN1 and SN2 mechanisms.',
  sim: 'org-sn1-sn2'
},

{
  id: 'elimination', parent: 'organic-reactions', title: 'Elimination reactions', level: 2,
  short: 'In an elimination a small molecule — HBr, H₂O — is removed from neighbouring carbons and a double bond forms. It competes with substitution; strong bases, crowded substrates and heat tip the balance towards elimination.',
  keywords: ['elimination', 'E1', 'E2', 'dehydrohalogenation', 'dehydration', 'Zaitsev rule', 'Saytzeff', 'Hofmann product', 'anti-periplanar', 'beta hydrogen', 'base', 'alkene synthesis', 'potassium tert-butoxide', 'substitution against elimination', 'bioethanol', 'green polyethylene'],
  prereq: ['nucleophilic-substitution', 'hydrocarbons', 'acid-base-definitions'],
  related: ['addition-alkenes', 'gibbs-temperature', 'entropy', 'carbon-bonding', 'polymers'],
  body: `
Hydroxide ions can do two different jobs. As a **nucleophile**, an $\\ce{OH-}$ attacks carbon and substitutes. As a **base**, it pulls off a hydrogen ion — and if that hydrogen sits on the carbon next to the one carrying the leaving group (the β-carbon), the electrons of the C–H bond swing in to make a C=C double bond as the leaving group departs. That is an **elimination**:

$$\\ce{CH3CHBrCH3 + OH- -> CH2=CHCH3 + H2O + Br-}$$

Warm 2-bromopropane with dilute aqueous hydroxide and you get mostly propan-2-ol; heat it with concentrated potassium hydroxide in ethanol and you get mostly propene. The reagent is the same; the conditions decide.

### E2: one step
The base removes the β-hydrogen, the π bond forms and the leaving group goes, all at once. Both the substrate and the base are in the step: rate = k[RX][base]. The orbitals line up best when the H and the leaving group are **anti-periplanar** — on opposite sides, 180° apart, as in the anti conformation of butane ([[carbon-bonding]]). In a cyclohexane ring this means both must be axial.

### E1: through a carbocation
The first step is the same as in SN1: the leaving group departs, giving a carbocation. Then, instead of capturing a nucleophile, the cation loses a neighbouring $\\ce{H+}$. Rate = k[RX]. E1 dominates for tertiary substrates with weak bases and heat, and it is how alcohols are **dehydrated** with concentrated sulfuric or phosphoric acid: the acid turns –OH into $\\ce{-OH2+}$, which leaves as water. Cyclohexanol gives cyclohexene; ethanol over hot alumina or acid gives ethene — in Brazil, "green" poly(ethene) is made from sugar-cane ethanol this way.

### Which alkene? Zaitsev's rule
When there is more than one kind of β-hydrogen, the major product is usually the **more substituted** alkene, which is the more stable. Heats of hydrogenation show the order: but-1-ene releases 127 kJ/mol, cis-but-2-ene 120, trans-but-2-ene 116 — the less released, the more stable the alkene was. So 2-bromobutane with ethoxide gives mainly but-2-ene (largely trans), with a minority of but-1-ene.

A bulky base such as potassium tert-butoxide changes this. It cannot reach the hydrogens inside the molecule and takes the exposed ones on the end methyl group, giving the less substituted **Hofmann** product.

### Substitution or elimination?
- Primary substrate, good nucleophile: SN2. Primary with a bulky base: E2.
- Secondary: strong bases and heat favour E2; good nucleophiles that are weak bases (I⁻, CN⁻) favour SN2.
- Tertiary: strong base gives E2; weak base and heat give E1 alongside SN1.

**Heat favours elimination.** Elimination turns two reactant particles into three product particles, so it has a positive entropy change, and the $-T\\Delta S$ term of the [[gibbs-temperature|free energy]] grows with temperature. For ethanol vapour going to ethene and steam, $\\Delta H = +45$ kJ/mol and $\\Delta S = +127$ J/(mol·K): below about 86 °C the reaction is uphill, above it downhill. The reverse, adding water to ethene, is favoured at low temperature and high pressure — which is how industrial ethanol is made ([[addition-alkenes]]).
`,
  ideas: [
    'Elimination removes H and a leaving group from neighbouring carbons and forms a C=C.',
    'E2 is one step (rate = k[RX][base]) and needs H and leaving group anti-periplanar.',
    'E1 goes through a carbocation (rate = k[RX]); acid-catalysed dehydration of alcohols is the classic case.',
    'Zaitsev: the more substituted alkene is usually the major product; bulky bases give the less substituted one.',
    'Strong or bulky bases, tertiary substrates and high temperature favour elimination over substitution.'
  ],
  pitfalls: [
    'Hydroxide is a nucleophile, so it always substitutes — It is also a strong base. In hot ethanol it removes a β-hydrogen and eliminates.',
    'Zaitsev\'s rule is always obeyed — It holds for small bases; bulky bases such as tert-butoxide give mainly the less substituted (Hofmann) alkene.',
    'Heating just makes everything faster in the same proportion — Heating shifts the balance towards elimination, because elimination increases the number of molecules (ΔS > 0).'
  ],
  formulas: [
    {
      name: 'Temperature at which a reaction becomes favourable',
      expr: 'T = dH/dS', tex: 'T = \\frac{\\Delta H}{\\Delta S}',
      vars: {
        T: { name: 'crossover temperature (ΔG = 0)', q: 'temperature', unit: 'K' },
        dH: { name: 'enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: 45.4, tex: '\\Delta H' },
        dS: { name: 'entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: 126.5, tex: '\\Delta S' }
      },
      note: 'For a reaction with ΔH > 0 and ΔS > 0, such as an elimination, ΔG is negative above this temperature. Defaults: $\\ce{C2H5OH(g) -> C2H4(g) + H2O(g)}$ (standard values).',
      practice: { unknowns: ['T', 'dS'] },
      stories: {
        T: 'An elimination has ΔH = {dH} and ΔS = {dS}. Above what temperature is it thermodynamically favourable?',
        dS: 'A dehydration with ΔH = {dH} becomes favourable above {T}. What is its entropy change?'
      }
    },
    {
      name: 'Free energy of an elimination',
      expr: 'dG = dH - T*dS', tex: '\\Delta G = \\Delta H - T\\,\\Delta S',
      vars: {
        dG: { name: 'free-energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dH: { name: 'enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: 45.4, signed: true, tex: '\\Delta H' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 170 },
        dS: { name: 'entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: 126.5, signed: true, tex: '\\Delta S' }
      },
      note: 'Defaults: dehydrating ethanol vapour at 170 °C, the temperature used with concentrated sulfuric acid. Standard values; see [[gibbs-energy]].',
      practice: { unknowns: ['dG', 'T'] },
      stories: { dG: 'Ethanol vapour is dehydrated to ethene and steam (ΔH = {dH}, ΔS = {dS}) at {T}. What is ΔG?' }
    }
  ],
  examples: [
    {
      title: 'One substrate, two products',
      q: '2-bromo-2-methylpropane is (a) warmed with water, (b) heated with concentrated KOH in ethanol. What forms in each case?',
      steps: [
        'A tertiary substrate: SN2 is impossible.',
        '(a) Water is a weak nucleophile and a weak base, in a polar protic solvent: SN1 dominates, giving 2-methylpropan-2-ol, $\\ce{(CH3)3COH}$, with some 2-methylpropene from E1.',
        '(b) Hydroxide is a strong base, the solvent less polar and the temperature high: E2 gives 2-methylpropene, $\\ce{(CH3)2C=CH2}$.'
      ],
      a: '(a) mainly 2-methylpropan-2-ol; (b) 2-methylpropene.'
    },
    {
      title: 'When does dehydration go downhill?',
      q: 'For $\\ce{C2H5OH(g) -> C2H4(g) + H2O(g)}$, ΔH = +45.4 kJ/mol and ΔS = +126.5 J/(mol·K). Find the crossover temperature and ΔG at 170 °C.',
      steps: [
        '$T = \\Delta H/\\Delta S = 45\\,400/126.5 = 359$ K, that is 86 °C.',
        'At 443 K: $\\Delta G = 45.4 - 443.15 \\times 0.1265 = -10.7$ kJ/mol.',
        'The reaction is favourable at 170 °C; the acid catalyst is still needed to make it fast.'
      ],
      a: 'Favourable above 359 K (86 °C); ΔG = −10.7 kJ/mol at 170 °C.'
    },
    {
      title: 'Zaitsev or Hofmann?',
      q: '2-bromo-2-methylbutane, $\\ce{CH3CH2CBr(CH3)2}$, is heated with (a) sodium ethoxide, (b) potassium tert-butoxide. Which alkene dominates?',
      steps: [
        'Removing an H from the CH₂ gives 2-methylbut-2-ene, $\\ce{CH3CH=C(CH3)2}$, with three alkyl groups on the double bond.',
        'Removing an H from a CH₃ on the same carbon as Br gives 2-methylbut-1-ene, $\\ce{CH2=C(CH3)CH2CH3}$, with two.',
        '(a) The small ethoxide follows Zaitsev: mostly 2-methylbut-2-ene. (b) The bulky tert-butoxide reaches the outer CH₃ hydrogens more easily: mostly 2-methylbut-1-ene.'
      ],
      a: '(a) 2-methylbut-2-ene; (b) 2-methylbut-1-ene.'
    }
  ],
  quiz: [
    { q: 'Which conditions favour elimination over substitution for 2-bromopropane?', choices: ['dilute aqueous NaOH, warm', 'concentrated KOH in ethanol, hot', 'water at room temperature', 'sodium iodide in propanone'], a: 1,
      why: 'A strong base, a less polar solvent and heat all favour E2. Aqueous hydroxide at moderate temperature gives mainly the alcohol; iodide is a good nucleophile but a very weak base.' },
    { q: 'Which is the major product when 2-bromobutane is heated with ethanolic KOH?', choices: ['but-1-ene', 'but-2-ene', 'butan-2-ol', 'butane'], a: 1,
      why: 'Zaitsev\'s rule: the more substituted alkene, but-2-ene (mostly trans), is more stable and forms faster than but-1-ene.' },
    { q: 'Raising the temperature favours elimination because elimination increases the number of particles, so ΔS is positive.', a: true,
      why: 'Two particles (substrate and base) become three (alkene, water or alcohol, halide). The −TΔS term makes ΔG more negative as T rises.' },
    { q: 'A reaction has ΔH = +60 kJ/mol and ΔS = +150 J/(mol·K). Above what temperature (in K) is it favourable?', answer: 400, unit: 'K',
      why: 'T = ΔH/ΔS = 60 000/150 = 400 K.' },
    { q: 'How must the H and the leaving group be arranged for an E2 reaction?', choices: ['on the same carbon', 'eclipsed, 0° apart', 'anti-periplanar, 180° apart', 'it does not matter'], a: 2,
      why: 'The C–H bond and the C–X bond must lie in one plane on opposite sides, so that the breaking C–H orbital can overlap with the back of the breaking C–X bond as the π bond forms.' }
  ],
  applications: ['Making alkenes in the laboratory from haloalkanes and alcohols.', 'Bio-based ethene and poly(ethene) from fermentation ethanol.', 'PVC releases HCl by elimination when overheated, which is why it contains heat stabilisers.', 'Choosing base, solvent and temperature to steer syntheses towards substitution or elimination.'],
  history: 'Alexander Zaitsev formulated his rule in 1875 in Kazan; August Wilhelm von Hofmann had described the opposite preference of bulky quaternary ammonium eliminations in 1851.',
  sim: { id: 'org-conformations', params: { mol: 'butane' } }
},

{
  id: 'addition-alkenes', parent: 'organic-reactions', title: 'Addition to alkenes', level: 2,
  short: 'The π bond of an alkene is a cloud of loosely held electrons that attracts electrophiles. Hydrogen, halogens, hydrogen halides and water add across it; with an unsymmetrical alkene the more stable carbocation decides where each part goes (Markovnikov\'s rule).',
  keywords: ['electrophilic addition', 'addition reaction', 'Markovnikov rule', 'anti-Markovnikov', 'peroxide effect', 'carbocation stability', 'bromonium ion', 'anti addition', 'hydrogenation', 'hydration', 'halogenation', 'hydrohalogenation', 'bromine water', 'bromine number', 'margarine', 'trans fats', 'industrial ethanol'],
  prereq: ['hydrocarbons', 'reaction-mechanisms-organic', 'sigma-pi-bonds'],
  related: ['polymers', 'elimination', 'catalysis', 'lipids', 'le-chatelier', 'stereoisomers'],
  body: `
In an alkene the π electrons lie above and below the plane of the molecule, further from the nuclei and less tightly held than σ electrons. They are a target for **electrophiles**. When an alkene reacts, the π bond (about 270 kJ/mol) is replaced by two new σ bonds, so addition is usually exothermic — breaking one weak bond to make two strong ones.

### Adding HBr: two steps
1. The π electrons attack the hydrogen of H–Br; the H–Br bond breaks, and a **carbocation** forms on the other carbon of the former double bond.
2. $\\ce{Br-}$ attacks the carbocation.

$$\\ce{CH2=CH2 + HBr -> CH3CH2Br}$$

### Markovnikov's rule
With propene there are two choices. If $\\ce{H+}$ adds to the end carbon, the positive charge sits on the middle carbon: a **secondary** carbocation. If it adds to the middle, the charge is on the end: a **primary** carbocation. The secondary one is much more stable — two methyl groups share its charge, and six neighbouring C–H bonds overlap with its empty p orbital — and the transition state leading to it is some 30 kJ/mol lower. At room temperature that makes the secondary route about $10^5$ times faster, so the product is **2-bromopropane**, practically pure.

Markovnikov stated it in 1870 as "the hydrogen goes to the carbon that already has more hydrogens". The modern statement is the reason behind it: *the electrophile adds so as to give the more stable carbocation*.

**The peroxide effect.** With peroxides present, HBr adds the other way. Peroxides start a radical chain in which a **bromine atom** adds first; it goes to the end carbon to leave the more stable secondary **radical**, and the product is 1-bromopropane ("anti-Markovnikov"). The trick works only for HBr, the one hydrogen halide for which both radical steps are downhill.

### Adding bromine
A bromine molecule is polarised as it approaches the π cloud; the near atom becomes δ+ and is attacked. The intermediate is a three-membered **bromonium ion**, and the bromide ion must attack from the opposite face — so the two bromines end up on opposite sides (**anti addition**): cyclohexene gives trans-1,2-dibromocyclohexane. This is the bromine-water test for unsaturation (orange to colourless); in water, water competes with bromide and a bromo-alcohol forms too.

### Adding water
With an acid catalyst, water adds by the Markovnikov route: propene gives propan-2-ol. Much of the world's industrial ethanol is made this way from ethene and steam over a phosphoric acid catalyst at about 300 °C and 60–70 atm:

$$\\ce{CH2=CH2(g) + H2O(g) <=> CH3CH2OH(g)}\\qquad \\Delta H = -45\\ \\mathrm{kJ/mol}$$

Fewer gas molecules on the right, so high pressure pushes the equilibrium over ([[le-chatelier]]); low temperature would too, but then the reaction is too slow. Only about 5 % of the ethene reacts per pass, and the rest is recycled.

### Adding hydrogen
Hydrogen adds across C=C only on a metal surface — nickel, palladium or platinum — with both H atoms on the same face. The reaction is strongly exothermic (ethene: −137 kJ/mol) yet does not happen at all without a [[catalysis|catalyst]]. **Margarine** was made by partially hydrogenating vegetable oils, raising their melting points; a side reaction on the catalyst twisted some cis double bonds into trans, and the resulting **trans fats** raise the risk of heart disease. Many countries now restrict them in food.

The heat released on hydrogenation also measures how stable an alkene is. More alkyl groups on the double bond and a trans arrangement both make it release less — the same order that governs [[elimination|Zaitsev's rule]].
`,
  ideas: [
    'Alkenes react with electrophiles: the π electrons form a new bond and a carbocation intermediate appears.',
    'Markovnikov\'s rule: the electrophile adds to give the more stable carbocation, so H goes to the carbon with more H.',
    'With peroxides, HBr adds by a radical chain and the orientation reverses (anti-Markovnikov).',
    'Bromine adds anti through a bromonium ion; decolourising bromine water tests for C=C.',
    'Hydration makes industrial ethanol; hydrogenation needs a metal catalyst and makes margarine (and trans fats).'
  ],
  pitfalls: [
    'Markovnikov\'s rule is about where the hydrogen likes to go — It is about which carbocation forms; the hydrogen simply ends up wherever gives the more stable cation.',
    'Nucleophiles attack alkenes — The alkene is the nucleophile: its π electrons attack an electrophile such as H⁺ or Br₂. Nucleophiles attack C=O carbons, not C=C.',
    'A very exothermic reaction must be fast — Ethene and hydrogen release 137 kJ/mol but do not react without a metal catalyst; the rate depends on the barrier, not on ΔH.'
  ],
  derivation: {
    title: 'Why a small difference in barrier gives a large preference',
    steps: [
      { text: 'Each route has a rate constant that falls exponentially with its free-energy barrier ([[arrhenius-equation]]):', tex: 'k_A = C\\,e^{-\\Delta G_A^{\\ddagger}/RT}, \\qquad k_B = C\\,e^{-\\Delta G_B^{\\ddagger}/RT}' },
      { text: 'Both routes start from the same alkene and HBr, so the pre-factor $C$ is nearly the same and cancels in the ratio:', tex: '\\frac{k_A}{k_B} = e^{(\\Delta G_B^{\\ddagger} - \\Delta G_A^{\\ddagger})/RT}' },
      { text: 'If the first step is irreversible, each carbocation goes on to its own product, so the products form in the ratio of the rates (kinetic control).' },
      { text: 'At 298 K, $RT\\ln 10 = 5.7$ kJ/mol: every 5.7 kJ/mol of difference multiplies the preference by ten. A 30 kJ/mol gap is more than five powers of ten.' }
    ]
  },
  formulas: [
    {
      name: 'Selectivity from a difference in barriers',
      expr: 'ratio = exp(ddG/(R*T))', tex: 'S = \\exp\\!\\left(\\frac{\\Delta G^{\\ddagger}_{BA}}{R\\,T}\\right)',
      vars: {
        ratio: { name: 'selectivity: rate of route A divided by rate of route B', tex: 'S' },
        ddG: { name: 'how much lower the barrier of route A is than that of B', q: 'molarenergy', unit: 'kJ/mol', value: 30, tex: '\\Delta G^{\\ddagger}_{BA}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298 }
      },
      note: 'Two competing routes with the same pre-factor: their rates differ by the Boltzmann factor of the barrier difference. Defaults: HBr and propene, via the secondary against the primary carbocation (a model value). Every 5.7 kJ/mol is a factor of 10 at room temperature.',
      practice: { unknowns: ['ratio', 'ddG'] },
      stories: {
        ratio: 'One route of an addition has a barrier {ddG} lower than the other. At {T}, how many times faster is it?',
        ddG: 'At {T} one product forms {ratio} times as fast as the other. How much lower is the barrier of the faster route?'
      }
    },
    {
      name: 'Bromine number of an alkene',
      expr: 'Bn = 100*nd*MB/M', tex: 'B = \\frac{100\\,n\\,M_{\\ce{Br2}}}{M}',
      vars: {
        Bn: { name: 'bromine number (g of Br₂ taken up by 100 g)', tex: 'B' },
        nd: { name: 'C=C double bonds per molecule', int: true, value: 1, tex: 'n' },
        MB: { name: 'molar mass of bromine', q: 'molarmass', unit: 'g/mol', value: 159.81, fixed: true, tex: 'M_{\\ce{Br2}}' },
        M: { name: 'molar mass of the alkene', q: 'molarmass', unit: 'g/mol', value: 82.14 }
      },
      note: 'Each C=C adds one Br₂. Refineries use the bromine number to measure how much alkene a fuel contains. Default: cyclohexene.',
      practice: { unknowns: ['Bn', 'M'] },
      stories: {
        Bn: 'What mass of bromine (in g) adds to 100 g of an alkene of molar mass {M} with {nd} C=C per molecule?',
        M: 'An alkene with {nd} double bond per molecule has a bromine number of {Bn} g per 100 g. What is its molar mass?'
      }
    }
  ],
  examples: [
    {
      title: 'HBr and 2-methylpropene',
      q: 'Predict the product of HBr with 2-methylpropene, $\\ce{(CH3)2C=CH2}$, with and without peroxides.',
      steps: [
        'Without peroxides: H⁺ adds to the $\\ce{CH2}$ end, leaving a tertiary carbocation $\\ce{(CH3)3C+}$ (the alternative is a primary cation). Bromide then gives 2-bromo-2-methylpropane, $\\ce{(CH3)3CBr}$.',
        'With peroxides: a Br atom adds to the $\\ce{CH2}$ end, leaving the tertiary radical $\\ce{(CH3)2C.CH2Br}$, which takes an H from HBr.',
        'Product: 1-bromo-2-methylpropane, $\\ce{(CH3)2CHCH2Br}$ — the anti-Markovnikov isomer.'
      ],
      a: '2-bromo-2-methylpropane normally; 1-bromo-2-methylpropane with peroxides.'
    },
    {
      title: 'How selective is Markovnikov addition?',
      q: 'Take the barrier to the secondary cation of propene to be 30 kJ/mol lower than to the primary. What is the ratio of the two products at 25 °C and at 100 °C?',
      steps: [
        { text: 'At 298 K:', tex: '\\frac{k_A}{k_B} = e^{30\\,000/(8.314 \\times 298.15)} = e^{12.10} = 1.8 \\times 10^5' },
        'At 373 K: $e^{30\\,000/(8.314 \\times 373.15)} = e^{9.67} = 1.6 \\times 10^4$.',
        'Heating reduces the selectivity tenfold, but 2-bromopropane still makes up more than 99.99 % of the product.'
      ],
      a: 'About 180 000 : 1 at 25 °C and 16 000 : 1 at 100 °C.'
    },
    {
      title: 'Bromine number',
      q: 'What is the bromine number of hex-1-ene, $\\ce{C6H12}$ (84.16 g/mol)?',
      steps: [
        'One C=C per molecule, so one mole of $\\ce{Br2}$ (159.81 g) per mole of hexene.',
        '$B = 100 \\times 159.81/84.16 = 189.9$ g of bromine per 100 g.'
      ],
      a: 'About 190 g of Br₂ per 100 g — alkenes take up about twice their own mass of bromine.'
    }
  ],
  quiz: [
    { q: 'What is the major product of HCl with propene?', choices: ['1-chloropropane', '2-chloropropane', '1,2-dichloropropane', 'chloropropene'], a: 1,
      why: 'H⁺ adds to the end carbon, giving the more stable secondary cation; chloride joins the middle carbon.' },
    { q: 'Why does HBr add to propene according to Markovnikov\'s rule?', choices: ['bromine is attracted to the carbon with more H', 'the secondary carbocation formed on the way is more stable than the primary', 'the product is more stable', 'the primary cation is too crowded'], a: 1,
      why: 'The rate-determining step makes the carbocation, and the route through the more stable (secondary) cation has the lower barrier.' },
    { q: 'Peroxides also reverse the orientation of HCl addition to propene.', a: false,
      why: 'The peroxide effect works only for HBr; for HCl and HI one of the radical chain steps is uphill, so the chain does not run and addition stays Markovnikov.' },
    { q: 'At 298 K, how many times faster is a route whose barrier is 20 kJ/mol lower?', answer: 3190,
      why: '$e^{20\\,000/(8.314 \\times 298.15)} = e^{8.07} \\approx 3.2 \\times 10^3$.' },
    { q: 'What does bromine give with cyclohexene?', choices: ['cis-1,2-dibromocyclohexane', 'trans-1,2-dibromocyclohexane', 'bromocyclohexane', '1,1-dibromocyclohexane'], a: 1,
      why: 'The bromonium ion blocks one face, so the bromide attacks from the other: the two bromines end up anti, trans on the ring.' }
  ],
  applications: ['Industrial ethanol from ethene and steam.', 'Hydrogenating vegetable oils; the trans-fat problem it created.', 'Bromine-water and bromine-number tests for unsaturation in foods and fuels.', 'Addition polymerisation, the largest use of alkenes.'],
  history: 'Vladimir Markovnikov published his rule in 1870. In 1933 Morris Kharasch showed that the "exceptions" chemists kept finding with HBr came from traces of peroxides in old alkene samples.',
  sim: 'org-markovnikov'
},

{
  id: 'carbonyl-chemistry', parent: 'organic-reactions', title: 'Aldehydes and ketones', level: 2,
  short: 'The C=O group is polar and flat: its carbon is an electrophile that nucleophiles attack from above or below the plane. Aldehydes are also easily oxidised, which is how Tollens\' and Fehling\'s tests — and the old breathalyser — tell them from ketones.',
  keywords: ['carbonyl', 'aldehyde', 'ketone', 'nucleophilic addition', 'cyanohydrin', 'hydrate', 'reduction', 'sodium borohydride', 'lithium aluminium hydride', 'Grignard reagent', 'oxidation', 'Tollens reagent', 'silver mirror', 'Fehling solution', 'Benedict', 'dichromate', 'hemiacetal', 'formaldehyde', 'acetone', 'breathalyser'],
  prereq: ['functional-groups', 'reaction-mechanisms-organic', 'bond-polarity'],
  related: ['carboxylic-acids-esters', 'carbohydrates', 'redox-reactions', 'ir-spectroscopy', 'nmr-spectroscopy', 'physics:mass-spring-system'],
  body: `
The **carbonyl group**, C=O, is the most important functional group in organic chemistry. Its carbon is sp², so the group and its two neighbours lie flat at 120°. Oxygen (electronegativity 3.44) pulls the shared electrons away from carbon (2.55): the carbon is δ+, the oxygen δ−. In an **aldehyde**, RCHO, the carbonyl carbon carries at least one hydrogen; in a **ketone**, RCOR′, two carbon groups.

With no O–H, carbonyl compounds cannot hydrogen-bond to each other, but their strong dipoles attract: propanal boils at 48 °C and propanone at 56 °C, between butane (−0.5 °C) and propan-1-ol (97 °C). They accept hydrogen bonds from water, so the small ones dissolve in it — propanone mixes in any proportion.

### Nucleophilic addition
A nucleophile attacks the carbonyl carbon from above or below the flat group; the π electrons move onto oxygen, and the carbon becomes tetrahedral. The alkoxide then picks up a proton. Aldehydes react faster than ketones: they are less crowded, and one alkyl group feeds less electron density into the carbon than two.

- **Water** gives a hydrate (a 1,1-diol), reversibly. Methanal in water is almost entirely hydrated — formalin is a solution of the hydrate — ethanal about half, propanone hardly at all.
- **Hydrogen cyanide** (with a little cyanide as catalyst) gives a cyanohydrin and adds a carbon atom. Because the flat carbonyl can be attacked from either face, a new stereocentre forms as a racemate. Bitter almonds and apricot kernels store a sugar derivative of a cyanohydrin that releases HCN when chewed.
- **Hydride** from sodium borohydride, $\\ce{NaBH4}$, reduces aldehydes to primary alcohols and ketones to secondary alcohols; the stronger lithium aluminium hydride, $\\ce{LiAlH4}$, also reduces acids and esters.
- **Grignard reagents**, RMgBr, carry a carbon nucleophile and build new C–C bonds: methanal gives primary alcohols, other aldehydes secondary and ketones tertiary alcohols.
- **Alcohols** add to give hemiacetals — which is how glucose closes into a ring ([[carbohydrates]]).

### Oxidation: telling aldehydes from ketones
An aldehyde's C–H is easily turned into C–OH, so aldehydes are oxidised to carboxylic acids even by mild oxidants. A ketone would have to break a C–C bond, so it resists. That gives the classic tests:
- **Tollens' reagent**, silver ions in ammonia, is reduced to a silver mirror on the glass: $\\ce{RCHO + 2[Ag(NH3)2]+ + 3OH- -> RCOO- + 2Ag + 4NH3 + 2H2O}$.
- **Fehling's** or **Benedict's solution**: blue copper(II) is reduced to a brick-red precipitate of copper(I) oxide — once the standard test for sugar in urine.
- Acidified **dichromate** turns from orange $\\ce{Cr2O7^2-}$ to green $\\ce{Cr^3+}$ with aldehydes and with primary and secondary alcohols.

Alcohols climb the same ladder: a primary alcohol gives an aldehyde (distil it out as it forms) and then a carboxylic acid (heat under reflux); a secondary alcohol gives a ketone; a tertiary alcohol has no H on its C–OH carbon and resists. Early breathalysers used the orange-to-green colour change. Your liver does the same oxidation with enzymes: ethanol → ethanal → ethanoic acid. Ethanal, the toxic middle step, causes much of a hangover; the drug disulfiram blocks its removal so that drinking becomes unpleasant.

### Where you meet them
Methanal (formaldehyde) glues plywood as urea- and phenol-methanal resins. Propanone is a solvent made by the million tonnes, a co-product of phenol manufacture. Many flavours are carbonyl compounds: vanillin (vanilla), cinnamaldehyde (cinnamon), benzaldehyde (almond) and carvone (spearmint). Steroid hormones such as testosterone and progesterone carry ketone groups, and glucose and fructose are an aldehyde sugar and a ketone sugar. In the [[ir-spectroscopy|infrared]] the C=O stretch is one of the strongest bands, near 1715 cm⁻¹ — the bond behaves like a stiff spring joining two masses.
`,
  ideas: [
    'The C=O group is flat and polar; its δ+ carbon is attacked by nucleophiles.',
    'Nucleophilic addition turns the flat carbonyl into a tetrahedral carbon: water, HCN, hydride, Grignard reagents and alcohols all add.',
    'Aldehydes are more reactive than ketones: less crowded and less electron-rich at carbon.',
    'Aldehydes are easily oxidised to acids (Tollens\', Fehling\'s, dichromate); ketones resist.',
    'Primary alcohols oxidise to aldehydes then acids, secondary to ketones, tertiary not at all.'
  ],
  pitfalls: [
    'C=O reacts like C=C — C=C is attacked by electrophiles; C=O is attacked at carbon by nucleophiles.',
    'Ketones cannot react because they resist oxidation — They are reduced to secondary alcohols and undergo all the nucleophilic additions, only somewhat more slowly than aldehydes.',
    'Sodium borohydride reduces every C=O — It reduces aldehydes and ketones but not carboxylic acids or esters; those need LiAlH₄.'
  ],
  formulas: [
    {
      name: 'Fraction hydrated in water',
      expr: 'f = K/(1 + K)', tex: 'f = \\frac{K_{\\text{hyd}}}{1 + K_{\\text{hyd}}}',
      vars: {
        f: { name: 'fraction present as the hydrate', q: 'ratio', unit: '%' },
        K: { name: 'hydration constant [hydrate]/[carbonyl]', value: 1.06, tex: 'K_{\\text{hyd}}' }
      },
      note: 'Approximate $K_{\\text{hyd}}$ at 25 °C: methanal about 2000, ethanal 1.06, propanone 0.0014. Electron-withdrawing groups raise it: trichloroethanal (chloral) forms a stable crystalline hydrate.',
      practice: { unknowns: ['f', 'K'] },
      stories: {
        f: 'A carbonyl compound has a hydration constant of {K} in water. What fraction of it is hydrated at equilibrium?',
        K: 'In water, {f} of an aldehyde is present as its hydrate. What is its hydration constant?'
      }
    },
    {
      name: 'Where the C=O stretch appears (spring model)',
      expr: 'nu = sqrt(k/mu)/(2*pi*c)', tex: '\\tilde{\\nu} = \\frac{1}{2\\pi c}\\sqrt{\\frac{k}{\\mu}}',
      vars: {
        nu: { name: 'wavenumber of the stretching vibration', q: 'wavenumber', unit: '1/cm', tex: '\\tilde{\\nu}' },
        k: { name: 'force constant of the bond', q: 'stiffness', unit: 'N/m', value: 1200 },
        mu: { name: 'reduced mass m₁m₂/(m₁ + m₂)', q: 'mass', unit: 'u', value: 6.857, tex: '\\mu' },
        c: { const: 'c' }
      },
      note: 'A bond vibrates like two masses on a spring ([[physics:mass-spring-system]]). For C=O, μ = 12 × 16/28 = 6.86 u. A C–O single bond (k ≈ 500 N/m) absorbs near 1100 cm⁻¹; the stiffer double bond near 1700.',
      practice: { unknowns: ['nu', 'k'] },
      stories: {
        nu: 'A C=O bond has a force constant of {k} and a reduced mass of {mu}. At what wavenumber does it absorb infrared light?',
        k: 'A ketone absorbs at {nu}. With μ = {mu}, what is the force constant of its C=O bond?'
      }
    }
  ],
  examples: [
    {
      title: 'Aldehyde or ketone?',
      q: 'Two unlabelled bottles hold propanal and propanone ($\\ce{C3H6O}$). How can you tell them apart?',
      steps: [
        'Warm a little of each with Tollens\' reagent in a clean test tube.',
        'Propanal is oxidised to propanoate and reduces $\\ce{Ag+}$ to metallic silver: a mirror forms.',
        'Propanone has no H on its carbonyl carbon and is not oxidised: no change. (Fehling\'s solution or acidified dichromate give the same answer.)'
      ],
      a: 'The one that gives a silver mirror is propanal.'
    },
    {
      title: 'A Grignard synthesis',
      q: 'Methylmagnesium bromide is added to propanone and the mixture is then treated with dilute acid. What forms?',
      steps: [
        'The methyl group of $\\ce{CH3MgBr}$ is a carbon nucleophile; it attacks the carbonyl carbon of $\\ce{(CH3)2CO}$.',
        'The oxygen becomes an alkoxide, $\\ce{(CH3)3CO-}$, held as its magnesium salt.',
        'Acid protonates it: $\\ce{(CH3)3COH}$, a new C–C bond and a tertiary alcohol.'
      ],
      a: '2-methylpropan-2-ol.'
    },
    {
      title: 'Hydrates compared',
      q: 'Using $K_{\\text{hyd}}$ ≈ 2000 (methanal), 1.06 (ethanal) and 0.0014 (propanone), find the fraction of each hydrated in water.',
      steps: [
        'Methanal: $2000/2001 = 99.95$ %.',
        'Ethanal: $1.06/2.06 = 51$ %.',
        'Propanone: $0.0014/1.0014 = 0.14$ %.',
        'Each alkyl group stabilises the C=O (by donating electrons) and crowds the hydrate — the same trend as the rates of nucleophilic addition.'
      ],
      a: 'About 99.95 %, 51 % and 0.14 %.'
    }
  ],
  quiz: [
    { q: 'What does sodium borohydride turn butanone into?', choices: ['butan-1-ol', 'butan-2-ol', 'butanoic acid', 'butane'], a: 1,
      why: 'Hydride adds to the carbonyl carbon of the ketone, which then carries OH: the secondary alcohol butan-2-ol.' },
    { q: 'Which gives a silver mirror with Tollens\' reagent?', choices: ['propanone', 'propanal', 'propan-2-ol', 'propanoic acid'], a: 1,
      why: 'Only the aldehyde is oxidised by the mild silver(I) reagent. Propanone, secondary alcohols and acids do not reduce it.' },
    { q: 'Ketones are oxidised by acidified dichromate as easily as aldehydes.', a: false,
      why: 'Oxidising a ketone would require breaking a C–C bond. The dichromate stays orange with ketones and turns green with aldehydes.' },
    { q: 'A carbonyl compound has $K_{\\text{hyd}} = 0.25$. What fraction of it is hydrated at equilibrium (as a decimal)?', answer: 0.2,
      why: '$0.25/(1 + 0.25) = 0.20$: one molecule in five is the hydrate.' },
    { q: 'Why do nucleophiles attack the carbon of a C=O rather than the oxygen?', choices: ['carbon is larger', 'the carbon is electron-poor (δ+) and the π electrons can move onto the oxygen', 'oxygen has no lone pairs', 'the C=O bond is weak'], a: 1,
      why: 'Oxygen pulls the electrons towards itself, leaving carbon δ+. When the nucleophile bonds to carbon, the π pair moves onto the electronegative oxygen, which can hold a negative charge.' }
  ],
  applications: ['Wood adhesives from methanal resins; propanone as a solvent.', 'Clinical and food tests for reducing sugars (Benedict\'s, Fehling\'s).', 'Flavours and fragrances: vanillin, cinnamaldehyde, benzaldehyde, carvone.', 'Grignard and hydride reductions for building alcohols in drug synthesis.'],
  history: 'Victor Grignard discovered organomagnesium reagents in 1900 and shared the 1912 Nobel Prize for them. Bernhard Tollens and Hermann von Fehling devised their tests in the nineteenth century.',
  sim: { id: 'org-groups', params: { mol: 'propanone' } }
},

{
  id: 'carboxylic-acids-esters', parent: 'organic-reactions', title: 'Carboxylic acids and esters', level: 2,
  short: 'The carboxyl group, –COOH, is acidic because its anion spreads the negative charge over two oxygens. Acids and alcohols make esters — the smells of fruit, the fats in food, the polyester in clothes — and water or alkali split them again, which is how soap is made.',
  keywords: ['carboxylic acid', 'carboxyl group', 'carboxylate', 'pKa', 'acid strength', 'delocalisation', 'esterification', 'Fischer esterification', 'ester', 'hydrolysis', 'saponification', 'soap', 'acid anhydride', 'acyl chloride', 'amide', 'aspirin', 'vinegar', 'fruity smells', 'transesterification', 'biodiesel'],
  prereq: ['carbonyl-chemistry', 'weak-acids', 'equilibrium-constant'],
  related: ['functional-groups', 'lipids', 'polymers', 'amino-acids-proteins', 'henderson-hasselbalch', 'le-chatelier', 'nomenclature'],
  body: `
### Why –COOH is an acid
In $\\ce{RCOOH <=> RCOO- + H+}$ the anion left behind, the **carboxylate**, shares its negative charge equally between two oxygen atoms — both C–O bonds become the same length, 1.26 Å. That delocalisation stabilises it. An alkoxide ion from an alcohol has no such help. So ethanoic acid (p$K_a$ 4.76) is some $10^{11}$ times stronger than ethanol (p$K_a$ about 16) — yet still a [[weak-acids|weak acid]]: a 0.10 M solution is only about 1.3 % ionised.

| Acid | Formula | p$K_a$ |
|---|---|---|
| methanoic (formic) | $\\ce{HCOOH}$ | 3.75 |
| ethanoic (acetic) | $\\ce{CH3COOH}$ | 4.76 |
| propanoic | $\\ce{CH3CH2COOH}$ | 4.87 |
| chloroethanoic | $\\ce{ClCH2COOH}$ | 2.87 |
| dichloroethanoic | $\\ce{Cl2CHCOOH}$ | 1.35 |
| trichloroethanoic | $\\ce{Cl3CCOOH}$ | 0.66 |
| benzoic | $\\ce{C6H5COOH}$ | 4.20 |

Electronegative chlorines pull electron density out of the carboxylate and stabilise it further: each one makes the acid stronger. Alkyl groups push the other way, very slightly.

Carboxylic acids react as acids: with metals, bases and — unlike phenols and alcohols — with carbonates, fizzing out $\\ce{CO2}$. Their salts are useful in their own right: sodium benzoate preserves soft drinks, and sodium stearate is soap. Small acids smell sharp (vinegar) or foul (butanoic acid is the smell of rancid butter); they boil high because pairs of molecules hydrogen-bond into dimers.

### Making esters
Heat a carboxylic acid with an alcohol and a little concentrated sulfuric acid:

$$\\ce{CH3COOH + CH3CH2OH <=>[\\ce{H+}] CH3COOCH2CH3 + H2O}$$

The reaction is slow and reversible, with $K \\approx 4$: starting from one mole of each, only two-thirds of a mole of ester forms. Chemists push it by using an excess of the cheaper reactant or by removing water or distilling off the ester ([[le-chatelier]]). Isotope labelling shows which bonds break: with ¹⁸O in the alcohol, the label ends up in the ester, not in the water — the acid loses OH and the alcohol loses H.

For complete conversion, use a more reactive acid derivative: an **acyl chloride** (RCOCl) or an **acid anhydride**. Aspirin is made by treating salicylic acid (2-hydroxybenzoic acid) with ethanoic anhydride, which turns its phenol –OH into an ester.

### Esters around you
Esters are named alkyl alkanoate ([[nomenclature]]) and many smell of fruit: ethyl ethanoate (pear drops, nail-varnish remover), 3-methylbutyl ethanoate (bananas), ethyl butanoate (pineapple), octyl ethanoate (oranges), methyl salicylate (wintergreen, used in muscle rubs). Fats and oils are esters of glycerol with three fatty acids ([[lipids]]); **polyesters** such as PET are chains of ester links ([[polymers]]); **biodiesel** is the methyl esters of vegetable-oil fatty acids, made by swapping glycerol for methanol (transesterification).

### Splitting esters
- **Acid hydrolysis** is esterification run backwards with plenty of water: it reaches an equilibrium.
- **Alkaline hydrolysis** (**saponification**) goes to completion, because the acid ends up as a carboxylate ion, which cannot react back with the alcohol: $\\ce{RCOOR' + OH- -> RCOO- + R'OH}$. Boiling fats with sodium hydroxide gives glycerol and soap — the oldest industrial organic reaction.

### Amides
Acids, acyl chlorides and esters react with ammonia or amines to give **amides**, RCONH₂ or RCONHR′. The nitrogen's lone pair is delocalised onto the carbonyl, which makes the C–N bond partly double, flat and very hard to hydrolyse without hot acid, hot alkali or an enzyme — exactly the stability needed in proteins, where the amide link is the peptide bond ([[amino-acids-proteins]]), and in nylon.
`,
  ideas: [
    'Carboxylic acids are weak acids made stronger than alcohols by the delocalised carboxylate ion.',
    'Electron-withdrawing groups near the COOH (such as Cl) increase acid strength.',
    'Acid + alcohol ⇌ ester + water: slow, acid-catalysed, K ≈ 4 for simple cases; excess reagent or water removal raises the yield.',
    'Alkaline hydrolysis of esters (saponification) goes to completion and makes soap from fats.',
    'Amides are the most stable acid derivatives: their C–N bond is partly double.'
  ],
  pitfalls: [
    'Carboxylic acids are strong acids because they are called acids — They are weak: 0.10 M ethanoic acid is about 1 % ionised, with a pH near 2.9.',
    'Esterification goes to completion if you wait long enough — It is an equilibrium; waiting only helps you reach it. Only excess reagent or removing a product raises the yield.',
    'In esterification the water\'s oxygen comes from the alcohol — Isotope labelling shows it comes from the acid: the acid loses OH, the alcohol only its H.'
  ],
  derivation: {
    title: 'How much of an acid is ionised at a given pH',
    steps: [
      { text: 'For $\\ce{RCOOH <=> RCOO- + H+}$ the acid constant is', tex: 'K_a = \\frac{[\\ce{H+}][\\ce{RCOO-}]}{[\\ce{RCOOH}]}' },
      { text: 'Rearranged, the ratio of ionised to un-ionised acid depends only on pH and $\\mathrm{p}K_a$:', tex: '\\frac{[\\ce{RCOO-}]}{[\\ce{RCOOH}]} = \\frac{K_a}{[\\ce{H+}]} = 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}' },
      { text: 'The ionised fraction is the ionised amount over the total:', tex: '\\alpha = \\frac{[\\ce{RCOO-}]}{[\\ce{RCOOH}] + [\\ce{RCOO-}]} = \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}}' },
      { text: 'Two pH units below the $\\mathrm{p}K_a$ the acid is 99 % un-ionised; two units above, 99 % ionised.' }
    ]
  },
  formulas: [
    {
      name: 'Equilibrium yield of an esterification',
      expr: 'K = y^2/((1 - y)*(r - y))', tex: 'K = \\frac{y^2}{(1-y)(r-y)}',
      solveFor: 'y',
      vars: {
        y: { name: 'moles of ester formed per mole of acid (the yield)', min: 0, max: 1 },
        K: { name: 'equilibrium constant', value: 4 },
        r: { name: 'moles of alcohol per mole of acid at the start', value: 1, min: 1 }
      },
      note: 'Starting with the acid, $r$ times as much alcohol and no water or ester. With $K = 4$: equal amounts give 67 %; three times as much alcohol gives 90 %.',
      practice: { unknowns: ['y', 'r'] },
      stories: {
        y: 'An acid and an alcohol are mixed in the ratio 1 : {r} and left to reach equilibrium (K = {K}). What fraction of the acid becomes ester?',
        r: 'For an esterification with K = {K}, how many moles of alcohol per mole of acid are needed to convert a fraction {y} of the acid?'
      }
    },
    {
      name: 'Fraction of an acid ionised at a given pH',
      expr: 'a = 1/(1 + 10^(pKa - pH))', tex: '\\alpha = \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}}',
      vars: {
        a: { name: 'fraction present as the carboxylate ion', q: 'ratio', unit: '%', tex: '\\alpha' },
        pKa: { name: 'pKa of the acid', value: 3.5, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the solution', value: 2, tex: '\\mathrm{pH}' }
      },
      note: 'From the [[henderson-hasselbalch|Henderson–Hasselbalch equation]]. At pH = pKa exactly half is ionised; each pH unit higher multiplies the ratio of ionised to un-ionised acid by ten. Defaults: aspirin (pKa ≈ 3.5) in the stomach.',
      practice: { unknowns: ['a', 'pH'] },
      stories: {
        a: 'A carboxylic acid with pKa {pKa} is in a solution of pH {pH}. What fraction of it is ionised?',
        pH: 'At what pH is a carboxylic acid of pKa {pKa} ionised to the extent {a}?'
      }
    }
  ],
  examples: [
    {
      title: 'Raising the yield of ethyl ethanoate',
      q: 'For $\\ce{CH3COOH + C2H5OH <=> CH3COOC2H5 + H2O}$, K = 4.0. What fraction of the acid is converted with 1 mol of ethanol per mole of acid, and with 3 mol?',
      steps: [
        { text: 'With equal amounts, $x$ mol of ester at equilibrium:', tex: '4 = \\frac{x^2}{(1-x)^2} \\;\\Rightarrow\\; \\frac{x}{1-x} = 2 \\;\\Rightarrow\\; x = 0.667' },
        { text: 'With three moles of ethanol:', tex: '4 = \\frac{x^2}{(1-x)(3-x)} \\;\\Rightarrow\\; 3x^2 - 16x + 12 = 0 \\;\\Rightarrow\\; x = 0.903' },
        'The other root of the quadratic (4.43) is impossible: it would use more acid than there is.'
      ],
      a: '67 % with equal amounts, 90 % with a threefold excess of ethanol.'
    },
    {
      title: 'Aspirin in the stomach and in the blood',
      q: 'Aspirin is a carboxylic acid with pKa ≈ 3.5. What fraction is ionised in the stomach (pH 2.0) and in blood (pH 7.4)?',
      steps: [
        'Stomach: $\\alpha = 1/(1 + 10^{1.5}) = 1/32.6 = 0.031$ — only about 3 % is ionised.',
        'Blood: $\\alpha = 1/(1 + 10^{-3.9}) = 0.9999$ — practically all is the carboxylate.',
        'The neutral molecule crosses cell membranes; the ion does not. So aspirin is absorbed partly through the stomach lining — where its acidity also irritates — and circulates as the anion.'
      ],
      a: 'About 3 % in the stomach; over 99.98 % in blood.'
    },
    {
      title: 'Making aspirin',
      q: 'Salicylic acid ($\\ce{C7H6O3}$, 138.12 g/mol) reacts with excess ethanoic anhydride to give aspirin ($\\ce{C9H8O4}$, 180.16 g/mol). What is the theoretical yield from 2.00 g of salicylic acid?',
      steps: [
        '$n = 2.00/138.12 = 0.01448$ mol; the reaction is 1 : 1.',
        '$m = 0.01448 \\times 180.16 = 2.61$ g.',
        'The other product is ethanoic acid — which is why old aspirin tablets smell of vinegar as they hydrolyse back.'
      ],
      a: '2.61 g.'
    }
  ],
  quiz: [
    { q: 'Which is the strongest acid?', choices: ['ethanoic acid', 'chloroethanoic acid', 'trichloroethanoic acid', 'ethanol'], a: 2,
      why: 'Three electronegative chlorines stabilise the carboxylate most: pKa 0.66, against 2.87 for chloroethanoic, 4.76 for ethanoic and about 16 for ethanol.' },
    { q: 'An esterification reaches equilibrium with only 67 % yield. Which change raises the yield?', choices: ['adding more catalyst', 'waiting longer', 'using an excess of the alcohol', 'using a larger flask'], a: 2,
      why: 'A catalyst and time only help reach equilibrium. Excess of one reactant (or removing water or ester) shifts the equilibrium itself.' },
    { q: 'Alkaline hydrolysis of an ester goes to completion, unlike acid hydrolysis.', a: true,
      why: 'In alkali the acid is removed as its carboxylate ion, which cannot react with the alcohol; nothing can drive the reverse reaction.' },
    { q: 'With K = 4 and equal amounts of acid and alcohol, what fraction of the acid is esterified at equilibrium?', answer: 0.667,
      why: '$x/(1-x) = \\sqrt{4} = 2$, so $x = 2/3$.' },
    { q: 'Which ester smells of bananas?', choices: ['methyl salicylate', '3-methylbutyl ethanoate', 'ethyl butanoate', 'octyl ethanoate'], a: 1,
      why: '3-methylbutyl ethanoate ("isoamyl acetate") is the banana ester; methyl salicylate is wintergreen, ethyl butanoate pineapple and octyl ethanoate orange.' }
  ],
  applications: ['Vinegar, food preservatives (benzoates, sorbates) and citric acid in drinks.', 'Soap-making by saponification of fats.', 'Flavours and perfumes built from esters.', 'Aspirin, polyesters and biodiesel.'],
  history: 'Emil Fischer and Arthur Speier described acid-catalysed esterification in 1895. Aspirin was first made in pure, stable form at Bayer in 1897; it was sold from 1899.',
  sim: { id: 'org-groups', params: { mol: 'ester' } }
},

{
  id: 'polymers', parent: 'organic-reactions', title: 'Polymers', level: 2,
  short: 'Polymers are giant chain molecules built from thousands of small monomers. Addition polymers grow by opening C=C bonds; condensation polymers join monomers with two reactive ends and release water. Chain length, branching and the forces between chains decide whether the result is a carrier bag, a fibre or a bulletproof vest.',
  keywords: ['polymer', 'monomer', 'repeat unit', 'addition polymerisation', 'chain growth', 'condensation polymerisation', 'step growth', 'polyethylene', 'poly(ethene)', 'PVC', 'polystyrene', 'PTFE', 'nylon', 'polyester', 'PET', 'Kevlar', 'degree of polymerisation', 'Carothers equation', 'number-average molar mass', 'dispersity', 'thermoplastic', 'thermoset', 'glass transition', 'recycling', 'PLA'],
  prereq: ['addition-alkenes', 'carboxylic-acids-esters', 'molar-mass'],
  related: ['intermolecular-forces', 'hydrogen-bonding', 'amino-acids-proteins', 'carbohydrates', 'nucleic-acids', 'physics:stress-strain'],
  body: `
In the 1920s most chemists thought that rubber and cellulose were loose clumps of small molecules. Hermann Staudinger argued that they were **macromolecules**: single molecules thousands of atoms long, held together by ordinary covalent bonds. He was right, and a century later the world makes about 400 million tonnes of synthetic polymers — plastics, fibres, rubbers, coatings — every year.

### Addition polymers: chain growth
An alkene can open its π bond and link to its neighbours:

$$n\\,\\ce{CH2=CH2 -> } \\left[\\ce{CH2-CH2}\\right]_n$$

The **repeat unit** has the same atoms as the monomer, but the double bond has become a single bond: the polymer is saturated. The usual mechanism is a radical chain ([[reaction-mechanisms-organic]]). An initiator such as a peroxide makes a radical, which adds to a C=C and leaves a new radical at the end of the chain; that adds another monomer, and another — thousands in a fraction of a second — until two growing ends meet and the chain stops. Long chains therefore appear at once, while much of the monomer is still unreacted. Catalysts found by Ziegler and Natta in the 1950s make chains without radicals, straighter and with regular stereochemistry.

| Monomer | Polymer | Uses |
|---|---|---|
| ethene | poly(ethene), PE | bags and film (branched LDPE), bottles and pipes (linear HDPE) |
| propene | poly(propene), PP | containers, ropes, car bumpers |
| chloroethene | poly(chloroethene), PVC | pipes, window frames, cable insulation |
| phenylethene (styrene) | polystyrene, PS | cups, foam packaging |
| tetrafluoroethene | PTFE | non-stick coatings, seals |
| methyl 2-methylpropenoate | PMMA (acrylic glass) | windows, lenses |

### Condensation polymers: step growth
Monomers with two functional groups can join end to end, each link releasing a small molecule, usually water:
- **polyesters**: PET from benzene-1,4-dicarboxylic acid and ethane-1,2-diol — drink bottles and fleece;
- **polyamides**: nylon-6,6 from hexanedioic acid and hexane-1,6-diamine, first made by Wallace Carothers in 1935; Kevlar, an aromatic polyamide whose rigid chains line up into fibres stronger than steel for their weight;
- nature's condensation polymers: proteins, polysaccharides and DNA.

Here any two molecules with matching ends can react — monomers, dimers, long chains alike — so long chains appear only near the very end. **Carothers' equation** says how long they get: if a fraction $p$ of the end groups has reacted, the average chain is $X_n = 1/(1-p)$ monomer units. At 90 % conversion that is 10; strong nylon needs about 100, so 99 % of the groups must react. The two monomers must also be mixed in almost exactly equal amounts: 1 % too much of one caps the chains near 200 units.

### How long, and how spread
A polymer sample is a mixture of chains of many lengths, so its molar mass is an average. The **number average** $M_n$ divides the total mass by the number of chains; dividing it by the mass of a repeat unit gives the **degree of polymerisation**. Longer chains weigh more in the **weight average** $M_w$, and the ratio $M_w/M_n$, the **dispersity**, measures the spread: 1 for identical chains, about 2 for a typical step-growth polymer. Poly(ethene) for bags has $M_n$ around $10^5$ g/mol; the ultra-high-molecular-weight grade used in hip joints and cut-resistant fibres, several million.

### From chains to properties
- **Forces between chains**: poly(ethene) chains attract only by London forces, so the plastic is soft; nylon's amide groups hydrogen-bond between chains, making strong fibres ([[hydrogen-bonding]]).
- **Packing**: unbranched HDPE chains pack into crystalline regions — stiffer, denser and melting near 130 °C; branched LDPE packs poorly — flexible, melting near 110 °C.
- **Glass transition**: below its glass-transition temperature a polymer is hard and brittle; above it, rubbery. Polystyrene (about 100 °C) is rigid at room temperature; natural rubber (about −70 °C) is not.
- **Thermoplastics** (PE, PP, PVC, PET) soften on heating and can be remoulded and recycled; **thermosets** (epoxies, Bakelite, vulcanised rubber) are cross-linked into one network and char instead of melting.

### After use
The C–C backbone of an addition polymer offers nothing for water or microbes to attack, which is why plastic bags persist for decades. Condensation polymers can be taken apart again by hydrolysing their ester or amide links; PET is chemically recycled this way. The recycling codes 1 to 6 on packaging are PET, HDPE, PVC, LDPE, PP and PS. Poly(lactic acid), a polyester made from fermented sugar, can be composted industrially.
`,
  ideas: [
    'Polymers are long chains of repeat units; addition polymers keep all the monomer\'s atoms, condensation polymers release a small molecule at each link.',
    'Chain growth makes long chains immediately; step growth makes them only at very high conversion.',
    'Carothers\' equation: the average chain length is Xₙ = 1/(1 − p).',
    'Molar masses of polymers are averages (Mₙ, M_w); their ratio, the dispersity, measures the spread.',
    'Forces between chains, branching and cross-linking decide stiffness, melting and recyclability.'
  ],
  pitfalls: [
    'A polymer has one molar mass — It is a mixture of chain lengths, described by averages such as Mₙ and M_w.',
    'Poly(ethene) is unsaturated because ethene is — The double bond is used up in forming the chain: the polymer has only single bonds and does not decolourise bromine water.',
    'In step growth, long chains form steadily from the start — At 50 % conversion the average chain is only 2 units long; long chains appear only in the last few per cent.'
  ],
  derivation: {
    title: 'Derive the Carothers equation',
    steps: [
      { text: 'Start with $N_0$ monomer molecules and equal numbers of the two kinds of end group (A and B). Each link uses one A and one B and joins two molecules into one, so, as long as no rings form, every link lowers the number of molecules by exactly one:', tex: 'N = N_0 - (\\text{number of links})' },
      { text: 'The conversion $p$ is the fraction of A groups that have reacted. There are $N_0$ A groups in all (for A–A plus B–B monomers, or A–B monomers alike), so the number of links is $pN_0$:', tex: 'N = N_0 - p\\,N_0 = N_0\\,(1 - p)' },
      { text: 'The average number of monomer units per molecule is the number of units divided by the number of molecules:', tex: 'X_n = \\frac{N_0}{N} = \\frac{1}{1 - p}' },
      { text: 'At $p = 0.5$ there are still half as many molecules as monomers — dimers on average. Only as $p \\to 1$ does $X_n$ shoot up.' }
    ]
  },
  formulas: [
    {
      name: 'Degree of polymerisation',
      expr: 'DP = Mn/M0', tex: 'X_n = \\frac{M_n}{M_0}',
      vars: {
        DP: { name: 'average number of repeat units per chain', tex: 'X_n' },
        Mn: { name: 'number-average molar mass of the polymer', q: 'molarmass', unit: 'g/mol', value: 62500, tex: 'M_n' },
        M0: { name: 'molar mass of the repeat unit', q: 'molarmass', unit: 'g/mol', value: 62.50, tex: 'M_0' }
      },
      note: 'Defaults: PVC, repeat unit $\\ce{CH2CHCl}$ (62.50 g/mol). For an addition polymer the repeat unit has the mass of the monomer.',
      practice: { unknowns: ['DP', 'Mn'] },
      stories: {
        DP: 'A sample of PVC has a number-average molar mass of {Mn}; its repeat unit is {M0}. How many repeat units does an average chain have?',
        Mn: 'Poly(ethene) chains (repeat unit {M0}) contain on average {DP} repeat units. What is the number-average molar mass?'
      }
    },
    {
      name: 'Carothers equation',
      expr: 'Xn = 1/(1 - p)', tex: 'X_n = \\frac{1}{1 - p}',
      vars: {
        Xn: { name: 'average number of monomer units per molecule', tex: 'X_n' },
        p: { name: 'fraction of end groups that have reacted (conversion)', value: 0.99, min: 0, max: 0.99999 }
      },
      note: 'For step-growth polymerisation of exactly balanced monomers. It follows from counting: $N_0$ monomers, each link joins two molecules into one, so after a fraction $p$ of links the number of molecules is $N_0(1-p)$.',
      practice: { unknowns: ['Xn', 'p'] },
      stories: {
        Xn: 'In a polyester synthesis a fraction {p} of the acid and alcohol groups has reacted. What is the average chain length?',
        p: 'A nylon needs chains of {Xn} monomer units on average. What fraction of the end groups must react?'
      }
    },
    {
      name: 'Dispersity',
      expr: 'D = Mw/Mn', tex: 'Đ = \\frac{M_w}{M_n}',
      vars: {
        D: { name: 'dispersity (1 for chains all the same length)', tex: 'Đ' },
        Mw: { name: 'weight-average molar mass', q: 'molarmass', unit: 'g/mol', value: 38000, tex: 'M_w' },
        Mn: { name: 'number-average molar mass', q: 'molarmass', unit: 'g/mol', value: 20000, tex: 'M_n' }
      },
      note: 'Always at least 1. Step-growth polymers approach 2 at high conversion; chain-growth polymers range from about 1.5 to well above 2; proteins, made from a gene template, are exactly 1.',
      practice: { unknowns: ['D', 'Mw'] }
    }
  ],
  examples: [
    {
      title: 'How long are PVC chains?',
      q: 'A PVC sample has $M_n$ = 62 500 g/mol. How many repeat units does an average chain contain?',
      steps: [
        'Repeat unit $\\ce{CH2-CHCl}$: $2 \\times 12.011 + 3 \\times 1.008 + 35.45 = 62.50$ g/mol.',
        '$X_n = 62\\,500/62.50 = 1000$.'
      ],
      a: 'About 1000 repeat units — 2000 carbon atoms in the backbone.'
    },
    {
      title: 'How complete must a nylon synthesis be?',
      q: 'Nylon-6,6 has a repeat unit of 226.32 g/mol made from two monomers (so 113.16 g/mol per monomer unit). What conversion gives $M_n$ = 20 000 g/mol?',
      steps: [
        '$X_n = 20\\,000/113.16 = 176.7$ monomer units.',
        'Carothers: $p = 1 - 1/X_n = 1 - 1/176.7 = 0.9943$.',
        'More than 99.4 % of all the acid and amine groups must react — which is why industry first makes a 1 : 1 salt of the two monomers, to get their proportions exactly equal.'
      ],
      a: 'A conversion of about 99.4 %.'
    }
  ],
  quiz: [
    { q: 'Which of these is a condensation polymer?', choices: ['poly(ethene)', 'PVC', 'nylon-6,6', 'polystyrene'], a: 2,
      why: 'Nylon forms by joining a diacid and a diamine, releasing water at each amide link. The others are addition polymers of alkenes.' },
    { q: 'In a step-growth polymerisation 95 % of the end groups have reacted. What is the average chain length?', answer: 20,
      why: '$X_n = 1/(1 - 0.95) = 20$ monomer units.' },
    { q: 'Poly(ethene) decolourises bromine water because it is made from ethene.', a: false,
      why: 'Polymerisation uses up the double bonds; the chain contains only C–C and C–H single bonds.' },
    { q: 'Why is nylon much stronger as a fibre than poly(ethene)?', choices: ['its chains are longer', 'hydrogen bonds between the amide groups of neighbouring chains', 'it contains benzene rings', 'it is cross-linked by sulfur'], a: 1,
      why: 'The N–H of one chain hydrogen-bonds to the C=O of the next, holding the chains firmly side by side. Poly(ethene) chains attract only by London forces.' },
    { q: 'Why can PET be chemically recycled by hydrolysis while poly(ethene) cannot?', choices: ['PET is lighter', 'PET contains ester links that water can split; PE has only C–C and C–H bonds', 'PE is a thermoset', 'PET is a natural polymer'], a: 1,
      why: 'Hydrolysis needs a bond it can attack, such as an ester or amide. The all-carbon backbone of addition polymers has none.' }
  ],
  applications: ['Packaging, pipes, textiles, paints and insulation.', 'Kevlar and ultra-high-molecular-weight poly(ethene) in protective equipment.', 'Medical implants and absorbable sutures (polyesters of lactic and glycolic acids).', 'Chemical recycling of PET and nylon back to monomers.'],
  history: 'Staudinger\'s macromolecule, proposed in 1920, earned him the 1953 Nobel Prize. Carothers at DuPont made nylon in 1935; Ziegler and Natta shared the 1963 Nobel Prize for their polymerisation catalysts; Stephanie Kwolek invented Kevlar in 1965.',
  sim: 'org-polymer'
}

);
