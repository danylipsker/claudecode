/* HYPER-OPTICS · content/laser-families.js — the topic "Laser families" (12 concepts)
 * laser-families-overview · gas-lasers · helium-neon-laser · co2-and-excimer-lasers · solid-state-lasers · diode-lasers ·
 * vcsels-and-laser-arrays · fibre-lasers · frequency-doubling-and-nonlinear-optics · common-laser-wavelengths ·
 * choosing-a-laser · lasers-at-work
 * Simulations: sims/laser-families.js (lz-…). Wavelengths, photon energies, mode spacings and mirror stacks come from the
 * ray bench's laser tables and thin-film code; the figures that are typical rather than exact are said to be so.
 */
Hyper.add(

/* ================================================================ the families, in one picture */
{
  id: 'laser-families-overview', parent: 'laser-families', title: 'The laser families', level: 1,
  short: 'A laser is named for what is inside it, and that gain medium decides nearly everything: the wavelength, how the laser is pumped, how much power it gives, how clean its beam is. Five families cover almost every laser: gas, solid-state, semiconductor, fibre and dye.',
  keywords: ['laser types', 'laser families', 'gain medium', 'gas laser', 'solid-state laser', 'diode laser', 'fibre laser', 'dye laser', 'pumping', 'wall-plug efficiency', 'DPSS', 'tunable laser', 'laser line'],
  prereq: ['what-makes-laser-light-special', 'stimulated-emission', 'population-inversion-and-pumping'],
  related: ['gas-lasers', 'solid-state-lasers', 'diode-lasers', 'fibre-lasers', 'common-laser-wavelengths', 'choosing-a-laser', 'laser-safety-classes', 'physics:lasers'],
  body: `
A laser is named after what is inside it. A **helium–neon** laser has a glass tube of those two gases; a **Nd:YAG** laser has a crystal of yttrium aluminium garnet with a little neodymium in it; a **diode** laser is a chip of semiconductor. The name matters because this **gain medium** decides almost everything: the wavelength, how the laser has to be pumped, how much power it can give, how clean its beam is, how large and how efficient the whole machine is.

### Why the medium sets the colour
Light is amplified only at wavelengths where the medium has a transition ready to give up a photon ([[stimulated-emission]]). A helium–neon laser can make only the lines of neon, 632.8 nm among them, and no mirror or filter will change that. A medium with a broad band of transitions, such as a dye or titanium–sapphire, can be tuned over tens or hundreds of nanometres; one with a single narrow line, like Nd:YAG at 1064 nm, cannot.

### The five families
| Family | Gain medium | Pumped by | Wavelengths | Power | Beam | Wall-plug efficiency |
|---|---|---|---|---|---|---|
| Gas | atoms, ions or molecules at low pressure | electric discharge | 193 nm to 10.6 µm | µW to 20 kW | excellent | 0.01 % (He–Ne) to 20 % (CO₂) |
| Solid-state | metal ions in a crystal or glass | flash lamp or laser diode | 0.7 to 3 µm, and harmonics down to 213 nm | mW to kW (MJ in pulses) | good | 1–3 % lamp, 10–30 % diode |
| Semiconductor | a p–n junction | the current itself | 375 nm to the mid-infrared | mW to W per chip, kW in stacks | elliptical | 25–65 % |
| Fibre | rare-earth ions in a glass core | laser diodes | 1.0 to 2.1 µm | W to 100 kW | excellent | 30–50 % |
| Dye | an organic dye in solution | flash lamp or another laser | 400–900 nm, tunable | mW to W | good | low |

### What each is good at
- **Gas**: sharp lines and perfect beams ([[helium-neon-laser]]), or great power in the far infrared and the ultraviolet ([[co2-and-excimer-lasers]]). Bulky, with a high-voltage supply and low efficiency. See [[gas-lasers]].
- **Solid-state**: ions in a crystal hold their energy for microseconds to milliseconds, so the medium stores energy for short, strong pulses; a broad gain makes the shortest pulses. See [[solid-state-lasers]].
- **Semiconductor**: the smallest, cheapest and most efficient, driven directly by a current and switched in nanoseconds; the beam needs optics to tidy it. See [[diode-lasers]] and [[vcsels-and-laser-arrays]].
- **Fibre**: turns the poor beam of pump diodes into a near-perfect one, and sheds heat easily along its length. See [[fibre-lasers]].
- **Dye**: tunable across the visible, but messy to run, and now largely replaced by titanium–sapphire and optical parametric oscillators.

### The diode is the engine of the others
Almost every new solid-state laser and fibre laser is pumped by diodes: they get their energy from them. The efficiency, size and life of the whole machine are then those of its pump. Nonlinear crystals then carry the infrared lines into the visible and ultraviolet ([[frequency-doubling-and-nonlinear-optics]]), so one family can reach beyond its own range.

> [!key] The gain medium sets the wavelength, the pump and the beam; the five families trade efficiency, beam quality, power, size and pulse length against each other. Choosing among them is [[choosing-a-laser]]; the lines they make are in [[common-laser-wavelengths]].
`,
  ideas: [
    'A laser is named for its gain medium: gas, solid-state, semiconductor, fibre or dye.',
    'The medium sets the wavelength: mirrors and filters can only choose among its lines, not invent new ones.',
    'The families trade off: gas lasers give the cleanest beams, diodes the best efficiency and size, solid-state and fibre lasers the highest powers and shortest pulses.',
    'Nearly every new solid-state and fibre laser is pumped by diodes: the diode is the engine of modern lasers.',
    'Nonlinear crystals extend the families: doubling and tripling carry infrared lasers into the visible and the ultraviolet.'
  ],
  pitfalls: [
    'A laser can be made any colour with a filter or a prism — A filter can only remove light, and a prism can only separate the lines the laser already makes. A new colour needs a different medium, a tunable one, or a nonlinear crystal.',
    'The most powerful laser is the best one — Power is one trait among many. A 2 mW helium–neon laser beats a 50 W diode bar for interferometry, because its beam is clean and its wavelength steady.',
    'Gas lasers are obsolete — Fewer are sold, but carbon dioxide lasers cut non-metals, excimer lasers print chips and reshape corneas, and helium–neon lasers still serve metrology, because no other laser does those things as well.'
  ],
  terms: [
    { term: 'Gain medium', also: ['active medium', 'laser medium'], def: 'The material in which light is amplified: a gas, a crystal or glass doped with ions, a semiconductor, a doped fibre or a dye solution. It sets the wavelength and much else.' },
    { term: 'Tunable laser', def: 'A laser whose wavelength can be changed over a range, from nanometres to hundreds of nanometres, because its medium has a broad gain band.' },
    { term: 'Diode-pumped solid-state laser', also: ['DPSS'], def: 'A solid-state laser pumped by laser diodes instead of lamps: more efficient, more compact and longer-lived.' },
    { term: 'Laser line', def: 'One of the discrete wavelengths at which a laser can oscillate. Neon has several in the visible, Nd:YAG at least five in the infrared.' }
  ],
  formulas: [
    {
      name: 'Wall-plug efficiency',
      expr: 'eta = Pout/Pin', tex: '\\eta = \\frac{P_{\\mathrm{out}}}{P_{\\mathrm{in}}}',
      vars: {
        eta: { name: 'wall-plug efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Pout: { name: 'light output', q: 'power', unit: 'W', value: 4000, tex: 'P_{\\mathrm{out}}' },
        Pin: { name: 'electrical power drawn', q: 'power', unit: 'W', value: 11400, tex: 'P_{\\mathrm{in}}' }
      },
      solveFor: 'eta',
      note: 'The supply, the pump diodes and the cooling count in the input.',
      stories: { eta: 'A laser gives {Pout} of light and draws {Pin} from the mains. What is its wall-plug efficiency?', Pin: 'A laser of efficiency {eta} must give {Pout} of light. How much electrical power does it draw?' }
    },
    {
      name: 'Heat to carry away',
      expr: 'Q = Pout*(1/eta - 1)', tex: 'Q = P_{\\mathrm{out}}\\left(\\frac{1}{\\eta} - 1\\right)',
      vars: {
        Q: { name: 'heat produced', q: 'power', unit: 'W' },
        Pout: { name: 'light output', q: 'power', unit: 'W', value: 100, tex: 'P_{\\mathrm{out}}' },
        eta: { name: 'wall-plug efficiency', q: 'ratio', unit: '%', value: 35, min: 0.001, max: 100, tex: '\\eta' }
      },
      note: 'Every watt of light that is missing from the efficiency leaves as heat in the laser, its supply and its pump.',
      stories: { Q: 'A laser of efficiency {eta} gives {Pout} of light. How much heat must the cooling remove?' }
    }
  ],
  examples: [
    {
      title: 'The heat of a kilowatt',
      q: 'A 4 kW laser is built either as a diode-pumped fibre laser (35 % wall-plug efficiency) or as a lamp-pumped Nd:YAG laser (3 %). How much electrical power does each draw, and how much heat must the chiller remove?',
      steps: [
        { text: 'The input power is the output over the efficiency. Fibre laser:', tex: 'P_{\\mathrm{in}} = \\frac{4000}{0.35} = 11\\,400\\ \\mathrm{W}, \\qquad Q = 11\\,400 - 4000 = 7400\\ \\mathrm{W}' },
        { text: 'Lamp-pumped:', tex: 'P_{\\mathrm{in}} = \\frac{4000}{0.03} = 133\\,000\\ \\mathrm{W}, \\qquad Q = 133\\,000 - 4000 = 129\\,000\\ \\mathrm{W}' },
        'The lamp-pumped machine needs the electrical supply of a small factory and a chiller seventeen times larger. That, as much as beam quality, is why lamps lost to diodes.'
      ],
      a: 'The fibre laser draws about 11 kW and sheds 7.4 kW; the lamp-pumped laser draws 133 kW and sheds 129 kW.'
    },
    {
      title: 'Which family?',
      q: 'A workshop wants to cut 3 mm steel sheet at several metres per minute. It needs about 3 kW of continuous light at about 1 µm, a beam that focuses to under 0.2 mm, and a machine that can run all day without a large cooling plant. Which family suits best?',
      steps: [
        'Gas: carbon dioxide gives the power, but at 10.6 µm steel reflects most of it, and the efficiency (10–20 %) means a large plant.',
        'Diode: efficient, but a stack of many emitters gives a poor beam that cannot make a 0.2 mm spot over a useful depth.',
        'Lamp-pumped solid-state: the beam is good, but the efficiency is a few per cent.',
        'Fibre: 1.07 µm is absorbed far better by steel, the beam is near perfect, and the efficiency is 30–50 %.'
      ],
      a: 'A ytterbium fibre laser, which is why they have taken over the cutting of sheet metal.'
    }
  ],
  quiz: [
    { q: 'What decides the set of wavelengths a laser can make?', choices: ['The gain medium', 'The pump power', 'The reflectivity of the mirrors', 'The size of the cavity'], a: 0, why: 'The wavelengths are the transitions of the medium. The cavity chooses among the closely spaced modes inside such a line, and the mirrors can favour one line over another, but neither adds new lines.' },
    { q: 'A laser draws 100 W from the mains and gives 30 W of light. How many watts of heat must be removed?', answer: 70, unit: 'W', why: 'The efficiency is 30 %. What is not light is heat: 100 − 30 = 70 W.' },
    { q: 'A very narrow filter placed in front of a red helium–neon laser can turn its beam green.', a: false, why: 'A filter only removes light. The tube produces no green at 632.8 nm, so the filter would pass nothing. A green beam needs the 543.5 nm line of a green helium–neon laser, or a different laser altogether.' },
    { q: 'Which family turns the poor beam of pump diodes into a near-perfect beam?', choices: ['Gas lasers', 'Fibre lasers', 'Dye lasers', 'Light-emitting diodes'], a: 1, why: 'In a double-clad fibre the pump travels in a large cladding and the signal in a single-mode core, so the output beam is set by the core, not by the pump.' },
    { q: 'Which of these converts electricity into laser light most efficiently?', choices: ['An argon-ion laser', 'A lamp-pumped Nd:YAG laser', 'A helium–neon laser', 'A diode laser'], a: 3, why: 'A good diode laser turns 40–65 % of its electrical power into light. The helium–neon and argon-ion lasers manage less than 0.1 %, the lamp-pumped YAG a few per cent.' }
  ],
  applications: [
    'Choosing a laser for a job: the family is usually the first decision, before the wavelength or the power.',
    'Industry: fibre lasers for metal, carbon dioxide lasers for plastics, wood and glass, excimer lasers for chips and displays.',
    'Telecommunications and data: semiconductor lasers at 850, 1310 and 1550 nm, with erbium fibre amplifiers along the way.',
    'Science: titanium–sapphire for ultrashort pulses, helium–neon for interferometry, dye and parametric sources for tunable light.'
  ],
  history: 'Theodore Maiman made the first laser, a ruby, in May 1960; Ali Javan, William Bennett and Donald Herriott made the first gas laser, a helium–neon, in December of that year. Four American groups made the first semiconductor lasers in the autumn of 1962, and the dye laser followed in 1966. The carbon dioxide laser (Kumar Patel, 1964) and the Nd:YAG laser (1964) completed the set of the first decade. Since then the story has been the diode: smaller, cheaper and more efficient every decade, until it pumped nearly everything else.',
  sources: [
    'O. Svelto, *Principles of Lasers* — the chapters on the individual laser systems: gas, solid-state, semiconductor and others.',
    'A. E. Siegman, *Lasers* (University Science Books) — the reference on how any gain medium and cavity make a laser.',
    'E. Hecht, *Optics* — the chapter on lasers, for the types and their output.',
    'J. Hecht, *Beam: The Race to Make the Laser* (Oxford University Press, 2005) — how the first lasers of each family came about.'
  ],
  sim: { id: 'lz-map', params: { view: 'families' } }
},

/* ================================================================ gas lasers */
{
  id: 'gas-lasers', parent: 'laser-families', title: 'Gas lasers', level: 1,
  short: 'A gas laser is a tube of low-pressure gas lit by an electric discharge, with a mirror at each end. Its atoms, ions or molecules have sharp energy levels, so it makes narrow lines and the best beams of any laser; but the gain is low, the tube long, the supply high-voltage and the efficiency small.',
  keywords: ['gas laser', 'discharge tube', 'argon ion laser', 'krypton ion laser', 'helium-cadmium', 'nitrogen laser', 'Brewster window', 'electron impact', 'ion laser', 'Doppler broadening', 'superradiant', 'metal vapour laser'],
  prereq: ['laser-families-overview', 'population-inversion-and-pumping', 'the-laser-cavity'],
  related: ['helium-neon-laser', 'co2-and-excimer-lasers', 'brewster-angle', 'laser-modes', 'linewidth-and-coherence-of-lasers', 'laser-safety-classes', 'physics:lasers'],
  body: `
A gas laser is a tube of gas, an electrode at each end, and two mirrors. Pass a current through the gas and it glows; with the right gas and the right mirrors it also lases. Atoms, ions and molecules in a gas are far apart and almost undisturbed, so their energy levels are sharp: gas lasers make **narrow lines**, and because a gas is optically perfect they give the cleanest beams of any laser. The price is a long, low-gain, high-voltage, inefficient device.

### What is inside
A glass or ceramic tube with a bore of one to a few millimetres, filled to a few millibar (a helium–neon tube holds about 3 mbar; excimer lasers work at several bar). The electrodes strike the discharge and carry its current. The mirrors are either fused to the tube or stand outside it, behind windows set at **Brewster's angle** ([[brewster-angle]]): light polarized in the plane of incidence passes with no loss, the other polarization loses a little at each pass, and the beam comes out linearly polarized.

### How a discharge makes an inversion
Electrons accelerate in the electric field, strike atoms and raise them to excited levels: **electron-impact excitation**. An inversion then comes in one of two ways:
- the electrons feed the upper level directly, and it lives longer than the lower level, which empties quickly (neon, the argon ion), or
- a second gas is excited first and hands its energy to the lasing species in a near-resonant collision (helium to neon, nitrogen to carbon dioxide).

### Why the gain is small
A gas is thin. A helium–neon tube gains a few per cent per pass, so the laser works only because mirrors of 99.9 % and 98–99 % lose less than that gain: hence long tubes, narrow bores, mirrors of the highest quality, and a threshold below which only the glow is seen. The gain curve is also narrow: **Doppler broadening** by the motion of the atoms makes the neon line at 633 nm about 1.5 GHz wide, which is 2 picometres.

### The members
| Laser | Main lines | Power | What is special |
|---|---|---|---|
| Helium–neon | 632.8 nm (and 543.5, 594.1, 611.9, 1152, 3391) | 0.5–50 mW | the cleanest beam and a long coherence length |
| Argon ion | 488.0, 514.5 nm (and ultraviolet lines near 351) | 10 mW–25 W | the gas is ionised first: tens of amperes, water cooling |
| Krypton ion | 647.1 nm (and yellow, green, violet) | 0.1–5 W | mixed with argon for "white" light shows |
| Helium–cadmium | 441.6 and 325.0 nm | 10–200 mW | continuous blue and ultraviolet, from a heated cadmium reservoir |
| Nitrogen | 337.1 nm | mJ pulses | gain so high that it needs no mirrors; pulses of a few nanoseconds |
| Carbon dioxide, excimer | 10.6 µm; 193–351 nm | W to kW | see [[co2-and-excimer-lasers]] |

An **ion laser** needs the gas to be ionised and the ion excited, a total of about 35 eV for argon, so it runs on a very high current density, and a plasma much hotter than the tube; a magnetic field often keeps the plasma off the walls. The result is a laser of 5 W from 10–20 kW of electricity. A **nitrogen laser** is the opposite: its upper level lives only some tens of nanoseconds and its gain is so large that one pass through the gas is enough (**superradiance**), but it cannot run continuously.

### Where they stand
Diodes and diode-pumped solid-state lasers have taken the jobs they can do. What remains is where gas does best: the purity of a helium–neon beam, the ultraviolet pulses of excimers, 10.6 µm from carbon dioxide, and the large ion lasers of older microscopes and light shows.

> [!warn] Even a small gas laser has a power supply that produces kilovolts. Never open the case of a laser or its supply while it is connected; the voltage can kill, and a charged tube stays dangerous after the power is switched off. Gas lasers of tens of milliwatts and above are Class 3B or 4: see [[laser-safety-classes]].

> [!key] A gas discharge excites atoms, ions or molecules with sharp levels, so gas lasers make narrow lines and perfect beams, at the price of small gain, high voltage and low efficiency. The gas decides the wavelength; the mirrors must lose less than the gas gains.
`,
  ideas: [
    'A gas laser is a discharge tube between two mirrors; electrons excite the gas and the excited atoms, ions or molecules give the light.',
    'Sharp levels give narrow lines (a Doppler width of about 1.5 GHz) and a perfect beam, but a thin gas gives little gain per pass, so the mirrors must be excellent.',
    'An inversion comes from a long-lived upper level and a quick lower one, or from a second gas that passes its energy on (He to Ne, N₂ to CO₂).',
    'Ion lasers need tens of amperes and water cooling and turn less than 0.1 % of the power into light.',
    'Gas lasers survive where nothing else matches them: the beam of the helium–neon, the ultraviolet of the excimer, the 10.6 µm of carbon dioxide.'
  ],
  pitfalls: [
    'The more power the discharge carries, the more light the laser gives — Up to an optimum only. Above it the gas heats, the population of the lower level builds up, and the output falls. Each tube has a current at which it works best.',
    'A gas laser needs a gas of one kind — Most use two or three: helium or nitrogen transfers energy or empties the lower level, and the lasing species is a small admixture.',
    'Gas lasers are harmless because they are weak — A helium–neon tube is Class 2 to 3R, but an ion laser of 5 W is Class 4, and every gas laser has a supply of kilovolts.'
  ],
  terms: [
    { term: 'Gas discharge', also: ['glow discharge', 'electric discharge'], def: 'A current carried through a low-pressure gas by free electrons, which excite the atoms they strike. It is the pump of gas lasers.' },
    { term: 'Electron-impact excitation', def: 'The raising of an atom or molecule to an excited level by a collision with a fast electron.' },
    { term: 'Ion laser', also: ['argon-ion laser', 'krypton-ion laser'], def: 'A gas laser in which the lasing transitions are between levels of ions: the gas must first be ionised, so the current is very high and the efficiency very low.' },
    { term: 'Doppler broadening', def: 'The widening of a spectral line caused by the thermal motion of the atoms: those moving towards the light see a higher frequency, those moving away a lower one.' },
    { term: 'Superradiance', also: ['superluminescence', 'amplified spontaneous emission'], def: 'Strong amplification of spontaneous emission in a single pass of a high-gain medium, so that a beam emerges without any mirrors.' }
  ],
  formulas: [
    {
      name: 'Gain needed to lase',
      expr: 'g = 1/sqrt(R1*R2) - 1', tex: 'g = \\frac{1}{\\sqrt{R_1 R_2}} - 1',
      vars: {
        g: { name: 'single-pass gain needed (the light grows by 1 + g)', q: 'ratio', unit: '%' },
        R1: { name: 'reflectivity of the first mirror', q: 'ratio', unit: '%', value: 99.9, min: 1, max: 100, tex: 'R_1' },
        R2: { name: 'reflectivity of the second mirror', q: 'ratio', unit: '%', value: 99, min: 1, max: 100, tex: 'R_2' }
      },
      solveFor: 'g',
      note: 'Light that makes a full round trip is amplified twice, by (1 + g)², and loses R₁R₂: it just maintains itself when the two are equal. Other losses in the tube add to the need.',
      stories: { g: 'A laser has mirrors of {R1} and {R2}. What single-pass gain makes it just reach threshold?', R2: 'A rear mirror of {R1} and a tube whose gain is {g} per pass: how reflective may the output mirror be?' }
    },
    {
      name: 'Electrical power for a given beam',
      expr: 'Pin = Pout/eta', tex: 'P_{\\mathrm{in}} = \\frac{P_{\\mathrm{out}}}{\\eta}',
      vars: {
        Pin: { name: 'electrical power drawn', q: 'power', unit: 'W', tex: 'P_{\\mathrm{in}}' },
        Pout: { name: 'light output', q: 'power', unit: 'W', value: 5, tex: 'P_{\\mathrm{out}}' },
        eta: { name: 'wall-plug efficiency', q: 'ratio', unit: '%', value: 0.03, min: 0.001, max: 100, tex: '\\eta' }
      },
      note: 'For a gas laser the answer is often startling: an ion laser makes light with about 0.03 % of the power it draws.',
      stories: { Pin: 'An argon-ion laser gives {Pout} of light at an efficiency of {eta}. How much power does it draw?' }
    }
  ],
  examples: [
    {
      title: 'Why a helium–neon tube needs good mirrors',
      q: 'A 30 cm helium–neon tube gains 3 % per pass. The rear mirror reflects 99.9 %. What is the lowest reflectivity the output mirror can have if the laser is still to work, and why are real output mirrors nearer 99 %?',
      steps: [
        { text: 'At threshold the gain per round trip equals the loss:', tex: '(1 + g)^2\\,R_1 R_2 = 1 \\quad\\Rightarrow\\quad R_2 = \\frac{1}{(1.03)^2 \\times 0.999} = 0.943' },
        'So the output mirror may reflect as little as 94.3 %, giving up to 5.7 % of the light — but then the laser sits right at threshold and gives no output.',
        'The output is greatest at some coupling well above the minimum reflectivity. The tube also has other losses (windows, scattering, the bore), and its gain falls as it warms; a 98–99 % output mirror leaves room for all that.'
      ],
      a: 'At least 94.3 %; in practice 98–99 %, which gives a stable beam of a few milliwatts.'
    },
    {
      title: 'The price of an ion laser',
      q: 'An argon-ion laser gives 5 W with a wall-plug efficiency of 0.03 %. How much electrical power does it draw, and what flow of cooling water, warming by 10 K, carries the heat away? (Water: 4.18 kJ per kilogram per kelvin.)',
      steps: [
        { text: 'The input power:', tex: 'P_{\\mathrm{in}} = \\frac{5}{0.0003} = 16\\,700\\ \\mathrm{W}' },
        { text: 'The heat is almost all of it. The water flow that carries it away:', tex: '\\dot m = \\frac{Q}{c\\,\\Delta T} = \\frac{16\\,700}{4180 \\times 10} = 0.40\\ \\mathrm{kg/s}' },
        'That is 24 litres per minute: a garden hose. Small ion tubes of tens of milliwatts are cooled by a fan; large ones need a three-phase supply and a water circuit.'
      ],
      a: 'About 17 kW, and 0.4 kg of water every second (24 litres per minute).'
    }
  ],
  quiz: [
    { q: 'Why do gas lasers have narrow lines compared with lasers of crystals or semiconductors?', choices: ['The atoms are far apart and almost undisturbed, so their levels are sharp', 'The mirrors are better', 'The tube is longer', 'Gas is hotter'], a: 0, why: 'In a solid the neighbours shift every ion\u2019s levels in a different way. In a thin gas each atom has nearly its own free levels, and the line is only as wide as the Doppler motion of the atoms makes it.' },
    { q: 'A helium–neon tube has a gain of 2 % per pass. Which pair of mirrors will not make it lase?', choices: ['99.9 % and 99 %', '99.9 % and 98 %', '99 % and 98 %', '95 % and 95 %'], a: 3, why: 'The gain needed is $1/\\sqrt{R_1R_2} - 1$. For 95 % and 95 % it is 5.3 %, more than the tube gives. The other pairs need 0.6 %, 1.0 % and 1.5 %.' },
    { q: 'The nitrogen laser needs no mirrors.', a: true, why: 'Its gain is so high that light amplified in a single pass emerges as a beam (superradiance). The cost is that the upper level lives only briefly, so it runs in pulses of a few nanoseconds.' },
    { q: 'An argon-ion laser of 10 W has a wall-plug efficiency of 0.05 %. How much electrical power does it draw, in kilowatts?', answer: 20, unit: 'kW', why: '$P_{in} = 10/0.0005 = 20\\,000$ W. The rest of it, almost 20 kW, is heat for the cooling water.' },
    { q: 'Why does the output of a laser tube with Brewster windows come out polarized?', choices: ['The windows reflect part of one polarization away at each pass, so the other has the higher net gain', 'The gas is polarized by the discharge', 'The mirrors absorb one polarization', 'The beam is too thin to be unpolarized'], a: 0, why: 'At Brewster\u2019s angle the polarization in the plane of incidence passes without loss and the perpendicular one loses some at each window. After many round trips only the first survives.' }
  ],
  applications: [
    'Helium–neon lasers: alignment, interferometry, holography and the testing of optics.',
    'Argon-ion and krypton-ion lasers: confocal microscopes, flow cytometers, holography, Raman spectroscopy, and the light shows of the past.',
    'Helium–cadmium lasers: writing gratings and masks, and fluorescence at 442 nm and 325 nm.',
    'Nitrogen lasers: pumping dye lasers and the laser desorption of molecules in mass spectrometers.'
  ],
  history: 'Ali Javan, William Bennett and Donald Herriott at Bell Telephone Laboratories made the first gas laser, a helium–neon laser at 1152 nm, in December 1960. It was also the first laser to run continuously. The argon-ion laser followed in 1964 (William Bridges, Hughes Research Laboratories), and the carbon dioxide laser in the same year.',
  sources: [
    'W. R. Bennett Jr., *The Physics of Gas Lasers* (Gordon and Breach, 1977) — discharge physics and the individual gas lasers.',
    'A. E. Siegman, *Lasers* — the chapters on gain media and on laser oscillation.',
    'A. Javan, W. R. Bennett Jr. and D. R. Herriott, "Population inversion and continuous optical maser oscillation in a gas discharge containing a He–Ne mixture", *Physical Review Letters* 6 (1961) 106.'
  ],
  sim: 'lz-discharge'
},

/* ================================================================ the helium–neon laser */
{
  id: 'helium-neon-laser', parent: 'laser-families', title: 'The helium–neon laser', level: 1,
  short: 'The helium–neon laser makes a thin red beam at 632.8 nm of a few milliwatts, so clean and so steady in wavelength that it was for decades the laboratory\u2019s ruler. Helium stores the energy; neon does the radiating.',
  keywords: ['helium-neon laser', 'He-Ne', 'HeNe', '632.8 nm', 'red laser', 'metastable', 'Doppler broadening', 'longitudinal modes', 'coherence length', 'frequency stabilised', 'warm-up', '3.39 micron', '543 nm', 'interferometry laser'],
  prereq: ['gas-lasers', 'laser-modes', 'linewidth-and-coherence-of-lasers'],
  related: ['the-laser-cavity', 'michelson-interferometer', 'coherence', 'holography', 'laser-safety-classes', 'alignment-telescopes-and-lasers', 'interferometers-in-precision-engineering'],
  body: `
The helium–neon laser is a glass tube 15 to 50 cm long, narrower than a pencil, with a mirror at each end. It makes a beam half a millimetre wide that spreads by about a milliradian, of 0.5 to 5 mW (more in large tubes), at **632.8 nm**. Its wavelength is among the most constant in optics, and its beam is as near perfect as a laser beam gets.

### Two gases, two jobs
The tube holds helium and neon at about 3 mbar, five to ten parts helium to one of neon. The electrons of the discharge excite mostly the helium, which has two long-lived excited levels (**metastable** levels, at 19.8 and 20.6 eV, from which the atom cannot easily radiate). Neon has levels at 19.8 and 20.7 eV; when an excited helium atom meets a neon atom, the energy changes hands in a near-resonant collision. The neon atom is then in a level that lives about ten times longer than the level below it, which gives an inversion.

The transition to the lower level releases 1.959 eV, a photon of 632.8 nm. The neon then falls quickly to a lower level and, from there, back to its ground state mostly by **hitting the wall** of the tube: that is why the bore is so narrow, the gain falling as the tube widens.

### The lines
| Wavelength | Colour | Notes |
|---|---|---|
| 632.8 nm | red | the common line, and the strongest visible one |
| 611.9 nm | orange | weak; special mirrors |
| 594.1 nm | yellow | weak |
| 543.5 nm | green | a fraction of the red tube's power; used in microscopes |
| 1152 nm | infrared | the very first gas laser line (1960) |
| 3391 nm | infrared | highest gain of all; red tubes use mirrors that do not reflect it |

### Modes and coherence
The neon line is about 1.5 GHz wide, set by the thermal motion of the atoms ([[laser-modes]]). The cavity modes are $c/2L$ apart: 500 MHz in a 30 cm tube. Two or three fit under the gain curve, so a typical tube has two or three modes and a coherence length of about 20 cm; a short tube (15 cm) may have one, with a coherence length of hundreds of metres. In the first quarter of an hour the tube warms and expands by a few micrometres, the comb of modes slides across the gain curve, and the output wobbles by a few per cent: **let a helium–neon laser warm up** before measuring with it.

### Stabilised lasers and the metre
Locking a single mode to a reference (the Zeeman splitting of the line, or an absorption line of iodine near 633 nm) holds the frequency to a few parts in 10¹¹. Such lasers were the working standard of length for decades, and an iodine-stabilised helium–neon laser is still one of the recommended radiations for realising the metre.

### Efficiency and life
Of the 5 to 10 W a small tube draws, about 0.02 % is light. Helium slowly leaks through the glass, and the tube has a life of 10 000 to 50 000 hours. A red diode is cheaper, smaller and more efficient: it replaced the helium–neon laser in barcode scanners and pointers, but not where a perfectly round beam, no mode hops, tiny drift and a long coherence length matter: interferometry, holography, optical testing and alignment.

> [!warn] A tube of up to 1 mW is Class 2, up to 5 mW Class 3R, above 5 mW Class 3B: never look into the beam or at its reflection in a mirror or glass. The supply produces several kilovolts to start the discharge and about a kilovolt while it runs: do not touch the connections, even with the laser off. See [[laser-safety-classes]].

> [!key] Helium stores the energy and hands it to neon, which radiates 632.8 nm (and five weaker lines); the line is 1.5 GHz wide, so a 30 cm tube has two or three modes. The result is the cleanest and steadiest beam in common use, at less than 0.1 % efficiency.
`,
  ideas: [
    'Helium is excited by the discharge and passes its energy to neon by collision; neon emits the red photon at 632.8 nm (1.959 eV).',
    'The bore is very narrow because the lower levels of neon relax by collisions with the wall of the tube.',
    'The Doppler-broadened gain line is about 1.5 GHz wide and the modes are c/2L apart, so a 30 cm tube has two or three modes.',
    'A helium–neon laser must warm up: as the tube expands, modes slide across the gain curve and the output wobbles.',
    'Efficiency is under 0.1 %, but the beam quality, the steadiness of the wavelength and the long coherence length are hard to match.'
  ],
  pitfalls: [
    'Helium is what emits the red light — Helium has no transition at 632.8 nm. It only stores energy and passes it to neon, which emits.',
    'A longer tube always gives a better beam — It gives more gain and more power, but its modes lie closer together, so more of them fit under the gain curve and the coherence length falls. The single-mode tubes are the short ones.',
    'A red laser pointer is a miniature helium–neon laser — Pointers are diode lasers (650 nm, or near it). They are cheaper and more efficient, with an elliptical beam and a wavelength that drifts with temperature.'
  ],
  terms: [
    { term: 'Energy transfer', also: ['resonant energy transfer', 'collisional transfer'], def: 'The exchange of excitation between two kinds of atoms in a collision, most efficient when their energy levels nearly coincide, as helium\u2019s and neon\u2019s do.' },
    { term: 'Doppler width', also: ['Doppler-broadened linewidth'], def: 'The width of a gas line caused by the thermal motion of the atoms: about 1.5 GHz for neon at 633 nm.' },
    { term: 'Frequency-stabilised laser', def: 'A laser whose frequency is locked to a reference (a Zeeman splitting or a molecular absorption line) so that it stays constant to a few parts in 10¹¹ or better.' }
  ],
  formulas: [
    {
      name: 'Doppler width of a gas line',
      expr: 'dnu = 7.16e-7*nu0*sqrt(T/M)', tex: '\\Delta\\nu_D = 7.16\\times 10^{-7}\\,\\nu_0\\sqrt{\\frac{T}{M}}',
      vars: {
        dnu: { name: 'Doppler width (FWHM)', q: 'frequency', unit: 'GHz', tex: '\\Delta\\nu_D' },
        nu0: { name: 'frequency of the line', q: 'frequency', unit: 'THz', value: 473.8, tex: '\\nu_0' },
        T: { name: 'gas temperature', q: 'temperature', unit: 'K', value: 400, min: 100, max: 2000 },
        M: { name: 'mass of the atom, in atomic mass units', q: false, unit: 'u', value: 20.18, min: 1, max: 300 }
      },
      solveFor: 'dnu',
      note: 'T in kelvin, M in atomic mass units. For neon at 400 K and 632.8 nm: about 1.5 GHz.',
      stories: { dnu: 'Neon atoms (mass {M}) at {T} emit a line at {nu0}. How wide is the line, with the thermal motion alone?' }
    },
    {
      name: 'Spacing of the cavity modes',
      expr: 'fsr = c/(2*L)', tex: '\\Delta\\nu = \\frac{c}{2L}',
      vars: {
        fsr: { name: 'frequency between modes', q: 'frequency', unit: 'MHz', tex: '\\Delta\\nu' },
        c: { const: 'c' },
        L: { name: 'length of the cavity', q: 'length', unit: 'cm', value: 30 }
      },
      solveFor: 'fsr',
      note: 'The refractive index of the gas is taken as 1.',
      stories: { fsr: 'A helium–neon tube has mirrors {L} apart. How far apart in frequency are its modes?', L: 'A laser\u2019s modes are {fsr} apart. How long is its cavity?' }
    },
    {
      name: 'Coherence length',
      expr: 'lc = c/dnu', tex: 'L_c = \\frac{c}{\\Delta\\nu}',
      vars: {
        lc: { name: 'coherence length', q: 'length', unit: 'm', tex: 'L_c' },
        c: { const: 'c' },
        dnu: { name: 'frequency spread of the light', q: 'frequency', unit: 'MHz', value: 1000, tex: '\\Delta\\nu' }
      },
      solveFor: 'lc',
      note: 'A rough rule: the distance over which the light stays in step with itself. A single mode of 1 MHz gives 300 m; the 1 GHz spread of three modes gives 0.3 m.',
      stories: { lc: 'The light of a laser spreads over {dnu}. What is its coherence length?' }
    },
    {
      name: 'The wavelength in air and in vacuum',
      expr: 'lv = la*n', tex: '\\lambda_{\\mathrm{vac}} = n\\,\\lambda_{\\mathrm{air}}',
      vars: {
        lv: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', tex: '\\lambda_{\\mathrm{vac}}' },
        la: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda_{\\mathrm{air}}' },
        n: { name: 'refractive index of the air', value: 1.000277, min: 1, max: 1.01 }
      },
      solveFor: 'lv',
      note: 'The frequency is the same; the wavelength is shorter in air by the factor n. Catalogue wavelengths are usually the wavelength in air.'
    }
  ],
  examples: [
    {
      title: 'How many modes?',
      q: 'A helium–neon tube has mirrors 30 cm apart and the line is 1.5 GHz wide. Gain at the line centre is 1.8 times the losses. How far apart are the modes, over what frequency range is the gain above the losses, and how many lase?',
      steps: [
        { text: 'The mode spacing is', tex: '\\Delta\\nu = \\frac{c}{2L} = \\frac{3.0\\times10^8}{0.60} = 500\\ \\mathrm{MHz}' },
        { text: 'The gain falls as a Gaussian, $G(\\nu) = 1.8\\,e^{-4\\ln2\\,(\\nu/1.5\\ \\mathrm{GHz})^2}$. It equals the losses (1) at', tex: '\\frac{\\nu}{1.5\\ \\mathrm{GHz}} = \\sqrt{\\frac{\\ln 1.8}{4\\ln 2}} = 0.46 \\quad\\Rightarrow\\quad \\nu = \\pm 0.69\\ \\mathrm{GHz}' },
        'The gain is above the losses over 1.38 GHz, which holds 1.38/0.5 = 2.8 spacings: two or three modes lase, depending on where the comb lies.',
        'The coherence length of the light, with its modes spread over about 1 GHz, is about $c/\\Delta\\nu = 0.3$ m.'
      ],
      a: '500 MHz apart; the gain exceeds the losses over about 1.4 GHz; two or three modes lase; the coherence length is about 30 cm.'
    },
    {
      title: 'Why it must warm up',
      q: 'A borosilicate glass tube 30 cm long expands by 3.3×10⁻⁶ per kelvin. By how many mode spacings does its comb of modes slide for each kelvin of warming? (The modes move by one spacing for each half wavelength of change in length.)',
      steps: [
        { text: 'The length change per kelvin:', tex: '\\Delta L = 0.30\\ \\mathrm{m}\\times 3.3\\times10^{-6} = 0.99\\ \\mu\\mathrm{m}' },
        { text: 'Half a wavelength is $632.8/2 = 316$ nm, so', tex: '\\frac{0.99\\ \\mu\\mathrm{m}}{0.316\\ \\mu\\mathrm{m}} = 3.1\\ \\text{mode spacings per kelvin}' },
        'A tube warming by several kelvin moves modes through the gain curve dozens of times: the output rises and falls, and the polarization of a two-mode laser flips each time a mode crosses. The wobble stops when the temperature settles.'
      ],
      a: 'About three mode spacings for each kelvin, so a warming tube sweeps its modes across the gain curve many times.'
    }
  ],
  quiz: [
    { q: 'Which gas emits the 632.8 nm photon in a helium–neon laser?', choices: ['Neon', 'Helium', 'Both equally', 'Neither: the mirrors emit it'], a: 0, why: 'The transition is between two levels of neon. Helium has two long-lived levels that hold the energy and hand it over to neon in collisions.' },
    { q: 'The bore of a helium–neon tube is made very narrow because…', choices: ['the neon atoms return to the ground state by hitting the wall, and the gain falls as the tube widens', 'a narrow bore lets the mirrors be smaller', 'the gas would escape from a wide tube', 'the beam must be thin'], a: 0, why: 'Neon atoms in the lower levels must be emptied quickly. That happens mostly on the wall; the wider the bore, the longer the wait, and the weaker the inversion.' },
    { q: 'A single-mode helium–neon laser has a longer coherence length than a multimode one.', a: true, why: 'Coherence length is about $c$ divided by the spread of frequencies. One mode has a spread of the order of a megahertz (hundreds of metres); three modes spread over a gigahertz (tens of centimetres).' },
    { q: 'What is the spacing in megahertz of the modes of a 50 cm helium–neon tube?', answer: 300, unit: 'MHz', why: '$c/2L = 3\\times10^8/1.0 = 3\\times10^8$ Hz = 300 MHz. A longer tube has more closely spaced modes, and more of them under the gain curve.' },
    { q: 'Why does the output of a helium–neon laser wobble during the first 15 minutes?', choices: ['The tube warms and lengthens, so the modes slide across the gain curve', 'The helium leaks out', 'The mirrors are cold', 'The beam is searching for the cleanest line'], a: 0, why: 'A fraction of a micrometre of length is enough to move the comb of modes by a spacing. The output follows the gain under the modes, until the temperature settles.' }
  ],
  applications: [
    'Interferometry and optical testing: a long coherence length and a stable wavelength give clean fringes ([[michelson-interferometer]], [[testing-surfaces-with-interferometers]]).',
    'Alignment of machines, pipes, optical benches and telescopes, where a thin red line is a straightedge.',
    'Holography, where the coherence length limits the depth of the scene.',
    'Metrology: frequency-stabilised tubes as length references, and distance-measuring interferometers on machine tools.',
    'Older barcode scanners and ring-laser gyroscopes; the 3.39 µm line for sensing methane.'
  ],
  history: 'The first helium–neon laser, in December 1960 at Bell Laboratories, ran at 1152 nm in the infrared; it was the first gas laser and the first to run continuously. The familiar red line was first made to lase in 1962 (A. D. White and J. D. Rigden). Through the 1970s to the 1990s the helium–neon tube sat in every supermarket scanner, until red diodes replaced it.',
  sources: [
    'A. E. Siegman, *Lasers* — the chapters on gas lasers and on laser oscillation, including Doppler broadening and mode spacing.',
    'W. R. Bennett Jr., *The Physics of Gas Lasers* — the helium–neon laser, its energy transfer and its lines.',
    'A. Javan, W. R. Bennett Jr. and D. R. Herriott, *Physical Review Letters* 6 (1961) 106 — the first helium–neon laser.',
    'BIPM, *Mise en pratique for the definition of the metre* — the recommended radiations, including the iodine-stabilised helium–neon laser.'
  ],
  sim: [{ id: 'lz-hene', params: { view: 'levels' } }, { id: 'lz-hene', params: { view: 'modes' } }]
}
,

/* ================================================================ carbon dioxide and excimer lasers */
{
  id: 'co2-and-excimer-lasers', parent: 'laser-families', title: 'Carbon dioxide and excimer lasers', level: 2,
  short: 'Two molecular gas lasers at opposite ends of the spectrum. The carbon dioxide laser makes infrared at 10.6 µm, from 10 W to tens of kilowatts, and cuts nearly everything that is not bare metal. The excimer laser makes nanosecond pulses of ultraviolet at 193 to 351 nm, whose photons break chemical bonds.',
  keywords: ['CO2 laser', 'carbon dioxide laser', '10.6 micron', 'excimer laser', 'ArF', 'KrF', 'XeCl', 'XeF', '193 nm', '248 nm', 'photoablation', 'lithography laser', 'LASIK', 'ZnSe', 'TEA laser', 'exciplex'],
  prereq: ['gas-lasers', 'photon-energy', 'population-inversion-and-pumping'],
  related: ['laser-families-overview', 'solid-state-lasers', 'uv-and-infrared-materials', 'laser-marking-and-cutting-heads', 'laser-processing-systems', 'photolithography', 'laser-eye-hazards-and-eyewear'],
  body: `
**Carbon dioxide** and **excimer** lasers are both made of molecules. The first gives infrared light at 10.6 µm, from 10 W up to tens of kilowatts, and cuts almost anything that is not bare metal. The second gives nanosecond pulses of ultraviolet at 193 to 351 nm, and its photons carry enough energy to break chemical bonds.

### Carbon dioxide: vibrations, not electrons
The light comes from the **vibrations** of the CO₂ molecule. The upper laser level is the first excited state of its asymmetric stretch, 2349 cm⁻¹ above the ground state; the lower levels are the first states of the symmetric stretch (1388 and 1286 cm⁻¹). The two bands are centred at 10.4 and 9.4 µm, and their strongest lines lie at **10.6 and 9.6 µm**.

The gas is a mixture of CO₂, nitrogen and helium. The discharge excites nitrogen easily, and its first vibrational level (2331 cm⁻¹) lies only 18 cm⁻¹ below the CO₂ upper level, so a collision passes the energy on almost without loss. Helium empties the lower levels and carries the heat to the walls. Because the photon (0.12 eV) carries 41 % of the 0.29 eV stored in the upper level, the limit of efficiency is 41 %; real lasers reach **10 to 20 %**, the best of the gas lasers, and the rest is heat. Sealed tubes and radio-frequency slab lasers give 10 W to several kilowatts, fast-flow lasers up to tens of kilowatts; a TEA (transversely excited atmospheric) laser gives pulses.

### What 10.6 µm does
Water, wood, paper, acrylic, most plastics, glass, leather and skin absorb it within a few to some tens of micrometres, so it cuts and engraves them cleanly. Bare metals reflect more than 95 %, so cutting metal takes kilowatts and an assist gas. Glass absorbs it too, so the lenses are **zinc selenide** (index 2.40), germanium or gallium arsenide, and the beam, being invisible, is aligned with a visible red diode beam.

### Excimer: a molecule that exists only while excited
A rare gas such as argon does not bond with fluorine; excited, it does. The **excimer** ("excited dimer", properly an exciplex: ArF, KrF, XeCl, XeF) is bound only in its excited state. When it emits it falls to a ground state that is repulsive: the atoms fly apart in about a picosecond, so the lower level is always empty and the inversion is automatic.
| Laser | Wavelength | Photon | Used for |
|---|---|---|---|
| ArF | 193 nm | 6.42 eV | chip lithography, eye surgery |
| KrF | 248 nm | 5.00 eV | lithography, polymer micromachining |
| XeCl | 308 nm | 4.03 eV | annealing silicon for displays, skin therapy |
| XeF | 351 nm | 3.53 eV | some micromachining |

The gas is a few per cent of a rare gas and a fraction of a per cent of a halogen donor (F₂ or HCl) in neon or helium at several bar, excited by a fast pulsed discharge: pulses of 10 to 30 ns at up to several kilohertz. A carbon–carbon bond needs 3.6 eV, so the 6.4 eV photon of ArF breaks it directly: the fragments leave as a gas with little heat, and each pulse removes a fraction of a micrometre (about a quarter of a micrometre of cornea), with clean edges. The beam is large, rectangular and highly multimode, which makes it unsuited to a fine focus and well suited to imaging a mask. The halogen is used up, so the gas is renewed; optics are fused silica or CaF₂; and oxygen absorbs 193 nm, so the path is purged with nitrogen.

> [!fact] The newest chip-making machines use light of 13.5 nm, made by a plasma of tin droplets that a carbon dioxide laser of some twenty kilowatts has struck twice. Both ends of this page, in one machine.

> [!warn] The 10.6 µm beam is invisible. A few watts burn skin and set fire to paper, cloth and plastic, and the cornea absorbs it: Class 4, with enclosure, interlocks and eyewear marked for 10.6 µm. Zinc selenide is toxic when ground or broken. Excimer beams are ultraviolet, and the gases (fluorine, hydrogen chloride) are toxic and corrosive: both lasers are for trained users in enclosed systems ([[laser-safety-classes]]).

> [!key] CO₂: vibrational levels pumped through nitrogen; 10.6 µm, efficient, absorbed by most non-metals. Excimer: a molecule that exists only excited, so the ground state is empty; deep-ultraviolet pulses that break bonds.
`,
  ideas: [
    'The carbon dioxide laser works on vibrations of the CO₂ molecule; nitrogen, excited by the discharge, passes its energy to CO₂ in a near-resonant collision, and helium empties the lower levels.',
    'The strongest lines are at 10.6 and 9.6 µm; the efficiency of 10–20 % is the highest of the gas lasers, with a limit of 41 %.',
    '10.6 µm light is absorbed by water, wood, plastics, glass and tissue, and reflected by bare metals; optics are zinc selenide or germanium, not glass.',
    'An excimer molecule exists only while excited; its ground state flies apart, so the lower level is always empty.',
    'Deep-ultraviolet photons (3.5 to 6.4 eV) break chemical bonds directly, so excimer lasers etch polymers, tissue and chips without heating them.'
  ],
  pitfalls: [
    'A CO₂ laser cuts metal as easily as wood — Metals reflect over 95 % of 10.6 µm light. Cutting steel needs kilowatts and oxygen or nitrogen assist; thin metal is now cut with 1 µm fibre lasers, which metals absorb far better.',
    'An excimer laser cuts by burning — The ultraviolet photon breaks bonds directly (photoablation), and the pieces leave as gas. The material around the cut stays cool, which is why the edge is clean.',
    'You can see where a CO₂ laser beam goes — It is infrared and invisible, and the burn, not the beam, shows. That is why a red pilot beam is added, and why the invisible beam is dangerous.'
  ],
  terms: [
    { term: 'Excimer', also: ['exciplex', 'excited dimer', 'rare-gas halide'], def: 'A molecule that is bound only while it is electronically excited (ArF, KrF, XeCl, XeF). Its ground state is unbound, so the lower laser level is always empty.' },
    { term: 'Photoablation', also: ['ablative photodecomposition'], def: 'The removal of material by ultraviolet photons that break its chemical bonds, so that the fragments leave as gas with little heating.' },
    { term: 'TEA laser', also: ['transversely excited atmospheric'], def: 'A carbon dioxide laser with a discharge across the beam, at atmospheric pressure, that gives short, strong pulses.' },
    { term: 'Vibrational level', def: 'An energy level of a molecule that corresponds to a vibration of its atoms (stretching, bending). Spacings of 0.1 to 0.3 eV put them in the infrared.' },
    { term: 'Assist gas', def: 'A jet of oxygen, nitrogen or air at the cut, which burns or blows out the molten material and protects the lens.' }
  ],
  formulas: [
    {
      name: 'Photon energy',
      expr: 'E = h*c/lam', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' }, c: { const: 'c' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 193, tex: '\\lambda' }
      },
      solveFor: 'E',
      note: 'About 1240 eV·nm divided by the wavelength in nanometres.',
      stories: { E: 'What energy does a photon of {lam} light carry?', lam: 'A photon carries {E}. What is its wavelength?' }
    },
    {
      name: 'Limit of efficiency of a vibrational laser',
      expr: 'eta = (kup - klow)/kup', tex: '\\eta = \\frac{k_{\\mathrm{up}} - k_{\\mathrm{low}}}{k_{\\mathrm{up}}}',
      vars: {
        eta: { name: 'the most the laser can convert (photon energy ÷ upper-level energy)', q: 'ratio', unit: '%', tex: '\\eta' },
        kup: { name: 'upper level, as a wave number', q: 'wavenumber', unit: '1/cm', value: 2349, min: 1, tex: 'k_{\\mathrm{up}}' },
        klow: { name: 'lower level, as a wave number', q: 'wavenumber', unit: '1/cm', value: 1388, min: 0, tex: 'k_{\\mathrm{low}}' }
      },
      solveFor: 'eta',
      note: 'Each excitation stored in the upper level yields one photon; what remains in the lower level becomes heat.'
    },
    {
      name: 'Peak power of a pulse',
      expr: 'Ppk = E/tau', tex: 'P_{\\mathrm{peak}} = \\frac{E}{\\tau}',
      vars: {
        Ppk: { name: 'peak power', q: 'power', unit: 'MW', tex: 'P_{\\mathrm{peak}}' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'mJ', value: 10 },
        tau: { name: 'duration of the pulse', q: 'time', unit: 'ns', value: 20, tex: '\\tau' }
      },
      solveFor: 'Ppk',
      note: 'Taking the pulse as a flat-topped one; a pulse with a peak has a peak a little higher.'
    },
    {
      name: 'Fluence on the target',
      expr: 'F = 4*E/(pi*d^2)', tex: 'F = \\frac{4E}{\\pi d^2}',
      vars: {
        F: { name: 'energy per unit area of the spot', q: 'fluence', unit: 'mJ/cm²' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'mJ', value: 1 },
        d: { name: 'diameter of the spot', q: 'length', unit: 'mm', value: 0.9 }
      },
      solveFor: 'F',
      note: 'For a uniform spot. Photoablation of tissue and polymers starts above a threshold of tens of mJ/cm² and works best at a few hundred.',
      stories: { F: 'A pulse of {E} is spread evenly over a spot {d} across. What is the fluence?' }
    }
  ],
  examples: [
    {
      title: 'What a photon can do',
      q: 'The four excimer lasers give photons of 6.42, 5.00, 4.03 and 3.53 eV. A carbon–carbon bond needs 3.6 eV, a carbon–nitrogen bond 3.2 eV. Which lasers can break which bond with a single photon?',
      steps: [
        'Carbon–carbon (3.6 eV): the ArF, KrF and XeCl photons exceed it. The XeF photon, at 3.53 eV, falls just short.',
        'Carbon–nitrogen (3.2 eV): all four exceed it, XeF by 0.3 eV.',
        'A photon that cannot break a bond can still heat the material, by being absorbed and turning into vibration: that is how XeF is used, with slower, hotter results than ArF or KrF.'
      ],
      a: 'ArF, KrF and XeCl break carbon–carbon bonds directly; all four break carbon–nitrogen bonds. 351 nm is just short of the carbon–carbon bond.'
    },
    {
      title: 'A lithography pulse',
      q: 'An ArF laser for chip making gives pulses of 10 mJ, each 20 ns long, 6000 times per second. What are its peak power and its average power?',
      steps: [
        { text: 'The peak power of one pulse:', tex: 'P_{\\mathrm{peak}} = \\frac{10\\times10^{-3}\\ \\mathrm{J}}{20\\times10^{-9}\\ \\mathrm{s}} = 5\\times10^5\\ \\mathrm{W} = 0.5\\ \\mathrm{MW}' },
        { text: 'The average power is the pulse energy times the repetition rate:', tex: '\\bar P = 10\\ \\mathrm{mJ} \\times 6000\\ \\mathrm{s^{-1}} = 60\\ \\mathrm{W}' },
        'The beam is on for only 0.012 % of the time (6000 × 20 ns): half a megawatt for a hundred-thousandth of a second, but only 60 W to cool.'
      ],
      a: 'A peak power of 0.5 MW, and an average power of 60 W.'
    }
  ],
  quiz: [
    { q: 'Which of these absorbs 10.6 µm light best?', choices: ['Acrylic sheet', 'Polished copper', 'A zinc selenide window', 'A germanium window'], a: 0, why: 'Acrylic absorbs 10.6 µm within micrometres, so a CO₂ laser cuts it. Polished copper reflects it, and zinc selenide and germanium are chosen as window and lens materials precisely because they transmit it.' },
    { q: 'What is the largest share of the energy in the CO₂ upper level (2349 cm⁻¹) that can leave as a 10.4 µm photon (961 cm⁻¹)? Give it in per cent.', answer: 41, unit: '%', why: '$961/2349 = 0.41$. The remaining 59 % stays in the molecule as vibration and ends up as heat.' },
    { q: 'An excimer molecule lives for a long time in its ground state.', a: false, why: 'It has no stable ground state: ArF, for instance, falls apart into argon and fluorine within about a picosecond of emitting. That is what keeps the lower level empty.' },
    { q: 'A pulse of 20 mJ lasts 25 ns. What is its peak power, in megawatts?', answer: 0.8, unit: 'MW', why: '$20\\times10^{-3}/25\\times10^{-9} = 8\\times10^5$ W = 0.8 MW.' },
    { q: 'Why is the beam path of a 193 nm laser purged with nitrogen?', choices: ['Oxygen absorbs 193 nm light (and makes ozone)', 'Nitrogen cools the beam', 'Air bends the beam too much', 'The laser needs the nitrogen as a lasing gas'], a: 0, why: 'Oxygen absorbs light below about 195 nm, and makes ozone as it does. A nitrogen purge keeps the beam strong and the optics clean.' }
  ],
  applications: [
    'Cutting and engraving acrylic, wood, paper, leather, textiles and rubber; welding of plastics; marking glass and ceramics.',
    'Soft-tissue surgery and skin resurfacing, where the water in tissue absorbs 10.6 µm in tens of micrometres.',
    'Chip lithography with 193 nm (and earlier 248 nm) light; the carbon dioxide laser as the driver of the 13.5 nm source.',
    'Laser eye surgery with 193 nm; annealing of silicon for display panels with 308 nm; skin therapy.',
    'Drilling the nozzles of inkjet heads and micromachining of polymers with 248 nm.'
  ],
  history: 'Kumar Patel at Bell Laboratories made the carbon dioxide laser work in 1964, and within a few years it was the most powerful continuous laser in existence. The first excimer laser, from a dimer of xenon, was made in Moscow in 1970 (Nikolay Basov and colleagues); the rare-gas halide versions followed in 1975. In 1982 Rangaswamy Srinivasan and colleagues at IBM showed that 193 nm pulses etch plastic with clean edges; the application to the cornea followed within a year.',
  sources: [
    'W. J. Witteman, *The CO₂ Laser* (Springer, 1987) — the molecule, the discharge and the engineering.',
    'C. K. Rhodes (ed.), *Excimer Lasers* (Springer, Topics in Applied Physics 30) — the rare-gas halides and their kinetics.',
    'C. K. N. Patel, "Continuous-wave laser action on vibrational-rotational transitions of CO₂", *Physical Review* 136 (1964) A1187.',
    'R. Srinivasan and V. Mayne-Banton, *Applied Physics Letters* 41 (1982) 576 — ablative photodecomposition by far-ultraviolet excimer light.'
  ],
  sim: [{ id: 'lz-molecular', params: { view: 'co2' } }, { id: 'lz-molecular', params: { view: 'excimer' } }]
},

/* ================================================================ solid-state lasers */
{
  id: 'solid-state-lasers', parent: 'laser-families', title: 'Solid-state lasers', level: 2,
  short: 'A solid-state laser has a crystal or glass doped with a few per cent of light-emitting ions: chromium in ruby, neodymium in YAG, titanium in sapphire. The ions store energy for microseconds to milliseconds, which makes strong pulses; a broad gain makes the shortest pulses in the world. Laser diodes have replaced lamps as the pump.',
  keywords: ['solid-state laser', 'ruby laser', 'Nd:YAG', 'Nd:YVO4', 'titanium sapphire', 'Ti:sapphire', 'Yb:YAG', 'Er:YAG', 'alexandrite', 'DPSS', 'diode-pumped', 'flash lamp', 'thin disk', 'quantum defect', 'thermal lens', 'gain bandwidth', 'ultrafast'],
  prereq: ['laser-families-overview', 'population-inversion-and-pumping', 'q-switching-and-mode-locking'],
  related: ['diode-lasers', 'fibre-lasers', 'frequency-doubling-and-nonlinear-optics', 'optical-crystals', 'thermal-effects-in-optics', 'continuous-and-pulsed-lasers', 'laser-eye-hazards-and-eyewear'],
  body: `
A solid-state laser starts with a transparent crystal or glass and dopes it with a few per cent of ions that radiate: chromium in sapphire (ruby), neodymium in yttrium aluminium garnet (**Nd:YAG**), titanium in sapphire. The ions give the light; the host holds them still, carries the heat away and passes the light. Their great virtue is that the ions **keep their energy** for microseconds to milliseconds, so the medium is a store, and a store gives short strong pulses.

### Host and ion
The crystal field shifts the ion's levels a little, so the lines are narrow in YAG and broad in sapphire or glass.
| Medium | Wavelength | Gain width | Upper-level life | Pumped by | Used for |
|---|---|---|---|---|---|
| Ruby (Cr³⁺) | 694.3 nm | 0.5 nm | 3 ms | flash lamp | the first laser, 1960; tattoo removal |
| Nd:YAG | 1064 nm | 0.45 nm | 230 µs | diode 808 nm, or lamp | marking, welding, rangefinding |
| Nd:YVO₄ | 1064 nm | about 1 nm | about 100 µs | diode | green pointers (doubled), micromachining |
| Nd:glass | 1054 nm | 20 nm | 0.3 ms | flash lamp | fusion research: megajoules |
| Yb:YAG | 1030 nm | 9 nm | 1 ms | diode 940 nm | thin-disk lasers of kilowatts |
| Ti:sapphire | 650–1100 nm | 230 nm | 3 µs | green laser | ultrafast science, tunable |
| Er:YAG | 2940 nm | narrow | pulsed | lamp or diode | dentistry, skin (water absorbs it) |

### Lamps and diodes
A flash lamp or arc lamp radiates a continuum from the ultraviolet to the infrared; Nd:YAG absorbs only in narrow bands, the strongest near 808 nm. Most of the lamp's light heats the rod, and 1–3 % of the electricity comes out as laser light. A diode bar at 808 nm delivers all its light into the band, so 10–30 % comes out, in a machine a tenth the size and a lifetime of ten thousand hours. The bar's wavelength moves 0.28 nm per kelvin, so it is held at a set temperature ([[diode-lasers]]; the second simulation).

The **quantum defect** limits what is possible: a pump photon of 808 nm gives a laser photon of 1064 nm, and the energy ratio, 76 %, is the most the laser can convert. The remaining 24 % warms the crystal. Pumping at 888 nm raises it to 83 %.

### Three levels and four
Ruby is a **three-level** laser: its lower level is the ground state, so more than half of the ions must be lifted before there is any gain, and it needs a flash. Nd:YAG is a **four-level** laser: its lower level is empty, any ion in the upper level is an inversion, and it works with a weak pump, continuously ([[population-inversion-and-pumping]]).

### Stored energy and broad gain
Long upper-level lives allow **Q-switching**: store the pump energy, then release it in nanoseconds ([[q-switching-and-mode-locking]]). 100 mJ in 10 ns is 10 MW. A broad gain allows mode-locking: pulses can be no shorter than about $0.44/\\Delta\\nu$, so Ti:sapphire (230 nm of gain) makes pulses of 5 to 100 fs, and chirped-pulse amplification of such pulses has reached petawatts. At the other extreme, 192 beams of Nd:glass, tripled to 351 nm, deliver about 2 MJ in a few nanoseconds to a fusion target.

### Heat sets the limit
The heat of the quantum defect makes the rod hotter at its centre: a **thermal lens**, and stress that changes the polarization. The beam quality falls as the power rises. Slabs, thin discs (Yb:YAG, 0.1–0.2 mm thick, cooled through the back) and fibres ([[fibre-lasers]]) are ways of removing the heat before it matters.

> [!warn] The 1.0–1.07 µm lines are invisible and focused onto the retina; 2.94 µm is absorbed by the cornea. Pulsed beams of millijoules are already Class 4, and a Q-switched beam can damage the eye from a diffuse reflection. See [[laser-eye-hazards-and-eyewear]].

> [!key] Doped crystals store energy and make pulses: narrow lines for Q-switching, broad lines for ultrashort pulses. Diodes tuned to the absorption band pump them far better than lamps; the quantum defect and the heat it makes set the limits.
`,
  ideas: [
    'The active ions give the light; the host crystal or glass holds them, carries the heat and sets how broad the line is.',
    'Long upper-level lifetimes (0.2–3 ms) let the medium store energy for Q-switched pulses; broad gain (Ti:sapphire, 230 nm) allows pulses of a few femtoseconds.',
    'Diode pumping at the absorption band (808 nm for Nd) wastes little: 10–30 % overall against 1–3 % with lamps.',
    'The quantum defect, the ratio of pump to laser wavelength (76 % for 808 → 1064 nm), is the limit of efficiency and the source of heat.',
    'Heat in the crystal makes a thermal lens that spoils the beam; slabs, thin discs and fibres spread the heat out.'
  ],
  pitfalls: [
    'The host crystal makes the light — The dopant ions radiate. YAG itself is a colourless crystal; add neodymium and it lases at 1064 nm, add erbium and it lases at 2.94 µm.',
    'More pump power always means more output — Until the heat makes a thermal lens that spoils the beam, or cracks the rod. High-power designs are mostly cooling designs.',
    'A solid-state laser is a pulsed laser — They can run continuously (Nd:YAG, Yb:YAG, Ti:sapphire). Their special strength is storing energy for pulses.'
  ],
  terms: [
    { term: 'Dopant', also: ['active ion', 'doping ion'], def: 'The ion added to the host crystal or glass in small amount (a few per cent or less) that provides the energy levels of the laser: Nd³⁺, Yb³⁺, Er³⁺, Cr³⁺, Ti³⁺.' },
    { term: 'Nd:YAG', also: ['neodymium YAG', 'YAG laser'], def: 'A crystal of yttrium aluminium garnet (Y₃Al₅O₁₂) in which about 1 % of the yttrium ions are replaced by neodymium. It lases at 1064 nm and is the most widespread solid-state laser medium.' },
    { term: 'Titanium–sapphire laser', also: ['Ti:sapphire', 'Ti:Al₂O₃'], def: 'A laser whose medium is sapphire doped with titanium: gain from 650 to 1100 nm, so it is tunable and makes the shortest pulses of any laser, pumped by a green laser.' },
    { term: 'Thin-disk laser', def: 'A solid-state laser whose crystal is a disc only a fraction of a millimetre thick, cooled through its back face, so that the heat flows along the beam and the thermal lens stays small.' },
  ],
  formulas: [
    {
      name: 'Width of the gain in frequency',
      expr: 'dnu = c*dlam/lam^2', tex: '\\Delta\\nu = \\frac{c\\,\\Delta\\lambda}{\\lambda^2}',
      vars: {
        dnu: { name: 'gain bandwidth in frequency', q: 'frequency', unit: 'THz', tex: '\\Delta\\nu' },
        c: { const: 'c' },
        dlam: { name: 'gain bandwidth in wavelength (FWHM)', q: 'length', unit: 'nm', value: 230, tex: '\\Delta\\lambda' },
        lam: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 795, tex: '\\lambda' }
      },
      solveFor: 'dnu',
      note: 'For Ti:sapphire: 230 nm at 795 nm is 109 THz.',
      stories: { dnu: 'A gain medium is {dlam} wide around {lam}. How wide is it in frequency?' }
    },
    {
      name: 'Shortest pulse from a gain bandwidth',
      expr: 'dt = 0.441/dnu', tex: '\\Delta t \\ge \\frac{0.441}{\\Delta\\nu}',
      vars: {
        dt: { name: 'shortest pulse duration (FWHM)', q: 'time', unit: 'fs', tex: '\\Delta t' },
        dnu: { name: 'bandwidth of the light', q: 'frequency', unit: 'THz', value: 109, min: 0.001, tex: '\\Delta\\nu' }
      },
      solveFor: 'dt',
      note: 'For a Gaussian pulse; a sech² pulse has 0.315. Real lasers use only part of the gain, so their pulses are longer.'
    },
    {
      name: 'Quantum-defect limit of efficiency',
      expr: 'eta = lp/ls', tex: '\\eta = \\frac{\\lambda_p}{\\lambda_s}',
      vars: {
        eta: { name: 'most the laser can convert of the absorbed pump', q: 'ratio', unit: '%', tex: '\\eta' },
        lp: { name: 'pump wavelength', q: 'length', unit: 'nm', value: 808, tex: '\\lambda_p' },
        ls: { name: 'laser wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda_s' }
      },
      solveFor: 'eta',
      note: 'The energy of a photon is inversely proportional to its wavelength, so the ratio of energies is the inverse ratio of wavelengths.',
      stories: { eta: 'A crystal is pumped at {lp} and lases at {ls}. What is the most it can convert, by the quantum defect alone?' }
    },
    {
      name: 'Peak power of a pulse',
      expr: 'Ppk = E/tau', tex: 'P_{\\mathrm{peak}} = \\frac{E}{\\tau}',
      vars: {
        Ppk: { name: 'peak power', q: 'power', unit: 'MW', tex: 'P_{\\mathrm{peak}}' },
        E: { name: 'energy of the pulse', q: 'energy', unit: 'mJ', value: 100 },
        tau: { name: 'duration of the pulse', q: 'time', unit: 'ns', value: 10, tex: '\\tau' }
      },
      solveFor: 'Ppk',
      note: 'The same energy in a shorter pulse is a higher peak power.'
    }
  ],
  examples: [
    {
      title: 'Where the heat comes from',
      q: 'A Nd:YAG rod absorbs 100 W of pump light. How much heat does the quantum defect put into it when it is pumped at 808 nm, and when it is pumped at 888 nm, close to the laser wavelength of 1064 nm?',
      steps: [
        { text: 'The most that can leave as laser light at 808 nm:', tex: '\\eta = \\frac{808}{1064} = 0.76 \\quad\\Rightarrow\\quad \\text{heat} \\ge (1 - 0.76)\\times 100\\ \\mathrm{W} = 24\\ \\mathrm{W}' },
        { text: 'At 888 nm:', tex: '\\eta = \\frac{888}{1064} = 0.83 \\quad\\Rightarrow\\quad \\text{heat} \\ge 17\\ \\mathrm{W}' },
        'Other losses (the pump light that is not converted) add to it. Pumping near 880–888 nm, directly into the upper level, cuts the minimum heat by about a third, which is why high-power Nd lasers have moved there, at the price of weaker absorption.'
      ],
      a: 'At least 24 W at 808 nm and 17 W at 888 nm, in a rod a few millimetres across.'
    },
    {
      title: 'Same energy, different pulse',
      q: 'A Q-switched Nd:YAG laser gives 100 mJ in 10 ns. A mode-locked Ti:sapphire amplifier gives 1 mJ in 30 fs. What are their peak powers?',
      steps: [
        { text: 'Nd:YAG:', tex: 'P = \\frac{0.1\\ \\mathrm{J}}{10^{-8}\\ \\mathrm{s}} = 10^{7}\\ \\mathrm{W} = 10\\ \\mathrm{MW}' },
        { text: 'Ti:sapphire:', tex: 'P = \\frac{10^{-3}\\ \\mathrm{J}}{3\\times10^{-14}\\ \\mathrm{s}} = 3.3\\times10^{10}\\ \\mathrm{W} = 33\\ \\mathrm{GW}' },
        'The Ti:sapphire pulse has a hundredth of the energy and over three thousand times the peak power, because it is 330 000 times shorter.'
      ],
      a: '10 MW for the Nd:YAG pulse and 33 GW for the Ti:sapphire pulse.'
    }
  ],
  quiz: [
    { q: 'Which medium can make the shortest pulses?', choices: ['Ti:sapphire, with 230 nm of gain', 'Nd:YAG, with 0.45 nm of gain', 'Ruby, with 0.5 nm of gain', 'They are all the same'], a: 0, why: 'The shortest pulse is about $0.44/\\Delta\\nu$. 230 nm of gain is 109 THz and allows about 4 fs; 0.45 nm is 120 GHz and allows a few picoseconds.' },
    { q: 'A crystal is pumped at 880 nm and lases at 1064 nm. What is the most it can convert of the pump energy, in per cent?', answer: 82.7, unit: '%', why: '$880/1064 = 0.827$. The remaining 17 % is the quantum defect, heat in the crystal.' },
    { q: 'A flash lamp pumps Nd:YAG more efficiently than a diode bar tuned to 808 nm.', a: false, why: 'The lamp\u2019s light is spread over a continuum and Nd:YAG absorbs only narrow bands, so most of it only heats the rod. A diode bar at 808 nm puts nearly all its light into the strongest band.' },
    { q: 'Why can a Nd:YAG laser be Q-switched but a diode laser cannot store energy for a pulse in the same way?', choices: ['The upper level of Nd lives 230 µs; in a diode the carriers last only nanoseconds', 'Diodes have no mirrors', 'Nd:YAG is brighter', 'Diodes are too small'], a: 0, why: 'Q-switching needs a medium that keeps its inversion for the time a pulse takes to build up. Neodymium ions do for hundreds of microseconds; carriers in a semiconductor recombine in nanoseconds.' },
    { q: 'A pulse of 100 mJ lasts 10 ns. What is its peak power, in megawatts?', answer: 10, unit: 'MW', why: '$0.1\\ \\mathrm{J}/10^{-8}\\ \\mathrm{s} = 10^7$ W = 10 MW.' }
  ],
  applications: [
    'Industrial marking, engraving and micromachining with nanosecond Nd:YVO₄ and Nd:YAG lasers, often doubled or tripled.',
    'Thin-disk and rod lasers of kilowatts for welding and cutting; Nd:YAG laser rangefinders and designators.',
    'Ultrafast science, multiphoton microscopy and micromachining with Ti:sapphire and Yb:YAG lasers.',
    'Medicine: Er:YAG for dentistry and skin, Nd:YAG and alexandrite for hair and tattoo removal, ruby historically.',
    'Fusion research and gravitational-wave detectors: the largest and the quietest lasers are solid-state.'
  ],
  history: 'Theodore Maiman made the first laser, a ruby, at Hughes Research Laboratories on 16 May 1960. Nd:YAG followed in 1964 (Geusic, Marcos and Van Uitert at Bell Laboratories), and the four-level scheme made continuous operation possible. Peter Moulton demonstrated titanium–sapphire at MIT Lincoln Laboratory in 1982; Donna Strickland and Gérard Mourou invented chirped-pulse amplification in 1985, for which they shared the 2018 Nobel Prize in Physics.',
  sources: [
    'W. Koechner, *Solid-State Laser Engineering* (Springer) — hosts, ions, pumping, thermal effects and Q-switching.',
    'O. Svelto, *Principles of Lasers* — the chapter on solid-state lasers.',
    'P. F. Moulton, "Spectroscopic and laser characteristics of Ti:Al₂O₃", *Journal of the Optical Society of America B* 3 (1986) 125.',
    'T. H. Maiman, "Stimulated optical radiation in ruby", *Nature* 187 (1960) 493.'
  ],
  sim: [{ id: 'lz-gain' }, { id: 'lz-tuning', params: { pump: true } }]
},

/* ================================================================ diode lasers */
{
  id: 'diode-lasers', parent: 'laser-families', title: 'Diode lasers', level: 2,
  short: 'A diode laser is a light-emitting diode with mirrors: current across a p–n junction makes light in a layer a few nanometres thick, and the polished ends of the chip form the cavity. It is the smallest, cheapest and most efficient laser, found in nearly every device that has one; its beam, elliptical and astigmatic, is the difficulty.',
  keywords: ['laser diode', 'diode laser', 'semiconductor laser', 'band gap', 'quantum well', 'edge emitter', 'fast axis', 'slow axis', 'astigmatism', 'mode hop', 'DFB', 'threshold current', 'slope efficiency', 'constant current driver', 'ESD', 'laser bar', 'broad area'],
  prereq: ['laser-families-overview', 'light-emitting-diodes', 'the-laser-cavity'],
  related: ['vcsels-and-laser-arrays', 'collimating-a-laser-diode', 'gaussian-beams-through-lenses', 'beam-quality-m-squared', 'solid-state-lasers', 'fibre-lasers', 'laser-safety-classes', 'electronics:optoelectronics', 'physics:semiconductors'],
  body: `
A diode laser is a light-emitting diode with mirrors. Current pushed across a p–n junction brings electrons and holes together in a layer a few nanometres thick, where they recombine and give out photons; the polished ends of the chip, 0.3 to 2 mm apart, form a cavity, and light running between them is amplified ([[light-emitting-diodes]]). It is the smallest laser (the chip is the size of a grain of salt), the most efficient and the cheapest, and the one inside almost every device with a laser.

### The chip
Layers of semiconductor of different composition are grown on a wafer: a thin **active layer** (a quantum well 5–10 nm thick) between layers of wider gap that confine the carriers and guide the light. A contact stripe 2–4 µm wide (single-mode) or 50–200 µm (broad-area) fixes where the light is made. The ends are cleaved crystal faces: a semiconductor of index 3.5 reflects 31 % with no coating at all, enough for the high gain; high-power chips coat the back above 95 % and the front to 5–10 %. The emitting spot is about 1 µm by 3 µm.

### The band gap sets the colour
A photon is made when an electron falls across the gap $E_g$, so $\\lambda = hc/E_g \\approx 1.24\\ \\mu\\mathrm{m}/E_g(\\mathrm{eV})$. The alloy is chosen to set the gap:
| Material | Wavelengths | Used for |
|---|---|---|
| InGaN | 375–530 nm | Blu-ray (405), projectors (450), green (520) |
| AlGaInP | 630–690 nm | pointers, barcode scanners, DVD (650) |
| AlGaAs | 750–870 nm | CD (780), pumping Nd lasers (808) |
| InGaAs | 910–1100 nm | pumping fibre lasers (976) |
| InGaAsP on InP | 1.3–1.65 µm | fibre links (1310, 1550) |

**Quantum cascade lasers** are not diodes: electrons step down a staircase of wells and each makes a photon at every step, which reaches 4 to 12 µm.

### Power and efficiency
A single-mode diode gives 5 to 500 mW; a broad-area emitter 5 to 25 W; a centimetre-wide **bar** of dozens of emitters 100 to 300 W; stacks of bars kilowatts. Above a **threshold current** of 10–50 mA the power rises with a **slope efficiency** of 0.3 to 1.2 W per ampere, $\\eta_d\\,hc/(q\\lambda)$, and 40–65 % of the electricity becomes light.

### The beam
The spot is so small that the beam spreads fast, and unequally: the narrow direction (the **fast axis**) by 30–40° (FWHM), the wide one (the **slow axis**) by 6–12°, so the beam is an ellipse of about 3:1 that no circular lens makes round. The slow axis also seems to start inside the chip: **astigmatism**. A short-focus aspheric lens collimates it; an anamorphic prism pair or cylinder lenses make it round ([[collimating-a-laser-diode]]).

### Temperature and wavelength
The gain peak moves about 0.3 nm per kelvin and the cavity modes five times more slowly, so the laser creeps along with a mode and **hops** to the next: a staircase (first simulation below). A grating in the chip (a **DFB** or DBR diode) or outside it gives one stable mode and a linewidth of megahertz. A thermoelectric cooler holds the temperature.

### Driving and protecting
A diode is driven by a constant **current**, never a voltage: the light rises steeply above threshold, and a few per cent too much current exceeds the rating. Start slowly, limit the current below the maximum, and stop static discharges, which kill chips instantly (keep the leads shorted in storage). A diode tolerates only a couple of volts in reverse, and light fed back from a surface can make it unstable. Optical damage to the facet comes at megawatts per square centimetre: 1 W from a 1 µm × 100 µm aperture is 1 MW/cm².

> [!warn] Many diode lasers are infrared (808, 940, 976 nm) and invisible; a watt-class bare diode is Class 3B or 4. Cheap pointers sold as "Class 2" are often much stronger than their label: never aim at anyone, or at aircraft or vehicles. See [[laser-safety-classes]].

> [!key] A diode laser is an LED between mirrors: the band gap sets the colour, the current sets the power, the tiny emitter makes an elliptical diverging beam, and temperature moves the wavelength in a staircase. It needs a current driver, never a voltage source.
`,
  ideas: [
    'A laser diode is a light-emitting diode with mirrors: its facets reflect 31 %, enough for the high gain of the thin active layer.',
    'The band gap sets the wavelength: λ ≈ 1.24 µm divided by the gap in electronvolts; the alloy chosen gives 375 nm to 1.65 µm.',
    'The emitting spot (about 1 × 3 µm) makes an elliptical beam: 30–40° fast axis, 6–12° slow axis, and astigmatism.',
    'The gain peak shifts 0.3 nm/K and the cavity modes 0.06 nm/K, so a Fabry–Perot diode drifts and hops; a DFB diode drifts smoothly.',
    'A diode needs a constant-current driver and protection against static, reverse voltage and back-reflection.'
  ],
  pitfalls: [
    'A laser diode is just a brighter LED — Above threshold stimulated emission takes over: the light is narrow in wavelength, directional and coherent, and rises steeply with current. Below threshold it is only an LED.',
    'A laser diode can be run from a battery through a resistor like an LED — Its light is very steep in current and falls as it warms, so a battery and resistor can drift above the rated power. Use a constant-current driver with a current limit.',
    'The beam of a diode laser is round, like that of a helium–neon laser — It is an ellipse, three times taller than wide in the far field, and its two axes seem to come from different points.'
  ],
  terms: [
    { term: 'Threshold current', also: ['I_th'], def: 'The current at which the gain just equals the losses and the diode starts to lase; below it the diode is only an LED.' },
    { term: 'Slope efficiency', also: ['differential efficiency'], def: 'The rise in output power per unit rise in current above threshold, in watts per ampere: 0.3–1.2 W/A in a good diode.' },
    { term: 'Astigmatism of a diode', also: ['astigmatic distance'], def: 'The offset between the apparent starting points of the fast-axis and slow-axis beams, a few to tens of micrometres.' },
    { term: 'Mode hop', def: 'A sudden jump of a laser\u2019s wavelength to the next longitudinal mode as the temperature or current changes.' },
    { term: 'DFB laser', also: ['distributed feedback laser'], def: 'A diode laser with a grating along its active layer that selects a single longitudinal mode: a stable wavelength and a narrow linewidth.' }
  ],
  formulas: [
    {
      name: 'Wavelength from the band gap',
      expr: 'lam = h*c/Eg', tex: '\\lambda = \\frac{hc}{E_g}',
      vars: {
        lam: { name: 'wavelength of the emitted light', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 1.42, tex: 'E_g' }
      },
      solveFor: 'lam',
      note: 'The gap of GaAs, 1.42 eV, gives 873 nm; adding aluminium widens it, adding indium narrows it.',
      stories: { lam: 'A semiconductor has a band gap of {Eg}. At what wavelength does it emit?', Eg: 'A diode laser emits at {lam}. What band gap must its active layer have?' }
    },
    {
      name: 'Output power above threshold',
      expr: 'P = eta*h*c/(qe*lam)*(I - Ith)', tex: 'P = \\eta_d\\,\\frac{hc}{q\\lambda}\\,(I - I_{\\mathrm{th}})',
      vars: {
        P: { name: 'light output', q: 'power', unit: 'W' },
        eta: { name: 'differential quantum efficiency (photons out per electron)', q: 'ratio', unit: '%', value: 70, min: 1, max: 100, tex: '\\eta_d' },
        h: { const: 'h' }, c: { const: 'c' }, qe: { const: 'qe', tex: 'q' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 808, tex: '\\lambda' },
        I: { name: 'drive current', q: 'current', unit: 'A', value: 1.2 },
        Ith: { name: 'threshold current', q: 'current', unit: 'A', value: 0.25, tex: 'I_{\\mathrm{th}}' }
      },
      solveFor: 'P',
      note: 'Valid above threshold and below the thermal roll-over. hc/(qλ) is the photon energy in volts: 1.53 V at 808 nm, so the slope efficiency here is 1.07 W/A.',
      stories: { P: 'A diode at {lam} with a differential efficiency of {eta} and a threshold of {Ith} is driven with {I}. How much light does it give?' }
    },
    {
      name: 'Drift with temperature',
      expr: 'lam = lam0 + k*dT', tex: '\\lambda = \\lambda_0 + k\\,\\Delta T',
      vars: {
        lam: { name: 'wavelength now', q: false, unit: 'nm', tex: '\\lambda' },
        lam0: { name: 'wavelength at the reference temperature', q: false, unit: 'nm', value: 805, tex: '\\lambda_0' },
        k: { name: 'rate of drift', q: false, unit: 'nm/K', value: 0.28, min: 0, max: 1 },
        dT: { name: 'change of temperature', q: false, unit: 'K', value: 13, signed: true, tex: '\\Delta T' }
      },
      solveFor: 'lam',
      note: 'Average drift of the gain peak of a Fabry–Perot diode: 0.2–0.35 nm/K. A DFB diode drifts 0.06–0.1 nm/K.',
      stories: { dT: 'A pump diode emits at {lam0} at 25 °C and drifts {k}. By how much must it be warmed to emit at {lam}?' }
    },
    {
      name: 'Intensity at the facet',
      expr: 'I = P/(a*b)', tex: 'I = \\frac{P}{a\\,b}',
      vars: {
        I: { name: 'intensity at the emitting facet', q: 'intensity', unit: 'W/cm²' },
        P: { name: 'light output', q: 'power', unit: 'W', value: 1 },
        a: { name: 'height of the emitter', q: 'length', unit: 'µm', value: 1 },
        b: { name: 'width of the emitter', q: 'length', unit: 'µm', value: 100 }
      },
      solveFor: 'I',
      note: 'Facets are damaged when the intensity reaches some megawatts per square centimetre: it is the reason broad-area emitters are 100 µm wide.'
    }
  ],
  examples: [
    {
      title: 'The slope efficiency of a pump diode',
      q: 'An 808 nm diode has a differential efficiency of 70 % and a threshold of 0.25 A. How much light does it give at 1.2 A, and what is its slope efficiency in watts per ampere?',
      steps: [
        { text: 'A photon of 808 nm carries 1.53 eV, so each electron that makes a photon yields 1.53 V of "light voltage":', tex: '\\frac{hc}{q\\lambda} = \\frac{1239.8}{808} = 1.53\\ \\mathrm{V}' },
        { text: 'The slope efficiency is the differential efficiency times this:', tex: 'S = 0.70 \\times 1.53 = 1.07\\ \\mathrm{W/A}' },
        { text: 'The output at 1.2 A:', tex: 'P = 1.07\\ \\mathrm{W/A} \\times (1.2 - 0.25)\\ \\mathrm{A} = 1.02\\ \\mathrm{W}' }
      ],
      a: 'The slope efficiency is 1.07 W/A, and the output at 1.2 A is about 1.0 W.'
    },
    {
      title: 'Where to set the temperature',
      q: 'A pump bar emits at 805 nm when it is at 25 °C and drifts by 0.28 nm/K. The absorption line of Nd:YAG is at 808.6 nm. At what temperature must the bar be held?',
      steps: [
        { text: 'The wavelength must rise by 3.6 nm:', tex: '\\Delta T = \\frac{808.6 - 805}{0.28} = 12.9\\ \\mathrm{K}' },
        'So the temperature is 25 + 12.9 = 37.9 °C. A thermoelectric cooler holds it there to within a degree; a degree off moves the emission by 0.28 nm, and with a line 1.5 nm wide that costs a visible share of the absorbed pump.'
      ],
      a: 'About 38 °C.'
    }
  ],
  quiz: [
    { q: 'A semiconductor has a band gap of 1.55 eV. At about what wavelength does it emit?', answer: 800, unit: 'nm', why: '$\\lambda = 1239.8\\ \\mathrm{eV\\,nm}/1.55\\ \\mathrm{eV} = 800$ nm. A wider gap gives a shorter wavelength.' },
    { q: 'Why is the beam of a diode laser an ellipse?', choices: ['The emitter is about 1 µm high and 3 µm wide; the smaller dimension diverges more', 'The mirrors are curved', 'The chip is rectangular', 'The beam is polarized'], a: 0, why: 'Diffraction spreads a beam in inverse proportion to the size of its source. The thin direction (the fast axis) spreads 30–40°, the wider one only 6–12°.' },
    { q: 'A diode laser may be powered by a constant-voltage supply.', a: false, why: 'Near threshold the light is a steep function of current and the voltage across the junction barely changes, so a small change in voltage or temperature gives a large change in current and may exceed the rating. Use a constant-current driver.' },
    { q: 'A Fabry–Perot diode warms by 10 K. Roughly how far does its gain peak move, if the drift is 0.27 nm/K? Give the answer in nanometres.', answer: 2.7, unit: 'nm', why: '$0.27 \\times 10 = 2.7$ nm. The lasing mode, drifting at 0.06 nm/K, moves 0.6 nm in the same time and hops several times to follow.' },
    { q: 'Which diode will drift smoothly with temperature, with no mode hops?', choices: ['A DFB diode, with a grating in the chip', 'A Fabry–Perot diode', 'A diode bar', 'Any diode, if it is cold enough'], a: 0, why: 'A grating along the active layer selects a single mode, which then moves only with the optical length of the chip, 0.06–0.1 nm/K, with no jumps.' }
  ],
  applications: [
    'Optical discs, barcode scanners, laser printers and pointers: single-mode diodes of milliwatts.',
    'Fibre-optic links: DFB diodes at 1310 and 1550 nm, modulated at gigahertz.',
    'Pumping solid-state and fibre lasers with bars and stacks at 808, 880, 940 and 976 nm.',
    'Lidar and rangefinders, and direct materials processing with fibre-coupled diode modules of kilowatts.',
    'Projectors, microscopes and illumination in blue, green and red.'
  ],
  history: 'Robert Hall at General Electric made the first semiconductor laser in September 1962, from gallium arsenide cooled in liquid nitrogen and pulsed; three other groups reported theirs within weeks, among them Nick Holonyak, whose red laser was the first in the visible. The double heterostructure, proposed in 1963 and made to work at room temperature in 1970 by Zhores Alferov in Leningrad and by Izuo Hayashi and Morton Panish at Bell Laboratories, made the diode laser practical; Alferov shared the 2000 Nobel Prize in Physics for it.',
  sources: [
    'L. A. Coldren, S. W. Corzine and M. L. Mašanović, *Diode Lasers and Photonic Integrated Circuits* (Wiley) — gain, threshold, efficiency and cavities.',
    'G. P. Agrawal and N. K. Dutta, *Semiconductor Lasers* (Springer) — the physics and the types.',
    'R. Diehl (ed.), *High-Power Diode Lasers* (Springer) — bars, stacks, beam shaping and reliability.',
    'R. N. Hall et al., "Coherent light emission from GaAs junctions", *Physical Review Letters* 9 (1962) 366.'
  ],
  sim: [{ id: 'lz-diode' }, { id: 'lz-tuning' }]
}
,

/* ================================================================ VCSELs and laser arrays */
{
  id: 'vcsels-and-laser-arrays', parent: 'laser-families', title: 'VCSELs and laser arrays', level: 2,
  short: 'A VCSEL sends its light out of the top of the chip instead of from the cut edge. Its cavity is one wavelength long between two stacks of mirrors, its beam is round, and thousands can be made, tested and cut from one wafer. Arrays of them are the light source of face recognition, mice, 3-D sensors and short data links.',
  keywords: ['VCSEL', 'vertical cavity surface emitting laser', 'distributed Bragg reflector', 'DBR', 'oxide aperture', 'laser array', 'laser bar', 'dot projector', 'time of flight', '850 nm', '940 nm', 'structured light', 'on-wafer testing'],
  prereq: ['diode-lasers', 'dielectric-mirrors', 'laser-modes'],
  related: ['laser-families-overview', 'pattern-projectors', 'structured-light-scanning', 'time-of-flight-cameras', 'the-optical-mouse-and-optical-encoders', 'fibre-optic-links', 'multilayer-coatings', 'electronics:optoelectronics'],
  body: `
A **VCSEL** (vertical-cavity surface-emitting laser, pronounced "vixel") sends its light out of the top of the chip, not from a cut edge. Its cavity runs up through the layers of the chip and is about one wavelength long, between two stacks of mirrors. The beam is round, there is one longitudinal mode, the threshold is about a milliampere, and thousands are made, tested and cut from one wafer. Arrays of them are the light of face recognition, optical mice, 3-D sensors and short data links.

### Turn the laser on its end
An edge emitter has a cavity a millimetre long, with the gain spread over all of it. A VCSEL's gain region is a few quantum wells, 8 nm thick each: a light wave crosses it and gains less than 1 %. Two consequences follow. The mirrors must be nearly perfect, since they may lose only a little less than the gain. And the cavity is so short that its modes lie about 100 nm apart, wider than the gain curve: **only one longitudinal mode** can lase.

### The mirrors
Each mirror is a **distributed Bragg reflector**: alternating quarter-wave layers of two alloys of AlGaAs, of index about 3.5 and 3.0 at 850 nm, each $\\lambda/4n$ thick (61 nm and 71 nm). Every interface reflects only 0.6 %, but all the reflections add in phase. For $N$ pairs of layers embedded in the high-index material,

$$R = \\left(\\frac{1 - r^{2N}}{1 + r^{2N}}\\right)^2, \\qquad r = \\frac{n_L}{n_H}$$

so 22 pairs reflect 99.5 %, and the band over which they do is $(4\\lambda/\\pi)\\,\\arcsin\\!\\big[(n_H - n_L)/(n_H + n_L)\\big] = 83$ nm wide. A top mirror has 20–25 pairs, a bottom mirror 30–40, so that the light leaves from the top ([[dielectric-mirrors]]). What the gain demands is $R = e^{-\\Gamma g d}$: with a gain $g$ of 2000 cm⁻¹ in wells totalling $d$ = 24 nm and the field doubled at the wells ($\\Gamma = 2$), 99.0 % per mirror (the simulation below).

### Confining the current
A layer of AlAs next to the cavity is oxidised from the sides in steam, leaving a conducting hole of 3 to 10 µm: the **oxide aperture** confines the current and the light. A small aperture (under 4 µm) gives one transverse mode, 1 to 3 mW; a larger one gives several modes and up to 10 mW. The beam is round, with a divergence of 10 to 25° across, so a simple lens collimates it.

### Wavelengths and uses
| Wavelength | Wells | Used for |
|---|---|---|
| 850 nm | GaAs | short data links on multimode fibre, optical mice, printers |
| 940 nm | InGaAs | 3-D sensing, face recognition, infrared illumination |
| 795, 895 nm | GaAs | atomic clocks (rubidium, caesium) |
| 1310, 1550 nm | InP-based | telecommunications, tunable sources |

At 940 nm no red glow betrays the source, and sunlight is weaker there, since water vapour absorbs: a sensor sees the laser against a darker background. The wavelength drifts only 0.06–0.07 nm/K, a fifth of an edge emitter's, so a filter a few nanometres wide can follow it.

### Arrays
Many emitters on one chip add their power: hundreds of watts of illumination for sensors and heating. A **dot projector** uses hundreds to thousands of emitters with a diffractive element that multiplies the pattern into tens of thousands of dots ([[pattern-projectors]], [[structured-light-scanning]]); a flat array lit in nanosecond pulses is the illuminator of a [[time-of-flight-cameras|time-of-flight camera]]. The edge-emitting counterpart is the **bar**: dozens of emitters across a 1 cm chip, 100–300 W, stacked to kilowatts to pump other lasers. The light of a many-emitter array is spatially incoherent, which reduces speckle, but its beam quality is poor.

> [!warn] Each emitter is weak, but an array adds up. A face-recognition projector is Class 1 only because of its optics and its shut-off circuit; a bare array or one with a broken diffuser is not. The infrared is invisible and the eye does not blink at it. See [[laser-safety-classes]].

> [!key] A VCSEL is a one-wavelength cavity between two Bragg mirrors of 20–40 pairs, which must reflect above 99 % because the gain is so thin. The result is a round beam, one mode, wafer-scale testing and arrays by the thousand.
`,
  ideas: [
    'A VCSEL emits perpendicular to the chip, from a cavity about one wavelength long between two Bragg mirrors of 20–40 pairs of quarter-wave layers.',
    'The gain is thin (under 1 % per pass), so each mirror must reflect above 99 %; the stack reflects R = ((1 − r^{2N})/(1 + r^{2N}))² for r = nL/nH.',
    'The cavity modes are about 100 nm apart, wider than the gain, so there is a single longitudinal mode; an oxide aperture of 3–10 µm gives a round beam.',
    'The wavelength drifts 0.06 nm/K, a fifth of an edge emitter, so narrow filters can follow it (3-D sensing).',
    'Arrays of VCSELs make dot projectors and illuminators; edge-emitting bars and stacks make kilowatts for pumping.'
  ],
  pitfalls: [
    'A VCSEL is a small edge emitter — Its cavity is a thousand times shorter and perpendicular to the layers; the mirrors are grown into the chip and have to reflect over 99 %, where an edge emitter\u2019s cleaved facets reflect 31 %.',
    'More emitters in an array make a better beam — They make more power, but each emitter is independent, so the beam quality of the array is poor. The array is a source for illumination and projection, not for a tight focus.',
    'A face-recognition laser is eye-safe because it is weak — It is safe because the system is designed and monitored to keep the total below the Class 1 limit. Remove the optic or break the diffuser and the light can be far above it.'
  ],
  terms: [
    { term: 'VCSEL', also: ['vertical-cavity surface-emitting laser'], def: 'A semiconductor laser that emits perpendicular to the chip surface from a cavity about one wavelength long between two mirror stacks.' },
    { term: 'Oxide aperture', def: 'An opening a few micrometres across in an oxidised layer of the VCSEL that confines the current, and also the light, to a small round area.' },
    { term: 'Laser bar', also: ['diode bar'], def: 'A single chip about 1 cm wide carrying dozens of edge emitters side by side, giving 100–300 W. Bars are stacked to give kilowatts.' },
  ],
  formulas: [
    {
      name: 'Reflectance of a Bragg mirror',
      expr: 'R = ((1 - r^(2*N))/(1 + r^(2*N)))^2', tex: 'R = \\left(\\frac{1 - r^{2N}}{1 + r^{2N}}\\right)^2',
      vars: {
        R: { name: 'reflectance at the design wavelength', q: 'ratio', unit: '%' },
        r: { name: 'index ratio, n_L ÷ n_H', value: 0.857, min: 0.3, max: 0.99 },
        N: { name: 'pairs of layers', value: 22, min: 1, max: 100, int: true }
      },
      solveFor: 'R',
      note: 'For a mirror embedded in material of the high index, as in a VCSEL. In air the numbers are a little different.',
      stories: { R: 'A mirror has {N} pairs of layers with an index ratio of {r}. What does it reflect?', N: 'A mirror with an index ratio of {r} must reflect {R}. How many pairs does it need?' }
    },
    {
      name: 'Width of the stop band',
      expr: 'dlam = 4*lam/pi*asin((nH - nL)/(nH + nL))', tex: '\\Delta\\lambda = \\frac{4\\lambda}{\\pi}\\arcsin\\frac{n_H - n_L}{n_H + n_L}',
      vars: {
        dlam: { name: 'width of the band of high reflectance', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lam: { name: 'design wavelength', q: 'length', unit: 'nm', value: 850, tex: '\\lambda' },
        nH: { name: 'high index', value: 3.5, min: 1, max: 5, tex: 'n_H' },
        nL: { name: 'low index', value: 3.0, min: 1, max: 5, tex: 'n_L' }
      },
      solveFor: 'dlam',
      note: 'It depends on the contrast of the indices, not on the number of layers.'
    },
    {
      name: 'Reflectance the gain demands',
      expr: 'R = exp(-Gam*g*d)', tex: 'R = e^{-\\Gamma g d}',
      vars: {
        R: { name: 'reflectance each mirror must have', q: 'ratio', unit: '%' },
        Gam: { name: 'enhancement of the field at the wells', value: 2, min: 1, max: 2.5, tex: '\\Gamma' },
        g: { name: 'material gain at threshold', q: 'wavenumber', unit: '1/cm', value: 2000, min: 1 },
        d: { name: 'total thickness of the wells', q: 'length', unit: 'nm', value: 24, min: 1 }
      },
      solveFor: 'R',
      note: 'Two mirrors of equal reflectance R and a gain G = e^{Γgd} per pass just reach threshold when R·G = 1.'
    },
    {
      name: 'Spacing of the cavity modes',
      expr: 'dlam = lam^2/(2*n*L)', tex: '\\Delta\\lambda = \\frac{\\lambda^2}{2\\,n\\,L}',
      vars: {
        dlam: { name: 'wavelength spacing of the modes', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 850, tex: '\\lambda' },
        n: { name: 'index of the cavity', value: 3.5, min: 1, max: 5 },
        L: { name: 'effective length of the cavity (with the penetration into the mirrors)', q: 'length', unit: 'µm', value: 1 }
      },
      solveFor: 'dlam',
      note: 'An edge emitter 1 mm long has modes 0.1 nm apart; a VCSEL 1 µm long has them 100 nm apart.'
    }
  ],
  examples: [
    {
      title: 'How many pairs?',
      q: 'A VCSEL mirror is made of layers of index 3.5 and 3.0. How many pairs must it have to reflect 99.5 %?',
      steps: [
        { text: 'Invert the formula. With $\\sqrt{0.995} = 0.9975$:', tex: 'r^{2N} = \\frac{1 - \\sqrt{R}}{1 + \\sqrt{R}} = \\frac{0.0025}{1.9975} = 0.00125' },
        { text: 'The index ratio is $r = 3.0/3.5 = 0.857$, so', tex: '2N = \\frac{\\ln 0.00125}{\\ln 0.857} = \\frac{-6.68}{-0.154} = 43.4 \\quad\\Rightarrow\\quad N = 21.7' },
        'So 22 pairs. The mirror is 22 × (61 + 71) nm = 2.9 µm thick, and the whole chip a few micrometres of epitaxy on a substrate.'
      ],
      a: '22 pairs, about 2.9 µm of stack.'
    },
    {
      title: 'Why a single mode',
      q: 'A VCSEL cavity is 1 µm long including the penetration into the mirrors, at 850 nm, with an index of 3.5. How far apart in wavelength are its modes, and how many fit in a gain curve 30 nm wide? Compare a 1 mm edge emitter.',
      steps: [
        { text: 'The spacing of the modes:', tex: '\\Delta\\lambda = \\frac{\\lambda^2}{2nL} = \\frac{(850\\ \\mathrm{nm})^2}{2 \\times 3.5 \\times 1000\\ \\mathrm{nm}} = 103\\ \\mathrm{nm}' },
        'The gain curve, 30 nm wide, is far narrower than 103 nm: at most one mode fits in it. If the cavity is tuned right, there is exactly one; if it is not, the laser is poor. VCSELs are designed with the cavity resonance on the gain peak.',
        { text: 'The edge emitter, $L = 1$ mm:', tex: '\\Delta\\lambda = \\frac{(850\\ \\mathrm{nm})^2}{2 \\times 3.5 \\times 10^{6}\\ \\mathrm{nm}} = 0.10\\ \\mathrm{nm}' },
        'About 300 modes fit under its gain curve; in practice a few of them lase at once.'
      ],
      a: '103 nm, so one mode; the edge emitter has modes 0.1 nm apart, hundreds in its gain.'
    }
  ],
  quiz: [
    { q: 'Why must the mirrors of a VCSEL reflect more than 99 %?', choices: ['The gain region is so thin that a pass gains less than 1 %', 'The chip is small', 'The beam is round', 'They must keep the light out of the substrate'], a: 0, why: 'At threshold the gain per round trip equals the loss. If the wells give only about 1 %, the mirrors may lose only a little less than that in total.' },
    { q: 'What happens to the stop band of a Bragg mirror if the index contrast is lowered, with the number of pairs kept the same?', choices: ['It narrows, and the peak reflectance falls', 'It widens', 'It does not change', 'It moves to a longer wavelength'], a: 0, why: 'The width is $(4\\lambda/\\pi)\\arcsin[(n_H - n_L)/(n_H + n_L)]$, so a smaller contrast gives a narrower band; and each interface reflects less, so the peak falls too unless pairs are added.' },
    { q: 'A VCSEL has several longitudinal modes lasing at the same time, like a long edge emitter.', a: false, why: 'Its cavity is about a micrometre long, so its modes are about 100 nm apart, wider than the gain curve. At most one fits.' },
    { q: 'A Bragg mirror of 12 pairs, with indices 3.5 and 3.0, reflects about what percentage? (Use r = 0.857.)', answer: 90.6, unit: '%', why: '$r^{24} = e^{24\\ln 0.857} = 0.0247$, so $R = \\big((1-0.0247)/(1+0.0247)\\big)^2 = 0.906$. Ten pairs give 83 %, twenty-two give 99.5 %: each added pair removes about a third of the light that still leaks.' },
    { q: 'Why is 940 nm preferred over 850 nm for sensors that must work in daylight and be invisible?', choices: ['Sunlight is weaker there (water vapour absorbs) and the source has no visible glow', 'It is more powerful', 'It is eye-safe', 'It is cheaper'], a: 0, why: 'The atmosphere\u2019s water absorbs sunlight near 940 nm, so the ambient background is lower, and a 940 nm emitter shows no red glow, which 850 nm emitters do.' }
  ],
  applications: [
    'Data links in data centres: 850 nm VCSELs on multimode fibre, tens of gigabits per second per lane.',
    'Optical mice and finger-navigation sensors, and the print heads of some laser printers.',
    '3-D sensing: dot projectors for structured light, and pulsed arrays for time-of-flight and lidar illumination.',
    'Chip-scale atomic clocks and magnetometers (795 and 895 nm single-mode VCSELs).',
    'High-power arrays for heating, industrial illumination and pumping.'
  ],
  history: 'Kenichi Iga at the Tokyo Institute of Technology sketched the vertical-cavity laser in 1977 and made the first working device, pulsed and cooled, in 1979. Room-temperature continuous operation came in 1988 with the same group, and commercial 850 nm VCSELs for data links appeared in the mid-1990s. Smartphones began to carry VCSEL arrays for face recognition in 2017.',
  sources: [
    'R. Michalzik (ed.), *VCSELs: Fundamentals, Technology and Applications of Vertical-Cavity Surface-Emitting Lasers* (Springer).',
    'K. Iga, "Surface-emitting laser — its birth and generation of new optoelectronics field", *IEEE Journal of Selected Topics in Quantum Electronics* 6 (2000) 1201.',
    'L. A. Coldren, S. W. Corzine and M. L. Mašanović, *Diode Lasers and Photonic Integrated Circuits* — the chapters on VCSELs and on mirrors.',
    'H. A. Macleod, *Thin-Film Optical Filters* — quarter-wave stacks and their reflectance.'
  ],
  sim: 'lz-vcsel'
},

/* ================================================================ fibre lasers */
{
  id: 'fibre-lasers', parent: 'laser-families', title: 'Fibre lasers', level: 2,
  short: 'A fibre laser uses a long optical fibre, its core doped with a rare-earth ion, as the gain medium. Diodes pump it along the fibre, gratings in the fibre are the mirrors, and the beam comes out of a single-mode core. The fibre turns the poor beam of the pump diodes into a near-perfect beam, and sheds heat easily along its length.',
  keywords: ['fibre laser', 'fiber laser', 'ytterbium fibre laser', 'erbium doped fibre', 'EDFA', 'thulium', 'double-clad fibre', 'pump combiner', 'fibre Bragg grating', 'MOPA', 'large mode area', 'brightness', 'laser cutting', 'photodarkening', 'fibre fuse'],
  prereq: ['laser-families-overview', 'single-mode-and-multimode-fibre', 'diode-lasers'],
  related: ['solid-state-lasers', 'fibre-attenuation-and-windows', 'fibre-sensors-and-bragg-gratings', 'laser-marking-and-cutting-heads', 'laser-processing-systems', 'fibre-optic-links', 'beam-quality-m-squared', 'laser-eye-hazards-and-eyewear'],
  body: `
A **fibre laser** uses a long optical fibre whose core is doped with a rare-earth ion as its gain medium. Pump light from diodes travels along the fibre, the ions amplify the signal in the core, and the mirrors are gratings written into the fibre itself. It is glass from end to end: nothing to align and nothing to clean, and the beam comes out of a fibre, so it can be carried anywhere. It is the main laser for cutting and welding metal, and an erbium fibre is the amplifier of the fibre-optic internet.

### The ions
| Ion | Wavelength | Pumped at | Used for |
|---|---|---|---|
| Ytterbium (Yb³⁺) | 1030–1100 nm | 915, 976 nm | cutting, welding, marking; the most efficient, a quantum defect of only 9 % |
| Erbium (Er³⁺) | 1530–1565 nm | 980, 1480 nm | telecommunication amplifiers, eye-safer lidar |
| Thulium (Tm³⁺) | 1.9–2.1 µm | 790 nm | surgery, welding of clear plastics |

Erbium doped together with ytterbium (the ytterbium absorbs the pump and passes it on) reaches 100 W and more at 1.55 µm.

### The double-clad fibre
Pump diodes have poor beams; a single-mode core 6 to 20 µm across cannot accept them. The **double-clad fibre** solves it: a doped core, an **inner cladding** 125–600 µm across that guides the pump (numerical aperture about 0.46), and an outer coating of low-index polymer. The pump zigzags through the inner cladding and crosses the core now and then, so what is absorbed per metre is the core's absorption times the **area ratio**. A 20 µm core in a 400 µm cladding is 1/400 of the area: with 600 dB/m in the core, 1.5 dB/m along the fibre, and 10 to 20 m absorb nearly all the pump (the simulation).

### A brightness converter
The pump fills the cladding: its beam parameter product is the radius (0.2 mm) times the angle (0.46 rad): **92 mm·mrad**. The signal in a single-mode core has $M^2\\lambda/\\pi$ = **0.37 mm·mrad** for $M^2 = 1.1$. The power is nearly the same, so the beam is brighter by the ratio of the squares: tens of thousands of times, at an efficiency of 70 to 80 % between the light of the pump and the light out. That is the reason a fibre laser cuts so well: its power can be focused to a spot of tens of micrometres.

### Why heat is easy
The fibre is a thread: its surface is some twenty times larger than that of a stubby rod of the same volume, and the heat has only a fraction of a millimetre to travel, so it escapes easily and there is no thermal lens. The beam is set by the waveguide, not by the pump: $M^2$ of 1.05–1.2 from a single-mode core, 1.1–1.5 from a large-mode-area core of 20–30 µm, and 5 to 20 from the 50–100 µm cores that carry kilowatts to a cutting head. Wall-plug efficiencies are 30–50 %, and powers run from watts to 100 kW.

### Pulses and limits
A **MOPA** (a small laser, the master oscillator, followed by a fibre amplifier) gives nanosecond pulses of 1 mJ at 20–100 W average for marking, or femtosecond pulses after chirped-pulse amplification. The limits are the light's own intensity (1 kW in a 20 µm core is 320 MW/cm²), which brings nonlinear scattering (Raman, Brillouin), the slow darkening of the doped glass, and, if the end face is damaged or dirty, a **fibre fuse**: a plasma that runs back along the fibre, destroying the core, at about a metre per second. Light reflected from the workpiece must be kept from re-entering.

> [!warn] 1070 nm light is invisible and is focused onto the retina; a kilowatt laser is Class 4, and even the diffuse light from a workpiece is hazardous. Never look into the end of a fibre or a connector, which is likely to carry infrared light you cannot see, and use eyewear rated for the wavelength: see [[laser-eye-hazards-and-eyewear]].

> [!key] A double-clad fibre guides the pump in a large cladding and the signal in a small doped core. The pump is absorbed over metres, the beam is set by the core, and heat is easily shed: a brightness converter, efficient and compact.
`,
  ideas: [
    'The gain medium is a rare-earth-doped silica core: ytterbium (1.07 µm), erbium (1.55 µm) or thulium (1.9–2.1 µm); gratings written in the fibre are the mirrors.',
    'In a double-clad fibre the pump travels in a large inner cladding and is absorbed slowly by the small core, at the core\u2019s absorption times the area ratio.',
    'The signal beam is set by the single-mode core (M² = 1.05–1.5), whatever the beam quality of the pump: the fibre is a brightness converter.',
    'A fibre is a thread with a large surface for its volume, so heat leaves easily and there is no thermal lens: 30–50 % wall-plug efficiency at kilowatts.',
    'The limits are nonlinear effects, photodarkening and damage at the end face; reflected light from the work must be blocked.'
  ],
  pitfalls: [
    'A fibre laser is just a fibre that carries laser light — A delivery fibre is passive. In a fibre laser the fibre itself is the gain medium: its core is doped and pumped, and it makes the light.',
    'The pump goes into the core — A core of 20 µm cannot accept a diode\u2019s poor beam. It goes into the inner cladding, which is some 400 times larger in area, and reaches the core by crossing it again and again.',
    'A longer fibre always gives more power — Beyond the length that absorbs the pump, more fibre only adds loss and nonlinear effects. The length is chosen to absorb about 10 to 15 dB of the pump.'
  ],
  terms: [
    { term: 'Double-clad fibre', also: ['cladding-pumped fibre'], def: 'A fibre with a doped core, an inner cladding that guides the pump light and an outer low-index coating. It lets multimode diodes pump a single-mode core.' },
    { term: 'MOPA', also: ['master oscillator power amplifier'], def: 'A small low-power laser (the master oscillator) whose output is amplified by one or more amplifier stages, giving control of the pulses and a large power.' },
    { term: 'Large-mode-area fibre', also: ['LMA fibre'], def: 'A fibre whose core is 20–30 µm or more but is made to carry mainly the fundamental mode, lowering the intensity while keeping the beam good.' },
    { term: 'Fibre fuse', def: 'A bright plasma that starts at a defect in a fibre carrying high power and travels back towards the source at about 1 m/s, destroying the core as it goes.' },
    { term: 'Brightness of a laser beam', def: 'The power per unit area and per unit solid angle of a beam: how much power can be put into a small spot at a small angle. A fibre laser raises the brightness of its pump by a factor of tens of thousands.' }
  ],
  formulas: [
    {
      name: 'Pump absorption along a double-clad fibre',
      expr: 'acl = ac*(dc/dd)^2', tex: '\\alpha_{\\mathrm{clad}} = \\alpha_{\\mathrm{core}}\\left(\\frac{d_c}{d_d}\\right)^2',
      vars: {
        acl: { name: 'absorption of the pump along the fibre', q: 'attenuation', unit: 'dB/m', tex: '\\alpha_{\\mathrm{clad}}' },
        ac: { name: 'absorption of the doped core alone', q: 'attenuation', unit: 'dB/m', value: 600, tex: '\\alpha_{\\mathrm{core}}' },
        dc: { name: 'core diameter', q: 'length', unit: 'µm', value: 20, tex: 'd_c' },
        dd: { name: 'inner cladding diameter', q: 'length', unit: 'µm', value: 400, tex: 'd_d' }
      },
      solveFor: 'acl',
      note: 'The pump is spread evenly over the cladding; the core takes a share equal to its area ratio.',
      stories: { acl: 'A fibre has a core of {dc} in a cladding of {dd}, and the doped core absorbs {ac}. How fast is the pump absorbed along the fibre?' }
    },
    {
      name: 'Total absorption of the pump',
      expr: 'A = acl*L', tex: 'A = \\alpha_{\\mathrm{clad}}\\,L',
      vars: {
        A: { name: 'total absorption', q: 'gain', unit: 'dB' },
        acl: { name: 'absorption along the fibre', q: 'attenuation', unit: 'dB/m', value: 1.5, tex: '\\alpha_{\\mathrm{clad}}' },
        L: { name: 'length of the fibre', q: 'length', unit: 'm', value: 10 }
      },
      solveFor: 'A',
      note: '10 dB absorbs 90 % of the pump, 15 dB absorbs 97 %, 20 dB 99 %.',
      stories: { L: 'The pump is absorbed at {acl}. How long must the fibre be to absorb {A} of it?' }
    },
    {
      name: 'Share of the pump absorbed',
      expr: 'f = 1 - 10^(-A/10)', tex: 'f = 1 - 10^{-A/10}',
      vars: {
        f: { name: 'share of the pump absorbed', q: 'ratio', unit: '%' },
        A: { name: 'total absorption', q: 'gain', unit: 'dB', value: 15, min: 0, max: 60 }
      },
      solveFor: 'f'
    },
    {
      name: 'Beam parameter product',
      expr: 'bpp = M2*lam/pi', tex: '\\mathrm{BPP} = \\frac{M^2\\lambda}{\\pi}',
      vars: {
        bpp: { name: 'beam parameter product', q: false, unit: 'mm·mrad', tex: '\\mathrm{BPP}' },
        M2: { name: 'beam quality M²', value: 1.1, min: 1, max: 100, tex: 'M^2' },
        lam: { name: 'wavelength in micrometres', q: false, unit: 'µm', value: 1.07, tex: '\\lambda' }
      },
      solveFor: 'bpp',
      note: 'With λ in micrometres the result is directly in mm·mrad. The pump, filling a 400 µm cladding of aperture 0.46, has about 92.'
    }
  ],
  examples: [
    {
      title: 'How long a fibre?',
      q: 'A double-clad fibre has a 20 µm core in a 400 µm cladding, and the core alone absorbs 600 dB/m at the pump wavelength. How long must it be to absorb 97 % of the pump?',
      steps: [
        { text: 'The absorption along the fibre:', tex: '\\alpha_{\\mathrm{clad}} = 600 \\times \\left(\\frac{20}{400}\\right)^2 = 1.5\\ \\mathrm{dB/m}' },
        { text: '97 % absorbed means 3 % left, which is $-10\\log_{10}0.03 = 15.2$ dB:', tex: 'L = \\frac{15.2\\ \\mathrm{dB}}{1.5\\ \\mathrm{dB/m}} = 10\\ \\mathrm{m}' },
        'A fibre of this kind is typically 10 to 30 m long, coiled to a few tens of centimetres in diameter. A cladding of 125 µm would give ten times the absorption: 1 m instead of 10 m.'
      ],
      a: 'About 10 m.'
    },
    {
      title: 'The brightness gained',
      q: 'The pump fills a 400 µm cladding of numerical aperture 0.46. The signal is a Gaussian beam of $M^2 = 1.1$ at 1.07 µm, and 78 % of the pump power leaves as signal. By what factor is the brightness raised?',
      steps: [
        { text: 'The pump: radius 0.2 mm, half-angle 0.46 rad = 460 mrad:', tex: '\\mathrm{BPP}_p = 0.2\\ \\mathrm{mm} \\times 460\\ \\mathrm{mrad} = 92\\ \\mathrm{mm\\cdot mrad}' },
        { text: 'The signal:', tex: '\\mathrm{BPP}_s = \\frac{1.1 \\times 1.07\\ \\mu\\mathrm{m}}{\\pi} = 0.37\\ \\mathrm{mm\\cdot mrad}' },
        { text: 'Brightness is power over $\\mathrm{BPP}^2$ (two transverse directions), so the gain is', tex: '0.78 \\times \\left(\\frac{92}{0.37}\\right)^2 = 0.78 \\times 62\\,000 \\approx 48\\,000' }
      ],
      a: 'About 48 000 times. The pump beam had no hope of being focused to 30 µm; the signal can.'
    }
  ],
  quiz: [
    { q: 'Why is the pump guided in the inner cladding and not in the core?', choices: ['The pump diodes\u2019 beam is too poor to enter a single-mode core, but it fits in the large cladding', 'The core is too hot', 'The cladding is made of a better glass', 'Light cannot travel in the core'], a: 0, why: 'A core of 6–20 µm accepts only a beam of near-perfect quality. A bar of diodes has a beam parameter product hundreds of times larger and can only be launched into a cladding hundreds of micrometres across.' },
    { q: 'A 20 µm core sits in a 200 µm cladding and absorbs 400 dB/m by itself. What is the absorption of the pump along the fibre, in dB per metre?', answer: 4, unit: 'dB/m', why: '$400 \\times (20/200)^2 = 4$ dB/m. The pump meets the core only as often as its area ratio.' },
    { q: 'Doubling the length of a fibre laser always doubles its output.', a: false, why: 'Once the fibre absorbs nearly all the pump, more length adds only loss and nonlinear effects. The length is chosen for roughly 10–15 dB of absorption.' },
    { q: 'How much of the pump is left after 20 dB of absorption, in per cent?', answer: 1, unit: '%', why: '20 dB is a factor of 100 in power: 1 % remains, 99 % has been absorbed.' },
    { q: 'Which statement about the beam of a fibre laser is true?', choices: ['Its quality is set by the core of the fibre, not by the quality of the pump', 'It has the beam quality of the pump diodes', 'It is always multimode', 'It is always Gaussian whatever the core'], a: 0, why: 'The signal is guided in the core, whose size and index fix the modes. Small cores give M² near 1; the large cores of multi-kilowatt lasers give M² of 5 to 20, still far better than the pump.' }
  ],
  applications: [
    'Cutting, welding and marking of metals with ytterbium fibre lasers of 20 W to tens of kilowatts, delivered through a fibre to the cutting head.',
    'Erbium-doped fibre amplifiers along every long fibre link, pumped at 980 nm; erbium fibre lasers in eye-safer lidar.',
    'Thulium fibre lasers for surgery and for welding of clear plastics.',
    'Ultrafast fibre lasers for micromachining and microscopy; single-frequency fibre lasers for sensing and gravitational-wave detectors.'
  ],
  history: 'Elias Snitzer at American Optical made the first glass laser in 1961, and a fibre laser a little later, but fibres lacked the pump power to compete. The erbium-doped fibre amplifier, made in 1987 by groups at Southampton (David Payne\u2019s) and at Bell Laboratories, changed telecommunications. The double-clad fibre (Snitzer and colleagues, 1988) let diode bars pump single-mode cores, and through the 2000s ytterbium fibre lasers rose from tens of watts to kilowatts and took over the cutting of sheet metal.',
  sources: [
    'M. J. F. Digonnet (ed.), *Rare-Earth-Doped Fiber Lasers and Amplifiers* (Marcel Dekker, 2nd edition).',
    'C. Jauregui, J. Limpert and A. Tünnermann, "High-power fibre lasers", *Nature Photonics* 7 (2013) 861.',
    'E. Desurvire, *Erbium-Doped Fiber Amplifiers* (Wiley).',
    'A. E. Siegman, *Lasers* — the chapters on laser amplifiers and on beam quality.'
  ],
  sim: 'lz-fibre'
},

/* ================================================================ frequency doubling */
{
  id: 'frequency-doubling-and-nonlinear-optics', parent: 'laser-families', title: 'Frequency doubling and nonlinear optics', level: 3,
  short: 'In a suitable crystal two photons of infrared light can fuse into one of twice the energy: 1064 nm becomes 532 nm, and repeating the trick makes 355 and 266 nm. The new light is made efficiently only if it stays in step with the old; getting it to do so, phase matching, is the whole craft.',
  keywords: ['frequency doubling', 'second harmonic generation', 'SHG', 'nonlinear optics', 'phase matching', 'coherence length', 'quasi-phase-matching', 'periodically poled', 'KTP', 'LBO', 'BBO', 'sum frequency', 'optical parametric oscillator', 'green laser pointer', 'third harmonic'],
  prereq: ['solid-state-lasers', 'birefringence', 'photon-energy'],
  related: ['wave-plates', 'laser-families-overview', 'common-laser-wavelengths', 'optical-crystals', 'q-switching-and-mode-locking', 'laser-safety-classes', 'physics:photon'],
  body: `
In a suitable crystal, two photons of infrared light can fuse into one of twice the energy: 1064 nm light becomes 532 nm. Do it again and the laser makes 355 nm and 266 nm. It turns a cheap infrared laser into a green pointer, and makes the ultraviolet lasers of marking and inspection. The new light is made efficiently only if it stays in step with the old; achieving that is **phase matching**, and it is the whole craft.

### The nonlinear response
Light's electric field pushes the electrons of a material. For weak light the push is proportional to the field; for strong light there is a second term proportional to its square, $P = \\varepsilon_0(\\chi^{(1)}E + \\chi^{(2)}E^2 + \\dots)$. If $E \\propto \\cos\\omega t$, then $E^2$ contains $\\cos 2\\omega t$: radiation at twice the frequency. The second-order term exists only in crystals without a centre of symmetry (KTP, LBO, BBO, lithium niobate, KDP) and matters only at intensities of megawatts per square centimetre, so lasers are needed.

The same term gives **sum-frequency** and **difference-frequency** generation, and, run in reverse, the **optical parametric oscillator**: a photon of a pump splits into two of lower energy, which can be tuned from the visible to the mid-infrared.

### Photon bookkeeping
Energy is conserved, so $1/\\lambda_3 = 1/\\lambda_1 + 1/\\lambda_2$:
| Harmonic | Process | From 1064 nm |
|---|---|---|
| 2ω | ω + ω | 532 nm |
| 3ω | ω + 2ω | 354.7 nm |
| 4ω | 2ω + 2ω | 266 nm |
| 5ω | ω + 4ω | 212.8 nm |

Typical pulsed conversion is 50–80 % to 532 nm, 20–40 % to 355 nm and 10–25 % to 266 nm: less at each step.

### Phase matching
The doubled light is made all along the crystal. But in an ordinary material $n(2\\omega) > n(\\omega)$, so the doubled light travels slower than the pump, and after a **coherence length** $L_c = \\lambda/[4(n_{2\\omega} - n_\\omega)]$ the light made later is out of step with what was made before, and cancels it. In fused silica at 1064 nm $L_c$ is 24 µm: a millimetre of glass makes almost no green (the simulation). Two cures:
1. **Birefringent phase matching**. In a birefringent crystal choose the polarizations and the direction of travel so that the extraordinary index at $2\\omega$ equals the ordinary index at $\\omega$ ([[birefringence]]). The angle is tuned, or the temperature (LBO needs about 150 °C for 1064 → 532 nm with no angle tuning at all). The crystals: KTP for green, LBO and BBO for high power and for the ultraviolet, KDP for the largest apertures.
2. **Quasi-phase matching**. Flip the sign of the nonlinear coefficient every coherence length, by reversing the crystal's poling: lithium niobate at 1064 nm has $L_c$ = 3.4 µm, so the period is about 7 µm. It gains only $2/\\pi$ of the amplitude of the perfect case but allows any wavelength in the crystal's range and its largest coefficient.

### Efficiency
At low conversion the output grows as intensity × length², so doubling is done with Q-switched or mode-locked pulses, a tight focus or a resonant cavity; at high conversion it saturates as $\\tanh^2$. The crystal accepts only a degree or so of temperature and a milliradian-centimetre of angle, so it sits in a temperature-controlled mount.

### The green pointer
A diode at 808 nm pumps a Nd:YVO₄ crystal, which lases at 1064 nm; a KTP crystal beside it, or inside the cavity, doubles it to 532 nm. A filter at the output must remove the 808 and 1064 nm light that is left.

> [!warn] Cheap green pointers often lack that filter and leak tens of milliwatts of invisible infrared, which the eye does not see and the blink reflex does not answer, and which is focused onto the retina. A pointer sold as Class 2 may be much stronger than its label says. Never point any laser at people, vehicles or aircraft. See [[laser-eye-hazards-and-eyewear]].

> [!key] Two photons of ω make one of 2ω in a crystal without a centre of symmetry, if the light stays in step. Phase matching (by birefringence, or by periodic poling) is what makes a coherence length of 20 µm into a crystal of centimetres.
`,
  ideas: [
    'A crystal without a centre of symmetry radiates at 2ω when strong light of ω passes: two photons become one of twice the energy.',
    'Harmonics are made by repeating the step: 1064 → 532 → 354.7 (ω + 2ω) → 266 (2ω + 2ω) nm.',
    'Without phase matching the doubled light is made out of step after one coherence length (24 µm in fused silica at 1064 nm) and cancels itself.',
    'Birefringent phase matching uses polarizations and angle or temperature; quasi-phase matching flips the sign of the coefficient every coherence length.',
    'Efficiency grows as intensity × length² at first and saturates; the green pointer needs a filter to stop the infrared.'
  ],
  pitfalls: [
    'Frequency doubling changes the colour of the light by filtering it — A filter only removes light. Doubling makes new photons of twice the energy, from two old ones; the fundamental is partly used up.',
    'A longer crystal always gives more green — Only if it is phase-matched. In an unmatched crystal the green oscillates between zero and a tiny maximum every coherence length, and a longer crystal makes no difference.',
    'Any crystal can double light — Only those without a centre of symmetry have a second-order response; and even they are weak, so lasers of high intensity are needed.'
  ],
  terms: [
    { term: 'Second-harmonic generation', also: ['SHG', 'frequency doubling'], def: 'The nonlinear process in which two photons of frequency ω combine into one of frequency 2ω, so that the wavelength is halved.' },
    { term: 'Phase matching', def: 'Arranging that the nonlinear polarization and the light it makes travel at the same speed, so that the new light adds up along the whole crystal instead of cancelling.' },
    { term: 'Phase-matching coherence length', also: ['L_c (harmonic generation)'], def: 'In harmonic generation, the length over which the new light stays in step with the old: λ divided by four times the difference of the indices at the two wavelengths. It is tens of micrometres in an unmatched crystal.' },
    { term: 'Quasi-phase matching', also: ['QPM', 'periodic poling'], def: 'Phase matching by reversing the sign of the nonlinear coefficient every coherence length (in a periodically poled crystal such as PPLN), so that the output always keeps growing.' },
    { term: 'Sum-frequency generation', also: ['SFG'], def: 'Mixing two beams of frequencies ω₁ and ω₂ in a nonlinear crystal to make light at ω₁ + ω₂; the third harmonic of a laser is made by mixing its fundamental with its second harmonic.' },
    { term: 'Optical parametric oscillator', also: ['OPO'], def: 'A nonlinear crystal in a cavity in which a pump photon splits into two photons of lower energy (the signal and the idler); the wavelengths can be tuned by temperature or angle.' }
  ],
  formulas: [
    {
      name: 'Wavelength of a harmonic',
      expr: 'lamn = lam/n', tex: '\\lambda_n = \\frac{\\lambda}{n}',
      vars: {
        lamn: { name: 'wavelength of the nth harmonic', q: 'length', unit: 'nm', tex: '\\lambda_n' },
        lam: { name: 'wavelength of the laser (the fundamental)', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        n: { name: 'harmonic number', value: 2, min: 1, max: 10, int: true }
      },
      solveFor: 'lamn',
      stories: { lamn: 'A laser at {lam} is frequency-multiplied to harmonic number {n}. What is the new wavelength?' }
    },
    {
      name: 'Sum frequency',
      expr: 'lam3 = 1/(1/lam1 + 1/lam2)', tex: '\\frac{1}{\\lambda_3} = \\frac{1}{\\lambda_1} + \\frac{1}{\\lambda_2}',
      vars: {
        lam3: { name: 'wavelength of the sum-frequency light', q: 'length', unit: 'nm', tex: '\\lambda_3' },
        lam1: { name: 'first wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda_1' },
        lam2: { name: 'second wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda_2' }
      },
      solveFor: 'lam3',
      note: 'Photon energy is proportional to 1/λ, and energy is conserved. For 1064 and 532 nm: 354.7 nm.'
    },
    {
      name: 'Coherence length',
      expr: 'Lc = lam/(4*(n2 - n1))', tex: 'L_c = \\frac{\\lambda}{4\\,(n_{2\\omega} - n_{\\omega})}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'µm', tex: 'L_c' },
        lam: { name: 'wavelength of the fundamental', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        n1: { name: 'index at the fundamental', value: 1.4496, min: 1, max: 5, tex: 'n_{\\omega}' },
        n2: { name: 'index at the second harmonic', value: 1.4607, min: 1, max: 5, tex: 'n_{2\\omega}' }
      },
      solveFor: 'Lc',
      note: 'The defaults are fused silica at 1064 and 532 nm. For lithium niobate (extraordinary ray: 2.156 and 2.234) the length is 3.4 µm, and the poling period of a quasi-matched crystal is twice the coherence length.',
      stories: { Lc: 'A crystal has indices of {n1} at {lam} and {n2} at the second harmonic. What is its coherence length?' }
    },
    {
      name: 'Scaling of the low-conversion efficiency',
      expr: 'r = (L2/L1)^2*(I2/I1)', tex: 'r = \\left(\\frac{L_2}{L_1}\\right)^2\\frac{I_2}{I_1}',
      vars: {
        r: { name: 'ratio of the efficiencies, second ÷ first' },
        L1: { name: 'first crystal length', q: 'length', unit: 'mm', value: 5, tex: 'L_1' },
        L2: { name: 'second crystal length', q: 'length', unit: 'mm', value: 10, tex: 'L_2' },
        I1: { name: 'first pump intensity', q: 'intensity', unit: 'MW/cm²', value: 10, tex: 'I_1' },
        I2: { name: 'second pump intensity', q: 'intensity', unit: 'MW/cm²', value: 20, tex: 'I_2' }
      },
      solveFor: 'r',
      note: 'Only while the conversion is small. At high conversion the efficiency saturates.'
    }
  ],
  examples: [
    {
      title: 'The harmonics of a Nd:YAG laser',
      q: 'A Nd:YAG laser emits at 1064 nm. What are the wavelengths of the second, third and fourth harmonics, and how are the third and fourth made?',
      steps: [
        { text: 'The second harmonic is half the wavelength:', tex: '\\lambda_2 = \\frac{1064}{2} = 532\\ \\mathrm{nm}' },
        { text: 'The third harmonic is the sum of the fundamental and the second:', tex: '\\frac{1}{\\lambda_3} = \\frac{1}{1064} + \\frac{1}{532} = \\frac{3}{1064} \\quad\\Rightarrow\\quad \\lambda_3 = 354.7\\ \\mathrm{nm}' },
        { text: 'The fourth is the doubling of the second:', tex: '\\lambda_4 = \\frac{532}{2} = 266\\ \\mathrm{nm}' },
        'Each step is a separate crystal, so the efficiency multiplies down: 60 % to green, 30 % of the infrared to the ultraviolet at 355 nm, perhaps 15 % to 266 nm.'
      ],
      a: '532 nm (doubling), 354.7 nm (ω + 2ω) and 266 nm (doubling the 532 nm).'
    },
    {
      title: 'The period of a poled crystal',
      q: 'Lithium niobate has extraordinary indices of 2.156 at 1064 nm and 2.234 at 532 nm. What are the coherence length and the poling period for quasi-phase-matched doubling?',
      steps: [
        { text: 'The coherence length:', tex: 'L_c = \\frac{1.064\\ \\mu\\mathrm{m}}{4\\,(2.234 - 2.156)} = 3.4\\ \\mu\\mathrm{m}' },
        'The sign must flip every coherence length, so one full period of the pattern is twice that: 6.8 µm, about 7 µm. Such periods are made by applying a strong electric field through a patterned electrode on a wafer.',
        'Compare fused silica at the same wavelength: 24 µm. Lithium niobate has stronger dispersion and so a shorter coherence length, but a very large nonlinear coefficient, and in a poled crystal it is the large coefficient that is used.'
      ],
      a: 'Coherence length 3.4 µm; poling period about 7 µm.'
    }
  ],
  quiz: [
    { q: 'A Nd:YAG laser emits at 1064 nm. What is the wavelength of its third harmonic made by adding the fundamental and the second harmonic? Give the answer in nanometres.', answer: 354.7, unit: 'nm', why: '$1/\\lambda = 1/1064 + 1/532 = 3/1064$, so $\\lambda = 354.7$ nm. Energy is conserved: one photon of 3 units of energy from photons of 1 and 2.' },
    { q: 'Why is a plate of ordinary glass useless for doubling?', choices: ['The two colours travel at different speeds, so the new light cancels after a coherence length of tens of micrometres', 'Glass absorbs infrared', 'Glass has too high an index', 'Glass cannot be polished'], a: 0, why: 'Glass has normal dispersion, so $n(2\\omega) > n(\\omega)$. Light made at different depths comes out of step, and the green builds up and dies away every 24 µm. Glass also has a centre of symmetry and so almost no second-order response.' },
    { q: 'In quasi-phase matching the sign of the nonlinear coefficient is flipped every coherence length.', a: true, why: 'Just as the new light would begin to cancel, the sign of its source reverses, and it keeps adding. The period is twice the coherence length.' },
    { q: 'At low conversion the green light grows as the square of the crystal length. A crystal is doubled in length with the same pump. By what factor does the green grow?', answer: 4, why: '$(2L/L)^2 = 4$: the length squared. At high conversion the pump is used up and the growth saturates.' },
    { q: 'Why can a green laser pointer be more dangerous than its colour suggests?', choices: ['It may leak the invisible infrared of its pump diode and of the 1064 nm laser, which the eye does not blink at', 'Green light is more energetic than infrared', 'The crystal is radioactive', 'Green light cannot be blocked'], a: 0, why: 'A pointer without a proper infrared filter emits the 808 nm of the diode and the 1064 nm of the crystal beside the green, which cannot be seen, so the eye\u2019s protective reflexes are not triggered.' }
  ],
  applications: [
    'Green lasers for pointers, projectors, particle-image velocimetry and holography; the pump of titanium–sapphire lasers.',
    'Ultraviolet lasers (355 and 266 nm) for marking glass and plastics, drilling circuit boards and inspecting masks.',
    'Optical parametric oscillators for tunable light across the visible and the infrared, and for spectroscopy.',
    'Fusion research: KDP crystals of tens of centimetres triple the 1053 nm light of 192 beams to 351 nm.',
    'Sum-frequency lasers at 589 nm for sodium guide stars in adaptive optics.'
  ],
  history: 'Peter Franken and colleagues at the University of Michigan reported the second harmonic of a ruby laser (694.3 nm → 347.2 nm) in quartz in 1961; the story goes that the faint spot was mistaken for a flaw in the photograph and removed before printing. Phase matching was proposed independently in 1962 by Joseph Giordmaine and Paul Maker, and quasi-phase matching in the same year by Armstrong, Bloembergen, Ducuing and Pershan. Periodically poled lithium niobate became practical in the 1990s. Nicolaas Bloembergen shared the 1981 Nobel Prize in Physics for laser spectroscopy and nonlinear optics.',
  sources: [
    'R. W. Boyd, *Nonlinear Optics* (Academic Press) — second-harmonic generation, phase matching and quasi-phase matching.',
    'P. A. Franken, A. E. Hill, C. W. Peters and G. Weinreich, "Generation of optical harmonics", *Physical Review Letters* 7 (1961) 118.',
    'V. G. Dmitriev, G. G. Gurzadyan and D. N. Nikogosyan, *Handbook of Nonlinear Optical Crystals* (Springer).',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapter on nonlinear optics.'
  ],
  sim: 'lz-shg'
}
,

/* ================================================================ the common wavelengths */
{
  id: 'common-laser-wavelengths', parent: 'laser-families', title: 'The common laser wavelengths', level: 1,
  short: 'A few dozen wavelengths account for almost every laser in use: the ultraviolet lines of excimers and tripled YAG, the visible lines of helium–neon, argon and diodes, the near infrared of Nd:YAG, diodes and ytterbium fibre, the telecom windows, and 10.6 µm. Each is where it is because a medium has a line there, and each has a job that suits it.',
  keywords: ['laser wavelengths', 'common laser lines', '532 nm', '1064 nm', '405 nm', '1550 nm', '10.6 micron', 'photon energy', 'air wavelength', 'vacuum wavelength', 'retinal hazard', 'eye-safer', 'invisible laser', 'luminous efficiency'],
  prereq: ['laser-families-overview', 'the-optical-spectrum', 'photon-energy'],
  related: ['gas-lasers', 'diode-lasers', 'solid-state-lasers', 'frequency-doubling-and-nonlinear-optics', 'choosing-a-laser', 'lasers-at-work', 'the-luminosity-function', 'laser-eye-hazards-and-eyewear', 'fibre-attenuation-and-windows'],
  body: `
A few dozen wavelengths account for almost every laser in use. Each is where it is for a reason, and each has a job that suits it. The simulation draws thirty-one of them on one axis, from 193 nm to 10.6 µm, with what each is used for; click a row to read it. Here are the reasons and the groups.

### Why these wavelengths
- **Nature's lines.** Neon, argon, cadmium, carbon dioxide and the excimer molecules have transitions at fixed wavelengths: 632.8, 488 and 514.5, 325, 10.6 µm, 193 to 351 nm.
- **Engineered gaps.** A semiconductor alloy can be made to emit anywhere from 375 nm to 1.65 µm, so diodes cluster where there is a use: 405 nm for discs, 650 nm for DVDs and barcodes, 808 and 976 nm to pump other lasers, 1310 and 1550 nm for fibre.
- **Harmonics.** A crystal turns an infrared line into a green or ultraviolet one: 532, 355 and 266 nm from 1064 ([[frequency-doubling-and-nonlinear-optics]]).

### The main lines
| Wavelength | Laser | Used for |
|---|---|---|
| 193, 248 nm | ArF, KrF excimer | chip lithography, eye surgery |
| 355 nm | Nd:YAG, tripled | marking glass and plastics, thin films |
| 405 nm | diode | Blu-ray, fluorescence, resin printing |
| 488, 514.5 nm | argon ion | confocal microscopy, flow cytometry |
| 532 nm | Nd:YVO₄, doubled | pointers, velocimetry, retinal treatment |
| 632.8 nm | helium–neon | interferometry, alignment |
| 650 nm | diode | DVD, barcode scanners, pointers |
| 808, 976 nm | diode | pumping solid-state and fibre lasers |
| 850, 940 nm | VCSEL | data links, mice, 3-D sensing |
| 905 nm | pulsed diode | lidar, rangefinders |
| 1064 nm | Nd:YAG | marking, welding, gravitational-wave detectors |
| 1070 nm | ytterbium fibre | cutting and welding metal |
| 1310, 1550 nm | diode, erbium fibre | fibre links; eye-safer lidar |
| 2.94 µm | Er:YAG | dentistry, skin |
| 10.6 µm | carbon dioxide | cutting non-metals |

### Reading a wavelength
- **Air or vacuum.** Catalogues give the wavelength in air: 632.8 nm is 632.97 nm in vacuum. The frequency is the same; the wavelength is shorter in air by the factor $n$.
- **Tolerance.** A helium–neon line is fixed to a few picometres; a doubled Nd laser sits at 532 nm within about 1 nm; a diode is quoted to ±5 or ±10 nm and drifts 0.3 nm per kelvin.
- **What you cannot see.** Below 380 nm and above 780 nm the beam is invisible: 193, 355, 1064 and 10.6 µm are all beams of which only the spot, or the damage, shows. The simulation draws them as rings.

### The photon sets what the light can do
Photon energy is $hc/\\lambda$, about 1240 eV·nm over the wavelength. A 193 nm photon (6.4 eV) breaks chemical bonds; 532 nm (2.3 eV) excites electrons and is absorbed by pigments and copper; 1064 nm (1.2 eV) heats metal; 10.6 µm (0.12 eV) only sets molecules vibrating, which is heat.

### The eye, the fibre, the air
The retina is exposed between 400 and 1400 nm, whether or not you can see the light; a 5 mW green pointer looks eight times brighter than a 5 mW red one, because the eye is 8.3 times more sensitive at 532 nm than at 650 nm ([[the-luminosity-function]]). Fibres are clearest near 850, 1310 and 1550 nm ([[fibre-attenuation-and-windows]]); the atmosphere passes 3–5 µm and 8–12 µm, where 10.6 µm sits.

> [!key] Lasers cluster at wavelengths set by atomic lines, by semiconductor gaps and by harmonics of the 1 µm lines. The wavelength decides what the light can do (photon energy), what absorbs it, whether the eye sees it and where it can travel.
`,
  ideas: [
    'Laser wavelengths come from atomic and molecular lines, from semiconductor band gaps, and from harmonics of infrared lines.',
    'Diodes cluster at the wavelengths with a use: 405 (discs), 650, 808 and 976 (pumping), 850 and 940 (sensing), 1310 and 1550 (fibre).',
    'A photon carries about 1240 eV·nm ÷ λ: 6.4 eV at 193 nm breaks bonds, 0.12 eV at 10.6 µm only heats.',
    'Catalogue wavelengths are in air; the vacuum wavelength is longer by the factor n, and the frequency is unchanged.',
    'The eye is sensitive only from 380 to 780 nm, but light from 400 to 1400 nm is focused on the retina: an invisible beam can still blind.'
  ],
  pitfalls: [
    'The nanometre figure of a laser is its colour — It is the colour only between 380 and 780 nm. A 1064 nm beam has no colour you can see, but it passes the cornea and burns the retina.',
    'Two lasers of the same power look equally bright — The eye is 8.3 times as sensitive to 532 nm as to 650 nm, and not sensitive at all beyond 780 nm. The same power looks very different, and is equally dangerous.',
    'A laser has exactly the wavelength on its label — Diodes are quoted to a few nanometres and drift with temperature; a helium–neon laser is steady to a picometre or so. The label is a nominal value.'
  ],
  terms: [
    { term: 'Nominal wavelength', also: ['rated wavelength', 'labelled wavelength'], def: 'The wavelength a laser is sold as: the value on the label, which a real laser meets only within its tolerance (a fraction of a nanometre for a gas laser, ±5 to ±10 nm for a diode) and, for a diode, only at a given temperature.' },
    { term: 'Retinal hazard region', def: 'The wavelengths from 400 to 1400 nm, which the eye focuses onto the retina. Light in this region is dangerous at much lower power than light outside it, whether visible or not.' },
    { term: 'Eye-safer wavelength', also: ['eye-safe band'], def: 'A wavelength beyond about 1400 nm (1550 nm in particular) that the front of the eye absorbs before it reaches the retina, so that a much higher exposure is allowed. Eye-safer is not harmless: the cornea can burn.' },
  ],
  formulas: [
    {
      name: 'Photon energy',
      expr: 'E = h*c/lam', tex: 'E = \\frac{hc}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' }, c: { const: 'c' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 532, tex: '\\lambda' }
      },
      solveFor: 'E',
      note: '532 nm gives 2.33 eV.',
      stories: { E: 'How much energy does a photon of {lam} light carry?', lam: 'A photon carries {E}. What is its wavelength?' }
    },
    {
      name: 'Frequency of the light',
      expr: 'f = c/lam', tex: '\\nu = \\frac{c}{\\lambda}',
      vars: {
        f: { name: 'frequency', q: 'frequency', unit: 'THz', tex: '\\nu' },
        c: { const: 'c' },
        lam: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' }
      },
      solveFor: 'f',
      note: '1550 nm is 193.4 THz, the centre of the frequency grid of long-distance fibre links.',
      stories: { f: 'What is the frequency of light of wavelength {lam} in vacuum?' }
    },
    {
      name: 'Luminous flux of a laser beam',
      expr: 'Phi = Km*V*P', tex: '\\Phi = K_m\\,V(\\lambda)\\,P',
      vars: {
        Phi: { name: 'luminous flux: how bright the beam looks', q: 'luminousflux', unit: 'lm', tex: '\\Phi' },
        Km: { const: 'Km' },
        V: { name: 'luminous efficiency of the eye at the wavelength (532 nm: 0.885; 650 nm: 0.107)', value: 0.885, min: 0, max: 1 },
        P: { name: 'power of the beam', q: 'power', unit: 'mW', value: 5 }
      },
      solveFor: 'Phi',
      note: 'The eye\u2019s response at the wavelength, times 683 lm/W. It says how bright a beam looks, not how dangerous it is.',
      stories: { Phi: 'A beam of {P} has an eye sensitivity of {V}. How many lumens is it?' }
    },
    {
      name: 'Wavelength in vacuum and in air',
      expr: 'lv = la*n', tex: '\\lambda_{\\mathrm{vac}} = n\\,\\lambda_{\\mathrm{air}}',
      vars: {
        lv: { name: 'wavelength in vacuum', q: 'length', unit: 'nm', tex: '\\lambda_{\\mathrm{vac}}' },
        la: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda_{\\mathrm{air}}' },
        n: { name: 'refractive index of air', value: 1.000277, min: 1, max: 1.01 }
      },
      solveFor: 'lv'
    }
  ],
  examples: [
    {
      title: 'A ladder of photon energies',
      q: 'Find the energies of photons of 193 nm, 532 nm, 1064 nm and 10.6 µm light, and say what each can do.',
      steps: [
        { text: 'With $E = 1239.8\\ \\mathrm{eV\\,nm}/\\lambda$:', tex: '6.42\\ \\mathrm{eV}\\ (193\\ \\mathrm{nm}),\\quad 2.33\\ \\mathrm{eV}\\ (532\\ \\mathrm{nm}),\\quad 1.17\\ \\mathrm{eV}\\ (1064\\ \\mathrm{nm}),\\quad 0.117\\ \\mathrm{eV}\\ (10.6\\ \\mu\\mathrm{m})' },
        '6.4 eV exceeds the 3.6 eV of a carbon–carbon bond: bonds break. 2.3 eV is enough to excite electrons in pigments, dyes and copper. 1.2 eV is just above the 1.1 eV gap of silicon, passes through the eye and heats metal. 0.12 eV is a vibration of a molecule: heat, through absorption by water, plastic and glass.',
        'The factor between the ends is 55: a 10.6 µm photon has a fifty-fifth of the energy of an ArF photon, yet a CO₂ laser of kilowatts makes far more photons per second than any excimer.'
      ],
      a: '6.42, 2.33, 1.17 and 0.117 eV: bond breaking, electronic excitation, heating of metal, and the heating of molecules by vibration.'
    },
    {
      title: 'Green against red',
      q: 'A 5 mW green pointer (532 nm, eye sensitivity 0.885) and a 5 mW red pointer (650 nm, 0.107) are shone on a wall. How many lumens does each give, and how much brighter is the green?',
      steps: [
        { text: 'The luminous flux is $683\\ \\mathrm{lm/W} \\times V \\times P$. Green:', tex: '683 \\times 0.885 \\times 0.005 = 3.0\\ \\mathrm{lm}' },
        { text: 'Red:', tex: '683 \\times 0.107 \\times 0.005 = 0.37\\ \\mathrm{lm}' },
        'The ratio is 0.885/0.107 = 8.3. The two beams carry the same power and are equally dangerous to the retina, but one looks eight times brighter, so the blink reflex answers the green one sooner.'
      ],
      a: '3.0 lm and 0.37 lm: the green pointer looks 8.3 times brighter.'
    }
  ],
  quiz: [
    { q: 'A crystal doubles the frequency of a 1064 nm laser. What is the new wavelength, in nanometres?', answer: 532, unit: 'nm', why: 'Doubling the frequency halves the wavelength: 1064/2 = 532 nm.' },
    { q: 'How much energy does a photon of 193 nm light carry, in electronvolts?', answer: 6.42, unit: 'eV', why: '$1239.8/193 = 6.42$ eV, more than the 3.6 eV of a carbon–carbon bond.' },
    { q: 'A 1064 nm laser beam is invisible, so it cannot harm the eye until it is bright enough to see.', a: false, why: 'The cornea and lens pass 1064 nm and focus it onto the retina, where it is absorbed. The eye cannot see it and does not blink; the damage can be done before anything is noticed.' },
    { q: 'A 5 mW green (532 nm) pointer and a 5 mW red (650 nm) pointer. Which looks brighter, and by about how much?', choices: ['Green, about 8 times', 'Red, about 8 times', 'They look the same', 'Green, about 1.5 times'], a: 0, why: 'The eye\u2019s sensitivity is 0.885 at 532 nm and 0.107 at 650 nm: a ratio of about 8.' },
    { q: 'The wavelength of a helium–neon laser is the same in vacuum as in air.', a: false, why: 'The frequency is the same, but the wavelength in air is shorter by the index of air (1.00028): 632.8 nm in air is 632.97 nm in vacuum. Catalogues give the air value.' }
  ],
  applications: [
    'Reading a laser catalogue or a data sheet: wavelength, tolerance and whether the beam is visible.',
    'Matching a laser to a target: bond breaking in the ultraviolet, absorption by metals and pigments in the visible, water and plastics in the infrared.',
    'Matching it to a medium it must pass through: 1310 and 1550 nm for glass fibre, 3–5 and 8–12 µm for air, silicon-detector range for 400–1000 nm.',
    'Laser safety: the wavelength decides the exposure limit and the eyewear.'
  ],
  history: 'Each early laser brought its own wavelength: 694.3 nm for ruby (1960), 1152 nm and, from 1962, 632.8 nm for helium–neon, 488 and 514.5 nm for argon, 10.6 µm for carbon dioxide and 1064 nm for Nd:YAG (all by 1964). Diodes started at 842 nm in gallium arsenide (1962) and spread slowly to the red; the blue-violet diode at 405 nm, made by Shuji Nakamura at Nichia in 1996, is what made the Blu-ray disc possible.',
  sources: [
    'M. J. Weber (ed.), *CRC Handbook of Laser Science and Technology* — tables of laser lines and media.',
    'O. Svelto, *Principles of Lasers* — the survey of laser types and their wavelengths.',
    'J. Hecht, *Understanding Lasers* (IEEE Press) — the wavelengths and what each is used for.',
    'IEC 60825-1, *Safety of laser products* — the wavelength regions of the exposure limits (retinal hazard region and beyond).'
  ],
  sim: { id: 'lz-map', params: { view: 'lines' } }
},

/* ================================================================ choosing a laser */
{
  id: 'choosing-a-laser', parent: 'laser-families', title: 'Choosing a laser', level: 2,
  short: 'Choosing a laser is answering six questions: what the target absorbs (or the detector sees), how much power or energy, continuous or pulsed, how good a beam, what size, efficiency and cost, and how safe. The answers usually point to one family long before they point to a catalogue number.',
  keywords: ['choosing a laser', 'laser selection', 'laser specification', 'absorption', 'wavelength choice', 'average power', 'peak power', 'pulse energy', 'M squared', 'focused spot', 'eye-safe', 'copper welding', 'laser marking', 'laser class'],
  prereq: ['common-laser-wavelengths', 'laser-safety-classes', 'beam-quality-m-squared'],
  related: ['laser-families-overview', 'focusing-a-laser-beam', 'continuous-and-pulsed-lasers', 'laser-power-and-energy-measures', 'laser-marking-and-cutting-heads', 'laser-processing-systems', 'transmission-and-absorption', 'metal-mirror-coatings'],
  body: `
Choosing a laser is a matter of six questions. Their answers usually point at one family long before they point at a catalogue number.

### 1 · The wavelength: what does the target do with it?
- To **heat, cut, weld or mark**, the target must absorb it. Clean copper absorbs about 39 % of 532 nm light and 3 % of 1064 nm, which is why copper is welded with green and blue lasers; glass, plastics and water absorb 10.6 µm, so a carbon dioxide laser cuts them.
- To **pass through** a window, a lens or tissue, the light must be transmitted: glass passes 1064 nm but not 10.6 µm, so carbon dioxide optics are zinc selenide.
- To be **detected**: silicon sees 400–1000 nm, InGaAs 900–1700 nm.
- To be **safe for the eye**: the retina is exposed from 400 to 1400 nm; light beyond 1400 nm (1550 nm) is absorbed in the front of the eye, so far more power is allowed.
- To **travel**: fibres are clear near 850, 1310 and 1550 nm, air at 3–5 and 8–12 µm.
The simulation shows the metals and the windows.

### 2 · Power or energy
Marking: 10–50 W average in nanosecond pulses. Engraving acrylic: 40–100 W of CO₂. Thin sheet metal: 1–10 kW of fibre. Alignment: 1–5 mW. Microscopy: 10–100 mW per line. The pulse energy is the average power over the repetition rate, and the peak power the energy over the duration.

### 3 · Continuous or pulsed
Cutting and welding want continuous light. Marking and cleaning want nanosecond pulses, which ablate before the heat spreads; picosecond and femtosecond pulses leave no melt at all (**cold ablation**). Interferometry wants one steady line; lidar wants short pulses.

### 4 · The beam
The spot a lens makes is $w_0 = M^2\\lambda f/\\pi w$, and the depth of focus is $2\\pi w_0^2/M^2\\lambda$ ([[focusing-a-laser-beam]]). A beam of $M^2 = 10$ makes a spot ten times larger than a perfect one, at the same lens; no lens recovers that. A fibre or helium–neon laser gives $M^2 \\approx 1$; a diode bar gives hundreds.

### 5 · Size, efficiency, cost, life
| Family | Choose it for | Think twice about |
|---|---|---|
| Diode | size, cost, efficiency, speed | beam shape, wavelength drift |
| Fibre | kilowatts, beam quality, ruggedness | pulse energy (nonlinear limits) |
| Diode-pumped solid-state | pulses, green and ultraviolet, short pulses | cost per watt, alignment |
| Gas | beam purity (He–Ne), 10.6 µm, 193 nm | bulk, supply, efficiency |

### 6 · Safety and rules
The class of the laser is the class of its output (see [[laser-safety-classes]]); the class of the product depends on its enclosure. Use the least power that does the job, and enclose it.

> [!warn] Class 3B and 4 lasers require training, enclosures, interlocks, eyewear and a laser safety officer. This page describes how the choice is made; it is not a substitute for the safety standard.

> [!key] Start from the target: the wavelength it absorbs, the power and pulse form it needs, the spot the beam can make. Those fix the family; size, efficiency, cost and safety choose among its members.
`,
  ideas: [
    'The target decides the wavelength: it must absorb it to be heated, pass it to be seen through, and the detector must see it.',
    'Copper absorbs 39 % at 532 nm and 3 % at 1064 nm; glass and plastics absorb 10.6 µm; silicon sees 400–1000 nm.',
    'Average power, pulse energy and peak power are linked by the repetition rate and the duration.',
    'Beam quality M² sets the smallest spot and the depth of focus a lens can give; a better lens cannot fix a poor beam.',
    'Diodes win on size and cost, fibre lasers on power and beam, solid-state on pulses and harmonics, gas on purity and 10.6 µm and 193 nm.'
  ],
  pitfalls: [
    'More power always does the job — If the target absorbs only 3 % of the light, a tenfold power still wastes 97 % of it as reflection, itself a hazard. A wavelength that is absorbed 40 % can do the job with a tenth of the power.',
    'A lens with a shorter focal length fixes a poor beam — The spot is $M^2\\lambda f/\\pi w$: a shorter f helps, but M² multiplies it, and the depth of focus falls. The beam, not the lens, is the limit.',
    'Eye-safe lasers can be looked into — A 1550 nm laser is eye-safer, not harmless: its higher permitted exposure still burns the cornea, and powerful ones are Class 4.'
  ],
  terms: [
    { term: 'Absorptance', also: ['absorbed fraction'], def: 'The share of the light that a surface absorbs, one minus the share it reflects (and transmits). It depends strongly on wavelength, on the surface and on temperature.' },
    { term: 'Average power', def: 'The power of a pulsed laser averaged over time: the pulse energy times the repetition rate. It decides the heat load.' },
    { term: 'Cold ablation', also: ['athermal ablation'], def: 'The removal of material by pulses so short (picoseconds or femtoseconds) that it leaves as a vapour or plasma before the heat can spread, leaving no melt at the edge.' },
    { term: 'Keyhole welding', also: ['deep-penetration welding'], def: 'Welding in which the beam is intense enough to vaporise the metal and drill a narrow vapour channel (the keyhole) along which the energy goes deep, giving welds that are narrow and deep.' },
  ],
  formulas: [
    {
      name: 'Absorbed power',
      expr: 'Pabs = A*P', tex: 'P_{\\mathrm{abs}} = A\\,P',
      vars: {
        Pabs: { name: 'power absorbed by the target', q: 'power', unit: 'W', tex: 'P_{\\mathrm{abs}}' },
        A: { name: 'absorptance at the laser wavelength', q: 'ratio', unit: '%', value: 3, min: 0, max: 100 },
        P: { name: 'power of the beam', q: 'power', unit: 'W', value: 1000 }
      },
      solveFor: 'Pabs',
      note: 'Clean copper: 3 % at 1064 nm, 39 % at 532 nm, about 56 % at 355 nm (a rough or oxidised surface absorbs more).',
      stories: { Pabs: 'A beam of {P} meets a surface that absorbs {A}. How much power heats it?' }
    },
    {
      name: 'Focused spot',
      expr: 'w0 = M2*lam*f/(pi*w)', tex: 'w_0 = \\frac{M^2\\lambda f}{\\pi w}',
      vars: {
        w0: { name: 'radius of the focused spot (1/e²)', q: 'length', unit: 'µm', tex: 'w_0' },
        M2: { name: 'beam quality M²', value: 1.5, min: 1, max: 100, tex: 'M^2' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 160 },
        w: { name: 'radius of the beam on the lens', q: 'length', unit: 'mm', value: 4 }
      },
      solveFor: 'w0',
      note: 'A Gaussian beam focused by a thin lens, with the lens filled by the beam.',
      stories: { w0: 'A beam of M² = {M2} at {lam} with a radius of {w} fills a lens of focal length {f}. What is the spot radius?' }
    },
    {
      name: 'Peak intensity in the spot',
      expr: 'I0 = 2*P/(pi*w0^2)', tex: 'I_0 = \\frac{2P}{\\pi w_0^2}',
      vars: {
        I0: { name: 'peak intensity', q: 'intensity', unit: 'GW/cm²', tex: 'I_0' },
        P: { name: 'power in the beam', q: 'power', unit: 'W', value: 10000 },
        w0: { name: 'spot radius', q: 'length', unit: 'µm', value: 20.3, tex: 'w_0' }
      },
      solveFor: 'I0',
      note: 'For a Gaussian spot; the centre has twice the average over the 1/e² circle. A pulse of 10 kW in a 20 µm spot reaches 1.5 GW/cm²: ablation.'
    },
    {
      name: 'Pulse energy from the average power',
      expr: 'E = P/frep', tex: 'E = \\frac{P}{f_{\\mathrm{rep}}}',
      vars: {
        E: { name: 'energy of one pulse', q: 'energy', unit: 'mJ' },
        P: { name: 'average power', q: 'power', unit: 'W', value: 20 },
        frep: { name: 'repetition rate', q: 'frequency', unit: 'kHz', value: 20, tex: 'f_{\\mathrm{rep}}' }
      },
      solveFor: 'E',
      stories: { E: 'A laser of {P} average power fires {frep}. How much energy does each pulse carry?', frep: 'A laser gives {E} per pulse at an average power of {P}. How fast does it fire?' }
    }
  ],
  examples: [
    {
      title: 'Welding copper',
      q: 'A 1 kW laser is used on clean copper, once at 1064 nm and once at 532 nm. How much power is absorbed in each case, and what does that mean?',
      steps: [
        { text: 'At 1064 nm the absorptance is about 3 %:', tex: 'P_{\\mathrm{abs}} = 0.03 \\times 1000\\ \\mathrm{W} = 30\\ \\mathrm{W}' },
        { text: 'At 532 nm it is about 39 %:', tex: 'P_{\\mathrm{abs}} = 0.39 \\times 1000\\ \\mathrm{W} = 390\\ \\mathrm{W}' },
        'Thirteen times more heat arrives at 532 nm. At 1064 nm the copper reflects nearly everything, then, as the surface melts, absorbs suddenly more, so that the **keyhole** (the vapour channel that deep welding rides on) forms unevenly and the weld spatters. Green (and blue) lasers heat copper steadily from the start.'
      ],
      a: '30 W against 390 W: green is thirteen times more effective on clean copper.'
    },
    {
      title: 'A marking laser',
      q: 'A fibre marking laser gives 20 W on average at 20 kHz in pulses of 100 ns, with $M^2 = 1.5$ at 1064 nm. A lens of 160 mm focal length is filled by a beam of 4 mm radius. What are the pulse energy, the peak power, the spot radius, and the peak intensity?',
      steps: [
        { text: 'The pulse energy and peak power:', tex: 'E = \\frac{20\\ \\mathrm{W}}{20\\,000\\ \\mathrm{s^{-1}}} = 1\\ \\mathrm{mJ}, \\qquad P_{\\mathrm{peak}} = \\frac{1\\ \\mathrm{mJ}}{100\\ \\mathrm{ns}} = 10\\ \\mathrm{kW}' },
        { text: 'The spot:', tex: 'w_0 = \\frac{1.5 \\times 1.064\\ \\mu\\mathrm{m} \\times 160\\ \\mathrm{mm}}{\\pi \\times 4\\ \\mathrm{mm}} = 20.3\\ \\mu\\mathrm{m}' },
        { text: 'The peak intensity:', tex: 'I_0 = \\frac{2 \\times 10^4\\ \\mathrm{W}}{\\pi\\,(20.3\\times10^{-4}\\ \\mathrm{cm})^2} = 1.5\\times10^9\\ \\mathrm{W/cm^2}' },
        'Over a gigawatt per square centimetre: enough to vaporise a thin layer of metal in each pulse before the heat has time to spread, which is what marking needs. A continuous 20 W laser in the same spot gives 3 MW/cm², about 500 times less.'
      ],
      a: '1 mJ, 10 kW, a 20 µm spot radius and about 1.5 GW/cm².'
    }
  ],
  quiz: [
    { q: 'Which wavelength would you choose to weld clean copper efficiently?', choices: ['A green or blue laser, 450–532 nm', 'Carbon dioxide, 10.6 µm', 'Nd:YAG, 1064 nm', 'Helium–neon, 632.8 nm'], a: 0, why: 'Clean copper absorbs about 40 % of 532 nm light and a few per cent of 1064 nm and 10.6 µm. The helium–neon laser is red (about 10 % absorbed) and far too weak anyway.' },
    { q: 'A laser gives 20 W on average at 20 kHz. What energy does each pulse carry, in millijoules?', answer: 1, unit: 'mJ', why: '$20\\ \\mathrm{W}/20\\,000\\ \\mathrm{Hz} = 1$ mJ.' },
    { q: 'A lens of shorter focal length can focus a beam of poor quality as tightly as a perfect beam.', a: false, why: 'The spot radius is $M^2\\lambda f/\\pi w$: it grows with $M^2$ at any lens. A shorter focal length shrinks both beams in proportion, so the poor beam is still $M^2$ times larger, and its depth of focus falls.' },
    { q: 'A 500 W beam meets a surface with an absorptance of 40 %. How much power is absorbed, in watts?', answer: 200, unit: 'W', why: '$0.40 \\times 500 = 200$ W. The rest is reflected, which can itself be a hazard.' },
    { q: 'Why is 1550 nm called "eye-safer"?', choices: ['The front of the eye absorbs it before it reaches the retina, so a much higher exposure is allowed', 'It is invisible', 'It carries less energy than visible light and so cannot harm', 'It cannot pass through glass'], a: 0, why: 'Beyond about 1400 nm the cornea and the fluid of the eye absorb the light. The retina is spared, but the cornea can still burn, so powerful 1550 nm lasers are not safe.' }
  ],
  applications: [
    'Specifying a laser for a machine: the cutting head, the marking station, the welding cell.',
    'Choosing a laser for a microscope or a sensor: the lines that excite a dye, the wavelength a detector sees.',
    'Reading a laser data sheet: average and peak power, M², pulse length, repetition rate, wavelength and tolerance.',
    'Comparing quotes: efficiency, cooling, lifetime and maintenance often cost more than the laser itself.'
  ],
  sources: [
    'W. M. Steen and J. Mazumder, *Laser Material Processing* (Springer) — absorptance, power and pulse choices for cutting, welding and marking.',
    'O. Svelto, *Principles of Lasers* — beam properties, brightness and the survey of laser types.',
    'P. W. Milonni and J. H. Eberly, *Laser Physics* (Wiley) — beam quality and focusing.',
    'IEC 60825-1, *Safety of laser products* — classes and the retinal hazard region.'
  ],
  sim: [{ id: 'lz-target', params: { view: 'metals' } }, { id: 'lz-target', params: { view: 'windows' } }]
},

/* ================================================================ lasers at work */
{
  id: 'lasers-at-work', parent: 'laser-families', title: 'Lasers at work', level: 1,
  short: 'Lasers read the checkout, spin in the disc drive, light the fibre in the ground, measure a car\u2019s distance, cut sheet steel and reshape a cornea. A tour of what each uses: which laser, which wavelength, how much power, and where it is explained in this app.',
  keywords: ['laser applications', 'lasers in everyday life', 'barcode', 'Blu-ray', 'lidar', 'laser cutting', 'laser eye surgery', 'lithography', 'optical fibre', 'laser projector', 'LIGO', 'gravitational waves', 'laser cooling', 'guide star'],
  prereq: ['laser-families-overview', 'common-laser-wavelengths'],
  related: ['choosing-a-laser', 'barcode-scanners', 'optical-disc-pickups', 'laser-printers', 'lidar', 'laser-marking-and-cutting-heads', 'laser-processing-systems', 'fibre-optic-links', 'optical-coherence-tomography', 'laser-triangulation', 'photolithography', 'laser-projection-and-displays'],
  body: `
Lasers are in the checkout, the disc drive, the fibre in the ground, the car's sensor, the sheet-metal cutter and the eye surgeon's hand. A few families recur; the choice of laser for each job is the whole of this topic in miniature. The simulation puts the jobs on a power-against-wavelength map.

### Reading and writing
| Job | Laser | Wavelength | How |
|---|---|---|---|
| [[barcode-scanners\|Barcode scanner]] | red diode | 650 nm | a spot swept over the code; a photodiode reads the reflection |
| [[optical-disc-pickups\|CD, DVD, Blu-ray]] | diodes | 780, 650, 405 nm | the spot is about $\\lambda/2\\mathrm{NA}$ across: 0.7, 4.7 and 25 GB per layer |
| [[laser-printers\|Laser printer]] | infrared diode | 780 nm | writes on a drum at 600–1200 dpi |
| [[the-optical-mouse-and-optical-encoders\|Optical mouse]] | VCSEL | 850 nm | lights the desk for the sensor |

### Sending
Long fibres carry DFB diodes at 1310 and 1550 nm, with dozens of wavelengths on one fibre and a hundred gigabits per second on each; data centres use 850 nm VCSELs on multimode fibre ([[fibre-optic-links]], [[the-fibre-internet-link]]).

### Measuring
- **Lidar** and rangefinders time a pulse of 905 nm diode or 1550 nm fibre laser light: it travels 15 cm per nanosecond, so a return after 400 ns is a target 60 m away ([[lidar]], [[time-of-flight-cameras]]).
- **Triangulation**: a red spot or line on the part and a camera at an angle ([[laser-triangulation]]).
- **Interferometers** with helium–neon light measure displacement to nanometres on machine tools ([[interferometers-in-precision-engineering]]); the 1064 nm lasers of gravitational-wave detectors sense changes in 4 km arms far smaller than a proton. Alignment and levelling lasers are [[alignment-telescopes-and-lasers]].

### Making
- **Cutting and welding**: ytterbium fibre lasers (1070 nm, 1–20 kW) for metals; carbon dioxide (10.6 µm) for plastic, wood and glass; the same fibre lasers melt metal powder in 3-D printers.
- **Marking**: nanosecond pulses at 1064 nm, or at 355 nm for glass and plastics ([[laser-marking-and-cutting-heads]], [[laser-processing-systems]]).
- **Chips**: ArF excimer light at 193 nm prints the circuits; the newest machines use 13.5 nm light made by a carbon dioxide laser striking tin droplets ([[photolithography]]).

### Medicine
Excimer light at 193 nm reshapes the cornea; green and yellow lasers (532, 577 nm) treat the retina; sources at 840 to 1310 nm image it and other tissue by OCT ([[optical-coherence-tomography]]). Pulsed dye (585–595 nm), alexandrite (755), Nd:YAG (1064) and diode (800–810) lasers treat the skin; erbium (2.94 µm) and carbon dioxide lasers remove tissue; thulium (1.94 µm) cuts soft tissue.

### Science and show
Confocal microscopes use 405, 488, 561 and 640 nm lines ([[laser-scanning-microscopes]]); 780 nm light cools rubidium atoms; 589 nm sodium lasers make guide stars for adaptive optics ([[astronomical-observatories-and-adaptive-optics]]); 192 beams of Nd:glass, tripled to 351 nm, drive fusion experiments; red, green and blue diodes make cinema projectors and light shows ([[laser-projection-and-displays]]), and [[holography]] still uses helium–neon and green lasers.

> [!warn] Never point a laser at aircraft, vehicles or people: a pointer can dazzle a pilot at kilometres, and doing so is a crime in many countries. Do not buy or use a pointer that is stronger than Class 2 or 3R, or one sold without a label.

> [!key] The same few lasers do very different jobs: red and infrared diodes read and write, telecom diodes and fibre amplifiers carry the internet, fibre and CO₂ lasers cut, excimers print and reshape, solid-state lasers pulse and measure.
`,
  ideas: [
    'Everyday lasers are mostly diodes: red for barcodes and DVDs, blue-violet for Blu-ray, 850 nm VCSELs for mice and data links, 1310 and 1550 nm for fibre.',
    'A disc\u2019s capacity grows as the spot shrinks, λ/(2·NA): 780 nm and NA 0.45 for CD, 650 nm and 0.60 for DVD, 405 nm and 0.85 for Blu-ray.',
    'Lidar and rangefinders time a pulse: 1 ns is 15 cm of range; 1550 nm is chosen where more power is allowed for the eye.',
    'Industry cuts metal with 1.07 µm fibre lasers, non-metals with 10.6 µm CO₂, and prints chips with 193 nm excimer light.',
    'Medicine and science choose the wavelength the target absorbs: 193 nm cornea, 2.94 µm water, 532 and 577 nm blood and pigment, 589 nm sodium.'
  ],
  pitfalls: [
    'Only lasers can read a barcode or a disc — Many scanners are camera-based with LED light. The laser gives a small, bright, well-defined spot, which suits discs and long-range scanners.',
    'A bigger, more powerful laser is used for the more advanced jobs — The most refined jobs often use the weakest lasers: a 2 mW helium–neon laser in a measuring interferometer, a 100 mW laser in a microscope. The job decides the laser.',
    'Laser eye surgery burns the eye — The excimer laser breaks the bonds of the cornea\u2019s tissue with ultraviolet photons, removing a quarter of a micrometre per pulse with little heating. How it is used is a clinical decision, not something this page can advise on.'
  ],
  terms: [
    { term: 'Lidar', also: ['laser radar', 'light detection and ranging'], def: 'A way of measuring distance by timing a laser pulse to a target and back: distance = c × time ÷ 2.' },
    { term: 'Optical disc pickup', def: 'The laser, lens and detector that read or write a disc: a diode of 780, 650 or 405 nm focused by a lens of numerical aperture 0.45, 0.60 or 0.85.' },
    { term: 'Laser guide star', def: 'An artificial star made by exciting sodium atoms in the upper atmosphere with a 589 nm laser, so that adaptive optics can correct a telescope\u2019s image.' },
  ],
  formulas: [
    {
      name: 'Range from the echo time',
      expr: 'd = c*t/2', tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'distance to the target', q: 'length', unit: 'm' },
        c: { const: 'c' },
        t: { name: 'time from the pulse out to the pulse back', q: 'time', unit: 'ns', value: 667 }
      },
      solveFor: 'd',
      note: 'Half, because the light goes there and back. 1 ns is 15 cm of range.',
      stories: { d: 'A lidar pulse returns after {t}. How far away is the target?', t: 'A target is {d} away. How long does a pulse take to go there and back?' }
    },
    {
      name: 'The finest detail an optical disc can resolve',
      expr: 'dmin = lam/(2*NA)', tex: 'd_{\\min} = \\frac{\\lambda}{2\\,\\mathrm{NA}}',
      vars: {
        dmin: { name: 'smallest detail resolved', q: 'length', unit: 'nm', tex: 'd_{\\min}' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 405, tex: '\\lambda' },
        NA: { name: 'numerical aperture of the lens', value: 0.85, min: 0.05, max: 1.4, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dmin',
      note: 'The Abbe limit. The track pitch of the disc, 1.6 µm for CD, 0.74 µm for DVD and 0.32 µm for Blu-ray, is set a little above it.',
      stories: { dmin: 'An optical pickup uses light of {lam} and a lens of numerical aperture {NA}. What is the smallest detail it resolves?' }
    }
  ],
  examples: [
    {
      title: 'The car ahead',
      q: 'The lidar of a car sends a pulse and receives the echo 400 ns later. How far is the object? What error in range does a timing error of 1 ns make?',
      steps: [
        { text: 'The light goes there and back:', tex: 'd = \\frac{c\\,t}{2} = \\frac{3.0\\times10^8\\ \\mathrm{m/s} \\times 400\\times10^{-9}\\ \\mathrm{s}}{2} = 60\\ \\mathrm{m}' },
        { text: 'A timing error of 1 ns:', tex: '\\Delta d = \\frac{c\\,\\Delta t}{2} = \\frac{3\\times10^8 \\times 10^{-9}}{2} = 0.15\\ \\mathrm{m}' },
        'To measure to a centimetre the detector and clock must time the pulse to about 70 ps, which is why lidar receivers are very fast.'
      ],
      a: '60 m; each nanosecond of timing error is 15 cm of range.'
    },
    {
      title: 'Why a Blu-ray disc holds five times a DVD',
      q: 'A DVD pickup uses 650 nm light and a lens of numerical aperture 0.60; a Blu-ray pickup uses 405 nm and 0.85. By what factor does the area of the spot shrink?',
      steps: [
        { text: 'The spot width goes as $\\lambda/\\mathrm{NA}$:', tex: '\\frac{650}{0.60} = 1083\\ \\mathrm{nm}, \\qquad \\frac{405}{0.85} = 476\\ \\mathrm{nm}' },
        { text: 'The ratio of the widths is 2.27, so the ratio of the areas is', tex: '2.27^2 = 5.2' },
        'The disc surface can hold five times as many marks in the same area. The capacities (4.7 GB and 25 GB per layer) are in just this ratio, 5.3.'
      ],
      a: 'The spot is 5.2 times smaller in area; the capacity grows from 4.7 to 25 GB per layer.'
    }
  ],
  quiz: [
    { q: 'A lidar pulse returns after 667 ns. How far away is the target, in metres?', answer: 100, unit: 'm', why: '$d = ct/2 = 3\\times10^8 \\times 667\\times10^{-9}/2 = 100$ m.' },
    { q: 'Which wavelength does a Blu-ray drive use?', choices: ['405 nm', '650 nm', '780 nm', '1550 nm'], a: 0, why: 'Blu-ray uses the blue-violet diode at 405 nm; DVDs use 650 nm and CDs 780 nm.' },
    { q: 'Only a laser can read a barcode.', a: false, why: 'Camera-based scanners with LED light read barcodes too. Laser scanners are chosen for their long range and bright, small spot.' },
    { q: 'Which laser is the main tool for cutting sheet steel today?', choices: ['A ytterbium fibre laser at 1.07 µm', 'A helium–neon laser', 'An excimer laser', 'A blue laser pointer'], a: 0, why: 'Metals absorb 1.07 µm far better than 10.6 µm, and fibre lasers give kilowatts with an excellent beam and good efficiency.' },
    { q: 'Why do many long-range lidars use 1550 nm rather than 905 nm?', choices: ['The eye absorbs 1550 nm in its front, so much more power is allowed', 'It is cheaper', 'It is visible', 'The air absorbs it less'], a: 0, why: 'The retina is not exposed at 1550 nm, so the permitted exposure is far higher and the laser can be stronger, which increases the range.' }
  ],
  applications: [
    'Everyday: the checkout, the disc drive, the mouse, the printer, the fibre that brings the internet.',
    'Industry: cutting, welding, marking, 3-D printing, and the lithography that makes every chip.',
    'Medicine: eye surgery, skin and dental treatment, imaging by OCT.',
    'Science and entertainment: microscopes, atomic clocks, gravitational-wave detectors, guide stars, fusion, projectors and light shows.'
  ],
  history: 'In its first years the laser was often called "a solution looking for a problem". The problems came quickly: the first supermarket barcode scan with a helium–neon laser, in June 1974, was a pack of chewing gum in Ohio; the compact disc, read by an infrared diode, reached the shops in 1982; the first transatlantic fibre cable, TAT-8, carrying light from 1.3 µm lasers, opened in 1988; and the cutting of sheet metal by fibre lasers overtook the carbon dioxide laser in the 2010s.',
  sources: [
    'J. Hecht, *Beam: The Race to Make the Laser* (Oxford University Press, 2005) — the early history of the laser and its first uses.',
    'J. Hecht, *Understanding Lasers* (IEEE Press) — the applications and the lasers behind them.',
    'W. M. Steen and J. Mazumder, *Laser Material Processing* (Springer) — cutting, welding, marking and 3-D printing.',
    'O. Svelto, *Principles of Lasers* — the chapter on applications of lasers.'
  ],
  sim: { id: 'lz-map', params: { view: 'uses' } }
}
);
