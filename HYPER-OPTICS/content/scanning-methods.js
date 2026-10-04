/* HYPER-OPTICS · content/scanning-methods.js — scanning devices and methods: what scanning is, raster and vector scans,
 * galvanometer, polygon, resonant and MEMS scanners, acousto-optic and electro-optic deflectors, Risley prisms,
 * scan lenses and the f-theta condition, resolvable spots, scan distortion, control and synchronisation.
 * Simulations are in sims/scanning-methods.js (prefix sm-).
 */
Hyper.add(

/* ================================================================ what scanning is */
{
  id: 'what-scanning-is', parent: 'scanning-methods', title: 'What scanning is', level: 1,
  short: 'A scanner builds a picture, or draws one, in time: a single spot of light, or a single line of sight, is swept over a scene in a planned pattern while one detector records, or one beam writes, position by position. It trades time for pixels, which is why it works where a camera chip cannot.',
  keywords: ['scanning', 'scanner', 'scan', 'spot scanning', 'raster', 'pixel dwell time', 'staring array', 'pre-objective scanning', 'post-objective scanning', 'line scan', 'whisk-broom', 'push-broom', 'single-pixel detector', 'scan angle'],
  prereq: ['law-of-reflection', 'plane-mirror-images', 'how-a-pixel-detects-light'],
  related: ['raster-and-vector-scanning', 'galvanometer-scanners', 'scan-lenses-and-f-theta', 'resolvable-spots', 'area-scan-and-line-scan-cameras', 'flatbed-and-document-scanners', 'laser-scanning-microscopes', 'lidar', 'laser-printers'],
  body: `
Read a page through a cardboard tube, sliding it from word to word, and your memory assembles the page one small patch at a time. A **scanner** does the same with light. A single spot of light, or a single line of sight, is swept over a scene in a planned pattern, and the picture is built up in *time* instead of being captured in one instant by millions of detectors at once.

### Reading and writing
- **Reading (imaging).** A detector looks at one spot at a time and its signal is stored against the position of the spot: the flatbed scanner, the laser-scanning microscope, lidar, the bar-code reader, the line sensors that sweep over the ground from a satellite.
- **Writing (drawing).** The beam itself is switched on and off as it sweeps: the laser printer, the laser marker, the laser-show projector, the electron beam of an old television tube.

The optics are the same either way, because a light path works backwards as well as forwards.

### Time per pixel
If a picture has $N$ pixels along each line, is drawn at $f_L$ lines a second, and a fraction $\\eta$ of every line is active, each pixel gets the **dwell time**

$$\\tau = \\frac{\\eta}{f_L\\,N}$$

A television-style scan of 15 734 lines a second with 640 pixels per line, 80 % of each line active, leaves 79 ns per pixel. A laser-scanning microscope that records 512 × 512 pixels once a second leaves 3 to 4 µs, depending on how much of each line it uses. A short dwell means few photons per pixel; this, as much as the mirror, sets how fast a scanner can go.

### Scanning or staring?
| | Staring array (a camera chip) | Scanning |
|---|---|---|
| Detectors | millions, all exposed together | one, a few, or one line |
| Resolution set by | pixel count and pitch | spot size and scan range ([[resolvable-spots]]) |
| Moving parts | none | a mirror, a prism, or a sound wave |
| Time | one exposure | a whole frame time |
| It wins when | a good array exists and speed matters | no array exists at that wavelength, one very sensitive detector is needed, the field is large, or the beam must write |

A **line-scan** camera is half a scanner: a row of pixels that waits for the object, or the spacecraft, to supply the second direction ([[area-scan-and-line-scan-cameras]]). A *whisk-broom* imager sweeps a spot across the track; a *push-broom* imager uses a whole row of detectors and the motion of its platform.

### Where the scanner sits
A scanner needs a lens to turn its angle into a position and to focus. If the lens comes **after** the mirror (**pre-objective**, or pre-lens, scanning) a parallel beam is steered and a [[scan-lenses-and-f-theta|scan lens]] focuses it onto a flat field; the lens is large and special. If the lens comes **before** the mirror (**post-objective** scanning) the beam is already converging when it is steered, so the lens sees only the axis and can be simple, but the focus lies on a sphere centred on the mirror. A beam focused 300 mm from the mirror and scanned 20° meets a flat plane 19.3 mm beyond its focus: 29 Rayleigh ranges for a spot of 15 µm radius at 1064 nm. Post-objective scanning therefore suits small fields, curved surfaces, or a lens that moves to refocus.

> [!key] A scanner trades time for pixels: one spot sweeps a pattern and a position-stamped signal builds the picture, or the picture is written. The dwell time $\\tau = \\eta/(f_L N)$ limits how fast it can go; where the lens sits decides whether the field is flat.
`,
  ideas: [
    'A scanner builds its picture in time, one spot (or one line) after another, instead of capturing it all at once like a camera chip.',
    'Scanners read (detector looks at the spot) and write (the beam is modulated); the optics are the same because light paths reverse.',
    'Dwell time per pixel, τ = η/(f_L N), is a few microseconds for a microscope and tens of nanoseconds for video.',
    'Scanning wins where no detector array exists, one very sensitive detector is needed, the field is large, or the beam must draw.',
    'A scan lens after the mirror gives a flat field; a lens before it keeps the lens simple but focuses on a curved surface.'
  ],
  pitfalls: [
    'A scanner must have moving parts — Many do, but a sound wave in a crystal can steer the beam with nothing moving ([[acousto-optic-and-electro-optic-deflectors]]), and a line-scan camera uses the motion of the object itself.',
    '"Scanner" means a flatbed document scanner — That is one example. The word covers any spot-by-spot system, from barcode readers and lidar to laser microscopes, and writing as well as reading.',
    'A scanned picture has no pixels — It is sampled just like a camera picture: the number of independent points is set by the spot size and the scan range, and the sample clock cuts the line into pixels.',
    'A scanner is only as fast as its mirror — The detector and the light collected per pixel limit it just as much: at 79 ns per pixel a weak signal drowns in noise however fast the mirror turns.'
  ],
  terms: [
    { term: 'Scanning', also: ['scan', 'beam scanning'], def: 'Moving a spot of light, or a line of sight, over a scene or a target in a planned pattern, so that a picture is read or written position by position.' },
    { term: 'Dwell time', also: ['pixel dwell time', 'pixel time'], def: 'The time the spot spends on one pixel, τ = η/(f_L N). It sets how much light a detector collects per pixel and how fast the electronics must be.' },
    { term: 'Staring array', also: ['focal-plane array', 'area sensor'], def: 'A detector with many pixels exposed together, such as a camera chip. The opposite of a scanned system, which has one detector or one line of them.' },
    { term: 'Pre-objective scanning', also: ['pre-lens scanning', 'scanner before the objective'], def: 'The scanner is in front of the focusing lens: a parallel beam is steered and the scan lens focuses it on a flat field. The lens must work for beams at every angle.' },
    { term: 'Post-objective scanning', also: ['post-lens scanning', 'scanner after the objective'], def: 'The lens comes first and the scanner steers the converging beam. The lens can be simple, but the focus lies on a sphere centred on the scanner.' },
    { term: 'Push-broom and whisk-broom', def: 'Two ways to image the ground from a moving platform: a whole row of detectors held across the track and swept by the motion (push-broom), or one detector swept across the track by a mirror (whisk-broom).' }
  ],
  formulas: [
    {
      name: 'Pixel dwell time',
      expr: 'tau = eta/(fl*N)', tex: '\\tau = \\frac{\\eta}{f_L\\,N}',
      vars: {
        tau: { name: 'dwell time per pixel', q: 'time', unit: 'µs', tex: '\\tau' },
        eta: { name: 'active share of each line', q: 'ratio', unit: '%', value: 80, min: 1, max: 100, tex: '\\eta' },
        fl: { name: 'line rate', q: 'frequency', unit: 'kHz', value: 15.734, tex: 'f_L' },
        N: { name: 'pixels per line', int: true, value: 640, min: 1, tex: 'N' }
      },
      solveFor: 'tau',
      note: 'Lines per second times pixels per line is the pixel rate; the active share η takes away the turnaround time.',
      stories: { tau: 'A scan draws {fl} lines a second with {N} pixels on each, and {eta} of every line is active. How long does the spot dwell on each pixel?', fl: 'Each of the {N} pixels on a line must be lit for {tau}, and {eta} of every line is active. What line rate is needed?' }
    },
    {
      name: 'Focus error on a flat plane (post-objective scan)',
      expr: 'dz = f*(1/cos(theta) - 1)', tex: '\\Delta z = f\\left(\\frac{1}{\\cos\\theta} - 1\\right)',
      vars: {
        dz: { name: 'distance of the flat plane beyond the focus', q: 'length', unit: 'mm', tex: '\\Delta z' },
        f: { name: 'distance from the mirror to the focus on the axis', q: 'length', unit: 'mm', value: 300 },
        theta: { name: 'scan angle', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'dz',
      note: 'The focus travels on a sphere of radius f around the mirror; a flat target at distance f on the axis is farther away off axis.',
      stories: { dz: 'A beam is focused {f} from the scanning mirror and steered {theta} off axis. How far beyond the focus is a flat plane placed {f} from the mirror?' }
    }
  ],
  examples: [
    {
      title: 'Dwell time of a microscope frame',
      q: 'A laser-scanning microscope records a picture of 512 × 512 pixels once every second. Each sweep is one line and 80 % of the sweep is used. How long does the spot dwell on each pixel?',
      steps: [
        'One frame has 512 lines in 1 s, so the line rate is $f_L = 512$ per second.',
        { text: 'The dwell time is', tex: '\\tau = \\frac{\\eta}{f_L N} = \\frac{0.8}{512 \\times 512\\ \\mathrm{s^{-1}}} = 3.05\\ \\mu\\mathrm{s}' }
      ],
      a: 'About 3 µs per pixel. A faster picture shortens this in proportion: at 30 frames a second it would be 0.1 µs.'
    },
    {
      title: 'A flat plane behind a post-objective scan',
      q: 'A 1064 nm laser beam is focused to a waist of radius 15 µm at 300 mm from a scanning mirror, then steered by 20°. A flat plate stands 300 mm from the mirror, square to the axis. How far from the focus is the plate when the beam is 20° off axis, compared with the beam\'s Rayleigh range?',
      steps: [
        { text: 'The focus is 300 mm along the ray, the plate is where the ray meets the plane:', tex: '\\Delta z = f\\left(\\frac{1}{\\cos 20°} - 1\\right) = 300\\ \\mathrm{mm}\\times 0.0642 = 19.3\\ \\mathrm{mm}' },
        { text: 'The Rayleigh range of the beam is', tex: 'z_R = \\frac{\\pi w_0^2}{\\lambda} = \\frac{\\pi (15\\ \\mu\\mathrm{m})^2}{1.064\\ \\mu\\mathrm{m}} = 0.66\\ \\mathrm{mm}' }
      ],
      a: 'The plate is 19.3 mm beyond the focus, about 29 Rayleigh ranges: hopelessly out of focus. With this tight a spot the focus has to follow the plate, or the plate has to be curved.'
    }
  ],
  quiz: [
    { q: 'Which of these does NOT produce a scan?', choices: ['A galvanometer mirror turning', 'A sound wave in a crystal changing frequency', 'An object moving past a fixed line sensor', 'Enlarging the aperture of a fixed lens'], a: 3, why: 'A scan needs a spot or a line of sight that moves over the scene. A galvo and an acousto-optic deflector steer the beam; an object moving past a line sensor supplies the second direction by itself. A bigger aperture moves nothing.' },
    { q: 'A scan draws 2 000 lines a second with 1 000 pixels on each, the whole line active. How long is the spot on each pixel, in µs?', answer: 0.5, unit: 'µs', why: '$\\tau = 1/(f_L N) = 1/(2000 \\times 1000\\ \\mathrm{s^{-1}}) = 0.5\\ \\mu\\mathrm{s}$.' },
    { q: 'In post-objective scanning the beam is focused on a flat plane at every scan angle.', a: false, why: 'The lens focuses before the mirror turns the beam, so the focus follows a sphere centred on the mirror. A flat target is farther from the mirror off axis than on axis, so the spot goes out of focus.' },
    { q: 'What is the best reason to scan with a single detector rather than use a camera chip?', choices: ['It is always faster', 'No array exists at the wavelength, or one very sensitive detector is needed', 'It needs no optics', 'It has no distortion'], a: 1, why: 'Scanning is slower per picture and adds mirrors and distortion. Its strength is that one detector can be cooled, made very sensitive or built from a material no array exists for, and that the beam can write as well as read.' },
    { q: 'A frame of 400 lines is drawn 25 times a second. What is the line rate, in lines per second?', answer: 10000, why: '$f_L = 400 \\times 25 = 10\\,000$ lines a second.' }
  ],
  applications: [
    'Flatbed and sheet-fed document scanners move a line sensor past the page ([[flatbed-and-document-scanners]]).',
    'Laser-scanning microscopes build a section of a cell one spot at a time ([[laser-scanning-microscopes]]).',
    'Lidar sweeps a laser pulse across the scene and times each return ([[lidar]]).',
    'Laser printers write the page on a drum with one spot swept by a spinning mirror ([[laser-printers]]).',
    'Earth-observation satellites image the ground with line sensors swept by their own motion.'
  ],
  history: 'Scanning is as old as television. Paul Nipkow patented a spinning disc with a spiral of holes in 1884 to scan a scene one spot at a time, and mechanical television of the 1920s used such discs. The cathode-ray tube replaced them with an electron beam scanned by magnetic fields in the 1930s. Mirror scanners for laser beams came after the laser itself, in the 1960s.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — the standard reference on scanner types and scan optics.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — scanner types and their common figures of merit.',
    'J. B. Pawley (ed.), *Handbook of Biological Confocal Microscopy* (Springer) — pixel dwell time and scanning in microscopes.'
  ],
  sim: 'sm-build-picture'
},

/* ================================================================ raster and vector */
{
  id: 'raster-and-vector-scanning', parent: 'scanning-methods', title: 'Raster and vector scanning', level: 1,
  short: 'A raster scan sweeps the spot line by line over the whole field, whether or not there is anything to see; a vector scan steers it only along the outline it needs. Raster is simple and fills areas, vector is quick for sparse figures, and both lose time whenever the spot has to turn round or jump.',
  keywords: ['raster scan', 'vector scan', 'flyback', 'retrace', 'bidirectional scan', 'unidirectional scan', 'serpentine', 'fast axis', 'slow axis', 'line rate', 'frame rate', 'blanking', 'random access scan', 'hatching'],
  prereq: ['what-scanning-is', 'galvanometer-scanners'],
  related: ['polygon-scanners', 'resonant-and-mems-scanners', 'acousto-optic-and-electro-optic-deflectors', 'laser-marking-and-cutting-heads', 'laser-projection-and-displays', 'scanner-control-and-synchronisation'],
  body: `
Two patterns cover most scanning. In a **raster** the spot sweeps along a line (the **fast axis**), steps a little across (the **slow axis**) and sweeps again, until the whole field is covered, like reading a page. In a **vector** scan the spot goes only where the picture is: along a letter, an outline, a mark to be made, with the beam off for the jumps between strokes.

### Raster: lines, flyback and two directions
- **Unidirectional.** The spot writes or reads in one direction only and must then **fly back**. Flyback is blanked: the beam is off, or the data ignored. In analogue television a line lasted about 64 µs, of which about 52 µs carried picture.
- **Bidirectional** (serpentine). Forward and return sweeps are both used, so no time is lost. But the lines of the two directions must match: any lag between command and mirror shows up as a comb-like edge, so the electronics add a timing offset between forward and reverse lines. A resonant mirror ([[resonant-and-mems-scanners]]) is always bidirectional.
- **Frame rate.** A frame of $M$ lines drawn at $f_L$ lines a second repeats at $F = f_L/M$; with 525 lines and 15 734 lines a second that is 30 frames a second.

### Vector: time follows the path, not the area
A raster travels every line of the field, even where there is nothing to see. For a field 100 mm wide with lines 0.1 mm apart the spot covers 1000 lines of 100 mm, a path of 100 m. At an assumed 10 m/s that takes 10 s. The outline of a 100 mm square is 0.4 m: 40 ms, **250 times** faster. Vector scanning is what laser markers and laser-show projectors do, and what random-access deflectors ([[acousto-optic-and-electro-optic-deflectors]]) are made for.

The price is the **jumps**. After each stroke the mirror must move to the next start and settle, which takes a fraction of a millisecond ([[galvanometer-scanners]]); and a filled area must be **hatched** in lines after all, which is a small raster inside the outline.

### Other patterns
Mixtures exist: a spiral (one fast circle, a slowly growing radius), a Lissajous figure from two sinusoidal mirrors ([[resonant-and-mems-scanners]]), a rosette from two turning prisms ([[risley-prisms-and-beam-steering]]), and a raster over a chosen window only, which a scanning microscope uses to image a small region quickly.

| | Raster | Vector |
|---|---|---|
| Time grows with | area ÷ line pitch | path length |
| Good for | pictures, filled areas, imaging | outlines, text, sparse marks, tracking |
| Mirror motion | steady sweeps, simple drive | many starts, stops and jumps |
| Examples | television, flatbed scan, microscope image | laser marker, laser show, vector display |

> [!key] A raster visits the whole field line by line and spends time on turnaround and flyback; a vector scan visits only the path it needs and spends time on jumps. Choose by how much of the field has something in it.
`,
  ideas: [
    'A raster sweeps a fast axis (the line) and steps a slow axis, covering the whole field.',
    'Unidirectional raster blanks the flyback; bidirectional raster uses both sweeps but needs the forward and return lines aligned.',
    'Frame rate = line rate ÷ lines per frame.',
    'A vector scan goes only along the outline, so its time grows with path length, not area.',
    'Vector scanning pays in jumps and settling time; a filled shape still needs hatching, a raster inside the outline.'
  ],
  pitfalls: [
    'Raster scanning is always slower than vector — Only for sparse pictures. A full photograph has something at every point and a raster is the natural way to draw it.',
    'Flyback wastes time in every scanner — Only in unidirectional scans. A bidirectional (serpentine) scan uses both sweeps, at the cost of keeping forward and return lines in register.',
    'The spot moves at constant speed in a raster — It does so only with a sawtooth drive. A resonant mirror moves sinusoidally, fast in the middle and slow at the edges ([[resonant-and-mems-scanners]]).',
    'A vector scan draws as fast as the mirror can move — The jumps between strokes and the settling after each one often take more time than the strokes themselves in a figure made of many short lines.'
  ],
  terms: [
    { term: 'Raster scan', also: ['raster'], def: 'A scan in lines: the spot sweeps along a line, steps across, sweeps again, and so covers the whole field in a fixed order.' },
    { term: 'Fast axis and slow axis', def: 'The fast axis is the direction of the lines, swept many times a second; the slow axis is the step from line to line, which advances once per line and repeats once per frame.' },
    { term: 'Flyback', also: ['retrace'], def: 'The return of the spot to the start of the next line in a unidirectional raster. The beam is blanked and no picture is read or written.' },
    { term: 'Bidirectional scan', also: ['serpentine scan', 'boustrophedon'], def: 'A raster that uses both the forward and the return sweeps of each line. It loses no time to flyback but must keep the two directions in register.' },
    { term: 'Vector scan', also: ['random-access scan', 'stroke scan'], def: 'A scan that steers the spot along the outline of the picture and jumps, with the beam off, between strokes.' },
    { term: 'Hatching', def: 'Filling a closed outline with parallel lines, as laser markers do: a small raster inside a vector figure.' }
  ],
  formulas: [
    {
      name: 'Path length of a raster',
      expr: 'L = W*H/p', tex: 'L = \\frac{W\\,H}{p}',
      vars: {
        L: { name: 'path length', q: 'length', unit: 'm', tex: 'L' },
        W: { name: 'field width (length of a line)', q: 'length', unit: 'mm', value: 100, tex: 'W' },
        H: { name: 'field height', q: 'length', unit: 'mm', value: 100, tex: 'H' },
        p: { name: 'line pitch', q: 'length', unit: 'mm', value: 0.1, tex: 'p' }
      },
      solveFor: 'L',
      note: 'H/p lines, each W long; the flyback and the jumps from line to line are not counted.',
      stories: { L: 'A raster covers a field {W} wide and {H} high with lines {p} apart. How far does the spot travel?', p: 'A raster over a {W} by {H} field must not travel more than {L}. What is the coarsest line pitch?' }
    },
    {
      name: 'Time to draw a path',
      expr: 'T = L/v', tex: 'T = \\frac{L}{v}',
      vars: {
        T: { name: 'time', q: 'time', unit: 's', tex: 'T' },
        L: { name: 'path length', q: 'length', unit: 'm', value: 100, tex: 'L' },
        v: { name: 'spot speed', q: 'speed', unit: 'm/s', value: 10, tex: 'v' }
      },
      solveFor: 'T',
      note: 'At a constant spot speed. Turnarounds, jumps and settling add to it.',
      stories: { T: 'A spot travels {L} at {v}. How long does it take?', v: 'A path of {L} must be drawn in {T}. What spot speed does that need?' }
    },
    {
      name: 'Frame rate of a raster',
      expr: 'F = fl/M', tex: 'F = \\frac{f_L}{M}',
      vars: {
        F: { name: 'frame rate', q: 'frequency', unit: 'Hz', tex: 'F' },
        fl: { name: 'lines (sweeps) per second', q: 'frequency', unit: 'kHz', value: 15.734, tex: 'f_L' },
        M: { name: 'lines per frame', int: true, value: 525, min: 1, tex: 'M' }
      },
      solveFor: 'F',
      note: 'For a bidirectional scan count every sweep, forward or return, as a line.',
      stories: { F: 'A scanner makes {fl} lines a second and a frame has {M} lines. How many frames a second?' }
    }
  ],
  examples: [
    {
      title: 'Raster against vector',
      q: 'A laser marker must outline a square 100 mm on a side. Compare a raster over the 100 mm field with lines 0.1 mm apart to a vector scan of the outline, both at a spot speed of 10 m/s (turnarounds and jumps ignored).',
      steps: [
        { text: 'The raster has 1000 lines of 100 mm:', tex: 'L = \\frac{100\\ \\mathrm{mm}\\times 100\\ \\mathrm{mm}}{0.1\\ \\mathrm{mm}} = 100\\ \\mathrm{m} \\quad\\Rightarrow\\quad T = \\frac{100\\ \\mathrm{m}}{10\\ \\mathrm{m/s}} = 10\\ \\mathrm{s}' },
        { text: 'The outline is four sides:', tex: 'L = 0.4\\ \\mathrm{m} \\quad\\Rightarrow\\quad T = 40\\ \\mathrm{ms}' }
      ],
      a: 'The raster takes 10 s, the vector scan 40 ms: 250 times faster, because it never visits the empty interior.'
    },
    {
      title: 'Television frame rate',
      q: 'An analogue television scan makes 15 734 lines a second and draws 525 lines per frame. What is the frame rate, and how long does one line last?',
      steps: [
        { text: 'The frame rate is', tex: 'F = \\frac{f_L}{M} = \\frac{15\\,734}{525} = 29.97\\ \\mathrm{Hz}' },
        { text: 'One line lasts', tex: '\\frac{1}{15\\,734\\ \\mathrm{Hz}} = 63.6\\ \\mu\\mathrm{s}' }
      ],
      a: '29.97 frames a second (the "30 Hz" of the North American system), 63.6 µs per line, of which about 52 µs carries picture.'
    }
  ],
  quiz: [
    { q: 'Which pattern wastes no time on flyback?', choices: ['Unidirectional raster', 'Bidirectional (serpentine) raster', 'A raster with a long blanking time', 'None: every raster has flyback'], a: 1, why: 'A bidirectional raster draws on the forward and on the return sweep. Its price is that the two directions must line up.' },
    { q: 'A raster covers a 50 mm × 50 mm field with lines 0.05 mm apart. How long is the path in metres?', answer: 50, unit: 'm', why: '$L = WH/p = 50\\times 50/0.05\\ \\mathrm{mm} = 50\\,000\\ \\mathrm{mm} = 50$ m.' },
    { q: 'A vector scan always beats a raster for drawing a picture.', a: false, why: 'A vector scan wins when the picture is sparse. For a filled photograph a raster visits every point once; a vector path covering the same area would also be a raster, with extra jumps.' },
    { q: 'A bidirectional scan shows a comb-like edge on a vertical line. What is the most likely cause?', choices: ['The beam is too wide', 'Forward and return lines are not in register: the mirror lags its command', 'The line rate is too low', 'The field is too large'], a: 1, why: 'The mirror lags its drive signal by a small time. In a unidirectional scan every line has the same shift, so the picture just moves; in a bidirectional scan the shift reverses sign every line, so alternate lines are displaced against each other. A timing offset corrects it.' },
    { q: 'A spot travels 2 m in 0.25 s. What is its speed, in m/s?', answer: 8, unit: 'm/s', why: '$v = L/T = 2/0.25 = 8$ m/s.' }
  ],
  applications: [
    'Television tubes and the first computer displays: raster for pictures, vector for line drawings.',
    'Laser markers and engravers: vector strokes for outlines and text, raster or hatch for filled areas ([[laser-marking-and-cutting-heads]]).',
    'Laser-show projectors: vector scanning draws figures with a few thousand points a second ([[laser-projection-and-displays]]).',
    'Scanning microscopes: a raster over a chosen window to image part of a field quickly.',
    'Document scanners and printers: strict raster, one line after the other.'
  ],
  history: 'Early computer graphics drew outlines directly with a vector display: Ivan Sutherland’s Sketchpad of 1963 steered an electron beam along the lines of a drawing. Raster displays took over in the 1970s and 1980s, when memory became cheap enough to hold a whole picture and so to drive a beam that visits every point whatever the picture holds. Laser marking went the other way and kept the vector scan, since a mark covers a tiny part of the field.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — scan patterns and line and frame formats.',
    'J. D. Foley, A. van Dam, S. K. Feiner and J. F. Hughes, *Computer Graphics: Principles and Practice* (Addison-Wesley) — vector and raster displays.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — scanning formats and duty cycles.'
  ],
  sim: 'sm-raster-vector'
},

/* ================================================================ galvanometer scanners */
{
  id: 'galvanometer-scanners', parent: 'scanning-methods', title: 'Galvanometer scanners', level: 2,
  short: 'A galvanometer scanner is a small mirror on a motor that turns only a few tens of degrees, held by a position detector in a closed servo loop. The beam turns by twice the mirror’s angle. It points a laser to any place in a field within a fraction of a millisecond, which makes it the standard for markers, projectors and microscopes.',
  keywords: ['galvanometer', 'galvo', 'galvo scanner', 'mirror scanner', 'X-Y scan head', 'step response', 'settling time', 'optical angle', 'mechanical angle', 'closed loop', 'servo', 'laser scanner', 'limited rotation motor'],
  prereq: ['what-scanning-is', 'raster-and-vector-scanning', 'law-of-reflection'],
  related: ['polygon-scanners', 'resonant-and-mems-scanners', 'scan-lenses-and-f-theta', 'scan-distortion-and-correction', 'scanner-control-and-synchronisation', 'laser-marking-and-cutting-heads', 'motors:servo-motors', 'motors:servo-tuning', 'physics:damped-oscillations'],
  body: `
A **galvanometer scanner**, or galvo, is a mirror on the shaft of a motor that turns only a few tens of degrees, not round and round. A current in the coil turns the shaft by an angle proportional to the current, as in the moving-coil meter the word comes from. A detector reports where the shaft is, and a servo amplifier adjusts the current until the shaft is where it has been told to be. A galvo can hold any angle, sweep a raster, or jump to a new position, so it suits both raster and vector scans.

### The angle doubles
Turn a mirror by $\\alpha$ and its normal turns by $\\alpha$ too; the reflected ray turns by twice that:

$$\\theta = 2\\alpha$$

A galvo with ±10° of mechanical travel therefore steers the beam over ±20° optical, 40° in all. A datasheet may quote either angle, so check which. Typical galvos have mechanical ranges of roughly ±10° to ±20°.

### Closed loop
The position detector (capacitive or optical) and the servo give repeatability of a few microradians. A jump is a **step response**: the mirror accelerates, overshoots a little and rings down. Tuning the loop (with feed-forward and filters on top of the gains, see [[motors:servo-tuning|servo tuning]]) trades speed against ringing. The time to settle within a given error after a small step ranges from about 0.1 ms for a mirror a few millimetres across to a millisecond or more for one 30 mm across. Big jumps take longer, because the drive current saturates.

### Why the mirror should be small
Inertia limits the speed. If a mirror keeps its proportions, doubling its size multiplies its moment of inertia by about 32 (the fifth power), so large mirrors are slow and need big motors. Choose the smallest mirror that passes the beam without clipping it; its size sets the beam diameter $D$, and $D$ together with the angle fixes how many spots the scan can resolve ([[resolvable-spots]]).

### Two mirrors make an X–Y head
Two galvos on perpendicular axes, close together, steer the beam in two directions. The beam walks across the second mirror as the first turns, so the second is larger; and because the beam passes the two mirrors in turn, and their pivots cannot be in the same place, the field is distorted ([[scan-distortion-and-correction]]). A scan lens ([[scan-lenses-and-f-theta]]) then turns the angles into a flat field. A third axis, a lens that moves along the beam, adds focus control for 3-D parts.

With an f-theta lens of focal length $f$ the spot moves at

$$v = 2 f\\,\\omega$$

when the mirror turns at the angular speed $\\omega$ (in rad/s).

> [!key] A galvo is a servo-held mirror on a limited-rotation motor. The beam turns by twice the mirror angle; small mirrors settle in a fraction of a millisecond, large ones are slower because their inertia grows as the fifth power of their size.
`,
  ideas: [
    'A galvanometer scanner is a mirror on a limited-rotation motor with a position detector in a closed servo loop.',
    'The reflected beam turns by twice the mirror angle: θ_optical = 2α_mechanical.',
    'Small mirrors settle in about 0.1 ms; large ones take a millisecond or more, because inertia rises about as the fifth power of the mirror size.',
    'Two galvos on perpendicular axes form an X–Y head; the second mirror is larger because the beam walks across it.',
    'Spot speed behind an f-theta lens is v = 2 f ω.'
  ],
  pitfalls: [
    'Turn the mirror by 10° and the beam moves 10° — The beam turns by 20°. The doubling comes from the law of reflection; that is why datasheets say "optical" or "mechanical" angle.',
    'A bigger mirror is always better — A bigger mirror passes a bigger beam and so resolves more spots, but it is much slower and costs more. Use the smallest that does not clip the beam.',
    'The mirror goes where it is told instantly — It follows a step with a settling time of 0.1 ms or more. Marking controllers insert delays so that the laser is switched on only when the mirror has arrived.',
    'A galvo can only scan slowly — It scans fast enough for most pictures: hundreds of lines a second with a sawtooth or triangular drive. Resonant mirrors and polygons are faster still, but cannot jump or stop.'
  ],
  terms: [
    { term: 'Galvanometer scanner', also: ['galvo', 'galvo mirror', 'limited-rotation scanner'], def: 'A mirror on a motor that turns only a limited angle, with a position detector and a servo loop. It is steered by a command signal to any angle within its range.' },
    { term: 'Mechanical angle and optical angle', also: ['scan angle', 'optical scan angle'], def: 'The mechanical angle is how far the mirror turns; the optical angle is how far the beam turns, twice as much. Always check which a specification gives.' },
    { term: 'Step response', also: ['settling time', 'small-step response'], def: 'How the mirror follows a sudden change of command: the time to come within a stated error of the new position, and the overshoot on the way.' },
    { term: 'X–Y scan head', also: ['two-mirror head', 'scan head'], def: 'Two galvanometer mirrors on perpendicular axes that steer a beam to any point of a field.' },
    { term: 'Position detector', also: ['position sensor', 'feedback sensor'], def: 'A capacitive or optical sensor on the shaft that reports its angle to the servo loop.' }
  ],
  derivation: {
    title: 'Why a mirror turns the beam by twice its own angle',
    intro: 'A ray meets a flat mirror at an angle of incidence $i$ measured from the normal. The law of reflection gives a reflected ray at the same angle on the other side of the normal.',
    steps: [
      { text: 'The angle between the incident and the reflected ray is therefore', tex: '\\theta = 2i' },
      { text: 'Turn the mirror by $\\alpha$ with the incident ray fixed. The normal turns by $\\alpha$, so the angle of incidence becomes $i + \\alpha$ and the deviation becomes', tex: '\\theta\' = 2(i + \\alpha) = \\theta + 2\\alpha' },
      { text: 'The reflected ray has turned by', tex: '\\theta\' - \\theta = 2\\alpha' }
    ]
  },
  formulas: [
    {
      name: 'Optical angle of a galvo',
      expr: 'theta = 2*alpha', tex: '\\theta = 2\\alpha',
      vars: {
        theta: { name: 'optical scan angle (the beam)', q: 'angle', unit: '°', tex: '\\theta' },
        alpha: { name: 'mechanical angle (the mirror)', q: 'angle', unit: '°', value: 10, min: 0, max: 45, tex: '\\alpha' }
      },
      solveFor: 'theta',
      note: 'For a turn of the mirror about an axis perpendicular to the plane of the beam.',
      stories: { theta: 'A galvanometer mirror turns by {alpha}. Through what angle does the reflected beam turn?', alpha: 'A beam must sweep through {theta}. How far must the mirror turn?' }
    },
    {
      name: 'Position on a flat target without a scan lens',
      expr: 'x = L*tan(2*alpha)', tex: 'x = L\\tan 2\\alpha',
      vars: {
        x: { name: 'distance of the spot from the axis', q: 'length', unit: 'mm', tex: 'x' },
        L: { name: 'distance from the mirror to the target', q: 'length', unit: 'mm', value: 300, tex: 'L' },
        alpha: { name: 'mechanical angle', q: 'angle', unit: '°', value: 10, min: 0, max: 40, tex: '\\alpha' }
      },
      solveFor: 'x',
      note: 'A mirror alone sweeps the beam at a constant angular rate, so the spot goes faster and faster towards the edge of a flat target.',
      stories: { x: 'A galvo mirror at {L} from a flat target turns by {alpha}. How far from the centre does the spot land?' }
    },
    {
      name: 'Spot speed behind an f-theta lens',
      expr: 'v = 2*f*omega', tex: 'v = 2 f\\,\\omega',
      vars: {
        v: { name: 'spot speed on the target', q: 'speed', unit: 'm/s', tex: 'v' },
        f: { name: 'focal length of the scan lens', q: 'length', unit: 'mm', value: 160 },
        omega: { name: 'angular speed of the mirror', q: 'angvel', unit: 'rad/s', value: 10, tex: '\\omega' }
      },
      solveFor: 'v',
      note: 'The spot position is y = fθ with θ = 2α, so its speed is 2f times the mirror’s angular speed.',
      stories: { v: 'A mirror turns at {omega} behind a scan lens of focal length {f}. How fast does the spot move?', omega: 'The spot must move at {v} behind a scan lens of focal length {f}. How fast must the mirror turn?' }
    }
  ],
  examples: [
    {
      title: 'The size of a field',
      q: 'A galvo head has ±12° of mechanical travel and an f-theta lens of focal length 160 mm. How wide is the field?',
      steps: [
        { text: 'The optical half-angle is twice the mechanical one:', tex: '\\theta_{\\max} = 2 \\times 12° = 24° = 0.419\\ \\mathrm{rad}' },
        { text: 'An f-theta lens puts the spot at $y = f\\theta$:', tex: 'y_{\\max} = 160\\ \\mathrm{mm}\\times 0.419 = 67.0\\ \\mathrm{mm}' }
      ],
      a: 'The field is ±67.0 mm, 134 mm wide.'
    },
    {
      title: 'How fast does the spot move?',
      q: 'The mirror of that head sweeps from −10° to +10° in 20 ms at a constant rate. How fast does the spot move across the field?',
      steps: [
        'The mirror turns 20° in 20 ms: $\\omega = 1000\\ ^\\circ/\\mathrm{s} = 17.45$ rad/s.',
        { text: 'The spot speed is', tex: 'v = 2 f \\omega = 2 \\times 0.160\\ \\mathrm{m} \\times 17.45\\ \\mathrm{rad/s} = 5.58\\ \\mathrm{m/s}' }
      ],
      a: '5.6 m/s. Faster marking needs a mirror that turns faster, a longer lens, or both.'
    }
  ],
  quiz: [
    { q: 'A galvo mirror turns by 8°. By how much does the reflected beam turn?', choices: ['4°', '8°', '16°', '64°'], a: 2, why: 'The reflected beam turns by twice the mirror angle: 16°.' },
    { q: 'An f-theta lens of focal length 100 mm sits behind a galvo with ±10° of mechanical travel. What is the half-height of the field, in mm?', answer: 34.9, unit: 'mm', why: 'The optical half-angle is 20° = 0.349 rad, and $y = f\\theta = 100\\times 0.349 = 34.9$ mm.' },
    { q: 'Why do large galvo mirrors settle more slowly than small ones?', choices: ['Their glass is softer', 'Their moment of inertia grows about as the fifth power of the size', 'They are made of heavier metal', 'The beam is more powerful'], a: 1, why: 'Mass grows as size cubed and the moment of inertia as mass times size squared, so about the fifth power. The same motor accelerates a big mirror much more slowly.' },
    { q: 'A galvo can hold a fixed angle indefinitely, because its servo loop keeps correcting the position.', a: true, why: 'Unlike a resonant mirror or a polygon, which must keep moving, a galvo is a position servo: it holds any angle within its range as long as it is powered.' },
    { q: 'The mirror of a head behind a 200 mm f-theta lens turns at 5 rad/s. How fast does the spot move, in m/s?', answer: 2, unit: 'm/s', why: '$v = 2f\\omega = 2\\times 0.2\\times 5 = 2$ m/s.' }
  ],
  applications: [
    'Laser marking and engraving heads, behind an f-theta lens ([[laser-marking-and-cutting-heads]]).',
    'Laser-scanning and multiphoton microscopes, which steer the focus through the objective ([[laser-scanning-microscopes]]).',
    'Laser shows and projectors: two small mirrors draw figures at tens of thousands of points a second ([[laser-projection-and-displays]]).',
    'Stereolithography and metal powder-bed 3-D printers, which write each layer.',
    'Optical coherence tomography, which sweeps a beam over the retina or the skin ([[optical-coherence-tomography]]).'
  ],
  history: 'The first galvanometers of the 1820s detected electric current by the turn of a magnetized needle. Lord Kelvin’s mirror galvanometer of 1858, developed for the first transatlantic telegraph cable, made the small turn visible by reflecting a spot of light from a tiny mirror on the moving coil. Moving-coil mirrors steering a laser beam appeared in the 1960s, soon after the laser itself.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — the chapters on galvanometric and resonant scanners.',
    'G. F. Marshall (ed.), *Laser Beam Scanning: Opto-Mechanical Devices, Systems, and Data Storage Optics* (Marcel Dekker) — scanner dynamics and servo design.',
    'E. Hecht, *Optics*, the chapter on the propagation of light — reflection from a plane mirror.'
  ],
  sim: 'sm-galvo'
},

/* ================================================================ polygon scanners */
{
  id: 'polygon-scanners', parent: 'scanning-methods', title: 'Polygon scanners', level: 2,
  short: 'A polygon scanner is a block with mirror facets on its sides, spun at a steady speed. Each facet sweeps the beam across the field and the next facet starts it again, so the line rate is the number of facets times the revolutions per second. It is the workhorse of laser printers: fast and steady, but with a fixed angle and no way to stop.',
  keywords: ['polygon scanner', 'rotating polygon', 'polygon mirror', 'facet', 'line rate', 'duty cycle', 'scan efficiency', 'pyramidal error', 'facet tilt', 'wobble', 'division error', 'overfilled facet', 'laser printer scanner', 'spinning mirror'],
  prereq: ['what-scanning-is', 'raster-and-vector-scanning', 'galvanometer-scanners'],
  related: ['scan-lenses-and-f-theta', 'scan-distortion-and-correction', 'scanner-control-and-synchronisation', 'laser-printers', 'barcode-scanners', 'resonant-and-mems-scanners'],
  body: `
A **polygon scanner** is a prism with mirror facets on its sides, spun at a steady speed by a motor. A fixed beam strikes one facet; as the polygon turns, the reflected beam sweeps across the field. When that facet turns away the next one arrives and the beam starts again at the beginning of the line. There is no turnaround, only the steady rotation of a motor.

### The numbers
While one facet carries the beam the polygon turns by $360°/n$ and the reflected beam, as with any mirror, turns twice as far. The optical angle swept per facet is therefore

$$\\theta = \\frac{720°}{n}$$

and the line rate is the number of facets times the revolutions per second, $f_L = n\\,r$. Eight facets at 30 000 rpm give 4000 lines a second.

| Facets | Optical angle per facet | Lines a second at 30 000 rpm |
|---|---|---|
| 4 | 180° | 2 000 |
| 6 | 120° | 3 000 |
| 8 | 90° | 4 000 |
| 12 | 60° | 6 000 |
| 24 | 30° | 12 000 |

More facets give more lines for the same rotation speed but a smaller angle per facet. Only part of that angle is usable.

### Duty cycle
The beam has a diameter $D$ and each facet a width $w$. A beam that meets the facet at an angle of incidence $i$ covers a footprint $D/\\cos i$ of it, and the scan is usable only while the whole footprint lies on one facet. That gives a first estimate of the **duty cycle** (scan efficiency)

$$\\eta \\approx 1 - \\frac{D}{w\\cos i}$$

A polygon with 8 facets 15.3 mm wide and a 4 mm beam that is turned by 90° (so that $i = 45°$ at mid-scan) has a footprint of 5.7 mm and a duty cycle of about 63 %; a beam falling square on the facet would give 74 %. A larger polygon has wider facets and a better duty cycle but is heavier and harder to spin fast; an **overfilled** design lets the beam be wider than the facet and accepts the lost light.

### What a printer needs
In a [[laser-printers|laser printer]] an A4 page at 600 dpi has 7016 lines. At 30 pages a minute that is 3508 lines a second: 8 facets must turn at 26 300 rpm, 6 facets at 35 100 rpm. Printer polygons turn at tens of thousands of revolutions a minute, in air bearings or ball bearings, and are enclosed against noise and dust.

### Errors that belong to the polygon
- **Pyramidal error.** A facet tilted by $\\varepsilon$ along the shaft moves its line sideways, across the scan, by $2\\varepsilon f$ at a scan lens of focal length $f$. 10″ of tilt is 19 µm at $f = 200$ mm, almost half a 600 dpi pixel (42 µm): visible bands. Printers cancel it with a cylinder lens that images each facet on the drum in the cross-scan direction, so tilt no longer moves the spot.
- **Wobble.** The shaft itself tilts as it turns, which repeats once a revolution.
- **Division error.** Facets not spaced exactly $360°/n$ move the start of the line along the scan; the start-of-scan detector fixes it ([[scanner-control-and-synchronisation]]).

A polygon cannot jump, stop or change its angle: it is a steady raster engine, the opposite of a [[galvanometer-scanners|galvo]], and its beam diameter and angle still fix how many spots it resolves ([[resolvable-spots]]). For a flat field its light goes through an [[scan-lenses-and-f-theta|f-theta lens]].

> [!key] A polygon scanner turns the beam by 720°/n per facet and draws n lines per revolution. It gives the steadiest, fastest raster of any mirror, at a fixed angle and with errors that belong to each facet.
`,
  ideas: [
    'Each facet sweeps the beam through 720°/n; the polygon draws n lines per revolution.',
    'Line rate = number of facets × revolutions per second.',
    'The beam is usable only while its whole footprint lies on one facet: duty cycle ≈ 1 − D/(w cos i).',
    'Facet tilt (pyramidal error) moves a line sideways by 2εf; a cylinder lens in the system cancels most of it.',
    'A polygon is a steady raster engine; it cannot stop, jump, or change its scan angle.'
  ],
  pitfalls: [
    'A polygon can be made to sweep any angle — The angle per facet is fixed by the facet count, 720°/n, and the beam can use only part of it.',
    'More facets are always better — They give more lines per revolution, but a smaller scan angle per facet, and each facet gets narrower for a polygon of the same size.',
    'All facets are identical — Each has its own small tilt and spacing error; unless they are corrected they show up as banding or ragged line starts.',
    'The speed of rotation sets the speed of the spot — The speed at the target is the optical sweep rate times the lens focal length: 2 f times the polygon’s angular speed with an f-theta lens.'
  ],
  terms: [
    { term: 'Polygon scanner', also: ['rotating polygon', 'polygon mirror', 'spinning-mirror scanner'], def: 'A polygon-shaped block with a flat mirror on each side, rotated at constant speed. Each facet sweeps the beam across the field once per pass.' },
    { term: 'Facet', def: 'One flat mirror face of a polygon scanner. It carries the beam through one sweep of the line.' },
    { term: 'Duty cycle', also: ['scan efficiency', 'scan duty'], def: 'The share of the facet time during which the whole beam lies on one facet and the scan is usable; the rest is lost as the beam crosses an edge.' },
    { term: 'Pyramidal error', also: ['facet tilt error', 'cross-scan error'], def: 'The tilt of a facet along the shaft, so that each facet writes its line a little too high or too low. It shows as banding.' },
    { term: 'Wobble', def: 'A tilt of the polygon’s axis as it rotates, which moves every line in a repeating pattern, once per revolution.' },
    { term: 'Overfilled facet', def: 'A design in which the beam is wider than one facet. The facet acts as the aperture, giving nearly full duty cycle in a small polygon at the cost of discarding part of the light.' }
  ],
  formulas: [
    {
      name: 'Line rate of a polygon',
      expr: 'fl = n*r', tex: 'f_L = n\\,r',
      vars: {
        fl: { name: 'line rate', q: 'frequency', unit: 'Hz', tex: 'f_L' },
        n: { name: 'number of facets', int: true, value: 8, min: 3, tex: 'n' },
        r: { name: 'revolutions per second', q: 'frequency', unit: 'rpm', value: 30000, tex: 'r' }
      },
      solveFor: 'fl',
      note: 'Every facet that passes the beam draws one line.',
      stories: { fl: 'A polygon with {n} facets turns at {r}. How many lines a second does it draw?', r: 'A polygon with {n} facets must draw {fl}. How fast must it turn?' }
    },
    {
      name: 'Optical angle swept by one facet',
      expr: 'theta = 4*pi/n', tex: '\\theta = \\frac{4\\pi}{n} = \\frac{720°}{n}',
      vars: {
        theta: { name: 'optical angle per facet', q: 'angle', unit: '°', tex: '\\theta' },
        n: { name: 'number of facets', int: true, value: 8, min: 3, tex: 'n' }
      },
      solveFor: 'theta',
      note: 'The usable part is smaller, by the duty cycle.',
      stories: { theta: 'A polygon scanner has {n} facets. Through what optical angle does one facet sweep the beam?' }
    },
    {
      name: 'Duty cycle of an underfilled facet',
      expr: 'eta = 1 - D/(w*cos(i))', tex: '\\eta \\approx 1 - \\frac{D}{w\\cos i}',
      vars: {
        eta: { name: 'duty cycle', q: 'ratio', unit: '%', min: 0, max: 100, tex: '\\eta' },
        D: { name: 'beam diameter', q: 'length', unit: 'mm', value: 4, tex: 'D' },
        w: { name: 'facet width', q: 'length', unit: 'mm', value: 15.3, tex: 'w' },
        i: { name: 'angle of incidence on the facet at mid-scan', q: 'angle', unit: '°', value: 45, min: 0, max: 80, tex: 'i' }
      },
      solveFor: 'eta',
      note: 'A first estimate for a beam smaller than the facet. A beam falling square on the facet (i = 0) has the footprint D.',
      stories: { eta: 'A {D} beam meets facets {w} wide at an angle of incidence of {i}. What is the duty cycle, to a first estimate?' }
    },
    {
      name: 'Line displacement from a facet tilt',
      expr: 'dy = 2*eps*f', tex: '\\Delta y = 2\\varepsilon f',
      vars: {
        dy: { name: 'sideways shift of the line', q: 'length', unit: 'µm', tex: '\\Delta y' },
        eps: { name: 'tilt of the facet', q: 'angle', unit: '″', value: 10, tex: '\\varepsilon' },
        f: { name: 'focal length of the scan lens', q: 'length', unit: 'mm', value: 200 }
      },
      solveFor: 'dy',
      note: 'Without a cylinder lens to cancel it. The beam turns by twice the tilt of the mirror.',
      stories: { dy: 'A facet is tilted by {eps} along the shaft and the scan lens has a focal length of {f}. How far is its line displaced?' }
    }
  ],
  examples: [
    {
      title: 'Speed of a printer polygon',
      q: 'A laser printer prints A4 pages (297 mm long) at 600 dpi, 30 pages a minute. Its scan lines run across the page. How many lines a second must it draw, and how fast must a polygon with 8 facets turn?',
      steps: [
        { text: 'The page has $297\\ \\mathrm{mm}/42.33\\ \\mu\\mathrm{m} = 7016$ lines. At 30 pages a minute (0.5 a second):', tex: 'f_L = 7016 \\times 0.5\\ \\mathrm{s^{-1}} = 3508\\ \\mathrm{s^{-1}}' },
        { text: 'Eight facets draw eight lines a revolution:', tex: 'r = \\frac{3508}{8} = 438.5\\ \\mathrm{rev/s} = 26\\,300\\ \\mathrm{rpm}' }
      ],
      a: '3508 lines a second and 26 300 rpm (the gaps between pages would raise it a little).'
    },
    {
      title: 'A tilted facet',
      q: 'One facet of a polygon is tilted by 10 arc-seconds relative to the others. The scan lens has $f = 200$ mm. How far is its line shifted, and how does it compare with the 42.3 µm pixel of a 600 dpi printer?',
      steps: [
        'The tilt is $10″ = 48.5$ µrad; the beam turns by twice that, 97 µrad.',
        { text: 'At the focal plane', tex: '\\Delta y = 2\\varepsilon f = 2 \\times 48.5\\ \\mu\\mathrm{rad}\\times 200\\ \\mathrm{mm} = 19.4\\ \\mu\\mathrm{m}' }
      ],
      a: '19.4 µm: nearly half a pixel. One line in eight printed that much off the others makes visible bands, which is why cross-scan correction is built in.'
    }
  ],
  quiz: [
    { q: 'A polygon has 6 facets. Through what optical angle does one facet sweep the beam?', choices: ['60°', '120°', '180°', '360°'], a: 1, why: 'The facet turns by 360°/6 = 60° and the beam turns twice as much: 120° optical (before the duty cycle takes some away).' },
    { q: 'A polygon with 10 facets turns at 12 000 rpm. How many lines a second does it draw?', answer: 2000, unit: 'Hz', why: '12 000 rpm is 200 rev/s; ten facets give $10\\times 200 = 2000$ lines a second.' },
    { q: 'Doubling the number of facets of a polygon of the same size and speed doubles the angle each facet sweeps.', a: false, why: 'The angle per facet is 720°/n: doubling n halves it. The line rate doubles, but each line sweeps half the angle.' },
    { q: 'What does a cylinder lens that images each facet onto the drum do?', choices: ['It widens the beam', 'It makes the line rate steadier', 'It cancels the effect of facet tilt in the cross-scan direction', 'It removes flyback'], a: 2, why: 'With the facet and the drum conjugate in the cross-scan direction, a tilted facet turns the beam but the spot stays at the same height on the drum.' },
    { q: 'A 3 mm beam falls square on facets 12 mm wide (incidence 0°). Estimate the duty cycle, in per cent.', answer: 75, unit: '%', why: '$\\eta \\approx 1 - D/(w\\cos i) = 1 - 3/12 = 0.75$.' }
  ],
  applications: [
    'Laser printers and photocopiers write each page line by line with a polygon ([[laser-printers]]).',
    'Supermarket bar-code scanners: facets at different tilts make the crossing scan lines ([[barcode-scanners]]).',
    'Computer-to-plate and imagesetting machines that write printing plates and film.',
    'Laser line scanners that inspect moving sheet and web materials ([[line-scan-inspection]]).'
  ],
  history: 'Rotating mirrors have scanned light since the nineteenth century, when Foucault spun a mirror to time light over a short path. Polygon scanners entered printing with the first laser printers of the early 1970s and became the standard as laser diodes and fast, cheap motor bearings arrived.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — the chapters on polygon scanners and on scan optics.',
    'L. Beiser, *Laser Scanning Notebook* (SPIE Press) — polygon geometry, duty cycle and facet errors.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — pyramidal error and its compensation.'
  ],
  sim: 'sm-polygon'
},

/* ================================================================ resonant and MEMS scanners */
{
  id: 'resonant-and-mems-scanners', parent: 'scanning-methods', title: 'Resonant and MEMS scanners', level: 2,
  short: 'A resonant scanner swings a mirror on a spring at the frequency where it naturally rings, so it sweeps very fast and steadily on very little power, but always as a sine wave: fast in the middle, slow at the edges. A MEMS scanner is the same idea etched in silicon, in one or two axes, and traces Lissajous patterns.',
  keywords: ['resonant scanner', 'MEMS mirror', 'MEMS scanner', 'micro-mirror', 'torsion mirror', 'sinusoidal scan', 'Lissajous', 'two-axis scanner', 'resonance', 'video-rate scanning', 'pico projector', 'comb drive'],
  prereq: ['galvanometer-scanners', 'raster-and-vector-scanning', 'physics:simple-harmonic-motion'],
  related: ['polygon-scanners', 'resolvable-spots', 'scan-distortion-and-correction', 'scanner-control-and-synchronisation', 'laser-projection-and-displays', 'lidar', 'laser-scanning-microscopes', 'physics:driven-oscillations'],
  body: `
A **resonant scanner** is a mirror on a stiff torsion spring, driven at the frequency where it rings naturally. At resonance a small push each cycle builds up a large swing, so the mirror oscillates fast and very steadily on little power. Its sweep is a **sine wave** of fixed frequency, usually several kilohertz. A **MEMS scanner** is the same thing made small: a mirror a millimetre or two across, etched in silicon on torsion beams, driven by electrostatic, magnetic, thermal or piezoelectric forces.

### A sinusoid, not a sawtooth
The angle follows $\\theta(t) = \\theta_0\\sin(2\\pi f t)$, so the spot is fastest at the middle of the sweep and stops at both ends. Three things follow.
- **Always bidirectional.** Both sweeps carry picture, so an 8 kHz mirror draws 16 000 lines a second: 512 lines at 31 frames a second, video rate for a microscope.
- **Uneven speed.** Pixels clocked evenly in time come out narrow near the edges and wide in the middle. Using the central 80 % of the amplitude takes 59 % of the time, and the spot at its ends moves at 60 % of the central speed. The fix is to clock pixels by position (a table of sample times), to resample afterwards, or to use only the middle ([[scan-distortion-and-correction]]).
- **Fixed frequency.** The amplitude can be changed, which zooms the field, but the frequency belongs to the spring and the mass and drifts with temperature, so the electronics lock to it and the mirror supplies the timing ([[scanner-control-and-synchronisation]]). A resonant mirror cannot stop or jump.

### Two axes and Lissajous patterns
A MEMS mirror may turn about one axis or two. In one common design the fast axis is resonant and the slow axis is driven in steps or as a slow ramp, which draws a raster. In another both axes resonate at different frequencies. The spot then draws a **Lissajous figure**

$$x = \\sin(2\\pi p\\,t + \\varphi), \\qquad y = \\sin(2\\pi q\\,t)$$

which closes after one frame when $p$ and $q$ are whole numbers with no common factor. The figure crosses itself, covers the field unevenly at first, and fills in as the frame gets longer; the choice of $p$ and $q$ trades the frame time against the gaps between lines.

### Small mirror, small beam
These mirrors are fast because they are small, and a small mirror takes a small beam. A 1 mm beam at 650 nm swept over a total optical angle of 40° resolves about 850 spots ([[resolvable-spots]]), against thousands for a 10 mm galvo beam. For many jobs, such as pointers, projectors and bar-code readers, that is plenty.

> [!key] A resonant mirror moves as a sine: fast in the middle, stopped at the ends, at a frequency fixed by its spring. That gives kilohertz line rates and low power, at the price of uneven pixel spacing, a fixed frequency and no random access. MEMS makes the same mirror small enough for one or two axes on a chip.
`,
  ideas: [
    'A resonant scanner swings a mirror at its natural frequency, so a small drive gives a large, steady sinusoidal sweep of several kilohertz.',
    'Both sweeps carry picture, so the line rate is twice the mirror frequency: 8 kHz gives 16 000 lines a second.',
    'The spot is fastest in the middle and stops at the ends: pixels must be clocked by position or the edges come out squeezed.',
    'The frequency is fixed by the spring and the mass; only the amplitude can be changed.',
    'MEMS mirrors are one- or two-axis silicon versions; two resonant axes trace Lissajous figures.'
  ],
  pitfalls: [
    'A resonant scanner sweeps at constant speed — It moves as a sine: the speed varies from the maximum at the centre to zero at the ends, so uniform time steps give uneven pixels.',
    'You can set its speed to any value — The frequency is fixed by its stiffness and inertia. You can change the amplitude (the field size) and little else.',
    'A MEMS mirror is a small galvo — A galvo is a servo that can hold any angle. A resonant MEMS mirror cannot hold a position; it only swings.',
    'A Lissajous scan fills the field evenly — It crosses itself and is dense at the edges, where the spot slows and turns; coverage depends on the frequency ratio and on how long you wait.'
  ],
  terms: [
    { term: 'Resonant scanner', also: ['resonant galvanometer', 'resonant mirror'], def: 'A mirror on a torsion spring driven at its natural frequency, so that it oscillates sinusoidally at a fixed frequency (kilohertz) with a large angle and little power.' },
    { term: 'MEMS scanner', also: ['MEMS mirror', 'micro-mirror', 'micromirror scanner'], def: 'A mirror, a millimetre or two across, made in silicon on torsion flexures and driven electrostatically, magnetically, thermally or piezoelectrically, in one or two axes.' },
    { term: 'Sinusoidal scan', also: ['sine scan'], def: 'A sweep whose angle follows a sine of time: the spot moves fastest at the centre and stops at the extremes.' },
    { term: 'Lissajous figure', also: ['Lissajous scan', 'Lissajous pattern'], def: 'The curve traced by a spot driven sinusoidally on two axes at different frequencies. It closes when the frequencies are in a ratio of whole numbers.' },
    { term: 'Resonance', also: ['natural frequency', 'resonant frequency'], def: 'The frequency at which a mass on a spring swings most easily. Driven there, a small repeated push builds a large oscillation.' }
  ],
  formulas: [
    {
      name: 'Line rate of a resonant scanner',
      expr: 'fl = 2*f', tex: 'f_L = 2f',
      vars: {
        fl: { name: 'lines per second', q: 'frequency', unit: 'Hz', tex: 'f_L' },
        f: { name: 'mirror frequency', q: 'frequency', unit: 'kHz', value: 8, tex: 'f' }
      },
      solveFor: 'fl',
      note: 'Both the forward and the return sweep make a line.',
      stories: { fl: 'A resonant mirror oscillates at {f}. How many lines a second does it draw, using both sweeps?' }
    },
    {
      name: 'Greatest speed of a sinusoidal sweep',
      expr: 'wmax = 2*pi*f*th0', tex: '\\omega_{\\max} = 2\\pi f\\,\\theta_0',
      vars: {
        wmax: { name: 'greatest angular speed of the mirror', q: 'angvel', unit: 'rad/s', tex: '\\omega_{\\max}' },
        f: { name: 'mirror frequency', q: 'frequency', unit: 'kHz', value: 8, tex: 'f' },
        th0: { name: 'amplitude of the mirror angle', q: 'angle', unit: '°', value: 10, min: 0, max: 45, tex: '\\theta_0' }
      },
      solveFor: 'wmax',
      note: 'At the middle of the sweep. The beam moves twice as fast as the mirror.',
      stories: { wmax: 'A mirror swings through ±{th0} at {f}. How fast does it turn at the middle of its sweep?' }
    },
    {
      name: 'Share of the time in the central part of the sweep',
      expr: 's = 2*asin(u)/pi', tex: 's = \\frac{2}{\\pi}\\arcsin u',
      vars: {
        s: { name: 'share of the sweep time', q: 'ratio', unit: '%', tex: 's' },
        u: { name: 'fraction of the amplitude used', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'u' }
      },
      solveFor: 's',
      note: 'For the middle of a sine sweep, |position| ≤ u times the amplitude.',
      stories: { s: 'Only the middle {u} of the amplitude of a sinusoidal sweep is used. What share of the sweep time does that take?' }
    },
    {
      name: 'Speed at the edge of the used part',
      expr: 'r = sqrt(1 - u^2)', tex: 'r = \\sqrt{1 - u^2}',
      vars: {
        r: { name: 'speed at the edge ÷ speed at the centre', q: 'ratio', unit: '%', tex: 'r' },
        u: { name: 'fraction of the amplitude used', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: 'u' }
      },
      solveFor: 'r',
      note: 'Pixels clocked evenly in time shrink by this factor at the edge of the used part.',
      stories: { r: 'The middle {u} of a sinusoidal sweep is used. How fast does the spot move at the edge of that part compared with the centre?' }
    }
  ],
  examples: [
    {
      title: 'Video-rate scanning',
      q: 'A resonant mirror oscillates at 8 kHz and both sweeps are used. How many lines a second does it draw, and how many frames a second of 512 lines?',
      steps: [
        { text: 'Two lines per cycle:', tex: 'f_L = 2 \\times 8000\\ \\mathrm{Hz} = 16\\,000\\ \\mathrm{s^{-1}}' },
        { text: 'A frame of 512 lines repeats at', tex: 'F = \\frac{16\\,000}{512} = 31.25\\ \\mathrm{Hz}' }
      ],
      a: '16 000 lines a second and 31 frames a second, about video rate. A galvo drawing the same lines with a sawtooth would be near its limit at a few hundred lines a second.'
    },
    {
      title: 'Using the middle of a sine',
      q: 'Only the middle 80 % of the amplitude of a sinusoidal sweep is used. What share of the time does that take, and how much slower does the spot move at the ends of the used part than at the centre?',
      steps: [
        { text: 'With $u = 0.8$ the share of time is', tex: 's = \\frac{2}{\\pi}\\arcsin 0.8 = 0.590' },
        { text: 'and the speed at the edge relative to the middle is', tex: 'r = \\sqrt{1 - 0.8^2} = 0.60' }
      ],
      a: '59 % of the time is used, and the edge pixels clocked at equal time steps are 60 % as wide as those in the middle, unless the clock is corrected.'
    }
  ],
  quiz: [
    { q: 'A resonant mirror oscillates at 4 kHz and both sweeps are used. How many lines a second does it draw?', answer: 8000, unit: 'Hz', why: 'Each cycle has a forward and a return sweep: $2\\times 4000 = 8000$ lines a second.' },
    { q: 'Where on its sweep does the spot of a sinusoidally driven mirror move fastest?', choices: ['At the two ends', 'At the middle', 'It is the same everywhere', 'Where the beam is brightest'], a: 1, why: 'The angle is a sine of time, so its rate is a cosine: greatest at the middle of the sweep, zero at the turning points.' },
    { q: 'You can zoom a resonant scanner by changing its frequency.', a: false, why: 'Its frequency is fixed by the spring and the mass. The amplitude is what is adjusted to change the field size.' },
    { q: 'Why does a resonant scanner usually give a smaller beam than a galvo scanner?', choices: ['Resonant mirrors are smaller, because a big mirror cannot resonate at a high frequency', 'Resonant scanners use shorter wavelengths', 'The beam is always cut by the spring', 'Resonant scanners work only with LEDs'], a: 0, why: 'A fast resonance needs a stiff, light mirror. Small mirrors take small beams, and the number of spots grows with the angle times the beam diameter.' },
    { q: 'Only the middle 50 % of a sine sweep is used. What share of the time is that, in per cent?', answer: 33.3, unit: '%', why: '$s = (2/\\pi)\\arcsin 0.5 = (2/\\pi)(\\pi/6) = 1/3$.' }
  ],
  applications: [
    'Video-rate laser-scanning microscopes use an 8 kHz-class resonant mirror for the fast axis ([[laser-scanning-microscopes]]).',
    'Pico projectors and head-up displays draw their picture with a MEMS mirror and three laser colours ([[laser-projection-and-displays]]).',
    'Compact lidar and bar-code readers use small MEMS or resonant mirrors ([[lidar]]).',
    'Endoscopic and handheld scanning probes, where the whole scanner must fit in a pen-sized tube.'
  ],
  history: 'Resonant mirrors on torsion bars were built from the 1960s as steady scanners that needed little power. Silicon micromachining opened the way to mirrors etched in a chip: Kurt Petersen’s torsion mirror in silicon at IBM, around 1980, was one of the first. MEMS scanners became common in projectors and sensors from the 2000s.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — resonant scanners and MEMS scanners.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — sinusoidal scanning and its linearization.'
  ],
  sim: 'sm-resonant'
},

/* ================================================================ acousto-optic and electro-optic deflectors */
{
  id: 'acousto-optic-and-electro-optic-deflectors', parent: 'scanning-methods', title: 'Acousto-optic and electro-optic deflectors', level: 2,
  short: 'A sound wave in a crystal is a moving grating of dense and rare layers. Light diffracted from it leaves at an angle that follows the sound frequency, so changing the frequency steers the beam within microseconds, with nothing moving but the sound. Electro-optic deflectors do the same with voltage, over far smaller angles.',
  keywords: ['acousto-optic deflector', 'AOD', 'Bragg cell', 'acousto-optic modulator', 'AOM', 'Bragg angle', 'time-bandwidth product', 'access time', 'electro-optic deflector', 'EOD', 'Pockels effect', 'TeO2', 'non-mechanical scanning', 'random access scanning'],
  prereq: ['the-grating-equation', 'what-diffraction-is', 'raster-and-vector-scanning'],
  related: ['galvanometer-scanners', 'resolvable-spots', 'optical-isolators-and-modulators', 'laser-scanning-microscopes', 'risley-prisms-and-beam-steering', 'physics:sound-waves', 'physics:doppler-effect'],
  body: `
A sound wave in a crystal squeezes and stretches the material in layers a few micrometres apart, and where the material is denser the refractive index is higher. To light, that travelling pattern is a **diffraction grating** ([[the-grating-equation]]) whose spacing is the sound wavelength $\\Lambda = v/f$ ($v$ the speed of sound in the crystal, $f$ the frequency fed to the transducer). Light that meets it at the right angle is diffracted into one strong beam, and *the angle follows the sound frequency*. That is an **acousto-optic deflector** (AOD), also called a Bragg cell.

### The Bragg condition
A thick grating diffracts efficiently only when the beam meets its planes at the **Bragg angle**:

$$\\sin\\theta_B = \\frac{\\lambda}{2\\Lambda} = \\frac{\\lambda f}{2v}$$

and the diffracted beam leaves at $2\\theta_B$ from the undiffracted one. For tellurium dioxide (a slow shear wave, $v \\approx 650$ m/s) at $f = 100$ MHz and $\\lambda = 633$ nm the sound wavelength is 6.5 µm, $\\theta_B = 2.79°$ and the deflection is 5.58°. Changing the frequency by $\\Delta f$ steers the beam by $\\Delta\\theta = \\lambda\\,\\Delta f/v$. The diffracted light is also shifted in frequency by $f$ (a Doppler shift), and the fraction diffracted rises with the radio-frequency power, up to 80 % or more, so the same device is a fast modulator ([[optical-isolators-and-modulators]]).

### How many spots, and how fast?
The sound takes a time $\\tau = D/v$ to cross a beam of diameter $D$; that is the **access time**, the delay before a new frequency has filled the beam. The number of resolvable spots ([[resolvable-spots]]) is the **time–bandwidth product**:

$$N = \\Delta f\\,\\tau = \\frac{\\Delta f\\,D}{v}$$

A 5 mm beam in TeO₂ swept over 50 MHz has $\\tau = 7.7$ µs, scans 2.8° and resolves 385 spots. Compare a [[galvanometer-scanners|galvo]]: thousands of spots, but 100 µs or more to move. An AOD gives random access in microseconds, with nothing to wear out, and no inertia.

### Limits
- **Small angle and few spots**: a few degrees, hundreds of spots. A slower crystal (TeO₂) gives more angle and more spots than fused silica (v ≈ 6 km/s), at the price of stronger absorption of the sound.
- **Efficiency falls across the band** and the beam is elongated and dispersed in colour if it is not narrow-band.
- **Heat and drive**: the radio-frequency drive heats the crystal, which limits the optical power and the sweep.

### Electro-optic deflectors
In an **electro-optic deflector** (EOD) a voltage changes the index of a crystal such as lithium niobate or KTP through the Pockels effect, producing a gradient or a prism-shaped region. The deflection is only a few milliradians for hundreds of volts, but it responds in nanoseconds, with no sound-transit time. Both belong to the family of beam steering without moving parts, with optical phased arrays and liquid-crystal gratings ([[risley-prisms-and-beam-steering]]).

> [!key] An acousto-optic deflector steers light with a sound-wave grating: deflection ≈ λf/v, spots = bandwidth × access time. It gives hundreds of spots and microsecond access in a few degrees; an electro-optic deflector is faster still but moves the beam by milliradians.
`,
  ideas: [
    'A sound wave in a crystal acts as a travelling diffraction grating of spacing Λ = v/f.',
    'The diffracted beam leaves at 2θ_B, with sin θ_B = λf/(2v): changing the frequency steers the beam.',
    'The number of resolvable spots is the bandwidth times the access time, N = Δf D/v; the access time is the sound’s transit time across the beam.',
    'No moving parts and microsecond access, but only a few degrees and hundreds of spots.',
    'Electro-optic deflectors are faster (nanoseconds) but deflect by only milliradians.'
  ],
  pitfalls: [
    'The sound makes the crystal into a mirror — It makes a refractive-index grating. The light is diffracted, not reflected, and the diffracted beam is shifted in frequency by the sound frequency.',
    'An AOD can scan as far as a galvo — It covers a few degrees at most; an AOD scans quickly, not widely.',
    'Any beam size works — A larger beam resolves more spots, but takes longer to fill with the new frequency, so the access time rises with it: N and τ both grow with D.',
    'It diffracts all the light — Efficiency is at most 80 to 90 % and depends on the radio-frequency power and frequency. The rest stays in the undiffracted beam.'
  ],
  terms: [
    { term: 'Acousto-optic deflector', also: ['AOD', 'Bragg cell', 'acousto-optic scanner'], def: 'A crystal with a transducer that launches a sound wave through it. Light diffracted from the wave is deflected by an angle that follows the sound frequency.' },
    { term: 'Bragg angle', def: 'The angle between the beam and the sound-wave planes at which a thick grating diffracts efficiently: sin θ_B = λ/(2Λ). The diffracted beam leaves at twice this angle from the straight-through beam.' },
    { term: 'Time–bandwidth product', also: ['number of resolvable spots'], def: 'The frequency range swept times the access time, Δf·τ. It equals the number of resolvable spots of an acousto-optic deflector.' },
    { term: 'Access time', also: ['transit time'], def: 'The time the sound takes to cross the beam, τ = D/v. A new deflection is complete only when the new frequency fills the whole beam.' },
    { term: 'Electro-optic deflector', also: ['EOD', 'Pockels deflector'], def: 'A crystal whose refractive index is changed by a voltage (the Pockels effect) in a gradient or a prism-shaped region, deflecting a beam by a few milliradians in nanoseconds.' },
    { term: 'Acousto-optic modulator', also: ['AOM'], def: 'The same crystal used to switch or vary the diffracted light with the radio-frequency power, instead of steering it.' }
  ],
  formulas: [
    {
      name: 'Bragg condition',
      expr: 'sin(thetaB) = lambda*f/(2*v)', tex: '\\sin\\theta_B = \\frac{\\lambda f}{2 v}',
      vars: {
        thetaB: { name: 'Bragg angle', q: 'angle', unit: '°', min: 0, max: 30, tex: '\\theta_B' },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        f: { name: 'sound frequency', q: 'frequency', unit: 'MHz', value: 100 },
        v: { name: 'speed of sound in the crystal', q: 'speed', unit: 'm/s', value: 650 }
      },
      solveFor: 'thetaB',
      note: 'The diffracted beam leaves at 2θ_B from the straight-through beam. The wavelength is the one in air, since the angle is measured outside the crystal.',
      stories: { thetaB: 'Light of {lambda} meets a sound wave of {f} in a crystal where sound travels at {v}. At what angle to the sound planes is it diffracted most strongly?' }
    },
    {
      name: 'Deflection range',
      expr: 'dtheta = lambda*df/v', tex: '\\Delta\\theta = \\frac{\\lambda\\,\\Delta f}{v}',
      vars: {
        dtheta: { name: 'range of deflection', q: 'angle', unit: 'mrad', tex: '\\Delta\\theta' },
        lambda: { name: 'wavelength in air', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        df: { name: 'frequency sweep', q: 'frequency', unit: 'MHz', value: 50, tex: '\\Delta f' },
        v: { name: 'speed of sound in the crystal', q: 'speed', unit: 'm/s', value: 650 }
      },
      solveFor: 'dtheta',
      note: 'The scan angle in air for small angles.',
      stories: { dtheta: 'An acousto-optic deflector is swept by {df} for light of {lambda}, in a crystal with sound speed {v}. Through what angle does the beam scan?' }
    },
    {
      name: 'Resolvable spots (time–bandwidth product)',
      expr: 'N = df*D/v', tex: 'N = \\frac{\\Delta f\\,D}{v}',
      vars: {
        N: { name: 'number of resolvable spots', tex: 'N' },
        df: { name: 'frequency sweep', q: 'frequency', unit: 'MHz', value: 50, tex: '\\Delta f' },
        D: { name: 'beam diameter', q: 'length', unit: 'mm', value: 5 },
        v: { name: 'speed of sound in the crystal', q: 'speed', unit: 'm/s', value: 650 }
      },
      solveFor: 'N',
      note: 'The same as bandwidth times access time: the frequency range, counted in units of the inverse transit time.',
      stories: { N: 'An acousto-optic deflector with a sweep of {df}, a beam of {D} and a sound speed of {v}. How many spots can it resolve?', D: 'A deflector with a {df} sweep and sound speed {v} must resolve {N} spots. What beam diameter does it need?' }
    },
    {
      name: 'Access time',
      expr: 'ta = D/v', tex: '\\tau = \\frac{D}{v}',
      vars: {
        ta: { name: 'access time', q: 'time', unit: 'µs', tex: '\\tau' },
        D: { name: 'beam diameter', q: 'length', unit: 'mm', value: 5 },
        v: { name: 'speed of sound in the crystal', q: 'speed', unit: 'm/s', value: 650 }
      },
      solveFor: 'ta',
      note: 'Smaller beams give faster access and fewer spots.',
      stories: { ta: 'Sound crosses a {D} beam at {v}. What is the access time?' }
    }
  ],
  examples: [
    {
      title: 'A tellurium dioxide deflector',
      q: 'An AOD of tellurium dioxide (sound speed 650 m/s) deflects a 633 nm beam of 5 mm diameter. The drive sweeps 50 MHz. Find the sweep angle, the access time and the number of resolvable spots.',
      steps: [
        { text: 'The sweep angle is', tex: '\\Delta\\theta = \\frac{\\lambda\\,\\Delta f}{v} = \\frac{633\\times 10^{-9}\\times 50\\times 10^{6}}{650} = 48.7\\ \\mathrm{mrad} = 2.79°' },
        { text: 'The sound crosses the beam in', tex: '\\tau = \\frac{D}{v} = \\frac{5\\ \\mathrm{mm}}{650\\ \\mathrm{m/s}} = 7.7\\ \\mu\\mathrm{s}' },
        { text: 'and the number of spots is', tex: 'N = \\Delta f\\,\\tau = 50\\ \\mathrm{MHz}\\times 7.7\\ \\mu\\mathrm{s} = 385' }
      ],
      a: 'A 2.8° scan of 385 spots, each new position taking 7.7 µs to settle. A galvo would give more spots but take about ten times as long to move.'
    },
    {
      title: 'The Bragg angle at 532 nm',
      q: 'At what angle must a 532 nm beam meet the sound planes of a 80 MHz wave in a crystal with a sound speed of 650 m/s, and how far is the diffracted beam deflected?',
      steps: [
        { text: 'The Bragg condition gives', tex: '\\sin\\theta_B = \\frac{532\\times 10^{-9}\\times 80\\times 10^{6}}{2\\times 650} = 0.0327 \\quad\\Rightarrow\\quad \\theta_B = 1.88°' },
        'The diffracted beam leaves at twice that angle from the straight-through beam.'
      ],
      a: '$\\theta_B = 1.88°$ and a deflection of 3.75° from the undiffracted beam.'
    }
  ],
  quiz: [
    { q: 'What turns a sound wave in a crystal into something that can steer light?', choices: ['It heats the crystal', 'It makes a periodic refractive-index pattern that acts as a diffraction grating', 'It makes the crystal conduct', 'It bends the crystal into a mirror'], a: 1, why: 'The density, and with it the refractive index, varies along the sound wave with period Λ = v/f. Light diffracts from that grating, and its angle follows the frequency.' },
    { q: 'A TeO₂ deflector (650 m/s) has a 4 mm beam and a 40 MHz sweep. How many resolvable spots, to the nearest whole number?', answer: 246, why: '$N = \\Delta f D/v = 40\\times 10^6\\times 0.004/650 = 246$.' },
    { q: 'Doubling the beam diameter in an acousto-optic deflector doubles both the number of spots and the access time.', a: true, why: 'N = Δf D/v and τ = D/v are both proportional to D: a larger beam resolves more spots but takes longer to fill with the new frequency.' },
    { q: 'What is the main advantage of an acousto-optic deflector over a galvanometer?', choices: ['A much larger scan angle', 'A much larger number of spots', 'Access in microseconds, with no moving parts', 'No need for a radio-frequency drive'], a: 2, why: 'An AOD has a small angle (a few degrees) and hundreds of spots. What it does better is speed: a new position within a transit time of microseconds, with nothing to accelerate.' },
    { q: 'Light of 633 nm meets a 100 MHz sound wave in a crystal with a sound speed of 650 m/s. What is the sound wavelength, in µm?', answer: 6.5, unit: 'µm', why: '$\\Lambda = v/f = 650/(100\\times 10^6) = 6.5\\ \\mu$m.' }
  ],
  applications: [
    'Random-access laser scanning microscopes, which visit chosen points of a sample in microseconds ([[laser-scanning-microscopes]]).',
    'Laser machining and marking where very fast small jumps or beam dithering are needed.',
    'Optical tweezers, which steer and time-share several trapping beams.',
    'Acousto-optic modulators and Q-switches, which use the same crystal to switch or vary light ([[optical-isolators-and-modulators]]).',
    'Laser spectroscopy and atom cooling, which tune the frequency and the direction of beams.'
  ],
  history: 'Léon Brillouin predicted the diffraction of light by sound in 1922. It was observed in 1932, independently, by Debye and Sears and by Lucas and Biquard. Acousto-optic deflectors became practical when the laser and the high-frequency piezoelectric transducer arrived in the 1960s.',
  sources: [
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, the chapter on acousto-optics — Bragg diffraction by sound and the deflector.',
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — acousto-optic and electro-optic scanners.',
    'A. Yariv and P. Yeh, *Optical Waves in Crystals* (Wiley) — the Pockels effect and electro-optic devices.'
  ],
  sim: 'sm-aod'
},

/* ================================================================ Risley prisms and beam steering */
{
  id: 'risley-prisms-and-beam-steering', parent: 'scanning-methods', title: 'Risley prisms and beam steering', level: 3,
  short: 'Two thin glass wedges on one axis, each turned by its own motor, bend a beam by the sum of two small arrows: together they can point it anywhere in a circular field and trace circles, lines and roses. Optical phased arrays steer a beam without any moving part at all, by shifting the phase along a row of emitters.',
  keywords: ['Risley prism', 'rotating wedge', 'wedge prism pair', 'beam steering', 'rosette scan', 'optical wedge', 'field of regard', 'optical phased array', 'OPA', 'rotary prism', 'trepanning', 'non-mechanical beam steering'],
  prereq: ['prism-deviation', 'galvanometer-scanners', 'refraction-at-a-flat-surface'],
  related: ['acousto-optic-and-electro-optic-deflectors', 'lidar', 'laser-processing-systems', 'the-phoropter-and-subjective-refraction', 'cover-test-and-binocular-balance', 'prism-types', 'prism-in-spectacles'],
  body: `
A **Risley prism pair** is two identical thin wedges of glass, one behind the other on the same axis, each free to turn on its own. One wedge bends a beam by a small fixed angle towards its thick edge ([[prism-deviation]]). Turn it and the bent beam swings round a circle. Two wedges bend the beam by two small arrows that *add*, and turning them separately points the beam anywhere in a circular field.

### One wedge
A thin wedge of apex angle $\\alpha$ and index $n$ deviates a beam by

$$\\delta = (n - 1)\\,\\alpha$$

(the exact value follows from [[snells-law|Snell’s law]] at both faces, and differs from it by a few per cent at 5°). For N-BK7 at 550 nm ($n = 1.5185$) a wedge of 5° deviates the beam by 2.6°.

### Two wedges: arrows that add
Each wedge gives a deviation of size $\\delta$ in the direction of its own orientation $\\varphi$. The beam leaves with the vector sum of the two arrows. If the orientations differ by $\\Delta\\varphi$ the net deviation has the size

$$\\delta_{\\mathrm{net}} = 2\\delta\\cos\\frac{\\Delta\\varphi}{2}$$

and points along the average of the two orientations. Wedges turned the same way give $2\\delta$, the greatest; 90° apart give $1.41\\,\\delta$; opposite wedges cancel and the beam goes straight. The pair can reach any direction within a cone of half-angle $2\\delta$: 5.2° for the 5° N-BK7 pair (a cone of 10.4°).

### What the pair draws
- **Same speed, same direction**: a circle of radius $2\\delta$.
- **Same speed, opposite directions**: a straight line through the centre.
- **Speeds in the ratio $1 : -m$** (opposite directions): a rose with $m+1$ petals. Other ratios fill the disc densely as time passes, a flower pattern that scanning lidars use to cover a scene.
The same rotating wedge, used alone, is the trepanning head that moves a laser spot in a circle to cut a round hole ([[laser-processing-systems]]).

### Strengths and costs
Only rotation is needed, the wedges can be large (as large as the beam), and with antireflection coatings nearly all the light passes. Against that:
- **Non-linear pointing.** The beam’s direction depends on the two angles in a non-linear way. Near the centre, where the arrows cancel, a tiny relative turn swings the beam through a large azimuth, so aiming through the centre is the hardest.
- **Dispersion.** The deviation depends on the wavelength: for crown glass the colours spread over about 1/V = 1.6 % of $\\delta$. That does not matter for a laser; broad-band pairs use achromatic wedge doublets.
- **Limited field**: $\\pm 2\\delta$, set by the glass.

### Without moving parts
An **optical phased array** is a row (or grid) of emitters, each given a phase step $\\Delta\\phi$ from its neighbour at pitch $d$. The beam leaves at $\\sin\\theta = \\lambda\\,\\Delta\\phi/(2\\pi d)$; changing the phase steers it, as an acousto-optic deflector steers by changing the sound frequency ([[acousto-optic-and-electro-optic-deflectors]]). Pitches larger than $\\lambda/2$ give extra beams (grating lobes), so the unambiguous field is $\\pm\\arcsin(\\lambda/2d)$: 22.8° for $\\lambda = 1550$ nm and $d = 2$ µm. Silicon-photonic and liquid-crystal arrays are an active field of work, limited so far by loss, field and the number of emitters.

> [!key] Two wedges bend a beam by the sum of two small arrows, $2\\delta\\cos(\\Delta\\varphi/2)$ in size, so a turning pair points anywhere within $\\pm 2\\delta$ and draws circles, lines and roses. The price is a non-linear aim, dispersion and a small field.
`,
  ideas: [
    'A thin wedge deviates a beam by δ = (n − 1)α towards its thick edge; turning it swings the beam round a circle.',
    'Two wedges add their deviations as arrows: the net size is 2δ cos(Δφ/2), pointing along the average orientation.',
    'The pair reaches any direction within a cone of half-angle 2δ; for the same glass and apex the field is fixed.',
    'Equal speeds draw a circle or a line; speeds in ratio 1 : −m draw a rose of m + 1 petals.',
    'Phased arrays steer a beam by shifting phase along emitters, sin θ = λΔφ/(2πd), with no moving part but with a small field and grating lobes.'
  ],
  pitfalls: [
    'Two wedges can steer the beam a long way — The field is only ±2δ, set by the wedge angle and the glass. Large fields need steep wedges, which disperse colours and lose light.',
    'The beam angle follows the wedge angle in a simple way — The map from the two rotation angles to the pointing direction is non-linear and has a singular point at the centre.',
    'A Risley pair is a rotating plane mirror — A mirror turns the beam by twice its angle through any size; a wedge pair is limited to ±2δ but passes the beam straight through, with no change of direction of travel.',
    'A phased array has no limits on how far it steers — Its pitch decides the field: beyond ±arcsin(λ/2d) extra beams, grating lobes, appear.'
  ],
  terms: [
    { term: 'Risley prism pair', also: ['Risley prisms', 'rotating wedge pair', 'rotary prism'], def: 'Two identical thin wedges on one axis, each rotated independently. Their small deviations add as arrows, so the beam can be pointed anywhere in a circular field.' },
    { term: 'Optical wedge', also: ['thin prism', 'wedge prism'], def: 'A piece of glass with two flat faces at a small angle α. It deviates a beam by about (n − 1)α towards its thick edge.' },
    { term: 'Field of regard', def: 'The whole range of directions to which a steering device can point the beam; a cone of half-angle 2δ for a Risley pair.' },
    { term: 'Rosette scan', also: ['flower pattern', 'rose scan'], def: 'The petal-shaped pattern traced by a Risley pair when its wedges turn at different speeds.' },
    { term: 'Optical phased array', also: ['OPA'], def: 'A row or grid of emitters whose phases are set one by one to steer the beam by interference, with no moving parts.' },
    { term: 'Grating lobes', def: 'Extra beams from a phased array whose emitters are more than half a wavelength apart; they limit the unambiguous steering range.' }
  ],
  formulas: [
    {
      name: 'Deviation of a thin wedge',
      expr: 'delta = (n - 1)*alpha', tex: '\\delta = (n - 1)\\,\\alpha',
      vars: {
        delta: { name: 'deviation of the beam', q: 'angle', unit: '°', tex: '\\delta' },
        n: { name: 'refractive index of the glass', value: 1.5185, min: 1, max: 4, tex: 'n' },
        alpha: { name: 'apex angle of the wedge', q: 'angle', unit: '°', value: 5, min: 0, max: 15, tex: '\\alpha' }
      },
      solveFor: 'delta',
      note: 'A small-angle formula, good to about 1 % for wedges up to about 5°.',
      stories: { delta: 'A thin wedge of index {n} has an apex angle of {alpha}. By how much does it deviate a beam?', alpha: 'A thin wedge of index {n} must deviate a beam by {delta}. What apex angle does it need?' }
    },
    {
      name: 'Net deviation of a Risley pair',
      expr: 'dn = 2*delta*cos(dphi/2)', tex: '\\delta_{\\mathrm{net}} = 2\\delta\\cos\\frac{\\Delta\\varphi}{2}',
      vars: {
        dn: { name: 'net deviation of the pair', q: 'angle', unit: '°', tex: '\\delta_{\\mathrm{net}}' },
        delta: { name: 'deviation of each wedge', q: 'angle', unit: '°', value: 2.6, min: 0, max: 15, tex: '\\delta' },
        dphi: { name: 'angle between the two orientations', q: 'angle', unit: '°', value: 90, min: 0, max: 180, tex: '\\Delta\\varphi' }
      },
      solveFor: 'dn',
      note: 'Identical thin wedges, small deviations. 0° gives the greatest deviation 2δ; 180° gives none.',
      stories: { dn: 'Two wedges that each deviate a beam by {delta} are turned {dphi} apart. What is the net deviation?' }
    },
    {
      name: 'Steering of an optical phased array',
      expr: 'sin(theta) = lambda*dphi/(2*pi*d)', tex: '\\sin\\theta = \\frac{\\lambda\\,\\Delta\\phi}{2\\pi\\, d}',
      vars: {
        theta: { name: 'steering angle', q: 'angle', unit: '°', min: -90, max: 90, signed: true, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        dphi: { name: 'phase step between neighbouring emitters', q: 'angle', unit: '°', value: 60, min: -180, max: 180, signed: true, tex: '\\Delta\\phi' },
        d: { name: 'emitter pitch', q: 'length', unit: 'µm', value: 2 }
      },
      solveFor: 'theta',
      note: 'Valid within ±arcsin(λ/2d); beyond that grating lobes appear.',
      stories: { theta: 'Neighbouring emitters of a phased array at {d} pitch differ in phase by {dphi}. For {lambda} light, at what angle does the beam leave?' }
    }
  ],
  examples: [
    {
      title: 'A pair of crown-glass wedges',
      q: 'Two wedges of N-BK7 ($n = 1.5185$ at 550 nm) with an apex angle of 5° form a Risley pair. What is the deviation of each, the field of regard, and the net deviation when their orientations differ by 90°?',
      steps: [
        { text: 'Each wedge deviates the beam by', tex: '\\delta = (n-1)\\alpha = 0.5185 \\times 5° = 2.6°' },
        { text: 'The field of regard has half-angle', tex: '2\\delta = 5.2°' },
        { text: 'At $\\Delta\\varphi = 90°$:', tex: '\\delta_{\\mathrm{net}} = 2\\delta\\cos 45° = 3.7°' }
      ],
      a: 'Each wedge deviates by 2.6°; the pair reaches any direction within 5.2° of the axis; with the wedges 90° apart it points 3.7° from the axis.'
    },
    {
      title: 'Petals of a rose',
      q: 'Wedge 1 turns at 1 revolution a second and wedge 2 at 3 revolutions a second in the opposite direction. What does the beam trace?',
      steps: [
        'The speeds are in the ratio $1 : -3$, so $m = 3$.',
        'The beam traces a rose with $m + 1 = 4$ petals, each reaching out to the full radius $2\\delta$, and repeating once per revolution of the slower wedge.'
      ],
      a: 'A four-petal rose, repeated every second.'
    }
  ],
  quiz: [
    { q: 'Two identical wedges each deviate a beam by 3°. What is the largest net deviation the pair can give?', answer: 6, unit: '°', why: 'With their orientations equal the arrows add: $2\\delta = 6°$. Turned 180° apart they cancel.' },
    { q: 'Two identical wedges turn at the same speed in opposite directions. What does the beam trace?', choices: ['A circle', 'A straight line through the centre', 'A spiral', 'A four-petal rose'], a: 1, why: 'The sum of two arrows turning equally in opposite directions is $2\\delta\\cos(\\omega t)$ along a fixed direction: a line through the centre.' },
    { q: 'A Risley pair can point anywhere in a field that is wider than the sum of the two wedge deviations.', a: false, why: 'The net deviation never exceeds $2\\delta$, reached when the arrows line up. The field is a cone of half-angle $2\\delta$.' },
    { q: 'An optical phased array has a pitch of 1.55 µm at a wavelength of 1550 nm. What is the unambiguous steering range, to either side of the axis?', choices: ['±15°', '±30°', '±45°', '±90°'], a: 3, why: '$\\arcsin(\\lambda/2d) = \\arcsin(1550/3100) = \\arcsin 0.5 = 30°$.' },
    { q: 'A thin wedge of index 1.5 has an apex angle of 4°. By how much does it deviate a beam, in degrees?', answer: 2, unit: '°', why: '$\\delta = (n-1)\\alpha = 0.5\\times 4° = 2°$.' }
  ],
  applications: [
    'Scanning lidar sensors that sweep a rosette pattern over a scene ([[lidar]]).',
    'Laser pointing and tracking, where the beam must be re-aimed at a moving target.',
    'Trepanning heads in laser drilling: a rotating wedge moves the spot round a circle to cut a round hole.',
    'The rotary prism of a phoropter, which gives a variable prism for testing eye-muscle balance ([[cover-test-and-binocular-balance]]).',
    'Free-space optical communication terminals that point a narrow beam.'
  ],
  history: 'Rotating wedge pairs have been used for a long time as variable prisms in ophthalmic instruments, where a small prism power must be dialled in smoothly. Laser pointing, trepanning and, more recently, lidar took the same arrangement up. Optical phased arrays were first built for radar-like beam steering with radio waves and carried over to light with integrated photonics from the 2000s.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — Risley prisms and rotating-wedge scanners.',
    'R. Kingslake and R. B. Johnson, *Lens Design Fundamentals* (Academic Press) — the thin prism and its deviation.',
    'E. Hecht, *Optics* — the prism and the deviation by a thin wedge.'
  ],
  sim: 'sm-risley'
},

/* ================================================================ scan lenses and f-theta */
{
  id: 'scan-lenses-and-f-theta', parent: 'scanning-methods', title: 'Scan lenses and the f-theta condition', level: 2,
  short: 'An ordinary lens puts a spot at f·tan θ, so a mirror turning at a steady rate sweeps the spot faster and faster towards the edge. An f-theta lens is built to put it at f·θ, so equal turns of the mirror give equal steps on a flat field, and constant spot speed. A telecentric version also makes the beam land square on the work.',
  keywords: ['f-theta lens', 'F-theta', 'scan lens', 'flat-field lens', 'f tan theta', 'telecentric scan lens', 'scan field', 'marking lens', 'entrance pupil', 'distortion of a scan lens', 'laser marking lens'],
  prereq: ['galvanometer-scanners', 'polygon-scanners', 'distortion', 'entrance-and-exit-pupils'],
  related: ['resolvable-spots', 'scan-distortion-and-correction', 'telecentric-lenses', 'telecentricity', 'field-curvature', 'laser-marking-and-cutting-heads', 'laser-printers', 'uv-and-infrared-materials'],
  body: `
A scanning mirror turns light through an angle. The **scan lens** turns that angle into a position on the target, and focuses the beam there. The law it follows decides whether a steady turn of the mirror makes a steady motion of the spot.

### An ordinary lens: y = f tan θ
A parallel beam arriving at angle $\\theta$ to the axis of a simple lens focuses at the height

$$y = f\\tan\\theta$$

so equal steps of the mirror give spots that spread out towards the edge. If the mirror turns at a constant rate, the spot speed is $1/\\cos^2\\theta$ times its value at the centre: 1.13 at 20°, 1.33 at 30°, 1.70 at 40°. A marker would burn the edges less; a printer would put its pixels farther apart there; a time-clocked scan would be distorted.

### An f-theta lens: y = fθ
An **f-theta lens** is designed with deliberate barrel distortion so that the image height is proportional to the angle:

$$y = f\\,\\theta$$

Equal turns of the mirror give equal steps on the target, and a steadily turning mirror (a polygon, say) gives a constant spot speed. For $f = 160$ mm:

| θ | f tan θ | f θ | f tan θ is farther by |
|---|---|---|---|
| 5° | 14.00 mm | 13.96 mm | 0.3 % |
| 10° | 28.21 mm | 27.93 mm | 1.0 % |
| 15° | 42.87 mm | 41.89 mm | 2.3 % |
| 20° | 58.24 mm | 55.85 mm | 4.3 % |

Seen as distortion, the f-theta lens has $-4.1\\,\\%$ at 20° and $-9.3\\,\\%$ at 30° against the ideal $f\\tan\\theta$. A good one keeps $y = f\\theta$ to within a few tenths of a per cent over the field.

### More than the right mapping
- **Flat field.** The spot stays in focus over a flat target because the lens is designed with its field curvature corrected; a simple lens focuses on a curved surface ([[field-curvature]]).
- **The mirror sits at the pupil.** The lens is designed for the mirror at a stated distance in front of it, its entrance pupil. A second mirror of an X–Y head cannot be there as well, which is one cause of distortion ([[scan-distortion-and-correction]]).
- **Telecentric.** In a **telecentric** scan lens every chief ray leaves parallel to the axis, so the spot lands square on the work at every point, keeps its size, and does not shift sideways if the surface is a little too high or too low (a height error $\\Delta z$ moves the spot by $\\Delta z\\tan\\theta$ otherwise: 0.36 mm per millimetre at 20°). It is used for drilling and welding. The price: the last element must be at least as large as the field, so telecentric scan lenses are large and costly.

Marking lenses for 1064 nm have focal lengths from about 100 to 420 mm and fields of about 70 to 300 mm square; UV versions are made of fused silica, and CO₂ lenses of zinc selenide ([[uv-and-infrared-materials]]).

> [!key] An f-theta lens puts the spot at f·θ instead of f·tan θ, so a steadily turning mirror writes at constant speed over a flat field. Telecentric versions also land the beam square on the work, at the price of a lens as big as the field.
`,
  ideas: [
    'A scan lens turns the mirror’s angle into a position on the target and focuses the beam there.',
    'An ordinary lens gives y = f tan θ; the spot speeds up to 1/cos²θ times its central value for a steady mirror.',
    'An f-theta lens gives y = fθ by deliberate barrel distortion: equal angle steps, equal position steps.',
    'The mirror must sit at the lens’s entrance pupil, and the field is flat.',
    'A telecentric scan lens lands the beam square at every point, so height errors do not shift the spot, but it must be larger than the field.'
  ],
  pitfalls: [
    'An f-theta lens has no distortion — It has a deliberate barrel distortion of about 4 % at 20°, compared with an ordinary f tan θ lens: that is how it makes y = fθ.',
    'Any lens can serve as a scan lens — A camera lens has its pupil inside it, where no mirror can go, follows y = f tan θ, and may not pass the laser’s wavelength or power. Behind a scanning mirror it gives a distorted, clipped and shaded scan.',
    'A telecentric scan lens is just a bigger f-theta lens — It has an extra requirement: its exit pupil is at infinity, so the last element must cover the whole field.',
    'The f-theta property makes the spot size constant — It controls position, not spot size. The spot size depends on the beam diameter and the lens’s aberrations ([[resolvable-spots]]).'
  ],
  terms: [
    { term: 'Scan lens', also: ['flat-field lens', 'scanning objective'], def: 'The lens placed after a scanning mirror. It focuses the beam and turns the mirror angle into a position on a flat field.' },
    { term: 'f-theta lens', also: ['F-theta lens', 'fθ lens'], def: 'A scan lens designed so that the image height is y = f·θ, proportional to the scan angle, so that equal angle steps give equal steps on the target.' },
    { term: 'f tan θ lens', also: ['rectilinear lens'], def: 'An ordinary lens, whose image height for a parallel beam at angle θ is y = f·tan θ.' },
    { term: 'Telecentric scan lens', also: ['telecentric f-theta lens'], def: 'A scan lens whose chief rays leave parallel to the axis, so the beam lands perpendicular to the target everywhere on the field.' },
    { term: 'Entrance pupil position', also: ['pivot distance', 'mirror distance'], def: 'The distance from the first lens surface at which the scanning mirror must sit for the scan lens to work as designed.' }
  ],
  formulas: [
    {
      name: 'Image height of an f-theta lens',
      expr: 'y = f*theta', tex: 'y = f\\,\\theta',
      vars: {
        y: { name: 'distance of the spot from the axis', q: 'length', unit: 'mm', tex: 'y' },
        f: { name: 'focal length of the scan lens', q: 'length', unit: 'mm', value: 160 },
        theta: { name: 'optical scan angle', q: 'angle', unit: '°', value: 20, min: 0, max: 60, tex: '\\theta' }
      },
      solveFor: 'y',
      note: 'The angle is the optical angle (twice the mirror angle).',
      stories: { y: 'A scan lens has f = {f}. The beam arrives {theta} from the axis. How far from the centre is the spot of an f-theta lens?', f: 'An f-theta lens must put the spot {y} from the centre at {theta}. What focal length does it need?' }
    },
    {
      name: 'Image height of an ordinary lens',
      expr: 'y = f*tan(theta)', tex: 'y = f\\tan\\theta',
      vars: {
        y: { name: 'distance of the spot from the axis', q: 'length', unit: 'mm', tex: 'y' },
        f: { name: 'focal length', q: 'length', unit: 'mm', value: 160 },
        theta: { name: 'optical scan angle', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'y',
      note: 'The spot lands farther out than fθ, increasingly so at large angles.',
      stories: { y: 'An ordinary lens of f = {f} receives a parallel beam {theta} off axis. How far from the centre does it focus?' }
    },
    {
      name: 'Spot speed relative to the centre (ordinary lens)',
      expr: 'r = 1/cos(theta)^2', tex: 'r = \\frac{1}{\\cos^2\\theta}',
      vars: {
        r: { name: 'spot speed ÷ spot speed at the centre', value: 1.13, tex: 'r' },
        theta: { name: 'optical scan angle', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'r',
      note: 'For a mirror that turns at a constant rate behind a lens with y = f tan θ.',
      stories: { r: 'A mirror turns at a constant rate behind an ordinary lens. By what factor is the spot faster {theta} off axis than at the centre?' }
    },
    {
      name: 'Sideways shift from a height error (non-telecentric)',
      expr: 'dy = dz*tan(theta)', tex: '\\Delta y = \\Delta z\\,\\tan\\theta',
      vars: {
        dy: { name: 'sideways shift of the spot', q: 'length', unit: 'µm', tex: '\\Delta y' },
        dz: { name: 'height error of the surface', q: 'length', unit: 'mm', value: 0.5, tex: '\\Delta z' },
        theta: { name: 'angle of the beam to the axis at the target', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'dy',
      note: 'Zero for a telecentric lens, where the beam is square to the target everywhere.',
      stories: { dy: 'A surface is {dz} too high where the beam arrives {theta} from the axis. How far is the spot shifted sideways?' }
    }
  ],
  examples: [
    {
      title: 'The field of an f-theta lens',
      q: 'A scan head with an f-theta lens of focal length 160 mm turns the beam through ±20° optical. Where does the spot land at the edge, and where would an ordinary lens put it?',
      steps: [
        { text: 'With $\\theta = 20° = 0.349$ rad, an f-theta lens gives', tex: 'y = f\\theta = 160\\ \\mathrm{mm}\\times 0.349 = 55.9\\ \\mathrm{mm}' },
        { text: 'An ordinary lens gives', tex: 'y = f\\tan\\theta = 160\\ \\mathrm{mm}\\times 0.364 = 58.2\\ \\mathrm{mm}' }
      ],
      a: '55.9 mm for the f-theta lens (a field 111.7 mm wide) and 58.2 mm for an ordinary lens: 4.3 % farther.'
    },
    {
      title: 'Where is the ordinary lens 10 % faster?',
      q: 'A mirror turns at a constant rate behind an ordinary lens. At what scan angle is the spot 10 % faster than at the centre?',
      steps: [
        { text: 'Set the speed ratio to 1.10:', tex: '\\frac{1}{\\cos^2\\theta} = 1.10 \\quad\\Rightarrow\\quad \\cos\\theta = \\frac{1}{\\sqrt{1.10}} = 0.9535' },
        'So $\\theta = 17.5°$ optical.'
      ],
      a: '17.5° optical, or about 8.8° of mirror rotation. Beyond that an uncorrected scan runs more than 10 % faster.'
    }
  ],
  quiz: [
    { q: 'An f-theta lens of focal length 100 mm receives a beam at 15° (0.262 rad) to the axis. How far from the axis is the spot, in mm?', answer: 26.2, unit: 'mm', why: '$y = f\\theta = 100\\times 0.2618 = 26.2$ mm.' },
    { q: 'Why does the spot of a steadily turning mirror go faster towards the edge behind an ordinary lens?', choices: ['The lens is thicker at the edge', 'The image height is f tan θ, whose slope 1/cos²θ grows with the angle', 'The mirror speeds up', 'Light is faster at the edge'], a: 1, why: 'The spot position is $y = f\\tan\\theta$, so for a constant $\\dot\\theta$ the speed is $f\\dot\\theta/\\cos^2\\theta$, which increases with $\\theta$.' },
    { q: 'An f-theta lens has no distortion.', a: false, why: 'It has deliberate barrel distortion relative to an ordinary lens: that is how it makes the image height proportional to the angle, −4 % at 20°.' },
    { q: 'What does a telecentric scan lens guarantee?', choices: ['The spot is smaller', 'The chief rays are parallel to the axis, so the beam lands square on the target', 'The lens is smaller', 'The scan is faster'], a: 1, why: 'The exit pupil is at infinity, so every chief ray leaves parallel to the axis. A change in surface height then does not move the spot sideways.' },
    { q: 'A surface is 0.5 mm too high at a place where a non-telecentric beam arrives 25° from the axis. How far is the spot shifted sideways, in mm?', answer: 0.233, unit: 'mm', why: '$\\Delta y = \\Delta z\\tan 25° = 0.5\\times 0.4663 = 0.233$ mm.' }
  ],
  applications: [
    'Laser marking and engraving heads, which almost always sit behind an f-theta lens ([[laser-marking-and-cutting-heads]]).',
    'Laser printers, where the polygon’s steady rotation must give equally spaced pixels ([[laser-printers]]).',
    'Laser drilling of printed circuit boards, which uses a telecentric lens so the holes have straight walls.',
    'Laser welding and 3-D printing heads covering a flat bed.'
  ],
  history: 'A simple lens leaves the spot speed uneven, and one cure is to distort the pixel clock to compensate. Lens designers chose instead to build the correction into the lens itself: the f-theta lens became a standard catalogue item for laser printers and, with galvanometer marking heads, for laser marking.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — the chapters on scan lenses and f-theta objectives.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — pre-objective scan lenses and their distortion.',
    'W. J. Smith, *Modern Optical Engineering* (McGraw-Hill) — distortion and the design of lenses with a stated image-height law.'
  ],
  sim: 'sm-ftheta'
},

/* ================================================================ resolvable spots */
{
  id: 'resolvable-spots', parent: 'scanning-methods', title: 'Resolvable spots: the resolution of a scanner', level: 2,
  short: 'A scanner’s resolution is the number of separate spots it can put along a line: N = θD/(1.27λ), the scan angle times the beam diameter divided by the wavelength. It is a figure of merit that no scan lens can change; only a bigger angle, a bigger beam or a shorter wavelength raises it.',
  keywords: ['resolvable spots', 'number of spots', 'scanner resolution', 'scan angle times aperture', 'spot size', 'Gaussian beam spot', 'N = theta D / lambda', 'scanner figure of merit', 'Lagrange invariant of a scanner', 'pixels per line'],
  prereq: ['the-gaussian-beam', 'the-airy-disk', 'scan-lenses-and-f-theta'],
  related: ['the-optical-invariant', 'etendue', 'beam-expanders', 'focusing-a-laser-beam', 'galvanometer-scanners', 'polygon-scanners', 'acousto-optic-and-electro-optic-deflectors', 'flatbed-and-document-scanners'],
  body: `
How many separate points can a scanner draw along one line? Not as many as its electronics can address: the spot has a size, and two spots closer together than their own width can no longer be told apart. The count of spots that fit along the scan is the **number of resolvable spots** $N$, the figure of merit of every optical scanner.

### The result
A Gaussian beam of diameter $D$ (to the $1/e^2$ intensity) at the mirror, swept through the total optical angle $\\theta$, can place

$$N = \\frac{\\theta\\,D}{1.27\\,\\lambda}$$

spots along the line, counted as touching spots of $1/e^2$ diameter. A 10 mm beam at 633 nm swept through 40° optical resolves 8684 spots; with a 4 mm beam it resolves 3474.

### Why the lens does not matter
Behind a scan lens of focal length $f$ the spot diameter is $d = 1.27\\,\\lambda f/D$ and the scan length is $L = f\\theta$. The ratio $L/d$ is $\\theta D/(1.27\\lambda)$: the focal length cancels. A longer lens gives a larger field with a larger spot, and the same count. The product $\\theta D$ is an invariant of the scanner, like the optical invariant of a lens system ([[the-optical-invariant]]): a beam expander after the mirror enlarges $D$ by $M$ and divides the scan angle by $M$, so $N$ is unchanged. Only three things raise it:
1. a **bigger angle**, which means a larger field and more distortion;
2. a **bigger beam**, which means a bigger mirror, slower and costlier ([[galvanometer-scanners]]);
3. a **shorter wavelength**.

### What counts as resolved
The factor 1.27 belongs to the $1/e^2$ diameter of a Gaussian spot. Other definitions give other counts for the same scanner:

| Criterion for one spot | Factor $a$ | N for 40°, 10 mm, 633 nm |
|---|---|---|
| Gaussian $1/e^2$ diameter | 1.27 | 8684 |
| Rayleigh (uniform beam, Airy radius) | 1.22 | 9040 |
| Gaussian full width at half maximum | 0.75 | 14 705 |

Say which is meant. A scanner used for imaging also needs two samples per spot (Nyquist), so it needs about twice as many pixels as the spots it counts.

### Examples of what is possible
| Scanner (assumed) | Angle | Beam | N |
|---|---|---|---|
| MEMS mirror, 650 nm | 20° | 1 mm | 423 |
| Resonant mirror, 650 nm | 20° | 5 mm | 2114 |
| Small galvo, 633 nm | 40° | 4 mm | 3474 |
| Large galvo, 633 nm | 40° | 10 mm | 8684 |

For an acousto-optic deflector the same law holds with the factor 1, and gives the time–bandwidth product ([[acousto-optic-and-electro-optic-deflectors]]).

> [!key] A scanner resolves N = θD/(1.27λ) spots on a line, the scan angle times the beam diameter over the wavelength. A scan lens changes the size of the field and of the spots together, never their count.
`,
  ideas: [
    'The number of resolvable spots on a line, N = θD/(1.27λ), is the resolution of a scanner.',
    'A scan lens scales the spot and the field together: the focal length cancels in L/d.',
    'The product scan angle × beam diameter is an invariant: expanding the beam by M cuts the scan angle by M.',
    'Only a bigger angle, a bigger beam or a shorter wavelength raises N; each has a cost (distortion, mirror speed, materials).',
    'The count depends on the criterion for one spot: 1.27 for the 1/e² diameter, 1.22 for Rayleigh, 0.75 for the Gaussian FWHM.'
  ],
  pitfalls: [
    'A longer scan lens gives more resolution — It gives a bigger field with proportionally bigger spots. The number of spots across it, N, stays the same.',
    'The resolution is the number of steps the driver can address — The driver may address 65 536 positions, but the spot is wider than a step; the count that matters is N.',
    'A bigger beam always makes the scanner better — It gives a smaller spot and more resolvable spots, but it needs a bigger, slower mirror and may not fit the optics.',
    'N is a single number for a scanner — It depends on what counts as one spot: the same scanner gives 8684 or 14 705 for a 1/e² diameter or a half-maximum width.'
  ],
  terms: [
    { term: 'Number of resolvable spots', also: ['N', 'spot count', 'scanner resolution'], def: 'The number of non-overlapping spots that fit along a scan line, N = θD/(aλ). The standard figure of merit of a scanner.' },
    { term: 'Spot diameter', also: ['1/e² spot size', 'spot size'], def: 'The width of the focused spot on the target, for a Gaussian beam d = 1.27 λf/D to the 1/e² intensity.' },
    { term: 'Scan angle–aperture product', also: ['θD product'], def: 'The optical scan angle times the beam diameter at the mirror. It is conserved through any passive optics and sets the number of spots.' },
    { term: 'Spot criterion', def: 'The rule used to decide when two spots are separate: the 1/e² diameter (a = 1.27), the Rayleigh criterion (a = 1.22) or the half-maximum width (a = 0.75).' }
  ],
  derivation: {
    title: 'The count of spots',
    intro: 'Let a Gaussian beam of diameter $D$ (radius $w = D/2$ at the lens) be focused by a scan lens of focal length $f$, and swept through the total optical angle $\\theta$.',
    steps: [
      { text: 'The focused spot has a waist radius $w_0 = \\lambda f/(\\pi w)$, so its $1/e^2$ diameter is', tex: 'd = 2w_0 = \\frac{4\\lambda f}{\\pi D} = 1.27\\,\\frac{\\lambda f}{D}' },
      { text: 'An f-theta lens puts the spot at $f\\theta$, so the line is', tex: 'L = f\\theta' },
      { text: 'The number of touching spots on it is', tex: 'N = \\frac{L}{d} = \\frac{f\\theta}{1.27\\,\\lambda f/D} = \\frac{\\theta D}{1.27\\,\\lambda}' }
    ]
  },
  formulas: [
    {
      name: 'Resolvable spots',
      expr: 'N = theta*D/(a*lambda)', tex: 'N = \\frac{\\theta\\,D}{a\\,\\lambda}',
      vars: {
        N: { name: 'number of resolvable spots', tex: 'N' },
        theta: { name: 'total optical scan angle', q: 'angle', unit: '°', value: 40, min: 0, max: 120, tex: '\\theta' },
        D: { name: 'beam diameter at the mirror (1/e²)', q: 'length', unit: 'mm', value: 10 },
        a: { name: 'spot criterion factor', value: 1.27, min: 0.5, max: 2, tex: 'a' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' }
      },
      solveFor: 'N',
      note: 'a = 1.27 counts touching spots of 1/e² diameter for a Gaussian beam. The angle is the total optical angle (twice the total mirror angle).',
      stories: { N: 'A scanner sweeps a {D} beam of {lambda} light through {theta} optical (criterion a = {a}). How many spots does it resolve?', D: 'A scanner with a total optical angle of {theta} at {lambda} must resolve {N} spots (a = {a}). What beam diameter does it need?' }
    },
    {
      name: 'Spot diameter behind a scan lens',
      expr: 'd = a*lambda*f/D', tex: 'd = a\\,\\frac{\\lambda\\,f}{D}',
      vars: {
        d: { name: 'spot diameter on the target', q: 'length', unit: 'µm', tex: 'd' },
        a: { name: 'spot criterion factor', value: 1.27, min: 0.5, max: 2, tex: 'a' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1064, tex: '\\lambda' },
        f: { name: 'focal length of the scan lens', q: 'length', unit: 'mm', value: 160 },
        D: { name: 'beam diameter at the lens (1/e²)', q: 'length', unit: 'mm', value: 10 }
      },
      solveFor: 'd',
      note: 'A beam that fills the lens; it is the first estimate of a diffraction-limited spot, and aberrations only add to it.',
      stories: { d: 'A {D} beam of {lambda} is focused by a scan lens of f = {f}. What is the spot diameter (a = {a})?' }
    },
    {
      name: 'Length of the scan line',
      expr: 'L = f*theta', tex: 'L = f\\,\\theta',
      vars: {
        L: { name: 'length of the scan line', q: 'length', unit: 'mm', tex: 'L' },
        f: { name: 'focal length of the f-theta lens', q: 'length', unit: 'mm', value: 160 },
        theta: { name: 'total optical scan angle', q: 'angle', unit: '°', value: 40, min: 0, max: 120, tex: '\\theta' }
      },
      solveFor: 'L',
      note: 'Divide by the spot diameter to get N.',
      stories: { L: 'An f-theta lens with f = {f} scans through {theta}. How long is the line?' }
    }
  ],
  examples: [
    {
      title: 'A galvo head',
      q: 'A galvo head sweeps a 10 mm beam of 633 nm light through a total optical angle of 40°. How many spots does it resolve?',
      steps: [
        { text: 'With $\\theta = 40° = 0.698$ rad and $a = 1.27$:', tex: 'N = \\frac{0.698\\times 10\\ \\mathrm{mm}}{1.27\\times 633\\ \\mathrm{nm}} = 8684' }
      ],
      a: 'About 8700 spots along the line. Behind a lens with f = 160 mm they are $d = 1.27\\lambda f/D = 12.9$ µm wide at 633 nm, on a line $f\\theta = 112$ mm long.'
    },
    {
      title: 'What a printer needs',
      q: 'A 600 dpi laser printer scans the 210 mm width of an A4 page, which is 4961 pixels. Its polygon gives a usable optical angle of 60°. What beam diameter does a 780 nm diode need to resolve 4961 spots?',
      steps: [
        { text: 'Solve for $D$:', tex: 'D = \\frac{1.27\\,\\lambda N}{\\theta} = \\frac{1.27\\times 780\\ \\mathrm{nm}\\times 4961}{1.047} = 4.7\\ \\mathrm{mm}' }
      ],
      a: 'About 4.7 mm at the polygon. A smaller beam, or a smaller angle, would leave spots too wide for the pixels.'
    }
  ],
  quiz: [
    { q: 'You change the scan lens of a scanner to one of twice the focal length. What happens to N?', choices: ['It doubles', 'It halves', 'It is unchanged', 'It quadruples'], a: 2, why: 'The field length and the spot diameter both double, so their ratio, N = θD/(1.27λ), is unchanged.' },
    { q: 'A scanner sweeps a 5 mm beam of 532 nm light through 30° (0.524 rad). How many spots does it resolve?', answer: 3875, why: '$N = 0.5236\\times 5\\times 10^{-3}/(1.27\\times 532\\times 10^{-9}) = 3875$.' },
    { q: 'A beam expander of magnification 4 is placed after the scanning mirror. What happens to the number of resolvable spots?', choices: ['It is multiplied by 4', 'It is divided by 4', 'It is unchanged', 'It is multiplied by 16'], a: 2, why: 'The beam diameter is multiplied by 4 and the scan angle divided by 4, so the product θD, and with it N, is unchanged.' },
    { q: 'The same scanner has more resolvable spots when the criterion is the Gaussian half-maximum width than when it is the 1/e² diameter.', a: true, why: 'The half-maximum width of the spot is about 0.59 of its 1/e² diameter, so more of them fit along the line: a = 0.75 instead of 1.27.' },
    { q: 'A galvo head sweeps a 6 mm beam of 1064 nm light through 30° optical. Which is closest to its number of resolvable spots?', choices: ['230', '1 160', '2 300', '23 000'], a: 2, why: '$N = 0.5236\\times 6\\times 10^{-3}/(1.27\\times 1.064\\times 10^{-6}) = 2325$.' }
  ],
  applications: [
    'Choosing the beam diameter and mirror size of a laser printer so that the pixels are resolved ([[laser-printers]]).',
    'Specifying a scanning head for marking: the field and spot size set the fineness of the mark ([[laser-marking-and-cutting-heads]]).',
    'Comparing scanning technologies on one scale: the same number applies to a MEMS mirror, a polygon and an acousto-optic deflector.',
    'Choosing the pixels per line of a flatbed or laser scan ([[flatbed-and-document-scanners]]).'
  ],
  history: 'The count of resolvable spots has long been the measure used to compare polygon, galvanometer and acousto-optic scanners on one scale. It is the scanner’s version of the invariant that limits every optical system: the product of angle and aperture cannot be improved by lenses.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — the number of resolvable spots and its limits.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — the scan angle–aperture product as a figure of merit.',
    'A. E. Siegman, *Lasers* — the Gaussian beam, focused spot size and the 1/e² diameter.'
  ],
  sim: 'sm-resolvable'
},

/* ================================================================ scan distortion and correction */
{
  id: 'scan-distortion-and-correction', parent: 'scanning-methods', title: 'Scan distortion and its correction', level: 3,
  short: 'A scan is never quite where it was meant to be: two mirrors cannot share a pivot, so a square grid becomes a pincushion; lenses leave a residual; a resonant mirror moves as a sine. The cure is to measure the errors on a grid of points and correct every command from a look-up table.',
  keywords: ['scan distortion', 'pincushion', 'barrel', 'bow', 'wobble', 'calibration grid', 'look-up table', 'LUT', 'field correction', 'X-Y head distortion', 'linearization', 'field accuracy', 'scan calibration'],
  prereq: ['galvanometer-scanners', 'scan-lenses-and-f-theta', 'distortion'],
  related: ['polygon-scanners', 'resonant-and-mems-scanners', 'lens-distortion-and-calibration', 'laser-marking-and-cutting-heads', 'scanner-control-and-synchronisation', 'resolvable-spots'],
  body: `
Command a scanner to draw a square grid and it draws something close to one, but not exact. The errors have several sources, and each has its own signature.

### Where the errors come from
- **Two mirrors in turn.** In an X–Y head the beam leaves the first mirror, travels a few centimetres and meets the second, which turns a beam already turned sideways. The beam sweeps out a cone, not a plane, so the corners of the field land farther out than the middles of its edges: a **pincushion**, which would be there even if the two pivots were at one point. Because they are a few centimetres apart, the two axes also get slightly different scales.
- **No f-theta lens, or an imperfect one.** Without a scan lens the spot lands at $y = L\\tan\\theta$ ([[scan-lenses-and-f-theta]]); a real f-theta lens leaves a residual of a few tenths of a per cent.
- **Tilted or misplaced mirrors.** Axes not exactly square give a parallelogram; a tilted polygon facet or wobbling shaft shifts lines across the scan ([[polygon-scanners]]).
- **A sinusoidal sweep.** A resonant mirror's spot position is a sine of time, not linear ([[resonant-and-mems-scanners]]).
- **Servo lag and drift.** The mirror follows its command late, and its zero point drifts with temperature.

### A worked case: the bare X–Y head
For ±10° of mechanical travel, a flat target at 250 mm and pivots 15 mm apart, a head with no scan lens puts the middle of each edge 4.3 % farther from the centre than a linear mapping does, and the corners 10.6 % farther along the x axis: a pincushion with the corners about 10.5 mm out on a field 185 mm wide. The percentages depend only on the angles; the millimetres scale with the distance. The simulation below traces the mirrors exactly.

### Correcting it: a look-up table
The standard cure does not need the model. Mark or image a grid of $n \\times n$ points, measure where each lands, and store the errors. For every later command the controller interpolates the table (bilinearly or with splines) and sends the corrected command. The corrected field is as good as the table:

| Calibration grid | Largest error left (the example above) |
|---|---|
| none | 10.5 mm |
| 3 × 3 | 2.9 mm |
| 5 × 5 | 1.1 mm |
| 9 × 9 | 0.31 mm |
| 17 × 17 | 0.08 mm |

Halving the spacing of the nodes cuts the residual by a factor of three to four, because the interpolation error of a smooth map falls roughly as the square of the spacing. Real heads, which use an f-theta lens first, reach a few tens of micrometres over a field 100 to 200 mm wide after calibration, provided the temperature stays steady.

### For a resonant mirror
The distortion is known exactly: $x = A\\sin\\omega t$. The pixel clock is then run by position instead of by time (a table of sample times), or the samples are resampled onto an even grid after capture ([[scanner-control-and-synchronisation]]).

> [!key] Real scans are distorted by the geometry of two mirrors, by the lens, by facet and axis errors and by the sinusoidal motion of resonant mirrors. A grid of measured errors, stored as a look-up table and interpolated for every command, removes most of it.
`,
  ideas: [
    'Steering with two mirrors in turn distorts a square into a pincushion even with a good lens: the corners land farther out than the middles of the edges.',
    'A scan lens leaves residuals; tilted facets and wobbling axes shift lines across the scan.',
    'A resonant mirror’s position is a sine of time; it is corrected by clocking the samples by position.',
    'Calibration measures the errors on a grid and stores them as a look-up table; each command is corrected by interpolating it.',
    'The residual after correction falls about as the square of the grid spacing.'
  ],
  pitfalls: [
    'An f-theta lens removes all distortion of a scan head — It removes the tan θ nonlinearity; the pincushion from steering with two mirrors in turn, the tilts and the lens’s own residual remain.',
    'Calibration is a one-time job — Temperature changes the geometry and drifts the mirrors; high-accuracy systems re-calibrate and warm up first.',
    'A finer table always gives a better field — Only down to the repeatability of the mirror and the measurement of the grid, which set the floor.',
    'Distortion only matters for large fields — The error grows with the angle squared, but a 1 % error on a 100 mm field is 1 mm, which is a lot for micromachining.'
  ],
  terms: [
    { term: 'Pincushion distortion', def: 'A distortion in which the corners of a square field land farther from the centre than the middle of its sides; typical of two-mirror scan heads.' },
    { term: 'Look-up table', also: ['LUT', 'correction table', 'field correction file'], def: 'A table of corrections measured on a grid of points. The controller interpolates it to correct each position command.' },
    { term: 'Calibration grid', also: ['calibration plate', 'correction grid'], def: 'A pattern of known points, marked or imaged by the scanner and measured, from which the correction table is made.' },
    { term: 'Linearization', def: 'Correcting a sinusoidal or otherwise non-linear scan so that pixels are evenly spaced in position, by clocking or resampling.' },
    { term: 'Field accuracy', def: 'The largest difference between where the spot is commanded and where it lands, over the field, after calibration.' }
  ],
  formulas: [
    {
      name: 'Position of the beam on a flat target',
      expr: 'x = L*tan(theta)', tex: 'x = L\\tan\\theta',
      vars: {
        x: { name: 'distance from the axis', q: 'length', unit: 'mm', tex: 'x' },
        L: { name: 'distance from the mirror to the target', q: 'length', unit: 'mm', value: 250 },
        theta: { name: 'optical angle', q: 'angle', unit: '°', value: 20, min: 0, max: 80, tex: '\\theta' }
      },
      solveFor: 'x',
      note: 'The simplest source of distortion: a flat target and no scan lens.',
      stories: { x: 'A scanning mirror is {L} from a flat target and the beam leaves {theta} from the axis. How far from the centre does it land?' }
    },
    {
      name: 'Relative error against a linear mapping',
      expr: 'er = tan(theta)/theta - 1', tex: '\\varepsilon = \\frac{\\tan\\theta}{\\theta} - 1',
      vars: {
        er: { name: 'position error relative to a linear mapping', q: 'ratio', unit: '%', tex: '\\varepsilon' },
        theta: { name: 'optical angle', q: 'angle', unit: '°', value: 20, min: 1, max: 60, tex: '\\theta' }
      },
      solveFor: 'er',
      note: 'How much farther out the spot lands than it would for a mapping y = fθ at the same scale.',
      stories: { er:'A beam leaves {theta} from the axis and lands on a flat target. By how much does it land farther out than a linear mapping would put it?' }
    },
    {
      name: 'Interpolation error of a calibration table',
      expr: 'E = k*h^2', tex: 'E \\approx k\\,h^2',
      vars: {
        E: { name: 'residual error', q: false, unit: 'mm', tex: 'E' },
        k: { name: 'a constant of the distortion', q: false, unit: '1/mm', value: 0.0006, tex: 'k' },
        h: { name: 'spacing of the grid nodes', q: false, unit: 'mm', value: 23, tex: 'h' }
      },
      solveFor: 'E',
      note: 'For a smooth distortion and linear interpolation. The constant k scales with the distortion; the value here fits the bare X–Y head example.',
      stories: { E: 'A smooth distortion is corrected by a table with nodes {h} apart (constant k = {k}). What is the largest error left?' }
    }
  ],
  examples: [
    {
      title: 'How far out is the edge?',
      q: 'A scanning mirror 250 mm from a flat target turns the beam through 20° optical. Compare where it lands with the position a linear mapping at the same scale would give.',
      steps: [
        { text: 'The flat target gives', tex: 'x = L\\tan\\theta = 250\\ \\mathrm{mm}\\times 0.364 = 91.0\\ \\mathrm{mm}' },
        { text: 'The linear mapping ($x = L\\theta$, with $\\theta = 0.349$ rad) gives', tex: 'x = 250\\ \\mathrm{mm}\\times 0.349 = 87.3\\ \\mathrm{mm}' }
      ],
      a: 'The spot lands 3.7 mm (4.3 %) farther out than a linear scale predicts; at 30° the error would be 10 %.'
    },
    {
      title: 'Halving the grid spacing',
      q: 'A look-up table with nodes 46 mm apart leaves a worst error of 1.1 mm. What error would nodes 23 mm apart leave, if the error falls as the square of the spacing?',
      steps: [
        { text: 'Halving the spacing divides the error by four:', tex: 'E_{23} = \\frac{1.1\\ \\mathrm{mm}}{4} = 0.28\\ \\mathrm{mm}' }
      ],
      a: 'About 0.3 mm; the exact 9 × 9 figure of the head model is 0.31 mm.'
    }
  ],
  quiz: [
    { q: 'Which of these is the standard way to remove the distortion of an X–Y scan head?', choices: ['A bigger mirror', 'A look-up table made from a measured calibration grid', 'A shorter wavelength', 'A slower scan'], a: 1, why: 'The distortion is repeatable, so it can be measured on a grid and corrected for every command by interpolating the stored errors.' },
    { q: 'A beam leaves a scanning mirror 20° from the axis and lands on a flat target 200 mm away. Where does it land, in mm?', answer: 72.8, unit: 'mm', why: '$x = L\\tan\\theta = 200\\times 0.364 = 72.8$ mm.' },
    { q: 'A calibration table with a smooth distortion halves the node spacing. The residual error falls to about one half.', a: false, why: 'The interpolation error of a smooth map falls as the square of the spacing: to about one quarter.' },
    { q: 'What does an f-theta lens NOT correct in an X–Y head?', choices: ['The tan θ non-linearity', 'The pincushion that comes from steering with two mirrors in turn', 'The flatness of the field', 'The spot speed along a line'], a: 1, why: 'The lens maps angle to position, but the beam is still turned by one mirror and then by a second that sees it already turned sideways, and the pivots are apart; that distorts the field. A calibration table removes the rest.' },
    { q: 'For a resonant scanner the correct way to get evenly spaced pixels is to', choices: ['slow the mirror', 'clock the samples by position, not by time', 'use a larger beam', 'use a shorter wavelength'], a: 1, why: 'The spot position is $A\\sin\\omega t$, known exactly. The sample times are chosen so that the positions are evenly spaced.' }
  ],
  applications: [
    'Laser marking heads, which ship with a correction file for the whole field ([[laser-marking-and-cutting-heads]]).',
    'Scanning microscopes, which linearize the sinusoidal fast axis before showing the picture ([[laser-scanning-microscopes]]).',
    'Laser printers, which correct line position facet by facet ([[laser-printers]]).',
    '3-D printing and micromachining systems that need field accuracy of tens of micrometres.'
  ],
  history: 'Table-based correction became practical as digital memory became cheap. Before that, shaped drive waveforms and specially designed lenses did what a table now does.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — distortions of scanning systems and their compensation.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — scanner non-linearity and its correction.'
  ],
  sim: 'sm-distortion'
},

/* ================================================================ control and synchronisation */
{
  id: 'scanner-control-and-synchronisation', parent: 'scanning-methods', title: 'Scanner control and synchronisation', level: 3,
  short: 'A scanner needs the data to arrive at the right instant. A start-of-scan detector marks the beginning of each line, a pixel clock divides the line into pixels, and the mirror’s own motor is held in step by an encoder or a servo. Timing errors become position errors at the speed of the spot, often a kilometre a second.',
  keywords: ['pixel clock', 'start-of-scan', 'beam detect', 'line sync', 'synchronisation', 'jitter', 'servo tuning', 'galvo driver', 'XY2-100', 'encoder', 'phase-locked loop', 'line trigger', 'marking delays', 'polygon motor control'],
  prereq: ['galvanometer-scanners', 'polygon-scanners', 'resonant-and-mems-scanners'],
  related: ['scan-distortion-and-correction', 'raster-and-vector-scanning', 'laser-printers', 'laser-marking-and-cutting-heads', 'motors:incremental-encoders', 'motors:servo-tuning', 'electronics:pll', 'line-scan-inspection'],
  body: `
A scanner must put the right data on the right pixel. That needs three kinds of control working together: the **mirror** must be held where, or moving as, it should; the **line start** must be known; and the **pixel clock** must divide each line into equal steps.

### The pixel clock
If a line has $N$ pixels, is drawn at $f_L$ lines a second and a share $\\eta$ of each line is active, the pixel clock runs at

$$f_{\\mathrm{pix}} = \\frac{N f_L}{\\eta}$$

A 600 dpi printer scanning 210 mm (4961 pixels) at 3508 lines a second with 70 % of each line active needs 24.9 MHz. On the same printer the spot moves over the line at

$$v = \\frac{L f_L}{\\eta} = \\frac{0.21\\ \\mathrm{m}\\times 3508\\ \\mathrm{s^{-1}}}{0.7} = 1050\\ \\mathrm{m/s}$$

A timing error $\\Delta t$ is therefore a position error $v\\,\\Delta t$: 1 ns is 1.05 µm, against a pixel of 42.3 µm. A tenth of a pixel needs the clock accurate to 4 ns.

### Start-of-scan
Each line must start at the same place. A **start-of-scan** (or beam-detect) photodiode sits just outside the field, at the beginning of the line. When the beam crosses it, the pulse restarts the pixel clock. Without it the line start would depend on every facet's spacing error: a polygon facet whose edge is 30″ out of place makes its line start $2\\varepsilon f$ = 58 µm early or late at $f = 200$ mm, 1.4 pixels, visible as a ragged edge. With it the error is only the detector's jitter. Some systems add an end-of-scan detector to measure the line time and adjust the clock to keep the line length constant.

### Control of the mirror
- **Galvo.** The drive is a servo ([[motors:servo-tuning|servo tuning]]): position loop, velocity feedback, feed-forward and notch filters, tuned for a fast step without ringing. The command arrives as ±10 V or as a digital stream such as the XY2-100 protocol (16-bit positions at 100 kHz). Marking controllers add **delays**: the laser comes on only after the mirror has settled from a jump, and the beam follows the mirror's real lag.
- **Polygon.** A motor with an encoder or Hall sensors, locked to a crystal reference by a phase-locked loop ([[electronics:pll|PLL]]), so that the speed holds to a small fraction of a per cent.
- **Resonant mirror.** Not commanded in time. Its position sensor provides the line trigger, the electronics lock the pixel clock to it, and a position table gives sample times that make pixels even ([[scan-distortion-and-correction]]).
- **Stage or conveyor.** Line-scan cameras and scanning heads on a moving part take their line trigger from an encoder on the motion ([[motors:incremental-encoders|incremental encoders]]), so that every line is a fixed distance from the last whatever the speed.

> [!key] Timing is position: at a spot speed of a kilometre a second a nanosecond is a micrometre. A start-of-scan pulse restarts the pixel clock for every line, a phase-locked loop keeps the motor and the clock in step, and a servo holds the galvo.
`,
  ideas: [
    'The pixel clock divides the active line into pixels: f_pix = N f_L/η.',
    'A start-of-scan detector at the line start restarts the clock for every line and removes facet-to-facet timing errors.',
    'A timing error is a position error equal to the spot speed times the error, often 1 µm per nanosecond.',
    'A galvo is a servo tuned for a fast step; marking controllers add delays so the laser follows the mirror.',
    'A resonant mirror supplies the timing (a line trigger) and the electronics follow it.'
  ],
  pitfalls: [
    'The pixel clock is simply the line rate times the pixels — The share of the line that is active matters: the clock is faster by 1/η because the pixels must fit in the active part only.',
    'A faster mirror needs only a faster driver — At scan speeds of hundreds of metres a second, nanoseconds of jitter become micrometres of position error.',
    'The motor speed alone fixes the line start — Facet and shaft errors shift each line start; the start-of-scan detector is what corrects them every line.',
    'A resonant scanner is controlled like a galvo — It cannot be commanded to a position; the electronics lock to its motion and sample accordingly.'
  ],
  terms: [
    { term: 'Pixel clock', also: ['pixel rate', 'dot clock'], def: 'The clock that divides the active part of a scan line into pixels. Its frequency is f_pix = N f_L/η.' },
    { term: 'Start-of-scan detector', also: ['beam detect', 'BD', 'line sync', 'SOS'], def: 'A photodiode at the start of the scan line. The pulse it gives when the beam crosses it restarts the pixel clock for that line.' },
    { term: 'Jitter', also: ['timing jitter'], def: 'The random variation of a timing signal from one line or pixel to the next. At the spot speed of a scanner it becomes a position error.' },
    { term: 'Servo loop', also: ['position loop', 'closed loop'], def: 'The feedback that drives a galvo or a motor until a sensor reports the commanded position or speed.' },
    { term: 'Marking delays', also: ['laser-on delay', 'jump delay'], def: 'Times added in a marking controller so that the laser is switched on only when the mirror has settled and the beam follows its real position, not its command.' },
    { term: 'Phase-locked loop', also: ['PLL'], def: 'A circuit that adjusts an oscillator until its phase follows a reference. It holds a polygon motor’s speed and builds a pixel clock locked to a line signal.' }
  ],
  formulas: [
    {
      name: 'Pixel clock',
      expr: 'fp = N*fl/eta', tex: 'f_{\\mathrm{pix}} = \\frac{N\\,f_L}{\\eta}',
      vars: {
        fp: { name: 'pixel clock frequency', q: 'frequency', unit: 'MHz', tex: 'f_{\\mathrm{pix}}' },
        N: { name: 'pixels per line', int: true, value: 4961, min: 1, tex: 'N' },
        fl: { name: 'line rate', q: 'frequency', unit: 'Hz', value: 3508, tex: 'f_L' },
        eta: { name: 'active share of each line', q: 'ratio', unit: '%', value: 70, min: 1, max: 100, tex: '\\eta' }
      },
      solveFor: 'fp',
      note: 'The pixels fit into the active part of the line, so the clock runs faster than lines times pixels.',
      stories: { fp: 'A scanner draws {fl} lines a second with {N} pixels on each, {eta} of every line being active. What pixel clock does it need?' }
    },
    {
      name: 'Spot speed along the line',
      expr: 'v = L*fl/eta', tex: 'v = \\frac{L\\,f_L}{\\eta}',
      vars: {
        v: { name: 'spot speed on the target', q: 'speed', unit: 'm/s', tex: 'v' },
        L: { name: 'length of the active line', q: 'length', unit: 'mm', value: 210 },
        fl: { name: 'line rate', q: 'frequency', unit: 'Hz', value: 3508, tex: 'f_L' },
        eta: { name: 'active share of each line', q: 'ratio', unit: '%', value: 70, min: 1, max: 100, tex: '\\eta' }
      },
      solveFor: 'v',
      note: 'The active line, of length L, is drawn in the time η/f_L.',
      stories: { v: 'A line of {L} is drawn {fl} times a second, with {eta} of each line active. How fast does the spot move?' }
    },
    {
      name: 'Position error from a timing error',
      expr: 'dx = v*dt', tex: '\\Delta x = v\\,\\Delta t',
      vars: {
        dx: { name: 'position error', q: 'length', unit: 'µm', tex: '\\Delta x' },
        v: { name: 'spot speed on the target', q: 'speed', unit: 'm/s', value: 1050, tex: 'v' },
        dt: { name: 'timing error', q: 'time', unit: 'ns', value: 4, tex: '\\Delta t' }
      },
      solveFor: 'dx',
      note: 'Solve for the timing error to find how accurate the clock must be.',
      stories: { dx: 'A spot moves at {v} and the clock is wrong by {dt}. How far is the pixel misplaced?', dt: 'A spot moves at {v}; a pixel may be misplaced by at most {dx}. How accurate must the timing be?' }
    }
  ],
  examples: [
    {
      title: 'The clock of a printer',
      q: 'A 600 dpi printer scans a line of 210 mm (4961 pixels) 3508 times a second, 70 % of each line being active. What pixel clock does it need, and how fast does the spot travel?',
      steps: [
        { text: 'The clock', tex: 'f_{\\mathrm{pix}} = \\frac{4961\\times 3508}{0.7}\\ \\mathrm{s^{-1}} = 24.9\\ \\mathrm{MHz}' },
        { text: 'The spot speed', tex: 'v = \\frac{0.21\\ \\mathrm{m}\\times 3508}{0.7}\\ \\mathrm{m/s} = 1050\\ \\mathrm{m/s}' }
      ],
      a: 'A clock of about 25 MHz and a spot moving at about 1050 m/s: a timing error of 1 ns misplaces a pixel by 1.05 µm.'
    },
    {
      title: 'A badly placed facet',
      q: 'A facet of a polygon is displaced so that its line starts 30″ of mechanical angle early. The scan lens has $f = 200$ mm and the pixel is 42.3 µm. By how much is the line shifted, and how large a start-of-scan jitter is permitted for the shift to stay below a tenth of a pixel?',
      steps: [
        { text: 'The shift', tex: '\\Delta x = 2\\varepsilon f = 2\\times 145.4\\ \\mu\\mathrm{rad}\\times 200\\ \\mathrm{mm} = 58\\ \\mu\\mathrm{m}' },
        { text: 'A tenth of a pixel is 4.2 µm; at 1050 m/s the timing must be better than', tex: '\\Delta t = \\frac{4.2\\ \\mu\\mathrm{m}}{1050\\ \\mathrm{m/s}} = 4\\ \\mathrm{ns}' }
      ],
      a: 'The uncorrected shift is 58 µm, 1.4 pixels. A start-of-scan detector removes it, leaving only its own jitter, which must be below about 4 ns.'
    }
  ],
  quiz: [
    { q: 'A scanner draws 2000 lines a second with 1000 pixels per line, 80 % of each line being active. What pixel clock does it need, in MHz?', answer: 2.5, unit: 'MHz', why: '$f_{\\mathrm{pix}} = N f_L/\\eta = 1000\\times 2000/0.8 = 2.5\\times 10^{6}$ Hz.' },
    { q: 'A spot moves at 500 m/s. A timing error of 10 ns displaces a pixel by how many micrometres?', answer: 5, unit: 'µm', why: '$\\Delta x = v\\Delta t = 500\\times 10\\times 10^{-9} = 5\\times 10^{-6}$ m.' },
    { q: 'What does a start-of-scan detector do?', choices: ['It focuses the beam', 'It restarts the pixel clock at the beginning of every line', 'It cools the mirror', 'It measures the laser power'], a: 1, why: 'The photodiode at the line start gives a pulse when the beam crosses it. That pulse synchronizes the pixel clock, so facet-to-facet errors do not shift the lines.' },
    { q: 'A resonant mirror is commanded to a position like a galvo.', a: false, why: 'A resonant mirror swings at its own frequency and cannot be commanded to stop or to a given angle. Its motion supplies the timing and the electronics follow it.' },
    { q: 'Why do marking controllers add a laser-on delay after a jump?', choices: ['To save laser power', 'So that the laser is switched on only when the mirror has settled at the new position', 'To cool the lens', 'To change the wavelength'], a: 1, why: 'After a jump the mirror needs a settling time. Switching the laser on earlier would mark the path or the wrong place.' }
  ],
  applications: [
    'Laser printers: the beam-detect pulse, the pixel clock and the polygon motor’s speed lock ([[laser-printers]]).',
    'Laser marking controllers with delays and digital galvo links ([[laser-marking-and-cutting-heads]]).',
    'Scanning microscopes that lock the pixel clock to a resonant mirror’s line trigger ([[laser-scanning-microscopes]]).',
    'Line-scan systems triggered from the encoder of a conveyor ([[line-scan-inspection]]).'
  ],
  history: 'A start-of-scan (beam-detect) pulse is a standard part of the laser printer: facet errors, however small, appear on the page as ragged edges unless every line is re-synchronized. Digital galvo interfaces replaced analogue command voltages as marking controllers moved to digital electronics.',
  sources: [
    'G. F. Marshall and G. E. Stutz (eds.), *Handbook of Optical and Laser Scanning* (CRC Press) — scanner control, synchronisation and drive electronics.',
    'L. Beiser, *Unified Optical Scanning Technology* (Wiley) — start-of-scan detection and clock generation.'
  ],
  sim: 'sm-sync'
}

);
