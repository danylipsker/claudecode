/* HYPER-BIOLOGY · content/plants.js — Plant Biology: plant structure and transport (plant-structure)
 * and plant growth and reproduction (plant-life). Simulations in sims/plants.js (prefix plant-). */
Hyper.add(

{
  id: 'plant-tissues', parent: 'plant-structure', title: 'Plant organs and tissues', level: 1,
  short: 'A plant is built from three organs — roots, stems and leaves — made of three tissue systems: a protective skin (dermal tissue), plumbing of xylem and phloem (vascular tissue), and the working and packing cells between them (ground tissue). New cells come only from meristems at the tips and, in woody plants, from a cambium that thickens the stem every year.',
  keywords: ['plant anatomy', 'root', 'stem', 'leaf', 'xylem', 'phloem', 'tracheid', 'vessel', 'sieve tube', 'companion cell', 'meristem', 'cambium', 'epidermis', 'parenchyma', 'collenchyma', 'sclerenchyma', 'root hair', 'endodermis', 'Casparian strip', 'vascular bundle', 'monocot', 'eudicot', 'tree rings', 'wood', 'secondary growth'],
  prereq: ['eukaryotic-cells', 'plant-diversity', 'mitosis'],
  related: ['transpiration', 'phloem-transport', 'plant-nutrition', 'photosynthesis', 'stem-cells', 'tropisms', 'mitochondria-chloroplasts', 'microscopy', 'physics:viscosity'],
  body: `
A plant cannot walk away from drought or a hungry caterpillar, and it cannot go looking for food. It solves both problems by growing: it keeps adding organs where they are needed, for as long as it lives. The body plan is simple — **roots** below ground to anchor the plant and take up water and minerals, and a **shoot** of **stems** that hold **leaves** up to the light — and it is built from just three tissue systems.

| Tissue system | What it does | Main cell types |
|---|---|---|
| **Dermal** | the skin: keeps water in, lets gases through, defends | epidermis with a waxy cuticle, guard cells of stomata, hairs, root hairs; bark on old stems |
| **Vascular** | the plumbing | **xylem** carries water and minerals up; **phloem** carries sugar wherever it is needed |
| **Ground** | photosynthesis, storage, support | parenchyma (thin-walled, living, the workhorse), collenchyma (living, thick corners — the strings of celery), sclerenchyma (dead fibres and stone cells with lignified walls) |

### The plumbing: xylem and phloem
**Xylem conducts through dead cells.** Its cells build thick walls stiffened with lignin, then die and empty, leaving hollow pipes. **Tracheids** are narrow (10–40 µm wide, a few millimetres long) and overlap, passing water sideways through thin **pits**; every vascular plant has them and conifers have little else. Flowering plants add **vessel elements** — wider cells, up to half a millimetre across in oaks and climbers, stacked end to end with their end walls dissolved into open tubes that can run for metres. A wide pipe carries far more water, since at a given pressure gradient the flow grows as $r^4$ ([[physics:viscosity|Poiseuille's law]]), but, as [[transpiration]] explains, wide pipes are also more easily broken by air bubbles.

**Phloem conducts through living cells.** A **sieve-tube element** keeps its membrane but loses its nucleus and most organelles; its end walls become **sieve plates** pierced by pores about a micrometre wide. A **companion cell** beside it, joined by many plasmodesmata, does its metabolic work and loads it with sugar (see [[phloem-transport]]).

### Meristems: where growth happens
All new cells come from **meristems**, small groups of dividing cells that keep a plant young at its tips — the plant's [[stem-cells]]. **Apical meristems** at shoot and root tips add length (*primary growth*). Woody plants have two **lateral meristems** that add girth (*secondary growth*): the **vascular cambium**, a cylinder one cell thick, makes new xylem — wood — inwards and new phloem outwards, and the **cork cambium** makes bark. In a seasonal climate the cambium makes wide-celled wood in spring and dense wood in summer, so each year leaves a ring; some bristlecone pines in California have more than 4,800. Grasses also have **intercalary meristems** at the base of their leaves, which is why a lawn survives mowing and a pasture survives grazing.

### Root, stem and leaf
- **Root.** A cap protects the tip and senses gravity. Behind it lie a zone of cell division (1–2 mm), a zone of elongation, and a zone of **root hairs** — single epidermal cells about 10 µm wide and up to a millimetre or so long — that multiply the surface. Deeper in, a ring of **endodermis** is sealed by the waxy **Casparian strip**, which forces water and ions through a living membrane before they reach the xylem: a checkpoint that lets the root choose what enters.
- **Stem.** Vascular bundles form a ring in eudicots (beans, oaks) and are scattered in monocots (grasses, palms). Leaves attach at **nodes**, each with a bud in its axil ready to become a branch.
- **Leaf.** Between the upper and lower epidermis lie tightly packed **palisade** cells, full of chloroplasts, and loose **spongy mesophyll**, whose air spaces open to the outside through **stomata** — typically 100–300 per square millimetre, mostly on the underside. Veins bring water in the xylem and carry sugar away in the phloem.

> [!fact] In 1937 Howard Dittmer grew a single rye plant for four months in a box of soil and measured its roots: about 13.8 million root branches, 620 km long in all, carrying some 14 billion root hairs that added another 10,600 km. The root system had a surface of about 640 m² — roughly 130 times that of the shoot.

| | Monocots | Eudicots |
|---|---|---|
| Seed leaves (cotyledons) | one | two |
| Leaf veins | parallel | a branching net |
| Vascular bundles in the stem | scattered | in a ring |
| Flower parts | in threes | in fours or fives |
| Roots | fibrous | a taproot with branches |
| Wood | rare | common |
`,
  ideas: [
    'Three organs (root, stem, leaf) are made of three tissue systems: dermal, vascular and ground.',
    'Xylem carries water up through dead, lignified pipes (tracheids and vessels); phloem carries sugar through living sieve tubes served by companion cells.',
    'All growth starts in meristems: apical meristems add length, the vascular and cork cambia add girth, leaving a ring for each year.',
    'Root hairs give roots an enormous surface; the Casparian strip of the endodermis makes water and ions pass through living membranes.',
    'Monocots and eudicots differ in cotyledons, veins, the arrangement of vascular bundles, flower parts and roots.'
  ],
  pitfalls: [
    'A tree grows taller by stretching its trunk — Stems lengthen only at their tips. A nail driven into a trunk a metre above the ground stays at a metre for ever; the trunk below only thickens.',
    'Xylem is living tissue like phloem — Working xylem conduits are dead, empty cell walls; that is why water can be pulled through them under tension. Phloem sieve tubes are alive, and must be, to hold sugar in by a membrane.',
    'Bark is just dead skin — The inner bark is the living phloem. Removing a ring of bark (girdling) cuts the sugar supply to the roots and kills the tree, even though the wood is untouched.'
  ],
  formulas: [
    {
      name: 'Root growth from the meristem',
      expr: 'v = P*lf', tex: 'v = P\\,\\ell_f',
      vars: {
        v: { name: 'root elongation rate', q: false, unit: 'µm/h' },
        P: { name: 'cells produced per hour in one cell file', q: false, unit: 'cells/h', value: 1.2 },
        lf: { name: 'final length of a mature cell', q: false, unit: 'µm', value: 190, tex: '\\ell_f' }
      },
      note: 'In steady growth, the tip moves forward by one mature cell length for every cell a file adds. Values are roughly those of an Arabidopsis root.',
      stories: {
        v: 'Each cell file of a root makes {P}, and the cells stretch to {lf} before they stop growing. How fast does the root grow?',
        P: 'A root grows at {v} and its mature cells are {lf} long. How many cells does each file make per hour?'
      }
    },
    {
      name: 'Surface of the root hairs',
      expr: 'A = N*pi*d*L', tex: 'A = N\\,\\pi\\,d\\,L',
      vars: {
        A: { name: 'total side surface of the root hairs', q: 'area', unit: 'm²' },
        N: { name: 'number of root hairs', q: 'count', value: 1.4e10 },
        d: { name: 'root hair diameter', q: 'length', unit: 'µm', value: 12 },
        L: { name: 'average root hair length', q: 'length', unit: 'mm', value: 0.76 }
      },
      note: 'Each hair treated as a thin cylinder (the tip is negligible). Numbers of the order of Dittmer\'s rye plant.',
      stories: { A: 'A plant carries {N} root hairs, each {d} wide and {L} long. What is their total surface?' }
    }
  ],
  examples: [
    {
      title: 'How fast does a root grow?',
      q: 'In the root tip of a seedling, each file of cells produces about 1.2 new cells an hour, and each cell stretches to about 190 µm before it stops. How fast does the root grow, and how far does it get in ten days?',
      steps: [
        'In steady state, every new cell eventually adds one mature length: $v = P\\,\\ell_f = 1.2 \\times 190 = 228$ µm per hour.',
        'Per day: $228 \\times 24 \\approx 5500$ µm, about 5.5 mm.',
        'In ten days, about 5.5 cm — the division zone itself stays only a millimetre or two long; the growth comes from cells elongating behind it.'
      ],
      a: 'About 0.23 mm an hour, 5.5 mm a day, some 5.5 cm in ten days.'
    },
    {
      title: 'The surface of fourteen billion root hairs',
      q: 'Dittmer\'s rye plant had about 14 billion root hairs with a total length of about 10,600 km. Taking their diameter as 12 µm, what surface did they provide? Compare it with a doubles tennis court (about 260 m²).',
      steps: [
        'Average length of one hair: $1.06\\times10^{7}\\ \\mathrm{m} / 1.4\\times10^{10} = 7.6\\times10^{-4}$ m = 0.76 mm.',
        '$A = N\\pi d L = 1.4\\times10^{10} \\times \\pi \\times 12\\times10^{-6} \\times 7.6\\times10^{-4} \\approx 400\\ \\mathrm{m^2}$.',
        'That is about one and a half tennis courts — from a plant whose shoot would fit in a flowerpot.'
      ],
      a: 'About 400 m², one and a half tennis courts.'
    },
    {
      title: 'Why vessels beat tracheids',
      q: 'A vessel 100 µm in diameter and a tracheid 20 µm in diameter carry water under the same pressure gradient. How many tracheids would carry as much as one vessel (ignoring the resistance of end walls and pits)?',
      steps: [
        'By Poiseuille\'s law the flow through a tube grows as the fourth power of its radius: $Q \\propto r^4$.',
        'The radius ratio is 5, so one vessel carries $5^4 = 625$ times as much as one tracheid.',
        'Twenty-five tracheids occupy the same cross-section as the vessel, so per unit area the vessel is still 25 times better — which is why vessels were a great advance, and why their larger bubbles are a greater risk.'
      ],
      a: 'About 625 tracheids.'
    }
  ],
  quiz: [
    { q: 'Which tissue carries water from the roots to the leaves?', choices: ['phloem', 'xylem', 'cambium', 'parenchyma'], a: 1, why: 'Xylem — tracheids and vessels, dead lignified pipes. Phloem carries sugar; the cambium makes new xylem and phloem but conducts nothing itself.' },
    { q: 'Mature xylem vessels are living cells with a thin layer of cytoplasm.', a: false, why: 'Vessel elements and tracheids die and empty when mature; only their lignified walls remain. Sieve tubes of the phloem are the living conduits.' },
    { q: 'What is the job of the Casparian strip in the root endodermis?', choices: ['It stores starch for the winter', 'It forces water and ions to cross a living membrane before entering the xylem', 'It makes new root hairs', 'It senses gravity'], a: 1, why: 'The waxy band blocks the path through cell walls, so everything reaching the xylem has passed a plasma membrane — where transporters decide what enters.' },
    { q: 'Doubling the radius of a xylem vessel multiplies the flow through it (same pressure gradient) by…', answer: 16, why: 'Poiseuille flow goes as r⁴, and 2⁴ = 16.' },
    { q: 'A plant has leaves with parallel veins, flower parts in threes and scattered vascular bundles. It is most likely…', choices: ['a eudicot such as a bean', 'a monocot such as a lily', 'a conifer', 'a fern'], a: 1, why: 'All three are monocot features (grasses, lilies, orchids, palms).' }
  ],
  applications: [
    'Timber, paper and cotton: wood is secondary xylem, paper is its cellulose fibres, and a cotton fibre is a single seed-hair cell up to about 3 cm long.',
    'Grafting fruit trees works only when the cambium of scion and rootstock are lined up so that they can knit together.',
    'Tree rings date wooden buildings and record past climates (dendrochronology).',
    'Linen, hemp and jute are bundles of sclerenchyma fibres from stems.'
  ],
  history: 'Robert Hooke named the "cells" he saw in cork in 1665. Within a few years Nehemiah Grew in England and Marcello Malpighi in Italy had described the tissues of roots, stems and leaves in remarkable detail, and Malpighi\'s girdling experiments hinted at the downward flow of food in the bark.'
},

{
  id: 'transpiration', parent: 'plant-structure', title: 'Transpiration and the rise of water', level: 2,
  short: 'Plants lift water without a pump. Evaporation from the leaves pulls on unbroken columns of water in the xylem, held together by cohesion, all the way down to the roots. The pull follows a gradient of water potential from moist soil (about −0.1 MPa) through the leaf (about −1.5 MPa) to dry air (about −100 MPa).',
  keywords: ['transpiration', 'cohesion–tension theory', 'water potential', 'xylem', 'stomata', 'guard cells', 'cavitation', 'embolism', 'root pressure', 'guttation', 'potometer', 'capillarity', 'negative pressure', 'tension', 'tallest tree', 'vapour pressure deficit', 'boundary layer', 'sap flow'],
  prereq: ['plant-tissues', 'water-potential', 'physics:surface-tension', 'water-in-life'],
  related: ['phloem-transport', 'plant-nutrition', 'plant-hormones', 'photosynthesis', 'c4-cam', 'physics:pressure', 'physics:hydrostatic-pressure', 'physics:viscosity', 'physics:latent-heat', 'chemistry:hydrogen-bonding', 'chemistry:vapor-pressure', 'diffusion-osmosis'],
  body: `
On a hot summer day a large tree may lift several hundred litres of water forty metres into the air, and it has no pump to do it. Nearly all of that water — 97–99 % of what the roots take up — simply evaporates from the leaves. This loss, **transpiration**, is the price of photosynthesis: a leaf must open its surfaces to take in CO₂, and wet surfaces open to the air lose water. The same evaporation is what lifts the water.

### Water runs down a slope of water potential
Water moves from where its [[water-potential|water potential]] $\\psi$ is higher to where it is lower. Along the path from soil to air the potential falls step by step:

| Where | Typical $\\psi$ (MPa) |
|---|---|
| Moist soil (dry soil at the wilting point: −1.5) | −0.1 |
| Root xylem | −0.3 |
| Stem xylem, 10 m up | −0.6 |
| Leaf cells at midday | −0.8 to −1.5 |
| Air inside the leaf (about 99 % humidity) | −1.4 |
| Outside air at 20 °C and 50 % humidity | −94 |

The last step dwarfs all the others: even air at 95 % humidity has $\\psi \\approx -7$ MPa. The drop from leaf to air is where the drive comes from, and the **stomata** are the valves that meter it.

### Cohesion and tension
In 1894 Henry Dixon and John Joly proposed what is now the accepted explanation, the **cohesion–tension theory**. Water evaporates from the wet walls of mesophyll cells into the leaf's air spaces. The water surface retreats into the nanometre-wide pores between cellulose fibres and curves; [[physics:surface-tension|surface tension]] in those tiny menisci pulls on the water behind them. Because water molecules cling to each other by [[chemistry:hydrogen-bonding|hydrogen bonds]] (**cohesion**) and to the walls (**adhesion**), the pull is passed down unbroken columns in the xylem to the roots. The water in a transpiring tree is under **tension** — a negative [[physics:pressure|pressure]], like a stretched rope rather than a squashed spring. Cut a stem under dye and the dye is sucked in; clamp a sensor to a trunk and you can see it shrink slightly at midday.

Capillarity alone cannot lift sap: in a vessel 40 µm across, water rises less than a metre. But the menisci in cell-wall pores a few nanometres wide can hold tensions of tens of megapascals ($\\Delta P = 2\\gamma/r$), far more than any tree needs — so the columns cannot be pulled back out of the leaves.

### How tall can a tree be?
Just holding a column of water up costs $\\rho g h \\approx 0.01$ MPa per metre, and friction in the xylem adds as much again or more when water flows. The tallest living tree, a coast redwood in California, is about 116 m tall; its top leaves must sit below −1.1 MPa from gravity alone, and at midday they reach about −1.8 MPa. At such potentials the leaves cannot build enough turgor to expand, so they grow small and thick, and photosynthesis falls. From measurements like these, George Koch and colleagues estimated in 2004 that redwoods cannot exceed about 122–130 m.

### Cavitation: when the rope snaps
Water under tension is metastable. If the tension grows too large, air is sucked through a pit membrane from a neighbouring air-filled conduit, a bubble expands with an audible click, and the vessel fills with vapour — an **embolism**. It stops conducting. Each species has a vulnerability curve; the tension at which half the conductivity is lost ($\\psi_{50}$) is around −1 to −3 MPa for many crops and temperate trees and below −10 MPa for some desert shrubs. Wide vessels conduct well but embolise easily, and freezing makes bubbles too. Many trees live close to this edge, which is why severe drought can kill whole forests by **hydraulic failure**.

### What sets the rate
- **Light** opens the stomata and warms the leaf.
- **Temperature**: warm air holds more vapour — the saturation vapour pressure nearly doubles with every 10 °C (1.2 kPa at 10 °C, 2.3 at 20 °C, 4.2 at 30 °C).
- **Humidity**: what matters is the vapour pressure deficit, how far the air is from saturation.
- **Wind** thins the still boundary layer of air over the leaf.
- **Soil water**: in drought, roots and leaves send abscisic acid ([[plant-hormones]]) that closes the stomata.
- **Leaf design**: thick cuticles, hairs, sunken stomata and rolled leaves (marram grass) cut losses; [[c4-cam|CAM plants]] open their stomata only at night.

Open stomata cover only 1–2 % of a leaf, yet a leaf can lose water almost as fast as an open water surface, because diffusion through small pores depends on their edges more than their area. Every molecule of CO₂ a leaf fixes costs it several hundred molecules of water. At night, when transpiration stops, some plants push water up by **root pressure** — ions pumped into the xylem draw water in osmotically — and drops appear at leaf tips at dawn (**guttation**). Root pressure rarely exceeds a few tenths of a megapascal: enough for a small plant, never for a tall tree.
`,
  ideas: [
    'Water moves from soil to air down a gradient of water potential: soil about −0.1 MPa, leaf about −1.5 MPa, dry air about −100 MPa.',
    'Evaporation from leaf cell walls pulls on continuous water columns held together by cohesion: the xylem sap is under tension (negative pressure).',
    'Gravity costs about 0.01 MPa per metre; with friction this limits the tallest trees to roughly 120–130 m.',
    'Too much tension breaks the columns: cavitation fills vessels with air (embolism), the cause of hydraulic failure in drought.',
    'Stomata control the rate, which rises with light, temperature, dry air and wind, and falls when ABA closes the stomata in drought.'
  ],
  pitfalls: [
    'Roots pump water up the tree — Root pressure is at most a few tenths of a megapascal and appears mainly at night. The xylem of a transpiring tree is under tension: a cut stem sucks in water or air instead of bleeding.',
    'Capillarity explains the rise of sap — In a vessel tens of micrometres wide, capillary rise is less than a metre. Capillary forces matter at the top, in the nanometre pores of wet cell walls, where they anchor columns that evaporation pulls up.',
    'Transpiration is pure waste — It is the unavoidable cost of letting CO₂ in through wet surfaces, but it also carries minerals up from the roots and cools the leaf: every kilogram evaporated takes away about 2.4 MJ of heat.'
  ],
  formulas: [
    {
      name: 'Water potential of air',
      expr: 'psia = R*T/Vw*ln(RH)', tex: '\\psi_{air} = \\frac{RT}{\\bar{V}_w}\\ln(\\mathrm{RH})',
      vars: {
        psia: { name: 'water potential of the air', q: 'pressure', unit: 'MPa', signed: true, tex: '\\psi_{air}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 },
        Vw: { name: 'molar volume of liquid water', q: 'molarvolume', unit: 'cm³/mol', value: 18.05, fixed: true, tex: '\\bar{V}_w' },
        RH: { name: 'relative humidity', q: 'ratio', unit: '%', value: 50, min: 0.1, max: 100, tex: '\\mathrm{RH}' }
      },
      solveFor: 'psia',
      note: 'The Kelvin relation: water vapour in equilibrium with liquid water at a potential ψ. Saturated air (100 %) has ψ = 0.',
      practice: { unknowns: ['psia', 'RH'] },
      stories: {
        psia: 'Air at {T} has a relative humidity of {RH}. What is its water potential?',
        RH: 'At {T}, what relative humidity is in equilibrium with a leaf at {psia}?'
      }
    },
    {
      name: 'Water potential at the top of a tree',
      expr: 'psil = psis - rhoW*g*h/1e6 - E/K', tex: '\\psi_{leaf} = \\psi_{soil} - \\rho_w g h - \\frac{E}{K_L}',
      vars: {
        psil: { name: 'water potential of the top leaves', q: false, unit: 'MPa', signed: true, tex: '\\psi_{leaf}' },
        psis: { name: 'water potential of the soil', q: false, unit: 'MPa', signed: true, value: -0.1, max: 0, tex: '\\psi_{soil}' },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        h: { name: 'height of the leaves', q: 'length', unit: 'm', value: 30 },
        E: { name: 'transpiration rate per leaf area', q: false, unit: 'mmol/(m²·s)', value: 3 },
        K: { name: 'leaf-specific hydraulic conductance of the soil–leaf path', q: false, unit: 'mmol/(m²·s·MPa)', value: 5, tex: 'K_L' }
      },
      solveFor: 'psil',
      note: 'Gravity costs ρ_w g = 0.0098 MPa per metre; the flow term is like Ohm\'s law (drop = flow ÷ conductance). Conductances of whole trees are typically 1–10 mmol m⁻² s⁻¹ MPa⁻¹.',
      practice: { unknowns: ['psil', 'E', 'h'] },
      stories: {
        psil: 'A tree {h} tall stands in soil at {psis}. Its leaves transpire {E}, and its soil-to-leaf path conducts {K}. What is the water potential of the top leaves?',
        E: 'A tree {h} tall in soil at {psis} has a conductance of {K}. Its stomata close if the top leaves fall below {psil}. What is the highest transpiration rate it can sustain?',
        h: 'With soil at {psis}, a transpiration rate of {E} and a conductance of {K}, how tall can a tree be if its top leaves must stay above {psil}?'
      }
    },
    {
      name: 'Capillary rise in a vessel (Jurin\'s law)',
      expr: 'h = 2*gamma/(rhoW*g*r)', tex: 'h = \\frac{2\\gamma}{\\rho_w g r}',
      vars: {
        h: { name: 'height of capillary rise', q: 'length', unit: 'm' },
        gamma: { name: 'surface tension of water', q: 'surfacetension', unit: 'mN/m', value: 72.8 },
        rhoW: { const: 'rhoW' },
        g: { const: 'g' },
        r: { name: 'radius of the tube', q: 'length', unit: 'µm', value: 20 }
      },
      note: 'For a perfectly wetted wall. Real xylem walls are less wettable, so the rise is lower still.',
      stories: {
        h: 'How high can capillarity alone raise water in a xylem vessel of radius {r}?',
        r: 'How narrow would a tube have to be for capillarity to lift water {h}?'
      }
    },
    {
      name: 'Transpiration rate',
      expr: 'E = gw*D/P', tex: 'E = g_w\\,\\frac{\\mathrm{VPD}}{P}',
      vars: {
        E: { name: 'transpiration rate per leaf area', q: false, unit: 'mmol/(m²·s)' },
        gw: { name: 'conductance to water vapour (stomata and boundary layer)', q: false, unit: 'mmol/(m²·s)', value: 250, tex: 'g_w' },
        D: { name: 'vapour pressure deficit, leaf to air', q: 'pressure', unit: 'kPa', value: 1.5, tex: '\\mathrm{VPD}' },
        P: { name: 'atmospheric pressure', q: 'pressure', unit: 'kPa', value: 101.3 }
      },
      solveFor: 'E',
      note: 'VPD/P is the difference in mole fraction of water vapour between the leaf\'s air spaces (saturated at leaf temperature) and the air. Typical sunlit leaves transpire 1–10 mmol m⁻² s⁻¹.',
      practice: { unknowns: ['E', 'gw', 'D'] },
      stories: {
        E: 'A leaf with a conductance of {gw} faces a vapour pressure deficit of {D} at {P}. How fast does it transpire?',
        gw: 'A leaf transpires {E} with a vapour pressure deficit of {D} at {P}. What is its conductance?'
      }
    }
  ],
  examples: [
    {
      title: 'The pull of dry air',
      q: 'Find the water potential of air at 20 °C and (a) 50 %, (b) 95 %, (c) 99 % relative humidity. Compare with a leaf at −1.4 MPa.',
      steps: [
        '$RT/\\bar V_w = 8.314 \\times 293.15 / (18.05\\times10^{-6}) = 1.35\\times10^{8}$ Pa = 135 MPa.',
        '(a) $135 \\ln 0.50 = -94$ MPa. (b) $135 \\ln 0.95 = -6.9$ MPa. (c) $135 \\ln 0.99 = -1.36$ MPa.',
        'Even nearly saturated air is far "drier" than the leaf; only at about 99 % humidity is air in balance with a leaf at −1.4 MPa — which is roughly the humidity of the air spaces inside the leaf.'
      ],
      a: '−94, −6.9 and −1.4 MPa: the big drop is from the leaf to the outside air.'
    },
    {
      title: 'Water to the top of a redwood',
      q: 'The tallest redwood is about 116 m tall and its soil is at −0.1 MPa. What water potential must its top leaves have just to hold the column? Could capillarity in a 20-µm-radius vessel do the lifting, and what tension can a meniscus in a 5-nm cell-wall pore hold?',
      steps: [
        'Gravity: $\\rho_w g h = 1000 \\times 9.81 \\times 116 = 1.14\\times10^6$ Pa = 1.14 MPa. So the top leaves need $\\psi \\le -0.1 - 1.14 = -1.24$ MPa before any water flows (measured midday values are about −1.8 MPa).',
        'Capillary rise: $h = 2\\gamma/(\\rho_w g r) = 2 \\times 0.0728/(1000 \\times 9.81 \\times 2\\times10^{-5}) = 0.74$ m. Hopeless for a tree.',
        'A meniscus of radius 5 nm holds $\\Delta P = 2\\gamma/r = 2\\times0.0728/5\\times10^{-9} = 2.9\\times10^7$ Pa = 29 MPa — some twenty times what the tree needs.'
      ],
      a: 'At least −1.24 MPa; capillarity lifts only 0.74 m, but menisci in wall pores can hold about 29 MPa.'
    },
    {
      title: 'A tree\'s water for a day',
      q: 'A tree has 200 m² of leaves that transpire on average 3.7 mmol m⁻² s⁻¹ for ten hours of daylight. How much water does it lose?',
      steps: [
        'Moles: $3.7\\times10^{-3} \\times 200 \\times 36\\,000 = 26\\,600$ mol.',
        'Mass: $26\\,600 \\times 18\\ \\mathrm{g} = 480$ kg — about 480 litres.',
        'Evaporating it takes $480 \\times 2.45 = 1200$ MJ of heat, which is why a tree is a powerful air conditioner.'
      ],
      a: 'About 480 litres in a day.'
    }
  ],
  quiz: [
    { q: 'Where is the largest drop in water potential along the path from soil to air?', choices: ['soil to root', 'root to stem', 'stem to leaf', 'leaf to air'], a: 3, why: 'The leaf sits at about −1.5 MPa and ordinary air at −50 to −100 MPa; every other step is a fraction of a megapascal.' },
    { q: 'Where does the energy to lift water to the top of a tree come from?', choices: ['ATP spent by root cells', 'the Sun, which evaporates water from the leaves', 'root pressure', 'capillarity in the vessels'], a: 1, why: 'Evaporation, driven by solar energy, creates the tension; the plant spends no metabolic energy on the lift itself.' },
    { q: 'The sap in the xylem of a transpiring tree is usually under negative pressure (tension).', a: true, why: 'That is the heart of the cohesion–tension theory; tensions of −0.5 to −2 MPa are common and have been measured with pressure chambers.' },
    { q: 'What is the water potential of air at 20 °C and 50 % relative humidity, in MPa?', answer: -94, unit: 'MPa', why: '135 MPa × ln 0.5 = −94 MPa.' },
    { q: 'Which change lowers the transpiration rate of a leaf?', choices: ['stronger wind', 'abscisic acid reaching the guard cells', 'a rise in temperature', 'drier air'], a: 1, why: 'ABA closes the stomata. Wind, warmth and dry air all raise the rate.' }
  ],
  problems: [
    { q: 'A leaf with a total conductance of 300 mmol m⁻² s⁻¹ faces a vapour pressure deficit of 2.0 kPa at 100 kPa. What is its transpiration rate, in mmol m⁻² s⁻¹?', answer: 6, tol: 0.02, steps: ['$E = g_w\\,\\mathrm{VPD}/P = 300 \\times 2.0/100 = 6.0$ mmol m⁻² s⁻¹.'] },
    { q: 'A 60-m tree in soil at −0.2 MPa has a leaf-specific conductance of 4 mmol m⁻² s⁻¹ MPa⁻¹ and transpires 2 mmol m⁻² s⁻¹. What is the water potential of its top leaves, in MPa?', answer: -1.29, unit: 'MPa', tol: 0.02, steps: ['Gravity: $0.0098 \\times 60 = 0.59$ MPa.', 'Flow: $E/K_L = 2/4 = 0.5$ MPa.', '$\\psi_{leaf} = -0.2 - 0.59 - 0.5 = -1.29$ MPa.'] }
  ],
  applications: [
    'Irrigation scheduling from the vapour pressure deficit, sap-flow sensors on trunks or pressure-chamber readings of leaf water potential.',
    'Cut flowers last longer if their stems are recut under water, so that air cannot enter the vessels and embolise them.',
    'Predicting drought die-off of forests from the hydraulic safety margins of their trees.',
    'Greenhouse climate control: keeping the vapour pressure deficit moderate so that crops transpire, cool and take up calcium without wilting.'
  ],
  history: 'Stephen Hales weighed potted plants and fixed mercury gauges to cut vines in the 1720s, measuring transpiration and root pressure for the first time (Vegetable Staticks, 1727). Dixon and Joly proposed the cohesion–tension theory in 1894; in 1965 Per Scholander\'s pressure chamber showed directly that the xylem sap of trees is under tension.',
  sim: ['plant-transpiration', 'plant-stomata']
},

{
  id: 'phloem-transport', parent: 'plant-structure', title: 'Phloem and the movement of sugars', level: 2,
  short: 'Sugar made in the leaves travels in the phloem to roots, fruits and growing tips at around a metre an hour. The Münch pressure-flow model explains how: loading sugar at a source draws in water by osmosis and builds pressure, unloading at a sink lets it fall, and the sap flows from high pressure to low.',
  keywords: ['phloem', 'translocation', 'pressure flow', 'mass flow', 'Münch hypothesis', 'source', 'sink', 'sieve tube', 'companion cell', 'phloem loading', 'sucrose', 'aphid stylet', 'girdling', 'ringing', 'turgor', 'osmotic potential', 'radioactive tracer', 'florigen'],
  prereq: ['plant-tissues', 'water-potential', 'active-transport', 'transpiration'],
  related: ['photosynthesis', 'carbohydrates', 'diffusion-osmosis', 'plant-hormones', 'photoperiodism', 'plant-nutrition', 'physics:viscosity', 'chemistry:osmotic-pressure', 'physics:pressure'],
  body: `
Only mature leaves make more sugar than they use. Roots in the dark, buds, young leaves, flowers, fruits and seeds all depend on imports, so a plant runs a second transport system alongside the xylem: the **phloem**, which moves a sap rich in sucrose — typically 0.3–1 M, some 10–30 % sugar by mass — from **sources** to **sinks**. A source is any organ that exports sugar: a mature leaf in the light, or a storage organ emptying itself in spring. A sink is any organ that imports it. The flow is fast — usually 0.3–1.5 m an hour. Diffusion of sucrose over one metre would take about thirty years; the phloem does it in an hour.

### The pressure-flow model
In 1930 Ernst Münch proposed that the sap moves in bulk, pushed by a difference in pressure that the plant creates osmotically:

1. **Loading.** At the source, companion cells pack sucrose into the sieve tubes, raising its concentration and lowering the osmotic potential — at 700 mM, $\\psi_s \\approx -1.7$ MPa.
2. **Water follows.** The neighbouring xylem is at a higher water potential, so water flows into the sieve tubes by osmosis and the turgor pressure rises: $P = \\psi_w - \\psi_s$.
3. **Unloading.** At the sink, sucrose leaves the sieve tubes to be used or stored; water follows it out and the pressure there stays low.
4. **Flow.** The sap flows along the tube from high to low pressure, carrying the sugar with it, and the water returns in the xylem.

| | Source (leaf) | Sink (root tip) |
|---|---|---|
| Sucrose in the sieve tubes | 700 mM | 200 mM |
| Osmotic potential $\\psi_s$ | −1.7 MPa | −0.5 MPa |
| Water potential of the xylem $\\psi_w$ | −0.6 MPa | −0.3 MPa |
| Turgor $P = \\psi_w - \\psi_s$ | 1.1 MPa | 0.2 MPa |

A pressure difference of about 1 MPa over a few metres of tubes 10–20 µm wide drives flows of a metre or two an hour — just what is measured. The flow itself is passive; the energy is spent loading sugar.

### Loading the tubes
Many herbaceous crops load **through the cell walls (apoplastically)**: sucrose leaves the mesophyll, and a proton–sucrose symporter in the companion-cell membrane pulls it in against a steep gradient, powered by an [[active-transport|H⁺-ATPase]]. Squashes and their relatives use a **polymer trap**: sucrose diffuses into the companion cells through plasmodesmata and is built into larger sugars (raffinose, stachyose) that cannot diffuse back. Many trees load **passively**, keeping so much sugar in the leaf cells that it simply diffuses in.

### The evidence
- **Girdling.** Remove a ring of bark and, within weeks, the bark above the ring swells with trapped sugar, while the roots slowly starve.
- **Aphids** feed by sliding a stylet into a single sieve tube. Cut the aphid away and sap keeps exuding from the stylet for hours, pushed out by the tube's own pressure — a way to collect pure sap and measure the pressure.
- **Tracers.** A leaf fed ¹⁴CO₂ exports labelled sucrose whose front can be timed down the stem.
- **Direction.** A stem can carry sap upwards in some sieve tubes and downwards in others at the same moment, depending on where their sources and sinks are.

### Not only sugar
Phloem sap also carries amino acids, potassium, hormones, RNA molecules and proteins — among them the flowering signal of [[photoperiodism]] — and many plant viruses travel in it. When a sieve tube is cut, proteins and the polysaccharide callose plug its sieve plates within seconds, the plant's equivalent of a blood clot.

> [!note] The Münch model fits herbs and small plants well. How the tallest trees keep enough pressure to move sap tens of metres through narrow tubes is still an open question: the pressures needed seem larger than those measured, and some researchers think the phloem works as a relay of shorter sections.
`,
  ideas: [
    'Phloem carries sucrose-rich sap from sources (mature leaves, storage organs being emptied) to sinks (roots, growing tips, fruits, seeds).',
    'Münch pressure flow: loading sugar at the source draws in water by osmosis and raises turgor; unloading at the sink lowers it; sap flows from high to low pressure.',
    'The flow is bulk flow at about 0.3–1.5 m per hour, powered by the energy spent on loading, not by the flow itself.',
    'Evidence comes from girdling, aphid stylets, radioactive tracers and the observed turgor pressures.',
    'Phloem also carries amino acids, ions, hormones, RNAs and signalling proteins such as florigen.'
  ],
  pitfalls: [
    'Phloem sap always flows downwards — It flows from sources to sinks, which may lie above (young leaves, fruits at the top) or below (roots); neighbouring sieve tubes can carry sap in opposite directions.',
    'Sugar spreads through the plant by diffusion — Diffusion over a metre would take decades. The sap moves in bulk, pushed by a pressure difference, carrying the sugar with it.',
    'Sieve tubes are open pipes like xylem vessels — They are living cells with membranes, and must be: a membrane that holds sugar in while letting water through is what creates the osmotic pressure.'
  ],
  formulas: [
    {
      name: 'Turgor pressure in a loaded sieve tube',
      expr: 'P = psiw + c*R*T', tex: 'P = \\psi_w + \\mathrm{[suc]}\\,RT',
      vars: {
        P: { name: 'turgor pressure in the sieve tube', q: 'pressure', unit: 'MPa' },
        psiw: { name: 'water potential of the surrounding xylem', q: 'pressure', unit: 'MPa', value: -0.6, signed: true, max: 0, tex: '\\psi_w' },
        c: { name: 'sucrose concentration in the sap', q: 'concentration', unit: 'mM', value: 700, tex: '\\mathrm{[suc]}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Osmotic potential ψs = −[suc]RT (van \'t Hoff, one particle per sucrose molecule, ideal solution), and the tube is in water balance with the xylem: P = ψw − ψs. Other solutes (K⁺, amino acids) add to it.',
      practice: { unknowns: ['P', 'c', 'psiw'] },
      stories: {
        P: 'Phloem sap holds {c} of sucrose and the xylem beside it is at {psiw}, at {T}. What turgor pressure builds up?',
        c: 'What sucrose concentration gives a turgor of {P} next to xylem at {psiw} ({T})?'
      }
    },
    {
      name: 'Speed of pressure flow in a sieve tube (Poiseuille)',
      expr: 'v = r^2*dP/(8*eta*L*f)', tex: 'v = \\frac{r^2\\,\\Delta P}{8\\,\\eta\\,L\\,f}',
      vars: {
        v: { name: 'mean speed of the sap', q: 'speed', unit: 'mm/s' },
        r: { name: 'sieve-tube radius', q: 'length', unit: 'µm', value: 10 },
        dP: { name: 'pressure difference, source to sink', q: 'pressure', unit: 'MPa', value: 0.5, tex: '\\Delta P' },
        eta: { name: 'viscosity of the sap', q: 'viscosity', unit: 'mPa·s', value: 1.7, tex: '\\eta' },
        L: { name: 'length of the path', q: 'length', unit: 'm', value: 5 },
        f: { name: 'extra resistance of the sieve plates (factor)', value: 2, min: 1, max: 10 }
      },
      note: '1 m/h = 0.278 mm/s. Sieve plates roughly double the resistance of an open tube; sucrose sap is about twice as viscous as water.',
      practice: { unknowns: ['v', 'dP', 'L'] },
      stories: {
        v: 'Sap flows through sieve tubes of radius {r} under a pressure difference of {dP} over {L}. Its viscosity is {eta} and the sieve plates multiply the resistance by {f}. How fast does it move?',
        dP: 'What pressure difference drives sap at {v} through sieve tubes of radius {r} over {L} (viscosity {eta}, plate factor {f})?'
      }
    },
    {
      name: 'Speed from a tracer front',
      expr: 'v = d/t',
      vars: {
        v: { name: 'speed of translocation', q: 'speed', unit: 'mm/s' },
        d: { name: 'distance the labelled front travels', q: 'length', unit: 'cm', value: 50 },
        t: { name: 'time taken', q: 'time', unit: 'min', value: 30 }
      },
      stories: {
        v: 'A leaf is fed ¹⁴CO₂; labelled sugar appears {d} down the stem after {t}. How fast is the phloem sap moving?',
        t: 'Sap moves at {v}. How long does sugar take to travel {d}?'
      }
    }
  ],
  examples: [
    {
      title: 'Pressures at source and sink',
      q: 'At 20 °C, the sieve tubes of a leaf hold 700 mM sucrose next to xylem at −0.6 MPa; in a root tip they hold 200 mM next to xylem at −0.3 MPa. Find the turgor at each end.',
      steps: [
        '$RT = 8.314 \\times 293.15 = 2437$ J/mol, so each mol/m³ (1 mM) of sucrose gives 2437 Pa.',
        'Source: $P = -0.6 + 2437 \\times 700 \\times 10^{-6} = -0.6 + 1.71 = 1.11$ MPa.',
        'Sink: $P = -0.3 + 2437 \\times 200 \\times 10^{-6} = -0.3 + 0.49 = 0.19$ MPa.',
        'The difference, about 0.9 MPa (nine atmospheres), drives the flow.'
      ],
      a: 'About 1.1 MPa at the source and 0.2 MPa at the sink.'
    },
    {
      title: 'Is the pressure enough?',
      q: 'Use the 0.92 MPa difference from the last example to drive sap (viscosity 1.7 mPa·s) through sieve tubes of radius 10 µm whose sieve plates double the resistance. How fast does it flow over a 5-m path, and over 50 m?',
      steps: [
        '$v = r^2 \\Delta P/(8\\eta L f) = (10^{-5})^2 \\times 9.2\\times10^5 / (8 \\times 1.7\\times10^{-3} \\times 5 \\times 2) = 6.8\\times10^{-4}$ m/s.',
        'That is 0.68 mm/s, about 2.4 m per hour — ample for the observed speeds.',
        'Over 50 m the speed falls tenfold, to 0.24 m/h: tall trees need larger pressures or wider tubes, which is the open problem of phloem in trees.'
      ],
      a: 'About 2.4 m/h over 5 m, but only 0.24 m/h over 50 m.'
    },
    {
      title: 'Why diffusion will not do',
      q: 'Sucrose diffuses in water with $D \\approx 5\\times10^{-10}$ m²/s. How long would it take to spread one metre, compared with flow at 1 m/h?',
      steps: [
        'The typical diffusion time is $t \\approx x^2/2D = 1/(2 \\times 5\\times10^{-10}) = 10^9$ s.',
        'That is about 32 years.',
        'Bulk flow covers the metre in an hour — some 280,000 times faster.'
      ],
      a: 'About 30 years by diffusion against an hour by flow.'
    }
  ],
  quiz: [
    { q: 'In the pressure-flow model, what raises the pressure in the sieve tubes of a source leaf?', choices: ['sugar loading draws in water by osmosis', 'the xylem pushes sap into them', 'companion cells contract', 'transpiration pulls on them'], a: 0, why: 'Loading sucrose lowers the osmotic potential; water enters from the xylem and the turgor rises.' },
    { q: 'Phloem sap always flows from the leaves down to the roots.', a: false, why: 'It flows from sources to sinks. Fruits and young leaves above a mature leaf are sinks too, so sap also flows upwards.' },
    { q: 'A ring of bark is removed from a tree trunk. What happens just above the ring over the following weeks?', choices: ['nothing, because the xylem is intact', 'the bark swells as sugar piles up', 'the leaves wilt at once', 'the wood above the ring dies'], a: 1, why: 'The phloem is cut; sugar moving down accumulates above the ring. The xylem still supplies water, so the leaves stay green until the roots starve.' },
    { q: 'Labelled sugar travels 45 cm down a stem in 30 minutes. What is its speed in mm/s?', answer: 0.25, unit: 'mm/s', why: '450 mm / 1800 s = 0.25 mm/s, about 0.9 m per hour.' },
    { q: 'In early spring a potato tuber sprouts. For the sprouts it is…', choices: ['a sink', 'a source', 'neither', 'both at once, equally'], a: 1, why: 'It mobilises its starch and exports sucrose to the growing shoots. In late summer the same tuber was a strong sink.' }
  ],
  problems: [
    { q: 'Phloem sap holds 600 mM sucrose and the xylem beside it is at −0.5 MPa, at 20 °C. What turgor pressure develops?', answer: 0.96, unit: 'MPa', tol: 0.02, steps: ['$\\psi_s = -[\\mathrm{suc}]RT = -600 \\times 2437 = -1.46$ MPa.', '$P = \\psi_w - \\psi_s = -0.5 + 1.46 = 0.96$ MPa.'] }
  ],
  applications: [
    'Maple syrup is made from spring xylem sap, not phloem sap: sugar stored in the wood is released into the xylem before the leaves open; about 40 L of sap boil down to 1 L of syrup.',
    'Growers girdle grapevines and thin fruit so that more sugar goes to the remaining berries and apples.',
    'Aphids are pests largely because they tap the phloem — and they carry plant viruses from one sieve tube to another.',
    'Citrus greening, one of the most damaging citrus diseases, is caused by bacteria that live only in the phloem.'
  ],
  history: 'Marcello Malpighi girdled trees in the 1670s and saw the bark swell above the cut. Ernst Münch put forward the pressure-flow hypothesis in 1930. In 1953 John Kennedy and Tom Mittler showed that the stylets of aphids feeding on willow go on exuding pure phloem sap after the insect is cut away — a technique still in use.',
  sim: 'plant-phloem'
},

{
  id: 'plant-nutrition', parent: 'plant-structure', title: 'Mineral nutrition and soil', level: 2,
  short: 'Besides light, water and CO₂, a plant needs about fourteen mineral elements from the soil — nitrogen, phosphorus and potassium above all — and shows telltale symptoms when one runs short. Roots take them up with membrane transporters, and most plants enlist fungi (mycorrhizae) and some enlist bacteria to help.',
  keywords: ['mineral nutrition', 'essential elements', 'macronutrients', 'micronutrients', 'nitrogen', 'phosphorus', 'potassium', 'NPK', 'fertiliser', 'deficiency symptoms', 'chlorosis', 'mycorrhizae', 'nitrogen fixation', 'root nodules', 'Rhizobium', 'cation exchange', 'soil pH', 'law of the minimum', 'Mitscherlich', 'hydroponics'],
  prereq: ['plant-tissues', 'active-transport', 'nitrogen-cycle'],
  related: ['transpiration', 'phloem-transport', 'fungi', 'bacteria-archaea', 'microbiome', 'coevolution', 'enzyme-kinetics', 'photosynthesis', 'ecosystem-services', 'chemistry:acid-base-theory', 'medicine:vitamins-minerals'],
  body: `
In the 1640s Jan Baptist van Helmont planted a 2.3-kg willow in 91 kg of dried soil and gave it only rainwater. Five years later the tree weighed 77 kg, and the soil had lost just 57 grams. He concluded that the tree was made of water; in fact most of it was made of air. About 95 % of a plant's dry mass is carbon, oxygen and hydrogen from CO₂ and water. The remaining few per cent — the **mineral nutrients** — are just as essential: without any one of them the plant cannot complete its life.

### The essential elements
Seventeen elements are essential to all plants: C, H and O, plus fourteen taken from the soil. The **macronutrients** are needed in grams per kilogram of dry matter, the **micronutrients** in milligrams.

| Element | Taken up as | In dry matter | What it does | When it runs short |
|---|---|---|---|---|
| N | $\\ce{NO3-}$, $\\ce{NH4+}$ | 1.5 % | proteins, nucleic acids, chlorophyll | old leaves turn evenly yellow; stunted growth |
| K | $\\ce{K+}$ | 1.0 % | osmotic balance, stomata, enzyme activation | old leaves scorched at the edges; weak stems |
| Ca | $\\ce{Ca^2+}$ | 0.5 % | cell walls, membranes, signals | growing tips die; blossom-end rot of tomatoes |
| Mg | $\\ce{Mg^2+}$ | 0.2 % | the centre of chlorophyll; ATP reactions | old leaves yellow between green veins |
| P | $\\ce{H2PO4-}$ | 0.2 % | ATP, DNA, RNA, membranes | dark or purplish leaves; poor roots |
| S | $\\ce{SO4^2-}$ | 0.1 % | cysteine, methionine, coenzymes | young leaves pale |
| Fe | $\\ce{Fe^2+}$ or chelates | 100 mg/kg | cytochromes, making chlorophyll | young leaves yellow between green veins |
| Cl, Mn, Zn, B, Cu, Mo, Ni | ions | 0.1–100 mg/kg | enzyme cofactors; Mo in nitrate reductase and nitrogenase, Ni in urease, B in cell walls | varied: small leaves, dead tips, spots |

**Where** a symptom appears is a clue. Nitrogen, phosphorus, potassium and magnesium are **mobile**: a starving plant strips them from old leaves to feed new ones, so the old leaves show it first. Calcium, iron, boron and (largely) sulfur are **immobile**, so the youngest leaves suffer first.

### Getting minerals out of the soil
Minerals reach the root dissolved in the soil water. Clay particles and humus carry negative charges that hold cations — $\\ce{K+}$, $\\ce{Ca^2+}$, $\\ce{Mg^2+}$ — against leaching; roots release $\\ce{H+}$, which exchanges for them (**cation exchange**). Nitrate is not held, so it washes easily into rivers. Phosphate binds so tightly to iron, aluminium and calcium that the soil solution often holds less than 10 µM, and a root soon empties a zone only 1–2 mm around itself. Root cells take ions in through transporters that behave like enzymes, with [[enzyme-kinetics|Michaelis–Menten]] kinetics: high-affinity carriers with $K_m$ of a few to tens of micromolar work at low concentrations, low-affinity channels at millimolar ones. **Soil pH** decides a great deal: most nutrients are best available between pH 6 and 7; in acid soils aluminium becomes toxic, and on chalk or limestone iron becomes so insoluble that shrubs turn yellow (**lime-induced chlorosis**) — which is why rhododendrons and blueberries need acid soil.

### Partners underground
- **Mycorrhizae.** About 80–90 % of land plants live with fungi in their roots. Fungal threads a few micrometres thick spread far beyond the depletion zone and bring back phosphate, nitrogen and water in exchange for sugar — up to a fifth of what the plant makes. Arbuscular mycorrhizae, which enter root cells, are visible in 407-million-year-old fossil plants: the first land plants may have depended on them. See [[fungi]].
- **Nitrogen fixation.** Air is 78 % $\\ce{N2}$, but only certain bacteria can break its triple bond, with the enzyme nitrogenase: $\\ce{N2 + 8H+ + 8e- -> 2NH3 + H2}$, at a cost of 16 ATP. Legumes house *Rhizobium* bacteria in root nodules, coloured pink by leghaemoglobin, which keeps oxygen away from the enzyme; a good legume crop fixes 50–300 kg of nitrogen per hectare per year. See [[nitrogen-cycle]].

### The law of the minimum
Growth is limited by whichever nutrient is scarcest relative to need — the **law of the minimum** of Sprengel and Liebig, often pictured as a barrel whose staves are the nutrients: it holds water only up to its shortest stave. Adding more of a limiting nutrient gives diminishing returns (Mitscherlich, 1909), and the excess leaches away and feeds algal blooms downstream. Synthetic ammonia from the Haber–Bosch process now supplies nitrogen to crops that feed roughly half of humanity.

> [!tip] Carnivorous plants such as sundews and the Venus flytrap live in waterlogged bogs so poor in nitrogen that catching insects pays; they photosynthesise normally and "eat" only for minerals.
`,
  ideas: [
    'About 95 % of a plant\'s dry mass comes from CO₂ and water; fourteen essential mineral elements come from the soil.',
    'Macronutrients (N, P, K, Ca, Mg, S) are needed in grams per kilogram of dry matter, micronutrients in milligrams.',
    'Deficiency symptoms show first in old leaves for mobile nutrients (N, P, K, Mg) and in young leaves for immobile ones (Ca, Fe, B, S).',
    'Soil charge, pH and transporters with Michaelis–Menten kinetics govern uptake; phosphate is scarce and immobile.',
    'Mycorrhizal fungi and nitrogen-fixing bacteria trade minerals for the plant\'s sugar; growth is limited by the scarcest nutrient.'
  ],
  pitfalls: [
    'Plants get their food from the soil — The soil supplies water and a few per cent of the dry mass as minerals. The carbon of sugar, wood and protein comes from CO₂ in the air.',
    'More fertiliser always means more yield — Returns diminish and are capped by whatever else is scarcest; the surplus nitrogen and phosphorus leach into rivers and groundwater.',
    'Yellow leaves always mean nitrogen deficiency — Where the yellowing is matters (old or young leaves, between veins or all over), and waterlogging, cold, root damage or disease can look the same.'
  ],
  formulas: [
    {
      name: 'Uptake of an ion by a root transporter',
      expr: 'I = Imax*C/(Km + C)', tex: 'I = \\frac{I_{\\max}\\,\\mathrm{[X]}}{K_m + \\mathrm{[X]}}',
      vars: {
        I: { name: 'uptake rate', q: false, unit: 'µmol/(g·h)' },
        Imax: { name: 'maximum uptake rate (per gram of root)', q: false, unit: 'µmol/(g·h)', value: 10, tex: 'I_{\\max}' },
        C: { name: 'ion concentration at the root surface', q: 'concentration', unit: 'µM', value: 20, tex: '\\mathrm{[X]}' },
        Km: { name: 'Michaelis constant of the transporter', q: 'concentration', unit: 'µM', value: 20, tex: 'K_m' }
      },
      solveFor: 'I',
      note: 'A high-affinity transporter such as the potassium carrier of barley roots (Km about 20 µM). Uptake saturates just as an enzyme does.',
      practice: { unknowns: ['I', 'C'] },
      stories: {
        I: 'A root transporter with Imax = {Imax} and Km = {Km} meets potassium at {C}. How fast does the root take it up?',
        C: 'A root with Imax = {Imax} and Km = {Km} takes up potassium at {I}. What is the concentration at its surface?'
      }
    },
    {
      name: 'Diminishing returns of fertiliser (Mitscherlich)',
      expr: 'Y = A*(1 - exp(-c*(x + b)))', tex: 'Y = A\\left(1 - e^{-c\\,(x + b)}\\right)',
      vars: {
        Y: { name: 'crop yield', q: false, unit: 't/ha' },
        A: { name: 'maximum yield when this nutrient is not limiting', q: false, unit: 't/ha', value: 10 },
        c: { name: 'efficiency factor', q: false, unit: 'ha/kg', value: 0.02 },
        x: { name: 'fertiliser nutrient applied', q: false, unit: 'kg/ha', value: 100 },
        b: { name: 'nutrient the soil supplies itself', q: false, unit: 'kg/ha', value: 40 }
      },
      solveFor: 'Y',
      note: 'An empirical curve for one nutrient with all others adequate; the numbers are illustrative.',
      practice: { unknowns: ['Y', 'x'] },
      stories: {
        Y: 'A field whose soil supplies {b} of nitrogen receives {x} more. With A = {A} and c = {c}, what yield can be expected?',
        x: 'How much fertiliser nitrogen must be added (soil supply {b}, A = {A}, c = {c}) to reach {Y}?'
      }
    },
    {
      name: 'Nutrient removed with a harvest',
      expr: 'm = 1000*Y*w', tex: 'm = Y\\,w',
      vars: {
        m: { name: 'nutrient removed', q: false, unit: 'kg/ha' },
        Y: { name: 'harvested yield (dry)', q: false, unit: 't/ha', value: 8 },
        w: { name: 'nutrient content of the harvested product', q: 'ratio', unit: '%', value: 2.1 }
      },
      note: 'The factor 1000 turns tonnes into kilograms. Wheat grain contains about 2 % nitrogen, 0.35 % phosphorus and 0.45 % potassium.',
      stories: {
        m: 'A wheat crop yields {Y} of grain containing {w} nitrogen. How much nitrogen leaves the field with the harvest?'
      }
    }
  ],
  examples: [
    {
      title: 'A transporter at low and high concentration',
      q: 'A potassium transporter has Km = 20 µM and Imax = 10 µmol g⁻¹ h⁻¹. Find the uptake rate at 5 µM and at 200 µM.',
      steps: [
        'At 5 µM: $I = 10 \\times 5/(20 + 5) = 2.0$ µmol g⁻¹ h⁻¹.',
        'At 200 µM: $I = 10 \\times 200/(20 + 200) = 9.1$ µmol g⁻¹ h⁻¹.',
        'Forty times the concentration gives only 4.5 times the uptake: the carrier saturates, as an enzyme does.'
      ],
      a: '2.0 and 9.1 µmol g⁻¹ h⁻¹.'
    },
    {
      title: 'Diminishing returns',
      q: 'With A = 10 t/ha, c = 0.02 ha/kg and a soil supply of 40 kg/ha, find the yield with 0, 50, 100 and 150 kg/ha of added nitrogen, and the gain from each extra 50 kg.',
      steps: [
        '$x = 0$: $10(1 - e^{-0.8}) = 5.51$ t/ha.',
        '$x = 50$: $10(1 - e^{-1.8}) = 8.35$ t/ha — a gain of 2.84 t.',
        '$x = 100$: $10(1 - e^{-2.8}) = 9.39$ t/ha — a gain of 1.04 t.',
        '$x = 150$: $10(1 - e^{-3.8}) = 9.78$ t/ha — a gain of only 0.39 t. Beyond some point the extra grain no longer pays for the fertiliser, and more of the nitrogen is lost to water.'
      ],
      a: '5.51, 8.35, 9.39 and 9.78 t/ha: gains of 2.84, 1.04 and 0.39 t.'
    },
    {
      title: 'What a harvest carries away',
      q: 'A wheat field yields 8 t/ha of grain with 2.1 % nitrogen. How much nitrogen is removed, and could a legume do the job of replacing it?',
      steps: [
        '$m = 8000\\ \\mathrm{kg} \\times 0.021 = 168$ kg of nitrogen per hectare.',
        'A clover-rich ley fixing 150–250 kg N per hectare per year could replace it — the reason legumes are rotated with cereals.'
      ],
      a: 'About 170 kg of nitrogen per hectare.'
    }
  ],
  quiz: [
    { q: 'The older leaves of a tomato plant turn evenly yellow while the young ones stay green. Which nutrient is most likely short?', choices: ['iron', 'nitrogen', 'calcium', 'boron'], a: 1, why: 'Nitrogen is mobile: the plant moves it from old leaves to young ones. Iron, calcium and boron are immobile and show first in young tissue.' },
    { q: 'A shrub on chalky soil has young leaves that are yellow between green veins. The likeliest cause is…', choices: ['magnesium deficiency', 'iron made unavailable by the high pH', 'too much nitrogen', 'potassium deficiency'], a: 1, why: 'Iron is insoluble in alkaline soils (lime-induced chlorosis); it is immobile, so the young leaves suffer. Magnesium deficiency would show in old leaves.' },
    { q: 'Most of the dry mass of a tree comes from minerals taken from the soil.', a: false, why: 'About 95 % of dry mass is C, H and O from CO₂ and water; van Helmont\'s soil lost only 57 g while his willow gained 75 kg.' },
    { q: 'A transporter has Km = 20 µM. At what concentration, in µM, does it run at 80 % of its maximum rate?', answer: 80, unit: 'µM', why: '0.8 = C/(20 + C) gives C = 4 × 20 = 80 µM.' },
    { q: 'Why are the root nodules of healthy legumes pink inside?', choices: ['they store anthocyanin', 'leghaemoglobin, which binds oxygen and protects nitrogenase', 'iron oxide from the soil', 'the colour of the Rhizobium cell walls'], a: 1, why: 'Leghaemoglobin keeps free oxygen very low (nitrogenase is destroyed by O₂) while still delivering oxygen for the bacteria\'s respiration.' }
  ],
  applications: [
    'Fertiliser labels give N–P–K contents; soil and leaf tests decide how much a field needs.',
    'Hydroponics and vertical farms feed plants a complete nutrient solution with no soil at all.',
    'Crop rotation with legumes and cover crops replaces nitrogen biologically and cuts fertiliser runoff that causes algal blooms.',
    'Inoculating seeds with rhizobia or mycorrhizal fungi, and breeding crops that take up phosphate better.'
  ],
  history: 'Van Helmont\'s willow (published 1648) was the first quantitative plant experiment. Carl Sprengel (1828) and Justus von Liebig (1840s) set out the law of the minimum; Julius Sachs and Wilhelm Knop grew plants in water culture around 1860, showing which elements are essential. Hermann Hellriegel and Hermann Wilfarth showed in 1886 that legumes gain nitrogen from the air through their nodules, and Fritz Haber and Carl Bosch made ammonia industrially from 1913.',
  sim: 'plant-nutrients'
},

{
  id: 'plant-hormones', parent: 'plant-life', title: 'Plant hormones', level: 2,
  short: 'Plants coordinate their growth with a handful of small signalling molecules — auxin, gibberellins, cytokinins, ethylene and abscisic acid, joined by brassinosteroids, jasmonates, salicylic acid and strigolactones. Each has many effects, which depend on the tissue, the concentration and the other hormones present.',
  keywords: ['plant hormones', 'phytohormones', 'plant growth regulators', 'auxin', 'IAA', 'gibberellin', 'GA', 'cytokinin', 'ethylene', 'abscisic acid', 'ABA', 'fruit ripening', 'apical dominance', 'acid growth', 'bolting', 'tissue culture', '2,4-D', 'strigolactone', 'jasmonate', 'salicylic acid', 'Green Revolution'],
  prereq: ['cell-signalling', 'plant-tissues', 'eukaryotic-regulation'],
  related: ['tropisms', 'seeds-germination', 'transpiration', 'flowering-reproduction', 'photoperiodism', 'phloem-transport', 'gmos', 'animal-hormones', 'medicine:hormones'],
  body: `
Animals make hormones in glands and send them round in the blood. Plants have no glands and no heart, yet they coordinate root and shoot, time their flowering and ripening, and respond to drought and attack. They do it with a few small molecules, made by ordinary cells and active at nanomolar to micromolar concentrations, that act near where they are made or travel cell to cell, in the xylem, in the phloem — or, in the case of ethylene, through the air. The same hormone can have opposite effects in different tissues, and much of what a plant does is set by the *balance* between hormones rather than by any one of them.

| Hormone | Made mainly in | Main effects | Put to use |
|---|---|---|---|
| **Auxin** (indole-3-acetic acid) | shoot tips, young leaves, seeds | cell elongation, tropisms, apical dominance, root formation, vascular patterning, fruit set | rooting powders; 2,4-D as a selective weedkiller |
| **Gibberellins** | young leaves, seeds, roots | stem elongation and bolting, germination, fruit growth | larger seedless grapes; malting barley |
| **Cytokinins** | root tips, seeds | cell division, shoot formation, releasing side buds, delaying leaf ageing | tissue culture and micropropagation |
| **Ethylene** (a gas) | ripening fruit, ageing or stressed tissue | ripening, leaf and fruit fall, the triple response of seedlings | ripening rooms for bananas; blockers keep apples fresh |
| **Abscisic acid** | roots and leaves under drought, seeds | closes stomata, seed dormancy and drying tolerance | drought research |

### Auxin: growth with a direction
Auxin is carried from cell to cell in one direction — down the shoot from the tip — by PIN proteins that sit at one end of each cell and pump it out, at about a centimetre an hour. Where it arrives it makes cells elongate by the **acid-growth** mechanism: it activates the plasma-membrane proton pump, the cell wall acidifies to pH 4.5–5, proteins called expansins loosen the links between cellulose fibres, and turgor stretches the wall. Inside the cell, auxin acts as a molecular glue that lets its receptor mark repressor proteins for destruction, switching on growth genes. Sensitivity differs enormously: in classic measurements roots grow fastest at around $10^{-10}$ M auxin and are already inhibited at $10^{-7}$ M, a concentration at which stems are only starting to respond; stems peak near $10^{-5}$ M. Auxin from the shoot tip also suppresses the buds below it (**apical dominance**): pinch out the tip of a basil plant and it bushes out. Because it steers growth, auxin redistributed to one side of a stem or root makes it bend — see [[tropisms]].

### Gibberellins and the Green Revolution
Rice farmers in Japan knew a "foolish seedling" disease in which plants shot up, spindly, and fell over. In 1926 Eiichi Kurosawa showed that the fungus responsible releases a growth substance, later named gibberellin. Gibberellins make stems elongate and rosette plants bolt, and in a germinating cereal grain they tell the aleurone layer to secrete amylase, which digests the starch store (see [[seeds-germination]]). They work by destroying DELLA proteins, which restrain growth. The semi-dwarf wheats of the Green Revolution carry altered DELLA proteins that ignore gibberellin, and semi-dwarf rice makes less of it: their short, sturdy stems carry heavy heads of grain without falling over, which helped world cereal yields to double between the 1960s and the 1990s.

### Cytokinins: division and balance
Cytokinins promote cell division. In 1957 Folke Skoog and Carlos Miller found that the ratio of auxin to cytokinin decides what a lump of cultured tobacco tissue becomes: much auxin gives roots, much cytokinin gives shoots, and a balance gives an undifferentiated callus. That recipe underlies the cloning of orchids, bananas and potatoes in tissue culture.

### Ethylene: the ripening gas
In climacteric fruits — bananas, tomatoes, apples, avocados — ripening starts with a burst of respiration and ethylene, and ethylene triggers more ethylene, so one ripe fruit hastens its neighbours. As little as 0.1 µL of ethylene per litre of air can start it. Bananas are shipped green and ripened with ethylene where they are sold; apples are kept for months in cold, low-oxygen stores, sometimes with a compound that blocks the ethylene receptor. Citrus, grapes and strawberries are non-climacteric and do not ripen further once picked. A dark-grown seedling exposed to ethylene grows short, thick and sideways — the **triple response** that helps it push round a stone.

### Abscisic acid: the stress signal
When soil dries, abscisic acid (ABA) rises in roots and leaves, and within minutes it closes the stomata: guard cells open anion channels, lose potassium and water, and go slack ([[transpiration]]). ABA also makes developing seeds dormant and tolerant of drying; maize mutants that cannot make it germinate on the cob.

### And more
Brassinosteroids are steroid hormones, as in animals. Jasmonates organise defence against chewing insects, and salicylic acid against pathogens — the willow-bark remedy that led to aspirin. Strigolactones restrain branching and call mycorrhizal fungi to the root, a signal that parasitic witchweed seeds eavesdrop on to know when to germinate. Florigen, the flowering signal, is a protein carried in the phloem ([[photoperiodism]]).
`,
  ideas: [
    'Plant hormones are small molecules made by ordinary cells and active at nanomolar to micromolar concentrations; ethylene is a gas.',
    'Auxin travels down from the shoot tip by polar transport, makes cells elongate by acid growth, and sets apical dominance and tropic bending.',
    'Gibberellins lengthen stems and trigger germination; cytokinins drive cell division; the auxin-to-cytokinin ratio decides roots or shoots in tissue culture.',
    'Ethylene ripens climacteric fruit and makes leaves fall; abscisic acid closes stomata in drought and keeps seeds dormant.',
    'Effects depend on tissue, concentration and hormone balance: the auxin level that speeds stem growth inhibits roots.'
  ],
  pitfalls: [
    'Each hormone has one job — Auxin alone affects elongation, branching, rooting, fruit set and vascular patterning; what a hormone does depends on the tissue, the dose and the other hormones.',
    'More hormone means more growth — Responses have optima, and tissues differ: a concentration that speeds stem growth stops roots.',
    'Plant hormones come from special glands — They are made by many ordinary cells, often act close to where they are made, and ethylene even passes between plants through the air.'
  ],
  formulas: [
    {
      name: 'Dose–response of a hormone (Hill)',
      expr: 'f = C^n/(EC50^n + C^n)', tex: 'f = \\frac{\\mathrm{[H]}^n}{(\\mathrm{EC}_{50})^n + \\mathrm{[H]}^n}',
      vars: {
        f: { name: 'response as a fraction of the maximum', q: 'ratio', unit: '%' },
        C: { name: 'hormone concentration', q: 'concentration', unit: 'nM', value: 300, tex: '\\mathrm{[H]}' },
        EC50: { name: 'concentration giving half the maximum response', q: 'concentration', unit: 'nM', value: 100, tex: '\\mathrm{EC}_{50}' },
        n: { name: 'Hill coefficient (steepness)', value: 1, min: 0.2, max: 6 }
      },
      solveFor: 'f',
      note: 'Many hormone responses rise from 10 % to 90 % over a hundredfold change in concentration (n ≈ 1), which is why they are plotted against the logarithm of the dose.',
      practice: { unknowns: ['f', 'C'] },
      stories: {
        f: 'A response has EC50 = {EC50} and Hill coefficient {n}. What fraction of the maximum does {C} of hormone give?',
        C: 'What hormone concentration gives {f} of the maximum response, if EC50 = {EC50} and n = {n}?'
      }
    },
    {
      name: 'How much the dose must change to go from 10 % to 90 % response',
      expr: 'S = 81^(1/n)', tex: 'S = \\frac{C_{90}}{C_{10}} = 81^{1/n}',
      vars: {
        S: { name: 'ratio of the concentrations giving 90 % and 10 % response' },
        n: { name: 'Hill coefficient', value: 1, min: 0.2, max: 6 }
      },
      note: 'From the Hill equation: C₉₀/C₁₀ = (9 × 9)^(1/n). A steep, switch-like response has a large n.',
      stories: { S: 'A response has a Hill coefficient of {n}. By what factor must the hormone concentration rise to take it from 10 % to 90 % of its maximum?' }
    }
  ],
  examples: [
    {
      title: 'One apple in a closed box',
      q: 'A 200-g ripening apple gives off ethylene at 50 µL per kilogram per hour. It is shut in a 5-litre box with a green banana. After one hour, is there enough ethylene to trigger ripening (about 0.1–1 µL per litre)?',
      steps: [
        'Rate from the apple: $0.2\\ \\mathrm{kg} \\times 50 = 10$ µL of ethylene per hour.',
        'After one hour: $10\\ \\mathrm{µL} / 5\\ \\mathrm{L} = 2$ µL per litre (2 ppm).',
        'That is above the trigger level, and the banana, once started, makes its own ethylene. A paper bag works the same way — which is why "one bad apple spoils the barrel".'
      ],
      a: 'Yes — about 2 µL/L after an hour, well above the threshold.'
    },
    {
      title: 'Graded and switch-like responses',
      q: 'Compare two responses with EC50 = 100 nM: one with n = 1 and one with n = 2. What concentrations give 10 % and 90 % response in each case?',
      steps: [
        'Solving $f = C^n/(EC_{50}^n + C^n)$ gives $C = EC_{50}\\,(f/(1-f))^{1/n}$.',
        '$n = 1$: $C_{10} = 100/9 = 11$ nM and $C_{90} = 900$ nM — a factor of 81.',
        '$n = 2$: $C_{10} = 100/3 = 33$ nM and $C_{90} = 300$ nM — a factor of 9: a steeper, more switch-like response.'
      ],
      a: '11–900 nM for n = 1 (×81), 33–300 nM for n = 2 (×9).'
    }
  ],
  quiz: [
    { q: 'Which hormone would you use to ripen green bananas in a warehouse?', choices: ['auxin', 'gibberellin', 'ethylene', 'abscisic acid'], a: 2, why: 'Ethylene triggers the climacteric burst of respiration and ripening, and the fruit then makes more ethylene itself.' },
    { q: 'A gardener pinches out the shoot tip of a basil plant. Why does it become bushier?', choices: ['the wound releases ethylene, which makes branches', 'removing the auxin source lifts apical dominance, so side buds grow', 'more light reaches the roots', 'gibberellin moves up from the roots'], a: 1, why: 'Auxin from the tip suppresses the buds below it; without it (and with cytokinin from the roots) the side buds grow out.' },
    { q: 'Abscisic acid opens the stomata of a thirsty plant so it can take up more water.', a: false, why: 'ABA closes the stomata to save water; uptake is driven by transpiration, so closing them cuts water loss at the cost of photosynthesis.' },
    { q: 'In tissue culture, a high ratio of cytokinin to auxin makes a callus produce…', choices: ['roots', 'shoots', 'more undifferentiated callus', 'flowers'], a: 1, why: 'Skoog and Miller: high cytokinin gives shoots, high auxin gives roots, a balance keeps the callus growing.' },
    { q: 'For a response with Hill coefficient n = 1, by what factor must the hormone concentration rise to go from 10 % to 90 % of the maximum?', answer: 81, why: 'C₉₀/C₁₀ = 81^(1/n) = 81 for n = 1.' }
  ],
  applications: [
    'Synthetic auxins: 2,4-D and related weedkillers kill broadleaved weeds in lawns and cereal fields; rooting powders help cuttings root.',
    'Gibberellin sprays make seedless grapes larger; gibberellin blockers keep cereal straw short so crops stand up in wind and rain.',
    'Ethylene ripening rooms, controlled-atmosphere stores and receptor blockers let fruit be sold year round.',
    'Micropropagation clones thousands of disease-free plants from a few cells by adjusting auxin and cytokinin.'
  ],
  history: 'The Darwins\' "influence" (1880) was named auxin by Frits Went in 1928 and identified as indole-3-acetic acid in 1934. Gibberellin came from Kurosawa\'s foolish-seedling fungus (1926) and was crystallised in Japan in 1938. Kinetin, the first cytokinin, was found in 1955 in autoclaved herring-sperm DNA. Dimitry Neljubow showed in 1901 that ethylene in illuminating gas caused the triple response of pea seedlings, and abscisic acid was identified in 1963–65 by two groups studying leaf fall and bud dormancy.',
  sim: 'plant-phototropism'
},

{
  id: 'tropisms', parent: 'plant-life', title: 'Tropisms and plant movement', level: 2,
  short: 'A tropism is growth towards or away from a stimulus: shoots bend to light (phototropism), roots grow down and shoots up (gravitropism), tendrils coil round what they touch (thigmotropism). Most tropisms work by growing faster on one side, steered by auxin moved to that side; fast movements such as the snap of a Venus flytrap work by water pressure instead.',
  keywords: ['tropism', 'phototropism', 'gravitropism', 'geotropism', 'thigmotropism', 'coleoptile', 'Darwin', 'Boysen-Jensen', 'Paál', 'Went', 'auxin', 'Cholodny–Went', 'phototropin', 'blue light', 'statolith', 'amyloplast', 'root cap', 'tendril', 'nastic movement', 'Mimosa', 'Venus flytrap', 'heliotropism'],
  prereq: ['plant-hormones', 'plant-tissues', 'cell-signalling'],
  related: ['photoperiodism', 'seeds-germination', 'biological-rhythms', 'scientific-method-bio', 'experimental-design', 'physics:viscosity', 'physics:em-spectrum'],
  body: `
Plants move all the time, only slowly. Speeded up, a film of a bean seedling shows its shoot circling, feeling for a support, turning towards the window, its root curving down wherever it is pointed. A **tropism** is a growth movement whose direction is set by the direction of the stimulus — towards it (positive) or away (negative). A **nastic movement**, by contrast, goes the same way whatever the direction of the stimulus, like a tulip opening in warmth or a mimosa leaf folding when touched.

### Bending by growing
A shoot or root bends when one side grows faster than the other. An oat coleoptile — the sheath around a grass seedling's first leaf — is about 1.5 mm thick and grows mainly in the 10 mm below its tip. If its shaded side lengthens by 9.5 % an hour and its lit side by 6 %, it bends by about 27° in two hours. Nothing shrinks and nothing is pushed: the shaded side simply grows more.

### Phototropism and the discovery of auxin
The experiments that found the first plant hormone were all done on grass coleoptiles lit from one side.

| When | Who | What they did | What happened | What it showed |
|---|---|---|---|---|
| 1880 | Charles and Francis Darwin | cut off the tip | no bending | the tip is needed |
| | | covered the tip with an opaque cap | no bending | the tip senses the light |
| | | covered the tip with a transparent cap | bends | the cap itself is harmless |
| | | covered the bending zone with an opaque sleeve | bends | a signal travels down from the tip |
| 1913 | Peter Boysen-Jensen | put the cut tip back on a block of gelatin | bends | the signal crosses gelatin: it is a chemical |
| | | put the tip back on a sheet of mica | no bending | it cannot cross an impermeable barrier |
| 1919 | Árpád Paál | put the tip back off-centre, in darkness | bends away from the side with the tip | the chemical promotes growth where it arrives |
| 1928 | Frits Went | let tips stand on agar, then set the agar off-centre on a decapitated coleoptile in darkness | bends away from the block, more with more tips | the chemical can be collected and measured: auxin |

Went's **Avena curvature test** was the first bioassay for a plant hormone: within limits, the angle is proportional to the auxin in the block. Today we know the light is sensed by **phototropins**, blue-light receptors (most active near 450 nm) in the tip. Within minutes, auxin carriers are redirected so that auxin moves towards the shaded side — measurements found roughly two-thirds of it there — and flows down to the growing zone, where the shaded side elongates faster: the **Cholodny–Went** model.

### Gravitropism: which way is down?
Roots grow down and shoots up even in darkness. The sensors are **statoliths** — amyloplasts, plastids packed with dense starch — which settle to the lower side of cells in the root cap and in the shoot's endodermis within minutes of the plant being tipped over. Their settling redirects auxin carriers so that auxin gathers on the lower side. In a shoot, more auxin means faster growth, so the lower side outgrows the upper and the shoot curves up. In a root, the same concentration *inhibits* elongation, so the upper side outgrows the lower and the root curves down. Remove the root cap and a root loses its sense of direction; mutants without starch still respond, but weakly. In 1806 Thomas Knight grew seedlings on a spinning wheel: the roots grew outwards and the shoots inwards, following the centrifugal force instead of gravity.

### Touch, and fast movements
**Tendrils** of peas and cucumbers coil round a support within minutes to hours of touching it, by faster growth on the outer side. Plants shaken by wind or brushed every day grow shorter and sturdier (**thigmomorphogenesis**). The fastest plant movements are not growth at all: the leaflets of *Mimosa pudica* fold within a second or two when motor cells at their bases lose water, and a Venus flytrap snaps shut in about a tenth of a second once two trigger hairs have been touched within about half a minute — the leaf flips from one curved shape to another like a snap-hair clip. Young sunflowers track the Sun across the sky by growing faster on the east side of the stem by day and on the west side by night, guided by their circadian clock; the mature heads end up facing east.
`,
  ideas: [
    'A tropism is directed growth towards or away from a stimulus; a nastic movement has a fixed direction whatever the stimulus.',
    'Bending comes from differential growth: the faster-growing side becomes the outside of the curve.',
    'The Darwins, Boysen-Jensen, Paál and Went showed that a chemical made in the tip — auxin — moves down and promotes growth where it arrives.',
    'Blue light (phototropins) and sedimenting starch statoliths (gravity) redirect auxin to one side: shoots bend up and towards light, roots bend down because auxin inhibits their elongation.',
    'Fast movements (Mimosa, Venus flytrap) use turgor changes and elastic snaps, not growth.'
  ],
  pitfalls: [
    'Light shrinks or burns the lit side of a shoot — Both sides keep growing; the shaded side, receiving more auxin, simply grows faster.',
    'Roots grow down because they are heavy — Roots actively push down against resistance. They sense gravity with settling starch grains in the root cap and steer by growing unevenly.',
    'The same hormone always has the same effect — Auxin on the lower side of a horizontal organ makes a shoot bend up but a root bend down, because root cells are inhibited by concentrations that stimulate stem cells.'
  ],
  formulas: [
    {
      name: 'Bending by differential growth',
      expr: 'theta = (es - el)*L*t/w', tex: '\\theta = \\frac{(\\varepsilon_s - \\varepsilon_l)\\,L\\,t}{w}',
      vars: {
        theta: { name: 'bending angle', q: 'angle', unit: '°', signed: true, tex: '\\theta' },
        es: { name: 'relative growth rate of the shaded (faster) side', q: 'rate', unit: '1/h', value: 0.095, tex: '\\varepsilon_s' },
        el: { name: 'relative growth rate of the lit (slower) side', q: 'rate', unit: '1/h', value: 0.06, tex: '\\varepsilon_l' },
        L: { name: 'length of the growing zone', q: 'length', unit: 'mm', value: 10 },
        t: { name: 'time', q: 'time', unit: 'h', value: 2 },
        w: { name: 'width of the organ', q: 'length', unit: 'mm', value: 1.5 }
      },
      solveFor: 'theta',
      note: 'For a uniform growing zone and modest angles: the curvature grows at the difference in strain rates divided by the width, and the angle is curvature times zone length.',
      practice: { unknowns: ['theta', 'el', 't'] },
      stories: {
        theta: 'A coleoptile {w} wide grows over a zone {L} long; its shaded side elongates at {es} and its lit side at {el}. How far does it bend in {t}?',
        t: 'How long does a coleoptile ({w} wide, growing zone {L}, sides growing at {es} and {el}) take to bend by {theta}?'
      }
    },
    {
      name: 'Settling speed of a statolith (Stokes)',
      expr: 'v = 2*r^2*drho*g/(9*eta)', tex: 'v = \\frac{2\\,r^2\\,\\Delta\\rho\\,g}{9\\,\\eta}',
      vars: {
        v: { name: 'settling speed', q: 'speed', unit: 'µm/s' },
        r: { name: 'radius of the amyloplast', q: 'length', unit: 'µm', value: 1 },
        drho: { name: 'density excess over the cytoplasm', q: 'density', unit: 'kg/m³', value: 500, tex: '\\Delta\\rho' },
        g: { const: 'g' },
        eta: { name: 'effective viscosity of the cytoplasm', q: 'viscosity', unit: 'mPa·s', value: 50, tex: '\\eta' }
      },
      note: 'Cytoplasm is not a simple liquid — its network of filaments slows statoliths unevenly — so the effective viscosity is uncertain; the value here gives settling of about a micrometre a minute.',
      stories: {
        v: 'A starch-filled amyloplast of radius {r} is {drho} denser than cytoplasm of effective viscosity {eta}. How fast does it sink?',
        r: 'How large must a statolith be to sink at {v} through cytoplasm of viscosity {eta}, being {drho} denser?'
      }
    }
  ],
  examples: [
    {
      title: 'How fast does a coleoptile turn to the light?',
      q: 'An oat coleoptile 1.5 mm wide grows over the 10 mm below its tip. Under light from one side its shaded side elongates at 9.5 % per hour and its lit side at 6 % per hour. How far does it bend in two hours?',
      steps: [
        'Difference in strain rates: $0.095 - 0.060 = 0.035$ per hour.',
        'Curvature builds up at $0.035/1.5\\ \\mathrm{mm} = 0.0233$ rad per mm per hour; over the 10-mm zone that is 0.233 rad per hour.',
        'In two hours: $0.467$ rad $= 26.7°$.'
      ],
      a: 'About 27° in two hours.'
    },
    {
      title: 'Went\'s bioassay as a measuring instrument',
      q: 'On decapitated coleoptiles in darkness, a standard agar block gives a curvature of 10°. A block from an experiment gives 25°. Assuming the response is in its proportional range, how does its auxin content compare?',
      steps: [
        'In the linear range the angle is proportional to the auxin in the block: $\\theta = kC$.',
        '$C/C_{std} = 25/10 = 2.5$.',
        'At high auxin levels the curvature levels off, so experimenters diluted strong samples until they fell in the proportional range — the same logic as any standard curve.'
      ],
      a: 'About 2.5 times as much auxin as the standard.'
    },
    {
      title: 'How fast do statoliths fall?',
      q: 'Estimate the settling speed of an amyloplast of radius 1 µm, 500 kg/m³ denser than the cytoplasm, taking an effective viscosity of 50 mPa·s. How long does it take to fall 10 µm across a cell?',
      steps: [
        '$v = 2r^2\\Delta\\rho g/(9\\eta) = 2 \\times 10^{-12} \\times 500 \\times 9.81/(9 \\times 0.05) = 2.2\\times10^{-8}$ m/s.',
        'That is 0.022 µm/s, about 1.3 µm per minute.',
        'Crossing 10 µm takes about 8 minutes — consistent with roots starting to respond a few minutes after being turned on their side.'
      ],
      a: 'About 1.3 µm per minute: some 8 minutes to cross a cell.'
    }
  ],
  quiz: [
    { q: 'The Darwins covered the tip of a coleoptile with an opaque cap, and it did not bend towards the light. What did this show?', choices: ['light kills the tip', 'the tip is where light is sensed', 'the cap blocked water uptake', 'bending needs a transparent cap'], a: 1, why: 'With the tip shaded the coleoptile grew straight, while an opaque sleeve over the bending zone did not stop bending: the tip perceives light and a signal travels down.' },
    { q: 'Went placed an auxin-containing agar block on the left half of a decapitated coleoptile, in darkness. Which way did it bend?', choices: ['to the left, towards the block', 'to the right, away from the block', 'it did not bend', 'it bent towards the nearest light'], a: 1, why: 'The left side received auxin and grew faster, so the coleoptile curved away from the block.' },
    { q: 'A root lying on its side curves downwards because auxin collects on its lower side and…', choices: ['stimulates growth there', 'inhibits elongation there, so the upper side grows faster', 'makes the root heavier', 'dissolves the root cap'], a: 1, why: 'Root cells are inhibited by auxin levels that stimulate shoot cells, so the lower side lags and the root bends down.' },
    { q: 'A Mimosa pudica leaf folds within a second or two when touched because its cells grow faster on one side.', a: false, why: 'Growth is far too slow. Motor cells at the leaf base lose potassium and water and go slack; the movement is reversed within minutes as they refill.' },
    { q: 'Which colour of light is most effective at causing phototropic bending?', choices: ['red', 'far-red', 'blue', 'green'], a: 2, why: 'Phototropins absorb blue light (around 450 nm). Red and far-red light act through phytochrome, which controls other responses such as flowering.' }
  ],
  applications: [
    'Rotating houseplants on a windowsill keeps them straight; greenhouse lighting from above prevents leaning seedlings.',
    'Cereal crops flattened by wind and rain lift themselves again by gravitropic bending at their stem nodes.',
    'Growing plants in space: without gravity, roots and shoots are oriented with light and water instead.',
    'Engineers copy the coiling of tendrils and the snap of the flytrap in soft robots and fast-acting valves.'
  ],
  history: 'Charles Darwin and his son Francis described their coleoptile experiments in The Power of Movement in Plants (1880). Boysen-Jensen (1913), Paál (1919) and Went (1928) turned the "influence" into a chemical, and Nikolai Cholodny and Went independently proposed in the 1920s that tropisms come from lateral movement of auxin. Thomas Knight\'s spinning-wheel experiment of 1806 had already shown that plants respond to gravity as a force.',
  sim: 'plant-phototropism'
},

{
  id: 'flowering-reproduction', parent: 'plant-life', title: 'Flowers, pollination and fertilisation', level: 2,
  short: 'A flower is a shoot built for sex: stamens make pollen, carpels hold ovules. Wind or animals carry pollen to a stigma; a pollen tube grows down to an ovule and delivers two sperm cells — one fertilises the egg, the other joins two nuclei of the central cell to make the endosperm that will feed the embryo. This double fertilisation is found only in flowering plants.',
  keywords: ['flower', 'pollination', 'fertilisation', 'double fertilisation', 'stamen', 'anther', 'carpel', 'pistil', 'ovary', 'ovule', 'stigma', 'style', 'pollen', 'pollen tube', 'embryo sac', 'endosperm', 'triploid', 'wind pollination', 'insect pollination', 'pollination syndrome', 'self-incompatibility', 'ABC model', 'fruit', 'angiosperm'],
  prereq: ['meiosis', 'plant-diversity', 'plant-tissues'],
  related: ['seeds-germination', 'photoperiodism', 'coevolution', 'speciation', 'plant-hormones', 'ecosystem-services', 'mendels-laws', 'physics:viscosity', 'medicine:allergy'],
  body: `
Flowering plants — the **angiosperms**, about 300,000 named species — appear in the fossil record at least 130 million years ago and within a few tens of millions of years dominated most landscapes. Much of their success lies in the flower: a short shoot whose leaves have become organs of reproduction, often recruiting animals as couriers.

### The parts of a flower
From the outside in, a flower has up to four whorls: **sepals** (the calyx, which protects the bud), **petals** (the corolla, which advertises), **stamens** (each an **anther** on a filament, where pollen is made) and **carpels** (each a sticky **stigma**, a **style** and an **ovary** containing **ovules**). In the **ABC model**, worked out in 1991 from mutant flowers of thale cress and snapdragon, three classes of genes act in overlapping zones: A alone makes sepals, A with B petals, B with C stamens, and C alone carpels. Lose the B genes and petals become sepals and stamens become carpels.

### Two generations in one flower
Plants alternate between a diploid spore-making generation and a haploid gamete-making one. In a flowering plant the haploid generation is reduced to a few cells hidden in the flower. Meiosis in the anther makes microspores that become **pollen grains**, each with a tube cell and a generative cell that divides into **two sperm cells**. Meiosis in the ovule leaves one surviving megaspore that divides into the **embryo sac**: typically seven cells with eight nuclei — an egg flanked by two synergids, a large central cell with two **polar nuclei**, and three antipodal cells.

### Pollination: getting pollen to a stigma
| | Wind-pollinated | Animal-pollinated |
|---|---|---|
| Flowers | small, green or dull, no scent or nectar | showy, often scented, with nectar |
| Pollen | small, smooth, dry and abundant | sticky or spiny, less of it |
| Stigmas | large, feathery, exposed | compact and sticky |
| Pollen grains per ovule | often tens of thousands | typically hundreds to a few thousand |
| Examples | grasses and cereals, oak, birch, hazel | apple, sunflower, sage, orchids |

About 87 % of flowering-plant species are pollinated by animals — bees above all, but also flies, beetles, moths, birds and bats — and about three-quarters of the leading food crops benefit from them. Flowers and pollinators have shaped each other ([[coevolution]]): bee flowers are blue, purple or yellow, often with ultraviolet guides to the nectar, but rarely pure red, which bees see poorly; bird flowers are red, tubular, scentless and full of dilute nectar; bat and moth flowers open at night, pale and strongly scented. In 1862 Darwin examined a Madagascan orchid whose nectar lies at the bottom of a spur some 30 cm long and predicted a moth with a tongue to match; one was described in 1903.

Many plants avoid fertilising themselves. Some have **self-incompatibility** genes that make a stigma reject pollen carrying the same allele as the plant; others ripen their anthers and stigmas at different times, or have separate male and female plants (holly, kiwifruit, date palm).

### Double fertilisation
A compatible pollen grain takes up water on the stigma and grows a tube that pushes down through the style — in maize, whose "silks" are styles up to 30 cm long, at about a centimetre an hour — guided by chemical signals from the synergids. The tube enters the ovule and bursts, releasing both sperm:

- one sperm fuses with the **egg** → the diploid **zygote**, which becomes the embryo;
- the other fuses with the **two polar nuclei** → a triploid (3n) cell that divides into the **endosperm**, the food store of the seed.

This **double fertilisation** makes the seed's food only when an embryo is actually formed, so no resources are wasted on unfertilised ovules. The endosperm of wheat, rice and maize grains feeds much of humanity. Afterwards the ovule becomes the seed, and the ovary wall becomes the fruit, which helps to disperse it ([[seeds-germination]]).
`,
  ideas: [
    'A flower has sepals, petals, stamens (anthers make pollen) and carpels (the ovary holds ovules); the ABC genes decide which whorl becomes which organ.',
    'Pollen grains and embryo sacs are tiny haploid gametophytes; the pollen grain delivers two sperm cells.',
    'Wind-pollinated flowers are dull with abundant light pollen and feathery stigmas; animal-pollinated flowers advertise with colour, scent and nectar.',
    'In double fertilisation one sperm fertilises the egg (zygote, 2n) and the other fuses with two polar nuclei (endosperm, 3n).',
    'After fertilisation the ovule becomes a seed and the ovary a fruit.'
  ],
  pitfalls: [
    'Pollination and fertilisation are the same thing — Pollination is pollen arriving on a stigma; fertilisation comes hours or days later, when a pollen tube delivers sperm to an ovule, and it may never happen if the pollen is incompatible.',
    'A pollen grain is a sperm cell — It is a tiny male plant of two or three cells that makes two sperm cells and a tube to deliver them.',
    'Double fertilisation means two pollen grains fertilise one ovule — One pollen tube delivers two sperm; one fertilises the egg, the other the central cell.'
  ],
  formulas: [
    {
      name: 'Settling speed of a pollen grain (Stokes)',
      expr: 'v = d^2*rho*g/(18*eta)', tex: 'v = \\frac{d^2\\,\\rho\\,g}{18\\,\\eta}',
      vars: {
        v: { name: 'settling speed in still air', q: 'speed', unit: 'cm/s' },
        d: { name: 'diameter of the pollen grain', q: 'length', unit: 'µm', value: 25 },
        rho: { name: 'density of the pollen grain', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' },
        eta: { name: 'viscosity of air', q: 'viscosity', unit: 'mPa·s', value: 0.0181, tex: '\\eta' }
      },
      note: 'Stokes\' law for a sphere, valid when the Reynolds number is below about 1 — true for grains up to about 60–80 µm; for maize pollen (90 µm) it is already stretched.',
      practice: { unknowns: ['v', 'd'] },
      stories: {
        v: 'A pollen grain {d} across, of density {rho}, falls through air of viscosity {eta}. How fast does it settle?',
        d: 'What diameter of pollen grain (density {rho}) settles at {v} in air?'
      }
    },
    {
      name: 'How far the wind carries it',
      expr: 'x = H*u/vs', tex: 'x = \\frac{H\\,u}{v_s}',
      vars: {
        x: { name: 'distance travelled before landing', q: 'length', unit: 'km' },
        H: { name: 'height of release', q: 'length', unit: 'm', value: 20 },
        u: { name: 'wind speed', q: 'speed', unit: 'm/s', value: 3 },
        vs: { name: 'settling speed', q: 'speed', unit: 'cm/s', value: 1.9, tex: 'v_s' }
      },
      note: 'Steady wind and no turbulence. Real gusts and rising air carry a fraction of the pollen far further — hundreds of kilometres for birch and pine.',
      stories: {
        x: 'Pollen that settles at {vs} is released {H} up into a {u} wind. How far does it travel?',
        H: 'From what height must pollen settling at {vs} be released to travel {x} in a {u} wind?'
      }
    }
  ],
  examples: [
    {
      title: 'Birch pollen and maize pollen',
      q: 'Birch pollen is about 22 µm across and maize pollen about 90 µm (take both at 1000 kg/m³; air 0.0181 mPa·s). Find their settling speeds, and how far each travels in a steady 3 m/s wind from a birch crown at 20 m and a maize tassel at 2.5 m.',
      steps: [
        'Birch: $v = (22\\times10^{-6})^2 \\times 1000 \\times 9.81/(18 \\times 1.81\\times10^{-5}) = 0.015$ m/s = 1.5 cm/s.',
        'Maize: the diameter is 4.1 times larger, so it falls $4.1^2 \\approx 17$ times faster: about 0.24 m/s.',
        'Distances: birch $20 \\times 3/0.015 \\approx 4000$ m; maize $2.5 \\times 3/0.24 \\approx 31$ m.',
        'Small grains released high travel kilometres (hence regional hay-fever seasons); heavy maize pollen mostly lands within a few tens of metres, though some drifts much further.'
      ],
      a: 'Birch about 1.5 cm/s and 4 km; maize about 24 cm/s and 31 m.'
    },
    {
      title: 'Counting chromosomes in a maize kernel',
      q: 'Maize has 2n = 20 chromosomes. How many chromosomes are there in a sperm cell, the egg, the zygote, an endosperm cell and a cell of the kernel\'s outer skin (the ovary wall)?',
      steps: [
        'Sperm and egg are haploid: 10 each.',
        'Zygote = sperm + egg: 20 (diploid), and so is every cell of the embryo.',
        'Endosperm = sperm + two polar nuclei: 10 + 10 + 10 = 30 (triploid).',
        'The outer skin comes from the mother plant\'s ovary wall: 20. A kernel is a mosaic of three genetic individuals — which is why pollen from a sweetcorn plant can change the endosperm, and so the kernel colour or sweetness, of the plant it lands on.'
      ],
      a: '10, 10, 20, 30 and 20.'
    }
  ],
  quiz: [
    { q: 'The endosperm of a flowering plant is…', choices: ['diploid, made from the egg', 'haploid, the female gametophyte itself', 'triploid, made from a sperm and two polar nuclei', 'tetraploid, made from two sperm and two polar nuclei'], a: 2, why: 'The second sperm fuses with the two polar nuclei of the central cell, giving a 3n endosperm.' },
    { q: 'Which feature suggests that a flower is wind-pollinated?', choices: ['bright petals with nectar guides', 'large feathery stigmas held out in the air', 'a strong scent at night', 'a long nectar spur'], a: 1, why: 'Wind-pollinated flowers need large exposed stigmas to catch drifting pollen; they have no use for colour, scent or nectar.' },
    { q: 'A red, tubular, scentless flower with plenty of dilute nectar is most likely pollinated by…', choices: ['bees', 'moths', 'birds', 'wind'], a: 2, why: 'Birds see red well, have a poor sense of smell and need a lot of nectar; bees see red poorly.' },
    { q: 'Double fertilisation means that two pollen grains are needed to fertilise one ovule.', a: false, why: 'One pollen tube delivers two sperm cells: one to the egg, one to the central cell.' },
    { q: 'Maize has 2n = 20. How many chromosomes are in an endosperm cell?', answer: 30, why: 'Endosperm is triploid: 3 × 10 = 30.' }
  ],
  applications: [
    'Hybrid seed: maize fields are detasselled, or male-sterile lines used, so that every seed is a cross between chosen parents.',
    'Managed honeybees and bumblebees pollinate orchards and greenhouse tomatoes; where pollinators have declined, apples and pears are sometimes pollinated by hand.',
    'Vanilla is pollinated by hand, one flower at a time, using a method discovered in 1841 by Edmond Albius, a twelve-year-old enslaved boy on Réunion.',
    'Pollen forecasts for hay-fever sufferers combine flowering times with the physics of pollen drift.'
  ],
  history: 'Rudolf Camerarius showed in 1694 that plants need pollen to set seed. Joseph Kölreuter made the first plant hybrids in the 1760s and saw insects carrying pollen, and Christian Sprengel (1793) explained flowers as adaptations for insect visitors. Sergei Nawaschin (1898) and Léon Guignard (1899) independently discovered double fertilisation.'
},

{
  id: 'seeds-germination', parent: 'plant-life', title: 'Seeds and germination', level: 2,
  short: 'A seed is an embryo plant packed with food in a protective coat and dried to a few per cent water so that it can wait — for months, years, occasionally centuries. It germinates when it has water, a suitable temperature and oxygen (and, for some species, light), and once its dormancy has been broken.',
  keywords: ['seed', 'germination', 'imbibition', 'dormancy', 'stratification', 'scarification', 'after-ripening', 'embryo', 'endosperm', 'cotyledon', 'radicle', 'plumule', 'aleurone', 'amylase', 'gibberellin', 'abscisic acid', 'phytochrome', 'photoblastic', 'thermal time', 'hydrotime', 'seed bank', 'seed longevity', 'epigeal', 'hypogeal'],
  prereq: ['flowering-reproduction', 'plant-hormones', 'water-potential'],
  related: ['photoperiodism', 'tropisms', 'fermentation', 'carbohydrates', 'enzymes', 'conservation-biology', 'biomes', 'transpiration'],
  body: `
A seed is a young plant in suspended animation. It holds an **embryo** — a root-to-be (**radicle**), a shoot-to-be (**plumule**) and one or two seed leaves (**cotyledons**) — a **food store**, either in the endosperm (cereals, castor bean) or in fat cotyledons (peas, beans), and a **seed coat**. Dried to 5–15 % water, it can survive heat, cold and years of waiting; seeds range from the dust-like seeds of orchids, about a microgram each, to the double coconut's, which can weigh over 15 kg.

### Germination step by step
1. **Imbibition.** A dry seed has a water potential of −100 MPa or lower, so it soaks up water hungrily — even a dead seed does — and swells with surprising force. Within hours a pea can take up about its own dry weight of water.
2. **The lag phase.** Water uptake pauses while metabolism restarts: membranes and DNA are repaired, mitochondria resume respiration, stored messenger RNAs are translated, and hormones are made. In a cereal grain the embryo releases gibberellin, which tells the aleurone layer to secrete α-amylase; the enzyme digests the endosperm's starch into sugars for the embryo — the process that maltsters exploit to make malt.
3. **Radicle emergence.** Cells of the radicle elongate and it breaks through the coat. Physiologists count *this* as the end of germination; what follows is seedling growth.

Then the seedling either lifts its cotyledons into the light on an elongating hypocotyl (**epigeal**, as in beans and sunflowers) or leaves them underground and sends up its shoot (**hypogeal**, as in peas, broad beans and maize).

### What a seed needs
- **Water**, enough to reach the lag phase and go beyond it.
- **A suitable temperature**, between a minimum and a maximum characteristic of the species:

| Crop | Minimum (°C) | Optimum (°C) | Maximum (°C) |
|---|---|---|---|
| Wheat | 3–4 | 20–25 | 30–32 |
| Pea | 3–5 | 20–25 | 30–35 |
| Lettuce | 2–3 | 18–22 | 26–30 |
| Maize | 8–10 | 30–32 | 40–44 |
| Rice | 10–12 | 30–35 | 40–42 |

- **Oxygen** for respiration: seeds in waterlogged soil suffocate. Rice is the famous exception — under water its coleoptile grows up like a snorkel by fermentation, though the root waits for oxygen.
- **Light**, for some seeds. Small seeds with little food must germinate near the surface, and many — like 'Grand Rapids' lettuce — sense light with phytochrome. A flash of red light makes them germinate, a flash of far-red cancels it, and the *last* flash wins ([[photoperiodism]]). Light filtered through leaves is rich in far-red, so such seeds wait for a gap in the canopy.

Below the optimum, the time to germinate is roughly inversely proportional to the temperature above a base: a seed needs a fixed **thermal time** in degree-days. Drier soil slows it in the same way, through the gap between the soil's water potential and a **base water potential** that differs from seed to seed — the **hydrothermal time** model used to predict crop emergence.

### Dormancy: waiting for the right moment
A **dormant** seed does not germinate even in good conditions. Dormancy keeps seeds from sprouting on the parent plant or before winter, and spreads a population's germination over years. It is kept up largely by abscisic acid and broken by gibberellin, and each species has its own key: **after-ripening** in dry storage (many cereals and weeds), weeks of moist cold — **stratification** — (apple seeds need 60–90 days at 1–5 °C, which guarantees spring germination), a scratched or cracked coat — **scarification** — (clover and many legumes, by abrasion, fire or a trip through an animal's gut), or chemicals in smoke, which trigger mass germination after bushfires.

### How long can seeds wait?
Soil holds a **seed bank** of thousands of seeds per square metre. In 1879 William Beal buried bottles of seeds in Michigan to be dug up at intervals; after more than 140 years a few mullein seeds still germinated. A sacred lotus seed about 1,300 years old has germinated, and so has a Judean date palm seed about 2,000 years old. Seed banks exploit Harrington's rules of thumb: every 5 °C cooler, or 1 % drier (between about 5 and 14 % moisture), roughly doubles a seed's life. The Svalbard Global Seed Vault keeps over a million samples of crop seeds at −18 °C.
`,
  ideas: [
    'A seed is an embryo, a food store and a coat, dried to 5–15 % water.',
    'Germination runs through imbibition, a lag phase of metabolic restart (gibberellin, amylase), and radicle emergence.',
    'Seeds need water, a suitable temperature, oxygen and sometimes light (phytochrome: red promotes, far-red reverses).',
    'Below the optimum, germination time follows thermal time (degree-days) and, in drier soil, hydrothermal time.',
    'Dormancy is broken by after-ripening, cold stratification, scarification or smoke; cool, dry seeds live for decades or centuries.'
  ],
  pitfalls: [
    'All seeds need light to germinate — Most large seeds germinate in the dark underground; only some, mostly small, seeds need light, and a few are inhibited by it.',
    'A seed that does not germinate in good conditions is dead — It may be dormant: alive, but waiting for cold, time, fire or a cracked coat.',
    'Germination is the seedling coming up through the soil — Germination ends when the radicle breaks the seed coat; emergence above ground comes days later.'
  ],
  formulas: [
    {
      name: 'Thermal time to germinate',
      expr: 'thT = (T - Tb)*t', tex: '\\theta_T = (T - T_b)\\,t_g',
      vars: {
        thT: { name: 'thermal time the seed needs', q: false, unit: '°C·d', value: 60, tex: '\\theta_T' },
        T: { name: 'soil temperature (below the optimum)', q: false, unit: '°C', value: 15 },
        Tb: { name: 'base temperature', q: false, unit: '°C', value: 3, signed: true, tex: 'T_b' },
        t: { name: 'time to germinate', q: false, unit: 'day', tex: 't_g' }
      },
      solveFor: 't',
      note: 'Valid between the base and the optimum temperature. Values are for a typical pea seed; each seed in a lot has its own thermal time.',
      practice: { unknowns: ['t', 'T'] },
      stories: {
        t: 'A seed needs {thT} above a base of {Tb}. How long does it take to germinate at {T}?',
        T: 'A seed needs {thT} above {Tb}. What soil temperature lets it germinate in {t}?'
      }
    },
    {
      name: 'Hydrothermal time',
      expr: 'thHT = (psi - psib)*(T - Tb)*t', tex: '\\theta_{HT} = (\\psi - \\psi_b)\\,(T - T_b)\\,t_g',
      vars: {
        thHT: { name: 'hydrothermal time the seed needs', q: false, unit: 'MPa·°C·d', value: 60, tex: '\\theta_{HT}' },
        psi: { name: 'water potential of the soil', q: false, unit: 'MPa', value: -0.3, signed: true, max: 0, tex: '\\psi' },
        psib: { name: 'base water potential of the seed', q: false, unit: 'MPa', value: -1, signed: true, max: 0, tex: '\\psi_b' },
        T: { name: 'soil temperature (below the optimum)', q: false, unit: '°C', value: 20 },
        Tb: { name: 'base temperature', q: false, unit: '°C', value: 3, signed: true, tex: 'T_b' },
        t: { name: 'time to germinate', q: false, unit: 'day', tex: 't_g' }
      },
      solveFor: 't',
      note: 'The seed germinates only while ψ > ψb. In a seed lot, ψb varies from seed to seed (roughly normally), which spreads germination out in time.',
      practice: { unknowns: ['t', 'psi'] },
      stories: {
        t: 'A seed with base water potential {psib} needs {thHT} above {Tb}. How long does it take in soil at {psi} and {T}?',
        psi: 'A seed ({psib}, {thHT}, base {Tb}) germinated in {t} at {T}. What was the water potential of the soil?'
      }
    },
    {
      name: 'Seed life in storage (Harrington\'s rule)',
      expr: 'L = L0*2^((T0 - T)/5)', tex: 'L = L_0\\,2^{(T_0 - T)/5\\,\\mathrm{°C}}',
      vars: {
        L: { name: 'storage life at temperature T', q: 'time', unit: 'yr' },
        L0: { name: 'storage life at the reference temperature', q: 'time', unit: 'yr', value: 5, tex: 'L_0' },
        T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' },
        T: { name: 'storage temperature', q: 'temperature', unit: '°C', value: 5, min: 0, max: 50 }
      },
      solveFor: 'L',
      note: 'A rule of thumb for "orthodox" seeds between 0 and 50 °C at constant moisture; each 1 % drop in moisture content (between 5 and 14 %) roughly doubles life too. Seeds of many tropical trees cannot be dried and do not follow it.',
      stories: {
        L: 'Seeds keep for {L0} at {T0}. How long do they keep at {T}?',
        T: 'Seeds keep for {L0} at {T0}. At what temperature would they keep for {L}?'
      }
    }
  ],
  examples: [
    {
      title: 'Peas in a cold spring',
      q: 'A pea seed needs about 60 °C·days above a base of 3 °C. How long does it take to germinate in soil at 8 °C and at 18 °C?',
      steps: [
        'At 8 °C: $t_g = 60/(8 - 3) = 12$ days.',
        'At 18 °C: $t_g = 60/(18 - 3) = 4$ days.',
        'A 10 °C warmer soil speeds germination threefold — and seeds that sit longer in cold, wet soil are more likely to rot.'
      ],
      a: '12 days at 8 °C, 4 days at 18 °C.'
    },
    {
      title: 'Germination in drying soil',
      q: 'The median seed of a lot has a base water potential of −1.0 MPa and needs 60 MPa·°C·days above a base temperature of 3 °C. How long does it take at 20 °C in soil at 0, −0.5 and −1.0 MPa?',
      steps: [
        'At 0 MPa: $t_g = 60/((0 + 1.0)(20 - 3)) = 3.5$ days.',
        'At −0.5 MPa: $t_g = 60/(0.5 \\times 17) = 7.1$ days.',
        'At −1.0 MPa: the gap $\\psi - \\psi_b$ is zero; the median seed never germinates — only the seeds of the lot with a lower base water potential do.'
      ],
      a: '3.5 days, 7.1 days, and never for half the seeds.'
    },
    {
      title: 'Why seed banks are cold',
      q: 'A seed lot keeps its viability for 5 years at 25 °C. Using Harrington\'s rule, how long would it keep at 15 °C and at 5 °C?',
      steps: [
        'At 15 °C: two 5-degree steps, so $5 \\times 2^2 = 20$ years.',
        'At 5 °C: four steps, so $5 \\times 2^4 = 80$ years.',
        'Drying the seeds by a few per cent more multiplies these again, which is why gene banks dry seeds to about 5 % moisture and freeze them.'
      ],
      a: '20 years at 15 °C and 80 years at 5 °C.'
    }
  ],
  quiz: [
    { q: 'Which condition does a \'Grand Rapids\' lettuce seed need that a pea seed does not?', choices: ['water', 'oxygen', 'light (red light acting through phytochrome)', 'a temperature above 0 °C'], a: 2, why: 'Lettuce is light-requiring: red light converts phytochrome to its active form. Large pea seeds germinate in the dark.' },
    { q: 'Dead seeds can still take up water by imbibition.', a: true, why: 'Imbibition is physical: dry cell walls, starch and proteins soak up water whether or not the embryo is alive. Only the later phases need a living seed.' },
    { q: 'Lettuce seeds are given flashes of red, far-red, then red light. What happens?', choices: ['they germinate', 'they do not germinate', 'half germinate', 'they die'], a: 0, why: 'The last flash was red, which leaves phytochrome in its active Pfr form.' },
    { q: 'Why do apple seeds need weeks of moist cold before they will germinate?', choices: ['cold softens the seed coat', 'cold stratification breaks their dormancy, so they germinate in spring rather than before winter', 'the embryo is not yet formed when the fruit falls', 'cold kills fungi on the seed'], a: 1, why: 'Dormancy broken only by a winter\'s worth of cold is a calendar: seedlings appear in spring, not in a warm autumn spell.' },
    { q: 'A seed lot needs 80 °C·days above a base of 5 °C. How many days does it take to germinate at 15 °C?', answer: 8, unit: 'day', why: '80/(15 − 5) = 8 days.' }
  ],
  applications: [
    'Malting: barley is germinated so its amylases convert starch to sugar, then dried and used for brewing and distilling.',
    'Seed priming: seeds are soaked to the lag phase and dried again, so they emerge faster and more evenly after sowing.',
    'Gene banks — the Svalbard vault, the Millennium Seed Bank at Kew — conserve crop and wild plant diversity as dry, frozen seeds.',
    'Weed control: cultivating soil at night exposes fewer light-requiring weed seeds to the flash that would make them germinate.'
  ],
  history: 'William Beal began his buried-seed experiment at Michigan Agricultural College in 1879; its bottles are still being dug up. In 1952 Harry Borthwick, Sterling Hendricks and colleagues at the US Department of Agriculture showed that the germination of lettuce seed is switched on by red light and off by far-red, the discovery that led to phytochrome.',
  sim: 'plant-germination'
},

{
  id: 'photoperiodism', parent: 'plant-life', title: 'Photoperiodism and flowering', level: 2,
  short: 'Many plants flower at the right season by measuring the length of the night. Short-day plants flower when the night is longer than a critical length, long-day plants when it is shorter; a brief flash of red light in the middle of the night resets the measurement, and far-red light cancels the flash — the signature of the pigment phytochrome.',
  keywords: ['photoperiodism', 'short-day plant', 'long-day plant', 'day-neutral plant', 'critical night length', 'night break', 'phytochrome', 'Pr', 'Pfr', 'red light', 'far-red light', 'florigen', 'FT protein', 'CONSTANS', 'circadian clock', 'vernalisation', 'Garner and Allard', 'cocklebur', 'poinsettia', 'chrysanthemum', 'day length'],
  prereq: ['flowering-reproduction', 'plant-hormones', 'biological-rhythms'],
  related: ['seeds-germination', 'phloem-transport', 'epigenetics', 'eukaryotic-regulation', 'climate-ecosystems', 'tropisms', 'physics:em-spectrum', 'math:trig-functions'],
  body: `
Flowering at the wrong time is fatal to a plant's reproduction: too early and frost kills the flowers, too late and the seeds do not ripen, out of step with its neighbours and there is no one to cross with. Temperature is an unreliable calendar — a warm week in February says little — but day length changes with perfect regularity through the year. Many plants use it.

### Short days, long days
In 1920 Wightman Garner and Harry Allard of the US Department of Agriculture noticed that a new giant tobacco, 'Maryland Mammoth', never flowered in the field but flowered in a winter greenhouse, and that soybeans sown weeks apart flowered on the same date. Shortening the days artificially made both flower. They named the response **photoperiodism**.

| Type | Flowers when… | Examples |
|---|---|---|
| **Short-day plant** | the night is *longer* than a critical length | chrysanthemum, poinsettia, soybean, most rice, cocklebur, coffee |
| **Long-day plant** | the night is *shorter* than a critical length | wheat, barley, oats, spinach, radish, lettuce, henbane, clover |
| **Day-neutral plant** | regardless of day length, once old or large enough | tomato, cucumber, many maize and sunflower varieties |

The names say which way the switch goes, not where it is set. Cocklebur, a short-day plant, flowers when nights exceed about 8.5 hours, that is under days up to 15.5 hours; henbane, a long-day plant, flowers when days exceed about 11 hours. Under a 14-hour day both flower.

### It is the night that counts
In 1938 Karl Hamner and James Bonner gave cocklebur plants long nights interrupted by a minute of light: they did not flower. Long days interrupted by darkness had no effect. What the plant measures is an *uninterrupted dark period*. A **night break** of red light — around 660 nm — is most effective, and far-red light — around 730 nm — given straight after the red cancels it. With alternating flashes, the last one decides:

| Night break | Short-day plant under long nights | Long-day plant under long nights |
|---|---|---|
| none | flowers | does not flower |
| red | does not flower | flowers |
| red, far-red | flowers | does not flower |
| red, far-red, red | does not flower | flowers |
| red, far-red, red, far-red | flowers | does not flower |

### Phytochrome
The switch is **phytochrome**, a protein with a light-absorbing chromophore that exists in two interconvertible forms. **Pr** absorbs red light and becomes **Pfr**, the active form; Pfr absorbs far-red light and returns to Pr, and in darkness it slowly reverts or is destroyed. Because the two absorption spectra overlap, red light converts only about 85 % to Pfr and far-red leaves about 3 %; sunlight holds about 60 %, and the far-red-rich light under a leaf canopy only 20–30 %, which tells a seedling it is shaded and makes it stretch towards the light. A red flash in the night restores Pfr and resets the plant's dark timer; far-red, if it comes within about half an hour, undoes it.

### From leaf to bud
The day length is sensed in the **leaves**, but flowers form at the shoot tip. A single induced cocklebur leaf grafted onto a non-induced plant makes it flower — so a mobile signal, **florigen**, travels from leaf to bud. It was postulated by Mikhail Chailakhyan in 1936 and identified in 2007 as the **FT protein**, which moves through the [[phloem-transport|phloem]]. In thale cress, a long-day plant, the circadian clock makes the messenger RNA of a protein called CONSTANS peak late in the day, but the protein itself survives only in light; only in long days does the peak fall in daylight, so CONSTANS builds up and switches on FT. The plant compares its internal clock with the light outside — Erwin Bünning's **external coincidence** model of 1936.

### Cold as a second calendar
Winter wheat, cabbages, carrots and beet also need weeks of cold before they can respond to long days — **vernalisation**. The cold gradually silences a flowering repressor gene, *FLC*, by chemical marks on its chromatin that persist after spring comes: a textbook case of [[epigenetics]]. The idea was promoted in the Soviet Union by Trofim Lysenko, whose rejection of genetics set Soviet agriculture back by decades.

### Uses
Growers flower chrysanthemums all year by covering them with blackout cloth in summer and lighting them at night in winter; poinsettias sold at Christmas are given about 14 hours of uninterrupted darkness each night from early autumn. Varieties of soybean, rice and wheat are bred for the day lengths of particular latitudes, and street lights can delay leaf fall and flowering in the trees beside them.
`,
  ideas: [
    'Short-day plants flower when nights exceed a critical length; long-day plants when nights are shorter than it; day-neutral plants ignore day length.',
    'What is measured is the uninterrupted night: a brief night break of red light prevents a short-day plant from flowering and lets a long-day plant flower.',
    'Phytochrome switches between Pr and the active Pfr: red makes Pfr, far-red reverses it, and the last flash wins.',
    'Leaves sense the day length and send florigen — the FT protein — through the phloem to the shoot tip; the circadian clock times the response.',
    'Vernalisation adds a cold requirement, remembered epigenetically.'
  ],
  pitfalls: [
    'Short-day plants need short days — They need long uninterrupted nights. A short day followed by a night broken by a minute of light does not make them flower, and some "short-day" plants flower under 15-hour days.',
    'Plants measure day length by the amount of light they collect — A one-minute red flash, far too little light for photosynthesis, is enough to reset the timer: they measure timing, not quantity.',
    'Pr is the active form of phytochrome — Pfr is active. Red light makes it; far-red light and darkness remove it.'
  ],
  formulas: [
    {
      name: 'Day length from latitude and season',
      expr: 'D = 24/pi*acos(-tan(lat)*tan(dec))', tex: 'D = \\frac{24\\,\\mathrm{h}}{\\pi}\\arccos(-\\tan\\phi\\,\\tan\\delta)',
      vars: {
        D: { name: 'day length (sunrise to sunset)', q: false, unit: 'h' },
        lat: { name: 'latitude (negative in the southern hemisphere)', q: 'angle', unit: '°', value: 51.5, signed: true, min: -66, max: 66, tex: '\\phi' },
        dec: { name: 'declination of the Sun (+23.44° in late June, −23.44° in late December, 0 at the equinoxes)', q: 'angle', unit: '°', value: 23.44, signed: true, min: -23.44, max: 23.44, tex: '\\delta' }
      },
      solveFor: 'D',
      note: 'The geometric day, from the Sun\'s centre rising to its setting. Refraction and the Sun\'s width add about 10 minutes at mid-latitudes; plants also respond to part of the twilight. Beyond the polar circles there are days with no sunset or sunrise.',
      practice: { unknowns: ['D', 'dec'] },
      stories: {
        D: 'How long is the day at latitude {lat} when the Sun\'s declination is {dec}?',
        dec: 'At latitude {lat}, what is the Sun\'s declination on a day {D} long?'
      }
    },
    {
      name: 'Phytochrome photoequilibrium',
      expr: 'phi = kR/(kR + kFR)', tex: '\\varphi = \\frac{k_{R}}{k_{R} + k_{FR}}',
      vars: {
        phi: { name: 'fraction of phytochrome as Pfr', q: 'ratio', unit: '%', tex: '\\varphi' },
        kR: { name: 'rate constant of Pr → Pfr (red absorbed)', q: 'rate', unit: '1/s', value: 0.06, tex: 'k_{R}' },
        kFR: { name: 'rate constant of Pfr → Pr (far-red absorbed)', q: 'rate', unit: '1/s', value: 0.04, tex: 'k_{FR}' }
      },
      solveFor: 'phi',
      note: 'At photo-steady state, conversions each way balance: kR·[Pr] = kFR·[Pfr]. Values are illustrative of full sunlight (φ ≈ 0.6); dark reversion is ignored.',
      stories: {
        phi: 'In some light, Pr is converted to Pfr at {kR} and Pfr back at {kFR}. What fraction of the phytochrome is in the active form?',
        kFR: 'Under a canopy, phytochrome settles at {phi} Pfr with kR = {kR}. What is the Pfr → Pr rate constant?'
      }
    },
    {
      name: 'Time for phytochrome to settle',
      expr: 'tau = 1/(kR + kFR)', tex: '\\tau = \\frac{1}{k_{R} + k_{FR}}',
      vars: {
        tau: { name: 'time constant of the approach to equilibrium', q: 'time', unit: 's', tex: '\\tau' },
        kR: { name: 'rate constant of Pr → Pfr', q: 'rate', unit: '1/s', value: 0.06, tex: 'k_{R}' },
        kFR: { name: 'rate constant of Pfr → Pr', q: 'rate', unit: '1/s', value: 0.04, tex: 'k_{FR}' }
      },
      note: 'Two opposing first-order reactions relax with the sum of their rate constants: a bright flash reaches equilibrium within seconds to minutes.',
      stories: { tau: 'With kR = {kR} and kFR = {kFR}, how quickly does phytochrome approach its photo-steady state?' }
    }
  ],
  examples: [
    {
      title: 'When does a chrysanthemum start to flower?',
      q: 'Garden chrysanthemums initiate flowers when the day falls below about 13.5 hours. At latitude 51.5° N (London), what is the Sun\'s declination on that day, and roughly when is it?',
      steps: [
        'Rearrange: $\\cos(\\pi D/24) = -\\tan\\phi\\tan\\delta$, so $\\tan\\delta = -\\cos(\\pi \\times 13.5/24)/\\tan 51.5° = 0.195/1.257 = 0.155$.',
        '$\\delta = 8.8°$. The declination falls through +8.8° at the end of August.',
        'Allowing for the extra minutes of refraction and twilight, induction begins in early September — and garden chrysanthemums flower in autumn.'
      ],
      a: 'Declination about +8.8°: late August to early September.'
    },
    {
      title: 'A night break in the greenhouse',
      q: 'Cocklebur has a critical night of about 8.5 hours. Plants get 8-hour days and 16-hour nights, and in the middle of each night a one-minute flash of red light. Do they flower? What if each red flash is followed at once by far-red?',
      steps: [
        'The flash splits the night into two dark periods of about 8 hours each.',
        'Neither reaches 8.5 hours, so the short-day plant does not flower — even though the total darkness is 16 hours.',
        'Far-red straight after the red returns phytochrome to Pr before the timer is reset; the plant behaves as if the night were unbroken, and flowers.'
      ],
      a: 'Red alone: no flowering. Red followed by far-red: flowering.'
    },
    {
      title: 'Light under a canopy',
      q: 'Under a leaf canopy, far-red is so enriched that kFR ≈ 2.9 kR. What fraction of phytochrome is Pfr, and what does a seedling do?',
      steps: [
        '$\\varphi = k_R/(k_R + k_{FR}) = 1/(1 + 2.9) = 0.26$.',
        'About a quarter of the phytochrome is active, against 60 % in open sunlight.',
        'The seedling reads this as shade: it stretches its stem and leaf stalks towards the light (shade avoidance) and may flower earlier.'
      ],
      a: 'About 26 % Pfr — the signal of shade.'
    }
  ],
  quiz: [
    { q: 'A short-day plant with a critical night of 9 hours grows under 14-hour days and 10-hour nights. It flowers.', a: true, why: 'The night (10 h) is longer than the critical 9 h, so it flowers — even though the day is long by everyday standards.' },
    { q: 'The same plant now gets a one-minute flash of red light in the middle of every 10-hour night. What happens?', choices: ['it flowers sooner', 'it does not flower', 'it flowers only if the flash is blue', 'nothing changes'], a: 1, why: 'The flash splits the night into two 5-hour dark periods, each shorter than the critical 9 h.' },
    { q: 'Which night-break sequence still lets a short-day plant flower under long nights?', choices: ['red', 'red, far-red, red', 'red, far-red, red, far-red', 'far-red, red'], a: 2, why: 'The last flash decides: ending on far-red leaves phytochrome as Pr, as if the night had not been broken.' },
    { q: 'Long-day plants flower when…', choices: ['the day is longer than 12 hours', 'the night is shorter than a critical length', 'they receive more total light', 'the temperature rises in spring'], a: 1, why: 'They too measure the night: a long night broken by a red flash lets them flower.' },
    { q: 'How long is the geometric day at the equator, in hours?', answer: 12, unit: 'h', why: 'At φ = 0, tan φ = 0, so D = (24/π) arccos 0 = 12 h all year.' }
  ],
  problems: [
    { q: 'What is the geometric day length at latitude 60° N at the June solstice (declination +23.44°)?', answer: 18.5, unit: 'h', tol: 0.02, steps: ['$-\\tan 60° \\tan 23.44° = -1.732 \\times 0.4335 = -0.751$.', '$\\arccos(-0.751) = 2.42$ rad.', '$D = 24/\\pi \\times 2.42 = 18.5$ h.'] }
  ],
  applications: [
    'Year-round chrysanthemums and Christmas poinsettias, controlled with blackout cloth and night lighting.',
    'Breeding crop varieties for latitude: soybean maturity groups, photoperiod-insensitive wheats that spread the Green Revolution to new regions.',
    'Greenhouse LED lighting that sets the red to far-red ratio to control stem length and flowering.',
    'Predicting how crops and wild plants respond to climate change, which shifts temperatures but not day length.'
  ],
  history: 'Garner and Allard described photoperiodism in 1920. Hamner and Bonner showed in 1938 that the night is what counts, and the Beltsville group of Borthwick and Hendricks found red/far-red reversibility in the late 1940s and early 1950s; Warren Butler and colleagues detected phytochrome in 1959. Chailakhyan\'s florigen of 1936 was identified as the FT protein by several groups in 2007.',
  sim: 'plant-photoperiod'
}

);
