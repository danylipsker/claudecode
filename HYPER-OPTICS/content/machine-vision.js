/* HYPER-OPTICS · content/machine-vision.js — the topic "Machine vision" (simulations: sims/machine-vision.js, ids mv-…)
 * Choosing and combining camera, lens and light to inspect or measure: the system, area-scan and line-scan cameras,
 * the lens, telecentric imaging, lighting, interfaces, triggering, pixels per feature, AOI, colour, 3-D.
 */

/* ================================================================ the system, the cameras, the lens */
Hyper.add(
{
  id: 'the-machine-vision-system', parent: 'machine-vision', title: 'The machine-vision system', level: 1,
  short: 'A machine-vision system is a light, a lens and a camera wired to a processor that decides, many times a second, whether a part is good, and tells something else to act on the answer. Trigger, lighting, lens, camera, processing and output are six stages in a chain, and the result is only as good as the weakest of them.',
  keywords: ['machine vision', 'vision system', 'industrial vision', 'inspection', 'smart camera', 'vision sensor', 'frame grabber', 'reject', 'cycle time', 'gauging', 'guidance', 'identification', 'OCR', 'automated inspection', 'latency'],
  prereq: ['how-a-camera-works', 'how-a-pixel-detects-light'],
  related: ['machine-vision-lighting', 'choosing-a-machine-vision-lens', 'area-scan-and-line-scan-cameras', 'camera-interfaces', 'triggering-and-strobing', 'pixels-per-feature', 'automated-optical-inspection', 'the-vision-inspection-cell', 'camera-families'],
  body: `
A filling line delivers ten bottles a second. For each one, within a tenth of a second, something must decide whether the cap is straight, the label is on and the fill level is right, and push the bottle off the belt if not. A person cannot do that for a shift; a **machine-vision system** can.

### Six stages in a chain
Light travels through the system from left to right, and the decision travels back to the line:

| Stage | Its job | What you specify | Typical values |
|---|---|---|---|
| Trigger | says that a part is in position | photoelectric sensor or encoder; latency and jitter | microseconds to 1 ms |
| Lighting | makes the feature stand out | geometry, colour, steady or strobed | LED, 0.1–10 ms steady, or a 20–200 µs strobe |
| Lens | forms the image of the field of view | focal length, f-number, format, mount | 6–100 mm, C-mount |
| Camera | turns the image into numbers | resolution, pixel size, shutter, interface | 0.3–25 MP, pixels of 3–10 µm |
| Processing | finds the feature and measures it | PC, smart camera, FPGA | 1–100 ms per image |
| Output | acts on the verdict | reject gate, robot, PLC signal, database | 1–20 ms |

The other pages of this topic follow the chain: [[machine-vision-lighting|lighting]], [[choosing-a-machine-vision-lens|lens]], [[area-scan-and-line-scan-cameras|camera]], [[camera-interfaces|interface]] and [[triggering-and-strobing|trigger]].

### Four jobs
- **Presence and defects:** is the part there, is the cap on, is there a scratch, a crack, a stain?
- **Measurement** (**gauging**): a diameter, a gap, an angle, to a few micrometres or a fraction of a millimetre. See [[pixels-per-feature]].
- **Identification:** reading a 1-D or 2-D code or printed text (OCR), or sorting by colour.
- **Guidance:** telling a robot where a part lies and how it is turned, so that it can pick it up.

### Light first
Beginners look at the camera and the software; experienced engineers start with the light. A feature that does not show in the image cannot be recovered by processing, while one that stands out sharply can be found with a simple threshold. Software that makes up for poor lighting fails when the lamp ages or the finish of the part changes. So the order of design is: decide *what must be seen*, then *which lighting makes it contrast*, then the lens and camera that resolve it.

### Not the same as computer vision
Computer vision interprets images of scenes nobody controls. Machine vision controls the scene: the part arrives in a known place, under chosen light, at a known distance, and the question is narrow, with a yes-or-no answer.

### The time budget
The interval between parts, $1/r$ for $r$ parts per second, must hold exposure, image transfer, processing and output: 100 ms at 10 parts per second. Because the camera can expose the next image while the last is processed, throughput is set by the slowest stage. The **latency**, from trigger to verdict, must still be known, so that the reject gate fires when the bad part reaches it.

### Where the processor lives
A **PC-based system** brings the images into a computer; a **smart camera** has the processor inside; a **vision sensor** is a smart camera configured rather than programmed.

> [!key] A vision system is a chain: trigger, light, lens, camera, processing, output. Decide what must be visible, make it show with the light, then budget the time per part. Software cannot recover what the optics never recorded.
`,
  ideas: [
    'A vision system is a chain of six stages: trigger, lighting, lens, camera, processing, output.',
    'Decide first what must be seen, then the lighting that makes it contrast, then the lens and camera that resolve it.',
    'Machine vision controls the scene (position, light, distance), so the question can be narrow and the answer dependable.',
    'The cycle time 1/r must hold exposure, transfer, processing and output; the latency fixes when the reject fires.',
    'The four jobs are presence and defects, measurement, identification and guidance.'
  ],
  pitfalls: [
    'More megapixels will fix a poor image — A feature with no contrast is not helped by more pixels. Lighting that makes the feature stand out comes first; resolution only has to be enough for the smallest feature.',
    'Machine vision is computer vision on a factory floor — The factory version controls light, distance and position so that the question is simple. That is what makes it fast and repeatable.',
    'The software will compensate for the lighting — Software can only use what the image contains. Lighting that is marginal on the day of commissioning fails when the lamp dims or the finish of the part varies.',
    'A reject can fire as soon as the verdict is ready — The part has moved on since the exposure. The gate must wait the transit time to the gate minus the latency of the system.'
  ],
  terms: [
    { term: 'Machine vision', also: ['industrial vision', 'automated optical inspection (general sense)'], def: 'The use of cameras, lenses, lighting and processing to inspect, measure, identify or guide parts automatically, usually in production and under controlled conditions.' },
    { term: 'Smart camera', also: ['vision sensor', 'embedded vision system'], def: 'A camera with a processor inside that runs the inspection itself and outputs a verdict. A vision sensor is a smart camera configured for a fixed task rather than programmed.' },
    { term: 'Frame grabber', def: 'A plug-in computer card that receives the image data from a camera over a dedicated interface (Camera Link, CoaXPress) and places it in memory with little delay. Network and USB cameras need none.' },
    { term: 'Cycle time', also: ['takt time', 'inspection time'], def: 'The interval between one part and the next, the reciprocal of the part rate. Everything the system does for one part must fit in it, or run in parallel with the next one.' },
    { term: 'Latency', also: ['trigger-to-result delay'], def: 'The time from the trigger (or the exposure) to the verdict at the output. It fixes when a reject device must act so that it hits the right part.' },
    { term: 'Gauging', also: ['dimensional measurement', 'vision metrology'], def: 'Measuring dimensions (diameters, gaps, angles, positions) from an image. Its accuracy depends on the pixels across the feature, calibration, lens distortion and lighting.' }
  ],
  formulas: [
    {
      name: 'Time left for processing',
      expr: 'tp = 1/r - te - tt', tex: 't_{\\mathrm{p}} = \\frac{1}{r} - t_{\\mathrm{e}} - t_{\\mathrm{t}}',
      vars: {
        tp: { name: 'time left for processing and output', q: 'time', unit: 'ms', tex: 't_{\\mathrm{p}}' },
        r: { name: 'parts per second', q: 'frequency', unit: 'Hz', value: 8, min: 0.01, max: 1000, tex: 'r' },
        te: { name: 'exposure time', q: 'time', unit: 'ms', value: 0.2, tex: 't_{\\mathrm{e}}' },
        tt: { name: 'readout and transfer time', q: 'time', unit: 'ms', value: 15, tex: 't_{\\mathrm{t}}' }
      },
      solveFor: 'tp',
      note: 'The strictest case, in which exposure, transfer and processing follow one another. Overlapping them in a pipeline gives more room, but the latency is still their sum.',
      stories: { tp: 'A line delivers {r}. A camera exposes for {te} and needs {tt} to read out and transfer the image. How long is left for processing and output?', r: 'A system needs {te} to expose, {tt} to transfer and {tp} to process and act. How many parts a second can it handle one after another?' }
    },
    {
      name: 'Parts per second on a belt',
      expr: 'r = v/p', tex: 'r = \\frac{v}{p}',
      vars: {
        r: { name: 'parts per second', q: 'frequency', unit: 'Hz', tex: 'r' },
        v: { name: 'belt speed', q: 'speed', unit: 'm/s', value: 0.5, tex: 'v' },
        p: { name: 'pitch between parts', q: 'length', unit: 'mm', value: 100, tex: 'p' }
      },
      stories: { r: 'A belt runs at {v} with parts every {p}. How many parts a second pass the camera?' }
    },
    {
      name: 'Delay before the reject gate fires',
      expr: 'td = d/v - tl', tex: 't_{\\mathrm{d}} = \\frac{d}{v} - t_{\\mathrm{l}}',
      vars: {
        td: { name: 'wait after the verdict', q: 'time', unit: 's', tex: 't_{\\mathrm{d}}' },
        d: { name: 'distance from the camera to the gate', q: 'length', unit: 'mm', value: 800, tex: 'd' },
        v: { name: 'belt speed', q: 'speed', unit: 'm/s', value: 0.5, tex: 'v' },
        tl: { name: 'latency from exposure to verdict', q: 'time', unit: 'ms', value: 120, tex: 't_{\\mathrm{l}}' }
      },
      note: 'Counted in encoder pulses rather than seconds, the same delay stays right when the belt speeds up or slows down.',
      stories: { td: 'A reject gate is {d} downstream of the camera on a belt moving at {v}. The verdict arrives {tl} after the exposure. How long after the verdict must the gate fire?' }
    }
  ],
  examples: [
    {
      title: 'How much time is there?',
      q: 'A line fills 600 bottles a minute. The camera exposes for 0.1 ms and needs 8 ms to read out and transfer each image. How long is left for processing and for the reject output, if the stages run one after the other?',
      steps: [
        { text: 'The part rate is 600 / 60 = 10 per second, so the cycle time is', tex: '\\frac{1}{r} = \\frac{1}{10\\ \\mathrm{s^{-1}}} = 100\\ \\mathrm{ms}' },
        { text: 'Subtract exposure and transfer:', tex: 't_{\\mathrm{p}} = 100 - 0.1 - 8 = 91.9\\ \\mathrm{ms}' },
        'If the transfer overlaps the processing of the previous image (as it does in any pipelined system), the processor can use almost the whole 100 ms.'
      ],
      a: '91.9 ms in the strictest case, close to 100 ms with overlap.'
    },
    {
      title: 'Where the reject gate waits',
      q: 'Parts move at 0.5 m/s. The gate is 800 mm downstream of the camera and the verdict arrives 120 ms after the exposure. How long after the verdict must the gate fire?',
      steps: [
        { text: 'A part needs this long to travel from the camera to the gate:', tex: '\\frac{d}{v} = \\frac{800\\ \\mathrm{mm}}{500\\ \\mathrm{mm/s}} = 1.60\\ \\mathrm{s}' },
        'The verdict has already used 0.12 s of that, so the gate waits 1.60 − 0.12 = 1.48 s after the verdict.'
      ],
      a: '1.48 s after the verdict (or, equivalently, 1.60 s after the exposure).'
    }
  ],
  quiz: [
    { q: 'A feature is barely visible in the image. What should you change first?', choices: ['The lighting geometry or wavelength', 'The camera, for one with more pixels', 'The camera interface, for a faster one', 'The lens, for a more expensive one'], a: 0, why: 'Contrast comes from the light. More pixels, a faster interface or a dearer lens cannot create contrast that the lighting did not produce.' },
    { q: 'Machine vision and computer vision are two names for the same thing.', a: false, why: 'Machine vision controls the scene (position, light, distance) to answer a narrow question quickly and reliably. Computer vision interprets images of scenes that nobody controls.' },
    { q: 'Parts travel at 0.6 m/s. A reject gate is 900 mm downstream of the camera, and the verdict arrives 100 ms after the exposure. How long after the verdict, in seconds, should the gate fire?', answer: 1.4, unit: 's', why: 'The part needs 0.9 m ÷ 0.6 m/s = 1.5 s to reach the gate; 0.1 s of that has gone by when the verdict is ready, leaving 1.4 s.' },
    { q: 'What distinguishes a smart camera from a PC-based vision system?', choices: ['The processor that runs the inspection is inside the camera', 'It can only read bar codes', 'It has no lens', 'It must be triggered by software'], a: 0, why: 'A smart camera outputs a verdict (a signal, a message) rather than images; a PC-based system brings the images into a computer.' },
    { q: 'A production line makes 10 parts per second. How many milliseconds does one part have for exposure, transfer, processing and output together?', answer: 100, unit: 'ms', why: 'The cycle time is 1/r = 1/10 s = 100 ms. Overlapping the stages can stretch the processing across parts, but not the throughput.' }
  ],
  applications: [
    'Packaging and food lines: cap, label and fill-level checks, and reading date and lot codes at 600 or more items a minute.',
    'Electronics: placement and solder inspection of circuit boards (see [[automated-optical-inspection]]).',
    'Automotive: gap and flush gauging of body panels, weld-seam inspection and guiding robots that pick parts from bins.',
    'Pharmaceuticals: inspecting tablets, blisters, vials and syringes, and checking printed serial codes.',
    'Logistics: reading labels and bar codes on parcels as they pass a tunnel of cameras at belt speed.'
  ],
  history: 'The first commercial machine-vision systems appeared on assembly lines in the late 1970s and early 1980s, when solid-state image sensors and cheap microprocessors made it practical to put a camera and a decision on a production line. The field grew with each advance in sensors, lighting (above all the LED) and computing.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — the chain from illumination to measurement.',
    'A. Hornberg (ed.), *Handbook of Machine and Computer Vision* (Wiley-VCH, 2nd ed. 2017) — components and systems.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — lighting and system design.'
  ],
  sim: 'mv-system'
},

{
  id: 'area-scan-and-line-scan-cameras', parent: 'machine-vision', title: 'Area-scan and line-scan cameras', level: 2,
  short: 'An area-scan camera captures a whole two-dimensional frame at once; a line-scan camera has a single row of pixels and builds its picture one line at a time as the object moves past. Area-scan suits separate parts, line-scan suits webs, long and fast objects and surfaces that roll by, because one row of pixels can be as wide as the product and the picture never has to end.',
  keywords: ['area-scan', 'area scan', 'matrix camera', 'line-scan', 'line scan', 'linescan', 'line rate', 'TDI', 'time delay integration', 'encoder', 'web inspection', 'pixel footprint', 'square pixels', 'frame rate', 'lines per second'],
  prereq: ['the-machine-vision-system', 'sensor-formats-and-pixel-size'],
  related: ['line-scan-inspection', 'camera-interfaces', 'triggering-and-strobing', 'ccd-architectures', 'rolling-and-global-shutter', 'pixels-per-feature', 'magnification-and-working-distance'],
  body: `
Two cameras can watch the same conveyor belt and record different things. An **area-scan camera** exposes a whole rectangle of pixels at once and delivers a frame, like any photograph. A **line-scan camera** has a sensor one pixel tall and thousands of pixels long, and delivers one line per exposure. The picture is assembled from hundreds or thousands of lines while the object moves, so it can be as long as the material is.

### Area-scan
- One frame per trigger: a separate part is stopped, or frozen by a strobe, and the whole field of view is recorded at once.
- Common resolutions are 0.3 to 25 megapixels, and frame rates from a few to several hundred a second.
- It gives two-dimensional information directly, so pattern matching, position and rotation follow; it is easy to set up and works with a part that stands still.

### Line-scan
- Sensors are 1 024 to 16 384 pixels long (some longer), with pixels of 3.5 to 14 µm and line rates from a few kilohertz to over 100 kHz.
- **The motion supplies the second dimension.** A web of paper, film, steel or textile, a stream of parts on a belt, a bottle rolled past the camera: each moves at a known speed and is scanned.
- One sensor makes very large pictures: 16 384 pixels across and 100 000 lines is 1.6 gigapixels.
- The light must be bright, because each line is exposed for less than the line period: 70 µs at 14 kHz.

### Square pixels need the right line rate
The sensor's pixel pitch $p$ and the magnification $m$ give the **pixel footprint** on the object, $p/m$. The object must move exactly one footprint between lines, so
$$f_{\\mathrm{L}} = \\frac{v\\,|m|}{p}$$
A web at 1 m/s, a 7 µm pixel and $m = 0.1$ give a footprint of 70 µm and a line rate of 14.3 kHz. If the line rate is too low for the speed, the image is squashed along the direction of travel (a round coin turns into an ellipse); if too high, stretched.

| | Area-scan | Line-scan |
|---|---|---|
| Sensor | 2-D array, e.g. 2448 × 2048 | one row, e.g. 4096 × 1 (or a few rows) |
| Picture | one frame per exposure | built line by line during motion |
| Object | still, or frozen by a strobe | must move at a steady, known speed |
| Length of object | one field of view | unlimited |
| Light | flash or steady | a bright line of light |
| Encoder | seldom needed | usually fitted |
| Set-up | easy | the line must be square to the motion |

### Encoders and alignment
An **encoder** on the belt or roller triggers each line, so the footprint stays square even when the speed varies. The pixel row must be perpendicular to the motion and the line light must fall exactly on the viewed line; a skew shows as shear in the picture.

### TDI
A **time-delay-integration** sensor has many rows (64 or 128, say) that add up the light of the same object line as it passes. Signal grows with the number of rows and noise only as its square root, so TDI copes with dim light at high speed. See [[ccd-architectures]].

### Data
A line camera of 8192 pixels at 50 kHz and 8 bits delivers 3.3 gigabits a second, about 410 MB/s: see [[camera-interfaces]].

> [!key] Area-scan takes a frame; line-scan takes a line and lets the motion supply the rest. The line rate must equal the speed divided by the pixel footprint, $f_{\\mathrm{L}} = v\\,m/p$, or the picture is stretched or squashed.
`,
  ideas: [
    'Area-scan records a frame at once; line-scan records one line per exposure and needs the object to move.',
    'The footprint p/m is the object distance covered by one pixel; the line rate must make the object advance exactly one footprint per line.',
    'A line rate that does not match the speed stretches or squashes the picture along the direction of motion.',
    'Line-scan wins for webs, long objects and rolling surfaces, and for very wide fields at high resolution; area-scan wins for separate parts and flexible set-ups.',
    'Line-scan needs far more light per pixel, because each line is exposed for less than the line period.'
  ],
  pitfalls: [
    'A line-scan camera is just an area-scan camera with fewer pixels — It records nothing useful without relative motion, and the speed must be matched to the line rate. The picture is a record of the motion as well as the scene.',
    'The line rate is set by how fast the camera can read — That is only the upper limit. The line rate that gives square pixels is the speed divided by the footprint; reading faster than that just oversamples.',
    'A faster belt only needs a shorter exposure — A faster belt needs a proportionally higher line rate, which shortens the exposure of every line and calls for proportionally more light.',
    'Line-scan has no motion blur — Each line is exposed for a time, and the object moves during it. Blur along the motion is the footprint times the exposure divided by the line period.'
  ],
  terms: [
    { term: 'Area-scan camera', also: ['matrix camera', 'frame camera'], def: 'A camera whose sensor is a two-dimensional array of pixels, giving a complete frame in one exposure.' },
    { term: 'Line-scan camera', also: ['linescan camera', 'line camera'], def: 'A camera whose sensor is a single row (or a few rows) of pixels. The image is built up line by line as the object moves past.' },
    { term: 'Line rate', also: ['line frequency', 'scan rate'], def: 'The number of lines a line-scan camera records per second (kHz). It must equal the object speed divided by the pixel footprint for square pixels.' },
    { term: 'Pixel footprint', also: ['pixel size on the object', 'object-space pixel size'], def: 'The size of the object region imaged onto one pixel: the pixel pitch divided by the magnification.' },
    { term: 'Encoder', also: ['rotary encoder', 'incremental encoder'], def: 'A sensor on a belt or roller that outputs a pulse for each small step of travel. It triggers the camera line by line so that the image is independent of speed.' },
    { term: 'Time delay integration', also: ['TDI'], def: 'A line-scan sensor with many rows that sum the charge of the same object line as it moves across them, giving higher sensitivity at high speed.' }
  ],
  formulas: [
    {
      name: 'Line rate for square pixels',
      expr: 'fl = v*m/p', tex: 'f_{\\mathrm{L}} = \\frac{v\\,m}{p}',
      vars: {
        fl: { name: 'line rate', q: 'frequency', unit: 'kHz', tex: 'f_{\\mathrm{L}}' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1, tex: 'v' },
        m: { name: 'magnification (image ÷ object)', value: 0.1, min: 0.001, max: 10, tex: 'm' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 7, tex: 'p' }
      },
      solveFor: 'fl',
      note: 'The object advances one pixel footprint, p/m, between lines.',
      stories: { fl: 'A web runs at {v}. A line camera with {p} pixels images it at a magnification of {m}. What line rate gives square pixels?', v: 'A line-scan camera with {p} pixels and magnification {m} runs at {fl}. How fast may the object move for square pixels?' }
    },
    {
      name: 'Width scanned by a line sensor',
      expr: 'W = n*p/m', tex: 'W = \\frac{n\\,p}{m}',
      vars: {
        W: { name: 'width of the scanned strip', q: 'length', unit: 'mm', tex: 'W' },
        n: { name: 'pixels in the line', value: 4096, min: 1, max: 100000, tex: 'n' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 7, tex: 'p' },
        m: { name: 'magnification', value: 0.1, min: 0.001, max: 10, tex: 'm' }
      },
      solveFor: 'W',
      stories: { W: 'A sensor of {n} pixels of {p} looks at the object at a magnification of {m}. How wide is the strip it scans?' }
    },
    {
      name: 'Data rate of a line-scan camera',
      expr: 'R = n*b*fl', tex: 'R = n\\,b\\,f_{\\mathrm{L}}',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'MB/s', tex: 'R' },
        n: { name: 'pixels in the line', value: 8192, min: 1, max: 100000, tex: 'n' },
        b: { name: 'bits per pixel', value: 8, min: 1, max: 48, tex: 'b' },
        fl: { name: 'line rate', q: 'frequency', unit: 'kHz', value: 50, tex: 'f_{\\mathrm{L}}' }
      },
      solveFor: 'R',
      note: 'Uncompressed, before any protocol overhead.'
    }
  ],
  examples: [
    {
      title: 'Line rate for a steel strip',
      q: 'A 4096-pixel line camera with 7 µm pixels looks at a strip of steel moving at 2 m/s. The field is 287 mm wide. What line rate keeps the pixels square, and how long may each line be exposed?',
      steps: [
        { text: 'The magnification is sensor width over field width: 4096 × 7 µm = 28.67 mm, so', tex: 'm = \\frac{28.67}{287} = 0.100' },
        { text: 'The footprint is p/m = 70 µm, so the line rate is', tex: 'f_{\\mathrm{L}} = \\frac{v\\,m}{p} = \\frac{2000\\ \\mathrm{mm/s} \\times 0.100}{0.007\\ \\mathrm{mm}} = 28.6\\ \\mathrm{kHz}' },
        'The line period is 1 / 28.6 kHz = 35 µs, so no line can be exposed for longer than 35 µs.'
      ],
      a: '28.6 kHz, with exposures of 35 µs or less: the light must be strong.'
    },
    {
      title: 'A coin that turned into an egg',
      q: 'A scan of a round coin on a belt shows it 20 % shorter along the belt than across. Was the line rate too high or too low?',
      steps: [
        'The coin looks short along the travel direction, so there are too few lines per millimetre of belt: the object moved more than one footprint between lines.',
        'Fewer lines per millimetre means the line rate was too low (or the belt too fast): by 20 % it should be raised by 25 %.'
      ],
      a: 'Too low. Raise the line rate by about 25 %, or lock it to an encoder.'
    }
  ],
  quiz: [
    { q: 'A line-scan camera images a web at 2 m/s with a pixel footprint of 0.1 mm on the object. What line rate in hertz gives square pixels?', answer: 20000, unit: 'Hz', why: 'The web advances 2000 mm/s ÷ 0.1 mm = 20 000 footprints per second, so 20 kHz.' },
    { q: 'The line rate is too low for the belt speed. What does the picture show?', choices: ['Objects squashed along the direction of travel', 'Objects stretched along the direction of travel', 'Objects sheared sideways', 'Nothing unusual: only the brightness changes'], a: 0, why: 'Too few lines per millimetre of travel make the picture shorter along the motion. Shear comes from a sensor that is not square to the motion, and brightness from the exposure.' },
    { q: 'A line-scan camera can give an image of an object that is stationary in front of it.', a: false, why: 'The second dimension of the picture comes from relative motion. For a stationary object the camera (or a mirror) has to be moved.' },
    { q: 'Which job is best given to a line-scan camera?', choices: ['A 1.5 m wide steel strip leaving a mill at 3 m/s', 'Reading one bar code on a box stopped under the camera', 'Checking a moulded part held by a robot', 'Finding a screw in a bin'], a: 0, why: 'A wide product moving at a steady speed is the line-scan case: one 8k or 16k sensor covers the width, and the length is unlimited. The others are single-frame jobs.' },
    { q: 'A line camera has 8192 pixels, 8 bits, and runs at 50 kHz. What data rate does it deliver, in MB/s?', answer: 410, unit: 'MB/s', why: '8192 × 8 bit × 50 000 s⁻¹ = 3.28 × 10⁹ bit/s, which is 410 MB/s: more than a Gigabit Ethernet link can carry.' }
  ],
  applications: [
    'Web inspection of paper, film, foil and non-woven fabric at speeds of several metres per second.',
    'Steel strip, glass sheets and panels: surface defects across widths of one to two metres.',
    'Printed matter, banknotes and labels, scanned as they pass at press speed.',
    'Round objects rolled or spun in front of the camera, such as fruit, bottles and cylinders, to read the whole surface.',
    'Railway wheels and track, and satellite pushbroom cameras, where the vehicle itself provides the motion (see [[line-scan-inspection]]).'
  ],
  history: 'Line sensors were among the first charge-coupled devices to be sold, in the early 1970s, and the fax machine and the flatbed scanner are their domestic descendants. Industrial line-scan cameras followed for web inspection, where nothing else could cover a metre of width at the resolution wanted.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — image acquisition with line-scan cameras.',
    'G. C. Holst and T. S. Lomheim, *CMOS/CCD Sensors and Camera Systems* (SPIE Press, 2nd ed. 2011) — line and TDI sensors.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — web inspection.'
  ],
  sim: 'mv-scan'
},

{
  id: 'choosing-a-machine-vision-lens', parent: 'machine-vision', title: 'Choosing a lens for a vision system', level: 2,
  short: 'Choosing the lens is a short calculation that starts from the job, not from the catalogue: the field of view and the working distance give the focal length, the smallest feature gives the pixels needed, and the f-number is a compromise between depth of field, light and diffraction. Format, mount and resolution are then checked against the camera.',
  keywords: ['lens selection', 'machine vision lens', 'focal length', 'field of view', 'working distance', 'magnification', 'depth of field', 'f-number', 'diffraction', 'sensor format', 'C-mount', 'image circle', 'resolution', 'pixels needed', 'lens calculator'],
  prereq: ['field-of-view-and-focal-length', 'magnification-and-working-distance', 'the-f-number'],
  related: ['pixels-per-feature', 'telecentric-imaging', 'c-mount', 'image-circle-and-sensor-coverage', 'depth-of-field', 'reading-a-lens-datasheet', 'sensor-formats-and-pixel-size', 'the-airy-disk'],
  body: `
A machine-vision lens is chosen backwards: you do not browse a catalogue and see what happens, you work out what the lens must do and then look for it. The calculation takes a few minutes and is the same every time.

### The workflow
1. **Field of view (FOV).** The part, plus the amount it may wander on the belt, plus a margin of about 10 %. Call its width $W$.
2. **Smallest feature, pixels needed.** A feature of size $d$ needs about 3 pixels across it ([[pixels-per-feature]]), so the pixel footprint on the object must be $d/3$ and the sensor needs $n = 3W/d$ pixels across.
3. **Sensor.** Pick a camera with at least that many pixels. Its width $w_s$ (and pixel pitch $p$) fix the **magnification** $m = w_s/W$.
4. **Focal length.** For an object at distance $d_o$ from the lens (thin-lens approximation),
$$f = \\frac{d_o}{1 + W/w_s} = \\frac{d_o\\,m}{1+m}$$
5. **Nearest real lens.** Fixed-focal-length lenses come in a standard series, 6, 8, 12, 16, 25, 35, 50 and 75 mm. With the lens chosen, adjust the distance, $d_o = f\\,(1+W/w_s)$, or accept the slightly different field.
6. **f-number.** See below.
7. **Check.** The lens's image circle must cover the sensor diagonal ([[image-circle-and-sensor-coverage]]); the mount must fit the camera ([[c-mount]]); the lens must be rated for pixels as small as the sensor's; distortion in per cent and the mechanical clearance at the working distance must be acceptable.

The **working distance** on a datasheet is measured from the front of the lens housing to the object, not from the principal plane, and a short extension tube moves it.

### The f-number: three pulls
- **Depth of field.** Close up, the zone of acceptable sharpness is $2Nc\\,(1+m)/m^2$ for a blur criterion $c$, so a part of varying height needs a larger $N$.
- **Diffraction.** The Airy disc of the working aperture, $2.44\\,\\lambda N(1+m)$, should not exceed about two pixels. For 3.45 µm pixels, green light and $m = 0.1$ that is $N \\approx 4.7$: stop down beyond f/5.6 and the lens blurs more than the sensor can resolve. See [[the-f-number]].
- **Light.** Each stop closed halves the light, and the exposure or the lamp must make up for it.

So the rule is: the largest f-number that diffraction allows is the one that gives the most depth, and if it is too dark, brighten the lighting rather than open the lens.

### A worked case
A part 60 mm wide, a 2/3" camera (sensor 8.8 mm wide), a working distance of about 300 mm: $f = 300/(1 + 60/8.8) = 38.4$ mm. The 35 mm lens is nearest: at 274 mm the field is exactly 60 mm, and at 300 mm it is 66.6 mm.

> [!key] Work backwards: field of view and distance give the focal length, the smallest feature gives the pixels, and the f-number balances depth against diffraction and light. Then check image circle, mount and resolution.
`,
  ideas: [
    'Start from the field of view, the working distance and the smallest feature, not from the catalogue.',
    'The magnification is sensor width over field width, and the focal length follows from it and the object distance.',
    'The pixels needed across the field are about three per smallest feature times the field over the feature.',
    'The f-number is set by depth of field and diffraction against light; the largest f-number diffraction allows gives the most depth.',
    'Check the image circle, the mount, the resolution rating and the distortion before ordering.'
  ],
  pitfalls: [
    'A longer focal length always gives a closer view — At a fixed working distance it does, but for a fixed field of view a longer lens simply sits farther back. The field of view is set by the sensor width, the focal length and the distance together.',
    'The working distance is measured from the sensor — Datasheets measure it from the front of the lens housing to the object, which is not the same as the distance from the optical centre of the lens that the lens equation uses.',
    'Stopping down always improves depth and sharpness — It improves depth, but past the diffraction limit the Airy disc grows larger than the pixels and the image softens. Close-up work uses the working f-number N(1 + m).',
    'Any lens that screws on will do — The thread only holds the lens. The image circle must cover the sensor diagonal and the lens must resolve the pixel size, or the corners go dark and the image is soft.'
  ],
  terms: [
    { term: 'Working distance', also: ['WD'], def: 'The distance from the front of the lens to the object when the image is in focus. It is not the same as the object distance in the lens equation, which is measured from the lens\'s principal plane.' },
    { term: 'Field of view', also: ['FOV'], def: 'The width and height of the region of the object imaged onto the sensor. For a given lens it grows in proportion to the working distance.' },
    { term: 'Magnification', also: ['m', 'image-to-object ratio'], def: 'The size of the image divided by the size of the object. For a sensor of width w imaging a field of width W, m = w/W.' },
    { term: 'Pixel footprint', also: ['pixel size on the object'], def: 'The size of the object region covered by one pixel: pixel pitch divided by magnification, or field of view divided by the pixels across it.' },
    { term: 'Image circle', also: ['coverage'], def: 'The circle on the image plane within which the lens forms an acceptable image. It must be at least as large as the sensor diagonal.' },
    { term: 'Working f-number', also: ['effective f-number'], def: 'The f-number that applies close up, N(1 + m). It governs the exposure and the diffraction blur at magnification m.' }
  ],
  formulas: [
    {
      name: 'Focal length from field of view and distance',
      expr: 'f = d/(1 + W/ws)', tex: 'f = \\frac{d}{1 + W/w_{\\mathrm{s}}}',
      vars: {
        f: { name: 'focal length', q: 'length', unit: 'mm', tex: 'f' },
        d: { name: 'distance from the lens to the object', q: 'length', unit: 'mm', value: 300, tex: 'd' },
        W: { name: 'width of the field of view', q: 'length', unit: 'mm', value: 60, tex: 'W' },
        ws: { name: 'width of the sensor', q: 'length', unit: 'mm', value: 8.8, tex: 'w_{\\mathrm{s}}' }
      },
      solveFor: 'f',
      note: 'Thin-lens approximation; measure d from the lens, not from the sensor.',
      stories: { f: 'A camera with a sensor {ws} wide must see a field {W} wide from {d}. What focal length is needed?', W: 'A {f} lens on a sensor {ws} wide is {d} from the object. How wide is the field of view?' }
    },
    {
      name: 'Pixels needed across the field',
      expr: 'n = k*W/dm', tex: 'n = \\frac{k\\,W}{d_{\\mathrm{m}}}',
      vars: {
        n: { name: 'pixels across the field of view', tex: 'n' },
        k: { name: 'pixels wanted across the smallest feature', value: 3, min: 1, max: 20, tex: 'k' },
        W: { name: 'width of the field of view', q: 'length', unit: 'mm', value: 60, tex: 'W' },
        dm: { name: 'smallest feature', q: 'length', unit: 'mm', value: 0.2, tex: 'd_{\\mathrm{m}}' }
      },
      solveFor: 'n',
      stories: { n: 'A defect {dm} wide must cover {k} pixels in a field {W} wide. How many pixels must the sensor have across?', dm: 'A sensor has {n} pixels across a field {W} wide. What is the smallest feature that covers {k} pixels?' }
    },
    {
      name: 'Largest f-number before diffraction blurs',
      expr: 'N = p/(1.22*lambda*(1 + m))', tex: 'N = \\frac{p}{1.22\\,\\lambda\\,(1+m)}',
      vars: {
        N: { name: 'f-number', tex: 'N' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 3.45, tex: 'p' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        m: { name: 'magnification', value: 0.1, min: 0, max: 20, tex: 'm' }
      },
      solveFor: 'N',
      note: 'The Airy disc 2.44 λ N(1 + m) is held to two pixels. A stricter limit (one pixel) halves N.',
      stories: { N: 'A camera with {p} pixels images at magnification {m} in {lambda} light. At what f-number does the Airy disc reach two pixels?' }
    },
    {
      name: 'Depth of field at close range',
      expr: 'T = 2*N*c*(1 + m)/m^2', tex: 'T = \\frac{2\\,N\\,c\\,(1+m)}{m^2}',
      vars: {
        T: { name: 'total depth of field', q: 'length', unit: 'mm', tex: 'T' },
        N: { name: 'f-number', value: 4, min: 0.5, max: 64, tex: 'N' },
        c: { name: 'blur circle accepted', q: 'length', unit: 'µm', value: 6.9, tex: 'c' },
        m: { name: 'magnification', value: 0.1, min: 0.001, max: 20, tex: 'm' }
      },
      solveFor: 'T',
      note: 'Valid for a lens with equal pupils; c is often taken as two pixels.',
      stories: { T: 'A lens at f/{N} images at magnification {m}, and a blur of {c} is acceptable. How much depth is in focus?' }
    }
  ],
  examples: [
    {
      title: 'A lens for a 60 mm part',
      q: 'A part 60 mm across must be inspected for 0.2 mm scratches. The camera is a 2/3" type 2448 pixels wide (sensor width 8.8 mm). The camera can be about 300 mm from the part. Choose a lens and check the pixels.',
      steps: [
        { text: 'Focal length wanted:', tex: 'f = \\frac{300}{1 + 60/8.8} = \\frac{300}{7.82} = 38.4\\ \\mathrm{mm}' },
        'The nearest standard lens is 35 mm. At 300 mm it sees a field $W = w_s\\,(d - f)/f = 8.8 × 265/35 = 66.6$ mm, wide enough; at 273.6 mm it would see exactly 60 mm.',
        { text: 'The pixel footprint is 66.6 mm / 2448 = 27 µm, so a 0.2 mm scratch covers', tex: '\\frac{0.2}{0.027} = 7.4\\ \\text{pixels}' },
        'That is more than the 3 needed, so a smaller camera (1.3 MP, 1280 pixels, 52 µm footprint, 3.8 pixels per scratch) would also do and send less data.'
      ],
      a: 'A 35 mm lens at about 300 mm. The 2448-pixel camera puts 7 pixels across the scratch; the 1280-pixel one just enough.'
    },
    {
      title: 'Which f-number?',
      q: 'The camera has 3.45 µm pixels, the light is green (550 nm), and the magnification is 0.1. What is the largest f-number at which the Airy disc is no more than two pixels, and how deep is the zone of focus there if a blur of two pixels is accepted?',
      steps: [
        { text: 'The diffraction limit:', tex: 'N = \\frac{3.45}{1.22 \\times 0.55 \\times 1.1} = 4.7' },
        { text: 'The nearest stops are f/4 and f/5.6. At f/4 the depth is', tex: 'T = \\frac{2 \\times 4 \\times 0.0069\\ \\mathrm{mm} \\times 1.1}{0.01} = 6.1\\ \\mathrm{mm}' },
        'At f/5.6 it would be 8.5 mm but the Airy disc would be 2.4 pixels wide.'
      ],
      a: 'About f/4.7 (use f/4 or f/5.6); 6 mm of depth at f/4. More depth needs more light, not a smaller aperture.'
    }
  ],
  quiz: [
    { q: 'A camera with a 6.4 mm wide sensor (1/2") must see a field 100 mm wide from 500 mm. What focal length, in mm, is needed?', answer: 30.1, unit: 'mm', why: '$f = d/(1 + W/w_s) = 500/(1 + 100/6.4) = 500/16.6 = 30.1$ mm. In practice the 35 mm lens would be used at a slightly longer distance, or the 25 mm at a shorter.' },
    { q: 'A 0.1 mm defect must cover 3 pixels in a field 50 mm wide. How many pixels across must the sensor have?', answer: 1500, why: '$n = kW/d = 3 × 50/0.1 = 1500$. A sensor 1600 pixels wide just serves; one 2448 wide has room to spare.' },
    { q: 'A part has features at different heights, and the image must be sharp for all of them. What helps most?', choices: ['A larger f-number, with more light', 'A longer focal length at the same field', 'A larger sensor', 'A faster camera'], a: 0, why: 'Depth of field grows with f-number. Brighten the lighting to pay for the lost light, and stop short of the diffraction limit.' },
    { q: 'The working distance on a lens datasheet is measured from the sensor.', a: false, why: 'It is measured from the front of the lens housing to the object. The lens equation uses the distance from the principal plane, which lies inside the lens.' },
    { q: 'A camera is changed from 5 µm pixels to 2.5 µm pixels, with the same lens and the same magnification. The largest f-number before diffraction blurs the image…', choices: ['halves', 'doubles', 'is unchanged', 'quadruples'], a: 0, why: 'The limit is $N \\propto p$: the Airy disc must stay within two pixels, and the pixels have become half as large.' }
  ],
  applications: [
    'Choosing the lens for any camera on an inspection or gauging station: pick the focal length that gives the field wanted at the distance the machine allows.',
    'Retrofitting a camera to an existing machine, where the working distance is fixed and the field of view must fit.',
    'Replacing a discontinued camera with one of a different sensor size, and finding what lens it now needs.',
    'Estimating, before buying, whether a sensor and lens can resolve the smallest defect.'
  ],
  history: 'Machine-vision lenses took their standard forms from television and cine optics: the C-mount of 16 mm film cameras, the series of focal lengths (6, 8, 12, 16, 25, 35, 50 mm) of closed-circuit television lenses. The practice of calculating the lens from field and distance, rather than trying lenses until one fits, is as old as the first industrial camera on a conveyor.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 2 and 6 — paraxial imaging and the f-number in close-up work.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — lens selection for machine vision.',
    'EMVA Standard 1288, *Standard for characterization of image sensors and cameras* — the sensor data (pixel size, quantum efficiency) that the choice builds on.'
  ],
  sim: 'mv-lens'
}
);

/* ================================================================ telecentric imaging and lighting */
Hyper.add(
{
  id: 'telecentric-imaging', parent: 'machine-vision', title: 'Telecentric imaging for measurement', level: 2,
  short: 'A telecentric lens keeps its magnification the same whatever the distance of the object, because its chief rays run parallel to the axis: a part that sits a few millimetres nearer or farther keeps its size in the image. That is what gauging needs, since an ordinary lens makes the nearer edge of a part look larger than the farther one.',
  keywords: ['telecentric', 'telecentric lens', 'perspective error', 'gauging', 'bi-telecentric', 'entocentric', 'hypercentric', 'chief ray', 'parallax', 'telecentric illumination', 'collimated backlight', 'telecentricity error', 'object-side telecentric', 'measurement lens'],
  prereq: ['aperture-stop', 'magnification-and-working-distance', 'choosing-a-machine-vision-lens'],
  related: ['telecentricity', 'telecentric-lenses', 'machine-vision-lighting', 'entrance-and-exit-pupils', 'pixels-per-feature', 'depth-of-field', 'lens-distortion-and-calibration'],
  body: `
A ruler held at arm's length looks shorter than the same ruler held at your nose. Every ordinary lens does the same: the nearer something is, the larger it is imaged. That is **perspective**, fine for photographs and fatal for measurement, because a part that sits a millimetre higher on the belt measures bigger.

### Why an ordinary lens has perspective
The rays that fix the size of the image are the **chief rays**, the ones through the centre of the aperture stop. In an ordinary (**entocentric**) lens the stop is at the lens, so the chief rays from different points of the object all pass through one point, the entrance pupil, and fan out from it like the spokes of a wheel. The image height of a part is proportional to $h/s$, with $s$ the distance from the pupil; move the part closer by $\\Delta$ and the image grows by the factor $s/(s-\\Delta)$:
$$\\frac{\\Delta m}{m} = \\frac{\\Delta}{s - \\Delta}$$
With $s = 200$ mm and a part that rises 5 mm, a 50 mm shaft measures 51.3 mm.

### How a telecentric lens avoids it
Put the aperture stop at the rear focal plane of the front lens group. Now the chief ray from every object point leaves **parallel to the axis**: the entrance pupil is at infinity, there is no fan and no perspective. Move the part along the axis and it goes out of focus, but its image keeps its size and its centre; the blur is symmetrical, so an edge stays where it was.

| Type | Chief rays | What is constant | Use |
|---|---|---|---|
| Entocentric (ordinary) | converge on the pupil | nothing: $m \\propto 1/s$ | photography, general inspection |
| Object-side telecentric | parallel in object space | magnification with object distance | gauging |
| Bi-telecentric | parallel in object and image space | magnification also with sensor position | precision gauging |
| Hypercentric | diverge from the lens | nearer looks *smaller* | seeing the sides of a part |

### What it costs
- **Size.** The front element must be at least as large as the field: a 100 mm field needs a lens over 100 mm across, and weighs kilograms. Telecentric lenses are practical for fields from about 2 mm to 200 mm.
- **Fixed working distance and magnification**, with a limited depth of field.
- **Slow optics**: working f-numbers of f/6 and up are common, so the lighting must be strong.
- **Not perfectly parallel.** The telecentricity error is typically 0.05°–0.3°. A part 5 mm out of focus then shifts an edge by $\\Delta z\\tan\\alpha$ = 8.7 µm at 0.1°.

### Telecentric illumination
A telecentric lens accepts only rays parallel to its axis. A diffuse backlight wastes most of its light; a **collimated** backlight sends parallel rays, so the silhouette is bright and its edge sharp.

### Seeing into holes
Down a deep bore an ordinary lens sees the inner wall as a ring, and the hole looks smaller. A telecentric lens sees only rays parallel to the bore: the wall is invisible and the hole shows its true diameter.

### When not to use one
A flat part at a fixed height, seen through a calibrated ordinary lens, can be measured well and cheaply. Use telecentric when heights vary, parts are round or deep, or the tolerance is a few micrometres. The principle is in [[telecentricity]], the design in [[telecentric-lenses]].

> [!key] An ordinary lens magnifies nearer things more; a telecentric lens does not, because its chief rays are parallel to the axis. Gauging with a telecentric lens makes the measurement independent of the part's height, at the cost of a big, fixed, slow lens.
`,
  ideas: [
    'An ordinary lens has perspective: magnification falls as 1/s, so a nearer part measures larger.',
    'A telecentric lens puts the stop at a focal plane; the chief rays are parallel to the axis and the magnification is independent of object distance.',
    'Out of focus, a telecentric image keeps its size and centre: only the edge softens, symmetrically.',
    'The front element of a telecentric lens must be as large as the field of view; the working distance and magnification are fixed.',
    'A collimated backlight matches a telecentric lens; the residual telecentricity error (0.05°–0.3°) sets the remaining size error.'
  ],
  pitfalls: [
    'A telecentric lens has no depth of field limit — It keeps its size when the part moves, but the image still blurs outside the depth of field. Telecentric means constant magnification, not infinite sharpness.',
    'A telecentric lens can be small like any other — Its front element must cover the whole field of view, so the lens is at least as wide as the largest part to measure.',
    'Calibrating an ordinary lens removes perspective — Calibration corrects distortion and fixes the scale at one plane. If the part height changes, the scale changes, and only a telecentric lens makes the scale independent of height.',
    'Telecentric lenses see everything of a part, including its sides — They see only rays parallel to the axis, so vertical walls are invisible. To see the sides of a part, use a hypercentric lens.'
  ],
  terms: [
    { term: 'Telecentric lens', def: 'A lens whose chief rays are parallel to the axis in object space (object-side telecentric) or in both object and image space (bi-telecentric). Its magnification does not change with object distance.' },
    { term: 'Chief ray', also: ['principal ray'], def: 'The ray from an object point that passes through the centre of the aperture stop. It fixes where that point lands in the image.' },
    { term: 'Perspective error', also: ['parallax error', 'perspective distortion'], def: 'The change of measured size with the distance of the object, caused by the convergence of the chief rays of an ordinary lens.' },
    { term: 'Telecentricity error', also: ['telecentric angle'], def: 'The angle by which a real telecentric lens\'s chief rays depart from the axis, typically 0.05°–0.3°. It sets the size error of a defocused part.' },
    { term: 'Bi-telecentric lens', also: ['double telecentric lens'], def: 'A lens telecentric on both sides: the magnification is independent of object distance and of the position of the sensor.' },
    { term: 'Telecentric illumination', also: ['collimated backlight'], def: 'Light from a source at the focus of a lens, so that the rays are parallel. Used with a telecentric lens it gives bright, sharp-edged silhouettes.' }
  ],
  formulas: [
    {
      name: 'Perspective error of an ordinary lens',
      expr: 'er = d/(s - d)', tex: 'e_{\\mathrm{r}} = \\frac{\\Delta}{s - \\Delta}',
      vars: {
        er: { name: 'relative growth of the image', q: 'ratio', unit: '%', tex: 'e_{\\mathrm{r}}' },
        d: { name: 'how much nearer the object has moved', q: 'length', unit: 'mm', value: 5, tex: '\\Delta' },
        s: { name: 'distance from the entrance pupil', q: 'length', unit: 'mm', value: 200, tex: 's' }
      },
      solveFor: 'er',
      note: 'Sensor fixed; the image grows by this fraction when the object moves nearer by Δ. A telecentric lens has no such term.',
      stories: { er: 'An ordinary lens has its entrance pupil {s} from a part, which rises {d} towards it. By how much does its image grow?' }
    },
    {
      name: 'Edge shift from telecentricity error',
      expr: 'x = dz*tan(a)', tex: 'x = \\Delta z\\,\\tan\\alpha',
      vars: {
        x: { name: 'shift of the edge on the object', q: 'length', unit: 'µm', tex: 'x' },
        dz: { name: 'distance out of focus', q: 'length', unit: 'mm', value: 5, tex: '\\Delta z' },
        a: { name: 'telecentricity error', q: 'angle', unit: '°', value: 0.1, min: 0, max: 5, tex: '\\alpha' }
      },
      solveFor: 'x',
      note: 'For a real telecentric lens the chief ray is tilted by α, so a defocus Δz moves its intersection with the object plane by Δz tan α.',
      stories: { x: 'A telecentric lens has a telecentricity error of {a}. A part is {dz} out of focus. How far does its edge appear to move?' }
    }
  ],
  examples: [
    {
      title: 'The shaft that grew',
      q: 'A 50 mm shaft is measured with an ordinary lens whose entrance pupil is 200 mm from the top of the shaft. Another shaft, identical, sits 5 mm higher on a stack of parts. What does the camera report for it?',
      steps: [
        { text: 'The image grows by the factor', tex: '\\frac{s}{s - \\Delta} = \\frac{200}{195} = 1.0256' },
        'So the shaft is reported as 50 × 1.0256 = 51.28 mm: an error of 1.28 mm, 2.6 %, on a part with a tolerance of perhaps ±0.05 mm.'
      ],
      a: '51.3 mm. A telecentric lens would report 50 mm to within a few micrometres at any height inside its depth of field.'
    },
    {
      title: 'What the remaining error is worth',
      q: 'A telecentric lens has a telecentricity error of 0.1°. Parts vary in height by ±2.5 mm (5 mm in all). The pixels on the object are 6.9 µm. How large is the worst-case shift of an edge, in pixels?',
      steps: [
        { text: 'The edge shift is', tex: 'x = \\Delta z\\,\\tan\\alpha = 5\\ \\mathrm{mm} \\times \\tan 0.1° = 8.7\\ \\mu\\mathrm{m}' },
        'In pixels that is 8.7 / 6.9 = 1.3 pixels over the whole 5 mm range, or ±0.6 pixel for ±2.5 mm about the best focus. Since edges are located to a tenth of a pixel, this error is not negligible and goes into the uncertainty budget.'
      ],
      a: '8.7 µm over the whole range: about 1.3 pixels. Small, but not zero.'
    }
  ],
  quiz: [
    { q: 'Why does a telecentric lens suit gauging?', choices: ['Its magnification does not depend on the distance of the object', 'It has no aberrations', 'It has unlimited depth of field', 'It works with any lighting'], a: 0, why: 'The chief rays are parallel to the axis, so a part that moves along it keeps its size. Aberrations and depth of field are as limited as in any lens.' },
    { q: 'A telecentric lens can measure a part wider than its front element, because the rays are parallel.', a: false, why: 'Parallel rays from the whole object must enter the lens, so the front element has to be at least as large as the field of view.' },
    { q: 'An ordinary lens has its entrance pupil 300 mm from the top of a part, which rises 6 mm closer. By what percentage does its image grow?', answer: 2.04, why: '$\\Delta/(s-\\Delta) = 6/294 = 2.04\\ \\%$.' },
    { q: 'You look down a 10 mm bore, 30 mm deep, along its axis. What does a telecentric lens show compared with an ordinary one?', choices: ['A circle of the true diameter and no visible inner wall', 'The inner wall as a bright ring', 'A smaller circle', 'Nothing: the bore is dark'], a: 0, why: 'Only rays parallel to the bore reach a telecentric lens, so the wall, which is parallel to them, is not seen. An ordinary lens sees the wall at an angle.' },
    { q: 'A part is 3 mm outside the depth of field of a telecentric lens. What happens to its measured width?', choices: ['It stays nearly the same but the edge is softer', 'It grows by about 3 %', 'It shrinks by about 3 %', 'It becomes impossible to measure'], a: 0, why: 'The blur is symmetrical, so the edge position is kept, to within the telecentricity error; the sharpness falls, and the edge locating algorithm may become less precise.' }
  ],
  applications: [
    'Gauging of turned parts, pins, shafts, springs and o-rings, whose heights on a belt vary.',
    'Backlit silhouettes of glass vials, syringes, bottle threads and connector pins.',
    'Measuring holes, bores and slots without seeing their walls.',
    'Metrology of electronic parts and wafers, where the tolerance is a few micrometres.',
    'Profile projectors and measuring microscopes, the instruments machine vision inherited the idea from.'
  ],
  history: 'Profile projectors and measuring microscopes used telecentric optics for decades, so that readings did not depend on exact focus. Machine vision borrowed the idea once cameras began to measure, and fixed-magnification telecentric lenses became a standard catalogue item for gauging.',
  sources: [
    'W. J. Smith, *Modern Optical Engineering*, ch. 9 — stops, pupils and telecentric systems.',
    'J. E. Greivenkamp, *Field Guide to Geometrical Optics* (SPIE Press) — telecentric stops and chief rays.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — telecentric and entocentric imaging for measurement.'
  ],
  sim: 'mv-telecentric'
},

{
  id: 'machine-vision-lighting', parent: 'machine-vision', title: 'Lighting techniques: bright field, dark field, backlight', level: 2,
  short: 'In machine vision the lighting decides what the camera sees: the same part looks completely different lit from the camera axis, from a low angle, from behind or from all around. Bright-field, dark-field, backlight, coaxial, dome, ring and structured light each make one kind of feature stand out, and polarizers and the choice of wavelength remove glare and ambient light.',
  keywords: ['machine vision lighting', 'bright field', 'dark field', 'backlight', 'silhouette', 'coaxial light', 'on-axis light', 'dome light', 'cloudy day', 'ring light', 'low-angle', 'structured light', 'polarized light', 'glare', 'strobe', 'band-pass filter', 'LED', 'wavelength'],
  prereq: ['the-machine-vision-system', 'specular-and-diffuse-reflection'],
  related: ['telecentric-imaging', 'triggering-and-strobing', 'polarization-in-practice', 'three-d-machine-vision', 'colour-and-multispectral-imaging', 'light-emitting-diodes', 'interference-filters', 'lambertian-surfaces'],
  body: `
The camera does not see the part. It sees the *light that leaves the part in the direction of the lens*. Change where the light comes from and the same part becomes a different image: the art is to choose the geometry that makes the feature bright and the background dark, or the reverse.

### One rule: where does the mirror reflection go?
A smooth surface reflects like a mirror; a rough one scatters in all directions ([[specular-and-diffuse-reflection]]). If the mirror reflection of the background enters the lens, the background is **bright** (**bright-field**). If it misses the lens, the background is **dark**, and only what scatters or tilts the light into the lens shows up (**dark-field**). Every technique below is a variation.

### The techniques
| Technique | Where the light is | Flat shiny surface | Scratch, edge, embossing | Typical use |
|---|---|---|---|---|
| Coaxial (on-axis) | through a beam splitter, along the camera axis | bright | dark | flat shiny parts, foils, wafers |
| Direct bar or ring | 30°–60° | hot spots | mixed | matt parts; glare on shiny ones |
| Dark-field (low-angle ring) | 10°–30° above the surface | dark | bright | scratches, engraved or embossed codes |
| Dome ("cloudy day") | hemisphere of diffuse light | even | soft | curved shiny parts: cans, solder |
| Backlight | behind the part | background bright | part dark | outline, holes, presence, measurement |
| Structured light | stripes or a line at an angle | stripes | stripes bend | shape and height |
| Polarized | any, with crossed polarizers | glare removed | diffuse light only | print under film or glass |

**Backlight** gives the sharpest edges but only the outline; with a telecentric lens and a collimated backlight it is the standard for gauging ([[telecentric-imaging]]). **Structured light** leads to [[three-d-machine-vision]].

### Polarization
Glare from a shiny surface keeps the polarization of the light; light scattered from below the surface is depolarized. A polarizer on the light and a crossed one on the lens block the glare and keep the rest, so print under plastic film shows ([[polarization-in-practice]]).

### Wavelength
- **Red** (620–660 nm): cheap and every sensor responds. A narrow **band-pass filter** on the lens (10–40 nm) blocks daylight and room lighting, so the picture no longer depends on the time of day.
- **Blue** (450–470 nm): a smaller Airy disc.
- **Infrared** (850 or 940 nm): invisible to staff; some black plastics turn transparent.
- **UV** (365 nm): fluorescence of adhesives and marks.
- **Colour:** a patch looks bright in light of its own colour and dark in the opposite one. A red print on white paper vanishes under red light and turns black under green ([[colour-and-multispectral-imaging]]).

A strobe freezes motion and swamps ambient light ([[triggering-and-strobing]]). Enclose the station, and control the lamp current: LEDs dim with age.

> [!warn] Powerful LED lights and strobes can injure eyes if looked at directly, and UV and infrared lights are invisible. Look for the photobiological risk group (IEC 62471) on the light, shield the station, and remember that flashing at 3–30 Hz can trigger seizures in photosensitive people.

> [!key] Ask where the mirror reflection goes: into the lens gives a bright background, away from it a dark one with the defects lit. Backlight for outlines, low-angle for scratches, dome for shiny curves, polarizers against glare, a band-pass filter against ambient light.
`,
  ideas: [
    'The camera sees only the light that reaches the lens: the lighting geometry decides which features are bright.',
    'If the mirror reflection of the background enters the lens it is bright-field; if it misses the lens it is dark-field.',
    'Backlight for outlines, low-angle dark-field for scratches and embossing, dome for shiny curved parts, coaxial for flat shiny parts.',
    'Crossed polarizers remove the glare of a shiny surface; a band-pass filter matched to the LED removes ambient light.',
    'A patch is bright in light of its own colour and dark in the complementary colour.'
  ],
  pitfalls: [
    'More light always makes a better image — A feature shows when it contrasts with its background. Brighter light of the wrong geometry just brightens the glare as well; it is the angle that creates the contrast.',
    'Dark-field means the picture is dark — Only the background is dark. The defects, edges and scratches that scatter light into the lens are bright against it, and that is the whole point.',
    'Backlight shows all the detail of a part — It shows only the outline and any holes. Surface features, print and scratches are invisible, because the part is a black shape against a bright background.',
    'Diffuse (dome) light is best for everything — It removes shadows and glare, but it also removes the shadows that make scratches and embossing visible. Dark-field or low-angle light is better for those.'
  ],
  terms: [
    { term: 'Bright-field', def: 'Lighting arranged so that the specular reflection of the background enters the lens: the background is bright and defects that scatter or tilt the light appear dark.' },
    { term: 'Dark-field', def: 'Lighting arranged so that the specular reflection of the background misses the lens, usually with a low-angle ring or bar. The background is dark and scratches, edges and embossing are bright.' },
    { term: 'Backlight', also: ['silhouette lighting', 'transmitted light'], def: 'A light behind the part facing the camera. The part is a dark outline on a bright background, giving the best contrast for edges and holes.' },
    { term: 'Coaxial light', also: ['on-axis light', 'diffuse axial light', 'DOAL'], def: 'A light shone along the camera axis through a beam splitter. Flat shiny surfaces return the light to the lens and look bright; tilted or rough ones look dark.' },
    { term: 'Dome light', also: ['cloudy-day illuminator', 'diffuse dome', 'integrating dome'], def: 'A hemispherical diffuse light that illuminates the part from all directions, removing shadows and glare from curved shiny surfaces.' },
    { term: 'Ring light', def: 'A ring of LEDs around the lens. At the lens it gives direct bright-field light; mounted low and close to the part it gives dark-field light.' },
    { term: 'Structured light', def: 'Light projected in a known pattern (stripes, a line, a grid). The way the pattern bends over the surface gives its shape.' }
  ],
  formulas: [
    {
      name: 'Contrast of a feature against its background',
      expr: 'C = (Ib - If)/(Ib + If)', tex: 'C = \\frac{I_{\\mathrm{b}} - I_{\\mathrm{f}}}{I_{\\mathrm{b}} + I_{\\mathrm{f}}}',
      vars: {
        C: { name: 'contrast', tex: 'C' },
        Ib: { name: 'brightness of the background (grey level)', value: 200, min: 0, max: 4095, tex: 'I_{\\mathrm{b}}' },
        If: { name: 'brightness of the feature (grey level)', value: 50, min: 0, max: 4095, tex: 'I_{\\mathrm{f}}' }
      },
      solveFor: 'C',
      note: 'The ratio, not the brightness, decides whether an algorithm finds the feature. 0 means invisible, 1 a black feature on white.'
    },
    {
      name: 'Elevation angle of a ring light',
      expr: 'a = atan(h/r)', tex: '\\alpha = \\arctan\\frac{h}{r}',
      vars: {
        a: { name: 'elevation of the light above the surface', q: 'angle', unit: '°', tex: '\\alpha' },
        h: { name: 'height of the ring above the part', q: 'length', unit: 'mm', value: 15, tex: 'h' },
        r: { name: 'radius of the ring', q: 'length', unit: 'mm', value: 50, tex: 'r' }
      },
      solveFor: 'a',
      note: 'Dark-field wants a low angle, about 10°–30°; a ring that sits close to the part and is wide gives it.',
      stories: { a: 'A ring light of radius {r} sits {h} above the part. At what angle above the surface does its light arrive?' }
    }
  ],
  examples: [
    {
      title: 'A scratch on a polished plate',
      q: 'A polished flat steel plate has fine scratches that must be found. Which lighting should be tried first, and what will the picture look like?',
      steps: [
        'The plate is a flat mirror, so with the light low the mirror reflection goes away from the lens: the background is black.',
        'A scratch is a groove whose walls are tilted; they send some of the low-angle light up into the lens. The scratch shows as a bright line on black.',
        'Coaxial light would show the same scratch as a dark line on a bright background, with less contrast because of the glare; dark-field is the first choice.'
      ],
      a: 'A low-angle ring or bar (dark-field): bright scratch on a black plate.'
    },
    {
      title: 'Where to mount a low-angle ring',
      q: 'A ring light has a radius of 50 mm. How high above the part must it sit for its light to arrive at 15° above the surface?',
      steps: [
        { text: 'From $\\tan\\alpha = h/r$:', tex: 'h = r\\tan\\alpha = 50\\ \\mathrm{mm} \\times \\tan 15° = 13.4\\ \\mathrm{mm}' },
        'The ring sits 13.4 mm above the part, and the camera looks down through it.'
      ],
      a: 'About 13 mm above the surface.'
    }
  ],
  quiz: [
    { q: 'A polished flat plate has a fine scratch. Which lighting shows the scratch as a bright line on a black background?', choices: ['Low-angle dark-field', 'Coaxial bright-field', 'Backlight', 'Dome light'], a: 0, why: 'At a low angle the mirror reflection of the plate misses the lens, so the plate is dark; the tilted walls of the scratch send light up into the lens. Coaxial light gives the reverse picture, and a dome evens everything out.' },
    { q: 'Which technique gives the best contrast for measuring the outline of an opaque part?', choices: ['Backlight', 'Dome light', 'Coaxial light', 'A ring light at the lens'], a: 0, why: 'A backlight makes the part a black shape on a bright background with sharp edges. It shows nothing of the surface.' },
    { q: 'A red print on white paper is lit with a red LED and photographed with a mono camera. The print will be clearly visible.', a: false, why: 'The white paper and the red ink both reflect red light, so they look equally bright. Under green or blue light the print absorbs and turns dark.' },
    { q: 'You have to inspect printing on a shiny, curved aluminium can. Which light is the natural choice?', choices: ['A diffuse dome light', 'A single bar light at 45°', 'A backlight', 'A low-angle dark-field ring'], a: 0, why: 'A shiny cylinder reflects a narrow stripe of any directional light into the lens. A dome lights the can from all directions, so the surface looks evenly bright and the print shows.' },
    { q: 'Why fit a narrow band-pass filter matched to a red LED on a machine-vision lens?', choices: ['It blocks daylight and room lighting, which makes the image independent of ambient light', 'It makes the lens sharper', 'It lowers the f-number', 'It removes the need for a light'], a: 0, why: 'The LED is bright inside a narrow band, and the filter passes only that band. Most of the ambient light, which is spread over the whole spectrum, is stopped.' }
  ],
  applications: [
    'Reading engraved and embossed codes on metal parts with low-angle dark-field light.',
    'Gauging turned parts and checking the presence of holes with a backlight.',
    'Inspecting printed labels and foil packs with coaxial or dome light.',
    'Inspecting solder joints, which are small, shiny and curved, with dome and multi-angle ring lights (see [[automated-optical-inspection]]).',
    'Looking through plastic film or glass at printing with crossed polarizers, and filtering out sunlight at a loading dock with a red LED and a band-pass filter.'
  ],
  history: 'Machine-vision lighting began with fluorescent ring tubes and fibre-optic ring and line lights fed by halogen lamps. The LED, from the 1990s, brought controllable colour, strobing, long life and compact shapes, and made the dome, coaxial and low-angle lights of today practical.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — illumination techniques.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — lighting and viewing methods.',
    'IEC 62471, *Photobiological safety of lamps and lamp systems* — the risk groups printed on lights.'
  ],
  sim: 'mv-lighting'
}
);

/* ================================================================ interfaces and triggering */
Hyper.add(
{
  id: 'camera-interfaces', parent: 'machine-vision', title: 'Camera interfaces', level: 2,
  short: 'The interface is the cable, connector and protocol that carry the image from the camera to the processor. GigE Vision, USB3 Vision, CoaXPress, Camera Link and MIPI CSI-2 each trade bandwidth against cable length, cost and the extra hardware they need; the sensor sets the data rate, and the interface must carry it.',
  keywords: ['camera interface', 'GigE Vision', 'USB3 Vision', 'CoaXPress', 'CXP', 'Camera Link', 'Camera Link HS', 'MIPI CSI-2', 'GenICam', 'bandwidth', 'data rate', 'frame grabber', 'cable length', 'Power over Ethernet', 'frame rate'],
  prereq: ['the-machine-vision-system', 'area-scan-and-line-scan-cameras'],
  related: ['binning-roi-and-area-of-interest', 'triggering-and-strobing', 'cmos-sensors', 'rolling-and-global-shutter', 'sensor-formats-and-pixel-size', 'pixels-per-feature'],
  body: `
A 5-megapixel camera running at 60 frames a second with 8 bits per pixel makes 2448 × 2048 × 8 × 60 = 2.4 gigabits a second, 300 MB/s. Someone has to carry that to the computer, without a break, for years. The **interface** is the cable, the connector and the protocol; each one trades bandwidth against cable length, cost and the extra hardware it needs.

### What the camera needs
For $w \\times h$ pixels of $b$ bits at $f$ frames per second,
$$R = w\\,h\\,b\\,f$$
Raw colour (Bayer) data takes 8–12 bits per pixel, a processed RGB image 24. The interface must exceed $R$ by 10–20 % to cover protocol overhead; if it cannot, lower the frame rate, bin or read only a region ([[binning-roi-and-area-of-interest]]), or change the interface.

### The interfaces
| Interface | Usable bandwidth (typical) | Cable length | Needs | Notes |
|---|---|---|---|---|
| GigE Vision, 1 Gbit/s | about 110 MB/s | to 100 m, Cat5e/6 | a network port | Power over Ethernet; many cameras on a switch; 2.5, 5, 10 GbE give about 280, 560, 1100 MB/s |
| USB3 Vision | about 350–400 MB/s | 3–5 m passive; more with active or fibre cables | a USB 3 port | power in the cable; simple |
| CoaXPress | about 0.6 GB/s per cable (CXP-6), 1.2 GB/s (CXP-12); up to four cables | tens of metres of coax, about 100 m at low speed | frame grabber | power and trigger on the same coax |
| Camera Link | base 255, full 680, deca 850 MB/s | about 10 m | frame grabber | the oldest; fixed timing, tiny latency |
| Camera Link HS | several GB/s | copper short; fibre to hundreds of metres | frame grabber | the fastest links |
| MIPI CSI-2 | about 1 GB/s on four lanes | centimetres; metres with a serializer | an embedded processor | phones, boards, robots |

### GenICam: one vocabulary
Each interface moves bytes. **GenICam**, a standard of the European Machine Vision Association, says how to talk to the camera: it describes the camera's features (ExposureTime, Gain, Width, TriggerMode) in an XML file that the camera carries, and standard names for the common ones. GigE Vision, USB3 Vision, CoaXPress and Camera Link HS are built on it, so software written for one compliant camera runs on another.

### Reliability and latency
GigE and USB share a network or a host controller, and packets can be delayed or lost. Use a dedicated network card, jumbo frames (packets up to about 9 kB), few switch hops, and a wire for the trigger. CoaXPress and Camera Link are point to point with fixed latency of microseconds, and carry the trigger in the cable.

### Choosing
First data rate, then distance, then what the computer offers (a free slot, a network port, a USB port), then cost. Two GigE cameras behind one 1 Gbit/s uplink share it, each getting about half.

> [!key] Work out $R = whbf$, then pick the interface whose usable bandwidth and cable length cover it: GigE for 100 m and 100 MB/s, USB3 for 5 m and 400 MB/s, CoaXPress and Camera Link HS for the fastest and longest links, MIPI inside embedded boards.
`,
  ideas: [
    'The sensor sets the data rate R = w × h × bits × frames per second; the interface must carry it with 10–20 % to spare.',
    'GigE Vision: about 110 MB/s over 100 m; USB3 Vision: about 400 MB/s over a few metres; CoaXPress and Camera Link HS: gigabytes a second.',
    'CoaXPress and Camera Link need a frame grabber; GigE and USB need only a port, and share their bandwidth between cameras.',
    'GenICam gives every compliant camera the same names for its features, whatever the interface.',
    'Binning, a region of interest and a lower bit depth cut the data rate without changing the interface.'
  ],
  pitfalls: [
    'A 1 Gbit/s link carries 125 MB/s of image — About 110 MB/s of picture data after protocol overhead, and that is shared by every camera on the link.',
    'GenICam is a cable or connector standard — It is a software standard that describes a camera\'s features. The cable and signalling belong to GigE Vision, USB3 Vision, CoaXPress and the others.',
    'A faster interface means a faster camera — The sensor and its readout limit the frame rate; the interface only has to keep up. A camera that already fills a link will not run faster on a bigger one.',
    'USB is as good as Ethernet for any cable run — Standard passive USB 3 cables work to 3–5 m; Ethernet runs to 100 m. Beyond a few metres USB needs active or fibre cables.'
  ],
  terms: [
    { term: 'GigE Vision', def: 'A standard for cameras on Gigabit Ethernet: about 110 MB/s of image data over cable runs of up to 100 m, with power over Ethernet and many cameras on a switch.' },
    { term: 'USB3 Vision', def: 'A standard for cameras on USB 3: about 350–400 MB/s over short passive cables, with power in the cable.' },
    { term: 'CoaXPress', also: ['CXP'], def: 'A standard that carries the image, the control and the trigger and also supplies power over one or more coaxial cables, at up to 12.5 Gbit/s per cable. It needs a frame grabber.' },
    { term: 'Camera Link', also: ['CL'], def: 'An older standard for fast digital cameras, with base, full and deca configurations of 255, 680 and 850 MB/s over cables of up to about 10 m. It needs a frame grabber.' },
    { term: 'MIPI CSI-2', also: ['CSI-2', 'MIPI camera serial interface'], def: 'The short-range serial interface between an image sensor and a processor on the same board or flex cable. Common in phones, embedded boards and robots.' },
    { term: 'GenICam', def: 'A software standard that describes a camera\'s features in a file the camera carries, and standardizes the names of the common ones, so that software can control any compliant camera in the same way.' }
  ],
  formulas: [
    {
      name: 'Data rate of a camera',
      expr: 'R = w*h*b*f', tex: 'R = w\\,h\\,b\\,f',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'MB/s', tex: 'R' },
        w: { name: 'pixels across', value: 2448, min: 1, max: 100000, tex: 'w' },
        h: { name: 'pixels down', value: 2048, min: 1, max: 100000, tex: 'h' },
        b: { name: 'bits per pixel', value: 8, min: 1, max: 48, tex: 'b' },
        f: { name: 'frames per second', q: 'frequency', unit: 'Hz', value: 60, tex: 'f' }
      },
      solveFor: 'R',
      note: 'Uncompressed, before protocol overhead. Solve for f to find the frame rate an interface allows.',
      stories: { R: 'A camera with {w} × {h} pixels of {b} bits runs at {f}. What data rate must the interface carry?', f: 'A camera with {w} × {h} pixels of {b} bits sends {R} down its cable. What frame rate is that?' }
    },
    {
      name: 'Transfer time of one frame',
      expr: 'tt = w*h*b/B', tex: 't_{\\mathrm{t}} = \\frac{w\\,h\\,b}{B}',
      vars: {
        tt: { name: 'time to transfer one frame', q: 'time', unit: 'ms', tex: 't_{\\mathrm{t}}' },
        w: { name: 'pixels across', value: 2448, min: 1, max: 100000, tex: 'w' },
        h: { name: 'pixels down', value: 2048, min: 1, max: 100000, tex: 'h' },
        b: { name: 'bits per pixel', value: 8, min: 1, max: 48, tex: 'b' },
        B: { name: 'usable bandwidth', q: 'datarate', unit: 'MB/s', value: 110, tex: 'B' }
      },
      solveFor: 'tt',
      note: 'The transfer time adds to the latency; it can overlap the exposure of the next frame.'
    }
  ],
  examples: [
    {
      title: 'Will it fit on Gigabit Ethernet?',
      q: 'A 2448 × 2048 camera with 8-bit pixels is to run at 60 frames a second. Which interfaces can carry it, and what would a GigE link give?',
      steps: [
        { text: 'The data rate is', tex: 'R = 2448 \\times 2048 \\times 8 \\times 60 = 2.41\\ \\mathrm{Gbit/s} = 301\\ \\mathrm{MB/s}' },
        'Gigabit Ethernet carries about 110 MB/s: a frame is 5.0 MB, so it manages 110 / 5.0 = 22 frames a second. USB3 Vision (350–400 MB/s) fits, if the cable is under about 5 m. At 10 m or more use CoaXPress, or a 10 GigE camera.'
      ],
      a: '301 MB/s. Not GigE (22 frames a second at most); USB3 Vision over 5 m or less; CoaXPress or 10 GigE for longer runs.'
    },
    {
      title: 'A fast line-scan camera',
      q: 'A line-scan camera with 8192 pixels of 8 bits runs at 50 kHz. Which interface suits it?',
      steps: [
        { text: 'The data rate is', tex: 'R = 8192 \\times 8 \\times 50\\,000 = 3.28\\ \\mathrm{Gbit/s} = 410\\ \\mathrm{MB/s}' },
        'That is more than USB3 Vision can carry, with no margin; a CoaXPress CXP-6 cable carries about 600 MB/s, and Camera Link full 680 MB/s.'
      ],
      a: '410 MB/s: CoaXPress (one CXP-6 cable) or Camera Link full, with a frame grabber.'
    }
  ],
  quiz: [
    { q: 'A 2448 × 2048 camera with 8-bit pixels runs at 60 frames a second. What data rate in MB/s must the interface carry?', answer: 301, unit: 'MB/s', why: '2448 × 2048 × 8 × 60 = 2.41 Gbit/s, which is 301 MB/s (8 bits make a byte).' },
    { q: 'A camera must be 40 m from the computer and delivers 300 MB/s. Which interface fits?', choices: ['CoaXPress or a 10 GigE camera, or fibre', 'USB3 Vision over a passive cable', '1 Gbit/s GigE Vision', 'Camera Link base'], a: 0, why: 'USB 3 works to 3–5 m on passive cables; 1 GbE reaches 100 m but carries only about 110 MB/s; Camera Link base carries 255 MB/s over about 10 m. CoaXPress, 10 GigE or fibre links carry the rate over such a distance.' },
    { q: 'GenICam defines the cable and connector of industrial cameras.', a: false, why: 'GenICam is a software standard that describes a camera\'s features and their names. The cable is defined by GigE Vision, USB3 Vision, CoaXPress, Camera Link and the others.' },
    { q: 'Two GigE Vision cameras share one 1 Gbit/s uplink from a switch. Each can send about…', choices: ['55 MB/s', '110 MB/s', '220 MB/s', '440 MB/s'], a: 0, why: 'The uplink carries about 110 MB/s in all, divided between the two cameras. Faster uplinks (10 GbE) or a second network port are the cures.' },
    { q: 'A 12-bit camera is changed to 8-bit output at the same resolution and frame rate. The data rate…', choices: ['falls to two thirds', 'falls to one half', 'is unchanged', 'rises by half'], a: 0, why: '$R = whbf$: 8/12 = 2/3. Many interfaces pack 12-bit pixels, but the stream is proportional to the bits sent.' }
  ],
  applications: [
    'Inspection stations with a few cameras, close to the computer, on USB3 Vision or GigE Vision.',
    'Production lines where the camera is up to 100 m from the controller, on GigE Vision with power over Ethernet.',
    'Line-scan and very high-resolution cameras on CoaXPress or Camera Link HS.',
    'Robots, drones and embedded vision boards with MIPI CSI-2 cameras next to the processor.',
    'Multi-camera tunnels in logistics, with many GigE cameras on a switched network.'
  ],
  history: 'Camera Link (2000) was the first standard for fast digital industrial cameras. GigE Vision (2006) and later USB3 Vision (2013) brought cameras to ordinary network and USB ports, and CoaXPress and Camera Link HS followed for the fastest, longest links. GenICam grew alongside, so that software no longer had to be rewritten for each camera.',
  sources: [
    'The GigE Vision, USB3 Vision, Camera Link, Camera Link HS, CoaXPress and GenICam standards, as published by the machine-vision industry associations (A3, EMVA, JIIA) — bandwidths and cable lengths are given there in full.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — image acquisition devices and interfaces.',
    'A. Hornberg (ed.), *Handbook of Machine and Computer Vision* (Wiley-VCH, 2nd ed. 2017) — camera interfaces.'
  ],
  sim: 'mv-interfaces'
},

{
  id: 'triggering-and-strobing', parent: 'machine-vision', title: 'Triggering and strobing', level: 2,
  short: 'Triggering decides when the camera takes the picture; exposure and strobing decide how sharp it is. A hardware trigger puts the part in the same place in every frame, and a short strobe pulse, far brighter than steady light, freezes motion that a long exposure would smear across several pixels.',
  keywords: ['trigger', 'hardware trigger', 'software trigger', 'jitter', 'trigger delay', 'encoder trigger', 'exposure', 'motion blur', 'strobe', 'flash', 'overdrive', 'duty cycle', 'LED strobe', 'global shutter', 'free run', 'freeze motion'],
  prereq: ['the-machine-vision-system', 'machine-vision-lighting'],
  related: ['area-scan-and-line-scan-cameras', 'rolling-and-global-shutter', 'flash-and-strobe', 'camera-interfaces', 'shutter-speed-and-motion', 'pixels-per-feature', 'light-emitting-diodes'],
  body: `
A picture helps only if the part is in the right place and the exposure is short enough for it not to smear. **Triggering** decides *when*; **exposure** and **strobing** decide *how sharp*.

### Triggers
- **Software trigger:** the computer sends a command over the network or USB. The delay wanders by milliseconds with the load: fine for a part that stands still.
- **Hardware trigger:** a wire into the camera's opto-isolated input (5–24 V) from a photoelectric or proximity sensor or a PLC. The delay is a few microseconds, and the **jitter** (its variation) one to a few tens of microseconds.
- **Encoder trigger:** pulses from an encoder on the belt, one for each fraction of a millimetre of travel. It triggers by *position*, not time, so it stays right when the line speed varies, and line-scan cameras need it.
- **Free run:** the camera takes frames continuously; the software picks the right ones.

The part moves while the trigger jitters, so the position error is $\\Delta x = v\\,t_j$: 1 mm for 1 ms at 1 m/s, 10 µm for 10 µs. A **trigger delay** set in the camera places the part in the middle of the frame after the sensor has seen it.

### Motion blur
During the exposure $t$ the part moves $v\\,t$, smearing its image over
$$b = \\frac{v\\,t\\,m}{p}$$
pixels. A belt at 1 m/s, a magnification of 0.1 and 5 µm pixels turn a 100 µs exposure into 2 pixels of blur. For measurement keep the blur to half a pixel or less, for detection about one.

### Short exposure, much light
Exposure is illuminance times time: 25 µs instead of 5 ms needs 200 times the light, 7.6 stops. Only a strobe gives that.

### Strobing
An LED rated for a continuous current can carry several times as much for a short pulse, because what limits it is heating, which follows the average power. A controller sets the **overdrive** current, the pulse (10–200 µs) and a limit on the **duty cycle**, $D = t_w f$: 50 µs pulses at 100 Hz are 0.5 %. Light output rises a little less than in proportion to the current, as LEDs lose efficiency at high currents.

In a dark enclosure the *pulse*, not the shutter, sets the exposure, so the camera may expose for longer than the pulse. Ambient light would add its own smear, so enclose the station or filter it ([[machine-vision-lighting]]).

### Shutter and wiring
A global shutter exposes all pixels at once; a rolling shutter exposes row by row and skews moving things ([[rolling-and-global-shutter]]), so moving parts want a global shutter, or a strobe inside the time when all rows are open. Wire it in a chain: sensor, trigger, camera, the camera's *exposure-active* output, light controller. The camera itself then times the flash exactly.

> [!warn] Strobes flashing at 3–30 Hz can trigger seizures in photosensitive people, and bright pulses dazzle. Shield the station and follow the light's photobiological safety rating.

> [!key] Trigger by hardware or encoder so the part is where you expect; keep the blur $b = vtm/p$ under about half a pixel; and when that needs exposures of microseconds, replace the steady light with an overdriven strobe.
`,
  ideas: [
    'A hardware trigger has microseconds of jitter, a software trigger milliseconds; position error is speed times jitter.',
    'An encoder triggers by position, not by time, so it stays right when the line speed varies.',
    'Motion blur in pixels is v × t × m / p; keep it to half a pixel for measurement.',
    'A shorter exposure needs proportionally more light: a strobe, overdriven within its duty-cycle limit, supplies it.',
    'With a strobe in a dark enclosure the pulse sets the exposure, not the shutter.'
  ],
  pitfalls: [
    'A software trigger is as good as a hardware trigger — It can wander by milliseconds, which at belt speed is millimetres of position. Use a wired trigger when the part moves.',
    'A short shutter time is enough to freeze motion — It does, but at the cost of the light: exposure is illuminance times time. Without enough light the picture is dark and noisy, which is why a strobe is used.',
    'A strobe just means a brighter lamp — It is a lamp driven well above its continuous rating for microseconds; the limit is the heat it dissipates on average. Keep to the pulse width and duty cycle the controller specifies.',
    'A rolling shutter is fine with a strobe — Only if the flash falls inside the time when every row is exposed. Otherwise rows are lit at different moments and the picture skews.'
  ],
  terms: [
    { term: 'Hardware trigger', also: ['external trigger'], def: 'A signal on a wire into the camera that starts the exposure. It has a delay and jitter of microseconds, unlike a software command.' },
    { term: 'Trigger jitter', also: ['jitter'], def: 'The variation in the delay between the trigger and the start of the exposure. Multiplied by the part\'s speed it gives the random position error in the image.' },
    { term: 'Trigger delay', def: 'A programmed wait between the trigger and the exposure, so that a part detected upstream is in the middle of the frame when the picture is taken.' },
    { term: 'Motion blur', def: 'The smear of a moving object over several pixels during the exposure. In pixels it is speed × exposure × magnification ÷ pixel pitch.' },
    { term: 'Strobe', also: ['flash', 'pulsed light'], def: 'A light switched on for a very short time (microseconds), synchronized to the exposure, to freeze motion and overpower ambient light.' },
    { term: 'Overdrive', also: ['LED overdrive'], def: 'Driving an LED with several times its continuous current for a pulse of limited length and duty cycle, to get more light than steady operation allows.' },
    { term: 'Duty cycle', def: 'The fraction of time a strobe is on: the pulse width multiplied by the pulse frequency. It limits the heating of an overdriven LED.' }
  ],
  formulas: [
    {
      name: 'Motion blur in pixels',
      expr: 'b = v*t*m/p', tex: 'b = \\frac{v\\,t\\,m}{p}',
      vars: {
        b: { name: 'blur in pixels', tex: 'b' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1, tex: 'v' },
        t: { name: 'exposure time', q: 'time', unit: 'µs', value: 100, tex: 't' },
        m: { name: 'magnification', value: 0.1, min: 0.001, max: 10, tex: 'm' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5, tex: 'p' }
      },
      solveFor: 'b',
      note: 'Solve for t to find the longest exposure that keeps the blur within a chosen fraction of a pixel.',
      stories: { b: 'A part moves at {v} past a camera with a magnification of {m} and {p} pixels. The exposure is {t}. How many pixels does the image smear?', t: 'A part moves at {v}; the magnification is {m} and the pixels are {p}. What exposure keeps the blur to {b} pixels?' }
    },
    {
      name: 'Position error from trigger jitter',
      expr: 'dx = v*tj', tex: '\\Delta x = v\\,t_{\\mathrm{j}}',
      vars: {
        dx: { name: 'position error on the object', q: 'length', unit: 'µm', tex: '\\Delta x' },
        v: { name: 'speed of the object', q: 'speed', unit: 'm/s', value: 1, tex: 'v' },
        tj: { name: 'trigger jitter', q: 'time', unit: 'µs', value: 10, tex: 't_{\\mathrm{j}}' }
      },
      solveFor: 'dx',
      stories: { dx: 'A part moves at {v} and the trigger has {tj} of jitter. By how much does its position in the picture vary?' }
    },
    {
      name: 'Illuminance for a shorter exposure',
      expr: 'E2 = E1*t1/t2', tex: 'E_2 = E_1\\,\\frac{t_1}{t_2}',
      vars: {
        E2: { name: 'illuminance needed for the short exposure', q: 'illuminance', unit: 'klx', tex: 'E_2' },
        E1: { name: 'illuminance that works for the long exposure', q: 'illuminance', unit: 'klx', value: 2, tex: 'E_1' },
        t1: { name: 'long exposure', q: 'time', unit: 'ms', value: 5, tex: 't_1' },
        t2: { name: 'short exposure', q: 'time', unit: 'µs', value: 25, tex: 't_2' }
      },
      solveFor: 'E2',
      note: 'Exposure H = E t is held constant, so the same picture brightness needs the same product.',
      stories: { E2: 'A picture is right at {E1} for {t1}. How much light is needed to get the same exposure in {t2}?' }
    },
    {
      name: 'Duty cycle of a strobe',
      expr: 'dc = tw*f', tex: 'D = t_{\\mathrm{w}}\\,f',
      vars: {
        dc: { name: 'duty cycle', q: 'ratio', unit: '%', tex: 'D' },
        tw: { name: 'pulse width', q: 'time', unit: 'µs', value: 50, tex: 't_{\\mathrm{w}}' },
        f: { name: 'pulse rate', q: 'frequency', unit: 'Hz', value: 100, tex: 'f' }
      },
      solveFor: 'dc',
      note: 'Compare with the maximum duty cycle the light\'s controller allows at that overdrive current.'
    }
  ],
  examples: [
    {
      title: 'Freezing a belt',
      q: 'A belt at 1 m/s is imaged at a magnification of 0.1 with 5 µm pixels. What is the longest exposure that keeps the blur to half a pixel, and how much more light does that need than a 5 ms exposure?',
      steps: [
        { text: 'Solve $b = v\\,t\\,m/p$ for $t$ with $b = 0.5$:', tex: 't = \\frac{b\\,p}{v\\,m} = \\frac{0.5 \\times 5\\ \\mu\\mathrm{m}}{1\\ \\mathrm{m/s} \\times 0.1} = 25\\ \\mu\\mathrm{s}' },
        'Compared with 5 ms, 25 µs is 200 times shorter, so 200 times the illuminance is needed: 7.6 stops. Ordinary lighting cannot give that, an overdriven strobe can.'
      ],
      a: '25 µs, with 200 times the light of a 5 ms exposure: a strobe.'
    },
    {
      title: 'Is the strobe within its limit?',
      q: 'A strobe fires 50 µs pulses at 100 Hz. Its controller allows up to 5 % duty cycle at the overdrive current. Is that allowed, and what is the highest rate it could run at?',
      steps: [
        { text: 'The duty cycle is', tex: 'D = t_{\\mathrm{w}} f = 50\\ \\mu\\mathrm{s} \\times 100\\ \\mathrm{s^{-1}} = 0.5\\ \\%' },
        'That is well under 5 %. The rate is limited at $f = D/t_w = 0.05/50\\ \\mu\\mathrm{s} = 1000$ Hz.'
      ],
      a: 'Yes, 0.5 % is within the limit; up to 1 kHz at this pulse width.'
    }
  ],
  quiz: [
    { q: 'A part moves at 2 m/s and the trigger has 50 µs of jitter. By how many micrometres does its position in the image vary?', answer: 100, unit: 'µm', why: '$\\Delta x = v\\,t_j = 2\\ \\mathrm{m/s} \\times 50\\ \\mu\\mathrm{s} = 100\\ \\mu\\mathrm{m}$, a tenth of a millimetre.' },
    { q: 'A belt moves at 0.5 m/s, the magnification is 0.2, the pixels are 4 µm and the exposure is 200 µs. How many pixels of motion blur are there?', answer: 5, why: '$b = vtm/p = 0.5 × 2\\times10^{-4} × 0.2 / (4\\times10^{-6}) = 5$ pixels. A strobe pulse of 20 µs would bring it to half a pixel.' },
    { q: 'A software trigger freezes the position of a moving part as well as a hardware trigger does.', a: false, why: 'A software trigger wanders by milliseconds, which at belt speed is millimetres. A wired hardware trigger wanders by microseconds.' },
    { q: 'The exposure is cut by a factor of 10 to reduce blur. What else must change to keep the picture as bright?', choices: ['Ten times the illuminance, from a strobe', 'Nothing: the camera compensates', 'A larger f-number', 'A longer lens'], a: 0, why: 'Exposure is illuminance times time. A tenth of the time needs ten times the light (or a lens opened by 3.3 stops, which costs depth of field).' },
    { q: 'Why can an LED strobe be driven far above its continuous current rating?', choices: ['The limit is heating, which follows the average power, and the pulses are short and rare', 'A strobe LED is a different kind of LED', 'The light output is not related to the current', 'The camera protects the LED'], a: 0, why: 'The junction heats according to the average power. With a duty cycle of a percent or less, the pulse can be many times the continuous rating, within the maximum pulse rating of the device.' }
  ],
  applications: [
    'Bottling, packaging and printing lines, where parts pass the camera at up to several metres a second.',
    'Pick-and-place and sorting, where a trigger from the robot or the conveyor encoder places the part in the frame.',
    'Reading bar codes on parcels at belt speed, with a short strobe against blur.',
    'Line-scan inspection of webs, with an encoder for one line per fraction of a millimetre.',
    'High-speed analysis in laboratories: sprays, droplets and mechanics, imaged with nanosecond to microsecond pulses.'
  ],
  history: 'Strobing a flash to freeze motion goes back to the stroboscopic photographs of Harold Edgerton, from the 1930s. Machine vision adopted the xenon flash for the same reason and replaced it with the pulsed LED from the 2000s, which is controllable, durable, and can be fired at a hundred times a second.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — image acquisition, triggering and exposure.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — strobed lighting.',
    'IEC 62471, *Photobiological safety of lamps and lamp systems* — the classification of bright lights.'
  ],
  sim: 'mv-trigger'
}
);

/* ================================================================ pixels per feature and automated optical inspection */
Hyper.add(
{
  id: 'pixels-per-feature', parent: 'machine-vision', title: 'Pixels per feature: the resolution you need', level: 2,
  short: 'How many pixels does a defect, an edge or a character need? Not as many as possible: more pixels cost sensor, data, lens and light. A few rules of thumb answer it (about 3 pixels across the smallest defect, 2 to 3 per bar-code module, a tenth of the tolerance for measurement) and sub-pixel edge location turns pixels into much finer measurements.',
  keywords: ['pixels per feature', 'resolution', 'pixel footprint', 'sub-pixel', 'edge location', 'measurement uncertainty', 'rule of ten', 'bar code module', 'Data Matrix', 'OCR', 'defect size', 'Nyquist', 'pixels on target', 'field of view', 'gauge capability'],
  prereq: ['choosing-a-machine-vision-lens', 'nyquist-sampling-and-aliasing'],
  related: ['the-machine-vision-system', 'sensor-formats-and-pixel-size', 'system-mtf', 'camera-interfaces', 'automated-optical-inspection', 'binning-roi-and-area-of-interest', 'magnification-and-working-distance'],
  body: `
How many pixels does a defect need? Not "as many as possible": more pixels cost sensor, data, a finer lens and more light. Too few, and the defect falls between pixels or sinks into the noise. The answer is a set of rules of thumb that all come from one idea: a feature must be *sampled* by enough pixels to be told from noise.

### Footprint and count
The **pixel footprint** on the object is the field of view divided by the pixels across it, $s = W/n$. A feature of size $d$ then covers
$$k = \\frac{d}{s} = \\frac{d\\,n}{W}$$
pixels. A 60 mm field on 2448 pixels has a footprint of 24.5 µm; a 0.2 mm scratch covers 8 pixels.

### Rules of thumb
| Task | Pixels | Why |
|---|---|---|
| Detect a defect (a spot) | 3–4 across; 2 at the very least, with high contrast | a one-pixel spot straddling pixel boundaries is shared by up to four pixels and loses most of its contrast |
| Locate an edge | sharp over 2–3 pixels; located to 0.1–0.3 pixel | the edge profile can be interpolated |
| Gauge a dimension | footprint no larger than the tolerance divided by about $10\\,q$ | the "rule of ten": the gauge resolves a tenth of the tolerance |
| 1-D bar code | at least 2, better 3, per narrowest bar | each bar must be told from its neighbours |
| 2-D Data Matrix | 3–4, at least 2, per module | the same, in two directions |
| Text (OCR) | character height 20–30 pixels, strokes 2–3 | the shape of letters needs detail |

These are starting points, to be confirmed on real parts: low contrast, noise, a poor lens and a colour (Bayer) sensor all call for more.

### Why more than two?
Sampling theory ([[nyquist-sampling-and-aliasing]]) says two pixels per line pair is the limit. But a real lens has an MTF below 1 at that frequency, noise hides faint features, and a feature falls anywhere between pixels: three or four per feature leaves margin.

### Sub-pixel measurement
An edge is blurred by the lens and the pixel aperture over a few pixels. Fitting a curve through its grey levels, or interpolating where it crosses half height, finds the edge to a fraction of a pixel, typically 0.1 pixel for a clean edge and 0.2–0.3 under ordinary conditions. That is **precision**. **Accuracy** also needs a calibrated scale, corrected distortion and stable lighting. With a repeatability $q$ pixels, the measurement resolution is $s\\,q$.

### From tolerance to pixels
For a total tolerance band $T$ the gauge should resolve about $T/10$, so $s\\,q \\le T/10$ and
$$s = \\frac{T}{10\\,q}$$
With $T = 0.1$ mm and $q = 0.2$, $s = 0.05$ mm: a 50 mm field needs 1000 pixels across.

### Spend pixels where needed
More pixels across a fixed field mean a smaller footprint, but also more data ([[camera-interfaces]]) and a lens resolving finer detail ([[system-mtf]]). Use several cameras, a larger sensor, a zoomed region of interest, or a motion stage rather than an extreme sensor.

> [!key] A feature needs about 3 pixels across it, a bar code module 2–3, and a measurement a footprint of $T/(10q)$. Count the pixels from the field of view, $k = dn/W$, before choosing the camera.
`,
  ideas: [
    'The pixel footprint is the field of view divided by the pixels across it; a feature of size d covers d/footprint pixels.',
    'A defect should be at least 3–4 pixels across; a bar-code module 2–3; a character 20–30 pixels high.',
    'Sub-pixel edge location gives a precision of 0.1–0.3 pixel; accuracy also needs calibration and stable light.',
    'For a tolerance T the footprint should be no larger than T/(10 q), with q the edge repeatability in pixels.',
    'Meeting the Nyquist limit of two pixels per feature is not enough in practice: noise, blur and position between pixels need margin.'
  ],
  pitfalls: [
    'More megapixels always mean a finer measurement — Resolution is the pixels across the field: a bigger field on the same sensor makes the footprint larger. The footprint, not the megapixel count, sets what can be seen.',
    'Sub-pixel means the measurement is accurate to a tenth of a pixel — It is the repeatability of the edge location. Accuracy also needs a calibrated scale, corrected lens distortion, a stable edge and light that does not move it.',
    'Two pixels per feature is enough because of Nyquist — That is the theoretical limit for an ideal, noise-free system. Real lenses lose contrast at that frequency, and the feature falls anywhere between pixels. Plan on three or four.',
    'A one-pixel defect covers one pixel — It covers up to four, depending where it falls, sharing its signal among them, so its contrast in any one pixel is a fraction of the true value.'
  ],
  terms: [
    { term: 'Pixel footprint', also: ['pixel size on the object', 'ground sample distance (aerial imaging)'], def: 'The size of the object region covered by one pixel: the field of view divided by the pixels across it, or the pixel pitch divided by the magnification.' },
    { term: 'Sub-pixel accuracy', also: ['sub-pixel edge location'], def: 'Locating an edge or a centre to a fraction of a pixel by interpolating the grey levels, usually quoted as the repeatability (0.1–0.3 pixel).' },
    { term: 'Rule of ten', also: ['gauge resolution rule'], def: 'The guideline that a measuring system should resolve about one tenth of the tolerance it checks.' },
    { term: 'Module', also: ['X-dimension'], def: 'The width of the narrowest bar of a 1-D code, or the side of one cell of a 2-D code. It must cover at least two to three pixels.' },
    { term: 'Pixels on target', def: 'The number of pixels that cover a feature: its size divided by the pixel footprint.' },
    { term: 'Precision and accuracy', also: ['repeatability and trueness'], def: 'Precision is the scatter of repeated measurements; accuracy is how close their average is to the true value. Sub-pixel methods improve precision; calibration is needed for accuracy.' }
  ],
  formulas: [
    {
      name: 'Pixels across a feature',
      expr: 'k = d*n/W', tex: 'k = \\frac{d\\,n}{W}',
      vars: {
        k: { name: 'pixels across the feature', tex: 'k' },
        d: { name: 'size of the feature', q: 'length', unit: 'mm', value: 0.2, tex: 'd' },
        n: { name: 'pixels across the field of view', value: 2448, min: 1, max: 100000, tex: 'n' },
        W: { name: 'width of the field of view', q: 'length', unit: 'mm', value: 60, tex: 'W' }
      },
      solveFor: 'k',
      note: 'Solve for n to find the pixels needed for a given k, or for d for the smallest feature a camera resolves.',
      stories: { k: 'A field {W} wide is imaged on {n} pixels. How many pixels cover a feature {d} across?', n: 'A feature {d} across must cover {k} pixels in a field {W} wide. How many pixels are needed across the sensor?' }
    },
    {
      name: 'Footprint needed for a tolerance',
      expr: 's = T/(10*q)', tex: 's = \\frac{T}{10\\,q}',
      vars: {
        s: { name: 'largest pixel footprint on the object', q: 'length', unit: 'mm', tex: 's' },
        T: { name: 'total tolerance band', q: 'length', unit: 'mm', value: 0.1, tex: 'T' },
        q: { name: 'edge repeatability in pixels', value: 0.2, min: 0.01, max: 1, tex: 'q' }
      },
      solveFor: 's',
      note: 'A guide: the gauge resolves T/10, and the resolution is the footprint times the repeatability.',
      stories: { s: 'A tolerance band of {T} is to be checked with an edge repeatability of {q} pixel. How large may a pixel be on the object?' }
    },
    {
      name: 'Resolution of a sub-pixel measurement',
      expr: 'r = W/(n*qs)', tex: 'r = \\frac{W}{n\\,q_{\\mathrm{s}}}',
      vars: {
        r: { name: 'measurement resolution', q: 'length', unit: 'µm', tex: 'r' },
        W: { name: 'width of the field of view', q: 'length', unit: 'mm', value: 50, tex: 'W' },
        n: { name: 'pixels across the field of view', value: 1000, min: 1, max: 100000, tex: 'n' },
        qs: { name: 'sub-pixel subdivision (1/q)', value: 5, min: 1, max: 100, tex: 'q_{\\mathrm{s}}' }
      },
      solveFor: 'r',
      stories: { r: 'A {W} field is imaged on {n} pixels and edges are located to one {qs}th of a pixel. What measurement resolution is that?' }
    }
  ],
  examples: [
    {
      title: 'Pixels for a defect',
      q: 'A part 60 mm wide must be inspected for pits 0.15 mm in size. How many pixels across must the sensor have, if each pit is to cover 3 pixels?',
      steps: [
        { text: 'The footprint must be a third of the pit:', tex: 's = \\frac{0.15}{3} = 0.05\\ \\mathrm{mm}' },
        { text: 'The field is 60 mm, so', tex: 'n = \\frac{W}{s} = \\frac{60}{0.05} = 1200' },
        'A 1.3-megapixel camera (1280 pixels across) just does it; 1600 pixels gives a margin, and a 2448-pixel camera would show each pit with 6 pixels.'
      ],
      a: '1200 pixels across, so a camera of 1.3 to 2 megapixels.'
    },
    {
      title: 'Pixels for a tolerance',
      q: 'A shaft diameter has a tolerance band of 0.1 mm (±0.05 mm). Edges can be located to 0.2 pixel. What pixel size is needed on the shaft, and how many pixels across a 50 mm field?',
      steps: [
        { text: 'By the rule of ten, the resolution should be 0.01 mm, so', tex: 's = \\frac{T}{10\\,q} = \\frac{0.1\\ \\mathrm{mm}}{10 \\times 0.2} = 0.05\\ \\mathrm{mm}' },
        { text: 'A 50 mm field then needs', tex: 'n = \\frac{50}{0.05} = 1000\\ \\text{pixels}' },
        'That is the minimum with a clean backlit edge; a telecentric lens, calibration and a stable backlight are needed for the 0.2 pixel to be real.'
      ],
      a: 'A 50 µm footprint: 1000 pixels across a 50 mm field.'
    }
  ],
  quiz: [
    { q: 'A field 50 mm wide is imaged on 1000 pixels. How many pixels cover a feature 0.15 mm wide?', answer: 3, why: '$k = dn/W = 0.15 × 1000/50 = 3$ pixels: just enough for a defect.' },
    { q: 'A 0.1 mm defect must cover 3 pixels in a 50 mm field. How many pixels across must the sensor have?', answer: 1500, why: 'The footprint is 0.1/3 = 0.033 mm, and 50/0.033 = 1500 pixels.' },
    { q: 'A 1D bar code has a narrowest bar of 0.25 mm. The footprint is 0.1 mm. How is it likely to read?', choices: ['Poorly: 2.5 pixels per module is at the minimum', 'Perfectly: any code with 2 pixels reads', 'It cannot be imaged', 'It is too coarse'], a: 0, why: 'About 2.5 pixels per module is at the edge of what a reader can cope with; 3 or more is the safe design target, which needs a footprint of 0.08 mm or less.' },
    { q: 'Edges can be located to 0.1 pixel, so the measurement is accurate to a tenth of a pixel.', a: false, why: 'That figure is the repeatability. A tenth of a pixel of accuracy also requires a calibrated scale, corrected distortion and an edge that light does not shift.' },
    { q: 'A tolerance band is 0.2 mm and the edge repeatability is 0.2 pixel. What is the largest footprint, in mm, by the rule of ten?', answer: 0.1, unit: 'mm', why: '$s = T/(10q) = 0.2/(10 × 0.2) = 0.1$ mm.' }
  ],
  applications: [
    'Specifying the sensor for any inspection from the smallest defect and the field of view.',
    'Checking whether a bar or Data Matrix code on a part can be read with the camera and lens on hand.',
    'Setting the tolerance a gauging system can honestly verify, and what to calibrate.',
    'Deciding between one big sensor and several cameras for a large product.'
  ],
  history: 'The rule of ten comes from metrology, where the gauge is chosen to resolve a tenth of the tolerance it checks. Sub-pixel edge detection grew with digital image processing in the 1980s, as interpolating grey levels turned a camera into a measuring instrument finer than its pixels.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — sub-pixel precise edge extraction and measurement accuracy.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — choosing resolution.',
    'ISO/IEC 16022, *Data Matrix bar code symbology specification* — the definition of the symbol and its modules.'
  ],
  sim: 'mv-pixels'
},

{
  id: 'automated-optical-inspection', parent: 'machine-vision', title: 'Automated optical inspection (AOI)', level: 2,
  short: 'Automated optical inspection, AOI, is the use of cameras and lights to check products, above all printed circuit boards, for missing, misplaced and badly soldered components. A 2-D machine looks from above and from the sides with multi-angle light; a 3-D machine adds the height of every point; both trade false calls against escapes.',
  keywords: ['AOI', 'automated optical inspection', 'PCB inspection', 'solder joint', 'SMT', 'component placement', 'tombstone', 'solder bridge', 'false call', 'escape', '3-D AOI', 'SPI', 'solder paste inspection', 'golden sample', 'DPMO', 'X-ray inspection'],
  prereq: ['the-machine-vision-system', 'machine-vision-lighting', 'pixels-per-feature'],
  related: ['three-d-machine-vision', 'structured-light-scanning', 'the-vision-inspection-cell', 'angle-of-incidence-and-coatings', 'binning-roi-and-area-of-interest', 'colour-and-multispectral-imaging', 'area-scan-and-line-scan-cameras'],
  body: `
> [!note] **AOI has three meanings in optics.** Here it is *automated optical inspection*, a manufacturing process. It is also the *angle of incidence* of light on a surface or coating ([[angle-of-incidence-and-coatings]]), and the *area of interest* on an image sensor ([[binning-roi-and-area-of-interest]]). Context tells which.

A circuit board leaves the placement machine with a thousand components, some only 0.4 × 0.2 mm (the 01005 size), each on tiny pads of solder paste. One missing, crooked or poorly soldered part ruins a product that goes on to work for years. A person cannot check a thousand joints in the 30 to 60 seconds a line allows; a camera can.

### Where it sits and what it finds
- **After paste printing** (solder paste inspection, SPI, usually 3-D): the volume and position of paste.
- **After placement, before reflow:** components missing, wrong, shifted, rotated, or with reversed polarity.
- **After reflow:** the solder joints themselves, the most common place.

Typical defects are missing parts, offset or rotation, **tombstoning** (a small part standing on one end), **bridges** between pins, insufficient or excess solder, lifted leads, solder balls, foreign matter and wrong markings. For fine-pitch leads (0.4–0.5 mm) a bridge is under 0.1 mm wide, so footprints of 10–25 µm are used ([[pixels-per-feature]]).

### How the machine sees
- **2-D AOI.** A camera above the board with a **multi-angle light**, often rings of red, green and blue LEDs at different elevations. Shiny solder fillets slope smoothly, so the colour of the reflection tells the *slope*, and a good fillet has a recognizable pattern. Angled side cameras look under leads and into fillets.
- **3-D AOI.** A fringe projector and cameras measure the height of every pixel to a few micrometres: coplanarity, lifted leads, component height. See [[three-d-machine-vision]].
- A head steps from **field of view** to field, or scans continuously with a line-scan camera ([[area-scan-and-line-scan-cameras]]).

### How the verdict is made
Each component has a window and a library entry (size, colour, solder area, expected slope pattern). The software compares the image with it, or with a golden sample, and with learned examples. Two errors compete: a **false call** (a good joint flagged, wasting an operator's time) and an **escape** (a defect passed). Sensitivity trades one for the other.

### What it cannot see
AOI sees only what faces the camera. Joints under a ball-grid array are invisible and need X-ray (AXI); electrical faults need in-circuit or functional tests. AOI complements them.

### Outside electronics
The same idea inspects bottles and closures, tablets and blisters, wafers, glass and printed sheets.

> [!key] AOI is automated optical inspection: cameras and multi-angle light checking each part and joint at line speed. Footprint sets the smallest defect, coloured angled light reads the slope of solder, 3-D adds height, and the threshold trades false calls against escapes.
`,
  ideas: [
    'AOI here means automated optical inspection; it also means angle of incidence and area of interest in other contexts.',
    'It checks presence, position, polarity and solder joints after placement and after reflow.',
    'Multi-angle coloured light turns the slope of a solder fillet into colour; 3-D AOI adds height by fringe projection.',
    'The pixel footprint (10–25 µm for fine pitch) fixes the smallest defect that can be seen.',
    'Sensitivity trades false calls against escapes; AOI cannot see hidden joints, which need X-ray.'
  ],
  pitfalls: [
    'AOI always means automated optical inspection — In coatings it is the angle of incidence of a ray, and on image sensors the area of interest. The surrounding page tells which.',
    'A more sensitive AOI is always better — Higher sensitivity catches more defects but also flags more good boards (false calls), which cost time and trust. The aim is the right balance, set from real boards.',
    'AOI can inspect every solder joint — It sees only the visible ones. Ball-grid arrays and other hidden joints need X-ray inspection.',
    'One good picture is enough — A joint is a shiny three-dimensional shape. Different light angles, side cameras and height data each show defects the others miss.'
  ],
  terms: [
    { term: 'Automated optical inspection', also: ['AOI'], def: 'Inspection by cameras, light and software, with no operator: here, of circuit boards and other products. (AOI also stands for angle of incidence and for area of interest.)' },
    { term: 'False call', also: ['false reject', 'false positive'], def: 'A good part or joint reported as defective by the inspection machine. Too many waste an operator\'s time.' },
    { term: 'Escape', also: ['false accept', 'missed defect'], def: 'A defect that the inspection passes. The balance with false calls is set by the sensitivity.' },
    { term: 'Tombstoning', also: ['Manhattan effect'], def: 'A small chip component standing on one end after reflow, because the solder at one end pulled it up.' },
    { term: 'Golden sample', also: ['golden board'], def: 'A known good part whose image is used as the reference with which others are compared.' },
    { term: 'SPI', also: ['solder paste inspection'], def: 'Inspection, usually 3-D, of the volume and position of solder paste printed on the board before components are placed.' },
    { term: 'DPMO', also: ['defects per million opportunities'], def: 'A measure of manufacturing quality: defects divided by units times opportunities per unit, multiplied by one million.' }
  ],
  formulas: [
    {
      name: 'Inspection time for a board',
      expr: 'T = A/(Wf*Hf)*tf', tex: 'T = \\frac{A}{W_{\\mathrm{f}} H_{\\mathrm{f}}}\\,t_{\\mathrm{f}}',
      vars: {
        T: { name: 'inspection time', q: 'time', unit: 's', tex: 'T' },
        A: { name: 'board area', q: 'area', unit: 'cm²', value: 500, tex: 'A' },
        Wf: { name: 'width of one field of view', q: 'length', unit: 'mm', value: 40, tex: 'W_{\\mathrm{f}}' },
        Hf: { name: 'height of one field of view', q: 'length', unit: 'mm', value: 30, tex: 'H_{\\mathrm{f}}' },
        tf: { name: 'time per field (move, settle, expose, process)', q: 'time', unit: 's', value: 0.4, tex: 't_{\\mathrm{f}}' }
      },
      solveFor: 'T',
      note: 'Fields overlap a little and edges need whole fields, so real times are somewhat longer.',
      stories: { T: 'A board of {A} is inspected in fields {Wf} × {Hf}, each taking {tf}. How long does the whole board take?' }
    },
    {
      name: 'Defects per million opportunities',
      expr: 'dpmo = nd/(nu*no)*1e6', tex: '\\mathrm{DPMO} = \\frac{n_{\\mathrm{d}}}{n_{\\mathrm{u}}\\,n_{\\mathrm{o}}}\\times 10^6',
      vars: {
        dpmo: { name: 'defects per million opportunities', tex: '\\mathrm{DPMO}' },
        nd: { name: 'defects found', value: 12, min: 0, max: 1e9, tex: 'n_{\\mathrm{d}}' },
        nu: { name: 'boards inspected', value: 400, min: 1, max: 1e9, tex: 'n_{\\mathrm{u}}' },
        no: { name: 'opportunities per board (joints, parts)', value: 1200, min: 1, max: 1e9, tex: 'n_{\\mathrm{o}}' }
      },
      solveFor: 'dpmo',
      stories: { dpmo: '{nd} defects are found on {nu} boards, each offering {no} opportunities for a defect. What is the DPMO?' }
    }
  ],
  examples: [
    {
      title: 'How long does a board take?',
      q: 'A board of 250 × 200 mm is inspected in fields of 40 × 30 mm. Each field takes 0.4 s (move, settle, exposure, processing). How long does the board take?',
      steps: [
        { text: 'The board area is 500 cm² = 50 000 mm², and a field is 1 200 mm², so about', tex: '\\frac{50\\,000}{1\\,200} = 41.7\\ \\text{fields}' },
        'With overlaps and edges, about 45 fields in practice. Then $T = 45 × 0.4 = 18$ s.',
        'That fits a 30 to 60 s line cycle, but a head twice as slow would not.'
      ],
      a: 'About 17–18 s, within the cycle of a typical line.'
    },
    {
      title: 'Can it see a bridge?',
      q: 'A solder bridge between fine-pitch leads is 0.1 mm wide. The AOI footprint is 15 µm. How many pixels cover it, and is that enough?',
      steps: [
        { text: 'The bridge covers', tex: 'k = \\frac{0.1}{0.015} = 6.7\\ \\text{pixels}' },
        'That is above the 3 to 4 needed, so the bridge is detectable with margin; a footprint of 30 µm would give 3.3, near the limit.'
      ],
      a: '6.7 pixels: detectable. 30 µm pixels would just reach the limit.'
    }
  ],
  quiz: [
    { q: 'A coating datasheet says "AOI 45°". A camera sheet says "AOI 1920 × 1080". A PCB line has an "AOI machine". What is true?', choices: ['The three AOIs are different terms: angle of incidence, area of interest, automated optical inspection', 'They all mean automated optical inspection', 'They all mean angle of incidence', 'Only the PCB one is a real term'], a: 0, why: 'AOI is an abbreviation of three different phrases; the context (coatings, sensors, manufacturing) tells which.' },
    { q: 'Which joints can automated optical inspection not see?', choices: ['Joints hidden under a ball-grid array', 'Joints on the top of the board', 'Joints of 0402 components', 'Solder bridges between leads'], a: 0, why: 'AOI sees surfaces that face the cameras. Hidden joints need X-ray inspection.' },
    { q: 'A board of 200 × 150 mm is inspected in fields of 40 × 30 mm, taking 0.4 s each. How many seconds does it take (ignoring overlaps)?', answer: 10, unit: 's', why: 'The area ratio is 30 000/1 200 = 25 fields, and 25 × 0.4 s = 10 s.' },
    { q: 'Raising the sensitivity of an AOI machine reduces both false calls and escapes.', a: false, why: 'Higher sensitivity catches more real defects but flags more good joints too. The two errors trade against each other, so the threshold is a balance.' },
    { q: '6 defects are found on 200 boards with 1 500 solder joints each. What is the DPMO?', answer: 20, why: '$6/(200 × 1500) × 10^6 = 20$ defects per million opportunities.' }
  ],
  applications: [
    'Surface-mount electronics lines: after paste printing, after placement and after reflow.',
    'Bare circuit boards and flexible circuits: trace width, shorts and opens at 10–25 µm.',
    'Semiconductor packaging and wafers, where the same ideas work at micrometre scales.',
    'Pharmaceutical and packaging lines: blisters, tablets, closures and printed cartons.',
    'Inspection of glass, film and displays, with line-scan cameras and dark-field light.'
  ],
  history: 'Automated optical inspection of circuit boards began in the 1980s, when surface-mount boards became too dense for visual inspection. Early systems compared a grey-level image with a golden board; today they use colour multi-angle light, 3-D fringe projection and trained classifiers.',
  sources: [
    'IPC-A-610, *Acceptability of Electronic Assemblies* — the visual criteria that AOI programs encode.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — applications and examples.',
    'B. G. Batchelor (ed.), *Machine Vision Handbook* (Springer, 2012) — inspection of printed circuit boards.'
  ],
  sim: 'mv-aoi'
}
);

/* ================================================================ colour, multispectral and 3-D */
Hyper.add(
{
  id: 'colour-and-multispectral-imaging', parent: 'machine-vision', title: 'Colour, multispectral and hyperspectral imaging', level: 2,
  short: 'A colour camera records three broad bands at the price of resolution and light; a monochrome camera with light of a chosen colour often shows a feature better. Multispectral and hyperspectral cameras record a handful to hundreds of narrow bands, including the near infrared, and tell materials apart by their reflectance spectra: plastics for recycling, bruises on fruit, foreign bodies in food.',
  keywords: ['colour camera', 'Bayer', 'monochrome', 'coloured light', 'multispectral', 'hyperspectral', 'spectral imaging', 'data cube', 'hypercube', 'pushbroom', 'near infrared', 'NIR', 'SWIR', 'InGaAs', 'sorting', 'spectral signature', 'three-chip camera'],
  prereq: ['machine-vision-lighting', 'colour-filter-arrays-and-demosaicing', 'quantum-efficiency-and-spectral-response'],
  related: ['infrared-and-thermal-sensors', 'optical-sorting-and-colour-measurement', 'spectrometers-and-monochromators', 'colour-difference-and-tolerance', 'uv-and-infrared-materials', 'colour-wheels-and-harmony'],
  body: `
A camera records numbers, not colours. Which numbers depends on how its pixels are filtered and how the part is lit, and the choice can decide whether a defect is visible at all.

### Colour cameras
A colour sensor carries a **Bayer mosaic** of red, green and blue filters, half of them green. Each pixel records one colour and the other two are interpolated ([[colour-filter-arrays-and-demosaicing]]). That costs three things:
- **Resolution.** A thin red line may fall on one pixel in four; the effective colour resolution is about half of the pixel count.
- **Light.** Each filter passes about a third of white light.
- **Accuracy.** Colour needs a stable, calibrated light and white balance.

A **three-chip camera** splits the light with a prism onto three sensors: full resolution in every colour, at higher cost, size and lens demands. Use colour when the task *is* colour: sorting, checking packaging, identifying coloured wires, judging ripeness, measuring a colour difference ([[colour-difference-and-tolerance]]).

### Monochrome and coloured light
If the question is "is the mark there?", a monochrome camera with the best light colour usually wins: full resolution, more sensitivity, and the contrast you choose. A patch looks bright in light of its own colour and dark in the opposite colour, and any contrast that exists in some band can be found by trying the colours. Four coloured LEDs switched in turn give a full-resolution colour picture of a still part.

### Beyond the visible: near infrared
Silicon sensors respond up to 1000–1100 nm. Remove the infrared-cut filter and light with 850 or 940 nm LEDs, and dyes that differ in the visible look alike while materials look different: black plastics may turn transparent, and vegetation brightens above 700 nm. Beyond 1000 nm **InGaAs** cameras (900–1700 nm) see **short-wave infrared**, where water absorbs strongly (wet looks dark) and plastics differ in their absorption.

### Multispectral and hyperspectral
**Multispectral** cameras record a few bands (3 to 20) through filters, a filter wheel, a filter mosaic or lights in turn. **Hyperspectral** cameras record tens to hundreds of narrow, contiguous bands, a **data cube** with two spatial axes and one wavelength axis. The usual design is a **pushbroom**: a line-scan camera behind a slit and a spectrograph, so each frame is one line of the scene with its spectrum, and the belt supplies the other direction. A cube of 640 pixels × 240 bands at 100 lines a second at 16 bits is 31 MB/s.

The **spectral signature**, reflectance against wavelength, identifies a material. A hyperspectral study finds which two to five bands tell the materials apart, and the production sorter then uses just those, with fast line cameras.

### Practicalities
The light must have energy in the bands used; the camera needs a white reference (a diffuse white tile) to convert counts to reflectance; and temperature and ageing shift the result.

> [!warn] UV and strong infrared lights are invisible and can injure the eyes or skin. Use the guards, eyewear and risk group stated for the light.

> [!key] Use colour when colour is the question; otherwise a monochrome camera with the right coloured or infrared light gives more resolution and contrast. Hyperspectral cubes find the bands that separate materials, and production uses a few.
`,
  ideas: [
    'A Bayer colour sensor loses resolution and light compared with a monochrome one; three-chip cameras avoid it at a cost.',
    'A mono camera with coloured light gives the contrast you choose: bright in light of its own colour, dark in the opposite one.',
    'Silicon sees to about 1100 nm; InGaAs cameras see short-wave infrared to 1700 nm, where water and plastics absorb.',
    'A hyperspectral image is a cube of two spatial axes and a wavelength axis, usually recorded by a pushbroom scanner.',
    'The reflectance spectrum identifies a material; production often uses just a few well-chosen bands.'
  ],
  pitfalls: [
    'A colour camera is always the more informative choice — It has fewer effective pixels and passes less light per pixel. For a task that is not about colour, a mono camera and the right light usually shows more.',
    'Infrared images are the visible picture made redder — Materials respond differently beyond the visible: dyes can vanish, black plastics turn transparent, water turns dark. The infrared image is another view, with its own contrast.',
    'Hyperspectral means a colour picture with more colours — It is a cube of hundreds of narrow bands per pixel, a spectrum for every point, not something that looks richer on a screen.',
    'Silicon cameras can see short-wave infrared — They stop at about 1100 nm. Beyond it a photon cannot bridge the band gap, and InGaAs or similar detectors are needed.'
  ],
  terms: [
    { term: 'Multispectral imaging', def: 'Recording an image in a few (about 3 to 20) separate wavelength bands, using filters, a filter wheel, a filter mosaic or lights in turn.' },
    { term: 'Hyperspectral imaging', also: ['imaging spectroscopy'], def: 'Recording a full spectrum at every pixel, in tens to hundreds of narrow contiguous bands.' },
    { term: 'Data cube', also: ['hypercube', 'spectral cube'], def: 'The three-dimensional data set of hyperspectral imaging: two spatial axes and one wavelength axis.' },
    { term: 'Pushbroom scanner', also: ['line-scan spectral imager'], def: 'A hyperspectral camera that images one line of the scene through a slit and a spectrograph, recording that line\'s spectrum at every pixel; the motion supplies the other spatial axis.' },
    { term: 'Spectral signature', also: ['reflectance spectrum', 'spectral fingerprint'], def: 'The reflectance of a material as a function of wavelength. It identifies materials that look alike in one band.' },
    { term: 'SWIR', also: ['short-wave infrared'], def: 'The wavelength band from about 1 to 2.5 µm, seen by InGaAs and similar cameras but not by silicon. Water and many plastics absorb characteristically in it.' },
    { term: 'Three-chip camera', also: ['3-CCD camera', 'prism camera'], def: 'A colour camera with a prism that splits the light onto three sensors, giving full resolution in red, green and blue.' }
  ],
  formulas: [
    {
      name: 'Contrast between two materials in a band',
      expr: 'C = (R1 - R2)/(R1 + R2)', tex: 'C = \\frac{R_1 - R_2}{R_1 + R_2}',
      vars: {
        C: { name: 'contrast', signed: true, tex: 'C' },
        R1: { name: 'reflectance of the first material in the band', value: 0.85, min: 0, max: 1, tex: 'R_1' },
        R2: { name: 'reflectance of the second material in the band', value: 0.08, min: 0, max: 1, tex: 'R_2' }
      },
      solveFor: 'C',
      note: 'The band where this is largest is the one to light and to filter for.',
      stories: { C: 'In a chosen band, paper reflects {R1} of the light and a print {R2}. What is the contrast?' }
    },
    {
      name: 'Spectral sampling of a hyperspectral camera',
      expr: 'dl = (hi - lo)/nb', tex: '\\Delta\\lambda = \\frac{\\lambda_{\\mathrm{hi}} - \\lambda_{\\mathrm{lo}}}{n_{\\mathrm{b}}}',
      vars: {
        dl: { name: 'band spacing', q: 'length', unit: 'nm', tex: '\\Delta\\lambda' },
        hi: { name: 'longest wavelength', q: 'length', unit: 'nm', value: 1000, tex: '\\lambda_{\\mathrm{hi}}' },
        lo: { name: 'shortest wavelength', q: 'length', unit: 'nm', value: 400, tex: '\\lambda_{\\mathrm{lo}}' },
        nb: { name: 'number of bands', value: 240, min: 1, max: 5000, tex: 'n_{\\mathrm{b}}' }
      },
      solveFor: 'dl'
    },
    {
      name: 'Data rate of a pushbroom camera',
      expr: 'R = nx*nb*b*fl', tex: 'R = n_x\\,n_{\\mathrm{b}}\\,b\\,f_{\\mathrm{L}}',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'MB/s', tex: 'R' },
        nx: { name: 'pixels along the slit', value: 640, min: 1, max: 100000, tex: 'n_x' },
        nb: { name: 'number of bands', value: 240, min: 1, max: 5000, tex: 'n_{\\mathrm{b}}' },
        b: { name: 'bits per sample', value: 16, min: 1, max: 32, tex: 'b' },
        fl: { name: 'lines per second', q: 'frequency', unit: 'Hz', value: 100, tex: 'f_{\\mathrm{L}}' }
      },
      solveFor: 'R',
      stories: { R: 'A pushbroom camera records {nx} pixels in {nb} bands of {b} bits, at {fl}. What data rate is that?' }
    }
  ],
  examples: [
    {
      title: 'A red mark on white card',
      q: 'White card reflects 85 % in every band. A red ink reflects 80 % in the red band (620–660 nm) and 8 % in the green. Which light shows the mark, and with what contrast?',
      steps: [
        { text: 'Under red light:', tex: 'C = \\frac{0.85 - 0.80}{0.85 + 0.80} = 0.03' },
        { text: 'Under green light:', tex: 'C = \\frac{0.85 - 0.08}{0.85 + 0.08} = 0.83' },
        'The mark is invisible under red light and nearly black on white under green: choose a green or blue LED.'
      ],
      a: 'Green light: contrast 0.83. Red light gives 0.03, which no software can use.'
    },
    {
      title: 'The size of a hyperspectral cube',
      q: 'A pushbroom camera covers 400–1000 nm in 240 bands. Its slit has 640 pixels, and it records 100 lines a second at 16 bits. What is the band spacing and the data rate?',
      steps: [
        { text: 'The spacing:', tex: '\\Delta\\lambda = \\frac{1000 - 400}{240} = 2.5\\ \\mathrm{nm}' },
        { text: 'The data rate:', tex: 'R = 640 \\times 240 \\times 16 \\times 100 = 246\\ \\mathrm{Mbit/s} = 31\\ \\mathrm{MB/s}' },
        'Modest, because the line rate is low; at 1000 lines a second it would be 307 MB/s.'
      ],
      a: '2.5 nm per band; 31 MB/s.'
    }
  ],
  quiz: [
    { q: 'Paper reflects 85 % in a band and a print 8 %. What is the contrast, to two decimal places?', answer: 0.83, why: '$(0.85 - 0.08)/(0.85 + 0.08) = 0.77/0.93 = 0.83$.' },
    { q: 'A Bayer colour sensor has 5 million pixels. How many of them are green?', choices: ['2.5 million', '1.25 million', '5 million', '1.67 million'], a: 0, why: 'The mosaic is two green pixels to one red and one blue: half of all pixels are green, and each of the other colours has a quarter.' },
    { q: 'An ordinary silicon camera, with its infrared-cut filter removed, can image at 1.5 µm.', a: false, why: 'Silicon stops responding near 1100 nm. At 1.5 µm photons are too weak to free an electron: InGaAs or another SWIR detector is needed.' },
    { q: 'Which sorting job suits a hyperspectral or SWIR system best?', choices: ['Telling white plastics of different polymers apart on a belt', 'Reading a printed code', 'Finding a dark spot on a white tile', 'Measuring the diameter of a pin'], a: 0, why: 'Plastics that look alike in visible light have different absorption in the short-wave infrared, so their spectra tell them apart. The other tasks are visible-contrast or geometric jobs.' },
    { q: 'A hyperspectral camera covers 400–1000 nm in 150 bands. What is the band spacing, in nm?', answer: 4, unit: 'nm', why: '(1000 − 400)/150 = 4 nm.' }
  ],
  applications: [
    'Sorting plastics for recycling by their short-wave infrared spectra, with line-scan cameras and air jets.',
    'Checking food: foreign bodies, bruises, ripeness, moisture and contamination, with near-infrared and hyperspectral cameras.',
    'Reading marks and inspecting print with a mono camera and the colour that contrasts best.',
    'Colour inspection of cosmetics, textiles, paint and packaging with calibrated lights and colour cameras.',
    'Silicon wafer and solar-cell inspection, which uses infrared that silicon itself is transparent to.'
  ],
  history: 'Imaging spectrometry was developed for Earth observation in the 1980s, in airborne instruments that recorded a spectrum for every pixel. Cheaper InGaAs cameras and fast computers brought the idea to production lines in the 2000s, first for sorting and food inspection.',
  sources: [
    'A. F. H. Goetz, G. Vane, J. E. Solomon and B. N. Rock, "Imaging spectrometry for Earth remote sensing", *Science* 228 (1985) — the origin of hyperspectral imaging.',
    'D.-W. Sun (ed.), *Hyperspectral Imaging for Food Quality Analysis and Control* (Academic Press, 2010) — industrial uses.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — colour image acquisition.'
  ],
  sim: 'mv-spectral'
},

{
  id: 'three-d-machine-vision', parent: 'machine-vision', title: '3-D machine vision', level: 2,
  short: 'Many jobs need the third coordinate: the height of a solder bump, the volume of a pile, the position of a part in a bin. Four families of method give it: stereo (two cameras), laser triangulation (a laser line seen at an angle), structured light (projected patterns) and time of flight (the delay of light). They differ in range, accuracy, speed and what surface they tolerate.',
  keywords: ['3-D', 'three-dimensional', 'stereo', 'stereo vision', 'disparity', 'laser triangulation', 'structured light', 'fringe projection', 'time of flight', 'ToF', 'depth', 'range', 'height', 'point cloud', 'bin picking', 'baseline'],
  prereq: ['machine-vision-lighting', 'the-machine-vision-system'],
  related: ['laser-triangulation', 'structured-light-scanning', 'time-of-flight-cameras', 'lidar', 'binocular-vision-and-stereopsis', 'automated-optical-inspection', 'pattern-projectors'],
  body: `
A picture says where things are across and down, but not how far. Many jobs need depth: the height of a solder bump, the volume of a pile of grain, the position and tilt of a part in a bin so that a robot can pick it. Four families of method give it.

| Method | Principle | Range | Typical accuracy | Strengths | Weaknesses |
|---|---|---|---|---|---|
| Stereo | two cameras, depth from disparity | 0.3–10 m | 0.1–1 % of range | passive, fast, cheap | needs texture; occlusion |
| Laser triangulation | a laser line seen at an angle | 10 mm–1 m | 1–100 µm | accurate, kilohertz profiles | one line, needs motion; shadows; shiny surfaces |
| Structured light | projected stripes or patterns | 50 mm–2 m | 10 µm–1 mm | whole field in 0.1–1 s | static scene; ambient light |
| Time of flight | delay of a light pulse or phase of a wave | 0.3–100 m | mm–cm | simple, any surface, long range | coarse resolution; multipath |

### Triangulation and stereo: one geometry
Look at the same point from two places a **baseline** $B$ apart. The point appears at slightly different positions in the two views, by the **disparity** $d$ on a sensor behind lenses of focal length $f$. Distance follows from similar triangles,
$$Z = \\frac{f\\,B}{d}$$
In **stereo** the second view is a second camera; in **laser triangulation** it is a laser projecting a line whose position the camera sees: the laser plays the part of the second camera, and needs no texture of its own. A step of height $\\delta z$ shifts the line on the sensor, and the depth resolution is
$$\\delta z = \\frac{Z^2\\,p}{f\\,B}$$
for a pixel pitch $p$. Close and wide baselines are accurate; doubling the distance makes the error four times larger. With 5 µm pixels, $f = 25$ mm, $B = 100$ mm and $Z = 500$ mm it is 0.5 mm, 0.05 mm with 0.1-pixel sub-pixel location.

### Structured light
A projector throws stripes or a series of shifted sinusoidal patterns (phase shifting) over the object; the camera sees them bent by the shape, and every pixel gives a height. It is triangulation in the whole field at once. See [[structured-light-scanning]].

### Time of flight
Light takes 6.7 ps to cover 1 mm out and back, too short for a camera to time. **ToF cameras** modulate the light (typically 20–100 MHz) and measure the phase of the returning wave: the range is $c/(2f_m)$ before the phase wraps, 7.5 m at 20 MHz. See [[time-of-flight-cameras]].

### Choosing
Micrometres on a moving part: laser triangulation or a confocal sensor. Whole objects in a second: structured light. Robots grasping from bins: structured light or stereo with a projected pattern. Rooms, pallets and vehicles: time of flight or [[lidar]].

> [!warn] Triangulation lasers are often Class 2 or 3R and projectors are bright. Never look into a laser line or its reflection; follow [[laser-safety-classes]].

> [!key] Depth comes from a second view (stereo, triangulation, structured light) or from the delay of light (time of flight). Triangulation accuracy falls as $Z^2$, which is why close, wide-baseline sensors measure micrometres and distant ones millimetres.
`,
  ideas: [
    'Stereo, laser triangulation and structured light are one geometry: two views a baseline apart and Z = fB/d.',
    'The depth resolution of triangulation, Z²p/(fB), grows with the square of the distance; a close, wide-baseline sensor is accurate.',
    'A laser line or projected pattern replaces the second camera, so smooth, textureless surfaces can be measured.',
    'Time of flight measures the delay of light, 6.7 ps per millimetre, usually through the phase of modulated light.',
    'Pick by scale: micrometres, triangulation; whole objects, structured light; rooms and pallets, time of flight.'
  ],
  pitfalls: [
    'Stereo works on any surface — It needs texture to find the same point in both images. A smooth, evenly coloured surface has none, so a pattern projector is added.',
    'Doubling the distance halves the depth accuracy — It makes the error four times worse, because the resolution goes as Z². Distance costs accuracy fast.',
    'Time of flight measures time with a stopwatch — A millimetre is 6.7 picoseconds out and back. ToF cameras measure the phase of modulated light instead, and the range repeats beyond c/(2f).',
    'One 3-D method suits all jobs — Each has its own range, accuracy, speed and surface limits. Shiny, transparent and dark surfaces trouble all of them in different ways.'
  ],
  terms: [
    { term: 'Disparity', def: 'The difference in the position of the same point in two views, measured on the sensor. Distance is inversely proportional to it: Z = fB/d.' },
    { term: 'Baseline', def: 'The distance between the two viewpoints (two cameras, or the camera and the laser) of a triangulation. A longer baseline gives a finer depth resolution but more occlusion.' },
    { term: 'Laser triangulation', def: 'A laser spot or line is projected on the object and viewed by a camera at an angle; the position of the line in the image gives the height. A profile sensor measures one line at a time.' },
    { term: 'Structured light', also: ['fringe projection'], def: 'A projector throws a known pattern (stripes, phase-shifted fringes) on the object; the way a camera sees it bent gives depth at every pixel.' },
    { term: 'Time of flight', also: ['ToF'], def: 'Measuring distance from the time that light takes to go to the object and back, or from the phase of modulated light that returns.' },
    { term: 'Point cloud', def: 'The result of a 3-D measurement: a set of points with x, y, z coordinates describing the surface.' }
  ],
  formulas: [
    {
      name: 'Depth from disparity',
      expr: 'Z = f*B/d', tex: 'Z = \\frac{f\\,B}{d}',
      vars: {
        Z: { name: 'distance to the point', q: 'length', unit: 'mm', tex: 'Z' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 12, tex: 'f' },
        B: { name: 'baseline', q: 'length', unit: 'mm', value: 120, tex: 'B' },
        d: { name: 'disparity on the sensor', q: 'length', unit: 'µm', value: 2400, tex: 'd' }
      },
      solveFor: 'Z',
      stories: { Z: 'Two cameras with {f} lenses are {B} apart and see a point with a disparity of {d}. How far away is it?' }
    },
    {
      name: 'Depth resolution of triangulation and stereo',
      expr: 'dz = Z^2*p/(f*B)', tex: '\\delta z = \\frac{Z^2\\,p}{f\\,B}',
      vars: {
        dz: { name: 'depth change for one pixel of shift', q: 'length', unit: 'mm', tex: '\\delta z' },
        Z: { name: 'distance', q: 'length', unit: 'mm', value: 500, tex: 'Z' },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 5, tex: 'p' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 25, tex: 'f' },
        B: { name: 'baseline', q: 'length', unit: 'mm', value: 100, tex: 'B' }
      },
      solveFor: 'dz',
      note: 'For one pixel. Locating the line or the feature to 0.1 pixel gives ten times finer.',
      stories: { dz: 'A triangulation sensor with {p} pixels, a {f} lens and a {B} baseline looks at an object {Z} away. What depth change moves the line one pixel?' }
    },
    {
      name: 'Distance from the time of flight',
      expr: 'Z = c*t/2', tex: 'Z = \\frac{c\\,t}{2}',
      vars: {
        Z: { name: 'distance', q: 'length', unit: 'm', tex: 'Z' },
        c: { const: 'c' },
        t: { name: 'round-trip time', q: 'time', unit: 'ns', value: 20, tex: 't' }
      },
      solveFor: 'Z',
      stories: { Z: 'A pulse returns {t} after it left. How far away is the object?' }
    },
    {
      name: 'Range of a phase-measuring ToF camera',
      expr: 'Zm = c/(2*fm)', tex: 'Z_{\\mathrm{max}} = \\frac{c}{2 f_{\\mathrm{m}}}',
      vars: {
        Zm: { name: 'unambiguous range', q: 'length', unit: 'm', tex: 'Z_{\\mathrm{max}}' },
        c: { const: 'c' },
        fm: { name: 'modulation frequency', q: 'frequency', unit: 'MHz', value: 20, tex: 'f_{\\mathrm{m}}' }
      },
      solveFor: 'Zm',
      note: 'Beyond this the phase wraps and distances repeat; cameras combine two frequencies to extend it.'
    }
  ],
  examples: [
    {
      title: 'How fine is a triangulation sensor?',
      q: 'A laser-triangulation profile sensor has a 25 mm lens, a 100 mm baseline and 5 µm pixels, and looks at a surface 500 mm away. What height change moves the laser line by one pixel, and what by a tenth of a pixel?',
      steps: [
        { text: 'The depth resolution is', tex: '\\delta z = \\frac{Z^2\\,p}{f\\,B} = \\frac{(500\\ \\mathrm{mm})^2 \\times 0.005\\ \\mathrm{mm}}{25\\ \\mathrm{mm} \\times 100\\ \\mathrm{mm}} = 0.5\\ \\mathrm{mm}' },
        'With the line located to 0.1 pixel, the resolution is 0.05 mm. Moving the sensor to 250 mm quarters it to 0.0125 mm (12.5 µm).'
      ],
      a: '0.5 mm per pixel, 0.05 mm with sub-pixel location, and four times better at half the distance.'
    },
    {
      title: 'Time of flight in picoseconds',
      q: 'How long does light take to go to a surface 1 mm farther away and back, and what range does a camera modulating at 20 MHz cover before the phase wraps?',
      steps: [
        { text: 'The extra round trip of 2 mm takes', tex: '\\Delta t = \\frac{2 \\times 10^{-3}\\ \\mathrm{m}}{3.0 \\times 10^{8}\\ \\mathrm{m/s}} = 6.7\\ \\mathrm{ps}' },
        { text: 'The unambiguous range at 20 MHz is', tex: 'Z_{\\mathrm{max}} = \\frac{c}{2 f_{\\mathrm{m}}} = \\frac{3.0\\times10^{8}}{2 \\times 20\\times10^{6}} = 7.5\\ \\mathrm{m}' }
      ],
      a: '6.7 ps per millimetre; 7.5 m at 20 MHz.'
    }
  ],
  quiz: [
    { q: 'A stereo pair has a 150 mm baseline and 8 mm lenses with 3 µm pixels. What depth change, in mm, moves a feature by one pixel at 1 m?', answer: 2.5, unit: 'mm', why: '$\\delta z = Z^2 p/(fB) = 10^6 × 0.003/(8 × 150) = 2.5$ mm.' },
    { q: 'Doubling the distance of a triangulation sensor doubles the depth error.', a: false, why: 'The depth resolution goes as $Z^2$, so doubling the distance makes the error four times larger.' },
    { q: 'You must measure a smooth, evenly coloured car panel. Which method works without adding anything to it?', choices: ['Laser triangulation or structured light, which project their own pattern', 'Passive stereo, with no texture to match', 'A single camera and a ruler', 'A hyperspectral camera'], a: 0, why: 'Stereo needs texture to find corresponding points. Triangulation and structured light project the pattern they need.' },
    { q: 'What is the round-trip time, in nanoseconds, of light that goes to an object 3 m away and back?', answer: 20, unit: 'ns', why: '$t = 2Z/c = 6\\ \\mathrm{m}/(3\\times10^8\\ \\mathrm{m/s}) = 20$ ns.' },
    { q: 'Which method records the whole field of a static object in a fraction of a second, by projecting a series of patterns?', choices: ['Structured light', 'Laser line triangulation', 'Time of flight', 'Passive stereo'], a: 0, why: 'Structured-light systems project stripes or phase-shifted fringes and compute the height of every pixel; a laser line gives a single profile per frame.' }
  ],
  applications: [
    'Height and volume of solder paste and components on circuit boards (see [[automated-optical-inspection]]).',
    'Profile sensors on conveyors: tyres, wood, extruded rails, weld seams, with a kilohertz of profiles.',
    'Robot bin picking and depalletizing with structured-light or stereo cameras.',
    'Time-of-flight cameras for logistics: measuring parcel volume and locating pallets.',
    'Dimensioning and shape checks of castings, turbine blades and car bodies by fringe projection.'
  ],
  history: 'Triangulation is as old as surveying. Laser-line profile sensors grew in the 1980s and 1990s as CMOS cameras became fast, and structured light followed with digital projectors. Time-of-flight cameras, with a distance in every pixel, reached industry in the 2000s.',
  sources: [
    'R. Hartley and A. Zisserman, *Multiple View Geometry in Computer Vision* (Cambridge University Press, 2nd ed. 2004) — stereo geometry.',
    'J. Geng, "Structured-light 3D surface imaging: a tutorial", *Advances in Optics and Photonics* 3 (2011) 128–160 — fringe projection.',
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH, 2nd ed. 2018) — 3-D reconstruction.'
  ],
  sim: 'mv-3d'
}
);
