/* HYPER-OPTICS · content/image-quality-and-mtf.js — the topic "Image quality and MTF" (simulations in sims/image-quality-and-mtf.js, prefix iq-)
 *   resolution-and-contrast, spatial-frequency-and-line-pairs, the-point-spread-function, the-modulation-transfer-function,
 *   diffraction-limited-mtf, system-mtf, nyquist-sampling-and-aliasing, reading-mtf-charts, measuring-mtf,
 *   lens-distortion-and-calibration, relative-illumination-and-shading, bokeh-and-out-of-focus-blur
 */
Hyper.add(

/* ================================================================ resolution and contrast */
{
  id: 'resolution-and-contrast', parent: 'image-quality-and-mtf', title: 'Resolution and contrast', level: 1,
  short: 'Resolving power, the finest bars you can still count, says little by itself. What an image really owes to its optics is the contrast kept at every scale of detail, coarse to fine; "resolution" is only the scale where that contrast has faded below what you can see.',
  keywords: ['resolution', 'resolving power', 'contrast', 'modulation', 'Michelson contrast', 'sharpness', 'acutance', 'limiting resolution', 'detail', 'bar target', 'image quality', 'lines per millimetre'],
  prereq: ['the-airy-disk', 'what-aberrations-are'],
  related: ['spatial-frequency-and-line-pairs', 'the-modulation-transfer-function', 'resolution-limits', 'contrast-sensitivity', 'pixels-per-feature', 'sensor-formats-and-pixel-size'],
  body: `
A lens maker says "100 lines per millimetre". A photographer says "razor sharp". An engineer asks "what is the MTF at 30?" These are three ways of answering one question: how faithfully does an optical system reproduce detail?

### Resolution is a limit, contrast is a curve
The oldest answer is **resolving power**: photograph a chart of finer and finer black-and-white bars and note the finest group you can still count. It is a single number, [[spatial-frequency-and-line-pairs|counted in line pairs per millimetre]]. It has two faults. It depends on the viewer, because where one person stops counting another sees one more group. And it throws away everything *below* the limit, namely how clearly the coarse detail is rendered, which is what the eye mostly judges as sharpness.

The full answer is the **contrast** of the image at each scale of detail. For a pattern of bright and dark bars, contrast is measured as the **modulation**

$$M = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}}$$

A target with bars at levels 200 and 60 has $M = 140/260 = 0.54$. A real lens fills the dark bars with light spilled from the bright ones: the mean level is unchanged, the swing between bright and dark shrinks. Coarse bars lose little. The finer the bars, the more is spilled, until bright and dark look the same and the pattern has vanished. The ratio of image modulation to object modulation, plotted against the fineness of the pattern, is the [[the-modulation-transfer-function|modulation transfer function]]. The "resolution" is just the fineness at which that curve drops below what the viewer or the sensor can detect.

### Two lenses, one number that misleads
The simulation below models two lenses with different faults. Lens A is a little soft everywhere; lens B is very sharp but hazy, with 40 % of its light in a broad halo.

| | 5 lp/mm | 10 lp/mm | 30 lp/mm | 60 lp/mm | resolves to (10 % contrast) |
|---|---|---|---|---|---|
| Lens A (soft) | 0.97 | 0.88 | 0.32 | 0.01 | about 43 lp/mm |
| Lens B (hazy but fine) | 0.85 | 0.64 | 0.53 | 0.46 | about 235 lp/mm |

Lens B "resolves" five times finer, yet lens A has the higher contrast at every frequency up to about 20 lp/mm. Which is better depends on the job: a print at ordinary viewing size lives at low frequencies, pixel-level inspection of a small part lives at high ones.

### What sets the limit you see
The limit is where the contrast falls below a **threshold**, and the threshold is not a property of the lens. The eye detects modulations of a few per cent at its best spatial scale and much less at fine scales ([[contrast-sensitivity]]); a sensor cannot detect a modulation smaller than its [[sensor-noise|noise]] allows; a display and a viewing distance add their own limits. Test reports often quote the frequency at 10 % or at 50 % modulation, and these numbers are only comparable if the threshold is the same.

### Resolution, sharpness and pixel count
Three things are routinely confused. **Pixel count** says how many samples the sensor takes. **Resolution** says how fine a pattern the whole chain, lens included, can still show. **Sharpness** (or acutance) is the impression of crispness at edges, and it rises with contrast at moderate frequencies as much as with the limit. An 8-megapixel camera behind an excellent lens can out-resolve a 24-megapixel one behind a poor lens, and a sensor with more pixels than the lens can feed gains nothing (see [[system-mtf]]).

> [!key] Image quality is the contrast kept at each scale of detail, a curve, not one number. Resolving power is only the point where that curve falls below the threshold of what you can see.
`,
  ideas: [
    'Modulation M = (Imax − Imin)/(Imax + Imin) measures the contrast of a bar pattern; it runs from 0 (flat) to 1 (black and white).',
    'Optics redistributes light: the mean level stays, the swing between bright and dark shrinks, and it shrinks more the finer the pattern.',
    'Resolving power is the finest pattern still visible; it depends on a threshold of contrast and on who is looking.',
    'Two lenses can swap places: one wins at coarse detail with more contrast, the other at fine detail with a higher limit.',
    'Pixel count, resolution and sharpness are three different things.'
  ],
  pitfalls: [
    'The lens that resolves the finest lines is the sharper lens — It only wins at the finest scales. Sharpness as seen in an ordinary print depends on the contrast at coarse and medium scales, where another lens may be ahead.',
    'Blur removes light from the image — Blur only moves it. The mean brightness is unchanged; the bright parts get dimmer by exactly what the dark parts gain.',
    'More megapixels always give more detail — Pixels sample what the lens delivers. Beyond the lens\'s limit, extra pixels record the same blur in finer steps.',
    'Resolution is a property of the lens alone — It belongs to the whole chain: lens, focus, sensor pixels, motion, noise and the viewer\'s threshold.'
  ],
  terms: [
    { term: 'Resolving power', also: ['resolution', 'limiting resolution'], def: 'The finest pattern of bars an imaging system can still show as separate, usually quoted in line pairs per millimetre. It depends on the contrast threshold used to decide "still visible".' },
    { term: 'Modulation', also: ['Michelson contrast', 'contrast', 'M'], def: 'The contrast of a pattern of bright and dark bars: (Imax − Imin)/(Imax + Imin). It is 1 for black and white and 0 for a uniform field.' },
    { term: 'Acutance', also: ['edge sharpness'], def: 'The impression of crispness at an edge, related to how steeply the brightness changes across it. It rises with contrast at medium spatial frequencies.' },
    { term: 'Image quality', def: 'How faithfully an image reproduces the scene: its detail, contrast, noise, distortion and shading together. This topic is about the part that comes from the optics.' }
  ],
  formulas: [
    {
      name: 'Modulation of a pattern',
      expr: 'M = (Imax - Imin)/(Imax + Imin)', tex: 'M = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}}',
      vars: {
        M: { name: 'modulation (0 to 1)', tex: 'M' },
        Imax: { name: 'brightest level', value: 200, min: 0, tex: 'I_{\\max}' },
        Imin: { name: 'darkest level', value: 60, min: 0, tex: 'I_{\\min}' }
      },
      note: 'Levels in any linear unit (grey values of a raw image, lux, cd/m²). Multiply M by 100 for per cent.',
      stories: { M: 'A bar target is imaged with bright bars at {Imax} and dark bars at {Imin}. What is its modulation?' }
    },
    {
      name: 'Modulation in the image',
      expr: 'Mimg = mtf*Mobj', tex: 'M_{\\mathrm{img}} = \\mathrm{MTF}\\cdot M_{\\mathrm{obj}}',
      vars: {
        Mimg: { name: 'modulation in the image', tex: 'M_{\\mathrm{img}}' },
        mtf: { name: 'MTF at that fineness of detail', value: 0.3, min: 0, max: 1, tex: '\\mathrm{MTF}' },
        Mobj: { name: 'modulation of the object', value: 0.54, min: 0, max: 1, tex: 'M_{\\mathrm{obj}}' }
      },
      note: 'The MTF value belongs to one spatial frequency; a different pattern needs a different value.',
      stories: { Mimg: 'A target of modulation {Mobj} is imaged where the MTF is {mtf}. What modulation does the image have?' }
    }
  ],
  examples: [
    {
      title: 'What the lens does to a bar pattern',
      q: 'A target has bright bars at level 200 and dark bars at level 60. At the frequency of its bars the lens has an MTF of 0.30. What are the brightest and darkest levels in the image?',
      steps: [
        { text: 'Object modulation:', tex: 'M_{\\mathrm{obj}} = \\frac{200 - 60}{200 + 60} = 0.54' },
        { text: 'Image modulation:', tex: 'M_{\\mathrm{img}} = 0.30 \\times 0.54 = 0.16' },
        'The mean level, $(200 + 60)/2 = 130$, is unchanged. The image levels are therefore $130\\,(1 \\pm 0.16)$.'
      ],
      a: 'Bright bars at about 151, dark bars at about 109: a swing of 42 instead of 140.'
    },
    {
      title: 'Which lens for which job?',
      q: 'Text with strokes 0.1 mm wide is photographed at a magnification of 0.1, so the strokes are 10 µm wide on the sensor. Use the table of lens A and lens B above. Which lens keeps more contrast at the stroke pitch?',
      steps: [
        'A stroke and the gap beside it make one line pair 0.2 mm long on the page, a frequency of 5 lp/mm on the page.',
        { text: 'On the sensor the pattern is smaller by the magnification, so its frequency is higher by the same factor:', tex: '\\nu_{\\mathrm{img}} = \\frac{\\nu_{\\mathrm{obj}}}{m} = \\frac{5}{0.1} = 50\\ \\mathrm{lp/mm}' },
        'At 50 lp/mm lens A passes about 4 % of the modulation and lens B about 48 %.'
      ],
      a: 'Lens B, by a factor of ten in contrast, even though lens A looked better at 5 and 10 lp/mm. The job fixes the frequency; the frequency fixes the lens.'
    }
  ],
  quiz: [
    { q: 'A bar target has bright bars at level 180 and dark bars at level 20. What is its modulation?', answer: 0.8, why: '$M = (180 - 20)/(180 + 20) = 160/200 = 0.8$. Black bars on a white field would give $M = 1$.' },
    { q: 'A lens images a bar pattern at 30 % of its original modulation. Compared with the object, the mean brightness of the image is…', choices: ['the same', '30 % of the original', 'darker, by the lost contrast', 'brighter, because the dark bars are lifted'], a: 0, why: 'Blur moves light from the bright bars into the dark ones; it does not remove any. The swing falls to 30 %, the average does not change.' },
    { q: 'The lens with the higher limiting resolution always gives the sharper-looking picture at ordinary viewing sizes.', a: false, why: 'Ordinary viewing is dominated by coarse and medium detail. A lens with more contrast there can look sharper even if the other lens resolves finer bars at 5 % contrast.' },
    { q: 'Two lenses both resolve 100 lp/mm. At 20 lp/mm one has a contrast of 0.8 and the other 0.5. Which gives the crisper image of medium detail?', choices: ['The first', 'The second', 'They are identical', 'Cannot be said without the f-number'], a: 0, why: 'The same limit hides different curves. At 20 lp/mm the first passes 80 % of the modulation, the second 50 %, so medium detail is rendered with more contrast.' },
    { q: 'Why does the resolving power quoted for a lens change when a different threshold of visibility is used?', choices: ['The limit is where the contrast curve crosses the threshold, and a different threshold crosses at a different frequency', 'The lens changes when it is measured twice', 'Resolving power is measured in different units', 'Thresholds change the f-number'], a: 0, why: 'The curve is fixed; the limit is where it meets whatever contrast you can still detect. A 10 % threshold and a 5 % threshold give different frequencies.' }
  ],
  applications: [
    'Lens testing at the factory and in the review lab: the contrast curve, not a single number, is what is measured and published.',
    'Choosing a machine-vision lens: the smallest feature to be inspected fixes the spatial frequency on the sensor, and the lens must keep enough contrast there.',
    'Judging a camera purchase: pixel count, lens quality and the contrast at the print size all enter.',
    'Microscopy and astronomy: the same question asked of an objective or a telescope, with the Airy disc setting the ceiling.'
  ],
  history: 'Opticians once rated lenses by resolving power, counting the finest group of a bar chart, and by the clarity of a test object such as the scales of a diatom. In the 1940s and 1950s engineers brought over from communication theory the idea that an imaging system, like an amplifier, has a response at each frequency. P. M. Duffieux applied Fourier analysis to optical images in 1946, and Otto Schade used the same thinking on television and photographic systems. The result is the modulation transfer function.',
  sources: [
    'E. Hecht, *Optics*, ch. 11 (Fourier Optics) — the image as a sum of spatial frequencies and the transfer function.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — the whole subject in one book, from definitions to measurement.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — resolution, contrast and the chain from lens to display.'
  ],
  sim: 'iq-resolve-contrast'
},

/* ================================================================ spatial frequency */
{
  id: 'spatial-frequency-and-line-pairs', parent: 'image-quality-and-mtf', title: 'Spatial frequency and line pairs', level: 1,
  short: 'Spatial frequency counts how many bright-and-dark cycles fit into a unit of length. One line pair is one dark line and one bright line; 50 lp/mm means a pattern repeating every 20 µm. The same pattern can also be counted per pixel, per picture height or per degree.',
  keywords: ['spatial frequency', 'line pair', 'lp/mm', 'cycles per millimetre', 'cycles per pixel', 'line widths per picture height', 'LW/PH', 'TV lines', 'TVL', 'cycles per degree', 'period', 'object space', 'image space'],
  prereq: ['resolution-and-contrast', 'sensor-formats-and-pixel-size'],
  related: ['the-modulation-transfer-function', 'nyquist-sampling-and-aliasing', 'magnification-and-working-distance', 'pixels-per-feature', 'contrast-sensitivity', 'visual-acuity-charts', 'math:fourier-series'],
  body: `
Any pattern that repeats, such as the bars of a test chart, the teeth of a comb or the rows of a sensor, has a period $p$, the length of one repeat. Its **spatial frequency** is the number of repeats in a unit of length:

$$\\nu = \\frac{1}{p}$$

In optics the unit is usually **line pairs per millimetre** (lp/mm), identical to *cycles per millimetre*. A **line pair** is one dark line plus one bright line, a full cycle. A pattern of 100 lp/mm repeats every 10 µm, so each line is 5 µm wide.

### The same pattern in five dialects
| Frequency | Period | One line | Line widths per picture height (24 mm) | Cycles per pixel (5 µm pixels) |
|---|---|---|---|---|
| 10 lp/mm | 100 µm | 50 µm | 480 | 0.05 |
| 50 lp/mm | 20 µm | 10 µm | 2 400 | 0.25 |
| 100 lp/mm | 10 µm | 5 µm | 4 800 | 0.50 |
| 200 lp/mm | 5 µm | 2.5 µm | 9 600 | 1.00 |

- **Line pairs per millimetre** (or cycles/mm) is the lens maker's unit.
- **Lines per millimetre** is a trap. Some makers mean line pairs, others count every dark and every bright line separately, which gives twice the number. Check the definition before comparing two figures.
- **Cycles per pixel** is the sensor's unit: ν multiplied by the pixel pitch. The most the pixels can carry is 0.5 cycles per pixel, one dark and one bright pixel, which is the [[nyquist-sampling-and-aliasing|Nyquist limit]].
- **Line widths per picture height** (LW/PH) and the older **TV lines** count single lines over the height of the picture. A sensor with 4 000 rows cannot show more than 4 000 LW/PH, which is 2 000 line pairs per picture height.
- **Cycles per degree** is the eye's unit: the pattern's frequency on the retina, measured in angle. Twenty-twenty vision resolves about 30 cycles per degree, two arc-minutes per line pair (see [[the-fovea-and-visual-acuity]]).

### Object space and image space
A lens changes the size of a pattern by the magnification $m$, so it changes the frequency by the inverse factor:

$$\\nu_{\\mathrm{img}} = \\frac{\\nu_{\\mathrm{obj}}}{|m|}$$

A bar pattern of 5 lp/mm on a page photographed at $m = 0.1$ arrives on the sensor as 50 lp/mm. This is why a lens datasheet's resolution in "lp/mm" always needs the question *where?*: on the sensor (image space, the usual convention for MTF) or on the object (the machine-vision convention when the field of view is fixed).

### Picking a frequency to care about
- **The Nyquist frequency of the sensor**: $1000/(2p)$ lp/mm for pitch $p$ in µm: 100 lp/mm for 5 µm pixels, 145 for 3.45 µm, 208 for 2.4 µm.
- **The smallest feature of the job**: a defect that is $w$ wide needs detail at least as fine as a line pair of width $2w$; see [[pixels-per-feature]].
- **The print**: at 1 arc-minute per line the eye resolves about 4–7 lp/mm on a print held at 40–25 cm. A full-frame image enlarged to a print 8 times wider turns that into roughly 30–55 lp/mm on the sensor.

> [!key] Spatial frequency is the inverse of the period of a pattern: ν = 1/p. A line pair is one dark and one bright line, so lp/mm is a count of cycles; divide by the magnification to move from the image back to the object.
`,
  ideas: [
    'Spatial frequency ν = 1/p counts cycles per unit length; in optics, line pairs per millimetre.',
    'One line pair is one dark and one bright line, a full cycle; each line is half a period.',
    '"Lines per millimetre" is ambiguous: it may count line pairs or single lines (twice as many).',
    'Per pixel, the highest carriable frequency is 0.5 cycles per pixel, the Nyquist limit.',
    'The magnification scales the pattern: ν_image = ν_object / |m|.'
  ],
  pitfalls: [
    'A line pair is a single line — It is a dark and a bright line together. 100 lp/mm means lines 5 µm wide, not 10 µm.',
    '"100 lines/mm" always means 100 line pairs/mm — Some catalogues count each line, so it may be only 50 line pairs. Read the definition.',
    'A lens datasheet\'s lp/mm refers to the object — The convention for MTF and for most photographic lenses is image space: the frequency on the sensor.',
    'More pixels per mm always means more detail — The pixel pitch sets only the ceiling at 0.5 cycles per pixel; the lens decides what actually arrives.'
  ],
  terms: [
    { term: 'Spatial frequency', also: ['ν', 'cycles per millimetre', 'cy/mm'], def: 'The number of repeats of a pattern per unit length, the inverse of its period. The unit is lp/mm in optics, cycles per pixel on a sensor, cycles per degree for the eye.' },
    { term: 'Line pair', also: ['lp', 'cycle'], def: 'One dark line and one bright line, a full period of a bar pattern. The unit of resolution is lp/mm.' },
    { term: 'Line widths per picture height', also: ['LW/PH', 'TV lines', 'TVL'], def: 'A count of single lines across the height of a picture, twice the number of line pairs. Used for television and camera tests.' },
    { term: 'Cycles per pixel', also: ['c/p', 'cycles/pixel'], def: 'Spatial frequency times pixel pitch. A sensor can carry at most 0.5 cycles per pixel.' },
    { term: 'Object space and image space', def: 'The two sides of a lens. A frequency measured on the object is divided by the magnification to give the frequency on the image.' }
  ],
  formulas: [
    {
      name: 'Spatial frequency from the period',
      expr: 'nu = 1/p', tex: '\\nu = \\frac{1}{p}',
      vars: {
        nu: { name: 'spatial frequency', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu' },
        p: { name: 'period (one line pair)', q: 'length', unit: 'µm', value: 20 }
      },
      stories: { nu: 'A bar pattern repeats every {p}. What is its spatial frequency?', p: 'A pattern of {nu} is drawn. How long is one line pair?' }
    },
    {
      name: 'Object and image frequency',
      expr: 'nuI = nuO/m', tex: '\\nu_{\\mathrm{img}} = \\frac{\\nu_{\\mathrm{obj}}}{m}',
      vars: {
        nuI: { name: 'frequency on the image', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_{\\mathrm{img}}' },
        nuO: { name: 'frequency on the object', q: 'spatialfreq', unit: 'lp/mm', value: 5, tex: '\\nu_{\\mathrm{obj}}' },
        m: { name: 'magnification (size of image ÷ size of object, taken positive)', value: 0.1, min: 0.001, max: 100 }
      },
      stories: { nuI: 'A pattern of {nuO} on an object is imaged at a magnification of {m}. What is its frequency on the sensor?' }
    },
    {
      name: 'Cycles per pixel',
      expr: 'cpp = nu*pitch', tex: 'c = \\nu \\, p_{\\mathrm{px}}',
      vars: {
        cpp: { name: 'cycles per pixel', tex: 'c' },
        nu: { name: 'spatial frequency', q: 'spatialfreq', unit: 'lp/mm', value: 50 },
        pitch: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5, tex: 'p_{\\mathrm{px}}' }
      },
      note: 'Above 0.5 cycles per pixel the pattern cannot be recorded faithfully (Nyquist).',
      stories: { cpp: 'A pattern of {nu} falls on a sensor with {pitch} pixels. How many cycles per pixel is that?' }
    },
    {
      name: 'Line widths per picture height',
      expr: 'LW = 2*nu*H', tex: '\\mathrm{LW/PH} = 2\\,\\nu\\,H',
      vars: {
        LW: { name: 'line widths per picture height', tex: '\\mathrm{LW/PH}' },
        nu: { name: 'spatial frequency', q: 'spatialfreq', unit: 'lp/mm', value: 50 },
        H: { name: 'picture height on the sensor', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'The factor 2 turns line pairs into single lines.'
    }
  ],
  examples: [
    {
      title: 'The Nyquist frequency of a camera',
      q: 'A full-frame sensor, 36 mm × 24 mm, has 6 000 × 4 000 pixels. What are its pixel pitch, Nyquist frequency and the largest number of line pairs per picture height it can show?',
      steps: [
        { text: 'Pitch:', tex: 'p = \\frac{36\\ \\mathrm{mm}}{6000} = 6\\ \\mu\\mathrm{m}' },
        { text: 'The Nyquist frequency is one cycle per two pixels:', tex: '\\nu_N = \\frac{1}{2p} = \\frac{1}{12\\ \\mu\\mathrm{m}} = 83\\ \\mathrm{lp/mm}' },
        { text: 'Over the 24 mm height:', tex: '83.3 \\times 24 = 2000\\ \\mathrm{lp/PH} = 4000\\ \\mathrm{LW/PH}' }
      ],
      a: '6 µm, 83 lp/mm, 2 000 line pairs (4 000 line widths) per picture height: one line per pixel row.'
    },
    {
      title: 'From a page to a sensor',
      q: 'Hairlines 0.1 mm wide on a drawing are photographed at magnification 0.05 by a camera with 3.45 µm pixels. Can the pixels carry a pattern that fine?',
      steps: [
        'On the sensor the lines are $0.1 \\times 0.05 = 5\\ \\mu$m wide, about 1.4 pixels.',
        { text: 'A pattern whose lines are that wide, with gaps as wide again, repeats every 10 µm:', tex: '\\nu = \\frac{1}{10\\ \\mu\\mathrm{m}} = 100\\ \\mathrm{lp/mm}' },
        'The Nyquist frequency is $1000/(2 \\times 3.45) = 145$ lp/mm, so 100 lp/mm is below the limit: 0.345 cycles per pixel.'
      ],
      a: 'Yes, the pixels can carry it, though only the lens\'s contrast at 100 lp/mm decides whether they will see it.'
    }
  ],
  quiz: [
    { q: 'A bar pattern repeats every 25 µm. What is its spatial frequency in lp/mm?', answer: 40, unit: 'lp/mm', why: '$\\nu = 1/p = 1/0.025\\ \\mathrm{mm} = 40$ lp/mm. Each line is 12.5 µm wide.' },
    { q: 'A catalogue says a lens resolves "100 lines/mm". Which reading can you be sure of?', choices: ['It is exactly 100 line pairs/mm', 'It is exactly 50 line pairs/mm', 'You must read the definition: it may be 100 line pairs or 100 single lines', 'It means 100 pixels per millimetre'], a: 2, why: 'There is no universal rule. Some makers count line pairs, others count every dark and bright line, which halves the number of line pairs.' },
    { q: 'A subject is photographed at magnification 0.2. A pattern on it of 10 lp/mm appears on the sensor at…', choices: ['2 lp/mm', '10 lp/mm', '50 lp/mm', '200 lp/mm'], a: 2, why: 'The image is five times smaller, so the pattern is five times finer: $10/0.2 = 50$ lp/mm.' },
    { q: 'What is the highest spatial frequency, in cycles per pixel, a sensor can record without aliasing?', answer: 0.5, why: 'One dark and one bright pixel make one cycle, so the Nyquist limit is 0.5 cycles per pixel.' },
    { q: 'A 4 000-row sensor can show at most 4 000 line pairs per picture height.', a: false, why: 'A line pair needs two pixels, a dark and a bright. 4 000 rows carry 2 000 line pairs, which is 4 000 line widths.' }
  ],
  applications: [
    'Lens datasheets and MTF charts, which use lp/mm on the sensor so that lenses can be compared at the same frequencies.',
    'Choosing sensor pixel size to match a lens: the Nyquist frequency should sit near where the lens still passes contrast.',
    'Test charts and print resolution: each is stated in line pairs per millimetre or per picture height.',
    'Display and television engineering, where lines per picture height and cycles per degree have been used for decades.'
  ],
  history: 'The word "frequency" for a pattern in space comes from Fourier analysis, which treats a picture as a sum of sinusoidal gratings. Resolution was counted in "lines" in television and film long before it was counted in cycles; the confusion between a line and a line pair dates from then.',
  sources: [
    'J. W. Goodman, *Introduction to Fourier Optics* — the chapter on frequency analysis of optical imaging systems, spatial frequency and the transfer function.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — cycles per milliradian, per pixel and per millimetre, and conversions between them.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — spatial frequency in object and image space.'
  ],
  sim: 'iq-line-pairs'
},

/* ================================================================ point spread function */
{
  id: 'the-point-spread-function', parent: 'image-quality-and-mtf', title: 'The point-spread function', level: 2,
  short: 'The point-spread function (PSF) is the image a system makes of a single point of light. Every picture is the object with each of its points replaced by a copy of that blur, the operation called convolution. The image of a line is the line-spread function; the image of an edge is the edge-spread function.',
  keywords: ['point spread function', 'PSF', 'line spread function', 'LSF', 'edge spread function', 'ESF', 'convolution', 'blur', 'impulse response', 'isoplanatic', 'shift invariance', 'blur kernel'],
  prereq: ['spatial-frequency-and-line-pairs', 'the-airy-disk', 'what-aberrations-are'],
  related: ['the-modulation-transfer-function', 'measuring-mtf', 'spot-diagrams-and-ray-fans', 'circle-of-confusion', 'bokeh-and-out-of-focus-blur', 'fourier-optics', 'ghosts-flare-and-stray-light'],
  body: `
Look at a star through a telescope or at a distant street lamp at night through a camera. A point of light does not arrive as a point: it arrives as a small patch of light, perhaps with rings, perhaps with a tail. That patch is the **point-spread function**, PSF. It is the system's answer to the simplest possible object, and the complete description of its sharpness.

### An image is a pile of PSFs
Any scene is a collection of points of different brightness. Each one produces its own copy of the PSF, scaled to its brightness and centred where the point should have landed. The image is the sum of all the copies. That operation, replacing every point with a blurred copy and adding, is **convolution**:

$$\\text{image} = \\text{object} \\ast \\mathrm{PSF}$$

In words: slide the PSF over the ideal image, and at each position let it add up the neighbouring brightness weighted by the PSF. Two things follow at once. A narrow PSF changes the picture little. And the PSF of a chain (lens, then filter, then pixel) is the convolution of the separate PSFs, so the blurs add up, as they do in the [[system-mtf|system MTF]].

The recipe holds where the PSF is the same everywhere, which is called **shift invariance**. Real lenses are only approximately so: their PSF changes with position in the field (see [[reading-mtf-charts]]), and optics designers work in small patches, "isoplanatic patches", over which it is constant.

### Line and edge
Two simpler responses are easier to measure.

| Response | The object | What it is | How it is made |
|---|---|---|---|
| PSF | one point | the two-dimensional blur | an Airy pattern, a spot diagram, a scatter of light |
| LSF | one infinitely thin line | the PSF added up along the line | a one-dimensional profile |
| ESF | one sharp edge | the step blurred into a ramp | the running sum of the LSF |

A sharp edge is easy to make, so measuring practice goes the other way: record the ESF, differentiate it to find the LSF, and take its Fourier transform to find the [[the-modulation-transfer-function|MTF]] (see [[measuring-mtf]]).

### What shapes a PSF
- **Diffraction** gives a perfect lens an Airy pattern, 2.44 λN across to the first dark ring ([[the-airy-disk]]): 10.7 µm at f/8. About 84 % of the light is in the central disc.
- **Aberrations** make the PSF larger and lopsided: a comet's tail for coma, a cross for astigmatism ([[what-aberrations-are]]).
- **Defocus** gives a disc, about $\\Delta z/N$ across for a focus error $\\Delta z$.
- **Motion** smears the point into a line of length $v\\,t$.
- **The pixel** averages over its own square, a box of one pitch.
- **Scatter and flare** add a faint, very wide halo around the core ([[ghosts-flare-and-stray-light]]).

Widths are measured as the full width at half maximum (FWHM); for a Gaussian of standard deviation $\\sigma$ it is $2.355\\sigma$. Blurs that are roughly Gaussian combine as $w^2 = w_1^2 + w_2^2$.

### Why the PSF is not the whole story
The PSF carries everything, but its shape is hard to compare by eye: a tall narrow core with a faint broad halo and a wide soft hump can have the same FWHM and look quite different. The Fourier transform of the PSF is the transfer function, which separates the scales of detail and gives a curve that can be read at a glance.

> [!key] The PSF is the image of a point; every image is the object convolved with it. The line- and edge-spread functions are its integrals, and its Fourier transform is the transfer function.
`,
  ideas: [
    'The PSF is the image of a point of light; it describes the sharpness of the system completely.',
    'An image is the object convolved with the PSF: every point is replaced by a scaled copy of the blur.',
    'The line-spread function is the PSF summed along a line; the edge-spread function is the running sum of the LSF.',
    'Diffraction, aberrations, defocus, motion and the pixel each have their own PSF, and in a chain the PSFs convolve.',
    'The Fourier transform of the PSF is the transfer function, the subject of the next page.'
  ],
  pitfalls: [
    'The PSF is the same thing as the Airy disc — The Airy disc is the PSF of a perfect circular lens. Real lenses add aberrations, defocus and scatter to it.',
    'A lens has one PSF — It has a different PSF at every position in the field and at every aperture, focus and wavelength.',
    'Convolution makes an image sharper when applied again — It makes it blurrier: each convolution adds a blur. Sharpening needs the inverse operation, deconvolution, which amplifies noise.',
    'Two blurs of 3 µm and 4 µm make a blur of 7 µm — Gaussian-like blurs add in quadrature: 5 µm.'
  ],
  terms: [
    { term: 'Point-spread function', also: ['PSF', 'impulse response'], def: 'The image an imaging system makes of an ideal point source. It describes the blur completely, for the point of the field where it was measured.' },
    { term: 'Line-spread function', also: ['LSF'], def: 'The image of an infinitely thin line: the PSF summed along the direction of the line. Its Fourier transform is the MTF in the direction across the line.' },
    { term: 'Edge-spread function', also: ['ESF', 'edge response'], def: 'The image of a sharp edge between a dark and a bright half-plane, a ramp rather than a step. It is the running sum of the LSF.' },
    { term: 'Convolution', also: ['blurring'], def: 'The operation of replacing every point of a picture by a copy of the PSF scaled to its brightness and adding the copies. The image of a scene is its convolution with the PSF.' },
    { term: 'FWHM', also: ['full width at half maximum'], def: 'The width of a peak measured between the points where it has fallen to half its height. For a Gaussian it is 2.355 times the standard deviation.' },
    { term: 'Isoplanatic patch', also: ['shift invariance'], def: 'A region of the field over which the PSF is practically the same, so that the blur can be treated as a plain convolution.' }
  ],
  formulas: [
    {
      name: 'Width of a Gaussian blur',
      expr: 'w = 2*sqrt(2*ln(2))*s', tex: 'w_{\\mathrm{FWHM}} = 2\\sqrt{2\\ln 2}\\;\\sigma',
      vars: {
        w: { name: 'full width at half maximum', q: 'length', unit: 'µm', tex: 'w_{\\mathrm{FWHM}}' },
        s: { name: 'standard deviation of the PSF', q: 'length', unit: 'µm', value: 5, tex: '\\sigma' }
      },
      note: 'The coefficient is 2.355.',
      stories: { w: 'A lens makes a Gaussian blur with a standard deviation of {s}. What is its full width at half maximum?' }
    },
    {
      name: 'Two blurs in a chain',
      expr: 'wt = sqrt(w1^2 + w2^2)', tex: 'w_{\\mathrm{tot}} = \\sqrt{w_1^2 + w_2^2}',
      vars: {
        wt: { name: 'width of the combined blur', q: 'length', unit: 'µm', tex: 'w_{\\mathrm{tot}}' },
        w1: { name: 'width of the first blur', q: 'length', unit: 'µm', value: 6, tex: 'w_1' },
        w2: { name: 'width of the second blur', q: 'length', unit: 'µm', value: 8, tex: 'w_2' }
      },
      note: 'Exact for Gaussians, a good rule of thumb for similar smooth blurs. Not for a disc plus a disc.',
      stories: { wt: 'A lens blurs a point to {w1} and the sensor adds {w2}. How wide is the result, assuming both are Gaussian-like?' }
    },
    {
      name: 'The Airy disc, the PSF of a perfect lens',
      expr: 'd = 2.44*lambda*N', tex: 'd = 2.44\\,\\lambda\\,N',
      vars: {
        d: { name: 'diameter to the first dark ring', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      stories: { d: 'A perfect lens at f/{N} images a point in {lambda} light. How wide is the central disc of its PSF?' }
    }
  ],
  examples: [
    {
      title: 'A lens plus a sensor',
      q: 'A lens makes an almost Gaussian blur of FWHM 6 µm. The camera adds a further Gaussian-like blur of 8 µm. How wide is the PSF of the pair, and what is the standard deviation of the lens\'s blur alone?',
      steps: [
        { text: 'Blurs add in quadrature:', tex: 'w = \\sqrt{6^2 + 8^2} = 10\\ \\mu\\mathrm{m}' },
        { text: 'The lens\'s own standard deviation from its FWHM:', tex: '\\sigma = \\frac{6}{2.355} = 2.55\\ \\mu\\mathrm{m}' }
      ],
      a: 'The combined PSF is 10 µm wide (not 14). The lens contributes a standard deviation of 2.55 µm. Improving either part by half helps less than the arithmetic sum suggests, because the larger term dominates.'
    },
    {
      title: 'The star on the sensor',
      q: 'A star is imaged by a perfect lens at f/4 in green light (550 nm) on a sensor with 3 µm pixels. How many pixels wide is the central disc of its PSF?',
      steps: [
        { text: 'The Airy disc:', tex: 'd = 2.44 \\times 0.55\\ \\mu\\mathrm{m} \\times 4 = 5.4\\ \\mu\\mathrm{m}' },
        'In pixels of 3 µm: $5.4/3 = 1.8$ pixels. About 84 % of the star\'s light falls in that central disc, the rest in faint rings.'
      ],
      a: 'About 1.8 pixels across, so a perfect lens at f/4 on this sensor is pixel-limited, not diffraction-limited.'
    }
  ],
  quiz: [
    { q: 'What is the point-spread function?', choices: ['The image a system makes of a single point of light', 'The brightness of the brightest point in a picture', 'The sharpest point of the image field', 'The distance over which a point can be focused'], a: 0, why: 'It is the system\'s response to an ideal point, the impulse response of the lens.' },
    { q: 'An image is formed by convolving the object with the PSF. What does this mean in practice?', choices: ['Every object point is replaced by a copy of the PSF scaled to its brightness, and the copies add', 'The PSF is added to the picture once, in one place', 'The picture is multiplied by the PSF', 'The brightest points are removed'], a: 0, why: 'Convolution is a sliding weighted sum: each point of the object contributes a scaled PSF, and the image is the total.' },
    { q: 'The edge-spread function is the running sum (the integral) of the line-spread function.', a: true, why: 'A step is the integral of a thin line, so the response to an edge is the integral of the response to a line. Differentiating a measured edge gives back the LSF.' },
    { q: 'Two Gaussian blurs of FWHM 3 µm and 4 µm are applied in turn. What is the FWHM of the result, in µm?', answer: 5, unit: 'µm', why: 'Gaussian blurs add in quadrature: $\\sqrt{3^2 + 4^2} = 5$ µm, not 7.' },
    { q: 'A PSF has a sharp core and a faint wide halo. Why is its FWHM a poor summary?', choices: ['The FWHM sees only the core, while the halo lowers contrast at every scale', 'The FWHM is always the same for every PSF', 'The halo has no effect on the image', 'The FWHM cannot be computed for a halo'], a: 0, why: 'The half-maximum width ignores the broad, low tails, yet a few tens of per cent of the light there is what makes a picture look hazy. The transfer function shows it.' }
  ],
  applications: [
    'Astronomy: stars are point sources, so the image of a star is the PSF; the PSF is used to sharpen images and measure the seeing.',
    'Deconvolution and image restoration: a measured PSF lets software undo part of the blur, in microscopy, astronomy and phone cameras.',
    'Lens design: the spot diagram is a geometric estimate of the PSF, and the design is tuned until the PSF is small enough.',
    'Microscopy: the PSF of an objective is measured with fluorescent beads smaller than the resolution.'
  ],
  history: 'Convolution as the description of imaging grew from the work of P. M. Duffieux in the 1940s and from the linear-systems thinking of communications engineers. Astronomers used the star image as a measure of telescope and atmosphere long before; the Airy pattern of 1835 is the oldest example of a point-spread function.',
  sources: [
    'J. W. Goodman, *Introduction to Fourier Optics* — impulse response, convolution and the transfer function of imaging systems.',
    'E. Hecht, *Optics*, ch. 10 (Diffraction) and ch. 11 (Fourier Optics) — the Airy pattern and the convolution theorem.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — PSF, LSF and ESF and the relations among them.'
  ],
  sim: 'iq-psf'
},

/* ================================================================ the MTF */
{
  id: 'the-modulation-transfer-function', parent: 'image-quality-and-mtf', title: 'The modulation transfer function (MTF)', level: 2,
  short: 'The MTF is the fraction of contrast an optical system keeps, plotted against the fineness of the detail: 1 for coarse patterns, falling towards 0 as the bars get finer. It is the Fourier transform of the point-spread function, and it is the standard way of stating how sharp a lens is.',
  keywords: ['MTF', 'modulation transfer function', 'optical transfer function', 'OTF', 'phase transfer function', 'PTF', 'contrast transfer function', 'CTF', 'square wave', 'sine wave', 'MTF50', 'MTF10', 'contrast', 'sharpness curve'],
  prereq: ['the-point-spread-function', 'spatial-frequency-and-line-pairs'],
  related: ['resolution-and-contrast', 'diffraction-limited-mtf', 'system-mtf', 'reading-mtf-charts', 'measuring-mtf', 'fourier-optics', 'contrast-sensitivity', 'math:fourier-series'],
  body: `
Take a target whose brightness varies smoothly as a sine wave, one frequency at a time, and photograph it. Two things come back. The picture is again a sine wave of the *same* frequency: a linear system cannot invent new ones. But its swing is smaller. The **modulation transfer function** is how much smaller, for every frequency:

$$\\mathrm{MTF}(\\nu) = \\frac{M_{\\mathrm{img}}(\\nu)}{M_{\\mathrm{obj}}(\\nu)}, \\qquad M = \\frac{I_{\\max} - I_{\\min}}{I_{\\max} + I_{\\min}}$$

At $\\nu = 0$ there is no detail and the response is 1. As the pattern gets finer the response falls; where it reaches 0 the pattern is invisible. The curve is the complete description of how the system treats contrast at each scale of detail.

### Where the curve comes from
Every pattern is a sum of sine waves ([[math:fourier-series|Fourier]]), and the image is the object convolved with the [[the-point-spread-function|point-spread function]]. Convolution in space is multiplication in frequency, so:

- the **optical transfer function** (OTF) is the Fourier transform of the PSF, scaled to 1 at zero frequency;
- its magnitude is the **MTF**, the loss of contrast;
- its phase is the **phase transfer function** (PTF), a sideways shift of the pattern. The shift is zero for a symmetrical PSF and nonzero for coma. Where a badly defocused lens drives the OTF negative the pattern is *reversed*, bright bars becoming dark, which an MTF plot, being a magnitude, does not show.

A narrow PSF gives a broad MTF and a broad PSF a narrow MTF: sharp in space means wide in frequency.

### How to read it
| Reading | Meaning |
|---|---|
| MTF at a fixed frequency (10, 30 lp/mm) | the contrast kept at that scale: how crisp medium detail looks |
| **MTF50** | the frequency where the curve falls to 0.5; the figure used for camera and lens reviews |
| **MTF10** (or MTF5) | the frequency where it is 10 % (5 %): the practical limit of resolution |
| the area under the curve | one number summing the whole response, used in some image-quality metrics |

For a Gaussian PSF of standard deviation $\\sigma$ the curve is $\\exp(-2\\pi^2\\sigma^2\\nu^2)$ and the MTF50 is at $0.187/\\sigma$: 47 lp/mm for $\\sigma = 4$ µm. A perfect lens has a curve of its own, the [[diffraction-limited-mtf|diffraction-limited MTF]], which is the ceiling for every real lens.

### Sine waves and bar targets
Pure sine targets are awkward to print, so bars (a square wave) are used. A square wave of frequency $\\nu$ contains also $3\\nu$, $5\\nu$, and so on, and the response to bars, the **contrast transfer function** (CTF), is therefore larger than the MTF at the same frequency:

$$\\mathrm{CTF}(\\nu) = \\frac{4}{\\pi}\\left[\\mathrm{MTF}(\\nu) - \\frac{\\mathrm{MTF}(3\\nu)}{3} + \\frac{\\mathrm{MTF}(5\\nu)}{5} - \\dots\\right]$$

Read a bar-chart "MTF" as a CTF unless the maker says the numbers have been converted.

### What the MTF cannot say
It is measured at one point of the field, in one direction, at one aperture, focus and wavelength, so a lens has many MTF curves ([[reading-mtf-charts]]). It assumes a linear, shift-invariant system, so it ignores [[ghosts-flare-and-stray-light|flare]] outside the measurement, [[lens-distortion-and-calibration|distortion]] and [[relative-illumination-and-shading|shading]], and the noise.

> [!key] MTF(ν) is the fraction of the modulation kept at spatial frequency ν: the magnitude of the Fourier transform of the PSF. MTF50 and MTF10 name the frequencies where it falls to 50 % and 10 %.
`,
  ideas: [
    'A linear system returns a sine wave at the same frequency with a smaller swing; the MTF is the ratio, frequency by frequency.',
    'The MTF is the magnitude of the Fourier transform of the PSF; a narrow PSF gives a wide MTF.',
    'MTF50 and MTF10 are the frequencies where the curve falls to one half and to a tenth.',
    'Bars give the CTF, larger than the sine-wave MTF because the square wave carries harmonics.',
    'Every MTF belongs to one place in the field, one direction, one aperture and one focus.'
  ],
  pitfalls: [
    'The MTF is a single number — It is a curve; "the MTF" of a lens means its value at a stated frequency, or the whole curve.',
    'An MTF of 0.5 means half of the detail is lost — It means the contrast of that one frequency is halved. Finer detail loses more, coarser detail less.',
    'Bar-chart contrast and MTF are the same — Bars carry harmonics, so the bar response (CTF) is higher than the sine-wave MTF at the same frequency.',
    'The MTF shows contrast reversal — It is a magnitude. Where the transfer function goes negative the picture reverses, which is invisible in the usual plot ("spurious resolution").'
  ],
  terms: [
    { term: 'Modulation transfer function', also: ['MTF'], def: 'The ratio of image modulation to object modulation as a function of spatial frequency. It is the magnitude of the Fourier transform of the point-spread function, normalised to 1 at zero frequency.' },
    { term: 'Optical transfer function', also: ['OTF'], def: 'The complex Fourier transform of the PSF. Its magnitude is the MTF, its phase the phase transfer function.' },
    { term: 'Phase transfer function', also: ['PTF'], def: 'The sideways displacement of each sine component of the image, as a fraction of a period. Zero for a symmetrical PSF.' },
    { term: 'MTF50', also: ['MTF10', 'MTF30'], def: 'The spatial frequency at which the MTF falls to 50 % (or 10 %, 30 %). MTF50 is the usual single-number summary of sharpness; MTF10 is close to the visual limit of resolution.' },
    { term: 'Contrast transfer function', also: ['CTF', 'square-wave response'], def: 'The response of a system to a bar pattern (a square wave) rather than a sine wave. At a given frequency it is higher than the MTF.' }
  ],
  formulas: [
    {
      name: 'The definition of MTF',
      expr: 'mtf = Mimg/Mobj', tex: '\\mathrm{MTF} = \\frac{M_{\\mathrm{img}}}{M_{\\mathrm{obj}}}',
      vars: {
        mtf: { name: 'MTF at this frequency', tex: '\\mathrm{MTF}' },
        Mimg: { name: 'modulation in the image', value: 0.2, min: 0, max: 1, tex: 'M_{\\mathrm{img}}' },
        Mobj: { name: 'modulation of the object', value: 0.8, min: 0, max: 1, tex: 'M_{\\mathrm{obj}}' }
      },
      stories: { mtf: 'A sine target of modulation {Mobj} is imaged with a modulation of {Mimg}. What is the MTF at its frequency?' }
    },
    {
      name: 'MTF of a Gaussian blur',
      expr: 'mtf = exp(-2*pi^2*s^2*nu^2)', tex: '\\mathrm{MTF} = e^{-2\\pi^2 \\sigma^2 \\nu^2}',
      vars: {
        mtf: { name: 'MTF', tex: '\\mathrm{MTF}', min: 0.001, max: 1 },
        s: { name: 'standard deviation of the blur', q: 'length', unit: 'µm', value: 4, tex: '\\sigma' },
        nu: { name: 'spatial frequency', q: 'spatialfreq', unit: 'lp/mm', value: 30, tex: '\\nu' }
      },
      note: 'A bell-shaped PSF has a bell-shaped MTF; there is no cut-off, only a steep fall.',
      stories: { mtf: 'A lens blurs a point into a Gaussian with a standard deviation of {s}. How much contrast does it keep at {nu}?' }
    },
    {
      name: 'MTF50 of a Gaussian blur',
      expr: 'nu50 = sqrt(ln(2)/2)/(pi*s)', tex: '\\nu_{50} = \\frac{\\sqrt{\\ln 2 / 2}}{\\pi\\,\\sigma}',
      vars: {
        nu50: { name: 'frequency where the MTF is 0.5', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_{50}' },
        s: { name: 'standard deviation of the blur', q: 'length', unit: 'µm', value: 4, tex: '\\sigma' }
      },
      note: 'The coefficient is 0.187: ν₅₀ = 0.187/σ.',
      stories: { nu50: 'A Gaussian blur has a standard deviation of {s}. At what spatial frequency is its MTF one half?', s: 'A system has its MTF50 at {nu50}. What standard deviation of Gaussian blur would give that?' }
    }
  ],
  examples: [
    {
      title: 'Contrast kept by a soft lens',
      q: 'A lens produces an almost Gaussian blur with a standard deviation of 4 µm. How much contrast does it keep at 30 lp/mm, and where is its MTF50?',
      steps: [
        { text: 'At 30 lp/mm, $\\nu = 30\\ \\mathrm{mm^{-1}}$ and $\\sigma = 0.004$ mm:', tex: '\\mathrm{MTF} = \\exp\\!\\left(-2\\pi^2 (0.004)^2 (30)^2\\right) = e^{-0.284} = 0.75' },
        { text: 'MTF50:', tex: '\\nu_{50} = \\frac{0.187}{0.004\\ \\mathrm{mm}} = 47\\ \\mathrm{lp/mm}' }
      ],
      a: '75 % of the contrast at 30 lp/mm; MTF50 at 47 lp/mm.'
    },
    {
      title: 'The bar chart flatters the lens',
      q: 'At some frequency a lens has MTF(ν) = 0.50, MTF(3ν) = 0.10 and MTF(5ν) = 0. What contrast does a bar target of that pitch show?',
      steps: [
        { text: 'Use the square-wave series, with higher terms zero:', tex: '\\mathrm{CTF} = \\frac{4}{\\pi}\\left(0.50 - \\frac{0.10}{3}\\right) = 1.273 \\times 0.467' }
      ],
      a: 'About 0.59. The bars keep more contrast than the sine wave (0.50) because the square wave\'s third harmonic is partly passed. Quoting a bar-target value as an MTF flatters the lens.'
    }
  ],
  quiz: [
    { q: 'A sine-wave target with modulation 0.8 is imaged with modulation 0.2. What is the MTF at that frequency?', answer: 0.25, why: '$\\mathrm{MTF} = M_{\\mathrm{img}}/M_{\\mathrm{obj}} = 0.2/0.8 = 0.25$.' },
    { q: 'What is the MTF at zero spatial frequency for any lens that does not absorb light unevenly?', choices: ['1', '0.5', '0', 'It depends on the f-number'], a: 0, why: 'Zero frequency means a uniform field, which an optical system hands on unchanged: the response is 1 by definition (the curve is normalised there).' },
    { q: 'The MTF is the Fourier transform of the point-spread function (in magnitude, normalised to 1 at zero frequency).', a: true, why: 'Convolution with the PSF in space is multiplication by its Fourier transform in frequency; that transform is the OTF and its magnitude the MTF.' },
    { q: 'A lens is tested with a bar target and the contrast at some frequency is read off as 0.60. Compared with the sine-wave MTF at the same frequency, this is…', choices: ['Higher than or equal to the MTF', 'Exactly the MTF', 'Lower than the MTF', 'Unrelated to the MTF'], a: 0, why: 'Bars are a square wave: they carry harmonics at 3ν, 5ν … which are partly passed. The CTF is at or above the MTF.' },
    { q: 'Which statement is true of a lens whose MTF50 is 40 lp/mm?', choices: ['It keeps half the contrast of a 40 lp/mm pattern', 'It resolves nothing finer than 40 lp/mm', 'Its PSF is 40 µm wide', 'It has a 40 mm focal length'], a: 0, why: 'MTF50 is the frequency where the response is 0.5. Finer patterns are still recorded, with less contrast; MTF10 would be well beyond 40 lp/mm.' }
  ],
  applications: [
    'Lens datasheets and review sites publish MTF curves and MTF50 values so that lenses can be compared.',
    'Machine vision: the lens must keep enough contrast at the sensor\'s Nyquist frequency for edges to be located.',
    'Lens manufacturing: every production lens of some makers is tested on an MTF bench against a tolerance.',
    'Image processing: sharpening filters are designed as a boost that undoes part of the MTF loss.',
    'Microscopes, telescopes and lithography lenses, whose performance specifications are MTF at stated frequencies.'
  ],
  history: 'The idea that a lens, like an amplifier, can be given a frequency response was carried over from communication theory in the 1940s and 1950s by P. M. Duffieux in France, by O. H. Schade at RCA for television and film, and by H. H. Hopkins in Britain, who developed the theory of the transfer function of aberrated systems. By the 1960s lens makers were publishing MTF curves, and the first commercial MTF benches followed.',
  sources: [
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — OTF, MTF and PTF; sine and square waves.',
    'J. W. Goodman, *Introduction to Fourier Optics* — the chapter on frequency analysis of optical imaging systems.',
    'E. Hecht, *Optics*, ch. 11 (Fourier Optics) — the transfer function and the convolution theorem.',
    'W. J. Smith, *Modern Optical Engineering* — the sections on image evaluation and the optical transfer function.'
  ],
  sim: 'iq-mtf-bars'
},

/* ================================================================ diffraction-limited MTF */
{
  id: 'diffraction-limited-mtf', parent: 'image-quality-and-mtf', title: 'The MTF of a perfect lens', level: 2,
  short: 'Even a lens without any aberration has an MTF: it falls steadily to zero at the cut-off frequency 1/(λN), 227 lp/mm at f/8 in green light. This diffraction-limited curve is the ceiling for every real lens at that aperture; stopping down only lowers it.',
  keywords: ['diffraction limited MTF', 'cut-off frequency', 'diffraction limit', 'perfect lens', 'incoherent cut-off', '1/(λN)', 'Airy disc', 'MTF ceiling', 'aperture', 'f-number', 'diffraction-limited'],
  prereq: ['the-modulation-transfer-function', 'the-airy-disk', 'the-f-number'],
  related: ['system-mtf', 'strehl-ratio-and-diffraction-limited', 'resolution-limits', 'aperture-and-f-stops', 'nyquist-sampling-and-aliasing', 'pixels-per-feature', 'numerical-aperture'],
  body: `
A lens with no aberrations at all still cannot image a point as a point: light passing through a round opening diffracts into an Airy disc ([[the-airy-disk]]). The Fourier transform of that pattern is the MTF of a **perfect lens**, and it has a remarkable feature: it reaches exactly zero at a finite frequency, the **cut-off**.

$$\\nu_c = \\frac{1}{\\lambda N}$$

where $\\lambda$ is the wavelength and $N$ the ([[the-f-number|working]]) f-number. Above $\\nu_c$ no information passes at all, however good the lens. For green light at f/8 it is $1/(0.00055\\ \\mathrm{mm}\\times 8) = 227$ lp/mm.

### The shape of the curve
With $x = \\nu/\\nu_c$ running from 0 to 1,

$$\\mathrm{MTF}(x) = \\frac{2}{\\pi}\\left[\\arccos x - x\\sqrt{1 - x^2}\\right]$$

It starts at 1, falls almost linearly (as $1 - 4x/\\pi$) at first and flattens as it approaches zero. Four landmarks are worth remembering.

| Fraction of the cut-off | 0.25 | 0.40 | 0.50 | 0.80 |
|---|---|---|---|---|
| MTF | 0.69 | 0.50 | 0.39 | 0.10 |

so **MTF50 is at 0.40 ν_c** and **MTF10 at about 0.8 ν_c**. The Airy disc diameter and the cut-off are two views of the same fact: $d \\times \\nu_c = 2.44$.

### What stopping down does
| f-number | cut-off (550 nm) | MTF50 | MTF at 50 lp/mm | MTF at 100 lp/mm |
|---|---|---|---|---|
| f/2 | 909 lp/mm | 367 | 0.93 | 0.86 |
| f/4 | 455 | 184 | 0.86 | 0.72 |
| f/8 | 227 | 92 | 0.72 | 0.46 |
| f/16 | 114 | 46 | 0.46 | 0.05 |
| f/22 | 83 | 33 | 0.28 | 0.00 |

Each full stop lowers the cut-off by $\\sqrt 2$. This is the cost of stopping down: it cures [[what-aberrations-are|aberrations]] but costs diffraction. Wide open a real lens is far below its diffraction curve; stopped down far enough, it follows it; the sharpest aperture lies between.

### Wavelength and the aperture's meaning
Blue light (450 nm) has a cut-off 44 % higher than red (650 nm): at f/8, 278 against 192 lp/mm. White-light curves use a weighted mean, usually near 550 nm. At finite conjugates $N$ is replaced by the working f-number $N(1 + |m|)$, so a macro lens at 1:1 diffracts as if stopped down by two stops. The same law written with the numerical aperture is $\\nu_c = 2\\,\\mathrm{NA}/\\lambda$, the form microscopists use.

### Diffraction and the pixel
A sensor with pitch $p$ cannot carry frequencies above $1000/(2p)$ lp/mm. The f-number at which a perfect lens cuts off *exactly* there is $N = 2p/\\lambda$: f/18 for 5 µm pixels, f/12.5 for 3.45 µm, f/8.7 for 2.4 µm. Beyond it the lens itself removes detail the sensor could have recorded, which is why small-pixel sensors lose sharpness on stopping down ([[system-mtf]]).

> [!key] A perfect lens has MTF = (2/π)[arccos x − x√(1−x²)] with x = ν/ν_c and ν_c = 1/(λN). It is the ceiling at every aperture; MTF50 sits at 40 % of the cut-off.
`,
  ideas: [
    'The MTF of a perfect lens reaches zero at the cut-off ν_c = 1/(λN); no detail finer than that passes at all.',
    'The curve is MTF = (2/π)[arccos x − x√(1−x²)], x = ν/ν_c: 39 % at half the cut-off, 10 % at about 80 %.',
    'Stopping down by one stop lowers the cut-off by √2; diffraction sets a ceiling that no lens can exceed.',
    'Real lenses sit below the ceiling wide open and approach it when stopped down.',
    'The cut-off and the Airy disc are the same fact: d × ν_c = 2.44.'
  ],
  pitfalls: [
    'A lens that is "diffraction-limited" is perfect — It means its aberrations are small enough (Strehl ratio about 0.8 or more) that diffraction is the main blur. Its MTF is still far from 1.',
    'Sharpness always improves as the aperture closes — Aberrations fall, but the diffraction cut-off falls too; beyond a point it dominates and the image softens.',
    'Software can restore detail beyond the cut-off — Nothing finer than the cut-off ever reaches the sensor, so there is nothing to restore; software can only boost what survives below it.',
    'The cut-off depends on the focal length — It depends only on the wavelength and the f-number (or numerical aperture): a long lens and a short one at the same f/8 have the same 227 lp/mm.'
  ],
  terms: [
    { term: 'Cut-off frequency', also: ['diffraction cut-off', 'ν_c'], def: 'The spatial frequency, 1/(λN), at which the MTF of a perfect lens reaches zero. Finer detail does not pass the lens at all.' },
    { term: 'Diffraction-limited', also: ['diffraction-limited lens'], def: 'Having aberrations so small that diffraction is the main source of blur; usually a Strehl ratio of 0.8 or better, the Maréchal criterion.' },
    { term: 'Diffraction-limited MTF', def: 'The MTF of an aberration-free lens of a given f-number and wavelength: (2/π)[arccos x − x√(1−x²)]. The upper bound for any real lens at that aperture.' },
    { term: 'Working f-number', also: ['effective f-number'], def: 'The f-number N(1 + |m|) that applies at finite magnification m; it replaces the engraved value in diffraction calculations in close-up work.' }
  ],
  formulas: [
    {
      name: 'Cut-off frequency',
      expr: 'nuc = 1/(lambda*N)', tex: '\\nu_c = \\frac{1}{\\lambda\\,N}',
      vars: {
        nuc: { name: 'cut-off frequency', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_c' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      stories: { nuc: 'A perfect lens works at f/{N} in light of {lambda}. At what spatial frequency does its MTF reach zero?', N: 'A perfect lens must pass detail up to {nuc} in {lambda} light. What is the largest f-number it can have?' }
    },
    {
      name: 'MTF of a perfect lens',
      expr: 'mtf = 2/pi*(acos(x) - x*sqrt(1 - x^2))', tex: '\\mathrm{MTF} = \\frac{2}{\\pi}\\left(\\arccos x - x\\sqrt{1 - x^2}\\right)',
      vars: {
        mtf: { name: 'MTF', tex: '\\mathrm{MTF}', min: 0, max: 1 },
        x: { name: 'frequency as a fraction of the cut-off', value: 0.5, min: 0, max: 1 }
      },
      note: 'x = ν/ν_c. Valid for a circular aperture in incoherent light.'
    },
    {
      name: 'The f-number at which diffraction reaches the Nyquist frequency',
      expr: 'N = 2*p/lambda', tex: 'N = \\frac{2\\,p}{\\lambda}',
      vars: {
        N: { name: 'f-number', min: 0.5, max: 200 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Setting 1/(λN) equal to 1/(2p). Stopped down further, the lens removes detail the pixels could record.',
      stories: { N: 'A sensor has {p} pixels. At what f-number does a perfect lens, in {lambda} light, cut off at the sensor\'s Nyquist frequency?' }
    }
  ],
  examples: [
    {
      title: 'A perfect lens at f/8',
      q: 'A perfect lens works at f/8 in light of 550 nm. Find its cut-off frequency, its MTF50 and its MTF at 50 lp/mm.',
      steps: [
        { text: 'Cut-off:', tex: '\\nu_c = \\frac{1}{0.00055\\ \\mathrm{mm} \\times 8} = 227\\ \\mathrm{lp/mm}' },
        { text: 'MTF50 is at 0.404 of the cut-off:', tex: '0.404 \\times 227 = 92\\ \\mathrm{lp/mm}' },
        { text: 'At 50 lp/mm, $x = 50/227 = 0.22$:', tex: '\\mathrm{MTF} = \\frac{2}{\\pi}\\left(\\arccos 0.22 - 0.22\\sqrt{1 - 0.22^2}\\right) = 0.72' }
      ],
      a: 'Cut-off 227 lp/mm, MTF50 92 lp/mm, and 72 % of the contrast kept at 50 lp/mm.'
    },
    {
      title: 'Is the lens stopped down too far?',
      q: 'A camera has 3.45 µm pixels. Beyond what f-number (550 nm) does a perfect lens cut off below the sensor\'s Nyquist frequency?',
      steps: [
        { text: 'Nyquist frequency:', tex: '\\nu_N = \\frac{1000}{2 \\times 3.45} = 145\\ \\mathrm{lp/mm}' },
        { text: 'Cut-off equal to it:', tex: 'N = \\frac{2p}{\\lambda} = \\frac{2 \\times 3.45\\ \\mu\\mathrm{m}}{0.55\\ \\mu\\mathrm{m}} = 12.5' }
      ],
      a: 'About f/12.5. Past it, the lens removes detail the sensor could have recorded, and well before it (MTF at Nyquist is only 0.1 at f/10) the contrast there is small.'
    }
  ],
  quiz: [
    { q: 'What is the cut-off frequency of a perfect lens at f/4 in green light (550 nm), in lp/mm?', answer: 455, unit: 'lp/mm', why: '$\\nu_c = 1/(\\lambda N) = 1/(0.00055 \\times 4) = 455$ lp/mm.' },
    { q: 'A perfect lens is stopped down from f/4 to f/8. Its cut-off frequency…', choices: ['halves', 'doubles', 'falls by √2', 'is unchanged'], a: 0, why: 'The cut-off is proportional to $1/N$, and f/4 to f/8 doubles $N$: 455 falls to 227 lp/mm. (One full stop alone would be √2.)' },
    { q: 'A lens with a very good MTF can pass detail finer than its diffraction cut-off, if it is of high enough quality.', a: false, why: 'The cut-off is a property of the aperture and the wavelength, not of the glass. Nothing finer passes, however well the lens is made.' },
    { q: 'At what fraction of the cut-off frequency is the MTF of a perfect lens one half?', choices: ['0.40', '0.50', '0.25', '0.80'], a: 0, why: 'The function gives 0.5 at $x = 0.404$. At $x = 0.5$ it is already down to 0.39.' },
    { q: 'Why can a sensor with very small pixels give softer pictures when the lens is stopped down to f/16 than at f/5.6?', choices: ['Diffraction at f/16 cuts off at about 114 lp/mm, below what the pixels could record, so contrast at fine scales falls', 'Small pixels do not work at f/16', 'The depth of field is too large', 'The aberrations grow when stopping down'], a: 0, why: 'The f-number sets the diffraction ceiling. At f/16 the MTF is already low at 100 lp/mm; the pixels are ready but nothing arrives. Depth of field and aberrations improve when stopping down.' }
  ],
  applications: [
    'Setting the working aperture of a machine-vision lens: stop down for depth of field only as far as the cut-off allows for the smallest feature.',
    'Microscopy: the objective\'s numerical aperture gives its cut-off 2NA/λ, the limit of what any camera can add.',
    'Astronomical telescopes, whose aperture ratio fixes the finest detail resolved, and lithography lenses, designed to be diffraction-limited.',
    'Judging how good a lens is: the closer its measured MTF to the perfect-lens curve at that aperture, the nearer to perfection it is.'
  ],
  history: 'Diffraction-limited imaging goes back to Airy (1835) and to Abbe, whose 1873 analysis of the microscope tied resolution to wavelength and aperture. The transfer-function form was worked out in the 1940s and 1950s, by Duffieux and by H. H. Hopkins among others. A lens is called "diffraction-limited" when its wavefront error is below about one fourteenth of a wavelength rms, a Strehl ratio of 0.8: the Maréchal criterion.',
  sources: [
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — the diffraction MTF of circular and rectangular apertures.',
    'J. W. Goodman, *Introduction to Fourier Optics* — incoherent imaging and the cut-off frequency.',
    'W. J. Smith, *Modern Optical Engineering* — the section on diffraction-limited performance and the transfer function.',
    'E. Hecht, *Optics*, ch. 10 and 11 — the Airy pattern and its transform.'
  ],
  sim: { id: 'iq-mtf-budget', params: { lensOnly: true } }
},

/* ================================================================ system MTF */
{
  id: 'system-mtf', parent: 'image-quality-and-mtf', title: 'System MTF: lens, sensor, motion', level: 2,
  short: 'The MTF of a whole imaging chain is the product of the MTFs of its parts: lens, aberrations, focus error, motion, the pixel, any anti-aliasing filter. The weakest factor sets the result, and a part that is already far better than the rest adds nothing.',
  keywords: ['system MTF', 'MTF budget', 'MTF product', 'pixel MTF', 'sinc', 'motion blur MTF', 'defocus MTF', 'optical low-pass filter', 'weakest link', 'cascade', 'lens and sensor matching', 'sharpening'],
  prereq: ['diffraction-limited-mtf', 'sensor-formats-and-pixel-size'],
  related: ['the-modulation-transfer-function', 'nyquist-sampling-and-aliasing', 'shutter-speed-and-motion', 'circle-of-confusion', 'choosing-a-machine-vision-lens', 'the-resolution-budget', 'pixels-per-feature', 'colour-filter-arrays-and-demosaicing'],
  body: `
A picture passes through a chain: the lens (with its diffraction and aberrations), a possible focus error, a movement during the exposure, perhaps an anti-aliasing filter, the pixels, the electronics, the processing, the display, and finally the eye. Each stage blurs. Because blurring is convolution with a PSF, and convolution in space is multiplication in frequency, the MTFs simply multiply:

$$\\mathrm{MTF}_{\\mathrm{system}}(\\nu) = \\mathrm{MTF}_{\\mathrm{lens}}(\\nu)\\cdot\\mathrm{MTF}_{\\mathrm{pixel}}(\\nu)\\cdot\\mathrm{MTF}_{\\mathrm{motion}}(\\nu)\\cdots$$

This holds where the stages are independent and linear, and where each MTF is that of its own point-spread function. It is the reason a budget can be drawn up before anything is bought.

### The factors
| Stage | PSF | MTF | First zero |
|---|---|---|---|
| Perfect lens | Airy disc | (2/π)[arccos x − x√(1−x²)] | the cut-off 1/(λN) |
| Aberrations (roughly) | smooth blob of s.d. σ | exp(−2π²σ²ν²) | none; a steady fall |
| Focus error | disc of diameter b | 2J₁(πbν)/(πbν) | about 1.22/b |
| Motion | line of length L | sin(πLν)/(πLν) | 1/L |
| Pixel (width a) | box | sin(πaν)/(πaν) | 1/a |
| Two-point anti-aliasing filter, split d | two points | cos(πdν) | 1/(2d) |

### The pixel is a filter too
A pixel adds up the light over its own area, a box of width $a$. The result is the **sinc** MTF, and at the sensor's Nyquist frequency (half a cycle per pixel) it is $2/\\pi = 0.64$ for a pixel filling its whole pitch. Even a perfect lens on a perfect sensor therefore delivers 64 % at Nyquist; a smaller light-sensitive area (low fill factor) raises it, at the cost of more [[nyquist-sampling-and-aliasing|aliasing]].

### The weakest link
A worked chain: an f/5.6 lens with aberrations equal to a 2 µm Gaussian blur, 5 µm pixels (Nyquist 100 lp/mm) and a moving subject smeared over 5 µm, one pixel.

| At | lens (diffraction) | aberrations | pixel | motion | system |
|---|---|---|---|---|---|
| 20 lp/mm | 0.92 | 0.97 | 0.98 | 0.98 | 0.86 |
| 50 lp/mm | 0.80 | 0.82 | 0.90 | 0.90 | 0.54 |
| 100 lp/mm | 0.61 | 0.45 | 0.64 | 0.64 | 0.11 |

No factor is dreadful, yet at Nyquist the product is 0.11. Remove the motion and it rises to 0.18; cure the aberrations as well and to 0.39. And widths combine as in [[the-point-spread-function|the PSF]]: for roughly Gaussian blurs, $w^2 = \\sum w_i^2$, so the largest blur dominates. Making a part that is already three times better than the rest even better changes nothing.

### Matching lens and sensor
A lens whose MTF is already near zero below the sensor's Nyquist frequency wastes the pixels; a sensor much coarser than the lens's useful range wastes the lens. A common design target is that the lens still passes a useful fraction of contrast, a third or more, at the sensor's Nyquist frequency, which in practice sets the pixel size for a given aperture. Sharpening in software raises the middle of the curve (the MTF can go above 1) but amplifies noise and creates halos around edges.

> [!key] MTFs of independent stages multiply, so the system is never better than its worst part at any frequency. The pixel alone caps contrast at 0.64 at Nyquist.
`,
  ideas: [
    'The MTF of a chain of independent blurs is the product of the individual MTFs.',
    'A pixel of width a has the sinc MTF sin(πaν)/(πaν): 0.64 at its own Nyquist frequency.',
    'Motion over length L and a focus error of blur diameter b have their own MTFs, with zeros at 1/L and about 1.22/b.',
    'Roughly Gaussian blurs combine in quadrature: the largest dominates and improving a minor part gives almost nothing.',
    'Lens and sensor should be matched: the lens must keep useful contrast near the Nyquist frequency of the pixels.'
  ],
  pitfalls: [
    'More megapixels always means a sharper picture — Past the lens\'s limit more pixels add nothing; the system MTF is the product, and the lens factor is already low there.',
    'The system MTF is the average of the parts — It is the product, so it is lower than every one of them.',
    'The lens MTF at Nyquist is the whole story — The pixel\'s own sinc takes 36 % off at Nyquist, even for a perfect lens, and every other blur multiplies in.',
    'Sharpening restores lost detail — It boosts the MTF where there is still signal and noise, and cannot recover detail beyond the cut-off or below the noise.'
  ],
  terms: [
    { term: 'System MTF', also: ['MTF budget', 'cascaded MTF'], def: 'The MTF of the whole imaging chain: the product of the MTFs of lens, aberrations, focus, motion, filter, pixel and so on, for independent stages.' },
    { term: 'Pixel MTF', also: ['aperture MTF', 'sinc'], def: 'The MTF of the pixel\'s light-collecting area, sin(πaν)/(πaν) for a square of width a. It is 0.64 at the Nyquist frequency when the pixel fills its pitch.' },
    { term: 'Fill factor', def: 'The fraction of each pixel\'s area that collects light. A smaller fill factor means a smaller effective aperture a, a higher pixel MTF and more aliasing.' },
    { term: 'Optical low-pass filter', also: ['OLPF', 'anti-aliasing filter'], def: 'A birefringent plate in front of the sensor that splits each point into two or four, blurring on purpose to remove detail above the Nyquist frequency.' },
    { term: 'Defocus MTF', def: 'The MTF of a focus error: the transform of a blur disc of diameter b, 2J₁(πbν)/(πbν), which can go negative and reverse contrast.' }
  ],
  formulas: [
    {
      name: 'Three stages in a chain',
      expr: 'mt = ml*mp*mm', tex: '\\mathrm{MTF}_{\\mathrm{sys}} = \\mathrm{MTF}_{l}\\cdot\\mathrm{MTF}_{p}\\cdot\\mathrm{MTF}_{m}',
      vars: {
        mt: { name: 'MTF of the system', tex: '\\mathrm{MTF}_{\\mathrm{sys}}', min: 0, max: 1 },
        ml: { name: 'MTF of the lens', value: 0.6, min: 0, max: 1, tex: '\\mathrm{MTF}_{l}' },
        mp: { name: 'MTF of the pixel', value: 0.64, min: 0, max: 1, tex: '\\mathrm{MTF}_{p}' },
        mm: { name: 'MTF of the motion blur', value: 0.9, min: 0, max: 1, tex: '\\mathrm{MTF}_{m}' }
      },
      note: 'All three at the same spatial frequency. More stages simply add more factors.',
      stories: { mt: 'At one frequency the lens passes {ml}, the pixel {mp} and the motion blur {mm}. What contrast does the system keep?' }
    },
    {
      name: 'MTF of a pixel',
      expr: 'mtf = sin(pi*c)/(pi*c)', tex: '\\mathrm{MTF}_{\\mathrm{px}} = \\frac{\\sin \\pi c}{\\pi c}',
      vars: {
        mtf: { name: 'MTF of the pixel aperture', tex: '\\mathrm{MTF}_{\\mathrm{px}}' },
        c: { name: 'frequency in cycles per pixel', value: 0.5, min: 0.01, max: 0.99 }
      },
      note: 'For a pixel filling its whole pitch. At the Nyquist frequency c = 0.5 and the value is 2/π = 0.637.'
    },
    {
      name: 'Blur from motion',
      expr: 'L = v*t*m', tex: 'L = v\\,t\\,m',
      vars: {
        L: { name: 'smear length on the sensor', q: 'length', unit: 'µm' },
        v: { name: 'speed of the subject', q: 'speed', unit: 'm/s', value: 0.5 },
        t: { name: 'exposure time', q: 'time', unit: 'ms', value: 1 },
        m: { name: 'magnification', value: 0.05, min: 0.0001, max: 10 }
      },
      note: 'The motion MTF is sin(πLν)/(πLν): it reaches zero at ν = 1/L.',
      stories: { L: 'A part moves at {v} past a camera with magnification {m}; the exposure is {t}. How far does its image smear on the sensor?' }
    }
  ],
  examples: [
    {
      title: 'A budget at 50 lp/mm',
      q: 'At 50 lp/mm a lens (diffraction plus aberrations) passes 0.80 × 0.82. The pixels (5 µm) pass 0.90 and a 5 µm motion smear 0.90. What does the system keep, and what would removing the motion give?',
      steps: [
        { text: 'The product of the four factors:', tex: '0.80 \\times 0.82 \\times 0.90 \\times 0.90 = 0.53' },
        { text: 'Without the motion:', tex: '0.80 \\times 0.82 \\times 0.90 = 0.59' }
      ],
      a: '0.53, and 0.59 without the smear. Each factor looks fine; together they have taken nearly half of the contrast.'
    },
    {
      title: 'How much does a 1 ms exposure smear?',
      q: 'A conveyor carries parts at 0.5 m/s past a camera of magnification 0.05, exposure 1 ms, pixels 5 µm. How long is the smear, and at what frequency does its MTF reach zero?',
      steps: [
        { text: 'On the object the part moves $0.5\\ \\mathrm{m/s} \\times 1\\ \\mathrm{ms} = 0.5$ mm; on the sensor:', tex: 'L = 0.5\\ \\mathrm{mm} \\times 0.05 = 25\\ \\mu\\mathrm{m} = 5\\ \\text{pixels}' },
        { text: 'The first zero of sin(πLν)/(πLν):', tex: '\\nu = \\frac{1}{L} = \\frac{1}{0.025\\ \\mathrm{mm}} = 40\\ \\mathrm{lp/mm}' }
      ],
      a: 'The image smears over 25 µm (five pixels), and nothing at 40 lp/mm or in its neighbourhood survives: a 100 lp/mm sensor is wasted. A shorter exposure or a strobe is needed.'
    }
  ],
  quiz: [
    { q: 'A lens passes 0.8 of the contrast at some frequency, the sensor\'s pixels 0.7 and a vibration 0.9. What does the system pass at that frequency?', answer: 0.504, why: 'MTFs of independent stages multiply: $0.8 \\times 0.7 \\times 0.9 = 0.504$. The result is below every one of the parts.' },
    { q: 'For a sensor whose pixels fill their whole pitch, the pixel\'s own MTF at the Nyquist frequency is about…', choices: ['0.64', '1.0', '0.5', '0.1'], a: 0, why: 'The box MTF is $\\sin(\\pi c)/(\\pi c)$ with $c = 0.5$: $2/\\pi = 0.637$.' },
    { q: 'The MTF of a system is at least as large as the largest MTF among its stages.', a: false, why: 'It is the product of stages that are each at most 1, so it is at most as large as the smallest one at every frequency.' },
    { q: 'Two lenses have the same MTF at the sensor\'s Nyquist frequency, but lens B is much better at all lower frequencies than the sensor needs. Which gives the sharper pictures with the same camera?', choices: ['Both look the same at Nyquist; B gains only at coarser detail', 'B, by far', 'A, because it is cheaper', 'Neither: the camera decides everything'], a: 0, why: 'The MTF at each frequency is a separate comparison; the same value at Nyquist means the same rendering of finest detail, while B\'s lead lies at medium frequencies.' },
    { q: 'A subject moves so that its image smears over 20 µm during the exposure. At what spatial frequency does the motion MTF first reach zero?', answer: 50, unit: 'lp/mm', why: 'The smear is a box of length $L = 0.02$ mm, whose MTF sinc reaches zero at $\\nu = 1/L = 50$ lp/mm.' }
  ],
  applications: [
    'Specifying a machine-vision camera and lens together: the pixel pitch, the lens MTF at its Nyquist frequency and the exposure time against the line speed.',
    'Judging whether upgrading a lens or a sensor will help: compute which factor is the weakest link at the spatial frequency that matters.',
    'Designing cameras: pixel size, anti-aliasing filter, lens MTF and sharpening are chosen together.',
    'Remote sensing and film scanners, where the scanner\'s aperture MTF multiplies the lens MTF and film grain.'
  ],
  history: 'The product rule was the great convenience of the transfer-function method. Since each stage has its own curve, a television engineer in the 1950s could cascade camera tube, amplifier, and display, and a lens designer could ask whether a better lens was worth anything with the film actually in use. Schade\'s television and film analyses are the classic examples; digital camera design repeated the exercise with the pixel as one more stage.',
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — system MTF of sensor, optics, electronics and display.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — the MTFs of detector apertures, motion and defocus and their cascade.',
    'J. W. Goodman, *Introduction to Fourier Optics* — linear shift-invariant systems and the multiplication of transfer functions.',
    'ISO 12233, *Photography — Electronic still picture imaging — Resolution and spatial frequency responses* — how the system MTF of a camera is measured.'
  ],
  sim: 'iq-mtf-budget'
},

/* ================================================================ sampling, Nyquist, aliasing */
{
  id: 'nyquist-sampling-and-aliasing', parent: 'image-quality-and-mtf', title: 'Sampling, Nyquist and aliasing', level: 2,
  short: 'A sensor samples the image at the pitch of its pixels, so it can record detail only up to the Nyquist frequency, one cycle per two pixels. Finer detail is not lost; it comes back as false, coarser patterns (aliasing, moiré), which is why some cameras blur the image slightly on purpose.',
  keywords: ['Nyquist', 'Nyquist frequency', 'sampling', 'aliasing', 'moiré', 'zone plate', 'optical low-pass filter', 'anti-aliasing filter', 'false colour', 'sampling theorem', 'wagon wheel', 'jaggies', 'sampling frequency'],
  prereq: ['system-mtf', 'sensor-formats-and-pixel-size', 'electronics:sampling-nyquist'],
  related: ['spatial-frequency-and-line-pairs', 'colour-filter-arrays-and-demosaicing', 'diffraction-limited-mtf', 'measuring-mtf', 'binning-roi-and-area-of-interest', 'digital-zoom', 'pixels-per-feature'],
  body: `
A sensor does not record the image; it records *samples* of it, one number per pixel, at a fixed spacing $p$, the pixel pitch. The rate of sampling in space is $\\nu_s = 1/p$, and the highest frequency those samples can describe is half of it, the **Nyquist frequency**:

$$\\nu_N = \\frac{1}{2p}$$

In lp/mm: 100 for 5 µm pixels, 145 for 3.45 µm, 208 for 2.4 µm. At the limit one line pair spans exactly two pixels, one bright and one dark.

### What happens above it
Detail finer than $\\nu_N$ is not simply dropped. A sine pattern of frequency $\\nu$ between $\\nu_N$ and $\\nu_s$ gives exactly the same samples as one of frequency $\\nu_s - \\nu$. The sensor cannot tell them apart, and it reports the coarser one. This is **aliasing**:

| Pixels (pitch) | Sampling frequency | Nyquist | A pattern at | is recorded as |
|---|---|---|---|---|
| 5 µm | 200 lp/mm | 100 lp/mm | 150 lp/mm | 50 lp/mm (a period of 4 pixels, not 1.3) |
| 5 µm | 200 lp/mm | 100 lp/mm | 200 lp/mm | 0: a flat field |
| 3.45 µm | 290 lp/mm | 145 lp/mm | 200 lp/mm | 90 lp/mm |

In two dimensions the false patterns are bands and rings, **moiré**: a striped shirt, a fine fabric or a printed screen photographed against a pixel grid shows wavy patterns that exist in neither. On a smooth edge aliasing makes steps, "jaggies". On a colour sensor, where each colour is sampled on a coarser grid, it gives false colours ([[colour-filter-arrays-and-demosaicing]]). The same effect in time is the wagon wheel that seems to turn backwards in a film ([[electronics:sampling-nyquist]]).

### Why it cannot be undone
The alias is a perfectly legitimate pattern at a lower frequency. Once sampled it carries no label saying "I was once finer", so no software can separate it from real detail. The remedy must act **before** sampling, by removing what lies above Nyquist:

- an **optical low-pass filter**, a birefringent plate that splits each point into two (or four) displaced by about one pixel. Its MTF is $\\cos(\\pi\\nu p)$, exactly zero at Nyquist;
- a lens that cuts off by itself below Nyquist, which a diffraction-limited lens does when $N \\ge 2p/\\lambda$ ([[diffraction-limited-mtf]]);
- a little defocus, or the averaging of a large-area pixel.

All of them cost contrast below Nyquist as well. Hence the trade-off every camera design makes between sharpness and false patterns. Cameras with very small pixels often drop the filter: their lenses cannot deliver such fine detail except at the very best apertures, and the gain in sharpness is worth the occasional moiré. Cameras for scientific and measuring work usually choose a lens that band-limits, and check with a zone plate or a slanted edge.

### The pixel does part of the work
Averaging over the pixel's own area gives the sinc MTF ($0.64$ at Nyquist). It only softens the aliasing: at 1.5 times Nyquist the pixel still passes about 30 % of the contrast, and that is exactly the part that comes back as a false pattern at half Nyquist.

> [!key] Detail above the Nyquist frequency 1/(2p) is not lost but folded back as a false, coarser pattern that cannot be told from real detail. Only filtering before the sensor prevents it, and every filter costs contrast below Nyquist too.
`,
  ideas: [
    'A sensor samples the image once per pixel; the Nyquist frequency 1/(2p) is half the sampling frequency 1/p, one line pair per two pixels.',
    'A pattern at ν between Nyquist and the sampling frequency is recorded as ν_s − ν: a false, coarser pattern.',
    'In two dimensions aliasing gives moiré fringes, jaggies and false colours.',
    'Aliasing cannot be removed afterwards, because the alias is indistinguishable from real detail.',
    'Optical low-pass filters, lens cut-off, defocus and pixel area all band-limit before sampling, at a price in contrast below Nyquist.'
  ],
  pitfalls: [
    'Detail finer than the pixels is simply lost — It is worse: it returns as false coarse patterns that look like real detail. A smooth, clean loss would at least be honest.',
    'Higher resolution sensors cannot alias — They alias at higher frequencies. Any sensor does, unless its lens or a filter keeps the image below Nyquist.',
    'Software can remove moiré cleanly — It can reduce it by guessing, but the original information is gone; processing works on the false pattern as if it were real.',
    'The Nyquist frequency is the resolution of the sensor — It is the ceiling on what the pixels can carry. Real resolution is set by the whole system MTF, and contrast near Nyquist is low (at best 0.64 from the pixel alone).'
  ],
  terms: [
    { term: 'Nyquist frequency', also: ['Nyquist limit', 'fold-over frequency'], def: 'Half the sampling frequency, 1/(2p) for pixel pitch p: the highest spatial frequency a sampled image can describe. At it, one line pair spans two pixels.' },
    { term: 'Aliasing', also: ['alias'], def: 'The folding of detail above the Nyquist frequency into false patterns at a lower frequency, ν_s − ν. It cannot be removed after sampling.' },
    { term: 'Moiré', also: ['moire fringes'], def: 'A wavy, banded pattern that appears when a fine regular pattern is sampled by a grid of nearly the same period, as a fabric by a sensor. A two-dimensional alias.' },
    { term: 'Optical low-pass filter', also: ['OLPF', 'anti-aliasing filter', 'AA filter'], def: 'A plate in front of the sensor that blurs the image slightly, usually by splitting each point into two or four, so that detail above Nyquist is removed before sampling.' },
    { term: 'Zone plate', also: ['Fresnel zone target'], def: 'A circular pattern whose frequency rises with radius. Photographed, it shows at once where the system aliases.' },
    { term: 'Sampling frequency', also: ['sampling rate'], def: 'The number of samples per unit length, 1/p for pixel pitch p: 200 per millimetre for 5 µm pixels.' }
  ],
  formulas: [
    {
      name: 'The Nyquist frequency of a sensor',
      expr: 'nuN = 1/(2*p)', tex: '\\nu_N = \\frac{1}{2p}',
      vars: {
        nuN: { name: 'Nyquist frequency', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_N' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45 }
      },
      stories: { nuN: 'A sensor has {p} pixels. What is its Nyquist frequency?', p: 'A sensor has a Nyquist frequency of {nuN}. What is its pixel pitch?' }
    },
    {
      name: 'The alias of a pattern above Nyquist',
      expr: 'fa = 1/p - nu', tex: '\\nu_{\\mathrm{alias}} = \\frac{1}{p} - \\nu',
      vars: {
        fa: { name: 'frequency recorded', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_{\\mathrm{alias}}' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5 },
        nu: { name: 'true frequency of the pattern', q: 'spatialfreq', unit: 'lp/mm', value: 150, tex: '\\nu' }
      },
      note: 'For a pattern between the Nyquist and the sampling frequency. In general the alias is |ν − kν_s| for the nearest whole k.',
      stories: { fa: 'A pattern of {nu} falls on a sensor with {p} pixels. At what frequency does the sensor record it?' }
    },
    {
      name: 'Pixel pitch that matches a lens',
      expr: 'p = lambda*N/2', tex: 'p = \\frac{\\lambda N}{2}',
      vars: {
        p: { name: 'largest pitch whose Nyquist frequency reaches the cut-off', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'Setting the Nyquist frequency 1/(2p) equal to the diffraction cut-off 1/(λN). A finer pitch gains nothing from a perfect lens at this aperture.',
      stories: { p: 'A perfect lens works at f/{N} in {lambda} light. What pixel pitch has its Nyquist frequency at the lens\'s cut-off?' }
    }
  ],
  examples: [
    {
      title: 'The false pattern',
      q: 'A sensor with 5 µm pixels photographs a fine grille of 150 lp/mm on the sensor. Is it recorded, and as what?',
      steps: [
        { text: 'Nyquist and sampling frequencies:', tex: '\\nu_N = \\frac{1}{2 \\times 5\\ \\mu\\mathrm{m}} = 100\\ \\mathrm{lp/mm}, \\qquad \\nu_s = 200\\ \\mathrm{lp/mm}' },
        'The grille at 150 lp/mm lies above Nyquist, so it folds:',
        { text: '', tex: '\\nu_{\\mathrm{alias}} = 200 - 150 = 50\\ \\mathrm{lp/mm}' },
        'A period of 20 µm, four pixels, where the real one is 6.7 µm, 1.3 pixels.'
      ],
      a: 'It is recorded as a clean pattern of 50 lp/mm, three times coarser than the grille. Nothing in the picture says it is false.'
    },
    {
      title: 'Zone-plate rings',
      q: 'A zone plate has local frequency rising linearly from 0 at the centre to 2 × Nyquist at the edge of the picture. Where do the false rings begin?',
      steps: [
        'The pattern passes Nyquist when its frequency is one half of the edge value.',
        'The frequency of a zone plate is proportional to the radius, so that is at half the radius. Beyond it the rings fold back (frequency $\\nu_s - \\nu$): the pattern gets *coarser* again towards the edge.',
        'At the edge the true frequency is the sampling frequency, $\\nu_s$, so the folded pattern has returned to zero frequency: a flat disc.'
      ],
      a: 'At half the radius. Beyond it you see rings that run the wrong way, and at the edge the pattern vanishes to a flat grey.'
    }
  ],
  quiz: [
    { q: 'What is the Nyquist frequency of a sensor with 4 µm pixels, in lp/mm?', answer: 125, unit: 'lp/mm', why: '$\\nu_N = 1/(2p) = 1/(8\\ \\mu\\mathrm{m}) = 125$ lp/mm: one line pair per two pixels of 4 µm.' },
    { q: 'A sensor with 3 µm pixels (sampling frequency 333 lp/mm) is shown a pattern of 250 lp/mm. At what frequency does it record it?', answer: 83.3, unit: 'lp/mm', why: 'The pattern lies above the Nyquist frequency (167 lp/mm), so it folds: $333 - 250 = 83$ lp/mm.' },
    { q: 'A moiré pattern in a photograph can be removed afterwards without loss, because the original pattern is in the data.', a: false, why: 'The alias is indistinguishable from real detail at the lower frequency; the information about the true pattern was destroyed in sampling. Software can only guess.' },
    { q: 'Why do some cameras place a slightly blurring filter in front of the sensor?', choices: ['To remove detail above the Nyquist frequency before it can alias', 'To protect the sensor from dust', 'To increase the light reaching the pixels', 'To reduce the noise'], a: 0, why: 'The optical low-pass filter band-limits the image, so that detail finer than the pixels can follow is smoothed away instead of returning as false patterns.' },
    { q: 'A pattern exactly at the sampling frequency (one cycle per pixel) is recorded as…', choices: ['A uniform field', 'The same pattern', 'A pattern at half the frequency', 'A random pattern'], a: 0, why: 'At $\\nu = \\nu_s$ the alias is $\\nu_s - \\nu_s = 0$: every pixel sees the same phase of the pattern and the picture is flat.' }
  ],
  applications: [
    'Camera design: choosing between an anti-aliasing filter, a diffraction-limited aperture and the risk of moiré.',
    'Machine vision: gauging edges and counting periodic structures (gratings, meshes, textiles) needs the pattern kept below Nyquist, or measured with a slanted edge.',
    'Scanning and printing: halftone screens, scanned prints and screen photographs show moiré unless descreened.',
    'Digital zooming and resizing: downsampling a picture without first blurring it aliases, exactly as a sensor does.',
    'Film and video: the wagon-wheel effect and strobing, the same theorem in time.'
  ],
  history: 'The sampling theorem is named for Harry Nyquist, who in 1928 analysed the signalling rate of a telegraph channel, and for Claude Shannon, who proved it for general band-limited signals in 1949; V. A. Kotelnikov had published a version in 1933. Aliasing in imagery was first a nuisance of television and of aerial photography scanned into digital form, and became an everyday problem with digital cameras and the optical low-pass filter.',
  sources: [
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — sampling, aliasing and the sampled-imaging MTF.',
    'J. W. Goodman, *Introduction to Fourier Optics* — the sampling theorem for images.',
    'E. Hecht, *Optics*, ch. 11 (Fourier Optics) — spatial frequencies and the Fourier transform of an image.',
    'C. E. Shannon, "Communication in the presence of noise", *Proceedings of the IRE* 37 (1949) — the theorem.'
  ],
  sim: 'iq-aliasing'
},

/* ================================================================ reading MTF charts */
{
  id: 'reading-mtf-charts', parent: 'image-quality-and-mtf', title: 'Reading MTF charts', level: 2,
  short: 'A maker\'s MTF chart plots the contrast of a lens against the distance from the centre of the picture, for fine and coarse lines, in two orientations: sagittal and tangential. The height of the lines tells contrast and detail, the gap between the two orientations tells how astigmatic the lens is, and the slope towards the corner tells how soft the edges are.',
  keywords: ['MTF chart', 'MTF curve', 'sagittal', 'tangential', 'meridional', '10 lp/mm', '30 lp/mm', 'image height', 'astigmatism', 'wide open', 'lens review', 'corner sharpness', 'computed MTF'],
  prereq: ['the-modulation-transfer-function', 'system-mtf', 'astigmatism-of-lenses'],
  related: ['diffraction-limited-mtf', 'measuring-mtf', 'field-curvature', 'coma', 'spherical-aberration', 'sensor-formats-and-pixel-size', 'crop-factor-and-equivalent-focal-length', 'reading-a-lens-datasheet'],
  body: `
Open the datasheet of a photographic lens and, besides the glass diagram, there are graphs like this: a horizontal axis from 0 to about 21 mm, a vertical one from 0 to 1, and four wiggling lines, two solid and two dashed. It is a family of MTF curves, and once the code is known it tells a great deal.

### The axes
- **Horizontal: image height**, the distance from the centre of the image on the sensor, in millimetres. 0 is the optical axis; the right-hand end is the corner of the format: 21.6 mm for full frame (diagonal 43.3 mm), 14.2 mm for APS-C, 8.0 mm for a 1" sensor. For a lens of focal length $f$ the image height corresponds to a field angle $\\theta = \\arctan(h/f)$: 23° at the corner of full frame with a 50 mm lens.
- **Vertical: MTF**, from 0 to 1 (or 0 to 100 %), at a stated frequency.
- **The frequencies**, usually two: a **low** one, commonly 10 lp/mm, which shows overall contrast, and a **high** one, 30 lp/mm or 40 lp/mm, which shows fine detail. Some makers draw three or four (5, 10, 20, 40).
- **Solid and dashed lines** are the two orientations of the lines in the target: sagittal and tangential.

### Sagittal and tangential
Choose a point away from the centre. The **sagittal** lines are bars that run radially, pointing at the centre of the picture, so their contrast depends on the blur around the circle, across the bars. The **tangential** (or **meridional**) lines run around the centre, perpendicular to the radius, so their contrast depends on the blur along the radius. Most lenses blur more along the radius than across it (astigmatism, coma and field curvature stretch the spot radially), so the **tangential line is usually the lower one** towards the edge. The names are used loosely, and makers differ in which style is solid; read the legend.

### What to read from it
Rules of thumb for a full-frame lens:

| Look at | It tells you |
|---|---|
| The level of the 10 lp/mm lines at the centre | overall contrast, the "punch" of the picture; above 0.9 is excellent |
| The level of the 30 lp/mm lines | fine detail; 0.6 and above across the field is very good, 0.3 is soft |
| The gap between the solid and the dashed line | astigmatism: a large gap means detail stretched radially, objects out of focus, a restless background |
| The fall towards the right-hand end | softness of the corners; steeply falling lines mean a lens that is sharp only in the middle |
| Two charts, wide open and stopped down | how far the lens improves with aperture; a lens that is good wide open is one that does not need stopping down |
| A wiggle in the curve | a zone of the field where focus and aberrations cross, typical of complex lenses |

A **computed** chart, from the design data, shows the ideal lens; a **measured** chart, from a test bench, includes the errors of manufacture. Many datasheets show only the former. And a chart gives *contrast*, not the position of best focus: field curvature moves the sharpest surface away from the sensor plane, so the chart can describe a sharper lens than a test target taped to a wall shows.

### Comparing charts
Charts are comparable only when the frequency, the wavelength weighting, the aperture and the format agree. A lens used on a smaller sensor is enlarged more for the same print, so it needs higher frequencies than the chart shows: the 10 and 30 lp/mm of a full-frame chart correspond to 15 and 46 lp/mm on APS-C (crop factor 1.53). Nor do charts show copy-to-copy variation, distortion, flare, colour fringes, focus shift with aperture or the position of the best-focus surface.

> [!key] Height of the lines: contrast at that scale. Gap between solid and dashed: astigmatism. Slope to the right: soft corners. Compare charts only at the same frequencies, aperture, and format.
`,
  ideas: [
    'The chart plots MTF at one or two frequencies against the image height from the centre to the corner of the format.',
    'A low frequency (10 lp/mm) shows overall contrast; a high one (30 or 40 lp/mm) shows fine detail.',
    'Sagittal (radial) and tangential (circumferential) lines are drawn solid and dashed; tangential is usually lower.',
    'A big gap between the two means astigmatism and a stretched blur; a steep fall means soft corners.',
    'Charts are comparable only at the same frequencies, aperture, wavelength weighting and sensor format.'
  ],
  pitfalls: [
    'The higher curve is the better lens — Two lenses with the same level but different gaps or slopes behave differently in the corners and in the blur. Read the shape, not just the height.',
    'A chart measures sharpness — It measures the contrast at two chosen frequencies. Focus, distortion, flare and colour fringes are not on it.',
    'Charts from different makers can be compared directly — Frequencies, weighting, computed against measured and the solid-dashed convention all differ.',
    'The chart for a full-frame lens applies as it stands on a small sensor — The small sensor sees only the centre of the chart, but its pixels are finer and the enlargement is greater, so higher frequencies matter.'
  ],
  terms: [
    { term: 'MTF chart', also: ['MTF curve', 'lens MTF graph'], def: 'A graph of lens MTF against image height for stated frequencies, apertures and orientations, published by lens makers.' },
    { term: 'Sagittal', also: ['S', 'radial lines'], def: 'The orientation of a target whose lines point along the radius towards the centre of the picture. Its blur is measured across the radius.' },
    { term: 'Tangential', also: ['meridional', 'T', 'M'], def: 'The orientation of a target whose lines run around the centre, perpendicular to the radius. Its blur is measured along the radius, where most lenses blur most.' },
    { term: 'Image height', def: 'The distance of an image point from the optical axis, in millimetres; 0 at the centre, half the sensor diagonal at the corner.' },
    { term: 'Computed and measured MTF', def: 'A computed chart comes from the design prescription (a perfect copy); a measured one from a test bench and includes manufacturing errors.' }
  ],
  formulas: [
    {
      name: 'Field angle of an image height',
      expr: 'h = f*tan(theta)', tex: 'h = f \\tan\\theta',
      vars: {
        h: { name: 'image height', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 50 },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 23.4, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For a rectilinear lens focused at infinity.',
      stories: { h: 'A {f} lens is used at a field angle of {theta}. At what image height does that point fall?' }
    },
    {
      name: 'Frequency on another format',
      expr: 'nuB = nuA*cf', tex: '\\nu_B = \\nu_A\\,c',
      vars: {
        nuB: { name: 'equivalent frequency on the smaller sensor', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_B' },
        nuA: { name: 'frequency on the large sensor', q: 'spatialfreq', unit: 'lp/mm', value: 30, tex: '\\nu_A' },
        cf: { name: 'crop factor of the smaller sensor', value: 1.53, min: 1, max: 10, tex: 'c' }
      },
      note: 'For the same print size and viewing distance. Relative to full frame, APS-C is 1.5 to 1.6, Four Thirds 2, and 1" 2.7.',
      stories: { nuB: 'A chart gives the MTF of a full-frame lens at {nuA}. At what frequency on a sensor of crop factor {cf} is the same detail in a print of equal size?' }
    }
  ],
  examples: [
    {
      title: 'Reading a chart by numbers',
      q: 'A 50 mm f/1.4 lens wide open has these MTF values (10 lp/mm, 30 lp/mm): at the centre 0.85 and 0.60; at 15 mm from the centre sagittal 0.80 and 0.45, tangential 0.65 and 0.25; at the corner (21.6 mm) sagittal 0.70 and 0.30, tangential 0.45 and 0.12. What does this tell?',
      steps: [
        { text: 'Field angles of the two positions:', tex: '\\theta = \\arctan\\frac{15}{50} = 16.7°, \\qquad \\arctan\\frac{21.6}{50} = 23.4°' },
        'At the centre both frequencies are high: good contrast and good detail.',
        'At 15 mm the gap between sagittal and tangential is 0.15 at 10 lp/mm and 0.20 at 30 lp/mm: pronounced astigmatism, so edge detail and out-of-focus highlights will be stretched along the radius.',
        'At the corner the 30 lp/mm tangential line is down to 0.12: fine detail there is nearly gone, though at 10 lp/mm the picture is still usable.'
      ],
      a: 'A fast lens that is sharp in the middle wide open and weak in the corners; stopping down would be expected to close the gap and lift the 30 lp/mm lines.'
    },
    {
      title: 'The same lens on a smaller sensor',
      q: 'A full-frame lens chart is quoted at 10 and 30 lp/mm. The lens is fitted to an APS-C camera (crop factor 1.53). At which frequencies should its chart be read to judge a print of the same size?',
      steps: [
        { text: 'The smaller image is enlarged 1.53 times more, so detail is 1.53 times finer on the sensor:', tex: '10 \\times 1.53 = 15\\ \\mathrm{lp/mm}, \\qquad 30 \\times 1.53 = 46\\ \\mathrm{lp/mm}' },
        'Only the centre of the chart matters, out to 14.2 mm of image height.'
      ],
      a: 'At about 15 and 46 lp/mm, in the left two-thirds of the chart: the lens must do more on the small sensor, but only with its best part.'
    }
  ],
  quiz: [
    { q: 'On an MTF chart the dashed (tangential) line lies far below the solid (sagittal) line towards the edge. What does this suggest?', choices: ['Astigmatism: detail is blurred more along the radius than across it', 'The lens is perfectly corrected', 'The lens has no distortion', 'The chart is measured at the wrong aperture'], a: 0, why: 'A large gap between the two orientations means the blur is not round, the signature of astigmatism (and coma) towards the edge.' },
    { q: 'What does the 10 lp/mm line mainly describe?', choices: ['Overall contrast of coarse detail', 'The finest detail the lens can resolve', 'The distortion', 'The vignetting'], a: 0, why: 'A low frequency measures the contrast of medium-coarse structure, the "punch"; the 30 or 40 lp/mm line speaks of fine detail.' },
    { q: 'A lens is used on a camera with a smaller sensor than the chart\'s format. To judge the same print size, the chart should be read at higher frequencies.', a: true, why: 'The smaller image is enlarged more, so detail on the sensor must be finer in proportion to the crop factor: 30 lp/mm on full frame is about 46 lp/mm on APS-C.' },
    { q: 'At what image height is the corner of a full-frame sensor (36 mm × 24 mm), in mm?', answer: 21.6, unit: 'mm', why: 'Half the diagonal: $\\sqrt{36^2 + 24^2}/2 = 43.27/2 = 21.6$ mm.' },
    { q: 'Why should one not compare a computed chart from one maker with a measured chart from another?', choices: ['A computed chart shows the ideal design, a measured one the real copy, and frequencies and conventions may differ', 'They use different colours', 'Computed charts are always lower', 'There is no difference'], a: 0, why: 'Design data have no manufacturing errors, and charts differ in frequencies, wavelength weighting and the meaning of solid and dashed lines.' }
  ],
  applications: [
    'Choosing between lenses of similar focal length and aperture: shape and gap tell where each is strong.',
    'Reading lens reviews, which measure MTF50 and plot it against image height for a series of apertures.',
    'Machine vision: a sensor with very fine pixels needs a lens whose MTF at the high frequency stays up to the corner.',
    'Judging what stopping down will do: compare the wide-open and stopped-down charts.'
  ],
  history: 'Lens makers began publishing MTF charts in the 1960s and 1970s, when MTF benches became practical and the transfer function replaced resolving power as the language of lens quality. The pairing of 10 and 30 lp/mm (and, for makers who prefer it, a series of 5, 10, 20 and 40) became the custom of photographic lens data sheets.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 and 11 — aberrations in the field and the transfer function.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — sagittal and tangential MTF and field dependence.',
    'R. Kingslake, *Lens Design Fundamentals* — the image-quality measures used in lens design, including MTF.',
    'Maker\'s explanations of their own MTF charts, which state the frequencies, weighting and conventions used for each series.'
  ],
  sim: 'iq-mtf-chart'
},

/* ================================================================ measuring MTF */
{
  id: 'measuring-mtf', parent: 'image-quality-and-mtf', title: 'Measuring MTF: targets and the slanted edge', level: 3,
  short: 'MTF is measured with bar targets (the USAF 1951 chart, read by eye), Siemens stars and, above all, the slanted-edge method of ISO 12233: photograph a sharp edge tilted by a few degrees, build an oversampled edge profile from all the rows, differentiate it, and take its Fourier transform.',
  keywords: ['measuring MTF', 'USAF 1951', 'slanted edge', 'ISO 12233', 'Siemens star', 'MTF50', 'spatial frequency response', 'SFR', 'edge spread function', 'bar target', 'resolution chart', 'Imatest', 'test chart'],
  prereq: ['the-point-spread-function', 'the-modulation-transfer-function', 'nyquist-sampling-and-aliasing'],
  related: ['reading-mtf-charts', 'system-mtf', 'spatial-frequency-and-line-pairs', 'resolution-limits', 'pixels-per-feature', 'wavefront-sensors', 'testing-surfaces-with-interferometers'],
  body: `
Three questions are asked of an image-forming system: how fine a pattern can it show? how much contrast does it keep at each scale? and is the answer the same everywhere in the picture? Different targets answer different parts.

### Bar targets and the USAF chart
The **USAF 1951** chart is the best-known resolution target: groups of three bars in two orientations, in groups numbered from −2 up to 7, each group six elements, each element smaller than the one before by the factor $2^{1/6} = 1.122$. The frequency of group $g$, element $e$ is

$$\\nu = 2^{\\,g + (e-1)/6}\\ \\text{lp/mm}$$

| Group, element | 0,1 | 2,1 | 4,1 | 5,1 | 6,1 | 7,1 | 7,6 |
|---|---|---|---|---|---|---|---|
| lp/mm | 1.0 | 4.0 | 16 | 32 | 64 | 128 | 228 |

The reader notes the smallest element in which the three bars can still be counted. That is a **limiting resolution**, found by eye, on a threshold nobody records; it says nothing of the contrast at coarser elements, and on a sensor it depends on how the bars fall on the pixels. The frequency is on the *target*, so divide by the magnification to get the frequency on the sensor.

### Siemens stars and zone plates
A **Siemens star** is a disc of radial wedges, $n$ bright and $n$ dark. At radius $r$ the pattern's frequency is $\\nu = n/(2\\pi r)$, so the fineness rises continuously towards the centre: a lens or a sensor shows the spot where the spokes merge into grey, in every direction at once. It reveals astigmatism (an elongated grey zone), aliasing (counter-patterns) and sharpening. A zone plate does the same in a different geometry (see [[nyquist-sampling-and-aliasing]]).

### The slanted edge (ISO 12233)
For digital cameras the standard method uses a sharp dark-to-light edge tilted by a few degrees, about 5°, against the pixel rows:

1. Photograph the edge (a moderate contrast, a few to one, so that nothing clips) in raw or linear data.
2. Find the edge position in each row. Because the edge is tilted, each row sees it at a slightly different **sub-pixel** phase.
3. Project every pixel onto the axis perpendicular to the edge and bin by distance, typically in quarters of a pixel. The result is an **oversampled edge-spread function** with many more points than the pixel pitch.
4. Differentiate it to get the line-spread function; apply a smooth window.
5. Take the Fourier transform. Its magnitude, normalised to 1 at zero frequency, is the MTF in the direction across the edge, up to and beyond Nyquist.

The tilt matters twice: it gives the oversampling, and it spreads the phase of the sampling so that aliasing averages out instead of changing the result with the position of the edge. The numbers reported are **MTF50** (the frequency at which the curve crosses 0.5), the MTF at Nyquist, and the whole curve, in cycles per pixel, lp/mm or line widths per picture height (LW/PH). One cycle per pixel on a sensor with 4 000 rows is 8 000 LW/PH.

### Things that spoil a measurement
- **Focus**: the test must be at the best focus for the position measured; repeat with small steps.
- **What is measured**: the slanted edge measures the whole chain, lens, filter, pixel *and any sharpening or demosaicing in the camera*; a processed JPEG gives a flattered, non-linear MTF. Use raw data.
- **The target**: an edge that is not sharp, a target not flat, or uneven lighting changes the result. A Siemens star printed on glossy paper reflects the light source.
- **Noise and clipping**: noise raises the high-frequency tail; clipping bends the profile.
- **Orientation and position**: measure both edge orientations and several places; a lens has many MTFs.

> [!key] The USAF chart gives a limit read by eye; the Siemens star shows the limit in every direction; the slanted edge (ISO 12233) gives the full MTF curve and MTF50 from an oversampled edge, if the data are raw and the focus is right.
`,
  ideas: [
    'The USAF 1951 chart has frequency 2^(g + (e−1)/6) lp/mm, from 1 lp/mm at group 0 element 1 to 228 at group 7 element 6.',
    'Reading a bar chart by eye gives a limiting resolution on an unrecorded threshold; it is not an MTF.',
    'A Siemens star has frequency n/(2πr): the spokes merge at the radius where the system\'s contrast vanishes, in every direction.',
    'In the slanted-edge method the tilt gives sub-pixel sampling: an oversampled edge profile, differentiated and Fourier-transformed, gives the MTF.',
    'Measure on raw data at best focus, because processing and focus errors change the curve.'
  ],
  pitfalls: [
    'Reading the smallest group on the USAF chart gives the lens MTF — It gives a limiting resolution, by eye, of the whole system on that chart; it carries no contrast information and depends on how the bars sit on the pixels.',
    'An edge aligned with the pixel rows is the best test — An aligned edge samples only one phase and gives an aliased, unreliable result. The few-degree tilt is the essence of the method.',
    'MTF measured from a camera\'s JPEG is the lens MTF — It includes in-camera sharpening and tone curves, which can lift the MTF above 1 and bend it. Use raw, linear data.',
    'A single MTF50 describes the lens — It describes one place, one direction, one focus and one aperture of the whole chain.'
  ],
  terms: [
    { term: 'USAF 1951 target', also: ['USAF chart', 'resolution test chart'], def: 'A resolution chart of groups of three bars in two orientations, each element finer than the last by 2^(1/6); the frequency of group g, element e is 2^(g+(e−1)/6) lp/mm.' },
    { term: 'Slanted-edge method', also: ['SFR', 'spatial frequency response', 'ISO 12233'], def: 'The standard method of measuring the MTF of a digital camera: an edge tilted by a few degrees is imaged, an oversampled edge-spread function is built from all rows, and its derivative is Fourier-transformed.' },
    { term: 'Siemens star', also: ['spoke target', 'radial star'], def: 'A circle of n bright and n dark radial wedges. The local frequency n/(2πr) rises towards the centre.' },
    { term: 'Spatial frequency response', also: ['SFR'], def: 'The name ISO 12233 gives to the measured MTF of a sampled system such as a digital camera.' },
    { term: 'Limiting resolution', also: ['visual resolution'], def: 'The finest pattern of a bar chart that can still be seen or counted. It depends on the observer and on a contrast threshold.' }
  ],
  formulas: [
    {
      name: 'USAF 1951 group and element',
      expr: 'nu = 1000*2^(g + (el - 1)/6)', tex: '\\nu = 2^{\\,g + (\\mathrm{el} - 1)/6}\\ \\mathrm{lp/mm}',
      vars: {
        nu: { name: 'spatial frequency on the target', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu' },
        g: { name: 'group number', value: 4, min: -2, max: 7 },
        el: { name: 'element number', value: 3, min: 1, max: 6, tex: '\\mathrm{el}' }
      },
      note: 'The frequency is on the target itself; divide by the magnification to find it on the sensor.',
      stories: { nu: 'A resolution chart is read down to group {g}, element {el}. What is that in line pairs per millimetre?' }
    },
    {
      name: 'Frequency in a Siemens star',
      expr: 'nu = n/(2*pi*r)', tex: '\\nu = \\frac{n}{2\\pi r}',
      vars: {
        nu: { name: 'spatial frequency at radius r', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu' },
        n: { name: 'number of bright wedges (line pairs round the circle)', value: 36, min: 1, max: 1000, int: true },
        r: { name: 'radius', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'On the star itself, or on the sensor if r is the radius of its image.',
      stories: { nu: 'A Siemens star with {n} wedge pairs is photographed. At a radius of {r} in the image, what is its spatial frequency?', r: 'In a Siemens star of {n} wedge pairs the spokes blur into grey where the frequency is {nu}. At what radius?' }
    },
    {
      name: 'Line widths per picture height',
      expr: 'LW = 2*c*Hp', tex: '\\mathrm{LW/PH} = 2\\,c\\,H_p',
      vars: {
        LW: { name: 'line widths per picture height', tex: '\\mathrm{LW/PH}' },
        c: { name: 'frequency in cycles per pixel', value: 0.25, min: 0, max: 2 },
        Hp: { name: 'number of pixel rows in the picture height', value: 4000, min: 1, tex: 'H_p' }
      },
      note: 'How the MTF50 of a slanted-edge test is often reported.'
    }
  ],
  examples: [
    {
      title: 'Reading a USAF chart',
      q: 'The smallest set of bars you can count on a USAF 1951 chart is group 4, element 3. The chart is photographed so that its image is half its size (m = 0.5). What is the limiting resolution on the chart and on the sensor?',
      steps: [
        { text: 'On the chart:', tex: '\\nu = 2^{4 + 2/6} = 2^{4.333} = 20.2\\ \\mathrm{lp/mm}' },
        { text: 'The image is half the size, so the pattern is twice as fine:', tex: '\\nu_{\\mathrm{img}} = \\frac{20.2}{0.5} = 40.3\\ \\mathrm{lp/mm}' }
      ],
      a: '20.2 lp/mm on the chart, 40 lp/mm on the sensor. This is a limit read by eye; it does not give the contrast kept at lower frequencies.'
    },
    {
      title: 'From a slanted edge to the numbers',
      q: 'A slanted-edge test of a 6 000 × 4 000 sensor with 6 µm pixels gives an MTF50 of 0.22 cycles per pixel. State it in lp/mm and in line widths per picture height.',
      steps: [
        { text: 'In lp/mm, divide by the pixel pitch:', tex: '\\nu_{50} = \\frac{0.22}{0.006\\ \\mathrm{mm}} = 36.7\\ \\mathrm{lp/mm}' },
        { text: 'In LW/PH, count the cycles across 4 000 rows and double them:', tex: '2 \\times 0.22 \\times 4000 = 1760\\ \\mathrm{LW/PH}' }
      ],
      a: '37 lp/mm, or 1 760 LW/PH. The Nyquist frequency is 0.5 cycles per pixel, so the MTF50 sits at 44 % of Nyquist.'
    }
  ],
  quiz: [
    { q: 'What is the frequency of group 5, element 1 of the USAF 1951 chart, in lp/mm?', answer: 32, unit: 'lp/mm', why: 'Group $g$, element 1: $2^g$ lp/mm, so $2^5 = 32$. Each higher element is finer by $2^{1/6}$.' },
    { q: 'Why is the edge in the ISO 12233 method tilted by a few degrees instead of being aligned with the pixel rows?', choices: ['So that each row samples the edge at a different sub-pixel phase, building an oversampled edge profile and averaging out aliasing', 'To make the edge look sharper', 'Because edges cannot be printed straight', 'To reduce the noise'], a: 0, why: 'The tilt gives an effective sampling much finer than the pixel pitch and spreads the sampling phase, so the result does not depend on where the edge happens to sit among the pixels.' },
    { q: 'An MTF computed from the JPEG of a camera that applies sharpening may exceed 1 at some frequencies.', a: true, why: 'Sharpening is a high-frequency boost, so it can lift the response above 1; this is not the lens. Measurements should use linear raw data.' },
    { q: 'A slanted-edge test gives an MTF50 of 0.30 cycles per pixel on a sensor with 3 000 rows. What is it in line widths per picture height?', answer: 1800, why: '$\\mathrm{LW/PH} = 2 \\times 0.30 \\times 3000 = 1800$.' },
    { q: 'In a Siemens star with 30 wedge pairs, the frequency at a radius of 1 mm on the star is, in lp/mm, about…', choices: ['4.8', '30', '188', '0.5'], a: 0, why: '$\\nu = n/(2\\pi r) = 30/(2\\pi \\times 1) = 4.8$ lp/mm; it rises to 48 lp/mm at 0.1 mm.' }
  ],
  applications: [
    'Camera and lens reviews, which measure the slanted-edge MTF50 and publish it as a number and a curve.',
    'Acceptance tests of machine-vision cameras and lenses, using a target in the working plane.',
    'Quality control on lens production lines, with a projected slit or edge on an MTF bench.',
    'Satellite and aerial cameras, whose MTF is measured on the ground and monitored in orbit with natural and artificial edges.'
  ],
  history: 'The USAF 1951 chart was drawn up for aerial photography and specified in the US military standard MIL-STD-150A; it is still the commonest resolution target. The slanted-edge method was developed in the 1990s for digital imaging and entered the ISO 12233 standard, whose editions since 2000 prescribe it. Peter Burns\'s work on its implementation made it the common method of camera labs.',
  sources: [
    'ISO 12233, *Photography — Electronic still picture imaging — Resolution and spatial frequency responses* — the standard; several editions.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — knife-edge, slit and bar-target methods and the MTF of sampled systems.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — test targets and the measurement of camera MTF.',
    'MIL-STD-150A, *Photographic Lenses* (1959) — the specification of the 1951 USAF resolving-power test target.'
  ],
  sim: 'iq-slanted-edge'
},

/* ================================================================ distortion and calibration */
{
  id: 'lens-distortion-and-calibration', parent: 'image-quality-and-mtf', title: 'Distortion and camera calibration', level: 2,
  short: 'Distortion does not blur an image; it puts every point sharply at the wrong distance from the centre, so straight lines bow: barrel, pincushion or a wavy mustache. It is stated in per cent at the edge of the field, and measured and removed by photographing a checkerboard from several angles, the core of camera calibration.',
  keywords: ['distortion', 'barrel distortion', 'pincushion distortion', 'mustache distortion', 'radial distortion', 'Brown model', 'Brown-Conrady', 'calibration', 'checkerboard', 'undistortion', 'reprojection error', 'intrinsics', 'tangential distortion', 'lens correction'],
  prereq: ['distortion', 'projections:the-camera-model'],
  related: ['projections:camera-calibration-and-homography', 'projections:fisheye-projections', 'projections:rectilinear-lens', 'fisheye-lenses', 'telecentricity', 'choosing-a-machine-vision-lens', 'pixels-per-feature', 'relative-illumination-and-shading'],
  body: `
Photograph a brick wall and the horizontal courses of brick bow outwards, or inwards, near the edges of the picture. Nothing is blurred: each point of the wall is imaged sharply, but at the wrong distance from the centre. This is **distortion**. A lens that is free of it is called **rectilinear**: a point at an angle $\\theta$ to the axis falls at the image height $r = f\\tan\\theta$, and straight lines stay straight.

### Three shapes, one number
Distortion is the relative error in image height, quoted at the edge of the field:

$$D = \\frac{r' - r}{r}\\times 100\\ \\%$$

where $r$ is the ideal height and $r'$ the actual one.

- **Barrel** ($D < 0$): points are pulled towards the centre, so the lines bulge outwards. Typical of wide-angle lenses and of the wide end of zooms.
- **Pincushion** ($D > 0$): points are pushed outwards, so the lines are pinched inwards. Typical of the long end of zooms and of telephoto lenses.
- **Mustache** (wavy): barrel near the centre turning to pincushion towards the corners; common in wide-angle lenses with a complex design, and the hardest to correct by hand.

The cause is the position of the aperture stop relative to the lens ([[distortion]] is the aberration page). The quick test is a picture of a spirit level or a brick wall; the quantitative one is a grid.

### Orders of magnitude
| Lens | Typical distortion before correction |
|---|---|
| Good fixed lens of normal focal length | under 1 % |
| Consumer zoom, wide end | −2 % to −5 % |
| Machine-vision lens, 8–25 mm | 0.1 % to 2 % |
| Ultra-wide fixed lens | −5 % to −10 % or more |
| Telecentric lens | below 0.1 % |
| Fisheye | by design a different projection, e.g. $r = f\\theta$ ([[fisheye-lenses]]) |

At 3 % on a 6 000 × 4 000 picture, a point at the corner (3 606 pixels from the centre) lies 108 pixels from where a rectilinear lens would put it: invisible in a landscape, ruinous for measurement.

### The model
The standard description, the **Brown–Conrady model**, writes the distorted radius with a short series in the normalised radius $r$ (0 at the centre, 1 at the corner):

$$r_d = r\\,(1 + k_1 r^2 + k_2 r^4)$$

so the distortion at the edge is $100\\,(k_1 + k_2)$ per cent. A negative $k_1$ is barrel; a mustache has $k_1$ and $k_2$ of opposite sign. Two further terms, $p_1$ and $p_2$, describe the tilt of the lens against the sensor (decentring).

### Calibration
To measure the coefficients, photograph a flat **checkerboard** (or grid of circles) of known squares from ten to twenty positions and angles, so that its corners cover the whole field. Software finds the corners to a fraction of a pixel and then solves, for all pictures together, for the lens's focal length in pixels, its principal point, the coefficients $k_1, k_2, p_1, p_2$ and the position of the board in each picture, until the **reprojection error**, the distance between where the model puts the corners and where they were found, is as small as possible, typically 0.1 to 0.5 pixel. The result is a map that **undistorts** any picture from that camera.

Four rules make a good calibration: a really flat board; sharp pictures; fixed focus and zoom (distortion changes with both, so a calibration holds for one setting); and tilted views, because a board seen face-on cannot separate focal length from distortion.

### What is not distortion
The stretched look of faces at the edge of a wide-angle photograph is **perspective**, not distortion: it belongs to the geometry of projecting a sphere of directions onto a plane and disappears with distance. The darkening of the corners is [[relative-illumination-and-shading|shading]], not distortion.

> [!key] Distortion is the error in image height, D = (r′ − r)/r, in per cent at the edge; barrel is negative, pincushion positive. A checkerboard from several angles gives the coefficients k₁, k₂ of the model r_d = r(1 + k₁r² + k₂r⁴), which undistort the picture.
`,
  ideas: [
    'Distortion moves every point sharply to the wrong distance from the centre; it does not blur.',
    'D = (r′ − r)/r in per cent at the edge: barrel is negative, pincushion positive, mustache changes sign.',
    'The Brown–Conrady model r_d = r(1 + k₁r² + k₂r⁴) describes radial distortion with two coefficients (and decentring with two more).',
    'Calibration photographs a flat checkerboard from many angles and solves for the focal length, principal point and distortion by minimising the reprojection error.',
    'A calibration is valid only for one focus and zoom setting; perspective stretching at the edges is not distortion.'
  ],
  pitfalls: [
    'Distortion is a loss of sharpness — Every point is sharp; only its position is wrong. Blur comes from the other aberrations.',
    'A wide-angle lens stretches faces because it distorts — The stretch is perspective, which follows from the angle of view, and a perfectly rectilinear lens shows it too.',
    'Distortion is the same at all focus and zoom settings — It changes with focus distance and, in zooms, with focal length; a calibration is valid only for the setting at which it was made.',
    'One checkerboard picture is enough to calibrate — A face-on board cannot separate focal length from distortion; several tilted views covering the whole field are needed.'
  ],
  terms: [
    { term: 'Distortion', also: ['geometric distortion', 'optical distortion'], def: 'The error in image height of a lens, (r′ − r)/r, as a percentage; it bends straight lines without blurring them.' },
    { term: 'Barrel distortion', also: ['negative distortion'], def: 'Distortion in which image points are pulled towards the centre, so lines near the edge bulge outwards. Typical of wide-angle lenses.' },
    { term: 'Pincushion distortion', also: ['positive distortion'], def: 'Distortion in which image points are pushed outwards, so lines near the edge bow inwards. Typical of telephoto lenses.' },
    { term: 'Mustache distortion', also: ['wavy distortion', 'complex distortion'], def: 'Barrel near the centre and pincushion near the edge (or the reverse), with k₁ and k₂ of opposite sign.' },
    { term: 'Camera calibration', also: ['lens calibration', 'geometric calibration'], def: 'The measurement of a camera\'s focal length, principal point and distortion coefficients from pictures of a known target, usually a checkerboard.' },
    { term: 'Reprojection error', def: 'After calibration, the distance in pixels between where the model places a known point and where it was found in the picture. The measure of a good calibration.' }
  ],
  formulas: [
    {
      name: 'Radial distortion (Brown model)',
      expr: 'rd = r*(1 + k1*r^2 + k2*r^4)', tex: 'r_d = r\\,(1 + k_1 r^2 + k_2 r^4)',
      vars: {
        rd: { name: 'distorted (recorded) radius, normalised', tex: 'r_d' },
        r: { name: 'ideal radius, normalised to the corner', value: 1, min: 0, max: 1.5 },
        k1: { name: 'first coefficient', value: -0.08, signed: true, tex: 'k_1' },
        k2: { name: 'second coefficient', value: 0.03, signed: true, tex: 'k_2' }
      },
      note: 'r = 1 at the corner of the picture. Negative k₁: barrel.',
      stories: { rd: 'A lens has k₁ = {k1} and k₂ = {k2}. A point at the normalised radius {r} is recorded at what radius?' }
    },
    {
      name: 'Distortion in per cent',
      expr: 'D = 100*(rp - r)/r', tex: 'D = 100\\,\\frac{r\' - r}{r}',
      vars: {
        D: { name: 'distortion (per cent)', signed: true },
        rp: { name: 'actual image height', q: 'length', unit: 'mm', value: 19.4, tex: 'r\'' },
        r: { name: 'ideal image height, f tan θ', q: 'length', unit: 'mm', value: 20 }
      },
      note: 'Negative is barrel, positive is pincushion.',
      stories: { D: 'A point that should fall {r} from the centre falls {rp} from it. What is the distortion?' }
    },
    {
      name: 'Position error at the edge',
      expr: 'err = D*R/100', tex: '\\mathrm{err} = \\frac{D\\,R}{100}',
      vars: {
        err: { name: 'displacement of the point (pixels)', signed: true, tex: '\\mathrm{err}' },
        D: { name: 'distortion at that point (per cent)', value: -3, signed: true },
        R: { name: 'ideal distance from the centre (pixels)', value: 3606 }
      },
      note: 'The distortion at the corner times the corner distance: the number that decides whether a measurement is spoiled.',
      stories: { err: 'A lens has a distortion of {D} at the corner of a picture whose corner is {R} pixels from the centre. How far is the corner point displaced, in pixels?' }
    }
  ],
  examples: [
    {
      title: 'A wavy wide-angle lens',
      q: 'A wide-angle lens has $k_1 = -0.08$ and $k_2 = +0.10$. What is its distortion at the normalised radii 0.5 and 1, and where does it change sign?',
      steps: [
        { text: 'The relative error is $k_1 r^2 + k_2 r^4$. At $r = 0.5$:', tex: '-0.08 \\times 0.25 + 0.10 \\times 0.0625 = -0.0138 \\;\\Rightarrow\\; -1.4\\ \\%' },
        { text: 'At the corner, $r = 1$:', tex: '-0.08 + 0.10 = +0.02 \\;\\Rightarrow\\; +2.0\\ \\%' },
        { text: 'The sign changes where $k_1 + k_2 r^2 = 0$:', tex: 'r = \\sqrt{0.08/0.10} = 0.89' }
      ],
      a: 'Barrel of 1.4 % at half radius, pincushion of 2 % at the corner, with the change at 0.89 of the corner distance: a mustache.'
    },
    {
      title: 'How much does 3 % matter?',
      q: 'A camera of 6 000 × 4 000 pixels has a lens with barrel distortion of 3 % at the corner. A part is to be measured to within 1 pixel anywhere in the picture. Is the raw picture usable?',
      steps: [
        { text: 'The corner is at', tex: 'R = \\sqrt{3000^2 + 2000^2} = 3606\\ \\text{pixels}' },
        { text: 'The displacement is', tex: 'e = 0.03 \\times 3606 = 108\\ \\text{pixels}' }
      ],
      a: 'No: the corner is 108 pixels out, a hundred times the tolerance. The picture must be undistorted with a calibrated model (or a lens with 0.1 % used, which would still give 3.6 pixels at the corner).'
    }
  ],
  quiz: [
    { q: 'A lens images a point that should be 20.0 mm from the centre at 19.4 mm. What is its distortion, in per cent?', answer: -3, unit: '%', why: '$D = (19.4 - 20.0)/20.0 \\times 100 = -3\\ \\%$: a barrel distortion, the point pulled towards the centre.' },
    { q: 'In pincushion distortion, straight lines near the edge of the picture…', choices: ['bow inwards, towards the centre', 'bulge outwards', 'stay straight but blur', 'stay straight but tilt'], a: 0, why: 'Points are pushed outwards in proportion to their radius, so lines that do not pass through the centre curve with their middle nearer the centre; barrel does the opposite.' },
    { q: 'The stretched look of faces at the edge of a wide-angle photograph shows that the lens has strong distortion.', a: false, why: 'It is perspective, the geometry of projecting a wide field onto a plane. A perfectly rectilinear wide-angle lens shows it too.' },
    { q: 'Why does a camera calibration need pictures of the board at several tilts?', choices: ['A face-on board cannot separate the focal length from the distortion; tilted views can', 'Tilting makes the corners easier to find', 'The lens needs to warm up', 'It reduces the noise'], a: 0, why: 'In a face-on view a change of focal length and a change of distortion can look alike; with tilted views of a flat board the perspective ties down the focal length independently.' },
    { q: 'A lens has $k_1 = -0.05$ and $k_2 = 0$. What is its distortion at the corner, in per cent?', answer: -5, unit: '%', why: 'At $r = 1$ the relative error is $k_1 + k_2 = -0.05$, that is $-5\\ \\%$ (barrel).' }
  ],
  applications: [
    'Machine vision and metrology: every measurement from an image first undistorts it with the calibrated model, or uses a telecentric lens.',
    'Photogrammetry, stereo and structure-from-motion: calibration gives the lens model on which the 3-D reconstruction depends.',
    'Phone cameras and drones: distortion is corrected in software for every picture, which allows very wide, simple, small lenses.',
    'Augmented reality and vehicle cameras: the model keeps overlaid graphics registered with the scene.',
    'Photography: lens-correction profiles in raw converters remove barrel, pincushion and mustache automatically.'
  ],
  history: 'Photogrammetrists measured and modelled lens distortion long before electronic cameras, using test fields of marked points; Duane C. Brown\'s models of radial and decentring distortion, published in the 1960s and early 1970s, are still the ones in use. Zhang\'s 2000 method, which needs only a flat printed pattern shown from a few positions, turned calibration from a laboratory task into one that anyone with a printer can do.',
  sources: [
    'E. Hecht, *Optics*, ch. 6 — distortion among the five Seidel aberrations.',
    'Z. Zhang, "A flexible new technique for camera calibration", *IEEE Transactions on Pattern Analysis and Machine Intelligence* 22 (2000) — the checkerboard method.',
    'D. C. Brown, "Decentering distortion of lenses", *Photogrammetric Engineering* 32 (1966) — the radial and decentring distortion model.',
    'W. J. Smith, *Modern Optical Engineering* — distortion and its relation to the stop position.'
  ],
  sim: 'iq-distortion-grid'
},

/* ================================================================ relative illumination and shading */
{
  id: 'relative-illumination-and-shading', parent: 'image-quality-and-mtf', title: 'Relative illumination and shading', level: 2,
  short: 'Even a perfect lens gives a dimmer image towards the corners: for a simple lens the light falls as cos⁴ of the field angle, a stop and a half at 40°, and rims in the lens barrel can take more. A flat-field correction undoes it, at the price of noisier corners.',
  keywords: ['relative illumination', 'cos4', 'cos^4 law', 'natural vignetting', 'mechanical vignetting', 'optical vignetting', 'shading', 'flat field', 'flat-field correction', 'lens shading', 'corner darkening', 'colour shading', 'chief ray angle', 'light fall-off'],
  prereq: ['the-f-number', 'vignetting', 'inverse-square-and-cosine-laws'],
  related: ['microlenses-bsi-and-stacked-sensors', 'image-circle-and-sensor-coverage', 'lens-distortion-and-calibration', 'sensor-noise', 'reading-a-lens-datasheet', 'telecentricity', 'machine-vision-lighting', 'entrance-and-exit-pupils'],
  body: `
Photograph a plain white wall with a wide-angle lens and the corners come out darker than the centre. Two effects are at work: one is physics that even a perfect lens cannot avoid, the other is how the lens is built.

### The cos⁴ law
Take a simple lens focused at infinity with a field angle $\\theta$. Light from a point at that angle reaches the sensor less brightly than light on the axis, for three reasons that each give a factor $\\cos\\theta$ or $\\cos^2\\theta$:

- The round aperture, seen from the oblique direction, looks like an ellipse with less area: **×cos θ**.
- The path from the lens to the corner of the sensor is longer, $d/\\cos\\theta$, so the inverse-square law costs **×cos² θ**.
- The light arrives at the sensor at an angle, so it is spread over a larger area of the surface: **×cos θ**.

$$\\mathrm{RI}(\\theta) = \\frac{E(\\theta)}{E(0)} = \\cos^4\\theta$$

| Field angle | 10° | 20° | 30° | 40° | 45° |
|---|---|---|---|---|---|
| cos⁴ θ | 0.94 | 0.78 | 0.56 | 0.34 | 0.25 |
| loss in stops | 0.09 | 0.36 | 0.83 | 1.54 | 2.00 |

A 24 mm lens on full frame has a corner angle of 42°, and cos⁴ gives 0.31: 1.7 stops. A 85 mm lens (14°) loses only 0.18 stops. A longer focal length or a smaller sensor means a smaller angle and less fall-off.

### Real lenses do differently
The cos⁴ law is a baseline. Wide-angle lenses of retrofocus design have an entrance pupil that appears *larger* off axis, and do better than cos⁴. A **telecentric** lens has its exit pupil at infinity, so its image-side rays are parallel to the axis and none of these factors applies. On the other side stands **mechanical (optical) vignetting**: lens rims and the barrel cut off part of the oblique beam, so the aperture becomes a lens-shaped sliver that gets narrower towards the corner. This loss shrinks as the lens is **stopped down**, usually vanishing one to two stops from wide open, while the cos⁴ loss does not change with aperture. Filters and hoods can add a vignette of their own.

### Shading from the sensor
The sensor adds its own shading. Each pixel has a microlens designed for a particular **chief-ray angle**; at the edge of the sensor the light comes at a larger angle than the microlens was designed for, and some of it misses the photodiode or leaks into a neighbour: darker corners and, because the filters in front of the sensor are angle-dependent, colour casts, typically magenta or green in the corners ([[microlenses-bsi-and-stacked-sensors]]). Short-flange mirrorless cameras used with older wide-angle lenses show it most.

### Flat-field correction
Shading is smooth, repeatable and multiplicative, which makes it easy to remove. Photograph a **uniform grey field** (a diffuser in front of the lens, or an even light box) with the same lens, aperture and focus, and subtract a dark frame from it. Each pixel's flat-field value $F$ gives a gain $g = \\bar F/F$, the mean of the frame divided by that pixel. Multiplying every later picture by the gain map restores the flat field. In machine vision this is a standard step, built into many cameras; photographic software does the same with stored lens profiles.

The price is noise. Light at the corner is weaker by $\\mathrm{RI}$; multiplying the signal by $g = 1/\\mathrm{RI}$ multiplies the noise by the same factor, so the corner is as noisy as it would have been with $\\mathrm{RI}$ times the light: with shot noise, the signal-to-noise ratio is $\\sqrt{\\mathrm{RI}}$ of the centre's, a drop of about 44 % at RI = 0.31. Correction cannot restore the lost light, only equalise the brightness ([[sensor-noise]]).

> [!key] A simple lens gives RI = cos⁴θ: 1.5 stops at 40°. Rims in the lens add more, shrinking as it is stopped down; the sensor adds colour and brightness shading. A flat-field gain restores uniformity but makes the corners noisier by √RI.
`,
  ideas: [
    'For a simple lens the illumination off axis falls as cos⁴ of the field angle: three factors, from the pupil, the distance and the oblique landing.',
    'The loss is a stop and a half at 40° and two stops at 45°; longer lenses and smaller sensors see smaller angles.',
    'Mechanical vignetting adds to it and shrinks on stopping down; the cos⁴ loss does not depend on the aperture.',
    'The sensor adds shading too: microlens and chief-ray-angle mismatch darken the corners and tint them.',
    'A flat-field gain map corrects the brightness but not the noise: the corners come out noisier by √RI.'
  ],
  pitfalls: [
    'Stopping down removes all corner darkening — It removes the mechanical part; the natural cos⁴ fall-off stays at any aperture.',
    'Vignetting and distortion are the same thing — Vignetting is a loss of light towards the corners; distortion is a displacement of image points. Different aberrations, different cures.',
    'Flat-field correction restores the lost light — It rescales the pixel values; the corners still gathered less light, so they remain noisier.',
    'The cos⁴ law is exact for every lens — It is the baseline for a simple lens; retrofocus wide-angles do better, telecentric lenses escape it, and mechanical vignetting adds to it.'
  ],
  terms: [
    { term: 'Relative illumination', also: ['RI', 'relative brightness', 'corner illumination'], def: 'The illuminance at a point of the image divided by that on the axis, for a uniformly bright subject. For a simple lens cos⁴ of the field angle.' },
    { term: 'cos⁴ law', also: ['natural vignetting', 'cosine fourth law'], def: 'The fall of image illuminance with the fourth power of the cosine of the field angle, unavoidable for a simple lens.' },
    { term: 'Mechanical vignetting', also: ['optical vignetting'], def: 'The loss of light towards the corners caused by lens rims and barrel cutting off part of the oblique beam; it falls with stopping down.' },
    { term: 'Flat-field correction', also: ['shading correction', 'flat fielding'], def: 'Multiplying each pixel by a gain from a picture of a uniform field, so that a uniform scene gives a uniform image; also removes dust shadows.' },
    { term: 'Chief ray angle', also: ['CRA'], def: 'The angle at which the central ray of a beam meets the sensor; sensor microlenses are designed for a CRA that grows towards the edge.' },
    { term: 'Colour shading', also: ['colour cast in the corners'], def: 'A change of colour towards the edge of the picture, from angle-dependent filters and microlenses in front of the sensor.' }
  ],
  formulas: [
    {
      name: 'The cos⁴ law',
      expr: 'RI = cos(theta)^4', tex: '\\mathrm{RI} = \\cos^4\\theta',
      vars: {
        RI: { name: 'relative illumination (centre = 1)', min: 0, max: 1 },
        theta: { name: 'field angle', q: 'angle', unit: '°', value: 40, min: 0, max: 80, tex: '\\theta' }
      },
      note: 'For a simple lens with no mechanical vignetting.',
      stories: { RI: 'A simple lens is used at a field angle of {theta}. What fraction of the central illuminance reaches that point?' }
    },
    {
      name: 'Corner angle of a lens',
      expr: 'theta = atan(d/(2*f))', tex: '\\theta = \\arctan\\frac{d}{2f}',
      vars: {
        theta: { name: 'half-angle at the corner', q: 'angle', unit: '°', tex: '\\theta' },
        d: { name: 'sensor diagonal', q: 'length', unit: 'mm', value: 43.27 },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 24 }
      },
      note: 'For a rectilinear lens focused at infinity. The full-frame diagonal is 43.27 mm.',
      stories: { theta: 'A {f} lens covers a sensor with a diagonal of {d}. What is the field angle at the corner?' }
    },
    {
      name: 'Light lost in stops',
      expr: 'S = -log2(RI)', tex: 'S = -\\log_2 \\mathrm{RI}',
      vars: {
        S: { name: 'light lost, in stops' },
        RI: { name: 'relative illumination', value: 0.31, min: 0.001, max: 1 }
      },
      stories: { S: 'The corners of a picture receive {RI} of the central illuminance. How many stops darker are they?' }
    },
    {
      name: 'Noise cost of the correction',
      expr: 'q = sqrt(RI)', tex: 'q = \\sqrt{\\mathrm{RI}}',
      vars: {
        q: { name: 'corner SNR ÷ centre SNR after flat-field correction' },
        RI: { name: 'relative illumination at the corner', value: 0.31, min: 0.001, max: 1 }
      },
      note: 'For shot-noise-limited signals, in which SNR grows as the square root of the light.'
    }
  ],
  examples: [
    {
      title: 'A wide-angle on full frame',
      q: 'A 24 mm lens is used on a full-frame sensor (diagonal 43.27 mm). By how much, in stops, does the cos⁴ law darken the corner, and what gain does a flat-field correction apply there?',
      steps: [
        { text: 'Corner angle:', tex: '\\theta = \\arctan\\frac{43.27}{2 \\times 24} = \\arctan 0.901 = 42.0°' },
        { text: 'Relative illumination:', tex: '\\mathrm{RI} = \\cos^4 42.0° = 0.743^4 = 0.305' },
        { text: 'Stops, and gain:', tex: 'S = -\\log_2 0.305 = 1.7, \\qquad g = \\frac{1}{0.305} = 3.3' }
      ],
      a: '1.7 stops darker; a gain of 3.3 at the corner. The corner\'s SNR after correction is √0.305 = 0.55 of the centre\'s.'
    },
    {
      title: 'Why a longer lens needs no correction',
      q: 'Compare the corners of a full-frame picture taken with an 85 mm lens, using the cos⁴ law.',
      steps: [
        { text: '', tex: '\\theta = \\arctan\\frac{43.27}{2 \\times 85} = 14.3°, \\qquad \\mathrm{RI} = \\cos^4 14.3° = 0.88' },
        'That is a loss of $-\\log_2 0.88 = 0.18$ stop: hardly visible.'
      ],
      a: 'A loss of 12 % (0.18 stop) at the corner: against 70 % for the 24 mm lens. The longer the lens, the smaller the corner angle.'
    }
  ],
  quiz: [
    { q: 'A simple lens is used at a field angle of 30°. What fraction of the central illuminance does it deliver there?', answer: 0.5625, why: '$\\cos^4 30° = (0.866)^4 = 0.5625$, about 0.83 stop darker than the centre.' },
    { q: 'You stop a wide-angle lens down from f/2 to f/8. Which part of the corner darkening is expected to remain?', choices: ['The natural cos⁴ fall-off', 'The mechanical vignetting', 'Both are unchanged', 'Neither: stopping down removes all of it'], a: 0, why: 'Mechanical vignetting shrinks as the aperture closes (the rims no longer cut the beam), while cos⁴ depends only on the field angle.' },
    { q: 'Flat-field correction makes the corners of an image as clean (as little noisy) as the centre.', a: false, why: 'It restores the brightness by multiplying, which multiplies the noise as well. The corner gathered less light and its signal-to-noise ratio stays lower by √RI.' },
    { q: 'How many stops does a loss of the light to 25 % correspond to?', answer: 2, why: 'Each stop is a factor 2: $-\\log_2 0.25 = 2$ stops. This is also $\\cos^4 45°$, the corner of a 90° field of view.' },
    { q: 'Why can the corners be tinted in colour, as well as being darker, with some lens and sensor combinations?', choices: ['The microlenses and filters in front of the sensor depend on the angle at which the light arrives', 'The lens is dirty at the edge', 'The corners are colder', 'Colour cannot vary across a picture'], a: 0, why: 'At large chief-ray angles the light passes the colour filters and microlenses at an angle for which they were not designed, which changes the transmission differently for each colour.' }
  ],
  applications: [
    'Machine vision: a uniform response across the field is needed for fixed thresholds, so cameras apply shading correction from a stored flat-field.',
    'Astrophotography and microscopy: flat frames are taken routinely to remove vignetting and dust shadows.',
    'Photography: lens-correction profiles lift the corners of wide-angle pictures; some photographers add vignetting back on purpose.',
    'Specifying a lens for a large sensor: a datasheet gives the relative illumination at the corner, a number that decides whether correction will be a nuisance.',
    'Lens design: the pupil\'s size off axis is a design target traded against distortion and aberrations.'
  ],
  history: 'The fall of illuminance with the fourth power of the cosine is a classical result of photographic optics. Very wide-angle cameras were once fitted with a graded neutral "centre filter", dark in the middle, to even out the picture, and lens designers later learnt to make the pupil grow off axis, as retrofocus wide-angle lenses do, so that the corners receive more than cos⁴ allows.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering* — the cos⁴ law and vignetting.',
    'R. Kingslake, *Lens Design Fundamentals* — relative illumination and the effect of pupil aberrations.',
    'G. C. Holst, *CCD Arrays, Cameras, and Displays* — shading and flat-field correction.',
    'E. Hecht, *Optics*, ch. 5 and 6 — stops, pupils and vignetting.'
  ],
  sim: 'iq-shading'
},

/* ================================================================ bokeh */
{
  id: 'bokeh-and-out-of-focus-blur', parent: 'image-quality-and-mtf', title: 'Bokeh: the look of blur', level: 2,
  short: 'A point of light outside the plane of focus becomes a disc, a copy of the lens aperture. Its size follows the focal length, f-number and distances; its shape and brightness profile (polygon, cat\'s eye, ring, soft edge) come from the iris, the glass and the aberrations: that is bokeh.',
  keywords: ['bokeh', 'out of focus', 'blur disc', 'circle of confusion', 'iris blades', 'cat\'s eye', 'onion rings', 'mirror lens', 'donut', 'apodization', 'depth of field', 'background blur', 'specular highlights', 'defocus'],
  prereq: ['circle-of-confusion', 'the-f-number', 'spherical-aberration'],
  related: ['depth-of-field', 'aperture-and-f-stops', 'the-point-spread-function', 'system-mtf', 'catadioptric-lenses', 'crop-factor-and-equivalent-focal-length', 'magnification-and-working-distance', 'apertures-irises-and-pinholes'],
  body: `
Point a fast lens at a face in front of a street at night, and the lights behind it, far from the plane of focus, turn into soft discs. Those discs are the lens's **point-spread function for defocus**: a point of light out of focus is imaged as a copy of the aperture itself, and the look of that copy is called **bokeh**, from the Japanese *boke*, blur.

### How big is the disc?
Focus a lens of focal length $f$ and f-number $N$ at a distance $s_0$. A point at distance $s > s_0$ then forms a blur disc on the sensor of diameter

$$b = \\frac{f^2}{N\\,(s_0 - f)}\\cdot\\frac{s - s_0}{s}$$

For a distant background ($s \\to \\infty$) the last factor is 1, and $b = f\\,m/N$ with $m$ the magnification on the subject. An 85 mm lens at f/1.4 focused at 2 m throws a point at infinity into a disc 2.7 mm across, 7.5 % of the width of a full-frame picture. At f/4 it is 0.94 mm. The size grows with the focal length at a given distance, as $f^2$, shrinks in proportion to the f-number, and grows as the background moves away until it saturates at infinity. The same blur disc is what [[circle-of-confusion|the circle of confusion]] and [[depth-of-field|depth of field]] threshold at a very small size: depth of field is about discs too small to see, bokeh about discs too large to miss.

### What decides the shape
| Cause | The disc looks like | Why |
|---|---|---|
| A round iris | a clean circle | the aperture is the shape of the blur |
| Straight iris blades (5 to 9) | a polygon with that many sides | the closed aperture is a polygon; rounded blades give a near circle |
| Optical vignetting at the edge | a lens-shaped "cat's eye" | the rims of the lens clip the oblique beam, more towards the corner |
| Central obstruction of a mirror lens | a ring or doughnut | the secondary mirror blocks the middle of the beam |
| Aspheric surfaces with small ripples | "onion rings", concentric lines inside the disc | the surface isn't perfectly smooth |
| Spherical aberration, one sign | a bright rim, hard edge | more light is sent to the edge of the disc |
| Spherical aberration, other sign | a bright centre fading to a soft edge | the edge is dim |
| An apodization filter (a graded neutral density in the lens) | a soft, Gaussian-like disc | the edge of the aperture is blended away |

The spherical aberration works differently for the background and the foreground: a lens that gives smooth discs behind the subject gives hard-edged rings in front of it, and *vice versa*.

### Why highlights, and why all this matters
Only bright, small sources leave a visible disc; other detail blurs into a general softness. A string of lights or the sun on water give the characteristic shapes; leaves and walls give an even tone. "Good" bokeh is subjective, but smoothness (soft edges, no rings) and a round shape without an obvious polygon are the usual preferences; cheap, distracting rings and a bright edge are the usual complaints.

### The MTF view
The same disc has a transfer function. A blur disc of diameter $b$ has an MTF $2J_1(\\pi b\\nu)/(\\pi b\\nu)$ with its first zero at $\\nu = 1.22/b$ ([[system-mtf]]): beyond it the contrast reverses, so an out-of-focus bar chart shows dark bars where bright ones were. Fine texture is lost and coarse structure survives.

### Sensor size and the "equivalent aperture"
For the same field of view and the same f-number, a larger sensor needs a longer focal length and so draws larger discs: relative to the frame the blur is proportional to the sensor size. This is why a full-frame camera at f/2 blurs the background more than a small-sensor one at f/2, and why the "equivalent aperture" is quoted ([[crop-factor-and-equivalent-focal-length]]).

> [!key] A defocused point becomes a copy of the aperture: size b = f²(s − s₀)/(N s (s₀ − f)); shape and edge profile from the iris, the vignetting, and the spherical aberration of the lens.
`,
  ideas: [
    'An out-of-focus point becomes a disc: a copy of the aperture, whose size is b = f²(s − s₀)/[N s (s₀ − f)].',
    'The background blur grows with the focal length and the background distance and shrinks with the f-number.',
    'The shape comes from the aperture: a circle, a polygon from the blades, a cat\'s eye from vignetting, a ring from a mirror lens.',
    'The brightness profile of the disc comes from aberrations: bright rim, uniform, or soft edge; apodization smooths it.',
    'Bokeh and depth of field are the same blur discs, judged at opposite sizes.'
  ],
  pitfalls: [
    'Bokeh is the blur — The blur is the same physics for every lens at the same settings; bokeh is the quality of it, its shape and profile.',
    'Bokeh is a property of the aperture only — The aperture sets the outline; aberrations set the brightness profile, vignetting the shape in the corners and the iris design the polygon.',
    'More blades always give smoother bokeh — More and rounder blades make the outline rounder, but the edge profile and the rings still depend on the glass.',
    'Blur is the same behind and in front of the subject — The sign of the spherical aberration reverses the profile, so the foreground and the background of one lens can look different.'
  ],
  terms: [
    { term: 'Bokeh', also: ['boke', 'quality of blur'], def: 'The look of out-of-focus areas of a picture: the shape and brightness profile of the blur discs of small bright sources and the smoothness of the blur generally.' },
    { term: 'Blur disc', also: ['circle of confusion', 'disc of confusion'], def: 'The image of an out-of-focus point: a copy of the aperture, of diameter b = f²|s − s₀|/[N s (s₀ − f)].' },
    { term: 'Cat\'s-eye bokeh', also: ['optical vignetting of highlights'], def: 'Blur discs at the edge of the picture that are lens-shaped rather than round, because the rims of the lens clip the oblique beam.' },
    { term: 'Onion-ring bokeh', also: ['onion rings'], def: 'Concentric rings inside blur discs, caused by tiny irregularities on aspheric lens surfaces.' },
    { term: 'Apodization filter', also: ['smooth transition focus'], def: 'A graded neutral-density element in the lens that makes the aperture transparent in the middle and dark at the edge, giving a soft-edged disc.' },
    { term: 'Mirror lens', also: ['catadioptric lens', 'reflex lens'], def: 'A long lens built with mirrors, whose central obstruction makes out-of-focus highlights into rings.' }
  ],
  formulas: [
    {
      name: 'Diameter of the blur disc',
      expr: 'b = f^2*(s - s0)/(N*s*(s0 - f))', tex: 'b = \\frac{f^2\\,(s - s_0)}{N\\,s\\,(s_0 - f)}',
      vars: {
        b: { name: 'diameter of the blur disc on the sensor', q: 'length', unit: 'mm' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 85 },
        N: { name: 'f-number', value: 1.4, min: 0.5, max: 64 },
        s0: { name: 'distance focused on', q: 'length', unit: 'm', value: 2, tex: 's_0' },
        s: { name: 'distance of the out-of-focus point (beyond the focus)', q: 'length', unit: 'm', value: 10 }
      },
      note: 'For a point beyond the plane of focus. A point in front of it gives the same formula with |s − s₀| and a different distance.',
      stories: { b: 'An {f} lens at f/{N} is focused at {s0}. A light {s} away forms a blur disc of what diameter on the sensor?' }
    },
    {
      name: 'Blur of a point at infinity',
      expr: 'b = f*m/N', tex: 'b_{\\infty} = \\frac{f\\,m}{N}',
      vars: {
        b: { name: 'diameter of the blur disc', q: 'length', unit: 'mm', tex: 'b_{\\infty}' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 85 },
        m: { name: 'magnification on the subject', value: 0.044, min: 0.0001, max: 10 },
        N: { name: 'f-number', value: 1.4, min: 0.5, max: 64 }
      },
      note: 'The largest disc a distant background can produce at that focus. The magnification is f/(s₀ − f).',
      stories: { b: 'A lens of {f} at f/{N} gives the subject a magnification of {m}. How large is the blur disc of the distant background?' }
    },
    {
      name: 'Where the blur disc reverses contrast',
      expr: 'nu0 = 1.22/b', tex: '\\nu_0 = \\frac{1.22}{b}',
      vars: {
        nu0: { name: 'first zero of the defocus MTF', q: 'spatialfreq', unit: 'lp/mm', tex: '\\nu_0' },
        b: { name: 'diameter of the blur disc', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'Above this frequency the contrast of a defocused target reverses.',
      stories: { nu0: 'A defocused point forms a blur disc {b} across. At what frequency does the contrast of fine detail first vanish?' }
    }
  ],
  examples: [
    {
      title: 'The portrait lens',
      q: 'An 85 mm lens at f/1.4 is focused at 2 m. How big is the blur disc of a street light at infinity? At f/4? What fraction of a 36 mm frame width is it?',
      steps: [
        { text: 'The magnification at 2 m:', tex: 'm = \\frac{f}{s_0 - f} = \\frac{85}{1915} = 0.0444' },
        { text: 'At infinity, f/1.4:', tex: 'b = \\frac{f\\,m}{N} = \\frac{85 \\times 0.0444}{1.4} = 2.69\\ \\mathrm{mm}' },
        { text: 'At f/4:', tex: 'b = \\frac{3.77}{4} = 0.94\\ \\mathrm{mm}' },
        'As a fraction of 36 mm: 7.5 % and 2.6 %.'
      ],
      a: '2.7 mm (7.5 % of the frame width) at f/1.4; 0.94 mm (2.6 %) at f/4. Closing from f/1.4 to f/4 divides the disc by the ratio of the f-numbers, 2.9.'
    },
    {
      title: 'The mirror-lens doughnut',
      q: 'A 500 mm f/8 mirror lens is focused at 20 m. How large is the blur disc of the distant background, and what shape?',
      steps: [
        { text: '', tex: 'b = \\frac{f^2}{N\\,(s_0 - f)} = \\frac{500^2}{8 \\times (20000 - 500)} = \\frac{250000}{156000} = 1.6\\ \\mathrm{mm}' },
        'The central mirror blocks the middle of the aperture, so the disc is an annulus: a bright ring with a dark middle.'
      ],
      a: '1.6 mm across, drawn as a ring; for that reason mirror lenses are recognised by their doughnut highlights.'
    }
  ],
  quiz: [
    { q: 'You stop a portrait lens down from f/1.4 to f/2.8. The blur discs of a distant light…', choices: ['halve in diameter', 'double in diameter', 'stay the same', 'become polygons'], a: 0, why: 'For a given focus and background the disc diameter is proportional to $1/N$: f/2.8 is twice the f-number, so the disc is half the size. (Their shape may also change if the blades become visible.)' },
    { q: 'A lens has iris blades that form a regular heptagon when closed. The out-of-focus highlights will be…', choices: ['seven-sided polygons when stopped down', 'always perfect circles', 'rings', 'sharp points'], a: 0, why: 'The blur disc is a copy of the aperture, so a seven-bladed iris gives seven-sided highlights once it is closed enough to show its blades.' },
    { q: 'Mirror lenses show out-of-focus highlights as rings because their central mirror blocks the middle of the aperture.', a: true, why: 'The disc is the image of the aperture, and the aperture of a catadioptric lens is an annulus.' },
    { q: 'A 50 mm lens at f/1.8 is focused at 1.5 m; a lamp at infinity forms a blur disc of what diameter, in mm?', answer: 0.96, unit: 'mm', why: '$b = f^2/[N(s_0 - f)] = 2500/(1.8 \\times 1450) = 0.96$ mm.' },
    { q: 'Why do bokeh discs near the corner of a picture often look like lenses ("cat\'s eyes") rather than circles?', choices: ['The rims of the lens clip the oblique beams, cutting the aperture to a lens-shaped sliver', 'The sensor is rectangular', 'The corners are always out of focus', 'The iris moves'], a: 0, why: 'Optical vignetting: seen from an off-axis point, the front and rear openings of the lens do not overlap fully, and the transmitted beam has the shape of the overlap of two circles.' }
  ],
  applications: [
    'Portrait and cinema photography, where a soft background separates the subject and its quality is a deliberate choice of lens.',
    'Choosing a lens for night photography: round, soft discs for lights against shaped or ringed ones.',
    'Machine vision: out-of-focus structures above or below the part blur into the background; telecentric and small-aperture lenses keep them sharp.',
    'Lens design: apodization, the choice of aspheres and the number of blades are tuned to the look of the blur.',
    'Phone cameras: portrait modes synthesise bokeh digitally from a depth map, sometimes with chosen aperture shapes.'
  ],
  history: 'Photographers have always known that lenses blur differently; the Japanese word boke, "blur" or "haze", entered English-language photography in the late 1990s through magazine articles that gave a name to the quality of out-of-focus rendering. Lens designers have long studied how the aberrations shape the blur discs; apodization elements for smooth blur appeared in lenses at the end of the 1990s.',
  sources: [
    'R. Kingslake, *Lens Design Fundamentals* — the circle of confusion and the effect of spherical aberration on the defocused image.',
    'E. Hecht, *Optics*, ch. 5 — stops, pupils and the blur of out-of-focus points.',
    'H. H. Nasse, "Depth of Field and Bokeh" (Carl Zeiss, Camera Lens News) — a lens maker\'s own account of the subject.',
    'G. D. Boreman, *Modulation Transfer Function in Optical and Electro-Optical Systems* (SPIE Press, 2001) — the MTF of a defocus disc.'
  ],
  sim: 'iq-bokeh'
}

);
