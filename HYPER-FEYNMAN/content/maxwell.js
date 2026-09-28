/* HYPER-FEYNMAN · content/maxwell.js — Maxwell's equations and their consequences (topic maxwell-topic):
 * the four laws as flux and circulation, waves that carry themselves, retarded fields, field energy and
 * momentum, Feynman's disk paradox, electromagnetic mass, charges in fields, waveguides and AC circuits.
 * Simulations are in sims/maxwell.js (ids max-…). */
Hyper.add(

{
  id: 'maxwell-equations-feyn', parent: 'maxwell-topic', title: 'Maxwell\'s equations', level: 2,
  short: 'Four laws for two fields — two about flux through closed surfaces, two about circulation round loops — plus the force on a charge: the whole of classical electricity, magnetism and light.',
  keywords: ['Maxwell equations', 'Gauss law', 'Faraday law', 'Ampère–Maxwell law', 'displacement current', 'flux', 'circulation', 'divergence', 'curl', 'magnetic monopole', 'charge conservation', 'Lorentz force'],
  prereq: ['gauss-law-feyn', 'induction-laws', 'magnetostatics-feyn', 'vector-calculus-fields'],
  related: ['em-waves-feyn', 'field-energy-momentum', 'least-action-fields', 'relativity-of-fields', 'physics:maxwells-equations', 'math:divergence', 'math:curl', 'math:stokes-theorem'],
  body: `
Feynman introduced electromagnetism the way a naturalist describes a new animal: first what it does, in words, then the precise laws. Everything electric and magnetic — the spark, the compass, the radio, the colour of the sky — follows from four equations for two [[?field|fields]], the electric field $\\mathbf{E}$ and the magnetic field $\\mathbf{B}$, plus one rule for the force they exert on a charge, $\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v}\\times\\mathbf{B})$.

### Two ideas: flux and circulation
Each law uses one of two ways of looking at a field. Picture the field as the velocity of an imaginary fluid.
- The **[[?flux]]** out of a closed surface is the net amount "flowing out": add up the outward component of the field over every bit of the surface, $\\oint \\mathbf{E}\\cdot d\\mathbf{A}$.
- The **circulation** round a closed loop is how much the field "goes round": walk the loop and add up the component of the field along your path, a [[?closed-integral|closed line integral]] $\\oint \\mathbf{E}\\cdot d\\mathbf{s}$.

Shrink the surface or the loop to a point and the flux per unit volume becomes the [[?divergence]] $\\nabla\\cdot\\mathbf{E}$, the circulation per unit area the [[?curl]] $\\nabla\\times\\mathbf{E}$. [[?gauss-theorem|Gauss's theorem]] and [[?stokes-theorem|Stokes' theorem]] turn one form into the other, so each law can be stated for big boxes and loops or at a single point.

### The four laws
| | In words | At a point |
|---|---|---|
| I | The flux of E out of any closed surface is the charge inside divided by $\\varepsilon_0$ | $\\nabla\\cdot\\mathbf{E} = \\rho/\\varepsilon_0$ |
| II | The circulation of E round a loop is minus the rate of change of the flux of B through it | $\\nabla\\times\\mathbf{E} = -\\partial\\mathbf{B}/\\partial t$ |
| III | The flux of B out of any closed surface is zero | $\\nabla\\cdot\\mathbf{B} = 0$ |
| IV | $c^2$ times the circulation of B round a loop is the current through it over $\\varepsilon_0$, plus the rate of change of the flux of E through it | $c^2\\,\\nabla\\times\\mathbf{B} = \\mathbf{j}/\\varepsilon_0 + \\partial\\mathbf{E}/\\partial t$ |

Feynman wrote the fourth law with $c^2$ where engineering books write $1/\\mu_0\\varepsilon_0$ — the same number, since $\\mu_0\\varepsilon_0 = 1/c^2$ — so that the speed of light sits in the equations from the start. The symbol $\\partial/\\partial t$ is a [[?partial-derivative]]: the rate of change at one fixed place.

In the first simulation, drag charges in and out of a box: the field lines leaving it minus those entering always count the charge inside, wherever it sits. Switch to currents and the count for B is always zero — its lines close on themselves (law III: there are no magnetic charges). The second simulation shows laws II and IV: a changing magnetic flux drives a circulating electric field, even in empty space, and a current or a changing electric flux drives a circulating magnetic field.

### Maxwell's term
Before 1861 the fourth law had only the current. Maxwell saw that it could not be complete. Take a capacitor being charged: a current $I$ flows in the wire, but none crosses the gap between the plates. Circle the wire with a loop and stretch a soap film across it. If the film cuts the wire, a current $I$ goes through it; if it bulges out between the plates, no current does — yet the circulation of B round the same loop cannot have two values. The term $\\partial\\mathbf{E}/\\partial t$ rescues the law: between the plates the electric field is growing, and its flux grows at exactly $I/\\varepsilon_0$. With it the equations also agree with conservation of charge (see the derivation), and — as the next page shows — they predict light.

The magnetic field made by this "displacement current" is small in the laboratory. A current of 1 A charging plates 10 cm in radius makes the field between them grow by $3.6\\times10^{12}$ V/m every second, yet the magnetic field at their rim is only 2 µT, a twenty-fifth of the Earth's. Maxwell found the term by reasoning, not by measurement.

> [!key] Four laws — two about flux, two about circulation — and the force law are the whole of classical electromagnetism. Changing magnetic fields make circulating electric fields, and changing electric fields make circulating magnetic fields: that mutual making is what lets light exist.
`,
  ideas: [
    'Two laws are about flux through closed surfaces: the flux of E counts the charge inside; the flux of B is always zero.',
    'Two laws are about circulation round loops: a changing B drives a circulating E; currents and a changing E drive a circulating B.',
    'Divergence and curl are flux per unit volume and circulation per unit area; the theorems of Gauss and Stokes switch between the two forms.',
    'Maxwell\'s term ∂E/∂t makes the equations agree with conservation of charge and predicts electromagnetic waves.',
    'With the force law F = q(E + v × B), the four equations contain all of classical electromagnetism.'
  ],
  pitfalls: [
    'A closed surface with no charge inside has no field passing through it — Field lines may pass right through; the net flux is zero because as much goes in as comes out.',
    'A changing magnetic field drives a current only where there is a wire — The circulating electric field exists in empty space as well; a wire merely lets charges follow it round.',
    'The displacement current is charge flowing across the gap of a capacitor — No charge crosses the gap. The changing electric field there enters the fourth law exactly as a current would.'
  ],
  derivation: {
    title: 'Conservation of charge is built into the equations',
    steps: [
      { text: 'Take the divergence of both sides of the fourth law.', tex: 'c^2\\,\\nabla\\cdot(\\nabla\\times\\mathbf{B}) = \\frac{\\nabla\\cdot\\mathbf{j}}{\\varepsilon_0} + \\frac{\\partial}{\\partial t}(\\nabla\\cdot\\mathbf{E})' },
      { text: 'The divergence of any curl is zero: a field that only circulates has no sources or sinks. So the left side vanishes.', tex: '\\nabla\\cdot(\\nabla\\times\\mathbf{B}) = 0' },
      { text: 'Replace ∇·E by ρ/ε₀ using the first law, and multiply through by ε₀.', tex: '0 = \\nabla\\cdot\\mathbf{j} + \\frac{\\partial \\rho}{\\partial t}' },
      { text: 'This is the equation of continuity: the charge flowing out of a small box per second (∇·j) is exactly the charge the box loses. Without Maxwell\'s term the fourth law would force ∇·j = 0 everywhere — charge could never pile up, and no capacitor could ever be charged.', tex: '\\nabla\\cdot\\mathbf{j} = -\\frac{\\partial \\rho}{\\partial t}' }
    ]
  },
  formulas: [
    {
      name: 'Gauss\'s law: the flux out of a closed surface',
      expr: 'PhiE = Q/eps0', tex: '\\Phi_E = \\dfrac{Q}{\\varepsilon_0}',
      vars: {
        PhiE: { name: 'flux of E out of the closed surface', q: 'eflux', unit: 'V·m', signed: true, tex: '\\Phi_E' },
        Q: { name: 'charge enclosed', q: 'charge', unit: 'nC', value: 1, signed: true },
        eps0: { const: 'eps0' }
      },
      note: 'Any closed surface of any shape; charges outside it add nothing to the net flux.',
      stories: {
        PhiE: 'A closed box surrounds a charge of {Q}. What is the flux of E out of it?',
        Q: 'The flux of E out of a closed surface is {PhiE}. How much charge is inside?'
      }
    },
    {
      name: 'Faraday\'s law for a coil',
      expr: 'emf = N*A*dBdt', tex: '\\mathcal{E} = N A\\,\\dot{B}',
      vars: {
        emf: { name: 'EMF (circulation of E round the coil)', q: 'voltage', unit: 'V', tex: '\\mathcal{E}' },
        N: { name: 'number of turns', int: true, value: 100 },
        A: { name: 'area of each turn', q: 'area', unit: 'cm²', value: 100 },
        dBdt: { name: 'rate of change of B', unit: 'T/s', value: 0.5, tex: '\\dot{B}' }
      },
      note: 'Size only: by Lenz\'s rule the induced current opposes the change. B uniform and perpendicular to the turns.',
      stories: {
        emf: 'A coil of {N} turns, each of area {A}, sits in a field that changes at {dBdt}. What EMF appears?',
        dBdt: 'A coil of {N} turns of area {A} gives an EMF of {emf}. How fast is the field changing?'
      }
    },
    {
      name: 'Maxwell\'s displacement current',
      expr: 'Id = eps0*A*dEdt', tex: 'I_d = \\varepsilon_0 A\\,\\dot{E}',
      vars: {
        Id: { name: 'displacement current', q: 'current', unit: 'A', tex: 'I_d' },
        eps0: { const: 'eps0' },
        A: { name: 'area of the plates', q: 'area', unit: 'm²', value: 0.0314 },
        dEdt: { name: 'rate of change of E between the plates', unit: 'V/(m·s)', value: 3.6e12, tex: '\\dot{E}' }
      },
      note: 'For a uniform field between parallel plates; it equals the current flowing in the wires.',
      stories: {
        Id: 'The field between plates of area {A} grows at {dEdt}. What is the displacement current?',
        dEdt: 'A capacitor with plates of area {A} is charged by {Id}. How fast does the field between them grow?'
      }
    },
    {
      name: 'The magnetic field circling a current',
      expr: 'B = mu0*I/(2*pi*r)', tex: 'B = \\dfrac{\\mu_0 I}{2\\pi r}',
      vars: {
        B: { name: 'magnetic field at distance r', q: 'bfield', unit: 'µT' },
        mu0: { const: 'mu0' },
        I: { name: 'current through the circle (conduction plus displacement)', q: 'current', unit: 'A', value: 1 },
        r: { name: 'radius of the circle', q: 'length', unit: 'cm', value: 10 }
      },
      note: 'Law IV round a circle with the current along its axis, by symmetry. Between the plates of a charging capacitor, I is the displacement current passing inside the circle.',
      stories: {
        B: 'A current of {I} flows along the axis of a circle of radius {r}. What is B on the circle?',
        r: 'How far from a wire carrying {I} is the magnetic field {B}?'
      }
    }
  ],
  examples: [
    {
      title: 'The magnetic field inside a charging capacitor',
      q: 'Circular plates 10 cm in radius are charged by a steady current of 1 A. How fast does the field between them grow, and what is B at 5 cm and at 10 cm from the axis, midway between the plates? Ignore the fringes.',
      steps: [
        'The field between the plates is $E = Q/(\\varepsilon_0 \\pi a^2)$, so $\\dot E = I/(\\varepsilon_0\\pi a^2) = 1/(8.854\\times10^{-12}\\times 0.0314) = 3.6\\times10^{12}$ V/(m·s).',
        'Law IV round a circle of radius $r$ inside the gap: no current passes through it, but the flux of E through it grows at $\\pi r^2 \\dot E$. So $c^2 B\\cdot 2\\pi r = \\pi r^2 \\dot E$, which gives $B = r\\dot E/(2c^2)$.',
        'At $r = 5$ cm: $B = 0.05 \\times 3.6\\times10^{12}/(2\\times 8.99\\times10^{16}) = 1.0\\times10^{-6}$ T. At $r = 10$ cm: $2.0\\times10^{-6}$ T — exactly $\\mu_0 I/2\\pi r$, the field round the wire itself.'
      ],
      a: 'E grows at 3.6 × 10¹² V/(m·s); B is 1 µT at 5 cm and 2 µT at the rim.'
    },
    {
      title: 'An EMF from a changing field',
      q: 'A coil of 100 turns, each of area 100 cm², lies across a uniform field that falls at 0.5 T/s. What EMF appears across its ends?',
      steps: [
        'The flux through one turn changes at $A\\dot B = 0.01 \\times 0.5 = 5\\times10^{-3}$ Wb/s, so the circulation of E round one turn is 5 mV (law II).',
        'The 100 turns are in series, so their EMFs add: $100 \\times 5$ mV.'
      ],
      a: '0.5 V.'
    }
  ],
  quiz: [
    { q: 'A closed box contains +3 nC and −3 nC. The flux of E out of the box is…', choices: ['zero', '3 nC/ε₀', '6 nC/ε₀', 'impossible to say without knowing where the charges sit'], a: 0, why: 'Only the net charge inside counts: +3 − 3 = 0. Lines leave and enter the box, but the count balances wherever the charges are.' },
    { q: 'A closed surface surrounds only the north end of a long bar magnet (it cuts through the magnet\'s middle). The net flux of B out of it is zero.', a: true, why: 'Law III holds for every closed surface. The lines coming out near the pole go back in where the surface cuts the magnet: there are no isolated magnetic charges.' },
    { q: 'When nothing changes in time, the circulation of E round any loop is…', choices: ['zero', 'the charge inside the loop over ε₀', 'the current through the loop', 'always positive'], a: 0, why: 'With ∂B/∂t = 0, law II says ∇ × E = 0: static electric fields never circulate, which is why an electric potential can be defined.' },
    { q: 'Why did Maxwell add the term ∂E/∂t to the fourth law?', choices: ['to make it consistent with conservation of charge', 'because experiments of his day had measured its effect', 'to allow for magnetic charges', 'to make the law simpler'], a: 0, why: 'Without it the law gives two answers for the circulation of B round a charging capacitor\'s wire and forbids charge from piling up. Its magnetic effect was far too small to measure then.' },
    { q: 'A capacitor is being charged by a current of 2 A. What is the displacement current ε₀ dΦ_E/dt between its plates?', answer: 2, unit: 'A', why: 'Whatever flows onto the plate raises the flux of E between the plates at I/ε₀, so the displacement current equals the conduction current: 2 A.' }
  ],
  problems: [
    { q: 'A coil of 50 turns, each of area 20 cm², lies across a field that rises at 0.2 T/s. What EMF does it produce?', answer: 20, unit: 'mV', tol: 0.02, hint: 'EMF = N A dB/dt.',
      steps: ['One turn: $A\\dot B = 20\\times10^{-4} \\times 0.2 = 4\\times10^{-4}$ V.', 'Fifty turns in series: $50 \\times 0.4$ mV = 20 mV.'] },
    { q: 'A capacitor with circular plates 5 cm in radius is charged by a steady 0.5 A. What is the magnetic field at the edge of the plates, midway between them?', answer: 2, unit: 'µT', tol: 0.02, hint: 'All of the displacement current passes inside a circle at the rim.',
      steps: ['Law IV round the rim: the displacement current through the circle is the full 0.5 A.', '$B = \\mu_0 I/(2\\pi r) = 2\\times10^{-7}\\times 0.5/0.05 = 2\\times10^{-6}$ T.'] }
  ],
  applications: [
    'Transformers, generators and guitar pickups run on law II: a changing magnetic flux drives a circulating electric field.',
    'Induction hobs and wireless phone chargers use the same law across a gap of glass or air.',
    'Radio, radar and light all rest on laws II and IV together, each field\'s change making the other (see [[em-waves-feyn]]).',
    'Draw the fields of charges and currents yourself in [the field lines tool](#/tools/fields).'
  ],
  history: 'Coulomb published his law of electric force in 1785; Ørsted found in 1820 that a current deflects a compass, and Ampère worked out the forces between currents in the 1820s; Faraday discovered induction in 1831 and pictured it with lines of force. James Clerk Maxwell added the displacement current in "On Physical Lines of Force" (1861–62) and set out the complete theory in "A Dynamical Theory of the Electromagnetic Field" (1865). The four compact vector equations used today were distilled from his longer set by Oliver Heaviside and Heinrich Hertz in the 1880s.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 1 (Electromagnetism) — the laws stated in words with flux and circulation, and a long view of the importance of Maxwell\'s discovery.',
    'Vol. II, ch. 2 and 3 (Differential Calculus of Vector Fields; Vector Integral Calculus) — divergence, curl and the theorems of Gauss and Stokes.',
    'Vol. II, ch. 18 (The Maxwell Equations) — Maxwell\'s added term, the complete set of equations and a first travelling field.'
  ],
  sim: ['max-gauss-box', 'max-circulation']
},

{
  id: 'em-waves-feyn', parent: 'maxwell-topic', title: 'Electromagnetic waves in free space', level: 2,
  short: 'In empty space a changing magnetic field makes an electric field and a changing electric field makes a magnetic one. The pattern that keeps itself going travels at exactly c = 1/√(ε₀μ₀): light.',
  keywords: ['electromagnetic wave', 'light', 'speed of light', 'plane wave', 'wave equation', 'current sheet', 'E = cB', 'intensity', 'spectrum', 'radio', 'free space'],
  prereq: ['maxwell-equations-feyn', 'wave-equation-sound', 'math:wave-equation'],
  related: ['retarded-potentials', 'radiation-accelerated-charge', 'field-energy-momentum', 'waveguides-feyn', 'polarization-feyn', 'physics:electromagnetic-waves', 'physics:em-wave-energy'],
  body: `
Take Maxwell's equations in empty space — no charges, no currents — and something remarkable remains: a changing $\\mathbf{B}$ makes a circulating $\\mathbf{E}$, and a changing $\\mathbf{E}$ makes a circulating $\\mathbf{B}$. Each field's change keeps the other going. Feynman showed what this means with a thought experiment that the simulation lets you run.

### A sheet of charge set moving
Imagine an enormous flat sheet of charge. At $t = 0$ it is suddenly set moving along its own plane at a steady speed: a uniform surface current $K$ switches on. A magnetic field appears beside the sheet, parallel to it, and an electric field pointing against the current. But they do not appear everywhere at once. They fill a slab whose faces run outward from the sheet at some speed $v$; behind the faces the fields are uniform, ahead of them there is nothing at all.

Two of Maxwell's laws fix everything. Draw a thin rectangular loop that straddles one face. As the face sweeps across the loop, the flux of B through it grows by $Bv$ per second per metre of height, so law II demands a circulation of E: $E = vB$. Draw a loop at right angles; now the flux of E grows, and law IV demands $c^2B = vE$. Together:

$$v^2 = c^2, \\qquad E = cB$$

The front must travel at exactly $c$ — and here $c$ was only the constant $1/\\sqrt{\\varepsilon_0\\mu_0}$ measured in static experiments with charges and magnets. It comes out at $3.00\\times10^8$ m/s, the speed of light. Behind the front $E = K/(2\\varepsilon_0 c)$: a surface current of 1 A/m gives 188 V/m and 0.63 µT.

### Waves that carry themselves
Switch the current on and off, over and over, and the fronts become a train of waves. Any shape can be built from such steps, so every disturbance obeys the same [[?wave-equation]]:

$$\\frac{\\partial^2 E_y}{\\partial x^2} - \\frac{1}{c^2}\\frac{\\partial^2 E_y}{\\partial t^2} = 0$$

A sinusoidal solution $E_y = E_0\\cos(kx - \\omega t)$, with [[?angular-frequency|angular frequency]] $\\omega = ck$, has E and B in [[?phase]], at right angles to each other and to the direction of travel, with $E = cB$ everywhere and always. In the simulation, watch the two small loops riding on the wave: the circulation of E round one always equals minus the rate of change of the flux of B through it, and the circulation of B round the other matches the changing flux of E. The wave satisfies Maxwell's equations point by point with no charge anywhere near. Once made, it needs nothing else: light from a star that burnt out long ago still arrives.

### How big are the fields?
The energy flow of a wave with amplitude $E_0$ — its [[field-energy-momentum|intensity]] — is $I = E_0^2/(2\\mu_0 c)$, carried half by the electric field and half by the magnetic. Sunlight above the atmosphere, 1361 W/m², has $E_0 \\approx 1.0$ kV/m and $B_0 \\approx 3.4$ µT.

| Wave | Frequency | Wavelength |
|---|---|---|
| FM radio | 100 MHz | 3.0 m |
| Microwave oven | 2.45 GHz | 12 cm |
| Green light | 540 THz | 555 nm |
| X-rays | $10^{18}$ Hz | 0.3 nm |

All of them are the same thing; only $\\lambda = c/f$ differs.

> [!key] In empty space the two curl laws feed each other. The only speed at which such a self-sustaining pattern can travel is $c = 1/\\sqrt{\\varepsilon_0\\mu_0}$ — and light travels at exactly that speed.
`,
  ideas: [
    'In empty space the two curl laws feed each other: a changing B makes a circulating E, and a changing E a circulating B.',
    'A current sheet switched on sends out a front at exactly c = 1/√(ε₀μ₀), with E = cB behind it.',
    'In a plane wave E and B are in phase, perpendicular to each other and to the direction of travel, with E = cB.',
    'The energy of the wave is shared equally between its electric and magnetic fields; the intensity is E₀²/2μ₀c.',
    'Radio, microwaves, light and X-rays are the same waves; only the wavelength λ = c/f differs.'
  ],
  pitfalls: [
    'The magnetic field of light hardly matters, because B = E/c is tiny — In tesla it is small, but its energy density B²/2μ₀ equals the electric one ε₀E²/2 exactly.',
    'E and B in a light wave are a quarter-cycle apart, like the charge and current of an LC circuit — In a travelling wave they peak together at the same place and time; the feeding happens between neighbouring places, through the curls.',
    'An electromagnetic wave needs a medium to travel in — Maxwell\'s equations are satisfied by the fields alone in empty space; no experiment has ever found an ether.'
  ],
  derivation: {
    title: 'The wave equation from Maxwell\'s equations',
    steps: [
      { text: 'In empty space ρ = 0 and j = 0. Look for fields that depend only on x and t, with E along y and B along z.', tex: 'E_y(x, t), \\qquad B_z(x, t)' },
      { text: 'The z-component of law II (∇ × E = −∂B/∂t):', tex: '\\frac{\\partial E_y}{\\partial x} = -\\frac{\\partial B_z}{\\partial t}' },
      { text: 'The y-component of law IV with no current:', tex: '-c^2\\frac{\\partial B_z}{\\partial x} = \\frac{\\partial E_y}{\\partial t}' },
      { text: 'Differentiate the first with respect to x and the second with respect to t — each a partial derivative, holding the other variable fixed — and eliminate B.', tex: '\\frac{\\partial^2 E_y}{\\partial x^2} = -\\frac{\\partial^2 B_z}{\\partial x\\,\\partial t} = \\frac{1}{c^2}\\frac{\\partial^2 E_y}{\\partial t^2}' },
      { text: 'This is the wave equation: any shape f(x − ct) solves it, sliding along at speed c. For a cosine wave the first equation then gives B in phase with E and c times smaller.', tex: 'E_y = E_0\\cos(kx - \\omega t), \\qquad B_z = \\frac{E_0}{c}\\cos(kx - \\omega t)' }
    ]
  },
  formulas: [
    {
      name: 'Electric and magnetic fields in a wave',
      expr: 'E0 = c*B0', tex: 'E_0 = c B_0',
      vars: {
        E0: { name: 'electric field amplitude', q: 'efield', unit: 'V/m', tex: 'E_0' },
        c: { const: 'c' },
        B0: { name: 'magnetic field amplitude', q: 'bfield', unit: 'µT', value: 3.378, tex: 'B_0' }
      },
      note: 'At every point and instant of a plane wave in vacuum, not only at the peaks.',
      stories: { E0: 'The magnetic field of a light wave reaches {B0}. What is the peak electric field?', B0: 'A radio wave has an electric field of {E0}. What is its magnetic field?' }
    },
    {
      name: 'Wavelength and frequency',
      expr: 'lambda = c/f', tex: '\\lambda = \\dfrac{c}{f}',
      vars: {
        lambda: { name: 'wavelength', q: 'length', unit: 'm', tex: '\\lambda' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'MHz', value: 100 }
      },
      note: 'In vacuum (and very nearly in air).',
      stories: { lambda: 'What is the wavelength of a {f} wave?', f: 'What frequency has a wavelength of {lambda}?' }
    },
    {
      name: 'Intensity of a wave',
      expr: 'I = E0^2/(2*mu0*c)', tex: 'I = \\dfrac{E_0^2}{2\\mu_0 c}',
      vars: {
        I: { name: 'intensity (mean power per unit area)', q: 'intensity', unit: 'W/m²' },
        E0: { name: 'electric field amplitude', q: 'efield', unit: 'V/m', value: 1013, tex: 'E_0' },
        mu0: { const: 'mu0' },
        c: { const: 'c' }
      },
      note: 'Averaged over a cycle for a sinusoidal plane wave; half the energy is in E and half in B.',
      stories: { I: 'A wave has an electric field amplitude of {E0}. What intensity does it carry?', E0: 'Sunlight brings {I}. What is the amplitude of its electric field?' }
    },
    {
      name: 'The speed of the waves from the constants of electricity and magnetism',
      expr: 'v = 1/sqrt(eps0*mu0)', tex: 'v = \\dfrac{1}{\\sqrt{\\varepsilon_0\\mu_0}}',
      vars: {
        v: { name: 'speed of the waves', q: 'speed', unit: 'm/s' },
        eps0: { const: 'eps0' },
        mu0: { const: 'mu0' }
      },
      note: 'ε₀ comes from the force between charges, μ₀ from the force between currents; together they give the speed of light.',
      stories: { v: 'From the constants of electrostatics and magnetostatics, how fast should electromagnetic waves travel?' }
    }
  ],
  examples: [
    {
      title: 'The fields in sunlight',
      q: 'Sunlight above the atmosphere brings 1361 W/m². What are the amplitudes of its electric and magnetic fields?',
      steps: [
        '$E_0 = \\sqrt{2\\mu_0 c I} = \\sqrt{2 \\times 1.257\\times10^{-6} \\times 3.00\\times10^{8} \\times 1361} = \\sqrt{1.03\\times10^{6}} = 1.01\\times10^{3}$ V/m.',
        '$B_0 = E_0/c = 1013/(3.00\\times10^{8}) = 3.4\\times10^{-6}$ T — about a fifteenth of the Earth\'s field.',
        'Check the sharing of energy at a peak: $\\varepsilon_0E_0^2/2 = 4.5\\times10^{-6}$ J/m³ and $B_0^2/2\\mu_0 = 4.5\\times10^{-6}$ J/m³ — equal.'
      ],
      a: 'About 1.0 kV/m and 3.4 µT.'
    },
    {
      title: 'The speed of light from a capacitor and a coil',
      q: 'ε₀ = 8.854 × 10⁻¹² F/m can be measured with a capacitor and μ₀ = 1.2566 × 10⁻⁶ H/m with a coil. What speed of waves do they predict?',
      steps: [
        '$\\varepsilon_0\\mu_0 = 8.854\\times10^{-12} \\times 1.2566\\times10^{-6} = 1.1126\\times10^{-17}$ s²/m².',
        '$v = 1/\\sqrt{1.1126\\times10^{-17}} = 1/(3.3356\\times10^{-9}) = 2.998\\times10^{8}$ m/s.'
      ],
      a: '2.998 × 10⁸ m/s — the speed of light.'
    },
    {
      title: 'Sizing an FM antenna',
      q: 'A radio station broadcasts at 100 MHz. What is the wavelength, and how long is a quarter-wave whip antenna?',
      steps: ['$\\lambda = c/f = 3.00\\times10^{8}/10^{8} = 3.00$ m.', 'A quarter of that is 0.75 m.'],
      a: '3.0 m; the whip is about 75 cm long.'
    }
  ],
  quiz: [
    { q: 'In a plane electromagnetic wave in vacuum, E and B are…', choices: ['in phase, perpendicular to each other and to the direction of travel', 'a quarter-cycle apart and parallel to each other', 'in phase and both along the direction of travel', 'perpendicular to each other, with B much the larger in energy'], a: 0, why: 'The curl equations force E ⟂ B ⟂ direction of travel, with E = cB at every point: they rise and fall together.' },
    { q: 'Doubling the amplitude E₀ of a wave multiplies its intensity by…', choices: ['4', '2', '√2', '8'], a: 0, why: 'I = E₀²/2μ₀c depends on the square of the amplitude.' },
    { q: 'The magnetic field of sunlight carries much less energy than its electric field, because B = E/c is so small.', a: false, why: 'The energy densities are ε₀E²/2 and B²/2μ₀ = ε₀c²B²/2; with E = cB they are equal.' },
    { q: 'In the sheet experiment, what fixes the speed of the front?', choices: ['the two curl laws together: E = vB and c²B = vE', 'the speed at which the sheet is set moving', 'the amount of charge on the sheet', 'the medium around the sheet'], a: 0, why: 'Law II gives E = vB and law IV gives c²B = vE; both hold only if v = c, whatever the sheet does.' },
    { q: 'What is the wavelength of the 2.45 GHz microwaves in an oven (in air)?', answer: 0.1224, unit: 'm', why: 'λ = c/f = 3.00 × 10⁸ / 2.45 × 10⁹ = 0.122 m.' }
  ],
  problems: [
    { q: 'A 1 mW laser beam is spread evenly over 1 mm². What is the amplitude of its electric field?', answer: 868, unit: 'V/m', tol: 0.02, hint: 'Find the intensity first.',
      steps: ['$I = P/A = 10^{-3}/10^{-6} = 1000$ W/m².', '$E_0 = \\sqrt{2\\mu_0 c I} = \\sqrt{2 \\times 376.7 \\times 1000} = 868$ V/m.'] },
    { q: 'A huge sheet suddenly starts carrying a surface current of 5 A/m. What magnetic field appears behind the travelling front?', answer: 3.14, unit: 'µT', tol: 0.02, hint: 'B = μ₀K/2 on each side of a current sheet.',
      steps: ['$B = \\mu_0 K/2 = 1.2566\\times10^{-6}\\times 5/2 = 3.14\\times10^{-6}$ T.', 'The electric field behind the front is $cB = 942$ V/m, pointing against the current.'] }
  ],
  applications: [
    'Radio, television, mobile phones, Wi-Fi and GPS all send information on electromagnetic waves.',
    'Microwave ovens and radar use waves of a few centimetres.',
    'Optical fibres carry most of the world\'s data as light.',
    'Solar panels and plants run on the energy flowing in sunlight\'s fields.'
  ],
  history: 'In 1856 Wilhelm Weber and Rudolf Kohlrausch measured the ratio of the electrostatic and electromagnetic units of charge and found a speed of about 3.1 × 10⁸ m/s. Maxwell noticed in 1862 how close this was to the speed of light measured by Fizeau, and concluded that light is an electromagnetic disturbance. Heinrich Hertz made and detected electromagnetic waves in his laboratory in Karlsruhe in 1887–88, showing that they reflect, refract and travel at a finite speed like light.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 18 (The Maxwell Equations) — a sheet of charge suddenly set moving, the travelling field it sends out, and why its speed must be c.',
    'Vol. II, ch. 20 (Solutions of Maxwell\'s Equations in Free Space) — plane waves, the wave equation in three dimensions, and spherical waves.',
    'Vol. I, ch. 2 (Basic Physics) — the whole electromagnetic spectrum, from radio waves to gamma rays, as one phenomenon.'
  ],
  sim: 'max-plane-wave'
},

{
  id: 'retarded-potentials', parent: 'maxwell-topic', title: 'Fields from moving charges and currents', level: 3,
  short: 'The field here and now depends on where the charges were a time r/c ago. When a charge is jolted, the news spreads out at the speed of light as a kink in its field lines — and the kink is radiation.',
  keywords: ['retarded potential', 'retarded time', 'Liénard–Wiechert', 'moving charge', 'field lines', 'kink', 'radiation', 'Larmor formula', 'speed of light', 'causality', 'vector potential'],
  prereq: ['em-waves-feyn', 'vector-potential', 'radiation-accelerated-charge'],
  related: ['relativity-of-fields', 'synchrotron-radiation', 'electromagnetic-mass', 'field-energy-momentum', 'physics:electromagnetic-waves', 'electronics:antennas'],
  body: `
When a charge moves, how soon does a distant charge feel it? Coulomb's law would say at once. Maxwell's equations say: not before a light signal could get there. The field here and now depends on what the charges were doing a little while ago — earlier by the time light takes to cover the distance. Such fields and potentials are called *retarded*.

### The retarded potentials
In a static problem the potential is a sum over all the charges, each piece contributing $\\rho\\,dV/(4\\pi\\varepsilon_0 r)$. Feynman showed that the complete solution of Maxwell's equations for any moving charges and currents keeps exactly this form, with one change: each piece is taken where and as it was at the earlier time $t - r/c$:

$$\\phi(1, t) = \\int \\frac{\\rho(2,\\ t - r_{12}/c)}{4\\pi\\varepsilon_0\\, r_{12}}\\,dV_2, \\qquad \\mathbf{A}(1, t) = \\int \\frac{\\mathbf{j}(2,\\ t - r_{12}/c)}{4\\pi\\varepsilon_0 c^2\\, r_{12}}\\,dV_2$$

Here $r_{12}$ is the distance from a source point 2 to the field point 1, and the [[?integral]] adds up every piece of charge or current. The fields follow as $\\mathbf{E} = -\\nabla\\phi - \\partial\\mathbf{A}/\\partial t$ and $\\mathbf{B} = \\nabla\\times\\mathbf{A}$ — the [[vector-potential]] is the natural partner of φ here. For a single point charge the integral gives the Liénard–Wiechert potentials, with one extra factor $1/(1 - v_r/c)$: a charge coming towards you counts for a little more.

### The news spreads out at c
The picture that makes this vivid is in the simulation. A charge sits at rest with its field lines pointing straight out. Suddenly it is kicked to a speed $v$, coasts, and perhaps stops again. Nothing far away can know yet. A time $t$ after the kick only the inside of a sphere of radius $ct$ has heard: outside it the lines still point away from where the charge *was*; inside they point from where the charge *is now* (the field of a uniformly moving charge points from its present position — the retardation and the motion conspire). The same lines must join across the thin shell where the news is arriving, so each line has a kink there, and the kink travels outward at $c$. That kink is a pulse of radiation.

Its size follows from the drawing. The shell has thickness $c\\tau$, where $\\tau$ is how long the kick lasted; across it the line is shifted sideways by $vt\\sin\\theta$. So the sideways field in the kink is bigger than the radial one by $vt\\sin\\theta/(c\\tau)$, and with $t = r/c$ and acceleration $a = v/\\tau$:

$$E_\\perp = \\frac{q\\,a\\sin\\theta}{4\\pi\\varepsilon_0\\,c^2\\,r}$$

The radial (Coulomb) field falls as $1/r^2$ but the kink field only as $1/r$: far enough away, radiation always wins. It vanishes straight ahead of the acceleration ($\\theta = 0$) and is strongest at right angles to it. This is Feynman's radiation formula ([[radiation-accelerated-charge]]), recovered from Maxwell's equations and a drawing. In the simulation, drag the detector and watch its graph: nothing, then the pulse, then the new steady field.

### How long is "a little while ago"?
| From | Delay $r/c$ |
|---|---|
| a phone mast 3 km away | 10 µs |
| the Moon | 1.3 s |
| the Sun | 8.3 min |
| the nearest star beyond the Sun | 4.2 years |

The delay matters whenever it is comparable with the time over which the charges change: for an antenna oscillating at 100 MHz (period 10 ns) it matters beyond about a metre, which is why antennas radiate at all.

> [!key] Fields do not change everywhere at once. The field at a point depends on the charges at the retarded time $t - r/c$. When a charge accelerates, the news spreads out as a kinked shell at speed c, and the kink — falling off only as $1/r$ — is radiation.
`,
  ideas: [
    'The field at a point depends on where the charges were at the retarded time t − r/c, not where they are now.',
    'The retarded potentials look like the static ones, with every charge and current taken at its retarded time.',
    'When a charge is jolted, the news spreads out at c as a shell; field lines kink where they cross it.',
    'The kink field q a sinθ/(4πε₀c²r) falls as 1/r, so far away it outweighs the Coulomb field: it is radiation.',
    'A charge moving at constant velocity does not radiate; its field lines point from its present position.'
  ],
  pitfalls: [
    'A charge moving at constant speed radiates — Only acceleration kinks the lines; a uniformly moving charge carries its field along, flattened but unkinked.',
    'The field of a moving charge points back to where it was a time r/c ago — For uniform motion it points from where the charge is now: the retardation and the motion compensate exactly.',
    'Retardation matters only for fast charges — It matters whenever r/c is comparable with the time over which the charges change, however slowly they move.'
  ],
  derivation: {
    title: 'The radiation field from a kinked line',
    steps: [
      { text: 'The kick lasts τ and brings the charge to speed v, so a = v/τ. A time t later the news shell has radius ct and thickness cτ.', tex: 'R = ct, \\qquad \\Delta R = c\\tau' },
      { text: 'Inside the shell the line starts from the new position, displaced by about vt; outside it comes from the old one. At angle θ the line is shifted sideways by vt sin θ across the shell.', tex: '\\text{sideways shift} = vt\\sin\\theta' },
      { text: 'Field lines follow the field, so the ratio of the sideways to the radial field in the shell is the ratio of the sideways shift to the shell thickness.', tex: '\\frac{E_\\perp}{E_r} = \\frac{vt\\sin\\theta}{c\\tau} = \\frac{a\\,t\\sin\\theta}{c}' },
      { text: 'Put t = r/c and the Coulomb field E_r = q/(4πε₀r²).', tex: 'E_\\perp = \\frac{q}{4\\pi\\varepsilon_0 r^2}\\cdot\\frac{a\\,r\\sin\\theta}{c^2} = \\frac{q\\,a\\sin\\theta}{4\\pi\\varepsilon_0 c^2 r}' }
    ]
  },
  formulas: [
    {
      name: 'The delay of the news',
      expr: 'dt = r/c', tex: '\\Delta t = \\dfrac{r}{c}',
      vars: {
        dt: { name: 'retardation (delay)', q: 'time', unit: 's', tex: '\\Delta t' },
        r: { name: 'distance from the source', q: 'length', unit: 'km', value: 384400 },
        c: { const: 'c' }
      },
      note: 'The field at distance r reflects what the source did a time r/c earlier.',
      stories: { dt: 'A charge {r} away is jolted. How long before the change can be felt here?', r: 'The news of a change arrives {dt} after it happened. How far away was the source?' }
    },
    {
      name: 'The radiation field of an accelerated charge',
      expr: 'E = Q*a*sin(theta)/(4*pi*eps0*c^2*r)', tex: 'E_\\perp = \\dfrac{q\\,a\\sin\\theta}{4\\pi\\varepsilon_0 c^2 r}',
      vars: {
        E: { name: 'sideways (radiation) field', q: 'efield', unit: 'V/m', tex: 'E_\\perp' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        a: { name: 'acceleration at the retarded time', q: 'accel', unit: 'm/s²', value: 3e16 },
        theta: { name: 'angle between the acceleration and the line of sight', q: 'angle', unit: '°', value: 60, min: 0, max: 180, tex: '\\theta' },
        r: { name: 'distance', q: 'length', unit: 'm', value: 1 },
        eps0: { const: 'eps0' },
        c: { const: 'c' }
      },
      note: 'Non-relativistic speeds; far enough away that this 1/r field dominates. Between 0 and 180° two angles give the same field.',
      stories: { E: 'A charge of {Q} accelerates at {a}. What radiation field does it make {r} away at {theta} to the acceleration?', a: 'A radiation field of {E} is seen {r} from an electron at {theta} to its acceleration. What was the acceleration?' }
    },
    {
      name: 'The power radiated (Larmor)',
      expr: 'P = Q^2*a^2/(6*pi*eps0*c^3)', tex: 'P = \\dfrac{q^2 a^2}{6\\pi\\varepsilon_0 c^3}',
      vars: {
        P: { name: 'power radiated in all directions', q: 'power', unit: 'W' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        a: { name: 'acceleration', q: 'accel', unit: 'm/s²', value: 3e16 },
        eps0: { const: 'eps0' },
        c: { const: 'c' }
      },
      note: 'The radiation field squared, summed over a whole sphere; non-relativistic speeds.',
      stories: { P: 'An electron accelerates at {a}. How much power does it radiate?' }
    }
  ],
  examples: [
    {
      title: 'An electron kicked for a nanosecond',
      q: 'An electron is brought from rest to 0.1c in 1 ns. Compare the radiation field and the Coulomb field at 1 m and at 10 m, at right angles to the kick.',
      steps: [
        'Acceleration: $a = 0.1 \\times 3.00\\times10^{8}/10^{-9} = 3.0\\times10^{16}$ m/s². Note $4\\pi\\varepsilon_0 c^2 = 1.00\\times10^{7}$ in SI units.',
        'At 1 m: $E_\\perp = 1.60\\times10^{-19}\\times 3.0\\times10^{16}/(1.00\\times10^{7}\\times 1) = 4.8\\times10^{-10}$ V/m; the Coulomb field is $1.44\\times10^{-9}$ V/m. Ratio 0.33.',
        'At 10 m: $E_\\perp$ is 10 times smaller ($4.8\\times10^{-11}$ V/m) but the Coulomb field is 100 times smaller ($1.44\\times10^{-11}$ V/m). Ratio 3.3 — the radiation now dominates.'
      ],
      a: 'The kink field is a third of the Coulomb field at 1 m and three times it at 10 m.'
    },
    {
      title: 'The delay of a GPS signal',
      q: 'A GPS satellite is 20 200 km above the receiver. How old is the signal when it arrives?',
      steps: ['$\\Delta t = r/c = 2.02\\times10^{7}/3.00\\times10^{8} = 0.0674$ s.', 'The receiver works out its position from such delays; an error of 1 ns in timing is 30 cm of position.'],
      a: 'About 67 ms.'
    }
  ],
  quiz: [
    { q: 'A charge 3 m away is suddenly moved at t = 0. When, at the earliest, can a detector here notice any change in the field?', answer: 10, unit: 'ns', why: 't = r/c = 3/(3.00 × 10⁸) = 1.0 × 10⁻⁸ s = 10 ns.' },
    { q: 'Far from a briefly accelerated charge, which part of its field dominates?', choices: ['the sideways radiation field, falling as 1/r', 'the Coulomb field, falling as 1/r²', 'both are equal at every distance', 'the magnetic field, falling as 1/r³'], a: 0, why: 'E⊥/E_r = a r sinθ/c² grows with r.' },
    { q: 'In which direction does a briefly accelerated charge send no radiation?', choices: ['along the line of its acceleration', 'at right angles to its acceleration', 'backwards only', 'none: it radiates equally in all directions'], a: 0, why: 'E⊥ ∝ sin θ is zero at θ = 0 and 180°: the lines are not shifted sideways there.' },
    { q: 'A charge moving at constant velocity radiates energy steadily.', a: false, why: 'Without acceleration there is no kink: the field simply travels along with the charge.' },
    { q: 'For a charge coasting at constant speed, its field lines point from…', choices: ['its present position', 'where it was a time r/c ago', 'where it will be a time r/c from now', 'the point where it started moving'], a: 0, why: 'The retarded position and the velocity at that time combine exactly into a field centred on the present position (squashed at high speed).' }
  ],
  problems: [
    { q: 'An electron accelerates at 10¹⁸ m/s². What radiation field does it produce 2 m away, at 30° to the acceleration?', answer: 4.0e-9, unit: 'V/m', tol: 0.02, hint: '4πε₀c² = 1.00 × 10⁷ in SI units.',
      steps: ['$E_\\perp = q a \\sin\\theta/(4\\pi\\varepsilon_0 c^2 r) = 1.602\\times10^{-19}\\times 10^{18}\\times 0.5/(1.00\\times10^{7}\\times 2)$.', '$= 4.0\\times10^{-9}$ V/m.'] },
    { q: 'How long does a signal from a Mars rover take to reach Earth when Mars is 2.25 × 10⁸ km away?', answer: 750, unit: 's', tol: 0.02, hint: 't = r/c.',
      steps: ['$t = 2.25\\times10^{11}/3.00\\times10^{8} = 750$ s, about 12.5 minutes.'] }
  ],
  applications: [
    'Every radio transmitter works because the delay r/c is comparable with the period of its currents: the field cannot follow the charges, and the kinks fly off as waves.',
    'X-ray tubes make bremsstrahlung — "braking radiation" — by stopping fast electrons abruptly in metal: a violent kink.',
    'Satellite navigation measures positions from the delays of signals, a direct use of retardation.',
    'Synchrotrons make intense light from electrons forced round a ring (see [[synchrotron-radiation]]).'
  ],
  history: 'Ludvig Lorenz wrote down retarded potentials in 1867, in a paper arguing that light is electrical. Alfred-Marie Liénard (1898) and Emil Wiechert (1900) found the potentials of a moving point charge. The picture of radiation as kinks in field lines goes back to J. J. Thomson in the early 1900s and is a favourite of textbooks such as Edward Purcell\'s *Electricity and Magnetism* (1965).',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 21 (Solutions of Maxwell\'s Equations with Currents and Charges) — the retarded potentials, the fields of an oscillating dipole, and the Liénard–Wiechert potentials of a moving point charge.',
    'Vol. I, ch. 28 (Electromagnetic Radiation) — the field of a moving charge, whose last term is the radiation field.',
    'Vol. II, ch. 26 (Lorentz Transformations of the Fields) — the field of a charge moving with constant velocity.'
  ],
  sim: 'max-retarded'
},

{
  id: 'field-energy-momentum', parent: 'maxwell-topic', title: 'Field energy and field momentum', level: 3,
  short: 'The energy of electricity lives in the fields and flows along the Poynting vector E × B/μ₀ — into a resistor through its sides, into a capacitor through its rim. The fields carry momentum too.',
  keywords: ['Poynting vector', 'energy density', 'energy flow', 'field momentum', 'radiation pressure', 'resistor', 'capacitor', 'solar sail', 'E × B', 'conservation of energy'],
  prereq: ['maxwell-equations-feyn', 'electrostatic-energy-feyn', 'conservation-of-energy'],
  related: ['angular-momentum-paradox', 'electromagnetic-mass', 'em-waves-feyn', 'physics:em-wave-energy', 'physics:radiation-pressure', 'physics:energy-in-capacitor', 'math:cross-product'],
  body: `
Where is the energy of electricity? Feynman's answer: in the fields, spread through space, and it flows from place to place like a fluid. He then showed examples in which it flows where almost nobody would guess.

### Energy density and energy flow
The energy per unit volume stored in the fields is

$$u = \\frac{\\varepsilon_0}{2}E^2 + \\frac{\\varepsilon_0 c^2}{2}B^2 = \\frac{\\varepsilon_0}{2}E^2 + \\frac{B^2}{2\\mu_0}$$

and the energy crossing a unit area each second is the **Poynting vector**

$$\\mathbf{S} = \\varepsilon_0 c^2\\,\\mathbf{E}\\times\\mathbf{B} = \\frac{1}{\\mu_0}\\mathbf{E}\\times\\mathbf{B}$$

a [[?cross-product]], so S stands at right angles to both fields. Maxwell's equations tie the two together: the energy in a small box goes down only by what flows out through its walls ([[?divergence|the divergence]] $\\nabla\\cdot\\mathbf{S}$) and by the work the field does on the charges inside ($\\mathbf{E}\\cdot\\mathbf{j}$) — the local form of [[conservation-of-energy]]:

$$-\\frac{\\partial u}{\\partial t} = \\nabla\\cdot\\mathbf{S} + \\mathbf{E}\\cdot\\mathbf{j}$$

Feynman pointed out that these formulas for u and S are not the only ones that balance the books; they are the simplest, and no experiment has contradicted them.

### Energy enters a wire from the side
A straight resistor carries a steady current $I$ with a voltage $V$ across its length $L$. At its surface E points along the wire ($E = V/L$) and B circles it ($B = \\mu_0 I/2\\pi a$ for radius $a$). Their cross product points *radially inward*. The energy that heats the wire does not flow along it with the current — it pours in through the surface from the space around. Multiply S by the surface area:

$$S\\cdot 2\\pi a L = \\frac{V}{L}\\cdot\\frac{I}{2\\pi a}\\cdot 2\\pi a L = VI$$

exactly the heat $VI = I^2R$. A 1 kW heater with 10 m of wire 0.5 mm in radius takes in about 32 kW/m² through its surface. The generator sends its energy out into the space around the circuit; the wires only guide it.

### Energy enters a capacitor from the rim
Charge a capacitor with circular plates. E between the plates grows, and law IV makes B circle inside the gap. At the rim, E × B points inward: the energy $\\tfrac12\\varepsilon_0E^2$ per unit volume that accumulates between the plates flows in through the open edge — not along the wires and through the plates. Discharge it and the flow reverses.

In the simulation, watch the green arrows of S and the dots riding along them in both cases, and compare the flow through the surface with $VI$ in the read-out.

### Fields carry momentum
Anything that carries energy at the speed of light carries momentum too: the fields have a momentum density $\\mathbf{g} = \\mathbf{S}/c^2 = \\varepsilon_0\\mathbf{E}\\times\\mathbf{B}$. So light pushes. An absorbed beam of intensity $I$ presses with $I/c$, and a mirror feels twice that. Sunlight at the Earth presses with 4.5 µPa on a black surface — tiny, but enough to steer spacecraft. Even static fields can hold momentum: beside a charge placed near a bar magnet, E × B circulates for ever, so the fields hold angular momentum although nothing seems to happen. The books need it, as [[angular-momentum-paradox|Feynman's disk paradox]] shows.

> [!key] Energy lives in the fields, $u = \\varepsilon_0E^2/2 + B^2/2\\mu_0$, and flows along $\\mathbf{S} = \\mathbf{E}\\times\\mathbf{B}/\\mu_0$. It reaches a resistor or a capacitor through the space around the wires, and the fields carry momentum $\\mathbf{S}/c^2$ as well.
`,
  ideas: [
    'The fields store energy u = ε₀E²/2 + B²/2μ₀ per unit volume.',
    'Energy flows along the Poynting vector S = E × B/μ₀, at right angles to both fields.',
    'A resistor takes in its heat through its surface from the surrounding fields: S × 2πaL = VI.',
    'A charging capacitor fills with energy through its open rim, not through the plates.',
    'Fields carry momentum S/c²: light exerts pressure I/c when absorbed, 2I/c when reflected.'
  ],
  pitfalls: [
    'Electrical energy flows inside the wires, carried by the electrons — The electrons drift at millimetres per second; the energy travels in the fields outside the wire and enters the load from the sides.',
    'When nothing changes, no energy flows — A charge beside a magnet has static fields whose E × B circulates for ever; nothing piles up, but energy (and angular momentum) goes round.',
    'Light has no mass, so it cannot push — It carries momentum S/c² per unit volume; radiation pressure has been measured since 1900 and is used by solar sails.'
  ],
  formulas: [
    {
      name: 'Energy density of the fields',
      expr: 'u = eps0*E^2/2 + B^2/(2*mu0)', tex: 'u = \\dfrac{\\varepsilon_0 E^2}{2} + \\dfrac{B^2}{2\\mu_0}',
      vars: {
        u: { name: 'energy per unit volume', q: 'energydensity', unit: 'J/m³' },
        eps0: { const: 'eps0' },
        E: { name: 'electric field', q: 'efield', unit: 'MV/m', value: 3 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 },
        mu0: { const: 'mu0' }
      },
      note: 'In vacuum. 3 MV/m is about the breakdown field of air: a laboratory magnetic field stores far more energy than any electric field air can hold.',
      stories: { u: 'What energy per cubic metre is stored where E = {E} and B = {B}?', B: 'A magnetic field alone stores {u}. How strong is it? (E = {E})' }
    },
    {
      name: 'The Poynting vector',
      expr: 'S = E*B/mu0', tex: 'S = \\dfrac{E B}{\\mu_0}',
      vars: {
        S: { name: 'energy flow per unit area (E ⟂ B)', q: 'intensity', unit: 'W/m²' },
        E: { name: 'electric field', q: 'efield', unit: 'V/m', value: 23 },
        B: { name: 'magnetic field (perpendicular to E)', q: 'bfield', unit: 'mT', value: 1.739 },
        mu0: { const: 'mu0' }
      },
      note: 'Size of E × B/μ₀ when the fields are at right angles; the flow is perpendicular to both.',
      stories: { S: 'Perpendicular fields E = {E} and B = {B}: how much energy crosses each square metre per second?' }
    },
    {
      name: 'Energy flowing into a resistor through its surface',
      expr: 'S = V*I/(2*pi*a*L)', tex: 'S = \\dfrac{V I}{2\\pi a L}',
      vars: {
        S: { name: 'Poynting vector at the surface', q: 'intensity', unit: 'W/m²' },
        V: { name: 'voltage across the length L', q: 'voltage', unit: 'V', value: 230 },
        I: { name: 'current', q: 'current', unit: 'A', value: 4.348 },
        a: { name: 'radius of the wire', q: 'length', unit: 'mm', value: 0.5 },
        L: { name: 'length of the wire', q: 'length', unit: 'm', value: 10 }
      },
      note: 'E = V/L along the surface and B = μ₀I/2πa round it; S times the area 2πaL is exactly VI.',
      stories: { S: 'A wire {L} long and {a} in radius takes {I} at {V}. What energy flux enters its surface?' }
    },
    {
      name: 'Radiation pressure on an absorbing surface',
      expr: 'p = I/c', tex: 'p_{\\mathrm{rad}} = \\dfrac{I}{c}',
      vars: {
        p: { name: 'radiation pressure (absorbed light)', q: 'pressure', unit: 'µPa', tex: 'p_{\\mathrm{rad}}' },
        I: { name: 'intensity of the light', q: 'intensity', unit: 'W/m²', value: 1361 },
        c: { const: 'c' }
      },
      note: 'Light falling straight on a black surface; a perfect mirror feels twice as much.',
      stories: { p: 'Light of {I} falls on a black surface. What pressure does it exert?', I: 'What intensity of light presses with {p} on a black card?' }
    }
  ],
  examples: [
    {
      title: 'Where a heater gets its energy',
      q: 'A 1 kW heater runs on 230 V with 10 m of wire 0.5 mm in radius. Find E and B at the surface of the wire, the Poynting vector there, and the total power flowing in.',
      steps: [
        '$I = P/V = 1000/230 = 4.35$ A. Along the wire $E = V/L = 23$ V/m.',
        'At the surface $B = \\mu_0 I/(2\\pi a) = 2\\times10^{-7}\\times 4.35/(5\\times10^{-4}) = 1.74\\times10^{-3}$ T.',
        '$S = EB/\\mu_0 = 23 \\times 1.74\\times10^{-3}/1.257\\times10^{-6} = 3.18\\times10^{4}$ W/m², pointing into the wire.',
        'Surface area $2\\pi a L = 2\\pi \\times 5\\times10^{-4}\\times 10 = 0.0314$ m², so the inflow is $3.18\\times10^{4}\\times 0.0314 = 1000$ W.'
      ],
      a: 'S ≈ 32 kW/m² into the surface, bringing in exactly the 1 kW that the wire turns into heat.'
    },
    {
      title: 'Filling a capacitor through its rim',
      q: 'Plates of radius 5 cm, 2 mm apart, are charged by 0.1 A. At the moment the voltage is 200 V, find the energy flowing in through the rim and compare with VI.',
      steps: [
        '$E = V/d = 200/0.002 = 10^{5}$ V/m. By law IV, all the displacement current passes inside the rim, so $B = \\mu_0 I/(2\\pi a) = 2\\times10^{-7}\\times 0.1/0.05 = 4\\times10^{-7}$ T.',
        '$S = EB/\\mu_0 = 10^{5}\\times 4\\times10^{-7}/1.257\\times10^{-6} = 3.18\\times10^{4}$ W/m², pointing inward.',
        'The rim is a band of area $2\\pi a d = 2\\pi \\times 0.05 \\times 0.002 = 6.28\\times10^{-4}$ m²: power in $= 20.0$ W.',
        '$VI = 200 \\times 0.1 = 20$ W. They agree.'
      ],
      a: '20 W flows in through the open edge — the same as VI.'
    },
    {
      title: 'A solar sail',
      q: 'A perfectly reflecting sail of 1000 m² faces the Sun near the Earth (1361 W/m²). What force does the light exert?',
      steps: ['Absorbed light presses with $I/c = 1361/3.00\\times10^{8} = 4.54\\times10^{-6}$ Pa; reflected light, twice that.', '$F = 2 \\times 4.54\\times10^{-6}\\times 1000 = 9.1\\times10^{-3}$ N.'],
      a: 'About 9 mN — the weight of a gram, but it never stops pushing.'
    }
  ],
  quiz: [
    { q: 'At the surface of a wire heated by a steady current, S = E × B/μ₀ points…', choices: ['radially into the wire', 'along the wire, with the current', 'along the wire, against the current', 'radially out of the wire'], a: 0, why: 'E is along the wire and B circles it; their cross product points inward, into the surface.' },
    { q: 'While a capacitor with circular plates is charged, energy enters the space between the plates…', choices: ['through the open rim, from the side', 'along the wires and out through the plates', 'only along the axis', 'nowhere: the energy stays on the plates'], a: 0, why: 'E is across the gap and B circles the axis; at the rim E × B points inward.' },
    { q: 'If E and B are both constant in time, no energy can be flowing anywhere.', a: false, why: 'A charge near a magnet has static fields whose E × B circulates in closed loops. The divergence of S is zero, so nothing piles up, but the energy flows round.' },
    { q: 'A beam of light is reflected straight back by a mirror instead of being absorbed by a black card. The force on the surface is…', choices: ['twice as large', 'the same', 'half as large', 'zero'], a: 0, why: 'Reflection reverses the momentum of the light, so twice the momentum per second is handed to the mirror.' },
    { q: 'Perpendicular fields E = 100 V/m and B = 1 µT: what is the size of the Poynting vector?', answer: 79.6, unit: 'W/m²', why: 'S = EB/μ₀ = 100 × 10⁻⁶ / 1.257 × 10⁻⁶ = 79.6 W/m².' }
  ],
  problems: [
    { q: 'A copper wire 1 mm in radius carries 10 A with a voltage drop of 0.5 V per metre. What is the Poynting vector at its surface?', answer: 796, unit: 'W/m²', tol: 0.02, hint: 'S = EB/μ₀ with E = 0.5 V/m and B = μ₀I/2πa.',
      steps: ['$S = E\\cdot\\frac{I}{2\\pi a} = 0.5 \\times \\frac{10}{2\\pi\\times 10^{-3}} = 796$ W/m².', 'Over 2 m of wire the inflow is $796 \\times 2\\pi\\times10^{-3}\\times 2 = 10$ W, equal to $VI = 1 \\times 10$ W.'] },
    { q: 'What force does sunlight (1361 W/m²) exert on a black card of 1 m² facing the Sun?', answer: 4.54, unit: 'µN', tol: 0.02, hint: 'F = IA/c.',
      steps: ['$F = IA/c = 1361 \\times 1/3.00\\times10^{8} = 4.54\\times10^{-6}$ N.'] }
  ],
  applications: [
    'Power lines and coaxial cables: the energy travels in the fields between and around the conductors, which guide it.',
    'The solar sail IKAROS (Japan, 2010) was pushed through space by the momentum of sunlight.',
    'Optical tweezers hold and move living cells and single molecules with the momentum of focused laser light.',
    'Induction heating and microwave ovens deliver energy through space, along S, into the food or metal.'
  ],
  history: 'John Henry Poynting (1884) and, independently, Oliver Heaviside (1884–85) found the formula for the flow of electromagnetic energy. Maxwell predicted in 1873 that light should press on what it falls on; Pyotr Lebedev in Moscow and Ernest Nichols with Gordon Hull in the United States measured the pressure in 1899–1901.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 27 (Field Energy and Field Momentum) — the energy density and the Poynting vector, the ambiguity of the field energy, energy flowing into a resistor and into a charging capacitor, and the momentum of the fields.',
    'Vol. I, ch. 34 (Relativistic Effects in Radiation) — the momentum carried by light.'
  ],
  sim: 'max-poynting'
},

{
  id: 'angular-momentum-paradox', parent: 'maxwell-topic', title: 'Feynman\'s disk paradox', level: 3,
  short: 'A disk with charges on its rim and a current-carrying coil at its centre starts to turn when the current is switched off — although nothing outside touches it. The angular momentum was stored in the static fields.',
  keywords: ['Feynman disk paradox', 'Feynman cylinder paradox', 'angular momentum', 'field angular momentum', 'hidden momentum', 'induction', 'solenoid', 'conservation law', 'E × B', 'paradox'],
  prereq: ['field-energy-momentum', 'induction-laws', 'rotation-feyn'],
  related: ['great-conservation-principles', 'conservation-from-symmetry', 'vector-potential', 'electromagnetic-mass', 'physics:angular-momentum', 'physics:faradays-law'],
  body: `
Here is a puzzle that Feynman posed in his lecture on induction, and it is worth trying before reading on. A thin plastic disk turns freely on an axle, with no friction. Near its rim, small metal spheres are fixed to it, all carrying the same positive charge. At the centre, fixed to the disk and coaxial with the axle, sits a short coil — a solenoid — fed with a steady current by a small battery on the disk, so that a magnetic field runs up through the middle. Everything is at rest.

Now the current stops: the battery runs down, or a switch opens. What happens?

### Argument one: the disk turns
As the current falls, the magnetic flux through the circle of the rim decreases. By Faraday's law (law II), a changing flux means a circulating electric field: round the rim, $E\\cdot 2\\pi R = -d\\Phi/dt$. That field pushes every charged sphere the same way round, so the disk feels a torque and starts to turn. Add it up: the torque on a total charge $Q$ at radius $R$ is $QER = -(Q/2\\pi)\\,d\\Phi/dt$, and [[?integral|integrating]] over the whole switch-off gives the angular momentum the disk ends with:

$$L = \\frac{Q\\,\\Phi_0}{2\\pi}$$

where $\\Phi_0$ is the flux through the rim that disappears (for a long, thin coil, just the flux inside the coil). The answer depends only on the charge and on that flux — not on how fast the current dies.

### Argument two: the disk cannot turn
Angular momentum is conserved: with no torque from outside, a system at rest cannot start to spin. Nothing outside acts on the disk, the coil and the battery. So the disk must stay at rest.

Both arguments look sound. Which is wrong?

### The answer: the fields held the spin
The flaw is in the second argument's bookkeeping. Before the switch-off there were two static fields: the electric field of the charged spheres, spreading outward, and the magnetic field of the coil, looping up through the middle and back down outside. Where both exist and are not parallel, the [[?cross-product]] $\\mathbf{E}\\times\\mathbf{B}$ is not zero — and around this arrangement it points round the axle, in circles. [[field-energy-momentum|Field momentum]] $\\varepsilon_0\\mathbf{E}\\times\\mathbf{B}$ circulating round an axis is angular momentum, and worked out, it comes to exactly $Q\\Phi_0/2\\pi$. When the current dies, B disappears, the field's angular momentum disappears with it, and the disk receives precisely that amount. The total — disk plus fields — never changes. Feynman gave the key to the puzzle later in the course, when he came to the momentum of fields.

The simulation shows both amounts as bars: as the flux falls, the angular momentum in the fields drains into the disk. Switch the current back on and the disk is braked to a stop, the fields taking the angular momentum back.

### How big is the effect?
Take a coil 1 cm in radius with 1 T inside (flux 0.31 mWb) and 0.1 µC on the rim. Then $L = 10^{-7}\\times 3.1\\times10^{-4}/2\\pi = 5\\times10^{-12}$ kg·m²/s. A light disk with a moment of inertia of $10^{-5}$ kg·m² ends up turning at $5\\times10^{-7}$ rad/s — one turn in about 145 days. The effect is completely real and utterly tiny, which is why it is a thought experiment; the simulation gives the true numbers and draws the turning enormously speeded up.

> [!key] Static electric and magnetic fields can hold angular momentum. The conservation law works only if the fields' share is counted: switching off the current hands the fields' angular momentum, $Q\\Phi_0/2\\pi$, to the disk.
`,
  ideas: [
    'Switching off the coil\'s current makes a circulating electric field that pushes all the rim charges the same way round.',
    'The angular momentum given to the disk is QΦ₀/2π, whatever the rate at which the current dies.',
    'Before the switch-off, the static fields held that angular momentum: ε₀E × B circulates round the axle.',
    'Disk plus fields together always have the same angular momentum; switching the current on again stops the disk.',
    'Conservation laws hold only when the momentum of the fields is counted.'
  ],
  pitfalls: [
    'Angular momentum is not conserved in electromagnetism — It is, exactly, once the angular momentum of the fields is included.',
    'Static fields cannot hold momentum, because nothing moves — Momentum density ε₀E × B needs only E and B that are not parallel, not motion.',
    'A faster switch-off gives a bigger kick to the disk — The torque is larger but lasts less time; the angular momentum depends only on the total change of flux.'
  ],
  derivation: {
    title: 'How much angular momentum the disk receives',
    steps: [
      { text: 'Apply Faraday\'s law round the circle of the rim, radius R. By symmetry the induced field is tangential and the same all the way round.', tex: 'E\\cdot 2\\pi R = -\\frac{d\\Phi}{dt}' },
      { text: 'The torque on all the rim charges together, Q, is the force QE times the radius R.', tex: '\\tau = QER = -\\frac{Q}{2\\pi}\\frac{d\\Phi}{dt}' },
      { text: 'Torque is the rate of change of angular momentum. Integrate over the switch-off, as the flux falls from Φ₀ to zero; the speed of the switch-off drops out.', tex: 'L = \\int \\tau\\,dt = -\\frac{Q}{2\\pi}\\int_{\\Phi_0}^{0} d\\Phi = \\frac{Q\\,\\Phi_0}{2\\pi}' }
    ]
  },
  formulas: [
    {
      name: 'Angular momentum handed to the disk',
      expr: 'L = Q*Phi/(2*pi)', tex: 'L = \\dfrac{Q\\,\\Phi_0}{2\\pi}',
      vars: {
        L: { name: 'angular momentum gained by the disk', q: 'angmom', unit: 'kg·m²/s', signed: true },
        Q: { name: 'total charge on the rim', q: 'charge', unit: 'µC', value: 0.1, signed: true },
        Phi: { name: 'magnetic flux through the rim that disappears', q: 'flux', unit: 'mWb', value: 0.314, signed: true, tex: '\\Phi_0' }
      },
      note: 'Independent of how quickly the current is switched off; the same amount was held by the static fields before.',
      stories: { L: 'A rim charge of {Q} surrounds a flux of {Phi} that is switched off. What angular momentum does the disk gain?', Q: 'Switching off a flux of {Phi} gives the disk {L}. What charge is on its rim?' }
    },
    {
      name: 'Flux through the coil',
      expr: 'Phi = B*pi*rs^2', tex: '\\Phi_0 = B\\,\\pi r_s^2',
      vars: {
        Phi: { name: 'flux through the coil', q: 'flux', unit: 'mWb', tex: '\\Phi_0' },
        B: { name: 'magnetic field inside the coil', q: 'bfield', unit: 'T', value: 1 },
        rs: { name: 'radius of the coil', q: 'length', unit: 'cm', value: 1, tex: 'r_s' }
      },
      note: 'Uniform field inside a long coil.',
      stories: { Phi: 'A coil of radius {rs} has {B} inside. What is the flux through it?' }
    },
    {
      name: 'How fast the disk turns afterwards',
      expr: 'omega = Q*Phi/(2*pi*I)', tex: '\\omega = \\dfrac{Q\\,\\Phi_0}{2\\pi I}',
      vars: {
        omega: { name: 'final angular velocity of the disk', q: 'angvel', unit: 'rad/s', tex: '\\omega' },
        Q: { name: 'total charge on the rim', q: 'charge', unit: 'µC', value: 0.1 },
        Phi: { name: 'flux switched off', q: 'flux', unit: 'mWb', value: 0.314, tex: '\\Phi_0' },
        I: { name: 'moment of inertia of the disk', q: 'inertia', unit: 'kg·m²', value: 1e-5 }
      },
      note: 'A frictionless axle; all the angular momentum goes into the disk\'s rotation.',
      stories: { omega: 'A disk of moment of inertia {I} carries {Q} on its rim; a flux of {Phi} is switched off. How fast does it end up turning?' }
    },
    {
      name: 'The circulating electric field at the rim',
      expr: 'E = Phi/(2*pi*R*tau)', tex: 'E = \\dfrac{\\Phi_0}{2\\pi R\\,\\tau}',
      vars: {
        E: { name: 'tangential electric field at the rim', q: 'efield', unit: 'V/m' },
        Phi: { name: 'flux switched off', q: 'flux', unit: 'mWb', value: 0.314, tex: '\\Phi_0' },
        R: { name: 'radius of the rim', q: 'length', unit: 'cm', value: 5 },
        tau: { name: 'time the flux takes to fall (steadily) to zero', q: 'time', unit: 'ms', value: 1, tex: '\\tau' }
      },
      note: 'For a flux that falls at a steady rate; Faraday\'s law round the rim.',
      stories: { E: 'A flux of {Phi} inside a rim of radius {R} falls steadily to zero in {tau}. What field circulates at the rim?' }
    }
  ],
  examples: [
    {
      title: 'How slowly the disk turns',
      q: 'A coil of radius 1 cm with 1 T inside sits in a disk with 0.1 µC on its rim and a moment of inertia of 10⁻⁵ kg·m². The current is switched off. How fast does the disk turn, and how long does one turn take?',
      steps: [
        'Flux: $\\Phi_0 = B\\pi r_s^2 = 1 \\times \\pi \\times 10^{-4} = 3.14\\times10^{-4}$ Wb.',
        'Angular momentum: $L = Q\\Phi_0/2\\pi = 10^{-7}\\times 3.14\\times10^{-4}/2\\pi = 5.0\\times10^{-12}$ kg·m²/s.',
        '$\\omega = L/I = 5.0\\times10^{-7}$ rad/s, so one turn takes $2\\pi/\\omega = 1.26\\times10^{7}$ s ≈ 145 days.'
      ],
      a: 'About 5 × 10⁻⁷ rad/s: one turn in roughly five months.'
    },
    {
      title: 'The push on the spheres',
      q: 'In the same set-up the flux falls steadily to zero in 1 ms and the rim has radius 5 cm. What electric field circulates at the rim, and what force acts on a sphere carrying 10 nC?',
      steps: [
        '$E = \\Phi_0/(2\\pi R\\tau) = 3.14\\times10^{-4}/(2\\pi\\times 0.05\\times 10^{-3}) = 1.0$ V/m.',
        '$F = qE = 10^{-8}\\times 1.0 = 10^{-8}$ N, for one millisecond.'
      ],
      a: '1 V/m, pushing each 10 nC sphere with 10⁻⁸ N.'
    }
  ],
  quiz: [
    { q: 'When the current in the coil is switched off, the disk…', choices: ['starts to turn', 'stays at rest, because angular momentum is conserved', 'turns one way and then back, ending at rest', 'is pushed along its axle'], a: 0, why: 'The circulating electric field pushes all the charges the same way round. Angular momentum is conserved, but it came from the fields.' },
    { q: 'The angular momentum the disk ends with depends on how quickly the current is switched off.', a: false, why: 'The torque is proportional to dΦ/dt, so its integral over time depends only on the total change of flux: QΦ₀/2π.' },
    { q: 'Before the switch-off, where was the angular momentum that the disk receives?', choices: ['in the static fields: ε₀E × B circulating round the axle', 'in the chemical energy of the battery', 'in the electrons circulating in the coil', 'nowhere: here angular momentum is not conserved'], a: 0, why: 'The electric field of the rim charges and the magnetic field of the coil cross each other, and their momentum density circulates round the axis.' },
    { q: 'The spheres carry negative charge instead of positive. After the switch-off the disk…', choices: ['turns the opposite way', 'turns the same way', 'does not turn', 'turns twice as fast'], a: 0, why: 'The induced field is the same, but the force on a negative charge is reversed; L = QΦ₀/2π changes sign with Q.' },
    { q: 'A rim charge of 0.5 µC surrounds a flux of 1 mWb, which is switched off. What angular momentum does the disk receive?', answer: 7.96e-11, unit: 'kg·m²/s', why: 'L = QΦ₀/2π = 5 × 10⁻⁷ × 10⁻³/2π = 7.96 × 10⁻¹¹ kg·m²/s.' }
  ],
  problems: [
    { q: 'A disk with moment of inertia 2 × 10⁻⁶ kg·m² carries 0.5 µC on its rim; a flux of 1 mWb through the coil is switched off. How fast does the disk end up turning?', answer: 3.98e-5, unit: 'rad/s', tol: 0.02, hint: 'L = QΦ₀/2π, then ω = L/I.',
      steps: ['$L = 5\\times10^{-7}\\times 10^{-3}/2\\pi = 7.96\\times10^{-11}$ kg·m²/s.', '$\\omega = L/I = 7.96\\times10^{-11}/2\\times10^{-6} = 3.98\\times10^{-5}$ rad/s.'] },
    { q: 'A flux of 2 mWb inside a rim of radius 10 cm falls steadily to zero in 10 ms. What electric field circulates at the rim?', answer: 0.318, unit: 'V/m', tol: 0.02, hint: 'E · 2πR = Φ₀/τ.',
      steps: ['$E = \\Phi_0/(2\\pi R\\tau) = 2\\times10^{-3}/(2\\pi\\times 0.1\\times 0.01) = 0.318$ V/m.'] }
  ],
  applications: [
    'The same bookkeeping explains the "hidden momentum" of a magnet sitting in an electric field (Shockley and James, 1967), which keeps momentum conservation working for magnetic dipoles.',
    'A charge and a magnetic pole would hold field angular momentum that does not depend on their distance apart; requiring it to come in quantum units gives Dirac\'s 1931 condition that electric charge be quantised if a single magnetic monopole exists.',
    'The paradox is a standard test, in electromagnetism courses, of whether one really believes that fields carry momentum.'
  ],
  history: 'J. J. Thomson noticed in 1904 that the static fields of an electric charge and a magnetic pole hold angular momentum. Feynman posed the disk paradox in his Caltech lectures on induction (1962–63, published in 1964 in Vol. II) and resolved it with the momentum of the fields.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 17 (The Laws of Induction) — the paradox of the disk, the coil and the charged spheres, posed as a puzzle.',
    'Vol. II, ch. 27 (Field Energy and Field Momentum) — the momentum of the fields, and the angular momentum held by static fields that resolves the paradox.'
  ],
  sim: 'max-disk'
},

{
  id: 'electromagnetic-mass', parent: 'maxwell-topic', title: 'Electromagnetic mass', level: 3,
  short: 'A moving charge drags its field along, and the field\'s momentum makes the charge harder to accelerate: its field acts as mass, 4/3 of U/c² for a charged shell. For a point charge it is infinite — where classical electrodynamics fails.',
  keywords: ['electromagnetic mass', 'self-energy', 'classical electron radius', '4/3 problem', 'field momentum', 'Poincaré stresses', 'point charge', 'infinity', 'Abraham–Lorentz', 'Wheeler–Feynman', 'absorber theory'],
  prereq: ['field-energy-momentum', 'relativistic-mass-energy', 'electrostatic-energy-feyn'],
  related: ['renormalization-idea', 'retarded-potentials', 'path-integral', 'feynman-life', 'physics:mass-energy'],
  body: `
A charged body that moves carries its field along, and a moving field — the electric field plus the magnetic field the motion creates — has momentum. So pushing a charged ball means pushing its field as well: the ball behaves as if it had extra mass. Feynman used this to show both the power of field ideas and the place where classical electromagnetism breaks down.

### The momentum of a moving charged sphere
Take a thin spherical shell of radius $a$ carrying charge $q$, moving slowly with velocity $\\mathbf{v}$. Outside it, E is the Coulomb field, and the motion adds $\\mathbf{B} = \\mathbf{v}\\times\\mathbf{E}/c^2$. The momentum density $\\varepsilon_0\\mathbf{E}\\times\\mathbf{B}$ is largest close to the sphere and at right angles to the motion (it goes as $E^2\\sin\\theta$). Adding it over all space — an [[?integral]] over every shell of radius $r > a$ — gives a total momentum along v:

$$\\mathbf{p} = \\frac{2}{3}\\,\\frac{q^2}{4\\pi\\varepsilon_0\\,a\\,c^2}\\,\\mathbf{v} \\qquad\\Rightarrow\\qquad m_{\\text{em}} = \\frac{2}{3}\\,\\frac{q^2}{4\\pi\\varepsilon_0\\,a\\,c^2}$$

Momentum [[?proportional]] to velocity is exactly what a mass does. The contributions fall off as $1/r^2$ per unit of radius, so half of the total lies within $2a$ and 90 % within $10a$: the "mass" sits in the field hugging the sphere. The simulation draws the momentum density around a moving sphere, with rings marking where half and 90 % of it lie.

### The 4/3 puzzle
The field's energy at rest is $U = q^2/(8\\pi\\varepsilon_0 a)$. With $E = mc^2$ in mind one would expect $m = U/c^2$. Instead

$$m_{\\text{em}} = \\frac{4}{3}\\,\\frac{U}{c^2}$$

The extra third is a real inconsistency of a purely electrical model. A ball of charge would fly apart unless something non-electrical holds it together, and that something (the stresses Poincaré added in 1905–06) carries energy and momentum of its own. Include it and the total obeys relativity, but the tidy dream that all mass is electromagnetic is gone.

### Could the electron's mass be all field?
Put the electron's charge on a shell and ask for which radius $m_{\\text{em}}$ equals the measured mass, 0.511 MeV/c². The answer is 1.88 fm, close to the "classical electron radius" $r_0 = e^2/(4\\pi\\varepsilon_0 m_e c^2) = 2.82$ fm.

| Shell radius | Field energy U | $m_{\\text{em}}$ |
|---|---|---|
| 10 fm | 0.072 MeV | 0.096 MeV/c² |
| 2.82 fm | 0.26 MeV | 0.34 MeV/c² |
| 1.88 fm | 0.38 MeV | 0.511 MeV/c² |
| 1 fm | 0.72 MeV | 0.96 MeV/c² |

But experiments that scatter electrons at high energies find no size at all down to about $10^{-18}$ m, a thousand times smaller. Shrink the shell and the field energy grows as $1/a$: a point charge would have infinite energy and infinite mass. Feynman treated this as a genuine failure of classical electrodynamics at small distances; quantum electrodynamics inherits a milder form of the same infinity, tamed by [[renormalization-idea|renormalization]].

### Feynman's own attempt
As a graduate student at Princeton, Feynman and his adviser John Wheeler tried to remove the problem at its root: suppose a charge does not act on itself at all, and the recoil of a radiating charge comes from the response of all the other charges in the universe. Their "absorber theory" (published in 1945 and 1949) worked classically; the search for a quantum version of it led Feynman to his [[path-integral|sum over histories]]. He told the story in his Nobel lecture of 1965.

> [!key] A moving charge carries field momentum proportional to its velocity, so its field acts as mass: $m_{\\text{em}} = \\tfrac43\\,U/c^2$ for a shell. The smaller the charge, the larger that mass, without limit — which is where classical electromagnetism fails.
`,
  ideas: [
    'A moving charge has a magnetic field B = v × E/c², and the fields together carry momentum ε₀E × B.',
    'For a charged shell the field momentum is (2/3)(q²/4πε₀ac²) v: the field adds a mass that grows as 1/a.',
    'The field mass is 4/3 of U/c²; the mismatch shows that non-electrical forces must hold a charge together.',
    'The momentum sits close to the charge: half of it within twice the radius.',
    'A point charge would have infinite field energy and mass — a real failure of classical electrodynamics at small distances.'
  ],
  pitfalls: [
    'All of the electron\'s mass has been shown to be electromagnetic — The purely electromagnetic electron needs a radius near 2 fm, and experiments see no size down to 10⁻¹⁸ m.',
    'The field\'s mass should simply be U/c² — A charged shell alone gives 4/3 of that; only when the forces holding the charge together are included does the total behave as E = mc² requires.',
    'Electromagnetic mass matters for charged objects in everyday life — For a 1 cm sphere at 10 kV it is about 10⁻²¹ kg; it matters only at the scale of elementary particles.'
  ],
  formulas: [
    {
      name: 'Field energy of a charged shell',
      expr: 'U = Q^2/(8*pi*eps0*a)', tex: 'U = \\dfrac{q^2}{8\\pi\\varepsilon_0 a}',
      vars: {
        U: { name: 'energy of the field', q: 'energy', unit: 'MeV' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        eps0: { const: 'eps0' },
        a: { name: 'radius of the shell', q: 'length', unit: 'fm', value: 1 }
      },
      note: 'Charge spread over the surface of a sphere; all the field is outside it.',
      stories: { U: 'A charge of {Q} sits on a shell of radius {a}. How much energy is in its field?', a: 'For what shell radius is the field energy of {Q} equal to {U}?' }
    },
    {
      name: 'Electromagnetic mass of a charged shell',
      expr: 'm = Q^2/(6*pi*eps0*a*c^2)', tex: 'm_{\\text{em}} = \\dfrac{q^2}{6\\pi\\varepsilon_0 a c^2}',
      vars: {
        m: { name: 'electromagnetic mass', q: 'mass', unit: 'MeV/c²', tex: 'm_{\\text{em}}' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        eps0: { const: 'eps0' },
        a: { name: 'radius of the shell', q: 'length', unit: 'fm', value: 1.88 },
        c: { const: 'c' }
      },
      note: 'The same as (2/3) q²/(4πε₀ac²); slow speeds, from the field momentum.',
      stories: { m: 'What is the electromagnetic mass of {Q} spread on a shell of radius {a}?', a: 'How small must a shell carrying {Q} be for its field mass to reach {m}?' }
    },
    {
      name: 'The 4/3 relation',
      expr: 'm = 4*U/(3*c^2)', tex: 'm_{\\text{em}} = \\dfrac{4}{3}\\,\\dfrac{U}{c^2}',
      vars: {
        m: { name: 'electromagnetic mass (from the momentum)', q: 'mass', unit: 'MeV/c²', tex: 'm_{\\text{em}}' },
        U: { name: 'field energy at rest', q: 'energy', unit: 'MeV', value: 0.383 },
        c: { const: 'c' }
      },
      note: 'For a charged shell with nothing else holding it together.',
      stories: { m: 'A charged shell\'s field holds {U}. What mass does its field momentum give it?' }
    },
    {
      name: 'The classical electron radius',
      expr: 'r0 = Q^2/(4*pi*eps0*me*c^2)', tex: 'r_0 = \\dfrac{q^2}{4\\pi\\varepsilon_0 m_e c^2}',
      vars: {
        r0: { name: 'classical radius', q: 'length', unit: 'fm', tex: 'r_0' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        eps0: { const: 'eps0' },
        me: { const: 'me' },
        c: { const: 'c' }
      },
      note: 'The distance at which the electrical energy q²/4πε₀r equals mc²; a scale, not the electron\'s measured size.',
      stories: { r0: 'What is the classical radius of a particle with charge {Q} and the electron\'s mass?' }
    }
  ],
  examples: [
    {
      title: 'An electron made only of field',
      q: 'If the electron were a charged shell whose whole mass (0.511 MeV/c²) came from its field, what would its radius be?',
      steps: [
        'Set $\\frac{2}{3}\\frac{e^2}{4\\pi\\varepsilon_0 a c^2} = m_e$, so $a = \\frac{2}{3}\\frac{e^2}{4\\pi\\varepsilon_0 m_e c^2} = \\frac{2}{3}r_0$.',
        'With $e^2/4\\pi\\varepsilon_0 = 1.440$ MeV·fm and $m_ec^2 = 0.511$ MeV, $r_0 = 2.818$ fm.',
        '$a = \\frac{2}{3}\\times 2.818 = 1.88$ fm.'
      ],
      a: 'About 1.9 fm — far larger than the upper limit of about 10⁻³ fm set by experiments.'
    },
    {
      title: 'The field mass of a charged ball',
      q: 'A metal sphere 1 cm in radius is charged to 10 kV. What is its electromagnetic mass?',
      steps: [
        'Charge: $q = 4\\pi\\varepsilon_0 aV = 1.11\\times10^{-12}\\times 10^{4} = 1.11\\times10^{-8}$ C.',
        'Field energy: $U = \\tfrac12 qV = 5.6\\times10^{-5}$ J.',
        '$m_{\\text{em}} = \\tfrac43 U/c^2 = \\tfrac43 \\times 5.6\\times10^{-5}/9.0\\times10^{16} = 8.3\\times10^{-22}$ kg.'
      ],
      a: 'About 8 × 10⁻²² kg — some twenty orders of magnitude below the mass of the metal.'
    }
  ],
  quiz: [
    { q: 'Halving the radius of a charged shell, with the same charge, makes its electromagnetic mass…', choices: ['twice as large', 'half as large', 'four times as large', 'unchanged'], a: 0, why: 'm_em ∝ q²/a: the field is squeezed closer to the charge, where it is strongest.' },
    { q: 'For a charged shell with nothing else holding it together, the mass computed from the field momentum is…', choices: ['4/3 of U/c²', 'exactly U/c²', '2/3 of U/c²', 'half of U/c²'], a: 0, why: 'm_em = (2/3)q²/(4πε₀ac²) while U = (1/2)q²/(4πε₀a).' },
    { q: 'Where is most of the field momentum of a slowly moving charged shell?', choices: ['close to the shell: half of it within twice its radius', 'spread evenly out to infinity', 'inside the shell', 'far away, where the field is weak but the volume is huge'], a: 0, why: 'The momentum per unit of radius falls as 1/r², so the fraction within r is 1 − a/r.' },
    { q: 'In classical electrodynamics a point charge would have infinite electromagnetic mass.', a: true, why: 'The field energy q²/8πε₀a, and with it the mass, grows without limit as a → 0.' },
    { q: 'What is the field energy of a shell with one elementary charge and a radius of 0.84 fm (about the size of a proton)?', answer: 0.857, unit: 'MeV', why: 'U = (1.440 MeV·fm)/(2 × 0.84 fm) = 0.857 MeV.' }
  ],
  problems: [
    { q: 'Find the electromagnetic mass of a shell of radius 2.82 fm carrying one elementary charge.', answer: 0.341, unit: 'MeV/c²', tol: 0.02, hint: 'm = (2/3)(e²/4πε₀)/(ac²) with e²/4πε₀ = 1.440 MeV·fm.',
      steps: ['$m_{\\text{em}}c^2 = \\frac{2}{3}\\times\\frac{1.440}{2.82} = 0.340$ MeV.', 'So $m_{\\text{em}} = 0.34$ MeV/c², two thirds of the electron mass.'] },
    { q: 'How small would a shell carrying one elementary charge have to be for its field mass to equal the proton mass, 938 MeV/c²?', answer: 0.00102, unit: 'fm', tol: 0.02, hint: 'a = (2/3)(e²/4πε₀)/(mc²).',
      steps: ['$a = \\frac{2}{3}\\times\\frac{1.440\\ \\text{MeV·fm}}{938\\ \\text{MeV}} = 1.02\\times10^{-3}$ fm.', 'That is a thousand times smaller than the proton actually is: its mass is not electromagnetic.'] }
  ],
  applications: [
    'The infinite self-energy of a point charge shaped quantum electrodynamics and led to renormalization.',
    'The neutron–proton mass difference (1.29 MeV/c²) comes from a competition between the quark masses and the electromagnetic energy of the proton\'s charge; modern calculations must include both.',
    'The recoil of a charge on its own radiation (radiation reaction) matters for electrons in the most intense laser fields and in high-energy accelerators.'
  ],
  history: 'J. J. Thomson showed in 1881 that a charged sphere should be harder to accelerate than an uncharged one. Max Abraham and Hendrik Lorentz (1902–04) built models of the electron as a ball of charge, tested against Walter Kaufmann\'s measurements of fast electrons; Henri Poincaré (1905–06) added the non-electrical stresses that hold the charge together. John Wheeler and Richard Feynman published their theory of charges that do not act on themselves in 1945 and 1949.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 28 (Electromagnetic Mass) — the momentum of a moving charged sphere, the factor 4/3, the force of an electron on itself and attempts to modify the theory.',
    'Vol. II, ch. 27 (Field Energy and Field Momentum) — the momentum density of the fields.',
    'Feynman\'s Nobel lecture, "The Development of the Space-Time View of Quantum Electrodynamics" (Stockholm, 11 December 1965) — how the problem of a charge acting on itself, and his work on it with Wheeler, led him to his own formulation.'
  ],
  sim: 'max-em-mass'
},

{
  id: 'charges-in-fields', parent: 'maxwell-topic', title: 'Charges moving in electric and magnetic fields', level: 2,
  short: 'A magnetic field bends a moving charge into a circle or a helix without speeding it up; add a crossed electric field and everything drifts at E/B; squeeze the field lines and the spirals bounce back — cyclotrons, spectrometers, magnetrons and magnetic bottles.',
  keywords: ['Lorentz force', 'cyclotron', 'cyclotron frequency', 'Larmor radius', 'helix', 'E × B drift', 'crossed fields', 'magnetic mirror', 'magnetic bottle', 'loss cone', 'mass spectrometer', 'Van Allen belts'],
  prereq: ['magnetostatics-feyn', 'newtons-laws-numerically', 'physics:lorentz-force'],
  related: ['relativity-of-fields', 'relativistic-mass-energy', 'synchrotron-radiation', 'physics:charged-particle-motion', 'physics:hall-effect'],
  body: `
Once the fields are known, what do charges do in them? Everything follows from the force law $\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v}\\times\\mathbf{B})$ and Newton's law in its relativistic form, $d\\mathbf{p}/dt = \\mathbf{F}$. Feynman's lecture on the subject is a tour of the machines built on it — spectrometers, lenses for electrons, accelerators — and the simulation lets you steer the particles yourself.

### Circles in a magnetic field
The magnetic force $q\\mathbf{v}\\times\\mathbf{B}$ is a [[?cross-product]], always at right angles to the velocity, so it never does work: it turns the particle without changing its speed. In a uniform field a particle moving across the field goes round a circle, whose radius follows from force = momentum × turning rate:

$$r = \\frac{p}{qB}$$

This holds even at relativistic speeds, with $p = \\gamma mv$ — which is why physicists measure momenta by the curvature of tracks: $p$ in GeV/c ≈ $0.3\\,B$ (in T) × $r$ (in m). The time for one turn is $2\\pi\\gamma m/(qB)$: for slow particles it does not depend on the speed or on the radius. Faster particles go round bigger circles in the same time — the fact that made Lawrence's cyclotron work. A proton in 1.5 T circles 22.9 million times a second.

If the particle also moves along B, that part of its motion is untouched and the circle stretches into a helix — the path of charged particles spiralling along the Earth's field lines.

### Crossed fields: the E × B drift
Add an electric field at right angles to B. On one side of each loop the electric field speeds the particle up and its circle widens; on the other side it slows down and the circle tightens. The loops no longer close, and the particle drifts sideways — not along E but at right angles to both fields — at the speed

$$v_d = \\frac{E}{B}$$

whatever its charge, mass or energy. Electrons and ions drift together, in the same direction. Seen from a frame moving at $v_d$ the electric field disappears (see [[relativity-of-fields]]) and the particle simply circles. A particle starting from rest traces a cycloid, like a point on a rolling wheel; magnetrons make microwaves from electrons moving this way.

### A magnetic bottle
Where field lines crowd together the field is stronger. A particle spiralling into such a region keeps the quantity $mv_\\perp^2/2B$ (its magnetic moment) nearly constant, so as B grows its circling speed $v_\\perp$ grows too — and since the total speed cannot change, the motion along the field slows, stops and reverses. The particle is reflected: a **magnetic mirror**. Two mirrors make a bottle. Only particles whose velocity points close to the field lines, with pitch angle α inside the "loss cone" $\\sin^2\\alpha < B_0/B_{\\max}$, escape through the ends. The Earth's field makes such bottles: the Van Allen belts are particles trapped between mirror points near the poles.

| Situation | Motion | Key number |
|---|---|---|
| uniform B, v ⟂ B | circle | $r = p/qB$, $f = qB/2\\pi m$ |
| uniform B, v at an angle | helix | pitch $2\\pi m v_\\parallel/qB$ |
| E ⟂ B | looping drift | $v_d = E/B$ |
| converging B | spiral, reflected | loss cone $\\sin^2\\alpha = B_0/B_{\\max}$ |

> [!key] Magnetic forces bend but never speed up: circles of radius p/qB, turned at the cyclotron frequency. Add a perpendicular E and everything drifts at E/B; squeeze the field lines and the spirals bounce back.
`,
  ideas: [
    'The magnetic force is perpendicular to the velocity: it bends the path but does no work.',
    'In a uniform B a charge circles with r = p/qB; for slow particles the cyclotron frequency qB/2πm does not depend on speed.',
    'Motion along B is unaffected, so general paths are helices.',
    'In crossed fields every charge drifts at v = E/B, perpendicular to both fields, whatever its charge or mass.',
    'Converging field lines reflect spiralling particles, except those inside the loss cone: magnetic mirrors and bottles.'
  ],
  pitfalls: [
    'A magnetic field can speed a charge up — The force q v × B is always perpendicular to v, so it does no work; only E changes the energy.',
    'In crossed E and B fields a charge moves along E — On average it moves perpendicular to both fields, at E/B; along E it only oscillates.',
    'Faster particles take longer to go round in a cyclotron — Slow ones take the same time whatever their speed; only at relativistic speeds does the turn take longer, by the factor γ.'
  ],
  formulas: [
    {
      name: 'Cyclotron frequency',
      expr: 'f = Q*B/(2*pi*m)', tex: 'f = \\dfrac{qB}{2\\pi m}',
      vars: {
        f: { name: 'turns per second', q: 'frequency', unit: 'MHz' },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1.5 },
        m: { name: 'mass', q: 'mass', unit: 'u', value: 1.00728 }
      },
      note: 'Non-relativistic; at speed v divide by γ. 1.00728 u is the proton mass.',
      stories: { f: 'A particle of mass {m} and charge {Q} moves in {B}. How many times a second does it go round?', B: 'What field makes a particle of mass {m} and charge {Q} circle at {f}?' }
    },
    {
      name: 'Radius of the circle',
      expr: 'r = m*v/(Q*B)', tex: 'r = \\dfrac{mv}{qB}',
      vars: {
        r: { name: 'radius of the circle', q: 'length', unit: 'cm' },
        m: { name: 'mass', q: 'mass', unit: 'u', value: 1.00728 },
        v: { name: 'speed across the field', q: 'speed', unit: 'km/s', value: 13840 },
        Q: { name: 'charge', q: 'charge', unit: 'e', value: 1, tex: 'q' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 1 }
      },
      note: 'Non-relativistic form of r = p/qB; 13 840 km/s is a 1 MeV proton.',
      stories: { r: 'A particle of mass {m} and charge {Q} moves at {v} across a field of {B}. What is the radius of its circle?', v: 'A particle of mass {m} and charge {Q} circles with radius {r} in {B}. How fast is it going?' }
    },
    {
      name: 'The E × B drift',
      expr: 'vd = E/B', tex: 'v_d = \\dfrac{E}{B}',
      vars: {
        vd: { name: 'drift speed', q: 'speed', unit: 'km/s', tex: 'v_d' },
        E: { name: 'electric field (perpendicular to B)', q: 'efield', unit: 'kV/m', value: 10 },
        B: { name: 'magnetic field', q: 'bfield', unit: 'mT', value: 50 }
      },
      note: 'Perpendicular to both fields; the same for every charge and mass (while E/B ≪ c).',
      stories: { vd: 'Crossed fields: E = {E}, B = {B}. How fast do charges drift?', E: 'What electric field, crossed with {B}, makes charges drift at {vd}?' }
    },
    {
      name: 'The loss cone of a magnetic mirror',
      expr: 'alpha = asin(sqrt(B0/Bm))', tex: '\\alpha = \\arcsin\\sqrt{\\dfrac{B_0}{B_{\\max}}}',
      vars: {
        alpha: { name: 'loss-cone angle (pitch angles smaller than this escape)', q: 'angle', unit: '°', min: 0, max: 90, tex: '\\alpha' },
        B0: { name: 'field at the middle of the bottle', q: 'bfield', unit: 'mT', value: 10, tex: 'B_0' },
        Bm: { name: 'field at the mirror', q: 'bfield', unit: 'mT', value: 40, tex: 'B_{\\max}' }
      },
      note: 'The pitch angle is measured from the field line at the middle; the magnetic moment mv⊥²/2B is assumed constant.',
      stories: { alpha: 'A magnetic bottle has {B0} in the middle and {Bm} at its ends. Which particles escape?', Bm: 'What mirror field keeps particles with pitch angles above {alpha} in a bottle with {B0} at its middle?' }
    }
  ],
  examples: [
    {
      title: 'An electron in the Earth\'s field',
      q: 'An electron of 1 keV moves at right angles to the Earth\'s field of 50 µT. Find the radius and frequency of its circle.',
      steps: [
        'Speed: $v = \\sqrt{2E/m} = \\sqrt{2\\times 1.602\\times10^{-16}/9.109\\times10^{-31}} = 1.88\\times10^{7}$ m/s (6 % of c, so non-relativistic is fine).',
        '$r = mv/(qB) = 9.109\\times10^{-31}\\times 1.88\\times10^{7}/(1.602\\times10^{-19}\\times 5\\times10^{-5}) = 2.1$ m.',
        '$f = qB/(2\\pi m) = 1.602\\times10^{-19}\\times 5\\times10^{-5}/(2\\pi\\times 9.109\\times10^{-31}) = 1.4$ MHz.'
      ],
      a: 'A circle about 2 m in radius, traced 1.4 million times a second.'
    },
    {
      title: 'Sizing a cyclotron',
      q: 'A cyclotron with a 1.5 T magnet accelerates protons to 10 MeV. How large must its poles be, and at what frequency does the voltage alternate?',
      steps: [
        'Momentum: $pc = \\sqrt{T^2 + 2Tmc^2} = \\sqrt{10^2 + 2\\times 10\\times 938.3} = 137.4$ MeV, i.e. $p = 7.34\\times10^{-20}$ kg·m/s.',
        '$r = p/(qB) = 7.34\\times10^{-20}/(1.602\\times10^{-19}\\times 1.5) = 0.31$ m, so the poles must be over 60 cm across.',
        '$f = qB/(2\\pi m_p) = 22.9$ MHz at the start; at 10 MeV γ = 1.011, so the protons fall 1 % behind — the limit that synchrocyclotrons overcome.'
      ],
      a: 'An orbit radius of about 31 cm and a frequency of about 23 MHz.'
    },
    {
      title: 'Drifting in crossed fields',
      q: 'A region has E = 10 kV/m and B = 50 mT at right angles. How fast do electrons and protons drift, and which way?',
      steps: ['$v_d = E/B = 10^{4}/0.05 = 2\\times10^{5}$ m/s.', 'Both drift along E × B, at the same speed, whatever their charge and mass.'],
      a: '200 km/s, along E × B, for both.'
    }
  ],
  quiz: [
    { q: 'How much work does a steady magnetic field do on a charge moving through it?', choices: ['none', 'qvB times the distance travelled', 'qvBr per turn', 'it depends on the angle between v and B'], a: 0, why: 'The force q v × B is always perpendicular to the velocity, so F · v = 0: no work, no change of speed.' },
    { q: 'A slow proton circling in a uniform magnetic field doubles its speed. Its circle…', choices: ['doubles in radius; the time per turn is unchanged', 'doubles in radius and takes twice as long', 'keeps its radius and takes half as long', 'halves in radius'], a: 0, why: 'r = mv/qB doubles; the period 2πm/qB does not depend on v.' },
    { q: 'In crossed E and B fields, an electron and a proton drift…', choices: ['in the same direction at the same speed E/B', 'in opposite directions at the same speed', 'along E, in opposite directions', 'the electron far faster, being lighter'], a: 0, why: 'Reversing the charge reverses both the electric and the magnetic force; the drift E × B/B² contains neither q nor m.' },
    { q: 'In a magnetic mirror, which particles escape through the ends?', choices: ['those moving nearly along the field lines (small pitch angle)', 'those moving nearly at right angles to the field', 'only the fastest', 'only the heaviest'], a: 0, why: 'A particle with little circling motion needs a very strong field to reverse; if sin²α < B₀/B_max it gets through.' },
    { q: 'What is the radius of the circle of an electron moving at 10⁶ m/s at right angles to a field of 1 mT?', answer: 5.69, unit: 'mm', why: 'r = mv/qB = 9.109 × 10⁻³¹ × 10⁶/(1.602 × 10⁻¹⁹ × 10⁻³) = 5.69 × 10⁻³ m.' }
  ],
  problems: [
    { q: 'A particle with one elementary charge leaves a track that curves with a radius of 2 m in a 2 T field. What is its momentum?', answer: 1199, unit: 'MeV/c', tol: 0.02, hint: 'p = qBr, exact even at relativistic speeds.',
      steps: ['$p = qBr = 1.602\\times10^{-19}\\times 2\\times 2 = 6.41\\times10^{-19}$ kg·m/s.', 'In MeV/c: divide by $5.344\\times10^{-22}$: 1199 MeV/c, about 1.2 GeV/c (0.3 × 2 × 2 = 1.2).'] },
    { q: 'A magnetic bottle has a mirror ratio B_max/B₀ = 10. What is its loss-cone angle?', answer: 18.4, unit: '°', tol: 0.02, hint: 'sin²α = B₀/B_max.',
      steps: ['$\\sin\\alpha = \\sqrt{0.1} = 0.316$.', '$\\alpha = 18.4°$: particles whose velocity is within 18.4° of the field line escape.'] }
  ],
  applications: [
    'Mass spectrometers sort ions by the radius of their circles; particle detectors measure momenta from the curvature of tracks.',
    'Cyclotrons make medical isotopes, such as fluorine-18 for PET scans, and proton beams for cancer therapy.',
    'Magnetrons in microwave ovens and radar make microwaves from electrons drifting in crossed electric and magnetic fields.',
    'Fusion experiments confine hot plasma with magnetic fields; the Earth\'s field traps particles in the Van Allen belts.'
  ],
  history: 'Ernest Lawrence and Stanley Livingston ran the first cyclotron at Berkeley in 1931. Magnetic mirrors were proposed for confining fusion plasmas in the early 1950s, and in 1958 James Van Allen\'s instruments on Explorer 1 discovered the radiation belts in which the Earth\'s own field traps charged particles.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 29 (The Motion of Charges in Electric and Magnetic Fields) — circles in a uniform field, momentum analysis, electric and magnetic lenses, the electron microscope, accelerator guide fields, alternating-gradient focusing and motion in crossed fields.',
    'Vol. II, ch. 13 (Magnetostatics) — the magnetic force on a moving charge.'
  ],
  sim: 'max-cyclotron'
},

{
  id: 'waveguides-feyn', parent: 'maxwell-topic', title: 'Waveguides and cavity resonators', level: 3,
  short: 'At microwave frequencies circuits turn into boxes of field: a capacitor driven fast enough becomes a resonant cavity, and a metal pipe carries waves only above a cutoff frequency — two plane waves zigzagging between its walls.',
  keywords: ['waveguide', 'cavity resonator', 'cutoff frequency', 'TE10 mode', 'guide wavelength', 'phase velocity', 'group velocity', 'microwaves', 'evanescent wave', 'Bessel function', 'transmission line', 'modes'],
  prereq: ['em-waves-feyn', 'ac-circuits-feyn', 'modes-feyn'],
  related: ['beats-feyn', 'interference-feyn', 'resonance-feyn', 'electronics:transmission-lines', 'electronics:antennas', 'physics:standing-waves'],
  body: `
At low frequencies electricity follows wires, and circuits are drawn with capacitors and coils. At microwave frequencies the wavelength shrinks to centimetres, comparable with the parts themselves, and Feynman showed step by step how the familiar elements turn into something new: hollow metal pipes and boxes in which fields ring and travel.

### A capacitor becomes a cavity
Drive a capacitor with circular plates at higher and higher frequency. The changing E between the plates makes a circulating B (law IV); the changing B makes a correction to E (law II), which makes a further correction to B, and so on. Summed up, the field across the gap is no longer uniform: it is largest at the centre and falls towards the rim as a Bessel function, $E = E_0 J_0(\\omega r/c)$. At the frequency where it falls to zero exactly at the rim, $\\omega a/c = 2.405$, the edge can be closed with a metal wall without disturbing anything. The capacitor has become a **cavity resonator** — a closed can in which the fields oscillate on their own, with no coil at all. A can 5 cm in radius rings at 2.3 GHz.

### A pipe that guides waves
Now take a long rectangular metal pipe, width $a$ and height $b$ (with $b < a$). The electric field along a metal wall must vanish, so a wave inside has a fixed pattern across the pipe. The simplest (called TE₁₀) has E across the short side, largest in the middle and zero at the side walls: $E_y = E_0\\sin(\\pi x/a)\\cos(kz - \\omega t)$. Putting this into the [[?wave-equation]] gives

$$k^2 = \\frac{\\omega^2}{c^2} - \\frac{\\pi^2}{a^2}$$

Above the **cutoff frequency** $f_c = c/2a$, $k$ is real and the wave travels, with a guide wavelength $\\lambda_g = 2\\pi/k$ longer than in free space. Below it $k^2$ is negative, $k$ is [[?imaginary-unit|imaginary]], and instead of a wave the field dies away [[?exponential|exponentially]] along the pipe. A pipe is a high-pass filter: 2.45 GHz microwaves travel down a pipe 86 mm wide, but 100 MHz radio waves cannot get in.

### Two plane waves in a zigzag
A useful picture: the guided wave is two ordinary plane waves crossing at an angle, reflected back and forth between the side walls and adding so that they cancel at the walls. Their angle θ to the axis satisfies $\\sin\\theta = \\lambda/2a$. As the frequency drops the waves bounce more steeply, and at cutoff ($\\lambda = 2a$) they bounce straight across and go nowhere. The crests along the pipe move at the phase velocity $v_p = c/\\cos\\theta$, faster than light — no signal travels that fast — while energy moves along at the group velocity $v_g = c\\cos\\theta$, and $v_pv_g = c^2$. In the simulation, slide the frequency down towards cutoff and watch the guide wavelength stretch, the zigzag steepen and the wave die away.

| Guide | Width $a$ | Cutoff $f_c$ | Typical use |
|---|---|---|---|
| WR-340 | 86.4 mm | 1.74 GHz | microwave ovens (2.45 GHz) |
| WR-90 | 22.9 mm | 6.56 GHz | X-band radar (8–12 GHz) |
| WR-28 | 7.1 mm | 21.1 GHz | Ka-band links (26–40 GHz) |

Close both ends of the pipe and only waves that fit a whole number of half guide wavelengths survive: a rectangular cavity, with resonances at $f = \\tfrac{c}{2}\\sqrt{(m/a)^2 + (n/b)^2 + (p/d)^2}$.

> [!key] At high frequencies circuits become boxes of field. A metal pipe carries waves only above its cutoff $f_c = c/2a$; below it the fields die away exponentially. The guided wave is two plane waves zigzagging between the walls, with $v_p v_g = c^2$.
`,
  ideas: [
    'Driven fast enough, a capacitor\'s field varies across the plates as J₀(ωr/c); where it vanishes at the rim, the capacitor becomes a resonant cavity.',
    'The field along a metal wall must vanish, so waves in a pipe have fixed patterns (modes) across it.',
    'A rectangular pipe carries its lowest mode only above f_c = c/2a; below cutoff the field decays exponentially.',
    'The guided wave is two plane waves zigzagging between the walls at sin θ = λ/2a.',
    'Crests move at v_p = c/cos θ > c while energy moves at v_g = c cos θ < c, with v_p v_g = c².'
  ],
  pitfalls: [
    'The phase velocity above c breaks relativity — The crests are a crossing pattern of two plane waves; energy and signals travel at the group velocity, below c.',
    'A signal below cutoff simply travels more slowly — It does not travel at all: the field decays exponentially and nearly all the power is reflected.',
    'A waveguide needs a wire down the middle to carry current — A hollow pipe works; the currents flow in its walls, and the energy travels in the fields inside.'
  ],
  formulas: [
    {
      name: 'Cutoff frequency of the TE₁₀ mode',
      expr: 'fc = c/(2*a)', tex: 'f_c = \\dfrac{c}{2a}',
      vars: {
        fc: { name: 'cutoff frequency', q: 'frequency', unit: 'GHz', tex: 'f_c' },
        c: { const: 'c' },
        a: { name: 'width of the guide (the longer side)', q: 'length', unit: 'mm', value: 22.86 }
      },
      note: 'Air-filled rectangular guide; below f_c no wave travels.',
      stories: { fc: 'A rectangular guide is {a} wide. Below what frequency can no wave travel along it?', a: 'How wide must a guide be for a cutoff of {fc}?' }
    },
    {
      name: 'Guide wavelength',
      expr: 'lg = c/sqrt(f^2 - fc^2)', tex: '\\lambda_g = \\dfrac{c}{\\sqrt{f^2 - f_c^2}}',
      vars: {
        lg: { name: 'wavelength along the guide', q: 'length', unit: 'mm', tex: '\\lambda_g' },
        c: { const: 'c' },
        f: { name: 'frequency', q: 'frequency', unit: 'GHz', value: 10 },
        fc: { name: 'cutoff frequency', q: 'frequency', unit: 'GHz', value: 6.557, tex: 'f_c' }
      },
      note: 'Longer than the free-space wavelength c/f; it grows without limit as f approaches f_c.',
      stories: { lg: 'A guide with cutoff {fc} carries {f}. What is the wavelength along the guide?', f: 'At what frequency is the guide wavelength {lg} in a guide with cutoff {fc}?' }
    },
    {
      name: 'Group velocity in the guide',
      expr: 'vg = c*sqrt(1 - (fc/f)^2)', tex: 'v_g = c\\sqrt{1 - \\left(\\dfrac{f_c}{f}\\right)^2}',
      vars: {
        vg: { name: 'speed of energy along the guide', q: 'speed', unit: 'c', tex: 'v_g' },
        c: { const: 'c' },
        fc: { name: 'cutoff frequency', q: 'frequency', unit: 'GHz', value: 6.557, tex: 'f_c' },
        f: { name: 'frequency', q: 'frequency', unit: 'GHz', value: 10 }
      },
      note: 'The phase velocity is c²/v_g, faster than light.',
      stories: { vg: 'How fast does energy travel along a guide with cutoff {fc} at {f}?' }
    },
    {
      name: 'Lowest resonance of a cylindrical cavity',
      expr: 'f0 = 2.405*c/(2*pi*R)', tex: 'f_0 = \\dfrac{2.405\\,c}{2\\pi R}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'GHz', tex: 'f_0' },
        c: { const: 'c' },
        R: { name: 'radius of the can', q: 'length', unit: 'cm', value: 5 }
      },
      note: 'The mode that grows out of a capacitor: E along the axis, zero at the wall where J₀ has its first zero (2.405). Independent of the can\'s length.',
      stories: { f0: 'At what frequency does a closed metal can of radius {R} ring in its lowest mode?', R: 'What radius of can resonates at {f0}?' }
    }
  ],
  examples: [
    {
      title: 'The waveguide of a microwave oven',
      q: 'A microwave oven feeds 2.45 GHz along a WR-340 guide, 86.36 mm wide. Find the cutoff, the guide wavelength and the group velocity.',
      steps: [
        '$f_c = c/2a = 3.00\\times10^{8}/0.1727 = 1.74$ GHz, below 2.45 GHz, so the wave travels.',
        '$\\lambda_g = c/\\sqrt{f^2 - f_c^2} = 3.00\\times10^{8}/\\sqrt{(2.45\\times10^{9})^2 - (1.74\\times10^{9})^2} = 0.173$ m, against 0.122 m in free space.',
        '$v_g = c\\sqrt{1 - (1.74/2.45)^2} = 0.71\\,c$; the phase velocity is $c/0.71 = 1.42\\,c$.'
      ],
      a: 'Cutoff 1.74 GHz; guide wavelength 173 mm; energy moves at 0.71c.'
    },
    {
      title: 'Below cutoff',
      q: 'A 5 GHz signal is fed into a WR-90 guide (cutoff 6.56 GHz). How quickly does its field die away, and how much is left after 10 cm?',
      steps: [
        'Below cutoff $k = i\\kappa$ with $\\kappa = (2\\pi/c)\\sqrt{f_c^2 - f^2} = 2\\pi\\sqrt{(6.56\\times10^{9})^2 - (5\\times10^{9})^2}/3.00\\times10^{8} = 89$ m⁻¹.',
        'The field falls by a factor e every $1/\\kappa = 11$ mm. After 10 cm: $e^{-8.9} = 1.4\\times10^{-4}$ of the field, about −77 dB.'
      ],
      a: 'It decays by e every 11 mm: after 10 cm almost nothing is left.'
    },
    {
      title: 'A can that rings',
      q: 'A closed copper can has a radius of 5 cm. What is its lowest resonant frequency?',
      steps: ['$f_0 = 2.405\\,c/(2\\pi R) = 2.405\\times 3.00\\times10^{8}/(2\\pi\\times 0.05) = 2.30$ GHz.', 'It does not depend on the can\'s length, as long as the can is not much longer than wide.'],
      a: 'About 2.3 GHz.'
    }
  ],
  quiz: [
    { q: 'A signal below the cutoff frequency is fed into a waveguide. Along the guide its field…', choices: ['dies away exponentially', 'travels more slowly than above cutoff', 'travels with a shorter wavelength', 'grows until the guide overheats'], a: 0, why: 'Below cutoff k is imaginary: the field falls as e^(−κz) and nearly all the power is reflected.' },
    { q: 'The phase velocity in a waveguide is greater than c, so information can be sent faster than light down a waveguide.', a: false, why: 'The crests are a pattern made by two plane waves crossing at an angle; energy and signals travel at the group velocity, which is less than c.' },
    { q: 'Making a rectangular waveguide twice as wide…', choices: ['halves its cutoff frequency', 'doubles its cutoff frequency', 'leaves the cutoff unchanged', 'lets all frequencies through'], a: 0, why: 'f_c = c/2a: half a wavelength must fit across the width.' },
    { q: 'For waves in a waveguide, the phase velocity times the group velocity equals…', choices: ['c²', 'c', '1', 'zero'], a: 0, why: 'v_p = c/cos θ and v_g = c cos θ.' },
    { q: 'What is the TE₁₀ cutoff frequency of a guide 5 cm wide?', answer: 3.0, unit: 'GHz', why: 'f_c = c/2a = 3.00 × 10⁸/0.10 = 3.0 GHz.' }
  ],
  problems: [
    { q: 'What is the cutoff frequency of a WR-28 guide, 7.112 mm wide?', answer: 21.08, unit: 'GHz', tol: 0.02, hint: 'f_c = c/2a.',
      steps: ['$f_c = 2.998\\times10^{8}/(2\\times 7.112\\times10^{-3}) = 2.108\\times10^{10}$ Hz = 21.1 GHz.'] },
    { q: 'In a WR-90 guide (cutoff 6.557 GHz) at 12 GHz, what is the guide wavelength?', answer: 29.8, unit: 'mm', tol: 0.02, hint: 'λ_g = c/√(f² − f_c²).',
      steps: ['$\\sqrt{12^2 - 6.557^2} = \\sqrt{144 - 43.0} = 10.05$ GHz.', '$\\lambda_g = 2.998\\times10^{8}/1.005\\times10^{10} = 0.0298$ m = 29.8 mm (the free-space wavelength is 25.0 mm).'] }
  ],
  applications: [
    'Radar, satellite ground stations and microwave ovens carry their power in waveguides.',
    'Particle accelerators push particles with the fields of resonant cavities, often superconducting ones.',
    'The metal mesh in a microwave oven\'s door has holes far below cutoff for 12 cm waves: light passes, microwaves do not.',
    'Optical fibres guide light by the same principles, with glass instead of metal walls.'
  ],
  history: 'Lord Rayleigh showed in 1897 that electric waves can travel inside a hollow metal tube only above a cutoff frequency. Practical waveguides were developed in 1936 by George Southworth at Bell Laboratories and Wilmer Barrow at MIT, and became essential to microwave radar in the Second World War.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 23 (Cavity Resonators) — real circuit elements at high frequencies, a capacitor turned into a resonant cavity, and cavity modes.',
    'Vol. II, ch. 24 (Waveguides) — the transmission line, the rectangular waveguide, its cutoff frequency, the speed of guided waves and waveguide modes.'
  ],
  sim: 'max-waveguide'
},

{
  id: 'ac-circuits-feyn', parent: 'maxwell-topic', title: 'AC circuits and impedance', level: 2,
  short: 'Write every voltage and current as a rotating arrow and each element becomes a generalised resistance — R, iωL, 1/iωC — so AC circuits obey the same rules as DC ones. In a series RLC circuit the coil and capacitor arrows cancel at resonance.',
  keywords: ['AC circuit', 'impedance', 'reactance', 'phasor', 'rotating arrow', 'complex numbers', 'RLC circuit', 'resonance', 'quality factor', 'ladder network', 'filter', 'Kirchhoff'],
  prereq: ['algebra-complex-numbers', 'resonance-feyn', 'induction-laws'],
  related: ['waveguides-feyn', 'transients-feyn', 'linear-systems', 'electronics:impedance', 'electronics:phasors-ac', 'electronics:resonance-q', 'math:phasors'],
  body: `
Feynman's lecture on AC circuits starts from Maxwell's equations and asks: when may we forget about the fields and just draw a circuit? The answer — when the circuit is small compared with a wavelength, so that the current is the same all along each wire and the fields of each part stay inside it — gives the familiar ideal elements. Then comes the trick that makes AC circuits as easy as DC ones.

### Rotating arrows
Write every voltage and current as the real part of a [[?complex-number|complex number]] turning at [[?angular-frequency|angular frequency]] ω, $V(t) = \\mathrm{Re}(\\hat V e^{i\\omega t})$ — a [[?rotating-arrow]] whose length is the amplitude and whose angle is the [[?phase]]. For such signals every ideal element becomes a generalised resistance, its **impedance** $z = \\hat V/\\hat I$:

| Element | Law | Impedance | Voltage compared with current |
|---|---|---|---|
| resistor | $V = RI$ | $R$ | in step |
| inductor | $V = L\\,dI/dt$ | $i\\omega L$ | a quarter-turn ahead |
| capacitor | $I = C\\,dV/dt$ | $1/i\\omega C$ | a quarter-turn behind |

Taking the [[?derivative]] of a rotating arrow multiplies it by $i\\omega$ — that is the whole trick — and multiplying by the [[?imaginary-unit|imaginary unit]] $i$ turns an arrow a quarter-turn. Kirchhoff's rules then work exactly as for resistors: impedances in series add, and in parallel their reciprocals add.

### The series RLC circuit
Put a resistor, a coil and a capacitor in series across a source of amplitude $V_0$:

$$z = R + i\\left(\\omega L - \\frac{1}{\\omega C}\\right), \\qquad |\\hat I| = \\frac{V_0}{|z|}$$

In the simulation the arrows turn: $V_R$ in step with the current, $V_L$ a quarter-turn ahead, $V_C$ a quarter-turn behind, and their head-to-tail sum is the source. What an oscilloscope shows is each arrow's shadow on the vertical axis. At the **resonant frequency** $\\omega_0 = 1/\\sqrt{LC}$ the coil's and the capacitor's arrows are equal and opposite and cancel: the impedance is just R and the current is largest. With R = 10 Ω, L = 10 mH and C = 1 µF, resonance is at 1.59 kHz; a 10 V source then drives 1 A, and the coil and the capacitor each have 100 V across them — ten times the source, possible only because they almost exactly cancel. That ratio is the quality factor $Q = \\omega_0L/R$.

Only the resistor takes energy on average, $\\tfrac12|\\hat I|^2R$. The coil and the capacitor store energy and give it back each cycle, a quarter-turn out of step with the current.

### Ladders and filters
Feynman then chained elements into an infinite ladder of series coils and shunt capacitors. Such a ladder passes low frequencies and blocks those above $\\omega = 2/\\sqrt{LC}$: a filter. Make the elements smaller and more numerous and the ladder becomes a transmission line, carrying waves at a definite speed — the bridge from circuits back to fields, and on to [[waveguides-feyn|waveguides]].

> [!key] With signals written as rotating arrows, every element is an impedance — R, iωL, 1/iωC — and AC circuits obey the same rules as DC ones. In a series RLC circuit the arrows of the coil and the capacitor cancel at ω₀ = 1/√(LC).
`,
  ideas: [
    'A sinusoidal signal is the shadow of a rotating arrow, V(t) = Re(V̂ e^{iωt}).',
    'Differentiating a rotating arrow multiplies it by iω, so every element becomes an impedance: R, iωL, 1/iωC.',
    'With impedances, Kirchhoff\'s rules and series/parallel combinations work exactly as for resistors.',
    'In a series RLC circuit the coil and capacitor voltages are opposite; at ω₀ = 1/√(LC) they cancel and the current peaks.',
    'Only resistance absorbs energy on average; coils and capacitors store and return it.'
  ],
  pitfalls: [
    'The voltages round a series AC circuit add up as numbers — They add as arrows: 100 V across the coil and 100 V across the capacitor can sum to nothing.',
    'A capacitor blocks AC as it blocks DC — Its impedance 1/ωC falls as the frequency rises; at high frequency it is nearly a short circuit.',
    'Impedance is a resistance that happens to depend on frequency — It also carries a phase: iωL and 1/iωC turn the voltage arrow a quarter-turn relative to the current.'
  ],
  formulas: [
    {
      name: 'Impedance of a series RLC circuit',
      expr: 'Z = sqrt(R^2 + (1/(2*pi*f*C) - 2*pi*f*L)^2)', tex: 'Z = \\sqrt{R^2 + \\left(\\dfrac{1}{2\\pi f C} - 2\\pi f L\\right)^2}',
      vars: {
        Z: { name: 'size of the impedance |z|', q: 'resistance', unit: 'Ω', tex: 'Z' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 },
        f: { name: 'frequency', q: 'frequency', unit: 'Hz', value: 1000 },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 }
      },
      note: 'Ideal elements. Two frequencies, one on each side of resonance, give the same |z|.',
      stories: { Z: 'R = {R}, L = {L} and C = {C} are in series. What is the size of their impedance at {f}?', f: 'At what frequencies does a series circuit of {R}, {L} and {C} have an impedance of {Z}?' }
    },
    {
      name: 'Resonant frequency',
      expr: 'f0 = 1/(2*pi*sqrt(L*C))', tex: 'f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}',
      vars: {
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'Hz', tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        C: { name: 'capacitance', q: 'capacitance', unit: 'µF', value: 1 }
      },
      note: 'Where ωL = 1/ωC and the coil and capacitor arrows cancel.',
      stories: { f0: 'At what frequency does {L} resonate with {C}?', C: 'What capacitor tunes a coil of {L} to {f0}?' }
    },
    {
      name: 'Quality factor of a series circuit',
      expr: 'Qf = 2*pi*f0*L/R', tex: 'Q = \\dfrac{2\\pi f_0 L}{R}',
      vars: {
        Qf: { name: 'quality factor', tex: 'Q' },
        f0: { name: 'resonant frequency', q: 'frequency', unit: 'Hz', value: 1591.5, tex: 'f_0' },
        L: { name: 'inductance', q: 'inductance', unit: 'mH', value: 10 },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 }
      },
      note: 'At resonance the coil and capacitor voltages are Q times the source; the resonance peak is about f₀/Q wide.',
      stories: { Qf: 'A series circuit with {L} and {R} resonates at {f0}. What is its Q?' }
    },
    {
      name: 'Mean power in the resistor',
      expr: 'P = I0^2*R/2', tex: 'P = \\tfrac{1}{2}\\,I_0^2 R',
      vars: {
        P: { name: 'average power', q: 'power', unit: 'W' },
        I0: { name: 'current amplitude', q: 'current', unit: 'A', value: 1, tex: 'I_0' },
        R: { name: 'resistance', q: 'resistance', unit: 'Ω', value: 10 }
      },
      note: 'The ½ comes from averaging cos² over a cycle; coils and capacitors take no power on average.',
      stories: { P: 'A current of amplitude {I0} flows through {R}. What average power does it dissipate?' }
    }
  ],
  examples: [
    {
      title: 'Below resonance',
      q: 'R = 10 Ω, L = 10 mH and C = 1 µF are in series across a 10 V (amplitude), 1 kHz source. Find the impedance, the current and its phase.',
      steps: [
        '$\\omega = 2\\pi\\times 1000 = 6283$ rad/s; $\\omega L = 62.8$ Ω; $1/\\omega C = 159.2$ Ω.',
        '$z = 10 + i(62.8 - 159.2) = 10 - 96.3i$ Ω, so $|z| = \\sqrt{10^2 + 96.3^2} = 96.8$ Ω.',
        '$|\\hat I| = 10/96.8 = 0.103$ A. The current arrow leads the source by $\\arctan(96.3/10) = 84°$: below resonance the capacitor dominates.'
      ],
      a: '|z| = 96.8 Ω; the current is 0.10 A, leading the voltage by 84°.'
    },
    {
      title: 'At resonance',
      q: 'For the same circuit, find the resonant frequency, the current and the voltage across the coil.',
      steps: [
        '$\\omega_0 = 1/\\sqrt{LC} = 1/\\sqrt{10^{-8}} = 10^{4}$ rad/s, $f_0 = 1.59$ kHz.',
        '$z = R = 10$ Ω, so $|\\hat I| = 1$ A.',
        '$|V_L| = \\omega_0 L|\\hat I| = 10^{4}\\times 0.01 \\times 1 = 100$ V — ten times the source. $Q = \\omega_0L/R = 10$.'
      ],
      a: '1.59 kHz; 1 A; 100 V across the coil (and across the capacitor).'
    },
    {
      title: 'A ladder filter',
      q: 'A long ladder has 1 mH coils in series and 1 µF capacitors to ground. Above what frequency does it stop passing signals?',
      steps: ['$\\omega_c = 2/\\sqrt{LC} = 2/\\sqrt{10^{-9}} = 6.32\\times10^{4}$ rad/s.', '$f_c = \\omega_c/2\\pi = 10.1$ kHz.'],
      a: 'About 10 kHz.'
    }
  ],
  quiz: [
    { q: 'The voltage across an ideal inductor, compared with the current through it, is…', choices: ['a quarter-cycle ahead', 'a quarter-cycle behind', 'in step', 'half a cycle ahead'], a: 0, why: 'V = L dI/dt, and differentiating a rotating arrow multiplies it by iω: a quarter-turn forward.' },
    { q: 'At resonance, the impedance of a series RLC circuit is…', choices: ['R', 'zero', 'infinite', 'ωL'], a: 0, why: 'The imaginary parts iωL and 1/iωC cancel, leaving only R.' },
    { q: 'In a series RLC circuit at resonance, the voltage across the capacitor can be many times the source voltage.', a: true, why: 'It is Q times the source; the coil\'s voltage is just as large and opposite, so round the loop they cancel.' },
    { q: 'Multiplying a rotating arrow V̂e^{iωt} by iω is the same as…', choices: ['taking its time derivative', 'integrating it over time', 'doubling its frequency', 'taking its real part'], a: 0, why: 'd/dt e^{iωt} = iω e^{iωt}: a quarter-turn forward and a stretch by ω.' },
    { q: 'What is the resonant frequency of a 1 mH coil with a 1 nF capacitor?', answer: 159.2, unit: 'kHz', why: 'f₀ = 1/(2π√(10⁻³ × 10⁻⁹)) = 1/(2π × 10⁻⁶) = 159 kHz.' }
  ],
  problems: [
    { q: 'What is the size of the impedance of a 100 nF capacitor at 1 kHz?', answer: 1592, unit: 'Ω', tol: 0.02, hint: '|z| = 1/ωC.',
      steps: ['$1/(2\\pi\\times 1000\\times 10^{-7}) = 1592$ Ω.'] },
    { q: 'A radio tuner uses a 250 µH coil and a 100 pF capacitor. To what frequency is it tuned?', answer: 1.007, unit: 'MHz', tol: 0.02, hint: 'f₀ = 1/(2π√(LC)).',
      steps: ['$LC = 2.5\\times10^{-4}\\times 10^{-10} = 2.5\\times10^{-14}$ s², $\\sqrt{LC} = 1.58\\times10^{-7}$ s.', '$f_0 = 1/(2\\pi\\times 1.58\\times10^{-7}) = 1.007$ MHz — in the medium-wave band.'] }
  ],
  applications: [
    'Every radio receiver selects a station with a resonant circuit.',
    'Filters in audio equipment, power supplies and telephone lines are ladders of coils and capacitors.',
    'Power engineers correct the phase between current and voltage (the power factor) with capacitors.',
    'Wireless chargers and induction hobs drive resonant coils to transfer power efficiently.'
  ],
  history: 'Oliver Heaviside coined the words "impedance" and "inductance" in 1886. In 1893 Arthur Kennelly and Charles Proteus Steinmetz showed engineers how to calculate AC circuits with complex numbers, which turned a tangle of differential equations into the algebra of rotating arrows.',
  sources: [
    '*The Feynman Lectures on Physics*, Vol. II, ch. 22 (AC Circuits) — impedances, generators, networks of ideal elements, Kirchhoff\'s rules, equivalent circuits, energy, a ladder network and filters.',
    'Vol. I, ch. 23 (Resonance) — complex numbers for a driven oscillator, and the electrical resonant circuit.',
    'Vol. I, ch. 22 (Algebra) — complex numbers and Euler\'s formula, the tools behind the rotating arrows.'
  ],
  sim: 'max-phasors'
}

);
