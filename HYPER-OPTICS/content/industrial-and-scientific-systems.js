/* HYPER-OPTICS · content/industrial-and-scientific-systems.js — the topic "Industrial and scientific systems"
 * (parent: industrial-and-scientific-systems). Larger systems, each read from source to detector with the five
 * questions of how-to-read-an-optical-system:
 *   the-vision-inspection-cell       photolithography            laser-processing-systems
 *   spectroscopy-in-industry         astronomical-observatories-and-adaptive-optics
 *   earth-observation-cameras        medical-imaging-optics      optical-sorting-and-colour-measurement
 *   interferometers-in-precision-engineering                     cinema-and-stage-lighting-systems
 * Simulations are in sims/industrial-and-scientific-systems.js (ids ix-…).
 */
Hyper.add(

/* ================================================================ the vision inspection cell */
{
  id: 'the-vision-inspection-cell', parent: 'industrial-and-scientific-systems', title: 'The vision inspection cell', level: 2,
  short: 'A vision inspection cell is a small optical system built into a production line: a flashed light, a lens and a camera look at every part, a processor decides, and an air jet pushes the bad ones aside. Every stage has a number that can be worked out before anything is bought.',
  keywords: ['vision inspection cell', 'machine vision cell', 'inspection station', 'conveyor', 'reject gate', 'ejector', 'strobe', 'trigger', 'cycle time', 'latency', 'exposure', 'motion blur', 'pixels on defect', 'quality control', 'production line'],
  prereq: ['the-machine-vision-system', 'choosing-a-machine-vision-lens', 'how-to-read-an-optical-system'],
  related: ['machine-vision-lighting', 'triggering-and-strobing', 'pixels-per-feature', 'camera-interfaces', 'telecentric-imaging', 'automated-optical-inspection', 'line-scan-inspection', 'optical-sorting-and-colour-measurement'],
  body: `
A **vision inspection cell** is a small optical system built into a production line. It looks at every part, decides within a fraction of a second whether the part is good, and pushes the bad ones aside. The pages on [[the-machine-vision-system|machine vision]] teach the pieces one by one; here a whole cell is read with the [[how-to-read-an-optical-system|five questions]], in the order the light travels.

### The example
Moulded parts 40 mm across ride a belt at 0.5 m/s, 100 mm apart: five a second, 300 a minute. The defect to catch is a chip 0.15 mm wide. A 5-megapixel camera (2448 × 2048 pixels of 3.45 µm, a sensor 8.4 × 7.1 mm) looks down from 300 mm.

### Following the light
| # | Part | What it does here | Page |
|---|---|---|---|
| 1 | Red LED bar light, flashed | gives each part one short, strong, repeatable flash of one colour | [[machine-vision-lighting]] |
| 2 | The part | reflects and scatters that light; a chip changes where it goes | [[specular-and-diffuse-reflection]] |
| 3 | Red band-pass filter | lets the LED's colour through and blocks the room lights | [[interference-filters]] |
| 4 | Lens, f = 35 mm, f/5.6 | draws the part on the sensor; the f-number trades light for depth of field | [[choosing-a-machine-vision-lens]] |
| 5 | Sensor with global shutter | turns light into numbers all at once, so the moving part is not sheared | [[rolling-and-global-shutter]] |
| 6 | Trigger (electronic) | a photoelectric eye or encoder fires flash and camera when the part is in the field | [[triggering-and-strobing]] |
| 7 | Processor and air jet (electronic) | compares the picture with the rule; a failed part is blown off downstream | [[automated-optical-inspection]] |

### Numbers, stage by stage
- **Field and lens.** A 60 mm field at 300 mm needs $f \\approx 37$ mm. The standard 35 mm lens gives a field of 63.9 × 53.5 mm.
- **Sampling.** 63.9 mm over 2448 pixels is 26.1 µm per pixel, so the 0.15 mm chip covers 5.7 pixels. [[pixels-per-feature]] asks for three or four at least.
- **Motion.** At 0.5 m/s the part travels one whole pixel in 52 µs. To keep the blur under half a pixel the exposure must be about 26 µs or less. No room light does that, which is why the light is flashed.
- **Data.** One picture per part is 5 frames a second of 5 MB each, 25 MB/s: easy for Gigabit Ethernet ([[camera-interfaces]]). The frame rate is set by the parts per minute, not by what the camera could do.
- **Time.** The cycle is 200 ms. Readout 20 ms, processing 40 ms and the valve 5 ms take 65 ms, during which the part moves 33 mm, so the jet must sit at least that far past the camera.

### What usually goes wrong
Glare on a shiny part (change the lighting geometry, not the camera); parts at different heights (use a [[telecentric-imaging|telecentric lens]]); light that drifts as the LED warms; dust on the window; a trigger that fires a few millimetres early. Most "camera problems" start at stage 1 or stage 6.

> [!key] A cell is a chain: light, part, filter, lens, sensor, trigger, processor, jet. Each link has a number that can be calculated first, and the weakest link, not the camera, sets the result.
`,
  ideas: [
    'Read a cell in the order of the light: lamp, part, filter, lens, sensor, then the electronics that decide and act.',
    'Pixels on the smallest defect come from the field width and the pixel count; three to four is the working minimum.',
    'Motion blur sets the longest exposure; on a moving belt that usually means flashing the light.',
    'The frame rate needed is the parts per minute divided by 60, not the camera\'s maximum.',
    'Latency (exposure, readout, processing, valve) times belt speed gives the distance from camera to reject jet.'
  ],
  pitfalls: [
    'A better camera fixes a poor inspection — Most failures are found in the lighting and the trigger. A part lit badly stays badly seen however many megapixels look at it.',
    'The exposure can be as long as the camera allows — On a moving belt the part moves several pixels in a millisecond. The exposure is limited by motion blur, so the light must be strong and short.',
    'The camera needs to run at its top frame rate — It needs one picture per part. A 5 MP camera at 5 frames a second makes 25 MB/s, a fraction of what it could send.',
    'The reject jet can be anywhere along the belt — It must be far enough downstream that the verdict arrives first: belt speed times total delay.'
  ],
  terms: [
    { term: 'Inspection cell', also: ['vision station', 'inspection station'], def: 'A self-contained machine-vision installation on a production line: lighting, lens, camera, trigger, processor and the output that rejects or sorts parts, often inside a light-tight cover.' },
    { term: 'Cycle time', also: ['takt time'], def: 'The time available for one part: 60 s divided by the parts per minute. All the stages of the cell must fit in it, or overlap.' },
    { term: 'Latency', also: ['trigger-to-verdict time'], def: 'The time from the trigger to the verdict: exposure, readout, transfer and processing. Belt speed times latency is how far the part has moved when the answer arrives.' },
    { term: 'Ejector', also: ['reject gate', 'air jet', 'diverter'], def: 'The actuator that removes a rejected part from the line, usually a short puff of compressed air or a pusher, timed from the encoder or belt speed.' },
    { term: 'Ambient-light rejection', def: 'Making the cell insensitive to room light by flashing a bright light of one colour and using a filter of that colour in front of the lens, or by covering the cell.' }
  ],
  formulas: [
    {
      name: 'Pixels on a defect',
      expr: 'n = d*Npx/W', tex: 'n = \\frac{d\\,N_{\\mathrm{px}}}{W}',
      vars: {
        n: { name: 'pixels across the defect', tex: 'n' },
        d: { name: 'width of the defect', q: 'length', unit: 'mm', value: 0.15 },
        Npx: { name: 'pixels across the sensor', value: 2448, min: 100, max: 20000, int: true, tex: 'N_{\\mathrm{px}}' },
        W: { name: 'width of the field on the part', q: 'length', unit: 'mm', value: 63.9 }
      },
      solveFor: 'n',
      note: 'Look for three to four pixels across the smallest defect, more for measurement.',
      stories: { n: 'A defect {d} wide lies in a field {W} wide seen by {Npx} pixels. How many pixels span it?', W: 'A defect {d} wide must cover {n} pixels on a sensor of {Npx} pixels. How wide can the field be?' }
    },
    {
      name: 'Longest exposure for a given blur',
      expr: 't = b*W/(Npx*v)', tex: 't = \\frac{b\\,W}{N_{\\mathrm{px}}\\,v}',
      vars: {
        t: { name: 'longest exposure', q: 'time', unit: 'µs' },
        b: { name: 'blur allowed, in pixels', value: 0.5, min: 0.05, max: 10 },
        W: { name: 'width of the field on the part', q: 'length', unit: 'mm', value: 63.9 },
        Npx: { name: 'pixels across the sensor', value: 2448, min: 100, max: 20000, int: true, tex: 'N_{\\mathrm{px}}' },
        v: { name: 'speed of the part', q: 'speed', unit: 'm/s', value: 0.5 }
      },
      solveFor: 't',
      note: 'The part moves v·t during the exposure; one pixel on the part is W divided by the pixel count.',
      stories: { t: 'Parts move at {v} through a field {W} wide seen by {Npx} pixels. How long may the exposure be if the blur is to stay under {b} pixel?', v: 'An exposure of {t} may smear a part by {b} pixel in a field {W} wide seen by {Npx} pixels. How fast may the part move?' }
    },
    {
      name: 'Distance from camera to reject jet',
      expr: 'x = v*(t1 + t2 + t3)', tex: 'x = v\\,(t_1 + t_2 + t_3)',
      vars: {
        x: { name: 'distance from camera to jet', q: 'length', unit: 'mm' },
        v: { name: 'speed of the part', q: 'speed', unit: 'm/s', value: 0.5 },
        t1: { name: 'exposure and readout', q: 'time', unit: 'ms', value: 20 },
        t2: { name: 'processing', q: 'time', unit: 'ms', value: 40 },
        t3: { name: 'valve and jet', q: 'time', unit: 'ms', value: 5 }
      },
      solveFor: 'x',
      note: 'The minimum distance; add a margin for jitter and for the jet\'s own width.',
      stories: { x: 'A belt moves at {v}. Readout takes {t1}, processing {t2} and the valve {t3}. How far past the camera must the jet be?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the lens for a 60 mm field',
      q: 'The cell above needs a field at least 60 mm wide at a working distance of 300 mm. The sensor is 8.446 mm wide. What focal length is needed, and what does the nearest standard lens give?',
      steps: [
        { text: 'For a thin lens the field $W$ at distance $s$ on a sensor of width $w$ needs', tex: 'f = \\frac{s}{1 + W/w} = \\frac{300}{1 + 60/8.446} = 37.0\\ \\mathrm{mm}' },
        'Standard fixed lenses come in 25, 35 and 50 mm. The 35 mm lens is the nearest that is not longer than 37 mm, so the field is slightly larger than asked: 63.9 mm. The 50 mm lens would see only 42 mm and cut the part off.',
        'A 25 mm lens would show 92.9 mm: the whole part, but each pixel would be 38 µm and the chip would fall to 4 pixels.'
      ],
      a: 'f ≈ 37 mm; a 35 mm lens gives a 63.9 × 53.5 mm field and 26.1 µm pixels.'
    },
    {
      title: 'Doubling the speed',
      q: 'The line is sped up to 1 m/s, 600 parts a minute. What changes in the cell?',
      steps: [
        'The cycle halves to 100 ms. The stages (65 ms) still fit.',
        'The part now moves 26 µm in 26 µs, so for the same half-pixel blur the exposure must be 13 µs: half as long.',
        'Half the exposure means half the light on each pixel unless the flash is twice as bright. Either the LED current rises, the lens opens one stop, or the camera gain goes up and the noise with it.',
        'The jet must now be 65 mm past the camera, and the data rate rises to 50 MB/s, still within Gigabit Ethernet.'
      ],
      a: 'The exposure halves to 13 µs, so the light must double (or the aperture open one stop); the jet moves out to 65 mm.'
    }
  ],
  quiz: [
    { q: 'A line carries 300 parts a minute and the cell takes one picture of each part. What frame rate must the camera sustain, in frames per second?', answer: 5, why: '300 parts a minute is 300 / 60 = 5 parts a second, so 5 pictures a second. A camera rated for 30 or 100 frames a second is mostly idle.' },
    { q: 'A part moving at 0.5 m/s is imaged with 26 µm pixels. Which exposure keeps the blur near half a pixel?', choices: ['26 µs', '260 µs', '2.6 ms', '26 ms'], a: 0, why: 'Half a pixel is 13 µm; at 0.5 m/s that takes 13 µm / 0.5 m/s = 26 µs. A millisecond exposure would smear the part over 19 pixels.' },
    { q: 'Doubling the belt speed while keeping the same blur means the exposure must…', choices: ['halve, so the light must double', 'double', 'stay the same', 'halve, but the light can stay the same'], a: 0, why: 'The blur is speed times exposure, so twice the speed needs half the time. With half the time each pixel collects half the light unless the light, the aperture or the gain makes up for it.' },
    { q: 'A shiny metal cap shows a bright glare patch that hides a defect. A camera with more pixels will cure this.', a: false, why: 'The glare is a lighting problem: the light arrives from a direction that reflects straight into the lens. Changing the geometry (dome, dark-field or polarized light) cures it; more pixels only record the glare more finely.' },
    { q: 'The belt moves at 0.8 m/s and the cell needs 60 ms from trigger to verdict. How far past the camera, at least, must the reject jet be, in millimetres?', answer: 48, why: 'x = v × t = 0.8 m/s × 0.060 s = 0.048 m. In practice add a margin for jitter and the width of the jet.' }
  ],
  applications: [
    'Bottling and capping lines: fill level, cap position, label presence and print, a few hundred to tens of thousands of containers a minute.',
    'Pharmaceutical packaging: blister packs, vials and syringes checked for missing tablets, particles and cracks.',
    'Metal and plastic parts: chips, flash, burrs, dimensions measured to a fraction of a pixel.',
    'Electronics assembly: solder joints and component placement before and after reflow ([[automated-optical-inspection]]).',
    'Food packaging: seal integrity, foreign objects and print-code checks.'
  ],
  history: 'Vision inspection became practical in the 1980s when solid-state cameras replaced tube cameras and cheap processors could handle an image in a fraction of a second. Each rise in sensor resolution and processing speed since has moved checks from sampling a few parts to inspecting every one.',
  sources: [
    'C. Steger, M. Ulrich and C. Wiedemann, *Machine Vision Algorithms and Applications* (Wiley-VCH) — the chain from illumination to measurement.',
    'A. Hornberg (ed.), *Handbook of Machine and Computer Vision* (Wiley-VCH) — components, interfaces and system design.',
    'European Machine Vision Association, standard EMVA 1288 — how camera performance is stated and compared.'
  ],
  sim: 'ix-cell'
},

/* ================================================================ photolithography */
{
  id: 'photolithography', parent: 'industrial-and-scientific-systems', title: 'Photolithography: printing chips with light', level: 3,
  short: 'A lithography scanner photographs a mask four times smaller onto a coated silicon wafer, once for each layer of a chip. The smallest printed detail is k₁λ/NA and the depth of focus k₂λ/NA², which is why the industry moved from 365 nm to 248, 193 and finally 13.5 nm light, and from lenses to mirrors.',
  keywords: ['photolithography', 'lithography', 'scanner', 'stepper', 'mask', 'reticle', 'wafer', 'resist', 'critical dimension', 'CD', 'k1', 'immersion lithography', 'EUV', 'extreme ultraviolet', 'ArF', 'KrF', 'i-line', 'depth of focus', 'resolution enhancement', 'chip'],
  prereq: ['resolution-limits', 'numerical-aperture', 'the-grating-equation'],
  related: ['co2-and-excimer-lasers', 'depth-of-focus', 'fourier-optics', 'spatial-filtering', 'telecentricity', 'interferometers-in-precision-engineering', 'multilayer-coatings', 'dielectric-mirrors', 'microlens-arrays'],
  body: `
Every chip is printed with light, one layer at a time, in a machine called a **scanner**. It is a camera running backwards: it takes a picture of a mask and *shrinks* it onto a wafer coated with light-sensitive resist. By the numbers it is the most demanding optical system built: details of a few tens of nanometres, lenses of more than twenty elements, a wafer positioned to a nanometre or two. [[how-to-read-an-optical-system|Read from source to detector]] it goes like this.

### Following the light
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Source: mercury lamp (365 nm), excimer laser (248 or 193 nm), or tin plasma (13.5 nm) | the wavelength sets the finest detail | [[co2-and-excimer-lasers]] |
| 2 | Illuminator: homogenizer and pupil shaper | makes the light even over a slit and chooses from which directions it arrives | [[microlens-arrays]] |
| 3 | Mask (reticle), four times the size of the print | holds the pattern; it diffracts the light like a grating | [[the-grating-equation]] |
| 4 | Projection lens, 4× reduction (mirrors for 13.5 nm) | catches the diffracted light and re-forms the pattern; its aperture is the NA | [[numerical-aperture]] |
| 5 | Water film between last lens and wafer (immersion) | raises the NA above 1 | [[refractive-index]] |
| 6 | Resist-coated wafer on a moving stage | records the image; mask and wafer move together at 4 : 1 | [[interferometers-in-precision-engineering]] |

The wafer is 300 mm across and the exposed field 26 × 33 mm, so the mask pattern is 104 × 132 mm. At 13.5 nm every material absorbs, so the whole path is mirrors in vacuum, coated with about 7 nm-period molybdenum–silicon multilayers ([[dielectric-mirrors]]) that reflect 70 % at best. Ten mirrors pass $0.7^{10}$, about 3 %, of the light.

### Resolution and focus
The mask diffracts light into orders; the lens must catch at least the zeroth and one first order to make any image. That sets the smallest half-pitch, the **critical dimension**:

$$\\mathrm{CD} = k_1\\,\\frac{\\lambda}{\\mathrm{NA}} \\qquad \\mathrm{DOF} = k_2\\,\\frac{\\lambda}{\\mathrm{NA}^2}$$

With light arriving straight on, $k_1 \\ge 0.5$; with light arriving off-axis from the two sides, the two first orders are enough and $k_1$ can reach the physical floor of 0.25. Real processes work near 0.3 to 0.4 using tricks: off-axis light, phase-shifting masks, corrections drawn into the mask pattern, and several exposures per layer.

| Light | λ | NA | CD at k₁ = 0.35 | DOF at k₂ = 0.5 |
|---|---|---|---|---|
| mercury i-line | 365 nm | up to about 0.65 | 197 nm | 432 nm |
| KrF excimer | 248 nm | 0.93 | 93 nm | 143 nm |
| ArF excimer | 193 nm | 0.93 | 73 nm | 112 nm |
| ArF immersion | 193 nm | 1.35 | 50 nm | 53 nm |
| EUV | 13.5 nm | 0.33 | 14 nm | 62 nm |
| high-NA EUV | 13.5 nm | 0.55 | 8.6 nm | 22 nm |

### The price of resolution
Smaller $\\lambda$ and larger NA both shrink the **depth of focus**, which falls as $1/\\mathrm{NA}^2$: at high NA the wafer must be flat and held in focus to a few tens of nanometres across the whole field, which is why every scanner measures the wafer's height and tilts it before each exposure.

> [!key] Resolution is $k_1\\lambda/\\mathrm{NA}$ and focus is $k_2\\lambda/\\mathrm{NA}^2$. Shorter light and a wider lens print finer detail, but each step costs depth of focus, so the machine's real art is holding a nanometre-flat wafer still under a perfect image.
`,
  ideas: [
    'A scanner images a mask four times larger than the print, so the lens reduces by 4.',
    'The smallest half-pitch is k₁λ/NA; the physical floor of k₁ is 0.25, reached with off-axis illumination.',
    'The depth of focus is k₂λ/NA²: finer detail leaves the wafer only tens of nanometres of focus.',
    'Wavelength fell from 365 nm to 248, 193 and 13.5 nm; water immersion lifted the NA from 0.93 to 1.35.',
    'At 13.5 nm no glass transmits, so extreme-ultraviolet scanners use only mirrors, in vacuum, and lose most of the light.'
  ],
  pitfalls: [
    'Resolution comes only from a shorter wavelength — It is k₁λ/NA. Immersion raised the NA and clever illumination and masks lowered k₁; both gave finer detail at 193 nm than the wavelength alone suggests.',
    'The nanometres in a chip\'s "node name" are the size of its features — The names are labels of an industry generation; actual printed half-pitches and gate lengths differ from them.',
    'A larger NA is always better — The depth of focus falls as 1/NA², so a larger NA demands a flatter wafer and a more accurate focus control.',
    'Extreme ultraviolet is simply a shorter-wavelength laser — Its light comes from a tin plasma, cannot pass through glass or air, and is steered only by multilayer mirrors in vacuum.'
  ],
  terms: [
    { term: 'Scanner', also: ['stepper', 'lithography tool'], def: 'The machine that projects the image of a mask onto a wafer. A stepper exposes a whole field at once; a scanner moves mask and wafer together under a slit of light.' },
    { term: 'Mask', also: ['reticle', 'photomask'], def: 'A plate of fused silica carrying the pattern of one chip layer, usually four times the printed size. In EUV it is a mirror rather than a transmitting plate.' },
    { term: 'Critical dimension', also: ['CD', 'half-pitch'], def: 'The smallest feature width a process must print and control, usually given as half of the smallest repeating pitch.' },
    { term: 'k₁ factor', also: ['k1', 'process factor'], def: 'The dimensionless number in CD = k₁λ/NA that measures how hard the process works against the diffraction limit. Its physical floor is 0.25 for a single exposure.' },
    { term: 'Immersion lithography', also: ['water immersion'], def: 'Filling the gap between the last lens and the wafer with ultrapure water, which raises the refractive index there and so the largest NA from 0.93 to 1.35.' },
    { term: 'Extreme ultraviolet', also: ['EUV', '13.5 nm'], def: 'Light of 13.5 nm wavelength, made by a laser-heated tin plasma and focused only by multilayer mirrors in vacuum because every material absorbs it.' },
    { term: 'Resist', also: ['photoresist'], def: 'The light-sensitive layer on the wafer; where the image is bright enough it changes chemically so that it can be washed away (or left) to transfer the pattern.' }
  ],
  formulas: [
    {
      name: 'Smallest printed half-pitch',
      expr: 'CD = k1*lambda/NA', tex: '\\mathrm{CD} = k_1\\,\\frac{\\lambda}{\\mathrm{NA}}',
      vars: {
        CD: { name: 'critical dimension (half-pitch)', q: 'length', unit: 'nm', tex: '\\mathrm{CD}' },
        k1: { name: 'process factor', value: 0.3, min: 0.25, max: 1, tex: 'k_1' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 193, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.35, min: 0.1, max: 1.5, tex: '\\mathrm{NA}' }
      },
      solveFor: 'CD',
      note: 'k₁ cannot go below 0.25 in a single exposure.',
      stories: { CD: 'A scanner uses light of {lambda} with a numerical aperture of {NA}, and the process runs at k₁ = {k1}. What half-pitch can it print?', NA: 'To print a half-pitch of {CD} at {lambda} with k₁ = {k1}, what numerical aperture is needed?' }
    },
    {
      name: 'Depth of focus',
      expr: 'DOF = k2*lambda/NA^2', tex: '\\mathrm{DOF} = k_2\\,\\frac{\\lambda}{\\mathrm{NA}^2}',
      vars: {
        DOF: { name: 'depth of focus', q: 'length', unit: 'nm', tex: '\\mathrm{DOF}' },
        k2: { name: 'focus factor', value: 0.5, min: 0.2, max: 2, tex: 'k_2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 193, tex: '\\lambda' },
        NA: { name: 'numerical aperture', value: 1.35, min: 0.1, max: 1.5, tex: '\\mathrm{NA}' }
      },
      solveFor: 'DOF',
      note: 'The total range of wafer height over which the image stays acceptable; k₂ depends on the feature and the tolerance.'
    },
    {
      name: 'Mask size from wafer size',
      expr: 'Wm = M*Ww', tex: 'W_{m} = M\\,W_{w}',
      vars: {
        Wm: { name: 'size of the field on the mask', q: 'length', unit: 'mm', tex: 'W_{m}' },
        M: { name: 'reduction of the projection lens', value: 4, min: 1, max: 10, tex: 'M' },
        Ww: { name: 'size of the field on the wafer', q: 'length', unit: 'mm', value: 26, tex: 'W_{w}' }
      },
      solveFor: 'Wm',
      note: 'A 26 × 33 mm field on the wafer comes from a 104 × 132 mm pattern on the mask.'
    }
  ],
  examples: [
    {
      title: 'What can immersion print?',
      q: 'An ArF immersion scanner uses 193 nm light and NA 1.35. What half-pitch does it print at $k_1 = 0.35$ and at the single-exposure limit $k_1 = 0.25$?',
      steps: [
        { text: 'At the usual process factor:', tex: '\\mathrm{CD} = 0.35 \\times \\frac{193}{1.35} = 50\\ \\mathrm{nm}' },
        { text: 'At the limit:', tex: '\\mathrm{CD} = 0.25 \\times \\frac{193}{1.35} = 35.7\\ \\mathrm{nm}' },
        'Anything finer than about 36 nm needs more than one exposure per layer (multiple patterning), or a shorter wavelength.'
      ],
      a: 'About 50 nm in routine use and 36 nm at the absolute limit of a single exposure.'
    },
    {
      title: 'How flat must the wafer be?',
      q: 'With $k_2 = 0.5$, compare the depth of focus of the immersion scanner (193 nm, NA 1.35) with a dry ArF scanner (193 nm, NA 0.93).',
      steps: [
        { text: 'Immersion:', tex: '\\mathrm{DOF} = 0.5\\,\\frac{193}{1.35^2} = 53\\ \\mathrm{nm}' },
        { text: 'Dry:', tex: '\\mathrm{DOF} = 0.5\\,\\frac{193}{0.93^2} = 112\\ \\mathrm{nm}' },
        'The finer detail of immersion costs half the focus range, and the wafer surface must be level within a few tens of nanometres across the exposure.'
      ],
      a: '53 nm against 112 nm: immersion prints finer detail but has half the depth of focus.'
    }
  ],
  quiz: [
    { q: 'A scanner uses 193 nm light with NA 1.35 and runs at $k_1 = 0.3$. What half-pitch does it print, in nanometres?', answer: 42.9, why: 'CD = k₁λ/NA = 0.3 × 193 / 1.35 = 42.9 nm.' },
    { q: 'Going from NA 0.33 to NA 0.55 at the same wavelength, the depth of focus becomes…', choices: ['about 2.8 times smaller', 'about 1.7 times smaller', 'unchanged', 'larger'], a: 0, why: 'DOF goes as 1/NA²: (0.55/0.33)² = 2.78. Resolution improves by 1.67, but focus tightens by the square.' },
    { q: 'Which change can raise the NA of a 193 nm scanner above 1?', choices: ['A film of water between the last lens and the wafer', 'A larger mask', 'A more powerful laser', 'A longer exposure'], a: 0, why: 'NA = n sin θ, and n is 1 in air so NA cannot exceed 1. Water, with an index near 1.4 at 193 nm, allows 1.35.' },
    { q: 'Extreme-ultraviolet scanners use mirrors instead of lenses because every material absorbs 13.5 nm light.', a: true, why: 'Glass, air and all other materials absorb it strongly. Multilayer mirrors in vacuum are the only way to steer it, and each reflects only about 70 %.' },
    { q: 'A 13.5 nm scanner has ten mirrors, each reflecting 70 % of the light. What percentage of the source light reaches the wafer (ignoring other losses)?', answer: 2.8, why: '0.7 raised to the power 10 is 0.028, about 3 %. This is why EUV needs a source of hundreds of watts to deliver a modest power at the wafer.' }
  ],
  applications: [
    'Making every processor, memory and sensor chip: tens of exposures, one per layer, on each wafer.',
    'Display panels and printed circuit patterns, using the same principle at coarser scale.',
    'Micro-electromechanical systems and photonic chips, whose waveguides and gratings are printed the same way.',
    'Mask making and mask inspection, which use similar optics at higher magnification.'
  ],
  history: 'Contact printing of circuits with ultraviolet light began in the early 1960s. Projection scanners with reduction lenses followed in the 1970s and 1980s, the step to 248 nm excimer light came in the 1990s, 193 nm in the 2000s, water immersion around 2006 and EUV in volume production at the end of the 2010s.',
  sources: [
    'C. Mack, *Fundamental Principles of Optical Lithography* (Wiley) — resolution, depth of focus and the k₁ and k₂ factors.',
    'J. W. Goodman, *Introduction to Fourier Optics* — imaging as the passing of diffraction orders through an aperture.',
    'M. Born and E. Wolf, *Principles of Optics*, chapter on diffraction theory of image formation — the cut-off of a coherent and a partially coherent system.'
  ],
  sim: 'ix-litho'
},

/* ================================================================ laser processing systems */
{
  id: 'laser-processing-systems', parent: 'industrial-and-scientific-systems', title: 'Laser processing machines', level: 2,
  short: 'A laser cutting or welding machine carries a kilowatt beam from a laser through a fibre or mirrors to a head that focuses it to a spot a fraction of a millimetre wide. The spot size and the Rayleigh range decide what it can cut, and the whole thing lives inside a Class 4 enclosure.',
  keywords: ['laser cutting', 'laser welding', 'laser processing', 'fibre laser', 'CO2 laser', 'cutting head', 'focusing head', 'process fibre', 'collimator', 'assist gas', 'nozzle', 'protective window', 'spot size', 'Rayleigh range', 'sheet metal', 'kerf', 'Class 4', 'enclosure'],
  prereq: ['focusing-a-laser-beam', 'beam-quality-m-squared', 'laser-marking-and-cutting-heads'],
  related: ['fibre-lasers', 'co2-and-excimer-lasers', 'rayleigh-range', 'laser-safety-classes', 'laser-eye-hazards-and-eyewear', 'optical-windows', 'laser-damage-and-coating-durability', 'single-mode-and-multimode-fibre', 'galvanometer-scanners', 'scan-lenses-and-f-theta'],
  body: `
A laser cutting or welding machine is a simple optical system with an unforgiving job: put kilowatts into a spot a fraction of a millimetre across, keep it at the right height for hours, and stay safe while doing so. [[how-to-read-an-optical-system|Read from source to workpiece]]:

### Following the light
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Laser: fibre laser at 1.07 µm, or CO₂ at 10.6 µm | makes a continuous beam, typically 1 to 20 kW | [[fibre-lasers]], [[co2-and-excimer-lasers]] |
| 2 | Delivery: process fibre of 50 to 200 µm core, or a mirror path | carries the beam to the moving head; a fibre bends, a CO₂ beam needs mirrors | [[single-mode-and-multimode-fibre]] |
| 3 | Collimator | turns the cone leaving the fibre into a parallel beam | [[beam-expanders]] |
| 4 | Focusing lens | images the fibre end as the spot on the work | [[focusing-a-laser-beam]] |
| 5 | Protective window | a cheap, replaceable plate that keeps spatter off the lens | [[optical-windows]] |
| 6 | Nozzle with assist gas | the beam passes its hole; the gas blows molten metal out of the cut | — |
| 7 | Workpiece | absorbs the light and melts or vaporizes | [[specular-and-diffuse-reflection]] |

### The spot and its range
For a fibre-delivered head the focus is the fibre end imaged with the ratio of the two focal lengths: spot diameter = core × $f_\\text{focus}/f_\\text{collimator}$. A 100 µm core with a 100 mm collimator and a 200 mm focusing lens gives a 200 µm spot. The beam of a multimode fibre has $M^2$ of about 18 (here: core radius 50 µm × NA 0.12), so the Rayleigh range is

$$z_R = \\frac{\\pi w_0^2}{M^2 \\lambda} = \\frac{\\pi (100\\ \\mu\\mathrm{m})^2}{17.6 \\times 1.07\\ \\mu\\mathrm{m}} = 1.7\\ \\mathrm{mm}$$

so the beam stays tight over a depth $2 z_R = 3.3$ mm. At 4 kW the spot carries about 13 MW/cm² averaged over its area.

### Thick sheet needs a fat spot
Cut 10 mm steel with the focus in the middle and the beam grows from 0.2 mm at the focus to 0.63 mm at the faces: a tenfold fall of irradiance. A bigger spot (a longer focal length) has a longer $z_R$, which grows as $w_0^2$, but a lower peak irradiance. Thin sheet wants a small bright spot and high speed; thick sheet a broader one with a gas nozzle that reaches the bottom.

### Reflective metals and safety
Cold aluminium and copper reflect about 95 % and 97 % of 1.07 µm light; once the surface melts the absorption jumps. Back-reflection can damage the fibre, so heads monitor it. A kilowatt beam, even its stray reflection, can burn skin and ignite material.

> [!warn] These machines are Class 4 and run inside interlocked enclosures with eyewear and fume extraction rated for the wavelength ([[laser-safety-classes]], [[laser-eye-hazards-and-eyewear]]). Never defeat an interlock or look at the process without the machine's protection. The 1.07 µm beam is invisible.

> [!key] A processing head images the fibre end onto the work. Spot size sets the irradiance, the Rayleigh range sets the depth, and the thickness of the sheet decides which to favour.
`,
  ideas: [
    'The head images the fibre end onto the work: spot = core × (focusing focal length ÷ collimator focal length).',
    'The Rayleigh range z_R = πw₀²/(M²λ) grows as the square of the spot radius.',
    'A small spot is brighter but stays tight only briefly; thick sheet needs a larger spot and a longer range.',
    'The protective window and the gas nozzle are consumables that guard the lens from spatter.',
    'Kilowatt lasers need Class 4 enclosures, interlocks and wavelength-specific eyewear.'
  ],
  pitfalls: [
    'The smallest spot always cuts best — A tiny spot has a short Rayleigh range. In thick sheet the beam widens so much that most of the depth is cut by a spread-out, dim beam.',
    'The assist gas only cools the cut — It blows the molten metal out of the kerf (nitrogen for a clean edge, oxygen to add heat from burning, air as a cheaper compromise).',
    'A mirror finish makes the work safe to leave unguarded — A polished surface reflects the beam as a specular ray that stays dangerous over long distances; the enclosure is required whatever the material.',
    'A fibre laser beam can be treated like a flashlight — It is invisible infrared and the eye focuses it on the retina at 1.07 µm; even a diffuse reflection of a kilowatt beam can injure.'
  ],
  terms: [
    { term: 'Process fibre', also: ['delivery fibre'], def: 'The multimode fibre, typically of 50 to 200 µm core, that carries a high-power laser beam from the laser cabinet to the moving cutting or welding head.' },
    { term: 'Collimator', def: 'The lens in the head that turns the diverging light leaving the fibre into a parallel beam before it reaches the focusing lens.' },
    { term: 'Assist gas', also: ['cutting gas'], def: 'A gas (nitrogen, oxygen or air) blown through the nozzle coaxial with the beam to expel molten material from the cut and protect the optics.' },
    { term: 'Kerf', def: 'The width of the slot the beam removes in the material. In laser cutting it is a little wider than the focused spot.' },
    { term: 'Protective window', also: ['cover slide'], def: 'A replaceable plate of fused silica in front of the focusing lens that takes the spatter and smoke so that the lens does not.' },
    { term: 'Class 4 enclosure', def: 'The interlocked, beam-tight housing required around a laser machine whose beam, even when scattered, can injure eyes or skin or start a fire.' }
  ],
  formulas: [
    {
      name: 'Spot size of a fibre-delivered head',
      expr: 'd = dc*ff/fc', tex: 'd = d_c\\,\\frac{f_f}{f_c}',
      vars: {
        d: { name: 'spot diameter on the work', q: 'length', unit: 'µm' },
        dc: { name: 'core diameter of the fibre', q: 'length', unit: 'µm', value: 100, tex: 'd_c' },
        ff: { name: 'focal length of the focusing lens', q: 'length', unit: 'mm', value: 200, tex: 'f_f' },
        fc: { name: 'focal length of the collimator', q: 'length', unit: 'mm', value: 100, tex: 'f_c' }
      },
      solveFor: 'd',
      note: 'The head images the fibre end; the ratio of the focal lengths is its magnification.',
      stories: { d: 'A fibre of {dc} core feeds a head with a {fc} collimator and a {ff} focusing lens. How wide is the spot?' }
    },
    {
      name: 'Rayleigh range of the focused beam',
      expr: 'zR = pi*w0^2/(M2*lambda)', tex: 'z_R = \\frac{\\pi w_0^2}{M^2 \\lambda}',
      vars: {
        zR: { name: 'Rayleigh range', q: 'length', unit: 'mm', tex: 'z_R' },
        w0: { name: 'radius of the focus', q: 'length', unit: 'µm', value: 100, tex: 'w_0' },
        M2: { name: 'beam-quality factor M²', value: 17.6, min: 1, max: 200, tex: 'M^2' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1070, tex: '\\lambda' }
      },
      solveFor: 'zR',
      note: 'The beam stays within √2 of its waist radius over 2 z_R.'
    },
    {
      name: 'Average irradiance in the spot',
      expr: 'I = P/(pi*w0^2)', tex: 'I = \\frac{P}{\\pi w_0^2}',
      vars: {
        I: { name: 'irradiance averaged over the spot', q: 'intensity', unit: 'MW/cm²' },
        P: { name: 'laser power', q: 'power', unit: 'kW', value: 4 },
        w0: { name: 'radius of the focus', q: 'length', unit: 'µm', value: 100, tex: 'w_0' }
      },
      solveFor: 'I',
      note: 'A Gaussian beam peaks at twice this value; a fibre beam is flatter.',
      stories: { I: 'A laser of {P} is focused to a spot of radius {w0}. What is the irradiance averaged over the spot?' }
    },
    {
      name: 'Beam quality of a multimode fibre',
      expr: 'M2 = pi*a*NAf/lambda', tex: 'M^2 = \\frac{\\pi\\,a\\,\\mathrm{NA}_f}{\\lambda}',
      vars: {
        M2: { name: 'beam-quality factor M²', tex: 'M^2' },
        a: { name: 'core radius of the fibre', q: 'length', unit: 'µm', value: 50 },
        NAf: { name: 'numerical aperture of the beam in the fibre', value: 0.12, min: 0.02, max: 0.5, tex: '\\mathrm{NA}_f' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1070, tex: '\\lambda' }
      },
      solveFor: 'M2',
      note: 'The beam parameter product of a fibre-delivered beam is core radius times beam angle; M² is that product divided by λ/π.'
    }
  ],
  examples: [
    {
      title: 'A head for 10 mm steel',
      q: 'A 4 kW fibre laser (1.07 µm) with a 100 µm core and NA 0.12 feeds a head with a 100 mm collimator and a 200 mm focusing lens. The focus is set in the middle of 10 mm sheet. How wide is the beam at the faces, and how does the irradiance there compare with the focus?',
      steps: [
        'The spot radius is $w_0 = 50\\ \\mu\\mathrm{m} \\times 2 = 100\\ \\mu\\mathrm{m}$, with $M^2 = \\pi\\,(50\\ \\mu\\mathrm{m})(0.12)/(1.07\\ \\mu\\mathrm{m}) = 17.6$ and $z_R = 1.67$ mm.',
        { text: 'At 5 mm from the focus:', tex: 'w = w_0\\sqrt{1 + (z/z_R)^2} = 100\\sqrt{1 + (5/1.67)^2} = 316\\ \\mu\\mathrm{m}' },
        'The faces see a beam 0.63 mm across and an irradiance lower by $(316/100)^2 = 10$ times than at the focus.'
      ],
      a: 'The beam is 0.63 mm wide at each face and ten times dimmer: for thick sheet a larger spot is chosen so that the range covers the thickness.'
    }
  ],
  quiz: [
    { q: 'A fibre of 100 µm core feeds a head with a 100 mm collimator and a 150 mm focusing lens. What spot diameter results, in micrometres?', answer: 150, why: 'd = d_core × f_focus / f_collimator = 100 × 150 / 100 = 150 µm.' },
    { q: 'If the spot radius at the focus is doubled, the Rayleigh range of the same beam…', choices: ['quadruples', 'doubles', 'is unchanged', 'halves'], a: 0, why: 'z_R = πw₀²/(M²λ) grows as the square of w₀, so doubling the radius gives four times the range. The price is a four-times lower irradiance.' },
    { q: 'A 2 kW beam is focused to a spot of radius 0.1 mm. What is the average irradiance, in MW/cm²?', answer: 6.4, why: 'I = P/(πw²) = 2000 / (π × (0.01 cm)²) = 6.4 × 10⁶ W/cm², that is 6.4 MW/cm².' },
    { q: 'Because the beam of a fibre laser is invisible, a diffuse reflection of a kilowatt beam is harmless.', a: false, why: 'The eye cannot see 1.07 µm light but still focuses it on the retina, and even a diffuse reflection of a kilowatt beam can be above the safe limit. Hence the Class 4 enclosure and wavelength-rated eyewear.' },
    { q: 'What is the main job of the protective window in front of the focusing lens?', choices: ['to catch spatter so that the lens does not', 'to increase the power', 'to change the wavelength', 'to make the spot smaller'], a: 0, why: 'The window is cheap and replaceable. It absorbs the spatter and smoke from the cut so that the expensive lens stays clean; a dirty window absorbs power and shifts the focus.' }
  ],
  applications: [
    'Cutting sheet metal in flat-bed machines, from thin steel at high speed to plate 20 mm thick and more.',
    'Welding of car bodies, battery tabs and tubes with fibre-delivered heads on robot arms.',
    'Cutting and drilling non-metals with CO₂ lasers: acrylic, wood, textiles and film.',
    'Additive manufacturing by laser powder-bed fusion, with a scanning head instead of a cutting head.'
  ],
  history: 'The CO₂ laser cutter appeared in the 1970s and ruled metal cutting for decades. Fibre lasers of kilowatt power arrived in the 2000s, with higher efficiency and a beam that a flexible fibre can carry to the head, and have replaced CO₂ for most sheet metal.',
  sources: [
    'W. M. Steen and J. Mazumder, *Laser Material Processing* (Springer) — beam delivery, focusing and cutting with assist gas.',
    'A. E. Siegman, *Lasers*, chapter on Gaussian beams and beam quality — the Rayleigh range and M².',
    'IEC 60825-1, *Safety of laser products* — classes and enclosure requirements.'
  ],
  sim: 'ix-laser-cut'
}
,

/* ================================================================ spectroscopy in industry */
{
  id: 'spectroscopy-in-industry', parent: 'industrial-and-scientific-systems', title: 'Spectroscopy in industry', level: 2,
  short: 'Factories use light as a chemical probe: near-infrared reflection tells the moisture of grain, Raman scattering identifies a plastic, the spark of an alloy shows its elements, and a tuned diode laser counts methane molecules along a path. Each is a lamp or laser, a sample, a filter and a spectrometer.',
  keywords: ['spectroscopy', 'near-infrared', 'NIR', 'moisture measurement', 'Raman', 'Raman shift', 'optical emission spectrometry', 'OES', 'spark', 'TDLAS', 'tunable diode laser', 'gas sensing', 'chemometrics', 'process analytics', 'edge filter', 'wavenumber', 'absorption'],
  prereq: ['spectrometers-and-monochromators', 'grating-spectrometers-and-resolving-power', 'transmission-and-absorption'],
  related: ['spectrophotometers', 'diode-lasers', 'infrared-and-thermal-sensors', 'colour-and-multispectral-imaging', 'optical-sorting-and-colour-measurement', 'interference-filters','uv-and-infrared-materials', 'chemistry:atomic-spectra', 'chemistry:beer-lambert'],
  body: `
A spectrometer in a factory answers a chemical question with light: how much water is in this grain, which polymer is this flake, what alloy is this bar, how much methane is in this pipe. Four methods cover most of it, and each is a short chain from a light source to a spectrum, read in the order the light goes ([[how-to-read-an-optical-system|five questions]]).

### Following the light
| Method | The light meets, in order | What is read |
|---|---|---|
| **Near-infrared** reflection | tungsten–halogen lamp ([[halogen-lamps]]) → probe or window → the sample scatters it → grating ([[grating-spectrometers-and-resolving-power]]) → InGaAs array ([[infrared-and-thermal-sensors]]) | broad absorption bands of O–H, C–H, N–H bonds |
| **Raman** | laser (532, 785 or 1064 nm) → focusing lens or probe → sample → collection lens → long-pass edge filter that stops the laser line → grating → CCD | a few sharp lines, each a molecular vibration |
| **Optical emission** | spark or arc → hot plasma → lens → grating polychromator with a detector for each line | lines of each element, so the alloy |
| **Tunable diode laser** | distributed-feedback diode ([[diode-lasers]]) scanned across one gas line → collimator → gas path of metres → photodiode | the dip in transmission, so the concentration |

### Numbers
**Near-infrared.** Water has broad bands near 1.45 and 1.94 µm. They are weak overtones, so the light penetrates millimetres of grain and flour. No band belongs to one substance alone: a statistical calibration (chemometrics) built on samples measured in a laboratory converts the whole spectrum to moisture, protein or fat.

**Raman.** The scattered light is shifted from the laser by a molecular vibration, quoted as a **shift** in cm⁻¹: $\\bar{\\nu} = 1/\\lambda_0 - 1/\\lambda$. With a 785 nm laser, silicon's 521 cm⁻¹ line appears at 818.5 nm, a strong polystyrene line near 1001 cm⁻¹ at 851.9 nm, diamond's 1332 cm⁻¹ at 876.7 nm. Only about one photon in ten million is Raman scattered, so the edge filter must block the laser by a factor of a million or more, and a fluorescing sample can drown the lines: red and near-infrared lasers are chosen for coloured materials.

**Gas by laser.** The transmission through a gas path of length $L$ is $T = e^{-\\alpha L}$ with $\\alpha$ proportional to the number of molecules per unit volume. Methane has lines near 1.65 µm. A laser narrower than the gas line is tuned across it; the depth of the dip, not the brightness, measures the gas.

### Choosing
The wavelength is set by what the target absorbs or scatters, the detector by the wavelength (silicon to 1.1 µm, InGaAs to 1.7 or 2.5 µm), the path by how weak the signal is.

> [!warn] Raman probes and gas lasers are real lasers, often Class 3B or 4 and sometimes invisible. Use them only under the interlocks, enclosures and eyewear of the manufacturer's procedure ([[laser-safety-classes]]). A spark source carries high voltage.

> [!key] A spectrum is a fingerprint: broad bands (near-infrared), sharp shifts (Raman), element lines (emission) or one line scanned (laser gas). Know what the light meets and what the filter blocks, and the numbers follow.
`,
  ideas: [
    'Near-infrared bands are broad and shared by many substances; a calibration against laboratory values turns the spectrum into moisture or fat.',
    'A Raman shift is 1/λ₀ − 1/λ in cm⁻¹, independent of the laser used; the scattered line moves with the laser.',
    'Raman light is about ten million times weaker than the laser, so an edge filter must remove the laser line before the spectrometer.',
    'Optical emission reads the colours of a hot plasma to give the elements of a metal.',
    'A tunable diode laser reads one gas line: T = exp(−αL), with α proportional to concentration.'
  ],
  pitfalls: [
    'Near-infrared spectroscopy identifies a substance by a unique line — Its bands overlap and are broad; the result is a statistical calibration, valid only for the kinds of sample it was built on.',
    'A Raman line appears at the laser wavelength plus a fixed amount — It appears at a fixed shift in wavenumbers (cm⁻¹); in nanometres the line moves with the laser (521 cm⁻¹ is 818.5 nm for 785 nm, 1127 nm for 1064 nm).',
    'More laser power always gives a better Raman spectrum — Too much heats and burns the sample, and a fluorescing sample hides the lines. A longer-wavelength laser often does better.',
    'A gas laser sensor measures brightness — It measures the dip at one absorption line against its surroundings, which is independent of source power drifts.'
  ],
  terms: [
    { term: 'Near-infrared spectroscopy', also: ['NIR', 'NIRS'], def: 'Measuring how a sample absorbs or reflects light between about 0.8 and 2.5 µm, where overtones of O–H, C–H and N–H vibrations give broad bands used to find moisture, fat and protein.' },
    { term: 'Raman scattering', also: ['Raman spectroscopy'], def: 'The inelastic scattering of light by molecules: a tiny fraction of the photons leaves with less energy, by an amount that equals a molecular vibration.' },
    { term: 'Raman shift', also: ['wavenumber shift', 'cm⁻¹'], def: 'The difference 1/λ₀ − 1/λ between laser and scattered light, expressed in reciprocal centimetres. It identifies a vibration and does not depend on the laser used.' },
    { term: 'Optical emission spectrometry', also: ['OES', 'spark OES'], def: 'Exciting a sample in a spark or arc and reading the light of its hot plasma, whose spectral lines show which elements are present and how much.' },
    { term: 'Tunable diode laser absorption spectroscopy', also: ['TDLAS', 'TDL'], def: 'Measuring a gas by scanning a narrow diode laser across one absorption line and reading the dip in transmission over a known path.' },
    { term: 'Chemometrics', def: 'The statistics that relate a measured spectrum to a property such as moisture, using calibration samples measured by a reference method.' }
  ],
  formulas: [
    {
      name: 'Raman shift',
      expr: 'nu = 1/l0 - 1/l1', tex: '\\bar{\\nu} = \\frac{1}{\\lambda_0} - \\frac{1}{\\lambda_1}',
      vars: {
        nu: { name: 'Raman shift', q: 'wavenumber', unit: '1/cm', value: 521, tex: '\\bar{\\nu}' },
        l0: { name: 'laser wavelength', q: 'length', unit: 'nm', value: 785, tex: '\\lambda_0' },
        l1: { name: 'wavelength of the scattered line', q: 'length', unit: 'nm', tex: '\\lambda_1' }
      },
      solveFor: 'l1',
      note: 'For a Stokes line, the scattered light is at a longer wavelength than the laser.',
      stories: { l1: 'A laser of {l0} excites a vibration of {nu}. At what wavelength does the Stokes line appear?', nu: 'A {l0} laser gives a Raman line at {l1}. What is the shift?' }
    },
    {
      name: 'Transmission through a gas path',
      expr: 'T = exp(-alpha*L)', tex: 'T = e^{-\\alpha L}',
      vars: {
        T: { name: 'transmitted fraction', q: 'ratio', unit: '%' },
        alpha: { name: 'absorption coefficient at the line centre', q: 'wavenumber', unit: '1/m', value: 0.002, tex: '\\alpha' },
        L: { name: 'path length', q: 'length', unit: 'm', value: 10 }
      },
      solveFor: 'T',
      note: 'Beer–Lambert law; α grows in proportion to the concentration of the gas.',
      stories: { T: 'A gas line has an absorption coefficient of {alpha} at its centre and the laser crosses {L} of gas. What fraction is transmitted?', alpha: 'A laser loses a fraction of its light so that only {T} is left after {L} of gas. What is the absorption coefficient?' }
    },
    {
      name: 'Absorbance from transmission',
      expr: 'A = -log(T)', tex: 'A = -\\log_{10} T',
      vars: {
        A: { name: 'absorbance', },
        T: { name: 'transmitted fraction', q: 'ratio', unit: '%', value: 98, min: 0.001, max: 100 }
      },
      solveFor: 'A',
      note: 'Absorbance adds when absorbers are in series; it is proportional to concentration times path.'
    }
  ],
  examples: [
    {
      title: 'Where does the Raman line fall?',
      q: 'A 785 nm laser excites a polymer whose strong vibration is at 1001 cm⁻¹. At what wavelength must the spectrometer look?',
      steps: [
        { text: 'Convert the laser to reciprocal metres and subtract the shift:', tex: '\\frac{1}{\\lambda_1} = \\frac{1}{785\\ \\mathrm{nm}} - 1001\\ \\mathrm{cm}^{-1} = 1.2739 \\times 10^{6} - 1.001 \\times 10^{5}\\ \\mathrm{m}^{-1} = 1.1738 \\times 10^{6}\\ \\mathrm{m}^{-1}' },
        'That is a wavelength of $\\lambda_1 = 851.9$ nm. The edge filter must pass 852 nm and above and stop 785 nm.'
      ],
      a: '851.9 nm. With a 532 nm laser the same line would appear at 561.9 nm; with 1064 nm at 1190.8 nm.'
    },
    {
      title: 'A methane leak',
      q: 'A tunable laser crossing 10 m of air sees 2 % of its light absorbed at the centre of a methane line. What happens to the dip if the methane concentration doubles?',
      steps: [
        { text: 'First the coefficient:', tex: '\\alpha = -\\frac{\\ln 0.98}{10\\ \\mathrm{m}} = 2.0 \\times 10^{-3}\\ \\mathrm{m}^{-1}' },
        'Doubling the concentration doubles $\\alpha$, so $T = e^{-0.0404} = 0.960$.'
      ],
      a: 'The dip grows from 2 % to 4 %: for a weak absorber it is proportional to the concentration.'
    }
  ],
  quiz: [
    { q: 'A 785 nm laser excites silicon\'s 521 cm⁻¹ line. At what wavelength does the Stokes line appear, in nanometres?', answer: 818.5, why: '1/λ = 1/785 nm − 521 cm⁻¹ = 1.2739×10⁶ − 5.21×10⁴ = 1.2218×10⁶ m⁻¹, so λ = 818.5 nm.' },
    { q: 'Which part of a Raman instrument stops the laser line from reaching the spectrometer?', choices: ['a long-pass edge filter', 'the grating', 'the lamp', 'the sample cell'], a: 0, why: 'The Raman lines are about ten million times weaker than the laser light scattered by the sample, so a filter with a very steep edge removes the laser line first.' },
    { q: 'Near-infrared spectroscopy finds moisture from a single narrow line that only water has.', a: false, why: 'The water bands are broad overtones that overlap those of other bonds. The moisture is predicted by a statistical calibration across the whole spectrum.' },
    { q: 'A laser path of 20 m instead of 10 m through the same gas will…', choices: ['double the absorbance', 'halve the absorbance', 'leave the absorbance unchanged', 'remove the dip'], a: 0, why: 'Absorbance is proportional to path length times concentration (Beer–Lambert), so doubling the path doubles the absorbance.' },
    { q: 'Why is a red or near-infrared laser (785 or 1064 nm) often used for Raman analysis of coloured samples?', choices: ['The sample fluoresces less, so the weak Raman lines are not swamped', 'Red light is more powerful', 'Raman scattering needs red light', 'The detector is cheaper'], a: 0, why: 'Fluorescence is excited by shorter wavelengths and is much stronger than Raman scattering. Moving to a longer excitation wavelength often removes it.' }
  ],
  applications: [
    'Grain, flour, milk and meat: moisture, fat and protein by near-infrared, on the conveyor or in the lab.',
    'Pharmaceutical production: Raman identification of raw materials through a bag, tablet coating and blend uniformity.',
    'Metal foundries and steel mills: spark emission analysis of an alloy within a minute.',
    'Gas pipelines, furnaces and flue stacks: tunable-laser sensors for methane, oxygen, moisture and carbon monoxide.',
    'Plastic and waste sorting by near-infrared spectra ([[optical-sorting-and-colour-measurement]]).'
  ],
  history: 'Chandrasekhara Venkata Raman and K. S. Krishnan reported the scattering that bears his name in 1928. Near-infrared analysis of grain moisture became routine in the 1970s with computers able to apply a calibration, and diode lasers narrow enough for gas lines arrived with telecommunications lasers in the 1990s.',
  sources: [
    'H. W. Siesler, Y. Ozaki, S. Kawata and H. M. Heise (eds.), *Near-Infrared Spectroscopy: Principles, Instruments, Applications* (Wiley-VCH).',
    'E. Smith and G. Dent, *Modern Raman Spectroscopy: A Practical Approach* (Wiley).',
    'W. Demtröder, *Laser Spectroscopy* (Springer) — absorption measurements with tunable diode lasers.'
  ],
  sim: 'ix-spectro'
},

/* ================================================================ observatories and adaptive optics */
{
  id: 'astronomical-observatories-and-adaptive-optics', parent: 'industrial-and-scientific-systems', title: 'Observatories and adaptive optics', level: 3,
  short: 'A large telescope gathers light in proportion to the square of its diameter and could resolve 1.22 λ/D, but the air blurs every star to about one arc-second. Adaptive optics measures the wavefront many times a second and bends a deformable mirror to cancel the blur.',
  keywords: ['telescope', 'observatory', 'segmented mirror', 'primary mirror', 'adaptive optics', 'AO', 'seeing', 'Fried parameter', 'r0', 'deformable mirror', 'wavefront sensor', 'Shack-Hartmann', 'laser guide star', 'sodium layer', 'diffraction limit', 'Strehl ratio', 'extremely large telescope'],
  prereq: ['reflecting-telescopes', 'resolution-limits', 'wavefront-sensors'],
  related: ['the-airy-disk', 'strehl-ratio-and-diffraction-limited', 'wavefront-error-and-zernike-polynomials', 'the-green-flash-and-twinkling', 'atmospheric-refraction', 'microlens-arrays', 'parabolic-and-elliptical-mirrors', 'aspheric-surfaces'],
  body: `
A telescope has two jobs, collecting light (in proportion to $D^2$) and resolving detail (down to $1.22\\,\\lambda/D$). On the ground the air spoils the second one: turbulence bends the wavefront of every star so that a point of light dances and spreads to about an arc-second, whatever the size of the mirror. Adaptive optics (AO) undoes that on the spot. [[how-to-read-an-optical-system|Read from the star to the camera]]:

### Following the light
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Atmosphere | turbulent layers add a random delay across the wavefront | [[the-green-flash-and-twinkling]] |
| 2 | Primary mirror, segmented | a mosaic of hexagonal segments about 1.4 to 1.8 m wide, each held to a few tens of nanometres, collects the light | [[reflecting-telescopes]] |
| 3 | Secondary (and tertiary) mirror | folds the beam to a compact focus | [[parabolic-and-elliptical-mirrors]] |
| 4 | Deformable mirror | a thin face sheet on hundreds to thousands of actuators; its shape is the opposite of the distortion | [[wavefront-error-and-zernike-polynomials]] |
| 5 | Dichroic splitter | sends visible light to the sensor and infrared to the science camera | [[dichroic-filters-and-mirrors]] |
| 6 | Wavefront sensor | a lenslet array measures the local tilt of the wavefront as spot shifts | [[wavefront-sensors]], [[microlens-arrays]] |
| 7 | Real-time computer | turns the shifts into actuator commands, 1000 times a second | — |
| 8 | Science camera or spectrograph | records the sharpened image | [[the-airy-disk]] |

### The numbers
The scale of the blur is the **Fried parameter** $r_0$, the width over which the wavefront is flat to about a radian. On a good night $r_0 \\approx 10$ cm at 500 nm, and it grows as $\\lambda^{6/5}$: 59 cm at 2.2 µm. Seeing, the blur, is about $0.98\\,\\lambda/r_0$: 1.0″ at 500 nm and 0.75″ at 2.2 µm. The diffraction limit of a 10 m telescope at 2.2 µm is 0.055″ (the core of a perfect star image is 0.047″ wide), so AO could in principle narrow the star about sixteen times and raise its peak some 250 times. The deformable mirror needs about $(D/r_0)^2 \\approx 290$ actuators; the atmosphere changes in about $0.3\\,r_0/v$, 19 ms at 2.2 µm with a 10 m/s wind and 3 ms at 500 nm, so the loop runs at a kilohertz or more.

The quality of the correction is the **Strehl ratio**, about $e^{-(2\\pi\\sigma/\\lambda)^2}$ for a residual wavefront error $\\sigma$. With $\\sigma = 200$ nm it is 0.72 at 2.2 µm, 0.21 at 1 µm and nearly nothing at 500 nm: AO works best in the infrared.

### Guide stars
The wavefront sensor needs a bright star close to the target. A **laser guide star** makes one: a 589 nm laser excites the layer of sodium atoms 90 km up, and its glow serves as the reference.

> [!warn] Laser guide stars are powerful beams sent into the sky; observatories use spotters or radar to switch them off when aircraft approach. Never point a telescope at the Sun without a certified solar filter over the front.

> [!key] A large telescope is limited by the air, not by its mirror. Adaptive optics measures the wavefront and cancels it with a deformable mirror, at a kilohertz, and works best at long wavelengths where $r_0$ is large.
`,
  ideas: [
    'Light grows as D² and resolution as 1/D, but on the ground the air limits the image to about 1 arc-second.',
    'The Fried parameter r₀ (about 10 cm at 500 nm) grows as λ^(6/5); seeing is about 0.98 λ/r₀.',
    'A deformable mirror, a wavefront sensor and a fast computer form a loop that cancels the distortion.',
    'The Strehl ratio is about exp(−(2πσ/λ)²): the same wavefront error is far worse at short wavelengths.',
    'A sodium laser guide star at 90 km supplies a reference where no natural star is near the target.'
  ],
  pitfalls: [
    'A bigger telescope always sees sharper — From the ground a bigger mirror collects more light but is still limited by the seeing, about 1 arc-second, unless adaptive optics is used.',
    'Adaptive optics makes ground telescopes as sharp as space ones at every wavelength — It reaches the diffraction limit well only in the infrared; at 500 nm it needs far more actuators and speed, and covers a small field.',
    'Twinkling is the star changing brightness — The star\'s light is bent by moving pockets of air so its image dances and its brightness flickers; planets, which are small discs, twinkle less.',
    'The guide star is a real star — A laser guide star is a glow in the sodium layer; it cannot measure the tilt of the whole image, so a faint natural star is still needed for that.'
  ],
  terms: [
    { term: 'Seeing', def: 'The blur of an image caused by atmospheric turbulence, usually quoted as the full width at half maximum of a star: about 1 arc-second on a good site at visible wavelengths.' },
    { term: 'Fried parameter', also: ['r₀', 'coherence length'], def: 'The diameter of a patch of the atmosphere over which the wavefront stays flat to about a radian. A telescope larger than r₀ is limited by the seeing, not by diffraction.' },
    { term: 'Adaptive optics', also: ['AO'], def: 'A system that measures the distortion of the wavefront many times a second and cancels it with a deformable mirror.' },
    { term: 'Deformable mirror', also: ['DM'], def: 'A thin mirror whose surface is bent by many actuators behind it to a shape accurate to tens of nanometres.' },
    { term: 'Laser guide star', also: ['LGS'], def: 'An artificial star made by a laser that excites sodium atoms about 90 km up (or scatters light lower down), used as a reference for the wavefront sensor.' },
    { term: 'Strehl ratio', also: ['S'], def: 'The peak brightness of a star image divided by that of a perfect image of the same telescope. About exp(−(2πσ/λ)²) for a small wavefront error σ.' }
  ],
  formulas: [
    {
      name: 'Diffraction limit of the telescope',
      expr: 'theta = 1.22*lambda/D', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D}',
      vars: {
        theta: { name: 'smallest resolvable angle', q: 'angle', unit: '″', tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 2200, tex: '\\lambda' },
        D: { name: 'mirror diameter', q: 'length', unit: 'm', value: 10 }
      },
      solveFor: 'theta',
      note: 'The Rayleigh criterion; the full width at half maximum of the star is 1.03 λ/D.',
      stories: { theta: 'A telescope of {D} observes at {lambda}. What is its diffraction limit?' }
    },
    {
      name: 'Fried parameter at another wavelength',
      expr: 'r0 = r05*(lambda/5e-7)^1.2', tex: 'r_0 = r_{0,500}\\,\\left(\\frac{\\lambda}{500\\ \\mathrm{nm}}\\right)^{6/5}',
      vars: {
        r0: { name: 'Fried parameter at λ', q: 'length', unit: 'cm', tex: 'r_0' },
        r05: { name: 'Fried parameter at 500 nm', q: 'length', unit: 'cm', value: 10, tex: 'r_{0,500}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 2200, tex: '\\lambda' }
      },
      solveFor: 'r0',
      note: 'Turbulence is gentler at long wavelengths: r₀ grows as λ^(6/5).'
    },
    {
      name: 'Seeing blur',
      expr: 'see = 0.98*lambda/r0', tex: '\\theta_{\\mathrm{seeing}} = 0.98\\,\\frac{\\lambda}{r_0}',
      vars: {
        see: { name: 'full width of the seeing disc', q: 'angle', unit: '″', tex: '\\theta_{\\mathrm{seeing}}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        r0: { name: 'Fried parameter at λ', q: 'length', unit: 'cm', value: 10, tex: 'r_0' }
      },
      solveFor: 'see',
      note: 'For a telescope much larger than r₀; the blur is nearly independent of the mirror size.'
    },
    {
      name: 'Strehl ratio from the wavefront error',
      expr: 'S = exp(-(2*pi*sigma/lambda)^2)', tex: 'S \\approx \\exp\\!\\left(-\\left(\\frac{2\\pi\\sigma}{\\lambda}\\right)^2\\right)',
      vars: {
        S: { name: 'Strehl ratio', q: 'ratio', unit: '%' },
        sigma: { name: 'residual wavefront error (rms)', q: 'length', unit: 'nm', value: 200, tex: '\\sigma' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 2200, tex: '\\lambda' }
      },
      solveFor: 'S',
      note: 'The Maréchal approximation, good for S above about 0.1.'
    }
  ],
  examples: [
    {
      title: 'How much can AO gain?',
      q: 'A 10 m telescope observes at 2.2 µm under seeing with $r_0 = 10$ cm at 500 nm. Compare the seeing blur with the diffraction-limited core.',
      steps: [
        { text: 'At 2.2 µm the Fried parameter grows:', tex: 'r_0 = 10\\ \\mathrm{cm} \\times (2200/500)^{1.2} = 59\\ \\mathrm{cm}' },
        { text: 'The seeing blur is', tex: '0.98\\,\\frac{2.2\\ \\mu\\mathrm{m}}{0.59\\ \\mathrm{m}} = 3.65 \\times 10^{-6}\\ \\mathrm{rad} = 0.75\\ \\mathrm{arcsec}' },
        { text: 'The core of a perfect image is $1.03\\,\\lambda/D = 0.047$″ wide.', tex: '\\frac{0.75}{0.047} \\approx 16' }
      ],
      a: 'About sixteen times narrower; since the light is concentrated in a spot with 1/256 of the area the peak brightens up to roughly 250 times, if the correction is perfect.'
    },
    {
      title: 'Why infrared first',
      q: 'The adaptive optics leaves a wavefront error of 150 nm rms. What is the Strehl ratio at 500 nm, 1 µm and 2.2 µm?',
      steps: [
        { text: 'The phase error in radians is $2\\pi\\sigma/\\lambda$ and $S = e^{-(2\\pi\\sigma/\\lambda)^2}$:', tex: '500\\ \\mathrm{nm}: e^{-3.55} = 0.029 \\quad 1\\ \\mu\\mathrm{m}: e^{-0.888} = 0.41 \\quad 2.2\\ \\mu\\mathrm{m}: e^{-0.183} = 0.83' }
      ],
      a: '0.03, 0.41 and 0.83: the same mirror shape gives almost nothing at 500 nm and a near-perfect image at 2.2 µm.'
    }
  ],
  quiz: [
    { q: 'What is the diffraction limit (1.22 λ/D) of a 10 m telescope at 2.2 µm, in arc-seconds?', answer: 0.0553, why: 'θ = 1.22 × 2.2×10⁻⁶ / 10 = 2.68×10⁻⁷ rad = 0.0553″.' },
    { q: 'The Fried parameter is 10 cm at 500 nm. At 2.2 µm it is about…', choices: ['59 cm', '10 cm', '2.3 cm', '2.2 m'], a: 0, why: 'r₀ grows as λ^(6/5): (2200/500)^1.2 = 5.9, so 59 cm. The air is gentler at long wavelengths.' },
    { q: 'Doubling the mirror diameter of a ground telescope without adaptive optics halves the size of the seeing disc.', a: false, why: 'Once the mirror is larger than r₀ the blur is set by the atmosphere, about λ/r₀, and does not depend on the diameter. The larger mirror collects four times the light.' },
    { q: 'Adaptive optics works best at…', choices: ['long wavelengths such as 2 µm', 'short wavelengths such as 400 nm', 'any wavelength equally', 'only in daylight'], a: 0, why: 'At long wavelengths r₀ is larger, there are fewer actuators to drive, the atmosphere changes more slowly and the same wavefront error is a smaller fraction of the wavelength.' },
    { q: 'A deformable mirror leaves 200 nm rms of wavefront error. What Strehl ratio results at 1 µm, as a percentage?', answer: 20.6, why: 'S = exp[−(2π × 200/1000)²] = exp(−1.579) = 0.206.' }
  ],
  applications: [
    'Ground-based infrared astronomy: imaging planets around other stars and the centre of our galaxy at near the diffraction limit.',
    'Satellite and space-debris tracking from the ground, and free-space laser links.',
    'Eye imaging: the same loop, with the eye\'s own distortions, shows single cone cells ([[ophthalmoscopy-and-fundus-imaging]]).',
    'Microscopy deep in tissue, where the sample plays the role of the atmosphere.'
  ],
  history: 'Horace Babcock proposed adaptive optics in 1953. Military laboratories developed the systems in the 1970s and 1980s, and astronomers began to use them on large telescopes in the 1990s. Segmented primary mirrors, first used for a 10 m telescope in the early 1990s, are the basis of the extremely large telescope designs.',
  sources: [
    'J. W. Hardy, *Adaptive Optics for Astronomical Telescopes* (Oxford University Press).',
    'R. K. Tyson, *Principles of Adaptive Optics* (CRC Press).',
    'F. Roddier (ed.), *Adaptive Optics in Astronomy* (Cambridge University Press).'
  ],
  sim: 'ix-ao'
},

/* ================================================================ earth observation cameras */
{
  id: 'earth-observation-cameras', parent: 'industrial-and-scientific-systems', title: 'Earth-observation cameras', level: 2,
  short: 'An Earth-observation satellite is a line-scan camera whose belt is the ground, sliding past at about 7 km/s. The ground sample distance is altitude × pixel ÷ focal length, the swath is the pixels in the line times that, and diffraction sets the aperture the telescope must have.',
  keywords: ['Earth observation', 'satellite camera', 'pushbroom', 'GSD', 'ground sample distance', 'swath', 'TDI', 'line sensor', 'remote sensing', 'orbit', 'multispectral', 'telescope aperture', 'ground resolution', 'push-broom scanner', 'altitude'],
  prereq: ['area-scan-and-line-scan-cameras', 'field-of-view-and-focal-length', 'resolution-limits'],
  related: ['line-scan-inspection', 'sensor-formats-and-pixel-size', 'quantum-efficiency-and-spectral-response', 'reflecting-telescopes', 'colour-and-multispectral-imaging', 'dynamic-range-and-full-well', 'the-resolution-budget', 'stray-light-and-baffling'],
  body: `
Take a line-scan camera on a production line, put it in orbit at 500 km, and the belt is the ground. A satellite moves at about 7.6 km/s, and its ground track at 7.06 km/s, so a line sensor looking straight down sweeps out a picture in a **pushbroom** fashion: one row of the image per line period, the satellite's motion supplying the second dimension. [[how-to-read-an-optical-system|Read it in the order of the light]].

### Following the light
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Sun, then the ground | sunlight reflects off the surface (thermal bands read the ground's own glow) | [[the-optical-spectrum]] |
| 2 | Atmosphere | haze scatters and gas absorbs; bands are placed in the windows between | [[why-the-sky-is-blue]] |
| 3 | Baffle and hood | keeps stray sunlight from the telescope | [[stray-light-and-baffling]] |
| 4 | Telescope: primary and secondary mirror, folded | 5 to 12 m of focal length in a body about a metre long | [[reflecting-telescopes]] |
| 5 | Filter strips or a dichroic splitter | divide the light into bands: blue, green, red, near-infrared, panchromatic | [[dichroic-filters-and-mirrors]] |
| 6 | Line sensor, 5 to 10 µm pixels, often TDI | records one row of the ground per line period | [[ccd-architectures]] |
| 7 | Converter, compression, downlink | turns the rows into data sent to the ground | — |

### The geometry
One pixel of size $p$ behind a lens of focal length $f$ looks at a patch of ground of side

$$\\mathrm{GSD} = \\frac{H\\,p}{f}$$

the **ground sample distance**, with $H$ the altitude. At 500 km with 7 µm pixels, a 7 m focal length gives 0.5 m; 3.5 m gives 1 m; 0.35 m gives 10 m. A line of $N$ pixels covers a **swath** $N \\times \\mathrm{GSD}$: 12 000 pixels at 0.5 m is 6 km. The line rate follows from the speed over the ground: 7.06 km/s ÷ 0.5 m = 14.1 kHz, a line every 71 µs.

### Light and aperture
71 µs is little time, so sensors of the **time-delay-and-integration** type add the light of the same ground strip from many rows as it moves across them. Diffraction limits what a ground pixel can mean: the Rayleigh angle $1.22\\lambda/D$ corresponds on the ground to $1.22\\,\\lambda H/D$. For 0.5 m at 550 nm from 500 km that needs $D \\ge 0.67$ m; for 0.3 m, 1.1 m.

| GSD | focal length | aperture D for diffraction |
|---|---|---|
| 30 m | 0.12 m | 0.011 m |
| 10 m | 0.35 m | 0.034 m |
| 1 m | 3.5 m | 0.34 m |
| 0.5 m | 7.0 m | 0.67 m |
| 0.3 m | 11.7 m | 1.12 m |

> [!key] Ground resolution is $Hp/f$; the swath is the number of pixels in the line times it; and the aperture must be at least $1.22\\,\\lambda H/\\mathrm{GSD}$. Fine ground detail needs a long focal length and a big mirror, which is why the best cameras are large telescopes.
`,
  ideas: [
    'A pushbroom camera builds its picture one row per line period as the satellite moves; the ground is the belt.',
    'The ground sample distance is altitude × pixel pitch ÷ focal length.',
    'The swath is the number of pixels in the line times the ground sample distance.',
    'The line rate is the ground speed divided by the ground sample distance: 14.1 kHz for 0.5 m at 500 km.',
    'Diffraction demands D ≥ 1.22 λ H / GSD, so sharp ground pictures need large telescopes.'
  ],
  pitfalls: [
    'More megapixels give finer ground detail — The ground sample distance is set by pixel size, focal length and altitude; if the aperture is too small the image is blurred by diffraction whatever the pixel count.',
    'The satellite\'s speed of 7.6 km/s is the ground speed — The ground track moves a little slower, 7.06 km/s from 500 km, because the surface is nearer the Earth\'s centre than the satellite is.',
    'A satellite camera is a small version of a phone camera — Its optics have focal lengths of metres, folded into a short body by mirrors, and sensors that are lines of thousands of pixels.',
    'A pixel of 1 m means 1 m objects are seen clearly — Seeing a thing needs several pixels across it; a car about 4 m long is a handful of pixels at 1 m.'
  ],
  terms: [
    { term: 'Ground sample distance', also: ['GSD'], def: 'The distance on the ground between the centres of adjacent pixels, equal to altitude × pixel pitch ÷ focal length.' },
    { term: 'Swath', also: ['swath width'], def: 'The width of ground that the sensor line covers, perpendicular to the satellite\'s track.' },
    { term: 'Pushbroom scanner', also: ['push-broom'], def: 'A camera with a line of detectors across the track that builds an image from successive lines as the platform moves along the track.' },
    { term: 'Time delay and integration', also: ['TDI'], def: 'A sensor of many rows whose charge moves in step with the image, so that the same ground strip is integrated many times, increasing the signal without blur.' },
    { term: 'Panchromatic band', also: ['pan'], def: 'A wide band covering the visible and near-infrared, giving the sharpest and brightest picture; colour bands, with larger ground pixels, are combined with it afterwards.' }
  ],
  formulas: [
    {
      name: 'Ground sample distance',
      expr: 'g = H*p/f', tex: '\\mathrm{GSD} = \\frac{H\\,p}{f}',
      vars: {
        g: { name: 'ground sample distance', q: 'length', unit: 'm', tex: '\\mathrm{GSD}' },
        H: { name: 'altitude', q: 'length', unit: 'km', value: 500 },
        p: { name: 'pixel pitch', q: 'length', unit: 'µm', value: 7 },
        f: { name: 'focal length', q: 'length', unit: 'm', value: 7 }
      },
      solveFor: 'g',
      note: 'The same as magnification: the image of one ground pixel is one sensor pixel.',
      stories: { g: 'A camera at {H} has pixels of {p} behind a lens of focal length {f}. What is the ground sample distance?', f: 'What focal length gives a ground sample distance of {g} from {H} with pixels of {p}?' }
    },
    {
      name: 'Swath width',
      expr: 'W = n*g', tex: 'W = N\\,\\mathrm{GSD}',
      vars: {
        W: { name: 'swath', q: 'length', unit: 'km' },
        n: { name: 'pixels in the line', value: 12000, min: 100, max: 100000, int: true, tex: 'N' },
        g: { name: 'ground sample distance', q: 'length', unit: 'm', value: 0.5, tex: '\\mathrm{GSD}' }
      },
      solveFor: 'W',
      note: 'Long lines are built from several sensors butted together.'
    },
    {
      name: 'Line rate',
      expr: 'r = v/g', tex: 'r = \\frac{v}{\\mathrm{GSD}}',
      vars: {
        r: { name: 'line rate', q: 'frequency', unit: 'kHz' },
        v: { name: 'speed of the ground track', q: 'speed', unit: 'km/s', value: 7.06 },
        g: { name: 'ground sample distance', q: 'length', unit: 'm', value: 0.5, tex: '\\mathrm{GSD}' }
      },
      solveFor: 'r',
      note: 'One row of the picture per ground pixel travelled; the line period is the reciprocal.',
      stories: { r: 'The ground track moves at {v} and the ground sample distance is {g}. How many lines per second must be read?' }
    },
    {
      name: 'Aperture needed against diffraction',
      expr: 'D = 1.22*lambda*H/g', tex: 'D \\ge \\frac{1.22\\,\\lambda\\,H}{\\mathrm{GSD}}',
      vars: {
        D: { name: 'smallest mirror diameter', q: 'length', unit: 'm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        H: { name: 'altitude', q: 'length', unit: 'km', value: 500 },
        g: { name: 'ground sample distance', q: 'length', unit: 'm', value: 0.5, tex: '\\mathrm{GSD}' }
      },
      solveFor: 'D',
      note: 'At this diameter the Rayleigh disc of the telescope is as wide as one ground pixel.'
    }
  ],
  examples: [
    {
      title: 'Design a half-metre camera',
      q: 'A satellite at 500 km is to image the ground at 0.5 m with 7 µm pixels and green light (550 nm). What focal length and aperture does it need, and at what rate must it read lines?',
      steps: [
        { text: 'Focal length from the ground sample distance:', tex: 'f = \\frac{H p}{\\mathrm{GSD}} = \\frac{500\\,000 \\times 7\\times 10^{-6}}{0.5} = 7.0\\ \\mathrm{m}' },
        { text: 'Aperture from diffraction:', tex: 'D = \\frac{1.22 \\times 550\\times 10^{-9} \\times 500\\,000}{0.5} = 0.67\\ \\mathrm{m}' },
        'The f-number is $7.0/0.67 = 10.4$. The ground track moves at 7.06 km/s, so the line rate is $7060/0.5 = 14.1$ kHz.'
      ],
      a: 'A 7 m focal length (folded into a body about a metre long), a mirror at least 0.67 m across, and 14.1 thousand lines a second.'
    },
    {
      title: 'The swath',
      q: 'The line sensor of this camera has 12 000 pixels. How wide a strip of ground does it see?',
      steps: ['$W = N \\times \\mathrm{GSD} = 12\\,000 \\times 0.5\\ \\mathrm{m} = 6$ km.', 'In 100 s the satellite moves 706 km along the track, so one pass of 100 s images a strip 6 km × 706 km, about 4 200 km².'],
      a: 'A 6 km swath.'
    }
  ],
  quiz: [
    { q: 'A satellite at 500 km has 7 µm pixels and a 3.5 m focal length. What is its ground sample distance, in metres?', answer: 1, why: 'GSD = Hp/f = 500 000 × 7×10⁻⁶ / 3.5 = 1.0 m.' },
    { q: 'The same camera is raised to 700 km. The ground sample distance becomes…', choices: ['1.4 m: larger, the swath wider', '0.7 m', 'unchanged', '1.0 m, the swath smaller'], a: 0, why: 'GSD = Hp/f grows in proportion to the altitude, and so does the swath for the same number of pixels. The picture is coarser but covers more ground.' },
    { q: 'A line sensor of 10 000 pixels at a ground sample distance of 2 m covers a swath of…', choices: ['20 km', '2 km', '200 km', '5 km'], a: 0, why: 'Swath = N × GSD = 10 000 × 2 m = 20 km.' },
    { q: 'To image at 0.5 m from 500 km, a diffraction-limited telescope in green light (550 nm) must have a mirror at least about…', choices: ['0.67 m across', '6.7 cm across', '6.7 m across', '0.067 m, as a phone has'], a: 0, why: 'D = 1.22 λH/GSD = 1.22 × 550 nm × 500 km / 0.5 m = 0.67 m.' },
    { q: 'More pixels in the line widen the swath but do not change the ground resolution.', a: true, why: 'The ground sample distance depends on altitude, pixel pitch and focal length only. More pixels along the line cover more ground at the same detail.' }
  ],
  applications: [
    'Mapping, land use, agriculture and forest monitoring with multispectral bands (the near-infrared band shows plant health).',
    'Disaster response: flood, fire and damage maps within hours of an event.',
    'Weather and climate: much coarser pixels (hundreds of metres to kilometres) over a wide swath.',
    'Defence, security and urban planning with sub-metre imagery.'
  ],
  history: 'The first civil Earth-observation satellite designed for land mapping, launched in 1972, scanned the ground with a rotating mirror. Pushbroom sensors with CCD lines were introduced in the 1980s, and the ground sample distance of commercial satellites has fallen from about 10 m to below 0.5 m since.',
  sources: [
    'G. C. Holst, *Electro-Optical Imaging System Performance* (SPIE Press) — sampling and resolution of imaging systems.',
    'H. J. Kramer, *Observation of the Earth and Its Environment: Survey of Missions and Sensors* (Springer).',
    'J. R. Schott, *Remote Sensing: The Image Chain Approach* (Oxford University Press).'
  ],
  sim: 'ix-earth'
}
,

/* ================================================================ medical imaging optics */
{
  id: 'medical-imaging-optics', parent: 'industrial-and-scientific-systems', title: 'Medical imaging optics', level: 2,
  short: 'Medicine uses light to look inside and at the body: endoscopes carry an image through a narrow tube, surgical microscopes give a surgeon a magnified stereo view, OCT maps layers of tissue, fundus cameras image the retina, and a pulse oximeter compares red and infrared absorption.',
  keywords: ['endoscope', 'laparoscope', 'rod lens', 'chip on tip', 'surgical microscope', 'operating microscope', 'optical coherence tomography', 'OCT', 'fundus camera', 'pulse oximeter', 'SpO2', 'oxygen saturation', 'ratio of ratios', 'medical optics', 'haemoglobin', 'photoplethysmography', 'light guide'],
  prereq: ['periscopes-and-endoscopes', 'transmission-and-absorption', 'michelson-interferometer'],
  related: ['fibre-optic-light-guides', 'fibre-bundles-and-image-guides', 'optical-coherence-tomography', 'oct-in-eye-care', 'ophthalmoscopy-and-fundus-imaging', 'the-compound-microscope', 'laser-eye-hazards-and-eyewear', 'chemistry:beer-lambert'],
  body: `
Medical instruments are optical systems like any other, with an unusual detector: a person, whose comfort and safety set the limits. Five of them cover most of the ground. This page explains how they work; reading what a picture or a number means for a patient belongs to a clinician. [[how-to-read-an-optical-system|Read each from lamp to detector.]]

### Following the light
| Instrument | The light meets, in order | What it shows |
|---|---|---|
| **Endoscope** | LED or xenon lamp → fibre light guide ([[fibre-optic-light-guides]]) → tissue → objective lens at the tip → rod-lens relay, or a fibre image guide, or a chip on the tip ([[periscopes-and-endoscopes]], [[fibre-bundles-and-image-guides]]) → camera | a bright wide-angle view down a tube of about 1 to 12 mm |
| **Surgical microscope** | fibre-fed lamp, coaxial with the view → objective of 200 to 400 mm focal length → zoom → two eyepiece paths ([[the-compound-microscope]]) | a magnified stereo view with room for instruments below |
| **OCT** | low-coherence diode → fibre interferometer ([[michelson-interferometer]]) → scanning mirror and lens → tissue → back-scattered light mixes with the reference → spectrometer | a cross-section of layers a few micrometres thick ([[optical-coherence-tomography]]) |
| **Fundus camera** | flash or LED ring → enters the eye through the edge of the pupil → eye's own optics → retina; the image leaves through the centre → camera | the retina and the optic disc in 30° to 50° ([[ophthalmoscopy-and-fundus-imaging]]) |
| **Pulse oximeter** | red (660 nm) and infrared (940 nm) LEDs → finger or earlobe → one photodiode | the pulsing absorption of arterial blood at two colours |

In the fundus camera the illumination goes in through an annulus and the image comes out through the hole in its middle, so that light reflected from the cornea does not reach the camera.

### The pulse oximeter
Haemoglobin that carries oxygen and haemoglobin that does not absorb light differently. At 660 nm the deoxygenated form absorbs about ten times more; at 940 nm the oxygenated form absorbs about 1.75 times more. With each heartbeat the arterial blood thickens the path a little, so each LED's signal has a steady part (DC: tissue, venous blood) and a small pulsing part (AC). The instrument forms the **ratio of ratios**

$$R = \\frac{\\mathrm{AC}_{660}/\\mathrm{DC}_{660}}{\\mathrm{AC}_{940}/\\mathrm{DC}_{940}}$$

In an ideal Beer–Lambert model $R$ is 0.26 at full saturation, 0.53 at 90 % and 0.81 at 80 %. Real tissue scatters, which changes the path, so real devices use a calibration measured on volunteers rather than this ideal curve, and the readings can be disturbed by motion, cold fingers, nail varnish and strong ambient light.

### OCT in numbers
The depth resolution is $0.44\\,\\lambda_0^2/\\Delta\\lambda$ in air: 6.2 µm for an 840 nm source 50 nm wide, 4.5 µm inside tissue of index 1.38. A broader spectrum gives finer layers.

> [!note] Medical optics add rules of their own: sterilization, leakage current, and the limit on the light the body may receive. A light source that is harmless at its lamp is a hazard when the optics concentrate it, so tissue exposure is kept within limits set by safety standards.

> [!key] A medical optical system is lamp, light guide, tissue, a narrow optical path and a detector. Endoscopes bring the image out, microscopes enlarge it, OCT slices it by interference and the oximeter reads two colours of one pulsing absorption.
`,
  ideas: [
    'An endoscope carries light in and the image out through one narrow tube: by rod lenses, a fibre image guide or a chip on the tip.',
    'A surgical microscope uses an objective of 200 to 400 mm focal length so that the surgeon has room under it, and lights the field coaxially.',
    'OCT depth resolution is 0.44 λ²/Δλ: a broad spectrum gives thin layers.',
    'A fundus camera separates illumination (the edge of the pupil) from imaging (the centre) to avoid corneal reflection.',
    'A pulse oximeter compares the pulsing part of two colours; the ratio of ratios maps to saturation through an empirical calibration.'
  ],
  pitfalls: [
    'A pulse oximeter measures oxygen directly in the blood — It measures how the pulsing part of the absorption differs at two colours and converts the ratio through a calibration; motion, cold fingers or nail varnish can disturb it.',
    'An endoscope\'s picture is only as sharp as its camera — The image guide of a flexible scope has one pixel per fibre (tens of thousands), and a rod-lens relay loses light in every element; the optics of the tip often limit the picture more than the sensor.',
    'OCT is ultrasound with light — It resembles ultrasound in making cross-sections from echoes, but the echoes are of light, measured by interference, and the depth is a few millimetres, not centimetres.',
    'More light always gives a better medical image — The body can be burned or damaged by light; sources are limited by standards and the best pictures use as little light as the detector allows.'
  ],
  terms: [
    { term: 'Endoscope', also: ['laparoscope', 'arthroscope', 'borescope (industrial)'], def: 'A narrow instrument that carries light into the body and an image out: a rigid tube of lenses, a flexible bundle of fibres, or a camera chip on the tip.' },
    { term: 'Rod-lens relay', also: ['Hopkins relay'], def: 'A chain of long glass rods separated by short air gaps that carries an image down a rigid endoscope with far more light than a chain of thin lenses.' },
    { term: 'Surgical microscope', also: ['operating microscope'], def: 'A stereo microscope with a long working distance, coaxial illumination and a zoom, used so that a surgeon can work under magnification.' },
    { term: 'Optical coherence tomography', also: ['OCT'], def: 'Imaging in depth by interference of back-scattered low-coherence light with a reference beam; the layers of tissue appear as a cross-section.' },
    { term: 'Pulse oximeter', also: ['SpO₂ sensor'], def: 'A clip-on sensor with a red and an infrared LED and a photodiode that estimates the oxygen saturation of arterial blood from the pulsing absorption at the two colours.' },
    { term: 'Ratio of ratios', also: ['R'], def: 'The quantity (AC/DC at 660 nm) divided by (AC/DC at 940 nm) that a pulse oximeter forms before looking up the saturation.' }
  ],
  formulas: [
    {
      name: 'Axial resolution of OCT',
      expr: 'dz = 0.44*l0^2/dl', tex: '\\Delta z = 0.44\\,\\frac{\\lambda_0^2}{\\Delta\\lambda}',
      vars: {
        dz: { name: 'depth resolution in air', q: 'length', unit: 'µm', tex: '\\Delta z' },
        l0: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 840, tex: '\\lambda_0' },
        dl: { name: 'bandwidth of the source', q: 'length', unit: 'nm', value: 50, tex: '\\Delta\\lambda' }
      },
      solveFor: 'dz',
      note: 'For a source with a Gaussian spectrum; divide by the tissue\'s refractive index (about 1.38) for the resolution inside it.',
      stories: { dz: 'An OCT source is centred at {l0} and {dl} wide. What is the depth resolution in air?', dl: 'To reach {dz} of depth resolution with a source centred at {l0}, how wide must its spectrum be?' }
    },
    {
      name: 'Ratio of ratios',
      expr: 'R = (a1/d1)/(a2/d2)', tex: 'R = \\frac{a_1/d_1}{a_2/d_2}',
      vars: {
        R: { name: 'ratio of ratios' },
        a1: { name: 'pulsing part at 660 nm', value: 0.012, min: 1e-6, max: 1, tex: 'a_1' },
        d1: { name: 'steady part at 660 nm', value: 1, min: 1e-6, max: 100, tex: 'd_1' },
        a2: { name: 'pulsing part at 940 nm', value: 0.02, min: 1e-6, max: 1, tex: 'a_2' },
        d2: { name: 'steady part at 940 nm', value: 1, min: 1e-6, max: 100, tex: 'd_2' }
      },
      solveFor: 'R',
      note: 'The same arbitrary unit for all four: only the ratios matter.'
    },
    {
      name: 'Ideal Beer–Lambert model of the oximeter',
      expr: 'R = (eh1*(1 - S) + eo1*S)/(eh2*(1 - S) + eo2*S)', tex: 'R = \\frac{\\varepsilon_{h1}(1-S) + \\varepsilon_{o1}S}{\\varepsilon_{h2}(1-S) + \\varepsilon_{o2}S}',
      vars: {
        R: { name: 'ratio of ratios' },
        S: { name: 'oxygen saturation (fraction)', value: 0.9, min: 0.01, max: 1 },
        eh1: { name: 'absorption of deoxygenated blood at 660 nm', value: 3226, min: 1, max: 1e5, tex: '\\varepsilon_{h1}' },
        eo1: { name: 'absorption of oxygenated blood at 660 nm', value: 320, min: 1, max: 1e5, tex: '\\varepsilon_{o1}' },
        eh2: { name: 'absorption of deoxygenated blood at 940 nm', value: 693, min: 1, max: 1e5, tex: '\\varepsilon_{h2}' },
        eo2: { name: 'absorption of oxygenated blood at 940 nm', value: 1214, min: 1, max: 1e5, tex: '\\varepsilon_{o2}' }
      },
      solveFor: 'R',
      note: 'Typical molar extinction coefficients, in cm⁻¹ per mol/L, rounded. An idealization without scattering: real devices use a measured calibration.'
    }
  ],
  examples: [
    {
      title: 'The depth resolution of an eye scanner',
      q: 'An OCT scanner for the retina uses a source centred at 840 nm with a bandwidth of 50 nm. What depth resolution does it give in air and in tissue of index 1.38?',
      steps: [
        { text: 'In air:', tex: '\\Delta z = 0.44 \\times \\frac{(840\\ \\mathrm{nm})^2}{50\\ \\mathrm{nm}} = 6.2\\ \\mu\\mathrm{m}' },
        'Inside tissue the wavelength is shorter by the index, so the layers are resolved at $6.2/1.38 = 4.5$ µm.'
      ],
      a: '6.2 µm in air, 4.5 µm in tissue. Doubling the bandwidth would halve both.'
    },
    {
      title: 'Reading a ratio of ratios',
      q: 'An oximeter finds AC/DC of 0.012 at 660 nm and 0.020 at 940 nm. What is $R$, and what saturation does the ideal model give?',
      steps: [
        { text: 'The ratio of ratios:', tex: 'R = \\frac{0.012}{0.020} = 0.60' },
        'In the ideal model $R$ falls from 1.13 at 70 % to 0.81 at 80 % and 0.53 at 90 %, so 0.60 lies at about 87 %.',
        'A real device would look $R$ up in its own empirical calibration; the number from the ideal model is only the shape of the idea.'
      ],
      a: 'R = 0.60, about 87 % in the ideal model; real devices use a measured calibration.'
    }
  ],
  quiz: [
    { q: 'An OCT source is centred at 1310 nm with a bandwidth of 100 nm. What is the depth resolution in air, in micrometres?', answer: 7.55, why: 'Δz = 0.44 × 1310² / 100 nm = 7550 nm = 7.55 µm.' },
    { q: 'A pulse oximeter finds AC/DC of 0.02 at 660 nm and 0.04 at 940 nm. What is the ratio of ratios?', answer: 0.5, why: 'R = (0.02) / (0.04) = 0.5.' },
    { q: 'Why does a surgical microscope have an objective of 200 to 400 mm focal length?', choices: ['to leave room between the lens and the patient for hands and instruments', 'to reduce the magnification to one', 'to make the image brighter', 'to avoid the need for eyepieces'], a: 0, why: 'The working distance is about the focal length of the objective. A long focal length gives room to work under the microscope, at the cost of needing a larger objective for the same resolution.' },
    { q: 'Why does a fundus camera illuminate the retina through the edge of the pupil and image it through the centre?', choices: ['so that light reflected from the cornea does not reach the camera', 'to make the pupil smaller', 'so that the eye does not need to focus', 'to use less light'], a: 0, why: 'The cornea reflects some of the illumination straight back. Keeping the two paths apart in the pupil sends that glare away from the camera.' },
    { q: 'An endoscope\'s flexible image guide has 30 000 fibres. Its picture has at most about 30 000 pixels.', a: true, why: 'Each fibre carries one picture element (a coherent bundle), so the pixel count is the number of fibres; a chip on the tip has no such limit.' }
  ],
  applications: [
    'Keyhole surgery and diagnostic examination: laparoscopes, arthroscopes, bronchoscopes and endoscopes of the digestive tract.',
    'Operating theatres: neurosurgery, ear and eye surgery under a surgical microscope.',
    'Eye care: OCT and fundus cameras are routine tools ([[oct-in-eye-care]]).',
    'Monitoring: the pulse oximeter on a finger or earlobe in hospitals, ambulances and home devices.'
  ],
  history: 'Philipp Bozzini showed a light-carrying tube for looking into the body in 1806. Harold Hopkins\'s rod-lens relay of the late 1950s and 1960s made rigid endoscopes many times brighter. OCT was demonstrated in 1991, and the pulse oximeter in its modern form was developed in the 1970s and 1980s.',
  sources: [
    'W. Drexler and J. G. Fujimoto (eds.), *Optical Coherence Tomography: Technology and Applications* (Springer).',
    'J. G. Webster (ed.), *Design of Pulse Oximeters* (Institute of Physics Publishing).',
    'M. Bass (ed.), *Handbook of Optics*, volume on biomedical optics and instruments.'
  ],
  sim: 'ix-oximeter'
},

/* ================================================================ optical sorting and colour measurement */
{
  id: 'optical-sorting-and-colour-measurement', parent: 'industrial-and-scientific-systems', title: 'Optical sorting and colour measurement', level: 2,
  short: 'A belt sorter looks at every grain with a line camera and fires an air jet at the ones whose colour is too far from the reference; a colorimeter measures one sample with a fixed geometry, d/8 or 45/0. Both reduce light to CIELAB numbers and compare them: a difference of ΔE of about 1 is the least a person notices.',
  keywords: ['optical sorter', 'colour sorting', 'belt sorter', 'chute sorter', 'ejector', 'air jet', 'line camera', 'colorimeter', 'spectrophotometer', 'd/8', '45/0', 'integrating sphere', 'specular included', 'delta E', 'CIELAB', 'colour tolerance', 'colour measurement', 'reference colour'],
  prereq: ['colour-difference-and-tolerance', 'area-scan-and-line-scan-cameras', 'the-chromaticity-diagram'],
  related: ['the-integrating-sphere', 'spectrophotometers', 'colour-and-multispectral-imaging', 'metamerism', 'the-vision-inspection-cell', 'spectroscopy-in-industry', 'triggering-and-strobing', 'colour-temperature-and-colour-rendering'],
  body: `
Two machines turn colour into a decision. A **sorter** looks at thousands of objects a second (rice, nuts, plastic flakes, ore) and removes the wrong ones. A **colorimeter** measures a single sample, a paint chip or a moulded plaque, to say how far it lies from a standard. Both end in the same arithmetic: CIELAB coordinates and a distance between them. [[how-to-read-an-optical-system|Read each in the order of the light.]]

### The sorter, from feed to jet
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Chute or belt | spreads the product into one layer and drops it through the view at a few metres per second | — |
| 2 | LED bars on both sides | light both faces of each piece with an even, stable colour | [[light-emitting-diodes]] |
| 3 | Background plates | give the camera a calm backdrop matched to the product | — |
| 4 | Lens and line-scan camera, colour or near-infrared | records the falling stream one line at a time | [[area-scan-and-line-scan-cameras]] |
| 5 | Processor | finds each object, converts its colour to CIELAB and compares it with the accepted set | [[colour-difference-and-tolerance]] |
| 6 | Row of fast air valves | a puff, timed from the speed, knocks a rejected piece into the second bin | [[triggering-and-strobing]] |

With 0.1 mm pixels on product moving at 3 m/s the camera reads $3/0.0001 = 30$ kHz lines. A jet 150 mm below the camera fires 50 ms after the picture; the valve opens in about a millisecond, in which the piece falls 3 mm, so the nozzles are spaced a few millimetres apart.

### Colour difference
The distance between two colours in CIELAB is $\\Delta E = \\sqrt{\\Delta L^2 + \\Delta a^2 + \\Delta b^2}$. A trained eye sees about 1; side by side, 2 to 3 is plain. The sorter sets its **threshold** in $\\Delta E$ from the reference: a low threshold removes defects but also good pieces of natural variation, a high one lets defects through. Measurement noise widens the spread of each group and makes the trade-off worse.

### The colorimeter's geometry
Colour depends on how the sample is lit and viewed. Standard geometries fix it: **d/8** lights the sample diffusely from an integrating sphere ([[the-integrating-sphere]]) and views it at 8° (the specular reflection can be included or excluded, to measure colour with or without gloss); **45/0** lights it from a ring at 45° and views it along the normal, which ignores gloss and is closer to how a surface looks in the hand. Two instruments agree only if their geometries do.

> [!key] A sorter is a line camera, a colour threshold in ΔE and a timed air jet; a colorimeter is a fixed geometry plus the same ΔE arithmetic. The numbers that matter are the line rate, the delay to the jet and the spread of the colours being separated.
`,
  ideas: [
    'A belt or chute sorter views each piece with a line camera and removes it with a timed air valve.',
    'The line rate is the product speed divided by the pixel size on the product; 3 m/s and 0.1 mm give 30 kHz.',
    'The delay to the jet is the distance divided by the speed; the valve\'s opening time sets how finely the jets must be spaced.',
    'CIELAB ΔE is the straight-line distance between two colours: about 1 is just noticeable.',
    'A colorimeter\'s geometry (d/8 or 45/0, gloss included or excluded) is part of the measurement.'
  ],
  pitfalls: [
    'A ΔE threshold of zero would give a perfect product — Natural variation makes even good pieces differ by a few ΔE, so a low threshold throws away much good product with the bad.',
    'Two colorimeters always give the same ΔE — Different geometries (d/8 or 45/0, gloss included or excluded) measure different things; instruments agree only when their geometry is the same.',
    'A sorter needs a colour camera — Near-infrared and shape cameras sort plastics and foreign bodies that look the same in colour; many sorters combine several.',
    'The jet can fire as soon as the verdict arrives — It must be timed to the piece\'s position, which depends on its speed and the valve\'s response; a jittery speed misses small pieces.'
  ],
  terms: [
    { term: 'Optical sorter', also: ['colour sorter'], def: 'A machine that inspects each piece of a stream of product with a camera and removes the ones that fail with an air jet or a flap.' },
    { term: 'Ejector', also: ['air valve', 'jet bank'], def: 'A bank of fast solenoid valves, each with a small nozzle, that fires a puff of compressed air at a rejected piece as it falls past.' },
    { term: 'ΔE', also: ['delta E', 'colour difference'], def: 'The distance between two colours in a colour space. In CIELAB (1976) it is √(ΔL² + Δa² + Δb²); about 1 is the smallest difference a trained observer notices.' },
    { term: 'd/8 geometry', also: ['diffuse/8°', 'sphere geometry'], def: 'A colour-measuring geometry in which an integrating sphere lights the sample diffusely and the detector views it at 8° from the normal; the gloss can be included or excluded.' },
    { term: '45/0 geometry', also: ['45°/0°'], def: 'A geometry that lights the sample at 45° and views it along the normal (or the reverse), so the gloss of the surface is excluded.' },
    { term: 'Specular component', also: ['SCI', 'SCE'], def: 'The mirror-like reflection from the surface of a sample. Measuring with it included (SCI) or excluded (SCE) separates colour from gloss.' }
  ],
  formulas: [
    {
      name: 'Colour difference (CIELAB 1976)',
      expr: 'dE = sqrt(dL^2 + da^2 + db^2)', tex: '\\Delta E = \\sqrt{\\Delta L^2 + \\Delta a^2 + \\Delta b^2}',
      vars: {
        dE: { name: 'colour difference', tex: '\\Delta E' },
        dL: { name: 'difference in lightness L*', value: -1.5, signed: true, tex: '\\Delta L' },
        da: { name: 'difference in a*', value: 4, signed: true, tex: '\\Delta a' },
        db: { name: 'difference in b*', value: -3, signed: true, tex: '\\Delta b' }
      },
      solveFor: 'dE',
      note: 'About 1 is just noticeable to a trained observer; many industries set tolerances between 0.5 and 3.'
    },
    {
      name: 'Line rate of the sorter',
      expr: 'r = v/p', tex: 'r = \\frac{v}{p}',
      vars: {
        r: { name: 'line rate', q: 'frequency', unit: 'kHz' },
        v: { name: 'speed of the product', q: 'speed', unit: 'm/s', value: 3 },
        p: { name: 'pixel size on the product', q: 'length', unit: 'µm', value: 100 }
      },
      solveFor: 'r',
      note: 'One line per pixel of travel, so that the pixels are square.',
      stories: { r: 'The product falls at {v} and a pixel covers {p} of it. How many lines a second must the camera read?' }
    },
    {
      name: 'Delay to the jet',
      expr: 't = d/v', tex: 't = \\frac{d}{v}',
      vars: {
        t: { name: 'delay from picture to puff', q: 'time', unit: 'ms' },
        d: { name: 'distance from camera line to nozzles', q: 'length', unit: 'mm', value: 150 },
        v: { name: 'speed of the product', q: 'speed', unit: 'm/s', value: 3 }
      },
      solveFor: 't',
      note: 'Add the valve\'s opening time to find the timing of the command; a speed error is a position error at the jet.',
      stories: { t: 'The nozzles are {d} below the camera line and the product moves at {v}. How long after the picture must the valve fire?' }
    }
  ],
  examples: [
    {
      title: 'Is it a defect?',
      q: 'The reference colour of a nut is $L^*=62$, $a^*=8$, $b^*=28$. A piece measures 60.5, 12 and 25. What is $\\Delta E$, and does it pass a threshold of 6?',
      steps: [
        { text: 'The differences are $\\Delta L = -1.5$, $\\Delta a = +4$, $\\Delta b = -3$:', tex: '\\Delta E = \\sqrt{2.25 + 16 + 9} = 5.2' },
        'That is below 6, so the piece is accepted. At a threshold of 4 it would have been ejected.'
      ],
      a: '$\\Delta E = 5.2$: accepted at a threshold of 6, ejected at 4.'
    },
    {
      title: 'Timing the jet',
      q: 'Product falls past the camera at 3 m/s with a 0.1 mm pixel, and the nozzles are 150 mm lower. What are the line rate and the delay, and how far does the piece move while the valve opens in 1 ms?',
      steps: [
        { text: 'Line rate:', tex: 'r = \\frac{3\\ \\mathrm{m/s}}{0.1\\ \\mathrm{mm}} = 30\\ \\mathrm{kHz}' },
        { text: 'Delay:', tex: 't = \\frac{0.15\\ \\mathrm{m}}{3\\ \\mathrm{m/s}} = 50\\ \\mathrm{ms}' },
        'In 1 ms of valve opening the piece falls 3 mm, which is why the nozzles are only a few millimetres apart and why a 1 % error in the speed estimate matters little but a jittery one matters a great deal.'
      ],
      a: '30 kHz lines, 50 ms delay, 3 mm of fall during the valve\'s opening.'
    }
  ],
  quiz: [
    { q: 'Product moves at 2 m/s and each camera pixel covers 0.2 mm of it. What line rate is needed, in kilohertz?', answer: 10, why: 'r = v / p = 2 m/s / 0.2 mm = 10 000 lines a second, 10 kHz.' },
    { q: 'Two colours differ by ΔL = 3, Δa = 4 and Δb = 0 in CIELAB. What is ΔE?', answer: 5, why: 'ΔE = √(9 + 16 + 0) = 5.' },
    { q: 'Lowering the ΔE threshold of a sorter to a very small value will…', choices: ['reject many good pieces together with the defects', 'let more defects through', 'speed up the belt', 'change the colour of the product'], a: 0, why: 'Natural variation spreads the good pieces over a few ΔE, so a very strict threshold ejects many of them.' },
    { q: 'Which colour-measuring geometry lights the sample from a ring at 45° and views it along the normal?', choices: ['45/0', 'd/8', 'd/0 with specular included', '0/0'], a: 0, why: '45/0 (or 0/45) lights at one angle and views at another, excluding the surface gloss; d/8 uses an integrating sphere.' },
    { q: 'Measuring a glossy sample with the specular component included gives the same colour value as with it excluded.', a: false, why: 'Including the specular reflection adds the surface gloss to the measured reflectance, so the numbers differ; the pair of measurements separates gloss from colour.' }
  ],
  applications: [
    'Food: rice, nuts, coffee, potatoes, dried fruit, frozen vegetables; removing discoloured pieces, shells and foreign objects.',
    'Recycling: plastic flakes by colour and polymer type (near-infrared), glass cullet, paper and metals.',
    'Mining: ore sorting by colour, transmission or fluorescence before crushing.',
    'Paints, plastics, textiles, printing: colorimeters check batches against the standard to a tolerance of ΔE.',
    'Display and lighting production: colour matching of screens and LED bins ([[colour-temperature-and-colour-rendering]]).'
  ],
  history: 'Photoelectric colour sorters for grain and other foods appeared in the 1940s; line cameras and fast valves made them far more accurate in the 1980s and 1990s. CIE adopted the CIELAB space and its ΔE in 1976, and the standard colour-measuring geometries are set out in CIE publication 15.',
  sources: [
    'CIE 15, *Colorimetry* (International Commission on Illumination) — standard measuring geometries and CIELAB.',
    'R. W. G. Hunt and M. R. Pointer, *Measuring Colour* (Wiley).',
    'G. Wyszecki and W. S. Stiles, *Color Science: Concepts and Methods, Quantitative Data and Formulae* (Wiley).'
  ],
  sim: 'ix-sorter'
}
,

/* ================================================================ interferometers in precision engineering */
{
  id: 'interferometers-in-precision-engineering', parent: 'industrial-and-scientific-systems', title: 'Interferometers in precision engineering', level: 3,
  short: 'A laser interferometer counts the bright-and-dark cycles of interference between a fixed beam and one that moves with a machine; each cycle is half a wavelength of travel, so light becomes a ruler. Its enemy is the air, whose index changes by about one part per million per kelvin; the same principle on 4 km arms senses gravitational waves.',
  keywords: ['laser interferometer', 'displacement interferometer', 'machine tool calibration', 'fringe counting', 'quadrature', 'retroreflector', 'air index', 'Edlén', 'wavelength compensation', 'dead path', 'helium-neon laser', 'gravitational wave detector', 'strain', 'Michelson', 'metrology', 'laser tracker'],
  prereq: ['michelson-interferometer', 'constructive-and-destructive-interference', 'testing-surfaces-with-interferometers'],
  related: ['polarizing-beam-splitters', 'retroreflectors', 'refractive-index', 'fabry-perot-interferometer', 'linewidth-and-coherence-of-lasers', 'helium-neon-laser', 'distance-and-displacement-sensors', 'mach-zehnder-and-sagnac', 'photolithography'],
  body: `
A laser interferometer is the most accurate ruler in a workshop. It counts the bright-and-dark cycles of the interference between a fixed beam and a beam that travels with the machine. Each cycle is half a wavelength of movement, so the wavelength of light becomes a length. [[how-to-read-an-optical-system|Read from laser to counter]]:

### Following the light
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Frequency-stabilized helium–neon laser, 632.8 nm | its wavelength is steady to a tiny fraction of a part per million | [[helium-neon-laser]] |
| 2 | Polarizing beam splitter | sends one polarization to the fixed arm and the other to the moving arm | [[polarizing-beam-splitters]] |
| 3 | Two retroreflectors, one fixed, one on the machine | each returns its beam parallel to itself, so a small tilt does not matter | [[retroreflectors]] |
| 4 | Recombination and a 45° analyser, then photodiodes | the beams interfere; two signals a quarter-cycle apart give the direction as well as the count | [[constructive-and-destructive-interference]] |
| 5 | Counter and environment sensors | counts fringes and corrects the wavelength for air temperature, pressure and humidity | [[refractive-index]] |

### One count is half a wavelength
When the moving reflector goes a distance $d$, the beam's path changes by $2d$ (out and back), so the number of fringes is $N = 2d/\\lambda$. For 632.8 nm one fringe is 316.4 nm of travel: a 100 mm axis moves through 316 056 fringes. Electronics divide each fringe into parts, 79 nm at a fourth, about 1.2 nm at 256.

### The air is the weak point
The wavelength in air is $\\lambda_\\text{vac}/n$, with $n - 1 \\approx 2.8 \\times 10^{-4}$. It changes by about $-0.94$ ppm per kelvin and $+0.27$ ppm per hectopascal. Over a metre of travel a 3 K error in the air temperature is 2.8 µm, far larger than the resolution and comparable to the accuracy asked of a machine tool. So the instrument measures temperature, pressure and humidity and corrects the wavelength. It also matters how much of the path is *dead*: air between the optics at the start, which the correction does not follow.

### The extreme case
Gravitational-wave detectors are Michelson interferometers with arms 4 km long, light of 1064 nm, mirrors of 40 kg hung in vacuum and arm cavities that fold the light back and forth many times. A passing wave changes the arm length by $h L$; with $h \\approx 10^{-21}$ that is $4 \\times 10^{-18}$ m, about 1/200 of a proton's radius, or $4\\times 10^{-12}$ of one wavelength. The first detection was reported in 2016.

> [!warn] Interferometer lasers are low-power helium–neon lasers, but a retroreflector sends the beam straight back along its path. Never look into the beam or into the retroreflector; follow the maker's class labels ([[laser-safety-classes]]).

> [!key] One fringe is half a wavelength, so counting fringes measures length with nanometre resolution. The accuracy is set by the wavelength in air, which changes by about 1 ppm per kelvin: the instrument is as good as its environmental correction.
`,
  ideas: [
    'A displacement interferometer counts fringes: N = 2d/λ, one fringe per half-wavelength of travel.',
    'Retroreflectors return the beams parallel to themselves, so the measurement is insensitive to small tilts of the moving part.',
    'Two detectors in quadrature give the direction of motion and allow division of a fringe into 4 to 256 parts.',
    'The wavelength in air changes by about 1 ppm per kelvin and 0.27 ppm per hectopascal; the instrument must correct for it.',
    'The same arrangement with 4 km arms detects strains of about 10⁻²¹, displacements of 10⁻¹⁸ m.'
  ],
  pitfalls: [
    'The laser wavelength is a fixed ruler — The wavelength in vacuum is fixed; in air it changes with temperature, pressure and humidity by parts in a million, so the instrument must measure the air and correct.',
    'More fringes counted means a more accurate result — Counting is exact; the accuracy is limited by the wavelength used (air conditions), by tilt and cosine error of alignment, and by the thermal expansion of the machine itself.',
    'A gravitational-wave detector is a very large ruler — It measures a change of length, tiny compared with an atomic nucleus, by light interference, with mirrors isolated from the ground and cooled by vacuum to avoid every disturbance.',
    'Any laser will do — The wavelength must be known and stable to better than a part in 10⁷; interferometer lasers are frequency-stabilized, with the stability the specification quotes.'
  ],
  terms: [
    { term: 'Laser interferometer', also: ['displacement interferometer'], def: 'An instrument that measures a distance by counting the interference fringes between a reference beam and a beam reflected from a moving target; each fringe is half a wavelength of movement.' },
    { term: 'Fringe counting', def: 'Keeping a running total of the bright-to-dark cycles of the interference signal as the target moves; the count times λ/2 is the displacement.' },
    { term: 'Quadrature signals', also: ['sine and cosine outputs'], def: 'Two interference signals shifted by a quarter of a cycle, which show the direction of movement and allow a fringe to be divided into smaller steps.' },
    { term: 'Air-index compensation', also: ['Edlén equation', 'wavelength correction'], def: 'The correction of the laser wavelength for the refractive index of the air, calculated from measured temperature, pressure and humidity.' },
    { term: 'Dead path', def: 'The length of air in the beam path at the start of a measurement, before the target moves. It is not counted by the interferometer yet changes with the air, so it causes an error if not corrected.' },
    { term: 'Strain', also: ['h'], def: 'The fractional change in length, ΔL/L. A gravitational wave of strain 10⁻²¹ changes a 4 km arm by 4 × 10⁻¹⁸ m.' }
  ],
  formulas: [
    {
      name: 'Fringes counted',
      expr: 'N = 2*d/lam', tex: 'N = \\frac{2d}{\\lambda}',
      vars: {
        N: { name: 'number of fringes' },
        d: { name: 'travel of the target', q: 'length', unit: 'mm', value: 100 },
        lam: { name: 'wavelength in the air', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      solveFor: 'N',
      note: 'The path changes by 2d for a displacement d, so one fringe is half a wavelength of travel.',
      stories: { N: 'A reflector travels {d} and the laser wavelength in the air is {lam}. How many fringes does the counter record?', d: 'The counter records {N} fringes of light of {lam}. How far did the target move?' }
    },
    {
      name: 'Error from an air-temperature error',
      expr: 'err = L*kT*dT', tex: '\\delta = L\\,k_T\\,\\Delta T',
      vars: {
        err: { name: 'error in the measured length', q: 'length', unit: 'µm', tex: '\\delta' },
        L: { name: 'measured length', q: 'length', unit: 'm', value: 1 },
        kT: { name: 'change of the air index per kelvin', q: 'ratio', unit: 'ppm', value: 0.94, tex: 'k_T' },
        dT: { name: 'error in the air temperature', q: 'dtemp', unit: 'K', value: 3, signed: true, tex: '\\Delta T' }
      },
      solveFor: 'err',
      note: 'Near 20 °C and 1013 hPa; 0.94 ppm per kelvin is (n − 1)/T. A pressure error of 1 hPa gives 0.27 ppm.',
      stories: { err: 'A {L} axis is measured with the air temperature off by {dT}. By how much does the length come out wrong?' }
    },
    {
      name: 'Length change of a gravitational-wave detector',
      expr: 'dL = h*L', tex: '\\Delta L = h\\,L',
      vars: {
        dL: { name: 'change of the arm length', q: 'length', unit: 'm', tex: '\\Delta L' },
        h: { name: 'strain', value: 1e-21 },
        L: { name: 'arm length', q: 'length', unit: 'km', value: 4 }
      },
      solveFor: 'dL',
      note: 'A strain of 10⁻²¹ on 4 km arms is 4 × 10⁻¹⁸ m.'
    }
  ],
  examples: [
    {
      title: 'Counting a machine axis',
      q: 'A helium–neon interferometer (632.8 nm) measures a 100 mm move of a machine axis. How many fringes are counted, and what is the size of one step after the electronics divide a fringe by 256?',
      steps: [
        { text: 'Fringes:', tex: 'N = \\frac{2 \\times 0.1\\ \\mathrm{m}}{632.8\\ \\mathrm{nm}} = 316\\,056' },
        'One fringe is $\\lambda/2 = 316.4$ nm; divided by 256 each step is 1.2 nm.'
      ],
      a: '316 056 fringes; steps of 1.2 nm.'
    },
    {
      title: 'A warm workshop',
      q: 'The air in the beam path of a 1 m axis is 3 K warmer than the temperature sensor says. By how much is the measured length wrong?',
      steps: [
        { text: 'The air index changes by 0.94 ppm per kelvin:', tex: '\\delta = 1\\ \\mathrm{m} \\times 0.94\\times 10^{-6}\\ \\mathrm{K^{-1}} \\times 3\\ \\mathrm{K} = 2.8\\ \\mu\\mathrm{m}' },
        'That is about 9 fringes of 316 nm: invisible in the signal, plain in the result.'
      ],
      a: '2.8 µm: more than the resolution of the instrument by a factor of a thousand. Hence the air sensors.'
    }
  ],
  quiz: [
    { q: 'A target travels 50 mm and the wavelength in the air is 632.8 nm. How many fringes does the counter record?', answer: 158028, why: 'N = 2d/λ = 0.1 m / 632.8 nm = 158 028 fringes.' },
    { q: 'The air temperature is wrong by 2 K over a 1 m measurement. By roughly how much does the length come out wrong, in micrometres?', answer: 1.88, why: 'The air index changes by 0.94 ppm per kelvin: 1 m × 0.94 ppm/K × 2 K = 1.88 µm.' },
    { q: 'Why does a displacement interferometer usually carry retroreflectors rather than flat mirrors?', choices: ['the returned beam stays parallel to the incoming beam even if the target tilts', 'they weigh less', 'they change the wavelength', 'they make the fringes brighter'], a: 0, why: 'A flat mirror that tilts sends the beam off to one side and the interference is lost. A corner-cube retroreflector sends it back parallel to itself.' },
    { q: 'One fringe of an interferometer corresponds to a movement of the target by…', choices: ['half a wavelength', 'a whole wavelength', 'a quarter of a wavelength', 'two wavelengths'], a: 0, why: 'The beam goes out and comes back, so the path changes by twice the movement; one fringe is a path change of one wavelength, hence half a wavelength of movement.' },
    { q: 'A gravitational-wave detector with 4 km arms sees a strain of 10⁻²¹. By how much does an arm change in length, in metres?', answer: 4e-18, why: 'ΔL = hL = 10⁻²¹ × 4000 m = 4 × 10⁻¹⁸ m.' }
  ],
  applications: [
    'Calibrating machine tools, coordinate-measuring machines and positioning stages, axis by axis.',
    'The position feedback of lithography scanners, which place the wafer stage to a nanometre ([[photolithography]]).',
    'Realizing the metre: laser wavelengths and interferometers link measurements to the definition of length.',
    'Gravitational-wave observatories, which compare the lengths of two 4 km arms.'
  ],
  history: 'Albert Michelson built his interferometer in the 1880s and used it to measure the metre in light waves in the 1890s. Interferometers with stabilized helium–neon lasers and fringe counting appeared in the 1960s and 1970s. B. Edlén\'s 1966 paper on the refractive index of air became the basis of the correction, later refined. The first detection of a gravitational wave by interferometer was reported in 2016.',
  sources: [
    'P. Hariharan, *Basics of Interferometry* (Academic Press).',
    'B. Edlén, "The refractive index of air", *Metrologia* 2 (1966), 71–80.',
    'B. P. Abbott et al., "Observation of gravitational waves from a binary black hole merger", *Physical Review Letters* 116 (2016), 061102.'
  ],
  sim: 'ix-interferometer'
},

/* ================================================================ cinema and stage lighting */
{
  id: 'cinema-and-stage-lighting-systems', parent: 'industrial-and-scientific-systems', title: 'Cinema and stage lighting', level: 2,
  short: 'Entertainment lighting is projection on a large scale. A profile spot images a lit gate through a lens to cut a sharp-edged pool of light on the stage, a Fresnel spot softens it, and a cinema projector sends a modulated image of a xenon or laser source to a screen that must reach about 48 cd/m².',
  keywords: ['stage lighting', 'ellipsoidal spot', 'profile spot', 'ERS', 'Fresnel spot', 'gobo', 'gate', 'moving head', 'beam angle', 'throw', 'cinema projector', 'xenon lamp', 'laser phosphor', 'screen luminance', 'foot-lambert', 'cold mirror', 'follow spot'],
  prereq: ['parabolic-and-elliptical-mirrors', 'the-thin-lens-equation', 'fresnel-lenses'],
  related: ['projector-illumination', 'xenon-arc-and-flash-lamps', 'dichroic-filters-and-mirrors', 'the-data-projector', 'lumens-candelas-lux-and-nits', 'apertures-irises-and-pinholes', 'laser-projection-and-displays', 'catalogue-lens-types'],
  body: `
Entertainment lighting is projection on a large scale: a lamp, some optics, and a picture thrown a long way, either as a shaped pool of light on a stage or as a film on a screen. [[how-to-read-an-optical-system|Read each from lamp to stage or screen.]]

### The profile spot (ellipsoidal reflector spot)
| # | Part | What it does | Page |
|---|---|---|---|
| 1 | Lamp: LED engine or tungsten–halogen | the source, placed at the first focus of the reflector | [[light-emitting-diodes]], [[halogen-lamps]] |
| 2 | Ellipsoidal reflector | gathers the light over a wide angle and brings it to the second focus; a cold-mirror coating passes the heat out of the back | [[parabolic-and-elliptical-mirrors]] |
| 3 | Gate: four framing shutters, an iris, a slot for a gobo | cut-outs at the plane where the light is concentrated; whatever is here is what is imaged | [[apertures-irises-and-pinholes]] |
| 4 | Colour frame: dichroic or gel | tints the light | [[dichroic-filters-and-mirrors]] |
| 5 | Lens tube: one or two plano-convex lenses that slide | images the gate on the stage; sliding focuses it | [[catalogue-lens-types]] |
| 6 | The stage | receives a sharp-edged picture of the gate | — |

### Why the edges are sharp
The lens simply forms an image of the gate, so $s_o$ is a little more than $f$ and the stage is the image plane. With a 70 mm gate and a 150 mm lens the beam angle is $2\\arctan(g/2f) = 26.3°$, and at 10 m the pool is $g\\,(T-f)/f = 4.6$ m across. Focusing for a 10 m throw puts the lens 2.3 mm beyond $f$ from the gate; for 5 m, 4.6 mm. A millimetre of error, with a lens 100 mm across, blurs the edge by some 43 mm at 10 m: the focus is fine, and a gobo is only sharp at one distance.

### Fresnel spots and moving heads
A **Fresnel spot** has a stepped lens ([[fresnel-lenses]]) and a spherical reflector behind the lamp. Sliding the lamp towards or away from the lens changes the beam from a spot to a flood, roughly 10° to 60° wide, with a soft edge: it images nothing. A **moving head** is a profile or wash optic with gobo and colour wheels, a zoom and often a prism, on a pan-and-tilt yoke.

### The cinema projector
A digital cinema projector puts a xenon arc ([[xenon-arc-and-flash-lamps]]), or a laser-phosphor or red–green–blue laser source, through an integrator ([[projector-illumination]]) onto three micromirror chips and a long-throw lens ([[the-data-projector]]). The screen is to reach about 48 cd/m² (14 foot-lamberts). A white screen of gain one is diffuse, so $E = \\pi L$ = 151 lx, and a 15 m × 6.3 m screen needs about 14 000 lm; much of the lamp's light is lost on the way, which is why the xenon lamps run at several kilowatts.

> [!warn] Xenon arc lamps are pressurized and emit ultraviolet: they are replaced only by trained staff in their housings. Laser effects aimed at an audience must keep the light below the eye-safe limit ([[laser-projection-and-displays]]).

> [!key] A profile spot is a camera in reverse: it images a bright gate through a lens, so its edges are sharp only at one throw. Cinema is the same idea with a modulator at the gate and a luminance target on the screen.
`,
  ideas: [
    'A profile spot images its gate on the stage; the shutters, iris and gobo are cut-outs in that plane.',
    'The beam angle is 2·arctan(gate/2f): a shorter lens makes a wider beam.',
    'Focusing moves the lens a few millimetres; the gobo is sharp at one throw only.',
    'A Fresnel spot images nothing: moving the lamp changes the spread and the edge is soft.',
    'A cinema screen needs about 48 cd/m²; at gain one that is E = πL, about 151 lx.'
  ],
  pitfalls: [
    'A profile spot is a flashlight with a lens — It forms a real image of the gate at the stage, so the edge sharpness and the gobo detail depend on the lens position and the throw.',
    'A wider beam angle simply means a bigger lens — The beam angle is set by the gate size and the focal length of the lens: a shorter focal length gives a wider beam.',
    'The heat from a theatre lamp comes out with the light — Cold mirrors reflect the visible light and let the infrared escape to the rear of the lamp house.',
    'More lumens always give a brighter screen — The screen brightness is lumens divided by screen area (and its gain); a bigger screen needs a bigger projector for the same luminance.'
  ],
  terms: [
    { term: 'Profile spot', also: ['ellipsoidal reflector spotlight', 'ERS'], def: 'A stage luminaire with an ellipsoidal reflector and a lens that images a gate containing shutters, iris or gobo onto the stage, giving a sharp-edged pool of light.' },
    { term: 'Gate', def: 'The opening at the second focus of the reflector, with framing shutters, an iris and a slot for a gobo; the lens images it onto the stage.' },
    { term: 'Gobo', also: ['pattern template'], def: 'A thin metal or glass plate with a pattern that is placed in the gate so that the pattern is projected onto the stage.' },
    { term: 'Beam angle', also: ['field angle'], def: 'The full angle of the cone of light of a luminaire; for a profile spot, about 2·arctan(gate size / 2f).' },
    { term: 'Throw', def: 'The distance from a luminaire or projector to the surface it lights.' },
    { term: 'Foot-lambert', also: ['fL'], def: 'A unit of luminance: 1 fL = 3.426 cd/m². The cinema standard is 14 fL (about 48 cd/m²) at the centre of the screen.' }
  ],
  formulas: [
    {
      name: 'Beam angle of a profile spot',
      expr: 'theta = 2*atan(g/(2*f))', tex: '\\theta = 2\\arctan\\frac{g}{2f}',
      vars: {
        theta: { name: 'beam angle', q: 'angle', unit: '°', tex: '\\theta' },
        g: { name: 'gate size', q: 'length', unit: 'mm', value: 70 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 150 }
      },
      solveFor: 'theta',
      note: 'The lens images the gate; its edge rays leave at this angle.',
      stories: { theta: 'A gate {g} wide is imaged by a lens of focal length {f}. What is the beam angle?' }
    },
    {
      name: 'Size of the pool of light',
      expr: 'S = g*(T - f)/f', tex: 'S = g\\,\\frac{T - f}{f}',
      vars: {
        S: { name: 'size of the image of the gate', q: 'length', unit: 'm' },
        g: { name: 'gate size', q: 'length', unit: 'mm', value: 70 },
        T: { name: 'throw (distance to the stage)', q: 'length', unit: 'm', value: 10 },
        f: { name: 'focal length of the lens', q: 'length', unit: 'mm', value: 150 }
      },
      solveFor: 'S',
      note: 'The thin-lens magnification (T − f)/f for an image at distance T.',
      stories: { S: 'A gate {g} wide is imaged by a lens of focal length {f} onto a stage {T} away. How wide is the pool of light?' }
    },
    {
      name: 'Light a cinema screen needs',
      expr: 'Phi = pi*Ls*A/rho', tex: '\\Phi = \\frac{\\pi\\,L\\,A}{\\rho}',
      vars: {
        Phi: { name: 'luminous flux on the screen', q: 'luminousflux', unit: 'lm', tex: '\\Phi' },
        Ls: { name: 'screen luminance wanted', q: 'luminance', unit: 'cd/m²', value: 48, tex: 'L' },
        A: { name: 'area of the screen', q: 'area', unit: 'm²', value: 94.2 },
        rho: { name: 'reflectance of the screen (gain 1 is 100 %)', value: 1, min: 0.1, max: 2, tex: '\\rho' }
      },
      solveFor: 'Phi',
      note: 'For a diffusely reflecting (Lambertian) screen, L = ρE/π.',
      stories: { Phi: 'A screen of {A} must reach {Ls} with a reflectance of {rho}. How much light must the projector put on it?' }
    }
  ],
  examples: [
    {
      title: 'Choosing the lens',
      q: 'A theatre needs a pool of light about 3.4 m wide at a throw of 10 m. The gate of the profile spot is 70 mm. Which focal length does it need, and what is the beam angle?',
      steps: [
        { text: 'From $S = g(T-f)/f$ solve for $f$:', tex: 'f = \\frac{g\\,T}{S + g} = \\frac{70 \\times 10\\,000}{3430 + 70} = 200\\ \\mathrm{mm}' },
        { text: 'The beam angle follows:', tex: '\\theta = 2\\arctan\\frac{70}{2 \\times 200} = 19.9°' }
      ],
      a: 'A 200 mm lens, giving a beam of 19.9°.'
    },
    {
      title: 'A big screen',
      q: 'A cinema screen is 15 m wide and 6.28 m high with a reflectance of 1 (gain one). How much light must the projector deliver to reach 14 foot-lamberts?',
      steps: [
        'The luminance is 14 × 3.426 = 48 cd/m². The area is $15 \\times 6.28 = 94.2$ m².',
        { text: 'For a diffuse screen:', tex: '\\Phi = \\pi L A / \\rho = \\pi \\times 48 \\times 94.2 = 14\\,200\\ \\mathrm{lm}' }
      ],
      a: 'About 14 000 lm on the screen, before the losses between lamp and screen.'
    }
  ],
  quiz: [
    { q: 'A profile spot has a gate 70 mm wide and a lens of focal length 200 mm. What is its beam angle, in degrees?', answer: 19.9, why: 'θ = 2 arctan(70 / (2 × 200)) = 2 × 9.93° = 19.9°.' },
    { q: 'To make a profile spot\'s beam wider, which change works?', choices: ['a lens of shorter focal length', 'a lens of longer focal length', 'a smaller gate', 'a dimmer lamp'], a: 0, why: 'θ = 2 arctan(g/2f): a shorter f makes the angle larger, as does a bigger gate.' },
    { q: 'A gobo is projected sharply at 10 m. Moving the stage lights to 20 m without refocusing will leave the pattern sharp.', a: false, why: 'The lens images the gate only at the throw it is focused for. At another distance the pattern blurs, and the lens must slide a little to refocus.' },
    { q: 'A cinema screen of 94 m² (gain one) is to reach 48 cd/m². About how much light, in lumens, must reach it?', answer: 14200, why: 'Φ = π L A = π × 48 × 94 = 14 200 lm.' },
    { q: 'What is the purpose of a cold-mirror coating on the reflector of a stage lamp?', choices: ['to reflect visible light and let infrared heat pass out the back', 'to colour the light blue', 'to reflect heat to the stage', 'to make the lamp run hotter'], a: 0, why: 'A dichroic coating reflects the visible part of the spectrum and transmits the infrared, so less heat reaches the gate, the gels and the stage.' }
  ],
  applications: [
    'Theatre and concerts: profile spots and gobos for shaped pools and patterns of light, follow spots for performers.',
    'Television studios and film sets, lit from above with Fresnel and profile units.',
    'Moving heads for live shows and architecture: pan, tilt, colour and pattern changes from a console.',
    'Cinemas: xenon and laser projectors on screens of 10 m to 30 m width.'
  ],
  history: 'The Fresnel lens was introduced in lighthouses in the 1820s and reached the stage in the early twentieth century. The ellipsoidal reflector spot was developed in the United States in the 1930s. Digital cinema projection spread after 2000, and laser illumination of cinema projectors came into use in the 2010s.',
  sources: [
    'R. Pilbrow, *Stage Lighting Design: The Art, the Craft, the Life* (Nick Hern Books).',
    'SMPTE ST 431-2, *D-Cinema Quality — Reference Projector and Environment* — the screen luminance.',
    'W. J. Smith, *Modern Optical Engineering*, chapter on illumination and radiometry — the imaging of an aperture by a lens.'
  ],
  sim: 'ix-stage'
}

);
