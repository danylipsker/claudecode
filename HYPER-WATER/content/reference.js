/* HYPER-WATER · content/reference.js — the three reference concepts for the writers of Hyper Water.
 * Their depth, tone, numbers, tables, terms, formulas and sources are the model (see also sims/reference.js):
 *   what-a-hydrogen-bond-is   an idea: what the bond is, what it is worth, what follows from it
 *   why-ice-floats            a phenomenon: the structure, the numbers, the consequences, the mix-ups
 *   specific-heat-of-water    a number: what it means, how it compares, what it does to the world
 */
Hyper.add(

/* ================================================================ an idea */
{
  id: 'what-a-hydrogen-bond-is', parent: 'hydrogen-bonds', title: 'What a hydrogen bond is', level: 1,
  short: 'A hydrogen atom already bonded to one oxygen is pulled towards the lone pair of a neighbouring oxygen. The attraction is worth about 20 kJ/mol — a twentieth of a real bond and eight times a thermal jostle — which is exactly strong enough to hold water together and weak enough to let it flow.',
  keywords: ['hydrogen bond', 'H-bond', 'donor', 'acceptor', 'lone pair', 'bond energy', 'kJ/mol', 'O–H···O', 'electrostatic', 'intermolecular force', 'why water is liquid'],
  prereq: ['the-bent-shape', 'polarity-and-the-dipole'],
  related: ['two-donors-two-acceptors', 'the-tetrahedral-network', 'bonds-that-flicker', 'the-boiling-point-anomaly', 'chemistry:intermolecular-forces', 'chemistry:hydrogen-bonding', 'chemistry:bond-polarity'],
  body: `
Take two water molecules and bring them close. Each is a small bent magnet: the oxygen end carries a partial negative charge of about a third of an electron, each hydrogen a partial positive charge of a sixth. Turn one so that a hydrogen points at the other's oxygen, and the two stick. The hydrogen is now shared — bonded to its own oxygen by a real covalent bond, and attracted to the second oxygen by something weaker. That second attraction is the **hydrogen bond**, and almost everything strange about water follows from it.

### What it is made of
The hydrogen bond is mostly electrostatic: the positive hydrogen sits between two negative oxygens, 0.96 Å from its own and about 1.85 Å from the neighbour's, so the two oxygens end up 2.8 Å apart. A smaller part is quantum mechanical — the lone pair of the second oxygen leaks a little of its electron density into the O–H bond, which is why the bond prefers to be straight (O–H···O within 10–20° of a line) and why the O–H bond it borrows from stretches slightly and vibrates more slowly. The molecule that gives the hydrogen is the **donor**; the one that offers the lone pair is the **acceptor**.

### What it is worth
| Attraction | Energy | In units of $k_BT$ at 25 °C |
|---|---|---|
| O–H covalent bond inside the molecule | 463 kJ/mol | 190 |
| hydrogen bond between molecules (liquid) | about 20 kJ/mol | 8 |
| van der Waals attraction, two methane molecules | about 1 kJ/mol | 0.4 |
| a thermal jostle, $k_BT$ at 25 °C | 2.5 kJ/mol | 1 |

Twenty kilojoules a mole is the sweet spot. It is eight times the energy of a typical collision, so at room temperature most bonds are intact at any instant — about 3.7 of the four possible per molecule. But it is small enough that a bond breaks whenever a slightly harder-than-average kick arrives, which happens to each one about every picosecond. A liquid held by bonds that last a trillionth of a second is a liquid; a liquid whose every molecule must shed four such bonds to escape is a liquid that boils 180 K higher than its size predicts.

### Why water, of all molecules
Hydrogen bonds need a hydrogen attached to a small, strongly electronegative atom — nitrogen, oxygen or fluorine — and a lone pair on another such atom to receive it. Ammonia has three hydrogens but only one lone pair; hydrogen fluoride has three lone pairs but one hydrogen. Water has **two of each**, in a tetrahedral arrangement, so every molecule can hold four neighbours at once and the bonds can run in every direction. That balance is what turns a collection of hydrogen bonds into a three-dimensional net rather than chains or rings, and it is the subject of [[two-donors-two-acceptors]].

### Three numbers to carry
- **2.8 Å** between the oxygens of a bonded pair — 0.3 Å closer than they could approach without the bond.
- **20 kJ/mol** per bond, so freeing one molecule from its 3.7 half-shared bonds costs about 37 kJ/mol — close to the 40.7 kJ/mol it takes to boil water.
- **1 picosecond** before a bond breaks and re-forms elsewhere: a glass of water is a new arrangement a trillion times a second.

> [!key] A hydrogen bond is a positive hydrogen caught between two negative oxygens, worth a twentieth of a chemical bond. Strong enough to hold and weak enough to let go, it is the reason water is a liquid, a solvent and a sculptor rather than a gas.`,
  ideas: ['A hydrogen already bonded to one oxygen is attracted to the lone pair of another: the donor gives, the acceptor receives.', 'About 20 kJ/mol — a twentieth of a covalent bond and eight thermal jostles — so bonds hold on average but break every picosecond.', 'Water has two hydrogens and two lone pairs: four bonds per molecule, in every direction, and so a three-dimensional net.', 'Boiling costs about 3.7 half-shared bonds per molecule: 37 kJ/mol predicted, 40.7 measured.'],
  pitfalls: ['"A hydrogen bond is a bond like any other" — It is twenty times weaker than the O–H bond inside the molecule and lives a picosecond; it is an attraction between molecules, not a bond within one.', '"Hydrogen bonds are the bonds that break when water boils" — Yes, but not when it melts: ice keeps about nine-tenths of its hydrogen bonds on melting; what changes is the ordering, not the count.', '"Any molecule with hydrogen makes hydrogen bonds" — Methane has four and makes none: the hydrogen must sit on N, O or F to be positive enough.'],
  terms: [
    { term: 'Hydrogen bond', also: ['H-bond', 'O–H···O'], def: 'The attraction between a hydrogen atom covalently bonded to an electronegative atom (O, N, F) and a lone pair on a second electronegative atom nearby; in water about 20 kJ/mol, oxygen–oxygen distance 2.8 Å.' },
    { term: 'Donor', also: ['hydrogen-bond donor'], def: 'The molecule whose hydrogen takes part in a hydrogen bond. A water molecule can donate twice, once per hydrogen.' },
    { term: 'Acceptor', also: ['hydrogen-bond acceptor'], def: 'The molecule whose lone pair receives the hydrogen of a hydrogen bond. A water molecule can accept twice, once per lone pair.' },
    { term: 'Lone pair', also: ['non-bonding pair'], def: 'A pair of valence electrons on an atom that is not shared in a bond. Oxygen in water has two, and they are what the hydrogens of neighbouring molecules are attracted to.' },
    { term: 'Thermal energy', also: ['kT', 'k_BT'], def: 'The typical energy of a thermal jostle, k_B T: 2.5 kJ/mol (0.026 eV) at 25 °C. Bonds much stronger than this hold; bonds comparable to it break and re-form.' }
  ],
  formulas: [
    { name: 'Bond energy against thermal energy', expr: 'r = Eb/(R*T)', tex: 'r = \\frac{E_b}{RT}',
      vars: { r: { name: 'bond energy in units of RT', hint: 'Above about 5, most bonds are intact at any moment; near 1 the bond is broken as often as not.' }, Eb: { name: 'bond energy', q: 'molarenergy', unit: 'kJ/mol', value: 20, hint: 'About 20 kJ/mol for a hydrogen bond in liquid water; 463 for the O–H bond inside the molecule.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25, min: -273 } },
      solveFor: 'r', note: 'The ratio that decides whether a bond holds: a hydrogen bond at room temperature is about 8 thermal units, a van der Waals contact less than 1.',
      stories: { r: 'A hydrogen bond is worth {Eb}. How many thermal units is that at {T}?', T: 'At what temperature is a bond of {Eb} worth {r} thermal units?' } },
    { name: 'Energy to free one molecule from the network', expr: 'E = n*Eb/2', tex: 'E = \\frac{n\\,E_b}{2}',
      vars: { E: { name: 'energy to remove a molecule', q: 'molarenergy', unit: 'kJ/mol', hint: 'Compare with the enthalpy of vaporisation, 40.7 kJ/mol at 100 °C.' }, n: { name: 'bonds per molecule', value: 3.7, min: 0, max: 4, hint: 'About 3.7 at 25 °C, nearly 4 in ice, about 3.1 at 100 °C.' }, Eb: { name: 'energy per bond', q: 'molarenergy', unit: 'kJ/mol', value: 20 } },
      solveFor: 'E', note: 'Each bond is shared by two molecules, hence the half. The estimate lands close to the measured heat of vaporisation, which is the point.',
      stories: { E: 'A molecule holds {n} hydrogen bonds of {Eb} each. What does it cost to pull it out of the liquid?', Eb: 'Freeing a molecule costs {E} and it holds {n} bonds. What is each bond worth?' } },
    { name: 'Lifetime of a bond at another temperature', expr: 'tau = tau0*exp(Ea/R*(1/T - 1/T0))', tex: '\\tau = \\tau_0 \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right]',
      vars: { tau: { name: 'lifetime', q: 'time', unit: 'ps' }, tau0: { name: 'lifetime at the reference temperature', q: 'time', unit: 'ps', value: 1.2, hint: 'About 1.2 ps at 25 °C, from infrared spectroscopy (Fecko, Eaves et al., Science 2003).' }, Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 10, hint: 'Roughly half a bond: the network loosens before a bond breaks outright.' }, R: { const: 'R' }, T: { name: 'temperature', q: 'temperature', unit: '°C', value: 0, min: -273 }, T0: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, fixed: true } },
      solveFor: 'tau', note: 'An Arrhenius estimate; the measured lifetime is about 1.2 ps at 25 °C and roughly doubles by 0 °C.',
      stories: { tau: 'Hydrogen bonds last {tau0} at {T0}. How long do they last at {T}?' } }
  ],
  examples: [
    { title: 'Boiling, bond by bond', q: 'Estimate the heat of vaporisation of water from its hydrogen bonds, and compare with the measured 40.7 kJ/mol at 100 °C.',
      steps: ['Near the boiling point each molecule holds about 3.1 bonds of roughly 20 kJ/mol; each bond is shared by two molecules.', { text: 'Energy to free one molecule:', tex: 'E \\approx \\tfrac{1}{2} \\times 3.1 \\times 20 \\approx 31\\ \\mathrm{kJ/mol}' }, 'Add the work of pushing back the atmosphere and the kinetic energy of the vapour (about $RT \\approx 3$ kJ/mol) and the small van der Waals part, and the estimate reaches the high thirties.'],
      a: 'About 35–40 kJ/mol — the hydrogen bonds account for nearly all of the 40.7 kJ/mol measured. Methane, with no hydrogen bonds, needs only 8.2 kJ/mol.' },
    { title: 'How many bonds break each second in a glass', q: 'A glass holds 250 g of water at 25 °C. Roughly how many hydrogen bonds break (and re-form) every second?',
      steps: ['Molecules: $250/18.015 \\times 6.022\\times10^{23} \\approx 8.4\\times10^{24}$.', 'Bonds: about 3.7 per molecule, each shared by two, so $1.85$ per molecule: $1.5\\times10^{25}$ bonds.', 'Each lasts about 1.2 ps, so each breaks about $8\\times10^{11}$ times a second.'],
      a: 'About $10^{37}$ bond-breaking events per second in one glass of still water.' }
  ],
  quiz: [
    { q: 'Which pair cannot form a hydrogen bond with each other?', choices: ['Two water molecules', 'Water and ammonia', 'Two methane molecules', 'Water and methanol'], a: 2, why: 'Methane\'s hydrogens sit on carbon, which is not electronegative enough to make them positive, and carbon has no lone pair to offer. The other pairs all have an O–H or N–H to give and a lone pair to receive.' },
    { q: 'A hydrogen bond in liquid water is roughly what fraction of the O–H bond inside the molecule?', choices: ['A half', 'A fifth', 'A twentieth', 'A thousandth'], a: 2, why: 'About 20 kJ/mol against 463 kJ/mol: a twentieth. That ratio is what makes it both a bond and a thing that breaks a trillion times a second.' },
    { q: 'Raising the temperature from 0 °C to 100 °C makes each hydrogen bond individually weaker.', a: false, why: 'The bond\'s own energy barely changes. What changes is the share of time it spends broken — fewer bonds are intact at any instant, and each lasts a shorter time.' },
    { q: 'If the hydrogen bond were worth 200 kJ/mol instead of 20, water at room temperature would most likely be', choices: ['a gas', 'a liquid as it is now', 'a solid', 'a liquid of much lower viscosity'], a: 2, why: 'At eighty thermal units no bond would ever let go; the network would be rigid — a crystal, melting only at many hundreds of degrees.' },
    { q: 'How many hydrogen bonds does one water molecule in ice Ih hold?', answer: 4, why: 'Two as donor (its hydrogens) and two as acceptor (its lone pairs): the four corners of a tetrahedron. In the liquid the average is about 3.7 at 25 °C.' }
  ],
  applications: ['Everything in this app downstream of this page: the boiling point, ice, heat capacity, solvation, surface tension and the shape of proteins.', 'The base pairs of DNA: two hydrogen bonds hold A to T and three hold G to C — strong enough to keep the helix, weak enough to unzip it for copying.', 'Nylon, Kevlar and wool: polymers whose strength comes from rows of hydrogen bonds between chains.', 'Why alcohol and sugar dissolve in water and oil does not: a molecule that can hydrogen-bond is welcome in the network.'],
  history: 'The idea was named by Latimer and Rodebush in 1920 at Berkeley, developing Lewis\'s picture of shared electron pairs; Linus Pauling gave it its modern form in *The Nature of the Chemical Bond* (1939) and used it to explain the open structure of ice. The picosecond dynamics were measured directly only in the 2000s with femtosecond infrared lasers.',
  sources: ['Pauling, *The Nature of the Chemical Bond*, ch. 12 (the hydrogen bond).', 'Fecko, Eaves, Loparo, Tokmakoff and Geissler, "Ultrafast hydrogen-bond dynamics in the infrared spectroscopy of water", *Science* 301, 1698 (2003) — the 170 fs oscillation and 1.2 ps reorganisation.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 1 and 3.', 'Ball, "Water is an active matrix of life for cell and molecular biology", *PNAS* 114, 13327 (2017).'],
  sim: 'ref-hbond-network'
},

/* ================================================================ a phenomenon */
{
  id: 'why-ice-floats', parent: 'the-ice-that-floats', title: 'Why ice floats', level: 1,
  short: 'In ice every molecule holds exactly four neighbours at the corners of a tetrahedron, and that pattern is a hexagonal lattice full of empty channels. Ice is 8.3 % less dense than the water it came from, so it floats with a tenth of itself above the surface — and nearly every other solid sinks in its own melt.',
  keywords: ['ice floats', 'density of ice', 'hexagonal lattice', 'ice Ih', 'open structure', 'expansion on freezing', 'iceberg', 'buoyancy', 'Archimedes', '9 percent', 'why does ice float'],
  prereq: ['what-a-hydrogen-bond-is', 'the-tetrahedral-network'],
  related: ['the-density-maximum', 'lakes-freeze-from-the-top', 'icebergs-and-sea-ice', 'frost-wedging-and-burst-pipes', 'ice-ih-and-ice-ic', 'physics:buoyancy', 'hydraulics:buoyancy-archimedes'],
  body: `
Drop a cube of almost any solid into its own liquid and it sinks: solid iron in molten iron, solid wax in melted wax, solid alcohol in liquid alcohol. The solid packs its molecules more tightly, so it is denser. Ice is the great exception. It floats, with about a tenth of itself showing, and the reason is not that it holds air — a clear block of ice floats just the same — but that its molecules are arranged more loosely than the liquid's.

### The open lattice
In ice Ih, the ordinary ice of snow and freezers, every molecule is hydrogen-bonded to exactly four neighbours, at the corners of a tetrahedron, 2.76 Å away. Repeat that in all directions and you get a lattice of puckered hexagonal rings — the same pattern as the carbon atoms in diamond, but with oxygen at the corners and a hydrogen along each edge. Look down the hexagonal axis and you see open channels wide enough to fit another molecule. Nothing fills them: the geometry of four straight bonds at 109.5° leaves them empty.

Melt the ice and about a tenth of the bonds break. Freed from the rule of four straight bonds, molecules crowd a little into the channels. Each still has about 3.7 partners, but it also has, on average, half a non-bonded neighbour sitting closer than the lattice would allow. The liquid at 0 °C is **9 % denser** than the solid.

| | Density at 0 °C | Molecules per nm³ | Nearest neighbours |
|---|---|---|---|
| ice Ih | 916.7 kg/m³ | 30.6 | 4, all bonded |
| liquid water | 999.84 kg/m³ | 33.4 | about 4.4, 3.7 bonded |
| liquid at 4 °C | 999.97 kg/m³ | 33.4 | — |

### The numbers that follow
- **Expansion on freezing: 9.05 %.** A litre of water becomes 1.09 litres of ice, and if it cannot expand it pushes — enough to split cast iron, rock and the walls of a cell.
- **The tenth above the surface.** By Archimedes, a floating body displaces its own weight: the submerged fraction is $\\rho_\\text{ice}/\\rho_\\text{water}$ = 916.7/999.8 = 0.917 in fresh water and 916.7/1025 = 0.894 in the sea. An iceberg shows 8–11 % of its volume.
- **Pressure lowers the melting point.** Because the liquid is denser, squeezing ice favours melting: 0.0074 K per bar, so ice under a 2,000 m glacier melts at −1.5 °C, and the bottom of the Antarctic ice sheet is wet.

### Why it matters so much
Because ice floats, water freezes from the top. The first ice forms a lid; the lid insulates the water beneath (ice conducts heat only four times better than still water, and the snow on it hardly at all); and the lake stays liquid, at 4 °C near the bottom, all winter. If ice sank, a lake would freeze from the bottom up, summer would melt only the top, and most of the fresh water on Earth would be permanently solid. That the solid floats is the single property of water most often named as the one life could not do without, and it is a direct consequence of the hydrogen bond's insistence on four straight neighbours.

### What it is confused with
Floating ice is not the same thing as the **density maximum at 4 °C**, though both come from the open structure: the maximum is the point in the *liquid* where the collapse of open patches on warming stops outweighing ordinary thermal expansion. It is also not an air effect: bubbles make ice cloudy and slightly lighter, but bubble-free ice still floats. And it is not universal among "ices": the high-pressure ices II to VII are all denser than water and would sink.

> [!key] Ice floats because its hydrogen bonds hold every molecule in an open hexagonal lattice that the liquid partly collapses; the solid is 8.3 % less dense than the liquid, and about a tenth of it rides above the surface.`,
  ideas: ['In ice each molecule holds four neighbours at the corners of a tetrahedron; the lattice that results is hexagonal and full of empty channels.', 'Melting breaks about a tenth of the bonds and lets molecules crowd into the channels: the liquid is 9 % denser.', 'A floating body displaces its own weight, so ice sits with 92 % of its volume submerged in fresh water and 89 % in the sea.', 'Because the solid floats, water freezes from the top and lakes stay liquid beneath a lid of ice.'],
  pitfalls: ['"Ice floats because it has air in it" — Perfectly clear, bubble-free ice floats too; the lightness is in the arrangement of the molecules, not in trapped gas.', '"Most of an iceberg is below the surface because it is so heavy" — It is below because it is only 11 % lighter than sea water; a cork, 75 % lighter, shows three-quarters of itself.', '"Ice is the densest form of water" — It is the least dense of the ordinary phases; the liquid at 4 °C is the densest form at everyday pressure, and the high-pressure ices are denser still.'],
  terms: [
    { term: 'Ice Ih', also: ['hexagonal ice', 'ordinary ice'], def: 'The crystalline form of ice stable at everyday pressures: oxygen atoms on a hexagonal lattice, each bonded to four neighbours; density 916.7 kg/m³ at 0 °C. All natural ice on Earth is ice Ih.' },
    { term: 'Open structure', also: ['open lattice'], def: 'A crystal arrangement in which the geometry of the bonds leaves empty space between atoms. Ice has one because four straight hydrogen bonds at tetrahedral angles cannot pack closely.' },
    { term: 'Submerged fraction', also: ['draft'], def: 'The fraction of a floating body\'s volume below the surface, equal to the ratio of the body\'s density to the liquid\'s: about 0.92 for ice in fresh water, 0.89 in the sea.' },
    { term: 'Expansion on freezing', also: ['freezing expansion'], def: 'The increase in volume when water becomes ice Ih: 9.05 %, equivalently a density drop from 999.8 to 916.7 kg/m³ at 0 °C.' }
  ],
  formulas: [
    { name: 'The submerged fraction of floating ice', expr: 'f = rhoIce/rhoLiq', tex: 'f = \\frac{\\rho_\\mathrm{ice}}{\\rho_\\mathrm{liq}}',
      vars: { f: { name: 'fraction submerged', q: 'ratio', unit: '%', hint: 'What Archimedes gives: the body displaces its own weight of liquid.' }, rhoIce: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_\\mathrm{ice}', hint: '916.7 kg/m³ for ice Ih at 0 °C; heavy-water ice is 1017.' }, rhoLiq: { name: 'density of the liquid', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho_\\mathrm{liq}', hint: '999.8 for fresh water at 0 °C, about 1025 for the sea, 789 for ethanol — in which ice sinks.' } },
      solveFor: 'f', note: 'Valid while the ice floats, i.e. while the fraction is below 100 %.',
      stories: { f: 'An iceberg of density {rhoIce} floats in sea water of density {rhoLiq}. What fraction of it is below the surface?', rhoLiq: 'Ice of density {rhoIce} floats with {f} of its volume submerged. What is the density of the liquid?' } },
    { name: 'Volume change on freezing', expr: 'dV = V*(rhoLiq/rhoIce - 1)', tex: '\\Delta V = V\\left(\\frac{\\rho_\\mathrm{liq}}{\\rho_\\mathrm{ice}} - 1\\right)',
      vars: { dV: { name: 'extra volume as ice', q: 'volume', unit: 'mL', tex: '\\Delta V' }, V: { name: 'volume of water', q: 'volume', unit: 'L', value: 1 }, rhoLiq: { name: 'density of the water', q: 'density', unit: 'kg/m³', value: 999.8, tex: '\\rho_\\mathrm{liq}' }, rhoIce: { name: 'density of the ice', q: 'density', unit: 'kg/m³', value: 916.7, tex: '\\rho_\\mathrm{ice}' } },
      solveFor: 'dV', note: 'A litre of water makes 1.09 L of ice: 90 mL that must go somewhere.',
      stories: { dV: 'A pipe holds {V} of water and freezes solid. By how much does the ice want to be larger?' } },
    { name: 'Melting point under pressure', expr: 'Tm = T0 - k*p', tex: 'T_m = T_0 - k\\,p',
      vars: { Tm: { name: 'melting temperature', q: 'temperature', unit: '°C', tex: 'T_m' }, T0: { const: 'T0' }, k: { name: 'slope of the melting line', fixed: true, value: 7.4e-8, unit: 'K/Pa', hint: '0.0074 K per bar: the Clausius–Clapeyron slope for ice Ih, negative because the liquid is denser.' }, p: { name: 'pressure (gauge, above 1 atm)', q: 'pressure', unit: 'bar', value: 200, min: 0, max: 2000 } },
      solveFor: 'Tm', note: 'Good to about 2,000 bar (−22 °C), where ice III takes over and the slope reverses.',
      stories: { Tm: 'Ice at the base of a glacier is under {p}. At what temperature does it melt?', p: 'What pressure is needed to melt ice at {Tm}?' } }
  ],
  examples: [
    { title: 'A bottle in the freezer', q: 'A glass bottle holds 750 mL of water with no air space. By what fraction does the water want to expand on freezing, and what pressure would be needed to stop it?',
      steps: ['Expansion: $999.8/916.7 - 1 = 0.0907$, so the ice wants to be $750 \\times 1.0907 = 818$ mL.', 'Preventing 9 % expansion means compressing ice by 9 %. With a bulk modulus near 9 GPa, that would take several hundred megapascals — but long before that the pressure melts the ice (at about 110 MPa for ice at −8 °C).', 'Glass fails at a few tens of MPa in tension.'],
      a: 'The water wants 9 % more room; a sealed bottle cannot provide it and breaks at a small fraction of the pressure the ice can exert.' },
    { title: 'How much of the iceberg', q: 'An iceberg of 1.0 million tonnes floats in sea water of density 1,025 kg/m³. What volume is above the surface?',
      steps: ['Volume of ice: $10^9\\ \\mathrm{kg} / 916.7 = 1.091\\times10^6\\ \\mathrm{m^3}$.', 'Displaced sea water must weigh $10^9$ kg: $10^9/1025 = 0.976\\times10^6\\ \\mathrm{m^3}$ submerged.', 'Above the surface: $1.091 - 0.976 = 0.115\\times10^6\\ \\mathrm{m^3}$, 10.6 % of the iceberg.'],
      a: 'About 115,000 m³ shows — a tenth. The other nine-tenths is the part ships hit.' }
  ],
  quiz: [
    { q: 'Ice floats in liquid water because', choices: ['it contains dissolved air', 'its molecules are arranged more loosely than the liquid\'s', 'it is colder, and cold things rise', 'surface tension holds it up'], a: 1, why: 'The hexagonal lattice holds molecules in an open pattern that the liquid partly collapses. Air only makes ice cloudy; cold water sinks rather than rises below 4 °C; surface tension cannot hold up a block.' },
    { q: 'An ice cube floats in a full glass of water. When it melts, the water', choices: ['overflows', 'drops below the brim', 'stays exactly at the brim', 'depends on the room temperature'], a: 2, why: 'The cube displaced its own weight of water; melting turns it into exactly that weight of water, which fills exactly the space it displaced.' },
    { q: 'In a liquid denser than sea water, ice would float higher.', a: true, why: 'The submerged fraction is ρ_ice/ρ_liquid. In a saturated brine of 1,200 kg/m³ ice shows 24 % of itself; in ethanol (789) it sinks.' },
    { q: 'Which of these solids sinks in its own melt?', choices: ['Ice in water', 'Solid silicon in molten silicon', 'Solid wax in melted wax', 'Solid bismuth in molten bismuth'], a: 2, why: 'Wax, like almost everything, packs more tightly as a solid. Silicon, bismuth and gallium are, with water, the rare exceptions whose solids are lighter than their liquids.' },
    { q: 'By what percentage does water expand when it freezes to ice Ih at 0 °C?', answer: 9.05, why: '999.84/916.7 = 1.0907: about 9 %. Equivalently the density falls by 8.3 %.' }
  ],
  applications: ['Lakes and seas freeze from the top, so fish, plankton and the whole ecology of cold water survive the winter under a lid.', 'Burst pipes, cracked engine blocks and potholes: water that freezes in a confined space.', 'Icebergs with nine-tenths hidden — the Titanic, and the floating ice shelves of Antarctica, which already displace their own weight so their melting does not raise the sea.', 'Ice cubes in a drink float and cool from the top, where the warmest liquid is.', 'Frost heave lifts roads and fence posts every winter in cold climates.'],
  history: 'Galileo argued in 1612, against the Aristotelians of Florence, that ice floats because it is less dense than water and not because of its flat shape. The hexagonal structure of ice was worked out by Bragg in 1922 from X-ray diffraction, the hydrogen positions by Bernal and Fowler in 1933 and Pauling in 1935.',
  sources: ['USGS Water Science School, "Water density" — the density table and the floating-ice figures.', 'Petrenko and Whitworth, *Physics of Ice*, ch. 2 (the structure of ice Ih).', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 3.', 'Henderson, *The Fitness of the Environment* (1913), ch. 4 — the earliest argument that floating ice is a condition for life.'],
  sim: 'ref-ice-floats'
},

/* ================================================================ a number */
{
  id: 'specific-heat-of-water', parent: 'the-ocean-that-remembers-heat', title: 'The specific heat of water', level: 1,
  short: 'It takes 4,184 joules to warm a kilogram of water by one degree — four times what air or rock needs, ten times what iron needs, more than any common liquid. A kettle, a bath, the sea and the body are all slow to warm and slow to cool for the same reason: the heat goes into bending hydrogen bonds.',
  keywords: ['specific heat', 'heat capacity', 'calorie', '4184', '4.18', 'J/kg K', 'kettle', 'thermal mass', 'why water heats slowly', 'specific heat capacity of water'],
  prereq: ['what-a-hydrogen-bond-is', 'physics:specific-heat'],
  related: ['why-the-heat-capacity-is-so-high', 'oceans-as-a-heat-reservoir', 'maritime-and-continental-climates', 'latent-heat-of-vaporisation', 'water-cools-machines', 'physics:latent-heat', 'chemistry:calorimetry'],
  body: `
Put a kilogram of water and a kilogram of iron on identical hotplates. After a minute the iron is nine degrees warmer than the water. The same energy went into both; the iron spent it all on making its atoms vibrate faster, which is what temperature measures. The water spent most of it on something else.

### The number
The **specific heat capacity** of a substance is the heat needed to raise one kilogram by one kelvin. For liquid water at 25 °C it is **4,182 J/(kg·K)** — 4.18 kJ, or one kilocalorie, the old "Calorie" of food labels, which was defined as exactly this. The value hardly changes across the liquid range: 4,217 at 0 °C, a minimum of 4,178 near 35 °C, 4,216 at 100 °C.

| Substance | Specific heat, J/(kg·K) | Per litre, kJ/(L·K) |
|---|---|---|
| liquid water | 4,182 | 4.17 |
| liquid ammonia (−33 °C) | 4,700 | 3.2 |
| ethanol | 2,440 | 1.93 |
| ice (0 °C) | 2,050 | 1.88 |
| steam (100 °C) | 2,010 | — |
| air | 1,005 | 0.0012 |
| granite | 790 | 2.1 |
| iron | 449 | 3.5 |
| mercury | 140 | 1.9 |

Per kilogram only liquid ammonia, another hydrogen-bonded liquid, comes close. Per litre water is far ahead of every liquid and most solids: a bath of water holds as much heat as a bath of iron, at a thirtieth of the weight.

### Where the heat goes
Temperature is the average kinetic energy of the molecules. In iron, nearly every joule you add becomes kinetic energy, so the temperature climbs fast. In water, a large share of each joule goes into stretching, bending and breaking hydrogen bonds — potential energy stored in the network, not motion. Warming water from 0 to 100 °C breaks about a fifth of its bonds, and that is where roughly half the heat is spent. The bonds act as a buffer that absorbs energy without showing it as temperature. (Ice, whose bonds are locked and cannot bend as freely, has half the specific heat of the liquid; so does steam, whose bonds are gone.)

### What it does to the world
- **The sea remembers.** The top 3.5 metres of the oceans hold as much heat as the entire atmosphere. The oceans have taken up about nine-tenths of the extra heat trapped by greenhouse gases since 1970 — on the order of $4\\times10^{23}$ J — and warmed, on average, by a fraction of a degree in doing so.
- **Coasts are mild.** Water warms and cools slowly, so a shore has cool summers and mild winters; an interior swings through 40 K or more between seasons. London (maritime) and Moscow (continental) are at nearly the same latitude.
- **The body is stable.** A person is 60 % water; the same meal's worth of heat that would warm a sack of sand by 5 K warms a person by 1 K, and sweat removes the rest.
- **Machines are cooled with it.** A litre a second of water carries away 4.2 kW per kelvin of warming: engines, power stations and data centres are built around that number.

### A unit, a calorie, a kilogram
The calorie was defined in 1824 as the heat to warm one gram of water by one degree; the kilocalorie is still how food energy is counted. The kilogram itself was first defined, in 1795, as the mass of a litre of water at the temperature of melting ice. Water's heat capacity is also why a kettle takes three minutes: 1.5 L from 20 to 100 °C is 500 kJ, four minutes at 2 kW, and at the end a pause while the last joules go into making steam rather than raising the temperature.

> [!key] Water takes 4,184 J to warm a kilogram by a kelvin because much of the heat is spent loosening hydrogen bonds instead of speeding molecules up. That one number keeps coasts mild, bodies stable and the oceans the planet's thermal memory.`,
  ideas: ['Specific heat is the energy to warm a kilogram by a kelvin; water\'s is 4,182 J/(kg·K) at 25 °C, nearly constant across the liquid range.', 'The heat goes largely into stretching and breaking hydrogen bonds, so the molecules speed up less than in a liquid without them.', 'Ice and steam, with bonds locked or gone, have about half the liquid\'s value.', 'The oceans\' heat capacity dwarfs the atmosphere\'s: the top 3.5 m of sea equal all the air above it.'],
  pitfalls: ['"Water heats slowly because it conducts heat badly" — Conduction sets how fast heat spreads, not how much is needed; water is in fact a good conductor for a liquid. The slowness is the heat capacity.', '"A high specific heat means water stores heat well in the sense of being warm" — It means a given heat changes the temperature little; the stored energy is large while the temperature change is small, which is the point of a hot-water bottle.', '"The food calorie and the physics calorie are the same" — The food Calorie (capital C) is a kilocalorie, 4,184 J; the small calorie is 4.184 J.'],
  terms: [
    { term: 'Specific heat capacity', also: ['specific heat', 'c', 'c_p'], def: 'The heat needed to raise the temperature of one kilogram of a substance by one kelvin, J/(kg·K). For liquid water 4,182 at 25 °C; the subscript p means at constant pressure.' },
    { term: 'Heat capacity', also: ['thermal mass', 'C'], def: 'The heat needed to raise the temperature of a particular body by one kelvin, J/K: mass times specific heat. A 1.5 L kettle of water has a heat capacity of 6.3 kJ/K.' },
    { term: 'Calorie', also: ['cal', 'kcal', 'Calorie'], def: 'The heat to warm one gram of water by one degree Celsius, 4.184 J. The food Calorie is a kilocalorie, 4,184 J, the heat to warm a kilogram of water by one degree.' },
    { term: 'Volumetric heat capacity', also: ['heat capacity per litre'], def: 'Heat capacity per unit volume, J/(m³·K) or kJ/(L·K): density times specific heat. Water\'s 4.17 kJ/(L·K) exceeds every common liquid\'s and most solids\', which is what matters when space, not weight, is the limit.' }
  ],
  formulas: [
    { name: 'Heat to warm water', expr: 'Q = m*c*dT', tex: 'Q = m\\,c_w\\,\\Delta T',
      vars: { Q: { name: 'heat', q: 'energy', unit: 'kJ', signed: true }, m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1.5 }, c: { const: 'cW' }, dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, signed: true, tex: '\\Delta T' } },
      solveFor: 'Q', note: 'Liquid water only, below the boiling point; c varies by less than 1 % between 0 and 100 °C.',
      stories: { Q: 'A kettle holds {m} of water and must be warmed by {dT}. How much heat is needed?', dT: '{Q} of heat go into {m} of water. By how much does it warm?', m: 'A heater delivers {Q} and the water warms by {dT}. How much water was there?' } },
    { name: 'Time to heat a kettle', expr: 't = m*c*dT/P', tex: 't = \\frac{m\\,c_w\\,\\Delta T}{P}',
      vars: { t: { name: 'time', q: 'time', unit: 'min' }, m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1.5 }, c: { const: 'cW' }, dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 80, tex: '\\Delta T' }, P: { name: 'heater power', q: 'power', unit: 'W', value: 2000, hint: 'A European kettle is 2–3 kW; a US one on 120 V about 1.5 kW; a camping stove 1–2 kW with much lost to the air.' } },
      solveFor: 't', note: 'Assumes all the power goes into the water: real kettles lose 10–20 % to the body and the air.',
      stories: { t: 'A {P} kettle holds {m} of water that must rise by {dT}. How long does it take?', P: '{m} of water rises by {dT} in {t}. What power went into it?' } },
    { name: 'The ocean layer that matches the atmosphere', expr: 'h = Ma*ca/(rho*c*A)', tex: 'h = \\frac{M_a\\,c_a}{\\rho\\,c\\,A}',
      vars: { h: { name: 'depth of ocean with the atmosphere\'s heat capacity', q: 'length', unit: 'm' }, Ma: { name: 'mass of the atmosphere', q: 'mass', unit: 'kg', value: 5.15e18, tex: 'M_a' }, ca: { name: 'specific heat of air', q: 'specificheat', unit: 'J/(kg·K)', value: 1005, tex: 'c_a' }, rho: { name: 'density of sea water', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990, hint: 'Salt lowers it a little below fresh water\'s 4,182.' }, A: { name: 'area of the oceans', q: 'area', unit: 'km²', value: 3.61e8 } },
      solveFor: 'h', note: 'About 3.5 m. The whole ocean, 3,700 m deep on average, holds a thousand times the atmosphere\'s heat.',
      stories: { h: 'The atmosphere has mass {Ma} and specific heat {ca}; sea water has density {rho}, specific heat {c}, and the oceans cover {A}. How deep a layer of sea holds the same heat as all the air?' } },
    { name: 'Warming of the ocean by a heat input', expr: 'dT = Q/(M*c)', tex: '\\Delta T = \\frac{Q}{M\\,c}',
      vars: { dT: { name: 'average temperature rise', q: 'dtemp', unit: 'mK', tex: '\\Delta T' }, Q: { name: 'heat taken up', q: 'energy', unit: 'J', value: 4e23, hint: 'The oceans took up roughly 4e23 J between 1971 and 2020 (IPCC AR6), about 90 % of the Earth\'s energy gain.' }, M: { name: 'mass of the oceans', q: 'mass', unit: 'kg', value: 1.37e21 }, c: { name: 'specific heat of sea water', q: 'specificheat', unit: 'J/(kg·K)', value: 3990 } },
      solveFor: 'dT', note: 'Spread over the whole ocean the warming is tens of millikelvin; it is concentrated in the top few hundred metres, which have warmed by several tenths of a degree.',
      stories: { dT: 'The oceans, {M} of sea water, absorb {Q}. By how much do they warm on average?', Q: 'The oceans warm by {dT} on average. How much heat did that take?' } }
  ],
  examples: [
    { title: 'The kettle', q: 'A 2.2 kW kettle holds 1.5 L of water at 18 °C. How long until it boils, and how much longer to boil away 100 mL?',
      steps: [{ text: 'Heat to reach 100 °C:', tex: 'Q = 1.5 \\times 4184 \\times 82 = 515\\ \\mathrm{kJ}' }, 'Time: $515/2.2 = 234$ s, about four minutes.', { text: 'Boiling off 0.1 kg needs the latent heat:', tex: 'Q = 0.1 \\times 2257 = 226\\ \\mathrm{kJ}' }, 'Another 103 s — nearly half as long again, with the temperature not rising at all.'],
      a: 'Four minutes to boil; a further hundred seconds to lose a tenth of the water as steam.' },
    { title: 'Sea and air', q: 'A heat input of 1 W/m² over the oceans for a year goes entirely into the top 100 m. By how much does that layer warm? And if the same energy went into the atmosphere?',
      steps: ['Energy per square metre in a year: $1 \\times 3.156\\times10^7 = 3.16\\times10^7$ J.', 'The top 100 m of sea per square metre: $100 \\times 1025 = 1.025\\times10^5$ kg, heat capacity $4.09\\times10^8$ J/K. Warming: $3.16\\times10^7 / 4.09\\times10^8 = 0.077$ K.', 'The atmosphere per square metre: $10^4$ kg (10 tonnes), heat capacity $1.0\\times10^7$ J/K. Warming: 3.1 K.'],
      a: 'The sea layer warms by 0.08 K; the same heat would warm the whole column of air by 3 K. That ratio is why the ocean sets the pace of climate.' }
  ],
  quiz: [
    { q: 'Equal masses of water and ethanol receive the same heat. The ethanol warms', choices: ['about half as much', 'about the same', 'about twice as much', 'about ten times as much'], a: 2, why: 'Ethanol\'s specific heat is 2,440 J/(kg·K), a little over half of water\'s 4,182, so the same heat raises its temperature nearly twice as far.' },
    { q: 'Ice has a higher specific heat than liquid water.', a: false, why: 'Ice is about 2,050 J/(kg·K), half the liquid\'s. In the crystal the bonds are locked and cannot absorb heat by bending and breaking the way the liquid\'s do.' },
    { q: 'Why does a sandy beach burn your feet at noon while the sea beside it is cool?', choices: ['Sand absorbs more sunlight', 'Sand has a lower specific heat and the heat stays in a thin top layer', 'The sea reflects all the sunlight', 'Sea water evaporates and so cannot warm'], a: 1, why: 'Sand\'s 830 J/(kg·K) is a fifth of water\'s, and sunlight is absorbed in its top few millimetres; the sea\'s heat is spread through metres of water with five times the capacity per kilogram, and evaporation helps a little too.' },
    { q: 'How many joules warm 250 g of water from 20 °C to 37 °C?', answer: 17780, unit: 'J', why: 'Q = 0.25 × 4184 × 17 = 17,800 J — about 18 kJ, the energy in a teaspoon of sugar.' },
    { q: 'If water\'s specific heat were that of mercury (140 J/(kg·K)), coastal climates would be', choices: ['much the same', 'far more extreme, like continental interiors', 'milder still', 'permanently foggy'], a: 1, why: 'The sea would warm and cool thirty times faster, giving up its moderating memory; coasts would swing with the seasons like the middle of a continent.' }
  ],
  applications: ['The kettle, the bath and the radiator: every household heating budget is 4.18 kJ per litre per degree.', 'Engine cooling, power-station condensers and data-centre chillers all move heat with water because nothing cheap carries more per litre.', 'Hot-water bottles and thermal storage tanks for solar heating.', 'Climate: the oceans\' uptake of 90 % of recent warming, maritime versus continental seasons, the lag of the hottest day a month behind the longest.', 'The body\'s thermal stability and the use of ice baths and warm baths in medicine.'],
  history: 'Joseph Black distinguished heat from temperature in Glasgow in the 1760s and measured the heat capacities of water and other substances; the calorie was defined by Clément in 1824; James Joule\'s paddle-wheel experiments of the 1840s fixed the mechanical equivalent of heat, 4.18 J per calorie, by stirring water.',
  sources: ['CRC *Handbook of Chemistry and Physics*, section 6 — specific heat of water and other substances against temperature.', 'IPCC, *Climate Change 2021: The Physical Science Basis*, ch. 7 — the Earth\'s energy inventory and the oceans\' share of it.', 'Eisenberg and Kauzmann, *The Structure and Properties of Water*, ch. 4 (thermodynamic properties).', 'NASA JPL, "NASA missions provide new insights into ocean worlds" (2017), for the role of heat in keeping oceans liquid.'],
  sim: 'ref-heat-capacity'
}
);
