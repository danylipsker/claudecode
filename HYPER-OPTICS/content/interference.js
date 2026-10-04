/* HYPER-OPTICS · content/interference.js — the topic "Interference" (simulations: sims/interference.js, ids in-…)
 * light-as-a-wave · superposition-and-phase · constructive-and-destructive-interference · coherence · youngs-double-slit ·
 * thin-film-interference · newtons-rings-and-wedge-fringes · michelson-interferometer · fabry-perot-interferometer ·
 * mach-zehnder-and-sagnac · testing-optics-with-fringes · speckle
 */
Hyper.add(

/* ================================================================ light as a wave */
{
  id: 'light-as-a-wave', parent: 'interference', title: 'Light as a wave: amplitude, phase, intensity', level: 1,
  short: 'Light is an oscillation of electric and magnetic fields. The amplitude sets how bright it is (intensity goes as the amplitude squared), the wavelength and frequency set the colour, and the phase says where in its cycle the wave is — the one thing a detector never sees, and the thing interference is made of.',
  keywords: ['wave', 'amplitude', 'phase', 'wavelength', 'frequency', 'period', 'intensity', 'irradiance', 'electric field', 'sinusoidal wave', 'wave number', 'angular frequency', 'plane wave', 'cosine wave', 'optical frequency', 'field strength'],
  prereq: ['what-is-light', 'wavelength-frequency-and-colour'],
  related: ['superposition-and-phase', 'refractive-index', 'optical-path-length', 'rays-and-wavefronts', 'huygens-construction', 'polarization-states', 'physics:electromagnetic-waves', 'physics:light-intensity', 'math:trig-functions'],
  body: `
A beam of light is a wave of electric and magnetic fields. At one point in space the electric field swings to and fro, through zero and back, about 545 million million times a second for green light. Nothing we can build follows that oscillation directly — the fastest photodiodes manage around $10^{11}$ cycles a second, thousands of times too slow — so a detector, and the eye, only ever report an *average*. Interference is the art of arranging things so that the average gives away what it normally hides.

### The wave and its numbers
A plane wave travelling along $x$ in a vacuum can be written

$$E(x,t) = E_0\\cos(kx - \\omega t + \\varphi)$$

- **Amplitude** $E_0$: the largest field strength, in volts per metre. Sunlight at the ground has $E_0 \\approx 870\\ \\mathrm{V/m}$.
- **Wavelength** $\\lambda$: the distance over which the pattern repeats. The **wave number** is $k = 2\\pi/\\lambda$, the phase gained per metre.
- **Frequency** $f$, period $T = 1/f$, angular frequency $\\omega = 2\\pi f$. In a vacuum $c = f\\lambda$.
- **Phase** $\\varphi$: where in its cycle the wave stands at $x = 0$, $t = 0$. One full cycle is $2\\pi$ radians or 360°.

| Light | Wavelength | Frequency | Period |
|---|---|---|---|
| violet | 400 nm | 749 THz | 1.33 fs |
| green, the eye's peak | 550 nm | 545 THz | 1.84 fs |
| helium–neon laser | 632.8 nm | 474 THz | 2.11 fs |
| deep red | 700 nm | 428 THz | 2.34 fs |
| Nd:YAG laser | 1064 nm | 282 THz | 3.55 fs |
| telecom fibre | 1550 nm | 193 THz | 5.17 fs |

(1 THz = $10^{12}$ Hz; 1 fs = $10^{-15}$ s.)

### Intensity goes as amplitude squared
What a detector responds to is the power per unit area, the **intensity** $I$, averaged over many cycles:

$$I = \\tfrac{1}{2}\\,n\\,c\\,\\varepsilon_0\\,E_0^{\\,2}$$

Double the amplitude and the intensity is four times as great. That square is what makes interference possible: two waves add as *fields*, with their signs, and only afterwards is the sum squared. Crest on crest gives a field twice as big and an intensity four times as big; crest on trough gives nothing.

### Inside a material
When light enters glass its frequency stays exactly as it was — the source fixes it. The speed drops to $c/n$ and so the wavelength shrinks to $\\lambda_0/n$. Green light of 550 nm in a vacuum is 362 nm long in N-BK7 ($n = 1.5185$). The phase therefore advances $n$ times faster per metre; after a distance $d$ it has gained $2\\pi n d/\\lambda_0$. The product $nd$ is the [[optical-path-length|optical path]], and it is the quantity interference actually measures.

### What the wave adds to the ray picture
A ray is a line; a wave has a **wavefront**, a surface of equal phase, and a ray is the line perpendicular to it ([[rays-and-wavefronts]]). Rays are an excellent description while everything is thousands of wavelengths across — a lens 25 mm wide is 45 000 wavelengths. They fail where the structure is as small as the wavelength: at a focus, in a slit, in a film a micrometre thick. There the phase of the wave decides what happens, and that is the subject of this topic. One more property of the wave: the field points in some direction across the beam — its [[polarization-states|polarization]]. Waves polarized at right angles cannot cancel each other.

> [!key] Light is a wave $E_0\\cos(kx - \\omega t + \\varphi)$; its intensity is proportional to $E_0^{\\,2}$. Detectors average the oscillation away, so the phase can only be read by adding a second wave to it.
`,
  ideas: [
    'A light wave is an oscillating field E₀ cos(kx − ωt + φ), described by its amplitude, wavelength (or frequency) and phase.',
    'Intensity is proportional to the square of the amplitude: twice the field is four times the light.',
    'Detectors and the eye average over billions of cycles, so they see intensity but never the phase directly.',
    'In a material the frequency is unchanged, the wavelength shrinks to λ/n, and the phase advances n times faster per metre.',
    'Interference makes phase differences between waves visible; the phase of a single wave is not.'
  ],
  pitfalls: [
    'A brighter light has a shorter wavelength — Brightness is the amplitude (squared) and colour is the wavelength; the two are independent. A dim blue and a bright blue differ only in amplitude.',
    'A detector records the light wave\'s oscillation — It records only the average of the squared field over a million to a billion cycles or more. The phase is invisible until a second wave is added to the first.',
    'Light changes frequency in glass because its wavelength shrinks — The frequency is fixed by the source and does not change at any boundary. Speed and wavelength both fall by the factor n; the frequency, and so the colour, stays.',
    'Doubling the amplitude doubles the brightness — Intensity goes as the amplitude squared: doubling the field gives four times the intensity.'
  ],
  terms: [
    { term: 'Amplitude', also: ['E₀', 'field amplitude'], def: 'The largest value the oscillating electric field reaches, in volts per metre. The intensity of the light is proportional to its square.' },
    { term: 'Phase', also: ['φ', 'phase angle'], def: 'Where a wave stands in its cycle, in radians or degrees; one full cycle is 2π, or 360°. Only the difference of phase between two waves can be observed, and only by making them interfere.' },
    { term: 'Intensity', also: ['irradiance', 'I', 'W/m²'], def: 'The power per unit area carried by light, averaged over many cycles. It is proportional to the square of the amplitude: I = ½ n c ε₀ E₀².' },
    { term: 'Wave number', also: ['k', 'angular wave number'], def: 'k = 2π/λ: the phase a wave gains per metre of travel, in radians per metre. (Spectroscopists often use "wavenumber" for 1/λ in cm⁻¹ instead.)' },
    { term: 'Period and angular frequency', also: ['T', 'ω'], def: 'The period T = 1/f is the time for one full oscillation: 1.84 fs for green light. The angular frequency ω = 2πf counts radians per second.' },
    { term: 'Plane wave', def: 'A wave whose wavefronts are flat planes, all the same amplitude: the idealization of a collimated beam from a distant source or a laser.' }
  ],
  formulas: [
    {
      name: 'Wavelength and frequency in a vacuum',
      expr: 'lambda = c/f', tex: '\\lambda = \\frac{c}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', tex: '\\lambda' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'THz', value: 545 }
      },
      stories: { lambda: 'A laser oscillates at {f}. What is its wavelength in a vacuum?', f: 'Light of {lambda} wavelength is oscillating at what frequency?' }
    },
    {
      name: 'Wavelength inside a material',
      expr: 'lm = l0/n', tex: '\\lambda_m = \\frac{\\lambda_0}{n}',
      vars: {
        lm: { name: 'wavelength inside the material', q: 'length', unit: 'nm', tex: '\\lambda_m' },
        l0: { name: 'wavelength in a vacuum', q: 'length', unit: 'nm', value: 550, tex: '\\lambda_0' },
        n: { name: 'refractive index', value: 1.5185, min: 1, max: 4 }
      },
      note: 'The frequency does not change; the speed is c/n.',
      stories: { lm: 'Light of {l0} (in a vacuum) enters a glass of index {n}. How long is the wave inside?' }
    },
    {
      name: 'Intensity and field amplitude',
      expr: 'I = n*c*eps0*E0^2/2', tex: 'I = \\tfrac{1}{2}\\,n\\,c\\,\\varepsilon_0\\,E_0^{2}',
      vars: {
        I: { name: 'intensity', q: 'intensity', unit: 'W/m²' },
        n: { name: 'refractive index', value: 1, min: 1, max: 4 },
        c: { const: 'c' },
        eps0: { const: 'eps0' },
        E0: { name: 'peak field amplitude', q: 'efield', unit: 'V/m', value: 868, tex: 'E_0' }
      },
      solveFor: 'I',
      note: 'The peak amplitude of the electric field; the r.m.s. field is 1/√2 of it.',
      stories: { I: 'A light wave in air has a peak field of {E0}. What is its intensity?', E0: 'A beam of {I} crosses air. How large is the peak electric field in it?' }
    }
  ],
  examples: [
    {
      title: 'Green light in glass',
      q: 'Green light of 550 nm (in a vacuum) enters a window of N-BK7 glass, $n = 1.5185$. What are its wavelength, frequency and speed inside? How many wavelengths fit in a 1 mm thickness, compared with 1 mm of air?',
      steps: [
        { text: 'The frequency is set by the source: $f = c/\\lambda_0 = 545\\ \\mathrm{THz}$, unchanged.', tex: 'f = \\frac{2.998\\times10^{8}}{550\\times10^{-9}} = 5.45\\times10^{14}\\ \\mathrm{Hz}' },
        { text: 'Wavelength and speed fall by the factor $n$:', tex: '\\lambda_m = \\frac{550}{1.5185} = 362\\ \\mathrm{nm} \\qquad v = \\frac{c}{n} = 1.97\\times10^{8}\\ \\mathrm{m/s}' },
        'In 1 mm of glass there are $1\\ \\mathrm{mm}/362\\ \\mathrm{nm} = 2761$ wavelengths; in 1 mm of air, $1\\ \\mathrm{mm}/550\\ \\mathrm{nm} = 1818$. The glass adds 943 cycles of phase — the optical path is 1.5185 mm.'
      ],
      a: '362 nm, 545 THz, $1.97\\times10^8$ m/s; 2761 wavelengths in the glass against 1818 in air.'
    },
    {
      title: 'How strong is the field in sunlight?',
      q: 'Direct sunlight at the ground delivers about 1000 W/m². What is the peak electric field in the wave, and the peak magnetic field?',
      steps: [
        { text: 'Solve $I = \\tfrac12 c\\varepsilon_0 E_0^2$ for the amplitude ($n = 1$ in air):', tex: 'E_0 = \\sqrt{\\frac{2I}{c\\,\\varepsilon_0}} = \\sqrt{\\frac{2000}{2.998\\times10^{8}\\times 8.854\\times10^{-12}}} = 868\\ \\mathrm{V/m}' },
        { text: 'In a light wave $B_0 = E_0/c$:', tex: 'B_0 = \\frac{868}{2.998\\times10^{8}} = 2.9\\times10^{-6}\\ \\mathrm{T}' }
      ],
      a: 'About 870 V/m (nine volts per centimetre) and 2.9 µT — roughly a twentieth of the Earth\'s own magnetic field, which is about 50 µT. The wave is gentle: the fields are small, and it is their enormous frequency that makes detecting the phase impossible.'
    }
  ],
  quiz: [
    { q: 'Two beams of the same colour: one has twice the electric-field amplitude of the other. Compared with the weaker beam, the intensity of the stronger is…', choices: ['2 times', '4 times', '√2 times', '8 times'], a: 1, why: 'Intensity is proportional to the amplitude squared: $2^2 = 4$.' },
    { q: 'Light of 550 nm (in a vacuum) enters glass of index 1.5. What happens to its frequency?', choices: ['It rises to 818 THz', 'It stays at 545 THz', 'It falls to 363 THz', 'It depends on the thickness of the glass'], a: 1, why: 'The frequency is fixed by the source and never changes at a boundary. The speed falls to $c/n$ and the wavelength to $\\lambda_0/n$ (367 nm here); 363 THz would be the wrong quantity, a frequency of $f/n$.' },
    { q: 'A good photodiode can follow the individual oscillations of a green light wave, as an oscilloscope follows a voltage.', a: false, why: 'Green light oscillates at 545 THz; the fastest photodiodes respond at around 100 GHz, thousands of times more slowly. The detector reports the average of the squared field — the intensity.' },
    { q: 'Light of 600 nm in a vacuum enters water ($n = 1.333$). What is its wavelength in the water, in nm?', answer: 450, unit: 'nm', why: '$\\lambda_m = \\lambda_0/n = 600/1.333 = 450$ nm. The colour the eye sees is set by the frequency, which has not changed.' },
    { q: 'At one point wave A is at a crest while wave B, of the same wavelength, is at a trough. Their phase difference is…', choices: ['0°', '90°', '180°', '360°'], a: 2, why: 'A trough is half a cycle from a crest: 180° (π radians). 0° and 360° are the same thing — in step.' }
  ],
  applications: [
    'Interferometry: lengths and shapes are measured by comparing the phase of two beams, to a small fraction of a wavelength (a few nanometres).',
    'Coherent fibre communication: modern long-haul links encode data in the phase as well as the amplitude of the carrier, and recover it by beating the signal against a local laser.',
    'Photography and vision: sensors and the retina count energy, the square of the amplitude, so two very different waves can look identical — which is why holography has to add a reference wave to record phase.',
    'Laser safety and power: converting between watts, irradiance and field strength is the first step in damage and ionization estimates.'
  ],
  history: 'Christiaan Huygens described light as a wave in 1678 (published 1690) but could not say what waved or how long the waves were. Thomas Young\'s interference experiments of 1801–1803 gave the first wavelengths; Augustin Fresnel showed in 1821 that the waves are transverse. James Clerk Maxwell identified light as an electromagnetic wave in the 1860s, and Heinrich Hertz confirmed his equations with radio waves in 1887–1888.',
  sources: [
    'E. Hecht, *Optics*, ch. 2 (Wave Motion) and ch. 3 (Electromagnetic Theory, Photons and Light) — harmonic waves, phase and irradiance.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 — the field of a monochromatic wave and its intensity.',
    'B. E. A. Saleh and M. C. Teich, *Fundamentals of Photonics*, ch. 2 (Wave Optics) — monochromatic waves, phase, intensity.'
  ],
  sim: { id: 'in-waves', params: { second: false } }
},

/* ================================================================ superposition and phase */
{
  id: 'superposition-and-phase', parent: 'interference', title: 'Superposition and phase difference', level: 1,
  short: 'Where two light waves overlap their fields simply add. The sum depends on the phase difference between them, which comes from the difference in the optical paths they travelled: one wavelength of path is one full cycle of phase, 360°. Phasors — rotating arrows — make the sum a drawing.',
  keywords: ['superposition', 'phase difference', 'path difference', 'optical path difference', 'OPD', 'phasor', 'phasor diagram', 'adding waves', 'beat', 'heterodyne', 'cross term', 'interference term', 'two-beam intensity', 'phase shift'],
  prereq: ['light-as-a-wave', 'optical-path-length'],
  related: ['constructive-and-destructive-interference', 'coherence', 'fresnel-reflection', 'physics:superposition', 'math:complex-numbers', 'math:trig-functions'],
  body: `
Two beams of light that cross do not disturb one another: each goes on its way unchanged. But in the region where they overlap, the field is the sum of the two fields. This is the **principle of superposition**, and it holds because light in air, glass and vacuum obeys linear equations. The important consequence is that it is the *fields* that add, not the intensities — and a field has a sign.

### Adding two waves of one frequency
Take two waves of the same frequency, amplitudes $A_1$ and $A_2$, with phase difference $\\varphi$. Their sum is again a wave of that frequency, with amplitude $A$ given by

$$A^2 = A_1^2 + A_2^2 + 2A_1A_2\\cos\\varphi$$

and since intensity is proportional to amplitude squared,

$$I = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\,\\cos\\varphi$$

The last term is the **interference term**. Averaged over all phases it is zero, which is why two ordinary lamps simply add their light. For two equal beams $I = 4I_0\\cos^2(\\varphi/2)$:

| Phase difference | 0° | 60° | 90° | 120° | 180° |
|---|---|---|---|---|---|
| Amplitude, in units of one wave | 2 | 1.73 | 1.41 | 1 | 0 |
| Intensity, in units of one beam | 4 | 3 | 2 | 1 | 0 |

### Phasors: adding by drawing
Draw each wave as an arrow whose length is its amplitude and whose angle is its phase. Every arrow rotates at the same rate $\\omega$, so freeze the picture and add the arrows head to tail: the length of the resultant arrow is the amplitude of the sum. The 3–4–5 triangle gives the example: waves of amplitude 3 and 4 a quarter of a cycle (90°) apart give amplitude 5 — intensities 9 and 16 add to 25. The same drawing handles three waves or three thousand: a [[the-grating-equation|grating]] or a [[fabry-perot-interferometer|Fabry–Perot cavity]] is a long chain of arrows (the arrow is a [[math:complex-numbers|complex number]]).

### Where a phase difference comes from
- **Path.** Light that travels farther has gained more phase. If the two routes differ in *optical* path — refractive index times length, summed along the route — by $\\Delta$, then
$$\\varphi = 2\\pi\\,\\frac{\\Delta}{\\lambda}$$
One wavelength of path is 360°. A 0.1 µm change of path is 65° at 550 nm. A glass plate of thickness $t$ and index $n$ put into one beam adds $(n-1)t$: 1 mm of glass of index 1.52 adds 520 µm, about 945 wavelengths.
- **Reflection.** Light reflected at a boundary into a *higher* index medium has its field reversed — a phase jump of $\\pi$, half a wavelength. Reflection into a lower index adds nothing. This is why the thinnest part of a soap film looks black ([[thin-film-interference]]).
- **Different sources.** Two independent lamps have phases that wander at random; see [[coherence]].

### Same frequency required
If the two frequencies differ by $\\Delta f$ the phase difference slides at $2\\pi\\Delta f$ and the sum **beats**: bright and dark alternate $\\Delta f$ times a second. For 1 MHz the eye sees an even glow, but a photodiode sees the beat — the principle of heterodyne detection in Doppler lidar and laser vibrometers.

> [!key] Fields add, intensities do not: $I = I_1 + I_2 + 2\\sqrt{I_1I_2}\\cos\\varphi$ with $\\varphi = 2\\pi\\Delta/\\lambda$. One wavelength of optical path difference is one whole cycle of phase.
`,
  ideas: [
    'Waves that overlap add as fields, with their signs; each wave carries on unchanged afterwards.',
    'Two waves of one frequency give I = I₁ + I₂ + 2√(I₁I₂) cos φ; the last term is the interference term.',
    'The phase difference is φ = 2π·Δ/λ, where Δ is the optical path difference (index times length); one wavelength = 360°.',
    'A phasor is an arrow of length A at angle φ; waves are added by adding arrows head to tail.',
    'Reflection into a higher index adds half a wavelength (π); waves of different frequencies beat instead of forming steady fringes.'
  ],
  pitfalls: [
    'When two beams overlap their intensities add — The fields add; the intensities add only when the interference term averages to zero (unrelated phases). With a fixed phase the total can be anywhere from zero to four times one beam.',
    'The phase difference is the geometric path difference over the wavelength — It is the optical path difference: each stretch of path is multiplied by the refractive index of the medium it crosses.',
    'Crossing beams change each other, so the light is "used up" where it cancels — Beams pass through one another unchanged. The cancellation is local, and the energy appears elsewhere in the pattern.',
    'Any two light beams of the same colour will make fringes — They must also keep a steady phase relationship; two separate lamps, or even two lasers, do not (see coherence).'
  ],
  terms: [
    { term: 'Superposition', also: ['principle of superposition'], def: 'When waves overlap, the field at each point is the sum of the fields each wave would have produced alone. Light waves cross without changing one another.' },
    { term: 'Phase difference', also: ['Δφ', 'relative phase'], def: 'The difference between the phases of two waves at the same point: 0 means in step, 180° means a crest meets a trough. It is 2π times the optical path difference in wavelengths.' },
    { term: 'Optical path difference', also: ['OPD', 'Δ', 'path difference'], def: 'The difference between the optical path lengths of two routes, each being the refractive index times the geometrical length summed along the route. One wavelength of OPD is one cycle of phase.' },
    { term: 'Phasor', also: ['phasor diagram', 'rotating vector'], def: 'An arrow whose length is the amplitude of a wave and whose angle is its phase. Waves of one frequency are added by adding their arrows head to tail.' },
    { term: 'Interference term', also: ['cross term'], def: 'The part of the summed intensity, 2√(I₁I₂) cos φ, that depends on the phase difference. Averaged over random phases it vanishes.' },
    { term: 'Beat', also: ['beat frequency', 'heterodyne'], def: 'The slow rise and fall of the sum of two waves whose frequencies differ slightly; its frequency is the difference of the two. Detecting a signal by beating it against a strong reference is heterodyne detection.' }
  ],
  formulas: [
    {
      name: 'Phase difference from optical path difference',
      expr: 'phi = 2*pi*opd/lambda', tex: '\\varphi = \\frac{2\\pi\\,\\Delta}{\\lambda}',
      vars: {
        phi: { name: 'phase difference', q: 'angle', unit: '°', tex: '\\varphi' },
        opd: { name: 'optical path difference', q: 'length', unit: 'nm', value: 275, tex: '\\Delta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Only the part of the phase beyond whole cycles matters for the brightness: 540° looks like 180°.',
      stories: { phi: 'Two beams of {lambda} light travel routes whose optical paths differ by {opd}. What is their phase difference?', opd: 'What optical path difference gives a phase difference of {phi} for light of {lambda}?' }
    },
    {
      name: 'Intensity of two beams',
      expr: 'I = I1 + I2 + 2*sqrt(I1*I2)*cos(phi)', tex: 'I = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\cos\\varphi',
      vars: {
        I: { name: 'total intensity', tex: 'I' },
        I1: { name: 'intensity of beam 1', value: 1, tex: 'I_1' },
        I2: { name: 'intensity of beam 2', value: 1, tex: 'I_2' },
        phi: { name: 'phase difference', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\varphi' }
      },
      solveFor: 'I',
      note: 'For mutually coherent beams. Intensities in any unit, as long as all three agree.',
      stories: { I: 'Two coherent beams of intensity {I1} and {I2} meet with a phase difference of {phi}. What is the combined intensity?' }
    },
    {
      name: 'Two equal beams',
      expr: 'I = 4*I0*cos(phi/2)^2', tex: 'I = 4I_0\\cos^2\\frac{\\varphi}{2}',
      vars: {
        I: { name: 'total intensity', tex: 'I' },
        I0: { name: 'intensity of each beam', value: 1, tex: 'I_0' },
        phi: { name: 'phase difference', q: 'angle', unit: '°', value: 90, min: 0, max: 360, tex: '\\varphi' }
      },
      solveFor: 'I'
    },
    {
      name: 'Path added by a plate in one beam',
      expr: 'opd = (n - 1)*t', tex: '\\Delta = (n - 1)\\,t',
      vars: {
        opd: { name: 'optical path difference', q: 'length', unit: 'µm', tex: '\\Delta' },
        n: { name: 'refractive index of the plate', value: 1.52, min: 1, max: 4 },
        t: { name: 'thickness of the plate', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'The plate replaces the same thickness of air (n ≈ 1) in one arm.',
      stories: { opd: 'A {t} plate of index {n} is put into one of two interfering beams. How much optical path does it add?' }
    }
  ],
  examples: [
    {
      title: 'A plate in one beam',
      q: 'A 1.000 mm plate of glass ($n = 1.52$) is inserted into one arm of an interferometer using 550 nm light. By how much does the phase difference change, and how bright is the output if the two beams were in step before?',
      steps: [
        { text: 'The plate adds', tex: '\\Delta = (n - 1)\\,t = 0.52\\ \\mathrm{mm} = 520\\ \\mu\\mathrm{m}' },
        { text: 'In wavelengths:', tex: '\\frac{520\\ \\mu\\mathrm{m}}{0.550\\ \\mu\\mathrm{m}} = 945.45' },
        'Whole cycles do not matter; the 0.45 left over is a phase of $0.4545 \\times 360° = 163.6°$.',
        { text: 'For equal beams the intensity is', tex: 'I = 4I_0\\cos^2(81.8°) = 0.081\\,I_0' }
      ],
      a: 'The phase difference changes by 163.6° (plus 945 whole cycles) and the output falls to 8 % of the in-step value, nearly dark. A change of only 0.1 µm in the thickness would shift it by a tenth of a cycle, which is why no one predicts the pattern from the dimensions: fringes are counted, not calculated.'
    },
    {
      title: 'Adding by arrows',
      q: 'Two coherent waves of amplitude 3 and 4 (arbitrary units) meet a quarter of a cycle apart. What is the combined amplitude and intensity? What are the largest and smallest possible values?',
      steps: [
        { text: 'A quarter cycle is 90°, so $\\cos\\varphi = 0$ and', tex: 'A^2 = 3^2 + 4^2 = 25 \\quad\\Rightarrow\\quad A = 5' },
        'Intensities are the squares: $9 + 16 = 25$, the same as adding the intensities, because the interference term vanishes at 90°.',
        'In step the arrows line up: $A = 7$, $I = 49$. Out of step they oppose: $A = 1$, $I = 1$.'
      ],
      a: 'Amplitude 5, intensity 25 at 90°. The range is from 1 to 49 — so the *same two beams* can be 25 times brighter or dimmer at the extremes of the phase.'
    }
  ],
  quiz: [
    { q: 'Two equal beams meet with a phase difference of 120°. The intensity, relative to one beam alone, is…', choices: ['4', '2', '1', '0'], a: 2, why: '$I = 4I_0\\cos^2(60°) = 4 \\times 0.25 = 1$: the same as one beam, so the phase happens to cancel the extra from the second one.' },
    { q: 'Two coherent beams of intensity $I$ each meet with a phase difference of 90°. What is the total intensity, in units of $I$?', answer: 2, why: '$I_{tot} = I + I + 2I\\cos 90° = 2I$. At a quarter of a cycle the interference term is zero: the intensities simply add.' },
    { q: 'When two light beams cross, each permanently changes the direction or brightness of the other.', a: false, why: 'Beams pass through one another unchanged. Where they overlap the fields add; once past, each beam is as it was.' },
    { q: 'A plate 2 µm thick with index 1.5 is put into one of two beams of 500 nm light. By how much does the phase difference change?', choices: ['half a wave', 'one wave', 'two waves', 'three waves'], a: 2, why: 'The extra optical path is $(n-1)t = 0.5 \\times 2\\ \\mu\\mathrm{m} = 1\\ \\mu\\mathrm{m}$, which is $1/0.5 = 2$ wavelengths. The plate\'s whole optical path, $nt = 3\\ \\mu\\mathrm{m}$ or 6 wavelengths, is not the answer: it replaces 2 µm of air, which was 4 wavelengths of path already.' },
    { q: 'Two lasers whose frequencies differ by 1 MHz shine together on a photodiode. What does it record?', choices: ['A steady fringe pattern', 'A signal alternating a million times a second — a beat', 'No light at all', 'Twice the sum of the two intensities'], a: 1, why: 'The phase difference slides through $2\\pi$ a million times a second, so the sum swells and fades at the difference frequency. Heterodyne detection uses exactly this.' }
  ],
  applications: [
    'Every interferometer: the signal is the interference term 2√(I₁I₂) cos φ, and the instrument turns a length, an index or a rotation into the phase φ.',
    'Heterodyne and coherent detection: a weak signal is beaten against a strong local laser to give gain and phase information — Doppler lidar, laser vibrometers, coherent fibre receivers.',
    'Optical phased arrays and holography steer or reconstruct light by controlling phase across a surface.',
    'Anti-reflection coatings are an application of phase bookkeeping: the two reflections are made to differ by half a wavelength.'
  ],
  history: 'Young introduced the word "interference" in his 1801 lecture to the Royal Society. In 1816–1819 Fresnel and Arago found that light waves polarized at right angles never interfere, which could only mean that the vibration is across the direction of travel — the discovery that light is a transverse wave.',
  sources: [
    'E. Hecht, *Optics*, ch. 7 (The Superposition of Waves) — addition of waves of the same frequency, phasors, beats.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 (Elements of the Theory of Interference and Interferometers).',
    'R. P. Feynman, R. B. Leighton and M. Sands, *The Feynman Lectures on Physics*, vol. I, ch. 29 (Interference) — the addition of waves with arrows.'
  ],
  sim: { id: 'in-waves', params: { second: true } }
},

/* ================================================================ constructive and destructive */
{
  id: 'constructive-and-destructive-interference', parent: 'interference', title: 'Constructive and destructive interference', level: 1,
  short: 'Two waves in step add up to a brighter light (constructive interference); a crest on a trough cancels it (destructive). For equal beams a path difference of a whole number of wavelengths gives bright, an odd number of half wavelengths gives dark. The light that vanishes is not destroyed: it is redistributed to the bright places.',
  keywords: ['constructive interference', 'destructive interference', 'in phase', 'out of phase', 'path difference', 'fringes', 'bright fringe', 'dark fringe', 'fringe visibility', 'contrast', 'cancellation', 'energy conservation', 'half wavelength', 'fringe order', 'interference pattern'],
  prereq: ['superposition-and-phase', 'light-as-a-wave'],
  related: ['youngs-double-slit', 'thin-film-interference', 'coherence', 'michelson-interferometer', 'antireflection-coatings', 'physics:superposition', 'what-diffraction-is'],
  body: `
Interference is what two waves do when they meet: where they are in step the light grows, where they are out of step it fades — all the way to darkness. Light plus light can make darkness. That sounded impossible when Young first showed it, and it was the argument that light is a wave.

### In step and out of step
The condition is on the phase difference $\\varphi = 2\\pi\\Delta/\\lambda$, where $\\Delta$ is the optical path difference.

- **Constructive:** $\\Delta = m\\lambda$ ($m = 0, \\pm1, \\pm2, \\dots$), so $\\varphi = 0, 2\\pi, 4\\pi$. The amplitudes add; for two equal beams the intensity is **four** times that of one beam, not two.
- **Destructive:** $\\Delta = (m + \\tfrac12)\\lambda$, so $\\varphi = \\pi, 3\\pi$. The amplitudes cancel; equal beams give exactly zero.
- **In between** the intensity follows a smooth cosine: $I = 2I_0(1 + \\cos\\varphi)$.

For green light of 550 nm:

| Path difference | In wavelengths | Two equal beams give |
|---|---|---|
| 0 | 0 | 4 $I_0$ — bright |
| 137.5 nm | ¼ | 2 $I_0$ |
| 275 nm | ½ | 0 — dark |
| 412.5 nm | ¾ | 2 $I_0$ |
| 550 nm | 1 | 4 $I_0$ — bright |
| 825 nm | 1½ | 0 — dark |

The number $m$ is the **order** of the fringe. The conditions assume that both beams reach the point without extra phase jumps; a reflection into a higher index adds half a wavelength and swaps bright and dark ([[thin-film-interference]]).

### Where does the energy go?
Nowhere: it is redistributed. In an interference pattern of two equal beams the bright fringes carry $4I_0$ and the dark zero, and the average over a fringe is $2I_0 = I_0 + I_0$ — exactly the sum of the two beams. Interference moves light from the dark places to the bright ones. A beam splitter shows this plainly: its two output ports are *complementary*, with $P_1 = P\\cos^2(\\varphi/2)$ and $P_2 = P\\sin^2(\\varphi/2)$; when one is dark, the other is carrying everything. An anti-reflection coating works the same way — the two reflected waves cancel and the energy leaves in the transmitted beam.

### How good are the fringes: visibility
Complete darkness needs two beams of *equal* amplitude, in the same polarization, and perfectly coherent. Otherwise the dark fringes are only dim. The **visibility** (contrast) is

$$V = \\frac{I_{max} - I_{min}}{I_{max} + I_{min}}$$

For two coherent beams of intensities $I_1$ and $I_2$, $V = 2\\sqrt{I_1I_2}/(I_1 + I_2)$:

| $I_1 : I_2$ | 1 : 1 | 2 : 1 | 4 : 1 | 10 : 1 | 100 : 1 |
|---|---|---|---|---|---|
| $V$ | 1.00 | 0.94 | 0.80 | 0.57 | 0.20 |

Even a beam a hundred times weaker than the other modulates the total by ±20 %, which is why a 4 % stray reflection from a lens produces visible fringes in a laser image.

> [!tip] Sound does the same. Noise-cancelling headphones play a copy of the noise a half cycle out of step, so that it is destructively added to the noise that arrives at the ear.

> [!key] In step ($\\Delta = m\\lambda$) is bright, half a wave out ($\\Delta = (m+\\tfrac12)\\lambda$) is dark, and the energy missing from the dark places is found in the bright ones. Equal beams make the best fringes.
`,
  ideas: [
    'Constructive interference: waves in step (path difference mλ) add; equal beams give four times the intensity of one.',
    'Destructive interference: waves half a cycle out of step (path difference (m + ½)λ) cancel; equal beams give zero.',
    'The light is redistributed, not destroyed: the average over the pattern equals the sum of the two beams.',
    'The two outputs of a beam splitter are complementary: when one is dark, the other carries the whole beam.',
    'Fringe visibility V = (Imax − Imin)/(Imax + Imin) is 1 for equal coherent beams and falls with unequal beams or partial coherence.'
  ],
  pitfalls: [
    'Destructive interference destroys energy — The energy is redistributed: dark fringes are paired with bright ones that carry four times one beam. Total power in the pattern is unchanged.',
    'Constructive interference doubles the brightness — It doubles the amplitude, so the intensity is four times one beam. (The average over the whole pattern is twice.)',
    'A dark fringe needs a path difference of half a wavelength — Of an odd number of half wavelengths: ½, 1½, 2½, … And after a reflection into a denser medium the rule is reversed.',
    'Fringes appear whenever two beams cross — The beams must be coherent, of the same colour and polarization, and the path difference must be smaller than the coherence length.'
  ],
  terms: [
    { term: 'Constructive interference', def: 'Overlap of waves in step (phase difference 0, 2π, …; optical path difference a whole number of wavelengths) giving a larger amplitude than either. Two equal beams give four times the intensity of one.' },
    { term: 'Destructive interference', def: 'Overlap of waves half a cycle out of step (phase difference π, 3π, …; path difference an odd number of half wavelengths) giving a smaller amplitude. Two equal beams cancel completely.' },
    { term: 'Interference fringe', also: ['fringe', 'fringe pattern'], def: 'One bright or dark band of an interference pattern. A change of one wavelength in path difference moves the pattern by one fringe.' },
    { term: 'Fringe order', also: ['order of interference', 'm'], def: 'The whole number m that counts fringes from the centre of the pattern: bright fringes have Δ = mλ, dark ones Δ = (m + ½)λ.' },
    { term: 'Fringe visibility', also: ['contrast', 'fringe contrast', 'V', 'Michelson contrast'], def: '(Imax − Imin)/(Imax + Imin): 1 for perfect fringes with complete dark, 0 when no fringes can be seen. Lowered by unequal beam intensities, partial coherence and stray light.' },
    { term: 'Complementary outputs', also: ['output ports'], def: 'The two beams leaving a beam splitter where two waves interfere: their powers add up to the input, so where one is dark the other is bright.' }
  ],
  formulas: [
    {
      name: 'Bright fringes',
      expr: 'opd = m*lambda', tex: '\\Delta = m\\,\\lambda',
      vars: {
        opd: { name: 'optical path difference', q: 'length', unit: 'nm', tex: '\\Delta' },
        m: { name: 'fringe order', value: 3, min: 0, int: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      note: 'Two beams without extra phase jumps. m = 0 is the central fringe.',
      stories: { opd: 'For light of {lambda}, what optical path difference gives the bright fringe of order {m}?' }
    },
    {
      name: 'Dark fringes',
      expr: 'opd = (m + 1/2)*lambda', tex: '\\Delta = \\left(m + \\tfrac{1}{2}\\right)\\lambda',
      vars: {
        opd: { name: 'optical path difference', q: 'length', unit: 'nm', tex: '\\Delta' },
        m: { name: 'fringe order', value: 3, min: 0, int: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      stories: { opd: 'What optical path difference gives dark fringe number {m} for light of {lambda}?' }
    },
    {
      name: 'Fringe visibility',
      expr: 'V = (Imax - Imin)/(Imax + Imin)', tex: 'V = \\frac{I_{max} - I_{min}}{I_{max} + I_{min}}',
      vars: {
        V: { name: 'visibility', tex: 'V' },
        Imax: { name: 'intensity at a bright fringe', value: 2.25, tex: 'I_{max}' },
        Imin: { name: 'intensity at a dark fringe', value: 0.25, tex: 'I_{min}' }
      },
      solveFor: 'V',
      stories: { V: 'A fringe pattern peaks at {Imax} and dips to {Imin} (same units). What is its visibility?' }
    },
    {
      name: 'Visibility of two unequal beams',
      expr: 'V = 2*sqrt(r)/(1 + r)', tex: 'V = \\frac{2\\sqrt{r}}{1 + r}',
      vars: {
        V: { name: 'visibility', tex: 'V' },
        r: { name: 'intensity ratio of the weaker to the stronger beam', value: 0.25, min: 0, max: 1 }
      },
      note: 'For fully coherent beams; r = I₂/I₁ ≤ 1.',
      stories: { V: 'One of two coherent beams is only {r} as intense as the other. What is the fringe visibility?' }
    }
  ],
  examples: [
    {
      title: 'White light after a path difference',
      q: 'White light is split and recombined with an optical path difference of 1.2 µm. Which wavelengths of the visible spectrum (400–700 nm) are reinforced and which cancelled?',
      steps: [
        { text: 'Reinforced where $\\Delta = m\\lambda$, that is $\\lambda = 1200\\ \\mathrm{nm}/m$:', tex: 'm = 2:\\ 600\\ \\mathrm{nm} \\qquad m = 3:\\ 400\\ \\mathrm{nm} \\qquad (m = 1:\\ 1200\\ \\mathrm{nm}, \\text{ infrared})' },
        { text: 'Cancelled where $\\Delta = (m+\\tfrac12)\\lambda$, that is $\\lambda = 1200/(m + \\tfrac12)$:', tex: 'm = 2:\\ 480\\ \\mathrm{nm} \\qquad (m = 1:\\ 800\\ \\mathrm{nm}; \\; m = 3:\\ 343\\ \\mathrm{nm})' }
      ],
      a: 'Orange (600 nm) and the violet edge (400 nm) are strengthened, blue (480 nm) is removed: the output is a pinkish orange. A spectrometer looking at that light would show a "channelled" spectrum of bright and dark bands, and the larger the path difference the closer together the bands lie.'
    },
    {
      title: 'Fringes on a laser window',
      q: 'A parallel glass window ($n = 1.52$) is placed in a laser beam at normal incidence. The front and back surfaces each reflect part of the beam. What is the visibility of the fringes between these two reflections?',
      steps: [
        { text: 'Each surface reflects', tex: 'R = \\left(\\frac{n - 1}{n + 1}\\right)^2 = \\left(\\frac{0.52}{2.52}\\right)^2 = 0.0426' },
        'The front reflection is 4.26 % of the beam. The back reflection has crossed the front surface twice, losing 4.26 % each time: $0.0426 \\times (1 - 0.0426)^2 = 3.90\\ \\%$.',
        { text: 'The ratio is $r = 3.90/4.26 = 0.917$, so', tex: 'V = \\frac{2\\sqrt{0.917}}{1 + 0.917} = 0.999' }
      ],
      a: 'The fringes have a contrast of 99.9 % — practically full. As the window warms and expands, or the laser tunes, the reflected power swings between nearly zero and about 16 % of the beam (four times the 4 % of one surface). That is why windows in laser systems are often wedged by a fraction of a degree: it sends the two reflections off in different directions and removes the fringes.'
    }
  ],
  quiz: [
    { q: 'Two equal beams meet in step. The intensity there is…', choices: ['twice that of one beam', 'four times that of one beam', 'the same as one beam', 'zero'], a: 1, why: 'In step the amplitudes add, doubling the field, and the intensity goes as its square: four times. The average over a whole fringe pattern is twice one beam, which is why the energy balance works.' },
    { q: 'Light of 600 nm travels by two routes whose optical paths differ by 1.5 µm. At the point where they meet there is…', choices: ['constructive interference: bright', 'destructive interference: dark', 'half the maximum brightness', 'it depends on the intensities only'], a: 1, why: '$1500/600 = 2.5$ wavelengths: an odd number of half wavelengths, so the beams are out of step. (For equal beams the result is complete darkness.)' },
    { q: 'At a dark fringe the energy of the two beams has been destroyed.', a: false, why: 'Energy is conserved: the pattern as a whole carries the sum of the two beams. The dark places have lost exactly as much as the bright places have gained.' },
    { q: 'In a fringe pattern the brightest fringe has intensity 9 and the darkest 1 (same arbitrary unit). What is the visibility?', answer: 0.8, why: '$V = (9 - 1)/(9 + 1) = 0.8$.' },
    { q: 'At one output port of a two-beam interferometer the light is dark. What is true of the other port?', choices: ['It is also dark', 'It carries (nearly) all the light', 'It carries exactly half the light', 'Nothing can be said'], a: 1, why: 'The outputs are complementary: the total power is conserved, so where one port loses the light the other gains it.' }
  ],
  applications: [
    'Anti-reflection coatings: two reflected waves are made to cancel, and the energy goes into the transmitted beam.',
    'Interferometers count fringes to measure displacement, index or shape: each fringe is one wavelength of path difference.',
    'Noise-cancelling headphones and active noise control use the same idea with sound.',
    'Unwanted fringes: parallel windows, filters and sensor cover glasses give etalon fringes in laser systems and spectrometers; wedged windows and anti-reflection coatings suppress them.'
  ],
  history: 'Thomas Young argued in 1801 that two beams of light adding up to darkness could only be understood if light were a wave, and he demonstrated the effect with a narrow beam divided in two. His claim was received coolly in England, where Newton\'s corpuscular view held sway, until Fresnel\'s mathematics of 1815–1821 made the wave theory hard to avoid.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — the general two-beam result and the conditions for bright and dark fringes.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 (Elements of the Theory of Interference and Interferometers).',
    'F. A. Jenkins and H. E. White, *Fundamentals of Optics* — the chapters on interference of light.'
  ],
  sim: 'in-two-sources'
},

/* ================================================================ coherence */
{
  id: 'coherence', parent: 'interference', title: 'Coherence: temporal and spatial', level: 2,
  short: 'Interference needs two waves whose phase difference stays fixed. Ordinary light is a jumble of short wave trains with random phases. How long the phase stays predictable is the temporal coherence — a coherence length of about λ²/Δλ: 3 µm for a white LED, 20 cm for a helium–neon laser. How far across the wavefront it holds is the spatial coherence.',
  keywords: ['coherence', 'coherent light', 'temporal coherence', 'spatial coherence', 'coherence length', 'coherence time', 'linewidth', 'bandwidth', 'wave train', 'degree of coherence', 'incoherent', 'partially coherent', 'van Cittert–Zernike', 'coherence width', 'visibility'],
  prereq: ['constructive-and-destructive-interference', 'superposition-and-phase'],
  related: ['youngs-double-slit', 'michelson-interferometer', 'thin-film-interference', 'linewidth-and-coherence-of-lasers', 'what-makes-laser-light-special', 'optical-coherence-tomography', 'holography', 'light-sources-and-beams'],
  body: `
Shine two torches on a wall and you get a brighter patch, never stripes. Yet each torch is a perfectly good wave source. The reason is **coherence**: the two waves have no fixed phase relationship, so any fringes they make slide about too fast to see.

### Why two torches do not make fringes
An atom in a lamp radiates for about $10^{-8}$ s — a wave train a few metres long — and then starts again with a new, random phase. A lamp is a vast crowd of such bursts, so two lamps differ in phase by a new random amount every few nanoseconds. At every instant there *are* fringes, but they shift far faster than an eye (0.1 s) or a camera (1 ms) can follow; the average is a uniform glow, because $\\cos\\varphi$ averages to zero.

### Temporal coherence: how long the wave stays in tune
A source that emits a band of wavelengths $\\Delta\\lambda$ is a sum of many pure waves that drift in and out of step. After a delay of about $\\tau_c \\approx 1/\\Delta\\nu$ the phases have drifted by a whole cycle, and the light has forgotten its own phase. The distance light travels in that time is the **coherence length**

$$L_c \\approx c\\,\\tau_c = \\frac{\\lambda^2}{\\Delta\\lambda}$$

Two beams from the same source interfere clearly if their optical path difference is much smaller than $L_c$, and the fringes fade as it approaches $L_c$ (the exact figure depends on the shape of the spectrum, by a factor of order one).

| Source | Width | Coherence length |
|---|---|---|
| Sunlight or a filament lamp, the whole visible band | about 300 nm | about 1 µm |
| White LED | about 100 nm | about 3 µm |
| Lamp line isolated by a 1 nm filter, 546 nm | 1 nm | 0.3 mm |
| Multimode helium–neon laser, 632.8 nm | 0.002 nm (1.5 GHz) | about 0.2 m |
| Single-frequency laser | 1 MHz | about 300 m |
| Narrow-linewidth fibre laser | 1 kHz | about 300 km |

### Spatial coherence: how far across the wave the phase holds
Different points of an extended source are independent emitters. A point source gives a perfectly ordered wavefront; a source of angular size $\\theta$ keeps the phase predictable only across a width of about

$$w \\approx \\frac{\\lambda}{\\theta}$$

The Sun is 9.3 mrad across, so its light is coherent over only about 60 µm: two slits 0.05 mm apart make fringes in sunlight, two slits 0.5 mm apart do not. That is why [[youngs-double-slit|Young]] let the Sun shine through a small hole first. A laser in a single transverse mode is spatially coherent across its whole beam; a star is so small that its light is coherent over metres, and in 1920 Michelson measured the diameter of Betelgeuse from the baseline (about 3 m) at which fringes vanished.

### Two ways to make a coherent pair
- **Division of wavefront** (Young's slits, a biprism): different parts of one wavefront are brought together. Needs *spatial* coherence.
- **Division of amplitude** (thin film, [[michelson-interferometer|Michelson]]): a beam splitter makes a delayed copy of each wave, so each interferes with itself and only *temporal* coherence matters — which is why a soap bubble shows colours in plain sunlight.

Real light is **partially coherent**: a degree of coherence $\\gamma$ between 0 and 1 multiplies the interference term, and the fringe visibility is $V = \\gamma\\,\\dfrac{2\\sqrt{I_1I_2}}{I_1+I_2}$.

> [!key] Fringes need a fixed phase relationship. Temporal coherence limits the path difference to $L_c \\approx \\lambda^2/\\Delta\\lambda$; spatial coherence limits how far apart two points of the wavefront may be to $w \\approx \\lambda/\\theta$.
`,
  ideas: [
    'Coherence is a fixed phase relationship; without it interference fringes average away and intensities simply add.',
    'Temporal coherence: the phase stays predictable for the coherence time 1/Δν, a distance L_c ≈ λ²/Δλ along the beam.',
    'Spatial coherence: across a wavefront from a source of angular size θ the phase is predictable over about λ/θ.',
    'Splitting one beam in amplitude gives each wave a delayed copy of itself; only the delay must be within L_c.',
    'Coherence length ranges from about a micrometre (white light) to hundreds of kilometres (the narrowest lasers).'
  ],
  pitfalls: [
    'Two lasers of the same colour will interfere like two slits — Two independent lasers drift in phase, so fringes between them are not steady (they can show a fast beat on a detector). The slits make fringes because both beams come from one source.',
    'Coherence means the light is one colour — A single colour (narrow bandwidth) means long temporal coherence, but a broad extended source can also be narrow-band and spatially incoherent. Temporal and spatial coherence are separate properties.',
    'White light cannot interfere — It interferes whenever the path difference is within about a micrometre: soap films, the first few fringes of a double slit, Newton\'s rings in daylight.',
    'Incoherent light cancels out when waves meet in antiphase — With random phases there is no steady cancellation or reinforcement; the intensities just add on average.'
  ],
  terms: [
    { term: 'Coherence', def: 'The property that the phase difference between two waves, or between two points of one wave, stays fixed or predictable. Only coherent waves make steady interference fringes.' },
    { term: 'Temporal coherence', also: ['longitudinal coherence', 'coherence time', 'τc'], def: 'How long a wave keeps a predictable phase along its direction of travel; the coherence time is about 1/Δν. It determines how large a path difference may be before fringes fade.' },
    { term: 'Coherence length', also: ['Lc', 'λ²/Δλ'], def: 'The distance light travels in one coherence time, Lc ≈ cτc ≈ λ²/Δλ: the largest optical path difference over which a source\'s light still interferes with itself.' },
    { term: 'Spatial coherence', also: ['transverse coherence', 'coherence width', 'coherence area'], def: 'How far across a wavefront the phase stays predictable. For a source of angular size θ it is about λ/θ; a point source or a single-mode laser is spatially coherent over the whole beam.' },
    { term: 'Wave train', also: ['wave packet', 'photon wave packet'], def: 'The finite burst of oscillating field emitted in one act of emission. Its length is the coherence length of the light.' },
    { term: 'Degree of coherence', also: ['γ', 'mutual coherence'], def: 'A number from 0 (incoherent) to 1 (fully coherent) that multiplies the interference term. For beams of equal intensity it is the fringe visibility.' }
  ],
  formulas: [
    {
      name: 'Coherence length from the wavelength spread',
      expr: 'Lc = lambda^2/dl', tex: 'L_c = \\frac{\\lambda^2}{\\Delta\\lambda}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'µm', tex: 'L_c' },
        lambda: { name: 'centre wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        dl: { name: 'wavelength spread (width of the spectrum)', q: 'length', unit: 'nm', value: 100, tex: '\\Delta\\lambda' }
      },
      note: 'An order-of-magnitude figure: the exact factor depends on the shape of the spectrum.',
      stories: { Lc: 'A light source centred at {lambda} has a spectrum {dl} wide. What is its coherence length?', dl: 'A laser at {lambda} has a coherence length of {Lc}. How wide is its spectrum?' }
    },
    {
      name: 'Coherence length from the frequency spread',
      expr: 'Lc = c/df', tex: 'L_c = \\frac{c}{\\Delta\\nu}',
      vars: {
        Lc: { name: 'coherence length', q: 'length', unit: 'm', tex: 'L_c' },
        c: { const: 'c' },
        df: { name: 'frequency spread (linewidth)', q: 'frequency', unit: 'MHz', value: 1, tex: '\\Delta\\nu' }
      },
      stories: { Lc: 'A single-frequency laser has a linewidth of {df}. How long is its coherence length?', df: 'A laser must stay coherent over {Lc}. What linewidth may it have at most?' }
    },
    {
      name: 'Coherence time',
      expr: 'tc = 1/df', tex: '\\tau_c = \\frac{1}{\\Delta\\nu}',
      vars: {
        tc: { name: 'coherence time', q: 'time', unit: 'ns', tex: '\\tau_c' },
        df: { name: 'frequency spread (linewidth)', q: 'frequency', unit: 'GHz', value: 1.5, tex: '\\Delta\\nu' }
      }
    },
    {
      name: 'Coherence width of a distant source',
      expr: 'w = lambda/theta', tex: 'w \\approx \\frac{\\lambda}{\\theta}',
      vars: {
        w: { name: 'coherence width', q: 'length', unit: 'µm', tex: 'w' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        theta: { name: 'angular size of the source', q: 'angle', unit: 'mrad', value: 9.3, tex: '\\theta' }
      },
      note: 'Order of magnitude; definitions differ by a factor of about 1.2. The Sun is 9.3 mrad (0.53°) across.',
      stories: { w: 'A source subtends {theta}. Over what width of its wavefront ({lambda} light) is it spatially coherent?' }
    }
  ],
  examples: [
    {
      title: 'How well must the arms of a Michelson match?',
      q: 'A helium–neon laser (632.8 nm, spectral width 0.002 nm) and a white LED (550 nm, about 100 nm wide) are in turn used in a Michelson interferometer. How closely must the two arm lengths agree for clear fringes?',
      steps: [
        { text: 'The laser:', tex: 'L_c = \\frac{\\lambda^2}{\\Delta\\lambda} = \\frac{(632.8\\ \\mathrm{nm})^2}{0.002\\ \\mathrm{nm}} = 2.0\\times10^{8}\\ \\mathrm{nm} = 0.20\\ \\mathrm{m}' },
        'The beam travels each arm twice, so the path difference is twice the difference in arm length: the arms may differ by up to about $L_c/2 = 10$ cm.',
        { text: 'The LED:', tex: 'L_c = \\frac{(550\\ \\mathrm{nm})^2}{100\\ \\mathrm{nm}} = 3.0\\ \\mu\\mathrm{m}' },
        'The arms must agree to within about 1.5 µm — a few wavelengths. Slide one mirror and the fringes appear, number a handful, and vanish.'
      ],
      a: 'About 10 cm with the laser; about 1.5 µm with the LED. The narrow fringe region of white light is useful: it marks the position of zero path difference precisely.'
    },
    {
      title: 'Fringes from the Sun',
      q: 'To make double-slit fringes from the Sun (angular size 9.3 mrad), how close must the slits be? And how small a pinhole is needed in front of the slits so that a slit separation of 0.25 mm works, if the pinhole is 0.5 m from them?',
      steps: [
        { text: 'The coherence width of sunlight at 550 nm is', tex: 'w = \\frac{\\lambda}{\\theta} = \\frac{550\\times10^{-9}}{9.3\\times10^{-3}} = 59\\ \\mu\\mathrm{m}' },
        'So the slits must be well within 0.06 mm of each other — much closer than the 0.25 mm of a laboratory double slit.',
        { text: 'A pinhole of width $b$ at distance $L = 0.5$ m looks $\\theta = b/L$ across; the slits are coherent if $\\lambda/\\theta \\gtrsim d$:', tex: 'b \\lesssim \\frac{\\lambda L}{d} = \\frac{550\\times10^{-9}\\times 0.5}{0.25\\times10^{-3}} = 1.1\\ \\mathrm{mm}' },
        'To get fringes of good contrast (visibility about 0.9) the pinhole should be about a quarter of that: 0.3 mm.'
      ],
      a: 'Sunlight needs slits closer than about 60 µm; or a pinhole of about 0.3 mm placed 0.5 m ahead of a 0.25 mm double slit. This is exactly what Young\'s small hole in the shutter did.'
    }
  ],
  quiz: [
    { q: 'Why do the beams of two separate torches not form stripes on a wall?', choices: ['The torches are not bright enough', 'Their phases wander at random much faster than any detector responds, so the fringes average out', 'Light from different sources cannot interfere', 'The torches emit different colours'], a: 1, why: 'At every instant the two waves do interfere, but the pattern shifts about every few nanoseconds. The eye or a camera sees only the average: a uniform brightening.' },
    { q: 'A white LED has a spectral width of about 100 nm at 550 nm. Its coherence length is about…', choices: ['3 µm', '30 µm', '3 mm', '30 cm'], a: 0, why: '$L_c = \\lambda^2/\\Delta\\lambda = (550\\ \\mathrm{nm})^2/100\\ \\mathrm{nm} = 3.0\\ \\mu\\mathrm{m}$: only five or six wavelengths.' },
    { q: 'A laser beam is spatially coherent across its whole width, but light from a large frosted lamp is not.', a: true, why: 'A single-mode laser has one phase pattern across the beam. A large lamp is a crowd of independent emitters, coherent only over a width of about $\\lambda/\\theta$ — a tiny fraction of a millimetre at a few metres.' },
    { q: 'A multimode helium–neon laser line at 632.8 nm is 0.002 nm wide. What is its coherence length, in metres?', answer: 0.2, unit: 'm', why: '$L_c = \\lambda^2/\\Delta\\lambda = (632.8\\times10^{-9})^2/(2\\times10^{-12}) = 0.20$ m, so the two arms of an interferometer can differ by about 10 cm.' },
    { q: 'A soap bubble shows bright colours in sunlight, whose coherence length is only about a micrometre. Why?', choices: ['The film splits each wave and recombines it with a copy of itself delayed by less than a micrometre', 'The soap film is a laser', 'The bubble is a diffraction grating', 'Sunlight is secretly laser light'], a: 0, why: 'The film divides the amplitude of each wave; the delay between the two parts is $2nt\\cos\\theta$, under a micrometre for a thin film. It is smaller than the coherence length, so the reflections interfere.' }
  ],
  applications: [
    'White-light interferometry and optical coherence tomography use a short coherence length on purpose: fringes appear only where the two paths are matched to a few micrometres, which gives depth resolution.',
    'Long-path laser interferometers and fibre sensors need coherence lengths longer than the mismatch of their arms — hence single-frequency lasers with linewidths of kilohertz.',
    'Holography needs the coherence length to exceed the depth of the scene; early holograms used helium–neon lasers with about 20 cm.',
    'Stellar interferometers measure the diameters of stars from the fall of fringe visibility with baseline — spatial coherence in action.',
    'Microscope and projector illumination is designed around the size of the condenser aperture, which sets how spatially coherent the light on the specimen is, and with it the ringing and speckle in the image.'
  ],
  history: 'Albert Michelson used the fading of his interferometer\'s fringes in the 1890s to measure the width of spectral lines. The theory of partial coherence was set out by Pieter van Cittert in 1934 and Frits Zernike in 1938, who showed that the spatial coherence of light from an incoherent source is the Fourier transform of the source\'s shape. Michelson and Pease measured the angular diameter of Betelgeuse in 1920 with a 6 m interferometer on the 100-inch telescope at Mount Wilson, finding about 0.047 arcsecond.',
  sources: [
    'E. Hecht, *Optics*, ch. 12 (Basics of Coherence Theory) — coherence time and length, partial coherence, visibility.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 10 (Interference and Diffraction with Partially Coherent Light) — the van Cittert–Zernike theorem.',
    'J. W. Goodman, *Statistical Optics* — the chapters on coherence of light.'
  ],
  sim: 'in-coherence'
},

/* ================================================================ Young's double slit */
{
  id: 'youngs-double-slit', parent: 'interference', title: 'Young\'s double slit', level: 2,
  short: 'Light passing through two narrow slits spreads out and overlaps, making stripes on a screen. The stripes are λL/d apart — wavelength times screen distance over slit separation — and each bright one lies where the two paths differ by a whole number of wavelengths. In white light the central stripe is white and the rest coloured.',
  keywords: ['Young', 'double slit', 'double-slit experiment', 'two slits', 'fringe spacing', 'slit separation', 'screen', 'bright fringes', 'dark fringes', 'white-light fringes', 'single-slit envelope', 'missing orders', 'division of wavefront', 'wave nature of light', 'sin theta'],
  prereq: ['constructive-and-destructive-interference', 'coherence'],
  related: ['what-diffraction-is', 'single-slit-diffraction', 'the-grating-equation', 'huygens-construction', 'laser-safety-classes', 'physics:double-slit'],
  body: `
Around 1801–1803 Thomas Young split a narrow beam of sunlight in two, let the halves overlap on a screen, and saw not two bright patches but a row of equally spaced stripes. Light from two openings can add to *darkness* — the proof that light is a wave. Everything about the pattern follows from the path difference.

### The geometry
Two slits a distance $d$ apart are lit by the same wave, so they emit in step. On a screen a distance $L \\gg d$ away, take a point at height $y$ above the centre. Its distances to the two slits differ by

$$\\Delta = d\\sin\\theta \\approx \\frac{d\\,y}{L}$$

The point is bright where $\\Delta = m\\lambda$ and dark where $\\Delta = (m + \\tfrac12)\\lambda$. The bright fringes are at $y_m = m\\lambda L/d$: **evenly spaced**, with

$$\\Delta y = \\frac{\\lambda L}{d}$$

| Wavelength | Slit separation $d$ | Screen $L$ | Spacing $\\Delta y$ |
|---|---|---|---|
| 632.8 nm, He–Ne | 0.25 mm | 2 m | 5.06 mm |
| 550 nm, green | 0.25 mm | 2 m | 4.4 mm |
| 550 nm | 0.10 mm | 2 m | 11 mm |
| 550 nm | 1.00 mm | 2 m | 1.1 mm |

Closer slits, longer wavelength or a more distant screen all spread the stripes out; red fringes are wider than blue. Measured the other way, the spacing gives the wavelength when $d$ is known, or the spacing of the slits when $\\lambda$ is.

### What each slit does: the envelope
Each slit has a width $a$ and diffracts the light into a broad cone. The pattern is the two-beam fringes under the single-slit pattern, which acts as an **envelope**:

$$I(\\theta) = I_0\\left[\\frac{\\sin(\\pi a\\sin\\theta/\\lambda)}{\\pi a\\sin\\theta/\\lambda}\\right]^2\\cos^2\\!\\left(\\frac{\\pi d\\sin\\theta}{\\lambda}\\right)$$

The envelope first vanishes at $a\\sin\\theta = \\lambda$, and the central lobe holds about $2d/a$ fringes. If $d$ is a whole multiple of $a$, a bright fringe falls exactly on an envelope zero and is missing: for $d = 3a$ every third order is absent. The envelope is the subject of [[single-slit-diffraction]]; the fringes are two-beam interference.

### White light
At the centre $\\Delta = 0$ for every colour, so all of them are bright together: the central fringe is **white**. Elsewhere each colour has its own spacing, violet nearest the centre and red farthest. With $d = 0.5$ mm and $L = 1$ m the first-order bright fringe is at 0.8 mm for 400 nm and 1.4 mm for 700 nm — a small spectrum. After two or three orders the colours overlap into pale pinks and greens, because white light is coherent over only a micrometre or so of path difference. The white central fringe marks the one place where the path difference is exactly zero.

### The source must be coherent
The two slits must be lit by the same wave. A laser does this without help; a lamp needs a small pinhole or a distant source so that its light is coherent across the slit separation ([[coherence]]).

> [!warn] If you try this with a laser pointer, use a Class 1 or 2 pointer (under 1 mW), never look into the beam or at its reflection from a shiny surface, and never point it at a person or a vehicle. See [[laser-safety-classes]].

> [!key] Two slits make stripes $\\Delta y = \\lambda L/d$ apart, bright where $d\\sin\\theta = m\\lambda$, under a single-slit envelope. In white light the central stripe is white and the others coloured.
`,
  ideas: [
    'Two slits lit by the same wave emit in step; at a distant point the path difference is d sin θ ≈ d y/L.',
    'Bright fringes at d sin θ = mλ, evenly spaced by Δy = λL/d on the screen.',
    'The spacing grows with wavelength and screen distance, and shrinks as the slits move apart.',
    'The single-slit pattern forms an envelope over the fringes; orders that fall on its zeros are missing.',
    'In white light the zero-order fringe is white and the rest are coloured, with violet nearer the centre than red.'
  ],
  pitfalls: [
    'The stripes are shadows of the two slits — Each slit alone would make one broad smear. The stripes are interference: light from both slits adds, and a dark stripe is a place where both slits send light.',
    'Wider slit separation widens the fringes — The opposite: the spacing is λL/d, so a larger separation d gives finer fringes.',
    'The spacing formula works at any angle — It uses sin θ ≈ tan θ ≈ y/L, valid for small angles; at large angles the fringes are not quite evenly spaced (d sin θ = mλ exactly).',
    'Slits of any width give the same pattern — Narrower slits give a broader envelope, so more fringes are bright; wide slits produce a narrow envelope with only a few fringes.'
  ],
  terms: [
    { term: 'Double slit', also: ['Young\'s slits', 'two-slit experiment'], def: 'Two narrow parallel openings lit by one coherent wave. The light from each interferes with the other on a distant screen to give equally spaced fringes.' },
    { term: 'Fringe spacing', also: ['Δy', 'fringe width'], def: 'The distance between neighbouring bright fringes on the screen: Δy = λL/d for slit separation d and screen distance L (small angles).' },
    { term: 'Zero-order fringe', also: ['central fringe', 'central maximum', 'm = 0'], def: 'The bright fringe on the axis, where the path difference is zero for every wavelength. In white light it is white.' },
    { term: 'Single-slit envelope', also: ['diffraction envelope'], def: 'The slow variation in brightness across the double-slit pattern caused by diffraction at each slit of width a; it first falls to zero at a sin θ = λ.' },
    { term: 'Missing order', also: ['absent order'], def: 'A bright double-slit fringe that is absent because it falls on a zero of the single-slit envelope; when d = ka, every k-th order is missing.' },
    { term: 'Division of wavefront', def: 'Making two coherent beams by letting different parts of one wavefront pass through separate openings, as in Young\'s slits. It requires spatial coherence across the openings.' }
  ],
  formulas: [
    {
      name: 'Fringe spacing',
      expr: 'dy = lambda*L/d', tex: '\\Delta y = \\frac{\\lambda L}{d}',
      vars: {
        dy: { name: 'fringe spacing', q: 'length', unit: 'mm', tex: '\\Delta y' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        L: { name: 'distance to the screen', q: 'length', unit: 'm', value: 2 },
        d: { name: 'slit separation', q: 'length', unit: 'mm', value: 0.25 }
      },
      note: 'For L much larger than d and small angles.',
      stories: { dy: 'Light of {lambda} falls on two slits {d} apart; the screen is {L} away. How far apart are the bright fringes?', d: 'Fringes of {lambda} light are {dy} apart on a screen {L} from a double slit. How far apart are the slits?', lambda: 'On a screen {L} from slits {d} apart the fringes are {dy} apart. What is the wavelength?' }
    },
    {
      name: 'Bright fringes at an angle',
      expr: 'd*sin(theta) = m*lambda', tex: 'd\\sin\\theta = m\\,\\lambda',
      vars: {
        d: { name: 'slit separation', q: 'length', unit: 'µm', value: 250 },
        theta: { name: 'angle of the fringe from the axis', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        m: { name: 'fringe order', value: 3, min: 0, int: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'theta',
      note: 'Exact for any angle (the screen far away).',
      stories: { theta: 'Light of {lambda} meets slits {d} apart. At what angle is the fringe of order {m}?' }
    },
    {
      name: 'First zero of the single-slit envelope',
      expr: 'a*sin(theta) = lambda', tex: 'a\\sin\\theta = \\lambda',
      vars: {
        a: { name: 'slit width', q: 'length', unit: 'µm', value: 50 },
        theta: { name: 'angle of the first zero', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\theta' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'theta',
      stories: { theta: 'A slit {a} wide is lit by {lambda} light. At what angle does the diffraction envelope first fall to zero?' }
    },
    {
      name: 'Fringes in the central lobe',
      expr: 'N = 2*d/a', tex: 'N \\approx \\frac{2d}{a}',
      vars: {
        N: { name: 'number of fringes in the central lobe' },
        d: { name: 'slit separation', q: 'length', unit: 'µm', value: 250 },
        a: { name: 'slit width', q: 'length', unit: 'µm', value: 50 }
      },
      note: 'About: the exact count is the odd whole number just below 2d/a.'
    }
  ],
  examples: [
    {
      title: 'Measuring a wavelength',
      q: 'A double slit with $d = 0.20$ mm is lit by a laser. On a screen 3.0 m away the two first-order bright fringes, one each side of the centre, are 18.9 mm apart. What is the wavelength?',
      steps: [
        'The two first-order fringes are at $\\pm\\Delta y$, so they are $2\\Delta y$ apart: $\\Delta y = 9.45$ mm.',
        { text: 'Solve $\\Delta y = \\lambda L/d$ for the wavelength:', tex: '\\lambda = \\frac{\\Delta y\\,d}{L} = \\frac{9.45\\times10^{-3}\\times 0.20\\times10^{-3}}{3.0} = 6.3\\times10^{-7}\\ \\mathrm{m}' }
      ],
      a: '630 nm — red, in fact a helium–neon laser (632.8 nm) to the precision of the measurement. Reading a ruler to 0.1 mm gives the wavelength to about 1 %.'
    },
    {
      title: 'The first-order spectrum',
      q: 'White light (400–700 nm) falls on a double slit with $d = 0.5$ mm; the screen is 1.0 m away. Where do the first-order bright fringes of violet and of red light fall, and what is the colour order across the first fringe?',
      steps: [
        { text: 'For $m = 1$, $y = \\lambda L/d$:', tex: 'y_{400} = \\frac{400\\times10^{-9}\\times 1}{0.5\\times10^{-3}} = 0.80\\ \\mathrm{mm} \\qquad y_{700} = \\frac{700\\times10^{-9}\\times 1}{0.5\\times10^{-3}} = 1.40\\ \\mathrm{mm}' },
        'Between them lie all the other colours, in order of wavelength.'
      ],
      a: 'The first bright band is a small spectrum 0.6 mm wide, violet on the side nearer the centre and red on the outside. The central fringe, where all colours coincide, is white.'
    }
  ],
  quiz: [
    { q: 'In a double-slit experiment red light is replaced by blue light; nothing else changes. The fringe spacing…', choices: ['grows', 'shrinks', 'is unchanged', 'disappears'], a: 1, why: 'The spacing is $\\lambda L/d$ and blue has the shorter wavelength.' },
    { q: 'The two slits are moved closer together. The fringes become…', choices: ['closer together', 'farther apart', 'brighter but with the same spacing', 'unchanged'], a: 1, why: '$\\Delta y = \\lambda L/d$: a smaller separation $d$ gives a larger spacing.' },
    { q: 'Light of 600 nm illuminates slits 0.30 mm apart; the screen is 1.5 m away. What is the fringe spacing, in mm?', answer: 3, unit: 'mm', why: '$\\Delta y = \\lambda L/d = 600\\times10^{-9}\\times1.5/(0.30\\times10^{-3}) = 3.0\\times10^{-3}$ m.' },
    { q: 'With white light, the central fringe of a double slit is coloured.', a: false, why: 'At the centre the path difference is zero for every wavelength, so every colour is bright there together: the central fringe is white. The colours appear in the fringes on either side.' },
    { q: 'The slit separation is four times the slit width ($d = 4a$). Which orders are missing from the pattern?', choices: ['Only the first', 'Every fourth order: ±4, ±8, …', 'None', 'The central one'], a: 1, why: 'The envelope first vanishes at $a\\sin\\theta = \\lambda$, where $d\\sin\\theta = 4\\lambda$: the fourth order falls on it, and so does every multiple of four.' }
  ],
  applications: [
    'Teaching, and the measurement of wavelengths and of very small separations or widths from the spacing of fringes.',
    'The double-slit pattern also appears for electrons, neutrons, atoms and large molecules sent one at a time: the pattern builds up point by point, the standard demonstration of the wave–particle duality of matter.',
    'Radio telescopes and optical interferometers use two (or many) separated receivers as the two slits to measure the sizes of sources — the fringe visibility against baseline is the spatial coherence.',
    'The two-slit pattern is the first case of the diffraction grating: more slits sharpen the bright fringes into narrow lines (see [[the-grating-equation]]).'
  ],
  history: 'Young reported interference of light in his lectures and papers of 1801–1804, using a thin card to divide a beam of sunlight and later two small apertures, and from the fringe spacing he estimated the wavelengths of the colours. His ideas were attacked by supporters of Newton\'s particle theory and made little headway until Fresnel\'s work in France around 1815–1821 convinced the Academy.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — wavefront-splitting interferometers, Young\'s experiment.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 and ch. 8 — two-beam interference and the double slit with finite slit width.',
    'T. Young, "Experiments and calculations relative to physical optics", *Philosophical Transactions of the Royal Society* 94 (1804) — the original account.'
  ],
  sim: 'in-young'
},

/* ================================================================ thin-film interference */
{
  id: 'thin-film-interference', parent: 'interference', title: 'Thin-film interference', level: 2,
  short: 'A thin transparent film reflects light from its top and from its bottom surface, and the two reflections interfere. Whether the film looks bright or dark depends on its thickness, its refractive index, the angle and the wavelength — which is why soap bubbles, oil slicks and coated lenses are coloured. A reflection into a higher index adds half a wave, and that decides the rule.',
  keywords: ['thin film', 'soap film', 'soap bubble', 'oil slick', 'iridescence', 'interference colours', 'half-wave phase change', 'phase change on reflection', 'quarter-wave', 'optical thickness', 'film thickness', 'reflected light', 'black film', 'Newton colour scale', 'structural colour'],
  prereq: ['constructive-and-destructive-interference', 'refractive-index', 'fresnel-reflection'],
  related: ['antireflection-coatings', 'multilayer-coatings', 'newtons-rings-and-wedge-fringes', 'iridescence-and-structural-colour', 'dielectric-mirrors', 'coherence', 'physics:thin-film-interference'],
  body: `
A soap bubble in sunlight shows swirling bands of colour that shift as the film thins and drains. A drop of oil on a wet road does the same. There is no coloured material in either: the colour is made by interference between light reflected from the front and the back of a layer a few hundred nanometres thick.

### Two reflections
Light of wavelength $\\lambda$ meets a film of thickness $t$ and index $n$ at an angle $\\theta$. Part of it is reflected at the top surface (ray 1). The rest enters, is reflected at the bottom and leaves (ray 2). Ray 2 has travelled farther, and the optical path difference is

$$\\Delta = 2\\,n\\,t\\cos\\theta_t$$

with $\\theta_t$ the angle inside the film (at normal incidence just $2nt$). Whether the two reflections reinforce or cancel depends on $\\Delta/\\lambda$ — and on a second thing.

### The half-wave jump
A reflection at a boundary into a **higher** index medium flips the field: a phase jump of $\\pi$, half a wavelength. A reflection into a lower index adds nothing. Count the jumps at the two surfaces:

| Media above · film · below | Jumps | Net | Dark when | Bright when |
|---|---|---|---|---|
| air · soap (1.33) · air | top yes, bottom no | half wave | $\\Delta = m\\lambda$ | $\\Delta = (m+\\tfrac12)\\lambda$ |
| air · oil (1.47) · water (1.33) | top yes, bottom no | half wave | $\\Delta = m\\lambda$ | $\\Delta = (m+\\tfrac12)\\lambda$ |
| glass · air gap · glass | top no, bottom yes | half wave | $\\Delta = m\\lambda$ | $\\Delta = (m+\\tfrac12)\\lambda$ |
| air · MgF₂ (1.38) · glass (1.52) | both yes | none | $\\Delta = (m+\\tfrac12)\\lambda$ | $\\Delta = m\\lambda$ |

The last row is the [[antireflection-coatings|anti-reflection coating]]: the thinnest layer that cancels the reflection has $2nt = \\lambda/2$, a thickness $t = \\lambda/4n$ — 99.6 nm of MgF₂ for 550 nm. The first row explains the **black film**: as a soap film thins towards zero thickness, $\\Delta \\to 0$ and the reflections cancel; the top of a draining bubble goes black just before it bursts.

### Colours
In white light each wavelength has its own condition, so the reflected light is white with some colours removed and others boosted. For a soap film of index 1.33 seen head-on in daylight (computed from the full thin-film model):

| Thickness | Colour in reflection |
|---|---|
| 20 nm | almost black |
| 100 nm | silvery white |
| 130 nm | yellow |
| 200 nm | purple |
| 250 nm | blue |
| 300 nm | green |
| 350 nm | orange |
| 400 nm | magenta |
| 500 nm | green again |

The sequence repeats, each round paler, and above about a micrometre it washes out to a pastel pink and green and then to white — the path difference exceeds the [[coherence|coherence length]] of white light. A window pane never shows these colours; a bubble does. Tilt the film and $\\cos\\theta_t$ shrinks, the path difference shortens, and every colour moves towards the blue.

### How bright
Each surface of a soap film reflects only 2 %; at best, with both in step, the film reflects $4 \\times 2\\% = 8\\%$ of the light at one wavelength. That is why bubbles look delicate and best against a dark background.

> [!key] The two reflections of a thin film interfere with a path difference $2nt\\cos\\theta_t$. A reflection into a higher index adds half a wave, so a soap film is dark at zero thickness; a coating on glass, with both reflections jumping, is dark when $2nt = (m+\\tfrac12)\\lambda$.
`,
  ideas: [
    'The two reflections from the front and back of a film interfere; the optical path difference is 2nt cos θₜ.',
    'A reflection into a higher index adds a phase jump of π (half a wave); into a lower index, none.',
    'A soap film in air is dark at zero thickness (net half wave); an anti-reflection coating (both reflections jump) is dark at a quarter-wave thickness.',
    'In white light each wavelength has its own condition, which makes the colours; tilting the film shifts them towards blue.',
    'Colours appear only while the path difference is within about a micrometre, the coherence length of white light.'
  ],
  pitfalls: [
    'The colours of a bubble come from pigments or dyes in the soap — Soapy water is colourless. The colours are made by interference, depend on the thickness, and change as it drains.',
    'The condition for brightness is always 2nt = mλ — It depends on the phase jumps at the two surfaces. For a soap film bright means 2nt = (m + ½)λ; for a coating on glass it is 2nt = mλ.',
    'A thick glass plate should show even more colours — Beyond about a micrometre of path difference the white-light reflections no longer interfere, and the colours wash out.',
    'The colour of a film depends only on its thickness — It also depends on the angle of view, on the film\'s index and on the media on either side.'
  ],
  terms: [
    { term: 'Thin film', def: 'A layer of transparent material whose thickness is of the order of the wavelength of light or less (about 0.05–2 µm for visible interference effects), so that reflections from its two faces interfere.' },
    { term: 'Phase change on reflection', also: ['half-wave jump', 'π phase shift'], def: 'The reversal of the field (a phase jump of π, half a wavelength) when light is reflected at a boundary into a medium of higher refractive index. Reflection into a lower index causes no jump.' },
    { term: 'Optical thickness', also: ['n·t'], def: 'The refractive index of a layer times its thickness; the optical path through it is n·t and the path difference of the two reflections of a film is 2 n t cos θₜ.' },
    { term: 'Quarter-wave layer', also: ['QW layer', 'λ/4 layer'], def: 'A film whose optical thickness is a quarter of a wavelength (t = λ/4n). Reflections from its faces differ in path by half a wavelength: it cancels the reflection when both reflections jump, and it is the basic unit of mirrors and filters.' },
    { term: 'Interference colours', also: ['Newton\'s colours', 'thin-film colours', 'order colours'], def: 'The colours seen in white light reflected from a thin film or an air wedge, which change in a fixed sequence as the thickness grows and fade into pale pink and green at higher orders.' },
    { term: 'Black film', also: ['Newton black film'], def: 'The film so thin (below about 30 nm) that the two reflections cancel for all visible colours; the thinning top of a soap bubble looks black just before it bursts.' }
  ],
  formulas: [
    {
      name: 'Path difference in a film',
      expr: 'opd = 2*n*t*cos(thetat)', tex: '\\Delta = 2\\,n\\,t\\cos\\theta_t',
      vars: {
        opd: { name: 'optical path difference of the two reflections', q: 'length', unit: 'nm', tex: '\\Delta' },
        n: { name: 'refractive index of the film', value: 1.33, min: 1, max: 4 },
        t: { name: 'film thickness', q: 'length', unit: 'nm', value: 300 },
        thetat: { name: 'angle of the ray inside the film', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta_t' }
      },
      note: 'Add the half-wave jumps separately: see the table above.',
      stories: { opd: 'A film of index {n} and thickness {t} is seen at {thetat} inside the film. What is the optical path difference of its two reflections?' }
    },
    {
      name: 'Reinforced wavelength of a soap film',
      expr: 'lambda = 2*n*t*cos(thetat)/(m + 1/2)', tex: '\\lambda = \\frac{2\\,n\\,t\\cos\\theta_t}{m + \\tfrac{1}{2}}',
      vars: {
        lambda: { name: 'wavelength reflected most strongly', q: 'length', unit: 'nm', tex: '\\lambda' },
        n: { name: 'refractive index of the film', value: 1.33, min: 1, max: 4 },
        t: { name: 'film thickness', q: 'length', unit: 'nm', value: 300 },
        thetat: { name: 'angle inside the film', q: 'angle', unit: '°', value: 10, min: 0, max: 89, tex: '\\theta_t' },
        m: { name: 'order', value: 1, min: 0, int: true }
      },
      note: 'For a film with a net half-wave jump (a soap film in air, oil on water). m = 0 usually lies in the infrared.',
      stories: { lambda: 'A soap film of index {n} and thickness {t} is seen head-on. Which wavelength of order {m} does it reflect most strongly?' }
    },
    {
      name: 'Quarter-wave thickness',
      expr: 't = lambda/(4*n)', tex: 't = \\frac{\\lambda}{4\\,n}',
      vars: {
        t: { name: 'quarter-wave thickness', q: 'length', unit: 'nm' },
        lambda: { name: 'design wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        n: { name: 'refractive index of the layer', value: 1.38, min: 1, max: 4 }
      },
      note: 'The thickness of a single-layer anti-reflection coating (here MgF₂), measured at normal incidence.',
      stories: { t: 'A single-layer coating of index {n} is to cancel {lambda} light. How thick should it be?' }
    }
  ],
  examples: [
    {
      title: 'The colour of a soap film',
      q: 'A soap film (index 1.33) in air is 300 nm thick and is seen head-on. Which visible wavelengths does it reflect most strongly, and which are cancelled?',
      steps: [
        { text: 'The path difference is', tex: '2nt = 2 \\times 1.33 \\times 300\\ \\mathrm{nm} = 798\\ \\mathrm{nm}' },
        { text: 'A soap film has a net half wave, so it is **bright** when $2nt = (m + \\tfrac12)\\lambda$:', tex: '\\lambda = \\frac{798}{m + \\frac12} = 1596\\ \\mathrm{nm}\\ (m=0),\\quad 532\\ \\mathrm{nm}\\ (m=1),\\quad 319\\ \\mathrm{nm}\\ (m=2)' },
        { text: 'and **dark** when $2nt = m\\lambda$:', tex: '\\lambda = \\frac{798}{m} = 798\\ \\mathrm{nm}\\ (m=1),\\quad 399\\ \\mathrm{nm}\\ (m=2)' }
      ],
      a: 'Only 532 nm — green — lies in the visible range as a maximum; the violet end (399 nm) and the near infrared are cancelled. The film looks green.'
    },
    {
      title: 'How black is a black film?',
      q: 'A soap film is 20 nm thick (index 1.33). Estimate its reflectance for 550 nm light, compared with the 8 % maximum.',
      steps: [
        { text: 'Single-surface reflectance at this index is $R_1 = \\left(\\frac{0.33}{2.33}\\right)^2 = 0.020$. The path difference is $2nt = 53.2$ nm, a phase of', tex: '\\delta = 2\\pi\\,\\frac{53.2}{550} = 0.608\\ \\mathrm{rad}' },
        { text: 'With the half-wave jump the reflectance of the two-beam film is', tex: 'R = 4R_1\\sin^2\\frac{\\delta}{2} = 4 \\times 0.020 \\times \\sin^2(0.304) = 0.0072' }
      ],
      a: 'About 0.7 % — roughly a tenth of the 8 % peak: a dark film, nearly invisible against a dark background. As the film thins further it falls towards zero.'
    }
  ],
  quiz: [
    { q: 'A soap film in air becomes very much thinner than a wavelength. In reflected light it looks…', choices: ['bright white', 'black', 'red', 'bright yellow'], a: 1, why: 'The top reflection jumps by half a wave and the bottom does not; as the thickness goes to zero the two cancel for every colour — the black film.' },
    { q: 'A single layer of MgF₂ ($n = 1.38$) on glass ($n = 1.52$) is to cancel the reflection of 550 nm light. What thickness, in nm?', answer: 99.6, unit: 'nm', why: 'Both reflections jump by half a wave, so they cancel when $2nt = \\lambda/2$: $t = \\lambda/4n = 550/(4 \\times 1.38) = 99.6$ nm.' },
    { q: 'If you tilt a soap film so that you view it more obliquely, its colours shift towards the blue.', a: true, why: 'The path difference $2nt\\cos\\theta_t$ decreases as the angle grows, so each condition is met at a shorter wavelength.' },
    { q: 'Why does a glass window pane show no interference colours in daylight, while a soap bubble does?', choices: ['The pane is much thicker than the coherence length of daylight (about 1 µm), so its reflections do not interfere', 'Glass does not reflect light', 'The bubble is curved', 'The pane absorbs the colours'], a: 0, why: 'The reflections from the two faces of a pane differ in path by millimetres, far more than the coherence length of white light, so they simply add in intensity.' },
    { q: 'In which case is the net phase difference between the two reflections equal to half a wave, so that zero thickness is dark?', choices: ['A soap film in air', 'MgF₂ on glass', 'Both of these', 'Neither of these'], a: 0, why: 'In a soap film only the top reflection (air to soap) jumps. For MgF₂ on glass both reflections jump, so the jumps cancel: at zero thickness the two reflections are in step (a bare glass surface) and there is no black film.' }
  ],
  applications: [
    'Anti-reflection coatings on lenses and spectacles, and the multilayer stacks of mirrors and interference filters, are thin films designed with these rules ([[multilayer-coatings]]).',
    'Thickness gauges: the colour or the spectrum of the reflected light measures a film of oil, photoresist, oxide or paint to a nanometre; semiconductor factories do this on every wafer.',
    'Anodized titanium and niobium jewellery, tempered steel and oil on water get their colours from oxide or oil films of 50–500 nm.',
    'Natural colours — a butterfly\'s wing, a beetle\'s shell, a pearl — come from layers of the same kind ([[iridescence-and-structural-colour]]).',
    'The colours of soap bubbles are used to estimate the thickness of the film as it drains.'
  ],
  history: 'Robert Hooke described the colours of thin plates of mica and of soap bubbles in his *Micrographia* of 1665. Isaac Newton measured them systematically, as colours of increasing "order" with the thickness of an air film, in his *Opticks* (1704). Thomas Young explained them in 1801 as interference, and saw that the dark centre of Newton\'s rings requires one reflection to add half a wavelength.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — dielectric films and their reflected colours.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 1 and ch. 7 — the thin film as a plane-parallel plate.',
    'H. A. Macleod, *Thin-Film Optical Filters* — the early chapters on the optics of thin films and their phase changes.'
  ],
  sim: 'in-thin-film'
},

/* ================================================================ Newton's rings and wedge fringes */
{
  id: 'newtons-rings-and-wedge-fringes', parent: 'interference', title: 'Newton\'s rings and wedge fringes', level: 2,
  short: 'Where two surfaces enclose a thin wedge of air, each fringe marks one thickness of the gap. Fringes of equal thickness are contour lines of the gap, λ/2 apart: straight for a wedge, circular for a lens on a flat (Newton\'s rings, with radii √(mλR)). Counting fringes measures a hair, a lens radius or a surface error.',
  keywords: ['Newton\'s rings', 'wedge fringes', 'air wedge', 'fringes of equal thickness', 'Fizeau fringes', 'optical flat', 'ring radius', 'radius of curvature', 'sqrt(m lambda R)', 'contact', 'newton rings', 'interference colours', 'lambda/2 per fringe', 'dark centre'],
  prereq: ['thin-film-interference', 'constructive-and-destructive-interference'],
  related: ['testing-optics-with-fringes', 'michelson-interferometer', 'surface-quality-and-flatness', 'testing-surfaces-with-interferometers', 'measuring-focal-length-and-radius', 'optical-windows'],
  body: `
Press a convex lens onto a flat sheet of glass and look down on it in the light of a lamp: a dark spot at the contact point, surrounded by a set of rings, bright and dark in turn, crowding together towards the edge. These are **Newton's rings**, and they are the simplest example of **fringes of equal thickness**.

### Contour lines of the gap
The air between two glass surfaces is a thin film whose thickness $h$ changes from point to point. Its two reflections — from the top of the gap (glass to air, no jump) and from the bottom (air to glass, a jump of π) — are half a wave out of step to begin with. So at near-normal viewing, in reflected light,

- the gap is **dark** where $2h = m\\lambda$ ($m = 0, 1, 2, \\dots$), including $h = 0$ where the surfaces touch;
- it is **bright** where $2h = (m + \\tfrac12)\\lambda$.

Each fringe is a contour line of the gap. Neighbouring fringes differ in gap by $\\lambda/2$: 275 nm in green light, 316 nm in the light of a helium–neon laser.

### The air wedge
Two plates touch along one edge and are held apart at the other by a spacer — a hair, a foil, a sheet of paper. The gap grows steadily, $h = \\alpha x$, and the fringes are straight lines parallel to the contact line, spaced

$$\\Delta x = \\frac{\\lambda}{2\\alpha}$$

| Wedge angle $\\alpha$ | Fringe spacing, 550 nm |
|---|---|
| 10″ (48 µrad) | 5.7 mm |
| 60″ (0.29 mrad) | 0.95 mm |
| 5′ (1.45 mrad) | 0.19 mm |

A hair 60 µm thick placed 50 mm from the contact line gives $\\alpha = 1.2$ mrad: a fringe every 0.23 mm and $2h/\\lambda = 218$ fringes in all. Counting the fringes gives the hair's thickness, $h = N\\lambda/2$, to better than a micrometre.

### Newton's rings
A lens of radius of curvature $R$ on a flat plate leaves a gap $h(r) = r^2/2R$ at distance $r$ from the contact point. The dark rings are at $2h = m\\lambda$, that is

$$r_m = \\sqrt{m\\,\\lambda R}\\qquad(m = 0, 1, 2, \\dots)$$

The centre, $m = 0$, is dark. Because $r \\propto \\sqrt m$ the rings crowd together outwards. For $R = 1$ m and green light:

| Dark ring | 1 | 5 | 10 | 20 |
|---|---|---|---|---|
| radius | 0.74 mm | 1.66 mm | 2.35 mm | 3.32 mm |

To measure $R$, use two rings: $R = (r_m^2 - r_n^2)/\\big((m-n)\\lambda\\big)$ — the unknown position of the true centre, and dust that stops the lens from touching, drop out of the difference. In **transmitted** light the pattern is complementary (a bright centre). In white light the rings are coloured, with a dark centre; after five or six rings the colours wash out because the gap exceeds the coherence length of white light.

### Why fringes of equal thickness matter
Any surface can be compared with a very flat reference by placing it in close contact: the fringes are a map of the gap, one contour per half wavelength ([[testing-optics-with-fringes]]). The same fringes appear by accident wherever two smooth surfaces nearly touch: between a slide and its cover glass, a film and a scanner platen, a touch screen under pressure.

> [!key] A thin gap is dark where $2h = m\\lambda$ and bright where $2h = (m+\\tfrac12)\\lambda$; each fringe is a contour line of the gap, $\\lambda/2$ apart. A wedge gives straight fringes spaced $\\lambda/2\\alpha$; a lens on a flat gives rings of radius $\\sqrt{m\\lambda R}$ with a dark centre.
`,
  ideas: [
    'In reflected light an air gap between glass surfaces is dark where 2h = mλ (including zero gap) and bright where 2h = (m + ½)λ.',
    'Each fringe is a contour line of constant gap; neighbouring fringes differ in gap by λ/2.',
    'An air wedge of angle α gives straight fringes spaced λ/2α; counting N fringes gives a gap of Nλ/2.',
    'A lens on a flat gives Newton\'s rings of radius r_m = √(mλR), crowding outward, with a dark centre in reflection.',
    'In transmitted light the pattern is the complement of the reflected one; in white light the rings are coloured and fade after a few orders.'
  ],
  pitfalls: [
    'The centre of Newton\'s rings is bright where the glass touches — In reflection it is dark: the half-wave jump at one of the two reflections cancels the light when the gap is zero.',
    'The rings are evenly spaced like ripples — Their radii go as √m, so they crowd closer and closer together towards the edge.',
    'One fringe means a gap change of one wavelength — It means a gap change of λ/2, since the light goes through the gap twice.',
    'Newton\'s rings need a perfectly clean point contact — Dust or a slight distortion shifts the centre but the ring pattern remains; use two rings and R = (r_m² − r_n²)/((m − n)λ) to be independent of it.'
  ],
  terms: [
    { term: 'Fringes of equal thickness', also: ['Fizeau fringes', 'contour fringes'], def: 'Interference fringes that follow lines of constant thickness of a thin film or gap. Each fringe is a contour of the gap, λ/2 apart in reflection.' },
    { term: 'Air wedge', def: 'A wedge-shaped air gap between two flat plates that touch along one edge and are separated by a small spacer at the other. It gives straight, equally spaced fringes parallel to the contact line.' },
    { term: 'Newton\'s rings', def: 'The pattern of concentric bright and dark rings seen where a convex surface touches a flat one. In reflection the dark rings have radii √(mλR) and the centre is dark.' },
    { term: 'Wedge angle', also: ['α'], def: 'The small angle between the two plates of an air wedge, equal to the spacer thickness divided by its distance from the contact line. It sets the fringe spacing λ/2α.' },
    { term: 'Optical flat', def: 'A glass or fused-silica plate polished flat to a fraction of a wavelength (λ/10 to λ/20 or better) and used as a reference: laid on another surface it shows fringes that map the gap.' }
  ],
  formulas: [
    {
      name: 'Radius of a dark ring',
      expr: 'r = sqrt(m*lambda*R)', tex: 'r_m = \\sqrt{m\\,\\lambda\\,R}',
      vars: {
        r: { name: 'radius of the m-th dark ring', q: 'length', unit: 'mm', tex: 'r_m' },
        m: { name: 'ring number', value: 10, min: 0, int: true },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        R: { name: 'radius of curvature of the lens', q: 'length', unit: 'm', value: 1 }
      },
      note: 'Reflected light, near-normal viewing; the centre is ring 0.',
      stories: { r: 'A lens of radius of curvature {R} rests on a flat plate and is lit with {lambda} light. How large is its dark ring number {m}?', R: 'The dark ring number {m} of Newton\'s rings in {lambda} light has a radius of {r}. What is the radius of curvature of the lens?' }
    },
    {
      name: 'Radius of curvature from two rings',
      expr: 'R = (rm^2 - rn^2)/((m - n)*lambda)', tex: 'R = \\frac{r_m^2 - r_n^2}{(m - n)\\,\\lambda}',
      vars: {
        R: { name: 'radius of curvature of the lens', q: 'length', unit: 'm' },
        rm: { name: 'radius of dark ring m', q: 'length', unit: 'mm', value: 2.345, tex: 'r_m' },
        rn: { name: 'radius of dark ring n', q: 'length', unit: 'mm', value: 1.658, tex: 'r_n' },
        m: { name: 'number of the outer ring', value: 10, int: true, min: 1 },
        n: { name: 'number of the inner ring', value: 5, int: true, min: 0 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      solveFor: 'R',
      note: 'Independent of where the true centre is. Use the diameters as 2r.'
    },
    {
      name: 'Wedge fringe spacing',
      expr: 'dx = lambda/(2*alpha)', tex: '\\Delta x = \\frac{\\lambda}{2\\,\\alpha}',
      vars: {
        dx: { name: 'fringe spacing', q: 'length', unit: 'mm', tex: '\\Delta x' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        alpha: { name: 'wedge angle', q: 'angle', unit: 'mrad', value: 1.2, tex: '\\alpha' }
      },
      stories: { dx: 'Two glass plates form an air wedge of angle {alpha}. Lit with {lambda} light, how far apart are the fringes?' }
    },
    {
      name: 'Gap from the fringe count',
      expr: 'h = N*lambda/2', tex: 'h = \\frac{N\\,\\lambda}{2}',
      vars: {
        h: { name: 'gap', q: 'length', unit: 'µm' },
        N: { name: 'number of fringes counted from the contact line', value: 218, min: 0 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' }
      },
      stories: { h: 'You count {N} fringes between the contact line and a spacer in {lambda} light. How thick is the spacer?' }
    },
    {
      name: 'Wedge angle from a spacer',
      expr: 'alpha = D/Lw', tex: '\\alpha = \\frac{D}{L_w}',
      vars: {
        alpha: { name: 'wedge angle', q: 'angle', unit: 'mrad', tex: '\\alpha' },
        D: { name: 'spacer thickness', q: 'length', unit: 'µm', value: 60 },
        Lw: { name: 'distance from the contact line to the spacer', q: 'length', unit: 'mm', value: 50, tex: 'L_w' }
      }
    }
  ],
  examples: [
    {
      title: 'Measuring a hair',
      q: 'A hair is laid between two optical flats 50 mm from the line where they touch. In green light of 550 nm, 218 dark fringes are counted between the contact line and the hair. How thick is the hair? How far apart are the fringes?',
      steps: [
        { text: 'Each fringe is a gap change of $\\lambda/2 = 275$ nm, so', tex: 'h = N\\,\\frac{\\lambda}{2} = 218 \\times 275\\ \\mathrm{nm} = 59.95\\ \\mu\\mathrm{m}' },
        { text: 'The wedge angle is $\\alpha = 60\\ \\mu\\mathrm{m}/50\\ \\mathrm{mm} = 1.2$ mrad, so the fringes are', tex: '\\Delta x = \\frac{\\lambda}{2\\alpha} = \\frac{550\\times10^{-9}}{2 \\times 1.2\\times10^{-3}} = 0.23\\ \\mathrm{mm} \\ \\text{apart}' }
      ],
      a: 'The hair is 60 µm thick (to within one fringe, 0.27 µm) and the fringes are 0.23 mm apart — easily seen through a magnifier. A micrometer would have to be read to 1 µm to do as well.'
    },
    {
      title: 'The radius of a lens from its rings',
      q: 'In sodium light (589 nm) the 5th and 15th dark Newton\'s rings of a plano-convex lens have diameters 4.20 mm and 7.28 mm. What is the radius of curvature of the curved surface?',
      steps: [
        { text: 'Use $R = (r_m^2 - r_n^2)/((m-n)\\lambda)$ with $r = D/2$, so $R = (D_m^2 - D_n^2)/(4(m-n)\\lambda)$:', tex: 'R = \\frac{(7.28\\ \\mathrm{mm})^2 - (4.20\\ \\mathrm{mm})^2}{4 \\times 10 \\times 589\\times10^{-6}\\ \\mathrm{mm}} = \\frac{35.36\\ \\mathrm{mm}^2}{0.02356\\ \\mathrm{mm}} = 1501\\ \\mathrm{mm}' }
      ],
      a: '$R \\approx 1.50$ m. Taking the difference of two rings made the answer independent of where the centre of the pattern is and of a speck of dust at the contact point.'
    }
  ],
  quiz: [
    { q: 'In reflected light, the centre of Newton\'s rings (where the lens touches the plate) is…', choices: ['bright', 'dark', 'coloured', 'dark or bright depending on the lens'], a: 1, why: 'At zero gap the two reflections differ only by the half-wave jump at the bottom surface, so they cancel: a dark centre.' },
    { q: 'Moving from one dark fringe to the next across an air wedge in green light of 550 nm, the gap changes by…', choices: ['550 nm', '275 nm', '1100 nm', '137.5 nm'], a: 1, why: 'The light crosses the gap twice, so a path change of one wavelength needs a gap change of $\\lambda/2$ = 275 nm.' },
    { q: 'A lens of radius of curvature $R = 2.0$ m is used with light of 500 nm. What is the radius of the 4th dark ring, in mm?', answer: 2, unit: 'mm', why: '$r_4 = \\sqrt{m\\lambda R} = \\sqrt{4 \\times 500\\times10^{-9} \\times 2.0} = 2.0\\times10^{-3}$ m.' },
    { q: 'The dark rings of Newton\'s rings are equally spaced in radius.', a: false, why: 'Their radii go as $\\sqrt{m}$, so successive rings get closer together towards the edge.' },
    { q: 'The same lens-and-plate system is viewed in transmitted instead of reflected light. The centre is…', choices: ['dark, as before', 'bright: the dark and bright rings swap', 'coloured', 'invisible'], a: 1, why: 'Reflected and transmitted patterns are complementary: where the reflection is dark the transmission is bright.' }
  ],
  applications: [
    'Testing the shape of optical surfaces against an optical flat or a test plate: each fringe is a contour of λ/2 ([[testing-optics-with-fringes]]).',
    'Measuring the thickness of a hair, foil or thin wire, and the thermal expansion of a small sample (Fizeau\'s dilatometer): count the fringes as the gap changes.',
    'Finding the radius of curvature of a lens or a test glass in the shop.',
    'Gauge blocks wring to a surface with a film of air a few nanometres thick; fringes show how well they wring.',
    'Unwanted rings between a slide and its cover glass, a film and the glass of a scanner or a projector mount, or a pressed touch screen.'
  ],
  history: 'Robert Hooke observed coloured rings between glass plates in 1665. Isaac Newton measured them carefully in the second book of his *Opticks* (1704), finding that the ring diameters follow the square roots of the whole numbers, but could not explain them with particles of light alone. Thomas Young explained them as interference in 1801. Hippolyte Fizeau used fringes of equal thickness in the 1860s to measure the thermal expansion of crystals.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — fringes of equal thickness and Newton\'s rings.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 — fringes of equal thickness in a plane-parallel and wedge-shaped film.',
    'D. Malacara (ed.), *Optical Shop Testing* — the use of test plates and Fizeau fringes in the shop.'
  ],
  sim: 'in-wedge'
},

/* ================================================================ the Michelson interferometer */
{
  id: 'michelson-interferometer', parent: 'interference', title: 'The Michelson interferometer', level: 2,
  short: 'A beam splitter sends light down two arms to two mirrors and recombines it. Moving one mirror by half a wavelength changes the path by a whole wavelength, so the output goes through one complete fringe: counting fringes measures displacement to a fraction of a wavelength, and with it wavelengths, gas indices, spectra and the passage of gravitational waves.',
  keywords: ['Michelson interferometer', 'Michelson-Morley', 'interferometer', 'fringe counting', 'displacement measurement', 'beam splitter', 'laser interferometer', 'circular fringes', 'equal inclination', 'compensator plate', 'FTIR', 'Fourier transform spectrometer', 'wavelength measurement', 'index of air', 'LIGO'],
  prereq: ['coherence', 'constructive-and-destructive-interference', 'beam-splitters'],
  related: ['mach-zehnder-and-sagnac', 'fabry-perot-interferometer', 'optical-coherence-tomography', 'interferometers-in-precision-engineering', 'testing-optics-with-fringes', 'spectrometers-and-monochromators', 'helium-neon-laser'],
  body: `
Take a beam of light, divide it in two, send the halves to two mirrors, bring them back and recombine: the output brightness tells you how the two paths compare, to a fraction of a wavelength. That is the **Michelson interferometer**, designed by Albert Michelson in 1881 and still the basis of the most precise length measurements made.

### How it works
A beam splitter reflects half the light to a fixed mirror M₁ and transmits half to a movable mirror M₂. Each beam returns, and at the splitter the two are recombined and sent to a detector or a screen. Each beam crosses its arm twice, so

$$\\Delta = 2\\,(L_2 - L_1)$$

Move M₂ by a distance $x$ and the path difference changes by $2x$. One full fringe (bright to bright) is a path change of one wavelength, i.e. a mirror movement of **λ/2**. The number of fringes passing a point is

$$N = \\frac{2x}{\\lambda}$$

For a helium–neon laser (632.8 nm) one fringe is 316.4 nm of mirror travel: 1 mm of travel is 3 160 fringes. An electronic fringe counter that interpolates to 1/100 of a fringe resolves 3 nm, and interferometers that interpolate to 1/1000 resolve a third of a nanometre.

### Two kinds of fringe
- **Mirrors parallel** (exactly square to the beams): circular fringes, each ring a cone of directions with the same path difference $2D\\cos\\theta$ for an arm imbalance $D$. As the mirror moves, rings grow out of the centre or collapse into it, one ring per λ/2.
- **Mirrors slightly tilted**: straight fringes, as from an air wedge.

In white light fringes exist only near zero path difference, where the central fringe is dark. A thin **compensator plate** in the fixed arm, the same thickness as the beam splitter, balances the glass in the two beams, so that the zero is the same for all colours.

### What it measures
| Quantity | How |
|---|---|
| Length, displacement, vibration | count fringes: $N = 2x/\\lambda$ (stage positions in wafer steppers, machine-tool calibration) |
| A wavelength | move the mirror a known distance and count: $\\lambda = 2x/N$ |
| Refractive index of a gas | put a cell of length $L$ in one arm and count the fringes while the gas is pumped in: $N = 2L(n-1)/\\lambda$ — 85 fringes for a 100 mm cell filled with air at 633 nm |
| A spectrum | scan the mirror and record the interferogram; its Fourier transform is the spectrum. The resolution is $1/(2\\,d_{max})$ in cm⁻¹ — 0.5 cm⁻¹ for a 1 cm scan |

In air over many metres the limit is no longer the instrument but the air: $n - 1 \\approx 2.7\\times10^{-4}$ and it changes by about 1 part in $10^6$ per °C, so the wavelength in air must be corrected from the temperature, pressure and humidity of the air along the path.

### The 1887 experiment
Michelson and Morley folded the arms to an effective 11 m, floated the instrument on mercury so it could be turned, and looked for a shift of the fringes as it rotated: if light travelled through a stationary "aether" through which the Earth moves, the fringes should have shifted by about 0.4 fringe. They saw less than 0.02. The null result was one of the foundations for relativity.

> [!key] A Michelson interferometer turns a mirror movement $x$ into a path change $2x$ and a fringe count $N = 2x/\\lambda$. Counting and interpolating fringes measures displacement to nanometres; the source needs a coherence length longer than the arm imbalance.
`,
  ideas: [
    'The beam splitter sends light to two mirrors and recombines it; the path difference is twice the difference of the arm lengths.',
    'Moving a mirror by λ/2 changes the path by λ and moves the output through one fringe: N = 2x/λ.',
    'With the mirrors parallel the fringes are circular rings that grow from or shrink into the centre; tilted mirrors give straight fringes.',
    'The same instrument measures displacement, a wavelength, the index of a gas (N = 2L(n−1)/λ) and, with a scanning mirror, a spectrum.',
    'Air itself limits long-distance accuracy: its index changes with temperature, pressure and humidity.'
  ],
  pitfalls: [
    'Moving the mirror by one wavelength passes one fringe — The light goes to the mirror and back, so a movement of λ/2 gives a path change of λ and one fringe; a movement of λ passes two.',
    'Any light source will do — The source\'s coherence length must exceed the arm imbalance. A white LED gives fringes only within a few micrometres of equal arms.',
    'The interferometer measures absolute distance — It counts changes: the fringes say how far the mirror moved, not where it started. The counter must not lose count (beam blocked, mirror moved too fast).',
    'Bright at one output means the light is lost at the other — The two outputs are complementary: when the detector port is dark, the light returns towards the source.'
  ],
  terms: [
    { term: 'Michelson interferometer', def: 'An interferometer in which a beam splitter divides the light into two arms ending in mirrors and recombines it; the output depends on the path difference, twice the arm difference.' },
    { term: 'Fringe counting', also: ['fringe counter', 'displacement interferometry'], def: 'Measuring a length change by counting the fringes that pass the detector, each representing λ/2 of mirror travel in a Michelson interferometer; electronics interpolate to a fraction of a fringe.' },
    { term: 'Compensator plate', also: ['compensating plate'], def: 'A plate of glass, the same thickness as the beam splitter, placed in the other arm so that both beams cross equal thicknesses of glass and zero path difference is the same for every wavelength.' },
    { term: 'Circular fringes', also: ['fringes of equal inclination', 'Haidinger fringes'], def: 'The concentric rings seen when the two mirrors are parallel; each ring is a direction at which the path difference 2D cos θ is a whole number of wavelengths.' },
    { term: 'Interferogram', def: 'The detector signal recorded as a function of the path difference while a mirror is scanned. Its Fourier transform is the spectrum of the light, which is how a Fourier-transform spectrometer (FTIR) works.' },
    { term: 'Zero path difference', also: ['ZPD', 'white-light fringe'], def: 'The mirror position where the two arms are equal, found as the only place where white-light fringes appear; the fringe there is dark because of the beam splitter\'s extra half-wave.' }
  ],
  formulas: [
    {
      name: 'Fringes counted for a mirror movement',
      expr: 'N = 2*x/lambda', tex: 'N = \\frac{2x}{\\lambda}',
      vars: {
        N: { name: 'number of fringes' },
        x: { name: 'mirror displacement', q: 'length', unit: 'µm', value: 100 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      stories: { N: 'A mirror of a Michelson interferometer moves by {x}. How many fringes of {lambda} light pass the detector?', x: 'You count {N} fringes of {lambda} light. How far did the mirror move?', lambda: 'A mirror is moved by {x} and {N} fringes are counted. What is the wavelength of the light?' }
    },
    {
      name: 'Fringes from a gas cell',
      expr: 'N = 2*L*(n - 1)/lambda', tex: 'N = \\frac{2L\\,(n - 1)}{\\lambda}',
      vars: {
        N: { name: 'number of fringes' },
        L: { name: 'length of the cell', q: 'length', unit: 'mm', value: 100 },
        n: { name: 'refractive index of the gas', value: 1.00027, min: 1, max: 2 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'A cell in one arm, passed twice. N counts the fringes between an empty (vacuum) cell and the gas.',
      stories: { N: 'A {L} cell in one arm of a Michelson interferometer is evacuated and then filled with gas of index {n}. How many fringes of {lambda} light pass?' }
    },
    {
      name: 'Resolution of a Fourier-transform spectrometer',
      expr: 'dnu = 1/(2*dmax)', tex: '\\Delta\\tilde\\nu = \\frac{1}{2\\,d_{max}}',
      vars: {
        dnu: { name: 'spectral resolution', q: 'wavenumber', unit: '1/cm', tex: '\\Delta\\tilde\\nu' },
        dmax: { name: 'mirror travel on one side of zero path difference', q: 'length', unit: 'cm', value: 1, tex: 'd_{max}' }
      },
      note: 'Unapodized, approximately; the largest path difference is 2·d_max.'
    }
  ],
  examples: [
    {
      title: 'Counting fringes',
      q: 'A He–Ne laser interferometer (632.8 nm) is used to measure the travel of a stage. The counter shows 316.0 fringes. How far did the stage move, and what is the resolution if the electronics interpolate to 1/100 of a fringe?',
      steps: [
        { text: 'Each fringe is $\\lambda/2$ of travel:', tex: 'x = N\\,\\frac{\\lambda}{2} = 316.0 \\times 316.4\\ \\mathrm{nm} = 100.0\\ \\mu\\mathrm{m}' },
        { text: 'A hundredth of a fringe is', tex: '\\frac{316.4\\ \\mathrm{nm}}{100} = 3.2\\ \\mathrm{nm}' }
      ],
      a: '100.0 µm of travel; a resolution of 3.2 nm. Over that distance in air a temperature change of 1 °C changes the result by only 1 ppm, 0.1 nm, so short travel is easy; over a metre the air correction matters.'
    },
    {
      title: 'The index of air',
      q: 'A 100 mm gas cell is placed in one arm of a Michelson interferometer using 632.8 nm light. It is pumped to a vacuum and then filled with air; 85 fringes are counted. What is the refractive index of the air, and how well is it known if one fringe can be read to 1/100?',
      steps: [
        { text: 'Solve $N = 2L(n-1)/\\lambda$ for $n - 1$:', tex: 'n - 1 = \\frac{N\\lambda}{2L} = \\frac{85 \\times 632.8\\times10^{-9}}{2 \\times 0.100} = 2.69\\times10^{-4}' },
        { text: 'A hundredth of a fringe corresponds to', tex: '\\delta n = \\frac{0.01 \\times 632.8\\times10^{-9}}{0.2} = 3.2\\times10^{-8}' }
      ],
      a: '$n = 1.000269$, to about $3\\times10^{-8}$ — one part in 10 000 of the quantity measured. This is how the refractive index of gases and its variation with pressure is determined.'
    }
  ],
  quiz: [
    { q: 'A He–Ne interferometer\'s movable mirror travels 1 mm. About how many fringes pass the detector?', answer: 3160, why: '$N = 2x/\\lambda = 2 \\times 10^{-3}/632.8\\times10^{-9} = 3161$. Each fringe is $\\lambda/2$ = 316 nm of travel.' },
    { q: 'If one mirror of a Michelson interferometer is moved by a distance $x$, the path difference changes by…', choices: ['x', '2x', 'x/2', '4x'], a: 1, why: 'The light travels to the mirror and back, so the path difference changes by twice the movement.' },
    { q: 'With a white-light source a Michelson interferometer shows fringes however unequal the arms are.', a: false, why: 'White light has a coherence length of a micrometre or so; fringes exist only within a few micrometres of equal arm lengths.' },
    { q: 'Circular fringes emerge from the centre as a mirror is moved. Each new ring corresponds to a mirror movement of…', choices: ['λ', 'λ/2', 'λ/4', '2λ'], a: 1, why: 'A new ring appears for each path change of one wavelength, which is a mirror movement of half a wavelength.' },
    { q: 'What limits the accuracy of a laser displacement interferometer working in air over several metres?', choices: ['The wavelength in the air varies with temperature, pressure and humidity', 'The laser\'s output power', 'Diffraction at the mirrors', 'The size of the beam splitter'], a: 0, why: 'The counter measures wavelengths of the light in air, which is shorter than in vacuum by the index $n$, with $n - 1 \\approx 2.7\\times10^{-4}$ varying by parts per million.' }
  ],
  applications: [
    'Calibration of machine tools and coordinate-measuring machines, and the stage positioning in photolithography machines: laser interferometers measure position to nanometres.',
    'Fourier-transform infrared (FTIR) spectrometers, in which a scanned Michelson gives the whole spectrum at once.',
    'Gravitational-wave detectors such as LIGO are enormous Michelson interferometers with 4 km arms and Fabry–Perot cavities in each arm; their first detection in 2015 saw arm lengths change by about $4\\times10^{-18}$ m.',
    'Optical coherence tomography is a low-coherence Michelson whose sample arm is the eye or the skin ([[optical-coherence-tomography]]).',
    'Vibration and surface measurement; wavelength meters for tunable lasers; the original realization of the metre in terms of the wavelength of light.'
  ],
  history: 'Michelson built his first interferometer in 1880–81 in Berlin and Potsdam, with funds from Alexander Graham Bell, to detect the motion of the Earth through the aether. With Edward Morley he refined it in Cleveland in 1887. In 1892–93 Michelson and Benoît at Sèvres measured the metre in wavelengths of the red cadmium line — about 1.55 million of them. Michelson received the Nobel Prize in Physics in 1907, the first American to do so, for his optical precision instruments.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — the Michelson interferometer and its fringes; ch. 7 of M. Born and E. Wolf, *Principles of Optics*.',
    'P. Hariharan, *Basics of Interferometry* — two-beam interferometers and their uses.',
    'A. A. Michelson and E. W. Morley, "On the relative motion of the Earth and the luminiferous ether", *American Journal of Science* 34 (1887).'
  ],
  sim: 'in-michelson'
},

/* ================================================================ the Fabry–Perot interferometer */
{
  id: 'fabry-perot-interferometer', parent: 'interference', title: 'The Fabry–Perot interferometer', level: 3,
  short: 'Two parallel partly reflecting mirrors make a cavity in which light bounces to and fro and leaks out each time. Many beams add; they cancel almost everywhere and reinforce at narrow peaks. The sharper the peaks (the finesse) the better the instrument resolves colours — and a lossless cavity of 99 % mirrors transmits 100 % on resonance.',
  keywords: ['Fabry-Perot', 'etalon', 'finesse', 'free spectral range', 'FSR', 'Airy function', 'resonance', 'cavity', 'multiple-beam interference', 'resolving power', 'linewidth', 'mirror reflectance', 'scanning interferometer', 'band-pass filter', 'laser cavity'],
  prereq: ['thin-film-interference', 'michelson-interferometer'],
  related: ['interference-filters', 'the-laser-cavity', 'dielectric-mirrors', 'laser-modes', 'spectrometers-and-monochromators', 'grating-spectrometers-and-resolving-power', 'fibre-sensors-and-bragg-gratings'],
  body: `
A thin film or an air gap between two plates, each surface reflecting only 4 %, gives two-beam fringes: a gentle cosine. Coat the surfaces so that each reflects 90 % or more, and the nature of the interference changes completely. Light bounces to and fro dozens of times, leaking a little out through the back mirror each round trip, and all those beams add. The result is a transmission that is almost zero except in extremely narrow peaks. This is the **Fabry–Perot interferometer**; made with fixed spacing it is called an **etalon**.

### Why only some colours get through
Two mirrors of reflectance $R$ are a distance $d$ apart in a medium of index $n$; light passes at angle $\\theta$. Successive transmitted beams differ in phase by $\\delta = 4\\pi n d\\cos\\theta/\\lambda$. When $2nd\\cos\\theta = m\\lambda$ they are all in step and the cavity is **resonant**: the transmitted amplitudes add, and so do those inside, and with lossless mirrors the transmission reaches 100 % however high $R$ is. The beams reflected back towards the source then cancel exactly — the same cancellation as an anti-reflection coating. Away from resonance the beams are out of step and almost nothing gets through. The **Airy function** gives the whole curve:

$$T = \\frac{1}{1 + F\\sin^2(\\delta/2)}\\qquad F = \\frac{4R}{(1 - R)^2}$$

### Finesse and free spectral range
Peaks repeat every wavelength interval

$$\\Delta\\lambda_{FSR} = \\frac{\\lambda^2}{2nd\\cos\\theta}\\qquad\\left(\\Delta\\nu_{FSR} = \\frac{c}{2nd}\\right)$$

called the **free spectral range**. Each peak has a width $\\Delta\\lambda_{FSR}/\\mathcal F$ where the **finesse**

$$\\mathcal F = \\frac{\\pi\\sqrt R}{1 - R}$$

depends only on the mirrors. The peaks also set the resolving power, $\\lambda/\\Delta\\lambda \\approx m\\mathcal F$ with $m = 2nd/\\lambda$ the order.

| Mirror reflectance $R$ | 4 % (bare glass) | 50 % | 90 % | 99 % | 99.9 % |
|---|---|---|---|---|---|
| Finesse $\\mathcal F$ | 0.65 | 4.4 | 29.8 | 313 | 3 140 |

For an air gap of 1 mm at 500 nm the free spectral range is 0.125 nm; with $R = 0.9$ each peak is 4.2 pm wide — 0.0042 nm, resolving two lines 5 pm apart (a resolving power of 120 000). Increasing $d$ narrows the peaks and packs them more closely, so spacing is a trade-off between resolution and the range over which you can tell orders apart.

### In practice
Mirror flatness limits the finesse: flatness of $\\lambda/100$ allows a finesse of about 50. A scanning interferometer changes $d$ with piezoelectric actuators to sweep a peak across a signal; a fixed etalon filters a laser to one mode. The narrow-band interference filters of cameras and telecom systems are Fabry–Perot cavities made of thin films ([[interference-filters]]): two quarter-wave mirror stacks around a half-wave spacer layer. A laser cavity is a Fabry–Perot too: its modes are the resonances, $c/2nd$ apart ([[the-laser-cavity]]).

> [!key] A Fabry–Perot cavity transmits only at resonances $2nd\\cos\\theta = m\\lambda$, spaced by the free spectral range $\\lambda^2/2nd$ and as narrow as the free spectral range divided by the finesse $\\pi\\sqrt R/(1-R)$.
`,
  ideas: [
    'Between two highly reflecting mirrors many beams add; the cavity transmits only at resonances, 2nd cos θ = mλ.',
    'On resonance a lossless cavity transmits 100 % even with 99 % mirrors, because the reflected beams cancel.',
    'The free spectral range λ²/(2nd cos θ) is the spacing of the peaks; the finesse π√R/(1−R) is the ratio of that spacing to the peak width.',
    'The resolving power is about mℱ: larger spacing and higher reflectance resolve finer detail.',
    'Narrow-band interference filters and laser cavities are Fabry–Perot interferometers built from thin films or mirrors.'
  ],
  pitfalls: [
    'High-reflectance mirrors block the light — At resonance a lossless Fabry–Perot transmits all of it; the light is stored in the cavity and leaves as fast as it enters. It is the off-resonance light that is reflected.',
    'Higher reflectance spaces the peaks farther apart — The spacing (free spectral range) depends only on the mirror separation; higher reflectance only narrows each peak.',
    'The finesse depends on the mirror spacing — It depends on the reflectance (and on flatness and absorption), not on d. The spacing sets the free spectral range and the resolving power with it.',
    'A bigger gap gives a larger free spectral range — The opposite: the free spectral range is λ²/2nd, so a larger gap packs the peaks closer together.'
  ],
  terms: [
    { term: 'Fabry–Perot interferometer', also: ['FPI', 'FP cavity'], def: 'Two parallel partly reflecting mirrors forming a resonant cavity. Light bounces to and fro; the transmitted beams add to give sharp peaks where the round-trip phase is a whole number of cycles.' },
    { term: 'Etalon', def: 'A Fabry–Perot interferometer with a fixed spacing, usually a plate of glass or fused silica with two reflective coatings, used as a narrow-band filter or wavelength reference.' },
    { term: 'Finesse', also: ['ℱ', 'F'], def: 'The ratio of the free spectral range to the width of a transmission peak; for mirrors of reflectance R, ℱ = π√R/(1 − R). A measure of how sharp the peaks are.' },
    { term: 'Free spectral range', also: ['FSR'], def: 'The distance between adjacent transmission peaks: λ²/(2nd cos θ) in wavelength, c/(2nd cos θ) in frequency. Beyond it the orders overlap.' },
    { term: 'Airy function', also: ['Airy transmission', 'Airy peaks'], def: 'The transmission of a Fabry–Perot cavity, T = 1/(1 + F sin²(δ/2)), a train of peaks of unit height whose sharpness grows with the coefficient of finesse F = 4R/(1 − R)².' },
    { term: 'Resonance', also: ['cavity resonance'], def: 'A condition in which the round-trip phase of the light in a cavity is a whole number of cycles, 2nd cos θ = mλ, so that the wave reinforces itself on every pass and the cavity transmits.' }
  ],
  formulas: [
    {
      name: 'Finesse',
      expr: 'Fn = pi*sqrt(R)/(1 - R)', tex: '\\mathcal{F} = \\frac{\\pi\\sqrt{R}}{1 - R}',
      vars: {
        Fn: { name: 'finesse', tex: '\\mathcal{F}' },
        R: { name: 'reflectance of each mirror', q: 'ratio', unit: '%', value: 90, min: 1, max: 99.99 }
      },
      note: 'Reflectance only; flatness errors and absorption reduce it in practice.',
      stories: { Fn: 'The two mirrors of a Fabry–Perot cavity each reflect {R}. What is its finesse?', R: 'A Fabry–Perot cavity must have a finesse of {Fn}. What reflectance must its mirrors have?' }
    },
    {
      name: 'Free spectral range in wavelength',
      expr: 'fsr = lambda^2/(2*n*d)', tex: '\\Delta\\lambda_{FSR} = \\frac{\\lambda^2}{2\\,n\\,d}',
      vars: {
        fsr: { name: 'free spectral range', q: 'length', unit: 'nm', tex: '\\Delta\\lambda_{FSR}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        n: { name: 'refractive index between the mirrors', value: 1, min: 1, max: 4 },
        d: { name: 'mirror spacing', q: 'length', unit: 'mm', value: 1 }
      },
      note: 'Normal incidence. At an angle replace d by d cos θ.',
      stories: { fsr: 'Two mirrors {d} apart in a medium of index {n} form a cavity used at {lambda}. What is its free spectral range?' }
    },
    {
      name: 'Free spectral range in frequency',
      expr: 'dnu = c/(2*n*d)', tex: '\\Delta\\nu_{FSR} = \\frac{c}{2\\,n\\,d}',
      vars: {
        dnu: { name: 'free spectral range', q: 'frequency', unit: 'GHz', tex: '\\Delta\\nu_{FSR}' },
        c: { const: 'c' },
        n: { name: 'refractive index between the mirrors', value: 1, min: 1, max: 4 },
        d: { name: 'mirror spacing', q: 'length', unit: 'mm', value: 100 }
      },
      note: 'Also the spacing of the longitudinal modes of a laser cavity of length d.'
    },
    {
      name: 'Width of a peak',
      expr: 'fwhm = lambda^2/(2*n*d*Fn)', tex: '\\delta\\lambda = \\frac{\\lambda^2}{2\\,n\\,d\\,\\mathcal{F}}',
      vars: {
        fwhm: { name: 'full width at half maximum', q: 'length', unit: 'pm', tex: '\\delta\\lambda' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' },
        n: { name: 'refractive index', value: 1, min: 1, max: 4 },
        d: { name: 'mirror spacing', q: 'length', unit: 'mm', value: 1 },
        Fn: { name: 'finesse', value: 29.8, min: 1, tex: '\\mathcal{F}' }
      },
      stories: { fwhm: 'A Fabry–Perot of {d} spacing and finesse {Fn} is used at {lambda}. How wide is each transmission peak?' }
    },
    {
      name: 'Resolving power',
      expr: 'RP = 2*n*d*Fn/lambda', tex: '\\mathrm{RP} = \\frac{2\\,n\\,d\\,\\mathcal{F}}{\\lambda}',
      vars: {
        RP: { name: 'resolving power λ/δλ', tex: '\\mathrm{RP}' },
        n: { name: 'refractive index', value: 1, min: 1, max: 4 },
        d: { name: 'mirror spacing', q: 'length', unit: 'mm', value: 1 },
        Fn: { name: 'finesse', value: 29.8, min: 1, tex: '\\mathcal{F}' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 500, tex: '\\lambda' }
      },
      solveFor: 'RP'
    }
  ],
  examples: [
    {
      title: 'Resolving two lines',
      q: 'An air-spaced Fabry–Perot with mirrors of reflectance 90 % has d = 1 mm. Working at 500 nm, find the finesse, the free spectral range, the peak width and the resolving power. Can it separate two spectral lines 5 pm apart?',
      steps: [
        { text: 'Finesse:', tex: '\\mathcal{F} = \\frac{\\pi\\sqrt{0.9}}{0.1} = 29.8' },
        { text: 'Free spectral range:', tex: '\\Delta\\lambda_{FSR} = \\frac{(500\\ \\mathrm{nm})^2}{2 \\times 10^{6}\\ \\mathrm{nm}} = 0.125\\ \\mathrm{nm}' },
        { text: 'Peak width and resolving power:', tex: '\\delta\\lambda = \\frac{0.125}{29.8} = 4.2\\ \\mathrm{pm} \\qquad \\frac{\\lambda}{\\delta\\lambda} = \\frac{500}{0.0042} = 1.2\\times10^{5}' }
      ],
      a: 'Finesse 29.8, free spectral range 0.125 nm, peaks 4.2 pm wide, resolving power 120 000. Two lines 5 pm apart are just resolved — but they must lie within one free spectral range (0.125 nm) of each other, or their orders overlap.'
    },
    {
      title: 'A high-finesse cavity',
      q: 'A laser cavity of two mirrors of reflectance 99.9 % is 10 cm long (air). Find its finesse, free spectral range and the width of one resonance in frequency.',
      steps: [
        { text: 'Finesse:', tex: '\\mathcal{F} = \\frac{\\pi\\sqrt{0.999}}{0.001} = 3140' },
        { text: 'Free spectral range:', tex: '\\Delta\\nu_{FSR} = \\frac{c}{2d} = \\frac{2.998\\times10^{8}}{0.2} = 1.5\\ \\mathrm{GHz}' },
        { text: 'Resonance width:', tex: '\\delta\\nu = \\frac{1.5\\ \\mathrm{GHz}}{3140} = 0.48\\ \\mathrm{MHz}' }
      ],
      a: 'Resonances 1.5 GHz apart, each 0.48 MHz wide — a frequency reference or a filter that selects one mode of a laser with a precision of one part in a billion.'
    }
  ],
  quiz: [
    { q: 'A lossless Fabry–Perot cavity with two 99 % mirrors is tuned exactly to resonance. What fraction of the light does it transmit?', choices: ['1 %', 'about 50 %', '100 %', '0 %'], a: 2, why: 'On resonance the beams reflected back towards the source cancel and the transmitted beams add: all the light passes (for equal, lossless mirrors). Only the absorption and scattering in real coatings stop it.' },
    { q: 'The mirror spacing of a Fabry–Perot is doubled. Its free spectral range…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 1, why: '$\\Delta\\lambda_{FSR} = \\lambda^2/2nd$ is inversely proportional to the spacing. (Each peak also gets narrower, in proportion, so the resolving power doubles.)' },
    { q: 'What is the finesse of a Fabry–Perot with mirrors of reflectance 0.90?', answer: 29.8, why: '$\\mathcal F = \\pi\\sqrt{0.9}/(1 - 0.9) = 29.8$.' },
    { q: 'Raising the mirror reflectance of a Fabry–Perot moves the transmission peaks further apart.', a: false, why: 'The spacing of the peaks is the free spectral range, which depends only on the spacing of the mirrors. A higher reflectance only narrows each peak (it raises the finesse).' },
    { q: 'In a narrow band-pass interference filter, which part acts as the Fabry–Perot cavity?', choices: ['The spacer layer between two quarter-wave mirror stacks', 'The glass substrate', 'The anti-reflection coating on the back', 'The black mask around the edge'], a: 0, why: 'The spacer, usually a half-wave layer, sets the resonant wavelength; the stacks on either side are the dielectric mirrors with high reflectance.' }
  ],
  applications: [
    'Narrow-band interference filters and the etalons of telecommunication systems, which select one channel out of many with a spacing of 50 or 100 GHz.',
    'The laser itself: every laser cavity is a Fabry–Perot resonator whose resonances are the longitudinal modes; a scanning Fabry–Perot analyses a laser\'s modes and linewidth.',
    'High-resolution spectroscopy in astronomy, including tunable filters that image the Sun in a single spectral line.',
    'Optical cavities for gravitational-wave detectors, cavity ring-down gas sensing and frequency stabilization of lasers.',
    'Fibre sensors: a tiny Fabry–Perot cavity at the tip of a fibre changes its resonance with strain, temperature or pressure.'
  ],
  history: 'George Airy summed the multiple reflections in a plane-parallel plate in 1833, giving the function that carries his name. Charles Fabry and Alfred Perot built their interferometer in Marseille in the late 1890s and used it for precise spectroscopy; the fixed-spacing version they called an étalon. In 1913 Fabry and Henri Buisson used interferometric measurements of the Sun\'s ultraviolet light to show that the upper atmosphere contains ozone.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — multiple-beam interferometry and the Fabry–Perot.',
    'M. Born and E. Wolf, *Principles of Optics*, ch. 7 — multiple-beam interference and the Fabry–Perot interferometer.',
    'J. M. Vaughan, *The Fabry–Perot Interferometer: History, Theory, Practice and Applications* (Adam Hilger, 1989).'
  ],
  sim: 'in-fabry-perot'
},

/* ================================================================ Mach–Zehnder and Sagnac */
{
  id: 'mach-zehnder-and-sagnac', parent: 'interference', title: 'Mach–Zehnder and Sagnac interferometers', level: 3,
  short: 'In a Mach–Zehnder interferometer the two beams travel separate paths and meet at a second splitter, giving two complementary outputs — ideal for sensing what is placed in one arm and for the modulators that carry most internet traffic. In a Sagnac interferometer both beams go round the same loop in opposite directions and return in step unless the loop rotates: the principle of the fibre-optic and ring-laser gyroscope.',
  keywords: ['Mach-Zehnder', 'Mach–Zehnder modulator', 'Sagnac', 'Sagnac effect', 'fibre-optic gyroscope', 'FOG', 'ring laser gyroscope', 'gyroscope', 'rotation sensing', 'half-wave voltage', 'Vpi', 'interferometric sensor', 'phase shifter', 'two outputs', 'ring interferometer'],
  prereq: ['michelson-interferometer', 'coherence'],
  related: ['fibre-sensors-and-bragg-gratings', 'optical-isolators-and-modulators', 'beam-splitters', 'interferometers-in-precision-engineering', 'fabry-perot-interferometer', 'the-fibre-internet-link'],
  body: `
The Michelson interferometer folds its beams back along the same arms. Two other layouts have a speciality each. In the **Mach–Zehnder** interferometer the beams go different ways, so anything can be put into one arm. In the **Sagnac** interferometer both beams go the *same* way round a loop, in opposite directions, so it is blind to almost everything — except rotation.

### Mach–Zehnder: two separate arms
A first beam splitter divides the light; the two beams travel along different paths and meet at a second splitter. There are two outputs, whose powers are complementary:

$$P_1 = P_0\\cos^2\\frac{\\varphi}{2}\\qquad P_2 = P_0\\sin^2\\frac{\\varphi}{2}$$

with $\\varphi = 2\\pi\\Delta/\\lambda$ the phase difference between the arms. The light passes each arm once, so $\\Delta$ is the arm difference itself, not twice it. That makes it the interferometer for *looking through* something: a flame, a flow of gas, a plasma, a layer of protein on a waveguide — each changes the optical path of one arm and shifts the output. An index change $\\Delta n$ along a length $L$ gives $\\varphi = 2\\pi\\,\\Delta n\\,L/\\lambda$, so a $\\pi$ shift in a 2 cm arm at 1550 nm needs only $\\Delta n = 3.9\\times10^{-5}$.

### The modulator that carries the internet
In a lithium niobate or silicon **Mach–Zehnder modulator** a voltage applied by electrodes along one arm changes its index, and so its phase. The output is

$$T = \\cos^2\\!\\left(\\frac{\\pi V}{2V_\\pi}\\right)$$

where the **half-wave voltage** $V_\\pi$ — a few volts — swings the output from full transmission to darkness. Driven at tens of gigabits per second, it writes data onto a laser beam; most long-distance fibre links use them.

### Sagnac: a loop travelled both ways
Split the light, send one half clockwise and one anticlockwise round a ring of mirrors or fibre, and recombine them. They have taken exactly the same path, so any disturbance that affects both directions equally — vibration, temperature drift, a slowly changing length — cancels. But if the ring **rotates**, the beam going with the rotation has to chase mirrors that run away from it and the other meets them, so their paths differ. For a loop enclosing area $A$ with $N$ turns, turning at $\\Omega$ about its axis,

$$\\Delta\\varphi = \\frac{8\\pi\\,N\\,A\\,\\Omega}{\\lambda\\,c}$$

The Earth turns at $7.29\\times10^{-5}$ rad/s (15° per hour). A kilometre of fibre wound on a 10 cm coil ($NA = 25$ m²) gives $\\Delta\\varphi = 9.9\\times10^{-5}$ rad at 1550 nm — a tenth of a milliradian, easily resolved by a modern detector. In a **ring-laser gyroscope** the loop is a laser cavity and rotation splits the frequencies of the two counter-travelling beams by $\\Delta f = 4A\\Omega/(\\lambda P)$, with $P$ the perimeter: a 4 m × 4 m ring laser at Wettzell, Germany, beats at 348 Hz from the Earth's rotation alone.

| | Michelson | Mach–Zehnder | Sagnac |
|---|---|---|---|
| Paths | retraced, twice | separate, once | the same loop, opposite ways |
| Path difference | 2 × arm difference | the arm difference | zero at rest |
| Outputs | one back to the source | two, complementary | one back to the source |
| Senses | displacement, index | what is put in one arm; a voltage | rotation, not vibration |

> [!key] A Mach–Zehnder splits the light into two separate arms and has two complementary outputs: $P_1 = P_0\\cos^2(\\varphi/2)$. A Sagnac sends two beams round one loop in opposite directions; they differ in phase only if the loop rotates, by $8\\pi NA\\Omega/\\lambda c$.
`,
  ideas: [
    'A Mach–Zehnder interferometer has separate arms and two complementary outputs, P₁ = P₀ cos²(φ/2) and P₂ = P₀ sin²(φ/2).',
    'Its path difference is a single pass, so it is the interferometer for sensing an object, a flow or a voltage in one arm.',
    'A modulator is a Mach–Zehnder whose arm phase is set by a voltage: T = cos²(πV/2Vπ), Vπ being a few volts.',
    'A Sagnac interferometer sends two beams round one loop in opposite directions; vibration and drift affect both equally and cancel.',
    'Rotation breaks the symmetry: Δφ = 8πNAΩ/(λc), the working principle of fibre and ring-laser gyroscopes.'
  ],
  pitfalls: [
    'The Mach–Zehnder path difference is twice the arm difference, as in a Michelson — Each beam crosses its arm only once, so the path difference is simply the arm difference.',
    'A Sagnac interferometer is as sensitive to vibration as any other — Vibration changes the paths of both counter-propagating beams equally, so it cancels. That reciprocity is why the gyroscope is useful.',
    'The Sagnac effect disproves relativity (or proves the aether) — It follows from the constancy of the speed of light, seen from a rotating frame; the effect is predicted by relativity and measured precisely.',
    'A modulator absorbs the light to make it dark — At full extinction the two arms cancel at the output port; the light leaves by the second output or is radiated out of the waveguide, not absorbed.'
  ],
  terms: [
    { term: 'Mach–Zehnder interferometer', also: ['MZI'], def: 'An interferometer in which a first beam splitter sends light along two separate arms and a second one recombines it, giving two complementary outputs. The beams pass each arm once.' },
    { term: 'Mach–Zehnder modulator', also: ['MZM'], def: 'A Mach–Zehnder interferometer built into a waveguide (lithium niobate, silicon) in which a voltage on one arm changes its refractive index, and so the phase, so that the output power follows the voltage.' },
    { term: 'Half-wave voltage', also: ['Vπ', 'V_pi'], def: 'The voltage that changes the phase of one arm of a modulator by π and so swings the output from maximum to minimum; typically a few volts.' },
    { term: 'Sagnac effect', def: 'The difference in phase (or in travel time) between two beams sent round a loop in opposite directions when the loop rotates: Δφ = 8πNAΩ/(λc).' },
    { term: 'Fibre-optic gyroscope', also: ['FOG'], def: 'A rotation sensor made of a long coil of optical fibre in a Sagnac interferometer; the phase shift is proportional to the rotation rate and to the length of fibre times the diameter of the coil.' },
    { term: 'Ring laser gyroscope', also: ['RLG'], def: 'A gyroscope in which two laser beams run in opposite directions round a closed cavity; rotation changes their frequencies and the beat frequency, 4AΩ/(λP), is proportional to the rotation rate.' }
  ],
  formulas: [
    {
      name: 'Mach–Zehnder output',
      expr: 'P1 = P0*cos(phi/2)^2', tex: 'P_1 = P_0\\cos^2\\frac{\\varphi}{2}',
      vars: {
        P1: { name: 'power at output 1', q: 'power', unit: 'mW', tex: 'P_1' },
        P0: { name: 'input power', q: 'power', unit: 'mW', value: 1, tex: 'P_0' },
        phi: { name: 'phase difference between the arms', q: 'angle', unit: '°', value: 90, min: 0, max: 360, tex: '\\varphi' }
      },
      solveFor: 'P1',
      note: 'Output 2 gets the rest: P₂ = P₀ − P₁ (no loss).'
    },
    {
      name: 'Phase from an index change in one arm',
      expr: 'dphi = 2*pi*dn*L/lambda', tex: '\\Delta\\varphi = \\frac{2\\pi\\,\\Delta n\\,L}{\\lambda}',
      vars: {
        dphi: { name: 'phase change', q: 'angle', unit: '°', tex: '\\Delta\\varphi' },
        dn: { name: 'change of refractive index', value: 3.9e-5, tex: '\\Delta n' },
        L: { name: 'length of the changed arm', q: 'length', unit: 'cm', value: 2 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' }
      },
      note: 'About 180° with the values given: the index change needed for a full on–off swing.',
      stories: { dphi: 'The index of a {L} arm changes by {dn} at {lambda}. How far does the phase shift?' }
    },
    {
      name: 'Modulator transmission',
      expr: 'T = cos(pi*V/(2*Vpi))^2', tex: 'T = \\cos^2\\!\\left(\\frac{\\pi V}{2V_\\pi}\\right)',
      vars: {
        T: { name: 'transmission', q: 'ratio', unit: '%' },
        V: { name: 'applied voltage', q: 'voltage', unit: 'V', value: 2, min: 0, max: 8 },
        Vpi: { name: 'half-wave voltage', q: 'voltage', unit: 'V', value: 4, min: 0.1, tex: 'V_\\pi' }
      },
      solveFor: 'T',
      note: 'An ideal Mach–Zehnder modulator without insertion loss, for V up to 2Vπ.',
      stories: { T: 'A Mach–Zehnder modulator with a half-wave voltage of {Vpi} is driven with {V}. What fraction of the light is transmitted?' }
    },
    {
      name: 'Sagnac phase shift',
      expr: 'dphi = 8*pi*N*A*Om/(lambda*c)', tex: '\\Delta\\varphi = \\frac{8\\pi\\,N\\,A\\,\\Omega}{\\lambda\\,c}',
      vars: {
        dphi: { name: 'phase difference between the beams', q: 'angle', unit: 'mrad', tex: '\\Delta\\varphi' },
        N: { name: 'number of turns', value: 3183, min: 1 },
        A: { name: 'area of one turn', q: 'area', unit: 'cm²', value: 78.5 },
        Om: { name: 'rotation rate', q: 'angvel', unit: 'rad/s', value: 7.29e-5, tex: '\\Omega' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 1550, tex: '\\lambda' },
        c: { const: 'c' }
      },
      solveFor: 'dphi',
      note: 'The defaults are a kilometre of fibre on a 10 cm coil, turned by the Earth\'s rotation (7.29×10⁻⁵ rad/s = 15°/h).',
      stories: { dphi: 'A fibre gyroscope has {N} turns of area {A} each and works at {lambda}. How large is the Sagnac phase shift when it turns at {Om}?' }
    },
    {
      name: 'Ring-laser beat frequency',
      expr: 'df = 4*A*Om/(lambda*P)', tex: '\\Delta f = \\frac{4\\,A\\,\\Omega}{\\lambda\\,P}',
      vars: {
        df: { name: 'beat frequency', q: 'frequency', unit: 'Hz', tex: '\\Delta f' },
        A: { name: 'area enclosed by the beam', q: 'area', unit: 'm²', value: 16 },
        Om: { name: 'rotation rate about the normal to the ring', q: 'angvel', unit: 'rad/s', value: 5.5e-5, tex: '\\Omega' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' },
        P: { name: 'perimeter of the ring', q: 'length', unit: 'm', value: 16 }
      },
      note: 'The default is a 4 m × 4 m helium–neon ring at latitude 49°, where the Earth\'s rotation component along the vertical is 5.5×10⁻⁵ rad/s.',
      stories: { df: 'A ring laser of {A} area and {P} perimeter runs at {lambda} and turns at {Om}. What beat frequency does it show?' }
    }
  ],
  examples: [
    {
      title: 'A fibre gyroscope at rest on the Earth',
      q: 'A fibre-optic gyroscope has 1 km of fibre wound as a coil of radius 5 cm. It is used at 1550 nm and rests at the pole, where the Earth\'s rotation $7.29\\times10^{-5}$ rad/s is along the coil axis. What Sagnac phase shift does it see? What rotation does a phase resolution of 1 µrad correspond to?',
      steps: [
        { text: 'The coil has $N = L/2\\pi r = 3183$ turns of area $\\pi r^2 = 78.5\\ \\mathrm{cm}^2$, so $NA = 25\\ \\mathrm{m}^2$:', tex: '\\Delta\\varphi = \\frac{8\\pi \\times 25 \\times 7.29\\times10^{-5}}{1.55\\times10^{-6}\\times 2.998\\times10^{8}} = 9.9\\times10^{-5}\\ \\mathrm{rad}' },
        { text: 'A phase of 1 µrad corresponds to a rotation of', tex: '\\Omega_{min} = \\frac{10^{-6}\\,\\lambda c}{8\\pi NA} = 7.4\\times10^{-7}\\ \\mathrm{rad/s} = 0.15°/\\mathrm{h}' }
      ],
      a: 'About 0.1 mrad at Earth rate; a phase resolution of 1 µrad detects 0.15°/h, a hundredth of the Earth\'s rotation. Longer fibre and larger coils improve this in proportion to $NA$.'
    },
    {
      title: 'A modulator at work',
      q: 'A Mach–Zehnder modulator has a half-wave voltage of 4.0 V. What voltage reduces the transmission to 10 %? And how large an index change in a 2 cm arm gives a π phase shift at 1550 nm?',
      steps: [
        { text: 'Solve $\\cos^2(\\pi V/2V_\\pi) = 0.1$:', tex: 'V = \\frac{2V_\\pi}{\\pi}\\arccos\\sqrt{0.1} = \\frac{8}{\\pi} \\times 1.249 = 3.18\\ \\mathrm{V}' },
        { text: 'A phase of π needs $\\Delta n\\,L = \\lambda/2$:', tex: '\\Delta n = \\frac{\\lambda}{2L} = \\frac{1550\\times10^{-9}}{2 \\times 0.02} = 3.9\\times10^{-5}' }
      ],
      a: '3.2 V for 10 % transmission; an index change of only $3.9\\times10^{-5}$ for full on–off switching — which is why a few volts across a few micrometres of lithium niobate suffice.'
    }
  ],
  quiz: [
    { q: 'The phase difference between the arms of a Mach–Zehnder interferometer is changed from 0 to π. The power at output 1 changes from…', choices: ['all to nothing', 'half to nothing', 'nothing to all', 'all to half'], a: 0, why: '$P_1 = P_0\\cos^2(\\varphi/2)$: $P_0$ at $\\varphi = 0$, zero at $\\varphi = \\pi$. Output 2 gets the light in turn.' },
    { q: 'A Sagnac interferometer is insensitive to a uniform change in the length of its fibre loop, because both beams travel the same path.', a: true, why: 'The beams go round the same loop in opposite directions, so a change in the loop affects both equally. Only a difference between the two directions — produced by rotation — shifts the output.' },
    { q: 'A Mach–Zehnder modulator with $V_\\pi = 5$ V is driven by 2.5 V. What fraction of the light is transmitted?', answer: 0.5, why: '$T = \\cos^2(\\pi \\times 2.5/10) = \\cos^2(45°) = 0.5$.' },
    { q: 'Why is a Mach–Zehnder interferometer suited to measuring the density of a gas flow in a wind tunnel?', choices: ['The beams are separate, so the flow can be put in one arm and the light passes it once', 'Because it needs no beam splitter', 'Because it is insensitive to the gas', 'Because it counts photons'], a: 0, why: 'In a Michelson the beams retrace each other; in the Mach–Zehnder the flow sits in one arm, and the density change appears as an index change and a phase shift.' },
    { q: 'A ring laser gyroscope shows a beat frequency between its two counter-travelling beams when it is…', choices: ['rotated about its axis', 'heated', 'vibrated sideways', 'switched off'], a: 0, why: 'Rotation about the normal to the ring changes the effective round-trip length of the two directions in opposite ways and so splits their frequencies: $\\Delta f = 4A\\Omega/\\lambda P$.' }
  ],
  applications: [
    'Telecommunications: the Mach–Zehnder modulators that put data on the laser light in long-haul and data-centre links, at tens to over a hundred gigabaud.',
    'Inertial navigation of aircraft, ships, submarines and spacecraft with fibre-optic and ring-laser gyroscopes that have no moving parts.',
    'Geodesy: large ring lasers measure the Earth\'s rotation and its small variations.',
    'Interferometric sensors: fibre hydrophones, strain, temperature and chemical sensors, and biosensors on a chip, in which the sensing arm is exposed and the reference arm is shielded.',
    'Imaging flows, flames and plasmas: Mach–Zehnder interferograms give density maps in wind tunnels and fusion experiments.'
  ],
  history: 'Ludwig Zehnder (1891) and Ludwig Mach (1892), the son of Ernst Mach, described the interferometer independently. Georges Sagnac built his rotating interferometer in Paris in 1913 and believed it showed the aether; today it is understood as a consequence of the constancy of the speed of light. In 1925 Michelson, Gale and Pearson used a rectangular loop of pipe 613 m × 339 m near Chicago to measure the Earth\'s rotation by the Sagnac effect. The ring laser gyroscope was demonstrated in the 1960s and the fibre-optic gyroscope in 1976.',
  sources: [
    'E. Hecht, *Optics*, ch. 9 (Interference) — the Mach–Zehnder and Sagnac interferometers.',
    'H. C. Lefèvre, *The Fiber-Optic Gyroscope* (Artech House) — the Sagnac effect and the design of gyroscopes.',
    'K. U. Schreiber and J.-P. R. Wells, "Invited review article: Large ring lasers for rotation sensing", *Review of Scientific Instruments* 84 (2013).'
  ],
  sim: 'in-mach-zehnder'
},

/* ================================================================ reading fringes: testing optics */
{
  id: 'testing-optics-with-fringes', parent: 'interference', title: 'Reading fringes: testing optics', level: 3,
  short: 'To test a surface, lay it against a flat reference or into an interferometer and read the fringes: each one is a contour of the error, λ/2 of surface height. Straight, parallel, equally spaced fringes mean a flat surface; fringes that bow by half their spacing mean "flat to λ/4". Counting rings gives the curvature; a map of the bends gives the whole shape.',
  keywords: ['optical test', 'test plate', 'optical flat', 'Fizeau interferometer', 'Twyman–Green', 'surface figure', 'flatness', 'lambda/4', 'lambda/10', 'power and irregularity', 'fringes', 'phase-shifting interferometry', 'peak-to-valley', 'RMS', 'wavefront error', 'fringe bow'],
  prereq: ['newtons-rings-and-wedge-fringes', 'michelson-interferometer'],
  related: ['testing-surfaces-with-interferometers', 'surface-quality-and-flatness', 'wavefront-error-and-zernike-polynomials', 'strehl-ratio-and-diffraction-limited', 'optical-windows', 'mirrors-as-components', 'making-optics', 'aspheric-surfaces'],
  body: `
Optical surfaces are polished to within a fraction of a wavelength of their ideal shape, and the instrument that can see errors that small is the interferometer. The measuring stick is the wavelength of light itself: half a micrometre divided into fractions of a fringe.

### What one fringe means
Lay a very flat reference (a test plate or optical flat) on the surface to be tested. The air gap between them is a thin film ([[newtons-rings-and-wedge-fringes]]), dark where its thickness is a whole number of half wavelengths. Each fringe is a **contour line of the gap**, and neighbouring contours are $\\lambda/2$ apart:

- one fringe = $\\lambda/2$ of **surface height** (316 nm for a helium–neon laser at 632.8 nm);
- in a Fizeau or Twyman–Green interferometer the beam goes to the surface and back, so the **wavefront** error is twice the surface error at normal incidence: one fringe = one wavelength of wavefront. For a mirror used at angle $\\theta$ the wavefront error is $2h\\cos\\theta$ — 1.41 times the surface error at 45°.

### Reading the pattern
- **Straight, parallel, equally spaced fringes:** a flat surface; the spacing only tells how much it is tilted against the reference.
- **Bowed fringes:** if the fringe spacing is $s$ and a fringe bows by $b$, the surface departs from flat by $(b/s)\\times\\lambda/2$. A fringe bowed by a quarter of the spacing is a $\\lambda/8$ error; half the spacing is $\\lambda/4$.
- **Concentric rings:** a spherical surface (**power**). A surface of diameter $D$ and radius of curvature $R$ shows $N = D^2/(4R\\lambda)$ rings: a 25 mm window with $R = 10$ m shows 25 rings.
- **Elliptical or saddle-shaped fringes:** astigmatism. **Fringes bending sharply near the rim:** a turned-down edge from polishing.
- **Direction:** with the plates touching at one edge, fringes that bow *away* from the contact line mean the surface is high (convex) there; fringes bowing towards it mean low (concave).

| Grade (at 632.8 nm) | Peak-to-valley surface error | Typical use |
|---|---|---|
| $\\lambda/4$ | 158 nm | ordinary windows and mirrors |
| $\\lambda/10$ | 63 nm | good optics, laser mirrors |
| $\\lambda/20$ | 32 nm | precision flats |
| $\\lambda/50$ | 13 nm | reference flats |

A wavefront error of $\\lambda/4$ peak-to-valley is the classical limit of "diffraction-limited": it costs about 20 % of the peak brightness of the image (Strehl ratio 0.8, an r.m.s. error of $\\lambda/14$). Specifications in terms of fringes — power and irregularity — are standardized in ISO 10110 part 5.

### How it is done today
In a **Fizeau interferometer** a reference flat sits in front of the test surface in a collimated laser beam, and a camera records the fringes. In **phase-shifting interferometry** the reference is moved by a piezo in steps of $\\lambda/8$ and four or five pictures are combined to give a height map to better than $\\lambda/100$ at every pixel, to a few nanometres. A lens or a prism is tested in a **Twyman–Green** interferometer, a Michelson with a collimated beam, and an aspheric surface with a null lens or a computer-generated hologram that cancels its expected error. Always remember that the reference is part of the measurement: a $\\lambda/20$ flat cannot certify a $\\lambda/50$ surface.

> [!key] One fringe is $\\lambda/2$ of surface height (λ of wavefront on a double pass). Read the bow of a fringe as a fraction of the fringe spacing to get the error as a fraction of $\\lambda/2$: half a spacing is "λ/4 flat".
`,
  ideas: [
    'Each fringe is a contour of the gap or the surface error; neighbouring contours differ by λ/2 of surface height.',
    'On a double pass (Fizeau, Twyman–Green) the wavefront error is twice the surface error at normal incidence, 2h cos θ at angle θ.',
    'Straight equally spaced fringes mean flat; a fringe bowed by b over spacing s means an error of (b/s)·λ/2.',
    'Concentric rings show power (curvature): N = D²/(4Rλ) fringes; ellipses show astigmatism; a sharp bend at the rim shows a turned edge.',
    'Phase-shifting interferometry turns fringes into a height map good to a few nanometres; the reference flat sets the limit.'
  ],
  pitfalls: [
    'One fringe is a surface error of a whole wavelength — In a reflection test one fringe is λ/2 of surface height (it is λ of wavefront because the light goes there and back).',
    'More fringes mean a worse surface — Tilt adds straight fringes to any surface. It is the bending of the fringes, not their number, that measures the error.',
    '"Flat to λ/4" is the same wavelength for everyone — The wavelength used for testing must be stated; λ/4 at 633 nm is 158 nm, at 546 nm it is 137 nm. Drawings generally name it.',
    'The interferometer measures the surface alone — It measures the reference too, the mounting stress, air turbulence, and (for a lens) every surface and the glass; the number is only as good as the reference.'
  ],
  terms: [
    { term: 'Test plate', also: ['reference flat', 'Newton gauge'], def: 'A reference surface, flat or of a known radius, polished to a small fraction of a wavelength and laid on the surface to be tested; the fringes in the air gap between them map the difference in shape.' },
    { term: 'Surface figure', also: ['surface form', 'form error'], def: 'The deviation of a surface from its ideal shape on the scale of its whole aperture (as opposed to roughness and scratches), usually given as peak-to-valley or r.m.s. in waves or nanometres.' },
    { term: 'Power and irregularity', def: 'The two parts of a surface-form error read from fringes: power is the spherical deviation (the number of rings), irregularity is the remaining departure from a sphere (the bending of the rings), both in fringes.' },
    { term: 'Fizeau interferometer', def: 'An interferometer in which a reference flat in front of the test surface reflects part of a collimated laser beam back to meet the beam from the test surface; the standard instrument for testing flats, windows and spheres.' },
    { term: 'Twyman–Green interferometer', def: 'A Michelson interferometer used with a collimated beam to test lenses, prisms and mirrors; the test element sits in one arm and its aberrations appear as the shape of the fringes.' },
    { term: 'Phase-shifting interferometry', also: ['PSI'], def: 'Recording several interferograms while the reference phase is stepped by a fraction of a wave, and computing the phase at every pixel; gives a height map to a fraction of a nanometre in repeatability.' },
    { term: 'Peak-to-valley and r.m.s.', also: ['PV', 'rms'], def: 'Two summaries of a surface or wavefront error: PV is the difference between the highest and lowest points; r.m.s. is the root-mean-square deviation from the mean, usually about a quarter to a fifth of PV for polished optics.' }
  ],
  formulas: [
    {
      name: 'Surface error from the bow of a fringe',
      expr: 'h = s*lambda/2', tex: 'h = s\\,\\frac{\\lambda}{2}',
      vars: {
        h: { name: 'surface error', q: 'length', unit: 'nm' },
        s: { name: 'bow of a fringe as a fraction of the fringe spacing', value: 0.25, min: 0 },
        lambda: { name: 'wavelength of the test light', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'Reflection test, normal incidence. s = 0.5 is "λ/4".',
      stories: { h: 'In a test with {lambda} light a fringe bows by {s} of the fringe spacing. What is the surface error?' }
    },
    {
      name: 'Wavefront error of a reflecting surface',
      expr: 'W = 2*h*cos(theta)', tex: 'W = 2\\,h\\cos\\theta',
      vars: {
        W: { name: 'wavefront error', q: 'length', unit: 'nm' },
        h: { name: 'surface error', q: 'length', unit: 'nm', value: 79 },
        theta: { name: 'angle of incidence', q: 'angle', unit: '°', value: 0, min: 0, max: 89, tex: '\\theta' }
      },
      note: 'The reflected wavefront has twice the surface error at normal incidence; less at an angle.',
      stories: { W: 'A mirror with a surface error of {h} is used at {theta} incidence. What wavefront error does it give?' }
    },
    {
      name: 'Rings of power for a spherical error',
      expr: 'N = D^2/(4*R*lambda)', tex: 'N = \\frac{D^2}{4\\,R\\,\\lambda}',
      vars: {
        N: { name: 'number of ring fringes' },
        D: { name: 'diameter of the surface', q: 'length', unit: 'mm', value: 25 },
        R: { name: 'radius of curvature of the surface', q: 'length', unit: 'm', value: 10 },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'Against a flat reference, in reflection; the sag D²/8R divided by λ/2.',
      stories: { N: 'A {D} wide window is slightly curved, with a radius of {R}. How many ring fringes does it show against a flat in {lambda} light?', R: 'A flat is laid on a {D} surface; {lambda} light shows {N} rings. What is its radius of curvature?' }
    },
    {
      name: 'Strehl ratio from the r.m.s. wavefront error',
      expr: 'S = exp(-(2*pi*w/lambda)^2)', tex: 'S = e^{-(2\\pi w/\\lambda)^2}',
      vars: {
        S: { name: 'Strehl ratio' },
        w: { name: 'r.m.s. wavefront error', q: 'length', unit: 'nm', value: 45, tex: 'w' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 632.8, tex: '\\lambda' }
      },
      note: 'Maréchal\'s approximation, good for S above about 0.5; w = λ/14 gives S = 0.82.',
      stories: { S: 'A wavefront has an r.m.s. error of {w} at {lambda}. What is the Strehl ratio?' }
    }
  ],
  examples: [
    {
      title: 'A fringe that bows a quarter',
      q: 'A mirror is tested against a flat reference with a helium–neon laser (632.8 nm). The fringes are straight and 8 mm apart, except that the middle one bows by 2 mm. What is the surface error? What wavefront error does the mirror cause when used at 45°?',
      steps: [
        { text: 'The bow is $s = 2/8 = 0.25$ of the fringe spacing:', tex: 'h = 0.25 \\times \\frac{632.8}{2} = 79\\ \\mathrm{nm} = \\frac{\\lambda}{8}' },
        { text: 'At 45° the reflected wavefront carries', tex: 'W = 2h\\cos 45° = 2 \\times 79 \\times 0.707 = 112\\ \\mathrm{nm} = 0.18\\,\\lambda' }
      ],
      a: 'A λ/8 surface: 79 nm peak-to-valley. As a 45° fold mirror it distorts the wavefront by 112 nm (0.18 λ), just inside the quarter-wave criterion.'
    },
    {
      title: 'Counting rings',
      q: 'A 25 mm diameter window laid on a flat shows 24.7 ring fringes in 632.8 nm light. Estimate the radius of curvature of the window\'s surface. How far does the edge fall below the centre?',
      steps: [
        { text: 'Solve $N = D^2/(4R\\lambda)$ for $R$:', tex: 'R = \\frac{D^2}{4N\\lambda} = \\frac{(0.025)^2}{4 \\times 24.7 \\times 632.8\\times10^{-9}} = 10.0\\ \\mathrm{m}' },
        { text: 'The sag over the aperture is $N$ half-wavelengths:', tex: '\\mathrm{sag} = 24.7 \\times 316.4\\ \\mathrm{nm} = 7.8\\ \\mu\\mathrm{m}' }
      ],
      a: 'R is about 10 m — an almost flat surface, but 25 fringes of power, 7.8 µm of sag. It would be hopeless as a mirror and fine as a weak lens; it is the fringes, not the eye, that reveal it.'
    }
  ],
  quiz: [
    { q: 'In a reflection test with 633 nm light, a fringe bows by exactly half the fringe spacing. The surface error is about…', choices: ['79 nm', '158 nm', '316 nm', '633 nm'], a: 1, why: '$h = (b/s)\\,\\lambda/2 = 0.5 \\times 316$ nm $= 158$ nm — "flat to λ/4".' },
    { q: 'A perfectly flat surface laid on a slightly tilted flat reference shows straight, equally spaced fringes; tilt only changes how many there are.', a: true, why: 'Tilt makes the gap vary linearly, so the contours are straight and evenly spaced. Bending of the fringes is what reveals error.' },
    { q: 'A window of 50 mm diameter is flat except for a sag of 1.58 µm across its aperture. In 632.8 nm light against a flat, how many ring fringes does it show?', answer: 5, why: '$N = \\mathrm{sag}/(\\lambda/2) = 1580/316.4 = 5.0$.' },
    { q: 'Why can a λ/20 reference flat not be used to certify a λ/50 surface?', choices: ['The reference\'s own error is larger than the error to be measured, and adds into the result', 'The fringes would be too dim', 'The wavelength is wrong', 'Flats cannot reflect enough light'], a: 0, why: 'The fringes show the difference between the test surface and the reference; the reference\'s error (up to 32 nm for λ/20) is superimposed on the 13 nm to be measured.' },
    { q: 'A fold mirror used at 45° has a surface error of 100 nm. The error it adds to the reflected wavefront is about…', choices: ['100 nm', '141 nm', '200 nm', '71 nm'], a: 1, why: '$W = 2h\\cos\\theta = 2 \\times 100 \\times 0.707 = 141$ nm.' }
  ],
  applications: [
    'Acceptance testing of windows, mirrors, prisms and flats, to the grade (λ/4, λ/10 …) written on the drawing.',
    'Polishing control: the optician tests, polishes the high zones, and tests again until the fringes are straight.',
    'Telescope mirrors and aspheres, tested in null configurations. The Hubble Space Telescope\'s primary mirror was polished to the wrong shape, by about two micrometres at the edge, because the null corrector used to test it had a lens 1.3 mm out of place; the test said "perfect".',
    'Semiconductor industry: flatness of wafers, photomask blanks and lithography optics, measured by phase-shifting interferometry.',
    'Checking the wringing and thermal behaviour of gauge blocks, and the parallelism of windows.'
  ],
  history: 'Opticians have tested glass surfaces with contact glasses and their coloured fringes since the 19th century. Fizeau used the fringes between a reference plate and a surface in the 1860s, and the modern Fizeau interferometer descends from that arrangement; Frank Twyman and Arthur Green patented the Twyman–Green interferometer in 1916 for testing lenses and prisms. Phase-shifting interferometry, demonstrated at Bell Laboratories in 1974 by Bruning and colleagues, turned the fringe picture into a measurement and made the test an automatic one.',
  sources: [
    'D. Malacara (ed.), *Optical Shop Testing* (Wiley) — the Fizeau and Twyman–Green interferometers, phase-shifting interferometry.',
    'ISO 10110-5, *Optics and photonics — Preparation of drawings for optical elements and systems — Part 5: Surface form tolerances*.',
    'P. Hariharan, *Optical Interferometry* (Academic Press) — interferometric testing of optical surfaces.'
  ],
  sim: 'in-fringe-test'
},

/* ================================================================ speckle */
{
  id: 'speckle', parent: 'interference', title: 'Speckle', level: 2,
  short: 'Laser light scattered from a rough surface — paper, a wall, skin — looks grainy: a random pattern of bright and dark points that glitters as you move your head. It is interference among the waves from many scatterers with random phases. Its grains are about as big as the diffraction spot of the lens or eye that sees it; it limits laser projectors and imaging, and is a tool for measuring motion.',
  keywords: ['speckle', 'laser speckle', 'speckle pattern', 'speckle contrast', 'speckle size', 'rough surface', 'random phase', 'speckle interferometry', 'ESPI', 'laser speckle contrast imaging', 'objective speckle', 'subjective speckle', 'speckle reduction', 'grain', 'granularity'],
  prereq: ['coherence', 'constructive-and-destructive-interference'],
  related: ['what-makes-laser-light-special', 'the-airy-disk', 'diffusers-and-ground-glass', 'laser-projection-and-displays', 'holography', 'optical-coherence-tomography', 'laser-safety-classes'],
  body: `
Point a laser pointer at a wall and look at the spot: it is not a smooth disc but a sparkling, granular patch of bright and dark points that shimmer when you move your head. The same light from a lamp would look smooth. This is **speckle**, and it is the interference of thousands of waves that are each perfectly well behaved but have random phases.

### Where it comes from
Paper, paint, plaster and skin are rough on the scale of a wavelength: their heights vary by more than a fraction of a micrometre. Laser light scattered from the different points of such a surface has a random phase from each point. At a point in space the field is the sum of the contributions of every scatterer within the area the lens or eye resolves: a random walk of phasors, sometimes long (bright), often short, sometimes zero.

### Statistics
For **fully developed speckle** the intensity at any point follows a negative exponential: the probability density of intensity $I$ with mean $\\langle I\\rangle$ is $\\exp(-I/\\langle I\\rangle)/\\langle I\\rangle$. Consequences:

- the most likely intensity is **zero**: about 10 % of the pattern is darker than a tenth of the mean, and about 1 % darker than a hundredth;
- 37 % of the area is brighter than the mean;
- the standard deviation equals the mean, so the **speckle contrast** $C = \\sigma_I/\\langle I\\rangle = 1$: 100 % contrast, however little the surface itself varies.

### How big are the grains?
Speckle is not a feature of the surface but an interference at the detector, so its grain is set by the aperture that looks: about the radius of the Airy disc of the imaging lens, $d \\approx 1.22\\,\\lambda\\,(1+m)\\,N$ for magnification $m$ and f-number $N$. For an f/8 lens at 550 nm and small $m$ that is 5.4 µm; for the eye, with a 3 mm pupil and 650 nm light, the grain is $1.22\\lambda/D = 0.26$ mrad — about 0.9 arcminutes. In free space, a spot of diameter $D$ at distance $z$ gives grains of about $\\lambda z/D$. A smaller aperture (a higher f-number) makes coarser grains, so a camera and the eye see different speckle.

### A nuisance, and a tool
Speckle puts coarse noise on every image made with laser light: laser projectors (the eye notices a contrast of a few per cent), laser microscopy, lidar, optical coherence tomography, holography and ultrasound. The cure is to average $M$ independent patterns, which lowers the contrast to $C = 1/\\sqrt M$: a moving diffuser, two polarizations, several wavelengths or angles, or a source of larger bandwidth. Reaching 4 % takes $M = 625$.

The same randomness is useful. The pattern changes when the surface moves, so **speckle interferometry** (ESPI) compares patterns before and after a load and shows the displacement as fringes of $\\lambda/2$ each; **laser speckle contrast imaging** maps blood flow, since moving cells blur the pattern during the exposure and lower its contrast; and **astronomical speckle interferometry** freezes the atmosphere's speckles in short exposures and recovers detail at the telescope's diffraction limit.

> [!warn] To watch speckle, use only a Class 1 or 2 laser pointer (under 1 mW) on a matt wall. Never look into a laser beam or at a mirror-like reflection of it, and never use a stronger laser for this. See [[laser-safety-classes]].

> [!key] Speckle is random interference from a rough surface: fully developed speckle has a contrast of 1, grains as big as the Airy disc of the lens or eye, and averaging $M$ independent patterns reduces its contrast to $1/\\sqrt M$.
`,
  ideas: [
    'Speckle is the interference of waves scattered with random phases from the points of a rough surface.',
    'Fully developed speckle has an exponential intensity distribution: the most likely value is zero and the contrast σ/⟨I⟩ is 1.',
    'The grain size is set by the aperture that looks: about 1.22 λ(1 + m)N for a lens, 1.22 λ/D in angle for the eye.',
    'Averaging M independent patterns reduces the contrast to 1/√M — the aim of speckle-reduction in laser displays.',
    'Speckle also carries information: it moves and changes with the surface, which is used to measure displacement, vibration and blood flow.'
  ],
  pitfalls: [
    'Speckle is a property of the laser — It needs a coherent source and a rough surface; the same laser on a mirror gives no speckle, and a lamp on paper gives none.',
    'Speckle is a pattern printed on the surface — It exists only at the detector: it depends on the aperture of the lens or eye, and it moves and changes when you move your head.',
    'A better camera removes speckle — A larger aperture only makes the grains finer; the contrast stays 1. Only averaging independent patterns lowers it.',
    'Stopping down always sharpens laser images — It makes speckle grains coarser, so the image looks noisier, on top of the diffraction blur.'
  ],
  terms: [
    { term: 'Speckle', also: ['laser speckle', 'speckle pattern'], def: 'The grainy random pattern of bright and dark points seen when coherent light is scattered by a rough surface or a diffuser, produced by interference among the scattered waves.' },
    { term: 'Speckle contrast', also: ['C', 'σ/⟨I⟩'], def: 'The standard deviation of the intensity divided by its mean. Fully developed speckle has a contrast of 1 (100 %); averaging M independent patterns reduces it to 1/√M.' },
    { term: 'Speckle size', also: ['grain size'], def: 'The average width of a bright or dark grain, about the radius of the Airy disc of the aperture that looks: 1.22 λ(1 + m)N for a lens, 1.22 λz/D in free space.' },
    { term: 'Objective and subjective speckle', def: 'Objective speckle is the pattern in space without any lens, with grains of about λz/D; subjective speckle is what an imaging lens or the eye sees, with grains set by its own aperture.' },
    { term: 'Speckle interferometry', also: ['ESPI', 'DSPI'], def: 'Techniques that compare speckle patterns before and after a change, or against a reference, to measure displacement, deformation or atmospheric blur; in ESPI each fringe is λ/2 of motion.' }
  ],
  formulas: [
    {
      name: 'Speckle size in an image',
      expr: 'd = 1.22*lambda*(1 + m)*N', tex: 'd = 1.22\\,\\lambda\\,(1 + m)\\,N',
      vars: {
        d: { name: 'speckle size on the sensor', q: 'length', unit: 'µm' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 550, tex: '\\lambda' },
        m: { name: 'magnification', value: 0.1, min: 0 },
        N: { name: 'f-number', value: 8, min: 0.5, max: 64 }
      },
      note: 'About the radius of the Airy disc; definitions of "size" differ by a factor of about 1.',
      stories: { d: 'A lens at f/{N} images a laser-lit surface at a magnification of {m}, with {lambda} light. How large are the speckle grains on the sensor?' }
    },
    {
      name: 'Speckle size in free space',
      expr: 'ds = lambda*z/D', tex: 'd_s \\approx \\frac{\\lambda\\,z}{D}',
      vars: {
        ds: { name: 'grain size', q: 'length', unit: 'mm', tex: 'd_s' },
        lambda: { name: 'wavelength', q: 'length', unit: 'nm', value: 633, tex: '\\lambda' },
        z: { name: 'distance from the illuminated spot', q: 'length', unit: 'm', value: 1 },
        D: { name: 'diameter of the illuminated spot', q: 'length', unit: 'mm', value: 1 }
      },
      stories: { ds: 'A {D} laser spot on a rough wall is viewed from {z} without any lens; the light is {lambda}. How big are the grains of speckle?' }
    },
    {
      name: 'Contrast after averaging',
      expr: 'C = 1/sqrt(M)', tex: 'C = \\frac{1}{\\sqrt{M}}',
      vars: {
        C: { name: 'speckle contrast', q: 'ratio', unit: '%' },
        M: { name: 'number of independent patterns averaged', value: 25, min: 1, int: true }
      },
      note: 'Independent patterns of equal strength, fully developed speckle.',
      stories: { C: 'A laser display averages {M} independent speckle patterns during one frame. What is the speckle contrast?', M: 'A projector must bring the speckle contrast down to {C}. How many independent patterns must be averaged?' }
    }
  ],
  examples: [
    {
      title: 'The speckle the eye sees',
      q: 'A laser pointer (650 nm) lights a wall and is viewed with a 3 mm pupil. How large are the grains in angle, and how large on the retina (focal length 17 mm)?',
      steps: [
        { text: 'The grain is about the Airy radius of the pupil:', tex: '\\theta = 1.22\\,\\frac{\\lambda}{D} = 1.22 \\times \\frac{650\\times10^{-9}}{3\\times10^{-3}} = 2.6\\times10^{-4}\\ \\mathrm{rad} = 0.91\\ \\text{arcminute}' },
        { text: 'On the retina:', tex: 'd = f\\,\\theta = 17\\ \\mathrm{mm} \\times 2.6\\times10^{-4} = 4.5\\ \\mu\\mathrm{m}' }
      ],
      a: 'About 0.9 arcminute, 4.5 µm on the retina — a few cone widths in the fovea, so the grains are just resolved. Because they are fixed by the eye\'s own pupil, a person with a smaller pupil sees coarser speckle.'
    },
    {
      title: 'How many patterns for an invisible speckle?',
      q: 'A laser projector must reduce speckle contrast from 100 % to 4 %. How many independent patterns must be averaged during the eye\'s integration time?',
      steps: [
        { text: 'From $C = 1/\\sqrt M$:', tex: 'M = \\left(\\frac{1}{C}\\right)^2 = \\left(\\frac{1}{0.04}\\right)^2 = 625' }
      ],
      a: '625 independent patterns — which is why laser displays use moving diffusers and several lasers or wide-linewidth sources at once, and why reducing speckle is harder than reducing the noise of a lamp-lit display.'
    }
  ],
  quiz: [
    { q: 'Speckle is caused by…', choices: ['coherent light scattered by a rough surface, the scattered waves interfering with random phases', 'dust on the lens', 'diffraction at the edge of the laser beam', 'the colour of the laser'], a: 0, why: 'A rough surface gives random phases to the scattered waves; with coherent light their sum varies randomly from point to point.' },
    { q: 'In fully developed speckle, what fraction of the picture is darker than 10 % of the mean intensity?', choices: ['about 10 %', 'about 1 %', 'about 37 %', 'about 50 %'], a: 0, why: 'With the exponential distribution the probability of $I < 0.1\\langle I\\rangle$ is $1 - e^{-0.1} = 9.5$ %. The most likely intensity is zero.' },
    { q: 'Closing the aperture of the imaging lens (a higher f-number) makes speckle grains coarser.', a: true, why: 'The grain is about the Airy radius of the aperture, $1.22\\lambda(1+m)N$, which grows in proportion to the f-number.' },
    { q: 'How many independent fully developed speckle patterns must be averaged to reduce the contrast from 1 to 0.1?', answer: 100, why: '$C = 1/\\sqrt M = 0.1 \\Rightarrow M = 100$.' },
    { q: 'How does laser speckle contrast imaging map blood flow?', choices: ['Moving red cells blur the speckle during the exposure, lowering its contrast', 'The laser colour changes with flow', 'Haemoglobin fluoresces', 'The flow absorbs the laser light'], a: 0, why: 'Where the scatterers move, the speckle pattern fluctuates within the exposure time and the camera records a smeared, lower-contrast pattern; the contrast is a map of speed.' }
  ],
  applications: [
    'Laser projectors and displays: speckle reduction is a main design issue (moving diffusers, multiple lasers, wide-linewidth sources).',
    'Coherent imaging noise: optical coherence tomography, lidar, digital holography and ultrasound all show speckle, which hides fine detail.',
    'Laser speckle contrast imaging maps blood flow in skin, retina and brain without any contrast agent.',
    'Electronic speckle pattern interferometry (ESPI) shows the deformation and vibration modes of machine parts and aircraft panels as fringes.',
    'Astronomical speckle interferometry resolves close binary stars and the discs of the largest stars at the diffraction limit of ground telescopes.'
  ],
  history: 'Speckle was seen as soon as lasers existed: J. D. Rigden and E. I. Gordon at Bell Laboratories described the "granularity of scattered optical maser light" in 1962, and B. M. Oliver gave the first statistical account of "sparkling spots" in 1963. In 1970 Antoine Labeyrie showed that Fourier analysis of the speckles in short exposures of a star recovers diffraction-limited information, creating speckle interferometry in astronomy.',
  sources: [
    'J. W. Goodman, *Speckle Phenomena in Optics: Theory and Applications* (Roberts & Company) — statistics, size and reduction.',
    'J. C. Dainty (ed.), *Laser Speckle and Related Phenomena* (Springer) — the standard collection of chapters on speckle and its uses.',
    'J. W. Goodman, "Some fundamental properties of speckle", *Journal of the Optical Society of America* 66 (1976).'
  ],
  sim: 'in-speckle'
}

);
