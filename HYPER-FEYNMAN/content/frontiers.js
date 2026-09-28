/* HYPER-FEYNMAN · content/frontiers.js — Feynman's frontiers: ideas he launched beyond the lectures.
 *   room-at-the-bottom · quantum-computing-origin · computation-reversible · superfluid-helium ·
 *   weak-interaction-v-a · parton-model · challenger-o-ring · feynman-life
 * Simulations in sims/frontiers.js (prefix fr-). */
Hyper.add(

{
  id: 'room-at-the-bottom', parent: 'feynman-ideas', title: 'There\'s plenty of room at the bottom', level: 1,
  short: 'In a talk of 29 December 1959 Feynman worked out that the whole Encyclopaedia Britannica would fit on the head of a pin — and that every printed dot would still contain about a thousand atoms. Writing, storing and building at the scale of atoms breaks no law of physics.',
  keywords: ['nanotechnology', 'Plenty of Room at the Bottom', 'pinhead', 'Encyclopaedia Britannica', 'miniaturisation', 'electron-beam lithography', 'atoms', 'information storage', 'bits', 'scaling laws', 'MEMS', 'STM', 'Feynman prizes', 'McLellan', 'Tom Newman'],
  prereq: ['atomic-hypothesis', 'time-and-distance', 'math:scientific-notation'],
  related: ['quantum-computing-origin', 'computation-reversible', 'feynman-life', 'physics:resolution', 'math:power-functions', 'electronics:cmos-logic'],
  body: `
On 29 December 1959, at the annual meeting of the American Physical Society held at Caltech, Feynman gave an after-dinner talk with an unusual invitation. A whole field of physics, he said, was waiting to be opened — not at the frontier of the very large or the very energetic, but in the problem of manipulating and controlling things on a very small scale. The talk, "There's Plenty of Room at the Bottom", was printed in Caltech's *Engineering and Science* in February 1960, and is now remembered as the first vision of nanotechnology.

### The encyclopaedia on the head of a pin
He began with a test: could the whole *Encyclopaedia Britannica* be written on the head of a pin? The arithmetic fits on a napkin. A pinhead is about 1/16 inch (1.6 mm) across, an area of about 2 mm². Enlarge it 25 000 times in every direction and its area grows by $25\\,000^2 \\approx 6\\times10^{8}$ — areas go as the square of lengths, an [[?exponent]] of 2 — to about 1200 m², roughly the area of all the pages of the encyclopaedia. So the reduction needed is a factor of 25 000 in length.

Would the letters dissolve into atoms? Take the finest dots of a halftone picture, about 1/120 inch (0.2 mm) across. Shrunk 25 000 times, a dot is about 8.5 nm wide: still some 34 atoms across if atoms sit a quarter of a nanometre apart, and about a thousand atoms in its area. The letters would be made of plenty of atoms.

**In the simulation**, fly in from a full-size page to the pin lying on it. The whole book appears as a dust of pages on the head, then one page, its lines, one letter built of dots — and finally the atoms inside one dot. The read-out counts them.

| Scale | Size | Atoms across (0.25 nm apart) |
|---|---|---|
| Pinhead | 1.6 mm | $6\\times10^{6}$ |
| One page shrunk 25 000 times | 9 µm × 11 µm | $4\\times10^{4}$ |
| A small letter, shrunk | about 60 nm | 240 |
| Finest printing dot, shrunk | 8.5 nm | 34 |
| One bit of 5 × 5 × 5 atoms | 1.25 nm | 5 |

### Writing and reading so small
To write, Feynman suggested running the lenses of an electron microscope backwards: focus a beam of electrons or ions to a tiny spot and draw with it — very close to electron-beam lithography, which patterns chips today. To read, an electron microscope. He urged physicists to make such microscopes a hundred times better, so that biologists could simply look at where each atom of a molecule sits.

### All the books in the world in a speck of dust
Then he counted information instead of area. Write each bit as a little cube of $5\\times5\\times5 = 125$ atoms. All the books in the world, he estimated, hold about $10^{15}$ bits; $1.25\\times10^{17}$ atoms make a cube only $\\sqrt[3]{1.25\\times10^{17}} \\approx 5\\times10^{5}$ atoms on a side — about 0.13 mm, a speck barely visible to the eye (a cube root is the [[?exponent|power]] ⅓, so it divides a power of ten by three). Living cells prove that it can be done: DNA stores genetic information with a few dozen atoms per bit.

### Machines at the bottom
The second half of the talk turned to machines: tiny motors, a surgeon you could swallow (an idea he credited to his friend Albert Hibbs), and a chain of ever smaller mechanical hands, each set building the next one a quarter of its size. He warned that small machines are not scaled-down big ones. Weight and inertia go as the cube of the size, surfaces as the square, so at small sizes sticking (van der Waals attraction), friction and viscosity win over gravity; at the very bottom, quantum mechanics rules. Finally he asked for atoms to be put one by one where we want them — the chemist's goal of synthesis carried to its limit — arguing that this was a question of technique, not of principle.

> [!key] Shrink every length 25 000 times and the whole encyclopaedia fits on a pinhead, yet each printed dot still holds about a thousand atoms. The estimate is all [[?scientific-notation|powers of ten]]: there is plenty of room at the bottom.

### Two prizes
He closed by offering two prizes of a thousand dollars: one for the first working electric motor that fits in a cube 1/64 inch (0.4 mm) on a side, the other for the first person to shrink a page of a book 25 000 times in length so that it can be read with an electron microscope. William McLellan claimed the first in 1960 with a hand-built motor. The second waited until 1985, when Tom Newman, a Stanford graduate student, wrote the first page of Dickens's *A Tale of Two Cities* at that scale with an electron beam.
`,
  ideas: [
    'Shrinking every length 25 000 times puts the whole Encyclopaedia Britannica on a pinhead 1.6 mm across.',
    'Even then each printed dot is about 8.5 nm across — some 34 atoms wide and about a thousand atoms in area.',
    'Counting bits: 10¹⁵ bits at 125 atoms each fill a cube only about 0.13 mm on a side.',
    'Small machines meet different physics: surface forces, friction and viscosity grow in importance while weight and inertia fade.',
    'For Feynman, arranging atoms one by one was a problem of technique, not of principle.'
  ],
  pitfalls: [
    'Writing that small would need letters smaller than atoms — The arithmetic shows the opposite: after a 25 000-fold reduction every dot still holds about a thousand atoms.',
    'A machine shrunk in every dimension works the same way — Areas scale as L² and volumes as L³, so at small sizes sticking and viscosity overwhelm weight and inertia; the design has to change.',
    'The talk launched nanotechnology at once — It was rarely cited for about two decades; the field grew with the scanning tunnelling microscope (1981) and the talk was rediscovered afterwards.'
  ],
  formulas: [
    {
      name: 'The length reduction that fits a book on a pinhead',
      expr: 'M = sqrt(4*N*Ap/(pi*d^2))', tex: 'M = \\sqrt{\\dfrac{4 N A_p}{\\pi d^2}}',
      vars: {
        M: { name: 'reduction factor in length', tex: 'M' },
        N: { name: 'number of pages', q: 'count', value: 24000, int: true },
        Ap: { name: 'area of one page', q: 'area', unit: 'm²', value: 0.0616, tex: 'A_p' },
        d: { name: 'diameter of the pinhead', q: 'length', unit: 'mm', value: 1.59 }
      },
      note: 'Areas shrink as M², so M is the square root of (area of all the pages) / (area of the pinhead, πd²/4).',
      stories: {
        M: 'An encyclopaedia of {N} pages, each of {Ap}, is to be written on a pinhead {d} across. By what factor must every length be reduced?',
        d: 'A book of {N} pages of {Ap} each is reduced {M} times in length. How wide a round spot does it fill?'
      }
    },
    {
      name: 'Atoms across a printed dot after the reduction',
      expr: 'n = s/(M*a)', tex: 'n = \\dfrac{s}{M a}',
      vars: {
        n: { name: 'atoms across one dot' },
        s: { name: 'size of the dot at full scale', q: 'length', unit: 'mm', value: 0.212 },
        M: { name: 'reduction factor in length', value: 25000 },
        a: { name: 'spacing of the atoms', q: 'length', unit: 'nm', value: 0.25 }
      },
      note: 'A dot of 1/120 inch (0.212 mm) shrunk 25 000 times is 8.5 nm wide: about 34 atoms across, some 900 in its area.',
      stories: { n: 'A printing dot {s} across is reduced {M} times. How many atoms {a} apart span it?', M: 'How much can a dot {s} across be reduced if it must stay {n} atoms (spacing {a}) wide?' }
    },
    {
      name: 'A cube of atoms that stores B bits',
      expr: 'L = a*cbrt(nb*B)', tex: 'L = a\\sqrt[3]{n_b B}',
      vars: {
        L: { name: 'edge of the cube of material', q: 'length', unit: 'mm' },
        a: { name: 'spacing of the atoms', q: 'length', unit: 'nm', value: 0.25 },
        nb: { name: 'atoms used for one bit', q: 'count', value: 125, tex: 'n_b' },
        B: { name: 'bits to store', q: 'count', value: 1e15 }
      },
      note: 'n_b·B atoms fill a cube with ∛(n_b·B) atoms on each edge. Feynman used 5 × 5 × 5 = 125 atoms per bit and about 10¹⁵ bits for all the books in the world.',
      stories: { L: 'Store {B}, each bit made of {nb} atoms spaced {a}. How big is the cube?', B: 'How many bits, at {nb} atoms spaced {a} each, fit in a cube {L} on a side?' }
    }
  ],
  examples: [
    {
      title: 'The encyclopaedia on a pinhead',
      q: 'A pinhead is 1.59 mm across. An encyclopaedia has 24 000 pages of 28 cm × 22 cm. By what factor must every length be reduced for the whole work to fit on the head?',
      steps: [
        'Area of all the pages: $24\\,000 \\times 0.28 \\times 0.22 = 1478\\ \\mathrm{m^2}$.',
        'Area of the pinhead: $\\pi d^2/4 = \\pi (1.59\\times10^{-3})^2/4 = 1.99\\times10^{-6}\\ \\mathrm{m^2}$.',
        'Areas shrink as the square of lengths, so the length factor is the [[?square-root]] of the area ratio: $M = \\sqrt{1478/1.99\\times10^{-6}} = \\sqrt{7.4\\times10^{8}} \\approx 27\\,000$.'
      ],
      a: 'About 27 000 — the same order as the 25 000 of the talk.'
    },
    {
      title: 'How many atoms in a printed dot?',
      q: 'The finest dots of a halftone picture are 1/120 inch (0.212 mm) across. Reduce them 25 000 times. How many atoms span a dot, and how many lie in its area, if atoms are 0.25 nm apart?',
      steps: [
        '$0.212\\ \\mathrm{mm}/25\\,000 = 8.5\\times10^{-9}$ m = 8.5 nm.',
        '$8.5/0.25 = 34$ atoms across.',
        'In the area of a round dot: $\\tfrac{\\pi}{4}\\times 34^2 \\approx 900$ — about a thousand atoms.'
      ],
      a: '34 atoms across and about 900 in the area of the dot: plenty to make a clean dot.'
    },
    {
      title: 'All the books in the world in a speck',
      q: 'Store $10^{15}$ bits, each as a cube of 5 × 5 × 5 atoms spaced 0.25 nm apart. How big is the cube of material?',
      steps: [
        'Atoms needed: $125 \\times 10^{15} = 1.25\\times10^{17}$.',
        'Atoms along one edge: $\\sqrt[3]{1.25\\times10^{17}} = 5.0\\times10^{5}$.',
        'Edge: $5.0\\times10^{5} \\times 0.25\\ \\mathrm{nm} = 1.25\\times10^{-4}$ m ≈ 0.13 mm.'
      ],
      a: 'A cube about 0.13 mm on a side (about 1/200 inch) — a speck of dust.'
    }
  ],
  quiz: [
    { q: 'To fit the encyclopaedia on the pinhead, lengths are reduced 25 000 times. By what factor are areas reduced?', choices: ['about 6 × 10⁸ (25 000²)', '25 000', 'about 158 (√25 000)', 'about 1.6 × 10¹³ (25 000³)'], a: 0, why: 'Area scales as length squared: 25 000² = 6.25 × 10⁸.' },
    { q: 'After a 25 000-fold reduction, the finest printing dot is about…', choices: ['8.5 nm across, some 34 atoms wide', 'smaller than one atom', '1 µm across, visible in a light microscope', 'exactly one atom'], a: 0, why: '0.212 mm / 25 000 = 8.5 nm, and 8.5 / 0.25 = 34.' },
    { q: 'Feynman argued that the laws of physics forbid putting individual atoms where we want them.', a: false, why: 'The opposite: he argued it was a matter of technique, not of principle. In 1989 Don Eigler\'s group spelled IBM with 35 xenon atoms.' },
    { q: 'Why do very small machines not work like scaled-down big ones?', choices: ['Surface forces such as sticking and viscosity grow in importance while weight and inertia fade', 'Atoms grow when machines shrink', 'Energy is not conserved at small scales', 'Friction disappears at small scales'], a: 0, why: 'Weight goes as L³, surface forces as L² or L: at small L the surface forces win.' },
    { q: 'A bit is stored as a cube of 5 × 5 × 5 atoms spaced 0.25 nm. How long is the edge of the cube, in nm?', answer: 1.25, unit: 'nm', why: '5 atoms × 0.25 nm = 1.25 nm.' }
  ],
  problems: [
    { q: 'By what factor must every length be reduced to fit a 1000-page book of A4 pages (0.210 m × 0.297 m) onto a round spot 1 mm across?', answer: 8910, tol: 0.02, hint: 'Compare the total page area with πd²/4, then take the square root.',
      steps: ['Pages: $1000 \\times 0.210 \\times 0.297 = 62.4\\ \\mathrm{m^2}$.', 'Spot: $\\pi (10^{-3})^2/4 = 7.85\\times10^{-7}\\ \\mathrm{m^2}$.', '$M = \\sqrt{62.4/7.85\\times10^{-7}} = \\sqrt{7.94\\times10^{7}} \\approx 8910$.'] },
    { q: 'At a reduction of 25 000, how many atoms (0.25 nm apart) tall is a letter that was 2 mm tall?', answer: 320, tol: 0.02,
      steps: ['$2\\ \\mathrm{mm}/25\\,000 = 8\\times10^{-8}$ m = 80 nm.', '$80/0.25 = 320$ atoms.'] }
  ],
  applications: [
    'Electron-beam lithography writes chip patterns with a focused beam — much as the talk proposed for writing small.',
    'Scanning tunnelling and atomic-force microscopes image single atoms and can move them one at a time.',
    'Micro-electro-mechanical systems (MEMS): the accelerometers and gyroscopes in phones are machines a fraction of a millimetre across, ruled by the scaling the talk described.',
    'Data storage keeps approaching a few atoms per bit, and DNA itself is being studied as an archival storage medium.'
  ],
  history: 'The talk was given on 29 December 1959 and printed in *Engineering and Science* in February 1960. It was little cited for about two decades. Norio Taniguchi coined the word *nanotechnology* in 1974 and K. Eric Drexler popularised it in the 1980s; Gerd Binnig and Heinrich Rohrer built the scanning tunnelling microscope at IBM Zürich in 1981 (Nobel Prize 1986), and in 1989 Don Eigler\'s group at IBM arranged 35 xenon atoms into the letters IBM. The motor prize was claimed by William McLellan in 1960 and the writing prize by Tom Newman in 1985. Feynman came back to the subject in a talk on "Infinitesimal Machinery" in 1983.',
  sources: [
    '"There\'s Plenty of Room at the Bottom" — talk at the annual meeting of the American Physical Society, Caltech, 29 December 1959; printed in *Engineering and Science* (Caltech), February 1960: the encyclopaedia on a pinhead, all the books in a speck of dust, small machines, and the two prizes.',
    '*The Pleasure of Finding Things Out* (essay collection, 1999) — reprints the talk.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 1 (Atoms in Motion) — how big atoms are, and the atomic hypothesis the whole estimate rests on.'
  ],
  sim: 'fr-pinhead'
},

{
  id: 'quantum-computing-origin', parent: 'feynman-ideas', title: 'Simulating physics with computers', level: 2,
  short: 'In 1981 Feynman argued that a classical computer cannot simulate quantum physics efficiently — n spins need 2ⁿ complex amplitudes — and proposed instead a computer made of quantum parts. It is the seed of the quantum computer.',
  keywords: ['quantum computer', 'quantum simulation', 'qubit', '2^n', 'exponential', 'entanglement', 'universal quantum simulator', 'Endicott House', 'Hadamard gate', 'CNOT', 'Bell state', 'Grover', 'Benioff', 'Deutsch', 'Shor'],
  prereq: ['probability-amplitudes', 'spin-half', 'two-state-systems', 'math:exponential-functions'],
  related: ['computation-reversible', 'room-at-the-bottom', 'identical-particles', 'quantum-reality', 'hamiltonian-matrix', 'math:matrices', 'electronics:logic-gates'],
  body: `
In May 1981 physicists and computer scientists met at MIT's Endicott House for the first conference on the Physics of Computation. Feynman's keynote, "Simulating Physics with Computers" (printed in the *International Journal of Theoretical Physics* in 1982), asked a question that sounds modest: can a computer simulate nature *exactly*, with the amount of computing growing only in proportion to the size of the piece of nature being simulated? For classical physics, with care, yes. For quantum physics, he argued, a classical computer cannot — but a computer built of quantum parts could.

### Why 2ⁿ numbers
Take one spin-½ particle. It has two [[?base-states|base states]], up and down, and its state is a pair of [[?amplitude|amplitudes]] — two [[?complex-number|complex numbers]]. Two spins have four base states, ↑↑, ↑↓, ↓↑, ↓↓, and the state needs four amplitudes, not two plus two: the pair can be in a [[?superposition]] such as $(|{\\uparrow\\uparrow}\\rangle + |{\\downarrow\\downarrow}\\rangle)/\\sqrt2$, which cannot be split into a state of each spin separately (it is *entangled*). Three spins need 8 amplitudes, and $n$ spins need $2^n$ — every added spin doubles the list (an [[?exponent]] in $n$, not a multiple of it).

| Spins $n$ | Amplitudes $2^n$ | Memory at 16 bytes each |
|---|---|---|
| 10 | 1024 | 16 kB |
| 30 | $1.1\\times10^{9}$ | 17 GB — a laptop |
| 50 | $1.1\\times10^{15}$ | 18 PB — beyond the largest supercomputers |
| 300 | $2\\times10^{90}$ | more numbers than atoms in the observable universe (about $10^{80}$) |

To follow the system in time is worse: at each step every amplitude is updated from the others, a multiplication by a $2^n\\times2^n$ [[?matrix]]. Nature does this effortlessly with 300 spins; a classical machine cannot even store the list.

### Could random numbers do it instead?
A classical computer can imitate diffusion by flipping coins, because diffusion is described by ordinary [[?probability|probabilities]]. Feynman asked whether quantum mechanics could be imitated the same way — a machine that produces each outcome with the right probability, without storing the amplitudes. Using the correlations of two photons' polarisations, the situation of Bell's theorem, he showed that no local machine working with ordinary probabilities can reproduce the quantum predictions: somewhere it would need *negative* probabilities. The obstacle is interference — amplitudes can cancel, probabilities cannot.

### Let nature compute
His way out: build the simulator from quantum systems — spins or two-state atoms whose interactions can be arranged at will — and let them imitate the system of interest. Such a *universal quantum simulator*, he conjectured, would need resources that grow only in proportion to the size of the system simulated, for any system with local interactions. Seth Lloyd proved the conjecture in 1996.

### Watch the amplitudes
**The simulation** runs a circuit on three quantum bits. Each of the eight base states $|000\\rangle \\dots |111\\rangle$ has an amplitude, drawn as an arrow; the bar under it is its probability, the [[?absolute-square]] of the arrow. The Hadamard gate H turns $|0\\rangle$ into $(|0\\rangle + |1\\rangle)/\\sqrt2$; a controlled-NOT flips one qubit when another is 1; phase gates turn arrows without changing their lengths. Apply H twice and the two ways of reaching $|1\\rangle$ cancel, exactly as at a dark fringe; run Grover's search on two qubits and the arrows conspire to put all the probability on the marked state. Below, a bar grows as you add qubits: the memory a classical computer would need.

> [!key] The state of $n$ two-state systems is a list of $2^n$ complex amplitudes, and it is the interference of those amplitudes that no classical random process can imitate. So simulate quantum physics with quantum physics.
`,
  ideas: [
    'n spin-½ particles have 2ⁿ base states, so their state needs 2ⁿ complex amplitudes.',
    'Each added spin doubles the memory a classical computer needs: 50 spins already need about 18 PB.',
    'Ordinary probabilities cannot cancel; quantum amplitudes can. No local classical random machine reproduces quantum correlations.',
    'Feynman proposed a computer of controllable quantum parts that imitates another quantum system — a universal quantum simulator.',
    'Gates change amplitudes: H makes superpositions, CNOT entangles, phase gates turn the arrows; measuring gives each outcome with probability |amplitude|².'
  ],
  pitfalls: [
    'A quantum computer tries all answers at once and reads them all out — A measurement gives one outcome; the art of a quantum algorithm is to make the amplitudes of wrong answers cancel.',
    'n qubits hold n bits more cleverly than n classical bits — Their state needs 2ⁿ amplitudes to describe, but a measurement still yields only n bits.',
    'Classical computers simulate quantum systems slowly but fine — For general systems the cost doubles with every particle, so beyond about 50 spins exact simulation is out of reach.'
  ],
  formulas: [
    {
      name: 'Amplitudes needed for n two-state systems',
      expr: 'N = 2^n', tex: 'N = 2^{n}',
      vars: {
        N: { name: 'number of complex amplitudes', q: 'count' },
        n: { name: 'number of two-state systems (spins, qubits)', q: 'count', value: 50, int: true }
      },
      note: 'One amplitude per base state; the base states of n two-state systems are all the strings of n ups and downs.',
      stories: { N: 'How many amplitudes describe {n} spin-½ particles?', n: 'A state is described by {N} amplitudes. How many spins is that?' }
    },
    {
      name: 'Memory a classical computer needs',
      expr: 'Mb = b*2^n', tex: 'M = b\\cdot 2^{n}',
      vars: {
        Mb: { name: 'memory to store the state', q: false, unit: 'bytes', tex: 'M' },
        b: { name: 'memory per complex amplitude', q: false, unit: 'bytes', value: 16 },
        n: { name: 'number of qubits', q: 'count', value: 40, int: true }
      },
      note: 'Two double-precision numbers (real and imaginary parts) take 16 bytes.',
      stories: { Mb: 'How much memory holds the state of {n} qubits at {b} per amplitude?', n: 'A computer has {Mb} of memory. How many qubits can it simulate exactly at {b} per amplitude?' }
    }
  ],
  examples: [
    {
      title: 'Memory for forty spins',
      q: 'How much memory does a classical computer need to store the state of 40 spin-½ particles, at 16 bytes per complex amplitude?',
      steps: ['$2^{40} = 1.10\\times10^{12}$ amplitudes.', 'Times 16 bytes: $1.76\\times10^{13}$ bytes, about 18 TB.'],
      a: 'About 18 terabytes — a large computer; ten more spins would need 1024 times as much.'
    },
    {
      title: 'Making an entangled pair',
      q: 'Two qubits start in $|00\\rangle$. Apply H to the first, then a CNOT with the first as control. What are the amplitudes?',
      steps: [
        'H turns $|0\\rangle$ into $(|0\\rangle + |1\\rangle)/\\sqrt{2}$, so the pair becomes $(|00\\rangle + |10\\rangle)/\\sqrt{2}$.',
        'The CNOT flips the second qubit when the first is 1: $|10\\rangle \\to |11\\rangle$.',
        'Result: $(|00\\rangle + |11\\rangle)/\\sqrt{2}$ — amplitude 0.707 for 00 and 11, zero for 01 and 10.'
      ],
      a: 'Measuring gives 00 or 11, each with probability ½, never 01 or 10: the two qubits are entangled.'
    },
    {
      title: 'Interference undoes a superposition',
      q: 'Apply H twice to $|0\\rangle$. Why is the result $|0\\rangle$ again?',
      steps: [
        'After the first H the amplitudes are $\\tfrac{1}{\\sqrt{2}}$ for 0 and $\\tfrac{1}{\\sqrt{2}}$ for 1.',
        'The second H sends 0 to $\\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$ and 1 to $\\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)$.',
        'Adding: the amplitude of 0 is $\\tfrac12 + \\tfrac12 = 1$; the amplitude of 1 is $\\tfrac12 - \\tfrac12 = 0$. The two ways to reach 1 cancel.'
      ],
      a: '$|0\\rangle$ with certainty — the amplitudes interfere, as at the fringes of two slits.'
    }
  ],
  quiz: [
    { q: 'Adding one more spin to a quantum system multiplies the number of amplitudes a classical computer must store by…', choices: ['2', 'n + 1', 'n²', '16'], a: 0, why: 'Every base state of n spins splits into two (the new spin up or down): 2ⁿ → 2ⁿ⁺¹.' },
    { q: 'Roughly how many spin-½ particles have more amplitudes than there are atoms in the observable universe (about 10⁸⁰)?', choices: ['about 270', 'about 80', 'about 10⁸⁰', 'about 30'], a: 0, why: '2²⁶⁶ ≈ 10⁸⁰, since log₂10⁸⁰ = 80 / 0.301 ≈ 266.' },
    { q: 'Feynman showed that a classical computer using random numbers could imitate any quantum system exactly, only more slowly.', a: false, why: 'He argued the opposite: quantum correlations of the kind in Bell\'s theorem cannot be reproduced by local classical probabilities; interference needs amplitudes that can cancel.' },
    { q: 'What did Feynman propose instead?', choices: ['A simulator made of quantum systems whose interactions can be controlled', 'Faster transistors', 'Simulating only the probabilities', 'Giving up exact simulation of quantum physics'], a: 0, why: 'A universal quantum simulator: quantum parts imitating another quantum system, at a cost growing only in proportion to its size.' },
    { q: 'Two qubits are in (|00⟩ + |11⟩)/√2. Measuring the first gives 1. The second is then…', choices: ['certainly 1', 'certainly 0', '0 or 1 with equal chance', 'in the state (|0⟩ + |1⟩)/√2'], a: 0, why: 'Only the |11⟩ part is left once the first qubit is found to be 1.' }
  ],
  problems: [
    { q: 'For how many spins does the number of amplitudes 2ⁿ first exceed 10⁸⁰?', answer: 266, tol: 0.002, hint: 'Take logarithms: n = log₂10⁸⁰.',
      steps: ['$n = \\log_2 10^{80} = 80/\\log_{10}2 = 80/0.30103 = 265.8$.', 'So 266 spins.'] },
    { q: 'A laptop has 1.6 × 10¹⁰ bytes of memory. What is the largest number of qubits whose state (16 bytes per amplitude) fits?', answer: 29, tol: 0.01, hint: '16 · 2ⁿ ≤ 1.6 × 10¹⁰.',
      steps: ['$2^n \\le 10^{9}$, so $n \\le \\log_2 10^9 = 29.9$.', 'The largest whole number is 29.'] }
  ],
  applications: [
    'Simulating molecules and materials — catalysts, magnets, high-temperature superconductors — is the task Feynman had in mind and a main goal of today\'s quantum processors.',
    'Shor\'s factoring algorithm (1994) made quantum computers a question for cryptography; new "post-quantum" public-key methods have been standardised in response.',
    'Classical simulators of general quantum circuits hit the 2ⁿ wall at around 40–50 qubits — the wall drawn in the simulation.'
  ],
  history: 'Paul Benioff (1980) described quantum-mechanical models of computing machines, and Yuri Manin (1980) suggested that quantum systems might compute; Feynman\'s 1981 keynote gave the physicist\'s reason for wanting one. In 1985 he described, in "Quantum Mechanical Computers", how reversible logic gates could be run by a quantum Hamiltonian, and David Deutsch defined the universal quantum computer. Peter Shor\'s factoring algorithm followed in 1994, Lov Grover\'s search in 1996, and Seth Lloyd\'s proof of Feynman\'s simulation conjecture in 1996. By the early 2020s several groups ran processors with dozens to hundreds of qubits.',
  sources: [
    '"Simulating Physics with Computers" — keynote talk, First Conference on the Physics of Computation, MIT Endicott House, May 1981; *International Journal of Theoretical Physics* 21 (1982): the 2ⁿ argument, why local classical probabilities cannot imitate quantum correlations, and the universal quantum simulator.',
    '"Quantum Mechanical Computers" (*Optics News*, 1985; *Foundations of Physics*, 1986) — a computer of reversible gates driven by a quantum Hamiltonian.',
    '*Feynman Lectures on Computation* (1996) — the chapter on quantum mechanical computers.',
    '*The Feynman Lectures on Physics*, Vol. III, ch. 3 (Probability Amplitudes) — the rules for combining amplitudes that every quantum circuit obeys.'
  ],
  sim: 'fr-qubits'
}

);

Hyper.add(

{
  id: 'computation-reversible', parent: 'feynman-ideas', title: 'The physics of computation', level: 2,
  short: 'Computing need not cost energy; forgetting does. Erasing one bit must release at least kT ln 2 of heat (Landauer), but logic can be made reversible (Bennett, Fredkin, Toffoli) — the physics Feynman taught in his Caltech course on computation.',
  keywords: ['Landauer principle', 'kT ln 2', 'reversible computing', 'Toffoli gate', 'Fredkin gate', 'Bennett', 'erasure', 'Szilard engine', 'Maxwell demon', 'entropy', 'information', 'energy per bit', 'thermodynamics of computation', 'billiard-ball computer'],
  prereq: ['entropy-and-order', 'ratchet-and-pawl', 'electronics:logic-gates'],
  related: ['quantum-computing-origin', 'room-at-the-bottom', 'laws-of-thermodynamics-feyn', 'boltzmann-law', 'physics:entropy', 'electronics:boolean-algebra', 'electronics:cmos-logic'],
  body: `
Computers get hot. How much of that heat does physics demand? In the 1950s it was widely assumed that every elementary step of a computation must dissipate at least about $kT$ of energy. Rolf Landauer of IBM showed in 1961 that the real culprit is narrower: it is not computing that costs, but *forgetting*. From 1983 to 1986 Feynman taught a Caltech course on the potentialities and limitations of computing machines, and this physics of information was one of its centrepieces.

### Landauer's principle
A bit in memory has two possible states. *Erasing* it — resetting it to 0 whatever it held before — merges two possible states into one. The memory's entropy falls by $k_B\\ln 2$ (entropy counts states through the [[?logarithm]] of their number), and the second law insists that the entropy of the world cannot fall: at least $k_B\\ln 2$ must leave as heat into the surroundings at temperature $T$,

$$Q \\ge k_B T\\ln 2.$$

At room temperature that is $2.9\\times10^{-21}$ J, or 0.018 eV, per bit.

**See it in the one-molecule memory.** A box holds a single gas molecule and a partition: molecule on the left means 0, on the right means 1. To erase, take out the partition and push a piston from the right end to the middle, slowly, while the walls keep the molecule at temperature $T$. The molecule's gas is compressed to half its volume, and the average work — all of it passed to the walls as heat — is $kT\\ln(V_1/V_2) = kT\\ln2$. The simulation runs this again and again; single runs scatter (sometimes less than $kT\\ln 2$, sometimes more), and the average settles just above $\\ln 2 = 0.69$ in units of $kT$, closer the slower the piston. Push fast and it costs more. Run the process the other way — a *known* bit lets the molecule push the piston out — and you get $kT\\ln 2$ of work back: Szilard's engine of 1929. Information is worth energy, and erasing it pays the bill.

### Logic that forgets, and logic that does not
An AND gate takes two bits and returns one. Three of its four inputs give 0, so from the output you cannot say which input it was: the gate destroys information and must pay for it. A NOT gate, or a controlled-NOT (flip b if a is 1), is a one-to-one mapping — a permutation of the states — and can be run backwards. Charles Bennett showed in 1973 that *any* computation can be done reversibly: keep the intermediate results, copy the answer, then run the whole computation backwards to clean up.

| Gate | Inputs → outputs | Reversible? | Bits erased per use (random inputs) |
|---|---|---|---|
| AND, NAND, OR | 2 → 1 | no | 1.19 |
| NOT | 1 → 1 | yes | 0 |
| CNOT (controlled NOT) | 2 → 2 | yes | 0 |
| Toffoli (controlled-controlled NOT) | 3 → 3 | yes | 0 |
| Fredkin (controlled swap) | 3 → 3 | yes | 0 |

Tommaso Toffoli's gate flips c when a *and* b are 1; with c = 0 it computes AND and keeps a and b, so nothing is forgotten. Edward Fredkin's gate swaps two bits when a control bit is 1; it conserves the number of 1s, like billiard balls that are only redirected. Each alone can build any logic. **In the gates simulation**, click the inputs and watch the mapping: irreversible gates merge several inputs into one output, and the [[?probability|probabilities]] of the outputs tell how many bits are lost.

### Feynman's view: slow is cheap
Following Bennett, Feynman described a computer that drifts through its steps like a particle diffusing under a gentle push: it goes forward a little more often than backwards. The energy spent per step is about $kT$ times the logarithm of the ratio of forward to backward rates, which can be made as small as you please — at the price of going slowly. In 1985 he showed how reversible gates could be run by a quantum-mechanical Hamiltonian, a step towards the quantum computer ([[quantum-computing-origin]]).

### How close are real chips?
A logic gate charges and discharges a small capacitance $C$ at a voltage $V$, dissipating about $CV^2$ per cycle. With $C = 1$ fF and $V = 0.8$ V that is $6\\times10^{-16}$ J — about $10^5$ times Landauer's limit, a gap that has shrunk steadily. In 2012 Antoine Bérut and colleagues measured the Landauer heat directly by erasing a "bit" stored in the position of a glass bead held in a double-well laser trap.

> [!key] Erasing a bit costs at least $k_BT\\ln 2$ of heat because it halves the number of states the memory can be in. Reversible logic forgets nothing, so in principle it can compute with as little energy as you like, if you are patient.
`,
  ideas: [
    'Erasing one bit must release at least k_B T ln 2 of heat — 2.9 × 10⁻²¹ J at room temperature.',
    'The cost comes from merging two states into one: the memory\'s entropy falls by k_B ln 2, so the surroundings must gain at least as much.',
    'Irreversible gates (AND, OR, NAND) forget their inputs; reversible gates (NOT, CNOT, Toffoli, Fredkin) are permutations of the states.',
    'Any computation can be made reversible (Bennett, 1973): compute, copy the answer, and uncompute.',
    'A reversible computer running slowly can spend arbitrarily little energy per step; today\'s chips use about 10⁵ times the Landauer limit.'
  ],
  pitfalls: [
    'Every logical operation must cost at least kT — Only operations that discard information must; reversible operations have no lower limit in principle.',
    'Landauer\'s principle is about the energy stored in a bit — A bit\'s two states can have the same energy; the cost is entropy, paid as heat when the two states are merged.',
    'A single erasure always costs at least kT ln 2 — The bound holds on average; in one run of a small system thermal fluctuations can make the work smaller or larger.'
  ],
  formulas: [
    {
      name: 'Landauer\'s limit: the least heat to erase N bits',
      expr: 'Q = N*kB*T*ln(2)', tex: 'Q = N k_B T \\ln 2',
      vars: {
        Q: { name: 'least heat released', q: 'energy', unit: 'eV' },
        N: { name: 'bits erased', q: 'count', value: 1, int: true },
        kB: { const: 'kB' },
        T: { name: 'temperature of the surroundings', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'A lower bound, reached only by slow (quasi-static) erasure; 0.018 eV per bit at 300 K.',
      stories: { Q: 'What is the least heat released when {N} bits are erased at {T}?', T: 'Erasing {N} bits released at least {Q}. At what temperature?' }
    },
    {
      name: 'The least power for erasing bits at a steady rate',
      expr: 'P = r*kB*T*ln(2)', tex: 'P = r\\, k_B T \\ln 2',
      vars: {
        P: { name: 'least power dissipated', q: 'power', unit: 'mW' },
        r: { name: 'bit erasures per second', q: 'rate', unit: '1/s', value: 1e18 },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'A billion billion erasures a second at room temperature cost at least about 3 mW.',
      stories: { P: 'A processor erases {r} bits a second at {T}. What is the least power it must dissipate?', r: 'How many bits a second can be erased at {T} with {P} of heat, at the Landauer limit?' }
    },
    {
      name: 'A real gate against the Landauer limit',
      expr: 'R = C*V^2/(kB*T*ln(2))', tex: 'R = \\dfrac{C V^2}{k_B T \\ln 2}',
      vars: {
        R: { name: 'energy per switching as a multiple of k_B T ln 2' },
        C: { name: 'capacitance charged and discharged', q: 'capacitance', unit: 'pF', value: 0.001 },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 0.8 },
        kB: { const: 'kB' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Charging and discharging C through resistance dissipates CV² per cycle. The numbers are illustrative of modern logic.',
      stories: { R: 'A gate switches {C} at {V} at {T}. How many times the Landauer limit does one switching cost?', V: 'At what supply voltage would a gate with {C} at {T} dissipate {R} times the Landauer limit per switching?' }
    }
  ],
  derivation: {
    title: 'Erasure by compressing a one-molecule gas',
    steps: [
      { text: 'One molecule in a box of length $L$ at temperature $T$ behaves on average as an ideal gas of one particle: the average force on the piston is $\\langle F\\rangle = k_BT/x$ when the box is $x$ long (the one-particle form of $pV = Nk_BT$).', tex: '\\langle F \\rangle = \\frac{k_B T}{x}' },
      { text: 'Push the piston slowly from $x = L$ to $x = L/2$. The work done is the [[?integral]] of force over distance (with a minus sign because $x$ decreases):', tex: 'W = -\\int_L^{L/2} \\frac{k_BT}{x}\\,dx = k_BT \\ln\\frac{L}{L/2}' },
      { text: 'The ratio inside the logarithm is 2, whatever $L$ is:', tex: 'W = k_BT\\ln 2' },
      { text: 'The walls keep the temperature fixed, so the molecule\'s average energy does not change: the work all leaves as heat, $Q = W = k_BT\\ln 2$, while the molecule — whichever side it started on — now sits on the left. The bit is erased.' }
    ]
  },
  examples: [
    {
      title: 'The price of forgetting one bit',
      q: 'What is Landauer\'s limit at 300 K, in joules and in electronvolts?',
      steps: ['$k_BT = 1.381\\times10^{-23} \\times 300 = 4.14\\times10^{-21}$ J.', 'Times $\\ln 2 = 0.693$: $2.87\\times10^{-21}$ J.', 'Divide by $1.602\\times10^{-19}$ J/eV: 0.0179 eV.'],
      a: '$2.9\\times10^{-21}$ J = 0.018 eV per erased bit.'
    },
    {
      title: 'How far are chips from the limit?',
      q: 'A logic node of 1 fF is switched at 0.8 V. Compare $CV^2$ with $k_BT\\ln2$ at 300 K.',
      steps: ['$CV^2 = 10^{-15} \\times 0.64 = 6.4\\times10^{-16}$ J.', 'Ratio: $6.4\\times10^{-16}/2.87\\times10^{-21} = 2.2\\times10^{5}$.'],
      a: 'About two hundred thousand times the Landauer limit.'
    },
    {
      title: 'How much does an AND gate forget?',
      q: 'The four input pairs of an AND gate are equally likely. On average, how many bits of information are destroyed per use?',
      steps: [
        'Two random input bits carry 2 bits of information.',
        'The output is 0 with probability ¾ and 1 with probability ¼. Its information is $-\\tfrac34\\log_2\\tfrac34 - \\tfrac14\\log_2\\tfrac14 = 0.311 + 0.5 = 0.811$ bits.',
        'Lost: $2 - 0.811 = 1.19$ bits, so at least $1.19\\,k_BT\\ln2$ of heat per use unless the inputs are kept.'
      ],
      a: '1.19 bits per use.'
    }
  ],
  quiz: [
    { q: 'Which operation must, by Landauer\'s principle, release heat?', choices: ['Resetting a bit to 0 whatever it held', 'Copying a bit onto a blank bit', 'Inverting a bit (NOT)', 'Swapping two bits'], a: 0, why: 'Resetting merges two states into one; the others are one-to-one and can be undone.' },
    { q: 'At 300 K the Landauer limit is about…', choices: ['0.018 eV per bit', '1 eV per bit', '0.8 V per bit', 'zero'], a: 0, why: 'k_B T ln 2 = 4.14 × 10⁻²¹ J × 0.693 = 2.9 × 10⁻²¹ J = 0.018 eV.' },
    { q: 'A Toffoli gate with its third input fixed at 0 computes a AND b while keeping a and b. Why does it not need to erase anything?', choices: ['Its mapping of eight input states to eight output states is one-to-one', 'It runs at zero temperature', 'Its outputs have no energy', 'AND is reversible anyway'], a: 0, why: 'Because a and b are kept, the inputs can always be recovered: nothing is forgotten.' },
    { q: 'In the one-molecule memory, erasing quickly (piston faster than the molecule\'s thermal speed) costs on average less than kT ln 2.', a: false, why: 'kT ln 2 is the minimum, reached only for slow, quasi-static erasure; fast pushing wastes extra work.' },
    { q: 'Cooling a computer from 300 K to 3 K changes the Landauer limit by a factor of…', answer: 0.01, why: 'The limit is proportional to T: 3/300 = 0.01. (The heat must then be pumped out of the cold computer, which costs work.)' }
  ],
  problems: [
    { q: 'What is the least heat, in joules, released by erasing one gigabyte (8 × 10⁹ bits) at 300 K?', answer: 2.3e-11, unit: 'J', tol: 0.02, hint: 'Multiply the number of bits by k_B T ln 2.',
      steps: ['$k_BT\\ln2 = 2.87\\times10^{-21}$ J at 300 K.', '$8\\times10^{9} \\times 2.87\\times10^{-21} = 2.3\\times10^{-11}$ J.'] },
    { q: 'A memory at 4.2 K (liquid helium) is erased at the Landauer limit. What is the minimum heat per bit, in eV?', answer: 2.51e-4, unit: 'eV', tol: 0.02,
      steps: ['$k_BT = 1.381\\times10^{-23} \\times 4.2 = 5.80\\times10^{-23}$ J.', 'Times $\\ln 2$: $4.02\\times10^{-23}$ J $= 2.51\\times10^{-4}$ eV.'] }
  ],
  applications: [
    'Low-power and adiabatic logic circuits recover part of the switching energy by charging nodes slowly, in the spirit of reversible computing.',
    'Quantum computers are built from reversible gates by necessity: quantum evolution is itself reversible.',
    'Maxwell\'s demon is exorcised by the same principle: the demon must eventually erase its memory, paying back the work it seemed to gain.'
  ],
  history: 'Leo Szilard analysed a one-molecule engine in 1929. Rolf Landauer published "Irreversibility and Heat Generation in the Computing Process" in 1961; Charles Bennett showed in 1973 that computation can be logically reversible. Tommaso Toffoli (1980) and Edward Fredkin with Toffoli ("Conservative Logic", 1982) introduced the universal reversible gates. Feynman taught his course on computation at Caltech from 1983 to 1986; the lectures were edited by Tony Hey and Robin Allen and published in 1996. Bérut and colleagues measured the Landauer heat with a colloidal bead in 2012.',
  sources: [
    '*Feynman Lectures on Computation* (1996; from his Caltech course of 1983–86) — the chapter on reversible computation and the thermodynamics of computing: Landauer\'s kT ln 2, Bennett\'s reversible machines, the Fredkin and Toffoli gates, and the energy per step of a slow computer.',
    '"Quantum Mechanical Computers" (*Optics News*, 1985) — reversible gates run by a quantum Hamiltonian.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 44 (The Laws of Thermodynamics) and ch. 46 (Ratchet and pawl) — entropy, and why no machine can get work out of random thermal motion.'
  ],
  sim: ['fr-landauer', 'fr-gates']
},

{
  id: 'superfluid-helium', parent: 'feynman-ideas', title: 'Superfluid helium, rotons and vortices', level: 3,
  short: 'Below 2.17 K liquid helium flows without friction. Landau explained it with a spectrum of phonons and rotons and a critical velocity; Feynman derived that spectrum from the atoms, and showed that the superfluid can rotate only through quantised vortex lines.',
  keywords: ['superfluidity', 'helium II', 'lambda point', 'phonon', 'roton', 'maxon', 'Landau critical velocity', 'two-fluid model', 'Bose statistics', 'structure factor', 'backflow', 'quantised vortices', 'circulation quantum', 'h/m', 'rotating bucket', 'vortex lattice'],
  prereq: ['identical-particles', 'bosons-and-lasers', 'flow-of-dry-water', 'angular-momentum-quantum'],
  related: ['superconductivity-feyn', 'boltzmann-law', 'flow-of-wet-water', 'vector-calculus-fields', 'physics:superconductivity', 'physics:latent-heat'],
  body: `
Helium-4 stays liquid right down to absolute zero at ordinary pressure: its atoms are so light and so weakly attracted that their quantum zero-point motion keeps them from locking into a solid. Below 2.17 K — the *lambda point*, named for the shape of the heat-capacity curve — it becomes *helium II*, a liquid that flows through the narrowest channels without friction (Pyotr Kapitza; John Allen and Don Misener; both reported in January 1938), creeps up the walls of its container, and conducts heat so well that it stops boiling. László Tisza (1938) and Lev Landau (1941) described it as two interpenetrating fluids, a *superfluid* without viscosity or entropy and a *normal* part made of thermal excitations.

### Landau's spectrum and the critical velocity
Landau pictured the liquid near absolute zero as quiet, with its motion carried by *excitations*, each with a momentum $p = \\hbar k$ and an energy $E(p)$. At small $k$ they are phonons, sound quanta with $E = cp$ ($c \\approx 238$ m/s). The curve then rises to a maximum (the *maxon*, about 14 K at 1.1 Å⁻¹) and dips to a minimum, the *roton*: $\\Delta/k_B = 8.6$ K at $k_0 = 1.92$ Å⁻¹, as neutron scattering later confirmed.

Why no friction? An object moving through the liquid at speed $v$ can slow down only by creating an excitation. Conservation of energy and momentum require $E(p) = \\vec p\\cdot\\vec v \\le pv$ (a [[?dot-product]]), which is possible only if $v \\ge E(p)/p$ for some $p$. So below

$$v_c = \\min_p \\frac{E(p)}{p} \\approx \\frac{\\Delta}{\\hbar k_0} \\approx 58\\ \\mathrm{m/s}$$

nothing can be excited. **In the simulation**, the straight line $E = pv$ swings up as you raise $v$; superflow breaks down when it touches the curve — near the roton minimum — and the moving ion starts shedding rotons at an angle, like a wake. Ions pulled through the liquid under pressure were shown in the 1970s to reach speeds close to this limit.

### Feynman's picture: why so few low-energy states
From 1953 to 1956 Feynman explained, starting from the atoms, why the spectrum looks like this. Helium atoms are bosons: the ground-state [[?wave-function]] is positive everywhere and unchanged when two atoms swap places. A long-wavelength disturbance that is not a density wave would only move atoms to where other, identical atoms already were — giving back the same state. So the only low-energy motions are phonons, and anything else must rearrange atoms on the scale of their spacing, which costs a finite energy. His trial excitation, a density ripple of wave number $k$ on the ground state, gives

$$E(k) = \\frac{\\hbar^2 k^2}{2m\\,S(k)},$$

the free-atom energy divided by the *structure factor* $S(k)$, measured by X-ray or neutron diffraction. $S(k)$ peaks near 2 Å⁻¹ because neighbouring atoms sit about 3.6 Å apart — and that peak pulls the curve down into the roton dip. His first estimate put the roton about twice too high; adding the *backflow* of the neighbours around a moving atom (with Michael Cohen, 1956) brought it much closer.

### Quantised circulation and vortices
The superfluid velocity is proportional to the [[?gradient]] of the [[?phase]] of the condensate: $\\vec v_s = (\\hbar/m)\\nabla\\varphi$, so it has no [[?curl]] and cannot turn like a solid body. But around any loop the phase must return to itself, up to a whole number of turns, so the circulation — the [[?closed-integral]] $\\oint \\vec v_s\\cdot d\\vec l$ — comes in multiples of

$$\\kappa = \\frac{h}{m_4} = 9.97\\times10^{-8}\\ \\mathrm{m^2/s}$$

(Lars Onsager, 1949; Feynman, 1955). In a rotating bucket the superfluid imitates rigid rotation by filling with an array of vortex lines, each with one quantum; there are $n = 2\\Omega/\\kappa$ of them per unit area — about 2000 per cm² at 1 rad/s. **The vortex simulation** shows the array turning with the bucket, and the flow along a radius: a sawtooth that follows $\\Omega r$ on average. Feynman also argued that vortices explain why helium in narrow channels loses its superflow at centimetres per second rather than at 58 m/s.

| Quantity | Value |
|---|---|
| Lambda point | 2.17 K |
| Roton gap $\\Delta/k_B$ | 8.6 K at 1.92 Å⁻¹ |
| Landau critical velocity | about 58 m/s |
| Vortex density at 1 rad/s | about 2000 per cm² |

> [!key] Bose statistics leaves liquid helium no cheap way to move except as sound, so a gap opens — the roton — and slow flow cannot lose energy. Its rotation is quantised: circulation comes in units of h/m.
`,
  ideas: [
    'Below 2.17 K helium-4 is a superfluid: part of it flows without viscosity.',
    'Its excitations are phonons at small momentum and rotons near 1.92 Å⁻¹ with a gap of 8.6 K.',
    'Landau: an object cannot lose energy to the liquid unless v ≥ E(p)/p — the critical velocity, about 58 m/s.',
    'Feynman: E(k) = ħ²k²/(2m S(k)); Bose statistics forbids cheap non-sound motions, and the peak of S(k) makes the roton.',
    'Circulation is quantised in units of h/m; a rotating superfluid fills with vortex lines, 2Ω/κ per unit area.'
  ],
  pitfalls: [
    'Superfluid helium has zero viscosity, so nothing can ever drag in it — Above the critical velocity excitations are created and there is drag; in practice vortex lines form at much lower speeds in channels.',
    'A rotating bucket of superfluid stays at rest — It stays at rest only below a small critical rotation; above it, quantised vortices appear and on average the fluid turns with the bucket.',
    'Rotons are just atoms moving freely — A roton\'s energy (8.6 K) is far below that of a free atom with the same momentum (about 22 K); it is a collective motion of many atoms.'
  ],
  formulas: [
    {
      name: 'The quantum of circulation',
      expr: 'kappa = h/m', tex: '\\kappa = \\dfrac{h}{m}',
      vars: {
        kappa: { name: 'circulation quantum', q: 'kinvisc', unit: 'm²/s', tex: '\\kappa' },
        h: { const: 'h' },
        m: { name: 'mass of one atom', q: 'mass', unit: 'u', value: 4.0026 }
      },
      note: 'For helium-4 (m = 4.0026 u) κ = 9.97 × 10⁻⁸ m²/s. Around a vortex line the speed is v = κ/2πr.',
      stories: { kappa: 'What is the quantum of circulation for atoms of {m}?', m: 'A superfluid has circulation quantum {kappa}. What is the mass of its atoms?' }
    },
    {
      name: 'Vortex lines in a rotating bucket (Feynman\'s rule)',
      expr: 'N = 2*Omega*A/kappa', tex: 'N = \\dfrac{2\\Omega A}{\\kappa}',
      vars: {
        N: { name: 'number of vortex lines', q: 'count' },
        Omega: { name: 'angular velocity of the bucket', q: 'angvel', unit: 'rad/s', value: 1, tex: '\\Omega' },
        A: { name: 'cross-section of the bucket', q: 'area', unit: 'cm²', value: 1 },
        kappa: { name: 'circulation quantum', q: 'kinvisc', unit: 'm²/s', value: 9.97e-8, tex: '\\kappa' }
      },
      note: 'Rigid rotation has circulation 2Ω × area; each line carries κ. About 2000 lines per cm² at 1 rad/s.',
      stories: { N: 'A bucket of helium II of cross-section {A} turns at {Omega}. How many vortex lines thread it?', Omega: 'At what rate must a bucket of cross-section {A} turn to hold {N} vortex lines?' }
    },
    {
      name: 'Landau\'s critical velocity at the roton minimum',
      expr: 'vc = kB*D/(hbar*k0)', tex: 'v_c = \\dfrac{k_B \\Delta}{\\hbar k_0}',
      vars: {
        vc: { name: 'critical velocity', q: 'speed', unit: 'm/s', tex: 'v_c' },
        kB: { const: 'kB' },
        D: { name: 'roton gap, as a temperature Δ/k_B', q: 'temperature', unit: 'K', value: 8.62, tex: '\\Delta' },
        hbar: { const: 'hbar' },
        k0: { name: 'wave number of the roton minimum', q: 'wavenumber', unit: '1/nm', value: 19.2, tex: 'k_0' }
      },
      note: 'Δ/p₀ is a close estimate of min E(p)/p; the exact minimum on the measured curve is slightly lower (about 58 m/s).',
      stories: { vc: 'The roton minimum lies at {k0} with a gap of {D}. Estimate the Landau critical velocity.', D: 'If the critical velocity were {vc} with the minimum at {k0}, what gap would that imply?' }
    },
    {
      name: 'Feynman\'s relation between the spectrum and the structure factor',
      expr: 'TE = hbar^2*k^2/(2*m*kB*S)', tex: 'T_E = \\dfrac{\\hbar^2 k^2}{2 m k_B S}',
      vars: {
        TE: { name: 'excitation energy, as a temperature E/k_B', q: 'temperature', unit: 'K', tex: 'T_E' },
        hbar: { const: 'hbar' },
        k: { name: 'wave number', q: 'wavenumber', unit: '1/nm', value: 19.2 },
        m: { name: 'mass of a helium-4 atom', q: 'mass', unit: 'u', value: 4.0026 },
        kB: { const: 'kB' },
        S: { name: 'structure factor S(k) at that wave number', value: 1.3 }
      },
      note: 'With S ≈ 1.3 at the roton wave number this gives about 17 K, twice the measured 8.6 K; backflow corrects most of the difference. At small k, S = ħk/2mc and the formula gives the phonons, E = ħck.',
      stories: { TE: 'At {k} the structure factor of liquid helium is {S}. What excitation energy does Feynman\'s relation give?', S: 'What structure factor at {k} would make Feynman\'s relation give {TE}?' }
    }
  ],
  examples: [
    {
      title: 'Landau\'s critical velocity',
      q: 'Estimate $v_c = \\Delta/(\\hbar k_0)$ for $\\Delta/k_B = 8.62$ K and $k_0 = 1.92$ Å⁻¹.',
      steps: [
        '$\\Delta = 8.62 \\times 1.381\\times10^{-23} = 1.19\\times10^{-22}$ J.',
        '$\\hbar k_0 = 1.055\\times10^{-34} \\times 1.92\\times10^{10} = 2.02\\times10^{-24}$ kg·m/s.',
        '$v_c = 1.19\\times10^{-22}/2.02\\times10^{-24} = 59$ m/s.'
      ],
      a: 'About 59 m/s (the tangent to the measured curve gives about 58 m/s).'
    },
    {
      title: 'Vortices in a slowly turning bucket',
      q: 'A bucket 1 cm in radius turns at 0.5 rad/s. How many vortex lines are there, and how far apart?',
      steps: [
        'Area: $\\pi (1\\ \\mathrm{cm})^2 = 3.14$ cm² $= 3.14\\times10^{-4}$ m².',
        '$N = 2\\Omega A/\\kappa = 2 \\times 0.5 \\times 3.14\\times10^{-4}/9.97\\times10^{-8} \\approx 3150$.',
        'In a triangular array each line has an area $\\tfrac{\\sqrt3}{2}b^2 = A/N$, so $b = \\sqrt{2A/(\\sqrt3 N)} = 0.34$ mm.'
      ],
      a: 'About 3150 lines, roughly a third of a millimetre apart.'
    },
    {
      title: 'The free atom against the roton',
      q: 'What energy (as a temperature) would a free helium atom have with the roton\'s wave number, 1.92 Å⁻¹? Compare with the roton gap.',
      steps: [
        '$E = \\hbar^2k^2/2m = (1.055\\times10^{-34})^2 (1.92\\times10^{10})^2/(2 \\times 6.65\\times10^{-27}) = 3.08\\times10^{-22}$ J.',
        'Divide by $k_B$: 22 K.',
        'The roton needs only 8.6 K — the liquid finds a much cheaper collective way to carry that momentum.'
      ],
      a: 'About 22 K for a free atom against 8.6 K for the roton.'
    }
  ],
  quiz: [
    { q: 'A small sphere is pulled through helium II at 0.1 K at 30 m/s. According to Landau\'s argument…', choices: ['it feels no drag from creating excitations', 'it creates rotons', 'it creates phonons', 'it freezes the helium'], a: 0, why: '30 m/s is below min E/p ≈ 58 m/s: no excitation can be created that conserves energy and momentum.' },
    { q: 'In Feynman\'s relation E = ħ²k²/(2m S(k)), what makes the roton dip?', choices: ['the peak of the structure factor near 2 Å⁻¹, set by the spacing of the atoms', 'the Fermi statistics of helium-4', 'the walls of the container', 'the lambda point'], a: 0, why: 'Dividing the free-atom energy by a large S(k) lowers E exactly where atoms are most strongly correlated.' },
    { q: 'Doubling the rotation rate of a bucket of superfluid (well above the first vortex) roughly…', choices: ['doubles the number of vortex lines', 'doubles the circulation of each line', 'halves the number of lines', 'leaves the number unchanged'], a: 0, why: 'Each line carries exactly one quantum κ; the number per area is 2Ω/κ.' },
    { q: 'The superfluid velocity field has no curl anywhere except on vortex lines.', a: true, why: 'v_s = (ħ/m)∇φ, and the curl of a gradient is zero; all the rotation is concentrated in the quantised lines.' },
    { q: 'What is the circulation quantum h/m for helium-3 atoms (3.016 u), in units of 10⁻⁸ m²/s? (Superfluid ³He pairs its atoms, so its actual quantum is half this.)', answer: 13.2, why: 'h/m = 6.626 × 10⁻³⁴ / (3.016 × 1.661 × 10⁻²⁷) = 1.32 × 10⁻⁷ m²/s.' }
  ],
  problems: [
    { q: 'How fast does the superfluid circulate at 1 µm from the core of a single vortex line in helium-4, in mm/s?', answer: 15.9, unit: 'mm/s', tol: 0.02, hint: 'v = κ/(2πr).',
      steps: ['$v = \\kappa/(2\\pi r) = 9.97\\times10^{-8}/(2\\pi \\times 10^{-6})$.', '$= 1.59\\times10^{-2}$ m/s = 15.9 mm/s.'] },
    { q: 'How many vortex lines thread a bucket 2 mm in radius turning at 1 rad/s?', answer: 252, tol: 0.03,
      steps: ['$A = \\pi (2\\times10^{-3})^2 = 1.257\\times10^{-5}$ m².', '$N = 2 \\times 1 \\times 1.257\\times10^{-5}/9.97\\times10^{-8} = 252$.'] }
  ],
  applications: [
    'Superfluid helium cools superconducting magnets (for example in particle accelerators) and space telescopes, thanks to its enormous heat conductivity.',
    'Quantised vortices appear in all superfluids: in superconductors (flux lines), in Bose–Einstein condensates of cold atoms, and probably in neutron stars, where they may explain sudden spin-ups ("glitches").',
    'Neutron scattering on helium was one of the first detailed tests of a many-body quantum theory against experiment.'
  ],
  history: 'Heike Kamerlingh Onnes liquefied helium in 1908. Superflow was reported by Kapitza and by Allen and Misener in January 1938; Tisza and London proposed the two-fluid picture and the link to Bose condensation in 1938, and Landau gave the phonon–roton spectrum and the critical velocity in 1941 (with the roton minimum in 1947). Onsager remarked in 1949 that circulation should be quantised; Feynman developed the atomic theory of the liquid in papers of 1953–54, quantised vortex lines and arrays in 1955, and backflow with Michael Cohen in 1956. W. F. Vinen measured the quantum of circulation in 1961, and in 1979 E. J. Yarmchuk, M. J. V. Gordon and R. E. Packard photographed vortex arrays in rotating helium.',
  sources: [
    'R. P. Feynman, "Atomic Theory of the Two-Fluid Model of Liquid Helium", *Physical Review* 94 (1954) — the excitation spectrum from the structure factor, E = ħ²k²/2mS(k).',
    'R. P. Feynman, "Application of Quantum Mechanics to Liquid Helium", *Progress in Low Temperature Physics*, vol. I (1955) — quantised vortex lines, vortex arrays in a rotating container, and critical velocities.',
    'R. P. Feynman and M. Cohen, "Energy Spectrum of the Excitations in Liquid Helium", *Physical Review* 102 (1956) — backflow.',
    '*Statistical Mechanics: A Set of Lectures* (1972) — the chapter on superfluidity.'
  ],
  sim: ['fr-helium', 'fr-vortices']
}

);

Hyper.add(

{
  id: 'weak-interaction-v-a', parent: 'feynman-ideas', title: 'The V−A theory of the weak interaction', level: 3,
  short: 'In 1956–57 experiments showed that beta decay can tell left from right. In 1958 Feynman and Gell-Mann, and independently Sudarshan and Marshak, found the law: only the left-handed parts of particles take part in the weak interaction — the V − A form.',
  keywords: ['parity violation', 'V-A', 'V minus A', 'weak interaction', 'beta decay', 'cobalt-60', 'Wu experiment', 'Lee and Yang', 'helicity', 'left-handed neutrino', 'Fermi interaction', 'Gell-Mann', 'Sudarshan', 'Marshak', 'pion decay', 'muon lifetime', 'Fermi constant'],
  prereq: ['parity-violation', 'spin-half', 'matter-antimatter'],
  related: ['symmetry-in-physical-law', 'beyond-qed', 'feynman-diagrams', 'physics:radioactive-decay', 'physics:standard-model', 'physics:fundamental-forces'],
  body: `
Until 1956 physicists took it for granted that the laws of nature cannot tell left from right: the mirror image of any possible process is also a possible process (*parity* is conserved). Gravity, electromagnetism and the strong force respect this. The weak force, which drives beta decay, turned out not to.

### A crack in the mirror
The puzzle began with two particles, then called θ and τ, of the same mass and lifetime that decayed into states of opposite parity; today both are known as the K meson. At the Rochester conference in April 1956 Feynman raised the question — put to him by the experimenter Martin Block — whether parity might simply fail. In June 1956 T. D. Lee and C. N. Yang pointed out that parity had never actually been tested in weak processes, and proposed how to do it (*Physical Review*, 1 October 1956). Chien-Shiung Wu, with Ernest Ambler, Raymond Hayward, Dale Hoppes and Ralph Hudson at the National Bureau of Standards, lined up the spins of cobalt-60 nuclei in a magnetic field at a small fraction of a kelvin and counted the beta electrons. Early in January 1957 the answer was clear: more electrons come out *opposite* to the nuclear spin than along it. Pion and muon decays showed the same kind of asymmetry within days (Richard Garwin, Leon Lederman and Marcel Weinrich; Jerome Friedman and Valentine Telegdi).

### Why the asymmetry breaks the mirror
Spin is an *axial* [[?vector]]: it is set by a sense of rotation, like the current in a coil. Look at the experiment in a mirror standing beside it: the electrons that went down still go down, but the current in the coil — and so the spin — is reversed. In the mirror world the electrons prefer to go *along* the spin. That world would be a legitimate world if parity were conserved; it is not the one we live in. In formulas, the emission rate in a direction at angle $\\theta$ to the spin is

$$W(\\theta) = 1 + A P \\beta\\cos\\theta,$$

with $P$ the fraction of nuclei aligned, $\\beta = v/c$ of the electron and $A = -1$ for cobalt-60. The term $\\cos\\theta$ is a [[?dot-product]] of a spin and a momentum, a quantity that changes sign in a mirror. **In the simulation**, count the electrons in our world and in the mirror, flip the magnet, and warm the sample (lower $P$): as the spins lose their alignment the asymmetry fades, as it did in Wu's cryostat over a few minutes.

### V − A
In Fermi's theory of beta decay (1934) four particles meet at a point, and relativity allows five kinds of coupling: scalar, vector, tensor, axial vector and pseudoscalar (S, V, T, A, P). Experiments in 1957 seemed to point to S and T. Feynman and Murray Gell-Mann ("Theory of the Fermi Interaction", *Physical Review*, 1 January 1958), and independently George Sudarshan and Robert Marshak (presented at the Padua–Venice conference in September 1957, published in 1958), proposed instead that the interaction is **V − A**: every particle enters only through its left-handed part. For an electron field $\\psi$ the weak current is

$$J^{\\mu} = \\bar\\psi\\,\\gamma^{\\mu}(1-\\gamma^{5})\\,\\psi,$$

where $\\gamma^\\mu$ and $\\gamma^5$ are the $4\\times4$ Dirac [[?matrix|matrices]] and $\\tfrac12(1-\\gamma^5)$ picks out the left-handed part. Feynman came to it from his fondness for writing the Dirac equation with two-component spinors; the V − A combination is what appears when only one of the two components couples. It meant that some experiments had to be wrong — and they were.

| Prediction of V − A | Test |
|---|---|
| Neutrinos are left-handed (spin opposite to motion) | Goldhaber, Grodzins and Sunyar, 1958 |
| Beta electrons have longitudinal polarisation $-v/c$ | measured 1957–58 |
| Pion → electron + neutrino suppressed by $(m_e/m_\\mu)^2$: ratio $1.28\\times10^{-4}$ | seen at CERN, 1958 (Fazzini and colleagues) |
| Same coupling for muon decay and nuclear beta decay (universality) | muon lifetime 2.2 µs from $G_F$ |

The pion prediction shows how strong the rule is: the decay to an electron releases *more* energy, yet it is ten thousand times rarer, because a left-handed electron and a right-handed antineutrino from a spinless pion must have their spins opposite — possible only through the small admixture of the wrong handedness that the electron's tiny mass allows.

> [!key] The weak interaction acts only on left-handed particles and right-handed antiparticles. Its mirror image does not exist in nature; the combined mirror-and-antimatter image (CP) almost does.
`,
  ideas: [
    'Parity conservation means the mirror image of a process is also possible; the weak interaction violates it.',
    'Wu\'s cobalt-60 experiment (1956–57): beta electrons prefer to leave opposite to the nuclear spin; in a mirror they would prefer to go along it.',
    'The rate is W(θ) = 1 + A P β cos θ, with A = −1 for cobalt-60; the cos θ term (spin · momentum) changes sign in a mirror.',
    'V − A (Feynman and Gell-Mann; Sudarshan and Marshak, 1958): only left-handed particles and right-handed antiparticles take part.',
    'Predictions: left-handed neutrinos, polarised beta electrons, a pion→electron rate of 1.28 × 10⁻⁴ of the muon mode, one universal Fermi constant.'
  ],
  pitfalls: [
    'Parity violation means the weak force is a bit stronger on the left — It means the weak force acts only on left-handed particles; the right-handed parts of electrons and quarks do not feel it at all.',
    'The electron mode of pion decay is rare because it has less energy — It has more energy available; it is suppressed by the handedness rule, by (m_e/m_μ)².',
    'Wu\'s electrons went against the spin because they are negatively charged — The asymmetry is in the decay itself; the magnetic field only aligns the nuclei, and reversing it reverses the asymmetry.'
  ],
  formulas: [
    {
      name: 'Angular distribution of beta electrons from polarised nuclei',
      expr: 'W = 1 + A*P*beta*cos(theta)', tex: 'W = 1 + A P \\beta\\cos\\theta',
      vars: {
        W: { name: 'relative emission rate at angle θ to the spin', q: false, unit: 'relative' },
        A: { name: 'asymmetry parameter of the decay (−1 for cobalt-60)', signed: true, value: -1 },
        P: { name: 'nuclear polarisation (fraction aligned)', value: 0.6, min: 0, max: 1 },
        beta: { name: 'electron speed v/c', value: 0.7, min: 0, max: 1, tex: '\\beta' },
        theta: { name: 'angle between the electron and the nuclear spin', q: 'angle', unit: '°', value: 150, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Relative to 1 for unpolarised nuclei. Parity conservation would require A = 0.',
      stories: { W: 'Nuclei with polarisation {P} emit electrons with β = {beta}; the asymmetry parameter is {A}. What is the relative rate at {theta} to the spin?', P: 'At {theta} to the spin the relative rate is {W} for β = {beta} and A = {A}. How polarised are the nuclei?' }
    },
    {
      name: 'Pion decay: electron against muon (helicity suppression)',
      expr: 'R = (mE/mMu)^2*((mPi^2 - mE^2)/(mPi^2 - mMu^2))^2',
      tex: 'R = \\left(\\dfrac{m_e}{m_\\mu}\\right)^2 \\left(\\dfrac{m_\\pi^2 - m_e^2}{m_\\pi^2 - m_\\mu^2}\\right)^2',
      vars: {
        R: { name: 'rate of π → eν divided by rate of π → μν' },
        mE: { name: 'electron mass', q: 'mass', unit: 'MeV/c²', value: 0.511, min: 0.01, max: 100, tex: 'm_e' },
        mMu: { name: 'muon mass', q: 'mass', unit: 'MeV/c²', value: 105.66, min: 50, max: 139, tex: 'm_\\mu' },
        mPi: { name: 'charged pion mass', q: 'mass', unit: 'MeV/c²', value: 139.57, min: 106, max: 2000, tex: 'm_\\pi' }
      },
      note: 'The V − A prediction before small radiative corrections, 1.28 × 10⁻⁴; the measured ratio is 1.23 × 10⁻⁴. The first factor is the helicity suppression, the second the phase space.',
      stories: { R: 'With masses {mE}, {mMu} and {mPi}, what fraction of the muon-mode rate does the electron mode of pion decay have?' }
    },
    {
      name: 'The muon lifetime from the Fermi constant',
      expr: 'tau = 192*pi^3*hb/(GF^2*m^5)', tex: '\\tau = \\dfrac{192\\pi^3\\hbar}{G_F^2 m_\\mu^5}',
      vars: {
        tau: { name: 'muon lifetime', q: 'time', unit: 'µs', tex: '\\tau' },
        hb: { name: 'ħ in GeV·s', q: false, unit: 'GeV·s', value: 6.582e-25, fixed: true, tex: '\\hbar' },
        GF: { name: 'Fermi constant (with ħ = c = 1)', q: false, unit: 'GeV⁻²', value: 1.1664e-5, tex: 'G_F' },
        m: { name: 'muon mass (as an energy)', q: false, unit: 'GeV', value: 0.10566, tex: 'm_\\mu' }
      },
      note: 'Natural units (ħ = c = 1) with ħ put back to turn a rate in GeV into seconds; the electron mass and radiative corrections are neglected (they shift τ by about 0.5 %).',
      stories: { tau: 'With G_F = {GF} and a muon mass of {m}, what lifetime does V − A predict?', GF: 'The muon ({m}) lives {tau}. What Fermi constant does that imply?' }
    }
  ],
  examples: [
    {
      title: 'How lopsided was the cobalt?',
      q: 'For $A = -1$, nuclear polarisation $P = 0.6$ and electrons with $\\beta = 0.7$, compare the rates of emission along the spin ($\\theta = 0$) and opposite to it ($\\theta = 180°$).',
      steps: ['$A P\\beta = -0.42$.', 'Along the spin: $W(0) = 1 - 0.42 = 0.58$. Opposite: $W(180°) = 1 + 0.42 = 1.42$.', 'Ratio $1.42/0.58 = 2.4$.'],
      a: 'About 2.4 times as many electrons leave opposite to the spin — an unmistakable asymmetry.'
    },
    {
      title: 'The pion\'s surprising preference',
      q: 'Compute the V − A ratio of the rates π → eν and π → μν.',
      steps: [
        'Helicity factor: $(0.511/105.66)^2 = 2.34\\times10^{-5}$.',
        'Phase-space factor: $\\left(\\dfrac{139.57^2 - 0.511^2}{139.57^2 - 105.66^2}\\right)^2 = (19480/8316)^2 = 5.49$.',
        '$R = 2.34\\times10^{-5} \\times 5.49 = 1.28\\times10^{-4}$.'
      ],
      a: 'About one pion in 8000 decays to an electron, although that decay has more energy to spend.'
    },
    {
      title: 'The muon\'s lifetime',
      q: 'Use $G_F = 1.1664\\times10^{-5}$ GeV⁻² and $m_\\mu = 0.10566$ GeV to predict the muon lifetime.',
      steps: [
        'Decay rate $\\Gamma = G_F^2 m_\\mu^5/192\\pi^3 = (1.360\\times10^{-10})(1.317\\times10^{-5})/5953 = 3.01\\times10^{-19}$ GeV.',
        'Lifetime $\\tau = \\hbar/\\Gamma = 6.582\\times10^{-25}\\ \\mathrm{GeV\\,s}/3.01\\times10^{-19}\\ \\mathrm{GeV} = 2.19\\times10^{-6}$ s.'
      ],
      a: '2.19 µs, against the measured 2.197 µs — the same constant governs muon decay and nuclear beta decay.'
    }
  ],
  quiz: [
    { q: 'In Wu\'s experiment more electrons came out opposite to the spin of the cobalt nuclei. Why does this show that parity is violated?', choices: ['In a mirror the spin reverses but the electron directions do not, so the mirror world would have electrons going along the spin', 'Because electrons are negatively charged', 'Because the magnetic field was not uniform', 'Because cobalt-60 is radioactive'], a: 0, why: 'Spin is an axial vector; the mirror image has the opposite correlation of spin and momentum, and that is never observed.' },
    { q: 'In the V − A theory, which states of particles take part in the weak interaction?', choices: ['only the left-handed parts of particles (and right-handed antiparticles)', 'only right-handed particles', 'all states equally', 'only neutrinos'], a: 0, why: 'The factor ½(1 − γ⁵) projects every field onto its left-handed part.' },
    { q: 'V − A predicts that a charged pion decays to an electron and a neutrino far less often than to a muon and a neutrino, although the electron decay releases more energy.', a: true, why: 'The ratio is 1.28 × 10⁻⁴; the suppression factor (m_e/m_μ)² comes from the handedness rule.' },
    { q: 'As Wu\'s sample warmed up, the asymmetry disappeared because…', choices: ['the nuclear spins lost their alignment (P fell to zero)', 'the cobalt stopped decaying', 'the electrons slowed down', 'parity is conserved at higher temperatures'], a: 0, why: 'The asymmetry is proportional to P; heat randomises the spins.' },
    { q: 'With W = 1 + A P β cos θ, A = −1, P = 0.5 and β = 0.8, what is the ratio of electrons emitted opposite to the spin to those emitted along it?', answer: 2.33, why: '(1 + 0.4)/(1 − 0.4) = 2.33.' }
  ],
  problems: [
    { q: 'V − A gives beta electrons a longitudinal polarisation of −v/c. What is it for an electron of 200 keV kinetic energy? (m_e c² = 511 keV)', answer: -0.695, tol: 0.02, hint: 'γ = 1 + K/mc², β = √(1 − 1/γ²).',
      steps: ['$\\gamma = 1 + 200/511 = 1.391$.', '$\\beta = \\sqrt{1 - 1/1.391^2} = \\sqrt{0.4835} = 0.695$.', 'Polarisation $-0.695$: about 85 % of the electrons have their spin against their motion, since $(1 + 0.695)/2 = 0.85$.'] },
    { q: 'If the muon were twice as heavy (same Fermi constant), what would its lifetime be, in µs?', answer: 0.0684, unit: 'µs', tol: 0.02, hint: 'τ ∝ m⁻⁵.',
      steps: ['$\\tau \\propto m_\\mu^{-5}$, so doubling the mass divides τ by $2^5 = 32$.', '$2.19/32 = 0.0684$ µs.'] }
  ],
  applications: [
    'The V − A current is the charged weak current of the Standard Model, carried by the W bosons.',
    'Neutrino physics — detectors, oscillation experiments — rests on the left-handedness of neutrinos.',
    'The violation of CP, the combined mirror-and-antimatter symmetry (1964), and the matter–antimatter imbalance of the universe are the next chapters of the same story.'
  ],
  history: 'The θ–τ puzzle was debated at the Rochester conference in April 1956. Lee and Yang\'s paper questioning parity conservation appeared on 1 October 1956; Wu and her colleagues had their result early in January 1957 and it was published in February, alongside Garwin, Lederman and Weinrich\'s muon experiment; Lee and Yang received the Nobel Prize in 1957. Sudarshan and Marshak presented V − A in September 1957; Feynman and Gell-Mann\'s paper was published on 1 January 1958 and Sudarshan and Marshak\'s in March 1958. Maurice Goldhaber, Lee Grodzins and Andrew Sunyar showed the neutrino to be left-handed in 1958, and the rare decay π → eν was found at CERN the same year.',
  sources: [
    'R. P. Feynman and M. Gell-Mann, "Theory of the Fermi Interaction", *Physical Review* 109 (1958) — the V − A form and the universality of the weak coupling.',
    '*The Feynman Lectures on Physics*, Vol. I, ch. 52 (Symmetry in Physical Laws) — mirror reflections, the cobalt-60 experiment, and how to tell a distant civilisation which hand is left.',
    '*The Character of Physical Law*, lecture 4 (Symmetry in Physical Law) — the same story for a general audience.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985), the chapter "The 7 Percent Solution" — Feynman\'s own account of the 1956 Rochester conference and of finding the V − A law.'
  ],
  sim: 'fr-parity'
},

{
  id: 'parton-model', parent: 'feynman-ideas', title: 'Partons: looking inside the proton', level: 3,
  short: 'In 1968–69 electrons from SLAC\'s two-mile accelerator bounced off protons as if from hard points inside them. Feynman\'s parton picture explained why: seen from a fast frame, a proton is a flat swarm of free point-like partons — which turned out to be quarks and gluons.',
  keywords: ['parton', 'deep inelastic scattering', 'SLAC', 'Bjorken scaling', 'Bjorken x', 'structure function', 'quark', 'gluon', 'form factor', 'Q squared', 'infinite momentum frame', 'Friedman Kendall Taylor', 'Callan–Gross', 'asymptotic freedom'],
  prereq: ['feynman-diagrams', 'time-dilation-feyn', 'relativistic-mass-energy', 'physics:quarks'],
  related: ['beyond-qed', 'three-basic-actions', 'four-vectors-feyn', 'physics:particle-accelerators', 'physics:standard-model', 'physics:strong-force'],
  body: `
To see what is inside something, throw something small at it and watch how it bounces. Rutherford found the atomic nucleus that way in 1911. In the 1950s Robert Hofstadter at Stanford scattered electrons elastically off protons and found that the proton has a size, about 0.8 fm, with its charge smeared out. The larger the momentum transfer, the more the smearing weakens elastic scattering: the rate falls like the square of a *form factor* $G(Q^2) = 1/(1+Q^2/0.71\\ \\mathrm{GeV^2})^2$.

### The surprise at SLAC
In 1966 the Stanford Linear Accelerator Center began running its 3.2 km linear accelerator, giving electrons up to 20 GeV. From 1967 an MIT–SLAC group led by Jerome Friedman, Henry Kendall and Richard Taylor measured *inelastic* scattering: electrons that lose much of their energy while the proton breaks up into a spray of particles. By 1968 they saw something unexpected. At large angles, the inelastic rate did not collapse with growing momentum transfer as the elastic one does — it behaved as if the electrons were hitting small hard objects inside the proton.

### Q², ν and x
For an electron of energy $E$ that leaves with energy $E'$ at angle $\\theta$, two numbers describe what it gave the proton: the energy transferred, $\\nu = E - E'$, and

$$Q^2 = 4EE'\\sin^2\\frac{\\theta}{2},$$

minus the square of the photon's energy–momentum [[?four-vector]], an [[?invariant]] that sets how finely the collision probes (resolution about $\\hbar c/Q$). James Bjorken had predicted in 1968 that at large $Q^2$ and $\\nu$ the measured structure function should depend only on the ratio

$$x = \\frac{Q^2}{2M\\nu}.$$

This *scaling* was what the data showed.

### Feynman's partons
Feynman had been thinking about collisions of hadrons at very high energy. His picture: look at the proton from a frame where it moves almost at the speed of light. Lorentz contraction flattens it into a thin pancake, and time dilation — a factor of the [[?lorentz-factor]] $\\gamma$ — slows its internal motions enormously. During the brief instant of a collision its constituents are frozen and effectively free. He called them *partons*, a deliberately noncommittal word. When he saw the SLAC data in 1968 he recognised at once that an electron scatters off one free parton at a time, and that if the struck parton carries a fraction $x$ of the proton's momentum, elastic scattering off it requires exactly $\\nu = Q^2/2xM$. So Bjorken's $x$ *is* the parton's momentum fraction, and the rate as a function of $x$ maps out the [[?probability-density]] $f(x)$ of finding a parton with that fraction. Scaling is the signature of point-like partons: a point has no size to be resolved, so nothing changes as $Q^2$ grows.

**The simulation** fires electrons at a proton. In Feynman's frame you see the flattened proton and the one parton the virtual photon (the wavy line of a [[feynman-diagrams|Feynman diagram]]) knocks out; the read-out gives $Q^2$, $x$, the angle and the energy left. The histogram of $x$ builds up the structure function. Switch to a smooth proton without partons and hard scatters almost vanish as $Q^2$ grows — the form factor — while with partons they stay.

| Proton seen as | What large-$Q^2$ scattering does |
|---|---|
| A smooth ball of charge (form factor) | falls as $(1 + Q^2/0.71)^{-4}$: at 5 GeV², 4000 times weaker |
| Point-like partons (scaling) | depends only on $x$, not on $Q^2$ |

### Partons are quarks — and gluons
Curtis Callan and David Gross showed in 1969 that spin-½ partons give a simple relation between the two structure functions; the data agreed. Comparing electron with neutrino scattering in the early 1970s gave the partons' charges, $+\\tfrac23$ and $-\\tfrac13$: the quarks of Gell-Mann and Zweig. It also showed that the charged partons carry only about half of the proton's momentum; the rest belongs to neutral partons, the gluons. Scaling is not quite exact: it drifts slowly with $\\ln Q^2$, as quantum chromodynamics predicts through asymptotic freedom (David Gross, Frank Wilczek and David Politzer, 1973). Friedman, Kendall and Taylor shared the 1990 Nobel Prize in Physics.

> [!key] Scaling means point-like constituents. In a frame where the proton flies by, relativity freezes its partons, and an electron that transfers $Q^2$ and $\\nu$ picks out one parton carrying the fraction $x = Q^2/2M\\nu$ of the proton's momentum.
`,
  ideas: [
    'Elastic scattering off a smooth proton falls steeply with Q²; the SLAC inelastic rate did not — a sign of hard points inside.',
    'Q² = 4EE′ sin²(θ/2) and ν = E − E′ describe what the electron gave the proton; x = Q²/2Mν.',
    'Bjorken scaling: at large Q² the structure function depends only on x.',
    'Feynman: in a fast frame the proton is a flattened swarm of frozen, free partons; x is the momentum fraction of the struck parton.',
    'The partons are quarks (charges 2/3 and −1/3, spin ½) and gluons, which carry about half the momentum.'
  ],
  pitfalls: [
    'The parton picture says the proton is a bag of three free quarks — Partons are free only during the brief collision in a fast frame; at rest quarks are tightly bound and never escape. There are also sea quarks and gluons.',
    'x is the fraction of the proton\'s energy lost by the electron — x = Q²/2Mν is the momentum fraction of the struck parton; the energy the electron lost is ν.',
    'Scaling is exact — It is broken slowly, logarithmically in Q², exactly as quantum chromodynamics predicts.'
  ],
  formulas: [
    {
      name: 'Momentum transfer squared',
      expr: 'Q2 = 4*E*Ep*sin(theta/2)^2', tex: 'Q^2 = 4 E E\' \\sin^2\\frac{\\theta}{2}',
      vars: {
        Q2: { name: 'four-momentum transfer squared', q: false, unit: 'GeV²', tex: 'Q^2' },
        E: { name: 'beam energy', q: false, unit: 'GeV', value: 16 },
        Ep: { name: 'energy of the scattered electron', q: false, unit: 'GeV', value: 6, tex: 'E\'' },
        theta: { name: 'scattering angle', q: 'angle', unit: '°', value: 10, min: 0, max: 180, tex: '\\theta' }
      },
      note: 'Electron mass neglected (E ≫ 0.5 MeV). The resolution of the probe is about ħc/Q = 0.197 fm·GeV/Q.',
      stories: { Q2: 'Electrons of {E} scatter through {theta} and leave with {Ep}. What is Q²?', theta: 'At what angle must electrons of {E} scatter, leaving with {Ep}, to transfer {Q2}?' }
    },
    {
      name: 'Bjorken x: the momentum fraction of the struck parton',
      expr: 'x = Q2/(2*M*nu)', tex: 'x = \\dfrac{Q^2}{2 M \\nu}',
      vars: {
        x: { name: 'Bjorken x', min: 0, max: 1 },
        Q2: { name: 'four-momentum transfer squared', q: false, unit: 'GeV²', value: 3, tex: 'Q^2' },
        M: { name: 'proton mass (as an energy)', q: false, unit: 'GeV', value: 0.938 },
        nu: { name: 'energy lost by the electron, E − E′', q: false, unit: 'GeV', value: 10, tex: '\\nu' }
      },
      note: 'x = 1 is elastic scattering off the whole proton; in the parton picture x is the fraction of the proton\'s momentum carried by the struck parton.',
      stories: { x: 'An electron transfers {Q2} and loses {nu} to a proton. Which parton momentum fraction does it pick out?', nu: 'To hit partons with x = {x} at {Q2}, how much energy must the electron lose?' }
    },
    {
      name: 'Mass of the debris',
      expr: 'W = sqrt(M^2 + 2*M*nu - Q2)', tex: 'W = \\sqrt{M^2 + 2 M \\nu - Q^2}',
      vars: {
        W: { name: 'invariant mass of the hadrons produced', q: false, unit: 'GeV' },
        M: { name: 'proton mass (as an energy)', q: false, unit: 'GeV', value: 0.938 },
        nu: { name: 'energy lost by the electron', q: false, unit: 'GeV', value: 10, tex: '\\nu' },
        Q2: { name: 'four-momentum transfer squared', q: false, unit: 'GeV²', value: 3, tex: 'Q^2' }
      },
      note: 'W = M for elastic scattering; W above about 2 GeV (beyond the resonances) is the deep-inelastic region.',
      stories: { W: 'With {nu} transferred at {Q2}, what mass of debris is produced?' }
    }
  ],
  examples: [
    {
      title: 'One SLAC event',
      q: 'Electrons of 16 GeV scatter through 10° and leave with 6 GeV. Find $Q^2$, $\\nu$, $x$ and $W$.',
      steps: [
        '$Q^2 = 4 \\times 16 \\times 6 \\times \\sin^2 5° = 384 \\times 0.00760 = 2.92$ GeV².',
        '$\\nu = 16 - 6 = 10$ GeV.',
        '$x = 2.92/(2 \\times 0.938 \\times 10) = 0.156$.',
        '$W = \\sqrt{0.880 + 18.76 - 2.92} = \\sqrt{16.7} = 4.09$ GeV.'
      ],
      a: '$Q^2 = 2.9$ GeV², $x = 0.16$, and a spray of hadrons of total mass 4.1 GeV: deep inelastic.'
    },
    {
      title: 'Why a smooth proton would hide at large Q²',
      q: 'By what factor does the dipole form factor squared, $G^2 = (1 + Q^2/0.71)^{-4}$, suppress elastic scattering at $Q^2 = 5$ GeV²?',
      steps: ['$1 + 5/0.71 = 8.04$.', '$8.04^{-4} = 2.4\\times10^{-4}$.'],
      a: 'About 4000 times weaker than off a point. The inelastic rate at fixed x showed no such fall.'
    },
    {
      title: 'A proton frozen by time dilation',
      q: 'A proton has an energy of 100 GeV. By what factor are its thickness and the pace of its internal motions changed?',
      steps: ['$\\gamma = E/Mc^2 = 100/0.938 = 107$.', 'Its thickness along the motion shrinks from about 1.7 fm to 0.016 fm.', 'Internal motions that take about $3\\times10^{-24}$ s at rest take about $3.2\\times10^{-22}$ s: the partons hardly move while the electron passes.'],
      a: 'Flattened and slowed about 107 times — the partons look free and frozen.'
    }
  ],
  quiz: [
    { q: 'What in the SLAC–MIT data pointed to point-like constituents?', choices: ['The inelastic rate at large Q² fell far more slowly than elastic scattering off a smooth proton', 'Electrons bounced straight back', 'The proton turned out to be empty', 'The electrons lost no energy'], a: 0, why: 'A smooth charge distribution has a form factor that kills large-Q² scattering; points do not.' },
    { q: 'In the parton picture, what does Bjorken x measure?', choices: ['the fraction of the proton\'s momentum carried by the struck parton', 'the scattering angle', 'the charge of the parton', 'the energy of the beam'], a: 0, why: 'Elastic scattering off a free parton of momentum xP requires ν = Q²/2xM.' },
    { q: 'Feynman\'s argument uses a frame in which the proton moves very fast, so that time dilation freezes the motion of its partons during the collision.', a: true, why: 'Internal interactions are slowed by γ while the collision is short: the partons act as free particles.' },
    { q: 'Compared with a proton at rest, a proton moving with γ = 100 looks…', choices: ['100 times thinner along its motion, with internal motions 100 times slower', '100 times larger', 'unchanged', 'round, but with its partons moving faster'], a: 0, why: 'Lorentz contraction and time dilation, both by γ.' },
    { q: 'An electron of 20 GeV scatters to 8 GeV at 6°. What is Q², in GeV²?', answer: 1.75, why: '4 × 20 × 8 × sin²3° = 640 × 0.00274 = 1.75 GeV².' }
  ],
  problems: [
    { q: 'For the event of 20 GeV → 8 GeV at 6° (Q² = 1.75 GeV²), what is Bjorken x?', answer: 0.078, tol: 0.02,
      steps: ['$\\nu = 20 - 8 = 12$ GeV.', '$x = 1.75/(2 \\times 0.938 \\times 12) = 0.078$.'] },
    { q: 'To probe partons with x = 0.25 at Q² = 4 GeV², how much energy (GeV) must the electron lose?', answer: 8.53, unit: 'GeV', tol: 0.02,
      steps: ['$\\nu = Q^2/(2Mx) = 4/(2 \\times 0.938 \\times 0.25) = 8.53$ GeV.'] }
  ],
  applications: [
    'Parton distribution functions, measured in deep inelastic scattering, are used to predict every collision at the Large Hadron Collider.',
    'The same kind of experiment with neutrinos and muons measured the quark charges and showed that gluons carry about half the proton\'s momentum.',
    'Electron–proton colliders (HERA, 1992–2007) extended the measurements to x below 10⁻⁴, where gluons dominate.'
  ],
  history: 'Hofstadter measured the size of the proton in the 1950s (Nobel Prize 1961). SLAC\'s linear accelerator started in 1966; the MIT–SLAC inelastic results were first presented in 1968 and published in 1969. Bjorken proposed scaling in 1968; Feynman introduced partons in "Very High-Energy Collisions of Hadrons" (*Physical Review Letters*, 1969), and Bjorken and Emmanuel Paschos applied them to electron scattering the same year. Feynman developed the model in *Photon-Hadron Interactions* (1972). Gross, Wilczek and Politzer explained scaling and its slow violation with asymptotic freedom in 1973 (Nobel Prize 2004); Friedman, Kendall and Taylor received the Nobel Prize in 1990.',
  sources: [
    'R. P. Feynman, "Very High-Energy Collisions of Hadrons", *Physical Review Letters* 23 (1969) — the parton picture of a fast-moving hadron.',
    '*Photon-Hadron Interactions* (1972) — Feynman\'s lectures on deep inelastic scattering and the parton model.',
    '*QED: The Strange Theory of Light and Matter*, ch. 4 (Loose Ends) — Feynman\'s sketch of quarks and gluons for a general audience.'
  ],
  sim: 'fr-partons'
}

);

Hyper.add(

{
  id: 'challenger-o-ring', parent: 'feynman-ideas', title: 'The Challenger O-ring', level: 1,
  short: 'Challenger broke apart 73 seconds after launch on 28 January 1986, and its seven astronauts died. On the investigating commission, Feynman showed with a clamp and a glass of iced water why cold rubber could not seal the booster joint — and why a claimed 1-in-100 000 chance of disaster was wishful thinking.',
  keywords: ['Challenger', 'Space Shuttle', 'STS-51-L', 'O-ring', 'Rogers Commission', 'iced water', 'resilience', 'rubber', 'temperature', 'solid rocket booster', 'field joint', 'reliability', 'probability of failure', 'Appendix F', 'safety factor', 'Columbia'],
  prereq: ['cargo-cult-science', 'probability-feyn', 'elasticity-feyn'],
  related: ['doubt-and-uncertainty', 'feynman-life', 'physics:stress-strain', 'math:binomial-distribution', 'math:probability-basics', 'chemistry:polymers', 'hydraulics:seals'],
  body: `
On 28 January 1986 the Space Shuttle *Challenger* (mission STS-51-L, the 25th Shuttle flight) lifted off from Kennedy Space Center and broke apart 73 seconds later over the Atlantic. The seven people on board died: commander **Francis R. (Dick) Scobee**, pilot **Michael J. Smith**, mission specialists **Judith A. Resnik**, **Ellison S. Onizuka** and **Ronald E. McNair**, and payload specialists **Gregory B. Jarvis** and **Christa McAuliffe**, a New Hampshire schoolteacher chosen to be the first teacher in space. A presidential commission chaired by William P. Rogers, with Neil Armstrong, Sally Ride, General Donald Kutyna and Feynman among its members, investigated.

### The joint
The solid rocket boosters were built from steel segments. At every *field joint* a tongue ("tang") on one segment slid into a fork ("clevis") on the next, and the gap was sealed by two rubber O-rings about 7 mm thick. At ignition the pressure inside rises to tens of atmospheres within a fraction of a second, the case bulges, and the joint *rotates*: the gap opens by a fraction of a millimetre. To keep sealing, the squeezed rubber must spring back into the widening gap at once.

Rubber is a tangle of long molecules: warm, it recovers from a squeeze almost at once; cold, it springs back sluggishly — it loses its *resilience*. At launch the air was about 2 °C (36 °F), some 8 °C colder than for any earlier flight. The coldest earlier launch, in January 1985 at about 12 °C, had shown the worst *blow-by* yet: hot gas getting past a primary O-ring. The night before, engineers at the booster maker Morton Thiokol, among them Roger Boisjoly and Arnold Thompson, argued against launching so cold; after NASA managers pushed back, their managers reversed the recommendation.

Less than a second after ignition, puffs of dark smoke came from the aft field joint of the right booster; at about 58 seconds a flame appeared there, burned into the external tank, and the vehicle was torn apart. **The O-ring simulation** shows the joint in section: choose the temperature, fire the booster and watch whether the rubber follows the gap before the hot gas arrives.

### A glass of iced water
On 11 February 1986, at a public hearing of the commission, Feynman squeezed a piece of the O-ring rubber in a small C-clamp and put it into the glass of iced water in front of him. When he released the clamp the rubber did not spring back: at 0 °C it stayed deformed for some seconds. (In *What Do You Care What Other People Think?* he tells how General Kutyna had nudged him towards the cold.) **Try it in the simulation** at different temperatures.

### Erosion is not a safety factor
Officials had described earlier erosion of up to a third of an O-ring's thickness as a *safety factor* of three. Feynman's objection: a safety factor is the margin by which a structure that works as designed exceeds its load, like a bridge built for three times its traffic. The O-rings were never meant to erode at all; erosion showed that the design was not behaving as understood, and nothing guaranteed it would stop at a third next time.

### 1 in 100, or 1 in 100 000?
He found estimates of the chance of losing a Shuttle ranging from about 1 in 100 among working engineers to 1 in 100 000 among managers. Experience sided with the engineers: of nearly 2900 solid-rocket flights reviewed by the range safety officer, 121 had failed. At 1 in 100 000 one could launch every day for about 300 years before expecting a loss. Risks compound over many flights: the [[?probability]] of at least one loss in $N$ flights,

$$P = 1 - (1-p)^N,$$

grows with every flight ($(1-p)^N$ is the chance that all $N$ succeed). **The risk simulation** flies the programme again and again with the chance per flight you choose.

| Chance per flight $p$ | At least one loss in 25 flights | In 135 flights |
|---|---|---|
| 1 in 100 000 (management) | 0.025 % | 0.13 % |
| 1 in 100 (engineers) | 22 % | 74 % |
| Actual record, 1981–2011 | 1 (Challenger) | 2 (with Columbia, 2003) |

### Appendix F
Feynman's "Personal Observations on the Reliability of the Shuttle" became Appendix F of the commission's report (June 1986). Its moral runs through this whole branch: engineering has to be judged by what nature does, whatever anyone would like it to do.

> [!key] Cold rubber cannot spring back fast enough to follow a joint that opens in a fraction of a second. And risks compound: at 1 in 100 per flight, a loss within a hundred flights is more likely than not.
`,
  ideas: [
    'The booster field joints were sealed by rubber O-rings that had to follow a gap opening within a fraction of a second at ignition.',
    'Cold rubber loses resilience: it springs back slowly. Challenger was launched at about 2 °C, colder than any earlier flight.',
    'Feynman\'s iced-water demonstration (11 February 1986) showed the loss of resilience with a clamp and a glass of water.',
    'Erosion of a part not designed to erode is a warning, not a safety factor.',
    'The chance of at least one loss in N flights is 1 − (1 − p)^N: at 1 in 100 per flight, 22 % in 25 flights; the actual record was 2 losses in 135.'
  ],
  pitfalls: [
    'Previous flights survived erosion, so erosion was safe — Success with an unexplained anomaly shows only that the margin was not exceeded yet; the extent of erosion was not predictable.',
    'A 1-in-100 000 chance per flight makes a loss impossible in practice — The figure had no basis in experience; at the engineers\' 1 in 100, a loss in a programme of a hundred flights was more likely than not.',
    'The O-rings failed because they were too small — They failed because cold rubber could not recover fast enough as the joint opened; the joints were redesigned with a capture feature, a third O-ring and heaters.'
  ],
  formulas: [
    {
      name: 'Chance of at least one loss in N flights',
      expr: 'P = 1 - (1 - p)^N', tex: 'P = 1 - (1 - p)^{N}',
      vars: {
        P: { name: 'chance of at least one loss', q: 'ratio', unit: '%' },
        p: { name: 'chance of loss on one flight', q: 'ratio', unit: '%', value: 1, min: 0, max: 100 },
        N: { name: 'number of flights', q: 'count', value: 25, int: true }
      },
      note: 'Flights assumed independent with the same p. (1 − p)^N is the chance that every flight succeeds.',
      stories: { P: 'Each flight has a {p} chance of loss. What is the chance of at least one loss in {N} flights?', p: 'A programme of {N} flights should have at most a {P} chance of any loss. What chance per flight is allowed?', N: 'With {p} per flight, after how many flights has the chance of at least one loss reached {P}?' }
    },
    {
      name: 'Expected number of losses',
      expr: 'n = N*p', tex: 'n = N p',
      vars: {
        n: { name: 'expected number of losses' },
        N: { name: 'number of flights', q: 'count', value: 135, int: true },
        p: { name: 'chance of loss on one flight', q: 'ratio', unit: '%', value: 1 }
      },
      note: 'The average over many imagined programmes; the actual number is random (binomial).',
      stories: { n: 'How many losses would you expect in {N} flights at {p} each?', p: 'A programme lost {n} vehicles in {N} flights. What chance per flight does that suggest?' }
    },
    {
      name: 'Time to the first expected loss',
      expr: 'T = 1/(p*f)', tex: 'T = \\dfrac{1}{p f}',
      vars: {
        T: { name: 'time for one expected loss', q: 'time', unit: 'yr' },
        p: { name: 'chance of loss on one flight', q: 'ratio', unit: '%', value: 0.001 },
        f: { name: 'flights per year', q: 'rate', unit: '1/yr', value: 365 }
      },
      note: 'At 1 in 100 000 (0.001 %) and a launch every day: about 270 years — roughly the 300 years Feynman\'s appendix mentions.',
      stories: { T: 'With a {p} chance of loss per flight and {f} flights a year, how long until one loss is expected?' }
    }
  ],
  examples: [
    {
      title: 'Twenty-five flights',
      q: 'Challenger\'s was the 25th Shuttle flight. What is the chance of at least one loss in 25 flights if the chance per flight is 1 in 100? And if it is 1 in 100 000?',
      steps: ['At 1 in 100: $(0.99)^{25} = 0.778$, so $P = 1 - 0.778 = 0.22$.', 'At 1 in 100 000: $(1 - 10^{-5})^{25} \\approx 1 - 25\\times10^{-5}$, so $P \\approx 2.5\\times10^{-4}$ (for small $p$, $(1-p)^N \\approx 1 - Np$, a [[?small-approximation]]).'],
      a: '22 % against 0.025 % — a factor of almost 900.'
    },
    {
      title: 'Three hundred years of daily launches',
      q: 'At 1 in 100 000 per flight and one launch a day, how long until one loss is expected?',
      steps: ['Expected losses per year: $365 \\times 10^{-5} = 3.65\\times10^{-3}$.', 'Time for one: $1/3.65\\times10^{-3} = 274$ years.'],
      a: 'About 270 years — roughly the 300 years Feynman used to show how implausible the figure was.'
    },
    {
      title: 'What the record says',
      q: 'The Shuttle flew 135 times and two orbiters were lost. How does that compare with p = 1/100 and p = 1/100 000?',
      steps: [
        'Observed rate: $2/135 = 1.5$ %, about 1 in 68.',
        'At $p = 0.01$: expected losses $135 \\times 0.01 = 1.35$; the chance of two or more is $1 - 0.99^{135} - 135 \\times 0.01 \\times 0.99^{134} = 1 - 0.257 - 0.351 = 0.39$.',
        'At $p = 10^{-5}$: the chance of two or more is about $\\binom{135}{2} \\times 10^{-10} = 9\\times10^{-7}$.'
      ],
      a: 'Two losses are quite ordinary at 1 in 100 and essentially impossible at 1 in 100 000.'
    }
  ],
  quiz: [
    { q: 'Why does cold matter for an O-ring seal?', choices: ['Cold rubber recovers its shape slowly, so it cannot follow a gap that opens in a fraction of a second', 'Cold makes the rubber shrink until it falls out', 'Cold rubber conducts heat to the propellant', 'Cold raises the pressure inside the booster'], a: 0, why: 'Resilience — the speed of springing back — falls steeply as rubber is cooled.' },
    { q: 'With a 1-in-100 chance of loss per flight, the chance of at least one loss in 25 flights is about…', choices: ['22 %', '1 %', '25 %', '0.025 %'], a: 0, why: '1 − 0.99²⁵ = 0.22. (25 % would be the naive sum, which overcounts.)' },
    { q: 'Feynman agreed that erosion of a third of an O-ring showed a safety factor of three.', a: false, why: 'He pointed out that the rings were not designed to erode at all: erosion was evidence that the design was not working as understood.' },
    { q: 'A claimed 1-in-100 000 chance of loss per flight, with one launch every day, means one loss expected in about…', choices: ['300 years', '3 years', '30 years', '30 000 years'], a: 0, why: '1/(10⁻⁵ × 365) ≈ 274 years.' },
    { q: 'The Shuttle flew 135 times and two were lost. What was the observed loss rate per flight, in per cent?', answer: 1.48, why: '2/135 = 0.0148 = 1.48 %, about 1 in 68 — close to the engineers\' estimate.' }
  ],
  problems: [
    { q: 'With a chance of 1 in 100 per flight, after how many flights does the chance of at least one loss reach 50 %?', answer: 69, tol: 0.02, hint: 'Solve (0.99)^N = 0.5 with logarithms.',
      steps: ['$N = \\ln 0.5/\\ln 0.99 = -0.693/-0.01005 = 69$.'] },
    { q: 'If the chance of loss per flight really were 1 in 100 000, what would be the chance (in per cent) of at least one loss in 135 flights?', answer: 0.135, tol: 0.02,
      steps: ['$P = 1 - (1 - 10^{-5})^{135} \\approx 135\\times10^{-5} = 1.35\\times10^{-3}$.', 'That is 0.135 %.'] }
  ],
  applications: [
    'Probabilistic risk assessment, standard today for spacecraft, reactors and aircraft, was strengthened in NASA after Challenger.',
    'Every elastomer seal is specified with a lowest service temperature, below which it loses resilience — see [[hydraulics:seals|seals and leakage]].',
    'The sociologist Diane Vaughan\'s study *The Challenger Launch Decision* (1996) described the "normalisation of deviance": small anomalies becoming accepted as normal.'
  ],
  history: 'The Rogers Commission was appointed in February 1986 and reported in June 1986; Feynman\'s appendix was included as Appendix F. The booster joints were redesigned with a capture feature that limits joint rotation, a third O-ring and joint heaters, and Shuttle flights resumed with *Discovery* on 29 September 1988. *Columbia* was lost on re-entry on 1 February 2003, on the 113th Shuttle flight, and the programme ended in 2011 after 135 flights.',
  sources: [
    'Appendix F, "Personal Observations on the Reliability of the Shuttle", in the *Report of the Presidential Commission on the Space Shuttle Challenger Accident* (the Rogers Commission report, June 1986) — the range of failure estimates, erosion as a warning rather than a safety factor, the main engines and the avionics.',
    '*What Do You Care What Other People Think?* (1988), the second part of the book — Feynman\'s account of the commission\'s work and of the iced-water demonstration.',
    '*The Pleasure of Finding Things Out* (1999) — reprints his report on the Shuttle\'s reliability.',
    '"Cargo Cult Science" (Caltech commencement address, 1974) — the integrity of reporting everything that could make you wrong, which the appendix applies to engineering.'
  ],
  sim: ['fr-oring', 'fr-risk']
},

{
  id: 'feynman-life', parent: 'feynman-ideas', title: 'Richard Feynman\'s life in physics', level: 1,
  short: 'From Far Rockaway to Caltech: least action and the path integral, Los Alamos, the diagrams of quantum electrodynamics, superfluid helium, the weak interaction, the Lectures, partons, computers and the Challenger inquiry — a timeline of Feynman\'s physics.',
  keywords: ['Feynman biography', 'timeline', 'MIT', 'Princeton', 'Wheeler', 'Los Alamos', 'Cornell', 'Caltech', 'Nobel Prize 1965', 'Tomonaga', 'Schwinger', 'Dyson', 'Feynman Lectures', 'Messenger Lectures', 'Surely You\'re Joking', 'Arline'],
  prereq: ['basic-physics', 'doubt-and-uncertainty'],
  related: ['path-integral', 'feynman-diagrams', 'superfluid-helium', 'weak-interaction-v-a', 'room-at-the-bottom', 'parton-model', 'quantum-computing-origin', 'challenger-o-ring', 'cargo-cult-science', 'least-action-mechanics'],
  body: `
Richard Phillips Feynman was born on 11 May 1918 in New York and grew up in Far Rockaway, Queens. In the BBC interview *The Pleasure of Finding Things Out* (1981) and in *What Do You Care What Other People Think?* he credited his father, Melville, who worked in the uniform business, with teaching him to look past the names of things to what they do. His high-school physics teacher, Mr Bader, showed him the principle of least action — a moment he recalls at the start of the lecture on least action in volume II of the *Lectures*. The [[?action]] and its [[?stationary]] paths stayed with him for life.

### MIT and Princeton (1935–1942)
At MIT his undergraduate thesis gave the *Hellmann–Feynman theorem* on the forces in molecules (1939). At Princeton, with John Wheeler, he worked on a theory in which charges act on each other directly, with no field of their own, and in his thesis, *The Principle of Least Action in Quantum Mechanics* (1942), he turned a remark of Dirac's about the Lagrangian into a new formulation of quantum mechanics: every path contributes an [[?amplitude]]. In 1942 he married Arline Greenbaum.

### Los Alamos (1943–1945)
In Hans Bethe's theoretical division he worked on the efficiency of the bomb (the Bethe–Feynman formula) and led a group that organised large calculations on punched-card machines. He saw the Trinity test on 16 July 1945. Arline died of tuberculosis in June 1945. He told his memories of the laboratory in the talk "Los Alamos from Below" (1975) and in *Surely You're Joking, Mr. Feynman!*.

### Cornell and quantum electrodynamics (1945–1950)
At Cornell he developed his space-time view: the path integral (*Reviews of Modern Physics*, 1948) and, for electrons and photons, the diagrams that bear his name ("The Theory of Positrons" and "Space-Time Approach to Quantum Electrodynamics", 1949). Freeman Dyson showed in 1949 that Feynman's method and those of Julian Schwinger and Sin-Itiro Tomonaga give the same theory; Feynman's diagrams became the working language of particle physics.

### Caltech (1950–1988)
From 1950 he was at Caltech (with a year in Brazil, 1951–52). The frontiers of this branch followed one another: the atomic theory of superfluid helium (1953–56), the V − A law with Murray Gell-Mann (1958), "There's Plenty of Room at the Bottom" (1959), the introductory course of 1961–63 that became *The Feynman Lectures on Physics*, lectures on gravitation (1962–63), the Messenger Lectures at Cornell (1964), partons (1968–69), "Cargo Cult Science" (1974), the Auckland lectures on QED (1979), quantum computers and the physics of computation (1981–86), and the Challenger commission (1986). He shared the 1965 Nobel Prize in Physics with Tomonaga and Schwinger. He died in Los Angeles on 15 February 1988, after a long illness with cancer.

**The timeline simulation** lays these out on three tracks — life, research, teaching and books. Drag along it or step from event to event; each card says what happened and where to read about it.

| Years | Where | Physics |
|---|---|---|
| 1935–39 | MIT | forces in molecules |
| 1939–42 | Princeton | least action in quantum mechanics |
| 1943–45 | Los Alamos | bomb efficiency, computing |
| 1945–50 | Cornell | path integrals, diagrams, QED |
| 1950–88 | Caltech | helium, V − A, nanotechnology, the *Lectures*, partons, computation, Challenger |

### The thread
What ties the pages of this app together is a way of working: take nothing on authority, work a problem out your own way and check it against nature, find the simplest honest picture and follow it — and enjoy it. His own books of stories, told with Ralph Leighton (*Surely You're Joking*, 1985; *What Do You Care*, 1988), show the same curiosity turned on everything from safes to drums to painting. His honours included the Albert Einstein Award (1954), the E. O. Lawrence Award (1962), the Oersted Medal for teaching (1972) and the National Medal of Science (1979).

> [!key] One idea runs from Mr Bader's lesson to the Nobel Prize: nature's laws can be stated for whole paths at once. Feynman made that idea quantum — every path an arrow — and drew it as diagrams.
`,
  ideas: [
    'Born 1918 in New York; MIT (1939), PhD at Princeton under John Wheeler (1942) on least action in quantum mechanics.',
    'Los Alamos 1943–45; Cornell 1945–50, where path integrals and Feynman diagrams were born; Caltech from 1950.',
    'Nobel Prize 1965 with Tomonaga and Schwinger for quantum electrodynamics.',
    'Beyond QED: superfluid helium, V − A, nanotechnology, the Lectures, partons, quantum computers, the Challenger inquiry.',
    'A way of working: find your own simplest picture, check it against nature, doubt, and enjoy finding things out.'
  ],
  pitfalls: [
    'Feynman invented quantum electrodynamics alone — Schwinger and Tomonaga reached the same theory by other methods, and Dyson showed they were equivalent; the three shared the Nobel Prize.',
    'The Feynman Lectures were written as a textbook — They are edited transcripts (by Robert Leighton and Matthew Sands) of a course he gave to Caltech freshmen and sophomores in 1961–63.',
    'His famous stories are the whole Feynman — The anecdotes of his memoirs sit on top of four decades of hard technical work, much of it summarised on this branch.'
  ],
  examples: [
    {
      title: 'Following one idea through a life',
      q: 'Trace the principle of least action through Feynman\'s work, with dates.',
      steps: [
        'High school, in the 1930s: Mr Bader shows him the principle of least action (recalled in *Lectures* Vol. II, ch. 19).',
        '1942: his Princeton thesis makes quantum mechanics out of the action — each path gets an arrow of phase $S/\\hbar$.',
        '1948: "Space-Time Approach to Non-Relativistic Quantum Mechanics" publishes the sum over paths.',
        '1949: the same space-time view gives his diagrams for electrons and photons.',
        '1965: the Nobel lecture tells this story; 1985: *QED* tells it to everyone with stopwatch arrows.'
      ],
      a: 'One thread from a classroom to the Nobel Prize — see [[least-action-mechanics]], [[path-integral]] and [[arrow-rule]].'
    },
    {
      title: 'A reading path',
      q: 'You want to hear Feynman himself on quantum mechanics, from easiest to hardest. In what order could you read?',
      steps: [
        '*QED: The Strange Theory of Light and Matter* (1985) — no equations, the arrows.',
        '*The Character of Physical Law*, lecture 6 (1964) — probability and uncertainty for a general audience.',
        '*The Feynman Lectures on Physics*, Vol. III, ch. 1–3 — the two-slit experiment and the rules of amplitudes.',
        '*Quantum Mechanics and Path Integrals* (with A. R. Hibbs, 1965) — the full formalism.'
      ],
      a: 'From the arrows to the path integral; this app follows the same route in its quantum branches.'
    }
  ],
  quiz: [
    { q: 'Feynman shared the 1965 Nobel Prize in Physics with…', choices: ['Sin-Itiro Tomonaga and Julian Schwinger', 'Murray Gell-Mann and George Zweig', 'Hans Bethe and Freeman Dyson', 'T. D. Lee and C. N. Yang'], a: 0, why: 'The prize was for quantum electrodynamics, reached independently by the three.' },
    { q: 'His doctoral thesis (Princeton, 1942) was on…', choices: ['the principle of least action in quantum mechanics', 'superfluid helium', 'the efficiency of the atomic bomb', 'the parton model'], a: 0, why: 'It contains the seed of the path integral.' },
    { q: 'The Feynman Lectures on Physics grew out of the introductory course he gave at Caltech in 1961–63.', a: true, why: 'They were recorded and edited by Robert Leighton and Matthew Sands, and published in 1963–65.' },
    { q: 'Which order is right?', choices: ['path integrals (1948), V − A (1958), Plenty of Room (1959), partons (1969)', 'V − A (1958), path integrals (1948), partons (1969), Plenty of Room (1959)', 'Plenty of Room (1959), partons (1969), path integrals (1948), V − A (1958)', 'path integrals (1948), partons (1969), V − A (1958), Plenty of Room (1959)'], a: 0, why: 'See the timeline: 1948, 1958, 1959, 1969.' },
    { q: 'Who showed in 1949 that Feynman\'s diagrams and the methods of Schwinger and Tomonaga give the same quantum electrodynamics?', choices: ['Freeman Dyson', 'Hans Bethe', 'John Wheeler', 'Paul Dirac'], a: 0, why: 'Dyson\'s 1949 papers made Feynman\'s methods the standard.' }
  ],
  applications: [
    'Feynman diagrams are used daily in particle physics, condensed matter and quantum chemistry.',
    'Path integrals underlie quantum field theory, statistical mechanics and quantum Monte Carlo methods.',
    'The *Lectures* remain free to read at feynmanlectures.caltech.edu, and his public lectures (Messenger, 1964; Auckland, 1979) were filmed.'
  ],
  history: 'Feynman\'s life is told in his own books of stories (*Surely You\'re Joking, Mr. Feynman!*, 1985; *What Do You Care What Other People Think?*, 1988, both with Ralph Leighton) and in biographies such as James Gleick\'s *Genius* (1992) and Jagdish Mehra\'s *The Beat of a Different Drum* (1994). Posthumous books include *Feynman Lectures on Gravitation* (1995), *Feynman Lectures on Computation* (1996), *Feynman\'s Lost Lecture* (1996, on a lecture of March 1964) and *The Meaning of It All* (1998, lectures of 1963).',
  sources: [
    '"The Development of the Space-Time View of Quantum Electrodynamics" — Nobel lecture, Stockholm, 11 December 1965: how the ideas grew, from Wheeler and Dirac to the diagrams.',
    '*Surely You\'re Joking, Mr. Feynman!* (1985) — his stories, including Los Alamos and Brazil.',
    '*What Do You Care What Other People Think?* (1988) — his father, Arline, and the Challenger commission.',
    '*The Pleasure of Finding Things Out* (BBC Horizon interview, 1981; essay collection, 1999).',
    '*The Feynman Lectures on Physics*, Vol. II, ch. 19 (The Principle of Least Action) — the lecture that opens with Mr Bader.'
  ],
  sim: 'fr-timeline'
}

);
