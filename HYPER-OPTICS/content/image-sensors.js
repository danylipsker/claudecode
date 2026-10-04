/* HYPER-OPTICS · content/image-sensors.js — the topic "Image sensors" (simulations: sims/image-sensors.js, prefix is-)
 *   how-a-pixel-detects-light, ccd-sensors, ccd-architectures, cmos-sensors, rolling-and-global-shutter,
 *   quantum-efficiency-and-spectral-response, sensor-noise, dynamic-range-and-full-well, sensor-formats-and-pixel-size,
 *   colour-filter-arrays-and-demosaicing, microlenses-bsi-and-stacked-sensors, binning-roi-and-area-of-interest,
 *   infrared-and-thermal-sensors
 */

/* ================================================================ the pixel */
Hyper.add(
{
  id: 'how-a-pixel-detects-light', parent: 'image-sensors', title: 'How a pixel detects light', level: 1,
  short: 'A pixel is a small silicon photodiode that turns each arriving photon into a free electron, keeps the electrons in a well while the shutter is open, and then reads their number as a voltage and a digital value. Silicon works from the ultraviolet to about 1100 nm, where a photon no longer carries enough energy to free an electron.',
  keywords: ['pixel', 'photodiode', 'photon to electron', 'band gap', 'silicon', '1100 nm', 'potential well', 'full well', 'floating diffusion', 'conversion gain', 'ADC', 'digital number', 'DN', 'photoelectric effect', 'electrons per photon', 'image sensor'],
  prereq: ['photon-energy', 'the-optical-spectrum', 'electronics:photodiodes'],
  related: ['quantum-efficiency-and-spectral-response', 'sensor-noise', 'dynamic-range-and-full-well', 'ccd-sensors', 'cmos-sensors', 'infrared-and-thermal-sensors', 'sensor-formats-and-pixel-size', 'physics:photoelectric-effect'],
  body: `
A camera sensor is a grid of millions of tiny light counters. Each one, a **pixel**, does the same four jobs in order: it turns photons into electrons, keeps the electrons, turns the amount of charge into a voltage, and turns the voltage into a number. Everything else in an image sensor, whether CCD or CMOS, colour or monochrome, is a way of doing those four jobs for millions of pixels at once.

### 1. Photon to electron
The heart of the pixel is a **photodiode**: a junction between p-type and n-type silicon. Silicon holds its electrons bound to the crystal unless they receive at least the **band-gap energy**, 1.12 eV at room temperature. A photon of wavelength $\\lambda$ carries $E = hc/\\lambda = 1239.84/\\lambda[\\mathrm{nm}]$ electronvolts:

| Light | Wavelength | Photon energy | Frees an electron in silicon? |
|---|---|---|---|
| ultraviolet | 365 nm | 3.40 eV | yes, near the surface |
| green | 550 nm | 2.25 eV | yes |
| red | 650 nm | 1.91 eV | yes |
| near infrared | 940 nm | 1.32 eV | yes, but deep inside |
| edge | 1107 nm | 1.12 eV | the cut-off |
| telecom | 1310 nm | 0.95 eV | no: the photon passes straight through |

That is why every ordinary camera is blind beyond about 1.1 µm, and why a camera for 1550 nm needs [[infrared-and-thermal-sensors|another semiconductor]]. In the visible, one absorbed photon frees at most one electron (and a hole that is swept away); the fraction of photons that do so is the [[quantum-efficiency-and-spectral-response|quantum efficiency]].

Blue light is absorbed within a fraction of a micrometre of the surface; red and infrared light travel deeper before they are absorbed (very roughly 0.1 µm at 400 nm, 1.5 µm at 550 nm, 5 µm at 700 nm, 30 µm at 900 nm). Where the electron is freed matters: only charge made inside or near the depleted region of the diode is collected.

### 2. Keeping the charge: the well
The junction is reverse-biased, so a layer next to it is emptied of free carriers and carries an electric field. An electron freed there is swept into a potential well under the photodiode and stays until the pixel is read. The well holds only so many: the **full-well capacity**, roughly proportional to the pixel's area (about 1000 electrons per µm² in modern sensors):

| Pixel pitch | Typical full well |
|---|---|
| 1.0 to 1.4 µm (phones) | 2 000 to 6 000 e⁻ |
| 2.4 to 3.5 µm (machine vision) | 8 000 to 15 000 e⁻ |
| 5 to 6 µm (large-format) | 25 000 to 40 000 e⁻ |
| 9 to 10 µm (scientific) | 60 000 to 120 000 e⁻ |

How many photons arrive? One lux of green light delivers about 4 100 photons per square micrometre per second. A 3 µm pixel (9 µm²) in a dim indoor scene whose image is lit at 1 lux for 1/30 s collects some 1 200 photons.

### 3. Charge to voltage, voltage to number
At readout the charge is moved onto a tiny capacitor, the **floating diffusion**, of 1 to 2 femtofarads. A charge $q = 1.6\\times10^{-19}$ C on $C$ gives $V = q/C$: between 80 and 160 µV per electron, the **conversion gain**. A source-follower amplifier buffers that voltage; an analogue-to-digital converter (ADC) of 8 to 16 bits turns it into a **digital number** (DN). With a 12-bit ADC and a 10 000 e⁻ well, one DN is 10 000/4096 = 2.4 electrons.

### What a pixel cannot do
A pixel only counts. It does not know the colour of the photons (a filter in front of it decides, see [[colour-filter-arrays-and-demosaicing]]), nor when in the exposure they came, nor where in its area they landed. Its output is the total charge, plus noise ([[sensor-noise]]), clipped at the full well ([[dynamic-range-and-full-well]]).

> [!key] A pixel is a photodiode, a well and a converter: photon, electron, voltage, number. Silicon frees an electron only for photons above 1.12 eV, so up to about 1100 nm, and it can hold only so many.
`,
  ideas: [
    'A pixel is a photodiode, a charge well, a charge-to-voltage converter and an ADC, in that order.',
    'A photon frees an electron only if its energy exceeds the band gap: 1.12 eV in silicon, which sets the 1100 nm limit.',
    'The well holds a limited charge, the full-well capacity, roughly 1000 electrons per square micrometre of pixel.',
    'Conversion gain is q/C: 1 to 2 fF of capacitance gives 80 to 160 µV per electron.',
    'A pixel counts photons over the exposure; colour and position come from filters and from the array.'
  ],
  pitfalls: [
    'A pixel records the colour of the light — It records only how many photons were absorbed. Colour comes from the filter placed over each pixel and from comparing neighbours.',
    'Every photon gives one electron — Only the fraction set by the quantum efficiency does; the rest are reflected, absorbed too deep or too shallow, or pass through.',
    'Silicon sees exactly what the eye sees — Silicon responds up to about 1100 nm and the eye stops near 700 nm, which is why camera makers add an infrared-cut filter.',
    'A sensor reads brightness at an instant — The pixel integrates: it sums every photon over the whole exposure time.'
  ],
  terms: [
    { term: 'Pixel', also: ['photosite', 'picture element'], def: 'One light-sensitive element of an image sensor, together with the circuit that reads it. Its output is one number per exposure.' },
    { term: 'Photodiode', also: ['PD', 'pinned photodiode'], def: 'A p–n junction in silicon in which absorbed photons free electrons that are collected in a potential well. Modern pixels use a pinned photodiode, which keeps its dark current low.' },
    { term: 'Band gap', also: ['bandgap energy', 'E_g'], def: 'The energy an electron needs to leave its bond and conduct. A photon must carry at least this much to be detected: 1.12 eV in silicon, 0.66 eV in germanium, about 0.75 eV in InGaAs.' },
    { term: 'Full-well capacity', also: ['full well', 'saturation capacity', 'saturation charge'], def: 'The largest number of electrons a pixel can hold before it overflows, in electrons. It grows roughly with pixel area.' },
    { term: 'Conversion gain', also: ['CG', 'charge-to-voltage gain'], def: 'The voltage produced per electron at the pixel\'s sense node, q/C, typically 50 to 200 µV per electron in CMOS sensors.' },
    { term: 'Floating diffusion', also: ['sense node', 'FD'], def: 'The small capacitor onto which a pixel\'s charge is moved to be turned into a voltage. A smaller capacitance means a larger voltage per electron and lower read noise.' },
    { term: 'Digital number', also: ['DN', 'ADU', 'grey level', 'count'], def: 'The integer an ADC outputs for a pixel. One DN corresponds to a gain K of a few electrons.' }
  ],
  formulas: [
    {
      name: 'Longest wavelength a semiconductor detects',
      expr: 'lc = h*c/Eg', tex: '\\lambda_c = \\frac{h\\,c}{E_g}',
      vars: {
        lc: { name: 'cut-off wavelength', q: 'length', unit: 'nm', tex: '\\lambda_c' },
        h: { const: 'h' }, c: { const: 'c' },
        Eg: { name: 'band-gap energy', q: 'energy', unit: 'eV', value: 1.12, min: 0.05, max: 6, tex: 'E_g' }
      },
      note: 'Silicon, 1.12 eV: 1107 nm. InGaAs, 0.75 eV: 1650 nm. Germanium, 0.66 eV: 1880 nm.',
      stories: { lc: 'A detector material has a band gap of {Eg}. Beyond what wavelength can it no longer detect light?', Eg: 'A detector stops responding beyond {lc}. What is its band-gap energy?' }
    },
    {
      name: 'Photons landing on a pixel',
      expr: 'Np = E*A*t*lambda/(h*c)', tex: 'N_p = \\frac{E\\,A\\,t\\,\\lambda}{h\\,c}',
      vars: {
        Np: { name: 'photons collected', tex: 'N_p' },
        E: { name: 'irradiance at the sensor', q: 'intensity', unit: 'mW/m²', value: 1.5 },
        A: { name: 'area of the pixel', q: 'area', unit: 'µm²', value: 9 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 33 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 555, tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' }
      },
      note: 'Energy arriving (E·A·t) divided by the energy of one photon (hc/λ). 1.5 mW/m² is 1 lux of 555 nm light.',
      stories: { Np: 'The image on a sensor is lit at {E} of {lambda} light. A pixel of {A} is exposed for {t}. How many photons does it receive?' }
    },
    {
      name: 'Conversion gain from the sense-node capacitance',
      expr: 'CG = 160.2/Cfd', tex: '\\mathrm{CG} = \\frac{160.2}{C_{\\mathrm{fd}}}',
      vars: {
        CG: { name: 'conversion gain', q: false, unit: 'µV/e⁻', tex: '\\mathrm{CG}' },
        Cfd: { name: 'capacitance of the floating diffusion', q: false, unit: 'fF', value: 1.6, min: 0.2, max: 20, tex: 'C_{\\mathrm{fd}}' }
      },
      note: 'The charge of one electron on 1 fF gives 160.2 µV. A smaller capacitor gives more volts per electron.'
    },
    {
      name: 'From electrons to digital numbers',
      expr: 'DN = N/K', tex: '\\mathrm{DN} = \\frac{N_e}{K}',
      vars: {
        DN: { name: 'digital number', tex: '\\mathrm{DN}' },
        N: { name: 'electrons collected', value: 6000, tex: 'N_e' },
        K: { name: 'system gain', q: false, unit: 'e⁻/DN', value: 2.44, min: 0.1, max: 100 }
      },
      note: 'K = full well ÷ 2^bits when the ADC is set to fill its range with the well.',
      stories: { DN: 'A pixel holds {N} electrons and the camera\'s gain is {K}. What number does the ADC output?' }
    }
  ],
  examples: [
    {
      title: 'A pixel in a dim room',
      q: 'The image of a room is lit at 1 lux (green light) on a sensor with 3 µm pixels and the exposure is 1/30 s. The quantum efficiency is 60 % and the full well is 10 000 electrons. How many photons and electrons does a pixel collect, and how full is its well?',
      steps: [
        'One lux of 555 nm light is 1/683 W/m² = 1.46 mW/m². A photon of 555 nm carries $3.58\\times10^{-19}$ J.',
        { text: 'The pixel has an area of 9 µm² and the exposure is 33 ms:', tex: 'N_p = \\frac{1.46\\times10^{-3}\\times 9\\times10^{-12}\\times 0.033}{3.58\\times10^{-19}} \\approx 1\\,200' },
        'At 60 % quantum efficiency, 1 200 photons give about 730 electrons: 7 % of the full well.'
      ],
      a: 'About 1 200 photons, 730 electrons, a well 7 % full. The shot noise of 730 electrons is 27, so the signal-to-noise ratio is about 27 (see sensor noise).'
    },
    {
      title: 'Can silicon see a telecom laser?',
      q: 'A fibre-optic link runs at 1310 nm. Could an ordinary silicon camera sensor show the beam leaving the fibre?',
      steps: [
        { text: 'The photon energy is', tex: 'E = \\frac{1239.84}{1310} = 0.95\\ \\mathrm{eV}' },
        'The band gap of silicon is 1.12 eV. These photons carry less than the gap, so they pass through the silicon without freeing electrons.'
      ],
      a: 'No. A silicon sensor is blind at 1310 nm; an InGaAs camera is needed.'
    }
  ],
  quiz: [
    { q: 'Why is a silicon sensor insensitive to light of 1550 nm?', choices: ['The photons carry less energy than the silicon band gap', 'The silicon reflects all of it', 'The lens glass absorbs it', 'The photons are too fast to be caught'], a: 0, why: 'A 1550 nm photon carries 0.80 eV, less than the 1.12 eV needed to free an electron from silicon, so it passes through. The reflection and the lens are not the reason.' },
    { q: 'What is the energy, in electronvolts, of a green photon of 550 nm?', answer: 2.25, unit: 'eV', why: '$E = 1239.84/550 = 2.254$ eV. Twice the silicon band gap: plenty to free an electron.' },
    { q: 'A pixel measures the wavelength of each photon it absorbs, and the camera combines the three wavelengths into a colour.', a: false, why: 'A pixel only counts absorbed photons. Colour is made by filters over the pixels and by comparing neighbouring pixels, as in a Bayer mosaic.' },
    { q: 'A camera has a 12-bit ADC and a pixel full well of 10 000 electrons that just fills the ADC range. How many electrons is one digital number?', answer: 2.44, why: '$K = 10\\,000/2^{12} = 10\\,000/4096 = 2.44$ electrons per DN.' },
    { q: 'Blue light (450 nm) is absorbed in the top micrometre of silicon, near-infrared light (900 nm) tens of micrometres down. What follows for a thin photodiode?', choices: ['Blue is well collected, deep near-infrared partly escapes without being detected', 'Both are collected equally', 'Infrared is detected better than blue', 'Neither is detected'], a: 0, why: 'Absorption depth grows with wavelength. A thin collecting region catches nearly all blue photons but only a fraction of the near-infrared ones, which pass beyond it. This sets the shape of the QE curve.' }
  ],
  applications: [
    'Every digital camera, phone, webcam, microscope camera and machine-vision camera: one photodiode per pixel.',
    'Photodiode detectors in light meters, barcode scanners, optical mice and fibre-optic receivers use the same silicon junction, as single elements.',
    'Scientific cameras count single electrons (the read noise of the best is about 1 e⁻) and are specified by full well and conversion gain.',
    'Solar cells are the same p–n junction run in the opposite sense: collect the charge as power instead of as an image.'
  ],
  history: 'Einstein explained the photoelectric effect with light quanta in 1905 and received the 1921 Nobel Prize for it. Silicon p–n junctions that turn light into current, solar cells and photodiodes, appeared at Bell Laboratories in the 1950s; the pinned photodiode that low-noise pixels still use was developed for interline CCDs in the early 1980s.',
  sources: [
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — the pixel, its well and its read-out chain.',
    'J. R. Janesick, *Photon Transfer: DN → λ* (SPIE Press, 2007) — from photons to digital numbers.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics* — the chapters on semiconductor photon detectors.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — the definitions of quantum efficiency, gain and saturation capacity.'
  ],
  sim: 'is-pixel'
},

/* ================================================================ CCD sensors */
{
  id: 'ccd-sensors', parent: 'image-sensors', title: 'CCD sensors', level: 2,
  short: 'In a charge-coupled device the electrons collected by every pixel are passed from well to well, like buckets along a line, to a single output amplifier at the corner. That one amplifier gives uniform pixels and low noise; the price is slow, power-hungry read-out and blooming and smear at the edges of what the wells can hold.',
  keywords: ['CCD', 'charge-coupled device', 'charge transfer', 'bucket brigade', 'CTE', 'charge transfer efficiency', 'blooming', 'smear', 'serial register', 'vertical register', 'output amplifier', 'clocking', 'three-phase', 'Boyle and Smith', 'scientific CCD'],
  prereq: ['how-a-pixel-detects-light', 'sensor-noise'],
  related: ['ccd-architectures', 'cmos-sensors', 'dynamic-range-and-full-well', 'quantum-efficiency-and-spectral-response', 'binning-roi-and-area-of-interest', 'line-scan-inspection'],
  body: `
A **charge-coupled device** (CCD) has no amplifier in its pixels. Each pixel is just a well that collects electrons. To read the image the chip *moves the charge*, packet by packet, along the chip to one output, where a single amplifier measures each packet in turn.

### The bucket brigade
Picture a field of buckets in the rain, each filling at a rate that depends on the rain at its place. When the rain stops, the buckets on every row are passed one place down; the bottom row empties into a line of buckets that is passed sideways, one bucket at a time, to a single measuring cylinder. In the chip the "buckets" are potential wells under rows of electrodes, and "passing" means changing the voltages on three (or two, or four) overlapping gates in turn, so that the well, and the electrons in it, slide one pixel along. That is called **clocking**.

1. **Vertical transfer.** All rows move one step towards the bottom; the bottom row drops into the **serial register**.
2. **Serial transfer.** The serial register is clocked sideways, one pixel per clock, to the **output node**, where the charge makes a voltage and an amplifier sends it off-chip to an ADC.
3. Repeat for every row.

### Why a single amplifier is good
Every pixel passes through the *same* amplifier and the same converter. Its gain, its offset and its noise are the same for the whole picture, which is why CCD images are uniform and why they were the benchmark for photometry. Because it is only one amplifier, it can be large and slow: read at 50 to 500 kHz a scientific CCD reaches a **read noise** of 2 to 5 electrons (1 to 3 in the best). Read at 10 to 20 MHz the noise rises to 10 to 20 electrons.

### What it costs
- **Slow read-out.** The pixel rate is the clock rate of one port: 16.8 million pixels at 1 MHz take 16.8 s; four output ports bring it to 4.2 s. A video-rate CCD is read at 10 to 40 MHz.
- **Charge-transfer efficiency.** Each transfer leaves a tiny fraction behind. CTE is 99.999 % (five nines) to 99.9999 % for a good device. The farthest pixel of a 4096 × 4096 chip makes up to 8192 transfers, so the fraction that reaches the amplifier is $\\mathrm{CTE}^{8192}$:

| CTE per transfer | Fraction surviving 8192 transfers |
|---|---|
| 99.99 % | 44 % |
| 99.999 % | 92 % |
| 99.9999 % | 99.2 % |

Lost charge trails behind as a faint tail on bright pixels.
- **Blooming.** If a well receives more than its full capacity the excess spills along the column into the wells above and below, drawing a white streak through a bright star. Many CCDs add an anti-blooming drain beside each pixel, at the cost of some sensitive area.
- **Smear.** If light still falls on the chip while it is clocked, the moving charge picks up extra signal from every scene point it passes: streaks above and below bright objects ([[ccd-architectures|the architectures]] differ in how they avoid it).
- **Power and voltages.** The gates are large capacitors and need several supply voltages with swings of a few volts to over ten; a CCD camera draws watts where a CMOS sensor draws a fraction of a watt.

### Why CCDs gave way, and where they remain
For decades the CCD was the better sensor: high quantum efficiency, low dark current, uniform response. As CMOS pixels learnt the same tricks ([[cmos-sensors]]), and added parallel read-out and on-chip circuits, they matched the CCD's noise and beat it in speed and power. CCDs have been largely replaced in phones, cameras and industrial cameras; large, back-thinned scientific CCDs still serve telescopes and spectroscopy.

> [!key] A CCD moves charge, not voltage: well to well to one amplifier. That makes it uniform and quiet and also slow, hungry for power and prone to blooming and smear.
`,
  ideas: [
    'A CCD pixel is only a well; the whole chip is read by passing charge packets, row by row, to one output amplifier.',
    'One amplifier for all pixels gives uniform gain and offset and, read slowly, a read noise of a few electrons.',
    'Charge-transfer efficiency of 99.999 % or better is needed because a pixel may be transferred thousands of times.',
    'Blooming is overflow of a full well along its column; smear is light falling while the charge is being moved.',
    'The read-out time is the number of pixels divided by the pixel clock of one port.'
  ],
  pitfalls: [
    'A CCD is a different kind of light detector from a CMOS sensor — Both use photodiodes and the same silicon physics. They differ in how the charge is read: moved to one amplifier (CCD) or converted in each pixel (CMOS).',
    'Blooming happens because the amplifier saturates — It happens in the pixel wells: charge beyond the full well spills into neighbours along the column before it is ever read.',
    'A CCD with a CTE of 99.99 % is nearly perfect — After 5000 transfers only 61 % of the charge arrives. Imaging CCDs need five or six nines.',
    'Reading faster only costs time saved — A faster pixel clock raises the read noise, from 2 to 5 electrons at hundreds of kilohertz to ten or more at tens of megahertz.'
  ],
  terms: [
    { term: 'CCD', also: ['charge-coupled device'], def: 'An image sensor in which the charge collected by the pixels is shifted from well to well by clocked gate voltages to an output amplifier at the edge of the chip.' },
    { term: 'Clocking', also: ['clock phases', 'three-phase CCD'], def: 'Changing the voltages on the overlapping gates of a CCD in sequence so that the charge packets slide one pixel along. Two, three and four phases are used.' },
    { term: 'Serial register', also: ['horizontal register', 'readout register'], def: 'The row of CCD cells at the edge of the array that receives one row at a time and shifts it, pixel by pixel, to the output amplifier.' },
    { term: 'Output amplifier', also: ['output node', 'sense node'], def: 'The small capacitor and source follower at the end of the serial register that turn each charge packet into a voltage. A CCD has one per output port.' },
    { term: 'Charge-transfer efficiency', also: ['CTE', 'CTI (charge-transfer inefficiency)'], def: 'The fraction of a charge packet that moves on in one transfer. A good imaging CCD reaches 99.999 % or better; the fraction left, 1 − CTE, is the inefficiency CTI.' },
    { term: 'Blooming', def: 'Overflow of charge from a saturated pixel into its neighbours along the column, producing a bright vertical streak through a bright object.' },
    { term: 'Smear', also: ['vertical smear'], def: 'A streak above and below a bright object caused by light falling on the chip while its charge is being shifted. It is about the transfer time divided by the exposure time.' }
  ],
  formulas: [
    {
      name: 'Charge that survives the transfers',
      expr: 'F = CTE^(nr + nc)', tex: 'F = \\mathrm{CTE}^{\\,n_r + n_c}',
      vars: {
        F: { name: 'fraction of the charge that arrives', q: 'ratio', unit: '%' },
        CTE: { name: 'charge-transfer efficiency per transfer', q: 'ratio', unit: '%', value: 99.999, min: 90, max: 100, tex: '\\mathrm{CTE}' },
        nr: { name: 'vertical transfers (rows)', value: 4096, int: true, min: 0, max: 10000, tex: 'n_r' },
        nc: { name: 'serial transfers (columns)', value: 4096, int: true, min: 0, max: 10000, tex: 'n_c' }
      },
      note: 'For the pixel farthest from the output amplifier, which is transferred once for every row and every column.',
      stories: { F: 'A CCD has a charge-transfer efficiency of {CTE}. The farthest pixel is moved through {nr} rows and {nc} columns. What fraction of its charge reaches the amplifier?' }
    },
    {
      name: 'Read-out time through one port',
      expr: 't = N/f', tex: 't = \\frac{N}{f}',
      vars: {
        t: { name: 'time to read the whole frame', q: 'time', unit: 's' },
        N: { name: 'pixels read through the port', value: 4190000, min: 1000, max: 1e9 },
        f: { name: 'pixel clock', q: 'frequency', unit: 'MHz', value: 1, min: 0.01, max: 100 }
      },
      note: 'With several output ports the pixels are shared out and the time falls in proportion.',
      stories: { t: 'A CCD of {N} pixels is read through one port at {f}. How long does a frame take?', f: 'A frame of {N} pixels must be read in {t}. What pixel clock is needed?' }
    },
    {
      name: 'Smear ratio',
      expr: 'sm = ttr/texp', tex: '\\mathrm{sm} = \\frac{t_{\\mathrm{tr}}}{t_{\\mathrm{exp}}}',
      vars: {
        sm: { name: 'smear (streak level ÷ column-average signal)', q: 'ratio', unit: '%', tex: '\\mathrm{sm}' },
        ttr: { name: 'time the charge spends being shifted in the light', q: 'time', unit: 'ms', value: 2, tex: 't_{\\mathrm{tr}}' },
        texp: { name: 'exposure time', q: 'time', unit: 'ms', value: 100, tex: 't_{\\mathrm{exp}}' }
      },
      note: 'Each packet passes every scene point in its column during the shift, so the streak under a bright object is about this fraction of the column\'s mean brightness.',
      stories: { sm: 'A frame-transfer CCD takes {ttr} to shift its image into the store in the light, and the exposure is {texp}. What is the smear?' }
    }
  ],
  examples: [
    {
      title: 'The corner pixel of a big CCD',
      q: 'A scientific CCD has 4096 × 4096 pixels, a CTE of 99.9995 % and a single output port in one corner, read at 1 MHz. What fraction of the charge of the farthest pixel reaches the amplifier, and how long does a full read take?',
      steps: [
        'The farthest pixel is moved 4096 rows and 4096 columns: 8192 transfers.',
        { text: 'The surviving fraction is', tex: 'F = 0.999995^{8192} = e^{-0.0410} = 0.960' },
        { text: 'The pixel count is $4096^2 = 16.8\\times10^6$, so at one pixel per microsecond:', tex: 't = \\frac{16.8\\times10^{6}}{10^{6}\\ \\mathrm{s^{-1}}} = 16.8\\ \\mathrm{s}' }
      ],
      a: '96 % of the charge arrives (4 % is trailed into later pixels), and a frame takes 16.8 s. Four output ports would cut it to 4.2 s.'
    },
    {
      title: 'How bright can a star be?',
      q: 'A CCD pixel of 9 µm has a full well of 80 000 electrons. A star puts 300 000 electrons into one pixel during an exposure. What happens to the surplus?',
      steps: [
        'The pixel can hold 80 000 electrons; the surplus is 220 000 electrons.',
        'Without an anti-blooming drain the surplus spills into the pixels above and below, each of which fills up to 80 000 in turn and passes on its own excess, until the 220 000 are shared out along the column: 220 000/80 000 = 2.75 pixels\' worth, about one and a half on each side.'
      ],
      a: 'A vertical streak of saturated pixels, about four long (the 300 000 electrons fill 3.75 wells), runs through the star. The photometry of the star is lost, though not of its neighbours elsewhere in the picture.'
    }
  ],
  quiz: [
    { q: 'Why are the pixels of a CCD very uniform in gain?', choices: ['Every pixel\'s charge is measured by the same output amplifier', 'Each pixel has a carefully matched amplifier', 'The wells all have exactly the same size', 'The ADC corrects each pixel separately'], a: 0, why: 'A CCD has no amplifier in the pixel. All the charge packets pass through one output amplifier and one converter, so the gain and offset are common to the whole image.' },
    { q: 'A CCD has a transfer efficiency of 99.99 % per transfer. About what fraction of the charge survives 1000 transfers?', answer: 0.905, why: '$0.9999^{1000} = e^{-0.1} = 0.905$. Five nines would give 99 %.' },
    { q: 'Blooming is caused by the output amplifier saturating.', a: false, why: 'Blooming is spill-over from full wells along the columns, before any read-out. The amplifier is not involved.' },
    { q: 'A CCD with 2 million pixels is read through one port at 2 MHz. How long does a frame take, in seconds?', answer: 1, unit: 's', why: '$t = N/f = 2\\times10^{6}/(2\\times10^{6}\\ \\mathrm{s^{-1}}) = 1$ s.' },
    { q: 'Which change lowers the read noise of a CCD?', choices: ['Reading more slowly', 'Reading faster', 'Adding another output port and keeping the clock', 'Opening the shutter longer'], a: 0, why: 'Noise at the output amplifier grows with the bandwidth, so slow-scan read-out is quieter: a few electrons at hundreds of kilohertz against ten or more at tens of megahertz. More ports shorten the time without lowering the noise.' }
  ],
  applications: [
    'Astronomy: large back-thinned CCDs in telescope cameras, and the Gaia space telescope, whose focal plane has about 100 CCDs and nearly a billion pixels. The Hubble cameras use CCDs.',
    'Spectroscopy, X-ray detection and electron microscopy, where a few electrons of read noise and long exposures matter more than speed.',
    'Industrial and broadcast cameras of the 1990s and 2000s, and the first digital still cameras, which used interline CCDs.',
    'Machine-vision cameras that keep CCDs for their uniformity and global (all-at-once) exposure.'
  ],
  history: 'Willard Boyle and George E. Smith conceived the charge-coupled device at Bell Laboratories in 1969, at first as a memory; they published it in 1970, and imaging followed within a year. Steven Sasson at Kodak built the first digital camera in 1975 around a 100 × 100 pixel CCD. Boyle and Smith shared the 2009 Nobel Prize in Physics for the invention.',
  sources: [
    'W. S. Boyle and G. E. Smith, "Charge coupled semiconductor devices", *Bell System Technical Journal* 49 (1970) 587–593.',
    'J. R. Janesick, *Scientific Charge-Coupled Devices* (SPIE Press, 2001).',
    'G. C. Holst, *CCD Arrays, Cameras and Displays* (SPIE Press) — charge transfer, blooming and smear.'
  ],
  sim: { id: 'is-ccd', params: { arch: 'full' } }
},

/* ================================================================ CCD architectures */
{
  id: 'ccd-architectures', parent: 'image-sensors', title: 'CCD architectures: full-frame, frame-transfer, interline', level: 2,
  short: 'Where the charge goes when the exposure ends decides everything else about a CCD. Full-frame chips need a shutter, frame-transfer chips park the image in a hidden store, interline chips move it beside each pixel in one step. EMCCDs add gain before the amplifier and TDI chips add up the same scene line after line.',
  keywords: ['full-frame CCD', 'frame-transfer CCD', 'interline CCD', 'EMCCD', 'electron multiplying CCD', 'TDI', 'time delay and integration', 'smear', 'shutter', 'electronic shutter', 'microlens', 'fill factor', 'anti-blooming', 'storage area'],
  prereq: ['ccd-sensors', 'sensor-noise'],
  related: ['microlenses-bsi-and-stacked-sensors', 'rolling-and-global-shutter', 'shutter-types', 'area-scan-and-line-scan-cameras', 'line-scan-inspection', 'cmos-sensors'],
  body: `
All CCDs read the image by shifting charge, but where the charge waits while it is shifted differs, and so does what the chip can do without a mechanical shutter.

### The three layouts
| | Full-frame | Frame-transfer | Interline-transfer |
|---|---|---|---|
| Light-sensitive area | the whole chip (fill factor near 100 %) | the upper half; the lower half is a masked store | strips of photodiodes between masked vertical registers (20 to 50 % without microlenses) |
| End of exposure | the image stays in the array and is clocked out row by row | the whole image is moved at once into the store (about a millisecond) | the charge hops sideways into the masked register in one clock |
| Shutter | mechanical shutter needed | none needed; short smear | none: an electronic shutter, exposures from microseconds |
| Smear | huge without a shutter (the whole read-out time) | transfer time ÷ exposure time | very small (−80 to −100 dB leaks under the mask) |
| Chip cost for a given image | lowest | double the silicon | microlenses needed to recover the fill factor |
| Typical use | astronomy, spectroscopy, early digital SLRs | scientific video, EMCCD | camcorders, compact cameras, machine vision |

**Full-frame.** Every pixel is also a cell of the vertical shift register. That gives the most sensitive area and the highest QE (back-thinned versions exceed 90 %), but while the rows are clocked out one by one, through a serial register that takes thousands of pixel times per row, light must not fall: a mechanical shutter closes after the exposure.

**Frame-transfer.** The chip is two identical areas, an *image area* and a *storage area* covered by an opaque mask. At the end of the exposure the whole image is clocked into the storage area at the fast vertical rate (1024 rows at 2 µs a row is 2 ms), and the image area starts the next exposure while the store is read out slowly. No shutter, no dead time, a smear of only 2 ms in the exposure: for a 100 ms exposure that is 2 %.

**Interline-transfer.** Each photodiode has its own masked vertical register beside it. One gate pulse transfers every pixel's charge into its register at once: that is an **electronic shutter**, and exposures can last microseconds. The cost is a sensitive area of only 20 to 50 % of the pixel; **microlenses** over each pixel ([[microlenses-bsi-and-stacked-sensors|more here]]) bring it back. Every interline CCD also carries an anti-blooming drain; the sensors of camcorders, compact cameras and industrial cameras are of this type.

### Two more tricks
**EMCCD (electron-multiplying CCD).** An extra gain register, 400 to 600 cells long, sits between the serial register and the amplifier. At a raised clock voltage each cell has about a 1 % chance of knocking out an extra electron, so $(1.01)^{500}$ multiplies the packet by roughly a hundred (gains of 1000 are used). The amplifier's read noise $r$ is divided by the gain $G$: the effective noise falls below one electron, and single photons can be seen. Multiplication is random, which adds an *excess noise factor* of $\\sqrt{2}$; at high light levels the gain is switched off. EMCCDs are cooled to between −70 and −100 °C.

**TDI (time delay and integration).** A line-scan chip with many rows (64 to 256 or more). As the scene moves past, the charge is clocked along the columns *at the speed of the image*, so the same strip of the scene is exposed in row after row and the charge adds up. $N$ rows give $N$ times the signal and, when the shot noise dominates, $\\sqrt{N}$ times the signal-to-noise ratio: fast scanning in dim light. The clocking must match the image speed to a small fraction of a pixel; otherwise it smears ([[line-scan-inspection]]).

> [!key] Full-frame chips are the most sensitive but need a shutter; frame-transfer chips hide the image in a store; interline chips hide it beside each pixel and so give an electronic shutter. EMCCD multiplies the charge before the amplifier; TDI integrates the same scene N times.
`,
  ideas: [
    'Full-frame, frame-transfer and interline layouts differ in where the charge waits during read-out.',
    'Full-frame chips are the most sensitive but need a mechanical shutter; frame-transfer chips need no shutter at the cost of twice the silicon.',
    'Interline chips transfer the charge sideways in one clock: an electronic shutter, but a small fill factor that microlenses repair.',
    'An EMCCD multiplies the charge before the amplifier, dividing the effective read noise by the gain, at an excess noise factor of √2.',
    'TDI clocks charge at the speed of the moving image so that N rows add up: signal ×N, shot-noise SNR ×√N.'
  ],
  pitfalls: [
    'An interline CCD collects light over its whole pixel — Only the photodiode strip (20 to 50 % of the area) is sensitive; microlenses focus the rest of the light onto it.',
    'An EMCCD is always better in low light — Its gain adds an excess noise factor of √2, which halves the effective quantum efficiency; with plenty of light the gain should be off.',
    'Frame-transfer chips have no smear — They have a little: the time to shift the image into the store, divided by the exposure time.',
    'A TDI sensor works at any speed — The charge must be clocked at exactly the speed of the image on the chip, otherwise the stages blur the picture they were meant to brighten.'
  ],
  terms: [
    { term: 'Full-frame CCD', also: ['FF CCD'], def: 'A CCD whose whole area is light-sensitive and acts as its own shift register. It needs a shutter (or darkness) during read-out.' },
    { term: 'Frame-transfer CCD', also: ['FT CCD'], def: 'A CCD with an image area and an equal masked storage area. The image is shifted quickly into the store and read out while the next exposure starts.' },
    { term: 'Interline-transfer CCD', also: ['IT CCD', 'IL-CCD'], def: 'A CCD with a masked vertical register next to every column of photodiodes. The charge is moved into it in one step, which acts as an electronic shutter.' },
    { term: 'Electronic shutter', def: 'Ending an exposure by moving or isolating the charge electrically, with no moving parts, so that exposures can be microseconds long.' },
    { term: 'EMCCD', also: ['electron-multiplying CCD', 'L3CCD'], def: 'A CCD with a gain register before the output amplifier in which impact ionisation multiplies the charge by up to about 1000, reducing the effective read noise below one electron.' },
    { term: 'TDI', also: ['time delay and integration'], def: 'A mode of a line-scan CCD or CMOS sensor with many rows in which the charge is shifted in step with the moving image and so adds up the same scene line N times.' },
    { term: 'Excess noise factor', also: ['F'], def: 'The factor by which the shot noise grows when the signal passes through a random gain stage. For an EMCCD at high gain it is √2.' }
  ],
  formulas: [
    {
      name: 'Effective read noise of an EMCCD',
      expr: 're = r/G', tex: 'r_{\\mathrm{eff}} = \\frac{r}{G}',
      vars: {
        re: { name: 'effective read noise, referred to the input', q: false, unit: 'e⁻', tex: 'r_{\\mathrm{eff}}' },
        r: { name: 'read noise of the output amplifier', q: false, unit: 'e⁻', value: 40, min: 0.5, max: 200 },
        G: { name: 'multiplication gain', value: 300, min: 1, max: 2000 }
      },
      note: 'The excess noise factor of √2 still applies to the shot noise.',
      stories: { re: 'The output amplifier of an EMCCD has a read noise of {r}. With a gain of {G}, what is the effective read noise?' }
    },
    {
      name: 'Gain of the multiplication register',
      expr: 'G = (1 + p)^n', tex: 'G = (1 + p)^{n}',
      vars: {
        G: { name: 'multiplication gain' },
        p: { name: 'probability of an extra electron per cell', value: 0.012, min: 0.001, max: 0.03 },
        n: { name: 'cells in the gain register', value: 536, int: true, min: 1, max: 1000 }
      },
      note: 'The probability depends on the clock voltage, which is how the gain is set.',
      stories: { G: 'A gain register of {n} cells gives each charge packet a {p} chance of an extra electron in every cell. What is the gain?' }
    },
    {
      name: 'Signal-to-noise ratio of a TDI sensor',
      expr: 'snr = sqrt(Nt)*snr1', tex: '\\mathrm{SNR} = \\sqrt{N_t}\\;\\mathrm{SNR}_1',
      vars: {
        snr: { name: 'signal-to-noise ratio with TDI', tex: '\\mathrm{SNR}' },
        Nt: { name: 'number of TDI stages', value: 128, int: true, min: 1, max: 1024, tex: 'N_t' },
        snr1: { name: 'signal-to-noise ratio of a single line', value: 8, tex: '\\mathrm{SNR}_1' }
      },
      note: 'The signal grows by N, the shot noise by √N; read noise is added once at the end, so the gain is better still when read noise dominates.',
      stories: { snr: 'One line exposure gives a signal-to-noise ratio of {snr1}. A TDI sensor integrates {Nt} stages. What SNR does it reach?' }
    },
    {
      name: 'Line rate for a TDI sensor',
      expr: 'fl = v*m/p', tex: 'f_l = \\frac{v\\,m}{p}',
      vars: {
        fl: { name: 'line rate', q: 'frequency', unit: 'kHz', tex: 'f_l' },
        v: { name: 'speed of the scene', q: 'speed', unit: 'mm/s', value: 500 },
        m: { name: 'magnification (image ÷ object)', value: 0.1, min: 0.001, max: 10 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 7 }
      },
      note: 'The charge must be clocked one row each time the image moves one pixel.',
      stories: { fl: 'The scene moves at {v} and is imaged at a magnification of {m} on pixels {p} wide. At what line rate must a TDI sensor be clocked?' }
    }
  ],
  examples: [
    {
      title: 'Smear without a shutter',
      q: 'A full-frame CCD of 2048 rows is read out in 4 s. A camera maker is tempted to leave the shutter open for a 100 ms exposure. What does a pixel see during the read-out?',
      steps: [
        'The charge sits in the array for the whole read-out; on average each packet waits half of the 4 s, 2 s, in the light.',
        { text: 'Compared with the exposure of 0.1 s:', tex: '\\frac{2\\ \\mathrm{s}}{0.1\\ \\mathrm{s}} = 20' }
      ],
      a: 'Twenty times more light is added after the exposure than during it. The picture is ruined; a full-frame camera must have a shutter, or its exposure must be much longer than its read-out.'
    },
    {
      title: 'Seeing a single photon',
      q: 'A scientific camera has a read noise of 40 e⁻ at its fast pixel rate. With an EMCCD gain of 300 and an excess noise factor of √2, is a single-photon signal visible, and what is the effective read noise?',
      steps: [
        { text: 'The read noise referred to the input is', tex: 'r_{\\mathrm{eff}} = \\frac{40}{300} = 0.13\\ \\mathrm{e^-}' },
        'It is far below one electron: a single electron is clearly above the noise. The price is the excess noise factor: the shot noise is 1.41 times larger, as if the QE were halved.'
      ],
      a: 'The effective read noise is 0.13 e⁻, so single photons stand out; in return the QE is effectively halved. This is why EMCCDs win only in very dim light.'
    }
  ],
  quiz: [
    { q: 'Which CCD architecture needs a mechanical shutter?', choices: ['Full-frame', 'Frame-transfer', 'Interline-transfer', 'All three'], a: 0, why: 'In a full-frame chip the image waits in the light-sensitive array while it is clocked out. The other two move it into a masked area first.' },
    { q: 'An interline CCD gives an electronic shutter because the charge is moved into masked registers in one step.', a: true, why: 'One pulse on the transfer gate empties every photodiode into the register beside it; light after that does not add charge to the packets.' },
    { q: 'A frame-transfer CCD shifts its image into the store in 2 ms, and the exposure is 50 ms. The smear is about…', choices: ['4 %', '40 %', '0.4 %', '25 %'], a: 0, why: 'Smear ≈ transfer time ÷ exposure time = 2/50 = 4 %.' },
    { q: 'An EMCCD has an amplifier noise of 60 electrons and a gain of 600. What is the effective read noise, in electrons?', answer: 0.1, why: '$r/G = 60/600 = 0.1$ electron. The shot noise is multiplied by $\\sqrt{2}$ by the random multiplication.' },
    { q: 'A TDI sensor with 100 stages is used in light so dim that shot noise dominates. By what factor does its SNR exceed that of a single line?', choices: ['10', '100', '1', '1000'], a: 0, why: 'Signal grows ×100, shot noise ×$\\sqrt{100} = 10$, so SNR grows ×10.' }
  ],
  applications: [
    'Astronomy and spectroscopy use full-frame CCDs behind a shutter, or frame-transfer chips for video-rate work.',
    'Single-molecule fluorescence microscopy, adaptive-optics wavefront sensors and photon-starved astronomy use EMCCDs.',
    'Interline CCDs were the sensors of camcorders, compact cameras and machine-vision cameras that needed short exposures.',
    'Satellite push-broom cameras, wafer and display inspection and high-speed sorting use TDI sensors.'
  ],
  history: 'Interline-transfer sensors, with an on-chip microlens added in the 1980s, became the standard of consumer video and compact cameras. The electron-multiplying CCD was developed around 2000 and quickly became the tool of single-molecule microscopy.',
  sources: [
    'J. R. Janesick, *Scientific Charge-Coupled Devices* (SPIE Press, 2001) — full-frame, frame-transfer and EMCCD devices.',
    'G. C. Holst, *CCD Arrays, Cameras and Displays* (SPIE Press) — interline transfer, smear and TDI.',
    'M. S. Robbins and B. J. Hadwen, "The noise performance of electron multiplying charge-coupled devices", *IEEE Transactions on Electron Devices* 50 (2003) 1227–1232.'
  ],
  sim: { id: 'is-ccd', params: { arch: 'interline' } }
}

);

/* ================================================================ CMOS sensors and shutters */
Hyper.add(
{
  id: 'cmos-sensors', parent: 'image-sensors', title: 'CMOS sensors', level: 2,
  short: 'In a CMOS image sensor every pixel carries its own amplifier, and the chip is read row by row through thousands of column converters working in parallel. Any row or window can be addressed on its own, the supply is low, and the circuits for processing sit beside the pixels: that is why CMOS replaced the CCD almost everywhere.',
  keywords: ['CMOS image sensor', 'CIS', 'active pixel sensor', 'APS', '3T pixel', '4T pixel', 'pinned photodiode', 'correlated double sampling', 'CDS', 'column-parallel ADC', 'random access', 'windowing', 'on-chip processing', 'low power', 'row time', 'sCMOS', 'fixed-pattern noise'],
  prereq: ['how-a-pixel-detects-light', 'ccd-sensors'],
  related: ['rolling-and-global-shutter', 'binning-roi-and-area-of-interest', 'sensor-noise', 'microlenses-bsi-and-stacked-sensors', 'camera-interfaces', 'electronics:adc'],
  body: `
A CMOS image sensor uses the same photodiode as a CCD. What differs is what happens to the charge. In a **CMOS** sensor the charge is turned into a voltage *in the pixel*, by a small amplifier that sits next to the photodiode, and the voltage, not the charge, is sent out. ("CMOS" names the chip-making process, complementary metal–oxide–semiconductor, the one used for processors and memory; it says nothing about how light is detected.)

### The pixel: three or four transistors
- **3T pixel**: a reset transistor that empties the diode, a source follower that buffers the voltage, and a row-select switch. Simple, but the reset leaves a random offset (the kTC noise of the reset) that cannot be subtracted.
- **4T pixel**: adds a *transfer gate* and a pinned photodiode. The charge is collected in the diode, then moved onto a separate floating diffusion. The pixel reads the reset level first and the signal after the transfer, and the two are subtracted: **correlated double sampling** (CDS). It removes the reset noise and gives read noise of 1 to 3 electrons. Almost all modern sensors are 4T, often with two or four pixels sharing one amplifier.

### The array: rows, columns and parallel converters
The pixels of one row are selected at once and each puts its voltage on a **column line**. At the bottom of every column sits its own amplifier and, in most modern sensors, its own ADC. All the columns convert together, so a row of 4000 pixels is digitised in one *row time* of 5 to 20 µs; the digital values are then multiplexed off the chip. A frame takes

$$T = n_{\\mathrm{rows}} \\times t_{\\mathrm{row}}$$

and a 12-megapixel sensor of 3000 rows at 11 µs per row reads in 33 ms: 30 frames a second. Compare a CCD with one amplifier at 10 to 40 MHz: the same pixel count would take 0.3 to 1.2 s.

### What the layout gives
| | CCD | CMOS |
|---|---|---|
| Conversion | charge moved to one amplifier | voltage made in every pixel, one converter per column |
| Read noise | 2 to 5 e⁻ slow, 10 to 20 e⁻ fast | 1 to 3 e⁻ at video rates; scientific CMOS about 1 e⁻ |
| Speed | pixel clock of one port | rows × row time: hundreds to thousands of frames a second |
| Windows | read everything, then discard | **random access**: read only the rows or window wanted ([[binning-roi-and-area-of-interest]]) |
| Power | 1 to 5 W | tens to hundreds of milliwatts, a single low supply |
| Blooming, smear | possible | blooming rare, no transfer smear |
| On-chip functions | none | ADC, timing, binning, HDR, autofocus pixels, image processing |
| Shutter | interline: global | rolling unless the pixel has a storage node ([[rolling-and-global-shutter]]) |

### The price of a pixel amplifier
Each pixel's amplifier and each column's converter differ a little from their neighbours, giving **fixed-pattern noise**: offsets that CDS and calibration remove, and gain differences of a fraction of a per cent to a few per cent that stay as pixel response non-uniformity ([[sensor-noise]]). Transistors beside the photodiode also take area: the fill factor falls, which [[microlenses-bsi-and-stacked-sensors|microlenses and back illumination]] win back.

### Why it won
CMOS chips are made in the same factories as ordinary chips, so volume made them cheap. Pinned photodiodes with CDS, microlenses, back illumination and column ADCs closed the quality gap; stacking the logic under the pixels opened a speed gap in CMOS's favour. By the 2010s the great majority of image sensors in cameras, phones, cars and machines were CMOS.

> [!key] A CMOS sensor converts charge to voltage inside each pixel and reads the chip row by row through parallel column converters. That gives speed, windowing, low power and on-chip functions, with fixed-pattern noise to be calibrated away.
`,
  ideas: [
    'CMOS names the fabrication process; the light-detecting photodiode is the same as in a CCD.',
    'Each pixel converts its own charge to a voltage; a 4T pixel with a pinned photodiode and correlated double sampling reaches 1 to 3 e⁻ read noise.',
    'Column-parallel ADCs digitise a whole row at once, so the frame time is the number of rows times the row time.',
    'Rows and windows can be addressed directly (random access), which is the basis of fast regions of interest.',
    'Pixel-to-pixel differences in the amplifiers leave fixed-pattern noise that has to be calibrated.'
  ],
  pitfalls: [
    'CMOS sensors are noisier than CCDs — They were once. A modern 4T CMOS pixel with correlated double sampling has 1 to 3 e⁻ of read noise, as low as the best CCDs, at much higher speed.',
    'CMOS means a rolling shutter — Most CMOS sensors read row by row and so expose row by row, but global-shutter pixels with a storage node exist and are common in industrial cameras.',
    'A CMOS sensor reads all its pixels through one amplifier — It has one amplifier in each pixel (or shared by a few) and one converter per column: thousands working at once.',
    'CMOS is always cheaper — Large scientific and global-shutter sensors are costly; the saving comes from volume.'
  ],
  terms: [
    { term: 'CMOS image sensor', also: ['CIS', 'APS (active pixel sensor)'], def: 'An image sensor made in a CMOS process in which each pixel has its own amplifier, and the chip is read by selecting rows and digitising in column-parallel converters.' },
    { term: '4T pixel', also: ['four-transistor pixel', 'pinned-photodiode pixel'], def: 'A CMOS pixel with a pinned photodiode, a transfer gate, a reset, a source follower and a row select. It allows correlated double sampling and so low read noise.' },
    { term: 'Correlated double sampling', also: ['CDS'], def: 'Reading each pixel twice, once just after reset and once after the charge transfer, and subtracting. It removes the reset noise and offset differences.' },
    { term: 'Column-parallel ADC', also: ['column ADC'], def: 'An analogue-to-digital converter at the foot of every pixel column, so that a whole row is digitised in one row time.' },
    { term: 'Row time', also: ['line time', 't_row'], def: 'The time to select, read and digitise one row of pixels, typically 5 to 20 µs. The frame read-out time is the number of rows times it.' },
    { term: 'Random access', also: ['windowing'], def: 'The ability to address any row or window of pixels directly, so that only part of the chip need be read.' },
    { term: 'Fixed-pattern noise', also: ['FPN', 'DSNU', 'PRNU'], def: 'Pixel-to-pixel differences that do not change from frame to frame: offsets (dark signal non-uniformity) and gain differences (photo-response non-uniformity).' }
  ],
  formulas: [
    {
      name: 'Frame rate from the row time',
      expr: 'fps = 1/(nr*tl)', tex: 'f = \\frac{1}{n_r\\,t_{\\mathrm{row}}}',
      vars: {
        fps: { name: 'frame rate', q: 'frequency', unit: 'Hz', tex: 'f' },
        nr: { name: 'rows read', value: 3000, int: true, min: 1, max: 20000, tex: 'n_r' },
        tl: { name: 'row time', q: 'time', unit: 'µs', value: 11, tex: 't_{\\mathrm{row}}' }
      },
      note: 'Valid when the read-out limits the frame rate (no longer exposure or interface limits). Fewer rows read means a higher frame rate.',
      stories: { fps: 'A CMOS sensor reads {nr} rows at {tl} per row. What frame rate does the read-out allow?', nr: 'A sensor with a row time of {tl} must reach {fps}. How many rows can be read?' }
    },
    {
      name: 'Pixel rate of the chip',
      expr: 'fp = nx*ny*fps', tex: 'f_p = n_x\\,n_y\\,f',
      vars: {
        fp: { name: 'pixel rate', q: 'frequency', unit: 'MHz', tex: 'f_p' },
        nx: { name: 'pixels per row', value: 4000, int: true, min: 1, max: 20000, tex: 'n_x' },
        ny: { name: 'rows', value: 3000, int: true, min: 1, max: 20000, tex: 'n_y' },
        fps: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 30, tex: 'f' }
      },
      note: 'Millions of pixels a second: 360 million for a 12 MP sensor at 30 fps, which a single CCD port (10 to 40 MHz) could not deliver.',
      stories: { fp: 'A {nx} × {ny} pixel sensor runs at {fps}. How many pixels does it deliver each second?' }
    },
    {
      name: 'Data rate of the sensor',
      expr: 'R = nx*ny*b*fps', tex: 'R = n_x\\,n_y\\,b\\,f',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'Gbit/s' },
        nx: { name: 'pixels per row', value: 4000, int: true, min: 1, max: 20000, tex: 'n_x' },
        ny: { name: 'rows', value: 3000, int: true, min: 1, max: 20000, tex: 'n_y' },
        b: { name: 'bits per pixel', value: 10, int: true, min: 1, max: 24 },
        fps: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 30, tex: 'f' }
      },
      note: 'Uncompressed. This is the figure that decides which camera interface can carry the sensor.',
      stories: { R: 'A sensor of {nx} × {ny} pixels at {b} bits runs at {fps}. What data rate leaves the chip?' }
    }
  ],
  examples: [
    {
      title: 'A 12-megapixel sensor at video rate',
      q: 'A sensor has 4000 columns and 3000 rows, a row time of 11 µs and 10-bit output. What frame rate can it sustain and what data rate leaves the chip?',
      steps: [
        { text: 'The read-out time is', tex: 'T = 3000 \\times 11\\ \\mu\\mathrm{s} = 33\\ \\mathrm{ms}' },
        'The frame rate is 1/33 ms = 30 frames a second.',
        { text: 'The data rate is', tex: 'R = 4000 \\times 3000 \\times 10 \\times 30 = 3.6\\ \\mathrm{Gbit/s}' }
      ],
      a: '30 frames a second and 3.6 Gbit/s: more than a Gigabit Ethernet link carries, which is why such cameras use USB 3, CoaXPress or similar.'
    },
    {
      title: 'A narrow window',
      q: 'The same sensor reads only 600 rows centred on the action. What frame rate does the row time allow now, ignoring overhead?',
      steps: [
        { text: 'The read-out time falls in proportion to the rows:', tex: 'T = 600 \\times 11\\ \\mu\\mathrm{s} = 6.6\\ \\mathrm{ms}' },
        'So the frame rate rises to 1/6.6 ms = 150 frames a second.'
      ],
      a: 'About 150 frames a second: five times the rows removed, five times the speed. A CCD would have to clock out all the unwanted rows first.'
    }
  ],
  quiz: [
    { q: 'What does correlated double sampling remove?', choices: ['The reset noise and offsets of the pixel', 'The photon shot noise', 'The dark current', 'The colour filter\'s absorption'], a: 0, why: 'The pixel is read just after reset and again after the charge transfer; subtracting the two cancels the common reset level. Shot noise belongs to the light itself and is not touched.' },
    { q: 'A CMOS sensor has 2000 rows and a row time of 10 µs. What is its maximum frame rate in hertz?', answer: 50, unit: 'Hz', why: '$T = 2000 \\times 10\\ \\mu\\mathrm{s} = 20$ ms, so $f = 1/T = 50$ Hz.' },
    { q: '"CMOS" tells you that the sensor has a rolling shutter.', a: false, why: 'CMOS names the fabrication process. Rolling shutters come from reading row by row; global-shutter CMOS pixels with a storage node exist.' },
    { q: 'Which feature of the CMOS layout makes a fast region of interest possible?', choices: ['Any row or window can be addressed directly', 'All pixels share one amplifier', 'The charge is moved through the array', 'The pixels have no photodiode'], a: 0, why: 'Random access lets the chip read only the selected rows, so the frame time falls with the number of rows read.' },
    { q: 'A sensor has 4000 × 3000 pixels, 12 bits and runs at 60 frames a second. What data rate does it produce, in Gbit/s?', answer: 8.64, unit: 'Gbit/s', why: '$4000 \\times 3000 \\times 12 \\times 60 = 8.64\\times10^{9}$ bit/s.' }
  ],
  applications: [
    'Phone and compact-camera sensors, with stacked logic that digitises, processes and sometimes stores frames on the chip.',
    'Industrial cameras: fast area-scan and line-scan sensors read through ROI windows at thousands of frames a second.',
    'Scientific CMOS cameras for microscopy and astronomy, with about 1 e⁻ read noise over large, fast sensors.',
    'Automotive cameras (high-dynamic-range CMOS) and the cameras of drones, doorbells and endoscopes, where power and size matter.'
  ],
  history: 'Passive-pixel MOS sensors date from the 1960s but were noisy. The active pixel sensor was developed at NASA\'s Jet Propulsion Laboratory in the early 1990s by a team led by Eric Fossum, who pursued a "camera on a chip". The pinned photodiode, borrowed from CCDs, and correlated double sampling made the 4T pixel the standard from the 2000s.',
  sources: [
    'A. El Gamal and H. Eltoukhy, "CMOS image sensors", *IEEE Circuits and Devices Magazine* 21 (2005) 6–20.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press).',
    'J. Nakamura (ed.), *Image Sensors and Signal Processing for Digital Still Cameras* (CRC Press, 2006).'
  ],
  sim: 'is-cmos'
},

/* ================================================================ rolling and global shutters */
{
  id: 'rolling-and-global-shutter', parent: 'image-sensors', title: 'Rolling and global shutters', level: 2,
  short: 'A rolling-shutter sensor exposes its rows one after another, so a moving object is caught at slightly different moments from top to bottom: bars lean, propellers bend and short flashes light only a band. A global-shutter sensor exposes every pixel at the same instant, at the cost of a bigger pixel with a storage node.',
  keywords: ['rolling shutter', 'global shutter', 'electronic shutter', 'skew', 'jello effect', 'wobble', 'propeller', 'readout time', 'flash banding', 'global reset', 'storage node', 'parasitic light sensitivity', 'GSE', 'shear', 'distortion of moving objects'],
  prereq: ['cmos-sensors', 'shutter-types'],
  related: ['ccd-architectures', 'triggering-and-strobing', 'shutter-speed-and-motion', 'camera-artefacts-as-illusions', 'area-scan-and-line-scan-cameras', 'stroboscopic-effects'],
  body: `
A mechanical shutter opens and closes in front of the whole sensor. Most image sensors work without one: the pixels themselves start and stop collecting. *How* they do it, all at once or row by row, decides how a moving object looks.

### Rolling shutter
In a typical CMOS sensor the pixels are reset and read one row at a time, because there is only one set of column converters. Row 1 is reset, row 2 a **row time** later, row 3 a row time after that. Every row is exposed for the same time $t_{\\mathrm{exp}}$, but each starts one row time after the one above it. The whole picture is therefore not one moment but a *sweep*: the last row is exposed $T_{\\mathrm{ro}} = n_{\\mathrm{rows}} \\times t_{\\mathrm{row}}$ after the first, typically 3 to 30 ms (3000 rows at 10 µs is 30 ms).

The consequences are all visible:
- **Skew.** A vertical bar moving sideways leans: the top is drawn where it was earlier, the bottom where it is later. Its shear in the scene is $s = v \\times T_{\\mathrm{ro}}$: an object at 1 m/s with $T_{\\mathrm{ro}} = 20$ ms leans by 20 mm between the top and bottom of the picture.
- **Wobble ("jello").** Vibration at a frequency near the frame rate turns straight edges into waves.
- **Bent propellers and fans.** A blade turning during the sweep is caught at a growing angle in each row, so its image is curved, or has the wrong number of blades.
- **Flash banding.** A flash shorter than the sweep lights only the rows that happen to be exposing at that instant: a bright band across the picture. A flash needs all rows to be exposing together, which is possible only if $t_{\\mathrm{exp}} > T_{\\mathrm{ro}}$ and the flash falls in the overlap.

### Global shutter
A **global-shutter** pixel has a second place to keep its charge. At one instant every pixel's photodiode is emptied into its own storage node (a charge-domain storage diode, or a capacitor), and the nodes are then read out row by row at leisure. All pixels have the same exposure window; a moving object keeps its shape. (An interline CCD, which moves all the charge into its masked registers in one step, is a global shutter too: see [[ccd-architectures]].)

The costs: the storage node takes room in the pixel (a smaller photodiode or a bigger pixel); the stored charge adds some noise and dark current; and stray light can reach the node while it waits to be read, so the shutter is not perfectly dark: its **parasitic light sensitivity** is specified as a very small fraction, and low values are the mark of a good design.

### Choosing
| | Rolling | Global |
|---|---|---|
| Pixel | simple, small, sensitive | needs a storage node: larger or less sensitive |
| Read noise | lowest | a little higher |
| Moving objects | skewed by $v\\,T_{\\mathrm{ro}}$ | undistorted |
| Short flash or strobe | only if exposure is longer than the readout | works at any exposure |
| Typical use | phones, cameras, microscopy, security | machine vision, motion analysis, drones, barcode readers |

### What can be done with a rolling shutter
Read fewer rows (an [[binning-roi-and-area-of-interest|area of interest]] shortens $T_{\\mathrm{ro}}$), use a faster sensor, light the scene with a short strobe in the dark during the overlap of all exposures ([[triggering-and-strobing]]), or add a mechanical shutter that closes before the first row is read.

> [!key] Rolling shutter: rows exposed one row time apart, so motion shears by v × T_ro. Global shutter: every pixel exposed together through a storage node in each pixel, at the price of pixel area and a little noise.
`,
  ideas: [
    'A rolling shutter exposes row after row, each for the same time but one row time later than the one above.',
    'The readout time T_ro = rows × row time sets the distortion: shear = v × T_ro for an object of speed v.',
    'A flash shorter than the readout lights only a band of rows, unless the exposure is longer than T_ro.',
    'A global shutter stores each pixel\'s charge in a node at one instant, so all pixels share an exposure window.',
    'Global-shutter pixels pay in area, noise and parasitic light sensitivity.'
  ],
  pitfalls: [
    'A short exposure time removes rolling-shutter distortion — Each row is sharp, but the rows are still taken T_ro apart; the skew depends on the readout time, not on the exposure time.',
    'Rolling-shutter distortion is motion blur — Blur comes from motion during one row\'s exposure; skew comes from the delay between rows. A picture can have either or both.',
    'Global shutter pixels are better in every way — They need a storage node, which costs fill factor, adds noise and lets stray light in.',
    'A mechanical shutter makes a rolling-shutter sensor global — Only if the exposure is controlled entirely by the shutter and the readout happens after it closes; a focal-plane shutter itself is a travelling slit and distorts in the same way.'
  ],
  terms: [
    { term: 'Rolling shutter', def: 'An exposure in which the rows of the sensor are reset and read one after another, so each row\'s exposure starts one row time after the one above.' },
    { term: 'Global shutter', def: 'An exposure in which all pixels start and stop collecting together; each pixel stores its charge in a node until it is read.' },
    { term: 'Readout time', also: ['frame readout time', 'T_ro'], def: 'The time from the first row\'s exposure to the last row\'s: the number of rows times the row time. It sets the shear of a moving object.' },
    { term: 'Skew', also: ['shear', 'jello effect'], def: 'The slant given to a vertical edge moving sideways during a rolling-shutter exposure: its displacement in the scene is the speed times the readout time.' },
    { term: 'Storage node', also: ['memory node', 'sample-and-hold node'], def: 'The extra capacitor or diode in a global-shutter pixel that holds the charge or voltage between the end of the exposure and the read-out.' },
    { term: 'Parasitic light sensitivity', also: ['PLS', 'global-shutter efficiency'], def: 'The small fraction of light that reaches a global-shutter pixel\'s storage node and adds a false signal while the frame waits to be read.' }
  ],
  formulas: [
    {
      name: 'Readout time of a rolling-shutter sensor',
      expr: 'Tro = nr*tl', tex: 'T_{\\mathrm{ro}} = n_r\\,t_{\\mathrm{row}}',
      vars: {
        Tro: { name: 'time from first to last row', q: 'time', unit: 'ms', tex: 'T_{\\mathrm{ro}}' },
        nr: { name: 'rows', value: 3000, int: true, min: 1, max: 20000, tex: 'n_r' },
        tl: { name: 'row time', q: 'time', unit: 'µs', value: 10, tex: 't_{\\mathrm{row}}' }
      },
      stories: { Tro: 'A rolling-shutter sensor of {nr} rows has a row time of {tl}. How long after the first row is the last row exposed?' }
    },
    {
      name: 'Shear of a moving object',
      expr: 's = v*Tro', tex: 's = v\\,T_{\\mathrm{ro}}',
      vars: {
        s: { name: 'sideways displacement between the top and bottom rows (in the scene)', q: 'length', unit: 'mm' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1 },
        Tro: { name: 'readout time', q: 'time', unit: 'ms', value: 20, tex: 'T_{\\mathrm{ro}}' }
      },
      note: 'Measured in the scene at the object. Divide by the width of one pixel in the scene to get the skew in pixels.',
      stories: { s: 'A part moves at {v} past a rolling-shutter camera with a readout time of {Tro}. By how much does it appear sheared in the scene?' }
    },
    {
      name: 'Skew in pixels',
      expr: 'n = v*Tro*Np/W', tex: 'n = \\frac{v\\,T_{\\mathrm{ro}}\\,N_p}{W}',
      vars: {
        n: { name: 'skew between the top and bottom rows, in pixels' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1 },
        Tro: { name: 'readout time', q: 'time', unit: 'ms', value: 20, tex: 'T_{\\mathrm{ro}}' },
        Np: { name: 'pixels across the field of view', value: 2000, int: true, tex: 'N_p' },
        W: { name: 'width of the field of view', q: 'length', unit: 'mm', value: 400 }
      },
      stories: { n: 'A conveyor moves at {v}. The camera sees a field {W} wide on {Np} pixels with a readout time of {Tro}. How many pixels of skew appear between the top and bottom of the picture?' }
    }
  ],
  examples: [
    {
      title: 'A part on a conveyor',
      q: 'A rolling-shutter camera views a 400 mm wide field on 2000 pixels. The sensor has 1500 rows at 13 µs each. Parts travel at 1 m/s. How much does a vertical edge lean, and would a gauge to 0.1 mm be possible?',
      steps: [
        { text: 'The readout time is', tex: 'T_{\\mathrm{ro}} = 1500 \\times 13\\ \\mu\\mathrm{s} = 19.5\\ \\mathrm{ms}' },
        { text: 'The shear in the scene is', tex: 's = 1\\ \\mathrm{m/s} \\times 19.5\\ \\mathrm{ms} = 19.5\\ \\mathrm{mm}' },
        'One pixel is 400/2000 = 0.2 mm, so the skew is about 98 pixels, nearly 5 % of the picture width.'
      ],
      a: '19.5 mm, about 98 pixels. The object is not simply moved but distorted: nothing measured on it to 0.1 mm can be trusted. A global shutter, or a strobe in a dark scene, is needed.'
    },
    {
      title: 'A flash in a rolling-shutter camera',
      q: 'A camera has a readout time of 30 ms. A flash lasts 1 ms. What exposure time must be set so that every row sees the whole flash, and what happens at 1/250 s (4 ms)?',
      steps: [
        'All rows are exposing at the same time only if the exposure is longer than $T_{\\mathrm{ro}} = 30$ ms; the overlap lasts $t_{\\mathrm{exp}} - T_{\\mathrm{ro}}$.',
        'At 4 ms exposure the first row has finished long before the last one starts: there is no instant at which all rows are open. A row catches the flash only if its 4 ms window overlaps the 1 ms flash, which holds for rows that start within a span of 4 + 1 = 5 ms out of the 30 ms sweep: a band of 5/30, one sixth of the picture.'
      ],
      a: 'The exposure must exceed 30 ms with the flash in the overlap. At 4 ms only a band of roughly one sixth of the picture is lit.'
    }
  ],
  quiz: [
    { q: 'A rolling-shutter sensor of 2000 rows has a row time of 10 µs. A vertical post moves sideways at 2 m/s. How far, in millimetres, does it lean in the scene between the top and bottom of the image?', answer: 40, unit: 'mm', why: '$T_{ro} = 2000 \\times 10\\ \\mu\\mathrm{s} = 20$ ms; $s = 2 \\times 0.020 = 0.040$ m = 40 mm.' },
    { q: 'Reducing the exposure time from 1 ms to 50 µs on a rolling-shutter camera…', choices: ['sharpens each row but leaves the skew unchanged', 'removes the skew', 'doubles the skew', 'makes the skew depend on the lens'], a: 0, why: 'Skew comes from the delay between rows (the readout time), not from how long each row is exposed.' },
    { q: 'A global-shutter pixel needs an extra storage node, which makes it a little noisier and less sensitive than a rolling-shutter pixel of the same size.', a: true, why: 'The node takes area and adds charge-transfer noise and dark current, and stray light can leak into it: those are the costs of the all-at-once exposure.' },
    { q: 'Which action shortens the skew of a rolling-shutter camera?', choices: ['Reading only a band of rows (a smaller area of interest)', 'Lengthening the exposure time', 'Opening the aperture', 'Using a longer focal length'], a: 0, why: 'Skew is proportional to the readout time, which is the number of rows read times the row time. Fewer rows, shorter readout.' },
    { q: 'A strobe flash of 100 µs is used with a rolling-shutter sensor of 25 ms readout. For every row to be lit equally the exposure time must be at least…', choices: ['longer than 25 ms, with the flash in the overlap', '100 µs', 'equal to the flash duration', 'any time: the flash is too short to matter'], a: 0, why: 'Only when the exposure is longer than the readout time is there an interval in which every row is open; the flash must fall in it.' }
  ],
  applications: [
    'Phone and consumer video cameras are rolling shutter: the bent propellers of drone videos and the lean of fast-passing cars.',
    'Machine vision on moving conveyors, motion analysis, drones for mapping and barcode readers use global-shutter sensors.',
    'Microscopy and astronomy use rolling-shutter scientific CMOS for its lowest read noise, with exposures much longer than the readout.',
    'High-speed cameras usually use global shutters, or readout times of a few hundred microseconds, to avoid skew.'
  ],
  history: 'Interline CCDs gave consumer video cameras a global electronic shutter from the 1980s. Early CMOS cameras of the 2000s introduced the rolling shutter to the public, with the "jello" distortions of video; global-shutter CMOS pixels became common in industrial cameras in the 2010s.',
  sources: [
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — shutters in CMOS pixels.',
    'EMVA Standard 1288 — the specification of exposure, readout and shutter efficiency of cameras.',
    'M. Meingast, C. Geyer and S. Sastry, "Geometric models of rolling-shutter cameras" (2005), a paper on the geometry of the distortion.'
  ],
  sim: 'is-shutter'
},

/* ================================================================ quantum efficiency */
{
  id: 'quantum-efficiency-and-spectral-response', parent: 'image-sensors', title: 'Quantum efficiency and spectral response', level: 2,
  short: 'Quantum efficiency is the fraction of arriving photons that become collected electrons, and it depends on wavelength. A silicon sensor peaks at 60 to 90 % around 500 to 650 nm and falls to zero near 1100 nm; the infrared-cut filter, the colour filters and the thickness of the silicon shape the curve you actually get.',
  keywords: ['quantum efficiency', 'QE', 'spectral response', 'responsivity', 'A/W', 'IR-cut filter', 'infrared cut', 'monochrome sensor', 'colour sensor', 'NIR sensitivity', 'absorption depth', 'back-illuminated', 'spectral sensitivity', 'relative response', 'silicon'],
  prereq: ['how-a-pixel-detects-light', 'photon-energy', 'the-optical-spectrum'],
  related: ['microlenses-bsi-and-stacked-sensors', 'colour-filter-arrays-and-demosaicing', 'infrared-and-thermal-sensors', 'sensor-noise', 'the-luminosity-function', 'interference-filters', 'transmission-and-absorption'],
  body: `
**Quantum efficiency** (QE) answers one question: of 100 photons of wavelength $\\lambda$ arriving at a pixel, how many electrons end up in its well? A QE of 0.6 at 550 nm means 60. The answer changes with wavelength, with the sensor design, and with everything in front of the silicon.

### Why the curve has its shape
Three things set the QE of silicon.
- **Surface losses.** Some light is reflected by the surface layers (4 to 30 % depending on the coatings), and some is absorbed by wiring, colour filters or dead layers on the way.
- **Short wavelengths are absorbed at the top.** Blue light is absorbed within a fraction of a micrometre of the surface. In a front-illuminated sensor the photodiode lies under a stack of layers, so blue is partly lost before it arrives.
- **Long wavelengths go deep.** Red and infrared photons travel micrometres before they are absorbed, and a photodiode only 3 to 5 µm deep catches a fraction of them: the rest pass through. At 1000 nm the absorption depth is about 150 µm, so QE falls towards zero; at 1100 nm the photon no longer has the energy to be absorbed at all.

For an absorption coefficient $\\alpha(\\lambda)$, a dead layer $d_0$ on top and a collecting layer of thickness $W$, the fraction collected is

$$\\eta \\approx (1 - R_s)\\left(e^{-\\alpha d_0} - e^{-\\alpha (d_0 + W)}\\right)$$

where $R_s$ is the reflectance of the surface. The simulation below draws the curves from this model with the absorption coefficient of silicon.

### Typical peak QE
| Sensor | Peak QE | Where |
|---|---|---|
| Front-illuminated CMOS, monochrome | 50 to 75 % | 500 to 650 nm |
| Back-illuminated CMOS (BSI) | 80 to 95 % | 500 to 600 nm |
| Back-thinned scientific CCD, anti-reflection coated | 90 to 97 % | 550 to 700 nm |
| Deep-depletion CCD or NIR-enhanced CMOS | 30 to 60 % at 850 nm | thick silicon reaches further |
| Colour sensor, one colour channel | 30 to 50 % | band set by its filter |

### Responsivity
Detectors are also described by the current they give per watt of light: the **responsivity**,
$$\\mathcal{R} = \\eta\\,\\frac{q\\,\\lambda}{h\\,c} = \\eta\\,\\frac{\\lambda[\\mathrm{nm}]}{1239.84}\\ \\mathrm{A/W}$$
An ideal silicon photodiode ($\\eta = 1$) gives 0.44 A/W at 550 nm and 0.81 A/W at 1000 nm: a photon of longer wavelength carries less energy, so a watt of it contains more photons.

### The infrared-cut filter and the colour sensor
The eye stops at about 700 nm; silicon continues to 1100 nm. A camera that recorded the infrared would show green leaves white and black cloth brown. So a colour camera has an **infrared-cut filter** (a multilayer coating or absorbing glass) that passes the visible and blocks 700 to 1100 nm; its half-transmission point is typically near 650 to 690 nm. Each pixel of a colour sensor also has a red, green or blue filter over it, and the colour sensor, white-light-wise, collects about a third to a half of the light of a monochrome one. Monochrome machine-vision cameras usually have no infrared-cut filter, so that near-infrared illumination at 850 or 940 nm can be used: see the [[colour-and-multispectral-imaging|multispectral page]].

> [!key] QE is electrons per photon, as a function of wavelength. Silicon peaks at 60 to 90 % in the visible and drops to zero at 1100 nm; the IR-cut filter and the colour filters then cut it down to what the camera is meant to see.
`,
  ideas: [
    'QE is the fraction of arriving photons that become collected electrons, at each wavelength.',
    'Silicon QE peaks at 60 to 90 % in the visible and falls to zero near 1100 nm, where photons lack the band-gap energy.',
    'Blue is lost at the surface and red/infrared passes through a thin photodiode; back illumination and thicker silicon move the ends of the curve.',
    'Responsivity R = QE · λ/1239.84 in A/W: for a given QE, longer wavelengths give more current per watt.',
    'The infrared-cut filter and the colour filters, not the silicon, make a camera see like an eye.'
  ],
  pitfalls: [
    'A QE of 60 % means the sensor loses 40 % of the light everywhere — It is a function of wavelength: 60 % at one wavelength may be 20 % at another, and 0 % beyond 1100 nm.',
    'Colour and monochrome sensors have the same sensitivity — A colour sensor\'s filters take away about two thirds of the light at each pixel: a monochrome sensor collects about two to three times more in white light.',
    'Silicon cannot see the infrared — It sees to 1100 nm. Without an infrared-cut filter an ordinary camera sees 850 nm illuminators as bright light.',
    'High responsivity means high efficiency — Responsivity in A/W grows with wavelength even at a fixed QE; compare QE across wavelengths, not responsivity.'
  ],
  terms: [
    { term: 'Quantum efficiency', also: ['QE', 'η'], def: 'The average number of electrons collected per photon incident on the pixel, at a given wavelength. A fraction between 0 and 1 (or a percentage).' },
    { term: 'Responsivity', also: ['spectral responsivity', 'A/W'], def: 'The photocurrent per watt of incident light, in amperes per watt: QE × λ[nm]/1239.84. A photodiode specification.' },
    { term: 'Spectral response', also: ['spectral sensitivity', 'relative response'], def: 'The sensitivity of a sensor as a function of wavelength, shown as a QE or relative-response curve.' },
    { term: 'Infrared-cut filter', also: ['IR-cut', 'IRCF', 'hot mirror'], def: 'A filter that transmits the visible spectrum and blocks the near infrared (about 700 to 1100 nm), which silicon would otherwise record as false light and colour.' },
    { term: 'Absorption depth', also: ['absorption length', '1/α'], def: 'The depth in a material at which the intensity of light has fallen to 1/e: about 0.1 µm for blue and 150 µm for 1000 nm light in silicon.' },
    { term: 'NIR-enhanced', also: ['deep depletion', 'thick epitaxial layer'], def: 'A sensor with a thicker light-collecting layer so that near-infrared photons are absorbed within it, raising the QE beyond 800 nm.' }
  ],
  formulas: [
    {
      name: 'Responsivity of a photodetector',
      expr: 'Rr = eta*qe*lambda/(h*c)', tex: '\\mathcal{R} = \\eta\\,\\frac{q\\,\\lambda}{h\\,c}',
      vars: {
        Rr: { name: 'responsivity', q: 'responsivity', unit: 'A/W', tex: '\\mathcal{R}' },
        eta: { name: 'quantum efficiency (fraction)', value: 0.7, min: 0, max: 1, tex: '\\eta' },
        qe: { const: 'qe', tex: 'q' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 600, tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' }
      },
      note: 'About 0.34 A/W for a QE of 0.7 at 600 nm.',
      stories: { Rr: 'A photodiode has a quantum efficiency of {eta} at {lambda}. What is its responsivity?', eta: 'A silicon photodiode gives {Rr} at {lambda}. What is its quantum efficiency?' }
    },
    {
      name: 'Electrons collected from the incident light',
      expr: 'Ne = eta*E*A*t*lambda/(h*c)', tex: 'N_e = \\eta\\,\\frac{E\\,A\\,t\\,\\lambda}{h\\,c}',
      vars: {
        Ne: { name: 'electrons collected', tex: 'N_e' },
        eta: { name: 'quantum efficiency (fraction)', value: 0.6, min: 0, max: 1, tex: '\\eta' },
        E: { name: 'irradiance at the sensor', q: 'intensity', unit: 'mW/m²', value: 1.5 },
        A: { name: 'pixel area', q: 'area', unit: 'µm²', value: 9 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 33 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 555, tex: '\\lambda' },
        h: { const: 'h' }, c: { const: 'c' }
      },
      stories: { Ne: 'A pixel of {A} with a quantum efficiency of {eta} receives {E} of {lambda} light for {t}. How many electrons does it collect?' }
    },
    {
      name: 'Absorption depth',
      expr: 'La = 1/alpha', tex: 'L_a = \\frac{1}{\\alpha}',
      vars: {
        La: { name: 'absorption depth', q: 'length', unit: 'µm', tex: 'L_a' },
        alpha: { name: 'absorption coefficient', q: 'wavenumber', unit: '1/cm', value: 7000, min: 1, max: 1e7, tex: '\\alpha' }
      },
      note: 'Silicon at room temperature: about 1 × 10⁵ cm⁻¹ at 400 nm, 7000 cm⁻¹ at 550 nm, 1900 cm⁻¹ at 700 nm, 300 cm⁻¹ at 900 nm, 60 cm⁻¹ at 1000 nm.',
      stories: { La: 'Silicon absorbs a wavelength with a coefficient of {alpha}. At what depth has its intensity fallen to 1/e?' }
    },
    {
      name: 'Fraction collected by a thin photodiode',
      expr: 'eta = (1 - Rs)*(exp(-alpha*d0) - exp(-alpha*(d0 + W)))', tex: '\\eta = (1 - R_s)\\left(e^{-\\alpha d_0} - e^{-\\alpha (d_0 + W)}\\right)',
      vars: {
        eta: { name: 'quantum efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        Rs: { name: 'surface reflectance', q: 'ratio', unit: '%', value: 10, min: 0, max: 60, tex: 'R_s' },
        alpha: { name: 'absorption coefficient', q: 'wavenumber', unit: '1/cm', value: 7000, min: 1, max: 1e6, tex: '\\alpha' },
        d0: { name: 'dead layer above the photodiode', q: 'length', unit: 'µm', value: 0.5, min: 0, max: 10, tex: 'd_0' },
        W: { name: 'thickness of the collecting layer', q: 'length', unit: 'µm', value: 4, min: 0.1, max: 100 }
      },
      note: 'A model, not a datasheet: it ignores charge diffusing in from below the diode and the light bounced back by the layers beneath.',
      practice: { unknowns: ['eta'] }
    }
  ],
  examples: [
    {
      title: 'Green against near infrared',
      q: 'A front-illuminated pixel has a dead layer of 0.5 µm and a photodiode 4 µm thick, and loses 10 % of the light at its surface. At 550 nm the absorption coefficient of silicon is 7000 cm⁻¹; at 850 nm it is 540 cm⁻¹. What QE does the model give at each?',
      steps: [
        { text: 'At 550 nm, $\\alpha = 0.7\\ \\mu\\mathrm{m}^{-1}$:', tex: '\\eta = 0.9\\,(e^{-0.35} - e^{-3.15}) = 0.9\\,(0.705 - 0.043) = 0.60' },
        { text: 'At 850 nm, $\\alpha = 0.054\\ \\mu\\mathrm{m}^{-1}$:', tex: '\\eta = 0.9\\,(e^{-0.027} - e^{-0.243}) = 0.9\\,(0.973 - 0.784) = 0.17' }
      ],
      a: '60 % at 550 nm but only 17 % at 850 nm: the near-infrared photons are mostly absorbed below the 4 µm photodiode, so a thick, NIR-enhanced sensor is needed for infrared work.'
    },
    {
      title: 'The same QE, different current',
      q: 'A silicon photodiode has a QE of 0.5 at both 500 nm and 1000 nm. What current does 1 mW give at each?',
      steps: [
        { text: 'At 500 nm:', tex: '\\mathcal{R} = 0.5 \\times \\frac{500}{1239.84} = 0.20\\ \\mathrm{A/W}' },
        { text: 'At 1000 nm:', tex: '\\mathcal{R} = 0.5 \\times \\frac{1000}{1239.84} = 0.40\\ \\mathrm{A/W}' }
      ],
      a: '0.20 mA at 500 nm and 0.40 mA at 1000 nm. The infrared photons are each less energetic, so there are more of them in a milliwatt, and each one counts equally.'
    }
  ],
  quiz: [
    { q: 'A sensor has a QE of 0.8 at 600 nm. Of 1000 photons of 600 nm arriving at a pixel, how many electrons are collected on average?', answer: 800, why: 'QE is electrons per incident photon: 0.8 × 1000 = 800.' },
    { q: 'Why does the QE of a thin silicon photodiode fall at 900 nm?', choices: ['Photons are absorbed deeper than the photodiode, and many pass through', 'Photons have too little energy to free an electron at 900 nm', 'The infrared-cut filter blocks them', 'Silicon reflects infrared more strongly'], a: 0, why: 'At 900 nm silicon still absorbs (the photon energy is 1.38 eV, above the band gap) but only within about 30 µm, far deeper than a 3 to 5 µm photodiode. The IR-cut filter is a separate, additional cause in a camera.' },
    { q: 'A colour sensor without an infrared-cut filter will show correct colours.', a: false, why: 'Silicon and the colour filters let near-infrared through, so infrared adds to all three colour channels and washes the colours out (greenery turns whitish).' },
    { q: 'A photodiode has a QE of 0.6 at 800 nm. What is its responsivity in A/W?', answer: 0.387, unit: 'A/W', why: '$\\mathcal{R} = \\eta\\,\\lambda/1239.84 = 0.6 \\times 800/1239.84 = 0.387$ A/W.' },
    { q: 'Which change raises the QE of blue light most?', choices: ['Back illumination', 'A longer focal length', 'A bigger well', 'A thicker infrared-cut filter'], a: 0, why: 'In a back-illuminated sensor the light enters the silicon directly, without crossing the wiring layers; blue, absorbed at the surface, reaches the photodiode almost intact.' }
  ],
  applications: [
    'Choosing a camera: the QE curve at the wavelength of the illumination (for instance 625 nm red or 850 nm infrared LEDs) decides the exposure time.',
    'Scientific cameras are bought on QE: back-thinned sensors with 95 % peak QE make dim fluorescence and faint stars visible.',
    'Day-and-night security cameras swap the infrared-cut filter out at night to use 850 or 940 nm illuminators.',
    'Photodiode light meters and laser power meters are calibrated in A/W, from the QE and the wavelength.'
  ],
  history: 'The effective quantum efficiency of photographic film is a few per cent at best, and silicon detectors exceeded it from the start. The back-thinned CCD, thinned to about 10 µm so that light enters from the back, was developed for astronomy from the 1970s, because it raised the QE of blue and ultraviolet light from well under 20 % to more than 50 %.',
  sources: [
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — how QE and responsivity are measured.',
    'M. A. Green and M. J. Keevers, "Optical properties of intrinsic silicon at 300 K", *Progress in Photovoltaics* 3 (1995) 189–192 — the absorption coefficient used for the curves.',
    'J. R. Janesick, *Scientific Charge-Coupled Devices* (SPIE Press, 2001) — back-thinned and deep-depletion devices.'
  ],
  sim: 'is-qe'
}

);

/* ================================================================ noise, dynamic range, formats, colour */
Hyper.add(
{
  id: 'sensor-noise', parent: 'image-sensors', title: 'Sensor noise', level: 2,
  short: 'The grain in a dim picture has four sources: the random arrival of photons (shot noise, √N), the electronics of the read-out (read noise), thermal electrons (dark current, which doubles every 6 to 8 °C) and pixel-to-pixel differences (fixed pattern). Signal-to-noise ratio tells which wins, and the EMVA 1288 standard measures them all in one way.',
  keywords: ['sensor noise', 'shot noise', 'photon noise', 'read noise', 'dark current', 'fixed-pattern noise', 'DSNU', 'PRNU', 'SNR', 'signal-to-noise ratio', 'EMVA 1288', 'photon transfer curve', 'temporal noise', 'quantization noise', 'dark signal', 'cooling'],
  prereq: ['how-a-pixel-detects-light', 'quantum-efficiency-and-spectral-response'],
  related: ['dynamic-range-and-full-well', 'iso-and-gain', 'cmos-sensors', 'ccd-sensors', 'binning-roi-and-area-of-interest', 'sensor-formats-and-pixel-size', 'the-light-budget'],
  body: `
Take a picture of a uniform grey wall in dim light and the pixels do not agree: some are brighter, some darker, and the pattern changes from frame to frame. That is **noise**, and it comes from four sources that behave differently.

### The four sources
| Source | Where it comes from | How it grows with the signal | Typical size |
|---|---|---|---|
| **Photon shot noise** | light arrives as discrete photons at random times (Poisson statistics) | $\\sqrt{N}$ for $N$ collected electrons | 100 e⁻ at 10 000 e⁻ |
| **Read noise** | the amplifier, the ADC and the reset: added each time a pixel is read | constant | 1 to 3 e⁻ (good CMOS), 2 to 30 e⁻ in consumer cameras depending on gain |
| **Dark current** | electrons freed by heat alone, with no light | grows with time; shot noise $\\sqrt{D}$ | 0.1 to 10 e⁻/s at 25 °C for CMOS; below 0.001 for a cooled CCD at −100 °C |
| **Fixed pattern** | pixels differ in offset (DSNU) and gain (PRNU) | PRNU: proportional to the signal | PRNU 0.5 to 2 % |

Shot noise is not a defect of the sensor: it is in the light. An ideal sensor of 100 % efficiency and no electronics at all still has a signal-to-noise ratio of $\\sqrt{N}$. Dark current doubles for every 6 to 8 °C: a sensor 35 °C warmer has $2^{5} = 32$ times the dark current, and cooling is the remedy. Read noise matters only when the signal is small.

### Signal-to-noise ratio
The independent noises add as variances, so for $S$ signal electrons, $D$ dark electrons and read noise $r$:

$$\\mathrm{SNR} = \\frac{S}{\\sqrt{S + D + r^{2}}}$$

with $S = \\eta N_p$. Three regimes follow, and the simulation plots all three:
- **Read-noise limited** ($S < r^2$): $\\mathrm{SNR} \\approx S/r$: doubling the light doubles the SNR.
- **Shot-noise limited** ($S > r^2$): $\\mathrm{SNR} \\approx \\sqrt{S}$: doubling the light raises the SNR by 1.41.
- **PRNU limited**: the SNR stops at $1/\\mathrm{PRNU}$, about 100 for 1 %, however bright the light, because the gain differences of the pixels are proportional to the signal.

The crossover from read to shot noise is at $S = r^2$: 9 electrons for $r = 3\\,\\mathrm{e}^-$. At 10 000 electrons the SNR is 100 (40 dB); averaging 16 frames improves the random noise by 4.

### Measuring noise: EMVA 1288
Every maker's datasheet once used its own method. The EMVA 1288 standard of the European Machine Vision Association fixes one: a uniform monochromatic light source, a series of exposures from dark to saturation, and the *photon transfer curve*: the variance of the grey values plotted against their mean. Its slope gives the system gain $K$ (in DN per electron); from there the standard derives the quantum efficiency, the temporal dark noise in electrons, the saturation capacity, the SNR at saturation, the **absolute sensitivity threshold** (the fewest photons that give SNR = 1), the dynamic range, DSNU and PRNU. Cameras that quote EMVA 1288 figures can be compared directly.

### What averaging and cooling can do
Averaging $n$ frames lowers the *temporal* noise by $\\sqrt{n}$ but leaves the fixed pattern (PRNU, DSNU) untouched, which a flat-field correction removes instead. Cooling lowers only the dark current. And quantization in the ADC adds $K/\\sqrt{12}$ electrons, negligible when $K$ is below the read noise.

> [!key] Noise = shot noise (√N, from the light) + read noise (constant) + dark current (temperature) + fixed pattern (proportional to the signal). At low light the read noise wins, at high light the shot noise, and at the top the PRNU.
`,
  ideas: [
    'Photon shot noise is √N and belongs to the light itself: no sensor can beat SNR = √(QE · photons).',
    'Read noise is a fixed number of electrons per read, important only at low signal.',
    'Dark current grows with time and doubles every 6 to 8 °C: cool the sensor or shorten the exposure.',
    'Independent noises add in quadrature: SNR = S/√(S + D + r²).',
    'EMVA 1288 measures quantum efficiency, gain, dark noise, saturation capacity, DSNU and PRNU the same way for every camera.'
  ],
  pitfalls: [
    'Noise is the sensor\'s fault; a perfect sensor would have none — Even a perfect sensor has shot noise, because light arrives in random photons. Only more light improves it.',
    'Averaging frames removes all noise — It removes the random (temporal) part by √n. Fixed-pattern noise is the same in every frame and needs a flat-field correction.',
    'Cooling reduces every kind of noise — It reduces the dark current and its shot noise. Shot noise and read noise are barely affected.',
    'A high ISO makes the sensor noisier — A high ISO usually means less light was collected; the SNR follows the photons, and the extra gain also lowers the input-referred read noise.'
  ],
  terms: [
    { term: 'Shot noise', also: ['photon noise', 'Poisson noise'], def: 'The random variation in the number of photons (and so electrons) collected in an exposure. For N electrons it is √N electrons rms. It is a property of light, not of the sensor.' },
    { term: 'Read noise', also: ['readout noise', 'temporal dark noise'], def: 'The electronic noise added when a pixel is read, in electrons rms, independent of the signal. 1 to 3 e⁻ in a good CMOS pixel.' },
    { term: 'Dark current', also: ['dark signal'], def: 'Electrons generated by heat in the pixel with no light, in electrons per pixel per second. It roughly doubles every 6 to 8 °C.' },
    { term: 'DSNU', also: ['dark signal non-uniformity', 'offset fixed-pattern noise'], def: 'Pixel-to-pixel differences in the dark signal, the same in every frame. Removed by subtracting a dark frame.' },
    { term: 'PRNU', also: ['photo response non-uniformity', 'gain fixed-pattern noise'], def: 'Pixel-to-pixel differences in sensitivity, proportional to the signal, typically 0.5 to 2 %. It limits the SNR to 1/PRNU at high light.' },
    { term: 'Signal-to-noise ratio', also: ['SNR'], def: 'The mean signal divided by the rms noise, often quoted in decibels as 20 log₁₀ of the ratio. 100 is 40 dB.' },
    { term: 'EMVA 1288', also: ['EMVA standard 1288'], def: 'The standard of the European Machine Vision Association for measuring and presenting the characteristics of image sensors and cameras: QE, gain, noise, saturation capacity, dynamic range, DSNU and PRNU.' }
  ],
  formulas: [
    {
      name: 'Signal-to-noise ratio of a pixel',
      expr: 'snr = eta*Np/sqrt(eta*Np + Nd + r^2)', tex: '\\mathrm{SNR} = \\frac{\\eta N_p}{\\sqrt{\\eta N_p + N_d + r^2}}',
      vars: {
        snr: { name: 'signal-to-noise ratio', tex: '\\mathrm{SNR}' },
        eta: { name: 'quantum efficiency (fraction)', value: 0.6, min: 0.01, max: 1, tex: '\\eta' },
        Np: { name: 'photons arriving at the pixel', value: 10000, min: 0, tex: 'N_p' },
        Nd: { name: 'dark electrons collected', value: 5, min: 0, tex: 'N_d' },
        r: { name: 'read noise (electrons rms)', q: false, unit: 'e⁻', value: 3, min: 0, max: 100 }
      },
      note: 'Shot noise of the signal, shot noise of the dark charge and read noise, added as variances. Fixed-pattern noise is left out.',
      stories: { snr: 'A pixel receives {Np} photons at a quantum efficiency of {eta}, with {Nd} dark electrons and a read noise of {r}. What is its signal-to-noise ratio?' }
    },
    {
      name: 'The limit set by the light alone',
      expr: 'snr = sqrt(S)', tex: '\\mathrm{SNR} = \\sqrt{S}',
      vars: {
        snr: { name: 'shot-noise-limited SNR', tex: '\\mathrm{SNR}' },
        S: { name: 'collected electrons', value: 20000, min: 0 }
      },
      note: 'No sensor can do better. A full well of 20 000 e⁻ gives SNR 141, or 43 dB.',
      stories: { snr: 'A pixel collects {S} electrons from a bright, uniform target. What is the best SNR it can reach?', S: 'What signal does a pixel need to reach an SNR of {snr}, limited by shot noise?' }
    },
    {
      name: 'Dark current against temperature',
      expr: 'D = D0*2^(dT/Td)', tex: 'D = D_0\\,2^{\\,\\Delta T/T_d}',
      vars: {
        D: { name: 'dark current at the new temperature', q: false, unit: 'e⁻/s' },
        D0: { name: 'dark current at the reference temperature', q: false, unit: 'e⁻/s', value: 5, tex: 'D_0' },
        dT: { name: 'temperature above the reference', q: 'dtemp', unit: 'K', value: 35, signed: true, min: -120, max: 80, tex: '\\Delta T' },
        Td: { name: 'doubling interval', q: 'dtemp', unit: 'K', value: 7, min: 4, max: 12, tex: 'T_d' }
      },
      note: 'Silicon sensors double every 6 to 8 K; use the datasheet value if you have it.',
      stories: { D: 'A sensor has {D0} of dark current at its reference temperature, and it doubles every {Td}. What is the dark current {dT} away from the reference?' }
    },
    {
      name: 'The ceiling from pixel non-uniformity',
      expr: 'snrmax = 1/pr', tex: '\\mathrm{SNR}_{\\max} = \\frac{1}{\\mathrm{PRNU}}',
      vars: {
        snrmax: { name: 'highest SNR a single frame can reach', tex: '\\mathrm{SNR}_{\\max}' },
        pr: { name: 'photo response non-uniformity', q: 'ratio', unit: '%', value: 1, min: 0.05, max: 10, tex: '\\mathrm{PRNU}' }
      },
      note: 'Gain differences are proportional to the signal, so they cap the SNR however much light there is, until a flat-field correction is applied.',
      stories: { snrmax: 'A sensor has a PRNU of {pr}. What is the best SNR of an uncorrected frame?' }
    }
  ],
  examples: [
    {
      title: 'A dim pixel and a bright one',
      q: 'A sensor has a QE of 0.6 and a read noise of 3 e⁻, and negligible dark current. What SNR does a pixel reach with 100 photons, and with 10 000?',
      steps: [
        { text: 'With 100 photons the signal is 60 e⁻ and the noise is', tex: '\\sqrt{60 + 9} = 8.3\\ \\mathrm{e^-} \\Rightarrow \\mathrm{SNR} = 7.2' },
        { text: 'With 10 000 photons the signal is 6000 e⁻ and the noise is', tex: '\\sqrt{6000 + 9} = 77.5\\ \\mathrm{e^-} \\Rightarrow \\mathrm{SNR} = 77.4\\ (37.8\\ \\mathrm{dB})' }
      ],
      a: 'SNR 7.2 and 77.4. The light rose 100 times and the SNR only 10.7: in the second case the read noise is negligible and the SNR is just √6000 = 77.'
    },
    {
      title: 'Cooling a long exposure',
      q: 'A sensor has 5 e⁻/s of dark current at 25 °C, doubling every 7 K. An astronomer takes a 10 s exposure at 60 °C inside a hot dome, and another at −20 °C. How many dark electrons and how much dark noise in each?',
      steps: [
        { text: 'At 60 °C, 35 K warmer, the current is multiplied by $2^{35/7} = 32$:', tex: 'D = 5 \\times 32 \\times 10 = 1600\\ \\mathrm{e^-}, \\quad \\sqrt{1600} = 40\\ \\mathrm{e^-}' },
        { text: 'At −20 °C, 45 K colder, the factor is $2^{-45/7} = 0.0116$:', tex: 'D = 5 \\times 0.0116 \\times 10 = 0.58\\ \\mathrm{e^-}, \\quad \\sqrt{0.58} = 0.76\\ \\mathrm{e^-}' }
      ],
      a: '1600 e⁻ (40 e⁻ of noise) when hot, 0.58 e⁻ (0.76 e⁻ of noise) when cold: cooling turned a ruinous dark signal into less than the read noise.'
    }
  ],
  quiz: [
    { q: 'A pixel collects 10 000 electrons. What is the best signal-to-noise ratio it can have, limited by shot noise?', answer: 100, why: 'Shot noise is $\\sqrt{10\\,000} = 100$ electrons, so SNR = 10 000/100 = 100 (40 dB).' },
    { q: 'Which noise grows when the sensor gets warmer?', choices: ['Dark current and its shot noise', 'Photon shot noise from the scene', 'The quantization of the ADC', 'The PRNU'], a: 0, why: 'Dark current doubles every 6 to 8 °C. Photon shot noise depends only on the light; the ADC and the pixel gain differences are almost independent of temperature.' },
    { q: 'Averaging 100 frames of a static scene removes the fixed-pattern noise of the sensor.', a: false, why: 'Averaging reduces random (temporal) noise by √100 = 10. The fixed pattern is the same in every frame and survives; it needs a dark-frame and a flat-field correction.' },
    { q: 'A sensor has a PRNU of 0.5 %. What is the highest SNR of a single, uncorrected frame?', answer: 200, why: '$\\mathrm{SNR}_{\\max} = 1/0.005 = 200$ (46 dB), whatever the light.' },
    { q: 'A sensor has 4 e⁻ of read noise. Below what signal, in electrons, is it read-noise limited?', answer: 16, why: 'The read noise matches the shot noise at $S = r^2 = 16$ electrons; below that the read noise dominates.' }
  ],
  applications: [
    'Choosing a camera for low light: read noise and QE decide, and the absolute sensitivity threshold of EMVA 1288 gives them in one number.',
    'Astronomy and fluorescence microscopy cool the sensor to −20 to −100 °C so that long exposures are limited by the sky or the sample, not the dark current.',
    'Machine vision uses flat-field and dark-frame corrections to remove the fixed pattern that caps the SNR.',
    'Phone cameras average a burst of frames to beat the random noise of one small pixel.'
  ],
  history: 'The statistics of photon arrival were set by Poisson\'s distribution; shot noise as a physical effect was explained by Walter Schottky in 1918 for electrons in valves. The photon-transfer method for measuring sensor gain, from the variance against the mean, was developed for CCDs in the 1970s and 1980s and became the core of EMVA 1288.',
  sources: [
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — the measurement of every figure on this page.',
    'J. R. Janesick, *Photon Transfer: DN → λ* (SPIE Press, 2007).',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press), chapters on sensor noise.'
  ],
  sim: 'is-noise'
},

{
  id: 'dynamic-range-and-full-well', parent: 'image-sensors', title: 'Dynamic range and full-well capacity', level: 2,
  short: 'Dynamic range is the ratio of the most light a pixel can hold (its full well) to the least it can tell from noise (its read noise): 20 000 electrons over 2.5 electrons is 8000 to 1, 78 dB or 13 stops. Bit depth only names the number of levels; HDR modes stretch the range by combining exposures or gains.',
  keywords: ['dynamic range', 'full well', 'full-well capacity', 'saturation capacity', 'stops', 'dB', 'bit depth', 'ADC', 'HDR', 'high dynamic range', 'dual conversion gain', 'LOFIC', 'highlight', 'shadow', 'saturation', 'clipping', 'noise floor'],
  prereq: ['how-a-pixel-detects-light', 'sensor-noise'],
  related: ['sensor-formats-and-pixel-size', 'iso-and-gain', 'metering-and-exposure-value', 'cmos-sensors', 'the-light-budget', 'machine-vision-lighting'],
  body: `
A scene can be far brighter at one point than at another: a lamp beside a dark corner, a sunlit road and the shadow under a car. A sensor records brightness as a number of electrons between two limits. The most light it can hold is the **full-well capacity** $N_{\\mathrm{FW}}$; the least it can distinguish from its own noise is the **read noise** $r$. The ratio is the **dynamic range**:

$$\\mathrm{DR} = \\frac{N_{\\mathrm{FW}}}{r}$$

### Three ways to quote it
For $N_{\\mathrm{FW}} = 20\\,000$ electrons and $r = 2.5$ electrons, $\\mathrm{DR} = 8000$:
- as a ratio, **8000 : 1**;
- in decibels, $20\\log_{10}8000 = $ **78 dB**;
- in photographic **stops** (factors of two), $\\log_2 8000 = $ **13.0 stops**.

| Sensor | Dynamic range |
|---|---|
| Phone sensor, 1.0 to 1.4 µm pixels | 10 to 12 stops (60 to 72 dB) |
| Industrial camera, 3 to 5 µm | 9 to 12 stops (55 to 75 dB) |
| Camera sensor, APS-C and full frame | 12 to 15 stops (72 to 90 dB) |
| Scientific CMOS | about 15 stops (about 88 dB) |
| Automotive HDR sensor | 20 stops and more (120 dB and more) |

The brightest signal has a signal-to-noise ratio of $\\sqrt{N_{\\mathrm{FW}}}$: 141 for 20 000 electrons, the best one frame can do.

### Full well
A pixel's full well is roughly proportional to its area, about 1000 electrons per µm² in modern sensors. A big pixel therefore has both a deeper well and, because its read noise does not grow with area, a larger dynamic range. Cutting the pixel pitch from 5 µm to 2.5 µm loses a factor of four in well and two stops of range.

### Bits are not stops
The ADC turns the voltage into one of $2^b$ levels. A 12-bit ADC distinguishes 4096 levels; to record 13 stops linearly without the ADC being the limit, at least 13 bits are needed. But more bits cannot create dynamic range that the well and the noise do not have: a 16-bit ADC on a sensor with 10 stops of range still has 10 stops. The gain in electrons per level is $K = N_{\\mathrm{FW}}/2^b$, and a good design keeps $K$ at or below the read noise so that the ADC adds nothing.

### Highlights and shadows
Over-exposed pixels clip at the full well: all detail above it is lost for good. In the shadows the signal sinks into the read noise: detail below about one noise-electron cannot be recovered. A camera's **ISO** setting raises the analogue gain; once the well is no longer filled by the brightest part, the usable range falls by about a stop for each doubling of ISO.

### Stretching the range: HDR
- **Several exposures** (long and short, combined): top end up by the ratio of exposures; motion between them causes artefacts.
- **Dual conversion gain**: the sense-node capacitance is switched, high gain for the shadows (low noise) and low gain for the highlights (big capacity).
- **Split pixels** (one large and one small photodiode) and **overflow capacitors** (extra charge storage that takes what the well cannot) capture the highlights in the same exposure.
- **Logarithmic or time-to-saturation pixels**: compress the response or measure how long a pixel takes to fill.

> [!key] Dynamic range = full well ÷ read noise: 20 000 e⁻ over 2.5 e⁻ is 8000 : 1, 78 dB, 13 stops. Bit depth only needs to be big enough; HDR methods raise the top (more exposures, gains or storage).
`,
  ideas: [
    'Dynamic range is the full-well capacity divided by the read noise, quoted as a ratio, in decibels (20 log₁₀) or in stops (log₂).',
    'Full well grows with pixel area, so large pixels have more dynamic range and a higher best SNR (√N_FW).',
    'Bit depth names the number of levels; it can limit the range but never extends it.',
    'Highlights clip at the full well and shadows vanish into the read noise: both losses are permanent.',
    'HDR methods extend the top end with several exposures, dual gains, split pixels or overflow capacitors.'
  ],
  pitfalls: [
    'A 14-bit sensor has 14 stops — Bits only count the levels the ADC can distinguish. Dynamic range depends on the well and the noise; many 14-bit cameras have 11 to 13 stops.',
    'Raising ISO adds dynamic range — At a high ISO the well is no longer filled, so the usable range falls by about a stop per doubling.',
    'A higher dB number means a better picture in every way — dB is a ratio of two limits; it says nothing of colour, resolution or the SNR at mid-tones.',
    'Highlights can be recovered from a short exposure by raising them later — Clipped pixels hold no information; only a shorter exposure, or an HDR mode, keeps them.'
  ],
  terms: [
    { term: 'Dynamic range', also: ['DR', 'intra-scene dynamic range'], def: 'The ratio of the largest signal a sensor can record (the full-well capacity) to the smallest it can distinguish from noise (the read noise), given as a ratio, in dB or in stops.' },
    { term: 'Full-well capacity', also: ['saturation capacity', 'FWC'], def: 'The largest number of electrons a pixel can hold. It sets the brightest signal and, as √N, the best SNR.' },
    { term: 'Stop', also: ['EV', 'f-stop of range'], def: 'A factor of two in light or signal. A dynamic range of 8000 : 1 is 13 stops.' },
    { term: 'Decibel', also: ['dB'], def: 'Twenty times the base-10 logarithm of a signal ratio. 20 dB is a factor of 10, 6 dB a factor of 2.' },
    { term: 'Bit depth', also: ['ADC resolution'], def: 'The number of bits of the ADC: b bits distinguish 2^b levels. It limits the range recorded but does not set it.' },
    { term: 'HDR', also: ['high dynamic range', 'WDR (wide dynamic range)'], def: 'Any method that records a wider range of brightness than one exposure with one gain can: several exposures, dual conversion gain, split pixels, overflow capacitors.' },
    { term: 'Dual conversion gain', also: ['DCG'], def: 'A pixel whose sense-node capacitance can be switched: high conversion gain for low read noise in the shadows, low gain for a large capacity in the highlights.' }
  ],
  formulas: [
    {
      name: 'Dynamic range',
      expr: 'DR = FW/r', tex: '\\mathrm{DR} = \\frac{N_{\\mathrm{FW}}}{r}',
      vars: {
        DR: { name: 'dynamic range (ratio)', tex: '\\mathrm{DR}' },
        FW: { name: 'full-well capacity (electrons)', q: false, unit: 'e⁻', value: 20000, min: 100, tex: 'N_{\\mathrm{FW}}' },
        r: { name: 'read noise (electrons rms)', q: false, unit: 'e⁻', value: 2.5, min: 0.1, max: 1000 }
      },
      stories: { DR: 'A pixel holds {FW} before it saturates and has a read noise of {r}. What is its dynamic range as a ratio?', r: 'A sensor with a full well of {FW} must reach a dynamic range of {DR}. What read noise is allowed?' }
    },
    {
      name: 'Dynamic range in decibels',
      expr: 'DB = 20*log(FW/r)', tex: '\\mathrm{DR}_{\\mathrm{dB}} = 20\\log_{10}\\frac{N_{\\mathrm{FW}}}{r}',
      vars: {
        DB: { name: 'dynamic range in decibels', q: 'gain', unit: 'dB', tex: '\\mathrm{DR}_{\\mathrm{dB}}' },
        FW: { name: 'full-well capacity (electrons)', q: false, unit: 'e⁻', value: 20000, min: 100, tex: 'N_{\\mathrm{FW}}' },
        r: { name: 'read noise (electrons rms)', q: false, unit: 'e⁻', value: 2.5, min: 0.1, max: 1000 }
      },
      note: 'For a pure ratio of amplitudes, as the EMVA standard does: 78 dB for 8000 : 1.',
      stories: { DB: 'A sensor has a full well of {FW} and a read noise of {r}. What is its dynamic range in decibels?' }
    },
    {
      name: 'Dynamic range in stops',
      expr: 'st = log2(FW/r)', tex: 'n_{\\mathrm{stops}} = \\log_2\\frac{N_{\\mathrm{FW}}}{r}',
      vars: {
        st: { name: 'dynamic range in stops', tex: 'n_{\\mathrm{stops}}' },
        FW: { name: 'full-well capacity (electrons)', q: false, unit: 'e⁻', value: 20000, min: 100, tex: 'N_{\\mathrm{FW}}' },
        r: { name: 'read noise (electrons rms)', q: false, unit: 'e⁻', value: 2.5, min: 0.1, max: 1000 }
      },
      stories: { st: 'A sensor has a full well of {FW} and a read noise of {r}. How many stops of dynamic range does it have?' }
    },
    {
      name: 'Electrons per digital number',
      expr: 'K = FW/2^b', tex: 'K = \\frac{N_{\\mathrm{FW}}}{2^{b}}',
      vars: {
        K: { name: 'system gain (electrons per DN)', q: false, unit: 'e⁻/DN' },
        FW: { name: 'full-well capacity (electrons)', q: false, unit: 'e⁻', value: 20000, min: 100, tex: 'N_{\\mathrm{FW}}' },
        b: { name: 'bits of the ADC', value: 12, int: true, min: 4, max: 20 }
      },
      note: 'When the ADC range is matched to the well. Keep K at or below the read noise so the ADC does not add noise.',
      stories: { K: 'A pixel with a full well of {FW} is read by a {b}-bit ADC matched to it. How many electrons does one digital number stand for?' }
    }
  ],
  examples: [
    {
      title: 'A phone and a full-frame sensor',
      q: 'A phone pixel holds 6000 e⁻ and has a read noise of 1.5 e⁻. A full-frame pixel holds 60 000 e⁻ with 3 e⁻. Compare the dynamic range and the best SNR.',
      steps: [
        { text: 'Phone:', tex: '\\mathrm{DR} = \\frac{6000}{1.5} = 4000 = 72\\ \\mathrm{dB} = 12.0\\ \\mathrm{stops}, \\qquad \\mathrm{SNR}_{\\max} = \\sqrt{6000} = 77' },
        { text: 'Full frame:', tex: '\\mathrm{DR} = \\frac{60\\,000}{3} = 20\\,000 = 86\\ \\mathrm{dB} = 14.3\\ \\mathrm{stops}, \\qquad \\mathrm{SNR}_{\\max} = \\sqrt{60\\,000} = 245' }
      ],
      a: 'The full-frame pixel has 2.3 stops more range and a best SNR 3.2 times higher: ten times the well but twice the read noise.'
    },
    {
      title: 'How many bits are enough?',
      q: 'A sensor has 14.3 stops of dynamic range. Is a 12-bit ADC enough to record it linearly?',
      steps: [
        'A linear 12-bit ADC distinguishes 4096 levels, which is $\\log_2 4096 = 12$ stops from the smallest to the largest level.',
        'The sensor has 14.3 stops, so 2.3 stops of it would be squeezed into the lowest levels or lost. A 15-bit ADC (or 14 bits with a nonlinear, companded scale) is needed.'
      ],
      a: 'No: 12 bits record 12 stops. At least 15 bits, or a companded 12-bit scale, are needed for 14.3 stops.'
    }
  ],
  quiz: [
    { q: 'A pixel has a full well of 16 000 electrons and 4 electrons of read noise. What is its dynamic range in stops?', answer: 12, why: '$16\\,000/4 = 4000$, and $\\log_2 4000 = 11.97$, about 12 stops.' },
    { q: 'What is 8000 : 1 in decibels (as an amplitude ratio)?', answer: 78.06, unit: 'dB', why: '$20\\log_{10}8000 = 20 \\times 3.903 = 78.06$ dB.' },
    { q: 'Changing from a 12-bit to a 16-bit ADC on the same sensor raises its dynamic range by four stops.', a: false, why: 'The range is set by the full well and the read noise. A finer ADC removes quantization error but cannot see below the noise or above the well.' },
    { q: 'Which pair of changes raises the dynamic range?', choices: ['A larger full well and a lower read noise', 'A smaller pixel and a higher ISO', 'A longer exposure and a larger aperture', 'More bits and a brighter lamp'], a: 0, why: 'DR is full well over read noise. Smaller pixels and higher ISO lower it; exposure and aperture move the scene within the range but do not change it.' },
    { q: 'A sensor adds a dual-gain mode with a low-gain capacity eight times larger and the same read noise in high gain. By how many stops is the top of the range extended?', answer: 3, why: 'The top is raised by a factor of 8, which is $\\log_2 8 = 3$ stops, while the shadows keep the low noise of the high-gain mode.' }
  ],
  applications: [
    'Automotive cameras must see a headlamp and a dark pedestrian at once: HDR sensors of 120 dB and more.',
    'Machine vision of welding, shiny parts and steel needs high-dynamic-range sensors or several exposures merged.',
    'Photographers read the dynamic range of a camera to know how much shadow and highlight one exposure can hold.',
    'Scientific cameras are specified by full well and read noise to choose between speed, sensitivity and range.'
  ],
  history: 'The decibel notation was borrowed from telephony; the "stop" of range comes from photography, where a stop is a factor of two of exposure. High-dynamic-range sensors with dual-gain or overflow pixels became common in phones and cars in the 2010s.',
  sources: [
    'EMVA Standard 1288 — saturation capacity, temporal dark noise and dynamic range as defined and measured for cameras.',
    'J. R. Janesick, *Photon Transfer: DN → λ* (SPIE Press, 2007).',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — dynamic range and HDR pixels.'
  ],
  sim: 'is-dynamic-range'
},

{
  id: 'sensor-formats-and-pixel-size', parent: 'image-sensors', title: 'Sensor formats and pixel size', level: 1,
  short: 'A sensor\'s "inch" name is a relic of television camera tubes: a 1" sensor has a diagonal of 16 mm and a 2/3" sensor 11 mm. Size sets how much light the sensor gathers, and the pixel pitch, the sensor area divided by the pixel count, sets the light per pixel and the finest detail it can sample.',
  keywords: ['sensor format', 'sensor size', 'inch sensor', '1 inch', '2/3 inch', '1/2.3', 'APS-C', 'full frame', 'medium format', 'four thirds', 'pixel pitch', 'pixel size', 'megapixels', 'optical format', 'crop factor', 'image circle', 'diagonal', 'vidicon'],
  prereq: ['how-a-pixel-detects-light', 'field-of-view-and-focal-length'],
  related: ['crop-factor-and-equivalent-focal-length', 'image-circle-and-sensor-coverage', 'c-mount', 'dynamic-range-and-full-well', 'the-airy-disk', 'nyquist-sampling-and-aliasing', 'reading-a-lens-datasheet', 'choosing-a-machine-vision-lens'],
  body: `
A sensor datasheet gives a size like "1/1.8 inch" and a pixel count. Neither says what it seems to say.

### Why the "inch" names are not inches
Before solid-state sensors, television cameras used vidicon tubes. A "1 inch" tube had a glass envelope 1 inch (25.4 mm) across, but its picture area was a rectangle of about 12.8 × 9.6 mm: a diagonal of 16 mm. When sensors replaced tubes, they kept the names. The rule of thumb: **the diagonal is about two thirds of the inch name**, in millimetres 16 for 1", 11 for 2/3", 8 for 1/2", 6 for 1/3". The fractions and the "1/2.3" sort of names are just labels; look up the width and height.

| Format | Width × height (mm) | Diagonal (mm) | Crop factor | Typical use |
|---|---|---|---|---|
| 1/3" | 4.8 × 3.6 | 6.0 | 7.2 | webcams, small industrial cameras |
| 1/2.3" | 6.17 × 4.55 | 7.7 | 5.6 | compact cameras, action cameras, phones |
| 1/2" | 6.4 × 4.8 | 8.0 | 5.4 | machine vision, security |
| 2/3" | 8.8 × 6.6 | 11.0 | 3.9 | machine vision, broadcast |
| 1" | 12.8 × 9.6 | 16.0 | 2.7 | machine vision, premium compacts, phones |
| 4/3" | 17.3 × 13.0 | 21.6 | 2.0 | Four Thirds, Micro Four Thirds |
| APS-C | 23.6 × 15.7 | 28.4 | 1.53 | interchangeable-lens cameras |
| Full frame | 36 × 24 | 43.3 | 1.00 | professional cameras, large machine-vision sensors |
| Medium format | 44 × 33 to 54 × 40 | 55 to 67 | 0.8 to 0.65 | medium-format cameras |

(Some makers' sensors differ by a millimetre or so: APS-C sensors range from 22.2 to 23.6 mm wide.) The **crop factor** is 43.27 mm divided by the diagonal ([[crop-factor-and-equivalent-focal-length]]), and the lens's image circle must cover the diagonal ([[image-circle-and-sensor-coverage]]).

### Pixel pitch
The pixel pitch follows from the area and the pixel count $N$ (assuming square pixels with no gaps):

$$p = \\sqrt{\\frac{w\\,h}{N}}$$

A 12-megapixel 1/2.3" sensor has $p = \\sqrt{6.17\\times4.55/12\\times10^6}$ mm = 1.53 µm; a 24-megapixel full-frame sensor has 6.0 µm; a 20-megapixel 1" sensor 2.4 µm.

### Big pixels, small pixels
At the same f-number and exposure, the illuminance on the sensor is the same, so the light a pixel collects is proportional to its **area**, $p^2$. The shot-noise-limited SNR rises with $p$ (a 5 µm pixel has 3.6 times the SNR of a 1.4 µm one) and the full well and dynamic range rise with $p^2$ ([[dynamic-range-and-full-well]]). A larger sensor at the same f-number and field of view also collects light in proportion to its area, which is why a larger sensor gives cleaner pictures.

What small pixels give is sampling: at 0.7 µm pitch the sensor records detail that a larger pixel would miss, but the lens must supply it. The diffraction cut-off of a lens is $1/(\\lambda N)$ ([[diffraction-limited-mtf]]) and the sensor's Nyquist limit is $1/(2p)$; pixels finer than $\\lambda N/2$ add nothing but noise. At f/2.8 in green light that is 0.77 µm; at f/8 it is 2.2 µm.

| Sensor | Typical pixel pitch |
|---|---|
| Phone | 0.6 to 1.4 µm |
| Compact camera | 1.1 to 2 µm |
| 1" and 4/3" | 2.4 to 3.8 µm |
| APS-C, full frame | 3.8 to 8.5 µm |
| Machine vision, area scan | 2.2 to 5.5 µm |
| Line scan | 3.5 to 14 µm |
| Scientific CMOS | 6.5 µm |
| Scientific CCD | 13 to 24 µm |

> [!key] "1 inch" means a 16 mm diagonal: the diagonal is about two thirds of the name. Pixel pitch is √(area ÷ pixels); the light a pixel collects goes as its pitch squared, the SNR as the pitch.
`,
  ideas: [
    'The inch names come from television tubes: a 1" sensor has a 16 mm diagonal, about two thirds of 25.4 mm.',
    'Look up the width and height; the name does not give them.',
    'Pixel pitch p = √(sensor area ÷ number of pixels).',
    'At equal exposure a pixel collects light in proportion to its area; the shot-noise SNR grows with its pitch.',
    'Pixels finer than λN/2 oversample the lens: more data, no more detail.'
  ],
  pitfalls: [
    'A 1-inch sensor is 25.4 mm across — Its diagonal is 16 mm (12.8 × 9.6 mm). The name comes from the outer diameter of vidicon tubes.',
    'More megapixels mean a better picture — On the same sensor, more pixels are smaller pixels: less light and less well each. They help only if the lens can supply the detail.',
    'A bigger sensor needs a longer exposure — At the same f-number and the same field of view, the exposure is the same; the bigger sensor simply collects more light in total.',
    'All 1/2.3-inch sensors have the same size — The names are labels; real sensors of one name differ in width and height by a few per cent.'
  ],
  terms: [
    { term: 'Optical format', also: ['sensor format', 'optical size'], def: 'The size class of a sensor, written as an inch fraction (1/2.3", 1") or a name (APS-C, full frame). The diagonal is about two thirds of the inch name.' },
    { term: 'Pixel pitch', also: ['pixel size', 'pixel spacing'], def: 'The centre-to-centre distance of neighbouring pixels, in micrometres. For square pixels it is √(area ÷ pixel count).' },
    { term: 'Sensor diagonal', def: 'The length of the diagonal of the light-sensitive area, which the lens\'s image circle must cover and which defines the crop factor.' },
    { term: 'APS-C', def: 'A sensor format about 23.6 × 15.7 mm (22 to 24 mm wide in practice), with a crop factor of 1.5 to 1.6, named after a film format.' },
    { term: 'Full frame', also: ['35 mm format'], def: 'A sensor of 36 × 24 mm, the size of a frame of 35 mm film. Its diagonal of 43.3 mm is the reference of the crop factor.' },
    { term: 'Megapixel', also: ['MP'], def: 'A million pixels. The number of pixels is the sensor\'s width and height in pixels multiplied together.' }
  ],
  formulas: [
    {
      name: 'Pixel pitch from the sensor size and the pixel count',
      expr: 'p = sqrt(w*h/(Nm*1e6))', tex: 'p = \\sqrt{\\frac{w\\,h}{N}}',
      vars: {
        p: { name: 'pixel pitch', q: 'length', unit: 'µm' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 36 },
        h: { name: 'sensor height', q: 'length', unit: 'mm', value: 24 },
        Nm: { name: 'number of pixels, in millions', value: 24, min: 0.1, max: 500, tex: 'N' }
      },
      note: 'For square pixels with no gaps; N is entered in megapixels. Full frame at 24 MP: 6.0 µm.',
      stories: { p: 'A sensor of {w} × {h} has {Nm} million pixels. What is the pixel pitch?', Nm: 'A sensor of {w} × {h} has pixels {p} wide. How many megapixels does it have?' }
    },
    {
      name: 'Diagonal of the sensor',
      expr: 'd = sqrt(w^2 + h^2)', tex: 'd = \\sqrt{w^2 + h^2}',
      vars: {
        d: { name: 'diagonal', q: 'length', unit: 'mm' },
        w: { name: 'sensor width', q: 'length', unit: 'mm', value: 12.8 },
        h: { name: 'sensor height', q: 'length', unit: 'mm', value: 9.6 }
      },
      note: '12.8 × 9.6 mm, the "1 inch" format, has a diagonal of exactly 16 mm.'
    },
    {
      name: 'Light collected relative to a small pixel',
      expr: 'g = (p2/p1)^2', tex: 'g = \\left(\\frac{p_2}{p_1}\\right)^{2}',
      vars: {
        g: { name: 'ratio of the light collected per pixel' },
        p2: { name: 'pitch of the larger pixel', q: 'length', unit: 'µm', value: 5.5, tex: 'p_2' },
        p1: { name: 'pitch of the smaller pixel', q: 'length', unit: 'µm', value: 1.4, tex: 'p_1' }
      },
      note: 'At equal illuminance and exposure. The shot-noise-limited SNR improves as the square root of this: the pitch ratio.',
      stories: { g: 'A pixel {p2} wide and one {p1} wide are exposed to the same illuminance for the same time. How many times more light does the larger collect?' }
    },
    {
      name: 'Sampling limit of the sensor',
      expr: 'fN = 1/(2*p)', tex: 'f_N = \\frac{1}{2p}',
      vars: {
        fN: { name: 'Nyquist frequency', q: 'spatialfreq', unit: 'lp/mm', tex: 'f_N' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 }
      },
      note: 'The finest pattern the pixel grid can record without aliasing: one line pair per two pixels.',
      stories: { fN: 'A sensor has pixels {p} wide. What is its Nyquist frequency?' }
    }
  ],
  examples: [
    {
      title: 'From the name to the pitch',
      q: 'A camera has a 1/2.3" sensor of 6.17 × 4.55 mm with 16 million pixels. What is the pixel pitch, and what is its Nyquist frequency?',
      steps: [
        { text: 'The area is 28.07 mm²:', tex: 'p = \\sqrt{\\frac{28.07\\ \\mathrm{mm^2}}{16\\times10^{6}}} = 1.32\\ \\mu\\mathrm{m}' },
        { text: 'The Nyquist frequency is', tex: 'f_N = \\frac{1}{2 \\times 1.32\\ \\mu\\mathrm{m}} = 379\\ \\mathrm{lp/mm}' }
      ],
      a: '1.32 µm pitch and 379 lp/mm. A lens at f/2.8 cuts off at 649 lp/mm, so the diffraction limit is above the sampling limit and the pixel grid is the limit in good light.'
    },
    {
      title: 'Big pixel against small pixel',
      q: 'The same scene is lit at the same illuminance and exposed for the same time on a 5.5 µm pixel and a 1.4 µm pixel. Compare the light and the best SNR.',
      steps: [
        { text: 'The light ratio is the area ratio:', tex: 'g = \\left(\\frac{5.5}{1.4}\\right)^2 = 15.4' },
        'Shot noise grows as the square root, so the SNR is $\\sqrt{15.4} = 3.9$ times higher on the large pixel (when shot noise dominates).'
      ],
      a: '15.4 times the light and 3.9 times the SNR: why a machine-vision or scientific camera with large pixels outperforms a phone sensor in dim light, pixel for pixel.'
    }
  ],
  quiz: [
    { q: 'What is the diagonal of a "1 inch" sensor?', choices: ['16 mm', '25.4 mm', '12.8 mm', '43.3 mm'], a: 0, why: 'A "1 inch" sensor is 12.8 × 9.6 mm, with a diagonal of 16 mm. 25.4 mm is the vidicon tube it was named after; 43.3 mm is full frame.' },
    { q: 'What is the pixel pitch, in micrometres, of a 24-megapixel full-frame sensor (36 × 24 mm)?', answer: 6, unit: 'µm', why: '$\\sqrt{864\\ \\mathrm{mm^2}/24\\times10^6} = \\sqrt{3.6\\times10^{-5}\\ \\mathrm{mm^2}} = 6.0\\ \\mu$m.' },
    { q: 'On the same sensor, a higher pixel count means each pixel collects less light at the same exposure.', a: true, why: 'The sensor area is fixed, so more pixels are smaller pixels and the light per pixel falls with its area.' },
    { q: 'A 3.45 µm pixel has a Nyquist frequency of about…', choices: ['145 lp/mm', '290 lp/mm', '72 lp/mm', '3.45 lp/mm'], a: 0, why: '$1/(2 \\times 0.00345\\ \\mathrm{mm}) = 145$ lp/mm.' },
    { q: 'A pixel of 2.8 µm is replaced by one of 1.4 µm on a sensor of the same size. How much less light does a pixel collect at the same exposure?', answer: 4, why: 'The area falls by $(2.8/1.4)^2 = 4$; each pixel gets a quarter of the light.' }
  ],
  applications: [
    'Choosing a machine-vision camera: the format must fit the lens\'s image circle, and the pixel pitch sets the sensitivity and the resolution the lens must deliver.',
    'Comparing phones and cameras: a 1/2.3" sensor is 28 mm² against 864 mm² for full frame, a factor of 31 in light.',
    'Reading a lens datasheet: its "format" (2/3", 1.1") says the largest sensor its image circle covers.',
    'Microscopy and astronomy choose pixel pitch to match the optical resolution of the telescope or objective.'
  ],
  history: 'The vidicon camera tube, developed at RCA in the early 1950s, came in outer diameters of 1 inch, 2/3 inch and 1/2 inch. The solid-state sensors that replaced them in the 1980s inherited the names, and so the "1/2.3-inch" of today\'s compact cameras has nothing to do with 2.3 inches.',
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras and Displays* (SPIE Press) — sensor formats and pixel sizes.',
    'EMVA Standard 1288, *Standard for Characterization of Image Sensors and Cameras* — definitions of the pixel size and of the image area.',
    'Japan Industrial Imaging Association, lens-mount and sensor-format conventions for machine-vision cameras.'
  ],
  sim: 'is-formats'
},

{
  id: 'colour-filter-arrays-and-demosaicing', parent: 'image-sensors', title: 'Colour filter arrays and demosaicing', level: 2,
  short: 'Almost every colour camera puts a tiny red, green or blue filter over each pixel, in the Bayer pattern of two greens to one red and one blue, and then reconstructs the two missing colours at every pixel. That reconstruction, demosaicing, can leave false colours at fine detail, which a slight blur (the optical low-pass filter) is there to prevent.',
  keywords: ['colour filter array', 'CFA', 'Bayer', 'Bayer filter', 'demosaicing', 'debayering', 'false colour', 'colour moire', 'zipper', 'optical low-pass filter', 'OLPF', 'anti-aliasing filter', 'three-chip', 'prism camera', 'quad Bayer', 'RGBW', 'mosaic', 'raw'],
  prereq: ['how-a-pixel-detects-light', 'quantum-efficiency-and-spectral-response', 'trichromatic-colour-vision'],
  related: ['nyquist-sampling-and-aliasing', 'moire-patterns', 'colour-and-multispectral-imaging', 'white-balance-and-chromatic-adaptation', 'binning-roi-and-area-of-interest', 'microlenses-bsi-and-stacked-sensors', 'birefringence', 'electronics:sampling-nyquist'],
  body: `
A pixel only counts photons, so it cannot know colour. A colour camera therefore puts a tiny filter over each pixel (a **colour filter array**, CFA), so that each pixel records only red, green or blue, and computes the missing two colours of every pixel from its neighbours.

### The Bayer mosaic
In 1975 Bryce Bayer of Kodak proposed the layout that nearly every camera still uses: a repeating block of 2 × 2 pixels with **two green**, one red and one blue:

| | | | |
|---|---|---|---|
| R | G | R | G |
| G | B | G | B |
| R | G | R | G |
| G | B | G | B |

Half the pixels are green, a quarter red and a quarter blue. The reason is the eye: its luminance response peaks in the green near 555 nm ([[the-luminosity-function]]), so the green samples carry the sharpness and the red and blue the colour. The raw file of a camera holds exactly this mosaic, one number per pixel.

The filters are dyes or pigments, each passing a band 80 to 120 nm wide, and each throws away about two thirds of the white light: a colour sensor collects roughly a third to a half of the light of a monochrome one ([[quantum-efficiency-and-spectral-response]]).

### Demosaicing
Each red pixel has no green or blue value; they are **interpolated** from neighbours of that colour. The simplest method, bilinear interpolation, averages the four neighbours. Better ones follow the edges (they interpolate along an edge, not across it) and use the green channel's detail to place the red and blue. The result looks like a full-colour picture, but it holds only a third of the numbers it appears to: the other two thirds are guesses.

### Artefacts
- **False colour and colour moiré.** The red and blue samples lie 2 pixels apart, so their Nyquist limit is half the sensor's: $1/(4p)$ against $1/(2p)$. A fine neutral pattern near the limit is sampled differently by the red, green and blue pixels, and comes back as rainbow bands.
- **Zipper and maze patterns** along sharp coloured edges, where the interpolation guesses wrongly.
- **Loss of resolution:** luminance detail is resolved at about 70 to 80 % of the pixel grid and colour detail at about half.

### The optical low-pass filter
A remedy is to blur the image by about one pixel *before* it reaches the sensor. The **optical low-pass filter** (OLPF, or anti-aliasing filter) is a pair of thin birefringent plates (quartz or lithium niobate, see [[birefringence]]) that split every point into two or four points one pixel apart. A quartz plate cut at 45° walks the extraordinary ray off by an angle of about 0.34°, so a thickness of 0.7 mm shifts it by about 4 µm. The price is a little less sharpness; many high-resolution cameras and lenses omit it and rely on the lens's own blur.

### Other ways to see colour
| Method | How | Trade-off |
|---|---|---|
| **Three-chip camera** | a dichroic prism splits the light into red, green and blue and three sensors record them | full resolution in every colour, little light lost; needs a long back focus, three sensors and alignment |
| **Quad-Bayer** | blocks of 2 × 2 same-coloured pixels | bin the four in low light, interpolate in good light |
| **RGBW, RGB-IR** | clear or infrared pixels beside the colours | more sensitivity, or an infrared channel for night and depth |
| **Stacked photodiodes** | three layers in the silicon absorb blue, green and red at different depths | a full set of colours at each position, with colour-mixing overlap |
| **Monochrome sensor, coloured light** | one frame per colour of illumination | full resolution, slower, common in inspection |

> [!key] A colour sensor records one colour per pixel, mostly green, and demosaicing invents the rest. The reconstruction fails near the sampling limit as false colour; the optical low-pass filter blurs by a pixel to prevent it.
`,
  ideas: [
    'Each pixel of a colour sensor sits under a red, green or blue filter and records one number.',
    'The Bayer pattern has two greens to one red and one blue because the eye\'s sharpness comes from green.',
    'Demosaicing interpolates the two missing colours at every pixel; two thirds of the values are estimated.',
    'Red and blue are sampled at half the density of the pixel grid, so fine detail comes back as false colour or colour moiré.',
    'The optical low-pass filter blurs the image by about a pixel to prevent aliasing, at a small cost in sharpness.'
  ],
  pitfalls: [
    'A 24-megapixel colour sensor has 24 million red, green and blue values — It has 24 million single-colour samples: 12 million green, 6 million red, 6 million blue. The rest are interpolated.',
    'False colours are a fault of the lens — They come from sampling a fine pattern with a coarse colour mosaic (aliasing); a sharper lens makes them worse, a low-pass filter cures them.',
    'The Bayer filter takes the colours of the scene directly — It records three broad, overlapping bands, and the camera converts them to colour with a matrix; two spectra can give the same recording (metamerism).',
    'A sensor without a low-pass filter is simply sharper — It is sharper at low contrast and more prone to moiré and false colour on fine textiles, screens and hair.'
  ],
  terms: [
    { term: 'Colour filter array', also: ['CFA', 'colour mosaic'], def: 'A pattern of red, green and blue filters placed over the pixels of an image sensor so that each pixel records one colour.' },
    { term: 'Bayer pattern', also: ['Bayer filter', 'Bayer mosaic', 'RGGB'], def: 'The colour filter array in which every 2 × 2 block has two green pixels, one red and one blue. Proposed by Bryce Bayer at Kodak in 1975.' },
    { term: 'Demosaicing', also: ['debayering', 'colour interpolation'], def: 'The computation of the two missing colour values at each pixel of a mosaic sensor from the values of its neighbours.' },
    { term: 'False colour', also: ['colour moiré', 'chroma aliasing'], def: 'Coloured bands or fringes that appear on fine, neutral detail because the colour channels are sampled at different, coarse positions.' },
    { term: 'Optical low-pass filter', also: ['OLPF', 'anti-aliasing filter', 'AA filter'], def: 'A thin birefringent plate or pair of plates in front of the sensor that splits each ray into two or four displaced by about one pixel, blurring the image slightly to prevent aliasing.' },
    { term: 'Three-chip camera', also: ['3CCD', '3-sensor camera', 'prism camera'], def: 'A camera in which a dichroic prism block splits the light into red, green and blue and three monochrome sensors record them, so every pixel position has all three colours.' }
  ],
  formulas: [
    {
      name: 'Nyquist frequency of a sampling grid',
      expr: 'fN = 1/(2*k*p)', tex: 'f_N = \\frac{1}{2\\,k\\,p}',
      vars: {
        fN: { name: 'Nyquist frequency', q: 'spatialfreq', unit: 'lp/mm', tex: 'f_N' },
        k: { name: 'spacing of the samples, in pixels', value: 2, min: 1, max: 8 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 }
      },
      note: 'k = 1 for the pixel grid (luminance); k = 2 for the red or the blue samples of a Bayer mosaic.',
      stories: { fN: 'A sensor with {p} pixels has red samples every {k} pixels. What is the Nyquist frequency of the red channel?' }
    },
    {
      name: 'Thickness of a low-pass plate',
      expr: 't = s/tan(rho)', tex: 't = \\frac{s}{\\tan\\rho}',
      vars: {
        t: { name: 'plate thickness', q: 'length', unit: 'mm' },
        s: { name: 'split between the two images', q: 'length', unit: 'µm', value: 4 },
        rho: { name: 'walk-off angle of the extraordinary ray', q: 'angle', unit: '°', value: 0.34, min: 0.05, max: 10, tex: '\\rho' }
      },
      note: 'Quartz cut at 45° to its axis has a walk-off of 0.34°; the split is made about equal to the pixel pitch.',
      stories: { t: 'A quartz plate with a walk-off of {rho} must split the image by {s}. How thick must it be?' }
    },
    {
      name: 'Samples per colour in a Bayer sensor',
      expr: 'Ng = N*fg', tex: 'N_c = N\\,f_c',
      vars: {
        Ng: { name: 'samples of that colour', tex: 'N_c' },
        N: { name: 'pixels of the sensor', value: 24000000, min: 1000 },
        fg: { name: 'fraction of the pixels of that colour (green 1/2, red 1/4, blue 1/4)', value: 0.5, min: 0, max: 1, tex: 'f_c' }
      },
      note: 'The rest of the values of the picture are interpolated.',
      stories: { Ng: 'A Bayer sensor has {N} pixels, and a fraction {fg} of them carry the colour in question. How many samples of that colour does it hold?' }
    }
  ],
  examples: [
    {
      title: 'Why a fine grey pattern turns coloured',
      q: 'A sensor has 3.45 µm pixels. A fine black-and-white stripe pattern at 100 lp/mm falls on it. Is it aliased in luminance, and in the red and blue channels?',
      steps: [
        { text: 'The pixel grid samples at one per 3.45 µm, so its Nyquist frequency is', tex: 'f_N = \\frac{1}{2 \\times 0.00345\\ \\mathrm{mm}} = 145\\ \\mathrm{lp/mm}' },
        { text: 'The red and blue pixels are 2 pixels apart, so their limit is', tex: 'f_N = \\frac{1}{2 \\times 2 \\times 0.00345\\ \\mathrm{mm}} = 72\\ \\mathrm{lp/mm}' }
      ],
      a: '100 lp/mm is below the luminance limit (145) but above the red and blue limit (72). The red and blue channels alias to a coarse pattern while green does not: coloured bands appear on a grey target.'
    },
    {
      title: 'A low-pass plate for 4 µm pixels',
      q: 'A quartz plate with a walk-off angle of 0.34° is to split the image by one pixel of 4 µm. How thick is it?',
      steps: [
        { text: 'The split is the thickness times the tangent of the walk-off angle:', tex: 't = \\frac{s}{\\tan\\rho} = \\frac{4\\ \\mu\\mathrm{m}}{\\tan 0.34°} = \\frac{4\\ \\mu\\mathrm{m}}{0.00593} = 0.67\\ \\mathrm{mm}' }
      ],
      a: 'About 0.67 mm. Two such plates, turned 90° to each other, give the four-spot pattern used for the OLPF.'
    }
  ],
  quiz: [
    { q: 'In a 2 × 2 Bayer block, how many pixels carry green?', choices: ['2', '1', '3', '4'], a: 0, why: 'The Bayer block is RGGB: two green, one red, one blue.' },
    { q: 'A Bayer sensor has 20 million pixels. How many red samples does it have?', answer: 5000000, why: 'A quarter of the pixels are red: 20 million ÷ 4 = 5 million.' },
    { q: 'Demosaicing interpolates the two missing colours at each pixel from its neighbours.', a: true, why: 'Each pixel has only one measured colour; the other two are estimated from nearby pixels of those colours.' },
    { q: 'What does the optical low-pass filter do?', choices: ['Blurs the image slightly to prevent false colour and moiré', 'Blocks the infrared', 'Sharpens fine detail', 'Splits light into three colours'], a: 0, why: 'It spreads each point over about a pixel, removing detail above the sampling limit before it can alias. The infrared-cut filter is a separate element.' },
    { q: 'Why does a three-chip camera avoid false colour?', choices: ['Each colour is sampled at every pixel position', 'It uses a better lens', 'It uses larger pixels', 'It blurs the picture'], a: 0, why: 'With a separate sensor for red, green and blue, each colour has full-resolution samples, so no colour needs interpolation.' }
  ],
  applications: [
    'Every phone, camera and webcam uses a Bayer mosaic and demosaics in the image processor (or later, from a raw file).',
    'Photographers shooting raw choose the demosaicing algorithm in their software; some cameras omit the low-pass filter for sharpness.',
    'Broadcast cameras and high-end colour inspection cameras use three sensors behind a prism for full-resolution colour.',
    'Machine vision often uses a monochrome sensor with coloured lights, to keep full resolution and avoid the filter losses.'
  ],
  history: 'Bryce E. Bayer at Eastman Kodak proposed his colour array in a patent filed in 1975 and granted in 1976. Before sensors, colour photographic film used three layers; the first single-chip colour cameras of the 1980s used stripe filters, and the Bayer pattern became universal with digital still cameras in the 1990s.',
  sources: [
    'B. E. Bayer, "Color imaging array", US patent 3,971,065 (1976).',
    'R. Lukac (ed.), *Single-Sensor Imaging: Methods and Applications for Digital Cameras* (CRC Press, 2008).',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — colour filter arrays and aliasing.'
  ],
  sim: 'is-bayer'
}

);

/* ================================================================ microlenses, binning, infrared */
Hyper.add(
{
  id: 'microlenses-bsi-and-stacked-sensors', parent: 'image-sensors', title: 'Microlenses, back illumination and stacked sensors', level: 3,
  short: 'Only part of a pixel is photodiode: wiring and transistors take the rest. A microlens over every pixel focuses the light onto the photodiode; back illumination moves the wiring behind the silicon so that the light meets the diode first; stacking puts the logic on a second wafer underneath. Together they let pixels shrink to a micrometre and still collect most of the light.',
  keywords: ['microlens', 'on-chip lens', 'fill factor', 'back-side illumination', 'BSI', 'front-side illumination', 'FSI', 'stacked sensor', 'chief ray angle', 'CRA', 'deep trench isolation', 'DTI', 'crosstalk', 'light pipe', 'hybrid bonding', 'angular response', 'shading'],
  prereq: ['how-a-pixel-detects-light', 'quantum-efficiency-and-spectral-response', 'cmos-sensors'],
  related: ['ccd-architectures', 'sensor-formats-and-pixel-size', 'colour-filter-arrays-and-demosaicing', 'telecentricity', 'relative-illumination-and-shading', 'reading-a-lens-datasheet', 'the-phone-camera'],
  body: `
Look at a pixel from the side. At the bottom is the photodiode. Around and above it are transistors, metal wiring in several layers, an insulating stack, a colour filter, and the air. Most of the area seen from above is not photodiode. How much of the light reaches the diode at all is a question of geometry.

### Fill factor and the microlens
The **fill factor** is the fraction of the pixel's area that is photodiode. In an interline CCD it is 20 to 50 %; in a small front-illuminated CMOS pixel 30 to 60 %. Without help, half the light would land on metal and transistors.

A **microlens** is a tiny polymer lens, 1 to 10 µm across, moulded on top of each pixel, one per pixel with no gaps. It gathers all the light that falls on the pixel and focuses it onto the diode below. A single refracting surface of radius $R$ on material of index $n$ focuses at a distance $f = nR/(n-1)$ in that material, so for $n = 1.6$ and $R = 1.2$ µm the focus is 3.2 µm below the lens: about the depth of the stack of a small pixel. With a fill factor of 50 % an ideal microlens doubles the collected light; in practice 1.5 to 3 times.

### The chief ray angle
The light from the exit pupil of the lens reaches the corners of the sensor at an angle, the **chief ray angle** (CRA): $\\tan(\\mathrm{CRA}) = h/L$ for image height $h$ and exit-pupil distance $L$. It is near 0° at the centre and grows to 25 to 35° at the corners of a phone lens (a short, wide lens close to the sensor), a few degrees for a telecentric industrial lens. A tilted bundle lands off-centre, and in a deep pixel a fraction is blocked by the walls of the wiring stack or falls on a neighbour (crosstalk). Designers **shift the microlenses** progressively towards the centre of the sensor so that each pixel's lens matches the CRA it will receive. A lens whose CRA does not match the sensor's gives shading (dark corners) and colour casts (red or blue shift in the corners).

### Front and back illumination
In a **front-illuminated** (FSI) sensor the light must travel down through the wiring stack, 3 to 5 µm deep, to the photodiode at the bottom of a narrow tunnel; the deeper the stack and the smaller the pixel, the worse the loss at an angle. In a **back-illuminated** (BSI) sensor the wafer is flipped, thinned to a few micrometres and lit from the back: the wiring is *behind* the photodiode, which is now only two or three micrometres below the lens. The photodiode can fill the pixel, QE reaches 80 to 95 %, and large angles are tolerated. The cost is process complexity, and light that is absorbed near a boundary is easily shared with a neighbour, so BSI pixels are separated by **deep trench isolation** (DTI): oxide-filled trenches that run through the silicon between pixels.

| | FSI | BSI |
|---|---|---|
| Wiring | above the photodiode | below it |
| Distance from lens to diode | 4 to 6 µm | 2 to 3 µm |
| Geometric fill | 30 to 60 % | 80 to 100 % |
| Angular tolerance | poor at small pitch | good |
| Used in | large pixels, early sensors | nearly all small-pixel sensors today |

### Stacked sensors
A **stacked** sensor builds the pixel array on one wafer and the logic (column ADCs, memory, image processing) on another, bonded face to face and joined by through-silicon vias or by copper-to-copper hybrid bonds, in some designs one per pixel. Each wafer is made in the process best suited to it, the logic can be as large as it likes without enlarging the sensor, the readout can be massively parallel (faster, so less rolling-shutter distortion), and memory on a third layer can hold a burst of frames. Stacked, back-illuminated sensors have been in phones and cameras since about 2012.

> [!key] A microlens focuses the pixel's light onto its photodiode (fill factor ×2 or so); the microlens shift matches the chief ray angle; back illumination puts the wiring behind the diode; stacking puts the logic on a second wafer.
`,
  ideas: [
    'Only part of a pixel is photodiode; the fill factor of a front-illuminated pixel is 30 to 60 %.',
    'A microlens focuses all the light falling on the pixel onto the photodiode, f = nR/(n − 1) in its own material.',
    'Light reaches the corners of the sensor at the chief ray angle, tan CRA = h/L; microlenses are shifted to match it.',
    'Back illumination puts the wiring behind the photodiode, raising QE and angular tolerance; deep trenches limit crosstalk.',
    'A stacked sensor puts the logic on a second wafer for speed, memory and room.'
  ],
  pitfalls: [
    'A microlens makes the sensor more sensitive than its QE says — The microlens is part of the pixel: QE already includes its effect. It recovers light that would otherwise hit the wiring.',
    'Any lens works on any sensor of the right size — The lens\'s chief ray angle must be matched to the sensor\'s microlens shift; a mismatch gives dark or coloured corners.',
    'Back-illuminated means the sensor works from behind the camera — It means the light enters the silicon from the side opposite the wiring, which is the side where the circuits were built.',
    'Stacked sensors have more pixels — Stacking adds a logic wafer under the pixel array; it changes speed and features, not pixel count.'
  ],
  terms: [
    { term: 'Fill factor', def: 'The fraction of a pixel\'s area occupied by the light-sensitive photodiode. Microlenses raise the effective fill factor towards 100 %.' },
    { term: 'Microlens', also: ['on-chip lens', 'OCL'], def: 'A small polymer lens, one per pixel, on top of the colour filter, which focuses the light falling on the pixel onto its photodiode.' },
    { term: 'Chief ray angle', also: ['CRA'], def: 'The angle from the sensor normal of the ray that passes through the centre of the lens\'s exit pupil. It rises from 0° at the centre to a maximum at the corner of the image.' },
    { term: 'Back-side illumination', also: ['BSI', 'back-illuminated', 'BI'], def: 'A sensor design in which the light enters the thinned silicon from the side opposite the wiring, so that the photodiode is not shadowed by the metal layers.' },
    { term: 'Deep trench isolation', also: ['DTI'], def: 'Oxide-filled trenches etched between pixels through the depth of the silicon, which stop charge and light from crossing into neighbouring pixels.' },
    { term: 'Stacked sensor', also: ['stacked CMOS', 'hybrid bonded sensor'], def: 'A sensor made of two or three wafers bonded together: the pixel array on top, the logic (and sometimes memory) below, connected through the bond.' },
    { term: 'Crosstalk', also: ['optical crosstalk', 'colour mixing'], def: 'Light or charge meant for one pixel being collected by its neighbour, which mixes the colours of a mosaic and lowers sharpness.' }
  ],
  formulas: [
    {
      name: 'Focal distance of a microlens in its own material',
      expr: 'f = n*R/(n - 1)', tex: 'f = \\frac{n\\,R}{n - 1}',
      vars: {
        f: { name: 'distance from the lens surface to the focus, inside the material', q: 'length', unit: 'µm' },
        n: { name: 'refractive index of the lens and stack', value: 1.6, min: 1.05, max: 3 },
        R: { name: 'radius of curvature of the lens surface', q: 'length', unit: 'µm', value: 1.2 }
      },
      note: 'Paraxial, for a single curved surface from air into a medium of index n. Where the layers below have another index, use that index in the numerator.',
      stories: { f: 'A microlens surface of radius {R} on a polymer of index {n} focuses into the material. How far below the surface is the focus?', R: 'The focus of a microlens must lie {f} below its surface in a polymer of index {n}. What radius of curvature is needed?' }
    },
    {
      name: 'Chief ray angle at the edge of the image',
      expr: 'cra = atan(h/L)', tex: '\\mathrm{CRA} = \\arctan\\frac{h}{L}',
      vars: {
        cra: { name: 'chief ray angle', q: 'angle', unit: '°', tex: '\\mathrm{CRA}' },
        h: { name: 'image height (distance from the centre of the sensor)', q: 'length', unit: 'mm', value: 3.2 },
        L: { name: 'distance from the exit pupil to the image', q: 'length', unit: 'mm', value: 5 }
      },
      note: 'The exit pupil is taken as a point at the distance L from the sensor.',
      stories: { cra: 'A phone lens has its exit pupil {L} from the sensor. What is the chief ray angle at an image height of {h}?' }
    },
    {
      name: 'Gain from a perfect microlens',
      expr: 'G = 1/FF', tex: 'G = \\frac{1}{\\mathrm{FF}}',
      vars: {
        G: { name: 'light gain of an ideal microlens' },
        FF: { name: 'fill factor of the photodiode', q: 'ratio', unit: '%', value: 50, min: 5, max: 100, tex: '\\mathrm{FF}' }
      },
      note: 'The most it can do, in geometric optics: gather the pixel\'s whole area onto the diode. Real gains are 1.5 to 3.',
      stories: { G: 'A photodiode occupies {FF} of the pixel. At most, how many times more light does a perfect microlens put on it?' }
    }
  ],
  examples: [
    {
      title: 'The corner of a phone sensor',
      q: 'A phone lens has its exit pupil 5 mm from the sensor. The sensor is 6.4 mm wide and 4.8 mm tall (a half-diagonal of 4 mm). What is the chief ray angle at the corner, and how far must the microlens be shifted if the photodiode lies 3 µm beneath it in a stack of index 1.45?',
      steps: [
        { text: 'The chief ray angle at the corner is', tex: '\\mathrm{CRA} = \\arctan\\frac{4}{5} = 38.7°' },
        { text: 'Inside the stack the ray makes $\\sin\\theta\' = \\sin 38.7°/1.45 = 0.431$, that is 25.5°. Over 3 µm of depth it drifts sideways by', tex: '\\Delta = 3\\ \\mu\\mathrm{m} \\times \\tan 25.5° = 1.43\\ \\mu\\mathrm{m}' }
      ],
      a: 'A chief ray angle of 38.7°, an unusually large one, and a lens shift of 1.4 µm towards the centre, about one pixel pitch: the corner pixels have their microlenses offset by about a whole pixel.'
    },
    {
      title: 'How much can a microlens gain?',
      q: 'The photodiode of a pixel is 0.7 µm wide in a pixel of 1.4 µm. What fill factor is that, and what is the best possible gain from a microlens?',
      steps: [
        { text: 'The fill factor is the area ratio:', tex: '\\mathrm{FF} = \\left(\\frac{0.7}{1.4}\\right)^2 = 25\\ \\%' },
        { text: 'The gain is at most', tex: 'G = \\frac{1}{0.25} = 4' }
      ],
      a: 'A fill factor of 25 % and a best-case gain of 4. A microlens is not optional at this size; diffraction at 1.4 µm limits the real gain to around 2 to 3.'
    }
  ],
  quiz: [
    { q: 'A photodiode occupies 40 % of a pixel. What is the best gain a microlens can give?', answer: 2.5, why: '$1/\\mathrm{FF} = 1/0.4 = 2.5$: at most the whole pixel\'s light is put on the diode.' },
    { q: 'Why do back-illuminated sensors tolerate large chief ray angles better than front-illuminated ones?', choices: ['The photodiode is much closer to the lens and not at the bottom of a deep wiring tunnel', 'The silicon is thicker', 'The microlens is bigger', 'They have fewer pixels'], a: 0, why: 'The wiring is behind the diode, so the photodiode lies 2 to 3 µm below the lens instead of 4 to 6 µm. Tilted light drifts less sideways and meets no metal walls.' },
    { q: 'A lens with a larger chief ray angle than the sensor was designed for gives dark or coloured corners.', a: true, why: 'The microlenses are offset for the CRA of the intended lens. Light arriving at a larger angle misses the photodiodes at the corners and leaks into the neighbours, which gives shading and colour casts.' },
    { q: 'A lens has its exit pupil 8 mm from the sensor. What is the chief ray angle, in degrees, at an image height of 4 mm?', answer: 26.57, unit: '°', why: '$\\arctan(4/8) = 26.57°$.' },
    { q: 'What does a stacked sensor add to the pixel array?', choices: ['A second wafer holding the logic and sometimes memory', 'More photodiodes of the same pixel', 'A thicker colour filter', 'A mechanical shutter'], a: 0, why: 'In a stacked sensor the circuits sit on a wafer under the pixel wafer, bonded to it. The pixel count and the shutter are unaffected.' }
  ],
  applications: [
    'Every modern phone sensor is back-illuminated and most are stacked, with microlenses shifted across the array.',
    'Choosing a lens for a small sensor: the datasheet gives the lens\'s chief ray angle against image height, to be matched to the sensor\'s limit.',
    'Telecentric industrial lenses (CRA near 0°) avoid the angle problem and the shading altogether.',
    'Scientific cameras use back-illuminated sensors with 95 % QE; high-speed and event cameras use stacked ones.'
  ],
  history: 'Microlenses over interline CCD pixels were introduced in the 1980s to recover the fill factor lost to the masked registers. Back-thinned CCDs for astronomy go back to the 1970s; back-illuminated CMOS sensors reached cameras and phones around 2009, and stacked sensors followed in 2012.',
  sources: [
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — fill factor, microlenses and angular response.',
    'J. Nakamura (ed.), *Image Sensors and Signal Processing for Digital Still Cameras* (CRC Press, 2006) — on-chip lenses and chief ray angle.',
    'EMVA Standard 1288 — the angular dependence of sensitivity (optional measurement).'
  ],
  sim: 'is-microlens'
},

{
  id: 'binning-roi-and-area-of-interest', parent: 'image-sensors', title: 'Binning and the area of interest (AOI / ROI)', level: 2,
  short: 'Binning adds neighbouring pixels into one bigger, more sensitive pixel and cuts the data; an area of interest (AOI, also ROI) reads only a window of the sensor so frames come faster. Both trade pixels for light or speed. In this page AOI means area of interest on a sensor; in coatings it means angle of incidence, in manufacturing automated optical inspection.',
  keywords: ['binning', '2x2 binning', 'ROI', 'region of interest', 'AOI', 'area of interest', 'window', 'subsampling', 'skipping', 'decimation', 'frame rate', 'GenICam', 'OffsetX', 'sub-array', 'charge binning', 'digital binning', 'readout speed'],
  prereq: ['cmos-sensors', 'sensor-noise'],
  related: ['rolling-and-global-shutter', 'camera-interfaces', 'pixels-per-feature', 'angle-of-incidence-and-coatings', 'automated-optical-inspection', 'ccd-sensors', 'triggering-and-strobing', 'area-scan-and-line-scan-cameras'],
  body: `
A sensor with five million pixels delivers five million numbers every frame. Often fewer will do: a dim scene wants bigger pixels, a fast one wants fewer of them, a small target wants only its own corner of the field. Two features give that.

> [!note] **AOI** has three meanings in optics. Here, on a sensor and in a camera's settings, it is the **area of interest**, also called the *region of interest* (ROI): a window of the sensor that is read out. In the coating pages, AOI is the **angle of incidence** ([[angle-of-incidence-and-coatings]]). In manufacturing, AOI is **automated optical inspection** ([[automated-optical-inspection]]). The context tells which.

### Binning
**Binning** combines a block of $b \\times b$ neighbouring pixels (2 × 2, 3 × 3, 4 × 4) into one. The result has $b^2$ times the signal, $b^2$ times fewer pixels and $b$ times the pixel pitch. How the charge is combined decides the noise:
- **Charge-domain binning** (CCDs, and some CMOS sensors with shared sense nodes) adds the charges *before* the amplifier, so the read noise $r$ is paid once. Signal $b^2 S$, SNR $= b^2S/\\sqrt{b^2S + r^2}$.
- **Digital (or voltage) binning** sums values after each pixel was read, so the read noise of all $b^2$ pixels adds in quadrature: SNR $= b^2S/\\sqrt{b^2S + b^2r^2}$.

In the shot-noise limit both give a gain of $b$ in SNR; with strong read noise, charge-domain binning gains up to $b^2$, which is why binning is the first tool of a CCD user in dim light. **Skipping** (or decimation) reads every $b$-th pixel and discards the rest: faster, but no gain in signal, and it aliases fine detail.

| Binning | Pixels | Signal | SNR (shot-limited) | Read noise paid | Resolution |
|---|---|---|---|---|---|
| 1 × 1 | $N$ | $S$ | $\\sqrt{S}$ | once per pixel | full |
| 2 × 2 | $N/4$ | $4S$ | $2\\sqrt{S}$ | once (charge) or ×2 (digital) | half in each direction |
| 4 × 4 | $N/16$ | $16S$ | $4\\sqrt{S}$ | once (charge) or ×4 (digital) | a quarter |

Binning also speeds up the read-out in many sensors, because rows are combined and fewer rows are read; it never changes the field of view.

### The area of interest
A window is read with a few settings: *width*, *height* and the offsets of its corner (in the GenICam naming of the machine-vision standard, Width, Height, OffsetX and OffsetY). On a CMOS sensor rows outside the window are not read, so the frame time falls with the number of rows read,

$$f = \\frac{1}{n_{\\mathrm{rows}}\\,t_{\\mathrm{row}} + t_0}$$

A 5-megapixel sensor of 2048 rows at 14 µs per row runs at 35 frames a second; reading only 512 rows gives about 135 a second. Narrowing the window in *width* helps only a little, because the row time is set by the readout of each row; sensors vary, so the data sheet decides. A smaller window also lowers the data rate $R = w\\,h\\,b\\,f$, which may allow a higher frame rate through the camera's interface: see [[camera-interfaces]].

### What to use when
- **Dim and slow:** bin, to gain light at the cost of pixels.
- **Fast:** shrink the AOI to the target and track it; or bin vertically.
- **Large field, small detail:** neither; use a bigger sensor ([[pixels-per-feature]]).
- **A rolling shutter distorts moving parts:** a smaller AOI shortens the readout time and with it the skew ([[rolling-and-global-shutter]]).

> [!key] Binning: b × b pixels become one, with b² times the signal and b times the SNR (more if read noise dominates and the charge is combined before the amplifier). AOI/ROI: read only a window and the frame rate rises in proportion to the rows dropped.
`,
  ideas: [
    'Binning b × b adds the neighbours into one pixel: b² times the signal, 1/b² the pixels, b times the pixel pitch.',
    'Charge-domain binning pays the read noise once; digital binning pays it for every pixel combined.',
    'In the shot-noise limit binning gains √(b²) = b in SNR; skipping gains nothing.',
    'An area of interest (ROI) reads only a window; on a CMOS sensor the frame rate rises in proportion to the rows dropped.',
    'AOI also means angle of incidence (coatings) and automated optical inspection (manufacturing): read the context.'
  ],
  pitfalls: [
    'Binning 2 × 2 gives four times the SNR — It gives four times the signal; the SNR rises by 2 when shot noise dominates, and by up to 4 only when the read noise is large and the charge is combined before the amplifier.',
    'Binning and skipping are the same thing — Binning adds the pixels (light is kept); skipping drops pixels (light is thrown away and fine detail aliases).',
    'A smaller AOI always means a faster camera — It does when rows are dropped in a CMOS sensor; narrowing only the width often helps little, and a CCD must still clock out every row.',
    'AOI always means the angle of incidence — It also means an area of interest on a sensor and automated optical inspection; only the context tells which.'
  ],
  terms: [
    { term: 'Binning', also: ['pixel binning', '2 × 2 binning'], def: 'Combining a block of neighbouring pixels into one larger pixel, by adding their charge or values. It gains signal and speed and loses resolution.' },
    { term: 'Area of interest', also: ['AOI', 'region of interest', 'ROI', 'window', 'sub-array'], def: 'A rectangle of the sensor that alone is read out and sent, set by width, height and offsets. On a camera, AOI and ROI mean the same; the term "AOI" is also used for angle of incidence and automated optical inspection.' },
    { term: 'Charge-domain binning', also: ['on-chip binning', 'analogue binning'], def: 'Adding the charges of neighbouring pixels before the amplifier, so the read noise is paid once for the whole bin.' },
    { term: 'Skipping', also: ['subsampling', 'decimation'], def: 'Reading only every n-th pixel or row and discarding the others. It speeds the read-out but gains no signal and can alias fine detail.' },
    { term: 'Frame rate', also: ['fps', 'frames per second'], def: 'The number of frames read out per second, limited by the sensor\'s read-out time and the data rate of the interface.' },
    { term: 'Offset (of the window)', also: ['OffsetX', 'OffsetY'], def: 'The position of the corner of the area of interest relative to the corner of the sensor, in pixels.' }
  ],
  formulas: [
    {
      name: 'SNR of charge-domain binning',
      expr: 'snr = n*S/sqrt(n*S + r^2)', tex: '\\mathrm{SNR} = \\frac{n\\,S}{\\sqrt{n\\,S + r^2}}',
      vars: {
        snr: { name: 'SNR of the binned pixel', tex: '\\mathrm{SNR}' },
        n: { name: 'pixels combined (b × b)', value: 4, int: true, min: 1, max: 64 },
        S: { name: 'signal electrons of one pixel', value: 25, min: 0 },
        r: { name: 'read noise (electrons)', q: false, unit: 'e⁻', value: 5, min: 0, max: 100 }
      },
      note: 'The read noise is paid once. At low signal the SNR rises by nearly n.',
      stories: { snr: 'Each pixel collects {S} electrons and the read noise is {r}. What SNR do {n} pixels binned in the charge domain reach?' }
    },
    {
      name: 'SNR of digital binning',
      expr: 'snr = n*S/sqrt(n*S + n*r^2)', tex: '\\mathrm{SNR} = \\frac{n\\,S}{\\sqrt{n\\,S + n\\,r^2}}',
      vars: {
        snr: { name: 'SNR of the binned pixel', tex: '\\mathrm{SNR}' },
        n: { name: 'pixels combined (b × b)', value: 4, int: true, min: 1, max: 64 },
        S: { name: 'signal electrons of one pixel', value: 25, min: 0 },
        r: { name: 'read noise (electrons)', q: false, unit: 'e⁻', value: 5, min: 0, max: 100 }
      },
      note: 'Every pixel is read, so the read noises add in quadrature: the SNR rises by √n whatever the light.',
      stories: { snr: 'Each pixel collects {S} electrons and the read noise is {r}. What SNR do {n} pixels summed digitally reach?' }
    },
    {
      name: 'Frame rate from the window',
      expr: 'fps = 1/(nr*tl + t0)', tex: 'f = \\frac{1}{n_r\\,t_{\\mathrm{row}} + t_0}',
      vars: {
        fps: { name: 'frame rate', q: 'frequency', unit: 'Hz', tex: 'f' },
        nr: { name: 'rows read', value: 512, int: true, min: 1, max: 20000, tex: 'n_r' },
        tl: { name: 'row time', q: 'time', unit: 'µs', value: 14, tex: 't_{\\mathrm{row}}' },
        t0: { name: 'fixed overhead per frame', q: 'time', unit: 'µs', value: 100, tex: 't_0' }
      },
      note: 'When the read-out of the sensor limits the frame rate. The interface may limit it first.',
      stories: { fps: 'A sensor reads each row in {tl} with {t0} of overhead per frame. How fast does it run when only {nr} rows are read?' }
    },
    {
      name: 'Data rate of the window',
      expr: 'R = w*h*b*fps', tex: 'R = w\\,h\\,b\\,f',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'Mbit/s' },
        w: { name: 'width of the window, in pixels', value: 2448, int: true, min: 1 },
        h: { name: 'height of the window, in pixels', value: 512, int: true, min: 1 },
        b: { name: 'bits per pixel', value: 8, int: true, min: 1, max: 24 },
        fps: { name: 'frame rate', q: 'frequency', unit: 'Hz', value: 135, tex: 'f' }
      },
      stories: { R: 'A window of {w} × {h} pixels at {b} bits runs at {fps}. What data rate does the camera send?' }
    }
  ],
  examples: [
    {
      title: 'Binning in dim light',
      q: 'A pixel collects 25 electrons and the read noise is 5 e⁻. Compare the SNR of one pixel, of 2 × 2 binning in the charge domain, and of 2 × 2 digital summing.',
      steps: [
        { text: 'One pixel:', tex: '\\mathrm{SNR} = \\frac{25}{\\sqrt{25 + 25}} = 3.5' },
        { text: 'Charge binning of four pixels (100 e⁻, read noise once):', tex: '\\mathrm{SNR} = \\frac{100}{\\sqrt{100 + 25}} = 8.9' },
        { text: 'Digital summing (read noise four times):', tex: '\\mathrm{SNR} = \\frac{100}{\\sqrt{100 + 100}} = 7.1' }
      ],
      a: 'SNR 3.5, 8.9 and 7.1. Binning in the charge domain beats digital summing when read noise matters; both beat single pixels by far, at the price of a quarter of the pixels.'
    },
    {
      title: 'A fast window',
      q: 'A sensor has 2448 × 2048 pixels, a row time of 14 µs and 100 µs of overhead; the camera sends 8-bit pixels over a link that carries 900 Mbit/s. What frame rate does a window of 2448 × 512 reach, and what does the link allow?',
      steps: [
        { text: 'The read-out gives', tex: 'f = \\frac{1}{512 \\times 14\\ \\mu\\mathrm{s} + 100\\ \\mu\\mathrm{s}} = 128\\ \\mathrm{Hz}' },
        { text: 'The data rate would be', tex: 'R = 2448 \\times 512 \\times 8 \\times 128 = 1.28\\ \\mathrm{Gbit/s}' },
        'The link carries only 900 Mbit/s, so the frame rate is limited to about 900/1.28 × 128 = 90 Hz.'
      ],
      a: 'The sensor could reach 128 frames a second but the link restricts it to about 90. A faster interface, or a narrower window or fewer bits, is needed to use the sensor\'s speed.'
    }
  ],
  quiz: [
    { q: 'A pixel collects 100 electrons with a negligible read noise. By what factor does 2 × 2 binning raise the SNR?', answer: 2, why: 'The signal rises by 4, the shot noise by $\\sqrt{4} = 2$, so the SNR rises by 2 (the read noise is negligible).' },
    { q: 'Which binning pays the read noise only once for the whole bin?', choices: ['Charge-domain binning before the amplifier', 'Digital summing after the ADC', 'Skipping every other pixel', 'Interpolation'], a: 0, why: 'In the charge domain the charges are added before the one read-out; digitally each pixel is read with its own noise, and the noises add in quadrature.' },
    { q: 'Reading only a window of 1/4 of the rows of a CMOS sensor can raise the frame rate by nearly a factor of four.', a: true, why: 'The read-out time is mostly rows times row time, so a quarter of the rows takes a quarter of the time (apart from the fixed overhead and any limit set by the interface).' },
    { q: 'A sensor with a row time of 10 µs and no overhead reads a window of 500 rows. What frame rate does the read-out allow, in Hz?', answer: 200, unit: 'Hz', why: '$500 \\times 10\\ \\mu\\mathrm{s} = 5$ ms; $f = 1/5\\ \\mathrm{ms} = 200$ Hz.' },
    { q: 'On a camera\'s settings page you see "AOI width", "AOI height" and "AOI offset X". What does AOI stand for here?', choices: ['Area of interest', 'Angle of incidence', 'Automated optical inspection', 'Aperture of imaging'], a: 0, why: 'On a camera, AOI is the window of the sensor that is read (area of interest, also called ROI). Angle of incidence belongs to coatings and automated optical inspection to manufacturing.' }
  ],
  applications: [
    'Machine vision: a small AOI around the part and a tracking window give thousands of frames a second; binning lets a dim line-scan or fluorescence camera see at all.',
    'Astronomy and microscopy with CCDs and scientific CMOS bin 2 × 2 or 4 × 4 for faint objects, and read sub-arrays for fast focusing and guiding.',
    'Phone cameras bin 4 or 9 pixels of quad-Bayer sensors in low light, and use the full array only in good light.',
    'Eye-tracking and gesture cameras read a few hundred rows at high rates; barcode readers choose an AOI along the code.'
  ],
  history: 'On-chip binning was a feature of scientific CCDs from the start, because the charge could be summed along the register at no cost in noise. Windowed read-out became practical with CMOS sensors in the 1990s, whose pixels could be addressed directly like memory.',
  sources: [
    'EMVA, *GenICam Standard Features Naming Convention (SFNC)* — the features Width, Height, OffsetX, OffsetY, BinningHorizontal and BinningVertical.',
    'J. R. Janesick, *Scientific Charge-Coupled Devices* (SPIE Press, 2001) — binning on the chip.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press) — windowing and readout modes.'
  ],
  sim: 'is-binning'
},

{
  id: 'infrared-and-thermal-sensors', parent: 'image-sensors', title: 'Infrared and thermal sensors', level: 2,
  short: 'Beyond 1.1 µm silicon is blind, and other detectors take over: InGaAs from 0.9 to 1.7 µm, cooled InSb and MCT in the mid-wave band (3 to 5 µm), and uncooled microbolometers in the long-wave band (8 to 14 µm) that see the heat radiated by anything at room temperature. Their key figure is the noise-equivalent temperature difference, NETD.',
  keywords: ['infrared sensor', 'thermal camera', 'InGaAs', 'SWIR', 'MWIR', 'LWIR', 'InSb', 'MCT', 'HgCdTe', 'microbolometer', 'NETD', 'thermal imaging', 'emissivity', 'cooled detector', 'uncooled', 'photon detector', 'thermal detector', 'bolometer', 'Stirling cooler', 'germanium lens'],
  prereq: ['how-a-pixel-detects-light', 'quantum-efficiency-and-spectral-response', 'photon-energy'],
  related: ['night-vision-and-thermal-cameras', 'uv-and-infrared-materials', 'uv-and-infrared-sources', 'colour-and-multispectral-imaging', 'the-optical-spectrum', 'spectroscopy-in-industry'],
  body: `
Silicon sees to 1.1 µm because its band gap is 1.12 eV. Longer wavelengths have photons of lower energy, and detecting them needs a smaller gap. The detectors for each band come from other materials.

### The bands and their detectors
| Band | Wavelengths | Detector | Cooling | Typical pixels | Typical use |
|---|---|---|---|---|---|
| NIR | 0.75 to 1.1 µm | silicon (NIR-enhanced) | none | as visible | night-vision illumination, face recognition |
| SWIR | 0.9 to 1.7 µm (to 2.6 µm extended) | InGaAs | thermo-electric | 15 µm, 640 × 512; finer to 5 µm | silicon-wafer inspection, sorting, sensing through haze, laser beam profiling at 1550 nm |
| MWIR | 3 to 5 µm | InSb, MCT, type-II superlattice | cooled to about 77 K | 15 to 30 µm, 640 × 512 and more | gas imaging, fast thermography, military |
| LWIR | 8 to 14 µm | microbolometer (VOx, amorphous silicon); also cooled MCT | none for bolometers | 12 to 17 µm, 160 × 120 to 640 × 480, to 1280 × 1024 | thermography, building inspection, night driving, firefighting |

The mid- and long-wave bands match the atmosphere's two transparent windows (3 to 5 and 8 to 14 µm).

### Why thermal cameras see in the dark
Everything above absolute zero radiates. At 300 K a body is brightest at the wavelength of Wien's law, $\\lambda_{\\max} = b/T = 2898\\ \\mu\\mathrm{m\\,K}/300\\ \\mathrm{K} = 9.7$ µm, in the long-wave band. A thermal camera does not need light: it images the emission itself. The power radiated by a surface of emissivity $\\varepsilon$ is $M = \\varepsilon\\sigma T^4$, 460 W/m² for a blackbody at 300 K, of which the 8 to 14 µm band carries about 170 W/m² and the 3 to 5 µm band only about 6 W/m².

**Contrast.** A 1 K difference at 300 K changes the radiance in the long-wave band by about 1.5 %, and in the mid-wave band by about 3.7 %. But at 300 K the 8 to 14 µm band holds some 29 times the flux of the 3 to 5 µm band, so the LWIR camera collects more photons and the MWIR camera has more contrast per kelvin; each wins in different conditions.

**Emissivity.** The camera sees the radiance leaving the surface, and that is $\\varepsilon$ times its own emission plus $(1 - \\varepsilon)$ times what it reflects. Skin, paint and water have $\\varepsilon$ of 0.9 to 0.98. Polished metal has 0.05 to 0.1: it looks cold because it reflects the surroundings. Glass is opaque to the long-wave band: a thermal camera cannot look through a window, and sees its reflections.

### Two kinds of detector
- **Photon detectors** (InGaAs, InSb, MCT) free electrons directly, so they respond fast and need a band gap matched to the wavelength. For 5 µm the gap is 0.25 eV, only 10 times $kT$ at 300 K, so heat alone frees electrons: the detector must be **cooled**, to about 77 K, by a small Stirling-cycle cooler that takes some minutes to cool down.
- **Thermal detectors** respond to the heat the radiation deposits. A **microbolometer** pixel is a membrane of vanadium oxide or amorphous silicon thermally isolated on two legs in a vacuum; absorbed radiation warms it by a few millikelvin and its resistance changes by about 2 to 3 % per kelvin. Slow (a response time near 10 ms), uncooled, cheap, and sensitive to every wavelength it absorbs.

### NETD
The sensitivity of a thermal camera is the **noise-equivalent temperature difference**: the temperature difference of a blackbody target that gives a signal equal to the noise. Uncooled microbolometer cameras reach 30 to 50 mK (high-end below 25 mK) at f/1; cooled cameras 10 to 25 mK. Lenses are germanium (index about 4, so it reflects 36 % per surface and needs anti-reflection coatings) or chalcogenide glass; ordinary glass does not transmit beyond about 2.5 µm.

> [!key] Silicon stops at 1.1 µm. InGaAs covers 0.9 to 1.7 µm, cooled InSb and MCT the 3 to 5 µm band, and microbolometers the 8 to 14 µm band where room-temperature objects glow. Thermal cameras image emission, not reflected light, so emissivity matters, and NETD is their sensitivity.
`,
  ideas: [
    'Photons must carry more than the band-gap energy: silicon stops at 1.1 µm, InGaAs at 1.7 µm, InSb at about 5.5 µm.',
    'Detectors for long wavelengths have small gaps and must be cooled, or they are thermal detectors (microbolometers) that need no cooling.',
    'Room-temperature objects glow most near 10 µm, so the long-wave band 8 to 14 µm is the thermal camera\'s home.',
    'A thermal camera sees emitted plus reflected radiation: low-emissivity metals look cold and glass is opaque.',
    'NETD, the temperature difference that equals the noise, is the sensitivity figure: 30 to 50 mK for uncooled cameras.'
  ],
  pitfalls: [
    'Thermal cameras see through glass and walls — Glass is opaque in the long-wave band, and walls hide what is behind them; a thermal camera sees only the surface temperature of what faces it.',
    'A thermal camera measures temperature directly — It measures radiance. The temperature follows only if the emissivity and the reflected surroundings are known.',
    'Infrared cameras all work the same way — Photon detectors (InGaAs, InSb, MCT) count photons and are fast, narrow-band and often cooled; microbolometers sense heat, are uncooled and slow.',
    'Near-infrared and thermal cameras show the same things — Silicon NIR and SWIR cameras see reflected light, so they need illumination; thermal cameras see emitted heat at 8 to 14 µm and need none.'
  ],
  terms: [
    { term: 'InGaAs', also: ['indium gallium arsenide'], def: 'A semiconductor with a band gap of about 0.75 eV used for short-wave infrared detectors responding from about 0.9 to 1.7 µm (to 2.6 µm in extended types), including telecom photodiodes.' },
    { term: 'SWIR, MWIR, LWIR', also: ['short-wave, mid-wave, long-wave infrared'], def: 'Infrared bands: SWIR 0.9 to 1.7 µm, MWIR 3 to 5 µm, LWIR 8 to 14 µm. MWIR and LWIR coincide with the atmosphere\'s transparent windows.' },
    { term: 'Microbolometer', also: ['bolometer', 'uncooled thermal detector'], def: 'A pixel that is a thermally isolated membrane whose resistance changes when radiation warms it. Arrays of them make uncooled thermal cameras for 8 to 14 µm.' },
    { term: 'Photon detector', also: ['quantum detector'], def: 'A detector in which each absorbed photon frees an electron (InGaAs, InSb, MCT). Fast and band-limited by its band gap; long-wave types need cooling.' },
    { term: 'NETD', also: ['noise-equivalent temperature difference'], def: 'The temperature difference of a blackbody target that produces a signal equal to the camera\'s noise. 30 to 50 mK for uncooled thermal cameras, 10 to 25 mK for cooled.' },
    { term: 'Emissivity', also: ['ε'], def: 'The ratio of the radiation a surface emits to that of a blackbody at the same temperature: from 0.05 for polished metal to 0.98 for skin or matt paint.' },
    { term: 'MCT', also: ['HgCdTe', 'mercury cadmium telluride'], def: 'A semiconductor alloy whose band gap, and so the cut-off wavelength, is set by its composition, giving cooled detectors from the short-wave to beyond 14 µm.' }
  ],
  formulas: [
    {
      name: 'Longest wavelength a detector can see',
      expr: 'lc = h*c/Eg', tex: '\\lambda_c = \\frac{h\\,c}{E_g}',
      vars: {
        lc: { name: 'cut-off wavelength', q: 'length', unit: 'µm', tex: '\\lambda_c' },
        h: { const: 'h' }, c: { const: 'c' },
        Eg: { name: 'band-gap energy', q: 'energy', unit: 'eV', value: 0.228, min: 0.05, max: 6, tex: 'E_g' }
      },
      note: 'Cooled InSb has a gap of 0.228 eV: 5.4 µm. InGaAs (0.75 eV): 1.65 µm. For MCT the gap is chosen by the composition.',
      stories: { lc: 'A detector has a band gap of {Eg}. What is its cut-off wavelength?', Eg: 'A detector should respond out to {lc}. What band gap does it need?' }
    },
    {
      name: 'Wavelength of peak emission (Wien)',
      expr: 'lm = bW/T', tex: '\\lambda_{\\max} = \\frac{b}{T}',
      vars: {
        lm: { name: 'wavelength of peak emission', q: 'length', unit: 'µm', tex: '\\lambda_{\\max}' },
        bW: { const: 'bW', tex: 'b' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300, min: 3, max: 10000 }
      },
      stories: { lm: 'An object is at {T}. At what wavelength does it radiate most strongly?', T: 'A surface radiates most strongly at {lm}. What is its temperature?' }
    },
    {
      name: 'Radiant exitance of a surface',
      expr: 'M = eps*sigma*T^4', tex: 'M = \\varepsilon\\,\\sigma\\,T^{4}',
      vars: {
        M: { name: 'radiant exitance', q: 'intensity', unit: 'W/m²' },
        eps: { name: 'emissivity', value: 0.95, min: 0.01, max: 1, tex: '\\varepsilon' },
        sigma: { const: 'sigma' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300, min: 3, max: 10000 }
      },
      note: 'Total over all wavelengths. A thermal camera collects only the part inside its band.',
      stories: { M: 'A surface of emissivity {eps} is at {T}. How much power does it radiate per square metre?' }
    },
    {
      name: 'Contrast of a small temperature difference',
      expr: 'c = 4*dT/T', tex: 'c \\approx \\frac{4\\,\\Delta T}{T}',
      vars: {
        c: { name: 'relative change of the total radiated power', q: 'ratio', unit: '%' },
        dT: { name: 'temperature difference', q: 'dtemp', unit: 'K', value: 1, min: 0, max: 100, tex: '\\Delta T' },
        T: { name: 'temperature of the scene', q: 'temperature', unit: 'K', value: 300, min: 3, max: 10000 }
      },
      note: 'The change of M = σT⁴, over all wavelengths: 1.3 % per kelvin at 300 K. In the 8 to 14 µm band it is nearer 1.5 %, in 3 to 5 µm 3.7 %.',
      stories: { c: 'A scene is at {T} and one part is {dT} warmer. By how much does its total radiated power change?' }
    }
  ],
  examples: [
    {
      title: 'Where does a thermal camera look?',
      q: 'A person has a skin temperature of 307 K, and the room is at 293 K. At what wavelength does the skin radiate most strongly, and which camera band holds that peak?',
      steps: [
        { text: 'By Wien\'s law:', tex: '\\lambda_{\\max} = \\frac{2898\\ \\mu\\mathrm{m\\,K}}{307\\ \\mathrm{K}} = 9.4\\ \\mu\\mathrm{m}' },
        'That is inside the long-wave band, 8 to 14 µm, and the 10 µm peak lies far beyond the 1.1 µm limit of silicon.'
      ],
      a: '9.4 µm: the long-wave infrared, seen by a microbolometer camera. A silicon camera sees nothing from skin at that temperature: it emits no visible or near-infrared light.'
    },
    {
      title: 'A metal plate that looks cold',
      q: 'A polished metal plate of emissivity 0.1 at 330 K stands in a room at 293 K. In the long-wave band, approximately what apparent temperature does a camera set for ε = 1 read?',
      steps: [
        { text: 'The radiance leaving it is the sum of its own emission and the reflected room, taking the band as proportional to $T^{4}$ for simplicity:', tex: 'T_{\\mathrm{app}}^{4} \\approx 0.1\\times330^{4} + 0.9\\times293^{4}' },
        { text: 'Numerically', tex: 'T_{\\mathrm{app}}^{4} = 0.1(1.186\\times10^{10}) + 0.9(7.37\\times10^{9}) = 7.82\\times10^{9} \\Rightarrow T_{\\mathrm{app}} \\approx 297\\ \\mathrm{K}' }
      ],
      a: 'About 297 K: a plate at 330 K (57 °C) looks only 4 K above the room, because 90 % of what it sends to the camera is the reflected room. The camera needs the correct emissivity to read it.'
    }
  ],
  quiz: [
    { q: 'What is the longest wavelength an InSb detector with a band gap of 0.228 eV can detect, in micrometres?', answer: 5.44, unit: 'µm', why: '$\\lambda_c = 1.23984/0.228 = 5.44$ µm.' },
    { q: 'At what wavelength, in micrometres, does a body at 300 K radiate most strongly?', answer: 9.66, unit: 'µm', why: 'Wien\'s law: $2898/300 = 9.66$ µm, in the long-wave band.' },
    { q: 'A thermal camera can see through an ordinary glass window.', a: false, why: 'Glass is opaque in the 8 to 14 µm band. The camera sees the window\'s surface temperature and the reflections in it, not what is behind.' },
    { q: 'Why must an InSb detector be cooled?', choices: ['Its small band gap lets heat free electrons, swamping the signal', 'Cooling raises the number of photons', 'The lens gets hot', 'It is a thermal detector'], a: 0, why: 'At 5 µm the gap is about 0.25 eV, only ten times the thermal energy kT at room temperature. Cooling to about 77 K cuts the thermally generated electrons (dark current) to a tolerable level.' },
    { q: 'A polished metal pipe at 80 °C looks cooler than a painted one at 40 °C in a thermal image. The best explanation is…', choices: ['its low emissivity: it reflects the cooler surroundings instead of emitting', 'metal conducts heat away', 'the camera is out of focus', 'metal is transparent to the long-wave band'], a: 0, why: 'A camera sees radiance. A polished surface with ε ≈ 0.1 emits only a tenth of a blackbody\'s radiation and reflects the rest of its surroundings, so its apparent temperature is far too low.' }
  ],
  applications: [
    'Building and electrical inspection with uncooled thermal cameras: missing insulation, overheating joints, hot bearings.',
    'Firefighting, search and rescue, and night driving: seeing people and animals in smoke and darkness.',
    'Gas imaging with cooled mid-wave cameras: methane and refrigerant leaks absorb at their own wavelengths.',
    'SWIR cameras (InGaAs) for inspecting silicon wafers and solar cells (silicon is transparent beyond 1.1 µm), sorting plastics and sensing moisture, and imaging through haze.'
  ],
  history: 'William Herschel found invisible heat rays beyond the red end of the spectrum in 1800. The first practical thermal imagers of the 1960s used a single cooled detector scanned over the scene; uncooled microbolometer arrays, developed in the United States in the 1980s and released from military secrecy in the 1990s, made thermal cameras a commercial product.',
  sources: [
    'A. Rogalski, *Infrared and Terahertz Detectors* (CRC Press) — InGaAs, InSb, MCT and bolometers.',
    'G. C. Holst, *Common Sense Approach to Thermal Imaging* (SPIE Press, 2000).',
    'W. L. Wolfe and G. J. Zissis (eds.), *The Infrared Handbook* (Environmental Research Institute of Michigan) — blackbody radiation and detectors.'
  ],
  sim: 'is-infrared'
}

);
