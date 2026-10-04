/* HYPER-OPTICS · content/scanning-systems.js — the topic "Scanners at work" (parent: scanning-systems)
 * Whole scanners, each read from source through scanner and target to detector:
 *   flatbed-and-document-scanners   barcode-scanners          laser-printers             laser-marking-and-cutting-heads
 *   laser-projection-and-displays   laser-scanning-microscopes   lidar                    laser-triangulation
 *   structured-light-scanning       time-of-flight-cameras    line-scan-inspection       optical-coherence-tomography
 *   optical-disc-pickups
 * Simulations are in sims/scanning-systems.js (ids ss-…).
 */
Hyper.add(

/* ================================================================ flatbed and document scanners */
{
  id: 'flatbed-and-document-scanners', parent: 'scanning-systems', title: 'Flatbed and document scanners', level: 1,
  short: 'A flatbed scanner has one row of pixels and a motor: a lit line of the page is imaged onto the line sensor, the carriage steps along the glass, and the picture is built up one line at a time. The "dpi" on the box is the spacing of those samples, not a promise of detail.',
  keywords: ['flatbed scanner', 'document scanner', 'CIS', 'contact image sensor', 'CCD scanner', 'dpi', 'dots per inch', 'optical resolution', 'interpolated resolution', 'platen', 'carriage', 'sheet-fed scanner', 'ADF', 'line sensor', 'tri-linear', 'scan resolution'],
  prereq: ['area-scan-and-line-scan-cameras', 'sensor-formats-and-pixel-size', 'spatial-frequency-and-line-pairs'],
  related: ['line-scan-inspection', 'nyquist-sampling-and-aliasing', 'ccd-architectures', 'gradient-index-optics', 'the-modulation-transfer-function', 'what-scanning-is', 'laser-printers', 'colour-filter-arrays-and-demosaicing'],
  body: `
Lift the lid of a flatbed scanner and watch: a bar of light slides under the glass and the page appears on the screen one line at a time. The scanner has no frame, no shutter and no area sensor. It has **one row of pixels**, and a motor supplies the second dimension. It is a [[area-scan-and-line-scan-cameras|line-scan camera]] with the object held still and the camera moving.

### What travels on the carriage
A belt and a stepper motor draw a **carriage** along the page, under the glass **platen**. It carries:
- a **line light**, a row of LEDs (older machines used a cold-cathode lamp), that lights a strip a millimetre or two wide across the page;
- a **mirror train**: usually three mirrors fold an optical path of a few hundred millimetres into a body a few centimetres deep;
- a **lens** that images the lit line, about 216 mm wide, at a magnification of roughly 0.1 to 0.2 onto a **line sensor**, a CCD some 30 to 40 mm long;
- a sensor that is usually **tri-linear**: three rows side by side behind red, green and blue filters, so one pass records all three colours.

Slimmer machines use a **contact image sensor** (CIS): LEDs and a strip of small [[gradient-index-optics|graded-index rod lenses]] form a life-size image on a sensor as wide as the page. There are no mirrors, but the depth of focus is a fraction of a millimetre, so a page lifted at the spine of a book goes soft; a reducing lens keeps a few millimetres sharp.

### Dots per inch
The pixels and the lens fix the spacing of the samples along the line; the motor's step fixes it along the page. The resolution in **dots per inch** (dpi) is the number of samples per inch, so the spacing on the page is

$$p = \\frac{25.4\\ \\mathrm{mm}}{\\mathrm{dpi}}$$

| dpi | spacing on the page | an A4 page in pixels | megapixels | raw file, 24-bit colour |
|---|---|---|---|---|
| 150 | 169 µm | 1240 × 1754 | 2.2 | 6.5 MB |
| 300 | 84.7 µm | 2480 × 3508 | 8.7 | 26 MB |
| 600 | 42.3 µm | 4961 × 7016 | 34.8 | 104 MB |
| 1200 | 21.2 µm | 9921 × 14031 | 139 | 418 MB |

Doubling the dpi quadruples the pixels and the file. How much is enough follows from sampling theory ([[nyquist-sampling-and-aliasing]]): two samples across the finest detail at least, so 600 dpi can show at most 300 line pairs to the inch, 11.8 per millimetre.

### Optical against interpolated
The **optical resolution** is what the sensor and lens really sample, often quoted as two numbers, for example 1200 × 2400 dpi: pixels along the line, motor steps along the page. The **interpolated resolution** on the box (9600 dpi, say) is software enlarging the file: it adds pixels and no detail. Even the optical figure only says how finely the page is sampled. How much contrast survives at each spatial frequency is decided by the lens and the pixel aperture, its [[the-modulation-transfer-function|MTF]].

### Calibration and feeders
Before each scan the sensor reads a white strip at the edge of the glass: every pixel has its own gain and the lamp is brighter in the middle, so a correction ("shading") is stored for each. A **document feeder** turns the arrangement round: the paper passes a fixed CIS and no carriage moves. It is the principle of [[line-scan-inspection]] on a small scale.

> [!key] A flatbed scanner is a line camera that moves over a still page; dpi is the spacing of its samples, $p = 25.4\\ \\mathrm{mm}/\\mathrm{dpi}$. Detail is set by the optics, and interpolation adds pixels but no information.
`,
  ideas: [
    'One row of pixels plus a motor makes a picture: the motion supplies the second dimension.',
    'The sample spacing on the page is 25.4 mm divided by the dpi; doubling the dpi quadruples the pixels.',
    'Reducing-lens CCD scanners fold the path with mirrors and tolerate a few millimetres of height; contact image sensors are thin but need the page on the glass.',
    'Optical resolution is what is sampled; interpolated resolution is software enlargement and adds no detail.',
    'Every pixel is calibrated against a white strip, because gain and lamp brightness vary along the line.'
  ],
  pitfalls: [
    'The dpi on the box is the amount of detail in the scan — It is the spacing of the samples. Detail also depends on the lens and the pixel aperture, and values above the optical resolution are interpolated.',
    'Doubling the dpi doubles the file size — Pixels are added along both directions, so the pixel count and the raw file grow by four. A 600 dpi A4 colour scan is about 104 MB before compression.',
    'More dpi always gives a better scan of text — Past the point where the pen strokes are sampled twice, extra pixels only record the paper grain and the scanner noise. About 300 dpi suffices for printed text.',
    'A contact image sensor and a CCD scanner differ only in price — The optics differ: the CIS has a very shallow depth of focus, the lens scanner a few millimetres.'
  ],
  terms: [
    { term: 'Dots per inch', also: ['dpi', 'ppi', 'samples per inch'], def: 'The number of samples a scanner takes per inch of the page. The spacing of the samples is 25.4 mm divided by the dpi: 42.3 µm at 600 dpi.' },
    { term: 'Optical resolution', also: ['true resolution', 'native resolution'], def: 'The sampling density the sensor, the lens and the motor step really provide, before any software enlargement. Often given as two numbers, along the sensor and along the motion.' },
    { term: 'Interpolated resolution', also: ['enhanced resolution'], def: 'A larger pixel count produced by computing extra pixels between the real samples. It enlarges the file without adding detail.' },
    { term: 'Contact image sensor', also: ['CIS'], def: 'A scanner head in which LEDs and a row of rod lenses image the page one to one on a sensor as wide as the page. It is thin, with a very shallow depth of focus.' },
    { term: 'Platen', also: ['scanner glass'], def: 'The glass plate on which the document lies in a flatbed scanner, with the carriage moving beneath it.' },
    { term: 'Shading correction', also: ['white calibration', 'flat-field correction'], def: 'Dividing every pixel by its reading of a white reference, so that differences in pixel gain and in lamp brightness along the line do not show in the picture.' }
  ],
  formulas: [
    {
      name: 'Sample spacing on the page',
      expr: 'p = 0.0254/dpi', tex: 'p = \\frac{25.4\\ \\mathrm{mm}}{\\mathrm{dpi}}',
      vars: {
        p: { name: 'spacing of the samples on the page', q: 'length', unit: 'µm', tex: 'p' },
        dpi: { name: 'resolution (dots per inch)', q: false, unit: 'dpi', value: 600, min: 10, max: 12800, tex: '\\mathrm{dpi}' }
      },
      solveFor: 'p',
      note: 'One inch is 25.4 mm. At 600 dpi the samples are 42.3 µm apart.',
      stories: { p: 'A scanner samples at {dpi}. How far apart are the samples on the page?', dpi: 'The samples lie {p} apart on the page. What is the resolution in dots per inch?' }
    },
    {
      name: 'Pixels along one edge of the page',
      expr: 'N = W*dpi/0.0254', tex: 'N = \\frac{W\\,\\mathrm{dpi}}{25.4\\ \\mathrm{mm}}',
      vars: {
        N: { name: 'pixels along the edge', tex: 'N' },
        W: { name: 'length of the edge', q: 'length', unit: 'mm', value: 210, min: 1, max: 2000, tex: 'W' },
        dpi: { name: 'resolution (dots per inch)', q: false, unit: 'dpi', value: 600, min: 10, max: 12800, tex: '\\mathrm{dpi}' }
      },
      solveFor: 'N',
      note: 'The short side of an A4 page is 210 mm.',
      stories: { N: 'A page edge of {W} is scanned at {dpi}. How many pixels lie along it?' }
    },
    {
      name: 'Magnification of the reducing lens',
      expr: 'm = pp*dpi/0.0254', tex: 'm = \\frac{p_{s}\\,\\mathrm{dpi}}{25.4\\ \\mathrm{mm}}',
      vars: {
        m: { name: 'magnification (image ÷ object)', tex: 'm' },
        pp: { name: 'pixel pitch of the sensor', q: 'length', unit: 'µm', value: 7, tex: 'p_{s}' },
        dpi: { name: 'resolution (dots per inch)', q: false, unit: 'dpi', value: 600, min: 10, max: 12800, tex: '\\mathrm{dpi}' }
      },
      solveFor: 'm',
      note: 'The lens must shrink the page spacing p to the sensor pitch p_s: m = p_s / p.'
    },
    {
      name: 'Raw size of a scan',
      expr: 'S = W*H*dpi^2*b/(8*0.0254^2*1e6)', tex: 'S = \\frac{W\\,H\\,\\mathrm{dpi}^2\\,b}{8\\,(25.4\\ \\mathrm{mm})^2}',
      vars: {
        S: { name: 'raw file size (megabytes)', q: false, unit: 'MB', tex: 'S' },
        W: { name: 'width of the scanned area', q: 'length', unit: 'mm', value: 210, min: 1, max: 2000, tex: 'W' },
        H: { name: 'height of the scanned area', q: 'length', unit: 'mm', value: 297, min: 1, max: 2000, tex: 'H' },
        dpi: { name: 'resolution (dots per inch)', q: false, unit: 'dpi', value: 300, min: 10, max: 12800, tex: '\\mathrm{dpi}' },
        b: { name: 'bits per pixel (24 = three 8-bit colours)', value: 24, min: 1, max: 96, tex: 'b' }
      },
      solveFor: 'S',
      note: 'Uncompressed, in megabytes of 10⁶ bytes.'
    }
  ],
  examples: [
    {
      title: 'Enlarging a small print',
      q: 'A photograph 15 cm long is to be printed 45 cm long, and the enlargement is to carry 300 pixels to the inch. At what resolution must the print be scanned?',
      steps: [
        'The enlargement is 45 ÷ 15 = 3.',
        { text: 'Each inch of the original must supply 3 inches of the final print, with 300 pixels in each:', tex: '\\mathrm{dpi} = 3 \\times 300 = 900' },
        'A scanner of 1200 dpi optical resolution does this with a little to spare; one that is "1200 dpi interpolated from 600" does not.'
      ],
      a: '900 dpi, optical.'
    },
    {
      title: 'Reading the sensor of a scanner',
      q: 'A scanner has a line sensor of 5100 pixels of 7 µm pitch. It images a 216 mm wide platen across the whole sensor. What is its resolution along the line, and what magnification does the lens have?',
      steps: [
        { text: '216 mm is 8.50 in, so', tex: '\\mathrm{dpi} = \\frac{5100}{8.50\\ \\mathrm{in}} = 600' },
        { text: 'The spacing on the page is 42.3 µm and the sensor pitch is 7 µm:', tex: 'm = \\frac{7\\ \\mu\\mathrm{m}}{42.3\\ \\mu\\mathrm{m}} = 0.165' },
        'The sensor itself is 5100 × 7 µm = 35.7 mm long, a sixth of the line it reads.'
      ],
      a: '600 dpi, with a lens of magnification 0.165 (a reduction of about 6 times).'
    }
  ],
  quiz: [
    { q: 'A scan is repeated at 600 dpi instead of 300 dpi. What happens to the number of pixels and to the raw file size?', choices: ['both double', 'both quadruple', 'the pixels double and the file quadruples', 'neither changes: only the sharpness does'], a: 1, why: 'Pixels are added along both directions, so the count grows by 2 × 2 = 4, and the raw file grows with it.' },
    { q: 'A scanner box says "optical 600 dpi, interpolated 4800 dpi". A 4800 dpi scan from it shows more real detail than a 600 dpi scan.', a: false, why: 'Interpolation computes new pixels between the real samples. It makes the file bigger and the edges smoother, but it cannot create detail that was never recorded.' },
    { q: 'What supplies the second dimension of the picture in a flatbed scanner?', choices: ['a two-dimensional sensor', 'the stepper motor that moves the carriage', 'the lamp, which flashes', 'software, which fills in the lines'], a: 1, why: 'The sensor is a single row of pixels. The carriage moves it by one sample spacing per line, and the lines together make the picture.' },
    { q: 'What is the spacing of the samples on the page at 600 dpi, in micrometres?', answer: 42.33, unit: 'µm', why: '25.4 mm ÷ 600 = 0.04233 mm = 42.3 µm.' },
    { q: 'A thick book is laid open on the glass and the pages near the spine look blurred on the scan. Which scanner is most likely to behave worst?', choices: ['a reducing-lens CCD scanner', 'a contact-image-sensor scanner', 'both equally', 'neither: depth of focus has no effect'], a: 1, why: 'The rod-lens array of a CIS has a depth of focus of a fraction of a millimetre, so the part of a page lifted off the glass goes out of focus. A reducing lens keeps a few millimetres sharp.' }
  ],
  applications: [
    'Flatbed and multifunction machines in offices and homes, from text to photographs.',
    'Sheet-fed document scanners in archives and mail rooms, with two sensors that read both sides of a page in one pass at over a hundred pages a minute.',
    'Film and slide scanners, which need thousands of dpi: a 36 × 24 mm frame at 4000 dpi is 5669 × 3780 pixels, 21 megapixels.',
    'Large-format scanners for engineering drawings and maps, and overhead book scanners with a line camera over a cradle.',
    'Copiers, which scan the page and print it with a [[laser-printers|laser]] or LED printer.'
  ],
  history: 'Scanning a picture line by line is older than electronics: Alexander Bain patented a facsimile telegraph in 1843 in which a stylus swept over the message. The charge-coupled device, invented at Bell Laboratories in 1969 by Willard Boyle and George Smith (Nobel Prize in Physics 2009), gave the line sensors of fax machines and, later, of flatbed scanners that became household objects in the 1990s.',
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras and Displays* (JCD Publishing, 2nd ed.) — line sensors, sampling and the pixel aperture.',
    'ISO 16067-1, *Photography — Spatial resolution measurements of electronic scanners for photographic images — Part 1: Scanners for reflective media* — how scanner resolution is measured.',
    'E. Hecht, *Optics*, the chapters on the Fourier description of imaging — sampling and the MTF.'
  ],
  sim: 'ss-flatbed'
},

/* ================================================================ barcode scanners */
{
  id: 'barcode-scanners', parent: 'scanning-systems', title: 'Barcode scanners', level: 1,
  short: 'A laser barcode scanner sweeps a small red spot across the bars and watches the light scattered back: white spaces return a lot, black bars little. How far away a code can be read is set by how long the beam stays narrower than the narrowest bar.',
  keywords: ['barcode scanner', 'bar code', 'laser scanner', 'X-dimension', 'quiet zone', 'UPC', 'EAN', 'QR code', 'Data Matrix', 'linear imager', '2-D imager', 'depth of field', 'omnidirectional scanner', 'checkout scanner', 'print contrast', 'spot size'],
  prereq: ['the-gaussian-beam', 'galvanometer-scanners', 'polygon-scanners'],
  related: ['beam-waist-and-divergence', 'rayleigh-range', 'pixels-per-feature', 'laser-safety-classes', 'machine-vision-lighting', 'raster-and-vector-scanning', 'scanner-control-and-synchronisation'],
  body: `
A supermarket scanner reads a code in a few milliseconds and never forms a picture of it. In the classic **laser scanner** a red beam is swept across the bars and a photodiode watches the light that scatters back. White spaces return a lot, black bars little, and the wavering signal is a list of bar and space widths.

### The code
A linear bar code is a row of bars and spaces whose widths are whole multiples of the **X-dimension**, the width of the narrowest element. The retail UPC and EAN codes have a nominal X-dimension of 0.33 mm (13 mil, thousandths of an inch) and may be printed at 80 % to 200 % of it, that is 0.26 to 0.66 mm. A blank **quiet zone** on each side marks the ends.

### The laser scanner
- A **laser diode**, usually red at about 650 nm, is focused by a small lens to a **waist** at the working distance.
- A **moving mirror** sweeps the beam: a mirror on a small oscillating motor in a hand-held scanner; a spinning polygon and a set of pattern mirrors in a checkout slot scanner, which draws a star of crossing lines so that a code at any angle is cut by one of them ([[polygon-scanners]]). A hand-held scanner sweeps tens to about a hundred times a second, a checkout scanner thousands of lines a second.
- A **collecting** mirror or lens gathers the diffuse return on a photodiode behind a red filter that rejects room light. The signal is digitized into edge times, from which the decoder reads the widths.

If the beam sweeps 40° at 100 sweeps a second, it moves at about 21 m/s across a code 0.3 m away. A 0.33 mm element then lasts 16 µs, and the shortest bar-space pair makes a signal near 30 kHz.

### Depth of field comes from the beam
The spot must be about as small as the narrowest bar. A laser beam does not stay small ([[the-gaussian-beam|Gaussian beam]]): its radius grows from the waist radius $w_0$ as

$$w(z) = w_0\\sqrt{1 + \\left(\\frac{z}{z_R}\\right)^2}, \\qquad z_R = \\frac{\\pi w_0^2}{\\lambda}$$

and the **Rayleigh range** $z_R$ is the distance over which it grows by a factor $\\sqrt 2$ ([[rayleigh-range]]). The waist zone, $2z_R$, grows as $w_0^2$.

| waist radius | waist zone $2z_R$ (650 nm) | spot diameter at the ends of the zone |
|---|---|---|
| 0.10 mm | 97 mm | 0.28 mm |
| 0.15 mm | 217 mm | 0.42 mm |
| 0.20 mm | 387 mm | 0.57 mm |
| 0.30 mm | 870 mm | 0.85 mm |


### Cameras instead of beams
A **linear imager** has a single line sensor and a row of LEDs, with nothing moving, so it survives a fall. A **2-D imager** is a small camera with decoding software; it reads QR and Data Matrix codes, any orientation, from paper or a phone screen. It needs at least two pixels, comfortably three or four, across the smallest module ([[pixels-per-feature]]). Laser scanners reach farther and read through glare; imagers read what lasers cannot.

### Print quality
The scanner needs contrast at its own wavelength. Red ink looks white to a red scanner, so bars must be printed in a colour that is dark under red light. ISO/IEC 15416 grades the print from 4 (A) to 0 (F).

> [!warn] Scanners are low-power (typically Class 1 or 2, visible, under 1 mW), yet never stare into a laser beam or aim it at eyes ([[laser-safety-classes]]).

> [!key] A laser scanner turns a code into a time signal by sweeping a spot across it. The spot must stay about as small as the narrowest bar, so depth of field is the Rayleigh range of the beam: $z_R = \\pi w_0^2/\\lambda$, and it falls as the square of the spot size.
`,
  ideas: [
    'The scanner sweeps a small spot across the code and reads the scattered light as a signal in time.',
    'The narrowest bar (the X-dimension) sets how small the spot must be: about equal to it.',
    'The waist zone 2πw₀²/λ grows as the square of the waist: a smaller spot reads finer codes but over a shorter range.',
    'A checkout scanner uses a polygon and pattern mirrors to cross the code in many directions.',
    'Imagers replace the moving beam with a sensor; they read 2-D codes but need pixels across each module.'
  ],
  pitfalls: [
    'A bar-code scanner photographs the code and then reads it — A laser scanner never forms an image. It records a single signal in time as the spot crosses the bars.',
    'A thinner beam is always better — A smaller waist resolves finer bars but its beam spreads sooner. Halving the waist cuts the depth of the waist zone by four.',
    'Any colour bars will do — The scanner needs contrast at its own wavelength. Red bars on white are almost invisible to a red laser.',
    'A scanner can read a code from any distance if the code is large enough — The spot grows with distance, and larger X-dimensions help, but the signal also falls with distance and ambient light adds noise.'
  ],
  terms: [
    { term: 'X-dimension', also: ['module width', 'narrow bar width'], def: 'The width of the narrowest bar or space of a bar code. All other widths are whole multiples of it. Retail codes are nominally 0.33 mm.' },
    { term: 'Quiet zone', also: ['clear area'], def: 'The blank margin on each side of a bar code, which tells the scanner where the code starts and ends.' },
    { term: 'Waist zone', also: ['depth of field of the beam', '2zR'], def: 'The length of beam over which the spot radius stays within a factor √2 of its smallest value, twice the Rayleigh range.' },
    { term: 'Print contrast', also: ['PCS'], def: 'The difference between the reflectance of the spaces and the bars divided by that of the spaces, measured at the scanner\'s wavelength.' },
    { term: 'Linear imager', also: ['CCD scanner', 'line imager'], def: 'A bar-code reader with a line sensor and LED light and no moving parts; it images the whole code along one line at once.' },
    { term: '2-D imager', also: ['area imager', 'camera reader'], def: 'A bar-code reader built round an area sensor and decoding software, able to read stacked and matrix codes in any orientation.' }
  ],
  formulas: [
    {
      name: 'Spot radius at a distance from the waist',
      expr: 'w = w0*sqrt(1 + (z*lambda/(pi*w0^2))^2)', tex: 'w = w_0\\sqrt{1 + \\left(\\frac{z\\,\\lambda}{\\pi w_0^2}\\right)^2}',
      vars: {
        w: { name: 'spot radius (1/e²)', q: 'length', unit: 'mm', tex: 'w' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.15, min: 0.001, max: 5, tex: 'w_0' },
        z: { name: 'distance from the waist', q: 'length', unit: 'mm', value: 300, min: 0, max: 5000, tex: 'z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650, min: 200, max: 12000, tex: '\\lambda' }
      },
      solveFor: 'w',
      note: 'For a beam of M² = 1; a real diode has M² a little above 1, and the beam grows a little faster.',
      stories: { w: 'A scanner focuses its {lambda} beam to a waist of radius {w0}. What is the beam radius {z} from the waist?' }
    },
    {
      name: 'Length of the waist zone',
      expr: 'L = 2*pi*w0^2/lambda', tex: 'L = 2z_R = \\frac{2\\pi w_0^2}{\\lambda}',
      vars: {
        L: { name: 'waist zone (twice the Rayleigh range)', q: 'length', unit: 'mm', tex: 'L' },
        w0: { name: 'waist radius', q: 'length', unit: 'mm', value: 0.15, min: 0.001, max: 5, tex: 'w_0' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 650, min: 200, max: 12000, tex: '\\lambda' }
      },
      solveFor: 'L',
      note: 'The spot is within √2 of its smallest radius over this length.',
      stories: { L: 'A bar-code scanner has a waist radius of {w0} at {lambda}. Over how long a stretch of beam does the spot stay within a factor of √2 of its smallest radius?' }
    },
    {
      name: 'Highest signal frequency',
      expr: 'f = v/(2*X)', tex: 'f = \\frac{v}{2X}',
      vars: {
        f: { name: 'frequency of the narrowest bar–space pair', q: 'frequency', unit: 'kHz', tex: 'f' },
        v: { name: 'speed of the spot across the code', q: 'speed', unit: 'm/s', value: 20, min: 0.1, max: 200, tex: 'v' },
        X: { name: 'X-dimension', q: 'length', unit: 'mm', value: 0.33, min: 0.05, max: 5, tex: 'X' }
      },
      solveFor: 'f',
      note: 'A bar and a space of width X form one period 2X.'
    }
  ],
  examples: [
    {
      title: 'How far does the spot stay small?',
      q: 'A scanner has a red laser (650 nm) focused to a waist of radius 0.15 mm. Over what length of beam does the spot radius stay within a factor $\\sqrt2$ of 0.15 mm, and what is the spot diameter 400 mm from the waist?',
      steps: [
        { text: 'The Rayleigh range is', tex: 'z_R = \\frac{\\pi (0.15\\ \\mathrm{mm})^2}{650\\ \\mathrm{nm}} = 109\\ \\mathrm{mm}' },
        'The waist zone is twice that, 217 mm: from 109 mm in front of the waist to 109 mm behind it.',
        { text: 'At 400 mm the radius is', tex: 'w = 0.15\\sqrt{1 + (400/109)^2}\\ \\mathrm{mm} = 0.57\\ \\mathrm{mm}' },
        'The spot is 1.14 mm across, over three times the 0.33 mm bar of a retail code: such a code is far out of range.'
      ],
      a: 'The waist zone is 217 mm long; at 400 mm the spot is 1.14 mm across.'
    },
    {
      title: 'The speed of the signal',
      q: 'A spot crosses a code at 20 m/s and the narrowest element is 0.33 mm wide. How long does that element last, and what bandwidth must the amplifier have?',
      steps: [
        { text: 'The element lasts', tex: 't = \\frac{0.33\\ \\mathrm{mm}}{20\\ \\mathrm{m/s}} = 16.5\\ \\mu\\mathrm{s}' },
        { text: 'A bar and a space together take twice that, so the highest frequency is', tex: 'f = \\frac{1}{33\\ \\mu\\mathrm{s}} = 30\\ \\mathrm{kHz}' }
      ],
      a: '16.5 µs per element; an amplifier good to some tens of kilohertz.'
    }
  ],
  quiz: [
    { q: 'The waist radius of a scanner beam is made half as large. By what factor does the waist zone $2z_R$ change?', choices: ['it halves', 'it falls to a quarter', 'it doubles', 'it is unchanged'], a: 1, why: '$z_R = \\pi w_0^2/\\lambda$ goes as the square of the waist radius, so half the radius gives a quarter of the depth.' },
    { q: 'A bar code is printed in red ink on white paper and read with a 650 nm laser scanner. What is the likely result?', choices: ['it reads normally', 'it reads poorly, because red bars reflect red light like the paper', 'the beam is absorbed completely and the scanner is damaged', 'only the bar widths are measured wrongly, not the contrast'], a: 1, why: 'Red ink reflects red light, so bars and spaces scatter similar amounts. The scanner needs contrast at its own wavelength.' },
    { q: 'A laser scanner forms an image of the bar code on a sensor, then reads it.', a: false, why: 'It never forms an image: the photodiode gives one signal in time as the spot crosses the code, and the decoder reads the widths from it. A camera reader is the type that does form an image.' },
    { q: 'A spot crosses a code at 15 m/s. The narrowest element is 0.30 mm. What is the highest signal frequency in kilohertz?', answer: 25, unit: 'kHz', why: 'A bar and a space take 2 × 0.30 mm = 0.60 mm, which at 15 m/s lasts 40 µs: $f = 1/40\\ \\mu\\mathrm{s} = 25$ kHz.' },
    { q: 'Which reader copes with a QR code shown on a phone screen?', choices: ['a laser scanner with a mirror that sweeps one line', 'a 2-D imager', 'both equally', 'neither'], a: 1, why: 'A two-dimensional code needs a two-dimensional view, so it needs an area sensor and software, the 2-D imager. A single swept line cuts through only a strip of the pattern.' }
  ],
  applications: [
    'Retail checkouts, where polygon-and-mirror scanners read a code on any face of an item pulled across the glass.',
    'Hand-held scanners for warehouses and parcels, from a few centimetres to several metres.',
    'Industrial scanners on conveyor lines, with a long reading range and fast scan lines.',
    'Library, hospital and ticketing systems, with 1-D codes on wristbands and 2-D codes on tickets read by phone cameras.',
    'Direct-part marking on engine components, read by 2-D imagers with dedicated lighting ([[machine-vision-lighting]]).'
  ],
  history: 'The first bar code (a circular "bull\'s-eye") was patented by Norman Woodland and Bernard Silver in 1952. The first commercial retail scan of a UPC code, a pack of chewing gum, took place at a supermarket in Troy, Ohio, in June 1974, with a helium–neon laser scanner. Red laser diodes replaced the helium–neon tube a decade or so later, and the camera readers followed the cheap area sensors.',
  sources: [
    'GS1, *General Specifications* — the symbologies, dimensions and X-dimension ranges of retail bar codes.',
    'ISO/IEC 15416, *Bar code print quality test specification — Linear symbols* — the grades of print quality.',
    'A. E. Siegman, *Lasers* (University Science Books, 1986) — the chapters on Gaussian beams and their propagation.'
  ],
  sim: 'ss-barcode'
},

/* ================================================================ laser printers */
{
  id: 'laser-printers', parent: 'scanning-systems', title: 'The laser printer', level: 2,
  short: 'A laser printer writes the page as electric charge on a drum: a diode laser, switched on and off at tens of megahertz, is swept along the drum by a spinning polygon mirror and focused by an f-theta lens, while the drum turns to bring up the next line. Toner then follows the charge.',
  keywords: ['laser printer', 'polygon mirror', 'f-theta lens', 'photoconductor drum', 'start of scan', 'beam detect', 'LED printer', 'xerography', 'electrophotography', 'dpi', 'pixel clock', 'raster output scanner', 'ROS', 'toner', 'facet'],
  prereq: ['polygon-scanners', 'scan-lenses-and-f-theta', 'flatbed-and-document-scanners'],
  related: ['scanner-control-and-synchronisation', 'scan-distortion-and-correction', 'raster-and-vector-scanning', 'collimating-a-laser-diode', 'diode-lasers', 'resolvable-spots', 'laser-safety-classes'],
  body: `
A laser printer draws an invisible picture of the page in electric charge and then dusts it with toner. The laser part is an optical **scanner**: a spot of light swept across a rotating drum in a [[raster-and-vector-scanning|raster]], switched on and off for every dot, while the drum turns to bring up the next line.

### The chain, source to drum
1. A **laser diode**, usually near-infrared (about 780 nm) and a few milliwatts, is switched by the page data.
2. A **collimating lens** and an aperture make a beam a few millimetres across; a **cylindrical lens** focuses it in one direction only, onto the mirror facet.
3. A **polygon mirror**, a spinning prism of 4 to 8 mirrored facets, sweeps the beam. A mirror turning through an angle turns the reflected beam through twice that angle, so a facet of an $n$-sided polygon sweeps $720°/n$: 120° for six facets. The motor turns at tens of thousands of revolutions a minute ([[polygon-scanners]]).
4. An **f-theta lens** ([[scan-lenses-and-f-theta]]) focuses the beam to a spot of 50–60 µm on the drum and makes the spot move at a constant speed along it. Equal clock pulses then lay down equally spaced dots.
5. The **drum**, an organic photoconductor charged to a few hundred volts, loses charge where light falls. Toner sticks to one or the other of the areas, is transferred to the paper and fused by heat and pressure.
6. A **start-of-scan detector**, a photodiode at the edge of the scan, is struck once per facet. Its pulse starts the line's data clock, so every line begins at the same place whatever the facet or the speed of the motor.

### Numbers from the page
At 600 dpi the dots are 42.3 µm apart. A paper speed of 150 mm/s, about 30 A4 pages a minute, calls for

$$f_L = \\frac{v\\,\\mathrm{dpi}}{25.4\\ \\mathrm{mm}} = 3543\\ \\text{lines per second}$$

and a six-facet polygon must turn at $f_L/6 = 590.6$ revolutions a second, 35 433 rpm. A line of A4 holds 204 mm × 600 dpi = 4819 dots, but only a part of each facet's 120° sweep is usable, say 40 %. The data must then arrive at

$$f_p = \\frac{4819 \\times 3543}{0.4} \\approx 43\\ \\text{MHz}$$

At 1200 dpi lines come twice as often and dots twice as dense across, so the pixel clock rises fourfold, to about 170 MHz at this duty, unless the paper slows.

### What goes wrong
- **Facet tilt** (pyramidal error): if one facet is a fraction of a milliradian out of true, its lines fall out of place and the page shows *banding*. The cylindrical lens, which images the facet onto the drum in the cross-scan direction, cancels most of it.
- **Bow and jitter**: curved lines or wandering dots make wavy edges.

### Without a scanner
An **LED printer** has no polygon, no f-theta lens and no start-of-scan detector: a row of thousands of LEDs (about 5000 for 600 dpi over an A4 width) and a rod-lens array expose the drum a line at a time. It is compact and has little to wear out, but the LEDs must all be equally bright.

> [!warn] The product is Class 1 because the beam is enclosed, but inside there is a diode of some milliwatts of invisible infrared. Interlocks switch it off when the covers are opened. Do not defeat them, and leave the optical unit to service engineers ([[laser-safety-classes]]).

> [!key] The laser is fixed; the rotating polygon moves its beam along the drum and the f-theta lens makes the spot's speed constant. Lines per second $= v\\,\\mathrm{dpi}/25.4$ mm, and the polygon speed follows from the facet count.
`,
  ideas: [
    'The page is stored as charge on a drum; the laser scanner writes it one line at a time, and toner follows the charge.',
    'A polygon facet sweeps 720°/n, and the drum motion supplies the second dimension of the raster.',
    'Lines per second = paper speed × dpi ÷ 25.4 mm; polygon revolutions per second = lines per second ÷ facets.',
    'The start-of-scan detector synchronizes every line to the same starting point.',
    'The pixel clock runs at tens of megahertz and rises fourfold when the resolution doubles.'
  ],
  pitfalls: [
    'The laser prints on the paper — It writes on the photoconductor drum. The paper takes toner that was attracted to the charge pattern, and the heat of the fuser fixes it.',
    'The laser itself moves from side to side — The diode is fixed. A spinning polygon mirror turns the beam; each facet makes one sweep.',
    'Twice the dpi means twice the work — Lines come twice as often and each holds twice the dots, so the pixel clock is four times higher at the same speed.',
    'LED printers are laser printers with a different name — There is no laser and no scanning: a fixed row of LEDs exposes the whole line at once.'
  ],
  terms: [
    { term: 'Raster output scanner', also: ['ROS', 'laser scanning unit', 'LSU'], def: 'The optical unit of a laser printer: the diode, collimator, polygon mirror, f-theta lens and start-of-scan detector that together write one line of dots after another on the drum.' },
    { term: 'Latent image', also: ['electrostatic image'], def: 'The invisible pattern of charge the laser writes on the drum. Toner is attracted to the charged or to the discharged areas and so makes the pattern visible.' },
    { term: 'Start-of-scan detector', also: ['beam detect', 'BD', 'SOS'], def: 'A photodiode at the start of the scan line. The beam strikes it once per sweep, and the pulse synchronizes the data clock so each line starts at the same place.' },
    { term: 'Photoconductor drum', also: ['OPC drum', 'imaging drum'], def: 'A cylinder coated with a material that conducts when lit. It is charged evenly, then discharged in a pattern by the laser; toner sticks to the charged or the discharged areas.' },
    { term: 'Pixel clock', also: ['dot clock'], def: 'The rate, in megahertz, at which the laser is switched from dot to dot while its spot is in the active part of the scan line.' },
    { term: 'Pyramidal error', also: ['facet tilt', 'cross-scan error'], def: 'A tilt of one polygon facet out of true, which moves its scan line sideways on the drum and shows as bands on the page.' }
  ],
  formulas: [
    {
      name: 'Lines per second',
      expr: 'fl = v*dpi/0.0254', tex: 'f_L = \\frac{v\\,\\mathrm{dpi}}{25.4\\ \\mathrm{mm}}',
      vars: {
        fl: { name: 'scan lines per second', q: 'frequency', unit: 'Hz', tex: 'f_L' },
        v: { name: 'paper speed', q: 'speed', unit: 'mm/s', value: 150, min: 1, max: 2000, tex: 'v' },
        dpi: { name: 'resolution (dots per inch)', q: false, unit: 'dpi', value: 600, min: 10, max: 12800, tex: '\\mathrm{dpi}' }
      },
      solveFor: 'fl',
      note: 'One line per dot pitch of paper travel.',
      stories: { fl: 'Paper moves through a {dpi} printer at {v}. How many scan lines must the polygon sweep each second?' }
    },
    {
      name: 'Polygon speed',
      expr: 'fr = fl/n', tex: 'f_r = \\frac{f_L}{n}',
      vars: {
        fr: { name: 'polygon rotation speed', q: 'frequency', unit: 'rpm', tex: 'f_r' },
        fl: { name: 'scan lines per second', q: 'frequency', unit: 'Hz', value: 3543, tex: 'f_L' },
        n: { name: 'number of facets', value: 6, min: 3, max: 24, int: true, tex: 'n' }
      },
      solveFor: 'fr',
      note: 'Each facet makes one scan line per turn.'
    },
    {
      name: 'Pixel clock',
      expr: 'fp = N*fl/d', tex: 'f_p = \\frac{N\\,f_L}{d}',
      vars: {
        fp: { name: 'pixel clock', q: 'frequency', unit: 'MHz', tex: 'f_p' },
        N: { name: 'dots along the line', value: 4819, min: 1, max: 100000, tex: 'N' },
        fl: { name: 'scan lines per second', q: 'frequency', unit: 'Hz', value: 3543, tex: 'f_L' },
        d: { name: 'fraction of the sweep used for writing', value: 0.4, min: 0.05, max: 1, tex: 'd' }
      },
      solveFor: 'fp',
      note: 'The dots of a line must all be written in the active part of the facet time.'
    }
  ],
  examples: [
    {
      title: 'A 600 dpi engine',
      q: 'A printer moves A4 paper at 150 mm/s at 600 dpi. What polygon speed does a six-facet polygon need, and how long does the writing of one line take if 40 % of the facet time is used?',
      steps: [
        { text: 'The lines per second are', tex: 'f_L = \\frac{150 \\times 600}{25.4} = 3543' },
        { text: 'A six-facet polygon makes six lines a turn:', tex: 'f_r = \\frac{3543}{6} = 590.6\\ \\mathrm{rev/s} = 35\\,433\\ \\mathrm{rpm}' },
        'One line takes 1/3543 s = 282 µs; 40 % of it is 113 µs, in which 4819 dots are written, 23 ns each.'
      ],
      a: 'About 35 400 rpm; 113 µs of writing per line, a dot every 23 ns (a pixel clock of 43 MHz).'
    }
  ],
  quiz: [
    { q: 'A polygon with 8 facets turns at 30 000 rpm. How many scan lines does it sweep per second?', answer: 4000, unit: 'Hz', why: '30 000 rpm is 500 rev/s, and each revolution gives 8 lines: 4000 per second.' },
    { q: 'Through what optical angle does one facet of a hexagonal polygon sweep the beam?', choices: ['60°', '120°', '180°', '360°'], a: 1, why: 'A facet turns through 360° ÷ 6 = 60° of rotation, and the reflected beam turns twice as far, 120°.' },
    { q: 'Why does the printer need a start-of-scan detector?', choices: ['to measure the paper speed', 'so that every scan line starts at the same position', 'to switch the laser off when the toner runs out', 'to focus the beam'], a: 1, why: 'Each facet and each moment of the motor\'s speed ripple would otherwise start the line at a slightly different place. The pulse from the detector starts the data clock for every line.' },
    { q: 'At the same paper speed, the resolution of a laser printer is doubled from 600 to 1200 dpi. The pixel clock must rise by a factor of…', choices: ['2', '4', '8', 'it stays the same'], a: 1, why: 'There are twice as many lines per second and twice as many dots in each line: 2 × 2 = 4.' },
    { q: 'An LED printer has a polygon mirror and an f-theta lens.', a: false, why: 'An LED printer exposes the drum with a fixed row of LEDs and a rod-lens array, so nothing scans and nothing needs an f-theta lens.' }
  ],
  applications: [
    'Office and production laser printers and copiers, from 20 to over 100 pages a minute.',
    'Label and plate imaging in prepress, where the same type of scanner writes with higher resolution.',
    'Digital printing presses, with several scanners writing in step on separate drums for each toner colour.',
    'Photographic printers that expose paper with scanned red, green and blue lasers.'
  ],
  history: 'Chester Carlson made the first electrophotographic copy, the words "10-22-38 Astoria", in 1938; the process became the xerographic copier in 1959. Gary Starkweather, at Xerox in the late 1960s, replaced the copier\'s lamp by a modulated laser scanned by a polygon mirror. The result, in the 1970s, was the first laser printer.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning*, 2nd ed. (CRC Press) — polygon scanners and laser printer optics.',
    'L. B. Schein, *Electrophotography and Development Physics*, 2nd ed. (Springer) — charging, exposure and development of the drum.',
    'G. F. Marshall (ed.), *Laser Beam Scanning: Opto-Mechanical Devices, Systems, and Data Storage Optics* (Marcel Dekker, 1985).'
  ],
  sim: 'ss-printer'
},

/* ================================================================ laser marking and cutting heads */
{
  id: 'laser-marking-and-cutting-heads', parent: 'scanning-systems', title: 'Laser marking and cutting heads', level: 2,
  short: 'A marking head steers a focused laser spot over a fixed workpiece with two galvanometer mirrors and an f-theta lens; a cutting head carries the focusing lens on a gantry instead. The size of the field and the size of the spot are tied together by the beam diameter.',
  keywords: ['laser marking', 'laser engraving', 'galvo head', 'scan head', 'f-theta lens', 'marking field', 'spot size', 'laser cutting head', 'flying optics', 'nozzle', 'assist gas', 'remote welding', 'fibre laser', 'galvanometer', 'beam expander', 'focus shifter'],
  prereq: ['galvanometer-scanners', 'scan-lenses-and-f-theta', 'focusing-a-laser-beam', 'resolvable-spots'],
  related: ['laser-processing-systems', 'beam-expanders', 'rayleigh-range', 'fibre-lasers', 'laser-safety-classes', 'laser-eye-hazards-and-eyewear', 'scan-distortion-and-correction', 'scanner-control-and-synchronisation'],
  body: `
There are two ways to put a laser spot where it is wanted. Move the **workpiece** under a fixed spot, which is slow, or move the **beam**. A **marking head** moves the beam: two small mirrors on galvanometer motors steer it over a flat field in a fraction of a second, so a serial number, a data matrix or a logo is drawn on a stationary part. A **cutting head** keeps the beam fixed on its axis and moves the whole head on a gantry.

### The scan head
The beam path, from the laser:
1. A **beam expander** ([[beam-expanders]]) enlarges the beam to 5–15 mm: a larger beam gives a smaller spot.
2. Two **mirrors**, one for each direction, turn on perpendicular axes a few millimetres apart. A mirror turned by $\\alpha$ turns the beam by $2\\alpha$: ±10° of mirror is ±20° of beam.
3. An **f-theta lens** ([[scan-lenses-and-f-theta]]) focuses the beam on a flat field, the spot's distance from the centre being $f\\theta$ for a beam at angle $\\theta$. The lens sets the field: with $\\pm 20°$ of beam, $f = 100$ mm covers 70 mm square and $f = 420$ mm covers 293 mm.

### Field against spot
The focused spot has a diameter $d = 4\\lambda f M^2/(\\pi D)$ for a beam of diameter $D$ and quality $M^2$ ([[focusing-a-laser-beam]]). Take 1064 nm, $D = 10$ mm, $M^2 = 1$:

| lens $f$ | field (±20° beam) | spot diameter | depth of focus $2z_R$ |
|---|---|---|---|
| 100 mm | 70 mm | 13.5 µm | 0.27 mm |
| 160 mm | 112 mm | 21.7 µm | 0.69 mm |
| 254 mm | 177 mm | 34.4 µm | 1.7 mm |
| 420 mm | 293 mm | 56.9 µm | 4.8 mm |

The spot grows in proportion to the field, so the **number of resolvable spots**, $N = \\Theta D/(1.27\\lambda)$, is the same whatever the lens: about 5200 at 1064 nm, 40° and 10 mm ([[resolvable-spots]]). More spots need a larger beam or a wider scan. The wavelength matters as much: for $f = 160$ mm, $D = 10$ mm and $M^2 = 1.2$ the spot is 8.7 µm at 355 nm, 13 µm at 532 nm, 26 µm at 1064 nm and 259 µm at 10.6 µm (CO₂).

### Marking with pulses
The laser is pulsed at tens or hundreds of kilohertz, and each pulse marks a dot. At a scan speed $v$ and pulse rate $f_r$ the dots are $v/f_r$ apart: 40 µm at 2 m/s and 50 kHz, which would leave a row of separate 22 µm dots. Overlapping dots need a spacing under half the spot, so 150 kHz or more. Marks come from annealing, ablation, engraving or foaming of plastic.

### Cutting and welding heads
A **cutting head** collimates the beam and focuses it with a lens (typically 100–200 mm) through a **nozzle** that blows an **assist gas** into the cut: oxygen, which burns the steel and adds heat; nitrogen, which blows the melt out clean; or air. The head moves on a gantry (**flying optics**), and a fibre laser of a few kilowatts cuts thin sheet steel at tens of metres a minute. A galvo head can also cut and weld thin parts "remotely", from several hundred millimetres away, faster than a gantry could.

> [!warn] Marking and cutting lasers are Class 4: beams and even diffuse reflections can injure eyes and skin and start fires, and the fumes are hazardous. They run in enclosures with interlocks and fume extraction, and anyone near an open beam wears eyewear of the right optical density ([[laser-eye-hazards-and-eyewear]]). Never defeat an interlock ([[laser-safety-classes]]).

> [!key] Two galvo mirrors and an f-theta lens put the spot at $f\\theta$ on a flat field. The spot is $4\\lambda f M^2/(\\pi D)$ and the field $2f\\theta$, so the number of spots across a field depends only on the beam diameter and the scan angle.
`,
  ideas: [
    'Two perpendicular galvo mirrors and an f-theta lens steer the spot over a flat field with no moving workpiece.',
    'A mirror turns the beam by twice its own angle; field = 2 f θ for a beam scan of ±θ.',
    'Spot diameter = 4λf M²/(πD): short wavelength, short lens, wide beam and good beam quality all shrink it.',
    'The number of resolvable spots depends on the scan angle and beam diameter, not on the focal length: a larger field means larger spots.',
    'Dots of a pulsed laser are v/f_r apart; marks need the dots to overlap. Cutting heads instead focus a fixed beam and blow an assist gas through a nozzle.'
  ],
  pitfalls: [
    'A longer f-theta lens gives a bigger field with the same quality of mark — The spot grows in proportion to the focal length too, so the number of resolvable spots is unchanged and the detail is coarser.',
    'The focus is a plane, so the height of the part does not matter — The depth of focus is a fraction of a millimetre to a few millimetres, shorter for a smaller spot. A part must lie in the focal plane.',
    'All laser marking is engraving — Marks are made in several ways: annealing (colour change under the surface), ablation of a coating, engraving, and foaming or carbonizing of plastics.',
    'A bigger laser power gives a smaller spot — The spot depends on the wavelength, beam diameter, focal length and beam quality. Power sets how quickly the material responds.'
  ],
  terms: [
    { term: 'Scan head', also: ['galvo head', 'galvanometer scan head', 'marking head'], def: 'The assembly of two galvanometer mirrors, their drivers and an f-theta lens that steers a laser spot over a flat marking field.' },
    { term: 'Marking field', also: ['scan field', 'work area'], def: 'The flat area over which the head can place the spot. It equals twice the focal length times the beam half-angle, for example 112 mm square for f = 160 mm and ±20°.' },
    { term: 'Focused spot size', also: ['spot diameter', 'focus diameter'], def: 'The diameter of the beam at the focus: 4λfM²/(πD) for a Gaussian beam of diameter D at a lens of focal length f. It sets the finest line a head can mark.' },
    { term: 'Pulse overlap', also: ['dot spacing'], def: 'The fraction by which neighbouring pulses of a scanned laser overlap on the surface. It depends on the spot size, the scan speed and the pulse rate.' },
    { term: 'Flying optics', def: 'A cutting arrangement in which the focusing head, carrying only a lens and a nozzle, is moved over the sheet on a gantry while the beam is fed to it by fibre or mirrors.' },
    { term: 'Assist gas', def: 'Gas, usually oxygen, nitrogen or air, blown through the nozzle of a cutting head along the beam. It adds heat by burning the metal, or blows out the melt, and protects the lens.' }
  ],
  formulas: [
    {
      name: 'Focused spot diameter',
      expr: 'd = 4*lambda*f*Msq/(pi*D)', tex: 'd = \\frac{4\\lambda f M^2}{\\pi D}',
      vars: {
        d: { name: 'spot diameter at the focus', q: 'length', unit: 'µm', tex: 'd' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, min: 200, max: 12000, tex: '\\lambda' },
        f: { name: 'focal length of the f-theta lens', q: 'length', unit: 'mm', value: 160, min: 20, max: 1000, tex: 'f' },
        Msq: { name: 'beam quality M²', value: 1.2, min: 1, max: 30, tex: 'M^2' },
        D: { name: 'beam diameter at the lens (1/e²)', q: 'length', unit: 'mm', value: 10, min: 1, max: 40, tex: 'D' }
      },
      solveFor: 'd',
      note: 'The 1/e² diameter of the focus of a Gaussian beam, in the paraxial approximation.',
      stories: { d: 'A head focuses a {lambda} beam of {D} diameter and M² = {Msq} with an f-theta lens of {f}. What is the spot diameter?' }
    },
    {
      name: 'Marking field',
      expr: 'W = 2*f*theta', tex: 'W = 2 f \\theta',
      vars: {
        W: { name: 'width of the field', q: 'length', unit: 'mm', tex: 'W' },
        f: { name: 'focal length of the f-theta lens', q: 'length', unit: 'mm', value: 160, min: 20, max: 1000, tex: 'f' },
        theta: { name: 'half-angle of the beam scan (twice the mirror angle)', q: 'angle', unit: '°', value: 20, min: 1, max: 45, tex: '\\theta' }
      },
      solveFor: 'W',
      note: 'An f-theta lens puts the spot at f·θ from the centre.',
      stories: { W: 'Galvo mirrors that swing ±10° turn the beam by ±20°. What field does an f-theta lens of {f} cover when the beam turns by ±{theta}?' }
    },
    {
      name: 'Resolvable spots along the scan',
      expr: 'N = Th*D/(1.27*lambda)', tex: 'N = \\frac{\\Theta D}{1.27\\lambda}',
      vars: {
        N: { name: 'resolvable spots', tex: 'N' },
        Th: { name: 'full optical scan angle', q: 'angle', unit: '°', value: 40, min: 1, max: 90, tex: '\\Theta' },
        D: { name: 'beam diameter at the scanner (1/e²)', q: 'length', unit: 'mm', value: 10, min: 1, max: 40, tex: 'D' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, min: 200, max: 12000, tex: '\\lambda' }
      },
      solveFor: 'N',
      note: 'For a Gaussian beam of quality M² = 1; divide by M² for a real beam.'
    },
    {
      name: 'Spacing of pulses on the work',
      expr: 'ds = v/fr', tex: 's = \\frac{v}{f_r}',
      vars: {
        ds: { name: 'spacing of successive pulses', q: 'length', unit: 'µm', tex: 's' },
        v: { name: 'speed of the spot over the work', q: 'speed', unit: 'm/s', value: 2, min: 0.01, max: 50, tex: 'v' },
        fr: { name: 'pulse repetition rate', q: 'frequency', unit: 'kHz', value: 50, min: 0.1, max: 5000, tex: 'f_r' }
      },
      solveFor: 'ds',
      note: 'Overlapping pulses need a spacing below the spot diameter, and a continuous-looking line below about half of it.'
    }
  ],
  examples: [
    {
      title: 'A head for a 100 mm field',
      q: 'A fibre laser (1064 nm, $M^2 = 1.2$) is expanded to 10 mm and fed to a scan head whose beam swings ±20°. What f-theta focal length gives a field of 100 mm, and what spot does it make?',
      steps: [
        { text: 'The field is $2f\\theta$ with $\\theta = 20° = 0.349$ rad:', tex: 'f = \\frac{W}{2\\theta} = \\frac{100\\ \\mathrm{mm}}{0.698} = 143\\ \\mathrm{mm}' },
        { text: 'The spot is', tex: 'd = \\frac{4\\,(1064\\ \\mathrm{nm})(143\\ \\mathrm{mm})(1.2)}{\\pi\\,(10\\ \\mathrm{mm})} = 23\\ \\mu\\mathrm{m}' },
        'The next standard lens, 160 mm, gives 112 mm and 26 µm.'
      ],
      a: 'About 143 mm (a 160 mm lens in practice); the spot is about 23 µm.'
    },
    {
      title: 'Dots or a line?',
      q: 'A head marks at 2 m/s with a spot of 26 µm. What pulse rate makes neighbouring pulses overlap by half a spot?',
      steps: [
        { text: 'Half overlap means a spacing of 13 µm:', tex: 'f_r = \\frac{v}{s} = \\frac{2\\ \\mathrm{m/s}}{13\\ \\mu\\mathrm{m}} = 154\\ \\mathrm{kHz}' }
      ],
      a: 'About 150 kHz. At 50 kHz the dots would be 40 µm apart, a row of separate marks.'
    }
  ],
  quiz: [
    { q: 'A galvo mirror is turned by 8°. Through what angle is the beam deflected?', answer: 16, unit: '°', why: 'A mirror turned by α turns the reflected beam by 2α: 16°.' },
    { q: 'A longer f-theta lens is fitted to the same scan head and the same beam. What happens?', choices: ['a larger field and a larger spot, in proportion', 'a larger field and the same spot', 'the same field and a smaller spot', 'a smaller field and a larger spot'], a: 0, why: 'The field is 2fθ and the spot is 4λfM²/(πD): both grow with f, so the number of resolvable spots is unchanged.' },
    { q: 'Which change makes the focused spot of a marking head smaller?', choices: ['a wider beam at the lens', 'a longer wavelength', 'a longer focal length', 'a higher M²'], a: 0, why: 'The spot diameter goes as λfM²/D. A wider beam (or a shorter wavelength, shorter lens, better beam) gives a smaller spot.' },
    { q: 'A pulsed laser at 100 kHz marks at 5 m/s. How far apart are the pulses, in micrometres?', answer: 50, unit: 'µm', why: 'Spacing = v/f_r = 5 m/s ÷ 100 000 s⁻¹ = 50 µm.' },
    { q: 'The 10.6 µm beam of a CO₂ laser is focused by the same lens and beam as a 1064 nm laser. Compared with the 1064 nm spot it is…', choices: ['about ten times larger', 'about ten times smaller', 'the same', 'about three times larger'], a: 0, why: 'The spot is proportional to the wavelength: 10.6 µm ÷ 1.064 µm ≈ 10. That is why CO₂ marking is for coarser detail.' }
  ],
  applications: [
    'Serial numbers, data matrix codes and logos on metal and plastic parts, from engine components to medical instruments.',
    'Annealed marks on stainless steel and titanium that leave the surface smooth, as on surgical tools.',
    'Cutting of sheet metal with fibre lasers on gantry cutters, and of thin films and foils with galvo heads.',
    'Remote welding of car body parts, with the beam steered over the seam from a distance.',
    'Scribing of solar cells and depaneling of circuit boards, and engraving in glass and crystal.'
  ],
  history: 'The first industrial use of a laser, in 1965, was drilling the holes of diamond dies for drawing wire. Carbon-dioxide lasers with an oxygen jet were cutting steel by the late 1960s, and lamp-pumped Nd:YAG lasers with scanning mirrors began marking parts in the 1970s. Fibre lasers, with beams good enough to focus to a few tens of micrometres, took over the marking and thin-sheet cutting markets from the 2000s.',
  sources: [
    'W. M. Steen and J. Mazumder, *Laser Material Processing*, 4th ed. (Springer, 2010) — marking, cutting and welding with lasers.',
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning*, 2nd ed. (CRC Press) — galvanometer scan heads and f-theta lenses.',
    'ISO 11553-1, *Safety of machinery — Laser processing machines — Part 1: General safety requirements*, and IEC 60825-1 — the safety standards behind the enclosures.'
  ],
  sim: 'ss-marking'
},

/* ================================================================ laser projection and displays */
{
  id: 'laser-projection-and-displays', parent: 'scanning-systems', title: 'Laser projection and scanned displays', level: 2,
  short: 'A laser show draws outlines with two fast mirrors (vector scanning), a pico-projector paints a frame line by line with one tiny resonant mirror (raster scanning). In both the beams are focus-free and the colours pure; the limits are points per second and lines per frame, and for audiences, safety.',
  keywords: ['laser show', 'laser projector', 'vector scanning', 'raster scanning', 'MEMS projector', 'pico projector', 'scanning mirror', 'kpps', 'points per second', 'ILDA', 'Lissajous', 'laser beam steering display', 'speckle', 'focus-free', 'audience scanning'],
  prereq: ['raster-and-vector-scanning', 'galvanometer-scanners', 'resonant-and-mems-scanners'],
  related: ['the-data-projector', 'speckle', 'flicker-and-persistence-of-vision', 'the-luminosity-function', 'laser-safety-classes', 'holographic-optical-elements', 'virtual-and-augmented-reality-headsets', 'diode-lasers'],
  body: `
Most projectors make the whole frame at once on a panel of pixels and enlarge it. A **scanning projector** has no panel: it has a few laser beams (red, green and blue, mixed into one) and a mirror that moves the beam, while the laser is brightened and dimmed so that the picture is drawn in time. The eye adds up the light into a picture, because it holds an image for a tenth of a second or so ([[flicker-and-persistence-of-vision]]). Micromirror (DLP) projectors are *not* scanners ([[the-data-projector]]).

### Vector: the laser show
Two galvanometer mirrors steer the beams along the **outlines** of the figure: circles, lines, letters, beam patterns in the air with haze. The scanner is rated in **points per second** (kpps). The figure has to be redrawn faster than the eye's flicker rate, about 30 to 50 times a second, so the number of points a drawing may have is

$$N_{\\text{frame}} = \\frac{\\text{kpps} \\times 1000}{\\text{frame rate}}$$

A 30 kpps scanner at 30 frames a second has 1000 points a frame; at 60 frames only 500. A more complicated figure must be refreshed more slowly and flickers, or be simplified. The mirrors cannot turn corners instantly, so extra points are put in the corners, and the beam is *blanked* while jumping between shapes. Power is shared along the path, so a long drawing is dimmer than a short one.

### Raster: the pico-projector
One **MEMS mirror**, a millimetre or two across, swings back and forth on its fast axis at a resonance, 15 to 30 kHz, and tilts slowly on the other axis once per frame. Drawing on the way out and on the way back, $2f_\\text{res}$ lines are made a second. For $f_\\text{res} = 18$ kHz and 60 frames a second that is 600 lines to a frame; 720 lines need 21.6 kHz. A frame of 1280 × 720 at 60 Hz needs 55 million pixels a second, and the laser must be switched at tens of megahertz.

### The sinusoid
A resonant mirror does not sweep at a steady speed. Its position is $x = A\\sin(2\\pi f t)$: fastest in the middle, stopping at the ends. If only the central ±80 % of the swing is used, the beam writes during 59 % of the time and moves at 60 % of its top speed at the edges, so pixels would crowd there unless the pixel clock follows the mirror. Using ±90 % gives 71 % duty and a speed of 44 % at the edge.

### Why use lasers at all
- **Focus-free**: a laser beam stays narrow, so the picture is sharp at any distance; no lens needs focusing.
- **Colour**: laser lines are pure, so the gamut is wide.
- **Brightness for the power**: the eye is most sensitive to green. A watt of 532 nm light is about 600 lumens, while a watt of 445 nm blue is about 20 lm and of 638 nm red about 130 lm.
- **Speckle**: coherent light on a rough screen makes a grain of bright and dark specks ([[speckle]]) that is cured by moving the screen or the beam, or by widening the spectrum.

> [!warn] A scanned beam is brighter than it looks. When a mirror stops, the whole beam falls on one spot. Public shows are regulated: audience scanning needs a safety analysis against the exposure limits, scan-failure detection that shuts the beams off, and approval by the authorities; and a laser must never be aimed at aircraft, vehicles or people ([[laser-safety-classes]]).

> [!key] Vector scanning traces outlines and is limited by points per second, $N = \\text{kpps}/\\text{fps}$; raster scanning with a resonant mirror writes $2f_\\text{res}$ lines a second and its sinusoidal motion wastes part of each line.
`,
  ideas: [
    'A scanning projector moves a few laser beams with mirrors; the eye adds the light into a picture.',
    'Vector scanning draws outlines; its limit is points per second, shared between frames per second and points per frame.',
    'Raster scanning with a resonant MEMS mirror makes 2 f_res lines a second, and so f_res × 2 / frame rate lines per frame.',
    'A resonant mirror moves sinusoidally, so part of each line is unused and the pixel clock has to follow the speed.',
    'Laser beams are focus-free and pure in colour, but speckle and eye safety, especially when a scanned beam stops, need care.'
  ],
  pitfalls: [
    'A laser projector is a normal projector with a laser light source — Only scanning projectors steer a beam. A DLP projector with a laser light source still forms its picture on a micromirror panel.',
    'More kpps always gives a better show — Points per second shared between frames: at a fixed number of points the figure can be more complicated, or refreshed more often, but not both.',
    'A scanned laser beam is safe because it moves — The movement lowers the exposure at the eye, but if the scanner fails the full beam stays on one spot. Shows therefore need failure detection.',
    'A resonant mirror writes pixels evenly — Its speed changes sinusoidally, so the pixel clock must vary with position or the pixels bunch at the edges of the picture.'
  ],
  terms: [
    { term: 'Points per second', also: ['kpps', 'pps'], def: 'The rating of a galvanometer scanner for laser shows: the number of points on a drawing it can place a second, quoted for a stated scan angle.' },
    { term: 'Pico-projector', also: ['MEMS projector', 'scanned laser projector'], def: 'A very small projector in which one MEMS mirror sweeps red, green and blue laser beams over the picture. It needs no focusing lens, because laser beams stay narrow.' },
    { term: 'Blanking', def: 'Switching a laser beam off while the scanner moves between parts of a drawing, so that the jump does not show.' },
    { term: 'Audience scanning', def: 'Directing laser beams, usually moving, into the area where the public is. It is regulated and needs a documented analysis that exposure limits are not exceeded.' }
  ],
  formulas: [
    {
      name: 'Points in one frame of a laser show',
      expr: 'Np = kp*1000/fps', tex: 'N = \\frac{1000\\,\\mathrm{kpps}}{\\mathrm{fps}}',
      vars: {
        Np: { name: 'points per frame', tex: 'N' },
        kp: { name: 'scanner rating (thousand points per second)', q: false, unit: 'kpps', value: 30, min: 1, max: 100, tex: '\\mathrm{kpps}' },
        fps: { name: 'frame rate', q: false, unit: 'fps', value: 30, min: 1, max: 200, tex: '\\mathrm{fps}' }
      },
      solveFor: 'Np',
      note: 'To keep a figure from flickering, the frame rate should stay above about 30 to 50 a second.',
      stories: { Np: 'A scanner is rated at {kp}. How many points can one frame hold at {fps}?' }
    },
    {
      name: 'Lines per frame, resonant raster scanner',
      expr: 'Nl = 2*fres/fps', tex: 'N_\\ell = \\frac{2 f_\\mathrm{res}}{\\mathrm{fps}}',
      vars: {
        Nl: { name: 'lines per frame', tex: 'N_\\ell' },
        fres: { name: 'resonant frequency of the fast axis', q: 'frequency', unit: 'kHz', value: 18, min: 1, max: 60, tex: 'f_\\mathrm{res}' },
        fps: { name: 'frame rate', q: false, unit: 'fps', value: 60, min: 1, max: 200, tex: '\\mathrm{fps}' }
      },
      solveFor: 'Nl',
      note: 'The mirror writes on both its outward and its return swing: two lines per cycle.'
    },
    {
      name: 'Share of the time a sinusoidal mirror writes',
      expr: 'd = 2*asin(a)/pi', tex: 'd = \\frac{2}{\\pi}\\arcsin a',
      vars: {
        d: { name: 'fraction of the time spent writing', tex: 'd' },
        a: { name: 'fraction of the amplitude used', value: 0.8, min: 0.05, max: 1, tex: 'a' }
      },
      solveFor: 'd',
      note: 'The position is A sin(2πft): the mirror spends longer near the ends of its swing.'
    }
  ],
  examples: [
    {
      title: 'An HD pico-projector',
      q: 'A scanning projector shows 1280 × 720 pixels at 60 frames a second, writing on both swings of a resonant mirror. What resonant frequency does the mirror need, and what is the average pixel rate?',
      steps: [
        { text: 'There are 720 lines per frame, and two lines per cycle:', tex: 'f_\\mathrm{res} = \\frac{720 \\times 60}{2} = 21.6\\ \\mathrm{kHz}' },
        { text: 'The pixel rate is', tex: '1280 \\times 720 \\times 60 = 55.3\\ \\text{million per second}' },
        'If only 59 % of each swing (the central ±80 %) is used for pixels, the laser is modulated at 55.3 ÷ 0.59 = 94 MHz while it writes.'
      ],
      a: '21.6 kHz; 55 million pixels a second, written at about 94 MHz.'
    }
  ],
  quiz: [
    { q: 'A laser show scanner is rated at 40 kpps. How many points can a frame hold if it is refreshed 50 times a second?', answer: 800, why: '40 000 points a second ÷ 50 frames a second = 800 points a frame.' },
    { q: 'A resonant mirror at 12 kHz writes on both swings. How many lines does it draw per second?', answer: 24000, unit: 'Hz', why: 'Two lines per cycle: 2 × 12 000 = 24 000 lines a second.' },
    { q: 'A drawing needs more points than the scanner provides in one frame at 30 frames a second. What is the likely result?', choices: ['it flickers, because it is refreshed more slowly', 'it gets brighter', 'it is drawn upside down', 'nothing: the mirror simply moves faster'], a: 0, why: 'Points per second are fixed by the mirrors, so more points per frame mean fewer frames per second and the figure flickers below about 30 to 50.' },
    { q: 'Why can a DLP projector with a laser light source not be called a scanning projector?', choices: ['its laser is too weak', 'it forms the picture on a panel of micromirrors and no beam is scanned', 'it uses a lamp as well', 'it has no mirrors at all'], a: 1, why: 'A DLP projector shapes a whole frame with its micromirror array. A scanning projector draws the picture in time with one moving beam.' },
    { q: 'Because a scanned laser beam is moving, it is always safe for the audience.', a: false, why: 'The motion lowers the exposure of an eye, but a failure that stops the mirror leaves the whole beam on one spot. Audience scanning needs an analysis and failure detection.' }
  ],
  applications: [
    'Laser shows and planetarium displays, with beams in haze or outlines on a dome.',
    'Pico-projectors in phones, small projectors and head-up displays, where the focus-free beam suits a curved or near surface.',
    'Retinal-scanning and see-through displays in smart glasses ([[virtual-and-augmented-reality-headsets]]).',
    'Laser TV and cinema projection with scanned red, green and blue lines.',
    'Light shows on buildings, architectural lighting, and signage drawn in air.'
  ],
  history: 'The first laser light shows, in the late 1960s and early 1970s, steered beams with mirrors on loudspeaker coils and galvanometers, and audience safety rules took shape as the shows grew. Laser video displays were demonstrated in the 1960s, but only silicon micro-mirrors and cheap blue and green laser diodes, around 2010, made small scanned projectors practical.',
  sources: [
    'K. V. Chellappan, E. Erden and H. Urey, "Laser-based displays: a review", *Applied Optics* 49 (2010) F79–F98.',
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning*, 2nd ed. (CRC Press) — raster and vector scanning, resonant scanners.',
    'IEC 60825-1, *Safety of laser products* — exposure limits that audience scanning is measured against.'
  ],
  sim: 'ss-projection'
},

/* ================================================================ laser-scanning microscopes */
{
  id: 'laser-scanning-microscopes', parent: 'scanning-systems', title: 'Laser-scanning microscopes', level: 3,
  short: 'A laser-scanning (confocal) microscope focuses a laser to one diffraction-limited spot, sweeps it over the specimen with two mirrors and lets the returning light pass a pinhole conjugate to the focus. The pinhole rejects light from other planes, so the picture is a thin optical section.',
  keywords: ['confocal microscope', 'laser scanning microscope', 'LSM', 'pinhole', 'optical section', 'Airy unit', 'galvo scanning', 'resonant scanner', 'pixel dwell time', 'axial resolution', 'z-stack', 'fluorescence', 'descanned', 'photomultiplier', 'spinning disk'],
  prereq: ['fluorescence-and-confocal-microscopy', 'numerical-aperture', 'galvanometer-scanners', 'the-airy-disk'],
  related: ['the-compound-microscope', 'microscope-objectives', 'resonant-and-mems-scanners', 'resolvable-spots', 'optical-profilers', 'laser-safety-classes', 'raster-and-vector-scanning', 'light-sheets'],
  body: `
A widefield microscope ([[the-compound-microscope]]) shows everything at once, in focus or not. In a thick specimen the out-of-focus parts add a haze over the plane of interest. A **laser-scanning microscope** ([[fluorescence-and-confocal-microscopy|confocal]]) makes its picture one point at a time and uses a pinhole to throw the haze away. What is left is a thin **optical section** of the specimen, and a stack of sections is a three-dimensional image.

### The path of the light
1. A **laser** (lines such as 405, 488, 561 and 640 nm) is focused by the objective to a diffraction-limited spot in the specimen.
2. Two **scan mirrors**, galvanometer or resonant, tilt the beam in the objective's pupil so that the spot moves across the specimen in a raster ([[raster-and-vector-scanning]]).
3. The light from the spot (fluorescence) comes back through the objective and **the same mirrors**, so that it is "descanned" and sits still again.
4. A **dichroic mirror** separates it from the laser light, and a **lens** focuses it on a **pinhole**, conjugate to the focus in the specimen.
5. A **detector** behind the pinhole, usually a photomultiplier (PMT), records one number per spot. The computer places it at the pixel the mirrors were pointing to.

### What the pinhole does
Light from the focal point comes to a focus in the pinhole and passes. Light from a plane above or below arrives as a blur disc larger than the pinhole, and most of it is stopped. The size is given in **Airy units**: 1 AU is the diameter of the [[the-airy-disk|Airy disc]] as seen in the specimen, $1.22\\lambda/\\mathrm{NA}$, 453 nm for 520 nm light and an objective of NA 1.4. A pinhole of 1 AU is the usual compromise; opening it passes more light and thickens the section, closing it sharpens the section and costs signal.

### Resolution
With a pinhole of an Airy unit or less the lateral resolution beats the widefield $\\lambda/(2\\mathrm{NA})$ (186 nm at NA 1.4 and 520 nm) by up to a factor of about 1.4. The **axial** resolution, the thickness of the section, is roughly

$$\\Delta z \\approx \\frac{1.4\\,\\lambda\\,n}{\\mathrm{NA}^2}$$

| objective | NA | immersion index $n$ | section thickness at 520 nm |
|---|---|---|---|
| 40× air | 0.75 | 1.00 | 1.3 µm |
| 63× water | 1.20 | 1.33 | 0.67 µm |
| 63× oil | 1.40 | 1.52 | 0.56 µm |

### Speed
A galvanometer mirror makes a 512 × 512 frame in about a second: 3 µs a pixel (at 80 % duty). A **resonant** mirror at 8 kHz writes 16 000 lines a second, 31 frames a second at 512 lines, 85 ns a pixel. Short dwell times mean few photons, so fast images are noisy and are averaged. Pixels must sample the resolution at least twice: 512 pixels across 50 µm are 98 nm each.

### The price
The excitation light crosses the planes above and below the focus, which fade (**bleach**) and can be damaged although the pinhole hides their light. That is one reason for multiphoton and light-sheet microscopes, and for the **spinning-disk** confocal, where thousands of pinholes scan together and a camera replaces the PMT.

> [!warn] The laser is Class 3B or 4 inside an enclosed, interlocked instrument. Never look at laser light through the eyepieces unless the maker's procedure allows it.

> [!key] A confocal microscope scans a focused laser spot and detects through a pinhole conjugate to it. The section thickness is about $1.4\\lambda n/\\mathrm{NA}^2$, always thicker than the lateral resolution $\\lambda/(2\\mathrm{NA})$; scanning speed is a trade against signal.
`,
  ideas: [
    'The picture is made point by point: a focused laser spot, scanning mirrors, a pinhole and a single detector.',
    'The pinhole, conjugate to the focus, blocks light from other planes and so makes an optical section.',
    'Pinhole size is given in Airy units, 1.22 λ/NA in the specimen; 1 AU is the usual compromise between section thickness and signal.',
    'Axial resolution is about 1.4 λn/NA², so the section is always thicker than the lateral resolution λ/(2NA).',
    'Galvo scanning takes about a second per frame, a resonant mirror 30 frames a second; fast scans have less time per pixel and so more noise.'
  ],
  pitfalls: [
    'Confocal microscopy gives much better lateral resolution than widefield — The gain is at most a factor of about 1.4, and only with a pinhole so small that most of the signal is lost. The main gain is the optical sectioning.',
    'A smaller pinhole is always better — It makes a thinner section and costs signal quickly; below about 0.5 Airy units the gain is small and the image is noisy.',
    'The pinhole protects the specimen from the laser — It only blocks the light that returns. The excitation passes through the whole cone, and bleaching and damage still occur above and below the focal plane.',
    'The section is as thin as the lateral resolution — The axial resolution goes as 1/NA² and is two to three times worse than the lateral resolution, even for the best objectives.'
  ],
  terms: [
    { term: 'Confocal pinhole', also: ['detection pinhole'], def: 'A small aperture in front of the detector, conjugate to the focal spot in the specimen. It passes light from the focus and blocks most light from other depths.' },
    { term: 'Airy unit', also: ['AU'], def: 'The diameter of the Airy disc in the specimen, 1.22 λ divided by the numerical aperture. Pinhole sizes are given in Airy units; 1 AU is the usual setting.' },
    { term: 'Optical section', also: ['optical sectioning', 'z-section'], def: 'A picture of a thin layer of a thick specimen, made by rejecting light from above and below the focal plane. A series of them is a z-stack.' },
    { term: 'Pixel dwell time', also: ['dwell time'], def: 'The time the scanned spot spends on one pixel: about 3 µs for a galvo scan of one frame a second, under 100 ns for a resonant scan.' },
    { term: 'Descanned detection', def: 'Detection in which the returning light passes back through the scanning mirrors, so that it is stationary when it reaches the pinhole and the detector.' }
  ],
  formulas: [
    {
      name: 'Axial resolution (section thickness)',
      expr: 'dz = 1.4*lambda*n/NA^2', tex: '\\Delta z = \\frac{1.4\\,\\lambda\\,n}{\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'axial resolution', q: 'length', unit: 'nm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 520, min: 200, max: 1100, tex: '\\lambda' },
        n: { name: 'refractive index of the immersion medium', value: 1.518, min: 1, max: 1.6, tex: 'n' },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.1, max: 1.7, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dz',
      note: 'A common approximation for a small pinhole; real values depend on the pinhole and on the wavelengths of excitation and emission.',
      stories: { dz: 'An objective of NA {NA} in a medium of index {n} images light of {lambda}. What is the section thickness?' }
    },
    {
      name: 'Lateral resolution',
      expr: 'dx = lambda/(2*NA)', tex: '\\Delta x = \\frac{\\lambda}{2\\,\\mathrm{NA}}',
      vars: {
        dx: { name: 'lateral resolution', q: 'length', unit: 'nm', tex: '\\Delta x' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 520, min: 200, max: 1100, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.4, min: 0.1, max: 1.7, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dx',
      note: 'Abbe\'s limit for a widefield microscope; a confocal with a very small pinhole does up to about 1.4 times better.'
    },
    {
      name: 'Pixel dwell time',
      expr: 'tp = d/(fl*Np)', tex: 't_p = \\frac{d}{f_L N_p}',
      vars: {
        tp: { name: 'dwell time on one pixel', q: 'time', unit: 'µs', tex: 't_p' },
        d: { name: 'fraction of the line used for pixels', value: 0.8, min: 0.1, max: 1, tex: 'd' },
        fl: { name: 'line rate', q: 'frequency', unit: 'Hz', value: 512, min: 1, max: 100000, tex: 'f_L' },
        Np: { name: 'pixels per line', value: 512, min: 16, max: 8192, tex: 'N_p' }
      },
      solveFor: 'tp',
      note: 'A frame of 512 lines in one second is a line rate of 512 Hz.'
    }
  ],
  examples: [
    {
      title: 'A 63× oil objective',
      q: 'A confocal microscope with a 63× oil objective (NA 1.4, immersion index 1.518) images green fluorescence at 520 nm. What are the lateral and axial resolutions and the pinhole size for 1 Airy unit, in the specimen?',
      steps: [
        { text: 'Lateral:', tex: '\\Delta x = \\frac{520}{2 \\times 1.4} = 186\\ \\mathrm{nm}' },
        { text: 'Axial:', tex: '\\Delta z = \\frac{1.4 \\times 520 \\times 1.518}{1.4^2} = 564\\ \\mathrm{nm}' },
        { text: 'One Airy unit in the specimen:', tex: '1.22\\,\\frac{520\\ \\mathrm{nm}}{1.4} = 453\\ \\mathrm{nm}' }
      ],
      a: '186 nm laterally, 564 nm for the section, and a pinhole that is 453 nm across when seen from the specimen (a few tens of micrometres in the pinhole plane after magnification).'
    },
    {
      title: 'A fast resonant frame',
      q: 'A resonant mirror at 8 kHz writes on both swings. How many frames a second does it make with 512 lines, and how long does each of 512 pixels on a line get if 70 % of the line is used?',
      steps: [
        'Lines per second: 2 × 8000 = 16 000. Frames: 16 000 ÷ 512 = 31 a second.',
        { text: 'Dwell time:', tex: 't_p = \\frac{0.7}{16000 \\times 512} = 85\\ \\mathrm{ns}' }
      ],
      a: '31 frames a second, with 85 ns for each pixel.'
    }
  ],
  quiz: [
    { q: 'What does the pinhole of a confocal microscope do?', choices: ['it limits the laser power', 'it blocks most of the light that comes from planes other than the focus', 'it makes the spot smaller on the specimen', 'it filters out the laser wavelength'], a: 1, why: 'It sits in a plane conjugate to the focus. Light from the focal point passes, light from other depths comes to focus elsewhere and spreads over the pinhole, so most of it is stopped.' },
    { q: 'Compute the axial resolution, in nanometres, of an objective with NA 0.95 in air at 520 nm, using $1.4\\lambda n/\\mathrm{NA}^2$.', answer: 807, unit: 'nm', why: '1.4 × 520 nm × 1 ÷ 0.95² = 807 nm.' },
    { q: 'The numerical aperture of an objective is doubled. By what factor does the axial resolution change (immersion unchanged)?', choices: ['it improves by 2', 'it improves by 4', 'it worsens by 2', 'it does not change'], a: 1, why: 'The section thickness goes as 1/NA², so doubling the NA makes the section four times thinner.' },
    { q: 'A pinhole smaller than 1 Airy unit gives a lateral resolution twice as good as a widefield microscope.', a: false, why: 'The gain is at most a factor of about 1.4, and a very small pinhole costs most of the signal. The sectioning is the main benefit.' },
    { q: 'A galvo scan takes one second for 512 lines of 512 pixels, using 80 % of each line. What is the dwell time per pixel, in microseconds?', answer: 3.05, unit: 'µs', why: '0.8 ÷ (512 lines/s × 512 pixels) = 3.05 µs.' }
  ],
  applications: [
    'Cell biology: three-dimensional images of fluorescently labelled cells and tissue sections, and live-cell imaging.',
    'Neuroscience, where the structure of neurons is traced through stacks of sections.',
    'Materials and semiconductors: reflected-light confocal microscopes measure surface height ([[optical-profilers]]).',
    'Medicine: confocal endomicroscopes and scanners for skin examine tissue without a biopsy.',
    'Imaging of fast events with resonant scanners and spinning-disk confocals.'
  ],
  history: 'Marvin Minsky conceived the confocal microscope in 1955 and patented it in 1957, with a moving specimen stage and a lamp for light. Lasers and scanning mirrors, with computers to build the picture, made it a laboratory instrument in the late 1980s, and it became the standard way to look at fluorescent cells in three dimensions.',
  sources: [
    'J. B. Pawley (ed.), *Handbook of Biological Confocal Microscopy*, 3rd ed. (Springer, 2006) — optics, scanning and detectors.',
    'T. Wilson and C. Sheppard, *Theory and Practice of Scanning Optical Microscopy* (Academic Press, 1984).',
    'M. Minsky, "Memoir on inventing the confocal scanning microscope", *Scanning* 10 (1988) 128–138.'
  ],
  sim: 'ss-confocal'
}

,

/* ================================================================ lidar */
{
  id: 'lidar', parent: 'scanning-systems', title: 'Lidar', level: 2,
  short: 'A lidar times short laser pulses on their way to a surface and back: distance is half the round-trip time times the speed of light. A scanner, a ring of lasers or a flash of light turns the single distance into a cloud of points.',
  keywords: ['lidar', 'LIDAR', 'time of flight', 'point cloud', 'spinning lidar', 'MEMS lidar', 'solid-state lidar', 'FMCW lidar', 'flash lidar', '905 nm', '1550 nm', 'eye safety', 'range', 'points per second', 'angular resolution', 'APD', 'SPAD', 'autonomous vehicle'],
  prereq: ['polygon-scanners', 'resonant-and-mems-scanners', 'diode-lasers', 'laser-safety-classes'],
  related: ['time-of-flight-cameras', 'laser-triangulation', 'three-d-machine-vision', 'continuous-and-pulsed-lasers', 'fibre-lasers', 'laser-eye-hazards-and-eyewear', 'distance-and-displacement-sensors', 'infrared-and-thermal-sensors'],
  body: `
Light travels 0.3 m in a nanosecond. If a laser pulse leaves a lidar, strikes a wall and returns after 66.7 ns, the wall is 10 m away. That is the whole principle of **time-of-flight** lidar ("light detection and ranging"): measure the round trip $t$ and the distance is

$$R = \\frac{c\\,t}{2}$$

Everything else is a means of doing it many times, in many directions.

### Parts of a pulsed lidar
- A **laser**: a pulsed diode of tens of watts peak at 905 nm, or a fibre laser at 1550 nm, with pulses of a nanosecond or a few; a 3 ns pulse is 0.9 m long in air, but the instant of its arrival can be fixed to a fraction of that.
- A **detector**: a silicon avalanche photodiode or a single-photon avalanche diode at 905 nm, an InGaAs one at 1550 nm, with a timing circuit that fixes the arrival time. A timing resolution of 1 ns is 15 cm; 100 ps is 1.5 cm.
- A **scanner** that points the beam, or many lasers pointing different ways.

### Ways to make a picture
- **Spinning**: a head with 16 to 128 laser–detector pairs stacked vertically turns 5 to 20 times a second: the scanning is the rotation of the whole head.
- **Mirror**: a rotating polygon, a galvanometer or a MEMS mirror sweeps a few beams over a narrower field ([[polygon-scanners]], [[resonant-and-mems-scanners]]).
- **Flash**: one wide pulse lights the scene and a detector array records the time for each pixel ([[time-of-flight-cameras]] are a cousin).
- **FMCW** (frequency-modulated continuous wave): the laser's frequency is swept and the beat with the returning light gives range, and the velocity from the Doppler shift.

### Numbers
| 64 channels, 10 turns a second | |
|---|---|
| angular step 0.2° | 64 × 10 × 1800 = 1.15 million points a second |
| spot spacing at 50 m | 0.17 m |
| spot spacing at 100 m | 0.35 m |
| points across a 0.5 m pedestrian at 100 m | about 1.4 |

Angle is what fixes the detail: the spacing of the points grows in proportion to the range, so a pedestrian that is a clear object at 50 m is a point or two at 100 m. Quoted ranges are for a stated **reflectivity**, often 10 % (a dark surface); a white wall is seen several times as far.

The next pulse must not leave before the last echo has come back, or the echoes are confused: for a range of 200 m the round trip is 1.33 µs, so each channel can pulse at most 750 kHz.

### 905 or 1550 nm?
Silicon detectors are cheap and work at 905 nm, but that light is focused by the eye on to the retina, so the pulse energy has to stay small. Light at 1550 nm is absorbed in the front of the eye before it reaches the retina, which allows much more pulse energy under the safety standards and so a longer range, but it needs InGaAs detectors and is more costly. Sunlight, rain and fog add noise and absorb, and many lidars use a narrow filter around their wavelength.

> [!warn] Lidars are made to Class 1 by design (see [[laser-safety-classes]]), but the limit is a statement about the whole product, not about one pulse: do not look into the window of an unfamiliar lidar at close range or through optical aids, and never open the housing.

> [!key] Lidar measures the round-trip time of a pulse: $R = ct/2$, 15 cm for each nanosecond. The point cloud's detail is set by the angular step and the range, and the pulse rate of each channel is limited by the round trip to the farthest target.
`,
  ideas: [
    'Distance = c·t/2: 66.7 ns for 10 m, and each nanosecond of timing resolution is 15 cm.',
    'A scanner (spinning, mirror, MEMS) or a flash gives one distance per direction; points per second = channels × turns per second × points per turn.',
    'The spacing of points grows with range (range × angular step), so far targets are seen with few points.',
    'The pulse rate of a channel is limited by the round trip to the farthest target: 750 kHz for 200 m.',
    '905 nm is cheap but retina-limited in energy; 1550 nm allows more energy and range, at higher cost.'
  ],
  pitfalls: [
    'A lidar measures distance by the brightness of the return — Brightness only tells how reflective the target is. Distance comes from the arrival time of the pulse.',
    'More channels always means more detail — Detail is set by the angular step in both directions and the range; a few channels with fine steps can resolve less vertically than many with coarse steps.',
    'A range of 200 m means every object is seen at 200 m — Ranges are quoted for a reflectivity, often 10 %. Dark, wet or small targets are lost closer, and glass and mirrors reflect the pulse away.',
    '1550 nm light is harmless — It is absorbed before the retina, which raises the safe pulse energy, but the cornea can still be injured at high energies. Lidars are limited by the standard, not harmless by nature.'
  ],
  terms: [
    { term: 'Time of flight', also: ['ToF', 'TOF'], def: 'The time light takes to travel to a target and back. Divided by two and multiplied by the speed of light it gives the distance.' },
    { term: 'Point cloud', def: 'The set of three-dimensional points, one for each measured direction and distance, that a lidar produces.' },
    { term: 'Angular step', also: ['angular resolution of a lidar'], def: 'The angle between neighbouring beams in a lidar scan. At range z the points are z times this angle apart.' },
    { term: 'Avalanche photodiode', also: ['APD', 'SPAD'], def: 'A photodiode with internal gain from avalanche multiplication, fast enough to time nanosecond pulses. A single-photon version (SPAD) counts individual photons.' },
    { term: 'FMCW lidar', also: ['frequency-modulated continuous-wave lidar'], def: 'A lidar whose laser frequency is swept continuously. The beat between the outgoing and returning light gives the range, and the Doppler shift gives the speed.' },
    { term: 'Reflectivity', also: ['albedo at the lidar wavelength'], def: 'The fraction of the light a target scatters back. Lidar ranges are quoted for a reflectivity, usually 10 % (dark) or 80–90 % (white).' }
  ],
  formulas: [
    {
      name: 'Distance from the round-trip time',
      expr: 'R = c*t/2', tex: 'R = \\frac{c\\,t}{2}',
      vars: {
        R: { name: 'distance to the target', q: 'length', unit: 'm', tex: 'R' },
        c: { const: 'c' },
        t: { name: 'round-trip time', q: 'time', unit: 'ns', value: 66.7, tex: 't' }
      },
      solveFor: 'R',
      note: 'Light goes out and back, so the distance is half of ct.',
      stories: { R: 'A pulse returns {t} after it left. How far is the target?', t: 'A target is {R} away. How long does the pulse take there and back?' }
    },
    {
      name: 'Highest pulse rate for an unambiguous range',
      expr: 'fm = c/(2*R)', tex: 'f_{\\max} = \\frac{c}{2R}',
      vars: {
        fm: { name: 'highest pulse rate per channel', q: 'frequency', unit: 'kHz', tex: 'f_{\\max}' },
        c: { const: 'c' },
        R: { name: 'farthest range', q: 'length', unit: 'm', value: 200, min: 0.1, max: 100000, tex: 'R' }
      },
      solveFor: 'fm',
      note: 'The next pulse must wait for the last echo from the farthest target.'
    },
    {
      name: 'Points per second of a spinning lidar',
      expr: 'Np = L*fr*2*pi/(dth*1e6)', tex: 'N = \\frac{L\\,f_{\\mathrm{rot}}\\,360^\\circ}{\\Delta\\theta}',
      vars: {
        Np: { name: 'points per second (millions)', q: false, unit: 'Mpoints/s', tex: 'N' },
        L: { name: 'number of channels (lines)', value: 64, min: 1, max: 512, int: true, tex: 'L' },
        fr: { name: 'turns per second', q: 'frequency', unit: 'Hz', value: 10, min: 0.1, max: 100, tex: 'f_{\\mathrm{rot}}' },
        dth: { name: 'angular step round the turn', q: 'angle', unit: '°', value: 0.2, min: 0.01, max: 5, tex: '\\Delta\\theta' }
      },
      solveFor: 'Np',
      note: 'A turn holds 360°/Δθ points on each channel.'
    },
    {
      name: 'Spacing of the points at a range',
      expr: 's = z*dth', tex: 's = z\\,\\Delta\\theta',
      vars: {
        s: { name: 'spacing of neighbouring points', q: 'length', unit: 'm', tex: 's' },
        z: { name: 'range', q: 'length', unit: 'm', value: 50, min: 0.1, max: 1000, tex: 'z' },
        dth: { name: 'angular step', q: 'angle', unit: '°', value: 0.2, min: 0.01, max: 5, tex: '\\Delta\\theta' }
      },
      solveFor: 's',
      note: 'Valid for small angles.'
    }
  ],
  examples: [
    {
      title: 'How far, and how often?',
      q: 'A lidar sees an echo 1.33 µs after the pulse. How far is the target, and what is the highest pulse rate for which a target at that distance is not confused with the next pulse?',
      steps: [
        { text: 'The distance is', tex: 'R = \\frac{(3.00\\times10^8)(1.33\\times10^{-6})}{2} = 200\\ \\mathrm{m}' },
        { text: 'The next pulse must wait for this echo:', tex: 'f_{\\max} = \\frac{1}{1.33\\ \\mu\\mathrm{s}} = 750\\ \\mathrm{kHz}' }
      ],
      a: '200 m; at most 750 000 pulses a second from each channel.'
    },
    {
      title: 'A pedestrian at a distance',
      q: 'A spinning lidar has an angular step of 0.2° in the horizontal direction. How many points fall across a person 0.5 m wide at 50 m, and at 100 m?',
      steps: [
        { text: 'The point spacing is range × angular step; 0.2° = 3.49 mrad:', tex: 's_{50} = 50 \\times 0.00349 = 0.17\\ \\mathrm{m}, \\qquad s_{100} = 0.35\\ \\mathrm{m}' },
        'A 0.5 m wide person gets 0.5 ÷ 0.17 = 2.9 points at 50 m and 0.5 ÷ 0.35 = 1.4 points at 100 m.'
      ],
      a: 'About three points at 50 m and one or two at 100 m.'
    }
  ],
  quiz: [
    { q: 'A lidar pulse returns after 400 ns. How far is the target, in metres?', answer: 60, unit: 'm', why: '$R = ct/2 = (3.0\\times10^8\\ \\mathrm{m/s})(400\\times10^{-9}\\ \\mathrm{s})/2 = 60$ m.' },
    { q: 'The timing circuit of a lidar resolves 2 ns. What range step does that correspond to?', choices: ['3 cm', '30 cm', '3 m', '0.3 mm'], a: 1, why: 'Each nanosecond of round trip is 15 cm of range, so 2 ns is 30 cm.' },
    { q: 'The angular step of a lidar is halved. The points at a given range are then…', choices: ['half as far apart', 'twice as far apart', 'unchanged', 'limited by the pulse length instead'], a: 0, why: 'The spacing is range × angular step, so a half step gives half the spacing and four times as many points over an area.' },
    { q: 'A lidar quotes a range of 150 m for targets of 10 % reflectivity. A white wall of 80 % reflectivity is likely to be detected at…', choices: ['less than 150 m', 'exactly 150 m', 'more than 150 m', 'no distance: the beam is reflected away'], a: 2, why: 'More of the light comes back from a more reflective target, so it can be detected farther away than the 10 % reference target.' },
    { q: 'Why can 1550 nm lidars use more pulse energy than 905 nm lidars under the laser safety standards?', choices: ['their light is invisible', 'the eye absorbs 1550 nm in its front before the retina, where the beam would be focused', 'their pulses are longer', 'they do not scan'], a: 1, why: 'At 905 nm the cornea and lens focus the light on the retina, a small spot. At 1550 nm it is absorbed in the front part of the eye, so the permitted energy is far higher.' }
  ],
  applications: [
    'Self-driving and assisted-driving vehicles, which combine lidar with cameras and radar.',
    'Robots and warehouse vehicles, mapping rooms and finding obstacles.',
    'Surveying from the air, with scanners that measure ground and forest canopy over wide areas, and terrestrial laser scanners for buildings.',
    'Wind and atmospheric sensing, with Doppler lidars that measure wind speed and aerosols.',
    'Traffic monitoring and security, counting and tracking objects in a scene.'
  ],
  history: 'Lidar followed the laser closely: pulsed rangefinders were measuring the distance to the Moon with retroreflectors left by the Apollo missions from 1969. Airborne laser scanning came of age in the 1990s with GPS, and spinning multi-channel units for vehicles were built for the DARPA autonomous vehicle challenges of the mid-2000s.',
  sources: [
    'P. F. McManamon, *LiDAR Technologies and Systems* (SPIE Press, 2019).',
    'C. Weitkamp (ed.), *Lidar: Range-Resolved Optical Remote Sensing of the Atmosphere* (Springer, 2005).',
    'J. Hecht, "Lidar for self-driving cars", *Optics & Photonics News* 29 (January 2018) 26–33.',
    'IEC 60825-1, *Safety of laser products* — the limits behind the choice of wavelength and pulse energy.'
  ],
  sim: 'ss-lidar'
},

/* ================================================================ laser triangulation */
{
  id: 'laser-triangulation', parent: 'scanning-systems', title: 'Laser triangulation', level: 2,
  short: 'A laser spot (or line) is seen by a camera set off to one side: where the spot lands on the sensor depends on the distance of the surface. The depth resolution, z² p / (f b), worsens as the square of the range and improves with a longer baseline.',
  keywords: ['laser triangulation', 'triangulation sensor', 'laser line scanner', 'laser profiler', 'baseline', 'Scheimpflug', 'depth resolution', 'range sensor', 'height sensor', 'centroid', 'speckle', 'profile scanner', '3-D scanner', 'seam tracking', 'occlusion'],
  prereq: ['laser-line-generators', 'focusing-to-a-point', 'pixels-per-feature'],
  related: ['structured-light-scanning', 'three-d-machine-vision', 'lidar', 'time-of-flight-cameras', 'distance-and-displacement-sensors', 'machine-vision-lighting', 'speckle', 'area-scan-and-line-scan-cameras'],
  body: `
Hold a pen up to a laser pointer's spot on a wall and look from a little to one side: as the wall comes nearer the spot seems to slide across your view. A **laser triangulation** sensor does the same with a lens and a sensor. The laser sends a beam straight out; a camera whose lens is a distance $b$ (the **baseline**) away looks along a parallel line. A spot at distance $z$ appears at a distance

$$x' = \\frac{f\\,b}{z}$$

from the camera's axis on the sensor, for a lens of focal length $f$. The position of the spot gives the distance: a nearer surface moves the spot farther.

### Depth resolution
Differentiating, a change $\\Delta x'$ on the sensor means a change of distance

$$\\Delta z = \\frac{z^2}{f\\,b}\\,\\Delta x'$$

With a pixel of $p = 5$ µm, a lens of 16 mm and a baseline of 100 mm:

| range $z$ | spot position | depth per pixel | with a 0.1-pixel centroid | triangulation angle |
|---|---|---|---|---|
| 100 mm | 16.0 mm | 31 µm | 3.1 µm | 45° |
| 200 mm | 8.0 mm | 125 µm | 12.5 µm | 27° |
| 300 mm | 5.3 mm | 281 µm | 28 µm | 18° |
| 500 mm | 3.2 mm | 781 µm | 78 µm | 11° |

Doubling the range makes the resolution four times worse; doubling the baseline or the focal length makes it twice better. A **centroid** of the spot, which uses the brightness of many pixels, finds its centre to a tenth of a pixel or better, so the resolution is not pixel-limited.

### The price of a long baseline
A longer baseline improves the depth resolution but widens the angle between the beam and the line of sight, and the camera cannot see into a notch or behind a step that the laser illuminates: **occlusion**. Sensors keep the triangulation angle between about 20° and 40°. Two cameras, one on each side, see more of a step.

### A line instead of a spot
A cylinder or Powell lens ([[laser-line-generators]]) spreads the beam into a line, and every column of the sensor then measures the depth of one point of the line, so a single exposure gives a **profile** of a thousand or more points. Profile sensors run at hundreds to tens of thousands of profiles a second; moving the part under the line builds a three-dimensional picture, exactly as a [[area-scan-and-line-scan-cameras|line-scan camera]] builds a flat one.

### The Scheimpflug tilt
A line of light extends over the whole range, but a flat sensor perpendicular to the lens axis is in focus for only one distance. The remedy is to **tilt the sensor** until the planes of the object (the laser sheet), the lens and the sensor meet in one line (**Scheimpflug's rule**). For a camera parallel to the beam, the sensor tilts by $\\arctan(f/b)$: 9.1° for $f = 16$ mm and $b = 100$ mm. A lens at f/4 whose untilted sensor is focused for 300 mm blurs the spot over about 110 µm, some twenty pixels, when the surface moves to 200 mm.

### What limits it
**Speckle** ([[speckle]]), the grain a coherent beam makes on a rough surface, moves the centroid and is usually the limiting error. Shiny surfaces give stray reflections; translucent ones let the beam sink in and blur the line. A blue laser (405 nm) is used on hot glowing metal and on skin and plastics, a red one (650 nm) on most things. Ambient light is cut by a filter and a short exposure.

> [!key] Spot position $x' = fb/z$ gives the distance; the depth resolution $\\Delta z = z^2\\,\\Delta x'/(fb)$ grows as the square of the range. A longer baseline helps but raises occlusion, and a line sensor needs the sensor tilted by Scheimpflug's rule.
`,
  ideas: [
    'The spot lands at x′ = fb/z on the sensor: the position of the spot is the distance.',
    'Depth resolution Δz = z²·p/(fb): four times worse at twice the range, twice better at twice the baseline or focal length.',
    'A centroid finds the spot to a fraction of a pixel, so the resolution is better than one pixel suggests.',
    'A long baseline gives better resolution but the camera cannot see behind steps the laser lights (occlusion).',
    'A laser line gives a profile per exposure; the sensor is tilted (Scheimpflug) so that the whole line stays in focus.'
  ],
  pitfalls: [
    'The depth resolution is the same everywhere in the range — It goes as the square of the distance: 31 µm per pixel at 100 mm but 781 µm at 500 mm in the same sensor.',
    'The best sensor has the longest possible baseline — A longer baseline sharpens the depth but increases shadowing. A compromise of 20° to 40° is typical.',
    'The camera must be pixel-limited, so the resolution is one pixel — The centroid of the spot, over many pixels, gives a tenth of a pixel or better. The limit is usually speckle.',
    'Triangulation works equally on every surface — Shiny surfaces give mirror reflections, translucent ones blur the line, and very dark ones return too little light.'
  ],
  terms: [
    { term: 'Baseline', also: ['triangulation base'], def: 'The distance between the laser beam and the camera lens in a triangulation sensor. A longer baseline gives better depth resolution but more occlusion.' },
    { term: 'Triangulation angle', def: 'The angle between the laser beam and the camera\'s line of sight to the spot. It is the angle whose tangent is the baseline divided by the range.' },
    { term: 'Centroid', also: ['spot centroid', 'sub-pixel centre'], def: 'The brightness-weighted centre of the spot or line on the sensor. It locates the spot to a fraction of a pixel.' },
    { term: 'Scheimpflug rule', also: ['Scheimpflug tilt', 'Scheimpflug condition'], def: 'A plane in focus tilted to the lens is imaged on a plane that makes the same two planes meet in one line with the lens plane. It tilts a sensor so a whole laser line is sharp.' },
    { term: 'Occlusion', also: ['shadowing'], def: 'The loss of measurement where the laser lights a part of the surface the camera cannot see, or the reverse, behind a step or in a groove.' },
    { term: 'Profile sensor', also: ['laser line scanner', '2-D profiler'], def: 'A triangulation sensor with a laser line and a camera that gives the height of the surface at every point along the line in each exposure.' }
  ],
  formulas: [
    {
      name: 'Position of the spot on the sensor',
      expr: 'x = f*b/z', tex: 'x\' = \\frac{f\\,b}{z}',
      vars: {
        x: { name: 'distance of the spot from the lens axis, on the sensor', q: 'length', unit: 'mm', tex: 'x\'' },
        f: { name: 'focal length of the camera lens', q: 'length', unit: 'mm', value: 16, min: 2, max: 200, tex: 'f' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 100, min: 5, max: 1000, tex: 'b' },
        z: { name: 'distance of the surface', q: 'length', unit: 'mm', value: 300, min: 10, max: 10000, tex: 'z' }
      },
      solveFor: 'x',
      note: 'For a camera whose axis is parallel to the laser beam and z much larger than f.'
    },
    {
      name: 'Depth resolution',
      expr: 'dz = z^2*p/(f*b)', tex: '\\Delta z = \\frac{z^2\\,p}{f\\,b}',
      vars: {
        dz: { name: 'depth change for one step of the spot', q: 'length', unit: 'µm', tex: '\\Delta z' },
        z: { name: 'distance of the surface', q: 'length', unit: 'mm', value: 300, min: 10, max: 10000, tex: 'z' },
        p: { name: 'step of the spot on the sensor (a pixel, or a fraction of one)', q: 'length', unit: 'µm', value: 5, min: 0.01, max: 100, tex: 'p' },
        f: { name: 'focal length of the camera lens', q: 'length', unit: 'mm', value: 16, min: 2, max: 200, tex: 'f' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 100, min: 5, max: 1000, tex: 'b' }
      },
      solveFor: 'dz',
      note: 'Give p a tenth of a pixel to see the effect of a centroid.',
      stories: { dz: 'A laser sensor with a {f} lens and a baseline of {b} looks at a surface {z} away. What depth step does a spot shift of {p} correspond to?' }
    },
    {
      name: 'Triangulation angle',
      expr: 'a = atan(b/z)', tex: '\\beta = \\arctan\\frac{b}{z}',
      vars: {
        a: { name: 'angle between beam and line of sight', q: 'angle', unit: '°', tex: '\\beta' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 100, min: 5, max: 1000, tex: 'b' },
        z: { name: 'distance of the surface', q: 'length', unit: 'mm', value: 300, min: 10, max: 10000, tex: 'z' }
      },
      solveFor: 'a',
      note: 'Small angles give weak depth sensitivity; large angles shadow more.'
    },
    {
      name: 'Tilt of the sensor (Scheimpflug)',
      expr: 'tilt = atan(f/b)', tex: '\\tau = \\arctan\\frac{f}{b}',
      vars: {
        tilt: { name: 'tilt of the sensor from the lens plane', q: 'angle', unit: '°', tex: '\\tau' },
        f: { name: 'focal length of the camera lens', q: 'length', unit: 'mm', value: 16, min: 2, max: 200, tex: 'f' },
        b: { name: 'baseline', q: 'length', unit: 'mm', value: 100, min: 5, max: 1000, tex: 'b' }
      },
      solveFor: 'tilt',
      note: 'For a camera parallel to the laser beam: the plane of the laser, the lens plane and the sensor meet in one line.'
    }
  ],
  examples: [
    {
      title: 'What does a sensor resolve?',
      q: 'A triangulation sensor has a 16 mm lens, a baseline of 100 mm and 5 µm pixels. What is the depth step for one pixel at 300 mm, and for a 0.1-pixel centroid? What baseline halves it?',
      steps: [
        { text: 'One pixel:', tex: '\\Delta z = \\frac{(300\\ \\mathrm{mm})^2 (5\\ \\mu\\mathrm{m})}{(16\\ \\mathrm{mm})(100\\ \\mathrm{mm})} = 281\\ \\mu\\mathrm{m}' },
        'A tenth of a pixel gives a tenth of that, 28 µm.',
        'The depth step is inversely proportional to the baseline, so 200 mm halves it, to 140 µm for a whole pixel and 14 µm for a centroid, at the price of a larger triangulation angle (34° instead of 18°) and more occlusion.'
      ],
      a: '281 µm per pixel, 28 µm with a centroid; a baseline of 200 mm halves it.'
    }
  ],
  quiz: [
    { q: 'A triangulation sensor is moved to measure a surface twice as far away. Its depth resolution is…', choices: ['the same', 'twice as good', 'twice as bad', 'four times as bad'], a: 3, why: 'Δz = z²p/(fb): twice the range gives four times the depth step.' },
    { q: 'What is the depth step, in micrometres, for p = 5 µm, f = 25 mm, b = 80 mm at z = 400 mm?', answer: 400, unit: 'µm', why: 'Δz = z²p/(fb) = (400 mm)²(0.005 mm)/(25 mm × 80 mm) = 0.4 mm = 400 µm.' },
    { q: 'Which change improves the depth resolution and also increases occlusion?', choices: ['a longer baseline', 'a smaller pixel', 'a shorter range', 'a blue laser'], a: 0, why: 'A larger baseline increases the shift of the spot per unit depth but also the angle between beam and line of sight, so more of the surface is hidden from one or the other.' },
    { q: 'The laser sheet of a profile sensor extends over the whole measuring range. Why is the sensor tilted?', choices: ['to reduce the ambient light', 'so that the whole line of light is in focus (Scheimpflug)', 'to increase the baseline', 'to make the pixels square'], a: 1, why: 'A sensor perpendicular to the lens axis is in focus for one distance only. Tilting it so that the object plane, lens plane and sensor plane meet in one line keeps every depth sharp.' },
    { q: 'A centroid algorithm finds the position of a laser line with an uncertainty of 0.1 pixel. This is possible because the…', choices: ['laser is red', 'spot covers several pixels and their brightnesses are averaged', 'lens is telecentric', 'sensor is cooled'], a: 1, why: 'A spot or line covers several pixels, and the weighted mean of their signals locates its centre far more finely than the pixel pitch.' }
  ],
  applications: [
    'Weld-seam tracking, where a profile sensor on the torch finds the joint.',
    'Tyre, rail, wheel and road profiling, and measuring thickness with a pair of sensors.',
    'Inspection of solder paste, parts on conveyors, and the volume of parcels.',
    'Hand-held and robot-mounted 3-D scanners with several laser lines.',
    'Wood and board scanning in sawmills, where the profile of every board decides how it is cut.'
  ],
  history: 'Triangulation is the oldest way of measuring distance, used by surveyors. Laser triangulation sensors date from the 1970s, when position-sensitive detectors and then CCDs were put behind a lens to read the spot. The tilted sensor that keeps a whole line sharp is named after Theodor Scheimpflug, an Austrian naval officer who patented the rule for aerial photography in 1904.',
  sources: [
    'F. Blais, "Review of 20 years of range sensor development", *Journal of Electronic Imaging* 13 (2004) 231–243.',
    'R. Leach (ed.), *Optical Measurement of Surface Topography* (Springer, 2011) — triangulation and its limits.',
    'J. W. Goodman, *Speckle Phenomena in Optics* (Roberts & Company, 2007) — the speckle that limits laser triangulation.'
  ],
  sim: 'ss-triangulation'
},

/* ================================================================ structured-light 3-D scanning */
{
  id: 'structured-light-scanning', parent: 'scanning-systems', title: 'Structured-light 3-D scanning', level: 2,
  short: 'A projector throws a known pattern of stripes on an object and a camera watches how the surface bends it. Each camera pixel learns which projector column lights it and triangulates; shifting a sinusoidal pattern and reading its phase gives a depth for every pixel, to a small fraction of a fringe.',
  keywords: ['structured light', '3-D scanner', 'fringe projection', 'phase shifting', 'Gray code', 'phase unwrapping', 'wrapped phase', 'projector', 'stripe pattern', 'depth map', 'DLP', 'blue light scanner', 'single-shot', 'dot pattern', 'sinusoidal fringes'],
  prereq: ['laser-triangulation', 'pattern-projectors', 'the-data-projector'],
  related: ['three-d-machine-vision', 'time-of-flight-cameras', 'laser-line-generators', 'testing-optics-with-fringes', 'spatial-light-modulators', 'speckle', 'automated-optical-inspection'],
  body: `
A single laser line measures one profile at a time. A **structured-light** scanner lights the whole object at once with a pattern, a **projector** in place of the laser, and records it with a camera. The principle is triangulation again: the projector is a camera running backwards, so each of its pixel columns is a ray at a known angle. If the camera can tell which column lit a point, the point's position follows by [[laser-triangulation|triangulation]].

### Patterns
- **Single line**: one column at a time, hundreds of images. Simple and slow.
- **Gray code**: black and white stripes in a binary sequence. $k$ patterns tell $2^k$ columns apart (ten images give 1024), and the code changes only one bit between neighbours so errors are small.
- **Phase shifting**: a sinusoidal pattern, shifted by $2\\pi/N$ in $N$ images, $N\\ge3$ and usually 4. Each pixel sees $I_k = A + B\\cos(\\varphi + (k-1)\\pi/2)$, and for four steps
$$\\varphi = \\operatorname{atan2}(I_4 - I_2,\\ I_1 - I_3)$$
 gives the phase of the fringe at that pixel whatever the brightness $A$ or the contrast $B$, to a small fraction of a period.
- **Single-shot**: a dot or coloured-stripe pattern, decoded from one image, for moving scenes ([[pattern-projectors]]).

### From phase to height
A plane lit by fringes of period $P$ shows them straight. A surface of height $h$ displaces them sideways by $h\\tan\\theta$ when the projector is at an angle $\\theta$ to the camera's line of sight, so the phase changes by $\\Delta\\varphi = 2\\pi h\\tan\\theta/P$ and

$$h = \\frac{\\Delta\\varphi\\,P}{2\\pi\\tan\\theta}$$

With $P = 2$ mm and $\\theta = 30°$, a phase shift of 90° is a height of 0.87 mm, and a phase known to 1/100 of a period (3.6°) gives 35 µm.

### The ambiguity
The phase is known only between 0 and $2\\pi$: a surface that raises the fringes by a whole period looks like a flat one. The unambiguous height range is $P/\\tan\\theta$, 3.5 mm for the numbers above (a span: ±1.7 mm about the reference plane if the surface may lie on either side). Finer fringes give finer height and less range, the usual trade. The remedy is **phase unwrapping**: follow the phase across the surface and add a period at every jump (it works on smooth surfaces, and noise or a step can break it), or use a Gray code or fringes of two or three periods, the coarse ones to find the order of each fringe and the fine ones for the precision.

### Practice
- Light: a lamp-based [[the-data-projector|projector]] with a micromirror panel makes no speckle; blue LEDs (about 450 nm) are filtered against ambient light and scatter less in some materials.
- Speed: binary patterns on a micromirror panel run at kilohertz rates, so three-dimensional video is possible.
- Troubles: shiny surfaces (the pattern is mirrored away or doubled by inter-reflection), translucent ones (light enters and comes out elsewhere, biasing the phase), dark ones and hidden areas.
- Accuracy: from a few micrometres on a field of centimetres to a few tenths of a millimetre on a field of a metre.

> [!key] A projector lights a known pattern, a camera sees how it bends, and triangulation turns each pixel's fringe phase into a height, $h = \\Delta\\varphi P/(2\\pi\\tan\\theta)$. The phase is only known modulo $2\\pi$, so range and precision are traded, or the phase is unwrapped.
`,
  ideas: [
    'A projector is a camera in reverse: each of its columns is a known ray, so the camera can triangulate every pixel.',
    'Gray-code stripes label 2^k columns with k images; phase shifting reads a fringe phase to a small fraction of a period.',
    'Four shifted sinusoids give the phase φ = atan2(I₄ − I₂, I₁ − I₃), independent of brightness and contrast.',
    'Height = Δφ·P/(2π tanθ); the unambiguous range is P/tanθ, so finer fringes trade range for precision.',
    'Phase unwrapping or coarse-and-fine fringes resolve the 2π ambiguity; shiny and translucent surfaces and ambient light are the troubles.'
  ],
  pitfalls: [
    'Structured light and laser triangulation are different methods — The geometry is the same. The projector replaces the laser and lights many points at once, so many images are no longer needed.',
    'Finer fringes are always better — They sharpen the height but shorten the unambiguous range P/tanθ, and are harder to unwrap. Practical scanners use coarse and fine fringes together.',
    'The measured phase gives the height directly — The phase is known only between 0 and 2π. A height large enough to move the fringes a full period looks like zero until the phase is unwrapped.',
    'Any surface can be scanned — Shiny, translucent and very dark surfaces corrupt the pattern; a thin coating of matt powder is sometimes used on them.'
  ],
  terms: [
    { term: 'Structured light', also: ['fringe projection', 'pattern projection'], def: 'Lighting an object with a known pattern of light and finding its shape from how the pattern is bent, as seen by a camera at another angle.' },
    { term: 'Phase shifting', also: ['phase-shift profilometry'], def: 'Projecting a sinusoidal fringe pattern several times, each shifted by a fraction of a period, and calculating the phase of the fringes at every pixel from the images.' },
    { term: 'Wrapped phase', def: 'A phase known only modulo 2π, as the arctangent returns it, so that it jumps by a whole period wherever the true phase passes a multiple of 2π.' },
    { term: 'Phase unwrapping', def: 'Adding whole periods to the wrapped phase so that it becomes continuous across the surface, giving the true phase and so the true height.' },
    { term: 'Gray code', also: ['reflected binary code'], def: 'A binary counting sequence in which neighbouring numbers differ in one bit. A series of black-and-white stripe patterns in Gray code gives each projector column a unique code.' },
    { term: 'Fringe period', also: ['pattern period'], def: 'The distance between successive bright fringes of the projected pattern on the reference plane. It sets the height sensitivity and the unambiguous range.' }
  ],
  formulas: [
    {
      name: 'Height from the fringe phase',
      expr: 'h = dphi*P/(2*pi*tan(theta))', tex: 'h = \\frac{\\Delta\\varphi\\,P}{2\\pi\\tan\\theta}',
      vars: {
        h: { name: 'height of the surface', q: 'length', unit: 'mm', signed: true, tex: 'h' },
        dphi: { name: 'phase change of the fringe', q: 'angle', unit: '°', signed: true, value: 90, tex: '\\Delta\\varphi' },
        P: { name: 'fringe period on the reference plane', q: 'length', unit: 'mm', value: 2, min: 0.01, max: 100, tex: 'P' },
        theta: { name: 'angle between projector and camera', q: 'angle', unit: '°', value: 30, min: 1, max: 80, tex: '\\theta' }
      },
      solveFor: 'h',
      note: 'The camera looks straight down at the surface; the phase is the unwrapped one.',
      stories: { h: 'A projector {theta} from the camera line of sight casts fringes of period {P}. A point shows a fringe phase change of {dphi}. How high is it?' }
    },
    {
      name: 'Unambiguous height range',
      expr: 'hm = P/tan(theta)', tex: 'h_{\\max} = \\frac{P}{\\tan\\theta}',
      vars: {
        hm: { name: 'height for a phase change of one whole period', q: 'length', unit: 'mm', tex: 'h_{\\max}' },
        P: { name: 'fringe period on the reference plane', q: 'length', unit: 'mm', value: 2, min: 0.01, max: 100, tex: 'P' },
        theta: { name: 'angle between projector and camera', q: 'angle', unit: '°', value: 30, min: 1, max: 80, tex: '\\theta' }
      },
      solveFor: 'hm',
      note: 'Beyond this height the wrapped phase starts to repeat.'
    },
    {
      name: 'Patterns for a Gray code',
      expr: 'N = 2^k', tex: 'N = 2^k',
      vars: {
        N: { name: 'columns told apart', int: true, tex: 'N' },
        k: { name: 'number of black-and-white patterns', value: 10, min: 1, max: 16, int: true, tex: 'k' }
      },
      solveFor: 'N',
      note: 'Ten patterns identify 1024 columns.'
    }
  ],
  examples: [
    {
      title: 'The phase from four images',
      q: 'At one pixel the four phase-shifted images read $I_1 = 150$, $I_2 = 90$, $I_3 = 50$, $I_4 = 110$. What are the phase, the mean brightness $A$ and the contrast $B$?',
      steps: [
        { text: 'The phase:', tex: '\\varphi = \\operatorname{atan2}(110 - 90,\\ 150 - 50) = \\operatorname{atan2}(20, 100) = 11.3°' },
        { text: 'The mean brightness is the average of opposite images:', tex: 'A = \\frac{150 + 50}{2} = 100' },
        { text: 'and the modulation:', tex: 'B = \\tfrac12\\sqrt{(I_4-I_2)^2 + (I_1-I_3)^2} = \\tfrac12\\sqrt{20^2 + 100^2} = 51' }
      ],
      a: 'φ = 11.3°, A = 100, B = 51. The phase does not depend on A or B.'
    },
    {
      title: 'Range and precision',
      q: 'Fringes of period 2 mm are projected at 30° to the camera. What height does a phase known to 1/100 of a period resolve, and above what height does the wrapped phase repeat?',
      steps: [
        { text: 'A hundredth of a period of height is', tex: '\\delta h = \\frac{0.01 \\times 2\\ \\mathrm{mm}}{\\tan 30°} = 0.035\\ \\mathrm{mm}' },
        { text: 'A whole period of phase is', tex: 'h_{\\max} = \\frac{2\\ \\mathrm{mm}}{\\tan 30°} = 3.46\\ \\mathrm{mm}' }
      ],
      a: '35 µm of resolution, repeating beyond 3.5 mm of height: finer fringes would improve the first and shorten the second.'
    }
  ],
  quiz: [
    { q: 'How many Gray-code stripe patterns are needed to tell 1024 projector columns apart?', answer: 10, why: '$2^{10} = 1024$, so ten black-and-white patterns give each column a unique 10-bit code.' },
    { q: 'Fringes with a period of 3 mm are projected at 45° to the camera. What is the unambiguous height range, in millimetres?', answer: 3, unit: 'mm', why: '$h_{\\max} = P/\\tan\\theta = 3\\ \\mathrm{mm}/\\tan 45° = 3$ mm.' },
    { q: 'A designer makes the fringes finer to improve the precision. What is the cost?', choices: ['a shorter unambiguous height range and harder unwrapping', 'a larger projector', 'no cost: finer is always better', 'a slower camera'], a: 0, why: 'The height per period of phase is P/tanθ, so a finer pattern gives finer height steps but wraps at a smaller height.' },
    { q: 'The phase obtained from four shifted images changes if the brightness of the projector is doubled.', a: false, why: 'The phase is the ratio of differences of the images, so the mean brightness A and the contrast B cancel. Only the noise changes.' },
    { q: 'Why is a micromirror-based lamp projector favoured over a laser one for fringes?', choices: ['it is brighter', 'it makes no speckle, which would otherwise spoil the sinusoidal pattern', 'its fringes are narrower', 'it needs no camera'], a: 1, why: 'Coherent light on a rough surface produces speckle, a random grain that adds noise to the phase. A lamp or LED does not.' }
  ],
  applications: [
    'Industrial inspection and metrology of cast, machined and pressed parts, with fields from centimetres to a metre.',
    'Reverse engineering and quality control: scanners with blue-light projectors and two cameras.',
    'Dental and medical scanning of teeth, faces and body shape.',
    'Face recognition on phones that project a pattern of thousands of infrared dots.',
    'Digitization of artworks and heritage objects, and 3-D video of faces at kilohertz rates.'
  ],
  history: 'Projected fringes served for moiré topography from about 1970. In 1982–83 Mitsuo Takeda and co-workers showed how the phase of a single fringe image yields the height of a surface. Digital micromirror projectors in the late 1990s then made it easy to shift the fringes by computer.',
  sources: [
    'J. Geng, "Structured-light 3D surface imaging: a tutorial", *Advances in Optics and Photonics* 3 (2011) 128–160.',
    'S. Zhang, "High-speed 3D shape measurement with structured light methods: a review", *Optics and Lasers in Engineering* 106 (2018) 119–131.',
    'D. Malacara (ed.), *Optical Shop Testing*, 3rd ed. (Wiley, 2007) — phase-shifting interferometry, whose algorithms fringe projection uses.'
  ],
  sim: 'ss-fringes'
}

,

/* ================================================================ time-of-flight cameras */
{
  id: 'time-of-flight-cameras', parent: 'scanning-systems', title: 'Time-of-flight cameras', level: 2,
  short: 'A time-of-flight camera lights the whole scene with modulated infrared light and lets every pixel measure the delay of its own piece of the return, as a phase. It gives a distance for each pixel in one shot, but only within an ambiguity range of c/(2f).',
  keywords: ['time-of-flight camera', 'ToF camera', 'indirect time of flight', 'iToF', 'continuous wave', 'modulation frequency', 'phase', 'ambiguity range', 'depth camera', 'multipath', 'flying pixels', 'direct ToF', 'SPAD', 'depth map', 'gesture', 'dual frequency'],
  prereq: ['lidar', 'light-emitting-diodes', 'cmos-sensors'],
  related: ['structured-light-scanning', 'laser-triangulation', 'three-d-machine-vision', 'vcsels-and-laser-arrays', 'infrared-and-thermal-sensors', 'the-phone-camera', 'interference'],
  body: `
A **time-of-flight camera** gives each pixel a distance in place of a brightness. It is a *flash [[lidar]]*: one wide light source lights the whole scene, and every pixel of the sensor times the return of its own piece of it. The commonest kind does not time a pulse but the **phase** of light whose brightness is modulated.

### Continuous-wave (indirect) ToF
The scene is lit by LEDs or a VCSEL array ([[vcsels-and-laser-arrays]]) at 850 or 940 nm, modulated at a frequency $f_m$ of 10 to 100 MHz. Light returning from a surface at distance $z$ is delayed by $2z/c$, so its modulation is shifted in phase by

$$\\varphi = \\frac{4\\pi f_m z}{c}, \\qquad z = \\frac{c\\,\\varphi}{4\\pi f_m}$$

Each pixel is a **demodulator**: it collects the returning light in four windows, at 0°, 90°, 180° and 270° of the modulation, giving four numbers $Q_0 \\ldots Q_3$, and $\\varphi = \\operatorname{atan2}(Q_3 - Q_1,\\ Q_0 - Q_2)$, the same arithmetic as in [[structured-light-scanning|phase-shifting]]. The size of the response is a brightness image in the infrared, for free. Sensors have a few hundred by a few hundred pixels (QVGA to VGA) and run at 30 to 60 frames a second.

### The ambiguity
The phase repeats every $2\\pi$, so distances repeat with the **ambiguity range** $c/(2f_m)$:

| modulation | ambiguity range | depth noise for 0.01 rad of phase noise |
|---|---|---|
| 10 MHz | 15.0 m | 24 mm |
| 20 MHz | 7.5 m | 12 mm |
| 50 MHz | 3.0 m | 4.8 mm |
| 100 MHz | 1.5 m | 2.4 mm |

A surface 8 m away read at 20 MHz looks 0.5 m away. A high frequency gives fine precision and a short range; a low one the reverse. Cameras therefore use **two frequencies**: the pair has the ambiguity range $c/(2|f_1 - f_2|)$, so 100 and 80 MHz give 7.5 m, with the precision of 100 MHz.

### Direct ToF
A **direct** time-of-flight sensor has single-photon avalanche diodes that time the arrival of individual photons from short pulses; the times of many pulses are collected in a histogram, whose peak is the distance. It has no ambiguity and works with little light, and is found in phones and automotive flash lidars, with fewer pixels or zones.

### Where it goes wrong
- **Multipath**: light that arrives by two routes, one direct and one after a bounce off a wall or a shiny floor, adds as two phasors. The sum has a phase between the two, so a concave corner reads too far and looks rounded.
- **Flying pixels**: a pixel straddling a near and a far object reads a distance between them, not on either.
- **Sunlight** adds shot noise; the 940 nm band, where the atmosphere absorbs, is chosen for outdoor use.
- **Motion** between the four windows smears the phase. Dark and shiny surfaces return too little or the wrong light.

> [!key] Phase of the modulation gives distance, $z = c\\varphi/(4\\pi f_m)$, to a fraction of a modulation period, with an ambiguity range $c/(2f_m)$. High frequency means fine depth and short range; two frequencies reconcile them, and multipath bends the result.
`,
  ideas: [
    'Every pixel measures the phase delay of modulated light, φ = 4π f z/c, with four samples per period.',
    'The phase repeats every 2π, so distances repeat every c/(2f): 7.5 m at 20 MHz and 1.5 m at 100 MHz.',
    'Depth noise is c σφ/(4π f): a higher modulation frequency gives better precision and a shorter range.',
    'Two frequencies give the precision of the higher and the range c/(2|f₁ − f₂|) of their difference.',
    'Multipath adds phasors and biases the distance: corners look rounded and glossy floors push surfaces away.'
  ],
  pitfalls: [
    'A ToF camera scans a laser over the scene — It lights the whole scene at once, and the sensor measures every pixel in parallel; nothing scans.',
    'A higher modulation frequency is always better — It sharpens the depth but shortens the ambiguity range, so distant objects wrap around and look near. Cameras use two frequencies.',
    'The camera measures how long a pulse takes — Most cameras measure the phase of a modulated light. Direct ToF sensors do time pulses, but they are a different design.',
    'Every pixel gives a true distance — Pixels at edges, in corners and on shiny surfaces mix light from several distances and read something in between or beyond.'
  ],
  terms: [
    { term: 'Modulation frequency', also: ['f_mod', 'fm'], def: 'The frequency, usually 10 to 100 MHz, at which the illumination of a continuous-wave time-of-flight camera is switched or varied in brightness.' },
    { term: 'Ambiguity range', also: ['unambiguous range', 'non-ambiguity distance'], def: 'The distance c/(2f) at which the measured phase has turned through a whole period. Beyond it distances repeat.' },
    { term: 'Demodulation pixel', also: ['lock-in pixel', 'photonic mixer'], def: 'A pixel that sorts the charge made by the returning light into different storage nodes in step with the modulation, giving the samples from which the phase is calculated.' },
    { term: 'Multipath interference', also: ['multipath'], def: 'The error caused when light reaches a pixel by more than one path, such as a direct and a reflected one. Their phasors add, and the distance read lies between the two.' },
    { term: 'Flying pixel', also: ['mixed pixel'], def: 'A pixel at the edge of an object that sees both the object and the background, and so reports a distance that belongs to neither.' },
    { term: 'Direct time of flight', also: ['dToF'], def: 'Measuring the time of flight of short pulses with detectors that time single photons, instead of the phase of a modulated light.' }
  ],
  formulas: [
    {
      name: 'Distance from the phase',
      expr: 'z = c*phi/(4*pi*fm)', tex: 'z = \\frac{c\\,\\varphi}{4\\pi f_m}',
      vars: {
        z: { name: 'distance', q: 'length', unit: 'm', tex: 'z' },
        c: { const: 'c' },
        phi: { name: 'phase delay of the modulation', q: 'angle', unit: '°', value: 135, min: 0, max: 360, tex: '\\varphi' },
        fm: { name: 'modulation frequency', q: 'frequency', unit: 'MHz', value: 20, min: 1, max: 500, tex: 'f_m' }
      },
      solveFor: 'z',
      note: 'Valid for a phase between 0 and 360°; beyond that the distance wraps around.',
      stories: { z: 'A pixel of a camera modulated at {fm} reads a phase of {phi}. How far is the surface?' }
    },
    {
      name: 'Ambiguity range',
      expr: 'za = c/(2*fm)', tex: 'z_{\\mathrm{amb}} = \\frac{c}{2 f_m}',
      vars: {
        za: { name: 'ambiguity range', q: 'length', unit: 'm', tex: 'z_{\\mathrm{amb}}' },
        c: { const: 'c' },
        fm: { name: 'modulation frequency', q: 'frequency', unit: 'MHz', value: 20, min: 1, max: 500, tex: 'f_m' }
      },
      solveFor: 'za',
      note: 'A surface farther away than this reads as one at the distance modulo the ambiguity range.'
    },
    {
      name: 'Depth noise from phase noise',
      expr: 'sz = c*sphi/(4*pi*fm)', tex: '\\sigma_z = \\frac{c\\,\\sigma_\\varphi}{4\\pi f_m}',
      vars: {
        sz: { name: 'noise in the distance', q: 'length', unit: 'mm', tex: '\\sigma_z' },
        c: { const: 'c' },
        sphi: { name: 'noise in the phase', q: 'angle', unit: 'rad', value: 0.01, min: 0.0001, max: 1, tex: '\\sigma_\\varphi' },
        fm: { name: 'modulation frequency', q: 'frequency', unit: 'MHz', value: 20, min: 1, max: 500, tex: 'f_m' }
      },
      solveFor: 'sz',
      note: 'The phase noise falls with the signal: more light, longer integration or a brighter surface.'
    },
    {
      name: 'Range with two frequencies',
      expr: 'zd = c/(2*df)', tex: 'z_{\\mathrm{amb}} = \\frac{c}{2\\,\\Delta f}',
      vars: {
        zd: { name: 'ambiguity range of the pair', q: 'length', unit: 'm', tex: 'z_{\\mathrm{amb}}' },
        c: { const: 'c' },
        df: { name: 'difference of the two frequencies', q: 'frequency', unit: 'MHz', value: 20, min: 0.1, max: 500, tex: '\\Delta f' }
      },
      solveFor: 'zd',
      note: '100 MHz and 80 MHz differ by 20 MHz: the pair is unambiguous to 7.5 m, with the precision of 100 MHz.'
    }
  ],
  examples: [
    {
      title: 'A reading and its ambiguity',
      q: 'A camera modulated at 20 MHz reads a phase of 135° at a pixel. What distance does that give, and what other distances could give the same phase?',
      steps: [
        { text: 'The ambiguity range is', tex: 'z_{\\mathrm{amb}} = \\frac{c}{2f_m} = \\frac{3.00\\times10^8}{4.0\\times10^7} = 7.49\\ \\mathrm{m}' },
        { text: 'The phase is 135°/360° = 0.375 of a period:', tex: 'z = 0.375 \\times 7.49 = 2.81\\ \\mathrm{m}' },
        'Surfaces at 2.81 + 7.49 = 10.30 m, 17.79 m, … would read the same.'
      ],
      a: '2.81 m, or 10.30 m, 17.79 m …: a second frequency would tell which.'
    }
  ],
  quiz: [
    { q: 'What is the ambiguity range of a camera modulated at 50 MHz, in metres?', answer: 3, unit: 'm', why: '$c/(2f) = 3.0\\times10^8/(1.0\\times10^8) = 3.0$ m.' },
    { q: 'A camera modulated at 10 MHz reads a phase of 90°. How far is the surface, in metres?', answer: 3.75, unit: 'm', why: 'A quarter of the ambiguity range, 15 m ÷ 4 = 3.75 m.' },
    { q: 'The modulation frequency is raised from 20 to 100 MHz. What happens?', choices: ['the depth noise falls and the ambiguity range shortens', 'the depth noise rises and the range lengthens', 'both improve', 'neither changes'], a: 0, why: 'Depth noise is c σφ/(4π f), so it falls with f; the ambiguity range c/(2f) shortens in the same proportion.' },
    { q: 'Light from a surface reaches a pixel directly and also after a bounce off a nearby wall. The distance the pixel reports is…', choices: ['the direct distance', 'the distance of the wall', 'a value between the direct distance and the longer path', 'always zero'], a: 2, why: 'The two returns add as phasors, and the phase of the sum lies between the two phases, so the distance is biased towards the longer path.' },
    { q: 'A time-of-flight camera moves a laser spot across the scene to measure each pixel in turn.', a: false, why: 'The scene is lit all at once and every pixel measures its own return in parallel. There is no scanning.' }
  ],
  applications: [
    'Gesture and body tracking, and people counting at doors.',
    'Robots and drones, for obstacle detection and navigation at a few metres.',
    'Logistics: measuring the volume of parcels and pallets, and bin picking.',
    'Phone cameras and tablets, for autofocus assistance, portrait effects and augmented reality.',
    'Vehicle interiors, detecting the occupants\' positions.'
  ],
  history: 'Range cameras that demodulated light in each pixel were developed in the late 1990s, notably by Rudolf Schwarte\'s group in Siegen and by Rudolf Lange and Peter Seitz, who reported a solid-state range camera in 2001. Phones began carrying ToF sensors in the late 2010s.',
  sources: [
    'R. Lange and P. Seitz, "Solid-state time-of-flight range camera", *IEEE Journal of Quantum Electronics* 37 (2001) 390–397.',
    'S. Foix, G. Alenyà and C. Torras, "Lock-in time-of-flight (ToF) cameras: a survey", *IEEE Sensors Journal* 11 (2011) 1917–1926.',
    'M. Hansard, S. Lee, O. Choi and R. Horaud, *Time-of-Flight Cameras: Principles, Methods and Applications* (Springer, 2013).'
  ],
  sim: 'ss-tof'
},

/* ================================================================ line-scan inspection */
{
  id: 'line-scan-inspection', parent: 'scanning-systems', title: 'Line-scan inspection of moving webs', level: 2,
  short: 'A line-scan camera over a moving web, locked to an encoder, makes a picture as wide as the product and as long as the run. The cell around it is a line light, a roller and a stack of cameras; for faint, fast scenes a TDI sensor adds the light of many lines to one.',
  keywords: ['line-scan inspection', 'web inspection', 'line scan', 'encoder', 'TDI', 'time delay integration', 'line light', 'roller', 'flat-field correction', 'steel strip', 'paper', 'film', 'print inspection', 'machine direction', 'cross direction', 'line rate'],
  prereq: ['area-scan-and-line-scan-cameras', 'triggering-and-strobing', 'camera-interfaces'],
  related: ['ccd-architectures', 'machine-vision-lighting', 'the-vision-inspection-cell', 'flatbed-and-document-scanners', 'earth-observation-cameras', 'sensor-noise', 'pixels-per-feature', 'telecentric-imaging'],
  body: `
A web of paper, film or steel leaves a machine 2 m wide at 5 m/s. To see a defect of 0.1 mm anywhere in it, the camera needs pictures 20 000 pixels wide and without an end. That is a **line-scan** job. [[area-scan-and-line-scan-cameras]] describes the camera; this page is the system round it.

### The cell
- The web runs over a **roller**, and the camera looks at the roller. The web cannot flutter nearer or farther, and the focus holds.
- An **encoder** on the roller gives a pulse for each small step of travel. Every pulse triggers a line, so the pixels are square at any speed ([[triggering-and-strobing]]).
- A **line light** (an LED bar, often with a cylindrical lens) lights the camera's line brightly: bright-field for the colour and print, dark-field at a low angle for scratches and dents, transmitted from behind for films and glass ([[machine-vision-lighting]]).
- Several cameras side by side, overlapping a little, cover a wide web, and the strips are stitched.
- **Flat-field correction** divides every pixel by its reading of a white reference, as in a [[flatbed-and-document-scanners|scanner]], to cancel differences of pixel gain and of light along the line.
- The software finds, measures and classifies the defects, and marks the web or sounds the alarm. A 16 384-pixel camera of 8 bits at 50 kHz delivers 819 MB/s ([[camera-interfaces]]).

### Numbers for one line
| quantity | value |
|---|---|
| web width | 2 m |
| speed | 5 m/s (300 m/min) |
| pixel footprint | 0.1 mm |
| pixels across | 20 000 (for example two 12k cameras, overlapping) |
| line rate | 5 m/s ÷ 0.1 mm = 50 kHz |
| exposure of each line | at most 20 µs |

Twenty microseconds is little time to collect light, so a line-scan camera needs far more light per pixel than an area camera, and the line light is intense.

### Time delay and integration
A **TDI** sensor has $M$ rows (32, 64, 128 or 256). The image of a line of the web moves from row to row, and the charge is shifted from row to row at exactly the same rate, so the charge of that line is exposed for $M$ line periods. The signal rises as $M$ and the shot noise as $\\sqrt M$, so the signal-to-noise ratio rises as $\\sqrt M$: 5.7 times for 32 rows, 11.3 for 128, 16 for 256. Or the web can run $M$ times faster at the same exposure.

The price is **synchronism**. The image must move over the rows by exactly one row per line period. A fractional speed error $e$ smears the image of a line over $M e$ pixels by the end: 1 % over 128 rows is 1.3 pixels. So TDI wants a rigid, known motion: satellites ([[earth-observation-cameras]]), semiconductor wafers, flat panels and slide scanners, and for webs a very good encoder and a roller that does not wobble. A web that wanders across the sensor or changes its distance blurs a TDI picture where an ordinary line camera shows only a slight shift.

> [!key] A line camera, an encoder and a line light turn a moving web into an endless picture. The line rate is $v/p_\\mathrm{foot}$, 50 kHz for 5 m/s and 0.1 mm. TDI trades synchronism for light: signal-to-noise rises as $\\sqrt M$, and a speed error $e$ smears the picture by $Me$ pixels.
`,
  ideas: [
    'A line camera, an encoder and a bright line light make an endless picture as wide as the web; the line rate is the speed divided by the footprint.',
    'The camera looks at a roller so that the distance and focus of the web stay fixed.',
    'Each line is exposed for at most one line period, 20 µs at 50 kHz, so line lights have to be intense.',
    'A TDI sensor adds the light of M lines into one: signal ×M, noise ×√M, so the signal-to-noise ratio rises as √M.',
    'TDI needs synchronism: a fractional speed error e smears the image over M·e pixels.'
  ],
  pitfalls: [
    'Line-scan inspection needs only a camera — It needs the whole cell: a roller to hold the web, an encoder to lock the lines to the motion, a line light of high intensity, and software for the endless picture.',
    'TDI gives more signal at no cost — It needs exact synchronism between the image motion and the charge shifts, and a web that does not change its distance or wander. A 1 % speed error smears 128 rows by 1.3 pixels.',
    'A faster web only needs a faster camera — Every line is exposed for a shorter time as the speed rises, so the light has to grow in proportion to the speed.',
    'One camera covers any web — A single line sensor has up to 16 000 pixels or so, so a wide web at fine resolution is covered by several cameras whose strips are stitched.'
  ],
  terms: [
    { term: 'Web', also: ['moving web', 'continuous material'], def: 'A continuous strip of material, such as paper, film, foil, textile or steel strip, that is made or processed while it moves.' },
    { term: 'Machine direction', also: ['MD', 'cross direction', 'CD'], def: 'The direction of travel of the web is the machine direction; the direction across the web, along the line sensor, is the cross direction.' },
    { term: 'Line light', also: ['line illumination', 'LED bar light'], def: 'A long narrow source, often of LEDs with a cylindrical lens, that lights the single line a line-scan camera looks at.' },
    { term: 'Flat-field correction', also: ['shading correction'], def: 'Dividing each pixel of every line by its reading of a uniform white reference, so that the pixel gain and the light along the line do not appear in the picture.' },
    { term: 'TDI stage', also: ['TDI row', 'integration stage'], def: 'One of the rows of a time-delay-integration sensor. The charge of a line of the image is shifted from stage to stage in step with the image and collects light in each.' },
    { term: 'Smear', also: ['synchronization error', 'motion blur of TDI'], def: 'The blurring of a TDI picture when the charge shifts do not match the image motion exactly; for a fractional speed error e it spreads a line over M·e pixels.' }
  ],
  formulas: [
    {
      name: 'Line rate for square pixels',
      expr: 'fl = v/fp', tex: 'f_L = \\frac{v}{p_{\\mathrm{foot}}}',
      vars: {
        fl: { name: 'line rate', q: 'frequency', unit: 'kHz', tex: 'f_L' },
        v: { name: 'speed of the web', q: 'speed', unit: 'm/s', value: 5, min: 0.01, max: 100, tex: 'v' },
        fp: { name: 'pixel footprint on the web', q: 'length', unit: 'mm', value: 0.1, min: 0.005, max: 10, tex: 'p_{\\mathrm{foot}}' }
      },
      solveFor: 'fl',
      note: 'The web moves one footprint between lines. The exposure of a line can be no longer than 1/f_L.',
      stories: { fl: 'A web runs at {v}. A line-scan camera has a pixel footprint of {fp} on it. What line rate keeps the pixels square?' }
    },
    {
      name: 'Signal-to-noise ratio gained by TDI',
      expr: 'sM = s1*sqrt(M)', tex: '\\mathrm{SNR}_M = \\sqrt{M}\\,\\mathrm{SNR}_1',
      vars: {
        sM: { name: 'signal-to-noise ratio with TDI', tex: '\\mathrm{SNR}_M' },
        s1: { name: 'signal-to-noise ratio of one line', value: 10, min: 0.1, max: 1000, tex: '\\mathrm{SNR}_1' },
        M: { name: 'number of TDI stages', value: 64, min: 1, max: 512, int: true, tex: 'M' }
      },
      solveFor: 'sM',
      note: 'When shot noise dominates; a TDI sensor reads out once for all stages, so the read noise does not grow.'
    },
    {
      name: 'Smear from a speed mismatch',
      expr: 'bl = M*er', tex: 's = M\\,e',
      vars: {
        bl: { name: 'smear at the end of the stages (pixels)', tex: 's' },
        M: { name: 'number of TDI stages', value: 128, min: 1, max: 512, int: true, tex: 'M' },
        er: { name: 'fractional error between image speed and charge shift rate', q: 'ratio', unit: '%', value: 1, min: 0, max: 100, tex: 'e' }
      },
      solveFor: 'bl',
      note: 'An error of a tenth of a pixel in 128 rows is a mismatch of 0.08 %.'
    }
  ],
  examples: [
    {
      title: 'A fast web',
      q: 'A steel strip moves at 3 m/s. The camera needs a footprint of 0.2 mm across the 1.6 m width. What line rate and how many pixels across does it need, and how long can each line be exposed?',
      steps: [
        { text: 'The line rate is', tex: 'f_L = \\frac{3\\ \\mathrm{m/s}}{0.2\\ \\mathrm{mm}} = 15\\ \\mathrm{kHz}' },
        'The pixels across are 1600 mm ÷ 0.2 mm = 8000, which is within one 8k or 16k camera.',
        'Each line is exposed for at most 1 ÷ 15 kHz = 67 µs.'
      ],
      a: '15 kHz, 8000 pixels across (one camera), at most 67 µs of exposure per line.'
    }
  ],
  quiz: [
    { q: 'A web moves at 2 m/s. The pixel footprint is 0.1 mm. What line rate keeps the pixels square, in kilohertz?', answer: 20, unit: 'kHz', why: '2000 mm/s ÷ 0.1 mm = 20 000 lines per second.' },
    { q: 'A TDI sensor with 64 stages replaces an ordinary line sensor. By what factor does the shot-noise-limited signal-to-noise ratio improve, at the same speed?', answer: 8, why: 'The signal grows as M = 64 and the shot noise as √64 = 8, so the ratio improves as √M = 8.' },
    { q: 'A TDI camera with 128 stages has its charge shifted 1 % too fast. What is the smear at the end of the stages?', choices: ['0.01 pixel', '1.3 pixels', '128 pixels', 'none: the sensor corrects for it'], a: 1, why: 'The smear is M × e = 128 × 0.01 = 1.28 pixels.' },
    { q: 'Why does the camera in a web-inspection line look at a roller?', choices: ['to keep the web at a fixed distance, so that focus and scale stay constant', 'to cool the web', 'to avoid the use of an encoder', 'to increase the line rate'], a: 0, why: 'A web in free span flutters, changing its distance and so its magnification and focus. A roller holds it at a fixed distance.' },
    { q: 'The web speed is doubled. What must be done to keep the picture the same?', choices: ['double the line rate and the light', 'halve the line rate', 'double the exposure time', 'nothing'], a: 0, why: 'The line rate must double to keep the pixels square, so the exposure per line halves, and the light must double to compensate.' }
  ],
  applications: [
    'Surface inspection of paper, film, foil and non-woven webs, and print quality on printing presses.',
    'Steel and aluminium strip, glass and plastic sheet, for scratches, dents, coating streaks and pinholes.',
    'Battery electrodes and solar wafers on fast lines.',
    'Satellite pushbroom and TDI cameras, whose orbital motion supplies the line scan.',
    'Slide scanners in pathology, and inspection of wafers and flat-panel displays.'
  ],
  history: 'Line sensors were among the first CCDs made, in the early 1970s. Time delay and integration, in which the charge follows the image across the sensor, became important in space imaging and then in semiconductor and flat-panel inspection, where its sensitivity matters most.',
  sources: [
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems*, 2nd ed. (SPIE Press, 2011) — line and TDI sensors.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications*, 2nd ed. (Wiley-VCH, 2018) — acquisition with line-scan cameras.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — web inspection.'
  ],
  sim: 'ss-tdi'
},

/* ================================================================ optical coherence tomography */
{
  id: 'optical-coherence-tomography', parent: 'scanning-systems', title: 'Optical coherence tomography', level: 3,
  short: 'Optical coherence tomography times the echoes of near-infrared light inside a scattering sample by interference with a reference beam. The axial resolution, about 0.44 λ²/Δλ, is set by the bandwidth of the source; scanning the beam sideways builds cross-sections of the layers.',
  keywords: ['OCT', 'optical coherence tomography', 'low-coherence interferometry', 'A-scan', 'B-scan', 'axial resolution', 'coherence length', 'spectral-domain OCT', 'swept-source OCT', 'time-domain OCT', 'retinal imaging', 'bandwidth', 'cross-section', 'superluminescent diode', 'Fourier domain'],
  prereq: ['michelson-interferometer', 'coherence', 'galvanometer-scanners', 'linewidth-and-coherence-of-lasers'],
  related: ['oct-in-eye-care', 'laser-scanning-microscopes', 'speckle', 'fabry-perot-interferometer', 'grating-spectrometers-and-resolving-power', 'optical-profilers', 'medical-imaging-optics', 'diode-lasers'],
  body: `
Ultrasound pictures the inside of the body from timed echoes of sound. No electronics can time the echoes of light, a million times faster, but an interferometer can. **Optical coherence tomography (OCT)** measures the echoes of near-infrared light from the layers of a scattering sample by interference. It makes cross-sections at a few micrometres' resolution, a millimetre or two deep.

### Low-coherence interferometry
The heart is a Michelson interferometer ([[michelson-interferometer]]) with a broad-band source. One part of the light goes to a reference mirror, the other into the sample, where each layer reflects a little. The two are recombined, and they interfere only where the path to the layer matches the reference path to within the **coherence length** of the source, about $\\lambda^2/\\Delta\\lambda$ ([[coherence]]). That is 14 µm for 840 nm light with a bandwidth of 50 nm. A moving reference mirror therefore makes a burst of fringes each time it passes a layer, and the positions of the bursts are the depths of the layers.

### Axial resolution
For a source with a Gaussian spectrum of width $\\Delta\\lambda$ (full width at half maximum) centred at $\\lambda_0$, the **axial resolution** (the full width of one reflector's response, in air) is

$$\\Delta z = \\frac{2\\ln 2}{\\pi}\\,\\frac{\\lambda_0^2}{\\Delta\\lambda} \\approx 0.44\\,\\frac{\\lambda_0^2}{\\Delta\\lambda}$$

and in tissue it is divided by the refractive index, about 1.38.

| centre | bandwidth | in air | in tissue |
|---|---|---|---|
| 840 nm | 50 nm | 6.2 µm | 4.5 µm |
| 840 nm | 100 nm | 3.1 µm | 2.2 µm |
| 1300 nm | 100 nm | 7.4 µm | 5.4 µm |

The axial resolution depends on the source alone. The **lateral** resolution is set by the focusing optics, as in a microscope, with a gentle focus (a low aperture) that stays narrow through the depth of the sample: the two are independent.

### Scans
One depth profile at one position of the beam is an **A-scan**. Moving the beam across the sample with galvanometer mirrors ([[galvanometer-scanners]]) and stacking the A-scans makes a **B-scan**, a cross-section, and a second sweep a volume. At 100 kHz, a B-scan of 512 A-scans takes 5 ms and a volume of 512 × 512 takes 2.6 s.

### Fourier-domain OCT
Moving a mirror is slow. In **spectral-domain** OCT the sample and reference light enter a spectrometer: a reflector at depth $z$ makes fringes in the spectrum at a frequency proportional to $z$, and a Fourier transform gives the whole A-scan at once, with no moving part and a better sensitivity. Its depth range is limited by the spectrometer's sampling of the spectrum, $\\lambda^2/(4n\\,\\delta\\lambda)$: 2.6 mm in tissue for 840 nm and a step of 0.049 nm. In **swept-source** OCT a laser whose wavelength is swept over about 100 nm, at 100 kHz to several megahertz, replaces the broad source and spectrometer; one photodiode records the fringes in time, and it reaches deeper.

### Limits
Scattering limits the depth to about 1–2 mm in most tissues; the transparent eye can be imaged to its back. [[speckle|Speckle]] gives the images their grain, and motion between A-scans disturbs them. Reading scans is for trained clinicians; this page only explains how a picture is made.

> [!key] OCT is low-coherence interferometry: only reflectors within the coherence length of the reference path show. The axial resolution is $0.44\\lambda^2/\\Delta\\lambda$ (set by the bandwidth), the lateral resolution is set by the focus, and scanning the beam makes B-scans.
`,
  ideas: [
    'A broad-band source interferes only within its coherence length, so the interferometer picks out reflectors at one depth at a time.',
    'Axial resolution = 0.44 λ²/Δλ in air (divide by about 1.38 in tissue): a broader spectrum means finer resolution.',
    'Axial and lateral resolution are independent: bandwidth sets the first, the focusing optics the second.',
    'An A-scan is one depth profile, a B-scan is a cross-section made by scanning the beam, and a volume needs a second sweep.',
    'Spectral-domain and swept-source OCT get the whole depth profile from the Fourier transform of the interference spectrum, much faster and more sensitive than moving a mirror.'
  ],
  pitfalls: [
    'OCT works like ultrasound, timing the echo — Light is far too fast for that. The echo delay is read from interference with a reference beam.',
    'A longer wavelength always gives a sharper image — The axial resolution goes as λ²/Δλ, so at the same bandwidth a longer wavelength is coarser. It penetrates farther, which is why 1300 nm is used for deep tissue.',
    'The lateral resolution improves with the bandwidth — Only the axial resolution does. The lateral resolution is set by the focus, as in a microscope.',
    'An OCT scan is a photograph of a cross-section — It is a map of backscattered light on a grey scale, with speckle. The layers appear where the refractive index changes or the scattering does.'
  ],
  terms: [
    { term: 'Coherence gate', also: ['coherence length', 'coherence window'], def: 'In OCT, the depth range, of order λ²/Δλ, over which light from the sample still interferes with the reference beam. Only reflectors inside the gate are seen at one position of the reference arm.' },
    { term: 'A-scan', also: ['axial scan', 'depth profile'], def: 'A profile of the reflectivity of the sample along the direction of the beam, from one beam position.' },
    { term: 'B-scan', also: ['cross-sectional scan'], def: 'A two-dimensional picture of a section of the sample, made of many A-scans taken as the beam moves across it.' },
    { term: 'Spectral-domain OCT', also: ['SD-OCT', 'Fourier-domain OCT'], def: 'OCT in which the interference spectrum is recorded by a spectrometer and a Fourier transform gives the whole depth profile at once.' },
    { term: 'Swept-source OCT', also: ['SS-OCT'], def: 'OCT with a laser whose wavelength is swept rapidly across a broad range, so that the interference spectrum is recorded in time by a single photodiode.' },
    { term: 'Axial resolution', also: ['depth resolution'], def: 'The smallest separation of two reflectors in depth that OCT shows apart. About 0.44 λ²/Δλ in air for a Gaussian spectrum, set by the source\'s bandwidth.' }
  ],
  formulas: [
    {
      name: 'Axial resolution',
      expr: 'dz = 0.44*lambda^2/(n*dl)', tex: '\\Delta z = \\frac{0.44\\,\\lambda_0^2}{n\\,\\Delta\\lambda}',
      vars: {
        dz: { name: 'axial resolution', q: 'length', unit: 'µm', tex: '\\Delta z' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 840, min: 400, max: 2000, tex: '\\lambda_0' },
        n: { name: 'refractive index of the sample (1 for air)', value: 1.38, min: 1, max: 2, tex: 'n' },
        dl: { name: 'bandwidth of the source (full width at half maximum)', q: 'length', unit: 'nm', value: 50, min: 1, max: 500, tex: '\\Delta\\lambda' }
      },
      solveFor: 'dz',
      note: 'For a Gaussian spectrum; the factor is 2 ln 2 / π = 0.441.',
      stories: { dz: 'An OCT source is centred at {lambda} with a bandwidth of {dl}. What axial resolution does it give in a sample of index {n}?' }
    },
    {
      name: 'Coherence length of the source',
      expr: 'lc = lambda^2/dl', tex: 'l_c = \\frac{\\lambda_0^2}{\\Delta\\lambda}',
      vars: {
        lc: { name: 'coherence length', q: 'length', unit: 'µm', tex: 'l_c' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 840, min: 400, max: 2000, tex: '\\lambda_0' },
        dl: { name: 'bandwidth of the source', q: 'length', unit: 'nm', value: 50, min: 1, max: 500, tex: '\\Delta\\lambda' }
      },
      solveFor: 'lc',
      note: 'A rough measure; different definitions differ by factors of order one.'
    },
    {
      name: 'Depth range of a spectral-domain system',
      expr: 'zm = lambda^2/(4*n*dlam)', tex: 'z_{\\max} = \\frac{\\lambda_0^2}{4\\,n\\,\\delta\\lambda}',
      vars: {
        zm: { name: 'imaging depth range', q: 'length', unit: 'mm', tex: 'z_{\\max}' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 840, min: 400, max: 2000, tex: '\\lambda_0' },
        n: { name: 'refractive index of the sample', value: 1.38, min: 1, max: 2, tex: 'n' },
        dlam: { name: 'spacing of the spectrometer\'s samples in wavelength', q: 'length', unit: 'nm', value: 0.049, min: 0.001, max: 1, tex: '\\delta\\lambda' }
      },
      solveFor: 'zm',
      note: 'Fringes finer than the spectrometer can sample (deeper reflectors) are lost.'
    }
  ],
  examples: [
    {
      title: 'Resolution in tissue',
      q: 'A source at 1300 nm has a bandwidth of 100 nm. What axial resolution does it give in tissue (index 1.38)? How broad a bandwidth is needed for 3 µm at 840 nm in tissue?',
      steps: [
        { text: 'At 1300 nm:', tex: '\\Delta z = \\frac{0.44\\,(1300\\ \\mathrm{nm})^2}{1.38 \\times 100\\ \\mathrm{nm}} = 5.4\\ \\mu\\mathrm{m}' },
        { text: 'For 3 µm at 840 nm:', tex: '\\Delta\\lambda = \\frac{0.44\\,(840\\ \\mathrm{nm})^2}{1.38 \\times 3\\ \\mu\\mathrm{m}} = 75\\ \\mathrm{nm}' }
      ],
      a: '5.4 µm; a bandwidth of about 75 nm at 840 nm gives 3 µm in tissue.'
    }
  ],
  quiz: [
    { q: 'The bandwidth of an OCT source is doubled at the same centre wavelength. The axial resolution…', choices: ['becomes twice as fine', 'becomes twice as coarse', 'is unchanged: only the lateral resolution changes', 'becomes four times finer'], a: 0, why: 'Δz = 0.44 λ²/Δλ is inversely proportional to the bandwidth.' },
    { q: 'What is the axial resolution in air, in micrometres, for a source at 840 nm with a bandwidth of 100 nm?', answer: 3.1, unit: 'µm', why: '0.44 × (840 nm)² ÷ 100 nm = 3105 nm = 3.1 µm.' },
    { q: 'What sets the lateral resolution of an OCT image?', choices: ['the bandwidth of the source', 'the focusing optics of the beam, as in a microscope', 'the speed of the scanner', 'the wavelength of the reference arm'], a: 1, why: 'The axial resolution comes from the coherence gate; the lateral resolution comes from the size of the focused spot, which depends on wavelength and numerical aperture.' },
    { q: 'A swept-source system makes 100 000 A-scans a second. How long does a volume of 512 × 512 A-scans take, in seconds?', answer: 2.62, unit: 's', why: '512 × 512 = 262 144 A-scans ÷ 100 000 per second = 2.6 s.' },
    { q: 'OCT measures the delay of the reflected light directly with a very fast detector.', a: false, why: 'The delay is read from the interference of the reflected light with a reference beam. The timing of light to micrometres of path is beyond the speed of any detector.' }
  ],
  applications: [
    'Eye care: cross-sections of the retina, the optic nerve head and the cornea ([[oct-in-eye-care]]).',
    'Intravascular imaging of artery walls from a catheter with a rotating probe.',
    'Dermatology and dentistry, and endoscopic imaging of the gut and airways.',
    'Art conservation, looking through varnish and paint layers, and coating-thickness measurement in industry.',
    'Inspection of pharmaceutical tablet coatings and of laminated packaging.'
  ],
  history: 'David Huang, James Fujimoto and co-workers at the Massachusetts Institute of Technology published the first OCT images, of the retina and of an artery wall, in *Science* in 1991. Fourier-domain methods, which came to the fore in 2002–03, made it a hundred times faster and more sensitive, and OCT became a routine instrument in eye clinics.',
  sources: [
    'D. Huang et al., "Optical coherence tomography", *Science* 254 (1991) 1178–1181.',
    'A. F. Fercher, W. Drexler, C. K. Hitzenberger and T. Lasser, "Optical coherence tomography — principles and applications", *Reports on Progress in Physics* 66 (2003) 239–303.',
    'W. Drexler and J. G. Fujimoto (eds.), *Optical Coherence Tomography: Technology and Applications*, 2nd ed. (Springer, 2015).'
  ],
  sim: 'ss-oct'
},

/* ================================================================ optical disc pickups */
{
  id: 'optical-disc-pickups', parent: 'scanning-systems', title: 'Optical disc pickups: CD, DVD, Blu-ray', level: 2,
  short: 'A disc pickup focuses a laser spot, about λ/NA across, through the disc onto a spiral track of pits a quarter-wave deep, and reads the changes in the reflected light. The CD, DVD and Blu-ray differ chiefly in wavelength and numerical aperture: 780 nm and 0.45, 650 nm and 0.60, 405 nm and 0.85.',
  keywords: ['optical disc', 'CD', 'DVD', 'Blu-ray', 'pickup', 'optical pickup unit', 'pit', 'land', 'track pitch', 'numerical aperture', 'focus servo', 'tracking servo', 'astigmatic focus', 'four-quadrant detector', 'quarter-wave plate', 'spot size', 'substrate thickness'],
  prereq: ['numerical-aperture', 'the-airy-disk', 'polarizing-beam-splitters', 'wave-plates'],
  related: ['diode-lasers', 'collimating-a-laser-diode', 'diffraction-limited-mtf', 'thin-film-interference', 'optical-isolators-and-modulators', 'spherical-aberration', 'coma'],
  body: `
In a compact disc the music is a spiral track of tiny pits, read by a spot of laser light with nothing touching the disc. The **pickup** is a small optical instrument that has to focus a spot onto a track less than a micrometre wide, keep it there while the disc spins and wobbles, and tell pits from flat land by the light that comes back.

### The path of the light
1. A **laser diode** (780, 650 or 405 nm) gives a beam that a lens makes parallel.
2. A **polarizing beam splitter** passes it, and a **quarter-wave plate** makes it circular ([[wave-plates]]).
3. The **objective lens**, moved by a coil, focuses it through the disc's transparent layer onto the data layer.
4. The reflected light goes back through the objective and the quarter-wave plate, now polarized at 90° to the outgoing beam, so the beam splitter sends it not to the laser but to a **photodetector** ([[polarizing-beam-splitters]]).

### The spot and the pits
The spot is diffraction-limited, and its width at half maximum is about $0.51\\,\\lambda/\\mathrm{NA}$ ([[the-airy-disk]]). The track pitch and the pit lengths shrink with it:

| | CD | DVD | Blu-ray |
|---|---|---|---|
| wavelength | 780 nm | 650 nm | 405 nm |
| numerical aperture | 0.45 | 0.60 | 0.85 |
| spot width at half maximum | 884 nm | 553 nm | 243 nm |
| track pitch | 1.6 µm | 0.74 µm | 0.32 µm |
| shortest pit | 0.83 µm | 0.40 µm | 0.149 µm |
| layer under | 1.2 mm | 0.6 mm | 0.1 mm |
| capacity per layer | 650–700 MB | 4.7 GB | 25 GB |

The spot is larger than the pits. That works because of **interference**: a pit is about $\\lambda/(4n)$ deep, where $n$ is the index of the plastic (about 125, 100 and 60 nm), so light reflected from the bottom of a pit travels half a wavelength farther than light from the land, and the two cancel where the spot straddles an edge. The detector sees the reflected light dip as each pit passes, and the electronics turn that signal into bits.

### Holding the focus
The depth of focus is only about $\\pm\\lambda/(2\\mathrm{NA}^2)$: ±1.9 µm for a CD, ±0.9 µm for a DVD and ±0.28 µm for a Blu-ray, while the disc rises and falls by tenths of a millimetre. A **focus servo** keeps the objective in step. The usual way is astigmatic: a weak cylindrical lens in the return path makes the spot round in focus and elliptical, along one diagonal or the other, when the disc is too near or too far, and a detector in four quadrants reads the difference of the diagonals as the error. A **tracking servo** does the same sideways, from the way the reflection changes as the spot drifts to one side of the track.

### Why the sizes follow the optics
Smaller spots need a shorter wavelength and a larger NA. A larger NA makes the focus more sensitive to a tilt of the disc (the coma goes as the thickness of the layer times NA³), so the Blu-ray cover layer is only 0.1 mm; a DVD has 0.6 mm, with a second disc glued behind it for strength. The shortest marks are read at about half to four fifths of the optical cut-off $2\\mathrm{NA}/\\lambda$.

> [!warn] The diode in a drive is a Class 3B laser behind a Class 1 housing. The 780 nm beam is almost invisible and the 405 nm beam is violet; neither is safe to look into ([[laser-safety-classes]]).

> [!key] The spot is $0.51\\lambda/\\mathrm{NA}$ across, so smaller wavelengths and higher apertures store more on a disc. Pits a quarter-wave deep make the reflected light fall at an edge, and focus and tracking servos hold the spot within a micrometre or less of the track.
`,
  ideas: [
    'The pickup focuses a diffraction-limited spot, about 0.51 λ/NA across, on the track through the transparent layer of the disc.',
    'CD, DVD and Blu-ray use 780 nm/0.45, 650 nm/0.60 and 405 nm/0.85, with track pitches of 1.6, 0.74 and 0.32 µm.',
    'A pit λ/(4n) deep makes the reflected light cancel at its edge, so the pits can be shorter than the spot.',
    'The depth of focus is ±λ/(2NA²), under a micrometre for DVD and Blu-ray, so a focus servo is needed; tracking is a second servo.',
    'The higher the NA, the more a tilt of the disc hurts, hence Blu-ray\'s 0.1 mm cover layer.'
  ],
  pitfalls: [
    'A pit is read when the spot lies fully inside it — The spot is wider than the pit. The signal comes from interference of the light from the pit and its surroundings, which cancels at the edges.',
    'The laser burns the pits as the disc plays — Pits are moulded into the plastic. Only recordable discs are written, by a stronger beam, and the reading beam is too weak to change them.',
    'A blue laser alone gives Blu-ray its capacity — The capacity comes from the blue wavelength together with the high numerical aperture, the thin cover layer and better error correction and coding.',
    'The focus of a pickup is set once — The objective is moved continuously by a focus servo to follow the disc, whose surface moves up and down by fractions of a millimetre.'
  ],
  terms: [
    { term: 'Pit', also: ['land', 'mark'], def: 'A small depression moulded in the data layer of a disc. Pits and the flat areas between them (lands) carry the data, as changes in the reflected light.' },
    { term: 'Track pitch', def: 'The distance between neighbouring turns of the spiral track: 1.6 µm for a CD, 0.74 µm for a DVD and 0.32 µm for a Blu-ray disc.' },
    { term: 'Focus servo', also: ['focus error', 'astigmatic method'], def: 'A feedback loop that moves the objective lens so that the spot stays in focus on the data layer. The error signal usually comes from a four-quadrant detector behind a cylindrical lens.' },
    { term: 'Tracking servo', also: ['tracking error', 'push-pull'], def: 'A feedback loop that moves the spot sideways to stay on the track, from the change in the reflected light as the spot drifts off centre.' },
    { term: 'Optical pickup unit', also: ['OPU', 'pickup'], def: 'The assembly in a disc drive of laser diode, optics, objective with actuator and detector that reads (and in recorders writes) the disc.' },
    { term: 'Cover layer', also: ['substrate', 'disc layer'], def: 'The transparent plastic through which the beam reaches the data layer: 1.2 mm for a CD, 0.6 mm for a DVD, 0.1 mm for a Blu-ray disc.' }
  ],
  formulas: [
    {
      name: 'Width of the focused spot',
      expr: 'd = 0.51*lambda/NA', tex: 'd \\approx \\frac{0.51\\,\\lambda}{\\mathrm{NA}}',
      vars: {
        d: { name: 'width of the spot at half maximum', q: 'length', unit: 'nm', tex: 'd' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 405, min: 200, max: 1100, tex: '\\lambda' },
        NA: { name: 'numerical aperture of the objective', value: 0.85, min: 0.1, max: 1.5, tex: '\\mathrm{NA}' }
      },
      solveFor: 'd',
      note: 'The full width at half maximum of the Airy pattern of a lens that is limited by diffraction.',
      stories: { d: 'A pickup focuses {lambda} light with an objective of numerical aperture {NA}. How wide is the spot at half maximum?' }
    },
    {
      name: 'Depth of a pit',
      expr: 'h = lambda/(4*n)', tex: 'h = \\frac{\\lambda}{4\\,n}',
      vars: {
        h: { name: 'depth of a pit', q: 'length', unit: 'nm', tex: 'h' },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 650, min: 200, max: 1100, tex: '\\lambda' },
        n: { name: 'refractive index of the disc plastic', value: 1.58, min: 1, max: 2, tex: 'n' }
      },
      solveFor: 'h',
      note: 'The reflected light travels twice the depth: half a wavelength in the plastic, so pit and land cancel.'
    },
    {
      name: 'Depth of focus',
      expr: 'dz = lambda/(2*NA^2)', tex: '\\Delta z = \\pm\\frac{\\lambda}{2\\,\\mathrm{NA}^2}',
      vars: {
        dz: { name: 'focus tolerance (each side)', q: 'length', unit: 'µm', tex: '\\Delta z' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 405, min: 200, max: 1100, tex: '\\lambda' },
        NA: { name: 'numerical aperture of the objective', value: 0.85, min: 0.1, max: 1.5, tex: '\\mathrm{NA}' }
      },
      solveFor: 'dz',
      note: 'A rule of thumb (the Rayleigh criterion for defocus); the focus servo must hold the spot within it.'
    },
    {
      name: 'Optical cut-off frequency',
      expr: 'fc = 2*NA/lambda', tex: 'f_c = \\frac{2\\,\\mathrm{NA}}{\\lambda}',
      vars: {
        fc: { name: 'highest spatial frequency the lens passes', q: 'spatialfreq', unit: 'cycles/mm', tex: 'f_c' },
        NA: { name: 'numerical aperture of the objective', value: 0.45, min: 0.1, max: 1.5, tex: '\\mathrm{NA}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 780, min: 200, max: 1100, tex: '\\lambda' }
      },
      solveFor: 'fc',
      note: 'The shortest marks of a disc are read at 50–80 % of this frequency.'
    }
  ],
  examples: [
    {
      title: 'How small is a Blu-ray spot?',
      q: 'A Blu-ray pickup uses light of 405 nm and an objective of NA 0.85. What are the width of the spot, the depth of focus and the depth of a pit in polycarbonate (n = 1.62)? How does the spot compare with the 0.32 µm track pitch?',
      steps: [
        { text: 'The spot at half maximum is', tex: 'd = \\frac{0.51 \\times 405}{0.85} = 243\\ \\mathrm{nm}' },
        { text: 'The depth of focus is', tex: '\\pm\\frac{405\\ \\mathrm{nm}}{2 \\times 0.85^2} = \\pm 0.28\\ \\mu\\mathrm{m}' },
        { text: 'A pit is about', tex: 'h = \\frac{405\\ \\mathrm{nm}}{4 \\times 1.62} = 62\\ \\mathrm{nm}' },
        'The spot is narrower than the 320 nm track pitch, but its skirts reach the neighbouring tracks, which is why tracking is critical.'
      ],
      a: '243 nm, ±0.28 µm of focus, pits 62 nm deep: tracks only 320 nm apart.'
    }
  ],
  quiz: [
    { q: 'Which disc format has the smallest spot, and why?', choices: ['CD: it is the oldest', 'DVD: it has two layers', 'Blu-ray: its wavelength is the shortest and its numerical aperture the highest', 'all three are the same'], a: 2, why: 'The spot goes as λ/NA: 405 nm and 0.85 for Blu-ray against 650 nm and 0.60 for DVD and 780 nm and 0.45 for CD.' },
    { q: 'What is the depth of a pit in a DVD (650 nm, plastic index 1.58), in nanometres?', answer: 103, unit: 'nm', why: 'λ/(4n) = 650 ÷ (4 × 1.58) = 103 nm.' },
    { q: 'Why does the reflected signal dip when the spot crosses the edge of a pit?', choices: ['the pit absorbs the light', 'light from the pit has travelled half a wavelength farther than light from the land, so the two partly cancel', 'the beam is scattered by dust', 'the polarization turns 90°'], a: 1, why: 'The pit is a quarter-wave deep, the double passage makes a half-wave difference, and where the spot covers both the pit and the land the two parts interfere destructively.' },
    { q: 'The depth of focus ±λ/(2NA²) of a Blu-ray pickup, in micrometres, is closest to…', choices: ['±0.28', '±1.9', '±5', '±20'], a: 0, why: '405 nm ÷ (2 × 0.7225) = 280 nm. The focus servo must hold the spot within that while the disc moves by tenths of a millimetre.' },
    { q: 'Why was the Blu-ray cover layer made only 0.1 mm thick?', choices: ['to save plastic', 'the high NA makes the spot very sensitive to disc tilt through the thickness of the layer', 'so that the disc is flexible', 'to make the pits deeper'], a: 1, why: 'Coma from tilt grows with the thickness of the layer and with NA³. A thin cover keeps the tilt tolerance usable at NA 0.85.' }
  ],
  applications: [
    'CD, DVD and Blu-ray players, drives and recorders in computers and consoles.',
    'Archival optical discs for data storage, written by a stronger beam in a recordable layer.',
    'The mastering of discs, with lasers or electron beams cutting the pits in a master.',
    'Pickups used as small sensors: their focus servo measures the position of a surface to micrometres, as in some displacement gauges.',
    'The astigmatic focus method, borrowed from pickups, in the autofocus of microscopes and measuring machines.'
  ],
  history: 'The laser disc of 1978 carried analogue video on a 30 cm disc. Philips and Sony agreed the compact disc standard in 1980 and launched it in 1982 in Japan; the pickup came out of Philips\' research in Eindhoven. The DVD followed in 1996 and the Blu-ray disc in 2006, each time with a shorter wavelength and a higher aperture.',
  sources: [
    'G. Bouwhuis, J. Braat, A. Huijser, J. Pasman, G. van Rosmalen and K. Schouhamer Immink, *Principles of Optical Disc Systems* (Adam Hilger, 1985).',
    'K. A. Schouhamer Immink, "The compact disc story", *Journal of the Audio Engineering Society* 46 (1998) 458–465.',
    'ECMA-130, *Data interchange on read-only 120 mm optical data disks (CD-ROM)*, and IEC 60908, *Audio recording — compact disc digital audio system*.'
  ],
  sim: 'ss-pickup'
}

);
