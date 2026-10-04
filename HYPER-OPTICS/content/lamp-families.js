/* HYPER-OPTICS · content/lamp-families.js — the topic "Lamp families" (14 concepts; simulations in sims/lamp-families.js, prefix la-)
 *   how-light-is-made · incandescent-lamps · halogen-lamps · fluorescent-lamps · high-intensity-discharge-lamps · sodium-lamps ·
 *   xenon-arc-and-flash-lamps · light-emitting-diodes · white-leds · colour-temperature-and-colour-rendering ·
 *   lamp-bases-and-bulb-shapes · lamp-efficacy-and-lifetime · drivers-dimming-and-flicker · uv-and-infrared-sources
 */
Hyper.add(

/* ================================================================ how light is made */
{
  id: 'how-light-is-made', parent: 'lamp-families', title: 'How light is made: incandescence and luminescence', level: 1,
  short: 'There are only two ways to make light. Heat a body until it glows (incandescence), or feed energy straight into the electrons of a gas, a crystal or a phosphor so that they give it back as light while the material stays cool (luminescence). Every lamp ever built is one of the two, or both in a row.',
  keywords: ['incandescence', 'luminescence', 'thermal radiation', 'black body', 'Planck', 'Wien', 'Stefan-Boltzmann', 'cold light', 'electroluminescence', 'photoluminescence', 'discharge', 'light source', 'hot body', 'glow'],
  prereq: ['the-optical-spectrum', 'photon-energy'],
  related: ['incandescent-lamps', 'fluorescent-lamps', 'light-emitting-diodes', 'lamp-efficacy-and-lifetime', 'the-luminosity-function', 'where-colours-come-from', 'light-sources-and-beams', 'physics:blackbody-radiation', 'chemistry:atomic-spectra'],
  body: `
Every lamp turns something into light, and there are only two ways to do it. Either the material is made hot enough to glow, or the energy is poured straight into the electrons of the material so that they give light back while the material itself stays cool. The first is **incandescence**, the second **luminescence**. The difference decides almost everything about a lamp: its colour, its efficiency, how quickly it starts and how long it lasts.

### Incandescence: the glow of hot things
Any body above absolute zero radiates, and once it is hot enough part of that radiation is visible: the dull red of an electric heater at 800 K, the yellow of a candle flame at 1850 K, the warm white of a filament at 2700 K, the white of the Sun's surface at 5800 K. An ideal emitter, a **black body**, follows **Planck's law**: its spectrum depends on the temperature alone and is a smooth hill without lines. Two consequences:

- **Wien's displacement law.** The hill peaks at $\\lambda_{\\max} = b/T$ with $b = 2898\\ \\mu\\mathrm{m\\,K}$. At 2700 K the peak is at 1.07 µm, in the infrared; at 5800 K it is at 500 nm, mid-visible.
- **Stefan–Boltzmann.** The total power radiated by each square metre goes as $\\sigma T^4$: twice the temperature gives sixteen times the radiation.

The trouble is that the visible range, 380 to 780 nm, catches only a slice of the hill. A body at 2700 K radiates 8 % of its power as visible light, at 3400 K about 19 %, at the melting point of tungsten (3695 K) only 24 %. At best a hot body gives 98 lumens per radiated watt, near 6600 K ([[lamp-efficacy-and-lifetime]]).

### Luminescence: light without the heat
Here an electron is lifted to a higher level by something other than heat — a current in a gas or a crystal, ultraviolet light, a chemical reaction — and falls back, giving off a photon of energy $E = hc/\\lambda$ equal to the step. The levels belong to the material, so the wavelengths do too: **lines** from atoms, **bands** from phosphors and semiconductors, nothing in between. A sodium lamp puts nearly all its light into one line at 589 nm, where the eye is 77 % as sensitive as at its peak, and gives over 500 lumens per radiated watt.

| Source | What is excited | Spectrum |
|---|---|---|
| Filament, halogen lamp | the whole hot metal | smooth hill, 2400–3400 K |
| Fluorescent tube | mercury atoms, then a phosphor | mercury lines, phosphor bands |
| Sodium and metal-halide lamps | atoms in a hot, dense arc | broadened lines |
| Xenon arc, flash tube | xenon atoms and ions | continuum, daylight-like |
| LED | electrons and holes in a semiconductor | one band, 20–40 nm wide |
| White LED | a blue LED, then a phosphor | blue band plus a broad yellow one |

### "Cold" does not mean cold
Luminescent lamps still get warm: a fluorescent tube runs at about 40 °C on its wall, the chip of an LED may sit at 100 °C. What makes the light "cold" is that its spectrum is not set by the temperature, so it can be far brighter in the visible range than a hot body of the same temperature. The waste heat comes from the steps around the emission: collisions, the loss when ultraviolet becomes visible light, resistance in the wires.

> [!key] Hot bodies make smooth spectra whose peak is set by temperature ($\\lambda_{\\max} = b/T$) and most of it is infrared; luminescent sources make lines and bands whose positions are set by the material. The rest of this topic is the story of getting more of the radiation into the narrow window that the eye can see.
`,
  ideas: [
    'Incandescence is light from heat: a smooth Planck spectrum fixed by the temperature alone, peaking at λ = 2898 µm·K ÷ T.',
    'Luminescence is light from excited electrons falling back: lines and bands fixed by the material, with the emitter not necessarily hot.',
    'A hot body wastes most of its radiation in the infrared: 8 % visible at 2700 K, 24 % at the melting point of tungsten.',
    'Luminescence can put the light exactly where the eye is sensitive, which is why discharge lamps and LEDs outperform filaments.',
    'Many lamps use both steps: a discharge makes ultraviolet and a phosphor turns it into visible light.'
  ],
  pitfalls: [
    'A filament bulb burns like a small fire — Nothing burns: there is no oxygen to burn in. Current heats the wire by its resistance, to about 2700 K, and the hot wire radiates.',
    'A "cold light" is a lamp that stays cold — It means the spectrum is not set by the temperature. LEDs and fluorescent tubes are warm; a power LED chip can sit at 100 °C and still make light by luminescence.',
    'The colour of a hot body is the colour of its peak — A 2700 K filament peaks at 1070 nm, invisible infrared. The colour we see comes from the slice of the hill that lies in the visible range, which is rising towards red: hence warm white.',
    'Raising the temperature just makes the same light brighter — It changes the colour as well (the peak moves to shorter wavelengths) and the total power goes as T⁴.'
  ],
  terms: [
    { term: 'Incandescence', also: ['thermal radiation', 'hot light'], def: 'Light emitted by a body because it is hot. The spectrum is smooth and set by the temperature (and the body\'s emissivity). The mechanism of the filament lamp, of a flame and of the Sun.' },
    { term: 'Luminescence', also: ['cold light'], def: 'Light emitted when electrons that have been excited by something other than heat fall back to lower energy levels. The wavelengths are set by the material\'s levels, not by its temperature.' },
    { term: 'Black body', also: ['blackbody', 'Planckian radiator'], def: 'An ideal body that absorbs all light falling on it and, when hot, emits the largest possible thermal radiation at each wavelength. Its spectrum is given by Planck\'s law and depends only on temperature.' },
    { term: 'Wien\'s displacement law', def: 'The wavelength of peak emission of a black body is inversely proportional to its temperature: λmax = 2898 µm·K ÷ T.' },
    { term: 'Electroluminescence', def: 'Luminescence produced by an electric current or field: the mechanism of LEDs, OLEDs and discharge lamps.' },
    { term: 'Photoluminescence', also: ['fluorescence', 'phosphorescence'], def: 'Luminescence excited by light. In fluorescence the emission stops almost at once; in phosphorescence it lingers for milliseconds to hours. The phosphors of fluorescent tubes and white LEDs work this way.' }
  ],
  formulas: [
    {
      name: 'Wien\'s displacement law',
      expr: 'lmax = bW/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lmax: { name: 'wavelength of the peak', q: 'length', unit: 'nm', tex: '\\lambda_{\\max}' },
        bW: { const: 'bW' },
        T: { name: 'temperature of the body', q: 'temperature', unit: 'K', value: 2700, min: 300, max: 12000 }
      },
      note: 'For a black body; a real filament is a close approximation. The peak of the spectrum per unit wavelength.',
      stories: { lmax: 'A filament glows at {T}. At what wavelength is its radiation strongest?', T: 'A hot body radiates most strongly at {lmax}. How hot is it?' }
    },
    {
      name: 'Stefan–Boltzmann law',
      expr: 'M = sigma*T^4', tex: 'M = \\sigma T^4',
      vars: {
        M: { name: 'power radiated per unit area', q: 'intensity', unit: 'kW/m²' },
        sigma: { const: 'sigma' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 2700, min: 300, max: 12000 }
      },
      note: 'A perfect black body; a grey body radiates this times its emissivity.'
    },
    {
      name: 'Energy of the photon emitted',
      expr: 'E = h*c/lam', tex: 'E = \\frac{h c}{\\lambda}',
      vars: {
        E: { name: 'energy of the photon', q: 'energy', unit: 'eV' },
        h: { const: 'h' }, c: { const: 'c' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 589, tex: '\\lambda' }
      },
      note: 'In luminescence the photon carries the energy of the step the electron fell: 2.1 eV for the sodium line.',
      stories: { E: 'An electron in a sodium atom falls and emits light of {lam}. How much energy does the photon carry?' }
    }
  ],
  examples: [
    {
      title: 'Where does a filament peak?',
      q: 'The filament of a lamp runs at 2700 K, and that of a halogen lamp at 3400 K. At what wavelengths does each radiate most strongly? Is either peak visible?',
      steps: [
        { text: 'Apply Wien\'s law, $\\lambda_{\\max} = b/T$ with $b = 2898\\ \\mu\\mathrm{m\\,K}$:', tex: '\\lambda_{\\max}(2700\\ \\mathrm{K}) = \\frac{2898}{2700}\\ \\mu\\mathrm{m} = 1.07\\ \\mu\\mathrm{m} \\qquad \\lambda_{\\max}(3400\\ \\mathrm{K}) = 0.85\\ \\mu\\mathrm{m}' },
        'Visible light ends at about 0.78 µm. Both peaks are in the near infrared; the hotter filament is closer to the visible edge, which is why its visible share is larger (19 % against 8 %).'
      ],
      a: '1070 nm and 850 nm: both in the infrared. Most of what a filament radiates is heat.'
    },
    {
      title: 'A lamp that peaks in the middle of the spectrum',
      q: 'How hot would a body have to be to radiate most strongly at 555 nm, the eye\'s peak? Could a metal filament do it?',
      steps: [
        { text: 'Solve Wien\'s law for the temperature:', tex: 'T = \\frac{b}{\\lambda_{\\max}} = \\frac{2.898\\times 10^{-3}\\ \\mathrm{m\\,K}}{555\\times 10^{-9}\\ \\mathrm{m}} = 5220\\ \\mathrm{K}' },
        'Tungsten, the metal with the highest melting point, melts at 3695 K. At that temperature the peak is at 784 nm. No filament can reach 5220 K.'
      ],
      a: 'About 5200 K, hotter than any solid lamp element can stand. That is the surface of the Sun, and the reason the eye evolved to peak where it does.'
    }
  ],
  quiz: [
    { q: 'Which statement describes luminescence?', choices: ['Light from a body because it is hot', 'Light from excited electrons falling back, with wavelengths set by the material', 'Light that has been reflected from a shiny surface', 'Light whose colour depends only on its temperature'], a: 1, why: 'Luminescence is light emitted after electrons are excited by a current, light or chemistry. The wavelengths belong to the energy levels of the material. A smooth spectrum fixed by temperature is incandescence.' },
    { q: 'The surface of the Sun is at about 5800 K. At what wavelength, in nanometres, is its radiation strongest?', answer: 500, unit: 'nm', why: 'Wien: λ = 2898 µm·K ÷ 5800 K = 0.4997 µm, about 500 nm, in the blue-green part of the visible range.' },
    { q: 'A filament lamp at 2700 K radiates most of its power as visible light.', a: false, why: 'Its peak is at 1070 nm and only about 8 % of the radiated power is visible. The rest is infrared, which we feel as heat.' },
    { q: 'The temperature of a hot body is doubled. By what factor does the total power it radiates per unit area rise?', choices: ['2', '4', '8', '16'], a: 3, why: 'Stefan–Boltzmann: the power per area is σT⁴, so doubling T gives 2⁴ = 16.' },
    { q: 'Why can a sodium lamp give far more lumens per radiated watt than a filament, even though both are made hot?', choices: ['Its glass is thinner', 'Its light is luminescence: nearly all of it falls in one line where the eye is very sensitive', 'It runs at a higher temperature', 'Sodium atoms are lighter than tungsten atoms'], a: 1, why: 'The sodium discharge puts its radiation in the 589 nm line, near the peak of the eye\'s sensitivity. A filament spreads its radiation over a broad hill, most of it beyond the red.' }
  ],
  applications: [
    'Choosing a lamp: the tables of efficacy, colour and life in this topic follow from which of the two mechanisms a lamp uses.',
    'Estimating the temperature of a hot object from its colour: a steelworker, a potter and an astronomer all use the glow.',
    'Thermal imaging and pyrometers measure temperature from the radiation a body gives off.',
    'Designing calibration sources: a tungsten ribbon lamp or a black-body cavity gives a spectrum known from its temperature alone.',
    'Understanding why a camera sees the heat of a filament lamp as a red glow, and why sunlight and filament light differ in colour.'
  ],
  history: 'In 1860 Gustav Kirchhoff posed the problem of the black body: what is the spectrum of an ideal emitter? Stefan (1879) and Boltzmann (1884) found how its total power depends on temperature, Wien (1893) how its peak moves. In October and December 1900 Max Planck found the formula that fits every wavelength, and could justify it only by supposing that light is exchanged in packets of energy hν — the first step of quantum theory.',
  sources: [
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — the physics of thermal and luminescent emission, and one chapter for every lamp family.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — the lamp families and their characteristics.',
    'M. Planck, *The Theory of Heat Radiation* (English translation of the second German edition, 1914) — the law and its consequences.'
  ],
  sim: { id: 'la-planck', params: { mode: 'hot', T: 2700 } }
},

/* ================================================================ incandescent lamps */
{
  id: 'incandescent-lamps', parent: 'lamp-families', title: 'Incandescent lamps', level: 1,
  short: 'A coil of tungsten wire heated by an electric current to about 2700 K in an inert gas. It makes a perfect, warm, dimmable light with a colour rendering index of 100 — and turns about 90 % of the power into heat, which is why it has been withdrawn from general lighting.',
  keywords: ['incandescent lamp', 'filament lamp', 'tungsten', 'light bulb', 'GLS', 'general service lamp', 'filament', 'coiled coil', 'argon fill', 'blackening', 'inrush', 'Edison', 'Swan', '2700 K'],
  prereq: ['how-light-is-made', 'the-optical-spectrum'],
  related: ['halogen-lamps', 'lamp-efficacy-and-lifetime', 'colour-temperature-and-colour-rendering', 'lamp-bases-and-bulb-shapes', 'drivers-dimming-and-flicker', 'uv-and-infrared-sources', 'the-luminosity-function'],
  body: `
Pass a current through a thin wire and the wire's resistance turns electrical power into heat; make it thin and long enough and it glows. That is the whole of the **incandescent lamp**, and nearly everything clever in it is about getting the wire hot without losing it.

### The filament and its gas
The wire is **tungsten**, the metal with the highest melting point, 3695 K (3422 °C). A general-service lamp runs it at 2700 to 2900 K. A 60 W lamp on 230 V holds about 2 metres of wire only 0.04 mm thick, wound into a tight coil and then again into a **coiled coil** so that it fits in a few millimetres. Coiling does more than save space: a layer of still gas clings to the coil and cuts the heat that gas would otherwise carry away. Small lamps may be evacuated, larger ones are filled with argon (often with some nitrogen) or, for longer life, krypton, because gas slows the evaporation of the tungsten and so lets the filament run hotter.

### What you get for the power
| Lamp (230 V) | Light | Efficacy | Colour temperature |
|---|---|---|---|
| 40 W | about 400 lm | 10 lm/W | 2700 K |
| 60 W | about 700 lm | 12 lm/W | 2700 K |
| 100 W | about 1350 lm | 13.5 lm/W | 2800 K |

Of 100 W put in, roughly 9 W comes out as visible light; most of the rest leaves as infrared, a little is carried off by the gas. The spectrum is the smooth Planck hill of [[how-light-is-made]], so colours are rendered perfectly (Ra = 100: a thermal radiator is the reference against which warm lamps are judged) and the lamp can be dimmed to a deep orange.

### Voltage rules everything
The filament's temperature rises with the voltage, and the light, the power and above all the life respond with steep power laws. Lamp engineers use the rules of thumb
$$\\Phi \\propto V^{3.4} \\qquad P \\propto V^{1.6} \\qquad L \\propto V^{-13}$$
A supply 5 % too high gives 18 % more light and half the life; a dimmer set to 90 % of the voltage cuts the light to 70 % and makes the lamp last four times longer. Photographic lamps run at 3200 K and last from a few hours to a few tens of hours, to buy a whiter light.

### How filaments die
Tungsten evaporates all the time, faster at the hottest spots. There it thins, gets hotter still, and in the end melts at a moment of stress — usually at switch-on. A cold tungsten wire has one fourteenth of its working resistance, so the inrush current is some fourteen times the steady one. The evaporated metal condenses on the cool glass and darkens it, which the [[halogen-lamps|halogen]] cycle was invented to prevent.

> [!warn] The glass of a 100 W lamp is hot enough to burn skin, and close to cloth or paper it can start a fire. Replace lamps only with the supply off.

### Why they went
Almost 90 % of the power becomes heat, so the 12 lm/W of a filament lamp is a tenth or less of what [[fluorescent-lamps]] and [[white-leds|LEDs]] achieve. The European Union withdrew ordinary filament lamps in stages between 2009 and 2012 and many other countries followed. Special uses remain where heat, a continuous spectrum or instant light matter: oven lamps, heating lamps, standard sources for calibration.

> [!key] An incandescent lamp is a tungsten wire at about 2700 K: perfect colour, instant light, easy dimming, but only 8 % of its radiation is visible, and life falls as V⁻¹³ as the voltage is raised.
`,
  ideas: [
    'The light comes from tungsten heated by the current to about 2700 K; nothing burns.',
    'Roughly 9 % of the electrical power becomes visible light; the efficacy is 8 to 17 lm/W.',
    'The spectrum is smooth, so the colour rendering index is 100 and dimming is graceful.',
    'Light goes as V^3.4 and life as V^-13: a little more voltage costs a great deal of life.',
    'Filaments fail where evaporation has thinned them, mostly at switch-on, when the cold wire draws about 14 times its running current.'
  ],
  pitfalls: [
    'A higher-wattage bulb is a brighter-coloured bulb — Wattage is the power taken, not the light made. A 100 W lamp is only slightly more efficient than a 60 W one: it makes more light because it uses more power.',
    'The filament burns away like a candle wick — It evaporates, atom by atom, in an atmosphere with no oxygen. The evaporated tungsten is the grey film on an old bulb.',
    'Leaving a filament lamp on saves it from wearing out at switch-on — Its life is counted mainly in hours of burning; the surge is only the moment when a worn filament gives up. Switching off when you leave the room saves energy and costs almost no life.',
    'The glass stays cool because the light is cold — Over 90 % of the power is heat: the infrared, the glass and the gas. A 100 W bulb is a 100 W heater that happens to glow.'
  ],
  terms: [
    { term: 'Filament', def: 'The thin tungsten wire, usually in a coiled coil, that is heated by the current to about 2700 K and radiates the light of an incandescent lamp.' },
    { term: 'Coiled coil', also: ['double-coil filament'], def: 'A filament wire wound into a coil which is itself wound into a coil. It is compact and, by trapping still gas, reduces heat lost by conduction.' },
    { term: 'Fill gas', def: 'The inert gas in the bulb, usually argon with some nitrogen, or krypton. It slows the evaporation of tungsten so that the filament can run hotter.' },
    { term: 'General Service Lamp', also: ['GLS', 'A-lamp', 'light bulb'], def: 'The ordinary pear-shaped filament lamp of 15 to 200 W for mains lighting.' },
    { term: 'Inrush current', also: ['switch-on surge'], def: 'The current drawn in the first milliseconds, when the cold filament has about one fourteenth of its working resistance. It stresses the filament and is a common moment of failure.' },
    { term: 'Lamp blackening', def: 'The grey or brown film of tungsten that has evaporated from the filament and condensed on the cooler glass.' }
  ],
  formulas: [
    {
      name: 'Life against supply voltage',
      expr: 'L = L0*(V/V0)^(-13)', tex: 'L = L_0\\left(\\frac{V}{V_0}\\right)^{-13}',
      vars: {
        L: { name: 'life at the voltage applied', q: 'time', unit: 'h' },
        L0: { name: 'rated life at the rated voltage', q: 'time', unit: 'h', value: 1000, tex: 'L_0' },
        V: { name: 'voltage applied', q: 'voltage', unit: 'V', value: 241.5, min: 50, max: 400 },
        V0: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_0' }
      },
      solveFor: 'L',
      note: 'An empirical rule of lamp engineering for filament lamps, good for changes of up to about ±10 %.',
      stories: { L: 'A lamp rated for {L0} at {V0} runs on {V}. What life can be expected?' }
    },
    {
      name: 'Light output against supply voltage',
      expr: 'Phi = Phi0*(V/V0)^3.4', tex: '\\Phi = \\Phi_0\\left(\\frac{V}{V_0}\\right)^{3.4}',
      vars: {
        Phi: { name: 'luminous flux at the voltage applied', q: 'luminousflux', unit: 'lm', tex: '\\Phi' },
        Phi0: { name: 'rated luminous flux', q: 'luminousflux', unit: 'lm', value: 700, tex: '\\Phi_0' },
        V: { name: 'voltage applied', q: 'voltage', unit: 'V', value: 207, min: 50, max: 400 },
        V0: { name: 'rated voltage', q: 'voltage', unit: 'V', value: 230, tex: 'V_0' }
      },
      solveFor: 'Phi',
      note: 'Empirical, for filament lamps near their rated voltage. A dimmer works by lowering the effective voltage.'
    },
    {
      name: 'Efficacy of a lamp',
      expr: 'K = Phi/P', tex: 'K = \\frac{\\Phi}{P}',
      vars: {
        K: { name: 'luminous efficacy', q: 'efficacy', unit: 'lm/W' },
        Phi: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', value: 700, tex: '\\Phi' },
        P: { name: 'electrical power', q: 'power', unit: 'W', value: 60 }
      },
      stories: { K: 'A {P} lamp gives {Phi}. What is its efficacy?', P: 'A lamp of efficacy {K} must give {Phi}. What power does it take?' }
    },
    {
      name: 'Switch-on current',
      expr: 'Ion = r*P/V', tex: 'I_{\\mathrm{on}} = r\\,\\frac{P}{V}',
      vars: {
        Ion: { name: 'current at the moment of switching on', q: 'current', unit: 'A', tex: 'I_{\\mathrm{on}}' },
        r: { name: 'ratio of working to cold resistance', value: 14 },
        P: { name: 'rated power', q: 'power', unit: 'W', value: 100 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 230 }
      },
      note: 'Because the steady current is P/V and the cold filament resistance is the working resistance divided by r (about 12 to 15 for tungsten).'
    }
  ],
  examples: [
    {
      title: 'A mains that runs high',
      q: 'A lamp rated for 1000 h at 230 V is used on a supply that sits at 245 V. What happens to its life and to its light?',
      steps: [
        { text: 'The voltage ratio is 245 ÷ 230 = 1.065. The life rule gives', tex: 'L = 1000\\ \\mathrm{h}\\times 1.065^{-13} = 440\\ \\mathrm{h}' },
        { text: 'and the light rule', tex: '\\Phi = \\Phi_0\\times 1.065^{3.4} = 1.24\\,\\Phi_0' }
      ],
      a: 'The lamp gives 24 % more light and lasts 440 hours instead of 1000: a 6.5 % excess of voltage costs more than half the life.'
    },
    {
      title: 'How much of the power is light?',
      q: 'A 100 W lamp gives 1350 lm. Taking about 147 lm per watt of *visible* radiation at 2700 K, how many watts of visible light is that, and what fraction of the 100 W?',
      steps: [
        { text: 'Divide the luminous flux by the efficacy of the visible radiation:', tex: 'P_{\\mathrm{vis}} = \\frac{1350\\ \\mathrm{lm}}{147\\ \\mathrm{lm/W}} = 9.2\\ \\mathrm{W}' },
        'That is 9 % of 100 W. The other 91 W is infrared radiation and heat conducted through the gas and the cap.'
      ],
      a: 'About 9 W, 9 % of the power. The efficacy of the lamp is 13.5 lm/W.'
    }
  ],
  quiz: [
    { q: 'A lamp is run at 90 % of its rated voltage by a dimmer. Roughly what happens to its life?', choices: ['It stays the same', 'It is about 10 % longer', 'It is about four times longer', 'It is 13 times longer'], a: 2, why: 'L ∝ V⁻¹³ and 0.9⁻¹³ = 3.9. The light falls to 0.9^3.4 = 70 %, which is the price of the long life.' },
    { q: 'Most of the 60 W taken by a filament lamp leaves as visible light.', a: false, why: 'About 9 % of the power is visible light. Most is infrared radiation, which warms the surroundings.' },
    { q: 'Filament lamps most often fail at the moment of switching on because…', choices: ['the voltage is highest then', 'the cold filament draws about 14 times its working current and a thin spot melts', 'the gas freezes', 'the glass is cold'], a: 1, why: 'Tungsten\'s resistance rises about fourteen-fold between cold and 2700 K. The switch-on surge stresses a filament that has been thinned by evaporation.' },
    { q: 'A 100 W lamp gives 1350 lm. What is its efficacy, in lm/W?', answer: 13.5, why: 'K = Φ/P = 1350 ÷ 100 = 13.5 lm/W: about a tenth of an efficient LED.' },
    { q: 'Why is the colour rendering index of a filament lamp 100?', choices: ['It is very bright', 'Its smooth thermal spectrum is the reference that warm lamps are compared with', 'Tungsten is white', 'The glass filters the colours'], a: 1, why: 'The index compares a lamp with a black body of the same colour temperature (below 5000 K). A filament lamp is a black body, almost exactly.' }
  ],
  applications: [
    'General lighting for a century, until the 2009–2012 phase-out in the EU and similar rules elsewhere.',
    'Oven, refrigerator and indicator lamps, and signal lamps where simple, instant light is wanted.',
    'Heat lamps for animal rearing, food warming and drying, where the infrared is the product.',
    'Standard tungsten ribbon lamps, used in laboratories as a source of known spectrum for calibrating detectors.',
    'Theatre and film lighting before halogen and LED, still prized for the colour of a dimmed filament.'
  ],
  history: 'Joseph Swan in England and Thomas Edison in the United States both made practical carbon-filament lamps in 1878–1879, and the two companies merged in Britain in 1883. The carbon filament gave about 3 lm/W. Drawn tungsten wire (William Coolidge at General Electric, 1910) and Irving Langmuir\'s gas-filled, coiled filament (1913) made the lamp that stayed essentially unchanged for a hundred years.',
  sources: [
    'R. Kane and H. Sell, *Revolution in Lamps: A Chronicle of 50 Years of Progress* (Fairmont Press) — tungsten, halogen and the lamp business.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — the lamp characteristics and the voltage relations of filament lamps.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — the chapter on incandescent lamps.'
  ],
  sim: [{ id: 'la-planck', params: { mode: 'hot', T: 2700 } }, { id: 'la-spectrum', params: { lamp: 'incandescent', range: 'wide' } }]
},

/* ================================================================ halogen lamps */
{
  id: 'halogen-lamps', parent: 'lamp-families', title: 'Halogen lamps', level: 2,
  short: 'A tungsten filament in a small, hot quartz capsule with a trace of bromine or iodine. The halogen carries evaporated tungsten back to the filament, so the glass stays clear and the filament can run hotter: whiter light, 14 to 25 lm/W, and up to 5000 hours.',
  keywords: ['halogen lamp', 'tungsten halogen', 'quartz halogen', 'halogen cycle', 'MR16', 'capsule', 'IRC', 'infrared coating', 'low voltage', 'dichroic reflector', 'bromine', 'iodine', 'fused silica'],
  prereq: ['incandescent-lamps', 'how-light-is-made'],
  related: ['lamp-bases-and-bulb-shapes', 'dichroic-filters-and-mirrors', 'uv-and-infrared-sources', 'lamp-efficacy-and-lifetime', 'car-headlamps-and-driver-cameras', 'cinema-and-stage-lighting-systems', 'physics:blackbody-radiation'],
  body: `
An ordinary lamp darkens because the tungsten that evaporates from its filament lands on the glass. The **halogen lamp** is the same lamp with a trick: a small amount of a halogen — bromine or iodine, usually added as a compound such as methyl bromide — is sealed in with the gas, and a chemical cycle puts the tungsten back.

### The halogen cycle
1. At about 3000 K tungsten atoms leave the filament.
2. They drift towards the wall. Where the wall is hot enough, above about 250 °C, they meet the halogen and form a gas, a **tungsten halide**, instead of sticking.
3. The gas is carried by diffusion and convection back to the filament. On the hot metal it decomposes: the tungsten is deposited, and the halogen is free to start again.

The cycle only works if the wall is hot, so the bulb is a small **capsule**, close around the filament, of **quartz** (fused silica) or a hard glass that stands wall temperatures of 500 °C and more. A small bulb allows a high fill pressure, several bar, and that slows evaporation further. The simulation shows it, and shows what happens when the wall is too cold.

> [!note] The cycle does not repair a thin spot: tungsten returns preferentially to cooler parts of the coil, not to where it was lost. It clears the glass and delays the failure; it does not make the filament immortal.

### What it gains
| | Standard lamp | Halogen |
|---|---|---|
| Filament | 2700 K | 2800–3400 K |
| Visible share of radiation | 8 % | 12–19 % |
| Efficacy | 8–17 lm/W | 14–25 lm/W |
| Colour temperature | 2400–2900 K | 2800–3400 K |
| Life | 750–2000 h | 2000–5000 h |
| Colour rendering | 100 | 100 |

The hotter filament gives a whiter, more efficient light that does not fade as the lamp ages, since the glass stays clean.

### Variations
- **Low-voltage lamps** (12 V, 24 V). The filament for the same power is shorter and thicker, so it is smaller, sturdier and can be run hotter. The common reflector lamp, the **MR16**, is a 12 V capsule in a faceted reflector; the **dichroic** coating on it reflects visible light forward and lets the heat pass out of the back ([[dichroic-filters-and-mirrors]]).
- **Infrared-coated (IRC) capsules** carry a multilayer coating that passes light but reflects infrared back onto the filament, which keeps it hot with less power: about a third more light for the same power.
- **Linear lamps** (R7s) for floodlights, **car headlamp** bulbs (H4, H7) and photocopier fuser lamps.

> [!warn] Quartz passes ultraviolet unless it is doped to stop it, so a bare halogen capsule must sit behind a cover glass. Never touch the capsule with bare fingers: skin oil leaves a spot that overheats and can make the quartz crystallise and burst. Halogen lamps in careless fittings have started house fires.

### Where it went
Bright, cheap and perfectly coloured, the halogen lamp took over spotlights and floodlights, but its 14–25 lm/W loses to LED by a factor of six. European regulations have withdrawn most types in stages since 2016.

> [!key] A halogen lamp is a filament lamp whose halogen gas carries tungsten back from the hot capsule wall, so the filament can run at up to 3400 K with a clear bulb: whiter, more efficient and longer-lived than a standard lamp, and still about 90 % heat.
`,
  ideas: [
    'A halogen compound in the gas makes evaporated tungsten return to the filament instead of blackening the glass.',
    'The cycle needs a wall hotter than about 250 °C, hence a small quartz capsule at high pressure.',
    'The filament can run hotter, 2800–3400 K: whiter light, 14–25 lm/W and 2000–5000 hours.',
    'An infrared-reflecting coating returns heat to the filament and saves about a third of the power.',
    'Quartz transmits UV and the capsule runs very hot: use a cover glass and never touch the quartz.'
  ],
  pitfalls: [
    'The halogen is the source of the light — The light still comes from the glowing tungsten. The halogen gas only recycles the tungsten and keeps the bulb clean.',
    'The halogen cycle makes the filament last forever — It does not restore the filament to where the metal was lost. The lamp fails when the coil has thinned or become brittle; the cycle makes that take longer.',
    'A halogen lamp is a cool, efficient light — It is only moderately more efficient than a standard lamp. Its capsule surface runs at 250–600 °C, much hotter than an ordinary bulb.',
    'A halogen lamp can be dimmed as far as you like without harm — Dimmed deeply for long periods, the wall runs too cool for the halogen cycle and tungsten blackens the capsule. Running the lamp at full power for a while can clear a light deposit.'
  ],
  terms: [
    { term: 'Halogen cycle', def: 'The chemical cycle in which evaporated tungsten combines with a halogen near the hot wall, is carried back to the filament as a gas and is redeposited there, keeping the bulb clear.' },
    { term: 'Tungsten halide', also: ['tungsten bromide', 'tungsten iodide'], def: 'The volatile compound of tungsten with a halogen. It is stable as a gas near the 250 °C wall and decomposes on the white-hot filament.' },
    { term: 'Quartz envelope', also: ['fused silica', 'quartz glass', 'capsule'], def: 'The small bulb of a halogen lamp, made of fused silica that survives wall temperatures of several hundred degrees and holds a high fill pressure.' },
    { term: 'IR coating', also: ['IRC', 'hot-mirror coating'], def: 'A multilayer coating on the capsule that transmits visible light and reflects infrared radiation back onto the filament, increasing the efficacy.' },
    { term: 'Low-voltage halogen', also: ['12 V halogen', 'MR16'], def: 'A halogen lamp for 12 or 24 V, supplied through a transformer. Its filament is short and sturdy, and can be run hotter than that of a mains lamp.' }
  ],
  formulas: [
    {
      name: 'Power radiated by a grey filament',
      expr: 'P = eps*sigma*A*T^4', tex: 'P = \\varepsilon\\,\\sigma\\,A\\,T^4',
      vars: {
        P: { name: 'radiated power', q: 'power', unit: 'W' },
        eps: { name: 'emissivity of the tungsten', value: 0.33, min: 0.05, max: 1, tex: '\\varepsilon' },
        sigma: { const: 'sigma' },
        A: { name: 'area of the filament surface', q: 'area', unit: 'mm²', value: 33 },
        T: { name: 'temperature of the filament', q: 'temperature', unit: 'K', value: 3000, min: 1500, max: 3600 }
      },
      note: 'Tungsten radiates about a third as well as a black body at 3000 K. Heat lost by conduction is ignored.',
      stories: { P: 'A coil of {A} surface is held at {T}. How much power does it radiate?', A: 'A 12 V, 50 W capsule runs its filament at {T}. What surface area must the coil have?' }
    },
    {
      name: 'Power shed per area of wall',
      expr: 'q = P/A', tex: 'q = \\frac{P}{A}',
      vars: {
        q: { name: 'power per unit area of the wall', q: 'intensity', unit: 'W/cm²' },
        P: { name: 'lamp power', q: 'power', unit: 'W', value: 50 },
        A: { name: 'outer area of the capsule', q: 'area', unit: 'cm²', value: 4 }
      },
      note: 'A capsule is sized so that this loading holds the wall hot enough for the halogen cycle, but not so hot that the quartz suffers.'
    }
  ],
  examples: [
    {
      title: 'How big is a 50 W filament?',
      q: 'A 12 V, 50 W halogen capsule runs its filament at 3000 K. Taking the emissivity of tungsten as 0.33 and ignoring heat conduction, what surface area must the coil have?',
      steps: [
        { text: 'A black body at 3000 K radiates', tex: '\\sigma T^4 = 5.67\\times10^{-8}\\times 3000^4 = 4.59\\ \\mathrm{MW/m^2}' },
        { text: 'The grey tungsten radiates 0.33 of that, 1.52 MW/m². The area needed to radiate 50 W is', tex: 'A = \\frac{50\\ \\mathrm{W}}{1.52\\times10^6\\ \\mathrm{W/m^2}} = 3.3\\times10^{-5}\\ \\mathrm{m^2} = 33\\ \\mathrm{mm^2}' }
      ],
      a: 'About 33 mm² of filament surface, a coil perhaps 8 mm long. That is why the lamp is so small, and why its glass runs so hot.'
    },
    {
      title: 'Saving with a halogen "eco" lamp',
      q: 'A standard 40 W lamp gives about 400 lm. A halogen replacement of the same shape gives the same light for 28 W. Compare the efficacies and the saving.',
      steps: [
        'Standard lamp: 400 lm ÷ 40 W = 10 lm/W. Halogen: 400 lm ÷ 28 W = 14.3 lm/W.',
        'The halogen lamp uses 12 W less for the same light: a saving of 30 %.'
      ],
      a: '14.3 lm/W against 10 lm/W, a 30 % saving, from the hotter filament and the infrared coating. An LED giving the same 400 lm takes about 4 W.'
    }
  ],
  quiz: [
    { q: 'Why must a halogen capsule be small and made of quartz?', choices: ['Quartz is cheaper than glass', 'The wall must stay above about 250 °C for the cycle to work, and quartz stands that heat and the high pressure', 'Quartz makes the light whiter', 'The capsule must be small to fit in a spotlight'], a: 1, why: 'The tungsten halide only forms where the wall is hot. A small capsule close to the filament is heated enough, and only quartz or a hard glass survives it.' },
    { q: 'The halogen cycle repairs a thin spot on the filament.', a: false, why: 'Tungsten is returned to the filament, but mainly to its cooler parts. The cycle keeps the glass clear and slows the filament\'s decline; it does not restore the hot spot.' },
    { q: 'Skin oil left on a halogen capsule is a problem because…', choices: ['it makes the light yellow', 'it creates a hot spot that can crystallise the quartz and make it burst', 'it conducts electricity', 'it absorbs ultraviolet'], a: 1, why: 'The residue burns on the very hot wall, and the quartz around it devitrifies (crystallises), becomes weak and can fail. Handle with a clean cloth.' },
    { q: 'An IR-coated capsule gives about a third more light for the same power because…', choices: ['it makes the filament thicker', 'the coating reflects infrared back onto the filament, which keeps it hot with less electrical power', 'it adds a second filament', 'it blocks the ultraviolet'], a: 1, why: 'The infrared that would be lost is returned to the filament, so less electrical power is needed to hold the temperature. The visible light passes through the coating.' },
    { q: 'A halogen filament runs at 3000 K and a standard lamp\'s at 2700 K. Which has the larger share of its radiation in the visible range?', choices: ['The standard lamp', 'The halogen lamp, about 13 % against 8 %', 'They are equal', 'Neither: the visible share does not depend on temperature'], a: 1, why: 'Raising T moves the Planck peak towards the visible range: 8 % visible at 2700 K, 13 % at 3000 K, 19 % at 3400 K.' }
  ],
  applications: [
    'Spot and flood lighting, both mains and 12 V, where perfect colour and beam control mattered.',
    'Car headlamp bulbs (the H-series), where a small, bright, hot source is a good match for a reflector.',
    'Microscope illuminators, slide and film projectors and photographic lamps.',
    'Linear lamps in floodlights and in photocopier fusers and radiant cooktops, where the infrared is wanted.',
    'Studio and stage lighting, in the days before LED fixtures.'
  ],
  history: 'The tungsten–halogen lamp was developed at General Electric in the second half of the 1950s and announced in 1959, first with iodine; bromine later replaced it because iodine vapour is coloured and absorbs part of the light. Quartz–halogen lamps were quickly taken up for aircraft landing lights and film lighting, where small size and constant output mattered most.',
  sources: [
    'R. Kane and H. Sell, *Revolution in Lamps: A Chronicle of 50 Years of Progress* (Fairmont Press) — the halogen cycle and the development of the capsule lamp.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — halogen lamps and their coatings.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — tungsten–halogen lamp characteristics.'
  ],
  sim: [{ id: 'la-halogen-cycle', params: {} }, { id: 'la-spectrum', params: { lamp: 'halogen', range: 'wide' } }]
},

/* ================================================================ fluorescent lamps */
{
  id: 'fluorescent-lamps', parent: 'lamp-families', title: 'Fluorescent lamps', level: 1,
  short: 'A glass tube with a trace of mercury vapour and two electrodes. The discharge makes ultraviolet light at 254 nm, and a phosphor coating on the wall turns it into visible light. Three to five times as efficient as a filament lamp, with 10 000 to 30 000 hours of life, but it needs a ballast and contains mercury.',
  keywords: ['fluorescent lamp', 'fluorescent tube', 'CFL', 'compact fluorescent', 'T8', 'T5', 'T12', 'ballast', 'starter', 'phosphor', 'triphosphor', 'mercury', '254 nm', 'low-pressure mercury', 'G13', 'G5'],
  prereq: ['how-light-is-made', 'photon-energy'],
  related: ['lamp-bases-and-bulb-shapes', 'lamp-efficacy-and-lifetime', 'drivers-dimming-and-flicker', 'colour-temperature-and-colour-rendering', 'uv-and-infrared-sources', 'high-intensity-discharge-lamps', 'white-leds', 'physics:photon'],
  body: `
A **fluorescent lamp** is two lamps in series. The first is a low-pressure discharge in mercury vapour, which turns electrical energy into ultraviolet light; the second is a layer of **phosphor** on the inside of the tube, which turns the ultraviolet into visible light. The simulation shows both steps.

### How it works
The tube holds argon at about 300 Pa and a few milligrams of mercury, which at the working temperature of about 40 °C gives a vapour pressure near 1 Pa. A current of electrons runs between two **hot cathodes**, coiled tungsten wire coated with an oxide that emits electrons freely. Electrons that hit mercury atoms lift them to an excited level; each atom falls back and radiates, and about 60 % of the electrical power comes out in a line at **254 nm** (with a little at 185 nm). That is ultraviolet-C, and the glass stops it.

### The phosphor does the rest
Each 254 nm photon carries 4.9 eV; a visible photon only about 2.2 eV, so even a perfect phosphor keeps 254/550 = 46 % of the energy, and the real one wastes about a tenth of the photons. About a quarter of the electrical power ends up as light:
$$K = f\\,\\mathrm{LER} \\approx 0.25 \\times 356 \\approx 90\\ \\mathrm{lm/W}$$
The kind of phosphor sets the colour:

| Phosphor | Spectrum | Ra | Efficacy of a tube |
|---|---|---|---|
| Halophosphate (old "cool white") | broad, two humps | 50–70 | 60–70 lm/W |
| Triphosphor | three narrow bands near 450, 545 and 610 nm | 80–90 | 90–105 lm/W |
| Multiband "deluxe" | five or more bands | 90–98 | 60–80 lm/W |

The three bands of a triphosphor are placed where the eye's three colour receptors are most sensitive, so a lamp with a spectrum that is mostly gaps still renders colours acceptably, while making the most lumens out of every photon.

### The ballast
A discharge conducts better as the current rises, so connected straight to the mains it would run away and destroy itself. A **ballast** limits the current: a choke (an inductor) with a **starter** that preheats the cathodes, or an electronic circuit that runs the lamp at 20–50 kHz and gives about 10 % more light for the same power and no 100 or 120 Hz flicker ([[drivers-dimming-and-flicker]]).

### The tubes
The T number is the diameter in eighths of an inch: **T5** is 5/8" = 16 mm (G5 base), **T8** 26 mm and **T12** 38 mm (G13 base) — see [[lamp-bases-and-bulb-shapes]]. A **compact fluorescent lamp** (CFL) folds a narrow tube into a spiral or a set of U-bends and puts the ballast in the base; at 45–75 lm/W it is a little less efficient than a straight tube.

### Behaviour and ageing
A tube is brightest near 25 °C (T8) or 35 °C (T5) ambient; in the cold the mercury vapour pressure falls and the light with it. Every start sputters away a little of the cathode coating, and when it is gone the lamp will no longer light: the ends blacken and the life is spent. Light output falls by 5–15 % over the rated life.

> [!warn] A fluorescent tube holds a few milligrams of mercury (1.4 to 5 mg in modern types). If one breaks, ventilate the room, collect the pieces with care and take them to a hazardous-waste collection. Mercury regulations are retiring the lamp from general lighting by the end of the 2020s.

> [!key] A fluorescent lamp is a mercury discharge that makes 254 nm ultraviolet and a phosphor that turns it into visible light: about a quarter of the power as light, 60–105 lm/W, a ballast to limit the current, mercury inside.
`,
  ideas: [
    'A low-pressure mercury discharge converts about 60 % of the electrical power to 254 nm ultraviolet; the phosphor converts it to visible light.',
    'The conversion loses over half the photon energy (254 to 550 nm), so only about a quarter of the electrical power becomes light: 60–105 lm/W.',
    'The phosphor chooses the colour and the colour rendering: triphosphors use three narrow bands, halophosphates two broad ones.',
    'A ballast is essential because a discharge has falling resistance; electronic ballasts add efficacy and remove the flicker.',
    'The T-number is the tube diameter in eighths of an inch; the cathode coating wears off with starts and decides the life.'
  ],
  pitfalls: [
    'T8 means a tube eight millimetres wide — The number is in eighths of an inch: T8 is 8/8 = 1 inch (26 mm), T5 is 5/8 inch (16 mm), T12 is 1½ inch (38 mm).',
    'Mercury is what makes the light white — Mercury makes the ultraviolet (and a few weak visible lines). The white comes from the phosphor; without it the tube gives almost no light you can see.',
    'The ultraviolet makes it dangerous to sit under a fluorescent tube — The glass and the phosphor absorb nearly all the 254 nm light. An intact tube gives out only traces of UV-A. A broken or uncovered discharge tube is another matter.',
    'It is best to leave fluorescent lights on to save them — A start costs the energy of seconds of burning and a little cathode life. For a break of more than a few minutes, switching off saves more than it costs.'
  ],
  terms: [
    { term: 'Phosphor', def: 'A powder, coated on the wall of a fluorescent tube or over a blue LED, that absorbs light of short wavelength and re-emits it at longer wavelengths. The energy difference is lost as heat.' },
    { term: 'Triphosphor', also: ['tri-band', 'three-band phosphor'], def: 'A blend of three phosphors emitting in narrow bands near 450, 545 and 610 nm. It gives good efficacy and a colour rendering index of 80 to 90.' },
    { term: 'Ballast', also: ['control gear'], def: 'The device that limits the current of a discharge lamp. Magnetic ballasts are chokes working at mains frequency; electronic ballasts run the lamp at 20 to 50 kHz.' },
    { term: 'Starter', def: 'A small glow switch that, with a magnetic ballast, first passes current through the cathodes to preheat them and then breaks the circuit so that the choke kicks the voltage up to strike the lamp.' },
    { term: 'T-number', also: ['T5', 'T8', 'T12'], def: 'The diameter of a tubular lamp in eighths of an inch: T5 = 16 mm, T8 = 26 mm, T12 = 38 mm.' },
    { term: 'Compact fluorescent lamp', also: ['CFL', 'energy-saving lamp'], def: 'A fluorescent tube bent into a spiral or U-shapes, with its ballast built into the cap, made to replace a filament lamp in an ordinary holder.' },
    { term: 'Hot cathode', def: 'A coiled tungsten electrode coated with an emissive oxide and heated so that it releases electrons easily. Its coating wears off, which ends the life of the lamp.' }
  ],
  formulas: [
    {
      name: 'Efficacy from the visible fraction',
      expr: 'K = f*LER', tex: 'K = f\\,\\mathrm{LER}',
      vars: {
        K: { name: 'efficacy of the lamp', q: 'efficacy', unit: 'lm/W' },
        f: { name: 'fraction of the electrical power that becomes visible radiation', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 },
        LER: { name: 'luminous efficacy of that radiation', q: 'efficacy', unit: 'lm/W', value: 356, tex: '\\mathrm{LER}' }
      },
      note: 'Lamp alone, without the ballast. The same relation holds for every lamp: wall-plug efficiency times luminous efficacy of the radiation.',
      stories: { K: 'A tube turns {f} of its power into light whose luminous efficacy is {LER}. What is its efficacy?', f: 'A lamp whose light has an efficacy of {LER} reaches {K}. What fraction of its power is visible radiation?' }
    },
    {
      name: 'Energy kept in the conversion of a photon',
      expr: 'eta = lam1/lam2', tex: '\\eta = \\frac{\\lambda_1}{\\lambda_2}',
      vars: {
        eta: { name: 'fraction of the photon energy that is kept', q: 'ratio', unit: '%', tex: '\\eta' },
        lam1: { name: 'wavelength absorbed', q: 'length', unit: 'nm', value: 254, tex: '\\lambda_1' },
        lam2: { name: 'wavelength emitted', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_2' }
      },
      note: 'One photon in, one photon out: the energy kept is the ratio of the photon energies, which is the ratio of the wavelengths. This Stokes loss is unavoidable; the white LED has it too.'
    }
  ],
  examples: [
    {
      title: 'Where does the power of a tube go?',
      q: 'A 36 W T8 tube gives 3350 lm. What is its efficacy as a lamp, and what is it for a luminaire whose magnetic ballast takes another 8 W?',
      steps: [
        { text: 'The lamp alone:', tex: 'K = \\frac{3350\\ \\mathrm{lm}}{36\\ \\mathrm{W}} = 93\\ \\mathrm{lm/W}' },
        { text: 'The luminaire takes 36 + 8 = 44 W:', tex: 'K_{\\mathrm{system}} = \\frac{3350\\ \\mathrm{lm}}{44\\ \\mathrm{W}} = 76\\ \\mathrm{lm/W}' }
      ],
      a: '93 lm/W for the tube, 76 lm/W with its ballast: the control gear is a fifth of the bill, and an electronic ballast cuts it to a few watts.'
    },
    {
      title: 'The budget of a triphosphor lamp',
      q: 'Suppose 60 % of the electrical power becomes 254 nm light, the phosphor keeps 90 % of the photons and emits at an average of 550 nm. What fraction of the power is visible, and what is the efficacy if the luminous efficacy of the radiation is 356 lm/W?',
      steps: [
        { text: 'Each photon keeps 254/550 = 46 % of its energy, so', tex: 'f = 0.60 \\times 0.90 \\times 0.46 = 0.25' },
        { text: 'The lamp\'s efficacy is', tex: 'K = 0.25 \\times 356\\ \\mathrm{lm/W} = 89\\ \\mathrm{lm/W}' }
      ],
      a: '25 % of the power is light and the efficacy is about 89 lm/W: the range of real tubes. The other 75 % is heat, split between the conversion loss and the discharge.'
    }
  ],
  quiz: [
    { q: 'In a fluorescent tube, what produces the visible light?', choices: ['The mercury vapour, directly', 'The phosphor on the wall, excited by 254 nm ultraviolet from the mercury', 'The glowing electrodes', 'The argon gas'], a: 1, why: 'The mercury discharge makes ultraviolet at 254 nm, which we cannot see. The phosphor absorbs it and emits visible light of longer wavelength.' },
    { q: 'A discharge lamp needs a ballast because the discharge…', choices: ['is too bright', 'conducts better as the current rises, so the current would run away', 'cannot work at mains frequency', 'would otherwise be blue'], a: 1, why: 'The discharge has a falling voltage–current characteristic: more current makes more ions and less resistance. The ballast limits the current to the design value.' },
    { q: 'A T8 tube has a diameter of 8 mm.', a: false, why: 'T8 means 8/8 inch: 25.4 mm. T5 is 5/8 inch (16 mm) and T12 is 12/8 inch (38 mm).' },
    { q: 'A phosphor converts 254 nm photons into photons of 550 nm. What percentage of the photon energy is kept?', answer: 46, unit: '%', why: 'The energy of a photon is inversely proportional to wavelength: 254/550 = 0.46. The other 54 % becomes heat in the phosphor.' },
    { q: 'Why is a "triphosphor" lamp both efficient and acceptable for colour?', choices: ['It contains three tubes', 'Its three narrow bands lie where the eye\'s colour receptors are most sensitive, so few photons are wasted and colours still look right', 'It is dimmer than other lamps', 'It emits ultraviolet as well'], a: 1, why: 'Narrow bands near 450, 545 and 610 nm drive the three kinds of cone strongly with little light in the less useful parts of the spectrum.' }
  ],
  applications: [
    'Office, school, shop and factory lighting from the 1940s until LED tubes took over.',
    'Compact fluorescent lamps as the first mass-market replacement for filament lamps.',
    'Backlights of LCD screens and scanners (cold-cathode fluorescent lamps) before LED backlights.',
    'Black-light lamps and tanning lamps, which use a different phosphor to make ultraviolet-A or -B.',
    'Plant-growth and aquarium lighting, with phosphors chosen for the colours plants and fish need.'
  ],
  history: 'Edmond Becquerel experimented with fluorescent tubes in the 1850s, and Peter Cooper Hewitt\'s mercury-vapour lamp of 1901 was an efficient but blue-green lamp. General Electric and Westinghouse brought the fluorescent lamp with phosphor coating to the market in the United States in 1938. The compact fluorescent lamp was first made at General Electric in 1976 and sold widely from the 1980s.',
  sources: [
    'J. F. Waymouth, *Electric Discharge Lamps* (MIT Press, 1971) — the physics of the low-pressure mercury discharge and its phosphors.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — the chapter on fluorescent lamps and ballasts.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — characteristics of tubular and compact fluorescent lamps.',
    'IEC 60081 and IEC 60901, double-capped and single-capped fluorescent lamps — dimensions and performance requirements.'
  ],
  sim: [{ id: 'la-tube', params: {} }, { id: 'la-spectrum', params: { lamp: 'fluorescent' } }]
},

/* ================================================================ high-intensity discharge lamps */
{
  id: 'high-intensity-discharge-lamps', parent: 'lamp-families', title: 'High-intensity discharge lamps', level: 2,
  short: 'Lamps in which an electric arc burns in a small, hot tube at a pressure of several atmospheres or more: mercury, metal halide, high-pressure sodium. They give 70–140 lm/W from a compact source, take minutes to reach full light, and cannot be restarted at once when hot.',
  keywords: ['HID', 'high-intensity discharge', 'metal halide', 'mercury vapour lamp', 'arc tube', 'ceramic metal halide', 'CMH', 'ignitor', 'warm-up', 'hot restrike', 'ballast', 'HMI', 'xenon headlamp', 'stadium lighting'],
  prereq: ['fluorescent-lamps', 'how-light-is-made'],
  related: ['sodium-lamps', 'xenon-arc-and-flash-lamps', 'lamp-efficacy-and-lifetime', 'colour-temperature-and-colour-rendering', 'car-headlamps-and-driver-cameras', 'cinema-and-stage-lighting-systems', 'projector-illumination', 'uv-and-infrared-sources'],
  body: `
Make a fluorescent tube a hundred times shorter and raise the pressure inside a hundred thousand times and you have the idea of the **high-intensity discharge** (HID) lamp. The arc burns in a small tube of quartz or ceramic, about a centimetre across, hot enough (900–1200 °C at the wall) to vaporise metals, and the gas is at several atmospheres or more. A very small source gives a great deal of light.

### Mercury, then metal halide
- **High-pressure mercury** lamps give a bluish-green light of lines at 405, 436, 546 and 578 nm, 35–60 lm/W and a poor colour rendering (Ra 15–55); a phosphor on the outer bulb adds red. They are largely retired.
- **Metal halide** lamps add salts — iodides of sodium, scandium, thallium, dysprosium and others — to the mercury. At arc temperature the salts evaporate and their atoms add their own lines; the iodine keeps the reactive metals from attacking the tube. The result is a near-white spectrum of many lines: 70–115 lm/W, 3000–6000 K, Ra 65–95.
- **Ceramic metal halide** lamps use an arc tube of polycrystalline alumina, which stands more heat, gives more consistent colour from lamp to lamp and renders colours better (Ra above 90 in some types).
- **High-pressure sodium** lamps are described in [[sodium-lamps]].

| Lamp | Efficacy | Colour temperature | Ra | Run-up |
|---|---|---|---|---|
| Mercury | 35–60 lm/W | 3500–6000 K | 15–55 | 4–7 min |
| Metal halide | 70–115 lm/W | 3000–6000 K | 65–95 | 2–5 min |
| High-pressure sodium | 80–140 lm/W | 1900–2200 K | 20–25 | 3–5 min |

Sizes run from 35 W (a car headlamp, 3200 lm) through 70–400 W for shops and streets (400 W gives about 36 000 lm) to 2000 W for stadiums.

### Ballast, ignitor and warm-up
Like all discharge lamps, an HID lamp needs a **ballast** to limit the current and an **ignitor**, with pulses of 1 to 5 kV, to break down the cold gas. Then comes the **run-up**. At first only the starting gas and the mercury glow, a dim bluish light; over two to five minutes the arc tube heats, the metal salts vaporise, the pressure rises and the lamp reaches full light and its true colour (see the simulation).

### Hot restrike
If the supply is interrupted, the arc goes out. The tube is still hot and its pressure so high that an ordinary ignitor pulse cannot break the gas down. The lamp stays dark until it has cooled: typically 10–20 minutes for a standard metal halide lamp, 3–6 for mercury, 1–2 for sodium. Special lamps and ignitors of 20–40 kV allow a hot restrike, and stadiums keep part of the lighting on a quick-start source.

> [!warn] An HID arc tube can burst at the end of its life. Use the enclosed luminaires the lamp is rated for. A metal halide lamp whose outer bulb is broken goes on burning and emits ultraviolet-B and -C that burns skin and eyes within minutes; switch it off at once, and let it cool before touching it. Relamp only with the supply off, and treat mercury lamps as hazardous waste.

### Where they went
Floodlights, high bays and street lighting have gone to LED: no run-up, no hot restrike, 130–200 lm/W. HID survives where a tiny, very bright source is needed: projector lamps (200 bar, an arc a millimetre long), film-lighting lamps at 5600 K, car "xenon" headlamps.

> [!key] An HID lamp is a high-pressure arc in a small hot tube: mercury lines plus metal-halide salts give 70–115 lm/W of near-white light from a compact source, but it needs a ballast and ignitor, minutes to warm up, and many minutes to restrike when hot.
`,
  ideas: [
    'An HID lamp holds an arc in a small quartz or ceramic tube at several atmospheres and 900–1200 °C at the wall.',
    'Metal halide lamps add salts to the mercury so that many lines fill the spectrum: 70–115 lm/W and Ra up to 95.',
    'Warm-up takes minutes: the light and the colour mature as the salts evaporate.',
    'A hot lamp will not restrike on an ordinary ignitor: the gas pressure is too high until the tube cools.',
    'Arc tubes can burst, and a lamp with a broken outer bulb emits harmful UV: use enclosed luminaires.'
  ],
  pitfalls: [
    'A metal halide lamp has a fixed colour — The colour changes during warm-up and varies from lamp to lamp and over the life as the salts are used up. Ceramic arc tubes reduce the spread but do not remove it.',
    'A flicker of the mains is harmless because the lamp restarts at once — A momentary interruption extinguishes the arc, and the hot lamp then stays dark for minutes. That is why important areas need standby lighting.',
    '"Xenon" headlamps are xenon lamps — They are metal halide lamps with a xenon fill that gives some light at the instant of switch-on. The main light comes from mercury (or its replacement) and salts.',
    'A bigger lamp is just a brighter version of a small one — Bigger lamps run at different pressures and temperatures, so efficacy, colour and run-up all differ from one wattage to another.'
  ],
  terms: [
    { term: 'High-intensity discharge lamp', also: ['HID lamp'], def: 'A lamp whose light comes from an arc in a small tube at high pressure and temperature: mercury, metal halide, high-pressure sodium and some xenon lamps.' },
    { term: 'Arc tube', def: 'The small tube of fused quartz or translucent ceramic, a few centimetres long, in which the arc of an HID lamp burns. It is enclosed in an outer bulb.' },
    { term: 'Metal halide', def: 'A compound of a metal and a halogen (usually an iodide) added to a mercury arc. It evaporates at arc temperature and supplies the metal atoms whose lines fill out the spectrum.' },
    { term: 'Ignitor', also: ['igniter', 'starter pulse generator'], def: 'An electronic circuit that gives voltage pulses of kilovolts to break down the cold gas and start the arc of a discharge lamp.' },
    { term: 'Run-up', also: ['warm-up'], def: 'The minutes after striking during which an HID lamp heats up and its light output and colour rise to their steady values.' },
    { term: 'Hot restrike', def: 'Lighting an HID lamp again while its arc tube is still hot. Most lamps cannot do it for several minutes because the high gas pressure resists breakdown; special lamps and ignitors can.' }
  ],
  formulas: [
    {
      name: 'Run-up of the light output',
      expr: 'Phi = P0 + (P1 - P0)*(1 - exp(-t/tau))', tex: '\\Phi = \\Phi_0 + (\\Phi_1 - \\Phi_0)\\left(1 - e^{-t/\\tau}\\right)',
      vars: {
        Phi: { name: 'light output at time t', q: 'ratio', unit: '%', tex: '\\Phi' },
        P0: { name: 'light output just after striking', q: 'ratio', unit: '%', value: 15, tex: '\\Phi_0' },
        P1: { name: 'full light output', q: 'ratio', unit: '%', value: 100, tex: '\\Phi_1' },
        t: { name: 'time since striking', q: 'time', unit: 'min', value: 2, min: 0 },
        tau: { name: 'run-up time constant', q: 'time', unit: 'min', value: 1.6, tex: '\\tau' }
      },
      note: 'A simple model: the arc tube warms exponentially. The light reaches 90 % at t = τ ln[(1 − Φ₀)/0.1].',
      stories: { Phi: 'A metal halide lamp starts at {P0} of full output and warms with a time constant of {tau}. What is its output {t} after striking?' }
    },
    {
      name: 'Efficacy of the whole luminaire',
      expr: 'K = Phi/(P + Pb)', tex: 'K = \\frac{\\Phi}{P + P_b}',
      vars: {
        K: { name: 'system efficacy', q: 'efficacy', unit: 'lm/W' },
        Phi: { name: 'luminous flux of the lamp', q: 'luminousflux', unit: 'lm', value: 36000, tex: '\\Phi' },
        P: { name: 'lamp power', q: 'power', unit: 'W', value: 400 },
        Pb: { name: 'power lost in the ballast', q: 'power', unit: 'W', value: 40, tex: 'P_b' }
      },
      note: 'Ballast losses of an HID lamp are typically 10 to 15 % of the lamp power.'
    }
  ],
  examples: [
    {
      title: 'How bright is it after two minutes?',
      q: 'A metal halide lamp starts at 15 % of full output and warms with a time constant of 1.6 minutes. How much light does it give after 2 minutes, and when does it reach 90 %?',
      steps: [
        { text: 'After 2 minutes:', tex: '\\Phi = 15 + 85\\left(1 - e^{-2/1.6}\\right) = 15 + 85 \\times 0.713 = 75.6\\ \\%' },
        { text: 'For 90 %: $1 - e^{-t/\\tau} = (90 - 15)/85 = 0.882$, so', tex: 't = \\tau \\ln\\frac{85}{10} = 1.6 \\times 2.14 = 3.4\\ \\mathrm{min}' }
      ],
      a: 'About 76 % of the light after 2 minutes, and 90 % after 3.4 minutes.'
    },
    {
      title: 'Lamp or system?',
      q: 'A 400 W metal halide lamp gives 36 000 lm and its ballast takes 40 W. What are the efficacy of the lamp and of the luminaire?',
      steps: [
        { text: 'Lamp: 36 000 lm ÷ 400 W = 90 lm/W. Luminaire:', tex: 'K = \\frac{36\\,000\\ \\mathrm{lm}}{400 + 40\\ \\mathrm{W}} = 82\\ \\mathrm{lm/W}' }
      ],
      a: '90 lm/W for the lamp and 82 lm/W for the system: the ballast costs a tenth. A LED high-bay fitting of the same light takes about 200 W.'
    }
  ],
  quiz: [
    { q: 'Why does a hot metal halide lamp stay dark for minutes after a brief power cut?', choices: ['The bulb has to cool before it can glow again', 'The hot arc tube is at such a high pressure that the ignitor\'s pulses cannot break down the gas until it has cooled', 'The ballast needs to recharge', 'The salts are all used up'], a: 1, why: 'Breakdown voltage rises with gas pressure. A hot arc tube is far beyond what an ordinary ignitor gives, so the lamp must cool first (or have a special ignitor).' },
    { q: 'Why does the colour of a metal halide lamp change during warm-up?', choices: ['The glass colours change with temperature', 'At first only the mercury glows; the metal salts vaporise as the tube heats and add their lines', 'The ballast changes the frequency', 'Dust burns off the bulb'], a: 1, why: 'Cold, the arc is mercury and starting gas, a bluish light. As the cold spot warms, salts evaporate and their atoms radiate, filling the spectrum.' },
    { q: 'A metal halide lamp with a broken outer bulb can safely go on burning until the end of the working day.', a: false, why: 'The outer bulb absorbs the ultraviolet of the arc. Without it the lamp emits UV-B and UV-C that burns skin and eyes within minutes. Switch it off.' },
    { q: 'A 400 W metal halide lamp gives 36 000 lm and its ballast takes 40 W. What is the efficacy of the whole luminaire, in lm/W?', answer: 81.8, unit: 'lm/W', why: 'K = 36 000 ÷ (400 + 40) = 81.8 lm/W; the lamp alone is 90 lm/W.' },
    { q: 'What is the role of the iodine in a metal halide lamp?', choices: ['It makes the light blue', 'It carries metals that would attack the arc tube as harmless salts, which release the metal in the hot arc', 'It cools the arc', 'It starts the discharge'], a: 1, why: 'The metals (sodium, scandium, dysprosium …) are added as iodides, which are volatile and gentle on the quartz; the arc splits them and the metal atoms radiate.' }
  ],
  applications: [
    'Sports halls and stadiums, where a 1000–2000 W metal halide lamp lit large areas until LED floodlights replaced it.',
    'Projector lamps of 100–350 W with an arc a millimetre long, at a pressure of 200 bar and more, to feed a small optical system.',
    'Film and stage lighting: metal halide lamps of daylight colour at 5600 K (often called HMI lamps).',
    'Automotive "xenon" headlamps of 35 W, 3200 lm, in front of a lens and a cut-off shield.',
    'Horticulture: metal halide lamps for the vegetative stage and high-pressure sodium for flowering, before LED grow lights.'
  ],
  history: 'The high-pressure mercury lamp was developed in the 1930s and was in street use by the end of that decade. Metal halide lamps were invented by Gilbert Reiling of General Electric in the mid-1960s, who found that iodides of sodium and scandium turn the mercury arc from a bluish line source into a white lamp. Ceramic arc tubes came in the 1990s.',
  sources: [
    'J. F. Waymouth, *Electric Discharge Lamps* (MIT Press, 1971) — the high-pressure discharge, the arc column and the role of additives.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — HID lamps, ballasts and ignitors.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — characteristics of mercury, metal halide and sodium lamps.'
  ],
  sim: [{ id: 'la-hid-runup', params: {} }]
},

/* ================================================================ sodium lamps */
{
  id: 'sodium-lamps', parent: 'lamp-families', title: 'Sodium lamps', level: 2,
  short: 'The golden street lights. The low-pressure sodium lamp puts nearly all its light into one yellow line at 589 nm and reaches 100 to 180 lm/W but shows no colours at all; the high-pressure sodium lamp broadens the line into a gold-white band, with 80 to 140 lm/W and poor colour rendering.',
  keywords: ['sodium lamp', 'low-pressure sodium', 'LPS', 'high-pressure sodium', 'HPS', '589 nm', 'sodium D lines', 'street lighting', 'monochromatic', 'orange', 'polycrystalline alumina'],
  prereq: ['high-intensity-discharge-lamps', 'how-light-is-made'],
  related: ['lamp-efficacy-and-lifetime', 'colour-temperature-and-colour-rendering', 'the-luminosity-function', 'light-emitting-diodes', 'daylight-and-skylight', 'chemistry:atomic-spectra'],
  body: `
For half a century the world's streets were lit in gold. **Sodium lamps** owe their colour to one of the most familiar lines in physics: sodium vapour glows at **589.0 and 589.6 nm**, the yellow "D lines". The eye's sensitivity at 589 nm is 77 % of its peak, so a lamp that puts nearly all its power into that line is almost as efficient as a light source can be.

### Low-pressure sodium
A U-shaped glass tube about a metre long holds sodium metal, with a starting mixture of neon and argon at low pressure, inside a vacuum jacket coated with an infrared-reflecting layer. The jacket keeps the arc tube wall at about 260 °C, where sodium has a vapour pressure of about 1 Pa. At switch-on the neon glows red-pink; over 7 to 15 minutes the sodium evaporates and the light turns the full yellow.

About 35–40 % of the electrical power comes out as 589 nm light, and a lamp of 180 W gives about 33 000 lm: **183 lm/W**, the highest efficacy of any lamp that has been in general use. But:

- all of the light is one wavelength, so **colour rendering is nil**: a red rose, a green car and a blue coat are all shades of yellow-grey or black;
- the lamp is long, so its light is hard to control, and it gives little at the ends.

### High-pressure sodium
Raise the sodium pressure to tens of kilopascals, tens of thousands of times higher, and the line broadens and flips: the dense, cooler vapour at the edge of the arc absorbs the centre of the line (self-reversal), leaving a broad gold-pink band either side of 589 nm. The tube is only a few centimetres long and made of translucent polycrystalline alumina, because sodium attacks quartz at 1100 °C. The numbers: 80–140 lm/W, 1900–2200 K, Ra of only 20–25, life of 16 000 to 30 000 hours, run-up of 3–5 minutes. A "white" HPS lamp at 2500 K reaches Ra 80, at a third of the efficacy.

| | Low-pressure | High-pressure |
|---|---|---|
| Spectrum | the 589 nm doublet | a gold band, 520–700 nm, dip at 589 |
| Efficacy | 100–180 lm/W | 80–140 lm/W |
| Ra | 0 (single colour) | 20–25 |
| Size | 1 m long U tube | a few cm of arc, a small bulb |
| Run-up | 7–15 min | 3–5 min |

### Why they were chosen, and why they are going
Sodium lamps were the cheapest way to light a road: a tenth of the energy of a filament lamp. The price was colour. Under a low-pressure sodium lamp the colour of a car or a coat cannot be told, one reason why many cities moved to high-pressure sodium. Near observatories the single line is a gift: it is easily filtered, which is why some sites in Arizona and the Canary Islands lit their roads with it. Now both are being replaced by LED, including narrow-band amber LEDs near 590 nm where the sky or wildlife must be protected.

> [!warn] Sodium metal burns in contact with water. A broken low-pressure sodium lamp must be handled and disposed of as the maker instructs, and kept dry. High-pressure lamps contain mercury and run at high voltage and temperature.

> [!key] Sodium lamps are discharges in sodium vapour: at low pressure one line at 589 nm gives 100–180 lm/W and no colour; at high pressure the line is broadened to a gold band at 80–140 lm/W and Ra of about 20.
`,
  ideas: [
    'Sodium emits the 589.0/589.6 nm doublet, near the peak of the eye\'s sensitivity: V = 0.77.',
    'A low-pressure sodium lamp gives up to about 180 lm/W, the highest of any common lamp, with a single colour and Ra = 0.',
    'The tube wall must stay near 260 °C, so the tube sits in a vacuum jacket; run-up takes 7–15 minutes.',
    'Raising the pressure broadens and self-reverses the line: high-pressure sodium is gold-white with Ra of 20 and an alumina arc tube.',
    'A monochromatic light makes colours impossible to tell apart, whatever its efficiency.'
  ],
  pitfalls: [
    'A more efficient lamp always gives better light — A sodium lamp is the most efficient and gives no colour at all. Efficacy counts lumens; it says nothing about how well the lumens show colours.',
    'Under sodium light a red object looks red but dim — A red surface reflects red and orange light; the lamp makes none. The surface looks dark grey or black. Only colours that reflect 589 nm show up, as yellow-grey.',
    'High-pressure sodium is just a stronger low-pressure lamp — It is a different discharge: much denser vapour, a different tube material and a broadened, reversed line. It looks gold, not yellow.',
    'Sodium lamps are yellow because of their glass — The colour is the atomic emission itself. The glass is clear.'
  ],
  terms: [
    { term: 'Sodium D lines', also: ['589 nm doublet'], def: 'The pair of yellow emission lines of sodium atoms, at 589.0 and 589.6 nm. They give low-pressure sodium lamps their single colour.' },
    { term: 'Low-pressure sodium lamp', also: ['LPS'], def: 'A discharge lamp in sodium vapour at about 1 Pa that radiates almost only the 589 nm doublet. Very high efficacy, no colour rendering.' },
    { term: 'High-pressure sodium lamp', also: ['HPS'], def: 'A discharge lamp with sodium vapour at tens of kilopascals in a translucent alumina tube. The broadened emission is gold-white; efficacy 80–140 lm/W, Ra about 20.' },
    { term: 'Self-reversal', def: 'The dip in the middle of a spectral line that occurs when the dense, cooler vapour at the edge of an arc absorbs the line emitted by the hot core. It is clearly seen in high-pressure sodium lamps at 589 nm.' },
    { term: 'Monochromatic light', def: 'Light of a single wavelength (in practice a very narrow band). Under it all surfaces differ only in brightness, never in colour.' }
  ],
  formulas: [
    {
      name: 'Lumens from a monochromatic source',
      expr: 'Phi = Km*V*P', tex: '\\Phi = K_m\\,V\\,P',
      vars: {
        Phi: { name: 'luminous flux', q: 'luminousflux', unit: 'lm', tex: '\\Phi' },
        Km: { const: 'Km' },
        V: { name: 'eye sensitivity at the wavelength, relative to its peak', value: 0.765, min: 0, max: 1, tex: 'V' },
        P: { name: 'optical power', q: 'power', unit: 'W', value: 1 }
      },
      note: 'V(λ) is 1 at 555 nm, 0.77 at 589 nm, 0.107 at 650 nm. 683 lm per watt is the most any light can give.',
      stories: { Phi: 'A lamp radiates {P} of light at a wavelength where the eye\'s relative sensitivity is {V}. How many lumens is that?' }
    },
    {
      name: 'Efficacy of a monochromatic lamp',
      expr: 'K = eta*Km*V', tex: 'K = \\eta\\,K_m\\,V',
      vars: {
        K: { name: 'efficacy of the lamp', q: 'efficacy', unit: 'lm/W' },
        eta: { name: 'fraction of the electrical power radiated as that light', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: '\\eta' },
        Km: { const: 'Km' },
        V: { name: 'eye sensitivity at the wavelength', value: 0.765, min: 0, max: 1, tex: 'V' }
      },
      note: 'Electrical efficiency times the efficacy of the radiation. A sodium lamp has η near 0.4 and V = 0.77.'
    }
  ],
  examples: [
    {
      title: 'The efficacy of one colour',
      q: 'Find the luminous efficacy of radiation at 555 nm, at 589 nm and at 650 nm, given the eye sensitivities V = 1, 0.765 and 0.107.',
      steps: [
        { text: 'Multiply each V by 683 lm/W:', tex: 'K(555) = 683\\qquad K(589) = 0.765\\times 683 = 523\\qquad K(650) = 0.107\\times 683 = 73\\ \\mathrm{lm/W}' }
      ],
      a: '683, 523 and 73 lm/W. A red LED at 650 nm needs seven times the power of a green source at 555 nm for the same lumens, which is why red lights are never rated in lumens alone.'
    },
    {
      title: 'A street lamp',
      q: 'A 180 W low-pressure sodium lamp gives 33 000 lm. What is its efficacy, and what fraction of its power must be radiated as 589 nm light, taking V = 0.765?',
      steps: [
        { text: 'Efficacy:', tex: 'K = \\frac{33\\,000}{180} = 183\\ \\mathrm{lm/W}' },
        { text: 'The radiation itself gives 523 lm per watt, so the fraction of the power radiated is', tex: '\\eta = \\frac{183}{523} = 0.35' }
      ],
      a: '183 lm/W, with about 35 % of the electrical power coming out as 589 nm light (the lamp figure includes the ballast and varies by type).'
    }
  ],
  quiz: [
    { q: 'Why is a low-pressure sodium lamp so efficient?', choices: ['It runs very hot', 'Almost all its light is at 589 nm, close to the eye\'s peak sensitivity', 'It uses little power', 'Its glass is thin'], a: 1, why: 'The eye\'s relative sensitivity at 589 nm is 0.77, so each optical watt gives 523 lumens, and the lamp turns a large share of its power into that line.' },
    { q: 'A red car parked under a low-pressure sodium lamp looks…', choices: ['bright red', 'orange', 'dark grey or black: the lamp makes no red light', 'green'], a: 2, why: 'A red paint reflects red and orange light only. The lamp radiates only 589 nm, which it barely reflects.' },
    { q: 'High-pressure sodium lamps show a dip at 589 nm in their spectrum.', a: true, why: 'The dense vapour at the cooler edge of the arc absorbs the centre of the line that the hot core emits: self-reversal. Broad gold bands on both sides remain.' },
    { q: 'How many lumens does 2 W of light at 650 nm give, taking V(650) = 0.107?', answer: 146, unit: 'lm', why: 'Φ = 683 × 0.107 × 2 = 146 lm. The same power at 555 nm would give 1366 lm.' },
    { q: 'Why is the arc tube of a high-pressure sodium lamp made of alumina rather than quartz?', choices: ['Alumina is cheaper', 'Hot sodium attacks quartz at about 1100 °C; translucent alumina resists it', 'Alumina makes the light yellow', 'Quartz would melt at 100 °C'], a: 1, why: 'Sodium vapour at that temperature reacts with silica. Polycrystalline alumina is translucent, lets the light out and resists sodium.' }
  ],
  applications: [
    'Road and motorway lighting for about fifty years, from the 1930s.',
    'Cities near observatories, where a single line can be filtered out of astronomical images.',
    'Greenhouses (high-pressure sodium), where its red-rich light suited flowering plants.',
    'Laboratory sodium lamps as a monochromatic source for polarimetry and refractive-index work.',
    'The pattern replaced today by amber LEDs near 590 nm in places where sky glow and wildlife are concerns.'
  ],
  history: 'Low-pressure sodium lamps were developed in the Netherlands and the United States in the early 1930s; the first road installations followed, and by the 1950s they lit the new motorways. The high-pressure lamp had to wait for a material that survives hot sodium: General Electric\'s translucent polycrystalline alumina, announced in 1962, made it possible, and the lamp was on the market in 1965.',
  sources: [
    'J. J. de Groot and J. A. J. M. van Vliet, *The High-Pressure Sodium Lamp* (Philips Technical Library, Kluwer, 1986) — the physics and design of the lamp.',
    'J. F. Waymouth, *Electric Discharge Lamps* (MIT Press, 1971) — the sodium discharge, self-reversal and the alumina tube.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — low- and high-pressure sodium lamps.'
  ],
  sim: [{ id: 'la-rendering', params: { lamp: 'sodium-lp' } }, { id: 'la-spectrum', params: { lamp: 'sodium-lp' } }]
},

/* ================================================================ xenon arcs and flash lamps */
{
  id: 'xenon-arc-and-flash-lamps', parent: 'lamp-families', title: 'Xenon arcs and flash tubes', level: 2,
  short: 'Xenon gas makes a white light close to daylight. Held in a steady short arc it is the intense point source of cinema projectors and solar simulators; discharged from a capacitor it is the flash of a camera, a strobe or the pump of a laser.',
  keywords: ['xenon', 'xenon arc', 'short-arc lamp', 'flash tube', 'flash lamp', 'strobe', 'speedlight', 'capacitor', 'cinema projector lamp', 'solar simulator', 'daylight', 'flashlamp pumping', 'Edgerton'],
  prereq: ['high-intensity-discharge-lamps', 'how-light-is-made'],
  related: ['flash-and-strobe', 'triggering-and-strobing', 'projector-illumination', 'cinema-and-stage-lighting-systems', 'solid-state-lasers', 'lamp-efficacy-and-lifetime', 'colour-temperature-and-colour-rendering', 'stroboscopic-effects'],
  body: `
Xenon is a heavy noble gas with an unusual gift: a hot, dense xenon arc radiates a smooth, continuous spectrum that looks like noon sunlight, 5500–6500 K, with a colour rendering index of 95 to 99, as well as a set of lines in the near infrared. Two quite different lamps use it.

### The short-arc lamp
Two electrodes, a few millimetres apart, in a thick fused-silica bulb filled with xenon at a pressure of several bar when cold and several times more when hot, burn a steady direct-current arc. The arc is so small, hotter and brighter at the cathode tip than any filament, that a mirror can gather a great part of its light into a narrow beam. Typical lamps take 1 to 7 kW and give 25–50 lm/W: a 3 kW lamp gives roughly 100 000 lm from a source the size of a grain of rice. Life is short, 500–3000 hours, and the lamp is started with ignition pulses of tens of kilovolts.

The small bright source is what the optics wants: cinema projectors, searchlights, solar simulators for testing solar cells, and microscopes for fluorescence.

> [!warn] A short-arc lamp is under pressure even when cold, and can explode. Handle it only in its protective sleeve and with face protection, and never look at the arc: the light is intense and rich in ultraviolet. Ignition pulses are tens of kilovolts. Lamps that make ozone need an exhaust.

### The flash tube
A **flash tube** is a straight, curved or spiral tube of quartz or glass holding xenon at a fraction of an atmosphere. A capacitor of C farads is charged to a voltage V, so that it stores
$$E = \\tfrac{1}{2}CV^2$$
A trigger pulse of several kilovolts on a wire along the tube ionises the gas, and the capacitor empties through it in a surge of hundreds of amperes, in about a millisecond. The plasma radiates a broad white spectrum of 5500–6000 K, with an efficacy of 30–60 lumen-seconds per joule.

| | Energy per flash | Light per flash | Typical use |
|---|---|---|---|
| Pocket camera flash | 1–5 J | 50–250 lm·s | phones, compacts |
| Hot-shoe flash ("speedlight") | 10–60 J | 500–2500 lm·s | photography |
| Studio flash | 100–1000 J | 5 000–50 000 lm·s | studio |
| Laser-pump flashlamp | hundreds of J | millisecond pulses | Nd:YAG, ruby |

Full power empties the capacitor and takes about a millisecond (1/1000 s). For lower power settings, electronics cut the current off when the chosen share of the energy has gone, so the pulse is shorter: tens of microseconds at 1/128, short enough to freeze a bullet or a hummingbird's wing ([[flash-and-strobe]]). Repeated flashes make a **strobe**, whose average power is $E f$, limited by the tube's rating.

> [!warn] A charged flash capacitor can kill. Never open a flash unit: the capacitor holds its charge for a long time after it is unplugged, at 300 V or more and tens of joules.

> [!key] Xenon makes daylight-coloured light. Held as a short arc it is a tiny, intense steady source; discharged from a capacitor (E = ½CV²) it is a flash of about 45 lumen-seconds per joule that lasts about a millisecond at full power and microseconds at low power.
`,
  ideas: [
    'A xenon arc radiates a continuous spectrum close to daylight, 5500–6500 K, with Ra of 95–99, plus infrared lines.',
    'A short-arc lamp is a small, extremely bright steady source of 1–7 kW: cinema projection, searchlights, solar simulators.',
    'A flash tube is a capacitor discharged through xenon: energy ½CV², about 45 lm·s per joule, about a millisecond at full power.',
    'Cutting the current early shortens the flash: low power settings freeze motion.',
    'Both are hazardous: the short arc is pressurised and rich in UV, the flash holds a lethal charge.'
  ],
  pitfalls: [
    'A flash is a bright version of an ordinary lamp — It is a pulse of tens of microseconds to a millisecond, from a capacitor, so the "power" is huge but the energy is small: 50 J is about as much as a 100 W lamp gives in half a second.',
    'Doubling the capacitor voltage doubles the flash energy — The energy goes as V²: double the voltage and the energy is four times as large.',
    'A weaker flash is just a dimmer flash of the same length — The electronics cut the pulse short, so a weaker flash is also a faster flash. That is the way a speedlight stops motion at low power.',
    'Xenon lamps are only for flashes — The continuous short-arc lamp, the same gas at higher pressure, projected films for fifty years.'
  ],
  terms: [
    { term: 'Short-arc lamp', def: 'A lamp with two electrodes a few millimetres apart in high-pressure xenon (or mercury) and a steady direct-current arc: a very small, very bright source.' },
    { term: 'Flash tube', also: ['flashlamp', 'flash lamp'], def: 'A tube of xenon at low pressure through which a charged capacitor is discharged, giving a pulse of white light lasting microseconds to milliseconds.' },
    { term: 'Strobe', also: ['stroboscope'], def: 'A flash unit fired repeatedly, to freeze or analyse periodic motion. Its average power is the flash energy times the rate.' },
    { term: 'Trigger pulse', def: 'A pulse of several kilovolts applied to a wire along a flash tube to ionise the gas and let the capacitor discharge.' },
    { term: 'Luminous energy', also: ['lumen-second', 'lm·s'], def: 'The total amount of light given out in a flash, the integral of the luminous flux over time. It is measured in lumen-seconds.' },
    { term: 'Flashlamp pumping', def: 'Using the flash of a xenon tube to excite the active medium of a solid-state laser such as ruby or Nd:YAG.' }
  ],
  formulas: [
    {
      name: 'Energy stored in the capacitor',
      expr: 'E = C*V^2/2', tex: 'E = \\tfrac{1}{2}\\,C\\,V^2',
      vars: {
        E: { name: 'energy stored', q: 'energy', unit: 'J' },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 800 },
        V: { name: 'voltage', q: 'voltage', unit: 'V', value: 330, min: 1, max: 5000 }
      },
      stories: { E: 'A flash capacitor of {C} is charged to {V}. How much energy does it hold?' }
    },
    {
      name: 'Light of one flash',
      expr: 'Q = eta*E', tex: 'Q = \\eta\\,E',
      vars: {
        Q: { name: 'luminous energy of the flash', unit: 'lm·s' },
        eta: { name: 'efficacy of the tube (lumen-seconds per joule)', q: 'efficacy', unit: 'lm/W', value: 45, tex: '\\eta' },
        E: { name: 'energy released in the flash', q: 'energy', unit: 'J', value: 43.6 }
      },
      note: 'Lumen-seconds per joule are numerically the same as lumens per watt: 30 to 60 for a flash tube.'
    },
    {
      name: 'Average power of a strobe',
      expr: 'P = E*f', tex: 'P = E\\,f',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        E: { name: 'energy per flash', q: 'energy', unit: 'J', value: 20 },
        f: { name: 'flash rate', q: 'frequency', unit: 'Hz', value: 5 }
      },
      note: 'The tube and the supply set a limit; a strobe tube is rated in watts of average power.'
    }
  ],
  examples: [
    {
      title: 'A speedlight at full and at 1/16 power',
      q: 'A flash unit has a capacitor of 800 µF charged to 330 V and a tube of 45 lm·s per joule. How much energy, and how much light, does a full-power flash give? And a flash set to 1/16 power?',
      steps: [
        { text: 'Energy stored:', tex: 'E = \\tfrac{1}{2}\\times 800\\times10^{-6}\\times 330^2 = 43.6\\ \\mathrm{J}' },
        { text: 'Light at full power:', tex: 'Q = 45\\times 43.6 = 1960\\ \\mathrm{lm\\,s}' },
        'At 1/16 power the electronics release one sixteenth of the energy: 2.7 J and 123 lm·s. The pulse is also shorter, by about the same factor.'
      ],
      a: '43.6 J and 1960 lm·s at full power; 2.7 J and 123 lm·s at 1/16 — four stops less light.'
    },
    {
      title: 'How fast can a strobe go?',
      q: 'A strobe tube may take 100 W of average power. With 20 J per flash, what is the highest flash rate?',
      steps: [
        { text: 'Solve $P = E f$ for $f$:', tex: 'f = \\frac{P}{E} = \\frac{100\\ \\mathrm{W}}{20\\ \\mathrm{J}} = 5\\ \\mathrm{Hz}' }
      ],
      a: '5 flashes per second. A faster rate needs flashes of lower energy, which is why stroboscopes for high rates use small, short flashes.'
    }
  ],
  quiz: [
    { q: 'A flash capacitor is charged to twice the voltage. The energy stored is…', choices: ['the same', 'twice as much', 'four times as much', 'eight times as much'], a: 2, why: 'E = ½CV²: the energy goes as the square of the voltage.' },
    { q: 'A flash is set from full power to 1/128. Which of these is true?', choices: ['The flash is as long but dimmer', 'The flash is much shorter and releases much less light', 'The flash gets longer', 'Only the colour changes'], a: 1, why: 'The electronics stop the current early. At low power the pulse can be tens of microseconds, short enough to freeze fast motion.' },
    { q: 'A charged flash capacitor is harmless as soon as the unit is unplugged.', a: false, why: 'The capacitor can keep a charge of hundreds of volts for minutes or hours. Flash units must not be opened.' },
    { q: 'A 1000 µF capacitor is charged to 300 V. How much energy does it hold, in joules?', answer: 45, unit: 'J', why: 'E = ½ × 1000×10⁻⁶ × 300² = 45 J.' },
    { q: 'Why is a short-arc xenon lamp preferred in a cinema projector?', choices: ['It is very cheap', 'It is a very small, very bright source of daylight colour, so an optical system can gather and use much of its light', 'It lasts for ever', 'It needs no cooling'], a: 1, why: 'The small size matches a small mirror and film gate; the continuum spectrum looks like daylight and renders colours accurately.' }
  ],
  applications: [
    'Flash photography from pocket cameras to studio heads, and the electronic flash of the first high-speed photographs.',
    'Strobes: stroboscopes for machinery, aircraft anti-collision lights, emergency beacons.',
    'Cinema and large-venue projection, searchlights and solar simulators (short-arc lamps).',
    'Pumping solid-state lasers: ruby and Nd:YAG lasers before diode pumping.',
    'Intense pulsed light for hair and skin treatment, and for pulsed sterilisation of surfaces.'
  ],
  history: 'Harold Edgerton at the Massachusetts Institute of Technology developed the electronic flash and the stroboscope in the 1930s, and used them to photograph a bullet through an apple and a drop of milk striking a surface. Xenon short-arc lamps for projection were developed in Germany in the 1940s and entered cinemas in the 1950s, replacing the carbon arcs that had lit film projection for fifty years.',
  sources: [
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — xenon arc and flash lamps.',
    'J. F. Waymouth, *Electric Discharge Lamps* (MIT Press, 1971) — high-pressure arcs and the physics of pulsed discharges.',
    'W. Koechner, *Solid-State Laser Engineering* (Springer) — flashlamps as pump sources, with pulse shapes and ratings.'
  ],
  sim: [{ id: 'la-flash', params: {} }]
},

/* ================================================================ light-emitting diodes */
{
  id: 'light-emitting-diodes', parent: 'lamp-families', title: 'Light-emitting diodes', level: 2,
  short: 'A semiconductor junction that gives off a photon each time an electron and a hole recombine. The band gap fixes the colour — infrared, red, green, blue, ultraviolet — in a band only 20 to 40 nm wide, and the light needs no heat, no gas, no vacuum, only a steady current and a way to carry the waste heat away.',
  keywords: ['LED', 'light-emitting diode', 'p-n junction', 'band gap', 'InGaN', 'AlGaInP', 'electroluminescence', 'recombination', 'forward voltage', 'efficiency droop', 'junction temperature', 'wall-plug efficiency', 'quantum well', 'binning', 'chip'],
  prereq: ['how-light-is-made', 'photon-energy'],
  related: ['white-leds', 'drivers-dimming-and-flicker', 'lamp-efficacy-and-lifetime', 'uv-and-infrared-sources', 'diode-lasers', 'vcsels-and-laser-arrays', 'lambertian-surfaces', 'electronics:leds', 'physics:pn-junction', 'physics:semiconductors'],
  body: `
Join a p-type semiconductor, rich in mobile positive "holes", to an n-type one, rich in mobile electrons, and apply a forward voltage. Electrons and holes are driven into the thin **active layer** at the junction and **recombine**: the electron drops across the band gap and, in a good material, the energy leaves as one photon,
$$\\lambda = \\frac{hc}{E_g} = \\frac{1239.8\\ \\mathrm{eV\\,nm}}{E_g}$$
This is electroluminescence ([[how-light-is-made]]). The material fixes the gap, so the material fixes the colour.

### The materials
| Material | Colour | Wavelength | Gap | Forward voltage |
|---|---|---|---|---|
| AlGaAs, GaAs | infrared | 850–950 nm | 1.3–1.5 eV | 1.2–1.6 V |
| AlGaInP | red, orange, amber | 590–650 nm | 1.9–2.1 eV | 1.8–2.4 V |
| InGaN | green, blue | 440–540 nm | 2.3–2.8 eV | 2.8–3.4 V |
| InGaN / GaN | near ultraviolet | 365–405 nm | 3.1–3.4 eV | 3.3–3.8 V |
| AlGaN | deep ultraviolet | 255–290 nm | 4.3–4.9 eV | 5–7 V |

The forward voltage is a little more than $E_g/e$. Each band is narrow, **20 to 40 nm** wide (as little as 15 nm for some reds), which makes LED light vivid and, unlike a lamp's, very nearly one colour. The width is set by the spread of electron energies, about $1.8\\,kT$ at best, and by the unevenness of the alloy.

### Efficiency
The light out per electrical watt in is the product of three efficiencies. **Injection**: how many electrons reach the active layer. **Internal quantum efficiency**: how many pairs give a photon instead of heat; above 80 % in good chips. **Extraction**: how many photons escape. A smooth chip of index 2.5 traps most of its light by total internal reflection (the escape cone is only 24°, about 4 % per face), so chips are shaped, textured or flipped to reach 70–90 %. The **wall-plug efficiency** of a blue chip is 40–60 % at its working current; the rest is heat, which has to be carried out through the back of the chip.

### Heat and droop
Two things spoil a chip as it is driven harder. **Droop**: the efficiency peaks at modest current density and falls as Auger recombination, which grows as the cube of the carrier density, takes a larger share. **Temperature**: as the junction warms, the efficiency falls (roughly 0.1 % per kelvin for blue InGaN, 0.5 % or more for red AlGaInP), the wavelength drifts to the red (about 0.04 nm/K for blue, 0.1 nm/K for red) and the life shortens. The simulation shows both. A power LED is a thermal design problem: die, solder, board, heat sink.

### A source of its own kind
An LED emits into a half-space, with a Lambertian pattern, half its peak intensity at ±60°, narrowed by a dome or a lens. Its die is a few tenths of a millimetre across with a luminance of about 10⁷ cd/m², so it is a small, bright, coolly lit source that is easy to focus. An LED is not a laser: its emission is spontaneous, wide in angle and wavelength and incoherent ([[diode-lasers]]).

> [!warn] Do not stare into a high-power LED at close range: the retina cannot tell it from the Sun, and the blue and ultraviolet kinds can injure it. Infrared and ultraviolet LEDs are invisible and give no warning. Lamp and luminaire makers assess photobiological safety to IEC 62471.

> [!key] An LED turns recombining electron–hole pairs into photons of energy near the band gap: the material sets a narrow colour band, efficiency is 40–60 % at best, and droop and heat limit how hard the chip can be driven.
`,
  ideas: [
    'Electrons and holes recombine in the junction; each pair gives one photon of energy about E_g, so λ = hc/E_g.',
    'The semiconductor sets the colour: AlGaAs infrared, AlGaInP red to amber, InGaN green to ultraviolet, AlGaN deep ultraviolet.',
    'The band is narrow, 20–40 nm, and the forward voltage is a little above E_g/e.',
    'Efficiency is injection × internal efficiency × extraction; 40–60 % of the power becomes light in a good blue chip, the rest is heat.',
    'Droop at high current and loss with temperature set how hard a chip can be driven; heat sinking decides its life.'
  ],
  pitfalls: [
    'LEDs run cold — They make 40–60 % of their power as heat, which is not radiated forwards like a filament\'s but conducted out through the back of the chip. Without a heat sink a power LED overheats and fails.',
    'An LED\'s brightness is set by the voltage across it — The light follows the current. The voltage varies very little with current, and falls as the junction warms, so a fixed voltage can give a runaway current. LEDs are driven with a controlled current ([[drivers-dimming-and-flicker]]).',
    'The light of a LED is laser light — The emission is spontaneous: incoherent, wide in angle and 20–40 nm wide. A laser diode adds a cavity and stimulated emission to get a narrow line and a beam.',
    'More current always means more light for a given efficiency — Past the peak the efficiency droops, so each extra milliampere gives less light and more heat.'
  ],
  terms: [
    { term: 'Light-emitting diode', also: ['LED'], def: 'A semiconductor diode that emits light when forward current makes electrons and holes recombine in its junction. The colour is fixed by the band gap of the material.' },
    { term: 'Band gap', also: ['E_g', 'energy gap'], def: 'The energy needed to lift an electron from the valence band to the conduction band of a semiconductor, and so the energy of the photon emitted when it falls back: λ = 1239.8 eV·nm ÷ E_g.' },
    { term: 'Forward voltage', also: ['V_f'], def: 'The voltage across an LED when it conducts its working current: a little above E_g/e, about 2 V for red and 3 V for blue.' },
    { term: 'Wall-plug efficiency', also: ['WPE', 'power conversion efficiency'], def: 'The optical power emitted divided by the electrical power consumed. The rest is heat.' },
    { term: 'Efficiency droop', def: 'The fall in the efficiency of an LED at high current density, caused mainly by Auger recombination, which takes carriers without making light.' },
    { term: 'Junction temperature', also: ['T_j'], def: 'The temperature of the active layer of the LED. It sets the efficiency, the wavelength and the life, and has a maximum of about 125–150 °C.' }
  ],
  formulas: [
    {
      name: 'Wavelength from the band gap',
      expr: 'lam = h*c/Eg', tex: '\\lambda = \\frac{h c}{E_g}',
      vars: {
        lam: { name: 'wavelength of the emitted light', q: 'length', unit: 'nm', tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 2.76, tex: 'E_g' }
      },
      stories: { lam: 'A semiconductor has a band gap of {Eg}. At what wavelength does its LED emit?', Eg: 'An LED emits at {lam}. What is the band gap of its active layer?' }
    },
    {
      name: 'Forward voltage from the band gap',
      expr: 'Vf = Eg/qe', tex: 'V_f \\approx \\frac{E_g}{e}',
      vars: {
        Vf: { name: 'turn-on voltage', q: 'voltage', unit: 'V', tex: 'V_f' },
        Eg: { name: 'band gap', q: 'energy', unit: 'eV', value: 2.1, tex: 'E_g' },
        qe: { const: 'qe' }
      },
      note: 'A guide: real forward voltages are a little higher because of resistance and the band offsets.'
    },
    {
      name: 'Wall-plug efficiency',
      expr: 'eta = Popt/(V*I)', tex: '\\eta = \\frac{P_{\\mathrm{opt}}}{V\\,I}',
      vars: {
        eta: { name: 'wall-plug efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Popt: { name: 'optical power emitted', q: 'power', unit: 'mW', value: 420, tex: 'P_{\\mathrm{opt}}' },
        V: { name: 'forward voltage', q: 'voltage', unit: 'V', value: 3.0 },
        I: { name: 'forward current', q: 'current', unit: 'mA', value: 350 }
      },
      note: 'The rest of V × I is heat.',
      stories: { eta: 'A blue LED emits {Popt} of light at {V} and {I}. What is its wall-plug efficiency?' }
    },
    {
      name: 'Series resistor for an LED',
      expr: 'R = (Vs - Vf)/I', tex: 'R = \\frac{V_s - V_f}{I}',
      vars: {
        R: { name: 'series resistor', q: 'resistance', unit: 'Ω' },
        Vs: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 5, tex: 'V_s' },
        Vf: { name: 'forward voltage of the LED', q: 'voltage', unit: 'V', value: 2.0, tex: 'V_f' },
        I: { name: 'wanted current', q: 'current', unit: 'mA', value: 10 }
      },
      note: 'The simple way to drive a small indicator LED. It wastes the difference in voltage as heat in the resistor.'
    }
  ],
  examples: [
    {
      title: 'What gap makes amber?',
      q: 'An amber LED emits at 590 nm. What band gap does that need, and what forward voltage would you expect?',
      steps: [
        { text: 'The photon energy is', tex: 'E = \\frac{1239.8\\ \\mathrm{eV\\,nm}}{590\\ \\mathrm{nm}} = 2.10\\ \\mathrm{eV}' },
        'The active layer needs a gap of 2.1 eV: AlGaInP, adjusted in composition. The forward voltage is about $E_g/e = 2.1$ V, and a real amber LED shows 2.0–2.4 V.'
      ],
      a: '2.1 eV, and a forward voltage of about 2.1 V.'
    },
    {
      title: 'A resistor and a USB supply',
      q: 'A red indicator LED (forward voltage 2.0 V) is to run at 10 mA from a 5 V supply. What series resistor is needed, and how is the power shared?',
      steps: [
        { text: 'The resistor drops the 3 V that the LED does not:', tex: 'R = \\frac{5 - 2.0}{0.010} = 300\\ \\Omega' },
        'The resistor dissipates 3 V × 10 mA = 30 mW and the LED takes 20 mW.'
      ],
      a: '300 Ω. The resistor wastes 30 mW, more than the LED uses. For a power LED this is why a constant-current driver, not a resistor, is used.'
    }
  ],
  quiz: [
    { q: 'What decides the colour of an LED?', choices: ['The colour of its plastic lens', 'The band gap of the semiconductor in the active layer', 'The voltage applied to it', 'The size of the heat sink'], a: 1, why: 'The photon energy is about the band gap, so λ = hc/E_g. A coloured lens only changes how the chip looks off.' },
    { q: 'Which LED needs the larger band gap?', choices: ['Red', 'Infrared', 'Blue', 'They all need the same'], a: 2, why: 'Blue photons (about 2.8 eV) carry more energy than red (2.0 eV) or infrared (1.4 eV): blue needs the wide-gap nitride materials.' },
    { q: 'An LED can be connected straight to a battery of its own forward voltage without a current limiter.', a: false, why: 'The current rises extremely steeply with voltage, and the forward voltage falls as the chip warms, so the current can run away. Use a resistor or a constant-current driver.' },
    { q: 'What is the wavelength of an LED made from a semiconductor with a gap of 2.4 eV, in nanometres?', answer: 517, unit: 'nm', why: 'λ = 1239.8 ÷ 2.4 = 517 nm: green.' },
    { q: 'Why does the efficiency of an LED fall when it is driven at very high current density?', choices: ['The photons stick in the glass', 'Auger recombination grows as the cube of the carrier density and wastes carriers as heat', 'The forward voltage drops', 'The wavelength changes too much'], a: 1, why: 'Radiative recombination grows as n², the Auger process as n³, so at high carrier density a larger share of pairs is lost without a photon: droop.' }
  ],
  applications: [
    'General lighting, as the white LED of the next page.',
    'Displays, indicators and signs: red, green and blue chips are the pixels of large video screens and the backlights of LCDs.',
    'Infrared LEDs in remote controls, proximity sensors and night-vision illuminators.',
    'Ultraviolet LEDs for curing inks and adhesives, forensics and disinfection (UV-C).',
    'Machine-vision lighting, where an LED can be switched on in microseconds and strobed.'
  ],
  history: 'Henry Round saw light from a silicon carbide crystal under current in 1907. Nick Holonyak Jr. at General Electric made the first visible LED, a red GaAsP one, in 1962. Blue took thirty more years: Isamu Akasaki, Hiroshi Amano and Shuji Nakamura made efficient blue LEDs from gallium nitride in the early 1990s, work for which they received the 2014 Nobel Prize in Physics. It was blue that made a white LED, and LED lighting, possible.',
  sources: [
    'E. F. Schubert, *Light-Emitting Diodes* (Cambridge University Press, 2nd edition, 2006) — the physics of the junction, efficiency, droop and extraction.',
    'The Royal Swedish Academy of Sciences, *Scientific Background on the Nobel Prize in Physics 2014: Efficient blue light-emitting diodes leading to bright and energy-saving white light sources*.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — LEDs as light sources.',
    'IEC 62471, *Photobiological safety of lamps and lamp systems*.'
  ],
  sim: [{ id: 'la-led', params: {} }]
},

/* ================================================================ white LEDs */
{
  id: 'white-leds', parent: 'lamp-families', title: 'White LEDs', level: 2,
  short: 'A blue LED chip under a phosphor: part of the blue passes through, the rest is turned into broad yellow (and red) light, and the sum is white. The amount of phosphor sets the colour temperature, the choice of phosphors the rendering. Three coloured LEDs make white too, but with gaps in the spectrum.',
  keywords: ['white LED', 'phosphor-converted LED', 'pc-LED', 'YAG', 'Ce:YAG', 'nitride phosphor', 'CCT bin', 'MacAdam ellipse', 'SDCM', 'CRI', 'R9', 'RGB white', 'RGBW', 'remote phosphor', 'COB', 'Stokes loss'],
  prereq: ['light-emitting-diodes', 'colour-temperature-and-colour-rendering'],
  related: ['lamp-efficacy-and-lifetime', 'fluorescent-lamps', 'metamerism', 'the-chromaticity-diagram', 'additive-and-subtractive-mixing', 'drivers-dimming-and-flicker', 'flat-panel-displays'],
  body: `
No LED makes white light directly: a junction emits one narrow band. The usual white LED is a **blue InGaN chip**, 440 to 460 nm, covered with a **phosphor**: a powder in silicone that absorbs blue and re-emits it, broadly, as yellow. What leaves the package is the leftover blue plus the yellow, and the eye adds them to white. The simulation lets you slide the mix.

### The phosphor makes the colour
- **Yellow phosphor** (cerium-doped yttrium aluminium garnet, Ce:YAG): a broad band peaking near 550–560 nm and 120 nm wide. A thin layer gives a cool white; a thicker one, a neutral white.
- **Red phosphor** (nitrides, 620–650 nm), added to a green-yellow one: fills the red end, giving a warm white, **2700–3000 K**, with a good rendering of reds.
- **Violet pump**: a 405 nm chip with blue, green and red phosphors; the most complete spectra, the lowest efficacy.

Every conversion loses energy: a blue photon at 450 nm turned into a 560 nm photon keeps 450/560 = 80 % of its energy. So warm lamps, which convert more, and red phosphors, which lose more and lie where the eye is less sensitive, give fewer lumens per watt: roughly 150–200 lm/W for packages of cool white and 100–150 for warm white of high rendering (catalogue figures at 25 °C).

| Approach | Efficacy of the package | Ra | Remarks |
|---|---|---|---|
| Blue + yellow phosphor | highest | 70–80 | cool and neutral whites |
| Blue + yellow-green + red | 10–25 % lower | 80–98 | warm white, good R9 |
| Violet + RGB phosphors | lower still | 90–98 | "full spectrum" |
| Red + green + blue chips | no conversion loss | 20–90 | colour-tunable, narrow bands |

### Bins and ellipses
Manufacture is never exact, so packages are sorted into chromaticity **bins** around nominal colour temperatures: 2700, 3000, 3500, 4000, 4500, 5000, 5700 and 6500 K (ANSI C78.377). The bins are described in **MacAdam ellipse** steps (SDCM): within a 3-step ellipse two lights are indistinguishable side by side for most people; 5 steps are visible. Rendering is stated as Ra and as **R9**, the saturated red which is the weak point of the cheap white LED: Ra 80 with R9 near 0 is common, and 90 with R9 above 50 is the mark of good quality ([[colour-temperature-and-colour-rendering]]).

### White from three
Red, green and blue chips mixed in the right proportions make a white of any colour temperature, and need no phosphor: no Stokes loss. The price is the spectrum: three narrow bands leave gaps, and the colour rendering is poor. RGB white is used for tunable lighting and for stage lighting; adding amber or a phosphor white chip (RGBW, RGBA) repairs the rendering.

### What to know
The blue peak is part of every phosphor LED's spectrum; the cooler the white, the larger its share. Photobiological safety is assessed to IEC 62471, which classes lamps by risk group, and "blue-light hazard" claims should be looked at against that standard. "Dim-to-warm" lamps add amber to the white as the current falls, to imitate a filament lamp.

> [!key] A white LED is a blue chip plus a phosphor that converts part of the blue to broad yellow (and red): more phosphor gives a warmer white, the Stokes loss makes warm white less efficient, a red phosphor repairs the rendering of reds, and three coloured chips make white without conversion loss but with poor rendering.
`,
  ideas: [
    'Most white LEDs are a blue InGaN chip with a yellow Ce:YAG phosphor; the sum of leftover blue and broad yellow looks white.',
    'More phosphor, or a red phosphor, moves the colour to warm white at the cost of efficacy through the Stokes loss.',
    'Ra can hide a weak red: R9 shows it. Good lamps combine Ra of 90 with R9 above 50.',
    'Packages are sorted into chromaticity bins around nominal CCTs; MacAdam ellipse steps say how alike two lights look.',
    'Three coloured LEDs make white without conversion loss but leave gaps in the spectrum and render colours poorly.'
  ],
  pitfalls: [
    'A white LED makes white light directly — A junction makes one narrow colour. White needs a phosphor on a blue chip, or three different chips.',
    'Warm white and cool white LEDs are just coloured differently by a filter — The colour is set inside the package by the phosphor amount and blend. A warm lamp is not a cool one with a filter in front: the filter would waste light.',
    'CRI 80 means that 80 % of colours are shown correctly — It is an average of the colour-shift scores of eight pastel samples, set against a reference. Two lamps of Ra 80 can show reds quite differently; look at R9 as well.',
    'RGB white is better than phosphor white because it has all three primary colours — Three narrow bands leave gaps; surfaces whose reflectance lies in the gaps change colour under it. High rendering needs a broad spectrum.'
  ],
  terms: [
    { term: 'Phosphor-converted LED', also: ['pc-LED'], def: 'An LED in which a phosphor absorbs part of the light of a (usually blue) chip and re-emits it at longer wavelengths. The sum is white or another wanted colour.' },
    { term: 'Ce:YAG', also: ['YAG phosphor', 'yttrium aluminium garnet'], def: 'Cerium-doped yttrium aluminium garnet: the broad yellow phosphor, peaking near 550–560 nm, used with a blue chip in most white LEDs.' },
    { term: 'Chromaticity bin', also: ['colour bin', 'ANSI bin'], def: 'A small quadrangle of the chromaticity diagram around a nominal colour temperature. Packages are measured and sorted into bins so that the lamps made from them look alike.' },
    { term: 'MacAdam ellipse', also: ['SDCM', 'standard deviation of colour matching'], def: 'The region of the chromaticity diagram around a colour in which people cannot tell colours apart. One to three "steps" (SDCM) is the tolerance of lamps meant to look alike.' },
    { term: 'R9', def: 'The colour rendering index for a saturated red test sample. A white LED can have a good Ra and a poor R9; for skin tones and meat R9 matters.' },
    { term: 'RGBW', also: ['RGBA', 'RGB white'], def: 'A fixture that mixes red, green and blue LEDs, with a white (or amber) LED added to improve the quality of whites.' }
  ],
  formulas: [
    {
      name: 'Efficacy of a white LED package',
      expr: 'K = eta*ec*LER', tex: 'K = \\eta\\,\\varepsilon\\,\\mathrm{LER}',
      vars: {
        K: { name: 'efficacy', q: 'efficacy', unit: 'lm/W' },
        eta: { name: 'wall-plug efficiency of the blue chip', q: 'ratio', unit: '%', value: 50, min: 0, max: 100, tex: '\\eta' },
        ec: { name: 'share of the chip\'s radiant power left after the phosphor', q: 'ratio', unit: '%', value: 85, min: 0, max: 100, tex: '\\varepsilon' },
        LER: { name: 'luminous efficacy of the white light', q: 'efficacy', unit: 'lm/W', value: 330, tex: '\\mathrm{LER}' }
      },
      note: 'The chain: electricity to blue light, blue to white, white to lumens. LER is about 250–350 lm per optical watt for a good white.',
      stories: { K: 'A blue chip with {eta} efficiency feeds a phosphor that leaves {ec} of its power; the light has an efficacy of {LER}. What is the efficacy of the package?' }
    },
    {
      name: 'Energy kept by the phosphor',
      expr: 'eta = lam1/lam2', tex: '\\eta = \\frac{\\lambda_1}{\\lambda_2}',
      vars: {
        eta: { name: 'fraction of the energy kept per photon', q: 'ratio', unit: '%', tex: '\\eta' },
        lam1: { name: 'wavelength of the blue chip', q: 'length', unit: 'nm', value: 450, tex: '\\lambda_1' },
        lam2: { name: 'wavelength re-emitted', q: 'length', unit: 'nm', value: 560, tex: '\\lambda_2' }
      },
      note: 'The Stokes efficiency: one photon in, one out, so the energy kept is the ratio of the wavelengths (the phosphor\'s own quantum efficiency comes on top).'
    }
  ],
  examples: [
    {
      title: 'The efficacy of a package',
      q: 'A blue chip has a wall-plug efficiency of 50 %. Its phosphor converts 80 % of the blue, with a 95 % quantum efficiency, into photons that keep 80 % of the energy. The white light has a luminous efficacy of 330 lm/W. What is the efficacy of the package?',
      steps: [
        { text: 'The radiant power left after the phosphor, as a fraction of the chip\'s: 20 % passes through, and 80 % is converted:', tex: '\\varepsilon = 0.20 + 0.80\\times0.95\\times0.80 = 0.81' },
        { text: 'Then', tex: 'K = 0.50\\times 0.81\\times 330\\ \\mathrm{lm/W} = 134\\ \\mathrm{lm/W}' }
      ],
      a: 'About 134 lm/W: the conversion costs 19 % of the chip\'s light and the chip itself wastes half the power.'
    },
    {
      title: 'Why warm costs lumens',
      q: 'Convert more of the blue (90 % instead of 80 %) and use a red phosphor emitting at 630 nm for a third of the converted light. Estimate how the energy kept by the phosphor changes, taking 560 nm for the yellow part.',
      steps: [
        { text: 'The mean energy kept per converted photon is the weighted average', tex: '\\frac{2}{3}\\cdot\\frac{450}{560} + \\frac{1}{3}\\cdot\\frac{450}{630} = 0.536 + 0.238 = 0.774' },
        'The red photons keep only 71 % of the energy and lie where the eye is much less sensitive; and more of the light has gone through the phosphor. Both lower the lumens per watt.'
      ],
      a: 'The mean energy kept falls from 80 % to 77 %, and the red end adds a loss of visibility: a warm, well-rendered lamp gives 10–25 % fewer lumens per watt.'
    }
  ],
  quiz: [
    { q: 'In the usual white LED, the yellow part of the light comes from…', choices: ['a second, yellow LED chip', 'a phosphor that absorbs part of the blue chip\'s light', 'the plastic lens', 'a filter that removes blue'], a: 1, why: 'The blue chip excites a phosphor (usually Ce:YAG), which emits a broad yellow band. The remaining blue and the yellow together look white.' },
    { q: 'Why is a warm-white LED less efficient than a cool-white one?', choices: ['It runs at a lower current', 'More of its light has gone through the phosphor, with its Stokes loss, and red light is less visible', 'Warm light is dimmer by definition', 'Its chip is a different colour'], a: 1, why: 'Each converted photon loses part of its energy, and a red phosphor loses more and emits where the eye is less sensitive.' },
    { q: 'A lamp with Ra = 80 renders every saturated colour well.', a: false, why: 'Ra averages eight pastel samples. A lamp can have Ra 80 and an R9 near zero, which shows as dull reds. Check R9 for skin, meat and wood.' },
    { q: 'A blue chip of 450 nm pumps a phosphor that emits at 560 nm. What percentage of each photon\'s energy is kept?', answer: 80.4, unit: '%', why: 'The photon energy is inversely proportional to the wavelength: 450/560 = 0.804.' },
    { q: 'Why does a white made of red, green and blue LEDs render colours worse than a phosphor white?', choices: ['The LEDs are dimmer', 'Three narrow bands leave gaps in the spectrum, and surfaces that reflect only there change colour', 'RGB LEDs cannot make white', 'The eye is less sensitive to narrow bands'], a: 1, why: 'Colour rendering depends on how well the spectrum covers the reflectances of surfaces. A broad phosphor band fills the gaps; three narrow lines do not.' }
  ],
  applications: [
    'Lamps, downlights, tubes and street lighting, from 2700 K homes to 6500 K workshops.',
    'Camera flashes and phone torches.',
    'Backlights of LCD screens and displays, with blue LEDs and phosphors or quantum dots.',
    'Retail and museum lighting, where a high R9 and a controlled colour matter.',
    'Tunable-white and colour-changing fixtures for architecture and stage, built from RGBW or two-white mixes.'
  ],
  history: 'The white LED followed the blue one at once: in 1996 Nichia, where Shuji Nakamura had made the blue LED, announced a white LED that combined it with a Ce:YAG phosphor, a combination of a blue chip and a yttrium aluminium garnet phosphor that is still the basis of most white LEDs.',
  sources: [
    'E. F. Schubert, *Light-Emitting Diodes* (Cambridge University Press, 2nd edition, 2006) — white LEDs, phosphors, colour rendering of LED sources.',
    'A. Žukauskas, M. S. Shur and R. Gaska, *Introduction to Solid-State Lighting* (Wiley, 2002) — colour mixing with LEDs.',
    'ANSI C78.377, *Specifications for the Chromaticity of Solid State Lighting Products*.',
    'The Royal Swedish Academy of Sciences, *Scientific Background on the Nobel Prize in Physics 2014* — blue LEDs and white light.'
  ],
  sim: [{ id: 'la-white-led', params: {} }]
},

/* ================================================================ colour temperature and colour rendering */
{
  id: 'colour-temperature-and-colour-rendering', parent: 'lamp-families', title: 'Colour temperature and colour rendering', level: 2,
  short: 'Two numbers describe a white light. The correlated colour temperature says how warm or cool its colour is, by comparison with a glowing black body; the colour rendering index says how faithfully it shows the colours of things. Two lamps of the same colour temperature can render colours very differently.',
  keywords: ['colour temperature', 'CCT', 'correlated colour temperature', 'Planckian locus', 'duv', 'CRI', 'Ra', 'R9', 'colour rendering index', 'TM-30', 'Rf', 'Rg', 'mired', 'warm white', 'cool white', 'McCamy', 'colour fidelity'],
  prereq: ['how-light-is-made', 'the-chromaticity-diagram'],
  related: ['metamerism', 'white-balance-and-chromatic-adaptation', 'white-leds', 'incandescent-lamps', 'fluorescent-lamps', 'sodium-lamps', 'daylight-and-skylight', 'cie-colour-matching-and-xyz', 'ergonomics:glare-colour'],
  body: `
A lamp has two quite separate colour properties. One is the colour of the light itself, the other what the light does to the colours of things.

### Colour temperature
Heat a black body and its colour moves, with the temperature, along a curve of the chromaticity diagram: the **Planckian locus** ([[the-chromaticity-diagram]]). The **colour temperature** of a light that lies on that curve is the temperature of the body that has the same colour. Lights that lie near, but not on, the curve get a **correlated colour temperature** (CCT), the temperature of the nearest point; how far off the curve they are is **Δuv** (positive: greenish; negative: pinkish).

| Light | CCT |
|---|---|
| Candle flame | 1850 K |
| Low-pressure sodium lamp | the colour of a body at about 1800 K — but not a white |
| Filament lamp | 2700 K |
| Halogen lamp | 3000 K |
| Neutral-white office lamp | 4000 K |
| Noon sunlight | 5500–5800 K |
| Overcast daylight, the D65 standard | 6500 K |
| Blue sky | 10 000–20 000 K |

"Warm" and "cool" are about the colour we associate with fire and ice, so a *low* temperature is warm. Use is by custom: 2700–3000 K for homes and restaurants, 3500–4000 K for offices and shops, 5000–6500 K for inspection and daylight-matched work (graphic-arts viewing standards use 5000 K).

### Colour rendering
A white of 4000 K may be a continuous spectrum or three narrow bands, and the colours of objects under it depend on all of it. The **colour rendering index** (CIE 13.3) measures the shift of eight pastel test samples under the lamp, against a reference light of the same colour temperature (a black body below 5000 K, daylight above). Each sample scores $R_i = 100 - 4.6\\,\\Delta E_i$ and the general index is their average, **Ra**. A lamp that is its own reference scores 100: a filament lamp, a halogen lamp, daylight. Six more samples are scored separately, among them the saturated red **R9**.

| Ra | Reading |
|---|---|
| 90–100 | colour-critical work, galleries, retail of food and clothes |
| 80–90 | good general lighting |
| 60–80 | acceptable where colour matters little |
| below 60 | poor: some old mercury and sodium lamps; below 0 is possible |

Typical lamps at 4000 K: halophosphate tube Ra 60–70, triphosphor tube about 82, a good LED 90 and more, a ceramic metal halide lamp about 90. Ra says nothing about the saturated colours it does not test, and an LED with a spiky spectrum can score well and still dull a red. The newer IES **TM-30** and CIE 224 methods score 99 samples: **Rf** (fidelity) and **Rg** (the gamut: do colours get more or less saturated?).

### The mired
Photographers shift the colour temperature of light with filters, and the shift is the same on the **mired** scale, $M = 10^6/T$: a filter that makes a lamp 100 mired bluer does so for every starting temperature.

> [!key] Colour temperature names the colour of the light on the Planckian locus (warm is low); colour rendering, Ra, scores how little a lamp shifts the colours of things from a reference light. Same CCT, different Ra: look at both, and at R9.
`,
  ideas: [
    'The colour temperature of a white light is the temperature of the black body with the same colour; a low temperature is warm (reddish).',
    'Correlated colour temperature applies to lights near the Planckian locus; Δuv says how far off it they are.',
    'Ra averages the colour shifts of eight pastel samples against a reference of the same CCT: 100 means no shift.',
    'Lamps of the same CCT can have very different spectra and renderings: Ra and R9 tell them apart.',
    'The mired scale (10⁶/T) makes filter shifts the same at any temperature.'
  ],
  pitfalls: [
    'Warm light is hotter than cool light — A warm light has a low colour temperature: the colour of a cooler body. A flame (1850 K) is warm in colour; the blue sky is "cool" and far hotter by this scale.',
    'Colour temperature tells how well colours are shown — It names only the colour of the light. A 4000 K lamp may render colours very well (Ra 95) or badly (Ra 60).',
    'A lamp with Ra 100 is best for every purpose — It is best for faithful colour against its reference, but the reference changes with CCT, and a low CCT lamp of Ra 100 still looks orange. Some tasks prefer lights that make colours richer, which Rg measures.',
    'Any light with a colour temperature is a white light — A colour temperature number can be computed for any chromaticity, even a yellow sodium lamp. Check Δuv: a white lies close to the locus.'
  ],
  terms: [
    { term: 'Correlated colour temperature', also: ['CCT', 'colour temperature'], def: 'The temperature of the black body whose colour is nearest to that of the light, in kelvin. Low values look warm, high values cool.' },
    { term: 'Planckian locus', also: ['black-body locus', 'white line'], def: 'The curve in the chromaticity diagram traced by the colour of a black body as its temperature changes, from deep red through white to blue.' },
    { term: 'Δuv', also: ['duv', 'D_uv'], def: 'The distance of a light\'s chromaticity from the Planckian locus in the CIE 1960 uv diagram. Positive is greenish, negative pinkish; lights meant to be white have |Δuv| below about 0.006.' },
    { term: 'Colour rendering index', also: ['CRI', 'Ra'], def: 'A score from 100 (no shift) downwards of how much a lamp changes the colours of eight test samples compared with a reference light of the same colour temperature.' },
    { term: 'R9', def: 'The special colour rendering index for a saturated red sample. It is not part of Ra and is often low in lamps whose Ra looks good.' },
    { term: 'Mired', also: ['MK⁻¹', 'reciprocal megakelvin'], def: 'One million divided by the colour temperature in kelvin. Filters that warm or cool a light shift it by the same number of mired at any starting temperature.' },
    { term: 'TM-30', also: ['Rf', 'Rg'], def: 'The IES method of describing colour rendering with 99 samples: Rf for fidelity (0–100) and Rg for the gamut, whether colours are made more (above 100) or less saturated.' }
  ],
  formulas: [
    {
      name: 'Colour temperature from chromaticity (McCamy)',
      expr: 'T = 449*((x-0.3320)/(0.1858-y))^3 + 3525*((x-0.3320)/(0.1858-y))^2 + 6823.3*((x-0.3320)/(0.1858-y)) + 5520.33',
      tex: 'T = 449\\,n^3 + 3525\\,n^2 + 6823.3\\,n + 5520.33,\\quad n = \\frac{x - 0.3320}{0.1858 - y}',
      vars: {
        T: { name: 'correlated colour temperature', q: 'temperature', unit: 'K' },
        x: { name: 'chromaticity x', value: 0.3127, min: 0.25, max: 0.55 },
        y: { name: 'chromaticity y', value: 0.3290, min: 0.2, max: 0.45 }
      },
      solveFor: 'T',
      note: 'A polynomial approximation, good for lights close to the locus between about 2000 and 12 500 K. D65 (x = 0.3127, y = 0.3290) gives 6505 K.',
      stories: { T: 'A light has chromaticity x = {x} and y = {y}. What is its correlated colour temperature?' }
    },
    {
      name: 'The mired scale',
      expr: 'M = 1000000/T', tex: 'M = \\frac{10^6}{T}',
      vars: {
        M: { name: 'colour temperature in mired', unit: 'MK⁻¹' },
        T: { name: 'colour temperature', q: 'temperature', unit: 'K', value: 3200, min: 1000, max: 20000 }
      }
    },
    {
      name: 'Colour shift of a sample',
      expr: 'Ri = 100 - 4.6*dE', tex: 'R_i = 100 - 4.6\\,\\Delta E_i',
      vars: {
        Ri: { name: 'special colour rendering index of one sample', unit: '', signed: true, tex: 'R_i' },
        dE: { name: 'colour difference of the sample between lamp and reference', value: 2, min: 0, max: 40, tex: '\\Delta E_i' }
      },
      note: 'In CIE 13.3 the colour difference is measured in the CIE 1964 W*U*V* space; Ra is the mean of R1 to R8.'
    }
  ],
  examples: [
    {
      title: 'The colour temperature of a daylight standard',
      q: 'The standard daylight illuminant D65 has chromaticity x = 0.3127, y = 0.3290. Use McCamy\'s formula for its correlated colour temperature.',
      steps: [
        { text: 'First n:', tex: 'n = \\frac{0.3127 - 0.3320}{0.1858 - 0.3290} = \\frac{-0.0193}{-0.1432} = 0.1348' },
        { text: 'Then', tex: 'T = 449\\times0.00245 + 3525\\times0.01817 + 6823.3\\times0.1348 + 5520.3 = 6505\\ \\mathrm{K}' }
      ],
      a: '6505 K, which is why D65 is called "6500 K" daylight.'
    },
    {
      title: 'Matching film to a lamp',
      q: 'Photographic film balanced for 5500 K daylight is used under 3200 K studio lamps. By how many mired must the light be shifted, and which way?',
      steps: [
        { text: 'The two points on the mired scale:', tex: 'M_{3200} = \\frac{10^6}{3200} = 312.5 \\qquad M_{5500} = \\frac{10^6}{5500} = 181.8' },
        'To make 3200 K light look like 5500 K, it must be shifted by 181.8 − 312.5 = −131 mired, bluer. A strongly blue filter of about that value does it.'
      ],
      a: '−131 mired: a blue conversion filter. The same filter shifts any light by the same number of mired, whatever its starting temperature.'
    }
  ],
  quiz: [
    { q: 'Which has the higher colour temperature?', choices: ['A candle flame', 'A filament lamp', 'Overcast daylight', 'A halogen lamp'], a: 2, why: 'Candle 1850 K, filament 2700 K, halogen 3000 K, overcast daylight about 6500 K. Higher temperatures look "cooler", bluer.' },
    { q: 'Two lamps both have a colour temperature of 4000 K. Then they must render colours alike.', a: false, why: 'The colour temperature only names the colour of the light. The spectra can differ greatly, so Ra may be 60 for one and 95 for the other.' },
    { q: 'A lamp has a colour rendering index of exactly 100. What does that tell you?', choices: ['It is a very bright lamp', 'It shows the eight test samples exactly as the reference light of the same colour temperature does', 'It has a high colour temperature', 'It uses little power'], a: 1, why: 'Ra = 100 means no colour shift from the reference: true of a filament lamp, a halogen lamp, or daylight.' },
    { q: 'What is the mired value of a 4000 K light?', answer: 250, why: 'M = 10⁶/4000 = 250.' },
    { q: 'A lamp has an Ra of 85 and an R9 of 5. What would you expect?', choices: ['Pale colours look fine but saturated reds look dull', 'It is a very warm lamp', 'It must be a filament lamp', 'The lamp flickers'], a: 0, why: 'Ra averages pastel samples; R9 tests a strong red, which a spectrum with little deep-red light cannot render.' }
  ],
  applications: [
    'Choosing lamps: 2700–3000 K and Ra of 80 or more for homes, 3500–4000 K for offices, Ra of 90 or more for galleries and colour matching.',
    'Photography and film: white balance, colour-conversion filters in mired.',
    'Colour-critical industries: print, textile and paint inspection under 5000 K or 6500 K viewing booths of Ra above 90.',
    'Retail: food, clothing and cosmetics lit with a high R9 so that reds and skin look natural.',
    'Specifying displays: the white point of a screen is quoted as a colour temperature, such as 6500 K.'
  ],
  history: 'The CIE published the first method for specifying colour rendering in 1965, revised it in 1974 and in 1995 (CIE 13.3), and it has hardly changed since. The spiky spectra of fluorescent tubes and LEDs exposed its limits, and the IES TM-30 method (2015) and CIE 224 (2017) added more samples and a gamut measure.',
  sources: [
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* (Wiley, 2nd edition) — colour temperature, correlated colour temperature and the Planckian locus.',
    'CIE 13.3-1995, *Method of Measuring and Specifying Colour Rendering Properties of Light Sources*.',
    'IES TM-30, *Method for Evaluating Light Source Color Rendition*; CIE 224:2017, *CIE 2017 Colour Fidelity Index for accurate scientific use*.',
    'C. S. McCamy, "Correlated color temperature as an explicit function of chromaticity coordinates", *Color Research and Application* 17 (1992).'
  ],
  sim: [{ id: 'la-rendering', params: {} }]
},

/* ================================================================ lamp bases and bulb shapes */
{
  id: 'lamp-bases-and-bulb-shapes', parent: 'lamp-families', title: 'Lamp bases and bulb shapes', level: 1,
  short: 'The letters and numbers on a lamp are a code. In E27, GU10 or G13 the letters say how the cap fits and the number is a size in millimetres; in A60, MR16 or T8 the letters say the shape of the bulb and the number its diameter, in millimetres or in eighths of an inch.',
  keywords: ['lamp base', 'lamp cap', 'E27', 'E14', 'E26', 'B22', 'GU10', 'GU5.3', 'G9', 'G13', 'G5', 'R7s', 'MR16', 'PAR38', 'A60', 'A19', 'T8', 'bulb shape', 'IEC 60061', 'Edison screw', 'bayonet'],
  prereq: ['incandescent-lamps'],
  related: ['halogen-lamps', 'fluorescent-lamps', 'lamp-efficacy-and-lifetime', 'high-intensity-discharge-lamps', 'filter-threads-and-lens-accessories', 'reading-an-optics-catalogue'],
  body: `
Pick up a lamp and the packet says **E27 · A60 · 806 lm · 2700 K · 230 V**. Every part is a code, and none is hard: the letters say what kind of thing it is, the number a size.

### The cap
The **cap** (or base) fits the lamp to the holder, makes the electrical contacts and in some designs positions the light source. IEC 60061 gives the designations:

| Code | Kind | The number | Typical use |
|---|---|---|---|
| E27 | Edison screw | thread diameter, 27 mm | the standard mains lamp (230 V) |
| E26 | Edison screw | 26 mm | the standard lamp of North America (120 V) |
| E14 | Edison screw | 14 mm | small "candle" lamps |
| E12 | Edison screw | 12 mm | candelabra lamps (120 V) |
| E40 | Edison screw | 40 mm | high-power HID and street lamps |
| B22d | bayonet | cap diameter, 22 mm | UK, India, Australia |
| GU10 | twist-lock, two studs | stud spacing, 10 mm | mains reflector spots |
| GU5.3 | two pins | pin spacing, 5.33 mm | 12 V reflector spots (MR16) |
| G4 | two pins | 4 mm | 12 V capsules |
| G9 | two loops | 9 mm | mains capsules |
| G13 | two pins at each end | 12.7 mm | T8 and T12 tubes |
| G5 | two pins at each end | 5 mm | T5 tubes |
| R7s | recessed contact at each end | contact diameter, 7 mm | linear halogen floodlight lamps |

The letters: **E** is Edison screw, **B** bayonet, **G** pins, **R** a recessed contact, **P** a prefocus flange. Extra letters after the first mark a variant: the **U** of GU is the twist-lock, **d** and **s** in B22d and R7s say double or single contact. For screws and bayonets the number is a *diameter*; for pin caps it is the *distance between the pins*.

> [!warn] The same shape does not mean the same supply. A GU10 lamp runs on the mains and a GU5.3 on 12 V from a transformer; E26 (120 V) and E27 (230 V) caps are close enough to confuse. A lamp in the wrong holder can be destroyed, and can be a hazard.

### The bulb
The **bulb code** is a letter or two for the shape and a number for the largest diameter:

| Code | Shape | Diameter |
|---|---|---|
| A60 (A19) | arbitrary: the classic pear | 60 mm |
| C35 (B11) | candle | 35 mm |
| G95 (G30) | globe | 95 mm |
| MR16 | multifaceted reflector | 51 mm |
| PAR38 | pressed parabolic aluminised reflector | 121 mm |
| T5, T8, T12 | tube | 16, 26, 38 mm |

In IEC (European) codes the number is in **millimetres**: A60 is 60 mm across. In North American codes the number is in **eighths of an inch**: A19 is 19/8 = 2.375 in = 60 mm, which is why it is the same lamp. PAR38 is 38/8 in = 121 mm, MR16 is 2 in = 51 mm and T8 is exactly one inch. See the formula below.

### Reading a lamp
**LED A60 E27 8.5 W 806 lm 2700 K Ra 80 230 V** is a pear-shaped LED lamp, 60 mm across, with a 27 mm Edison screw, taking 8.5 W from 230 V and giving 806 lumens (the light of an old 60 W lamp: 95 lm/W) in a warm white of 2700 K with a colour rendering of 80.

> [!key] A cap code gives its kind by letter (E screw, B bayonet, G pins) and a size in millimetres (diameter, or pin spacing); a bulb code gives the shape by letters and the diameter in millimetres, or in eighths of an inch in North America.
`,
  ideas: [
    'The letter of a cap code names the kind (E screw, B bayonet, G pins, R recessed contact); the number is a diameter or a pin spacing in mm.',
    'A bulb code is a shape letter and the largest diameter: in mm in IEC codes, in eighths of an inch in North American ones.',
    'A60 and A19, MR16 and PAR38, T8: the American numbers are 8 times the diameter in inches.',
    'The same-looking caps may be for different supplies: GU10 is mains, GU5.3 is 12 V; E26 is 120 V, E27 is 230 V.',
    'The cap is only the fit: power, light, colour temperature and voltage are printed separately.'
  ],
  pitfalls: [
    'E26 and E27 are the same thing — They differ by a millimetre, they sometimes fit each other, and they are for 120 V and 230 V. A lamp in the wrong supply is destroyed.',
    'The number in G4 or GU10 is a diameter — It is the distance between the two pins or studs (4 mm and 10 mm). Only for E, B and P bases is it a diameter.',
    'A T8 tube is 8 mm wide — T means tube and 8 is in eighths of an inch: 8/8 in = 25.4 mm.',
    'Lamps of the same cap are interchangeable — The cap only fits. The voltage, power, dimmer compatibility, the size of the bulb in the fitting and the heat the fitting can bear must all agree.'
  ],
  terms: [
    { term: 'Lamp cap', also: ['lamp base', 'cap', 'base'], def: 'The part of a lamp that fits its holder and makes the electrical connection. The designations (E27, GU10, G13 …) are standardised in IEC 60061.' },
    { term: 'Edison screw', also: ['E27', 'E14', 'ES'], def: 'A cap with a screw thread; the number is the outside diameter of the thread in millimetres. E27 is the usual mains cap, E14 the "small" one.' },
    { term: 'Bayonet cap', also: ['B22', 'BC'], def: 'A cap with two pins on its side that engage slots in the holder and are held by a spring: push and twist. The number is the diameter in millimetres.' },
    { term: 'Pin base', also: ['G4', 'G9', 'GU5.3', 'GU10', 'G13'], def: 'A cap whose connections are two pins (or studs): the letter G, a number that is the distance between them in millimetres. G13 and G5 are the tube caps.' },
    { term: 'Bulb shape code', also: ['A60', 'MR16', 'PAR38', 'T8'], def: 'A designation of the shape of the glass (A pear, C candle, G globe, R, PAR, MR reflectors, T tube) and its largest diameter in millimetres, or in eighths of an inch in North America.' }
  ],
  formulas: [
    {
      name: 'North American bulb number to millimetres',
      expr: 'D = n*25.4/8', tex: 'D = n\\,\\frac{25.4}{8}\\ \\mathrm{mm}',
      vars: {
        D: { name: 'diameter of the bulb', q: 'length', unit: 'mm' },
        n: { name: 'the number of the code, in eighths of an inch', value: 19, int: true, min: 1, max: 60 }
      },
      note: 'A19 → 60 mm; PAR38 → 121 mm; MR16 → 51 mm; T8 → 25.4 mm. The same formula, solved for n, gives the number of a given diameter.',
      stories: { D: 'A lamp is labelled with the number {n} in eighths of an inch (PAR{n}). How wide is it?', n: 'A bulb is {D} wide. What is its number in eighths of an inch?' }
    }
  ],
  examples: [
    {
      title: 'Which lamp is it?',
      q: 'A box says "PAR30" and another says "MR16". Find the diameters and decide which is larger.',
      steps: [
        { text: 'Eighths of an inch to millimetres:', tex: '\\mathrm{PAR30}: 30\\times\\frac{25.4}{8} = 95\\ \\mathrm{mm} \\qquad \\mathrm{MR16}: 16\\times\\frac{25.4}{8} = 51\\ \\mathrm{mm}' }
      ],
      a: 'PAR30 is 95 mm across, MR16 51 mm: the PAR lamp is nearly twice as wide. MR16 is a 2-inch lamp.'
    },
    {
      title: 'Decoding a package',
      q: 'A package reads "G9 ... 230 V" and another "GU5.3 ... 12 V". What do the codes tell you about the holders?',
      steps: [
        'G9: two loop pins 9 mm apart, for a mains-voltage capsule. GU5.3: two pins 5.33 mm apart with a twist-lock, for a 12 V lamp.',
        'The two are not interchangeable: the pin spacing differs, but more importantly so does the voltage.'
      ],
      a: 'G9 is a 230 V holder with pins 9 mm apart; GU5.3 a 12 V holder with pins 5.33 mm apart, fed by a transformer.'
    }
  ],
  quiz: [
    { q: 'What does the 27 in E27 mean?', choices: ['27 watts', '27 mm: the outside diameter of the screw thread', '27 volts', 'The 27th edition of the standard'], a: 1, why: 'E is Edison screw and the number is the outside diameter of the thread in millimetres. E14 is 14 mm, E40 is 40 mm.' },
    { q: 'What does the 10 in GU10 mean?', choices: ['A 10 mm thread', 'The distance between the two studs, in millimetres', '10 watts', 'A 10° beam'], a: 1, why: 'For pin caps the number is the distance between the pins (or studs). GU10 has them 10 mm apart.' },
    { q: 'A T8 lamp is 8 mm in diameter.', a: false, why: 'T8 is 8/8 inch, 25.4 mm. T5 is 16 mm and T12 is 38 mm.' },
    { q: 'What is the diameter, in millimetres, of a PAR38 lamp?', answer: 120.65, unit: 'mm', why: '38 × 25.4/8 = 120.65 mm: 4¾ inches.' },
    { q: 'A lamp of A19 and one of A60 are…', choices: ['different sizes', 'the same size: 19/8 inch is 60 mm', 'A60 is larger by a factor of three', 'one is for 12 V'], a: 1, why: 'A19 is the North American code, in eighths of an inch (19/8 in = 60 mm); A60 is the IEC code, in millimetres.' }
  ],
  applications: [
    'Choosing a replacement lamp, or an LED retrofit, for an existing fitting.',
    'Specifying lamps for a design: the cap and bulb codes in a lighting schedule.',
    'Recognising the supply voltage from the cap: a GU10 is mains, a GU5.3 is 12 V.',
    'Machine-vision and microscope lamp houses, which use the same capsule and tube caps.',
    'Maintenance: stocking a few cap types (E27, E14, GU10, G13) for most buildings.'
  ],
  history: 'The screw cap goes back to Edison\'s lamps of 1879–1880, the bayonet to Swan\'s company; both have survived a century of change in the lamp inside them. The designations were fixed by the IEC (60061), while the bulb codes come from the American glass-bulb nomenclature, which counts eighths of an inch.',
  sources: [
    'IEC 60061-1, *Lamp caps and holders together with gauges for the control of interchangeability and safety — Part 1: Lamp caps* — the cap designations and dimensions.',
    'ANSI C79.1, *Nomenclature for Glass Bulbs Intended for Use with Electric Lamps* — the bulb shape codes in eighths of an inch.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — lamp shapes and caps.'
  ],
  sim: [{ id: 'la-bases', params: {} }]
},

/* ================================================================ efficacy and lifetime */
{
  id: 'lamp-efficacy-and-lifetime', parent: 'lamp-families', title: 'Efficacy and lifetime', level: 2,
  short: 'Efficacy is the lumens a lamp makes per watt it takes; life is how long it goes on doing so. Together they decide what a light costs. A filament lamp gives 8–17 lm/W for 1000 hours, a sodium lamp up to 180, an LED 80–200 for tens of thousands, and no white light can pass about 350 lm/W.',
  keywords: ['luminous efficacy', 'lm/W', 'efficacy', 'rated life', 'L70', 'lumen maintenance', 'median life', 'B50', 'LM-80', 'TM-21', 'luminaire efficacy', 'energy', 'lifetime', 'lamp cost', 'depreciation', 'ballast loss'],
  prereq: ['how-light-is-made', 'the-luminosity-function'],
  related: ['incandescent-lamps', 'fluorescent-lamps', 'high-intensity-discharge-lamps', 'sodium-lamps', 'white-leds', 'drivers-dimming-and-flicker', 'lumens-candelas-lux-and-nits', 'room-lighting-and-luminaires', 'ergonomics:lighting-levels'],
  body: `
Two numbers sit on every lamp packet beside its power: the light, in lumens, and the life, in hours. The first divided by the power is the **efficacy**; the second says how long it lasts. Both come from how the light is made ([[how-light-is-made]]).

### Efficacy
The **luminous efficacy** of a lamp is its luminous flux divided by the electrical power it takes, in lm/W. It is a product of two factors:
$$K = \\eta\\,\\mathrm{LER}$$
where η is the share of the electrical power that comes out as visible radiation and the **luminous efficacy of radiation** (LER) is how many lumens each watt of that radiation gives. LER depends only on the spectrum: 683 lm/W at 555 nm, 523 at the sodium line, 12 for a 2700 K filament, 356 for a triphosphor tube, about 330 for a white LED. A perfect white source with good colour rendering has an LER of 250–350, so that is the limit of white lighting.

| Family | Efficacy (lm/W) | Life (hours) | Ra | Start |
|---|---|---|---|---|
| Filament | 8–17 | 750–2000 | 100 | instant |
| Halogen | 14–25 | 2000–5000 | 100 | instant |
| Compact fluorescent | 45–75 | 6000–15 000 | 80–90 | warms up in a minute |
| Fluorescent tube | 60–105 | 10 000–30 000 | 60–95 | seconds |
| Mercury | 35–60 | 16 000–24 000 | 15–55 | 4–7 min |
| Metal halide | 70–115 | 6000–20 000 | 65–95 | 2–5 min |
| High-pressure sodium | 80–140 | 16 000–30 000 | 20–25 | 3–5 min |
| Low-pressure sodium | 100–180 | 14 000–18 000 | 0 | 7–15 min |
| White LED | 80–200 | 15 000–50 000 | 70–98 | instant |

### What the number leaves out
The lamp is not the whole luminaire. The **ballast** or **driver** takes 5–15 % of the power; the fitting absorbs and redirects part of the light (its light output ratio is 60–90 %); and what counts is the light that reaches the task. Efficacy also says nothing about colour: the most efficient lamp of the table gives no colour at all ([[sodium-lamps]]).

### Life
For filaments and discharge lamps the **rated life** is the **median life**: the time by which half of a large batch have failed (often written B50), measured under standard conditions, for discharge lamps with a fixed number of hours per start (three for tubes). For LEDs nothing "burns out" at once: the chip fades slowly, so life is **L70** (or L80, L90): the time at which the light has fallen to 70 % of its initial value. It is projected from at least 6000 hours of measurements on the LED package (IES LM-80), by the method of IES TM-21, which allows an extrapolation of up to six times the measured time.

### What shortens it
- **Voltage** on filaments: life goes as $V^{-13}$ ([[incandescent-lamps]]).
- **Temperature** on LEDs and drivers: by the rule of thumb of electronics, every 10 °C of extra temperature halves the life of the electrolytic capacitors in the driver, which usually fail before the chips do.
- **Starts** on fluorescent and HID lamps: each one wears the electrodes.
- Vibration, humidity and a poor supply.
Lumen maintenance, the fading of the light, differs too: a tube keeps 85–95 % at the end of its life, a metal halide lamp 60–80 %, an LED follows the slow curve in the simulation.

> [!key] Efficacy is η × LER: how much power becomes visible radiation times how many lumens each watt of it gives. Life is a median for filament and discharge lamps and the L70 time for LEDs. Cost is purchase, energy and replacement; the energy is usually the largest part.
`,
  ideas: [
    'Efficacy K = lumens ÷ electrical watts = η × LER; the LER is set by the spectrum and cannot exceed 683 lm/W, or about 250–350 for white.',
    'Filament lamps give 8–17 lm/W, discharge lamps 35–180, white LEDs 80–200.',
    'Ballast, driver and fitting losses lower the efficacy of the luminaire below that of the lamp; efficacy says nothing about colour.',
    'Rated life is the median life for filament and discharge lamps and L70 (the time to 70 % of the light) for LEDs.',
    'Voltage (filaments), temperature (LEDs, drivers) and starts (discharge lamps) shorten life; most of the cost of light is the energy.'
  ],
  pitfalls: [
    'A lamp of 50 000 hours will last 50 000 hours — The figure is the L70 of the LED chips, a statistical projection. The driver, a poor heat path or a hot fitting can end the lamp much earlier, and "50 000 h" does not mean it stops giving light at that time.',
    'Efficacy is the quality of the light — It counts lumens per watt and nothing else. A low-pressure sodium lamp has the highest efficacy and no colour rendering.',
    'The lumens on the packet reach the floor — They are the flux of the lamp. A luminaire loses part, and the light reaches the task diminished by the distance and by the room (the utilisation factor).',
    'Switching a lamp on and off wastes the energy saved — The energy of a start is that of seconds of running. The cost of starting is in electrode wear for discharge lamps, and nothing for LEDs.'
  ],
  terms: [
    { term: 'Luminous efficacy of a source', also: ['efficacy', 'lm/W'], def: 'The luminous flux of a lamp divided by the electrical power it takes, in lumens per watt. Not to be confused with the efficacy of radiation, which is per optical watt.' },
    { term: 'Luminous efficacy of radiation', also: ['LER'], def: 'The lumens per watt of radiated power that a given spectrum produces: 683 lm/W at 555 nm, about 330 for a white LED, 12 for a 2700 K filament.' },
    { term: 'Rated life', also: ['median life', 'B50', 'average rated life'], def: 'The time after which half of a large batch of lamps have failed under standard test conditions. For LEDs the figure is usually an L70 time instead.' },
    { term: 'L70', also: ['L80', 'L90', 'lumen maintenance life'], def: 'The time at which an LED source has fallen to 70 % (80 %, 90 %) of its initial light output. It is projected from measurements by the IES TM-21 method.' },
    { term: 'Lumen maintenance', also: ['lumen depreciation'], def: 'How well a lamp keeps its light over its life, as a fraction of its initial output at a given number of hours.' },
    { term: 'Luminaire efficacy', also: ['system efficacy'], def: 'The luminous flux that leaves a complete luminaire divided by the power it takes from the supply, including the ballast or driver and the optics.' }
  ],
  formulas: [
    {
      name: 'Efficacy of the luminaire from the lamp',
      expr: 'Ks = K*ed*eL', tex: 'K_s = K\\,\\eta_d\\,\\eta_L',
      vars: {
        Ks: { name: 'efficacy of the luminaire', q: 'efficacy', unit: 'lm/W', tex: 'K_s' },
        K: { name: 'efficacy of the lamp or LED module', q: 'efficacy', unit: 'lm/W', value: 150 },
        ed: { name: 'efficiency of the driver or ballast', q: 'ratio', unit: '%', value: 90, min: 0, max: 100, tex: '\\eta_d' },
        eL: { name: 'light output ratio of the fitting', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: '\\eta_L' }
      },
      stories: { Ks: 'An LED module gives {K}. Its driver is {ed} efficient and the fitting lets {eL} of the light out. What is the efficacy of the luminaire?' }
    },
    {
      name: 'Fading of the light',
      expr: 'Phi = Phi0*exp(-t/tau)', tex: '\\Phi = \\Phi_0\\,e^{-t/\\tau}',
      vars: {
        Phi: { name: 'light output at time t', q: 'luminousflux', unit: 'lm', tex: '\\Phi' },
        Phi0: { name: 'initial light output', q: 'luminousflux', unit: 'lm', value: 800, tex: '\\Phi_0' },
        t: { name: 'time of use', q: 'time', unit: 'h', value: 10000, min: 0 },
        tau: { name: 'time constant of the fading', q: 'time', unit: 'h', value: 140000, tex: '\\tau' }
      },
      note: 'The usual model of LED lumen maintenance (TM-21 fits this form). The L70 time is τ ln(1/0.7) = 0.357 τ.',
      stories: { Phi: 'An LED lamp starts at {Phi0} and fades with a time constant of {tau}. What does it give after {t}?', t: 'An LED lamp starts at {Phi0} and its light fades with a time constant of {tau}. After how many hours does it give {Phi}?' }
    },
    {
      name: 'The ten-degree rule',
      expr: 'L = L0*2^(-(T - T0)/10)', tex: 'L = L_0\\,2^{-(T - T_0)/10}',
      vars: {
        L: { name: 'life at temperature T', q: 'time', unit: 'h' },
        L0: { name: 'life at the rated temperature', q: 'time', unit: 'h', value: 50000, tex: 'L_0' },
        T: { name: 'working temperature', q: 'temperature', unit: '°C', value: 85, min: -40, max: 200 },
        T0: { name: 'rated temperature', q: 'temperature', unit: '°C', value: 65, tex: 'T_0' }
      },
      note: 'A rule of thumb of electronics (the Arrhenius law in rough form), used for the electrolytic capacitors in drivers; it is not a law for every failure.'
    }
  ],
  examples: [
    {
      title: 'What does the light cost?',
      q: 'A 60 W filament lamp (700 lm) and a 8 W LED lamp (800 lm) each burn 3 hours a day. With electricity at 0.25 per kWh, what does each cost to run for a year, and what are their efficacies?',
      steps: [
        'Hours: 3 × 365 = 1095 h. Energy: 60 W × 1095 h = 65.7 kWh and 8 W × 1095 h = 8.8 kWh.',
        'Cost: 65.7 × 0.25 = 16.4 and 8.8 × 0.25 = 2.2 a year. Efficacies: 700/60 = 11.7 lm/W and 800/8 = 100 lm/W.'
      ],
      a: 'About 16.4 against 2.2 per year, and 12 lm/W against 100. The saving, 14 a year, repays an LED lamp within months, and its 15 000+ hours cover 14 years of this use.'
    },
    {
      title: 'How much light is left?',
      q: 'An LED lamp is rated L70 = 50 000 h. Take the exponential model: what time constant does that mean, and how much light remains after 10 000 hours?',
      steps: [
        { text: 'At L70 the light is 70 %: $e^{-50000/\\tau} = 0.7$, so', tex: '\\tau = \\frac{50\\,000\\ \\mathrm{h}}{\\ln(1/0.7)} = 140\\,000\\ \\mathrm{h}' },
        { text: 'After 10 000 hours:', tex: '\\Phi/\\Phi_0 = e^{-10\\,000/140\\,000} = 0.93' }
      ],
      a: 'τ = 140 000 h, and 93 % of the light is left after 10 000 hours (about nine years at three hours a day).'
    }
  ],
  quiz: [
    { q: 'What does an LED "L70 = 50 000 hours" mean?', choices: ['The lamp fails at 50 000 hours', 'Its light has fallen to 70 % of the initial value by 50 000 hours', 'It uses 70 % of its rated power', '70 % of lamps work at 50 000 hours'], a: 1, why: 'LEDs fade rather than fail. L70 is the time at which the light output has dropped to 70 %, projected from measurements.' },
    { q: 'Which has the highest luminous efficacy of radiation (LER)?', choices: ['A 2700 K filament', 'A white LED', 'A low-pressure sodium lamp', 'A halogen lamp'], a: 2, why: 'The sodium line at 589 nm gives 523 lm per optical watt; a white LED about 330, a halogen lamp 21, a filament 12.' },
    { q: 'A lamp with the highest efficacy gives the best light.', a: false, why: 'Efficacy counts lumens per watt only. The low-pressure sodium lamp is the most efficient and shows no colour at all.' },
    { q: 'An LED module gives 150 lm/W; its driver is 90 % efficient and its fitting passes 80 % of the light. What is the efficacy of the luminaire, in lm/W?', answer: 108, unit: 'lm/W', why: '150 × 0.90 × 0.80 = 108 lm/W.' },
    { q: 'A driver capacitor has a rated life of 10 000 h at 85 °C. By the ten-degree rule, how long might it last at 65 °C?', choices: ['5000 h', '10 000 h', '20 000 h', '40 000 h'], a: 3, why: 'Every 10 °C cooler doubles the life: 20 °C cooler is two doublings, 40 000 h.' }
  ],
  applications: [
    'Choosing and comparing lamps: lumens, watts and life on the packet turn into an annual cost.',
    'Energy regulations and labels, which set minimum efficacies (for example 85 lm/W in the EU from 2021) and ban the lamps that fall below them.',
    'Lighting design: luminaire efficacy and lumen maintenance factors in the lumen method.',
    'Specifying LED modules: LM-80 data and the TM-21 projection give the L70 time for a given junction temperature.',
    'Maintenance planning: group relamping at about 70 % of the median life, or LED modules replaced when the light has fallen to the design limit.'
  ],
  history: 'Edison\'s first carbon lamps of the 1880s gave about 3 lm/W; drawn tungsten filaments brought 10 lm/W by the 1910s, fluorescent tubes 30–50 lm/W in 1938 and sodium and high-pressure sodium lamps 100 lm/W by the 1960s and 1970s. White LEDs started at a few lm/W in 1996, passed 100 lm/W around 2010, and the best commercial ones now exceed 200.',
  sources: [
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — efficacy, lamp life and lumen maintenance of every lamp family.',
    'IES LM-80, *Measuring Luminous Flux and Color Maintenance of LED Packages, Arrays and Modules*, and IES TM-21, *Projecting Long-Term Luminous Flux Maintenance of LED Lamps and Luminaires*.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — efficacy and life across the lamp families.'
  ],
  sim: [{ id: 'la-efficacy', params: {} }]
},

/* ================================================================ drivers, dimming and flicker */
{
  id: 'drivers-dimming-and-flicker', parent: 'lamp-families', title: 'Drivers, dimming and flicker', level: 2,
  short: 'An LED must be fed a controlled current, which is the job of its driver. Dimming is done by lowering that current or by switching it on and off quickly (PWM). The light then varies with time; how much, and how fast, decides whether it is seen as flicker or as odd motion, or not at all.',
  keywords: ['LED driver', 'constant current', 'constant voltage', 'PWM dimming', 'phase-cut dimmer', 'triac', 'DALI', '0-10 V', 'flicker', 'percent flicker', 'flicker index', 'stroboscopic effect', 'phantom array', 'ripple', 'IEEE 1789', 'dimming'],
  prereq: ['light-emitting-diodes', 'incandescent-lamps'],
  related: ['white-leds', 'lamp-efficacy-and-lifetime', 'stroboscopic-effects', 'flicker-and-persistence-of-vision', 'triggering-and-strobing', 'rolling-and-global-shutter', 'fluorescent-lamps', 'electronics:pwm', 'electronics:leds'],
  body: `
An incandescent lamp is a resistor: connect it to the mains and it works. A **light-emitting diode** is not. Its current rises ever more steeply with voltage and its forward voltage falls by about 2 mV for each kelvin of warming, so a LED held at a fixed voltage draws more current as it heats, which heats it more. A LED is therefore fed a **controlled current**, and the circuit that does it is the **driver**.

### Drivers
A small indicator LED can run from a series resistor, $R = (V_s - V_f)/I$ ([[light-emitting-diodes]]), which wastes the difference in voltage. Lighting LEDs use a **constant-current driver**: a switching converter, 85–95 % efficient, that turns the mains into a stable current of 350, 700 or 1050 mA or more, whatever the voltage of the LED string. Strips for 12 or 24 V use constant-voltage supplies with a current regulator on the strip. The weak parts of a cheap driver are its electrolytic capacitor, whose life halves for each 10 °C, and the **ripple**: unsmoothed, the current and the light follow the rectified mains.

### Dimming
- **Analogue**: lower the current. Efficiency of a chip even rises slightly, but the colour shifts a little.
- **PWM** (pulse-width modulation): keep the current at its full value and switch it on and off at a fixed frequency, the **duty cycle** setting the average. The colour stays constant, so it is the usual method, 100 Hz to 25 kHz or more.
- **Phase-cut dimmers** cut a slice of every mains half-cycle with a triac. Made for filament lamps, they suit only drivers marked dimmable and compatible, above a minimum load.
- **Control signals**: 0–10 V, DALI (a digital bus, IEC 62386), DMX512 on stage.
Perceived brightness is not proportional to light: 25 % of the light looks about half as bright, so dimming curves are nonlinear. "Dim-to-warm" lamps lower the colour temperature as they dim, like a filament lamp.

### Flicker
Light that is not steady is described by two numbers over one cycle:
$$\\text{percent flicker} = 100\\,\\frac{L_{\\max} - L_{\\min}}{L_{\\max} + L_{\\min}}$$
and the **flicker index**, the part of the area above the mean. Frequency matters as much:

| Source | Modulation at | Percent flicker |
|---|---|---|
| Filament lamp | 100 / 120 Hz | about 5–15 % (the hot wire smooths it) |
| Fluorescent, magnetic ballast | 100 / 120 Hz | 20–40 % |
| Fluorescent, electronic ballast | 20–50 kHz | a few % |
| LED, cheap driver | 100 / 120 Hz | up to 100 % |
| LED, good driver | 100 / 120 Hz | under 5 % |
| LED dimmed by PWM | the PWM frequency | up to 100 % |

Below about 80–90 Hz the eye sees **visible flicker**. Higher up, moving objects and eye movements still reveal it: the **stroboscopic effect** (moving things look stepped or still) and the **phantom array** (ghost images of a light when the eye jumps), up to a kilohertz or two. IEEE 1789 and the CIE visibility measures relate modulation, frequency and visibility.

> [!warn] The stroboscopic effect is a workshop hazard. Under a lamp that flickers deeply at 100 Hz, a saw blade or a drill chuck turning at 1500 rpm can look stopped. Never judge by eye that a machine has stopped: lock it out first.

> [!key] A LED needs a controlled current, a driver; it is dimmed by lowering the current or by PWM. The light's variation is measured by percent flicker and flicker index and judged by frequency: slow flicker is seen, fast modulation shows as the stroboscopic effect, and above a few kilohertz it is gone.
`,
  ideas: [
    'LEDs need a controlled current: the current rises steeply with voltage and the forward voltage falls as the chip warms.',
    'Dimming is by lowering the current or by PWM, at constant colour; on the mains by phase-cut dimmers or control signals such as DALI and 0–10 V.',
    'Percent flicker = 100 (max − min)/(max + min); the flicker index is the area above the mean.',
    'Flicker is seen below about 90 Hz; the stroboscopic effect and the phantom array extend up to a kilohertz or two.',
    'A rotating machine can seem stationary under a flickering light: a safety hazard.'
  ],
  pitfalls: [
    'Flicker you cannot see does no harm — Some people feel headache and eyestrain at flicker they cannot report, and the stroboscopic effect shows up well above the rate at which flicker is seen.',
    'A higher PWM frequency reduces the percent flicker — The depth is the same, the pulses are just faster. A higher frequency makes the flicker less visible, not smaller.',
    'An LED is dimmed by lowering its voltage — The light follows the current. The voltage hardly changes over the working range, so a dimmer must control the current.',
    'Any LED lamp works with any dimmer — A phase-cut dimmer made for filament lamps needs a driver that follows its cut waveform and a minimum load; a poor match flickers, buzzes or does not dim.'
  ],
  terms: [
    { term: 'LED driver', also: ['driver', 'power supply'], def: 'The electronic circuit that supplies an LED or a string of LEDs with the controlled current it needs, from the mains or from a low-voltage supply.' },
    { term: 'PWM dimming', also: ['pulse-width modulation'], def: 'Dimming by switching the current fully on and off at a fixed frequency and changing the share of time it is on, the duty cycle.' },
    { term: 'Phase-cut dimming', also: ['triac dimmer', 'leading-edge dimmer', 'trailing-edge dimmer'], def: 'A mains dimmer that conducts for only part of each half-cycle. Leading-edge types suit filament lamps and magnetic transformers; trailing-edge types suit electronic drivers.' },
    { term: 'Percent flicker', also: ['modulation depth', 'flicker percentage'], def: '100 × (Lmax − Lmin)/(Lmax + Lmin) over one cycle of the light: 0 for steady light, 100 % when the light goes completely out.' },
    { term: 'Flicker index', def: 'The area of the light curve above its mean, divided by its total area, over one cycle. It runs from 0 (steady) up to about 0.5.' },
    { term: 'Stroboscopic effect', def: 'The change in the apparent motion of moving or rotating objects under light that varies in time. A wheel can appear to stand still, to creep or to turn backwards.' },
    { term: 'Phantom array', also: ['phantom array effect'], def: 'A row of separate ghost images of a flickering light that appears when the eyes make a saccade, or the light moves, across the field of view.' }
  ],
  formulas: [
    {
      name: 'Percent flicker',
      expr: 'F = (Lmax - Lmin)/(Lmax + Lmin)', tex: 'F = \\frac{L_{\\max} - L_{\\min}}{L_{\\max} + L_{\\min}}',
      vars: {
        F: { name: 'flicker', q: 'ratio', unit: '%' },
        Lmax: { name: 'highest light in a cycle', value: 1.0, tex: 'L_{\\max}' },
        Lmin: { name: 'lowest light in a cycle', value: 0.6, tex: 'L_{\\min}' }
      },
      note: 'The two lights in any unit. 100 % means that the light goes out completely in each cycle.',
      stories: { F: 'The light of a lamp varies from {Lmin} to {Lmax} of its peak over each cycle. What is the percent flicker?' }
    },
    {
      name: 'Average of a PWM-dimmed LED',
      expr: 'Iav = D*Ipk', tex: 'I_{\\mathrm{av}} = D\\,I_{\\mathrm{pk}}',
      vars: {
        Iav: { name: 'average current', q: 'current', unit: 'mA', tex: 'I_{\\mathrm{av}}' },
        D: { name: 'duty cycle', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 },
        Ipk: { name: 'current during the pulse', q: 'current', unit: 'mA', value: 350, tex: 'I_{\\mathrm{pk}}' }
      },
      note: 'The light, which follows the current, is proportional to the duty cycle (colour and efficiency hold as at full current).'
    },
    {
      name: 'Apparent motion under a flickering light',
      expr: 'fa = N*fr - k*fl', tex: 'f_a = N f_r - k f_l',
      vars: {
        fa: { name: 'apparent rate at which marks pass (negative: backwards)', q: 'frequency', unit: 'Hz', signed: true, tex: 'f_a' },
        N: { name: 'marks on the wheel', value: 4, int: true, min: 1, max: 60 },
        fr: { name: 'rotation rate of the wheel', q: 'frequency', unit: 'Hz', value: 24.5, tex: 'f_r' },
        k: { name: 'whole number of light pulses that is nearest', value: 1, int: true, min: 0, max: 200 },
        fl: { name: 'frequency of the light pulses', q: 'frequency', unit: 'Hz', value: 100, tex: 'f_l' }
      },
      note: 'The eye is shown the wheel only at the pulses of the light, so it sees marks pass at the difference between the true rate N·f_r and the nearest multiple of f_l. Zero: it seems to stand still.',
      stories: { fa: 'A wheel with {N} marks turns at {fr} under a light that pulses at {fl}. At what rate do the marks seem to pass (k = {k})?' }
    }
  ],
  examples: [
    {
      title: 'Standing still at 1500 rpm',
      q: 'A four-pole motor on 50 Hz mains turns a disc with four marks at 1500 rpm. A cheap LED lamp flickers at 100 Hz. What does the disc seem to do? And at 1470 rpm?',
      steps: [
        'At 1500 rpm the disc turns 25 times a second; four marks pass 100 times a second, exactly the rate of the light: $f_a = 4\\times 25 - 1\\times 100 = 0$.',
        'At 1470 rpm: 24.5 turns a second, 98 marks a second, $f_a = 98 - 100 = -2$ Hz: the marks seem to pass backwards at 2 per second, a turn every two seconds.'
      ],
      a: 'At 1500 rpm the disc seems to stand still; at 1470 rpm it seems to turn slowly backwards (30 rpm). The disc is really spinning: this is the stroboscopic hazard.'
    },
    {
      title: 'Dimming to a quarter',
      q: 'A driver gives 350 mA pulses to an LED at 1 kHz and a duty cycle of 25 %. What is the average current, the light compared with full, and the percent flicker?',
      steps: [
        { text: 'The average current:', tex: 'I_{\\mathrm{av}} = 0.25\\times 350 = 87.5\\ \\mathrm{mA}' },
        'The light follows the current: 25 % of full. During the pulse the light is full and between pulses it is zero, so the flicker is $100\\,(1 - 0)/(1 + 0) = 100\\ \\%$, at 1 kHz.'
      ],
      a: '87.5 mA, a quarter of the light and 100 % flicker at 1 kHz — too fast for visible flicker, but fast eye movements and moving objects can still reveal it.'
    }
  ],
  quiz: [
    { q: 'Why is an LED driven by a controlled current rather than a fixed voltage?', choices: ['A fixed voltage would make it dim', 'Its current rises steeply with voltage and its forward voltage falls as it warms, so a fixed voltage can run away', 'The light follows the voltage squared', 'A current source is cheaper'], a: 1, why: 'A small rise in voltage makes a large rise in current, and the warming chip needs less voltage still. A current source keeps the operating point.' },
    { q: 'PWM dimming of an LED to 50 % changes the colour of the light.', a: false, why: 'The current during the pulses is the full value, so the chip\'s colour and efficiency stay as at full power; only the average light falls.' },
    { q: 'A light varies between 40 % and 100 % of its peak. What is the percent flicker?', answer: 42.9, unit: '%', why: 'F = (1.0 − 0.4)/(1.0 + 0.4) = 0.6/1.4 = 42.9 %.' },
    { q: 'A wheel with 6 marks turns at 1000 rpm under a light pulsing at 100 Hz. What does it seem to do?', choices: ['Stands still', 'Turns backwards slowly', 'Turns forwards slowly', 'Turns at its true speed'], a: 0, why: '1000 rpm is 16.67 rps; six marks pass 100 times a second, exactly the rate of the light: it appears to stand still.' },
    { q: 'Which is likely to be the most visible, at the same percent flicker?', choices: ['Flicker at 20 kHz', 'Flicker at 100 Hz', 'Flicker at 5 kHz', 'They are equally visible'], a: 1, why: 'The visibility falls steeply with frequency: 100 Hz modulation shows as stroboscopic effects, while at 20 kHz neither the eye nor moving objects can follow it.' }
  ],
  applications: [
    'Lighting design: specifying dimmable drivers and compatible dimmers, DALI and 0–10 V control.',
    'Machine vision: constant-current LED lights and strobes, with exposures chosen against PWM frequency to avoid banding.',
    'Filming and photography: flicker causes bands in video and in rolling-shutter pictures when the shutter time and the light do not match.',
    'Workshop safety: choosing lamps with low flicker (or high frequency) in areas with rotating machinery.',
    'Display backlights, which are PWM-dimmed LEDs: some people are sensitive to low-frequency PWM.'
  ],
  history: 'Solid-state phase-cut dimmers, built on the thyristor and the triac of the late 1950s, replaced the resistive and autotransformer dimmers of theatres and homes in the 1960s. The DMX512 stage standard dates from 1986, the digital DALI bus (now IEC 62386) from the 1990s. As LED lighting spread, the IEEE published its recommended practice on flicker, IEEE 1789, in 2015.',
  sources: [
    'IEEE 1789-2015, *Recommended Practice for Modulating Current in High-Brightness LEDs for Mitigating Health Risks to Viewers*.',
    'CIE TN 006:2016, *Visual Aspects of Time-Modulated Lighting Systems — Definitions and Measurement Models*.',
    'E. F. Schubert, *Light-Emitting Diodes* (Cambridge University Press, 2nd edition, 2006) — drive circuits and the temperature dependence of the forward voltage.',
    'Illuminating Engineering Society, *The Lighting Handbook*, 10th edition (2011) — dimming and flicker.'
  ],
  sim: [{ id: 'la-flicker', params: {} }]
},

/* ================================================================ ultraviolet and infrared sources */
{
  id: 'uv-and-infrared-sources', parent: 'lamp-families', title: 'Ultraviolet and infrared sources', level: 2,
  short: 'Lamps and LEDs whose useful light lies just outside the visible range: ultraviolet (UV-A, UV-B, UV-C) for curing, inspection, disinfection and therapy, and infrared for heating, remote control, night vision and sensing. Their light is invisible, so it gives no warning of its hazards.',
  keywords: ['ultraviolet', 'infrared', 'UV-C', 'UV-B', 'UV-A', 'germicidal lamp', 'black light', 'UV LED', 'UV curing', 'IR LED', '850 nm', '940 nm', 'heat lamp', 'infrared heater', 'deuterium lamp', 'excimer lamp', 'photokeratitis', 'IR-A'],
  prereq: ['how-light-is-made', 'the-optical-spectrum'],
  related: ['light-emitting-diodes', 'fluorescent-lamps', 'halogen-lamps', 'incandescent-lamps', 'infrared-and-thermal-sensors', 'quantum-efficiency-and-spectral-response', 'night-vision-and-thermal-cameras', 'laser-eye-hazards-and-eyewear', 'physics:em-spectrum'],
  body: `
Visible light is the strip from 380 to 780 nm. The CIE divides the radiation next to it into **UV-C** (100–280 nm), **UV-B** (280–315 nm) and **UV-A** (315–400 nm), and **IR-A** (780–1400 nm), **IR-B** (1.4–3 µm) and **IR-C** (beyond). The eye cannot see any of it; a silicon camera sees the nearer infrared; the sources are made for what the radiation does.

### Ultraviolet sources
| Source | Wavelength | Used for |
|---|---|---|
| Low-pressure mercury lamp, clear quartz | 254 nm (and 185 nm) | disinfection of air, water and surfaces |
| UV-C LED | 255–285 nm | disinfection, sensing |
| Medium-pressure mercury lamp | lines from 200 to 400 nm | curing, water treatment |
| UV-B lamp | 280–315 nm (311 nm narrow band) | phototherapy, plant research |
| Black-light lamp (phosphor) | 350–370 nm | inspection, forensics, banknotes, insect traps |
| UV-A LED | 365, 385, 395, 405 nm | curing of inks and adhesives, inspection |
| Deuterium lamp | continuum 160–400 nm | spectrophotometers |
| Excimer lamp | 172 nm (xenon), 222 nm (krypton chloride) | surface treatment, disinfection research |

Ultraviolet photons carry 3 to 6 eV, enough to break chemical bonds. That is why UV disinfects (DNA absorbs most strongly near 260 nm and is damaged), cures resins (it splits the photoinitiators that start polymerisation) and makes fluorescent materials glow, and also why it ages plastics and injures eyes and skin. Ordinary glass blocks UV-C and UV-B; quartz passes all, so germicidal lamps use it.

### Infrared sources
- **Filament and halogen lamps**, with their peak between 0.8 and 1.4 µm, as short-wave heaters and heat lamps.
- **Quartz-tube and ceramic heaters** at 700–1200 K: by Wien's law their peak lies at 2.4–4 µm. They glow dull red at best; most of their output is in the band that water and many coatings absorb well.
- The **globar**, a silicon carbide rod at 1200–1500 K: the standard source of infrared spectrometers.
- **IR LEDs** at 850 nm (the long tail of the band shows as a faint red glow) and 940 nm (invisible), with VCSELs and laser diodes for the same bands ([[vcsels-and-laser-arrays]]).
Infrared LEDs serve remote controls (940 nm, modulated near 38 kHz), proximity and depth sensors, night-vision cameras and optical links; silicon sensors respond up to about 1100 nm ([[quantum-efficiency-and-spectral-response]]).

### The danger of the invisible
The blink and the turning away from a bright light only react to what is seen. UV and IR give no such warning.

> [!warn] **UV-C and UV-B** burn the outer eye (photokeratitis, "welder's flash", felt hours later) and the skin, and can cause cancer. Daily exposure limits are only a few millijoules per square centimetre at 254 nm. Never look at a germicidal lamp or a UV-C LED and never use one where people or animals can be exposed; enclose and interlock the source. **UV-A** is much less harmful but a strong source can still damage the eye. **Infrared** at high power can burn the retina without a visible bright spot, and long exposure to strong infrared (glassblowers' cataract) clouds the lens. Wear eyewear rated for the wavelength and power, and treat a new source as hazardous until its IEC 62471 classification says otherwise.

> [!key] UV and IR sources are chosen for what the photons do: UV photons, of 3–6 eV, break bonds (disinfection, curing, fluorescence), infrared photons heat or carry signals. Because neither can be seen, both need classification, enclosure and the right eyewear.
`,
  ideas: [
    'The CIE bands: UV-C 100–280 nm, UV-B 280–315, UV-A 315–400; IR-A 780–1400 nm, IR-B 1.4–3 µm, IR-C beyond.',
    'Ultraviolet photons of 3–6 eV break chemical bonds: that makes disinfection, curing and fluorescence, and injury.',
    'Germicidal lamps are low-pressure mercury discharges in quartz at 254 nm; UV-C LEDs reach 255–285 nm.',
    'Infrared heaters follow Wien\'s law: a 700–1200 K element peaks at 2.4–4 µm; IR LEDs at 850 and 940 nm serve sensors and remote controls.',
    'Invisible light gives no warning: UV-C, UV-B and strong IR need enclosure, interlocks and rated eyewear.'
  ],
  pitfalls: [
    'A UV lamp is safe if it looks dim — Germicidal lamps and UV-C LEDs give almost no visible light. Their danger does not depend on how they look: the faint blue glow of some is a by-product.',
    'Ordinary sunglasses protect against any UV source — Many do for UV-A and UV-B, but only eyewear marked for the wavelength protects against a particular UV or IR source, and none protects against staring into one.',
    'A 940 nm LED is harmless because it is invisible — A remote control is of very low power. A high-power illuminator at the same wavelength is invisible, gives no blink response and can injure the retina.',
    'Infrared is the same thing as heat — Infrared of all bands warms what absorbs it, but "heat" is also conducted and convected. A hot body radiates mostly infrared; an infrared LED warms little.'
  ],
  terms: [
    { term: 'Ultraviolet', also: ['UV', 'UV-A', 'UV-B', 'UV-C'], def: 'Radiation of wavelengths shorter than visible light: UV-A 315–400 nm, UV-B 280–315 nm, UV-C 100–280 nm (CIE). The shorter, the more energetic and the more damaging.' },
    { term: 'Germicidal lamp', also: ['UVGI lamp'], def: 'A low-pressure mercury lamp in quartz (or a UV-C LED) emitting at about 254 nm, a wavelength strongly absorbed by DNA, used to disinfect air, water and surfaces.' },
    { term: 'Black light', also: ['Wood\'s lamp', 'UV-A lamp'], def: 'A lamp emitting mainly UV-A of 350–370 nm through a filter that stops visible light. It makes fluorescent materials glow.' },
    { term: 'Photokeratitis', also: ['welder\'s flash', 'snow blindness'], def: 'A painful inflammation of the surface of the cornea caused by exposure to UV-B or UV-C. It appears some hours after exposure and usually heals in a day or two.' },
    { term: 'Infrared', also: ['IR', 'IR-A', 'NIR'], def: 'Radiation of wavelength longer than visible light: IR-A (near infrared) 780–1400 nm, IR-B 1.4–3 µm, IR-C beyond 3 µm (CIE).' },
    { term: 'Radiant exposure', also: ['dose', 'fluence'], def: 'The energy that has fallen on a unit area, in J/cm² or mJ/cm²: the irradiance multiplied by the exposure time. Exposure limits and disinfection doses are given in these units.' }
  ],
  formulas: [
    {
      name: 'Radiant exposure (dose)',
      expr: 'H = E*t', tex: 'H = E\\,t',
      vars: {
        H: { name: 'radiant exposure', q: 'fluence', unit: 'mJ/cm²' },
        E: { name: 'irradiance', q: 'intensity', unit: 'mW/cm²', value: 0.5 },
        t: { name: 'time', q: 'time', unit: 's', value: 12 }
      },
      note: 'The daily exposure limit of the eye and skin for 254 nm is about 6 mJ/cm² (ICNIRP, ACGIH).',
      stories: { H: 'A person stands in an irradiance of {E} of 254 nm light for {t}. What exposure do they receive?', t: 'The irradiance is {E} and the exposure must not exceed {H}. How long can it last?' }
    },
    {
      name: 'Peak wavelength of a heater',
      expr: 'lmax = bW/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lmax: { name: 'wavelength of the peak', q: 'length', unit: 'µm', tex: '\\lambda_{\\max}' },
        bW: { const: 'bW' },
        T: { name: 'temperature of the element', q: 'temperature', unit: 'K', value: 700, min: 300, max: 3600 }
      },
      note: 'Wien\'s law; a 700 K ceramic heater peaks at 4.1 µm, a 2500 K heat lamp at 1.16 µm.'
    },
    {
      name: 'Energy of a photon',
      expr: 'E = h*c/lam', tex: 'E = \\frac{h c}{\\lambda}',
      vars: {
        E: { name: 'photon energy', q: 'energy', unit: 'eV' },
        h: { const: 'h' }, c: { const: 'c' },
        lam: { name: 'wavelength', q: 'length', unit: 'nm', value: 254, tex: '\\lambda' }
      },
      note: '4.9 eV at 254 nm; 3.1 eV at 400 nm; 1.46 eV at 850 nm.'
    }
  ],
  examples: [
    {
      title: 'How long in a UV-C beam?',
      q: 'The skin and eye limit at 254 nm is 6 mJ/cm² per day. An unshielded germicidal lamp gives 0.5 mW/cm² at the working distance. How long can a person be exposed?',
      steps: [
        { text: 'Radiant exposure is irradiance times time, so', tex: 't = \\frac{H}{E} = \\frac{6\\ \\mathrm{mJ/cm^2}}{0.5\\ \\mathrm{mW/cm^2}} = 12\\ \\mathrm{s}' }
      ],
      a: 'Twelve seconds in a whole day. That is why germicidal lamps must be enclosed or interlocked.'
    },
    {
      title: 'The colour of a heater',
      q: 'A ceramic heater element runs at 700 K. Where does it radiate most strongly, and could you see it glow?',
      steps: [
        { text: 'Wien\'s law:', tex: '\\lambda_{\\max} = \\frac{2898\\ \\mu\\mathrm{m\\,K}}{700\\ \\mathrm{K}} = 4.1\\ \\mu\\mathrm{m}' },
        'This is mid-wave infrared. At 700 K a body gives hardly any visible light: it only starts to glow dull red at about 800 K.'
      ],
      a: 'The peak is at 4.1 µm, far in the infrared; the heater is "dark". The camera sees nothing from it either, but a thermal camera does.'
    }
  ],
  quiz: [
    { q: 'Which radiation is the most harmful to the surface of the eye?', choices: ['UV-A at 380 nm', 'Violet light at 420 nm', 'UV-C at 254 nm', 'Infrared at 940 nm'], a: 2, why: 'UV-C is absorbed in the outer layers of the cornea and skin and damages them quickly. UV-A is much less damaging per unit of exposure.' },
    { q: 'An infrared LED at 940 nm is invisible, so it cannot injure the eye.', a: false, why: 'A very bright invisible source gives no blink reflex and no warning. Low-power remote controls are harmless; strong illuminators and laser diodes are not.' },
    { q: 'The daily exposure limit for 254 nm light is about 6 mJ/cm². In a beam of 1 mW/cm², after how many seconds is it reached?', answer: 6, unit: 's', why: 'H = E t, so t = 6 mJ/cm² ÷ 1 mW/cm² = 6 s.' },
    { q: 'A heater element at 1000 K radiates most strongly at about…', choices: ['0.55 µm, in the green', '2.9 µm, in the infrared', '10 µm', '290 nm'], a: 1, why: 'λmax = 2898 µm·K ÷ 1000 K = 2.9 µm.' },
    { q: 'Why does a germicidal lamp use quartz rather than ordinary glass?', choices: ['Quartz is cheaper', 'Quartz transmits 254 nm; ordinary glass absorbs it', 'Quartz makes the light brighter', 'Glass would melt'], a: 1, why: 'Ordinary glass absorbs UV-C and UV-B. A lamp meant to emit 254 nm needs fused silica (quartz) or a special UV-transmitting glass.' }
  ],
  applications: [
    'Disinfection of drinking water, air in ducts and surfaces with 254 nm lamps and UV-C LEDs.',
    'UV curing of inks, coatings and adhesives, and exposure of photoresist in lithography (the i-line at 365 nm).',
    'Inspection and forensics: fluorescence under black light, banknote and document checks, leak detection.',
    'Heating, drying and cooking with infrared lamps and heaters; paint and coating lines.',
    'Remote controls, proximity and depth sensors, night-vision security cameras and optical data links with IR LEDs.'
  ],
  history: 'William Herschel found the infrared in sunlight in 1800 and Johann Ritter the ultraviolet in 1801. In 1877 Arthur Downes and Thomas Blunt showed that sunlight, and above all its blue-violet and ultraviolet end, kills bacteria; the low-pressure mercury germicidal lamp of the 1930s turned that into a tool. The first practical infrared and ultraviolet LEDs followed the visible ones in the 1960s, and UV-C LEDs reached the market in the 2010s.',
  sources: [
    'ICNIRP, "Guidelines on limits of exposure to ultraviolet radiation of wavelengths between 180 nm and 400 nm", *Health Physics* 87 (2004) — exposure limits.',
    'IEC 62471, *Photobiological safety of lamps and lamp systems* — the exempt and risk groups for UV, visible and infrared sources.',
    'S. Kitsinelis, *Light Sources: Basics of Lighting Technologies and Applications* (CRC Press) — ultraviolet and infrared lamps and LEDs.',
    'CIE, *International Lighting Vocabulary* (CIE S 017) — the definitions of the ultraviolet and infrared bands.'
  ],
  sim: [{ id: 'la-uv-ir', params: {} }]
}

);
